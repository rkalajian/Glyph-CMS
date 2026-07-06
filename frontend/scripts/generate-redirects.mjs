/**
 * Generates a Netlify `_redirects` file in out/ from the Strapi Redirect
 * collection type. Runs automatically after `next build` (postbuild hook).
 *
 * Format (one per line): <fromPath> <toPath> <statusCode>
 * https://docs.netlify.com/routing/redirects/
 *
 * Fails soft: if Strapi is unreachable or has no redirects, the build still
 * succeeds and no _redirects file is written.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');

async function fetchRedirects() {
  const all = [];
  let page = 1;
  for (;;) {
    const url = `${STRAPI_URL}/api/redirects?filters[enabled][$eq]=true&pagination[page]=${page}&pagination[pageSize]=100&sort=fromPath:asc`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
    const body = await res.json();
    const items = Array.isArray(body.data) ? body.data : [];
    all.push(...items);
    const { pageCount } = body.meta?.pagination ?? { pageCount: 1 };
    if (page >= pageCount) break;
    page += 1;
  }
  return all;
}

function toLine(r) {
  const attrs = r.attributes ?? r;
  const from = (attrs.fromPath || '').trim();
  const to = (attrs.toPath || '').trim();
  const status = attrs.statusCode === 'temporary' ? '302' : '301';
  if (!from.startsWith('/') || !to) return null;
  if (/\s/.test(from) || /\s/.test(to)) return null; // malformed — would corrupt the file
  return `${from} ${to} ${status}!`;
}

try {
  const redirects = await fetchRedirects();
  const lines = redirects.map(toLine).filter(Boolean);
  if (lines.length === 0) {
    console.log('generate-redirects: no enabled redirects, skipping _redirects');
    process.exit(0);
  }
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });
  const header = '# Generated from the Strapi Redirect collection — do not edit by hand\n';
  await writeFile(path.join(OUT_DIR, '_redirects'), header + lines.join('\n') + '\n');
  console.log(`generate-redirects: wrote ${lines.length} redirect(s) to out/_redirects`);
} catch (err) {
  console.warn(`generate-redirects: skipped (${err.message})`);
}
