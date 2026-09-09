/**
 * Bộ khuôn dùng chung cho các đề thi khoá NỀN TẢNG "Web Foundations"
 * (WF-PT1, WF-PT2, WF-FE). Tái dùng helper song ngữ của bộ kit Node.js
 * (B / EX / code / mcq) và thêm phần hướng dẫn riêng cho khoá nền tảng.
 *
 * Các đề Web Foundations là TRẮC NGHIỆM (MCQ) — chấm tự động, phù hợp một khoá
 * kiến thức nền cho người mới. Mọi câu "in ra gì" đều phải CHẠY THẬT để lấy đáp
 * án (node cho JS, hoặc suy luận HTML/CSS chuẩn). KHÔNG dùng link `sim(...)` của
 * kit Node.js (khoá này không có mô phỏng riêng).
 */
export { B, EX, code, mcq } from './nodejs-exam-kit.mjs';

import { B as _B } from './nodejs-exam-kit.mjs';

/* ─────────────────────────────────────────────────────────────────────────
 * THÊM 10/09/2026 cho `WF-PE.mjs` — đề THỰC HÀNH đầu tiên của khoá này.
 * Chỉ THÊM, không đổi và không xoá thứ gì ở trên: WF-FE / WF-PT1 / WF-PT2
 * vẫn chỉ nhập { B, EX, code, mcq, wfInstructions } và không thấy ba export
 * dưới đây.
 * ───────────────────────────────────────────────────────────────────────── */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/**
 * Mã INLINE trong một câu văn — tự thoát `< > &`.
 * Đề PE nói nhiều về `<img>`, `<label for>`, `a.diem - b.diem`, `Number('abc')`
 * … gõ `&lt;` bằng tay cho từng chỗ là cách chắc chắn sót một chỗ.
 */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Rubric MẶC ĐỊNH cho câu lập trình của khoá nền tảng.
 * ⚠️ Tổng `maxScore` = 2, đúng bằng `points` của một câu PE ở đây — KHÁC bộ
 * kit Node.js (3 tiêu chí × maxScore 4). Mỗi câu trong WF-PE tự khai rubric
 * riêng nên cái này chỉ là lưới đỡ, nhưng nó phải cộng ra 2 để không âm thầm
 * biến một câu 2 điểm thành 12 điểm.
 */
export const RUBRIC_CODE = [
  {
    id: 'chay-dung',
    criterion: _B(
      'The file runs with <code>node bai.js</code> and prints exactly the expected output, including the edge cases the question lists (empty input, ties, missing values).',
      'File chạy được bằng <code>node bai.js</code> và in ra ĐÚNG kết quả mong đợi, kể cả những ca biên đề đã liệt kê (đầu vào rỗng, giá trị bằng nhau, dữ liệu thiếu).',
    ),
    weight: 1,
    maxScore: 1,
  },
  {
    id: 'dung-muc',
    criterion: _B(
      'The solution stays inside what the course teaches — plain JavaScript, no extra package, no framework — and the block marked <code>ĐỀ CHO SẴN</code> is left untouched.',
      'Lời giải nằm trong phạm vi khoá học — JavaScript thuần, không gói ngoài, không framework — và phần đánh dấu <code>ĐỀ CHO SẴN</code> được giữ nguyên.',
    ),
    weight: 1,
    maxScore: 0.6,
  },
  {
    id: 'de-doc',
    criterion: _B(
      'Readable: clear names, no dead code, no data given by the question mutated behind the reader’s back.',
      'Dễ đọc: đặt tên rõ, không có mã thừa, không âm thầm sửa dữ liệu mà đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 0.4,
  },
];

/**
 * Một câu lập trình. `khongChayDuoc` (chuỗi lý do) khai rằng
 * `scripts/exam-check.mjs` KHÔNG chạy được lời giải mẫu này — kèm lý do bằng
 * chữ, để không ai miễn được trong im lặng. Bỏ trống nghĩa là bộ kiểm phải
 * chạy thật và khớp `expectedOutput` từng dòng.
 */
export const codeQ = ({
  points,
  prompt,
  language = 'javascript',
  starterCode,
  expectedOutput,
  sampleSolution,
  rubric = RUBRIC_CODE,
  khongChayDuoc,
}) => ({
  kind: 'CODE',
  points,
  prompt,
  language,
  starterCode,
  expectedOutput,
  sampleSolution,
  rubric,
  ...(khongChayDuoc ? { khongChayDuoc } : {}),
});

/** Hướng dẫn đầu đề song ngữ cho một đề Web Foundations (MCQ thuần). */
export const wfInstructions = (label, chapters) =>
  '<div class="ml-en">' +
  `<p><b>${label}</b> covers ${chapters} of the Web Foundations course — the zero-to-ready foundation for web development.</p>` +
  '<ul>' +
  '<li>Every question is <b>multiple choice</b> and auto-graded. Some say "choose TWO"; those are only correct when both right answers are selected.</li>' +
  '<li>Read the code and markup snippets carefully: several questions turn on execution order, on a value being a string rather than a number, on a missing tag, or on a semantic/accessibility rule.</li>' +
  '</ul>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends. After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>${label}</b> bao phủ ${chapters} của khoá Nền tảng Lập trình Web — nền móng zero→sẵn sàng để học lập trình web.</p>` +
  '<ul>' +
  '<li>Mọi câu đều là <b>trắc nghiệm</b>, chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án đúng.</li>' +
  '<li>Đọc kỹ các đoạn mã và HTML: nhiều câu ăn thua ở thứ tự thực thi, ở chuyện một giá trị là chuỗi chứ không phải số, ở một thẻ bị thiếu, hoặc ở một quy tắc ngữ nghĩa/khả năng tiếp cận.</li>' +
  '</ul>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp. Nộp bài xong, mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';
