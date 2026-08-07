/**
 * build-pro192-pe9.mjs — sinh content/exams/PRO192-PE9.mjs.
 *
 * Đề 9 khác các đề PE PRO192 khác: nguồn không có Main.class biên dịch sẵn
 * (không có "given materials" kiểu harness tương tác qua stdin/stdout). Đề
 * này thật ra CHỈ có 1 "Question 1" duy nhất (10 điểm), yêu cầu viết 1
 * interface + 3 class theo UML, và một chương trình đọc/ghi FILE (input.txt
 * → output.txt) — không phải chấm qua Main.class mà sinh viên tự nộp
 * run/src theo cấu trúc PEA (Practical Exam Assistant?) rồi phần mềm tự
 * động chấm ngoài đời thật. Given materials gốc (Given.rar) chỉ có vỏ
 * skeleton Q1.java (rỗng, có TODO, không phải lời giải) + 3 file input mẫu
 * — không có nbproject/build.xml/manifest — tức bản thân nó ĐÃ sạch, không
 * cần bóc lời giải ra. Zip lại y nguyên cấu trúc gốc rồi upload R2.
 *
 * Vì không có harness để build+run tương tác, lời giải được viết từ đặc tả
 * UML rồi biên dịch bằng `javac` thật + chạy bằng `java q1.Q1` với 3 file
 * input1.txt/input2.txt/input3.txt thật lấy từ given materials, output ghi
 * ra output.txt được so khớp CHÍNH XÁC với bảng Sample Input 1/2/3 trong đề
 * (ảnh scan) — khớp 100%, không suy đoán.
 *
 * Bài toán 1 "Question" duy nhất được tách thành 4 câu hỏi nền tảng thi
 * (q1..q4) tương ứng 4 phần trong đề: (1) class Employee, (2) interface
 * EmployeeManagement, (3) class InMemoryEmployeeManagement, (4) chương
 * trình Q1 (đọc input.txt/ghi output.txt) — cùng cách các đề PE khác tách
 * theo UML box, điểm 3+1+3+3 = 10.
 *
 * Nguồn đã verify: scratchpad pro192-pe/de9/q{0..3} — mỗi lớp/biên dịch xong
 * bằng `javac`, `java q1.Q1` chạy thật với input1/2/3.txt gốc, output khớp
 * 100% với đề (ảnh scan "3 of 4"/"4 of 4", Paper No: 1).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE9.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/2c89fc57-9aa7-4c2e-8cc0-a484bfb4eb0f/scratchpad/pro192-pe/de9';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE9.mjs');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').trimEnd();

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE9-Given.zip';

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, Question 1).</p>
   <ol>
     <li>Software tools must be used: <strong>NetBeans IDE 8.x</strong> and <strong>Java JDK 1.8</strong>. Students are ONLY allowed to use their own study materials (slides, notes, sample code, program examples, e-books) stored on their own computer. For distance learning: Google Meet / Hangout for exam monitoring purposes.</li>
     <li>Step 1: run "Clean and Build Project" (Shift+F11) to create the <strong>dist</strong> folder and <strong>.jar</strong> file.</li>
     <li>Step 2: prepare to submit — for the question, create two sub-folders <strong>run</strong> and <strong>src</strong>. Copy the built <code>*.jar</code> file into <strong>run</strong>. Compress the source code into a <code>.zip</code>, then copy the <code>.zip</code> file into <strong>src</strong>.</li>
     <li>Step 3: choose the question number (1) in the exam submission software, then attach the corresponding solution folder (1) and click Submit.</li>
     <li>Do NOT use accented Vietnamese when writing comments in programs. Solutions are marked by Automated Marking Software. If at least one of the above requirements is not followed, the exam gets ZERO.</li>
   </ol>
   <p>Unlike other PRO192 PE papers, this one has no interactive <code>Main.class</code> test harness — it is a <strong>file-based</strong> program: it reads commands from <code>input.txt</code> and writes all results to <code>output.txt</code>. This exam room cannot run NetBeans/JDK in the browser, so you type each class directly into the code box below and it is graded by AI against the rubric — but the "given materials" download above is the REAL given skeleton (<code>Q1.java</code> with the fixed read/solve/printResult structure) plus the 3 real sample <code>input.txt</code> files, so you can build &amp; run it for real on your own machine and cross-check your <code>output.txt</code> against the samples shown.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> (dịch nguyên văn từ đề thi thật, Question 1).</p>
   <ol>
     <li>Phần mềm bắt buộc dùng: <strong>NetBeans IDE 8.x</strong> và <strong>Java JDK 1.8</strong>. Sinh viên CHỈ được dùng tài liệu học tập của riêng mình (slide, ghi chú, mã mẫu, ví dụ chương trình, sách điện tử) lưu trên máy tính của mình. Học từ xa: dùng Google Meet / Hangout để giám sát thi.</li>
     <li>Bước 1: chạy "Clean and Build Project" (Shift+F11) để tạo thư mục <strong>dist</strong> và file <strong>.jar</strong>.</li>
     <li>Bước 2: chuẩn bị nộp bài — với câu hỏi, tạo 2 thư mục con <strong>run</strong> và <strong>src</strong>. Chép file <code>*.jar</code> đã build vào <strong>run</strong>. Nén mã nguồn thành <code>.zip</code>, rồi chép file <code>.zip</code> vào <strong>src</strong>.</li>
     <li>Bước 3: chọn số thứ tự câu hỏi (1) trong phần mềm nộp bài, đính kèm thư mục lời giải tương ứng (1) rồi bấm Submit.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment code. Bài sẽ được chấm bằng phần mềm chấm tự động. Nếu vi phạm bất kỳ yêu cầu nào ở trên, bài thi sẽ bị ZERO điểm.</li>
   </ol>
   <p>Khác các đề PE PRO192 khác, đề này KHÔNG có harness <code>Main.class</code> tương tác — đây là chương trình làm việc với <strong>FILE</strong>: đọc lệnh từ <code>input.txt</code> và ghi toàn bộ kết quả ra <code>output.txt</code>. Phòng thi web không chạy được NetBeans/JDK trực tiếp trên trình duyệt, nên bạn gõ thẳng từng class vào ô mã bên dưới và được AI chấm theo tiêu chí — nhưng file "given materials" tải ở trên là bộ khung given THẬT (<code>Q1.java</code> với cấu trúc read/solve/printResult cố định) cùng 3 file <code>input.txt</code> mẫu thật, để bạn build &amp; chạy thật trên máy mình và tự đối chiếu <code>output.txt</code> với các mẫu bên dưới.</p>`,
);

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

const UML_NOTE_EN = `<p>All four parts below build ONE program (worth all 10 marks of Question 1 in the real paper). Class diagram:</p>
<pre>«interface» EmployeeManagement            class Q1
  + add(e: Employee): void                  + main(args: String[]): void
  + update(e: Employee): void                  |
  + listAll(): List&lt;Employee&gt;                 | uses
  + sortByName(): List&lt;Employee&gt;               v
        ^ implements                  class InMemoryEmployeeManagement
        |                               - store: List&lt;Employee&gt;
        +-------------------------------+ add/update/listAll/sortByName
                                              |
                                              | uses
                                              v
                                        class Employee implements Comparable&lt;Employee&gt;
                                          - id: int, name: String, salary: double, department: String</pre>`;
const UML_NOTE_VI = `<p>Cả 4 phần dưới đây cùng tạo nên MỘT chương trình (chiếm trọn 10 điểm của Question 1 trong đề thật). Sơ đồ lớp:</p>
<pre>«interface» EmployeeManagement            class Q1
  + add(e: Employee): void                  + main(args: String[]): void
  + update(e: Employee): void                  |
  + listAll(): List&lt;Employee&gt;                 | uses
  + sortByName(): List&lt;Employee&gt;               v
        ^ implements                  class InMemoryEmployeeManagement
        |                               - store: List&lt;Employee&gt;
        +-------------------------------+ add/update/listAll/sortByName
                                              |
                                              | uses
                                              v
                                        class Employee implements Comparable&lt;Employee&gt;
                                          - id: int, name: String, salary: double, department: String</pre>`;

// ── Part 1: class Employee ──
const q1PromptEn = `<p><strong>(3 marks)</strong> Base on the given class diagram, create the class <strong>Employee</strong>.</p>
${UML_NOTE_EN}
${table([
  '-id: int<br/>-name: String<br/>-salary: double<br/>-department: String',
  '+Employee(id: int, name: String, salary: double, department: String)<br/>+getId(): int<br/>+getName(): String<br/>+getSalary(): double<br/>+getDepartment(): String<br/>+setName(n: String): void<br/>+setSalary(s: double): void<br/>+setDepartment(d: String): void<br/>+compareTo(other: Employee): int<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li>Declare the fields of the class (all private).</li>
  <li>Constructor: initialize the fields with values.</li>
  <li>Getter methods for the fields (note: there is no setter/getter asymmetry — <strong>id has no setter</strong>, only a getter, per the diagram).</li>
  <li>Setter methods for name, salary, department only.</li>
  <li><code>int compareTo(Employee other)</code>: defines the natural order by name (<strong>case-insensitive</strong>). Employee must implement <code>Comparable&lt;Employee&gt;</code>.</li>
  <li><code>String toString()</code>: return a string in the specified format <em>id-name-salary-department</em> (salary formatted with 2 decimal places, e.g. <code>1-Alice-1500.00-HR</code>).</li>
</ul>`;
const q1PromptVi = `<p><strong>(3 điểm)</strong> Dựa vào sơ đồ lớp cho sẵn, viết lớp <strong>Employee</strong>.</p>
${UML_NOTE_VI}
${table([
  '-id: int<br/>-name: String<br/>-salary: double<br/>-department: String',
  '+Employee(id: int, name: String, salary: double, department: String)<br/>+getId(): int<br/>+getName(): String<br/>+getSalary(): double<br/>+getDepartment(): String<br/>+setName(n: String): void<br/>+setSalary(s: double): void<br/>+setDepartment(d: String): void<br/>+compareTo(other: Employee): int<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li>Khai báo các field của lớp (đều private).</li>
  <li>Constructor: khởi tạo các field bằng giá trị truyền vào.</li>
  <li>Hàm getter cho các field (lưu ý: <strong>id KHÔNG có setter</strong>, chỉ có getter, đúng theo sơ đồ).</li>
  <li>Hàm setter chỉ cho name, salary, department.</li>
  <li><code>int compareTo(Employee other)</code>: xác định thứ tự tự nhiên theo name (<strong>không phân biệt hoa/thường</strong>). Employee phải implement <code>Comparable&lt;Employee&gt;</code>.</li>
  <li><code>String toString()</code>: trả về chuỗi đúng định dạng <em>id-name-salary-department</em> (salary định dạng 2 chữ số thập phân, vd <code>1-Alice-1500.00-HR</code>).</li>
</ul>`;

const q1ExplainEn = `<p><code>compareTo()</code> must be <strong>case-insensitive</strong> (<code>name.compareToIgnoreCase(other.name)</code>), not the default <code>String.compareTo()</code> — the diagram explicitly says "case-insensitive". <code>toString()</code> must format salary to exactly 2 decimal places with <code>String.format("%.2f", salary)</code>, or a value like <code>1500.0</code> won't match the required <code>1500.00</code>.</p>
<p>Note the asymmetry: the diagram gives setters for name/salary/department but <strong>not for id</strong> — id is set once via the constructor and never changed again. Adding a <code>setId()</code> that isn't in the diagram is not wrong per se, but isn't required and the grader only checks what's specified.</p>
<p>Verified by compiling <code>Employee.java</code> together with the rest of the program and running the real given <code>input.txt</code> samples (see Part 4's expected output) — e.g. <code>new Employee(1, "Alice", 1500.00, "HR").toString()</code> produces exactly <code>1-Alice-1500.00-HR</code>, and sorting employees named Alex/Alice/Bob/Daisy by <code>compareTo()</code> produces the order Alex, Alice, Bob, Daisy (because "Alex" &lt; "Alice" alphabetically — the 3rd character 'e' &lt; 'i').</p>`;
const q1ExplainVi = `<p><code>compareTo()</code> phải <strong>không phân biệt hoa/thường</strong> (<code>name.compareToIgnoreCase(other.name)</code>), không phải <code>String.compareTo()</code> mặc định — sơ đồ ghi rõ "case-insensitive". <code>toString()</code> phải định dạng salary đúng 2 chữ số thập phân bằng <code>String.format("%.2f", salary)</code>, nếu không giá trị như <code>1500.0</code> sẽ không khớp với yêu cầu <code>1500.00</code>.</p>
<p>Lưu ý điểm bất đối xứng: sơ đồ có setter cho name/salary/department nhưng <strong>KHÔNG có cho id</strong> — id chỉ được gán 1 lần qua constructor rồi không đổi nữa. Thêm <code>setId()</code> không có trong sơ đồ không sai, nhưng không bắt buộc và bộ chấm chỉ kiểm những gì đề yêu cầu.</p>
<p>Đã kiểm bằng cách biên dịch <code>Employee.java</code> cùng phần còn lại của chương trình và chạy với 3 file <code>input.txt</code> mẫu thật (xem expected output ở Phần 4) — vd <code>new Employee(1, "Alice", 1500.00, "HR").toString()</code> cho đúng <code>1-Alice-1500.00-HR</code>, và sắp xếp các nhân viên tên Alex/Alice/Bob/Daisy theo <code>compareTo()</code> cho đúng thứ tự Alex, Alice, Bob, Daisy (vì "Alex" &lt; "Alice" theo alphabet — ký tự thứ 3 'e' &lt; 'i').</p>`;

const q1 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `public class Employee implements Comparable<Employee> {
    private int id;
    private String name;
    private double salary;
    private String department;

    public Employee(int id, String name, double salary, String department) {
        // TODO
    }

    public int getId() {
        // TODO
        return 0;
    }

    public String getName() {
        // TODO
        return null;
    }

    public double getSalary() {
        // TODO
        return 0;
    }

    public String getDepartment() {
        // TODO
        return null;
    }

    public void setName(String n) {
        // TODO
    }

    public void setSalary(double s) {
        // TODO
    }

    public void setDepartment(String d) {
        // TODO
    }

    @Override
    public int compareTo(Employee other) {
        // TODO: natural order by name, CASE-INSENSITIVE
        return 0;
    }

    @Override
    public String toString() {
        // TODO: "id-name-salary-department", salary with 2 decimal places
        return null;
    }
}`,
  sampleSolution: read('q0/material_0/src/Employee.java'),
  expectedOutput:
`Sample (from Part 4's Sample run 1 — Add 1 Alice 1500.00 HR):
new Employee(1, "Alice", 1500.00, "HR").toString()
OUTPUT:
1-Alice-1500.00-HR

Sample (from Part 4's Sample run 3 — sortByName on Alice/Bob/Alex/Daisy):
ordering by compareTo() (case-insensitive by name)
OUTPUT:
Alex, Alice, Bob, Daisy`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'fields_ctor', criterion: B('Fields are private; constructor sets all four correctly.', 'Field đều private; constructor gán đúng cả 4 giá trị.'), weight: 1, maxScore: 0.5 },
    { id: 'getters', criterion: B('All four getters return the correct field.', 'Cả 4 getter trả về đúng field.'), weight: 1, maxScore: 0.5 },
    { id: 'setters', criterion: B('setName/setSalary/setDepartment update correctly; no unintended setId required.', 'setName/setSalary/setDepartment cập nhật đúng; không yêu cầu setId.'), weight: 1, maxScore: 0.5 },
    { id: 'compareTo', criterion: B('compareTo() orders by name, case-insensitively.', 'compareTo() sắp theo name, không phân biệt hoa/thường.'), weight: 1, maxScore: 0.75 },
    { id: 'toString', criterion: B('toString() matches "id-name-salary-department" with salary at 2 decimal places.', 'toString() đúng "id-name-salary-department", salary 2 chữ số thập phân.'), weight: 1, maxScore: 0.75 },
  ],
};

// ── Part 2: interface EmployeeManagement ──
const q2PromptEn = `<p><strong>(1 mark)</strong> Base on the given class diagram, create the interface <strong>EmployeeManagement</strong>.</p>
${table([
  '+add(e: Employee): void<br/>+update(e: Employee): void<br/>+listAll(): List&lt;Employee&gt;<br/>+sortByName(): List&lt;Employee&gt;',
])}
<p>Where:</p>
<ul>
  <li><code>void add(Employee e)</code> — add a new employee.</li>
  <li><code>void update(Employee e)</code> — replace an existing employee by ID.</li>
  <li><code>List&lt;Employee&gt; listAll()</code> — return an unmodifiable or copied list of employees.</li>
  <li><code>List&lt;Employee&gt; sortByName()</code> — return an unmodifiable or copied list of employees ordered by name.</li>
</ul>`;
const q2PromptVi = `<p><strong>(1 điểm)</strong> Dựa vào sơ đồ lớp cho sẵn, viết interface <strong>EmployeeManagement</strong>.</p>
${table([
  '+add(e: Employee): void<br/>+update(e: Employee): void<br/>+listAll(): List&lt;Employee&gt;<br/>+sortByName(): List&lt;Employee&gt;',
])}
<p>Trong đó:</p>
<ul>
  <li><code>void add(Employee e)</code> — thêm 1 nhân viên mới.</li>
  <li><code>void update(Employee e)</code> — thay thế nhân viên đã có theo ID.</li>
  <li><code>List&lt;Employee&gt; listAll()</code> — trả về danh sách nhân viên (bất biến hoặc bản sao).</li>
  <li><code>List&lt;Employee&gt; sortByName()</code> — trả về danh sách nhân viên đã sắp theo name (bất biến hoặc bản sao).</li>
</ul>`;

const q2ExplainEn = `<p>A pure contract — no logic of its own to run, so there's no standalone sample output here. It's exercised for real by Part 3 (<code>InMemoryEmployeeManagement implements EmployeeManagement</code>) and Part 4 (the <code>Q1</code> driver program, whose full verified input/output is shown in Part 4's expected output). Grading here is structural: exact method names, parameter types, and return types matching the diagram exactly (generics included — <code>List&lt;Employee&gt;</code>, not a raw <code>List</code> or an array).</p>`;
const q2ExplainVi = `<p>Đây thuần là hợp đồng (contract) — không có logic riêng để chạy, nên không có mẫu output độc lập ở đây. Nó được thực thi thật ở Phần 3 (<code>InMemoryEmployeeManagement implements EmployeeManagement</code>) và Phần 4 (chương trình <code>Q1</code>, input/output đầy đủ đã kiểm thật nằm ở expected output của Phần 4). Chấm ở đây mang tính cấu trúc: tên hàm, kiểu tham số, kiểu trả về phải khớp CHÍNH XÁC sơ đồ (kể cả generic — <code>List&lt;Employee&gt;</code>, không phải <code>List</code> thô hay mảng).</p>`;

const q2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `import java.util.List;

public interface EmployeeManagement {
    // TODO: void add(Employee e);
    // TODO: void update(Employee e);
    // TODO: List<Employee> listAll();
    // TODO: List<Employee> sortByName();
}`,
  sampleSolution: read('q1/material_1/src/EmployeeManagement.java'),
  expectedOutput:
`This interface has no runtime output of its own — it is a pure contract.
Correctness is verified structurally (exact method signatures matching the
diagram) and indirectly through Part 3 and Part 4's real verified runs.`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'signatures', criterion: B('All four method signatures match the diagram exactly (names, parameter types, generic return types).', 'Cả 4 chữ ký hàm khớp CHÍNH XÁC sơ đồ (tên, kiểu tham số, kiểu trả về generic).'), weight: 1, maxScore: 1 },
  ],
};

// ── Part 3: class InMemoryEmployeeManagement ──
const q3PromptEn = `<p><strong>(3 marks)</strong> Base on the given class diagram, create the class <strong>InMemoryEmployeeManagement</strong> implementing <strong>EmployeeManagement</strong>.</p>
${table([
  '-store: List&lt;Employee&gt;',
  '+add(e: Employee): void<br/>+update(e: Employee): void<br/>+listAll(): List&lt;Employee&gt;<br/>+sortByName(): List&lt;Employee&gt;',
])}
<p>Where:</p>
<ul>
  <li>Declare the fields of the class (a <code>List&lt;Employee&gt; store</code>).</li>
  <li><code>void add(Employee e)</code> — append the employee to the internal store.</li>
  <li><code>void update(Employee e)</code> — replace an existing employee by ID (find the stored employee whose id equals <code>e.getId()</code> and replace it with <code>e</code>).</li>
  <li><code>List&lt;Employee&gt; listAll()</code> — return an unmodifiable or copied list of employees (does not expose the internal store for external mutation).</li>
  <li><code>List&lt;Employee&gt; sortByName()</code> — return an unmodifiable or copied list of employees ordered by name (uses <code>Employee.compareTo()</code>); does not need to permanently reorder the internal store.</li>
</ul>
<p><em>Note:</em> the driver program in Part 4 also needs a way to clear all employees (the exam's "Clear" command). The diagram's interface has no <code>clear()</code> method, but since Part 4's driver holds a reference of the concrete type <strong>InMemoryEmployeeManagement</strong> (not the interface), you may add an extra public <code>clear()</code> method here beyond what the diagram lists.</p>`;
const q3PromptVi = `<p><strong>(3 điểm)</strong> Dựa vào sơ đồ lớp cho sẵn, viết lớp <strong>InMemoryEmployeeManagement</strong> implement <strong>EmployeeManagement</strong>.</p>
${table([
  '-store: List&lt;Employee&gt;',
  '+add(e: Employee): void<br/>+update(e: Employee): void<br/>+listAll(): List&lt;Employee&gt;<br/>+sortByName(): List&lt;Employee&gt;',
])}
<p>Trong đó:</p>
<ul>
  <li>Khai báo field của lớp (<code>List&lt;Employee&gt; store</code>).</li>
  <li><code>void add(Employee e)</code> — thêm nhân viên vào store nội bộ.</li>
  <li><code>void update(Employee e)</code> — thay thế nhân viên đã có theo ID (tìm nhân viên trong store có id bằng <code>e.getId()</code> rồi thay bằng <code>e</code>).</li>
  <li><code>List&lt;Employee&gt; listAll()</code> — trả về danh sách nhân viên (bất biến hoặc bản sao, không để bên ngoài sửa trực tiếp store nội bộ).</li>
  <li><code>List&lt;Employee&gt; sortByName()</code> — trả về danh sách nhân viên đã sắp theo name (dùng <code>Employee.compareTo()</code>); không bắt buộc phải sắp lại vĩnh viễn store nội bộ.</li>
</ul>
<p><em>Lưu ý:</em> chương trình driver ở Phần 4 còn cần cách xoá sạch nhân viên (lệnh "Clear" của đề). Interface trong sơ đồ không có hàm <code>clear()</code>, nhưng vì driver ở Phần 4 giữ tham chiếu kiểu cụ thể <strong>InMemoryEmployeeManagement</strong> (không phải interface), bạn có thể thêm 1 hàm public <code>clear()</code> ngoài những gì sơ đồ liệt kê.</p>`;

const q3ExplainEn = `<p><code>update()</code> must replace by matching <strong>ID</strong>, not by object identity or position — scan <code>store</code> for an employee whose <code>getId()</code> equals <code>e.getId()</code> and overwrite that slot. <code>listAll()</code>/<code>sortByName()</code> must return a <em>new</em> <code>ArrayList</code> (a copy) rather than the live <code>store</code> reference — the diagram says "unmodifiable or copied" precisely to prevent callers from corrupting internal state through the returned list. <code>sortByName()</code> sorts a copy (<code>Collections.sort</code> using <code>Employee</code>'s own <code>compareTo()</code>), it does not need to mutate <code>store</code>'s own order.</p>
<p>The extra <code>clear()</code> method is not in the UML box but is required for the driver in Part 4 to implement the "Clear" command — there is no other way to reset the list since the interface doesn't declare one and Part 4's field is typed as this concrete class.</p>
<p>Verified end-to-end by compiling with <code>Employee</code> + <code>EmployeeManagement</code> + the Part 4 driver and running against the real given <code>input.txt</code> samples — see Part 4's expected output for the exact <code>output.txt</code> produced by <code>add</code>/<code>update</code>/<code>listAll</code>/<code>sortByName</code>/<code>clear</code> together.</p>`;
const q3ExplainVi = `<p><code>update()</code> phải thay thế theo khớp <strong>ID</strong>, không phải theo object identity hay vị trí — duyệt <code>store</code> tìm nhân viên có <code>getId()</code> bằng <code>e.getId()</code> rồi ghi đè đúng vị trí đó. <code>listAll()</code>/<code>sortByName()</code> phải trả về <em>bản sao mới</em> (<code>ArrayList</code> mới) chứ không phải tham chiếu sống của <code>store</code> — sơ đồ ghi "unmodifiable or copied" chính là để ngăn bên gọi phá vỡ trạng thái nội bộ qua danh sách trả về. <code>sortByName()</code> sắp trên bản sao (<code>Collections.sort</code> dùng <code>compareTo()</code> của <code>Employee</code>), không cần sửa thứ tự gốc của <code>store</code>.</p>
<p>Hàm <code>clear()</code> thêm vào không có trong khung UML nhưng driver ở Phần 4 cần nó để cài lệnh "Clear" — không còn cách nào khác để xoá danh sách vì interface không khai báo, còn field ở Phần 4 lại khai kiểu cụ thể là lớp này.</p>
<p>Đã kiểm end-to-end bằng cách biên dịch cùng <code>Employee</code> + <code>EmployeeManagement</code> + driver Phần 4 rồi chạy với 3 file <code>input.txt</code> mẫu thật — xem expected output của Phần 4 để thấy đúng <code>output.txt</code> tạo ra từ <code>add</code>/<code>update</code>/<code>listAll</code>/<code>sortByName</code>/<code>clear</code> cùng nhau.</p>`;

const q3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class InMemoryEmployeeManagement implements EmployeeManagement {
    private List<Employee> store = new ArrayList<>();

    @Override
    public void add(Employee e) {
        // TODO
    }

    @Override
    public void update(Employee e) {
        // TODO: find employee in store with same id, replace it
    }

    @Override
    public List<Employee> listAll() {
        // TODO: return a copy of store
        return null;
    }

    @Override
    public List<Employee> sortByName() {
        // TODO: return a copy of store, sorted by name (case-insensitive)
        return null;
    }

    // TODO: add a public clear() method (not in the UML/interface, but
    // needed by the Part 4 driver to implement the "Clear" command)
}`,
  sampleSolution: read('q2/material_2/src/InMemoryEmployeeManagement.java'),
  expectedOutput:
`Behavior verified together with Part 4's real given input.txt samples
(see Part 4's expected output for the exact output.txt lines produced by
add/update/listAll/sortByName/clear).

Sample (from Part 4's Sample run 3 — 4 employees added, then Sort):
sortByName() on [1-Alice, 2-Bob, 3-Alex, 4-Daisy] (insertion order)
OUTPUT:
3-Alex-1800.00-IT
1-Alice-1500.00-HR
2-Bob-2200.00-IT
4-Daisy-2500.00-Finance`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'implements_field', criterion: B('Correctly implements EmployeeManagement with a private List<Employee> store field.', 'Implement đúng EmployeeManagement, có field private List<Employee> store.'), weight: 1, maxScore: 0.5 },
    { id: 'add', criterion: B('add() appends the employee to the store.', 'add() thêm nhân viên vào store.'), weight: 1, maxScore: 0.5 },
    { id: 'update', criterion: B('update() replaces the stored employee matching e\'s ID.', 'update() thay đúng nhân viên trong store có ID khớp e.'), weight: 1, maxScore: 0.75 },
    { id: 'listAll_sortByName', criterion: B('listAll()/sortByName() return copies (not the live store reference); sortByName() sorts correctly.', 'listAll()/sortByName() trả về bản sao (không phải tham chiếu sống của store); sortByName() sắp đúng.'), weight: 1, maxScore: 1 },
    { id: 'clear', criterion: B('Has a working clear() method that empties the store.', 'Có hàm clear() hoạt động đúng, làm rỗng store.'), weight: 1, maxScore: 0.25 },
  ],
};

// ── Part 4: class Q1 (file-based driver) ──
const q4PromptEn = `<p><strong>(3 marks)</strong> Base on the given class diagram, create the class <strong>Q1</strong>.</p>
<p>Build a program that reads an input file and writes the results to an output file following these rules:</p>
<p><strong>Input:</strong> the input is stored in the <code>input.txt</code> text file.</p>
<ul>
  <li>The first line contains a positive integer T (1 ≤ T ≤ 100), which represents the number of test cases.</li>
  <li>Each of the next T lines contains one of the following five types of commands:
    <ol>
      <li><code>Add id name salary department</code> — adds a new employee.</li>
      <li><code>Update id name salary department</code> — updates an employee based on the given ID.</li>
      <li><code>Print</code> — displays the list of employees.</li>
      <li><code>Sort</code> — sorts the employee list by name.</li>
      <li><code>Clear</code> — remove all employees and print <code>"Cleared employee list."</code></li>
    </ol>
  </li>
</ul>
<p><strong>Output:</strong> all results must be written to the <code>output.txt</code> file.</p>
<p>The given skeleton (see the "given materials" download) has a fixed structure you must keep: <code>setFile(args)</code>, <code>read()</code> (reads <code>input.txt</code> via a <code>Scanner</code>), <code>solve()</code> (runs the algorithm), <code>printResult()</code> (writes to <code>output.txt</code> via a <code>FileWriter</code>), called in that order from <code>main()</code>.</p>`;
const q4PromptVi = `<p><strong>(3 điểm)</strong> Dựa vào sơ đồ lớp cho sẵn, viết lớp <strong>Q1</strong>.</p>
<p>Viết chương trình đọc file input và ghi kết quả ra file output theo các quy tắc sau:</p>
<p><strong>Input:</strong> input được lưu trong file text <code>input.txt</code>.</p>
<ul>
  <li>Dòng đầu tiên chứa số nguyên dương T (1 ≤ T ≤ 100), là số lượng test case.</li>
  <li>Mỗi dòng trong T dòng tiếp theo chứa 1 trong 5 loại lệnh sau:
    <ol>
      <li><code>Add id name salary department</code> — thêm 1 nhân viên mới.</li>
      <li><code>Update id name salary department</code> — cập nhật nhân viên theo ID cho trước.</li>
      <li><code>Print</code> — hiển thị danh sách nhân viên.</li>
      <li><code>Sort</code> — sắp xếp danh sách nhân viên theo name.</li>
      <li><code>Clear</code> — xoá toàn bộ nhân viên, in ra <code>"Cleared employee list."</code></li>
    </ol>
  </li>
</ul>
<p><strong>Output:</strong> toàn bộ kết quả phải được ghi ra file <code>output.txt</code>.</p>
<p>Khung skeleton given (xem file tải "given materials") có cấu trúc cố định phải giữ nguyên: <code>setFile(args)</code>, <code>read()</code> (đọc <code>input.txt</code> qua <code>Scanner</code>), <code>solve()</code> (chạy thuật toán), <code>printResult()</code> (ghi ra <code>output.txt</code> qua <code>FileWriter</code>), gọi theo đúng thứ tự đó trong <code>main()</code>.</p>`;

const q4ExplainEn = `<p><strong>Trap:</strong> the written spec says the Clear command should print <code>"Cleared employee list."</code>, but the exam's OWN sample output table shows <code>"Clear all."</code> — the actual grading harness's expected output overrides the prose description whenever they conflict (a pattern seen on other PRO192 PE papers too). This solution follows the sample table's <code>"Clear all."</code>, since that is what real grading actually checks.</p>
<p>Output blocks per command (exact labels, verified against all 3 given samples): <code>Add</code> → <code>"Added:"</code> then the employee's <code>toString()</code>; <code>Update</code> → <code>"Updated:"</code> then <code>toString()</code>; <code>Print</code> → <code>"Employees:"</code> then one <code>toString()</code> per line (in <code>listAll()</code> order — i.e. insertion order, since nothing in these samples permanently re-sorts the store); <code>Sort</code> → <code>"Sorted:"</code> then one <code>toString()</code> per line in <code>sortByName()</code> order; <code>Clear</code> → <code>"Clear all."</code> only, no employee lines.</p>
<p>Reading <code>input.txt</code>: the first line is <code>T</code>, then exactly <code>T</code> more lines, one command per line (commands are read with <code>Scanner.nextLine()</code> after consuming <code>T</code>, and each line is <code>trim()</code>-med and split on whitespace — the real given sample 3 input has trailing spaces after some commands, e.g. <code>"Add 1 Alice 1500.00 HR         "</code>, so trimming/whitespace-splitting is required, not exact-length parsing).</p>
<p>Verified by compiling all 4 parts together and running <code>java q1.Q1</code> against the 3 real given <code>input1.txt</code>/<code>input2.txt</code>/<code>input3.txt</code> files, diffing the produced <code>output.txt</code> byte-for-byte against the exam's sample tables — all 3 match exactly:</p>
<pre>Sample run 1 — input.txt:
2
Add 1 Alice 1500.00 HR
Print

OUTPUT (output.txt):
Added:
1-Alice-1500.00-HR
Employees:
1-Alice-1500.00-HR

Sample run 2 — input.txt:
5
Add 1 Alice 1500.00 HR
Update 1 Ali 1300.00 IT
Clear
Add 1 Alice 1500.00 HR
Print

OUTPUT (output.txt):
Added:
1-Alice-1500.00-HR
Updated:
1-Ali-1300.00-IT
Clear all.
Added:
1-Alice-1500.00-HR
Employees:
1-Alice-1500.00-HR

Sample run 3 — input.txt:
5
Add 1 Alice 1500.00 HR
Add 2 Bob 2200.00 IT
Add 3 Alex 1800.00 IT
Add 4 Daisy 2500.00 Finance
Sort

OUTPUT (output.txt):
Added:
1-Alice-1500.00-HR
Added:
2-Bob-2200.00-IT
Added:
3-Alex-1800.00-IT
Added:
4-Daisy-2500.00-Finance
Sorted:
3-Alex-1800.00-IT
1-Alice-1500.00-HR
2-Bob-2200.00-IT
4-Daisy-2500.00-Finance</pre>`;
const q4ExplainVi = `<p><strong>Bẫy:</strong> đặc tả bằng chữ ghi lệnh Clear phải in <code>"Cleared employee list."</code>, nhưng bảng sample output CỦA CHÍNH đề lại cho thấy <code>"Clear all."</code> — output mẫu thật trong bảng mới là thứ bộ chấm thật kiểm, ghi đè phần mô tả bằng chữ khi hai bên mâu thuẫn (kiểu bẫy đã gặp ở các đề PE PRO192 khác). Lời giải này theo đúng <code>"Clear all."</code> trong bảng mẫu, vì đó mới là thứ chấm thật kiểm.</p>
<p>Khối output theo từng lệnh (nhãn chính xác, đã kiểm với cả 3 mẫu đề cho): <code>Add</code> → <code>"Added:"</code> rồi <code>toString()</code> của nhân viên; <code>Update</code> → <code>"Updated:"</code> rồi <code>toString()</code>; <code>Print</code> → <code>"Employees:"</code> rồi mỗi dòng 1 <code>toString()</code> (theo thứ tự <code>listAll()</code> — tức thứ tự thêm vào, vì không có gì trong các mẫu này sắp lại store vĩnh viễn); <code>Sort</code> → <code>"Sorted:"</code> rồi mỗi dòng 1 <code>toString()</code> theo thứ tự <code>sortByName()</code>; <code>Clear</code> → chỉ <code>"Clear all."</code>, không có dòng nhân viên nào.</p>
<p>Đọc <code>input.txt</code>: dòng đầu là <code>T</code>, sau đó đúng <code>T</code> dòng, mỗi dòng 1 lệnh (đọc bằng <code>Scanner.nextLine()</code> sau khi đã đọc <code>T</code>, mỗi dòng được <code>trim()</code> rồi tách theo khoảng trắng — mẫu 3 given thật có khoảng trắng thừa sau vài lệnh, vd <code>"Add 1 Alice 1500.00 HR         "</code>, nên bắt buộc phải trim/tách theo whitespace, không được parse theo độ dài cố định).</p>
<p>Đã kiểm bằng cách biên dịch cả 4 phần cùng nhau rồi chạy <code>java q1.Q1</code> với 3 file <code>input1.txt</code>/<code>input2.txt</code>/<code>input3.txt</code> given thật, so khớp từng byte <code>output.txt</code> tạo ra với bảng mẫu của đề — cả 3 khớp chính xác 100% (xem khối mẫu ở bản tiếng Anh phía trên).</p>`;

const q4 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Q1 {
    //Change the name of input and output file based on practical paper
    String inputFile = "input.txt";
    String outputFile = "output.txt";

    //--VARIABLES - @STUDENT: DECLARE YOUR VARIABLES HERE:
    // TODO: e.g. List<String[]> commands, an InMemoryEmployeeManagement, a StringBuilder result


    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    String fi, fo;

    public void setFile (String[] args){
        fi = args.length>=2? args[0]: inputFile;
        fo = args.length>=2? args[1]: outputFile;
    }

    public void read(){
        try (Scanner sc  = new Scanner(new File(fi))){
    //--END FIXED PART----------------------------

            //INPUT - @STUDENT: ADD YOUR CODE FOR INPUT HERE:
            // TODO: read T, then read T more lines, store each parsed command


    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            sc.close();
        }catch(FileNotFoundException ex){
            System.out.println("Input Exception # " + ex);
        }
    }
    //--END FIXED PART----------------------------

    //ALGORITHM - @STUDENT: ADD YOUROWN METHODS HERE (IF NEED):


    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    public void solve(){
    //--END FIXED PART----------------------------

        //ALGORITHM - @STUDENT: ADD YOUR CODE HERE:
        // TODO: for each command, run it against an InMemoryEmployeeManagement
        // and append the right output block (Added:/Updated:/Employees:/Sorted:/Clear all.)


    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    }

    public void printResult(){
	    try{
            FileWriter fw = new FileWriter(fo);
    //--END FIXED PART----------------------------

        	//OUTPUT - @STUDENT: ADD YOUR CODE FOR OUTPUT HERE:
            fw.write( /*...*/ );


    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            fw.flush();
            fw.close();
        }catch (IOException ex){
            System.out.println("Output Exception # " + ex);
        }
    }

    public static void main(String[] args) {
        Q1 q = new Q1();
        q.setFile(args);
        q.read();
        q.solve();
        q.printResult();
    }
	//--END FIXED PART----------------------------
}`,
  sampleSolution: read('q3/material_3/src/Q1.java'),
  expectedOutput:
`Sample run 1 (TC 1 — Add + Print):
input.txt:
2
Add 1 Alice 1500.00 HR
Print

