/**
 * lab211-huongdan.mjs — NỘI DUNG của bốn tài liệu thầy phát, đọc từng trang.
 *
 * Thuần dữ liệu, KHÔNG chạm DB. Hai nơi dùng chung file này nên nội dung không
 * thể lệch nhau:
 *   • scripts/codelab-lab211-huongdan.mjs  → module Code Lab
 *   • scripts/academy-lab211-huongdan.mjs  → chương Academy (cắt thành bài học)
 *
 * Mỗi trang tài liệu gồm: ảnh gốc → nguyên văn chữ in trên trang → nghĩa là gì
 * với bạn → việc phải làm.
 */
const H = 'https://media.cuongthai.com/code-lab/lab211/hdc';

export const BLOCKS = [];
const B = BLOCKS;
const part = (number, text, textVi, subtitle, subtitleVi) =>
  B.push({ type: 'part', number: String(number), text, textVi, subtitle, subtitleVi });
const head = (text, textVi) => B.push({ type: 'heading', text, textVi });
const p = (html) => B.push({ type: 'prose', html });
const img = (file, caption) => B.push({ type: 'image', url: `${H}/${file}`, caption });
const code = (title, titleVi, language, c) => B.push({ type: 'code', title, titleVi, language, code: c });

/** Khối "trên trang in gì" — chép nguyên văn, để đối chiếu với ảnh. */
const nguyenVan = (...dong) =>
  p(`<div class="trich-slide"><p class="nhan">📄 <strong>Trên trang này in gì</strong></p>` +
    dong.map((d) => `<p>${d}</p>`).join('') + `</div>`);

// ══════════════════════════════════════════════════════════════
part(1,
  'Document A — "Hướng dẫn học LAB211", 10 slides',
  'Tài liệu A — "Hướng dẫn học LAB211", 10 slide',
  'The deck that defines pass and fail',
  'Bộ slide định nghĩa đạt và không đạt');

p(`<p>Đây là <strong>tài liệu quan trọng nhất</strong> trong bốn tài liệu. Nó không dạy Java — nó nói
<em>thầy chấm cái gì</em>. Mười slide, và slide 9–10 gần như là bản án: đọc sót một dòng ở đó là mất
buổi học.</p>
<p>Cách đọc bên dưới: mỗi trang có <strong>ảnh gốc</strong> → <strong>nguyên văn chữ in trên trang</strong>
→ <strong>nghĩa là gì với bạn</strong> → <strong>việc phải làm</strong>. Đọc hết một lượt rồi quay lại
đọc riêng slide 9 và 10 lần nữa.</p>`);

// ─── SLIDE 1 ──────────────────────────────────────────────
head('Slide 1 — Cover page and the mentor email you will need', 'Slide 1 — Trang bìa và email thầy');
img('hd-01.png', 'Slide 1 — "Hướng dẫn học LAB211". Giảng viên: Nguyen Van An (FE FPTU HN), annv22@fe.edu.vn.');
nguyenVan(
  '<em>"Hướng dẫn học LAB211"</em>',
  '<em>"Chào mừng bạn đến với LAB211, môn học thực hành Java OOP. Môn học này sẽ giúp bạn củng cố kiến thức lập trình hướng đối tượng, nắm vững cách sử dụng Java và rèn luyện kỹ năng giải quyết vấn đề."</em>',
  '<em>by Nguyen Van An (FE FPTU HN) — annv22@fe.edu.vn</em>');
p(`<h4>Nghĩa là gì</h4>
<p>Trang bìa nghe như thủ tục, nhưng có <strong>hai thông tin bạn sẽ cần dùng thật</strong>:</p>
<ul>
  <li><strong><code>annv22@fe.edu.vn</code></strong> — email thầy. Tài liệu USB (tài liệu C) bắt buộc
  <strong>CC giảng viên</strong> khi gửi email đăng ký địa chỉ MAC. Không CC thì email <em>không có hiệu
  lực</em>, dù bạn gửi đúng mọi thứ khác. Lưu địa chỉ này vào danh bạ ngay bây giờ.</li>
  <li><strong>"môn học <u>thực hành</u> Java OOP"</strong> — chữ "thực hành" là chìa khoá của cả môn.
  Không có bài kiểm tra lý thuyết, không có đề thi cuối kỳ. Điểm của bạn = số dòng code bạn
  <em>viết được và bảo vệ được</em> trong 20 buổi. Học thuộc lý thuyết mà không gõ ra được thì bằng không.</li>
</ul>
<h4>Việc phải làm</h4>
<p>Lưu <code>annv22@fe.edu.vn</code> — bạn cần nó ở tài liệu C. Và ghi nhớ: <strong>môn này tính theo
sản phẩm, không tính theo hiểu biết</strong>.</p>`);

// ─── SLIDE 2 ──────────────────────────────────────────────
head('Slide 2 — The four numbers that decide whether you pass', 'Slide 2 — Mục tiêu và Yêu cầu');
img('hd-02.png', 'Slide 2 — Mục tiêu (4 gạch đầu dòng) và Yêu cầu: 20 slot · tham gia ≥ 80% · tổng LOC ≥ 750 · đã pass PRO192.');
nguyenVan(
  '<strong>Mục tiêu:</strong> Củng cố OOP · Nắm vững Java · Rèn luyện kỹ năng giải quyết vấn đề · Thành thạo kỹ thuật lập trình',
  '<strong>Yêu cầu:</strong> Tổng thời gian: 20 slot · Tham gia thực hành ≥ 80% · <strong>Tổng số LOC: ≥ 750</strong> · Pass môn PRO192');
p(`<h4>Nghĩa là gì</h4>
<p>Cột phải là <strong>hợp đồng</strong>. Bốn dòng, và mỗi dòng là một cách trượt riêng biệt:</p>
<table>
  <tr><th>Con số</th><th>Nghĩa thật</th><th>Trượt kiểu nào</th></tr>
  <tr><td><strong>20 slot</strong></td><td>Toàn bộ thời gian bạn có. Mỗi slot ~1,5 giờ.</td><td>Hết slot mà chưa đủ LOC</td></tr>
  <tr><td><strong>≥ 80% tham gia</strong></td><td>Vắng quá <strong>4 buổi</strong> là trượt, kể cả LOC đã đủ.</td><td>Trượt vì điểm danh</td></tr>
  <tr><td><strong>≥ 750 LOC</strong></td><td>Tổng số dòng code <em>đã được thầy review và SUBMIT</em>.</td><td>Trượt vì thiếu số dòng</td></tr>
  <tr><td><strong>Pass PRO192</strong></td><td>Điều kiện đầu vào — bạn đã có.</td><td>—</td></tr>
</table>
<h4>Làm phép chia — đây là chỗ nhiều người tính sai</h4>
<p><strong>750 LOC ÷ 20 slot ≈ 38 LOC/buổi.</strong> Nghe rất nhẹ. Nhưng thực tế không chia đều được, vì:</p>
<ul>
  <li><strong>Buổi 1 = 0 LOC.</strong> Slide 9 ghi rõ bài <code>P0055</code> làm ở buổi đầu
  <em>"Không tính LOC"</em>. Vậy chỉ còn <strong>19 buổi</strong>.</li>
  <li><strong>LOC chỉ được cộng khi thầy đã review xong và bạn đã SUBMIT.</strong> Code xong mà chưa
  được gọi review thì vẫn là 0.</li>
  <li>Một buổi chỉ review được vài lượt — thầy phải đi hết cả lớp.</li>
</ul>
<p>Con số thật là <strong>750 ÷ 19 ≈ 40 LOC/buổi</strong>, và mỗi buổi phải <em>xong hẳn một cái gì đó</em>
để có cái mà gọi review. Đây là lý do chiến thuật đúng là <strong>làm bài vừa sức, xong gọn, review ngay</strong>
— chứ không phải ôm một bài 300 LOC và ba buổi liền không có gì để nộp.</p>
<h4>Việc phải làm</h4>
<p>Mở sổ, kẻ một bảng 20 dòng: <em>buổi · bài định làm · LOC dự kiến · LOC đã được duyệt</em>. Cập nhật
sau mỗi buổi. Biết mình đang thừa hay thiếu bao nhiêu là thứ giúp bạn không hoảng ở tuần 6 — lần trước
bạn dừng lại ở 70 LOC tuần 6 chính vì không có bảng này.</p>`);

// ─── SLIDE 3 ──────────────────────────────────────────────
head('Slide 3 — The first four topics on the "must know" list', 'Slide 3 — Kiến thức cần nắm (1–4)');
img('hd-03.png', 'Slide 3 — Kiến thức Cần Nắm: 1. OOP · 2. Java coding convention · 3. Access modifier · 4. Static.');
nguyenVan(
  '<strong>1. OOP</strong> — "Các tính chất của OOP"',
  '<strong>2. Java coding convention</strong> — "Quy tắc đặt tên trong Java"',
  '<strong>3. Access modifier</strong> — "Kiểm soát truy cập vào thành phần"',
  '<strong>4. Static</strong> — "Khái niệm Static trong Java"');
p(`<h4>Nghĩa là gì</h4>
<p>Đừng đọc slide này như một mục lục môn học. Nó là <strong>danh sách câu hỏi vấn đáp</strong>. Đối chiếu
với slide 10 sẽ thấy trùng khớp gần như từng dòng:</p>
<table>
  <tr><th>Slide 3 ghi</th><th>Slide 10 hỏi lại thành</th></tr>
  <tr><td>1. OOP — các tính chất</td><td>"liệt kê 4 tính chất ra, phải chỉ được src của nó có tính chất nào của OOP"</td></tr>
  <tr><td>2. Java coding convention</td><td>"Đúng coding convention, không đảm bảo convention sẽ không review tiếp"</td></tr>
  <tr><td>3. Access modifier</td><td>"khái niệm, phạm vi, và <strong>chỉ rõ tại sao trong source chúng nó cần dùng</strong>"</td></tr>
  <tr><td>4. Static</td><td>"tại sao dùng static? Bỏ đi thì sao? Nếu ko dùng thì sửa source thế nào cho chạy"</td></tr>
</table>
<p>Bốn chủ đề này <strong>không phải để học thuộc — mà để chỉ vào code của chính bạn</strong>. Chú ý cách
diễn đạt ở mục 3: không phải "access modifier là gì", mà là <em>"tại sao trong source chúng nó cần dùng"</em>.
Đó là câu hỏi về <strong>quyết định thiết kế của bạn</strong>, không phải về định nghĩa.</p>
<h4>Ba mức trả lời — thầy phân biệt được ngay</h4>
<ul>
  <li>❌ <strong>Mức thuộc lòng:</strong> "private là chỉ truy cập được trong class." → đúng, nhưng chưa
  trả lời câu hỏi. Thầy hỏi tiếp và bạn hết vốn.</li>
  <li>⚠️ <strong>Mức nửa vời:</strong> "Em để private cho đúng đóng gói." → nghe như học vẹt.</li>
  <li>✅ <strong>Mức đạt:</strong> "Em để <code>code</code> là private vì mã bác sĩ không được sửa tuỳ tiện
  từ ngoài. Ai muốn đổi phải qua <code>setCode()</code>, và nếu sau này thầy bắt kiểm tra định dạng mã thì
  em chỉ thêm một chỗ trong setter, chứ không phải đi sửa mọi nơi gọi." → có <em>lý do</em>, có
  <em>hệ quả</em>, chỉ được <em>dòng cụ thể</em>.</li>
</ul>
<h4>Việc phải làm</h4>
<p>Ba chủ đề 1, 3, 4 được dạy đầy đủ trong module <strong>"OOP · SOLID · Design Pattern"</strong>; chủ đề 2
nằm ở module <strong>"Kiến trúc 8 package"</strong>. Học xong quay lại slide này tự hỏi bốn câu, trả lời
thành tiếng, tay chỉ vào màn hình.</p>`);

// ─── SLIDE 4 ──────────────────────────────────────────────
head('Slide 4 — The remaining three topics; number 7 is where marks are', 'Slide 4 — Kiến thức cần nắm (5–7)');
img('hd-04.png', 'Slide 4 — 5. Khai báo, gọi hàm, truyền tham số · 6. Kiểu dữ liệu cơ bản (int, float, double, String, Date, List, ArrayList, Map, HashMap) · 7. SOLID, Design Pattern.');
nguyenVan(
  '<strong>5. Khai báo, gọi hàm, truyền tham số</strong> — "Cách thức khai báo, gọi và truyền tham số"',
  '<strong>6. Kiểu dữ liệu cơ bản</strong> — "int, float, double, String, Date, List, ArrayList, Map, HashMap"',
  '<strong>7. SOLID, Design Pattern</strong>');
