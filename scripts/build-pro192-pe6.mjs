/**
 * build-pro192-pe6.mjs — sinh content/exams/PRO192-PE6.mjs.
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
 * Nguồn đã verify: scratchpad pro192-pe/de6/q{0..3} — mỗi thư mục compile
 * xong bằng `javac` cùng Main.class thật của given materials, chạy `java Main`
 * với đúng stdin mẫu trong đề, output khớp CHÍNH XÁC với PDF (không có trang
 * nào thiếu ở đề này, cả 4 câu đủ đặc tả + sample run).
 *
 * Nguồn zip gốc (PRO192_PE_SU25_B1_881719.zip) đã SẠCH — chỉ có Main.class
 * (+IWine.class/IString.class) + scaffold NetBeans (build.xml, manifest.mf,
 * nbproject/*), KHÔNG có lời giải kèm sẵn. Đóng gói lại y nguyên cấu trúc
 * (đổi tên thư mục 1/2/3/4 → Q1/Q2/Q3/Q4, nội dung project.xml/properties
 * đã sẵn tên Q1..Q4 nên không cần sed), verify GET 200 + unzip đúng 53 file,
 * sanity-check Q1 build+run lại với Water.java rồi gỡ ra trước khi zip.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE6.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/2c89fc57-9aa7-4c2e-8cc0-a484bfb4eb0f/scratchpad/pro192-pe/de6';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE6.mjs');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').trimEnd();

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE6-Given.zip';

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> (transcribed from the real exam paper).</p>
   <ol>
     <li>Students are ONLY allowed to use materials on their own computer (including JDK, NetBeans...). For distance learning: Google Meet, Hangout (for exam monitoring purpose).</li>
     <li>Create a folder to save the given projects (e.g. PRO_given), download the given materials into it. Open NetBeans, open the given Qx project, then complete it according to the exam requirements. Do NOT delete or edit given files, or create a java file with the same name as a given file.</li>
     <li>Before submission: run "Clean and Build Project" (Shift+F11), then rename the folder <code>dist</code> to <strong>RUN</strong> (or run) — if the folder RUN already exists, delete it before renaming. In folder run, there is only a jar file, e.g. for Q1 it is Q1.jar.</li>
     <li>Do NOT use accented Vietnamese when writing comments in programs. Do NOT create a new project — you must use the given project and modify it. Do NOT delete given file(s) and do not create file(s) with the same name as given. Do NOT use package in code.</li>
     <li>Software tools must be used: Apache NetBeans IDE 17 and Java JDK 1.8. If at least one of the above requirements is not followed, the exam will get ZERO.</li>
   </ol>
   <p>This exam room cannot run NetBeans/JDK in the browser, so you type each class directly into the code box below and it is graded by AI against the rubric — but the "given materials" download above is the REAL given project (with the compiled <code>Main.class</code> harness) so you can build &amp; run it for real on your own machine exactly like the actual PE, and cross-check your output against the samples shown.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> (dịch nguyên văn từ đề thi thật).</p>
   <ol>
     <li>Sinh viên CHỈ được dùng tài liệu trên máy tính của mình (kể cả JDK, NetBeans...). Với học từ xa: Google Meet, Hangout (để giám sát thi).</li>
     <li>Tạo một thư mục chứa các project given (vd PRO_given), tải given materials vào đó. Mở NetBeans, mở project Qx tương ứng, hoàn thành theo yêu cầu đề bài. KHÔNG xoá/sửa file given, KHÔNG tạo file java trùng tên với file given.</li>
     <li>Trước khi nộp: chạy "Clean and Build Project" (Shift+F11), sau đó đổi tên thư mục <code>dist</code> thành <strong>RUN</strong> (hoặc run) — nếu thư mục RUN đã tồn tại thì xoá trước khi đổi tên. Trong thư mục run chỉ có 1 file jar, vd với Q1 là Q1.jar.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment code. KHÔNG tạo project mới — phải dùng project given rồi chỉnh sửa. KHÔNG xoá file given, không tạo file trùng tên file given. KHÔNG dùng package trong code.</li>
     <li>Phần mềm bắt buộc: Apache NetBeans IDE 17 và Java JDK 1.8. Nếu vi phạm bất kỳ yêu cầu nào ở trên, bài thi sẽ bị 0 điểm.</li>
   </ol>
   <p>Phòng thi web không chạy được NetBeans/JDK trực tiếp trên trình duyệt, nên bạn gõ thẳng từng class vào ô mã bên dưới và được AI chấm theo tiêu chí — nhưng file "given materials" tải ở trên là project given THẬT (kèm harness <code>Main.class</code> đã biên dịch sẵn) để bạn có thể build &amp; chạy thật trên máy mình y hệt bài thi thật, và tự đối chiếu kết quả với các mẫu bên dưới.</p>`,
);

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ── Q1: Water ──
const q1PromptEn = `<p><strong>(2 marks)</strong> Do not pay attention to real meaning of objects, variables and their values in the questions below.</p>
<p>Write a class named <strong>Water</strong> with the following information:</p>
${table([
  '-source: String<br/>-volume: int',
  '+Water()<br/>+Water(source: String, volume: int)<br/>+getSource(): String<br/>+getVolume(): int<br/>+setVolume(volume: int): void',
])}
<p>Where:</p>
<ul>
  <li><code>Water()</code> — default constructor.</li>
  <li><code>Water(source: String, volume: int)</code> — constructor, which sets values to source and volume.</li>
  <li><code>getSource(): String</code> — returns the string s, by concatenating the first and last characters of source and volume.</li>
  <li><code>getVolume(): int</code> — return volume.</li>
  <li><code>setVolume(volume: int): void</code> — update volume = new volume * n. (<em>n is the number of digits of new volume</em>) <em>Do not format the result.</em></li>
</ul>`;
const q1PromptVi = `<p><strong>(2 điểm)</strong> Bỏ qua ý nghĩa thực tế của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</p>
<p>Viết lớp tên <strong>Water</strong> với thông tin sau:</p>
${table([
  '-source: String<br/>-volume: int',
  '+Water()<br/>+Water(source: String, volume: int)<br/>+getSource(): String<br/>+getVolume(): int<br/>+setVolume(volume: int): void',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Water()</code> — constructor mặc định.</li>
  <li><code>Water(source: String, volume: int)</code> — constructor, gán giá trị cho source và volume.</li>
  <li><code>getSource(): String</code> — trả về chuỗi s, bằng cách nối ký tự đầu và ký tự cuối của source với volume.</li>
  <li><code>getVolume(): int</code> — trả về volume.</li>
  <li><code>setVolume(volume: int): void</code> — cập nhật volume = volume mới * n. (<em>n là số chữ số của volume mới</em>) <em>Không định dạng lại kết quả.</em></li>
</ul>`;

const q1ExplainEn = `<p><code>getSource()</code> concatenates <strong>first char + last char of source + volume</strong> (as a string) — e.g. source="river" volume=100 → 'r' + 'r' + "100" = "rr100". <code>setVolume(v)</code> multiplies the NEW volume by the digit-count of that new volume, e.g. setVolume(12) → n = 2 digits → volume = 12*2 = 24 (do not add thousands separators or any formatting).</p>
<p>Verified against both given samples by compiling <code>Water.java</code> with the real given <code>Main.class</code>:</p>
<pre>source=river volume=100 → TC1 (getSource)
OUTPUT:
rr100

source=river volume=10 → TC2 (setVolume, new volume=12)
OUTPUT:
24</pre>`;
const q1ExplainVi = `<p><code>getSource()</code> nối <strong>ký tự đầu + ký tự cuối của source + volume</strong> (dạng chuỗi) — vd source="river" volume=100 → 'r' + 'r' + "100" = "rr100". <code>setVolume(v)</code> nhân volume MỚI với số chữ số của chính volume mới đó, vd setVolume(12) → n = 2 chữ số → volume = 12*2 = 24 (không thêm dấu phân cách nghìn hay định dạng gì khác).</p>
<p>Đã đối chiếu với cả 2 mẫu trong đề bằng cách biên dịch <code>Water.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>source=river volume=100 → TC1 (getSource)
OUTPUT:
rr100

source=river volume=10 → TC2 (setVolume, volume mới=12)
OUTPUT:
24</pre>`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `public class Water {
    private String source;
    private int volume;

    public Water() {
        // TODO
    }

    public Water(String source, int volume) {
        // TODO
    }

    public String getSource() {
        // TODO: first char + last char of source + volume
        return null;
    }

    public int getVolume() {
        // TODO
        return 0;
    }

    public void setVolume(int volume) {
        // TODO: this.volume = volume * (number of digits of volume)
    }
}`,
  sampleSolution: read('q0/material_0/src/Water.java'),
  expectedOutput:
`Sample run 1 (TC 1 — getSource, source="river" volume=100):
OUTPUT:
rr100

Sample run 2 (TC 2 — setVolume, source="river" volume=10, new volume=12):
OUTPUT:
24`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'ctor', criterion: B('Both constructors set source and volume correctly.', 'Cả 2 constructor gán đúng source và volume.'), weight: 1, maxScore: 0.5 },
    { id: 'getSource', criterion: B('getSource() concatenates the first char, last char of source, then volume (no formatting).', 'getSource() nối ký tự đầu, ký tự cuối của source, rồi volume (không định dạng).'), weight: 1, maxScore: 1 },
    { id: 'getVolume_setVolume', criterion: B('getVolume() returns volume; setVolume(v) sets volume = v * (digit count of v).', 'getVolume() trả về volume; setVolume(v) gán volume = v * (số chữ số của v).'), weight: 1, maxScore: 0.5 },
  ],
};

// ── Q2: Wine + SpecWine ──
const q2PromptEn = `<p><strong>(3 marks)</strong> Write a class <strong>Wine</strong> and a class <strong>SpecWine</strong> extending from <strong>Wine</strong> (i.e. Wine is a superclass and SpecWine is a subclass) with the following information:</p>
${table([
  '-brand: String<br/>-year: int',
  '+Wine()<br/>+Wine(brand: String, year: int)<br/>+getBrand(): String<br/>+getYear(): int<br/>+setBrand(brand: String): void<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>getBrand(): String</code> — return brand.</li>
  <li><code>getYear(): int</code> — return year.</li>
  <li><code>setBrand(brand: String): void</code> — update brand.</li>
  <li><code>toString(): String</code> — return the string of format: <strong>brand, year</strong>.</li>
</ul>
${table([
  '-taste: String',
  '+SpecWine()<br/>+SpecWine(brand: String, year: int, taste: String)<br/>+getTaste(): String<br/>+toString(): String<br/>+setData(): void<br/>+getValue(): String',
])}
<p>Where:</p>
<ul>
  <li><code>toString(): String</code> — return the string of format: <strong>brand, year, taste</strong>.</li>
  <li><code>getTaste(): String</code> — return taste.</li>
  <li><code>setData(): void</code> — Converts the brand string to <strong>uppercase</strong> and then <strong>reverses</strong> its characters.</li>
  <li><code>getValue(): String</code> — Check if m &lt; n (<em>n is the number of characters of taste string, m is year</em>) then lowercase the first <strong>m</strong> characters of taste string, otherwise uppercase taste string.</li>
</ul>`;
const q2PromptVi = `<p><strong>(3 điểm)</strong> Viết lớp <strong>Wine</strong> và lớp <strong>SpecWine</strong> kế thừa từ <strong>Wine</strong> (Wine là lớp cha, SpecWine là lớp con), thông tin như sau:</p>
${table([
  '-brand: String<br/>-year: int',
  '+Wine()<br/>+Wine(brand: String, year: int)<br/>+getBrand(): String<br/>+getYear(): int<br/>+setBrand(brand: String): void<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>getBrand(): String</code> — trả về brand.</li>
  <li><code>getYear(): int</code> — trả về year.</li>
  <li><code>setBrand(brand: String): void</code> — cập nhật brand.</li>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>brand, year</strong>.</li>
</ul>
${table([
  '-taste: String',
  '+SpecWine()<br/>+SpecWine(brand: String, year: int, taste: String)<br/>+getTaste(): String<br/>+toString(): String<br/>+setData(): void<br/>+getValue(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>toString(): String</code> — trả về chuỗi định dạng: <strong>brand, year, taste</strong>.</li>
  <li><code>getTaste(): String</code> — trả về taste.</li>
  <li><code>setData(): void</code> — Chuyển brand thành <strong>chữ HOA</strong> rồi <strong>đảo ngược</strong> các ký tự.</li>
  <li><code>getValue(): String</code> — Kiểm tra nếu m &lt; n (<em>n là số ký tự của chuỗi taste, m là year</em>) thì chuyển <strong>m</strong> ký tự đầu của taste thành chữ thường, ngược lại chuyển toàn bộ taste thành chữ HOA.</li>
</ul>`;

const q2ExplainEn = `<p>Decompiling the real given <code>Main.class</code> (bytecode, not guesswork) shows exactly what each test case prints: TC1 (toString) creates a plain <code>Wine</code> AND a <code>SpecWine</code> from the same input and prints <code>wine.toString()</code> then <code>specWine.toString()</code> — two lines, in <strong>your own</strong> chosen format ("brand, year" / "brand, year, taste" per spec). TC2 (setData) does NOT call toString() at all — after calling <code>setData()</code> it prints <code>getBrand()+", "+getYear()</code> directly via a hardcoded <code>printf("%s, %d\\n", ...)</code>, so this line only ever shows 2 values even though it's called on the SpecWine object. TC3 (getValue) just prints the returned string.</p>
<p><code>setData()</code> only touches <strong>brand</strong> — e.g. brand="Red" → uppercase "RED" → reversed "DER". <code>getValue()</code>: with taste="TAnni" (n=5) and year=2 (m=2, m&lt;n) → lowercase first 2 chars → "ta"+"nni" = "tanni"; with year=6 (m=6, m&gt;=n) → uppercase whole taste → "TANNI".</p>
<p>Verified against all 4 given samples by compiling with the real given <code>Main.class</code>:</p>
<pre>brand=red year=10 taste=tanni → TC1 (toString)
OUTPUT:
red, 10
red, 10, tanni

brand=Red year=10 taste=tanni → TC2 (setData)
OUTPUT:
DER, 10

brand=red year=2 taste=TAnni → TC3 (getValue, m=2 &lt; n=5)
OUTPUT:
tanni

brand=red year=6 taste=TAnni → TC3 (getValue, m=6 &gt;= n=5)
OUTPUT:
TANNI</pre>`;
const q2ExplainVi = `<p>Decompile trực tiếp <code>Main.class</code> given thật (đọc bytecode, không suy đoán) cho thấy chính xác mỗi test case in gì: TC1 (toString) tạo 1 <code>Wine</code> thường VÀ 1 <code>SpecWine</code> từ cùng input, in <code>wine.toString()</code> rồi <code>specWine.toString()</code> — 2 dòng, theo đúng định dạng BẠN viết ("brand, year" / "brand, year, taste" theo đề). TC2 (setData) KHÔNG gọi toString() — sau khi gọi <code>setData()</code> nó in <code>getBrand()+", "+getYear()</code> trực tiếp qua <code>printf("%s, %d\\n", ...)</code> viết cứng trong harness, nên dòng này CHỈ hiện 2 giá trị dù được gọi trên object SpecWine. TC3 (getValue) chỉ in chuỗi trả về.</p>
<p><code>setData()</code> chỉ đụng vào <strong>brand</strong> — vd brand="Red" → viết hoa "RED" → đảo ngược "DER". <code>getValue()</code>: với taste="TAnni" (n=5) và year=2 (m=2, m&lt;n) → chuyển 2 ký tự đầu thành thường → "ta"+"nni" = "tanni"; với year=6 (m=6, m&gt;=n) → viết hoa toàn bộ taste → "TANNI".</p>
<p>Đã đối chiếu với cả 4 mẫu trong đề bằng cách biên dịch cùng <code>Main.class</code> given thật:</p>
<pre>brand=red year=10 taste=tanni → TC1 (toString)
OUTPUT:
red, 10
red, 10, tanni

brand=Red year=10 taste=tanni → TC2 (setData)
OUTPUT:
DER, 10

brand=red year=2 taste=TAnni → TC3 (getValue, m=2 &lt; n=5)
OUTPUT:
tanni

brand=red year=6 taste=TAnni → TC3 (getValue, m=6 &gt;= n=5)
OUTPUT:
TANNI</pre>`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `public class Wine {
    private String brand;
    private int year;
    // TODO: Wine(), Wine(brand, year), getBrand, getYear, setBrand,
    // toString() ("brand, year")
}

class SpecWine extends Wine {
    private String taste;
    // TODO: SpecWine(), SpecWine(brand, year, taste),
    // toString() ("brand, year, taste"), getTaste(),
    // setData() (brand -> uppercase then reversed),
    // getValue() (m=year, n=taste.length(); m<n -> lowercase first m chars of taste,
    //             else -> uppercase whole taste)
}`,
  sampleSolution: `${read('q1/material_1/src/Wine.java')}\n\n${read('q1/material_1/src/SpecWine.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — toString, brand=red year=10 taste=tanni):
OUTPUT:
red, 10
red, 10, tanni

Sample run 2 (TC 2 — setData, brand=Red year=10 taste=tanni):
OUTPUT:
DER, 10

Sample run 3 (TC 3 — getValue, brand=red year=2 taste=TAnni, m=2 < n=5):
OUTPUT:
tanni

Sample run 4 (TC 3 — getValue, brand=red year=6 taste=TAnni, m=6 >= n=5):
OUTPUT:
TANNI`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'ctor', criterion: B('Wine has working constructors; SpecWine correctly extends Wine and both toString() formats are right.', 'Wine có constructor hoạt động đúng; SpecWine kế thừa đúng Wine, cả 2 định dạng toString() đều đúng.'), weight: 2, maxScore: 1 },
    { id: 'setData', criterion: B('setData() uppercases brand then reverses it (does not touch year/taste).', 'setData() chuyển brand thành chữ HOA rồi đảo ngược (không đụng year/taste).'), weight: 2, maxScore: 1 },
    { id: 'getValue', criterion: B('getValue() compares year against taste.length() and lowercases/uppercases taste correctly per the m<n rule.', 'getValue() so sánh year với taste.length() và chuyển thường/hoa taste đúng theo luật m<n.'), weight: 2, maxScore: 1 },
  ],
};

// ── Q3: Wine + IWine + MyWine ──
const IWINE_SRC = `import java.util.List;

public interface IWine {
    public String f1(List<Wine> t);
    public void f2(List<Wine> t);
    public void f3(List<Wine> t);
}`;

const q3PromptEn = `<p><strong>(3 marks)</strong> Write a class <strong>Wine</strong> with the following information:</p>
${table([
  '-brand: String<br/>-year: int',
  '+Wine ()<br/>+Wine (brand: String, year: int)<br/>+getBrand(): String<br/>+getYear(): int<br/>+setBrand(brand: String): void<br/>+setYear(year: int): void',
])}
<p>Where:</p>
<ul>
  <li><code>getBrand(): String</code> — return brand.</li>
  <li><code>getYear(): int</code> — return year.</li>
  <li><code>setBrand(brand: String): void</code> — update brand.</li>
  <li><code>setYear(year: int): void</code> — update year.</li>
</ul>
<p>The interface <strong>IWine</strong> below is already compiled and given in byte code format, thus you can use it without creating IWine.java file:</p>
<pre>${IWINE_SRC}</pre>
<p>Write a class <strong>MyWine</strong>, which implements the interface <strong>IWine</strong>. The class MyWine implements methods f1, f2 and f3 in IWine as below (you can add other functions in MyWine class):</p>
<ul>
  <li><strong>f1</strong>: Find the first shortest brand string of wines where the year is not a multiple of 3. If no valid element exists, return "Not found".</li>
  <li><strong>f2</strong>: Replace all wine brands whose length is not a prime number with the string "PRE"+n (<em>n is the first digit of the year</em>). Other elements remain unchanged. (A prime number is a positive integer greater than 1 that has exactly two distinct positive divisors: 1 and itself)</li>
  <li><strong>f3</strong>: Remove all wines with brands that begin with a lowercase letter and a year is equal to the smallest of the odd years on the list. (if there is no element that satisfies the conditions then do nothing). (<em>Must ensure that the list is updated in-place and maintain its original order for the remaining elements</em>)</li>
</ul>`;
const q3PromptVi = `<p><strong>(3 điểm)</strong> Viết lớp <strong>Wine</strong> với thông tin sau:</p>
${table([
  '-brand: String<br/>-year: int',
  '+Wine ()<br/>+Wine (brand: String, year: int)<br/>+getBrand(): String<br/>+getYear(): int<br/>+setBrand(brand: String): void<br/>+setYear(year: int): void',
])}
<p>Trong đó:</p>
<ul>
  <li><code>getBrand(): String</code> — trả về brand.</li>
  <li><code>getYear(): int</code> — trả về year.</li>
  <li><code>setBrand(brand: String): void</code> — cập nhật brand.</li>
  <li><code>setYear(year: int): void</code> — cập nhật year.</li>
</ul>
<p>Interface <strong>IWine</strong> dưới đây đã được biên dịch sẵn dạng byte code, bạn dùng thẳng không cần tạo file IWine.java:</p>
<pre>${IWINE_SRC}</pre>
<p>Viết lớp <strong>MyWine</strong>, implement interface <strong>IWine</strong>. Lớp MyWine cài đặt các hàm f1, f2 và f3 trong IWine như sau (có thể thêm hàm khác trong lớp MyWine):</p>
<ul>
  <li><strong>f1</strong>: Tìm chuỗi brand ngắn nhất đầu tiên trong số các wine có year không phải bội số của 3. Nếu không có phần tử hợp lệ, trả về "Not found".</li>
  <li><strong>f2</strong>: Thay tất cả brand có độ dài KHÔNG phải số nguyên tố bằng chuỗi "PRE"+n (<em>n là chữ số đầu tiên của year</em>). Các phần tử khác giữ nguyên. (Số nguyên tố là số nguyên dương lớn hơn 1 chỉ có đúng 2 ước số dương phân biệt: 1 và chính nó)</li>
  <li><strong>f3</strong>: Xoá tất cả wine có brand bắt đầu bằng chữ thường VÀ year bằng year lẻ nhỏ nhất trong danh sách. (nếu không có phần tử nào thoả điều kiện thì không làm gì). (<em>Phải đảm bảo danh sách được cập nhật TẠI CHỖ và giữ nguyên thứ tự ban đầu của các phần tử còn lại</em>)</li>
</ul>`;

const q3ExplainEn = `<p>The harness always enters "0" for "how many elements" then loads one of 3 hardcoded lists per TC (verified by decompiling the real given <code>Main.class</code>) — you never need to type wine data by hand to test locally, only "0" then the TC number.</p>
<p><strong>f1</strong>: filter year%3!=0, keep the first element (list order) with the minimum brand length. E.g. list VNA(3) VJA(9) FR(6) PJ(17) DU(11) ITA(13) → after filtering out multiples of 3 (VNA,VJA,FR) the candidates are PJ(len2), DU(len2), ITA(len3); PJ comes first in the list among the length-2 ones, so the answer is "PJ".</p>
<p><strong>f2</strong>: "first digit of the year" means the leftmost digit of the year's decimal representation (year=12 → first digit is 1, not 2). E.g. brand="A" (year=6, len=1 is not prime) → "PRE6"; brand="3G1A" (year=12, len=4 is not prime) → "PRE1" (first digit of 12 is "1"). Brands with prime length (2, 3, 5, 7, ...) are left untouched.</p>
<p><strong>f3</strong>: compute the smallest ODD year across the whole list first, then remove every wine whose brand starts with a lowercase letter AND whose year equals that smallest odd year — other lowercase-starting brands with a different year are kept. Must mutate the given <code>List&lt;Wine&gt;</code> in place (e.g. via <code>Iterator.remove()</code>), not return a new list.</p>
<p>Verified against all 3 given samples by compiling <code>Wine.java</code> + <code>MyWine.java</code> with the real given <code>Main.class</code> and <code>IWine.class</code>:</p>
<pre>list: (VNA,3)(VJA,9)(FR,6)(PJ,17)(DU,11)(ITA,13) → TC1 (f1)
OUTPUT:
PJ

list: (A,6)(B1X,9)(C345,2)(D2Y,29)(E678,3)(1F,19)(3G1A,12)(2H,25) → TC2 (f2)
OUTPUT:
(PRE6,6) (B1X,9) (PRE2,2) (D2Y,29) (PRE3,3) (1F,19) (PRE1,12) (2H,25)

list: (A2,60)(b2,11)(C3,10)(d6,47)(E6,69)(1F,15)(3G1,18)(2H,25) → TC3 (f3, smallest odd year = 11, only "b2" qualifies)
OUTPUT:
(A2,60) (C3,10) (d6,47) (E6,69) (1F,15) (3G1,18) (2H,25)</pre>`;
const q3ExplainVi = `<p>Harness luôn nhập "0" cho "how many elements" rồi tự nạp 1 trong 3 danh sách viết sẵn theo TC (đã xác nhận bằng decompile <code>Main.class</code> given thật) — bạn không cần tự gõ dữ liệu wine để test cục bộ, chỉ cần gõ "0" rồi số TC.</p>
<p><strong>f1</strong>: lọc year%3!=0, giữ phần tử ĐẦU TIÊN (theo thứ tự danh sách) có độ dài brand nhỏ nhất. Vd danh sách VNA(3) VJA(9) FR(6) PJ(17) DU(11) ITA(13) → sau khi lọc bỏ bội số của 3 (VNA,VJA,FR), ứng viên còn lại là PJ(dài2), DU(dài2), ITA(dài3); PJ đứng trước trong nhóm dài 2, nên kết quả là "PJ".</p>
<p><strong>f2</strong>: "chữ số đầu tiên của year" nghĩa là chữ số ngoài cùng bên trái trong biểu diễn thập phân của year (year=12 → chữ số đầu là 1, không phải 2). Vd brand="A" (year=6, dài 1 không phải số nguyên tố) → "PRE6"; brand="3G1A" (year=12, dài 4 không phải số nguyên tố) → "PRE1" (chữ số đầu của 12 là "1"). Brand có độ dài là số nguyên tố (2, 3, 5, 7, ...) thì giữ nguyên.</p>
<p><strong>f3</strong>: tính year LẺ nhỏ nhất trên TOÀN danh sách trước, rồi xoá mọi wine có brand bắt đầu bằng chữ thường VÀ year bằng đúng year lẻ nhỏ nhất đó — các brand chữ thường khác nhưng year khác thì giữ nguyên. Phải sửa TẠI CHỖ trên <code>List&lt;Wine&gt;</code> được truyền vào (vd dùng <code>Iterator.remove()</code>), không trả về danh sách mới.</p>
<p>Đã đối chiếu với cả 3 mẫu trong đề bằng cách biên dịch <code>Wine.java</code> + <code>MyWine.java</code> cùng <code>Main.class</code> và <code>IWine.class</code> given thật:</p>
<pre>list: (VNA,3)(VJA,9)(FR,6)(PJ,17)(DU,11)(ITA,13) → TC1 (f1)
OUTPUT:
PJ

list: (A,6)(B1X,9)(C345,2)(D2Y,29)(E678,3)(1F,19)(3G1A,12)(2H,25) → TC2 (f2)
OUTPUT:
(PRE6,6) (B1X,9) (PRE2,2) (D2Y,29) (PRE3,3) (1F,19) (PRE1,12) (2H,25)

list: (A2,60)(b2,11)(C3,10)(d6,47)(E6,69)(1F,15)(3G1,18)(2H,25) → TC3 (f3, year lẻ nhỏ nhất = 11, chỉ "b2" thoả)
OUTPUT:
(A2,60) (C3,10) (d6,47) (E6,69) (1F,15) (3G1,18) (2H,25)</pre>`;

const q3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `${IWINE_SRC}

public class Wine {
    private String brand;
    private int year;
    // TODO: Wine(), Wine(brand, year), getBrand, getYear, setBrand, setYear
}

class MyWine implements IWine {
    // TODO f1: first shortest brand among wines with year % 3 != 0, else "Not found"
    // TODO f2: brand length not prime -> replace brand with "PRE"+(first digit of year)
    // TODO f3: remove wines with lowercase-starting brand AND year == smallest odd year in list
    //          (mutate the given list in place, keep original order of remaining elements)
}`,
  sampleSolution: `${read('q2/material_2/src/Wine.java')}\n\n${read('q2/material_2/src/MyWine.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — f1, list: (VNA,3)(VJA,9)(FR,6)(PJ,17)(DU,11)(ITA,13)):
OUTPUT:
PJ

Sample run 2 (TC 2 — f2, list: (A,6)(B1X,9)(C345,2)(D2Y,29)(E678,3)(1F,19)(3G1A,12)(2H,25)):
OUTPUT:
(PRE6,6) (B1X,9) (PRE2,2) (D2Y,29) (PRE3,3) (1F,19) (PRE1,12) (2H,25)

Sample run 3 (TC 3 — f3, list: (A2,60)(b2,11)(C3,10)(d6,47)(E6,69)(1F,15)(3G1,18)(2H,25), smallest odd year = 11):
OUTPUT:
(A2,60) (C3,10) (d6,47) (E6,69) (1F,15) (3G1,18) (2H,25)`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'wine_class', criterion: B('Wine has both constructors and correct getters/setters for brand and year.', 'Wine có đủ 2 constructor và getter/setter đúng cho brand, year.'), weight: 1, maxScore: 0.5 },
    { id: 'f1', criterion: B('f1() returns the first shortest brand among wines whose year is not a multiple of 3, or "Not found".', 'f1() trả về brand ngắn nhất đầu tiên trong các wine có year không chia hết cho 3, hoặc "Not found".'), weight: 1, maxScore: 0.75 },
    { id: 'f2', criterion: B('f2() replaces brands with non-prime length using "PRE"+(first digit of year), leaving prime-length brands untouched.', 'f2() thay brand có độ dài không phải số nguyên tố bằng "PRE"+(chữ số đầu của year), giữ nguyên brand có độ dài là số nguyên tố.'), weight: 1, maxScore: 0.75 },
    { id: 'f3', criterion: B('f3() removes only wines with a lowercase-starting brand AND year equal to the smallest odd year, mutating the list in place and preserving order.', 'f3() chỉ xoá wine có brand bắt đầu chữ thường VÀ year bằng year lẻ nhỏ nhất, sửa tại chỗ và giữ nguyên thứ tự.'), weight: 1, maxScore: 1 },
  ],
};

// ── Q4: MyString implements IString ──
const ISTRING_SRC = `public interface IString {
    public int f1(String str);
    public String f2(String str);
}`;

const q4PromptEn = `<p><strong>(2 marks)</strong> The interface <strong>IString</strong> below is already compiled and given in byte code format, thus you can use it without creating IString.java file:</p>
<pre>${ISTRING_SRC}</pre>
<p>Write a class named <strong>MyString</strong>, which implements the interface <strong>IString</strong>. The class MyString implements methods f1 and f2 in IString as below:</p>
<ul>
  <li><strong>f1</strong>: Returns the ASCII code of the lowercase letter that appears most frequently in the string str. If there are multiple such letters with the same frequency, return the ASCII code of the one that comes first alphabetically. If there are no lowercase letters, return -1.</li>
  <li><strong>f2</strong>: In the string str, replace each group of consecutive uppercase letters with their reversed order, and keep all non-uppercase characters in their original positions. The function returns the newly transformed string.</li>
</ul>`;
const q4PromptVi = `<p><strong>(2 điểm)</strong> Interface <strong>IString</strong> dưới đây đã được biên dịch sẵn dạng byte code, bạn dùng thẳng không cần tạo file IString.java:</p>
<pre>${ISTRING_SRC}</pre>
<p>Viết lớp tên <strong>MyString</strong>, implement interface <strong>IString</strong>. Lớp MyString cài đặt các hàm f1 và f2 trong IString như sau:</p>
<ul>
  <li><strong>f1</strong>: Trả về mã ASCII của chữ cái thường xuất hiện nhiều nhất trong chuỗi str. Nếu có nhiều chữ cùng tần suất cao nhất, trả về mã ASCII của chữ đứng trước theo thứ tự bảng chữ cái. Nếu không có chữ thường nào, trả về -1.</li>
  <li><strong>f2</strong>: Trong chuỗi str, thay mỗi nhóm chữ HOA liên tiếp bằng thứ tự đảo ngược của chính nhóm đó, giữ nguyên vị trí các ký tự không phải chữ HOA. Hàm trả về chuỗi mới đã biến đổi.</li>
</ul>`;

const q4ExplainEn = `<p><strong>f1</strong> only counts lowercase letters — uppercase, digits, punctuation are ignored entirely (they don't count as candidates and don't break tie-breaking). Ties are broken alphabetically (not by first occurrence in the string): "AaBbCcDd123!" has a,b,c,d each appearing once → tie → alphabetically first is 'a' → ASCII 97.</p>
<p><strong>f2</strong> groups CONSECUTIVE uppercase letters only — each maximal run gets reversed independently, non-uppercase characters (lowercase, digits, symbols) keep their original position and are not touched or counted as group boundaries. "abcABC@DEgh" → group "ABC" reversed → "CBA"; group "DE" reversed → "ED"; result "abc"+"CBA"+"@"+"ED"+"gh" = "abcCBA@EDgh".</p>
<p>Verified against both given samples by compiling <code>MyString.java</code> with the real given <code>Main.class</code>:</p>
<pre>f1("AaBbCcDd123!") → 97   ('a','b','c','d' tie at count 1, 'a' is alphabetically first)
f2("abcABC@DEgh") → "abcCBA@EDgh"   ("ABC"→"CBA", "DE"→"ED", everything else untouched)</pre>`;
const q4ExplainVi = `<p><strong>f1</strong> CHỈ đếm chữ thường — chữ HOA, số, ký hiệu bị bỏ qua hoàn toàn (không tính là ứng viên và không ảnh hưởng việc phá hoà). Hoà thì so theo thứ tự bảng chữ cái (không phải theo thứ tự xuất hiện trong chuỗi): "AaBbCcDd123!" có a,b,c,d mỗi chữ xuất hiện 1 lần → hoà → chữ đứng trước theo alphabet là 'a' → ASCII 97.</p>
<p><strong>f2</strong> chỉ gom nhóm chữ HOA LIÊN TIẾP — mỗi nhóm tối đa được đảo ngược độc lập, ký tự không phải chữ HOA (chữ thường, số, ký hiệu) giữ nguyên vị trí, không bị đụng vào và không tính là ranh giới nhóm. "abcABC@DEgh" → nhóm "ABC" đảo thành "CBA"; nhóm "DE" đảo thành "ED"; kết quả "abc"+"CBA"+"@"+"ED"+"gh" = "abcCBA@EDgh".</p>
<p>Đã đối chiếu với cả 2 mẫu trong đề bằng cách biên dịch <code>MyString.java</code> cùng <code>Main.class</code> given thật:</p>
<pre>f1("AaBbCcDd123!") → 97   ('a','b','c','d' hoà ở tần suất 1, 'a' đứng trước theo alphabet)
f2("abcABC@DEgh") → "abcCBA@EDgh"   ("ABC"→"CBA", "DE"→"ED", còn lại giữ nguyên)</pre>`;

const q4 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `${ISTRING_SRC}

public class MyString implements IString {
    // TODO f1: ASCII code of the most frequent lowercase letter (tie -> alphabetically first; none -> -1)
    // TODO f2: reverse each maximal run of consecutive uppercase letters, keep other chars in place
}`,
  sampleSolution: read('q3/material_3/src/MyString.java'),
  expectedOutput:
`Sample run 1 (TC 1 — f1, input: "AaBbCcDd123!"):
OUTPUT:
97

Sample run 2 (TC 2 — f2, input: "abcABC@DEgh"):
OUTPUT:
abcCBA@EDgh`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'f1', criterion: B('f1() finds the most frequent lowercase letter, breaking ties alphabetically, returning -1 when there are none.', 'f1() tìm chữ thường xuất hiện nhiều nhất, phá hoà theo alphabet, trả về -1 khi không có chữ thường nào.'), weight: 1, maxScore: 1 },
    { id: 'f2', criterion: B('f2() reverses each maximal run of consecutive uppercase letters and leaves every other character in its original position.', 'f2() đảo ngược từng nhóm chữ HOA liên tiếp và giữ nguyên vị trí mọi ký tự khác.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE6-SU25-B1-P5',
      title: B('PRO192 — Practical Exam Đề 6 (SU25, Block 1, Paper 5)', 'PRO192 — Đề thi thực hành số 6 (SU25, Block 1, Paper 5)'),
      description: B(
        'Real PRO192 PE paper (4 questions, 10 marks) — OOP class design (encapsulation, inheritance, toString formatting), and two interface implementations over List<T> and String. Solutions written & verified by compiling against the real given Main.class harness.',
        'Đề PE PRO192 thật (4 câu, 10 điểm) — thiết kế lớp OOP (đóng gói, kế thừa, định dạng toString), và 2 interface cài đặt trên List<T> và String. Lời giải đã viết và kiểm bằng cách biên dịch cùng harness Main.class given thật.',
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
  `// AUTO-GENERATED by scripts/build-pro192-pe6.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
