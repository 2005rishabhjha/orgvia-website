// Vercel serverless function: receives demo/contact enquiries.
//
// Preferred path (system of record): forward to the OrgVia API, which stores the
// enquiry in PostgreSQL for Super Admin > Sales. Enabled when both are set:
//   ORGVIA_API_URL        e.g. https://orgvia-api.example.com  (no trailing slash)
//   ENQUIRY_INGEST_KEY    the same value as the API's ENQUIRY_INGEST_KEY
// Optional notification after persistence, via Resend:
//   RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL ("OrgVia Website <enquiries@your-domain>")
// It reports success only once the API has stored the enquiry (201). Notification
// delivery is deliberately best-effort and can never discard an already saved lead.

const hits = new Map(); // best-effort per-instance limiter; add an edge/WAF rule for strict limits
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SIZES = new Set(['1–25', '26–100', '101–500', '501–2,000', '2,000+']);

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const employeeCount = (v) => {
  const value = clean(v, 12);
  if (!value || !/^[1-9]\d{0,5}$/.test(value)) return null;
  return Number(value);
};

function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_HITS;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'Method not allowed.' }); }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && new URL(origin).host !== host) return res.status(403).json({ ok: false, error: 'Forbidden.' });

  const { RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL, ORGVIA_API_URL, ENQUIRY_INGEST_KEY } = process.env;
  const apiConfigured = Boolean(ORGVIA_API_URL && ENQUIRY_INGEST_KEY);
  const emailConfigured = Boolean(RESEND_API_KEY && ENQUIRY_TO_EMAIL && ENQUIRY_FROM_EMAIL);
  if (!apiConfigured) return res.status(503).json({ ok: false, error: 'Enquiries are not available right now.' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ ok: false, error: 'Too many requests.' });

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  // Honeypot filled or form submitted implausibly fast: pretend success, send nothing.
  if (clean(b.website, 50) || (Number(b.ts) >= 0 && Number(b.ts) < 1500)) return res.status(200).json({ ok: true });

  const d = {
    name: clean(b.name, 120), email: clean(b.email, 200), organization: clean(b.organization, 160),
    teamSize: clean(b.teamSize, 20), phone: clean(b.phone, 40), message: clean(b.message, 2000).slice(0, 2000),
    plan: clean(b.plan, 60), billing: clean(b.billing, 30), employees: clean(b.employees, 12),
  };
  if (!d.name || !d.organization || !EMAIL_RE.test(d.email) || !SIZES.has(d.teamSize)) return res.status(400).json({ ok: false, error: 'Please complete name, work email, organization and team size.' });

  try {
    const count = employeeCount(d.employees);
    const pricingContext = count ? `Pricing calculator headcount: ${count} employees.` : '';
    const r = await fetch(`${ORGVIA_API_URL.replace(/\/+$/, '')}/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Enquiry-Key': ENQUIRY_INGEST_KEY, 'X-Enquiry-Client-Ip': ip },
      body: JSON.stringify({ name: d.name, email: d.email, organization: d.organization, teamSize: d.teamSize, phone: d.phone || null, message: [d.message, pricingContext].filter(Boolean).join('\n\n') || null, selectedPlan: d.plan ? d.plan.toLowerCase() : null, billingCycle: d.billing ? d.billing.toLowerCase() : null, kind: b.kind === 'pricing' || b.kind === 'contact' ? b.kind : 'demo' }),
    });
    if (r.status === 429) return res.status(429).json({ ok: false, error: 'Too many requests.' });
    if (r.status !== 201) {
      console.error('enquiry API rejected', r.status);
      return res.status(502).json({ ok: false, error: 'Your request could not be recorded.' });
    }
  } catch (e) {
    console.error('enquiry API error', e.message);
    return res.status(502).json({ ok: false, error: 'Your request could not be recorded.' });
  }

  if (!emailConfigured) return res.status(200).json({ ok: true });

  const rows = [['Name', d.name], ['Email', d.email], ['Organization', d.organization], ['Team size', d.teamSize], ['Selected plan', d.plan || '-'], ['Billing preference', d.billing || '-'], ['Pricing calculator employees', d.employees || '-'], ['Phone', d.phone || '-'], ['Message', d.message || '-']];
  const html = `<table cellpadding="6">${rows.map(([k, v]) => `<tr><th align="left" valign="top">${k}</th><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: ENQUIRY_FROM_EMAIL, to: [ENQUIRY_TO_EMAIL], reply_to: d.email, subject: `OrgVia enquiry: ${d.organization} (${d.teamSize})`, html }),
    });
    if (!r.ok) console.error('enquiry delivery failed', r.status);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('enquiry delivery error', e.message);
    return res.status(200).json({ ok: true });
  }
}