p(`<h4>Mục 6 — để ý thầy liệt kê CẢ interface lẫn class</h4>
<p>Danh sách viết là <em>"List, ArrayList, Map, HashMap"</em> — <strong>cả bốn, không phải hai</strong>.
Đó không phải thừa. Nó báo trước một câu hỏi vấn đáp cụ thể: <em>"List với ArrayList khác nhau chỗ nào?"</em></p>
<table>
  <tr><th></th><th>Là gì</th><th>Đặc điểm</th></tr>
  <tr><td><code>List</code></td><td><strong>Interface</strong> — bản hợp đồng</td><td>Nói "có add, get, size", không nói cài đặt thế nào</td></tr>
  <tr><td><code>ArrayList</code></td><td><strong>Class</strong> — một cách cài đặt</td><td>Bằng mảng động: lấy theo chỉ số rất nhanh, chèn/xoá giữa thì chậm</td></tr>
  <tr><td><code>Map</code></td><td><strong>Interface</strong></td><td>"có put, get theo khoá, khoá là duy nhất"</td></tr>
  <tr><td><code>HashMap</code></td><td><strong>Class</strong></td><td>Cài bằng bảng băm: tra theo khoá gần như tức thì, <strong>KHÔNG giữ thứ tự</strong></td></tr>
</table>
<p>⚠️ <strong>Và đây là bẫy lớn nhất của cả môn với người dùng AI.</strong> Thầy yêu cầu khai báo bằng
<strong><code>ArrayList</code> và <code>HashMap</code></strong> — kiểu cụ thể. Trong khi mọi công cụ AI đều
sinh ra <code>List&lt;Doctor&gt; ds = new ArrayList&lt;&gt;();</code> vì đó là chuẩn công nghiệp. Bạn dán
vào là lộ ngay, và nặng hơn: bạn không giải thích được tại sao mình viết thế.</p>`);
code('Declaration style your mentor requires', 'Cách khai báo thầy yêu cầu', 'java',
`// ❌ Kieu AI hay sinh ra — chuan cong nghiep, nhung KHONG phai cai thay hoi
List<Doctor> danhSach = new ArrayList<>();
Map<String, Doctor> kho = new HashMap<>();

// ✅ Kieu thay yeu cau — khai bao thang bang class cu the
ArrayList<Doctor> danhSach = new ArrayList<>();
HashMap<String, Doctor> kho = new HashMap<>();`);
p(`<h4>Mục 5 — "truyền tham số" nối thẳng với slide 5</h4>
<p>Slide 5 sẽ nói <em>"Đóng gói — Không truyền dữ liệu qua lại"</em>. Ghép hai mục lại thành một luật:
<strong>tham số phải là một đối tượng (model hoặc DTO), không phải một chuỗi tham số rời</strong>. Đây
cũng là lý do có luật "không truyền quá 3 tham số cho một hàm".</p>`);
code('Parameters: loose vs boxed', 'Tham số: rời rạc và đóng hộp', 'java',
`// ❌ Bon tham so roi — kho doc, de hoan vi nham, va vi pham "khong truyen du lieu qua lai"
public void addDoctor(String code, String name, String specialization, int availability) { }
addDoctor(name, code, spec, 5);   // hoan vi 2 tham so dau -> van BIEN DICH DUOC, chay sai

// ✅ Dong vao mot hop (DTO) roi truyen — mot tham so, khong the hoan vi nham
public void addDoctor(DoctorRequestDTO dto) { }`);
p(`<h4>Mục 7 — chỉ có bốn chữ, nhưng là chỗ ăn điểm to nhất</h4>
<p>Slide 10 nói thẳng: <em>"Implement và hiểu SOLID <strong>được cộng LOC</strong>"</em>. Và tài liệu
<code>OOP_Java_Guide</code> của thầy chốt <strong>5 Design Pattern</strong>: Builder, Singleton,
Factory Method, Observer, Strategy — không phải 23 mẫu GoF.</p>
<p>Chiến thuật hợp lý: <strong>hai pattern làm thật thành thạo</strong> (Singleton cho Repository +
Strategy cho sắp xếp) còn hơn kể tên năm cái. Nhớ nguyên tắc: thầy hỏi <em>"tại sao dùng"</em> chứ không
hỏi <em>"có dùng không"</em>.</p>`);

// ─── SLIDE 5 ──────────────────────────────────────────────
head('Slide 5 — Four practice requirements, and the hardest sentence in the deck', 'Slide 5 — Yêu cầu Thực hành');
img('hd-05.png', 'Slide 5 — Yêu cầu Thực hành, chia bốn ô: OOP · Cấu trúc project · SOLID · Đóng gói.');
nguyenVan(
  '<strong>OOP</strong> — "Tất cả triển khai theo OOP"',
  '<strong>Cấu trúc project</strong> — "Phân chia package, class, method theo MVC"',
  '<strong>SOLID</strong> — "Model đáp ứng nguyên tắc Single Responsibility"',
  '<strong>Đóng gói</strong> — "Không truyền dữ liệu qua lại"');
p(`<h4>Ô 1: "Tất cả triển khai theo OOP" — chữ "tất cả" là nghiêm túc</h4>
<p>Slide 9 nói rõ hệ quả: <em>"Các bài liên quan thuật toán như fibo, sắp xếp,… <strong>cũng phải làm MVC,
không OOP/MVC → không review</strong>"</em>. Nghĩa là bài Fibonacci 21 LOC — thứ mà bình thường viết gọn
trong một hàm <code>main</code> — vẫn phải có đủ package, đủ class, đủ tầng. Không có ngoại lệ cho bài dễ.</p>

<h4>Ô 2: "theo MVC" — và đây là chỗ dễ hiểu sai</h4>
<p>MVC gốc là mẫu cho ứng dụng có giao diện. Nhưng cái thầy phát cho bạn ở file <code>Guide</code> là
<strong>tám package</strong>: <code>constants · dto · main · controller · model · repository · service ·
utils · view</code>. Đó là MVC <em>đã được mở rộng</em> cho ứng dụng console. Bạn làm theo <strong>đúng
tám package đó</strong>, đừng tự "đơn giản hoá" về ba thư mục Model/View/Controller — thầy so với bài mẫu
của chính thầy.</p>

<h4>Ô 3: "Model đáp ứng Single Responsibility"</h4>
<p>Trong cả năm nguyên lý SOLID, thầy chỉ chỉ đích danh <strong>một</strong>, và chỉ đích danh
<strong>ở Model</strong>. Slide 7 dành nguyên một trang để vẽ lại ý này. Nghĩa là:</p>
<ul>
  <li>Class <code>Doctor</code> <strong>chỉ giữ dữ liệu</strong> + getter/setter + <code>toString()</code>.</li>
  <li><strong>Không</strong> có <code>System.out.println</code> trong Model.</li>
  <li><strong>Không</strong> có <code>Scanner</code> trong Model.</li>
  <li><strong>Không</strong> có nghiệp vụ (tìm kiếm, kiểm tra trùng, tính toán) trong Model.</li>
</ul>

<h4>Ô 4: "Không truyền dữ liệu qua lại" — câu khó hiểu nhất cả bộ slide</h4>
<p>Chỉ có sáu chữ, không giải thích thêm. Đọc lần đầu ai cũng bối rối: <em>"không truyền dữ liệu thì các
class nói chuyện với nhau kiểu gì?"</em></p>
<p><strong>Nó không cấm truyền dữ liệu. Nó cấm truyền dữ liệu ở dạng RỜI RẠC.</strong> Dữ liệu phải nằm
<em>trong một đối tượng</em> rồi mới được đi qua ranh giới giữa các tầng.</p>`);
code('What "no passing data around" actually forbids', 'Câu "không truyền dữ liệu qua lại" cấm cái gì', 'java',
`// ❌ Du lieu chay lung tung duoi dang tham so roi, qua ba tang
controller.addDoctor("D01", "Nguyen Van An", "Tim mach", 5);
  -> service.addDoctor("D01", "Nguyen Van An", "Tim mach", 5);
     -> repository.add("D01", "Nguyen Van An", "Tim mach", 5);
// Them mot truong "phone" = phai sua chu ky ham o CA BA tang.

// ✅ Dong vao hop truoc, roi hop di qua cac tang
DoctorRequestDTO dto = new DoctorRequestDTO(code, name, spec, availability);
controller.addDoctor(dto);
  -> service.addDoctor(dto);
     -> repository.add(new Doctor(dto));
// Them mot truong "phone" = chi sua DTO va Model. Ba tang giua KHONG doi mot chu.`);
p(`<p>Đây chính là <strong>lý do tồn tại của package <code>dto</code></strong>, và cũng là lý do có luật
"không quá 3 tham số cho một hàm" — quá 3 nghĩa là bạn đang truyền rời, đáng lẽ phải đóng hộp.</p>
<p>💡 Muốn thấy điều này bằng tay: làm <strong>bài luyện số 1 — thêm trường <code>phone</code></strong>
trong module bộ khung. Bạn sẽ sửa 9 file, và <code>DoctorController</code> nằm trong số những file
<strong>không phải sửa một chữ nào</strong>. Đó là tiền lãi của quy tắc này.</p>`);

// ─── SLIDE 6 ──────────────────────────────────────────────
head('Slide 6 — Naming rules, typo included', 'Slide 6 — Quy tắc đặt tên');
img('hd-06.png', 'Slide 6 — Quy tắc đặt tên, bốn ô: Project · Package · Class · Method.');
nguyenVan(
  '<strong>Project:</strong> <code>RollNo_ExcerciseNo_ExcerciseDescription</code>',
  '<strong>Package:</strong> main, controllers/services, exceptions, utils',
  '<strong>Class:</strong> Student, Worker, Wallet, Person',
  '<strong>Method:</strong> <code>calcSummaryFee()</code>, <code>checkValidAge()</code>');
p(`<h4>Ô Project — chép đúng, kể cả chỗ sai chính tả</h4>
<p>Slide viết <code>Excercise</code> (thừa một chữ <code>c</code>; đúng chính tả là <em>Exercise</em>).
Bài mẫu của thầy đặt tên thư mục là <code>HE176322_J1S0055_DoctorManagement</code>. <strong>Cứ theo bài
mẫu.</strong> Đây không phải chỗ để bạn sửa lỗi cho thầy — tên project là thứ thầy nhìn đầu tiên khi mở
bài, và một cái tên "lạ" là điểm trừ vô nghĩa.</p>`);
code('Project name — pattern and worked example', 'Tên project — công thức và ví dụ thật', 'text',
`Cong thuc:  <RollNo>_<ExerciseNo>_<Description>

Vi du that (bai mau cua thay):
    HE176322_J1S0055_DoctorManagement
    |        |       +-- mo ta viet lien, PascalCase
    |        +-- ma bai, bo dau cham: J1.S.P0055 -> J1S0055
    +-- ma sinh vien cua BAN (doi thanh ma cua ban!)

Bai khac cua ban se la:
    HE176322_J1S0054_ContactManagement
    HE176322_J1S0071_TaskManagement`);
