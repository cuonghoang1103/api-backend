/**
 * build-pro192-da1.mjs — sinh content/exams/PRO192-DA1.mjs: 🏁 Dự án cuối khoá CT Library 1.0 — BẢN THI CÓ GIỜ 90′ kiểu PE
 * (đề TỰ SOẠN, source 'SAMPLE', không phải đề thật của trường). 4 câu trên đúng domain của dự án:
 *   Q1 lớp + lớp con Spec (Book / SpecBook) · Q2 LoanList extends ArrayList<Loan> (3 hàm) · Q3 interface ICode cho sẵn (MyCode)
 *   · Q4 đọc tệp lệnh, ghi tệp kết quả (CommandProcessor).
 * Nguồn + BỘ CHẤM THẬT ở flm-nguon: ~/Documents/FLM-nguon/_repo/PRO192/gen/de/da1/
 *   Qk/harness/*.java (Main = harness, Q3 + ICode) · Qk/sol/*.java (lời giải) · Qk/rong/*.java (khung rỗng)
 *   cham.mjs — chấm theo TC như máy chấm PE: lời giải 10/10, khung rỗng 0/10 (đã chạy 27/10/2026, cả JDK 21 lẫn JDK 8 thật).
 *   dong-goi.mjs — out/PRO192-DA1-Given.zip (Q1..Q4 project NetBeans, src chỉ có .class đề cho) ⇒ R2 files/exam-attachments/PRO192/.
 * Mọi expectedOutput dưới đây ĐỌC từ out/mau.json (output thật của lời giải, cham.mjs --ghi) — không gõ tay.
 *
 *   node scripts/build-pro192-da1.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-DA1.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const DE = '/Users/admin/Documents/FLM-nguon/_repo/PRO192/gen/de/da1';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-DA1.mjs');
const MAU = JSON.parse(fs.readFileSync(path.join(DE, 'out', 'mau.json'), 'utf8'));
const doc = (q, d, f) => fs.readFileSync(path.join(DE, q, d, f), 'utf8').trimEnd();
const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const table = (rows) => `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/DA1-Given.zip';

/** Sample runs THẬT: [q, tcIndex, runIndex, mô tả] ⇒ "Sample run n (…):\nOUTPUT:\n…". */
function mau(ds) {
  return ds.map(([q, t, k, moTa], i) => {
    const c = MAU[q].tc[t].chay[k];
    if (c.ra == null) throw new Error(`${q} TC${t + 1} lần ${k}: lời giải không có OUTPUT`);
    return `Sample run ${i + 1} (${moTa}):\nOUTPUT:\n${c.ra}`;
  }).join('\n\n');
}
const out = (q, t, k) => MAU[q].tc[t].chay[k].ra;

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS — FINAL PROJECT "CT LIBRARY 1.0", TIMED PAPER (90 minutes)</strong></p>
   <p><strong>Read this first:</strong> this is <em>not</em> a real FPTU exam paper. It is the timed part of the course's final project, written in-house on the CT Library domain you built in Labs 1–9 and in the project (books, members, loans, late fees, a command file). The format is the real PE format — same rules, same kind of harness — so it doubles as PE practice.</p>
   <ol>
     <li>Software required: NetBeans 13 or later, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Use only your own study materials stored on your computer.</li>
     <li>Download the given materials, open the given Qx project in NetBeans and complete it. Do NOT delete or edit given files, and do NOT create a java file with the same name as a given file (<code>Main</code>, and <code>ICode</code> in Q3).</li>
     <li>Before submission: "Clean and Build Project" (Shift+F11); for each question make two sub-folders <strong>run</strong> (copy <code>Qx.jar</code>) and <strong>src</strong> (copy the project source).</li>
     <li>No accented Vietnamese in code comments. Do NOT rename the folders/files given in the paper. All .java files use the NetBeans default package.</li>
     <li>Plan your 90 minutes: Q1 15′ · Q2 25′ · Q3 20′ · Q4 30′. Each test case (TC) is all-or-nothing, exactly like the real marking software: one wrong character in one line loses that TC.</li>
   </ol>
   <p>This exam room cannot run NetBeans in the browser: type each class into the code box and it is graded by AI against the rubric. The "given materials" download is a REAL NetBeans project set with the compiled <code>Main.class</code> harness, so you can build and run it on your own machine and compare with the samples below. The course lesson "🏁 Final project — CT Library 1.0" ships the full marking tool used to check this paper.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192 — DỰ ÁN CUỐI KHOÁ "CT LIBRARY 1.0", BẢN THI CÓ GIỜ (90 phút)</strong></p>
   <p><strong>Đọc kỹ trước:</strong> đây <em>không phải</em> đề thi thật của FPTU. Đây là phần thi có giờ của dự án cuối khoá, do đội ngũ tự soạn trên đúng domain CT Library bạn đã xây qua Lab 1–9 và dự án (sách, thành viên, lượt mượn, phí trễ, tệp lệnh). Hình thức là hình thức PE thật — cùng luật, cùng kiểu harness — nên làm đề này cũng là luyện PE.</p>
   <ol>
     <li>Phần mềm: NetBeans 13 trở lên, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Chỉ dùng tài liệu học tập của mình lưu trên máy.</li>
     <li>Tải given materials, mở project Qx trong NetBeans rồi làm. KHÔNG xoá/sửa tệp given, KHÔNG tạo tệp java trùng tên tệp given (<code>Main</code>, và <code>ICode</code> ở Q3).</li>
     <li>Trước khi nộp: "Clean and Build Project" (Shift+F11); mỗi câu tạo 2 thư mục con <strong>run</strong> (chép <code>Qx.jar</code>) và <strong>src</strong> (chép mã nguồn project).</li>
     <li>Không gõ tiếng Việt có dấu trong comment. KHÔNG đổi tên thư mục/tệp mà đề quy định. Mọi tệp .java dùng package mặc định của NetBeans.</li>
     <li>Chia 90 phút: Q1 15′ · Q2 25′ · Q3 20′ · Q4 30′. Mỗi test case (TC) được ăn cả hoặc mất cả, đúng như phần mềm chấm thật: sai một ký tự ở một dòng là mất TC đó.</li>
   </ol>
   <p>Phòng thi web không chạy được NetBeans trên trình duyệt: bạn gõ từng lớp vào ô mã và được AI chấm theo tiêu chí. Tệp "given materials" là bộ project NetBeans THẬT kèm harness <code>Main.class</code> đã biên dịch, để bạn build và chạy thật trên máy rồi so với các mẫu bên dưới. Bài học "🏁 Dự án cuối khoá — CT Library 1.0" có kèm đủ bộ chấm đã dùng để kiểm đề này.</p>`,
);

// ═══════════════════════════════ Q1 (2 marks) ═══════════════════════════════
const q1Uml1 = table(['-title: String<br/>-copies: int', '+Book()<br/>+Book(title: String, copies: int)<br/>+getTitle(): String<br/>+getCopies(): int<br/>+setTitle(title: String): void<br/>+toString(): String']);
const q1Uml2 = table(['-lateDays: int', '+SpecBook()<br/>+SpecBook(title: String, copies: int, lateDays: int)<br/>+toString(): String<br/>+setData(): void<br/>+getValue(): int']);
const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(
    `<p><strong>(2 marks)</strong> Do not pay attention to the real meaning of objects, variables and their values. Write a class <strong>Book</strong> and a class <strong>SpecBook</strong> extending <strong>Book</strong> (two files, default package):</p>
