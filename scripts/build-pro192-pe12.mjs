/**
 * build-pro192-pe12.mjs — sinh content/exams/PRO192-PE12.mjs.
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
 * Nguồn đã verify: scratchpad pro192-pe/de12/q{0..3} — mỗi thư mục compile
 * xong bằng `javac` cùng Main.class thật của given materials, chạy `java Main`
 * với đúng stdin mẫu trong đề, output khớp 100% với PDF.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE12.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/7a3dab05-4d89-4139-97aa-6d1578ef74f8/scratchpad/pro192-pe/de12';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE12.mjs');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').trimEnd();

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE12-Given.zip';

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

// ── Q1: Coral ──
const q1PromptEn = `<p><strong>(2 marks)</strong> Read PE instructions at the bottom of the exam paper. Ignore the real meaning of objects, variables and their values in the questions below.</p>
<p>Create a class called <strong>Coral</strong> described as follows:</p>
${table([
  '-name: String<br/>-price: int',
  '+Coral()<br/>+Coral(name: String, price: int)<br/>+getName(): String<br/>+getPrice(): int<br/>+setPrice(price: int): void',
])}
<p>Where:</p>
<ul>
  <li><code>Coral()</code> — default constructor.</li>
  <li><code>Coral(name: String, price: int)</code> — constructor, which sets values to name and price.</li>
  <li><code>getName(): String</code> — returns the string s, by removing the first character of the name.</li>
  <li><code>getPrice(): int</code> — return price.</li>
  <li><code>setPrice(price: int): void</code> — update price = new price. <em>Do not format the result.</em></li>
</ul>`;
const q1PromptVi = `<p><strong>(2 điểm)</strong> Đọc hướng dẫn PE ở cuối đề thi. Bỏ qua ý nghĩa thực tế của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</p>
<p>Tạo một lớp tên <strong>Coral</strong> được mô tả như sau:</p>
${table([
  '-name: String<br/>-price: int',
  '+Coral()<br/>+Coral(name: String, price: int)<br/>+getName(): String<br/>+getPrice(): int<br/>+setPrice(price: int): void',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Coral()</code> — constructor mặc định.</li>
  <li><code>Coral(name: String, price: int)</code> — constructor, gán giá trị cho name và price.</li>
  <li><code>getName(): String</code> — trả về chuỗi s, đã bỏ ký tự ĐẦU TIÊN của name.</li>
  <li><code>getPrice(): int</code> — trả về price.</li>
  <li><code>setPrice(price: int): void</code> — cập nhật price = giá trị mới. <em>Không định dạng lại kết quả.</em></li>
</ul>`;

const q1ExplainEn = `<p>Straightforward encapsulation. The only trap is <code>getName()</code>: it does NOT return the raw <code>name</code> field — it returns <code>name</code> with its FIRST character removed (<code>name.substring(1)</code>), e.g. "vietnam" → "ietnam". This is the OPPOSITE of Đề 11's Coral (which removed the LAST character) — do not carry over the wrong rule if you solved that paper too. Everything else is a plain getter/setter/constructor pair.</p>
<p>Verified by compiling <code>Coral.java</code> together with the real given <code>Main.class</code> and running both sample TCs — output matched byte-for-byte:</p>
<pre>Enter name: vietnam
Enter price: 10
1. Test getName()
2. Test setPrice()
Enter TC (1 or 2): 1
OUTPUT:
ietnam</pre>
<pre>Enter name: vietnam
Enter price: 10
1. Test getName()
2. Test setPrice()
Enter TC (1 or 2): 2
Enter new price: 12
OUTPUT:
12</pre>`;
const q1ExplainVi = `<p>Đóng gói (encapsulation) đơn giản. Bẫy duy nhất nằm ở <code>getName()</code>: KHÔNG trả về nguyên field <code>name</code>, mà trả về <code>name</code> đã bỏ ký tự ĐẦU TIÊN (<code>name.substring(1)</code>), ví dụ "vietnam" → "ietnam". Đây là NGƯỢC LẠI với Coral ở Đề 11 (bỏ ký tự CUỐI) — đừng mang nhầm luật của đề kia sang nếu bạn từng giải cả hai. Các hàm còn lại là getter/setter/constructor thông thường.</p>
<p>Đã kiểm bằng cách biên dịch <code>Coral.java</code> cùng <code>Main.class</code> given thật và chạy cả 2 test case mẫu — output khớp từng ký tự:</p>
<pre>Enter name: vietnam
Enter price: 10
1. Test getName()
2. Test setPrice()
Enter TC (1 or 2): 1
OUTPUT:
ietnam</pre>
<pre>Enter name: vietnam
Enter price: 10
1. Test getName()
2. Test setPrice()
Enter TC (1 or 2): 2
Enter new price: 12
OUTPUT:
12</pre>`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `public class Coral {
    private String name;
    private int price;

    public Coral() {
        // TODO
    }

    public Coral(String name, int price) {
        // TODO
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
}`,
  sampleSolution: read('q0/material_0/src/Coral.java'),
  expectedOutput:
`Sample run 1 (TC 1 — getName):
INPUT:
Enter name: vietnam
Enter price: 10
1. Test getName()
2. Test setPrice()
Enter TC (1 or 2): 1
OUTPUT:
ietnam

Sample run 2 (TC 2 — setPrice):
INPUT:
Enter name: vietnam
Enter price: 10
1. Test getName()
2. Test setPrice()
Enter TC (1 or 2): 2
Enter new price: 12
OUTPUT:
12`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'ctor', criterion: B('Both constructors (default + parameterized) are correct.', 'Cả 2 constructor (mặc định + có tham số) đều đúng.'), weight: 1, maxScore: 0.5 },
    { id: 'getName', criterion: B('getName() correctly removes the FIRST character (not the raw field, not the last character).', 'getName() bỏ đúng ký tự ĐẦU (không trả nguyên field, không phải ký tự cuối).'), weight: 2, maxScore: 1 },
    { id: 'getPrice', criterion: B('getPrice() returns price correctly.', 'getPrice() trả đúng price.'), weight: 1, maxScore: 0.25 },
    { id: 'setPrice', criterion: B('setPrice() updates price correctly.', 'setPrice() cập nhật đúng price.'), weight: 1, maxScore: 0.25 },
  ],
};

// ── Q2: Ladder + SpecLadder ──
const q2PromptEn = `<p><strong>(3 marks)</strong> Create a class <strong>Ladder</strong> and a class <strong>SpecLadder</strong> that extends <strong>Ladder</strong> (i.e., Ladder is the superclass and SpecLadder is the subclass) with the following details:</p>
${table([
  '-type: String<br/>-price: int',
  '+Ladder()<br/>+Ladder(type: String, price: int)<br/>+getType(): String<br/>+getPrice(): int<br/>+setType(type: String): void<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>getType(): String</code> — return type.</li>
  <li><code>getPrice(): int</code> — return price.</li>
  <li><code>setType(type: String): void</code> — update type.</li>
  <li><code>toString(): String</code> — return the string of format: <strong>type, price</strong></li>
</ul>
${table([
  '-weight: int',
  '+SpecLadder()<br/>+SpecLadder(type: String, price: int, weight: int)<br/>+getWeight(): int<br/>+toString(): String<br/>+setData(): void<br/>+getValue(): String',
])}
<p>Where:</p>
<ul>
  <li><code>toString(): String</code> — return the string of format: <strong>type, price, weight</strong></li>
  <li><code>getWeight(): int</code> — return weight.</li>
  <li><code>setData(): void</code> — replace the first alphabetic character in type with the first digit of price.</li>
  <li><code>getValue(): String</code> — if the weight contains at least two odd digits, return the concatenation of type and the number of odd digits in the weight. Otherwise, return the concatenation of type and the total number of digits in the weight.</li>
</ul>`;
const q2PromptVi = `<p><strong>(3 điểm)</strong> Tạo lớp <strong>Ladder</strong> và lớp <strong>SpecLadder</strong> kế thừa từ <strong>Ladder</strong> (Ladder là lớp cha, SpecLadder là lớp con) với chi tiết sau:</p>
${table([
  '-type: String<br/>-price: int',
  '+Ladder()<br/>+Ladder(type: String, price: int)<br/>+getType(): String<br/>+getPrice(): int<br/>+setType(type: String): void<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>getType(): String</code> — trả về type.</li>
  <li><code>getPrice(): int</code> — trả về price.</li>
  <li><code>setType(type: String): void</code> — cập nhật type.</li>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>type, price</strong></li>
</ul>
${table([
  '-weight: int',
  '+SpecLadder()<br/>+SpecLadder(type: String, price: int, weight: int)<br/>+getWeight(): int<br/>+toString(): String<br/>+setData(): void<br/>+getValue(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>type, price, weight</strong></li>
  <li><code>getWeight(): int</code> — trả về weight.</li>
  <li><code>setData(): void</code> — thay ký tự chữ cái ĐẦU TIÊN trong type bằng chữ số ĐẦU TIÊN của price.</li>
  <li><code>getValue(): String</code> — nếu weight chứa ít nhất 2 chữ số LẺ, trả về type nối với số lượng chữ số lẻ trong weight. Ngược lại, trả về type nối với tổng số chữ số trong weight.</li>
</ul>`;

const q2ExplainEn = `<p><strong>setData()</strong>: "first alphabetic character in type" is found by scanning from the START of the string for the first letter (<code>Character.isLetter</code>); "first digit of price" is the leftmost character of <code>String.valueOf(Math.abs(price))</code> — NOT <code>% 10</code> (that gives the LAST digit). Replace that one character in place, e.g. type="standard", price=21 → first digit '2' replaces the leading 's' → "2tandard". This is the mirror image of Đề 11's SpecLadder (which used the LAST letter / LAST digit) — don't reuse that code unchanged.</p>
<p><strong>getValue()</strong>: count how many of weight's digits (as a string, ignoring sign) are ODD (1,3,5,7,9) — not even. If ≥ 2, return <code>type + oddCount</code>; otherwise return <code>type + totalDigitCount</code>. Verified against BOTH given samples: weight=123 → digits {1,2,3}, odd ones {1,3} → 2 odd digits ≥ 2 → "standard2". weight=124 → digits {1,2,4}, odd ones {1} → 1 odd digit &lt; 2 → fall back to total digit count 3 → "standard3".</p>
<p>The sample run for TC1 prints <strong>two</strong> lines: the superclass's own <code>toString()</code> ("type, price") then the subclass's overridden one ("type, price, weight") — this is because the harness keeps a separate <code>Ladder</code> object (built from type+price only) alongside the <code>SpecLadder</code> object (built from type+price+weight), and prints both. For TC2 the harness prints only <code>getType() + ", " + getPrice()</code> after calling the void <code>setData()</code> — not the 3-field <code>toString()</code> — confirmed empirically by compiling both classes with the real given <code>Main.class</code> and running all 4 sample TCs:</p>
<pre>Enter type: standard / price: 100 / weight: 50 → TC1
OUTPUT:
standard, 100
standard, 100, 50

Enter type: standard / price: 21 / weight: 20 → TC2
OUTPUT:
2tandard, 21

Enter type: standard / price: 12 / weight: 123 → TC3
OUTPUT:
standard2

Enter type: standard / price: 12 / weight: 124 → TC3
OUTPUT:
standard3</pre>`;
const q2ExplainVi = `<p><strong>setData()</strong>: "ký tự chữ cái đầu tiên trong type" tìm bằng cách quét từ ĐẦU chuỗi tới chữ cái đầu tiên gặp được (<code>Character.isLetter</code>); "chữ số đầu tiên của price" là ký tự bên trái nhất của <code>String.valueOf(Math.abs(price))</code> — KHÔNG phải <code>% 10</code> (cái đó cho chữ số CUỐI). Thay đúng 1 ký tự đó, ví dụ type="standard", price=21 → chữ số đầu '2' thay cho 's' đầu → "2tandard". Đây là ảnh gương của SpecLadder ở Đề 11 (dùng chữ cái CUỐI / chữ số CUỐI) — đừng copy nguyên code cũ.</p>
<p><strong>getValue()</strong>: đếm trong các chữ số của weight (chuyển thành chuỗi, bỏ dấu âm) có bao nhiêu chữ số LẺ (1,3,5,7,9) — không phải chẵn. Nếu ≥ 2, trả về <code>type + số_chữ_số_lẻ</code>; ngược lại trả về <code>type + tổng_số_chữ_số</code>. Đã đối chiếu với CẢ HAI mẫu trong đề: weight=123 → chữ số {1,2,3}, số lẻ {1,3} → 2 chữ số lẻ ≥ 2 → "standard2". weight=124 → chữ số {1,2,4}, số lẻ {1} → 1 &lt; 2 → dùng tổng số chữ số = 3 → "standard3".</p>
<p>Mẫu chạy TC1 in <strong>hai</strong> dòng: dòng <code>toString()</code> của lớp cha ("type, price") rồi tới dòng đã override của lớp con ("type, price, weight") — vì harness giữ MỘT object <code>Ladder</code> riêng (dựng từ type+price) song song với object <code>SpecLadder</code> (dựng từ type+price+weight), rồi in cả hai. Với TC2, harness chỉ in <code>getType() + ", " + getPrice()</code> sau khi gọi <code>setData()</code> (hàm void) — không phải <code>toString()</code> 3 trường — đã xác nhận bằng thực nghiệm: biên dịch cả 2 lớp cùng <code>Main.class</code> given thật và chạy đủ 4 test case mẫu:</p>
<pre>Enter type: standard / price: 100 / weight: 50 → TC1
OUTPUT:
standard, 100
standard, 100, 50

Enter type: standard / price: 21 / weight: 20 → TC2
OUTPUT:
2tandard, 21

Enter type: standard / price: 12 / weight: 123 → TC3
OUTPUT:
standard2

Enter type: standard / price: 12 / weight: 124 → TC3
OUTPUT:
standard3</pre>`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `public class Ladder {
    private String type;
    private int price;
    // TODO: constructors, getType, getPrice, setType, toString ("type, price")
}

class SpecLadder extends Ladder {
    private int weight;
    // TODO: constructors, getWeight, toString ("type, price, weight"),
    // setData(), getValue()
}`,
  sampleSolution: `${read('q1/material_1/src/Ladder.java')}\n\n${read('q1/material_1/src/SpecLadder.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — toString, type=standard price=100 weight=50):
OUTPUT:
standard, 100
standard, 100, 50

Sample run 2 (TC 2 — setData, type=standard price=21 weight=20):
OUTPUT:
2tandard, 21

Sample run 3 (TC 3 — getValue, type=standard price=12 weight=123):
OUTPUT:
standard2

Sample run 4 (TC 3 — getValue, type=standard price=12 weight=124):
OUTPUT:
standard3`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'inherit', criterion: B('SpecLadder correctly extends Ladder and both toString() formats are right.', 'SpecLadder kế thừa đúng Ladder, cả 2 định dạng toString() đều đúng.'), weight: 2, maxScore: 1 },
    { id: 'setData', criterion: B('setData() replaces exactly the first alphabetic character with the first digit of price.', 'setData() thay đúng ký tự chữ cái đầu bằng chữ số đầu của price.'), weight: 2, maxScore: 1 },
    { id: 'getValue', criterion: B('getValue() correctly branches on "at least two odd digits" vs total digit count.', 'getValue() rẽ nhánh đúng theo "ít nhất 2 chữ số lẻ" và tổng số chữ số.'), weight: 2, maxScore: 1 },
  ],
};

// ── Q3: MyLadder implements ILadder ──
const ILADDER_SRC = `import java.util.List;
public interface ILadder {
    public int f1(List<Ladder> t);
    public void f2(List<Ladder> t);
    public void f3(List<Ladder> t);
}`;

const q3PromptEn = `<p><strong>(3 marks)</strong> Create a class called <strong>Ladder</strong> described as follows:</p>
${table([
  '-type: String<br/>-price: int',
  '+Ladder()<br/>+Ladder(type: String, price: int)<br/>+getType(): String<br/>+getPrice(): int<br/>+setType(type: String): void<br/>+setPrice(price: int): void',
])}
<p>Where:</p>
<ul>
  <li><code>getType(): String</code> — return type.</li>
  <li><code>getPrice(): int</code> — return price.</li>
  <li><code>setType(type: String): void</code> — update type.</li>
  <li><code>setPrice(price: int): void</code> — update price.</li>
</ul>
<p>The interface <strong>ILadder</strong> below is already compiled and provided in byte type format, so you can use it without creating the ILadder.java file:</p>
<pre>${ILADDER_SRC}</pre>
<p>Create a class <strong>MyLadder</strong> that implements the interface <strong>ILadder</strong>. The class MyLadder implements methods f1, f2 and f3 in ILadder as follows (you can add other functions in the MyLadder class):</p>
<ul>
  <li><strong>f1</strong>: Sum the price of all ladders whose type contains more uppercase letters than lowercase letters.</li>
  <li><strong>f2</strong>: Set the price of all ladders whose type has the longest length in the list to 0.</li>
  <li><strong>f3</strong>: Remove all items whose type contains the greatest number of letters in the list.</li>
</ul>`;
const q3PromptVi = `<p><strong>(3 điểm)</strong> Tạo một lớp tên <strong>Ladder</strong> được mô tả như sau:</p>
${table([
  '-type: String<br/>-price: int',
  '+Ladder()<br/>+Ladder(type: String, price: int)<br/>+getType(): String<br/>+getPrice(): int<br/>+setType(type: String): void<br/>+setPrice(price: int): void',
])}
<p>Trong đó:</p>
<ul>
  <li><code>getType(): String</code> — trả về type.</li>
  <li><code>getPrice(): int</code> — trả về price.</li>
  <li><code>setType(type: String): void</code> — cập nhật type.</li>
  <li><code>setPrice(price: int): void</code> — cập nhật price.</li>
</ul>
<p>Interface <strong>ILadder</strong> dưới đây đã được biên dịch sẵn dạng byte code, bạn dùng thẳng không cần tạo file ILadder.java:</p>
<pre>${ILADDER_SRC}</pre>
<p>Tạo lớp <strong>MyLadder</strong> implement interface <strong>ILadder</strong>. Lớp MyLadder cài đặt các hàm f1, f2, f3 trong ILadder như sau (bạn có thể thêm hàm khác trong lớp MyLadder):</p>
<ul>
  <li><strong>f1</strong>: Tính tổng price của các ladder có type chứa số chữ cái IN HOA nhiều hơn số chữ cái thường.</li>
  <li><strong>f2</strong>: Đặt price = 0 cho tất cả ladder có type với độ dài lớn nhất trong danh sách.</li>
  <li><strong>f3</strong>: Xoá khỏi danh sách tất cả phần tử có type chứa số lượng chữ cái nhiều nhất.</li>
</ul>`;

const q3ExplainEn = `<p>Three DISTINCT counting rules on the same list — easy to conflate f2 and f3 by accident:</p>
<ul>
  <li><strong>f1</strong> counts only letters (digits ignored) via <code>Character.isUpperCase</code>/<code>isLowerCase</code>, sums price when uppercase &gt; lowercase.</li>
  <li><strong>f2</strong> compares <code>type.length()</code> (the WHOLE string, letters + digits) — the longest string(s) get price reset to 0.</li>
  <li><strong>f3</strong> compares the COUNT OF LETTERS ONLY in type (<code>Character.isLetter</code>, digits don't count) — items with the most letters get removed, via <code>Iterator.remove()</code> so the underlying list actually shrinks.</li>
</ul>
<p>Verified against all 3 given samples by compiling <code>MyLadder.java</code> with the real given <code>Main.class</code> (the harness has its own hard-coded list, "Add how many elements: 0" just adds nothing extra):</p>
<pre>f1: (AB1,11)(BC1,9)(de1,16)(ef2,14) → 20   (only AB1, BC1 have more uppercase than lowercase → 11+9)
f2: (A1,6)(B1,9)(A12,2)(B12,5) → (A1,6)(B1,9)(A12,0)(B12,0)   (A12/B12 are the longest strings, length 3)
f3: (AB123,10)(AC1,11)(A1234,12)(B1,13) → (A1234,12)(B1,13)   (AB123 and AC1 both have 2 letters, the max — removed)</pre>`;
const q3ExplainVi = `<p>Ba quy tắc đếm KHÁC NHAU trên cùng một danh sách — rất dễ nhầm lẫn giữa f2 và f3:</p>
<ul>
  <li><strong>f1</strong> chỉ đếm chữ cái (bỏ qua chữ số) bằng <code>Character.isUpperCase</code>/<code>isLowerCase</code>, cộng dồn price khi số hoa &gt; số thường.</li>
  <li><strong>f2</strong> so sánh <code>type.length()</code> (TOÀN BỘ chuỗi, cả chữ lẫn số) — chuỗi dài nhất bị đặt price về 0.</li>
  <li><strong>f3</strong> so sánh SỐ LƯỢNG CHỮ CÁI trong type (<code>Character.isLetter</code>, chữ số không tính) — phần tử có nhiều chữ cái nhất bị xoá, dùng <code>Iterator.remove()</code> để danh sách gốc thực sự co lại.</li>
</ul>
<p>Đã đối chiếu với cả 3 mẫu trong đề bằng cách biên dịch <code>MyLadder.java</code> cùng <code>Main.class</code> given thật (harness có sẵn danh sách cứng, "Add how many elements: 0" nghĩa là không thêm gì):</p>
<pre>f1: (AB1,11)(BC1,9)(de1,16)(ef2,14) → 20   (chỉ AB1, BC1 có số chữ hoa nhiều hơn chữ thường → 11+9)
f2: (A1,6)(B1,9)(A12,2)(B12,5) → (A1,6)(B1,9)(A12,0)(B12,0)   (A12/B12 là chuỗi dài nhất, độ dài 3)
f3: (AB123,10)(AC1,11)(A1234,12)(B1,13) → (A1234,12)(B1,13)   (AB123 và AC1 đều có 2 chữ cái, nhiều nhất — bị xoá)</pre>`;

const q3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `${ILADDER_SRC}

public class Ladder {
    private String type;
    private int price;
    // TODO: constructors, getType, getPrice, setType, setPrice
}

class MyLadder implements ILadder {
    // TODO: f1, f2, f3
}`,
  sampleSolution: `${read('q2/material_2/src/Ladder.java')}\n\n${read('q2/material_2/src/MyLadder.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — f1, list: (AB1,11) (BC1,9) (de1,16) (ef2,14)):
OUTPUT:
20

Sample run 2 (TC 2 — f2, list: (A1,6) (B1,9) (A12,2) (B12,5)):
OUTPUT:
(A1,6) (B1,9) (A12,0) (B12,0)

Sample run 3 (TC 3 — f3, list: (AB123,10) (AC1,11) (A1234,12) (B1,13)):
OUTPUT:
(A1234,12) (B1,13)`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'f1', criterion: B('f1() counts letter case correctly and ignores digits.', 'f1() đếm đúng hoa/thường, bỏ qua chữ số.'), weight: 1, maxScore: 1 },
    { id: 'f2', criterion: B('f2() uses total string length (not letter count) to zero out prices.', 'f2() dùng độ dài toàn chuỗi (không phải số chữ cái) để đặt price = 0.'), weight: 1, maxScore: 1 },
    { id: 'f3', criterion: B('f3() uses letter count (not string length) and actually removes from the list.', 'f3() dùng số chữ cái (không phải độ dài chuỗi) và thực sự xoá khỏi danh sách.'), weight: 1, maxScore: 1 },
  ],
};

// ── Q4: MyString implements IString ──
const ISTRING_SRC = `public interface IString {
    public int f1(String str);
    public String f2(String str);
}`;

const q4PromptEn = `<p><strong>(2 marks)</strong> The interface <strong>IString</strong> below is already compiled and provided in byte code format, so you can use it without creating the IString.java file:</p>
<pre>${ISTRING_SRC}</pre>
<p>Create a class called <strong>MyString</strong> that implements the interface <strong>IString</strong>. The class MyString implements methods f1 and f2 in IString as follows:</p>
<ul>
  <li><strong>f1</strong>: Return the number of words that contain exactly two different digits and at least one lowercase letter. (word = a string without space(s))</li>
  <li><strong>f2</strong>: Return a new string consisting of all words whose number of alphabetic characters is not equal to the number of non-alphabetic characters. Keep the original order of appearance. Words in the result must be separated by a single space and the returned string must not contain leading or trailing spaces. Return an empty string if no word satisfies the condition. (word = a string without space(s))</li>
</ul>`;
const q4PromptVi = `<p><strong>(2 điểm)</strong> Interface <strong>IString</strong> dưới đây đã được biên dịch sẵn dạng byte code, bạn dùng thẳng không cần tạo file IString.java:</p>
<pre>${ISTRING_SRC}</pre>
<p>Tạo lớp <strong>MyString</strong> implement interface <strong>IString</strong>. Lớp MyString cài đặt hàm f1 và f2 trong IString như sau:</p>
<ul>
  <li><strong>f1</strong>: Trả về số lượng từ chứa đúng 2 chữ số KHÁC NHAU và có ít nhất 1 chữ cái thường. (từ = chuỗi không chứa khoảng trắng)</li>
  <li><strong>f2</strong>: Trả về chuỗi mới gồm các từ có số ký tự chữ cái KHÔNG bằng số ký tự không phải chữ cái. Giữ nguyên thứ tự xuất hiện ban đầu. Các từ trong kết quả cách nhau đúng 1 khoảng trắng, chuỗi trả về không có khoảng trắng ở đầu/cuối. Trả về chuỗi rỗng nếu không có từ nào thoả điều kiện. (từ = chuỗi không chứa khoảng trắng)</li>
</ul>`;

const q4ExplainEn = `<p><strong>f1</strong>: collect the DISTINCT digit characters of each word into a <code>Set&lt;Character&gt;</code> — "exactly two different digits" means <code>set.size() == 2</code> (a word like "B121" has digits {1,2}, still size 2, even though '1' repeats), AND at least one lowercase letter must be present.</p>
<p><strong>f2</strong>: for each word, count alphabetic vs non-alphabetic characters; keep the word only when the two counts differ, join survivors with a single space (no leading/trailing space — a <code>StringBuilder</code> that only inserts a separator when non-empty handles this naturally).</p>
<p>Verified against both given samples by compiling <code>MyString.java</code> with the real given <code>Main.class</code>:</p>
<pre>f1("A12b B121 c34D 111X") → 2
  A12b: digits {1,2} size 2, has lowercase 'b' → counts
  B121: digits {1,2} size 2, but NO lowercase → excluded
  c34D: digits {3,4} size 2, has lowercase 'c' → counts
  111X: digits {1} size 1 → excluded

f2("ab12 A#B# xyz") → "xyz"
  ab12: 2 letters, 2 non-letters → equal → excluded
  A#B#: 2 letters, 2 non-letters → equal → excluded
  xyz:  3 letters, 0 non-letters → not equal → kept</pre>`;
const q4ExplainVi = `<p><strong>f1</strong>: gom các ký tự CHỮ SỐ KHÁC NHAU của mỗi từ vào <code>Set&lt;Character&gt;</code> — "đúng 2 chữ số khác nhau" nghĩa là <code>set.size() == 2</code> (từ như "B121" có chữ số {1,2}, vẫn size 2 dù '1' lặp lại), VÀ phải có ít nhất 1 chữ cái thường.</p>
<p><strong>f2</strong>: với mỗi từ, đếm số ký tự chữ cái và không phải chữ cái; chỉ giữ từ khi 2 số này KHÁC nhau, nối các từ giữ lại bằng đúng 1 khoảng trắng (không có khoảng trắng đầu/cuối — dùng <code>StringBuilder</code> chỉ chèn dấu cách khi đã có nội dung sẽ tự nhiên đạt yêu cầu này).</p>
<p>Đã đối chiếu với cả 2 mẫu trong đề bằng cách biên dịch <code>MyString.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>f1("A12b B121 c34D 111X") → 2
  A12b: chữ số {1,2} size 2, có chữ thường 'b' → tính
  B121: chữ số {1,2} size 2, nhưng KHÔNG có chữ thường → loại
  c34D: chữ số {3,4} size 2, có chữ thường 'c' → tính
  111X: chữ số {1} size 1 → loại

f2("ab12 A#B# xyz") → "xyz"
  ab12: 2 chữ cái, 2 không-chữ-cái → bằng nhau → loại
  A#B#: 2 chữ cái, 2 không-chữ-cái → bằng nhau → loại
  xyz:  3 chữ cái, 0 không-chữ-cái → không bằng → giữ lại</pre>`;

const q4 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `${ISTRING_SRC}

public class MyString implements IString {
    // TODO: f1, f2
}`,
  sampleSolution: read('q3/material_3/src/MyString.java'),
  expectedOutput:
`Sample run 1 (TC 1 — f1, input: "A12b B121 c34D 111X"):
OUTPUT:
2

Sample run 2 (TC 2 — f2, input: "ab12 A#B# xyz"):
OUTPUT:
xyz`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'f1', criterion: B('f1() requires exactly 2 DISTINCT digits (as a set) AND at least one lowercase letter.', 'f1() đòi đúng 2 chữ số KHÁC NHAU (theo set) VÀ ít nhất 1 chữ thường.'), weight: 1, maxScore: 1 },
    { id: 'f2', criterion: B('f2() compares letter count vs non-letter count and joins with single spaces, no leading/trailing space.', 'f2() so sánh đúng số chữ cái và số không-chữ-cái, nối bằng 1 khoảng trắng, không dư đầu/cuối.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE12-SU26-B1-P6',
      title: B('PRO192 — Practical Exam Đề 12 (SU26, Block 1, Paper 6)', 'PRO192 — Đề thi thực hành số 12 (SU26, Block 1, Paper 6)'),
      description: B(
        'Real PRO192 PE paper (4 questions, 10 marks) — OOP class design (encapsulation, inheritance, toString), an interface implementation over a List, and string processing. Solutions written & verified by compiling against the real given Main.class harness.',
        'Đề PE PRO192 thật (4 câu, 10 điểm) — thiết kế lớp OOP (đóng gói, kế thừa, toString), cài đặt interface trên List, và xử lý chuỗi. Lời giải đã viết và kiểm bằng cách biên dịch cùng harness Main.class given thật.',
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
  `// AUTO-GENERATED by scripts/build-pro192-pe12.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