p(`<h4>Ô Package — và một mâu thuẫn bạn phải biết</h4>
<p>Slide liệt kê <em>"main, controllers/services, exceptions, utils"</em> — bốn cái. Nhưng file
<code>Guide</code> mà thầy phát ở buổi đầu lại quy định <strong>tám package</strong>:
<code>constants · dto · main · controller · model · repository · service · utils · view</code>.</p>
<p><strong>Theo file <code>Guide</code>, không theo slide này.</strong> Lý do: slide là bản tóm tắt giới
thiệu, còn <code>Guide</code> là đặc tả kèm mã nguồn mẫu chạy được — và thầy chấm bằng cách so với bài mẫu.
Chi tiết đầy đủ nằm ở module <strong>"Kiến trúc 8 package"</strong>.</p>

<h4>Ô Class — danh từ số ít, PascalCase</h4>
<p>Bốn ví dụ <em>Student, Worker, Wallet, Person</em> đều là <strong>danh từ, số ít, viết hoa chữ đầu mỗi
từ</strong>. Không có <code>StudentManager</code>, không có <code>Students</code>, không có
<code>DoctorClass</code>. Một class model = <strong>một</strong> đối tượng trong đời thực.</p>

<h4>Ô Method — động từ trước, camelCase, và ẩn ý về kiểu trả về</h4>
<p>Hai ví dụ được chọn rất có chủ đích:</p>
<ul>
  <li><code>calcSummaryFee()</code> — bắt đầu bằng <strong>động từ</strong> <code>calc</code>. Tên nói
  <em>hàm này tính ra một con số</em> ⇒ kiểu trả về phải là số, không phải <code>void</code>.</li>
  <li><code>checkValidAge()</code> — bắt đầu bằng <code>check</code>. Tên nói <em>hàm này trả lời có/không</em>
  ⇒ kiểu trả về phải là <code>boolean</code>.</li>
</ul>
<p>Nghĩa là <strong>tên hàm phải khớp với kiểu trả về</strong>. Một hàm tên <code>calcTotal()</code> mà trả
<code>void</code> rồi in ra màn hình là sai hai lần: sai tên, và sai cả tầng (in là việc của View).</p>`);
code('Naming — the shape of every name in your project', 'Đặt tên — khuôn của mọi cái tên trong bài', 'java',
`package    -> tat ca CHU THUONG:              model, repository, utils
Class      -> PascalCase, danh tu so it:      Doctor, DoctorRepository
method     -> camelCase, bat dau bang DONG TU: addDoctor(), isDuplicate()
bien       -> camelCase, danh tu:             doctorCode, availability
HANG SO    -> IN HOA, gach duoi:              MAX_LENGTH, INVALID_CHOICE

// Tien to dong tu noi truoc kieu tra ve:
get...            -> tra ve gia tri
is... / has...    -> tra ve boolean
add/remove/update -> void
calc/count/sum    -> tra ve so
find/search       -> tra ve doi tuong hoac tap hop`);

// ─── SLIDE 7 ──────────────────────────────────────────────
head('Slide 7 — A whole page for one rule', 'Slide 7 — Single Responsibility');
img('hd-07.png', 'Slide 7 — "Single Responsibility trong SOLID", sơ đồ ba bậc: 1. Single Responsibility → 2. Model: định nghĩa class với thuộc tính → 3. Controller/Service: thực hiện hàm chức năng.');
nguyenVan(
  '<strong>Single Responsibility</strong>',
  '1 → <strong>Model</strong>: "Định nghĩa class với thuộc tính"',
  '2 → <strong>Controller/Service</strong>: "Thực hiện hàm chức năng"');
p(`<h4>Nghĩa là gì</h4>
<p>Thầy dành <strong>nguyên một slide trên mười</strong> cho một nguyên lý duy nhất trong năm nguyên lý
SOLID. Tỷ lệ đó nói lên mức quan trọng. Và nội dung rút gọn thành một đường ranh giới:</p>
<table>
  <tr><th></th><th>Model</th><th>Controller / Service</th></tr>
  <tr><td>Chứa gì</td><td>Thuộc tính (field)</td><td>Hàm chức năng</td></tr>
  <tr><td>Trả lời câu hỏi</td><td>"Nó <strong>là</strong> cái gì"</td><td>"Nó <strong>làm</strong> được gì"</td></tr>
  <tr><td>Được phép có</td><td>field private, constructor, getter/setter, <code>toString()</code></td><td>nghiệp vụ: thêm/xoá/tìm/sắp xếp/kiểm tra trùng</td></tr>
  <tr><td>Cấm tuyệt đối</td><td><code>System.out</code>, <code>Scanner</code>, nghiệp vụ, <code>static</code></td><td>—</td></tr>
</table>
<p><strong>Một lý do để thay đổi</strong> — đó là định nghĩa của SRP. Class <code>Doctor</code> chỉ đổi khi
<em>thông tin của một bác sĩ</em> đổi (thêm số điện thoại chẳng hạn). Nó <strong>không</strong> được đổi vì
cách hiển thị đổi, vì cách lưu trữ đổi, hay vì luật nghiệp vụ đổi.</p>`);
code('The line this slide draws', 'Đường ranh giới slide này vẽ ra', 'java',
`// ❌ Model om them viec khong phai cua no
public class Doctor {
    private String code;
    public void inThongTin() {                        // <- HIEN THI: viec cua View
        System.out.println("Ma: " + code);
    }
    public boolean kiemTraTrung(HashMap<String,Doctor> kho) {   // <- NGHIEP VU: viec cua Service
        return kho.containsKey(code);
    }
}

// ✅ Model chi la du lieu
public class Doctor {
    private String code;
    public String getCode() { return code; }
    @Override
    public String toString() {           // TRA VE chuoi, KHONG in ra
        return String.format("%-10s%-20s", code, name);
    }
}
// Hien thi -> view/DoctorView.java     Nghiep vu -> service/DoctorServices.java`);
p(`<p>💡 <strong>Mẹo tự soát trước khi gọi review:</strong> mở từng file trong <code>model/</code>, bấm
<code>Ctrl</code>+<code>F</code> tìm <code>System.out</code> và <code>Scanner</code>. Tìm thấy một cái là bạn
đang vi phạm đúng cái slide này. Đây là lỗi phổ biến nhất ở bài đầu tiên.</p>`);

// ─── SLIDE 8 ──────────────────────────────────────────────
head('Slide 8 — The three steps of every session', 'Slide 8 — Quá trình thực hành');
img('hd-08.png', 'Slide 8 — Quá trình thực hành, ba bước đánh số: 1. Không sử dụng điện thoại · 2. Save draft · 3. Review.');
nguyenVan(
  '<strong>1. Không sử dụng điện thoại</strong> — "Trong quá trình thực hành"',
  '<strong>2. Save draft</strong>',
  '<strong>3. Review</strong>');
p(`<h4>Nghĩa là gì</h4>
<p>Ba chữ, nhưng đó là <strong>vòng lặp của mỗi buổi học</strong>, và thứ tự không đổi được:</p>
<ol>
  <li><strong>Cất điện thoại</strong> → slide 9 nói rõ hình phạt, và nó nặng bất thường.</li>
  <li><strong>Save draft</strong> → lên hệ thống PTS. <strong>Không save = mất trắng buổi đó</strong>, vì
  máy USB LAB không giữ dữ liệu sau khi tắt.</li>
  <li><strong>Review</strong> → giơ tay gọi thầy. <strong>Chưa review thì LOC vẫn bằng 0</strong>, dù code
  chạy hoàn hảo.</li>
</ol>
<h4>Điều slide không nói ra nhưng bạn phải tự suy</h4>
<p>Mỗi buổi ~1,5 giờ và cả lớp cùng chờ review. Nghĩa là:</p>
<ul>
  <li><strong>Save draft nhiều lần trong buổi</strong>, không đợi đến cuối. Tài liệu B ghi:
  <em>"Sinh viên có thể tiếp tục upload bài mới lên sau mỗi lần sửa lại code"</em> — không giới hạn số lần.
  Nộp lại sau mỗi mốc nhỏ.</li>
  <li><strong>Gọi review sớm hơn bạn nghĩ.</strong> Đợi "hoàn hảo" là đợi hết giờ. Xong một chức năng
  chạy được và test đủ thì gọi.</li>
  <li><strong>Trước khi giơ tay, tự chạy hết happy case và hết message lỗi</strong> — slide 10 ghi
  <em>"test thiếu không review"</em>. Bị trả về vì thiếu test là mất lượt, mà một buổi không có nhiều lượt.</li>
</ul>`);

// ─── SLIDE 9 ──────────────────────────────────────────────
head('Slide 9 — House rules: the heaviest page in the pack', 'Slide 9 — Nội quy');
img('hd-09.png', 'Slide 9 — Nội quy, 4 mục đánh số, mục 1 có bốn gạch đầu dòng về điện thoại và khởi động lại máy.');
nguyenVan(
  '<strong>1.</strong> "Vào lớp thì cất hết điện thoại, balo, đồng hồ thông minh để hết lên phía trên của lớp."',
  '— "Để điện thoại ở người → <strong>Reject hết bài đang làm tạm + đang làm trên server</strong>"',
  '— "Nếu xem điện thoại, đồng hồ thông minh, tài liệu → <strong>nghỉ luôn (Không có lần đầu)</strong>"',
  '— "Muốn tham khảo source thì vác điện thoại ra ngoài hành lang"',
  '— "Phải khởi động lại máy ngay trước khi thày start lớp. Tắt máy trước khi về."',
  '<strong>2.</strong> "Phát hiện học hộ, cheating mức độ nặng → sẽ bàn giao cho khảo thí"',
  '<strong>3.</strong> "Điểm danh duy nhất 1 lần khi bắt đầu giờ học 10 phút."',
  '<strong>4.</strong> "Làm bài số S.P0055 ở buổi đầu tiên theo mẫu (Được mở file Guide ra rõ theo để làm quen kiến trúc, <strong>Không tính LOC</strong>). Sau đó các em tự chọn."',
  '— "Các bài liên quan thuật toán như fibo, sắp xếp,… cũng phải làm MVC, không OOP/MVC → không review"',
  '— "Bài candidate cần implement đầy đủ SOLID trong solid → rất khó, không nên liều"',
  '— "Bài mua bán hoa quả cần thiết kế được ERD cho phép mỗi lần mua nhiều loại quả, có thể kiểm tra số hàng tồn. Đặc biệt implement trong java console sẽ rất phức tạp → không nên chọn"');
p(`<h4>Đọc kỹ mục 1: hình phạt không cân xứng — và đó là chủ ý</h4>
<p>Hai câu đầu mô tả <strong>hai mức phạt khác nhau cho hai hành vi khác nhau</strong>. Nhiều người đọc lướt
và gộp làm một:</p>
<table>
  <tr><th>Hành vi</th><th>Hình phạt</th><th>Mất gì</th></tr>
  <tr><td><strong>Chỉ cần điện thoại ở trong người</strong> (chưa dùng)</td><td>Reject hết bài đang làm tạm <strong>+ bài đang làm trên server</strong></td><td>Có thể mất LOC của <em>nhiều buổi</em> trước đó</td></tr>
  <tr><td><strong>Xem</strong> điện thoại / đồng hồ / tài liệu</td><td>"nghỉ luôn — <strong>không có lần đầu</strong>"</td><td>Cả buổi</td></tr>
</table>
<p>Chú ý cụm <strong>"+ đang làm trên server"</strong>. Đó không phải chỉ bài hôm nay. Bài DRAFT trên PTS là
bài của những buổi trước chưa SUBMIT. Một lần quên điện thoại trong túi có thể xoá sạch công của nhiều tuần.</p>
<p>Và <em>"không có lần đầu"</em> là câu chặn trước lời xin lỗi. Không có cảnh cáo, không có ngoại lệ cho
người mới.</p>
<p>⚠️ <strong>Với bạn — người đang học lần thứ 5 — đây là rủi ro lớn nhất của cả kỳ.</strong> Không phải
vì code khó, mà vì một sơ suất 3 giây có thể xoá công của nhiều tuần. Biến nó thành phản xạ:
<strong>vừa bước vào cửa lớp là điện thoại + đồng hồ lên bàn phía trên, trước cả khi ngồi xuống.</strong></p>

<h4>Câu bị bỏ qua nhiều nhất: "khởi động lại máy ngay trước khi thầy start lớp"</h4>
<p>Nghe như thủ tục vặt, nhưng ghép với tài liệu C thì nó có nghĩa: máy phải ở trạng thái <strong>đã boot
vào USB LAB Ubuntu</strong>, sạch, khi buổi học bắt đầu. Máy đang chạy Windows lúc thầy bắt đầu là
<em>"tính là gian lận"</em> theo tài liệu C — mà hình phạt ở đó là "False môn hoặc nặng hơn".</p>

<h4>Mục 3: điểm danh MỘT lần, trong 10 phút đầu</h4>
<p><em>"Điểm danh duy nhất 1 lần khi bắt đầu giờ học 10 phút."</em> Đến phút thứ 11 = vắng cả buổi, kể cả
bạn ngồi học đủ 80 phút còn lại. Ghép với luật <strong>≥ 80% tham gia</strong> ở slide 2: bạn chỉ có
<strong>4 lần vắng</strong> cho cả kỳ. Đi muộn 4 lần là hết quota, và trượt vì điểm danh dù đủ 750 LOC.</p>

<h4>Mục 4: bài đầu tiên KHÔNG tính LOC — và tại sao đó là tin tốt</h4>
<p><code>J1.S.P0055 — Doctor Management</code>, buổi đầu, <strong>được mở file Guide ra chép theo</strong>,
và <strong>không tính LOC</strong>.</p>
<p>Nghe như mất một buổi. Thực ra nó là <strong>buổi học có giá trị cao nhất cả kỳ</strong>: bạn được phép
nhìn bài mẫu, và cái bạn học được ở đó — kiến trúc 8 package — sẽ dùng lại cho <strong>19 buổi còn
lại</strong>. Ai chép cho xong sẽ khổ suốt phần sau; ai hiểu được nó thì mọi bài sau chỉ là đổi tên
<code>Doctor</code> thành cái khác.</p>
<p>💡 Nên: về nhà <strong>gõ lại P0055 từ đầu, không nhìn mẫu</strong>. Không phải để nộp — mà để tay quen
kiến trúc. Module <strong>"Bộ khung P0055"</strong> có sẵn 10 file và ba bài luyện đúng cho việc này.</p>

<h4>Ba lời cảnh báo chọn bài — đây là bản đồ mìn</h4>
<ol>
  <li><strong>"Bài thuật toán cũng phải làm MVC"</strong> — Fibonacci, sắp xếp, số nguyên tố… vẫn phải đủ
  8 package. Chúng <em>ít LOC</em> nhưng <em>không hề nhanh hơn</em>, vì phần khung vẫn phải viết đủ.
  Đừng chọn chúng vì tưởng dễ.</li>
  <li><strong>"Bài candidate → rất khó, không nên liều"</strong> — thầy nói thẳng là <em>không nên</em>.
  Đừng chọn. Đây là lời khuyên hiếm hoi được ghi thành văn bản.</li>
  <li><strong>"Bài mua bán hoa quả → không nên chọn"</strong> — cần ERD, mỗi lần mua nhiều loại quả, kiểm
  tra tồn kho; trên console rất phức tạp. Bỏ.</li>
</ol>
<p>Ba câu này thu hẹp 54 bài xuống còn khoảng 40 bài an toàn. Danh sách 9 bài đã chọn sẵn cho bạn (đủ
750 LOC, dễ → khó) nằm ở module <strong>"Luật chơi & lộ trình"</strong>.</p>`);

