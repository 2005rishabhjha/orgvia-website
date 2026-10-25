import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const fail = (m) => { console.error('FAIL:', m); process.exitCode = 1; };
const required = ['index.html', '404.html', 'product/index.html', 'features/index.html', 'solutions/index.html', 'pricing/index.html', 'about/index.html', 'contact/index.html', 'demo/index.html', 'help/index.html', 'privacy/index.html', 'terms/index.html', 'robots.txt', 'sitemap.xml', 'assets/og-card.png', 'assets/styles.css', 'assets/app.js'];
for (const f of required) if (!existsSync(join(root, f))) fail(`missing ${f}`);

const titles = new Set();
for (const f of readdirSync(root, { recursive: true }).map(String).filter((f) => f.endsWith('.html'))) {
  const h = readFileSync(join(root, f), 'utf8');
  for (const need of ['<title>', 'name="description"', 'rel="canonical"', '<main', 'lang="en"', 'og:image']) if (!h.includes(need)) fail(`${f} missing ${need}`);
  const t = h.match(/<title>(.*?)<\/title>/)?.[1];
  if (titles.has(t)) fail(`${f} duplicate title`); titles.add(t);
  if ((h.match(/<h1[ >]/g) || []).length !== 1) fail(`${f} must have exactly one h1`);
  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/ alt="/.test(m[0]) || !/ width="/.test(m[0])) fail(`${f} img missing alt/width: ${m[0].slice(0, 80)}`);
  for (const m of h.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const p = m[1]; if (p.startsWith('//')) continue;
    const target = p.endsWith('/') ? p + 'index.html' : p;
    if (!existsSync(join(root, target))) fail(`${f} broken link ${p}`);
  }
  for (const m of h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { fail(`${f} invalid JSON-LD`); } }
}
if (!process.exitCode) console.log('Static site checks passed.');
