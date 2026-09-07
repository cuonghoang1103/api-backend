/**
 * Bộ khuôn dùng chung cho các đề thi khoá Socket.IO (FE, PE, và các PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Đưa một chuỗi ĐÃ song ngữ vào
 * `B()` lần nữa là hỏng: `pickLang` cắt ở dấu ống ĐẦU TIÊN, nên bản tiếng Việt
 * sẽ lòi cả đoạn tiếng Anh ra màn hình. Khoá này ít gặp ký tự `|` hơn Docker,
 * nhưng vẫn KHÔNG bao giờ được gõ ba dấu `|` liền nhau trong nội dung.
 *
 * Vì sao có file này: đề Socket.IO đầy packet nguyên văn trên dây
 * (`451-["blob",{"_placeholder":true,"num":0}]`), đầy generic TypeScript
 * (`Map<string, Set<string>>`) và đầy so sánh (`socket.rooms.size >= 1`).
 * `code()` tự thoát `< > &`, nên đoạn mã trong đề luôn hiện đúng nguyên văn
 * thay vì bị trình duyệt nuốt mất một nửa.
 *
 * Sao chép từ docker-exam-kit.mjs; hai điểm khác: `sim()` gắn
 * `fromCourse=socket-io`, và `RUBRIC_CODE` mô tả ngữ nghĩa realtime (sự kiện
 * đúng thứ tự, định tuyến đúng người nhận, dọn dẹp khi disconnect) thay vì
 * ngữ nghĩa Docker (ảnh dựng được, tầng ảnh, ranh giới mạng).
 */

/** Chuỗi song ngữ dạng ống — dùng cho prompt và option. Đúng MỘT dấu ống. */
export const B = (en, vi) => `${en}|||${vi}`;

/** Giải thích song ngữ dạng HTML hai khối. */
export const EX = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

/** Khối mã trong đề — tự thoát ký tự, khỏi phải gõ &lt; bằng tay. */
export const code = (src) => `<pre><code>${esc(src)}</code></pre>`;

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `socket.to(room)`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=socket-io&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/** Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip). */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The program does what the question asks: the events fire in the order the problem describes, every line the question asks for is printed exactly as specified, and the process exits on its own instead of hanging on an open handle.',
      'Chương trình làm đúng thứ đề yêu cầu: các sự kiện nổ đúng thứ tự đề mô tả, mọi dòng đề đòi đều in ra đúng như đã nêu, và tiến trình tự thoát chứ không treo lại vì còn một handle đang mở.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The realtime decisions are right: the packet reaches exactly the intended recipients and nobody else, application state is keyed by user rather than by <code>socket.id</code>, an ack is used where delivery matters, and no broadcast fans out to everyone when a room would do.',
      'Các quyết định realtime đặt đúng chỗ: packet tới đúng người cần tới và không tới ai khác, trạng thái ứng dụng khoá theo người dùng chứ không theo <code>socket.id</code>, có ack ở chỗ việc giao hàng thật sự quan trọng, và không có broadcast nào toả ra cả hệ thống khi một room là đủ.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable and leak-free: every timer and every pending-ack entry is cleared on <code>disconnect</code>, no map grows without a bound, an empty room leaves no orphan state behind, and the scaffold given in the question is left untouched.',
      'Dễ đọc và không rò rỉ: mọi timer và mọi mục ack đang chờ đều được dọn khi <code>disconnect</code>, không map nào phình vô hạn, một room rỗng không để lại trạng thái mồ côi, và giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu thực hành). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Socket.IO course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Practical</b> — write the handler, the adapter call or the delivery layer straight into the editor in the exam room. It is graded by AI against the reference answer and a rubric.</li>' +
  '</ul>' +
  '<p>Read the packet dumps carefully: several questions turn on the difference between the engine.io sid and the socket.io sid, on whether a frame ever left the client at all, or on which side of a disconnect the reason string was produced. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Socket.IO. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Thực hành</b> — gõ thẳng handler, lời gọi adapter hay tầng giao hàng vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn packet: nhiều câu ăn thua ở chỗ phân biệt sid của engine.io với sid của socket.io, ở chỗ một frame có thật sự rời khỏi client hay không, hoặc ở chỗ chuỗi lý do disconnect được sinh ra ở phía nào. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
  '<p>Nộp bài xong, mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

/** Một câu trắc nghiệm. `correct` là số hoặc mảng số (câu chọn nhiều đáp án). */
export const mcq = ({ prompt, options, correct, explanation, points = 1 }) => ({
  kind: 'MCQ',
  points,
  prompt,
  options: options.map((text) => ({ text })),
  correctIndexes: Array.isArray(correct) ? correct : [correct],
  explanation,
});

/** Một câu thực hành: viết gateway / handler / tầng giao hàng. */
// `khongChayDuoc`: lý do bằng chữ vì sao scripts/exam-check.mjs KHÔNG chạy được
// lời giải câu này (cần một server socket.io sống, cần hai tiến trình, cần một
// gói nhiều file…). Chỉ dùng khi ngôn ngữ vốn CHẠY ĐƯỢC — ngôn ngữ không chạy
// được thì bộ kiểm tự nhận ra qua nhãn.
//
// ⚠️ Với khoá này cái bẫy nằm ở CHỖ KHÁC Docker: `javascript` là ngôn ngữ bộ
// kiểm chạy được, nhưng nó chạy trong một thư mục tạm KHÔNG có node_modules,
// nên bất cứ lời giải nào `require('socket.io')` đều chết bằng
// MODULE_NOT_FOUND — đo thật 08/09/2026. Vì thế bốn trong năm câu PE cố ý
// được thiết kế để lời giải là JavaScript THUẦN (không phụ thuộc), còn câu duy
// nhất cần một server socket.io thật thì khai `khongChayDuoc`.
// Seeder chọn field tường minh nên field này không vào DB.
export const codeQ = ({ points, prompt, language = 'javascript', starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_CODE, khongChayDuoc }) => ({
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