// ─── SLIDE 10 ─────────────────────────────────────────────
head('Slide 10 — The review question list: memorise this page', 'Slide 10 — Nội quy (tiếp)');
img('hd-10.png', 'Slide 10 — Nội quy (tiếp): mục 6 cấu trúc MVC bắt buộc, mục 7 danh sách những gì phải trả lời được khi review.');
nguyenVan(
  '<strong>6.</strong> "Source code bắt buộc theo cấu trúc (MVC), không có cấu trúc → không review"',
  '<strong>7.</strong> "Khi review, cần đảm bảo và trả lời được:"',
  '— "Đúng coding convention, không đảm bảo convention sẽ không review tiếp. (Ưu tiên <strong>Alt + Shift + F</strong>)"',
  '— "Có đủ comment source ít nhất cho function và block/rẽ nhánh. Không có comment → không review"',
  '— "Phải debug được khi thày yêu cầu, không debug được sẽ không review tiếp"',
  '— "Phải thực hiện test tất cả các happy case cũng như hiển thị đủ các message validation, test thiếu không review"',
  '— "Làm đúng OOP: Tạo được class cho từng đối tượng độc lập, đủ attribute và methods, đặc biệt phải đúng access modifier, <strong>dùng được các tính chất như kế thừa, đa hình sẽ được cộng LOC. Implement và hiểu SOLID được cộng LOC</strong>"',
  '— "Các access modifier như: public, private, protected, default – khái niệm, phạm vi, và chỉ rõ tại sao trong source chúng nó cần dùng."',
  '— "Các kiểu dữ liệu trả về của method: int, float, string, void… tại sao trả về void, tại sao cần trả về string,…"',
  '— "Từ khóa static: tại sao dùng static? Bỏ đi thì sao? Nếu ko dùng thì sửa source thế nào cho chạy…"',
  '— "4 concepts của oop: liệt kê 4 tính chất ra, phải chỉ được src của nó có tính chất nào của OOP"');
p(`<h4>Đây là đề thi, in ra và dán lên tường</h4>
<p>Trang này không phải nội quy — nó là <strong>danh sách câu hỏi vấn đáp, viết sẵn</strong>. Thầy không
giấu đề. Đọc kỹ sẽ thấy nó chia làm hai nửa rất khác nhau:</p>

<h4>Nửa 1 — bốn cái CHẶN CỬA (không đạt là không được review tiếp)</h4>
<table>
  <tr><th>Điều kiện</th><th>Cách tự kiểm trong 30 giây</th></tr>
  <tr><td>Đúng coding convention</td><td>Bấm <strong><code>Alt</code>+<code>Shift</code>+<code>F</code></strong> trong NetBeans. Thầy ghi rõ "ưu tiên" phím này ⇒ thầy nhìn ra ngay thụt lề có chuẩn hay không.</td></tr>
  <tr><td>Đủ comment cho <em>function</em> và <em>block/rẽ nhánh</em></td><td>Mỗi <code>public</code> method một dòng <code>//</code> phía trên. Mỗi <code>if</code>/<code>for</code>/<code>while</code>/<code>switch</code> một dòng <code>//</code>.</td></tr>
  <tr><td>Debug được khi thầy yêu cầu</td><td>Đặt breakpoint <code>Ctrl</code>+<code>F8</code>, chạy <code>Ctrl</code>+<code>F5</code>, bước qua <code>F8</code>, bước vào <code>F7</code>. <strong>Tập ở nhà</strong> — không phải lúc thầy đứng sau lưng.</td></tr>
  <tr><td>Test đủ happy case + đủ message lỗi</td><td>Viết ra giấy danh sách case, gạch từng dòng khi đã chạy. Bộ khung P0055 có <strong>9 message lỗi khác nhau</strong> — phải hiện được cả 9.</td></tr>
</table>
<p><strong>Bốn cái này không cho điểm.</strong> Chúng chỉ cho phép bạn bước vào cuộc review. Thiếu một là
thầy quay đi và bạn mất lượt của buổi hôm đó.</p>

<h4>Nửa 2 — bốn câu hỏi CHO ĐIỂM (và hai chỗ "được cộng LOC")</h4>
<p>Đọc lại dòng dài nhất — đây là dòng duy nhất trong cả bộ tài liệu nói về việc <em>cộng thêm</em>:</p>
<blockquote><em>"dùng được các tính chất như <strong>kế thừa, đa hình</strong> sẽ được cộng LOC.
<strong>Implement và hiểu SOLID</strong> được cộng LOC"</em></blockquote>
<p>Nghĩa là 750 LOC không nhất thiết phải cày đủ bằng số dòng thô. Thêm một cặp
<code>Person</code>/<code>Doctor</code> có kế thừa và đa hình, thêm một interface cho Repository (DIP) —
vừa được cộng, vừa trả lời được câu hỏi. <strong>Nhưng chỉ khi bạn hiểu</strong>: thầy ghi rõ
<em>"và hiểu"</em>.</p>

<h4>Bốn câu hỏi, theo đúng thứ tự thầy viết</h4>
<ol>
  <li><strong>Access modifier</strong> — "khái niệm, phạm vi, và chỉ rõ <em>tại sao trong source chúng nó
  cần dùng</em>". Ba phần: định nghĩa → bảng phạm vi → <strong>lý do ở dòng cụ thể của bạn</strong>.</li>
  <li><strong>Kiểu trả về</strong> — "tại sao trả về void, tại sao cần trả về string". Câu này hỏi bạn có
  <em>chọn</em> hay chỉ <em>gõ bừa</em>.</li>
  <li><strong>Static</strong> — ba câu liền: "tại sao dùng?" → "bỏ đi thì sao?" → "không dùng thì sửa source
  thế nào cho chạy?". Câu thứ ba là câu bẫy: nó đòi bạn <strong>sửa code tại chỗ</strong>, không phải nói lý
  thuyết.</li>
  <li><strong>4 concepts OOP</strong> — "liệt kê ra, <em>phải chỉ được src</em>". Chữ "chỉ được src" nghĩa là
  ngón tay đặt lên màn hình.</li>
</ol>
<p>Đáp án mẫu đầy đủ cho cả 12 câu (bốn câu này + tám câu suy ra từ bộ slide) nằm ở module
<strong>"OOP · SOLID · Design Pattern"</strong>, bài cuối.</p>`);

// ══════════════════════════════════════════════════════════════
part(2,
  'Document B — "Hướng dẫn Sinh Viên sử dụng LAB": PTS, DRAFT and SUBMIT',
  'Tài liệu B — "Hướng dẫn Sinh Viên sử dụng LAB": PTS, DRAFT và SUBMIT',
  'Two pages, and one of them can lose you a whole session',
  'Hai trang, và một trong hai có thể làm bạn mất trắng một buổi');

p(`<p>Tài liệu ngắn nhất trong bốn tài liệu — đúng hai trang. Nhưng nó là <strong>cách bạn nộp bài</strong>,
và nộp sai thì code hay đến mấy cũng bằng không. Đọc kỹ phần <strong>IV. Lưu bài</strong>.</p>`);

head('Page 1 — Table of contents (and what it tells you)', 'Trang 1 — Mục lục (và nó nói lên điều gì)');
img('lab-1.png', 'Trang 1 — Mục lục: I. Lưu ý chung · II. Đăng nhập · III. Chọn bài · IV. Lưu bài (1. DRAFT, 2. SUBMIT).');
nguyenVan(
  '<strong>Mục lục:</strong> I. Lưu ý chung · II. Đăng nhập · III. Chọn bài · IV. Lưu bài → 1. DRAFT · 2. SUBMIT');
p(`<h4>Mục lục cũng là một quy trình</h4>
<p>Bốn mục xếp theo đúng thứ tự bạn sẽ làm trong buổi học: <strong>đăng nhập → chọn bài → lưu DRAFT nhiều
lần → SUBMIT một lần duy nhất</strong>. Chú ý mục IV được tách làm hai mục con — vì DRAFT và SUBMIT là hai
thao tác <em>hoàn toàn khác nhau</em> và nhầm lẫn giữa chúng là lỗi không sửa được.</p>`);

head('Page 2 — The whole document, and three rules that bite', 'Trang 2 — Toàn bộ nội dung, và ba luật cắn thật');
img('lab-2.png', 'Trang 2 — Toàn bộ nội dung: đăng nhập máy với "FU\\", đăng nhập PTS không có "FU\\", chọn tối đa 5 bài, DRAFT và SUBMIT.');
nguyenVan(
  '<strong>I. Lưu ý chung:</strong> "Việc hướng dẫn về cách làm và các qui định sẽ được tiến hành ở buổi đầu tiên (<strong>1 lần duy nhất</strong>) nên yêu cầu sv không được vắng mặt. Những sv vắng mặt vẫn cần tuân theo những yêu cầu đã được thông báo… (<strong>không nhắc lại</strong>)."',
  '<strong>II. Đăng nhập:</strong> "Đăng nhập vào máy sử dụng tài khoản wifi hoặc thêm Domain <strong>“FU\\”</strong> trước tên tài khoản"',
  '— "Sau khi đăng nhập thành công… bấm vào Shortcut <strong>“PTS”</strong> ở desktop… sau đó sv sẽ đăng nhập vào sử dụng tài khoản wifi (<strong>lần này không điền thêm “FU\\”</strong> ở phía trước tên đăng nhập nữa)"',
  '<strong>III. Chọn bài:</strong> "Sinh Viên chỉ chọn những bài dự định sẽ làm (<strong>không quá 5 bài</strong> – sau khi hoàn thành xong mới chọn tiếp bài mới)"',
  '<strong>IV. Lưu bài:</strong> "SV cần <strong>đăng nhập lại</strong> bằng cách bấm vào Shortcut PTS <strong>trước khi tiến hành lưu bài</strong> để đảm bảo bài có thể được lưu thành công."',
  '<strong>1. DRAFT:</strong> "Khi sinh viên đang làm dở lưu lại để làm bài cho lần làm kế tiếp" · "<strong>Nếu không lưu sẽ mất bài và phải làm lại từ đầu</strong>" · "Sinh viên có thể tiếp tục upload bài mới lên sau mỗi lần sửa lại code" · "<strong>Chỉ upload lên file zip</strong>, file dung lượng <strong>không quá 10MB</strong>"',
  '<strong>2. SUBMIT:</strong> "<strong>Chỉ SUBMIT khi GV đánh giá bài làm đạt yêu cầu lấy điểm</strong>" · "<strong>Bài đã SUBMIT thì sv không thể sửa đổi và upload lại được nữa</strong>"');
