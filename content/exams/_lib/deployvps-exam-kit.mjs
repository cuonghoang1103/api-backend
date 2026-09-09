/**
 * Bộ khuôn dùng chung cho các đề thi khoá Deploy VPS (FE, PE, và các PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Nếu phần EN hay phần VI tự
 * chứa thêm một dấu ống nữa thì bản tiếng Việt sẽ lòi cả đoạn tiếng Anh ra màn
 * hình.
 *
 * KHOÁ NÀY DỄ DÍNH HƠN MỌI KHOÁ KHÁC, và dính ở ba chỗ RIÊNG của nó — cả ba
 * đều là dấu ống của SHELL, thứ có mặt trong gần như mọi câu:
 *
 *   1. Ống nối lệnh: `ps aux | grep node`, `df -h | tail -1`,
 *      `ls -1t | tail -n +15 | xargs -r rm -f`. Một câu lệnh chẩn đoán thật
 *      thường có HAI hoặc BA dấu `|` — chúng nằm cách nhau bởi dấu cách nên
 *      vô hại, nhưng chỉ cần một lần gõ dính `a|b|c` không có cách là hỏng.
 *   2. Chuyển hướng kèm ống: `bash deploy.sh 2>&1 | tee nhat-ky.log`.
 *   3. Toán tử `||` trong chính script deploy: `flock -n 9 || exit 1`,
 *      `nginx -t && nginx -s reload || lui-lai`. Một dấu `|` vô hại, HAI dấu
 *      `||` cũng vô hại — nhưng TUYỆT ĐỐI không bao giờ được để BA dấu `|`
 *      đứng liền nhau trong nội dung, kể cả bên trong khối mã.
 *
 * Luật thực hành: muốn viết `a || b` thì giữ nguyên dấu cách hai bên (`a || b`
 * vốn đã an toàn); muốn viết một ống ngay sau một `||` thì thêm dấu cách —
 * `x || y | z` an toàn, còn `x ||y|z` thì KHÔNG. Trước khi nộp, chạy:
 *   node -e "import('./content/exams/DEPLOY-VPS-FE.mjs').then(m=>{const s=JSON.stringify(m.default);console.log(/\|\|\|\|/.test(s)?'CO BON DAU ONG — HONG':'ok')})"
 *
 * Vì sao có file này: đề Deploy VPS đầy đường dẫn (`/srv/app/hien-tai`), đầy
 * chuyển hướng shell (`2>&1`, `>/dev/null`, `9>&-`), đầy so sánh trong ngoặc
 * vuông (`[ ! -t 0 ]`), đầy mã trạng thái HTTP và mã thoát, và đầy đoạn
 * cấu hình nginx/systemd. `code()` tự thoát `< > &`, nên đoạn mã trong đề luôn
 * hiện đúng nguyên văn thay vì bị trình duyệt nuốt mất một nửa.
 *
 * Sao chép từ docker-exam-kit.mjs; ba điểm khác:
 *   • `sim()` gắn `fromCourse=deploy-vps`;
 *   • `RUBRIC_CODE` mô tả ngữ nghĩa DEPLOY (tráo ảnh/bản phát hành mà không
 *     mất phiên, migration áp đúng thứ tự và lùi được, bí mật không lọt vào
 *     ảnh hay log, và bước kiểm phải CHẶN được lần deploy) thay vì ngữ nghĩa
 *     ảnh/container của Docker;
 *   • `codeQ()` mặc định `language: 'bash'` — thứ học viên viết ở khoá này là
 *     script deploy, chứ không phải Dockerfile. Xem chú thích tại chỗ về
 *     `khongChayDuoc`.
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

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `2>&1`, `9>&-`, `[ -t 0 ]`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=deploy-vps&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/**
 * Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip).
 *
 * Ba trục, theo đúng thứ tự một người rà soát một lần deploy đọc:
 *   1. NÓ CÓ CHẠY KHÔNG — và người dùng có thấy được kết quả không. Ở Docker
 *      câu hỏi là "ảnh dựng được chưa"; ở đây câu hỏi là "cửa TRƯỚC có trả về
 *      đúng phiên bản vừa tráo không", vì cả khoá này là một chuỗi ví dụ mà
 *      máy chủ nói CÓ trong khi người dùng nhận bản cũ.
 *   2. CÁC QUYẾT ĐỊNH DEPLOY ĐẶT ĐÚNG CHỖ — bước tráo là thao tác nguyên tử và
 *      nằm CUỐI, migration áp trước và an toàn với mã CŨ, cú lùi khôi phục cả
 *      TIẾN TRÌNH chứ không chỉ con trỏ, và chạy lại lần hai không sinh thêm
 *      thiệt hại.
 *   3. AN TOÀN VÀ ĐỌC ĐƯỢC — bí mật sống ngoài tạo tác, không nướng vào ảnh và
 *      không rơi vào nhật ký; mọi lời từ chối có mã thoát riêng; và giữ nguyên
 *      phần khung đề cho sẵn.
 */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The artifact does what the question asks, and the result is visible from the front door: the script runs to completion on the happy path, the version actually being served is the one that was just swapped in, and the behaviour named in the problem is observable with the exact commands given.',
      'Hiện vật làm đúng thứ đề yêu cầu, và kết quả nhìn thấy được từ CỬA TRƯỚC: script chạy hết đường thành công, phiên bản đang thật sự được phục vụ đúng là bản vừa tráo vào, và hành vi nêu trong đề quan sát được bằng đúng những câu lệnh đã cho.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The deploy decisions are right: the swap is one atomic operation and it comes last, migrations run before the swap and leave the <em>previous</em> release able to run, the rollback path restores the process and not merely the pointer, and running the whole thing twice leaves the same end state.',
      'Các quyết định deploy đặt đúng chỗ: bước tráo là MỘT thao tác nguyên tử và nằm CUỐI, migration chạy trước bước tráo và để lại một lược đồ mà bản phát hành TRƯỚC vẫn chạy được, đường lùi khôi phục cả TIẾN TRÌNH chứ không chỉ con trỏ, và chạy lại toàn bộ lần hai vẫn ra cùng một trạng thái.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable and safe: <code>set -euo pipefail</code> with the traps it does not cover handled by hand, every refusal carrying its own exit code, secrets read from outside the artifact and never echoed into a log or baked into an image, cleanup on every exit path, and the scaffold given in the question left untouched.',
      'Dễ đọc và an toàn: <code>set -euo pipefail</code> kèm xử lý tay cho những ca mà nó KHÔNG bắt được, mọi lời từ chối mang mã thoát riêng, bí mật đọc từ ngoài tạo tác và không bao giờ in ra nhật ký hay nướng vào ảnh, dọn dẹp trên MỌI đường ra, và giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu thực hành). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Deploy VPS course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Practical</b> — write the deploy script, the migration or the check straight into the editor in the exam room. It is graded by AI against the reference answer and a rubric.</li>' +
  '</ul>' +
  '<p>Read the transcripts carefully: several questions turn on the difference between a step that failed and a step that <em>refused</em>, on which of two exit codes a command actually returned, or on what the front door served while the machine insisted it had already rolled back. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Deploy VPS. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Thực hành</b> — gõ thẳng script deploy, migration hay phép kiểm vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn terminal: nhiều câu ăn thua ở chỗ phân biệt một bước HỎNG với một bước TỪ CHỐI, ở chỗ một câu lệnh thật ra trả mã thoát nào trong hai mã, hoặc ở chỗ cửa TRƯỚC đang phục vụ cái gì trong lúc máy chủ khăng khăng là đã lùi xong. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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

