/**
 * build-pro192-pe10.mjs — sinh content/exams/PRO192-PE10.mjs.
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
 * Nguồn đã verify: scratchpad pro192-pe/de10/q{0..3} — mỗi thư mục compile
 * xong bằng `javac` cùng Main.class thật của given materials, chạy `java Main`
 * với đúng stdin mẫu trong đề, output khớp với PDF cho MỌI sample run trong cả
 * 4 câu (không có trang thiếu / spec thiếu ở đề này).
 *
 * Nguồn zip gốc (Given.rar) đã sạch — chỉ có Main.class (+ IBook.class,
 * IFile.class) và scaffold NetBeans, không có lời giải kèm sẵn (Q1's src/
 * chỉ có 1 Student.java rỗng — template NetBeans mặc định, không phải lời
 * giải, đã loại khỏi bản đóng gói lại). Attachment repackage lại thủ công
 * (Q1-Q4/{src,nbproject,build.xml,manifest.mf}, giữ Main.class + IBook.class/
 * IFile.class) rồi upload R2 PRO192/PE10-Given.zip, verify GET 200 + unzip
 * đúng 42 file, và sanity-check từng Q bằng cách chép lời giải vào rồi
 * compile+run thật (rồi xoá lại) trước khi zip.
 *
 * TRAP đã gặp (xem rubric/explanation Q1): đặc tả chữ của setName() nói
 * "return the name with the first letter in uppercase" nhưng sample OUTPUT
 * thật trong đề ("hoa nguyen, 5.4") KHÔNG hề viết hoa gì cả — đã verify bằng
 * cách chạy thật với Main.class given, kết luận: chỉ nối chuỗi thuần, không
 * áp dụng transform hoa/thường nào. Ưu tiên sample OUTPUT thật (grading THẬT
 * so khớp output) hơn câu chữ mô tả không khớp.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE10.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/2c89fc57-9aa7-4c2e-8cc0-a484bfb4eb0f/scratchpad/pro192-pe/de10';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE10.mjs');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').trimEnd();

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE10-Given.zip';

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> (transcribed from the real exam paper).</p>
   <ol>
     <li>Software required: NetBeans 13 or later, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Students are ONLY allowed to use their own study materials (sample code, program examples) stored on their own computer. For distance learning: Google Meet, Hangout (for exam monitoring purpose).</li>
     <li>Create a folder to save the given projects (e.g. PRO_given), download the given materials into it. Open NetBeans, open the given Qx project, then complete it according to the exam requirements. Do NOT delete or edit given files, or create a java file with the same name as a given file.</li>
     <li>Before submission: run "Clean and Build Project" (Shift+F11); for each question create two sub-folders <strong>run</strong> and <strong>src</strong>, copy the built <code>Qx.jar</code> into <strong>run</strong> and the entire project source into <strong>src</strong>.</li>
     <li>Do NOT use accented Vietnamese in code comments. Do NOT change the names of the folders/files specified in the exam, or the marking software cannot find the executable (.jar) to grade. All .java source files use the NetBeans default package.</li>
   </ol>
   <p>This exam room cannot run NetBeans/JDK in the browser, so you type each class directly into the code box below and it is graded by AI against the rubric — but the "given materials" download above is the REAL given project (with the compiled <code>Main.class</code> harness) so you can build &amp; run it for real on your own machine exactly like the actual PE, and cross-check your output against the samples shown.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> (dịch nguyên văn từ đề thi thật).</p>
   <ol>
     <li>Yêu cầu phần mềm: NetBeans 13 trở lên, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Sinh viên CHỈ được dùng tài liệu học tập (mã mẫu, ví dụ chương trình) lưu trên máy tính của mình. Học từ xa: dùng Google Meet, Hangout (để giám thị theo dõi).</li>
     <li>Tạo một thư mục chứa các project given (vd PRO_given), tải given materials vào đó. Mở NetBeans, mở project Qx tương ứng, hoàn thành theo yêu cầu đề bài. KHÔNG xoá/sửa file given, KHÔNG tạo file java trùng tên với file given.</li>
     <li>Trước khi nộp: chạy "Clean and Build Project" (Shift+F11); với mỗi câu tạo 2 thư mục con <strong>run</strong> và <strong>src</strong>, chép file <code>Qx.jar</code> đã build vào <strong>run</strong>, chép toàn bộ mã nguồn project vào <strong>src</strong>.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment code. KHÔNG đổi tên các thư mục/file đã quy định trong đề, nếu không phần mềm chấm sẽ không tìm thấy file thực thi (.jar) để chấm. Mọi file nguồn .java dùng package mặc định của NetBeans.</li>
   </ol>
   <p>Phòng thi web không chạy được NetBeans/JDK trực tiếp trên trình duyệt, nên bạn gõ thẳng từng class vào ô mã bên dưới và được AI chấm theo tiêu chí — nhưng file "given materials" tải ở trên là project given THẬT (kèm harness <code>Main.class</code> đã biên dịch sẵn) để bạn có thể build &amp; chạy thật trên máy mình y hệt bài thi thật, và tự đối chiếu kết quả với các mẫu bên dưới.</p>`,
);

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ── Q1: Student ──
const q1PromptEn = `<p><strong>(2 marks)</strong> Do not pay attention to real meaning of objects, variables and their values in the questions below.</p>
<p>Write a class named <strong>Student</strong> with the following information:</p>
${table([
  '-name: String<br/>-gpa: double',
  '+Student()<br/>+Student(name: String, gpa: double)<br/>+getPass(): String<br/>+setName(lastname: String)<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>Student()</code> — default constructor.</li>
  <li><code>Student(name: String, gpa: double)</code> — constructor, which sets values for all attributes.</li>
  <li><code>getPass(): String</code> — return "pass" if gpa&gt;=5.0 otherwise return "fail".</li>
  <li><code>setName(lastname: String)</code> — return the name with the first letter in uppercase.</li>
  <li><code>toString(): String</code> — return String with format <strong>name, gpa</strong>.</li>
</ul>
<p><em>Do not format the result.</em></p>`;
const q1PromptVi = `<p><strong>(2 điểm)</strong> Bỏ qua ý nghĩa thực tế của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</p>
<p>Viết lớp tên <strong>Student</strong> với thông tin sau:</p>
${table([
  '-name: String<br/>-gpa: double',
  '+Student()<br/>+Student(name: String, gpa: double)<br/>+getPass(): String<br/>+setName(lastname: String)<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Student()</code> — constructor mặc định.</li>
  <li><code>Student(name: String, gpa: double)</code> — constructor, gán giá trị cho tất cả các thuộc tính.</li>
  <li><code>getPass(): String</code> — trả về "pass" nếu gpa&gt;=5.0, ngược lại trả về "fail".</li>
  <li><code>setName(lastname: String)</code> — trả về name kèm chữ cái đầu viết hoa.</li>
  <li><code>toString(): String</code> — trả về chuỗi định dạng <strong>name, gpa</strong>.</li>
</ul>
<p><em>Không định dạng lại kết quả.</em></p>`;

const q1ExplainEn = `<p><strong>Trap in the source PDF itself:</strong> the written spec says <code>setName(lastname)</code> should "return the name with the first letter in uppercase", but the exam's own sample OUTPUT shows <code>name="hoa"</code>, <code>setName("nguyen")</code> → <code>toString()</code> prints exactly <strong>"hoa nguyen, 5.4"</strong> — no uppercase anywhere (not on "hoa", not on "nguyen", not on the combined string). Since <code>setName</code> is <code>void</code> (no return type in the UML box, confirmed by decompiling the real given <code>Main.class</code>: <code>invokevirtual Student.setName:(Ljava/lang/String;)V</code>) and grading is by exact output match, the sample output is ground truth: this method just concatenates <code>name + " " + lastname</code>, no case transform.</p>
<p>Verified against both given samples by compiling <code>Student.java</code> with the real given <code>Main.class</code>:</p>
<pre>Enter name: hoa
Enter gpa: 5.4
Enter TC (1 or 2): 1
Enter lastname: nguyen
OUTPUT:
hoa nguyen, 5.4</pre>
<pre>Enter name: lan
Enter gpa: 4.5
Enter TC (1 or 2): 2
OUTPUT:
fail</pre>`;
const q1ExplainVi = `<p><strong>Bẫy nằm ngay trong đề PDF gốc:</strong> đặc tả chữ nói <code>setName(lastname)</code> "trả về name kèm chữ cái đầu viết hoa", nhưng OUTPUT mẫu THẬT trong đề với <code>name="hoa"</code>, <code>setName("nguyen")</code> → <code>toString()</code> in đúng <strong>"hoa nguyen, 5.4"</strong> — không viết hoa chỗ nào cả (không phải "hoa", không phải "nguyen", không phải chuỗi ghép). Vì <code>setName</code> là <code>void</code> (UML không ghi kiểu trả về, đã xác nhận bằng decompile <code>Main.class</code> given thật: <code>invokevirtual Student.setName:(Ljava/lang/String;)V</code>) và chấm điểm dựa vào khớp output chính xác, output mẫu là chuẩn: hàm này chỉ nối <code>name + " " + lastname</code>, không biến đổi hoa/thường gì cả.</p>
<p>Đã đối chiếu với cả 2 mẫu trong đề bằng cách biên dịch <code>Student.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>Enter name: hoa
Enter gpa: 5.4
Enter TC (1 or 2): 1
Enter lastname: nguyen
OUTPUT:
hoa nguyen, 5.4</pre>
<pre>Enter name: lan
Enter gpa: 4.5
Enter TC (1 or 2): 2
OUTPUT:
fail</pre>`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `public class Student {
    private String name;
    private double gpa;

    public Student() {
        // TODO
    }

    public Student(String name, double gpa) {
        // TODO
    }

    public String getPass() {
        // TODO: "pass" if gpa >= 5.0 else "fail"
        return null;
    }

    public void setName(String lastname) {
        // TODO: update name (see explanation — no case transform, just concatenate)
    }

    @Override
    public String toString() {
        // TODO: "name, gpa"
        return null;
    }
}`,
  sampleSolution: read('q0/material_0/src/Student.java'),
  expectedOutput:
`Sample run 1 (TC 1 — setName, name="hoa" gpa=5.4, lastname="nguyen"):
OUTPUT:
hoa nguyen, 5.4

Sample run 2 (TC 2 — getPass, name="lan" gpa=4.5):
OUTPUT:
fail`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'ctor', criterion: B('Both constructors set name and gpa correctly.', 'Cả 2 constructor gán đúng name và gpa.'), weight: 1, maxScore: 0.5 },
    { id: 'setName', criterion: B('setName() updates name to "name + \\" \\" + lastname" with no extra case transform (matches the real sample output, not the misleading spec sentence).', 'setName() cập nhật name thành "name + \\" \\" + lastname", không biến đổi hoa/thường (khớp output mẫu thật, không theo câu chữ đặc tả gây hiểu lầm).'), weight: 2, maxScore: 1 },
    { id: 'getPass_toString', criterion: B('getPass() threshold is correct (>=5.0); toString() returns "name, gpa" unformatted.', 'getPass() đúng ngưỡng (>=5.0); toString() trả về "name, gpa" không định dạng.'), weight: 1, maxScore: 0.5 },
  ],
};

// ── Q2: Car + SpecCar ──
const q2PromptEn = `<p><strong>(3 marks)</strong> Write a class <strong>Car</strong> and a class <strong>SpecCar</strong> extending from <strong>Car</strong> (i.e. Car is a superclass and SpecCar is a subclass) with the following information:</p>
${table([
  '-color: String<br/>-seat: int',
  '+Car()<br/>+Car(color: String, seat: int)<br/>+getColor(): String<br/>+getSeat(): int<br/>+setColor(color: String): void<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>getColor(): String</code> — return color.</li>
  <li><code>getSeat(): int</code> — return Seat.</li>
  <li><code>setColor(color: String): void</code> — update color.</li>
  <li><code>toString(): String</code> — return the string of format: <strong>color, seat</strong>.</li>
</ul>
${table([
  '-model: String',
  '+SpecCar()<br/>+SpecCar(color: String, Seat: int, model: String)<br/>+getModel(): String<br/>+toString(): String<br/>+setData(): void<br/>+getValue(): String',
])}
<p>Where:</p>
<ul>
  <li><code>toString(): String</code> — return the string of format: <strong>color, seat, model</strong>.</li>
  <li><code>getModel(): String</code> — return model.</li>
  <li><code>setData(): void</code> — Remove the first letter in the color string.</li>
  <li><code>getValue(): String</code> — Check if the seat is an odd number then return model after removing characters at odd indices (1-based means i+1, ex: bmw have 3 characters and the character 'b' is 1, 'm' is 2 ...) from model, otherwise return model.</li>
</ul>`;
const q2PromptVi = `<p><strong>(3 điểm)</strong> Viết lớp <strong>Car</strong> và lớp <strong>SpecCar</strong> kế thừa từ <strong>Car</strong> (Car là lớp cha, SpecCar là lớp con), thông tin như sau:</p>
${table([
  '-color: String<br/>-seat: int',
  '+Car()<br/>+Car(color: String, seat: int)<br/>+getColor(): String<br/>+getSeat(): int<br/>+setColor(color: String): void<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>getColor(): String</code> — trả về color.</li>
  <li><code>getSeat(): int</code> — trả về Seat.</li>
  <li><code>setColor(color: String): void</code> — cập nhật color.</li>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>color, seat</strong>.</li>
</ul>
${table([
  '-model: String',
  '+SpecCar()<br/>+SpecCar(color: String, Seat: int, model: String)<br/>+getModel(): String<br/>+toString(): String<br/>+setData(): void<br/>+getValue(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>color, seat, model</strong>.</li>
  <li><code>getModel(): String</code> — trả về model.</li>
  <li><code>setData(): void</code> — Xoá ký tự đầu tiên trong chuỗi color.</li>
  <li><code>getValue(): String</code> — Nếu seat là số lẻ thì trả về model sau khi xoá các ký tự ở vị trí lẻ (đánh số từ 1, vd "bmw" có 3 ký tự, 'b' là vị trí 1, 'm' là vị trí 2 ...), ngược lại trả về nguyên model.</li>
</ul>`;

const q2ExplainEn = `<p>Decompiling the real given <code>Main.class</code> (bytecode, not guesswork) shows the harness builds ONE <code>Car</code> and ONE <code>SpecCar</code> from the same input (color, seat for Car; color, seat, model for SpecCar), then dispatches on the chosen TC: TC1 (toString) calls <strong>both</strong> <code>car.toString()</code> and <code>specCar.toString()</code> — two lines. TC2 (setData) calls <code>specCar.setData()</code> then prints <code>specCar.toString()</code> — one line. TC3 (getValue) calls <code>specCar.getValue()</code> directly — one line, no toString().</p>
<p>"Remove characters at odd indices (1-based)" means KEEP the characters at even 1-based indices: for "bmw" (b=1,m=2,w=3) removing odd indices 1,3 leaves only "m". For "innova" (i=1,n=2,n=3,o=4,v=5,a=6) removing 1,3,5 leaves "n","o","a" → "noa".</p>
<p>Verified against all 4 given samples by compiling <code>Car.java</code>/<code>SpecCar.java</code> with the real given <code>Main.class</code>:</p>
<pre>color=blue seat=4 model=vios → TC1 (toString)
OUTPUT:
blue, 4
blue, 4, vios

color=3blue seat=2 model=bmw → TC2 (setData)
OUTPUT:
blue, 2, bmw

color=white seat=7 model=innova → TC3 (getValue, odd seat)
OUTPUT:
noa

color=white seat=4 model=madaz → TC3 (getValue, even seat)
OUTPUT:
madaz</pre>`;
const q2ExplainVi = `<p>Decompile trực tiếp <code>Main.class</code> given thật (đọc bytecode, không suy đoán) cho thấy harness tạo MỘT <code>Car</code> và MỘT <code>SpecCar</code> từ cùng input (color, seat cho Car; color, seat, model cho SpecCar), rồi rẽ nhánh theo TC chọn: TC1 (toString) gọi <strong>cả hai</strong> <code>car.toString()</code> và <code>specCar.toString()</code> — 2 dòng. TC2 (setData) gọi <code>specCar.setData()</code> rồi in <code>specCar.toString()</code> — 1 dòng. TC3 (getValue) gọi thẳng <code>specCar.getValue()</code> — 1 dòng, không qua toString().</p>
<p>"Xoá ký tự ở vị trí lẻ (đánh số từ 1)" nghĩa là GIỮ LẠI ký tự ở vị trí chẵn: với "bmw" (b=1,m=2,w=3) xoá vị trí lẻ 1,3 chỉ còn "m". Với "innova" (i=1,n=2,n=3,o=4,v=5,a=6) xoá vị trí 1,3,5 còn lại "n","o","a" → "noa".</p>
<p>Đã đối chiếu với cả 4 mẫu trong đề bằng cách biên dịch <code>Car.java</code>/<code>SpecCar.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>color=blue seat=4 model=vios → TC1 (toString)
OUTPUT:
blue, 4
blue, 4, vios

color=3blue seat=2 model=bmw → TC2 (setData)
OUTPUT:
blue, 2, bmw

color=white seat=7 model=innova → TC3 (getValue, seat lẻ)
OUTPUT:
noa

color=white seat=4 model=madaz → TC3 (getValue, seat chẵn)
OUTPUT:
madaz</pre>`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `public class Car {
    private String color;
    private int seat;
    // TODO: Car(), Car(color, seat), getColor, getSeat, setColor,
    // toString() ("color, seat")
}

class SpecCar extends Car {
    private String model;
    // TODO: SpecCar(), SpecCar(color, seat, model), getModel,
    // toString() ("color, seat, model"),
    // setData() (remove first letter of color),
    // getValue() (seat odd -> model with odd 1-based indices removed, else model)
}`,
  sampleSolution: `${read('q1/material_1/src/Car.java')}\n\n${read('q1/material_1/src/SpecCar.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — toString, color=blue seat=4 model=vios):
OUTPUT:
blue, 4
blue, 4, vios

Sample run 2 (TC 2 — setData, color=3blue seat=2 model=bmw):
OUTPUT:
blue, 2, bmw

Sample run 3 (TC 3 — getValue, color=white seat=7 model=innova, odd seat):
OUTPUT:
noa

Sample run 4 (TC 3 — getValue, color=white seat=4 model=madaz, even seat):
OUTPUT:
madaz`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'ctor_tostring', criterion: B('Both toString() formats are correct ("color, seat" and "color, seat, model"), constructors set fields via super() correctly.', 'Cả 2 định dạng toString() đều đúng ("color, seat" và "color, seat, model"), constructor gán field qua super() đúng.'), weight: 1, maxScore: 1 },
    { id: 'setData', criterion: B('setData() removes only the first character of color (via getColor/setColor, not touching seat/model).', 'setData() chỉ xoá ký tự đầu tiên của color (qua getColor/setColor, không đụng seat/model).'), weight: 1, maxScore: 1 },
    { id: 'getValue', criterion: B('getValue() correctly keeps only even 1-based-index characters when seat is odd, else returns model unchanged.', 'getValue() giữ đúng ký tự vị trí chẵn (đánh số từ 1) khi seat lẻ, ngược lại trả về nguyên model.'), weight: 1, maxScore: 1 },
  ],
};

// ── Q3: Book + IBook + MyBook ──
const IBOOK_SRC = `import java.util.List;
public interface IBook {
    public int f1(List<Book> t);
    public void f2(List<Book> t);
    public void f3(List<Book> t);
}`;

const q3PromptEn = `<p><strong>(3 marks)</strong> Write a class <strong>Book</strong> with the following information:</p>
${table([
  '-author: String<br/>-page: int',
  '+Book()<br/>+Book(author: String, page: int)<br/>+getAuthor(): String<br/>+getPage(): int<br/>+setAuthor(author: String): void<br/>+setPage(page: int): void',
])}
<p>Where:</p>
<ul>
  <li><code>getAuthor(): String</code> — return author.</li>
  <li><code>getPage(): int</code> — return page.</li>
  <li><code>setAuthor(author: String): void</code> — update author.</li>
  <li><code>setPage(page: int): void</code> — update page.</li>
</ul>
<p>The interface <strong>IBook</strong> below is already compiled and given in byte code format, thus <strong>you can use it without creating IBook.java file</strong>:</p>
<pre>${IBOOK_SRC}</pre>
<p>Write a class <strong>MyBook</strong>, which implements the interface <strong>IBook</strong>. The class MyBook implements methods f1, f2 and f3 in IBook as below (you can add other functions in <strong>MyBook</strong> class):</p>
<ul>
  <li><strong>f1</strong>: Find the maximum page of all Books in the list where the author contains at least two words.</li>
  <li><strong>f2</strong>: Sort the elements in the list Book ascendingly by page.</li>
  <li><strong>f3</strong>: Remove all Books where the Book author starts with letter "N" and the Book page is equal the minimum page of all Books in the list. (if there is no element that satisfies the conditions then do nothing). (<em>Must ensure that the list is updated in-place and maintain its original order for the remaining elements</em>)</li>
</ul>`;
const q3PromptVi = `<p><strong>(3 điểm)</strong> Viết lớp <strong>Book</strong> với thông tin sau:</p>
${table([
  '-author: String<br/>-page: int',
  '+Book()<br/>+Book(author: String, page: int)<br/>+getAuthor(): String<br/>+getPage(): int<br/>+setAuthor(author: String): void<br/>+setPage(page: int): void',
])}
<p>Trong đó:</p>
<ul>
  <li><code>getAuthor(): String</code> — trả về author.</li>
  <li><code>getPage(): int</code> — trả về page.</li>
  <li><code>setAuthor(author: String): void</code> — cập nhật author.</li>
  <li><code>setPage(page: int): void</code> — cập nhật page.</li>
</ul>
<p>Interface <strong>IBook</strong> dưới đây đã biên dịch sẵn dạng byte code, bạn <strong>dùng thẳng không cần tạo file IBook.java</strong>:</p>
<pre>${IBOOK_SRC}</pre>
<p>Viết lớp <strong>MyBook</strong>, implement interface <strong>IBook</strong>. Lớp MyBook cài đặt các hàm f1, f2, f3 trong IBook như sau (bạn có thể thêm các hàm khác trong lớp <strong>MyBook</strong>):</p>
<ul>
  <li><strong>f1</strong>: Tìm page lớn nhất trong các Book có author chứa ít nhất 2 từ.</li>
  <li><strong>f2</strong>: Sắp xếp các phần tử trong danh sách Book tăng dần theo page.</li>
  <li><strong>f3</strong>: Xoá tất cả Book có author bắt đầu bằng chữ "N" và page bằng page nhỏ nhất trong danh sách. (nếu không có phần tử nào thoả điều kiện thì không làm gì). (<em>Phải đảm bảo danh sách được cập nhật tại chỗ (in-place) và giữ nguyên thứ tự ban đầu của các phần tử còn lại</em>)</li>
</ul>`;

const q3ExplainEn = `<p>Decompiling the real given <code>Main.class</code> shows it also calls a <strong>MyBook.display(List&lt;Book&gt;)</strong> method (not part of IBook — this is the "add other functions" the prompt allows/expects) to print the list, once BEFORE adding extra elements and once AFTER running f2/f3 (not after f1, which only prints an int). Each line is formatted <code>(author, page)</code> exactly, e.g. <code>(Nguyen Le, 210)</code>.</p>
<p>Initial hardcoded list: (Nguyen Le, 210), (Ta Tan, 50), (Ngoc Hoa, 50). The harness then reads N more books from input and appends them before running the chosen TC. f2 must be a <strong>stable</strong> sort (equal-page elements keep their relative order) — verified by sorting a list with two page=50 entries and confirming "Ta Tan" (originally 2nd) stays before "Ngoc Hoa" (originally 3rd) in the output.</p>
<p>Verified against all 3 given samples by compiling <code>Book.java</code>/<code>MyBook.java</code> with the real given <code>Main.class</code>:</p>
<pre>list + added (nguyen, 300) → TC1 (f1, max page among 2+ word authors)
OUTPUT:
210

list + 0 added → TC2 (f2, sort ascending by page, stable)
OUTPUT:
(Ta Tan, 50)
(Ngoc Hoa, 50)
(Nguyen Le, 210)

list + 0 added → TC3 (f3, remove author starts with "N" and page == min)
OUTPUT:
(Nguyen Le, 210)
(Ta Tan, 50)</pre>`;
const q3ExplainVi = `<p>Decompile <code>Main.class</code> given thật cho thấy nó còn gọi hàm <strong>MyBook.display(List&lt;Book&gt;)</strong> (không thuộc IBook — đây chính là "hàm khác" mà đề cho phép/yêu cầu thêm) để in danh sách, 1 lần TRƯỚC khi thêm phần tử và 1 lần SAU khi chạy f2/f3 (không in sau f1, vì f1 chỉ in ra 1 số nguyên). Mỗi dòng in đúng định dạng <code>(author, page)</code>, vd <code>(Nguyen Le, 210)</code>.</p>
<p>Danh sách khởi tạo sẵn: (Nguyen Le, 210), (Ta Tan, 50), (Ngoc Hoa, 50). Sau đó harness đọc thêm N book từ input rồi mới chạy TC được chọn. f2 phải là sort <strong>ổn định (stable)</strong> (các phần tử page bằng nhau giữ nguyên thứ tự tương đối) — đã kiểm bằng cách sort danh sách có 2 phần tử page=50 và xác nhận "Ta Tan" (gốc đứng thứ 2) vẫn đứng trước "Ngoc Hoa" (gốc đứng thứ 3) trong kết quả.</p>
<p>Đã đối chiếu với cả 3 mẫu trong đề bằng cách biên dịch <code>Book.java</code>/<code>MyBook.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>danh sách + thêm (nguyen, 300) → TC1 (f1, page lớn nhất trong các author >=2 từ)
OUTPUT:
210

danh sách + thêm 0 → TC2 (f2, sort tăng dần theo page, ổn định)
OUTPUT:
(Ta Tan, 50)
(Ngoc Hoa, 50)
(Nguyen Le, 210)

danh sách + thêm 0 → TC3 (f3, xoá author bắt đầu "N" và page == min)
OUTPUT:
(Nguyen Le, 210)
(Ta Tan, 50)</pre>`;

const q3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `import java.util.List;

public class Book {
    private String author;
    private int page;
    // TODO: Book(), Book(author, page), getAuthor, getPage, setAuthor, setPage
}

class MyBook implements IBook {
    // TODO: f1 (max page, author has >=2 words),
    // f2 (stable sort ascending by page),
    // f3 (remove author startsWith "N" && page == min, in-place, keep order)

    public void display(List<Book> t) {
        // Called by the real given Main.class to print the list —
        // print each Book as "(author, page)" on its own line.
    }
}`,
  sampleSolution: `${read('q2/material_2/src/Book.java')}\n\n${read('q2/material_2/src/MyBook.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — f1, initial list + added (nguyen, 300)):
OUTPUT:
210

Sample run 2 (TC 2 — f2, initial list, 0 added):
OUTPUT:
(Ta Tan, 50)
(Ngoc Hoa, 50)
(Nguyen Le, 210)

Sample run 3 (TC 3 — f3, initial list, 0 added):
OUTPUT:
(Nguyen Le, 210)
(Ta Tan, 50)`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'display', criterion: B('display(List<Book>) prints each Book exactly as "(author, page)", one per line (the real given Main.class calls this to show the list).', 'display(List<Book>) in đúng từng Book dạng "(author, page)", mỗi dòng 1 phần tử (Main.class given thật gọi hàm này để hiển thị danh sách).'), weight: 1, maxScore: 0.5 },
    { id: 'f1', criterion: B('f1() finds the max page only among books whose author has >= 2 words.', 'f1() tìm page lớn nhất chỉ trong các book có author >= 2 từ.'), weight: 1, maxScore: 1 },
    { id: 'f2', criterion: B('f2() sorts ascending by page with a STABLE sort (equal-page elements keep original relative order).', 'f2() sort tăng dần theo page, sort ỔN ĐỊNH (phần tử page bằng nhau giữ nguyên thứ tự gốc).'), weight: 1, maxScore: 0.75 },
    { id: 'f3', criterion: B('f3() removes (in-place, preserving order of remaining elements) only books where author starts with "N" AND page == minimum page.', 'f3() xoá tại chỗ (giữ thứ tự phần tử còn lại) chỉ các book có author bắt đầu "N" VÀ page == page nhỏ nhất.'), weight: 1, maxScore: 0.75 },
  ],
};

// ── Q4: MyFile implements IFile ──
const IFILE_SRC = `public interface IFile {
    public String f1(String str);
    public String f2(String str);
}`;

const q4PromptEn = `<p><strong>(2 marks)</strong> The interface <strong>IFile</strong> below is already compiled and given in byte code format, thus <strong>you can use it without creating IFile.java file</strong>:</p>
<pre>${IFILE_SRC}</pre>
<p>Write a class named <strong>MyFile</strong>, which implements the interface <strong>IFile</strong>. The class MyFile implements methods f1 and f2 in IFile as below:</p>
<ul>
  <li><strong>f1</strong>: Returns the extension of the string which represent a path of file. If the string don't have the extension of file return "wrong format".</li>
  <li><strong>f2</strong>: Return the new file name of the string which represent a path of file, with uppercase and add prefix "New_" at the begin of file name, in otherwise return "wrong format".</li>
</ul>`;
const q4PromptVi = `<p><strong>(2 điểm)</strong> Interface <strong>IFile</strong> dưới đây đã biên dịch sẵn dạng byte code, bạn <strong>dùng thẳng không cần tạo file IFile.java</strong>:</p>
<pre>${IFILE_SRC}</pre>
<p>Viết lớp tên <strong>MyFile</strong>, implement interface <strong>IFile</strong>. Lớp MyFile cài đặt các hàm f1 và f2 trong IFile như sau:</p>
<ul>
  <li><strong>f1</strong>: Trả về phần mở rộng (extension) của chuỗi biểu diễn đường dẫn file. Nếu chuỗi không có phần mở rộng thì trả về "wrong format".</li>
  <li><strong>f2</strong>: Trả về tên file mới của chuỗi biểu diễn đường dẫn file, viết hoa và thêm tiền tố "New_" vào đầu tên file, ngược lại trả về "wrong format".</li>
</ul>`;

const q4ExplainEn = `<p>The sample uses a Windows-style path <code>c:\\MyFile\\data.txt</code>. Both f1 and f2 first isolate the FILE NAME (the part after the last <code>\\</code> or <code>/</code>), then look for the last <code>.</code> in that file name only — a dot appearing earlier in a directory name must not be treated as an extension separator.</p>
<p><strong>f2</strong>'s "with uppercase" applies only to the file's base name (without the extension) — the extension itself is left as-is, then "New_" is prepended: <code>data.txt</code> → base "data" → uppercase "DATA" → <code>New_DATA.txt</code> (note the ".txt" stays lowercase). Verified against both given samples by compiling <code>MyFile.java</code> with the real given <code>Main.class</code>:</p>
<pre>Enter file path: c:\\MyFile\\data.txt
1. Test f1 → choice 1
OUTPUT:
txt</pre>
<pre>Enter file path: c:\\MyFile\\data.txt
2. Test f2 → choice 2
OUTPUT:
New_DATA.txt</pre>`;
const q4ExplainVi = `<p>Mẫu dùng đường dẫn kiểu Windows <code>c:\\MyFile\\data.txt</code>. Cả f1 và f2 đều phải tách TÊN FILE (phần sau dấu <code>\\</code> hoặc <code>/</code> cuối cùng) trước, rồi mới tìm dấu <code>.</code> cuối cùng trong TÊN FILE đó thôi — dấu chấm xuất hiện sớm hơn trong tên thư mục không được tính là dấu phân tách extension.</p>
<p>"Viết hoa" của <strong>f2</strong> chỉ áp dụng cho phần tên gốc của file (không gồm extension) — extension giữ nguyên, rồi thêm "New_" vào trước: <code>data.txt</code> → tên gốc "data" → viết hoa "DATA" → <code>New_DATA.txt</code> (chú ý ".txt" vẫn giữ chữ thường). Đã đối chiếu với cả 2 mẫu trong đề bằng cách biên dịch <code>MyFile.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>Enter file path: c:\\MyFile\\data.txt
1. Test f1 → choice 1
OUTPUT:
txt</pre>
<pre>Enter file path: c:\\MyFile\\data.txt
2. Test f2 → choice 2
OUTPUT:
New_DATA.txt</pre>`;

const q4 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `${IFILE_SRC}

public class MyFile implements IFile {
    // TODO: f1 (extension of the file name, or "wrong format" if none),
    // f2 (uppercase base name + original extension, prefixed "New_",
    //     or "wrong format" if no extension)
}`,
  sampleSolution: read('q3/material_3/src/MyFile.java'),
  expectedOutput:
`Sample run 1 (TC 1 — f1, input: "c:\\MyFile\\data.txt"):
OUTPUT:
txt

Sample run 2 (TC 2 — f2, input: "c:\\MyFile\\data.txt"):
OUTPUT:
New_DATA.txt`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'f1', criterion: B('f1() extracts the file name first, then returns the text after the last dot in that file name (not an earlier dot in a directory); "wrong format" when no extension.', 'f1() tách tên file trước, rồi trả về phần sau dấu chấm cuối cùng trong tên file đó (không phải dấu chấm sớm hơn trong tên thư mục); trả "wrong format" khi không có extension.'), weight: 1, maxScore: 1 },
    { id: 'f2', criterion: B('f2() uppercases only the base name, keeps the extension case as-is, prepends "New_"; "wrong format" when no extension.', 'f2() chỉ viết hoa phần tên gốc, giữ nguyên chữ hoa/thường của extension, thêm tiền tố "New_"; trả "wrong format" khi không có extension.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE10-FA25',
      title: B('PRO192 — Practical Exam Đề 10 (FA25)', 'PRO192 — Đề thi thực hành số 10 (FA25)'),
      description: B(
        'Real PRO192 PE paper (4 questions, 10 marks) — OOP class design (encapsulation, inheritance, toString formatting), one class implementing a List-based interface (sort/filter/aggregate over List<Book>), one interface implementation over file-path Strings. Solutions written & verified by compiling against the real given Main.class harness.',
        'Đề PE PRO192 thật (4 câu, 10 điểm) — thiết kế lớp OOP (đóng gói, kế thừa, định dạng toString), một lớp cài đặt interface thao tác trên List<Book> (sort/lọc/tổng hợp), một interface cài đặt trên chuỗi đường dẫn file. Lời giải đã viết và kiểm bằng cách biên dịch cùng harness Main.class given thật.',
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
  `// AUTO-GENERATED by scripts/build-pro192-pe10.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
