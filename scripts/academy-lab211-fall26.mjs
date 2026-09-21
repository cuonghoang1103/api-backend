/**
 * academy-lab211-fall26.mjs — bổ sung 2 chương "Fall 2026" vào khoá Academy
 * LAB211 (course id 18, "OOP with Java Lab").
 *
 * Vì sao cần: khoá Academy đã có 10 chương dạy Java/LAB211 nói chung, nhưng
 * KHÔNG có yêu cầu riêng của giảng viên Fall 2026 (kiến trúc 9 package, bảng
 * câu review, nội quy USB LAB…). Code Lab đã có phần đó ở dạng bài giảng dài
 * một mạch; Academy chia nhỏ thành chương/bài để học từng buổi, sâu hơn, và
 * mỗi bài dẫn thẳng sang bài tập tương ứng trên Code Lab.
 *
 * Chạy lại được: xoá đúng 3 chương do script này tạo (nhận theo slug tiền tố
 * `lab211-f26-`) rồi tạo lại, không đụng 10 chương cũ.
 *
 *   node scripts/academy-lab211-fall26.mjs           # thử khô
 *   node scripts/academy-lab211-fall26.mjs --apply
 *
 * ⚠️ (22/09/2026) Nội dung 2 chương đã sửa theo tờ checklist giấy của thầy. --apply XOÁ chương rồi
 * TẠO LẠI → bài mang id mới → MẤT tiến độ học; chỉ đổi nội dung thì cập nhật TẠI CHỖ theo slug
 * (title/description/content + tiêu đề chương), như lượt 22/09 đã làm.
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
// CHƯƠNG 11 — Kiến trúc 9 package
// ══════════════════════════════════════════════════════════════
const P0055 = 'lab211-j1-s-p0055-doctor-management-program';

chuong(1,
  "Fall 2026 · B — Your mentor's 9-package architecture",
  'Fall 2026 · B — Kiến trúc 9 package của thầy',
[
{
  slug: `${TIEN_TO}kien-truc-tong-quan`,
  titleEn: 'B.1 — The MVC-of-JSP layout and one-way data flow',
  titleVi: 'B.1 — Bố cục MVC kiểu JSP và luồng dữ liệu một chiều',
  desc: 'Chín package, ai được làm gì, bốn luật MVC của tờ checklist, và vì sao Model với View không bao giờ nói chuyện.',
  html: noiDung('Phần B · Bài 10.1',
    'Nine packages, one direction',
    `<p class="lead">Your mentor calls it "MVC of JSP": the same layering as a Java web app, only the shell
     changes. In web, View is a JSP page and Controller is a Servlet. In a console app, View is the class that
     prints and Controller is the class that routes. <strong>Same structure.</strong></p>
     <p>Nine packages: <code>constants · model · dto · repository · service · controller · view · utils ·
     main</code>. The repository is <strong>mandatory</strong> in every lab; a service is added when the brief
     has business calculations. The check sheet (item 1.1) adds the rules people forget: Main calls the
     controller <strong>once per menu option</strong>; the controller never imports, receives or returns a Model;
     the view receives its data <strong>through a field</strong> (<code>setResponseDTO(...)</code>) and
     <code>display()</code> takes no parameter, rendering <strong>once per flow</strong>; keyboard input,
     validation, file reading and encryption all happen in Main.</p>`,
    'Chín package, một chiều',
    `<p class="lead">Thầy gọi là <strong>"MVC của JSP"</strong>: cùng một mô hình với web Java, chỉ đổi lớp vỏ.
     Trong web, View là trang JSP và Controller là Servlet. Trong bài console, View là class chỉ lo in, Controller
     là class nhận lệnh rồi điều hướng. <strong>Cấu trúc y hệt nhau.</strong></p>

     <h3>Luồng dữ liệu — một chiều, không đi tắt</h3>
     <pre><code>Main ──RequestDTO──▶ Controller ──▶ Service ──▶ Repository ──▶ Model
  │   (1 lần/case)       │   (bài không có tính toán: Controller ──▶ Repository)
  │                      │
  │                      └──ResponseDTO──▶ View ──▶ màn hình
  │                        (setResponseDTO + display(), 1 lần/luồng)
  │
  └──▶ Validation, FileUtils (static — chỉ Main gọi)

Model  ✕  View        ← KHÔNG BAO GIỜ nói chuyện trực tiếp</code></pre>

     <p>Tờ checklist 1.1 ghi: <em>"Model chỉ làm nhiệm vụ miêu tả thực thể, không làm việc với View"</em>, và
     Guide dặn: <em>"Cần output gì thì thêm hàm toString() để trả lại repository -&gt; controller sẽ nhận kết
     quả và truyền vào view"</em>. Model muốn hiện ra màn hình thì viết <code>toString()</code>, trả ngược về
     Repository → Controller → View. Không có đường tắt.</p>

     <h3>Bảng: 9 package — mỗi package được làm gì, cấm làm gì</h3>
     <table>
       <tr><th>Package</th><th>File</th><th>ĐƯỢC làm</th><th>CẤM</th></tr>
       <tr><td><code>constants</code></td><td>Message, Constants</td><td>Mọi câu chữ (Message), mọi hằng số và định dạng (Constants) — <code>static final</code>, <code>UPPER_SNAKE_CASE</code></td><td>Hardcode câu chữ, số, định dạng ở class khác</td></tr>
       <tr><td><code>model</code></td><td>Doctor.java</td><td>Thuộc tính + hàm của đối tượng, <code>toString()</code> trả chuỗi</td><td><strong>static</strong>. Scanner. <code>printf</code>. Validate. Gọi View</td></tr>
       <tr><td><code>dto</code></td><td>XxxRequestDTO, XxxResponseDTO</td><td>Request: Main → Controller (được đi tiếp nguyên vẹn vào Service/Repository). Response: Controller → View</td><td>Chứa logic xử lý</td></tr>
       <tr><td><code>repository</code></td><td>XxxRepository</td><td><strong>BẮT BUỘC có.</strong> Giữ dữ liệu + CRUD đơn giản; dựng Model từ DTO</td><td>Nhập/xuất, gọi View, tính toán nghiệp vụ, tự đọc tệp</td></tr>
       <tr><td><code>service</code></td><td>XxxServices</td><td>Nghiệp vụ ngoài CRUD (tổng, sắp xếp, báo cáo). Nằm GIỮA Controller và Repository, <strong>chỉ Controller gọi</strong>, được import Model</td><td>Nhập/xuất, gọi View</td></tr>
       <tr><td><code>controller</code></td><td>XxxController</td><td>Nhận RequestDTO → gọi Service (bài không có tính toán thì gọi Repository) → đưa ResponseDTO cho View</td><td><strong>static</strong>. Nhập bàn phím. <code>System.out</code>. <strong>Import/nhận/trả Model</strong></td></tr>
       <tr><td><code>view</code></td><td>XxxView</td><td>Nhận dữ liệu <strong>qua THUỘC TÍNH</strong>: field ResponseDTO + setter, <code>display()</code> không tham số, render <strong>1 lần mỗi luồng</strong></td><td>Tính toán. Đọc bàn phím. Nhận dữ liệu qua tham số của hàm hiển thị</td></tr>
       <tr><td><code>utils</code></td><td>Validation, FileUtils…</td><td>Hàm dùng chung: validate, đọc/ghi tệp, mã hoá. <strong>static method</strong>, class <code>final</code> + private constructor</td><td>Giữ trạng thái. Cho <code>new</code></td></tr>
       <tr><td><code>main</code></td><td>Main.java</td><td>Work flow. <strong>Scanner, validate, đọc tệp, mã hoá CHỈ ở đây</strong>. Gói RequestDTO, mỗi <code>case</code> gọi Controller <strong>1 lần</strong>. <code>public final class Main</code> + private constructor</td><td><strong>static với BIẾN</strong> (hàm thì được). Gọi Model, gọi View</td></tr>
     </table>

     <h3>Bốn luật của tờ checklist hay bị quên nhất</h3>
     <ol>
       <li><strong>Bắt buộc có repository</strong> — kể cả bài thuật toán: repository giữ dữ liệu đầu vào mà thuật
       toán làm việc.</li>
       <li>Controller <strong>không import, không nhận, không trả Model</strong> — nó chỉ cầm DTO.</li>
       <li>Mỗi work flow (mỗi <code>case</code> ở Main) <strong>gọi Controller đúng 1 lần</strong>.</li>
       <li>View nhận dữ liệu <strong>qua thuộc tính</strong>, <code>display()</code> không tham số, và mỗi luồng
       chỉ render <strong>1 lần</strong>.</li>
     </ol>

     <h3>Thứ tự gõ code — không tuỳ tiện</h3>
     <p><strong>model → dto → repository → service → controller → view → utils → main.</strong>
     <code>constants</code> (Message, Constants) mở ngay từ đầu và thêm dần mỗi khi cần một câu chữ hay hằng số.</p>
     <p>Mỗi file chỉ dùng những file đã viết trước nó (cộng với constants), nên gõ xuôi là không bao giờ phải quay
     lại sửa. Đây chính là điều thầy nhắc <em>"code model trước rồi đến data"</em>.</p>

     ${anh(`${R2H}/hd-05.png`, 'Slide 5 — Yêu cầu thực hành. Dòng cuối "Đóng gói — Không truyền dữ liệu qua lại" là lý do sâu xa của cả kiến trúc.')}
     ${sangCodeLab(P0055, 'J1.S.P0055 — bộ khung 10 file đã chạy được')}`),
},
{
  slug: `${TIEN_TO}model-dto`,
  titleEn: 'B.2 — model & dto: the object and the boxes',
  titleVi: 'B.2 — model & dto: đối tượng và những cái hộp',
  desc: 'Vì sao DTO trông giống Model mà vẫn phải tách, và lời giải cho luật "số tham số < 3" — tối đa 2, nhiều hơn thì gói DTO.',
  html: noiDung('Phần B · Bài 10.2',
    'model & dto',
    `<p class="lead">The model describes one real thing. The DTOs are boxes that carry data between layers.
     They look almost identical — and that confuses everyone at first.</p>
     <p>Main always hands data to the controller in a DTO. Further down, check sheet item 1.1 allows loose
     parameters only while there are fewer than three — <strong>at most two</strong>; three or more go into a
     DTO. The model only describes the entity: its setter just assigns, because validation happens in Main
     (through <code>utils/Validation</code>).</p>`,
    'model & dto',
    `<p class="lead">Model mô tả <strong>một thứ có thật</strong>. DTO là <strong>cái hộp</strong> chở dữ liệu giữa
     các tầng. Chúng trông gần như giống hệt nhau — và đó là chỗ ai cũng thắc mắc lúc đầu.</p>

     <h3>model/Doctor.java — gõ đầu tiên (trích)</h3>
     <pre><code>public class Doctor {

    // private: ben ngoai KHONG cham thang duoc, chi di qua getter/setter
    private String code;

    // So ca truc; luat "&gt;= 0" kiem o utils/Validation (Main goi), KHONG kiem o day
    private int availability;

    // Tao bac si du thuoc tinh: this.code (trai) la THUOC TINH, code (phai) la THAM SO
    public Doctor(String code, String name, String specialization, int availability) {
        this.code = code;
        ...
    }

    // Doi so ca truc: chi GAN, vi Main da validate truoc khi du lieu toi day
    public void setAvailability(int availability) {
        this.availability = availability;
    }

    // Da hinh: ghi de Object.toString(), TRA VE mot dong bang (Model cam in)
    @Override
    public String toString() {
        return String.format(Constants.ROW_FORMAT, code, name, specialization, availability);
    }
}</code></pre>
     <p><em>Bản đủ (4 field, constructor rỗng, đủ getter/setter, mỗi method một dòng comment) nằm trong Starter
     code P0055.</em></p>

     <h3>Ba điều phải hiểu ở file này</h3>
     <ul>
       <li><strong><code>private</code> = Đóng gói.</strong> Không phải để giấu bí mật, mà để dữ liệu
       <strong>chỉ đổi qua một cửa</strong>: không class nào gán thẳng <code>doctor.availability = -5</code> được.
       Còn việc <strong>kiểm tra</strong> thì không nằm trong setter: tờ checklist 1.1 ghi <em>"Toàn bộ việc nhập
       dữ liệu/Validate/đọc từ file/mã hóa thực hiện ở Main"</em>, và Model <em>"chỉ làm nhiệm vụ miêu tả thực
       thể"</em>. Mai thầy bảo "số ca trực không quá 7" — bạn sửa đúng một chỗ: hàm kiểm trong
       <code>utils/Validation</code> (và hằng số trần trong <code>Constants</code>); Main vẫn gọi nó như cũ, Model
       không đổi.</li>
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
       <tr><td><code>DoctorRequestDTO</code></td><td>Hộp chở dữ liệu Main → Controller (được đi tiếp nguyên vẹn vào Service/Repository)</td></tr>
       <tr><td><code>DoctorResponseDTO</code></td><td>Hộp chở kết quả Controller → View</td></tr>
     </table>

     <pre><code>// ===== dto/DoctorResponseDTO.java — hop cho ket qua: Controller -&gt; View =====
package dto;

import java.util.ArrayList;
import java.util.LinkedHashMap;

/**
 * DTO chua ket qua cua MOT chuc nang, tu Controller sang View. Chuc nang nao
 * dien field cua chuc nang do; View in dung nhung gi da duoc dien.
 */
public class DoctorResponseDTO {

    // Cau ket qua mot dong, vd "Add doctor successfully."
    private String message;

    // Ket qua tim kiem: ma -&gt; dong bang (chuoi Doctor.toString()); ten ket thuc bang Map
    private LinkedHashMap&lt;String, String&gt; doctorMap;

    // Cac dong da sap xep (bai 10.3, 10.4); ten ket thuc bang List (muc 1.5)
    private ArrayList&lt;String&gt; rowList;

    // Tra ve cau ket qua
    public String getMessage() {
        return message;
    }

    // Dat cau ket qua
    public void setMessage(String message) {
        this.message = message;
    }

    // Tra ve ket qua tim kiem
    public LinkedHashMap&lt;String, String&gt; getDoctorMap() {
        return doctorMap;
    }

    // Dat ket qua tim kiem
    public void setDoctorMap(LinkedHashMap&lt;String, String&gt; doctorMap) {
        this.doctorMap = doctorMap;
    }

    // Tra ve cac dong da sap xep
    public ArrayList&lt;String&gt; getRowList() {
        return rowList;
    }

