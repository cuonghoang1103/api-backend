/**
 * _ui.mjs — khối HTML dùng chung cho mọi chương khoá "Operating Systems for Developers".
 *
 *   import { code, out, run, card, kv, details, esc } from './_ui.mjs';
 *
 * ⭐ OUTPUT THẬT ĐỌC THẲNG TỪ FILE: mọi lệnh trong bài được chạy trong ảnh `os-lab` (lab/moi-truong/Dockerfile) bằng
 *    `phien <kịch-bản>.sh > lab/out/<tên>.out.txt` (phien in "$ lệnh" rồi output, như người gõ). Bài học KHÔNG chép tay
 *    output: `run('c12-fork', './fork1')` cắt nguyên văn đoạn bắt đầu bằng dòng "$ ./fork1…" trong lab/out/c12-fork.out.txt
 *    tới trước lệnh kế tiếp. Chạy lại kịch bản ⇒ bài tự có số mới; lệnh bị đổi/xoá ⇒ import ném lỗi (không lặng lẽ sai).
 */
import fs from 'node:fs';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Khối mã (trang học tự tô màu theo class language-*). */
export const code = (src, lang = 'bash') => `<pre><code class="language-${lang}">${esc(String(src).replace(/\n$/, ''))}</code></pre>`;
/** Khối lệnh nhiều dòng KHÔNG dùng template literal lồng (bộ kiểm cấm backtick trong thân bài): cmd('dòng 1', 'dòng 2', …). */
export const cmd = (...lines) => code(lines.join('\n'));
/** Khối output (đã có sẵn chữ). */
export const out = (text) => `<div class="out">${esc(String(text).replace(/\n$/, ''))}</div>`;

const cache = new Map();
function file(name) {
  if (!cache.has(name)) {
    const u = new URL(`./lab/out/${name}.out.txt`, import.meta.url);
    cache.set(name, fs.readFileSync(u, 'utf8').split('\n'));
  }
  return cache.get(name);
}

/**
 * Lấy NGUYÊN VĂN `n` lệnh liên tiếp (kèm output) trong lab/out/<name>.out.txt, bắt đầu từ lệnh có tiền tố `prefix`.
 * opts.drop: bỏ các dòng khớp regex (vd. dòng trống thừa) — KHÔNG dùng để sửa chữ. opts.max: cắt bớt dòng, thêm "…".
 */
export function grab(name, prefix, n = 1, opts = {}) {
  const L = file(name);
  const i = L.findIndex((l) => l.startsWith(`$ ${prefix}`));
  if (i < 0) throw new Error(`lab/out/${name}.out.txt: không có lệnh "$ ${prefix}"`);
  let j = i + 1, seen = 1;
  for (; j < L.length; j++) {
    if (L[j].startsWith('$ ')) { if (seen >= n) break; seen++; }
  }
  let seg = L.slice(i, j);
  while (seg.length && seg[seg.length - 1] === '') seg.pop();
  while (seg.length > 1 && seg[1].trim() === '') seg.splice(1, 1); // bỏ dòng trống ngay sau dòng lệnh (vd awk in total rỗng)
  if (opts.drop) seg = seg.filter((l) => !opts.drop.test(l));
  if (opts.max && seg.length > opts.max) seg = [...seg.slice(0, opts.max), '…'];
  return seg.join('\n');
}
/** Khối output thật: run('c12-fork', './fork1') */
export const run = (name, prefix, n = 1, opts = {}) => out(grab(name, prefix, n, opts));
/** Toàn bộ một file output. */
export const whole = (name) => out(file(name).join('\n').replace(/\n+$/, ''));

/** Mã nguồn thật trong lab/code/<dir>/<file> — bài in đúng file người học sẽ chạy. */
export function src(rel, lang = 'c') {
  const u = new URL(`./lab/code/${rel}`, import.meta.url);
  return code(fs.readFileSync(u, 'utf8'), lang);
}

export const card = (href, ico, title, sub, cta) => `<a class="link-card" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;

/** Bảng thuật ngữ: kv([['fork', 'giải thích'], …]) */
export const kv = (rows) => `<div class="kv-grid">\n${rows.map(([k, v]) => `  <div class="kv"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("\n")}\n</div>`;
export const details = (sum, body) => `<details><summary>${sum}</summary>\n${body}\n</details>`;
export const ul = (items) => `<ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
export const ol = (items) => `<ol>${items.map((x) => `<li>${x}</li>`).join('')}</ol>`;
