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
