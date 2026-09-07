/**
 * academy-lab211-fall26.mjs — bổ sung 3 chương "Fall 2026" vào khoá Academy
 * LAB211 (course id 18, "OOP with Java Lab").
 *
 * Vì sao cần: khoá Academy đã có 10 chương dạy Java/LAB211 nói chung, nhưng
 * KHÔNG có yêu cầu riêng của giảng viên Fall 2026 (kiến trúc 8 package, bảng
 * câu review, nội quy USB LAB…). Code Lab đã có phần đó ở dạng bài giảng dài
 * một mạch; Academy chia nhỏ thành chương/bài để học từng buổi, sâu hơn, và
 * mỗi bài dẫn thẳng sang bài tập tương ứng trên Code Lab.
 *
 * Chạy lại được: xoá đúng 3 chương do script này tạo (nhận theo slug tiền tố
 * `lab211-f26-`) rồi tạo lại, không đụng 10 chương cũ.
 *
 *   node scripts/academy-lab211-fall26.mjs           # thử khô
 *   node scripts/academy-lab211-fall26.mjs --apply
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');
const COURSE_ID = 18;
const TIEN_TO = 'lab211-f26-';

const R2S = 'https://media.cuongthai.com/code-lab/lab211/slide';
const R2H = 'https://media.cuongthai.com/code-lab/lab211/hdc';
const CL = 'https://cuongthai.com/code-lab/lab211';

/** Ảnh slide kèm chú thích. */
const anh = (url, cap) =>
  `<div class="anh-slide"><img src="${url}" alt="${cap.replace(/"/g, '&quot;')}" loading="lazy" />` +
  `<p class="chu-thich">${cap}</p></div>`;

/** Nút dẫn sang Code Lab. */
const sangCodeLab = (slug, nhan) =>
  `<p class="di-toi"><a href="${CL}/${slug}" target="_blank" rel="noopener">▶ Làm bài trên Code Lab: <strong>${nhan}</strong></a></p>`;

/** Bài học song ngữ. Bản EN gọn, bản VI đầy đủ — người học là SV Việt. */
const noiDung = (eyebrow, tieuDeEn, thanEn, tieuDeVi, thanVi) => `
<div class="ml-en">
<span class="eyebrow">${eyebrow}</span>
<h2>${tieuDeEn}</h2>
${thanEn}
</div>
<div class="ml-vi">
<span class="eyebrow">${eyebrow}</span>
<h2>${tieuDeVi}</h2>
${thanVi}
</div>`;

const CHUONG = [];
const chuong = (sortOrder, titleEn, titleVi, baiHoc) =>
  CHUONG.push({ sortOrder, title: `${titleEn}|||${titleVi}`, baiHoc });

// ══════════════════════════════════════════════════════════════
// CHƯƠNG 11 — Kiến trúc 8 package
// ══════════════════════════════════════════════════════════════
const P0055 = 'lab211-j1-s-p0055-doctor-management-program';

