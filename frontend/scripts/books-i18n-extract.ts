// Trích khối văn xuôi EN của 25 cuốn sách trong public/books/*.html ra staging
// JSON để agent dịch. Dùng CHUNG hàm chọn khối với BookReader.tsx (../src/lib/bookBlocks.ts)
// để hash lúc dịch và hash lúc đọc luôn khớp nhau.
//
// Chạy: npx tsx frontend/scripts/books-i18n-extract.ts [--stats-only]
//
// Output mỗi cuốn: frontend/scripts/i18n-staging/<slug>.en.json
//   { slug, title, count, totalChars, blocks: [{ h, tag, html }, ...] }
// `html` = innerHTML gốc (giữ nguyên thẻ <code>/<a>/<b>/<strong>... lồng bên
// trong) để agent dịch mà không phá cấu trúc; `h` = hash để đối chiếu lúc đọc.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { collectBookBlockRefs } from '../src/lib/bookBlocks';

const BOOKS_DIR = path.join(__dirname, '..', 'public', 'books');
const OUT_DIR = path.join(__dirname, 'i18n-staging');

const statsOnly = process.argv.includes('--stats-only');

// Hai cuốn to gấp đôi-gấp ba phần còn lại (terminal, networking) — tách bớt
// cho vừa một lượt agent. Còn lại 23 cuốn: 1 agent = trọn 1 cuốn.
const SPLIT_PARTS: Record<string, number> = {
  '24-the-terminal-from-zero-to-fluent': 2,
  '25-networking-from-zero-to-production': 3,
};

mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(BOOKS_DIR).filter((f) => f.endsWith('.html')).sort();

let grandBlocks = 0;
let grandChars = 0;
const manifest: Array<{ slug: string; part: number | null; parts: number; file: string; count: number; chars: number }> = [];

for (const file of files) {
  const slug = file.replace(/\.html$/, '');
  const html = readFileSync(path.join(BOOKS_DIR, file), 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const title = doc.querySelector('title')?.textContent?.trim() || slug;

  const refs = collectBookBlockRefs(doc);
  const blocks = refs.map(({ el, hash }) => ({
    h: hash,
    tag: el.tagName.toLowerCase(),
    html: el.innerHTML,
  }));
  const totalChars = blocks.reduce((n, b) => n + b.html.replace(/<[^>]+>/g, '').length, 0);

  grandBlocks += blocks.length;
  grandChars += totalChars;

  console.log(`${slug.padEnd(48)} blocks=${String(blocks.length).padStart(5)}  chars=${String(totalChars).padStart(7)}`);

  const numParts = SPLIT_PARTS[slug] || 1;
  if (numParts === 1) {
    const outFile = path.join(OUT_DIR, `${slug}.en.json`);
    if (!statsOnly) {
      writeFileSync(outFile, JSON.stringify({ slug, title, count: blocks.length, totalChars, blocks }, null, 0));
    }
    manifest.push({ slug, part: null, parts: 1, file: `${slug}.en.json`, count: blocks.length, chars: totalChars });
  } else {
    const per = Math.ceil(blocks.length / numParts);
    for (let p = 0; p < numParts; p++) {
      const slice = blocks.slice(p * per, (p + 1) * per);
      if (slice.length === 0) continue;
      const partChars = slice.reduce((n, b) => n + b.html.replace(/<[^>]+>/g, '').length, 0);
      const outName = `${slug}.part${p + 1}.en.json`;
      if (!statsOnly) {
        writeFileSync(
          path.join(OUT_DIR, outName),
          JSON.stringify({ slug, title, part: p + 1, parts: numParts, count: slice.length, totalChars: partChars, blocks: slice }, null, 0),
        );
      }
      manifest.push({ slug, part: p + 1, parts: numParts, file: outName, count: slice.length, chars: partChars });
    }
  }
}

if (!statsOnly) {
  writeFileSync(path.join(OUT_DIR, '_manifest.json'), JSON.stringify(manifest, null, 2));
}

console.log('---');
console.log(`TOTAL  books=${files.length}  blocks=${grandBlocks}  chars=${grandChars}  (~${Math.round(grandChars / 5.5)} words)`);
console.log(`Translation jobs (agent lượt): ${manifest.length}`);