${q1Uml1}
<ul><li><code>Book()</code> — default constructor; <code>Book(title, copies)</code> — sets both fields.</li><li><code>getTitle()</code>, <code>getCopies()</code> — return the fields; <code>setTitle(title)</code> — updates title.</li><li><code>toString()</code> — returns <strong>title, copies</strong> (a comma and ONE space).</li></ul>
${q1Uml2}
<ul><li><code>SpecBook()</code> — default constructor; <code>SpecBook(title, copies, lateDays)</code> — sets the three values.</li><li><code>toString()</code> — returns <strong>title, copies, lateDays</strong>.</li><li><code>setData()</code> — replaces <strong>every</strong> space in title with the character <code>_</code>.</li><li><code>getValue()</code> — the late fee: the first <strong>2</strong> late days are free, every day after that costs <strong>2000</strong>; return 0 when lateDays &lt;= 2.</li></ul>
<p><em>The given Main reads title, copies, late days, then the TC number. Do not format the result.</em></p>`,
    `<p><strong>(2 điểm)</strong> Không cần để ý ý nghĩa thật của đối tượng, biến và giá trị. Viết lớp <strong>Book</strong> và lớp <strong>SpecBook</strong> kế thừa <strong>Book</strong> (hai tệp, package mặc định):</p>
${q1Uml1}
<ul><li><code>Book()</code> — constructor mặc định; <code>Book(title, copies)</code> — gán cả hai trường.</li><li><code>getTitle()</code>, <code>getCopies()</code> — trả về trường; <code>setTitle(title)</code> — đổi title.</li><li><code>toString()</code> — trả về <strong>title, copies</strong> (dấu phẩy và MỘT dấu cách).</li></ul>
${q1Uml2}
<ul><li><code>SpecBook()</code> — constructor mặc định; <code>SpecBook(title, copies, lateDays)</code> — gán ba giá trị.</li><li><code>toString()</code> — trả về <strong>title, copies, lateDays</strong>.</li><li><code>setData()</code> — thay <strong>mọi</strong> dấu cách trong title bằng ký tự <code>_</code>.</li><li><code>getValue()</code> — phí trễ: <strong>2</strong> ngày trễ đầu miễn phí, mỗi ngày sau đó <strong>2000</strong>; lateDays &lt;= 2 thì trả 0.</li></ul>
<p><em>Main cho sẵn đọc title, copies, late days rồi số TC. Không định dạng kết quả.</em></p>`),
  starterCode: `public class Book {
    private String title;
    private int copies;
    // TODO: Book(), Book(title, copies), getTitle(), getCopies(), setTitle(title),
    // toString() -> "title, copies"
}

