/**
 * codelab-lab211-lesson.mjs — viết bài giảng cho module `lab211-assignments`
 * (track LAB211) vào CodeModule.lessonBlocks.
 *
 * Nội dung soạn TAY từ đúng bộ tài liệu giảng viên phát (Fall 2026):
 *   - Huong-dan-hoc-LAB211.pptx      → luật chơi, nội quy, bảng câu review
 *   - Guide.xlsx sheet 1/3/4         → kiến trúc 8 package + code mẫu J1.S.P0055
 *   - OOP_Java_Guide.docx            → 4 tính chất OOP, SOLID, 5 design pattern
 *   - SOLID-Principles.pptx (C#)     → đã dịch sang Java
 *   - Chapter_7 - Static Modeling    → 6 quan hệ giữa class
 *   - Java_codeconventions.pdf       → Sun 1997
 *   - Lab Grading policy.pdf         → 3 tiêu chí chấm
 *
 *   node scripts/codelab-lab211-lesson.mjs           # thử khô
 *   node scripts/codelab-lab211-lesson.mjs --apply   # ghi thật
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');

const H = (text) => ({ type: 'heading', text });
const P = (html) => ({ type: 'prose', html });
const C = (title, code, language = 'java') => ({ type: 'code', title, language, code });
const M = (code) => ({ type: 'mermaid', code });
const PART = (number, text, subtitle) => ({ type: 'part', number, text, subtitle });
// Ảnh cắt thẳng từ slide giảng viên phát, đã tải lên R2.
const R2 = 'https://media.cuongthai.com/code-lab/lab211/slide';
const IMG = (file, caption) => ({ type: 'image', url: `${R2}/${file}`, caption });

const blocks = [];
const add = (...b) => blocks.push(...b);

// ══════════════════════════════════════════════════════════════
add(
  PART('12', 'Luật chơi LAB211', 'Đọc mục này trước khi gõ dòng code đầu tiên'),

  P(`<p>LAB211 không chấm bằng điểm số mà bằng <strong>LOC (Lines Of Code) tích luỹ</strong>.
  Bạn cần <strong>≥ 750 LOC</strong> để qua môn. Mỗi bài làm xong, được giảng viên review đạt,
  thì cộng đúng số LOC chuẩn của bài đó.</p>`),

  H('Ba điều ít người biết'),
  P(`<ol>
  <li><strong>LOC của kỳ trước KHÔNG mất.</strong> Syllabus ghi rõ: <em>"If Students re-take the Lab
  course, the previously accumulated LOC is remained"</em>. Nhưng kèm theo đó là:
  <em>"students are not allowed to re-conduct previously completed assignments"</em> —
  <strong>bài đã pass thì không được làm lại</strong>. Vào hệ thống PTS xem mình đang có bao nhiêu LOC
  trước khi chọn bài.</li>
  <li><strong>Bài dài được tính LOC theo % hoàn thành.</strong> Với assignment kéo dài &gt; 5 slot:
  làm được 70% thì nhận 70% × LOC chuẩn. Đây là lưới an toàn — bài 350 LOC làm dở vẫn có điểm.</li>
  <li><strong>Vi phạm nội quy phòng lab → LOC về 0.</strong> Không phải trừ, mà là reset. Điện thoại,
  đồng hồ thông minh, tài liệu — để hết lên phía trên lớp.</li>
  </ol>`),

  H('Mức thưởng cuối kỳ'),
  P(`<table>
  <tr><th>LOC tích luỹ</th><th>Xếp loại</th></tr>
  <tr><td>750 – 950</td><td>PASSED</td></tr>
  <tr><td>951 – 1151</td><td>OOP-Blue Developer</td></tr>
  <tr><td>1152 – 1352</td><td>OOP-Yellow Developer</td></tr>
  <tr><td>≥ 1353</td><td>OOP-Red Developer</td></tr>
  </table>`),

  H('Cộng LOC thêm — hai đường'),
  P(`<p>Slide nội quy ghi thẳng: <em>"dùng được các tính chất như <strong>kế thừa, đa hình</strong> sẽ được
  cộng LOC. <strong>Implement và hiểu SOLID</strong> được cộng LOC"</em>.</p>
  <p>Nghĩa là làm tử tế thì cần <em>ít bài hơn</em>. Đây là lý do phần OOP và SOLID phía dưới đáng học
  thật chứ không phải học thuộc.</p>`),

  H('Bài nào nên chọn, bài nào tránh'),
  P(`<p>Giảng viên nói thẳng trong slide nội quy:</p>
  <ul>
  <li><strong>Buổi đầu tiên: bắt buộc làm <code>J1.S.P0055</code></strong> (Doctor management) <em>theo mẫu</em>,
  được mở file Guide, <strong>không tính LOC</strong>. Đây là bài tập kiến trúc — đừng lo pass/fail,
  hãy dùng nó để thuộc bộ khung.</li>
  <li><strong>Tránh <code>J1.L.P0022</code> (Candidate)</strong> — <em>"cần implement đầy đủ SOLID → rất khó,
  không nên liều"</em>.</li>
  <li><strong>Tránh <code>J1.L.P0023</code> (Mua bán hoa quả)</strong> — <em>"cần thiết kế được ERD… trong java
  console sẽ rất phức tạp → không nên chọn"</em>.</li>
  <li><strong>Bài thuật toán (Fibonacci, sắp xếp…) CŨNG phải làm MVC</strong> — <em>"không OOP/MVC →
  không review"</em>. Nghĩa là bài 21 LOC tốn <em>đúng bằng</em> bài 150 LOC về công dựng cấu trúc.
  <strong>Chọn bài LOC cao là lời.</strong></li>
  </ul>`),

  H('Quy tắc phòng lab'),
  P(`<ul>
  <li>Chỉ review tối đa <strong>3 bài / sinh viên / slot</strong>, và phải xin review
  <strong>trước khi hết giờ 30 phút</strong>.</li>
  <li>Trên hệ thống PTS chỉ chọn tối đa <strong>5 bài</strong> một lúc, xong bài nào mới chọn tiếp.</li>
  <li><strong>DRAFT</strong> = lưu tạm, sửa lại được. <strong>SUBMIT</strong> = chốt, không sửa được nữa —
  chỉ SUBMIT khi giảng viên đã đánh giá đạt.</li>
  <li>Điểm danh <strong>một lần duy nhất</strong>, trong 10 phút đầu.</li>
  </ul>`),

  H('Ba tiêu chí chấm (Grading Policy)'),
  P(`<ol>
  <li><strong>Program structure</strong> — đúng cấu trúc mô tả trong đề</li>
  <li><strong>Coding convention</strong> — tên file, tên hàm, tên biến, comment, định dạng câu lệnh</li>
  <li><strong>Meet the assignment requirements</strong> — chạy đúng yêu cầu</li>
  </ol>
  <p>Cả ba đều bắt buộc. Chạy đúng mà sai cấu trúc thì <em>không được review</em>.</p>`),
);

// ══════════════════════════════════════════════════════════════
add(
  PART('13', 'Kiến trúc 8 package', 'Sai cấu trúc = không được review, dù code chạy đúng'),

  P(`<p>Giảng viên gọi đây là <strong>"MVC của JSP"</strong>: cùng một mô hình với web Java, chỉ đổi lớp vỏ.
  Trong web, View là trang JSP và Controller là Servlet. Trong bài console, View là class chỉ lo in ra
  màn hình, còn Controller là class nhận lệnh rồi điều hướng. <strong>Cấu trúc y hệt nhau.</strong></p>`),

  H('Luồng dữ liệu — một chiều, không đi tắt'),
  M(`flowchart LR
  MAIN["main<br/>Main.java<br/><i>Scanner ở ĐÂY</i>"] -->|"RequestDTO"| CTRL["controller<br/>DoctorController"]
  CTRL -->|"gọi nghiệp vụ"| SRV["service<br/>DoctorServices<br/><i>(nếu có tính toán)</i>"]
  SRV -->|"CRUD"| REPO["repository<br/>DoctorRepository<br/><i>giữ dữ liệu</i>"]
  REPO -->|"tạo/đọc"| MODEL["model<br/>Doctor.java"]
  CTRL -->|"ResponseDTO"| VIEW["view<br/>DoctorView<br/><i>print ở ĐÂY</i>"]
  UTIL["utils/Validation<br/><i>static</i>"] -.->|"dùng chung"| MAIN
  CONST["constants/Message<br/><i>mọi câu chữ</i>"] -.-> MAIN
  CONST -.-> VIEW
  MODEL -. "KHÔNG BAO GIỜ" .-x VIEW`),

  P(`<p>Đường đứt nét gạch chéo giữa <code>model</code> và <code>view</code> là điều quan trọng nhất.
  File Guide ghi rõ: <em>"Model và View không giao tiếp với nhau"</em>. Model muốn hiện ra màn hình thì
  viết <code>toString()</code>, trả về Repository → Controller → View. Không có đường tắt.</p>`),

  H('Bảng: mỗi package được làm gì, cấm làm gì'),
  P(`<table>
  <tr><th>Package</th><th>File</th><th>ĐƯỢC làm</th><th>CẤM</th></tr>
  <tr><td><code>constants</code></td><td>Message.java<br/>Constants.java</td>
      <td>Mọi câu chữ hiển thị, hằng số, enum</td>
      <td>Hardcode câu chữ ở bất kỳ class nào khác</td></tr>
  <tr><td><code>dto</code></td><td>XxxRequestDTO<br/>XxxResponseDTO</td>
      <td>Request: main→controller. Response: controller→view</td>
      <td>Chứa logic xử lý</td></tr>
  <tr><td><code>main</code></td><td>Main.java</td>
      <td>Work flow chính, gọi Validation + Controller. <strong>Scanner CHỈ ở đây</strong></td>
      <td><strong>static với BIẾN</strong> (hàm thì được). Gọi model, gọi view</td></tr>
  <tr><td><code>controller</code></td><td>XxxController.java</td>
      <td>Điều hướng giữa Service/Repository và View. Import DTO, View, Service</td>
      <td><strong>static</strong>. Nhập bàn phím. <code>System.out</code></td></tr>
  <tr><td><code>model</code></td><td>Doctor.java</td>
      <td>Thuộc tính + hàm của đối tượng, <code>toString()</code></td>
      <td><strong>static</strong>. Scanner. <code>printf</code></td></tr>
  <tr><td><code>repository</code></td><td>XxxRepository.java</td>
      <td>Giữ dữ liệu (danh sách) + CRUD đơn giản</td>
      <td>Input/output, gọi View</td></tr>
  <tr><td><code>service</code></td><td>XxxServices.java</td>
      <td>Tính toán nghiệp vụ ngoài CRUD (tổng, chu vi, report). Nằm GIỮA Controller và Repository</td>
      <td>Input/output, gọi View</td></tr>
  <tr><td><code>utils</code></td><td>Validation.java</td>
      <td>Hàm dùng chung: validate, đọc/ghi file, mã hoá. <strong>BẮT BUỘC static</strong></td>
      <td>Giữ trạng thái. Cho phép <code>new</code></td></tr>
  <tr><td><code>view</code></td><td>XxxView.java</td>
      <td>Nhận ResponseDTO rồi in ra console</td>
      <td>Tính toán. Đọc bàn phím</td></tr>
  </table>`),

  H('Vì sao "không được truyền 3 tham số vào 1 hàm"'),
  P(`<p>Đây là câu nhiều bạn không hiểu. Nó <strong>không phải</strong> một luật đếm số tham số — nó là
  dấu hiệu cho biết bạn <em>chưa tách model</em>.</p>`),

  C('SAI — hàm phình ra vì thiếu model/DTO', `// Mỗi lần thêm một thuộc tính là phải sửa TẤT CẢ nơi gọi
public void addDoctor(String code, String name, String specialization, int availability) {
    ...
}`),

  C('ĐÚNG — gói vào DTO, truyền MỘT tham số', `// Thêm thuộc tính chỉ cần sửa trong DTO, chữ ký hàm đứng yên
public void addDoctor(DoctorRequestDTO requestDTO) throws Exception {
    // Kiểm tra code có bị trùng không
    if (doctorRepository.isDuplicate(requestDTO.getCode())) {
        throw new Exception(Message.DUPLICATE);
    }
    doctorRepository.addDoctor(requestDTO);
}`),

  P(`<p>Đó cũng chính là lý do giảng viên nhắc <strong>"code model trước, rồi đến data"</strong>:
  có <code>Doctor</code> (model) và <code>DoctorRequestDTO</code> rồi thì chữ ký hàm mới gọn được.
  Thứ tự gõ code đúng là: <strong>model → dto → repository → service → controller → view → main</strong>.</p>`),

  H('Ba luật vàng dễ quên nhất'),
  P(`<ol>
  <li><code>Scanner</code> <strong>chỉ xuất hiện trong Main.java</strong> — không ở đâu khác.</li>
  <li><code>System.out</code> <strong>chỉ xuất hiện trong View và Main</strong> — Controller/Service/Repository/Model
  tuyệt đối không in.</li>
  <li>Mỗi work flow chính <strong>chỉ gọi vào Controller đúng một lần</strong>.</li>
  </ol>`),
);

// ══════════════════════════════════════════════════════════════
add(
  PART('14', '4 tính chất OOP — soi thẳng vào bài P0055',
       'Thầy hỏi: "liệt kê 4 tính chất, rồi chỉ ra trong source của em"'),

  P(`<p>Đây là câu hỏi review gần như chắc chắn có. Học thuộc định nghĩa thôi thì trượt —
  phải <strong>chỉ đúng dòng code</strong> trong bài của mình.</p>`),

  H('1. Encapsulation — Đóng gói'),
  P(`<p><em>Gói dữ liệu và hành vi vào một class, che dữ liệu bên trong, chỉ mở ra qua getter/setter.</em></p>`),
  C('model/Doctor.java — chỉ ra chỗ này', `public class Doctor {
    // Đóng gói: thuộc tính private, bên ngoài KHÔNG chạm thẳng được
    private String code;
    private String name;
    private String specialization;
    private int availability;

    // Chỉ mở ra qua getter/setter public
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}`),
  P(`<p><strong>Trả lời thầy:</strong> "Em để field <code>private</code> nên không class nào sửa thẳng được
  <code>availability</code>. Muốn đọc/ghi phải qua <code>getAvailability()</code>/<code>setAvailability()</code>.
  Nếu sau này cần chặn số âm, em chỉ sửa trong setter, mọi nơi gọi không phải đổi gì."</p>`),

  H('2. Abstraction — Trừu tượng hoá'),
  P(`<p><em>Chỉ phơi ra <strong>cái gì làm được</strong>, giấu <strong>làm thế nào</strong>.</em></p>`),
  C('controller/DoctorController.java', `// Main chỉ biết "thêm bác sĩ", KHÔNG biết dữ liệu nằm trong HashMap,
// cũng không biết có kiểm tra trùng code hay không
public void addDoctor(DoctorRequestDTO requestDTO) throws Exception {
    if (doctorRepository.isDuplicate(requestDTO.getCode())) {
        throw new Exception(Message.DUPLICATE);
    }
    doctorRepository.addDoctor(requestDTO);
}`),
  P(`<p><strong>Trả lời thầy:</strong> "Main gọi <code>controller.addDoctor(dto)</code> là xong. Nó không biết
  em lưu bằng <code>HashMap</code> hay <code>ArrayList</code> hay file. Mai em đổi sang lưu file thì Main
  không phải sửa một dòng nào."</p>`),

  H('3. Inheritance — Kế thừa'),
  P(`<p><em>Class con dùng lại thuộc tính và hành vi của class cha.</em> Bài <code>P0055</code> mẫu
  <strong>chưa có</strong> kế thừa — mà slide nội quy ghi <em>"dùng được kế thừa, đa hình sẽ được cộng LOC"</em>.
  Đây là chỗ kiếm điểm.</p>`),
  C('Thêm kế thừa một cách TỰ NHIÊN (không gượng ép)', `// model/Person.java — phần chung của mọi con người trong hệ thống
public abstract class Person {
    protected String code;   // protected: class con dùng được, ngoài package thì không
    protected String name;

    public Person(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() { return code; }
    public String getName() { return name; }

    // Bắt buộc class con tự mô tả mình
    public abstract String moTaVaiTro();
}

// model/Doctor.java — kế thừa phần chung, thêm phần riêng
public class Doctor extends Person {
    private String specialization;
    private int availability;

    public Doctor(String code, String name, String specialization, int availability) {
        super(code, name);              // gọi constructor cha
        this.specialization = specialization;
        this.availability = availability;
    }

    @Override
    public String moTaVaiTro() {
        return "Bac si chuyen khoa " + specialization;
    }
}`),
  P(`<p><strong>Cảnh báo:</strong> chỉ thêm kế thừa khi bài <em>thật sự</em> có hai loại đối tượng chung gốc
  (Doctor + Nurse, Student + Teacher). Bịa ra một class cha cho <em>một</em> class con là gượng ép,
  thầy hỏi "tại sao" là bí ngay.</p>`),

  H('4. Polymorphism — Đa hình'),
  P(`<p><em>Cùng một lời gọi, nhiều cách chạy khác nhau tuỳ đối tượng thật.</em></p>`),
  C('Đa hình qua ghi đè (overriding)', `// Cùng gọi moTaVaiTro(), mỗi loại trả về một câu khác nhau
ArrayList<Person> danhSach = new ArrayList<>();
danhSach.add(new Doctor("D01", "An", "Tim mach", 5));
danhSach.add(new Nurse("N01", "Binh", "Khoa Noi"));

for (Person p : danhSach) {
    // Java tự chọn đúng bản của Doctor hay Nurse lúc CHẠY, không phải lúc biên dịch
    System.out.println(p.moTaVaiTro());
}`),
  P(`<p>Còn một dạng đa hình nữa <strong>đã có sẵn</strong> trong bài mẫu, ít bạn để ý:
  <code>toString()</code> của <code>Doctor</code> là <strong>override</strong> phương thức của
  <code>Object</code>. Khi <code>System.out.println(doctor)</code> chạy, Java gọi bản của bạn chứ không
  gọi bản mặc định. Đó là đa hình — chỉ ra chỗ này cũng được tính.</p>`),

  C('model/Doctor.java — đa hình có sẵn trong bài mẫu', `@Override                                   // ghi đè Object.toString()
public String toString() {
    return String.format("%-10s%-15s%-20s%-10d", code, name, specialization, availability);
}`),

  H('Bảng tra nhanh khi thầy hỏi'),
  P(`<table>
  <tr><th>Tính chất</th><th>Chỉ vào đâu trong bài</th><th>Một câu trả lời</th></tr>
  <tr><td>Encapsulation</td><td><code>Doctor</code>: field private + getter/setter</td>
      <td>"Che dữ liệu, sửa luật chỉ sửa một chỗ"</td></tr>
  <tr><td>Abstraction</td><td><code>Controller</code>, <code>Repository</code></td>
      <td>"Main không biết dữ liệu lưu bằng gì"</td></tr>
  <tr><td>Inheritance</td><td><code>Doctor extends Person</code></td>
      <td>"Dùng lại phần chung, không chép code"</td></tr>
  <tr><td>Polymorphism</td><td><code>@Override toString()</code>, <code>moTaVaiTro()</code></td>
      <td>"Cùng lời gọi, chạy đúng bản của từng loại"</td></tr>
  </table>`),
);

// ══════════════════════════════════════════════════════════════
add(
  PART('15', 'Access modifier & static', 'Hai chỗ giảng viên reject nhiều nhất'),

  H('Bảng phạm vi — học thuộc bảng này'),
  P(`<table>
  <tr><th>Từ khoá</th><th>Cùng class</th><th>Cùng package</th><th>Class con khác package</th><th>Mọi nơi</th></tr>
  <tr><td><code>private</code></td><td>✅</td><td>❌</td><td>❌</td><td>❌</td></tr>
  <tr><td><em>(default)</em></td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr>
  <tr><td><code>protected</code></td><td>✅</td><td>✅</td><td>✅</td><td>❌</td></tr>
  <tr><td><code>public</code></td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr>
  </table>`),

  H('Dùng cái nào trong bài LAB211'),
  P(`<ul>
  <li><strong>Field của model/DTO → luôn <code>private</code>.</strong> Không có ngoại lệ.</li>
  <li><strong>Getter/setter, method gọi từ package khác → <code>public</code>.</strong></li>
  <li><strong>Hàm phụ chỉ dùng trong chính class đó → <code>private</code>.</strong> Ví dụ một hàm
  <code>private boolean hopLe(...)</code> trong Repository — để <code>public</code> là thừa, và thầy sẽ hỏi
  "ai gọi hàm này từ ngoài?".</li>
  <li><strong><code>protected</code> chỉ khi có kế thừa thật</strong> — field của class cha cho class con dùng.</li>
  <li><strong>Field của Controller</strong> (<code>doctorRepository</code>, <code>doctorView</code>) →
  <code>private</code>, gán trong constructor.</li>
  </ul>`),

  P(`<p><strong>Câu thầy hỏi:</strong> <em>"Tại sao chỗ này em để private / public?"</em><br/>
  <strong>Trả lời:</strong> "Em để <code>private</code> vì ngoài class này không ai cần chạm tới nó.
  Cái gì cần lộ ra thì em mở bằng method <code>public</code>, để sau này sửa bên trong không ảnh hưởng
  nơi khác. Mở rộng hơn mức cần thiết là tự tạo ra chỗ để người khác phá vỡ đóng gói."</p>`),

  H('static — dùng ĐÚNG một chỗ trong toàn bộ project'),
  P(`<p>Giảng viên ghi trong file Guide:</p>
  <ul>
  <li><code>utils/Validation.java</code> → <strong>"chỗ này phải dùng static method"</strong>,
  class để <code>final</code>, constructor để <code>private</code></li>
  <li><code>main/Main.java</code> → <strong>"cấm dùng static với biến, có thể dùng với hàm"</strong></li>
  <li><code>controller</code> → <strong>"không static"</strong></li>
  <li><code>model</code> → <strong>"không được dùng static"</strong></li>
  </ul>`),

  C('utils/Validation.java — mẫu chuẩn của static', `package utils;

import constants.Message;

// final: không ai extend được class tiện ích này
public final class Validation {

    // private constructor: không ai new Validation() được — vì new ra cũng vô nghĩa
    private Validation() {
    }

    // static: hàm thuần, kết quả chỉ phụ thuộc tham số vào, không phụ thuộc đối tượng nào
    public static String getString(String input) throws Exception {
        // LƯU Ý: bản mẫu của thầy viết input.equals(null) — câu đó gây
        // NullPointerException khi input là null. Phải so sánh bằng ==.
        if (input == null || input.trim().isEmpty()) {
            throw new Exception(Message.EMPTY_INPUT);
        }
        return input.trim();
    }

    // Kiểm tra lựa chọn menu nằm trong khoảng cho phép
    public static int getChoice(String input, int min, int max) throws Exception {
        int choice;
        // Tách riêng lỗi "không phải số" và lỗi "ngoài khoảng" — nếu bắt chung
        // một catch thì nhập 9 cho menu 1-5 sẽ báo nhầm là "không phải số"
        try {
            choice = Integer.parseInt(input);
        } catch (NumberFormatException e) {
            throw new Exception(Message.INVALID_NUMBER);
        }
        if (choice < min || choice > max) {
            throw new Exception(String.format(Message.INVALID_RANGE, min, max));
        }
        return choice;
    }

    // Số nguyên dương
    public static int getPositiveInteger(String input) throws Exception {
        int number;
        try {
            number = Integer.parseInt(input);
        } catch (NumberFormatException e) {
            throw new Exception(Message.INVALID_NUMBER);
        }
        if (number <= 0) {
            throw new Exception(Message.POSITIVE_NUMBER);
        }
        return number;
    }
}`),

  H('Ba câu về static thầy sẽ hỏi — và câu trả lời'),
  P(`<p><strong>1. "Tại sao dùng static ở đây?"</strong><br/>
  "Vì <code>getString</code> là hàm thuần: cho cùng chuỗi vào thì luôn ra cùng kết quả, không đọc/ghi
  thuộc tính nào của đối tượng. Nó được gọi từ rất nhiều nơi trong Main. Nếu không static thì mỗi lần
  gọi phải <code>new Validation()</code> — tạo ra một đối tượng rỗng, không giữ gì cả, chỉ tốn bộ nhớ."</p>

  <p><strong>2. "Bỏ static đi thì sao?"</strong><br/>
  "Code sẽ không biên dịch được ở mọi chỗ đang gọi <code>Validation.getString(...)</code>, vì gọi method
  của thể hiện qua tên class là không hợp lệ."</p>

  <p><strong>3. "Nếu không dùng static thì sửa source thế nào cho chạy?"</strong><br/>
  "Em phải bỏ <code>private</code> ở constructor, rồi trong Main tạo
  <code>Validation validation = new Validation();</code> và đổi mọi lời gọi thành
  <code>validation.getString(...)</code>. Chạy được, nhưng thừa một đối tượng vô nghĩa — nên static
  mới là lựa chọn đúng ở đây."</p>`),

  H('Vì sao Model và Controller CẤM static'),
  P(`<p>Vì <code>static</code> nghĩa là <strong>cả chương trình dùng chung một bản duy nhất</strong>.
  Nếu <code>Doctor</code> có <code>private static String name;</code> thì tạo 100 bác sĩ nhưng chỉ có
  <strong>một</strong> cái tên — bác sĩ sau ghi đè bác sĩ trước. Lúc đó hết hướng đối tượng.</p>
  <p>Tương tự với Controller: mỗi Controller giữ Repository và View của riêng nó. Để static là
  mọi Controller dùng chung một kho dữ liệu — đúng cái mà kiến trúc phân tầng đang cố tránh.</p>`),

  H('Kiểu trả về — câu hỏi thứ ba của thầy'),
  P(`<p><em>"Tại sao method này trả về <code>void</code>, method kia trả về <code>String</code>?"</em></p>
  <ul>
  <li><code>void</code> — hàm <strong>làm một việc</strong>, không có kết quả cần trả:
  <code>addDoctor()</code>, <code>display()</code>. Lỗi thì ném exception, không trả mã lỗi.</li>
  <li><code>boolean</code> — hàm <strong>hỏi một câu có/không</strong>: <code>isDuplicate()</code>,
  <code>isEmpty()</code>. Đặt tên bắt đầu bằng <code>is</code>/<code>has</code>.</li>
  <li><code>String</code> — hàm <strong>tạo ra chuỗi để nơi khác dùng</strong>: <code>toString()</code>.
  Chú ý: <code>toString()</code> <em>trả về</em> chuỗi chứ <strong>không in</strong> — vì Model cấm in.</li>
  <li><code>Map</code>/<code>ArrayList</code> — hàm <strong>trả về tập kết quả</strong>:
  <code>searchDoctor()</code>.</li>
  </ul>`),
);

// ══════════════════════════════════════════════════════════════
add(
  PART('16', '5 nguyên lý SOLID', 'Slide của thầy viết bằng C# — dưới đây đã dịch sang Java'),

  P(`<p>Slide <code>SOLID-Principles.pptx</code> dùng ví dụ C# (<code>public string Name { get; set; }</code>,
  <code>Console.WriteLine</code>). Bạn không chép thẳng được. Dưới đây là <strong>bản Java, đặt trong
  chính ngữ cảnh quản lý bác sĩ</strong> để nói lúc review là khớp với source của mình.</p>
  <p>Nhớ: slide nội quy ghi <em>"Implement và hiểu SOLID được cộng LOC"</em>. Đây là tiền.</p>`),

  IMG('sol-03.png', 'Năm nguyên lý SOLID — slide 3 bộ SOLID-Principles của thầy.'),
  H('S — Single Responsibility: một class, một lý do để thay đổi'),
  P(`<p>Đây là nguyên lý <strong>bạn ĐÃ tuân thủ</strong> nếu làm đúng kiến trúc 8 package — và là điều
  slide của thầy nhấn mạnh nhất: <em>"Model đáp ứng nguyên tắc Single Responsibility"</em>.</p>`),

  IMG('sol-05.png', 'SRP — slide 5: một class ôm bốn trách nhiệm thì có bốn lý do để phải sửa nó.'),
  C('SRP — chính là lý do có 8 package', `// ❌ Vi phạm: một class ôm hết
public class DoctorManager {
    public void themBacSi() { }      // nghiệp vụ
    public void luuFile() { }        // lưu trữ
    public void inDanhSach() { }     // hiển thị
    public boolean kiemTraTen() { }  // kiểm tra dữ liệu
}
// Đổi cách hiển thị → sửa class này. Đổi cách lưu → cũng sửa class này. Bốn lý do để thay đổi.

// ✅ Đúng SRP — mỗi trách nhiệm một class, đúng như cấu trúc thầy yêu cầu
// model/Doctor.java           → chỉ giữ dữ liệu một bác sĩ
// repository/DoctorRepository → chỉ lưu trữ + CRUD
// view/DoctorView             → chỉ hiển thị
// utils/Validation            → chỉ kiểm tra dữ liệu
// controller/DoctorController → chỉ điều hướng`),
  P(`<p><strong>Trả lời thầy:</strong> "Em tách theo SRP: <code>Doctor</code> chỉ có một lý do để đổi là
  khi thông tin bác sĩ đổi. <code>DoctorView</code> chỉ đổi khi cách hiển thị đổi. Hai thứ đó độc lập
  nên em không để chung."</p>`),

  H('O — Open/Closed: mở để mở rộng, đóng để sửa đổi'),

  IMG('sol-09.png', 'OCP — slide 9: mở rộng bằng cách THÊM lớp mới, không mở lớp cũ ra sửa.'),
  C('OCP — thêm cách tìm kiếm mới mà KHÔNG sửa code cũ', `// ❌ Vi phạm: thêm kiểu tìm mới là phải mở class này ra sửa
public Map<String, Doctor> search(String input, String kieu) {
    if (kieu.equals("NAME")) { ... }
    else if (kieu.equals("CODE")) { ... }
    // thêm "SPECIALIZATION" → lại sửa vào đây
}

// ✅ Đúng OCP: định nghĩa một hợp đồng, mỗi kiểu tìm là một class riêng
public interface TieuChiTimKiem {
    boolean khop(Doctor doctor, String tuKhoa);
}

public class TimTheoTen implements TieuChiTimKiem {
    @Override
    public boolean khop(Doctor doctor, String tuKhoa) {
        return doctor.getName().contains(tuKhoa);
    }
}

public class TimTheoChuyenKhoa implements TieuChiTimKiem {
    @Override
    public boolean khop(Doctor doctor, String tuKhoa) {
        return doctor.getSpecialization().contains(tuKhoa);
    }
}

// Repository không bao giờ phải sửa nữa — thêm kiểu tìm = thêm class mới
public Map<String, Doctor> search(String tuKhoa, TieuChiTimKiem tieuChi) {
    Map<String, Doctor> ketQua = new HashMap<>();
    // Duyệt toàn bộ bác sĩ, giữ lại những ai khớp tiêu chí
    for (Doctor d : doctorMap.values()) {
        if (tieuChi.khop(d, tuKhoa)) {
            ketQua.put(d.getCode(), d);
        }
    }
    return ketQua;
}`),

  H('L — Liskov Substitution: class con phải thay được class cha'),
  P(`<p>Ví dụ kinh điển trong cả slide lẫn sách của thầy: <code>HinhVuong extends HinhChuNhat</code>.</p>`),
  IMG('sol-13.png', 'LSP — slide 13: class con phải thay được class cha mà chương trình vẫn chạy đúng.'),
  C('LSP — vì sao Hình vuông KHÔNG nên kế thừa Hình chữ nhật', `// ❌ Vi phạm LSP
public class HinhChuNhat {
    protected double rong, cao;
    public void setRong(double r) { this.rong = r; }
    public void setCao(double c) { this.cao = c; }
    public double dienTich() { return rong * cao; }
}

public class HinhVuong extends HinhChuNhat {
    // Hình vuông buộc rộng = cao, nên phải phá hợp đồng của cha
    @Override public void setRong(double r) { this.rong = this.cao = r; }
    @Override public void setCao(double c) { this.rong = this.cao = c; }
}

// Đoạn code này ĐÚNG với HinhChuNhat nhưng SAI với HinhVuong:
void kiemTra(HinhChuNhat h) {
    h.setRong(5);
    h.setCao(10);
    // Mong đợi 50. HinhVuong trả về 100 → chương trình sai mà không báo lỗi.
}

// ✅ Đúng LSP: dùng chung interface thay vì extends
public interface Hinh {
    double dienTich();
}
public class HinhChuNhat2 implements Hinh { /* rong * cao */ }
public class HinhVuong2  implements Hinh { /* canh * canh */ }`),
  P(`<p><strong>Quy tắc rút ra:</strong> "là một" trong đời thực (hình vuông <em>là</em> hình chữ nhật)
  <strong>không</strong> đủ để dùng <code>extends</code>. Chỉ kế thừa khi class con <em>giữ nguyên
  được mọi lời hứa</em> của class cha.</p>`),

  H('I — Interface Segregation: đừng ép ai cài method họ không dùng'),
  IMG('sol-17.png', 'ISP — slide 17: đừng ép client cài những method nó không dùng.'),
  C('ISP — tách interface to thành interface nhỏ', `// ❌ Vi phạm: mọi kho đều bị ép có cả 4 hàm