    // Dat cac dong da sap xep
    public void setRowList(ArrayList&lt;String&gt; rowList) {
        this.rowList = rowList;
    }
}</code></pre>
     <p>ResponseDTO chở <strong>chuỗi đã dựng sẵn</strong> (<code>Doctor.toString()</code>), không chở
     <code>Doctor</code> — nhờ vậy Controller và View không bao giờ phải cầm Model.</p>

     <h3>Luật "số tham số &lt; 3" — tối đa 2, nhiều hơn thì gói DTO</h3>
     <p>Guide: Main <em>"truyền data vào controller thông qua DTO param"</em>. Xuống dưới, tờ checklist 1.1 cho
     Services/Repository nhận data từ Controller <em>"thông qua param nếu số param &lt; 3"</em> — tức là
     <strong>tối đa 2 tham số rời; từ 3 trở lên thì gói vào DTO</strong>:</p>
     <pre><code>// ❌ Khong co DTO — 4 tham so roi, them truong la sua het moi noi goi
controller.addDoctor(code, name, specialization, availability);

// ✅ Co DTO — 1 tham so, them truong chi sua trong DTO
controller.addDoctor(requestDTO);

// ✅ Tham so roi van duoc khi so tham so &lt; 3 (toi da 2) — vd mot ham cua Repository
public boolean isExistDoctor(String code) {
    return doctorMap.containsKey(code);
}</code></pre>
     <p>Con số đó có lý do: nhiều tham số rời là dấu hiệu dữ liệu chưa được gói — thêm một trường là sửa chữ ký
     hàm ở mọi tầng, và hoán vị nhầm hai tham số cùng kiểu vẫn biên dịch được.</p>

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
  desc: 'Cái "data" thầy nói là gì, vì sao repository là BẮT BUỘC, khi nào thêm Service, và vì sao HashMap chứ không ArrayList.',
  html: noiDung('Phần B · Bài 10.3',
    'repository & service',
    `<p class="lead">Repository holds the data and does plain CRUD. Anything beyond CRUD — totals, reports,
     sorting — belongs to a Service sitting between Controller and Repository.</p>
     <p>The repository is <strong>mandatory</strong> in every lab (check sheet 1.1), and it never reads files
     itself: Main reads them through <code>utils</code> and hands the lines over in a DTO. The check sheet does
     not care whether you declare <code>Map</code> or <code>HashMap</code> — it checks the <em>name</em>:
     collections end in <code>List</code>, sets in <code>Set</code>, maps in <code>Map</code>, arrays in
     <code>Array</code> (item 1.5).</p>`,
    'repository & service',
    `<p class="lead">Repository <strong>giữ dữ liệu</strong> và làm CRUD đơn giản. Bất cứ thứ gì ngoài CRUD —
     tính tổng, báo cáo, sắp xếp — thuộc về <strong>Service</strong> nằm giữa Controller và Repository.</p>
     <p>Tờ checklist 1.1: <em>"Repository chỉ chứa data và CRUD methods đơn giản. Nếu có nghiệp vụ tính toán thì
     cần thêm Services và đảm bảo layer: Controller &lt;-&gt; Services &lt;-&gt; Repository &lt;-&gt; Model.
     <strong>Bắt buộc phải có repository</strong>"</em>. Bài thuật toán (sắp xếp, tìm kiếm, đổi cơ số…) cũng
     vậy: repository giữ dữ liệu đầu vào mà thuật toán làm việc.</p>

     <h3>repository — cái "data" thầy nói</h3>
     <pre><code>// ===== repository/DoctorRepository.java =====
package repository;

import dto.DoctorRequestDTO;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import model.Doctor;

/**
 * REPOSITORY: giu du lieu + CRUD don gian. KHONG tinh toan, KHONG in, KHONG tu doc tep.
 */
public class DoctorRepository {

    // Gia lap database: khoa la ma bac si (muc 1.5: bien kieu Map ket thuc bang "Map")
    private Map&lt;String, Doctor&gt; doctorMap;

    // Tao kho rong
    public DoctorRepository() {
        doctorMap = new HashMap&lt;&gt;();
    }

    // Co bac si mang ma nay chua (1 tham so roi: hop le vi so tham so &lt; 3)
    public boolean isExistDoctor(String code) {
        return doctorMap.containsKey(code);
    }

    // Them bac si dung tu DTO — Repository dung Model, Controller khong cham Model
    public boolean addDoctor(DoctorRequestDTO requestDTO) {
        Doctor doctor = new Doctor(requestDTO.getCode(), requestDTO.getName(),
                requestDTO.getSpecialization(), requestDTO.getAvailability());

        // ma la khoa; true = da them
        doctorMap.put(doctor.getCode(), doctor);
        return true;
    }

    // Doc tat ca: tra BAN SAO de Services sap xep ma kho khong doi thu tu
    public ArrayList&lt;Doctor&gt; findAllDoctor() {
        return new ArrayList&lt;&gt;(doctorMap.values());
    }
}</code></pre>

     <h3>Vì sao <code>HashMap</code> chứ không <code>ArrayList</code> — thầy chắc chắn hỏi</h3>
     <ul>
       <li>Thao tác chính của bài là <strong>tìm theo mã</strong>. <code>HashMap</code> tra theo khoá gần như tức
       thì; <code>ArrayList</code> phải duyệt từ đầu tới cuối.</li>
       <li>Khoá của <code>Map</code> là <strong>duy nhất</strong> — nó chặn trùng mã hộ luôn.</li>
     </ul>
     <p><strong>Nhưng</strong> <code>HashMap</code> <strong>không giữ thứ tự</strong>. Nên khi cần sắp xếp, phải đổ
     sang <code>ArrayList</code> trước — đó là việc của <code>findAllDoctor()</code> ở trên (trả <strong>bản
     sao</strong>, vì <code>Collections.sort()</code> sắp tại chỗ). Xem thêm bài 10.4 và bài luyện Strategy.</p>

     <h3>Câu trả lời đầy đủ cho "List vs ArrayList"</h3>
     <blockquote><code>List</code> là <strong>giao diện</strong> — bản hợp đồng nói "có <code>add</code>,
     <code>get</code>, <code>size</code>". <code>ArrayList</code> là <strong>bản cài đặt</strong> bằng mảng động:
     lấy theo chỉ số rất nhanh, chèn/xoá giữa thì chậm vì phải dịch phần tử. <code>LinkedList</code> cài cùng hợp
     đồng bằng danh sách liên kết, ngược lại. Tương tự <code>Map</code> là hợp đồng, <code>HashMap</code> cài bằng
     băm nên <strong>không giữ thứ tự</strong>, <code>LinkedHashMap</code> giữ thứ tự thêm vào,
     <code>TreeMap</code> sắp theo khoá.</blockquote>
     <p>⚠️ Nhiều bạn nghe đồn "dùng <code>List</code> là bị nghi dùng AI". Thực tế: <strong>code mẫu của chính
     thầy</strong> viết <code>Map&lt;String, Doctor&gt; doctorMap = new HashMap&lt;&gt;()</code> — dùng
     <code>Map</code> làm kiểu khai báo. Tờ checklist <strong>không</strong> quy định khai báo bằng kiểu nào; nó
     chấm <strong>tên</strong> (mục 1.5): biến kiểu collection kết thúc bằng <code>List</code>, Set bằng
     <code>Set</code>, Map bằng <code>Map</code>, mảng bằng <code>Array</code> — <code>doctorList</code>,
     <code>codeSet</code>, <code>doctorMap</code>, <code>partArray</code>; không phải <code>ds</code>,
     <code>data</code>, <code>list</code>. Đặt đúng tên và giải thích được lựa chọn là đủ.</p>

     <h3>Khi nào cần Service</h3>
     <p>File Guide ghi: <em>"Nếu có các tính toán nghiệp vụ ngoài CRUD thì cần thêm class
     <code>DoctorServices.java</code>… Services nằm <strong>giữa</strong> Controller và Repo."</em> và
     <em>"Services chỉ được gọi từ Controller và được phép import Model. Services không làm việc với input, output,
     View"</em>.</p>
     <p>Sắp xếp, tính tổng chi tiêu, sinh báo cáo — <strong>không phải CRUD</strong> ⇒ thuộc về Service.
     Nhét vào Repository là trộn hai trách nhiệm, vi phạm SRP.</p>
     <pre><code>// ===== service/DoctorServices.java =====
package service;

import constants.Message;
import dto.DoctorRequestDTO;
import dto.DoctorResponseDTO;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import model.Doctor;
import repository.DoctorRepository;

/**
 * SERVICE: nghiep vu ngoai CRUD. Chi Controller goi; KHONG nhap, KHONG in; tra ResponseDTO.
 */
public class DoctorServices {

    // Kho du lieu: Services -&gt; Repository -&gt; Model
    private DoctorRepository doctorRepository;

    // Tao service cung kho cua no; Controller chi giu Services, KHONG giu kho rieng
    public DoctorServices() {
        doctorRepository = new DoctorRepository();
    }

    // Them bac si: luat "ma khong trung" o day, viec luu giao cho Repository
    public DoctorResponseDTO addDoctor(DoctorRequestDTO requestDTO) throws Exception {
        DoctorResponseDTO responseDTO = new DoctorResponseDTO();

        // de bai: ma bac si khong duoc trung
        if (doctorRepository.isExistDoctor(requestDTO.getCode())) {
            throw new Exception(String.format(Message.DUPLICATE_CODE, requestDTO.getCode()));
        }

        // luu, roi tra cau ket qua cho Controller
        doctorRepository.addDoctor(requestDTO);
        responseDTO.setMessage(Message.ADD_SUCCESS);
        return responseDTO;
    }

    // Sap xep theo ten A-Z, khong phan biet hoa thuong — tinh toan nen nam o Services
    public DoctorResponseDTO sortDoctorByName() {
        DoctorResponseDTO responseDTO = new DoctorResponseDTO();
        ArrayList&lt;Doctor&gt; doctorList = doctorRepository.findAllDoctor();
        ArrayList&lt;String&gt; rowList = new ArrayList&lt;&gt;();

        // sap tren BAN SAO: kho giu nguyen thu tu nhap
        Collections.sort(doctorList,
                Comparator.comparing(Doctor::getName, String.CASE_INSENSITIVE_ORDER));

        // moi bac si mot dong toString(); View chi viec in
        for (Doctor doctor : doctorList) {
            rowList.add(doctor.toString());
        }

        responseDTO.setRowList(rowList);
        return responseDTO;
    }
}</code></pre>
     <p><strong>Ai tạo Repository?</strong> Guide ghi Controller <em>"chỉ import DTO, View, Service"</em>. Nên bài có
     Services thì Controller chỉ giữ <code>DoctorServices</code>, <strong>mọi</strong> chức năng (kể cả thêm, xoá)
     đi qua Services, và Services tạo Repository <strong>một lần</strong> trong constructor — cả chương trình có
     đúng một kho. Nếu Controller và Services mỗi bên tự <code>new</code> một kho, hai bên sẽ nhìn
     <strong>hai</strong> danh sách khác nhau. Bài không có tính toán (như P0055 mẫu) thì bỏ Services, Controller
     gọi thẳng Repository — tờ checklist 1.1: <em>"gửi/nhận data qua Services (Repository)"</em>.</p>
     <p>Repository cũng <strong>không tự đọc tệp</strong>: đọc tệp là việc của Main (qua
     <code>utils/FileUtils</code>), các dòng đọc được đi vào RequestDTO rồi mới tới Repository để nạp.</p>
     ${sangCodeLab('lab211-j1-s-p0057-user-management-system', 'J1.S.P0057 — User management (có user.dat: Main đọc tệp, Repository giữ dữ liệu)')}`),
},
{
  slug: `${TIEN_TO}controller-view`,
  titleEn: 'B.4 — controller & view: routing and printing',
  titleVi: 'B.4 — controller & view: điều hướng và hiển thị',
  desc: 'Controller không tự làm gì; View không tính gì, nhận dữ liệu qua thuộc tính và in đúng 1 lần mỗi luồng. Và vì sao chỉ Main bắt lỗi.',
  html: noiDung('Phần B · Bài 10.4',
    'controller & view',
    `<p class="lead">The controller does nothing itself — it gives orders. The view computes nothing — it prints.
     Keeping both that dumb is what makes the rest testable.</p>
     <p>The view receives its data <strong>through a field</strong>: the controller calls
     <code>setResponseDTO(...)</code>, then <code>display()</code>, which takes no parameter — exactly once per
     menu option. No display method of the view takes data as a parameter. Errors are thrown up to Main, which
     prints <code>e.getMessage()</code>.</p>`,
    'controller & view',
    `<p class="lead">Controller <strong>không tự làm gì cả</strong> — nó ra lệnh. View <strong>không tính gì</strong>
     — nó in. Giữ cho cả hai "ngu" như vậy chính là thứ làm phần còn lại sạch sẽ.</p>

     <h3>controller — ba bước, ba vai (trích DoctorController.java)</h3>
     <pre><code>// Chuc nang 1: them bac si, roi View in "Add doctor successfully." — MOT lan
public void addDoctor(DoctorRequestDTO requestDTO) throws Exception {
    DoctorResponseDTO responseDTO = new DoctorResponseDTO();

    // 1. Hoi Repository (CRUD don gian): ma nay co chua? Co roi thi nem loi cua de
    if (doctorRepository.isExistDoctor(requestDTO.getCode())) {
        throw new Exception(String.format(Message.DUPLICATE_CODE, requestDTO.getCode()));
    }

    // 2. Bao Repository luu — Repository tu dung Model tu DTO
    doctorRepository.addDoctor(requestDTO);

    // 3. Goi ket qua vao ResponseDTO, dua cho View qua THUOC TINH, render 1 lan
    responseDTO.setMessage(Message.ADD_SUCCESS);
    doctorView.setResponseDTO(responseDTO);
    doctorView.display();
}</code></pre>
     <p>Controller chỉ cầm DTO: nó <strong>không import, không nhận, không trả Model</strong> — Repository mới là
     nơi dựng <code>Doctor</code> từ DTO. Bài P0055 không có tính toán nên Controller gọi thẳng Repository. Bài có
     Services thì Controller chỉ gọi <code>doctorServices.addDoctor(requestDTO)</code> — luật trùng mã nằm trong
     Services (bài 10.3) — rồi đưa ResponseDTO nhận về cho View, vẫn đúng 1 lần.</p>

     <h3><code>throws</code> và <code>throw</code> — vì sao chỉ Main bắt lỗi</h3>
     <ul>
       <li><code>throws Exception</code> = <em>"hàm này có thể ném lỗi, ai gọi thì phải hứng"</em>.</li>
       <li><code>throw new Exception(...)</code> = <em>"ném ngay bây giờ"</em>; câu lỗi lấy từ
       <code>Message</code>.</li>
     </ul>
     <p>Lỗi bay lên tận <code>Main</code>, nơi có <strong>một</strong> <code>try/catch</code> quanh
     <code>switch</code> bắt và in <code>e.getMessage()</code> — đúng mẫu Main của thầy. Controller không in, và
     cũng không gọi View để in lỗi. Đó là lý do mọi lỗi nghiệp vụ chỉ có một chỗ <code>catch</code> thay vì rải
     <code>if (loi) System.out.println(...)</code> khắp nơi.</p>
     <p>Đây cũng là <strong>Trừu tượng hoá</strong>: Main gọi <code>addDoctor(requestDTO)</code> là xong, hoàn toàn
     không biết dữ liệu nằm trong <code>HashMap</code>.</p>

     <h3>view — nhận dữ liệu qua THUỘC TÍNH, chỉ biết in</h3>
     <pre><code>// ===== view/DoctorView.java =====
package view;

import constants.Constants;
import constants.Message;
import dto.DoctorResponseDTO;

/**
 * VIEW: noi DUY NHAT (cung Main) duoc in ket qua. Nhan du lieu qua THUOC TINH
 * (ResponseDTO, nhu mau Guide), KHONG qua tham so cua display().
 */
public class DoctorView {

    // Ket qua can in, do Controller giao
    private DoctorResponseDTO responseDTO;

    // Nhan ket qua cho lan display() tiep theo
    public void setResponseDTO(DoctorResponseDTO responseDTO) {
        this.responseDTO = responseDTO;
    }

    // In dung nhung gi Controller da dat: cau ket qua, ket qua tim kiem, hoac danh sach da sap
    public void display() {
        // them/sua/xoa: tra loi bang mot dong
        if (responseDTO.getMessage() != null) {
            System.out.println(responseDTO.getMessage());
        }

        // tim kiem: in bang ket qua
        if (responseDTO.getDoctorMap() != null) {
            displayResult();
        }

        // sap xep: moi bac si mot dong, dung thu tu Services da sap
        if (responseDTO.getRowList() != null) {
            // in tung dong da dung san bang Doctor.toString()
            for (String row : responseDTO.getRowList()) {
                System.out.println(row);
            }
        }
    }

    // In ket qua tim kiem: tieu de, roi "No doctor found." hoac header + moi bac si mot dong
    private void displayResult() {
        System.out.println(Message.TITLE_RESULT);

        // khong ai khop tu khoa
        if (responseDTO.getDoctorMap().isEmpty()) {
            System.out.println(Message.NOT_FOUND);
        } else {
            // header cung do rong cot voi cac dong
            System.out.println(String.format(Constants.HEADER_FORMAT, Message.LABEL_CODE,
                    Message.LABEL_NAME, Message.LABEL_SPECIALIZATION,
                    Message.LABEL_AVAILABILITY));

            // moi bac si mot dong; Doctor.toString() da can cot san
            for (String row : responseDTO.getDoctorMap().values()) {
                System.out.println(row);
            }
        }
    }
}</code></pre>
     <p>Đúng mẫu của thầy (<code>doctorView.setDoctorMap(result); doctorView.display();</code>) và đúng tờ
     checklist 1.1: <em>"Không nên truyền qua param mà phải nhận qua thuộc tính (Nên để ResponseDTO giống ví
     dụ)"</em>, <em>"Việc rendering khi gọi view chỉ được gọi 1 lần cho 1 luồng xử lý"</em>. View
     <strong>không có hàm public nào nhận dữ liệu qua tham số</strong> ngoài setter.</p>
     <ul>
       <li><code>%-10s</code> = chuỗi, chiếm 10 ô, <strong>căn trái</strong> (dấu <code>-</code>). Bỏ <code>-</code>
       thành căn phải. Chuỗi định dạng nằm ở <code>Constants.HEADER_FORMAT</code> / <code>ROW_FORMAT</code>, nhãn
       cột nằm ở <code>Message</code> (mục 2.10, 2.11) — View không gõ thẳng chuỗi nào.</li>
       <li>Dùng <code>\\t</code> thay vì định dạng độ rộng là <strong>vỡ bảng ngay khi có tên dài</strong>.</li>
     </ul>
     <p>⚠️ Bẫy độ rộng cột: "Availability" dài đúng 12 ký tự, để <code>%-12s</code> là vừa khít, không còn khoảng
     trắng — thêm cột sau nó là header dính liền thành <code>AvailabilityPhone</code>. Nới lên <code>%-14s</code>
     trong <code>Constants</code>.</p>

     <h3>Sắp xếp: kết quả đi trong một field DANH SÁCH của ResponseDTO</h3>
     <p><code>HashMap</code> không giữ thứ tự, nên sắp xếp xong nhét lại vào <code>Map</code> là mất sạch công.
     Services trả các dòng đã sắp trong field <code>rowList</code> (bài 10.2, 10.3); View đã có sẵn nhánh in nó —
     <code>display()</code> vẫn <strong>không tham số</strong>. Controller chỉ thêm một hàm:</p>
     <pre><code>// Chuc nang sap xep: Services sap, View in — dung 1 lan cho ca luong
public void sortDoctor() {
    DoctorResponseDTO responseDTO = doctorServices.sortDoctorByName();

    // dua ket qua cho View qua thuoc tinh roi render
    doctorView.setResponseDTO(responseDTO);
    doctorView.display();
}</code></pre>
     ${sangCodeLab('lab211-j1-s-p0054-develop-the-contact-management-program', 'J1.S.P0054 — Contact Management (bài số 1 của lộ trình)')}`),
},
{
  slug: `${TIEN_TO}utils-constants-main`,
  titleEn: 'B.5 — utils, constants & main: where static belongs, and the only Scanner',
  titleVi: 'B.5 — utils, constants & main: static đặt ở đâu, và Scanner duy nhất',
  desc: 'Ba từ khoá của class tiện ích, static được ở đâu và cấm ở đâu, và ba lỗi trong bản mẫu của thầy.',
  html: noiDung('Phần B · Bài 10.5',
    'utils, constants & main',
    `<p class="lead"><code>static</code> methods are <strong>required</strong> in <code>utils</code> and allowed in
     <code>Main</code> (methods only — never variables); constants and messages are <code>static final</code>;
     Model and Controller never use static. <code>Scanner</code> may appear in exactly one place: Main.
     Knowing why is half the oral defence.</p>`,
    'utils, constants & main',
    `<p class="lead"><code>static</code> method là <strong>bắt buộc</strong> ở <code>utils</code> và được phép ở
     <code>Main</code> (với hàm, không với biến); hằng số và câu chữ khai <code>static final</code>; Model và
     Controller <strong>cấm</strong> static. Còn <code>Scanner</code> thì có <strong>đúng một chỗ</strong>: Main.
     Hiểu vì sao là qua được nửa phần vấn đáp.</p>

     <h3>utils/Validation.java — nơi static method là BẮT BUỘC</h3>
     <pre><code>// ===== utils/Validation.java =====
package utils;

import constants.Message;

/**
 * Tien ich dung chung: KHONG field, KHONG ban phim, KHONG in. Chi Main goi.
 */
public final class Validation {

    // private constructor: khong ai new duoc — moi ham goi qua ten class (muc 3.1, 3.4)
    private Validation() {
    }

    // Cat khoang trang hai dau cua mot dong nhap
    public static String getText(String input) {
        // dong null (het du lieu vao) coi nhu dong rong
        if (input == null) {
            return "";
        }

        return input.trim();
    }

    // Doi lua chon menu sang so va kiem tra no nam trong [min, max]
    public static int getChoice(String input, int min, int max) throws Exception {
        int choice = 0;

        // doi sang so truoc: nhap chu thi bao "Please input number"
        try {
            choice = Integer.parseInt(getText(input));
        } catch (NumberFormatException e) {
            // chu cai hoac dong rong: khong phai so
            throw new Exception(Message.INVALID_NUMBER);
        }

        // roi moi kiem khoang; ngoac RIENG cho tung phep so sanh (muc 3.3, mau cua thay)
        if ((choice &lt; min) || (choice &gt; max)) {
            throw new Exception(String.format(Message.INVALID_RANGE, min, max));
        }

        return choice;
    }
}</code></pre>
     <ul>
       <li><strong><code>final</code></strong> — class tiện ích không có gì để kế thừa.</li>
       <li><strong>constructor <code>private</code></strong> — <code>new</code> ra cũng vô nghĩa, nó chẳng giữ gì
       (tờ checklist 3.4: class chỉ có static method thì phải có private constructor và là final).</li>
       <li><strong><code>static</code></strong> — gọi thẳng <code>Validation.getChoice(...)</code> qua tên class,
       không cần đối tượng (mục 3.1).</li>
     </ul>
     <p><code>getChoice</code> nhận ba tham số (<code>input</code>, <code>min</code>, <code>max</code>), đúng như mẫu Validation của thầy: luật "số tham số &lt; 3" của tờ
     giấy nói về dữ liệu Controller gửi xuống Services/Repository, không nói về hàm tiện ích.</p>

     <h3>static — được ở đâu, cấm ở đâu</h3>
     <table>
       <tr><th>Chỗ</th><th>Luật (Guide + tờ checklist)</th></tr>
       <tr><td><code>utils</code> (Validation, FileUtils…)</td><td><strong>"phải dùng static method"</strong>; class <code>final</code> + constructor <code>private</code></td></tr>
       <tr><td><code>main/Main</code></td><td><strong>"cấm dùng static với biến, có thể dùng với hàm"</strong>; Main chỉ có hàm static ⇒ <code>public final class Main</code> + <code>private Main()</code></td></tr>
       <tr><td><code>constants</code> (Message, Constants)</td><td>hằng <code>public static final</code>, <code>UPPER_SNAKE_CASE</code> (mục 2.10, 2.11)</td></tr>
       <tr><td><code>model</code>, <code>controller</code></td><td><strong>cấm</strong> static</td></tr>
       <tr><td><code>view</code>, <code>repository</code>, <code>service</code></td><td>không cần static (Singleton ở bài 11.4 là ngoại lệ — hỏi thầy trước)</td></tr>
     </table>

     <h3>Ba câu về static — trả lời bằng chính file này</h3>
     <p><strong>"Tại sao static?"</strong> — Hàm thuần: cùng đầu vào luôn ra cùng kết quả, không đọc/ghi thuộc tính
     của đối tượng nào. Gọi từ rất nhiều nơi trong Main. Không static thì mỗi lần gọi phải tạo một đối tượng rỗng.</p>
     <p><strong>"Bỏ static thì sao?"</strong> — Không biên dịch được, vì gọi method của thể hiện qua tên class là
     sai cú pháp.</p>
     <p><strong>"Không dùng static thì sửa thế nào?"</strong> — Bỏ <code>private</code> ở constructor, trong Main
     tạo <code>Validation validation = new Validation();</code>, đổi mọi lời gọi thành
     <code>validation.getChoice(...)</code>. Chạy được, nhưng thừa một đối tượng vô nghĩa.</p>

     <h3>Vì sao Model và Controller CẤM static</h3>
     <p><code>static</code> nghĩa là <strong>cả chương trình dùng chung một bản</strong>. Nếu <code>Doctor</code> có
     <code>private static String name;</code> thì tạo 100 bác sĩ nhưng chỉ có <strong>một</strong> cái tên — bác sĩ
     sau ghi đè bác sĩ trước. Lúc đó hết hướng đối tượng. Controller cũng vậy: mỗi Controller giữ kho và View của
     riêng nó; để static là mọi nơi dùng chung một kho — đúng cái kiến trúc phân tầng đang tránh.</p>

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
     <code>new</code>, <code>final</code> để không ai gán lại. Tên viết <code>UPPER_SNAKE_CASE</code>. Hai class
     này cũng là <code>public final class</code> có constructor <code>private</code>, như Validation.</p>
     <p>Gom vào một chỗ thì sửa một câu chỉ phải sửa một chỗ, và <strong>không có chuỗi lạ nào rải rác</strong>.
     Thầy thấy <code>System.out.println("Nhap ma bac si: ")</code> giữa Controller là trừ điểm ngay.
     <code>Message</code> giữ câu chữ; <code>Constants</code> giữ <strong>số và định dạng</strong>: số của từng mục
     menu, trần số ca trực, định dạng cột.</p>

     <h3>main — Scanner DUY NHẤT (trích Main.java)</h3>
     <pre><code>Scanner sc = new Scanner(System.in);
DoctorController controller = new DoctorController();
DoctorRequestDTO requestDTO = null;
boolean running = true;
int choice = 0;

// hien menu sau moi chuc nang, toi khi chon Exit
while (running) {
    System.out.println(Message.MENU);
    choice = inputChoice(sc);

    // MOT cho bat moi loi nghiep vu cua chuc nang vua chon
    try {
        // moi case goi controller DUNG 1 lan
        switch (choice) {
            // chuc nang 1: Main nhap + validate, roi them
            case Constants.MENU_ADD:
                requestDTO = inputAdd(sc);
                controller.addDoctor(requestDTO);
                break;

            // Exit: dung vong lap
            case Constants.MENU_EXIT:
                running = false;
                break;

            // khong toi duoc: inputChoice chi tra so trong menu
            default:
                break;
        }
    } catch (Exception e) {
        // cau loi da nam trong Message, controller nem ra
        System.out.println(e.getMessage());
    }
}</code></pre>
     <p><code>new Scanner(System.in)</code> chỉ xuất hiện <strong>một lần</strong> trong cả project. Main chỉ làm việc
     với Controller, DTO, Utils; nó được in menu, câu nhắc nhập và <code>e.getMessage()</code> — còn
     <strong>kết quả</strong> thì luôn qua View.</p>
     <p><strong><code>break</code> chỉ nhảy ra khỏi <code>switch</code>, KHÔNG thoát vòng lặp</strong> — nhầm hai
     cái này là chương trình không bao giờ tắt; đó là lý do cần cờ <code>running</code>. Mỗi <code>case</code>
     chỉ làm hai việc: Main tự nhập + validate (<code>inputAdd(sc)</code> trả về RequestDTO), rồi gọi Controller
     <strong>đúng 1 lần</strong>. Biến khai báo ở đầu hàm và có giá trị khởi tạo (mục 2.6, 3.7); số menu là hằng
     <code>Constants.MENU_ADD</code>, không gõ số trần (mục 2.10).</p>
     <p>Hàm <code>private static DoctorRequestDTO inputAdd(Scanner sc)</code> — <code>static</code>
     <strong>với hàm</strong> thì được, thầy chỉ cấm <code>static</code> <strong>với biến</strong> ở Main. Main chỉ
     có hàm static nên khai <code>public final class Main</code> kèm <code>private Main()</code> (tờ checklist
     3.4).</p>
     ${sangCodeLab(P0055, 'J1.S.P0055 — đọc Validation.java trong Starter code')}`),
},
{
  slug: `${TIEN_TO}dat-ten-convention`,
  titleEn: 'B.6 — Naming and coding convention',
  titleVi: 'B.6 — Đặt tên và coding convention',
  desc: 'Luật đặt tên của tờ checklist (1.2–1.5), những gì Alt+Shift+F không sửa hộ, và mức comment thầy đòi.',
  html: noiDung('Phần B · Bài 10.6',
    'Naming and convention',
    `<p class="lead">Convention is graded before correctness. "Không đảm bảo convention sẽ không review tiếp."</p>
     <p>From the mentor's check sheet: a line (comments excluded) is at most <strong>100 characters</strong>;
     collections end in <code>List</code>, sets in <code>Set</code>, maps in <code>Map</code>, arrays in
     <code>Array</code>; write <code>Id</code>, never <code>ID</code>; interfaces start with <code>I</code>;
     exception classes end with <code>Exception</code>; every method and every block gets a comment.
     Alt+Shift+F fixes spacing and braces — not blank lines, declarations, parentheses or naming.</p>`,
    'Đặt tên và convention',
    `<p class="lead">Convention được chấm <strong>trước</strong> cả tính đúng. Slide 10 ghi:
     <em>"Đúng coding convention, không đảm bảo convention sẽ không review tiếp."</em> Thầy chấm bằng tờ
     <strong>Coding check sheet 25 mục</strong> (đủ 25 mục và cách tự điền "O" ở bài 11.6).</p>

     ${anh(`${R2H}/hd-06.png`, 'Slide 6 — Quy tắc đặt tên bốn tầng: Project · Package · Class · Method.')}

     <h3>Đặt tên — slide 6 cộng tờ checklist 1.2–1.5</h3>
     <table>
       <tr><th>Thành phần</th><th>Quy tắc</th><th>Đúng</th><th>Sai</th></tr>
       <tr><td>Project</td><td><code>RollNo_ExcerciseNo_ExcerciseDescription</code></td><td><code>HE176322_J1S0055_DoctorManagement</code></td><td><code>Lab1</code></td></tr>
       <tr><td>Package</td><td>toàn chữ thường, nói ý nghĩa chung (1.2)</td><td><code>controller</code>, <code>utils</code></td><td><code>Controller</code></td></tr>
       <tr><td>Class</td><td>PascalCase, bắt đầu bằng <strong>danh từ</strong> (1.3)</td><td><code>DoctorRepository</code>, <code>NameSortStrategy</code></td><td><code>doctor_repo</code>, <code>SortByName</code></td></tr>
       <tr><td>Interface</td><td>bắt đầu bằng <strong><code>I</code></strong> (1.3)</td><td><code>IDoctorRepository</code>, <code>ISortStrategy</code></td><td><code>SortStrategy</code></td></tr>
       <tr><td>Class exception</td><td>kết thúc bằng <strong><code>Exception</code></strong> (1.3)</td><td><code>DoctorNotFoundException</code></td><td><code>ExceptionDoctor</code></td></tr>
       <tr><td>Method</td><td>camelCase, bắt đầu bằng <strong>động từ</strong> (1.4)</td><td><code>calcSummaryFee()</code>, <code>checkValidAge()</code></td><td><code>CalcFee()</code>, <code>toResponse()</code></td></tr>
       <tr><td>Biến / field</td><td>camelCase, danh từ có nghĩa (1.5)</td><td><code>doctorCode</code>, <code>totalAmount</code></td><td><code>a</code>, <code>x1</code></td></tr>
       <tr><td>Biến tập hợp / mảng</td><td>collection → <code>…List</code>, Set → <code>…Set</code>, Map → <code>…Map</code>, mảng → <code>…Array</code> (1.5)</td><td><code>doctorList</code>, <code>codeSet</code>, <code>doctorMap</code>, <code>partArray</code></td><td><code>ds</code>, <code>kho</code>, <code>parts</code></td></tr>
       <tr><td>Mã định danh</td><td>viết <code>Id</code>, không viết <code>ID</code> (1.5)</td><td><code>doctorId</code>, <code>getDoctorId()</code></td><td><code>doctorID</code></td></tr>
       <tr><td>Hằng số</td><td>UPPER_SNAKE_CASE, <code>static final</code>, trong Constants/Message (2.10, 2.11)</td><td><code>MAX_RETRY</code>, <code>INPUT_CODE</code></td><td><code>maxRetry</code></td></tr>
     </table>

     <h3>Định dạng — Alt + Shift + F làm được gì, KHÔNG làm được gì</h3>
     <p>Thụt lề 4 dấu cách; <strong>một dòng (không tính comment) không quá 100 ký tự</strong> (mục 2.3) — dài hơn
     thì ngắt <em>sau</em> toán tử logic (<code>&amp;&amp;</code>, <code>||</code>), ngắt <em>trước</em> toán hạng
     (<code>+ - *</code>), hạn chế ngắt giữa biểu thức trong <code>()</code>. Trong NetBeans nhấn
     <strong><code>Alt + Shift + F</code></strong> là tự sửa thụt lề, dấu cách, vị trí <code>{</code>
     <code>}</code> (mục 2.1, 2.9). Những mục dưới đây formatter <strong>không</strong> sửa hộ — phải tự soát:</p>
     <table>
       <tr><th>Mục</th><th>Tự làm</th><th>Ví dụ đúng</th></tr>
       <tr><td>2.2</td><td>Block chỉ 1 dòng code cũng đặt trong <code>{}</code></td><td><code>if (doctor == null) {</code> ↵ <code>return false;</code> ↵ <code>}</code></td></tr>
       <tr><td>2.4, 2.7</td><td>Mỗi khai báo biến một dòng, mỗi statement một dòng</td><td><code>break;</code> xuống dòng riêng sau lệnh của <code>case</code></td></tr>
       <tr><td>2.6, 3.7</td><td>Khai báo biến ở <strong>đầu block</strong> và <strong>khởi tạo luôn</strong>; trong vòng lặp chỉ gán</td><td><code>String line = "";</code> … <code>line = sc.nextLine();</code></td></tr>
       <tr><td>2.8</td><td>1 dòng trống giữa các method, sau vùng khai báo biến, trước mỗi comment đứng sau một dòng code, giữa các khối logic</td><td>xem mẫu comment bên dưới</td></tr>
       <tr><td>3.3</td><td>Ngoặc riêng cho từng phép so sánh</td><td><code>if ((choice &lt; min) || (choice &gt; max))</code></td></tr>
       <tr><td>3.5</td><td>So sánh String bằng <code>equals</code>, chú ý hoa/thường</td><td><code>code.equalsIgnoreCase(input)</code></td></tr>
       <tr><td>3.6</td><td>Không để biến khai báo mà không dùng</td><td>—</td></tr>
       <tr><td>3.8</td><td>Cộng chuỗi dùng <code>StringBuilder</code> hoặc <code>String.format</code>, không <code>+=</code></td><td><code>String.format(Constants.ROW_FORMAT, …)</code></td></tr>
     </table>

     <h3>Comment — thiếu là KHÔNG được review</h3>
     <p>Slide ghi: <em>"Có đủ comment source ít nhất cho <strong>function</strong> và
     <strong>block/rẽ nhánh</strong>. Không có comment → không review."</em> Tờ checklist 1.6 còn chặt hơn:
     <em>"Mỗi method đều phải có comment miêu tả ý nghĩa của method — Mỗi block source đều phải có comment giải
     thích block đó làm gì"</em> — kể cả method <code>private</code> và getter/setter.</p>
     <pre><code>// Function 4: Search doctor
public void searchDoctor(DoctorRequestDTO requestDTO) throws Exception {
    DoctorResponseDTO responseDTO = new DoctorResponseDTO();

    // Kiem tra database co du lieu truoc khi search
    if (doctorRepository.isEmpty()) {
        throw new Exception(Message.DATABASE_EMPTY);
    }

    // Tim theo tu khoa trong DTO; ket qua di trong ResponseDTO
    responseDTO.setDoctorMap(doctorRepository.searchDoctor(requestDTO));

    // Truyen du lieu sang view qua thuoc tinh, render 1 lan
    doctorView.setResponseDTO(responseDTO);
    doctorView.display();
}</code></pre>
     <p>Phỏng theo bản mẫu của thầy, đã sửa theo tờ checklist: nhận <code>DoctorRequestDTO</code> thay vì
     <code>String</code> (Controller nhận input qua DTO), biến khai báo ở đầu hàm rồi cách một dòng trống, mỗi khối
     một comment, và kết thúc bằng <code>display()</code> đúng 1 lần.</p>
     <p>Comment nói <strong>ý định</strong>, không nhại lại code. <code>// tăng i lên 1</code> cho dòng
     <code>i++</code> là vô giá trị; <code>// duyệt qua tất cả bác sĩ để tìm từ khoá</code> mới là thứ thầy muốn.</p>

     <h3>Một điểm cộng ít người để ý</h3>
     <p>Slide 6 liệt kê package <code><strong>exceptions</strong></code> — nhưng bộ khung mẫu của thầy
     <em>không</em> có nó (dùng <code>Exception</code> chung). Nghĩa là thầy chấp nhận cả hai, nhưng
     <strong>có package <code>exceptions</code> với class riêng</strong> (ví dụ <code>ValidationException</code> —
     tên kết thúc bằng <code>Exception</code>, mục 1.3) là điểm cộng khi thầy hỏi về exception. Làm sau khi đã
     thuộc khung.</p>`),
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

    // Dong goi: thuoc tinh private, ben ngoai KHONG cham thang duoc   &lt;-- CHI VAO DAY
    private String code;

    // So ca truc cua bac si
    private int availability;

    // Chi mo ra qua getter public: tra ve ma
    public String getCode() {
        return code;
    }

    // Tra ve so ca truc
    public int getAvailability() {
        return availability;
    }

    // Doi so ca truc: chi GAN, vi Main da validate truoc khi du lieu toi day
    public void setAvailability(int availability) {
        this.availability = availability;
    }
}</code></pre>
     <p><strong>Trả lời:</strong> "Em để field <code>private</code> nên không class nào sửa thẳng được
     <code>availability</code>. Muốn đọc/ghi phải qua <code>getAvailability()</code>/<code>setAvailability()</code>.
     Còn luật 'không được âm' thì em kiểm ở <code>utils/Validation</code>, Main gọi trước khi gói DTO — tờ checklist
     1.1 bắt toàn bộ validate ở Main; Model chỉ mô tả thực thể nên setter chỉ gán."</p>

     <h3>2. Abstraction — Trừu tượng hoá</h3>
     <p><em>Chỉ phơi ra <strong>cái gì làm được</strong>, giấu <strong>làm thế nào</strong>.</em></p>
     <p><strong>Trả lời:</strong> "Main gọi <code>controller.addDoctor(requestDTO)</code> là xong. Nó không biết em
     lưu bằng <code>HashMap</code> hay <code>ArrayList</code>, cũng không biết Repository dựng Model thế nào. Mai em
     đổi <code>HashMap</code> sang <code>ArrayList</code> thì chỉ sửa <code>DoctorRepository</code> — Main,
     Controller, View không đổi dòng nào."</p>
     <p>⚠️ Đừng nói "đổi sang lưu file thì Main không phải sửa": theo tờ checklist 1.1, <strong>đọc file là việc của
     Main</strong> (qua <code>utils/FileUtils</code>, các dòng đọc được đi vào RequestDTO) — có file là Main có thêm
     việc.</p>

     <h3>3. Inheritance — Kế thừa</h3>
     <p>Bài <code>P0055</code> mẫu <strong>chưa có</strong> kế thừa — mà slide nội quy ghi
     <em>"dùng được kế thừa, đa hình sẽ được cộng LOC"</em>. Đây là chỗ kiếm điểm.</p>
     <pre><code>// ===== model/Person.java — phan chung cua moi nhan su =====