class SpecBook extends Book {   // in NetBeans: its own file SpecBook.java, public class
    private int lateDays;
    // TODO: SpecBook(), SpecBook(title, copies, lateDays),
    // toString() -> "title, copies, lateDays"
    // setData(): every space in title -> "_"   (title is private in Book!)
    // getValue(): first 2 late days free, then 2000 per day
}`,
  sampleSolution: `${doc('Q1', 'sol', 'Book.java')}\n\n// ── SpecBook.java ──\n${doc('Q1', 'sol', 'SpecBook.java')}`,
  expectedOutput: mau([['Q1', 0, 0, 'TC 1 — toString(), title="clean code book" copies=3 lateDays=5'], ['Q1', 1, 1, 'TC 2 — setData(), title=" a  b " (spaces at both ends, two in the middle) copies=2'], ['Q1', 2, 0, 'TC 3 — getValue(), lateDays=5'], ['Q1', 2, 1, 'TC 3 — getValue(), lateDays=2']]),
  explanation: B(
    `<p><strong>The trap is <code>private</code>.</strong> <code>title</code> and <code>copies</code> are private in <code>Book</code>, so <code>SpecBook</code> cannot write <code>title + ", " + copies</code> — javac says <em>"title has private access in Book"</em>. Reuse the parent: <code>super.toString() + ", " + lateDays</code>, and in <code>setData()</code> go through the getter and the setter: <code>setTitle(getTitle().replace(" ", "_"))</code>. That is why <code>setTitle</code> is in the UML at all.</p><p><strong>"Every" space.</strong> <code>String.replace(" ", "_")</code> replaces all occurrences; <code>replaceFirst</code> or <code>indexOf</code> would change only the first. TC 2 uses <code>" a  b "</code> (spaces at both ends, two in the middle) and expects <code>${esc(out('Q1', 1, 1).split('\n')[0])}</code> — no trim, no merging.</p><p><strong>getValue()</strong> is the Staff late-fee rule of the project with a fixed 2000/day: 5 days ⇒ (5 − 2) × 2000 = ${out('Q1', 2, 0)}; 2 days ⇒ ${out('Q1', 2, 1)}.</p>`,
    `<p><strong>Bẫy nằm ở <code>private</code>.</strong> <code>title</code> và <code>copies</code> là private trong <code>Book</code>, nên <code>SpecBook</code> không viết được <code>title + ", " + copies</code> — javac báo <em>"title has private access in Book"</em>. Dùng lại lớp cha: <code>super.toString() + ", " + lateDays</code>, và trong <code>setData()</code> đi qua getter rồi setter: <code>setTitle(getTitle().replace(" ", "_"))</code>. Vì thế UML mới có <code>setTitle</code>.</p><p><strong>"Mọi" dấu cách.</strong> <code>String.replace(" ", "_")</code> thay hết; <code>replaceFirst</code> hay <code>indexOf</code> chỉ thay cái đầu. TC 2 dùng <code>" a  b "</code> (hai đầu có dấu cách, giữa có hai) và đòi <code>${esc(out('Q1', 1, 1).split('\n')[0])}</code> — không trim, không gộp.</p><p><strong>getValue()</strong> là luật phí trễ của cán bộ trong dự án với giá cố định 2000/ngày: 5 ngày ⇒ (5 − 2) × 2000 = ${out('Q1', 2, 0)}; 2 ngày ⇒ ${out('Q1', 2, 1)}.</p>`),
  rubric: [
    { id: 'inherit_tostring', criterion: B('SpecBook extends Book, its constructor calls super(title, copies), and both toString() formats are exact ("title, copies" / "title, copies, lateDays").', 'SpecBook kế thừa Book, constructor gọi super(title, copies), cả hai định dạng toString() đúng từng ký tự ("title, copies" / "title, copies, lateDays").'), weight: 1, maxScore: 0.5 },
    { id: 'setdata', criterion: B('setData() replaces EVERY space with "_" through getTitle()/setTitle() (title is private in Book), no trim.', 'setData() thay MỌI dấu cách bằng "_" qua getTitle()/setTitle() (title là private trong Book), không trim.'), weight: 1, maxScore: 0.75 },
    { id: 'getvalue', criterion: B('getValue() returns 0 for lateDays <= 2 and (lateDays - 2) * 2000 otherwise.', 'getValue() trả 0 khi lateDays <= 2, ngược lại (lateDays - 2) * 2000.'), weight: 1, maxScore: 0.75 },
  ],
};