public interface Kho {
    void them(Doctor d);
    void xoa(String code);
    void docFile(String duongDan);
    void ghiFile(String duongDan);
}
// Bài P0055 lưu trong bộ nhớ, không đụng file → vẫn phải cài docFile/ghiFile rỗng

// ✅ Tách nhỏ theo nhu cầu thật
public interface KhoCoBan {
    void them(Doctor d);
    void xoa(String code);
}
public interface KhoCoFile {
    void docFile(String duongDan);
    void ghiFile(String duongDan);
}

// Bài P0055: chỉ cần phần cơ bản
public class DoctorRepository implements KhoCoBan { ... }

// Bài P0057 (có user.dat): cài thêm phần file
public class UserRepository implements KhoCoBan, KhoCoFile { ... }`),

  H('D — Dependency Inversion: phụ thuộc vào hợp đồng, không vào class cụ thể'),
  IMG('sol-21.png', 'DIP — slide 21: cả module cấp cao lẫn cấp thấp đều phụ thuộc vào abstraction.'),
  C('DIP — Controller không nên tự new Repository', `// ❌ Vi phạm DIP: Controller gắn CHẶT vào một loại kho cụ thể
public class DoctorController {
    private DoctorRepository repo = new DoctorRepository();  // cứng
}
// Muốn đổi sang lưu file → phải sửa Controller

