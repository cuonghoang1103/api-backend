/**
 * Bộ khuôn dùng chung cho các đề thi khoá Media Processing (FE, PE, và các PT
 * về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Nếu phần EN hay phần VI tự
 * chứa thêm một dấu ống nữa thì bản tiếng Việt sẽ lòi cả đoạn tiếng Anh ra màn
 * hình. Khoá này dễ dính ở hai chỗ RIÊNG của nó, và cả hai đều nằm trong lệnh
 * ffmpeg:
 *
 *   • **Bộ lọc `-vf` viết dài kèm dấu hai chấm** — ví dụ
 *     `-vf "scale=-2:720:force_original_aspect_ratio=decrease"`. Một dấu `|`
 *     không xuất hiện ở đây, nhưng chuỗi thì dài, nên khi cắt dòng người ta hay
 *     nối bằng ống cho gọn. Đừng.
 *   • **Filtergraph dùng dấu `|` làm dấu ngăn** — `[0:a][1:a]amix=inputs=2`,
 *     `split=3[a][b][c]`, `select='eq(pict_type\,I)'`, và nhất là những chỗ ống
 *     là cú pháp thật của ffmpeg: `-var_stream_map "v:0,a:0 v:1,a:1"`,
 *     `movflags frag_keyframe+empty_moov`, hay danh sách lựa chọn kiểu
 *     `yuv420p|yuv422p|yuv444p` trong thông báo lỗi của libx264.
 *
 * Một dấu `|` thì vô hại, HAI dấu `||` cũng vô hại — nhưng KHÔNG bao giờ được
 * gõ BA dấu `|` liền nhau trong nội dung, kể cả trong khối mã. Muốn liệt kê ba
 * pixel format thì viết `yuv420p | yuv422p | yuv444p` có dấu cách, hoặc tách
 * thành ba dòng. `x|||y` thì tuyệt đối không.
 *
 * Vì sao có file này: đề Media Processing đầy argv của ffmpeg (`-c:v`, `-b:a`,
 * `2>&1`), đầy chuỗi bộ lọc có `<` `>` (`scale=-2:'min(720,ih)'`), đầy JSON của
 * `ffprobe`, và đầy SVG (`<svg>`, `<script>`) trong chương bảo mật. `code()` tự
 * thoát `< > &`, nên đoạn mã trong đề luôn hiện đúng nguyên văn thay vì bị
 * trình duyệt nuốt mất một nửa — với SVG thì đó là khác biệt giữa "hiện mã" và
 * "trình duyệt vẽ luôn hình tròn xanh".
 *
 * Sao chép từ docker-exam-kit.mjs; hai điểm khác:
 *   • `sim()` gắn `fromCourse=media-processing`;
 *   • `RUBRIC_CODE` mô tả ngữ nghĩa XỬ LÝ MEDIA (giữ đúng tỉ lệ và hướng xoay
 *     EXIF, không giải mã cả file vào RAM, chọn codec/bitrate có lý do, dọn file
 *     tạm) thay vì ngữ nghĩa ảnh/container của Docker.
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

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `-pix_fmt yuv420p`, `2>&1`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=media-processing&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/**
 * Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip).
 *
 * Ba trục, theo đúng thứ tự một người rà soát đường ống media đọc:
 *   1. HIỆN VẬT RA ĐÚNG CHƯA — và đúng ở đây nghĩa là ĐO ĐƯỢC trên chính file
 *      xuất ra, không phải "hàm đã trả về". Ở Docker câu hỏi là "ảnh dựng được
 *      chưa"; ở đây câu hỏi là "mở file ra thì `ffprobe`/`metadata()` nói gì" —
 *      vì cả hai bug thật của khoá đều trả HTTP 200 và ghi ra file hợp lệ.
 *   2. CÁC QUYẾT ĐỊNH MEDIA ĐẶT ĐÚNG CHỖ — tỉ lệ khung hình và hướng xoay EXIF
 *      giữ nguyên, không phóng to thứ vốn nhỏ, không giải mã cả file vào RAM khi
 *      chảy dòng được, và codec/bitrate/CRF chọn có lý do nói ra được.
 *   3. AN TOÀN VÀ DỌN DẸP — argv chứ không phải chuỗi shell, ngân sách pixel
 *      tính cả số frame, thời lượng có trần, file tạm biến mất trên MỌI nhánh.
 */
