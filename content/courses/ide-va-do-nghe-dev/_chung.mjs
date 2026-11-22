/**
 * ide-va-do-nghe-dev/_chung.mjs — tiện ích chung cho các chương khoá "IDE & đồ nghề dev" (22/11/2026).
 * Dùng lại bộ tô màu của khoá Spring Boot (java/bash/xml/out/tl/giai) + thêm json(), js() và bảng phím tắt hai hệ.
 * KHÔNG backtick trần trong nội dung; mã mẫu đi qua các hàm dưới đây (tự escape < > & và backtick).
 */
export { java, bash, xml, out, tl, giai, esc } from '../spring-boot/_chung.mjs';
import { esc } from '../spring-boot/_chung.mjs';

const pre = (lang, body) => `<pre><code class="language-${lang}">${body}</code></pre>`;

/** JSON/JSONC (settings.json, tasks.json, launch.json): chú thích // tô tok-comment, khoá "…": tô tok-function. */
export const json = (src) => pre('json', src.replace(/^\n/, '').split('\n').map((l) => {
  const c = l.match(/^(\s*)(\/\/.*)$/);
  if (c) return `${c[1]}<span class="tok-comment">${esc(c[2])}</span>`;
  return esc(l).replace(/^(\s*)("[^"]+")(\s*:)/, '$1<span class="tok-function">$2</span>$3');
}).join('\n'));

/** JavaScript/JSX: chỉ tô chú thích // đầu dòng (giữ đơn giản, như khoá Node.js). */
export const js = (src) => pre('javascript', src.replace(/^\n/, '').split('\n')
  .map((l) => (/^\s*\/\//.test(l) ? `<span class="tok-comment">${esc(l)}</span>` : esc(l))).join('\n'));

/**
 * Bảng phím tắt hai hệ. rows: [['việc EN', 'việc VI', 'Windows/Linux', 'macOS'], …]. vi = true ⇒ tiêu đề tiếng Việt.
 * Phím viết sẵn dạng chữ thường (Ctrl+P, ⌘P); hàm tự bọc <code>.
 */
export const phim = (rows, vi) => `<table>
<thead><tr><th>${vi ? 'Việc' : 'Action'}</th><th>Windows / Linux</th><th>macOS</th></tr></thead>
<tbody>
${rows.map(([en, v, w, m]) => `<tr><td>${vi ? v : en}</td><td><code>${esc(w)}</code></td><td><code>${esc(m)}</code></td></tr>`).join('\n')}
</tbody>
</table>`;

/** Câu hỏi quiz (cùng dạng các khoá khác). */
export const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });

/** Liên kết sang bài của khoá khác trên trang. */
export const bai = (course, slug, text) => `<a href="/courses/${course}/learn?lessonSlug=${slug}">${text}</a>`;