chuong(1,
  "Fall 2026 · B — Your mentor's 8-package architecture",
  'Fall 2026 · B — Kiến trúc 8 package của thầy',
[
{
  slug: `${TIEN_TO}kien-truc-tong-quan`,
  titleEn: 'B.1 — The MVC-of-JSP layout and one-way data flow',
  titleVi: 'B.1 — Bố cục MVC kiểu JSP và luồng dữ liệu một chiều',
  desc: 'Tám package, ai được làm gì, và vì sao Model với View không bao giờ nói chuyện.',
  html: noiDung('Phần B · Bài 10.1',
    'Eight packages, one direction',
    `<p class="lead">Your mentor calls it "MVC of JSP": the same layering as a Java web app, only the shell
     changes. In web, View is a JSP page and Controller is a Servlet. In a console app, View is the class that
     prints and Controller is the class that routes. <strong>Same structure.</strong></p>`,
    'Tám package, một chiều',
    `<p class="lead">Thầy gọi là <strong>"MVC của JSP"</strong>: cùng một mô hình với web Java, chỉ đổi lớp vỏ.
     Trong web, View là trang JSP và Controller là Servlet. Trong bài console, View là class chỉ lo in, Controller
     là class nhận lệnh rồi điều hướng. <strong>Cấu trúc y hệt nhau.</strong></p>

     <h3>Luồng dữ liệu — một chiều, không đi tắt</h3>
     <pre><code>Main ──RequestDTO──▶ Controller ──▶ Service ──▶ Repository ──▶ Model
  │                      │
  │                      └──ResponseDTO──▶ View ──▶ màn hình
  └──▶ Validation (static)

Model  ✕  View        ← KHÔNG BAO GIỜ nói chuyện trực tiếp</code></pre>

     <p>File Guide của thầy ghi rõ: <em>"Model và View không giao tiếp với nhau"</em>. Model muốn hiện ra màn hình
     thì viết <code>toString()</code>, trả ngược về Repository → Controller → View. Không có đường tắt.</p>

     <h3>Bảng: mỗi package được làm gì, cấm làm gì</h3>
     <table>
       <tr><th>Package</th><th>File</th><th>ĐƯỢC làm</th><th>CẤM</th></tr>
       <tr><td><code>constants</code></td><td>Message, Constants</td><td>Mọi câu chữ, hằng số, enum</td><td>Hardcode câu chữ ở class khác</td></tr>
       <tr><td><code>dto</code></td><td>XxxRequestDTO, XxxResponseDTO</td><td>Chở dữ liệu giữa các tầng</td><td>Chứa logic xử lý</td></tr>
       <tr><td><code>main</code></td><td>Main.java</td><td>Work flow. <strong>Scanner CHỈ ở đây</strong></td><td><strong>static với BIẾN</strong>. Gọi model, gọi view</td></tr>
       <tr><td><code>controller</code></td><td>XxxController</td><td>Điều hướng Service/Repo ↔ View</td><td><strong>static</strong>. Nhập bàn phím. <code>System.out</code></td></tr>
       <tr><td><code>model</code></td><td>Doctor.java</td><td>Thuộc tính + <code>toString()</code></td><td><strong>static</strong>. Scanner. <code>printf</code></td></tr>
       <tr><td><code>repository</code></td><td>XxxRepository</td><td>Giữ dữ liệu + CRUD</td><td>Input/output, gọi View</td></tr>
       <tr><td><code>service</code></td><td>XxxServices</td><td>Nghiệp vụ ngoài CRUD</td><td>Input/output, gọi View</td></tr>
       <tr><td><code>utils</code></td><td>Validation.java</td><td>Hàm dùng chung. <strong>BẮT BUỘC static</strong></td><td>Giữ trạng thái. Cho <code>new</code></td></tr>
       <tr><td><code>view</code></td><td>XxxView</td><td>Nhận ResponseDTO rồi in</td><td>Tính toán. Đọc bàn phím</td></tr>
     </table>

     <h3>Thứ tự gõ code — không tuỳ tiện</h3>
     <p><strong>model → dto → repository → service → controller → view → utils → constants → main.</strong></p>
     <p>Mỗi file chỉ dùng những file đã viết trước nó, nên gõ xuôi là không bao giờ phải quay lại sửa. Đây chính là
     điều thầy nhắc <em>"code model trước rồi đến data"</em>.</p>

     ${anh(`${R2H}/hd-05.png`, 'Slide 5 — Yêu cầu thực hành. Dòng cuối "Đóng gói — Không truyền dữ liệu qua lại" là lý do sâu xa của cả kiến trúc.')}
     ${sangCodeLab(P0055, 'J1.S.P0055 — bộ khung 10 file đã chạy được')}`),
},
{
  slug: `${TIEN_TO}model-dto`,
  titleEn: 'B.2 — model & dto: the object and the boxes',
  titleVi: 'B.2 — model & dto: đối tượng và những cái hộp',
  desc: 'Vì sao DTO trông giống Model mà vẫn phải tách, và lời giải cho "không truyền 3 tham số".',
  html: noiDung('Phần B · Bài 10.2',
    'model & dto',
    `<p class="lead">The model describes one real thing. The DTOs are boxes that carry data between layers.
     They look almost identical — and that confuses everyone at first.</p>`,
    'model & dto',
    `<p class="lead">Model mô tả <strong>một thứ có thật</strong>. DTO là <strong>cái hộp</strong> chở dữ liệu giữa
     các tầng. Chúng trông gần như giống hệt nhau — và đó là chỗ ai cũng thắc mắc lúc đầu.</p>

     <h3>model/Doctor.java — gõ đầu tiên</h3>
     <pre><code>public class Doctor {
    private String code;          // private: ben ngoai KHONG cham thang duoc
    private int availability;

    public Doctor(String code, String name, String specialization, int availability) {
        this.code = code;         // trai: THUOC TINH · phai: THAM SO
        ...
    }

    @Override                     // ghi de Object.toString()
    public String toString() {
        return String.format(Constants.ROW_FORMAT, code, name, specialization, availability);
    }
}</code></pre>

     <h3>Ba điều phải hiểu ở file này</h3>
     <ul>
       <li><strong><code>private</code> = Đóng gói.</strong> Không phải để giấu bí mật, mà để sau này sửa luật chỉ
       phải sửa một chỗ. Mai thầy bảo "số ca trực không quá 7" — bạn thêm kiểm tra vào <code>setAvailability()</code>,
       mọi nơi gọi không đổi gì.</li>
       <li><strong><code>this</code> giải quyết trùng tên.</strong> Bỏ <code>this</code> đi là nó tự gán cho chính
       nó, field vẫn <code>null</code> — lỗi kinh điển của người lâu không viết Java.</li>
       <li><strong><code>@Override toString()</code> chính là Đa hình</strong> — mọi class ngầm kế thừa
       <code>Object</code>, bạn viết đè lên. Có sẵn trong bài, không cần bịa thêm. Và nó
       <strong><code>return</code> chứ không <code>println</code></strong>, vì model bị cấm in.</li>
     </ul>

     <h3>Vì sao cần DTO</h3>
     <table>
       <tr><th>Class</th><th>Nhiệm vụ</th></tr>
       <tr><td><code>Doctor</code></td><td>Sống trong kho — dữ liệu THẬT</td></tr>
       <tr><td><code>DoctorRequestDTO</code></td><td>Hộp chở dữ liệu Main → Controller</td></tr>
       <tr><td><code>DoctorResponseDTO</code></td><td>Hộp chở kết quả Controller → View</td></tr>
     </table>

     <p>Đây là lời giải cho luật <em>"không được truyền 3 tham số vào 1 hàm"</em>:</p>
     <pre><code>// Khong co DTO — 4 tham so, them truong la sua het moi noi goi
controller.addDoctor(code, name, specialization, availability);

// Co DTO — 1 tham so, them truong chi sua trong DTO
controller.addDoctor(dto);</code></pre>

     <p>Trong đời thật hai hộp không giống nhau: hộp <strong>gửi vào</strong> có thể chứa mật khẩu, hộp
     <strong>hiện ra</strong> thì không được có. Bài này chúng giống nhau, nhưng vẫn tách để đúng kiến trúc.</p>

     <h3>Bài luyện — làm rồi mới thấm</h3>
     <p>Thêm trường <code>phone</code> vào bác sĩ. Bạn sẽ phải sửa <strong>9 file</strong> — nhưng
     <strong><code>DoctorController</code> KHÔNG phải sửa một dòng nào</strong>, vì nó chỉ nhận DTO rồi chuyển tiếp.
     Đó là lúc bạn <em>cảm</em> được vì sao luật DTO tồn tại.</p>
     ${sangCodeLab(P0055, 'J1.S.P0055 — mở tab Starter code để xem 10 file')}`),
},
{
  slug: `${TIEN_TO}repository-service`,
  titleEn: 'B.3 — repository & service: data and business logic',
  titleVi: 'B.3 — repository & service: dữ liệu và nghiệp vụ',
  desc: 'Cái "data" thầy nói là gì, khi nào cần thêm Service, và vì sao HashMap chứ không ArrayList.',
  html: noiDung('Phần B · Bài 10.3',
    'repository & service',
    `<p class="lead">Repository holds the data and does plain CRUD. Anything beyond CRUD — totals, reports,
     sorting — belongs to a Service sitting between Controller and Repository.</p>`,
    'repository & service',
    `<p class="lead">Repository <strong>giữ dữ liệu</strong> và làm CRUD đơn giản. Bất cứ thứ gì ngoài CRUD —
     tính tổng, báo cáo, sắp xếp — thuộc về <strong>Service</strong> nằm giữa Controller và Repository.</p>

     <h3>repository — cái "data" thầy nói</h3>
     <pre><code>public class DoctorRepository {
    // Gia lap database bang Map: khoa la ma bac si
    private Map&lt;String, Doctor&gt; doctorMap = new HashMap&lt;&gt;();

    public boolean addDoctor(DoctorRequestDTO dto) { ... }
    public boolean isDuplicate(String code) { return doctorMap.containsKey(code); }

    // private vi CHI dung trong chinh class nay
    private DoctorResponseDTO toResponse(Doctor doctor) { ... }
}</code></pre>

     <h3>Vì sao <code>HashMap</code> chứ không <code>ArrayList</code> — thầy chắc chắn hỏi</h3>
     <ul>
       <li>Thao tác chính của bài là <strong>tìm theo mã</strong>. <code>HashMap</code> tra theo khoá gần như tức
       thì; <code>ArrayList</code> phải duyệt từ đầu tới cuối.</li>
       <li>Khoá của <code>Map</code> là <strong>duy nhất</strong> — nó chặn trùng mã hộ luôn.</li>
     </ul>
     <p><strong>Nhưng</strong> <code>HashMap</code> <strong>không giữ thứ tự</strong>. Nên khi cần sắp xếp, phải đổ
     sang <code>ArrayList</code> trước — xem bài 10.4 và bài luyện Strategy.</p>

     <h3>Câu trả lời đầy đủ cho "List vs ArrayList"</h3>
     <blockquote><code>List</code> là <strong>giao diện</strong> — bản hợp đồng nói "có <code>add</code>,
     <code>get</code>, <code>size</code>". <code>ArrayList</code> là <strong>bản cài đặt</strong> bằng mảng động:
     lấy theo chỉ số rất nhanh, chèn/xoá giữa thì chậm vì phải dịch phần tử. <code>LinkedList</code> cài cùng hợp
     đồng bằng danh sách liên kết, ngược lại. Tương tự <code>Map</code> là hợp đồng, <code>HashMap</code> cài bằng
     băm nên <strong>không giữ thứ tự</strong>, <code>LinkedHashMap</code> giữ thứ tự thêm vào,
     <code>TreeMap</code> sắp theo khoá.</blockquote>
     <p>⚠️ Nhiều bạn nghe đồn "dùng <code>List</code> là bị nghi dùng AI". Thực tế: <strong>code mẫu của chính
     thầy</strong> viết <code>Map&lt;String, Doctor&gt; doctorMap = new HashMap&lt;&gt;()</code> — dùng
     <code>Map</code> làm kiểu khai báo. Luật thật là <em>giải thích được</em>. Cứ viết y như mẫu của thầy.</p>

     <h3>Khi nào cần Service</h3>
     <p>File Guide ghi: <em>"Nếu có các tính toán nghiệp vụ ngoài CRUD thì cần thêm class
     <code>DoctorServices.java</code>… Services nằm <strong>giữa</strong> Controller và Repo."</em></p>
     <p>Sắp xếp, tính tổng chi tiêu, sinh báo cáo — <strong>không phải CRUD</strong> ⇒ thuộc về Service.
     Nhét vào Repository là trộn hai trách nhiệm, vi phạm SRP.</p>
     <pre><code>public class DoctorServices {
    private DoctorRepository doctorRepository;

    // Nhan Repository qua constructor — KHONG tu new kho rieng,
    // neu tu tao thi Service va Controller lam viec tren HAI kho khac nhau
    public DoctorServices(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }
}</code></pre>
     ${sangCodeLab('lab211-j1-s-p0057-user-management-system', 'J1.S.P0057 — User management (có file user.dat, luyện tầng data)')}`),
},
{
  slug: `${TIEN_TO}controller-view`,
  titleEn: 'B.4 — controller & view: routing and printing',
  titleVi: 'B.4 — controller & view: điều hướng và hiển thị',
  desc: 'Controller không tự làm gì; View không tính gì. Và vì sao cả chương trình chỉ có một chỗ catch.',
  html: noiDung('Phần B · Bài 10.4',
    'controller & view',
    `<p class="lead">The controller does nothing itself — it gives orders. The view computes nothing — it prints.
     Keeping both that dumb is what makes the rest testable.</p>`,
    'controller & view',
    `<p class="lead">Controller <strong>không tự làm gì cả</strong> — nó ra lệnh. View <strong>không tính gì</strong>
     — nó in. Giữ cho cả hai "ngu" như vậy chính là thứ làm phần còn lại sạch sẽ.</p>

     <h3>controller — ba dòng, ba vai</h3>
     <pre><code>public void addDoctor(DoctorRequestDTO requestDTO) throws Exception {
    // 1. Kiem tra
    if (doctorRepository.isDuplicate(requestDTO.getCode())) {
        throw new Exception(Message.DUPLICATE);
    }
    // 2. Bao kho luu
    doctorRepository.addDoctor(requestDTO);
    // 3. Bao view thong bao
    doctorView.showMessage(Message.ADD_SUCCESS);
}</code></pre>

     <h3><code>throws</code> và <code>throw</code> — vì sao chỉ MỘT chỗ catch</h3>
     <ul>
       <li><code>throws Exception</code> = <em>"hàm này có thể ném lỗi, ai gọi thì phải hứng"</em>.</li>
       <li><code>throw new Exception(...)</code> = <em>"ném ngay bây giờ"</em>.</li>
     </ul>
     <p>Lỗi bay lên tận <code>Main</code>, nơi có <strong>một</strong> <code>try/catch</code> bắt và in ra. Đó là lý
     do cả chương trình chỉ có một chỗ <code>catch</code> thay vì rải
     <code>if (loi) System.out.println(...)</code> khắp nơi.</p>
     <p>Đây cũng là <strong>Trừu tượng hoá</strong>: Main gọi <code>addDoctor(dto)</code> là xong, hoàn toàn không
     biết dữ liệu nằm trong <code>HashMap</code>.</p>

     <h3>view — chỉ biết in</h3>
     <pre><code>System.out.printf("%-10s%-20s%-20s%-12s%n", "Code", "Name", "Specialization", "Availability");</code></pre>
     <ul>
       <li><code>%-10s</code> = chuỗi, chiếm 10 ô, <strong>căn trái</strong> (dấu <code>-</code>). Bỏ <code>-</code> thành căn phải.</li>
       <li><code>%n</code> = xuống dòng.</li>
       <li>Dùng <code>\\t</code> thay vì <code>printf</code> là <strong>vỡ bảng ngay khi có tên dài</strong>.</li>
     </ul>
     <p>⚠️ Bẫy độ rộng cột: để <code>%-12s</code> cho "Availability" là vừa khít 12 ký tự, không còn khoảng trắng —
     header dính liền thành <code>AvailabilityPhone</code> khi thêm cột. Nới lên <code>%-14s</code>.</p>

     <h3>Sắp xếp thì View phải nhận DANH SÁCH</h3>
     <p><code>HashMap</code> không giữ thứ tự, nên sắp xếp xong nhét lại vào <code>Map</code> là mất sạch công.
     Phải có thêm một đường hiển thị nhận <code>ArrayList</code>:</p>
     <pre><code>public void displayList(ArrayList&lt;DoctorResponseDTO&gt; danhSach) { ... }</code></pre>
     ${sangCodeLab('lab211-j1-s-p0054-develop-the-contact-management-program', 'J1.S.P0054 — Contact Management (bài số 1 của lộ trình)')}`),
},
{
  slug: `${TIEN_TO}utils-constants-main`,
  titleEn: 'B.5 — utils, constants & main: the only static, and the only Scanner',
  titleVi: 'B.5 — utils, constants & main: chỗ static duy nhất và Scanner duy nhất',
  desc: 'Ba từ khoá của class tiện ích, ba câu hỏi về static, và ba lỗi trong bản mẫu của thầy.',
  html: noiDung('Phần B · Bài 10.5',
    'utils, constants & main',
    `<p class="lead">There is exactly one place in the whole project where <code>static</code> is right, and
     exactly one place where <code>Scanner</code> may appear. Knowing why is half the oral defence.</p>`,
    'utils, constants & main',
    `<p class="lead">Trong cả project có <strong>đúng một chỗ</strong> <code>static</code> là đúng, và
     <strong>đúng một chỗ</strong> được phép có <code>Scanner</code>. Hiểu vì sao là qua được nửa phần vấn đáp.</p>

     <h3>utils/Validation.java — chỗ static DUY NHẤT</h3>
     <pre><code>public final class Validation {      // final: khong ai extends duoc
    private Validation() { }         // private ctor: khong ai new duoc
    public static String getString(String input) throws Exception { ... }
}</code></pre>
     <ul>
       <li><strong><code>final</code></strong> — class tiện ích không có gì để kế thừa.</li>
       <li><strong>constructor <code>private</code></strong> — <code>new</code> ra cũng vô nghĩa, nó chẳng giữ gì.</li>
       <li><strong><code>static</code></strong> — gọi thẳng <code>Validation.getString(...)</code> không cần đối tượng.</li>
     </ul>

     <h3>Ba câu về static — trả lời bằng chính file này</h3>
     <p><strong>"Tại sao static?"</strong> — Hàm thuần: cùng đầu vào luôn ra cùng kết quả, không đọc/ghi thuộc tính
     của đối tượng nào. Gọi từ rất nhiều nơi trong Main. Không static thì mỗi lần gọi phải tạo một đối tượng rỗng.</p>
     <p><strong>"Bỏ static thì sao?"</strong> — Không biên dịch được, vì gọi method của thể hiện qua tên class là
     sai cú pháp.</p>
     <p><strong>"Không dùng static thì sửa thế nào?"</strong> — Bỏ <code>private</code> ở constructor, trong Main
     tạo <code>Validation v = new Validation();</code>, đổi mọi lời gọi thành <code>v.getString(...)</code>.
     Chạy được, nhưng thừa một đối tượng vô nghĩa.</p>

     <h3>Vì sao Model và Controller CẤM static</h3>
     <p><code>static</code> nghĩa là <strong>cả chương trình dùng chung một bản</strong>. Nếu <code>Doctor</code> có
     <code>private static String name;</code> thì tạo 100 bác sĩ nhưng chỉ có <strong>một</strong> cái tên — bác sĩ
     sau ghi đè bác sĩ trước. Lúc đó hết hướng đối tượng.</p>

     <h3>⚠️ Ba lỗi trong bản mẫu của thầy — biết để trả lời được</h3>
     <table>
       <tr><th>Chỗ</th><th>Bản mẫu</th><th>Vấn đề</th></tr>
       <tr><td><code>getString</code></td><td><code>input.equals(null)</code></td><td>Không bao giờ đúng; <code>input</code> là <code>null</code> thì ném NullPointerException. Phải là <code>input == null</code></td></tr>
       <tr><td><code>getChoice</code></td><td>một <code>catch (Exception)</code> bọc cả hai lỗi</td><td>Nhập 9 cho menu 1–6 báo nhầm "không phải số" thay vì "ngoài khoảng"</td></tr>
       <tr><td><code>getPosititveInteger</code></td><td>sai chính tả, khai <code>float</code> mà parse <code>Integer</code></td><td>Convention bị chấm</td></tr>
     </table>
     <p>Bản mẫu còn <strong>thiếu</strong>: <code>case 3</code> (xoá) tạo DTO xong nhưng không gọi controller — bấm
     xoá không xoá gì. Bộ khung trên Code Lab đã vá cả bốn.</p>

     <h3>constants — vì sao gom hết câu chữ</h3>
     <p><code>static final</code> = hằng số: <code>static</code> để gọi <code>Message.MENU</code> không cần
     <code>new</code>, <code>final</code> để không ai gán lại. Tên viết <code>UPPER_SNAKE_CASE</code>.</p>
     <p>Gom vào một chỗ thì sửa một câu chỉ phải sửa một chỗ, và <strong>không có chuỗi lạ nào rải rác</strong>.
     Thầy thấy <code>System.out.println("Nhap ma bac si: ")</code> giữa Controller là trừ điểm ngay.</p>

     <h3>main — Scanner DUY NHẤT</h3>
     <pre><code>Scanner sc = new Scanner(System.in);   // dong nay CHI xuat hien MOT lan

while (true) {
    try {
        int choice = Validation.getChoice(sc.nextLine(), 1, 6);
        switch (choice) {
            case 1: themBacSi(sc, controller); break;
            case 6: return;                    // thoat han ham main
        }
    } catch (Exception e) {
        System.out.println(e.getMessage());    // MOT cho bat loi cho TAT CA
    }
}</code></pre>
     <p><strong><code>break</code> chỉ nhảy ra khỏi <code>switch</code>, KHÔNG thoát vòng lặp</strong> — nhầm hai
     cái này là chương trình không bao giờ tắt. Hàm <code>private static void themBacSi(...)</code> —
     <code>static</code> <strong>với hàm</strong> thì được, thầy chỉ cấm <code>static</code>
     <strong>với biến</strong> ở Main.</p>
     ${sangCodeLab(P0055, 'J1.S.P0055 — đọc Validation.java trong Starter code')}`),
},
{
  slug: `${TIEN_TO}dat-ten-convention`,
  titleEn: 'B.6 — Naming and coding convention',
  titleVi: 'B.6 — Đặt tên và coding convention',
  desc: 'Quy tắc đặt tên bốn tầng, luật Alt+Shift+F, và mức comment thầy đòi.',
  html: noiDung('Phần B · Bài 10.6',
    'Naming and convention',
    `<p class="lead">Convention is graded before correctness. "Không đảm bảo convention sẽ không review tiếp."</p>`,
    'Đặt tên và convention',
    `<p class="lead">Convention được chấm <strong>trước</strong> cả tính đúng. Slide 10 ghi:
     <em>"Đúng coding convention, không đảm bảo convention sẽ không review tiếp."</em></p>

     ${anh(`${R2H}/hd-06.png`, 'Slide 6 — Quy tắc đặt tên bốn tầng: Project · Package · Class · Method.')}

     <h3>Bốn tầng đặt tên</h3>
     <table>
       <tr><th>Tầng</th><th>Quy tắc</th><th>Ví dụ</th><th>Sai</th></tr>
       <tr><td>Project</td><td><code>RollNo_ExcerciseNo_ExcerciseDescription</code></td><td><code>HE176322_J1S0055_DoctorManagement</code></td><td><code>Lab1</code></td></tr>
       <tr><td>Package</td><td>toàn chữ thường</td><td><code>controller</code>, <code>utils</code></td><td><code>Controller</code></td></tr>
       <tr><td>Class</td><td>PascalCase, <strong>danh từ</strong></td><td><code>DoctorRepository</code></td><td><code>doctor_repo</code></td></tr>
       <tr><td>Method</td><td>camelCase, <strong>động từ</strong></td><td><code>calcSummaryFee()</code>, <code>checkValidAge()</code></td><td><code>CalcFee()</code></td></tr>
       <tr><td>Biến / field</td><td>camelCase, danh từ có nghĩa</td><td><code>doctorMap</code>, <code>tongTien</code></td><td><code>a</code>, <code>x1</code></td></tr>
       <tr><td>Hằng số</td><td>UPPER_SNAKE_CASE</td><td><code>MAX_RETRY</code>, <code>INPUT_CODE</code></td><td><code>maxRetry</code></td></tr>
     </table>
     <p>Thụt lề 4 dấu cách, dòng không quá 80 ký tự, mỗi dòng khai báo một biến (Java Code Conventions, Sun 1997).
     Trong NetBeans nhấn <strong><code>Alt + Shift + F</code></strong> là tự chuẩn hoá phần lớn.</p>

     <h3>Comment — thiếu là KHÔNG được review</h3>
     <p>Slide ghi: <em>"Có đủ comment source ít nhất cho <strong>function</strong> và
     <strong>block/rẽ nhánh</strong>. Không có comment → không review."</em></p>
     <pre><code>//Function 4: Search doctor
public void searchDoctor(String input) throws Exception {
    //Kiem tra database co du lieu truoc khi search
    if (doctorRepository.isEmpty()) {
        throw new Exception(Message.DATABASE_EMPTY);
    }
    //Truyen du lieu sang view
    doctorView.setDoctorMap(result);
}</code></pre>
     <p>Comment nói <strong>ý định</strong>, không nhại lại code. <code>// tăng i lên 1</code> cho dòng
     <code>i++</code> là vô giá trị; <code>// duyệt qua tất cả bác sĩ để tìm từ khoá</code> mới là thứ thầy muốn.</p>

     <h3>Một điểm cộng ít người để ý</h3>
     <p>Slide 6 liệt kê package <code><strong>exceptions</strong></code> — nhưng bộ khung mẫu của thầy
     <em>không</em> có nó (dùng <code>Exception</code> chung). Nghĩa là thầy chấp nhận cả hai, nhưng
     <strong>có package <code>exceptions</code> với class riêng</strong> (ví dụ <code>ValidationException</code>) là
     điểm cộng khi thầy hỏi về exception. Làm sau khi đã thuộc khung.</p>`),
},
]);

