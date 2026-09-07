/**
 * Bộ khuôn dùng chung cho các đề thi khoá Prisma ORM (FE, PE, và các PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Khoá này dễ dính vì cả ba ngôn
 * ngữ trong đề đều dùng ký tự ống: JavaScript có `||` và `??`, PostgreSQL có
 * `||` để nối chuỗi (`'post-' || "id"`) và `path || c.id` trong CTE đệ quy, còn
 * psql thì vẽ bảng kết quả bằng cột `|`. Hai dấu `|` liền nhau thì vô hại —
 * nhưng KHÔNG bao giờ được gõ ba dấu `|` liền nhau trong nội dung, kể cả trong
 * khối mã, và không được để một chuỗi kết thúc bằng `|` ngay trước chỗ `B()`
 * dán dấu ống vào.
 *
 * Vì sao có file này: đề Prisma đầy `<`, `>` (generic TypeScript
 * `Prisma.UserGetPayload<...>`, `$queryRaw<User[]>`, so sánh `depth < 10`), đầy
 * `->` trong kế hoạch EXPLAIN và `->>`/`@>` trong toán tử jsonb. `code()` tự
 * thoát `< > &`, nên đoạn mã trong đề luôn hiện đúng nguyên văn thay vì bị
 * trình duyệt nuốt mất một nửa.
 *
 * Sao chép từ docker-exam-kit.mjs; điểm khác: `sim()` gắn `fromCourse=prisma-orm`,
 * và rubric mô tả ngữ nghĩa Prisma (lược đồ hợp lệ và sinh ra đúng DDL, số câu
 * lệnh SQL thật sự gửi đi, hành vi dưới tranh chấp, ranh giới an toàn của SQL
 * thô) thay vì tầng ảnh và ranh giới mạng của Docker.
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

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `->>`, `<=`, generic… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=prisma-orm&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/** Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip). */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The artifact does what the question asks: the schema validates and generates the DDL described, the migration applies to the data given, and the code returns the rows the problem names — checked by running it, not by reading it.',
      'Hiện vật làm đúng thứ đề yêu cầu: lược đồ hợp lệ và sinh ra đúng DDL đã mô tả, migration áp được lên đúng bộ dữ liệu đã cho, và mã trả về đúng những dòng đề nêu — kiểm bằng cách CHẠY, không phải bằng cách đọc.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The Prisma decisions are right: the number of statements actually sent matches what the problem allows, the referential actions and indexes match the behaviour asked for, and anything derived from its own previous value is written atomically rather than read-then-written.',
      'Các quyết định Prisma đặt đúng chỗ: số câu lệnh thật sự gửi xuống đúng như đề cho phép, hành vi tham chiếu và chỉ mục khớp với hành vi đề yêu cầu, và mọi giá trị suy ra từ chính giá trị cũ của nó đều được ghi kiểu nguyên tử chứ không đọc-rồi-ghi.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable and safe: values reach SQL as bind parameters and never as concatenated text, types come from <code>@prisma/client</code> instead of being hand-copied, columns nobody reads are not selected, and the scaffold given in the question is left untouched.',
      'Dễ đọc và an toàn: giá trị vào SQL bằng tham số ràng buộc chứ không bao giờ bằng chuỗi nối, kiểu lấy từ <code>@prisma/client</code> chứ không chép tay, không chọn những cột chẳng ai đọc, và giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu thực hành). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Prisma ORM course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Practical</b> — write the schema block, the migration SQL or the client code straight into the editor in the exam room. It is graded by AI against the reference answer and a rubric.</li>' +
  '</ul>' +
  '<p>Read the query logs carefully: several questions turn on the difference between one statement and two, on whether an error code came from the client or from PostgreSQL, or on whether a value was computed before the insert or by the database. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Prisma ORM. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Thực hành</b> — gõ thẳng khối lược đồ, SQL migration hay mã client vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn log truy vấn: nhiều câu ăn thua ở chỗ phân biệt một câu lệnh với hai, ở chỗ một mã lỗi đến từ client hay từ PostgreSQL, hoặc ở chỗ một giá trị được tính trước lúc insert hay do chính cơ sở dữ liệu sinh ra. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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

/** Một câu thực hành: viết schema.prisma / migration SQL / mã Prisma Client. */
// `khongChayDuoc`: lý do bằng chữ vì sao scripts/exam-check.mjs KHÔNG chạy được
// lời giải câu này (cần một PostgreSQL sống, cần `prisma generate` chạy trước,
// lời giải là gói nhiều file…). Chỉ dùng khi ngôn ngữ vốn CHẠY ĐƯỢC — ngôn ngữ
// không chạy được thì bộ kiểm tự nhận ra qua nhãn. Seeder chọn field tường minh
// nên field này không vào DB.
//
// ⚠️ Nhãn `prisma` (ngôn ngữ lược đồ) KHÔNG nằm trong tập `KHONG_CHAY_DUOC` của
// `scripts/exam-check.mjs` — đo thật 08/09/2026 — nên câu nào khai
// `language: 'prisma'` cũng phải kèm `khongChayDuoc`, không thì bộ kiểm đưa file
// lược đồ cho node và báo một lỗi không có thật.
export const codeQ = ({ points, prompt, language = 'prisma', starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_CODE, khongChayDuoc }) => ({
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