// ═══════════════════════════════ Q2 (3 marks) ═══════════════════════════════
const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(
    `<p><strong>(3 marks)</strong> Write a class <strong>Loan</strong>:</p>
${table(['-memberId: String<br/>-itemId: String<br/>-daysLate: int', '+Loan()<br/>+Loan(memberId: String, itemId: String, daysLate: int)<br/>+getMemberId(): String<br/>+getItemId(): String<br/>+getDaysLate(): int<br/>+toString(): String'])}
<p><code>toString()</code> returns <strong>memberId,itemId,daysLate</strong> — <strong>no spaces</strong>.</p>
<p>Write a class <strong>LoanList</strong> which extends <strong>ArrayList</strong>:</p>
<pre>public class LoanList extends ArrayList&lt;Loan&gt; {
    //.....
}</pre>
<ul><li><code>addLoan(loan: Loan): void</code> — add a loan to the list.</li><li><code>countLateLoans(): int</code> — the number of loans with daysLate &gt; 0.</li><li><code>findMostLate(): Loan</code> — the loan with the highest daysLate; if several share the highest value, return the <strong>first</strong> one in the list. Assume the list is not empty.</li><li><code>removeByMember(memberId: String): int</code> — remove <strong>every</strong> loan whose memberId equals memberId (<strong>ignore case</strong>) and return how many were removed (0 if none).</li></ul>
<p><em>The given Main starts the list with M001,B001,0 · M002,B005,3 · M002,B020,7 · M001,T151,7 · M003,D181,0, then adds the loan you type, then runs the TC.</em></p>`,
    `<p><strong>(3 điểm)</strong> Viết lớp <strong>Loan</strong>:</p>
${table(['-memberId: String<br/>-itemId: String<br/>-daysLate: int', '+Loan()<br/>+Loan(memberId: String, itemId: String, daysLate: int)<br/>+getMemberId(): String<br/>+getItemId(): String<br/>+getDaysLate(): int<br/>+toString(): String'])}
<p><code>toString()</code> trả về <strong>memberId,itemId,daysLate</strong> — <strong>không có dấu cách</strong>.</p>
<p>Viết lớp <strong>LoanList</strong> kế thừa <strong>ArrayList</strong>:</p>
<pre>public class LoanList extends ArrayList&lt;Loan&gt; {
    //.....
}</pre>
<ul><li><code>addLoan(loan: Loan): void</code> — thêm một lượt vào danh sách.</li><li><code>countLateLoans(): int</code> — số lượt có daysLate &gt; 0.</li><li><code>findMostLate(): Loan</code> — lượt có daysLate lớn nhất; nhiều lượt cùng lớn nhất thì trả lượt <strong>đầu tiên</strong> trong danh sách. Giả sử danh sách không rỗng.</li><li><code>removeByMember(memberId: String): int</code> — xoá <strong>mọi</strong> lượt có memberId bằng memberId (<strong>không phân biệt hoa thường</strong>) và trả về số lượt đã xoá (0 nếu không có).</li></ul>
<p><em>Main cho sẵn khởi tạo danh sách M001,B001,0 · M002,B005,3 · M002,B020,7 · M001,T151,7 · M003,D181,0, thêm lượt bạn gõ, rồi chạy TC.</em></p>`),
  starterCode: `import java.util.ArrayList;

public class Loan {
    private String memberId;
    private String itemId;
    private int daysLate;
    // TODO: Loan(), Loan(memberId, itemId, daysLate), getters,
    // toString() -> "memberId,itemId,daysLate" (no spaces)
}

class LoanList extends ArrayList<Loan> {   // in NetBeans: its own file LoanList.java, public class
    // TODO: addLoan, countLateLoans, findMostLate (tie -> FIRST one),
    // removeByMember (ignore case, remove EVERY match, return count)
}`,
  sampleSolution: `${doc('Q2', 'sol', 'Loan.java')}\n\n// ── LoanList.java ──\n${doc('Q2', 'sol', 'LoanList.java')}`,
  expectedOutput: mau([['Q2', 0, 0, 'TC 1 — countLateLoans(), added M004,B050,0'], ['Q2', 1, 0, 'TC 2 — findMostLate(), added M004,B050,1 (two loans share 7)'], ['Q2', 2, 0, 'TC 3 — removeByMember("m002"), added M002,D185,4']]),
  explanation: B(
    `<p><strong>findMostLate — the tie.</strong> M002,B020,7 and M001,T151,7 both have 7. Starting from <code>get(0)</code> and replacing only on <code>&gt;</code> keeps the first one, <code>${esc(out('Q2', 1, 0))}</code>; <code>&gt;=</code> would return the last one and lose the TC.</p><p><strong>removeByMember — three ways to get it wrong.</strong> (1) <code>for (Loan l : this) if (...) remove(l);</code> throws <code>ConcurrentModificationException</code> as soon as it removes and keeps looping. (2) A forward index loop <code>for (int i = 0; i &lt; size(); i++) if (...) remove(i);</code> does not crash but <strong>skips</strong> the element that slides into position i — the list puts the two M002 loans <em>next to each other</em> exactly to catch this. (3) <code>equals</code> instead of <code>equalsIgnoreCase</code> misses <code>"m002"</code>. The safe forms: <code>Iterator.remove()</code> (the sample solution), a <strong>backward</strong> index loop, or <code>removeIf</code> (Java 8) while counting the size difference. With <code>"m002"</code> the real output is:</p><pre>${esc(out('Q2', 2, 0))}</pre>`,
    `<p><strong>findMostLate — chỗ bằng nhau.</strong> M002,B020,7 và M001,T151,7 cùng là 7. Bắt đầu từ <code>get(0)</code> và chỉ thay khi <code>&gt;</code> thì giữ được lượt đầu, <code>${esc(out('Q2', 1, 0))}</code>; dùng <code>&gt;=</code> sẽ trả lượt cuối và mất TC.</p><p><strong>removeByMember — ba cách làm sai.</strong> (1) <code>for (Loan l : this) if (...) remove(l);</code> ném <code>ConcurrentModificationException</code> ngay khi xoá rồi chạy tiếp vòng lặp. (2) Vòng chỉ số chạy XUÔI <code>for (int i = 0; i &lt; size(); i++) if (...) remove(i);</code> không sập nhưng <strong>bỏ sót</strong> phần tử vừa trượt lên vị trí i — danh sách cố ý đặt hai lượt M002 <em>sát nhau</em> để bắt lỗi này. (3) Dùng <code>equals</code> thay <code>equalsIgnoreCase</code> thì không khớp <code>"m002"</code>. Cách an toàn: <code>Iterator.remove()</code> (lời giải mẫu), vòng chỉ số chạy <strong>ngược</strong>, hoặc <code>removeIf</code> (Java 8) rồi lấy hiệu kích thước. Với <code>"m002"</code> output thật là:</p><pre>${esc(out('Q2', 2, 0))}</pre>`),
  rubric: [
    { id: 'loan_tostring', criterion: B('Loan stores the three fields and toString() is exactly "memberId,itemId,daysLate" with no spaces; LoanList extends ArrayList<Loan> and addLoan adds.', 'Loan giữ ba trường, toString() đúng "memberId,itemId,daysLate" không dấu cách; LoanList kế thừa ArrayList<Loan>, addLoan thêm được.'), weight: 1, maxScore: 0.5 },
    { id: 'count', criterion: B('countLateLoans() counts loans with daysLate > 0 (strictly).', 'countLateLoans() đếm lượt có daysLate > 0 (lớn hơn hẳn).'), weight: 1, maxScore: 0.75 },
    { id: 'most_late', criterion: B('findMostLate() returns the FIRST loan with the highest daysLate (strict > comparison).', 'findMostLate() trả lượt ĐẦU TIÊN có daysLate lớn nhất (so sánh > hẳn).'), weight: 1, maxScore: 0.75 },
    { id: 'remove', criterion: B('removeByMember() ignores case, removes EVERY match without ConcurrentModificationException and without skipping adjacent matches, and returns the count.', 'removeByMember() không phân biệt hoa thường, xoá MỌI lượt khớp mà không ném ConcurrentModificationException và không bỏ sót lượt nằm sát nhau, trả về số đã xoá.'), weight: 1, maxScore: 1 },
  ],
};

