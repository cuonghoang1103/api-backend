/**
 * Bộ khuôn dùng chung cho các đề thi khoá Authentication (FE, PE, và các PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Nếu phần EN hay phần VI tự
 * chứa thêm một dấu ống nữa thì bản tiếng Việt sẽ lòi cả đoạn tiếng Anh ra màn
 * hình. Khoá này dễ dính ở hai chỗ riêng: chuỗi băm mật khẩu kiểu PHC
 * (`$scrypt$N=16384$...`) và các mẫu chính sách (`role|resource|action`) — một
 * dấu `|` thì vô hại, nhưng KHÔNG bao giờ được gõ ba dấu `|` liền nhau trong
 * nội dung, kể cả trong khối mã.
 *
 * Vì sao có file này: đề Authentication đầy chuỗi base64url có dấu `-` và `_`,
 * đầy JSON trong header/payload của JWT (`{"alg":"none"}`), và đầy toán tử so
 * sánh trong mã (`a === b`, `t < now`). `code()` tự thoát `< > &`, nên đoạn mã
 * trong đề luôn hiện đúng nguyên văn thay vì bị trình duyệt nuốt mất một nửa.
 *
 * Sao chép từ docker-exam-kit.mjs; điểm khác: `sim()` gắn
 * `fromCourse=authentication`, và rubric mô tả ngữ nghĩa xác thực (tín vật
 * không đoán được, so sánh hằng thời gian, ranh giới tin cậy, thất bại thì
 * ĐÓNG) thay vì ảnh dựng được và tầng ảnh của Docker.
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

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `alg: "none"`, `a < b`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=authentication&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/**
 * Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip).
 *
 * Ba tiêu chí, và thứ tự của chúng là thứ tự một hệ xác thực hỏng: trước hết
 * nó phải CHẠY ĐÚNG, rồi nó phải đúng về mặt bảo mật (thứ mà chạy đúng không
 * chứng minh được — một hàm so sánh bằng `===` vẫn trả lời đúng mọi lượt kiểm),
 * rồi mới tới chuyện đọc được và vận hành được.
 */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The artifact does what the question asks: it runs on Node 22 with no dependency beyond <code>node:crypto</code>, and every line of the expected output is reproduced exactly, including the failure cases.',
      'Hiện vật làm đúng thứ đề yêu cầu: chạy được trên Node 22 mà không cần gói nào ngoài <code>node:crypto</code>, và tái hiện đúng từng dòng của kết quả mong đợi, kể cả các ca hỏng.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'security',
    criterion: B(
      'The security decisions are right, not merely working: secrets are compared with <code>timingSafeEqual</code> and never with <code>===</code>, every random value comes from a CSPRNG with enough bits, a token is stored as a hash rather than in the clear, and the default branch on any unexpected input is DENY.',
      'Các quyết định bảo mật đặt đúng chỗ, chứ không chỉ chạy được: bí mật so bằng <code>timingSafeEqual</code> chứ không bao giờ bằng <code>===</code>, mọi giá trị ngẫu nhiên sinh từ CSPRNG với đủ số bit, token cất dưới dạng băm chứ không để trần, và nhánh mặc định với mọi đầu vào bất ngờ là TỪ CHỐI.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable and operable: every failure branch answers in the same shape so nothing enumerates accounts, the error path says what to log without logging the credential itself, and the scaffold given in the question is left untouched.',
      'Dễ đọc và vận hành được: mọi nhánh hỏng trả lời cùng một hình dạng nên không có chỗ nào dò được danh sách tài khoản, đường lỗi nói rõ ghi nhật ký cái gì mà không ghi chính cái tín vật, và giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu thực hành). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Authentication course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Practical</b> — write the function, the middleware or the check straight into the editor in the exam room. It is graded by AI against the reference answer and a rubric.</li>' +
  '</ul>' +
  '<p>Read the transcripts carefully: several questions turn on the difference between a token that failed verification and one that was never verified, on which side of a trust boundary a value arrived from, or on what an error message hands to whoever sent the request. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Authentication. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Thực hành</b> — gõ thẳng hàm, middleware hay phép kiểm vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn terminal: nhiều câu ăn thua ở chỗ phân biệt một token KIỂM KHÔNG QUA với một token CHƯA TỪNG ĐƯỢC KIỂM, ở chỗ một giá trị đi vào từ phía nào của ranh giới tin cậy, hoặc ở chỗ một thông báo lỗi trao cái gì cho kẻ vừa gửi request. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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

/** Một câu thực hành: viết hàm băm, hàm kiểm token, bộ máy phân quyền… */
// `khongChayDuoc`: lý do bằng chữ vì sao scripts/exam-check.mjs KHÔNG chạy được
// lời giải câu này (gói nhiều file, cần daemon, cần tham số dòng lệnh…). Chỉ
// dùng khi ngôn ngữ vốn CHẠY ĐƯỢC — ngôn ngữ không chạy được thì bộ kiểm tự
// nhận ra qua nhãn. Seeder chọn field tường minh nên field này không vào DB.
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
