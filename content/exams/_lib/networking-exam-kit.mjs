/**
 * Bộ khuôn cho đề thi khoá Networking for Developers (FE, PT1–3, PE).
 *
 * Dùng lại B / EX / code / c / mcq của _lib/nwc204-exam-kit.mjs (song ngữ "EN|||VI", vị trí đáp án đúng theo băm nội dung —
 * giải thích viết tay KHÔNG nhắc chữ cái A/B/C/D). Thêm: câu lập trình làm tại chỗ (PT) và bài nộp đọc stdin (PE).
 *
 * expectedOutput KHÔNG viết tay: `chayRa()` chạy đúng chương trình học viên sẽ nộp (khung đề + lời giải mẫu) trong node:vm và lấy
 * các dòng console.log. scripts/exam-check.mjs sau đó chạy LẠI bằng node thật và so từng dòng — hai lần chạy độc lập phải khớp.
 */
import vm from 'node:vm';
import { B, EX, code, c, mcq } from './nwc204-exam-kit.mjs';
export { B, EX, code, c, mcq };

export const GIVEN = '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────';
export const SOLVE = '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────';

/** Chạy một chương trình JS (không require) trong realm mới, stdin cho trước; trả các dòng đã in. */
export function chayRa(src, stdin = '') {
  const lines = [];
  const ctx = vm.createContext({
    console: { log: (...a) => lines.push(a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' ')) },
    __STDIN__: stdin,
  });
  vm.runInContext(src, ctx, { timeout: 5000 });
  return lines.join('\n').replace(/\s+$/, '');
}

/** Rubric chung cho câu lập trình. */
export const RUBRIC_CODE = [
  { id: 'correct', criterion: B('The program runs under Node 22 with no error and prints exactly the expected lines, edge cases included.', 'Chương trình chạy được trên Node 22 không lỗi và in đúng các dòng kỳ vọng, kể cả ca biên.'), weight: 3, maxScore: 4 },
  { id: 'logic', criterion: B('The networking logic is right: the rule the problem states (layer, mask, cache key, first match…) is applied exactly, not approximated.', 'Logic mạng đúng: quy tắc đề nêu (tầng, mặt nạ, khoá cache, luật khớp đầu tiên…) được áp đúng chính xác, không ước chừng.'), weight: 2, maxScore: 4 },
  { id: 'quality', criterion: B('Readable code: small named helpers, no dead code, the given scaffold left untouched.', 'Mã dễ đọc: hàm phụ nhỏ có tên rõ, không mã thừa, giữ nguyên phần khung đề cho sẵn.'), weight: 1, maxScore: 4 },
];

/** Câu lập trình làm ngay trong phòng thi: khung = phần cho sẵn + chỗ viết + khối in kết quả. */
export function codeQ({ points, prompt, given, stub, solution, print }) {
  const starterCode = `${GIVEN}\n${given.trim()}\n${SOLVE}\n${stub.trim()}\n${GIVEN}\n${print.trim()}\n`;
  const assembled = `${GIVEN}\n${given.trim()}\n${SOLVE}\n\n${solution.trim()}\n\n${GIVEN}\n${print.trim()}\n`;
  return { kind: 'CODE', points, prompt, language: 'javascript', starterCode, expectedOutput: chayRa(assembled), sampleSolution: solution.trim(), rubric: RUBRIC_CODE };
}

/**
 * Bài PE: một chương trình trọn vẹn đọc stdin. `solution` dùng `require('fs').readFileSync(0, 'utf8')` khi chạy thật; ở đây bộ dựng
 * thay đúng biểu thức đó bằng biến __STDIN__ để chạy trong vm. expectedOutput theo khuôn "INPUT:\n…\nOUTPUT:\n…" của exam-check.
 */
export function peQ({ points, prompt, solution, stdin }) {
  const doc = "require('fs').readFileSync(0, 'utf8')";
  if (!solution.includes(doc)) throw new Error('peQ: lời giải phải đọc stdin bằng ' + doc);
  const out = chayRa(solution.split(doc).join('__STDIN__'), stdin);
  return { kind: 'CODE', points, prompt, language: 'javascript', expectedOutput: `INPUT:\n${stdin.replace(/\n$/, '')}\nOUTPUT:\n${out}`, sampleSolution: solution.trim(), rubric: RUBRIC_CODE };
}

/** Hướng dẫn đầu đề Progress Test. */
export const ptInstructions = (n, chapters) => EX(
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of <b>Networking for Developers</b>. It mixes two kinds of question:</p><ul><li><b>Multiple choice</b> — auto-graded, one correct answer each.</li><li><b>One coding task</b> — write it straight into the editor; it is graded by AI against the reference solution, the program's output and a rubric.</li></ul><p>Many questions are built on real output from the course lab: read the numbers, not just the words. You can flag a question and come back. The timer auto-submits when it ends. After you submit, every question shows a bilingual explanation.</p>`,
  `<p><b>Bài kiểm tra tiến độ ${n}</b> phủ chương ${chapters} của khoá <b>Networking for Developers</b>. Đề có hai loại câu:</p><ul><li><b>Trắc nghiệm</b> — chấm tự động, mỗi câu một đáp án đúng.</li><li><b>Một câu lập trình</b> — gõ thẳng vào ô soạn thảo; AI chấm theo đáp án mẫu, kết quả chương trình in ra và bộ tiêu chí.</li></ul><p>Nhiều câu dựng trên output thật của phòng lab trong khoá: hãy đọc con số, đừng chỉ đọc chữ. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp. Nộp xong, mỗi câu đều có lời giải thích song ngữ.</p>`,
);
