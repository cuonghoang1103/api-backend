/**
 * _sdn-chung.mjs — khuôn slide gói SDN302 (deck sdn-NN-M, đợt 5, 01/11/2026) = khuôn Node (`_node-chung.mjs`) đổi nhãn môn.
 * Khi chuyển vào repo web: chép cùng _node-chung.mjs (đổi import thành './_pg-chung.mjs' như ghi ở _node-chung).
 * Thêm: `mg()` khung mongosh · `ngan()` rút gọn lệnh curl để vừa slide (bỏ -s, localhost:4300 → :4300, $(cat id) → $ID; KHÔNG đổi kết quả) ·
 * `bo()` bỏ các dòng lệnh phụ đánh dấu `# ẩn` (lệnh chuẩn bị dữ liệu, không phải bài học) cùng dòng trống theo sau.
 */
import { lamDeck as ldn, ra, term } from './_node-chung.mjs';
export * from './_node-chung.mjs';

export const lamDeck = (meta, items) => ldn({ khoa: 'SDN302', duong: 'academy/sdn302', bieuTuong: '🍃', khau: 'Node.js, Express & MongoDB', ...meta }, items);
/** Bỏ lệnh `# ẩn` (và dòng trống output của nó). */
export const bo = (t) => t.replace(/^\$ [^\n]*# ẩn\n(\n)?/gm, '');
export const ngan = (t) => bo(t).replace(/curl -s /g, 'curl ').replace(/ localhost:4300/g, ' :4300').replace(/'localhost:4300/g, "':4300").replace(/\$\(cat id\)/g, '$ID');
/** Output curl thật đã rút gọn. */
export const rc = (ten, a, b, nguon) => ngan(ra(ten, a, b, nguon));
/** Khung mongosh (kết quả THẬT từ chay-sdn.mjs, MongoDB 7.0.37 · mongosh 2.9.2). */
export const mg = (text, o = {}) => term(text, { ...o, title: o.title ?? 'mongosh · MongoDB 7.0' });
/** Gói dòng dài (output JSON) ở n ký tự, dòng tiếp thụt 2 — chỉ đổi cách xuống dòng, không đổi chữ. */
export const gay = (t, n = 96) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = r.lastIndexOf(',', n); if (k < 30) k = n - 1; o.push(r.slice(0, k + 1)); r = '  ' + r.slice(k + 1).trimStart(); } o.push(r); return o; }).join('\n');
