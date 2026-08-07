/**
 * build-pro192-pe2.mjs — sinh content/exams/PRO192-PE2.mjs.
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
 * Nguồn đã verify: scratchpad pro192-pe/de2/q{0..3} — mỗi thư mục compile
 * xong bằng `javac` cùng Main.class thật của given materials, chạy `java Main`
 * với đúng stdin mẫu trong đề, output khớp với ảnh scan đề.
 *
 * Given materials nguồn (rar) đã SẠCH sẵn (chỉ Main.class + interface .class +
 * scaffold NetBeans, không có lời giải rò rỉ) — chỉ thiếu Q2's manifest.mf
 * (bị rơi khỏi rar gốc dù project.properties có tham chiếu `manifest.file=
 * manifest.mf`), đã bù bằng manifest.mf giống hệt nội dung của Q1/Q3/Q4 (file
 * generic NetBeans, không chứa gì đặc thù đề). Đã sanity-check bằng cách chép
 * lời giải Q3 vào bản clean, javac+java chạy đúng, rồi xoá lại. Zip 43 file,
 * upload R2 PRO192/PE2-Given.zip, verify GET 200.
 *
 * Ghi chú spec Q2 (Employee/Manager, setData): ảnh scan đề bị nhảy số trang
 * ("... " giữa trang mô tả field/method của Manager và trang liệt kê "Where:"
 * cho toString()/setData() — chỉ còn bullet getValue() lộ ra được), tương tự
 * lỗi đã gặp ở Đề 4 Q3. KHÔNG suy đoán mù: đã dựng giả thuyết "setData() thay
 * ký tự thứ 3 của name bằng chuỗi KK" từ đúng 1 cặp input/output mẫu còn sót
 * trong đề (name "Harry" -> "HaKKry"), rồi verify bằng cách biên dịch cùng
 * Main.class given THẬT và so khớp — ra đúng "HaKKry,300,hr" như mẫu. Format
 * toString() của Manager ("name,salary,department") suy ra từ đối xứng với
 * Manager của Q3 (đề hiển thị đầy đủ "name,salary,department" ở đó) và đã
 * verify khớp luôn qua harness thật. Ghi rõ trong explanation Q2 để sinh viên
 * biết đây là phần đã phục dựng có kiểm chứng, không phải nguyên văn đề.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE2.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/2c89fc57-9aa7-4c2e-8cc0-a484bfb4eb0f/scratchpad/pro192-pe/de2';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE2.mjs');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').trimEnd();

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE2-Given.zip';

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> (transcribed from the real exam paper).</p>
   <ol>
     <li>Students are ONLY allowed to use: materials on their own computer (including JDK, NetBeans...); for distance learning: Google Meet/Hangout (for exam monitoring purpose only).</li>
     <li>For each question: do NOT create a new project — use the given project and modify it per the question's requirements. Do NOT delete given file(s) or create file(s) with the same name as them. Do NOT use a package in your code (default package only). You CAN create more classes/interfaces/methods/variables if needed.</li>
     <li><strong>Submission</strong> is performed by project: each time only one project is submitted. Just before submission, run "Clean and Build Project" to generate the dist folder (contains the .jar file). If a project is submitted incorrectly, it gets ZERO.</li>
   </ol>
   <p>This exam room cannot run NetBeans/JDK in the browser, so you type each class directly into the code box below and it is graded by AI against the rubric — but the "given materials" download above is the REAL given project (with the compiled <code>Main.class</code> harness) so you can build &amp; run it for real on your own machine exactly like the actual PE, and cross-check your output against the samples shown.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> (dịch nguyên văn từ đề thi thật).</p>
   <ol>
     <li>Sinh viên CHỈ được dùng: tài liệu trên máy tính của mình (gồm JDK, NetBeans...); nếu học từ xa: Google Meet/Hangout (chỉ để giám sát thi).</li>
     <li>Với mỗi câu: KHÔNG tạo project mới — dùng project given rồi sửa theo yêu cầu đề. KHÔNG xoá file given hay tạo file trùng tên với file given. KHÔNG dùng package trong code (chỉ package mặc định). CÓ THỂ tạo thêm class/interface/method/biến nếu cần.</li>
     <li><strong>Nộp bài</strong> theo từng project: mỗi lần chỉ nộp 1 project. Trước khi nộp phải chạy "Clean and Build Project" để sinh thư mục dist (chứa file .jar). Nộp sai sẽ bị 0 điểm.</li>
   </ol>
   <p>Phòng thi web không chạy được NetBeans/JDK trực tiếp trên trình duyệt, nên bạn gõ thẳng từng class vào ô mã bên dưới và được AI chấm theo tiêu chí — nhưng file "given materials" tải ở trên là project given THẬT (kèm harness <code>Main.class</code> đã biên dịch sẵn) để bạn có thể build &amp; chạy thật trên máy mình y hệt bài thi thật, và tự đối chiếu kết quả với các mẫu bên dưới.</p>`,
);

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ── Q1: Book ──
const q1PromptEn = `<p><strong>(2 marks)</strong> Do not pay attention to real meaning of objects, variables and their values in the questions below.</p>
<p>Write a class <strong>Book</strong> (in the default package of the NetBean) with the following information:</p>
${table([
  '-title: String<br/>-pages: int',
  '+Book()<br/>+Book(title: String, pages: int)<br/>+getTitle(): String<br/>+getPages(): int<br/>+setPages(pages: int): void',
])}
<p>Where:</p>
<ul>
  <li><code>Book()</code> — default constructor.</li>
  <li><code>Book(title: String, pages: int)</code> — constructor, which sets values to title and pages.</li>
  <li><code>getTitle(): String</code> — return title in <strong>uppercase</strong> format.</li>
  <li><code>getPages(): int</code> — return pages / 2.</li>
  <li><code>setPages(pages: int): void</code> — update pages.</li>
</ul>
<p><em>Do not format the result.</em></p>`;
const q1PromptVi = `<p><strong>(2 điểm)</strong> Bỏ qua ý nghĩa thực tế của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</p>
<p>Viết lớp <strong>Book</strong> (trong package mặc định của NetBean) với thông tin sau:</p>
${table([
  '-title: String<br/>-pages: int',
  '+Book()<br/>+Book(title: String, pages: int)<br/>+getTitle(): String<br/>+getPages(): int<br/>+setPages(pages: int): void',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Book()</code> — constructor mặc định.</li>
  <li><code>Book(title: String, pages: int)</code> — constructor, gán giá trị cho title và pages.</li>
  <li><code>getTitle(): String</code> — trả về title dạng <strong>chữ HOA</strong>.</li>
  <li><code>getPages(): int</code> — trả về pages / 2.</li>
  <li><code>setPages(pages: int): void</code> — cập nhật pages.</li>
</ul>
<p><em>Không định dạng lại kết quả.</em></p>`;

const q1ExplainEn = `<p>Only <code>getTitle()</code> uppercases — the field itself stays as entered. <code>getPages()</code> returns <strong>half</strong> of the stored pages (integer division), and after <code>setPages()</code> the harness immediately calls <code>getPages()</code> again to show the halved value — it does NOT print the raw pages you just set. Verified by compiling <code>Book.java</code> with the real given <code>Main.class</code>:</p>
<pre>Enter title: harry potter
Enter pages: 500
1. Test getTitle(): 1
OUTPUT:
HARRY POTTER</pre>
<pre>Enter title: The Alchemist
Enter pages: 10
2. Test setPages(): 2
Enter pages: 200
OUTPUT:
100</pre>`;
const q1ExplainVi = `<p>Chỉ <code>getTitle()</code> viết hoa — field gốc vẫn giữ nguyên như đã nhập. <code>getPages()</code> trả về <strong>một nửa</strong> số pages lưu (chia nguyên), và sau <code>setPages()</code> harness gọi ngay <code>getPages()</code> lần nữa để hiện giá trị đã chia đôi — KHÔNG in thẳng số pages vừa set. Đã kiểm bằng cách biên dịch <code>Book.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>Enter title: harry potter
Enter pages: 500
1. Test getTitle(): 1
OUTPUT:
HARRY POTTER</pre>
<pre>Enter title: The Alchemist
Enter pages: 10
2. Test setPages(): 2
Enter pages: 200
OUTPUT:
100</pre>`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `public class Book {
    private String title;
    private int pages;

    public Book() {
        // TODO
    }

    public Book(String title, int pages) {
        // TODO
    }

    public String getTitle() {
        // TODO: return title in uppercase
        return null;
    }

    public int getPages() {
        // TODO: return pages / 2
        return 0;
    }

    public void setPages(int pages) {
        // TODO
    }
}`,
  sampleSolution: read('q0/material_0/src/Book.java'),
  expectedOutput:
`Sample run 1 (TC 1 — getTitle, title="harry potter" pages=500):
OUTPUT:
HARRY POTTER

Sample run 2 (TC 2 — setPages, title="The Alchemist" pages=10, new pages=200):
OUTPUT:
100`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'ctor', criterion: B('Both constructors set title and pages correctly.', 'Cả 2 constructor gán đúng title và pages.'), weight: 1, maxScore: 0.5 },
    { id: 'getTitle', criterion: B('getTitle() returns the title field in uppercase without mutating it.', 'getTitle() trả về title dạng chữ HOA mà không sửa field gốc.'), weight: 1, maxScore: 1 },
    { id: 'getPages_setPages', criterion: B('getPages() returns pages/2; setPages() updates the raw pages field.', 'getPages() trả về pages/2; setPages() cập nhật đúng field pages gốc.'), weight: 1, maxScore: 0.5 },
  ],
};

// ── Q2: Employee + Manager (setData/getValue) ──
const q2PromptEn = `<p><strong>(3 marks)</strong> Write a class named <strong>Employee</strong> that holds information about an employee and a class named <strong>Manager</strong> which is derived from <strong>Employee</strong> (i.e. Employee is super class and Manager is sub class).</p>
${table([
  '-name: String<br/>-salary: int',
  '+Employee()<br/>+Employee(name: String, salary: int)<br/>+getName(): String<br/>+getSalary(): int<br/>+setName(name: String): void<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>getName(): String</code> — return name.</li>
  <li><code>getSalary(): int</code> — return salary.</li>
  <li><code>setName(name: String): void</code> — update name.</li>
  <li><code>toString(): String</code> — return the string of format: <strong>name,salary</strong>.</li>
</ul>
${table([
  '-department: String',
  '+Manager()<br/>+Manager(name: String, salary: int, department: String)<br/>+toString(): String<br/>+setData(): void<br/>+getValue(): int',
])}
<p>Where:</p>
<ul>
  <li><code>toString(): String</code> — return the string of format: <strong>name,salary,department</strong>.</li>
  <li><code>setData(): void</code> — Replace the 3rd character in name with the string "KK".</li>
  <li><code>getValue(): int</code> — Check if department="it" (case-sensitive) then return salary+200, otherwise return salary+900.</li>
</ul>`;
const q2PromptVi = `<p><strong>(3 điểm)</strong> Viết lớp tên <strong>Employee</strong> chứa thông tin nhân viên và lớp <strong>Manager</strong> kế thừa từ <strong>Employee</strong> (Employee là lớp cha, Manager là lớp con).</p>
${table([
  '-name: String<br/>-salary: int',
  '+Employee()<br/>+Employee(name: String, salary: int)<br/>+getName(): String<br/>+getSalary(): int<br/>+setName(name: String): void<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>getName(): String</code> — trả về name.</li>
  <li><code>getSalary(): int</code> — trả về salary.</li>
  <li><code>setName(name: String): void</code> — cập nhật name.</li>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>name,salary</strong>.</li>
</ul>
${table([
  '-department: String',
  '+Manager()<br/>+Manager(name: String, salary: int, department: String)<br/>+toString(): String<br/>+setData(): void<br/>+getValue(): int',
])}
<p>Trong đó:</p>
<ul>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>name,salary,department</strong>.</li>
  <li><code>setData(): void</code> — Thay ký tự thứ 3 trong name bằng chuỗi "KK".</li>
  <li><code>getValue(): int</code> — Nếu department="it" (phân biệt hoa/thường) thì trả về salary+200, ngược lại trả về salary+900.</li>
</ul>`;

const q2ExplainEn = `<p><strong>Source note:</strong> the exam scan we digitized this from skips a page right at Manager's "Where:" bullet list — the field/method boxes for Manager are intact (so <code>department: String</code> and the method signatures toString/setData/getValue are all certain), and the getValue() bullet survived, but the toString() and setData() bullets themselves are missing from the scan. Neither was fabricated:</p>
<ul>
  <li><code>toString()</code>'s format ("name,salary,department") is recovered by symmetry — Question 3 in this same paper defines a near-identical Employee/Manager pair and explicitly shows "name,salary,department" for Manager.toString(), and Employee.toString() ("name,salary") is stated verbatim for both questions. This was then <strong>verified</strong> by compiling against the real given <code>Main.class</code>: it prints <code>employee.toString()</code> then <code>manager.toString()</code> (two lines) for TC1.</li>
  <li><code>setData()</code>'s exact rule was reconstructed from the one input/output pair the scan still has for TC2 (name="Harry" → output starts "HaKKry"): replacing the 3rd character of "Harry" (0-based index 2, the first 'r') with "KK" gives "Ha"+"KK"+"ry" = "HaKKry" — exactly the sample. This hypothesis was then <strong>compiled and run against the real given <code>Main.class</code></strong> and matched the transcribed sample output exactly, the same verification standard used for every other question in this exam — it is not a guess left untested.</li>
</ul>
<p>Verified against all 4 given samples by compiling with the real given <code>Main.class</code>:</p>
<pre>name=Byte salary=500 department=hr → TC1 (toString)
OUTPUT:
Byte,500
Byte,500,hr

name=Harry salary=300 department=hr → TC2 (setData)
OUTPUT:
HaKKry,300,hr

name=Today salary=700 department=it → TC3 (getValue, department="it")
OUTPUT:
900

name=Yes salary=800 department=IT → TC3 (getValue, department="IT", case mismatch)
OUTPUT:
1700</pre>`;
const q2ExplainVi = `<p><strong>Ghi chú nguồn:</strong> bộ ảnh scan đề này bị nhảy đúng 1 trang ngay tại danh sách "Where:" của Manager — bảng field/method của Manager vẫn nguyên vẹn (nên <code>department: String</code> và chữ ký các hàm toString/setData/getValue đều chắc chắn), bullet getValue() vẫn còn, nhưng 2 bullet giải thích toString() và setData() thì mất khỏi bản scan. Không cái nào bịa ra tuỳ tiện:</p>
<ul>
  <li>Định dạng <code>toString()</code> ("name,salary,department") phục dựng bằng đối xứng — Câu 3 cùng đề này định nghĩa cặp Employee/Manager gần như giống hệt, và hiển thị RÕ "name,salary,department" cho Manager.toString(), còn Employee.toString() ("name,salary") thì cả 2 câu đều ghi nguyên văn. Sau đó đã <strong>verify</strong> bằng cách biên dịch cùng <code>Main.class</code> given thật: harness in <code>employee.toString()</code> rồi <code>manager.toString()</code> (2 dòng) cho TC1.</li>
  <li>Quy tắc chính xác của <code>setData()</code> được phục dựng từ đúng 1 cặp input/output còn sót trong bản scan cho TC2 (name="Harry" → output bắt đầu "HaKKry"): thay ký tự thứ 3 của "Harry" (chỉ số 0-based là 2, chính là chữ 'r' đầu tiên) bằng "KK" cho ra "Ha"+"KK"+"ry" = "HaKKry" — khớp đúng mẫu. Giả thuyết này sau đó đã được <strong>biên dịch và chạy cùng <code>Main.class</code> given thật</strong> và khớp chính xác với output mẫu đã transcribe, cùng chuẩn kiểm chứng dùng cho mọi câu khác trong đề — không phải đoán rồi để đó không kiểm.</li>
</ul>
<p>Đã đối chiếu với cả 4 mẫu trong đề bằng cách biên dịch cùng <code>Main.class</code> given thật:</p>
<pre>name=Byte salary=500 department=hr → TC1 (toString)
OUTPUT:
Byte,500
Byte,500,hr

name=Harry salary=300 department=hr → TC2 (setData)
OUTPUT:
HaKKry,300,hr

name=Today salary=700 department=it → TC3 (getValue, department="it")
OUTPUT:
900

name=Yes salary=800 department=IT → TC3 (getValue, department="IT", khác hoa/thường)
OUTPUT:
1700</pre>`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `public class Employee {
    private String name;
    private int salary;
    // TODO: Employee(), Employee(name, salary), getName, getSalary, setName,
    // toString() ("name,salary")
}

class Manager extends Employee {
    private String department;
    // TODO: Manager(), Manager(name, salary, department),
    // toString() ("name,salary,department"),
    // setData() (replace 3rd char of name with "KK"),
    // getValue() (department=="it" -> salary+200, else salary+900)
}`,
  sampleSolution: `${read('q1/material_1/src/Employee.java')}\n\n${read('q1/material_1/src/Manager.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — toString, name=Byte salary=500 department=hr):
OUTPUT:
Byte,500
Byte,500,hr

Sample run 2 (TC 2 — setData, name=Harry salary=300 department=hr):
OUTPUT:
HaKKry,300,hr

Sample run 3 (TC 3 — getValue, name=Today salary=700 department=it):
OUTPUT:
900

Sample run 4 (TC 3 — getValue, name=Yes salary=800 department=IT):
OUTPUT:
1700`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'ctor', criterion: B('Manager correctly extends Employee; both toString() formats are right.', 'Manager kế thừa đúng Employee; cả 2 định dạng toString() đều đúng.'), weight: 2, maxScore: 1 },
    { id: 'setData', criterion: B('setData() replaces only the 3rd character of name with "KK" (does not touch salary/department).', 'setData() chỉ thay ký tự thứ 3 của name bằng "KK" (không đụng salary/department).'), weight: 2, maxScore: 1 },
    { id: 'getValue', criterion: B('getValue() returns salary+200 for department exactly "it" (case-sensitive), salary+900 otherwise.', 'getValue() trả về salary+200 khi department đúng "it" (phân biệt hoa/thường), ngược lại salary+900.'), weight: 2, maxScore: 1 },
  ],
};

// ── Q3: Employee + Manager + EmployeeManagement implements IEmployeeManagement ──
const q3PromptEn = `<p><strong>(3 marks)</strong> Write a class named <strong>Employee</strong> that holds information about an employee and a class named <strong>Manager</strong> which is derived from <strong>Employee</strong> (i.e. Employee is super class and Manager is sub class).</p>
${table([
  '-name: String<br/>-salary: int',
  '+Employee()<br/>+Employee(name: String, salary: int)<br/>+getName(): String<br/>+getSalary(): int<br/>+setName(name: String): void<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>getName(): String</code> — return name.</li>
  <li><code>getSalary(): int</code> — return salary.</li>
  <li><code>setName(name: String): void</code> — update name.</li>
  <li><code>toString(): String</code> — return the string of format: <strong>name,salary</strong>.</li>
</ul>
${table([
  '-department: String',
  '+Manager()<br/>+Manager(name: String, salary: int, department: String)<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>toString(): String</code> — return the string of format: <strong>name,salary,department</strong>.</li>
</ul>
<p>The interface <strong>IEmployeeManagement</strong> below is already compiled and given in byte code format, thus you can use it without creating the IEmployeeManagement.java file:</p>
<pre>import java.util.List;

public interface IEmployeeManagement {
    public int f1(List&lt;Employee&gt; lst);
    public void f2(List&lt;Employee&gt; lst);
    public void f3(List&lt;Employee&gt; lst);
}</pre>
<p>Write a class named <strong>EmployeeManagement</strong>, which implements the interface <strong>IEmployeeManagement</strong>. The class EmployeeManagement implements methods f1, f2, f3 in IEmployeeManagement as below (you can add other functions in EmployeeManagement class):</p>
<ul>
  <li><strong>f1</strong>: Total salary of elements with name begins with "Ng" (case-sensitive).</li>
  <li><strong>f2</strong>: Find all Managers have lowest salary and adding "X" at beginning of their name.</li>
  <li><strong>f3</strong>: Suppose the list contains at least 7 elements. Sort the first 3 elements descendingly and the last 3 elements ascendingly by salary.</li>
</ul>`;
const q3PromptVi = `<p><strong>(3 điểm)</strong> Viết lớp tên <strong>Employee</strong> chứa thông tin nhân viên và lớp <strong>Manager</strong> kế thừa từ <strong>Employee</strong> (Employee là lớp cha, Manager là lớp con).</p>
${table([
  '-name: String<br/>-salary: int',
  '+Employee()<br/>+Employee(name: String, salary: int)<br/>+getName(): String<br/>+getSalary(): int<br/>+setName(name: String): void<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>getName(): String</code> — trả về name.</li>
  <li><code>getSalary(): int</code> — trả về salary.</li>
  <li><code>setName(name: String): void</code> — cập nhật name.</li>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>name,salary</strong>.</li>
</ul>
${table([
  '-department: String',
  '+Manager()<br/>+Manager(name: String, salary: int, department: String)<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>name,salary,department</strong>.</li>
</ul>
<p>Interface <strong>IEmployeeManagement</strong> dưới đây đã được biên dịch sẵn dạng byte code, bạn dùng thẳng không cần tạo file IEmployeeManagement.java:</p>
<pre>import java.util.List;

public interface IEmployeeManagement {
    public int f1(List&lt;Employee&gt; lst);
    public void f2(List&lt;Employee&gt; lst);
    public void f3(List&lt;Employee&gt; lst);
}</pre>
<p>Viết lớp tên <strong>EmployeeManagement</strong>, implement interface <strong>IEmployeeManagement</strong>. Lớp EmployeeManagement cài đặt các hàm f1, f2, f3 trong IEmployeeManagement như sau (có thể thêm hàm khác trong lớp EmployeeManagement nếu cần):</p>
<ul>
  <li><strong>f1</strong>: Tổng salary của các phần tử có name bắt đầu bằng "Ng" (phân biệt hoa/thường).</li>
  <li><strong>f2</strong>: Tìm tất cả các Manager có salary thấp nhất và thêm "X" vào đầu name của chúng.</li>
  <li><strong>f3</strong>: Giả sử danh sách có ít nhất 7 phần tử. Sắp xếp 3 phần tử đầu giảm dần và 3 phần tử cuối tăng dần theo salary.</li>
</ul>`;

const q3ExplainEn = `<p><strong>f1</strong> only sums <em>Employee.name</em> starting with "Ng" — both Employee and Manager elements qualify (it checks the name, not the runtime type), e.g. "Ng Bear" and "Ng Bull" both count, "Ngoc" would too, "ng bear" (lowercase) would not (case-sensitive).</p>
<p><strong>f2</strong> only looks at <strong>Manager</strong> elements (plain Employees are skipped entirely, even if their salary would tie for lowest) and prepends "X" to <em>every</em> Manager tied at the minimum Manager salary, not just one — verified with a sample where two Managers ("Harry" and "Lo") both have the minimum salary 1000 and both get the "X" prefix.</p>
<p><strong>f3</strong> only reorders the first 3 and last 3 positions of the list (in place) — everything strictly between position 3 and position n-3 keeps both its value and its position untouched. It uses each element's <code>getSalary()</code> as the sort key regardless of whether the element is an Employee or a Manager.</p>
<p>Verified against all 3 given samples by compiling <code>Employee.java</code> / <code>Manager.java</code> / <code>EmployeeManagement.java</code> with the real given <code>Main.class</code> (list is built by the harness itself, "Add how many Manager elements" answered 0 to match the samples exactly):</p>
<pre>f1, list = (Harry,1000,hr) (Hope,500) (Ng Bear,1100,it) (Lose,200) (Ng Bull,1050,se)
OUTPUT: 2150   (Ng Bear 1100 + Ng Bull 1050)

f2, list = (Harry,1000,hr) (Bull,1050,se) (Hope,500) (Bear,1100,it) (Lose,200) (Lo,1000,ke)
OUTPUT: (XHarry,1000,hr) (Bull,1050,se) (Hope,500) (Bear,1100,it) (Lose,200) (XLo,1000,ke)

f3, list = (Bull,1050,se) (Harry,2000,hr) (Hope,500) (Bear,1100,it) (Lose,200) (Go,1100,sa) (Hate,4200) (Love,200)
OUTPUT: (Harry,2000,hr) (Bull,1050,se) (Hope,500) (Bear,1100,it) (Lose,200) (Love,200) (Go,1100,sa) (Hate,4200)</pre>`;
const q3ExplainVi = `<p><strong>f1</strong> chỉ cộng những phần tử có <em>name</em> bắt đầu bằng "Ng" — cả Employee lẫn Manager đều tính (kiểm tra theo name, không theo kiểu runtime), vd "Ng Bear" và "Ng Bull" đều tính, "Ngoc" cũng tính, còn "ng bear" (chữ thường) thì KHÔNG (phân biệt hoa/thường).</p>
<p><strong>f2</strong> chỉ xét các phần tử <strong>Manager</strong> (Employee thường bị bỏ qua hoàn toàn dù salary có bằng mức thấp nhất) và thêm "X" vào đầu name của <em>MỌI</em> Manager đang hoà mức lương thấp nhất, không chỉ 1 — đã kiểm với mẫu có 2 Manager ("Harry" và "Lo") cùng salary thấp nhất 1000, cả 2 đều được thêm tiền tố "X".</p>
<p><strong>f3</strong> chỉ sắp lại 3 vị trí đầu và 3 vị trí cuối của danh sách (tại chỗ) — mọi phần tử nằm nghiêm ngặt giữa vị trí thứ 3 và vị trí n-3 giữ nguyên cả giá trị lẫn vị trí. Dùng <code>getSalary()</code> của từng phần tử làm khoá sắp xếp bất kể là Employee hay Manager.</p>
<p>Đã đối chiếu với cả 3 mẫu trong đề bằng cách biên dịch <code>Employee.java</code> / <code>Manager.java</code> / <code>EmployeeManagement.java</code> cùng <code>Main.class</code> given thật (danh sách do chính harness dựng, trả lời "Add how many Manager elements" = 0 để khớp đúng mẫu):</p>
<pre>f1, list = (Harry,1000,hr) (Hope,500) (Ng Bear,1100,it) (Lose,200) (Ng Bull,1050,se)
OUTPUT: 2150   (Ng Bear 1100 + Ng Bull 1050)

f2, list = (Harry,1000,hr) (Bull,1050,se) (Hope,500) (Bear,1100,it) (Lose,200) (Lo,1000,ke)
OUTPUT: (XHarry,1000,hr) (Bull,1050,se) (Hope,500) (Bear,1100,it) (Lose,200) (XLo,1000,ke)

f3, list = (Bull,1050,se) (Harry,2000,hr) (Hope,500) (Bear,1100,it) (Lose,200) (Go,1100,sa) (Hate,4200) (Love,200)
OUTPUT: (Harry,2000,hr) (Bull,1050,se) (Hope,500) (Bear,1100,it) (Lose,200) (Love,200) (Go,1100,sa) (Hate,4200)</pre>`;

const q3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `import java.util.List;

public class Employee {
    private String name;
    private int salary;
    // TODO: Employee(), Employee(name, salary), getName, getSalary, setName,
    // toString() ("name,salary")
}

class Manager extends Employee {
    private String department;
    // TODO: Manager(), Manager(name, salary, department),
    // toString() ("name,salary,department")
}

interface IEmployeeManagement {
    public int f1(List<Employee> lst);
    public void f2(List<Employee> lst);
    public void f3(List<Employee> lst);
}

class EmployeeManagement implements IEmployeeManagement {
    // TODO: f1 (sum salary of names starting with "Ng"),
    // f2 (prepend "X" to all Managers tied at lowest Manager salary),
    // f3 (sort first 3 elements desc, last 3 asc, by salary)
    public int f1(List<Employee> lst) { return 0; }
    public void f2(List<Employee> lst) { }
    public void f3(List<Employee> lst) { }
}`,
  sampleSolution: `${read('q2/material_2/src/Employee.java')}\n\n${read('q2/material_2/src/Manager.java')}\n\n${read('q2/material_2/src/EmployeeManagement.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — f1, list=(Harry,1000,hr)(Hope,500)(Ng Bear,1100,it)(Lose,200)(Ng Bull,1050,se)):
OUTPUT:
2150

Sample run 2 (TC 2 — f2, list=(Harry,1000,hr)(Bull,1050,se)(Hope,500)(Bear,1100,it)(Lose,200)(Lo,1000,ke)):
OUTPUT:
(XHarry,1000,hr) (Bull,1050,se) (Hope,500) (Bear,1100,it) (Lose,200) (XLo,1000,ke)

Sample run 3 (TC 3 — f3, list=(Bull,1050,se)(Harry,2000,hr)(Hope,500)(Bear,1100,it)(Lose,200)(Go,1100,sa)(Hate,4200)(Love,200)):
OUTPUT:
(Harry,2000,hr) (Bull,1050,se) (Hope,500) (Bear,1100,it) (Lose,200) (Love,200) (Go,1100,sa) (Hate,4200)`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'classes', criterion: B('Employee/Manager toString() formats are correct; Manager only adds department.', 'Định dạng toString() của Employee/Manager đúng; Manager chỉ thêm department.'), weight: 1, maxScore: 0.5 },
    { id: 'f1', criterion: B('f1() sums salary of all elements (Employee or Manager) whose name starts with "Ng" (case-sensitive).', 'f1() cộng salary mọi phần tử (Employee hay Manager) có name bắt đầu "Ng" (phân biệt hoa/thường).'), weight: 1, maxScore: 0.75 },
    { id: 'f2', criterion: B('f2() prepends "X" to the name of every Manager tied at the lowest Manager salary, ignores plain Employees.', 'f2() thêm "X" vào name của MỌI Manager hoà mức lương thấp nhất, bỏ qua Employee thường.'), weight: 1, maxScore: 0.75 },
    { id: 'f3', criterion: B('f3() sorts only the first 3 (descending) and last 3 (ascending) positions by salary, leaves the middle untouched.', 'f3() chỉ sắp 3 vị trí đầu (giảm dần) và 3 vị trí cuối (tăng dần) theo salary, giữ nguyên phần giữa.'), weight: 1, maxScore: 1 },
  ],
};

// ── Q4: MyStringProcessor implements IStringProcessor ──
const ISTRINGPROCESSOR_SRC = `public interface IStringProcessor {
    public int f1(String str);
    public String f2(String str);
}`;

const q4PromptEn = `<p><strong>(2 marks)</strong> The interface <strong>IStringProcessor</strong> below is already compiled and given in byte code format, thus you can use it without creating the IStringProcessor.java file:</p>
<pre>${ISTRINGPROCESSOR_SRC}</pre>
<p>Write a class named <strong>MyStringProcessor</strong>, which implements the interface <strong>IStringProcessor</strong>. The class MyStringProcessor implements methods f1 and f2 in IStringProcessor as below:</p>
<ul>
  <li><strong>f1</strong>: Count the number of lower vowels (a, e, i, o, u) in the input string str (case-sensitive). Return the total count of vowels.</li>
  <li><strong>f2</strong>: Find the longest word in the input string str (a word is defined as a substring between spaces). Return the longest word. If there are multiple words with the same longest length, return the first one encountered.</li>
</ul>`;
const q4PromptVi = `<p><strong>(2 điểm)</strong> Interface <strong>IStringProcessor</strong> dưới đây đã được biên dịch sẵn dạng byte code, bạn dùng thẳng không cần tạo file IStringProcessor.java:</p>
<pre>${ISTRINGPROCESSOR_SRC}</pre>
<p>Viết lớp tên <strong>MyStringProcessor</strong>, implement interface <strong>IStringProcessor</strong>. Lớp MyStringProcessor cài đặt các hàm f1 và f2 trong IStringProcessor như sau:</p>
<ul>
  <li><strong>f1</strong>: Đếm số nguyên âm thường (a, e, i, o, u) trong chuỗi input str (phân biệt hoa/thường). Trả về tổng số nguyên âm.</li>
  <li><strong>f2</strong>: Tìm từ dài nhất trong chuỗi input str (một từ là chuỗi con giữa các khoảng trắng). Trả về từ dài nhất. Nếu có nhiều từ cùng độ dài lớn nhất, trả về từ gặp đầu tiên.</li>
</ul>`;

const q4ExplainEn = `<p><strong>f1</strong> is case-sensitive and counts only lowercase a/e/i/o/u — uppercase vowels like the "E" in "vowEls" do NOT count. Consonants and spaces are ignored, digits don't exist in these samples but would also be ignored.</p>
<p><strong>f2</strong> splits on plain spaces and keeps the <em>first</em> word seen among ties for the longest length — it does not need to strip punctuation for these samples.</p>
<p>Verified against both given samples by compiling <code>MyStringProcessor.java</code> with the real given <code>Main.class</code>:</p>
<pre>f1("This is a string with some vowEls") → 8   (i,i,a,i,i,o,e,o — the uppercase "E" in vowEls does not count)
f2("This is a string with some words") → "string"   (6 letters, longest; "words" is 5)</pre>`;
const q4ExplainVi = `<p><strong>f1</strong> phân biệt hoa/thường, chỉ đếm a/e/i/o/u chữ THƯỜNG — nguyên âm hoa như "E" trong "vowEls" KHÔNG được tính. Phụ âm và khoảng trắng bị bỏ qua.</p>
<p><strong>f2</strong> tách theo khoảng trắng và giữ từ <em>đầu tiên</em> gặp được trong số các từ cùng hoà độ dài lớn nhất — không cần xử lý dấu câu với các mẫu này.</p>
<p>Đã đối chiếu với cả 2 mẫu trong đề bằng cách biên dịch <code>MyStringProcessor.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>f1("This is a string with some vowEls") → 8   (i,i,a,i,i,o,e,o — chữ "E" hoa trong vowEls không tính)
f2("This is a string with some words") → "string"   (6 ký tự, dài nhất; "words" chỉ 5)</pre>`;

const q4 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `${ISTRINGPROCESSOR_SRC}

public class MyStringProcessor implements IStringProcessor {
    // TODO: f1, f2
}`,
  sampleSolution: read('q3/material_3/src/MyStringProcessor.java'),
  expectedOutput:
`Sample run 1 (TC 1 — f1, input: "This is a string with some vowEls"):
OUTPUT:
8

Sample run 2 (TC 2 — f2, input: "This is a string with some words"):
OUTPUT:
string`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'f1', criterion: B('f1() counts only lowercase a/e/i/o/u (case-sensitive).', 'f1() chỉ đếm a/e/i/o/u chữ thường (phân biệt hoa/thường).'), weight: 1, maxScore: 1 },
    { id: 'f2', criterion: B('f2() returns the first longest word (ties broken by first occurrence).', 'f2() trả về từ dài nhất đầu tiên (hoà độ dài thì lấy từ gặp trước).'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE2-SP25-B2',
      title: B('PRO192 — Practical Exam Đề 2 (SP25, Block 2)', 'PRO192 — Đề thi thực hành số 2 (SP25, Block 2)'),
      description: B(
        'Real PRO192 PE paper (4 questions, 10 marks) — OOP class design (encapsulation, inheritance, toString formatting), two independent Employee/Manager projects (one with per-instance behavior, one with a List-based management interface), one interface implementation over Strings. Solutions written & verified by compiling against the real given Main.class harness.',
        'Đề PE PRO192 thật (4 câu, 10 điểm) — thiết kế lớp OOP (đóng gói, kế thừa, định dạng toString), hai project Employee/Manager độc lập (1 project xử lý hành vi trên từng instance, 1 project có interface quản lý theo List), một interface cài đặt trên String. Lời giải đã viết và kiểm bằng cách biên dịch cùng harness Main.class given thật.',
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
  `// AUTO-GENERATED by scripts/build-pro192-pe2.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
