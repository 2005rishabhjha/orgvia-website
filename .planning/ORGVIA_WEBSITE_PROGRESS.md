# OrgVia Website Progress (updated 2026-10-26)

## Done
- Rebuilt site on a zero-dep generator (`scripts/build.mjs`, `src/`). 11 pages + 404: Home, Product, Features, Solutions, Pricing, About, Demo, Contact, Help, Privacy, Terms.
- Design: Instrument Sans + Instrument Serif italic accents (self-hosted), brand indigo #4736F1 from logo, editorial layouts (hero bleed, tabbed real-screenshot tour, index list, workflow rail, dark value section).
- Real screenshots from `~/Downloads/orgvia-screenshots` (directory, org chart, dashboard, import, mobile). Profile/settings shots deliberately not used (contact details, company name).
- Claims limited to modules present in HRMS repo (PROJECT_CONTEXT.md), stated as enabled per organization.
- SEO: unique titles/descriptions, canonical, OG/Twitter PNG, sitemap, robots (api disallowed), JSON-LD (Organization/WebSite/SoftwareApplication/Breadcrumb/FAQPage matching visible FAQ), 404 noindex.
- Forms: client validation + `api/enquiry.js` (honeypot, timing check, same-origin check, per-instance rate limit, Resend delivery). Success shown only on provider acceptance.
- Vercel: `vercel.json` outputDirectory `dist`, buildCommand `npm run build`, security + cache headers.
- Pricing: centralized proposed founding-customer plan data, monthly/annual selector, monthly headcount estimator, responsive comparison table, pricing FAQs, visible indicative-pricing disclaimer and CTA context passed to sales enquiries.
- Enquiries: local FastAPI route is selected for static local development; production uses the Vercel proxy with a server-only ingest key. Pricing context and enquiry kind are carried to the sales record.

## Verified
- `npm run build` passes; axe WCAG 2.x AA clean on all pages at 1440 and 360; no horizontal overflow; CLS 0, LCP ~0.8s local; tab keyboard nav, form error/503/success states.
- Current pricing update: `npm run build` and JavaScript syntax checks passed. Browser visual testing was not available in this run.
- Enquiry integration: migrated local SQLite through `f3b6c8d0e5a7`; a fictional Growth/Monthly enquiry returned 201 and persisted with plan, billing, `new` status and `website` source.

## Blockers / next
- Set RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL in Vercel (no real delivery verified).
- Legal copy is a draft for counsel; no contact email/address/social published (none supplied).
- Confirm approved demo data in screenshots; confirm Vercel project root = this repo and preset "Other".
- Not deployed, not committed.
