/**
 * _cs.mjs — khối dựng dùng chung cho phần ⭐ Chuyên sâu của CEA201 (cs1…cs4-*.mjs).
 *
 * Mã nguồn trong bài viết bằng String.raw để giữ nguyên "\n" của C/Python, rồi
 * escape HTML ở đây — nên chữ hiện trên web TRÙNG KHÍT với tệp đã chạy thật.
 * Output dán vào out(): giữ thẳng cột (dấu cách liền nhau → &nbsp;), xuống dòng → <br>,
 * để scripts/academy-kiem/kiem-output.mjs so được với lần chạy lại.
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const trimNl = (s) => String(s).replace(/^\n+/, '').replace(/\s+$/, '');

/** Khối mã có tô màu + nút Sao chép. lang: c | python | bash | plaintext. */
export const code = (lang, src) => '<pre><code class="language-' + lang + '">' + esc(trimNl(src)) + '</code></pre>';

/** Khối output THẬT — đặt ngay sau code(). */
export const out = (text) => '<div class="out">' + trimNl(text).split('\n')
  .map((line) => esc(line).replace(/ {2,}/g, (m) => ' ' + '&nbsp;'.repeat(m.length - 1)).replace(/^ /, '&nbsp;'))
  .join('<br>\n') + '</div>';

/** Lời giải / đáp án che sẵn — bấm mới mở. */
export const xem = (summary, html) => '<details><summary>' + summary + '</summary>\n<div class="dap-an">' + html + '</div>\n</details>';

/** Liên kết nội bộ tới một bài của khoá khác (slug THẬT; /academy/... là 404). */
export const bai = (course, lesson, text) => '<a href="/courses/' + course + '/learn?lessonSlug=' + lesson + '">' + text + '</a>';
