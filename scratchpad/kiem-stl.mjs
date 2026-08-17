#!/usr/bin/env node
/**
 * Soi STL trước khi mang đi in: kích thước thật, kín/hở, mặt lỗi.
 *
 * KHÔNG xem ảnh render. Ảnh render giấu đúng ba thứ giết một bản in:
 * lưới hở (slicer tự "vá" theo kiểu của nó, mỗi phần mềm một kiểu),
 * pháp tuyến lộn ngược (in ra rỗng ruột hoặc đặc cứng), và tam giác
 * suy biến (slicer bỏ qua hoặc treo).
 *
 *   node scratchpad/kiem-stl.mjs <thư mục>
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const thuMuc = process.argv[2] || '.';

/** Đọc STL nhị phân. Trả null nếu không phải nhị phân hợp lệ. */
function docStl(buf) {
  if (buf.length < 84) return null;
  const soTam = buf.readUInt32LE(80);
  if (84 + soTam * 50 !== buf.length) return null; // ASCII STL hoặc file hỏng
  const tam = new Array(soTam);
  for (let i = 0; i < soTam; i++) {
    const o = 84 + i * 50;
    tam[i] = {
      n: [buf.readFloatLE(o), buf.readFloatLE(o + 4), buf.readFloatLE(o + 8)],
      v: [
        [buf.readFloatLE(o + 12), buf.readFloatLE(o + 16), buf.readFloatLE(o + 20)],
        [buf.readFloatLE(o + 24), buf.readFloatLE(o + 28), buf.readFloatLE(o + 32)],
        [buf.readFloatLE(o + 36), buf.readFloatLE(o + 40), buf.readFloatLE(o + 44)],
      ],
    };
  }
  return tam;
}

/** Khoá đỉnh có làm tròn — số thực bằng nhau về ý nghĩa nhưng lệch bit
 *  cuối sẽ thành hai đỉnh khác nhau, và mọi phép kiểm kín đều báo hở. */
const K = (p) => p.map((x) => Math.round(x * 1000) / 1000).join(',');

function soi(tam) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  let theTich = 0;
  let suyBien = 0;
  let phapTuyenLech = 0;
  const canh = new Map();

  for (const t of tam) {
    for (const p of t.v) {
      for (let i = 0; i < 3; i++) {
        if (p[i] < min[i]) min[i] = p[i];
        if (p[i] > max[i]) max[i] = p[i];
      }
    }
    const [a, b, c] = t.v;

    // Thể tích có dấu = tổng tứ diện từ gốc. Âm ⇒ pháp tuyến lộn hết.
    theTich +=
      (a[0] * (b[1] * c[2] - b[2] * c[1]) -
        a[1] * (b[0] * c[2] - b[2] * c[0]) +
        a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;

    // Diện tích qua tích có hướng. Gần 0 ⇒ tam giác bẹt, slicer hay bỏ.
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const cr = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...cr);
    if (len < 1e-9) { suyBien++; continue; }

    // Pháp tuyến ghi trong file có khớp pháp tuyến tính từ đỉnh không.
    const nx = cr.map((x) => x / len);
    const nf = Math.hypot(...t.n);
    if (nf > 1e-6) {
      const dot = (t.n[0] * nx[0] + t.n[1] * nx[1] + t.n[2] * nx[2]) / nf;
      if (dot < 0.5) phapTuyenLech++;
    }

    // Cạnh có HƯỚNG. Lưới kín và nhất quán ⇒ mỗi cạnh xuất hiện đúng
    // một lần theo mỗi chiều.
    const kv = t.v.map(K);
    for (let i = 0; i < 3; i++) {
      const e = `${kv[i]}|${kv[(i + 1) % 3]}`;
      canh.set(e, (canh.get(e) ?? 0) + 1);
    }
  }

  let hoLoi = 0;   // cạnh chỉ có một chiều ⇒ lưới HỞ
  let trungLoi = 0; // cạnh cùng chiều xuất hiện >1 ⇒ mặt chồng/lộn
  for (const [e, n] of canh) {
    const [a, b] = e.split('|');
    const nguoc = canh.get(`${b}|${a}`) ?? 0;
    if (n > 1) trungLoi++;
    if (nguoc === 0) hoLoi++;
  }

  return {
    soTam: tam.length,
    kichThuoc: [max[0] - min[0], max[1] - min[1], max[2] - min[2]],
    min, max,
    theTich, suyBien, phapTuyenLech,
    hoLoi, trungLoi,
    soCanh: canh.size,
  };
}

