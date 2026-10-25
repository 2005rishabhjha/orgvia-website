// Site configuration and shared layout. URLs are overridable at build time.
export const SITE = {
  name: 'OrgVia',
  url: (process.env.SITE_URL || 'https://orgvia.rishabh.codes').replace(/\/$/, ''),
  appUrl: process.env.APP_URL || 'https://orgvia-app.rishabh.codes',
  updated: '2026-10-26',
};

export const NAV = [
  ['/product/', 'Product'],
  ['/features/', 'Features'],
  ['/solutions/', 'Solutions'],
  ['/pricing/', 'Pricing'],
  ['/about/', 'Company'],
];

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const logo = (cls = '') =>
  `<a class="brand ${cls}" href="/" aria-label="OrgVia home"><picture><source srcset="/assets/img/orgvia-logo.webp" type="image/webp"><img src="/assets/img/orgvia-logo.png" alt="OrgVia" width="640" height="191"></picture></a>`;

/** Responsive screenshot with fixed intrinsic size so layout never shifts. */
export const shot = (name, alt, { w = 1440, h = 900, eager = false, sizes = '(min-width: 1100px) 760px, 100vw' } = {}) =>
  `<img src="/assets/img/${name}-1440.webp" srcset="/assets/img/${name}-800.webp 800w, /assets/img/${name}-1440.webp 1440w" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>`;

export const frame = (inner, label) =>
  `<figure class="frame"><div class="frame-bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(label)}</span></div>${inner}</figure>`;

const ldOrg = {
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: 'OrgVia',
  url: SITE.url,
  logo: `${SITE.url}/assets/img/icon-512.png`,
  description: 'OrgVia is a multi-tenant HRMS platform for employee records, organization structure, attendance, leave, payroll workflows, recruitment, onboarding and performance.',
};
const ldSite = { '@type': 'WebSite', '@id': `${SITE.url}/#website`, name: 'OrgVia', url: SITE.url, publisher: { '@id': `${SITE.url}/#organization` } };
const ldApp = {
  '@type': 'SoftwareApplication',
  '@id': `${SITE.url}/#software`,
  name: 'OrgVia',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Human resource management system (HRMS)',
  operatingSystem: 'Web',
  url: SITE.url,
  description: 'Web-based HRMS for employee management, organization charts, attendance, leave, payroll workflows, recruitment, onboarding and performance management.',
  publisher: { '@id': `${SITE.url}/#organization` },
};

export function page({ path, title, description, body, bodyClass = '', home = false, faq = null, crumbs = null, noindex = false, schemaApp = false }) {
  const url = SITE.url + path;
  const graph = [];
  if (home) graph.push(ldOrg, ldSite, ldApp);
  else if (schemaApp) graph.push(ldApp, ldOrg);
  if (crumbs) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [['Home', '/'], ...crumbs].map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE.url + p })),
    });
  }
  if (faq) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })),
    });
  }
  const ld = graph.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>` : '';
  const nav = NAV.map(([h, l]) => `<a href="${h}"${path.startsWith(h) ? ' aria-current="page"' : ''}>${l}</a>`).join('');
  const full = title === 'OrgVia' ? title : `${title} | OrgVia`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}
<meta property="og:site_name" content="OrgVia"><meta property="og:type" content="website"><meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE.url}/assets/og-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="OrgVia logo on a white background">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(full)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${SITE.url}/assets/og-card.png">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="/assets/img/favicon.png" type="image/png"><link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/instrument-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/styles.css">
${ld}
<script>document.documentElement.classList.add('js')</script>
</head><body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header" data-header><div class="bar">
${logo()}
<nav id="site-nav" class="nav" aria-label="Main">${nav}<a class="nav-login" href="${esc(SITE.appUrl)}" rel="noopener">Log in</a><a class="nav-demo btn" href="/demo/">Book a demo</a></nav>
<div class="bar-actions"><a class="btn btn-sm" href="/demo/">Book a demo</a>
<button class="menu" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu"><span></span><span></span></button></div>
</div></header>
<main id="main">
${body}
</main>
<footer class="site-footer"><div class="foot">
<div class="foot-brand">${logo()}<p>A multi-tenant HRMS for employee records, attendance, leave, payroll and the work around them.</p><a class="btn btn-sm" href="/demo/">Book a demo</a></div>
<nav aria-label="Product"><h2>Product</h2><a href="/product/">Overview</a><a href="/features/">Features</a><a href="/solutions/">Solutions</a><a href="/pricing/">Pricing</a></nav>
<nav aria-label="Company"><h2>Company</h2><a href="/about/">About OrgVia</a><a href="/contact/">Contact</a><a href="/help/">Help &amp; FAQs</a><a href="${esc(SITE.appUrl)}" rel="noopener">Log in</a></nav>
<nav aria-label="Legal"><h2>Legal</h2><a href="/privacy/">Privacy Policy</a><a href="/terms/">Terms of Service</a></nav>
</div><div class="foot-legal"><span>© 2026 OrgVia. All rights reserved.</span><span>Product names and screenshots use demonstration data.</span></div></footer>
<script src="/assets/app.js" defer></script>
</body></html>`;
}

/** Shared enquiry form, posted to /api/enquiry by app.js. */
export const enquiryForm = (id = 'enquiry', { compact = false } = {}) => `
<form class="enquiry" id="${id}" data-enquiry action="/api/enquiry" method="post" novalidate>
<div class="field-row"><div class="field"><label for="${id}-name">Full name</label><input id="${id}-name" name="name" autocomplete="name" required maxlength="120"></div>
<div class="field"><label for="${id}-email">Work email</label><input id="${id}-email" name="email" type="email" autocomplete="email" required maxlength="200"></div></div>
<div class="field-row"><div class="field"><label for="${id}-org">Organization</label><input id="${id}-org" name="organization" autocomplete="organization" required maxlength="160"></div>
<div class="field"><label for="${id}-size">Team size</label><select id="${id}-size" name="teamSize" required><option value="">Select</option><option>1–25</option><option>26–100</option><option>101–500</option><option>501–2,000</option><option>2,000+</option></select></div></div>
${compact ? '' : `<div class="field"><label for="${id}-phone">Phone <span class="opt">optional</span></label><input id="${id}-phone" name="phone" type="tel" autocomplete="tel" maxlength="40"></div>`}
<div class="field"><label for="${id}-msg">What would you like to see? <span class="opt">optional</span></label><textarea id="${id}-msg" name="message" rows="${compact ? 3 : 4}" maxlength="2000"></textarea></div>
<div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
<input type="hidden" name="ts" value="">
<button class="btn" type="submit"><span class="btn-label">Send request</span></button>
<p class="form-msg" role="status" aria-live="polite"></p>
<p class="form-note">We use these details only to reply to your enquiry. See the <a href="/privacy/">Privacy Policy</a>.</p>
</form>`;
