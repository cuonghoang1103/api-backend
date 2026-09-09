/**
 * Bộ khuôn dùng chung cho các đề thi khoá Object Storage (FE, PE, và các PT về sau).
 *
 * Mọi chuỗi hiển thị trong Phòng thi đều song ngữ: hoặc dạng ống "EN|||VI"
 * (prompt, option — client tự tách bằng pickLang), hoặc dạng HTML hai khối
 * `.ml-en` / `.ml-vi` (giải thích, hướng dẫn — client bật/tắt bằng data-ml).
 *
 * ⚠️ MỖI TRƯỜNG CHỈ ĐƯỢC CÓ ĐÚNG MỘT DẤU `|||`. Nếu phần EN hay phần VI tự
 * chứa thêm một dấu ống nữa thì bản tiếng Việt sẽ lòi cả đoạn tiếng Anh ra màn
 * hình. Khoá này dễ dính vì đề đầy pipe của shell (`zcat … | jq | awk`) và đầy
 * chuỗi truy vấn (`?X-Amz-Algorithm=…&X-Amz-Signature=…`) — một dấu `|` thì vô
 * hại, nhưng KHÔNG bao giờ được gõ ba dấu `|` liền nhau trong nội dung, kể cả
 * trong khối mã.
 *
 * Vì sao có file này: đề Object Storage đầy XML lỗi của S3
 * (`<Error><Code>SignatureDoesNotMatch</Code></Error>`), đầy JSON chính sách
 * lifecycle và CORS, và đầy chuỗi truy vấn có `&`. `code()` tự thoát `< > &`,
 * nên đoạn mã trong đề luôn hiện đúng nguyên văn thay vì bị trình duyệt nuốt
 * mất một nửa.
 *
 * Sao chép từ docker-exam-kit.mjs; ba điểm khác:
 *   • `sim()` gắn `fromCourse=object-storage`;
 *   • `RUBRIC_CODE` mô tả ngữ nghĩa object storage (chữ ký SigV4 khớp vector
 *     chuẩn, phân trang không giả định vừa một trang, HEAD chứ không LIST để
 *     hỏi tồn tại, tiền tố không phải thư mục) thay vì ảnh và container;
 *   • `codeQ()` mặc định `language: 'javascript'` — thứ học viên VIẾT ở khoá
 *     này là Node thuần (`node:crypto`, `fetch`), không phải Dockerfile.
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

/** Mã inline trong một câu văn — cũng tự thoát, dùng cho `X-Amz-Expires=600`… */
export const c = (src) => `<code>${esc(src)}</code>`;

/**
 * Link mở kịch bản mô phỏng tương ứng với câu hỏi.
 * Học viên làm sai câu nào thì mở đúng hoạt hình giải thích câu đó, và trang
 * /simulation dựng luôn nút "← Quay lại bài học" nhờ fromCourse/fromLesson.
 */
export const sim = (scenario, lessonSlug, label) =>
  ` <a class="exam-sim-link" href="/simulation?scenario=${encodeURIComponent(scenario)}` +
  `&amp;fromCourse=object-storage&amp;fromLesson=${encodeURIComponent(lessonSlug)}">▶ ${esc(label)}</a>`;

/**
 * Dựng rubric từ bảng `[id, en, vi, maxScore]`.
 *
 * `weight === maxScore` ở MỌI tiêu chí, nên điểm từng tiêu chí cộng thẳng ra
 * điểm câu — không phải quy đổi, và không ai phải đoán "trọng số 3 trên thang 4
 * nghĩa là mấy điểm". Tổng `maxScore` của một câu phải đúng bằng `points` của
 * câu ấy.
 */
export const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

/**
 * Rubric MẶC ĐỊNH cho câu lập trình, tổng 2,0 điểm — cỡ điểm hay gặp nhất ở đề
 * PE khoá này. Câu nào lệch cỡ điểm đó thì truyền rubric riêng dựng bằng
 * `rubric()` ở trên; mọi câu trong OBJECT-STORAGE-PE.mjs đều làm vậy.
 */
