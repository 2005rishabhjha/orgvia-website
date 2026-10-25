// Vercel serverless function: receives demo/contact enquiries and emails them
// to the OrgVia team through Resend. It never reports success unless the
// provider accepted the message. Required env vars:
//   RESEND_API_KEY      provider key
//   ENQUIRY_TO_EMAIL    destination inbox
//   ENQUIRY_FROM_EMAIL  verified sender, e.g. "OrgVia Website <enquiries@your-domain>"
// If any is missing the endpoint answers 503 and the form tells the visitor so.

const hits = new Map(); // best-effort per-instance limiter; add an edge/WAF rule for strict limits
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SIZES = new Set(['1–25', '26–100', '101–500', '501–2,000', '2,000+']);

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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

  const { RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !ENQUIRY_TO_EMAIL || !ENQUIRY_FROM_EMAIL) return res.status(503).json({ ok: false, error: 'Enquiries are not available right now.' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ ok: false, error: 'Too many requests.' });

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  // Honeypot filled or form submitted implausibly fast: pretend success, send nothing.
  if (clean(b.website, 50) || (Number(b.ts) >= 0 && Number(b.ts) < 1500)) return res.status(200).json({ ok: true });

  const d = {
    name: clean(b.name, 120), email: clean(b.email, 200), organization: clean(b.organization, 160),
    teamSize: clean(b.teamSize, 20), phone: clean(b.phone, 40), message: clean(b.message, 2000).slice(0, 2000),
  };
  if (!d.name || !d.organization || !EMAIL_RE.test(d.email) || !SIZES.has(d.teamSize)) return res.status(400).json({ ok: false, error: 'Please complete name, work email, organization and team size.' });

  const rows = [['Name', d.name], ['Email', d.email], ['Organization', d.organization], ['Team size', d.teamSize], ['Phone', d.phone || '-'], ['Message', d.message || '-']];
  const html = `<table cellpadding="6">${rows.map(([k, v]) => `<tr><th align="left" valign="top">${k}</th><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: ENQUIRY_FROM_EMAIL, to: [ENQUIRY_TO_EMAIL], reply_to: d.email, subject: `OrgVia enquiry: ${d.organization} (${d.teamSize})`, html }),
    });
    if (!r.ok) { console.error('enquiry delivery failed', r.status); return res.status(502).json({ ok: false, error: 'Delivery failed.' }); }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('enquiry delivery error', e.message);
    return res.status(502).json({ ok: false, error: 'Delivery failed.' });
  }
}
