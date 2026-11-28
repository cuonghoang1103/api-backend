/**
 * Bộ khuôn dùng chung cho các đề thi khoá Coding Interview Prep (/courses/dsa-interview): PT1–PT3, FE, PE.
 *
 * Song ngữ như mọi đề: dạng ống "EN|||VI" (prompt, option) hoặc HTML hai khối `.ml-en` / `.ml-vi`
 * (giải thích, hướng dẫn). ⚠️ MỖI TRƯỜNG ĐÚNG MỘT DẤU `|||` — mã có `||` thì bọc `c()`/`code()`.
 *
 * Câu lập trình: viết MỘT hàm bằng JavaScript (Node 22, không npm), giữa hai mốc "ĐỀ CHO SẴN". Phần cho sẵn
 * phía dưới chạy các ca mẫu + ca biên + một ca LỚN sinh bằng Park–Miller (hạt giống cố định, giống
 * `content/codelab/dsa-interview-practice`), nên lời giải vét cạn O(n²) không chạy kịp còn kết quả thì tất
 * định. `scripts/exam-check.mjs` ghép khung + lời giải mẫu rồi chạy thật — mọi lời giải mẫu còn được đối
 * chiếu với một bản vét cạn trên vài trăm đầu vào ngẫu nhiên lúc soạn (xem chú thích đầu từng file đề).
 */

/** Chuỗi song ngữ dạng ống — dùng cho prompt và option. Đúng MỘT dấu ống. */
export const B = (en, vi) => `${en}|||${vi}`;

/** Giải thích song ngữ dạng HTML hai khối. */
export const EX = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/** Khối mã trong đề — tự thoát ký tự. */
export const code = (src) => `<pre><code>${esc(src)}</code></pre>`;

/** Mã inline — cũng tự thoát. */
export const c = (src) => `<code>${esc(src)}</code>`;

/** Một câu trắc nghiệm. `correct` là số hoặc mảng số. */
export const mcq = ({ prompt, options, correct, explanation, points = 1 }) => ({
  kind: 'MCQ',
  points,
  prompt,
  options: options.map((text) => ({ text })),
  correctIndexes: Array.isArray(correct) ? correct : [correct],
  explanation,
});

/** Câu trắc nghiệm gọn: prompt EN/VI, lựa chọn [[EN, VI]…], chỉ số đúng, giải thích EN/VI. */
export const Q = (pe, pv, opts, correct, ee, ev) =>
  mcq({ prompt: B(pe, pv), options: opts.map(([e, v]) => B(e, v)), correct, explanation: EX(ee, ev) });

/** Rubric chung cho câu lập trình thuật toán (theo 4 trục chấm phỏng vấn của khoá: lời giải, độ phức tạp, ca biên, code sạch). */
export const RUBRIC_ALGO = [
  {
    id: 'correct',
    criterion: B(
      'Correct output on every given case, including the edge cases and the large generated case — line for line.',
      'Kết quả đúng ở mọi ca cho sẵn, kể cả ca biên và ca lớn sinh tự động — khớp từng dòng.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'complexity',
    criterion: B(
      'The complexity asked for in the statement (no hidden O(n²) such as includes/indexOf/shift inside a loop), and no recursion deep enough to overflow the stack on the large case.',
      'Đạt độ phức tạp đề yêu cầu (không có O(n²) ẩn như includes/indexOf/shift trong vòng lặp), và không đệ quy sâu tới mức tràn stack ở ca lớn.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'clean',
    criterion: B(
      'Clean code under pressure: clear names, one responsibility per helper, no dead code, the given scaffold untouched.',
      'Code sạch dưới áp lực: tên rõ nghĩa, mỗi hàm phụ một việc, không có code thừa, giữ nguyên khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

export const codeQ = ({ points, prompt, starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_ALGO }) => ({
  kind: 'CODE',
  points,
  prompt,
  language: 'javascript',
  starterCode,
  expectedOutput,
  sampleSolution,
  rubric,
});

export const MARK_GIVEN = '// ── ĐỀ CHO SẴN — KHÔNG SỬA ──────────────────────────────────────────';
export const MARK_SOLVE = '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ─────────────────────────────────────';

/** Bộ sinh số Park–Miller (16807, 2³¹ − 1) — cùng bộ sinh với Code Lab dsa-interview-practice. */
export const PARK = 'function park(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647); }';

/** Ghép starterCode: [đề cho sẵn trên] → [vùng viết: khung hàm] → [đề cho sẵn dưới: chạy ca thử]. */
export function starter({ head = '', stub, tail }) {
  return [MARK_GIVEN, head.trim(), '', MARK_SOLVE, stub.trim(), '', MARK_GIVEN, tail.trim(), ''].join('\n');
}

/** Hướng dẫn đầu đề cho một bài Progress Test. */
export const ptInstructions = (n, chaptersEn, chaptersVi) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers ${chaptersEn} of Coding Interview Prep. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Many show a short snippet and ask what it really returns, or give constraints and ask which plan fits.</li>' +
  '<li><b>Coding</b> — write one JavaScript function in the exam room. The given block runs the samples, the edge cases and one large generated input; a correct but too-slow idea will not finish the large case. Graded on the printed result and on complexity and code quality.</li>' +
  '</ul>' +
  '<p>Do what the course drills: read the constraints, say the brute force and its cost, then look for the repeated work. You can flag a question and come back. The timer auto-submits when it ends; afterwards every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ ${chaptersVi} của khoá Coding Interview Prep. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Nhiều câu cho một đoạn mã ngắn và hỏi nó THẬT SỰ trả về gì, hoặc cho ràng buộc rồi hỏi hướng làm nào hợp.</li>' +
  '<li><b>Lập trình</b> — viết một hàm JavaScript ngay trong phòng thi. Khối cho sẵn chạy ca mẫu, ca biên và một đầu vào lớn sinh tự động; ý tưởng đúng mà quá chậm sẽ không chạy xong ca lớn. Chấm theo kết quả in ra, độ phức tạp và chất lượng code.</li>' +
  '</ul>' +
  '<p>Làm đúng như khoá luyện: đọc ràng buộc, nói lời giải vét cạn và chi phí của nó, rồi tìm phần việc bị lặp lại. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp; nộp xong mỗi câu đều có giải thích song ngữ.</p>' +
  '</div>';
