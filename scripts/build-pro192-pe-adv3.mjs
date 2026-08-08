/**
 * build-pro192-pe-adv3.mjs — sinh content/exams/PRO192-PE-ADV3.mjs.
 *
 * KHÁC các đề PE khác trong repo: đây KHÔNG phải đề thi thật được chép lại.
 * Đây là đề LUYỆN TẬP NÂNG CAO do chính chúng ta soạn (source: 'SAMPLE'),
 * chủ đề Generics + bounded type parameter (`T extends Identifiable`) +
 * generic repository/container — phần mà 11 đề PE thật gần như không chạm tới
 * nhưng LAB211 (kỳ 3) dùng dày đặc (List<T>, Map<String,T> trong entity/bo/
 * controller), và LAB211 lại hiếm khi dạy sinh viên TỰ VIẾT lớp generic.
 *
 * Vì không có "ground truth" từ đề gốc, cách kiểm ở đây khắt khe hơn: TOÀN BỘ
 * expectedOutput bên dưới là stdout THẬT, chụp lại từ việc biên dịch
 * (javac --release 8) rồi chạy `java Main` với đúng stdin ghi trong nhãn mỗi
 * sample run — không có dòng nào được suy luận bằng cách đọc code.
 *
 * Ba cái bẫy Java đã được kiểm bằng cách CHẠY THẬT (không phải lý luận suông):
 *   1. `Repository<T>` không có bound → javac báo "cannot find symbol: getId()"
 *      (bound tồn tại chính là để dùng được getId() trên T).
 *   2. `Repository` viết theo kiểu Object + ép kiểu → biên dịch OK nhưng chạy
 *      với Main.class given thật thì ném
 *      `NoSuchMethodError: 'boolean Repository.add(Identifiable)'`
 *      (xoá kiểu: T bị xoá thành Identifiable, không phải Object).
 *   3. `getAll()` trả thẳng `items` (không copy phòng thủ) → TC3 của Q2 in
 *      `repo.size() = 1` thay vì `= 3`. Harness được thiết kế để lộ đúng lỗi này.
 *   4. `Collections.sort(items)` trong Q4 → javac báo "no suitable method found"
 *      vì T không phải Comparable ⇒ bắt buộc truyền Comparator<T>.
 *
 * Given materials: đóng gói từ scaffold NetBeans sạch, mỗi câu 1 project
 * Q1..Q4, chỉ chứa .class đã biên dịch (Main.class + Identifiable.class +
 * Book/EBook.class tuỳ câu), TUYỆT ĐỐI không có file .java lời giải.
 * Đã upload R2 và kiểm GET 200 + `unzip -t` sạch.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE-ADV3.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE-ADV3.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE-ADV3-Given.zip';

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

const IDENTIFIABLE_SRC = `public interface Identifiable {
    public String getId();
}`;

// ── instructions ──────────────────────────────────────────────────────────
const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> — adapted from the real PE papers.</p>
   <p><strong>Please read first:</strong> this is <strong>self-authored supplementary practice material</strong>, not an official FPTU exam paper. It was written to go deeper into OOP than the standard PE papers do, so that you arrive at <strong>LAB211</strong> already able to write your own generic classes. Treat it exactly like the real thing while you practise: 120 minutes, no AI help, no copy-paste.</p>
   <ol>
     <li>Software required: NetBeans 13 or later, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. You are ONLY allowed to use your own study materials (sample code, program examples) stored on your own computer.</li>
     <li>Create a folder to save the given projects (e.g. PRO_given), download the given materials into it. Open NetBeans, open the given Qx project, then complete it according to the exam requirements. Do NOT delete or edit given files, or create a java file with the same name as a given file.</li>
     <li>Before submission: run "Clean and Build Project" (Shift+F11); for each question create two sub-folders <strong>run</strong> and <strong>src</strong>, copy the built <code>Qx.jar</code> into <strong>run</strong> and the entire project source into <strong>src</strong>.</li>
     <li>Do NOT use accented Vietnamese in code comments. Do NOT change the names of the folders/files specified in the exam. All .java source files use the NetBeans default package.</li>
   </ol>
   <p>This exam room cannot run NetBeans/JDK in the browser, so you type each class directly into the code box and it is graded by AI against the rubric — but the "given materials" download above is a REAL NetBeans project set (with the compiled <code>Main.class</code> harness and the compiled <code>Identifiable</code>/<code>Book</code>/<code>EBook</code> classes) so you can build &amp; run it for real on your own machine and cross-check your output against every sample shown below.</p>
   <p><strong>Every sample output in this paper is captured real stdout</strong> — each reference class was compiled with <code>javac --release 8</code> and run against the very <code>Main.class</code> shipped in the download.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> — phỏng theo các đề PE thật.</p>
   <p><strong>Đọc trước:</strong> đây là <strong>tài liệu luyện tập bổ trợ do chúng tôi tự soạn</strong>, KHÔNG phải đề thi chính thức của FPTU. Đề được viết để đào sâu OOP hơn các đề PE chuẩn, giúp bạn bước vào <strong>LAB211</strong> với khả năng TỰ VIẾT lớp generic. Khi luyện, hãy coi nó y như đề thật: 120 phút, không nhờ AI, không copy-paste.</p>
   <ol>
     <li>Yêu cầu phần mềm: NetBeans 13 trở lên, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Bạn CHỈ được dùng tài liệu học tập (mã mẫu, ví dụ chương trình) lưu trên máy của mình.</li>
     <li>Tạo một thư mục chứa các project given (vd PRO_given), tải given materials vào đó. Mở NetBeans, mở project Qx tương ứng, hoàn thành theo yêu cầu đề bài. KHÔNG xoá/sửa file given, KHÔNG tạo file java trùng tên với file given.</li>
     <li>Trước khi nộp: chạy "Clean and Build Project" (Shift+F11); với mỗi câu tạo 2 thư mục con <strong>run</strong> và <strong>src</strong>, chép file <code>Qx.jar</code> đã build vào <strong>run</strong>, chép toàn bộ mã nguồn project vào <strong>src</strong>.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment code. KHÔNG đổi tên thư mục/file đã quy định. Mọi file nguồn .java dùng package mặc định của NetBeans.</li>
   </ol>
   <p>Phòng thi web không chạy được NetBeans/JDK trên trình duyệt, nên bạn gõ thẳng từng class vào ô mã và được AI chấm theo tiêu chí — nhưng file "given materials" ở trên là bộ project NetBeans THẬT (kèm harness <code>Main.class</code> đã biên dịch và các lớp <code>Identifiable</code>/<code>Book</code>/<code>EBook</code> đã biên dịch) để bạn build &amp; chạy thật trên máy mình và tự đối chiếu với mọi mẫu bên dưới.</p>
   <p><strong>Mọi output mẫu trong đề này là stdout THẬT đã chụp lại</strong> — mỗi lớp tham chiếu đều được biên dịch bằng <code>javac --release 8</code> rồi chạy với đúng <code>Main.class</code> có trong file tải về.</p>`,
);

// ══════════════════════════════════════════════════════════════════════════
// Q1 — Identifiable + Book + EBook (2 marks)
// ══════════════════════════════════════════════════════════════════════════
const q1PromptEn = `<p><strong>(2 marks)</strong> Do not pay attention to the real-world meaning of the objects and values below.</p>
<p>The interface <strong>Identifiable</strong> is already compiled and given in byte-code format, so you can use it without creating <code>Identifiable.java</code>:</p>
<pre>${IDENTIFIABLE_SRC.replace(/</g, '&lt;')}</pre>
<p>Write a class <strong>Book</strong> (default package) that <strong>implements Identifiable</strong>:</p>
${table([
  '-id: String<br/>-title: String<br/>-author: String<br/>-price: double',
  '+Book(id: String, title: String, author: String, price: double)<br/>+getId(): String<br/>+getTitle(): String<br/>+getAuthor(): String<br/>+getPrice(): double<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>Book(...)</code> — constructor, sets all four fields.</li>
  <li><code>getId(): String</code> — return id. This is the method required by the <code>Identifiable</code> contract; every later question relies on it.</li>
  <li><code>getTitle()</code>, <code>getAuthor()</code>, <code>getPrice()</code> — plain getters.</li>
  <li><code>toString(): String</code> — return <strong>id,title,author,price</strong> where price has exactly two decimal places. <strong>Note</strong>: do NOT put spaces around the commas.</li>
</ul>
<p>Write a class <strong>EBook</strong> that <strong>extends Book</strong>:</p>
${table([
  '-sizeMb: double',
  '+EBook(id: String, title: String, author: String, price: double, sizeMb: double)<br/>+getSizeMb(): double<br/>+toString(): String',
])}
<p>Where:</p>
<ul>
  <li><code>EBook(...)</code> — constructor; it must pass id/title/author/price up to the <code>Book</code> constructor (do not re-declare those fields in EBook).</li>
  <li><code>getSizeMb(): double</code> — return sizeMb.</li>
  <li><code>toString(): String</code> — the Book format, then a comma, then sizeMb with <strong>one</strong> decimal place followed by <code>MB</code>. Example: <code>B001-E,Java Basics,Alan Nguyen,100.00,12.5MB</code>. You must reuse the parent's <code>toString()</code> (<code>super.toString()</code>) instead of re-writing the four Book fields by hand.</li>
</ul>
<p><em>Do not format the result any further.</em></p>`;

const q1PromptVi = `<p><strong>(2 điểm)</strong> Bỏ qua ý nghĩa thực tế của đối tượng và giá trị bên dưới.</p>
<p>Interface <strong>Identifiable</strong> đã được biên dịch sẵn dạng byte code, bạn dùng thẳng không cần tạo <code>Identifiable.java</code>:</p>
<pre>${IDENTIFIABLE_SRC.replace(/</g, '&lt;')}</pre>
<p>Viết lớp <strong>Book</strong> (package mặc định) <strong>implements Identifiable</strong>:</p>
${table([
  '-id: String<br/>-title: String<br/>-author: String<br/>-price: double',
  '+Book(id: String, title: String, author: String, price: double)<br/>+getId(): String<br/>+getTitle(): String<br/>+getAuthor(): String<br/>+getPrice(): double<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Book(...)</code> — constructor, gán cả 4 field.</li>
  <li><code>getId(): String</code> — trả về id. Đây là hàm mà hợp đồng <code>Identifiable</code> bắt buộc; mọi câu sau đều dựa vào nó.</li>
  <li><code>getTitle()</code>, <code>getAuthor()</code>, <code>getPrice()</code> — getter thường.</li>
  <li><code>toString(): String</code> — trả về <strong>id,title,author,price</strong>, price đúng 2 chữ số thập phân. <strong>Lưu ý</strong>: KHÔNG có khoảng trắng quanh dấu phẩy.</li>
</ul>
<p>Viết lớp <strong>EBook</strong> <strong>kế thừa Book</strong>:</p>
${table([
  '-sizeMb: double',
  '+EBook(id: String, title: String, author: String, price: double, sizeMb: double)<br/>+getSizeMb(): double<br/>+toString(): String',
])}
<p>Trong đó:</p>
<ul>
  <li><code>EBook(...)</code> — constructor; phải truyền id/title/author/price lên constructor của <code>Book</code> (KHÔNG khai báo lại 4 field đó trong EBook).</li>
  <li><code>getSizeMb(): double</code> — trả về sizeMb.</li>
  <li><code>toString(): String</code> — định dạng của Book, rồi dấu phẩy, rồi sizeMb với <strong>1</strong> chữ số thập phân kèm <code>MB</code>. Ví dụ: <code>B001-E,Java Basics,Alan Nguyen,100.00,12.5MB</code>. Bắt buộc dùng lại <code>toString()</code> của lớp cha (<code>super.toString()</code>) thay vì viết tay lại 4 field của Book.</li>
</ul>
<p><em>Không định dạng thêm gì khác.</em></p>`;

const q1Solution = `public class Book implements Identifiable {

    private String id;
    private String title;
    private String author;
    private double price;

    public Book(String id, String title, String author, double price) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.price = price;
    }

    @Override
    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public double getPrice() {
        return price;
    }

    @Override
    public String toString() {
        return id + "," + title + "," + author + "," + String.format("%.2f", price);
    }
}

class EBook extends Book {

    private double sizeMb;

    public EBook(String id, String title, String author, double price, double sizeMb) {
        super(id, title, author, price);
        this.sizeMb = sizeMb;
    }

    public double getSizeMb() {
        return sizeMb;
    }

    @Override
    public String toString() {
        return super.toString() + "," + String.format("%.1f", sizeMb) + "MB";
    }
}`;

const q1ExplainEn = `<p><strong>Why this question exists.</strong> Everything else in this paper is generic code bounded by <code>T extends Identifiable</code>. A bound is only useful if some real class actually satisfies it — <code>Book</code> is that class. Implementing an interface is a <em>promise</em>: "whatever else I am, you may call <code>getId()</code> on me". Later, the compiler will use exactly that promise to let generic code call <code>getId()</code> on a value whose concrete type it does not know.</p>
<p><strong>Inheritance + polymorphic toString().</strong> <code>EBook</code> declares only <code>sizeMb</code>; id/title/author/price stay private inside <code>Book</code> and are initialised through <code>super(...)</code>. Because <code>EBook.toString()</code> starts with <code>super.toString()</code>, changing the Book format later fixes both classes at once. TC 3 stores the EBook in a variable declared as <code>Book</code> and still prints the EBook format — that is dynamic dispatch: the method chosen depends on the object's real class, not on the reference type. In Q3 you will see the same effect inside a <code>List&lt;Book&gt;</code> that happens to hold EBooks.</p>
<p><strong>The formatting trap.</strong> <code>String.format("%.2f", price)</code> uses the JVM's default locale. On a machine whose locale uses a decimal comma you would get <code>100,00</code> instead of <code>100.00</code> and every sample below would mismatch. If your output looks like that, use <code>String.format(java.util.Locale.US, "%.2f", price)</code>. All samples below were captured on a US-locale JVM.</p>
<p>Captured by compiling <code>Book.java</code> + <code>EBook.java</code> against the given <code>Main.class</code> and running it for real (input: id=<code>B001</code>, title=<code>Java Basics</code>, author=<code>Alan Nguyen</code>, price=<code>100</code>, sizeMb=<code>12.5</code>; the harness builds the EBook with id + "-E"):</p>
<pre>TC 1 (getId() through an Identifiable reference)
OUTPUT:
B001
B001-E

TC 2 (Book.toString())
OUTPUT:
B001,Java Basics,Alan Nguyen,100.00

TC 3 (EBook.toString() through a Book reference)
OUTPUT:
B001-E,Java Basics,Alan Nguyen,100.00,12.5MB
Alan Nguyen</pre>
<p>The last line of TC 3 is <code>getAuthor()</code> called on the <code>Book</code>-typed reference: the getter is inherited, not overridden, so it returns the value that <code>super(...)</code> stored.</p>`;

const q1ExplainVi = `<p><strong>Vì sao có câu này.</strong> Mọi câu còn lại của đề đều là code generic bị giới hạn bởi <code>T extends Identifiable</code>. Một bound chỉ có ích khi có lớp thật sự thoả mãn nó — <code>Book</code> chính là lớp đó. Implement một interface là một <em>lời hứa</em>: "dù tôi là gì đi nữa, bạn vẫn gọi được <code>getId()</code> trên tôi". Về sau, trình biên dịch dùng đúng lời hứa ấy để cho phép code generic gọi <code>getId()</code> trên một giá trị mà nó không biết kiểu cụ thể.</p>
<p><strong>Kế thừa + toString() đa hình.</strong> <code>EBook</code> chỉ khai báo <code>sizeMb</code>; id/title/author/price vẫn private trong <code>Book</code> và được khởi tạo qua <code>super(...)</code>. Vì <code>EBook.toString()</code> bắt đầu bằng <code>super.toString()</code>, sau này đổi định dạng của Book là sửa được cả hai lớp cùng lúc. TC 3 gán EBook vào biến khai báo kiểu <code>Book</code> mà vẫn in ra định dạng EBook — đó là dynamic dispatch: hàm được chọn theo lớp THẬT của đối tượng, không theo kiểu của biến. Ở Q3 bạn sẽ thấy đúng hiệu ứng này bên trong một <code>List&lt;Book&gt;</code> có chứa EBook.</p>
<p><strong>Bẫy định dạng.</strong> <code>String.format("%.2f", price)</code> dùng locale mặc định của JVM. Trên máy có locale dùng dấu phẩy thập phân, bạn sẽ nhận <code>100,00</code> thay vì <code>100.00</code> và mọi mẫu bên dưới đều lệch. Nếu output của bạn như vậy, hãy dùng <code>String.format(java.util.Locale.US, "%.2f", price)</code>. Mọi mẫu dưới đây chụp trên JVM locale US.</p>
<p>Chụp lại bằng cách biên dịch <code>Book.java</code> + <code>EBook.java</code> cùng <code>Main.class</code> given rồi chạy thật (input: id=<code>B001</code>, title=<code>Java Basics</code>, author=<code>Alan Nguyen</code>, price=<code>100</code>, sizeMb=<code>12.5</code>; harness tự tạo EBook với id + "-E"):</p>
<pre>TC 1 (getId() qua tham chiếu Identifiable)
OUTPUT:
B001
B001-E

TC 2 (Book.toString())
OUTPUT:
B001,Java Basics,Alan Nguyen,100.00

TC 3 (EBook.toString() qua tham chiếu kiểu Book)
OUTPUT:
B001-E,Java Basics,Alan Nguyen,100.00,12.5MB
Alan Nguyen</pre>
<p>Dòng cuối của TC 3 là <code>getAuthor()</code> gọi trên tham chiếu kiểu <code>Book</code>: getter được kế thừa chứ không override, nên trả về đúng giá trị mà <code>super(...)</code> đã lưu.</p>`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `// Identifiable is GIVEN (already compiled) — do not create Identifiable.java
// public interface Identifiable { public String getId(); }

public class Book implements Identifiable {
    private String id;
    private String title;
    private String author;
    private double price;

    // TODO: constructor(id, title, author, price)

    // TODO: getId() — required by Identifiable

    // TODO: getTitle(), getAuthor(), getPrice()

    // TODO: toString() -> "id,title,author,price" (price with 2 decimals, no spaces)
}

class EBook extends Book {
    private double sizeMb;

    // TODO: constructor(id, title, author, price, sizeMb) -> call super(...)

    // TODO: getSizeMb()

    // TODO: toString() -> super.toString() + "," + sizeMb (1 decimal) + "MB"
}`,
  sampleSolution: q1Solution,
  expectedOutput:
`Sample run 1 (TC 1 — getId() via Identifiable; id=B001, title=Java Basics, author=Alan Nguyen, price=100, sizeMb=12.5):
OUTPUT:
B001
B001-E

Sample run 2 (TC 2 — Book.toString(); same input):
OUTPUT:
B001,Java Basics,Alan Nguyen,100.00

Sample run 3 (TC 3 — EBook.toString() through a Book reference; same input):
OUTPUT:
B001-E,Java Basics,Alan Nguyen,100.00,12.5MB
Alan Nguyen`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'book', criterion: B('Book declares "implements Identifiable", has the 4 private fields, the 4-arg constructor and working getters, and getId() returns id.', 'Book khai báo "implements Identifiable", có đủ 4 field private, constructor 4 tham số, các getter chạy đúng, và getId() trả về id.'), weight: 2, maxScore: 0.75 },
    { id: 'toString', criterion: B('Book.toString() returns "id,title,author,price" with price at exactly 2 decimal places and no spaces around the commas.', 'Book.toString() trả về "id,title,author,price" với price đúng 2 chữ số thập phân và không có khoảng trắng quanh dấu phẩy.'), weight: 2, maxScore: 0.5 },
    { id: 'ebook', criterion: B('EBook extends Book, declares ONLY sizeMb, chains to super(...) in its constructor (does not re-declare the parent fields).', 'EBook kế thừa Book, CHỈ khai báo sizeMb, gọi super(...) trong constructor (không khai báo lại field của lớp cha).'), weight: 2, maxScore: 0.5 },
    { id: 'ebook_tostring', criterion: B('EBook.toString() reuses super.toString() and appends "," + sizeMb (1 decimal) + "MB".', 'EBook.toString() dùng lại super.toString() rồi nối "," + sizeMb (1 chữ số thập phân) + "MB".'), weight: 2, maxScore: 0.25 },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// Q2 — Repository<T extends Identifiable> (3 marks)
// ══════════════════════════════════════════════════════════════════════════
const q2PromptEn = `<p><strong>(3 marks)</strong> <code>Identifiable</code> and <code>Book</code> are already compiled and given in byte-code format — do not create them again.</p>
<p>Write a <strong>generic</strong> class <strong>Repository</strong> whose type parameter is <strong>bounded</strong> by <code>Identifiable</code>:</p>
<pre>public class Repository&lt;T extends Identifiable&gt; {
    //.....
}</pre>
${table([
  '-items: List&lt;T&gt;',
  '+Repository()<br/>+add(item: T): boolean<br/>+findById(id: String): T<br/>+getAll(): List&lt;T&gt;<br/>+size(): int',
])}
<p>Where:</p>
<ul>
  <li><code>Repository()</code> — default constructor; creates the empty internal list.</li>
  <li><code>add(item: T): boolean</code> — return <strong>false</strong> and add nothing when <code>item</code> is <code>null</code>, or when the repository <strong>already contains an item with the same id</strong> (compare ids with <code>equals</code>, case-sensitive). Otherwise append the item and return <strong>true</strong>.</li>
  <li><code>findById(id: String): T</code> — return the item whose <code>getId()</code> equals <code>id</code>, or <strong>null</strong> if there is none (also null when <code>id</code> is null). The return type must be <strong>T</strong> — the caller must not need a cast.</li>
  <li><code>getAll(): List&lt;T&gt;</code> — return a <strong>new</strong> List containing the same items in the same order (a <em>defensive copy</em>). Changing the returned list must NOT change the repository.</li>
  <li><code>size(): int</code> — the number of items currently stored.</li>
</ul>
<p><strong>Important</strong>: the type parameter must be declared exactly as <code>&lt;T extends Identifiable&gt;</code>. The given <code>Main.class</code> was compiled against that signature; a raw or unbounded version will fail at run time with <code>NoSuchMethodError</code>.</p>`;

const q2PromptVi = `<p><strong>(3 điểm)</strong> <code>Identifiable</code> và <code>Book</code> đã được biên dịch sẵn dạng byte code — không tạo lại.</p>
<p>Viết lớp <strong>generic</strong> tên <strong>Repository</strong> có tham số kiểu bị <strong>giới hạn</strong> bởi <code>Identifiable</code>:</p>
<pre>public class Repository&lt;T extends Identifiable&gt; {
    //.....
}</pre>
${table([
  '-items: List&lt;T&gt;',
  '+Repository()<br/>+add(item: T): boolean<br/>+findById(id: String): T<br/>+getAll(): List&lt;T&gt;<br/>+size(): int',
])}
<p>Trong đó:</p>
<ul>
  <li><code>Repository()</code> — constructor mặc định; tạo danh sách nội bộ rỗng.</li>
  <li><code>add(item: T): boolean</code> — trả về <strong>false</strong> và KHÔNG thêm gì khi <code>item</code> là <code>null</code>, hoặc khi repository <strong>đã có phần tử trùng id</strong> (so sánh id bằng <code>equals</code>, phân biệt hoa/thường). Ngược lại thêm phần tử vào cuối và trả về <strong>true</strong>.</li>
  <li><code>findById(id: String): T</code> — trả về phần tử có <code>getId()</code> bằng <code>id</code>, hoặc <strong>null</strong> nếu không có (null luôn khi <code>id</code> null). Kiểu trả về phải là <strong>T</strong> — nơi gọi không được phải ép kiểu.</li>
  <li><code>getAll(): List&lt;T&gt;</code> — trả về một List <strong>MỚI</strong> chứa cùng các phần tử theo đúng thứ tự (<em>bản sao phòng thủ</em>). Sửa danh sách trả về KHÔNG được làm thay đổi repository.</li>
  <li><code>size(): int</code> — số phần tử đang lưu.</li>
</ul>
<p><strong>Quan trọng</strong>: tham số kiểu phải khai báo đúng <code>&lt;T extends Identifiable&gt;</code>. <code>Main.class</code> given được biên dịch theo chữ ký đó; bản raw hoặc không có bound sẽ chết lúc chạy với <code>NoSuchMethodError</code>.</p>`;

const q2Solution = `import java.util.ArrayList;
import java.util.List;

public class Repository<T extends Identifiable> {

    private List<T> items;

    public Repository() {
        this.items = new ArrayList<T>();
    }

    public boolean add(T item) {
        if (item == null || item.getId() == null) {
            return false;
        }
        if (findById(item.getId()) != null) {
            return false;
        }
        items.add(item);
        return true;
    }

    public T findById(String id) {
        if (id == null) {
            return null;
        }
        for (T item : items) {
            if (id.equals(item.getId())) {
                return item;
            }
        }
        return null;
    }

    public List<T> getAll() {
        return new ArrayList<T>(items);
    }

    public int size() {
        return items.size();
    }
}`;

const q2ExplainEn = `<p><strong>What the bound actually buys you.</strong> Inside <code>add()</code> you write <code>item.getId()</code>. <code>T</code> is not a class — at compile time the compiler knows nothing about it <em>except</em> what the bound says. Delete the bound and the same line stops compiling. Verified for real:</p>
<pre>public class Repository&lt;T&gt; { ... if (findById(item.getId()) != null) ... }

Repository.java:7: error: cannot find symbol
        if (findById(item.getId()) != null) return false;
                         ^
  symbol:   method getId()
  location: variable item of type T</pre>
<p>So <code>T extends Identifiable</code> is not decoration. It is the only reason generic code may call a domain method on a type it does not know.</p>
<p><strong>Type erasure, concretely.</strong> After compilation the type parameter is gone: every <code>T</code> is replaced by its bound. <code>add(T)</code> becomes <code>add(Identifiable)</code> in byte code — <em>not</em> <code>add(Object)</code>. That is why a "clever" version written with <code>Object</code> plus casts compiles fine on its own yet dies against the given harness:</p>
<pre>Exception in thread "main" java.lang.NoSuchMethodError: 'boolean Repository.add(Identifiable)'
	at Main.createRepository(Main.java:8)</pre>
<p>Erasure also explains the rules students trip over: you cannot write <code>new T()</code>, <code>new T[10]</code>, or <code>x instanceof T</code>, because at run time there is no <code>T</code> left to ask about. Note the practical consequence for <code>getAll()</code>: <code>new ArrayList&lt;T&gt;(items)</code> is legal (the <code>&lt;T&gt;</code> is erased, the constructor just copies), while <code>new T[items.size()]</code> is not.</p>
<p><strong>Why the defensive copy matters.</strong> <code>getAll()</code> returning <code>items</code> directly hands the caller a live handle on your private field — encapsulation gone, and any caller can silently corrupt the repository. TC 3 is built to expose exactly that: it takes the list, clears it, adds one element, then asks the repository how big it is. Both versions were actually run:</p>
<pre>correct — return new ArrayList&lt;T&gt;(items):     repo.size() = 3
leaky   — return items:                       repo.size() = 1</pre>
<p>In LAB211 your BO/DAO classes will return lists from private storage constantly; this is the habit to build now.</p>
<p><strong>Duplicate policy.</strong> This spec chose "return false, add nothing" — not throwing, not silently appending. Notice <code>add()</code> reuses <code>findById()</code> instead of re-writing the loop; one definition of "same id" for the whole class.</p>
<p>All samples captured by compiling <code>Repository.java</code> against the given <code>Main.class</code> and running it. The harness pre-loads three books: <code>B001,Java Basics,Alan,100.00</code> / <code>B002,OOP Design,Bella,150.50</code> / <code>B003,Data Structures,Chris,90.00</code>.</p>`;

const q2ExplainVi = `<p><strong>Bound thực sự mua cho bạn cái gì.</strong> Trong <code>add()</code> bạn viết <code>item.getId()</code>. <code>T</code> không phải một lớp — lúc biên dịch, compiler không biết gì về nó <em>ngoài</em> điều bound nói. Bỏ bound đi là dòng đó hết biên dịch được. Đã kiểm thật:</p>
<pre>public class Repository&lt;T&gt; { ... if (findById(item.getId()) != null) ... }

Repository.java:7: error: cannot find symbol
        if (findById(item.getId()) != null) return false;
                         ^
  symbol:   method getId()
  location: variable item of type T</pre>
<p>Vậy <code>T extends Identifiable</code> không phải trang trí. Nó là lý do DUY NHẤT để code generic gọi được hàm nghiệp vụ trên một kiểu mà nó không biết.</p>
<p><strong>Xoá kiểu (type erasure), cụ thể.</strong> Sau khi biên dịch, tham số kiểu biến mất: mọi <code>T</code> bị thay bằng bound của nó. <code>add(T)</code> trở thành <code>add(Identifiable)</code> trong byte code — <em>không phải</em> <code>add(Object)</code>. Đó là lý do bản viết "khôn lỏi" bằng <code>Object</code> + ép kiểu vẫn biên dịch được một mình nhưng chết khi chạy với harness given:</p>
<pre>Exception in thread "main" java.lang.NoSuchMethodError: 'boolean Repository.add(Identifiable)'
	at Main.createRepository(Main.java:8)</pre>
<p>Xoá kiểu cũng giải thích các luật hay làm sinh viên vấp: không viết được <code>new T()</code>, <code>new T[10]</code>, hay <code>x instanceof T</code>, vì lúc chạy chẳng còn <code>T</code> nào để hỏi. Hệ quả thực tế cho <code>getAll()</code>: <code>new ArrayList&lt;T&gt;(items)</code> hợp lệ (phần <code>&lt;T&gt;</code> bị xoá, constructor chỉ việc chép), còn <code>new T[items.size()]</code> thì không.</p>
<p><strong>Vì sao phải sao chép phòng thủ.</strong> <code>getAll()</code> trả thẳng <code>items</code> là đưa cho người gọi một tay cầm sống vào field private của bạn — mất đóng gói, và bất kỳ ai cũng có thể âm thầm phá hỏng repository. TC 3 sinh ra để lộ đúng chuyện đó: lấy danh sách, xoá sạch, thêm 1 phần tử, rồi hỏi repository còn bao nhiêu. Cả hai bản đều đã được chạy thật:</p>
<pre>đúng — return new ArrayList&lt;T&gt;(items):      repo.size() = 3
rò rỉ — return items:                        repo.size() = 1</pre>
<p>Ở LAB211, các lớp BO/DAO của bạn sẽ liên tục trả list lấy từ vùng lưu private; thói quen này phải rèn từ bây giờ.</p>
<p><strong>Chính sách trùng id.</strong> Đề chọn "trả false, không thêm" — không ném ngoại lệ, không lặng lẽ thêm vào. Để ý <code>add()</code> dùng lại <code>findById()</code> thay vì viết lại vòng lặp; cả lớp chỉ có MỘT định nghĩa "trùng id".</p>
<p>Mọi mẫu được chụp bằng cách biên dịch <code>Repository.java</code> cùng <code>Main.class</code> given rồi chạy thật. Harness nạp sẵn 3 quyển: <code>B001,Java Basics,Alan,100.00</code> / <code>B002,OOP Design,Bella,150.50</code> / <code>B003,Data Structures,Chris,90.00</code>.</p>`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `import java.util.ArrayList;
import java.util.List;

// Identifiable and Book are GIVEN (already compiled) — do not create them.

public class Repository<T extends Identifiable> {

    private List<T> items;

    public Repository() {
        // TODO: create the empty internal list
    }

    public boolean add(T item) {
        // TODO: false if item == null or an item with the same id already exists
        return false;
    }

    public T findById(String id) {
        // TODO: return the matching item, or null
        return null;
    }

    public List<T> getAll() {
        // TODO: return a DEFENSIVE COPY, not the internal list
        return null;
    }

    public int size() {
        // TODO
        return 0;
    }
}`,
  sampleSolution: q2Solution,
  expectedOutput:
`Sample run 1 (TC 1 — add() with a NEW id; entered book = B004,Algorithms,David,120; id to find = B002):
OUTPUT:
size before = 3
add(B004) = true
size = 4
add(B004) again = false
size = 4

Sample run 2 (TC 1 — add() with a DUPLICATE id; entered book = B002,Duplicate Title,Eve,77):
OUTPUT:
size before = 3
add(B002) = false
size = 3
add(B002) again = false
size = 3

Sample run 3 (TC 2 — findById(); entered book = B004,Algorithms,David,120; id to find = B002):
OUTPUT:
add(B004) = true
findById(B002) = B002,OOP Design,Bella,150.50
title = OOP Design
findById(ZZZ) = null

Sample run 4 (TC 3 — getAll() defensive copy; entered book = B004,Algorithms,David,120):
OUTPUT:
copy size = 3
copy size after clear+add = 1
repo.size() = 3
repo.getAll() size = 3
repo.getAll().get(0) = B001,Java Basics,Alan,100.00`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'generic_bound', criterion: B('The class is declared "Repository<T extends Identifiable>" with a private List<T> field — NOT a raw type, NOT List<Object>, NOT an unbounded <T>.', 'Lớp khai báo "Repository<T extends Identifiable>" với field private List<T> — KHÔNG raw type, KHÔNG List<Object>, KHÔNG <T> không bound.'), weight: 3, maxScore: 0.75 },
    { id: 'add_duplicate', criterion: B('add() genuinely checks for an existing item with the same id (and for null) and returns false without adding; otherwise appends and returns true.', 'add() thực sự kiểm tra đã tồn tại phần tử trùng id (và kiểm null) rồi trả false mà không thêm; ngược lại thêm vào và trả true.'), weight: 3, maxScore: 0.75 },
    { id: 'findById_T', criterion: B('findById() is declared to return T (not Object / not Identifiable) and returns null when nothing matches, so the caller needs no cast.', 'findById() khai báo trả về T (không phải Object / không phải Identifiable) và trả null khi không khớp, nên nơi gọi không cần ép kiểu.'), weight: 3, maxScore: 0.75 },
    { id: 'defensive_copy', criterion: B('getAll() returns a NEW list (e.g. new ArrayList<T>(items)); mutating the returned list leaves the repository unchanged.', 'getAll() trả về list MỚI (vd new ArrayList<T>(items)); sửa list trả về không làm repository thay đổi.'), weight: 3, maxScore: 0.75 },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// Q3 — RepoUtils: generic methods (3 marks)
// ══════════════════════════════════════════════════════════════════════════
const q3PromptEn = `<p><strong>(3 marks)</strong> <code>Identifiable</code>, <code>Book</code> and <code>EBook</code> are already compiled and given in byte-code format.</p>
<p>Write a class <strong>RepoUtils</strong> containing three <strong>generic methods</strong> (each declares its own bounded type parameter):</p>
${table([
  '+&lt;T extends Identifiable&gt; filterByIdPrefix(items: List&lt;T&gt;, prefix: String): List&lt;T&gt; &nbsp;<em>static</em><br/>+&lt;T extends Identifiable&gt; countByIdPrefix(items: List&lt;T&gt;, prefix: String): int &nbsp;<em>static</em><br/>+&lt;T extends Identifiable&gt; firstByIdPrefix(items: List&lt;T&gt;, prefix: String): T &nbsp;<em>static</em>',
])}
<p>An item <strong>matches</strong> when its <code>getId()</code> starts with <code>prefix</code>, <strong>ignoring upper/lower case</strong> (so prefix <code>b</code> matches id <code>B001</code>).</p>
<ul>
  <li><code>filterByIdPrefix(...)</code> — return a <strong>new</strong> <code>List&lt;T&gt;</code> holding every matching item, in the original order. The source list must not be modified. When <code>items</code> or <code>prefix</code> is null, or nothing matches, return an <strong>empty list</strong> — never null.</li>
  <li><code>countByIdPrefix(...)</code> — return how many items match. It must count directly; it must <strong>not</strong> build a list (do not call <code>filterByIdPrefix(...).size()</code>). Return 0 for a null/empty list or a null prefix.</li>
  <li><code>firstByIdPrefix(...)</code> — return the <strong>first</strong> matching item, or <strong>null</strong> if there is none. The return type must be <strong>T</strong>, so that the caller can use the result as its own concrete type with no cast.</li>
</ul>
<p>Declare each method as <code>public static &lt;T extends Identifiable&gt; ...</code>.</p>`;

const q3PromptVi = `<p><strong>(3 điểm)</strong> <code>Identifiable</code>, <code>Book</code> và <code>EBook</code> đã được biên dịch sẵn dạng byte code.</p>
<p>Viết lớp <strong>RepoUtils</strong> gồm ba <strong>hàm generic</strong> (mỗi hàm tự khai báo tham số kiểu có bound):</p>
${table([
  '+&lt;T extends Identifiable&gt; filterByIdPrefix(items: List&lt;T&gt;, prefix: String): List&lt;T&gt; &nbsp;<em>static</em><br/>+&lt;T extends Identifiable&gt; countByIdPrefix(items: List&lt;T&gt;, prefix: String): int &nbsp;<em>static</em><br/>+&lt;T extends Identifiable&gt; firstByIdPrefix(items: List&lt;T&gt;, prefix: String): T &nbsp;<em>static</em>',
])}
<p>Một phần tử được coi là <strong>khớp</strong> khi <code>getId()</code> của nó bắt đầu bằng <code>prefix</code>, <strong>không phân biệt hoa/thường</strong> (prefix <code>b</code> khớp id <code>B001</code>).</p>
<ul>
  <li><code>filterByIdPrefix(...)</code> — trả về <code>List&lt;T&gt;</code> <strong>MỚI</strong> chứa mọi phần tử khớp, giữ nguyên thứ tự gốc. Không được sửa danh sách nguồn. Khi <code>items</code> hoặc <code>prefix</code> null, hoặc không có gì khớp, trả về <strong>list rỗng</strong> — tuyệt đối không trả null.</li>
  <li><code>countByIdPrefix(...)</code> — trả về số phần tử khớp. Phải đếm trực tiếp; <strong>không</strong> được tạo list (không gọi <code>filterByIdPrefix(...).size()</code>). Trả 0 khi list null/rỗng hoặc prefix null.</li>
  <li><code>firstByIdPrefix(...)</code> — trả về phần tử khớp <strong>ĐẦU TIÊN</strong>, hoặc <strong>null</strong> nếu không có. Kiểu trả về phải là <strong>T</strong>, để nơi gọi dùng được kết quả đúng kiểu cụ thể của mình mà không cần ép kiểu.</li>
</ul>
<p>Khai báo mỗi hàm dạng <code>public static &lt;T extends Identifiable&gt; ...</code>.</p>`;

const q3Solution = `import java.util.ArrayList;
import java.util.List;

public class RepoUtils {

    public static <T extends Identifiable> List<T> filterByIdPrefix(List<T> items, String prefix) {
        List<T> result = new ArrayList<T>();
        if (items == null || prefix == null) {
            return result;
        }
        String p = prefix.toLowerCase();
        for (T item : items) {
            if (item != null && item.getId() != null
                    && item.getId().toLowerCase().startsWith(p)) {
                result.add(item);
            }
        }
        return result;
    }

    public static <T extends Identifiable> int countByIdPrefix(List<T> items, String prefix) {
        if (items == null || prefix == null) {
            return 0;
        }
        String p = prefix.toLowerCase();
        int count = 0;
        for (T item : items) {
            if (item != null && item.getId() != null
                    && item.getId().toLowerCase().startsWith(p)) {
                count++;
            }
        }
        return count;
    }

    public static <T extends Identifiable> T firstByIdPrefix(List<T> items, String prefix) {
        if (items == null || prefix == null) {
            return null;
        }
        String p = prefix.toLowerCase();
        for (T item : items) {
            if (item != null && item.getId() != null
                    && item.getId().toLowerCase().startsWith(p)) {
                return item;
            }
        }
        return null;
    }
}`;

const q3ExplainEn = `<p><strong>Generic method vs generic class.</strong> Q2 put <code>&lt;T&gt;</code> on the class, so one <code>Repository</code> object is tied to one <code>T</code> for its whole life. Here <code>&lt;T extends Identifiable&gt;</code> sits on each <em>method</em>, between the modifiers and the return type: <code>public static &lt;T extends Identifiable&gt; List&lt;T&gt; filterByIdPrefix(...)</code>. Each call gets its own <code>T</code>, which the compiler <strong>infers</strong> from the argument. Pass a <code>List&lt;Book&gt;</code> and <code>T</code> is <code>Book</code>; pass a <code>List&lt;EBook&gt;</code> and <code>T</code> is <code>EBook</code>, with no change to the utility class. A static method cannot use a class-level type parameter, so utility classes always take this form.</p>
<p><strong>Why the return type must be <code>T</code>, not <code>Object</code>.</strong> This is the line that separates "understood generics" from "cast everything":</p>
<pre>Book first = RepoUtils.firstByIdPrefix(books, prefix);
System.out.println(first.getTitle());   // getTitle() is a Book method, NOT on Identifiable</pre>
<p>The harness really does this, with no cast anywhere. Declare the return type as <code>Object</code> and the caller is forced into <code>((Book) result).getTitle()</code> — a cast that the compiler cannot check and that blows up with <code>ClassCastException</code> the day someone passes the wrong list. Declaring <code>Identifiable</code> instead of <code>T</code> is not enough either: <code>Identifiable</code> only promises <code>getId()</code>. Only <code>T</code> carries the caller's real type back out of the method.</p>
<p><strong>Return an empty list, never null.</strong> "No matches" is a normal outcome, not an error. Handing back an empty list lets the caller write <code>for (T x : filterByIdPrefix(...))</code> unguarded; handing back <code>null</code> makes every call site pay for a null check, and one forgotten check is a <code>NullPointerException</code>. Note the asymmetry with <code>firstByIdPrefix</code>: there null <em>is</em> the natural "nothing found" value, because there is no such thing as an empty object.</p>
<p><strong>Why count() must not build a list.</strong> <code>filterByIdPrefix(items, p).size()</code> gives the right number but allocates a whole list to throw it away. The two methods look nearly identical on purpose: same traversal, different accumulator — a list vs an <code>int</code>. Recognising that shape is what lets you later read <code>stream().filter(...).count()</code> and know what it is doing.</p>
<p><strong>Polymorphism inside the list.</strong> The harness's <code>List&lt;Book&gt;</code> contains two <code>EBook</code> objects (a subclass of <code>Book</code>). Printing a filtered result calls each element's own <code>toString()</code>, so E-items print with their <code>MB</code> suffix — see sample run 2. The generic code never knew, and never needed to know.</p>
<p>The harness list (built by the given <code>Main.class</code>) is: <code>B001,Java Basics,Alan,100.00</code> / <code>E001,OOP Design,Bella,150.50,12.5MB</code> / <code>B002,Data Structures,Chris,90.00</code> / <code>E002,Design Patterns,Diana,200.00,8.5MB</code> / <code>B010,Clean Code,Evan,75.00</code>. All samples below are captured stdout from a real run.</p>`;

const q3ExplainVi = `<p><strong>Hàm generic khác lớp generic.</strong> Q2 đặt <code>&lt;T&gt;</code> trên LỚP, nên một đối tượng <code>Repository</code> gắn với một <code>T</code> suốt đời. Ở đây <code>&lt;T extends Identifiable&gt;</code> đặt trên từng <em>hàm</em>, nằm giữa các modifier và kiểu trả về: <code>public static &lt;T extends Identifiable&gt; List&lt;T&gt; filterByIdPrefix(...)</code>. Mỗi lời gọi có <code>T</code> riêng, do compiler <strong>suy ra</strong> từ đối số. Truyền <code>List&lt;Book&gt;</code> thì <code>T</code> là <code>Book</code>; truyền <code>List&lt;EBook&gt;</code> thì <code>T</code> là <code>EBook</code>, lớp tiện ích không phải sửa dòng nào. Hàm static không dùng được tham số kiểu của lớp, nên các lớp tiện ích luôn viết theo dạng này.</p>
<p><strong>Vì sao kiểu trả về phải là <code>T</code> chứ không phải <code>Object</code>.</strong> Đây chính là ranh giới giữa "hiểu generics" và "ép kiểu khắp nơi":</p>
<pre>Book first = RepoUtils.firstByIdPrefix(books, prefix);
System.out.println(first.getTitle());   // getTitle() la ham cua Book, KHONG co trong Identifiable</pre>
<p>Harness làm đúng như vậy, không có một lệnh ép kiểu nào. Nếu khai báo trả về <code>Object</code>, nơi gọi buộc phải viết <code>((Book) result).getTitle()</code> — một phép ép kiểu compiler không kiểm được và sẽ nổ <code>ClassCastException</code> vào ngày ai đó truyền nhầm danh sách. Khai <code>Identifiable</code> thay cho <code>T</code> cũng chưa đủ: <code>Identifiable</code> chỉ hứa có <code>getId()</code>. Chỉ <code>T</code> mới mang kiểu thật của nơi gọi ra khỏi hàm.</p>
<p><strong>Trả list rỗng, đừng bao giờ trả null.</strong> "Không khớp gì" là kết quả bình thường, không phải lỗi. Trả list rỗng cho phép nơi gọi viết thẳng <code>for (T x : filterByIdPrefix(...))</code>; trả <code>null</code> bắt mọi nơi gọi phải kiểm null, và chỉ cần quên một chỗ là <code>NullPointerException</code>. Để ý sự bất đối xứng với <code>firstByIdPrefix</code>: ở đó null MỚI là giá trị "không tìm thấy" tự nhiên, vì không có khái niệm "đối tượng rỗng".</p>
<p><strong>Vì sao count() không được tạo list.</strong> <code>filterByIdPrefix(items, p).size()</code> ra đúng số nhưng cấp phát cả một danh sách rồi vứt đi. Hai hàm giống nhau đến mức khó chịu là CỐ Ý: cùng một phép duyệt, khác cái biến tích luỹ — một bên là list, một bên là <code>int</code>. Nhận ra khuôn hình đó thì sau này đọc <code>stream().filter(...).count()</code> bạn biết ngay nó làm gì.</p>
<p><strong>Đa hình bên trong danh sách.</strong> <code>List&lt;Book&gt;</code> của harness chứa 2 đối tượng <code>EBook</code> (lớp con của <code>Book</code>). In kết quả lọc sẽ gọi <code>toString()</code> của chính từng phần tử, nên các mục E in kèm hậu tố <code>MB</code> — xem sample run 2. Code generic không hề biết, và cũng không cần biết.</p>
<p>Danh sách trong harness (do <code>Main.class</code> given tạo) là: <code>B001,Java Basics,Alan,100.00</code> / <code>E001,OOP Design,Bella,150.50,12.5MB</code> / <code>B002,Data Structures,Chris,90.00</code> / <code>E002,Design Patterns,Diana,200.00,8.5MB</code> / <code>B010,Clean Code,Evan,75.00</code>. Mọi mẫu dưới đây là stdout chụp từ lần chạy thật.</p>`;

const q3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `import java.util.ArrayList;
import java.util.List;

// Identifiable, Book and EBook are GIVEN (already compiled) — do not create them.

public class RepoUtils {

    public static <T extends Identifiable> List<T> filterByIdPrefix(List<T> items, String prefix) {
        // TODO: new list with every item whose id starts with prefix (ignore case)
        return null;
    }

    public static <T extends Identifiable> int countByIdPrefix(List<T> items, String prefix) {
        // TODO: count directly — do NOT build a list
        return 0;
    }

    public static <T extends Identifiable> T firstByIdPrefix(List<T> items, String prefix) {
        // TODO: first match, or null
        return null;
    }
}`,
  sampleSolution: q3Solution,
  expectedOutput:
`Sample run 1 (TC 1 — filterByIdPrefix(); prefix = b, lower-case on purpose):
OUTPUT:
B001,Java Basics,Alan,100.00
B002,Data Structures,Chris,90.00
B010,Clean Code,Evan,75.00
result size = 3
after result.clear(), source size = 5

Sample run 2 (TC 1 — filterByIdPrefix(); prefix = E, the two EBooks print their own toString()):
OUTPUT:
E001,OOP Design,Bella,150.50,12.5MB
E002,Design Patterns,Diana,200.00,8.5MB
result size = 2
after result.clear(), source size = 5

Sample run 3 (TC 2 — countByIdPrefix(); prefix = b):
OUTPUT:
count(b) = 3
count(Z) = 0
count on empty list = 0

Sample run 4 (TC 2 — countByIdPrefix(); prefix = B01):
OUTPUT:
count(B01) = 1
count(Z) = 0
count on empty list = 0

Sample run 5 (TC 3 — firstByIdPrefix(); prefix = b):
OUTPUT:
first = B001,Java Basics,Alan,100.00
id = B001
title = Java Basics
first(Z) = null

Sample run 6 (TC 3 — firstByIdPrefix(); prefix = E):
OUTPUT:
first = E001,OOP Design,Bella,150.50,12.5MB
id = E001
title = OOP Design
first(Z) = null`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'filter', criterion: B('filterByIdPrefix() declares <T extends Identifiable>, returns a NEW List<T> in original order, matches case-insensitively, does not modify the source, and returns an empty list (not null) when nothing matches.', 'filterByIdPrefix() khai báo <T extends Identifiable>, trả về List<T> MỚI giữ đúng thứ tự, so khớp không phân biệt hoa/thường, không sửa danh sách nguồn, và trả list rỗng (không null) khi không khớp.'), weight: 3, maxScore: 1 },
    { id: 'count', criterion: B('countByIdPrefix() counts with a plain counter over one traversal — it does NOT allocate a list (no filter(...).size()) — and returns 0 for empty/null input.', 'countByIdPrefix() đếm bằng biến đếm qua một lần duyệt — KHÔNG cấp phát list (không dùng filter(...).size()) — và trả 0 khi input rỗng/null.'), weight: 3, maxScore: 1 },
    { id: 'first_T', criterion: B('firstByIdPrefix() is declared to return T (not Object, not Identifiable), returns the FIRST match and null when there is none.', 'firstByIdPrefix() khai báo trả về T (không phải Object, không phải Identifiable), trả về phần tử khớp ĐẦU TIÊN và null khi không có.'), weight: 3, maxScore: 1 },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// Q4 — IdTools: sortById + mergeUnique (2 marks)
// ══════════════════════════════════════════════════════════════════════════
const q4PromptEn = `<p><strong>(2 marks)</strong> <code>Identifiable</code>, <code>Book</code> and <code>EBook</code> are already compiled and given in byte-code format.</p>
<p>Write a class <strong>IdTools</strong> with two generic methods that both rely on the bound to reach <code>getId()</code>:</p>
${table([
  '+&lt;T extends Identifiable&gt; sortById(items: List&lt;T&gt;): void &nbsp;<em>static</em><br/>+&lt;T extends Identifiable&gt; mergeUnique(first: List&lt;T&gt;, second: List&lt;T&gt;): List&lt;T&gt; &nbsp;<em>static</em>',
])}
<p>Where:</p>
<ul>
  <li><code>sortById(items)</code> — sort the list <strong>in place</strong> (the caller's own list object is reordered), ascending by <code>getId()</code> using the natural <code>String</code> order. Do nothing when <code>items</code> is null. <strong>Note</strong>: <code>Collections.sort(items)</code> alone will not compile, because <code>T</code> is not <code>Comparable</code> — you must supply a <code>Comparator&lt;T&gt;</code>.</li>
  <li><code>mergeUnique(first, second)</code> — return a <strong>new</strong> <code>List&lt;T&gt;</code> containing every item of <code>first</code> in order, followed by each item of <code>second</code> whose id does <strong>not</strong> already appear in the result. No two items in the result may share an id. Neither input list may be modified, and a null input is treated as empty.</li>
</ul>
<p>Declare both methods as <code>public static &lt;T extends Identifiable&gt; ...</code>.</p>`;

const q4PromptVi = `<p><strong>(2 điểm)</strong> <code>Identifiable</code>, <code>Book</code> và <code>EBook</code> đã được biên dịch sẵn dạng byte code.</p>
<p>Viết lớp <strong>IdTools</strong> gồm 2 hàm generic, cả hai đều dựa vào bound để gọi được <code>getId()</code>:</p>
${table([
  '+&lt;T extends Identifiable&gt; sortById(items: List&lt;T&gt;): void &nbsp;<em>static</em><br/>+&lt;T extends Identifiable&gt; mergeUnique(first: List&lt;T&gt;, second: List&lt;T&gt;): List&lt;T&gt; &nbsp;<em>static</em>',
])}
<p>Trong đó:</p>
<ul>
  <li><code>sortById(items)</code> — sắp xếp <strong>TẠI CHỖ</strong> (chính đối tượng list của nơi gọi bị sắp lại), tăng dần theo <code>getId()</code> theo thứ tự tự nhiên của <code>String</code>. Không làm gì khi <code>items</code> null. <strong>Lưu ý</strong>: chỉ gọi <code>Collections.sort(items)</code> sẽ KHÔNG biên dịch được, vì <code>T</code> không phải <code>Comparable</code> — bạn phải truyền một <code>Comparator&lt;T&gt;</code>.</li>
  <li><code>mergeUnique(first, second)</code> — trả về <code>List&lt;T&gt;</code> <strong>MỚI</strong> gồm mọi phần tử của <code>first</code> theo thứ tự, rồi đến những phần tử của <code>second</code> có id <strong>chưa</strong> xuất hiện trong kết quả. Kết quả không được có 2 phần tử trùng id. Không được sửa 2 danh sách đầu vào, và input null coi như rỗng.</li>
</ul>
<p>Khai báo cả 2 hàm dạng <code>public static &lt;T extends Identifiable&gt; ...</code>.</p>`;

const q4Solution = `import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class IdTools {

    public static <T extends Identifiable> void sortById(List<T> items) {
        if (items == null) {
            return;
        }
        Collections.sort(items, new Comparator<T>() {
            @Override
            public int compare(T a, T b) {
                return a.getId().compareTo(b.getId());
            }
        });
    }

    public static <T extends Identifiable> List<T> mergeUnique(List<T> first, List<T> second) {
        List<T> result = new ArrayList<T>();
        addAllUnique(result, first);
        addAllUnique(result, second);
        return result;
    }

    private static <T extends Identifiable> void addAllUnique(List<T> result, List<T> source) {
        if (source == null) {
            return;
        }
        for (T item : source) {
            if (item == null || item.getId() == null) {
                continue;
            }
            boolean exists = false;
            for (T kept : result) {
                if (kept.getId().equals(item.getId())) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                result.add(item);
            }
        }
    }
}`;

const q4ExplainEn = `<p><strong>This is where the bound pays off twice.</strong> Sorting needs a comparison key and merging needs an identity test. Both come from <code>getId()</code>, and both are legal only because <code>T extends Identifiable</code>. With a raw <code>Object</code> list you would be casting on every comparison and hoping.</p>
<p><strong>The sorting trap, verified.</strong> The obvious first attempt does not compile:</p>
<pre>public static &lt;T extends Identifiable&gt; void sortById(List&lt;T&gt; items) {
    Collections.sort(items);
}

IdTools.java:5: error: no suitable method found for sort(List&lt;T#1&gt;)
    method Collections.&lt;T#2&gt;sort(List&lt;T#2&gt;) is not applicable
      (inference variable T#2 has incompatible bounds
        equality constraints: T#1
        upper bounds: Comparable&lt;? super T#2&gt;)</pre>
<p><code>Collections.sort(list)</code> requires <code>T extends Comparable&lt;? super T&gt;</code>, and our bound only promises <code>Identifiable</code>. Two honest fixes: pass a <code>Comparator&lt;T&gt;</code> (used here — an anonymous class, which is what JDK 8 NetBeans projects usually look like), or tighten the bound to <code>&lt;T extends Identifiable &amp; Comparable&lt;T&gt;&gt;</code> — yes, a type parameter may have several bounds joined by <code>&amp;</code>. The comparator version is better here: it keeps the requirement on <code>Book</code> minimal, and it lets you sort by different keys later without touching the class.</p>
<p><strong>In place vs new list.</strong> <code>sortById</code> returns <code>void</code> and reorders the caller's list — <code>Collections.sort</code> mutates. <code>mergeUnique</code> does the opposite: it builds a new list and leaves both inputs untouched. Sample run 3 proves both at once: after merging and sorting the merged list, <code>listA</code> is still in its original order <code>B003 B001 B002</code>. Mixing these two habits up is one of the most common real bugs in LAB211 controllers.</p>
<p><strong>Erasure footnote.</strong> Unlike Q2, the bound here is invisible at run time: <code>sortById(List&lt;T&gt;)</code> erases to <code>sortById(List)</code>, so a sloppy raw version would still <em>link</em>. The bound is protecting you at compile time only — which is exactly when you want to be protected.</p>
<p><strong>Duplicate skipping.</strong> The de-duplication is checked against the <em>result</em>, not against <code>first</code>, so a repeated id inside <code>second</code> is also skipped. In sample run 2 the second list holds <code>B002,OOP Design 2nd Ed,Bella,170.00</code>; the merged list keeps the ORIGINAL <code>B002,OOP Design,Bella,150.50</code> from <code>first</code> and drops the newer edition — "first one wins" is a policy, and the spec fixed it deliberately. Sample run 4 shows the same rule catching a <code>B001</code> typed in at run time.</p>
<p>Harness data: listA = <code>B003,Algorithms,Frank,60.00</code> / <code>B001,Java Basics,Alan,100.00</code> / <code>B002,OOP Design,Bella,150.50</code>; listB = <code>B002,OOP Design 2nd Ed,Bella,170.00</code> / <code>B004,Networking,Gina,130.00</code> / <code>E001,Clean Code,Evan,75.00,9.0MB</code> plus the extra book you type in. All samples are captured stdout.</p>`;

const q4ExplainVi = `<p><strong>Đây là chỗ bound trả công hai lần.</strong> Sắp xếp cần khoá so sánh, gộp cần phép kiểm định danh. Cả hai đều lấy từ <code>getId()</code>, và cả hai chỉ hợp lệ vì <code>T extends Identifiable</code>. Với danh sách <code>Object</code> thô, bạn sẽ phải ép kiểu ở mỗi lần so sánh rồi cầu may.</p>
<p><strong>Bẫy sắp xếp, đã kiểm thật.</strong> Cách viết đầu tiên ai cũng nghĩ tới thì KHÔNG biên dịch được:</p>
<pre>public static &lt;T extends Identifiable&gt; void sortById(List&lt;T&gt; items) {
    Collections.sort(items);
}

IdTools.java:5: error: no suitable method found for sort(List&lt;T#1&gt;)
    method Collections.&lt;T#2&gt;sort(List&lt;T#2&gt;) is not applicable
      (inference variable T#2 has incompatible bounds
        equality constraints: T#1
        upper bounds: Comparable&lt;? super T#2&gt;)</pre>
<p><code>Collections.sort(list)</code> đòi <code>T extends Comparable&lt;? super T&gt;</code>, còn bound của ta chỉ hứa <code>Identifiable</code>. Hai cách sửa tử tế: truyền một <code>Comparator&lt;T&gt;</code> (dùng ở đây — lớp vô danh, đúng kiểu project NetBeans JDK 8), hoặc siết bound thành <code>&lt;T extends Identifiable &amp; Comparable&lt;T&gt;&gt;</code> — đúng vậy, một tham số kiểu có thể có nhiều bound nối bằng <code>&amp;</code>. Ở đây bản Comparator tốt hơn: giữ yêu cầu đặt lên <code>Book</code> ở mức tối thiểu, và sau này muốn sắp theo khoá khác cũng không phải đụng vào lớp.</p>
<p><strong>Tại chỗ khác với tạo list mới.</strong> <code>sortById</code> trả <code>void</code> và sắp lại chính list của nơi gọi — <code>Collections.sort</code> làm biến đổi. <code>mergeUnique</code> thì ngược lại: dựng list mới, để nguyên cả hai đầu vào. Sample run 3 chứng minh cả hai cùng lúc: sau khi gộp rồi sắp list đã gộp, <code>listA</code> vẫn giữ thứ tự gốc <code>B003 B001 B002</code>. Lẫn lộn hai thói quen này là một trong những lỗi thật hay gặp nhất ở controller của LAB211.</p>
<p><strong>Ghi chú về xoá kiểu.</strong> Khác Q2, ở đây bound vô hình lúc chạy: <code>sortById(List&lt;T&gt;)</code> bị xoá thành <code>sortById(List)</code>, nên bản viết ẩu kiểu raw vẫn <em>liên kết</em> được. Bound chỉ bảo vệ bạn lúc biên dịch — mà đó đúng là lúc bạn cần được bảo vệ.</p>
<p><strong>Bỏ qua trùng lặp.</strong> Phép khử trùng kiểm trên <em>kết quả</em>, không phải trên <code>first</code>, nên id lặp lại ngay bên trong <code>second</code> cũng bị bỏ qua. Ở sample run 2, danh sách thứ hai có <code>B002,OOP Design 2nd Ed,Bella,170.00</code>; list gộp giữ bản GỐC <code>B002,OOP Design,Bella,150.50</code> từ <code>first</code> và loại bản tái bản — "cái đầu tiên thắng" là một chính sách, và đề đã chốt nó có chủ đích. Sample run 4 cho thấy đúng luật đó bắt được một <code>B001</code> gõ vào lúc chạy.</p>
<p>Dữ liệu harness: listA = <code>B003,Algorithms,Frank,60.00</code> / <code>B001,Java Basics,Alan,100.00</code> / <code>B002,OOP Design,Bella,150.50</code>; listB = <code>B002,OOP Design 2nd Ed,Bella,170.00</code> / <code>B004,Networking,Gina,130.00</code> / <code>E001,Clean Code,Evan,75.00,9.0MB</code> cộng thêm quyển bạn gõ vào. Mọi mẫu là stdout đã chụp.</p>`;

const q4 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

// Identifiable, Book and EBook are GIVEN (already compiled) — do not create them.

public class IdTools {

    public static <T extends Identifiable> void sortById(List<T> items) {
        // TODO: sort IN PLACE, ascending by getId()
        // Collections.sort(items) alone will NOT compile — pass a Comparator<T>
    }

    public static <T extends Identifiable> List<T> mergeUnique(List<T> first, List<T> second) {
        // TODO: new list = all of first, then items of second whose id is not already present
        return null;
    }
}`,
  sampleSolution: q4Solution,
  expectedOutput:
`Sample run 1 (TC 1 — sortById(); extra book typed in = B005,Compilers,Helen,210):
OUTPUT:
before: B003 B001 B002
after : B001 B002 B003
first = B001,Java Basics,Alan,100.00

Sample run 2 (TC 2 — mergeUnique(); extra book = B005,Compilers,Helen,210):
OUTPUT:
B003,Algorithms,Frank,60.00
B001,Java Basics,Alan,100.00
B002,OOP Design,Bella,150.50
B004,Networking,Gina,130.00
E001,Clean Code,Evan,75.00,9.0MB
B005,Compilers,Helen,210.00
merged size = 6
listA size = 3, listB size = 4

Sample run 3 (TC 3 — mergeUnique() then sortById(); extra book = B005,Compilers,Helen,210):
OUTPUT:
merged ids = B001 B002 B003 B004 B005 E001
listA ids  = B003 B001 B002

Sample run 4 (TC 2 — mergeUnique() where the extra book duplicates B001 = B001,Java Basics Reprint,Alan,95):
OUTPUT:
B003,Algorithms,Frank,60.00
B001,Java Basics,Alan,100.00
B002,OOP Design,Bella,150.50
B004,Networking,Gina,130.00
E001,Clean Code,Evan,75.00,9.0MB
merged size = 5
listA size = 3, listB size = 4`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'sortById', criterion: B('sortById() sorts IN PLACE (void, caller list reordered) ascending by getId(), using a Comparator<T> (or an equivalently valid mechanism) — not Collections.sort(items) alone.', 'sortById() sắp xếp TẠI CHỖ (void, list của nơi gọi bị sắp lại) tăng dần theo getId(), dùng Comparator<T> (hoặc cơ chế hợp lệ tương đương) — không phải chỉ gọi Collections.sort(items).'), weight: 2, maxScore: 1 },
    { id: 'mergeUnique', criterion: B('mergeUnique() returns a NEW List<T> = all of first in order then only the non-duplicate ids of second, leaves both inputs unmodified, and uses getId() (via the bound) for the duplicate test.', 'mergeUnique() trả về List<T> MỚI = toàn bộ first theo thứ tự rồi chỉ những id chưa trùng của second, giữ nguyên 2 danh sách đầu vào, và dùng getId() (nhờ bound) để kiểm trùng.'), weight: 2, maxScore: 1 },
  ],
};

// ══════════════════════════════════════════════════════════════════════════
const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-ADV3',
      title: B(
        'PRO192 — Advanced Practice 3: Generics & Bounded Types (Nâng cao)',
        'PRO192 — Luyện tập Nâng cao 3: Generics & Kiểu Giới Hạn',
      ),
      description: B(
        'Self-authored supplementary practice paper (4 questions, 10 marks) — NOT a real school exam. It goes deeper into OOP than the standard PRO192 PE papers: you write your own generic class with a bounded type parameter (Repository<T extends Identifiable>), your own generic methods (filter / count / find returning a genuine T), and a sort + merge pair that only compiles because of the bound. Aimed at bridging into LAB211 (semester 3), which uses generic collections such as List<T> and Map<String,T> everywhere but rarely teaches you to WRITE a generic class. Every sample output below is real captured stdout from compiling the reference solution against the given Main.class harness.',
        'Đề luyện tập bổ trợ do chúng tôi tự soạn (4 câu, 10 điểm) — KHÔNG phải đề thi thật của trường. Đề đào sâu OOP hơn các đề PE PRO192 chuẩn: bạn tự viết lớp generic có tham số kiểu giới hạn (Repository<T extends Identifiable>), tự viết các hàm generic (lọc / đếm / tìm, trả về đúng kiểu T), và cặp hàm sắp xếp + gộp chỉ biên dịch được nhờ có bound. Mục tiêu là bắc cầu sang LAB211 (kỳ 3) — môn dùng dày đặc collection generic như List<T>, Map<String,T> nhưng hiếm khi dạy bạn TỰ VIẾT lớp generic. Mọi output mẫu bên dưới là stdout THẬT, chụp lại từ việc biên dịch lời giải tham chiếu cùng harness Main.class given.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 5,
      source: 'SAMPLE',
      isPublished: true,
      instructions,
      attachmentUrl: ATTACHMENT_URL,
      attachmentName: B('Download given materials (Q1-Q4 NetBeans projects, compiled harness)', 'Tải given materials (project NetBeans Q1-Q4, harness đã biên dịch)'),
      questions: [q1, q2, q3, q4],
    },
  ],
};

const total = spec.exams[0].questions.reduce((s, q) => s + q.points, 0);
if (total !== spec.exams[0].totalPoints) {
  throw new Error(`points mismatch: questions sum to ${total}, totalPoints is ${spec.exams[0].totalPoints}`);
}
for (const q of spec.exams[0].questions) {
  const sum = q.rubric.reduce((s, r) => s + r.maxScore, 0);
  if (Math.abs(sum - q.points) > 1e-9) {
    throw new Error(`rubric mismatch: rubric sums to ${sum}, question worth ${q.points}`);
  }
}

fs.writeFileSync(
  OUT,
  `// AUTO-GENERATED by scripts/build-pro192-pe-adv3.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)} (${total} points, ${spec.exams[0].questions.length} questions)`);