package model;

/**
 * MODEL cha: phan chung cua bac si, y ta...
 */
public abstract class Person {

    // protected: class con dung duoc, class khac package thi khong
    protected String code;

    // Ho ten
    protected String name;

    // Tao phan chung; class con goi qua super(...)
    public Person(String code, String name) {
        this.code = code;
        this.name = name;
    }

    // Tra ve ma
    public String getCode() {
        return code;
    }

    // Tra ve ho ten
    public String getName() {
        return name;
    }

    // Bat buoc class con tu mo ta vai tro cua minh
    public abstract String describeRole();
}

// ===== model/Doctor.java — ke thua phan chung, them phan rieng =====
package model;

import constants.Message;

/**
 * MODEL con: mot bac si LA MOT nguoi.
 */
public class Doctor extends Person {

    // Chuyen khoa
    private String specialization;

    // So ca truc
    private int availability;

    // Phan chung giao cho constructor cha, phan rieng tu gan
    public Doctor(String code, String name, String specialization, int availability) {
        super(code, name);
        this.specialization = specialization;
        this.availability = availability;
    }

    // Tra ve so ca truc
    public int getAvailability() {
        return availability;
    }

    // Ban mo ta rieng cua bac si; cau chu nam o Message (muc 2.11)
    @Override
    public String describeRole() {
        return String.format(Message.DOCTOR_ROLE, specialization);
    }
}