/** Một câu thực hành: viết script deploy / migration / cấu hình dịch vụ. */
// `khongChayDuoc`: lý do bằng chữ vì sao scripts/exam-check.mjs KHÔNG chạy được
// lời giải câu này (cần một máy chủ thứ hai, một daemon sống, một cơ sở dữ liệu,
// quyền root, hay nhiều tệp trong một thư mục). CHỈ dùng khi ngôn ngữ vốn CHẠY
// ĐƯỢC — với khoá này thì `bash` là mặc định và bộ kiểm CHẠY THẬT bằng
// /bin/bash, nên gần như mọi câu PE ở đây đều phải khai field này kèm lý do.
// Ngôn ngữ KHAI BÁO thì bộ kiểm tự nhận ra qua nhãn: `yaml`, `dockerfile`,
// `nginx`, `conf`, `ini`, `toml`, `sql` đã nằm sẵn trong tập `KHONG_CHAY_DUOC`
// của `scripts/exam-check.mjs`, nên một câu `language: 'nginx'` hay
// `language: 'sql'` KHÔNG cần và KHÔNG nên khai field này.
// Seeder chọn field tường minh nên field này không vào DB.
export const codeQ = ({ points, prompt, language = 'bash', starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_CODE, khongChayDuoc }) => ({
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
