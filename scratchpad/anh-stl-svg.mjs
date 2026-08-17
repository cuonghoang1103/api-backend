#!/usr/bin/env node
/**
 * Dựng một tờ ảnh SVG cho cả bộ STL — để shop nhìn phát biết đang in
 * cái gì, và để mình phát hiện file nào bị đổi chỗ.
 *
 * Chiếu trực giao kiểu isometric, tô mặt theo thuật toán hoạ sĩ (vẽ
 * mặt xa trước). Không cần thư viện nào.
 *
 *   node scratchpad/anh-stl-svg.mjs <thư mục stl> <file svg ra>
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [thuMuc, raFile] = process.argv.slice(2);

const SL = { '01': 1, '02': 1, '03': 1, '04': 1, '05': 2, '06': 2, '07': 2, '08': 2, '09': 1 };
const TEN = {
  '01': 'Thân', '02': 'Nắp sau', '03': 'Tấm ngực', '04': 'Đầu', '05': 'Ống mắt',
  '06': 'Cánh tay trên', '07': 'Cẳng tay', '08': 'Ốp xích', '09': 'Giá servo',
};

function doc(p) {
  const b = readFileSync(p);
  const n = b.readUInt32LE(80);
  const T = new Array(n);
  for (let i = 0; i < n; i++) {
    const o = 84 + i * 50;
    T[i] = [
      [b.readFloatLE(o + 12), b.readFloatLE(o + 16), b.readFloatLE(o + 20)],
      [b.readFloatLE(o + 24), b.readFloatLE(o + 28), b.readFloatLE(o + 32)],
      [b.readFloatLE(o + 36), b.readFloatLE(o + 40), b.readFloatLE(o + 44)],
    ];
  }
  return T;
}

// Isometric: xoay 45° quanh Z rồi nghiêng ~35,26°
const C = Math.cos(Math.PI / 4), S = Math.sin(Math.PI / 4);
const CX = Math.cos(0.61548), SX = Math.sin(0.61548);
function chieu([x, y, z]) {
  const x1 = x * C - y * S, y1 = x * S + y * C;
  return [x1, y1 * SX - z * CX, y1 * CX + z * SX]; // [màn X, màn Y, độ sâu]
}

const O = 300; // ô vuông mỗi mảnh
const files = readdirSync(thuMuc).filter((f) => f.endsWith('.stl')).sort();
const COT = 3;
const HANG = Math.ceil(files.length / COT);
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${COT * O}" height="${HANG * O}" viewBox="0 0 ${COT * O} ${HANG * O}" font-family="system-ui,sans-serif">
<rect width="100%" height="100%" fill="#f8fafc"/>`;

files.forEach((f, idx) => {
  const T = doc(join(thuMuc, f));
  const ma = f.slice(0, 2);
  const gx = (idx % COT) * O, gy = Math.floor(idx / COT) * O;

  // Kích thước thật, để ghi chú
  const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  for (const t of T) for (const p of t) for (let i = 0; i < 3; i++) {
    if (p[i] < mn[i]) mn[i] = p[i];
    if (p[i] > mx[i]) mx[i] = p[i];
  }
  const tam = [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2];

  const mat = T.map((t) => {
    const p = t.map((v) => chieu([v[0] - tam[0], v[1] - tam[1], v[2] - tam[2]]));
    // Pháp tuyến để tô bóng — mặt hướng lên thì sáng hơn
    const u = [t[1][0] - t[0][0], t[1][1] - t[0][1], t[1][2] - t[0][2]];
    const w = [t[2][0] - t[0][0], t[2][1] - t[0][1], t[2][2] - t[0][2]];
    const nz = u[0] * w[1] - u[1] * w[0];
    const len = Math.hypot(u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], nz) || 1;
    return { p, sang: Math.abs(nz / len), sau: (p[0][2] + p[1][2] + p[2][2]) / 3 };
  }).sort((a, b) => a.sau - b.sau); // xa trước

  let bx = [1e9, -1e9], by = [1e9, -1e9];
  for (const m of mat) for (const q of m.p) {
    if (q[0] < bx[0]) bx[0] = q[0]; if (q[0] > bx[1]) bx[1] = q[0];
    if (q[1] < by[0]) by[0] = q[1]; if (q[1] > by[1]) by[1] = q[1];
  }
  const k = Math.min((O - 90) / (bx[1] - bx[0]), (O - 110) / (by[1] - by[0]));
  const ox = gx + O / 2, oy = gy + O / 2 + 8;

  svg += `\n<g>`;
  for (const m of mat) {
    const d = m.p.map((q) => `${(ox + q[0] * k).toFixed(1)},${(oy + q[1] * k).toFixed(1)}`).join(' ');
    const g = Math.round(120 + m.sang * 110);
    svg += `<polygon points="${d}" fill="rgb(${g},${Math.round(g * 0.86)},${Math.round(g * 0.55)})" stroke="rgb(${g - 45},${g - 60},${g - 75})" stroke-width="0.25"/>`;
  }
  const sl = SL[ma] ?? 1;
  svg += `
<text x="${gx + 14}" y="${gy + 26}" font-size="15" font-weight="700" fill="#0f172a">${f}</text>
<text x="${gx + 14}" y="${gy + 45}" font-size="13" fill="#475569">${TEN[ma] ?? ''}</text>
<text x="${gx + O - 14}" y="${gy + 28}" font-size="17" font-weight="700" text-anchor="end" fill="${sl > 1 ? '#b45309' : '#64748b'}">×${sl}</text>
<text x="${gx + O / 2}" y="${gy + O - 16}" font-size="13" text-anchor="middle" fill="#0f172a">${(mx[0] - mn[0]).toFixed(0)} × ${(mx[1] - mn[1]).toFixed(0)} × ${(mx[2] - mn[2]).toFixed(0)} mm</text>
<rect x="${gx + 4}" y="${gy + 4}" width="${O - 8}" height="${O - 8}" fill="none" stroke="#cbd5e1" stroke-width="1" rx="8"/>
</g>`;
});

svg += '\n</svg>\n';
writeFileSync(raFile, svg);
console.log(`đã ghi ${raFile} — ${files.length} mảnh`);