// ══════════════════════════════════════════════════════════════
// CHƯƠNG 12 — OOP, SOLID, Design Pattern theo yêu cầu thầy
// ══════════════════════════════════════════════════════════════
chuong(2,
  'Fall 2026 · C — OOP, SOLID and Design Patterns as your mentor grades them',
  'Fall 2026 · C — OOP, SOLID và Design Pattern theo cách thầy chấm',
[
{
  slug: `${TIEN_TO}oop-bon-tinh-chat`,
  titleEn: 'C.1 — The four OOP pillars, pointed at your own source',
  titleVi: 'C.1 — 4 tính chất OOP, chỉ thẳng vào source của bạn',
  desc: 'Thầy hỏi "liệt kê 4 tính chất rồi chỉ ra trong source em". Học thuộc định nghĩa là trượt.',
  html: noiDung('Phần C · Bài 11.1',
    'The four pillars',
    `<p class="lead">The mentor will not ask you to define encapsulation. He will ask you to
     <strong>point at the line</strong> in your own code where it happens.</p>`,
    'Bốn tính chất OOP',
    `<p class="lead">Thầy sẽ không hỏi "đóng gói là gì". Thầy hỏi <strong>chỉ ra dòng nào</strong> trong code của
     bạn có tính chất đó. Học thuộc định nghĩa là trượt.</p>

     <h3>1. Encapsulation — Đóng gói</h3>
     <p><em>Gói dữ liệu và hành vi vào một class, che dữ liệu, chỉ mở qua getter/setter.</em></p>
     <pre><code>public class Doctor {
    private String code;              // &lt;-- CHI VAO DAY
    private int availability;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}</code></pre>
     <p><strong>Trả lời:</strong> "Em để field <code>private</code> nên không class nào sửa thẳng được. Muốn đọc/ghi
     phải qua getter/setter. Nếu sau này cần chặn số âm, em chỉ sửa trong setter, mọi nơi gọi không phải đổi gì."</p>

     <h3>2. Abstraction — Trừu tượng hoá</h3>
     <p><em>Chỉ phơi ra <strong>cái gì làm được</strong>, giấu <strong>làm thế nào</strong>.</em></p>
     <p><strong>Trả lời:</strong> "Main gọi <code>controller.addDoctor(dto)</code> là xong. Nó không biết em lưu bằng
     <code>HashMap</code> hay file. Mai em đổi sang lưu file thì Main không phải sửa một dòng nào."</p>

     <h3>3. Inheritance — Kế thừa</h3>
     <p>Bài <code>P0055</code> mẫu <strong>chưa có</strong> kế thừa — mà slide nội quy ghi
     <em>"dùng được kế thừa, đa hình sẽ được cộng LOC"</em>. Đây là chỗ kiếm điểm.</p>
     <pre><code>public abstract class Person {
    protected String code;    // protected: class con dung duoc
    protected String name;
    public abstract String moTaVaiTro();
}

public class Doctor extends Person {
    private String specialization;
    public Doctor(String code, String name, String specialization, int availability) {
        super(code, name);    // goi constructor cha
        ...
    }
    @Override public String moTaVaiTro() { return "Bac si chuyen khoa " + specialization; }
}</code></pre>
     <p>⚠️ <strong>Chỉ thêm khi bài THẬT SỰ có hai loại đối tượng chung gốc</strong> (Doctor + Nurse, Student +
     Teacher). Bịa một class cha cho <em>một</em> class con là gượng ép — thầy hỏi "tại sao" là bí.</p>

     <h3>4. Polymorphism — Đa hình</h3>
     <p><em>Cùng một lời gọi, nhiều cách chạy tuỳ đối tượng thật.</em></p>
     <pre><code>for (Person p : danhSach) {
    System.out.println(p.moTaVaiTro());   // Java tu chon ban cua Doctor hay Nurse LUC CHAY
}</code></pre>
     <p>Còn một dạng <strong>đã có sẵn</strong> trong bài mẫu mà ít bạn để ý: <code>toString()</code> của
     <code>Doctor</code> là <strong>override</strong> phương thức của <code>Object</code>. Khi
     <code>System.out.println(doctor)</code> chạy, Java gọi bản của bạn. Đó là đa hình — chỉ ra chỗ này cũng được
     tính, không cần viết thêm gì.</p>

     <h3>Bảng tra nhanh khi thầy hỏi</h3>
     <table>
       <tr><th>Tính chất</th><th>Chỉ vào đâu</th><th>Một câu trả lời</th></tr>
       <tr><td>Encapsulation</td><td><code>Doctor</code>: field private + getter/setter</td><td>"Che dữ liệu, sửa luật chỉ sửa một chỗ"</td></tr>
       <tr><td>Abstraction</td><td><code>Controller</code>, <code>Repository</code></td><td>"Main không biết dữ liệu lưu bằng gì"</td></tr>
       <tr><td>Inheritance</td><td><code>Doctor extends Person</code></td><td>"Dùng lại phần chung, không chép code"</td></tr>
       <tr><td>Polymorphism</td><td><code>@Override toString()</code></td><td>"Cùng lời gọi, chạy đúng bản của từng loại"</td></tr>
     </table>
     ${sangCodeLab(P0055, 'J1.S.P0055 — soi 4 tính chất trong Starter code')}`),
},
{
  slug: `${TIEN_TO}access-modifier-static`,
  titleEn: 'C.2 — Access modifiers and static: where mentors reject most',
  titleVi: 'C.2 — Access modifier và static: hai chỗ bị reject nhiều nhất',
  desc: 'Bảng phạm vi, dùng cái nào ở đâu, và kiểu trả về void hay String.',
  html: noiDung('Phần C · Bài 11.2',
    'Access modifiers & static',
    `<p class="lead">Two topics the mentor rejects on most often — and both have short, exact answers.</p>`,
    'Access modifier và static',
    `<p class="lead">Hai chủ đề thầy reject nhiều nhất — và cả hai đều có câu trả lời ngắn gọn, chính xác.</p>

     ${anh(`${R2H}/hd-03.png`, 'Slide 3 — Kiến thức cần nắm: OOP · convention · Access modifier · Static. Bốn thứ này cũng chính là bốn thứ thầy hỏi.')}

     <h3>Bảng phạm vi — học thuộc</h3>
     <table>
       <tr><th>Từ khoá</th><th>Cùng class</th><th>Cùng package</th><th>Class con khác package</th><th>Mọi nơi</th></tr>
       <tr><td><code>private</code></td><td>✅</td><td>❌</td><td>❌</td><td>❌</td></tr>
       <tr><td><em>(default)</em></td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr>
       <tr><td><code>protected</code></td><td>✅</td><td>✅</td><td>✅</td><td>❌</td></tr>
       <tr><td><code>public</code></td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr>
     </table>

     <h3>Dùng cái nào trong bài LAB211</h3>
     <ul>
       <li><strong>Field của model/DTO → luôn <code>private</code>.</strong> Không ngoại lệ.</li>
       <li><strong>Getter/setter, method gọi từ package khác → <code>public</code>.</strong></li>
       <li><strong>Hàm phụ chỉ dùng trong chính class đó → <code>private</code></strong> (ví dụ
       <code>toResponse()</code> trong Repository). Để <code>public</code> là thầy hỏi "ai gọi hàm này từ ngoài?".</li>
       <li><strong><code>protected</code> chỉ khi có kế thừa thật</strong> — field của class cha cho class con dùng.</li>
     </ul>
     <p><strong>Trả lời:</strong> "Em để <code>private</code> vì ngoài class này không ai cần chạm tới nó. Cái gì cần
     lộ ra thì em mở bằng method <code>public</code>. Mở rộng hơn mức cần thiết là tự tạo chỗ để người khác phá vỡ
     đóng gói."</p>

     <h3>static — dùng ĐÚNG một chỗ</h3>
     <table>
       <tr><th>Package</th><th>Luật của thầy</th></tr>
       <tr><td><code>utils/Validation</code></td><td><strong>"phải dùng static method"</strong>, class <code>final</code>, constructor <code>private</code></td></tr>
       <tr><td><code>main/Main</code></td><td><strong>"cấm static với biến, có thể dùng với hàm"</strong></td></tr>
       <tr><td><code>controller</code></td><td><strong>"không static"</strong></td></tr>
       <tr><td><code>model</code></td><td><strong>"không được dùng static"</strong></td></tr>
     </table>
     <p>Ba câu hỏi và đáp án đầy đủ ở bài <strong>10.5</strong>.</p>

     <h3>Kiểu trả về — câu hỏi thứ ba</h3>
     <ul>
       <li><code>void</code> — hàm <strong>làm một việc</strong>, không có kết quả cần trả: <code>addDoctor()</code>,
       <code>display()</code>. Lỗi thì <strong>ném exception</strong>, không trả mã lỗi.</li>
       <li><code>boolean</code> — hàm <strong>hỏi một câu có/không</strong>: <code>isDuplicate()</code>,
       <code>isEmpty()</code>. Đặt tên bắt đầu bằng <code>is</code>/<code>has</code>.</li>
       <li><code>String</code> — hàm <strong>tạo chuỗi cho nơi khác dùng</strong>: <code>toString()</code>.
       Chú ý nó <em>trả về</em> chuỗi chứ <strong>không in</strong>, vì Model cấm in.</li>
       <li><code>Map</code>/<code>ArrayList</code> — hàm <strong>trả về tập kết quả</strong>: <code>searchDoctor()</code>.</li>
     </ul>`),
},
{
  slug: `${TIEN_TO}solid`,
  titleEn: 'C.3 — SOLID in Java (the slides are in C#)',
  titleVi: 'C.3 — SOLID bằng Java (slide của thầy viết bằng C#)',
  desc: 'Năm nguyên lý, ví dụ Java trong ngữ cảnh quản lý bác sĩ, và nên implement mấy cái.',
  html: noiDung('Phần C · Bài 11.3',
    'SOLID, translated to Java',
    `<p class="lead">Your mentor's SOLID deck is written in C#. You cannot copy from it. Here are the same five
     principles in Java, inside the doctor-management context.</p>`,
    'SOLID bằng Java',
    `<p class="lead">⚠️ Bộ slide SOLID của thầy viết bằng <strong>C#</strong> (<code>public string Name { get; set; }</code>,
     <code>Console.WriteLine</code>). Bạn không chép thẳng được. Dưới đây là năm nguyên lý bằng <strong>Java</strong>,
     đặt trong chính ngữ cảnh quản lý bác sĩ.</p>
     <p>Nhớ: slide nội quy ghi <em>"Implement và hiểu SOLID được cộng LOC"</em>. Đây là tiền.</p>

     ${anh(`${R2S}/sol-03.png`, 'Slide 3 — Năm nguyên lý SOLID.')}

     <h3>S — Single Responsibility</h3>
     <p><em>Mỗi class chỉ có MỘT lý do để thay đổi.</em> Đây là nguyên lý bạn <strong>đã tuân thủ</strong> nếu làm
     đúng kiến trúc 8 package — và là điều slide 7 của thầy nhấn mạnh riêng.</p>
     ${anh(`${R2S}/sol-05.png`, 'Slide 5 — SRP: một class ôm bốn trách nhiệm thì có bốn lý do phải sửa.')}
     <pre><code>// ❌ Vi pham: mot class om het
public class DoctorManager {
    public void themBacSi() { }      // nghiep vu
    public void luuFile() { }        // luu tru
    public void inDanhSach() { }     // hien thi
    public boolean kiemTraTen() { }  // kiem tra du lieu
}

// ✅ Dung SRP — chinh la cau truc 8 package
// model/Doctor            -> chi giu du lieu mot bac si
// repository/DoctorRepo   -> chi luu tru + CRUD
// view/DoctorView         -> chi hien thi
// utils/Validation        -> chi kiem tra du lieu</code></pre>
     <p><strong>Trả lời:</strong> "Em tách theo SRP: <code>Doctor</code> chỉ có một lý do để đổi là khi thông tin bác
     sĩ đổi. <code>DoctorView</code> chỉ đổi khi cách hiển thị đổi. Hai thứ độc lập nên em không để chung."</p>

     <h3>O — Open/Closed</h3>
     ${anh(`${R2S}/sol-09.png`, 'Slide 9 — OCP: mở rộng bằng cách THÊM lớp mới, không mở lớp cũ ra sửa.')}
     <pre><code>// ✅ Dinh nghia hop dong, moi kieu tim la mot class rieng
public interface TieuChiTimKiem {
    boolean khop(Doctor doctor, String tuKhoa);
}
public class TimTheoTen implements TieuChiTimKiem {
    @Override public boolean khop(Doctor d, String tu) { return d.getName().contains(tu); }
}
// Repository khong bao gio phai sua nua — them kieu tim = them class moi</code></pre>

     <h3>L — Liskov Substitution</h3>
     ${anh(`${R2S}/sol-13.png`, 'Slide 13 — LSP: class con phải thay được class cha mà chương trình vẫn đúng.')}
     <pre><code>// ❌ Vi pham: HinhVuong buoc rong = cao nen phai pha hop dong cua cha
public class HinhVuong extends HinhChuNhat {
    @Override public void setRong(double r) { this.rong = this.cao = r; }
}
// Doan nay DUNG voi HinhChuNhat nhung SAI voi HinhVuong:
h.setRong(5); h.setCao(10);   // mong doi 50, HinhVuong tra ve 100

// ✅ Dung interface chung thay vi extends
public interface Hinh { double dienTich(); }</code></pre>
     <p><strong>Quy tắc rút ra:</strong> "là một" trong đời thực <strong>không</strong> đủ để dùng
     <code>extends</code>. Chỉ kế thừa khi class con <em>giữ nguyên được mọi lời hứa</em> của class cha.</p>

     <h3>I — Interface Segregation</h3>
     ${anh(`${R2S}/sol-17.png`, 'Slide 17 — ISP: đừng ép client cài method nó không dùng.')}
     <pre><code>// ✅ Tach nho theo nhu cau that
public interface KhoCoBan { void them(Doctor d); void xoa(String code); }
public interface KhoCoFile { void docFile(String duong); void ghiFile(String duong); }

public class DoctorRepository implements KhoCoBan { ... }              // P0055
public class UserRepository   implements KhoCoBan, KhoCoFile { ... }   // P0057 co user.dat</code></pre>

     <h3>D — Dependency Inversion</h3>
     ${anh(`${R2S}/sol-21.png`, 'Slide 21 — DIP: cả module cấp cao lẫn cấp thấp đều phụ thuộc vào abstraction.')}
     <pre><code>// ✅ Khai theo interface, nhan tu ngoai vao (Dependency Injection)
public class DoctorController {
    private final IDoctorRepository repo;
    public DoctorController(IDoctorRepository repo) { this.repo = repo; }
}
// Doi cach luu chi la doi MOT dong trong Main
new DoctorController(new DoctorMemoryRepository());</code></pre>

     <h3>Nên implement mấy nguyên lý?</h3>
     <p><strong>Đừng nhồi cả 5 vào một bài nhỏ.</strong> Thầy nói bài Candidate <em>"cần implement đầy đủ SOLID →
     rất khó, không nên liều"</em> — nghĩa là đủ 5 là việc lớn.</p>
     <ul>
       <li><strong>SRP</strong> — miễn phí, đã có nhờ kiến trúc 8 package. Luôn nói được.</li>
       <li><strong>DIP</strong> — rẻ nhất để thêm: một interface cho Repository + constructor injection. ~15 LOC.</li>
       <li><strong>OCP</strong> — thêm khi bài có "nhiều kiểu" gì đó (nhiều cách tìm, nhiều cách sắp xếp).</li>
       <li><strong>LSP, ISP</strong> — chỉ khi bài thật sự có kế thừa / nhiều loại kho. <strong>Đừng bịa.</strong></li>
     </ul>`),
},
{
  slug: `${TIEN_TO}design-pattern`,
  titleEn: 'C.4 — Design Patterns: the five your mentor actually teaches',
  titleVi: 'C.4 — Design Pattern: 5 mẫu thầy thật sự dạy',
  desc: 'Không phải 23 mẫu GoF. Sách của thầy chốt đúng 5, và đây là chỗ thầy đánh giá cao nhất.',
  html: noiDung('Phần C · Bài 11.4',
    'Five patterns, not twenty-three',
    `<p class="lead">The 89-slide deck is a catalogue. The mentor's own book picks exactly five: Builder,
     Singleton, Factory Method, Observer, Strategy. That is your scope.</p>`,
    'Năm mẫu, không phải hai ba',
    `<p class="lead">Bộ slide <strong>89 trang, đủ 23 pattern GoF</strong> — đó là <em>từ điển tra cứu</em>.
     Còn <strong>sách <code>OOP_Java_Guide</code> của thầy chỉ chọn 5</strong>: Builder, Singleton, Factory Method,
     Observer, Strategy. <strong>Năm cái đó là phạm vi bạn phải thành thạo.</strong></p>
     <p>Thầy đánh giá cao nhất phần này — ai hiểu và áp dụng thành thạo thì pass sớm.</p>

     ${anh(`${R2S}/dp-08.png`, 'Slide 8 — Ba nhóm pattern: Creational, Structural, Behavioral.')}

     <h3>Bốn thành phần của một pattern — chính là 4 câu thầy hỏi</h3>
     <table>
       <tr><th>Thành phần</th><th>Câu hỏi tương ứng</th></tr>
       <tr><td><strong>Name</strong></td><td>"Em dùng pattern gì?"</td></tr>
       <tr><td><strong>Problem</strong></td><td>"Nó giải quyết vấn đề gì trong bài của em?"</td></tr>
       <tr><td><strong>Solution</strong></td><td>"Chỉ cho thầy class nào đóng vai gì"</td></tr>
       <tr><td><strong>Consequences</strong></td><td>"Không dùng nó thì sao?"</td></tr>
     </table>
     <p>Học pattern mà chỉ nhớ <em>Name</em> và <em>Solution</em> là học vẹt. <strong>Problem và Consequences mới
     phân biệt người hiểu với người chép.</strong></p>

     <h3>① Singleton — chỉ một thể hiện duy nhất</h3>
     ${anh(`${R2S}/dp-26.png`, 'Slide 26 — Singleton: nhiều máy in nhưng chỉ MỘT hàng đợi in.')}
     ${anh(`${R2S}/dp-27.png`, 'Slide 27 — Lời giải: Instance() là cửa duy nhất, uniqueInstance là bản duy nhất.')}
     <pre><code>public class DoctorRepository {
    private static DoctorRepository instance;      // ban duy nhat
    private Map&lt;String, Doctor&gt; doctorMap = new HashMap&lt;&gt;();

    private DoctorRepository() { }                 // chan "new" tu ben ngoai

    public static DoctorRepository getInstance() { // cua DUY NHAT
        if (instance == null) instance = new DoctorRepository();
        return instance;
    }
}</code></pre>
     <p>💡 Để ý trong slide: <code>Instance()</code> và <code>uniqueInstance</code> là <code>static</code>, còn
     <code>SingletonOperation()</code> thì <strong>không</strong>. Đó chính là câu trả lời cho "tại sao chỗ này
     static, chỗ kia không" — chỉ <em>cửa vào</em> và <em>bản duy nhất</em> mới static.</p>
     <p><strong>Bẫy khi thầy vặn "Singleton có phải lúc nào cũng tốt không?"</strong> — trả lời trung thực:
     <em>"Không ạ. Nó tiện nhưng làm class phụ thuộc cứng vào nhau và khó test. Bài này em dùng vì kho dữ liệu chỉ
     có một và chương trình chạy một luồng. Cần thay kho để kiểm thử thì em chuyển sang tiêm qua constructor
     (DIP)."</em></p>

     <h3>② Factory Method — nơi khác quyết định tạo loại nào</h3>
     ${anh(`${R2S}/dp-29.png`, 'Slide 29 — Factory Method: biết LÚC NÀO cần tạo, không biết tạo LOẠI nào.')}
     ${anh(`${R2S}/dp-30.png`, 'Slide 30 — Creator khai báo factory method, ConcreteCreator quyết định ConcreteProduct.')}
     <pre><code>public final class NhanSuFactory {
    private NhanSuFactory() { }
    // Noi DUY NHAT biet "loai nao thi new class nao"
    public static Person taoNhanSu(String loai, NhanSuRequestDTO dto) throws Exception {
        switch (loai.toUpperCase()) {
            case "DOCTOR": return new Doctor(...);
            case "NURSE":  return new Nurse(...);
            default: throw new Exception(Message.INVALID_CHOICE);
        }
    }
}</code></pre>
     <p>Dùng khi bài có <strong>nhiều loại đối tượng cùng gốc</strong> (Car showroom: xe máy / ô tô). Bài chỉ có
     <em>một</em> loại thì Factory là thừa — thầy hỏi "tại sao cần?" mà bạn không có câu trả lời.</p>

     <h3>③ Builder — dựng đối tượng nhiều thuộc tính</h3>
     ${anh(`${R2S}/dp-22.png`, 'Slide 22 — Builder: tách việc DỰNG khỏi cách biểu diễn.')}
     ${anh(`${R2S}/dp-24.png`, 'Slide 24 — Director điều khiển, ConcreteBuilder lắp từng phần, Product là thành phẩm.')}
     <pre><code>Doctor d = new Doctor.Builder()
        .code("D01").name("Nguyen Van An")
        .specialization("Tim mach").availability(5)
        .build();          // build() la cho kiem tra lan cuoi</code></pre>
     <p><strong>Bài dưới 4 thuộc tính thì Builder là gượng ép</strong>, đừng dùng.</p>

     <h3>④ Strategy — đổi thuật toán lúc chạy ⭐ hợp LAB211 nhất</h3>
     ${anh(`${R2S}/dp-80.png`, 'Slide 80 — Thuật toán nhúng cứng vào class dùng nó, muốn đổi phải sửa chính nó.')}
     ${anh(`${R2S}/dp-81.png`, 'Slide 81 — Mỗi thuật toán tách thành class riêng, Context giữ tham chiếu tới interface.')}
     <pre><code>public interface ChienLuocSapXep { void sapXep(ArrayList&lt;Doctor&gt; ds); }

public class SapXepTheoTen implements ChienLuocSapXep {
    @Override public void sapXep(ArrayList&lt;Doctor&gt; ds) {
        Collections.sort(ds, Comparator.comparing(Doctor::getName, String.CASE_INSENSITIVE_ORDER));
    }
}
// Trong Main — menu "Sap xep theo: 1. Ten  2. So ca truc"
services.datChienLuoc(new SapXepTheoTen());</code></pre>
     <p>Gần như bài quản lý nào cũng có "sắp xếp theo…" ⇒ đây là pattern <strong>tự nhiên nhất</strong> để dùng.</p>
     <p><strong>Trả lời:</strong> "Nếu viết <code>if/else</code> trong Service thì mỗi lần thêm kiểu sắp xếp em phải
     mở Service ra sửa — vi phạm OCP. Với Strategy, thêm kiểu mới chỉ là thêm một class, Service đứng yên."</p>

     <h3>⑤ Observer — một chỗ đổi, nhiều chỗ tự biết</h3>
     ${anh(`${R2S}/dp-66.png`, 'Slide 66 — Subject giữ danh sách Observer; gọi Notify() thì mọi Observer tự Update().')}
     <pre><code>public interface DoctorObserver { void capNhat(String hanhDong, Doctor doctor); }

public class DoctorRepository {
    private ArrayList&lt;DoctorObserver&gt; observers = new ArrayList&lt;&gt;();
    public void dangKy(DoctorObserver o) { observers.add(o); }
    private void baoTin(String hd, Doctor d) { for (DoctorObserver o : observers) o.capNhat(hd, d); }

    public boolean addDoctor(Doctor doctor) {
        doctorMap.put(doctor.getCode(), doctor);
        baoTin("THEM", doctor);        // them xong thi bao
        return true;
    }
}</code></pre>
     <p>Trong console ít tự nhiên hơn 4 cái trên, nhưng hợp lý ở chỗ <strong>ghi log / đếm số lượng</strong> mỗi khi
     dữ liệu đổi.</p>

     <h3>SOLID và Pattern liên quan thế nào</h3>
     ${anh(`${R2S}/sol-25.png`, 'Slide 25 — "SOLID Principles are NOT Design Patterns": nguyên lý là kim chỉ nam, pattern là lời giải cụ thể.')}
     <table>
       <tr><th>Pattern</th><th>Hiện thực nguyên lý</th></tr>
       <tr><td>Strategy</td><td>OCP — thêm thuật toán = thêm class</td></tr>
       <tr><td>Factory Method</td><td>OCP + DIP — nơi gọi không cần biết class cụ thể</td></tr>
       <tr><td>Observer</td><td>OCP + SRP — mỗi observer một trách nhiệm</td></tr>
       <tr><td>Builder</td><td>SRP — tách việc "dựng" khỏi bản thân đối tượng</td></tr>
     </table>
     <p><strong>Câu trả lời ăn điểm:</strong> <em>"Em dùng Strategy ở đây không phải vì nó là pattern, mà vì em cần
     tuân thủ OCP: menu sắp xếp còn thêm lựa chọn nữa, em không muốn mỗi lần thêm là phải mở Service ra sửa."</em></p>

     <h3>⚠️ Anti-pattern — nhét bừa còn tệ hơn không dùng</h3>
     <p>Slide 7 cảnh báo: <em>"Patterns can be overused and abused → Anti-Patterns"</em>. Thầy hỏi
     <strong>"tại sao dùng"</strong> chứ không hỏi <strong>"có dùng không"</strong>.</p>
     <p>Trước khi thêm một pattern, trả lời được <strong>cả ba</strong> câu thì hãy dùng:</p>
     <ol>
       <li>Vấn đề cụ thể trong <em>bài này</em> mà nó giải là gì?</li>
       <li>Nếu KHÔNG dùng thì code xấu ở chỗ nào?</li>
       <li>Nó khiến bài dài thêm bao nhiêu, có đáng không?</li>
     </ol>

     <h3>Pattern nào cho bài nào</h3>
     <table>
       <tr><th>Bài</th><th>Pattern tự nhiên nhất</th></tr>
       <tr><td><code>P0055</code> Doctor · <code>P0054</code> Contact · <code>P0056</code> Worker</td><td>Singleton (kho) + Strategy (sắp xếp)</td></tr>
       <tr><td><code>P0057</code> User (có user.dat)</td><td>Singleton + Strategy + DIP (interface kho)</td></tr>
       <tr><td><code>P0066</code> Car showroom</td><td>Factory Method (nhiều loại xe)</td></tr>
       <tr><td><code>P0073</code> Handy Expense</td><td>Strategy + Observer (cảnh báo vượt hạn mức)</td></tr>
       <tr><td><code>P0071</code> Task management</td><td>Strategy + Observer + Builder</td></tr>
     </table>
     <p><strong>Bài đầu chỉ làm Singleton + Strategy cho chắc tay.</strong> Hiểu sâu 2 cái còn hơn kể tên 5 cái.</p>
     ${sangCodeLab('lab211-j1-s-p0066-car-showroom', 'J1.S.P0066 — Car showroom (chỗ Factory Method tự nhiên nhất)')}`),
},
{
  slug: `${TIEN_TO}quan-he-class`,
  titleEn: 'C.5 — Class relationships and static modeling',
  titleVi: 'C.5 — Quan hệ giữa các class và mô hình tĩnh',
  desc: 'Sáu loại quan hệ UML, multiplicity, và cách phân biệt Aggregation với Composition.',
  html: noiDung('Phần C · Bài 11.5',
    'Class relationships',
    `<p class="lead">This is what you use to <em>design the model before you type</em> — exactly what the mentor
     means by "code model first".</p>`,
    'Quan hệ giữa các class',
    `<p class="lead">Đây là thứ dùng để <strong>thiết kế model TRƯỚC khi gõ code</strong> — đúng cái thầy nhắc
     "code model trước rồi đến data".</p>

     ${anh(`${R2S}/ch7-05.png`, 'Chapter 7, slide 5 — Sáu loại quan hệ giữa các class.')}

     <table>
       <tr><th>Quan hệ</th><th>Nghĩa</th><th>Trong Java</th><th>Ví dụ ở bài</th></tr>
       <tr><td><strong>Association</strong></td><td>"biết đến nhau"</td><td>Giữ tham chiếu</td><td><code>Controller</code> giữ <code>Repository</code></td></tr>
       <tr><td><strong>Inheritance</strong></td><td>"là một"</td><td><code>extends</code></td><td><code>Doctor extends Person</code></td></tr>
       <tr><td><strong>Realization</strong></td><td>"cam kết làm được"</td><td><code>implements</code></td><td><code>SapXepTheoTen implements ChienLuocSapXep</code></td></tr>
       <tr><td><strong>Dependency</strong></td><td>"dùng tạm một lúc"</td><td>Tham số / biến cục bộ</td><td><code>addDoctor(DoctorRequestDTO dto)</code></td></tr>
       <tr><td><strong>Aggregation</strong></td><td>"có, nhưng rời được"</td><td>Tham chiếu, sống độc lập</td><td>Khoa <em>có</em> Bác sĩ — xoá khoa, bác sĩ vẫn còn</td></tr>
       <tr><td><strong>Composition</strong></td><td>"có, và chết cùng nhau"</td><td>Tạo bên trong</td><td>Hoá đơn <em>có</em> dòng hoá đơn</td></tr>
     </table>

     ${anh(`${R2S}/ch7-18.png`, 'Chapter 7, slide 18 — Hình thoi ĐẶC = composition (chết cùng nhau), hình thoi RỖNG = aggregation (rời được).')}

     <h3>Cách phân biệt Aggregation với Composition</h3>
     <p>Hỏi một câu: <em>"xoá cái chứa thì cái bị chứa còn sống không?"</em> Còn sống → <strong>Aggregation</strong>.
     Chết theo → <strong>Composition</strong>.</p>

     ${anh(`${R2S}/ch7-07.png`, 'Chapter 7, slide 7 — Năm dạng multiplicity.')}
     <h3>Multiplicity quyết định kiểu dữ liệu bạn khai</h3>
     <ul>
       <li>một–một → một tham chiếu: <code>private Khoa khoa;</code></li>
       <li>một–nhiều → tập hợp: <code>private ArrayList&lt;Doctor&gt; danhSachBacSi;</code></li>
       <li>tuỳ chọn (0..1) → tham chiếu có thể <code>null</code>, <strong>phải kiểm tra trước khi dùng</strong></li>
     </ul>`),
},
{
  slug: `${TIEN_TO}12-cau-review`,
  titleEn: 'C.6 — The 12 review questions, with model answers',
  titleVi: 'C.6 — 12 câu hỏi review kèm đáp án mẫu',
  desc: 'Ôn ngay trước khi giơ tay xin review. Trả lời bằng cách chỉ vào source, không nói lý thuyết suông.',
  html: noiDung('Phần C · Bài 11.6',
    'The oral defence',
    `<p class="lead">Answer by pointing at your own code. Reciting definitions is how people fail this part.</p>`,
    '12 câu hỏi review',
    `<p class="lead">Danh sách lấy nguyên văn từ slide 10. Trả lời bằng cách <strong>chỉ vào dòng code của mình</strong>,
     không nói lý thuyết suông.</p>

     <h3>Bộ câu hỏi</h3>
     <p><strong>1. Liệt kê 4 tính chất OOP, chỉ ra trong source em cái nào ở đâu?</strong><br/>
     → Encapsulation: field <code>private</code> + getter/setter trong <code>Doctor</code>. Abstraction:
     <code>Controller</code> giấu chuyện dữ liệu nằm trong <code>HashMap</code>. Inheritance:
     <code>Doctor extends Person</code>. Polymorphism: <code>@Override toString()</code>.</p>

     <p><strong>2. <code>public</code>, <code>private</code>, <code>protected</code>, <code>default</code> khác nhau
     thế nào?</strong><br/>
     → <code>private</code>: chỉ trong class. <code>default</code>: thêm cùng package. <code>protected</code>: thêm
     class con khác package. <code>public</code>: mọi nơi.</p>

     <p><strong>3. Tại sao field này em để <code>private</code>?</strong><br/>
     → Vì ngoài class không ai cần chạm thẳng. Mở qua getter/setter để sau này thêm kiểm tra chỉ sửa một chỗ.</p>

     <p><strong>4. Tại sao <code>Validation</code> dùng <code>static</code>?</strong><br/>
     → Hàm thuần, không phụ thuộc trạng thái đối tượng, gọi từ nhiều nơi. Không static thì phải
     <code>new Validation()</code> — tạo đối tượng rỗng vô nghĩa.</p>

     <p><strong>5. Bỏ <code>static</code> đi thì sao?</strong><br/>
     → Không biên dịch được ở mọi chỗ gọi <code>Validation.getString(...)</code>.</p>

     <p><strong>6. Không dùng <code>static</code> thì sửa source thế nào cho chạy?</strong><br/>
     → Bỏ <code>private</code> ở constructor, tạo <code>Validation v = new Validation();</code> trong Main, đổi mọi
     lời gọi thành <code>v.getString(...)</code>.</p>

     <p><strong>7. Tại sao method này trả về <code>void</code>, method kia trả về <code>String</code>?</strong><br/>
     → <code>void</code> khi hàm chỉ làm việc, lỗi thì ném exception. <code>String</code> khi cần trả chuỗi cho nơi
     khác dùng — như <code>toString()</code>, vì Model cấm in.</p>

     <p><strong>8. Tại sao dùng <code>ArrayList</code> mà không phải <code>List</code>? (hoặc ngược lại)</strong><br/>
     → <code>List</code> là <strong>giao diện</strong> — hợp đồng nói "có <code>add</code>, <code>get</code>,
     <code>size</code>". <code>ArrayList</code> là <strong>bản cài đặt</strong> bằng mảng động: lấy theo chỉ số rất
     nhanh, chèn/xoá giữa thì chậm. <code>LinkedList</code> cài cùng hợp đồng bằng danh sách liên kết, ngược lại.
     Tương tự <code>Map</code> là hợp đồng, <code>HashMap</code> cài bằng băm nên <strong>không giữ thứ tự</strong>,
     <code>LinkedHashMap</code> giữ thứ tự thêm vào, <code>TreeMap</code> sắp theo khoá.</p>

     <p><strong>9. Tại sao ở đây em dùng <code>HashMap</code> chứ không phải <code>ArrayList</code>?</strong><br/>
     → Vì tìm theo mã bác sĩ là thao tác chính. <code>HashMap</code> tra theo khoá gần như tức thì, còn
     <code>ArrayList</code> phải duyệt từ đầu. Và khoá là duy nhất nên chặn trùng mã luôn.</p>

     <p><strong>10. Em dùng Design Pattern gì, nó giải quyết vấn đề gì?</strong><br/>
     → Nêu <strong>tên</strong> → <strong>vấn đề trong bài này</strong> → <strong>class nào đóng vai gì</strong> →
     <strong>không dùng thì code xấu ra sao</strong>. Đủ bốn ý là đạt.</p>

     <p><strong>11. Em implement nguyên lý SOLID nào?</strong><br/>
     → SRP luôn có sẵn nhờ cấu trúc 8 package. Nói thêm một nguyên lý bạn <em>thật sự</em> làm (thường là DIP hoặc
     OCP), và chỉ đúng chỗ.</p>

     <p><strong>12. Debug cho thầy xem.</strong><br/>
     → Breakpoint <strong>Ctrl + F8</strong>, chạy <strong>Ctrl + F5</strong>, bước qua <strong>F8</strong>, bước vào
     trong <strong>F7</strong>. Tập trước ở nhà: đặt breakpoint tại <code>addDoctor</code> và xem <code>dto</code>
     mang giá trị gì.</p>

     <h3>Checklist tự soát trước khi xin review</h3>
     <ul>
       <li>☐ Đủ 8 package, đặt tên đúng</li>
       <li>☐ <code>Scanner</code> chỉ có trong <code>Main.java</code></li>
       <li>☐ <code>System.out</code> chỉ có trong <code>View</code> và <code>Main</code></li>
       <li>☐ Mọi field là <code>private</code></li>
       <li>☐ <code>static</code> chỉ có ở <code>utils/Validation</code></li>
       <li>☐ Không câu chữ nào hardcode ngoài <code>constants/Message</code></li>
       <li>☐ Mỗi function và mỗi vòng lặp/rẽ nhánh có một dòng <code>//</code></li>
       <li>☐ Đã nhấn <strong>Alt + Shift + F</strong></li>
       <li>☐ Đã chạy thử <strong>hết</strong> happy case và <strong>hết</strong> message lỗi</li>
       <li>☐ Đặt được breakpoint và debug được</li>
       <li>☐ Trả lời được 12 câu ở trên</li>
     </ul>
     ${sangCodeLab(P0055, 'J1.S.P0055 — mở Starter code ra và tự hỏi 12 câu này')}`),
},
]);

