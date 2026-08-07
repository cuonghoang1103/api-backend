/**
 * build-pro192-pe8.mjs — sinh content/exams/PRO192-PE8.mjs.
 *
 * Khác PE Node.js (student viết 1 file/script đọc stdin thuần): PE PRO192
 * thật là NetBeans, mỗi câu 1 project riêng, sinh viên viết class theo UML,
 * given materials có sẵn Main.class (harness tương tác, đã biên dịch, không
 * có nguồn). Phòng thi web không có compiler NetBeans nên câu hỏi PE ở đây
 * cho sinh viên gõ thẳng class vào ô mã, AI chấm theo rubric — expectedOutput
 * hiển thị THAM KHẢO là các sample run THẬT (đã biên dịch cùng Main.class
 * gốc và chạy thật, KHÔNG suy đoán) để sinh viên tự test chéo trên máy của
 * họ nếu muốn (NetBeans + JDK 1.8, xem PRO192 PE INSTRUCTIONS trong `instructions`).
 *
 * Nguồn đã verify: scratchpad pro192-pe/de8/q{0..3} — mỗi thư mục compile
 * xong bằng `javac` cùng Main.class thật của given materials, chạy `java Main`
 * với đúng stdin mẫu trong đề, output khớp 100% với PDF (tất cả 4 câu, không
 * có trang nào thiếu — đề "PE01 - SP 2025", Paper No: 1, 7 trang đủ).
 *
 * Nguồn zip gốc (PE01_PRO192_SP25_150127.zip) đã SẠCH sẵn — không kèm lời
 * giải, chỉ có Main.class (+ IUtilities.class cho Q4) và scaffold NetBeans
 * Q1-Q4. Đóng gói lại y nguyên (không cần sed tên project, đã đúng Q1-Q4),
 * upload R2 PRO192/PE8-Given.zip, verify GET 200.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE8.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/2c89fc57-9aa7-4c2e-8cc0-a484bfb4eb0f/scratchpad/pro192-pe/de8';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE8.mjs');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').trimEnd();

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE8-Given.zip';

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> (transcribed from the real exam paper).</p>
   <ol>
     <li>Software required: NetBeans 8.x or later, JDK 1.8 (Java 8), Notepad, Command Prompt, WinRAR/WinZip with Windows Explorer (File Explorer) on Windows 7 and above. Students are ONLY allowed to use their own study materials (sample code, program examples) stored on their own computer.</li>
     <li>Create a folder to save the given projects (e.g. PRO_given), download the given materials into it. Open NetBeans, open the given Qx project, then complete it according to the exam requirements. Do NOT delete or edit given files, or create a java file with the same name as a given file.</li>
     <li>Before submission: run "Clean and Build Project" (Shift+F11), then rename the folder <strong>dist</strong> to <strong>RUN</strong> (or run). If the RUN folder already exists, delete it before renaming.</li>
     <li>Submission: to submit project Q1, select Question No = 1, browse and select the project folder (e.g. 1, Q1, Q1X...), then click Submit. Do the same for other questions. Do NOT submit the unedited given project.</li>
     <li>Do NOT use accented Vietnamese in code comments. All .java source files use the NetBeans default package. Solutions are marked by automated marking software — using tools other than those allowed is a violation and the exam result will be 0. Do NOT change the names of the folders/files specified in the exam, or the marking software cannot find the executable (.jar) to grade.</li>
   </ol>
   <p>This exam room cannot run NetBeans/JDK in the browser, so you type each class directly into the code box below and it is graded by AI against the rubric — but the "given materials" download above is the REAL given project (with the compiled <code>Main.class</code> harness) so you can build &amp; run it for real on your own machine exactly like the actual PE, and cross-check your output against the samples shown.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> (dịch nguyên văn từ đề thi thật).</p>
   <ol>
     <li>Yêu cầu phần mềm: NetBeans 8.x trở lên, JDK 1.8 (Java 8), Notepad, Command Prompt, WinRAR/WinZip với Windows Explorer (File Explorer) trên Windows 7 trở lên. Sinh viên CHỈ được dùng tài liệu học tập (mã mẫu, ví dụ chương trình) lưu trên máy tính của mình.</li>
     <li>Tạo một thư mục chứa các project given (vd PRO_given), tải given materials vào đó. Mở NetBeans, mở project Qx tương ứng, hoàn thành theo yêu cầu đề bài. KHÔNG xoá/sửa file given, KHÔNG tạo file java trùng tên với file given.</li>
     <li>Trước khi nộp: chạy "Clean and Build Project" (Shift+F11), sau đó đổi tên thư mục <strong>dist</strong> thành <strong>RUN</strong> (hoặc run). Nếu thư mục RUN đã tồn tại, xoá nó trước khi đổi tên.</li>
     <li>Nộp bài: để nộp project Q1, chọn Question No = 1, duyệt và chọn thư mục project (vd 1, Q1, Q1X...), rồi bấm Submit. Làm tương tự cho các câu khác. KHÔNG nộp project given chưa chỉnh sửa.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment code. Mọi file nguồn .java dùng package mặc định của NetBeans. Bài làm được chấm bằng phần mềm chấm tự động — dùng công cụ ngoài danh sách cho phép sẽ bị coi là vi phạm, kết quả 0 điểm. KHÔNG đổi tên các thư mục/file đã quy định trong đề, nếu không phần mềm chấm sẽ không tìm thấy file thực thi (.jar) để chấm.</li>
   </ol>
   <p>Phòng thi web không chạy được NetBeans/JDK trực tiếp trên trình duyệt, nên bạn gõ thẳng từng class vào ô mã bên dưới và được AI chấm theo tiêu chí — nhưng file "given materials" tải ở trên là project given THẬT (kèm harness <code>Main.class</code> đã biên dịch sẵn) để bạn có thể build &amp; chạy thật trên máy mình y hệt bài thi thật, và tự đối chiếu kết quả với các mẫu bên dưới.</p>`,
);

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ── Q1: Suitcase ──
const q1PromptEn = `<p><strong>(2 marks)</strong> Do not pay attention to real meaning of objects, variables and their values in the questions below.</p>
<p>Write a class <strong>Suitcase</strong> (in the default package of the NetBean) with the following information:</p>
${table([
  '-id: int<br/>-name: String<br/>-capacity: double<br/>-maxWeight: int',
  '+Suitcase()<br/>+Suitcase(id:int, name:String, capacity:double, maxWeight:int)<br/>+getters &amp; setters<br/>+expandSuitcase():double<br/>+toString():String',
])}
<p>Where:</p>
<ul>
  <li><code>Suitcase()</code> — default constructor.</li>
  <li><code>Suitcase(id:int, name:String, capacity:double, maxWeight:int)</code> — parameterized constructor that sets values for id, name, capacity, and maxWeight.</li>
  <li>getters &amp; setters: write the setters and getters of the fields.</li>
  <li><code>expandSuitcase():double</code> — return the new capacity (NC) by increasing the suitcase's capacity based on its maxWeight:
    <ul>
      <li>If maxWeight is &gt;= 15, NC = capacity + 5</li>
      <li>If 7 &lt; maxWeight &lt; 15, NC = capacity + 2</li>
      <li>If maxWeight is &lt;= 7, NC = capacity + 0</li>
    </ul>
  </li>
  <li><code>toString(): String</code> — return a string format containing all the information of the Suitcase: id, name, capacity, maxWeight. The capacity is formatted in two decimal places, the name in uppercase format.</li>
</ul>
<p><em>Do not format the result.</em></p>`;
const q1PromptVi = `<p><strong>(2 điểm)</strong> Bỏ qua ý nghĩa thực tế của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</p>
<p>Viết lớp <strong>Suitcase</strong> (trong package mặc định của NetBean) với thông tin sau:</p>
${table([
  '-id: int<br/>-name: String<br/>-capacity: double<br/>-maxWeight: int',
  '+Suitcase()<br/>+Suitcase(id:int, name:String, capacity:double, maxWeight:int)<br/>+getters &amp; setters<br/>+expandSuitcase():double<br/>+toString():String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Suitcase()</code> — constructor mặc định.</li>
  <li><code>Suitcase(id:int, name:String, capacity:double, maxWeight:int)</code> — constructor có tham số, gán giá trị cho id, name, capacity và maxWeight.</li>
  <li>getters &amp; setters: viết setter và getter cho các field.</li>
  <li><code>expandSuitcase():double</code> — trả về capacity mới (NC) bằng cách tăng capacity của vali dựa trên maxWeight:
    <ul>
      <li>Nếu maxWeight &gt;= 15, NC = capacity + 5</li>
      <li>Nếu 7 &lt; maxWeight &lt; 15, NC = capacity + 2</li>
      <li>Nếu maxWeight &lt;= 7, NC = capacity + 0</li>
    </ul>
  </li>
  <li><code>toString(): String</code> — trả về chuỗi chứa đầy đủ thông tin Suitcase: id, name, capacity, maxWeight. Capacity định dạng 2 chữ số thập phân, name dạng chữ HOA.</li>
</ul>
<p><em>Không định dạng lại kết quả.</em></p>`;

const q1ExplainEn = `<p>The three <code>maxWeight</code> bands are mutually exclusive and must be checked in this order (or equivalent): &gt;=15 first, then &gt;7, else the &lt;=7 fallback — otherwise a boundary value like maxWeight=15 falls into the wrong bracket. <code>toString()</code> joins the four fields with ", " in the exact order id, name (UPPERCASE), capacity (2 decimals), maxWeight — verified against the real given <code>Main.class</code>, which prints <code>toString()</code> directly (no extra formatting on the harness side).</p>
<p>Verified against all 4 given samples by compiling <code>Suitcase.java</code> with the real given <code>Main.class</code>:</p>
<pre>id=1 name=Mia capacity=6 maxWeight=6 → TC1 (expandSuitcase, maxWeight&lt;=7)
OUTPUT:
6.00

id=1 name=Mia capacity=8 maxWeight=9 → TC1 (expandSuitcase, 7&lt;maxWeight&lt;15)
OUTPUT:
10.00

id=1 name=Mia capacity=10 maxWeight=16 → TC1 (expandSuitcase, maxWeight&gt;=15)
OUTPUT:
15.00

id=1 name=Mia capacity=10 maxWeight=16 → TC2 (toString)
OUTPUT:
1, MIA, 10.00, 16</pre>`;
const q1ExplainVi = `<p>3 khoảng <code>maxWeight</code> loại trừ nhau, phải kiểm theo đúng thứ tự (hoặc tương đương): &gt;=15 trước, rồi &gt;7, còn lại rơi vào nhánh &lt;=7 — nếu không giá trị biên như maxWeight=15 sẽ rơi nhầm nhánh. <code>toString()</code> nối 4 field bằng ", " đúng thứ tự id, name (HOA), capacity (2 chữ số thập phân), maxWeight — đã kiểm với <code>Main.class</code> given thật, harness in thẳng <code>toString()</code> không định dạng thêm.</p>
<p>Đã đối chiếu với cả 4 mẫu trong đề bằng cách biên dịch <code>Suitcase.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>id=1 name=Mia capacity=6 maxWeight=6 → TC1 (expandSuitcase, maxWeight&lt;=7)
OUTPUT:
6.00

id=1 name=Mia capacity=8 maxWeight=9 → TC1 (expandSuitcase, 7&lt;maxWeight&lt;15)
OUTPUT:
10.00

id=1 name=Mia capacity=10 maxWeight=16 → TC1 (expandSuitcase, maxWeight&gt;=15)
OUTPUT:
15.00

id=1 name=Mia capacity=10 maxWeight=16 → TC2 (toString)
OUTPUT:
1, MIA, 10.00, 16</pre>`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `public class Suitcase {
    private int id;
    private String name;
    private double capacity;
    private int maxWeight;

    public Suitcase() {
        // TODO
    }

    public Suitcase(int id, String name, double capacity, int maxWeight) {
        // TODO
    }

    // TODO: getters & setters for all 4 fields

    public double expandSuitcase() {
        // TODO: NC based on maxWeight (>=15: +5, 7<maxWeight<15: +2, <=7: +0)
        return 0;
    }

    @Override
    public String toString() {
        // TODO: "id, NAME, capacity(2dp), maxWeight"
        return null;
    }
}`,
  sampleSolution: read('q0/material_0/src/Suitcase.java'),
  expectedOutput:
`Sample run 1 (TC 1 — expandSuitcase, id=1 name=Mia capacity=6 maxWeight=6, <=7):
OUTPUT:
6.00

Sample run 2 (TC 1 — expandSuitcase, id=1 name=Mia capacity=8 maxWeight=9, 7<maxWeight<15):
OUTPUT:
10.00

Sample run 3 (TC 1 — expandSuitcase, id=1 name=Mia capacity=10 maxWeight=16, >=15):
OUTPUT:
15.00

Sample run 4 (TC 2 — toString, id=1 name=Mia capacity=10 maxWeight=16):
OUTPUT:
1, MIA, 10.00, 16`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'ctor', criterion: B('Both constructors set all 4 fields correctly; getters/setters are correct.', 'Cả 2 constructor gán đúng cả 4 field; getter/setter đúng.'), weight: 1, maxScore: 0.5 },
    { id: 'expandSuitcase', criterion: B('expandSuitcase() applies the 3 maxWeight bands correctly, including boundary values.', 'expandSuitcase() áp đúng 3 khoảng maxWeight, kể cả giá trị biên.'), weight: 1, maxScore: 1 },
    { id: 'toString', criterion: B('toString() joins id, uppercase name, capacity (2 decimals), maxWeight with ", ".', 'toString() nối id, name HOA, capacity (2 chữ số thập phân), maxWeight bằng ", ".'), weight: 1, maxScore: 0.5 },
  ],
};

// ── Q2: Employee + Professor ──
const q2PromptEn = `<p><strong>(3 marks)</strong> Write a class named <strong>Employee</strong> and a class named <strong>Professor</strong> extended from <strong>Employee</strong> (i.e. Employee is the super class and Professor is the subclass) with the following information:</p>
${table([
  '-id:int<br/>-name: String<br/>-standardSalary: double',
  '+Employee()<br/>+Employee(id:int, name:String, standardSalary:double)<br/>+getId():int<br/>+getName():String<br/>+getStandardSalary():double',
])}
<p>Where:</p>
<ul>
  <li><code>Employee()</code> — default constructor.</li>
  <li><code>Employee(id:int,name: String, standardSalary: double)</code> — parameterized constructor, which sets the value to the id, name and standardSalary of the employee.</li>
  <li><code>getId ()</code>: int — return the id of the employee.</li>
  <li><code>getName ()</code>: String — return the name of the employee in <strong>uppercase</strong>.</li>
  <li><code>getStandardSalary ()</code>: double — return the standard salary of the employee.</li>
</ul>
${table([
  '-department: String',
  '+Professor(id:int, name: String, standardSalary: double, department:String)<br/>+getDepartment():String<br/>+calculateActualSalary(): double<br/>+toString():String',
])}
<p>Where:</p>
<ul>
  <li><code>Professor()</code> — default constructor.</li>
  <li><code>Professor(id:int, name: String, standardSalary: double, department:String)</code> — parameterized constructor, which sets the value to the id, name, standardSalary and department of the Professor.</li>
  <li><code>getDepartment ()</code>: String — return the department of the Professor in <strong>uppercase</strong>.</li>
  <li><code>calculateActualSalary()</code>: double — returns the actual salary of the Professor according to the formula: actualSalary = standardSalary * K (default K = 1.0)
    <ul>
      <li>If department is "GD" or "gd", K = 1.5</li>
      <li>If department is "IT" or "it", K = 2.0</li>
    </ul>
  </li>
  <li><code>toString()</code>: String — return a string format that contains all the information of the Professor: id, name, department, actualSalary. The actual salary is formatted with two decimal places and the name and department in uppercase.</li>
</ul>`;
const q2PromptVi = `<p><strong>(3 điểm)</strong> Viết lớp tên <strong>Employee</strong> và lớp tên <strong>Professor</strong> kế thừa từ <strong>Employee</strong> (Employee là lớp cha, Professor là lớp con), thông tin như sau:</p>
${table([
  '-id:int<br/>-name: String<br/>-standardSalary: double',
  '+Employee()<br/>+Employee(id:int, name:String, standardSalary:double)<br/>+getId():int<br/>+getName():String<br/>+getStandardSalary():double',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Employee()</code> — constructor mặc định.</li>
  <li><code>Employee(id:int,name: String, standardSalary: double)</code> — constructor có tham số, gán giá trị cho id, name và standardSalary của employee.</li>
  <li><code>getId ()</code>: int — trả về id của employee.</li>
  <li><code>getName ()</code>: String — trả về name của employee dạng <strong>chữ HOA</strong>.</li>
  <li><code>getStandardSalary ()</code>: double — trả về standardSalary của employee.</li>
</ul>
${table([
  '-department: String',
  '+Professor(id:int, name: String, standardSalary: double, department:String)<br/>+getDepartment():String<br/>+calculateActualSalary(): double<br/>+toString():String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Professor()</code> — constructor mặc định.</li>
  <li><code>Professor(id:int, name: String, standardSalary: double, department:String)</code> — constructor có tham số, gán giá trị cho id, name, standardSalary và department của Professor.</li>
  <li><code>getDepartment ()</code>: String — trả về department của Professor dạng <strong>chữ HOA</strong>.</li>
  <li><code>calculateActualSalary()</code>: double — trả về lương thực nhận của Professor theo công thức: actualSalary = standardSalary * K (mặc định K = 1.0)
    <ul>
      <li>Nếu department là "GD" hoặc "gd", K = 1.5</li>
      <li>Nếu department là "IT" hoặc "it", K = 2.0</li>
    </ul>
  </li>
  <li><code>toString()</code>: String — trả về chuỗi chứa đầy đủ thông tin Professor: id, name, department, actualSalary. actualSalary định dạng 2 chữ số thập phân, name và department dạng chữ HOA.</li>
</ul>`;

const q2ExplainEn = `<p><code>getName()</code> on <strong>Employee</strong> already uppercases — <code>Professor.toString()</code> should reuse it (and reuse <code>getDepartment()</code>, which also uppercases) rather than re-uppercasing manually, since <code>Professor</code> extends <code>Employee</code>. <code>calculateActualSalary()</code> only checks "GD"/"IT" case-insensitively; any other department (e.g. "HR") falls through to the default K=1.0 — the spec never says K=1.0 is only for a specific department, it's the fallback for everything else. Verified via decompiling the real given <code>Main.class</code>: it constructs a <code>Professor</code> directly (never plain <code>Employee</code>) and calls <code>calculateActualSalary()</code> / <code>toString()</code> on it, printing <code>toString()</code> with <code>print</code> (no trailing newline added by the harness).</p>
<p>Verified against all 3 given samples by compiling <code>Employee.java</code> + <code>Professor.java</code> with the real given <code>Main.class</code>:</p>
<pre>id=1 name=David standardSalary=5000 department=IT → TC1 (calculateActualSalary, K=2.0)
OUTPUT:
10000.00

id=1 name=David standardSalary=5000 department=HR → TC1 (calculateActualSalary, K=1.0 default)
OUTPUT:
5000.00

id=1 name=david standardSalary=5000 department=gd → TC2 (toString, K=1.5)
OUTPUT:
1, DAVID, GD, 7500.00</pre>`;
const q2ExplainVi = `<p><code>getName()</code> ở <strong>Employee</strong> đã viết hoa sẵn — <code>Professor.toString()</code> nên dùng lại nó (và dùng lại <code>getDepartment()</code>, cũng đã viết hoa) thay vì tự viết hoa lại thủ công, vì <code>Professor</code> kế thừa <code>Employee</code>. <code>calculateActualSalary()</code> chỉ kiểm "GD"/"IT" không phân biệt hoa/thường; department khác (vd "HR") rơi vào K=1.0 mặc định — đề không nói K=1.0 chỉ dành riêng cho 1 department nào, đó là giá trị mặc định cho mọi trường hợp còn lại. Đã xác nhận qua decompile <code>Main.class</code> given thật: nó khởi tạo trực tiếp <code>Professor</code> (không bao giờ dùng <code>Employee</code> trơn) rồi gọi <code>calculateActualSalary()</code> / <code>toString()</code> trên đó, in <code>toString()</code> bằng <code>print</code> (harness không tự thêm dòng mới).</p>
<p>Đã đối chiếu với cả 3 mẫu trong đề bằng cách biên dịch <code>Employee.java</code> + <code>Professor.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>id=1 name=David standardSalary=5000 department=IT → TC1 (calculateActualSalary, K=2.0)
OUTPUT:
10000.00

id=1 name=David standardSalary=5000 department=HR → TC1 (calculateActualSalary, K=1.0 mặc định)
OUTPUT:
5000.00

id=1 name=david standardSalary=5000 department=gd → TC2 (toString, K=1.5)
OUTPUT:
1, DAVID, GD, 7500.00</pre>`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `public class Employee {
    private int id;
    private String name;
    private double standardSalary;
    // TODO: Employee(), Employee(id, name, standardSalary),
    // getId, getName (uppercase), getStandardSalary
}

class Professor extends Employee {
    private String department;
    // TODO: Professor(), Professor(id, name, standardSalary, department),
    // getDepartment() (uppercase),
    // calculateActualSalary() (standardSalary * K; GD/gd->1.5, IT/it->2.0, else 1.0),
    // toString() ("id, NAME, DEPARTMENT, actualSalary(2dp)")
}`,
  sampleSolution: `${read('q1/material_1/src/Employee.java')}\n\n${read('q1/material_1/src/Professor.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — calculateActualSalary, id=1 name=David standardSalary=5000 department=IT):
OUTPUT:
10000.00

Sample run 2 (TC 1 — calculateActualSalary, id=1 name=David standardSalary=5000 department=HR):
OUTPUT:
5000.00

Sample run 3 (TC 2 — toString, id=1 name=david standardSalary=5000 department=gd):
OUTPUT:
1, DAVID, GD, 7500.00`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'ctor_getters', criterion: B('Both constructors work; Employee.getName() and Professor.getDepartment() both uppercase correctly.', 'Cả 2 constructor đúng; Employee.getName() và Professor.getDepartment() đều viết hoa đúng.'), weight: 1, maxScore: 1 },
    { id: 'calculateActualSalary', criterion: B('calculateActualSalary() applies K=1.5 for GD/gd, K=2.0 for IT/it (case-insensitive), K=1.0 otherwise.', 'calculateActualSalary() áp K=1.5 cho GD/gd, K=2.0 cho IT/it (không phân biệt hoa/thường), K=1.0 cho trường hợp còn lại.'), weight: 2, maxScore: 1.5 },
    { id: 'toString', criterion: B('toString() joins id, uppercase name, uppercase department, actualSalary (2 decimals) with ", ".', 'toString() nối id, name HOA, department HOA, actualSalary (2 chữ số thập phân) bằng ", ".'), weight: 1, maxScore: 0.5 },
  ],
};

// ── Q3: Watch + WatchList extends ArrayList<Watch> ──
const q3PromptEn = `<p><strong>(2 marks)</strong> Write a class named <strong>Watch</strong> with the following information:</p>
${table([
  '- id : int<br/>- brand : String<br/>- model : String<br/>- price : double',
  '+Watch()<br/>+Watch(id: int, brand: String, model : String, price: double)<br/>+setters &amp; getters<br/>+toString():String',
])}
<p>Where:</p>
<ul>
  <li><code>Watch()</code> — default constructor.</li>
  <li><code>Watch(id: int, brand: String, model : String, price: double)</code> — parameterized constructor, which sets values to id, brand, model and price.</li>
  <li>setters &amp; getters: write the setters and getters of all the fields.</li>
  <li><code>toString():String</code> — return a string format that contains all the information of the watch: id, brand, model, price. The price is formatted to two decimal places.</li>
</ul>
<p>Write a class <strong>WatchList</strong> which extends from <strong>ArrayList</strong> (ArrayList is a collection) with the following information:</p>
${table([
  '+ addWatch(watch: Watch):void<br/>+ filterByBrand(value : String): WatchList<br/>+ findMostExpensive(): Watch',
])}
<p>Where:</p>
<ul>
  <li><code>addWatch(watch: Watch):void</code> — add a new watch to the WatchList collection.</li>
  <li><code>filterByBrand(value : String): WatchList</code> — return a list of watches that the brand is equal to the value if found, otherwise return <strong>null</strong>. The string comparison is case-insensitive.</li>
  <li><code>findMostExpensive(): Watch</code> — return the watch with the highest price in the list. Suppose in the list there is only one watch with the highest price.</li>
</ul>
<p><strong>Hints</strong>: to declare the WatchList class, you can use the following statement:</p>
<pre>public class WatchList extends ArrayList&lt;Watch&gt; {
    //...
}</pre>`;
const q3PromptVi = `<p><strong>(2 điểm)</strong> Viết lớp tên <strong>Watch</strong> với thông tin sau:</p>
${table([
  '- id : int<br/>- brand : String<br/>- model : String<br/>- price : double',
  '+Watch()<br/>+Watch(id: int, brand: String, model : String, price: double)<br/>+setters &amp; getters<br/>+toString():String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Watch()</code> — constructor mặc định.</li>
  <li><code>Watch(id: int, brand: String, model : String, price: double)</code> — constructor có tham số, gán giá trị cho id, brand, model và price.</li>
  <li>setters &amp; getters: viết setter và getter cho tất cả field.</li>
  <li><code>toString():String</code> — trả về chuỗi chứa đầy đủ thông tin watch: id, brand, model, price. Price định dạng 2 chữ số thập phân.</li>
</ul>
<p>Viết lớp <strong>WatchList</strong> kế thừa từ <strong>ArrayList</strong> (ArrayList là 1 collection) với thông tin sau:</p>
${table([
  '+ addWatch(watch: Watch):void<br/>+ filterByBrand(value : String): WatchList<br/>+ findMostExpensive(): Watch',
])}
<p>Trong đó:</p>
<ul>
  <li><code>addWatch(watch: Watch):void</code> — thêm 1 watch mới vào collection WatchList.</li>
  <li><code>filterByBrand(value : String): WatchList</code> — trả về danh sách các watch có brand bằng value nếu tìm thấy, ngược lại trả về <strong>null</strong>. So sánh chuỗi không phân biệt hoa/thường.</li>
  <li><code>findMostExpensive(): Watch</code> — trả về watch có price cao nhất trong danh sách. Giả sử trong danh sách chỉ có 1 watch có price cao nhất.</li>
</ul>
<p><strong>Gợi ý</strong>: để khai báo lớp WatchList, bạn có thể dùng câu lệnh sau:</p>
<pre>public class WatchList extends ArrayList&lt;Watch&gt; {
    //...
}</pre>`;

const q3ExplainEn = `<p><code>Watch.toString()</code> does NOT uppercase brand/model (unlike Q1/Q2's uppercase-heavy classes) — it prints the fields exactly as stored, e.g. "5, rolex, Datejust, 10000.45" keeps the lowercase "rolex" from input. Confirmed by decompiling the real given <code>Main.class</code>: it just calls <code>watch.toString()</code> and prints it, no extra transformation.</p>
<p><code>filterByBrand()</code> must return <code>null</code> (not an empty list) when nothing matches — the harness checks for null and prints "N/A" itself; returning an empty <code>WatchList</code> instead would break that branch. The initial 4 watches are hardcoded by the harness (id 1 Rolex Submariner 7500.00, id 2 Omega Speedmaster 5000.00, id 3 Seiko Prospex 300.00, id 6 Rolex Daytona 13500.00, added via your own <code>addWatch()</code>/<code>add()</code>), then one more watch is read from input before running the test — so results below include that extra watch.</p>
<p>Verified against all 3 given samples by compiling <code>Watch.java</code> + <code>WatchList.java</code> with the real given <code>Main.class</code>:</p>
<pre>+ added id=5 brand=rolex model=Datejust price=10000.45 → TC1 (filterByBrand "rolex")
OUTPUT:
1, Rolex, Submariner, 7500.00
6, Rolex, Daytona, 13500.00
5, rolex, Datejust, 10000.45

+ added id=5 brand=casio model=gshock price=20000 → TC2 (findMostExpensive)
OUTPUT:
5, casio, gshock, 20000.00

+ added id=7 brand=seiko model=Astron price=7000 → TC1 (filterByBrand "tissot", no match)
OUTPUT:
N/A</pre>`;
const q3ExplainVi = `<p><code>Watch.toString()</code> KHÔNG viết hoa brand/model (khác các lớp hay viết hoa ở Q1/Q2) — in đúng nguyên trạng field đã lưu, vd "5, rolex, Datejust, 10000.45" giữ nguyên "rolex" chữ thường từ input. Đã xác nhận qua decompile <code>Main.class</code> given thật: nó chỉ gọi <code>watch.toString()</code> rồi in ra, không biến đổi gì thêm.</p>
<p><code>filterByBrand()</code> phải trả về <code>null</code> (không phải danh sách rỗng) khi không có gì khớp — harness tự kiểm null rồi in "N/A"; trả về <code>WatchList</code> rỗng thay vì null sẽ làm sai nhánh này. 4 watch ban đầu do harness tạo sẵn (id 1 Rolex Submariner 7500.00, id 2 Omega Speedmaster 5000.00, id 3 Seiko Prospex 300.00, id 6 Rolex Daytona 13500.00, thêm qua <code>addWatch()</code>/<code>add()</code> của bạn), sau đó đọc thêm 1 watch từ input rồi mới chạy test — nên kết quả dưới đây đã gồm watch thêm vào.</p>
<p>Đã đối chiếu với cả 3 mẫu trong đề bằng cách biên dịch <code>Watch.java</code> + <code>WatchList.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>+ thêm id=5 brand=rolex model=Datejust price=10000.45 → TC1 (filterByBrand "rolex")
OUTPUT:
1, Rolex, Submariner, 7500.00
6, Rolex, Daytona, 13500.00
5, rolex, Datejust, 10000.45

+ thêm id=5 brand=casio model=gshock price=20000 → TC2 (findMostExpensive)
OUTPUT:
5, casio, gshock, 20000.00

+ thêm id=7 brand=seiko model=Astron price=7000 → TC1 (filterByBrand "tissot", không khớp)
OUTPUT:
N/A</pre>`;

const q3 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `import java.util.ArrayList;

public class Watch {
    private int id;
    private String brand;
    private String model;
    private double price;
    // TODO: Watch(), Watch(id, brand, model, price), setters & getters,
    // toString() ("id, brand, model, price(2dp)")
}

class WatchList extends ArrayList<Watch> {
    // TODO: addWatch, filterByBrand (case-insensitive, null if no match), findMostExpensive
}`,
  sampleSolution: `${read('q2/material_2/src/Watch.java')}\n\n${read('q2/material_2/src/WatchList.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — filterByBrand("rolex"), list + added 5,rolex,Datejust,10000.45):
OUTPUT:
1, Rolex, Submariner, 7500.00
6, Rolex, Daytona, 13500.00
5, rolex, Datejust, 10000.45

Sample run 2 (TC 2 — findMostExpensive, list + added 5,casio,gshock,20000):
OUTPUT:
5, casio, gshock, 20000.00

Sample run 3 (TC 1 — filterByBrand("tissot"), no match, list + added 7,seiko,Astron,7000):
OUTPUT:
N/A`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'toString', criterion: B('Watch.toString() joins id, brand, model, price (2 decimals) with ", " — no uppercasing.', 'Watch.toString() nối id, brand, model, price (2 chữ số thập phân) bằng ", " — không viết hoa.'), weight: 1, maxScore: 0.5 },
    { id: 'filterByBrand', criterion: B('filterByBrand() is case-insensitive and returns null (not an empty list) when nothing matches.', 'filterByBrand() không phân biệt hoa/thường, trả về null (không phải danh sách rỗng) khi không khớp.'), weight: 1, maxScore: 1 },
    { id: 'findMostExpensive', criterion: B('findMostExpensive() returns the actual Watch object with the highest price.', 'findMostExpensive() trả về đúng object Watch có price cao nhất.'), weight: 1, maxScore: 0.5 },
  ],
};

// ── Q4: MyUtilities implements IUtilities ──
const IUTILITIES_SRC = `public interface IUtilities {
    public int getLengthOfLongestWord(String sentence);
    public double calculateAverageValue(String str);
}`;

const q4PromptEn = `<p><strong>(3 marks)</strong> The interface <strong>IUtilities</strong> below is already given in Java code format, thus you can use it without creating an IUtilities .java file:</p>
<pre>${IUTILITIES_SRC}</pre>
<p>Write a class named <strong>MyUtilities</strong>, which implements the interface <strong>IUtilities</strong>. The class MyUtilities implements all methods in IUtilities as below:</p>
<ul>
  <li><code>getLengthOfLongestWord(sentence: String): int</code> — return the length of the longest word (the word with the most characters) in the string sentence. Suppose a sentence consists of words separated by a space.</li>
  <li><code>calculateAverageValue(str: String): double</code> — return the average of even digits in the string str.</li>
</ul>`;
const q4PromptVi = `<p><strong>(3 điểm)</strong> Interface <strong>IUtilities</strong> dưới đây đã được cho sẵn dạng mã Java, bạn dùng thẳng không cần tạo file IUtilities.java:</p>
<pre>${IUTILITIES_SRC}</pre>
<p>Viết lớp tên <strong>MyUtilities</strong>, implement interface <strong>IUtilities</strong>. Lớp MyUtilities cài đặt tất cả các hàm trong IUtilities như sau:</p>
<ul>
  <li><code>getLengthOfLongestWord(sentence: String): int</code> — trả về độ dài của từ dài nhất (từ có nhiều ký tự nhất) trong chuỗi sentence. Giả sử sentence gồm các từ ngăn cách nhau bằng 1 khoảng trắng.</li>
  <li><code>calculateAverageValue(str: String): double</code> — trả về trung bình cộng các chữ số chẵn trong chuỗi str.</li>
</ul>`;

const q4ExplainEn = `<p><code>calculateAverageValue()</code> scans EVERY character of <code>str</code> for digit characters (0-9), not just isolated numbers — in "abc123@56#" the digits present are 1,2,3,5,6; the even ones are 2 and 6, so the average is (2+6)/2 = 4.00. Letters and symbols are simply skipped, not treated as zero. <code>getLengthOfLongestWord()</code> just needs <code>String.split(" ")</code> and a max-length scan; ties (multiple words sharing the max length) still just return that length, e.g. "hello world" — both 5 letters — returns 5.</p>
<p>Verified against both given samples by compiling <code>MyUtilities.java</code> with the real given <code>Main.class</code>:</p>
<pre>getLengthOfLongestWord("hello world") → 5
calculateAverageValue("abc123@56#") → 4.00   (even digits 2, 6 → avg 4.00)</pre>`;
const q4ExplainVi = `<p><code>calculateAverageValue()</code> quét TỪNG ký tự trong <code>str</code> để tìm chữ số (0-9), không chỉ số đứng riêng — trong "abc123@56#" các chữ số có là 1,2,3,5,6; chữ số chẵn là 2 và 6, nên trung bình = (2+6)/2 = 4.00. Chữ cái và ký hiệu bị bỏ qua hoàn toàn, không tính là 0. <code>getLengthOfLongestWord()</code> chỉ cần <code>String.split(" ")</code> rồi quét tìm độ dài lớn nhất; nếu có nhiều từ cùng chia độ dài lớn nhất thì vẫn trả về đúng độ dài đó, vd "hello world" — cả 2 đều 5 ký tự — trả về 5.</p>
<p>Đã đối chiếu với cả 2 mẫu trong đề bằng cách biên dịch <code>MyUtilities.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>getLengthOfLongestWord("hello world") → 5
calculateAverageValue("abc123@56#") → 4.00   (chữ số chẵn 2, 6 → tb 4.00)</pre>`;

const q4 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `${IUTILITIES_SRC}

public class MyUtilities implements IUtilities {
    // TODO: getLengthOfLongestWord, calculateAverageValue
}`,
  sampleSolution: read('q3/material_3/src/MyUtilities.java'),
  expectedOutput:
`Sample run 1 (TC 1 — getLengthOfLongestWord, input: "hello world"):
OUTPUT:
5

Sample run 2 (TC 2 — calculateAverageValue, input: "abc123@56#"):
OUTPUT:
4.00`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'getLengthOfLongestWord', criterion: B('getLengthOfLongestWord() splits on spaces and returns the length of the longest word.', 'getLengthOfLongestWord() tách theo khoảng trắng, trả về độ dài từ dài nhất.'), weight: 1, maxScore: 1.5 },
    { id: 'calculateAverageValue', criterion: B('calculateAverageValue() scans all characters for digits and averages only the even ones.', 'calculateAverageValue() quét mọi ký tự tìm chữ số, chỉ lấy trung bình các chữ số chẵn.'), weight: 1, maxScore: 1.5 },
  ],
};

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE8-SP25-P1',
      title: B('PRO192 — Practical Exam Đề 8 (SP25, Paper 1)', 'PRO192 — Đề thi thực hành số 8 (SP25, Paper 1)'),
      description: B(
        'Real PRO192 PE paper (4 questions, 10 marks) — OOP class design (encapsulation, inheritance, uppercase-formatted getters, toString formatting), one class extending ArrayList<T>, one interface implementation over Strings. Solutions written & verified by compiling against the real given Main.class harness.',
        'Đề PE PRO192 thật (4 câu, 10 điểm) — thiết kế lớp OOP (đóng gói, kế thừa, getter viết hoa, định dạng toString), một lớp kế thừa ArrayList<T>, một interface cài đặt trên String. Lời giải đã viết và kiểm bằng cách biên dịch cùng harness Main.class given thật.',
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
  `// AUTO-GENERATED by scripts/build-pro192-pe8.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
