/**
 * build-swr302-pe24.mjs — sinh content/exams/SWR302-PE24.mjs.
 *
 * NGUỒN THẬT
 *   "Đề 5 - Đề Thi FE SWR302 - SU25 - PE2" (2 ảnh trang đề + 1 file .rar).
 *   ⚠️ Thư mục nằm dưới nhánh FE/ nhưng NỘI DUNG là đề PE (Practical Exam):
 *   4 câu vẽ sơ đồ / điền template, không có phần trắc nghiệm. Đã dựng thành
 *   PE/WRITE đúng bản chất, không dựng thành FE.
 *
 * ARCHIVE CÓ KHỚP ĐỀ KHÔNG — CÓ.
 *   swr302_su25_pe2_222702.rar chứa đúng MỘT file:
 *     SWR302_SU25_PE2_222702/PaperNo_1/All/SWR302_SU25_PE2_Template.docx
 *   Đây là FILE TEMPLATE TRẢ LỜI của chính đề này (không phải bài làm sinh
 *   viên), và nó khớp từng câu với 2 ảnh đề. Giá trị lớn nhất của nó: template
 *   ghi rõ THANG ĐIỂM CON của từng câu, nên toàn bộ rubric dưới đây là điểm
 *   THẬT của đề, KHÔNG phải tự chia:
 *     Q1 (0.5) = tên project 0.2 + <author> họ tên & MSSV 0.1
 *                + <organization> campus FU 0.1 + <date created> 0.1
 *     Q2 (2.5) = đúng cú pháp context diagram 0.4 + external entities 0.6
 *                + data flows 1.5
 *     Q3 (4.0) = đúng cú pháp use case diagram 0.4 + actors & mô tả 0.9
 *                + use cases & mô tả 2.7
 *     Q4 (3.0) = đúng cú pháp conceptual ERD 0.4 + entities & mô tả 1.8
 *                + relationships 0.8
 *   Tổng 0.5 + 2.5 + 4.0 + 3.0 = 10 ✓
 *   Template không chứa đáp án — chỉ khung rỗng + thang điểm. Đáp án mẫu dưới
 *   đây do tự soạn từ đoạn mô tả nghiệp vụ ở trang 1 của đề.
 *
 * ẢNH ĐỀ
 *   2 trang đề đã crop (bỏ watermark FUOVERFLOW + nửa phải trống của cửa sổ
 *   xem ảnh) rồi upload:
 *     q1.png = trang bối cảnh (Show Management System) → gắn cho Câu 1
 *     q2.png = trang liệt kê 4 câu hỏi              → gắn cho Câu 2, 3, 4
 *   ⚠️ scripts/crop-exam-image.mjs KHÔNG cắt gọn được bộ ảnh này (nó gỡ được
 *   watermark nhưng để nguyên nửa phải trống và còn làm CHIỀU CAO TĂNG
 *   1003→1027 do bước re-stack). Đã cắt tay thêm bằng sharp
 *   extract({left:15, top:0, width:1015, height:890}) trên đầu ra của nó và
 *   mở lại kiểm mắt: không cụt chữ, mất watermark, mất thanh công cụ.
 *
 * ĐIỂM KHÔNG RÕ TRONG ĐỀ (nêu thẳng, không bịa ngầm)
 *   - Đề chỉ nói "briefly describe actors and use cases / entities in template"
 *     mà template lại để sẵn ĐÚNG 3 dòng (01/02/03, UC-01..UC-03). Ba dòng đó
 *     là khung mẫu chứ KHÔNG phải giới hạn số lượng — đáp án mẫu liệt kê đầy
 *     đủ theo nghiệp vụ, và rubric chấm theo độ phủ nghiệp vụ chứ không theo
 *     con số 3.
 *   - Đề không nói rõ Manager có phải là một Staff hay không. Đáp án mẫu tách
 *     riêng MANAGER và STAFF trong ERD (và nêu rõ phương án gộp thành một thực
 *     thể EMPLOYEE có ROLE cũng được chấp nhận).
 *   - Quan hệ «extend»/«include» trong use case diagram là LỰA CHỌN MÔ HÌNH
 *     hợp lý từ mô tả, đề không chỉ định — rubric không trừ nếu sinh viên chọn
 *     cặp khác nhưng lý giải đúng.
 *
 * QUY ƯỚC SONG NGỮ
 *   B(en, vi) là chỗ DUY NHẤT đẻ ra dấu "|||", và KHÔNG bao giờ nhận đầu vào
 *   đã chứa "|||" (đây chính là lỗi đã phải vá 30 deck: chuỗi con mang sẵn
 *   "|||" bị ghép vào B() làm một trường có nhiều dấu, pickLang() chỉ tách ở
 *   dấu ĐẦU TIÊN nên bản tiếng Việt lòi cả đoạn tiếng Anh). Mọi mảnh dùng lại
 *   đều giữ hai biến _EN/_VI riêng. Cuối script có bộ kiểm tự động.
 *   instructions dùng khối ml-en/ml-vi và KHÔNG chứa "|||".
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SWR302-PE24.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SWR302-PE24.mjs');

/** Chỗ DUY NHẤT sinh ra "|||". Đầu vào PHẢI sạch dấu này. */
const B = (en, vi) => {
  if (String(en).includes('|||') || String(vi).includes('|||')) {
    throw new Error('B() nhận đầu vào đã chứa "|||" — sẽ tạo trường nhiều dấu, pickLang() tách sai');
  }
  return `${en}|||${vi}`;
};
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const IMG = (n) => `https://media.cuongthai.com/images/exam-questions/SWR302/PE24/q${n}.png`;

// ───────────────────────── Bối cảnh (nguyên văn trang 1 của đề) ─────────────

const SYSTEM_EN = `<div class="pe-system"><b>System / Context — Show Management System (water park)</b>
<p>The water park needs to build a software called <b>Show Management System</b> to help visitors easily track and buy tickets to participate in the shows in the water park. The system also makes it easy for the manager to manage shows in the water park.</p>
<p>The system has the function of allowing the <b>manager</b> to create, adjust and manage <b>schedules</b> for shows in the water park (<b>daily</b>, <b>special</b>). Daily shows are usually held every day at fixed times; the ticket price is included in the water park entrance fee or there may be a small surcharge. Special shows are held on special occasions with the participation of artists or events in cooperation with major brands; the ticket price will not be included in the entrance fee. The manager can <b>declare ticket prices</b> for each type of show.</p>
<p>The system provides <b>automatic audio announcements</b> about upcoming shows through the <b>Announcement Sound System</b> located in the water park, helping staff and visitors to quickly grasp information. Visitors can <b>view the schedule of shows at the Self-Service Ticket Kiosk and purchase tickets themselves</b> there. The system also has a function that allows <b>staff to sell show tickets</b> to visitors at the ticket counters. In case a visitor <b>loses their ticket</b>, the system allows staff to <b>reprint the ticket</b> for the visitor. At the entrance of the show, the system provides the function for staff to quickly <b>check in</b> visitors by using a <b>Barcode Reader</b> to scan the barcode printed on the ticket.</p>
<p>The system has the ability to allow the manager to <b>assign detailed work schedules</b> to each staff member performing the show (such as actors, musicians, technicians), ensuring that each staff member knows the working hours, breaks, and other requirements of the show. The system allows the manager to <b>evaluate and provide feedback</b> to staffs to improve their skills and performance for each show. <b>Only staffs whose work schedule is declared by the manager can access and operate the system.</b> Staffs can only <b>view their work schedules</b> assigned by the manager. Staffs can <b>submit a request to cancel their work schedule</b>, and the manager can <b>approve or deny</b> a request to cancel their work schedule. The manager and staffs can communicate with each other through the <b>chat</b> function of the system. The system provides the manager with a <b>dashboard</b> that analyzes the <b>trend of visitors watching the show by number and time</b> to adjust the schedule and program accordingly.</p></div>`;

const SYSTEM_VI = `<div class="pe-system"><b>Hệ thống / Bối cảnh — Show Management System (công viên nước)</b>
<p>Công viên nước cần xây dựng một phần mềm tên là <b>Show Management System</b> (Hệ thống Quản lý Suất diễn) để giúp khách tham quan dễ dàng theo dõi và mua vé tham gia các suất diễn trong công viên nước. Hệ thống cũng giúp người quản lý quản lý các suất diễn dễ dàng hơn.</p>
<p>Hệ thống có chức năng cho phép <b>người quản lý (manager)</b> tạo, điều chỉnh và quản lý <b>lịch diễn</b> trong công viên nước (loại <b>hằng ngày</b>, loại <b>đặc biệt</b>). Suất diễn hằng ngày thường diễn ra mỗi ngày vào giờ cố định; giá vé đã bao gồm trong phí vào cổng công viên nước hoặc có thể thu thêm một khoản phụ thu nhỏ. Suất diễn đặc biệt được tổ chức vào dịp đặc biệt với sự tham gia của nghệ sĩ hoặc sự kiện phối hợp cùng các thương hiệu lớn; giá vé KHÔNG bao gồm trong phí vào cổng. Người quản lý có thể <b>khai báo giá vé</b> cho từng loại suất diễn.</p>
<p>Hệ thống cung cấp <b>thông báo âm thanh tự động</b> về các suất diễn sắp tới qua <b>Hệ thống Loa Thông báo (Announcement Sound System)</b> đặt trong công viên nước, giúp nhân viên và khách nắm thông tin nhanh. Khách có thể <b>xem lịch diễn tại Ki-ốt Bán vé Tự phục vụ (Self-Service Ticket Kiosk) và tự mua vé</b> tại đó. Hệ thống cũng có chức năng cho phép <b>nhân viên bán vé</b> cho khách tại quầy vé. Trường hợp khách <b>làm mất vé</b>, hệ thống cho phép nhân viên <b>in lại vé</b> cho khách. Tại cửa vào suất diễn, hệ thống cung cấp chức năng cho nhân viên <b>check-in</b> khách nhanh chóng bằng <b>Đầu đọc Mã vạch (Barcode Reader)</b> để quét mã vạch in trên vé.</p>
<p>Hệ thống cho phép người quản lý <b>phân lịch làm việc chi tiết</b> cho từng nhân viên tham gia suất diễn (diễn viên, nhạc công, kỹ thuật viên), bảo đảm mỗi nhân viên biết giờ làm, giờ nghỉ và các yêu cầu khác của suất diễn. Hệ thống cho phép người quản lý <b>đánh giá và phản hồi</b> cho nhân viên để cải thiện kỹ năng và hiệu suất ở mỗi suất diễn. <b>Chỉ nhân viên đã được người quản lý khai báo lịch làm việc mới được truy cập và vận hành hệ thống.</b> Nhân viên chỉ có thể <b>xem lịch làm việc</b> do người quản lý phân. Nhân viên có thể <b>gửi yêu cầu huỷ lịch làm việc</b>, và người quản lý có thể <b>duyệt hoặc từ chối</b> yêu cầu huỷ đó. Người quản lý và nhân viên trao đổi với nhau qua chức năng <b>chat</b> của hệ thống. Hệ thống cung cấp cho người quản lý một <b>dashboard</b> phân tích <b>xu hướng khách xem suất diễn theo số lượng và theo thời gian</b> để điều chỉnh lịch và chương trình cho phù hợp.</p></div>`;

const RULE_EN = `<p class="pe-note"><b>Exam rule (printed in red on the paper):</b> all answers must be written in the provided template file, in English, and must reflect this exam paper. In the real exam you must use Visual Paradigm (offline) to draw the diagrams and paste the diagram images into the template for Q2, Q3 and Q4. Answers containing keywords unrelated to this paper, or not written in the provided template, get ZERO.</p>`;
const RULE_VI = `<p class="pe-note"><b>Quy định của đề (in đỏ trên đề):</b> mọi câu trả lời phải viết vào file template được cấp, viết bằng tiếng Anh, và phải bám đúng đề này. Ở phòng thi thật, bạn phải dùng Visual Paradigm (offline) để vẽ sơ đồ rồi dán ảnh sơ đồ vào template cho Q2, Q3, Q4. Bài có từ khoá không liên quan đến đề, hoặc không viết trong template được cấp, bị ZERO điểm.</p>`;

// ───────────────────────── instructions (ml-en/ml-vi, không có "|||") ────────

const instructions = ML(
  `<p><b>How to take this practical exam.</b></p><ol>` +
    `<li>This is a real FPTU <b>Practical Exam</b> for <b>Software Requirements (SWR302)</b> — <b>SU25, PE2</b>. Read the system/context in Question 1 (it applies to all four questions), then answer each question <b>in writing</b> (English) in the answer box.</li>` +
    `<li>The paper is worth <b>10 points</b>: Q1 = 0.5, Q2 = 2.5, Q3 = 4.0, Q4 = 3.0. The per-criterion sub-points shown in each rubric are the <b>official</b> ones printed in the answer template that shipped with this paper, not an invented split.</li>` +
    `<li>In the real exam you draw the diagrams in <b>Visual Paradigm (offline)</b> and paste the images into the template. Here, describe each diagram clearly in text or list form (entities, flows, actors, use cases, relationships) — the model answer shows a reference diagram.</li>` +
    `<li>When you submit, AI grades each answer against the <b>rubric</b> and a reference solution, then shows a bilingual model answer.</li>` +
    `</ol>`,
  `<p><b>Cách làm bài thi thực hành.</b></p><ol>` +
    `<li>Đây là đề <b>thi thực hành (PE)</b> thật của FPTU môn <b>Software Requirements (SWR302)</b> — <b>SU25, PE2</b>. Đọc phần hệ thống/bối cảnh ở Câu 1 (áp dụng cho cả bốn câu), rồi trả lời mỗi câu <b>bằng chữ</b> (tiếng Anh) trong ô trả lời.</li>` +
    `<li>Đề <b>10 điểm</b>: Q1 = 0,5; Q2 = 2,5; Q3 = 4,0; Q4 = 3,0. Điểm con từng tiêu chí trong rubric là điểm <b>chính thức</b> in trong file template trả lời đi kèm đề này, không phải tự chia.</li>` +
    `<li>Ở phòng thi thật bạn vẽ sơ đồ bằng <b>Visual Paradigm (offline)</b> rồi dán ảnh vào template. Ở đây, hãy mô tả rõ từng sơ đồ bằng chữ hoặc liệt kê (thực thể, luồng dữ liệu, tác nhân, use case, quan hệ) — đáp án mẫu có sơ đồ tham chiếu.</li>` +
    `<li>Khi nộp, AI chấm từng câu theo <b>rubric</b> và một đáp án mẫu, rồi hiện đáp án mẫu song ngữ.</li>` +
    `</ol>`,
);

