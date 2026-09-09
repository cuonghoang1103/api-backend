/**
 * Bộ khuôn dùng chung cho các đề thi khoá GitHub Actions (FE, PE, và các PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Nếu phần EN hay phần VI tự
 * chứa thêm một dấu ống nữa thì bản tiếng Việt sẽ lòi cả đoạn tiếng Anh ra màn
 * hình. Khoá này dễ dính ở hai chỗ RIÊNG của nó: một là khối `run: |` của YAML
 * (dấu ống khối văn bản), hai là toán tử `||` trong biểu thức
 * `${{ github.event_name == 'push' || github.event_name == 'schedule' }}`.
 * Một dấu `|` thì vô hại, HAI dấu `||` cũng vô hại — nhưng KHÔNG bao giờ được
 * gõ BA dấu `|` liền nhau trong nội dung, kể cả trong khối mã. Muốn viết ba
 * nhánh `a || b || c` thì thêm dấu cách: `a || b || c` vốn đã có cách sẵn, còn
 * `x|||y` thì tuyệt đối không.
 *
 * Vì sao có file này: đề GitHub Actions đầy YAML lồng nhau, đầy biểu thức
 * `${{ }}`, đầy chuyển hướng shell (`2>&1`, `>>$GITHUB_OUTPUT`) và đầy mẫu glob
 * (`**`, `!docs/**`). `code()` tự thoát `< > &`, nên đoạn mã trong đề luôn hiện
 * đúng nguyên văn thay vì bị trình duyệt nuốt mất một nửa.
 *
 * Sao chép từ docker-exam-kit.mjs; ba điểm khác:
 *   • `sim()` gắn `fromCourse=github-actions`;
 *   • `RUBRIC_CODE` mô tả ngữ nghĩa GitHub Actions (workflow kích hoạt đúng
 *     lúc, đồ thị job đúng, quyền tối thiểu, bí mật không đi qua `run:`) thay
 *     vì ngữ nghĩa ảnh/container của Docker;
 *   • `codeQ()` giữ nguyên đường cho `khongChayDuoc` — xem chú thích tại chỗ.
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

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `${{ }}`, `2>&1`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=github-actions&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/**
 * Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip).
 *
 * Ba trục, theo đúng thứ tự một người rà soát workflow đọc:
 *   1. NÓ CÓ CHẠY KHÔNG — và chạy ĐÚNG LÚC. Ở Docker câu hỏi là "ảnh dựng được
 *      chưa"; ở đây câu hỏi thêm một vế nữa, vì một workflow đúng cú pháp mà
 *      không bao giờ được kích hoạt thì hỏng y như một workflow đỏ, chỉ khác là
 *      nó hỏng trong im lặng.
 *   2. CÁC QUYẾT ĐỊNH CI ĐẶT ĐÚNG CHỖ — đồ thị `needs:`, ma trận, cache có khoá
 *      đổi đúng lúc nội dung đổi, `if:` nổ đúng nhánh, `concurrency` chọn đúng
 *      giữa huỷ và xếp hàng.
 *   3. AN TOÀN VÀ ĐỌC ĐƯỢC — `permissions:` tối thiểu, bí mật đi qua `env:` chứ
 *      không nội suy thẳng vào `run:`, action ghim được, và giữ nguyên khung đề.
 */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The workflow does what the question asks, and fires when the question says it should: it parses, every job reaches the runner, the triggers and filters select exactly the events named in the problem, and the outcome is visible in the run the question describes.',
      'Workflow làm đúng thứ đề yêu cầu, và nổ đúng lúc đề nói: nó phân giải được, mọi job tới được runner, các trigger và bộ lọc chọn đúng những sự kiện nêu trong đề, và kết quả quan sát được trong đúng lần chạy mà đề mô tả.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The CI decisions are right: the <code>needs:</code> graph puts on the critical path only what belongs there, cache keys change exactly when the cached content should, matrix legs expand to the count the problem asks for, and every <code>if:</code> fires on the branch it was written for.',
      'Các quyết định CI đặt đúng chỗ: đồ thị <code>needs:</code> chỉ đặt lên đường tới hạn thứ đáng nằm đó, khoá cache đổi đúng lúc nội dung cần đổi, ma trận bung ra đúng số nhánh đề yêu cầu, và mọi <code>if:</code> đều nổ đúng nhánh nó được viết cho.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable and safe: a least-privilege <code>permissions:</code> block, secrets reaching the shell through <code>env:</code> rather than interpolated into <code>run:</code>, third-party actions pinned, a <code>timeout-minutes</code> on every job, and the scaffold given in the question left untouched.',
      'Dễ đọc và an toàn: một khối <code>permissions:</code> theo quyền tối thiểu, bí mật tới shell qua <code>env:</code> chứ không nội suy thẳng vào <code>run:</code>, action của bên thứ ba có ghim, mọi job có <code>timeout-minutes</code>, và giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu thực hành). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the GitHub Actions course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Practical</b> — write the workflow, the job block or the expression straight into the editor in the exam room. It is graded by AI against the reference answer and a rubric.</li>' +
  '</ul>' +
  '<p>Read the YAML carefully: several questions turn on the difference between a workflow that is red and one that never ran, on which side of a filter a path sits, or on what an expression evaluates to before the shell ever sees it. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá GitHub Actions. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Thực hành</b> — gõ thẳng workflow, khối job hay biểu thức vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ YAML: nhiều câu ăn thua ở chỗ phân biệt một workflow ĐỎ với một workflow CHƯA TỪNG CHẠY, ở chỗ một đường dẫn nằm bên nào của bộ lọc, hoặc ở chỗ một biểu thức được tính ra cái gì TRƯỚC khi shell kịp nhìn thấy. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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

/** Một câu thực hành: viết workflow / composite action / script CI. */
// `khongChayDuoc`: lý do bằng chữ vì sao scripts/exam-check.mjs KHÔNG chạy được
// lời giải câu này (gói nhiều file, cần một runner thật, cần API của GitHub,
// cần tham số dòng lệnh…). CHỈ dùng khi ngôn ngữ vốn CHẠY ĐƯỢC (bash/js/ts) —
// ngôn ngữ khai báo thì bộ kiểm tự nhận ra qua nhãn, và `yaml` NẰM SẴN trong
// tập `KHONG_CHAY_DUOC` của `scripts/exam-check.mjs`, nên một câu
// `language: 'yaml'` KHÔNG cần và KHÔNG nên khai field này.
// Seeder chọn field tường minh nên field này không vào DB.
export const codeQ = ({ points, prompt, language = 'yaml', starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_CODE, khongChayDuoc }) => ({
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