// ═══════════════════════════════ Q3 (2 marks) ═══════════════════════════════
const q3 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(
    `<p><strong>(2 marks)</strong> The interface <strong>ICode</strong> below is already compiled and given in byte code format, thus you can use it without creating the ICode.java file:</p>
<pre>public interface ICode {
    public int f1(String str);
    public String f2(String str);
}</pre>
<p>A string holds item codes of CT Library separated by one or more spaces. Write a class <strong>MyCode</strong> which implements <strong>ICode</strong>:</p>
<ul><li><strong>f1</strong>: count and return the number of words that are <strong>valid item codes</strong>: exactly 4 characters, the first one is an <strong>upper-case</strong> <code>B</code>, <code>T</code> or <code>D</code>, the other three are digits.</li><li><strong>f2</strong>: return the string in which every word starting with <code>D</code> (a DVD) is moved to the <strong>end</strong>; the other words and the moved words each keep their original order; words in the result are separated by <strong>one</strong> space, no leading/trailing space.</li></ul>`,
    `<p><strong>(2 điểm)</strong> Interface <strong>ICode</strong> dưới đây đã được biên dịch sẵn dạng byte code, bạn dùng luôn mà không tạo tệp ICode.java:</p>
<pre>public interface ICode {
    public int f1(String str);
    public String f2(String str);
}</pre>
<p>Một chuỗi chứa các mã tài liệu của CT Library, ngăn bởi một hay nhiều dấu cách. Viết lớp <strong>MyCode</strong> cài <strong>ICode</strong>:</p>
<ul><li><strong>f1</strong>: đếm và trả về số từ là <strong>mã tài liệu hợp lệ</strong>: đúng 4 ký tự, ký tự đầu là <code>B</code>, <code>T</code> hoặc <code>D</code> <strong>viết hoa</strong>, ba ký tự còn lại là chữ số.</li><li><strong>f2</strong>: trả về chuỗi trong đó mọi từ bắt đầu bằng <code>D</code> (DVD) được dời về <strong>cuối</strong>; nhóm còn lại và nhóm bị dời đều giữ thứ tự ban đầu; các từ trong kết quả cách nhau <strong>một</strong> dấu cách, không có dấu cách ở đầu/cuối.</li></ul>`),
  starterCode: `public interface ICode {          // GIVEN as ICode.class - do not create this file
    public int f1(String str);
    public String f2(String str);
}

public class MyCode implements ICode {
    // TODO: f1 (valid item codes), f2 (DVD codes to the end, one space between words)
}`,
  sampleSolution: doc('Q3', 'sol', 'MyCode.java'),
  expectedOutput: mau([['Q3', 0, 0, 'TC 1 — f1, input "B001 b002 T15 D181 X100 T1510 B020"'], ['Q3', 0, 1, 'TC 1 — f1, input "  T151   D200 " (spaces at both ends)'], ['Q3', 1, 0, 'TC 2 — f2, input "B001 D181 T151 D185 B020"'], ['Q3', 1, 2, 'TC 2 — f2, input "B001  T151" (two spaces, no DVD)']]),
  explanation: B(
    `<p><strong>Split once, the right way.</strong> <code>str.trim().split("\\\\s+")</code> drops the spaces at both ends and treats any run of spaces as one separator. Without <code>trim()</code>, <code>"  T151   D200 "</code> gives an empty first word; with <code>split(" ")</code> it gives several empty words — harmless for f1 (an empty word is not a code) but fatal for f2 (empty words become extra spaces).</p><p><strong>f1</strong> is one regular expression per word: <code>word.matches("[BTD]\\\\d{3}")</code> — <code>matches</code> checks the WHOLE word, so <code>T15</code> (too short), <code>T1510</code> (too long), <code>b002</code> (lower case) and <code>X100</code> do not count: ${out('Q3', 0, 0)} codes in the first sample.</p><p><strong>f2</strong> needs two lists (or a StringBuilder per group): one pass keeps the order of both groups, then <code>String.join(" ", …)</code> puts exactly one space between words. Sorting would break the order rule.</p>`,
    `<p><strong>Tách một lần, cho đúng.</strong> <code>str.trim().split("\\\\s+")</code> bỏ dấu cách ở hai đầu và coi một dãy dấu cách là một chỗ ngăn. Thiếu <code>trim()</code> thì <code>"  T151   D200 "</code> cho một từ rỗng đầu tiên; dùng <code>split(" ")</code> thì ra nhiều từ rỗng — vô hại với f1 (từ rỗng không phải mã) nhưng chết với f2 (từ rỗng thành dấu cách thừa).</p><p><strong>f1</strong> là một biểu thức chính quy cho mỗi từ: <code>word.matches("[BTD]\\\\d{3}")</code> — <code>matches</code> kiểm CẢ từ, nên <code>T15</code> (ngắn), <code>T1510</code> (dài), <code>b002</code> (chữ thường) và <code>X100</code> không được tính: mẫu đầu có ${out('Q3', 0, 0)} mã.</p><p><strong>f2</strong> cần hai danh sách (hoặc mỗi nhóm một StringBuilder): một lượt duyệt giữ thứ tự cả hai nhóm, rồi <code>String.join(" ", …)</code> đặt đúng một dấu cách giữa các từ. Sắp xếp sẽ phá luật giữ thứ tự.</p>`),
  rubric: [
    { id: 'implements', criterion: B('MyCode implements the given ICode (does not re-declare it) with both methods public.', 'MyCode cài ICode cho sẵn (không khai lại interface), cả hai hàm public.'), weight: 1, maxScore: 0.25 },
    { id: 'f1', criterion: B('f1 counts whole words matching upper-case B/T/D + exactly 3 digits, robust to leading/trailing/multiple spaces.', 'f1 đếm từ khớp CẢ từ: B/T/D viết hoa + đúng 3 chữ số, chịu được dấu cách đầu/cuối/nhiều dấu cách.'), weight: 1, maxScore: 0.75 },
    { id: 'f2', criterion: B('f2 moves every word starting with D to the end, keeps both groups in their original order, single spaces, no leading/trailing space.', 'f2 dời mọi từ bắt đầu bằng D về cuối, giữ thứ tự hai nhóm, một dấu cách giữa các từ, không dấu cách đầu/cuối.'), weight: 1, maxScore: 1 },
  ],
};