export const RUBRIC_CODE = [
  {
    id: 'correct',
    criterion: B(
      'The artifact does what the question asks, and it is provable from the OUTPUT file rather than from the code: <code>ffprobe</code> or <code>metadata()</code> on the result reports the dimensions, orientation, frame count, pixel format, codec and duration the problem named.',
      'Hiện vật làm đúng thứ đề yêu cầu, và chứng minh được từ chính FILE XUẤT RA chứ không phải từ mã: <code>ffprobe</code> hoặc <code>metadata()</code> chạy trên kết quả báo đúng kích thước, hướng xoay, số frame, pixel format, codec và thời lượng mà đề đã nêu.',
    ),
    weight: 3,
    maxScore: 4,
  },
  {
    id: 'logic',
    criterion: B(
      'The media decisions are right: the aspect ratio and the EXIF orientation survive the transform, nothing smaller than the target is upscaled, the data is streamed rather than decoded whole into RAM when the format allows it, and the codec, container, quality knob and bitrate are each a choice the answer can justify against the stated use.',
      'Các quyết định về media đặt đúng chỗ: tỉ lệ khung hình và hướng xoay EXIF sống sót qua phép biến đổi, không phóng to thứ vốn nhỏ hơn đích, dữ liệu được chảy dòng thay vì giải mã cả file vào RAM khi định dạng cho phép, và codec, container, núm chất lượng cùng bitrate đều là lựa chọn mà lời giải biện minh được theo đúng mục đích đề nêu.',
    ),
    weight: 2,
    maxScore: 4,
  },
  {
    id: 'quality',
    criterion: B(
      'Safe and tidy: the external tool is invoked with an argv array and never a shell string, the input budget counts pixels (frames included) and duration rather than bytes, every child process has a timeout and a drained <code>stderr</code>, and every temporary file is removed on the success path, the failure path and the timeout path alike.',
      'An toàn và gọn gàng: công cụ ngoài được gọi bằng mảng argv chứ không bao giờ bằng chuỗi shell, ngân sách đầu vào đếm PIXEL (tính cả số frame) và thời lượng chứ không đếm byte, mọi tiến trình con đều có timeout và có rút cạn <code>stderr</code>, và mọi file tạm đều biến mất trên cả nhánh thành công, nhánh lỗi lẫn nhánh quá hạn.',
    ),
    weight: 1,
    maxScore: 4,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu thực hành). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Media Processing course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Practical</b> — write the Sharp pipeline, the ffmpeg argv array or the guard function straight into the editor in the exam room. It is graded by AI against the reference answer and a rubric.</li>' +
  '</ul>' +
  '<p>Read the transcripts carefully: several questions turn on the difference between a file that failed and one that quietly produced the wrong thing, on which side of <code>-i</code> a flag sits, or on what <code>metadata()</code> says <em>before</em> a single pixel has been decoded. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Media Processing. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Thực hành</b> — gõ thẳng chuỗi Sharp, mảng argv của ffmpeg hay hàm chốt chặn vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn terminal: nhiều câu ăn thua ở chỗ phân biệt một file ĐÃ HỎNG với một file âm thầm ra SAI THỨ, ở chỗ một cái cờ nằm bên nào của <code>-i</code>, hoặc ở chỗ <code>metadata()</code> nói gì TRƯỚC khi một pixel nào được giải mã. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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

/** Một câu thực hành: viết chuỗi Sharp / argv ffmpeg / hàm chốt chặn. */
// `khongChayDuoc`: lý do bằng chữ vì sao scripts/exam-check.mjs KHÔNG chạy được
// lời giải câu này. Ở khoá này lý do gần như luôn là một trong hai thứ đo được:
// (1) lời giải `require('sharp')`, mà bộ kiểm chạy trong một thư mục tạm KHÔNG
// có node_modules ⇒ MODULE_NOT_FOUND; (2) lời giải cần nhị phân `ffmpeg` cùng
// các file mẫu, mà thư mục tạm không có file nào. CHỈ dùng khi ngôn ngữ vốn
// CHẠY ĐƯỢC (javascript/typescript/bash) — ngôn ngữ khai báo thì bộ kiểm tự
// nhận ra qua nhãn. Bắt buộc kèm lý do bằng chữ ⇒ không ai miễn được trong im
// lặng. Seeder chọn field tường minh nên field này không vào DB.
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