p(`<h4>Luật 1 — hai kiểu đăng nhập khác nhau, đừng nhầm</h4>
<p>Đây là chỗ mất 10 phút đầu buổi của rất nhiều người:</p>
<table>
  <tr><th>Đăng nhập vào</th><th>Tên đăng nhập</th></tr>
  <tr><td><strong>Máy tính</strong> (Windows)</td><td><code>FU\\tenTaiKhoan</code> — <strong>CÓ</strong> tiền tố <code>FU\\</code></td></tr>
  <tr><td><strong>PTS</strong> (shortcut trên desktop)</td><td><code>tenTaiKhoan</code> — <strong>KHÔNG</strong> có <code>FU\\</code></td></tr>
</table>
<p>Cùng một tài khoản wifi, nhưng hai chỗ điền khác nhau. Điền nhầm <code>FU\\</code> vào PTS là không vào
được, và bạn sẽ tưởng tài khoản hỏng.</p>

<h4>Luật 2 — "tối đa 5 bài", và đó là một luật chiến thuật</h4>
<p><em>"không quá 5 bài – sau khi hoàn thành xong mới chọn tiếp bài mới"</em>. Nghĩa là bạn <strong>không
thể</strong> chọn hết cả 9 bài trong lộ trình ngay từ buổi đầu. Bạn giữ một hàng đợi 5 chỗ, và chỉ giải
phóng được chỗ khi <em>hoàn thành</em> một bài.</p>
<p>Hệ quả thực tế: <strong>chọn bài theo cụm 3–4 bài cùng dạng</strong> (đều là "quản lý danh sách") để làm
liên tiếp, tay không phải đổi kiểu tư duy. Và <strong>đừng chọn sẵn bài khó</strong> để giữ chỗ — nó chiếm
một trong năm ô cho tới khi bạn làm xong.</p>

<h4>Luật 3 — DRAFT và SUBMIT: một cái sửa được, một cái KHÔNG</h4>
<table>
  <tr><th></th><th>DRAFT</th><th>SUBMIT</th></tr>
  <tr><td>Khi nào</td><td>Bất cứ lúc nào, nhiều lần</td><td><strong>Chỉ sau khi thầy nói đạt</strong></td></tr>
  <tr><td>Sửa lại được?</td><td>✅ Upload đè bao nhiêu lần cũng được</td><td>❌ <strong>Không bao giờ nữa</strong></td></tr>
  <tr><td>Nếu bỏ qua</td><td><strong>Mất bài, làm lại từ đầu</strong></td><td>LOC không được tính</td></tr>
</table>
<p>⚠️ <strong>Hai sai lầm ngược nhau, cả hai đều đắt:</strong></p>
<ul>
  <li><strong>Quên DRAFT</strong> → hết buổi, tắt máy, mất sạch. Máy USB LAB không giữ dữ liệu. Cái này
  <em>tài liệu ghi thành chữ đậm</em>: "Nếu không lưu sẽ mất bài và phải làm lại từ đầu".</li>
  <li><strong>SUBMIT sớm</strong> → thầy chưa duyệt mà bạn đã SUBMIT, sau đó thầy yêu cầu sửa một chỗ →
  <em>không sửa được nữa</em>. Bài coi như hỏng.</li>
</ul>
<p><strong>Luật cho bản thân: DRAFT sau mỗi 15 phút. SUBMIT chỉ khi thầy nói bằng miệng là "được rồi".</strong></p>

<h4>Luật 4 — cái bẫy nhỏ ở đầu mục IV</h4>
<p><em>"SV cần <strong>đăng nhập lại</strong> bằng cách bấm vào Shortcut PTS <strong>trước khi</strong> tiến
hành lưu bài"</em>. Phiên đăng nhập PTS hết hạn trong lúc bạn ngồi code. Nếu upload khi phiên đã hết hạn,
thao tác có thể <em>trông như thành công</em> mà không lưu được gì.</p>
<p><strong>Thói quen đúng:</strong> bấm PTS → đăng nhập lại → rồi mới upload. Mỗi lần. Và sau khi upload,
<strong>nhìn lại danh sách bài trên PTS để xác nhận file đã lên</strong> — đừng tin vào việc "bấm xong rồi".</p>

<h4>Luật 5 — định dạng file</h4>
<p><strong>Chỉ <code>.zip</code>, tối đa 10MB.</strong> Project NetBeans nén lại thường ~50–200KB nên 10MB
là rất rộng — <em>trừ khi</em> bạn lỡ nén cả thư mục <code>build/</code> và <code>dist/</code>. Nén thư mục
project sạch thôi.</p>
<p>⚠️ Và nếu bạn nén trên máy Mac ở nhà rồi mang file sang: macOS chèn thêm các file rác
<code>__MACOSX/</code> và <code>._TenFile</code> vào zip. Nó không làm hỏng bài nhưng làm thư mục trông
bẩn khi thầy mở ra. Nén bằng máy Windows/Ubuntu, hoặc kiểm tra lại nội dung file zip trước khi nộp.</p>`);

// ══════════════════════════════════════════════════════════════
part(3,
  'Document C — "Hướng dẫn chuẩn bị thực hành LAB trên USB LAB", 10 pages',
  'Tài liệu C — "Hướng dẫn chuẩn bị thực hành LAB sử dụng trên USB LAB", 10 trang',
  'Not about Java at all — about whether you can sit down and work',
  'Không liên quan gì tới Java — nó quyết định bạn có ngồi làm bài được không');

p(`<p>Mười trang, không có một dòng code nào. Nhưng <strong>nếu máy bạn không boot được vào USB LAB thì
bạn không làm được bài, và mỗi buổi hỏng là 40 LOC mất trắng</strong>. Đây là tài liệu phải xử lý
<strong>trước</strong> buổi học, ở nhà, không phải tại lớp.</p>`);

head('Page 1 — Contents: five sections, seven setup steps', 'Trang 1 — Mục lục: năm phần, bảy bước cài đặt');
img('usb-01.png', 'Trang 1 — Mục lục 5 phần: I. Nội quy · II. Yêu cầu chuẩn bị · III. Chuẩn bị phần mềm (7 bước) · IV. Gửi mail đăng ký MAC · V. Xử lý sự cố.');
nguyenVan(
  'I. Nội quy cần chấp hành · II. Yêu cầu sinh viên chuẩn bị · III. Chuẩn bị phần mềm (1. Khởi động vào BIOS → 7. Đăng ký máy) · IV. Gửi mail (chỉ khi cần đăng ký lại địa chỉ MAC mới) theo đúng format · V. Xử lý sự cố');
p(`<p><strong>Phần V "Xử lý sự cố" nằm ở cuối, nhưng nên đọc trước.</strong> Nó liệt kê đúng những thứ sẽ
hỏng, kèm cách chữa. Đọc trước ở nhà = tại lớp bạn tự chữa trong 2 phút thay vì ngồi chờ.</p>`);

head('Page 2 — House rules and the laptop you must bring', 'Trang 2 — Nội quy phòng LAB và yêu cầu về laptop');
img('usb-02.png', 'Trang 2 — Nội quy phòng LAB USB (hai trạng thái máy bắt buộc) và Yêu cầu sinh viên chuẩn bị (laptop, cổng USB-A, tương thích Ubuntu).');
nguyenVan(
  '"Ngoại trừ buổi đầu setup máy, từ những buổi sau khi SV bước vào phòng LAB USB thì laptop <strong>bắt buộc phải ở 1 trong 2 trạng thái</strong>: 1: Máy đã tắt hoàn toàn · 2: Máy đã mở bắt buộc phải BOOT vào USB của LAB"',
  '"Kể cả khi đi hết giờ học hoặc không cần làm bài, chỉ cần còn ở trong phòng LAB USB thì đều phải tuân thủ yêu cầu trên nếu không sẽ <strong>tính là gian lận</strong> (sẽ tính là <strong>False môn</strong> hoặc có hình thức xử lý nặng hơn)"',
  '"Nếu SV có nhu cầu boot vào Window <strong>cần ra khỏi phòng</strong>."',
  '"Sinh viên <strong>không mang USB LAB ra khỏi phòng học</strong> với bất kỳ lý do gì mà cần gửi lại cho gv trước khi rời khỏi phòng."',
  '"Bắt buộc <strong>Shutdown máy theo đúng thủ tục</strong>, <strong>không rút USB trước khi</strong> thực hiện thao tác Shutdown."',
  '<strong>Yêu cầu chuẩn bị:</strong> "Tài khoản wifi khả dụng" · "Laptop Window 10 trở lên (<strong>không chạy qua máy ảo</strong>)" · "<strong>Có ít nhất 1 cổng USB Type-A</strong>" · "<strong>Không sử dụng máy Macbook, chromebook</strong>…" · "Độ phân giải HD trở lên" · "Tương thích với Ubuntu (đặc biệt phải <strong>nhận và dùng được wifi</strong>)"');
p(`<h4>Hai trạng thái, không có trạng thái thứ ba</h4>
<p>Trong phòng LAB USB, laptop của bạn chỉ được phép <strong>tắt hẳn</strong> hoặc <strong>đang chạy USB
LAB Ubuntu</strong>. Không có "để Windows chờ tí". Và luật này áp dụng <em>ngay cả khi bạn không làm bài</em>
— chỉ cần còn ngồi trong phòng.</p>
<p>Hình phạt ghi rõ: <strong>"tính là gian lận → False môn"</strong>. Đây là mức nặng nhất trong cả bốn tài
liệu — nặng hơn cả hình phạt điện thoại ở slide 9. Muốn dùng Windows thì <strong>ra khỏi phòng</strong>.</p>

<h4>Bốn điều kiện phần cứng — kiểm TRƯỚC, ở nhà</h4>
<table>
  <tr><th>Yêu cầu</th><th>Kiểm thế nào</th></tr>
  <tr><td>Windows 10+, <strong>không phải máy ảo</strong></td><td>Máy thật. Parallels/VMware/VirtualBox không boot USB được.</td></tr>
  <tr><td><strong>Cổng USB Type-A</strong></td><td>Cổng chữ nhật to. Laptop mới chỉ có USB-C là <strong>không dùng được</strong> — mà tài liệu không nói gì về việc dùng hub chuyển.</td></tr>
  <tr><td><strong>Không Macbook / Chromebook</strong></td><td>Loại thẳng. Không có ngoại lệ.</td></tr>
  <tr><td>Tương thích Ubuntu, <strong>đặc biệt là wifi</strong></td><td>Đây là cái hay hỏng nhất — nhiều card wifi Intel/Realtek đời mới không có driver sẵn trong Ubuntu.</td></tr>
</table>
<p>Tài liệu nói thẳng ở cuối trang: <em>"cần tiến hành test xem máy có boot được vào USB Ubuntu không, cũng
như sau khi boot vào có dùng được wifi bình thường. (<strong>Sinh viên phải chuẩn bị đảm bảo 2 điều trên
trước khi vào lớp thực hành</strong>)"</em>.</p>
<p>⚠️ <strong>Việc số 1 của bạn ngay bây giờ:</strong> mượn USB LAB (hoặc dùng buổi setup đầu tiên) và
<strong>kiểm hai điều đó</strong>. Nếu wifi không lên, phương án dự phòng đã có sẵn trong tài liệu:
<strong>mượn card wifi ở phòng AL-L300</strong>. Biết trước thì mất 10 phút; biết vào đúng buổi học thì mất
cả buổi.</p>`);

head('Page 3 — Step 1: get into BIOS; Step 2: turn Secure Boot off', 'Trang 3 — Bước 1: vào BIOS · Bước 2: tắt Secure Boot');
img('usb-03.png', 'Trang 3 — Bước 1 "Khởi động vào BIOS" với bảng phím theo hãng máy, và ảnh màn hình BIOS Aptio (American Megatrends). Bước 2 bắt đầu: tắt Secure Boot và TPM.');
nguyenVan(
  '"Nếu sinh viên không thể tự thực hiện được sẽ chủ động qua <strong>IT phòng 300L</strong> để được hỗ trợ (<strong>sau từ 5-10 phút</strong> không thể tự làm được thì cần qua phòng IT)"',
  '"Mở nguồn máy tính, ấn phím tùy vào các dòng máy để boot vào Menu boot:"',
  '● <strong>F12</strong>: Acer, Dell, Lenovo, Toshiba, Fujitsu · ● <strong>F9 hoặc Esc</strong>: HP, Compaq · ● <strong>F8 hoặc Esc</strong>: Asus · ● <strong>F11</strong>: Sony Vaio, MSI',
  '"<strong>2. Tắt chế độ Secure Boot và TPM, Fast Boot và Window To Go</strong> — Tìm tới mục Secure Boot. Nếu ở trạng thái Enable, chọn thành Disable. Tương tự cũng sẽ tắt TPM, Fast Boot nếu vẫn chưa boot được vào USB."');