// ══════════════════════════════════════════════════════════════
// GHI VÀO DB
// ══════════════════════════════════════════════════════════════
const HD = 'lab211-hd-';   // chương "Hướng dẫn của thầy" — luôn đứng đầu

const khoa = await prisma.course.findUnique({
  where: { id: COURSE_ID }, select: { id: true, title: true, courseCode: true },
});
if (!khoa) { console.error(`Không tìm thấy khoá id ${COURSE_ID}`); process.exit(1); }

const cuSecs = await prisma.courseSection.findMany({
  where: { courseId: COURSE_ID },
  select: { id: true, title: true, sortOrder: true, lessons: { select: { slug: true } } },
  orderBy: { sortOrder: 'asc' },
});
const co = (s, tt) => s.lessons.some((l) => (l.slug || '').startsWith(tt));
const cuaToi = cuSecs.filter((s) => co(s, TIEN_TO));

console.log(`Khoá: ${khoa.title} (${khoa.courseCode}) — ${cuSecs.length} chương`);
console.log(`Chương do script này tạo trước đó: ${cuaToi.length}`);
console.log(`Sẽ tạo ${CHUONG.length} chương · ${CHUONG.reduce((a, c) => a + c.baiHoc.length, 0)} bài:\n`);
for (const c of CHUONG) {
  console.log(`  [${c.sortOrder}] ${c.title.split('|||')[1]}`);
  for (const b of c.baiHoc) console.log(`        ${b.titleVi}  (${b.html.length.toLocaleString('vi-VN')} ký tự)`);
}

