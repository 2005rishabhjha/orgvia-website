// Generates dist/ from src/. Zero dependencies; run with `npm run build`.
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from '../src/site.mjs';
import { PAGES } from '../src/pages.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const src = join(root, 'src');

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, 'assets'), { recursive: true });

for (const [file, render] of PAGES) {
  const out = join(dist, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render());
}

cpSync(join(src, 'img'), join(dist, 'assets/img'), { recursive: true });
cpSync(join(src, 'fonts'), join(dist, 'assets/fonts'), { recursive: true });
for (const f of ['styles.css', 'app.js']) cpSync(join(src, f), join(dist, 'assets', f));
// This is intentionally the only browser-visible deployment setting.  It is
// an API origin, never a credential; production writes still go through the
// Vercel function, which keeps ENQUIRY_INGEST_KEY server-side.
const publicApiUrl = (process.env.ORGVIA_PUBLIC_API_URL || '').replace(/\/+$/, '');
writeFileSync(join(dist, 'assets', 'runtime-config.js'), `window.__ORGVIA_PUBLIC_API_URL__=${JSON.stringify(publicApiUrl)};\n`);
if (readdirSync(join(src, 'static')).length) cpSync(join(src, 'static'), join(dist, 'assets'), { recursive: true });

const urls = PAGES.filter(([, , path]) => path);
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([, , p, pr]) => `  <url><loc>${SITE.url}${p}</loc><lastmod>${SITE.updated}</lastmod><priority>${pr}</priority></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
console.log(`Built ${PAGES.length} pages to dist/`);
