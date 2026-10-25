import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../dist/', import.meta.url);
const required = ['index.html', '404.html', 'features/index.html', 'solutions/index.html', 'pricing/index.html', 'about/index.html', 'contact/index.html', 'demo/index.html', 'help/index.html', 'privacy/index.html', 'terms/index.html', 'robots.txt', 'sitemap.xml'];
for (const file of required) {
  if (!existsSync(new URL(file, root))) throw new Error(`Missing public file: ${file}`);
}
for (const file of readdirSync(root, { recursive: true })) {
  if (!String(file).endsWith('.html')) continue;
  const page = readFileSync(join(root.pathname, String(file)), 'utf8');
  for (const need of ['<title>', 'meta name="description"', 'rel="canonical"', '<main']) {
    if (!page.includes(need)) throw new Error(`${file} is missing ${need}`);
  }
}
console.log('Static site checks passed.');