if (!APPLY) {
  console.log('\n(thử khô — thêm --apply để ghi thật)');
} else {
  for (const s of cuaToi) await prisma.courseSection.delete({ where: { id: s.id } });
  if (cuaToi.length) console.log(`\nĐã xoá ${cuaToi.length} chương cũ của script.`);

  const moi = [];
  for (const c of CHUONG) {
    const sec = await prisma.courseSection.create({
      data: { courseId: COURSE_ID, title: c.title, sortOrder: c.sortOrder, isLocked: false },
    });
    for (let i = 0; i < c.baiHoc.length; i++) {
      const b = c.baiHoc[i];
      await prisma.lesson.create({
        data: { sectionId: sec.id, title: `${b.titleEn}|||${b.titleVi}`, slug: b.slug,
                description: b.desc, content: b.html, lessonType: 'VIDEO',
                sortOrder: i, isPublished: true, isFreePreview: true },
      });
    }
    moi.push(sec.id);
    console.log(`  ✓ [${c.sortOrder}] ${c.title.split('|||')[1]} — ${c.baiHoc.length} bài`);
  }

  // Xếp lại TOÀN BỘ: hướng dẫn = 0, hai chương mới = 1,2, còn lại 3..n giữ thứ tự cũ.
  const tatCa = await prisma.courseSection.findMany({
    where: { courseId: COURSE_ID },
    select: { id: true, sortOrder: true, lessons: { select: { slug: true } } },
    orderBy: { sortOrder: 'asc' },
  });
  const huongDan = tatCa.filter((s) => co(s, HD));
  const conLai = tatCa.filter((s) => !co(s, HD) && !moi.includes(s.id));
  let n = 0;
  for (const s of [...huongDan, ...moi.map((id) => ({ id })), ...conLai]) {
    await prisma.courseSection.update({ where: { id: s.id }, data: { sortOrder: n++ } });
  }
  console.log(`  ✓ Xếp lại ${n} chương: hướng dẫn → 0, hai chương mới → 1–2, còn lại → 3..${n - 1}`);
  console.log('\n✅ Xong.');
}
await prisma.$disconnect();