// ✅ Đúng DIP: khai theo interface, nhận từ ngoài vào (Dependency Injection)
public interface IDoctorRepository {
    void addDoctor(DoctorRequestDTO dto);
    boolean isDuplicate(String code);
}

public class DoctorMemoryRepository implements IDoctorRepository { /* HashMap */ }
public class DoctorFileRepository   implements IDoctorRepository { /* doctor.dat */ }

public class DoctorController {
    private final IDoctorRepository repo;      // hợp đồng, không phải class cụ thể

    // Tiêm phụ thuộc qua constructor
    public DoctorController(IDoctorRepository repo) {
        this.repo = repo;
    }
}

// Trong Main — đổi cách lưu chỉ là đổi MỘT dòng này
DoctorController controller = new DoctorController(new DoctorMemoryRepository());`),

  H('Nên implement mấy nguyên lý?'),
  P(`<p><strong>Đừng nhồi cả 5 vào một bài nhỏ.</strong> Thầy nói bài Candidate <em>"cần implement đầy đủ
  SOLID → rất khó, không nên liều"</em> — nghĩa là đủ 5 là việc lớn.</p>
  <p>Chiến thuật hợp lý cho bài thường:</p>
  <ul>
  <li><strong>SRP</strong> — miễn phí, bạn đã có nó nhờ kiến trúc 8 package. Luôn nói được.</li>
  <li><strong>DIP</strong> — rẻ nhất để thêm: một interface cho Repository + constructor injection. ~15 LOC.</li>
  <li><strong>OCP</strong> — thêm khi bài có "nhiều kiểu" gì đó (nhiều cách tìm, nhiều cách sắp xếp).</li>
  <li><strong>LSP, ISP</strong> — chỉ khi bài thật sự có kế thừa / nhiều loại kho. Đừng bịa.</li>
  </ul>`),
);

// ══════════════════════════════════════════════════════════════
add(
  PART('17', 'DESIGN PATTERN — phần quan trọng nhất',
       'Thầy nói: hiểu và áp dụng thành thạo phần này thì pass sớm'),

  P(`<p>Bộ slide <code>Design Pattern.pptx</code> có <strong>89 trang, đủ 23 pattern GoF</strong>.
  Đừng hoảng — đó là <em>từ điển tra cứu</em>. Còn <strong>sách <code>OOP_Java_Guide.docx</code> của thầy
  chỉ chọn 5 cái</strong>: Builder (mục 3.2), Singleton, Factory Method, Observer, Strategy (mục 7.1–7.4).</p>
  <p><strong>Năm cái đó là phạm vi bạn phải thành thạo.</strong> Nhẹ hơn bạn tưởng rất nhiều.</p>`),

  H('Design Pattern là gì — và KHÔNG phải là gì'),
  P(`<p>Định nghĩa trong slide: <em>"a general repeatable solution to a commonly occurring problem in
  software design"</em> — một lời giải <strong>lặp lại được</strong> cho một <strong>vấn đề lặp lại</strong>.</p>
  <p>Nó <strong>không phải</strong> đoạn code copy-paste. Nó là <em>cách sắp xếp các class</em>. Cùng một
  pattern, mười người viết ra mười đoạn code khác nhau.</p>`),

  H('Bốn thành phần của một pattern (GoF)'),
  P(`<p>Slide 6 nêu bốn phần — và đây <strong>chính là bốn câu thầy sẽ hỏi</strong>:</p>
  <table>
  <tr><th>Thành phần</th><th>Câu hỏi tương ứng</th></tr>
  <tr><td><strong>Name</strong> — tên</td><td>"Em dùng pattern gì?"</td></tr>
  <tr><td><strong>Problem</strong> — dùng khi nào</td><td>"Nó giải quyết vấn đề gì trong bài của em?"</td></tr>
  <tr><td><strong>Solution</strong> — các class và quan hệ</td><td>"Chỉ cho thầy class nào đóng vai gì"</td></tr>
  <tr><td><strong>Consequences</strong> — được gì, mất gì</td><td>"Không dùng nó thì sao?"</td></tr>
  </table>
  <p>Học pattern mà chỉ nhớ <em>Name</em> và <em>Solution</em> là học vẹt. <strong>Problem và Consequences
  mới là chỗ phân biệt người hiểu với người chép.</strong></p>`),

  H('Ba nhóm pattern'),
  M(`flowchart TD
  DP["23 Design Pattern GoF"] --> CR["CREATIONAL<br/>Tạo đối tượng<br/><i>Singleton · Factory Method<br/>Builder · Abstract Factory · Prototype</i>"]
  DP --> ST["STRUCTURAL<br/>Ghép đối tượng lại<br/><i>Adapter · Decorator · Facade<br/>Composite · Proxy · Bridge · Flyweight</i>"]
  DP --> BE["BEHAVIORAL<br/>Chia trách nhiệm, phân phối hành vi<br/><i>Strategy · Observer · Iterator · Command<br/>State · Template Method · …</i>"]
  CR --> L1["LAB211 dùng:<br/>Singleton, Factory Method, Builder"]
  BE --> L2["LAB211 dùng:<br/>Strategy, Observer"]`),


  IMG('dp-08.png', 'Ba nhóm pattern — slide 8 bộ Design Pattern của thầy.'),
  IMG('dp-13.png', 'Bản đồ quan hệ giữa 23 pattern — slide 13. Mũi tên cho thấy pattern nào thường đi cùng pattern nào.'),
  P(`<p><strong>Mẹo nhớ:</strong> Creational = <em>"đẻ ra đối tượng thế nào"</em>.
  Structural = <em>"lắp các đối tượng vào nhau ra sao"</em>.
  Behavioral = <em>"ai làm việc gì, nói chuyện với nhau kiểu gì"</em>.</p>`),

  // ── 1. SINGLETON ────────────────────────────────────────────
  H('① SINGLETON — đảm bảo chỉ có MỘT thể hiện duy nhất'),
  P(`<p><strong>Problem:</strong> Có những thứ trong hệ thống chỉ được phép tồn tại một bản.
  Slide lấy ví dụ: máy in thì nhiều, nhưng <em>hàng đợi in</em> chỉ một. Trong LAB211:
  <strong>kho dữ liệu</strong> chỉ nên có một — nếu Controller A tạo một <code>DoctorRepository</code> và
  Controller B tạo một cái khác, hai bên sẽ thấy hai danh sách bác sĩ khác nhau.</p>`),

  IMG('dp-26.png', 'Singleton — slide 26: bài toán gốc. Nhiều máy in nhưng chỉ MỘT hàng đợi in.'),
  IMG('dp-27.png', 'Singleton — slide 27: lời giải. Instance() la cua duy nhat, uniqueInstance la ban duy nhat.'),
  M(`classDiagram
  class DoctorRepository {
    -static DoctorRepository instance
    -Map~String, Doctor~ doctorMap
    -DoctorRepository()
    +static getInstance() DoctorRepository
    +addDoctor(dto) boolean
  }
  note for DoctorRepository "Constructor private → bên ngoài không new được<br/>getInstance() là cửa DUY NHẤT"`),

  C('Singleton trong bài P0055 — kho dữ liệu dùng chung', `package repository;