// ===== model/Nurse.java — class con thu hai, cung goc Person =====
package model;

import constants.Message;

/**
 * MODEL con: mot y ta cung LA MOT nguoi.
 */
public class Nurse extends Person {

    // Khoa lam viec
    private String department;

    // Phan chung giao cho constructor cha, phan rieng tu gan
    public Nurse(String code, String name, String department) {
        super(code, name);
        this.department = department;
    }

    // Ban mo ta rieng cua y ta
    @Override
    public String describeRole() {
        return String.format(Message.NURSE_ROLE, department);
    }
}

// ----- constants/Message.java (them hai cau) -----
// Mo ta vai tro bac si; %s la chuyen khoa
public static final String DOCTOR_ROLE = "Bac si chuyen khoa %s";

// Mo ta vai tro y ta; %s la khoa
public static final String NURSE_ROLE = "Y ta khoa %s";</code></pre>
     <p>⚠️ <strong>Chỉ thêm khi bài THẬT SỰ có hai loại đối tượng chung gốc</strong> (Doctor + Nurse, Student +
     Teacher). Bịa một class cha cho <em>một</em> class con là gượng ép — thầy hỏi "tại sao" là bí.</p>

     <h3>4. Polymorphism — Đa hình</h3>
     <p><em>Cùng một lời gọi, nhiều cách chạy tuỳ đối tượng thật.</em></p>
     <pre><code>// ----- service/StaffServices.java (trich) — duyet theo kieu CHA, chay ban cua lop CON -----