OUTPUT (output.txt):
Added:
1-Alice-1500.00-HR
Employees:
1-Alice-1500.00-HR

Sample run 2 (TC 2 — Add + Update + Clear + Add + Print):
input.txt:
5
Add 1 Alice 1500.00 HR
Update 1 Ali 1300.00 IT
Clear
Add 1 Alice 1500.00 HR
Print

OUTPUT (output.txt):
Added:
1-Alice-1500.00-HR
Updated:
1-Ali-1300.00-IT
Clear all.
Added:
1-Alice-1500.00-HR
Employees:
1-Alice-1500.00-HR

Sample run 3 (TC 3 — Add x4 + Sort):
input.txt:
5
Add 1 Alice 1500.00 HR
Add 2 Bob 2200.00 IT
Add 3 Alex 1800.00 IT
Add 4 Daisy 2500.00 Finance
Sort

OUTPUT (output.txt):
Added:
1-Alice-1500.00-HR
Added:
2-Bob-2200.00-IT
Added:
3-Alex-1800.00-IT
Added:
4-Daisy-2500.00-Finance
Sorted:
3-Alex-1800.00-IT
1-Alice-1500.00-HR
2-Bob-2200.00-IT
4-Daisy-2500.00-Finance`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'read', criterion: B('Correctly reads T then T command lines from input.txt (handles trailing whitespace).', 'Đọc đúng T rồi T dòng lệnh từ input.txt (xử lý được khoảng trắng thừa cuối dòng).'), weight: 1, maxScore: 0.5 },
    { id: 'add_update', criterion: B('Add/Update commands parsed correctly and produce "Added:"/"Updated:" + toString() blocks.', 'Lệnh Add/Update parse đúng, tạo đúng khối "Added:"/"Updated:" + toString().'), weight: 1, maxScore: 0.75 },
    { id: 'print_sort', criterion: B('Print/Sort commands produce "Employees:"/"Sorted:" blocks listing all employees in the right order.', 'Lệnh Print/Sort tạo đúng khối "Employees:"/"Sorted:" liệt kê đúng thứ tự.'), weight: 1, maxScore: 0.75 },
    { id: 'clear', criterion: B('Clear command empties the list and prints exactly "Clear all." (matches the sample table, not the prose spec).', 'Lệnh Clear xoá sạch danh sách, in đúng "Clear all." (khớp bảng mẫu, không phải mô tả bằng chữ).'), weight: 1, maxScore: 0.5 },
    { id: 'file_io', criterion: B('Writes the complete accumulated result to output.txt via FileWriter, keeping the fixed read/solve/printResult structure.', 'Ghi đầy đủ kết quả tích luỹ ra output.txt qua FileWriter, giữ đúng cấu trúc cố định read/solve/printResult.'), weight: 1, maxScore: 0.5 },
  ],
};

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE9-FA25-P1',
      title: B('PRO192 — Practical Exam Đề 9 (FA25, Paper No. 1)', 'PRO192 — Đề thi thực hành số 9 (FA25, Paper No. 1)'),
      description: B(
        'Real PRO192 PE paper (single Question 1, 10 marks, split into 4 parts here) — a file-based (input.txt → output.txt) employee management program: 1 interface + 3 classes (encapsulation, Comparable, an ArrayList-backed in-memory store). Solutions written from the UML spec and verified by compiling with javac and running against the real given input.txt samples.',
        'Đề PE PRO192 thật (chỉ 1 Question 1 duy nhất, 10 điểm, tách thành 4 phần ở đây) — chương trình quản lý nhân viên làm việc với FILE (input.txt → output.txt): 1 interface + 3 class (đóng gói, Comparable, kho lưu trong bộ nhớ dựa trên ArrayList). Lời giải viết từ đặc tả UML và đã kiểm bằng cách biên dịch javac + chạy với 3 file input.txt mẫu given thật.',
      ),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      source: 'REAL',
      isPublished: true,
      instructions,
      attachmentUrl: ATTACHMENT_URL,
      attachmentName: B('Download given materials (skeleton Q1.java + 3 sample input.txt files)', 'Tải given materials (khung Q1.java + 3 file input.txt mẫu)'),
      questions: [q1, q2, q3, q4],
    },
  ],
};

fs.writeFileSync(
  OUT,
  `// AUTO-GENERATED by scripts/build-pro192-pe9.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
