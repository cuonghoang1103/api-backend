/**
 * build-pro192-pe-adv4.mjs — sinh content/exams/PRO192-PE-ADV4.mjs.
 *
 * KHÁC các đề PE khác trong kho: đây KHÔNG phải đề thi trường thật được chép
 * lại — đây là đề LUYỆN TẬP NÂNG CAO do chính chúng ta soạn (source: 'SAMPLE'),
 * bổ sung cho 11 đề PE thật đã có. Chủ đề: chuỗi kế thừa 3 TẦNG
 * (Device -> Laptop -> GamingLaptop), field `static` làm bộ đếm ID tự tăng
 * (sinh mã "D001", "D002"...), và hợp đồng equals()/hashCode().
 *
 * Vì sao cần: các đề PE thật hiếm khi đi quá 1 tầng kế thừa và gần như không
 * bao giờ kiểm tra equals()/hashCode(), trong khi LAB211 (kỳ 3) dùng dày đặc
 * bộ đếm ID static + logic phát hiện trùng lặp. Đề này lấp đúng khoảng trống đó.
 *
 * VERIFY (không có "đáp án chuẩn" bên ngoài để đối chiếu, nên phải chạy thật):
 * mọi lớp lời giải + 4 harness Main.java đã được `javac --release 8` rồi
 * `java Main` với stdin chính xác; expectedOutput bên dưới là stdout THẬT đã
 * bắt lại, KHÔNG phải suy luận từ code. Ngoài ra 3 cái bẫy kinh điển đã được
 * TÁI HIỆN bằng 3 biến thể hỏng biên dịch + chạy thật:
 *   - equals() không kèm hashCode()  -> HashSet.size() = 2 (đúng phải là 1)
 *   - so sánh Integer bằng ==        -> ram=16 (trong cache) "đúng" giả tạo,
 *                                       ram=256 (ngoài cache) sai
 *   - equals() dùng `instanceof Laptop` -> bất đối xứng: gl.equals(lp)=true
 *                                       nhưng lp.equals(gl)=false
 * Lời giải tham chiếu ở đây tránh cả 3 (dùng getClass(), so sánh int nguyên
 * thuỷ, có hashCode() nhất quán với equals()).
 *
 * Given materials: đóng gói lại từ scaffold NetBeans sạch (Q1-Q4), mỗi thư mục
 * chỉ chứa .class đã biên dịch (Main.class + các tầng TRƯỚC của chuỗi kế thừa),
 * KHÔNG có file .java lời giải nào. Đã kiểm từng thư mục: chép lớp sinh viên
 * cần viết vào -> javac + java Main -> chạy đúng -> xoá đi rồi mới zip.
 * Upload R2 PRO192/PE-ADV4-Given.zip, verify GET 200 + unzip đúng 46 file.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE-ADV4.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE-ADV4.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE-ADV4-Given.zip';

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ─────────────────────────── Reference solutions (compiled + run, verified) ──
const SOL_DEVICE = `public class Device {

    private static int nextId = 1;

    private String code;
    private String name;
    private int price;

    public Device() {
        this.code = generateCode();
        this.name = "Unknown";
        this.price = 0;
    }

    public Device(String name, int price) {
        this.code = generateCode();
        this.name = name;
        this.price = price;
    }

    private static String generateCode() {
        String c = String.format("D%03d", nextId);
        nextId++;
        return c;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getWarrantyMonths() {
        return 12;
    }

    @Override
    public String toString() {
        return code + ", " + name + ", " + price;
    }
}`;

const SOL_LAPTOP = `public class Laptop extends Device {

    private int ram;

    public Laptop() {
        super();
        this.ram = 0;
    }

    public Laptop(String name, int price, int ram) {
        super(name, price);
        this.ram = ram;
    }

    public int getRam() {
        return ram;
    }

    public void setRam(int ram) {
        this.ram = ram;
    }

    @Override
    public int getWarrantyMonths() {
        if (ram >= 16) {
            return 24;
        }
        return 18;
    }

    @Override
    public String toString() {
        return super.toString() + ", " + ram;
    }
}`;

const SOL_GAMING = `import java.util.Objects;

public class GamingLaptop extends Laptop {

    private String gpu;

    public GamingLaptop() {
        super();
        this.gpu = "None";
    }

    public GamingLaptop(String name, int price, int ram, String gpu) {
        super(name, price, ram);
        this.gpu = gpu;
    }

    public String getGpu() {
        return gpu;
    }

    public void setGpu(String gpu) {
        this.gpu = gpu;
    }

    @Override
    public int getWarrantyMonths() {
        return super.getWarrantyMonths() + 6;
    }

    @Override
    public String toString() {
        return super.toString() + ", " + gpu;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || this.getClass() != o.getClass()) {
            return false;
        }
        GamingLaptop other = (GamingLaptop) o;
        return this.getRam() == other.getRam()
                && Objects.equals(this.getName(), other.getName())
                && Objects.equals(this.gpu, other.gpu);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.getName(), this.getRam(), this.gpu);
    }
}`;

const SOL_MANAGER = `import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;

public class DeviceManager {

    public static int countDistinct(List<Device> list) {
        if (list == null) {
            return 0;
        }
        return new HashSet<Device>(list).size();
    }

    public static List<Device> removeDuplicates(List<Device> list) {
        List<Device> result = new ArrayList<Device>();
        if (list == null) {
            return result;
        }
        LinkedHashSet<Device> set = new LinkedHashSet<Device>(list);
        result.addAll(set);
        return result;
    }
}`;

// ───────────────────────────────────────────────────────────── instructions ──
const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> — adapted from the standard PRO192 Practical Exam paper.</p>
   <p><strong>Note: this is self-authored supplementary practice material, NOT an official school exam paper.</strong> No real PE paper was transcribed to make it. Every class, harness and sample output below was written and then verified by actually compiling and running the code. Treat it exactly like the real thing while you practise — same rules, same time pressure.</p>
   <ol>
     <li>Software required: NetBeans 13 or later, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Students are ONLY allowed to use their own study materials (sample code, program examples) stored on their own computer.</li>
     <li>Create a folder to save the given projects (e.g. PRO_given), download the given materials into it. Open NetBeans, open the given Qx project, then complete it according to the exam requirements. Do NOT delete or edit given files, or create a java file with the same name as a given file.</li>
     <li>Before submission: run "Clean and Build Project" (Shift+F11); for each question create two sub-folders <strong>run</strong> and <strong>src</strong>, copy the built <code>Qx.jar</code> into <strong>run</strong> and the entire project source into <strong>src</strong>.</li>
     <li>Do NOT use accented Vietnamese in code comments. Do NOT change the names of the folders/files specified in the exam. All .java source files use the NetBeans default package.</li>
     <li><strong>This paper's questions build on each other.</strong> Q2 needs the <code>Device</code> class from Q1, Q3 needs <code>Device</code> and <code>Laptop</code>, Q4 needs all three. In the given materials those earlier classes are already supplied as compiled <code>.class</code> files inside each <code>Qx/src</code>, so each question can be built and run on its own — you only write the ONE new class each question asks for.</li>
   </ol>
   <p>This exam room cannot run NetBeans/JDK in the browser, so you type each class directly into the code box below and it is graded by AI against the rubric — but the "given materials" download above is a real NetBeans project set (with the compiled <code>Main.class</code> harness) so you can build &amp; run it for real on your own machine exactly like the actual PE, and cross-check your output against the samples shown.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> — phỏng theo mẫu đề thi thực hành PRO192 chuẩn.</p>
   <p><strong>Lưu ý: đây là tài liệu luyện tập nâng cao do chúng tôi tự soạn, KHÔNG phải đề thi chính thức của trường.</strong> Không có đề thật nào được chép lại để làm ra nó. Mọi lớp, harness và output mẫu bên dưới đều đã được viết rồi kiểm chứng bằng cách biên dịch và chạy thật. Hãy luyện tập với nó y như thi thật — cùng luật, cùng áp lực thời gian.</p>
   <ol>
     <li>Yêu cầu phần mềm: NetBeans 13 trở lên, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Sinh viên CHỈ được dùng tài liệu học tập (mã mẫu, ví dụ chương trình) lưu trên máy tính của mình.</li>
     <li>Tạo một thư mục chứa các project given (vd PRO_given), tải given materials vào đó. Mở NetBeans, mở project Qx tương ứng, hoàn thành theo yêu cầu đề bài. KHÔNG xoá/sửa file given, KHÔNG tạo file java trùng tên với file given.</li>
     <li>Trước khi nộp: chạy "Clean and Build Project" (Shift+F11); với mỗi câu tạo 2 thư mục con <strong>run</strong> và <strong>src</strong>, chép file <code>Qx.jar</code> đã build vào <strong>run</strong>, chép toàn bộ mã nguồn project vào <strong>src</strong>.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment code. KHÔNG đổi tên các thư mục/file đã quy định trong đề. Mọi file nguồn .java dùng package mặc định của NetBeans.</li>
     <li><strong>Các câu trong đề này nối tiếp nhau.</strong> Câu 2 cần lớp <code>Device</code> của câu 1, câu 3 cần <code>Device</code> và <code>Laptop</code>, câu 4 cần cả ba. Trong given materials, các lớp tầng trước đã được cấp sẵn dạng <code>.class</code> đã biên dịch trong từng <code>Qx/src</code>, nên mỗi câu build và chạy độc lập được — bạn chỉ viết ĐÚNG MỘT lớp mới mà câu đó yêu cầu.</li>
   </ol>
   <p>Phòng thi web không chạy được NetBeans/JDK trực tiếp trên trình duyệt, nên bạn gõ thẳng từng class vào ô mã bên dưới và được AI chấm theo tiêu chí — nhưng file "given materials" tải ở trên là bộ project NetBeans thật (kèm harness <code>Main.class</code> đã biên dịch sẵn) để bạn build &amp; chạy thật trên máy mình y hệt bài thi thật, và tự đối chiếu kết quả với các mẫu bên dưới.</p>`,
);

// ══════════════════════════════════════════════════════════════════════ Q1 ══
const q1PromptEn = `<p><strong>(2 marks)</strong> Do not pay attention to real meaning of objects, variables and their values in the questions below.</p>
<p>Write a class <strong>Device</strong> (in the default package of the NetBeans project Q1) with the following information:</p>
${table([
  '-nextId: int  <em>(static)</em><br/>-code: String<br/>-name: String<br/>-price: int',
  '+Device()<br/>+Device(name: String, price: int)<br/>+getCode(): String<br/>+getName(): String<br/>+getPrice(): int<br/>+setPrice(price: int): void<br/>+getWarrantyMonths(): int<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>nextId</code> — a <strong>private static</strong> counter shared by every Device object, starting at <strong>1</strong>. It is NOT a per-object field: there is exactly one copy of it for the whole class.</li>
  <li><code>Device()</code> — default constructor: sets name to <code>"Unknown"</code>, price to <code>0</code>, and <strong>still consumes the next code</strong> (a Device created with the no-arg constructor is a real Device and must get an ID like any other).</li>
  <li><code>Device(name: String, price: int)</code> — parameterized constructor which sets values to name and price.</li>
  <li>Every constructor must assign <code>code</code> automatically from the counter, in the format <strong>"D" followed by the counter zero-padded to 3 digits</strong> — the 1st object created is <code>D001</code>, the 2nd <code>D002</code>, the 3rd <code>D003</code>, ... Then increment the counter. The caller never passes a code in.</li>
  <li><code>getCode(): String</code>, <code>getName(): String</code>, <code>getPrice(): int</code> — return the corresponding field.</li>
  <li><code>setPrice(price: int): void</code> — update price.</li>
  <li><code>getWarrantyMonths(): int</code> — return <strong>12</strong> for a plain Device.</li>
  <li><code>toString(): String</code> — return the string of format: <strong>code, name, price</strong>.</li>
</ul>
<p><em>Do not format the result. The counter is never reset — it keeps counting for the whole run of the program.</em></p>`;

const q1PromptVi = `<p><strong>(2 điểm)</strong> Bỏ qua ý nghĩa thực tế của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</p>
<p>Viết lớp <strong>Device</strong> (trong package mặc định của project NetBeans Q1) với thông tin sau:</p>
${table([
  '-nextId: int  <em>(static)</em><br/>-code: String<br/>-name: String<br/>-price: int',
  '+Device()<br/>+Device(name: String, price: int)<br/>+getCode(): String<br/>+getName(): String<br/>+getPrice(): int<br/>+setPrice(price: int): void<br/>+getWarrantyMonths(): int<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>nextId</code> — bộ đếm <strong>private static</strong> dùng chung cho MỌI đối tượng Device, bắt đầu từ <strong>1</strong>. Nó KHÔNG phải field của từng đối tượng: cả lớp chỉ có duy nhất một bản.</li>
  <li><code>Device()</code> — constructor mặc định: gán name = <code>"Unknown"</code>, price = <code>0</code>, và <strong>vẫn tiêu tốn mã kế tiếp</strong> (đối tượng tạo bằng constructor không tham số vẫn là một Device thật, phải được cấp ID như mọi đối tượng khác).</li>
  <li><code>Device(name: String, price: int)</code> — constructor có tham số, gán giá trị cho name và price.</li>
  <li>Mọi constructor phải tự gán <code>code</code> từ bộ đếm, theo định dạng <strong>"D" + số đếm đệm 0 cho đủ 3 chữ số</strong> — đối tượng tạo thứ 1 là <code>D001</code>, thứ 2 là <code>D002</code>, thứ 3 là <code>D003</code>, ... Sau đó tăng bộ đếm. Người gọi KHÔNG bao giờ truyền code vào.</li>
  <li><code>getCode(): String</code>, <code>getName(): String</code>, <code>getPrice(): int</code> — trả về field tương ứng.</li>
  <li><code>setPrice(price: int): void</code> — cập nhật price.</li>
  <li><code>getWarrantyMonths(): int</code> — trả về <strong>12</strong> với Device thường.</li>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>code, name, price</strong>.</li>
</ul>
<p><em>Không định dạng lại kết quả. Bộ đếm không bao giờ bị reset — nó đếm liên tục suốt quá trình chạy chương trình.</em></p>`;

const q1ExplainEn = `<p><strong>Why <code>static</code> here.</strong> A non-static field lives inside each object: 10 Devices means 10 separate <code>price</code> values. A <code>static</code> field lives inside the <em>class</em>: no matter how many Devices exist, there is exactly ONE <code>nextId</code>. That is precisely what makes an auto-incrementing ID work — object #2 has to be able to see what object #1 took. If you make <code>nextId</code> an instance field, every object starts its own count and every single one gets <code>D001</code>.</p>
<p><strong>Assign, then increment.</strong> The order matters. <code>code = String.format("D%03d", nextId); nextId++;</code> gives D001, D002, D003. Incrementing first gives D002, D003, D004 — a classic off-by-one that costs the whole mark. <code>String.format("D%03d", n)</code> is what produces the zero padding (1 → "001").</p>
<p><strong>The no-arg constructor still consumes an ID.</strong> In sample run 1 the middle object is created with <code>new Device()</code> and it takes <code>D002</code> — so the third object gets <code>D003</code>, not <code>D002</code>. Students who only put the counter logic in the parameterized constructor produce D001, D001, D002 here. Putting the code-generation in a small <code>private static</code> helper (or calling <code>this(...)</code>) keeps both constructors in sync.</p>
<p><strong>This matters for LAB211.</strong> Nearly every LAB211 management program auto-generates codes like "D001"/"C001"/"S001" this exact way — get it right here and that part of LAB211 is already done.</p>
<p>Verified by compiling <code>Device.java</code> with the real given <code>Main.class</code> and capturing the actual stdout:</p>
<pre>TC 1 -> D001 / D002 / D003   (2nd object is new Device(), still takes an ID)
TC 2 -> D001, Dell XPS, 1200 / D002, HP Pavilion, 800
TC 3 -> 1500 / 12 / D001, Dell XPS, 1500</pre>`;

const q1ExplainVi = `<p><strong>Vì sao phải <code>static</code>.</strong> Field không static nằm TRONG từng đối tượng: 10 Device là 10 giá trị <code>price</code> riêng biệt. Field <code>static</code> nằm trong <em>lớp</em>: dù có bao nhiêu Device đi nữa thì cũng chỉ có DUY NHẤT một <code>nextId</code>. Đó chính là thứ làm cho ID tự tăng hoạt động được — đối tượng thứ 2 phải "nhìn thấy" được đối tượng thứ 1 đã lấy số nào. Nếu để <code>nextId</code> là field thường, mỗi đối tượng đếm riêng và tất cả đều nhận <code>D001</code>.</p>
<p><strong>Gán trước, tăng sau.</strong> Thứ tự rất quan trọng. <code>code = String.format("D%03d", nextId); nextId++;</code> cho D001, D002, D003. Tăng trước rồi gán sẽ cho D002, D003, D004 — lỗi lệch một đơn vị kinh điển, mất trọn điểm. <code>String.format("D%03d", n)</code> chính là thứ đệm số 0 (1 → "001").</p>
<p><strong>Constructor không tham số VẪN tiêu một ID.</strong> Ở mẫu chạy 1, đối tượng giữa được tạo bằng <code>new Device()</code> và nó lấy <code>D002</code> — nên đối tượng thứ ba nhận <code>D003</code> chứ không phải <code>D002</code>. Ai chỉ đặt logic bộ đếm trong constructor có tham số sẽ ra D001, D001, D002. Đặt phần sinh mã vào một hàm <code>private static</code> nhỏ (hoặc gọi <code>this(...)</code>) giúp 2 constructor luôn đồng bộ.</p>
<p><strong>Điều này rất quan trọng cho LAB211.</strong> Gần như mọi chương trình quản lý trong LAB211 đều tự sinh mã kiểu "D001"/"C001"/"S001" đúng theo cách này — làm đúng ở đây là phần đó của LAB211 coi như xong.</p>
<p>Đã kiểm bằng cách biên dịch <code>Device.java</code> cùng <code>Main.class</code> given thật và bắt lại stdout thực tế:</p>
<pre>TC 1 -> D001 / D002 / D003   (đối tượng thứ 2 là new Device(), vẫn lấy 1 ID)
TC 2 -> D001, Dell XPS, 1200 / D002, HP Pavilion, 800
TC 3 -> 1500 / 12 / D001, Dell XPS, 1500</pre>`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `public class Device {

    private static int nextId = 1;   // shared by the WHOLE class, starts at 1

    private String code;
    private String name;
    private int price;

    public Device() {
        // TODO: name = "Unknown", price = 0, and still take the next code
    }

    public Device(String name, int price) {
        // TODO: assign code from the counter ("D001", "D002", ...), then name/price
    }

    public String getCode() {
        // TODO
        return null;
    }

    public String getName() {
        // TODO
        return null;
    }

    public int getPrice() {
        // TODO
        return 0;
    }

    public void setPrice(int price) {
        // TODO
    }

    public int getWarrantyMonths() {
        // TODO: a plain Device has 12 months
        return 0;
    }

    @Override
    public String toString() {
        // TODO: "code, name, price"
        return null;
    }
}`,
  sampleSolution: SOL_DEVICE,
  expectedOutput:
`Sample run 1 (TC 1 - getCode(), 3 objects: Device("Dell XPS",1200), new Device(), Device("HP Pavilion",800)):
OUTPUT:
D001
D002
D003

Sample run 2 (TC 2 - toString(), Device("Dell XPS",1200) then Device("HP Pavilion",800)):
OUTPUT:
D001, Dell XPS, 1200
D002, HP Pavilion, 800

Sample run 3 (TC 3 - setPrice()/getWarrantyMonths(), Device("Dell XPS",1200), new price 1500):
OUTPUT:
1500
12
D001, Dell XPS, 1500`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'static_counter', criterion: B('nextId is declared private static and initialised to 1 (one shared copy for the class, not one per object).', 'nextId khai báo private static và khởi tạo bằng 1 (một bản dùng chung cho cả lớp, không phải mỗi đối tượng một bản).'), weight: 2, maxScore: 0.6 },
    { id: 'code_format', criterion: B('Both constructors auto-assign code as "D" + counter zero-padded to 3 digits, assigning BEFORE incrementing, so the first three objects are D001, D002, D003.', 'Cả 2 constructor tự gán code = "D" + số đếm đệm 0 đủ 3 chữ số, GÁN TRƯỚC rồi mới tăng, nên 3 đối tượng đầu là D001, D002, D003.'), weight: 3, maxScore: 0.7 },
    { id: 'default_ctor', criterion: B('The no-arg constructor sets name="Unknown", price=0 AND still consumes the next code (does not skip the counter).', 'Constructor không tham số gán name="Unknown", price=0 VÀ vẫn tiêu mã kế tiếp (không bỏ qua bộ đếm).'), weight: 2, maxScore: 0.3 },
    { id: 'accessors', criterion: B('Getters/setPrice work, getWarrantyMonths() returns 12, toString() returns "code, name, price".', 'Các getter/setPrice hoạt động đúng, getWarrantyMonths() trả 12, toString() trả "code, name, price".'), weight: 2, maxScore: 0.4 },
  ],
};

// ══════════════════════════════════════════════════════════════════════ Q2 ══
const q2PromptEn = `<p><strong>(3 marks)</strong> Write a class <strong>Laptop</strong> extending from <strong>Device</strong> (the class you wrote in Q1 — in the given Q2 project it is already supplied as a compiled <code>Device.class</code>, so do NOT create Device.java again) with the following information:</p>
${table([
  '-ram: int',
  '+Laptop()<br/>+Laptop(name: String, price: int, ram: int)<br/>+getRam(): int<br/>+setRam(ram: int): void<br/>+getWarrantyMonths(): int<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>Laptop()</code> — default constructor: calls the superclass default constructor and sets ram to <code>0</code>.</li>
  <li><code>Laptop(name: String, price: int, ram: int)</code> — parameterized constructor. It must pass name and price <strong>up to the superclass constructor</strong> (<code>super(name, price)</code>) rather than trying to set them itself — <code>name</code> and <code>price</code> are private in Device and a subclass cannot touch them directly. The code is still auto-generated by Device from the SAME shared counter.</li>
  <li><code>getRam(): int</code> / <code>setRam(ram: int): void</code> — get/update ram.</li>
  <li><code>getWarrantyMonths(): int</code> — <strong>override</strong>. A Laptop returns <strong>24</strong> if ram is greater than or equal to 16, otherwise <strong>18</strong>. (A plain Device returns 12.)</li>
  <li><code>toString(): String</code> — <strong>override</strong>. It must be built by calling <code>super.toString()</code> and appending the new field, giving the format <strong>code, name, price, ram</strong>. Do NOT re-build the string from scratch.</li>
</ul>
<p><em>Note the shared counter: if you create a Device, then a Laptop, then a Device, then a Laptop, the four codes are D001, D002, D003, D004 — the counter does not restart for the subclass.</em></p>`;

const q2PromptVi = `<p><strong>(3 điểm)</strong> Viết lớp <strong>Laptop</strong> kế thừa từ <strong>Device</strong> (lớp bạn đã viết ở câu 1 — trong project Q2 given nó đã được cấp sẵn dạng <code>Device.class</code> đã biên dịch, nên KHÔNG tạo lại Device.java) với thông tin sau:</p>
${table([
  '-ram: int',
  '+Laptop()<br/>+Laptop(name: String, price: int, ram: int)<br/>+getRam(): int<br/>+setRam(ram: int): void<br/>+getWarrantyMonths(): int<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Laptop()</code> — constructor mặc định: gọi constructor mặc định của lớp cha và gán ram = <code>0</code>.</li>
  <li><code>Laptop(name: String, price: int, ram: int)</code> — constructor có tham số. Nó phải chuyển name và price <strong>lên constructor lớp cha</strong> (<code>super(name, price)</code>) chứ không tự gán — <code>name</code> và <code>price</code> là private trong Device, lớp con không đụng trực tiếp được. Mã code vẫn do Device tự sinh từ CÙNG bộ đếm dùng chung.</li>
  <li><code>getRam(): int</code> / <code>setRam(ram: int): void</code> — lấy/cập nhật ram.</li>
  <li><code>getWarrantyMonths(): int</code> — <strong>ghi đè</strong>. Laptop trả về <strong>24</strong> nếu ram lớn hơn hoặc bằng 16, ngược lại trả <strong>18</strong>. (Device thường trả 12.)</li>
  <li><code>toString(): String</code> — <strong>ghi đè</strong>. Phải dựng bằng cách gọi <code>super.toString()</code> rồi nối thêm field mới, cho định dạng <strong>code, name, price, ram</strong>. KHÔNG dựng lại chuỗi từ đầu.</li>
</ul>
<p><em>Chú ý bộ đếm dùng chung: nếu bạn tạo Device, rồi Laptop, rồi Device, rồi Laptop thì bốn mã là D001, D002, D003, D004 — bộ đếm KHÔNG khởi động lại cho lớp con.</em></p>`;

const q2ExplainEn = `<p><strong>The static counter is shared by the whole hierarchy — this is the point of TC 3.</strong> <code>nextId</code> is declared once, in <code>Device</code>. A subclass does not get its own copy. So the interleaved run Device, Laptop, Device, Laptop produces D001, D002, D003, D004: the Laptop constructor's implicit trip through <code>super(name, price)</code> hits exactly the same counter. This surprises people who expect "Laptop numbering" to be separate. If you ever genuinely need per-subclass numbering, you need a separate static field in each subclass — inheritance alone will not give it to you.</p>
<p><strong><code>super.toString()</code> composition, not re-implementation.</strong> <code>return super.toString() + ", " + ram;</code> is the whole method. Writing <code>return getCode() + ", " + getName() + ", " + getPrice() + ", " + ram;</code> happens to print the same text today, but it duplicates the parent's format: change Device's toString() and the Laptop version silently drifts out of sync. Composition is what the rubric rewards.</p>
<p><strong>Real overriding, not just toString.</strong> <code>getWarrantyMonths()</code> is the method that proves you understand dynamic dispatch: the SAME call written once in the harness returns 12 for a Device and 18 or 24 for a Laptop, chosen at run time by the object's actual type — and the Laptop answer depends on <code>ram</code>, a field that did not even exist at the Device level.</p>
<p>Verified by compiling <code>Laptop.java</code> against the given compiled <code>Device.class</code> and <code>Main.class</code>, capturing real stdout:</p>
<pre>TC 1 -> D001, Router X, 90 / D002, Acer Swift, 700, 8
TC 2 -> 12 / 18 / 24        (Device, Laptop ram=8, Laptop ram=16)
TC 3 -> D001 / D002 / D003 / D004   (Device, Laptop, Device, Laptop interleaved)</pre>`;

const q2ExplainVi = `<p><strong>Bộ đếm static dùng chung cho CẢ cây kế thừa — đó chính là ý của TC 3.</strong> <code>nextId</code> được khai báo đúng một lần, trong <code>Device</code>. Lớp con KHÔNG có bản sao riêng. Nên chuỗi xen kẽ Device, Laptop, Device, Laptop cho ra D001, D002, D003, D004: constructor của Laptop đi qua <code>super(name, price)</code> và chạm đúng bộ đếm đó. Điều này làm nhiều người bất ngờ vì tưởng "Laptop đánh số riêng". Nếu thật sự cần đánh số riêng theo từng lớp con, bạn phải khai báo field static riêng trong mỗi lớp con — bản thân kế thừa không cho bạn điều đó.</p>
<p><strong>Ghép nối bằng <code>super.toString()</code>, không viết lại.</strong> <code>return super.toString() + ", " + ram;</code> là toàn bộ phần thân hàm. Viết <code>return getCode() + ", " + getName() + ", " + getPrice() + ", " + ram;</code> hôm nay in ra y hệt, nhưng nó nhân bản định dạng của lớp cha: chỉ cần sửa toString() của Device là bản Laptop lệch pha trong im lặng. Tiêu chí chấm thưởng cho cách ghép nối.</p>
<p><strong>Ghi đè thật sự, không chỉ mỗi toString.</strong> <code>getWarrantyMonths()</code> là hàm chứng minh bạn hiểu điều phối động: CÙNG một lời gọi viết một lần trong harness lại trả 12 với Device và 18 hoặc 24 với Laptop, được chọn lúc chạy theo kiểu thật của đối tượng — và đáp án của Laptop phụ thuộc <code>ram</code>, một field thậm chí không tồn tại ở tầng Device.</p>
<p>Đã kiểm bằng cách biên dịch <code>Laptop.java</code> cùng <code>Device.class</code> và <code>Main.class</code> đã biên dịch sẵn trong given, bắt lại stdout thật:</p>
<pre>TC 1 -> D001, Router X, 90 / D002, Acer Swift, 700, 8
TC 2 -> 12 / 18 / 24        (Device, Laptop ram=8, Laptop ram=16)
TC 3 -> D001 / D002 / D003 / D004   (Device, Laptop, Device, Laptop xen kẽ)</pre>`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `// ─── ALREADY DEFINED FROM Q1 — shown here for reference only. ───
// In the given Q2 project this class is supplied as a compiled Device.class.
// You do NOT need to write it again; you only write Laptop below.
//
// public class Device {
//     private static int nextId = 1;
//     private String code, name;  private int price;
//     public Device()                          { code = "D" + padded(nextId++); name = "Unknown"; price = 0; }
//     public Device(String name, int price)    { code = "D" + padded(nextId++); ... }
//     public String getCode()  { return code; }
//     public String getName()  { return name; }
//     public int    getPrice() { return price; }
//     public void   setPrice(int price) { this.price = price; }
//     public int    getWarrantyMonths() { return 12; }
//     public String toString() { return code + ", " + name + ", " + price; }
// }
// ────────────────────────────────────────────────────────────────

public class Laptop extends Device {

    private int ram;

    public Laptop() {
        // TODO: super() + ram = 0
    }

    public Laptop(String name, int price, int ram) {
        // TODO: super(name, price) + ram
    }

    public int getRam() {
        // TODO
        return 0;
    }

    public void setRam(int ram) {
        // TODO
    }

    @Override
    public int getWarrantyMonths() {
        // TODO: ram >= 16 -> 24, otherwise 18
        return 0;
    }

    @Override
    public String toString() {
        // TODO: super.toString() + ", " + ram
        return null;
    }
}`,
  sampleSolution: SOL_LAPTOP,
  expectedOutput:
`Sample run 1 (TC 1 - toString(), Device("Router X",90) then Laptop("Acer Swift",700,8)):
OUTPUT:
D001, Router X, 90
D002, Acer Swift, 700, 8

Sample run 2 (TC 2 - getWarrantyMonths(), Device("Router X",90), Laptop("Acer Swift",700,8), Laptop("MSI Modern",900,16)):
OUTPUT:
12
18
24

Sample run 3 (TC 3 - shared static counter, Device, Laptop, Device, Laptop created in that order):
OUTPUT:
D001
D002
D003
D004`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'extends_super', criterion: B('Laptop extends Device; both constructors delegate to super(...) instead of trying to assign the private name/price/code themselves.', 'Laptop kế thừa Device; cả 2 constructor uỷ quyền cho super(...) thay vì tự gán name/price/code vốn là private.'), weight: 3, maxScore: 1 },
    { id: 'tostring_super', criterion: B('toString() is composed as super.toString() + ", " + ram (not re-built field by field), giving "code, name, price, ram".', 'toString() ghép từ super.toString() + ", " + ram (không dựng lại từng field), cho "code, name, price, ram".'), weight: 3, maxScore: 1 },
    { id: 'override_warranty', criterion: B('getWarrantyMonths() is a genuine override returning 24 when ram >= 16 and 18 otherwise (behaviour differs from Device by using the new field).', 'getWarrantyMonths() ghi đè thật sự, trả 24 khi ram >= 16 và 18 nếu ngược lại (hành vi khác Device nhờ dùng field mới).'), weight: 3, maxScore: 1 },
  ],
};

// ══════════════════════════════════════════════════════════════════════ Q3 ══
const q3PromptEn = `<p><strong>(3 marks)</strong> Write a class <strong>GamingLaptop</strong> extending from <strong>Laptop</strong> (from Q2 — both <code>Device.class</code> and <code>Laptop.class</code> are already supplied compiled in the given Q3 project, do NOT create them again) with the following information:</p>
${table([
  '-gpu: String',
  '+GamingLaptop()<br/>+GamingLaptop(name: String, price: int, ram: int, gpu: String)<br/>+getGpu(): String<br/>+setGpu(gpu: String): void<br/>+getWarrantyMonths(): int<br/>+toString(): String<br/>+equals(o: Object): boolean<br/>+hashCode(): int',
])}
<p>Where:</p>
<ul>
  <li><code>GamingLaptop()</code> — default constructor: calls the superclass default constructor and sets gpu to <code>"None"</code>.</li>
  <li><code>GamingLaptop(name, price, ram, gpu)</code> — parameterized constructor, passing name/price/ram up with <code>super(name, price, ram)</code>.</li>
  <li><code>getGpu()</code> / <code>setGpu()</code> — get/update gpu.</li>
  <li><code>getWarrantyMonths(): int</code> — <strong>override</strong>: return <strong><code>super.getWarrantyMonths()</code> + 6</strong> (a gaming laptop carries 6 extra months on top of whatever the Laptop rule gives). Call super, do not hard-code 30 or 24.</li>
  <li><code>toString(): String</code> — <strong>override</strong>: <code>super.toString()</code> plus the new field, giving <strong>code, name, price, ram, gpu</strong>.</li>
  <li><code>equals(Object o): boolean</code> — <strong>two GamingLaptop objects are equal when they are the same product model</strong>, that is when they have the same <strong>name</strong>, the same <strong>ram</strong> and the same <strong>gpu</strong>. The auto-generated <code>code</code> is a warehouse tag, NOT part of the identity, so it MUST be excluded from the comparison — and so must <code>price</code> (the same model can be on sale at a different price). Two objects that came out of two separate <code>new</code> calls, with different codes and different prices, must still be equal if name+ram+gpu match. Use an exact class match (<code>getClass()</code>), so a Laptop is never equal to a GamingLaptop in either direction.</li>
  <li><code>hashCode(): int</code> — must be consistent with equals(): objects that are equal must return the same hash code. Build it from exactly the same three fields (name, ram, gpu) — for example with <code>java.util.Objects.hash(...)</code>.</li>
</ul>
<p><em>Warning: do NOT let the IDE generate equals()/hashCode() over every field. Because <code>code</code> is auto-assigned and unique, including it would make every object different from every other object, and this question would be pointless.</em></p>`;

const q3PromptVi = `<p><strong>(3 điểm)</strong> Viết lớp <strong>GamingLaptop</strong> kế thừa từ <strong>Laptop</strong> (câu 2 — cả <code>Device.class</code> và <code>Laptop.class</code> đã được cấp sẵn dạng đã biên dịch trong project Q3 given, KHÔNG tạo lại) với thông tin sau:</p>
${table([
  '-gpu: String',
  '+GamingLaptop()<br/>+GamingLaptop(name: String, price: int, ram: int, gpu: String)<br/>+getGpu(): String<br/>+setGpu(gpu: String): void<br/>+getWarrantyMonths(): int<br/>+toString(): String<br/>+equals(o: Object): boolean<br/>+hashCode(): int',
])}
<p>Trong đó:</p>
<ul>
  <li><code>GamingLaptop()</code> — constructor mặc định: gọi constructor mặc định lớp cha và gán gpu = <code>"None"</code>.</li>
  <li><code>GamingLaptop(name, price, ram, gpu)</code> — constructor có tham số, chuyển name/price/ram lên bằng <code>super(name, price, ram)</code>.</li>
  <li><code>getGpu()</code> / <code>setGpu()</code> — lấy/cập nhật gpu.</li>
  <li><code>getWarrantyMonths(): int</code> — <strong>ghi đè</strong>: trả về <strong><code>super.getWarrantyMonths()</code> + 6</strong> (máy chơi game được cộng thêm 6 tháng trên bất kỳ giá trị nào mà quy tắc của Laptop cho ra). Phải gọi super, KHÔNG viết cứng 30 hay 24.</li>
  <li><code>toString(): String</code> — <strong>ghi đè</strong>: <code>super.toString()</code> nối thêm field mới, cho <strong>code, name, price, ram, gpu</strong>.</li>
  <li><code>equals(Object o): boolean</code> — <strong>hai đối tượng GamingLaptop bằng nhau khi chúng là cùng một mẫu sản phẩm</strong>, tức là khi có cùng <strong>name</strong>, cùng <strong>ram</strong> và cùng <strong>gpu</strong>. Mã <code>code</code> tự sinh chỉ là nhãn kho, KHÔNG thuộc về danh tính, nên BẮT BUỘC loại khỏi phép so sánh — <code>price</code> cũng vậy (cùng một mẫu có thể đang bán ở giá khác). Hai đối tượng ra đời từ hai lệnh <code>new</code> riêng biệt, khác code và khác giá, vẫn phải bằng nhau nếu name+ram+gpu trùng. Dùng so khớp lớp chính xác (<code>getClass()</code>), để một Laptop không bao giờ bằng một GamingLaptop theo cả hai chiều.</li>
  <li><code>hashCode(): int</code> — phải nhất quán với equals(): các đối tượng bằng nhau phải trả về cùng mã băm. Dựng nó từ đúng ba field đó (name, ram, gpu) — ví dụ bằng <code>java.util.Objects.hash(...)</code>.</li>
</ul>
<p><em>Cảnh báo: ĐỪNG để IDE tự sinh equals()/hashCode() trên MỌI field. Vì <code>code</code> tự sinh và duy nhất, đưa nó vào sẽ khiến mọi đối tượng khác nhau hết, và câu này mất sạch ý nghĩa.</em></p>`;

const q3ExplainEn = `<p><strong>The contract.</strong> Java's rule is one sentence: <em>if <code>a.equals(b)</code> is true then <code>a.hashCode() == b.hashCode()</code> must be true.</em> (The reverse is not required — unequal objects may collide.) Nothing in the compiler enforces this. Break it and your code still compiles, still runs, and quietly gives wrong answers the moment a <code>HashSet</code>, <code>HashMap</code> or <code>List.contains()</code> on a hashed collection is involved.</p>
<p><strong>Proof, not assertion.</strong> We compiled a deliberately broken variant with a correct <code>equals()</code> and NO <code>hashCode()</code> and ran the same TC 3: <code>HashSet.size()</code> came back <strong>2</strong> instead of 1, and the hash-code comparison printed <code>false</code>. The reason is mechanical: <code>HashSet</code> first picks a bucket from the hash code; with two different (identity) hash codes the two objects land in different buckets and <code>equals()</code> is never even called. That is why TC 3 in this question prints the set size — it is the single check that catches the most common mistake in the whole paper.</p>
<p><strong>Why exclude the auto ID.</strong> Every object gets a unique <code>code</code> at construction. If <code>code</code> were part of equals(), then <code>a.equals(b)</code> would be false for any two distinct objects, always — equals() would degrade back into <code>==</code> and Q4's deduplication would remove nothing. IDE-generated "equals over all fields" produces exactly this failure. Identity has to be defined by what the object <em>is</em> (name+ram+gpu = the model), not by the tag we stapled on it.</p>
<p><strong>getClass() vs instanceof — a deliberate choice.</strong> We require <code>getClass() != o.getClass() -&gt; false</code>. We tested the alternative: a variant using <code>o instanceof Laptop</code> and comparing only name+ram gave <code>gamingLaptop.equals(laptop) == true</code> while <code>laptop.equals(gamingLaptop) == false</code> — asymmetric, and asymmetry is itself a contract violation that makes collection behaviour depend on argument order. <code>getClass()</code> keeps the relation symmetric, which is exactly what TC 4 verifies (both directions print false).</p>
<p><strong>The auto-boxing trap.</strong> Our test data uses <code>ram = 256</code> on purpose. <code>ram</code> is a primitive <code>int</code>, so <code>==</code> is a real value comparison and is correct. But if you ever store such a field as <code>Integer</code> and compare with <code>==</code>, you compare references: we ran that broken variant too — with <code>ram = 16</code> it printed <code>true</code> (inside the <code>-128..127</code> Integer cache, the same object is reused, so the bug hides), and with <code>ram = 256</code> the identical code printed <code>false</code>. A bug that only appears above 127 is exactly the kind that survives your own testing and dies in the grader. Compare boxed numbers with <code>.equals()</code> (or <code>Objects.equals</code>), primitives with <code>==</code>.</p>
<p>Verified by compiling <code>GamingLaptop.java</code> against the given compiled <code>Device.class</code>/<code>Laptop.class</code> and <code>Main.class</code>, capturing real stdout:</p>
<pre>TC 1 -> D001, ROG Strix, 2500, 32, RTX4090   and   30   (Laptop rule 24, +6)
TC 2 -> "D001 D002" / true / true   (two separate objects, different codes AND
                                     different prices 2500 vs 2600, ram=256,
                                     same name+ram+gpu -> equal, symmetric)
TC 3 -> true / 1                    (equal hash codes, HashSet collapses to ONE)
TC 4 -> false / false               (Laptop vs GamingLaptop, same name+ram,
                                     never equal in either direction)</pre>`;

const q3ExplainVi = `<p><strong>Hợp đồng.</strong> Quy tắc của Java gói gọn một câu: <em>nếu <code>a.equals(b)</code> đúng thì <code>a.hashCode() == b.hashCode()</code> bắt buộc phải đúng.</em> (Chiều ngược lại không bắt buộc — hai đối tượng khác nhau có thể trùng mã băm.) Không có gì trong trình biên dịch ép bạn tuân thủ. Phá vỡ nó thì code vẫn biên dịch, vẫn chạy, và lặng lẽ cho kết quả sai ngay khi có <code>HashSet</code>, <code>HashMap</code> hay <code>contains()</code> trên tập băm tham gia.</p>
<p><strong>Chứng minh chứ không phát biểu suông.</strong> Chúng tôi đã biên dịch một biến thể cố tình hỏng: <code>equals()</code> đúng nhưng KHÔNG có <code>hashCode()</code>, rồi chạy đúng TC 3: <code>HashSet.size()</code> trả về <strong>2</strong> thay vì 1, và phép so mã băm in ra <code>false</code>. Lý do rất cơ học: <code>HashSet</code> chọn "ngăn" (bucket) từ mã băm trước; hai mã băm khác nhau khiến hai đối tượng rơi vào hai ngăn khác nhau và <code>equals()</code> thậm chí không bao giờ được gọi. Đó là vì sao TC 3 in kích thước tập hợp — đây là phép kiểm bắt được lỗi phổ biến nhất của cả đề.</p>
<p><strong>Vì sao phải loại mã ID tự sinh.</strong> Mỗi đối tượng nhận một <code>code</code> duy nhất lúc khởi tạo. Nếu <code>code</code> nằm trong equals() thì <code>a.equals(b)</code> luôn sai với mọi cặp đối tượng khác nhau — equals() thoái hoá về đúng bằng <code>==</code>, và phần khử trùng ở câu 4 sẽ không xoá được gì. Kiểu "equals trên mọi field" do IDE sinh ra chính là lỗi này. Danh tính phải được định nghĩa bằng đối tượng <em>là gì</em> (name+ram+gpu = mẫu máy), không phải bằng cái nhãn ta dán lên nó.</p>
<p><strong>getClass() hay instanceof — một lựa chọn có chủ đích.</strong> Ở đây bắt buộc <code>getClass() != o.getClass() -&gt; false</code>. Chúng tôi đã thử phương án kia: biến thể dùng <code>o instanceof Laptop</code> và chỉ so name+ram cho ra <code>gamingLaptop.equals(laptop) == true</code> trong khi <code>laptop.equals(gamingLaptop) == false</code> — bất đối xứng, mà bất đối xứng tự nó đã vi phạm hợp đồng và làm hành vi của tập hợp phụ thuộc thứ tự tham số. <code>getClass()</code> giữ quan hệ đối xứng, đúng như TC 4 kiểm chứng (cả hai chiều đều in false).</p>
<p><strong>Bẫy tự động đóng hộp (auto-boxing).</strong> Dữ liệu kiểm của chúng tôi dùng <code>ram = 256</code> có chủ đích. <code>ram</code> là <code>int</code> nguyên thuỷ nên <code>==</code> là so sánh giá trị thật, hoàn toàn đúng. Nhưng nếu bạn lưu field kiểu đó bằng <code>Integer</code> rồi so bằng <code>==</code>, bạn đang so tham chiếu: chúng tôi cũng đã chạy biến thể hỏng đó — với <code>ram = 16</code> nó in <code>true</code> (nằm trong vùng cache <code>-128..127</code> của Integer nên cùng một đối tượng được tái dùng, lỗi ẩn mình), còn với <code>ram = 256</code> vẫn code đó in <code>false</code>. Một lỗi chỉ lộ khi vượt quá 127 chính là loại sống sót qua bài tự test của bạn rồi chết ở máy chấm. So số đã đóng hộp bằng <code>.equals()</code> (hoặc <code>Objects.equals</code>), so nguyên thuỷ bằng <code>==</code>.</p>
<p>Đã kiểm bằng cách biên dịch <code>GamingLaptop.java</code> cùng <code>Device.class</code>/<code>Laptop.class</code> đã biên dịch trong given và <code>Main.class</code>, bắt lại stdout thật:</p>
<pre>TC 1 -> D001, ROG Strix, 2500, 32, RTX4090   và   30   (quy tắc Laptop 24, +6)
TC 2 -> "D001 D002" / true / true   (hai đối tượng riêng biệt, KHÁC code VÀ
                                     khác giá 2500 vs 2600, ram=256,
                                     trùng name+ram+gpu -> bằng nhau, đối xứng)
TC 3 -> true / 1                    (mã băm bằng nhau, HashSet gộp còn MỘT)
TC 4 -> false / false               (Laptop vs GamingLaptop, cùng name+ram,
                                     không bao giờ bằng nhau ở cả hai chiều)</pre>`;

const q3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `// ─── ALREADY DEFINED FROM Q1 + Q2 — reference only, supplied compiled ───
// The given Q3 project ships Device.class and Laptop.class. Do NOT rewrite them.
//
// public class Device {
//     private static int nextId = 1;                 // shared auto-ID counter
//     public String getCode();  public String getName();
//     public int    getPrice(); public void setPrice(int price);
//     public int    getWarrantyMonths()  { return 12; }
//     public String toString()           { return code + ", " + name + ", " + price; }
// }
//
// public class Laptop extends Device {
//     private int ram;
//     public int    getRam();   public void setRam(int ram);
//     public int    getWarrantyMonths()  { return ram >= 16 ? 24 : 18; }
//     public String toString()           { return super.toString() + ", " + ram; }
// }
// ───────────────────────────────────────────────────────────────────────
// NOTE: name and ram are PRIVATE in the classes above — reach them from
// GamingLaptop through getName() / getRam(), not directly.

import java.util.Objects;

public class GamingLaptop extends Laptop {

    private String gpu;

    public GamingLaptop() {
        // TODO: super() + gpu = "None"
    }

    public GamingLaptop(String name, int price, int ram, String gpu) {
        // TODO: super(name, price, ram) + gpu
    }

    public String getGpu() {
        // TODO
        return null;
    }

    public void setGpu(String gpu) {
        // TODO
    }

    @Override
    public int getWarrantyMonths() {
        // TODO: super.getWarrantyMonths() + 6   (do not hard-code the number)
        return 0;
    }

    @Override
    public String toString() {
        // TODO: super.toString() + ", " + gpu
        return null;
    }

    @Override
    public boolean equals(Object o) {
        // TODO: equal when same EXACT class and same name + ram + gpu.
        //       code and price are NOT part of the identity.
        return false;
    }

    @Override
    public int hashCode() {
        // TODO: must be built from the same 3 fields used by equals()
        return 0;
    }
}`,
  sampleSolution: SOL_GAMING,
  expectedOutput:
`Sample run 1 (TC 1 - toString()/getWarrantyMonths(), GamingLaptop("ROG Strix",2500,32,"RTX4090")):
OUTPUT:
D001, ROG Strix, 2500, 32, RTX4090
30

Sample run 2 (TC 2 - equals() symmetry; g1=("ROG Strix",2500,256,"RTX4090"), g2=("ROG Strix",2600,256,"RTX4090")
               -- different code, different price, same name+ram+gpu):
OUTPUT:
D001 D002
true
true

Sample run 3 (TC 3 - hashCode() + HashSet, same two objects as sample run 2):
OUTPUT:
true
1

Sample run 4 (TC 4 - equals() across levels; Laptop("ROG Strix",2500,256) vs GamingLaptop("ROG Strix",2500,256,"RTX4090")):
OUTPUT:
false
false

Sample run 5 (TC 2 with a different gpu; g1 gpu="RTX4090", g2 gpu="RTX4080", everything else identical):
OUTPUT:
D001 D002
false
false

Sample run 6 (TC 3 with a different ram; g1 ram=256, g2 ram=128, everything else identical):
OUTPUT:
false
2`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'chain_override', criterion: B('GamingLaptop extends Laptop, delegates via super(...), toString() = super.toString() + ", " + gpu, and getWarrantyMonths() returns super.getWarrantyMonths() + 6 (calls super rather than hard-coding 30).', 'GamingLaptop kế thừa Laptop, uỷ quyền qua super(...), toString() = super.toString() + ", " + gpu, và getWarrantyMonths() trả super.getWarrantyMonths() + 6 (gọi super chứ không viết cứng 30).'), weight: 2, maxScore: 1 },
    { id: 'equals_fields', criterion: B('equals() compares exactly name + ram + gpu and EXCLUDES the auto-generated code and the price; it handles null and uses an exact class match (getClass()) so it stays symmetric with a Laptop argument.', 'equals() so sánh đúng name + ram + gpu và LOẠI mã code tự sinh cùng price; xử lý null và so khớp lớp chính xác (getClass()) để giữ tính đối xứng khi tham số là Laptop.'), weight: 3, maxScore: 1.2 },
    { id: 'hashcode_contract', criterion: B('hashCode() is overridden from the SAME three fields, so two equal objects give the same hash and a HashSet containing both reports size 1 (this is the decisive check — equals() without hashCode() scores 0 here).', 'hashCode() được ghi đè từ ĐÚNG ba field đó, nên hai đối tượng bằng nhau cho cùng mã băm và HashSet chứa cả hai báo size = 1 (đây là phép kiểm quyết định — equals() mà thiếu hashCode() thì tiêu chí này 0 điểm).'), weight: 3, maxScore: 0.8 },
  ],
};

// ══════════════════════════════════════════════════════════════════════ Q4 ══
const q4PromptEn = `<p><strong>(2 marks)</strong> Write a class <strong>DeviceManager</strong> (the given Q4 project already supplies <code>Device.class</code>, <code>Laptop.class</code> and <code>GamingLaptop.class</code> compiled — do NOT create them again) with the following information:</p>
${table([
  '+countDistinct(list: List&lt;Device&gt;): int  <em>(static)</em><br/>+removeDuplicates(list: List&lt;Device&gt;): List&lt;Device&gt;  <em>(static)</em>',
])}
<p>Where:</p>
<ul>
  <li>Both methods are <strong>static</strong> and take a <code>List&lt;Device&gt;</code> — the top of the hierarchy — so the same list may hold Device, Laptop and GamingLaptop objects mixed together (polymorphism).</li>
  <li><code>countDistinct(list): int</code> — return how many <strong>distinct</strong> elements the list contains, according to each element's own <code>equals()</code>. Return 0 for a null list.</li>
  <li><code>removeDuplicates(list): List&lt;Device&gt;</code> — return a new list containing each distinct element exactly once, <strong>keeping the first occurrence and preserving the original order</strong>. Return an empty list for a null list. Do not modify the list passed in.</li>
</ul>
<p><em>Hint: a hash-based set does the whole job — but only because Q3 implemented equals() and hashCode() correctly. Note carefully that Device and Laptop do NOT override equals(), so two separately created Laptop objects holding identical data are still two distinct elements; only GamingLaptop objects collapse. Your output must reflect that.</em></p>`;

const q4PromptVi = `<p><strong>(2 điểm)</strong> Viết lớp <strong>DeviceManager</strong> (project Q4 given đã cấp sẵn <code>Device.class</code>, <code>Laptop.class</code> và <code>GamingLaptop.class</code> đã biên dịch — KHÔNG tạo lại) với thông tin sau:</p>
${table([
  '+countDistinct(list: List&lt;Device&gt;): int  <em>(static)</em><br/>+removeDuplicates(list: List&lt;Device&gt;): List&lt;Device&gt;  <em>(static)</em>',
])}
<p>Trong đó:</p>
<ul>
  <li>Cả hai hàm đều <strong>static</strong> và nhận <code>List&lt;Device&gt;</code> — kiểu ở đỉnh cây kế thừa — nên cùng một danh sách có thể chứa lẫn lộn Device, Laptop và GamingLaptop (tính đa hình).</li>
  <li><code>countDistinct(list): int</code> — trả về số phần tử <strong>khác nhau</strong> trong danh sách, theo đúng <code>equals()</code> của từng phần tử. Trả 0 nếu danh sách null.</li>
  <li><code>removeDuplicates(list): List&lt;Device&gt;</code> — trả về danh sách MỚI chứa mỗi phần tử khác nhau đúng một lần, <strong>giữ lần xuất hiện đầu tiên và giữ nguyên thứ tự ban đầu</strong>. Trả danh sách rỗng nếu tham số null. Không được sửa danh sách truyền vào.</li>
</ul>
<p><em>Gợi ý: một tập hợp dựa trên băm làm trọn việc này — nhưng CHỈ vì câu 3 đã cài đặt equals() và hashCode() đúng. Chú ý kỹ: Device và Laptop KHÔNG ghi đè equals(), nên hai đối tượng Laptop tạo riêng với dữ liệu y hệt vẫn là hai phần tử khác nhau; chỉ GamingLaptop mới gộp lại. Kết quả in ra phải phản ánh đúng điều đó.</em></p>`;

const q4ExplainEn = `<p><strong>This question is the payoff for Q3.</strong> <code>new HashSet&lt;&gt;(list).size()</code> and <code>new LinkedHashSet&lt;&gt;(list)</code> contain no deduplication logic of their own — they simply ask each element for its <code>hashCode()</code> and then its <code>equals()</code>. All of the intelligence lives in the class, not in the collection. Break the contract in Q3 and this exact code silently returns the original list untouched; get it right and two lines of code do the whole job.</p>
<p><strong>Why LinkedHashSet and not HashSet for removeDuplicates.</strong> The spec asks for the original order preserved. <code>HashSet</code> iterates in bucket order (which looks arbitrary); <code>LinkedHashSet</code> keeps insertion order and, crucially, <code>add()</code> on an element that is already present is a no-op — so the FIRST occurrence is the one that stays. That is exactly the required behaviour, for free.</p>
<p><strong>Read sample run 2 carefully — it is the most instructive output in the whole paper.</strong> The list holds 5 objects: one Device, two Laptops built from identical data, and two GamingLaptops that are equal by our definition. The result is <code>countDistinct == 4</code>: the two GamingLaptops collapsed into one, but the two identical Laptops did NOT. Nothing is wrong — <code>Laptop</code> never overrides <code>equals()</code>, so it inherits <code>Object.equals()</code>, which is reference identity, and two separate <code>new</code> calls are never the same reference. Duplicate detection is not a property of a list; it is a property of the class you put in the list. In LAB211, that is why the very first thing you do in a management program is decide what "the same record" means and implement equals()/hashCode() to say so.</p>
<p><strong>Polymorphism in the signature.</strong> Declaring the parameter as <code>List&lt;Device&gt;</code> (the grandparent type) is what lets one utility serve all three levels. <code>list.get(i).toString()</code> dispatches at run time to Device's, Laptop's or GamingLaptop's version — see how sample run 2 prints three different line shapes from one loop.</p>
<p>Verified by compiling <code>DeviceManager.java</code> against the given compiled hierarchy and <code>Main.class</code>, capturing real stdout:</p>
<pre>TC 1 (4 gaming laptops, #2 duplicates #1 by name+ram+gpu, #4 differs only by gpu)
  -> 3 distinct; kept D001, D003, D004 (D002 dropped, first occurrence retained)
TC 2 (Device + 2 identical Laptops + 2 equal GamingLaptops = 5 elements)
  -> 5 in, 4 distinct: both Laptops survive (no equals() override), the 2
     GamingLaptops collapse to one
TC 3 (3 genuinely different gaming laptops) -> 3 distinct, nothing removed</pre>`;

const q4ExplainVi = `<p><strong>Câu này là phần "thu hoạch" của câu 3.</strong> <code>new HashSet&lt;&gt;(list).size()</code> và <code>new LinkedHashSet&lt;&gt;(list)</code> bản thân chúng KHÔNG chứa logic khử trùng nào — chúng chỉ hỏi từng phần tử <code>hashCode()</code> rồi <code>equals()</code>. Toàn bộ trí tuệ nằm ở lớp, không nằm ở tập hợp. Phá hợp đồng ở câu 3 thì đúng đoạn code này lặng lẽ trả về danh sách y nguyên; làm đúng thì hai dòng code làm trọn việc.</p>
<p><strong>Vì sao dùng LinkedHashSet chứ không phải HashSet cho removeDuplicates.</strong> Đề yêu cầu giữ nguyên thứ tự ban đầu. <code>HashSet</code> duyệt theo thứ tự ngăn băm (trông như ngẫu nhiên); <code>LinkedHashSet</code> giữ thứ tự chèn và — điểm mấu chốt — <code>add()</code> một phần tử đã có sẵn thì không làm gì cả, nên phần tử ĐẦU TIÊN là phần tử được giữ lại. Đúng y hành vi đề yêu cầu, miễn phí.</p>
<p><strong>Hãy đọc kỹ mẫu chạy 2 — đây là output dạy được nhiều nhất trong cả đề.</strong> Danh sách có 5 đối tượng: một Device, hai Laptop dựng từ dữ liệu y hệt nhau, và hai GamingLaptop bằng nhau theo định nghĩa của ta. Kết quả là <code>countDistinct == 4</code>: hai GamingLaptop gộp làm một, còn hai Laptop y hệt thì KHÔNG. Không có gì sai cả — <code>Laptop</code> chưa bao giờ ghi đè <code>equals()</code>, nên nó thừa hưởng <code>Object.equals()</code> vốn là so sánh tham chiếu, mà hai lệnh <code>new</code> riêng thì không bao giờ cùng tham chiếu. Phát hiện trùng lặp KHÔNG phải thuộc tính của danh sách; nó là thuộc tính của lớp bạn bỏ vào danh sách. Trong LAB211, đó chính là lý do việc đầu tiên phải làm trong một chương trình quản lý là quyết định "thế nào là cùng một bản ghi" rồi cài equals()/hashCode() để nói ra điều đó.</p>
<p><strong>Tính đa hình nằm ngay ở chữ ký hàm.</strong> Khai báo tham số là <code>List&lt;Device&gt;</code> (kiểu ông) mới cho phép một hàm tiện ích phục vụ cả ba tầng. <code>list.get(i).toString()</code> điều phối lúc chạy tới bản của Device, của Laptop hay của GamingLaptop — hãy xem mẫu chạy 2 in ra ba dạng dòng khác nhau từ cùng một vòng lặp.</p>
<p>Đã kiểm bằng cách biên dịch <code>DeviceManager.java</code> cùng cây lớp đã biên dịch trong given và <code>Main.class</code>, bắt lại stdout thật:</p>
<pre>TC 1 (4 gaming laptop, cái #2 trùng #1 theo name+ram+gpu, cái #4 chỉ khác gpu)
  -> 3 phần tử khác nhau; giữ D001, D003, D004 (bỏ D002, giữ lần đầu xuất hiện)
TC 2 (Device + 2 Laptop y hệt + 2 GamingLaptop bằng nhau = 5 phần tử)
  -> vào 5, khác nhau 4: cả 2 Laptop đều sống (không ghi đè equals()), 2
     GamingLaptop gộp còn một
TC 3 (3 gaming laptop thật sự khác nhau) -> 3 khác nhau, không xoá gì</pre>`;

const q4 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `// ─── ALREADY DEFINED FROM Q1 + Q2 + Q3 — reference only, supplied compiled ───
// The given Q4 project ships Device.class, Laptop.class and GamingLaptop.class.
//
// public class Device                       { /* static auto-ID "D001"...; toString "code, name, price" */ }
// public class Laptop       extends Device  { /* + ram;  toString "..., ram"  */ }
// public class GamingLaptop extends Laptop  { /* + gpu;  toString "..., gpu";
//                                                equals()/hashCode() over name + ram + gpu */ }
//
// IMPORTANT: only GamingLaptop overrides equals()/hashCode(). Device and Laptop
// still use Object's reference identity — two identical Laptops are NOT equal.
// ────────────────────────────────────────────────────────────────────────────

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;

