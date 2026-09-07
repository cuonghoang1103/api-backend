/**
 * Bộ khuôn dùng chung cho các đề thi khoá Nginx (FE, PE, và các PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Nếu phần EN hay phần VI tự
 * chứa thêm một dấu ống nữa thì bản tiếng Việt sẽ lòi cả đoạn tiếng Anh ra màn
 * hình. Khoá này dễ dính vì cấu hình Nginx dùng ký tự `|` trong regex
 * (`~*\.(css|js|png)$`, `map` với `~*bot|crawler`) — một hay hai dấu `|` thì vô
 * hại, nhưng KHÔNG bao giờ được gõ ba dấu `|` liền nhau trong nội dung, kể cả
 * trong khối mã. Cách né gọn nhất: viết `(css|js)` chứ đừng viết `(a||b)`.
 *
 * Vì sao có file này: đề Nginx đầy dấu `$` (biến), đầy dấu `~` và `^` (regex
 * location), và đầy dấu `<` `>` trong output của `curl -I` cùng thân lỗi HTML
 * (`<html><head><title>404 Not Found</title>`). `code()` tự thoát `< > &`, nên
 * đoạn cấu hình và đoạn terminal trong đề luôn hiện đúng nguyên văn thay vì bị
 * trình duyệt nuốt mất một nửa.
 *
 * Sao chép từ docker-exam-kit.mjs; hai điểm khác:
 *   • `sim()` gắn `fromCourse=nginx`;
 *   • `RUBRIC_CODE` mô tả ngữ nghĩa Nginx (cấu hình nạp được, khối nào bắt
 *     request, dấu gạch chéo ở proxy_pass/alias, danh sách header bị khối con
 *     xoá, chỉ thị đặt đúng PHA xử lý) thay vì ảnh/tầng/mạng của Docker.
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

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `location ~ \.php$`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=nginx&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/**
 * Rubric dùng lại cho mọi câu lập trình (PT/FE làm tại chỗ và PE nộp .zip).
 *
 * Bốn tiêu chí × 0,5 điểm = 2 điểm, đúng bằng `points` mặc định của một câu PE
 * trong khoá này, và `weight === maxScore` ở mọi dòng nên điểm từng tiêu chí
 * cộng thẳng ra điểm câu, không phải quy đổi.
 */
export const RUBRIC_CODE = [
  {
    id: 'loads',
    criterion: B(
      'The configuration loads: <code>nginx -t</code> is clean and the container stays up. A file that only Nginx refuses to start on scores nothing here, however good the intent.',
      'Cấu hình nạp được: <code>nginx -t</code> sạch và container trụ được. Một tệp mà chính Nginx từ chối khởi động thì không được điểm ở dòng này, dù ý đồ có hay tới đâu.',
    ),
    weight: 0.5,
    maxScore: 0.5,
  },
  {
    id: 'routing',
    criterion: B(
      'The right block catches the right request: the location type and its priority are chosen on purpose, and the trailing slash on <code>alias</code> and <code>proxy_pass</code> is on the side the question needs.',
      'Đúng khối bắt đúng request: loại location và mức ưu tiên của nó được chọn có chủ đích, và dấu gạch chéo cuối của <code>alias</code> với <code>proxy_pass</code> nằm đúng phía mà đề cần.',
    ),
    weight: 0.5,
    maxScore: 0.5,
  },
  {
    id: 'observable',
    criterion: B(
      'The behaviour the question names is observable with the exact commands given: the status code, the header and the body are what the expected-output block shows, not merely plausible.',
      'Hành vi mà đề nêu tên quan sát được bằng đúng những câu lệnh đã cho: mã trạng thái, header và thân trả về đúng như khối kết quả mong đợi, chứ không phải chỉ nghe hợp lý.',
    ),
    weight: 0.5,
    maxScore: 0.5,
  },
  {
    id: 'safety',
    criterion: B(
      'Readable and safe: no inherited header list silently wiped by a child block, no directive placed in a phase where it never runs, no internal route left reachable, and the given scaffold untouched.',
      'Dễ đọc và an toàn: không có danh sách header kế thừa nào bị khối con xoá âm thầm, không có chỉ thị nào đặt vào cái pha mà nó không bao giờ chạy, không có tuyến nội bộ nào còn với tới được, và giữ nguyên phần khung đề cho sẵn.',
    ),
    weight: 0.5,
    maxScore: 0.5,
  },
];

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu thực hành). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Nginx course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Practical</b> — write the server block, the location or the directive straight into the editor in the exam room. It is graded by AI against the reference answer and a rubric.</li>' +
  '</ul>' +
  '<p>Read the transcripts carefully: several questions turn on which location won rather than which one you meant, on which side of a trailing slash a path was rewritten, or on a header that stopped being sent because a child block declared one of its own. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Nginx. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Thực hành</b> — gõ thẳng khối server, khối location hay chỉ thị vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn terminal: nhiều câu ăn thua ở chỗ location nào THẬT SỰ thắng chứ không phải cái bạn định, ở chỗ một đường dẫn bị viết lại về phía nào của dấu gạch chéo, hoặc ở chỗ một header ngừng được gửi chỉ vì khối con khai thêm một cái của riêng nó. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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

/** Một câu thực hành: viết nginx.conf / server block / location. */
// `khongChayDuoc`: lý do bằng chữ vì sao scripts/exam-check.mjs KHÔNG chạy được
// lời giải câu này (cần một tiến trình nginx sống, nhiều tệp, chứng chỉ, một
// upstream…). Bộ kiểm chỉ có `node` và `bash`, và nhãn `nginx` KHÔNG nằm trong
// tập `KHONG_CHAY_DUOC` của nó — xem chú thích đầu NGINX-PE.mjs. Seeder chọn
// field tường minh nên field này không vào DB.
export const codeQ = ({ points, prompt, language = 'nginx', starterCode, expectedOutput, sampleSolution, rubric = RUBRIC_CODE, khongChayDuoc }) => ({
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