p(`<h4>Bảng phím — tìm hãng máy của bạn ngay bây giờ</h4>
<table>
  <tr><th>Phím</th><th>Hãng</th></tr>
  <tr><td><code>F12</code></td><td>Acer · Dell · Lenovo · Toshiba · Fujitsu</td></tr>
  <tr><td><code>F9</code> hoặc <code>Esc</code></td><td>HP · Compaq</td></tr>
  <tr><td><code>F8</code> hoặc <code>Esc</code></td><td>Asus</td></tr>
  <tr><td><code>F11</code></td><td>Sony Vaio · MSI</td></tr>
</table>
<p><strong>Bấm liên tục ngay khi vừa nhấn nút nguồn</strong>, không đợi thấy logo. Cửa sổ để bấm chỉ khoảng
2 giây. Nếu vào thẳng Windows thì bạn bấm muộn — tắt máy làm lại.</p>

<h4>Bốn thứ phải tắt, và tắt theo thứ tự</h4>
<ol>
  <li><strong>Secure Boot</strong> → <code>Disabled</code>. Đây là thứ chặn boot USB. Tắt cái này thường là đủ.</li>
  <li><strong>TPM</strong> → nếu vẫn chưa boot được.</li>
  <li><strong>Fast Boot</strong> → nếu vẫn chưa được. (Fast Boot bỏ qua bước quét USB lúc khởi động.)</li>
  <li><strong>Windows To Go</strong> → phương án cuối, trang 4 nói rõ.</li>
</ol>
<p>💡 <strong>Mẹo:</strong> chụp ảnh màn hình BIOS <em>trước khi đổi</em> bằng điện thoại. Nếu sau này máy
có vấn đề, bạn khôi phục lại đúng như cũ được.</p>

<h4>Luật 5–10 phút — dùng nó, đừng cố</h4>
<p>Tài liệu ghi rõ: tự làm quá <strong>5–10 phút</strong> không được thì qua <strong>phòng IT 300L</strong>.
Đó không phải lời khuyên lịch sự, đó là để bạn khỏi ngồi mò cả buổi. Và mục đích ghi trong tài liệu là để
bạn <em>"tự biết cách boot từ USB bất kỳ"</em> — tức là học một lần, dùng cả kỳ.</p>`);

head('Page 4 — Steps 2→5: save, and pick the boot device', 'Trang 4 — Bước 2–5: lưu thiết lập và chọn thiết bị boot');
img('usb-04.png', 'Trang 4 — Bước 2 (tiếp): tắt Windows To Go · Bước 3: F10 lưu · Bước 4: chọn boot device tên "Ubuntu" · Bước 5: màn hình sau khi boot, mật khẩu 12345678.');
nguyenVan(
  '"Nếu đã tắt nhưng phần trên mà vẫn không được thì thực hiện nốt việc <strong>tắt Window To Go</strong>"',
  '"<strong>3. Lưu lại các thiết lập</strong> — Nhấn phím <strong>F10</strong> chọn Yes để lưu lại các thiết lập chỉnh sửa bên trên."',
  '"<strong>4. Lựa chọn boot bằng USB</strong> — Tùy vào mỗi máy sẽ có sự sai khác về tên thiết bị và tên lựa chọn. <strong>Thường là chọn boot vào thiết bị có tên là Ubuntu</strong>"',
  '"<strong>5. Sau khi boot vào thành công</strong> — Khi boot vào thành công màn hình sẽ có dạng như sau. <strong>Nếu máy tự lock sẽ đăng nhập lại với mật khẩu là 12345678</strong>"');
p(`<h4>Ba thứ phải nhớ ở trang này</h4>
<ul>
  <li><strong><code>F10</code> = Save and Exit.</strong> Đổi BIOS mà thoát bằng <code>Esc</code> là mất hết
  thay đổi, và bạn sẽ tưởng "tắt Secure Boot rồi mà vẫn không boot được".</li>
  <li><strong>Tên thiết bị thường là "Ubuntu"</strong>, nhưng có máy hiện tên hãng USB
  (<em>SanDisk</em>, <em>Kingston</em>…) hoặc <em>"UEFI: …"</em>. Chọn cái <strong>không phải</strong> ổ
  cứng Windows.</li>
  <li><strong>Mật khẩu màn hình khoá Ubuntu: <code>12345678</code>.</strong> Ghi lại. Máy tự khoá sau vài
  phút không dùng, và lúc đó không ai nhắc bạn mật khẩu.</li>
</ul>`);

head('Page 5 — Step 6: the wifi, and the rule that can wipe the machine', 'Trang 5 — Bước 6: wifi, và luật có thể xoá sạch máy');
img('usb-05.png', 'Trang 5 — Màn hình Ubuntu sau khi boot (chỉ có icon PTS) và bước 6: tự động kết nối mạng FPTU_Laboratory, kèm cảnh báo tuyệt đối không vào mạng khác.');
nguyenVan(
  '"Sau khi boot vào thành công chúng ta sẽ chờ để hệ thống <strong>tự động kết nối</strong> với mạng wifi đã được chỉ định. <strong>Không thể thay đổi hay đăng nhập vào mạng wifi khác được.</strong>"',
  '"Nếu máy không tự kết nối vào bất kỳ mạng nào thì bấm chọn mạng <strong>“FPTU_Laboratory”</strong> và <strong>không làm thêm bất kỳ thao tác nào khác</strong>."',
  '"Nếu máy Chưa tích vào checkbox Enable Network hoặc Enable Wifi thì tích vào các checkbox đó"',
  '"Trong trường hợp máy đã boot vào được và không nhìn thấy có mạng Wifi mặc dù đã Enable Network, hãy boot vào BIOS <strong>tắt Secure Boot và TPM</strong>"',
  '"…vẫn không nhận mạng Wifi thì thử phương án <strong>sử dụng card wifi ở phòng AL-L300</strong>."',
  '"Nếu thấy wifi nhưng không tự kết nối vào được “FPTU_Laboratory” (hoặc cứ kết nối vào xong lại bị đẩy ra ngay): Tắt máy rút USB LAB → Boot vào Windows → <strong>Forget mạng “DH-FPT” rồi đăng nhập lại</strong> → Tắt máy → Cắm và Boot lại vào USB LAB"',
  '"<strong>Tuyệt đối không được vào bất kỳ mạng nào khác, nếu không máy đấy sẽ bị khóa không thể thực hành được nữa đồng thời mọi dữ liệu trên máy sẽ bị hủy</strong>"');
p(`<h4>Câu cuối trang là câu nặng nhất cả tài liệu</h4>
<blockquote><em>"Tuyệt đối không được vào bất kỳ mạng nào khác, nếu không máy đấy sẽ bị <strong>khóa không
thể thực hành được nữa</strong> đồng thời <strong>mọi dữ liệu trên máy sẽ bị hủy</strong>."</em></blockquote>
<p>Không phải cảnh cáo, không phải trừ điểm — <strong>máy bị khoá và dữ liệu bị huỷ</strong>. Nghĩa là:
đừng bấm vào biểu tượng wifi để "xem thử có mạng nào", đừng thử kết nối wifi điện thoại. Chỉ
<strong>FPTU_Laboratory</strong>, và tốt nhất là <strong>để nó tự kết nối, không đụng vào gì cả</strong>.</p>

<h4>Cách chữa "kết nối xong bị đẩy ra ngay" — mẹo phản trực giác, học thuộc</h4>
<p>Lỗi này rất hay gặp và cách chữa <em>không</em> nằm trong Ubuntu — nó nằm trong <strong>Windows</strong>:</p>
<ol>
  <li>Tắt máy, rút USB LAB</li>
  <li>Boot vào <strong>Windows</strong></li>
  <li><strong>Forget mạng "DH-FPT"</strong>, rồi đăng nhập lại vào nó</li>
  <li>Tắt máy</li>
  <li>Cắm USB LAB, boot lại</li>
</ol>
<p>Lý do: máy còn giữ phiên xác thực cũ với hệ thống wifi của trường, và phiên đó xung đột. "Forget" xoá nó
đi. Không ai đoán ra được cách này nếu chưa đọc tài liệu — <strong>đây chính là lý do phải đọc trang 5
trước khi vào lớp</strong>.</p>`);

head('Page 6 — Step 7: register the machine (first time only)', 'Trang 6 — Bước 7: đăng ký máy (chỉ lần đầu)');
img('usb-06.png', 'Trang 6 — Bước 7 "Đăng ký máy (1st step)": bấm PTS, đăng nhập ngay khi popup hiện, giữ nguyên màn hình thành công cho GV kiểm tra.');
nguyenVan(
  '"<strong>Sinh viên đã từng đăng ký máy LAB USB và không thay đổi máy sẽ không cần làm bước này</strong>"',
  '"Trong trường hợp máy chưa từng dùng để học LAB USB: bấm vào biểu tượng PTS ở desktop và <strong>đăng nhập bằng tài khoản Wifi ngay sau khi Popup hiện lên (Nếu không thực hiện ngay sẽ không đăng nhập được)</strong>, sau khi nhận được thông báo MAC đã được đăng ký, <strong>giữ nguyên màn hình đăng ký thành công để GV kiểm tra trực tiếp và xác nhận</strong>"',
  '"Trong trường hợp máy đã tự động kết nối vào Wifi nhưng sau đấy lại tự ngắt: 01. Tắt máy, rút USB LAB · 02. Vào lại Windows và đăng nhập lại vào mạng DH-FPT, sau đó <strong>đăng xuất khỏi mạng này</strong> · 03. Tắt máy, cắm USB LAB và boot vào lại"',
  '"Trong trường hợp đã từng đăng ký máy nhưng <strong>hiện tại đã đổi máy</strong> (hoặc máy đã thay đổi phần cứng): gv xác nhận… trước khi sv gửi email đăng ký lại theo format (<strong>có CC và được mail chấp nhận của gv</strong>)"',
  '"SV bấm vào biểu tượng mạng chọn <strong>“Connection information”</strong>"');
p(`<h4>Hai chữ "ngay" là quan trọng nhất trang này</h4>
<p><em>"đăng nhập bằng tài khoản Wifi <strong>ngay sau khi Popup hiện lên</strong> (Nếu không thực hiện ngay
sẽ không đăng nhập được)"</em>. Popup có thời hạn. Chần chừ vài giây là phải làm lại từ đầu.</p>
<p><strong>Chuẩn bị trước:</strong> gõ sẵn tài khoản/mật khẩu wifi vào đầu, hoặc để trước mặt. Bấm PTS →
popup hiện → gõ ngay.</p>

<h4>"Giữ nguyên màn hình thành công" — đừng bấm tắt</h4>
<p>Màn hình báo MAC đã đăng ký là <strong>bằng chứng để thầy xác nhận</strong>. Bấm tắt là phải làm lại và
chờ thầy quay lại lần nữa. Cứ để nguyên, giơ tay gọi thầy.</p>

<h4>Ai phải làm bước này?</h4>
<table>
  <tr><th>Tình huống</th><th>Phải làm gì</th></tr>
  <tr><td>Máy chưa từng học LAB USB</td><td>Làm bước 7 — đăng ký tại lớp</td></tr>
  <tr><td>Máy đã đăng ký, không đổi gì</td><td><strong>Bỏ qua</strong>, không cần làm</td></tr>
  <tr><td><strong>Đổi máy</strong>, hoặc <strong>đổi phần cứng</strong> (thay card wifi, thay main)</td><td>Phải <strong>gửi email đăng ký MAC mới</strong> — xem trang 8–9</td></tr>
</table>
<p>⚠️ Chú ý vế "<strong>hoặc máy đã thay đổi phần cứng</strong>". Thay card wifi = đổi địa chỉ MAC = phải
đăng ký lại, dù vẫn là cái laptop cũ.</p>`);

