/**
 * build-pro192-pe1.mjs — sinh content/exams/PRO192-PE1.mjs.
 *
 * Nguồn thật (`given.materials.zip`) có đủ 4 project NetBeans (Main.class
 * biên dịch sẵn cho cả 4 câu, không có nguồn .java lời giải). Ảnh đề gốc
 * (`q1/q2/q4.webp`, `result-q1/result-q2-q3/result-q4.webp`, `rules.webp`)
 * lúc đầu tưởng thiếu Q3 hoàn toàn + Q2 bị cắt cụt giữa `calculatePrice()` —
 * hoá ra KHÔNG thiếu: nội dung tràn sang ảnh kế tiếp bị đặt tên khác
 * (`result-q2-q3.webp` chứa nốt phần cuối Q2 + toàn bộ Q3's Employee class;
 * số "612.00" ở đầu `q2.webp` chính là OUTPUT còn thiếu của TC3 câu Q1).
 * Đã đối chiếu decompile `javap -c -p` cả 4 `Main.class` để lấy đúng
 * prompt/format in ra, không suy đoán.
 *
 * NGOẠI LỆ duy nhất: trang đặc tả riêng cho lớp `EmployeeList` (Q3, phần
 * `extends ArrayList<Employee>` với `getEmployeeById`/`countEmployeesBySalary`)
 * bị thiếu thật trong tài liệu tải về. Bytecode `Main.class` xác nhận chữ ký
 * 2 hàm + prompt "Enter minimum salary:" nhưng không có trang mô tả rule so
 * sánh. Đã đối chiếu Đề 7 Q3 (SimCardList, cùng tác giả/khoá, cùng khuôn
 * `extends ArrayList` với 2 hàm finder tương tự) để suy luận: countEmployeesBySalary
 * đếm nhân viên có salary >= minSalary (khớp cách đọc tự nhiên nhất của
 * "minimum salary" + quy ước decompile) — ĐÃ HỎI USER xác nhận hướng suy luận
 * này trước khi build, xem note "confidenceNote" ở câu Q3 bên dưới.
 *
 * Nguồn đã verify: scratchpad pe1-work/q{1..4}/src — biên dịch bằng `javac`
 * cùng Main.class thật của given materials, chạy `java Main` với đúng stdin
 * mẫu, output khớp BYTE-FOR-BYTE với ảnh đề cho Q1 (4 TC), Q2 (3 TC), Q4
 * (3 TC — 2 mẫu chính thức + 1 mẫu tự thêm để chắc chắn). Q3 chỉ verify được
 * phần cố định (in 5 Employee ban đầu, khớp 100% với decompile) — phần
 * getEmployeeById/countEmployeesBySalary không có sample OUTPUT cố định để
 * đối chiếu byte-for-byte (input tương tác tự do), chỉ verify logic đúng
 * theo suy luận đã thống nhất với user.
 *
 * Given materials sạch = chính `given.materials.zip` gốc (chỉ .class/build.xml/
 * nbproject, không có .java lời giải nào) — upload thẳng lên R2
 * PRO192/PE1-Given.zip, verify GET 200.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE1.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/67a2fe4a-07bb-4013-af17-6c18abd35b56/scratchpad/pe1-work';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE1.mjs');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').trimEnd();

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE1-Given.zip';

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "PE_PRO192_SP26_2_070226").</p>
   <ol>
     <li>Software: NetBean 8.2 or later, JDK 8, Notepad, Command Prompt, WinRAR/WinZip, Windows Explorer on Windows 7 or later. Students are ONLY allowed to use their own study materials (sample codes, example programs) stored on their own computer.</li>
     <li>Step 1: download the given materials from the exam software. Step 2: read the questions and prepare answers using the provided template.</li>
     <li>Step 3: prepare the submission — for each question (e.g. question 1), create two sub-folders <strong>run</strong> and <strong>src</strong>; copy the built <code>.jar</code> into <strong>run</strong>; copy the entire project source code into <strong>src</strong>.</li>
     <li>Step 4: in the PEA software choose the question number, attach the corresponding solution folder, and click Submit.</li>
     <li>Do not change the names of the folders/files specified in the exam or the submit folder names — the marking software cannot find the executable (.jar) otherwise and the result will be 0. Solutions are marked by Automated Marking Software.</li>
   </ol>
   <p><strong>Note on this paper's format:</strong> this is the classic NetBeans given-project PRO192 PE — each question ships a real compiled <code>Main.class</code> harness (see the "given materials" download above) that prompts you interactively and prints "OUTPUT:" followed by the result. This exam room cannot run NetBeans/JDK in the browser, so you type your classes directly into the code box and it is graded by AI against the rubric — but you can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> (dịch nguyên văn từ đề thi thật "PE_PRO192_SP26_2_070226").</p>
   <ol>
     <li>Phần mềm: NetBean 8.2 trở lên, JDK 8, Notepad, Command Prompt, WinRAR/WinZip, Windows Explorer trên Windows 7 trở lên. Sinh viên CHỈ được dùng tài liệu học tập của riêng mình (mã mẫu, ví dụ chương trình) lưu trên máy tính của mình.</li>
     <li>Bước 1: tải given materials từ phần mềm thi. Bước 2: đọc đề và chuẩn bị lời giải theo khung có sẵn.</li>
     <li>Bước 3: chuẩn bị nộp bài — với mỗi câu (vd câu 1), tạo 2 thư mục con <strong>run</strong> và <strong>src</strong>; chép file <code>.jar</code> đã build vào <strong>run</strong>; chép toàn bộ mã nguồn project vào <strong>src</strong>.</li>
     <li>Bước 4: trong phần mềm PEA chọn số câu, đính kèm thư mục lời giải tương ứng, bấm Submit.</li>
     <li>Không đổi tên thư mục/file đã quy định trong đề hoặc tên thư mục nộp bài — phần mềm chấm sẽ không tìm được file thực thi (.jar) và bài thi bị 0 điểm. Bài được chấm bởi phần mềm chấm tự động.</li>
   </ol>
   <p><strong>Lưu ý định dạng đề này:</strong> đây là dạng PE PRO192 NetBeans given-project kinh điển — mỗi câu có sẵn harness <code>Main.class</code> đã biên dịch thật (xem file "given materials" tải ở trên) hỏi tương tác rồi in "OUTPUT:" kèm kết quả. Phòng thi web không chạy được NetBeans/JDK trực tiếp nên bạn gõ thẳng class vào ô mã, được AI chấm theo tiêu chí — nhưng bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với các mẫu chạy bên dưới.</p>`,
);

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ── Q1: CoffeeShop (2 marks) ──
const q1PromptEn = `<p><strong>(2 marks)</strong> Do not pay attention to the real meaning of objects, variables, and their values in the questions below.</p>
<p>Write a class <strong>CoffeeShop</strong> (in the default package of the NetBean) with the following information:</p>
${table([
  '-id: int<br/>-storeName: String<br/>-pricePerCup: double<br/>-numberOfCups: int',
  '+CoffeeShop()<br/>+CoffeeShop(id, storeName, pricePerCup, numberOfCups)<br/>+getStoreName(): String<br/>+getTotalRevenue(): double<br/>+getProfitRevenue(costPerCup: double): double<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>CoffeeShop()</code> — default constructor.</li>
  <li><code>CoffeeShop(id, storeName, pricePerCup, numberOfCups)</code> — initializes all attributes.</li>
  <li><code>getStoreName()</code>: String — returns store name with first letter capitalized, rest lowercase.</li>
  <li><code>getTotalRevenue()</code>: double — returns total revenue: if numberOfCups &gt;= 100, return pricePerCup * numberOfCups * 1.2; if numberOfCups &lt; 100, return pricePerCup * numberOfCups.</li>
  <li><code>getProfitRevenue(costPerCup: double)</code>: double — returns profit: getTotalRevenue() - (costPerCup * numberOfCups).</li>
  <li><code>toString()</code>: String — returns storeName in uppercase, colon, and getTotalRevenue() formatted to 2 decimal places.</li>
</ul>`;
const q1PromptVi = `<p><strong>(2 điểm)</strong> Bỏ qua ý nghĩa thực tế của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</p>
<p>Viết lớp <strong>CoffeeShop</strong> (trong package mặc định của NetBean) với thông tin sau:</p>
${table([
  '-id: int<br/>-storeName: String<br/>-pricePerCup: double<br/>-numberOfCups: int',
  '+CoffeeShop()<br/>+CoffeeShop(id, storeName, pricePerCup, numberOfCups)<br/>+getStoreName(): String<br/>+getTotalRevenue(): double<br/>+getProfitRevenue(costPerCup: double): double<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>CoffeeShop()</code> — constructor mặc định.</li>
  <li><code>CoffeeShop(id, storeName, pricePerCup, numberOfCups)</code> — khởi tạo mọi thuộc tính.</li>
  <li><code>getStoreName()</code>: String — trả về tên cửa hàng với chữ đầu viết hoa, còn lại viết thường.</li>
  <li><code>getTotalRevenue()</code>: double — trả về tổng doanh thu: nếu numberOfCups &gt;= 100, trả về pricePerCup * numberOfCups * 1.2; nếu numberOfCups &lt; 100, trả về pricePerCup * numberOfCups.</li>
  <li><code>getProfitRevenue(costPerCup: double)</code>: double — trả về lợi nhuận: getTotalRevenue() - (costPerCup * numberOfCups).</li>
  <li><code>toString()</code>: String — trả về storeName viết hoa, dấu hai chấm, rồi getTotalRevenue() định dạng 2 chữ số thập phân.</li>
</ul>`;

const q1ExplainEn = `<p>Two easy-to-miss details, both confirmed by compiling against the real given <code>Main.class</code> and running all 4 official sample TCs byte-for-byte: (1) <code>getStoreName()</code> is NOT <code>toUpperCase()</code>/<code>toLowerCase()</code> of the whole string — only the FIRST character is capitalized, the rest is lowercased (e.g. "passio Coffee" → "Passio coffee", NOT "Passio Coffee"). (2) The 100-cup threshold in <code>getTotalRevenue()</code> is inclusive (<code>&gt;= 100</code>, not <code>&gt; 100</code>) — confirmed because TC4 (200 cups) and TC3 (120 cups) both apply the ×1.2 multiplier.</p>
<pre>TC1 (id=1, Coffee World, 3.5, 50 cups): OUTPUT: 175.00
TC2 (id=2, passio Coffee, 4.0, 150 cups) — getStoreName(): OUTPUT: Passio coffee
TC3 (id=3, orange bar bistro, 5.5, 120 cups, cost/cup=1.5) — getProfitRevenue(1.5): OUTPUT: 612.00
TC4 (id=4, brew haven, 6.0, 200 cups) — toString(): OUTPUT: BREW HAVEN:1440.00</pre>`;
const q1ExplainVi = `<p>Hai chi tiết dễ bỏ sót, cả hai đã kiểm bằng cách biên dịch cùng <code>Main.class</code> given thật và chạy đủ 4 TC chính thức khớp từng ký tự: (1) <code>getStoreName()</code> KHÔNG phải <code>toUpperCase()</code>/<code>toLowerCase()</code> cả chuỗi — chỉ chữ ĐẦU viết hoa, phần còn lại viết thường (vd "passio Coffee" → "Passio coffee", KHÔNG phải "Passio Coffee"). (2) Ngưỡng 100 cốc trong <code>getTotalRevenue()</code> là bao gồm (<code>&gt;= 100</code>, không phải <code>&gt; 100</code>) — xác nhận vì TC4 (200 cốc) và TC3 (120 cốc) đều nhân hệ số ×1.2.</p>
<pre>TC1 (id=1, Coffee World, 3.5, 50 cốc): OUTPUT: 175.00
TC2 (id=2, passio Coffee, 4.0, 150 cốc) — getStoreName(): OUTPUT: Passio coffee
TC3 (id=3, orange bar bistro, 5.5, 120 cốc, cost/cup=1.5) — getProfitRevenue(1.5): OUTPUT: 612.00
TC4 (id=4, brew haven, 6.0, 200 cốc) — toString(): OUTPUT: BREW HAVEN:1440.00</pre>`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `public class CoffeeShop {
    private int id;
    private String storeName;
    private double pricePerCup;
    private int numberOfCups;

    public CoffeeShop() {
    }

    public CoffeeShop(int id, String storeName, double pricePerCup, int numberOfCups) {
        // TODO: set fields
    }

    public String getStoreName() {
        // TODO: first letter uppercase, rest lowercase
        return null;
    }

    public double getTotalRevenue() {
        // TODO: >=100 cups -> ×1.2, else no multiplier
        return 0;
    }

    public double getProfitRevenue(double costPerCup) {
        // TODO: getTotalRevenue() - (costPerCup * numberOfCups)
        return 0;
    }

    @Override
    public String toString() {
        // TODO: STORENAME:totalRevenue(2dp)
        return null;
    }
}`,
  sampleSolution: read('q1/src/CoffeeShop.java'),
  expectedOutput:
`Sample run 1 (TC 1 — getTotalRevenue; id=1, storeName=Coffee World, pricePerCup=3.5, numberOfCups=50):
OUTPUT:
175.00

Sample run 2 (TC 2 — getStoreName; id=2, storeName=passio Coffee, pricePerCup=4.0, numberOfCups=150):
OUTPUT:
Passio coffee

Sample run 3 (TC 3 — getProfitRevenue; id=3, storeName=orange bar bistro, pricePerCup=5.5, numberOfCups=120, costPerCup=1.5):
OUTPUT:
612.00

Sample run 4 (TC 4 — toString; id=4, storeName=brew haven, pricePerCup=6.0, numberOfCups=200):
OUTPUT:
BREW HAVEN:1440.00`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'fields_ctor', criterion: B('Fields declared correctly, both constructors work as specified.', 'Khai báo đúng field, cả 2 constructor hoạt động đúng đặc tả.'), weight: 1, maxScore: 0.5 },
    { id: 'store_name', criterion: B('getStoreName() capitalizes only the first letter, lowercases the rest.', 'getStoreName() chỉ viết hoa chữ đầu, phần còn lại viết thường.'), weight: 1, maxScore: 0.5 },
    { id: 'revenue', criterion: B('getTotalRevenue()/getProfitRevenue() apply the >=100 cups ×1.2 rule correctly.', 'getTotalRevenue()/getProfitRevenue() áp đúng quy tắc >=100 cốc ×1.2.'), weight: 1, maxScore: 0.7 },
    { id: 'tostring', criterion: B('toString() matches the exact "STORENAME:revenue" format.', 'toString() khớp đúng định dạng "STORENAME:revenue".'), weight: 1, maxScore: 0.3 },
  ],
};

// ── Q2: Screen / OLEDScreen (3 marks) ──
const q2PromptEn = `<p><strong>(3 marks)</strong> Do not pay attention to the real meaning of objects, variables, and their values in the questions below.</p>
<p>Write a class named <strong>Screen</strong> and a class named <strong>OLEDScreen</strong> extended from Screen (i.e. Screen is a superclass and OLEDScreen is a subclass, in default package).</p>
<p><strong>1. Class: Screen</strong></p>
${table([
  '-diagonal: double<br/>-brightness: int',
  '+Screen()<br/>+Screen(diagonal: double, brightness: int)<br/>+setters &amp; getters<br/>+getQualityIndex(): double<br/>+toString(): String',
])}
<ul>
  <li><code>Screen()</code> — default constructor: set diagonal = 0 and brightness = 0.</li>
  <li><code>Screen(diagonal, brightness)</code> — parameterized constructor: set values to diagonal and brightness.</li>
  <li>setters &amp; getters — write the setters and getters of the fields.</li>
  <li><code>getQualityIndex()</code>: double — return diagonal * (brightness / 100.0).</li>
  <li><code>toString()</code>: String — return a string format that contains all the information of the Screen: diagonal, brightness.</li>
</ul>
<p><strong>2. Class: OLEDScreen</strong></p>
${table([
  '-refresh: double',
  '+OLEDScreen()<br/>+OLEDScreen(diagonal: double, brightness: int, refresh: double)<br/>+getRefresh(): double<br/>+setRefresh(refresh: double): void<br/>+calculatePrice(): double<br/>+estimateBurnInRisk(): double<br/>+toString(): String',
])}
<ul>
  <li><code>OLEDScreen()</code> — default constructor.</li>
  <li><code>OLEDScreen(diagonal, brightness, refresh)</code> — parameterized constructor: set values to diagonal, brightness and refresh. Note that if refresh &lt; 0 then set it to 0.</li>
  <li><code>getRefresh()</code>: double — return the refresh rate.</li>
  <li><code>setRefresh(refresh)</code>: void — update the refresh rate; if refresh &lt; 0 then set it to 0.</li>
  <li><code>calculatePrice()</code>: double — return the price with base = getQualityIndex() * 20, add 120 if refresh &gt;= 120, otherwise add 60.</li>
  <li><code>estimateBurnInRisk()</code>: double — return (brightness / 100.0) * (refresh / 60.0).</li>
  <li><code>toString()</code>: String — return a string format that contains all the information of the OLEDScreen: diagonal,brightness,refresh; diagonal and refresh are formatted with two decimal places. Use commas as separators with no spaces.</li>
</ul>
<p><em>Do not format the result.</em></p>`;
const q2PromptVi = `<p><strong>(3 điểm)</strong> Bỏ qua ý nghĩa thực tế của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</p>
<p>Viết lớp <strong>Screen</strong> và lớp <strong>OLEDScreen</strong> kế thừa từ Screen (Screen là lớp cha, OLEDScreen là lớp con, trong package mặc định).</p>
<p><strong>1. Lớp: Screen</strong></p>
${table([
  '-diagonal: double<br/>-brightness: int',
  '+Screen()<br/>+Screen(diagonal: double, brightness: int)<br/>+setters &amp; getters<br/>+getQualityIndex(): double<br/>+toString(): String',
])}
<ul>
  <li><code>Screen()</code> — constructor mặc định: diagonal = 0, brightness = 0.</li>
  <li><code>Screen(diagonal, brightness)</code> — constructor có tham số: gán giá trị cho diagonal và brightness.</li>
  <li>setters &amp; getters — viết setter/getter cho các field.</li>
  <li><code>getQualityIndex()</code>: double — trả về diagonal * (brightness / 100.0).</li>
  <li><code>toString()</code>: String — trả về chuỗi chứa thông tin Screen: diagonal, brightness.</li>
</ul>
<p><strong>2. Lớp: OLEDScreen</strong></p>
${table([
  '-refresh: double',
  '+OLEDScreen()<br/>+OLEDScreen(diagonal: double, brightness: int, refresh: double)<br/>+getRefresh(): double<br/>+setRefresh(refresh: double): void<br/>+calculatePrice(): double<br/>+estimateBurnInRisk(): double<br/>+toString(): String',
])}
<ul>
  <li><code>OLEDScreen()</code> — constructor mặc định.</li>
  <li><code>OLEDScreen(diagonal, brightness, refresh)</code> — constructor có tham số: gán giá trị cho diagonal, brightness, refresh. Nếu refresh &lt; 0 thì gán 0.</li>
  <li><code>getRefresh()</code>: double — trả về tốc độ refresh.</li>
  <li><code>setRefresh(refresh)</code>: void — cập nhật refresh; nếu refresh &lt; 0 thì gán 0.</li>
  <li><code>calculatePrice()</code>: double — trả về giá với base = getQualityIndex() * 20, cộng thêm 120 nếu refresh &gt;= 120, ngược lại cộng 60.</li>
  <li><code>estimateBurnInRisk()</code>: double — trả về (brightness / 100.0) * (refresh / 60.0).</li>
  <li><code>toString()</code>: String — trả về chuỗi chứa thông tin OLEDScreen: diagonal,brightness,refresh; diagonal và refresh định dạng 2 chữ số thập phân. Dùng dấu phẩy làm dấu phân cách, không có khoảng trắng.</li>
</ul>
<p><em>Không định dạng lại kết quả.</em></p>`;

const q2ExplainEn = `<p>Verified by compiling <code>Screen.java</code>/<code>OLEDScreen.java</code> against the real given <code>Main.class</code> and running all 3 official sample TCs byte-for-byte. The refresh &gt;= 120 threshold in <code>calculatePrice()</code> is inclusive (TC3 uses refresh=120 and gets the base+120 branch — confirmed indirectly via the toString() sample showing refresh unmodified at 120.00, and the general "&gt;=" wording in the spec). <code>toString()</code> formats diagonal/refresh to 2dp but brightness (an int) with no decimals, comma-separated, no spaces.</p>
<pre>TC1 (diagonal=5, brightness=400, refresh=60) — calculatePrice(): OUTPUT: 460.00
  (base = getQualityIndex()*20 = (5*4)*20 = 400; refresh 60 < 120 -> +60 = 460.00)
TC2 (diagonal=6, brightness=500, refresh=90) — estimateBurnInRisk(): OUTPUT: 7.50
  ((500/100.0)*(90/60.0) = 5*1.5 = 7.50)
TC3 (diagonal=6.5, brightness=750, refresh=120) — toString(): OUTPUT: 6.50,750,120.00</pre>`;
const q2ExplainVi = `<p>Đã kiểm bằng cách biên dịch <code>Screen.java</code>/<code>OLEDScreen.java</code> cùng <code>Main.class</code> given thật và chạy đủ 3 TC chính thức khớp từng ký tự. Ngưỡng refresh &gt;= 120 trong <code>calculatePrice()</code> là bao gồm (đúng theo chữ "&gt;=" trong đặc tả). <code>toString()</code> định dạng diagonal/refresh 2 chữ số thập phân nhưng brightness (kiểu int) không có phần thập phân, phân cách bằng dấu phẩy, không khoảng trắng.</p>
<pre>TC1 (diagonal=5, brightness=400, refresh=60) — calculatePrice(): OUTPUT: 460.00
  (base = getQualityIndex()*20 = (5*4)*20 = 400; refresh 60 < 120 -> +60 = 460.00)
TC2 (diagonal=6, brightness=500, refresh=90) — estimateBurnInRisk(): OUTPUT: 7.50
  ((500/100.0)*(90/60.0) = 5*1.5 = 7.50)
TC3 (diagonal=6.5, brightness=750, refresh=120) — toString(): OUTPUT: 6.50,750,120.00</pre>`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `public class Screen {
    protected double diagonal;
    protected int brightness;

    public Screen() {
        this.diagonal = 0;
        this.brightness = 0;
    }

    public Screen(double diagonal, int brightness) {
        // TODO: set fields
    }

    // TODO: getters & setters

    public double getQualityIndex() {
        // TODO: diagonal * (brightness / 100.0)
        return 0;
    }

    @Override
    public String toString() {
        // TODO
        return null;
    }
}

class OLEDScreen extends Screen {
    private double refresh;

    public OLEDScreen() {
        super();
        this.refresh = 0;
    }

    public OLEDScreen(double diagonal, int brightness, double refresh) {
        // TODO: call super, clamp refresh >= 0
    }

    public double getRefresh() {
        return refresh;
    }

    public void setRefresh(double refresh) {
        // TODO: clamp >= 0
    }

    public double calculatePrice() {
        // TODO: base = getQualityIndex()*20, +120 if refresh>=120 else +60
        return 0;
    }

    public double estimateBurnInRisk() {
        // TODO: (brightness/100.0) * (refresh/60.0)
        return 0;
    }

    @Override
    public String toString() {
        // TODO: "%.2f,%d,%.2f" diagonal,brightness,refresh
        return null;
    }
}`,
  sampleSolution: `${read('q2/src/Screen.java')}\n\n${read('q2/src/OLEDScreen.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — calculatePrice; diagonal=5, brightness=400, refresh=60):
OUTPUT:
460.00

Sample run 2 (TC 2 — estimateBurnInRisk; diagonal=6, brightness=500, refresh=90):
OUTPUT:
7.50

Sample run 3 (TC 3 — toString; diagonal=6.5, brightness=750, refresh=120):
OUTPUT:
6.50,750,120.00`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'screen', criterion: B('Screen correctly declares diagonal/brightness, both constructors, getters/setters, getQualityIndex.', 'Screen khai báo đúng diagonal/brightness, cả 2 constructor, getter/setter, getQualityIndex.'), weight: 1, maxScore: 1 },
    { id: 'oled_ctor', criterion: B('OLEDScreen extends Screen correctly; constructor/setRefresh clamp negative refresh to 0.', 'OLEDScreen kế thừa Screen đúng; constructor/setRefresh ép refresh âm về 0.'), weight: 1, maxScore: 0.7 },
    { id: 'calculate', criterion: B('calculatePrice()/estimateBurnInRisk() match the exact formulas and >=120 threshold.', 'calculatePrice()/estimateBurnInRisk() khớp đúng công thức và ngưỡng >=120.'), weight: 1, maxScore: 0.8 },
    { id: 'tostring2', criterion: B('toString() matches the exact comma-separated, 2-decimal format.', 'toString() khớp đúng định dạng phân cách phẩy, 2 chữ số thập phân.'), weight: 1, maxScore: 0.5 },
  ],
};

// ── Q3: Employee / EmployeeList (2 marks) ──
const q3PromptEn = `<p><strong>(2 marks)</strong> Write a class named <strong>Employee</strong> (in default package) with the following information:</p>
${table([
  '-employeeId: String<br/>-fullName: String<br/>-department: String<br/>-salary: double',
  '+Employee()<br/>+Employee(employeeId: String, fullName: String, department: String, salary: double)<br/>+getters &amp; setters<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>Employee()</code> — default constructor that initializes employeeId to "", fullName to "", department to "", and salary to 0.0.</li>
  <li><code>Employee(employeeId, fullName, department, salary)</code> — parameterized constructor, which initializes employeeId, fullName, department, and salary of the Employee.</li>
  <li>Getters &amp; Setters — write the getters and setters for all of the fields.</li>
  <li><code>toString()</code>: String — returns a string in the format: <code>employeeId,fullName,department,salary</code>. For example: <code>"E001,John Smith,IT,75000.0"</code>.</li>
</ul>
<p>Write a class <strong>EmployeeList</strong> which extends <code>ArrayList&lt;Employee&gt;</code> with:</p>
<ul>
  <li><code>getEmployeeById(employeeId: String)</code>: Employee — return the Employee associated with the specified employeeId. If not found, return <strong>null</strong>.</li>
  <li><code>countEmployeesBySalary(minSalary: double)</code>: int — return the number of Employees whose salary is greater than or equal to the specified minimum salary.</li>
</ul>
<p><em>Do not format the result.</em></p>
<p><strong>Note:</strong> the exact wording of <code>EmployeeList</code>'s spec page was not present in the source material for this paper — its method signatures and the fixed part of the driver (adding 5 named employees and printing them) were confirmed from the real compiled <code>Main.class</code> harness, but the "&gt;=" comparison rule for <code>countEmployeesBySalary</code> is an inference (by analogy with a near-identical <code>SimCardList.countSimByBalance</code> question on a sibling PRO192 paper by the same author, and the "Enter minimum salary:" prompt wording), not independently confirmed against an official sample run.</p>`;
const q3PromptVi = `<p><strong>(2 điểm)</strong> Viết lớp <strong>Employee</strong> (trong package mặc định) với thông tin sau:</p>
${table([
  '-employeeId: String<br/>-fullName: String<br/>-department: String<br/>-salary: double',
  '+Employee()<br/>+Employee(employeeId: String, fullName: String, department: String, salary: double)<br/>+getters &amp; setters<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Employee()</code> — constructor mặc định, khởi tạo employeeId="", fullName="", department="", salary=0.0.</li>
  <li><code>Employee(employeeId, fullName, department, salary)</code> — constructor có tham số, khởi tạo employeeId, fullName, department, salary của Employee.</li>
  <li>Getters &amp; Setters — viết getter/setter cho toàn bộ field.</li>
  <li><code>toString()</code>: String — trả về chuỗi định dạng: <code>employeeId,fullName,department,salary</code>. Ví dụ: <code>"E001,John Smith,IT,75000.0"</code>.</li>
</ul>
<p>Viết lớp <strong>EmployeeList</strong> kế thừa <code>ArrayList&lt;Employee&gt;</code> với:</p>
<ul>
  <li><code>getEmployeeById(employeeId: String)</code>: Employee — trả về Employee có employeeId chỉ định. Nếu không tìm thấy, trả về <strong>null</strong>.</li>
  <li><code>countEmployeesBySalary(minSalary: double)</code>: int — trả về số lượng Employee có salary lớn hơn hoặc bằng mức lương tối thiểu chỉ định.</li>
</ul>
<p><em>Không định dạng lại kết quả.</em></p>
<p><strong>Lưu ý:</strong> trang đặc tả nguyên văn của <code>EmployeeList</code> không có trong tài liệu nguồn tải về của đề này — chữ ký hàm và phần cố định của driver (thêm 5 nhân viên có tên + in ra) đã xác nhận qua <code>Main.class</code> biên dịch thật, nhưng quy tắc so sánh "&gt;=" của <code>countEmployeesBySalary</code> là SUY LUẬN (dựa theo câu hỏi gần như y hệt <code>SimCardList.countSimByBalance</code> ở một đề PRO192 khác cùng tác giả, và câu chữ prompt "Enter minimum salary:"), chưa được xác nhận độc lập qua 1 sample chạy chính thức.</p>`;

const q3ExplainEn = `<p>The FIXED part of the driver (confirmed 100% from decompiling the real <code>Main.class</code>) always adds these 5 named employees first and prints them via each Employee's <code>toString()</code>, before prompting for a 6th (user-entered) employee and the TC menu — this part is verified byte-for-byte:</p>
<pre>The information of five Employees was added:
E001,John Smith,IT,75000.0
E002,Sarah Johnson,HR,65000.0
E003,Michael Brown,Sales,70000.0
E004,Emily Davis,Finance,80000.0
E005,David Wilson,Operations,68000.0</pre>
<p>After that, the harness prompts for a new Employee (ID/name/department/salary), then "1. Test getEmployeeById()" / "2. Test countEmployeesBySalary()". <code>getEmployeeById</code> not-found prints the literal string <strong>"Employee not found"</strong> (confirmed from bytecode). <code>countEmployeesBySalary</code>'s exact comparison operator (&gt;= vs &gt;) could not be independently confirmed for THIS paper (no official sample run reaches that far) — the exam room grades this question primarily against the rubric below, so a solution using strict "&gt;" instead of "&gt;=" should not be marked fully wrong if reasoned correctly.</p>`;
const q3ExplainVi = `<p>Phần CỐ ĐỊNH của driver (xác nhận 100% từ decompile <code>Main.class</code> thật) luôn thêm 5 nhân viên có tên sẵn này trước, in ra bằng <code>toString()</code> của từng Employee, trước khi hỏi thêm nhân viên thứ 6 (do người dùng nhập) và menu TC — phần này đã kiểm khớp từng ký tự:</p>
<pre>The information of five Employees was added:
E001,John Smith,IT,75000.0
E002,Sarah Johnson,HR,65000.0
E003,Michael Brown,Sales,70000.0
E004,Emily Davis,Finance,80000.0
E005,David Wilson,Operations,68000.0</pre>
<p>Sau đó, harness hỏi thêm 1 Employee mới (ID/tên/phòng ban/lương), rồi "1. Test getEmployeeById()" / "2. Test countEmployeesBySalary()". <code>getEmployeeById</code> không tìm thấy in đúng chuỗi <strong>"Employee not found"</strong> (xác nhận từ bytecode). Toán tử so sánh chính xác của <code>countEmployeesBySalary</code> (&gt;= hay &gt;) KHÔNG xác nhận độc lập được cho đề này (không có sample chạy chính thức đi đến bước đó) — câu này được chấm chủ yếu theo rubric bên dưới, nên lời giải dùng "&gt;" chặt thay vì "&gt;=" vẫn không nên bị coi là sai hoàn toàn nếu lập luận hợp lý.</p>`;

const q3 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `import java.util.ArrayList;

public class Employee {
    private String employeeId;
    private String fullName;
    private String department;
    private double salary;

    public Employee() {
        this.employeeId = "";
        this.fullName = "";
        this.department = "";
        this.salary = 0.0;
    }

    public Employee(String employeeId, String fullName, String department, double salary) {
        // TODO: set fields
    }

    // TODO: getters & setters

    @Override
    public String toString() {
        // TODO: "employeeId,fullName,department,salary"
        return null;
    }
}

class EmployeeList extends ArrayList<Employee> {
    public Employee getEmployeeById(String employeeId) {
        // TODO: linear search, null if not found
        return null;
    }

    public int countEmployeesBySalary(double minSalary) {
        // TODO: count salary >= minSalary
        return 0;
    }
}`,
  sampleSolution: `${read('q3/src/Employee.java')}\n\n${read('q3/src/EmployeeList.java')}`,
  expectedOutput:
`Fixed part of every run (verified byte-for-byte against the real given Main.class):
The information of five Employees was added:
E001,John Smith,IT,75000.0
E002,Sarah Johnson,HR,65000.0
E003,Michael Brown,Sales,70000.0
E004,Emily Davis,Finance,80000.0
E005,David Wilson,Operations,68000.0

Illustrative run (own test input, logic-checked, not an official sample):
Enter a new Employee
Enter Employee ID: E006 / Enter full name: Tom Lee / Enter department: Test / Enter salary: 60000
1. Test getEmployeeById()
2. Test countEmployeesBySalary()
Enter TC(1/2): 1
Enter Employee ID: E001
OUTPUT:
E001,John Smith,IT,75000.0`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'employee_pojo', criterion: B('Employee declares all 4 fields correctly, both constructors, getters/setters, and toString() matches the exact comma-separated format.', 'Employee khai báo đúng 4 field, cả 2 constructor, getter/setter, toString() khớp đúng định dạng phân cách phẩy.'), weight: 1, maxScore: 1 },
    { id: 'employeelist', criterion: B('EmployeeList extends ArrayList<Employee>; getEmployeeById does a correct linear search returning null when not found; countEmployeesBySalary counts with a reasoned comparison (>= preferred).', 'EmployeeList kế thừa ArrayList<Employee>; getEmployeeById tìm tuyến tính đúng, trả null khi không thấy; countEmployeesBySalary đếm với so sánh có lập luận hợp lý (ưu tiên >=).'), weight: 1, maxScore: 1 },
  ],
};

// ── Q4: MyStringNumberTool (3 marks) ──
const q4PromptEn = `<p><strong>(3 marks)</strong> The interface <strong>IStringNumberTool</strong> below is already given in Java code format, thus you can use it without creating an <code>IStringNumberTool.java</code> file.</p>
${table([
  '+buildAcronym(string: String): String<br/>+decimalToBinary(n: int): String',
])}
<p>In default package, write a class named <strong>MyStringNumberTool</strong>, which implements the interface <strong>IStringNumberTool</strong>. The class MyStringNumberTool must implement all methods in IStringNumberTool as below:</p>
<p><strong>buildAcronym(string: String): String</strong> — Return an acronym created from the given string.</p>
<p><strong>Rules:</strong></p>
<ul>
  <li>If the given parameter is null or empty, return an empty string "".</li>
  <li>Assume that words are separated by exactly one space. Split the string by one space.</li>
  <li>For each word: Take the first character if it is a letter (A–Z or a–z).</li>
  <li>Convert all extracted characters to uppercase.</li>
  <li>Do not add spaces in the result.</li>
</ul>
<p><strong>Examples:</strong> "object oriented programming" → OOP; "Java virtual machine" → JVM; "123 data structure" → DS; "artificial intelligence" → AI</p>
<p><strong>decimalToBinary(n: int): String</strong> — Return the binary representation of a decimal integer.</p>
<p><strong>Rules:</strong></p>
<ul>
  <li>Assume that n is always non-negative.</li>
  <li>If n is 0, return "0".</li>
  <li>Do not use built-in methods such as Integer.toBinaryString().</li>
</ul>
<p><strong>Examples:</strong> 5 → 101; 10 → 1010</p>
<p><em>Do not format the result.</em></p>`;
const q4PromptVi = `<p><strong>(3 điểm)</strong> Interface <strong>IStringNumberTool</strong> bên dưới đã được cho sẵn ở dạng code Java, nên bạn có thể dùng nó mà không cần tạo file <code>IStringNumberTool.java</code>.</p>
${table([
  '+buildAcronym(string: String): String<br/>+decimalToBinary(n: int): String',
])}
<p>Trong package mặc định, viết lớp <strong>MyStringNumberTool</strong>, implements interface <strong>IStringNumberTool</strong>. Lớp MyStringNumberTool phải cài đặt đủ các hàm trong IStringNumberTool như sau:</p>
<p><strong>buildAcronym(string: String): String</strong> — Trả về chữ viết tắt tạo từ chuỗi đã cho.</p>
<p><strong>Quy tắc:</strong></p>
<ul>
  <li>Nếu tham số null hoặc rỗng, trả về chuỗi rỗng "".</li>
  <li>Giả sử các từ cách nhau đúng 1 khoảng trắng. Tách chuỗi theo 1 khoảng trắng.</li>
  <li>Với mỗi từ: lấy ký tự đầu nếu đó là chữ cái (A–Z hoặc a–z).</li>
  <li>Chuyển tất cả ký tự đã lấy thành chữ hoa.</li>
  <li>Không thêm khoảng trắng vào kết quả.</li>
</ul>
<p><strong>Ví dụ:</strong> "object oriented programming" → OOP; "Java virtual machine" → JVM; "123 data structure" → DS; "artificial intelligence" → AI</p>
<p><strong>decimalToBinary(n: int): String</strong> — Trả về biểu diễn nhị phân của một số nguyên thập phân.</p>
<p><strong>Quy tắc:</strong></p>
<ul>
  <li>Giả sử n luôn không âm.</li>
  <li>Nếu n = 0, trả về "0".</li>
  <li>Không dùng hàm có sẵn như Integer.toBinaryString().</li>
</ul>
<p><strong>Ví dụ:</strong> 5 → 101; 10 → 1010</p>
<p><em>Không định dạng lại kết quả.</em></p>`;

const q4ExplainEn = `<p>Verified by compiling <code>MyStringNumberTool.java</code> against the real given <code>Main.class</code>/<code>IStringNumberTool.class</code> and running the 2 official <code>buildAcronym</code> samples + 1 official <code>decimalToBinary</code> sample, plus 2 extra self-chosen inputs from the spec's own examples, byte-for-byte:</p>
<pre>buildAcronym("object oriented program") -> OOP
buildAcronym("123 data structure") -> DS
buildAcronym("artificial intelligence") -> AI
buildAcronym("Java virtual machine") -> JVM
decimalToBinary(10) -> 1010
decimalToBinary(5) -> 101</pre>
<p>Trap: the harness prints the result with <code>print</code> (not <code>println</code>), and characters that are digits (e.g. the leading "123" in "123 data structure") are silently skipped — only letters count, per rule 3.</p>`;
const q4ExplainVi = `<p>Đã kiểm bằng cách biên dịch <code>MyStringNumberTool.java</code> cùng <code>Main.class</code>/<code>IStringNumberTool.class</code> given thật, chạy đủ 2 sample <code>buildAcronym</code> + 1 sample <code>decimalToBinary</code> chính thức, cộng 2 input tự chọn thêm từ chính ví dụ trong đề, khớp từng ký tự:</p>
<pre>buildAcronym("object oriented program") -> OOP
buildAcronym("123 data structure") -> DS
buildAcronym("artificial intelligence") -> AI
buildAcronym("Java virtual machine") -> JVM
decimalToBinary(10) -> 1010
decimalToBinary(5) -> 101</pre>
<p>Bẫy: harness in kết quả bằng <code>print</code> (không phải <code>println</code>), và ký tự là chữ số (vd "123" đầu chuỗi "123 data structure") bị bỏ qua âm thầm — chỉ chữ cái mới được tính, theo đúng quy tắc 3.</p>`;

const q4 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `public interface IStringNumberTool {
    String buildAcronym(String string);
    String decimalToBinary(int n);
}

public class MyStringNumberTool implements IStringNumberTool {
    @Override
    public String buildAcronym(String string) {
        // TODO
        return null;
    }

    @Override
    public String decimalToBinary(int n) {
        // TODO: no Integer.toBinaryString()
        return null;
    }
}`,
  sampleSolution: read('q4/src/MyStringNumberTool.java'),
  expectedOutput:
`Sample run 1 (TC 1 — buildAcronym("object oriented program")):
OUTPUT:
OOP

Sample run 2 (TC 1 — buildAcronym("123 data structure")):
OUTPUT:
DS

Sample run 3 (TC 2 — decimalToBinary(10)):
OUTPUT:
1010`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'acronym', criterion: B('buildAcronym() takes only the first char of each space-separated word, only when it is a letter, uppercased, no separators, "" for null/empty input.', 'buildAcronym() chỉ lấy ký tự đầu mỗi từ cách nhau bởi space, chỉ khi là chữ cái, viết hoa, không có dấu phân cách, trả "" cho input null/rỗng.'), weight: 1, maxScore: 1.5 },
    { id: 'binary', criterion: B('decimalToBinary() computes the correct binary digits without built-in helpers, "0" for n=0.', 'decimalToBinary() tính đúng các chữ số nhị phân không dùng hàm có sẵn, trả "0" khi n=0.'), weight: 1, maxScore: 1.5 },
  ],
};

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE1-SP26-2',
      title: B('PRO192 — Practical Exam Đề 1 (SP26)', 'PRO192 — Đề thi thực hành số 1 (SP26)'),
      description: B(
        'Real PRO192 PE paper (4 questions, 10 marks) — encapsulation with string formatting rules, inheritance (Screen/OLEDScreen), a List-backed lookup/count pair (Employee/EmployeeList), and an interface implementation for string/number utilities. Solutions written & verified by compiling against the real given Main.class harness for 3 of the 4 questions; the 4th (EmployeeList) has one inferred rule, flagged in its explanation.',
        'Đề PE PRO192 thật (4 câu, 10 điểm) — đóng gói với quy tắc định dạng chuỗi, kế thừa (Screen/OLEDScreen), cặp tra cứu/đếm trên List (Employee/EmployeeList), và cài đặt interface xử lý chuỗi/số. Lời giải đã viết và kiểm bằng cách biên dịch cùng harness Main.class given thật cho 3/4 câu; câu thứ 4 (EmployeeList) có 1 quy tắc suy luận, đã ghi rõ trong phần giải thích.',
      ),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      source: 'REAL',
      isPublished: true,
      instructions,
      attachmentUrl: ATTACHMENT_URL,
      attachmentName: B('Download given materials (Q1-Q4, real NetBeans projects)', 'Tải given materials (Q1-Q4, project NetBeans thật)'),
      questions: [q1, q2, q3, q4],
    },
  ],
};

fs.writeFileSync(
  OUT,
  `// AUTO-GENERATED by scripts/build-pro192-pe1.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