// ═════════════════════════════ Câu 1 (0.5 điểm) ═════════════════════════════

const q1PromptEn = SYSTEM_EN + RULE_EN +
  `<p><b>Question 1 (0.5 point).</b> Complete all parts of the <b>first page</b> of the Software Requirements Specification (SRS) template provided to you.</p>` +
  `<p>The first page of the provided template contains these placeholders, each worth its own sub-score:</p>` +
  `<ul><li><code>&lt;Project&gt;</code> — replace with the name of the project in this exam paper. <b>(0.2)</b></li>` +
  `<li><code>&lt;author&gt;</code> — replace with your full name and student ID. <b>(0.1)</b></li>` +
  `<li><code>&lt;organization&gt;</code> — replace with the name of the FU campus where you take the exam. <b>(0.1)</b></li>` +
  `<li><code>&lt;date created&gt;</code> — replace with the date you take the exam. <b>(0.1)</b></li></ul>`;

const q1PromptVi = SYSTEM_VI + RULE_VI +
  `<p><b>Câu 1 (0,5 điểm).</b> Hoàn thành tất cả các phần ở <b>trang đầu tiên</b> của mẫu Đặc tả Yêu cầu Phần mềm (SRS) được cung cấp cho bạn.</p>` +
  `<p>Trang đầu của template có các chỗ giữ chỗ sau, mỗi chỗ có điểm con riêng:</p>` +
  `<ul><li><code>&lt;Project&gt;</code> — thay bằng tên dự án trong đề thi này. <b>(0,2)</b></li>` +
  `<li><code>&lt;author&gt;</code> — thay bằng họ tên đầy đủ và mã số sinh viên của bạn. <b>(0,1)</b></li>` +
  `<li><code>&lt;organization&gt;</code> — thay bằng tên cơ sở (campus) FU nơi bạn dự thi. <b>(0,1)</b></li>` +
  `<li><code>&lt;date created&gt;</code> — thay bằng ngày bạn dự thi. <b>(0,1)</b></li></ul>`;

const q1SampleEn = `<p><b>Software Requirements Specification</b><br/>for</p>` +
  `<p><b>Show Management System</b> &nbsp;<i>(&larr; replaces &lt;Project&gt;: this is the exact product name given in the first sentence of the paper — do not write "Water Park System" or any name not in the paper, that is a keyword unrelated to the paper)</i></p>` +
  `<p><b>Version 1.0 approved</b></p>` +
  `<p><b>Prepared by</b> Nguyen Van A — SE170123 &nbsp;<i>(&larr; replaces &lt;author&gt;: your own full name and your own student ID)</i></p>` +
  `<p><b>FPT University — Ho Chi Minh City Campus</b> &nbsp;<i>(&larr; replaces &lt;organization&gt;: the FU campus where you actually sit the exam — Hoa Lac / Ho Chi Minh / Da Nang / Can Tho / Quy Nhon)</i></p>` +
  `<p><b>Date created: 2025-06-25</b> &nbsp;<i>(&larr; replaces &lt;date created&gt;: the real date of the exam day)</i></p>` +
  `<p><b>Filled-in first page, as it should look:</b></p>` +
  `<table><thead><tr><th>Template placeholder</th><th>What you must write</th><th>Sub-score</th></tr></thead><tbody>` +
  `<tr><td>&lt;Project&gt;</td><td>Show Management System</td><td>0.2</td></tr>` +
  `<tr><td>&lt;author&gt;</td><td>Your full name + your student ID</td><td>0.1</td></tr>` +
  `<tr><td>&lt;organization&gt;</td><td>The FU campus of the exam</td><td>0.1</td></tr>` +
  `<tr><td>&lt;date created&gt;</td><td>The exam date</td><td>0.1</td></tr>` +
  `</tbody></table>` +
  `<p><b>Note:</b> the "Version 1.0 approved" line is already printed in the template and is not a placeholder — leave it as it is. Only the four angle-bracket placeholders above are scored.</p>`;

const q1SampleVi = `<p><b>Software Requirements Specification</b><br/>for</p>` +
  `<p><b>Show Management System</b> &nbsp;<i>(&larr; thay cho &lt;Project&gt;: đây đúng là tên sản phẩm nêu ở câu đầu tiên của đề — đừng viết "Water Park System" hay tên nào không có trong đề, đó là từ khoá không liên quan đến đề)</i></p>` +
  `<p><b>Version 1.0 approved</b></p>` +
  `<p><b>Prepared by</b> Nguyen Van A — SE170123 &nbsp;<i>(&larr; thay cho &lt;author&gt;: họ tên đầy đủ và MSSV của chính bạn)</i></p>` +
  `<p><b>FPT University — Ho Chi Minh City Campus</b> &nbsp;<i>(&larr; thay cho &lt;organization&gt;: cơ sở FU nơi bạn thực sự dự thi — Hoà Lạc / TP.HCM / Đà Nẵng / Cần Thơ / Quy Nhơn)</i></p>` +
  `<p><b>Date created: 25-06-2025</b> &nbsp;<i>(&larr; thay cho &lt;date created&gt;: ngày thi thật)</i></p>` +
  `<p><b>Trang đầu sau khi điền, nhìn phải như thế này:</b></p>` +
  `<table><thead><tr><th>Chỗ giữ chỗ trong template</th><th>Phải viết gì</th><th>Điểm con</th></tr></thead><tbody>` +
  `<tr><td>&lt;Project&gt;</td><td>Show Management System</td><td>0,2</td></tr>` +
  `<tr><td>&lt;author&gt;</td><td>Họ tên đầy đủ + MSSV của bạn</td><td>0,1</td></tr>` +
  `<tr><td>&lt;organization&gt;</td><td>Cơ sở FU nơi dự thi</td><td>0,1</td></tr>` +
  `<tr><td>&lt;date created&gt;</td><td>Ngày thi</td><td>0,1</td></tr>` +
  `</tbody></table>` +
  `<p><b>Lưu ý:</b> dòng "Version 1.0 approved" đã in sẵn trong template và không phải chỗ giữ chỗ — để nguyên. Chỉ bốn chỗ trong ngoặc nhọn ở trên mới được tính điểm.</p>`;

const q1ExplEn = `<p><b>Why this question exists and where the marks go.</b> 0.5 point looks trivial, but it is the cheapest half point on the paper and it is the one most often lost. The grader compares your first page against four fixed placeholders, not against your writing quality.</p>` +
  `<ul><li><b>&lt;Project&gt; (0.2 — the biggest single item).</b> The project name must be the one <i>this</i> paper gives: <b>Show Management System</b>. Inventing a name ("Water Park Ticketing", "WaterShow", your team name from a previous course) is exactly the "keyword not related to this electronic exam paper" the red rule threatens with ZERO.</li>` +
  `<li><b>&lt;author&gt; (0.1).</b> Full name <i>and</i> student ID. Half of this is lost every exam by writing only the name.</li>` +
  `<li><b>&lt;organization&gt; (0.1).</b> The FU campus you sit in, not "FPT University" alone and not "FPT Software" (a different company).</li>` +
  `<li><b>&lt;date created&gt; (0.1).</b> The date of the exam day. A blank or a leftover date from the template loses it.</li></ul>` +
  `<p><b>Practical rule:</b> do this question in the first 60 seconds of the exam, before you open Visual Paradigm. It cannot be improved by thinking longer, and forgetting to come back to it is a real, common way to lose 0.5.</p>`;

const q1ExplVi = `<p><b>Vì sao có câu này và điểm nằm ở đâu.</b> 0,5 điểm trông như cho không, nhưng đây là nửa điểm rẻ nhất của cả đề và cũng là nửa điểm bị mất nhiều nhất. Người chấm đối chiếu trang đầu của bạn với bốn chỗ giữ chỗ cố định, không chấm văn phong.</p>` +
  `<ul><li><b>&lt;Project&gt; (0,2 — mục lớn nhất).</b> Tên dự án phải đúng tên mà <i>đề này</i> đưa ra: <b>Show Management System</b>. Tự chế tên ("Water Park Ticketing", "WaterShow", tên nhóm ở môn trước) chính là "từ khoá không liên quan đến đề" mà dòng chữ đỏ doạ cho ZERO.</li>` +
  `<li><b>&lt;author&gt; (0,1).</b> Họ tên đầy đủ <i>và</i> MSSV. Kỳ nào cũng có người mất nửa ý này vì chỉ ghi mỗi tên.</li>` +
  `<li><b>&lt;organization&gt; (0,1).</b> Cơ sở FU bạn đang ngồi thi, không phải mỗi chữ "FPT University", càng không phải "FPT Software" (công ty khác).</li>` +
  `<li><b>&lt;date created&gt; (0,1).</b> Ngày thi. Bỏ trống hoặc để nguyên ngày cũ trong template là mất.</li></ul>` +
  `<p><b>Mẹo thực chiến:</b> làm câu này trong 60 giây đầu giờ thi, trước khi mở Visual Paradigm. Nghĩ lâu cũng không hay hơn được, mà quên quay lại làm là cách mất 0,5 điểm rất thật và rất phổ biến.</p>`;

const q1 = {
  kind: 'WRITE',
  points: 0.5,
  prompt: ML(q1PromptEn, q1PromptVi),
  sampleSolution: ML(q1SampleEn, q1SampleVi),
  explanation: B(q1ExplEn, q1ExplVi),
  imageUrl: IMG(1),
  rubric: [
    {
      id: 'project_name',
      criterion: B(
        '&lt;Project&gt; replaced by the exact product name of THIS paper: "Show Management System" (no invented or borrowed project name).',
        '&lt;Project&gt; được thay bằng đúng tên sản phẩm của ĐỀ NÀY: "Show Management System" (không tự chế, không mượn tên dự án khác).',
      ),
      weight: 1,
      maxScore: 0.2,
    },
    {
      id: 'author',
      criterion: B(
        '&lt;author&gt; replaced by the student\'s full name AND student ID (both required).',
        '&lt;author&gt; được thay bằng họ tên đầy đủ VÀ mã số sinh viên (phải có cả hai).',
      ),
      weight: 1,
      maxScore: 0.1,
    },
    {
      id: 'organization',
      criterion: B(
        '&lt;organization&gt; replaced by the name of the FU campus where the exam is taken.',
        '&lt;organization&gt; được thay bằng tên cơ sở (campus) FU nơi dự thi.',
      ),
      weight: 1,
      maxScore: 0.1,
    },
    {
      id: 'date_created',
      criterion: B(
        '&lt;date created&gt; replaced by the date the exam is taken.',
        '&lt;date created&gt; được thay bằng ngày dự thi.',
      ),
      weight: 1,
      maxScore: 0.1,
    },
  ],
};

// ═════════════════════════════ Câu 2 (2.5 điểm) ═════════════════════════════

const CONTEXT_MERMAID = `<pre class="mermaid">graph LR;
  MGR["Manager<br/>(external entity)"];
  STF["Staff<br/>(external entity)"];
  VIS["Visitor<br/>(external entity)"];
  KIOSK["Self-Service<br/>Ticket Kiosk<br/>(external entity - device)"];
  BR["Barcode Reader<br/>(external entity - device)"];
  ASS["Announcement<br/>Sound System<br/>(external entity - device)"];
  SMS(("0<br/>Show Management<br/>System"));
  MGR -- "show schedule (daily/special), ticket price declaration,<br/>staff work schedule, evaluation and feedback,<br/>approve or deny cancel request, chat message" --> SMS;
  SMS -- "schedule confirmation, visitor-trend dashboard,<br/>work-schedule cancel request, chat message" --> MGR;
  STF -- "login credentials, ticket sale request, reprint-ticket request,<br/>check-in request, work-schedule cancel request, chat message" --> SMS;
  SMS -- "assigned work schedule, printed or reprinted ticket,<br/>check-in result, evaluation and feedback,<br/>cancel-request decision, chat message" --> STF;
  VIS -- "show schedule enquiry, ticket purchase request and payment,<br/>ticket presented at the show entrance" --> SMS;
  SMS -- "show schedule, ticket with barcode, payment receipt" --> VIS;
  KIOSK -- "schedule display request, self-service purchase transaction" --> SMS;
  SMS -- "show schedule to display, ticket to print" --> KIOSK;
  BR -- "scanned barcode data" --> SMS;
  SMS -- "barcode validation result (valid / used / invalid)" --> BR;
  SMS -- "upcoming-show announcement content" --> ASS;
</pre>`;

const q2PromptEn = `<p><b>Question 2 (2.5 points).</b> Draw a <b>context diagram</b> to describe the <b>scope</b> of the required software system that is described in this exam paper.</p>` +
  `<p>Official sub-scores printed in the answer template:</p>` +
  `<ul><li>Draw the correct syntax to describe the context diagram. <b>(0.4)</b></li>` +
  `<li>Draw the external entities. <b>(0.6)</b></li>` +
  `<li>Draw the data flows described in this exam paper. <b>(1.5)</b></li></ul>`;

const q2PromptVi = `<p><b>Câu 2 (2,5 điểm).</b> Vẽ <b>context diagram</b> (sơ đồ ngữ cảnh) mô tả <b>phạm vi</b> của hệ thống phần mềm được yêu cầu trong đề thi này.</p>` +
  `<p>Điểm con chính thức in trong file template trả lời:</p>` +
  `<ul><li>Vẽ đúng cú pháp của context diagram. <b>(0,4)</b></li>` +
  `<li>Vẽ các thực thể ngoài (external entities). <b>(0,6)</b></li>` +
  `<li>Vẽ các luồng dữ liệu được mô tả trong đề thi này. <b>(1,5)</b></li></ul>`;

