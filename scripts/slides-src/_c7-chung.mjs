/**
 * _c7-chung.mjs — khuôn slide Node.js Chương 7 (PostgreSQL + Prisma, đợt 6 — 01/11/2026) = khuôn Node (`_node-chung.mjs`) + công cụ đọc tệp thật của c7.
 * Khi chuyển vào repo web: chép cùng _node-chung.mjs (đổi import thành './_pg-chung.mjs' như ghi ở _node-chung).
 * Mọi mã + output đọc THẲNG từ src/khung/node/that/c7 (chạy bằng scratchpad/node/chay-c7.mjs: prisma 7.10.1, @prisma/adapter-pg 7.10.1, pg 8.23.1,
 * PostgreSQL 17.11 trong Docker, Node 22.23.3) ⇒ slide và video không lệch nhau.
 *   tep('c7/schema-v1.prisma', a, b)  nội dung tệp thật (schema, SQL, .sh)
 *   R('c7/mig-1', a, b)                output thật, đã bỏ dòng `# ẩn` · gay() bẻ dòng dài ở dấu phẩy (không đổi chữ)
 *   gon(t)                             bỏ 3 dòng đầu lặp lại của Prisma CLI (Loaded Prisma config…, Prisma schema loaded…, Datasource…) + dòng trống liền nhau
 *   P(src) / Q(src) / J(src)           khung mã .prisma / SQL / JavaScript;  T(text, title) terminal
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ra, term, js, sql } from './_node-chung.mjs';
export * from './_node-chung.mjs';

const THAT = '/Users/admin/Documents/video-bai-giang/src/khung/node/that';
export const tep = (ten, a = 1, b) => readFileSync(path.join(THAT, ten), 'utf8').replace(/\s+$/, '').split('\n').slice(a - 1, b).join('\n');
/** Gói dòng dài ở n ký tự (cắt sau dấu phẩy/khoảng trắng gần nhất), dòng tiếp thụt 2 — chỉ đổi cách xuống dòng, không đổi chữ. */
export const gay = (t, n = 100) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = Math.max(r.lastIndexOf(', ', n), r.lastIndexOf(' ', n)); if (k < 30) k = n - 1; o.push(r.slice(0, k + 1).trimEnd()); r = '  ' + r.slice(k + 1).trimStart(); } o.push(r); return o; }).join('\n');
export const gon = (t) => t.replace(/^Loaded Prisma config from prisma7\.config\.ts\.\n\n?/gm, '').replace(/^Prisma schema loaded from prisma\/schema\.prisma\.\n/gm, '').replace(/^Datasource "db": [^\n]*\n\n?/gm, '').replace(/\n{3,}/g, '\n\n');
export const ngan = (t) => t.replace(/ localhost:4370/g, ' :4370').replace(/'localhost:4370/g, "':4370");
/** Output thật đã gói dòng. */
export const R = (ten, a, b, n = 100) => gay(ngan(ra(ten, a, b)), n);
export const P = (src, o = {}) => sql(src, { lang: 'typescript', sm: o.sm ?? true, hl: o.hl });
export const Q = (src, o = {}) => sql(src, { lang: 'pgsql', sm: o.sm ?? true, hl: o.hl });
export const J = (src, o = {}) => js(src, { sm: o.sm ?? true, hl: o.hl });
export const T = (text, title, o = {}) => term(text, { title, sm: o.sm ?? true, hl: o.hl });
export const so = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
/** Mã JS gói dòng dài (chỉ đổi chỗ xuống dòng); hl theo SỐ DÒNG GỐC (1-based trong src) — tự dời sau khi gói. */
export const JW = (src, n = 96, hlGoc = [], o = {}) => {
  const out = [], hl = [];
  src.split('\n').forEach((l, i) => { const parts = gay(l, n).split('\n'); if (hlGoc.includes(i + 1)) parts.forEach((_, k) => hl.push(out.length + k + 1)); out.push(...parts); });
  return js(out.join('\n'), { sm: o.sm ?? true, hl });
};

