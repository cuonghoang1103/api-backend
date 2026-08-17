#!/usr/bin/env node
/**
 * Đo CHÍNH XÁC các lỗ khoét trên một tấm, bằng phép dò nhị phân trên
 * biên vật liệu — không ước lượng bằng lưới ký tự.
 *
 *   node scratchpad/do-lo-stl.mjs <file.stl> <z> <x1,y1> [<x2,y2> ...]
 *
 * Mỗi cặp toạ độ là một điểm nằm TRONG lỗ; script dò ra bốn biên của lỗ
 * đó theo ±X và ±Y rồi in kích thước thật.
 */

import { readFileSync } from 'node:fs';

const [file, zStr, ...diem] = process.argv.slice(2);
const Z = Number(zStr);

const buf = readFileSync(file);
const n = buf.readUInt32LE(80);
const T = new Array(n);
for (let i = 0; i < n; i++) {
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

function catTam(o, t) {
  const [a, b, c] = t;
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
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
  return inv * (e2[0] * q[0] + e2[1] * q[1] + e2[2] * q[2]) > 1e-9;
}

function trong(x, y, z) {
  let c = 0;
  for (const t of T) {
    if (Math.max(t[0][1], t[1][1], t[2][1]) < y) continue;
    if (Math.min(t[0][1], t[1][1], t[2][1]) > y) continue;
    if (Math.max(t[0][2], t[1][2], t[2][2]) < z) continue;
    if (Math.min(t[0][2], t[1][2], t[2][2]) > z) continue;
    if (Math.max(t[0][0], t[1][0], t[2][0]) < x) continue;
    if (catTam([x, y, z], t)) c++;
  }
  return c % 2 === 1;
}

/** Dò biên vật liệu từ điểm rỗng, đi theo hướng d, chính xác 0,01 mm. */
function bien(x, y, dx, dy) {
  // ⚠️ QUÉT ĐỀU, KHÔNG NHÂN ĐÔI. Hai bản trước đều sai ở đúng chỗ này:
  //   b1: `hi = 200` — dài hơn cả vật thể, bước đầu đã ra ngoài hộp bao;
  //   b2: nới gấp đôi 0,5→1→2→…→16→32 — NHẢY QUA bức tường nằm ở
  //       khoảng 23–27 mm, rồi báo "không có tường".
  // Tường vỏ chỉ dày 2–4 mm nên bước dò phải nhỏ hơn thế nhiều.
  const BUOC = 0.2;
  let lo = 0, hi = 0;
  for (;;) {
    hi += BUOC;
    const nx = x + dx * hi, ny = y + dy * hi;
    if (nx < min[0] || nx > max[0] || ny < min[1] || ny > max[1]) return null;
    if (trong(nx, ny, Z)) break;
    lo = hi;
  }
  for (let i = 0; i < 30; i++) {
    const m = (lo + hi) / 2;
    if (trong(x + dx * m, y + dy * m, Z)) hi = m; else lo = m;
  }
  return (lo + hi) / 2;
}

console.log(`${file}  @ Z=${Z}`);
console.log(`hộp bao: ${(max[0]-min[0]).toFixed(1)} × ${(max[1]-min[1]).toFixed(1)} × ${(max[2]-min[2]).toFixed(1)} mm\n`);

for (const d of diem) {
  const [x, y] = d.split(',').map(Number);
  if (trong(x, y, Z)) { console.log(`(${x}, ${y}) → nằm TRONG NHỰA, không phải lỗ`); continue; }
  const t = bien(x, y, 0, 1), b = bien(x, y, 0, -1);
  const p = bien(x, y, 1, 0), tr = bien(x, y, -1, 0);
  if ([t, b, p, tr].some((v) => v == null)) {
    console.log(`(${x}, ${y}) → hở ra mép ngoài, không phải lỗ kín`);
    continue;
  }
  const rong = p + tr, cao = t + b;
  console.log(
    `lỗ quanh (${x}, ${y}):  rộng X = ${rong.toFixed(2)} mm   cao Y = ${cao.toFixed(2)} mm` +
    `   tâm ≈ (${(x + (p - tr) / 2).toFixed(1)}, ${(y + (t - b) / 2).toFixed(1)})` +
    (Math.abs(rong - cao) < 0.3 ? '   → TRÒN' : '')
  );
}
