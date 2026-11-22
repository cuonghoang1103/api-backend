/**
 * Hàm dùng chung cho bài của khoá log-tu-a-den-z (soạn 22/11/2026).
 * Lệnh + output THẬT nằm ở ./_ma.mjs (sinh bởi scripts/log-khoa/chay-demo.sh: chạy lệnh trong container Ubuntu 24.04
 * và PowerShell 7 trên gói log mẫu ./_demo/tao-goi-log.py). Không chép tay output vào bài — sửa _demo/ rồi chạy lại.
 */
import { CODE, OUT } from './_ma.mjs';

export const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Khối mã lấy từ _demo (CODE[key]). */
export const ma = (lang, key) => {
  const s = CODE[key];
  if (s == null) throw new Error(`ma(): thiếu CODE['${key}'] — chạy lại scripts/log-khoa/chay-demo.sh?`);
  return `<pre><code class="language-${lang}">${escHtml(s)}</code></pre>`;
};

/** Output chạy thật (OUT[key]) — dạng "$ lệnh" rồi kết quả. chi = [từ, tới] (1-based) để lấy một đoạn dòng. */
export const ra = (key, chi) => {
  let s = OUT[key];
  if (s == null) throw new Error(`ra(): thiếu OUT['${key}'] — chạy lại scripts/log-khoa/chay-demo.sh?`);
  if (chi) s = s.split('\n').slice(chi[0] - 1, chi[1]).join('\n');
  return `<div class="out">${escHtml(s)}</div>`;
};

/** Lấy riêng output của lệnh thứ i (0-based) trong một tệp demo — kèm dòng "$ lệnh". */
export const lenh = (key, i) => {
  const s = OUT[key];
  if (s == null) throw new Error(`lenh(): thiếu OUT['${key}']`);
  const khoi = [];
  for (const d of s.split('\n')) {
    if (d.startsWith('$ ') || d.startsWith('PS> ')) khoi.push([d]);
    else if (khoi.length) khoi[khoi.length - 1].push(d);
  }
  if (!khoi[i]) throw new Error(`lenh(): OUT['${key}'] không có lệnh thứ ${i}`);
  return `<div class="out">${escHtml(khoi[i].join('\n'))}</div>`;
};

/** Thẻ liên kết chéo sang bài khác trên trang (Courses hoặc Academy — cùng trang học /courses/<slug>/learn). */
export function lienKet({ khoa, bai, title, sub, cta = 'Mở bài' }) {
  return `<a class="link-card lien-ket-cheo" href="/courses/${khoa}/learn?lessonSlug=${bai}" target="_blank" rel="noopener">\n` +
    `  <span class="lc-ico">🔗</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n` +
    `  <span class="lc-cta">${cta}</span>\n</a>`;
}

/** Thẻ nguồn tham khảo ngoài (URL đã GET kiểm). */
export const nguon = (ico, title, sub, url) => `<a class="link-card" href="${url}" target="_blank" rel="noopener">\n` +
  `  <span class="lc-ico">${ico}</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n</a>`;

/** Bảng thuật ngữ: [[thuật ngữ, giải thích], …]. */
export const kv = (rows) => `<div class="kv-grid">\n${rows.map(([k, v]) => `  <div class="kv"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('\n')}\n</div>`;