public class DeviceManager {

    public static int countDistinct(List<Device> list) {
        // TODO: how many distinct elements (by each element's own equals())?
        //       null list -> 0
        return 0;
    }

    public static List<Device> removeDuplicates(List<Device> list) {
        // TODO: new list, each distinct element once, FIRST occurrence kept,
        //       original order preserved; null list -> empty list
        return null;
    }
}`,
  sampleSolution: SOL_MANAGER,
  expectedOutput:
`Sample run 1 (TC 1 - 4 GamingLaptops:
   ("ROG Strix",2500,256,"RTX4090"), ("ROG Strix",2600,256,"RTX4090"),
   ("Legion 5",2000,16,"RTX4070"),   ("ROG Strix",2500,256,"RTX4080")):
OUTPUT:
3
D001, ROG Strix, 2500, 256, RTX4090
D003, Legion 5, 2000, 16, RTX4070
D004, ROG Strix, 2500, 256, RTX4080

Sample run 2 (TC 2 - mixed polymorphic list: Device("Router X",90),
   Laptop("Acer Swift",700,8) built TWICE from identical data, then
   GamingLaptop("ROG Strix",2500,256,"RTX4090") and ("ROG Strix",2600,256,"RTX4090")):
OUTPUT:
5
4
D001, Router X, 90
D002, Acer Swift, 700, 8
D003, Acer Swift, 700, 8
D004, ROG Strix, 2500, 256, RTX4090