import java.util.HashMap;
import java.util.Map;
import model.Doctor;

public class DoctorRepository {

    // Bản duy nhất của kho. static vì nó thuộc về CLASS, không thuộc về đối tượng nào.
    private static DoctorRepository instance;

    // Dữ liệu thật — vẫn private, không ai chạm thẳng
    private Map<String, Doctor> doctorMap = new HashMap<>();

    // private constructor: chặn mọi lời gọi "new DoctorRepository()" từ bên ngoài
    private DoctorRepository() {
    }

    // Cửa duy nhất để lấy kho. Lần đầu thì tạo, các lần sau trả lại đúng bản đó.
    public static DoctorRepository getInstance() {
        if (instance == null) {
            instance = new DoctorRepository();
        }
        return instance;
    }

    public boolean addDoctor(Doctor doctor) {
        doctorMap.put(doctor.getCode(), doctor);
        return true;
    }
}

// Dùng trong Controller:
private DoctorRepository repo = DoctorRepository.getInstance();`),

  P(`<p><strong>Consequences — được gì:</strong> mọi nơi chắc chắn dùng chung một kho; không sợ dữ liệu
  phân mảnh; tiết kiệm bộ nhớ.<br/>
  <strong>Mất gì:</strong> đây là <em>biến toàn cục trá hình</em> — khó test (không thay được bằng kho giả),
  và nó vi phạm <strong>DIP</strong> nếu Controller tự gọi <code>getInstance()</code> thay vì nhận
  Repository từ ngoài vào.</p>`),

  P(`<p><strong>⚠️ Bẫy khi thầy vặn:</strong> "Singleton có phải lúc nào cũng tốt không?"
  Trả lời trung thực: <em>"Không ạ. Nó tiện nhưng làm class phụ thuộc cứng vào nhau. Trong bài này em
  dùng vì kho dữ liệu chỉ có một và chương trình chạy một luồng. Nếu cần thay kho để kiểm thử thì
  em sẽ chuyển sang tiêm qua constructor (DIP) thay vì Singleton."</em> — Trả lời được câu này là
  bạn nằm trong nhóm hiểu thật.</p>`),

  // ── 2. FACTORY METHOD ───────────────────────────────────────
  H('② FACTORY METHOD — để nơi khác quyết định tạo ra loại nào'),
  P(`<p><strong>Problem (slide 29):</strong> <em>"Define an interface for creating an object, but let
  subclasses decide which class to instantiate."</em> — Bạn biết <em>lúc nào</em> cần tạo đối tượng,
  nhưng <em>không biết trước loại cụ thể</em>.</p>
  <p>Trong LAB211: khi bài có <strong>nhiều loại đối tượng cùng gốc</strong> (Doctor / Nurse,
  Student chính quy / Student liên thông, Xe máy / Ô tô trong bài Car showroom) và người dùng chọn loại
  ở menu.</p>`),


  IMG('dp-29.png', 'Factory Method — slide 29: framework biết LÚC NÀO cần tạo tài liệu, nhưng không biết tạo LOẠI nào.'),
  IMG('dp-30.png', 'Factory Method — slide 30: Creator khai báo factory method, ConcreteCreator quyết định trả về ConcreteProduct nào.'),
  M(`classDiagram
  class Person { <<abstract>> +moTaVaiTro() String }
  class Doctor
  class Nurse
  class NhanSuFactory { +static taoNhanSu(loai, dto) Person }
  Person <|-- Doctor
  Person <|-- Nurse
  NhanSuFactory ..> Doctor : tạo
  NhanSuFactory ..> Nurse : tạo`),

  C('Factory Method — gom việc "new" vào MỘT chỗ', `package factory;

