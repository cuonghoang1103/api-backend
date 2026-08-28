/**
 * Kiểm trạng thái các quyển trong skill-books-staging/ — CHỈ ĐỌC, không sửa
 * file nào. Dùng trước khi `mv` 1 quyển sang skill-books-guides/.
 *
 * Kiểm 2 điều:
 *   1. Số guide() trong file staging = đúng số chương của quyển đó
 *      (guide() tự validate từng field khi import, nên lỗi field sẽ hiện ra
 *      ngay ở đây dưới dạng lỗi import).
 *   2. Mọi references[].url trong file staging đã có bản ghi
 *      status:"verified" trong _references-audit.json — nếu thiếu, quyển đó
 *      CHƯA được coi là sẵn sàng để mv, dù số chương đã đủ.
 *
 * Chạy: node frontend/scripts/skill-books-merge-check.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SKILL_BOOKS } from './skill-books-plan.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const stagingDir = path.join(here, 'skill-books-staging');
const auditPath = path.join(stagingDir, '_references-audit.json');

let audit = [];
if (existsSync(auditPath)) {
  audit = JSON.parse(readFileSync(auditPath, 'utf8'));
}
const verifiedUrls = new Set(audit.filter((a) => a.status === 'verified').map((a) => a.url));

let allReady = true;

for (const book of SKILL_BOOKS) {
  const stagingPath = path.join(stagingDir, `${book.vol}.mjs`);
  if (!existsSync(stagingPath)) {
    console.log(`${book.vol.padEnd(4)} ${book.title.padEnd(48)} chưa có file staging`);
    continue;
  }

  let guides;
  try {
    const mod = await import(`${stagingPath}?t=${Date.now()}`);
    guides = mod.default;
  } catch (e) {
    allReady = false;
    console.log(`${book.vol.padEnd(4)} ${book.title.padEnd(48)} LỖI IMPORT: ${e.message.split('\n')[0]}`);
    continue;
  }

  const countOk = guides.length === book.chapters.length;
  const allUrls = guides.flatMap((g) => g.references.map((r) => r.url));
  const unverified = allUrls.filter((u) => !verifiedUrls.has(u));
  const refsOk = unverified.length === 0;

  const status = countOk && refsOk ? 'SẴN SÀNG mv' : !countOk ? `THIẾU CHƯƠNG (${guides.length}/${book.chapters.length})` : `${unverified.length} link CHƯA xác minh`;
  if (!(countOk && refsOk)) allReady = false;
  console.log(`${book.vol.padEnd(4)} ${book.title.padEnd(48)} ${status}`);
  if (unverified.length) {
    unverified.slice(0, 5).forEach((u) => console.log(`      chưa xác minh: ${u}`));
    if (unverified.length > 5) console.log(`      ... và ${unverified.length - 5} link khác`);
  }
}

console.log('---');
console.log(allReady ? 'Mọi quyển có file staging đều sẵn sàng.' : 'Có quyển chưa sẵn sàng — xem log ở trên.');
