/**
 * Bộ khuôn dùng chung cho các đề thi khoá Observability & Monitoring
 * (FE, PE, và các PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Nếu phần EN hay phần VI tự
 * chứa thêm một dấu ống nữa thì bản tiếng Việt sẽ lòi cả đoạn tiếng Anh ra màn
 * hình.
 *
 * ⚠️⚠️ BẪY DẤU ỐNG RIÊNG CỦA KHOÁ NÀY — nặng hơn Docker và GitHub Actions.
 * Đề này đầy **PromQL** và đầy **LogQL**, mà cả hai đều dùng `|` như một toán
 * tử bình thường:
 *
 *   • LogQL của Loki xâu chuỗi bằng dấu ống, và một truy vấn thật rất hay có
 *     HAI hoặc BA đoạn ống liên tiếp:
 *         {app="x"} | json | status>=500
 *         {container="backend"} | json | ms > 1000 | line_format "{{.route}}"
 *     Viết sát nhau (`|json|status`) thì vô hại; nhưng gõ nhầm một dấu cách
 *     thành `| |` rồi lại xoá cách đi là ra `||`, và thêm một cái nữa là `|||`
 *     — lúc đó đề vỡ song ngữ mà bộ kiểm báo là "đang có 3 nửa".
 *   • PromQL không có toán tử ống, NHƯNG `sum(rate(...)) by (le)` hay đi kèm
 *     một dòng LogQL ngay bên cạnh trong cùng một khối mã, và các khối `expr: |`
 *     của luật cảnh báo YAML thì lại là dấu ống khối văn bản của YAML.
 *   • Và chuỗi log JSON trong đề chứa đầy `\"` — nếu bạn nối chúng bằng dấu ống
 *     cho gọn thì rất dễ đụng ba dấu liền nhau.
 *
 * LUẬT AN TOÀN, giống hệt `ghactions-exam-kit.mjs` đã phát biểu cho `||` của
 * biểu thức `${{ }}`: một dấu `|` thì vô hại, HAI dấu `||` cũng vô hại — nhưng
 * KHÔNG bao giờ được gõ BA dấu `|` liền nhau trong nội dung, kể cả trong khối
 * mã. Cần ba đoạn LogQL thì luôn viết có dấu cách quanh mỗi dấu ống
 * (`| json | ms > 1000`), đừng bao giờ để `x|||y`. Cần thật sự hiển thị ba dấu
 * ống thì phải cắt chuỗi hoặc dùng thực thể HTML.
 *
 * Vì sao có file này: đề Observability đầy dòng JSON có dấu ngoặc kép thoát
 * (`{\"level\":30,...}`), đầy nhãn Prometheus (`{le="0.025",method="GET"}`),
 * đầy so sánh (`ms > 1000`, `status>=500`, `le="+Inf"`) và đầy chuyển hướng
 * shell (`2>&1`, `-o /dev/null`). `code()` tự thoát `< > &`, nên đoạn mã trong
 * đề luôn hiện đúng nguyên văn thay vì bị trình duyệt nuốt mất một nửa.
 *
 * Sao chép từ docker-exam-kit.mjs; ba điểm khác:
 *   • `sim()` gắn `fromCourse=observability-monitoring`;
 *   • `RUBRIC_CODE` mô tả ngữ nghĩa QUAN TRẮC (log có cấu trúc và nối được, chỉ
 *     số đúng loại, nhãn không nổ lực lượng, trace nối được qua ranh giới, cảnh
 *     báo dựa trên triệu chứng người dùng thấy) thay vì ngữ nghĩa ảnh/container
 *     của Docker;
 *   • `codeQ()` mặc định `language: 'javascript'` (khoá này viết hiện vật chạy
 *     được bằng Node), và giữ nguyên đường cho `khongChayDuoc` — xem chú thích
 *     tại chỗ.
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

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `le="+Inf"`, `ms > 1000`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=observability-monitoring&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/**
 * Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip).
 *
 * Ba trục, theo đúng thứ tự một người rà soát phần đo đạc đọc:
 *   1. NÓ CÓ CHẠY KHÔNG — và có PHÁT RA đúng thứ đề đòi. Ở Docker câu hỏi là
 *      "ảnh dựng được chưa"; ở đây câu hỏi là "endpoint có in ra đúng những
 *      dòng ấy không, dòng log có đúng những trường ấy không". Một bộ đo đạc
 *      chạy được mà phát ra sai hình dạng thì hỏng y như không chạy, chỉ khác
 *      là nó hỏng trong im lặng và người ta vẫn dựng bảng theo dõi trên nó.
 *   2. NGỮ NGHĨA QUAN TRẮC ĐẶT ĐÚNG CHỖ — counter chỉ tăng, gauge lên xuống
 *      được, thời lượng đi vào histogram chứ không phải gauge; nhãn có chặn
 *      (route theo khuôn `/notes/:id`, không phải URL thật) nên không nổ lực
 *      lượng; ngữ cảnh request theo được qua `await` sâu và qua ranh giới dịch
 *      vụ bằng `traceparent`; và cái được cảnh báo là triệu chứng người dùng
 *      thấy, không phải một con số tài nguyên.
 *   3. AN TOÀN VÀ ĐỌC ĐƯỢC — không có bí mật, token hay dữ liệu cá nhân lọt
 *      vào dòng log hay vào nhãn; thông điệp log ổn định còn phần biến thiên
 *      nằm ở trường; mọi trường có giới hạn kích thước; và giữ nguyên khung đề.
 */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The artifact does what the question asks and emits exactly the shape it asks for: the endpoint or the log line produces the named fields, suffixes and labels, and the behaviour described in the problem is observable by running the exact commands given.',
      'Hiện vật làm đúng thứ đề yêu cầu và phát ra ĐÚNG hình dạng đề đòi: endpoint hay dòng log sinh ra đúng những trường, hậu tố và nhãn đã nêu, và hành vi mô tả trong đề quan sát được bằng đúng những câu lệnh đã cho.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The observability decisions are right: each metric has the type its question needs (a counter that only rises, a gauge that may fall, a histogram for durations), every label is bounded so cardinality cannot grow with traffic, request context survives deep <code>await</code> chains and crosses service boundaries through <code>traceparent</code>, and what is alerted on is a symptom a user feels rather than a resource number.',
      'Các quyết định quan trắc đặt đúng chỗ: mỗi chỉ số mang đúng loại mà câu hỏi của nó cần (counter chỉ tăng, gauge được phép giảm, histogram cho thời lượng), mọi nhãn đều có chặn nên lực lượng không thể phình theo lưu lượng, ngữ cảnh request sống sót qua các chuỗi <code>await</code> sâu và đi qua được ranh giới dịch vụ bằng <code>traceparent</code>, và thứ được cảnh báo là một triệu chứng người dùng cảm thấy chứ không phải một con số tài nguyên.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Readable and safe: no secret, token or personal data reaches a log field or a metric label, event names stay stable per call site with the variable parts in fields, every field is bounded in size, durations are recorded in seconds and counters end in <code>_total</code>, and the scaffold given in the question is left untouched.',
      'Dễ đọc và an toàn: không bí mật, token hay dữ liệu cá nhân nào lọt vào một trường log hay một nhãn chỉ số, tên sự kiện giữ ổn định theo từng chỗ gọi còn phần biến thiên nằm ở các trường, mọi trường đều có giới hạn kích thước, thời lượng ghi bằng GIÂY và counter kết thúc bằng <code>_total</code>, và giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu thực hành). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Observability &amp; Monitoring course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Practical</b> — write the logger, the metric definition, the middleware or the query straight into the editor in the exam room. It is graded by AI against the reference answer and a rubric.</li>' +
  '</ul>' +
  '<p>Read the transcripts carefully: several questions turn on the difference between a number that is missing and a number that is wrong, on which suffix a histogram series carries, or on whether a green check was measuring anything at all. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Quan trắc &amp; Giám sát. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Thực hành</b> — gõ thẳng bộ log, phần khai báo chỉ số, middleware hay truy vấn vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn output: nhiều câu ăn thua ở chỗ phân biệt một con số THIẾU với một con số SAI, ở chỗ một chuỗi histogram mang hậu tố nào, hoặc ở chỗ một phép kiểm xanh có thật sự đo được gì không. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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