const q2SampleEn = `<p><b>1) Correct syntax of a context diagram (0.4).</b> A context diagram is a level-0 DFD. It must contain:</p>` +
  `<ul><li><b>exactly ONE process</b>, drawn as a circle (Yourdon) or a rounded rectangle (Gane-Sarson), numbered <b>0</b> and named after the system: <b>"0 — Show Management System"</b>;</li>` +
  `<li><b>external entities</b> (terminators) drawn as rectangles, placed <b>outside</b>, around the process;</li>` +
  `<li><b>data flows</b> drawn as <b>named, directed arrows</b> between each external entity and the single process;</li>` +
  `<li><b>no data stores and no internal processes</b> — those belong to DFD level 1 and lower. Drawing a data store here is the single most common syntax error and loses the 0.4.</li></ul>` +
  `<p><b>2) External entities (0.6).</b> Everything outside the system boundary that exchanges data with it — both people and devices:</p>` +
  `<table><thead><tr><th>#</th><th>External entity</th><th>Type</th><th>Why it is external</th></tr></thead><tbody>` +
  `<tr><td>1</td><td>Manager</td><td>Human</td><td>Creates/adjusts show schedules, declares ticket prices, assigns work schedules, evaluates staff, approves or denies cancel requests, reads the dashboard.</td></tr>` +
  `<tr><td>2</td><td>Staff</td><td>Human</td><td>Sells tickets at the counter, reprints lost tickets, checks in visitors, views their own work schedule, submits cancel requests, chats with the manager.</td></tr>` +
  `<tr><td>3</td><td>Visitor</td><td>Human</td><td>Views the show schedule, buys tickets (at the kiosk or the counter), presents the ticket at the show entrance.</td></tr>` +
  `<tr><td>4</td><td>Self-Service Ticket Kiosk</td><td>Device</td><td>The paper names it explicitly: visitors view the schedule and purchase tickets themselves there, so it exchanges data with the system.</td></tr>` +
  `<tr><td>5</td><td>Barcode Reader</td><td>Device</td><td>The paper names it explicitly: it scans the barcode printed on the ticket and feeds the scan to the system for check-in.</td></tr>` +
  `<tr><td>6</td><td>Announcement Sound System</td><td>Device</td><td>The paper names it explicitly: the system pushes automatic audio announcements about upcoming shows to it.</td></tr>` +
  `</tbody></table>` +
  `<p><b>3) Data flows (1.5).</b> Every flow below is traceable to a sentence in the paper:</p>` +
  `<table><thead><tr><th>From &rarr; To</th><th>Data flow</th></tr></thead><tbody>` +
  `<tr><td>Manager &rarr; System</td><td>show schedule (daily / special); ticket price declaration per show type; staff work schedule (working hours, breaks, requirements); evaluation and feedback for a staff member; approve/deny decision on a cancel request; chat message</td></tr>` +
  `<tr><td>System &rarr; Manager</td><td>schedule confirmation; visitor-trend dashboard (number of visitors and time); work-schedule cancellation request from staff; chat message</td></tr>` +
  `<tr><td>Staff &rarr; System</td><td>login credentials; ticket sale request (counter); reprint-ticket request for a lost ticket; check-in request; work-schedule cancellation request; chat message</td></tr>` +
  `<tr><td>System &rarr; Staff</td><td>assigned work schedule; printed / reprinted ticket; check-in result; evaluation and feedback; cancel-request decision (approved or denied); chat message</td></tr>` +
  `<tr><td>Visitor &rarr; System</td><td>show schedule enquiry; ticket purchase request and payment; ticket presented at the show entrance</td></tr>` +
  `<tr><td>System &rarr; Visitor</td><td>show schedule; ticket with printed barcode; payment receipt</td></tr>` +
  `<tr><td>Self-Service Ticket Kiosk &rarr; System</td><td>schedule display request; self-service purchase transaction</td></tr>` +
  `<tr><td>System &rarr; Self-Service Ticket Kiosk</td><td>show schedule to display; ticket to print</td></tr>` +
  `<tr><td>Barcode Reader &rarr; System</td><td>scanned barcode data</td></tr>` +
  `<tr><td>System &rarr; Barcode Reader</td><td>barcode validation result (valid / already used / invalid)</td></tr>` +
  `<tr><td>System &rarr; Announcement Sound System</td><td>upcoming-show announcement content (automatic audio announcement)</td></tr>` +
  `</tbody></table>` +
  `<p><b>Reference diagram:</b></p>` + CONTEXT_MERMAID +
  `<p><i>Note on the reference diagram: Mermaid has no DFD notation, so the single process is drawn as a double circle and the external entities as rectangles. In Visual Paradigm you must use the real DFD shapes.</i></p>`;

const q2SampleVi = `<p><b>1) Đúng cú pháp context diagram (0,4).</b> Context diagram là DFD mức 0. Bắt buộc phải có:</p>` +
  `<ul><li><b>ĐÚNG MỘT tiến trình</b>, vẽ bằng hình tròn (Yourdon) hoặc chữ nhật bo góc (Gane-Sarson), đánh số <b>0</b> và đặt tên theo hệ thống: <b>"0 — Show Management System"</b>;</li>` +
  `<li><b>các thực thể ngoài</b> (terminator) vẽ bằng hình chữ nhật, đặt <b>bên ngoài</b>, vây quanh tiến trình;</li>` +
  `<li><b>các luồng dữ liệu</b> vẽ bằng <b>mũi tên có hướng và CÓ TÊN</b> nối mỗi thực thể ngoài với tiến trình duy nhất;</li>` +
  `<li><b>KHÔNG có kho dữ liệu (data store) và KHÔNG có tiến trình con</b> — những thứ đó thuộc DFD mức 1 trở xuống. Vẽ data store ở đây là lỗi cú pháp phổ biến nhất và mất trọn 0,4.</li></ul>` +
  `<p><b>2) Thực thể ngoài (0,6).</b> Mọi thứ nằm ngoài ranh giới hệ thống mà có trao đổi dữ liệu với nó — cả người lẫn thiết bị:</p>` +
  `<table><thead><tr><th>#</th><th>Thực thể ngoài</th><th>Loại</th><th>Vì sao là thực thể ngoài</th></tr></thead><tbody>` +
  `<tr><td>1</td><td>Manager (Người quản lý)</td><td>Người</td><td>Tạo/điều chỉnh lịch diễn, khai báo giá vé, phân lịch làm việc, đánh giá nhân viên, duyệt/từ chối yêu cầu huỷ, xem dashboard.</td></tr>` +
  `<tr><td>2</td><td>Staff (Nhân viên)</td><td>Người</td><td>Bán vé tại quầy, in lại vé mất, check-in khách, xem lịch làm việc của mình, gửi yêu cầu huỷ lịch, chat với quản lý.</td></tr>` +
  `<tr><td>3</td><td>Visitor (Khách tham quan)</td><td>Người</td><td>Xem lịch diễn, mua vé (ở ki-ốt hoặc quầy), xuất trình vé tại cửa vào suất diễn.</td></tr>` +
  `<tr><td>4</td><td>Self-Service Ticket Kiosk (Ki-ốt tự phục vụ)</td><td>Thiết bị</td><td>Đề nêu đích danh: khách xem lịch và tự mua vé tại đó, nên nó có trao đổi dữ liệu với hệ thống.</td></tr>` +
  `<tr><td>5</td><td>Barcode Reader (Đầu đọc mã vạch)</td><td>Thiết bị</td><td>Đề nêu đích danh: quét mã vạch in trên vé và đưa kết quả quét vào hệ thống để check-in.</td></tr>` +
  `<tr><td>6</td><td>Announcement Sound System (Hệ thống loa thông báo)</td><td>Thiết bị</td><td>Đề nêu đích danh: hệ thống đẩy thông báo âm thanh tự động về suất diễn sắp tới ra thiết bị này.</td></tr>` +
  `</tbody></table>` +
  `<p><b>3) Luồng dữ liệu (1,5).</b> Mọi luồng dưới đây đều truy được về một câu trong đề:</p>` +
  `<table><thead><tr><th>Từ &rarr; Đến</th><th>Luồng dữ liệu</th></tr></thead><tbody>` +
  `<tr><td>Manager &rarr; Hệ thống</td><td>lịch diễn (hằng ngày / đặc biệt); khai báo giá vé theo loại suất diễn; lịch làm việc của nhân viên (giờ làm, giờ nghỉ, yêu cầu); đánh giá và phản hồi cho nhân viên; quyết định duyệt/từ chối yêu cầu huỷ; tin nhắn chat</td></tr>` +
  `<tr><td>Hệ thống &rarr; Manager</td><td>xác nhận lịch diễn; dashboard xu hướng khách xem (số lượng và thời gian); yêu cầu huỷ lịch làm việc của nhân viên; tin nhắn chat</td></tr>` +
  `<tr><td>Staff &rarr; Hệ thống</td><td>thông tin đăng nhập; yêu cầu bán vé (tại quầy); yêu cầu in lại vé bị mất; yêu cầu check-in; yêu cầu huỷ lịch làm việc; tin nhắn chat</td></tr>` +
  `<tr><td>Hệ thống &rarr; Staff</td><td>lịch làm việc được phân; vé đã in / in lại; kết quả check-in; đánh giá và phản hồi; quyết định về yêu cầu huỷ (duyệt hoặc từ chối); tin nhắn chat</td></tr>` +
  `<tr><td>Visitor &rarr; Hệ thống</td><td>yêu cầu xem lịch diễn; yêu cầu mua vé và thanh toán; vé xuất trình tại cửa vào suất diễn</td></tr>` +
  `<tr><td>Hệ thống &rarr; Visitor</td><td>lịch diễn; vé có in mã vạch; biên lai thanh toán</td></tr>` +
  `<tr><td>Ki-ốt tự phục vụ &rarr; Hệ thống</td><td>yêu cầu hiển thị lịch diễn; giao dịch mua vé tự phục vụ</td></tr>` +
  `<tr><td>Hệ thống &rarr; Ki-ốt tự phục vụ</td><td>lịch diễn để hiển thị; vé để in</td></tr>` +
  `<tr><td>Đầu đọc mã vạch &rarr; Hệ thống</td><td>dữ liệu mã vạch đã quét</td></tr>` +
  `<tr><td>Hệ thống &rarr; Đầu đọc mã vạch</td><td>kết quả kiểm tra mã vạch (hợp lệ / đã dùng / không hợp lệ)</td></tr>` +
  `<tr><td>Hệ thống &rarr; Hệ thống loa thông báo</td><td>nội dung thông báo suất diễn sắp tới (thông báo âm thanh tự động)</td></tr>` +
  `</tbody></table>` +
  `<p><b>Sơ đồ tham chiếu:</b></p>` + CONTEXT_MERMAID +
  `<p><i>Lưu ý về sơ đồ tham chiếu: Mermaid không có ký pháp DFD, nên tiến trình duy nhất được vẽ bằng hình tròn kép và thực thể ngoài bằng hình chữ nhật. Trong Visual Paradigm bạn phải dùng đúng hình DFD thật.</i></p>`;

const q2ExplEn = `<p><b>How the 2.5 points are actually won and lost.</b></p>` +
  `<p><b>The 0.4 syntax mark is pass/fail on one thing: is there exactly one process, numbered 0, with no data stores?</b> Students who have just finished a DFD level-1 exercise reflexively add "D1 Ticket" or "D2 Schedule" stores, or split the system into "Manage Show", "Sell Ticket", "Check In". Both destroy the meaning of a context diagram — it exists to show the <i>boundary</i>, i.e. what is inside (one black box) versus what is outside — and both cost the whole 0.4.</p>` +
  `<p><b>The 0.6 entity mark is where the devices decide your score.</b> Almost everyone lists Manager, Staff and Visitor. The three that separate a 0.6 from a 0.3 are the ones the paper deliberately names in capitals: <b>Self-Service Ticket Kiosk</b>, <b>Barcode Reader</b>, <b>Announcement Sound System</b>. A useful habit for SWR302: when a paper bothers to give a device a proper noun, it is telling you it wants that device on the diagram. Note the Announcement Sound System is a <b>sink only</b> — the system pushes announcements out to it and gets nothing back — and a one-directional flow is perfectly legal.</p>` +
  `<p><b>The 1.5 data-flow mark is the largest and is graded on coverage and on naming.</b> Two rules:</p>` +
  `<ul><li><b>Every flow needs a data name, not a verb.</b> Write "ticket purchase request and payment", not "buys". The arrow already carries the direction; the label must carry the <i>data</i>.</li>` +
  `<li><b>Walk the paper paragraph by paragraph and convert each capability into a flow pair (in and out).</b> The paper contains eight distinct capability clusters: schedule management, price declaration, automatic announcements, kiosk self-service purchase, counter sale, ticket reprint, barcode check-in, and the staff cluster (work-schedule assignment, view-own-schedule, cancel request, approve/deny, evaluation and feedback, chat) plus the visitor-trend dashboard. If your diagram has fewer than about ten labelled arrows, you have skipped a paragraph.</li></ul>` +
  `<p><b>Scope trap specific to this paper:</b> the shows themselves, the artists and the "major brands" are <i>content</i>, not external entities — nothing in the paper says the system exchanges data with a brand. Adding a "Brand" or "Artist" terminator with no flow you can point to in the text is the kind of unsupported keyword the red rule warns about.</p>`;

const q2ExplVi = `<p><b>2,5 điểm này thắng thua ở đâu.</b></p>` +
  `<p><b>0,4 điểm cú pháp gần như là đạt/không đạt ở đúng một chuyện: có đúng một tiến trình, đánh số 0, và KHÔNG có data store hay không?</b> Bạn nào vừa làm bài DFD mức 1 xong hay theo phản xạ thêm "D1 Ticket", "D2 Schedule", hoặc chẻ hệ thống thành "Manage Show", "Sell Ticket", "Check In". Cả hai đều phá vỡ ý nghĩa của context diagram — nó sinh ra để chỉ ra <i>ranh giới</i>, tức cái gì bên trong (một hộp đen duy nhất) và cái gì bên ngoài — và cả hai đều mất trọn 0,4.</p>` +
  `<p><b>0,6 điểm thực thể ngoài do ba THIẾT BỊ quyết định.</b> Gần như ai cũng liệt kê Manager, Staff, Visitor. Ba cái tách 0,6 khỏi 0,3 là ba cái đề cố tình viết hoa: <b>Self-Service Ticket Kiosk</b>, <b>Barcode Reader</b>, <b>Announcement Sound System</b>. Một thói quen đáng có ở SWR302: khi đề chịu khó đặt tên riêng cho một thiết bị, đó là đề đang bảo bạn phải vẽ thiết bị đó lên sơ đồ. Chú ý Announcement Sound System chỉ là <b>đích nhận</b> — hệ thống đẩy thông báo ra và không nhận lại gì — và luồng một chiều là hoàn toàn hợp lệ.</p>` +
  `<p><b>1,5 điểm luồng dữ liệu là phần lớn nhất, chấm theo độ phủ và theo cách ĐẶT TÊN.</b> Hai nguyên tắc:</p>` +
  `<ul><li><b>Mỗi luồng phải mang tên DỮ LIỆU, không phải động từ.</b> Viết "ticket purchase request and payment", đừng viết "buys". Mũi tên đã mang hướng rồi; nhãn phải mang <i>dữ liệu</i>.</li>` +
  `<li><b>Đi từng đoạn của đề và đổi mỗi năng lực thành một cặp luồng (vào và ra).</b> Đề có tám cụm năng lực rõ rệt: quản lý lịch diễn, khai báo giá vé, thông báo âm thanh tự động, mua vé tự phục vụ ở ki-ốt, bán vé tại quầy, in lại vé, check-in bằng mã vạch, và cụm nhân viên (phân lịch, xem lịch của mình, xin huỷ, duyệt/từ chối, đánh giá & phản hồi, chat) cộng thêm dashboard xu hướng khách. Nếu sơ đồ của bạn có ít hơn khoảng mười mũi tên có nhãn, chắc chắn bạn đã bỏ sót một đoạn.</li></ul>` +
  `<p><b>Bẫy phạm vi riêng của đề này:</b> bản thân các suất diễn, các nghệ sĩ và các "thương hiệu lớn" là <i>nội dung</i>, không phải thực thể ngoài — không câu nào trong đề nói hệ thống trao đổi dữ liệu với một thương hiệu. Thêm terminator "Brand" hay "Artist" mà không chỉ được luồng nào trong đề chính là kiểu từ khoá không có căn cứ mà dòng chữ đỏ cảnh báo.</p>`;