// Bàn in phổ biến ở VN
const BAN = [
  { ten: 'Ender 3 / 220×220×250', x: 220, y: 220, z: 250 },
  { ten: 'Bambu A1 mini 180³', x: 180, y: 180, z: 180 },
  { ten: 'Bambu P1S/X1 256³', x: 256, y: 256, z: 256 },
];

const files = readdirSync(thuMuc).filter((f) => f.toLowerCase().endsWith('.stl')).sort();
console.log(`Soi ${files.length} file trong ${thuMuc}\n`);
console.log(
  'file'.padEnd(22) + 'tam giác'.padStart(9) + '  kích thước X×Y×Z (mm)'.padEnd(28) +
  'nhựa'.padStart(9) + '  kín?'
);
console.log('─'.repeat(92));

let tongCm3 = 0;
const canBan = [];
const loi = [];

for (const f of files) {
  const tam = docStl(readFileSync(join(thuMuc, f)));
  if (!tam) { console.log(`${f.padEnd(22)}  ⚠️ KHÔNG PHẢI STL NHỊ PHÂN HỢP LỆ`); loi.push(f); continue; }
  const r = soi(tam);
  const [x, y, z] = r.kichThuoc;
  const cm3 = Math.abs(r.theTich) / 1000;
  tongCm3 += cm3;

  const kin = r.hoLoi === 0 && r.trungLoi === 0;
  const trangThai = kin ? '✅ kín' : `❌ hở ${r.hoLoi} cạnh${r.trungLoi ? `, trùng ${r.trungLoi}` : ''}`;
  if (!kin) loi.push(f);
  if (r.suyBien) loi.push(`${f} (${r.suyBien} tam giác bẹt)`);
  if (r.theTich < 0) loi.push(`${f} (thể tích ÂM — pháp tuyến lộn)`);

  console.log(
    f.padEnd(22) +
    String(r.soTam).padStart(9) + '  ' +
    `${x.toFixed(1)} × ${y.toFixed(1)} × ${z.toFixed(1)}`.padEnd(26) +
    `${cm3.toFixed(1)} cm³`.padStart(9) + '  ' + trangThai +
    (r.suyBien ? `  ⚠️ ${r.suyBien} bẹt` : '') +
    (r.phapTuyenLech ? `  ⚠️ ${r.phapTuyenLech} pháp tuyến lệch` : '') +
    (r.theTich < 0 ? '  ⚠️ THỂ TÍCH ÂM' : '')
  );

  // Có xoay kiểu gì cũng phải vừa bàn — thử cả 3 cách đặt trục Z.
  const canh3 = [x, y, z].sort((a, b) => a - b);
  for (const b of BAN) {
    const ban2 = [b.x, b.y].sort((a, b2) => a - b2);
    const vua =
      (canh3[0] <= ban2[0] && canh3[1] <= ban2[1] && canh3[2] <= b.z) ||
      (canh3[0] <= ban2[0] && canh3[2] <= ban2[1] && canh3[1] <= b.z);
    if (!vua) canBan.push(`${f} KHÔNG vừa ${b.ten}`);
  }
}

console.log('─'.repeat(92));
console.log(`Tổng nhựa đặc: ${tongCm3.toFixed(0)} cm³ ≈ ${(tongCm3 * 1.24).toFixed(0)} g PETG nếu in ĐẶC 100%`);
console.log(`Thực tế in vỏ (2 lớp thành, 15% ruột): ước ~${(tongCm3 * 0.28 * 1.24).toFixed(0)} g PETG\n`);

if (canBan.length) {
  console.log('⚠️ VƯỢT BÀN IN:');
  for (const c of [...new Set(canBan)]) console.log('   ' + c);
  console.log();
}

if (loi.length) {
  console.log('❌ CÓ VẤN ĐỀ, ĐỪNG IN CHO TỚI KHI SỬA:');
  for (const l of [...new Set(loi)]) console.log('   ' + l);
  process.exit(1);
} else {
  console.log('✅ Mọi lưới đều KÍN, pháp tuyến đúng chiều, không tam giác bẹt.');
}