import constants.Message;
import dto.NhanSuRequestDTO;
import model.Doctor;
import model.Nurse;
import model.Person;

public final class NhanSuFactory {

    private NhanSuFactory() {
    }

    // Nơi DUY NHẤT biết "loại nào thì new class nào".
    // Thêm loại mới (ví dụ Technician) chỉ sửa ở đây, Controller không đụng tới.
    public static Person taoNhanSu(String loai, NhanSuRequestDTO dto) throws Exception {
        switch (loai.toUpperCase()) {
            case "DOCTOR":
                return new Doctor(dto.getCode(), dto.getName(),
                                  dto.getSpecialization(), dto.getAvailability());
            case "NURSE":
                return new Nurse(dto.getCode(), dto.getName(), dto.getDepartment());
            default:
                throw new Exception(Message.INVALID_CHOICE);
        }
    }
}`),

  P(`<p><strong>Vì sao không để <code>new</code> rải rác trong Controller?</strong> Vì khi thêm loại thứ ba,
  bạn phải đi tìm <em>mọi chỗ</em> có <code>new</code>. Gom vào Factory thì chỉ sửa một file —
  đó chính là <strong>OCP</strong>.</p>
  <p><strong>Consequences:</strong> được — thêm loại mới không đụng code cũ, Controller không cần biết
  class con nào tồn tại. Mất — thêm một class nữa, và nếu bài chỉ có <em>một</em> loại đối tượng thì
  Factory là thừa, thầy sẽ hỏi "tại sao cần?" mà bạn không có câu trả lời.</p>`),
);

add(
  // ── 3. BUILDER ──────────────────────────────────────────────
  H('③ BUILDER — dựng đối tượng nhiều thuộc tính mà không rối'),
  P(`<p><strong>Problem (slide 22):</strong> <em>"Separate the construction of a complex object from its
  representation"</em>. Khi một đối tượng có nhiều thuộc tính, constructor dài ngoằng trở nên không đọc nổi.</p>`),

  IMG('dp-22.png', 'Builder — slide 22: tách việc DỰNG một đối tượng phức tạp khỏi cách nó được biểu diễn.'),
  IMG('dp-24.png', 'Builder — slide 24: Director điều khiển quá trình, ConcreteBuilder lắp từng phần, Product là thành phẩm.'),
  C('Vấn đề Builder giải', `// ❌ Nhìn vào lời gọi này, ai biết số 5 là gì? true là gì?
Doctor d = new Doctor("D01", "An", "Tim mach", 5, true, "Ca sang", 3);

// Và nếu chỉ muốn đặt code + name thì phải viết constructor thứ hai, thứ ba…
// → "constructor telescoping", càng thêm thuộc tính càng nổ`),

  C('Builder — đọc như một câu tiếng Anh', `package model;

public class Doctor {
    private String code;
    private String name;
    private String specialization;
    private int availability;

    // Constructor private: chỉ Builder được tạo
    private Doctor() {
    }

    // Builder là class lồng bên trong, static để dùng được mà không cần Doctor
    public static class Builder {
        private final Doctor doctor = new Doctor();

        public Builder code(String code) {
            doctor.code = code;
            return this;                 // trả về chính mình → nối chuỗi được
        }

        public Builder name(String name) {
            doctor.name = name;
            return this;
        }

        public Builder specialization(String s) {
            doctor.specialization = s;
            return this;
        }

        public Builder availability(int a) {
            doctor.availability = a;
            return this;
        }

        // build(): nơi kiểm tra lần cuối trước khi giao đối tượng ra ngoài
        public Doctor build() throws Exception {
            if (doctor.code == null || doctor.code.isEmpty()) {
                throw new Exception("Ma bac si khong duoc rong");
            }
            return doctor;
        }
    }

    public String getCode() { return code; }
    public String getName() { return name; }
}

// Dùng — đọc là hiểu ngay, không cần đếm vị trí tham số
Doctor d = new Doctor.Builder()
        .code("D01")
        .name("Nguyen Van An")
        .specialization("Tim mach")
        .availability(5)
        .build();`),

  P(`<p><strong>Consequences:</strong> được — lời gọi tự mô tả, đặt thuộc tính theo thứ tự nào cũng được,
  bỏ qua thuộc tính không bắt buộc, và <code>build()</code> là một chỗ tập trung để validate.<br/>
  Mất — nhiều code hơn hẳn. <strong>Bài dưới 4 thuộc tính thì Builder là gượng ép</strong>, đừng dùng.</p>`),

  // ── 4. STRATEGY ─────────────────────────────────────────────
  H('④ STRATEGY — đổi thuật toán lúc chạy'),
  P(`<p><strong>Problem (slide 80):</strong> <em>"Define a family of algorithms, encapsulate each one, and
  make them interchangeable."</em> Khi cùng một việc có <strong>nhiều cách làm</strong> và người dùng
  chọn cách ở menu.</p>
  <p>Đây là pattern <strong>hợp với LAB211 nhất</strong>: gần như bài quản lý nào cũng có chức năng
  "sắp xếp theo …" với vài lựa chọn.</p>`),


  IMG('dp-80.png', 'Strategy — slide 80: thuật toán bị nhúng cứng vào class dùng nó, muốn đổi là phải sửa chính nó.'),
  IMG('dp-81.png', 'Strategy — slide 81: mỗi thuật toán tách thành một class riêng, Context chỉ giữ tham chiếu tới interface.'),
  M(`classDiagram
  class ChienLuocSapXep { <<interface>> +sapXep(list) }
  class SapXepTheoTen
  class SapXepTheoChuyenKhoa
  class SapXepTheoSoCaTruc
  class DoctorServices { -ChienLuocSapXep chienLuoc +datChienLuoc(cl) +layDanhSach() }
  ChienLuocSapXep <|.. SapXepTheoTen
  ChienLuocSapXep <|.. SapXepTheoChuyenKhoa
  ChienLuocSapXep <|.. SapXepTheoSoCaTruc
  DoctorServices o-- ChienLuocSapXep : dùng`),

  C('Strategy — thay if/else dài bằng các class rời', `package service.sort;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import model.Doctor;

// Hợp đồng chung: "biết cách sắp xếp một danh sách bác sĩ"
public interface ChienLuocSapXep {
    void sapXep(ArrayList<Doctor> danhSach);
}

// Mỗi cách sắp xếp = một class, không ai biết về ai
public class SapXepTheoTen implements ChienLuocSapXep {
    @Override
    public void sapXep(ArrayList<Doctor> danhSach) {
        Collections.sort(danhSach, Comparator.comparing(Doctor::getName));
    }
}

public class SapXepTheoSoCaTruc implements ChienLuocSapXep {
    @Override
    public void sapXep(ArrayList<Doctor> danhSach) {
        // Nhiều ca trực lên trước
        Collections.sort(danhSach,
                Comparator.comparingInt(Doctor::getAvailability).reversed());
    }
}`),

  C('Nơi dùng — Service giữ chiến lược, đổi được lúc chạy', `package service;

public class DoctorServices {
    private ChienLuocSapXep chienLuoc;

    // Đổi cách sắp xếp mà không sửa một dòng nào của class này
    public void datChienLuoc(ChienLuocSapXep chienLuoc) {
        this.chienLuoc = chienLuoc;
    }

    public ArrayList<Doctor> layDanhSachDaSapXep(ArrayList<Doctor> danhSach) {
        if (chienLuoc != null) {
            chienLuoc.sapXep(danhSach);
        }
        return danhSach;
    }
}

// Trong Main — menu "Sắp xếp theo: 1. Tên  2. Số ca trực"
switch (choice) {
    case 1: services.datChienLuoc(new SapXepTheoTen());     break;
    case 2: services.datChienLuoc(new SapXepTheoSoCaTruc()); break;
}`),

  P(`<p><strong>Đây là ví dụ đẹp nhất để trả lời "pattern giải quyết vấn đề gì":</strong>
  <em>"Nếu viết if/else trong Service thì mỗi lần thêm kiểu sắp xếp em phải mở Service ra sửa — vi phạm
  OCP. Với Strategy, thêm kiểu mới chỉ là thêm một class implement interface, Service đứng yên."</em></p>`),

  // ── 5. OBSERVER ─────────────────────────────────────────────
  H('⑤ OBSERVER — một chỗ đổi, nhiều chỗ tự biết'),
  P(`<p><strong>Problem (slide 64):</strong> <em>"Define a one-to-many dependency between objects so that
  when one object changes state, all its dependents are notified and updated automatically."</em></p>
  <p>Trong LAB211 nó ít tự nhiên hơn 4 cái trên, vì bài console thường chỉ có một View.
  Nhưng có <strong>một chỗ dùng rất hợp lý</strong>: ghi log / thống kê mỗi khi dữ liệu đổi.</p>`),


  IMG('dp-66.png', 'Observer — slide 66: Subject giữ danh sách Observer; gọi Notify() thì mọi Observer tự Update().'),
  IMG('dp-67.png', 'Observer — slide 67: sơ đồ tuần tự. Subject KHÔNG biết có bao nhiêu observer đang nghe.'),
  M(`sequenceDiagram
  participant C as Controller
  participant R as DoctorRepository<br/>(Subject)
  participant L as GhiLogObserver
  participant D as DemSoLuongObserver
  C->>R: addDoctor(dto)
  R->>R: doctorMap.put(...)
  R->>L: capNhat("THEM", doctor)
  R->>D: capNhat("THEM", doctor)
  Note over L,D: Repository KHÔNG biết<br/>có bao nhiêu observer`),

  C('Observer — Repository báo tin, ai muốn nghe thì đăng ký', `package observer;

import model.Doctor;

// Hợp đồng cho bên "muốn được báo"
public interface DoctorObserver {
    void capNhat(String hanhDong, Doctor doctor);
}

// Một bên nghe: ghi lại lịch sử thao tác
public class GhiLogObserver implements DoctorObserver {
    @Override
    public void capNhat(String hanhDong, Doctor doctor) {
        // Ghi ra file log — không đụng gì tới Repository
        System.out.println("[LOG] " + hanhDong + ": " + doctor.getCode());
    }
}`),

  C('Subject — bên phát tin', `public class DoctorRepository {
    private Map<String, Doctor> doctorMap = new HashMap<>();

    // Danh sách những bên đang lắng nghe
    private ArrayList<DoctorObserver> observers = new ArrayList<>();

    // Đăng ký nhận tin
    public void dangKy(DoctorObserver observer) {
        observers.add(observer);
    }

    // Báo cho TẤT CẢ bên đang nghe
    private void baoTin(String hanhDong, Doctor doctor) {
        for (DoctorObserver o : observers) {
            o.capNhat(hanhDong, doctor);
        }
    }

    public boolean addDoctor(Doctor doctor) {
        doctorMap.put(doctor.getCode(), doctor);
        baoTin("THEM", doctor);      // thêm xong thì báo
        return true;
    }
}`),

  P(`<p><strong>Consequences:</strong> được — thêm một việc cần làm khi dữ liệu đổi (ghi log, đếm số lượng,
  gửi cảnh báo) chỉ là thêm một class, Repository không đổi.<br/>
  Mất — luồng chạy khó theo dõi khi debug, vì lời gọi "đi đâu" không nhìn thấy trực tiếp trong code.</p>`),

  // ── Bản đồ SOLID ↔ Pattern ──────────────────────────────────
  H('SOLID và Design Pattern liên quan thế nào'),
  IMG('sol-25.png', 'SOLID và Design Pattern — slide 25: nguyên lý là kim chỉ nam, pattern là lời giải cụ thể.'),
  P(`<p>Slide 25 của bộ SOLID nói rõ: <strong>"SOLID Principles are NOT Design Patterns"</strong>.
  SOLID là <em>nguyên tắc</em> — kim chỉ nam. Pattern là <em>lời giải cụ thể</em>. Nhiều pattern sinh ra
  chính là để hiện thực hoá một nguyên lý SOLID:</p>
  <table>
  <tr><th>Pattern</th><th>Hiện thực nguyên lý</th><th>Vì sao</th></tr>
  <tr><td><strong>Strategy</strong></td><td>OCP</td><td>Thêm thuật toán mới = thêm class, không sửa class cũ</td></tr>
  <tr><td><strong>Factory Method</strong></td><td>OCP + DIP</td><td>Nơi gọi không cần biết class cụ thể nào được tạo</td></tr>
  <tr><td><strong>Observer</strong></td><td>OCP + SRP</td><td>Mỗi observer một trách nhiệm; thêm observer không sửa subject</td></tr>
  <tr><td><strong>Builder</strong></td><td>SRP</td><td>Tách việc "dựng đối tượng" khỏi bản thân đối tượng</td></tr>
  <tr><td><strong>Dependency Injection</strong></td><td>DIP</td><td>Chính là cách phổ biến nhất để đạt DIP</td></tr>
  </table>
  <p><strong>Câu trả lời ăn điểm:</strong> <em>"Em dùng Strategy ở đây không phải vì nó là pattern,
  mà vì em cần tuân thủ OCP: menu sắp xếp còn thêm lựa chọn nữa, em không muốn mỗi lần thêm là phải
  mở Service ra sửa."</em></p>`),

  H('⚠️ Anti-pattern — nhét pattern bừa còn tệ hơn không dùng'),
  P(`<p>Slide 7 cảnh báo thẳng: <em>"Patterns can be overused and abused → Anti-Patterns"</em>.</p>
  <p>Thầy hỏi <strong>"tại sao dùng"</strong> chứ không hỏi <strong>"có dùng không"</strong>. Nhét Builder vào
  class 2 thuộc tính, hay Factory cho một loại đối tượng duy nhất, là tự đưa cổ vào thòng lọng.</p>
  <p><strong>Kiểm tra trước khi thêm một pattern — trả lời được cả ba câu này thì hãy dùng:</strong></p>
  <ol>
  <li>Vấn đề cụ thể trong <em>bài này</em> mà nó giải là gì?</li>
  <li>Nếu KHÔNG dùng thì code sẽ xấu ở chỗ nào?</li>
  <li>Nó khiến bài dài thêm bao nhiêu, có đáng không?</li>
  </ol>`),

  H('Nên dùng pattern nào cho bài nào'),
  P(`<table>
  <tr><th>Bài</th><th>Pattern tự nhiên nhất</th><th>Lý do</th></tr>
  <tr><td><code>P0055</code> Doctor, <code>P0054</code> Contact, <code>P0056</code> Worker</td>
      <td>Singleton (kho) + Strategy (sắp xếp)</td><td>CRUD + menu sắp xếp</td></tr>
  <tr><td><code>P0057</code> User (có <code>user.dat</code>)</td>
      <td>Singleton + Strategy + DIP (interface kho)</td><td>Có đọc/ghi file → tách kho bộ nhớ vs kho file</td></tr>
  <tr><td><code>P0066</code> Car showroom</td>
      <td>Factory Method</td><td>Nhiều loại xe cùng gốc</td></tr>
  <tr><td><code>P0073</code> Handy Expense</td>
      <td>Strategy (cách tính) + Observer (cảnh báo vượt hạn mức)</td><td>Có nghiệp vụ tính toán</td></tr>
  <tr><td><code>P0071</code> Task management</td>
      <td>Strategy + Observer + Builder</td><td>Task nhiều thuộc tính, có đổi trạng thái</td></tr>
  <tr><td><code>J1.L.P0021</code> Manage Students</td>
      <td>Đủ cả 5</td><td>Bài dài, đủ chỗ để trình bày</td></tr>
  </table>
  <p><strong>Lời khuyên:</strong> bài đầu chỉ làm <strong>Singleton + Strategy</strong> cho chắc tay.
  Hiểu sâu 2 cái còn hơn kể tên 5 cái.</p>`),
);

