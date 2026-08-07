/**
 * build-pro192-pe14.mjs — sinh content/exams/PRO192-PE14.mjs.
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
 * Nguồn đã verify: scratchpad pro192-pe/de14/q{0..3} — mỗi thư mục compile
 * xong bằng `javac` cùng Main.class thật của given materials, chạy `java Main`
 * với đúng stdin mẫu trong đề, output khớp 100% với PDF.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE14.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/7a3dab05-4d89-4139-97aa-6d1578ef74f8/scratchpad/pro192-pe/de14';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE14.mjs');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').trimEnd();

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE14-Given.zip';

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> (transcribed from the real exam paper).</p>
   <ol>
     <li>Students are ONLY allowed to use materials on their own computer (including JDK, NetBeans...). For distance learning: Google Meet / Hangout for exam monitoring.</li>
     <li>Create a folder to store the given projects, download the given materials into it. Open NetBeans, open the given Q project, then complete it according to the exam requirements. Do NOT delete or edit the given files, or create a java file with the same name as the given files.</li>
     <li>Before submission: run "Clean and Build Project" (Shift+F11), rename the <code>dist</code> folder to <code>RUN</code> (or <code>run</code>). The run folder must contain only a jar file — e.g. <code>Q1.jar</code>.</li>
     <li>Do NOT use accented Vietnamese in code comments. Do NOT create a new project — you must use the given project. Do NOT use package in code.</li>
     <li>Software tools: <strong>Apache NetBeans IDE 17</strong> and <strong>Java JDK 1.8</strong>.</li>
   </ol>
   <p>This exam room cannot run NetBeans/JDK in the browser, so you type each class directly into the code box below and it is graded by AI against the rubric — but the "given materials" download above is the REAL given project (with the compiled <code>Main.class</code> harness) so you can build &amp; run it for real on your own machine exactly like the actual PE, and cross-check your output against the samples shown.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> (dịch nguyên văn từ đề thi thật).</p>
   <ol>
     <li>Sinh viên CHỈ được dùng tài liệu trên máy tính của mình (kể cả JDK, NetBeans...). Học từ xa: dùng Google Meet/Hangout để giám sát thi.</li>
     <li>Tạo một thư mục chứa các project given, tải given materials vào đó. Mở NetBeans, mở project Q tương ứng, hoàn thành theo yêu cầu đề bài. KHÔNG xoá/sửa file given, KHÔNG tạo file java trùng tên với file given.</li>
     <li>Trước khi nộp: chạy "Clean and Build Project" (Shift+F11), đổi tên thư mục <code>dist</code> thành <code>RUN</code> (hoặc <code>run</code>). Thư mục run chỉ được chứa duy nhất 1 file jar — ví dụ <code>Q1.jar</code>.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment code. KHÔNG tạo project mới — phải dùng project given. KHÔNG dùng package trong code.</li>
     <li>Công cụ bắt buộc: <strong>Apache NetBeans IDE 17</strong> và <strong>Java JDK 1.8</strong>.</li>
   </ol>
   <p>Phòng thi web không chạy được NetBeans/JDK trực tiếp trên trình duyệt, nên bạn gõ thẳng từng class vào ô mã bên dưới và được AI chấm theo tiêu chí — nhưng file "given materials" tải ở trên là project given THẬT (kèm harness <code>Main.class</code> đã biên dịch sẵn) để bạn có thể build &amp; chạy thật trên máy mình y hệt bài thi thật, và tự đối chiếu kết quả với các mẫu bên dưới.</p>`,
);

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ── Q1: Person ──
const q1PromptEn = `<p><strong>(2 marks)</strong> You should not pay attention to the real meaning of objects, variables and their values in the questions below.</p>
<p>Create a class called <strong>Person</strong> described as follows:</p>
${table([
  '-name: String<br/>-sickLeave: double',
  '+Person()<br/>+Person(name: String, sickLeave: double)<br/>+setSickLeave(upValue: double): void<br/>+getName(): String<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>Person()</code> — default constructor.</li>
  <li><code>Person(name: String, sickLeave: double)</code> — constructor, which sets values for all attributes.</li>
  <li><code>setSickLeave(upValue: double): void</code> — set sickLeave = sickLeave + upValue.</li>
  <li><code>getName(): String</code> — return the name in uppercase.</li>
  <li><code>toString(): String</code> — return String with format <strong>name,sickLeave</strong> (without a space after comma).</li>
</ul>
<p><em>Do not format the result.</em></p>`;
const q1PromptVi = `<p><strong>(2 điểm)</strong> Bỏ qua ý nghĩa thực tế của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</p>
<p>Tạo một lớp tên <strong>Person</strong> được mô tả như sau:</p>
${table([
  '-name: String<br/>-sickLeave: double',
  '+Person()<br/>+Person(name: String, sickLeave: double)<br/>+setSickLeave(upValue: double): void<br/>+getName(): String<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Person()</code> — constructor mặc định.</li>
  <li><code>Person(name: String, sickLeave: double)</code> — constructor, gán giá trị cho mọi thuộc tính.</li>
  <li><code>setSickLeave(upValue: double): void</code> — cập nhật sickLeave = sickLeave + upValue.</li>
  <li><code>getName(): String</code> — trả về name viết HOA.</li>
  <li><code>toString(): String</code> — trả về chuỗi định dạng <strong>name,sickLeave</strong> (không có khoảng trắng sau dấu phẩy).</li>
</ul>
<p><em>Không định dạng lại kết quả.</em></p>`;

const q1ExplainEn = `<p>Two easy traps: <code>getName()</code> uppercases the name (<code>name.toUpperCase()</code>) but <code>toString()</code> keeps the RAW lowercase field — they are two different views of the same field, not the same method reused. <code>setSickLeave(upValue)</code> adds to the existing value (<code>sickLeave += upValue</code>), it does not replace it.</p>
<p>Verified by compiling <code>Person.java</code> with the real given <code>Main.class</code>:</p>
<pre>Enter name: nguyen anh
Enter sickLeave: 4.5
1. Test getName(): 1
OUTPUT:
NGUYEN ANH</pre>
<pre>Enter name: ly hung
Enter sickLeave: 5.5
2. Test setSickLeave(): 2
Enter up value: 1.0
OUTPUT:
ly hung,6.5</pre>
<p>Sample 2 confirms both traps at once: the printed name is still lowercase "ly hung" (toString does not uppercase), and the number is 6.5 = 5.5 + 1.0 (setSickLeave adds, doesn't overwrite).</p>`;
const q1ExplainVi = `<p>Hai bẫy dễ nhầm: <code>getName()</code> viết hoa name (<code>name.toUpperCase()</code>) nhưng <code>toString()</code> vẫn giữ field GỐC chữ thường — đây là hai cách nhìn khác nhau trên cùng một field, không phải dùng lại cùng một hàm. <code>setSickLeave(upValue)</code> CỘNG DỒN vào giá trị hiện có (<code>sickLeave += upValue</code>), không phải thay thế.</p>
<p>Đã kiểm bằng cách biên dịch <code>Person.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>Enter name: nguyen anh
Enter sickLeave: 4.5
1. Test getName(): 1
OUTPUT:
NGUYEN ANH</pre>
<pre>Enter name: ly hung
Enter sickLeave: 5.5
2. Test setSickLeave(): 2
Enter up value: 1.0
OUTPUT:
ly hung,6.5</pre>
<p>Mẫu 2 xác nhận cả hai bẫy cùng lúc: tên in ra vẫn chữ thường "ly hung" (toString không viết hoa), và con số là 6.5 = 5.5 + 1.0 (setSickLeave cộng dồn, không ghi đè).</p>`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `public class Person {
    private String name;
    private double sickLeave;

    public Person() {
        // TODO
    }

    public Person(String name, double sickLeave) {
        // TODO
    }

    public void setSickLeave(double upValue) {
        // TODO
    }

    public String getName() {
        // TODO
        return null;
    }

    @Override
    public String toString() {
        // TODO
        return null;
    }
}`,
  sampleSolution: read('q0/material_0/src/Person.java'),
  expectedOutput:
`Sample run 1 (TC 1 — getName, name="nguyen anh" sickLeave=4.5):
OUTPUT:
NGUYEN ANH

Sample run 2 (TC 2 — setSickLeave, name="ly hung" sickLeave=5.5, up value=1.0):
OUTPUT:
ly hung,6.5`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'ctor', criterion: B('Both constructors set all fields correctly.', 'Cả 2 constructor gán đúng mọi field.'), weight: 1, maxScore: 0.5 },
    { id: 'getName', criterion: B('getName() uppercases the name without mutating the stored field.', 'getName() viết hoa name mà không sửa field gốc.'), weight: 1, maxScore: 0.5 },
    { id: 'setSickLeave', criterion: B('setSickLeave() adds upValue to the existing sickLeave (not a replace).', 'setSickLeave() cộng dồn upValue vào sickLeave hiện có (không thay thế).'), weight: 1, maxScore: 0.5 },
    { id: 'toString', criterion: B('toString() uses the raw (non-uppercased) name, format "name,sickLeave" with no space.', 'toString() dùng name gốc (không viết hoa), định dạng "name,sickLeave" không khoảng trắng.'), weight: 1, maxScore: 0.5 },
  ],
};

// ── Q2: Chair + SpecChair ──
const q2PromptEn = `<p><strong>(3 marks)</strong> Create a class <strong>Chair</strong> and a class <strong>SpecChair</strong> that extends <strong>Chair</strong> (i.e., Chair is the superclass and SpecChair is the subclass), described as follows:</p>
${table([
  '-color: String<br/>-quantity: int',
  '+Chair()<br/>+Chair(color: String, quantity: int)<br/>+getColor(): String<br/>+getQuantity(): int<br/>+setColor(color: String): void<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>getColor(): String</code> — return color.</li>
  <li><code>getQuantity(): int</code> — return quantity.</li>
  <li><code>setColor(color: String): void</code> — update color.</li>
  <li><code>toString(): String</code> — return the string of format: <strong>color,quantity</strong> (no space after comma).</li>
</ul>
${table([
  '-type: String',
  '+SpecChair()<br/>+SpecChair(color: String, quantity: int, type: String)<br/>+getType(): String<br/>+setType(): void<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>toString(): String</code> — return the string of format: <strong>color,quantity,type</strong> (no space after comma).</li>
  <li><code>getType(): String</code> — return type that removed the last letter.</li>
  <li><code>setType(): void</code> — if the quantity is greater than 5 then type is set "discount", otherwise type is set "no discount".</li>
</ul>`;
const q2PromptVi = `<p><strong>(3 điểm)</strong> Tạo lớp <strong>Chair</strong> và lớp <strong>SpecChair</strong> kế thừa từ <strong>Chair</strong> (Chair là lớp cha, SpecChair là lớp con), mô tả như sau:</p>
${table([
  '-color: String<br/>-quantity: int',
  '+Chair()<br/>+Chair(color: String, quantity: int)<br/>+getColor(): String<br/>+getQuantity(): int<br/>+setColor(color: String): void<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>getColor(): String</code> — trả về color.</li>
  <li><code>getQuantity(): int</code> — trả về quantity.</li>
  <li><code>setColor(color: String): void</code> — cập nhật color.</li>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>color,quantity</strong> (không khoảng trắng sau dấu phẩy).</li>
</ul>
${table([
  '-type: String',
  '+SpecChair()<br/>+SpecChair(color: String, quantity: int, type: String)<br/>+getType(): String<br/>+setType(): void<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>color,quantity,type</strong> (không khoảng trắng sau dấu phẩy).</li>
  <li><code>getType(): String</code> — trả về type đã bỏ chữ cái cuối cùng.</li>
  <li><code>setType(): void</code> — nếu quantity lớn hơn 5 thì đặt type = "discount", ngược lại đặt type = "no discount".</li>
</ul>`;

const q2ExplainEn = `<p><code>getType()</code> reads the type AS ENTERED (minus its last letter) — it never calls <code>setType()</code> itself. <code>setType()</code> OVERWRITES type entirely with the literal string "discount" or "no discount" based on <code>quantity &gt; 5</code>, discarding whatever type was passed to the constructor.</p>
<p>The TC1 sample prints <strong>two</strong> lines — the superclass's own <code>toString()</code> ("color,quantity") then the subclass's overridden one ("color,quantity,type") — the harness keeps a separate <code>Chair</code> object alongside the <code>SpecChair</code> object and prints both, same pattern as other PRO192 papers. Unlike some of those papers, TC2 here prints the FULL 3-field <code>toString()</code> after <code>setType()</code> (not just 2 fields) — confirmed empirically, don't assume the pattern carries over unchanged between papers.</p>
<p>Verified against all 4 given samples by compiling both classes with the real given <code>Main.class</code>:</p>
<pre>color=wood qty=10 type=sale → TC1 (toString)
OUTPUT:
wood,10
wood,10,sale

color=gray qty=12 type=wood → TC2 (setType, quantity>5)
OUTPUT:
gray,12,discount

color=gray qty=3 type=wood → TC2 (setType, quantity<=5)
OUTPUT:
gray,3,no discount

color=blue qty=5 type=stone → TC3 (getType)
OUTPUT:
ston</pre>`;
const q2ExplainVi = `<p><code>getType()</code> đọc type ĐÚNG NHƯ ĐÃ NHẬP (trừ chữ cái cuối) — nó KHÔNG tự gọi <code>setType()</code>. <code>setType()</code> GHI ĐÈ HOÀN TOÀN type bằng chuỗi literal "discount" hoặc "no discount" tuỳ <code>quantity &gt; 5</code>, bỏ qua type đã truyền vào constructor.</p>
<p>Mẫu TC1 in <strong>hai</strong> dòng — dòng <code>toString()</code> của lớp cha ("color,quantity") rồi tới dòng đã override của lớp con ("color,quantity,type") — harness giữ một object <code>Chair</code> riêng song song với object <code>SpecChair</code> rồi in cả hai, cùng khuôn mẫu với các đề PRO192 khác. Khác với vài đề kia, TC2 ở đây in ĐỦ 3 trường của <code>toString()</code> sau khi gọi <code>setType()</code> (không chỉ 2 trường) — đã xác nhận bằng thực nghiệm, đừng mặc định khuôn mẫu giống hệt giữa các đề.</p>
<p>Đã đối chiếu với cả 4 mẫu trong đề bằng cách biên dịch cả 2 lớp cùng <code>Main.class</code> given thật:</p>
<pre>color=wood qty=10 type=sale → TC1 (toString)
OUTPUT:
wood,10
wood,10,sale

color=gray qty=12 type=wood → TC2 (setType, quantity>5)
OUTPUT:
gray,12,discount

color=gray qty=3 type=wood → TC2 (setType, quantity<=5)
OUTPUT:
gray,3,no discount

color=blue qty=5 type=stone → TC3 (getType)
OUTPUT:
ston</pre>`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `public class Chair {
    private String color;
    private int quantity;
    // TODO: constructors, getColor, getQuantity, setColor, toString ("color,quantity")
}

class SpecChair extends Chair {
    private String type;
    // TODO: constructors, toString ("color,quantity,type"),
    // getType() (type minus last letter), setType() ("discount"/"no discount")
}`,
  sampleSolution: `${read('q1/material_1/src/Chair.java')}\n\n${read('q1/material_1/src/SpecChair.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — toString, color=wood quantity=10 type=sale):
OUTPUT:
wood,10
wood,10,sale

Sample run 2 (TC 2 — setType, color=gray quantity=12 type=wood):
OUTPUT:
gray,12,discount

Sample run 3 (TC 2 — setType, color=gray quantity=3 type=wood):
OUTPUT:
gray,3,no discount

Sample run 4 (TC 3 — getType, color=blue quantity=5 type=stone):
OUTPUT:
ston`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'inherit', criterion: B('SpecChair correctly extends Chair and both toString() formats are right.', 'SpecChair kế thừa đúng Chair, cả 2 định dạng toString() đều đúng.'), weight: 2, maxScore: 1 },
    { id: 'getType', criterion: B('getType() returns the entered type minus its last letter (does not call setType()).', 'getType() trả về type đã nhập bỏ chữ cuối (không gọi setType()).'), weight: 2, maxScore: 1 },
    { id: 'setType', criterion: B('setType() overwrites type to "discount"/"no discount" based on quantity > 5.', 'setType() ghi đè type thành "discount"/"no discount" theo quantity > 5.'), weight: 2, maxScore: 1 },
  ],
};

// ── Q3: Shoes + MyShoes implements IShoes ──
const ISHOES_SRC = `import java.util.List;
public interface IShoes {
    public Shoes f1(List<Shoes> t);
    public void f2(List<Shoes> t);
    public void f3(List<Shoes> t);
}`;

const q3PromptEn = `<p><strong>(3 marks)</strong> Create a class called <strong>Shoes</strong> described as follows:</p>
${table([
  '-name: String<br/>-price: int',
  '+Shoes()<br/>+Shoes(name: String, price: int)<br/>+getName(): String<br/>+getPrice(): int<br/>+setName(name: String): void<br/>+setPrice(price: int): void<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>getName(): String</code> — return name.</li>
  <li><code>getPrice(): int</code> — return price.</li>
  <li><code>setName(name: String): void</code> — update name.</li>
  <li><code>setPrice(price: int): void</code> — update price.</li>
  <li><code>toString(): String</code> — return string with format: <strong>(name, price)</strong>.</li>
</ul>
<p>The interface <strong>IShoes</strong> below is already compiled and given in byte code format, so you can use it without creating the IShoes.java file:</p>
<pre>${ISHOES_SRC}</pre>
<p>Write a class <strong>MyShoes</strong> that implements the interface <strong>IShoes</strong>. The class MyShoes implements the methods f1, f2 and f3 in IShoes as follows:</p>
<ul>
  <li><strong>f1</strong>: Find the Shoes with the minimum price of all Shoes in the list.</li>
  <li><strong>f2</strong>: Sort the elements in the list Shoes by price in ascending order.</li>
  <li><strong>f3</strong>: Remove the elements in the list Shoes that end with letter "o".</li>
</ul>
<p>In addition to the implemented functions, you should write a <code>display(List&lt;Shoes&gt; t): void</code> function to display the list of Shoes.</p>`;
const q3PromptVi = `<p><strong>(3 điểm)</strong> Tạo một lớp tên <strong>Shoes</strong> được mô tả như sau:</p>
${table([
  '-name: String<br/>-price: int',
  '+Shoes()<br/>+Shoes(name: String, price: int)<br/>+getName(): String<br/>+getPrice(): int<br/>+setName(name: String): void<br/>+setPrice(price: int): void<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>getName(): String</code> — trả về name.</li>
  <li><code>getPrice(): int</code> — trả về price.</li>
  <li><code>setName(name: String): void</code> — cập nhật name.</li>
  <li><code>setPrice(price: int): void</code> — cập nhật price.</li>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>(name, price)</strong>.</li>
</ul>
<p>Interface <strong>IShoes</strong> dưới đây đã được biên dịch sẵn dạng byte code, bạn dùng thẳng không cần tạo file IShoes.java:</p>
<pre>${ISHOES_SRC}</pre>
<p>Viết lớp <strong>MyShoes</strong> implement interface <strong>IShoes</strong>. Lớp MyShoes cài đặt các hàm f1, f2, f3 trong IShoes như sau:</p>
<ul>
  <li><strong>f1</strong>: Tìm Shoes có price nhỏ nhất trong danh sách.</li>
  <li><strong>f2</strong>: Sắp xếp các phần tử trong danh sách Shoes theo price tăng dần.</li>
  <li><strong>f3</strong>: Xoá khỏi danh sách Shoes các phần tử có tên kết thúc bằng chữ "o".</li>
</ul>
<p>Ngoài các hàm đã cài đặt, bạn cần viết thêm hàm <code>display(List&lt;Shoes&gt; t): void</code> để hiển thị danh sách Shoes.</p>`;

const q3ExplainEn = `<p><strong>toString()</strong> uses format <code>"(" + name + ", " + price + ")"</code> — WITH a space after the comma (unlike Chair/Person/Person in Q1-Q2 which use no space) — copy the exact punctuation, don't reuse another question's format.</p>
<p><strong>f1</strong> returns a <code>Shoes</code> OBJECT (not an index or price), found by a linear scan keeping the current minimum. <strong>f2</strong> sorts the list itself in place by price ascending (<code>Collections.sort</code> with a price comparator). <strong>f3</strong> removes in place every Shoes whose name's LAST character is 'o' — via <code>Iterator.remove()</code> so the underlying list actually shrinks (a lowercase-only check matches the given samples; the paper does not exercise uppercase 'O').</p>
<p>The harness has its own hard-coded starting list, "Add how many elements" only appends extra ones. Verified against all 3 given samples by compiling <code>Shoes.java</code> + <code>MyShoes.java</code> with the real given <code>Main.class</code>:</p>
<pre>f1: list (sandal,20)(tre em,50)(the thao,15) + added (cong so,10) → f1 → (cong so, 10)
f2: list (sandal,20)(tre em,50)(the thao,15) → f2 → (the thao, 15)(sandal, 20)(tre em, 50)
f3: list (sandal,20)(tre em,50)(the thao,15) → f3 → (sandal, 20)(tre em, 50)   ("the thao" ends with 'o' → removed)</pre>`;
const q3ExplainVi = `<p><strong>toString()</strong> dùng định dạng <code>"(" + name + ", " + price + ")"</code> — CÓ khoảng trắng sau dấu phẩy (khác với Chair/Person ở Q1-Q2 vốn không có khoảng trắng) — chép đúng dấu câu, đừng dùng nhầm định dạng của câu khác.</p>
<p><strong>f1</strong> trả về một OBJECT <code>Shoes</code> (không phải index hay price), tìm bằng cách quét tuyến tính giữ lại giá trị nhỏ nhất hiện tại. <strong>f2</strong> sắp xếp NGAY TRÊN danh sách gốc theo price tăng dần (<code>Collections.sort</code> với comparator theo price). <strong>f3</strong> xoá NGAY TRÊN danh sách gốc mọi Shoes có ký tự CUỐI của tên là 'o' — dùng <code>Iterator.remove()</code> để danh sách gốc thực sự co lại (chỉ kiểm chữ thường là khớp đủ với mẫu trong đề; đề không có ca chữ HOA 'O').</p>
<p>Harness có sẵn danh sách khởi tạo cứng, "Add how many elements" chỉ thêm phần tử phụ. Đã đối chiếu với cả 3 mẫu trong đề bằng cách biên dịch <code>Shoes.java</code> + <code>MyShoes.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>f1: danh sách (sandal,20)(tre em,50)(the thao,15) + thêm (cong so,10) → f1 → (cong so, 10)
f2: danh sách (sandal,20)(tre em,50)(the thao,15) → f2 → (the thao, 15)(sandal, 20)(tre em, 50)
f3: danh sách (sandal,20)(tre em,50)(the thao,15) → f3 → (sandal, 20)(tre em, 50)   ("the thao" kết thúc bằng 'o' → bị xoá)</pre>`;

const q3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `${ISHOES_SRC}

public class Shoes {
    private String name;
    private int price;
    // TODO: constructors, getName, getPrice, setName, setPrice, toString ("(name, price)")
}

class MyShoes implements IShoes {
    // TODO: f1, f2, f3, display(List<Shoes> t)
}`,
  sampleSolution: `${read('q2/material_2/src/Shoes.java')}\n\n${read('q2/material_2/src/MyShoes.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — f1, list + 1 added element (cong so, 10)):
List: (sandal, 20) (tre em, 50) (the thao, 15) (cong so, 10)
OUTPUT:
(cong so, 10)

Sample run 2 (TC 2 — f2, list: (sandal, 20) (tre em, 50) (the thao, 15)):
OUTPUT:
(the thao, 15)
(sandal, 20)
(tre em, 50)

Sample run 3 (TC 3 — f3, list: (sandal, 20) (tre em, 50) (the thao, 15)):
OUTPUT:
(sandal, 20)
(tre em, 50)`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'toString', criterion: B('Shoes.toString() uses "(name, price)" WITH a space after the comma.', 'Shoes.toString() dùng "(name, price)" CÓ khoảng trắng sau dấu phẩy.'), weight: 1, maxScore: 1 },
    { id: 'f1', criterion: B('f1() returns the actual Shoes object with the minimum price.', 'f1() trả về đúng object Shoes có price nhỏ nhất.'), weight: 1, maxScore: 0.75 },
    { id: 'f2', criterion: B('f2() sorts the list in place by price ascending.', 'f2() sắp xếp ngay trên danh sách gốc theo price tăng dần.'), weight: 1, maxScore: 0.75 },
    { id: 'f3', criterion: B('f3() removes items whose name ends with "o" and actually shrinks the list.', 'f3() xoá đúng các phần tử tên kết thúc "o" và danh sách thực sự co lại.'), weight: 1, maxScore: 0.5 },
    { id: 'display', criterion: B('A display(List<Shoes>) helper prints the list as required by the instructions.', 'Có hàm display(List<Shoes>) in danh sách theo đúng yêu cầu đề.'), weight: 1, maxScore: 1 },
  ],
};

// ── Q4: MyLink implements ILink ──
const ILINK_SRC = `public interface ILink {
    public String f1(String str);
    public String f2(String str);
}`;

const q4PromptEn = `<p><strong>(2 marks)</strong> The interface <strong>ILink</strong> below is already compiled and given in byte code format, so you can use it without creating the ILink.java file:</p>
<pre>${ILINK_SRC}</pre>
<p>Write a class named <strong>MyLink</strong> that implements the interface <strong>ILink</strong>. The class MyLink implements the methods f1 and f2 in ILink as follows:</p>
<ul>
  <li><strong>f1</strong>: Returns the string that replaces all "." with ":".</li>
  <li><strong>f2</strong>: Return the new Link with substring after the first "." in uppercase.</li>
</ul>`;
const q4PromptVi = `<p><strong>(2 điểm)</strong> Interface <strong>ILink</strong> dưới đây đã được biên dịch sẵn dạng byte code, bạn dùng thẳng không cần tạo file ILink.java:</p>
<pre>${ILINK_SRC}</pre>
<p>Viết lớp <strong>MyLink</strong> implement interface <strong>ILink</strong>. Lớp MyLink cài đặt các hàm f1 và f2 trong ILink như sau:</p>
<ul>
  <li><strong>f1</strong>: Trả về chuỗi đã thay mọi dấu "." bằng ":".</li>
  <li><strong>f2</strong>: Trả về Link mới với phần chuỗi SAU dấu "." ĐẦU TIÊN được viết HOA.</li>
</ul>`;

const q4ExplainEn = `<p><strong>f1</strong> is a plain global replace, <code>str.replace(".", ":")</code> — every dot becomes a colon, not just the first.</p>
<p><strong>f2</strong> only uppercases the part AFTER the FIRST dot; everything up to and including that first dot is left untouched: <code>str.substring(0, idx + 1) + str.substring(idx + 1).toUpperCase()</code>, where <code>idx = str.indexOf('.')</code>. For "https://fap.fpt.edu.vn" the first dot sits right after "fap", so "https://fap." stays as-is and "fpt.edu.vn" becomes "FPT.EDU.VN" — the LATER dots inside the uppercased tail stay dots (uppercase doesn't touch punctuation), giving "https://fap.FPT.EDU.VN".</p>
<p>Verified against both given samples by compiling <code>MyLink.java</code> with the real given <code>Main.class</code>:</p>
<pre>f1("https://fap.fpt.edu.vn") → "https://fap:fpt:edu:vn"
f2("https://fap.fpt.edu.vn") → "https://fap.FPT.EDU.VN"</pre>`;
const q4ExplainVi = `<p><strong>f1</strong> là thay thế toàn cục đơn giản, <code>str.replace(".", ":")</code> — MỌI dấu chấm thành dấu hai chấm, không chỉ dấu đầu tiên.</p>
<p><strong>f2</strong> chỉ viết hoa phần SAU dấu chấm ĐẦU TIÊN; phần từ đầu chuỗi tới và bao gồm dấu chấm đó giữ nguyên: <code>str.substring(0, idx + 1) + str.substring(idx + 1).toUpperCase()</code>, với <code>idx = str.indexOf('.')</code>. Với "https://fap.fpt.edu.vn", dấu chấm đầu tiên nằm ngay sau "fap", nên "https://fap." giữ nguyên và "fpt.edu.vn" thành "FPT.EDU.VN" — các dấu chấm SAU đó nằm trong phần đã viết hoa vẫn là dấu chấm (viết hoa không đụng tới dấu câu), cho ra "https://fap.FPT.EDU.VN".</p>
<p>Đã đối chiếu với cả 2 mẫu trong đề bằng cách biên dịch <code>MyLink.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>f1("https://fap.fpt.edu.vn") → "https://fap:fpt:edu:vn"
f2("https://fap.fpt.edu.vn") → "https://fap.FPT.EDU.VN"</pre>`;

const q4 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `${ILINK_SRC}

public class MyLink implements ILink {
    // TODO: f1, f2
}`,
  sampleSolution: read('q3/material_3/src/MyLink.java'),
  expectedOutput:
`Sample run 1 (TC 1 — f1, input: "https://fap.fpt.edu.vn"):
OUTPUT:
https://fap:fpt:edu:vn

Sample run 2 (TC 2 — f2, input: "https://fap.fpt.edu.vn"):
OUTPUT:
https://fap.FPT.EDU.VN`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'f1', criterion: B('f1() replaces every "." with ":".', 'f1() thay MỌI dấu "." bằng ":".'), weight: 1, maxScore: 1 },
    { id: 'f2', criterion: B('f2() uppercases only the substring AFTER the first "." and keeps the rest untouched.', 'f2() chỉ viết hoa phần SAU dấu "." đầu tiên, giữ nguyên phần còn lại.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE14-SU26-P2',
      title: B('PRO192 — Practical Exam Đề 14 (SU26, Paper 2)', 'PRO192 — Đề thi thực hành số 14 (SU26, Paper 2)'),
      description: B(
        'Real PRO192 PE paper (4 questions, 10 marks) — OOP class design (encapsulation, inheritance, toString), two independent interface implementations over a List and over Strings. Solutions written & verified by compiling against the real given Main.class harness.',
        'Đề PE PRO192 thật (4 câu, 10 điểm) — thiết kế lớp OOP (đóng gói, kế thừa, toString), hai interface độc lập cài đặt trên List và trên String. Lời giải đã viết và kiểm bằng cách biên dịch cùng harness Main.class given thật.',
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
  `// AUTO-GENERATED by scripts/build-pro192-pe14.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