/** Một câu thực hành: viết logger / bộ chỉ số / middleware / truy vấn. */
// `khongChayDuoc`: lý do bằng chữ vì sao scripts/exam-check.mjs KHÔNG chạy được
// lời giải câu này (cần một thư viện phải cài, cần một máy chủ sống, cần mạng,
// cần tham số dòng lệnh…). CHỈ dùng khi ngôn ngữ vốn CHẠY ĐƯỢC (javascript /
// typescript / bash) — ngôn ngữ khai báo thì bộ kiểm tự nhận ra qua nhãn, và
// `yaml` đã NẰM SẴN trong tập `KHONG_CHAY_DUOC` của `scripts/exam-check.mjs`,
// nên một câu `language: 'yaml'` KHÔNG cần và KHÔNG nên khai field này.
//
// ⚠️ Với khoá này lý do hay gặp nhất là: bộ kiểm chạy lời giải trong một thư
// mục tạm (`mkdtemp` dưới `os.tmpdir()`) KHÔNG có `node_modules`, nên mọi
// `require('prom-client')` / `require('pino')` / `require('@opentelemetry/...')`
// đều chết bằng `MODULE_NOT_FOUND`. Đó là một lý do hợp lệ — nhưng vẫn phải
// chạy thật Ở NGOÀI rồi chép kết quả vào chú thích đầu file.
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
