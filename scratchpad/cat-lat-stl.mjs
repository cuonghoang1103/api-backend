#!/usr/bin/env node
/**
 * Cắt lát STL và vẽ mặt cắt bằng ký tự — để KIỂM LỖ KHOÉT có thật
 * không, đúng chỗ không, đúng cỡ không.
 *
 * Lưới kín không có nghĩa là đúng. Một tấm ngực kín mít, không lỗ loa,
 * vẫn "kín" hoàn hảo và vẫn là một bản in vứt đi.
 *
 * Cách làm: bắn tia theo +X từ từng điểm lưới, đếm số lần cắt tam giác.
 * Lẻ = trong vật liệu, chẵn = lỗ/không khí. Đây là phép thử ĐỘC LẬP với
 * cách sinh hình, nên nó bắt được cả lỗi mà bộ sinh tự tin là đúng.
 *
 *   node scratchpad/cat-lat-stl.mjs <file.stl> <z1,z2,...> [cột]
 */

import { readFileSync } from 'node:fs';

const [file, dsZ, cotStr] = process.argv.slice(2);
const COT = Number(cotStr) || 92;

const buf = readFileSync(file);
const soTam = buf.readUInt32LE(80);
const T = new Array(soTam);
for (let i = 0; i < soTam; i++) {
  const o = 84 + i * 50;
  T[i] = [
    [buf.readFloatLE(o + 12), buf.readFloatLE(o + 16), buf.readFloatLE(o + 20)],
    [buf.readFloatLE(o + 24), buf.readFloatLE(o + 28), buf.readFloatLE(o + 32)],
    [buf.readFloatLE(o + 36), buf.readFloatLE(o + 40), buf.readFloatLE(o + 44)],
  ];
}

const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (const t of T) for (const p of t) for (let i = 0; i < 3; i++) {
  if (p[i] < min[i]) min[i] = p[i];
  if (p[i] > max[i]) max[i] = p[i];
}

/** Möller–Trumbore, tia theo +X. */
function catTam(o, t) {
  const [a, b, c] = t;
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  // d = (1,0,0) ⇒ h = d × e2 = (0*e2z-0*e2y, 0*e2x-1*e2z, 1*e2y-0*e2x)
  const h = [0, -e2[2], e2[1]];
  const det = e1[0] * h[0] + e1[1] * h[1] + e1[2] * h[2];
  if (Math.abs(det) < 1e-12) return false;
  const inv = 1 / det;
  const s = [o[0] - a[0], o[1] - a[1], o[2] - a[2]];
  const u = inv * (s[0] * h[0] + s[1] * h[1] + s[2] * h[2]);
  if (u < 0 || u > 1) return false;
  const q = [s[1] * e1[2] - s[2] * e1[1], s[2] * e1[0] - s[0] * e1[2], s[0] * e1[1] - s[1] * e1[0]];
  const v = inv * q[0];
  if (v < 0 || u + v > 1) return false;
  const tt = inv * (e2[0] * q[0] + e2[1] * q[1] + e2[2] * q[2]);
  return tt > 1e-9;
}

function trong(p) {
  let n = 0;
  for (const t of T) {
    // Bỏ nhanh tam giác không thể cắt được tia +X
    if (Math.max(t[0][1], t[1][1], t[2][1]) < p[1] - 1e-9) continue;
    if (Math.min(t[0][1], t[1][1], t[2][1]) > p[1] + 1e-9) continue;
    if (Math.max(t[0][2], t[1][2], t[2][2]) < p[2] - 1e-9) continue;
    if (Math.min(t[0][2], t[1][2], t[2][2]) > p[2] + 1e-9) continue;
    if (Math.max(t[0][0], t[1][0], t[2][0]) < p[0]) continue;
    if (catTam(p, t)) n++;
  }
  return n % 2 === 1;
}

const W = max[0] - min[0], D = max[1] - min[1];
const buoc = W / COT;
const hang = Math.max(8, Math.round(D / buoc / 2)); // ký tự cao ~2× rộng

console.log(`${file}`);
console.log(`  hộp bao: X ${min[0].toFixed(1)}…${max[0].toFixed(1)}  Y ${min[1].toFixed(1)}…${max[1].toFixed(1)}  Z ${min[2].toFixed(1)}…${max[2].toFixed(1)}`);

for (const zs of (dsZ || '').split(',').filter(Boolean)) {
  const z = Number(zs);
  console.log(`\n  ── mặt cắt Z = ${z} mm  (█ = nhựa, · = rỗng) ──`);
  let dienTich = 0;
  for (let r = 0; r < hang; r++) {
    const y = min[1] + ((r + 0.5) / hang) * D;
    let dong = '  ';
    for (let cIdx = 0; cIdx < COT; cIdx++) {
      const x = min[0] + ((cIdx + 0.5) / COT) * W;
      const inside = trong([x, y, z]);
      if (inside) dienTich++;
      dong += inside ? '█' : '·';
    }
    console.log(dong);
  }
  const pct = (dienTich / (COT * hang)) * 100;
  console.log(`  → nhựa chiếm ${pct.toFixed(1)}% diện tích hộp bao ở cao độ này`);
}