// ══════════════════════════════════════════════════════════════
add(
  PART('18', 'Quan hệ giữa class & Coding Convention',
       'Chapter 7 – Static Modeling và Java Code Conventions (Sun 1997)'),

  H('Sáu loại quan hệ giữa class'),
  P(`<p>Slide <code>Chapter_7 - Static Modeling</code> liệt kê sáu loại. Đây là thứ dùng để
  <strong>thiết kế model TRƯỚC khi gõ code</strong> — đúng cái thầy nhắc "code model trước".</p>
  <table>
  <tr><th>Quan hệ</th><th>Nghĩa</th><th>Trong Java</th><th>Ví dụ ở bài</th></tr>
  <tr><td><strong>Association</strong></td><td>"biết đến nhau"</td><td>Một class giữ tham chiếu class kia</td>
      <td><code>Controller</code> giữ <code>Repository</code></td></tr>
  <tr><td><strong>Inheritance</strong></td><td>"là một"</td><td><code>extends</code></td>
      <td><code>Doctor extends Person</code></td></tr>
  <tr><td><strong>Realization</strong></td><td>"cam kết làm được"</td><td><code>implements</code></td>
      <td><code>SapXepTheoTen implements ChienLuocSapXep</code></td></tr>
  <tr><td><strong>Dependency</strong></td><td>"dùng tạm một lúc"</td><td>Xuất hiện ở tham số / biến cục bộ</td>
      <td><code>addDoctor(DoctorRequestDTO dto)</code></td></tr>
  <tr><td><strong>Aggregation</strong></td><td>"có, nhưng rời nhau được"</td><td>Tham chiếu, sống độc lập</td>
      <td>Khoa <em>có</em> Bác sĩ — xoá khoa, bác sĩ vẫn còn</td></tr>
  <tr><td><strong>Composition</strong></td><td>"có, và chết cùng nhau"</td><td>Tạo bên trong, không sống rời</td>
      <td>Hoá đơn <em>có</em> dòng hoá đơn — xoá hoá đơn thì dòng cũng mất</td></tr>
  </table>`),


  IMG('ch7-05.png', 'Sáu loại quan hệ giữa các class — Chapter 7, slide 5.'),
  IMG('ch7-18.png', 'Composition và Aggregation — Chapter 7, slide 18. Hình thoi ĐẶC = composition (chết cùng nhau), hình thoi RỖNG = aggregation (rời được).'),
  IMG('ch7-19.png', 'Ví dụ phân cấp composition/aggregation — Chapter 7, slide 19.'),
  M(`classDiagram
  class Khoa
  class Doctor
  class HoaDon
  class DongHoaDon
  Khoa o-- Doctor : Aggregation (rời được)
  HoaDon *-- DongHoaDon : Composition (chết cùng)`),

  P(`<p><strong>Cách phân biệt Aggregation với Composition:</strong> hỏi <em>"xoá cái chứa thì cái bị chứa
  còn sống không?"</em> Còn sống → Aggregation. Chết theo → Composition.</p>`),

  H('Multiplicity — số lượng hai đầu quan hệ'),
  IMG('ch7-07.png', 'Năm dạng multiplicity — Chapter 7, slide 7.'),
  P(`<p>Slide 7–8 nêu năm dạng: <strong>một–một</strong>, <strong>một–nhiều</strong>,
  <strong>nhiều–nhiều</strong>, <strong>số cụ thể</strong>, <strong>tuỳ chọn (0..1)</strong>.</p>
  <p>Nó quyết định kiểu dữ liệu bạn khai trong model:</p>
  <ul>
  <li>một–một → một tham chiếu: <code>private Khoa khoa;</code></li>
  <li>một–nhiều → tập hợp: <code>private ArrayList&lt;Doctor&gt; danhSachBacSi;</code></li>
  <li>tuỳ chọn → tham chiếu có thể <code>null</code>, phải kiểm tra trước khi dùng</li>
  </ul>`),

  H('Java Code Conventions — luật Alt + Shift + F'),
  P(`<p>File <code>Java_codeconventions.pdf</code> là bản Sun Microsystems 1997. Slide review ghi:
  <em>"Đúng coding convention, không đảm bảo convention sẽ không review tiếp"</em>.</p>
  <table>
  <tr><th>Thành phần</th><th>Quy tắc</th><th>Đúng</th><th>Sai</th></tr>
  <tr><td>Class / Interface</td><td>PascalCase, <strong>danh từ</strong></td>
      <td><code>DoctorRepository</code></td><td><code>doctor_repo</code></td></tr>
  <tr><td>Method</td><td>camelCase, <strong>động từ</strong></td>
      <td><code>calcSummaryFee()</code>, <code>checkValidAge()</code></td><td><code>CalcFee()</code></td></tr>
  <tr><td>Biến / field</td><td>camelCase, danh từ có nghĩa</td>
      <td><code>doctorMap</code>, <code>tongTien</code></td><td><code>a</code>, <code>x1</code></td></tr>
  <tr><td>Hằng số</td><td>UPPER_SNAKE_CASE</td>
      <td><code>MAX_RETRY</code>, <code>INPUT_CODE</code></td><td><code>maxRetry</code></td></tr>
  <tr><td>Package</td><td>toàn chữ thường</td>
      <td><code>controller</code>, <code>utils</code></td><td><code>Controller</code></td></tr>
  <tr><td>Project</td><td colspan="3"><code>RollNo_ExcerciseNo_ExcerciseDescription</code> — ví dụ
      <code>HE176322_J1S0055_DoctorManagement</code></td></tr>
  </table>
  <p>Thụt lề 4 dấu cách, dòng không quá 80 ký tự, mỗi dòng khai báo một biến. Trong NetBeans nhấn
  <strong>Alt + Shift + F</strong> là tự chuẩn hoá phần lớn.</p>`),

  H('Comment — thiếu là KHÔNG được review'),
  P(`<p>Slide ghi: <em>"Có đủ comment source ít nhất cho <strong>function</strong> và
  <strong>block/rẽ nhánh</strong>. Không có comment → không review"</em>.</p>
  <p>Không cần dài. Một dòng <code>//</code> nói <strong>hàm này làm gì</strong> và
  <strong>khối này để làm gì</strong> là đủ — đúng như code mẫu của thầy.</p>`),

  C('Mức comment thầy muốn — lấy từ chính bài mẫu', `//Function 4: Search doctor
public void searchDoctor(String input) throws Exception {
    //Kiem tra database co du lieu truoc khi search
    if (doctorRepository.isEmpty()) {
        throw new Exception(Message.DATABASE_EMPTY);
    }

    //neu k thay ket qua
    Map<String, DoctorResponseDTO> result = doctorRepository.searchDoctor(input);
    if (result == null || result.isEmpty()) {
        throw new Exception(Message.NO_DOCTOR_AVAILABLE);
    }

    //Truyen du lieu sang view
    doctorView.setDoctorMap(result);
    doctorView.display();
}`),

  P(`<p><strong>Chú ý:</strong> comment nói <em>ý định</em>, không nhại lại code.
  <code>// tăng i lên 1</code> cho dòng <code>i++</code> là vô giá trị.
  <code>// duyệt qua tất cả bác sĩ để tìm từ khoá</code> mới là thứ thầy muốn.</p>`),
);

