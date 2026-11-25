/**
 * Hàm dùng chung cho bài của khoá mongodb (soạn 24/11/2026, agent mgo).
 * Output THẬT nằm ở ./_ma.mjs (SINH bởi scratchpad/mgo/demo/chay.py + gen-ma.mjs: chạy lệnh trong container MongoDB 8.0
 * `mgo-lab` dựng từ ./_demo/compose.yaml, dữ liệu mẫu tất định ./_demo/ctshop-seed.js). Không chép tay output vào bài.
 */
import { OUT } from './_ma.mjs';

export const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Khối mã tự viết trong bài (đã là văn bản thô — hàm tự thoát HTML). */
export const ma = (lang, s) => `<pre><code class="language-${lang}">${escHtml(s.replace(/^\n/, ''))}</code></pre>`;

/** Output chạy thật (OUT[key]). chi = [từ, tới] (1-based) để lấy một đoạn dòng. */
export const ra = (key, chi) => {
  let s = OUT[key];
  if (s == null) throw new Error(`ra(): thiếu OUT['${key}'] — chạy lại scratchpad/mgo/demo/chay.py?`);
  if (chi) s = s.split('\n').slice(chi[0] - 1, chi[1]).join('\n');
  return `<div class="out">${escHtml(s)}</div>`;
};

/** Lấy riêng lệnh thứ i (0-based) trong một khối demo — kèm dòng lệnh ("$ …" hoặc "<db>> …"). */
export const lenh = (key, i) => {
  const s = OUT[key];
  if (s == null) throw new Error(`lenh(): thiếu OUT['${key}']`);
  const khoi = [];
  for (const d of s.split('\n')) {
    if (d.startsWith('$ ') || /^[a-z0-9_]+> /.test(d)) khoi.push([d]);
    else if (khoi.length) khoi[khoi.length - 1].push(d);
  }
  if (!khoi[i]) throw new Error(`lenh(): OUT['${key}'] không có lệnh thứ ${i}`);
  return `<div class="out">${escHtml(khoi[i].join('\n'))}</div>`;
};

/** Thẻ liên kết chéo sang bài khác trên trang. academy:true ⇒ /academy/courses/<khoa>/learn. */
export function lienKet({ khoa, bai, title, sub, cta = 'Mở bài', academy = false }) {
  const goc = academy ? '/academy/courses' : '/courses';
  return `<a class="link-card lien-ket-cheo" href="${goc}/${khoa}/learn?lessonSlug=${bai}" target="_blank" rel="noopener">\n` +
    `  <span class="lc-ico">🔗</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n` +
    `  <span class="lc-cta">${cta}</span>\n</a>`;
}

/** Thẻ nguồn tham khảo ngoài (URL đã GET kiểm ngày soạn). */
export const nguon = (ico, title, sub, url) => `<a class="link-card" href="${url}" target="_blank" rel="noopener">\n` +
  `  <span class="lc-ico">${ico}</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n</a>`;

/** Bảng thuật ngữ: [[thuật ngữ, giải thích], …]. */
export const kv = (rows) => `<div class="kv-grid">\n${rows.map(([k, v]) => `  <div class="kv"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('\n')}\n</div>`;

/** Khối lời giải che (bấm để mở). */
export const loiGiai = (tieuDe, html) => `<details><summary>${tieuDe}</summary>\n${html}\n</details>`;