Sample run 3 (TC 3 - 3 genuinely different GamingLaptops):
OUTPUT:
3
D001, ROG Strix, 2500, 256, RTX4090
D002, Legion 5, 2000, 16, RTX4070
D003, Blade 15, 3000, 32, RTX4080`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'static_polymorphic', criterion: B('Both methods are static and declared over List&lt;Device&gt; so a mixed Device/Laptop/GamingLaptop list is accepted; null input is handled (0 / empty list).', 'Cả 2 hàm đều static và khai báo trên List&lt;Device&gt; để nhận danh sách trộn Device/Laptop/GamingLaptop; xử lý tham số null (0 / danh sách rỗng).'), weight: 2, maxScore: 0.6 },
    { id: 'countDistinct', criterion: B('countDistinct() returns the number of distinct elements using the elements own equals()/hashCode() (e.g. via a HashSet), giving 4 for the mixed 5-element list.', 'countDistinct() trả về số phần tử khác nhau dựa trên equals()/hashCode() của chính phần tử (vd qua HashSet), cho 4 với danh sách trộn 5 phần tử.'), weight: 2, maxScore: 0.7 },
    { id: 'removeDuplicates', criterion: B('removeDuplicates() returns a NEW list keeping the FIRST occurrence of each distinct element in the original order (LinkedHashSet or an equivalent contains() scan), leaving the input list unmodified.', 'removeDuplicates() trả về danh sách MỚI giữ lần xuất hiện ĐẦU TIÊN của mỗi phần tử khác nhau theo đúng thứ tự gốc (LinkedHashSet hoặc quét contains() tương đương), không sửa danh sách đầu vào.'), weight: 3, maxScore: 0.7 },
  ],
};

// ═══════════════════════════════════════════════════════════════════ spec ══
const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-ADV4',
      title: B(
        'PRO192 — Advanced Practice 4: Inheritance Chains, Static Fields & equals()/hashCode() (Nâng cao)',
        'PRO192 — Luyện tập Nâng cao 4: Chuỗi Kế Thừa, Field Static & equals()/hashCode()',
      ),
      description: B(
        'Self-authored supplementary practice paper (4 questions, 10 marks) — NOT a real school exam. It goes deeper into OOP than the standard PRO192 PE papers, which rarely pass a single level of inheritance and almost never test equals()/hashCode(). One theme runs through all four questions: a 3-level chain Device -> Laptop -> GamingLaptop, a static auto-incrementing ID counter that generates codes like "D001", and an equals()/hashCode() pair that deliberately EXCLUDES that auto-assigned code from object identity — then a utility that deduplicates a polymorphic list and only works because of it. Aimed at bridging into LAB211 (semester 3), whose management programs lean on auto-ID counters and duplicate detection constantly. Every class, harness and sample output was verified by really compiling and running the code, and the three classic traps (equals without hashCode, Integer == outside the -128..127 cache, instanceof breaking symmetry) were reproduced on purpose to check the reference solution avoids them.',
        'Đề luyện tập bổ sung do chúng tôi tự soạn (4 câu, 10 điểm) — KHÔNG phải đề thi thật của trường. Đề đi sâu vào OOP hơn các đề PE PRO192 chuẩn, vốn hiếm khi vượt quá một tầng kế thừa và gần như không kiểm tra equals()/hashCode(). Một chủ đề xuyên suốt cả bốn câu: chuỗi kế thừa 3 tầng Device -> Laptop -> GamingLaptop, bộ đếm ID static tự tăng sinh mã kiểu "D001", và cặp equals()/hashCode() cố ý LOẠI mã tự sinh đó khỏi danh tính đối tượng — rồi một hàm tiện ích khử trùng danh sách đa hình chỉ chạy đúng được nhờ nó. Mục tiêu là bắc cầu sang LAB211 (kỳ 3), nơi các chương trình quản lý dùng bộ đếm ID tự động và logic phát hiện trùng lặp liên tục. Mọi lớp, harness và output mẫu đều đã được kiểm bằng cách biên dịch và chạy thật, và ba cái bẫy kinh điển (equals mà thiếu hashCode, so Integer bằng == ngoài vùng cache -128..127, instanceof phá tính đối xứng) đã được tái hiện có chủ đích để chắc chắn lời giải tham chiếu tránh được cả ba.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 5,
      source: 'SAMPLE',
      isPublished: true,
      instructions,
      attachmentUrl: ATTACHMENT_URL,
      attachmentName: B(
        'Download given materials (Q1-Q4 NetBeans projects, compiled Main.class + earlier hierarchy levels)',
        'Tải given materials (project NetBeans Q1-Q4, kèm Main.class và các tầng kế thừa trước đã biên dịch)',
      ),
      questions: [q1, q2, q3, q4],
    },
  ],
};

fs.writeFileSync(
  OUT,
  `// AUTO-GENERATED by scripts/build-pro192-pe-adv4.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