const q2 = {
  kind: 'WRITE',
  points: 2.5,
  prompt: ML(q2PromptEn, q2PromptVi),
  sampleSolution: ML(q2SampleEn, q2SampleVi),
  explanation: B(q2ExplEn, q2ExplVi),
  imageUrl: IMG(2),
  rubric: [
    {
      id: 'syntax',
      criterion: B(
        'Correct context-diagram syntax: exactly ONE process numbered 0 and named "Show Management System"; external entities as rectangles outside it; named directed data-flow arrows; NO data stores and NO internal sub-processes.',
        'Đúng cú pháp context diagram: ĐÚNG MỘT tiến trình đánh số 0 tên "Show Management System"; thực thể ngoài là hình chữ nhật đặt bên ngoài; mũi tên luồng dữ liệu có hướng và có tên; KHÔNG có data store và KHÔNG có tiến trình con.',
      ),
      weight: 1,
      maxScore: 0.4,
    },
    {
      id: 'entities',
      criterion: B(
        'External entities cover the people (Manager, Staff, Visitor) AND the three devices named in the paper (Self-Service Ticket Kiosk, Barcode Reader, Announcement Sound System); no unsupported entity invented.',
        'Thực thể ngoài phủ cả người (Manager, Staff, Visitor) VÀ ba thiết bị đề nêu đích danh (Self-Service Ticket Kiosk, Barcode Reader, Announcement Sound System); không bịa thêm thực thể không có căn cứ trong đề.',
      ),
      weight: 1,
      maxScore: 0.6,
    },
    {
      id: 'dataflows',
      criterion: B(
        'Data flows are named with data (not verbs), correctly directed, and cover the paper\'s capabilities: schedule + price declaration, automatic announcement, kiosk self-purchase, counter sale, ticket reprint, barcode check-in, work-schedule assign / view / cancel request / approve-deny, evaluation and feedback, chat, and the visitor-trend dashboard.',
        'Luồng dữ liệu đặt tên theo DỮ LIỆU (không phải động từ), đúng hướng, và phủ được các năng lực của đề: lịch diễn + khai báo giá vé, thông báo tự động, tự mua vé ở ki-ốt, bán vé tại quầy, in lại vé, check-in bằng mã vạch, phân lịch / xem lịch / xin huỷ / duyệt-từ chối, đánh giá và phản hồi, chat, và dashboard xu hướng khách.',
      ),
      weight: 1,
      maxScore: 1.5,
    },
  ],
};

// ═════════════════════════════ Câu 3 (4.0 điểm) ═════════════════════════════

const USECASE_MERMAID = `<pre class="mermaid">graph LR;
  MGR(["Manager"]);
  STF(["Staff"]);
  VIS(["Visitor"]);
  KIOSK(["Self-Service Ticket Kiosk"]);
  BR(["Barcode Reader"]);
  ASS(["Announcement Sound System"]);
  subgraph SMS["Show Management System"]
    UC01(("UC-01 Log in"));
    UC02(("UC-02 Manage show schedule"));
    UC03(("UC-03 Declare ticket price"));
    UC04(("UC-04 Broadcast show announcement"));
    UC05(("UC-05 View show schedule"));
    UC06(("UC-06 Buy ticket at kiosk"));
    UC07(("UC-07 Sell ticket at counter"));
    UC08(("UC-08 Reprint lost ticket"));
    UC09(("UC-09 Check in visitor"));
    UC10(("UC-10 Scan ticket barcode"));
    UC11(("UC-11 Assign staff work schedule"));
    UC12(("UC-12 View own work schedule"));
    UC13(("UC-13 Request work-schedule cancellation"));
    UC14(("UC-14 Approve or deny cancellation"));
    UC15(("UC-15 Evaluate and give feedback"));
    UC16(("UC-16 Chat"));
    UC17(("UC-17 View visitor-trend dashboard"));
  end
  MGR --- UC01;
  MGR --- UC02;
  MGR --- UC03;
  MGR --- UC11;
  MGR --- UC14;
  MGR --- UC15;
  MGR --- UC16;
  MGR --- UC17;
  STF --- UC01;
  STF --- UC07;
  STF --- UC08;
  STF --- UC09;
  STF --- UC12;
  STF --- UC13;
  STF --- UC16;
  VIS --- UC05;
  VIS --- UC06;
  VIS --- UC07;
  VIS --- UC09;
  UC05 --- KIOSK;
  UC06 --- KIOSK;
  UC10 --- BR;
  UC04 --- ASS;
  UC02 -. include .-> UC04;
  UC09 -. include .-> UC10;
  UC06 -. include .-> UC05;
  UC08 -. extend .-> UC09;
  UC03 -. extend .-> UC02;
</pre>`;

const q3PromptEn = `<p><b>Question 3 (4.0 points).</b> Draw a <b>use case diagram</b> based on your answer in <b>question 2</b>, and <b>briefly describe</b> the actors and the use cases in the template provided with this exam paper.</p>` +
  `<p>Official sub-scores printed in the answer template:</p>` +
  `<ul><li>Draw the correct syntax to describe the use case diagram. <b>(0.4)</b></li>` +
  `<li>Draw actors <b>and their brief descriptions</b>. <b>(0.9)</b></li>` +
  `<li>Draw use cases <b>and their brief descriptions</b>. <b>(2.7)</b></li></ul>` +
  `<p>The template gives an <i>Actor / Description</i> table and a <i>Use Case / Actors / Description</i> table. The template prints only three sample rows in each table, but three is the layout of the form, not a limit: fill in as many rows as the paper's business actually needs.</p>`;

const q3PromptVi = `<p><b>Câu 3 (4,0 điểm).</b> Vẽ <b>use case diagram</b> dựa trên câu trả lời ở <b>câu 2</b>, và <b>mô tả ngắn gọn</b> các tác nhân và các use case theo mẫu được cung cấp cùng đề thi này.</p>` +
  `<p>Điểm con chính thức in trong file template trả lời:</p>` +
  `<ul><li>Vẽ đúng cú pháp của use case diagram. <b>(0,4)</b></li>` +
  `<li>Vẽ các tác nhân <b>kèm mô tả ngắn</b>. <b>(0,9)</b></li>` +
  `<li>Vẽ các use case <b>kèm mô tả ngắn</b>. <b>(2,7)</b></li></ul>` +
  `<p>Template có sẵn bảng <i>Actor / Description</i> và bảng <i>Use Case / Actors / Description</i>. Template chỉ in ba dòng mẫu ở mỗi bảng, nhưng ba là bố cục của biểu mẫu chứ không phải giới hạn: hãy điền đủ số dòng mà nghiệp vụ trong đề cần.</p>`;

const q3SampleEn = `<p><b>1) Correct syntax of a use case diagram (0.4).</b></p>` +
  `<ul><li>A <b>rectangle</b> is the system boundary and it must be <b>named after the system</b>: <b>Show Management System</b>.</li>` +
  `<li><b>Actors are OUTSIDE</b> the rectangle, drawn as stick figures (a non-human actor may be a stick figure or a &laquo;system&raquo; / &laquo;device&raquo; stereotyped box).</li>` +
  `<li><b>Use cases (ovals) are INSIDE</b> the rectangle, named <b>verb + object</b> ("Sell ticket at counter"), never as a noun ("Ticket").</li>` +
  `<li>An actor connects to a use case by a <b>plain solid line (association), with no arrowhead</b>.</li>` +
  `<li>&laquo;include&raquo; and &laquo;extend&raquo; are <b>dashed arrows between two use cases</b>: the &laquo;include&raquo; arrow points <b>from the base use case to the included one</b>; the &laquo;extend&raquo; arrow points <b>from the extending use case back to the base one</b>. Getting the extend arrow backwards is the classic error.</li></ul>` +
  `<p><b>2) Actors and brief descriptions (0.9).</b></p>` +
  `<table><thead><tr><th>#</th><th>Actor</th><th>Description</th></tr></thead><tbody>` +
  `<tr><td>01</td><td>Manager</td><td>Primary human actor. Creates and adjusts the daily and special show schedules, declares the ticket price for each type of show, assigns detailed work schedules to performing staff, evaluates and gives feedback to staff, approves or denies work-schedule cancellation requests, chats with staff, and reads the visitor-trend dashboard.</td></tr>` +
  `<tr><td>02</td><td>Staff</td><td>Primary human actor, and only if the manager has declared a work schedule for them (that declaration is what grants access). Sells show tickets at the ticket counter, reprints a ticket when a visitor loses one, checks visitors in at the show entrance, views their own assigned work schedule, submits work-schedule cancellation requests, and chats with the manager.</td></tr>` +
  `<tr><td>03</td><td>Visitor</td><td>Primary human actor. Views the show schedule, buys tickets by themselves at the Self-Service Ticket Kiosk or from staff at the ticket counter, and presents the ticket to be checked in at the show entrance.</td></tr>` +
  `<tr><td>04</td><td>Self-Service Ticket Kiosk</td><td>Secondary actor (device). The terminal on which the visitor views the schedule and completes a self-service purchase; it displays the schedule and prints the ticket.</td></tr>` +
  `<tr><td>05</td><td>Barcode Reader</td><td>Secondary actor (device). Scans the barcode printed on the ticket and returns the scanned code so the system can validate it during check-in.</td></tr>` +
  `<tr><td>06</td><td>Announcement Sound System</td><td>Secondary actor (device). Receives and plays the automatic audio announcements about upcoming shows across the water park.</td></tr>` +
  `</tbody></table>` +
  `<p><b>3) Use cases and brief descriptions (2.7).</b></p>` +
  `<table><thead><tr><th>#</th><th>Use case</th><th>Actors</th><th>Description</th></tr></thead><tbody>` +
  `<tr><td>UC-01</td><td>Log in</td><td>Manager, Staff</td><td>Authenticates a user before any management or counter operation. A staff member can only get in if the manager has declared a work schedule for them.</td></tr>` +
  `<tr><td>UC-02</td><td>Manage show schedule</td><td>Manager</td><td>Creates, adjusts and manages the schedule of daily shows (fixed times, every day) and special shows (special occasions, artists, brand cooperation).</td></tr>` +
  `<tr><td>UC-03</td><td>Declare ticket price</td><td>Manager</td><td>Declares the ticket price for each type of show: included in the entrance fee or a small surcharge for daily shows; a separate price not included in the entrance fee for special shows.</td></tr>` +
  `<tr><td>UC-04</td><td>Broadcast show announcement</td><td>Manager (initiated automatically by the system), Announcement Sound System</td><td>Sends the automatic audio announcement about an upcoming show to the Announcement Sound System so staff and visitors get the information quickly.</td></tr>` +
  `<tr><td>UC-05</td><td>View show schedule</td><td>Visitor, Self-Service Ticket Kiosk</td><td>Displays the list of upcoming shows with their times and prices, on the kiosk.</td></tr>` +
  `<tr><td>UC-06</td><td>Buy ticket at kiosk</td><td>Visitor, Self-Service Ticket Kiosk</td><td>The visitor selects a show, pays and receives a printed ticket with a barcode, without any staff involvement.</td></tr>` +
  `<tr><td>UC-07</td><td>Sell ticket at counter</td><td>Staff, Visitor</td><td>A staff member sells a show ticket to a visitor at the ticket counter and prints the ticket.</td></tr>` +
  `<tr><td>UC-08</td><td>Reprint lost ticket</td><td>Staff, Visitor</td><td>When a visitor loses their ticket, a staff member reissues it; the reprint must remain traceable to the original purchase so the same seat/show is not sold twice.</td></tr>` +
  `<tr><td>UC-09</td><td>Check in visitor</td><td>Staff, Visitor</td><td>At the show entrance, a staff member quickly checks a visitor in and the system records the admission.</td></tr>` +
  `<tr><td>UC-10</td><td>Scan ticket barcode</td><td>Barcode Reader, Staff</td><td>Reads the barcode printed on the ticket and validates it (valid / already used / invalid). Always executed as part of check-in.</td></tr>` +
  `<tr><td>UC-11</td><td>Assign staff work schedule</td><td>Manager, Staff</td><td>Assigns a detailed work schedule to each staff member performing the show (actors, musicians, technicians), covering working hours, breaks and other requirements.</td></tr>` +
  `<tr><td>UC-12</td><td>View own work schedule</td><td>Staff</td><td>A staff member views only the work schedule the manager assigned to them.</td></tr>` +
  `<tr><td>UC-13</td><td>Request work-schedule cancellation</td><td>Staff</td><td>A staff member submits a request to cancel their assigned work schedule, with a reason.</td></tr>` +
  `<tr><td>UC-14</td><td>Approve or deny cancellation request</td><td>Manager, Staff</td><td>The manager reviews a pending cancellation request and approves or denies it; the staff member is notified of the decision.</td></tr>` +
  `<tr><td>UC-15</td><td>Evaluate and give feedback to staff</td><td>Manager, Staff</td><td>The manager evaluates a staff member for a given show and records feedback so they can improve their skills and performance.</td></tr>` +
  `<tr><td>UC-16</td><td>Chat</td><td>Manager, Staff</td><td>The manager and staff exchange messages with each other through the chat function of the system.</td></tr>` +
  `<tr><td>UC-17</td><td>View visitor-trend dashboard</td><td>Manager</td><td>Shows the manager an analysis of the trend of visitors watching the shows by number and by time, so the schedule and the programme can be adjusted accordingly.</td></tr>` +
  `</tbody></table>` +
  `<p><b>Relationships used (state them explicitly — the grader looks for them):</b></p>` +
  `<ul><li>&laquo;include&raquo; <b>UC-09 Check in visitor &rarr; UC-10 Scan ticket barcode</b>: check-in <i>always</i> scans the barcode, so it is mandatory and reused. Dashed arrow points from UC-09 to UC-10.</li>` +
  `<li>&laquo;include&raquo; <b>UC-06 Buy ticket at kiosk &rarr; UC-05 View show schedule</b>: the visitor must see the schedule to pick a show. Arrow points from UC-06 to UC-05.</li>` +
  `<li>&laquo;include&raquo; <b>UC-02 Manage show schedule &rarr; UC-04 Broadcast show announcement</b>: publishing or changing a schedule triggers the automatic announcement.</li>` +
  `<li>&laquo;extend&raquo; <b>UC-08 Reprint lost ticket &rarr; UC-09 Check in visitor</b>: reprinting happens <i>only in the exceptional case</i> that the visitor lost the ticket. Dashed arrow points from the extending use case UC-08 <b>back to the base</b> UC-09.</li>` +
  `<li>&laquo;extend&raquo; <b>UC-03 Declare ticket price &rarr; UC-02 Manage show schedule</b>: a price is declared as an optional addition when a show is created or adjusted. Arrow points from UC-03 back to UC-02.</li></ul>` +
  `<p><i>These particular include/extend pairs are a defensible modelling choice, not a fact stated by the paper. Another pairing that you justify from the same sentences is equally acceptable.</i></p>` +
  `<p><b>Reference diagram:</b></p>` + USECASE_MERMAID;

