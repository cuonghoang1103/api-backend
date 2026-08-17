#!/usr/bin/env node
/**
 * Bản 2 — sau khi bản 1 báo LỖI cả 9/9 file.
 *
 * Cả chín cùng sai thì gần như chắc chắn là phép kiểm sai chứ không
 * phải chín cái mô hình cùng hỏng. Bản 1 đếm "cạnh có hướng xuất hiện
 * >1 lần" rồi gọi đó là lỗi. Nhưng mô hình sinh từ HỢP CỦA NHIỀU KHỐI
 * HỘP thì mỗi hộp là một vỏ kín riêng, và chỗ hai hộp áp mặt vào nhau
 * sẽ dùng chung đỉnh ⇒ cạnh có hướng lặp lại một cách hoàn toàn bình
 * thường. Slicer nào cũng hợp nhất chúng lúc cắt lớp.
 *
 * Bản này đếm BỘI SỐ CẠNH VÔ HƯỚNG và phân loại:
 *   =2  mặt biên bình thường
 *   =4  hai vỏ áp mặt nhau — KHÔNG sao khi in, slicer tự hợp
 *   =1  LƯỚI HỞ — đây mới là lỗi thật
 *   lẻ  lưới rách
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const thuMuc = process.argv[2] || '.';

function docStl(buf) {
  const soTam = buf.readUInt32LE(80);
  if (84 + soTam * 50 !== buf.length) return null;
  const tam = new Array(soTam);
  for (let i = 0; i < soTam; i++) {
    const o = 84 + i * 50;
    tam[i] = [
      [buf.readFloatLE(o + 12), buf.readFloatLE(o + 16), buf.readFloatLE(o + 20)],
      [buf.readFloatLE(o + 24), buf.readFloatLE(o + 28), buf.readFloatLE(o + 32)],
      [buf.readFloatLE(o + 36), buf.readFloatLE(o + 40), buf.readFloatLE(o + 44)],
    ];
  }
  return tam;
}

const K = (p) => p.map((x) => Math.round(x * 1000) / 1000).join(',');

function soi(tam) {
  const boi = new Map(); // cạnh vô hướng → số tam giác dùng nó
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  let theTich = 0;

  for (const t of tam) {
    for (const p of t) for (let i = 0; i < 3; i++) {
      if (p[i] < min[i]) min[i] = p[i];
      if (p[i] > max[i]) max[i] = p[i];
    }
    const [a, b, c] = t;
    theTich +=
      (a[0] * (b[1] * c[2] - b[2] * c[1]) -
       a[1] * (b[0] * c[2] - b[2] * c[0]) +
       a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;

    const kv = t.map(K);
    for (let i = 0; i < 3; i++) {
      const p = kv[i], q = kv[(i + 1) % 3];
      const e = p < q ? `${p}|${q}` : `${q}|${p}`;
      boi.set(e, (boi.get(e) ?? 0) + 1);
    }
  }

  const pho = new Map();
  for (const n of boi.values()) pho.set(n, (pho.get(n) ?? 0) + 1);

  return {
    kichThuoc: [max[0] - min[0], max[1] - min[1], max[2] - min[2]],
    theTich, pho, soTam: tam.length,
  };
}

const files = readdirSync(thuMuc).filter((f) => f.endsWith('.stl')).sort();
console.log('file'.padEnd(22) + 'bội số cạnh vô hướng'.padEnd(34) + 'kết luận');
console.log('─'.repeat(88));

let hong = 0;
for (const f of files) {
  const r = soi(docStl(readFileSync(join(thuMuc, f))));
  const pho = [...r.pho.entries()].sort((a, b) => a[0] - b[0]);
  const moTa = pho.map(([n, c]) => `${n}→${c}`).join('  ');

  const ho = r.pho.get(1) ?? 0;
  const le = pho.filter(([n]) => n % 2 === 1).reduce((s, [, c]) => s + c, 0);
  const bon = r.pho.get(4) ?? 0;

  let ket;
  if (ho > 0) { ket = `❌ HỞ ${ho} cạnh`; hong++; }
  else if (le > 0) { ket = `❌ ${le} cạnh bội LẺ — lưới rách`; hong++; }
  else if (r.theTich <= 0) { ket = '❌ thể tích ≤ 0 — pháp tuyến lộn'; hong++; }
  else ket = bon ? `✅ kín (${bon} cạnh là chỗ 2 khối áp nhau — bình thường)` : '✅ kín, một vỏ liền';

  console.log(f.padEnd(22) + moTa.padEnd(34) + ket);
}
console.log('─'.repeat(88));
console.log(hong === 0
  ? '✅ KHÔNG file nào hở. Bản 1 báo động nhầm: nó đếm cạnh CÓ HƯỚNG lặp lại và gọi đó là lỗi.'
  : `❌ ${hong} file có lỗi thật.`);
process.exit(hong === 0 ? 0 : 1);