// ══════════════════════════════════════════════════════════════
add(
  PART('19', '12 câu hỏi review & đáp án mẫu', 'Ôn trước khi giơ tay xin review'),

  P(`<p>Danh sách này lấy nguyên văn từ slide 10 (<em>"Khi review, cần đảm bảo và trả lời được"</em>).
  Trả lời bằng cách <strong>chỉ vào dòng code của mình</strong>, không nói lý thuyết suông.</p>`),

  P(`<p><strong>1. Liệt kê 4 tính chất OOP, chỉ ra trong source em cái nào ở đâu?</strong><br/>
  → Encapsulation: field <code>private</code> + getter/setter trong <code>Doctor</code>.
  Abstraction: <code>Controller</code> giấu chuyện dữ liệu nằm trong <code>HashMap</code>.
  Inheritance: <code>Doctor extends Person</code>. Polymorphism: <code>@Override toString()</code>.</p>

  <p><strong>2. <code>public</code>, <code>private</code>, <code>protected</code>, <code>default</code> khác nhau
  thế nào?</strong><br/>
  → <code>private</code>: chỉ trong class. <code>default</code>: thêm cùng package.
  <code>protected</code>: thêm class con khác package. <code>public</code>: mọi nơi.</p>

  <p><strong>3. Tại sao field này em để <code>private</code>?</strong><br/>
  → Vì ngoài class không ai cần chạm thẳng. Mở qua getter/setter để sau này thêm kiểm tra chỉ sửa một chỗ.</p>

  <p><strong>4. Tại sao <code>Validation</code> dùng <code>static</code>?</strong><br/>
  → Hàm thuần, không phụ thuộc trạng thái đối tượng, gọi từ nhiều nơi. Không static thì phải
  <code>new Validation()</code> — tạo đối tượng rỗng vô nghĩa.</p>

  <p><strong>5. Bỏ <code>static</code> đi thì sao?</strong><br/>
  → Không biên dịch được ở mọi chỗ gọi <code>Validation.getString(...)</code>.</p>

  <p><strong>6. Không dùng <code>static</code> thì sửa source thế nào cho chạy?</strong><br/>
  → Bỏ <code>private</code> ở constructor, tạo <code>Validation v = new Validation();</code> trong Main,
  đổi mọi lời gọi thành <code>v.getString(...)</code>.</p>

  <p><strong>7. Tại sao method này trả về <code>void</code>, method kia trả về <code>String</code>?</strong><br/>
  → <code>void</code> khi hàm chỉ làm việc, lỗi thì ném exception. <code>String</code> khi cần trả chuỗi
  cho nơi khác dùng — như <code>toString()</code>, vì Model cấm in.</p>

  <p><strong>8. Tại sao dùng <code>ArrayList</code> mà không phải <code>List</code>? (hoặc ngược lại)</strong><br/>
  → <code>List</code> là <strong>giao diện</strong> — bản hợp đồng nói "có <code>add</code>, <code>get</code>,
  <code>size</code>". <code>ArrayList</code> là <strong>bản cài đặt</strong> bằng mảng động: lấy theo chỉ số
  rất nhanh, chèn/xoá giữa thì chậm vì phải dịch phần tử. <code>LinkedList</code> cài cùng hợp đồng bằng
  danh sách liên kết, ngược lại. Tương tự <code>Map</code> là hợp đồng, <code>HashMap</code> cài bằng băm nên
  <strong>không giữ thứ tự</strong>, <code>LinkedHashMap</code> giữ thứ tự thêm vào, <code>TreeMap</code> sắp
  theo khoá.</p>

  <p><strong>9. Tại sao ở đây em dùng <code>HashMap</code> chứ không phải <code>ArrayList</code>?</strong><br/>
  → Vì tìm theo mã bác sĩ là thao tác chính. <code>HashMap</code> tra theo khoá gần như tức thì,
  còn <code>ArrayList</code> phải duyệt từ đầu. Và khoá là duy nhất nên chặn trùng mã luôn.</p>

  <p><strong>10. Em dùng Design Pattern gì, nó giải quyết vấn đề gì?</strong><br/>
  → Nêu <strong>tên</strong> → <strong>vấn đề trong bài này</strong> → <strong>class nào đóng vai gì</strong>
  → <strong>không dùng thì code xấu ra sao</strong>. Đủ bốn ý là đạt.</p>

  <p><strong>11. Em implement nguyên lý SOLID nào?</strong><br/>
  → SRP luôn có sẵn nhờ cấu trúc 8 package. Nói thêm một nguyên lý bạn <em>thật sự</em> làm
  (thường là DIP hoặc OCP), và chỉ đúng chỗ.</p>

  <p><strong>12. Debug cho thầy xem.</strong><br/>
  → Đặt breakpoint bằng <strong>Ctrl + F8</strong>, chạy <strong>Ctrl + F5</strong>,
  bước qua <strong>F8</strong>, bước vào trong <strong>F7</strong>. Tập trước ở nhà:
  đặt breakpoint tại <code>addDoctor</code> và xem <code>dto</code> mang giá trị gì.</p>`),

  H('Checklist tự soát trước khi xin review'),
  P(`<ul>
  <li>☐ Đủ 8 package, đặt tên đúng</li>
  <li>☐ <code>Scanner</code> chỉ có trong <code>Main.java</code></li>
  <li>☐ <code>System.out</code> chỉ có trong <code>View</code> và <code>Main</code></li>
  <li>☐ Mọi field là <code>private</code></li>
  <li>☐ <code>static</code> chỉ có ở <code>utils/Validation</code></li>
  <li>☐ Không câu chữ nào bị hardcode ngoài <code>constants/Message</code></li>
  <li>☐ Mỗi function có một dòng <code>//</code>; mỗi vòng lặp / rẽ nhánh có một dòng <code>//</code></li>
  <li>☐ Đã nhấn <strong>Alt + Shift + F</strong></li>
  <li>☐ Đã chạy thử <strong>hết</strong> happy case và <strong>hết</strong> các message lỗi</li>
  <li>☐ Đặt được breakpoint và debug được</li>
  <li>☐ Trả lời được 12 câu ở trên</li>
  </ul>`),

  P(`<p><em>Bài giảng soạn từ đúng bộ tài liệu Fall 2026 của giảng viên: Huong-dan-hoc-LAB211.pptx ·
  Guide.xlsx (kiến trúc + code mẫu J1.S.P0055) · OOP_Java_Guide.docx · SOLID-Principles.pptx ·
  Design Pattern.pptx · Chapter 7 – Static Modeling · Java Code Conventions (Sun 1997) ·
  Lab Grading Policy.</em></p>`),
);