// ═══════════════════════════════ Q4 (3 marks) ═══════════════════════════════
const q4 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(
    `<p><strong>(3 marks)</strong> The library desk saves its work as a <strong>command file</strong>, one command per line. Write a class <strong>CommandProcessor</strong>:</p>
${table(['(choose your own private fields)', '+process(inputFile: String, outputFile: String): int  throws IOException'])}
<p><code>process</code> reads <code>inputFile</code> line by line and writes <strong>one result line</strong> to <code>outputFile</code> for every <strong>non-blank</strong> line (blank lines are skipped but still counted in line numbers). Words in a line are separated by one or more spaces. The command word is <strong>upper case</strong> exactly; member and item ids are compared and printed in upper case.</p>
<ul><li><code>BORROW &lt;memberId&gt; &lt;itemId&gt;</code> — if the item is already borrowed by anyone ⇒ <code>BUSY &lt;itemId&gt;</code>; else if the member already holds <strong>3</strong> items ⇒ <code>LIMIT &lt;memberId&gt;</code>; else record it ⇒ <code>OK BORROW &lt;memberId&gt; &lt;itemId&gt;</code>.</li><li><code>RETURN &lt;memberId&gt; &lt;itemId&gt;</code> — if this member holds this item ⇒ remove it, <code>OK RETURN &lt;memberId&gt; &lt;itemId&gt;</code>; else <code>NOT_FOUND &lt;memberId&gt; &lt;itemId&gt;</code>.</li><li><code>COUNT &lt;memberId&gt;</code> ⇒ <code>&lt;memberId&gt; &lt;number of items held&gt;</code>.</li><li>Anything else (unknown or lower-case command word, wrong number of words) ⇒ <code>INVALID &lt;line number&gt;</code> (lines are counted from 1).</li></ul>
<p><code>process</code> returns the number of result lines that start with <code>OK</code>. Close both files (try-with-resources). <em>The given Main writes <code>commands.txt</code> for the TC, calls <code>process("commands.txt", "result.txt")</code>, then prints the return value and every line of <code>result.txt</code>.</em></p>`,
    `<p><strong>(3 điểm)</strong> Quầy thư viện lưu công việc thành một <strong>tệp lệnh</strong>, mỗi dòng một lệnh. Viết lớp <strong>CommandProcessor</strong>:</p>
${table(['(tự chọn các trường private)', '+process(inputFile: String, outputFile: String): int  throws IOException'])}
<p><code>process</code> đọc <code>inputFile</code> từng dòng và ghi <strong>một dòng kết quả</strong> vào <code>outputFile</code> cho mỗi dòng <strong>không trống</strong> (dòng trống bỏ qua nhưng vẫn được đếm số dòng). Các từ trong dòng cách nhau một hay nhiều dấu cách. Từ lệnh phải <strong>viết hoa</strong> đúng; mã thành viên, mã tài liệu so và in dạng viết hoa.</p>
<ul><li><code>BORROW &lt;mãTV&gt; &lt;mãTL&gt;</code> — tài liệu đang có người mượn ⇒ <code>BUSY &lt;mãTL&gt;</code>; ngược lại nếu thành viên đang giữ <strong>3</strong> tài liệu ⇒ <code>LIMIT &lt;mãTV&gt;</code>; còn lại ghi nhận ⇒ <code>OK BORROW &lt;mãTV&gt; &lt;mãTL&gt;</code>.</li><li><code>RETURN &lt;mãTV&gt; &lt;mãTL&gt;</code> — thành viên này đang giữ tài liệu này ⇒ bỏ ra, <code>OK RETURN &lt;mãTV&gt; &lt;mãTL&gt;</code>; ngược lại <code>NOT_FOUND &lt;mãTV&gt; &lt;mãTL&gt;</code>.</li><li><code>COUNT &lt;mãTV&gt;</code> ⇒ <code>&lt;mãTV&gt; &lt;số tài liệu đang giữ&gt;</code>.</li><li>Mọi thứ khác (lệnh lạ hoặc viết thường, sai số từ) ⇒ <code>INVALID &lt;số dòng&gt;</code> (đếm từ 1).</li></ul>
<p><code>process</code> trả về số dòng kết quả bắt đầu bằng <code>OK</code>. Đóng cả hai tệp (try-with-resources). <em>Main cho sẵn ghi <code>commands.txt</code> theo TC, gọi <code>process("commands.txt", "result.txt")</code>, rồi in giá trị trả về và mọi dòng của <code>result.txt</code>.</em></p>`),
  starterCode: `import java.io.IOException;

public class CommandProcessor {
    // TODO: private fields to remember who holds which item

    public int process(String inputFile, String outputFile) throws IOException {
        // TODO: BufferedReader + PrintWriter in ONE try-with-resources,
        // count line numbers (blank lines too), skip blank lines,
        // BORROW / RETURN / COUNT / INVALID n, return how many lines start with OK
        return 0;
    }
}`,
  sampleSolution: doc('Q4', 'sol', 'CommandProcessor.java'),
  expectedOutput: mau([['Q4', 0, 0, 'TC 1 — commands: BORROW M001 B001 · BORROW M002 B002 · COUNT M001 · RETURN M001 B001 · RETURN M001 B002 · COUNT M001 · BORROW M002 B001 · COUNT M002'], ['Q4', 1, 0, 'TC 2 — BORROW M001 B001 · BORROW M001 B002 · (blank) · BORROW M001 T151 · BORROW M001 D181 · BORROW M002 B001 · borrow M002 B003 · RETURN M001 · COUNT M001 · PAY M001 5000 · RETURN M001 B001 · BORROW M002 B001 · COUNT M002'], ['Q4', 2, 0, 'TC 3 — COUNT M009 · RETURN M009 B009 · "BORROW   M003   B010" · COUNT m003 · RETURN M003 b010 · COUNT M003']]),
  explanation: B(
    `<p><strong>One map is enough.</strong> <code>HashMap&lt;String, String&gt;</code> item → member answers both questions: "is the item busy?" is <code>containsKey(item)</code>, "does THIS member hold it?" is <code>member.equals(map.get(item))</code> (write it that way round: <code>map.get</code> may return <code>null</code>). The count of a member is the number of values equal to the member.</p><p><strong>Order of the checks</strong> is part of the spec: BUSY before LIMIT. In TC 2 M001 holds three items when <code>BORROW M002 B001</code> arrives — B001 is busy, so the answer is <code>BUSY B001</code>, not a limit.</p><p><strong>Line numbers count blank lines.</strong> TC 2 has a blank line 3, so <code>borrow M002 B003</code> (lower-case command) is <code>INVALID 7</code> and <code>PAY M001 5000</code> is <code>INVALID 10</code>. Increase the counter BEFORE the <code>continue</code> that skips a blank line.</p><p><strong>Files.</strong> Open the reader and the writer in ONE try-with-resources: the writer is flushed and closed even when something throws, so <code>result.txt</code> is complete when Main reads it — forget to close a PrintWriter and the file can stay empty (Lab 9 trap). Real output of TC 2:</p><pre>${esc(out('Q4', 1, 0))}</pre>`,
    `<p><strong>Một map là đủ.</strong> <code>HashMap&lt;String, String&gt;</code> tài liệu → thành viên trả lời cả hai câu hỏi: "tài liệu có đang bận?" là <code>containsKey(item)</code>, "thành viên NÀY có giữ nó?" là <code>member.equals(map.get(item))</code> (viết theo chiều đó: <code>map.get</code> có thể trả <code>null</code>). Số tài liệu của một thành viên là số giá trị bằng mã thành viên đó.</p><p><strong>Thứ tự kiểm</strong> là một phần của đặc tả: BUSY trước LIMIT. Ở TC 2, M001 đang giữ ba tài liệu khi tới <code>BORROW M002 B001</code> — B001 đang bận, nên trả lời là <code>BUSY B001</code>, không phải hạn mức.</p><p><strong>Số dòng có tính dòng trống.</strong> TC 2 có dòng 3 trống, nên <code>borrow M002 B003</code> (lệnh viết thường) là <code>INVALID 7</code> và <code>PAY M001 5000</code> là <code>INVALID 10</code>. Tăng bộ đếm TRƯỚC lệnh <code>continue</code> bỏ dòng trống.</p><p><strong>Tệp.</strong> Mở reader và writer trong MỘT try-with-resources: writer được đẩy hết và đóng kể cả khi có lỗi, nên <code>result.txt</code> đủ khi Main đọc — quên đóng PrintWriter là tệp có thể trống trơn (bẫy của Lab 9). Output thật của TC 2:</p><pre>${esc(out('Q4', 1, 0))}</pre>`),
  rubric: [
    { id: 'io', criterion: B('Reads with BufferedReader and writes with PrintWriter/FileWriter, both closed (try-with-resources), one result line per non-blank line, returns the number of OK lines.', 'Đọc bằng BufferedReader, ghi bằng PrintWriter/FileWriter, cả hai được đóng (try-with-resources), mỗi dòng không trống một dòng kết quả, trả về số dòng OK.'), weight: 1, maxScore: 0.75 },
    { id: 'borrow_return', criterion: B('BORROW checks BUSY before LIMIT (3 items); RETURN only succeeds for the member who holds the item; COUNT prints "<memberId> <n>".', 'BORROW kiểm BUSY trước LIMIT (3 tài liệu); RETURN chỉ thành công với đúng người đang giữ; COUNT in "<mãTV> <n>".'), weight: 1, maxScore: 1.25 },
    { id: 'parsing', criterion: B('Splits on one or more spaces, upper-cases ids, keeps the command word case-sensitive, reports INVALID with the right 1-based line number counting blank lines.', 'Tách theo một hay nhiều dấu cách, viết hoa mã, giữ phân biệt hoa thường ở từ lệnh, báo INVALID đúng số dòng (đếm từ 1, có tính dòng trống).'), weight: 1, maxScore: 1 },
  ],
};