head('Page 7 — Where the MAC address is', 'Trang 7 — Địa chỉ MAC nằm ở đâu');
img('usb-07.png', 'Trang 7 — Ảnh chụp cửa sổ "Connection Information" của Ubuntu, mục "Hardware Address" được khoanh.');
nguyenVan('"MAC của máy nằm ở mục <strong>“Hardware Address”</strong>"');
p(`<h4>Đường đi ba bước</h4>
<p>Biểu tượng mạng (góc trên bên phải Ubuntu) → <strong>"Connection Information"</strong> → dòng
<strong>"Hardware Address"</strong>.</p>
<p>Giá trị có dạng <code>1C-4D-70-62-75-05</code> — sáu cặp ký tự hex. Trong Ubuntu nó thường hiện với dấu
<strong>hai chấm</strong> (<code>1C:4D:70:62:75:05</code>) còn email mẫu của thầy dùng dấu
<strong>gạch ngang</strong>. <strong>Gõ theo đúng mẫu email: dấu gạch ngang.</strong></p>
<p>💡 <strong>Chụp ảnh màn hình này lại bằng điện thoại</strong> (ở ngoài phòng LAB). Gõ nhầm một ký tự MAC
là email vô hiệu, và bạn sẽ không biết vì sao PTS không cho vào.</p>`);

head('Page 8 — The registration email: exact format, no negotiation', 'Trang 8 — Email đăng ký MAC: đúng format, không thương lượng');
img('usb-08.png', 'Trang 8 — Mục IV "Gửi mail": From / To tuanvm23@fe.edu.vn / CC giảng viên, và công thức Subject "MAC_" + Lớp LAB + "|" + Roll number + "|" + địa chỉ MAC.');
nguyenVan(
  '"<strong>LƯU Ý</strong>: SV phải gửi đúng format và nội dung được hướng dẫn. <strong>Nếu gửi sai format, nội dung và không được GV Reply đồng ý thì SV sẽ không thể vào được hệ thống</strong> (Sẽ không được hỗ trợ hoặc nếu có cũng sẽ chậm… – SV tự chịu trách nhiệm)."',
  '"<strong>Nếu nội dung email không có lý do đổi MAC thì kể cả GV đồng ý cũng sẽ không được chấp nhận.</strong>"',
  '<strong>1. From:</strong> "Sử dụng email đã đăng ký với trường với tên đầy đủ và chính xác của SV"',
  '<strong>2. To:</strong> <code>tuanvm23@fe.edu.vn</code>',
  '<strong>3. CC:</strong> "(email của GV hướng dẫn lớp)"',
  '<strong>Subject:</strong> "“MAC_” + Lớp LAB + “|” + Roll number + “|” + địa chỉ MAC" — "<strong>không để lại khoảng trống (space/dấu cách)</strong>"',
  'Ví dụ: <code>MAC_SE1406|HE130212|1C-4D-70-62-75-05</code>');
p(`<h4>Công thức Subject — ba phần, hai dấu gạch đứng, không dấu cách</h4>`);
code('Registration email — the exact shape', 'Email đăng ký MAC — hình dạng chính xác', 'text',
`To:      tuanvm23@fe.edu.vn
CC:      annv22@fe.edu.vn          <- EMAIL THAY BAN (slide 1). THIEU CC = VO HIEU.
Subject: MAC_SE1406|HE130212|1C-4D-70-62-75-05
         |   |      |        |
         |   |      |        +-- dia chi MAC, dau GACH NGANG
         |   |      +-- ma sinh vien cua ban
         |   +-- lop LAB cua ban
         +-- tien to co dau gach duoi, VIET HOA

KHONG co dau cach o bat cu dau trong Subject.

Noi dung:
    Ten sinh vien:    Nguyen Van A
    Lop LAB:          SE1406
    Ma sinh vien:     HE130212
    Dia chi MAC Wi-fi: 1C-4D-70-62-75-05
    Ly do gui mail:   May cua em bi hong nen can dang ky dia chi MAC cho may moi
                      ^^^^^^^^^^^^^^^^ BAT BUOC — thieu la vo hieu du GV dong y`);
p(`<h4>Ba cách làm email vô hiệu — tài liệu nói rõ cả ba</h4>
<ol>
  <li><strong>Sai format Subject</strong> (thừa dấu cách, thiếu dấu <code>|</code>, viết thường
  <code>mac_</code>) → không vào được hệ thống.</li>
  <li><strong>Không CC giảng viên</strong> → không có hiệu lực.</li>
  <li><strong>Thiếu "Lý do gửi mail"</strong> → <em>"kể cả GV đồng ý cũng sẽ không được chấp nhận"</em>.
  Đây là câu dễ bỏ sót nhất, vì nghe như thủ tục vặt.</li>
</ol>
<p>Và câu chốt: <em>"SV tự chịu trách nhiệm"</em>. Gửi sai thì không ai chữa hộ, chỉ mất buổi.</p>
<p>💡 Tài liệu có kèm <strong>một ứng dụng Google Apps Script tạo email đúng format tự động</strong>
(đường link dài ở đầu trang 8). Dùng nó thì khỏi gõ tay. Nhưng vẫn phải tự thêm CC và lý do.</p>`);

head('Page 9 — Sample email, and the start of troubleshooting', 'Trang 9 — Email mẫu và mở đầu phần xử lý sự cố');
img('usb-09.png', 'Trang 9 — Nội dung email mẫu (tên SV, lớp LAB, mã SV, MAC, lý do) kèm ảnh chụp một email thật; bắt đầu mục V "Xử lý sự cố".');
nguyenVan(
  'Nội dung email mẫu: "Tên sinh viên: Nguyễn Văn A · Lớp LAB: SE1406 · Mã sinh viên: HE130212 · Địa chỉ MAC Wi-fi: 1C-4D-70-62-75-05 · <strong>Lý do gửi mail: Máy của em bị hỏng nên cần đăng ký địa chỉ MAC cho máy mới</strong>"',
  '"NOTE: Những trường hợp hỏng máy, đổi máy SV cần email theo đúng format, phần nội dung <strong>bổ sung thêm lý do đổi máy</strong>, CC mail cho GV phụ trách lớp. <strong>Sau khi GV reply confirm là đồng ý thì email đó mới có hiệu lực.</strong>"',
  '<strong>V. Xử lý sự cố:</strong> "SV <strong>rút tất cả các usb trừ USB LAB</strong>."',
  '"Trong trường hợp máy không boot vào được USB: Kiểm tra xem sv đã làm theo đúng hướng dẫn boot vào usb chưa · Đã làm theo hướng dẫn nhưng chưa được hoặc không biết cách làm thì <strong>qua phòng IT</strong>"');
p(`<h4>"Sau khi GV reply confirm là đồng ý thì email đó mới có hiệu lực"</h4>
<p>Gửi email <strong>không phải là xong</strong>. Nó chỉ có hiệu lực khi thầy <em>trả lời đồng ý</em>. Nghĩa
là bạn phải <strong>gửi sớm, trước buổi học nhiều ngày</strong>, và <strong>kiểm hộp thư xem thầy đã trả lời
chưa</strong>. Gửi tối hôm trước rồi sáng hôm sau vào lớp là quá muộn.</p>

<h4>Sự cố đầu tiên trong danh sách — đơn giản đến mức dễ bỏ qua</h4>
<p><em>"SV rút tất cả các usb trừ USB LAB."</em> Chuột không dây, USB tản nhiệt, ổ cứng ngoài — chúng làm
BIOS rối thứ tự boot. Rút hết ra là cách chữa nhanh nhất và nhiều người không nghĩ tới.</p>`);

head('Page 10 — The troubleshooting table: read this before class', 'Trang 10 — Bảng xử lý sự cố: đọc TRƯỚC khi vào lớp');
img('usb-10.png', 'Trang 10 — Bảng xử lý sự cố đầy đủ: không thấy wifi · kết nối rồi bị out · PTS không cho vào · màn hình đen sau đăng nhập · email sai format.');
nguyenVan(
  '"Máy boot được USB nhưng <strong>không nhìn thấy bất cứ mạng Wifi nào</strong>: Kiểm tra lại và <strong>tắt Secure Boot và TPM</strong> · Nếu vẫn không thấy, thử <strong>card wifi ở phòng AL-L300</strong>"',
  '"Không tự kết nối wifi hoặc <strong>kết nối FPTU_Laboratory thành công nhưng lại tự out ngay</strong>: Tắt máy rút USB LAB → Boot vào Windows → <strong>Forget mạng “DH-FPT” rồi đăng nhập lại</strong> → Tắt máy → Cắm và Boot lại"',
  '"Đã kết nối wifi và đăng nhập PTS lần đầu thành công mà <strong>PTS vẫn chưa cho vào</strong>: <strong>Nhờ GV kiểm tra xem đã gán USB cho mình chưa</strong> · Kiểm tra lại Format và địa chỉ MAC đã gửi"',
  '"Đăng nhập PTS ngay sau khi popup hiển thị thì <strong>hiển thị màn hình đen</strong>: <strong>Xóa Cookies</strong> → Tắt trình duyệt → Bấm vào PTS để đăng nhập lại"',
  '"Đã gửi email đổi máy GV đã đồng ý mà vẫn không được xử lý: <strong>Do gửi email sai format hoặc sai nội dung · Thiếu lý do đổi máy</strong>"');
p(`<h4>Bảng tra nhanh — chụp lại màn hình này để trong điện thoại</h4>
<table>
  <tr><th>Triệu chứng</th><th>Chữa</th></tr>
  <tr><td>Không boot được vào USB</td><td>Rút hết USB khác · Kiểm lại Secure Boot/TPM/Fast Boot · Quá 5–10 phút → <strong>phòng IT 300L</strong></td></tr>
  <tr><td>Boot được nhưng <strong>không thấy wifi nào</strong></td><td>Tắt <strong>Secure Boot + TPM</strong> · Vẫn không thấy → mượn <strong>card wifi phòng AL-L300</strong></td></tr>
  <tr><td>Kết nối được rồi <strong>bị đẩy ra ngay</strong></td><td>Sang <strong>Windows</strong> → <strong>Forget "DH-FPT"</strong> → đăng nhập lại → tắt máy → boot USB lại</td></tr>
  <tr><td><strong>PTS không cho vào</strong></td><td>Nhờ GV kiểm <strong>đã gán USB cho mình chưa</strong> · Kiểm lại format + MAC đã gửi</td></tr>
  <tr><td>Đăng nhập PTS ra <strong>màn hình đen</strong></td><td><strong>Xoá Cookies</strong> → tắt trình duyệt → bấm PTS lại</td></tr>
  <tr><td>Email đã được duyệt mà vẫn không vào được</td><td>Gần như chắc chắn là <strong>sai format</strong> hoặc <strong>thiếu lý do đổi máy</strong></td></tr>
</table>
<p><strong>Nhận xét chung:</strong> để ý là <strong>"tắt Secure Boot và TPM"</strong> xuất hiện lại ở đây,
lần thứ ba trong tài liệu. Nó là nguyên nhân của phần lớn sự cố. Còn <strong>"Forget DH-FPT trong
Windows"</strong> xuất hiện lần thứ hai — hai mẹo này giải quyết đa số vấn đề.</p>`);

// ══════════════════════════════════════════════════════════════
part(4,
  'Document D — "Lab Grading Policy", 2 pages',
  'Tài liệu D — "Lab Grading Policy", 2 trang',
  'What is graded, and where the line on copying is drawn',
  'Chấm cái gì, và ranh giới của việc chép ở đâu');

head('Page 1 — Three grading criteria, and the academic policy', 'Trang 1 — Ba tiêu chí chấm và chính sách học thuật');
img('gp-1.png', 'Trang 1 — GRADING POLICY: 1. Program structure · 2. Coding convention · 3. Meet the assignment requirements. Bên dưới là ACADEMIC POLICY về Cheating và Plagiarism.');
nguyenVan(
  '"Your assignment is graded base on <strong>03 main features</strong>:"',
  '<strong>1. Program structure</strong>: "Follow structure described in assignment"',
  '<strong>2. Coding convention</strong>: "Source File name · Function name · Variable naming convention · <strong>Code comment</strong> · Statement format …"',
  '<strong>3. Meet the assignment requirements</strong>',
  '"(Java Coding Conventions for others: <em>cms.fpt.edu.vn/elearning/…id=108540</em>)"',
  '<strong>ACADEMIC POLICY:</strong> "Cheating, plagiarism are serious offenses under this Policy."',
  '"<strong>Plagiarism is not excusable by trivial differences in the code or the wording.</strong>"',
  '"<strong>Studying and improving others\\u2019 code is a good way to learn.</strong> You may imitate and dissect the sample code in the subject web site and the printed subject notes. <strong>You may use this code in your submissions</strong>… You do not need to cite the authors of the code that you have copied from the printed subject notes or this web site."');