// ══════════════════════════════════════════════════════════════
const dem0 = {};
let chu0 = 0;
for (const b of blocks) {
  dem0[b.type] = (dem0[b.type] || 0) + 1;
  chu0 += (b.html || b.code || b.text || '').length;
}

// Xem trước KHÔNG cần database — dùng để duyệt nội dung trước khi ghi.
if (process.argv.includes('--xem')) {
  const fs = await import('node:fs');
  fs.writeFileSync('/tmp/lab211-lesson.json', JSON.stringify(blocks, null, 2));
  console.log(`${blocks.length} khối — ${chu0.toLocaleString('vi-VN')} ký tự`);
  console.log(Object.entries(dem0).map(([k, v]) => `${k} ${v}`).join(' · '));
  console.log('\nDÀN Ý:');
  for (const b of blocks) {
    if (b.type === 'part') console.log(`\n  ▄▄ PHẦN ${b.number}: ${b.text}`);
    else if (b.type === 'heading') console.log(`     • ${b.text}`);
    else if (b.type === 'code') console.log(`        [code] ${b.title || ''}`);
    else if (b.type === 'mermaid') console.log(`        [sơ đồ]`);
  }
  console.log('\nĐã lưu đầy đủ ở /tmp/lab211-lesson.json');
  process.exit(0);
}

const mod = await prisma.codeModule.findFirst({
  where: { slug: 'lab211-assignments', track: { slug: 'lab211' } },
  select: { id: true, name: true, lessonBlocks: true, track: { select: { name: true } } },
});

if (!mod) {
  console.error('Không tìm thấy module lab211-assignments trong track lab211.');
  process.exit(1);
}

const dem = { part: 0, heading: 0, prose: 0, code: 0, mermaid: 0 };
let chu = 0;
for (const b of blocks) {
  dem[b.type] = (dem[b.type] || 0) + 1;
  chu += (b.html || b.code || b.text || '').length;
}

const cu = Array.isArray(mod.lessonBlocks) ? mod.lessonBlocks.length : 0;
console.log(`Track   : ${mod.track.name}`);
console.log(`Module  : ${mod.name} (id ${mod.id})`);
console.log(`Hiện có : ${cu} khối`);
// Tính đúng tổng SAU khi cắt phần cũ của chính script này, không cộng thẳng.
const cuArrXem = Array.isArray(mod.lessonBlocks) ? mod.lessonBlocks : [];
const catXem = cuArrXem.findIndex((b) => b && b.type === 'part' && b.text === blocks[0].text);
const giuXem = catXem >= 0 ? catXem : cuArrXem.length;
console.log(`Sẽ NỐI  : ${blocks.length} khối — ${chu.toLocaleString('vi-VN')} ký tự  →  giữ ${giuXem} cũ, tổng ${giuXem + blocks.length}`);
console.log(`          part ${dem.part} · heading ${dem.heading} · prose ${dem.prose} · code ${dem.code} · mermaid ${dem.mermaid}`);

if (!APPLY) {
  console.log('\n(thử khô — thêm --apply để ghi thật)');
} else {
  // ⛔ NỐI THÊM, KHÔNG ghi đè. Module này đã có sẵn bài giảng 265 khối
  // (soạn 20/07/2026, tiếng Anh, dạy Java nền tảng) — ghi đè là xoá mất nó.
  // Chạy lại script nhiều lần cũng chỉ ra một bản: nếu đã có phần của mình
  // rồi thì CẮT từ đó đi rồi nối lại, thay vì cộng dồn.
  const cuArr = Array.isArray(mod.lessonBlocks) ? mod.lessonBlocks : [];
  const MOC = blocks[0].text;                       // 'Luật chơi LAB211'
  const cat = cuArr.findIndex((b) => b && b.type === 'part' && b.text === MOC);
  const giuLai = cat >= 0 ? cuArr.slice(0, cat) : cuArr;
  const ketQua = [...giuLai, ...blocks];

  await prisma.codeModule.update({
    where: { id: mod.id },
    data: {
      lessonBlocks: ketQua,
      lessonGeneratedAt: new Date(),
    },
  });
  console.log(`\n✅ Giữ ${giuLai.length} khối cũ + nối ${blocks.length} khối mới = ${ketQua.length} khối.`);
}
await prisma.$disconnect();