// exam-check.mjs chỉ chạy được node/bash: câu Java khai LÝ DO miễn chạy (bộ chấm thật ở flm-nguon)
const MIEN = 'Java NetBeans + harness Main.class — đã chấm THẬT bằng flm-nguon PRO192/gen/de/da1/cham.mjs (lời giải 10/10, khung rỗng 0/10, JDK 8 thật trùng)';
for (const q of [q1, q2, q3, q4]) q.khongChayDuoc = MIEN;

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [{
    kind: 'PE', peType: 'CODE', code: 'DA1',
    title: B('PRO192 — Final project CT Library 1.0: timed PE paper (90′, self-authored)', 'PRO192 — Dự án cuối khoá CT Library 1.0: bản thi có giờ kiểu PE (90′, đề tự soạn)'),
    description: B(
      'The timed part of the course final project (NOT a real school paper): 4 questions, 10 marks, 90 minutes on the CT Library domain — Book/SpecBook (inheritance through private fields), LoanList extends ArrayList<Loan> (tie, ignore-case, safe removal), a given ICode interface over item codes (regex, split, order-preserving move), and a command-file processor (BufferedReader/PrintWriter, line numbers, BUSY/LIMIT/NOT_FOUND/INVALID). Real NetBeans given materials with compiled harness; every sample output comes from running the solution; the marking tool gives the solution 10/10 and an empty skeleton 0/10.',
      'Phần thi có giờ của dự án cuối khoá (KHÔNG phải đề thật của trường): 4 câu, 10 điểm, 90 phút trên domain CT Library — Book/SpecBook (kế thừa qua trường private), LoanList extends ArrayList<Loan> (bằng nhau, không phân biệt hoa thường, xoá an toàn), interface ICode cho sẵn trên mã tài liệu (regex, split, dời giữ thứ tự), và bộ xử lý tệp lệnh (BufferedReader/PrintWriter, số dòng, BUSY/LIMIT/NOT_FOUND/INVALID). Given NetBeans thật kèm harness đã biên dịch; mọi output mẫu lấy từ chạy lời giải; bộ chấm cho lời giải 10/10, khung rỗng 0/10.'),
    durationMinutes: 90, totalPoints: 10, passMark: 5, source: 'SAMPLE', isPublished: true,
    instructions, attachmentUrl: ATTACHMENT_URL,
    attachmentName: B('Download given materials (Q1-Q4, NetBeans projects with compiled harness)', 'Tải given materials (Q1-Q4, project NetBeans kèm harness đã biên dịch)'),
    questions: [q1, q2, q3, q4],
  }],
};

const total = spec.exams[0].questions.reduce((s, q) => s + q.points, 0);
if (total !== spec.exams[0].totalPoints) throw new Error(`points ${total} ≠ 10`);
for (const q of spec.exams[0].questions) {
  const r = q.rubric.reduce((s, x) => s + x.maxScore, 0);
  if (Math.abs(r - q.points) > 1e-9) throw new Error(`rubric ${r} ≠ ${q.points}`);
}
fs.writeFileSync(OUT, `// AUTO-GENERATED by scripts/build-pro192-da1.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)} (${total} points, ${spec.exams[0].questions.length} questions)`);