const q3SampleVi = `<p><b>1) Đúng cú pháp use case diagram (0,4).</b></p>` +
  `<ul><li><b>Hình chữ nhật</b> là ranh giới hệ thống và phải <b>đặt tên theo hệ thống</b>: <b>Show Management System</b>.</li>` +
  `<li><b>Tác nhân nằm NGOÀI</b> hình chữ nhật, vẽ bằng hình người que (tác nhân không phải người có thể vẽ hình người que hoặc hộp có stereotype &laquo;system&raquo; / &laquo;device&raquo;).</li>` +
  `<li><b>Use case (hình bầu dục) nằm TRONG</b> hình chữ nhật, đặt tên <b>động từ + tân ngữ</b> ("Sell ticket at counter"), tuyệt đối không đặt tên bằng danh từ ("Ticket").</li>` +
  `<li>Tác nhân nối với use case bằng <b>đường liền nét trơn (association), KHÔNG có đầu mũi tên</b>.</li>` +
  `<li>&laquo;include&raquo; và &laquo;extend&raquo; là <b>mũi tên nét đứt giữa hai use case</b>: mũi tên &laquo;include&raquo; trỏ <b>từ use case cơ sở tới use case được gộp</b>; mũi tên &laquo;extend&raquo; trỏ <b>từ use case mở rộng ngược về use case cơ sở</b>. Vẽ ngược mũi tên extend là lỗi kinh điển.</li></ul>` +
  `<p><b>2) Tác nhân và mô tả ngắn (0,9).</b></p>` +
  `<table><thead><tr><th>#</th><th>Tác nhân</th><th>Mô tả</th></tr></thead><tbody>` +
  `<tr><td>01</td><td>Manager (Người quản lý)</td><td>Tác nhân người, chính. Tạo và điều chỉnh lịch diễn hằng ngày và đặc biệt, khai báo giá vé cho từng loại suất diễn, phân lịch làm việc chi tiết cho nhân viên biểu diễn, đánh giá và phản hồi cho nhân viên, duyệt hoặc từ chối yêu cầu huỷ lịch làm việc, chat với nhân viên, và xem dashboard xu hướng khách xem.</td></tr>` +
  `<tr><td>02</td><td>Staff (Nhân viên)</td><td>Tác nhân người, chính, và chỉ khi người quản lý đã khai báo lịch làm việc cho họ (chính việc khai báo đó mới cấp quyền truy cập). Bán vé suất diễn tại quầy, in lại vé khi khách làm mất, check-in khách tại cửa vào suất diễn, xem lịch làm việc được phân cho mình, gửi yêu cầu huỷ lịch làm việc, và chat với người quản lý.</td></tr>` +
  `<tr><td>03</td><td>Visitor (Khách tham quan)</td><td>Tác nhân người, chính. Xem lịch diễn, tự mua vé tại Ki-ốt Bán vé Tự phục vụ hoặc mua từ nhân viên tại quầy vé, và xuất trình vé để được check-in tại cửa vào suất diễn.</td></tr>` +
  `<tr><td>04</td><td>Self-Service Ticket Kiosk (Ki-ốt tự phục vụ)</td><td>Tác nhân phụ (thiết bị). Máy để khách xem lịch diễn và hoàn tất giao dịch mua vé tự phục vụ; nó hiển thị lịch và in vé.</td></tr>` +
  `<tr><td>05</td><td>Barcode Reader (Đầu đọc mã vạch)</td><td>Tác nhân phụ (thiết bị). Quét mã vạch in trên vé và trả về mã đã quét để hệ thống kiểm tra trong lúc check-in.</td></tr>` +
  `<tr><td>06</td><td>Announcement Sound System (Hệ thống loa thông báo)</td><td>Tác nhân phụ (thiết bị). Nhận và phát các thông báo âm thanh tự động về suất diễn sắp tới khắp công viên nước.</td></tr>` +
  `</tbody></table>` +
  `<p><b>3) Use case và mô tả ngắn (2,7).</b></p>` +
  `<table><thead><tr><th>#</th><th>Use case</th><th>Tác nhân</th><th>Mô tả</th></tr></thead><tbody>` +
  `<tr><td>UC-01</td><td>Log in (Đăng nhập)</td><td>Manager, Staff</td><td>Xác thực người dùng trước mọi thao tác quản lý hay bán vé. Nhân viên chỉ vào được nếu người quản lý đã khai báo lịch làm việc cho họ.</td></tr>` +
  `<tr><td>UC-02</td><td>Manage show schedule (Quản lý lịch diễn)</td><td>Manager</td><td>Tạo, điều chỉnh và quản lý lịch của suất diễn hằng ngày (giờ cố định, mỗi ngày) và suất diễn đặc biệt (dịp đặc biệt, nghệ sĩ, phối hợp thương hiệu).</td></tr>` +
  `<tr><td>UC-03</td><td>Declare ticket price (Khai báo giá vé)</td><td>Manager</td><td>Khai báo giá vé cho từng loại suất diễn: đã gồm trong phí vào cổng hoặc phụ thu nhỏ với suất hằng ngày; giá riêng không gồm trong phí vào cổng với suất đặc biệt.</td></tr>` +
  `<tr><td>UC-04</td><td>Broadcast show announcement (Phát thông báo suất diễn)</td><td>Manager (hệ thống tự kích hoạt), Announcement Sound System</td><td>Gửi thông báo âm thanh tự động về suất diễn sắp tới tới Hệ thống Loa Thông báo để nhân viên và khách nắm thông tin nhanh.</td></tr>` +
  `<tr><td>UC-05</td><td>View show schedule (Xem lịch diễn)</td><td>Visitor, Self-Service Ticket Kiosk</td><td>Hiển thị danh sách suất diễn sắp tới kèm giờ và giá, trên ki-ốt.</td></tr>` +
  `<tr><td>UC-06</td><td>Buy ticket at kiosk (Mua vé ở ki-ốt)</td><td>Visitor, Self-Service Ticket Kiosk</td><td>Khách chọn suất diễn, thanh toán và nhận vé in có mã vạch, không cần nhân viên can thiệp.</td></tr>` +
  `<tr><td>UC-07</td><td>Sell ticket at counter (Bán vé tại quầy)</td><td>Staff, Visitor</td><td>Nhân viên bán vé suất diễn cho khách tại quầy vé và in vé.</td></tr>` +
  `<tr><td>UC-08</td><td>Reprint lost ticket (In lại vé mất)</td><td>Staff, Visitor</td><td>Khi khách làm mất vé, nhân viên cấp lại; bản in lại phải truy được về giao dịch mua gốc để cùng một chỗ/suất diễn không bị bán hai lần.</td></tr>` +
  `<tr><td>UC-09</td><td>Check in visitor (Check-in khách)</td><td>Staff, Visitor</td><td>Tại cửa vào suất diễn, nhân viên check-in khách thật nhanh và hệ thống ghi nhận lượt vào.</td></tr>` +
  `<tr><td>UC-10</td><td>Scan ticket barcode (Quét mã vạch vé)</td><td>Barcode Reader, Staff</td><td>Đọc mã vạch in trên vé và kiểm tra (hợp lệ / đã dùng / không hợp lệ). Luôn được thực hiện như một phần của check-in.</td></tr>` +
  `<tr><td>UC-11</td><td>Assign staff work schedule (Phân lịch làm việc)</td><td>Manager, Staff</td><td>Phân lịch làm việc chi tiết cho từng nhân viên tham gia suất diễn (diễn viên, nhạc công, kỹ thuật viên), gồm giờ làm, giờ nghỉ và các yêu cầu khác.</td></tr>` +
  `<tr><td>UC-12</td><td>View own work schedule (Xem lịch của mình)</td><td>Staff</td><td>Nhân viên chỉ xem được lịch làm việc mà người quản lý đã phân cho chính họ.</td></tr>` +
  `<tr><td>UC-13</td><td>Request work-schedule cancellation (Xin huỷ lịch)</td><td>Staff</td><td>Nhân viên gửi yêu cầu huỷ lịch làm việc đã được phân, kèm lý do.</td></tr>` +
  `<tr><td>UC-14</td><td>Approve or deny cancellation request (Duyệt/từ chối yêu cầu huỷ)</td><td>Manager, Staff</td><td>Người quản lý xem yêu cầu huỷ đang chờ và duyệt hoặc từ chối; nhân viên được báo kết quả.</td></tr>` +
  `<tr><td>UC-15</td><td>Evaluate and give feedback to staff (Đánh giá và phản hồi)</td><td>Manager, Staff</td><td>Người quản lý đánh giá nhân viên cho một suất diễn và ghi phản hồi để họ cải thiện kỹ năng và hiệu suất.</td></tr>` +
  `<tr><td>UC-16</td><td>Chat</td><td>Manager, Staff</td><td>Người quản lý và nhân viên trao đổi tin nhắn với nhau qua chức năng chat của hệ thống.</td></tr>` +
  `<tr><td>UC-17</td><td>View visitor-trend dashboard (Xem dashboard xu hướng khách)</td><td>Manager</td><td>Hiện cho người quản lý phân tích xu hướng khách xem suất diễn theo số lượng và theo thời gian, để điều chỉnh lịch và chương trình cho phù hợp.</td></tr>` +
  `</tbody></table>` +
  `<p><b>Các quan hệ đã dùng (nêu rõ ra — người chấm tìm đúng chỗ này):</b></p>` +
  `<ul><li>&laquo;include&raquo; <b>UC-09 Check in visitor &rarr; UC-10 Scan ticket barcode</b>: check-in <i>luôn luôn</i> quét mã vạch, nên đây là bước bắt buộc và dùng lại. Mũi tên nét đứt trỏ từ UC-09 sang UC-10.</li>` +
  `<li>&laquo;include&raquo; <b>UC-06 Buy ticket at kiosk &rarr; UC-05 View show schedule</b>: khách phải xem lịch mới chọn được suất. Mũi tên trỏ từ UC-06 sang UC-05.</li>` +
  `<li>&laquo;include&raquo; <b>UC-02 Manage show schedule &rarr; UC-04 Broadcast show announcement</b>: công bố hoặc đổi lịch sẽ kích hoạt thông báo tự động.</li>` +
  `<li>&laquo;extend&raquo; <b>UC-08 Reprint lost ticket &rarr; UC-09 Check in visitor</b>: in lại vé chỉ xảy ra <i>trong tình huống ngoại lệ</i> khách làm mất vé. Mũi tên nét đứt trỏ từ use case mở rộng UC-08 <b>ngược về use case cơ sở</b> UC-09.</li>` +
  `<li>&laquo;extend&raquo; <b>UC-03 Declare ticket price &rarr; UC-02 Manage show schedule</b>: giá vé được khai báo như phần bổ sung tuỳ chọn khi tạo hoặc điều chỉnh suất diễn. Mũi tên trỏ từ UC-03 ngược về UC-02.</li></ul>` +
  `<p><i>Các cặp include/extend cụ thể này là LỰA CHỌN MÔ HÌNH có căn cứ, không phải điều đề nói thẳng. Một cách ghép khác mà bạn lý giải được từ chính những câu đó cũng được chấp nhận.</i></p>` +
  `<p><b>Sơ đồ tham chiếu:</b></p>` + USECASE_MERMAID;

const q3ExplEn = `<p><b>2.7 of the 4.0 points sit in one cell: "use cases AND their brief descriptions".</b> That single line is 27% of the whole paper — more than Q1 and Q2 combined. Two consequences follow, and both are about time management as much as modelling.</p>` +
  `<p><b>First: a diagram with no description table cannot score more than about a third of this question.</b> The template pairs each use case with a <i>Description</i> column for a reason. A student who spends 40 minutes making the Visual Paradigm layout pretty and then writes three one-word descriptions has optimised the wrong thing. Draw a plain diagram fast, then spend the time on the tables.</p>` +
  `<p><b>Second: coverage of the paper is the score.</b> Walk the paper sentence by sentence and turn each capability into a use case. This paper hides its longest list in the fourth paragraph — the staff cluster is <i>five</i> separate use cases (assign work schedule, view own schedule, request cancellation, approve/deny, evaluate and give feedback) plus chat, and it is the part most often collapsed into a single "Manage staff". Collapsing it is where most of the 2.7 is lost.</p>` +
  `<p><b>Two access rules in the paper that a good answer reflects, because they are the only sentences describing constraints:</b></p>` +
  `<ul><li>"Only staffs whose work schedule is declared by the manager can access and operate the system" — the work-schedule assignment <i>is</i> the access grant. Say this in the Staff actor description or as a pre-condition of Log in.</li>` +
  `<li>"Staffs can only view their work schedules assigned by the manager" — Staff has read-only, self-scoped access to schedules. This is why UC-12 must be "View <b>own</b> work schedule", not "View work schedules".</li></ul>` +
  `<p><b>The 0.4 syntax mark, in order of how often each is lost:</b> (1) the &laquo;extend&raquo; arrow drawn from base to extension instead of extension to base; (2) actors drawn inside the rectangle; (3) use cases named as nouns ("Ticket", "Schedule") instead of verb+object; (4) arrowheads put on plain actor-to-use-case associations, which should be a bare line.</p>` +
  `<p><b>On the "based on your answer in question 2" clause:</b> Q3 is graded partly for consistency with Q2. Every external entity you listed in the context diagram should reappear as an actor here, and every data flow you named should be traceable to at least one use case. Adding an actor in Q3 that was not in Q2, or dropping one that was, is a self-contradiction the grader can see across two pages.</p>`;