export const RUBRIC_CODE = rubric([
  ['correct',
    'The program prints exactly the required output for the given input: a signature that matches the reference vector byte for byte, an ETag in the exact format the API returns, a verdict line spelled as the problem spells it.',
    'Chương trình in ra ĐÚNG kết quả yêu cầu với dữ liệu vào đã cho: một chữ ký khớp từng byte với vector đối chiếu, một ETag đúng định dạng API trả về, một dòng kết luận viết đúng như đề viết.',
    1],
  ['logic',
    'The object-storage decisions are right: the signature binds the headers the problem names, a listing is paged through instead of assumed to fit one response, existence is asked with HEAD rather than LIST, and no code treats a key prefix as if it were a directory.',
    'Các quyết định về object storage đặt đúng chỗ: chữ ký ràng đúng những header đề nêu, một lượt liệt kê được đi hết trang chứ không mặc định vừa một lần trả về, việc hỏi tồn tại dùng HEAD chứ không dùng LIST, và không đoạn nào coi một tiền tố key như thể nó là thư mục.',
    0.6],
  ['quality',
    'Readable and safe: the standard library only, no secret hard-coded or printed, a key built at runtime instead of a full URL stored, and the scaffold given in the question left untouched.',
    'Dễ đọc và an toàn: chỉ dùng thư viện chuẩn, không bí mật nào viết cứng hay in ra, key dựng lúc chạy thay vì lưu sẵn cả URL, và giữ nguyên phần khung đề cho sẵn.',
    0.4],
]);

/** Hướng dẫn đầu đề cho một bài Progress Test (trắc nghiệm + câu thực hành). */
export const ptInstructions = (n, chapters) =>
  '<div class="ml-en">' +
  `<p><b>Progress Test ${n}</b> covers chapters ${chapters} of the Object Storage course. It mixes two kinds of question:</p>` +
  '<ul>' +
  '<li><b>Multiple choice</b> — auto-graded. Some questions say "choose TWO"; those only count as correct when both are selected.</li>' +
  '<li><b>Practical</b> — write the function, the policy JSON or the command straight into the editor in the exam room. It is graded by AI against the reference answer and a rubric.</li>' +
  '</ul>' +
  '<p>Read the transcripts carefully: several questions turn on the difference between a status code and the message inside the XML body, on which headers a signature actually binds, or on what an ETag with a dash in it means. You can flag a question and come back to it. The timer auto-submits when it ends.</p>' +
  '<p>After you submit, every question shows a bilingual explanation.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  `<p><b>Bài kiểm tra tiến độ ${n}</b> bao phủ chương ${chapters} của khoá Object Storage. Đề có hai loại câu:</p>` +
  '<ul>' +
  '<li><b>Trắc nghiệm</b> — chấm tự động. Một số câu ghi "chọn HAI"; chỉ đúng khi chọn đủ cả hai đáp án.</li>' +
  '<li><b>Thực hành</b> — gõ thẳng hàm, khối JSON chính sách hay câu lệnh vào ô soạn thảo trong phòng thi. AI chấm dựa trên đáp án mẫu và bộ tiêu chí.</li>' +
  '</ul>' +
  '<p>Hãy đọc kỹ các đoạn terminal: nhiều câu ăn thua ở chỗ phân biệt mã trạng thái với thông điệp nằm trong khối XML, ở chỗ một chữ ký thật sự ràng buộc những header nào, hoặc ở chỗ một ETag có dấu gạch ngang nghĩa là gì. Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp.</p>' +
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

/**
 * Một câu thực hành: viết hàm ký SigV4, bộ đối soát, chính sách lifecycle…
 *
 * `khongChayDuoc`: lý do bằng chữ vì sao scripts/exam-check.mjs KHÔNG chạy được
 * lời giải câu này (cần một máy chủ S3 SỐNG, cần tham số dòng lệnh, cần mạng…).
 * CHỈ dùng khi ngôn ngữ vốn CHẠY ĐƯỢC — ngôn ngữ không chạy được (yaml, json,
 * dockerfile…) thì bộ kiểm tự nhận ra qua nhãn `language`. Bắt buộc kèm lý do
 * bằng chữ, để không ai miễn được một câu trong im lặng.
 *
 * Mặc định KHÔNG có field này: câu nào khai `language: 'javascript'` thì bộ
 * kiểm sẽ chạy `sampleSolution` bằng node với đúng phần INPUT trong
 * `expectedOutput` và so từng byte — đó là lý do đề này cố ý thiết kế bốn trên
 * năm câu sao cho chạy được bằng Node thuần, không cần mạng.
 *
 * Seeder chọn field tường minh nên `khongChayDuoc` không đi vào DB.
 */
export const codeQ = ({ points, prompt, language = 'javascript', starterCode, expectedOutput, sampleSolution, rubric: rubricRows = RUBRIC_CODE, khongChayDuoc }) => ({
  kind: 'CODE',
  points,
  prompt,
  language,
  starterCode,
  expectedOutput,
  sampleSolution,
  rubric: rubricRows,
  ...(khongChayDuoc ? { khongChayDuoc } : {}),
});
