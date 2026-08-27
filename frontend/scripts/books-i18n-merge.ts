// Gộp + kiểm bản dịch VI do các agent sinh ra (trong scripts/i18n-staging/)
// thành file cuối public/books/i18n/<slug>.vi.json mà BookReader.tsx nạp lúc
// chạy. Đối chiếu hash với bản EN gốc (từ books-i18n-extract.ts) — khối nào
// hash không khớp thì BỎ (không đưa vào file cuối), thà thiếu còn hơn lệch.
//
// Chạy: npx tsx frontend/scripts/books-i18n-merge.ts

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const STAGING_DIR = path.join(__dirname, 'i18n-staging');
const OUT_DIR = path.join(__dirname, '..', 'public', 'books', 'i18n');

interface EnBlock { h: string; tag: string; html: string }
interface EnFile { slug: string; title: string; count: number; blocks: EnBlock[]; part?: number; parts?: number }
interface ViBlock { h: string; vi: string }
interface ViFile { slug?: string; count?: number; blocks: ViBlock[]; part?: number }

mkdirSync(OUT_DIR, { recursive: true });

const allFiles = readdirSync(STAGING_DIR);
const enFiles = allFiles.filter((f) => f.endsWith('.en.json'));

// Gom theo slug (bỏ hậu tố .partN nếu có)
const slugs = Array.from(new Set(enFiles.map((f) => f.replace(/\.part\d+\.en\.json$/, '.en.json').replace(/\.en\.json$/, ''))));

let allOk = true;

for (const slug of slugs.sort()) {
  const parts = enFiles.filter((f) => f === `${slug}.en.json` || f.startsWith(`${slug}.part`));
  const expected: EnBlock[] = [];
  for (const pf of parts.sort()) {
    const data: EnFile = JSON.parse(readFileSync(path.join(STAGING_DIR, pf), 'utf8'));
    expected.push(...data.blocks);
  }
  const expectedHashes = new Set(expected.map((b) => b.h));

  // File VI tương ứng: <slug>.vi.json hoặc <slug>.partN.vi.json
  const viMap = new Map<string, string>();
  const viPartFiles = parts.map((pf) => pf.replace(/\.en\.json$/, '.vi.json'));
  let missingViFiles: string[] = [];
  for (const vf of viPartFiles) {
    const p = path.join(STAGING_DIR, vf);
    if (!existsSync(p)) { missingViFiles.push(vf); continue; }
    const data: ViFile = JSON.parse(readFileSync(p, 'utf8'));
    for (const b of data.blocks) {
      if (expectedHashes.has(b.h)) viMap.set(b.h, b.vi);
    }
  }

  const matched = expected.filter((b) => viMap.has(b.h)).length;
  const pct = expected.length ? Math.round((matched / expected.length) * 1000) / 10 : 100;
  const status = missingViFiles.length ? 'MISSING FILES' : pct >= 98 ? 'OK' : pct >= 80 ? 'PARTIAL' : 'LOW';
  if (status !== 'OK') allOk = false;
  console.log(
    `${slug.padEnd(48)} matched=${String(matched).padStart(5)}/${String(expected.length).padEnd(5)} (${pct}%)  ${status}` +
      (missingViFiles.length ? `  missing: ${missingViFiles.join(', ')}` : ''),
  );

  if (matched > 0) {
    const outBlocks = expected.filter((b) => viMap.has(b.h)).map((b) => ({ h: b.h, vi: viMap.get(b.h)! }));
    writeFileSync(
      path.join(OUT_DIR, `${slug}.vi.json`),
      JSON.stringify({ slug, count: outBlocks.length, totalExpected: expected.length, blocks: outBlocks }),
    );
  }
}

console.log('---');
console.log(allOk ? 'Tất cả sách đạt ngưỡng ≥98%.' : 'Có sách CHƯA đạt ngưỡng — xem log ở trên trước khi deploy.');