const q3ExplVi = `<p><b>2,7 trong 4,0 điểm nằm gọn trong MỘT ô: "use case VÀ mô tả ngắn của chúng".</b> Riêng dòng đó là 27% cả bài thi — nhiều hơn Q1 và Q2 cộng lại. Kéo theo hai hệ quả, và cả hai là chuyện phân bổ thời gian chứ không chỉ chuyện mô hình hoá.</p>` +
  `<p><b>Thứ nhất: sơ đồ không kèm bảng mô tả thì không thể quá khoảng một phần ba điểm câu này.</b> Template ghép mỗi use case với một cột <i>Description</i> là có lý do. Bạn nào dành 40 phút chỉnh bố cục Visual Paradigm cho đẹp rồi viết ba dòng mô tả mỗi dòng một chữ là đã tối ưu nhầm chỗ. Vẽ sơ đồ mộc thật nhanh, rồi dồn thời gian cho bảng.</p>` +
  `<p><b>Thứ hai: độ phủ so với đề CHÍNH LÀ điểm.</b> Đi từng câu của đề và đổi mỗi năng lực thành một use case. Đề này giấu danh sách dài nhất ở đoạn thứ tư — cụm nhân viên là <i>năm</i> use case riêng biệt (phân lịch, xem lịch của mình, xin huỷ, duyệt/từ chối, đánh giá & phản hồi) cộng thêm chat, và đây đúng là phần hay bị gộp thành mỗi "Manage staff". Gộp lại chính là chỗ mất phần lớn 2,7 điểm.</p>` +
  `<p><b>Hai quy tắc truy cập trong đề mà bài làm tốt phải phản ánh, vì đó là những câu duy nhất mô tả ràng buộc:</b></p>` +
  `<ul><li>"Only staffs whose work schedule is declared by the manager can access and operate the system" — việc phân lịch làm việc CHÍNH LÀ việc cấp quyền. Hãy nói điều này trong mô tả tác nhân Staff hoặc như tiền điều kiện của Log in.</li>` +
  `<li>"Staffs can only view their work schedules assigned by the manager" — Staff chỉ được đọc, và chỉ đọc lịch của chính mình. Vì thế UC-12 phải là "View <b>own</b> work schedule", không phải "View work schedules".</li></ul>` +
  `<p><b>0,4 điểm cú pháp, xếp theo mức độ hay mất:</b> (1) mũi tên &laquo;extend&raquo; vẽ từ cơ sở sang mở rộng thay vì từ mở rộng về cơ sở; (2) vẽ tác nhân nằm trong hình chữ nhật; (3) đặt tên use case bằng danh từ ("Ticket", "Schedule") thay vì động từ + tân ngữ; (4) gắn đầu mũi tên vào đường association tác nhân–use case, vốn phải là đường trơn không mũi tên.</p>` +
  `<p><b>Về mệnh đề "dựa trên câu trả lời ở câu 2":</b> Q3 được chấm một phần theo tính nhất quán với Q2. Mọi thực thể ngoài bạn liệt kê ở context diagram phải xuất hiện lại thành tác nhân ở đây, và mọi luồng dữ liệu bạn đặt tên phải truy được về ít nhất một use case. Thêm một tác nhân ở Q3 mà Q2 không có, hoặc bỏ mất một cái Q2 đã có, là tự mâu thuẫn mà người chấm nhìn thấy ngay khi lật hai trang.</p>`;

const q3 = {
  kind: 'WRITE',
  points: 4,
  prompt: ML(q3PromptEn, q3PromptVi),
  sampleSolution: ML(q3SampleEn, q3SampleVi),
  explanation: B(q3ExplEn, q3ExplVi),
  imageUrl: IMG(2),
  rubric: [
    {
      id: 'syntax',
      criterion: B(
        'Correct use-case-diagram syntax: rectangle named "Show Management System"; actors OUTSIDE it; ovals INSIDE it named verb+object; plain (arrowless) actor associations; dashed &laquo;include&raquo; arrow from base to included, dashed &laquo;extend&raquo; arrow from the extending use case back to the base.',
        'Đúng cú pháp use case diagram: hình chữ nhật tên "Show Management System"; tác nhân NGOÀI hình; bầu dục TRONG hình, tên động từ + tân ngữ; association với tác nhân là đường trơn không mũi tên; mũi tên nét đứt &laquo;include&raquo; đi từ cơ sở tới use case được gộp, mũi tên nét đứt &laquo;extend&raquo; đi từ use case mở rộng ngược về cơ sở.',
      ),
      weight: 1,
      maxScore: 0.4,
    },
    {
      id: 'actors',
      criterion: B(
        'Actors listed WITH a brief description each: Manager, Staff, Visitor plus the device actors (Self-Service Ticket Kiosk, Barcode Reader, Announcement Sound System); consistent with the external entities given in Question 2; the Staff description reflects that access is granted only when the manager has declared their work schedule.',
        'Liệt kê tác nhân KÈM mô tả ngắn cho từng cái: Manager, Staff, Visitor cộng các tác nhân thiết bị (Self-Service Ticket Kiosk, Barcode Reader, Announcement Sound System); nhất quán với các thực thể ngoài ở Câu 2; mô tả Staff phản ánh việc chỉ được truy cập khi người quản lý đã khai báo lịch làm việc cho họ.',
      ),
      weight: 1,
      maxScore: 0.9,
    },
    {
      id: 'usecases',
      criterion: B(
        'Use cases listed WITH a brief description and their actors, covering the paper without collapsing clusters: schedule management, ticket price declaration, automatic announcement, view schedule + self-purchase at the kiosk, counter sale, reprint of a lost ticket, barcode check-in, and the full staff cluster (assign work schedule, view OWN schedule, request cancellation, approve or deny, evaluate and give feedback), chat, and the visitor-trend dashboard; include/extend relationships stated and justified.',
        'Liệt kê use case KÈM mô tả ngắn và tác nhân của từng cái, phủ được đề mà không gộp cụm: quản lý lịch diễn, khai báo giá vé, thông báo tự động, xem lịch + tự mua vé ở ki-ốt, bán vé tại quầy, in lại vé mất, check-in bằng mã vạch, và trọn cụm nhân viên (phân lịch, xem lịch CỦA MÌNH, xin huỷ, duyệt hoặc từ chối, đánh giá và phản hồi), chat, và dashboard xu hướng khách; có nêu và lý giải quan hệ include/extend.',
      ),
      weight: 1,
      maxScore: 2.7,
    },
  ],
};

// ═════════════════════════════ Câu 4 (3.0 điểm) ═════════════════════════════

const ERD_MERMAID = `<pre class="mermaid">erDiagram
  MANAGER ||--o{ SHOW : "creates and adjusts"
  MANAGER ||--o{ WORK_SCHEDULE : "assigns"
  MANAGER ||--o{ CANCEL_REQUEST : "approves or denies"
  MANAGER ||--o{ FEEDBACK : "gives"
  MANAGER ||--o{ CHAT_MESSAGE : "sends"
  SHOW ||--o{ SHOW_SESSION : "is held as"
  SHOW ||--o{ TICKET_PRICE : "is priced by"
  SHOW_SESSION ||--o{ TICKET : "is sold as"
  SHOW_SESSION ||--o{ WORK_SCHEDULE : "requires"
  SHOW_SESSION ||--o{ ANNOUNCEMENT : "is announced by"
  SHOW_SESSION ||--o{ FEEDBACK : "is the subject of"
  VISITOR ||--o{ TICKET : "buys"
  TICKET ||--o| CHECK_IN : "is admitted by"
  TICKET_PRICE ||--o{ TICKET : "prices"
  KIOSK ||--o{ TICKET : "issues"
  STAFF ||--o{ TICKET : "sells or reprints"
  STAFF ||--o{ WORK_SCHEDULE : "is assigned"
  STAFF ||--o{ CHECK_IN : "performs"
  STAFF ||--o{ FEEDBACK : "receives"
  STAFF ||--o{ CHAT_MESSAGE : "sends"
  WORK_SCHEDULE ||--o{ CANCEL_REQUEST : "is cancelled by"
  BARCODE_READER ||--o{ CHECK_IN : "scans for"
  ANNOUNCEMENT_SOUND_SYSTEM ||--o{ ANNOUNCEMENT : "plays"
</pre>`;

const q4PromptEn = `<p><b>Question 4 (3.0 points).</b> Draw a <b>conceptual ERD</b> based on your answers in <b>question 2</b> and <b>question 3</b>, and <b>briefly describe</b> the entities in the template provided with this exam paper.</p>` +
  `<p>Official sub-scores printed in the answer template:</p>` +
  `<ul><li>Draw the correct syntax to describe the conceptual ERD. <b>(0.4)</b></li>` +
  `<li>Draw entities <b>and their brief descriptions</b>. <b>(1.8)</b></li>` +
  `<li>Draw relationships. <b>(0.8)</b></li></ul>` +
  `<p>Note that this is a <b>conceptual</b> ERD: entities, their relationships and cardinalities. Full attribute lists, data types, foreign keys and normalisation belong to a logical or physical model and are not what is being asked for.</p>`;

const q4PromptVi = `<p><b>Câu 4 (3,0 điểm).</b> Vẽ <b>conceptual ERD</b> (sơ đồ thực thể–quan hệ mức khái niệm) dựa trên câu trả lời ở <b>câu 2</b> và <b>câu 3</b>, và <b>mô tả ngắn gọn</b> các thực thể theo mẫu được cung cấp cùng đề thi này.</p>` +
  `<p>Điểm con chính thức in trong file template trả lời:</p>` +
  `<ul><li>Vẽ đúng cú pháp của conceptual ERD. <b>(0,4)</b></li>` +
  `<li>Vẽ các thực thể <b>kèm mô tả ngắn</b>. <b>(1,8)</b></li>` +
  `<li>Vẽ các quan hệ. <b>(0,8)</b></li></ul>` +
  `<p>Lưu ý đây là ERD mức <b>khái niệm</b>: thực thể, quan hệ giữa chúng và bản số (cardinality). Danh sách thuộc tính đầy đủ, kiểu dữ liệu, khoá ngoại và chuẩn hoá thuộc về mô hình logic/vật lý, không phải thứ đề đang hỏi.</p>`;

const q4SampleEn = `<p><b>1) Correct syntax of a conceptual ERD (0.4).</b></p>` +
  `<ul><li>Entities are <b>rectangles with singular noun names in UPPER CASE</b> (TICKET, not "tickets" and not "Buy ticket").</li>` +
  `<li>Relationships are <b>named lines between two entities, labelled with a verb phrase</b> read in a definite direction ("VISITOR <i>buys</i> TICKET").</li>` +
  `<li>Every relationship carries a <b>cardinality / multiplicity</b> at both ends (1:1, 1:N, M:N — or crow's foot notation).</li>` +
  `<li>At conceptual level, show at most the identifying attribute; <b>do not draw foreign keys</b> and do not resolve M:N into a junction table — that is a logical-model step.</li></ul>` +
  `<p><b>2) Entities and brief descriptions (1.8).</b></p>` +
  `<table><thead><tr><th>#</th><th>Entity</th><th>Description</th></tr></thead><tbody>` +
  `<tr><td>01</td><td>MANAGER</td><td>The person who manages the shows: creates and adjusts schedules, declares ticket prices, assigns work schedules, evaluates staff, decides cancellation requests and reads the dashboard.</td></tr>` +
  `<tr><td>02</td><td>STAFF</td><td>An employee of the water park who performs in or supports a show (actor, musician, technician) or works at a ticket counter. Can operate the system only while a work schedule has been declared for them.</td></tr>` +
  `<tr><td>03</td><td>VISITOR</td><td>A water-park guest who views the show schedule and buys tickets to watch shows.</td></tr>` +
  `<tr><td>04</td><td>SHOW</td><td>A show performed in the water park, with its type — <b>daily</b> (fixed times every day, price included in the entrance fee or a small surcharge) or <b>special</b> (special occasion, artists, brand cooperation, price not included in the entrance fee).</td></tr>` +
  `<tr><td>05</td><td>SHOW_SESSION</td><td>One concrete occurrence of a SHOW on a given date at a given start time and venue. This is what a ticket is actually sold for and what visitor-trend analysis is measured on.</td></tr>` +
  `<tr><td>06</td><td>TICKET_PRICE</td><td>A price declared by the manager for a show / show type, with the period it applies to and whether it is included in the entrance fee, a surcharge, or a separate price.</td></tr>` +
  `<tr><td>07</td><td>TICKET</td><td>A ticket issued for one show session, carrying a printed barcode, the amount paid, the issue channel (kiosk or counter), its status, and a link to the original ticket when it is a reprint of a lost one.</td></tr>` +
  `<tr><td>08</td><td>CHECK_IN</td><td>The record of a visitor being admitted at the show entrance: the ticket scanned, the time, the staff who did it and the result (valid / already used / invalid).</td></tr>` +
  `<tr><td>09</td><td>WORK_SCHEDULE</td><td>The detailed work assignment given by the manager to one staff member for a show session: working hours, breaks and other requirements. Its existence is also what grants that staff member access to the system.</td></tr>` +
  `<tr><td>10</td><td>CANCEL_REQUEST</td><td>A request submitted by a staff member to cancel an assigned work schedule, with its reason and its status (pending / approved / denied) as decided by the manager.</td></tr>` +
  `<tr><td>11</td><td>FEEDBACK</td><td>The evaluation and feedback the manager records for a staff member on a given show session, so they can improve their skills and performance.</td></tr>` +
  `<tr><td>12</td><td>CHAT_MESSAGE</td><td>A message exchanged between the manager and a staff member through the chat function, with its content and time.</td></tr>` +
  `<tr><td>13</td><td>ANNOUNCEMENT</td><td>An automatic audio announcement about an upcoming show session, with its content and broadcast time, played through the Announcement Sound System.</td></tr>` +
  `<tr><td>14</td><td>KIOSK</td><td>A Self-Service Ticket Kiosk installed in the park, identified by its code and location, at which visitors view the schedule and issue tickets themselves.</td></tr>` +
  `<tr><td>15</td><td>BARCODE_READER</td><td>A barcode-reading device at a show entrance, identified by its code and location, used to scan the barcode printed on a ticket during check-in.</td></tr>` +
  `<tr><td>16</td><td>ANNOUNCEMENT_SOUND_SYSTEM</td><td>The public-address device installed in the water park that plays the automatic announcements.</td></tr>` +
  `</tbody></table>` +
  `<p><i>MANAGER and STAFF are kept as two entities here because the paper treats them as two different roles with different rights. Merging them into one EMPLOYEE entity carrying a ROLE attribute is equally correct at conceptual level, as long as you say so. The three device entities (14-16) are optional at conceptual level: include them if you want to record which kiosk issued a ticket or which reader performed a scan.</i></p>` +
  `<p><b>3) Relationships (0.8).</b></p>` +
  `<table><thead><tr><th>Relationship</th><th>Cardinality</th><th>Reading</th></tr></thead><tbody>` +
  `<tr><td>MANAGER — SHOW</td><td>1 : N</td><td>One manager creates and adjusts many shows.</td></tr>` +
  `<tr><td>SHOW — SHOW_SESSION</td><td>1 : N</td><td>One show is held as many sessions (a daily show has one per day).</td></tr>` +
  `<tr><td>SHOW — TICKET_PRICE</td><td>1 : N</td><td>One show has many declared prices over time / per ticket type.</td></tr>` +
  `<tr><td>SHOW_SESSION — TICKET</td><td>1 : N</td><td>One session is sold as many tickets.</td></tr>` +
  `<tr><td>TICKET_PRICE — TICKET</td><td>1 : N</td><td>One declared price applies to many issued tickets.</td></tr>` +
  `<tr><td>VISITOR — TICKET</td><td>1 : N</td><td>One visitor buys many tickets.</td></tr>` +
  `<tr><td>KIOSK — TICKET</td><td>1 : N</td><td>One kiosk issues many tickets (a ticket sold at the counter has none).</td></tr>` +
  `<tr><td>STAFF — TICKET</td><td>1 : N</td><td>One staff member sells or reprints many tickets.</td></tr>` +
  `<tr><td>TICKET — CHECK_IN</td><td>1 : 0..1</td><td>A ticket is admitted at most once; a valid check-in consumes it.</td></tr>` +
  `<tr><td>STAFF — CHECK_IN</td><td>1 : N</td><td>One staff member performs many check-ins.</td></tr>` +
  `<tr><td>BARCODE_READER — CHECK_IN</td><td>1 : N</td><td>One reader scans for many check-ins.</td></tr>` +
  `<tr><td>MANAGER — WORK_SCHEDULE</td><td>1 : N</td><td>One manager assigns many work schedules.</td></tr>` +
  `<tr><td>STAFF — WORK_SCHEDULE</td><td>1 : N</td><td>One staff member is assigned many work schedules.</td></tr>` +
  `<tr><td>SHOW_SESSION — WORK_SCHEDULE</td><td>1 : N</td><td>One session requires many staff assignments (actors, musicians, technicians).</td></tr>` +
  `<tr><td>WORK_SCHEDULE — CANCEL_REQUEST</td><td>1 : N</td><td>One work schedule may be the subject of several cancellation requests.</td></tr>` +
  `<tr><td>MANAGER — CANCEL_REQUEST</td><td>1 : N</td><td>One manager approves or denies many cancellation requests.</td></tr>` +
  `<tr><td>MANAGER — FEEDBACK / STAFF — FEEDBACK / SHOW_SESSION — FEEDBACK</td><td>1 : N each</td><td>The manager gives many feedback records; a staff member receives many; each is about one session.</td></tr>` +
  `<tr><td>SHOW_SESSION — ANNOUNCEMENT</td><td>1 : N</td><td>One session is announced by many announcements.</td></tr>` +
  `<tr><td>ANNOUNCEMENT_SOUND_SYSTEM — ANNOUNCEMENT</td><td>1 : N</td><td>One sound system plays many announcements.</td></tr>` +
  `<tr><td>MANAGER — CHAT_MESSAGE / STAFF — CHAT_MESSAGE</td><td>1 : N each</td><td>Each party sends many chat messages.</td></tr>` +
  `</tbody></table>` +
  `<p><b>Note on STAFF &harr; SHOW_SESSION:</b> the relationship "a staff member performs in a show session" is inherently <b>M:N</b>. At conceptual level you may draw it as an M:N line, but the cleaner answer — and the one used above — is to let <b>WORK_SCHEDULE</b> be the entity that resolves it, since the paper already gives that assignment its own data (working hours, breaks, requirements) and its own lifecycle (it can be cancelled).</p>` +
  `<p><b>Reference diagram:</b></p>` + ERD_MERMAID;

