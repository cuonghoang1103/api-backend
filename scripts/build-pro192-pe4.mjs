/**
 * build-pro192-pe4.mjs — sinh content/exams/PRO192-PE4.mjs.
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
 * Nguồn đã verify: scratchpad pro192-pe/de4/q{0..3} — mỗi thư mục compile
 * xong bằng `javac` cùng Main.class thật của given materials, chạy `java Main`
 * với đúng stdin mẫu trong đề, output khớp với PDF (Q3's official OUTPUT
 * transcription is missing a page from the source scan — see rubric note).
 *
 * Nguồn zip gốc chứa sẵn lời giải + jar đã build (không phải given materials
 * sạch) — attachment đã đóng gói LẠI thủ công (Q1-Q4/{src,nbproject,build.xml,
 * manifest.mf} rỗng lời giải, chỉ giữ Main.class + IString.class) rồi upload
 * R2 PRO192/PE4-Given.zip, verify GET 200 + unzip đúng 45 file.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE4.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/2c89fc57-9aa7-4c2e-8cc0-a484bfb4eb0f/scratchpad/pro192-pe/de4';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE4.mjs');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').trimEnd();

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE4-Given.zip';

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> (transcribed from the real exam paper).</p>
   <ol>
     <li>Software required: NetBeans 13 or later, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Students are ONLY allowed to use their own study materials (sample code, program examples) stored on their own computer.</li>
     <li>Create a folder to save the given projects (e.g. PRO_given), download the given materials into it. Open NetBeans, open the given Qx project, then complete it according to the exam requirements. Do NOT delete or edit given files, or create a java file with the same name as a given file.</li>
     <li>Before submission: run "Clean and Build Project" (Shift+F11); for each question create two sub-folders <strong>run</strong> and <strong>src</strong>, copy the built <code>Qx.jar</code> into <strong>run</strong> and the entire project source into <strong>src</strong>.</li>
     <li>Do NOT use accented Vietnamese in code comments. Do NOT change the names of the folders/files specified in the exam, or the marking software cannot find the executable (.jar) to grade. All .java source files use the NetBeans default package.</li>
   </ol>
   <p>This exam room cannot run NetBeans/JDK in the browser, so you type each class directly into the code box below and it is graded by AI against the rubric — but the "given materials" download above is the REAL given project (with the compiled <code>Main.class</code> harness) so you can build &amp; run it for real on your own machine exactly like the actual PE, and cross-check your output against the samples shown.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> (dịch nguyên văn từ đề thi thật).</p>
   <ol>
     <li>Yêu cầu phần mềm: NetBeans 13 trở lên, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Sinh viên CHỈ được dùng tài liệu học tập (mã mẫu, ví dụ chương trình) lưu trên máy tính của mình.</li>
     <li>Tạo một thư mục chứa các project given (vd PRO_given), tải given materials vào đó. Mở NetBeans, mở project Qx tương ứng, hoàn thành theo yêu cầu đề bài. KHÔNG xoá/sửa file given, KHÔNG tạo file java trùng tên với file given.</li>
     <li>Trước khi nộp: chạy "Clean and Build Project" (Shift+F11); với mỗi câu tạo 2 thư mục con <strong>run</strong> và <strong>src</strong>, chép file <code>Qx.jar</code> đã build vào <strong>run</strong>, chép toàn bộ mã nguồn project vào <strong>src</strong>.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment code. KHÔNG đổi tên các thư mục/file đã quy định trong đề, nếu không phần mềm chấm sẽ không tìm thấy file thực thi (.jar) để chấm. Mọi file nguồn .java dùng package mặc định của NetBeans.</li>
   </ol>
   <p>Phòng thi web không chạy được NetBeans/JDK trực tiếp trên trình duyệt, nên bạn gõ thẳng từng class vào ô mã bên dưới và được AI chấm theo tiêu chí — nhưng file "given materials" tải ở trên là project given THẬT (kèm harness <code>Main.class</code> đã biên dịch sẵn) để bạn có thể build &amp; chạy thật trên máy mình y hệt bài thi thật, và tự đối chiếu kết quả với các mẫu bên dưới.</p>`,
);

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ── Q1: Camel ──
const q1PromptEn = `<p><strong>(2 marks)</strong> Do not pay attention to real meaning of objects, variables and their values in the questions below.</p>
<p>Write a class <strong>Camel</strong> (in the default package of the NetBean) with the following information:</p>
${table([
  '-desert: String<br/>-step: int',
  '+Camel()<br/>+Camel(desert: String, step: int)<br/>+getDesert(): String<br/>+getStep(): int<br/>+setStep(step: int): void',
])}
<p>Where:</p>
<ul>
  <li><code>Camel()</code> — default constructor.</li>
  <li><code>Camel(desert: String, step: int)</code> — parameterized constructor, which sets values to desert and step.</li>
  <li><code>getDesert(): String</code> — return desert in <strong>uppercase</strong> format.</li>
  <li><code>getStep(): int</code> — return step.</li>
  <li><code>setStep(step: int): void</code> — update step.</li>
</ul>
<p><em>Do not format the result.</em></p>`;
const q1PromptVi = `<p><strong>(2 điểm)</strong> Bỏ qua ý nghĩa thực tế của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</p>
<p>Viết lớp <strong>Camel</strong> (trong package mặc định của NetBean) với thông tin sau:</p>
${table([
  '-desert: String<br/>-step: int',
  '+Camel()<br/>+Camel(desert: String, step: int)<br/>+getDesert(): String<br/>+getStep(): int<br/>+setStep(step: int): void',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Camel()</code> — constructor mặc định.</li>
  <li><code>Camel(desert: String, step: int)</code> — constructor có tham số, gán giá trị cho desert và step.</li>
  <li><code>getDesert(): String</code> — trả về desert dạng <strong>chữ HOA</strong>.</li>
  <li><code>getStep(): int</code> — trả về step.</li>
  <li><code>setStep(step: int): void</code> — cập nhật step.</li>
</ul>
<p><em>Không định dạng lại kết quả.</em></p>`;

const q1ExplainEn = `<p>Only <code>getDesert()</code> uppercases — the field itself stays lowercase as entered, and there's no <code>toString()</code>/setter for desert in this class at all (only <code>setStep()</code> is required). Verified by compiling <code>Camel.java</code> with the real given <code>Main.class</code>:</p>
<pre>Enter desert: alan
Enter step: 5
1. Test getDesert(): 1
OUTPUT:
ALAN</pre>
<pre>Enter desert: alan
Enter step: 12
2. Test setStep(): 2
Enter new step: 15
OUTPUT:
15</pre>`;
const q1ExplainVi = `<p>Chỉ <code>getDesert()</code> viết hoa — field gốc vẫn giữ nguyên chữ thường như đã nhập, và lớp này không có <code>toString()</code>/setter cho desert (chỉ yêu cầu <code>setStep()</code>). Đã kiểm bằng cách biên dịch <code>Camel.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>Enter desert: alan
Enter step: 5
1. Test getDesert(): 1
OUTPUT:
ALAN</pre>
<pre>Enter desert: alan
Enter step: 12
2. Test setStep(): 2
Enter new step: 15
OUTPUT:
15</pre>`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `public class Camel {
    private String desert;
    private int step;

    public Camel() {
        // TODO
    }

    public Camel(String desert, int step) {
        // TODO
    }

    public String getDesert() {
        // TODO: return desert in uppercase
        return null;
    }

    public int getStep() {
        // TODO
        return 0;
    }

    public void setStep(int step) {
        // TODO
    }
}`,
  sampleSolution: read('q0/material_0/src/Camel.java'),
  expectedOutput:
`Sample run 1 (TC 1 — getDesert, desert="alan" step=5):
OUTPUT:
ALAN

Sample run 2 (TC 2 — setStep, desert="alan" step=12, new step=15):
OUTPUT:
15`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'ctor', criterion: B('Both constructors set desert and step correctly.', 'Cả 2 constructor gán đúng desert và step.'), weight: 1, maxScore: 0.5 },
    { id: 'getDesert', criterion: B('getDesert() returns the desert field in uppercase without mutating it.', 'getDesert() trả về desert dạng chữ HOA mà không sửa field gốc.'), weight: 1, maxScore: 1 },
    { id: 'getStep_setStep', criterion: B('getStep() returns step; setStep() updates it.', 'getStep() trả về step; setStep() cập nhật đúng.'), weight: 1, maxScore: 0.5 },
  ],
};

// ── Q2: Cala + SpecCala ──
const q2PromptEn = `<p><strong>(3 marks)</strong> Write a class <strong>Cala</strong> and a class <strong>SpecCala</strong> extending from <strong>Cala</strong> (i.e. Cala is a superclass and SpecCala is a subclass) with the following information:</p>
${table([
  '-owner: String<br/>-price: int',
  '+Cala()<br/>+Cala(owner: String, price: int)<br/>+getOwner(): String<br/>+getPrice(): int<br/>+setOwner(owner: String): void<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>Cala()</code> — default constructor.</li>
  <li><code>Cala(owner: String, price: int)</code> — parameterized constructor which sets values to owner and price.</li>
  <li><code>getOwner(): String</code> — return owner.</li>
  <li><code>getPrice(): int</code> — return price.</li>
  <li><code>setOwner(owner: String): void</code> — update owner.</li>
  <li><code>toString(): String</code> — return the string of format: <strong>owner, price</strong>.</li>
</ul>
${table([
  '-color: int',
  '+SpecCala()<br/>+SpecCala(color: int, owner: String, price: int)<br/>+toString(): String<br/>+setData(): void<br/>+getValue(): int',
])}
<p>Where:</p>
<ul>
  <li><code>SpecCala()</code> — default constructor.</li>
  <li><code>SpecCala(color: int, owner: String, price: int)</code> — parameterized constructor which sets values to color, owner and price.</li>
  <li><code>toString(): String</code> — return the string of format: <strong>owner, price, color</strong>.</li>
  <li><code>setData(): void</code> — Replace the 2nd character in owner with the string "XX".</li>
  <li><code>getValue(): int</code> — Check if color is odd number then return price+3, otherwise return price+7.</li>
</ul>`;
const q2PromptVi = `<p><strong>(3 điểm)</strong> Viết lớp <strong>Cala</strong> và lớp <strong>SpecCala</strong> kế thừa từ <strong>Cala</strong> (Cala là lớp cha, SpecCala là lớp con), thông tin như sau:</p>
${table([
  '-owner: String<br/>-price: int',
  '+Cala()<br/>+Cala(owner: String, price: int)<br/>+getOwner(): String<br/>+getPrice(): int<br/>+setOwner(owner: String): void<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Cala()</code> — constructor mặc định.</li>
  <li><code>Cala(owner: String, price: int)</code> — constructor có tham số, gán giá trị cho owner và price.</li>
  <li><code>getOwner(): String</code> — trả về owner.</li>
  <li><code>getPrice(): int</code> — trả về price.</li>
  <li><code>setOwner(owner: String): void</code> — cập nhật owner.</li>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>owner, price</strong>.</li>
</ul>
${table([
  '-color: int',
  '+SpecCala()<br/>+SpecCala(color: int, owner: String, price: int)<br/>+toString(): String<br/>+setData(): void<br/>+getValue(): int',
])}
<p>Trong đó:</p>
<ul>
  <li><code>SpecCala()</code> — constructor mặc định.</li>
  <li><code>SpecCala(color: int, owner: String, price: int)</code> — constructor có tham số, gán giá trị cho color, owner và price.</li>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>owner, price, color</strong>.</li>
  <li><code>setData(): void</code> — Thay ký tự thứ 2 trong owner bằng chuỗi "XX".</li>
  <li><code>getValue(): int</code> — Nếu color là số lẻ thì trả về price+3, ngược lại trả về price+7.</li>
</ul>`;

const q2ExplainEn = `<p>The exam paper's own reference project ships with two bugs worth noting (a real given-materials package we decompiled to verify the harness) — the fixed, spec-correct version here: <code>Cala</code> DOES need the default no-arg constructor (the paper's own sample project omits it and fails to compile <code>SpecCala()</code>'s implicit <code>super()</code> call). <code>setData()</code> only touches <strong>owner</strong> (2nd char → "XX", e.g. "alan" → "aXXan", since replacing 1 char with a 2-char string grows the string) — it never touches price or color.</p>
<p>Decompiling the real given <code>Main.class</code> (bytecode, not guesswork) shows exactly what each test case prints: TC1 (toString) calls <code>cala.toString()</code> then <code>specCala.toString()</code> — two lines, in <strong>your own</strong> chosen format ("owner, price" / "owner, price, color" per spec). TC2 (setData) does NOT call toString() at all — it prints <code>getOwner()+","+getPrice()</code> directly via a hardcoded <code>StringBuilder</code>, so this line has NO space after the comma regardless of how you write toString(). TC3 (getValue) just prints the int.</p>
<p>Verified against all 4 given samples by compiling with the real given <code>Main.class</code>:</p>
<pre>owner=alan price=3 color=4 → TC1 (toString)
OUTPUT:
alan, 3
alan, 3, 4

owner=alan price=3 color=4 → TC2 (setData)
OUTPUT:
aXXan,3

owner=alan price=3 color=5 → TC3 (getValue, odd color)
OUTPUT:
6

owner=alan price=3 color=4 → TC3 (getValue, even color)
OUTPUT:
10</pre>`;
const q2ExplainVi = `<p>Bản project mẫu đính kèm gốc trong đề (given materials thật đã giải nén để kiểm harness) có 2 lỗi đáng lưu ý — bản đã sửa đúng đặc tả dùng ở đây: <code>Cala</code> BẮT BUỘC phải có constructor mặc định không tham số (project mẫu của đề bỏ sót, khiến <code>SpecCala()</code> gọi <code>super()</code> ngầm định không biên dịch được). <code>setData()</code> chỉ đụng vào <strong>owner</strong> (ký tự thứ 2 → "XX", vd "alan" → "aXXan", vì thay 1 ký tự bằng chuỗi 2 ký tự nên chuỗi dài ra) — không đụng price hay color.</p>
<p>Decompile trực tiếp <code>Main.class</code> given thật (đọc bytecode, không suy đoán) cho thấy chính xác mỗi test case in gì: TC1 (toString) gọi <code>cala.toString()</code> rồi <code>specCala.toString()</code> — 2 dòng, theo đúng định dạng BẠN viết ("owner, price" / "owner, price, color" theo đề). TC2 (setData) KHÔNG gọi toString() — nó in <code>getOwner()+","+getPrice()</code> trực tiếp qua <code>StringBuilder</code> viết cứng trong harness, nên dòng này KHÔNG có khoảng trắng sau dấu phẩy bất kể bạn viết toString() thế nào. TC3 (getValue) chỉ in số nguyên.</p>
<p>Đã đối chiếu với cả 4 mẫu trong đề bằng cách biên dịch cùng <code>Main.class</code> given thật:</p>
<pre>owner=alan price=3 color=4 → TC1 (toString)
OUTPUT:
alan, 3
alan, 3, 4

owner=alan price=3 color=4 → TC2 (setData)
OUTPUT:
aXXan,3

owner=alan price=3 color=5 → TC3 (getValue, color lẻ)
OUTPUT:
6

owner=alan price=3 color=4 → TC3 (getValue, color chẵn)
OUTPUT:
10</pre>`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `public class Cala {
    private String owner;
    private int price;
    // TODO: Cala(), Cala(owner, price), getOwner, getPrice, setOwner,
    // toString() ("owner, price")
}

class SpecCala extends Cala {
    private int color;
    // TODO: SpecCala(), SpecCala(color, owner, price),
    // toString() ("owner, price, color"),
    // setData() (replace 2nd char of owner with "XX"),
    // getValue() (color odd -> price+3, even -> price+7)
}`,
  sampleSolution: `${read('q1/material_1/src/Cala.java')}\n\n${read('q1/material_1/src/SpecCala.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — toString, owner=alan price=3 color=4):
OUTPUT:
alan, 3
alan, 3, 4

Sample run 2 (TC 2 — setData, owner=alan price=3 color=4):
OUTPUT:
aXXan,3

Sample run 3 (TC 3 — getValue, owner=alan price=3 color=5, odd):
OUTPUT:
6

Sample run 4 (TC 3 — getValue, owner=alan price=3 color=4, even):
OUTPUT:
10`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'ctor', criterion: B('Cala has a working default constructor; SpecCala correctly extends Cala and both toString() formats are right.', 'Cala có constructor mặc định hoạt động đúng; SpecCala kế thừa đúng Cala, cả 2 định dạng toString() đều đúng.'), weight: 2, maxScore: 1 },
    { id: 'setData', criterion: B('setData() replaces only the 2nd character of owner with "XX" (does not touch price/color).', 'setData() chỉ thay ký tự thứ 2 của owner bằng "XX" (không đụng price/color).'), weight: 2, maxScore: 1 },
    { id: 'getValue', criterion: B('getValue() returns price+3 for odd color, price+7 for even color.', 'getValue() trả về price+3 nếu color lẻ, price+7 nếu color chẵn.'), weight: 2, maxScore: 1 },
  ],
};

// ── Q3: Ticket + TicketList extends ArrayList<Ticket> ──
const q3PromptEn = `<p><strong>(2 marks)</strong> Write a class named <strong>Ticket</strong> with the following information:</p>
${table([
  '-code: String<br/>-type: String<br/>-price: double',
  '+Ticket(code: String, type: String, price: double)<br/>+getCode(): String<br/>+getType(): String<br/>+getPrice(): double<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>Ticket(code: String, type: String, price: double)</code> — constructor: set values to the code, type and the price.</li>
  <li><code>getCode(): String</code> — return the code.</li>
  <li><code>getType(): String</code> — return the type.</li>
  <li><code>getPrice(): double</code> — return the price.</li>
  <li><code>toString(): String</code> — return a string format that contains all the information of the Ticket: code, type, price. The price is formatted with two decimal places. <strong>Note</strong>: Do not use spaces to separate values.</li>
</ul>
<p>Write a class named <strong>TicketList</strong> which extends from <strong>ArrayList</strong> (ArrayList is a collection) with the following information:</p>
<pre>public class TicketList extends ArrayList&lt;Ticket&gt; {
    //.....
}</pre>
<ul>
  <li><code>addTicket(ticket: Ticket): void</code> — add a new ticket to TicketList.</li>
  <li><code>getCheapestTicket(): Ticket</code> — return the ticket with the lowest price. Assume list is non-empty and there is only one ticket in the list with the lowest price.</li>
  <li><code>countTicketsByType(value: String): int</code> — return the count of tickets whose type equals value (case-insensitive). If no matching data is found, return 0.</li>
</ul>`;
const q3PromptVi = `<p><strong>(2 điểm)</strong> Viết lớp tên <strong>Ticket</strong> với thông tin sau:</p>
${table([
  '-code: String<br/>-type: String<br/>-price: double',
  '+Ticket(code: String, type: String, price: double)<br/>+getCode(): String<br/>+getType(): String<br/>+getPrice(): double<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Ticket(code: String, type: String, price: double)</code> — constructor: gán giá trị cho code, type và price.</li>
  <li><code>getCode(): String</code> — trả về code.</li>
  <li><code>getType(): String</code> — trả về type.</li>
  <li><code>getPrice(): double</code> — trả về price.</li>
  <li><code>toString(): String</code> — trả về chuỗi chứa đầy đủ thông tin Ticket: code, type, price. Price định dạng 2 chữ số thập phân. <strong>Lưu ý</strong>: không dùng khoảng trắng để phân tách giá trị.</li>
</ul>
<p>Viết lớp tên <strong>TicketList</strong> kế thừa từ <strong>ArrayList</strong> (ArrayList là 1 collection) với thông tin sau:</p>
<pre>public class TicketList extends ArrayList&lt;Ticket&gt; {
    //.....
}</pre>
<ul>
  <li><code>addTicket(ticket: Ticket): void</code> — thêm 1 ticket mới vào TicketList.</li>
  <li><code>getCheapestTicket(): Ticket</code> — trả về ticket có price thấp nhất. Giả sử danh sách không rỗng và chỉ có 1 ticket có price thấp nhất.</li>
  <li><code>countTicketsByType(value: String): int</code> — trả về số lượng ticket có type bằng value (không phân biệt hoa/thường). Nếu không có dữ liệu khớp, trả về 0.</li>
</ul>`;

const q3ExplainEn = `<p><code>toString()</code> is exactly <code>code + "," + type + "," + String.format("%.2f", price)</code> — no spaces, 2 decimal places, matches the initial list shown in the sample ("V001,VIP,150.00", ...). Method name is <strong>lowercase-c</strong> <code>countTicketsByType</code> (confirmed by decompiling the real given <code>Main.class</code> — it calls <code>TicketList.countTicketsByType</code> exactly; a differently-cased method would compile against your own class but throw <code>NoSuchMethodError</code> against the real given harness).</p>
<p>The starting list (hardcoded by the harness, via a <code>createTicketList()</code> that only your <code>addTicket()</code> needs to support): V001,VIP,150.00 / N002,Normal,80.00 / S003,Student,50.00 / N004,Normal,75.00 / S005,Student,45.00. The harness then reads one more ticket from input and adds it before running the test.</p>
<p><strong>Source note:</strong> the exam scan we digitized this from is missing one page (the page-number counters jump from "5 of 6" to "7 of 7"), which is exactly where the OUTPUT rows for this question's two sample runs would have been transcribed. The <em>specification</em> above is complete and unambiguous (every field/method/format is fully described), so the samples below are not guesses — they were produced by compiling this exact class against the REAL given <code>Main.class</code> harness and running it, the same verification method used for every other question.</p>
<pre>Initial list + added N006,Normal,100.00 → TC1 (getCheapestTicket)
OUTPUT:
S005,Student,45.00

Initial list + added N006,Normal,100.00 → TC2 (countTicketsByType, "Normal")
OUTPUT:
3</pre>`;
const q3ExplainVi = `<p><code>toString()</code> đúng là <code>code + "," + type + "," + String.format("%.2f", price)</code> — không khoảng trắng, 2 chữ số thập phân, khớp danh sách khởi tạo trong mẫu ("V001,VIP,150.00", ...). Tên hàm là <strong>chữ c thường</strong> <code>countTicketsByType</code> (đã xác nhận bằng decompile <code>Main.class</code> given thật — nó gọi đúng <code>TicketList.countTicketsByType</code>; đặt tên khác hoa/thường vẫn biên dịch được với lớp của riêng bạn nhưng sẽ ném <code>NoSuchMethodError</code> khi chạy cùng harness given thật).</p>
<p>Danh sách khởi tạo (harness tự tạo sẵn qua <code>createTicketList()</code>, chỉ cần <code>addTicket()</code> của bạn hỗ trợ đúng): V001,VIP,150.00 / N002,Normal,80.00 / S003,Student,50.00 / N004,Normal,75.00 / S005,Student,45.00. Sau đó harness đọc thêm 1 ticket từ input rồi mới chạy test.</p>
<p><strong>Ghi chú nguồn:</strong> bộ ảnh scan đề mà bài này số hoá lại bị thiếu 1 trang (số trang nhảy từ "5 of 6" sang "7 of 7") — đúng chỗ lẽ ra có OUTPUT của 2 mẫu chạy câu này. Tuy nhiên <em>đặc tả</em> ở trên đầy đủ và không mơ hồ (mọi field/hàm/định dạng đều mô tả rõ), nên các mẫu dưới đây KHÔNG phải đoán — chúng được tạo ra bằng cách biên dịch đúng lớp này cùng harness <code>Main.class</code> given THẬT rồi chạy thật, cùng cách kiểm đã dùng cho mọi câu khác.</p>
<pre>Danh sách gốc + thêm N006,Normal,100.00 → TC1 (getCheapestTicket)
OUTPUT:
S005,Student,45.00

Danh sách gốc + thêm N006,Normal,100.00 → TC2 (countTicketsByType, "Normal")
OUTPUT:
3</pre>`;

const q3 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `import java.util.ArrayList;

public class Ticket {
    private String code;
    private String type;
    private double price;
    // TODO: constructor, getCode, getType, getPrice,
    // toString() ("code,type,price" price with 2 decimals, no spaces)
}

class TicketList extends ArrayList<Ticket> {
    // TODO: addTicket, getCheapestTicket, countTicketsByType
}`,
  sampleSolution: `${read('q2/material_2/src/Ticket.java')}\n\n${read('q2/material_2/src/TicketList.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — getCheapestTicket, list + added N006,Normal,100.00):
OUTPUT:
S005,Student,45.00

Sample run 2 (TC 2 — countTicketsByType("Normal"), list + added N006,Normal,100.00):
OUTPUT:
3`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'toString', criterion: B('Ticket.toString() uses "code,type,price" with price at 2 decimal places and no spaces.', 'Ticket.toString() dùng "code,type,price", price 2 chữ số thập phân, không khoảng trắng.'), weight: 1, maxScore: 1 },
    { id: 'getCheapestTicket', criterion: B('getCheapestTicket() returns the actual Ticket object with the lowest price.', 'getCheapestTicket() trả về đúng object Ticket có price thấp nhất.'), weight: 1, maxScore: 1 },
    { id: 'countTicketsByType', criterion: B('countTicketsByType() is case-insensitive and returns 0 when nothing matches.', 'countTicketsByType() không phân biệt hoa/thường, trả về 0 khi không khớp.'), weight: 1, maxScore: 1 },
  ],
};

// ── Q4: MyString implements IString ──
const ISTRING_SRC = `public interface IString {
    public int f1(String str);
    public String f2(String str);
}`;

const q4PromptEn = `<p><strong>(3 marks)</strong> The interface <strong>IString</strong> below is already compiled and given in byte code format, thus you can use it without creating the IString.java file:</p>
<pre>${ISTRING_SRC}</pre>
<p>Write a class named <strong>MyString</strong>, which implements the interface <strong>IString</strong>. The class MyString implements methods f1 and f2 in IString as below:</p>
<ul>
  <li><strong>f1</strong>: Count and return number of words containing at least 1 odd digit.</li>
  <li><strong>f2</strong>: Return the string s, which is obtained by replacing the (first) palindrome word in str with the string "XX" (word = a string without space(s), a word is called palindrom if it and its reverse are the same).</li>
</ul>`;
const q4PromptVi = `<p><strong>(3 điểm)</strong> Interface <strong>IString</strong> dưới đây đã được biên dịch sẵn dạng byte code, bạn dùng thẳng không cần tạo file IString.java:</p>
<pre>${ISTRING_SRC}</pre>
<p>Viết lớp tên <strong>MyString</strong>, implement interface <strong>IString</strong>. Lớp MyString cài đặt các hàm f1 và f2 trong IString như sau:</p>
<ul>
  <li><strong>f1</strong>: Đếm và trả về số từ chứa ít nhất 1 chữ số lẻ.</li>
  <li><strong>f2</strong>: Trả về chuỗi s, thu được bằng cách thay từ palindrome (đối xứng) ĐẦU TIÊN trong str bằng chuỗi "XX" (từ = chuỗi không chứa khoảng trắng, một từ là palindrome nếu nó và chuỗi đảo ngược của nó giống nhau).</li>
</ul>`;

const q4ExplainEn = `<p><strong>f1</strong> counts WORDS (not digits) — a word counts once if ANY of its digit characters is odd, e.g. "c34" has digits 3 (odd) and 4 (even), it still counts once because it has at least one odd digit. Pure-letter words like "a" or "b2"'s only digit "2" (even) don't count.</p>
<p><strong>f2</strong> only replaces the <em>first</em> palindrome word found (scanning left to right), leaving every other word — including later palindromes — untouched. A single character or a purely numeric word can be a palindrome too (e.g. "12321" reversed is still "12321").</p>
<p>Verified against both given samples by compiling <code>MyString.java</code> with the real given <code>Main.class</code>:</p>
<pre>f1("a a1 b2 c34 d6") → 2   (a1 has odd digit 1; c34 has odd digit 3; a/b2/d6 don't)
f2("ab 12321 uv 12321 xy") → "ab XX uv 12321 xy"   (only the FIRST "12321" replaced)</pre>`;
const q4ExplainVi = `<p><strong>f1</strong> đếm THEO TỪ (không đếm chữ số) — một từ được tính 1 lần nếu CÓ BẤT KỲ chữ số lẻ nào trong đó, vd "c34" có chữ số 3 (lẻ) và 4 (chẵn), vẫn tính 1 lần vì có ít nhất 1 chữ số lẻ. Từ toàn chữ cái như "a", hay "b2" (chữ số duy nhất "2" chẵn) thì không tính.</p>
<p><strong>f2</strong> chỉ thay từ palindrome <em>đầu tiên</em> tìm thấy (quét trái sang phải), giữ nguyên mọi từ khác — kể cả palindrome xuất hiện sau đó. Một ký tự đơn hoặc từ toàn số cũng có thể là palindrome (vd "12321" đảo ngược vẫn là "12321").</p>
<p>Đã đối chiếu với cả 2 mẫu trong đề bằng cách biên dịch <code>MyString.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>f1("a a1 b2 c34 d6") → 2   (a1 có chữ số lẻ 1; c34 có chữ số lẻ 3; a/b2/d6 thì không)
f2("ab 12321 uv 12321 xy") → "ab XX uv 12321 xy"   (chỉ thay "12321" ĐẦU TIÊN)</pre>`;

const q4 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `${ISTRING_SRC}

public class MyString implements IString {
    // TODO: f1, f2
}`,
  sampleSolution: read('q3/material_3/src/MyString.java'),
  expectedOutput:
`Sample run 1 (TC 1 — f1, input: "a a1 b2 c34 d6"):
OUTPUT:
2

Sample run 2 (TC 2 — f2, input: "ab 12321 uv 12321 xy"):
OUTPUT:
ab XX uv 12321 xy`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'f1', criterion: B('f1() counts words containing at least one odd digit (counts each qualifying word once).', 'f1() đếm số từ chứa ít nhất 1 chữ số lẻ (mỗi từ đạt điều kiện chỉ tính 1 lần).'), weight: 1, maxScore: 1.5 },
    { id: 'f2', criterion: B('f2() replaces only the FIRST palindrome word with "XX", leaving the rest untouched.', 'f2() chỉ thay từ palindrome ĐẦU TIÊN bằng "XX", giữ nguyên phần còn lại.'), weight: 1, maxScore: 1.5 },
  ],
};

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE4-SU26-P1',
      title: B('PRO192 — Practical Exam Đề 4 (SU26, Paper 1)', 'PRO192 — Đề thi thực hành số 4 (SU26, Paper 1)'),
      description: B(
        'Real PRO192 PE paper (4 questions, 10 marks) — OOP class design (encapsulation, inheritance, toString formatting), one class extending ArrayList<T>, one interface implementation over Strings. Solutions written & verified by compiling against the real given Main.class harness.',
        'Đề PE PRO192 thật (4 câu, 10 điểm) — thiết kế lớp OOP (đóng gói, kế thừa, định dạng toString), một lớp kế thừa ArrayList<T>, một interface cài đặt trên String. Lời giải đã viết và kiểm bằng cách biên dịch cùng harness Main.class given thật.',
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
  `// AUTO-GENERATED by scripts/build-pro192-pe4.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