p(`<h4>Ba tiêu chí — và thứ tự của chúng nói lên điều gì</h4>
<table>
  <tr><th>#</th><th>Tiêu chí</th><th>Nghĩa trong bài của bạn</th></tr>
  <tr><td>1</td><td><strong>Program structure</strong></td><td>Đúng 8 package của thầy. Slide 10: "không có cấu trúc → không review"</td></tr>
  <tr><td>2</td><td><strong>Coding convention</strong></td><td>Tên file, tên hàm, tên biến, <strong>comment</strong>, định dạng câu lệnh</td></tr>
  <tr><td>3</td><td><strong>Meet the requirements</strong></td><td>Chạy đúng theo đề — kể cả định dạng chữ in ra</td></tr>
</table>
<p>Để ý: <strong>"chạy đúng" chỉ là tiêu chí thứ BA</strong>. Hai tiêu chí đứng trước nó đều là về
<em>cách viết</em>, không phải về kết quả. Đây là điều khác biệt lớn nhất giữa LAB211 và các môn lập trình
khác — <strong>code chạy đúng mà cấu trúc sai thì vẫn không được review</strong>.</p>
<p>Và chú ý <strong>"Code comment" nằm trong danh sách coding convention</strong>. Ghép với slide 10
("không có comment → không review") thì comment không phải trang trí — nó là tiêu chí chấm.</p>

<h4>Ranh giới chép — chính sách này RỘNG hơn bạn tưởng</h4>
<p>Đây là đoạn nhiều người đọc lướt rồi tự làm khó mình. Tài liệu cho phép rõ ràng:</p>
<blockquote><em>"You may <strong>imitate and dissect the sample code</strong> in the subject web site and
the printed subject notes. <strong>You may use this code in your submissions</strong>, including your
assignments. You <strong>do not need to cite</strong> the authors of the code that you have copied from the
printed subject notes or this web site."</em></blockquote>
<p>Nghĩa là: <strong>bài mẫu <code>P0055</code> trong file Guide là nguồn được phép dùng lại, không cần trích
dẫn.</strong> Kiến trúc 8 package, class <code>Validation</code>, cách bố trí <code>Message</code> — dùng
thoải mái cho cả 9 bài. Đó chính là điều slide 9 đã nói khi cho bạn mở Guide ở buổi đầu.</p>
<table>
  <tr><th>✅ Được phép</th><th>❌ Không được phép</th></tr>
  <tr><td>Dùng lại code mẫu của môn, không cần ghi nguồn</td><td>Chép bài của <strong>sinh viên khác</strong> mà không ghi nguồn</td></tr>
  <tr><td>Chép code workshop của bạn cùng lớp <strong>nếu ghi rõ tên tác giả</strong></td><td>Đổi tên biến rồi nhận là của mình</td></tr>
  <tr><td>Đọc, mổ xẻ, cải tiến code người khác để học</td><td>Chép từ website/sách mà không ghi nguồn</td></tr>
</table>
<p>⚠️ Câu <em>"Plagiarism is not excusable by trivial differences in the code or the wording"</em> chặn
đúng cái mẹo mà ai cũng nghĩ tới: đổi tên biến, đổi thứ tự hàm, đổi lời chú thích. Hệ thống so bài không
nhìn tên biến — nó nhìn cấu trúc.</p>
<p>💡 <strong>Với bạn, điều này rất có lợi:</strong> bạn <em>được phép</em> dựng lại bộ khung P0055 từ mẫu
của thầy cho mọi bài. Cái phải là của bạn là <strong>phần nghiệp vụ riêng của từng bài</strong> — và đằng
nào bạn cũng phải hiểu nó để trả lời review.</p>`);

head('Page 2 — "How Not To Plagiarize": the two roles', 'Trang 2 — "How Not To Plagiarize": hai vai');
img('gp-2.png', 'Trang 2 — "How Not To Plagiarize": hướng dẫn cho người GIÚP và người ĐƯỢC GIÚP.');
nguyenVan(
  '"You may copy the workshop code of your peers <strong>provided that you cite them as the authors</strong>. All other code should be entirely your own."',
  '<strong>If you are the helper:</strong> "set aside your notes, printouts and similar materials. <strong>Study your colleague\\u2019s screen</strong> or printout and work with them on their problem <strong>using their approach</strong>. Help them debug their code. <strong>Do not show them how you did it.</strong>"',
  '<strong>If you are the person being helped:</strong> "your objective is <strong>to understand the problem</strong>. Don\\u2019t just ask for the answer or look at your colleague\\u2019s solution. <strong>Remember, you will need a good level of understanding to answer the question from the instructor.</strong>"');
p(`<h4>Hai vai, hai luật — và cả hai đều thực dụng</h4>
<table>
  <tr><th></th><th>Bạn là NGƯỜI GIÚP</th><th>Bạn là NGƯỜI ĐƯỢC GIÚP</th></tr>
  <tr><td>Nhìn vào đâu</td><td><strong>Màn hình của họ</strong></td><td>Màn hình của chính mình</td></tr>
  <tr><td>Theo hướng nào</td><td><strong>Cách tiếp cận của họ</strong></td><td>Cách của mình</td></tr>
  <tr><td>Làm gì</td><td>Giúp họ <strong>debug</strong></td><td>Hỏi để <strong>hiểu vấn đề</strong></td></tr>
  <tr><td>Cấm</td><td><strong>Cho xem bài của mình</strong></td><td>Xin đáp án / nhìn bài người khác</td></tr>
</table>
<p><strong>Câu cuối cùng của cả tài liệu là câu quan trọng nhất:</strong></p>
<blockquote><em>"Remember, <strong>you will need a good level of understanding to answer the question from
the instructor</strong>."</em></blockquote>
<p>Đây không phải lời răn đạo đức — nó là <strong>lời cảnh báo thực dụng</strong>. Ở LAB211, chép bài
<em>không giúp bạn qua môn</em>, vì điểm không nằm ở file bạn nộp mà nằm ở <strong>cuộc vấn đáp trước
màn hình</strong>. Code không phải của bạn thì bạn không trả lời được "tại sao chỗ này private", và thầy
biết ngay trong 30 giây.</p>
<p>Điều này cũng đúng với AI: dán code AI sinh ra thì bạn qua được bước "chạy đúng", nhưng chết ở bước
vấn đáp — mà bước vấn đáp mới là bước cho LOC.</p>`);

// ══════════════════════════════════════════════════════════════
part(5,
  'Everything the four documents demand, in one list',
  'Tổng hợp — mọi thứ bốn tài liệu đòi hỏi, gom vào một danh sách',
  'Print this. Tick it before every review.',
  'In ra. Gạch từng dòng trước mỗi lần gọi review.');

head('Before class — do these at home', 'Trước buổi học — làm ở nhà');
p(`<ol>
  <li>☐ <strong>Thử boot laptop vào USB LAB</strong>, và thử <strong>wifi có lên không</strong> (tài liệu C
  trang 2 bắt buộc). Hỏng → phòng IT 300L, hoặc mượn card wifi phòng AL-L300.</li>
  <li>☐ Biết <strong>phím vào BIOS</strong> của máy mình, và đã <strong>tắt Secure Boot + TPM</strong>.</li>
  <li>☐ Lưu <strong><code>annv22@fe.edu.vn</code></strong> (email thầy — cần để CC).</li>
  <li>☐ Nếu đổi máy: <strong>gửi email đăng ký MAC</strong> đúng format, có CC thầy, <strong>có lý do đổi
  máy</strong>, và <strong>đợi thầy reply đồng ý</strong>.</li>
  <li>☐ <strong>Gõ lại bộ khung P0055 từ đầu</strong>, không nhìn mẫu, cho tới khi thuộc tay.</li>
  <li>☐ Tập <strong>debug trong NetBeans</strong>: <code>Ctrl</code>+<code>F8</code> · <code>Ctrl</code>+<code>F5</code>
  · <code>F8</code> · <code>F7</code>.</li>
  <li>☐ Trả lời được <strong>12 câu review</strong> thành tiếng, tay chỉ vào code.</li>
</ol>`);

head('In the room — the reflexes', 'Trong phòng học — những phản xạ');
p(`<ol>
  <li>☐ <strong>Điện thoại + đồng hồ thông minh lên bàn phía trên NGAY khi vào cửa</strong> — trước cả khi
  ngồi. (Để trong người = reject cả bài trên server.)</li>
  <li>☐ Máy chỉ ở một trong hai trạng thái: <strong>tắt hẳn</strong> hoặc <strong>đang chạy USB LAB</strong>.
  Muốn dùng Windows → ra khỏi phòng.</li>
  <li>☐ <strong>Có mặt trong 10 phút đầu</strong> — điểm danh chỉ một lần.</li>
  <li>☐ Đăng nhập máy có <code>FU\\</code>, đăng nhập PTS <strong>không</strong> có <code>FU\\</code>.</li>
  <li>☐ <strong>DRAFT mỗi 15 phút</strong>, và bấm PTS đăng nhập lại trước mỗi lần lưu.</li>
  <li>☐ <strong>SUBMIT chỉ khi thầy nói đạt</strong> — submit rồi là không sửa được nữa.</li>
  <li>☐ Không chọn quá 5 bài; xong bài nào mới chọn tiếp bài mới.</li>
</ol>`);

head('Before raising your hand for review', 'Trước khi giơ tay gọi review');
p(`<ol>
  <li>☐ Đủ <strong>8 package</strong>, đặt tên đúng</li>
  <li>☐ <code>Scanner</code> <strong>chỉ có trong <code>Main.java</code></strong></li>
  <li>☐ <code>System.out</code> <strong>chỉ có trong <code>view/</code> và <code>Main</code></strong></li>
  <li>☐ Mọi field là <code>private</code></li>
  <li>☐ <code>static</code> chỉ có ở <code>utils/Validation</code></li>
  <li>☐ Không câu chữ nào hardcode ngoài <code>constants/Message</code></li>
  <li>☐ Khai báo <code>ArrayList</code>/<code>HashMap</code>, <strong>không phải</strong> <code>List</code>/<code>Map</code></li>
  <li>☐ Mỗi function + mỗi <code>if</code>/<code>for</code>/<code>while</code> có một dòng <code>//</code></li>
  <li>☐ Đã bấm <strong><code>Alt</code>+<code>Shift</code>+<code>F</code></strong></li>
  <li>☐ Đã chạy <strong>hết</strong> happy case và hiện <strong>đủ</strong> message lỗi</li>
  <li>☐ Đặt được breakpoint và debug được tại chỗ</li>
  <li>☐ Trả lời được 12 câu review</li>
</ol>`);

head('The four penalties, ranked by cost', 'Bốn hình phạt, xếp theo mức thiệt hại');
p(`<table>
  <tr><th>Vi phạm</th><th>Hình phạt</th><th>Nguồn</th></tr>
  <tr><td>Máy không boot USB LAB khi ở trong phòng</td><td><strong>Tính là gian lận → False môn</strong></td><td>Tài liệu C, tr.2</td></tr>
  <tr><td>Vào mạng wifi khác</td><td><strong>Máy bị khoá + xoá sạch dữ liệu</strong></td><td>Tài liệu C, tr.5</td></tr>
  <tr><td>Để điện thoại trong người</td><td>Reject bài tạm <strong>+ bài trên server</strong></td><td>Slide 9</td></tr>
  <tr><td>Xem điện thoại / tài liệu</td><td>Nghỉ luôn buổi đó, <strong>không có lần đầu</strong></td><td>Slide 9</td></tr>
  <tr><td>Quên DRAFT</td><td>Mất bài, làm lại từ đầu</td><td>Tài liệu B</td></tr>
  <tr><td>SUBMIT sớm</td><td>Không sửa lại được nữa</td><td>Tài liệu B</td></tr>
</table>
<p>Ba cái đầu <strong>không liên quan gì tới khả năng lập trình của bạn</strong>. Chúng là kỷ luật thuần
tuý, và chúng đắt hơn mọi lỗi code. Đó là lý do tài liệu này được đặt <strong>ở đầu track</strong>, trước
cả Java.</p>`);
