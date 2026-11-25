/**
 * _khung-12.mjs — tiện ích chung cho các bài Chương 12: dựng HAI bản EN/VI từ MỘT hàm (cùng cấu trúc ⇒ cùng số h3/pre/out/details).
 */
export const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
export const ra = (s) => `<div class="out">${s}</div>`;
export const mo = (tom, ...noi) => `<details><summary>${tom}</summary>\n${noi.join('\n')}\n</details>`;

/** song(f): f nhận t(en, vi) và trả HTML; trả về nội dung hai khối ml-en / ml-vi. */
export function song(f) {
  const en = f((a) => a);
  const vi = f((a, b) => b);
  return `\n<div class="ml-en">\n${en}\n</div>\n\n<div class="ml-vi">\n${vi}\n</div>\n`;
}

/** Bảng: hang = [[ô, ô, …], …]; ô dạng [en, vi] hoặc chuỗi chung. */
export const bang = (t, dau, hang) => `<table>\n<thead><tr>${dau.map((x) => `<th>${Array.isArray(x) ? t(...x) : x}</th>`).join('')}</tr></thead>\n<tbody>\n${
  hang.map((h) => `<tr>${h.map((x) => `<td>${Array.isArray(x) ? t(...x) : x}</td>`).join('')}</tr>`).join('\n')}\n</tbody></table>`;

/** Danh sách: muc = [[en, vi] | chuỗi] */
export const ds = (t, muc, kieu = 'ul') => `<${kieu}>\n${muc.map((x) => `<li>${Array.isArray(x) ? t(...x) : x}</li>`).join('\n')}\n</${kieu}>`;