// Liet ke vai tro cua moi nhan su; KHONG println o day — ket qua ve Controller roi sang View
public StaffResponseDTO getRoleList() {
    StaffResponseDTO responseDTO = new StaffResponseDTO();
    ArrayList&lt;String&gt; roleList = new ArrayList&lt;&gt;();

    // Java tu chon dung ban describeRole() cua Doctor hay Nurse luc CHAY, khong phai luc bien dich
    for (Person person : staffRepository.findAllPerson()) {
        roleList.add(person.describeRole());
    }

    responseDTO.setRoleList(roleList);
    return responseDTO;
}</code></pre>
     <p>Còn một dạng <strong>đã có sẵn</strong> trong bài mẫu mà ít bạn để ý: <code>toString()</code> của
     <code>Doctor</code> là <strong>override</strong> phương thức của <code>Object</code>. Khi Repository gọi
     <code>doctor.toString()</code> để dựng dòng kết quả (bài mẫu P0055:
     <code>foundMap.put(doctor.getCode(), doctor.toString())</code>), Java gọi bản của bạn chứ không gọi bản mặc
     định. Chuỗi đó đi Repository → Controller → View rồi mới được in. Đó là đa hình — chỉ ra chỗ này cũng được tính,
     không cần viết thêm gì.</p>

     <h3>Bảng tra nhanh khi thầy hỏi</h3>
     <table>
       <tr><th>Tính chất</th><th>Chỉ vào đâu</th><th>Một câu trả lời</th></tr>
       <tr><td>Encapsulation</td><td><code>Doctor</code>: field private + getter/setter</td><td>"Che dữ liệu, chỉ đổi qua setter; validate ở Main"</td></tr>
       <tr><td>Abstraction</td><td><code>Controller</code>, <code>Repository</code></td><td>"Main không biết dữ liệu lưu bằng gì"</td></tr>
       <tr><td>Inheritance</td><td><code>Doctor extends Person</code></td><td>"Dùng lại phần chung, không chép code"</td></tr>
       <tr><td>Polymorphism</td><td><code>@Override toString()</code>, <code>describeRole()</code></td><td>"Cùng lời gọi, chạy đúng bản của từng loại"</td></tr>
     </table>
     ${sangCodeLab(P0055, 'J1.S.P0055 — soi 4 tính chất trong Starter code')}`),
},
{
  slug: `${TIEN_TO}access-modifier-static`,
  titleEn: 'C.2 — Access modifiers and static: where mentors reject most',
  titleVi: 'C.2 — Access modifier và static: hai chỗ bị reject nhiều nhất',
  desc: 'Bảng phạm vi, dùng cái nào ở đâu, static được ở đâu và cấm ở đâu, và kiểu trả về void hay String.',
  html: noiDung('Phần C · Bài 11.2',
    'Access modifiers & static',
    `<p class="lead">Two topics the mentor rejects on most often — and both have short, exact answers.</p>
     <p>static methods are required in <code>utils</code> and allowed in <code>Main</code> (never static
     variables there); constants and messages are <code>static final</code>; Model and Controller never use
     static.</p>`,
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
       <code>private void checkDatabase()</code> trong <code>DoctorRepository</code> của bài mẫu). Để
       <code>public</code> là thầy hỏi "ai gọi hàm này từ ngoài?".</li>
       <li><strong><code>protected</code> chỉ khi có kế thừa thật</strong> — field của class cha cho class con dùng.</li>
       <li><strong>Field của Controller</strong> (<code>doctorRepository</code>, <code>doctorView</code>) →
       <code>private</code>, gán trong constructor.</li>
       <li><strong>Field của View</strong> (<code>responseDTO</code>) → <code>private</code>, nhận qua setter
       <code>setResponseDTO(...)</code> — View nhận dữ liệu qua thuộc tính (tờ checklist 1.1).</li>
       <li>Hằng trong <code>Message</code>/<code>Constants</code> là ngoại lệ có chủ đích:
       <code>public static final</code>, vì mọi tầng phải đọc được <code>Message.MENU</code>.</li>
     </ul>
     <p><strong>Trả lời:</strong> "Em để <code>private</code> vì ngoài class này không ai cần chạm tới nó. Cái gì cần
     lộ ra thì em mở bằng method <code>public</code>. Mở rộng hơn mức cần thiết là tự tạo chỗ để người khác phá vỡ
     đóng gói."</p>

     <h3>static — được ở đâu, cấm ở đâu</h3>
     <table>
       <tr><th>Package</th><th>Luật của thầy (Guide + tờ checklist)</th></tr>
       <tr><td><code>utils</code> (Validation, FileUtils…)</td><td><strong>"phải dùng static method"</strong>, class <code>final</code>, constructor <code>private</code></td></tr>
       <tr><td><code>main/Main</code></td><td><strong>"cấm static với biến, có thể dùng với hàm"</strong>; Main chỉ có hàm static nên <code>final</code> + constructor <code>private</code> (mục 3.4)</td></tr>
       <tr><td><code>constants</code></td><td>hằng số và message khai <strong><code>static final</code></strong> (mục 2.10, 2.11)</td></tr>
       <tr><td><code>controller</code></td><td><strong>"không static"</strong></td></tr>
       <tr><td><code>model</code></td><td><strong>"không được dùng static"</strong></td></tr>
       <tr><td><code>view</code>, <code>repository</code>, <code>service</code></td><td>không cần static — Singleton (bài 11.4) là ngoại lệ phải hỏi thầy trước</td></tr>
     </table>
     <p>Tóm lại: <strong>static method</strong> ở <code>utils</code> (bắt buộc) và ở <code>Main</code>;
     <strong>hằng <code>static final</code></strong> ở <code>Constants</code>/<code>Message</code>;
     <strong>cấm</strong> ở Model, Controller và biến của Main. Gọi hàm/biến static qua <strong>tên class</strong>
     (<code>Validation.getChoice(...)</code>, mục 3.1). Ba câu hỏi và đáp án đầy đủ ở bài <strong>10.5</strong>.</p>

     <h3>Kiểu trả về — câu hỏi thứ ba</h3>
     <ul>
       <li><code>void</code> — hàm <strong>làm một việc</strong>, không có kết quả cần trả: <code>addDoctor()</code>,
       <code>display()</code>. Lỗi thì <strong>ném exception</strong>, không trả mã lỗi.</li>
       <li><code>boolean</code> — hàm <strong>hỏi một câu có/không</strong>: <code>isExistDoctor()</code>,
       <code>isEmpty()</code>. Đặt tên bắt đầu bằng <code>is</code>/<code>has</code>.</li>
       <li><code>String</code> — hàm <strong>tạo chuỗi cho nơi khác dùng</strong>: <code>toString()</code>.
       Chú ý nó <em>trả về</em> chuỗi chứ <strong>không in</strong>, vì Model cấm in.</li>
       <li><code>Map</code>/<code>ArrayList</code> — hàm <strong>trả về tập kết quả</strong>:
       <code>searchDoctor()</code>, <code>findAllDoctor()</code>.</li>
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
     principles in Java, inside the doctor-management context — and inside the mentor's architecture: Main only
     creates the controller, the controller only knows the service, and file reading stays in Main.</p>`,
    'SOLID bằng Java',
    `<p class="lead">⚠️ Bộ slide SOLID của thầy viết bằng <strong>C#</strong> (<code>public string Name { get; set; }</code>,
     <code>Console.WriteLine</code>). Bạn không chép thẳng được. Dưới đây là năm nguyên lý bằng <strong>Java</strong>,
     đặt trong chính ngữ cảnh quản lý bác sĩ — và vẫn đúng kiến trúc 9 package của thầy.</p>
     <p>Nhớ: slide nội quy ghi <em>"Implement và hiểu SOLID được cộng LOC"</em>. Đây là tiền.</p>

     ${anh(`${R2S}/sol-03.png`, 'Slide 3 — Năm nguyên lý SOLID.')}

     <h3>S — Single Responsibility</h3>
     <p><em>Mỗi class chỉ có MỘT lý do để thay đổi.</em> Đây là nguyên lý bạn <strong>đã tuân thủ</strong> nếu làm
     đúng kiến trúc 9 package — và là điều slide 7 của thầy nhấn mạnh riêng. Tờ checklist cũng chấm nó: mục 1.3
     "Đảm bảo S trong SOLID", mục 1.4 "Đảm bảo SRP".</p>
     ${anh(`${R2S}/sol-05.png`, 'Slide 5 — SRP: một class ôm bốn trách nhiệm thì có bốn lý do phải sửa.')}
     <pre><code>// ❌ Vi pham: mot class om het bon viec — bon ly do de phai sua no
public class DoctorManager {

    // nghiep vu
    public void addDoctor() {
    }

    // luu tru
    public void saveFile() {
    }

    // hien thi
    public void printList() {
    }

    // kiem tra du lieu
    public boolean checkName() {
        return true;
    }
}

// Doi cach hien thi -&gt; sua class nay. Doi cach luu -&gt; cung sua class nay.

// ✅ Dung SRP — moi trach nhiem mot class, dung cau truc 9 package
// model/Doctor                 -&gt; chi giu du lieu mot bac si
// repository/DoctorRepository  -&gt; chi giu du lieu + CRUD
// service/DoctorServices       -&gt; chi nghiep vu tinh toan (khi bai co)
// view/DoctorView              -&gt; chi hien thi (nhan ResponseDTO qua thuoc tinh)
// utils/Validation             -&gt; chi kiem tra du lieu (Main goi)
// controller/DoctorController  -&gt; chi dieu huong
// main/Main                    -&gt; chi nhap + validate + goi controller</code></pre>
     <p><strong>Trả lời:</strong> "Em tách theo SRP: <code>Doctor</code> chỉ có một lý do để đổi là khi thông tin bác
     sĩ đổi. <code>DoctorView</code> chỉ đổi khi cách hiển thị đổi. Hai thứ độc lập nên em không để chung."</p>

     <h3>O — Open/Closed</h3>
     ${anh(`${R2S}/sol-09.png`, 'Slide 9 — OCP: mở rộng bằng cách THÊM lớp mới, không mở lớp cũ ra sửa.')}
     <pre><code>// ❌ Vi pham OCP: them kieu tim moi la phai mo ham nay ra sua
if (requestDTO.getSearchType() == Constants.SEARCH_BY_NAME) {
    // tim theo ten ...
} else if (requestDTO.getSearchType() == Constants.SEARCH_BY_SPECIALIZATION) {
    // tim theo chuyen khoa ...
}

// ===== ✅ service/ISearchCriteria.java — hop dong chung =====
package service;

import model.Doctor;

/**
 * Tieu chi tim kiem: interface bat dau bang "I" (muc 1.3).
 */
public interface ISearchCriteria {

    // Tra loi: bac si nay co khop tu khoa khong
    boolean isMatched(Doctor doctor, String keyword);
}

// ===== ✅ service/NameSearchCriteria.java — moi kieu tim mot class, ten la DANH TU =====
package service;

import model.Doctor;

/**
 * Tim theo ten, khong phan biet hoa thuong (muc 3.5).
 */
public class NameSearchCriteria implements ISearchCriteria {

    // Khop khi ten chua tu khoa, bo qua hoa/thuong
    @Override
    public boolean isMatched(Doctor doctor, String keyword) {
        return doctor.getName().toLowerCase().contains(keyword.toLowerCase());
    }
}

// ===== ✅ service/SpecializationSearchCriteria.java =====
package service;

import model.Doctor;

/**
 * Tim theo chuyen khoa, khong phan biet hoa thuong.
 */
public class SpecializationSearchCriteria implements ISearchCriteria {

    // Khop khi chuyen khoa chua tu khoa, bo qua hoa/thuong
    @Override
    public boolean isMatched(Doctor doctor, String keyword) {
        return doctor.getSpecialization().toLowerCase().contains(keyword.toLowerCase());
    }
}

// ===== ✅ service/DoctorServices.java — ban cho OCP (chi phan tim kiem) =====
package service;

import constants.Constants;
import dto.DoctorRequestDTO;
import dto.DoctorResponseDTO;
import java.util.HashMap;
import java.util.LinkedHashMap;
import model.Doctor;
import repository.DoctorRepository;

/**
 * SERVICE: chi Controller goi; tra ResponseDTO, khong tra Model.
 */
public class DoctorServices {

    // Kho du lieu (Services -&gt; Repository -&gt; Model)
    private DoctorRepository doctorRepository;

    // Kieu tim Main da goi trong DTO -&gt; tieu chi tuong ung
    private HashMap&lt;Integer, ISearchCriteria&gt; criteriaMap;

    // Tao service cung kho; them kieu tim moi = them MOT class + MOT dong put
    public DoctorServices() {
        doctorRepository = new DoctorRepository();
        criteriaMap = new HashMap&lt;&gt;();
        criteriaMap.put(Constants.SEARCH_BY_NAME, new NameSearchCriteria());
        criteriaMap.put(Constants.SEARCH_BY_SPECIALIZATION, new SpecializationSearchCriteria());
    }

    // Tim theo tieu chi trong DTO; ham nay KHONG BAO GIO phai sua khi them kieu tim
    public DoctorResponseDTO searchDoctor(DoctorRequestDTO requestDTO) {
        DoctorResponseDTO responseDTO = new DoctorResponseDTO();
        LinkedHashMap&lt;String, String&gt; foundMap = new LinkedHashMap&lt;&gt;();
        ISearchCriteria criteria = criteriaMap.get(requestDTO.getSearchType());

        // duyet toan bo bac si, giu lai nhung ai khop tieu chi
        for (Doctor doctor : doctorRepository.findAllDoctor()) {
            // khop thi lay dong toString() cua bac si do
            if (criteria.isMatched(doctor, requestDTO.getSearchText())) {
                foundMap.put(doctor.getCode(), doctor.toString());
            }
        }

        responseDTO.setDoctorMap(foundMap);
        return responseDTO;
    }
}</code></pre>
     <p>Thêm kiểu tìm mới = thêm <strong>một</strong> class + <strong>một</strong> dòng <code>put</code>;
     <code>searchDoctor</code> không bao giờ phải mở ra sửa. Main vẫn chỉ gói lựa chọn vào DTO và gọi controller
     một lần.</p>

     <h3>L — Liskov Substitution</h3>
     ${anh(`${R2S}/sol-13.png`, 'Slide 13 — LSP: class con phải thay được class cha mà chương trình vẫn đúng.')}
     <pre><code>// ===== ❌ model/Rectangle.java — class cha =====
package model;

/**
 * ❌ Hinh chu nhat: rong va cao dat RIENG duoc — do la loi hua cua class nay.
 */
public class Rectangle {

    // Chieu rong
    protected double width;

    // Chieu cao
    protected double height;

    // Dat chieu rong
    public void setWidth(double width) {
        this.width = width;
    }

    // Dat chieu cao
    public void setHeight(double height) {
        this.height = height;
    }

    // Dien tich = rong x cao
    public double calculateArea() {
        return width * height;
    }
}

// ===== ❌ model/Square.java — hinh vuong buoc rong = cao, nen PHA loi hua cua cha =====
package model;

/**
 * ❌ Vi pham LSP: dat rong thi cao cung doi theo.
 */
public class Square extends Rectangle {

    // Dat rong: cao cung doi theo
    @Override
    public void setWidth(double width) {
        this.width = width;
        this.height = width;
    }

    // Dat cao: rong cung doi theo
    @Override
    public void setHeight(double height) {
        this.width = height;
        this.height = height;
    }
}

// ----- Doan code DUNG voi Rectangle nhung SAI voi Square -----
rectangle.setWidth(5);
rectangle.setHeight(10);

// Mong doi 50. Truyen vao mot Square thi ra 100 -&gt; chuong trinh sai ma khong bao loi.

// ===== ✅ model/IShape.java — dung chung hop dong thay vi extends =====
package model;

/**
 * ✅ Hop dong chung cua moi hinh; interface bat dau bang "I" (muc 1.3).
 */
public interface IShape {

    // Dien tich cua hinh
    double calculateArea();
}

// ===== ✅ model/SquareShape.java — RectangleShape viet y het, voi width va height =====
package model;

/**
 * ✅ Hinh vuong: khong ke thua hinh chu nhat, nen khong co loi hua nao de pha.
 */
public class SquareShape implements IShape {

    // Do dai canh
    private double side;

    // Tao hinh vuong
    public SquareShape(double side) {
        this.side = side;
    }

    // Dien tich = canh x canh
    @Override
    public double calculateArea() {
        return side * side;
    }
}</code></pre>
     <p><strong>Quy tắc rút ra:</strong> "là một" trong đời thực <strong>không</strong> đủ để dùng
     <code>extends</code>. Chỉ kế thừa khi class con <em>giữ nguyên được mọi lời hứa</em> của class cha.</p>

     <h3>I — Interface Segregation</h3>
     ${anh(`${R2S}/sol-17.png`, 'Slide 17 — ISP: đừng ép client cài method nó không dùng.')}
     <pre><code>// ===== ❌ repository/IDoctorStore.java — moi kho deu bi ep co ca bon ham =====
package repository;

import dto.DoctorRequestDTO;
import java.util.ArrayList;

/**
 * ❌ Interface "to": kho trong bo nho cung bi ep cai phan tep.
 */
public interface IDoctorStore {

    // Them bac si
    boolean addDoctor(DoctorRequestDTO requestDTO) throws Exception;

    // Xoa bac si
    boolean deleteDoctor(DoctorRequestDTO requestDTO) throws Exception;

    // Nap du lieu tu cac dong Main da doc bang FileUtils
    void loadData(ArrayList&lt;String&gt; lineList) throws Exception;

    // Luu lai qua FileUtils (ham static trong utils)
    void saveData() throws Exception;
}

// Bai P0055 luu trong bo nho, khong dung tep -&gt; van phai cai loadData/saveData rong

// ===== ✅ repository/IDoctorRepository.java — phan moi kho deu can =====
package repository;

import dto.DoctorRequestDTO;

/**
 * ✅ Interface nho: chi CRUD.
 */
public interface IDoctorRepository {

    // Co bac si mang ma nay chua (1 tham so roi: hop le vi so tham so &lt; 3)
    boolean isExistDoctor(String code) throws Exception;

    // Them bac si tu du lieu Main da goi
    boolean addDoctor(DoctorRequestDTO requestDTO) throws Exception;

    // Xoa bac si theo ma trong DTO
    boolean deleteDoctor(DoctorRequestDTO requestDTO) throws Exception;
}

// ===== ✅ repository/IFileRepository.java — chi kho co tep moi can =====
package repository;

import java.util.ArrayList;

/**
 * ✅ Interface nho: chi phan tep. Kho KHONG tu doc tep — Main doc bang FileUtils.
 */
public interface IFileRepository {

    // Nap du lieu tu cac dong Main da doc bang FileUtils (to giay: doc file o Main)
    void loadData(ArrayList&lt;String&gt; lineList) throws Exception;

    // Luu lai qua FileUtils (ham static trong utils)
    void saveData() throws Exception;
}

// ----- Bai P0055: chi can phan CRUD -----
public class DoctorRepository implements IDoctorRepository {
    ...
}

// ----- Bai P0057 (co user.dat): cai them phan tep -----
public class UserRepository implements IUserRepository, IFileRepository {
    ...
}</code></pre>
     <p>Đọc tệp vẫn là việc của <strong>Main</strong> (tờ checklist 1.1): Main gọi
     <code>FileUtils.readLines(Constants.FILE)</code>, gói các dòng vào RequestDTO, gọi
     <code>controller.loadData(requestDTO)</code> một lần; Repository chỉ tách từng dòng rồi cất vào kho.</p>

     <h3>D — Dependency Inversion</h3>
     ${anh(`${R2S}/sol-21.png`, 'Slide 21 — DIP: cả module cấp cao lẫn cấp thấp đều phụ thuộc vào abstraction.')}
     <pre><code>// ❌ Vi pham DIP: Services gan CHAT vao mot loai kho cu the
private DoctorRepository doctorRepository = new DoctorRepository();

// Muon doi sang kho khac -&gt; phai di sua moi cho dung kieu DoctorRepository

// ===== ✅ service/DoctorServices.java — khai theo HOP DONG =====
package service;

import constants.Message;
import dto.DoctorRequestDTO;
import dto.DoctorResponseDTO;
import repository.DoctorRepository;
import repository.IDoctorRepository;

/**
 * SERVICE: chi Controller goi; phan than chi biet IDoctorRepository.
 */
public class DoctorServices {

    // Kieu cua field la INTERFACE (IDoctorRepository o phan ISP), khong phai class cu the
    private IDoctorRepository doctorRepository;

    // Cho DUY NHAT biet cai dat cu the: doi kho = sua MOT dong nay
    public DoctorServices() {
        doctorRepository = new DoctorRepository();
    }

    // Them bac si: chi dung nhung gi hop dong hua
    public DoctorResponseDTO addDoctor(DoctorRequestDTO requestDTO) throws Exception {
        DoctorResponseDTO responseDTO = new DoctorResponseDTO();

        // de bai: ma khong duoc trung
        if (doctorRepository.isExistDoctor(requestDTO.getCode())) {
            throw new Exception(String.format(Message.DUPLICATE_CODE, requestDTO.getCode()));
        }

        // luu roi tra cau ket qua cho Controller
        doctorRepository.addDoctor(requestDTO);
        responseDTO.setMessage(Message.ADD_SUCCESS);
        return responseDTO;
    }
}

// ----- repository/DoctorRepository.java — chi them "implements IDoctorRepository" -----
public class DoctorRepository implements IDoctorRepository {
    ...
}

// ----- controller/DoctorController.java — chi biet Services, KHONG import repository -----
// Tao controller cung service va view cua no
public DoctorController() {
    doctorServices = new DoctorServices();
    doctorView = new DoctorView();
}

// ----- main/Main.java — Main chi lam viec voi Controller, DTO, Utils -----
DoctorController controller = new DoctorController();</code></pre>
     <p><strong>Vì sao chỗ tạo nằm trong Services mà không ở Main?</strong> Guide ghi Main <em>"không gọi đến model
     và view, chỉ làm việc với DTO, validator, controller"</em>, còn Controller <em>"chỉ import DTO, View,
     Service"</em>. Nên trong kiến trúc của thầy, Main chỉ <code>new DoctorController()</code>, Controller chỉ tạo
     Services, và Services là nơi duy nhất biết class kho cụ thể. Phần còn lại của Services chỉ nói chuyện với
     <code>IDoctorRepository</code> — đổi kho là sửa một dòng, không đụng hàm nghiệp vụ nào.</p>

     <h3>Nên implement mấy nguyên lý?</h3>
     <p><strong>Đừng nhồi cả 5 vào một bài nhỏ.</strong> Thầy nói bài Candidate <em>"cần implement đầy đủ SOLID →
     rất khó, không nên liều"</em> — nghĩa là đủ 5 là việc lớn.</p>
     <ul>
       <li><strong>SRP</strong> — miễn phí, đã có nhờ kiến trúc 9 package. Luôn nói được.</li>
       <li><strong>DIP</strong> — rẻ nhất để thêm: một interface cho Repository, field trong Services khai theo
       interface. ~15 LOC.</li>
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
     Singleton, Factory Method, Observer, Strategy. That is your scope.</p>
     <p>Every example below stays inside the mentor's architecture: patterns live in <code>service</code>,
     <code>repository</code> or <code>model</code>; Main packs the user's choice into a DTO and calls the
     controller once; nothing but the view prints. Singleton needs <code>static</code> inside the repository —
     ask your mentor before submitting it. Strategy and DIP need no static at all.</p>`,
    'Năm mẫu, không phải hai ba',
    `<p class="lead">Bộ slide <strong>89 trang, đủ 23 pattern GoF</strong> — đó là <em>từ điển tra cứu</em>.
     Còn <strong>sách <code>OOP_Java_Guide</code> của thầy chỉ chọn 5</strong>: Builder, Singleton, Factory Method,
     Observer, Strategy. <strong>Năm cái đó là phạm vi bạn phải thành thạo.</strong></p>
     <p>Thầy đánh giá cao nhất phần này — ai hiểu và áp dụng thành thạo thì pass sớm. Mọi ví dụ dưới đây vẫn đúng
     kiến trúc của thầy: pattern nằm trong <code>service</code>/<code>repository</code>/<code>model</code>, Main gói
     lựa chọn vào DTO và gọi controller đúng 1 lần, chỉ View được in.</p>

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
     <pre><code>// ===== repository/DoctorRepository.java — Singleton =====
package repository;

import dto.DoctorRequestDTO;
import java.util.LinkedHashMap;
import model.Doctor;

/**
 * REPOSITORY dang Singleton: ca chuong trinh chi co MOT kho.
 */
public class DoctorRepository {

    // Ban duy nhat cua kho. static vi no thuoc ve CLASS, khong thuoc doi tuong nao
    private static DoctorRepository instance = null;

    // Du lieu that — van private, khong ai cham thang
    private LinkedHashMap&lt;String, Doctor&gt; doctorMap;

    // private constructor: chan moi loi goi "new DoctorRepository()" tu ben ngoai
    private DoctorRepository() {
        doctorMap = new LinkedHashMap&lt;&gt;();
    }

    // Cua duy nhat de lay kho: lan dau thi tao, cac lan sau tra lai dung ban do
    public static DoctorRepository getInstance() {
        // chua co kho nao: tao ban dau tien
        if (instance == null) {
            instance = new DoctorRepository();
        }

        return instance;
    }

    // Them bac si dung tu DTO — Repository nhan DTO, khong bat ai khac cam Model
    public boolean addDoctor(DoctorRequestDTO requestDTO) {
        Doctor doctor = new Doctor(requestDTO.getCode(), requestDTO.getName(),
                requestDTO.getSpecialization(), requestDTO.getAvailability());

        // ma la khoa; true = da them
        doctorMap.put(doctor.getCode(), doctor);
        return true;
    }
}

// ----- service/DoctorServices.java (trich) — Services lay kho duy nhat -----
// Tao service: lay dung ban kho duy nhat, khong new
public DoctorServices() {
    doctorRepository = DoctorRepository.getInstance();
}</code></pre>
     <p>💡 Để ý trong slide: <code>Instance()</code> và <code>uniqueInstance</code> là <code>static</code>, còn
     <code>SingletonOperation()</code> thì <strong>không</strong>. Đó chính là câu trả lời cho "tại sao chỗ này
     static, chỗ kia không" — chỉ <em>cửa vào</em> và <em>bản duy nhất</em> mới static.</p>
     <p><strong>Consequences — được gì:</strong> mọi nơi chắc chắn dùng chung một kho, không sợ dữ liệu phân mảnh.
     <strong>Mất gì:</strong> đây là <em>biến toàn cục trá hình</em> — khó test, và nó vi phạm <strong>DIP</strong>
     vì Services gọi thẳng <code>DoctorRepository.getInstance()</code> thay vì làm việc qua một interface.</p>
     <p>⚠️ <strong>Với kiến trúc của thầy:</strong> Singleton buộc có field <code>static</code> và method
     <code>static</code> ngay trong Repository, mà Guide chỉ cho static method ở <code>utils</code> (bắt buộc) và hàm
     của <code>Main</code>. <strong>Hỏi thầy trước khi nộp bài có Singleton.</strong> Cách không cần static mà vẫn
     "một kho duy nhất": Main chỉ <code>new</code> <strong>một</strong> Controller, Controller tạo Services một lần,
     Services tạo Repository một lần trong constructor — cả chương trình tự nhiên chỉ có một kho.</p>
     <p><strong>Bẫy khi thầy vặn "Singleton có phải lúc nào cũng tốt không?"</strong> — trả lời trung thực:
     <em>"Không ạ. Nó tiện nhưng làm class phụ thuộc cứng vào nhau, khó test, và phải dùng static trong Repository.
     Bài này 'một kho' em đạt được bằng cách Services tạo Repository đúng một lần; cần thay kho để kiểm thử thì em
     khai field theo interface (DIP) thay vì Singleton."</em></p>

     <h3>② Factory Method — nơi khác quyết định tạo loại nào</h3>
     ${anh(`${R2S}/dp-29.png`, 'Slide 29 — Factory Method: biết LÚC NÀO cần tạo, không biết tạo LOẠI nào.')}
     ${anh(`${R2S}/dp-30.png`, 'Slide 30 — Creator khai báo factory method, ConcreteCreator quyết định ConcreteProduct.')}
     <pre><code>// ===== service/PersonFactory.java — noi DUY NHAT biet "loai nao thi new class nao" =====
package service;

import constants.Constants;
import constants.Message;
import dto.StaffRequestDTO;
import model.Doctor;
import model.Nurse;
import model.Person;

/**
 * FACTORY: dung dung lop con theo loai Main da goi trong DTO. Khong static.
 */
public class PersonFactory {

    // Dung dung lop con theo loai nhan su trong DTO
    public Person createPerson(StaffRequestDTO requestDTO) throws Exception {
        // moi loai nhan su mot nhanh; them Technician chi sua o day
        switch (requestDTO.getStaffType()) {
            // bac si: co chuyen khoa va so ca truc
            case Constants.STAFF_DOCTOR:
                return new Doctor(requestDTO.getCode(), requestDTO.getName(),
                        requestDTO.getSpecialization(), requestDTO.getAvailability());

            // y ta: co khoa lam viec
            case Constants.STAFF_NURSE:
                return new Nurse(requestDTO.getCode(), requestDTO.getName(),
                        requestDTO.getDepartment());

            // loai chua ai day factory cach tao
            default:
                throw new Exception(Message.INVALID_STAFF_TYPE);
        }
    }
}

// ----- service/StaffServices.java (trich) — chi Controller goi, tra ResponseDTO -----
// Them nhan su: factory dung Model, repository cat, Controller chi nhan cau ket qua
public StaffResponseDTO addPerson(StaffRequestDTO requestDTO) throws Exception {
    StaffResponseDTO responseDTO = new StaffResponseDTO();

    // Services -&gt; Factory -&gt; Model, roi Services -&gt; Repository
    staffRepository.addPerson(personFactory.createPerson(requestDTO));
    responseDTO.setMessage(Message.ADD_SUCCESS);
    return responseDTO;
}</code></pre>
     <p>Dùng khi bài có <strong>nhiều loại đối tượng cùng gốc</strong> (Doctor/Nurse của bài 11.1, Car showroom: xe
     máy / ô tô). Factory nằm trong <code>service</code> vì Controller không được làm việc với Model — việc dựng
     <code>Doctor</code>/<code>Nurse</code> chỉ xảy ra ở Services/Repository. Main hỏi loại nhân sự (đã validate),
     gói vào DTO, gọi controller đúng 1 lần. Bài chỉ có <em>một</em> loại thì Factory là thừa — thầy hỏi "tại sao
     cần?" mà bạn không có câu trả lời.</p>

     <h3>③ Builder — dựng đối tượng nhiều thuộc tính</h3>
     ${anh(`${R2S}/dp-22.png`, 'Slide 22 — Builder: tách việc DỰNG khỏi cách biểu diễn.')}
     ${anh(`${R2S}/dp-24.png`, 'Slide 24 — Director điều khiển, ConcreteBuilder lắp từng phần, Product là thành phẩm.')}
     <pre><code>// ❌ Nhin vao loi goi nay, ai biet so 5 la gi? true la gi? 3 la gi?
Doctor doctor = new Doctor("D01", "An", "Tim mach", 5, true, "Ca sang", 3);

// ===== model/DoctorBuilder.java — class RIENG, khong long static trong Doctor =====
package model;

/**
 * BUILDER: lap mot Doctor tung phan. KHONG static, KHONG validate (validate o Main), KHONG in.
 */
public class DoctorBuilder {

    // Thanh pham dang lap do
    private Doctor doctor;

    // Bat dau voi mot bac si rong (Doctor co constructor rong + setter nhu bai mau)
    public DoctorBuilder() {
        doctor = new Doctor();
    }

    // Dat ma; tra ve chinh builder de noi tiep loi goi
    public DoctorBuilder setCode(String code) {
        doctor.setCode(code);
        return this;
    }

    // Dat ho ten
    public DoctorBuilder setName(String name) {
        doctor.setName(name);
        return this;
    }

    // Dat chuyen khoa
    public DoctorBuilder setSpecialization(String specialization) {
        doctor.setSpecialization(specialization);
        return this;
    }

    // Dat so ca truc
    public DoctorBuilder setAvailability(int availability) {
        doctor.setAvailability(availability);
        return this;
    }

    // Giao thanh pham
    public Doctor build() {
        return doctor;
    }
}

// ----- repository/DoctorRepository.java (trich) — noi dung Model tu DTO -----
// Them bac si: doc nhu mot cau, khong phai dem vi tri tham so
public boolean addDoctor(DoctorRequestDTO requestDTO) {
    Doctor doctor = new DoctorBuilder()
            .setCode(requestDTO.getCode())
            .setName(requestDTO.getName())
            .setSpecialization(requestDTO.getSpecialization())
            .setAvailability(requestDTO.getAvailability())
            .build();

    // ma la khoa; true = da them
    doctorMap.put(doctor.getCode(), doctor);
    return true;
}</code></pre>
     <p><strong>Bài dưới 4 thuộc tính thì Builder là gượng ép</strong>, đừng dùng. Ba điều giữ Builder khỏi phá kiến
     trúc: nó là <strong>class riêng</strong> (không phải <code>static class</code> lồng trong Model — Guide: Model
     <em>"không được dùng static"</em>); <code>build()</code> <strong>không validate</strong> (validate ở Main); và
     nó được gọi ở <strong>Repository</strong> — nơi dựng Model từ DTO — chứ không ở Controller hay Main.</p>

     <h3>④ Strategy — đổi thuật toán lúc chạy ⭐ hợp LAB211 nhất</h3>
     ${anh(`${R2S}/dp-80.png`, 'Slide 80 — Thuật toán nhúng cứng vào class dùng nó, muốn đổi phải sửa chính nó.')}
     ${anh(`${R2S}/dp-81.png`, 'Slide 81 — Mỗi thuật toán tách thành class riêng, Context giữ tham chiếu tới interface.')}
     <pre><code>// ===== service/ISortStrategy.java — hop dong chung =====
package service;

import java.util.ArrayList;
import model.Doctor;

/**
 * STRATEGY: "biet cach sap xep mot danh sach bac si". Interface bat dau bang "I" (muc 1.3).
 */
public interface ISortStrategy {

    // Sap xep danh sach TAI CHO
    void sort(ArrayList&lt;Doctor&gt; doctorList);
}

// ===== service/NameSortStrategy.java — moi cach sap xep = mot class, ten la DANH TU =====
package service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import model.Doctor;

/**
 * Ten A-Z, khong phan biet hoa thuong (muc 3.5).
 */
public class NameSortStrategy implements ISortStrategy {

    // Sap theo ten, bo qua hoa/thuong
    @Override
    public void sort(ArrayList&lt;Doctor&gt; doctorList) {
        Collections.sort(doctorList,
                Comparator.comparing(Doctor::getName, String.CASE_INSENSITIVE_ORDER));
    }
}

// ===== service/AvailabilitySortStrategy.java =====
package service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import model.Doctor;

/**
 * Nhieu ca truc len truoc.
 */
public class AvailabilitySortStrategy implements ISortStrategy {

    // Sap theo so ca truc, giam dan
    @Override
    public void sort(ArrayList&lt;Doctor&gt; doctorList) {
        Collections.sort(doctorList,
                Comparator.comparingInt(Doctor::getAvailability).reversed());
    }
}

// ===== service/DoctorServices.java — Context: chi Controller goi =====
package service;

import constants.Constants;
import dto.DoctorRequestDTO;
import dto.DoctorResponseDTO;
import java.util.ArrayList;
import java.util.HashMap;
import model.Doctor;
import repository.DoctorRepository;

/**
 * SERVICE va Context cua Strategy: tra ResponseDTO, khong tra Model.
 */
public class DoctorServices {

    // Kho du lieu (Services -&gt; Repository -&gt; Model)
    private DoctorRepository doctorRepository;

    // Kieu sap xep Main da goi trong DTO -&gt; chien luoc tuong ung
    private HashMap&lt;Integer, ISortStrategy&gt; strategyMap;

    // Tao service cung kho va cac chien luoc; them kieu moi = them MOT dong put
    public DoctorServices() {
        doctorRepository = new DoctorRepository();
        strategyMap = new HashMap&lt;&gt;();
        strategyMap.put(Constants.SORT_BY_NAME, new NameSortStrategy());
        strategyMap.put(Constants.SORT_BY_AVAILABILITY, new AvailabilitySortStrategy());
    }

    // Sap xep theo lua chon trong DTO roi tra cac dong ket qua cho Controller
    public DoctorResponseDTO sortDoctor(DoctorRequestDTO requestDTO) {
        DoctorResponseDTO responseDTO = new DoctorResponseDTO();
        ArrayList&lt;Doctor&gt; doctorList = doctorRepository.findAllDoctor();
        ArrayList&lt;String&gt; rowList = new ArrayList&lt;&gt;();

        // chien luoc ung voi lua chon; sap tren BAN SAO nen kho giu nguyen thu tu nhap
        strategyMap.get(requestDTO.getSortType()).sort(doctorList);

        // moi bac si mot dong toString(); View chi viec in
        for (Doctor doctor : doctorList) {
            rowList.add(doctor.toString());
        }

        responseDTO.setRowList(rowList);
        return responseDTO;
    }
}

// ----- controller/DoctorController.java (trich) — chi dieu huong, cam DTO -----
// Chuc nang sap xep: Services lam, View in — dung 1 lan
public void sortDoctor(DoctorRequestDTO requestDTO) {
    DoctorResponseDTO responseDTO = doctorServices.sortDoctor(requestDTO);

    // dua ket qua cho View qua thuoc tinh roi render — 1 lan cho ca luong
    doctorView.setResponseDTO(responseDTO);
    doctorView.display();
}

// ----- main/Main.java (trich) — Main goi lua chon vao DTO, goi controller DUNG 1 lan -----
// chuc nang sap xep: hoi kieu sap xep (da validate), roi goi controller
case Constants.MENU_SORT:
    requestDTO = inputSort(sc);
    controller.sortDoctor(requestDTO);
    break;</code></pre>
     <p><code>findAllDoctor()</code> của Repository trả <strong>bản sao</strong> danh sách (bài 10.3), View in
     <code>rowList</code> bằng nhánh đã có sẵn trong <code>display()</code> (bài 10.4) — không thêm hàm hiển thị nào
     nhận tham số. Gần như bài quản lý nào cũng có "sắp xếp theo…" ⇒ đây là pattern <strong>tự nhiên nhất</strong>
     để dùng.</p>
     <p><strong>Trả lời:</strong> "Nếu viết <code>if/else</code> trong Service thì mỗi lần thêm kiểu sắp xếp em phải
     mở Service ra sửa — vi phạm OCP. Với Strategy, thêm kiểu mới chỉ là thêm một class và một dòng
     <code>put</code>, hàm <code>sortDoctor</code> đứng yên."</p>

     <h3>⑤ Observer — một chỗ đổi, nhiều chỗ tự biết</h3>
     ${anh(`${R2S}/dp-66.png`, 'Slide 66 — Subject giữ danh sách Observer; gọi Notify() thì mọi Observer tự Update().')}
     <pre><code>// ===== service/IDoctorObserver.java — hop dong cho ben "muon duoc bao" =====
package service;

/**
 * OBSERVER: interface bat dau bang "I" (muc 1.3).
 */
public interface IDoctorObserver {

    // Duoc goi sau moi thao tac; action la hang trong Constants, code la ma bac si
    void update(String action, String code);
}

// ===== service/HistoryObserver.java — mot ben nghe: ghi lai lich su thao tac =====
package service;

import constants.Constants;
import java.util.ArrayList;

/**
 * Ghi lich su vao bo nho. KHONG in — muon xem thi hoi qua Services, roi Controller -&gt; View.
 */
public class HistoryObserver implements IDoctorObserver {

    // Moi thao tac mot dong, theo thu tu xay ra (muc 1.5: ten ket thuc bang List)
    private ArrayList&lt;String&gt; historyList;

    // Bat dau voi lich su rong
    public HistoryObserver() {
        historyList = new ArrayList&lt;&gt;();
    }

    // Ghi them mot dong "ADD: D01"; dinh dang nam o Constants (muc 2.10)
    @Override
    public void update(String action, String code) {
        historyList.add(String.format(Constants.HISTORY_FORMAT, action, code));
    }

    // Tra BAN SAO lich su de Services dua vao ResponseDTO
    public ArrayList&lt;String&gt; getHistoryList() {
        return new ArrayList&lt;&gt;(historyList);
    }
}

// ===== service/DoctorServices.java — Subject: ben phat tin =====
package service;

import constants.Constants;
import constants.Message;
import dto.DoctorRequestDTO;
import dto.DoctorResponseDTO;
import java.util.ArrayList;
import repository.DoctorRepository;

/**
 * SERVICE va Subject cua Observer: chi Controller goi; tra ResponseDTO.
 */
public class DoctorServices {

    // Kho du lieu (Services -&gt; Repository -&gt; Model)
    private DoctorRepository doctorRepository;

    // Nhung ben dang lang nghe (muc 1.5: ten ket thuc bang List)
    private ArrayList&lt;IDoctorObserver&gt; observerList;

    // Ben ghi lich su — giu rieng de tra loi chuc nang "xem lich su"
    private HistoryObserver historyObserver;

    // Tao service, kho, va dang ky cac ben nghe
    public DoctorServices() {
        doctorRepository = new DoctorRepository();
        observerList = new ArrayList&lt;&gt;();
        historyObserver = new HistoryObserver();
        observerList.add(historyObserver);
    }

    // Dang ky nhan tin
    public void addObserver(IDoctorObserver observer) {
        observerList.add(observer);
    }

    // Bao cho TAT CA ben dang nghe
    private void notifyObserver(String action, String code) {
        // moi ben nghe tu quyet lam gi voi tin nay
        for (IDoctorObserver observer : observerList) {
            observer.update(action, code);
        }
    }

    // Them bac si; them xong thi bao tin — Services khong biet ai dang nghe
    public DoctorResponseDTO addDoctor(DoctorRequestDTO requestDTO) throws Exception {
        DoctorResponseDTO responseDTO = new DoctorResponseDTO();

        // de bai: ma khong duoc trung
        if (doctorRepository.isExistDoctor(requestDTO.getCode())) {
            throw new Exception(String.format(Message.DUPLICATE_CODE, requestDTO.getCode()));
        }

        // cat vao kho, bao tin, roi tra cau ket qua cho Controller
        doctorRepository.addDoctor(requestDTO);
        notifyObserver(Constants.ACTION_ADD, requestDTO.getCode());
        responseDTO.setMessage(Message.ADD_SUCCESS);
        return responseDTO;
    }

    // Chuc nang "xem lich su": du lieu ve Controller roi sang View, render 1 lan
    public DoctorResponseDTO getHistory() {
        DoctorResponseDTO responseDTO = new DoctorResponseDTO();

        // lich su do ben nghe giu, Services chi chuyen vao ResponseDTO
        responseDTO.setRowList(historyObserver.getHistoryList());
        return responseDTO;
    }
}</code></pre>
     <p>Trong console ít tự nhiên hơn 4 cái trên, nhưng hợp lý ở chỗ <strong>ghi lịch sử / đếm số lượng</strong> mỗi
     khi dữ liệu đổi. ⚠️ Observer <strong>không in</strong> (Guide: <em>"Không được gọi print ngoài view và
     main"</em>): nó giữ kết quả trong bộ nhớ; muốn xem thì người dùng chọn chức năng "xem lịch sử", Controller gọi
     <code>getHistory()</code> rồi đưa ResponseDTO cho View — đúng 1 lần.</p>

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
       <tr><td><code>P0055</code> Doctor · <code>P0054</code> Contact · <code>P0056</code> Worker</td><td>Strategy (sắp xếp) + DIP (interface kho)</td></tr>
       <tr><td><code>P0057</code> User (có user.dat)</td><td>Strategy + DIP, tách interface kho bộ nhớ / kho tệp theo ISP (Main đọc tệp bằng FileUtils, kho chỉ nạp các dòng Main đưa)</td></tr>
       <tr><td><code>P0066</code> Car showroom</td><td>Factory Method (nhiều loại xe)</td></tr>
       <tr><td><code>P0073</code> Handy Expense</td><td>Strategy + Observer (cảnh báo vượt hạn mức)</td></tr>
       <tr><td><code>P0071</code> Task management</td><td>Strategy + Observer + Builder</td></tr>
     </table>
     <p><strong>Bài đầu chỉ làm Strategy (+ DIP) cho chắc tay</strong> — cả hai nằm trong service/repository, không
     cần static. Singleton cần static trong Repository: hỏi thầy trước. Hiểu sâu 2 cái còn hơn kể tên 5 cái.</p>
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
       <tr><td><strong>Realization</strong></td><td>"cam kết làm được"</td><td><code>implements</code></td><td><code>NameSortStrategy implements ISortStrategy</code></td></tr>
       <tr><td><strong>Dependency</strong></td><td>"dùng tạm một lúc"</td><td>Tham số / biến cục bộ</td><td><code>addDoctor(DoctorRequestDTO requestDTO)</code></td></tr>
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
       <li>một–nhiều → tập hợp: <code>private ArrayList&lt;Doctor&gt; doctorList;</code> (tờ checklist 1.5:
       biến kiểu collection kết thúc bằng <code>List</code>, Set bằng <code>Set</code>, Map bằng <code>Map</code>)</li>
       <li>tuỳ chọn (0..1) → tham chiếu có thể <code>null</code>, <strong>phải kiểm tra trước khi dùng</strong></li>
     </ul>`),
},
{
  slug: `${TIEN_TO}12-cau-review`,
  titleEn: 'C.6 — The 12 review questions, with model answers',
  titleVi: 'C.6 — 12 câu hỏi review kèm đáp án mẫu',
  desc: 'Ôn ngay trước khi giơ tay xin review: 12 câu hỏi kèm đáp án chỉ vào source, và tờ Coding check sheet 25 mục tự soát 3 lượt.',
  html: noiDung('Phần C · Bài 11.6',
    'The oral defence',
    `<p class="lead">Answer by pointing at your own code. Reciting definitions is how people fail this part.</p>
     <p>Before raising your hand, review your own source against the mentor's 25-item <strong>Coding check
     sheet</strong>: mark "O" on every item that is OK, one column per lab with three rounds; only when the whole
     column is "O" do you ask for a review.</p>`,
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
     → Vì ngoài class không ai cần chạm thẳng; dữ liệu chỉ đổi qua setter. Còn kiểm tra dữ liệu thì nằm ở
     <code>utils/Validation</code>, Main gọi — tờ checklist bắt validate ở Main, Model chỉ mô tả thực thể.</p>

     <p><strong>4. Tại sao <code>Validation</code> dùng <code>static</code>?</strong><br/>
     → Hàm thuần, không phụ thuộc trạng thái đối tượng, gọi từ nhiều nơi. Không static thì phải
     <code>new Validation()</code> — tạo đối tượng rỗng vô nghĩa.</p>

     <p><strong>5. Bỏ <code>static</code> đi thì sao?</strong><br/>
     → Không biên dịch được ở mọi chỗ gọi <code>Validation.getChoice(...)</code>.</p>

     <p><strong>6. Không dùng <code>static</code> thì sửa source thế nào cho chạy?</strong><br/>
     → Bỏ <code>private</code> ở constructor, tạo <code>Validation validation = new Validation();</code> trong Main,
     đổi mọi lời gọi thành <code>validation.getChoice(...)</code>.</p>

     <p><strong>7. Tại sao method này trả về <code>void</code>, method kia trả về <code>String</code>?</strong><br/>
     → <code>void</code> khi hàm chỉ làm việc, lỗi thì ném exception. <code>String</code> khi cần trả chuỗi cho nơi
     khác dùng — như <code>toString()</code>, vì Model cấm in.</p>

     <p><strong>8. Tại sao dùng <code>ArrayList</code> mà không phải <code>List</code>? (hoặc ngược lại)</strong><br/>
     → <code>List</code> là <strong>giao diện</strong> — hợp đồng nói "có <code>add</code>, <code>get</code>,
     <code>size</code>". <code>ArrayList</code> là <strong>bản cài đặt</strong> bằng mảng động: lấy theo chỉ số rất
     nhanh, chèn/xoá giữa thì chậm. <code>LinkedList</code> cài cùng hợp đồng bằng danh sách liên kết, ngược lại.
     Tương tự <code>Map</code> là hợp đồng, <code>HashMap</code> cài bằng băm nên <strong>không giữ thứ tự</strong>,
     <code>LinkedHashMap</code> giữ thứ tự thêm vào, <code>TreeMap</code> sắp theo khoá. Tờ checklist không quy định
     khai báo kiểu nào — nó chấm <strong>tên</strong>: <code>doctorList</code>, <code>doctorMap</code> (mục 1.5).</p>

     <p><strong>9. Tại sao ở đây em dùng <code>HashMap</code> chứ không phải <code>ArrayList</code>?</strong><br/>
     → Vì tìm theo mã bác sĩ là thao tác chính. <code>HashMap</code> tra theo khoá gần như tức thì, còn
     <code>ArrayList</code> phải duyệt từ đầu. Và khoá là duy nhất nên chặn trùng mã luôn.</p>

     <p><strong>10. Em dùng Design Pattern gì, nó giải quyết vấn đề gì?</strong><br/>
     → Nêu <strong>tên</strong> → <strong>vấn đề trong bài này</strong> → <strong>class nào đóng vai gì</strong> →
     <strong>không dùng thì code xấu ra sao</strong>. Đủ bốn ý là đạt.</p>

     <p><strong>11. Em implement nguyên lý SOLID nào?</strong><br/>
     → SRP luôn có sẵn nhờ cấu trúc 9 package. Nói thêm một nguyên lý bạn <em>thật sự</em> làm (thường là DIP hoặc
     OCP), và chỉ đúng chỗ.</p>

     <p><strong>12. Debug cho thầy xem.</strong><br/>
     → Breakpoint <strong>Ctrl + F8</strong>, chạy <strong>Ctrl + F5</strong>, bước qua <strong>F8</strong>, bước vào
     trong <strong>F7</strong>. Tập trước ở nhà: đặt breakpoint tại <code>addDoctor</code> và xem
     <code>requestDTO</code> mang giá trị gì.</p>

     <h3>Tờ Coding check sheet 25 mục — tự soát trước khi xin review</h3>
     <p>Thầy review code bằng đúng tờ <strong>"Coding check sheet"</strong> này — <strong>25 mục</strong>, chép theo
     tờ giấy. Sai một mục là bị trả về. Tờ giấy là chuẩn cao nhất: chỗ nào bài giảng nói khác, theo tờ giấy.</p>
     <h4>Cách điền — 3 lượt cho mỗi bài</h4>
     <ul>
       <li>Đầu tờ ghi <strong>Mã - Tên SV</strong>. Tờ có 5 cột <em>Date</em>, mỗi cột dành cho <strong>một
       bài</strong>: ghi ngày bắt đầu làm, bên dưới ghi mã bài (vd <code>P0061</code>).</li>
       <li>Mỗi cột chia <strong>3 ô con = 3 lượt</strong> tự check / yêu cầu review cho bài đó.</li>
       <li>Code xong, tự review source theo từng mục; mục nào đã OK thì điền <strong>"O"</strong> vào ô của lượt
       đang làm.</li>
       <li><strong>Khi tất cả các mục trên cột đó đã là "O"</strong> mới giơ tay yêu cầu thầy review.</li>
       <li>Thầy trả về → sửa → soát lại <em>cả 25 mục</em> ở ô của lượt kế tiếp (sửa chỗ này hay làm hỏng chỗ khác),
       điền "O" lại từ đầu.</li>
     </ul>
     <h4>1. Common</h4>
     <ol>
       <li><strong>1.1 — Đúng MVC chưa?</strong>
         <ul>
           <li>☐ <strong>Main</strong> chỉ làm việc với Controller, DTO, Utils. Toàn bộ việc nhập dữ liệu / validate /
           đọc từ file / mã hoá thực hiện ở Main (Main được in menu, câu nhắc nhập và lỗi
           <code>e.getMessage()</code>; <em>kết quả</em> thì qua View). Mỗi <code>case</code> gọi controller
           <strong>1 lần</strong>.</li>
           <li>☐ <strong>Controller</strong> nhận input từ Main qua DTO, gửi/nhận data qua Services (Repository),
           <strong>không làm việc với Model</strong>, chỉ gửi kết quả cần hiển thị sang View. Không print.</li>
           <li>☐ <strong>Repository</strong> chỉ chứa data và CRUD đơn giản; có nghiệp vụ tính toán thì thêm Services:
           Controller ↔ Services ↔ Repository ↔ Model. <strong>Bắt buộc phải có repository.</strong></li>
           <li>☐ Hiển thị gì cũng gọi qua <strong>View</strong>; rendering chỉ <strong>1 lần cho 1 luồng</strong>
           (mỗi <code>case</code> của switch ở Main là 1 luồng).</li>
           <li>☐ <strong>Services/Repository</strong> nhận data từ Controller (qua tham số nếu số tham số &lt; 3, tức
           tối đa 2 — nhiều hơn thì gói DTO), xử lý rồi trả kết quả về Controller; được làm việc với Model; không
           print.</li>
           <li>☐ <strong>Model</strong> chỉ mô tả thực thể, không làm việc với View, không print.</li>
           <li>☐ <strong>View</strong> chỉ nhận thông tin từ Controller, <strong>qua thuộc tính</strong> (field
           ResponseDTO + setter, <code>display()</code> không tham số), không qua tham số.</li>
         </ul></li>
       <li>☐ <strong>1.2</strong> — Package viết chữ thường, thể hiện ý nghĩa chung của package.</li>
       <li>☐ <strong>1.3</strong> — Class bắt đầu bằng chữ hoa, tên bắt đầu bằng <strong>danh từ</strong>, thể hiện
       mục đích; đảm bảo S trong SOLID; class exception kết thúc bằng <code>Exception</code>; interface bắt đầu
       bằng <code>I</code>.</li>
       <li>☐ <strong>1.4</strong> — Method bắt đầu bằng chữ thường, tên bắt đầu bằng <strong>động từ</strong>, thể
       hiện mục đích; đảm bảo SRP.</li>
       <li>☐ <strong>1.5</strong> — Biến bắt đầu bằng chữ thường, có ý nghĩa; kiểu collection kết thúc bằng
       <code>List</code>, kiểu Set bằng <code>Set</code>, kiểu Map bằng <code>Map</code>, mảng bằng
       <code>Array</code>; viết <code>Id</code>, không viết <code>ID</code>.</li>
       <li>☐ <strong>1.6</strong> — Comment ngắn gọn, rõ ràng (Javadoc nếu cần). <strong>Mỗi method</strong> đều có
       comment ý nghĩa; <strong>mỗi block source</strong> đều có comment giải thích block đó làm gì.</li>
     </ol>
     <h4>2. Coding Convention (format bằng Alt+Shift+F trong NetBeans)</h4>
     <ol>
       <li>☐ <strong>2.1</strong> — <code>{</code> nằm cuối dòng, <code>}</code> nằm đầu dòng.</li>
       <li>☐ <strong>2.2</strong> — Block chỉ 1 dòng code cũng đặt trong <code>{}</code>.</li>
       <li>☐ <strong>2.3</strong> — 1 dòng (không tính comment) không dài quá <strong>100 ký tự</strong>; dài hơn thì
       ngắt sau toán tử logic, hạn chế ngắt giữa biểu thức trong <code>()</code>, ngắt trước toán hạng
       (<code>+ - *</code>…).</li>
       <li>☐ <strong>2.4</strong> — Mỗi khai báo biến trên 1 dòng.</li>
       <li>☐ <strong>2.5</strong> — Khai báo mảng thống nhất một kiểu: <code>Type[] anArray;</code></li>
       <li>☐ <strong>2.6</strong> — Biến khai báo tập trung ở <strong>đầu mỗi block</strong> code.</li>
       <li>☐ <strong>2.7</strong> — Mỗi statement nằm trên 1 dòng.</li>
       <li>☐ <strong>2.8</strong> — Có 1 dòng trống: giữa các method, giữa vùng khai báo biến và phần còn lại, trước
       block comment, trước line comment, giữa các block code xử lý logic.</li>
       <li>☐ <strong>2.9</strong> — Có 1 dấu cách: trước <code>(</code> (<code>if (</code>, <code>for (</code>), sau
       <code>,</code>, trước và sau các phép tính (<code>=</code>, <code>+</code>, <code>-</code>, <code>*</code>,
       <code>;</code> trong for…).</li>
       <li>☐ <strong>2.10</strong> — Mọi hằng số ở class riêng <code>Constants.java</code>: chữ hoa, phân cách bằng
       <code>_</code>, khai báo <code>static final</code>.</li>
       <li>☐ <strong>2.11</strong> — Mọi message ở class riêng <code>Message.java</code>: chữ hoa, phân cách bằng
       <code>_</code>, khai báo <code>static final</code>.</li>
     </ol>
     <h4>3. Performance</h4>
     <ol>
       <li>☐ <strong>3.1</strong> — Dùng tên class để truy cập biến, method static
       (<code>Validation.getChoice(...)</code>).</li>
       <li>☐ <strong>3.2</strong> — Không khai báo biến local trùng tên với biến ở tầng cao hơn.</li>
       <li>☐ <strong>3.3</strong> — Dùng <code>()</code> làm tường minh thứ tự phép tính:
       <code>if ((a == b) &amp;&amp; (c == d))</code>.</li>
       <li>☐ <strong>3.4</strong> — Class chỉ có static method thì có <code>private</code> constructor và khai báo
       <code>final</code>.</li>
       <li>☐ <strong>3.5</strong> — So sánh giá trị object (String…) bằng <code>equals</code>, không dùng
       <code>==</code>; so sánh text thì chú ý hoa/thường.</li>
       <li>☐ <strong>3.6</strong> — Không có biến khai báo mà không dùng.</li>
       <li>☐ <strong>3.7</strong> — Biến khai báo khi bắt đầu xử lý và <strong>được khởi tạo</strong>
       (<code>int choice = 0;</code>).</li>
       <li>☐ <strong>3.8</strong> — Cộng chuỗi dùng <code>StringBuilder</code> (hoặc <code>String.format</code>),
       không <code>String += String</code>.</li>
     </ol>
     <p><strong>Ngoài tờ giấy, slide 10 còn bốn cửa chặn:</strong> đã bấm Alt + Shift + F · đã chạy thử
     <strong>hết</strong> happy case và <strong>hết</strong> message lỗi · đặt được breakpoint và debug tại chỗ · trả
     lời được 12 câu ở trên.</p>
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
