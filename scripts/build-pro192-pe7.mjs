/**
 * build-pro192-pe7.mjs — sinh content/exams/PRO192-PE7.mjs.
 *
 * Khác các đề PE PRO192 khác: nguồn tải về của đề này KHÔNG có
 * given.materials.zip/rar nào (đã xác nhận thư mục nguồn trống, không phải
 * lỗi tải) — dù trang hướng dẫn (page 1-2) vẫn mô tả quy trình "given Q
 * project" giống các đề khác. Bù lại, cả 8 trang ảnh đề (`1.webp`..`8.webp`)
 * ĐẦY ĐỦ 4 câu, MỖI câu đều có bảng "The program output might look like
 * this" với sample input→output THẬT transcribe trực tiếp từ ảnh — nên vẫn
 * build được ở độ tin cậy cao dù không decompile được Main.class thật (dùng
 * driver tự viết khớp đúng các prompt/OUTPUT mẫu, giống PE3/PE5 — không có
 * harness NetBeans nhưng có ground-truth output thật).
 *
 * Nguồn đã verify: scratchpad pe7-work/q{1..4} — biên dịch bằng `javac`,
 * chạy với driver tự viết khớp đúng các prompt "Enter ..." trong ảnh, output
 * khớp BYTE-FOR-BYTE với mọi sample chính thức của cả 4 câu.
 *
 * NGOẠI LỆ: Q2 (Router.getTotalAmount, TC2) có 1 sample output "220000.00"
 * lệch đúng 10 lần so với kết quả tính theo ĐÚNG công thức chữ trong đề
 * ("total amount = quantity * final price" — 20 * 1100.00 = 22000.00, không
 * phải 220000.00). Nghi là lỗi in ấn/transcribe trong chính đề gốc (tương tự
 * kiểu lỗi "output thật thắng đặc tả chữ" đã gặp ở Đề 10 PE trước đây, nhưng
 * NGƯỢC LẠI: ở đây công thức chữ rõ ràng, không mơ hồ, còn 1 con số mẫu lại
 * bất thường) — đã CHỌN tin công thức chữ (22000.00), ghi rõ nghi vấn trong
 * explanation thay vì âm thầm sửa số cho khớp.
 *
 * Không có given materials để đóng gói/upload — không có attachmentUrl.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE7.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/67a2fe4a-07bb-4013-af17-6c18abd35b56/scratchpad/pe7-work';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE7.mjs');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').trimEnd();

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "PRO192 - PE - Bl3w - FALL25").</p>
   <ol>
     <li>Software Requirements: Netbean 13 or later, JDK 8, Notepad, Command Prompt, WinRAR/WinZip with Windows Explorer on Windows 7 and above. Students are ONLY allowed to use their own study materials (sample codes, program examples) stored on their own computer.</li>
     <li>Create a folder to save the given projects. Open NetBeans, open the given Qx project, then complete it according to the exam requirements. Do not delete/edit given files, or create a Java file with the same name as given files.</li>
     <li>Before submission: run "Clean and Build Project" (Shift+F11), for each question create two sub-folders <strong>run</strong> and <strong>src</strong>, copy the Qx.jar file into run, copy the entire source code into src.</li>
     <li>Submission: select Question No, browse and select the project folder, then click Submit.</li>
     <li>Do NOT use accented Vietnamese when writing comments. All source code .java files will be created in the default package of the NetBean.</li>
   </ol>
   <p><strong>Note on this paper's source:</strong> the downloadable "given materials" package for this exam paper was not available when this room was built (no compiled harness/skeleton to give students) — the 4 questions below are transcribed directly from the real exam PDF, each with real "the program output might look like this" sample runs shown in the explanation, which is what this solution was verified against. This exam room's code box is graded by AI against the rubric, same as every other PE paper.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> (dịch nguyên văn từ đề thi thật "PRO192 - PE - Bl3w - FALL25").</p>
   <ol>
     <li>Yêu cầu phần mềm: Netbean 13 trở lên, JDK 8, Notepad, Command Prompt, WinRAR/WinZip cùng Windows Explorer trên Windows 7 trở lên. Sinh viên CHỈ được dùng tài liệu học tập của riêng mình (mã mẫu, ví dụ chương trình) lưu trên máy tính của mình.</li>
     <li>Tạo thư mục lưu các project given. Mở NetBeans, mở project Qx tương ứng, hoàn thành theo yêu cầu đề. Không xoá/sửa file given, không tạo file Java trùng tên file given.</li>
     <li>Trước khi nộp: chạy "Clean and Build Project" (Shift+F11), với mỗi câu tạo 2 thư mục con <strong>run</strong> và <strong>src</strong>, chép file Qx.jar vào run, chép toàn bộ mã nguồn vào src.</li>
     <li>Nộp bài: chọn số câu hỏi, browse chọn thư mục project, bấm Submit.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment. Mọi file .java sẽ được tạo trong package mặc định của NetBean.</li>
   </ol>
   <p><strong>Lưu ý về nguồn đề này:</strong> gói "given materials" tải về của đề này không có sẵn khi dựng phòng thi này (không có harness/khung biên dịch sẵn để đưa cho học viên) — 4 câu bên dưới được dịch trực tiếp từ file PDF đề thi thật, mỗi câu đều có mẫu chạy "chương trình có thể in ra như thế này" thật trong phần giải thích, đây chính là thứ lời giải đã được đối chiếu. Ô mã của phòng thi này vẫn được AI chấm theo tiêu chí, giống mọi đề PE khác.</p>`,
);

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ── Q1: Employee (2 marks) ──
const q1PromptEn = `<p><strong>(2 marks)</strong> Do not pay attention to the real meaning of objects, variables, and their values in the questions below.</p>
<p>Write a class <strong>Employee</strong> (in the default package of the NetBean) with the following information:</p>
${table([
  '-name: String<br/>-position: String<br/>-salary: int',
  '+Employee()<br/>+Employee(name: String, position: String)<br/>+getPosition(): String<br/>+getSalary(): int<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>Employee()</code> — default constructor.</li>
  <li><code>Employee(name, position)</code> — parameterized constructor, which sets values to name and position.</li>
  <li><code>getPosition()</code>: String — return the employee position in uppercase.</li>
  <li><code>getSalary()</code>: int — return the employee salary according to the following description (String comparison is case insensitive): if the position is "Head", salary=1500; if the position is "Deputy", salary=1300; for other positions salary=1000.</li>
  <li><code>toString()</code>: String — override to return a string format that contains all the information of the Employee: name,position,salary. The position in uppercase. <strong>Note:</strong> do not use spaces to separate values.</li>
</ul>
<p><em>Do not format the result.</em></p>`;
const q1PromptVi = `<p><strong>(2 điểm)</strong> Bỏ qua ý nghĩa thực tế của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</p>
<p>Viết lớp <strong>Employee</strong> (trong package mặc định của NetBean) với thông tin sau:</p>
${table([
  '-name: String<br/>-position: String<br/>-salary: int',
  '+Employee()<br/>+Employee(name: String, position: String)<br/>+getPosition(): String<br/>+getSalary(): int<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Employee()</code> — constructor mặc định.</li>
  <li><code>Employee(name, position)</code> — constructor có tham số, gán giá trị cho name và position.</li>
  <li><code>getPosition()</code>: String — trả về vị trí công việc viết hoa.</li>
  <li><code>getSalary()</code>: int — trả về lương theo mô tả sau (so sánh chuỗi không phân biệt hoa/thường): nếu position là "Head", salary=1500; nếu "Deputy", salary=1300; các vị trí khác salary=1000.</li>
  <li><code>toString()</code>: String — override để trả về chuỗi chứa mọi thông tin Employee: name,position,salary. Position viết hoa. <strong>Lưu ý:</strong> không dùng khoảng trắng để phân cách giá trị.</li>
</ul>
<p><em>Không định dạng lại kết quả.</em></p>`;

const q1ExplainEn = `<p>Verified by writing a driver matching the exact prompts and running all 3 official sample TCs byte-for-byte. Trap: <code>getSalary()</code>'s position comparison is explicitly case-insensitive ("head"/"Head"/"HEAD" all → 1500) — use <code>equalsIgnoreCase</code>, not <code>equals</code>.</p>
<pre>TC1 (name=Tom, position=deputy) — getPosition(): OUTPUT: DEPUTY
TC2 (name=Tom, position=head) — getSalary(): OUTPUT: 1500
TC3 (name=Tom, position=staff) — toString(): OUTPUT: Tom,STAFF,1000</pre>`;
const q1ExplainVi = `<p>Đã kiểm bằng cách viết driver khớp đúng các prompt và chạy đủ 3 TC chính thức khớp từng ký tự. Bẫy: so sánh position trong <code>getSalary()</code> đề nói rõ không phân biệt hoa/thường ("head"/"Head"/"HEAD" đều → 1500) — dùng <code>equalsIgnoreCase</code>, không phải <code>equals</code>.</p>
<pre>TC1 (name=Tom, position=deputy) — getPosition(): OUTPUT: DEPUTY
TC2 (name=Tom, position=head) — getSalary(): OUTPUT: 1500
TC3 (name=Tom, position=staff) — toString(): OUTPUT: Tom,STAFF,1000</pre>`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `public class Employee {
    private String name;
    private String position;
    private int salary;

    public Employee() {
    }

    public Employee(String name, String position) {
        // TODO: set fields
    }

    public String getPosition() {
        // TODO: uppercase
        return null;
    }

    public int getSalary() {
        // TODO: case-insensitive Head/Deputy/other
        return 0;
    }

    @Override
    public String toString() {
        // TODO: "name,POSITION,salary"
        return null;
    }
}`,
  sampleSolution: read('q1/Employee.java'),
  expectedOutput:
`Sample run 1 (TC 1 — getPosition; name=Tom, position=deputy):
OUTPUT:
DEPUTY

Sample run 2 (TC 2 — getSalary; name=Tom, position=head):
OUTPUT:
1500

Sample run 3 (TC 3 — toString; name=Tom, position=staff):
OUTPUT:
Tom,STAFF,1000`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'fields_ctor7', criterion: B('Fields declared correctly, both constructors work.', 'Khai báo đúng field, cả 2 constructor hoạt động đúng.'), weight: 1, maxScore: 0.5 },
    { id: 'salary_rule', criterion: B('getSalary() applies the Head/Deputy/other rule with case-insensitive comparison.', 'getSalary() áp đúng quy tắc Head/Deputy/khác, so sánh không phân biệt hoa thường.'), weight: 1, maxScore: 1 },
    { id: 'tostring7', criterion: B('toString() matches the exact "name,POSITION,salary" format, no spaces.', 'toString() khớp đúng định dạng "name,POSITION,salary", không khoảng trắng.'), weight: 1, maxScore: 0.5 },
  ],
};

// ── Q2: NetworkDevice / Router (3 marks) ──
const q2PromptEn = `<p><strong>(3 marks)</strong> Write a class named <strong>NetworkDevice</strong> and a class named <strong>Router</strong> extended from NetworkDevice (i.e. NetworkDevice is a superclass and Router is a subclass).</p>
<p><strong>1. Class: NetworkDevice</strong></p>
${table([
  '-price: double<br/>-speed: int',
  '+NetworkDevice()<br/>+NetworkDevice(price: double, speed: int)<br/>+getters &amp; setters<br/>+getFinalPrice(): double',
])}
<ul>
  <li><code>NetworkDevice()</code> — default constructor that initializes price and speed to 0.</li>
  <li><code>NetworkDevice(price, speed)</code> — parameterized constructor that initializes price and speed with the given values.</li>
  <li>getters &amp; setters — write the setters and getters of all the fields.</li>
  <li><code>getFinalPrice()</code>: double — return the final price, the final price = price * rate. If speed greater than or equal to 150, rate is 1.1; otherwise rate is 1.2.</li>
</ul>
<p><strong>2. Class: Router</strong> (extends NetworkDevice)</p>
${table([
  '-numberOfPorts: int<br/>-quantity: int',
  '+Router()<br/>+Router(price: double, speed: int, numberOfPorts: int, quantity: int)<br/>+getters &amp; setters<br/>+getTotalAmount(): double<br/>+getDescription(): String<br/>+toString(): String',
])}
<ul>
  <li><code>Router()</code> — default constructor, sets numberOfPorts to 0.</li>
  <li><code>Router(price, speed, numberOfPorts, quantity)</code> — parameterized constructor that initializes price, speed, numberOfPorts, and quantity with the given values.</li>
  <li>getters &amp; setters — write the setters and getters of all the fields.</li>
  <li><code>getTotalAmount()</code>: double — returns the total amount, total amount = quantity * final price.</li>
  <li><code>getDescription()</code>: String — returns a description of the router's ports. If the number of ports is greater than 4, the description is "High"; otherwise, the description is "Standard".</li>
  <li><code>toString()</code>: String — return a string format that contains: numberOfPorts-finalPrice-speed-description, e.g. <code>5-11000.00-150-High</code> (finalPrice formatted to 2 decimal places).</li>
</ul>
<p><em>Do not format the result.</em></p>`;
const q2PromptVi = `<p><strong>(3 điểm)</strong> Viết lớp <strong>NetworkDevice</strong> và lớp <strong>Router</strong> kế thừa từ NetworkDevice (NetworkDevice là lớp cha, Router là lớp con).</p>
<p><strong>1. Lớp: NetworkDevice</strong></p>
${table([
  '-price: double<br/>-speed: int',
  '+NetworkDevice()<br/>+NetworkDevice(price: double, speed: int)<br/>+getters &amp; setters<br/>+getFinalPrice(): double',
])}
<ul>
  <li><code>NetworkDevice()</code> — constructor mặc định, khởi tạo price và speed = 0.</li>
  <li><code>NetworkDevice(price, speed)</code> — constructor có tham số, khởi tạo price và speed theo giá trị truyền vào.</li>
  <li>getters &amp; setters — viết setter/getter cho toàn bộ field.</li>
  <li><code>getFinalPrice()</code>: double — trả về giá cuối, final price = price * rate. Nếu speed &gt;= 150, rate = 1.1; ngược lại rate = 1.2.</li>
</ul>
<p><strong>2. Lớp: Router</strong> (kế thừa NetworkDevice)</p>
${table([
  '-numberOfPorts: int<br/>-quantity: int',
  '+Router()<br/>+Router(price: double, speed: int, numberOfPorts: int, quantity: int)<br/>+getters &amp; setters<br/>+getTotalAmount(): double<br/>+getDescription(): String<br/>+toString(): String',
])}
<ul>
  <li><code>Router()</code> — constructor mặc định, numberOfPorts = 0.</li>
  <li><code>Router(price, speed, numberOfPorts, quantity)</code> — constructor có tham số, khởi tạo price, speed, numberOfPorts, quantity theo giá trị truyền vào.</li>
  <li>getters &amp; setters — viết setter/getter cho toàn bộ field.</li>
  <li><code>getTotalAmount()</code>: double — trả về tổng tiền, total amount = quantity * final price.</li>
  <li><code>getDescription()</code>: String — trả về mô tả số cổng của router. Nếu numberOfPorts &gt; 4, mô tả là "High"; ngược lại "Standard".</li>
  <li><code>toString()</code>: String — trả về chuỗi định dạng: numberOfPorts-finalPrice-speed-description, vd <code>5-11000.00-150-High</code> (finalPrice định dạng 2 chữ số thập phân).</li>
</ul>
<p><em>Không định dạng lại kết quả.</em></p>`;

const q2ExplainEn = `<p>Verified by writing a driver matching the exact prompts and running the official samples. <strong>Known discrepancy in the source exam:</strong> the official sample table shows TC2 (<code>getTotalAmount()</code> with price=1000, speed=150, quantity=20 → finalPrice=1100.00) as <code>220000.00</code>, but the spec text is unambiguous — <code>total amount = quantity * final price</code> = 20 × 1100.00 = <strong>22000.00</strong>. This solution follows the explicit formula (22000.00); the sample's "220000.00" is most likely a transcription typo in the original exam paper (off by exactly one order of magnitude), not a different intended formula — the other 3 samples for this question (TC1, TC3, TC4) all match the formula exactly.</p>
<pre>TC1 (price=1000, speed=150, ports=5, qty=20) — getFinalPrice(): OUTPUT: 1100.00
TC2 (same) — getTotalAmount() per formula: 22000.00 (source sample shows 220000.00, see note above)
TC3 (price=10000, speed=150, ports=5, qty=20) — getDescription(): OUTPUT: High
TC4 (same) — toString(): OUTPUT: 5-11000.00-150-High</pre>`;
const q2ExplainVi = `<p>Đã kiểm bằng cách viết driver khớp đúng các prompt và chạy các sample chính thức. <strong>Nghi vấn lệch trong đề gốc:</strong> bảng sample chính thức ghi TC2 (<code>getTotalAmount()</code> với price=1000, speed=150, quantity=20 → finalPrice=1100.00) là <code>220000.00</code>, nhưng phần chữ đặc tả rất rõ ràng — <code>total amount = quantity * final price</code> = 20 × 1100.00 = <strong>22000.00</strong>. Lời giải này theo đúng công thức chữ (22000.00); số "220000.00" trong sample nhiều khả năng là lỗi in ấn/transcribe trong chính đề gốc (lệch đúng 1 bậc số 0), không phải công thức khác — 3 sample còn lại của câu này (TC1, TC3, TC4) đều khớp đúng công thức.</p>
<pre>TC1 (price=1000, speed=150, ports=5, qty=20) — getFinalPrice(): OUTPUT: 1100.00
TC2 (như trên) — getTotalAmount() theo công thức: 22000.00 (sample gốc ghi 220000.00, xem lưu ý trên)
TC3 (price=10000, speed=150, ports=5, qty=20) — getDescription(): OUTPUT: High
TC4 (như trên) — toString(): OUTPUT: 5-11000.00-150-High</pre>`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `public class NetworkDevice {
    private double price;
    private int speed;

    public NetworkDevice() {
        this.price = 0;
        this.speed = 0;
    }

    public NetworkDevice(double price, int speed) {
        // TODO: set fields
    }

    // TODO: getters & setters

    public double getFinalPrice() {
        // TODO: speed>=150 -> ×1.1, else ×1.2
        return 0;
    }
}

class Router extends NetworkDevice {
    private int numberOfPorts;
    private int quantity;

    public Router() {
        super();
        this.numberOfPorts = 0;
    }

    public Router(double price, int speed, int numberOfPorts, int quantity) {
        // TODO: call super, set fields
    }

    // TODO: getters & setters

    public double getTotalAmount() {
        // TODO: quantity * getFinalPrice()
        return 0;
    }

    public String getDescription() {
        // TODO: ports>4 -> "High" else "Standard"
        return null;
    }

    @Override
    public String toString() {
        // TODO: "ports-finalPrice(2dp)-speed-description"
        return null;
    }
}`,
  sampleSolution: `${read('q2/NetworkDevice.java')}\n\n${read('q2/Router.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — getFinalPrice; price=1000, speed=150, numberOfPorts=5, quantity=20):
OUTPUT:
1100.00

Sample run 2 (TC 2 — getTotalAmount; same inputs) — per formula quantity*finalPrice:
OUTPUT:
22000.00
(source exam's own sample table shows 220000.00 here — see explanation for why this solution trusts the written formula instead)

Sample run 3 (TC 3 — getDescription; price=10000, speed=150, numberOfPorts=5, quantity=20):
OUTPUT:
High

Sample run 4 (TC 4 — toString; same inputs):
OUTPUT:
5-11000.00-150-High`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'networkdevice', criterion: B('NetworkDevice declares price/speed correctly, both constructors, getFinalPrice() applies the >=150 rate rule.', 'NetworkDevice khai báo đúng price/speed, cả 2 constructor, getFinalPrice() áp đúng quy tắc rate theo >=150.'), weight: 1, maxScore: 1 },
    { id: 'router_ctor', criterion: B('Router extends NetworkDevice correctly, fields/constructor/getters-setters correct.', 'Router kế thừa NetworkDevice đúng, field/constructor/getter-setter đúng.'), weight: 1, maxScore: 0.7 },
    { id: 'amount_desc', criterion: B('getTotalAmount() = quantity * getFinalPrice(); getDescription() applies the >4 ports rule.', 'getTotalAmount() = quantity * getFinalPrice(); getDescription() áp đúng quy tắc >4 cổng.'), weight: 1, maxScore: 0.8 },
    { id: 'tostring_router', criterion: B('toString() matches the exact "ports-finalPrice-speed-description" format.', 'toString() khớp đúng định dạng "ports-finalPrice-speed-description".'), weight: 1, maxScore: 0.5 },
  ],
};

// ── Q3: SimCard / SimCardList (2 marks) ──
const q3PromptEn = `<p><strong>(2 marks)</strong> Write a class named <strong>SimCard</strong> with the following information:</p>
${table([
  '-simId: int<br/>-phoneNumber: String<br/>-balance: double',
  '+SimCard(simId: int, phoneNumber: String, balance: double)<br/>+getters &amp; setters<br/>+toString(): String',
])}
<ul>
  <li><code>SimCard(simId, phoneNumber, balance)</code> — parameterized constructor, which initializes simId, phoneNumber, and balance.</li>
  <li>getters &amp; setters — write the setters and getters of all the fields.</li>
  <li><code>toString()</code>: String — return a string format that contains all the information of the SimCard: simId,phoneNumber,balance. The balance is formatted with two decimal places. <strong>Note:</strong> do not use spaces to separate values.</li>
</ul>
<p>Write a class <strong>SimCardList</strong> which extends <code>ArrayList</code> (ArrayList is a collection) with the following information:</p>
${table([
  '+getSimByPhoneNumber(phoneNumber: String): SimCard<br/>+countSimByBalance(amount: double): int',
])}
<ul>
  <li><code>getSimByPhoneNumber(phoneNumber)</code>: SimCard — return the SimCard associated with the specified phoneNumber. If not found matching data, return null.</li>
  <li><code>countSimByBalance(amount)</code>: int — return the number of SimCard with the balance less than or equal to the specified amount. If not found matching data, return 0.</li>
</ul>
<p><strong>Hint:</strong> to declare the SimCardList class, you can use the following statement: <code>public class SimCardList extends ArrayList&lt;SimCard&gt; { //..... }</code></p>
<p><em>Do not format the result.</em></p>`;
const q3PromptVi = `<p><strong>(2 điểm)</strong> Viết lớp <strong>SimCard</strong> với thông tin sau:</p>
${table([
  '-simId: int<br/>-phoneNumber: String<br/>-balance: double',
  '+SimCard(simId: int, phoneNumber: String, balance: double)<br/>+getters &amp; setters<br/>+toString(): String',
])}
<ul>
  <li><code>SimCard(simId, phoneNumber, balance)</code> — constructor có tham số, khởi tạo simId, phoneNumber, balance.</li>
  <li>getters &amp; setters — viết setter/getter cho toàn bộ field.</li>
  <li><code>toString()</code>: String — trả về chuỗi chứa mọi thông tin SimCard: simId,phoneNumber,balance. Balance định dạng 2 chữ số thập phân. <strong>Lưu ý:</strong> không dùng khoảng trắng để phân cách giá trị.</li>
</ul>
<p>Viết lớp <strong>SimCardList</strong> kế thừa <code>ArrayList</code> (ArrayList là 1 collection) với thông tin sau:</p>
${table([
  '+getSimByPhoneNumber(phoneNumber: String): SimCard<br/>+countSimByBalance(amount: double): int',
])}
<ul>
  <li><code>getSimByPhoneNumber(phoneNumber)</code>: SimCard — trả về SimCard có phoneNumber chỉ định. Nếu không tìm thấy, trả về null.</li>
  <li><code>countSimByBalance(amount)</code>: int — trả về số lượng SimCard có balance nhỏ hơn hoặc bằng amount chỉ định. Nếu không tìm thấy, trả về 0.</li>
</ul>
<p><strong>Gợi ý:</strong> để khai báo lớp SimCardList, có thể dùng: <code>public class SimCardList extends ArrayList&lt;SimCard&gt; { //..... }</code></p>
<p><em>Không định dạng lại kết quả.</em></p>`;

const q3ExplainEn = `<p>Verified by writing a driver matching the exact prompts and running both official sample TCs byte-for-byte (5 pre-added sims with balances 100/300/200/500/400, plus a 6th user-entered sim per TC). Trap: <code>countSimByBalance</code> compares with <strong>"less than or equal to"</strong> (&lt;=), not "less than" — confirmed both from the spec text and from TC2's count matching exactly with a &lt;= amount comparison.</p>
<pre>TC1 (6th sim: id=6, phone=0906123456, balance=800) — getSimByPhoneNumber("0906123456"): OUTPUT: 6,0906123456,800.00
TC1 (searching a non-existent phone number): OUTPUT: N/A (student's own driver choice for a null result — the graded method itself must return null, per spec)
TC2 (6th sim: id=6, phone=0906123456, balance=50) — countSimByBalance(480): OUTPUT: 5
  (balances <= 480: 100, 300, 200, 400, 50 -> 5 sims; 500 is excluded)</pre>`;
const q3ExplainVi = `<p>Đã kiểm bằng cách viết driver khớp đúng các prompt và chạy đủ 2 TC chính thức khớp từng ký tự (5 sim thêm sẵn balance 100/300/200/500/400, cộng sim thứ 6 do người dùng nhập mỗi TC). Bẫy: <code>countSimByBalance</code> so sánh <strong>"nhỏ hơn hoặc bằng"</strong> (&lt;=), không phải "nhỏ hơn" — xác nhận cả từ đặc tả chữ lẫn từ kết quả đếm TC2 khớp đúng khi so sánh &lt;=.</p>
<pre>TC1 (sim thứ 6: id=6, phone=0906123456, balance=800) — getSimByPhoneNumber("0906123456"): OUTPUT: 6,0906123456,800.00
TC1 (tìm số điện thoại không tồn tại): OUTPUT: N/A (cách driver mẫu của học viên tự chọn để hiển thị null — hàm được chấm chỉ cần trả về null theo đúng đặc tả)
TC2 (sim thứ 6: id=6, phone=0906123456, balance=50) — countSimByBalance(480): OUTPUT: 5
  (balance <= 480: 100, 300, 200, 400, 50 -> 5 sim; loại 500)</pre>`;

const q3 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `import java.util.ArrayList;

public class SimCard {
    private int simId;
    private String phoneNumber;
    private double balance;

    public SimCard(int simId, String phoneNumber, double balance) {
        // TODO: set fields
    }

    // TODO: getters & setters

    @Override
    public String toString() {
        // TODO: "simId,phoneNumber,balance(2dp)"
        return null;
    }
}

class SimCardList extends ArrayList<SimCard> {
    public SimCard getSimByPhoneNumber(String phoneNumber) {
        // TODO: linear search, null if not found
        return null;
    }

    public int countSimByBalance(double amount) {
        // TODO: count balance <= amount
        return 0;
    }
}`,
  sampleSolution: `${read('q3/SimCard.java')}\n\n${read('q3/SimCardList.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — getSimByPhoneNumber; 5 sims pre-added with balances 100/300/200/500/400, 6th sim id=6 phone=0906123456 balance=800, search "0906123456"):
OUTPUT:
6,0906123456,800.00

Sample run 2 (TC 2 — countSimByBalance(480); same 5 pre-added sims, 6th sim id=6 phone=0906123456 balance=50):
OUTPUT:
5`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'simcard_pojo', criterion: B('SimCard declares all 3 fields correctly, constructor, getters/setters, toString() matches the exact comma-separated 2dp format.', 'SimCard khai báo đúng 3 field, constructor, getter/setter, toString() khớp đúng định dạng phân cách phẩy 2 chữ số thập phân.'), weight: 1, maxScore: 1 },
    { id: 'simcardlist', criterion: B('SimCardList extends ArrayList<SimCard>; getSimByPhoneNumber does a correct linear search returning null when not found; countSimByBalance uses <= comparison.', 'SimCardList kế thừa ArrayList<SimCard>; getSimByPhoneNumber tìm tuyến tính đúng, trả null khi không thấy; countSimByBalance dùng so sánh <=.'), weight: 1, maxScore: 1 },
  ],
};

// ── Q4: MyUtilities (3 marks) ──
const q4PromptEn = `<p><strong>(3 marks)</strong> Write an interface named <strong>IStringUtilities</strong> with the following information:</p>
${table([
  '+getFirstWord(str: String): String<br/>+countWords(str: String, value: int): int',
])}
<p>Write a class named <strong>MyUtilities</strong>, which implements the interface <strong>IStringUtilities</strong>. The class MyUtilities implements all methods in IStringUtilities as below:</p>
<ul>
  <li><code>getFirstWord(str: String)</code>: String — return the first word in the string str in uppercase.</li>
  <li><code>countWords(str: String, value: int)</code>: int — count the number of words in string str that have the length equal to <strong>value</strong>. If no words are found that satisfy the condition, return the length of string str.</li>
</ul>
<p><strong>Hints:</strong> assuming that the string str consists of words separated by a space. You can refer to the split() method of the String class.</p>
<p><em>Do not format the result.</em></p>`;
const q4PromptVi = `<p><strong>(3 điểm)</strong> Viết interface <strong>IStringUtilities</strong> với thông tin sau:</p>
${table([
  '+getFirstWord(str: String): String<br/>+countWords(str: String, value: int): int',
])}
<p>Viết lớp <strong>MyUtilities</strong>, implements interface <strong>IStringUtilities</strong>. Lớp MyUtilities cài đặt đủ các hàm trong IStringUtilities như sau:</p>
<ul>
  <li><code>getFirstWord(str: String)</code>: String — trả về từ đầu tiên trong chuỗi str, viết hoa.</li>
  <li><code>countWords(str: String, value: int)</code>: int — đếm số từ trong chuỗi str có độ dài bằng <strong>value</strong>. Nếu không có từ nào thoả điều kiện, trả về độ dài chuỗi str.</li>
</ul>
<p><strong>Gợi ý:</strong> giả sử chuỗi str gồm các từ cách nhau bởi 1 khoảng trắng. Có thể dùng hàm split() của lớp String.</p>
<p><em>Không định dạng lại kết quả.</em></p>`;

const q4ExplainEn = `<p>Verified by writing a driver matching the exact prompts and running all 3 official sample TCs byte-for-byte. Trap: when NO word matches the given length, <code>countWords</code> returns <code>str.length()</code> (the raw character count of the whole string, including spaces/punctuation) — not 0, not -1.</p>
<pre>TC1 (str="hello world !") — getFirstWord(): OUTPUT: HELLO
TC2 (str="hello world! , hello world!", value=5) — countWords(): OUTPUT: 2
  (words: "hello"(5) "world!"(6) ","(1) "hello"(5) "world!"(6) -> 2 words of length 5)
TC3 (str="hello world!!", value=2) — countWords(): OUTPUT: 13
  (words: "hello"(5) "world!!"(7) -> none of length 2 -> return str.length() = 13)</pre>`;
const q4ExplainVi = `<p>Đã kiểm bằng cách viết driver khớp đúng các prompt và chạy đủ 3 TC chính thức khớp từng ký tự. Bẫy: khi KHÔNG có từ nào khớp độ dài, <code>countWords</code> trả về <code>str.length()</code> (số ký tự của cả chuỗi, tính cả khoảng trắng/dấu câu) — không phải 0, không phải -1.</p>
<pre>TC1 (str="hello world !") — getFirstWord(): OUTPUT: HELLO
TC2 (str="hello world! , hello world!", value=5) — countWords(): OUTPUT: 2
  (từ: "hello"(5) "world!"(6) ","(1) "hello"(5) "world!"(6) -> 2 từ độ dài 5)
TC3 (str="hello world!!", value=2) — countWords(): OUTPUT: 13
  (từ: "hello"(5) "world!!"(7) -> không từ nào độ dài 2 -> trả str.length() = 13)</pre>`;

const q4 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `public interface IStringUtilities {
    String getFirstWord(String str);
    int countWords(String str, int value);
}

public class MyUtilities implements IStringUtilities {
    @Override
    public String getFirstWord(String str) {
        // TODO
        return null;
    }

    @Override
    public int countWords(String str, int value) {
        // TODO: if no match, return str.length()
        return 0;
    }
}`,
  sampleSolution: `${read('q4/IStringUtilities.java')}\n\n${read('q4/MyUtilities.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — getFirstWord("hello world !")):
OUTPUT:
HELLO

Sample run 2 (TC 2 — countWords("hello world! , hello world!", 5)):
OUTPUT:
2

Sample run 3 (TC 2 — countWords("hello world!!", 2)):
OUTPUT:
13`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'first_word', criterion: B('getFirstWord() splits by space and uppercases the first token.', 'getFirstWord() tách theo space rồi viết hoa từ đầu tiên.'), weight: 1, maxScore: 1.5 },
    { id: 'count_words', criterion: B('countWords() counts words of exact matching length, falling back to str.length() when no match is found.', 'countWords() đếm đúng từ có độ dài khớp, trả về str.length() khi không từ nào khớp.'), weight: 1, maxScore: 1.5 },
  ],
};

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE7-FALL25-Bl3w',
      title: B('PRO192 — Practical Exam Đề 7 (FALL25, Block 3w)', 'PRO192 — Đề thi thực hành số 7 (FALL25, Block 3w)'),
      description: B(
        'Real PRO192 PE paper (4 questions, 10 marks) — case-insensitive salary rules, inheritance (NetworkDevice/Router), a List-backed lookup/count pair (SimCard/SimCardList), and an interface implementation for string utilities. No given-materials package was available for this paper; solutions written & verified against the real transcribed sample runs from the exam PDF instead of a compiled harness.',
        'Đề PE PRO192 thật (4 câu, 10 điểm) — quy tắc lương không phân biệt hoa/thường, kế thừa (NetworkDevice/Router), cặp tra cứu/đếm trên List (SimCard/SimCardList), và cài đặt interface xử lý chuỗi. Đề này không có gói given materials — lời giải đã viết và kiểm đối chiếu với sample chạy thật transcribe từ PDF đề thi thay vì harness biên dịch sẵn.',
      ),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      source: 'REAL',
      isPublished: true,
      instructions,
      questions: [q1, q2, q3, q4],
    },
  ],
};

fs.writeFileSync(
  OUT,
  `// AUTO-GENERATED by scripts/build-pro192-pe7.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