const q4SampleVi = `<p><b>1) Đúng cú pháp conceptual ERD (0,4).</b></p>` +
  `<ul><li>Thực thể là <b>hình chữ nhật, tên danh từ số ít VIẾT HOA</b> (TICKET, không phải "tickets" và không phải "Buy ticket").</li>` +
  `<li>Quan hệ là <b>đường nối hai thực thể, có nhãn là cụm động từ</b> đọc theo một chiều xác định ("VISITOR <i>buys</i> TICKET").</li>` +
  `<li>Mọi quan hệ đều phải ghi <b>bản số (cardinality / multiplicity)</b> ở cả hai đầu (1:1, 1:N, M:N — hoặc ký pháp chân chim).</li>` +
  `<li>Ở mức khái niệm, nhiều lắm chỉ nêu thuộc tính định danh; <b>KHÔNG vẽ khoá ngoại</b> và không tách M:N thành bảng trung gian — đó là bước của mô hình logic.</li></ul>` +
  `<p><b>2) Thực thể và mô tả ngắn (1,8).</b></p>` +
  `<table><thead><tr><th>#</th><th>Thực thể</th><th>Mô tả</th></tr></thead><tbody>` +
  `<tr><td>01</td><td>MANAGER</td><td>Người quản lý các suất diễn: tạo và điều chỉnh lịch, khai báo giá vé, phân lịch làm việc, đánh giá nhân viên, quyết định yêu cầu huỷ và xem dashboard.</td></tr>` +
  `<tr><td>02</td><td>STAFF</td><td>Nhân viên công viên nước biểu diễn hoặc hỗ trợ suất diễn (diễn viên, nhạc công, kỹ thuật viên) hoặc làm ở quầy vé. Chỉ vận hành được hệ thống khi đã có lịch làm việc được khai báo cho họ.</td></tr>` +
  `<tr><td>03</td><td>VISITOR</td><td>Khách của công viên nước, xem lịch diễn và mua vé để xem suất diễn.</td></tr>` +
  `<tr><td>04</td><td>SHOW</td><td>Một suất diễn trong công viên nước, kèm loại — <b>hằng ngày</b> (giờ cố định mỗi ngày, giá đã gồm trong phí vào cổng hoặc có phụ thu nhỏ) hoặc <b>đặc biệt</b> (dịp đặc biệt, nghệ sĩ, phối hợp thương hiệu, giá không gồm trong phí vào cổng).</td></tr>` +
  `<tr><td>05</td><td>SHOW_SESSION</td><td>Một lần diễn cụ thể của SHOW vào một ngày, một giờ bắt đầu và một địa điểm. Đây mới là thứ vé thực sự được bán cho, và là thứ mà phân tích xu hướng khách đo trên đó.</td></tr>` +
  `<tr><td>06</td><td>TICKET_PRICE</td><td>Một mức giá do người quản lý khai báo cho một suất diễn / loại suất diễn, kèm khoảng thời gian áp dụng và việc giá đó đã gồm trong phí vào cổng, là phụ thu, hay là giá riêng.</td></tr>` +
  `<tr><td>07</td><td>TICKET</td><td>Vé phát hành cho một lần diễn, mang mã vạch in trên vé, số tiền đã trả, kênh phát hành (ki-ốt hay quầy), trạng thái, và liên kết tới vé gốc khi đây là bản in lại của vé bị mất.</td></tr>` +
  `<tr><td>08</td><td>CHECK_IN</td><td>Bản ghi việc khách được cho vào tại cửa suất diễn: vé đã quét, thời điểm, nhân viên thực hiện và kết quả (hợp lệ / đã dùng / không hợp lệ).</td></tr>` +
  `<tr><td>09</td><td>WORK_SCHEDULE</td><td>Lịch làm việc chi tiết người quản lý giao cho một nhân viên ở một lần diễn: giờ làm, giờ nghỉ và các yêu cầu khác. Chính sự tồn tại của nó cũng là thứ cấp quyền truy cập hệ thống cho nhân viên đó.</td></tr>` +
  `<tr><td>10</td><td>CANCEL_REQUEST</td><td>Yêu cầu nhân viên gửi để huỷ một lịch làm việc đã được phân, kèm lý do và trạng thái (chờ / đã duyệt / bị từ chối) do người quản lý quyết định.</td></tr>` +
  `<tr><td>11</td><td>FEEDBACK</td><td>Đánh giá và phản hồi người quản lý ghi cho một nhân viên ở một lần diễn, để họ cải thiện kỹ năng và hiệu suất.</td></tr>` +
  `<tr><td>12</td><td>CHAT_MESSAGE</td><td>Tin nhắn trao đổi giữa người quản lý và nhân viên qua chức năng chat, kèm nội dung và thời điểm.</td></tr>` +
  `<tr><td>13</td><td>ANNOUNCEMENT</td><td>Thông báo âm thanh tự động về một lần diễn sắp tới, kèm nội dung và thời điểm phát, phát qua Hệ thống Loa Thông báo.</td></tr>` +
  `<tr><td>14</td><td>KIOSK</td><td>Một Ki-ốt Bán vé Tự phục vụ lắp trong công viên, định danh bằng mã và vị trí, nơi khách xem lịch và tự phát hành vé.</td></tr>` +
  `<tr><td>15</td><td>BARCODE_READER</td><td>Thiết bị đọc mã vạch ở cửa vào suất diễn, định danh bằng mã và vị trí, dùng để quét mã vạch in trên vé lúc check-in.</td></tr>` +
  `<tr><td>16</td><td>ANNOUNCEMENT_SOUND_SYSTEM</td><td>Thiết bị loa công cộng lắp trong công viên nước, phát các thông báo tự động.</td></tr>` +
  `</tbody></table>` +
  `<p><i>Ở đây MANAGER và STAFF để riêng thành hai thực thể vì đề coi chúng là hai vai trò khác nhau với quyền khác nhau. Gộp thành một thực thể EMPLOYEE mang thuộc tính ROLE cũng đúng ở mức khái niệm, miễn là bạn nói rõ. Ba thực thể thiết bị (14-16) là tuỳ chọn ở mức khái niệm: đưa vào nếu bạn muốn ghi nhận ki-ốt nào phát hành vé hay đầu đọc nào thực hiện lượt quét.</i></p>` +
  `<p><b>3) Quan hệ (0,8).</b></p>` +
  `<table><thead><tr><th>Quan hệ</th><th>Bản số</th><th>Đọc là</th></tr></thead><tbody>` +
  `<tr><td>MANAGER — SHOW</td><td>1 : N</td><td>Một người quản lý tạo và điều chỉnh nhiều suất diễn.</td></tr>` +
  `<tr><td>SHOW — SHOW_SESSION</td><td>1 : N</td><td>Một suất diễn được tổ chức thành nhiều lần diễn (suất hằng ngày có mỗi ngày một lần).</td></tr>` +
  `<tr><td>SHOW — TICKET_PRICE</td><td>1 : N</td><td>Một suất diễn có nhiều mức giá được khai báo theo thời gian / theo loại vé.</td></tr>` +
  `<tr><td>SHOW_SESSION — TICKET</td><td>1 : N</td><td>Một lần diễn được bán ra nhiều vé.</td></tr>` +
  `<tr><td>TICKET_PRICE — TICKET</td><td>1 : N</td><td>Một mức giá đã khai báo áp cho nhiều vé đã phát hành.</td></tr>` +
  `<tr><td>VISITOR — TICKET</td><td>1 : N</td><td>Một khách mua nhiều vé.</td></tr>` +
  `<tr><td>KIOSK — TICKET</td><td>1 : N</td><td>Một ki-ốt phát hành nhiều vé (vé bán ở quầy thì không thuộc ki-ốt nào).</td></tr>` +
  `<tr><td>STAFF — TICKET</td><td>1 : N</td><td>Một nhân viên bán hoặc in lại nhiều vé.</td></tr>` +
  `<tr><td>TICKET — CHECK_IN</td><td>1 : 0..1</td><td>Một vé chỉ được cho vào nhiều nhất một lần; một lượt check-in hợp lệ tiêu thụ nó.</td></tr>` +
  `<tr><td>STAFF — CHECK_IN</td><td>1 : N</td><td>Một nhân viên thực hiện nhiều lượt check-in.</td></tr>` +
  `<tr><td>BARCODE_READER — CHECK_IN</td><td>1 : N</td><td>Một đầu đọc quét cho nhiều lượt check-in.</td></tr>` +
  `<tr><td>MANAGER — WORK_SCHEDULE</td><td>1 : N</td><td>Một người quản lý phân nhiều lịch làm việc.</td></tr>` +
  `<tr><td>STAFF — WORK_SCHEDULE</td><td>1 : N</td><td>Một nhân viên được phân nhiều lịch làm việc.</td></tr>` +
  `<tr><td>SHOW_SESSION — WORK_SCHEDULE</td><td>1 : N</td><td>Một lần diễn cần nhiều lượt phân công nhân viên (diễn viên, nhạc công, kỹ thuật viên).</td></tr>` +
  `<tr><td>WORK_SCHEDULE — CANCEL_REQUEST</td><td>1 : N</td><td>Một lịch làm việc có thể là đối tượng của vài yêu cầu huỷ.</td></tr>` +
  `<tr><td>MANAGER — CANCEL_REQUEST</td><td>1 : N</td><td>Một người quản lý duyệt hoặc từ chối nhiều yêu cầu huỷ.</td></tr>` +
  `<tr><td>MANAGER — FEEDBACK / STAFF — FEEDBACK / SHOW_SESSION — FEEDBACK</td><td>mỗi cái 1 : N</td><td>Người quản lý ghi nhiều phản hồi; một nhân viên nhận nhiều phản hồi; mỗi phản hồi gắn với một lần diễn.</td></tr>` +
  `<tr><td>SHOW_SESSION — ANNOUNCEMENT</td><td>1 : N</td><td>Một lần diễn được thông báo bằng nhiều bản thông báo.</td></tr>` +
  `<tr><td>ANNOUNCEMENT_SOUND_SYSTEM — ANNOUNCEMENT</td><td>1 : N</td><td>Một hệ thống loa phát nhiều thông báo.</td></tr>` +
  `<tr><td>MANAGER — CHAT_MESSAGE / STAFF — CHAT_MESSAGE</td><td>mỗi cái 1 : N</td><td>Mỗi bên gửi nhiều tin nhắn chat.</td></tr>` +
  `</tbody></table>` +
  `<p><b>Ghi chú về STAFF &harr; SHOW_SESSION:</b> quan hệ "một nhân viên biểu diễn trong một lần diễn" tự nó là <b>M:N</b>. Ở mức khái niệm bạn có thể vẽ thẳng đường M:N, nhưng cách gọn hơn — và là cách dùng ở trên — là để <b>WORK_SCHEDULE</b> làm thực thể hoá giải nó, vì đề vốn đã cho lượt phân công đó dữ liệu riêng (giờ làm, giờ nghỉ, yêu cầu) và vòng đời riêng (có thể bị huỷ).</p>` +
  `<p><b>Sơ đồ tham chiếu:</b></p>` + ERD_MERMAID;

