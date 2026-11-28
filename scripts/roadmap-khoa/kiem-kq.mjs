#!/usr/bin/env node
/**
 * Kiểm `kq.json` của một chương (do agy viết): parse được, đủ đúng slug, mỗi ý là chuỗi không rỗng.
 * Thoát 0 = hợp lệ. Dùng trong chay-agy.sh và gop.mjs.
 *   node scripts/roadmap-khoa/kiem-kq.mjs <thư mục chương>
 */
import fs from 'node:fs';
import path from 'node:path';

export const Y = ['hoc', 'canBiet', 'lamDuoc', 'ketHop'];

/** Trả danh sách lỗi (rỗng = hợp lệ). `kq` = object đã parse, `slugs` = slug bài của chương. */
export function loiKq(kq, slugs) {
  const loi = [];
  if (!kq || typeof kq !== 'object' || Array.isArray(kq)) return ['không phải object'];
  for (const s of slugs) {
    const b = kq[s];
    if (!b || typeof b !== 'object') { loi.push(`thiếu ${s}`); continue; }
    for (const k of Y) if (typeof b[k] !== 'string' || b[k].trim().length < 8) loi.push(`${s}.${k} rỗng`);
  }
  return loi;
}

/** Đọc kq.json dung thứ: bỏ ``` bọc ngoài nếu máy soạn lỡ thêm. */
export function docKq(d) {
  const p = path.join(d, 'kq.json');
  if (!fs.existsSync(p)) return null;
  const t = fs.readFileSync(p, 'utf8').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try { return JSON.parse(t); } catch { return null; }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const d = path.resolve(process.argv[2] || '.');
  const slugs = fs.readFileSync(path.join(d, 'slug.txt'), 'utf8').split('\n').map((x) => x.trim()).filter(Boolean);
  const kq = docKq(d);
  const loi = kq ? loiKq(kq, slugs) : ['kq.json không có hoặc không parse được'];
  if (loi.length) { console.error(`${path.basename(path.dirname(d))}/${path.basename(d)}: ${loi.slice(0, 5).join('; ')}`); process.exit(1); }
}
