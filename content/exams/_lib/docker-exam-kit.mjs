/**
 * Bộ khuôn dùng chung cho các đề thi khoá Docker (FE, PE, và các PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Nếu phần EN hay phần VI tự
 * chứa thêm một dấu ống nữa thì bản tiếng Việt sẽ lòi cả đoạn tiếng Anh ra màn
 * hình. Khoá này dễ dính vì shell dùng ký tự `|` liên tục (`docker ps | grep`,
 * `{{.Name}} | {{.Status}}`) — một dấu `|` thì vô hại, nhưng KHÔNG bao giờ
 * được gõ ba dấu `|` liền nhau trong nội dung, kể cả trong khối mã.
 *
 * Vì sao có file này: đề Docker đầy khuôn Go template (`{{.State.ExitCode}}`),
 * đầy YAML và đầy chuyển hướng shell (`2>&1`, `>/dev/null`). `code()` tự thoát
 * `< > &`, nên đoạn mã trong đề luôn hiện đúng nguyên văn thay vì bị trình
 * duyệt nuốt mất một nửa.
 *
 * Sao chép từ typescript-exam-kit.mjs; điểm khác: `sim()` gắn
 * `fromCourse=docker`, và rubric mô tả ngữ nghĩa Docker (ảnh dựng được, container
 * chạy được, ranh giới mạng, tầng ảnh) thay vì hệ kiểu TypeScript.
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

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `-p 8080:80`, `2>&1`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=docker&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/** Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip). */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The artifact does what the question asks: the image builds, the container starts and stays up, and the behaviour named in the problem is observable with the commands given.',
      'Hiện vật làm đúng thứ đề yêu cầu: ảnh dựng được, container khởi động và trụ được, và hành vi nêu trong đề quan sát được bằng đúng những câu lệnh đã cho.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The Docker decisions are right: instruction order protects the cache, nothing that only the build needed reaches the final stage, and ports, mounts and networks match what the problem asked for.',
      'Các quyết định Docker đặt đúng chỗ: thứ tự chỉ thị giữ được cache, không có thứ gì chỉ phục vụ lúc dựng lọt vào tầng cuối, và cổng, mount, mạng đúng như đề yêu cầu.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable and safe: exec-form <code>CMD</code>, a non-root <code>USER</code>, pinned image tags, no secret baked into a layer, and the scaffold given in the question left untouched.',
      'Dễ đọc và an toàn: <code>CMD</code> dạng exec, <code>USER</code> không phải root, tag ảnh có ghim, không có bí mật nào nướng vào tầng ảnh, và giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu thực hành). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Docker course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Practical</b> — write the Dockerfile, the compose service or the command straight into the editor in the exam room. It is graded by AI against the reference answer and a rubric.</li>' +
  '</ul>' +
  '<p>Read the transcripts carefully: several questions turn on the difference between a container that never started and one that started and died, on which side of the image name a flag sits, or on what an exit code actually means. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Docker. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Thực hành</b> — gõ thẳng Dockerfile, khối dịch vụ compose hay câu lệnh vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn terminal: nhiều câu ăn thua ở chỗ phân biệt một container chưa từng khởi động với một container đã chạy rồi chết, ở chỗ một cái cờ nằm bên nào của tên ảnh, hoặc ở chỗ một mã thoát thật ra nghĩa là gì. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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

/** Một câu thực hành: viết Dockerfile / compose / script. */
// `khongChayDuoc`: lý do bằng chữ vì sao scripts/exam-check.mjs KHÔNG chạy được
// lời giải câu này (gói nhiều file, cần daemon, cần tham số dòng lệnh…). Chỉ
// dùng khi ngôn ngữ vốn CHẠY ĐƯỢC — ngôn ngữ không chạy được thì bộ kiểm tự
// nhận ra qua nhãn. Seeder chọn field tường minh nên field này không vào DB.
export const codeQ = ({ points, prompt, language = 'dockerfile', starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_CODE, khongChayDuoc }) => ({
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