const q4ExplEn = `<p><b>1.8 of the 3.0 points is entities-with-descriptions, so the same rule as Q3 applies: the table is worth more than the picture.</b> But this question has a modelling trap of its own that the marking of "relationships" (0.8) turns on.</p>` +
  `<p><b>The trap is SHOW versus SHOW_SESSION.</b> Almost every weak answer draws a single SHOW entity and hangs TICKET straight off it. That model cannot express this paper. Look at what the paper actually asks the software to do: daily shows are "held every day at fixed times", and the dashboard analyses "the trend of visitors watching the show <b>by number and time</b>". A ticket is not for "the dolphin show" in the abstract — it is for the 15:00 performance on 25 June. Without a SHOW_SESSION (or SHOW_TIME / PERFORMANCE) entity you cannot count visitors per time slot, which is the one analytical requirement the paper spells out, and you cannot say which performance a ticket admits you to. Splitting SHOW (the definition, its type and its price policy) from SHOW_SESSION (one dated occurrence) is the single decision that separates a good ERD here from a mediocre one.</p>` +
  `<p><b>A second, smaller one: WORK_SCHEDULE is an entity, not an attribute of STAFF.</b> The paper gives it its own data (working hours, breaks, other requirements), its own assigner (the manager), and its own lifecycle (a staff member can request cancellation and the manager approves or denies it). Anything with its own lifecycle is an entity. The same test promotes CANCEL_REQUEST, FEEDBACK and CHECK_IN out of being mere flags.</p>` +
  `<p><b>Where the 0.4 syntax mark goes:</b> at conceptual level you are being marked for entity/relationship/cardinality, so the two ways to lose it are (a) omitting cardinalities — an unlabelled line is not a relationship — and (b) over-engineering into a physical model: drawing FK columns, data types, or resolving M:N into junction tables. Doing more than the level asks for is still wrong, because the question named the level.</p>` +
  `<p><b>For the 0.8 relationship mark, name every relationship with a verb read in one direction</b> ("STAFF <i>is assigned</i> WORK_SCHEDULE"), and do not leave the derived ones out: TICKET&ndash;CHECK_IN is 1:0..1 (a ticket is admitted at most once — this is what makes a reused barcode detectable), and reprinting a lost ticket is best modelled as TICKET relating to itself (a reprint points at the original) rather than as a separate REPRINT entity.</p>` +
  `<p><b>Consistency again:</b> the question says "based on the answer in question 2 and question 3". Each use case you wrote in Q3 should be able to read and write something here. If UC-15 "Evaluate and give feedback" has nowhere to store its result, your ERD is incomplete; if you have an entity no use case ever touches, one of the two answers is wrong.</p>`;

const q4ExplVi = `<p><b>1,8 trong 3,0 điểm là thực thể kèm mô tả, nên nguyên tắc y hệt Q3: cái BẢNG đáng giá hơn cái hình.</b> Nhưng câu này có một cái bẫy mô hình riêng, và chính nó quyết định 0,8 điểm "quan hệ".</p>` +
  `<p><b>Cái bẫy là SHOW so với SHOW_SESSION.</b> Gần như mọi bài yếu đều vẽ đúng một thực thể SHOW rồi móc thẳng TICKET vào đó. Mô hình ấy không diễn đạt nổi đề này. Hãy nhìn kỹ đề bắt phần mềm làm gì: suất diễn hằng ngày "diễn ra mỗi ngày vào giờ cố định", và dashboard phân tích "xu hướng khách xem suất diễn <b>theo số lượng và theo thời gian</b>". Một cái vé không phải vé cho "suất diễn cá heo" chung chung — nó là vé cho buổi 15:00 ngày 25/06. Không có thực thể SHOW_SESSION (hay SHOW_TIME / PERFORMANCE) thì bạn không đếm được khách theo khung giờ, mà đó lại đúng là yêu cầu phân tích duy nhất đề nói thẳng ra, và cũng không nói được vé cho bạn vào buổi diễn nào. Tách SHOW (định nghĩa, loại, chính sách giá) khỏi SHOW_SESSION (một lần diễn có ngày giờ) là quyết định duy nhất tách một ERD tốt khỏi một ERD tầm tầm ở đề này.</p>` +
  `<p><b>Cái thứ hai, nhỏ hơn: WORK_SCHEDULE là THỰC THỂ, không phải thuộc tính của STAFF.</b> Đề cho nó dữ liệu riêng (giờ làm, giờ nghỉ, yêu cầu khác), người phân riêng (manager), và vòng đời riêng (nhân viên xin huỷ, quản lý duyệt hoặc từ chối). Thứ gì có vòng đời riêng thì là thực thể. Cùng phép thử đó nâng CANCEL_REQUEST, FEEDBACK và CHECK_IN lên khỏi thân phận "một cái cờ".</p>` +
  `<p><b>0,4 điểm cú pháp mất ở đâu:</b> ở mức khái niệm bạn bị chấm về thực thể/quan hệ/bản số, nên hai cách mất là (a) quên ghi bản số — một đường không nhãn thì chưa phải quan hệ — và (b) làm quá đà thành mô hình vật lý: vẽ cột khoá ngoại, kiểu dữ liệu, hoặc tách M:N thành bảng trung gian. Làm NHIỀU hơn mức đề hỏi vẫn là sai, vì đề đã gọi tên mức rồi.</p>` +
  `<p><b>Để lấy 0,8 điểm quan hệ, đặt tên mọi quan hệ bằng động từ đọc theo một chiều</b> ("STAFF <i>is assigned</i> WORK_SCHEDULE"), và đừng bỏ sót các quan hệ suy ra: TICKET&ndash;CHECK_IN là 1:0..1 (một vé chỉ vào được nhiều nhất một lần — chính điều này làm cho mã vạch dùng lại bị phát hiện), còn việc in lại vé mất nên mô hình hoá bằng quan hệ TICKET với chính nó (bản in lại trỏ về vé gốc) chứ đừng đẻ ra thực thể REPRINT riêng.</p>` +
  `<p><b>Lại là tính nhất quán:</b> đề ghi "dựa trên câu trả lời ở câu 2 và câu 3". Mỗi use case bạn viết ở Q3 phải đọc/ghi được một thứ gì đó ở đây. Nếu UC-15 "Đánh giá và phản hồi" không có chỗ nào lưu kết quả thì ERD của bạn còn thiếu; nếu bạn có một thực thể mà không use case nào chạm tới thì một trong hai câu đang sai.</p>`;

const q4 = {
  kind: 'WRITE',
  points: 3,
  prompt: ML(q4PromptEn, q4PromptVi),
  sampleSolution: ML(q4SampleEn, q4SampleVi),
  explanation: B(q4ExplEn, q4ExplVi),
  imageUrl: IMG(2),
  rubric: [
    {
      id: 'syntax',
      criterion: B(
        'Correct conceptual-ERD syntax: entities as rectangles with singular UPPER-CASE noun names; relationships as named verb-phrase lines; cardinality shown at both ends of every relationship; no foreign keys, data types or M:N junction tables (those belong to the logical model).',
        'Đúng cú pháp conceptual ERD: thực thể là hình chữ nhật, tên danh từ số ít VIẾT HOA; quan hệ là đường có nhãn cụm động từ; ghi bản số ở cả hai đầu mọi quan hệ; không vẽ khoá ngoại, kiểu dữ liệu hay bảng trung gian M:N (những thứ đó thuộc mô hình logic).',
      ),
      weight: 1,
      maxScore: 0.4,
    },
    {
      id: 'entities',
      criterion: B(
        'Entities listed WITH a brief description each, covering the paper: the actors (MANAGER, STAFF, VISITOR), SHOW separated from the dated SHOW_SESSION, TICKET_PRICE, TICKET, CHECK_IN, WORK_SCHEDULE, CANCEL_REQUEST, FEEDBACK, CHAT_MESSAGE and ANNOUNCEMENT; WORK_SCHEDULE / CANCEL_REQUEST / FEEDBACK / CHECK_IN treated as entities in their own right, not as attributes.',
        'Liệt kê thực thể KÈM mô tả ngắn cho từng cái, phủ được đề: các tác nhân (MANAGER, STAFF, VISITOR), SHOW tách khỏi SHOW_SESSION có ngày giờ, TICKET_PRICE, TICKET, CHECK_IN, WORK_SCHEDULE, CANCEL_REQUEST, FEEDBACK, CHAT_MESSAGE và ANNOUNCEMENT; WORK_SCHEDULE / CANCEL_REQUEST / FEEDBACK / CHECK_IN được coi là thực thể độc lập, không phải thuộc tính.',
      ),
      weight: 1,
      maxScore: 1.8,
    },
    {
      id: 'relationships',
      criterion: B(
        'Relationships named with a verb phrase and carrying correct cardinality: SHOW 1:N SHOW_SESSION, SHOW_SESSION 1:N TICKET, VISITOR 1:N TICKET, TICKET 1:0..1 CHECK_IN, STAFF 1:N WORK_SCHEDULE and SHOW_SESSION 1:N WORK_SCHEDULE (WORK_SCHEDULE resolving the M:N between staff and sessions), WORK_SCHEDULE 1:N CANCEL_REQUEST, and the manager\'s 1:N links to schedules, cancellation decisions and feedback.',
        'Quan hệ có nhãn cụm động từ và ghi đúng bản số: SHOW 1:N SHOW_SESSION, SHOW_SESSION 1:N TICKET, VISITOR 1:N TICKET, TICKET 1:0..1 CHECK_IN, STAFF 1:N WORK_SCHEDULE và SHOW_SESSION 1:N WORK_SCHEDULE (WORK_SCHEDULE hoá giải quan hệ M:N giữa nhân viên và lần diễn), WORK_SCHEDULE 1:N CANCEL_REQUEST, cùng các liên kết 1:N của người quản lý tới lịch làm việc, quyết định huỷ và phản hồi.',
      ),
      weight: 1,
      maxScore: 0.8,
    },
  ],
};

// ═════════════════════════════════ Deck ═════════════════════════════════════

const questions = [q1, q2, q3, q4];
const totalPoints = questions.reduce((s, q) => s + q.points, 0);

const spec = {
  course: { courseCode: 'SWR302' },
  exams: [
    {
      kind: 'PE',
      peType: 'WRITE',
      code: 'PE24',
      title: 'SWR302 — Practical Exam PE24 (SU25 PE2)|||SWR302 — Thi thực hành PE24 (SU25 PE2)',
      description:
        'Software Requirements PE (WRITE) — Show Management System for a water park: SRS first page, context diagram, use case diagram, conceptual ERD. AI-graded against the official sub-scores.|||Đề PE Kỹ nghệ yêu cầu (viết) — Show Management System cho công viên nước: trang đầu SRS, context diagram, use case diagram, conceptual ERD. AI chấm theo đúng thang điểm con chính thức.',
      durationMinutes: 90,
      totalPoints,
      passMark: 5,
      source: 'FUOverflow',
      instructions,
      isPublished: true,
      questions,
    },
  ],
};

// ───────────────────────── Bộ kiểm trước khi ghi ────────────────────────────

const errs = [];
if (totalPoints !== 10) errs.push(`tổng points = ${totalPoints}, phải là 10`);
questions.forEach((q, i) => {
  const sum = q.rubric.reduce((s, r) => s + r.maxScore, 0);
  if (Math.abs(sum - q.points) > 1e-9) {
    errs.push(`câu ${i + 1}: rubric cộng lại ${sum} ≠ points ${q.points}`);
  }
  if (!q.imageUrl) errs.push(`câu ${i + 1}: thiếu imageUrl`);
});

// mỗi trường song ngữ phải có ĐÚNG MỘT dấu "|||"; instructions/prompt/sample
// dùng khối ml-en/ml-vi nên phải có ĐÚNG KHÔNG dấu nào.
const countPipes = (s) => s.split('|||').length - 1;
const MUST_ONE = ['title', 'description'];
MUST_ONE.forEach((k) => {
  const n = countPipes(spec.exams[0][k]);
  if (n !== 1) errs.push(`exam.${k}: có ${n} dấu ||| (phải đúng 1)`);
});
if (countPipes(instructions) !== 0) errs.push('instructions không được chứa |||');
questions.forEach((q, i) => {
  ['prompt', 'sampleSolution'].forEach((k) => {
    if (countPipes(q[k]) !== 0) errs.push(`câu ${i + 1}.${k}: dùng khối ml-en/ml-vi, không được chứa |||`);
  });
  if (countPipes(q.explanation) !== 1) {
    errs.push(`câu ${i + 1}.explanation: có ${countPipes(q.explanation)} dấu ||| (phải đúng 1)`);
  }
  q.rubric.forEach((r) => {
    if (countPipes(r.criterion) !== 1) {
      errs.push(`câu ${i + 1}.rubric.${r.id}: có ${countPipes(r.criterion)} dấu ||| (phải đúng 1)`);
    }
  });
});

// cấm markdown lọt vào trường hiển thị
const MD = /(^|[^\w`])(\*\*|__|^#{1,6}\s|^\s*[-*]\s|```)/m;
const scan = (label, s) => { if (MD.test(s)) errs.push(`${label}: nghi có cú pháp markdown`); };
scan('instructions', instructions);
questions.forEach((q, i) => {
  scan(`câu ${i + 1}.prompt`, q.prompt);
  scan(`câu ${i + 1}.sampleSolution`, q.sampleSolution);
  scan(`câu ${i + 1}.explanation`, q.explanation);
});

if (errs.length) {
  console.error('✗ KHÔNG ghi file, lỗi:');
  errs.forEach((e) => console.error('  - ' + e));
  process.exit(1);
}

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT}`);
console.log(`  PE/WRITE ${questions.length} câu — ${questions.map((q) => q.points).join(' + ')} = ${totalPoints} điểm`);
console.log('  rubric mỗi câu cộng đúng bằng points ✓ · |||  đúng 1 dấu/trường song ngữ ✓ · 4/4 câu có ảnh đề ✓');
