/**
 * PRO192 · Thi cuối kỳ — 🎯 Luyện PE theo dạng đề thật.
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { bi } from './_slides.mjs';

/* ───────── 🎯 PE drill 1 — the 19 Exam Room papers mapped, and type 1: one class from a UML box (question 1) ───────── */
const L_x_luyen_pe_1 = {
  title: '🎯 PE drill 1 — the 19 Exam Room papers mapped, and type 1: one class from a UML box (question 1)|||🎯 Luyện PE PRO192 1 — bản đồ 19 đề Exam Room và dạng 1: một lớp từ hộp UML (câu 1)',
  slug: 'pro192-luyen-pe-1',
  type: 'VIDEO',
  description: 'Bài luyện thi thực hành tự thêm (1/4): đọc cả 19 đề PE PRO192 trên Exam Room (14 đề thật, 5 đề nâng cao) để rút ra bốn dạng câu lặp lại, cách một câu PE vận hành (project given, Main.class hỏi dữ liệu rồi in OUTPUT:, máy chấm tự động, nộp run/src), rồi đi sâu dạng 1 — một lớp từ hộp UML: mẹo đọc đề, khung code, giải ba đề thật (PE1 CoffeeShop, PE10 Student, PE14 Person) bằng code chạy thật trên JDK 8 với bản dựng lại Main.class và máy chấm thu nhỏ, mười ba lỗi mất điểm đo thật (viết hoa sai, biên >=, dấu cách, chia nguyên, == trên chuỗi, Locale, NoSuchMethodError, package, String.repeat), kế hoạch 85 phút và danh sách kiểm trước khi nộp.',
  content: [
    bi(`<span class="eyebrow">Final Exam · 🎯 PE drill 1 of 4 · added by this site</span>
<h2>Nineteen papers, four shapes — and the first shape: one class from a UML box</h2>
<p class="lead">The Practical Exam is <strong>30% of PRO192</strong> and must be above 0: one sitting, <strong>85 minutes</strong> by the syllabus (the Exam Room timer allows 90), NetBeans 8.2 or later with <strong>JDK 8</strong>, marked by software. Before writing this course we read all 19 PRO192 papers in the Exam Room — 14 real papers and 5 advanced ones written for practice — question by question: prompt, starter code, sample runs, rubric, and the compiled <code>Main.class</code> of every given project. The papers are not random. They repeat <strong>four shapes</strong>, and a student who has typed each shape a few times walks in with most of the code already in their fingers.</p>
<p>These four lessons take one shape each: <strong>1</strong> — one class from a UML box (this lesson); <strong>2</strong> — a class and its "Spec" subclass; <strong>3</strong> — f1/f2/f3 on a list of objects; <strong>4</strong> — String tools, plus the 10-mark one-question paper that reads and writes files. Each lesson: anatomy of the shape → reading tips → a code frame → three real papers solved with code of our own, run on JDK 8 against a rebuilt harness → the mistakes that lose marks, each measured → a time plan and a checklist.</p>`,
    `<span class="eyebrow">Thi cuối kỳ · 🎯 Luyện PE 1/4 · phần web tự thêm</span>
<h2>Mười chín đề, bốn dạng — và dạng đầu tiên: một lớp từ hộp UML</h2>
<p class="lead">Thi thực hành (PE — Practical Exam) chiếm <strong>30% điểm PRO192</strong> và phải lớn hơn 0: một buổi, <strong>85 phút</strong> theo đề cương (đồng hồ của Exam Room cho 90 phút), NetBeans 8.2 trở lên với <strong>JDK 8</strong>, chấm bằng phần mềm. Trước khi soạn phần này, chúng tôi đã đọc cả 19 đề PRO192 trong Exam Room — 14 đề thật và 5 đề nâng cao soạn để luyện — từng câu một: đề bài, code khởi đầu, các lần chạy mẫu, thang chấm (rubric), và file <code>Main.class</code> đã biên dịch của mọi project given (bộ tài liệu đề cho). Đề không ngẫu nhiên. Chúng lặp lại <strong>bốn dạng</strong>, và ai đã gõ mỗi dạng vài lần thì bước vào phòng thi với phần lớn code đã nằm sẵn trong tay.</p>
<p>Bốn bài này, mỗi bài một dạng: <strong>1</strong> — một lớp từ hộp UML (bài này); <strong>2</strong> — lớp cha và lớp con "Spec"; <strong>3</strong> — f1/f2/f3 trên một danh sách đối tượng; <strong>4</strong> — xử lý chuỗi, kèm đề một câu 10 điểm đọc–ghi file. Mỗi bài gồm: phân tích dạng → mẹo đọc đề → khung code → giải ba đề thật bằng code tự viết, chạy trên JDK 8 với harness dựng lại → những lỗi làm mất điểm, lỗi nào cũng đo thật → kế hoạch thời gian và danh sách kiểm trước khi nộp.</p>`),
    bi(`<h2>1. The map — every paper, every question, which shape</h2>
<p>All papers are in the <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE</a>. "PE1" … "PE14" below are the Exam Room numbers; marks in brackets.</p>
<table>
<thead><tr><th>Paper</th><th>Q1 — type 1</th><th>Q2 — type 2</th><th>Q3 — type 3</th><th>Q4 — type 4</th></tr></thead>
<tbody>
<tr><td>PE1 SP26</td><td>CoffeeShop (2)</td><td>Screen / OLEDScreen (3)</td><td>Employee + EmployeeList extends ArrayList (2)</td><td>IStringNumberTool: acronym, decimal → binary (3)</td></tr>
<tr><td>PE2 SP25</td><td>Book (2)</td><td>Employee / Manager: setData, getValue (3)</td><td>IEmployeeManagement f1/f2/f3 (3)</td><td>IStringProcessor: vowels, longest word (2)</td></tr>
<tr><td>PE4 SU26</td><td>Camel (2)</td><td>Cala / SpecCala (3)</td><td>Ticket + TicketList extends ArrayList (2)</td><td>IString: odd digits, first palindrome (3)</td></tr>
<tr><td>PE6 SU25</td><td>Water (2)</td><td>Wine / SpecWine (3)</td><td>IWine f1/f2/f3 (3)</td><td>IString: most frequent letter, reverse upper-case runs (2)</td></tr>
<tr><td>PE7 FA25</td><td>Employee: salary by position (2)</td><td>NetworkDevice / Router (3)</td><td>SimCard + SimCardList extends ArrayList (2)</td><td>write IStringUtilities yourself + MyUtilities (3)</td></tr>
<tr><td>PE8 SP25</td><td>Suitcase (2)</td><td>Employee / Professor (3)</td><td>Watch + WatchList extends ArrayList (2)</td><td>IUtilities: longest word, average of even digits (3)</td></tr>
<tr><td>PE10 FA25</td><td>Student (2)</td><td>Car / SpecCar (3)</td><td>IBook f1/f2/f3 (3)</td><td>IFile: extension, new file name (2)</td></tr>
<tr><td>PE11 SU26</td><td>Coral: drop the last character (2)</td><td>Ladder / SpecLadder (3)</td><td>ILadder f1/f2/f3 (3)</td><td>IString: digits + lower case (2)</td></tr>
<tr><td>PE12 SU26</td><td>Coral: drop the first character (2)</td><td>SpecLadder, mirrored rules (3)</td><td>ILadder, same as PE11 (3)</td><td>IString, same as PE11 (2)</td></tr>
<tr><td>PE13 SU26</td><td>Coral, as PE12 (2)</td><td>SpecLadder, as PE12 (3)</td><td>ILadder, same as PE11 (3)</td><td>IString, mirrored rules (2)</td></tr>
<tr><td>PE14 SU26</td><td>Person (2)</td><td>Chair / SpecChair (3)</td><td>IShoes f1/f2/f3 (3)</td><td>ILink: dots and upper case (2)</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Paper</th><th>Format</th><th>What it asks</th></tr></thead>
<tbody>
<tr><td>PE3 SP26</td><td>ONE question, 10 marks</td><td>interface ISmartDevice + abstract Device + SmartPhone; Q1 reads input.txt (add, print, search, check, sort, clear), writes output.txt</td></tr>
<tr><td>PE5 SU25</td><td>ONE question, 10 marks</td><td>abstract Task + WorkTask, PersonalTask; Q1 runs Work / Personal / Done / PrintAll / PrintByType from input.txt</td></tr>
<tr><td>PE9 FA25</td><td>ONE question, 10 marks (4 parts in the Exam Room)</td><td>interface EmployeeManagement + Employee implements Comparable + an in-memory store; Q1 runs Add / Update / Print / Sort / Clear</td></tr>
<tr><td>PE-ADV1–5</td><td>4 questions, written for practice (not school papers)</td><td>abstract classes + checked exceptions · Comparable / Comparator · generics with bounds · static counters + equals/hashCode · composition + your own Iterator</td></tr>
</tbody>
</table>
<p>Counted over the 11 four-question papers: type 1 appears in <strong>11 of 11</strong>, type 2 in <strong>11 of 11</strong>, type 3 in 11 of 11 (7 times as "interface f1/f2/f3 on a <code>List</code>", 4 times as "<code>XxxList extends ArrayList</code>"), type 4 in 11 of 11 (10 times the interface is given, once you write it). The three 10-mark papers are the same four skills glued into one file-driven program — lesson 4 solves one.</p>
<div class="pitfall">Pages PE6 and PE10–PE14 once showed the interface as <code>f1(List t)</code>: the web page had eaten the <code>&lt;Wine&gt;</code>/<code>&lt;Ladder&gt;</code> as if it were an HTML tag (fixed now). The given <code>IWine.class</code> really says <code>f1(java.util.List&lt;Wine&gt;)</code> — we checked with <code>javap</code>. When the text and the given project disagree, <strong>the given project and the starter code are the truth</strong>.</div>`,
    `<h2>1. Bản đồ — mọi đề, mọi câu, thuộc dạng nào</h2>
<p>Mọi đề nằm trong <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE</a>. "PE1" … "PE14" dưới đây là số thứ tự trong Exam Room; số trong ngoặc là điểm.</p>
<table>
<thead><tr><th>Đề</th><th>Q1 — dạng 1</th><th>Q2 — dạng 2</th><th>Q3 — dạng 3</th><th>Q4 — dạng 4</th></tr></thead>
<tbody>
<tr><td>PE1 SP26</td><td>CoffeeShop (2)</td><td>Screen / OLEDScreen (3)</td><td>Employee + EmployeeList extends ArrayList (2)</td><td>IStringNumberTool: viết tắt, thập phân → nhị phân (3)</td></tr>
<tr><td>PE2 SP25</td><td>Book (2)</td><td>Employee / Manager: setData, getValue (3)</td><td>IEmployeeManagement f1/f2/f3 (3)</td><td>IStringProcessor: nguyên âm, từ dài nhất (2)</td></tr>
<tr><td>PE4 SU26</td><td>Camel (2)</td><td>Cala / SpecCala (3)</td><td>Ticket + TicketList extends ArrayList (2)</td><td>IString: chữ số lẻ, từ đối xứng đầu tiên (3)</td></tr>
<tr><td>PE6 SU25</td><td>Water (2)</td><td>Wine / SpecWine (3)</td><td>IWine f1/f2/f3 (3)</td><td>IString: chữ thường hay gặp nhất, đảo cụm chữ hoa (2)</td></tr>
<tr><td>PE7 FA25</td><td>Employee: lương theo chức vụ (2)</td><td>NetworkDevice / Router (3)</td><td>SimCard + SimCardList extends ArrayList (2)</td><td>tự viết IStringUtilities + MyUtilities (3)</td></tr>
<tr><td>PE8 SP25</td><td>Suitcase (2)</td><td>Employee / Professor (3)</td><td>Watch + WatchList extends ArrayList (2)</td><td>IUtilities: từ dài nhất, trung bình chữ số chẵn (3)</td></tr>
<tr><td>PE10 FA25</td><td>Student (2)</td><td>Car / SpecCar (3)</td><td>IBook f1/f2/f3 (3)</td><td>IFile: phần mở rộng, tên file mới (2)</td></tr>
<tr><td>PE11 SU26</td><td>Coral: bỏ ký tự cuối (2)</td><td>Ladder / SpecLadder (3)</td><td>ILadder f1/f2/f3 (3)</td><td>IString: chữ số + chữ thường (2)</td></tr>
<tr><td>PE12 SU26</td><td>Coral: bỏ ký tự đầu (2)</td><td>SpecLadder, luật soi gương (3)</td><td>ILadder, như PE11 (3)</td><td>IString, như PE11 (2)</td></tr>
<tr><td>PE13 SU26</td><td>Coral, như PE12 (2)</td><td>SpecLadder, như PE12 (3)</td><td>ILadder, như PE11 (3)</td><td>IString, luật soi gương (2)</td></tr>
<tr><td>PE14 SU26</td><td>Person (2)</td><td>Chair / SpecChair (3)</td><td>IShoes f1/f2/f3 (3)</td><td>ILink: dấu chấm và chữ hoa (2)</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Đề</th><th>Khuôn</th><th>Hỏi gì</th></tr></thead>
<tbody>
<tr><td>PE3 SP26</td><td>MỘT câu, 10 điểm</td><td>interface ISmartDevice + lớp trừu tượng Device + SmartPhone; Q1 đọc input.txt (add, print, search, check, sort, clear), ghi output.txt</td></tr>
<tr><td>PE5 SU25</td><td>MỘT câu, 10 điểm</td><td>lớp trừu tượng Task + WorkTask, PersonalTask; Q1 chạy Work / Personal / Done / PrintAll / PrintByType từ input.txt</td></tr>
<tr><td>PE9 FA25</td><td>MỘT câu, 10 điểm (Exam Room tách 4 phần)</td><td>interface EmployeeManagement + Employee implements Comparable + kho lưu trong bộ nhớ; Q1 chạy Add / Update / Print / Sort / Clear</td></tr>
<tr><td>PE-ADV1–5</td><td>4 câu, soạn để luyện (không phải đề trường)</td><td>lớp trừu tượng + checked exception · Comparable / Comparator · generics có cận · bộ đếm static + equals/hashCode · composition + Iterator tự viết</td></tr>
</tbody>
</table>
<p>Đếm trên 11 đề bốn câu: dạng 1 có mặt <strong>11/11</strong> đề, dạng 2 <strong>11/11</strong>, dạng 3 11/11 (7 lần là "interface f1/f2/f3 trên một <code>List</code>", 4 lần là "<code>XxxList extends ArrayList</code>"), dạng 4 11/11 (10 lần interface được cho sẵn, 1 lần tự viết). Ba đề 10 điểm chính là bốn kỹ năng đó dán lại thành một chương trình chạy theo file — bài 4 giải một đề.</p>
<div class="pitfall">Trang đề PE6 và PE10–PE14 từng hiện interface là <code>f1(List t)</code>: trang web đã "nuốt" mất <code>&lt;Wine&gt;</code>/<code>&lt;Ladder&gt;</code> vì tưởng là thẻ HTML (nay đã sửa). File <code>IWine.class</code> đề cho thật sự ghi <code>f1(java.util.List&lt;Wine&gt;)</code> — đã kiểm bằng <code>javap</code>. Khi chữ của đề và project given nói khác nhau, <strong>project given và code khởi đầu là sự thật</strong>.</div>`),
    bi(`<h2>2. How one question of a classic paper works</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/98562e358435010d3292bbc37bb7d08c09d988d9.svg" alt="One question, from the given project to the mark" loading="lazy" /><p class="chu-thich">🧩 One question, from the given project to the mark</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title A classic PRO192 PE question — from the given project to the mark
' Swimlanes: what you do, what the marking software does
|You (85 minutes)|
start
:Download the given materials\\n(one NetBeans project per question:\\nMain.class + maybe IXxx.class);
:Open Q1 in NetBeans, JDK 1.8;
:Write the class(es) from the UML box\\n— default package, exact names;
:Run (F6) with the paper's sample runs;
if (OUTPUT matches the sample?) then (yes)
else (no)
  :Fix, run again;
endif
:Clean and Build (Shift+F11)\\n→ dist/Q1.jar;
:Copy dist/*.jar → Q1/run\\nCopy the project → Q1/src;
:Submit Q1 in the PEA tool;
|Marking software|
:For each hidden test case:\\nrun the jar, pipe the input in;
:Compare what the jar prints\\nwith the expected output\\n(the paper's samples show the part after OUTPUT:);
:Mark from the test cases passed;
stop
@enduml</code></pre></details>
<p>Each question comes as its own NetBeans project. Inside <code>src</code> there is no <code>Main.java</code>, only <strong><code>Main.class</code></strong> — already compiled — and for questions 3 and 4 often an interface such as <code>IString.class</code>. You add your class(es) next to it. We opened the <code>Main.class</code> of every given project in the Exam Room (PE7 ships none) with <code>javap -c</code> (a JDK tool that prints what a .class file does); they all follow one pattern:</p>
<ol>
<li>ask for the data (<code>Enter name:</code>, <code>Enter price:</code> …) and build your object with it;</li>
<li>print a small menu and ask <code>Enter TC (1 or 2):</code> — TC = <strong>test case</strong>, which method to test;</li>
<li>print the line <code>OUTPUT:</code>, then the result of exactly one call of your code.</li>
</ol>
<p>The marking software runs your jar once per hidden test case, typing the input for you, and compares what comes out with the expected answer — the samples in the paper show the part after <code>OUTPUT:</code>. Consequences: your method names, parameter types and their order, and return types must be exactly what <code>Main.class</code> was compiled against (section 9 shows what happens otherwise), and every character you print after <code>OUTPUT:</code> counts.</p>
<p>Submission, from the instructions of paper PE1: for each question make two folders, <strong>run</strong> (the built <code>.jar</code>) and <strong>src</strong> (the whole project); "do not change the names of the folders/files … the marking software cannot find the executable (.jar) otherwise and the result will be 0".</p>`,
    `<h2>2. Một câu của đề kiểu kinh điển vận hành thế nào</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/98562e358435010d3292bbc37bb7d08c09d988d9.svg" alt="Một câu đề, từ project given tới điểm số" loading="lazy" /><p class="chu-thich">🧩 Một câu đề, từ project given tới điểm số</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title A classic PRO192 PE question — from the given project to the mark
' Làn: việc bạn làm, việc phần mềm chấm làm
|You (85 minutes)|
start
:Download the given materials\\n(one NetBeans project per question:\\nMain.class + maybe IXxx.class);
:Open Q1 in NetBeans, JDK 1.8;
:Write the class(es) from the UML box\\n— default package, exact names;
:Run (F6) with the paper's sample runs;
if (OUTPUT matches the sample?) then (yes)
else (no)
  :Fix, run again;
endif
:Clean and Build (Shift+F11)\\n→ dist/Q1.jar;
:Copy dist/*.jar → Q1/run\\nCopy the project → Q1/src;
:Submit Q1 in the PEA tool;
|Marking software|
:For each hidden test case:\\nrun the jar, pipe the input in;
:Compare what the jar prints\\nwith the expected output\\n(the paper's samples show the part after OUTPUT:);
:Mark from the test cases passed;
stop
@enduml</code></pre></details>
<p>Mỗi câu là một project NetBeans riêng. Trong <code>src</code> không có <code>Main.java</code>, chỉ có <strong><code>Main.class</code></strong> — đã biên dịch sẵn — và với câu 3, câu 4 thường có thêm một interface như <code>IString.class</code>. Bạn thêm (các) lớp của mình bên cạnh. Chúng tôi đã mở <code>Main.class</code> của mọi project given trong Exam Room (PE7 không có bộ given) bằng <code>javap -c</code> (công cụ của JDK in ra một file .class làm gì); tất cả theo cùng một khuôn:</p>
<ol>
<li>hỏi dữ liệu (<code>Enter name:</code>, <code>Enter price:</code> …) rồi tạo đối tượng của bạn từ đó;</li>
<li>in một menu nhỏ và hỏi <code>Enter TC (1 or 2):</code> — TC = <strong>test case</strong> (ca kiểm thử), tức là kiểm phương thức nào;</li>
<li>in dòng <code>OUTPUT:</code>, rồi kết quả của đúng một lời gọi vào code của bạn.</li>
</ol>
<p>Phần mềm chấm chạy file jar của bạn một lần cho mỗi test case ẩn, tự "gõ" dữ liệu vào, rồi so thứ in ra với đáp án — các mẫu trong đề cho thấy phần đứng sau <code>OUTPUT:</code>. Hệ quả: tên phương thức, kiểu và thứ tự tham số, kiểu trả về phải đúng y như thứ <code>Main.class</code> đã được biên dịch theo (mục 9 cho thấy chuyện gì xảy ra nếu không), và mọi ký tự bạn in sau <code>OUTPUT:</code> đều tính.</p>
<p>Nộp bài, theo hướng dẫn của đề PE1: mỗi câu tạo hai thư mục, <strong>run</strong> (file <code>.jar</code> đã build) và <strong>src</strong> (cả project); "không đổi tên thư mục/file … phần mềm chấm sẽ không tìm được file thực thi (.jar) và bài bị 0 điểm".</p>`),
    bi(`<h2>3. Type 1 — anatomy of question 1 (2 marks)</h2>
<p>A box with the fields and the methods, then one line of rules per method. The Exam Room's rubric for PE1 question 1 shows where the 2 marks go: fields + both constructors <strong>0.5</strong>, <code>getStoreName()</code> <strong>0.5</strong>, the two revenue rules <strong>0.7</strong>, the exact <code>toString()</code> format <strong>0.3</strong>. In other words, almost nothing is paid for typing fields — <strong>the marks sit in the "twist" of each method</strong>. The twists of all eleven papers:</p>
<table>
<thead><tr><th>Paper · class</th><th>The twists that carry the marks</th></tr></thead>
<tbody>
<tr><td>PE1 CoffeeShop</td><td>first letter upper, REST lower · <code>&gt;= 100</code> cups ×1.2 · <code>STORENAME:revenue</code> with 2 decimals</td></tr>
<tr><td>PE2 Book</td><td><code>getTitle()</code> upper case · <code>getPages()</code> returns pages / 2 (integer division intended)</td></tr>
<tr><td>PE4 Camel</td><td><code>getDesert()</code> upper case, the field stays as typed</td></tr>
<tr><td>PE6 Water</td><td>first + last character of source + volume · <code>setVolume(v)</code> = v × number of digits of v</td></tr>
<tr><td>PE7 Employee</td><td>salary by position, <strong>case-insensitive</strong> · <code>name,POSITION,salary</code> without spaces</td></tr>
<tr><td>PE8 Suitcase</td><td>three bands of maxWeight (<code>&gt;= 15</code>, <code>7 &lt; w &lt; 15</code>, <code>&lt;= 7</code>) · <code>id, NAME, capacity, maxWeight</code></td></tr>
<tr><td>PE10 Student</td><td><code>"pass"</code> if gpa <code>&gt;= 5.0</code> · <code>setName(lastname)</code>: the text and the sample disagree (section 7)</td></tr>
<tr><td>PE11 / PE12 Coral</td><td>drop the LAST character / drop the FIRST character of name</td></tr>
<tr><td>PE14 Person</td><td><code>getName()</code> upper case but <code>toString()</code> raw · <code>setSickLeave(up)</code> ADDS</td></tr>
</tbody>
</table>`,
    `<h2>3. Dạng 1 — giải phẫu câu 1 (2 điểm)</h2>
<p>Một hộp ghi các trường và phương thức, rồi mỗi phương thức một dòng luật. Rubric của Exam Room cho câu 1 đề PE1 cho thấy 2 điểm nằm ở đâu: trường + hai constructor <strong>0,5</strong>, <code>getStoreName()</code> <strong>0,5</strong>, hai luật doanh thu <strong>0,7</strong>, đúng định dạng <code>toString()</code> <strong>0,3</strong>. Nói cách khác, gõ trường gần như không được trả điểm — <strong>điểm nằm ở "cú xoắn" (twist) của từng phương thức</strong>. Các cú xoắn của cả mười một đề:</p>
<table>
<thead><tr><th>Đề · lớp</th><th>Những cú xoắn mang điểm</th></tr></thead>
<tbody>
<tr><td>PE1 CoffeeShop</td><td>chữ đầu hoa, PHẦN CÒN LẠI thường · <code>&gt;= 100</code> cốc nhân 1.2 · <code>STORENAME:revenue</code> với 2 chữ số thập phân</td></tr>
<tr><td>PE2 Book</td><td><code>getTitle()</code> viết hoa · <code>getPages()</code> trả pages / 2 (cố ý chia nguyên)</td></tr>
<tr><td>PE4 Camel</td><td><code>getDesert()</code> viết hoa, trường vẫn giữ như đã nhập</td></tr>
<tr><td>PE6 Water</td><td>ký tự đầu + ký tự cuối của source + volume · <code>setVolume(v)</code> = v × số chữ số của v</td></tr>
<tr><td>PE7 Employee</td><td>lương theo chức vụ, <strong>không phân biệt hoa thường</strong> · <code>name,POSITION,salary</code> không dấu cách</td></tr>
<tr><td>PE8 Suitcase</td><td>ba khoảng maxWeight (<code>&gt;= 15</code>, <code>7 &lt; w &lt; 15</code>, <code>&lt;= 7</code>) · <code>id, NAME, capacity, maxWeight</code></td></tr>
<tr><td>PE10 Student</td><td><code>"pass"</code> nếu gpa <code>&gt;= 5.0</code> · <code>setName(lastname)</code>: chữ của đề và mẫu nói khác nhau (mục 7)</td></tr>
<tr><td>PE11 / PE12 Coral</td><td>bỏ ký tự CUỐI / bỏ ký tự ĐẦU của name</td></tr>
<tr><td>PE14 Person</td><td><code>getName()</code> viết hoa nhưng <code>toString()</code> giữ nguyên · <code>setSickLeave(up)</code> CỘNG THÊM</td></tr>
</tbody>
</table>`),
    bi(`<h2>4. Reading the paper — words that decide the output</h2>
<table>
<thead><tr><th>The paper says</th><th>Write</th></tr></thead>
<tbody>
<tr><td>"return X in uppercase"</td><td>upper-case only the <strong>returned</strong> value: <code>return name.toUpperCase();</code> — the field keeps what was typed</td></tr>
<tr><td>"first letter capitalized, rest lowercase"</td><td><code>Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase()</code> — one capital for the whole string</td></tr>
<tr><td>"&gt;= 100", "greater than or equal" / "greater than"</td><td><code>&gt;=</code> / <code>&gt;</code> — then test the boundary value itself (100)</td></tr>
<tr><td>"formatted with two decimal places"</td><td><code>String.format("%.2f", x)</code>, only for that value</td></tr>
<tr><td>"Do not format the result"</td><td>print the raw value: <code>name + "," + sickLeave</code> gives <code>6.5</code>, not <code>6.50</code></td></tr>
<tr><td>"format: name, gpa" · "no space after comma"</td><td>copy the punctuation character by character</td></tr>
<tr><td>"case-insensitive" / "case-sensitive"</td><td><code>equalsIgnoreCase</code> / <code>equals</code> — never <code>==</code> for Strings</td></tr>
<tr><td>"update x = new x * n"</td><td>read the formula, not the method name (<code>setSickLeave</code> ADDS in PE14)</td></tr>
<tr><td>+Xxx() in the box</td><td>write the default constructor even if Main never calls it — the rubric does</td></tr>
</tbody>
</table>
<p class="meo">🧠 The <strong>sample runs are part of the specification</strong>. Before coding, work out every sample by hand from the text. If the text cannot produce a sample, look for another reading that can (PE10, section 7). If no sensible reading can — PE7's sample for <code>getTotalAmount()</code> shows 220000.00 where quantity × final price = 20 × 1100.00 = 22000.00 — the sample is probably a typo: follow the formula and note it in a comment.</p>`,
    `<h2>4. Đọc đề — những chữ quyết định output</h2>
<table>
<thead><tr><th>Đề viết</th><th>Hãy viết</th></tr></thead>
<tbody>
<tr><td>"return X in uppercase"</td><td>chỉ viết hoa giá trị <strong>trả về</strong>: <code>return name.toUpperCase();</code> — trường vẫn giữ chữ đã nhập</td></tr>
<tr><td>"first letter capitalized, rest lowercase"</td><td><code>Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase()</code> — một chữ hoa cho cả chuỗi</td></tr>
<tr><td>"&gt;= 100", "greater than or equal" / "greater than"</td><td><code>&gt;=</code> / <code>&gt;</code> — rồi thử chính giá trị biên (100)</td></tr>
<tr><td>"formatted with two decimal places"</td><td><code>String.format("%.2f", x)</code>, chỉ cho giá trị đó</td></tr>
<tr><td>"Do not format the result"</td><td>in giá trị thô: <code>name + "," + sickLeave</code> ra <code>6.5</code>, không phải <code>6.50</code></td></tr>
<tr><td>"format: name, gpa" · "no space after comma"</td><td>chép dấu câu từng ký tự</td></tr>
<tr><td>"case-insensitive" / "case-sensitive"</td><td><code>equalsIgnoreCase</code> / <code>equals</code> — không bao giờ <code>==</code> với String</td></tr>
<tr><td>"update x = new x * n"</td><td>đọc công thức, đừng đọc tên phương thức (<code>setSickLeave</code> ở PE14 là CỘNG)</td></tr>
<tr><td>+Xxx() trong hộp</td><td>viết constructor mặc định dù Main không gọi — rubric thì có chấm</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Các lần chạy mẫu là một phần của đề</strong>. Trước khi gõ code, tự tính tay mọi mẫu từ chữ của đề. Nếu chữ của đề không ra được mẫu, hãy tìm cách hiểu khác ra được (PE10, mục 7). Nếu không cách hiểu hợp lý nào ra được — mẫu của PE7 cho <code>getTotalAmount()</code> ghi 220000.00 trong khi quantity × final price = 20 × 1100.00 = 22000.00 — thì nhiều khả năng mẫu gõ nhầm: làm theo công thức và ghi chú lại trong code.</p>`),
    bi(`<h2>5. The frame — type it until it takes three minutes</h2>
<pre><code class="language-java">public class Xxx {                        // the name in the box, default package (no "package" line)
    private int a;                        // fields: names and types copied from the box
    private String b;

    public Xxx() {                        // +Xxx() is in the box: write it
    }

    public Xxx(int a, String b) {         // parameters in the ORDER of the box
        this.a = a;
        this.b = b;
    }

    public String getB() {                // the twist goes into what is RETURNED
        return b.toUpperCase();
    }

    public void setA(int a) {             // or the formula the paper gives
        this.a = a;
    }

    @Override
    public String toString() {            // the punctuation of the paper, character by character
        return b + "," + a;
    }
}</code></pre>
<p>NetBeans writes the boring half for you: put the cursor inside the class, <strong>Alt+Insert</strong> → Constructor (tick all fields), Getter and Setter, <code>toString()</code>. Then edit only the methods that have a twist. A 2-mark question should take <strong>about 12 minutes</strong>: 3 to read and compute the samples by hand, 4 to type, 5 to run every sample.</p>`,
    `<h2>5. Khung code — gõ tới khi chỉ mất ba phút</h2>
<pre><code class="language-java">public class Xxx {                        // tên trong hộp, default package (không có dòng "package")
    private int a;                        // trường: tên và kiểu chép từ hộp
    private String b;

    public Xxx() {                        // hộp có +Xxx(): phải viết
    }

    public Xxx(int a, String b) {         // tham số theo đúng THỨ TỰ trong hộp
        this.a = a;
        this.b = b;
    }

    public String getB() {                // cú xoắn nằm ở thứ được TRẢ VỀ
        return b.toUpperCase();
    }

    public void setA(int a) {             // hoặc công thức đề cho
        this.a = a;
    }

    @Override
    public String toString() {            // dấu câu của đề, từng ký tự
        return b + "," + a;
    }
}</code></pre>
<p>NetBeans viết hộ nửa nhàm chán: đặt con trỏ trong lớp, <strong>Alt+Insert</strong> → Constructor (tích mọi trường), Getter and Setter, <code>toString()</code>. Rồi chỉ sửa những phương thức có cú xoắn. Một câu 2 điểm nên mất <strong>khoảng 12 phút</strong>: 3 phút đọc và tính tay các mẫu, 4 phút gõ, 5 phút chạy mọi mẫu.</p>`),
    bi(`<h2>6. Solved paper 1 — PE1 (SP26) question 1: CoffeeShop</h2>
<p>Paper: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 1 (SP26)</a>, question 1. Write <code>CoffeeShop</code> with the box below; <code>getStoreName()</code> — first letter capitalized, rest lowercase; <code>getTotalRevenue()</code> — price × cups, ×1.2 when cups <code>&gt;= 100</code>; <code>getProfitRevenue(costPerCup)</code> — revenue minus cost × cups; <code>toString()</code> — the store name in upper case, a colon, the revenue with 2 decimals.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/5ee2e9d38fba921f789aa7084fc3e284986ffcf6.svg" alt="PE1 question 1: the class you write and the given Main.class that drives it" loading="lazy" /><p class="chu-thich">🧩 PE1 question 1: the class you write and the given Main.class that drives it</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title PE1 question 1 — you write CoffeeShop, the paper gives Main.class
class CoffeeShop {
  - id : int
  - storeName : String
  - pricePerCup : double
  - numberOfCups : int
  --
  + CoffeeShop()
  + CoffeeShop(id, storeName, pricePerCup, numberOfCups)
  + getStoreName() : String
  + getTotalRevenue() : double
  + getProfitRevenue(costPerCup : double) : double
  + toString() : String
}
class Main &lt;&lt;given .class&gt;&gt; {
  + {static} main(args : String[]) : void
}
Main ..&gt; CoffeeShop : new CoffeeShop(...)\\ncalls one method per TC
note right of Main
  reads 4 values, then "Enter TC(1|2|3|4):"
  prints OUTPUT: then the result
  (it formats doubles itself with %.2f)
end note
@enduml</code></pre></details>
<p>Before typing, the four samples by hand: 3.5 × 50 = <strong>175.00</strong> (under 100 cups); "passio Coffee" → <strong>Passio coffee</strong> (the C becomes small!); 5.5 × 120 × 1.2 − 1.5 × 120 = 792 − 180 = <strong>612.00</strong>; 6.0 × 200 × 1.2 = 1440 → <strong>BREW HAVEN:1440.00</strong>.</p>
<details><summary>Solution (our own code, run on JDK 8)</summary>
<pre class="trich"><code class="language-java">class CoffeeShop {
    private int id;
    private String storeName;
    private double pricePerCup;
    private int numberOfCups;

    public CoffeeShop() {                                    // +CoffeeShop(): the box lists it, so write it even if Main never calls it
    }

    public CoffeeShop(int id, String storeName, double pricePerCup, int numberOfCups) {
        this.id = id;
        this.storeName = storeName;
        this.pricePerCup = pricePerCup;
        this.numberOfCups = numberOfCups;
    }

    // "first letter capitalized, rest lowercase" — ONE capital letter for the whole name, not one per word
    public String getStoreName() {
        if (storeName == null || storeName.isEmpty()) {
            return storeName;                                // never crash on an empty name
        }
        return Character.toUpperCase(storeName.charAt(0)) + storeName.substring(1).toLowerCase();
    }

    // "&gt;= 100" is written in the paper: 100 cups already get the x1.2
    public double getTotalRevenue() {
        double revenue = pricePerCup * numberOfCups;
        if (numberOfCups &gt;= 100) {
            revenue = revenue * 1.2;
        }
        return revenue;
    }

    // reuse getTotalRevenue() instead of copying its rule a second time
    public double getProfitRevenue(double costPerCup) {
        return getTotalRevenue() - costPerCup * numberOfCups;
    }

    // STORENAME:revenue — the WHOLE name upper-cased, a colon, no spaces, 2 decimals
    @Override
    public String toString() {
        return storeName.toUpperCase() + ":" + String.format("%.2f", getTotalRevenue());
    }
}</code></pre>
<p>Decisions worth a sentence each: the empty-name guard costs one line and turns a possible <code>StringIndexOutOfBoundsException</code> into a harmless return; <code>getProfitRevenue</code> <em>calls</em> <code>getTotalRevenue()</code> so the 1.2 rule lives in one place; <code>toString()</code> upper-cases the whole field, unlike <code>getStoreName()</code> — two different views of one field, both straight from the text.</p>
</details>
<p>To run it the way the marker does, we rebuilt the given <code>Main.class</code> from its byte code — same prompts (with their trailing space), same reads (<code>nextLine()</code> + <code>Integer.parseInt</code>), same prints. Note that Main formats the doubles itself (<code>printf("%.2f\\n", …)</code>): your <code>getTotalRevenue()</code> returns a plain double.</p>
<pre class="trich"><code class="language-java">// Stand-in for the given Main.class, rebuilt from its byte code (javap -c): same prompts, same reads, same prints
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter id: ");
        int id = Integer.parseInt(sc.nextLine());
        System.out.print("Enter store name: ");
        String storeName = sc.nextLine();
        System.out.print("Enter price per cup: ");
        double price = Double.parseDouble(sc.nextLine());
        System.out.print("Enter number of cups: ");
        int cups = Integer.parseInt(sc.nextLine());
        CoffeeShop shop = new CoffeeShop(id, storeName, price, cups);
        System.out.println("1. Test getTotalRevenue()");
        System.out.println("2. Test getStoreName()");
        System.out.println("3. Test getProfitRevenue()");
        System.out.println("4. Test toString()");
        System.out.print("Enter TC(1|2|3|4): ");
        int tc = Integer.parseInt(sc.nextLine());
        switch (tc) {
            case 1:
                System.out.println("OUTPUT:");
                System.out.printf("%.2f\\n", shop.getTotalRevenue());   // Main formats the double itself
                break;
            case 2:
                System.out.println("OUTPUT:");
                System.out.println(shop.getStoreName());
                break;
            case 3:
                System.out.print("Enter cost per cup: ");
                double cost = Double.parseDouble(sc.nextLine());
                System.out.println("OUTPUT:");
                System.out.printf("%.2f\\n", shop.getProfitRevenue(cost));
                break;
            case 4:
                System.out.println("OUTPUT:");
                System.out.println(shop);
                break;
            default:
                System.out.println("Invalid choice");
        }
        sc.close();
    }
}</code></pre>
<p>Then a <strong>mini marker</strong>: it reads the whole <code>.in</code> file with ONE <code>Scanner</code>, cuts it into runs at each <code># …</code> line, pipes each run into <code>Main.main</code> through <code>System.setIn</code>, and compares the text after <code>OUTPUT:</code> with the paper's sample. Its input file — the four samples of the paper plus one boundary test of our own (exactly 100 cups):</p>
<pre><code class="language-plaintext"># TC1 getTotalRevenue (paper sample 1)
1
Coffee World
3.5
50
1
# TC2 getStoreName (paper sample 2)
2
passio Coffee
4.0
150
2
# TC3 getProfitRevenue (paper sample 3)
3
orange bar bistro
5.5
120
3
1.5
# TC4 toString (paper sample 4)
4
brew haven
6.0
200
4
# TC1 again, own boundary test: exactly 100 cups
5
Phuc Long
3.5
100
1</code></pre>
<pre class="trich"><code class="language-java">// A mini marker: each "# ..." block of the .in file is ONE run, piped into Main like the grader does
public class PeQ1CoffeeShop {
    static final String[] MAU = {          // what the paper's sample table shows after OUTPUT:
        "175.00",
        "Passio coffee",
        "612.00",
        "BREW HAVEN:1440.00",
        "420.00",                          // own boundary test: exactly 100 cups, 3.5 x 100 x 1.2
    };

    public static void main(String[] args) throws Exception {
        chamCacLanChay(MAU);
    }</code></pre>
<div class="out">=== TC1 getTotalRevenue (paper sample 1) ===<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: 1. Test getTotalRevenue()<br>
2. Test getStoreName()<br>
3. Test getProfitRevenue()<br>
4. Test toString()<br>
Enter TC(1|2|3|4): OUTPUT:<br>
175.00<br>
-&gt; PASS<br>
=== TC2 getStoreName (paper sample 2) ===<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: 1. Test getTotalRevenue()<br>
2. Test getStoreName()<br>
3. Test getProfitRevenue()<br>
4. Test toString()<br>
Enter TC(1|2|3|4): OUTPUT:<br>
Passio coffee<br>
-&gt; PASS<br>
=== TC3 getProfitRevenue (paper sample 3) ===<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: 1. Test getTotalRevenue()<br>
2. Test getStoreName()<br>
3. Test getProfitRevenue()<br>
4. Test toString()<br>
Enter TC(1|2|3|4): Enter cost per cup: OUTPUT:<br>
612.00<br>
-&gt; PASS<br>
=== TC4 toString (paper sample 4) ===<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: 1. Test getTotalRevenue()<br>
2. Test getStoreName()<br>
3. Test getProfitRevenue()<br>
4. Test toString()<br>
Enter TC(1|2|3|4): OUTPUT:<br>
BREW HAVEN:1440.00<br>
-&gt; PASS<br>
=== TC1 again, own boundary test: exactly 100 cups ===<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: 1. Test getTotalRevenue()<br>
2. Test getStoreName()<br>
3. Test getProfitRevenue()<br>
4. Test toString()<br>
Enter TC(1|2|3|4): OUTPUT:<br>
420.00<br>
-&gt; PASS<br>
5/5 runs match the expected output</div>
<p>Look at how the screen looks when input is <strong>piped</strong> instead of typed: the prompts run together on one line, because the typed values (and their Enter) are not echoed. That is exactly what the marker sees — and why nothing before <code>OUTPUT:</code> can be "made pretty" by you. The fifth run is ours: at exactly 100 cups the rule <code>&gt;= 100</code> must already apply (3.5 × 100 × 1.2 = 420.00); with <code>&gt;</code> it would print 350.00 — section 9 measures it.</p>`,
    `<h2>6. Giải mẫu 1 — đề PE1 (SP26) câu 1: CoffeeShop</h2>
<p>Đề: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 1 (SP26)</a>, câu 1. Viết lớp <code>CoffeeShop</code> theo hộp dưới; <code>getStoreName()</code> — chữ đầu viết hoa, còn lại viết thường; <code>getTotalRevenue()</code> — giá × số cốc, nhân 1.2 khi số cốc <code>&gt;= 100</code>; <code>getProfitRevenue(costPerCup)</code> — doanh thu trừ chi phí × số cốc; <code>toString()</code> — tên cửa hàng viết hoa, dấu hai chấm, doanh thu 2 chữ số thập phân.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/5ee2e9d38fba921f789aa7084fc3e284986ffcf6.svg" alt="Câu 1 đề PE1: lớp bạn viết và Main.class đề cho điều khiển nó" loading="lazy" /><p class="chu-thich">🧩 Câu 1 đề PE1: lớp bạn viết và Main.class đề cho điều khiển nó</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title PE1 question 1 — you write CoffeeShop, the paper gives Main.class
class CoffeeShop {
  - id : int
  - storeName : String
  - pricePerCup : double
  - numberOfCups : int
  --
  + CoffeeShop()
  + CoffeeShop(id, storeName, pricePerCup, numberOfCups)
  + getStoreName() : String
  + getTotalRevenue() : double
  + getProfitRevenue(costPerCup : double) : double
  + toString() : String
}
class Main &lt;&lt;given .class&gt;&gt; {
  + {static} main(args : String[]) : void
}
Main ..&gt; CoffeeShop : new CoffeeShop(...)\\ncalls one method per TC
note right of Main
  reads 4 values, then "Enter TC(1|2|3|4):"
  prints OUTPUT: then the result
  (it formats doubles itself with %.2f)
end note
@enduml</code></pre></details>
<p>Trước khi gõ, tính tay bốn mẫu: 3.5 × 50 = <strong>175.00</strong> (dưới 100 cốc); "passio Coffee" → <strong>Passio coffee</strong> (chữ C thành chữ thường!); 5.5 × 120 × 1.2 − 1.5 × 120 = 792 − 180 = <strong>612.00</strong>; 6.0 × 200 × 1.2 = 1440 → <strong>BREW HAVEN:1440.00</strong>.</p>
<details><summary>Lời giải (code tự viết, chạy trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class CoffeeShop {
    private int id;
    private String storeName;
    private double pricePerCup;
    private int numberOfCups;

    public CoffeeShop() {                                    // hộp UML có nó thì viết, dù Main không gọi
    }

    public CoffeeShop(int id, String storeName, double pricePerCup, int numberOfCups) {
        this.id = id;
        this.storeName = storeName;
        this.pricePerCup = pricePerCup;
        this.numberOfCups = numberOfCups;
    }

    // "chữ đầu viết hoa, còn lại viết thường" — MỘT chữ hoa cho cả tên, không phải mỗi từ một chữ
    public String getStoreName() {
        if (storeName == null || storeName.isEmpty()) {
            return storeName;                                // tên rỗng thì trả nguyên, không sập
        }
        return Character.toUpperCase(storeName.charAt(0)) + storeName.substring(1).toLowerCase();
    }

    // đề ghi "&gt;= 100": đúng 100 cốc đã được nhân 1.2
    public double getTotalRevenue() {
        double revenue = pricePerCup * numberOfCups;
        if (numberOfCups &gt;= 100) {
            revenue = revenue * 1.2;
        }
        return revenue;
    }

    // dùng lại getTotalRevenue(), không chép luật lần hai
    public double getProfitRevenue(double costPerCup) {
        return getTotalRevenue() - costPerCup * numberOfCups;
    }

    // TÊN:doanh thu — CẢ tên viết hoa, dấu hai chấm, không dấu cách, 2 chữ số thập phân
    @Override
    public String toString() {
        return storeName.toUpperCase() + ":" + String.format("%.2f", getTotalRevenue());
    }
}</code></pre>
<p>Những quyết định đáng một câu giải thích: câu canh tên rỗng tốn một dòng nhưng biến một <code>StringIndexOutOfBoundsException</code> tiềm tàng thành một lần trả về vô hại; <code>getProfitRevenue</code> <em>gọi</em> <code>getTotalRevenue()</code> để luật nhân 1.2 chỉ nằm ở một chỗ; <code>toString()</code> viết hoa cả trường, khác <code>getStoreName()</code> — hai cách nhìn một trường, cả hai đều lấy thẳng từ chữ của đề.</p>
</details>
<p>Để chạy đúng như máy chấm, chúng tôi dựng lại <code>Main.class</code> đề cho từ byte code của nó — cùng lời nhắc (kể cả dấu cách cuối), cùng cách đọc (<code>nextLine()</code> + <code>Integer.parseInt</code>), cùng cách in. Để ý Main tự định dạng số double (<code>printf("%.2f\\n", …)</code>): <code>getTotalRevenue()</code> của bạn chỉ trả về một số double bình thường.</p>
<pre class="trich"><code class="language-java">// Bản thay cho Main.class đề cho, dựng lại từ byte code của nó (javap -c): cùng lời nhắc, cùng cách đọc, cùng cách in
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter id: ");
        int id = Integer.parseInt(sc.nextLine());
        System.out.print("Enter store name: ");
        String storeName = sc.nextLine();
        System.out.print("Enter price per cup: ");
        double price = Double.parseDouble(sc.nextLine());
        System.out.print("Enter number of cups: ");
        int cups = Integer.parseInt(sc.nextLine());
        CoffeeShop shop = new CoffeeShop(id, storeName, price, cups);
        System.out.println("1. Test getTotalRevenue()");
        System.out.println("2. Test getStoreName()");
        System.out.println("3. Test getProfitRevenue()");
        System.out.println("4. Test toString()");
        System.out.print("Enter TC(1|2|3|4): ");
        int tc = Integer.parseInt(sc.nextLine());
        switch (tc) {
            case 1:
                System.out.println("OUTPUT:");
                System.out.printf("%.2f\\n", shop.getTotalRevenue());   // Main tự định dạng số double
                break;
            case 2:
                System.out.println("OUTPUT:");
                System.out.println(shop.getStoreName());
                break;
            case 3:
                System.out.print("Enter cost per cup: ");
                double cost = Double.parseDouble(sc.nextLine());
                System.out.println("OUTPUT:");
                System.out.printf("%.2f\\n", shop.getProfitRevenue(cost));
                break;
            case 4:
                System.out.println("OUTPUT:");
                System.out.println(shop);
                break;
            default:
                System.out.println("Invalid choice");
        }
        sc.close();
    }
}</code></pre>
<p>Rồi một <strong>máy chấm thu nhỏ</strong>: nó đọc cả file <code>.in</code> bằng MỘT <code>Scanner</code>, cắt thành từng lần chạy ở mỗi dòng <code># …</code>, đổ từng lần vào <code>Main.main</code> qua <code>System.setIn</code>, và so phần chữ sau <code>OUTPUT:</code> với mẫu của đề. File dữ liệu của nó — bốn mẫu của đề cộng một ca kiểm biên tự thêm (đúng 100 cốc):</p>
<pre><code class="language-plaintext"># TC1 getTotalRevenue (paper sample 1)
1
Coffee World
3.5
50
1
# TC2 getStoreName (paper sample 2)
2
passio Coffee
4.0
150
2
# TC3 getProfitRevenue (paper sample 3)
3
orange bar bistro
5.5
120
3
1.5
# TC4 toString (paper sample 4)
4
brew haven
6.0
200
4
# TC1 again, own boundary test: exactly 100 cups
5
Phuc Long
3.5
100
1</code></pre>
<pre class="trich"><code class="language-java">// Máy chấm thu nhỏ: mỗi khối "# ..." trong file .in là MỘT lần chạy, đổ vào Main như máy chấm làm
public class PeQ1CoffeeShop {
    static final String[] MAU = {          // thứ bảng mẫu của đề in sau OUTPUT:
        "175.00",
        "Passio coffee",
        "612.00",
        "BREW HAVEN:1440.00",
        "420.00",                          // TC tự thêm ở biên: đúng 100 cốc, 3.5 x 100 x 1.2
    };

    public static void main(String[] args) throws Exception {
        chamCacLanChay(MAU);
    }</code></pre>
<div class="out">=== TC1 getTotalRevenue (paper sample 1) ===<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: 1. Test getTotalRevenue()<br>
2. Test getStoreName()<br>
3. Test getProfitRevenue()<br>
4. Test toString()<br>
Enter TC(1|2|3|4): OUTPUT:<br>
175.00<br>
-&gt; PASS<br>
=== TC2 getStoreName (paper sample 2) ===<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: 1. Test getTotalRevenue()<br>
2. Test getStoreName()<br>
3. Test getProfitRevenue()<br>
4. Test toString()<br>
Enter TC(1|2|3|4): OUTPUT:<br>
Passio coffee<br>
-&gt; PASS<br>
=== TC3 getProfitRevenue (paper sample 3) ===<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: 1. Test getTotalRevenue()<br>
2. Test getStoreName()<br>
3. Test getProfitRevenue()<br>
4. Test toString()<br>
Enter TC(1|2|3|4): Enter cost per cup: OUTPUT:<br>
612.00<br>
-&gt; PASS<br>
=== TC4 toString (paper sample 4) ===<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: 1. Test getTotalRevenue()<br>
2. Test getStoreName()<br>
3. Test getProfitRevenue()<br>
4. Test toString()<br>
Enter TC(1|2|3|4): OUTPUT:<br>
BREW HAVEN:1440.00<br>
-&gt; PASS<br>
=== TC1 again, own boundary test: exactly 100 cups ===<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: 1. Test getTotalRevenue()<br>
2. Test getStoreName()<br>
3. Test getProfitRevenue()<br>
4. Test toString()<br>
Enter TC(1|2|3|4): OUTPUT:<br>
420.00<br>
-&gt; PASS<br>
5/5 runs match the expected output</div>
<p>Nhìn màn hình khi dữ liệu được <strong>đổ qua pipe</strong> thay vì gõ tay: các lời nhắc dính liền trên một dòng, vì giá trị "gõ" vào (và phím Enter) không được in lại. Đó chính là thứ máy chấm thấy — và là lý do bạn không thể "làm đẹp" gì ở phần trước <code>OUTPUT:</code>. Lần chạy thứ năm là của chúng tôi: đúng 100 cốc thì luật <code>&gt;= 100</code> phải áp dụng rồi (3.5 × 100 × 1.2 = 420.00); viết <code>&gt;</code> sẽ in 350.00 — mục 9 đo điều đó.</p>`),
    bi(`<h2>7. Solved paper 2 — PE10 (FA25) question 1: Student, when the text and the sample disagree</h2>
<p>Paper: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 10 (FA25)</a>, question 1. <code>Student(name, gpa)</code>; <code>getPass()</code> — "pass" if gpa <code>&gt;= 5.0</code>, otherwise "fail"; <code>setName(lastname)</code> — "return the name with the first letter in uppercase"; <code>toString()</code> — "name, gpa". The sample: name <code>hoa</code>, gpa 5.4, TC 1, lastname <code>nguyen</code> → <strong><code>hoa nguyen, 5.4</code></strong>.</p>
<p>Compute it from the text and you get stuck twice. "Return" — but the box gives <code>setName</code> no return type, and the given <code>Main.class</code> calls <code>Student.setName:(Ljava/lang/String;)V</code> (<code>V</code> = void) and then prints <code>toString()</code>. "First letter in uppercase" — but there is no capital letter anywhere in the sample. The only reading that produces the sample: <strong>append the last name, change nothing else</strong>.</p>
<details><summary>Solution (run on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Student {
    private String name;
    private double gpa;

    public Student() {
    }

    public Student(String name, double gpa) {
        this.name = name;
        this.gpa = gpa;
    }

    // "&gt;= 5.0" ⇒ exactly 5.0 passes
    public String getPass() {
        return gpa &gt;= 5.0 ? "pass" : "fail";
    }

    // The text says "first letter in uppercase", the sample prints "hoa nguyen" — no capital anywhere.
    // The UML box gives setName no return type (void), Main ignores any result: append the last name, change nothing else.
    public void setName(String lastname) {
        this.name = this.name + " " + lastname;
    }

    // "name, gpa" with ", " and the raw double — "Do not format the result"
    @Override
    public String toString() {
        return name + ", " + gpa;
    }
}</code></pre>
<p>The comment in <code>setName</code> records <em>why</em> it ignores half of the sentence — if your lecturer reads the code, the reasoning is there. <code>toString()</code> concatenates the double as it is ("Do not format the result"): 5.4 prints as <code>5.4</code>, 5.0 would print as <code>5.0</code>.</p>
</details>
<pre class="trich"><code class="language-java">// Stand-in for the given Main.class (rebuilt with javap -c): nextDouble()/nextInt() each followed by nextLine()
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String lastname = "";
        System.out.print("Enter name: ");
        String name = sc.nextLine();
        System.out.print("Enter gpa: ");
        double gpa = sc.nextDouble();
        sc.nextLine();
        System.out.println("1. Test setName()");
        System.out.println("2. Test getPass()");
        System.out.print("Enter TC (1 or 2): ");
        int tc = sc.nextInt();
        sc.nextLine();
        Student st = new Student(name, gpa);
        if (tc == 1) {
            System.out.print("Enter lastname: ");
            lastname = sc.nextLine();
        }
        System.out.println("OUTPUT:");
        switch (tc) {
            case 1:
                st.setName(lastname);
                System.out.printf("%s\\r\\n", st.toString());          // \\r\\n: the given Main prints Windows line ends
                break;
            case 2:
                System.out.println(st.getPass());
                break;
        }
        System.out.println();
    }
}</code></pre>
<div class="out">=== TC1 setName (paper sample 1) ===<br>
Enter name: Enter gpa: 1. Test setName()<br>
2. Test getPass()<br>
Enter TC (1 or 2): Enter lastname: OUTPUT:<br>
hoa nguyen, 5.4<br>
-&gt; PASS<br>
=== TC2 getPass (paper sample 2) ===<br>
Enter name: Enter gpa: 1. Test setName()<br>
2. Test getPass()<br>
Enter TC (1 or 2): OUTPUT:<br>
fail<br>
-&gt; PASS<br>
=== TC2 again, own boundary test: gpa 5.0 ===<br>
Enter name: Enter gpa: 1. Test setName()<br>
2. Test getPass()<br>
Enter TC (1 or 2): OUTPUT:<br>
pass<br>
-&gt; PASS<br>
3/3 runs match the expected output</div>
<p>Two details read from the byte code: this Main uses <code>nextDouble()</code> and <code>nextInt()</code>, each followed by <code>nextLine()</code> to eat the rest of the line (otherwise <code>Enter lastname:</code> would read an empty string), and it prints the result with <code>printf("%s\\r\\n", …)</code> — Windows line ends. Our third run is a boundary test of our own: gpa exactly 5.0 → <code>pass</code>.</p>`,
    `<h2>7. Giải mẫu 2 — đề PE10 (FA25) câu 1: Student, khi chữ của đề và mẫu nói khác nhau</h2>
<p>Đề: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 10 (FA25)</a>, câu 1. <code>Student(name, gpa)</code>; <code>getPass()</code> — "pass" nếu gpa <code>&gt;= 5.0</code>, ngược lại "fail"; <code>setName(lastname)</code> — "trả về tên với chữ đầu viết hoa"; <code>toString()</code> — "name, gpa". Mẫu: name <code>hoa</code>, gpa 5.4, TC 1, lastname <code>nguyen</code> → <strong><code>hoa nguyen, 5.4</code></strong>.</p>
<p>Tính theo chữ của đề thì vướng hai chỗ. "Trả về" — nhưng hộp UML không cho <code>setName</code> kiểu trả về, và <code>Main.class</code> đề cho gọi <code>Student.setName:(Ljava/lang/String;)V</code> (<code>V</code> = void) rồi in <code>toString()</code>. "Chữ đầu viết hoa" — nhưng trong mẫu không có chữ hoa nào. Cách hiểu duy nhất ra được mẫu: <strong>nối họ vào sau tên, không đổi gì khác</strong>.</p>
<details><summary>Lời giải (chạy trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Student {
    private String name;
    private double gpa;

    public Student() {
    }

    public Student(String name, double gpa) {
        this.name = name;
        this.gpa = gpa;
    }

    // "&gt;= 5.0" ⇒ đúng 5.0 là đỗ
    public String getPass() {
        return gpa &gt;= 5.0 ? "pass" : "fail";
    }

    // Chữ của đề nói "chữ đầu viết hoa", mẫu in "hoa nguyen" — không có chữ hoa nào.
    // Hộp UML cho setName không có kiểu trả về (void), Main không lấy kết quả: nối họ vào, không đổi gì khác.
    public void setName(String lastname) {
        this.name = this.name + " " + lastname;
    }

    // "name, gpa" với ", " và số double nguyên trạng — "Do not format the result"
    @Override
    public String toString() {
        return name + ", " + gpa;
    }
}</code></pre>
<p>Chú thích trong <code>setName</code> ghi lại <em>vì sao</em> nó bỏ qua nửa câu của đề — nếu giảng viên đọc code, lập luận nằm sẵn ở đó. <code>toString()</code> nối số double nguyên trạng ("Do not format the result"): 5.4 in ra <code>5.4</code>, 5.0 sẽ in ra <code>5.0</code>.</p>
</details>
<pre class="trich"><code class="language-java">// Bản thay cho Main.class đề cho (dựng lại bằng javap -c): nextDouble()/nextInt() đều có nextLine() theo sau
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String lastname = "";
        System.out.print("Enter name: ");
        String name = sc.nextLine();
        System.out.print("Enter gpa: ");
        double gpa = sc.nextDouble();
        sc.nextLine();
        System.out.println("1. Test setName()");
        System.out.println("2. Test getPass()");
        System.out.print("Enter TC (1 or 2): ");
        int tc = sc.nextInt();
        sc.nextLine();
        Student st = new Student(name, gpa);
        if (tc == 1) {
            System.out.print("Enter lastname: ");
            lastname = sc.nextLine();
        }
        System.out.println("OUTPUT:");
        switch (tc) {
            case 1:
                st.setName(lastname);
                System.out.printf("%s\\r\\n", st.toString());          // \\r\\n: Main đề cho in xuống dòng kiểu Windows
                break;
            case 2:
                System.out.println(st.getPass());
                break;
        }
        System.out.println();
    }
}</code></pre>
<div class="out">=== TC1 setName (paper sample 1) ===<br>
Enter name: Enter gpa: 1. Test setName()<br>
2. Test getPass()<br>
Enter TC (1 or 2): Enter lastname: OUTPUT:<br>
hoa nguyen, 5.4<br>
-&gt; PASS<br>
=== TC2 getPass (paper sample 2) ===<br>
Enter name: Enter gpa: 1. Test setName()<br>
2. Test getPass()<br>
Enter TC (1 or 2): OUTPUT:<br>
fail<br>
-&gt; PASS<br>
=== TC2 again, own boundary test: gpa 5.0 ===<br>
Enter name: Enter gpa: 1. Test setName()<br>
2. Test getPass()<br>
Enter TC (1 or 2): OUTPUT:<br>
pass<br>
-&gt; PASS<br>
3/3 runs match the expected output</div>
<p>Hai chi tiết đọc được từ byte code: Main này dùng <code>nextDouble()</code> và <code>nextInt()</code>, mỗi lần đều có <code>nextLine()</code> theo sau để nuốt phần còn lại của dòng (nếu không, <code>Enter lastname:</code> sẽ đọc phải chuỗi rỗng), và in kết quả bằng <code>printf("%s\\r\\n", …)</code> — xuống dòng kiểu Windows. Lần chạy thứ ba là ca kiểm biên tự thêm: gpa đúng 5.0 → <code>pass</code>.</p>`),
    bi(`<h2>8. Solved paper 3 — PE14 (SU26) question 1: Person</h2>
<p>Paper: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 14 (SU26)</a>, question 1. <code>Person(name, sickLeave)</code>; <code>setSickLeave(upValue)</code> — "set sickLeave = sickLeave + upValue"; <code>getName()</code> — the name in upper case; <code>toString()</code> — "name,sickLeave (without a space after comma)". Samples: <code>nguyen anh</code>, TC 1 → <code>NGUYEN ANH</code>; <code>ly hung</code>, 5.5, TC 2, up value 1.0 → <code>ly hung,6.5</code>.</p>
<details><summary>Solution (run on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Person {
    private String name;
    private double sickLeave;

    public Person() {
    }

    public Person(String name, double sickLeave) {
        this.name = name;
        this.sickLeave = sickLeave;
    }

    // "set sickLeave = sickLeave + upValue": the name says set, the rule says ADD
    public void setSickLeave(double upValue) {
        sickLeave = sickLeave + upValue;
    }

    // upper case only in what getName() RETURNS — the field itself keeps what was typed
    public String getName() {
        return name.toUpperCase();
    }

    // "name,sickLeave (without a space after comma)" and the RAW field, not getName()
    @Override
    public String toString() {
        return name + "," + sickLeave;
    }
}</code></pre>
</details>
<pre class="trich"><code class="language-java">// Stand-in for the given Main.class (javap -c): nextLine() for the name, nextDouble() for numbers
class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter name: ");
        String name = sc.nextLine();
        System.out.print("Enter sickLeave: ");
        double sickLeave = sc.nextDouble();
        Person p = new Person(name, sickLeave);
        System.out.println("1. Test getName():");
        System.out.println("2. Test setSickLeave():");
        System.out.print("Enter TC (1 or 2): ");
        int tc = sc.nextInt();
        switch (tc) {
            case 1:
                System.out.println("OUTPUT:");
                System.out.println(p.getName());
                break;
            case 2:
                System.out.print("Enter up value: ");
                double up = sc.nextDouble();
                System.out.println("OUTPUT:");
                p.setSickLeave(up);
                System.out.println(p.toString());
                break;
        }
    }
}</code></pre>
<div class="out">=== TC1 getName (paper sample 1) ===<br>
Enter name: Enter sickLeave: 1. Test getName():<br>
2. Test setSickLeave():<br>
Enter TC (1 or 2): OUTPUT:<br>
NGUYEN ANH<br>
-&gt; PASS<br>
=== TC2 setSickLeave (paper sample 2) ===<br>
Enter name: Enter sickLeave: 1. Test getName():<br>
2. Test setSickLeave():<br>
Enter TC (1 or 2): Enter up value: OUTPUT:<br>
ly hung,6.5<br>
-&gt; PASS<br>
=== TC2 again, own test: 0.1 + 0.2 ===<br>
Enter name: Enter sickLeave: 1. Test getName():<br>
2. Test setSickLeave():<br>
Enter TC (1 or 2): Enter up value: OUTPUT:<br>
an,0.30000000000000004<br>
-&gt; PASS<br>
3/3 runs match the expected output</div>
<p>Sample 2 checks two traps at once: the name printed by <code>toString()</code> is still <em>lower</em> case (only <code>getName()</code> upper-cases), and 6.5 = 5.5 + 1.0 (the setter adds). Our third run shows what "Do not format the result" really means: 0.1 + 0.2 is printed as <code>0.30000000000000004</code>, because 0.1 and 0.2 have no exact binary form. The expected output of a marker built with the same rule contains the same digits; rounding them "to look nice" would be the mistake.</p>`,
    `<h2>8. Giải mẫu 3 — đề PE14 (SU26) câu 1: Person</h2>
<p>Đề: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 14 (SU26)</a>, câu 1. <code>Person(name, sickLeave)</code>; <code>setSickLeave(upValue)</code> — "gán sickLeave = sickLeave + upValue"; <code>getName()</code> — tên viết hoa; <code>toString()</code> — "name,sickLeave (không có dấu cách sau dấu phẩy)". Mẫu: <code>nguyen anh</code>, TC 1 → <code>NGUYEN ANH</code>; <code>ly hung</code>, 5.5, TC 2, up value 1.0 → <code>ly hung,6.5</code>.</p>
<details><summary>Lời giải (chạy trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Person {
    private String name;
    private double sickLeave;

    public Person() {
    }

    public Person(String name, double sickLeave) {
        this.name = name;
        this.sickLeave = sickLeave;
    }

    // "set sickLeave = sickLeave + upValue": tên nói set, luật nói CỘNG
    public void setSickLeave(double upValue) {
        sickLeave = sickLeave + upValue;
    }

    // chỉ viết hoa trong thứ getName() TRẢ VỀ — bản thân trường giữ nguyên chữ đã nhập
    public String getName() {
        return name.toUpperCase();
    }

    // "name,sickLeave (không dấu cách sau dấu phẩy)" và trường THÔ, không phải getName()
    @Override
    public String toString() {
        return name + "," + sickLeave;
    }
}</code></pre>
</details>
<pre class="trich"><code class="language-java">// Bản thay cho Main.class đề cho (javap -c): nextLine() cho tên, nextDouble() cho số
class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter name: ");
        String name = sc.nextLine();
        System.out.print("Enter sickLeave: ");
        double sickLeave = sc.nextDouble();
        Person p = new Person(name, sickLeave);
        System.out.println("1. Test getName():");
        System.out.println("2. Test setSickLeave():");
        System.out.print("Enter TC (1 or 2): ");
        int tc = sc.nextInt();
        switch (tc) {
            case 1:
                System.out.println("OUTPUT:");
                System.out.println(p.getName());
                break;
            case 2:
                System.out.print("Enter up value: ");
                double up = sc.nextDouble();
                System.out.println("OUTPUT:");
                p.setSickLeave(up);
                System.out.println(p.toString());
                break;
        }
    }
}</code></pre>
<div class="out">=== TC1 getName (paper sample 1) ===<br>
Enter name: Enter sickLeave: 1. Test getName():<br>
2. Test setSickLeave():<br>
Enter TC (1 or 2): OUTPUT:<br>
NGUYEN ANH<br>
-&gt; PASS<br>
=== TC2 setSickLeave (paper sample 2) ===<br>
Enter name: Enter sickLeave: 1. Test getName():<br>
2. Test setSickLeave():<br>
Enter TC (1 or 2): Enter up value: OUTPUT:<br>
ly hung,6.5<br>
-&gt; PASS<br>
=== TC2 again, own test: 0.1 + 0.2 ===<br>
Enter name: Enter sickLeave: 1. Test getName():<br>
2. Test setSickLeave():<br>
Enter TC (1 or 2): Enter up value: OUTPUT:<br>
an,0.30000000000000004<br>
-&gt; PASS<br>
3/3 runs match the expected output</div>
<p>Mẫu 2 kiểm hai cái bẫy cùng lúc: tên do <code>toString()</code> in ra vẫn là chữ <em>thường</em> (chỉ <code>getName()</code> mới viết hoa), và 6.5 = 5.5 + 1.0 (setter cộng thêm). Lần chạy thứ ba của chúng tôi cho thấy "Do not format the result" thật sự nghĩa là gì: 0.1 + 0.2 in ra <code>0.30000000000000004</code>, vì 0.1 và 0.2 không có dạng nhị phân chính xác. Output mong đợi của một máy chấm dựng theo cùng luật cũng chứa đúng các chữ số đó; làm tròn cho "đẹp" mới là lỗi.</p>`),
    bi(`<h2>9. Thirteen ways to lose question 1 — each one measured</h2>
<p>Nine logic mistakes, each as the wrong line next to the right line, both run, compared with the paper's sample:</p>
<pre><code class="language-java">// release: 8
// Nine ways to lose the marks of a PE question 1, each measured: the wrong line, the right line, the paper's sample
import java.util.*;

public class LoiMatDiemQ1 {
    public static void main(String[] args) {
        // L1 — PE1 getStoreName(): "first letter capitalized, rest lowercase"
        String s = "passio Coffee";
        String sai1 = s.toUpperCase();                                              // the whole name
        String sai1b = "";
        for (String w : s.split(" ")) {                                             // every word (title case)
            sai1b += (sai1b.isEmpty() ? "" : " ") + Character.toUpperCase(w.charAt(0)) + w.substring(1).toLowerCase();
        }
        String dung1 = Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase();
        xem("L1 capitalise", "Passio coffee", sai1, dung1);
        xem("L1 title case", "Passio coffee", sai1b, dung1);

        // L2 — PE1 getTotalRevenue(): "&gt;= 100" at the boundary, 100 cups of 3.5
        int cups = 100;
        double price = 3.5;
        double sai2 = cups &gt; 100 ? price * cups * 1.2 : price * cups;
        double dung2 = cups &gt;= 100 ? price * cups * 1.2 : price * cups;
        xem("L2 &gt; instead of &gt;=", "420.00", String.format("%.2f", sai2), String.format("%.2f", dung2));

        // L3 — the separator is part of the answer: PE1 "STORENAME:revenue", PE14 "no space after comma"
        xem("L3 space after :", "BREW HAVEN:1440.00", "BREW HAVEN" + ": " + String.format("%.2f", 1440.0), "BREW HAVEN" + ":" + String.format("%.2f", 1440.0));
        xem("L3 %.1f", "BREW HAVEN:1440.00", "BREW HAVEN:" + String.format("%.1f", 1440.0), "BREW HAVEN:" + String.format("%.2f", 1440.0));
        xem("L3 PE14 comma", "ly hung,6.5", "ly hung" + ", " + 6.5, "ly hung" + "," + 6.5);

        // L4 — int / int throws the decimals away: PE1 Q2 getQualityIndex() = diagonal * (brightness / 100.0), 6.5 and 750
        double diagonal = 6.5;
        int brightness = 750;
        xem("L4 int division", "48.75", String.valueOf(diagonal * (brightness / 100)), String.valueOf(diagonal * (brightness / 100.0)));

        // L5 — PE7 getSalary(): position "head" read from the keyboard, compared with ==
        String typed = new Scanner("head\\n").nextLine();                          // a String built at run time, like every Scanner result
        int sai5 = typed == "head" ? 1500 : 1000;
        int dung5 = typed.equalsIgnoreCase("head") ? 1500 : 1000;
        xem("L5 == on Strings", "1500", String.valueOf(sai5), String.valueOf(dung5));

        // L6 — PE7 says "String comparison is case insensitive": the tester types "Head"
        String pos = "Head";
        xem("L6 equals", "1500", String.valueOf(pos.equals("head") ? 1500 : 1000), String.valueOf(pos.equalsIgnoreCase("head") ? 1500 : 1000));

        // L7 — a Vietnamese Windows locale writes a decimal COMMA; pin Locale.US when YOU format
        Locale vn = new Locale("vi", "VN");
        xem("L7 locale vi-VN", "175.00", String.format(vn, "%.2f", 175.0), String.format(Locale.US, "%.2f", 175.0));

        // L8 — PE14 setSickLeave(upValue): "sickLeave = sickLeave + upValue", 5.5 then 1.0
        double leave = 5.5;
        double sai8 = 1.0;                                                         // this.sickLeave = upValue
        double dung8 = leave + 1.0;                                                // this.sickLeave += upValue
        xem("L8 set instead of add", "ly hung,6.5", "ly hung," + sai8, "ly hung," + dung8);

        // L9 — PE10 setName(lastname): obeying the text ("first letter in uppercase") instead of the sample
        String name = "hoa", last = "nguyen";
        String theoChu = Character.toUpperCase(name.charAt(0)) + name.substring(1) + " " + last;
        String theoMau = name + " " + last;
        xem("L9 text vs sample", "hoa nguyen, 5.4", theoChu + ", " + 5.4, theoMau + ", " + 5.4);
    }

    // one line per trap: what the paper expects, what the wrong code gives, what the right code gives
    static void xem(String bay, String mau, String sai, String dung) {
        System.out.println(bay);
        System.out.println("   expected : " + mau);
        System.out.println("   wrong    : " + sai + (sai.equals(mau) ? "   PASS" : "   FAIL"));
        System.out.println("   right    : " + dung + (dung.equals(mau) ? "   PASS" : "   FAIL"));
    }
}</code></pre>
<div class="out">L1 capitalise<br>
&nbsp;&nbsp;&nbsp;expected : Passio coffee<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: PASSIO COFFEE &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: Passio coffee &nbsp;&nbsp;PASS<br>
L1 title case<br>
&nbsp;&nbsp;&nbsp;expected : Passio coffee<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: Passio Coffee &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: Passio coffee &nbsp;&nbsp;PASS<br>
L2 &gt; instead of &gt;=<br>
&nbsp;&nbsp;&nbsp;expected : 420.00<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 350.00 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 420.00 &nbsp;&nbsp;PASS<br>
L3 space after :<br>
&nbsp;&nbsp;&nbsp;expected : BREW HAVEN:1440.00<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: BREW HAVEN: 1440.00 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: BREW HAVEN:1440.00 &nbsp;&nbsp;PASS<br>
L3 %.1f<br>
&nbsp;&nbsp;&nbsp;expected : BREW HAVEN:1440.00<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: BREW HAVEN:1440.0 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: BREW HAVEN:1440.00 &nbsp;&nbsp;PASS<br>
L3 PE14 comma<br>
&nbsp;&nbsp;&nbsp;expected : ly hung,6.5<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: ly hung, 6.5 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: ly hung,6.5 &nbsp;&nbsp;PASS<br>
L4 int division<br>
&nbsp;&nbsp;&nbsp;expected : 48.75<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 45.5 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 48.75 &nbsp;&nbsp;PASS<br>
L5 == on Strings<br>
&nbsp;&nbsp;&nbsp;expected : 1500<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 1000 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 1500 &nbsp;&nbsp;PASS<br>
L6 equals<br>
&nbsp;&nbsp;&nbsp;expected : 1500<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 1000 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 1500 &nbsp;&nbsp;PASS<br>
L7 locale vi-VN<br>
&nbsp;&nbsp;&nbsp;expected : 175.00<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 175,00 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 175.00 &nbsp;&nbsp;PASS<br>
L8 set instead of add<br>
&nbsp;&nbsp;&nbsp;expected : ly hung,6.5<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: ly hung,1.0 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: ly hung,6.5 &nbsp;&nbsp;PASS<br>
L9 text vs sample<br>
&nbsp;&nbsp;&nbsp;expected : hoa nguyen, 5.4<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: Hoa nguyen, 5.4 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: hoa nguyen, 5.4 &nbsp;&nbsp;PASS</div>
<p>And four mistakes that <strong>compile in your project and still score zero</strong>, because the marker runs your class with a <code>Main.class</code> compiled against the paper's names. Run on a real JDK 8: the given Main compiled once, a jar built like Clean and Build, then each mistake:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File q1 = new File("Q1");
    viet(q1, "Main.java", MAIN);                                   // the paper's harness
    viet(q1, "CoffeeShop.java", lop(""));                          // your class, written correctly
    lenh(q1, "javac", "Main.java", "CoffeeShop.java");             // the paper ships Main as Main.class: compiled ONCE, never again
    lenh(q1, "jar", "cfe", "Q1.jar", "Main", "Main.class", "CoffeeShop.class");
    lenhVao(q1, "2\\npassio Coffee\\n4.0\\n150\\n2\\n", "java", "-jar", "Q1.jar");

    System.out.println("\\n== Mistake A: a method renamed (getStorename) — your file compiles, Main.class was built against getStoreName ==");
    viet(q1, "CoffeeShop.java", lop("").replace("getStoreName()", "getStorename()"));
    lenh(q1, "javac", "CoffeeShop.java");
    lenhVao(q1, "2\\npassio Coffee\\n4.0\\n150\\n2\\n", "java", "Main");

    System.out.println("\\n== Mistake B: a package line added on top of the class (the paper says default package) ==");
    viet(q1, "CoffeeShop.java", lop("package q1;\\n"));
    lenh(q1, "javac", "CoffeeShop.java");
    lenhVao(q1, "2\\npassio Coffee\\n4.0\\n150\\n2\\n", "java", "Main");

    System.out.println("\\n== Mistake C: the class named Coffeeshop (one small letter) ==");
    new File(q1, "CoffeeShop.java").delete();
    new File(q1, "CoffeeShop.class").delete();
    viet(q1, "Coffeeshop.java", lop("").replace("class CoffeeShop", "class Coffeeshop").replace("public CoffeeShop(", "public Coffeeshop("));
    lenh(q1, "javac", "Coffeeshop.java");
    lenhVao(q1, "2\\npassio Coffee\\n4.0\\n150\\n2\\n", "java", "Main");

    System.out.println("\\n== Mistake D: a Java 11 method, String.repeat, on the exam-room JDK 8 ==");
    viet(q1, "Line.java", "public class Line {\\n    public static void main(String[] a) {\\n        System.out.println(\\"-\\".repeat(10));\\n    }\\n}\\n");
    lenh(q1, "javac", "Line.java");
}</code></pre>
<div class="out">&gt; javac Main.java CoffeeShop.java<br>
&gt; jar cfe Q1.jar Main Main.class CoffeeShop.class<br>
&gt; java -jar Q1.jar &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: 2 / passio Coffee / 4.0 / 150 / 2)<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: Enter TC(1|2|3|4): OUTPUT:<br>
Passio coffee<br>
<br>
== Mistake A: a method renamed (getStorename) — your file compiles, Main.class was built against getStoreName ==<br>
&gt; javac CoffeeShop.java<br>
&gt; java Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: 2 / passio Coffee / 4.0 / 150 / 2)<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: Enter TC(1|2|3|4): OUTPUT:<br>
Exception in thread "main" java.lang.NoSuchMethodError: CoffeeShop.getStoreName()Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
<br>
== Mistake B: a package line added on top of the class (the paper says default package) ==<br>
&gt; javac CoffeeShop.java<br>
&gt; java Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: 2 / passio Coffee / 4.0 / 150 / 2)<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: Exception in thread "main" java.lang.NoClassDefFoundError: CoffeeShop (wrong name: q1/CoffeeShop)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
<br>
== Mistake C: the class named Coffeeshop (one small letter) ==<br>
&gt; javac Coffeeshop.java<br>
&gt; java Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: 2 / passio Coffee / 4.0 / 150 / 2)<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: Exception in thread "main" java.lang.NoClassDefFoundError: CoffeeShop (wrong name: Coffeeshop)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
<br>
== Mistake D: a Java 11 method, String.repeat, on the exam-room JDK 8 ==<br>
&gt; javac Line.java<br>
Line.java:3: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println("-".repeat(10));<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method repeat(int)<br>
&nbsp;&nbsp;location: class String<br>
1 error<br>
(exit code 1)</div>
<table>
<thead><tr><th>#</th><th>Mistake</th><th>Real effect</th><th>Rule</th></tr></thead>
<tbody>
<tr><td>L1</td><td>upper-casing the whole name, or every word</td><td><code>PASSIO COFFEE</code> / <code>Passio Coffee</code></td><td>one capital, then <code>substring(1).toLowerCase()</code></td></tr>
<tr><td>L2</td><td><code>&gt;</code> where the paper says <code>&gt;=</code></td><td>350.00 instead of 420.00 at 100 cups</td><td>test the boundary value itself</td></tr>
<tr><td>L3</td><td>one extra space, <code>%.1f</code> instead of <code>%.2f</code></td><td><code>BREW HAVEN: 1440.00</code>, <code>1440.0</code></td><td>copy punctuation and decimals exactly</td></tr>
<tr><td>L4</td><td><code>brightness / 100</code> on two ints</td><td>45.5 instead of 48.75</td><td><code>/ 100.0</code> when the result must have decimals</td></tr>
<tr><td>L5</td><td><code>==</code> on a String from Scanner</td><td>salary 1000 instead of 1500</td><td><code>equals</code> / <code>equalsIgnoreCase</code></td></tr>
<tr><td>L6</td><td><code>equals</code> where the paper says case-insensitive</td><td>"Head" not recognised</td><td><code>equalsIgnoreCase</code></td></tr>
<tr><td>L7</td><td>a Vietnamese locale on the PC</td><td><code>175,00</code></td><td><code>String.format(Locale.US, …)</code> if you format yourself</td></tr>
<tr><td>L8</td><td>a setter that replaces when the rule adds</td><td><code>ly hung,1.0</code></td><td>read the formula, not the method name</td></tr>
<tr><td>L9</td><td>obeying the text against the sample</td><td><code>Hoa nguyen, 5.4</code></td><td>the reading that reproduces every sample wins</td></tr>
<tr><td>A</td><td>a method renamed (one letter)</td><td><code>NoSuchMethodError</code> at run time</td><td>names exactly as in the box</td></tr>
<tr><td>B</td><td>a <code>package</code> line</td><td><code>NoClassDefFoundError … wrong name: q1/CoffeeShop</code></td><td>default package means no package line</td></tr>
<tr><td>C</td><td><code>Coffeeshop</code> instead of <code>CoffeeShop</code></td><td><code>NoClassDefFoundError … wrong name: Coffeeshop</code></td><td>Windows finds the file, Java refuses the class</td></tr>
<tr><td>D</td><td>a Java 9+ method (<code>String.repeat</code>, also <code>List.of</code>, <code>var</code>)</td><td><code>cannot find symbol</code> on JDK 8</td><td>set the project to JDK 1.8 and build it there</td></tr>
</tbody>
</table>
<div class="pitfall">A and C are the cruel ones: <em>your</em> NetBeans project builds fine (Main is only a .class file, nobody recompiles it), you even submit — and the jar dies in the marker's first test case. Mistake C shows a real detail: the lab PCs run Windows, whose file system ignores upper/lower case, so <code>java</code> finds <code>Coffeeshop.class</code> when looking for <code>CoffeeShop</code> and then rejects it. Run your jar once with the sample input before submitting.</div>`,
    `<h2>9. Mười ba cách mất điểm câu 1 — cách nào cũng đo thật</h2>
<p>Chín lỗi logic, mỗi lỗi là dòng sai đặt cạnh dòng đúng, cả hai đều chạy, so với mẫu của đề:</p>
<pre><code class="language-java">// release: 8
// Chín cách mất điểm câu 1 của đề PE, cái nào cũng đo thật: dòng sai, dòng đúng, mẫu của đề
import java.util.*;

public class LoiMatDiemQ1 {
    public static void main(String[] args) {
        // L1 — PE1 getStoreName(): "chữ đầu viết hoa, còn lại viết thường"
        String s = "passio Coffee";
        String sai1 = s.toUpperCase();                                              // cả tên
        String sai1b = "";
        for (String w : s.split(" ")) {                                             // mỗi từ một chữ hoa
            sai1b += (sai1b.isEmpty() ? "" : " ") + Character.toUpperCase(w.charAt(0)) + w.substring(1).toLowerCase();
        }
        String dung1 = Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase();
        xem("L1 capitalise", "Passio coffee", sai1, dung1);
        xem("L1 title case", "Passio coffee", sai1b, dung1);

        // L2 — PE1 getTotalRevenue(): "&gt;= 100" ở biên, 100 cốc giá 3.5
        int cups = 100;
        double price = 3.5;
        double sai2 = cups &gt; 100 ? price * cups * 1.2 : price * cups;
        double dung2 = cups &gt;= 100 ? price * cups * 1.2 : price * cups;
        xem("L2 &gt; instead of &gt;=", "420.00", String.format("%.2f", sai2), String.format("%.2f", dung2));

        // L3 — dấu ngăn cách là một phần đáp án: PE1 "STORENAME:revenue", PE14 "không dấu cách sau dấu phẩy"
        xem("L3 space after :", "BREW HAVEN:1440.00", "BREW HAVEN" + ": " + String.format("%.2f", 1440.0), "BREW HAVEN" + ":" + String.format("%.2f", 1440.0));
        xem("L3 %.1f", "BREW HAVEN:1440.00", "BREW HAVEN:" + String.format("%.1f", 1440.0), "BREW HAVEN:" + String.format("%.2f", 1440.0));
        xem("L3 PE14 comma", "ly hung,6.5", "ly hung" + ", " + 6.5, "ly hung" + "," + 6.5);

        // L4 — int / int vứt phần thập phân: PE1 câu 2 getQualityIndex() = diagonal * (brightness / 100.0), 6.5 và 750
        double diagonal = 6.5;
        int brightness = 750;
        xem("L4 int division", "48.75", String.valueOf(diagonal * (brightness / 100)), String.valueOf(diagonal * (brightness / 100.0)));

        // L5 — PE7 getSalary(): chức vụ "head" đọc từ bàn phím, so bằng ==
        String typed = new Scanner("head\\n").nextLine();                          // một String tạo lúc chạy, như mọi kết quả của Scanner
        int sai5 = typed == "head" ? 1500 : 1000;
        int dung5 = typed.equalsIgnoreCase("head") ? 1500 : 1000;
        xem("L5 == on Strings", "1500", String.valueOf(sai5), String.valueOf(dung5));

        // L6 — PE7 ghi "so chuỗi không phân biệt hoa thường": người chấm gõ "Head"
        String pos = "Head";
        xem("L6 equals", "1500", String.valueOf(pos.equals("head") ? 1500 : 1000), String.valueOf(pos.equalsIgnoreCase("head") ? 1500 : 1000));

        // L7 — Windows để vùng Việt Nam thì viết dấu PHẨY thập phân; tự định dạng thì ghim Locale.US
        Locale vn = new Locale("vi", "VN");
        xem("L7 locale vi-VN", "175.00", String.format(vn, "%.2f", 175.0), String.format(Locale.US, "%.2f", 175.0));

        // L8 — PE14 setSickLeave(upValue): "sickLeave = sickLeave + upValue", 5.5 rồi 1.0
        double leave = 5.5;
        double sai8 = 1.0;                                                         // this.sickLeave = upValue
        double dung8 = leave + 1.0;                                                // this.sickLeave += upValue
        xem("L8 set instead of add", "ly hung,6.5", "ly hung," + sai8, "ly hung," + dung8);

        // L9 — PE10 setName(lastname): làm theo chữ của đề ("chữ đầu viết hoa") thay vì theo mẫu
        String name = "hoa", last = "nguyen";
        String theoChu = Character.toUpperCase(name.charAt(0)) + name.substring(1) + " " + last;
        String theoMau = name + " " + last;
        xem("L9 text vs sample", "hoa nguyen, 5.4", theoChu + ", " + 5.4, theoMau + ", " + 5.4);
    }

    // mỗi bẫy một dòng: đề chờ gì, code sai ra gì, code đúng ra gì
    static void xem(String bay, String mau, String sai, String dung) {
        System.out.println(bay);
        System.out.println("   expected : " + mau);
        System.out.println("   wrong    : " + sai + (sai.equals(mau) ? "   PASS" : "   FAIL"));
        System.out.println("   right    : " + dung + (dung.equals(mau) ? "   PASS" : "   FAIL"));
    }
}</code></pre>
<div class="out">L1 capitalise<br>
&nbsp;&nbsp;&nbsp;expected : Passio coffee<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: PASSIO COFFEE &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: Passio coffee &nbsp;&nbsp;PASS<br>
L1 title case<br>
&nbsp;&nbsp;&nbsp;expected : Passio coffee<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: Passio Coffee &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: Passio coffee &nbsp;&nbsp;PASS<br>
L2 &gt; instead of &gt;=<br>
&nbsp;&nbsp;&nbsp;expected : 420.00<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 350.00 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 420.00 &nbsp;&nbsp;PASS<br>
L3 space after :<br>
&nbsp;&nbsp;&nbsp;expected : BREW HAVEN:1440.00<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: BREW HAVEN: 1440.00 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: BREW HAVEN:1440.00 &nbsp;&nbsp;PASS<br>
L3 %.1f<br>
&nbsp;&nbsp;&nbsp;expected : BREW HAVEN:1440.00<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: BREW HAVEN:1440.0 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: BREW HAVEN:1440.00 &nbsp;&nbsp;PASS<br>
L3 PE14 comma<br>
&nbsp;&nbsp;&nbsp;expected : ly hung,6.5<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: ly hung, 6.5 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: ly hung,6.5 &nbsp;&nbsp;PASS<br>
L4 int division<br>
&nbsp;&nbsp;&nbsp;expected : 48.75<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 45.5 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 48.75 &nbsp;&nbsp;PASS<br>
L5 == on Strings<br>
&nbsp;&nbsp;&nbsp;expected : 1500<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 1000 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 1500 &nbsp;&nbsp;PASS<br>
L6 equals<br>
&nbsp;&nbsp;&nbsp;expected : 1500<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 1000 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 1500 &nbsp;&nbsp;PASS<br>
L7 locale vi-VN<br>
&nbsp;&nbsp;&nbsp;expected : 175.00<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 175,00 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 175.00 &nbsp;&nbsp;PASS<br>
L8 set instead of add<br>
&nbsp;&nbsp;&nbsp;expected : ly hung,6.5<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: ly hung,1.0 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: ly hung,6.5 &nbsp;&nbsp;PASS<br>
L9 text vs sample<br>
&nbsp;&nbsp;&nbsp;expected : hoa nguyen, 5.4<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: Hoa nguyen, 5.4 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: hoa nguyen, 5.4 &nbsp;&nbsp;PASS</div>
<p>Và bốn lỗi <strong>biên dịch vẫn qua trong project của bạn mà vẫn 0 điểm</strong>, vì máy chấm chạy lớp của bạn với một <code>Main.class</code> đã biên dịch theo tên trong đề. Chạy trên JDK 8 thật: Main đề cho biên dịch một lần, đóng jar như Clean and Build, rồi từng lỗi:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File q1 = new File("Q1");
    viet(q1, "Main.java", MAIN);                                   // harness của đề
    viet(q1, "CoffeeShop.java", lop(""));                          // lớp của bạn, viết đúng
    lenh(q1, "javac", "Main.java", "CoffeeShop.java");             // đề phát Main dạng Main.class: biên dịch MỘT lần, không bao giờ biên dịch lại
    lenh(q1, "jar", "cfe", "Q1.jar", "Main", "Main.class", "CoffeeShop.class");
    lenhVao(q1, "2\\npassio Coffee\\n4.0\\n150\\n2\\n", "java", "-jar", "Q1.jar");

    System.out.println("\\n== Mistake A: a method renamed (getStorename) — your file compiles, Main.class was built against getStoreName ==");
    viet(q1, "CoffeeShop.java", lop("").replace("getStoreName()", "getStorename()"));
    lenh(q1, "javac", "CoffeeShop.java");
    lenhVao(q1, "2\\npassio Coffee\\n4.0\\n150\\n2\\n", "java", "Main");

    System.out.println("\\n== Mistake B: a package line added on top of the class (the paper says default package) ==");
    viet(q1, "CoffeeShop.java", lop("package q1;\\n"));
    lenh(q1, "javac", "CoffeeShop.java");
    lenhVao(q1, "2\\npassio Coffee\\n4.0\\n150\\n2\\n", "java", "Main");

    System.out.println("\\n== Mistake C: the class named Coffeeshop (one small letter) ==");
    new File(q1, "CoffeeShop.java").delete();
    new File(q1, "CoffeeShop.class").delete();
    viet(q1, "Coffeeshop.java", lop("").replace("class CoffeeShop", "class Coffeeshop").replace("public CoffeeShop(", "public Coffeeshop("));
    lenh(q1, "javac", "Coffeeshop.java");
    lenhVao(q1, "2\\npassio Coffee\\n4.0\\n150\\n2\\n", "java", "Main");

    System.out.println("\\n== Mistake D: a Java 11 method, String.repeat, on the exam-room JDK 8 ==");
    viet(q1, "Line.java", "public class Line {\\n    public static void main(String[] a) {\\n        System.out.println(\\"-\\".repeat(10));\\n    }\\n}\\n");
    lenh(q1, "javac", "Line.java");
}</code></pre>
<div class="out">&gt; javac Main.java CoffeeShop.java<br>
&gt; jar cfe Q1.jar Main Main.class CoffeeShop.class<br>
&gt; java -jar Q1.jar &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: 2 / passio Coffee / 4.0 / 150 / 2)<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: Enter TC(1|2|3|4): OUTPUT:<br>
Passio coffee<br>
<br>
== Mistake A: a method renamed (getStorename) — your file compiles, Main.class was built against getStoreName ==<br>
&gt; javac CoffeeShop.java<br>
&gt; java Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: 2 / passio Coffee / 4.0 / 150 / 2)<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: Enter TC(1|2|3|4): OUTPUT:<br>
Exception in thread "main" java.lang.NoSuchMethodError: CoffeeShop.getStoreName()Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
<br>
== Mistake B: a package line added on top of the class (the paper says default package) ==<br>
&gt; javac CoffeeShop.java<br>
&gt; java Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: 2 / passio Coffee / 4.0 / 150 / 2)<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: Exception in thread "main" java.lang.NoClassDefFoundError: CoffeeShop (wrong name: q1/CoffeeShop)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
<br>
== Mistake C: the class named Coffeeshop (one small letter) ==<br>
&gt; javac Coffeeshop.java<br>
&gt; java Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: 2 / passio Coffee / 4.0 / 150 / 2)<br>
Enter id: Enter store name: Enter price per cup: Enter number of cups: Exception in thread "main" java.lang.NoClassDefFoundError: CoffeeShop (wrong name: Coffeeshop)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
<br>
== Mistake D: a Java 11 method, String.repeat, on the exam-room JDK 8 ==<br>
&gt; javac Line.java<br>
Line.java:3: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println("-".repeat(10));<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method repeat(int)<br>
&nbsp;&nbsp;location: class String<br>
1 error<br>
(exit code 1)</div>
<table>
<thead><tr><th>#</th><th>Lỗi</th><th>Hậu quả thật</th><th>Luật</th></tr></thead>
<tbody>
<tr><td>L1</td><td>viết hoa cả tên, hoặc mỗi từ một chữ hoa</td><td><code>PASSIO COFFEE</code> / <code>Passio Coffee</code></td><td>một chữ hoa, rồi <code>substring(1).toLowerCase()</code></td></tr>
<tr><td>L2</td><td><code>&gt;</code> trong khi đề ghi <code>&gt;=</code></td><td>350.00 thay vì 420.00 ở 100 cốc</td><td>thử chính giá trị biên</td></tr>
<tr><td>L3</td><td>thừa một dấu cách, <code>%.1f</code> thay vì <code>%.2f</code></td><td><code>BREW HAVEN: 1440.00</code>, <code>1440.0</code></td><td>chép đúng dấu câu và số chữ số thập phân</td></tr>
<tr><td>L4</td><td><code>brightness / 100</code> trên hai số int</td><td>45.5 thay vì 48.75</td><td><code>/ 100.0</code> khi kết quả phải có phần thập phân</td></tr>
<tr><td>L5</td><td><code>==</code> với String đọc từ Scanner</td><td>lương 1000 thay vì 1500</td><td><code>equals</code> / <code>equalsIgnoreCase</code></td></tr>
<tr><td>L6</td><td><code>equals</code> trong khi đề nói không phân biệt hoa thường</td><td>"Head" không được nhận</td><td><code>equalsIgnoreCase</code></td></tr>
<tr><td>L7</td><td>máy đặt vùng Việt Nam</td><td><code>175,00</code></td><td><code>String.format(Locale.US, …)</code> nếu tự định dạng</td></tr>
<tr><td>L8</td><td>setter gán đè trong khi luật là cộng</td><td><code>ly hung,1.0</code></td><td>đọc công thức, không đọc tên phương thức</td></tr>
<tr><td>L9</td><td>làm theo chữ của đề, ngược với mẫu</td><td><code>Hoa nguyen, 5.4</code></td><td>cách hiểu tái tạo được mọi mẫu là cách đúng</td></tr>
<tr><td>A</td><td>đổi tên phương thức (một chữ)</td><td><code>NoSuchMethodError</code> lúc chạy</td><td>tên đúng y như trong hộp</td></tr>
<tr><td>B</td><td>thêm dòng <code>package</code></td><td><code>NoClassDefFoundError … wrong name: q1/CoffeeShop</code></td><td>default package nghĩa là không có dòng package</td></tr>
<tr><td>C</td><td><code>Coffeeshop</code> thay vì <code>CoffeeShop</code></td><td><code>NoClassDefFoundError … wrong name: Coffeeshop</code></td><td>Windows tìm thấy file, Java từ chối lớp</td></tr>
<tr><td>D</td><td>phương thức của Java 9+ (<code>String.repeat</code>, cả <code>List.of</code>, <code>var</code>)</td><td><code>cannot find symbol</code> trên JDK 8</td><td>đặt project về JDK 1.8 và build ở đó</td></tr>
</tbody>
</table>
<div class="pitfall">A và C là hai lỗi tàn nhẫn nhất: project NetBeans <em>của bạn</em> build bình thường (Main chỉ là file .class, không ai biên dịch lại nó), bạn còn nộp bài — rồi file jar chết ngay ở test case đầu tiên của máy chấm. Lỗi C cho thấy một chi tiết thật: máy phòng lab chạy Windows, hệ tệp không phân biệt hoa thường, nên <code>java</code> tìm thấy <code>Coffeeshop.class</code> khi đi tìm <code>CoffeeShop</code> rồi mới từ chối nó. Chạy thử file jar một lần với dữ liệu mẫu trước khi nộp.</div>`),
    bi(`<h2>10. 85 minutes — a plan, and a checklist for every question</h2>
<p>For a classic four-question paper (Q1 2 marks, Q2 3, Q3 2–3, Q4 2–3):</p>
<table>
<thead><tr><th>Minutes</th><th>Do</th><th>Why</th></tr></thead>
<tbody>
<tr><td>0–5</td><td>read all four questions; compute every sample by hand; note the "twists"</td><td>finding a text-vs-sample conflict now costs 1 minute, later 15</td></tr>
<tr><td>5–17</td><td>Q1 → run all samples → Clean and Build → copy run + src</td><td>the easiest 2 marks, banked first</td></tr>
<tr><td>17–37</td><td>Q2 (lesson 2) → same routine</td><td>3 marks, mostly the frame you know</td></tr>
<tr><td>37–55</td><td>Q4 or Q3, whichever looks shorter (lessons 3–4)</td><td>do not let one question eat the clock</td></tr>
<tr><td>55–75</td><td>the other one</td><td>partial is better than nothing: f1 and f2 right is still marks</td></tr>
<tr><td>75–85</td><td>re-run every jar with the samples, check folder names, submit what is not submitted</td><td>the marker sees only what is in <strong>run</strong></td></tr>
</tbody>
</table>
<p><strong>Before submitting a question:</strong></p>
<ol>
<li>Class names, method names, parameter order and return types exactly as in the box (and as the given <code>Main.class</code> calls them).</li>
<li>No <code>package</code> line unless the given project has one; nothing created that the paper says is given (no <code>IString.java</code>).</li>
<li>Every <code>+Xxx()</code> of the box written, including the default constructor.</li>
<li>Every sample of the paper run, output after <code>OUTPUT:</code> identical — spaces, commas, capital letters, decimals.</li>
<li>Each boundary value of each rule tried once (100 cups, gpa 5.0, an empty or one-letter string).</li>
<li>Strings compared with <code>equals</code>/<code>equalsIgnoreCase</code> exactly as the text says; no <code>==</code>.</li>
<li>Only Java 8: no <code>var</code>, <code>List.of</code>, <code>String.repeat</code>, <code>record</code>, arrow <code>switch</code>.</li>
<li>Clean and Build <em>after</em> the last edit; <code>dist/*.jar</code> copied into <strong>run</strong>, the project into <strong>src</strong>.</li>
<li>The jar itself run once (<code>java -jar</code> or Run in NetBeans) with one sample.</li>
<li>Folder and file names of the paper unchanged.</li>
</ol>`,
    `<h2>10. 85 phút — một kế hoạch, và danh sách kiểm cho mỗi câu</h2>
<p>Với đề kinh điển bốn câu (Q1 2 điểm, Q2 3, Q3 2–3, Q4 2–3):</p>
<table>
<thead><tr><th>Phút</th><th>Làm gì</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>0–5</td><td>đọc cả bốn câu; tính tay mọi mẫu; ghi các "cú xoắn"</td><td>phát hiện chỗ đề lệch mẫu lúc này tốn 1 phút, để sau tốn 15</td></tr>
<tr><td>5–17</td><td>Q1 → chạy mọi mẫu → Clean and Build → chép run + src</td><td>2 điểm dễ nhất, cất vào túi trước</td></tr>
<tr><td>17–37</td><td>Q2 (bài 2) → cùng quy trình</td><td>3 điểm, phần lớn là khung đã thuộc</td></tr>
<tr><td>37–55</td><td>Q4 hoặc Q3, câu nào trông ngắn hơn (bài 3–4)</td><td>đừng để một câu ăn hết đồng hồ</td></tr>
<tr><td>55–75</td><td>câu còn lại</td><td>làm được một phần hơn không có gì: đúng f1 và f2 vẫn là điểm</td></tr>
<tr><td>75–85</td><td>chạy lại mọi file jar với dữ liệu mẫu, soát tên thư mục, nộp câu chưa nộp</td><td>máy chấm chỉ thấy thứ nằm trong <strong>run</strong></td></tr>
</tbody>
</table>
<p><strong>Trước khi nộp một câu:</strong></p>
<ol>
<li>Tên lớp, tên phương thức, thứ tự tham số và kiểu trả về đúng y như hộp UML (và như <code>Main.class</code> đề cho gọi).</li>
<li>Không có dòng <code>package</code> trừ khi project given có; không tạo thứ đề nói là cho sẵn (không tạo <code>IString.java</code>).</li>
<li>Mọi <code>+Xxx()</code> trong hộp đều có, kể cả constructor mặc định.</li>
<li>Chạy mọi mẫu của đề, output sau <code>OUTPUT:</code> giống hệt — dấu cách, dấu phẩy, chữ hoa, số chữ số thập phân.</li>
<li>Mỗi giá trị biên của mỗi luật thử một lần (100 cốc, gpa 5.0, chuỗi rỗng hoặc một chữ cái).</li>
<li>So String bằng <code>equals</code>/<code>equalsIgnoreCase</code> đúng như chữ của đề; không dùng <code>==</code>.</li>
<li>Chỉ Java 8: không <code>var</code>, <code>List.of</code>, <code>String.repeat</code>, <code>record</code>, <code>switch</code> mũi tên.</li>
<li>Clean and Build <em>sau</em> lần sửa cuối; <code>dist/*.jar</code> đã chép vào <strong>run</strong>, project vào <strong>src</strong>.</li>
<li>Đã chạy chính file jar một lần (<code>java -jar</code> hoặc Run trong NetBeans) với một mẫu.</li>
<li>Tên thư mục và tên file của đề giữ nguyên.</li>
</ol>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>Practical Exam (PE)</strong></td><td>thi thực hành</td><td>The 85-minute exam on a lab PC where you write and submit Java code; 30% of PRO192, must be above 0.</td></tr>
<tr><td><strong>given materials</strong></td><td>tài liệu đề cho</td><td>The NetBeans projects shipped with the paper: a compiled <code>Main.class</code> and sometimes an interface <code>.class</code>.</td></tr>
<tr><td><strong>harness / test driver</strong></td><td>khung chạy thử</td><td>The program (<code>Main</code>) that reads the input, calls your code and prints <code>OUTPUT:</code> and the result.</td></tr>
<tr><td><strong>test case (TC)</strong></td><td>ca kiểm thử</td><td>One input plus the output expected for it; the marker runs several hidden ones.</td></tr>
<tr><td><strong>sample run</strong></td><td>lần chạy mẫu</td><td>An input and output printed in the paper — part of the specification.</td></tr>
<tr><td><strong>automated marking</strong></td><td>chấm tự động</td><td>Software runs your jar on the test cases and compares the output; no person reads the screen.</td></tr>
<tr><td><strong>default package</strong></td><td>gói mặc định</td><td>Classes with no <code>package</code> line at the top; the given <code>Main.class</code> of the classic papers lives there.</td></tr>
<tr><td><strong>byte code / <code>.class</code> file</strong></td><td>mã byte / file .class</td><td>The compiled form of a class; a <code>.class</code> can be used and read with <code>javap</code> but not edited.</td></tr>
<tr><td><strong><code>javap</code></strong></td><td>công cụ javap</td><td>JDK tool that lists the members of a <code>.class</code>; with <code>-c</code> it shows the method calls inside it.</td></tr>
<tr><td><strong>jar / Clean and Build</strong></td><td>file jar / dọn và build</td><td>The archive with all your <code>.class</code> files; NetBeans builds it into <code>dist/</code> and it goes into the <code>run</code> folder.</td></tr>
<tr><td><strong>boundary value</strong></td><td>giá trị biên</td><td>The exact value where a rule switches (<code>&gt;= 100</code> ⇒ 100); the place where <code>&gt;</code> vs <code>&gt;=</code> bugs show.</td></tr>
<tr><td><strong>locale</strong></td><td>thiết lập vùng</td><td>Language and region settings; a Vietnamese locale formats 175.0 as <code>175,00</code>.</td></tr>
<tr><td><strong><code>NoSuchMethodError</code></strong></td><td>lỗi không có phương thức</td><td>Thrown at run time when compiled code calls a method that the loaded class no longer has (renamed, other type).</td></tr>
<tr><td><strong><code>NoClassDefFoundError</code></strong></td><td>lỗi không tìm thấy định nghĩa lớp</td><td>Thrown when a class used by compiled code cannot be loaded under that exact name (wrong package, wrong case).</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>Practical Exam (PE)</strong></td><td>thi thực hành</td><td>Bài thi 85 phút trên máy phòng lab, viết và nộp code Java; 30% điểm PRO192, phải lớn hơn 0.</td></tr>
<tr><td><strong>given materials</strong></td><td>tài liệu đề cho</td><td>Các project NetBeans phát kèm đề: một <code>Main.class</code> đã biên dịch và đôi khi một interface dạng <code>.class</code>.</td></tr>
<tr><td><strong>harness / test driver</strong></td><td>khung chạy thử</td><td>Chương trình (<code>Main</code>) đọc dữ liệu vào, gọi code của bạn rồi in <code>OUTPUT:</code> và kết quả.</td></tr>
<tr><td><strong>test case (TC)</strong></td><td>ca kiểm thử</td><td>Một bộ dữ liệu vào kèm output mong đợi; máy chấm chạy nhiều ca ẩn.</td></tr>
<tr><td><strong>sample run</strong></td><td>lần chạy mẫu</td><td>Dữ liệu vào và output in trong đề — là một phần của đặc tả.</td></tr>
<tr><td><strong>automated marking</strong></td><td>chấm tự động</td><td>Phần mềm chạy file jar của bạn trên các ca kiểm thử và so output; không ai nhìn màn hình.</td></tr>
<tr><td><strong>default package</strong></td><td>gói mặc định</td><td>Các lớp không có dòng <code>package</code> ở đầu; <code>Main.class</code> của đề kiểu kinh điển nằm ở đó.</td></tr>
<tr><td><strong>byte code / <code>.class</code> file</strong></td><td>mã byte / file .class</td><td>Dạng đã biên dịch của một lớp; file <code>.class</code> dùng được và đọc được bằng <code>javap</code> nhưng không sửa được.</td></tr>
<tr><td><strong><code>javap</code></strong></td><td>công cụ javap</td><td>Công cụ JDK liệt kê thành viên của một <code>.class</code>; với <code>-c</code> nó cho thấy các lời gọi phương thức bên trong.</td></tr>
<tr><td><strong>jar / Clean and Build</strong></td><td>file jar / dọn và build</td><td>Gói chứa mọi file <code>.class</code> của bạn; NetBeans build nó vào <code>dist/</code> và nó được chép vào thư mục <code>run</code>.</td></tr>
<tr><td><strong>boundary value</strong></td><td>giá trị biên</td><td>Đúng giá trị mà luật đổi nhánh (<code>&gt;= 100</code> ⇒ 100); chỗ lỗi <code>&gt;</code> với <code>&gt;=</code> lộ ra.</td></tr>
<tr><td><strong>locale</strong></td><td>thiết lập vùng</td><td>Cài đặt ngôn ngữ và vùng; vùng Việt Nam định dạng 175.0 thành <code>175,00</code>.</td></tr>
<tr><td><strong><code>NoSuchMethodError</code></strong></td><td>lỗi không có phương thức</td><td>Ném lúc chạy khi code đã biên dịch gọi một phương thức mà lớp được nạp không còn có (đổi tên, khác kiểu).</td></tr>
<tr><td><strong><code>NoClassDefFoundError</code></strong></td><td>lỗi không tìm thấy định nghĩa lớp</td><td>Ném khi một lớp mà code đã biên dịch dùng tới không nạp được dưới đúng tên đó (sai package, sai hoa thường).</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 7 things to take into the exam room</h2>
<ol>
<li><strong>Four shapes cover the papers:</strong> one class (Q1), a class + Spec subclass (Q2), f1/f2/f3 on a list or a list class (Q3), String tools (Q4); the 10-mark file papers glue the same skills together.</li>
<li><strong>The given <code>Main.class</code> is the boss:</strong> it fixes your class names, method names, parameter order and return types; <code>javap -c Main.class</code> shows what it calls.</li>
<li><strong>Marks sit in the twists</strong> — upper case only in the returned value, <code>&gt;=</code> vs <code>&gt;</code>, a setter that adds — not in typing fields.</li>
<li><strong>Every character after <code>OUTPUT:</code> counts:</strong> copy the punctuation, the spaces and the decimals of the paper; "Do not format" means raw.</li>
<li><strong>The samples are specification:</strong> compute them by hand first; the reading that reproduces all of them wins (PE10).</li>
<li><strong>Compiling in NetBeans is not passing:</strong> a renamed method, a package line or one wrong capital letter all build, then die in the marker.</li>
<li><strong>Bank marks early:</strong> Q1 in about 12 minutes, run every sample, build, copy run + src, then move on.</li>
</ol>
<div class="callout">🧭 <strong>Go further — LAB211 and testing</strong>: the "mini marker" in this lesson is a tiny test harness — input, expected output, PASS/FAIL. LAB211 graders work the same way, and in industry the same idea is called a unit test (JUnit, in the ⭐ part of this course). Next: <strong>🎯 PE drill 2</strong>, the class and its Spec subclass.</div>`,
    `<h2>📌 Tóm tắt — 7 điều mang vào phòng thi</h2>
<ol>
<li><strong>Bốn dạng phủ kín các đề:</strong> một lớp (Q1), lớp cha + lớp con Spec (Q2), f1/f2/f3 trên danh sách hoặc một lớp danh sách (Q3), xử lý chuỗi (Q4); các đề 10 điểm đọc file dán chính các kỹ năng đó lại với nhau.</li>
<li><strong><code>Main.class</code> đề cho là "sếp":</strong> nó chốt tên lớp, tên phương thức, thứ tự tham số và kiểu trả về của bạn; <code>javap -c Main.class</code> cho thấy nó gọi những gì.</li>
<li><strong>Điểm nằm ở cú xoắn</strong> — chỉ viết hoa thứ trả về, <code>&gt;=</code> hay <code>&gt;</code>, setter cộng thêm — không nằm ở việc gõ trường.</li>
<li><strong>Mọi ký tự sau <code>OUTPUT:</code> đều tính:</strong> chép đúng dấu câu, dấu cách và số chữ số thập phân của đề; "Do not format" nghĩa là để thô.</li>
<li><strong>Mẫu là đặc tả:</strong> tính tay trước; cách hiểu tái tạo được mọi mẫu là cách đúng (PE10).</li>
<li><strong>Biên dịch được trong NetBeans chưa phải là qua:</strong> đổi tên phương thức, thêm dòng package hay sai một chữ hoa đều build được, rồi chết ở máy chấm.</li>
<li><strong>Gom điểm sớm:</strong> Q1 khoảng 12 phút, chạy mọi mẫu, build, chép run + src, rồi đi tiếp.</li>
</ol>
<div class="callout">🧭 <strong>Đi tiếp — LAB211 và kiểm thử</strong>: "máy chấm thu nhỏ" trong bài này là một khung kiểm thử tí hon — dữ liệu vào, output mong đợi, PASS/FAIL. Người chấm LAB211 làm việc y như vậy, và trong công việc thật ý tưởng này gọi là unit test (JUnit, ở phần ⭐ của môn này). Tiếp theo: <strong>🎯 Luyện PE 2</strong>, lớp cha và lớp con Spec.</div>`),
  ].join('\n'),
};

/* ───────── 🎯 PE drill 2 — type 2: a class and its Spec subclass (toString, setData, getValue) on real papers ───────── */
const L_x_luyen_pe_2 = {
  title: '🎯 PE drill 2 — type 2: a class and its Spec subclass (toString, setData, getValue) on real papers|||🎯 Luyện PE PRO192 2 — dạng 2: lớp cha và lớp con Spec (toString, setData, getValue) trên đề thật',
  slug: 'pro192-luyen-pe-2',
  type: 'VIDEO',
  description: 'Bài luyện thi thực hành tự thêm (2/4): câu 2 đề PE (3 điểm) — viết lớp cha và lớp con kế thừa. Phân tích hai họ đề (họ Spec với toString/setData/getValue và họ tính tiền như Router, Professor) trên cả 11 đề bốn câu, Main.class đề cho làm gì ở từng test case (đọc bằng javap), mẹo đọc đề, khung code, giải ba đề thật (PE4 Cala/SpecCala, PE11 Ladder/SpecLadder, PE8 Employee/Professor) bằng code chạy thật trên JDK 8 với harness dựng lại, mười ba lỗi mất điểm đo thật (quên @Override, khai báo lại trường, đảo tham số, replace thay mọi ký tự, lệch chỉ số, số lẻ âm, thiếu constructor mặc định, trường private, getValue sai kiểu ⇒ NoSuchMethodError), kế hoạch 20 phút và danh sách kiểm trước khi nộp.',
  content: [
    bi(`<span class="eyebrow">Final Exam · 🎯 PE drill 2 of 4 · added by this site</span>
<h2>Type 2 — the class and its subclass: where inheritance earns 3 marks</h2>
<p class="lead">Question 2 of every classic paper gives two boxes: a parent class and a subclass that <code>extends</code> it. It is worth <strong>3 marks</strong> — the most of any single question in most papers — and it tests exactly the Chapter 4 skills: a constructor that hands the parent's fields to <code>super(...)</code>, a <code>toString()</code> that reuses the parent's, and methods that change a <code>private</code> field of the parent through its getter and setter. This lesson solves three real papers and measures the mistakes that cost those marks.</p>`,
    `<span class="eyebrow">Thi cuối kỳ · 🎯 Luyện PE 2/4 · phần web tự thêm</span>
<h2>Dạng 2 — lớp cha và lớp con: chỗ kế thừa kiếm được 3 điểm</h2>
<p class="lead">Câu 2 của mọi đề kinh điển cho hai hộp UML: một lớp cha và một lớp con <code>extends</code> nó. Câu này <strong>3 điểm</strong> — nhiều nhất trong một câu ở phần lớn các đề — và kiểm đúng kỹ năng của Chương 4: constructor chuyển trường của cha cho <code>super(...)</code>, <code>toString()</code> dùng lại của cha, và các phương thức đổi một trường <code>private</code> của cha thông qua getter và setter của nó. Bài này giải ba đề thật và đo những lỗi làm mất ba điểm đó.</p>`),
    bi(`<h2>1. Two families of question 2</h2>
<table>
<thead><tr><th>Family</th><th>Papers</th><th>The subclass must</th></tr></thead>
<tbody>
<tr><td>"Spec"</td><td>PE2 Employee/Manager · PE4 Cala/SpecCala · PE6 Wine/SpecWine · PE10 Car/SpecCar · PE11–PE13 Ladder/SpecLadder · PE14 Chair/SpecChair</td><td>add ONE field; <code>toString()</code> = parent's + the new field; <code>setData()</code> edits a parent field (a string operation); <code>getValue()</code> returns a value chosen by a rule</td></tr>
<tr><td>"business"</td><td>PE1 Screen/OLEDScreen · PE7 NetworkDevice/Router · PE8 Employee/Professor</td><td>add fields and compute: a price, a salary, a description from the parent's values</td></tr>
</tbody>
</table>
<p>The "Spec" family is the most regular shape of the whole exam. What <code>setData()</code> and <code>getValue()</code> do changes from paper to paper, and that is where the marks are:</p>
<table>
<thead><tr><th>Paper</th><th>setData()</th><th>getValue()</th></tr></thead>
<tbody>
<tr><td>PE2</td><td>replace the 3rd character of name with "KK"</td><td>department <code>"it"</code> (case-sensitive) ⇒ salary + 200, else + 900 — returns <strong>int</strong></td></tr>
<tr><td>PE4</td><td>replace the 2nd character of owner with "XX"</td><td>color odd ⇒ price + 3, else + 7 — returns <strong>int</strong></td></tr>
<tr><td>PE6</td><td>brand upper-cased, then reversed</td><td>year &lt; length of taste ⇒ lower-case the first <em>year</em> characters, else upper-case all — <strong>String</strong></td></tr>
<tr><td>PE10</td><td>remove the first letter of color</td><td>seat odd ⇒ model without the characters at odd 1-based positions — <strong>String</strong></td></tr>
<tr><td>PE11</td><td>last LETTER of type ⇒ last DIGIT of price</td><td>≥ 2 even digits in weight ⇒ type + their count, else type + number of digits — <strong>String</strong></td></tr>
<tr><td>PE12, PE13</td><td>first LETTER of type ⇒ first DIGIT of price</td><td>the same with ODD digits — <strong>String</strong></td></tr>
<tr><td>PE14</td><td><code>setType()</code>: quantity &gt; 5 ⇒ "discount", else "no discount"</td><td><code>getType()</code>: type without its last letter</td></tr>
</tbody>
</table>
<p>And what the given <code>Main.class</code> prints in each test case — read from its byte code with <code>javap -c</code>, because the samples alone do not tell you:</p>
<table>
<thead><tr><th>TC</th><th>What Main does</th><th>Consequence</th></tr></thead>
<tbody>
<tr><td>1</td><td>builds a PARENT object and a SUBCLASS object from the same input, prints both <code>toString()</code></td><td>two lines: "owner, price" then "owner, price, color" — the parent's own format is tested too</td></tr>
<tr><td>2</td><td>calls <code>setData()</code>, then prints — PE4: <code>getOwner() + "," + getPrice()</code>; PE6, PE11, PE12: <code>printf("%s, %d")</code> of two getters; PE2, PE10, PE14: the subclass's <code>toString()</code></td><td>after setData the getters must return the CHANGED value; how it is printed is Main's business, not yours</td></tr>
<tr><td>3</td><td>prints <code>getValue()</code></td><td>PE2/PE4 compile <code>int getValue()</code> into Main, the others <code>String getValue()</code> — the box decides, javap confirms</td></tr>
</tbody>
</table>`,
    `<h2>1. Hai họ câu 2</h2>
<table>
<thead><tr><th>Họ</th><th>Đề</th><th>Lớp con phải</th></tr></thead>
<tbody>
<tr><td>"Spec"</td><td>PE2 Employee/Manager · PE4 Cala/SpecCala · PE6 Wine/SpecWine · PE10 Car/SpecCar · PE11–PE13 Ladder/SpecLadder · PE14 Chair/SpecChair</td><td>thêm MỘT trường; <code>toString()</code> = của cha + trường mới; <code>setData()</code> sửa một trường của cha (một phép xử lý chuỗi); <code>getValue()</code> trả về một giá trị chọn theo luật</td></tr>
<tr><td>"nghiệp vụ"</td><td>PE1 Screen/OLEDScreen · PE7 NetworkDevice/Router · PE8 Employee/Professor</td><td>thêm trường và tính toán: giá, lương, mô tả từ các giá trị của cha</td></tr>
</tbody>
</table>
<p>Họ "Spec" là dạng đều đặn nhất của cả kỳ thi. Việc <code>setData()</code> và <code>getValue()</code> làm thay đổi theo từng đề, và điểm nằm chính ở đó:</p>
<table>
<thead><tr><th>Đề</th><th>setData()</th><th>getValue()</th></tr></thead>
<tbody>
<tr><td>PE2</td><td>thay ký tự thứ 3 của name bằng "KK"</td><td>department <code>"it"</code> (phân biệt hoa thường) ⇒ salary + 200, ngược lại + 900 — trả <strong>int</strong></td></tr>
<tr><td>PE4</td><td>thay ký tự thứ 2 của owner bằng "XX"</td><td>color lẻ ⇒ price + 3, ngược lại + 7 — trả <strong>int</strong></td></tr>
<tr><td>PE6</td><td>brand viết hoa rồi đảo ngược</td><td>year &lt; độ dài taste ⇒ viết thường <em>year</em> ký tự đầu, ngược lại viết hoa cả chuỗi — <strong>String</strong></td></tr>
<tr><td>PE10</td><td>bỏ chữ cái đầu của color</td><td>seat lẻ ⇒ model bỏ các ký tự ở vị trí lẻ (đếm từ 1) — <strong>String</strong></td></tr>
<tr><td>PE11</td><td>CHỮ CÁI cuối của type ⇒ CHỮ SỐ cuối của price</td><td>weight có ≥ 2 chữ số chẵn ⇒ type + số lượng đó, ngược lại type + số chữ số — <strong>String</strong></td></tr>
<tr><td>PE12, PE13</td><td>CHỮ CÁI đầu của type ⇒ CHỮ SỐ đầu của price</td><td>như trên với chữ số LẺ — <strong>String</strong></td></tr>
<tr><td>PE14</td><td><code>setType()</code>: quantity &gt; 5 ⇒ "discount", ngược lại "no discount"</td><td><code>getType()</code>: type bỏ chữ cái cuối</td></tr>
</tbody>
</table>
<p>Và <code>Main.class</code> đề cho in gì ở từng test case — đọc từ byte code bằng <code>javap -c</code>, vì chỉ nhìn mẫu thì không biết được:</p>
<table>
<thead><tr><th>TC</th><th>Main làm gì</th><th>Hệ quả</th></tr></thead>
<tbody>
<tr><td>1</td><td>tạo MỘT đối tượng CHA và MỘT đối tượng CON từ cùng dữ liệu, in cả hai <code>toString()</code></td><td>hai dòng: "owner, price" rồi "owner, price, color" — định dạng riêng của lớp cha cũng bị kiểm</td></tr>
<tr><td>2</td><td>gọi <code>setData()</code>, rồi in — PE4: <code>getOwner() + "," + getPrice()</code>; PE6, PE11, PE12: <code>printf("%s, %d")</code> từ hai getter; PE2, PE10, PE14: <code>toString()</code> của lớp con</td><td>sau setData các getter phải trả giá trị ĐÃ ĐỔI; in thế nào là việc của Main, không phải của bạn</td></tr>
<tr><td>3</td><td>in <code>getValue()</code></td><td>PE2/PE4 biên dịch <code>int getValue()</code> vào Main, các đề khác là <code>String getValue()</code> — hộp UML quyết định, javap xác nhận</td></tr>
</tbody>
</table>`),
    bi(`<h2>2. Reading tips for question 2</h2>
<table>
<thead><tr><th>The paper says</th><th>Write</th></tr></thead>
<tbody>
<tr><td><code>SpecX(color: int, owner: String, price: int)</code></td><td>parameters in THAT order, then <code>super(owner, price); this.color = color;</code> — not in the parent's order</td></tr>
<tr><td>"the 2nd character" / "the 3rd character"</td><td>position k = index k − 1: <code>s.substring(0, k - 1) + "XX" + s.substring(k)</code></td></tr>
<tr><td>"replace … with" a character found by POSITION</td><td>build the string by position — <code>String.replace</code> replaces every equal character</td></tr>
<tr><td>"the last alphabetic character" / "the first digit of price"</td><td>scan with <code>Character.isLetter</code>; first digit = <code>String.valueOf(price).charAt(0)</code>, last = <code>price % 10</code></td></tr>
<tr><td>"is odd"</td><td><code>x % 2 != 0</code> (true for −3 too); "is even" <code>x % 2 == 0</code></td></tr>
<tr><td>"case-sensitive" (PE2) / nothing said</td><td><code>equals</code> — <code>equalsIgnoreCase</code> only when the paper says so</td></tr>
<tr><td>"(no space after comma)" / "format: owner, price"</td><td>copy it; the parent's format is tested in TC1 as well</td></tr>
<tr><td>"Do not format the result"</td><td>the double as Java prints it; 2 decimals only where written</td></tr>
</tbody>
</table>
<p class="meo">🧠 Inside the subclass, the parent's fields are <code>private</code>: you <strong>cannot</strong> write <code>owner = …</code> (section 7 shows the real compile error). Read with <code>getOwner()</code>, write with <code>setOwner(…)</code>. If the box gives the parent no setter for the field you must change (PE6 has <code>setBrand</code>, PE10 <code>setColor</code>, PE11 <code>setType</code> — they are there for this reason), look again: the paper always provides one.</p>`,
    `<h2>2. Mẹo đọc đề cho câu 2</h2>
<table>
<thead><tr><th>Đề viết</th><th>Hãy viết</th></tr></thead>
<tbody>
<tr><td><code>SpecX(color: int, owner: String, price: int)</code></td><td>tham số theo ĐÚNG thứ tự đó, rồi <code>super(owner, price); this.color = color;</code> — đừng theo thứ tự của cha</td></tr>
<tr><td>"ký tự thứ 2" / "ký tự thứ 3"</td><td>vị trí k = chỉ số k − 1: <code>s.substring(0, k - 1) + "XX" + s.substring(k)</code></td></tr>
<tr><td>"thay … bằng" một ký tự xác định theo VỊ TRÍ</td><td>dựng chuỗi theo vị trí — <code>String.replace</code> thay mọi ký tự giống nhau</td></tr>
<tr><td>"chữ cái cuối cùng" / "chữ số đầu của price"</td><td>quét bằng <code>Character.isLetter</code>; chữ số đầu = <code>String.valueOf(price).charAt(0)</code>, chữ số cuối = <code>price % 10</code></td></tr>
<tr><td>"là số lẻ"</td><td><code>x % 2 != 0</code> (đúng cả với −3); "là số chẵn" <code>x % 2 == 0</code></td></tr>
<tr><td>"phân biệt hoa thường" (PE2) / không nói gì</td><td><code>equals</code> — chỉ dùng <code>equalsIgnoreCase</code> khi đề nói vậy</td></tr>
<tr><td>"(không có dấu cách sau dấu phẩy)" / "định dạng: owner, price"</td><td>chép y nguyên; định dạng của lớp cha cũng bị kiểm ở TC1</td></tr>
<tr><td>"Do not format the result"</td><td>số double như Java tự in; 2 chữ số thập phân chỉ ở chỗ đề ghi</td></tr>
</tbody>
</table>
<p class="meo">🧠 Bên trong lớp con, các trường của cha là <code>private</code>: bạn <strong>không thể</strong> viết <code>owner = …</code> (mục 7 cho xem lỗi biên dịch thật). Đọc bằng <code>getOwner()</code>, ghi bằng <code>setOwner(…)</code>. Nếu hộp UML không cho lớp cha setter của trường bạn phải đổi (PE6 có <code>setBrand</code>, PE10 có <code>setColor</code>, PE11 có <code>setType</code> — chúng có mặt chính vì lý do này), hãy đọc lại: đề luôn cho sẵn một cái.</p>`),
    bi(`<h2>3. The frame for type 2</h2>
<pre><code class="language-java">public class X {
    private String a;
    private int b;

    public X() {                              // SpecX() calls this silently: never leave it out
    }

    public X(String a, int b) {
        this.a = a;
        this.b = b;
    }

    public String getA() { return a; }
    public int getB() { return b; }
    public void setA(String a) { this.a = a; }

    @Override
    public String toString() {
        return a + ", " + b;                  // the parent's own format, tested in TC1
    }
}

class SpecX extends X {                       // in the exam: its own file SpecX.java, or here without "public"
    private int c;                            // ONLY the new field — never re-declare a and b

    public SpecX() {
    }

    public SpecX(int c, String a, int b) {    // the ORDER of the box
        super(a, b);                          // the very first statement
        this.c = c;
    }

    @Override
    public String toString() {
        return super.toString() + ", " + c;   // reuse, do not rebuild
    }

    public void setData() {
        String s = getA();                    // read the private field of X
        setA(s.substring(0, 1) + "XX" + s.substring(2));   // write it back
    }

    public int getValue() {                   // int or String: exactly as in the box
        return c % 2 != 0 ? getB() + 3 : getB() + 7;
    }
}</code></pre>
<p>Timing: about <strong>20 minutes</strong> — 3 to compute the samples by hand, 5 for the parent (Alt+Insert does most of it), 7 for the subclass, 5 to run every sample of all three test cases.</p>`,
    `<h2>3. Khung code cho dạng 2</h2>
<pre><code class="language-java">public class X {
    private String a;
    private int b;

    public X() {                              // SpecX() ngầm gọi cái này: đừng bao giờ bỏ
    }

    public X(String a, int b) {
        this.a = a;
        this.b = b;
    }

    public String getA() { return a; }
    public int getB() { return b; }
    public void setA(String a) { this.a = a; }

    @Override
    public String toString() {
        return a + ", " + b;                  // định dạng riêng của cha, bị kiểm ở TC1
    }
}

class SpecX extends X {                       // trong phòng thi: file SpecX.java riêng, hoặc để ở đây không có "public"
    private int c;                            // CHỈ trường mới — không bao giờ khai báo lại a và b

    public SpecX() {
    }

    public SpecX(int c, String a, int b) {    // THỨ TỰ của hộp UML
        super(a, b);                          // câu lệnh đầu tiên
        this.c = c;
    }

    @Override
    public String toString() {
        return super.toString() + ", " + c;   // dùng lại, không dựng lại
    }

    public void setData() {
        String s = getA();                    // đọc trường private của X
        setA(s.substring(0, 1) + "XX" + s.substring(2));   // ghi lại
    }

    public int getValue() {                   // int hay String: đúng như trong hộp
        return c % 2 != 0 ? getB() + 3 : getB() + 7;
    }
}</code></pre>
<p>Thời gian: khoảng <strong>20 phút</strong> — 3 phút tính tay các mẫu, 5 phút cho lớp cha (Alt+Insert làm gần hết), 7 phút cho lớp con, 5 phút chạy mọi mẫu của cả ba test case.</p>`),
    bi(`<h2>4. Solved paper 1 — PE4 (SU26) question 2: Cala and SpecCala</h2>
<p>Paper: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 4 (SU26)</a>, question 2. <code>Cala(owner, price)</code> with <code>toString()</code> "owner, price"; <code>SpecCala(color, owner, price)</code> with <code>toString()</code> "owner, price, color", <code>setData()</code> — replace the 2nd character of owner with "XX", <code>getValue()</code> — color odd ⇒ price + 3, otherwise price + 7.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/21ad49c21838ebefffb707d5ae8098b5732d6699.svg" alt="PE4 question 2: the parent, the subclass, and what the given Main calls in each TC" loading="lazy" /><p class="chu-thich">🧩 PE4 question 2: the parent, the subclass, and what the given Main calls in each TC</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title PE4 question 2 — Cala and SpecCala(color, owner, price)
class Cala {
  - owner : String
  - price : int
  --
  + Cala()
  + Cala(owner : String, price : int)
  + getOwner() : String
  + getPrice() : int
  + setOwner(owner : String) : void
  + toString() : String
}
class SpecCala {
  - color : int
  --
  + SpecCala()
  + SpecCala(color : int, owner : String, price : int)
  + toString() : String
  + setData() : void
  + getValue() : int
}
class Main &lt;&lt;given .class&gt;&gt; {
  + {static} main(args : String[]) : void
}
Cala &lt;|-- SpecCala
Main ..&gt; Cala : TC1 prints both toString()
Main ..&gt; SpecCala : TC2 setData() then\\ngetOwner() + "," + getPrice()
note bottom of SpecCala
  super(owner, price) first,
  then this.color = color.
  owner is private in Cala:
  setData() uses getOwner()/setOwner()
end note
@enduml</code></pre></details>
<p>By hand: "alan" → a + XX + an = <strong>aXXan</strong>; color 5 → 3 + 3 = <strong>6</strong>; color 4 → 3 + 7 = <strong>10</strong>.</p>
<details><summary>Solution (our own code, run on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Cala {
    private String owner;
    private int price;

    public Cala() {                                          // needed: SpecCala() calls super() silently
    }

    public Cala(String owner, int price) {
        this.owner = owner;
        this.price = price;
    }

    public String getOwner() { return owner; }
    public int getPrice() { return price; }
    public void setOwner(String owner) { this.owner = owner; }

    @Override
    public String toString() {
        return owner + ", " + price;                         // "owner, price": comma AND space
    }
}</code></pre>
<pre class="trich"><code class="language-java">class SpecCala extends Cala {
    private int color;                                       // ONLY the new field — owner and price live in Cala

    public SpecCala() {
    }

    // the box says SpecCala(color, owner, price): color FIRST, but super() takes (owner, price)
    public SpecCala(int color, String owner, int price) {
        super(owner, price);
        this.color = color;
    }

    @Override
    public String toString() {
        return super.toString() + ", " + color;              // reuse the parent's "owner, price"
    }

    // "Replace the 2nd character in owner with the string XX" — position 2 = index 1
    public void setData() {
        String o = getOwner();                               // owner is private in Cala: go through the getter/setter
        if (o == null || o.length() &lt; 2) {
            return;                                          // no 2nd character, nothing to replace
        }
        setOwner(o.substring(0, 1) + "XX" + o.substring(2));
    }

    // odd color ⇒ price + 3, otherwise price + 7; "% 2 != 0" is also right for negative numbers
    public int getValue() {
        return color % 2 != 0 ? getPrice() + 3 : getPrice() + 7;
    }
}</code></pre>
<p>Why each line: <code>Cala()</code> exists because <code>SpecCala()</code> compiles to a call of <code>super()</code> — without it nothing compiles (section 7). The 3-argument constructor takes <code>color</code> first, as the box says, and hands the other two to <code>super</code>. <code>setData()</code> goes through <code>getOwner()</code>/<code>setOwner()</code> and builds the new string by position. <code>getValue()</code> tests <code>% 2 != 0</code>, which is also right for −3.</p>
</details>
<p>The given Main, rebuilt from its byte code. Look at TC2: Main prints <code>getOwner() + "," + getPrice()</code> itself — that is why the sample shows <code>aXXan,3</code> without a space even though your <code>toString()</code> has one.</p>
<pre class="trich"><code class="language-java">// Stand-in for the given Main.class (javap -c). TC2 prints getOwner() + "," + getPrice() itself — NO space
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter owner: ");
        String owner = sc.nextLine();
        System.out.print("Enter price: ");
        int price = sc.nextInt();
        System.out.print("Enter color: ");
        int color = sc.nextInt();
        System.out.println("1.Test toString()");
        System.out.println("2.Test setData()");
        System.out.println("3.Test getValue()");
        System.out.print("Enter TC(1,2,3): ");
        int tc = sc.nextInt();
        Cala cala = new Cala(owner, price);
        SpecCala spec = new SpecCala(color, owner, price);
        switch (tc) {
            case 1:
                System.out.println("OUTPUT:");
                System.out.println(cala.toString());
                System.out.println(spec.toString());
                break;
            case 2:
                System.out.println("OUTPUT:");
                spec.setData();
                System.out.println(spec.getOwner() + "," + spec.getPrice());
                break;
            case 3:
                System.out.println("OUTPUT:");
                System.out.println(spec.getValue());
                break;
        }
    }
}</code></pre>
<p>Input (the four samples, plus a negative odd color of our own):</p>
<pre><code class="language-plaintext"># TC1 toString (paper sample 1)
alan
3
4
1
# TC2 setData (paper sample 2)
alan
3
4
2
# TC3 getValue, odd color (paper sample 3)
alan
3
5
3
# TC3 getValue, even color (paper sample 4)
alan
3
4
3
# TC3 again, own test: negative odd color
binh
5
-3
3</code></pre>
<pre class="trich"><code class="language-java">public class PeQ2Cala {
    static final String[] MAU = {
        "alan, 3\\nalan, 3, 4",             // paper sample 1: two lines, Cala then SpecCala
        "aXXan,3",                         // paper sample 2
        "6",                               // paper sample 3: color 5 is odd
        "10",                              // paper sample 4: color 4 is even
        "8",                               // own test: color -3 is odd too ⇒ 5 + 3
    };

    public static void main(String[] args) throws Exception {
        chamCacLanChay(MAU);
    }</code></pre>
<div class="out">=== TC1 toString (paper sample 1) ===<br>
Enter owner: Enter price: Enter color: 1.Test toString()<br>
2.Test setData()<br>
3.Test getValue()<br>
Enter TC(1,2,3): OUTPUT:<br>
alan, 3<br>
alan, 3, 4<br>
-&gt; PASS<br>
=== TC2 setData (paper sample 2) ===<br>
Enter owner: Enter price: Enter color: 1.Test toString()<br>
2.Test setData()<br>
3.Test getValue()<br>
Enter TC(1,2,3): OUTPUT:<br>
aXXan,3<br>
-&gt; PASS<br>
=== TC3 getValue, odd color (paper sample 3) ===<br>
Enter owner: Enter price: Enter color: 1.Test toString()<br>
2.Test setData()<br>
3.Test getValue()<br>
Enter TC(1,2,3): OUTPUT:<br>
6<br>
-&gt; PASS<br>
=== TC3 getValue, even color (paper sample 4) ===<br>
Enter owner: Enter price: Enter color: 1.Test toString()<br>
2.Test setData()<br>
3.Test getValue()<br>
Enter TC(1,2,3): OUTPUT:<br>
10<br>
-&gt; PASS<br>
=== TC3 again, own test: negative odd color ===<br>
Enter owner: Enter price: Enter color: 1.Test toString()<br>
2.Test setData()<br>
3.Test getValue()<br>
Enter TC(1,2,3): OUTPUT:<br>
8<br>
-&gt; PASS<br>
5/5 runs match the expected output</div>
<p>This Main reads price and color with <code>nextInt()</code> right after a <code>nextLine()</code> — fine with piped input, and a good reason never to change the given Main: it works, it is just not written the way you would write it.</p>`,
    `<h2>4. Giải mẫu 1 — đề PE4 (SU26) câu 2: Cala và SpecCala</h2>
<p>Đề: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 4 (SU26)</a>, câu 2. <code>Cala(owner, price)</code> với <code>toString()</code> "owner, price"; <code>SpecCala(color, owner, price)</code> với <code>toString()</code> "owner, price, color", <code>setData()</code> — thay ký tự thứ 2 của owner bằng "XX", <code>getValue()</code> — color lẻ ⇒ price + 3, ngược lại price + 7.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/21ad49c21838ebefffb707d5ae8098b5732d6699.svg" alt="Câu 2 đề PE4: lớp cha, lớp con, và thứ Main đề cho gọi ở từng TC" loading="lazy" /><p class="chu-thich">🧩 Câu 2 đề PE4: lớp cha, lớp con, và thứ Main đề cho gọi ở từng TC</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title PE4 question 2 — Cala and SpecCala(color, owner, price)
class Cala {
  - owner : String
  - price : int
  --
  + Cala()
  + Cala(owner : String, price : int)
  + getOwner() : String
  + getPrice() : int
  + setOwner(owner : String) : void
  + toString() : String
}
class SpecCala {
  - color : int
  --
  + SpecCala()
  + SpecCala(color : int, owner : String, price : int)
  + toString() : String
  + setData() : void
  + getValue() : int
}
class Main &lt;&lt;given .class&gt;&gt; {
  + {static} main(args : String[]) : void
}
Cala &lt;|-- SpecCala
Main ..&gt; Cala : TC1 prints both toString()
Main ..&gt; SpecCala : TC2 setData() then\\ngetOwner() + "," + getPrice()
note bottom of SpecCala
  super(owner, price) first,
  then this.color = color.
  owner is private in Cala:
  setData() uses getOwner()/setOwner()
end note
@enduml</code></pre></details>
<p>Tính tay: "alan" → a + XX + an = <strong>aXXan</strong>; color 5 → 3 + 3 = <strong>6</strong>; color 4 → 3 + 7 = <strong>10</strong>.</p>
<details><summary>Lời giải (code tự viết, chạy trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Cala {
    private String owner;
    private int price;

    public Cala() {                                          // cần có: SpecCala() ngầm gọi super()
    }

    public Cala(String owner, int price) {
        this.owner = owner;
        this.price = price;
    }

    public String getOwner() { return owner; }
    public int getPrice() { return price; }
    public void setOwner(String owner) { this.owner = owner; }

    @Override
    public String toString() {
        return owner + ", " + price;                         // "owner, price": phẩy VÀ cách
    }
}</code></pre>
<pre class="trich"><code class="language-java">class SpecCala extends Cala {
    private int color;                                       // CHỈ trường mới — owner và price nằm ở Cala

    public SpecCala() {
    }

    // hộp ghi SpecCala(color, owner, price): color ĐỨNG ĐẦU, còn super() nhận (owner, price)
    public SpecCala(int color, String owner, int price) {
        super(owner, price);
        this.color = color;
    }

    @Override
    public String toString() {
        return super.toString() + ", " + color;              // dùng lại "owner, price" của cha
    }

    // "Thay ký tự thứ 2 của owner bằng chuỗi XX" — vị trí 2 = chỉ số 1
    public void setData() {
        String o = getOwner();                               // owner là private trong Cala: đi qua getter/setter
        if (o == null || o.length() &lt; 2) {
            return;                                          // không có ký tự thứ 2 thì không thay gì
        }
        setOwner(o.substring(0, 1) + "XX" + o.substring(2));
    }

    // color lẻ ⇒ price + 3, ngược lại price + 7; "% 2 != 0" đúng cả với số âm
    public int getValue() {
        return color % 2 != 0 ? getPrice() + 3 : getPrice() + 7;
    }
}</code></pre>
<p>Vì sao từng dòng: <code>Cala()</code> phải có vì <code>SpecCala()</code> được biên dịch thành một lời gọi <code>super()</code> — thiếu nó là không gì biên dịch nổi (mục 7). Constructor 3 tham số nhận <code>color</code> trước, đúng như hộp UML, rồi chuyển hai tham số còn lại cho <code>super</code>. <code>setData()</code> đi qua <code>getOwner()</code>/<code>setOwner()</code> và dựng chuỗi mới theo vị trí. <code>getValue()</code> kiểm <code>% 2 != 0</code>, đúng cả với −3.</p>
</details>
<p>Main đề cho, dựng lại từ byte code. Nhìn TC2: Main tự in <code>getOwner() + "," + getPrice()</code> — vì vậy mẫu hiện <code>aXXan,3</code> không có dấu cách dù <code>toString()</code> của bạn có.</p>
<pre class="trich"><code class="language-java">// Bản thay cho Main.class đề cho (javap -c). TC2 tự in getOwner() + "," + getPrice() — KHÔNG dấu cách
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter owner: ");
        String owner = sc.nextLine();
        System.out.print("Enter price: ");
        int price = sc.nextInt();
        System.out.print("Enter color: ");
        int color = sc.nextInt();
        System.out.println("1.Test toString()");
        System.out.println("2.Test setData()");
        System.out.println("3.Test getValue()");
        System.out.print("Enter TC(1,2,3): ");
        int tc = sc.nextInt();
        Cala cala = new Cala(owner, price);
        SpecCala spec = new SpecCala(color, owner, price);
        switch (tc) {
            case 1:
                System.out.println("OUTPUT:");
                System.out.println(cala.toString());
                System.out.println(spec.toString());
                break;
            case 2:
                System.out.println("OUTPUT:");
                spec.setData();
                System.out.println(spec.getOwner() + "," + spec.getPrice());
                break;
            case 3:
                System.out.println("OUTPUT:");
                System.out.println(spec.getValue());
                break;
        }
    }
}</code></pre>
<p>Dữ liệu vào (bốn mẫu của đề, cộng một color lẻ âm tự thêm):</p>
<pre><code class="language-plaintext"># TC1 toString (paper sample 1)
alan
3
4
1
# TC2 setData (paper sample 2)
alan
3
4
2
# TC3 getValue, odd color (paper sample 3)
alan
3
5
3
# TC3 getValue, even color (paper sample 4)
alan
3
4
3
# TC3 again, own test: negative odd color
binh
5
-3
3</code></pre>
<pre class="trich"><code class="language-java">public class PeQ2Cala {
    static final String[] MAU = {
        "alan, 3\\nalan, 3, 4",             // mẫu 1 của đề: hai dòng, Cala rồi SpecCala
        "aXXan,3",                         // mẫu 2 của đề
        "6",                               // mẫu 3: color 5 lẻ
        "10",                              // mẫu 4: color 4 chẵn
        "8",                               // TC tự thêm: color -3 cũng lẻ ⇒ 5 + 3
    };

    public static void main(String[] args) throws Exception {
        chamCacLanChay(MAU);
    }</code></pre>
<div class="out">=== TC1 toString (paper sample 1) ===<br>
Enter owner: Enter price: Enter color: 1.Test toString()<br>
2.Test setData()<br>
3.Test getValue()<br>
Enter TC(1,2,3): OUTPUT:<br>
alan, 3<br>
alan, 3, 4<br>
-&gt; PASS<br>
=== TC2 setData (paper sample 2) ===<br>
Enter owner: Enter price: Enter color: 1.Test toString()<br>
2.Test setData()<br>
3.Test getValue()<br>
Enter TC(1,2,3): OUTPUT:<br>
aXXan,3<br>
-&gt; PASS<br>
=== TC3 getValue, odd color (paper sample 3) ===<br>
Enter owner: Enter price: Enter color: 1.Test toString()<br>
2.Test setData()<br>
3.Test getValue()<br>
Enter TC(1,2,3): OUTPUT:<br>
6<br>
-&gt; PASS<br>
=== TC3 getValue, even color (paper sample 4) ===<br>
Enter owner: Enter price: Enter color: 1.Test toString()<br>
2.Test setData()<br>
3.Test getValue()<br>
Enter TC(1,2,3): OUTPUT:<br>
10<br>
-&gt; PASS<br>
=== TC3 again, own test: negative odd color ===<br>
Enter owner: Enter price: Enter color: 1.Test toString()<br>
2.Test setData()<br>
3.Test getValue()<br>
Enter TC(1,2,3): OUTPUT:<br>
8<br>
-&gt; PASS<br>
5/5 runs match the expected output</div>
<p>Main này đọc price và color bằng <code>nextInt()</code> ngay sau một <code>nextLine()</code> — với dữ liệu đổ qua pipe thì vẫn ổn, và là một lý do để không bao giờ sửa Main đề cho: nó chạy đúng, chỉ là không viết theo cách bạn sẽ viết.</p>`),
    bi(`<h2>5. Solved paper 2 — PE11 (SU26) question 2: Ladder and SpecLadder</h2>
<p>Paper: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 11 (SU26)</a>, question 2. <code>Ladder(type, price)</code>, "type, price"; <code>SpecLadder(type, price, weight)</code>, "type, price, weight"; <code>setData()</code> — replace the last alphabetic character in type with the last digit of price; <code>getValue()</code> — if weight contains at least two even digits, type + the number of even digits, otherwise type + the total number of digits.</p>
<p>By hand: "standard", price 21 → last letter <code>d</code> becomes <code>1</code> → <strong>standar1</strong>; weight 24 → digits 2, 4 both even → <strong>standard2</strong>; weight 135 → no even digit → 3 digits → <strong>standard3</strong>.</p>
<details><summary>Solution (run on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Ladder {
    private String type;
    private int price;

    public Ladder() {
    }

    public Ladder(String type, int price) {
        this.type = type;
        this.price = price;
    }

    public String getType() { return type; }
    public int getPrice() { return price; }
    public void setType(String type) { this.type = type; }

    @Override
    public String toString() {
        return type + ", " + price;
    }
}</code></pre>
<pre class="trich"><code class="language-java">class SpecLadder extends Ladder {
    private int weight;

    public SpecLadder() {
    }

    public SpecLadder(String type, int price, int weight) {
        super(type, price);
        this.weight = weight;
    }

    public int getWeight() { return weight; }

    @Override
    public String toString() {
        return super.toString() + ", " + weight;
    }

    // replace the LAST alphabetic character of type by the LAST digit of price
    public void setData() {
        String t = getType();
        char lastDigit = (char) ('0' + Math.abs(getPrice() % 10));   // 21 % 10 = 1 ⇒ '1'; abs() for a negative price
        for (int i = t.length() - 1; i &gt;= 0; i--) {                    // walk from the END: the first letter met is the last one
            if (Character.isLetter(t.charAt(i))) {
                setType(t.substring(0, i) + lastDigit + t.substring(i + 1));
                return;                                                // ONE character only
            }
        }
    }

    // &gt;= 2 even digits in weight ⇒ type + evenCount, otherwise type + number of digits
    public String getValue() {
        String digits = String.valueOf(Math.abs(weight));             // as text: weight 0 still has ONE digit
        int even = 0;
        for (int i = 0; i &lt; digits.length(); i++) {
            if ((digits.charAt(i) - '0') % 2 == 0) {
                even++;
            }
        }
        return getType() + (even &gt;= 2 ? even : digits.length());
    }
}</code></pre>
<p>Decisions: scanning <code>setData()</code> from the end makes "the last letter" literal — digits and symbols at the end are skipped; <code>Math.abs</code> keeps a negative price from producing a minus sign; <code>getValue()</code> counts digits on the <em>text</em> of weight, so weight 0 has one digit (an arithmetic <code>while (w &gt; 0)</code> loop would count zero digits).</p>
</details>
<pre class="trich"><code class="language-java">// Stand-in for the given Main.class (javap -c): TC2 prints "%s, %d" from getType()/getPrice(), not toString()
class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        System.out.println();
        System.out.print("Enter type: ");
        String type = sc.nextLine();
        System.out.print("Enter price: ");
        int price = sc.nextInt();
        sc.nextLine();
        System.out.print("Enter weight: ");
        int weight = sc.nextInt();
        sc.nextLine();
        System.out.println("1. Test toString()");
        System.out.println("2. Test setData()");
        System.out.println("3. Test getValue()");
        System.out.print("Enter TC (1,2,3): ");
        int tc = sc.nextInt();
        sc.nextLine();
        System.out.println("OUTPUT:");
        switch (tc) {
            case 1:
                System.out.println(new Ladder(type, price));
                System.out.println(new SpecLadder(type, price, weight));
                break;
            case 2:
                SpecLadder s = new SpecLadder(type, price, weight);
                s.setData();
                System.out.printf("%s, %d\\n", s.getType(), s.getPrice());
                break;
            case 3:
                System.out.printf("%s\\n", new SpecLadder(type, price, weight).getValue());
                break;
        }
        System.out.println();
    }
}</code></pre>
<div class="out">=== TC1 toString (paper sample 1) ===<br>
Enter type: Enter price: Enter weight: 1. Test toString()<br>
2. Test setData()<br>
3. Test getValue()<br>
Enter TC (1,2,3): OUTPUT:<br>
standard, 100<br>
standard, 100, 50<br>
-&gt; PASS<br>
=== TC2 setData (paper sample 2) ===<br>
Enter type: Enter price: Enter weight: 1. Test toString()<br>
2. Test setData()<br>
3. Test getValue()<br>
Enter TC (1,2,3): OUTPUT:<br>
standar1, 21<br>
-&gt; PASS<br>
=== TC3 getValue, weight 24 (paper sample 3) ===<br>
Enter type: Enter price: Enter weight: 1. Test toString()<br>
2. Test setData()<br>
3. Test getValue()<br>
Enter TC (1,2,3): OUTPUT:<br>
standard2<br>
-&gt; PASS<br>
=== TC3 getValue, weight 135 (paper sample 4) ===<br>
Enter type: Enter price: Enter weight: 1. Test toString()<br>
2. Test setData()<br>
3. Test getValue()<br>
Enter TC (1,2,3): OUTPUT:<br>
standard3<br>
-&gt; PASS<br>
=== TC2 again, own test: type with a digit at the end ===<br>
Enter type: Enter price: Enter weight: 1. Test toString()<br>
2. Test setData()<br>
3. Test getValue()<br>
Enter TC (1,2,3): OUTPUT:<br>
Type-91, 19<br>
-&gt; PASS<br>
=== TC3 again, own test: weight 0 ===<br>
Enter type: Enter price: Enter weight: 1. Test toString()<br>
2. Test setData()<br>
3. Test getValue()<br>
Enter TC (1,2,3): OUTPUT:<br>
pine1<br>
-&gt; PASS<br>
6/6 runs match the expected output</div>
<p>Our two extra runs test the edges the paper's samples do not: <code>Type-A1</code> ends with a digit, so the last LETTER is the <code>A</code> (→ <code>Type-91</code>), and weight 0 has one even digit, which is fewer than two, so the answer is type + 1 digit.</p>
<div class="pitfall">PE12 and PE13 reuse this question with every rule <strong>mirrored</strong>: FIRST letter, FIRST digit of price (<code>String.valueOf(price).charAt(0)</code>, not <code>% 10</code>), ODD digits. A solution remembered from PE11 fails all three test cases of PE12 — read the verbs every time.</div>`,
    `<h2>5. Giải mẫu 2 — đề PE11 (SU26) câu 2: Ladder và SpecLadder</h2>
<p>Đề: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 11 (SU26)</a>, câu 2. <code>Ladder(type, price)</code>, "type, price"; <code>SpecLadder(type, price, weight)</code>, "type, price, weight"; <code>setData()</code> — thay chữ cái cuối cùng trong type bằng chữ số cuối của price; <code>getValue()</code> — nếu weight có ít nhất hai chữ số chẵn thì trả type + số chữ số chẵn, ngược lại type + tổng số chữ số.</p>
<p>Tính tay: "standard", price 21 → chữ cái cuối <code>d</code> thành <code>1</code> → <strong>standar1</strong>; weight 24 → 2, 4 đều chẵn → <strong>standard2</strong>; weight 135 → không có chữ số chẵn → 3 chữ số → <strong>standard3</strong>.</p>
<details><summary>Lời giải (chạy trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Ladder {
    private String type;
    private int price;

    public Ladder() {
    }

    public Ladder(String type, int price) {
        this.type = type;
        this.price = price;
    }

    public String getType() { return type; }
    public int getPrice() { return price; }
    public void setType(String type) { this.type = type; }

    @Override
    public String toString() {
        return type + ", " + price;
    }
}</code></pre>
<pre class="trich"><code class="language-java">class SpecLadder extends Ladder {
    private int weight;

    public SpecLadder() {
    }

    public SpecLadder(String type, int price, int weight) {
        super(type, price);
        this.weight = weight;
    }

    public int getWeight() { return weight; }

    @Override
    public String toString() {
        return super.toString() + ", " + weight;
    }

    // thay chữ cái CUỐI của type bằng chữ số CUỐI của price
    public void setData() {
        String t = getType();
        char lastDigit = (char) ('0' + Math.abs(getPrice() % 10));   // 21 % 10 = 1 ⇒ '1'; abs() cho giá âm
        for (int i = t.length() - 1; i &gt;= 0; i--) {                    // đi từ CUỐI: chữ cái gặp đầu tiên là chữ cuối
            if (Character.isLetter(t.charAt(i))) {
                setType(t.substring(0, i) + lastDigit + t.substring(i + 1));
                return;                                                // chỉ MỘT ký tự
            }
        }
    }

    // weight có &gt;= 2 chữ số chẵn ⇒ type + số chữ số chẵn, ngược lại type + số chữ số
    public String getValue() {
        String digits = String.valueOf(Math.abs(weight));             // dạng chữ: weight 0 vẫn có MỘT chữ số
        int even = 0;
        for (int i = 0; i &lt; digits.length(); i++) {
            if ((digits.charAt(i) - '0') % 2 == 0) {
                even++;
            }
        }
        return getType() + (even &gt;= 2 ? even : digits.length());
    }
}</code></pre>
<p>Các quyết định: quét <code>setData()</code> từ cuối làm "chữ cái cuối" đúng theo nghĩa đen — chữ số và ký hiệu ở cuối được bỏ qua; <code>Math.abs</code> giữ cho giá âm không sinh ra dấu trừ; <code>getValue()</code> đếm chữ số trên <em>chuỗi</em> của weight, nên weight 0 có một chữ số (vòng lặp số học <code>while (w &gt; 0)</code> sẽ đếm ra không chữ số nào).</p>
</details>
<pre class="trich"><code class="language-java">// Bản thay cho Main.class đề cho (javap -c): TC2 in "%s, %d" từ getType()/getPrice(), không gọi toString()
class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        System.out.println();
        System.out.print("Enter type: ");
        String type = sc.nextLine();
        System.out.print("Enter price: ");
        int price = sc.nextInt();
        sc.nextLine();
        System.out.print("Enter weight: ");
        int weight = sc.nextInt();
        sc.nextLine();
        System.out.println("1. Test toString()");
        System.out.println("2. Test setData()");
        System.out.println("3. Test getValue()");
        System.out.print("Enter TC (1,2,3): ");
        int tc = sc.nextInt();
        sc.nextLine();
        System.out.println("OUTPUT:");
        switch (tc) {
            case 1:
                System.out.println(new Ladder(type, price));
                System.out.println(new SpecLadder(type, price, weight));
                break;
            case 2:
                SpecLadder s = new SpecLadder(type, price, weight);
                s.setData();
                System.out.printf("%s, %d\\n", s.getType(), s.getPrice());
                break;
            case 3:
                System.out.printf("%s\\n", new SpecLadder(type, price, weight).getValue());
                break;
        }
        System.out.println();
    }
}</code></pre>
<div class="out">=== TC1 toString (paper sample 1) ===<br>
Enter type: Enter price: Enter weight: 1. Test toString()<br>
2. Test setData()<br>
3. Test getValue()<br>
Enter TC (1,2,3): OUTPUT:<br>
standard, 100<br>
standard, 100, 50<br>
-&gt; PASS<br>
=== TC2 setData (paper sample 2) ===<br>
Enter type: Enter price: Enter weight: 1. Test toString()<br>
2. Test setData()<br>
3. Test getValue()<br>
Enter TC (1,2,3): OUTPUT:<br>
standar1, 21<br>
-&gt; PASS<br>
=== TC3 getValue, weight 24 (paper sample 3) ===<br>
Enter type: Enter price: Enter weight: 1. Test toString()<br>
2. Test setData()<br>
3. Test getValue()<br>
Enter TC (1,2,3): OUTPUT:<br>
standard2<br>
-&gt; PASS<br>
=== TC3 getValue, weight 135 (paper sample 4) ===<br>
Enter type: Enter price: Enter weight: 1. Test toString()<br>
2. Test setData()<br>
3. Test getValue()<br>
Enter TC (1,2,3): OUTPUT:<br>
standard3<br>
-&gt; PASS<br>
=== TC2 again, own test: type with a digit at the end ===<br>
Enter type: Enter price: Enter weight: 1. Test toString()<br>
2. Test setData()<br>
3. Test getValue()<br>
Enter TC (1,2,3): OUTPUT:<br>
Type-91, 19<br>
-&gt; PASS<br>
=== TC3 again, own test: weight 0 ===<br>
Enter type: Enter price: Enter weight: 1. Test toString()<br>
2. Test setData()<br>
3. Test getValue()<br>
Enter TC (1,2,3): OUTPUT:<br>
pine1<br>
-&gt; PASS<br>
6/6 runs match the expected output</div>
<p>Hai lần chạy thêm kiểm những chỗ mẫu của đề không chạm tới: <code>Type-A1</code> kết thúc bằng chữ số, nên CHỮ CÁI cuối là <code>A</code> (→ <code>Type-91</code>), và weight 0 có một chữ số chẵn, ít hơn hai, nên đáp án là type + 1 chữ số.</p>
<div class="pitfall">PE12 và PE13 dùng lại câu này với mọi luật <strong>soi gương</strong>: chữ cái ĐẦU, chữ số ĐẦU của price (<code>String.valueOf(price).charAt(0)</code>, không phải <code>% 10</code>), chữ số LẺ. Một lời giải nhớ từ PE11 trượt cả ba test case của PE12 — mỗi lần đều phải đọc kỹ động từ.</div>`),
    bi(`<h2>6. Solved paper 3 — PE8 (SP25) question 2: Employee and Professor</h2>
<p>Paper: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 8 (SP25)</a>, question 2 — the "business" family. <code>Employee(id, name, standardSalary)</code>, <code>getName()</code> returns the name in upper case; <code>Professor(id, name, standardSalary, department)</code>, <code>getDepartment()</code> in upper case, <code>calculateActualSalary()</code> = standardSalary × K with K = 1.5 for "GD" or "gd", 2.0 for "IT" or "it", 1.0 otherwise; <code>toString()</code> — "id, name, department, actualSalary", salary with 2 decimals, name and department upper case.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/49e55cb0c0e8d7a06837230890d9e32c11c5347c.svg" alt="PE8 question 2: the parent already upper-cases, the child reuses it" loading="lazy" /><p class="chu-thich">🧩 PE8 question 2: the parent already upper-cases, the child reuses it</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title PE8 question 2 — Professor reuses the upper-casing getters of Employee
class Employee {
  - id : int
  - name : String
  - standardSalary : double
  --
  + Employee()
  + Employee(id : int, name : String, standardSalary : double)
  + getId() : int
  + getName() : String
  + getStandardSalary() : double
}
class Professor {
  - department : String
  --
  + Professor()
  + Professor(id, name, standardSalary, department)
  + getDepartment() : String
  + calculateActualSalary() : double
  + toString() : String
}
Employee &lt;|-- Professor
note right of Employee::getName
  returns name in UPPER case
end note
note right of Professor::toString
  getId() + ", " + getName() + ", "
  + getDepartment() + ", " + salary (%.2f)
end note
@enduml</code></pre></details>
<details><summary>Solution (run on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Employee {
    private int id;
    private String name;
    private double standardSalary;

    public Employee() {
    }

    public Employee(int id, String name, double standardSalary) {
        this.id = id;
        this.name = name;
        this.standardSalary = standardSalary;
    }

    public int getId() { return id; }
    public String getName() { return name.toUpperCase(); }          // "return the name ... in uppercase"
    public double getStandardSalary() { return standardSalary; }
}</code></pre>
<pre class="trich"><code class="language-java">class Professor extends Employee {
    private String department;

    public Professor() {                                              // listed under "Where:" although the box forgot it
    }

    public Professor(int id, String name, double standardSalary, String department) {
        super(id, name, standardSalary);
        this.department = department;
    }

    public String getDepartment() { return department.toUpperCase(); }

    // K = 1.5 for "GD"/"gd", 2.0 for "IT"/"it", 1.0 for every other department
    public double calculateActualSalary() {
        double k = 1.0;
        if (department.equalsIgnoreCase("GD")) {
            k = 1.5;
        } else if (department.equalsIgnoreCase("IT")) {
            k = 2.0;
        }
        return getStandardSalary() * k;
    }

    // "id, name, department, actualSalary" — getName()/getDepartment() already give the upper case
    @Override
    public String toString() {
        return getId() + ", " + getName() + ", " + getDepartment() + ", " + String.format("%.2f", calculateActualSalary());
    }
}</code></pre>
<p><code>toString()</code> calls <code>getName()</code> and <code>getDepartment()</code>, which already upper-case — no second <code>toUpperCase()</code>, and no access to the private <code>name</code> of Employee (which would not compile anyway). <code>Professor()</code> is written because the "Where:" list of the paper names it although the box forgot it.</p>
</details>
<pre class="trich"><code class="language-java">// Stand-in for the given Main.class (javap -c): it only ever builds a Professor; TC2 uses print, not println
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter id: ");
        int id = Integer.parseInt(sc.nextLine());
        System.out.print("Enter name: ");
        String name = sc.nextLine();
        System.out.print("Enter standard salary: ");
        double salary = Double.parseDouble(sc.nextLine());
        System.out.print("Enter department: ");
        String dep = sc.nextLine();
        System.out.println("1.Test calculateActualSalary()");
        System.out.println("2.Test toString()");
        System.out.print("Enter TC(1/2): ");
        int tc = sc.nextInt();
        Professor p = new Professor(id, name, salary, dep);
        System.out.println("OUTPUT:");
        if (tc == 1) {
            System.out.format("%.2f\\n", p.calculateActualSalary());
        }
        if (tc == 2) {
            System.out.print(p.toString());
        }
    }
}</code></pre>
<div class="out">=== TC1 calculateActualSalary, IT (paper sample 1) ===<br>
Enter id: Enter name: Enter standard salary: Enter department: 1.Test calculateActualSalary()<br>
2.Test toString()<br>
Enter TC(1/2): OUTPUT:<br>
10000.00<br>
-&gt; PASS<br>
=== TC1 calculateActualSalary, HR (paper sample 2) ===<br>
Enter id: Enter name: Enter standard salary: Enter department: 1.Test calculateActualSalary()<br>
2.Test toString()<br>
Enter TC(1/2): OUTPUT:<br>
5000.00<br>
-&gt; PASS<br>
=== TC2 toString, gd (paper sample 3) ===<br>
Enter id: Enter name: Enter standard salary: Enter department: 1.Test calculateActualSalary()<br>
2.Test toString()<br>
Enter TC(1/2): OUTPUT:<br>
1, DAVID, GD, 7500.00<br>
-&gt; PASS<br>
3/3 runs match the expected output</div>
<div class="meo">🧠 Not fully certain: the paper lists exactly "GD" or "gd" and "IT" or "it". <code>equalsIgnoreCase</code> accepts those four and also "Gd"; the literal reading (<code>equals("GD") || equals("gd")</code>) would give "Gd" K = 1.0. All three samples pass either way; we chose <code>equalsIgnoreCase</code> as the most natural reading of a paper that lists both cases. In the exam, when the samples cannot decide, choose one reading and write it in a comment.</div>`,
    `<h2>6. Giải mẫu 3 — đề PE8 (SP25) câu 2: Employee và Professor</h2>
<p>Đề: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 8 (SP25)</a>, câu 2 — họ "nghiệp vụ". <code>Employee(id, name, standardSalary)</code>, <code>getName()</code> trả tên viết hoa; <code>Professor(id, name, standardSalary, department)</code>, <code>getDepartment()</code> viết hoa, <code>calculateActualSalary()</code> = standardSalary × K với K = 1.5 cho "GD" hoặc "gd", 2.0 cho "IT" hoặc "it", 1.0 cho phòng khác; <code>toString()</code> — "id, name, department, actualSalary", lương 2 chữ số thập phân, tên và phòng viết hoa.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/49e55cb0c0e8d7a06837230890d9e32c11c5347c.svg" alt="Câu 2 đề PE8: lớp cha đã viết hoa sẵn, lớp con dùng lại" loading="lazy" /><p class="chu-thich">🧩 Câu 2 đề PE8: lớp cha đã viết hoa sẵn, lớp con dùng lại</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title PE8 question 2 — Professor reuses the upper-casing getters of Employee
class Employee {
  - id : int
  - name : String
  - standardSalary : double
  --
  + Employee()
  + Employee(id : int, name : String, standardSalary : double)
  + getId() : int
  + getName() : String
  + getStandardSalary() : double
}
class Professor {
  - department : String
  --
  + Professor()
  + Professor(id, name, standardSalary, department)
  + getDepartment() : String
  + calculateActualSalary() : double
  + toString() : String
}
Employee &lt;|-- Professor
note right of Employee::getName
  returns name in UPPER case
end note
note right of Professor::toString
  getId() + ", " + getName() + ", "
  + getDepartment() + ", " + salary (%.2f)
end note
@enduml</code></pre></details>
<details><summary>Lời giải (chạy trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Employee {
    private int id;
    private String name;
    private double standardSalary;

    public Employee() {
    }

    public Employee(int id, String name, double standardSalary) {
        this.id = id;
        this.name = name;
        this.standardSalary = standardSalary;
    }

    public int getId() { return id; }
    public String getName() { return name.toUpperCase(); }          // "trả về tên ... viết hoa"
    public double getStandardSalary() { return standardSalary; }
}</code></pre>
<pre class="trich"><code class="language-java">class Professor extends Employee {
    private String department;

    public Professor() {                                              // có trong "Where:" dù hộp UML quên ghi
    }

    public Professor(int id, String name, double standardSalary, String department) {
        super(id, name, standardSalary);
        this.department = department;
    }

    public String getDepartment() { return department.toUpperCase(); }

    // K = 1.5 với "GD"/"gd", 2.0 với "IT"/"it", 1.0 với mọi phòng khác
    public double calculateActualSalary() {
        double k = 1.0;
        if (department.equalsIgnoreCase("GD")) {
            k = 1.5;
        } else if (department.equalsIgnoreCase("IT")) {
            k = 2.0;
        }
        return getStandardSalary() * k;
    }

    // getName()/getDepartment() đã cho chữ hoa sẵn
    @Override
    public String toString() {
        return getId() + ", " + getName() + ", " + getDepartment() + ", " + String.format("%.2f", calculateActualSalary());
    }
}</code></pre>
<p><code>toString()</code> gọi <code>getName()</code> và <code>getDepartment()</code>, vốn đã viết hoa — không cần <code>toUpperCase()</code> lần hai, và không đụng tới <code>name</code> private của Employee (đằng nào cũng không biên dịch được). <code>Professor()</code> được viết vì danh sách "Where:" của đề có nêu nó dù hộp UML quên ghi.</p>
</details>
<pre class="trich"><code class="language-java">// Bản thay cho Main.class đề cho (javap -c): nó chỉ tạo Professor; TC2 dùng print, không phải println
class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter id: ");
        int id = Integer.parseInt(sc.nextLine());
        System.out.print("Enter name: ");
        String name = sc.nextLine();
        System.out.print("Enter standard salary: ");
        double salary = Double.parseDouble(sc.nextLine());
        System.out.print("Enter department: ");
        String dep = sc.nextLine();
        System.out.println("1.Test calculateActualSalary()");
        System.out.println("2.Test toString()");
        System.out.print("Enter TC(1/2): ");
        int tc = sc.nextInt();
        Professor p = new Professor(id, name, salary, dep);
        System.out.println("OUTPUT:");
        if (tc == 1) {
            System.out.format("%.2f\\n", p.calculateActualSalary());
        }
        if (tc == 2) {
            System.out.print(p.toString());
        }
    }
}</code></pre>
<div class="out">=== TC1 calculateActualSalary, IT (paper sample 1) ===<br>
Enter id: Enter name: Enter standard salary: Enter department: 1.Test calculateActualSalary()<br>
2.Test toString()<br>
Enter TC(1/2): OUTPUT:<br>
10000.00<br>
-&gt; PASS<br>
=== TC1 calculateActualSalary, HR (paper sample 2) ===<br>
Enter id: Enter name: Enter standard salary: Enter department: 1.Test calculateActualSalary()<br>
2.Test toString()<br>
Enter TC(1/2): OUTPUT:<br>
5000.00<br>
-&gt; PASS<br>
=== TC2 toString, gd (paper sample 3) ===<br>
Enter id: Enter name: Enter standard salary: Enter department: 1.Test calculateActualSalary()<br>
2.Test toString()<br>
Enter TC(1/2): OUTPUT:<br>
1, DAVID, GD, 7500.00<br>
-&gt; PASS<br>
3/3 runs match the expected output</div>
<div class="meo">🧠 Chỗ chưa chắc chắn hoàn toàn: đề liệt kê đúng "GD" hoặc "gd" và "IT" hoặc "it". <code>equalsIgnoreCase</code> nhận cả bốn và nhận thêm "Gd"; cách đọc theo nghĩa đen (<code>equals("GD") || equals("gd")</code>) sẽ cho "Gd" K = 1.0. Cả ba mẫu đều qua với cả hai cách; chúng tôi chọn <code>equalsIgnoreCase</code> vì đó là cách hiểu tự nhiên nhất khi đề đã liệt kê cả chữ hoa lẫn chữ thường. Trong phòng thi, khi mẫu không phân định được, hãy chọn một cách hiểu và ghi vào chú thích.</div>`),
    bi(`<h2>7. Thirteen ways to lose question 2 — each one measured</h2>
<p>Eight mistakes that compile and print something wrong (the "right" column is the correct pair of classes, run on the same data):</p>
<pre><code class="language-java">// release: 8
// Eight ways to lose the marks of a PE question 2 (super + Spec subclass), each compiled and run
import java.util.*;

// M1 — tostring() with a small s and no @Override: a NEW method, the parent's toString() still runs
class Cala1 {
    private String owner = "alan";
    private int price = 3;
    public String getOwner() { return owner; }
    public int getPrice() { return price; }
    @Override
    public String toString() { return owner + ", " + price; }
}
class SpecCala1 extends Cala1 {
    private int color = 4;
    public String tostring() { return super.toString() + ", " + color; }
}

// M2 — the child declares owner and price AGAIN: it fills its own copies, the parent's stay null and 0
class Cala2 {
    private String owner;
    private int price;
    public Cala2() { }
    public Cala2(String owner, int price) { this.owner = owner; this.price = price; }
    @Override
    public String toString() { return owner + ", " + price; }
}
class SpecCala2 extends Cala2 {
    private String owner;                                     // shadows Cala2.owner
    private int price;
    private int color;
    public SpecCala2(int color, String owner, int price) {
        this.owner = owner;                                   // no super(owner, price) ⇒ Cala2() ran
        this.price = price;
        this.color = color;
    }
    @Override
    public String toString() { return super.toString() + ", " + color; }
}

// M3 — PE4 SpecCala(color, owner, price): parameters copied in the order of the PARENT; price and color are both int, so it compiles
class SpecCala3 extends Cala2 {
    private int color;
    public SpecCala3(int color, String owner, int price) {
        super(owner, color);                                  // should be super(owner, price)
        this.color = price;
    }
    @Override
    public String toString() { return super.toString() + ", " + color; }
}

// the correct pair, used as "right" for M1–M3
class SpecCalaOk extends Cala2 {
    private int color;
    public SpecCalaOk(int color, String owner, int price) {
        super(owner, price);
        this.color = color;
    }
    @Override
    public String toString() { return super.toString() + ", " + color; }
}

public class LoiMatDiemQ2 {
    public static void main(String[] args) {
        Cala1 c1 = new SpecCala1();
        String ok = new SpecCalaOk(4, "alan", 3).toString();
        xem("M1 tostring() without @Override", "alan, 3, 4", c1.toString(), ok);

        xem("M2 fields declared twice", "alan, 3, 4", new SpecCala2(4, "alan", 3).toString(), ok);

        xem("M3 parameter order", "alan, 3, 4", new SpecCala3(4, "alan", 3).toString(), ok);

        // M4 — PE2 setData(): "Replace the 3rd character in name with KK"; "Harry" has TWO r's
        String name = "Harry";
        String sai4 = name.replace(String.valueOf(name.charAt(2)), "KK");        // replace() changes EVERY "r"
        String dung4 = name.substring(0, 2) + "KK" + name.substring(3);          // by POSITION
        xem("M4 replace() by value", "HaKKry", sai4, dung4);

        // M5 — PE4 "the 2nd character": position 2 is index 1
        String owner = "alan";
        xem("M5 off by one", "aXXan", owner.substring(0, 2) + "XX" + owner.substring(3), owner.substring(0, 1) + "XX" + owner.substring(2));

        // M6 — "color is odd": -3 % 2 is -1 in Java, so "== 1" calls a negative odd number even
        int color = -3, price = 5;
        xem("M6 odd test", "8", String.valueOf(color % 2 == 1 ? price + 3 : price + 7), String.valueOf(color % 2 != 0 ? price + 3 : price + 7));

        // M7 — PE2 getValue(): "department = it (case-sensitive)" — here equalsIgnoreCase is the BUG; the tester types "IT"
        String dep = "IT";
        int salary = 800;
        xem("M7 case-sensitive rule", "1700", String.valueOf(dep.equalsIgnoreCase("it") ? salary + 200 : salary + 900), String.valueOf(dep.equals("it") ? salary + 200 : salary + 900));

        // M8 — PE12, the mirror of PE11: "the FIRST digit of price" is not price % 10
        int p = 21;
        xem("M8 first digit", "2tandard", (p % 10) + "tandard", String.valueOf(p).charAt(0) + "tandard");
    }

    static void xem(String bay, String mau, String sai, String dung) {
        System.out.println(bay);
        System.out.println("   expected : " + mau);
        System.out.println("   wrong    : " + sai + (sai.equals(mau) ? "   PASS" : "   FAIL"));
        System.out.println("   right    : " + dung + (dung.equals(mau) ? "   PASS" : "   FAIL"));
    }
}</code></pre>
<div class="out">M1 tostring() without @Override<br>
&nbsp;&nbsp;&nbsp;expected : alan, 3, 4<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: alan, 3 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: alan, 3, 4 &nbsp;&nbsp;PASS<br>
M2 fields declared twice<br>
&nbsp;&nbsp;&nbsp;expected : alan, 3, 4<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: null, 0, 4 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: alan, 3, 4 &nbsp;&nbsp;PASS<br>
M3 parameter order<br>
&nbsp;&nbsp;&nbsp;expected : alan, 3, 4<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: alan, 4, 3 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: alan, 3, 4 &nbsp;&nbsp;PASS<br>
M4 replace() by value<br>
&nbsp;&nbsp;&nbsp;expected : HaKKry<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: HaKKKKy &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: HaKKry &nbsp;&nbsp;PASS<br>
M5 off by one<br>
&nbsp;&nbsp;&nbsp;expected : aXXan<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: alXXn &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: aXXan &nbsp;&nbsp;PASS<br>
M6 odd test<br>
&nbsp;&nbsp;&nbsp;expected : 8<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 12 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 8 &nbsp;&nbsp;PASS<br>
M7 case-sensitive rule<br>
&nbsp;&nbsp;&nbsp;expected : 1700<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 1000 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 1700 &nbsp;&nbsp;PASS<br>
M8 first digit<br>
&nbsp;&nbsp;&nbsp;expected : 2tandard<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 1tandard &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 2tandard &nbsp;&nbsp;PASS</div>
<p>Five that stop you earlier — run on a real JDK 8 against the PE4 harness. First a trick worth knowing: <code>javap -c Main</code> lists every method of YOUR class that the given Main calls, with its exact parameter and return types (<code>I</code> = int, <code>Ljava/lang/String;</code> = String, <code>V</code> = void). The exam lists Command Prompt among the allowed software, and <code>javap</code> ships with every JDK.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File q2 = new File("Q2");
    viet(q2, "Main.java", MAIN);
    viet(q2, "Cala.java", CALA);
    viet(q2, "SpecCala.java", SPEC);
    lenh(q2, "javac", "Main.java", "Cala.java", "SpecCala.java");          // = the given Main.class + your two classes
    lenhVao(q2, "alan\\n3\\n4\\n1\\n", "java", "Main");
    lenhLoc(q2, "Method SpecCala.", "javap", "-c", "Main");               // which methods of YOUR class Main calls, with their exact types

    System.out.println("\\n== A: Cala written without its no-argument constructor ==");
    viet(q2, "Cala.java", CALA.replace("    public Cala() {\\n    }\\n", ""));
    lenh(q2, "javac", "Cala.java", "SpecCala.java");
    viet(q2, "Cala.java", CALA);

    System.out.println("\\n== B: setData() touches the private field owner of Cala ==");
    viet(q2, "SpecCala.java", SPEC.replace("setOwner(o.substring(0, 1) + \\"XX\\" + o.substring(2));", "owner = o.substring(0, 1) + \\"XX\\" + o.substring(2);"));
    lenh(q2, "javac", "SpecCala.java");

    System.out.println("\\n== C: @Override on a misspelled tostring() ==");
    viet(q2, "SpecCala.java", SPEC.replace("public String toString()", "public String tostring()"));
    lenh(q2, "javac", "SpecCala.java");

    System.out.println("\\n== D: a line before super(owner, price) ==");
    viet(q2, "SpecCala.java", SPEC.replace("        super(owner, price);\\n        this.color = color;", "        this.color = color;\\n        super(owner, price);"));
    lenh(q2, "javac", "SpecCala.java");

    System.out.println("\\n== E: getValue() returns String (the habit of PE6/PE10/PE11), but PE4's Main calls int getValue() ==");
    viet(q2, "SpecCala.java", SPEC.replace("public int getValue() {\\n        return color % 2 != 0 ? getPrice() + 3 : getPrice() + 7;", "public String getValue() {\\n        return \\"\\" + (color % 2 != 0 ? getPrice() + 3 : getPrice() + 7);"));
    lenh(q2, "javac", "SpecCala.java");
    lenhVao(q2, "alan\\n3\\n5\\n3\\n", "java", "Main");
}</code></pre>
<div class="out">&gt; javac Main.java Cala.java SpecCala.java<br>
&gt; java Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: alan / 3 / 4 / 1)<br>
Enter owner: Enter price: Enter color: Enter TC(1,2,3): OUTPUT:<br>
alan, 3<br>
alan, 3, 4<br>
&gt; javap -c Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(only the lines with "Method SpecCala.")<br>
&nbsp;&nbsp;&nbsp;invokespecial #16 // Method SpecCala."&lt;init&gt;":(ILjava/lang/String;I)V<br>
&nbsp;&nbsp;&nbsp;invokevirtual #20 // Method SpecCala.toString:()Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;invokevirtual #21 // Method SpecCala.setData:()V<br>
&nbsp;&nbsp;&nbsp;invokevirtual #24 // Method SpecCala.getOwner:()Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;invokevirtual #27 // Method SpecCala.getPrice:()I<br>
&nbsp;&nbsp;&nbsp;invokevirtual #30 // Method SpecCala.getValue:()I<br>
<br>
== A: Cala written without its no-argument constructor ==<br>
&gt; javac Cala.java SpecCala.java<br>
SpecCala.java:3: error: constructor Cala in class Cala cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;public SpecCala() {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: String,int<br>
&nbsp;&nbsp;found: no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
1 error<br>
(exit code 1)<br>
<br>
== B: setData() touches the private field owner of Cala ==<br>
&gt; javac SpecCala.java<br>
SpecCala.java:13: error: owner has private access in Cala<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;owner = o.substring(0, 1) + "XX" + o.substring(2);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
<br>
== C: @Override on a misspelled tostring() ==<br>
&gt; javac SpecCala.java<br>
SpecCala.java:9: error: method does not override or implement a method from a supertype<br>
&nbsp;&nbsp;&nbsp;&nbsp;@Override<br>
&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
<br>
== D: a line before super(owner, price) ==<br>
&gt; javac SpecCala.java<br>
SpecCala.java:7: error: call to super must be first statement in constructor<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;super(owner, price);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
<br>
== E: getValue() returns String (the habit of PE6/PE10/PE11), but PE4's Main calls int getValue() ==<br>
&gt; javac SpecCala.java<br>
&gt; java Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: alan / 3 / 5 / 3)<br>
Enter owner: Enter price: Enter color: Enter TC(1,2,3): OUTPUT:<br>
Exception in thread "main" java.lang.NoSuchMethodError: SpecCala.getValue()I<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)</div>
<table>
<thead><tr><th>#</th><th>Mistake</th><th>Real effect</th><th>Rule</th></tr></thead>
<tbody>
<tr><td>M1</td><td><code>tostring()</code> without <code>@Override</code></td><td>the parent's format: <code>alan, 3</code></td><td>always write <code>@Override</code>: it turns this into a compile error (C)</td></tr>
<tr><td>M2</td><td>the subclass declares owner and price again</td><td><code>null, 0, 4</code></td><td>only the NEW field in the subclass; pass the rest to <code>super</code></td></tr>
<tr><td>M3</td><td><code>super(owner, color)</code> — the order of the parent</td><td><code>alan, 4, 3</code> — compiles, both are int</td><td>follow the box parameter by parameter</td></tr>
<tr><td>M4</td><td><code>name.replace("r", "KK")</code> for "the 3rd character"</td><td><code>HaKKKKy</code></td><td>by position: <code>substring(0, 2) + "KK" + substring(3)</code></td></tr>
<tr><td>M5</td><td>index 2 for "the 2nd character"</td><td><code>alXXn</code></td><td>position k is index k − 1</td></tr>
<tr><td>M6</td><td><code>color % 2 == 1</code> for "odd"</td><td>−3 treated as even</td><td><code>% 2 != 0</code></td></tr>
<tr><td>M7</td><td><code>equalsIgnoreCase</code> where PE2 says case-sensitive</td><td>1000 instead of 1700</td><td>follow the paper, both ways</td></tr>
<tr><td>M8</td><td><code>price % 10</code> for "the FIRST digit" (PE12)</td><td><code>1tandard</code></td><td><code>String.valueOf(price).charAt(0)</code></td></tr>
<tr><td>A</td><td>no <code>Cala()</code> in the parent</td><td><code>constructor Cala in class Cala cannot be applied</code></td><td>every box constructor, the default one first</td></tr>
<tr><td>B</td><td><code>owner = …</code> inside SpecCala</td><td><code>owner has private access in Cala</code></td><td>getter and setter of the parent</td></tr>
<tr><td>C</td><td><code>@Override</code> on a misspelled method</td><td><code>method does not override …</code></td><td>good: the compiler caught M1</td></tr>
<tr><td>D</td><td>a statement before <code>super(…)</code></td><td><code>call to super must be first statement</code></td><td><code>super(…)</code> on the first line</td></tr>
<tr><td>E</td><td><code>String getValue()</code> where the box says int (PE4)</td><td>compiles, then <code>NoSuchMethodError: SpecCala.getValue()I</code></td><td>the return type of the box; check with javap</td></tr>
</tbody>
</table>`,
    `<h2>7. Mười ba cách mất điểm câu 2 — cách nào cũng đo thật</h2>
<p>Tám lỗi biên dịch được và in ra sai (cột "right" là cặp lớp đúng, chạy trên cùng dữ liệu):</p>
<pre><code class="language-java">// release: 8
// Tám cách mất điểm câu 2 đề PE (lớp cha + lớp con Spec), cái nào cũng biên dịch và chạy thật
import java.util.*;

// M1 — tostring() chữ s thường và không có @Override: một phương thức MỚI, toString() của cha vẫn chạy
class Cala1 {
    private String owner = "alan";
    private int price = 3;
    public String getOwner() { return owner; }
    public int getPrice() { return price; }
    @Override
    public String toString() { return owner + ", " + price; }
}
class SpecCala1 extends Cala1 {
    private int color = 4;
    public String tostring() { return super.toString() + ", " + color; }
}

// M2 — lớp con khai báo owner và price LẦN NỮA: nó gán vào bản của riêng nó, bản của cha vẫn là null và 0
class Cala2 {
    private String owner;
    private int price;
    public Cala2() { }
    public Cala2(String owner, int price) { this.owner = owner; this.price = price; }
    @Override
    public String toString() { return owner + ", " + price; }
}
class SpecCala2 extends Cala2 {
    private String owner;                                     // che mất Cala2.owner
    private int price;
    private int color;
    public SpecCala2(int color, String owner, int price) {
        this.owner = owner;                                   // không có super(owner, price) ⇒ Cala2() đã chạy
        this.price = price;
        this.color = color;
    }
    @Override
    public String toString() { return super.toString() + ", " + color; }
}

// M3 — PE4 SpecCala(color, owner, price): chép tham số theo thứ tự của CHA; price và color đều là int nên vẫn biên dịch
class SpecCala3 extends Cala2 {
    private int color;
    public SpecCala3(int color, String owner, int price) {
        super(owner, color);                                  // phải là super(owner, price)
        this.color = price;
    }
    @Override
    public String toString() { return super.toString() + ", " + color; }
}

// cặp lớp đúng, làm cột "right" cho M1–M3
class SpecCalaOk extends Cala2 {
    private int color;
    public SpecCalaOk(int color, String owner, int price) {
        super(owner, price);
        this.color = color;
    }
    @Override
    public String toString() { return super.toString() + ", " + color; }
}

public class LoiMatDiemQ2 {
    public static void main(String[] args) {
        Cala1 c1 = new SpecCala1();
        String ok = new SpecCalaOk(4, "alan", 3).toString();
        xem("M1 tostring() without @Override", "alan, 3, 4", c1.toString(), ok);

        xem("M2 fields declared twice", "alan, 3, 4", new SpecCala2(4, "alan", 3).toString(), ok);

        xem("M3 parameter order", "alan, 3, 4", new SpecCala3(4, "alan", 3).toString(), ok);

        // M4 — PE2 setData(): "Thay ký tự thứ 3 của name bằng KK"; "Harry" có HAI chữ r
        String name = "Harry";
        String sai4 = name.replace(String.valueOf(name.charAt(2)), "KK");        // replace() đổi MỌI chữ "r"
        String dung4 = name.substring(0, 2) + "KK" + name.substring(3);          // theo VỊ TRÍ
        xem("M4 replace() by value", "HaKKry", sai4, dung4);

        // M5 — PE4 "ký tự thứ 2": vị trí 2 là chỉ số 1
        String owner = "alan";
        xem("M5 off by one", "aXXan", owner.substring(0, 2) + "XX" + owner.substring(3), owner.substring(0, 1) + "XX" + owner.substring(2));

        // M6 — "color lẻ": trong Java -3 % 2 bằng -1, nên "== 1" gọi số lẻ âm là chẵn
        int color = -3, price = 5;
        xem("M6 odd test", "8", String.valueOf(color % 2 == 1 ? price + 3 : price + 7), String.valueOf(color % 2 != 0 ? price + 3 : price + 7));

        // M7 — PE2 getValue(): "department = it (phân biệt hoa thường)" — ở đây equalsIgnoreCase mới là LỖI; người chấm gõ "IT"
        String dep = "IT";
        int salary = 800;
        xem("M7 case-sensitive rule", "1700", String.valueOf(dep.equalsIgnoreCase("it") ? salary + 200 : salary + 900), String.valueOf(dep.equals("it") ? salary + 200 : salary + 900));

        // M8 — PE12, bản soi gương của PE11: "chữ số ĐẦU của price" không phải price % 10
        int p = 21;
        xem("M8 first digit", "2tandard", (p % 10) + "tandard", String.valueOf(p).charAt(0) + "tandard");
    }

    static void xem(String bay, String mau, String sai, String dung) {
        System.out.println(bay);
        System.out.println("   expected : " + mau);
        System.out.println("   wrong    : " + sai + (sai.equals(mau) ? "   PASS" : "   FAIL"));
        System.out.println("   right    : " + dung + (dung.equals(mau) ? "   PASS" : "   FAIL"));
    }
}</code></pre>
<div class="out">M1 tostring() without @Override<br>
&nbsp;&nbsp;&nbsp;expected : alan, 3, 4<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: alan, 3 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: alan, 3, 4 &nbsp;&nbsp;PASS<br>
M2 fields declared twice<br>
&nbsp;&nbsp;&nbsp;expected : alan, 3, 4<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: null, 0, 4 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: alan, 3, 4 &nbsp;&nbsp;PASS<br>
M3 parameter order<br>
&nbsp;&nbsp;&nbsp;expected : alan, 3, 4<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: alan, 4, 3 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: alan, 3, 4 &nbsp;&nbsp;PASS<br>
M4 replace() by value<br>
&nbsp;&nbsp;&nbsp;expected : HaKKry<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: HaKKKKy &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: HaKKry &nbsp;&nbsp;PASS<br>
M5 off by one<br>
&nbsp;&nbsp;&nbsp;expected : aXXan<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: alXXn &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: aXXan &nbsp;&nbsp;PASS<br>
M6 odd test<br>
&nbsp;&nbsp;&nbsp;expected : 8<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 12 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 8 &nbsp;&nbsp;PASS<br>
M7 case-sensitive rule<br>
&nbsp;&nbsp;&nbsp;expected : 1700<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 1000 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 1700 &nbsp;&nbsp;PASS<br>
M8 first digit<br>
&nbsp;&nbsp;&nbsp;expected : 2tandard<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 1tandard &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 2tandard &nbsp;&nbsp;PASS</div>
<p>Năm lỗi chặn bạn sớm hơn — chạy trên JDK 8 thật với harness của PE4. Trước hết một mẹo đáng biết: <code>javap -c Main</code> liệt kê mọi phương thức của lớp BẠN viết mà Main đề cho gọi tới, kèm đúng kiểu tham số và kiểu trả về (<code>I</code> = int, <code>Ljava/lang/String;</code> = String, <code>V</code> = void). Đề thi liệt kê Command Prompt trong phần mềm được dùng, và <code>javap</code> có sẵn trong mọi JDK.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File q2 = new File("Q2");
    viet(q2, "Main.java", MAIN);
    viet(q2, "Cala.java", CALA);
    viet(q2, "SpecCala.java", SPEC);
    lenh(q2, "javac", "Main.java", "Cala.java", "SpecCala.java");          // = Main.class đề cho + hai lớp của bạn
    lenhVao(q2, "alan\\n3\\n4\\n1\\n", "java", "Main");
    lenhLoc(q2, "Method SpecCala.", "javap", "-c", "Main");               // Main gọi phương thức nào của lớp BẠN viết, kèm kiểu chính xác

    System.out.println("\\n== A: Cala written without its no-argument constructor ==");
    viet(q2, "Cala.java", CALA.replace("    public Cala() {\\n    }\\n", ""));
    lenh(q2, "javac", "Cala.java", "SpecCala.java");
    viet(q2, "Cala.java", CALA);

    System.out.println("\\n== B: setData() touches the private field owner of Cala ==");
    viet(q2, "SpecCala.java", SPEC.replace("setOwner(o.substring(0, 1) + \\"XX\\" + o.substring(2));", "owner = o.substring(0, 1) + \\"XX\\" + o.substring(2);"));
    lenh(q2, "javac", "SpecCala.java");

    System.out.println("\\n== C: @Override on a misspelled tostring() ==");
    viet(q2, "SpecCala.java", SPEC.replace("public String toString()", "public String tostring()"));
    lenh(q2, "javac", "SpecCala.java");

    System.out.println("\\n== D: a line before super(owner, price) ==");
    viet(q2, "SpecCala.java", SPEC.replace("        super(owner, price);\\n        this.color = color;", "        this.color = color;\\n        super(owner, price);"));
    lenh(q2, "javac", "SpecCala.java");

    System.out.println("\\n== E: getValue() returns String (the habit of PE6/PE10/PE11), but PE4's Main calls int getValue() ==");
    viet(q2, "SpecCala.java", SPEC.replace("public int getValue() {\\n        return color % 2 != 0 ? getPrice() + 3 : getPrice() + 7;", "public String getValue() {\\n        return \\"\\" + (color % 2 != 0 ? getPrice() + 3 : getPrice() + 7);"));
    lenh(q2, "javac", "SpecCala.java");
    lenhVao(q2, "alan\\n3\\n5\\n3\\n", "java", "Main");
}</code></pre>
<div class="out">&gt; javac Main.java Cala.java SpecCala.java<br>
&gt; java Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: alan / 3 / 4 / 1)<br>
Enter owner: Enter price: Enter color: Enter TC(1,2,3): OUTPUT:<br>
alan, 3<br>
alan, 3, 4<br>
&gt; javap -c Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(only the lines with "Method SpecCala.")<br>
&nbsp;&nbsp;&nbsp;invokespecial #16 // Method SpecCala."&lt;init&gt;":(ILjava/lang/String;I)V<br>
&nbsp;&nbsp;&nbsp;invokevirtual #20 // Method SpecCala.toString:()Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;invokevirtual #21 // Method SpecCala.setData:()V<br>
&nbsp;&nbsp;&nbsp;invokevirtual #24 // Method SpecCala.getOwner:()Ljava/lang/String;<br>
&nbsp;&nbsp;&nbsp;invokevirtual #27 // Method SpecCala.getPrice:()I<br>
&nbsp;&nbsp;&nbsp;invokevirtual #30 // Method SpecCala.getValue:()I<br>
<br>
== A: Cala written without its no-argument constructor ==<br>
&gt; javac Cala.java SpecCala.java<br>
SpecCala.java:3: error: constructor Cala in class Cala cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;public SpecCala() {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: String,int<br>
&nbsp;&nbsp;found: no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
1 error<br>
(exit code 1)<br>
<br>
== B: setData() touches the private field owner of Cala ==<br>
&gt; javac SpecCala.java<br>
SpecCala.java:13: error: owner has private access in Cala<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;owner = o.substring(0, 1) + "XX" + o.substring(2);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
<br>
== C: @Override on a misspelled tostring() ==<br>
&gt; javac SpecCala.java<br>
SpecCala.java:9: error: method does not override or implement a method from a supertype<br>
&nbsp;&nbsp;&nbsp;&nbsp;@Override<br>
&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
<br>
== D: a line before super(owner, price) ==<br>
&gt; javac SpecCala.java<br>
SpecCala.java:7: error: call to super must be first statement in constructor<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;super(owner, price);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
<br>
== E: getValue() returns String (the habit of PE6/PE10/PE11), but PE4's Main calls int getValue() ==<br>
&gt; javac SpecCala.java<br>
&gt; java Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(keyboard: alan / 3 / 5 / 3)<br>
Enter owner: Enter price: Enter color: Enter TC(1,2,3): OUTPUT:<br>
Exception in thread "main" java.lang.NoSuchMethodError: SpecCala.getValue()I<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)</div>
<table>
<thead><tr><th>#</th><th>Lỗi</th><th>Hậu quả thật</th><th>Luật</th></tr></thead>
<tbody>
<tr><td>M1</td><td><code>tostring()</code> không có <code>@Override</code></td><td>ra định dạng của cha: <code>alan, 3</code></td><td>luôn viết <code>@Override</code>: nó biến lỗi này thành lỗi biên dịch (C)</td></tr>
<tr><td>M2</td><td>lớp con khai báo lại owner và price</td><td><code>null, 0, 4</code></td><td>lớp con CHỈ có trường mới; phần còn lại chuyển cho <code>super</code></td></tr>
<tr><td>M3</td><td><code>super(owner, color)</code> — theo thứ tự của cha</td><td><code>alan, 4, 3</code> — vẫn biên dịch vì cả hai là int</td><td>theo hộp UML từng tham số một</td></tr>
<tr><td>M4</td><td><code>name.replace("r", "KK")</code> cho "ký tự thứ 3"</td><td><code>HaKKKKy</code></td><td>theo vị trí: <code>substring(0, 2) + "KK" + substring(3)</code></td></tr>
<tr><td>M5</td><td>chỉ số 2 cho "ký tự thứ 2"</td><td><code>alXXn</code></td><td>vị trí k là chỉ số k − 1</td></tr>
<tr><td>M6</td><td><code>color % 2 == 1</code> cho "số lẻ"</td><td>−3 bị coi là chẵn</td><td><code>% 2 != 0</code></td></tr>
<tr><td>M7</td><td><code>equalsIgnoreCase</code> trong khi PE2 ghi phân biệt hoa thường</td><td>1000 thay vì 1700</td><td>theo đề, cả hai chiều</td></tr>
<tr><td>M8</td><td><code>price % 10</code> cho "chữ số ĐẦU" (PE12)</td><td><code>1tandard</code></td><td><code>String.valueOf(price).charAt(0)</code></td></tr>
<tr><td>A</td><td>lớp cha thiếu <code>Cala()</code></td><td><code>constructor Cala in class Cala cannot be applied</code></td><td>đủ mọi constructor trong hộp, constructor mặc định trước tiên</td></tr>
<tr><td>B</td><td><code>owner = …</code> trong SpecCala</td><td><code>owner has private access in Cala</code></td><td>dùng getter và setter của cha</td></tr>
<tr><td>C</td><td><code>@Override</code> trên phương thức gõ sai tên</td><td><code>method does not override …</code></td><td>tốt: trình biên dịch đã bắt được M1</td></tr>
<tr><td>D</td><td>có câu lệnh đứng trước <code>super(…)</code></td><td><code>call to super must be first statement</code></td><td><code>super(…)</code> ở dòng đầu tiên</td></tr>
<tr><td>E</td><td><code>String getValue()</code> trong khi hộp ghi int (PE4)</td><td>biên dịch được, rồi <code>NoSuchMethodError: SpecCala.getValue()I</code></td><td>kiểu trả về theo hộp; kiểm bằng javap</td></tr>
</tbody>
</table>`),
    bi(`<h2>8. 20 minutes for question 2 — plan and checklist</h2>
<table>
<thead><tr><th>Minutes</th><th>Do</th></tr></thead>
<tbody>
<tr><td>0–3</td><td>read both boxes; compute every sample of TC1, TC2, TC3 by hand; mark the parameter ORDER of the subclass constructor</td></tr>
<tr><td>3–8</td><td>parent: fields, both constructors, getters/setters, <code>toString()</code> (Alt+Insert, then fix the format)</td></tr>
<tr><td>8–15</td><td>subclass: the new field, <code>super(…)</code>, <code>toString()</code> via <code>super.toString()</code>, <code>setData()</code>, <code>getValue()</code></td></tr>
<tr><td>15–20</td><td>run TC1, TC2, TC3 with every sample + one edge (negative number, one-letter string, a digit at the end); Clean and Build; copy run + src</td></tr>
</tbody>
</table>
<ol>
<li>The parent has its default constructor; the subclass has both of its constructors.</li>
<li>The subclass constructor's parameters are in the order of the box; <code>super(…)</code> is its first line.</li>
<li>The subclass declares only the new field.</li>
<li><code>@Override</code> on every overridden method (<code>toString</code>, <code>getInfo</code> …).</li>
<li><code>setData()</code> changes the parent field through its setter, by position, exactly one place.</li>
<li><code>getValue()</code> returns the type of the box (int or String).</li>
<li>Both <code>toString()</code> formats copied character by character — TC1 prints both.</li>
<li>Odd/even with <code>% 2 != 0</code> / <code>== 0</code>; Strings with <code>equals</code> or <code>equalsIgnoreCase</code> as written.</li>
<li>Every sample run; Clean and Build after the last change; the jar run once.</li>
</ol>`,
    `<h2>8. 20 phút cho câu 2 — kế hoạch và danh sách kiểm</h2>
<table>
<thead><tr><th>Phút</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td>0–3</td><td>đọc cả hai hộp; tính tay mọi mẫu của TC1, TC2, TC3; đánh dấu THỨ TỰ tham số của constructor lớp con</td></tr>
<tr><td>3–8</td><td>lớp cha: trường, hai constructor, getter/setter, <code>toString()</code> (Alt+Insert, rồi sửa định dạng)</td></tr>
<tr><td>8–15</td><td>lớp con: trường mới, <code>super(…)</code>, <code>toString()</code> qua <code>super.toString()</code>, <code>setData()</code>, <code>getValue()</code></td></tr>
<tr><td>15–20</td><td>chạy TC1, TC2, TC3 với mọi mẫu + một ca biên (số âm, chuỗi một chữ cái, chữ số ở cuối); Clean and Build; chép run + src</td></tr>
</tbody>
</table>
<ol>
<li>Lớp cha có constructor mặc định; lớp con có đủ hai constructor của nó.</li>
<li>Tham số constructor lớp con theo thứ tự của hộp; <code>super(…)</code> là dòng đầu tiên.</li>
<li>Lớp con chỉ khai báo trường mới.</li>
<li><code>@Override</code> trên mọi phương thức ghi đè (<code>toString</code>, <code>getInfo</code> …).</li>
<li><code>setData()</code> đổi trường của cha qua setter, theo vị trí, đúng một chỗ.</li>
<li><code>getValue()</code> trả đúng kiểu của hộp (int hay String).</li>
<li>Cả hai định dạng <code>toString()</code> chép từng ký tự — TC1 in cả hai.</li>
<li>Chẵn/lẻ bằng <code>% 2 != 0</code> / <code>== 0</code>; String bằng <code>equals</code> hay <code>equalsIgnoreCase</code> đúng như đề viết.</li>
<li>Chạy mọi mẫu; Clean and Build sau lần sửa cuối; chạy thử file jar một lần.</li>
</ol>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>superclass / subclass</strong></td><td>lớp cha / lớp con</td><td>The class that is extended / the class that <code>extends</code> it and inherits its members.</td></tr>
<tr><td><strong><code>super(...)</code></strong></td><td>gọi constructor cha</td><td>The first statement of a subclass constructor, which runs the parent's constructor with the given values.</td></tr>
<tr><td><strong>implicit <code>super()</code></strong></td><td>lời gọi super() ngầm</td><td>Added by the compiler when a constructor does not call <code>super(...)</code> itself; it needs the parent's no-argument constructor.</td></tr>
<tr><td><strong>override / <code>@Override</code></strong></td><td>ghi đè / chú thích ghi đè</td><td>Same name, same parameters, compatible return type as the parent's method; the annotation makes the compiler check it.</td></tr>
<tr><td><strong>field hiding (shadowing)</strong></td><td>che trường</td><td>A subclass field with the same name as a parent field; two separate variables, a classic source of null/0 output.</td></tr>
<tr><td><strong><code>private</code> access</strong></td><td>truy cập riêng tư</td><td>Visible only inside its own class — a subclass must use the parent's getters and setters.</td></tr>
<tr><td><strong><code>super.toString()</code></strong></td><td>gọi toString của cha</td><td>Reuses the parent's text inside the child's override instead of rebuilding it.</td></tr>
<tr><td><strong>position vs index</strong></td><td>vị trí và chỉ số</td><td>Papers count characters from 1 ("the 2nd character"); Java indexes from 0.</td></tr>
<tr><td><strong>odd / even test</strong></td><td>kiểm lẻ / chẵn</td><td><code>x % 2 != 0</code> / <code>x % 2 == 0</code>; in Java <code>-3 % 2</code> is <code>-1</code>, so <code>== 1</code> misses negative odd numbers.</td></tr>
<tr><td><strong>method descriptor</strong></td><td>chữ ký phương thức trong byte code</td><td>How a <code>.class</code> names a method with its types: <code>getValue:()I</code> = no parameters, returns int.</td></tr>
<tr><td><strong><code>NoSuchMethodError</code></strong></td><td>lỗi không có phương thức</td><td>Run-time error when the given Main calls a method whose name or types your class does not have exactly.</td></tr>
<tr><td><strong>mirrored question</strong></td><td>đề soi gương</td><td>A paper that reuses another paper's question with the rules reversed (PE11 last/even ↔ PE12 first/odd).</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>superclass / subclass</strong></td><td>lớp cha / lớp con</td><td>Lớp được kế thừa / lớp <code>extends</code> nó và nhận lại các thành viên của nó.</td></tr>
<tr><td><strong><code>super(...)</code></strong></td><td>gọi constructor cha</td><td>Câu lệnh đầu tiên của constructor lớp con, chạy constructor của cha với các giá trị truyền vào.</td></tr>
<tr><td><strong>implicit <code>super()</code></strong></td><td>lời gọi super() ngầm</td><td>Trình biên dịch tự thêm khi constructor không tự gọi <code>super(...)</code>; nó cần constructor không tham số của cha.</td></tr>
<tr><td><strong>override / <code>@Override</code></strong></td><td>ghi đè / chú thích ghi đè</td><td>Cùng tên, cùng tham số, kiểu trả về tương thích với phương thức của cha; chú thích bắt trình biên dịch kiểm điều đó.</td></tr>
<tr><td><strong>field hiding (shadowing)</strong></td><td>che trường</td><td>Trường của lớp con trùng tên trường của cha; hai biến riêng biệt, nguồn kinh điển của output null/0.</td></tr>
<tr><td><strong><code>private</code> access</strong></td><td>truy cập riêng tư</td><td>Chỉ thấy được bên trong chính lớp đó — lớp con phải dùng getter và setter của cha.</td></tr>
<tr><td><strong><code>super.toString()</code></strong></td><td>gọi toString của cha</td><td>Dùng lại chuỗi của cha bên trong bản ghi đè của con thay vì dựng lại.</td></tr>
<tr><td><strong>position vs index</strong></td><td>vị trí và chỉ số</td><td>Đề đếm ký tự từ 1 ("ký tự thứ 2"); Java đánh chỉ số từ 0.</td></tr>
<tr><td><strong>odd / even test</strong></td><td>kiểm lẻ / chẵn</td><td><code>x % 2 != 0</code> / <code>x % 2 == 0</code>; trong Java <code>-3 % 2</code> bằng <code>-1</code>, nên <code>== 1</code> bỏ sót số lẻ âm.</td></tr>
<tr><td><strong>method descriptor</strong></td><td>chữ ký phương thức trong byte code</td><td>Cách file <code>.class</code> ghi một phương thức kèm kiểu: <code>getValue:()I</code> = không tham số, trả int.</td></tr>
<tr><td><strong><code>NoSuchMethodError</code></strong></td><td>lỗi không có phương thức</td><td>Lỗi lúc chạy khi Main đề cho gọi một phương thức mà lớp của bạn không có đúng tên hoặc đúng kiểu.</td></tr>
<tr><td><strong>mirrored question</strong></td><td>đề soi gương</td><td>Một đề dùng lại câu của đề khác với luật đảo ngược (PE11 cuối/chẵn ↔ PE12 đầu/lẻ).</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 7 things for question 2</h2>
<ol>
<li><strong>Two families:</strong> "Spec" (toString / setData / getValue, eight papers) and "business" (price or salary rules, three papers).</li>
<li><strong>The subclass constructor follows the box</strong> — order included — and starts with <code>super(…)</code>; the parent keeps its default constructor.</li>
<li><strong>Only the new field lives in the subclass;</strong> the parent's private fields are reached through getters and setters.</li>
<li><strong><code>toString()</code> of the child = <code>super.toString()</code> + the new part;</strong> TC1 prints the parent's format too.</li>
<li><strong>setData works by position</strong> (position k = index k − 1), never with <code>replace</code> on a value that may repeat.</li>
<li><strong>getValue's return type and every name come from the box</strong>; <code>javap -c Main</code> shows the exact calls when in doubt.</li>
<li><strong>Read the verbs every time:</strong> PE12/PE13 mirror PE11; "odd" is <code>% 2 != 0</code>; case-sensitive unless the paper says otherwise.</li>
</ol>
<div class="callout">🧭 <strong>Go further — Spring Boot</strong>: in LabFlow, JPA entities inherit from a <code>BaseEntity</code> holding <code>id</code>, <code>createdAt</code>, <code>updatedAt</code>, and each entity declares only its own new fields — the same "only the new fields in the subclass" rule. Next: <strong>🎯 PE drill 3</strong>, f1/f2/f3 on a list.</div>`,
    `<h2>📌 Tóm tắt — 7 điều cho câu 2</h2>
<ol>
<li><strong>Hai họ đề:</strong> "Spec" (toString / setData / getValue, tám đề) và "nghiệp vụ" (luật giá hay lương, ba đề).</li>
<li><strong>Constructor lớp con theo đúng hộp UML</strong> — kể cả thứ tự — và mở đầu bằng <code>super(…)</code>; lớp cha giữ constructor mặc định.</li>
<li><strong>Lớp con chỉ chứa trường mới;</strong> các trường private của cha đi qua getter và setter.</li>
<li><strong><code>toString()</code> của con = <code>super.toString()</code> + phần mới;</strong> TC1 in cả định dạng của cha.</li>
<li><strong>setData làm theo vị trí</strong> (vị trí k = chỉ số k − 1), không bao giờ dùng <code>replace</code> trên một giá trị có thể lặp lại.</li>
<li><strong>Kiểu trả về của getValue và mọi cái tên lấy từ hộp UML</strong>; khi phân vân, <code>javap -c Main</code> cho thấy đúng các lời gọi.</li>
<li><strong>Lần nào cũng đọc kỹ động từ:</strong> PE12/PE13 soi gương PE11; "lẻ" là <code>% 2 != 0</code>; phân biệt hoa thường trừ khi đề nói khác.</li>
</ol>
<div class="callout">🧭 <strong>Đi tiếp — Spring Boot</strong>: trong LabFlow, các entity JPA kế thừa một <code>BaseEntity</code> chứa <code>id</code>, <code>createdAt</code>, <code>updatedAt</code>, và mỗi entity chỉ khai báo các trường mới của riêng nó — đúng luật "lớp con chỉ có trường mới". Tiếp theo: <strong>🎯 Luyện PE 3</strong>, f1/f2/f3 trên một danh sách.</div>`),
  ].join('\n'),
};

/* ───────── 🎯 PE drill 3 — type 3: f1/f2/f3 on a list of objects, and XxxList extends ArrayList, on real papers ───────── */
const L_x_luyen_pe_3 = {
  title: '🎯 PE drill 3 — type 3: f1/f2/f3 on a list of objects, and XxxList extends ArrayList, on real papers|||🎯 Luyện PE PRO192 3 — dạng 3: f1/f2/f3 trên danh sách đối tượng, và XxxList extends ArrayList, trên đề thật',
  slug: 'pro192-luyen-pe-3',
  type: 'VIDEO',
  description: 'Bài luyện thi thực hành tự thêm (3/4): câu 3 đề PE — hiện thực interface cho sẵn dạng byte code với f1/f2/f3 trên List (tìm, sửa, xoá tại chỗ) hoặc viết lớp danh sách kế thừa ArrayList. Bảng mọi hàm f1/f2/f3 của 7 đề và 4 đề lớp danh sách, Main.class đề cho làm gì (phần tử bạn thêm đứng trước danh sách cố định, in danh sách, in N/A khi trả null), mẹo đọc đề (tại chỗ, giữ thứ tự, hai lượt), khung code, giải ba đề thật (PE6 MyWine, PE11 MyLadder, PE8 WatchList) chạy thật trên JDK 8, mười bốn lỗi mất điểm đo thật (ConcurrentModificationException, vòng lặp bỏ sót, gán lại tham số, min bị dời, sắp xếp không ổn định, trả list rỗng thay vì null, quên import, List thô), kế hoạch 25 phút và danh sách kiểm.',
  content: [
    bi(`<span class="eyebrow">Final Exam · 🎯 PE drill 3 of 4 · added by this site</span>
<h2>Type 3 — three small algorithms on a list of your objects</h2>
<p class="lead">Question 3 hands you a <code>List</code> of objects of the class you just wrote and asks for three small algorithms: <strong>find</strong> something (f1), <strong>change</strong> some elements (f2), <strong>remove or reorder</strong> some elements in place (f3). In four papers it comes in another costume: a class <code>XxxList</code> that <em>is</em> an <code>ArrayList&lt;Xxx&gt;</code> with two or three query methods. Chapters 7–8 taught the tools; this lesson turns them into exam marks on PE6, PE11 and PE8.</p>`,
    `<span class="eyebrow">Thi cuối kỳ · 🎯 Luyện PE 3/4 · phần web tự thêm</span>
<h2>Dạng 3 — ba thuật toán nhỏ trên một danh sách đối tượng của bạn</h2>
<p class="lead">Câu 3 đưa cho bạn một <code>List</code> các đối tượng thuộc lớp bạn vừa viết và hỏi ba thuật toán nhỏ: <strong>tìm</strong> một thứ (f1), <strong>sửa</strong> vài phần tử (f2), <strong>xoá hoặc sắp lại</strong> vài phần tử ngay tại chỗ (f3). Ở bốn đề nó mặc một bộ áo khác: một lớp <code>XxxList</code> <em>là</em> một <code>ArrayList&lt;Xxx&gt;</code> với hai, ba phương thức truy vấn. Chương 7–8 đã dạy công cụ; bài này biến chúng thành điểm thi trên PE6, PE11 và PE8.</p>`),
    bi(`<h2>1. Every f1, f2, f3 of the real papers</h2>
<table>
<thead><tr><th>Paper</th><th>f1 — find</th><th>f2 — change</th><th>f3 — remove / reorder</th></tr></thead>
<tbody>
<tr><td>PE2 IEmployeeManagement</td><td>total salary of names starting with "Ng" (case-sensitive)</td><td>every Manager with the lowest Manager salary gets "X" in front of the name</td><td>sort the first 3 descending and the last 3 ascending by salary</td></tr>
<tr><td>PE6 IWine</td><td>first shortest brand among years not divisible by 3, else "Not found"</td><td>brand of non-prime length ⇒ "PRE" + first digit of year</td><td>remove lower-case-initial brands whose year = the smallest odd year</td></tr>
<tr><td>PE10 IBook</td><td>the maximum page among authors with at least two words</td><td>sort ascending by page (stable)</td><td>remove authors starting with "N" whose page = the minimum page</td></tr>
<tr><td>PE11–PE13 ILadder</td><td>sum of prices where upper-case letters &gt; lower-case letters</td><td>price 0 for EVERY longest type</td><td>remove EVERY item with the most letters</td></tr>
<tr><td>PE14 IShoes</td><td>the Shoes with the minimum price (an object)</td><td>sort ascending by price</td><td>remove names ending with "o"</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Paper</th><th>XxxList extends ArrayList&lt;Xxx&gt;</th></tr></thead>
<tbody>
<tr><td>PE1 EmployeeList</td><td><code>getEmployeeById(id)</code> → the object or null · <code>countEmployeesBySalary(min)</code></td></tr>
<tr><td>PE4 TicketList</td><td><code>addTicket</code> · <code>getCheapestTicket()</code> · <code>countTicketsByType(value)</code> ignoring case, 0 if none</td></tr>
<tr><td>PE7 SimCardList</td><td><code>getSimByPhoneNumber(phone)</code> → object or null · <code>countSimByBalance(amount)</code> with <code>&lt;=</code></td></tr>
<tr><td>PE8 WatchList</td><td><code>addWatch</code> · <code>filterByBrand(value)</code> ignoring case, <strong>null</strong> if none · <code>findMostExpensive()</code></td></tr>
</tbody>
</table>
<p>The Exam Room's rubric for PE6 shows how the 3 marks split: the class 0.5, f1 0.75, f2 0.75, <strong>f3 1.0</strong> — the in-place removal is the most valuable and the most often broken. What the given <code>Main.class</code> does, read with <code>javap -c</code>:</p>
<ul>
<li>PE6/PE11: "Add how many elements:" — the elements you type are added <strong>first</strong>, then the fixed list of the chosen test case is appended; it prints "The list before running fN:", the list, <code>OUTPUT:</code>, and then either f1's result or the list again after f2/f3. Each element is printed as <code>(%s,%d) </code>, so a sample line ends with a space.</li>
<li>PE10/PE14: Main also calls a <code>display(List&lt;…&gt;)</code> method of your class that is <strong>not in the interface</strong> — "you can add other functions" is not optional there.</li>
<li>PE8: Main fills the list with the inherited <code>add()</code>; your <code>addWatch()</code> is graded by reading, not by running. When <code>filterByBrand</code> returns <code>null</code>, Main itself prints <code>N/A</code>.</li>
</ul>`,
    `<h2>1. Mọi hàm f1, f2, f3 của các đề thật</h2>
<table>
<thead><tr><th>Đề</th><th>f1 — tìm</th><th>f2 — sửa</th><th>f3 — xoá / sắp lại</th></tr></thead>
<tbody>
<tr><td>PE2 IEmployeeManagement</td><td>tổng lương của các tên bắt đầu bằng "Ng" (phân biệt hoa thường)</td><td>mọi Manager có lương thấp nhất (trong các Manager) được thêm "X" trước tên</td><td>sắp 3 phần tử đầu giảm dần và 3 phần tử cuối tăng dần theo lương</td></tr>
<tr><td>PE6 IWine</td><td>brand ngắn nhất đầu tiên trong các năm không chia hết cho 3, không có thì "Not found"</td><td>brand có độ dài không nguyên tố ⇒ "PRE" + chữ số đầu của năm</td><td>xoá các brand bắt đầu bằng chữ thường có year = năm lẻ nhỏ nhất</td></tr>
<tr><td>PE10 IBook</td><td>page lớn nhất trong các tác giả có ít nhất hai từ</td><td>sắp tăng dần theo page (ổn định)</td><td>xoá tác giả bắt đầu bằng "N" có page = page nhỏ nhất</td></tr>
<tr><td>PE11–PE13 ILadder</td><td>tổng price của các type có chữ hoa &gt; chữ thường</td><td>price 0 cho MỌI type dài nhất</td><td>xoá MỌI phần tử có nhiều chữ cái nhất</td></tr>
<tr><td>PE14 IShoes</td><td>đôi Shoes có giá nhỏ nhất (một đối tượng)</td><td>sắp tăng dần theo giá</td><td>xoá các tên kết thúc bằng "o"</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Đề</th><th>XxxList extends ArrayList&lt;Xxx&gt;</th></tr></thead>
<tbody>
<tr><td>PE1 EmployeeList</td><td><code>getEmployeeById(id)</code> → đối tượng hoặc null · <code>countEmployeesBySalary(min)</code></td></tr>
<tr><td>PE4 TicketList</td><td><code>addTicket</code> · <code>getCheapestTicket()</code> · <code>countTicketsByType(value)</code> không phân biệt hoa thường, không có thì 0</td></tr>
<tr><td>PE7 SimCardList</td><td><code>getSimByPhoneNumber(phone)</code> → đối tượng hoặc null · <code>countSimByBalance(amount)</code> với <code>&lt;=</code></td></tr>
<tr><td>PE8 WatchList</td><td><code>addWatch</code> · <code>filterByBrand(value)</code> không phân biệt hoa thường, không có thì <strong>null</strong> · <code>findMostExpensive()</code></td></tr>
</tbody>
</table>
<p>Rubric của Exam Room cho PE6 cho thấy 3 điểm chia ra sao: lớp 0,5, f1 0,75, f2 0,75, <strong>f3 1,0</strong> — xoá tại chỗ là phần đáng giá nhất và cũng hay hỏng nhất. <code>Main.class</code> đề cho làm gì, đọc bằng <code>javap -c</code>:</p>
<ul>
<li>PE6/PE11: "Add how many elements:" — các phần tử bạn gõ được thêm <strong>trước</strong>, rồi danh sách cố định của test case được nối vào sau; nó in "The list before running fN:", danh sách, <code>OUTPUT:</code>, rồi kết quả của f1 hoặc danh sách sau f2/f3. Mỗi phần tử in dạng <code>(%s,%d) </code>, nên dòng mẫu kết thúc bằng một dấu cách.</li>
<li>PE10/PE14: Main còn gọi một phương thức <code>display(List&lt;…&gt;)</code> của lớp bạn mà <strong>interface không có</strong> — câu "bạn có thể thêm hàm khác" ở đó không phải tuỳ chọn.</li>
<li>PE8: Main đổ dữ liệu bằng <code>add()</code> kế thừa; <code>addWatch()</code> của bạn được chấm bằng cách đọc code, không phải bằng chạy. Khi <code>filterByBrand</code> trả <code>null</code>, chính Main in <code>N/A</code>.</li>
</ul>`),
    bi(`<h2>2. Reading tips for question 3</h2>
<table>
<thead><tr><th>The paper says</th><th>Write</th></tr></thead>
<tbody>
<tr><td>"the first …" (shortest, matching)</td><td>keep the first one: replace only on a strictly better value (<code>&lt;</code>, not <code>&lt;=</code>)</td></tr>
<tr><td>"all … whose X is the longest / smallest / greatest"</td><td>TWO passes: compute the extreme first, then act on everyone equal to it</td></tr>
<tr><td>"equal to the minimum … of all elements"</td><td>the minimum of the list <strong>before</strong> anything is removed — fix it in a variable</td></tr>
<tr><td>"remove … in place, maintain the original order"</td><td><code>Iterator.remove()</code> (or a backward index loop, or <code>removeIf</code> on JDK 8); never a new list assigned to the parameter</td></tr>
<tr><td>"if no element satisfies, do nothing" / "return Not found" / "return null"</td><td>handle the empty case explicitly — each paper wants a different answer</td></tr>
<tr><td>"sort ascending by page"</td><td><code>Collections.sort(t, comparator)</code> — stable, so equal pages keep their order</td></tr>
<tr><td>"case-insensitive"</td><td><code>equalsIgnoreCase</code>; "begins with" <code>startsWith</code>; "ends with" <code>endsWith</code></td></tr>
<tr><td>"letters" / "length"</td><td><code>Character.isLetter</code> count vs <code>length()</code> — PE11 uses BOTH, in different functions</td></tr>
<tr><td>"first digit of the year"</td><td><code>String.valueOf(year).charAt(0)</code>, the leftmost digit</td></tr>
</tbody>
</table>
<p class="meo">🧠 Write each f as <strong>scan → decide → act</strong>, and never mix the deciding with the acting: changing the list while you are still measuring it is the root of half the bugs in section 7.</p>`,
    `<h2>2. Mẹo đọc đề cho câu 3</h2>
<table>
<thead><tr><th>Đề viết</th><th>Hãy viết</th></tr></thead>
<tbody>
<tr><td>"the first …" (ngắn nhất, thoả điều kiện)</td><td>giữ phần tử đầu tiên: chỉ thay khi giá trị tốt hơn hẳn (<code>&lt;</code>, không phải <code>&lt;=</code>)</td></tr>
<tr><td>"all … whose X is the longest / smallest / greatest"</td><td>HAI lượt: tính giá trị cực trị trước, rồi xử lý mọi phần tử bằng nó</td></tr>
<tr><td>"equal to the minimum … of all elements"</td><td>min của danh sách <strong>trước khi</strong> xoá bất cứ gì — chốt vào một biến</td></tr>
<tr><td>"remove … in place, maintain the original order"</td><td><code>Iterator.remove()</code> (hoặc vòng chỉ số đi lùi, hoặc <code>removeIf</code> trên JDK 8); không bao giờ gán list mới cho tham số</td></tr>
<tr><td>"if no element satisfies, do nothing" / "return Not found" / "return null"</td><td>xử lý ca rỗng một cách tường minh — mỗi đề muốn một đáp án khác</td></tr>
<tr><td>"sort ascending by page"</td><td><code>Collections.sort(t, comparator)</code> — ổn định, nên các page bằng nhau giữ nguyên thứ tự</td></tr>
<tr><td>"case-insensitive"</td><td><code>equalsIgnoreCase</code>; "begins with" <code>startsWith</code>; "ends with" <code>endsWith</code></td></tr>
<tr><td>"letters" / "length"</td><td>đếm <code>Character.isLetter</code> hay <code>length()</code> — PE11 dùng CẢ HAI, ở hai hàm khác nhau</td></tr>
<tr><td>"first digit of the year"</td><td><code>String.valueOf(year).charAt(0)</code>, chữ số bên trái nhất</td></tr>
</tbody>
</table>
<p class="meo">🧠 Viết mỗi hàm f theo nhịp <strong>quét → quyết định → hành động</strong>, và đừng bao giờ trộn quyết định với hành động: sửa danh sách trong khi còn đang đo nó là gốc của một nửa số lỗi ở mục 7.</p>`),
    bi(`<h2>3. The frames for type 3</h2>
<pre><code class="language-java">import java.util.*;                                  // List, ArrayList, Iterator, Collections, Comparator

class MyXxx implements IXxx {                        // IXxx exists only as IXxx.class: do NOT create IXxx.java

    @Override
    public int f1(List&lt;Xxx&gt; t) {                     // find: one pass, keep the best so far
        int sum = 0;
        for (Xxx x : t) {
            if (/* condition on x */ true) sum += x.getPrice();
        }
        return sum;
    }

    @Override
    public void f2(List&lt;Xxx&gt; t) {                    // change "all with the maximum": two passes
        int max = Integer.MIN_VALUE;
        for (Xxx x : t) max = Math.max(max, x.getType().length());
        for (Xxx x : t) if (x.getType().length() == max) x.setPrice(0);
    }

    @Override
    public void f3(List&lt;Xxx&gt; t) {                    // remove in place: decide first, then remove through the iterator
        int min = Integer.MAX_VALUE;
        for (Xxx x : t) min = Math.min(min, x.getPrice());
        Iterator&lt;Xxx&gt; it = t.iterator();
        while (it.hasNext()) {
            if (it.next().getPrice() == min) it.remove();
        }
    }
}

class XxxList extends ArrayList&lt;Xxx&gt; {               // WITH &lt;Xxx&gt;; no list field inside — the object IS the list
    public Xxx findSomething(String key) {
        for (Xxx x : this) {                         // "this" is the list
            if (x.getType().equalsIgnoreCase(key)) return x;
        }
        return null;                                 // or 0, or "Not found": what the paper says
    }
}</code></pre>
<p>Sorting on JDK 8, either form is fine: <code>Collections.sort(t, new Comparator&lt;Xxx&gt;() { … })</code> as in Chapter 8, or the Java 8 lambda <code>t.sort((a, b) -&gt; Integer.compare(a.getPrice(), b.getPrice()))</code>. Both are stable. <code>removeIf(x -&gt; …)</code> is also Java 8.</p>`,
    `<h2>3. Khung code cho dạng 3</h2>
<pre><code class="language-java">import java.util.*;                                  // List, ArrayList, Iterator, Collections, Comparator

class MyXxx implements IXxx {                        // IXxx chỉ có dạng IXxx.class: KHÔNG tạo IXxx.java

    @Override
    public int f1(List&lt;Xxx&gt; t) {                     // tìm: một lượt, giữ giá trị tốt nhất tới lúc này
        int sum = 0;
        for (Xxx x : t) {
            if (/* điều kiện trên x */ true) sum += x.getPrice();
        }
        return sum;
    }

    @Override
    public void f2(List&lt;Xxx&gt; t) {                    // sửa "mọi phần tử đạt max": hai lượt
        int max = Integer.MIN_VALUE;
        for (Xxx x : t) max = Math.max(max, x.getType().length());
        for (Xxx x : t) if (x.getType().length() == max) x.setPrice(0);
    }

    @Override
    public void f3(List&lt;Xxx&gt; t) {                    // xoá tại chỗ: quyết định trước, rồi xoá qua iterator
        int min = Integer.MAX_VALUE;
        for (Xxx x : t) min = Math.min(min, x.getPrice());
        Iterator&lt;Xxx&gt; it = t.iterator();
        while (it.hasNext()) {
            if (it.next().getPrice() == min) it.remove();
        }
    }
}

class XxxList extends ArrayList&lt;Xxx&gt; {               // CÓ &lt;Xxx&gt;; không có trường list bên trong — đối tượng LÀ danh sách
    public Xxx findSomething(String key) {
        for (Xxx x : this) {                         // "this" chính là danh sách
            if (x.getType().equalsIgnoreCase(key)) return x;
        }
        return null;                                 // hoặc 0, hoặc "Not found": theo đề
    }
}</code></pre>
<p>Sắp xếp trên JDK 8, cách nào cũng được: <code>Collections.sort(t, new Comparator&lt;Xxx&gt;() { … })</code> như Chương 8, hoặc lambda của Java 8 <code>t.sort((a, b) -&gt; Integer.compare(a.getPrice(), b.getPrice()))</code>. Cả hai đều ổn định. <code>removeIf(x -&gt; …)</code> cũng có từ Java 8.</p>`),
    bi(`<h2>4. Solved paper 1 — PE6 (SU25) question 3: Wine and MyWine</h2>
<p>Paper: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 6 (SU25)</a>, question 3. Write <code>Wine(brand, year)</code> with getters and setters, and <code>MyWine implements IWine</code> — the interface is given as byte code. f1, f2, f3 as in the table of section 1.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/a42d75cd6d63305808752540e171fba4095d48fa.svg" alt="PE6 question 3: what is given as .class, what you write, how Main builds the list" loading="lazy" /><p class="chu-thich">🧩 PE6 question 3: what is given as .class, what you write, how Main builds the list</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title PE6 question 3 — IWine is given as byte code: you write Wine and MyWine
interface IWine &lt;&lt;given .class&gt;&gt; {
  + f1(t : List&lt;Wine&gt;) : String
  + f2(t : List&lt;Wine&gt;) : void
  + f3(t : List&lt;Wine&gt;) : void
}
class Wine {
  - brand : String
  - year : int
  --
  + Wine()
  + Wine(brand : String, year : int)
  + getBrand() : String
  + getYear() : int
  + setBrand(brand : String) : void
  + setYear(year : int) : void
}
class MyWine {
  + f1(t : List&lt;Wine&gt;) : String
  + f2(t : List&lt;Wine&gt;) : void
  + f3(t : List&lt;Wine&gt;) : void
  - isPrime(n : int) : boolean
}
class Main &lt;&lt;given .class&gt;&gt; {
  + {static} dispList(t : List&lt;Wine&gt;) : void
  + {static} main(args : String[]) : void
}
IWine &lt;|.. MyWine
MyWine ..&gt; Wine : reads / changes
Main ..&gt; IWine : IWine my = new MyWine()
Main ..&gt; Wine : your wines first,\\nthen the fixed list of the TC
@enduml</code></pre></details>
<p>By hand, TC3: years 60, 11, 10, 47, 69, 15, 18, 25 → odd years 11, 47, 69, 15, 25 → smallest odd year <strong>11</strong> → brands with a lower-case first letter AND year 11: only <code>b2</code>. <code>d6</code> also starts lower-case but its year is 47: it stays.</p>
<details><summary>Solution (our own code, run on JDK 8)</summary>
<pre class="trich"><code class="language-java">// GIVEN as IWine.class — javap prints "public abstract java.lang.String f1(java.util.List&lt;Wine&gt;)": the &lt;Wine&gt; is real
interface IWine {
    public String f1(List&lt;Wine&gt; t);
    public void f2(List&lt;Wine&gt; t);
    public void f3(List&lt;Wine&gt; t);
}</code></pre>
<pre class="trich"><code class="language-java">class Wine {
    private String brand;
    private int year;

    public Wine() {
    }

    public Wine(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }

    public String getBrand() { return brand; }
    public int getYear() { return year; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setYear(int year) { this.year = year; }
}</code></pre>
<pre class="trich"><code class="language-java">class MyWine implements IWine {

    // f1: the FIRST shortest brand among wines whose year is NOT a multiple of 3; none ⇒ "Not found"
    @Override
    public String f1(List&lt;Wine&gt; t) {
        Wine best = null;
        for (Wine w : t) {
            if (w.getYear() % 3 != 0) {
                if (best == null || w.getBrand().length() &lt; best.getBrand().length()) {   // "&lt;", not "&lt;=": a tie keeps the earlier one
                    best = w;
                }
            }
        }
        return best == null ? "Not found" : best.getBrand();
    }

    // f2: a brand whose LENGTH is not prime becomes "PRE" + the first digit of the year
    @Override
    public void f2(List&lt;Wine&gt; t) {
        for (Wine w : t) {
            if (!isPrime(w.getBrand().length())) {
                w.setBrand("PRE" + String.valueOf(Math.abs(w.getYear())).charAt(0));   // year 12 ⇒ '1' (leftmost), not 12 % 10
            }
        }
    }

    // f3: smallest ODD year of the WHOLE list first; then remove brands starting with a lower-case letter AND having that year
    @Override
    public void f3(List&lt;Wine&gt; t) {
        Integer minOdd = null;
        for (Wine w : t) {
            if (w.getYear() % 2 != 0 &amp;&amp; (minOdd == null || w.getYear() &lt; minOdd)) {
                minOdd = w.getYear();
            }
        }
        if (minOdd == null) {
            return;                                          // no odd year: "do nothing"
        }
        Iterator&lt;Wine&gt; it = t.iterator();                    // remove through the iterator: in place, order kept, no exception
        while (it.hasNext()) {
            Wine w = it.next();
            String b = w.getBrand();
            if (!b.isEmpty() &amp;&amp; Character.isLowerCase(b.charAt(0)) &amp;&amp; w.getYear() == minOdd) {
                it.remove();
            }
        }
    }

    // helper of our own — the paper allows "other functions in MyWine"
    private boolean isPrime(int n) {
        if (n &lt; 2) return false;
        for (int d = 2; d * d &lt;= n; d++) {
            if (n % d == 0) return false;
        }
        return true;
    }
}</code></pre>
<p>The decisions: in f1, <code>&lt;</code> keeps the FIRST of equally short brands (PJ before DU). In f2, the prime test is a private helper — the paper explicitly allows "other functions in MyWine". In f3, the smallest odd year is computed over the whole list <em>before</em> anything is removed, an <code>Integer</code> that stays <code>null</code> when there is no odd year ("do nothing"), and the removal goes through the iterator, so the order of the rest is kept and no exception is possible.</p>
</details>
<pre class="trich"><code class="language-java">// Stand-in for the given Main.class (javap -c): YOUR added wines come FIRST, then the paper's fixed list of the TC
class Main {
    static void dispList(List&lt;Wine&gt; t) {
        for (Wine w : t) System.out.printf("(%s,%d) ", w.getBrand(), w.getYear());
        System.out.printf("\\r\\n");
    }

    static void addToList(List&lt;Wine&gt; t, String[] b, int[] y) {
        for (int i = 0; i &lt; b.length; i++) t.add(new Wine(b[i], y[i]));
    }

    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        List&lt;Wine&gt; t = new ArrayList&lt;Wine&gt;();
        String[] b1 = {"VNA", "VJA", "FR", "PJ", "DU", "ITA"};
        int[] y1 = {3, 9, 6, 17, 11, 13};
        String[] b2 = {"A", "B1X", "C345", "D2Y", "E678", "1F", "3G1A", "2H"};
        int[] y2 = {6, 9, 2, 29, 3, 19, 12, 25};
        String[] b3 = {"A2", "b2", "C3", "d6", "E6", "1F", "3G1", "2H"};
        int[] y3 = {60, 11, 10, 47, 69, 15, 18, 25};
        System.out.print("Add how many elements: ");
        int n = sc.nextInt();
        sc.nextLine();
        for (int i = 0; i &lt; n; i++) {
            System.out.print("Enter brand: ");
            String brand = sc.nextLine();
            System.out.print("Enter year: ");
            int year = sc.nextInt();
            sc.nextLine();
            t.add(new Wine(brand, year));
        }
        System.out.print("Enter TC(1-f1;2-f2;3-f3): ");
        int tc = sc.nextInt();
        sc.nextLine();
        IWine my = new MyWine();
        if (tc == 1) addToList(t, b1, y1);
        if (tc == 2) addToList(t, b2, y2);
        if (tc == 3) addToList(t, b3, y3);
        System.out.println("The list before running f" + tc + ":");
        dispList(t);
        System.out.printf("OUTPUT:\\r\\n");
        switch (tc) {
            case 1: System.out.printf("%s\\r\\n", my.f1(t)); break;
            case 2: my.f2(t); dispList(t); break;
            case 3: my.f3(t); dispList(t); break;
        }
        System.out.println();
    }
}</code></pre>
<p>Input: the three samples (0 added elements, then the TC), and two runs of our own that add one wine — which Main puts <strong>in front</strong> of the fixed list:</p>
<pre><code class="language-plaintext"># TC1 f1 (paper sample 1)
0
1
# TC2 f2 (paper sample 2)
0
2
# TC3 f3 (paper sample 3)
0
3
# TC1 again, own test: one added wine
1
K
7
1
# TC3 again, own test: one added wine with an odd year 3
1
a9
3
3</code></pre>
<div class="out">=== TC1 f1 (paper sample 1) ===<br>
Add how many elements: Enter TC(1-f1;2-f2;3-f3): The list before running f1:<br>
(VNA,3) (VJA,9) (FR,6) (PJ,17) (DU,11) (ITA,13)<br>
OUTPUT:<br>
PJ<br>
-&gt; PASS<br>
=== TC2 f2 (paper sample 2) ===<br>
Add how many elements: Enter TC(1-f1;2-f2;3-f3): The list before running f2:<br>
(A,6) (B1X,9) (C345,2) (D2Y,29) (E678,3) (1F,19) (3G1A,12) (2H,25)<br>
OUTPUT:<br>
(PRE6,6) (B1X,9) (PRE2,2) (D2Y,29) (PRE3,3) (1F,19) (PRE1,12) (2H,25)<br>
-&gt; PASS<br>
=== TC3 f3 (paper sample 3) ===<br>
Add how many elements: Enter TC(1-f1;2-f2;3-f3): The list before running f3:<br>
(A2,60) (b2,11) (C3,10) (d6,47) (E6,69) (1F,15) (3G1,18) (2H,25)<br>
OUTPUT:<br>
(A2,60) (C3,10) (d6,47) (E6,69) (1F,15) (3G1,18) (2H,25)<br>
-&gt; PASS<br>
=== TC1 again, own test: one added wine ===<br>
Add how many elements: Enter brand: Enter year: Enter TC(1-f1;2-f2;3-f3): The list before running f1:<br>
(K,7) (VNA,3) (VJA,9) (FR,6) (PJ,17) (DU,11) (ITA,13)<br>
OUTPUT:<br>
K<br>
-&gt; PASS<br>
=== TC3 again, own test: one added wine with an odd year 3 ===<br>
Add how many elements: Enter brand: Enter year: Enter TC(1-f1;2-f2;3-f3): The list before running f3:<br>
(a9,3) (A2,60) (b2,11) (C3,10) (d6,47) (E6,69) (1F,15) (3G1,18) (2H,25)<br>
OUTPUT:<br>
(A2,60) (b2,11) (C3,10) (d6,47) (E6,69) (1F,15) (3G1,18) (2H,25)<br>
-&gt; PASS<br>
5/5 runs match the expected output</div>
<p>The last run is the interesting one: adding <code>(a9,3)</code> changes the smallest odd year from 11 to 3, so now only <code>a9</code> is removed and <code>b2</code> survives. A solution that hard-codes "remove b2" or computes the minimum on the fixed list only would fail exactly this kind of hidden test.</p>`,
    `<h2>4. Giải mẫu 1 — đề PE6 (SU25) câu 3: Wine và MyWine</h2>
<p>Đề: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 6 (SU25)</a>, câu 3. Viết <code>Wine(brand, year)</code> có getter và setter, và <code>MyWine implements IWine</code> — interface được cho dạng byte code. f1, f2, f3 như bảng ở mục 1.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/a42d75cd6d63305808752540e171fba4095d48fa.svg" alt="Câu 3 đề PE6: thứ được cho dạng .class, thứ bạn viết, cách Main dựng danh sách" loading="lazy" /><p class="chu-thich">🧩 Câu 3 đề PE6: thứ được cho dạng .class, thứ bạn viết, cách Main dựng danh sách</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title PE6 question 3 — IWine is given as byte code: you write Wine and MyWine
interface IWine &lt;&lt;given .class&gt;&gt; {
  + f1(t : List&lt;Wine&gt;) : String
  + f2(t : List&lt;Wine&gt;) : void
  + f3(t : List&lt;Wine&gt;) : void
}
class Wine {
  - brand : String
  - year : int
  --
  + Wine()
  + Wine(brand : String, year : int)
  + getBrand() : String
  + getYear() : int
  + setBrand(brand : String) : void
  + setYear(year : int) : void
}
class MyWine {
  + f1(t : List&lt;Wine&gt;) : String
  + f2(t : List&lt;Wine&gt;) : void
  + f3(t : List&lt;Wine&gt;) : void
  - isPrime(n : int) : boolean
}
class Main &lt;&lt;given .class&gt;&gt; {
  + {static} dispList(t : List&lt;Wine&gt;) : void
  + {static} main(args : String[]) : void
}
IWine &lt;|.. MyWine
MyWine ..&gt; Wine : reads / changes
Main ..&gt; IWine : IWine my = new MyWine()
Main ..&gt; Wine : your wines first,\\nthen the fixed list of the TC
@enduml</code></pre></details>
<p>Tính tay TC3: các năm 60, 11, 10, 47, 69, 15, 18, 25 → năm lẻ 11, 47, 69, 15, 25 → năm lẻ nhỏ nhất <strong>11</strong> → brand bắt đầu bằng chữ thường VÀ year 11: chỉ có <code>b2</code>. <code>d6</code> cũng bắt đầu bằng chữ thường nhưng year là 47: nó ở lại.</p>
<details><summary>Lời giải (code tự viết, chạy trên JDK 8)</summary>
<pre class="trich"><code class="language-java">// CHO SẴN dạng IWine.class — javap in "f1(java.util.List&lt;Wine&gt;)": chữ &lt;Wine&gt; là thật
interface IWine {
    public String f1(List&lt;Wine&gt; t);
    public void f2(List&lt;Wine&gt; t);
    public void f3(List&lt;Wine&gt; t);
}</code></pre>
<pre class="trich"><code class="language-java">class Wine {
    private String brand;
    private int year;

    public Wine() {
    }

    public Wine(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }

    public String getBrand() { return brand; }
    public int getYear() { return year; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setYear(int year) { this.year = year; }
}</code></pre>
<pre class="trich"><code class="language-java">class MyWine implements IWine {

    // f1: brand ngắn nhất ĐẦU TIÊN trong các chai có year KHÔNG chia hết cho 3; không có ⇒ "Not found"
    @Override
    public String f1(List&lt;Wine&gt; t) {
        Wine best = null;
        for (Wine w : t) {
            if (w.getYear() % 3 != 0) {
                if (best == null || w.getBrand().length() &lt; best.getBrand().length()) {   // "&lt;", không phải "&lt;=": hoà thì giữ chai đứng trước
                    best = w;
                }
            }
        }
        return best == null ? "Not found" : best.getBrand();
    }

    // f2: brand có ĐỘ DÀI không nguyên tố thành "PRE" + chữ số đầu của year
    @Override
    public void f2(List&lt;Wine&gt; t) {
        for (Wine w : t) {
            if (!isPrime(w.getBrand().length())) {
                w.setBrand("PRE" + String.valueOf(Math.abs(w.getYear())).charAt(0));   // year 12 ⇒ '1' (bên trái nhất), không phải 12 % 10
            }
        }
    }

    // f3: trước hết tìm year LẺ nhỏ nhất của CẢ danh sách; rồi xoá brand bắt đầu bằng chữ thường VÀ có đúng year đó
    @Override
    public void f3(List&lt;Wine&gt; t) {
        Integer minOdd = null;
        for (Wine w : t) {
            if (w.getYear() % 2 != 0 &amp;&amp; (minOdd == null || w.getYear() &lt; minOdd)) {
                minOdd = w.getYear();
            }
        }
        if (minOdd == null) {
            return;                                          // không có year lẻ: "không làm gì"
        }
        Iterator&lt;Wine&gt; it = t.iterator();                    // xoá qua iterator: tại chỗ, giữ thứ tự, không ngoại lệ
        while (it.hasNext()) {
            Wine w = it.next();
            String b = w.getBrand();
            if (!b.isEmpty() &amp;&amp; Character.isLowerCase(b.charAt(0)) &amp;&amp; w.getYear() == minOdd) {
                it.remove();
            }
        }
    }

    // hàm phụ tự viết — đề cho phép "other functions in MyWine"
    private boolean isPrime(int n) {
        if (n &lt; 2) return false;
        for (int d = 2; d * d &lt;= n; d++) {
            if (n % d == 0) return false;
        }
        return true;
    }
}</code></pre>
<p>Các quyết định: ở f1, <code>&lt;</code> giữ brand ĐẦU TIÊN trong các brand ngắn bằng nhau (PJ trước DU). Ở f2, phép kiểm nguyên tố là một hàm phụ private — đề cho phép rõ ràng "other functions in MyWine". Ở f3, năm lẻ nhỏ nhất được tính trên cả danh sách <em>trước khi</em> xoá bất cứ gì, là một <code>Integer</code> giữ nguyên <code>null</code> khi không có năm lẻ nào ("không làm gì"), và việc xoá đi qua iterator, nên thứ tự phần còn lại được giữ và không thể có ngoại lệ.</p>
</details>
<pre class="trich"><code class="language-java">// Bản thay cho Main.class đề cho (javap -c): các chai BẠN thêm đứng TRƯỚC, sau đó mới tới danh sách cố định của TC
class Main {
    static void dispList(List&lt;Wine&gt; t) {
        for (Wine w : t) System.out.printf("(%s,%d) ", w.getBrand(), w.getYear());
        System.out.printf("\\r\\n");
    }

    static void addToList(List&lt;Wine&gt; t, String[] b, int[] y) {
        for (int i = 0; i &lt; b.length; i++) t.add(new Wine(b[i], y[i]));
    }

    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        List&lt;Wine&gt; t = new ArrayList&lt;Wine&gt;();
        String[] b1 = {"VNA", "VJA", "FR", "PJ", "DU", "ITA"};
        int[] y1 = {3, 9, 6, 17, 11, 13};
        String[] b2 = {"A", "B1X", "C345", "D2Y", "E678", "1F", "3G1A", "2H"};
        int[] y2 = {6, 9, 2, 29, 3, 19, 12, 25};
        String[] b3 = {"A2", "b2", "C3", "d6", "E6", "1F", "3G1", "2H"};
        int[] y3 = {60, 11, 10, 47, 69, 15, 18, 25};
        System.out.print("Add how many elements: ");
        int n = sc.nextInt();
        sc.nextLine();
        for (int i = 0; i &lt; n; i++) {
            System.out.print("Enter brand: ");
            String brand = sc.nextLine();
            System.out.print("Enter year: ");
            int year = sc.nextInt();
            sc.nextLine();
            t.add(new Wine(brand, year));
        }
        System.out.print("Enter TC(1-f1;2-f2;3-f3): ");
        int tc = sc.nextInt();
        sc.nextLine();
        IWine my = new MyWine();
        if (tc == 1) addToList(t, b1, y1);
        if (tc == 2) addToList(t, b2, y2);
        if (tc == 3) addToList(t, b3, y3);
        System.out.println("The list before running f" + tc + ":");
        dispList(t);
        System.out.printf("OUTPUT:\\r\\n");
        switch (tc) {
            case 1: System.out.printf("%s\\r\\n", my.f1(t)); break;
            case 2: my.f2(t); dispList(t); break;
            case 3: my.f3(t); dispList(t); break;
        }
        System.out.println();
    }
}</code></pre>
<p>Dữ liệu vào: ba mẫu (thêm 0 phần tử, rồi chọn TC), và hai lần chạy tự thêm có thêm một chai — Main đặt nó <strong>trước</strong> danh sách cố định:</p>
<pre><code class="language-plaintext"># TC1 f1 (paper sample 1)
0
1
# TC2 f2 (paper sample 2)
0
2
# TC3 f3 (paper sample 3)
0
3
# TC1 again, own test: one added wine
1
K
7
1
# TC3 again, own test: one added wine with an odd year 3
1
a9
3
3</code></pre>
<div class="out">=== TC1 f1 (paper sample 1) ===<br>
Add how many elements: Enter TC(1-f1;2-f2;3-f3): The list before running f1:<br>
(VNA,3) (VJA,9) (FR,6) (PJ,17) (DU,11) (ITA,13)<br>
OUTPUT:<br>
PJ<br>
-&gt; PASS<br>
=== TC2 f2 (paper sample 2) ===<br>
Add how many elements: Enter TC(1-f1;2-f2;3-f3): The list before running f2:<br>
(A,6) (B1X,9) (C345,2) (D2Y,29) (E678,3) (1F,19) (3G1A,12) (2H,25)<br>
OUTPUT:<br>
(PRE6,6) (B1X,9) (PRE2,2) (D2Y,29) (PRE3,3) (1F,19) (PRE1,12) (2H,25)<br>
-&gt; PASS<br>
=== TC3 f3 (paper sample 3) ===<br>
Add how many elements: Enter TC(1-f1;2-f2;3-f3): The list before running f3:<br>
(A2,60) (b2,11) (C3,10) (d6,47) (E6,69) (1F,15) (3G1,18) (2H,25)<br>
OUTPUT:<br>
(A2,60) (C3,10) (d6,47) (E6,69) (1F,15) (3G1,18) (2H,25)<br>
-&gt; PASS<br>
=== TC1 again, own test: one added wine ===<br>
Add how many elements: Enter brand: Enter year: Enter TC(1-f1;2-f2;3-f3): The list before running f1:<br>
(K,7) (VNA,3) (VJA,9) (FR,6) (PJ,17) (DU,11) (ITA,13)<br>
OUTPUT:<br>
K<br>
-&gt; PASS<br>
=== TC3 again, own test: one added wine with an odd year 3 ===<br>
Add how many elements: Enter brand: Enter year: Enter TC(1-f1;2-f2;3-f3): The list before running f3:<br>
(a9,3) (A2,60) (b2,11) (C3,10) (d6,47) (E6,69) (1F,15) (3G1,18) (2H,25)<br>
OUTPUT:<br>
(A2,60) (b2,11) (C3,10) (d6,47) (E6,69) (1F,15) (3G1,18) (2H,25)<br>
-&gt; PASS<br>
5/5 runs match the expected output</div>
<p>Lần chạy cuối là lần đáng xem: thêm <code>(a9,3)</code> đổi năm lẻ nhỏ nhất từ 11 thành 3, nên giờ chỉ <code>a9</code> bị xoá và <code>b2</code> sống sót. Một lời giải viết cứng "xoá b2" hay chỉ tính min trên danh sách cố định sẽ trượt đúng loại test ẩn này.</p>`),
    bi(`<h2>5. Solved paper 2 — PE11 (SU26) question 3: Ladder and MyLadder</h2>
<p>Paper: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 11 (SU26)</a>, question 3 (PE12 and PE13 have the same question). f1 — sum of prices where the type has more upper-case than lower-case letters; f2 — price 0 for every ladder whose type has the longest length; f3 — remove every item whose type contains the greatest number of letters.</p>
<details><summary>Solution (run on JDK 8)</summary>
<pre class="trich"><code class="language-java">class MyLadder implements ILadder {

    // f1: sum of prices where type has MORE upper-case than lower-case letters (digits count for neither)
    @Override
    public int f1(List&lt;Ladder&gt; t) {
        int sum = 0;
        for (Ladder x : t) {
            int up = 0, low = 0;
            for (char c : x.getType().toCharArray()) {
                if (Character.isUpperCase(c)) up++;
                else if (Character.isLowerCase(c)) low++;
            }
            if (up &gt; low) sum += x.getPrice();
        }
        return sum;
    }

    // f2: LENGTH of the whole string (letters + digits); EVERY ladder at the maximum gets price 0
    @Override
    public void f2(List&lt;Ladder&gt; t) {
        int max = -1;
        for (Ladder x : t) max = Math.max(max, x.getType().length());     // pass 1: find the maximum
        for (Ladder x : t) {                                              // pass 2: act on everyone equal to it
            if (x.getType().length() == max) x.setPrice(0);
        }
    }

    // f3: number of LETTERS only; remove every item at the maximum, in place
    @Override
    public void f3(List&lt;Ladder&gt; t) {
        int max = -1;
        for (Ladder x : t) max = Math.max(max, letters(x.getType()));    // fixed BEFORE removing anything
        Iterator&lt;Ladder&gt; it = t.iterator();
        while (it.hasNext()) {
            if (letters(it.next().getType()) == max) it.remove();
        }
    }

    private int letters(String s) {
        int n = 0;
        for (char c : s.toCharArray()) {
            if (Character.isLetter(c)) n++;
        }
        return n;
    }
}</code></pre>
<p>Three different ways of counting on one list, and the paper's samples were chosen to punish mixing them up: f2 measures <code>length()</code> (A12 and B12, length 3), f3 counts <code>Character.isLetter</code> only (AB123 and AC1, 2 letters each — A1234 is longer but has 1 letter). Both f2 and f3 fix the maximum in a first pass.</p>
</details>
<pre class="trich"><code class="language-java">// Stand-in for the given Main.class (javap -c) — the same template as PE6: added items first, fixed list after
class Main {
    static void dispList(List&lt;Ladder&gt; t) {
        for (Ladder x : t) System.out.printf("(%s,%d) ", x.getType(), x.getPrice());
        System.out.printf("\\r\\n");
    }

    static void addToList(List&lt;Ladder&gt; t, String[] a, int[] b) {
        for (int i = 0; i &lt; a.length; i++) t.add(new Ladder(a[i], b[i]));
    }

    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        List&lt;Ladder&gt; t = new ArrayList&lt;Ladder&gt;();
        String[] a1 = {"AB1", "BC1", "de1", "ef2"};
        int[] b1 = {11, 9, 16, 14};
        String[] a2 = {"A1", "B1", "A12", "B12"};
        int[] b2 = {6, 9, 2, 5};
        String[] a3 = {"AB123", "AC1", "A1234", "B1"};
        int[] b3 = {10, 11, 12, 13};
        System.out.print("Add how many elements: ");
        int n = sc.nextInt();
        sc.nextLine();
        for (int i = 0; i &lt; n; i++) {
            System.out.print("Enter type: ");
            String type = sc.nextLine();
            System.out.print("Enter price: ");
            int price = sc.nextInt();
            sc.nextLine();
            t.add(new Ladder(type, price));
        }
        System.out.print("Enter TC(1-f1;2-f2;3-f3): ");
        int tc = sc.nextInt();
        sc.nextLine();
        ILadder my = new MyLadder();
        if (tc == 1) addToList(t, a1, b1);
        if (tc == 2) addToList(t, a2, b2);
        if (tc == 3) addToList(t, a3, b3);
        System.out.println("The list before running f" + tc + ":");
        dispList(t);
        System.out.printf("OUTPUT:\\r\\n");
        switch (tc) {
            case 1: System.out.printf("%s\\r\\n", my.f1(t)); break;
            case 2: my.f2(t); dispList(t); break;
            case 3: my.f3(t); dispList(t); break;
        }
        System.out.println();
    }
}</code></pre>
<div class="out">=== TC1 f1 (paper sample 1) ===<br>
Add how many elements: Enter TC(1-f1;2-f2;3-f3): The list before running f1:<br>
(AB1,11) (BC1,9) (de1,16) (ef2,14)<br>
OUTPUT:<br>
20<br>
-&gt; PASS<br>
=== TC2 f2 (paper sample 2) ===<br>
Add how many elements: Enter TC(1-f1;2-f2;3-f3): The list before running f2:<br>
(A1,6) (B1,9) (A12,2) (B12,5)<br>
OUTPUT:<br>
(A1,6) (B1,9) (A12,0) (B12,0)<br>
-&gt; PASS<br>
=== TC3 f3 (paper sample 3) ===<br>
Add how many elements: Enter TC(1-f1;2-f2;3-f3): The list before running f3:<br>
(AB123,10) (AC1,11) (A1234,12) (B1,13)<br>
OUTPUT:<br>
(A1234,12) (B1,13)<br>
-&gt; PASS<br>
=== TC3 again, own test: letters, not length ===<br>
Add how many elements: Enter type: Enter price: Enter TC(1-f1;2-f2;3-f3): The list before running f3:<br>
(abc,1) (AB123,10) (AC1,11) (A1234,12) (B1,13)<br>
OUTPUT:<br>
(AB123,10) (AC1,11) (A1234,12) (B1,13)<br>
-&gt; PASS<br>
4/4 runs match the expected output</div>
<p>Our own fourth run adds <code>(abc,1)</code>: three letters but only three characters long. If f3 measured length instead of letters, it would remove AB123 and A1234 (length 5) and keep <code>abc</code> — the opposite of the right answer.</p>`,
    `<h2>5. Giải mẫu 2 — đề PE11 (SU26) câu 3: Ladder và MyLadder</h2>
<p>Đề: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 11 (SU26)</a>, câu 3 (PE12 và PE13 có cùng câu này). f1 — tổng price của các type có nhiều chữ hoa hơn chữ thường; f2 — price 0 cho mọi cái thang có type dài nhất; f3 — xoá mọi phần tử có type chứa nhiều chữ cái nhất.</p>
<details><summary>Lời giải (chạy trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class MyLadder implements ILadder {

    // f1: tổng price của các type có chữ HOA NHIỀU HƠN chữ thường (chữ số không tính bên nào)
    @Override
    public int f1(List&lt;Ladder&gt; t) {
        int sum = 0;
        for (Ladder x : t) {
            int up = 0, low = 0;
            for (char c : x.getType().toCharArray()) {
                if (Character.isUpperCase(c)) up++;
                else if (Character.isLowerCase(c)) low++;
            }
            if (up &gt; low) sum += x.getPrice();
        }
        return sum;
    }

    // f2: ĐỘ DÀI cả chuỗi (chữ + số); MỌI cái thang đạt độ dài lớn nhất đều có price 0
    @Override
    public void f2(List&lt;Ladder&gt; t) {
        int max = -1;
        for (Ladder x : t) max = Math.max(max, x.getType().length());     // lượt 1: tìm giá trị lớn nhất
        for (Ladder x : t) {                                              // lượt 2: xử lý mọi phần tử bằng nó
            if (x.getType().length() == max) x.setPrice(0);
        }
    }

    // f3: chỉ đếm CHỮ CÁI; xoá mọi phần tử đạt mức lớn nhất, tại chỗ
    @Override
    public void f3(List&lt;Ladder&gt; t) {
        int max = -1;
        for (Ladder x : t) max = Math.max(max, letters(x.getType()));    // chốt TRƯỚC khi xoá bất cứ gì
        Iterator&lt;Ladder&gt; it = t.iterator();
        while (it.hasNext()) {
            if (letters(it.next().getType()) == max) it.remove();
        }
    }

    private int letters(String s) {
        int n = 0;
        for (char c : s.toCharArray()) {
            if (Character.isLetter(c)) n++;
        }
        return n;
    }
}</code></pre>
<p>Ba cách đếm khác nhau trên cùng một danh sách, và mẫu của đề được chọn để phạt ai trộn lẫn chúng: f2 đo <code>length()</code> (A12 và B12, dài 3), f3 chỉ đếm <code>Character.isLetter</code> (AB123 và AC1, mỗi cái 2 chữ cái — A1234 dài hơn nhưng chỉ có 1 chữ cái). Cả f2 và f3 đều chốt giá trị lớn nhất ở lượt đầu.</p>
</details>
<pre class="trich"><code class="language-java">// Bản thay cho Main.class đề cho (javap -c) — cùng khuôn với PE6: phần tử thêm trước, danh sách cố định sau
class Main {
    static void dispList(List&lt;Ladder&gt; t) {
        for (Ladder x : t) System.out.printf("(%s,%d) ", x.getType(), x.getPrice());
        System.out.printf("\\r\\n");
    }

    static void addToList(List&lt;Ladder&gt; t, String[] a, int[] b) {
        for (int i = 0; i &lt; a.length; i++) t.add(new Ladder(a[i], b[i]));
    }

    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        List&lt;Ladder&gt; t = new ArrayList&lt;Ladder&gt;();
        String[] a1 = {"AB1", "BC1", "de1", "ef2"};
        int[] b1 = {11, 9, 16, 14};
        String[] a2 = {"A1", "B1", "A12", "B12"};
        int[] b2 = {6, 9, 2, 5};
        String[] a3 = {"AB123", "AC1", "A1234", "B1"};
        int[] b3 = {10, 11, 12, 13};
        System.out.print("Add how many elements: ");
        int n = sc.nextInt();
        sc.nextLine();
        for (int i = 0; i &lt; n; i++) {
            System.out.print("Enter type: ");
            String type = sc.nextLine();
            System.out.print("Enter price: ");
            int price = sc.nextInt();
            sc.nextLine();
            t.add(new Ladder(type, price));
        }
        System.out.print("Enter TC(1-f1;2-f2;3-f3): ");
        int tc = sc.nextInt();
        sc.nextLine();
        ILadder my = new MyLadder();
        if (tc == 1) addToList(t, a1, b1);
        if (tc == 2) addToList(t, a2, b2);
        if (tc == 3) addToList(t, a3, b3);
        System.out.println("The list before running f" + tc + ":");
        dispList(t);
        System.out.printf("OUTPUT:\\r\\n");
        switch (tc) {
            case 1: System.out.printf("%s\\r\\n", my.f1(t)); break;
            case 2: my.f2(t); dispList(t); break;
            case 3: my.f3(t); dispList(t); break;
        }
        System.out.println();
    }
}</code></pre>
<div class="out">=== TC1 f1 (paper sample 1) ===<br>
Add how many elements: Enter TC(1-f1;2-f2;3-f3): The list before running f1:<br>
(AB1,11) (BC1,9) (de1,16) (ef2,14)<br>
OUTPUT:<br>
20<br>
-&gt; PASS<br>
=== TC2 f2 (paper sample 2) ===<br>
Add how many elements: Enter TC(1-f1;2-f2;3-f3): The list before running f2:<br>
(A1,6) (B1,9) (A12,2) (B12,5)<br>
OUTPUT:<br>
(A1,6) (B1,9) (A12,0) (B12,0)<br>
-&gt; PASS<br>
=== TC3 f3 (paper sample 3) ===<br>
Add how many elements: Enter TC(1-f1;2-f2;3-f3): The list before running f3:<br>
(AB123,10) (AC1,11) (A1234,12) (B1,13)<br>
OUTPUT:<br>
(A1234,12) (B1,13)<br>
-&gt; PASS<br>
=== TC3 again, own test: letters, not length ===<br>
Add how many elements: Enter type: Enter price: Enter TC(1-f1;2-f2;3-f3): The list before running f3:<br>
(abc,1) (AB123,10) (AC1,11) (A1234,12) (B1,13)<br>
OUTPUT:<br>
(AB123,10) (AC1,11) (A1234,12) (B1,13)<br>
-&gt; PASS<br>
4/4 runs match the expected output</div>
<p>Lần chạy thứ tư tự thêm <code>(abc,1)</code>: ba chữ cái nhưng chỉ dài ba ký tự. Nếu f3 đo độ dài thay vì đếm chữ cái, nó sẽ xoá AB123 và A1234 (dài 5) và giữ <code>abc</code> — ngược hẳn với đáp án đúng.</p>`),
    bi(`<h2>6. Solved paper 3 — PE8 (SP25) question 3: Watch and WatchList</h2>
<p>Paper: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 8 (SP25)</a>, question 3 — the "list class" costume. <code>Watch(id, brand, model, price)</code> with <code>toString()</code> "id, brand, model, price" (2 decimals); <code>WatchList extends ArrayList&lt;Watch&gt;</code> with <code>addWatch</code>, <code>filterByBrand(value)</code> — the watches whose brand equals value ignoring case, otherwise <strong>null</strong>; <code>findMostExpensive()</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/23b628be8bab37a10d22ae0bf3a44de77a065f14.svg" alt="PE8 question 3: WatchList inherits the whole ArrayList — add, get, size, iteration" loading="lazy" /><p class="chu-thich">🧩 PE8 question 3: WatchList inherits the whole ArrayList — add, get, size, iteration</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title PE8 question 3 — WatchList IS an ArrayList of Watch
class "ArrayList&lt;Watch&gt;" as AL &lt;&lt;java.util&gt;&gt; {
  + add(e : Watch) : boolean
  + get(i : int) : Watch
  + size() : int
  + iterator() : Iterator&lt;Watch&gt;
}
class WatchList {
  + addWatch(watch : Watch) : void
  + filterByBrand(value : String) : WatchList
  + findMostExpensive() : Watch
}
class Watch {
  - id : int
  - brand : String
  - model : String
  - price : double
  --
  + Watch()
  + Watch(id, brand, model, price)
  + getters and setters
  + toString() : String
}
AL &lt;|-- WatchList
AL o-- "0..*" Watch
note right of WatchList::filterByBrand
  nothing found ⇒ return null
  (Main prints N/A itself)
end note
@enduml</code></pre></details>
<details><summary>Solution (run on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Watch {
    private int id;
    private String brand;
    private String model;
    private double price;

    public Watch() {
    }

    public Watch(int id, String brand, String model, double price) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.price = price;
    }

    public int getId() { return id; }
    public String getBrand() { return brand; }
    public String getModel() { return model; }
    public double getPrice() { return price; }
    public void setId(int id) { this.id = id; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setModel(String model) { this.model = model; }
    public void setPrice(double price) { this.price = price; }

    // "id, brand, model, price" — brand and model exactly as stored (no upper case here)
    @Override
    public String toString() {
        return id + ", " + brand + ", " + model + ", " + String.format("%.2f", price);
    }
}</code></pre>
<pre class="trich"><code class="language-java">class WatchList extends ArrayList&lt;Watch&gt; {                   // WITH &lt;Watch&gt;: then get(i) is a Watch, no cast

    public void addWatch(Watch watch) {
        add(watch);                                          // the inherited ArrayList.add — WatchList IS a list
    }

    // brand equal to value, ignoring case; NOTHING found ⇒ null (Main tests for null and prints N/A)
    public WatchList filterByBrand(String value) {
        WatchList result = new WatchList();
        for (Watch w : this) {
            if (w.getBrand().equalsIgnoreCase(value)) {
                result.add(w);
            }
        }
        return result.isEmpty() ? null : result;
    }

    // "only one watch with the highest price" ⇒ a plain scan for the maximum
    public Watch findMostExpensive() {
        Watch max = null;
        for (Watch w : this) {
            if (max == null || w.getPrice() &gt; max.getPrice()) {
                max = w;
            }
        }
        return max;
    }
}</code></pre>
<p>A <code>WatchList</code> has no list field: it <em>is</em> the list, so <code>for (Watch w : this)</code> walks it and <code>add(w)</code> is the inherited method. <code>filterByBrand</code> builds a new <code>WatchList</code> and converts "empty" into <code>null</code> at the very end — one line, and the reason the third sample prints <code>N/A</code>.</p>
</details>
<pre class="trich"><code class="language-java">// Stand-in for the given Main.class (javap -c): it fills the list with add() — your addWatch() is graded by reading, not by Main
class Main {
    static void printWatchList(WatchList list) {
        for (Watch w : list) printWatch(w);
    }

    static void printWatch(Watch w) {
        System.out.println(w.toString());
    }

    public static void main(String[] args) {
        System.out.println("The watches have been added:");
        WatchList list = new WatchList();
        list.add(new Watch(1, "Rolex", "Submariner", 7500.0));
        list.add(new Watch(2, "Omega", "Speedmaster", 5000.0));
        list.add(new Watch(3, "Seiko", "Prospex", 300.0));
        list.add(new Watch(6, "Rolex", "Daytona", 13500.0));
        printWatchList(list);
        System.out.println("Add a new watch:");
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter id: ");
        int id = sc.nextInt();
        sc.nextLine();
        System.out.print("Enter brand: ");
        String brand = sc.nextLine();
        System.out.print("Enter model: ");
        String model = sc.nextLine();
        System.out.print("Enter price: ");
        double price = sc.nextDouble();
        list.add(new Watch(id, brand, model, price));
        System.out.println("1. Test filterByBrand");
        System.out.println("2. Test findMostExpensive");
        System.out.print("Enter TC (1/2): ");
        int tc = sc.nextInt();
        if (tc == 1) {
            System.out.print("Enter brand: ");
            sc.nextLine();
            String value = sc.nextLine();
            System.out.println("OUTPUT:");
            WatchList found = list.filterByBrand(value);
            if (found != null) printWatchList(found);
            else System.out.println("N/A");
        } else if (tc == 2) {
            System.out.println("OUTPUT:");
            printWatch(list.findMostExpensive());
        }
        sc.close();
    }
}</code></pre>
<div class="out">=== TC1 filterByBrand rolex (paper sample 1) ===<br>
The watches have been added:<br>
1, Rolex, Submariner, 7500.00<br>
2, Omega, Speedmaster, 5000.00<br>
3, Seiko, Prospex, 300.00<br>
6, Rolex, Daytona, 13500.00<br>
Add a new watch:<br>
Enter id: Enter brand: Enter model: Enter price: 1. Test filterByBrand<br>
2. Test findMostExpensive<br>
Enter TC (1/2): Enter brand: OUTPUT:<br>
1, Rolex, Submariner, 7500.00<br>
6, Rolex, Daytona, 13500.00<br>
5, rolex, Datejust, 10000.45<br>
-&gt; PASS<br>
=== TC2 findMostExpensive (paper sample 2) ===<br>
The watches have been added:<br>
1, Rolex, Submariner, 7500.00<br>
2, Omega, Speedmaster, 5000.00<br>
3, Seiko, Prospex, 300.00<br>
6, Rolex, Daytona, 13500.00<br>
Add a new watch:<br>
Enter id: Enter brand: Enter model: Enter price: 1. Test filterByBrand<br>
2. Test findMostExpensive<br>
Enter TC (1/2): OUTPUT:<br>
5, casio, gshock, 20000.00<br>
-&gt; PASS<br>
=== TC1 filterByBrand tissot (paper sample 3) ===<br>
The watches have been added:<br>
1, Rolex, Submariner, 7500.00<br>
2, Omega, Speedmaster, 5000.00<br>
3, Seiko, Prospex, 300.00<br>
6, Rolex, Daytona, 13500.00<br>
Add a new watch:<br>
Enter id: Enter brand: Enter model: Enter price: 1. Test filterByBrand<br>
2. Test findMostExpensive<br>
Enter TC (1/2): Enter brand: OUTPUT:<br>
N/A<br>
-&gt; PASS<br>
3/3 runs match the expected output</div>
<p>Notice what Main prints before asking anything: "The watches have been added:" and four watches that it builds itself. Those lines are the same in every run, which is why the paper's samples only show what comes after <code>OUTPUT:</code>.</p>`,
    `<h2>6. Giải mẫu 3 — đề PE8 (SP25) câu 3: Watch và WatchList</h2>
<p>Đề: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 8 (SP25)</a>, câu 3 — bộ áo "lớp danh sách". <code>Watch(id, brand, model, price)</code> với <code>toString()</code> "id, brand, model, price" (2 chữ số thập phân); <code>WatchList extends ArrayList&lt;Watch&gt;</code> với <code>addWatch</code>, <code>filterByBrand(value)</code> — các đồng hồ có brand bằng value không phân biệt hoa thường, ngược lại trả <strong>null</strong>; <code>findMostExpensive()</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/23b628be8bab37a10d22ae0bf3a44de77a065f14.svg" alt="Câu 3 đề PE8: WatchList kế thừa trọn ArrayList — add, get, size, duyệt" loading="lazy" /><p class="chu-thich">🧩 Câu 3 đề PE8: WatchList kế thừa trọn ArrayList — add, get, size, duyệt</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title PE8 question 3 — WatchList IS an ArrayList of Watch
class "ArrayList&lt;Watch&gt;" as AL &lt;&lt;java.util&gt;&gt; {
  + add(e : Watch) : boolean
  + get(i : int) : Watch
  + size() : int
  + iterator() : Iterator&lt;Watch&gt;
}
class WatchList {
  + addWatch(watch : Watch) : void
  + filterByBrand(value : String) : WatchList
  + findMostExpensive() : Watch
}
class Watch {
  - id : int
  - brand : String
  - model : String
  - price : double
  --
  + Watch()
  + Watch(id, brand, model, price)
  + getters and setters
  + toString() : String
}
AL &lt;|-- WatchList
AL o-- "0..*" Watch
note right of WatchList::filterByBrand
  nothing found ⇒ return null
  (Main prints N/A itself)
end note
@enduml</code></pre></details>
<details><summary>Lời giải (chạy trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Watch {
    private int id;
    private String brand;
    private String model;
    private double price;

    public Watch() {
    }

    public Watch(int id, String brand, String model, double price) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.price = price;
    }

    public int getId() { return id; }
    public String getBrand() { return brand; }
    public String getModel() { return model; }
    public double getPrice() { return price; }
    public void setId(int id) { this.id = id; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setModel(String model) { this.model = model; }
    public void setPrice(double price) { this.price = price; }

    // "id, brand, model, price" — brand và model đúng như đã lưu (câu này không viết hoa)
    @Override
    public String toString() {
        return id + ", " + brand + ", " + model + ", " + String.format("%.2f", price);
    }
}</code></pre>
<pre class="trich"><code class="language-java">class WatchList extends ArrayList&lt;Watch&gt; {                   // CÓ &lt;Watch&gt;: get(i) là Watch, không cần ép kiểu

    public void addWatch(Watch watch) {
        add(watch);                                          // add() kế thừa từ ArrayList — WatchList LÀ một danh sách
    }

    // brand bằng value, không phân biệt hoa thường; KHÔNG có ⇒ null (Main kiểm null rồi in N/A)
    public WatchList filterByBrand(String value) {
        WatchList result = new WatchList();
        for (Watch w : this) {
            if (w.getBrand().equalsIgnoreCase(value)) {
                result.add(w);
            }
        }
        return result.isEmpty() ? null : result;
    }

    // "chỉ một chiếc giá cao nhất" ⇒ quét tìm max đơn giản
    public Watch findMostExpensive() {
        Watch max = null;
        for (Watch w : this) {
            if (max == null || w.getPrice() &gt; max.getPrice()) {
                max = w;
            }
        }
        return max;
    }
}</code></pre>
<p><code>WatchList</code> không có trường danh sách: nó <em>là</em> danh sách, nên <code>for (Watch w : this)</code> duyệt nó và <code>add(w)</code> là phương thức kế thừa. <code>filterByBrand</code> dựng một <code>WatchList</code> mới và đổi "rỗng" thành <code>null</code> ở đúng dòng cuối — một dòng, và là lý do mẫu thứ ba in <code>N/A</code>.</p>
</details>
<pre class="trich"><code class="language-java">// Bản thay cho Main.class đề cho (javap -c): nó đổ dữ liệu bằng add() — addWatch() của bạn được chấm bằng cách đọc code, Main không gọi
class Main {
    static void printWatchList(WatchList list) {
        for (Watch w : list) printWatch(w);
    }

    static void printWatch(Watch w) {
        System.out.println(w.toString());
    }

    public static void main(String[] args) {
        System.out.println("The watches have been added:");
        WatchList list = new WatchList();
        list.add(new Watch(1, "Rolex", "Submariner", 7500.0));
        list.add(new Watch(2, "Omega", "Speedmaster", 5000.0));
        list.add(new Watch(3, "Seiko", "Prospex", 300.0));
        list.add(new Watch(6, "Rolex", "Daytona", 13500.0));
        printWatchList(list);
        System.out.println("Add a new watch:");
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter id: ");
        int id = sc.nextInt();
        sc.nextLine();
        System.out.print("Enter brand: ");
        String brand = sc.nextLine();
        System.out.print("Enter model: ");
        String model = sc.nextLine();
        System.out.print("Enter price: ");
        double price = sc.nextDouble();
        list.add(new Watch(id, brand, model, price));
        System.out.println("1. Test filterByBrand");
        System.out.println("2. Test findMostExpensive");
        System.out.print("Enter TC (1/2): ");
        int tc = sc.nextInt();
        if (tc == 1) {
            System.out.print("Enter brand: ");
            sc.nextLine();
            String value = sc.nextLine();
            System.out.println("OUTPUT:");
            WatchList found = list.filterByBrand(value);
            if (found != null) printWatchList(found);
            else System.out.println("N/A");
        } else if (tc == 2) {
            System.out.println("OUTPUT:");
            printWatch(list.findMostExpensive());
        }
        sc.close();
    }
}</code></pre>
<div class="out">=== TC1 filterByBrand rolex (paper sample 1) ===<br>
The watches have been added:<br>
1, Rolex, Submariner, 7500.00<br>
2, Omega, Speedmaster, 5000.00<br>
3, Seiko, Prospex, 300.00<br>
6, Rolex, Daytona, 13500.00<br>
Add a new watch:<br>
Enter id: Enter brand: Enter model: Enter price: 1. Test filterByBrand<br>
2. Test findMostExpensive<br>
Enter TC (1/2): Enter brand: OUTPUT:<br>
1, Rolex, Submariner, 7500.00<br>
6, Rolex, Daytona, 13500.00<br>
5, rolex, Datejust, 10000.45<br>
-&gt; PASS<br>
=== TC2 findMostExpensive (paper sample 2) ===<br>
The watches have been added:<br>
1, Rolex, Submariner, 7500.00<br>
2, Omega, Speedmaster, 5000.00<br>
3, Seiko, Prospex, 300.00<br>
6, Rolex, Daytona, 13500.00<br>
Add a new watch:<br>
Enter id: Enter brand: Enter model: Enter price: 1. Test filterByBrand<br>
2. Test findMostExpensive<br>
Enter TC (1/2): OUTPUT:<br>
5, casio, gshock, 20000.00<br>
-&gt; PASS<br>
=== TC1 filterByBrand tissot (paper sample 3) ===<br>
The watches have been added:<br>
1, Rolex, Submariner, 7500.00<br>
2, Omega, Speedmaster, 5000.00<br>
3, Seiko, Prospex, 300.00<br>
6, Rolex, Daytona, 13500.00<br>
Add a new watch:<br>
Enter id: Enter brand: Enter model: Enter price: 1. Test filterByBrand<br>
2. Test findMostExpensive<br>
Enter TC (1/2): Enter brand: OUTPUT:<br>
N/A<br>
-&gt; PASS<br>
3/3 runs match the expected output</div>
<p>Để ý Main in gì trước khi hỏi bất cứ điều gì: "The watches have been added:" và bốn chiếc đồng hồ nó tự tạo. Những dòng đó giống nhau ở mọi lần chạy, nên mẫu của đề chỉ hiện phần đứng sau <code>OUTPUT:</code>.</p>`),
    bi(`<h2>7. Fourteen ways to lose question 3 — each one measured</h2>
<p>Nine logic mistakes on lists, each run next to the right version, with data from the real papers where possible:</p>
<pre><code class="language-java">// release: 8
// Nine ways to lose the marks of a PE question 3 (f1/f2/f3 on a List, XxxList extends ArrayList), each run for real
import java.util.*;

class Thang {                                                // a Ladder of PE11: type, price
    String type; int price;
    Thang(String type, int price) { this.type = type; this.price = price; }
    @Override
    public String toString() { return "(" + type + "," + price + ")"; }
}

class Sach {                                                 // a Book of PE10: author, page
    String author; int page;
    Sach(String author, int page) { this.author = author; this.page = page; }
    @Override
    public String toString() { return "(" + author + ", " + page + ")"; }
}

public class LoiMatDiemQ3 {
    // PE11 question 3, TC3: remove every item having the most letters (AB123 and AC1, side by side)
    static List&lt;Thang&gt; pe11() {
        return new ArrayList&lt;Thang&gt;(Arrays.asList(new Thang("AB123", 10), new Thang("AC1", 11), new Thang("A1234", 12), new Thang("B1", 13)));
    }
    static int letters(String s) {
        int n = 0;
        for (char c : s.toCharArray()) if (Character.isLetter(c)) n++;
        return n;
    }

    public static void main(String[] args) {
        String mau3 = "[(A1234,12), (B1,13)]";

        // N1 — remove() inside a for-each
        List&lt;Thang&gt; t = pe11();
        String sai1;
        try {
            for (Thang x : t) if (letters(x.type) == 2) t.remove(x);
            sai1 = t.toString();
        } catch (ConcurrentModificationException e) {
            sai1 = "CRASH " + e.getClass().getName();
        }
        t = pe11();
        for (Iterator&lt;Thang&gt; it = t.iterator(); it.hasNext(); ) if (letters(it.next().type) == 2) it.remove();
        xem("N1 for-each + remove", mau3, sai1, t.toString());

        // N2 — a forward index loop: after remove(i) the next item slides into i, and i++ jumps over it
        t = pe11();
        for (int i = 0; i &lt; t.size(); i++) if (letters(t.get(i).type) == 2) t.remove(i);
        List&lt;Thang&gt; t2 = pe11();
        for (int i = t2.size() - 1; i &gt;= 0; i--) if (letters(t2.get(i).type) == 2) t2.remove(i);   // backwards is safe
        xem("N2 forward index loop", mau3, t.toString(), t2.toString());

        // N3 — "updated in place": building a new list and assigning it to the PARAMETER changes nothing for Main
        t = pe11();
        f3GanThamSo(t);
        String sai3 = t.toString();
        t = pe11();
        f3TaiCho(t);
        xem("N3 t = newList", mau3, sai3, t.toString());

        // N4 — PE10 f3 "page equals the minimum page": the minimum recomputed AFTER each removal moves
        List&lt;Sach&gt; s = new ArrayList&lt;Sach&gt;(Arrays.asList(new Sach("Nam", 50), new Sach("Nga", 60), new Sach("Tuan", 70)));
        for (Iterator&lt;Sach&gt; it = s.iterator(); it.hasNext(); ) {
            Sach b = it.next();
            if (b.author.startsWith("N") &amp;&amp; b.page == minPage(s)) it.remove();          // min of the CURRENT list
        }
        List&lt;Sach&gt; s2 = new ArrayList&lt;Sach&gt;(Arrays.asList(new Sach("Nam", 50), new Sach("Nga", 60), new Sach("Tuan", 70)));
        int min = minPage(s2);                                                          // fixed once, before removing
        for (Iterator&lt;Sach&gt; it = s2.iterator(); it.hasNext(); ) {
            Sach b = it.next();
            if (b.author.startsWith("N") &amp;&amp; b.page == min) it.remove();
        }
        xem("N4 moving minimum", "[(Nga, 60), (Tuan, 70)]", s.toString(), s2.toString());

        // N5 — a hand-written selection sort is NOT stable: equal pages swap places
        List&lt;Sach&gt; a = new ArrayList&lt;Sach&gt;(Arrays.asList(new Sach("Hoa", 50), new Sach("Lan", 50), new Sach("Mai", 10)));
        for (int i = 0; i &lt; a.size() - 1; i++) {
            int m = i;
            for (int j = i + 1; j &lt; a.size(); j++) if (a.get(j).page &lt; a.get(m).page) m = j;
            Collections.swap(a, i, m);
        }
        List&lt;Sach&gt; a2 = new ArrayList&lt;Sach&gt;(Arrays.asList(new Sach("Hoa", 50), new Sach("Lan", 50), new Sach("Mai", 10)));
        Collections.sort(a2, new Comparator&lt;Sach&gt;() {                                   // Collections.sort is stable
            @Override
            public int compare(Sach x, Sach y) { return Integer.compare(x.page, y.page); }
        });
        xem("N5 unstable sort", "[(Mai, 10), (Hoa, 50), (Lan, 50)]", a.toString(), a2.toString());

        // N6 — PE8 filterByBrand(): "otherwise return null"; an EMPTY list makes Main print nothing instead of N/A
        List&lt;String&gt; rong = new ArrayList&lt;String&gt;();
        List&lt;String&gt; khong = null;
        xem("N6 empty list vs null", "N/A", inNhuMain(rong), inNhuMain(khong));

        // N7 — PE8 "the string comparison is case-insensitive": brands Rolex, Rolex, rolex; the tester types "rolex"
        String[] brands = {"Rolex", "Omega", "Seiko", "Rolex", "rolex"};
        int bang = 0, khongPhanBiet = 0;
        for (String b : brands) {
            if (b.equals("rolex")) bang++;
            if (b.equalsIgnoreCase("rolex")) khongPhanBiet++;
        }
        xem("N7 equals in a filter", "3", String.valueOf(bang), String.valueOf(khongPhanBiet));

        // N8 — PE11 f2 "ALL ladders whose type has the longest length": stopping at the first one
        List&lt;Thang&gt; f2 = new ArrayList&lt;Thang&gt;(Arrays.asList(new Thang("A1", 6), new Thang("B1", 9), new Thang("A12", 2), new Thang("B12", 5)));
        Thang dai = f2.get(0);
        for (Thang x : f2) if (x.type.length() &gt; dai.type.length()) dai = x;
        dai.price = 0;                                                                  // only ONE item changed
        String sai8 = f2.toString();
        f2 = new ArrayList&lt;Thang&gt;(Arrays.asList(new Thang("A1", 6), new Thang("B1", 9), new Thang("A12", 2), new Thang("B12", 5)));
        int max = 0;
        for (Thang x : f2) max = Math.max(max, x.type.length());
        for (Thang x : f2) if (x.type.length() == max) x.price = 0;
        xem("N8 only the first maximum", "[(A1,6), (B1,9), (A12,0), (B12,0)]", sai8, f2.toString());

        // N9 — PE6 f1 "the FIRST shortest brand": "&lt;=" keeps replacing on a tie and returns the LAST one
        String[] cand = {"PJ", "DU", "ITA"};                                            // the wines left after "year not a multiple of 3"
        String le = cand[0], lt = cand[0];
        for (String c : cand) {
            if (c.length() &lt;= le.length()) le = c;
            if (c.length() &lt; lt.length()) lt = c;
        }
        xem("N9 &lt;= on a tie", "PJ", le, lt);
    }

    static void f3GanThamSo(List&lt;Thang&gt; t) {
        List&lt;Thang&gt; keep = new ArrayList&lt;Thang&gt;();
        for (Thang x : t) if (letters(x.type) != 2) keep.add(x);
        t = keep;                                            // only the local variable now points to keep
    }

    static void f3TaiCho(List&lt;Thang&gt; t) {
        List&lt;Thang&gt; keep = new ArrayList&lt;Thang&gt;();
        for (Thang x : t) if (letters(x.type) != 2) keep.add(x);
        t.clear();                                           // change the object Main is holding
        t.addAll(keep);
    }

    static int minPage(List&lt;Sach&gt; s) {
        int m = Integer.MAX_VALUE;
        for (Sach b : s) m = Math.min(m, b.page);
        return m;
    }

    // what PE8's Main does with the result of filterByBrand
    static String inNhuMain(List&lt;String&gt; found) {
        if (found != null) {
            StringBuilder b = new StringBuilder();
            for (String x : found) b.append(x).append("\\n");
            return b.toString().trim();                      // nothing at all for an empty list
        }
        return "N/A";
    }

    static void xem(String bay, String mau, String sai, String dung) {
        System.out.println(bay);
        System.out.println("   expected : " + mau);
        System.out.println("   wrong    : " + (sai.isEmpty() ? "(nothing printed)" : sai) + (sai.equals(mau) ? "   PASS" : "   FAIL"));
        System.out.println("   right    : " + dung + (dung.equals(mau) ? "   PASS" : "   FAIL"));
    }
}</code></pre>
<div class="out">N1 for-each + remove<br>
&nbsp;&nbsp;&nbsp;expected : [(A1234,12), (B1,13)]<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: CRASH java.util.ConcurrentModificationException &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: [(A1234,12), (B1,13)] &nbsp;&nbsp;PASS<br>
N2 forward index loop<br>
&nbsp;&nbsp;&nbsp;expected : [(A1234,12), (B1,13)]<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [(AC1,11), (A1234,12), (B1,13)] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: [(A1234,12), (B1,13)] &nbsp;&nbsp;PASS<br>
N3 t = newList<br>
&nbsp;&nbsp;&nbsp;expected : [(A1234,12), (B1,13)]<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [(AB123,10), (AC1,11), (A1234,12), (B1,13)] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: [(A1234,12), (B1,13)] &nbsp;&nbsp;PASS<br>
N4 moving minimum<br>
&nbsp;&nbsp;&nbsp;expected : [(Nga, 60), (Tuan, 70)]<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [(Tuan, 70)] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: [(Nga, 60), (Tuan, 70)] &nbsp;&nbsp;PASS<br>
N5 unstable sort<br>
&nbsp;&nbsp;&nbsp;expected : [(Mai, 10), (Hoa, 50), (Lan, 50)]<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [(Mai, 10), (Lan, 50), (Hoa, 50)] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: [(Mai, 10), (Hoa, 50), (Lan, 50)] &nbsp;&nbsp;PASS<br>
N6 empty list vs null<br>
&nbsp;&nbsp;&nbsp;expected : N/A<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: (nothing printed) &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: N/A &nbsp;&nbsp;PASS<br>
N7 equals in a filter<br>
&nbsp;&nbsp;&nbsp;expected : 3<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 1 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 3 &nbsp;&nbsp;PASS<br>
N8 only the first maximum<br>
&nbsp;&nbsp;&nbsp;expected : [(A1,6), (B1,9), (A12,0), (B12,0)]<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [(A1,6), (B1,9), (A12,0), (B12,5)] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: [(A1,6), (B1,9), (A12,0), (B12,0)] &nbsp;&nbsp;PASS<br>
N9 &lt;= on a tie<br>
&nbsp;&nbsp;&nbsp;expected : PJ<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: DU &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: PJ &nbsp;&nbsp;PASS</div>
<p>Five compile errors, on a real JDK 8, in a folder that holds — like the given project — only <code>IWine.class</code>, no <code>IWine.java</code>:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File q3 = new File("Q3");
    viet(q3, "Wine.java", WINE);
    viet(q3, "IWine.java", IWINE);
    lenh(q3, "javac", "Wine.java", "IWine.java");
    new File(q3, "IWine.java").delete();                         // the paper ships ONLY IWine.class
    viet(q3, "MyWine.java", MYWINE);
    lenh(q3, "javac", "MyWine.java");                            // javac finds IWine.class and Wine in the same folder
    lenh(q3, "javap", "IWine");                                   // what the given interface really declares

    System.out.println("\\n== A: import java.util.*; forgotten in MyWine.java ==");
    viet(q3, "MyWine.java", MYWINE.replace("import java.util.*;\\n", ""));
    lenh(q3, "javac", "MyWine.java");

    System.out.println("\\n== B: f3 not written yet ==");
    viet(q3, "MyWine.java", MYWINE.replace("    @Override\\n    public void f3(List&lt;Wine&gt; t) {\\n    }\\n", ""));
    lenh(q3, "javac", "MyWine.java");

    System.out.println("\\n== C: f1 returns int, IWine says String ==");
    viet(q3, "MyWine.java", MYWINE.replace("public String f1(List&lt;Wine&gt; t) {\\n        return t.isEmpty() ? \\"Not found\\" : t.get(0).getBrand();", "public int f1(List&lt;Wine&gt; t) {\\n        return t.size();"));
    lenh(q3, "javac", "MyWine.java");

    System.out.println("\\n== D: the parameter written as a raw List (as the web page once showed it) ==");
    viet(q3, "MyWine.java", MYWINE.replace("public String f1(List&lt;Wine&gt; t)", "public String f1(List t)"));
    lenh(q3, "javac", "MyWine.java");

    System.out.println("\\n== E: a raw ArrayList as the parent of a PE8-style WatchList ==");
    viet(q3, "WineList.java", "import java.util.*;\\npublic class WineList extends ArrayList {\\n    public int oldest() {\\n        return get(0).getYear();\\n    }\\n}\\n");
    lenh(q3, "javac", "WineList.java");
}</code></pre>
<div class="out">&gt; javac Wine.java IWine.java<br>
&gt; javac MyWine.java<br>
&gt; javap IWine<br>
Compiled from "IWine.java"<br>
public interface IWine {<br>
&nbsp;&nbsp;public abstract java.lang.String f1(java.util.List&lt;Wine&gt;);<br>
&nbsp;&nbsp;public abstract void f2(java.util.List&lt;Wine&gt;);<br>
&nbsp;&nbsp;public abstract void f3(java.util.List&lt;Wine&gt;);<br>
}<br>
<br>
== A: import java.util.*; forgotten in MyWine.java ==<br>
&gt; javac MyWine.java<br>
MyWine.java:3: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;public String f1(List&lt;Wine&gt; t) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;class List<br>
&nbsp;&nbsp;location: class MyWine<br>
MyWine.java:7: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;public void f2(List&lt;Wine&gt; t) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;class List<br>
&nbsp;&nbsp;location: class MyWine<br>
MyWine.java:10: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;public void f3(List&lt;Wine&gt; t) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;class List<br>
&nbsp;&nbsp;location: class MyWine<br>
3 errors<br>
(exit code 1)<br>
<br>
== B: f3 not written yet ==<br>
&gt; javac MyWine.java<br>
MyWine.java:2: error: MyWine is not abstract and does not override abstract method f3(List&lt;Wine&gt;) in IWine<br>
public class MyWine implements IWine {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
<br>
== C: f1 returns int, IWine says String ==<br>
&gt; javac MyWine.java<br>
MyWine.java:2: error: MyWine is not abstract and does not override abstract method f1(List&lt;Wine&gt;) in IWine<br>
public class MyWine implements IWine {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
MyWine.java:4: error: f1(List&lt;Wine&gt;) in MyWine cannot implement f1(List&lt;Wine&gt;) in IWine<br>
&nbsp;&nbsp;&nbsp;&nbsp;public int f1(List&lt;Wine&gt; t) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;return type int is not compatible with String<br>
MyWine.java:3: error: method does not override or implement a method from a supertype<br>
&nbsp;&nbsp;&nbsp;&nbsp;@Override<br>
&nbsp;&nbsp;&nbsp;&nbsp;^<br>
3 errors<br>
(exit code 1)<br>
<br>
== D: the parameter written as a raw List (as the web page once showed it) ==<br>
&gt; javac MyWine.java<br>
MyWine.java:5: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return t.isEmpty() ? "Not found" : t.get(0).getBrand();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method getBrand()<br>
&nbsp;&nbsp;location: class Object<br>
1 error<br>
(exit code 1)<br>
<br>
== E: a raw ArrayList as the parent of a PE8-style WatchList ==<br>
&gt; javac WineList.java<br>
WineList.java:4: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return get(0).getYear();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method getYear()<br>
&nbsp;&nbsp;location: class Object<br>
1 error<br>
(exit code 1)</div>
<table>
<thead><tr><th>#</th><th>Mistake</th><th>Real effect</th><th>Rule</th></tr></thead>
<tbody>
<tr><td>N1</td><td><code>list.remove(x)</code> inside a for-each</td><td><code>ConcurrentModificationException</code></td><td><code>Iterator.remove()</code>, <code>removeIf</code>, or a backward index loop</td></tr>
<tr><td>N2</td><td><code>remove(i)</code> in a forward index loop</td><td>AC1 skipped, still in the list</td><td>the next element slides into i: go backwards</td></tr>
<tr><td>N3</td><td><code>t = keep;</code> inside f3</td><td>Main's list unchanged</td><td>change the object: <code>clear()</code> + <code>addAll</code>, or remove from <code>t</code></td></tr>
<tr><td>N4</td><td>minimum recomputed after each removal</td><td>Nga removed as well</td><td>fix the minimum before removing</td></tr>
<tr><td>N5</td><td>a hand-written selection sort</td><td>Lan before Hoa (ties swapped)</td><td><code>Collections.sort</code>: stable</td></tr>
<tr><td>N6</td><td>an empty list where the paper says null</td><td>nothing printed instead of N/A</td><td>follow the paper's "otherwise return null"</td></tr>
<tr><td>N7</td><td><code>equals</code> where the paper says case-insensitive</td><td>1 Rolex instead of 3</td><td><code>equalsIgnoreCase</code></td></tr>
<tr><td>N8</td><td>stop at the first maximum</td><td>only A12 set to 0</td><td>two passes: find the maximum, then act on all</td></tr>
<tr><td>N9</td><td><code>&lt;=</code> for "the first shortest"</td><td>DU instead of PJ</td><td><code>&lt;</code> keeps the first</td></tr>
<tr><td>A</td><td><code>import java.util.*;</code> forgotten</td><td><code>cannot find symbol: class List</code></td><td>the import line of the given interface goes into your file too</td></tr>
<tr><td>B</td><td>f3 not written</td><td><code>MyWine is not abstract and does not override abstract method f3</code></td><td>write all three, even as an empty body, so the other two can score</td></tr>
<tr><td>C</td><td>f1 returns int, the interface says String</td><td><code>return type int is not compatible with String</code></td><td>copy the signatures from the interface</td></tr>
<tr><td>D</td><td><code>f1(List t)</code> — raw</td><td><code>getBrand()</code> not found on Object</td><td><code>List&lt;Wine&gt;</code>, as javap shows</td></tr>
<tr><td>E</td><td><code>extends ArrayList</code> — raw</td><td><code>getYear()</code> not found on Object</td><td><code>extends ArrayList&lt;Wine&gt;</code></td></tr>
</tbody>
</table>
<div class="pitfall">Mistake B deserves a second look: one missing function makes the <strong>whole class</strong> fail to compile, so f1 and f2 score nothing either. When time runs out, leave f3 with an empty body <code>{ }</code> — two working functions out of three are still marks.</div>`,
    `<h2>7. Mười bốn cách mất điểm câu 3 — cách nào cũng đo thật</h2>
<p>Chín lỗi logic trên danh sách, mỗi lỗi chạy cạnh bản đúng, dùng dữ liệu của đề thật khi có thể:</p>
<pre><code class="language-java">// release: 8
// Chín cách mất điểm câu 3 đề PE (f1/f2/f3 trên List, XxxList extends ArrayList), cái nào cũng chạy thật
import java.util.*;

class Thang {                                                // một Ladder của PE11: type, price
    String type; int price;
    Thang(String type, int price) { this.type = type; this.price = price; }
    @Override
    public String toString() { return "(" + type + "," + price + ")"; }
}

class Sach {                                                 // một Book của PE10: author, page
    String author; int page;
    Sach(String author, int page) { this.author = author; this.page = page; }
    @Override
    public String toString() { return "(" + author + ", " + page + ")"; }
}

public class LoiMatDiemQ3 {
    // PE11 câu 3, TC3: xoá mọi phần tử có nhiều chữ cái nhất (AB123 và AC1, đứng cạnh nhau)
    static List&lt;Thang&gt; pe11() {
        return new ArrayList&lt;Thang&gt;(Arrays.asList(new Thang("AB123", 10), new Thang("AC1", 11), new Thang("A1234", 12), new Thang("B1", 13)));
    }
    static int letters(String s) {
        int n = 0;
        for (char c : s.toCharArray()) if (Character.isLetter(c)) n++;
        return n;
    }

    public static void main(String[] args) {
        String mau3 = "[(A1234,12), (B1,13)]";

        // N1 — remove() bên trong for-each
        List&lt;Thang&gt; t = pe11();
        String sai1;
        try {
            for (Thang x : t) if (letters(x.type) == 2) t.remove(x);
            sai1 = t.toString();
        } catch (ConcurrentModificationException e) {
            sai1 = "CRASH " + e.getClass().getName();
        }
        t = pe11();
        for (Iterator&lt;Thang&gt; it = t.iterator(); it.hasNext(); ) if (letters(it.next().type) == 2) it.remove();
        xem("N1 for-each + remove", mau3, sai1, t.toString());

        // N2 — vòng chỉ số đi tới: sau remove(i) phần tử kế trượt vào i, rồi i++ nhảy qua nó
        t = pe11();
        for (int i = 0; i &lt; t.size(); i++) if (letters(t.get(i).type) == 2) t.remove(i);
        List&lt;Thang&gt; t2 = pe11();
        for (int i = t2.size() - 1; i &gt;= 0; i--) if (letters(t2.get(i).type) == 2) t2.remove(i);   // đi lùi thì an toàn
        xem("N2 forward index loop", mau3, t.toString(), t2.toString());

        // N3 — "sửa tại chỗ": dựng list mới rồi gán vào THAM SỐ thì Main không thấy gì thay đổi
        t = pe11();
        f3GanThamSo(t);
        String sai3 = t.toString();
        t = pe11();
        f3TaiCho(t);
        xem("N3 t = newList", mau3, sai3, t.toString());

        // N4 — PE10 f3 "page bằng page nhỏ nhất": tính lại min SAU mỗi lần xoá thì min bị dời
        List&lt;Sach&gt; s = new ArrayList&lt;Sach&gt;(Arrays.asList(new Sach("Nam", 50), new Sach("Nga", 60), new Sach("Tuan", 70)));
        for (Iterator&lt;Sach&gt; it = s.iterator(); it.hasNext(); ) {
            Sach b = it.next();
            if (b.author.startsWith("N") &amp;&amp; b.page == minPage(s)) it.remove();          // min của danh sách HIỆN TẠI
        }
        List&lt;Sach&gt; s2 = new ArrayList&lt;Sach&gt;(Arrays.asList(new Sach("Nam", 50), new Sach("Nga", 60), new Sach("Tuan", 70)));
        int min = minPage(s2);                                                          // chốt một lần, trước khi xoá
        for (Iterator&lt;Sach&gt; it = s2.iterator(); it.hasNext(); ) {
            Sach b = it.next();
            if (b.author.startsWith("N") &amp;&amp; b.page == min) it.remove();
        }
        xem("N4 moving minimum", "[(Nga, 60), (Tuan, 70)]", s.toString(), s2.toString());

        // N5 — selection sort tự viết KHÔNG ổn định: các page bằng nhau đổi chỗ cho nhau
        List&lt;Sach&gt; a = new ArrayList&lt;Sach&gt;(Arrays.asList(new Sach("Hoa", 50), new Sach("Lan", 50), new Sach("Mai", 10)));
        for (int i = 0; i &lt; a.size() - 1; i++) {
            int m = i;
            for (int j = i + 1; j &lt; a.size(); j++) if (a.get(j).page &lt; a.get(m).page) m = j;
            Collections.swap(a, i, m);
        }
        List&lt;Sach&gt; a2 = new ArrayList&lt;Sach&gt;(Arrays.asList(new Sach("Hoa", 50), new Sach("Lan", 50), new Sach("Mai", 10)));
        Collections.sort(a2, new Comparator&lt;Sach&gt;() {                                   // Collections.sort ổn định
            @Override
            public int compare(Sach x, Sach y) { return Integer.compare(x.page, y.page); }
        });
        xem("N5 unstable sort", "[(Mai, 10), (Hoa, 50), (Lan, 50)]", a.toString(), a2.toString());

        // N6 — PE8 filterByBrand(): "ngược lại trả null"; trả list RỖNG thì Main không in gì thay vì N/A
        List&lt;String&gt; rong = new ArrayList&lt;String&gt;();
        List&lt;String&gt; khong = null;
        xem("N6 empty list vs null", "N/A", inNhuMain(rong), inNhuMain(khong));

        // N7 — PE8 "so chuỗi không phân biệt hoa thường": các hãng Rolex, Rolex, rolex; người chấm gõ "rolex"
        String[] brands = {"Rolex", "Omega", "Seiko", "Rolex", "rolex"};
        int bang = 0, khongPhanBiet = 0;
        for (String b : brands) {
            if (b.equals("rolex")) bang++;
            if (b.equalsIgnoreCase("rolex")) khongPhanBiet++;
        }
        xem("N7 equals in a filter", "3", String.valueOf(bang), String.valueOf(khongPhanBiet));

        // N8 — PE11 f2 "MỌI cái thang có type dài nhất": dừng ở cái đầu tiên
        List&lt;Thang&gt; f2 = new ArrayList&lt;Thang&gt;(Arrays.asList(new Thang("A1", 6), new Thang("B1", 9), new Thang("A12", 2), new Thang("B12", 5)));
        Thang dai = f2.get(0);
        for (Thang x : f2) if (x.type.length() &gt; dai.type.length()) dai = x;
        dai.price = 0;                                                                  // chỉ MỘT phần tử bị đổi
        String sai8 = f2.toString();
        f2 = new ArrayList&lt;Thang&gt;(Arrays.asList(new Thang("A1", 6), new Thang("B1", 9), new Thang("A12", 2), new Thang("B12", 5)));
        int max = 0;
        for (Thang x : f2) max = Math.max(max, x.type.length());
        for (Thang x : f2) if (x.type.length() == max) x.price = 0;
        xem("N8 only the first maximum", "[(A1,6), (B1,9), (A12,0), (B12,0)]", sai8, f2.toString());

        // N9 — PE6 f1 "brand ngắn nhất ĐẦU TIÊN": "&lt;=" cứ thay khi hoà và trả về cái CUỐI
        String[] cand = {"PJ", "DU", "ITA"};                                            // các chai còn lại sau điều kiện "year không chia hết cho 3"
        String le = cand[0], lt = cand[0];
        for (String c : cand) {
            if (c.length() &lt;= le.length()) le = c;
            if (c.length() &lt; lt.length()) lt = c;
        }
        xem("N9 &lt;= on a tie", "PJ", le, lt);
    }

    static void f3GanThamSo(List&lt;Thang&gt; t) {
        List&lt;Thang&gt; keep = new ArrayList&lt;Thang&gt;();
        for (Thang x : t) if (letters(x.type) != 2) keep.add(x);
        t = keep;                                            // giờ chỉ biến cục bộ trỏ tới keep
    }

    static void f3TaiCho(List&lt;Thang&gt; t) {
        List&lt;Thang&gt; keep = new ArrayList&lt;Thang&gt;();
        for (Thang x : t) if (letters(x.type) != 2) keep.add(x);
        t.clear();                                           // đổi chính đối tượng Main đang giữ
        t.addAll(keep);
    }

    static int minPage(List&lt;Sach&gt; s) {
        int m = Integer.MAX_VALUE;
        for (Sach b : s) m = Math.min(m, b.page);
        return m;
    }

    // việc Main của PE8 làm với kết quả filterByBrand
    static String inNhuMain(List&lt;String&gt; found) {
        if (found != null) {
            StringBuilder b = new StringBuilder();
            for (String x : found) b.append(x).append("\\n");
            return b.toString().trim();                      // list rỗng thì không có gì
        }
        return "N/A";
    }

    static void xem(String bay, String mau, String sai, String dung) {
        System.out.println(bay);
        System.out.println("   expected : " + mau);
        System.out.println("   wrong    : " + (sai.isEmpty() ? "(nothing printed)" : sai) + (sai.equals(mau) ? "   PASS" : "   FAIL"));
        System.out.println("   right    : " + dung + (dung.equals(mau) ? "   PASS" : "   FAIL"));
    }
}</code></pre>
<div class="out">N1 for-each + remove<br>
&nbsp;&nbsp;&nbsp;expected : [(A1234,12), (B1,13)]<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: CRASH java.util.ConcurrentModificationException &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: [(A1234,12), (B1,13)] &nbsp;&nbsp;PASS<br>
N2 forward index loop<br>
&nbsp;&nbsp;&nbsp;expected : [(A1234,12), (B1,13)]<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [(AC1,11), (A1234,12), (B1,13)] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: [(A1234,12), (B1,13)] &nbsp;&nbsp;PASS<br>
N3 t = newList<br>
&nbsp;&nbsp;&nbsp;expected : [(A1234,12), (B1,13)]<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [(AB123,10), (AC1,11), (A1234,12), (B1,13)] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: [(A1234,12), (B1,13)] &nbsp;&nbsp;PASS<br>
N4 moving minimum<br>
&nbsp;&nbsp;&nbsp;expected : [(Nga, 60), (Tuan, 70)]<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [(Tuan, 70)] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: [(Nga, 60), (Tuan, 70)] &nbsp;&nbsp;PASS<br>
N5 unstable sort<br>
&nbsp;&nbsp;&nbsp;expected : [(Mai, 10), (Hoa, 50), (Lan, 50)]<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [(Mai, 10), (Lan, 50), (Hoa, 50)] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: [(Mai, 10), (Hoa, 50), (Lan, 50)] &nbsp;&nbsp;PASS<br>
N6 empty list vs null<br>
&nbsp;&nbsp;&nbsp;expected : N/A<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: (nothing printed) &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: N/A &nbsp;&nbsp;PASS<br>
N7 equals in a filter<br>
&nbsp;&nbsp;&nbsp;expected : 3<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 1 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 3 &nbsp;&nbsp;PASS<br>
N8 only the first maximum<br>
&nbsp;&nbsp;&nbsp;expected : [(A1,6), (B1,9), (A12,0), (B12,0)]<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [(A1,6), (B1,9), (A12,0), (B12,5)] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: [(A1,6), (B1,9), (A12,0), (B12,0)] &nbsp;&nbsp;PASS<br>
N9 &lt;= on a tie<br>
&nbsp;&nbsp;&nbsp;expected : PJ<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: DU &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: PJ &nbsp;&nbsp;PASS</div>
<p>Năm lỗi biên dịch, trên JDK 8 thật, trong một thư mục — giống project given — chỉ có <code>IWine.class</code>, không có <code>IWine.java</code>:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File q3 = new File("Q3");
    viet(q3, "Wine.java", WINE);
    viet(q3, "IWine.java", IWINE);
    lenh(q3, "javac", "Wine.java", "IWine.java");
    new File(q3, "IWine.java").delete();                         // đề CHỈ phát IWine.class
    viet(q3, "MyWine.java", MYWINE);
    lenh(q3, "javac", "MyWine.java");                            // javac tìm thấy IWine.class và Wine trong cùng thư mục
    lenh(q3, "javap", "IWine");                                   // interface đề cho thật sự khai báo gì

    System.out.println("\\n== A: import java.util.*; forgotten in MyWine.java ==");
    viet(q3, "MyWine.java", MYWINE.replace("import java.util.*;\\n", ""));
    lenh(q3, "javac", "MyWine.java");

    System.out.println("\\n== B: f3 not written yet ==");
    viet(q3, "MyWine.java", MYWINE.replace("    @Override\\n    public void f3(List&lt;Wine&gt; t) {\\n    }\\n", ""));
    lenh(q3, "javac", "MyWine.java");

    System.out.println("\\n== C: f1 returns int, IWine says String ==");
    viet(q3, "MyWine.java", MYWINE.replace("public String f1(List&lt;Wine&gt; t) {\\n        return t.isEmpty() ? \\"Not found\\" : t.get(0).getBrand();", "public int f1(List&lt;Wine&gt; t) {\\n        return t.size();"));
    lenh(q3, "javac", "MyWine.java");

    System.out.println("\\n== D: the parameter written as a raw List (as the web page once showed it) ==");
    viet(q3, "MyWine.java", MYWINE.replace("public String f1(List&lt;Wine&gt; t)", "public String f1(List t)"));
    lenh(q3, "javac", "MyWine.java");

    System.out.println("\\n== E: a raw ArrayList as the parent of a PE8-style WatchList ==");
    viet(q3, "WineList.java", "import java.util.*;\\npublic class WineList extends ArrayList {\\n    public int oldest() {\\n        return get(0).getYear();\\n    }\\n}\\n");
    lenh(q3, "javac", "WineList.java");
}</code></pre>
<div class="out">&gt; javac Wine.java IWine.java<br>
&gt; javac MyWine.java<br>
&gt; javap IWine<br>
Compiled from "IWine.java"<br>
public interface IWine {<br>
&nbsp;&nbsp;public abstract java.lang.String f1(java.util.List&lt;Wine&gt;);<br>
&nbsp;&nbsp;public abstract void f2(java.util.List&lt;Wine&gt;);<br>
&nbsp;&nbsp;public abstract void f3(java.util.List&lt;Wine&gt;);<br>
}<br>
<br>
== A: import java.util.*; forgotten in MyWine.java ==<br>
&gt; javac MyWine.java<br>
MyWine.java:3: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;public String f1(List&lt;Wine&gt; t) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;class List<br>
&nbsp;&nbsp;location: class MyWine<br>
MyWine.java:7: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;public void f2(List&lt;Wine&gt; t) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;class List<br>
&nbsp;&nbsp;location: class MyWine<br>
MyWine.java:10: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;public void f3(List&lt;Wine&gt; t) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;class List<br>
&nbsp;&nbsp;location: class MyWine<br>
3 errors<br>
(exit code 1)<br>
<br>
== B: f3 not written yet ==<br>
&gt; javac MyWine.java<br>
MyWine.java:2: error: MyWine is not abstract and does not override abstract method f3(List&lt;Wine&gt;) in IWine<br>
public class MyWine implements IWine {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
<br>
== C: f1 returns int, IWine says String ==<br>
&gt; javac MyWine.java<br>
MyWine.java:2: error: MyWine is not abstract and does not override abstract method f1(List&lt;Wine&gt;) in IWine<br>
public class MyWine implements IWine {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
MyWine.java:4: error: f1(List&lt;Wine&gt;) in MyWine cannot implement f1(List&lt;Wine&gt;) in IWine<br>
&nbsp;&nbsp;&nbsp;&nbsp;public int f1(List&lt;Wine&gt; t) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;return type int is not compatible with String<br>
MyWine.java:3: error: method does not override or implement a method from a supertype<br>
&nbsp;&nbsp;&nbsp;&nbsp;@Override<br>
&nbsp;&nbsp;&nbsp;&nbsp;^<br>
3 errors<br>
(exit code 1)<br>
<br>
== D: the parameter written as a raw List (as the web page once showed it) ==<br>
&gt; javac MyWine.java<br>
MyWine.java:5: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return t.isEmpty() ? "Not found" : t.get(0).getBrand();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method getBrand()<br>
&nbsp;&nbsp;location: class Object<br>
1 error<br>
(exit code 1)<br>
<br>
== E: a raw ArrayList as the parent of a PE8-style WatchList ==<br>
&gt; javac WineList.java<br>
WineList.java:4: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return get(0).getYear();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method getYear()<br>
&nbsp;&nbsp;location: class Object<br>
1 error<br>
(exit code 1)</div>
<table>
<thead><tr><th>#</th><th>Lỗi</th><th>Hậu quả thật</th><th>Luật</th></tr></thead>
<tbody>
<tr><td>N1</td><td><code>list.remove(x)</code> trong for-each</td><td><code>ConcurrentModificationException</code></td><td><code>Iterator.remove()</code>, <code>removeIf</code>, hoặc vòng chỉ số đi lùi</td></tr>
<tr><td>N2</td><td><code>remove(i)</code> trong vòng chỉ số đi tới</td><td>AC1 bị bỏ sót, vẫn còn trong danh sách</td><td>phần tử kế trượt vào i: hãy đi lùi</td></tr>
<tr><td>N3</td><td><code>t = keep;</code> trong f3</td><td>danh sách của Main không đổi</td><td>đổi chính đối tượng: <code>clear()</code> + <code>addAll</code>, hoặc xoá trên <code>t</code></td></tr>
<tr><td>N4</td><td>tính lại min sau mỗi lần xoá</td><td>Nga cũng bị xoá</td><td>chốt min trước khi xoá</td></tr>
<tr><td>N5</td><td>selection sort tự viết</td><td>Lan đứng trước Hoa (hoà bị đảo)</td><td><code>Collections.sort</code>: ổn định</td></tr>
<tr><td>N6</td><td>trả list rỗng trong khi đề nói null</td><td>không in gì thay vì N/A</td><td>theo đúng "ngược lại trả null" của đề</td></tr>
<tr><td>N7</td><td><code>equals</code> trong khi đề nói không phân biệt hoa thường</td><td>1 Rolex thay vì 3</td><td><code>equalsIgnoreCase</code></td></tr>
<tr><td>N8</td><td>dừng ở phần tử max đầu tiên</td><td>chỉ A12 về 0</td><td>hai lượt: tìm max, rồi xử lý tất cả</td></tr>
<tr><td>N9</td><td><code>&lt;=</code> cho "ngắn nhất đầu tiên"</td><td>DU thay vì PJ</td><td><code>&lt;</code> giữ phần tử đầu</td></tr>
<tr><td>A</td><td>quên <code>import java.util.*;</code></td><td><code>cannot find symbol: class List</code></td><td>dòng import của interface đề cho cũng phải có trong file của bạn</td></tr>
<tr><td>B</td><td>chưa viết f3</td><td><code>MyWine is not abstract and does not override abstract method f3</code></td><td>viết đủ cả ba, dù thân rỗng, để hai hàm kia còn được điểm</td></tr>
<tr><td>C</td><td>f1 trả int, interface ghi String</td><td><code>return type int is not compatible with String</code></td><td>chép chữ ký từ interface</td></tr>
<tr><td>D</td><td><code>f1(List t)</code> — kiểu thô</td><td>không tìm thấy <code>getBrand()</code> trên Object</td><td><code>List&lt;Wine&gt;</code>, như javap cho thấy</td></tr>
<tr><td>E</td><td><code>extends ArrayList</code> — kiểu thô</td><td>không tìm thấy <code>getYear()</code> trên Object</td><td><code>extends ArrayList&lt;Wine&gt;</code></td></tr>
</tbody>
</table>
<div class="pitfall">Lỗi B đáng nhìn lại lần nữa: thiếu một hàm là <strong>cả lớp</strong> không biên dịch được, nên f1 và f2 cũng mất điểm. Khi hết giờ, để f3 thân rỗng <code>{ }</code> — hai hàm chạy đúng trong ba vẫn là điểm.</div>`),
    bi(`<h2>8. 25 minutes for question 3 — plan and checklist</h2>
<table>
<thead><tr><th>Minutes</th><th>Do</th></tr></thead>
<tbody>
<tr><td>0–4</td><td>read f1, f2, f3; for each: what is measured (length? letters? a digit?), which elements, and what happens when none qualifies; compute every sample by hand</td></tr>
<tr><td>4–8</td><td>the entity class (Alt+Insert), and <code>MyXxx implements IXxx</code> with three EMPTY methods — compile now</td></tr>
<tr><td>8–20</td><td>f1, f2, f3 one by one, running the matching sample after each</td></tr>
<tr><td>20–25</td><td>your own edge test (add one element that changes the maximum or minimum); Clean and Build; copy run + src</td></tr>
</tbody>
</table>
<ol>
<li>No <code>IXxx.java</code> created; <code>import java.util.*;</code> present; the class compiles with all three methods.</li>
<li>Parameter types <code>List&lt;Xxx&gt;</code> and return types copied from the interface.</li>
<li>Extremes (max, min, smallest odd …) computed in a first pass, before any change.</li>
<li>Removal through <code>Iterator.remove()</code> / <code>removeIf</code> / a backward loop; the parameter itself never reassigned.</li>
<li>Sorting with <code>Collections.sort</code> or <code>list.sort</code> and a comparator on the right field and direction.</li>
<li>Ties: "first" kept with <code>&lt;</code>; "all" handled with <code>==</code> on the extreme.</li>
<li>The empty case answered as the paper says (do nothing / "Not found" / null / 0).</li>
<li>Extra methods Main needs (<code>display</code> in PE10/PE14) written with the exact format.</li>
<li>For <code>XxxList</code>: <code>extends ArrayList&lt;Xxx&gt;</code>, <code>this</code> as the list, null vs empty as written.</li>
</ol>`,
    `<h2>8. 25 phút cho câu 3 — kế hoạch và danh sách kiểm</h2>
<table>
<thead><tr><th>Phút</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td>0–4</td><td>đọc f1, f2, f3; với mỗi hàm: đo cái gì (độ dài? chữ cái? một chữ số?), phần tử nào, và khi không phần tử nào thoả thì sao; tính tay mọi mẫu</td></tr>
<tr><td>4–8</td><td>lớp thực thể (Alt+Insert), và <code>MyXxx implements IXxx</code> với ba phương thức RỖNG — biên dịch ngay</td></tr>
<tr><td>8–20</td><td>f1, f2, f3 lần lượt, chạy mẫu tương ứng sau mỗi hàm</td></tr>
<tr><td>20–25</td><td>ca kiểm tự thêm (thêm một phần tử làm đổi max hay min); Clean and Build; chép run + src</td></tr>
</tbody>
</table>
<ol>
<li>Không tạo <code>IXxx.java</code>; có <code>import java.util.*;</code>; lớp biên dịch được với đủ ba phương thức.</li>
<li>Kiểu tham số <code>List&lt;Xxx&gt;</code> và kiểu trả về chép từ interface.</li>
<li>Các giá trị cực trị (max, min, số lẻ nhỏ nhất …) tính ở lượt đầu, trước mọi thay đổi.</li>
<li>Xoá qua <code>Iterator.remove()</code> / <code>removeIf</code> / vòng đi lùi; không bao giờ gán lại chính tham số.</li>
<li>Sắp xếp bằng <code>Collections.sort</code> hoặc <code>list.sort</code> với comparator đúng trường, đúng chiều.</li>
<li>Hoà: "đầu tiên" giữ bằng <code>&lt;</code>; "tất cả" xử lý bằng <code>==</code> với cực trị.</li>
<li>Ca rỗng trả lời đúng như đề nói (không làm gì / "Not found" / null / 0).</li>
<li>Các phương thức phụ Main cần (<code>display</code> ở PE10/PE14) viết đúng định dạng.</li>
<li>Với <code>XxxList</code>: <code>extends ArrayList&lt;Xxx&gt;</code>, dùng <code>this</code> làm danh sách, null hay rỗng đúng như đề viết.</li>
</ol>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>interface given as byte code</strong></td><td>interface cho sẵn dạng byte code</td><td>Only <code>IXxx.class</code> is in the project; you implement it and must not create <code>IXxx.java</code>.</td></tr>
<tr><td><strong><code>implements</code></strong></td><td>hiện thực</td><td>A class promises to provide every method of an interface; one missing method and the class does not compile.</td></tr>
<tr><td><strong>generic type <code>List&lt;Wine&gt;</code></strong></td><td>kiểu tổng quát</td><td>A list whose elements the compiler knows are <code>Wine</code>, so <code>get(i).getBrand()</code> compiles without a cast.</td></tr>
<tr><td><strong>raw type</strong></td><td>kiểu thô</td><td><code>List</code> or <code>ArrayList</code> without <code>&lt;...&gt;</code>: elements are seen as <code>Object</code> and their methods are not found.</td></tr>
<tr><td><strong>in place</strong></td><td>tại chỗ</td><td>Changing the very list object you received, so the caller sees the change.</td></tr>
<tr><td><strong><code>Iterator.remove()</code></strong></td><td>xoá qua bộ duyệt</td><td>Removes the element just returned by <code>next()</code> without breaking the iteration.</td></tr>
<tr><td><strong><code>ConcurrentModificationException</code></strong></td><td>lỗi sửa đổi đồng thời</td><td>Thrown by a for-each loop when the list is changed by anything but its own iterator.</td></tr>
<tr><td><strong>two-pass algorithm</strong></td><td>thuật toán hai lượt</td><td>First measure (max, min), then act on the elements equal to it.</td></tr>
<tr><td><strong>stable sort</strong></td><td>sắp xếp ổn định</td><td>Equal elements keep their original order; <code>Collections.sort</code> and <code>List.sort</code> are stable.</td></tr>
<tr><td><strong><code>Comparator</code></strong></td><td>bộ so sánh</td><td>An object (or a Java 8 lambda) that says which of two elements comes first: negative, 0, positive.</td></tr>
<tr><td><strong><code>extends ArrayList&lt;Xxx&gt;</code></strong></td><td>kế thừa ArrayList</td><td>The class IS a list: it inherits <code>add</code>, <code>get</code>, <code>size</code> and can loop over <code>this</code>.</td></tr>
<tr><td><strong><code>null</code> vs empty list</strong></td><td>null và danh sách rỗng</td><td>"Nothing" as no object at all vs a list with zero elements; Main tests one of them, the paper says which.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>interface given as byte code</strong></td><td>interface cho sẵn dạng byte code</td><td>Project chỉ có <code>IXxx.class</code>; bạn hiện thực nó và không được tạo <code>IXxx.java</code>.</td></tr>
<tr><td><strong><code>implements</code></strong></td><td>hiện thực</td><td>Một lớp hứa cung cấp mọi phương thức của interface; thiếu một phương thức là lớp không biên dịch được.</td></tr>
<tr><td><strong>generic type <code>List&lt;Wine&gt;</code></strong></td><td>kiểu tổng quát</td><td>Danh sách mà trình biên dịch biết phần tử là <code>Wine</code>, nên <code>get(i).getBrand()</code> biên dịch được không cần ép kiểu.</td></tr>
<tr><td><strong>raw type</strong></td><td>kiểu thô</td><td><code>List</code> hay <code>ArrayList</code> không có <code>&lt;...&gt;</code>: phần tử bị coi là <code>Object</code> và không tìm thấy phương thức của chúng.</td></tr>
<tr><td><strong>in place</strong></td><td>tại chỗ</td><td>Sửa chính đối tượng danh sách bạn nhận được, để nơi gọi thấy được thay đổi.</td></tr>
<tr><td><strong><code>Iterator.remove()</code></strong></td><td>xoá qua bộ duyệt</td><td>Xoá phần tử vừa được <code>next()</code> trả về mà không làm hỏng vòng duyệt.</td></tr>
<tr><td><strong><code>ConcurrentModificationException</code></strong></td><td>lỗi sửa đổi đồng thời</td><td>Vòng for-each ném lỗi này khi danh sách bị sửa bởi thứ khác ngoài iterator của chính nó.</td></tr>
<tr><td><strong>two-pass algorithm</strong></td><td>thuật toán hai lượt</td><td>Lượt một đo (max, min), lượt hai xử lý các phần tử bằng giá trị đó.</td></tr>
<tr><td><strong>stable sort</strong></td><td>sắp xếp ổn định</td><td>Các phần tử bằng nhau giữ thứ tự ban đầu; <code>Collections.sort</code> và <code>List.sort</code> ổn định.</td></tr>
<tr><td><strong><code>Comparator</code></strong></td><td>bộ so sánh</td><td>Một đối tượng (hoặc lambda Java 8) cho biết phần tử nào đứng trước: âm, 0, dương.</td></tr>
<tr><td><strong><code>extends ArrayList&lt;Xxx&gt;</code></strong></td><td>kế thừa ArrayList</td><td>Lớp LÀ một danh sách: nó kế thừa <code>add</code>, <code>get</code>, <code>size</code> và có thể duyệt <code>this</code>.</td></tr>
<tr><td><strong><code>null</code> vs empty list</strong></td><td>null và danh sách rỗng</td><td>"Không có gì" là không có đối tượng nào, khác với danh sách 0 phần tử; Main kiểm một trong hai, đề nói là cái nào.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 7 things for question 3</h2>
<ol>
<li><strong>Two costumes, one skill:</strong> <code>MyXxx implements IXxx</code> with f1/f2/f3 (seven papers) or <code>XxxList extends ArrayList&lt;Xxx&gt;</code> (four papers).</li>
<li><strong>The interface is given as .class:</strong> do not create it; copy its signatures, <code>List&lt;Xxx&gt;</code> included; add <code>import java.util.*;</code>.</li>
<li><strong>Scan → decide → act:</strong> fix the max/min/smallest odd value first, then change or remove.</li>
<li><strong>Remove in place through the iterator</strong> (or <code>removeIf</code>, or backwards); never reassign the parameter.</li>
<li><strong>"First" means <code>&lt;</code>, "all" means a second pass with <code>==</code>.</strong></li>
<li><strong>Sort with <code>Collections.sort</code> + a comparator</strong> — stable, so ties keep their order.</li>
<li><strong>Answer the empty case exactly as written,</strong> and write all three functions so a missing one cannot sink the other two.</li>
</ol>
<div class="callout">🧭 <strong>Go further — CSD201 and Spring Boot</strong>: "two passes", "remove while iterating", "stable sort" come back in CSD201 (Data Structures) with their costs in O(n); in LabFlow the same filters become Stream pipelines and repository queries (<code>findByBrandIgnoreCase</code>). Next: <strong>🎯 PE drill 4</strong>, String tools and the 10-mark paper.</div>`,
    `<h2>📌 Tóm tắt — 7 điều cho câu 3</h2>
<ol>
<li><strong>Hai bộ áo, một kỹ năng:</strong> <code>MyXxx implements IXxx</code> với f1/f2/f3 (bảy đề) hoặc <code>XxxList extends ArrayList&lt;Xxx&gt;</code> (bốn đề).</li>
<li><strong>Interface cho dạng .class:</strong> đừng tạo lại; chép chữ ký của nó, kể cả <code>List&lt;Xxx&gt;</code>; thêm <code>import java.util.*;</code>.</li>
<li><strong>Quét → quyết định → hành động:</strong> chốt max/min/số lẻ nhỏ nhất trước, rồi mới sửa hay xoá.</li>
<li><strong>Xoá tại chỗ qua iterator</strong> (hoặc <code>removeIf</code>, hoặc đi lùi); không bao giờ gán lại tham số.</li>
<li><strong>"Đầu tiên" nghĩa là <code>&lt;</code>, "tất cả" nghĩa là lượt thứ hai với <code>==</code>.</strong></li>
<li><strong>Sắp xếp bằng <code>Collections.sort</code> + comparator</strong> — ổn định, nên các phần tử hoà giữ thứ tự.</li>
<li><strong>Trả lời ca rỗng đúng như đề viết,</strong> và viết đủ ba hàm để một hàm thiếu không kéo chìm hai hàm kia.</li>
</ol>
<div class="callout">🧭 <strong>Đi tiếp — CSD201 và Spring Boot</strong>: "hai lượt", "xoá trong khi duyệt", "sắp xếp ổn định" quay lại ở CSD201 (Cấu trúc dữ liệu) kèm chi phí O(n); trong LabFlow cũng các bộ lọc đó trở thành Stream và câu truy vấn repository (<code>findByBrandIgnoreCase</code>). Tiếp theo: <strong>🎯 Luyện PE 4</strong>, xử lý chuỗi và đề 10 điểm.</div>`),
  ].join('\n'),
};

/* ───────── 🎯 PE drill 4 — type 4: String tools (IString f1/f2) and the 10-mark paper that reads and writes files ───────── */
const L_x_luyen_pe_4 = {
  title: '🎯 PE drill 4 — type 4: String tools (IString f1/f2) and the 10-mark paper that reads and writes files|||🎯 Luyện PE PRO192 4 — dạng 4: xử lý chuỗi (IString f1/f2) và đề 10 điểm đọc–ghi file',
  slug: 'pro192-luyen-pe-4',
  type: 'VIDEO',
  description: 'Bài luyện thi thực hành tự thêm (4/4): câu 4 đề PE — hiện thực interface xử lý chuỗi cho sẵn dạng byte code (bảng mọi f1/f2 của 11 đề, hộp đồ nghề String, mẹo đọc đề, khung code, giải PE4 MyString và PE10 MyFile chạy thật trên JDK 8), rồi đề một câu 10 điểm đọc input.txt ghi output.txt (PE3, PE5, PE9: khung Q1 phần FIXED và @STUDENT, máy chấm truyền hai tên file, file vào xuống dòng Windows và dính dấu cách — đo từng byte; giải trọn PE5 với năm file mẫu), mười bốn lỗi mất điểm đo thật (split và replaceAll là regex, cộng mã ký tự, chuỗi bất biến, == trên chuỗi, dấu cách cuối lệnh, nextInt rồi nextLine, quên package, ghi ra console thay vì file, import JavaFX lạc), kế hoạch thời gian và danh sách kiểm.',
  content: [
    bi(`<span class="eyebrow">Final Exam · 🎯 PE drill 4 of 4 · added by this site</span>
<h2>Type 4 — String tools, and the paper that is one big String-driven program</h2>
<p class="lead">Question 4 of the classic papers gives an interface such as <code>IString</code> with two methods that take a <code>String</code> and return a number or a new string: count words with an odd digit, replace the first palindrome, cut the extension off a Windows path. No fields, no objects to manage — pure String handling, and pure attention to detail. The 10-mark one-question papers (PE3, PE5, PE9) belong here too: their real difficulty is turning lines of text like <code>add,SP001,iPhone 15 Pro,256,true</code> into objects and commands. This lesson solves PE4 and PE10 question 4, then the whole of PE5.</p>`,
    `<span class="eyebrow">Thi cuối kỳ · 🎯 Luyện PE 4/4 · phần web tự thêm</span>
<h2>Dạng 4 — xử lý chuỗi, và đề là một chương trình lớn chạy bằng chuỗi</h2>
<p class="lead">Câu 4 của đề kinh điển cho một interface như <code>IString</code> có hai phương thức nhận một <code>String</code> và trả về một con số hoặc một chuỗi mới: đếm từ có chữ số lẻ, thay từ đối xứng đầu tiên, cắt phần mở rộng khỏi một đường dẫn Windows. Không trường, không đối tượng nào phải quản lý — chỉ xử lý String, và chỉ cần tỉ mỉ. Các đề một câu 10 điểm (PE3, PE5, PE9) cũng thuộc về đây: cái khó thật của chúng là biến các dòng chữ như <code>add,SP001,iPhone 15 Pro,256,true</code> thành đối tượng và lệnh. Bài này giải câu 4 của PE4 và PE10, rồi trọn đề PE5.</p>`),
    bi(`<h2>1. Every question 4 of the real papers</h2>
<table>
<thead><tr><th>Paper</th><th>f1</th><th>f2</th></tr></thead>
<tbody>
<tr><td>PE1 IStringNumberTool</td><td><code>buildAcronym</code>: first letter of each word that starts with a letter, upper case ("123 data structure" → DS)</td><td><code>decimalToBinary(n)</code> without <code>Integer.toBinaryString</code>; 0 → "0"</td></tr>
<tr><td>PE2 IStringProcessor</td><td>number of LOWER-case vowels</td><td>the longest word, the first one on a tie</td></tr>
<tr><td>PE4 IString</td><td>number of words containing at least one odd digit</td><td>replace the FIRST palindrome word with "XX"</td></tr>
<tr><td>PE6 IString</td><td>ASCII code of the most frequent lower-case letter, ties alphabetically, none → −1</td><td>reverse every run of consecutive upper-case letters</td></tr>
<tr><td>PE7 (you write IStringUtilities)</td><td><code>getFirstWord</code> in upper case</td><td><code>countWords(str, value)</code>: words of length value; none → the length of str</td></tr>
<tr><td>PE8 IUtilities</td><td>length of the longest word</td><td>average of the even digits (2 decimals by Main)</td></tr>
<tr><td>PE10 IFile</td><td>the extension of a file path, else "wrong format"</td><td>"New_" + base name in upper case + extension, else "wrong format"</td></tr>
<tr><td>PE11, PE12 IString</td><td>words with exactly two different digits AND a lower-case letter</td><td>words whose letters ≠ non-letters, joined by one space</td></tr>
<tr><td>PE13 IString</td><td>the same with an UPPER-case letter</td><td>words whose letters = non-letters</td></tr>
<tr><td>PE14 ILink</td><td>replace every "." with ":"</td><td>upper-case everything after the first "."</td></tr>
</tbody>
</table>
<p>The given Mains (read with <code>javap -c</code>) are short: PE4 asks for the test case FIRST, then prints <code>Enter a string:</code> with <code>println</code> and reads one whole line; PE10 asks for the path first. Both print the result directly after <code>OUTPUT:</code>. Exam Room rubric for PE4: f1 1.5, f2 1.5 — no marks for anything else, so <strong>every edge of the two rules matters</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/86655e6ece824dbe5834908a8ff3fb64f5805d07.svg" alt="Question 4: a given interface, your class, no fields" loading="lazy" /><p class="chu-thich">🧩 Question 4: a given interface, your class, no fields</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Question 4 — a given interface, your class, no fields
interface IString &lt;&lt;given .class&gt;&gt; {
  + f1(str : String) : int
  + f2(str : String) : String
}
class MyString {
  + f1(str : String) : int
  + f2(str : String) : String
}
interface IFile &lt;&lt;given .class&gt;&gt; {
  + f1(str : String) : String
  + f2(str : String) : String
}
class MyFile {
  + f1(str : String) : String
  + f2(str : String) : String
  - fileName(path : String) : String
  - dotOf(name : String) : int
}
IString &lt;|.. MyString : PE4
IFile &lt;|.. MyFile : PE10
note bottom of MyString
  no fields, no constructor needed:
  a String goes in, an answer comes out
end note
@enduml</code></pre></details>`,
    `<h2>1. Mọi câu 4 của các đề thật</h2>
<table>
<thead><tr><th>Đề</th><th>f1</th><th>f2</th></tr></thead>
<tbody>
<tr><td>PE1 IStringNumberTool</td><td><code>buildAcronym</code>: chữ cái đầu của mỗi từ bắt đầu bằng chữ cái, viết hoa ("123 data structure" → DS)</td><td><code>decimalToBinary(n)</code> không dùng <code>Integer.toBinaryString</code>; 0 → "0"</td></tr>
<tr><td>PE2 IStringProcessor</td><td>số nguyên âm viết THƯỜNG</td><td>từ dài nhất, hoà thì lấy từ đầu</td></tr>
<tr><td>PE4 IString</td><td>số từ chứa ít nhất một chữ số lẻ</td><td>thay từ đối xứng ĐẦU TIÊN bằng "XX"</td></tr>
<tr><td>PE6 IString</td><td>mã ASCII của chữ thường xuất hiện nhiều nhất, hoà thì theo bảng chữ cái, không có → −1</td><td>đảo ngược từng cụm chữ hoa liền nhau</td></tr>
<tr><td>PE7 (tự viết IStringUtilities)</td><td><code>getFirstWord</code> viết hoa</td><td><code>countWords(str, value)</code>: số từ dài đúng value; không có → độ dài của str</td></tr>
<tr><td>PE8 IUtilities</td><td>độ dài của từ dài nhất</td><td>trung bình các chữ số chẵn (Main định dạng 2 chữ số)</td></tr>
<tr><td>PE10 IFile</td><td>phần mở rộng của đường dẫn file, không có thì "wrong format"</td><td>"New_" + tên gốc viết hoa + phần mở rộng, không có thì "wrong format"</td></tr>
<tr><td>PE11, PE12 IString</td><td>số từ có đúng hai chữ số khác nhau VÀ một chữ thường</td><td>các từ có số chữ cái ≠ số ký tự khác, nối bằng một dấu cách</td></tr>
<tr><td>PE13 IString</td><td>như trên nhưng với một chữ HOA</td><td>các từ có số chữ cái = số ký tự khác</td></tr>
<tr><td>PE14 ILink</td><td>thay mọi "." bằng ":"</td><td>viết hoa mọi thứ sau dấu "." đầu tiên</td></tr>
</tbody>
</table>
<p>Các Main đề cho (đọc bằng <code>javap -c</code>) rất ngắn: PE4 hỏi test case TRƯỚC, rồi in <code>Enter a string:</code> bằng <code>println</code> và đọc nguyên một dòng; PE10 hỏi đường dẫn trước. Cả hai in kết quả ngay sau <code>OUTPUT:</code>. Rubric của Exam Room cho PE4: f1 1,5, f2 1,5 — không có điểm cho gì khác, nên <strong>mọi góc cạnh của hai luật đều quan trọng</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/86655e6ece824dbe5834908a8ff3fb64f5805d07.svg" alt="Câu 4: một interface đề cho, lớp của bạn, không có trường" loading="lazy" /><p class="chu-thich">🧩 Câu 4: một interface đề cho, lớp của bạn, không có trường</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Question 4 — a given interface, your class, no fields
interface IString &lt;&lt;given .class&gt;&gt; {
  + f1(str : String) : int
  + f2(str : String) : String
}
class MyString {
  + f1(str : String) : int
  + f2(str : String) : String
}
interface IFile &lt;&lt;given .class&gt;&gt; {
  + f1(str : String) : String
  + f2(str : String) : String
}
class MyFile {
  + f1(str : String) : String
  + f2(str : String) : String
  - fileName(path : String) : String
  - dotOf(name : String) : int
}
IString &lt;|.. MyString : PE4
IFile &lt;|.. MyFile : PE10
note bottom of MyString
  no fields, no constructor needed:
  a String goes in, an answer comes out
end note
@enduml</code></pre></details>`),
    bi(`<h2>2. The String toolbox — and how to read the rules</h2>
<table>
<thead><tr><th>Need</th><th>Java 8</th><th>Note</th></tr></thead>
<tbody>
<tr><td>words</td><td><code>s.trim().split("\\\\s+")</code></td><td><code>split(" ")</code> makes empty words from double spaces; without <code>trim()</code> a leading space gives a first word ""</td></tr>
<tr><td>one character</td><td><code>s.charAt(i)</code></td><td>a <code>char</code>: compare with <code>'a'</code>, never with <code>"a"</code></td></tr>
<tr><td>its kind</td><td><code>Character.isDigit / isLetter / isUpperCase / isLowerCase</code></td><td>"letter" ≠ "not a digit": <code>#</code> is neither</td></tr>
<tr><td>a digit's value</td><td><code>c - '0'</code></td><td>adding <code>c</code> itself adds its code: '2' is 50</td></tr>
<tr><td>reverse</td><td><code>new StringBuilder(w).reverse().toString()</code></td><td>compare with <code>equals</code></td></tr>
<tr><td>build a result</td><td><code>StringBuilder</code> + <code>append</code></td><td>add the separator only between words</td></tr>
<tr><td>find / cut</td><td><code>indexOf</code>, <code>lastIndexOf</code>, <code>substring(a, b)</code></td><td>b is excluded; <code>lastIndexOf('\\\\')</code> for Windows paths</td></tr>
<tr><td>replace text</td><td><code>replace(".", ":")</code></td><td><code>replaceAll</code> and <code>split</code> take a REGEX: <code>"."</code> means any character, <code>"\\\\"</code> crashes</td></tr>
<tr><td>number ↔ text</td><td><code>String.valueOf(n)</code>, <code>Integer.parseInt(s)</code></td><td>the first digit of n: <code>String.valueOf(n).charAt(0)</code></td></tr>
</tbody>
</table>
<p>Words of the rules to underline: <strong>"the first"</strong> (stop there: PE4 f2, PE2 f2), <strong>"lower-case"/"case-sensitive"</strong> (PE2 counts only a e i o u), <strong>"ties … alphabetically"</strong> vs "the first encountered" (PE6 vs PE2), <strong>"exactly two different digits"</strong> (a set of digits, not a count — "B121" has two), <strong>"separated by a single space, no leading or trailing spaces"</strong> (PE11 f2), <strong>"if none, return …"</strong> (−1, "", the length of str, "wrong format"), <strong>"Do not use …"</strong> (PE1 forbids <code>Integer.toBinaryString</code>).</p>`,
    `<h2>2. Hộp đồ nghề String — và cách đọc luật</h2>
<table>
<thead><tr><th>Cần</th><th>Java 8</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>tách từ</td><td><code>s.trim().split("\\\\s+")</code></td><td><code>split(" ")</code> tạo từ rỗng khi có hai dấu cách liền; thiếu <code>trim()</code> thì dấu cách đầu chuỗi cho từ đầu tiên là ""</td></tr>
<tr><td>một ký tự</td><td><code>s.charAt(i)</code></td><td>là <code>char</code>: so với <code>'a'</code>, không bao giờ với <code>"a"</code></td></tr>
<tr><td>loại ký tự</td><td><code>Character.isDigit / isLetter / isUpperCase / isLowerCase</code></td><td>"chữ cái" ≠ "không phải chữ số": <code>#</code> không là cái nào</td></tr>
<tr><td>giá trị chữ số</td><td><code>c - '0'</code></td><td>cộng chính <code>c</code> là cộng mã của nó: '2' là 50</td></tr>
<tr><td>đảo ngược</td><td><code>new StringBuilder(w).reverse().toString()</code></td><td>so bằng <code>equals</code></td></tr>
<tr><td>dựng kết quả</td><td><code>StringBuilder</code> + <code>append</code></td><td>chỉ thêm dấu ngăn cách giữa các từ</td></tr>
<tr><td>tìm / cắt</td><td><code>indexOf</code>, <code>lastIndexOf</code>, <code>substring(a, b)</code></td><td>không lấy b; <code>lastIndexOf('\\\\')</code> cho đường dẫn Windows</td></tr>
<tr><td>thay chữ</td><td><code>replace(".", ":")</code></td><td><code>replaceAll</code> và <code>split</code> nhận REGEX: <code>"."</code> là ký tự bất kỳ, <code>"\\\\"</code> làm sập</td></tr>
<tr><td>số ↔ chữ</td><td><code>String.valueOf(n)</code>, <code>Integer.parseInt(s)</code></td><td>chữ số đầu của n: <code>String.valueOf(n).charAt(0)</code></td></tr>
</tbody>
</table>
<p>Những chữ cần gạch chân trong luật: <strong>"the first"</strong> (dừng ở đó: PE4 f2, PE2 f2), <strong>"lower-case"/"case-sensitive"</strong> (PE2 chỉ đếm a e i o u thường), <strong>"ties … alphabetically"</strong> khác "the first encountered" (PE6 khác PE2), <strong>"exactly two different digits"</strong> (một tập chữ số, không phải số lượng — "B121" có hai), <strong>"separated by a single space, no leading or trailing spaces"</strong> (PE11 f2), <strong>"if none, return …"</strong> (−1, "", độ dài của str, "wrong format"), <strong>"Do not use …"</strong> (PE1 cấm <code>Integer.toBinaryString</code>).</p>`),
    bi(`<h2>3. The frame for question 4</h2>
<pre><code class="language-java">class MyString implements IString {                 // IString.class is given: do not create IString.java

    @Override
    public int f1(String str) {                     // count something per WORD
        int count = 0;
        for (String w : str.trim().split("\\\\s+")) {
            if (rule(w)) count++;
        }
        return count;
    }

    @Override
    public String f2(String str) {                  // build a new string
        StringBuilder b = new StringBuilder();
        for (String w : str.trim().split("\\\\s+")) {
            if (rule(w)) {
                if (b.length() &gt; 0) b.append(' ');  // a single space BETWEEN words only
                b.append(w);
            }
        }
        return b.toString();
    }

    private boolean rule(String w) {                // your own helper: allowed and clearer
        for (char c : w.toCharArray()) {
            if (Character.isDigit(c) &amp;&amp; (c - '0') % 2 == 1) return true;
        }
        return false;
    }
}</code></pre>
<p>About <strong>15 minutes</strong>: 4 to compute both samples by hand and invent one nasty input per method (a double space, a one-letter word, no match at all), 7 to write, 4 to run.</p>`,
    `<h2>3. Khung code cho câu 4</h2>
<pre><code class="language-java">class MyString implements IString {                 // IString.class đã cho: đừng tạo IString.java

    @Override
    public int f1(String str) {                     // đếm theo từng TỪ
        int count = 0;
        for (String w : str.trim().split("\\\\s+")) {
            if (rule(w)) count++;
        }
        return count;
    }

    @Override
    public String f2(String str) {                  // dựng một chuỗi mới
        StringBuilder b = new StringBuilder();
        for (String w : str.trim().split("\\\\s+")) {
            if (rule(w)) {
                if (b.length() &gt; 0) b.append(' ');  // một dấu cách, chỉ GIỮA các từ
                b.append(w);
            }
        }
        return b.toString();
    }

    private boolean rule(String w) {                // hàm phụ tự viết: được phép và rõ ràng hơn
        for (char c : w.toCharArray()) {
            if (Character.isDigit(c) &amp;&amp; (c - '0') % 2 == 1) return true;
        }
        return false;
    }
}</code></pre>
<p>Khoảng <strong>15 phút</strong>: 4 phút tính tay hai mẫu và nghĩ ra một dữ liệu "khó chịu" cho mỗi phương thức (hai dấu cách liền, từ một chữ cái, không có gì khớp), 7 phút viết, 4 phút chạy.</p>`),
    bi(`<h2>4. Solved paper 1 — PE4 (SU26) question 4: MyString</h2>
<p>Paper: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 4 (SU26)</a>, question 4. f1 — count the words that contain at least one odd digit; f2 — replace the (first) palindrome word with "XX". Samples: <code>a a1 b2 c34 d6</code> → <strong>2</strong> (a1, c34); <code>ab 12321 uv 12321 xy</code> → <strong>ab XX uv 12321 xy</strong>.</p>
<details><summary>Solution (our own code, run on JDK 8)</summary>
<pre class="trich"><code class="language-java">interface IString {                                          // GIVEN as IString.class
    public int f1(String str);
    public String f2(String str);
}</code></pre>
<pre class="trich"><code class="language-java">class MyString implements IString {

    // f1: how many WORDS contain at least one odd digit — a word counts once, however many odd digits it has
    @Override
    public int f1(String str) {
        int count = 0;
        for (String w : str.trim().split("\\\\s+")) {          // trim + \\\\s+: no empty "words" from extra spaces
            for (char c : w.toCharArray()) {
                if (Character.isDigit(c) &amp;&amp; (c - '0') % 2 == 1) {
                    count++;
                    break;                                   // this word is counted: go to the next word
                }
            }
        }
        return count;
    }

    // f2: replace the FIRST palindrome word by "XX", every other character stays exactly where it was
    @Override
    public String f2(String str) {
        int i = 0;
        while (i &lt; str.length()) {
            if (str.charAt(i) == ' ') {
                i++;
                continue;
            }
            int start = i;                                   // a word runs from start to the next space
            while (i &lt; str.length() &amp;&amp; str.charAt(i) != ' ') i++;
            String w = str.substring(start, i);
            if (new StringBuilder(w).reverse().toString().equals(w)) {     // equals, never ==
                return str.substring(0, start) + "XX" + str.substring(i);
            }
        }
        return str;                                          // no palindrome: unchanged
    }
}</code></pre>
<p>f1 <code>break</code>s out of a word as soon as it finds one odd digit: "c34" counts once, not once per digit. f2 does <em>not</em> split and re-join: it walks the string, finds each word's start and end, and replaces exactly that slice — so double spaces and everything around the palindrome survive untouched. A one-letter word ("a") reads the same backwards, so it is a palindrome too.</p>
</details>
<pre class="trich"><code class="language-java">// Stand-in for the given Main.class (javap -c): the TC first, then the string; results printed with printf + \\r\\n
class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        System.out.println("1. Test f1()");
        System.out.println("2. Test f2()");
        System.out.print("Enter TC (1 or 2): ");
        int tc = sc.nextInt();
        sc.nextLine();
        System.out.println("Enter a string:");
        String s = sc.nextLine();
        IString t = new MyString();
        System.out.println("OUTPUT:");
        switch (tc) {
            case 1: System.out.printf("%d\\r\\n", t.f1(s)); break;
            case 2: System.out.printf("%s\\r\\n", t.f2(s)); break;
        }
        System.out.println();
    }
}</code></pre>
<pre><code class="language-plaintext"># TC1 f1 (paper sample 1)
1
a a1 b2 c34 d6
# TC2 f2 (paper sample 2)
2
ab 12321 uv 12321 xy
# TC1 again, own test: two odd digits in one word
1
x13 579 b2
# TC2 again, own test: a one-letter word, double spaces
2
hi  a   level</code></pre>
<div class="out">=== TC1 f1 (paper sample 1) ===<br>
1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
2<br>
-&gt; PASS<br>
=== TC2 f2 (paper sample 2) ===<br>
1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
ab XX uv 12321 xy<br>
-&gt; PASS<br>
=== TC1 again, own test: two odd digits in one word ===<br>
1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
2<br>
-&gt; PASS<br>
=== TC2 again, own test: a one-letter word, double spaces ===<br>
1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
hi &nbsp;XX &nbsp;&nbsp;level<br>
-&gt; PASS<br>
4/4 runs match the expected output</div>`,
    `<h2>4. Giải mẫu 1 — đề PE4 (SU26) câu 4: MyString</h2>
<p>Đề: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 4 (SU26)</a>, câu 4. f1 — đếm số từ chứa ít nhất một chữ số lẻ; f2 — thay từ đối xứng (đầu tiên) bằng "XX". Mẫu: <code>a a1 b2 c34 d6</code> → <strong>2</strong> (a1, c34); <code>ab 12321 uv 12321 xy</code> → <strong>ab XX uv 12321 xy</strong>.</p>
<details><summary>Lời giải (code tự viết, chạy trên JDK 8)</summary>
<pre class="trich"><code class="language-java">interface IString {                                          // CHO SẴN dạng IString.class
    public int f1(String str);
    public String f2(String str);
}</code></pre>
<pre class="trich"><code class="language-java">class MyString implements IString {

    // f1: có bao nhiêu TỪ chứa ít nhất một chữ số lẻ — mỗi từ tính một lần, dù có bao nhiêu chữ số lẻ
    @Override
    public int f1(String str) {
        int count = 0;
        for (String w : str.trim().split("\\\\s+")) {          // trim + \\\\s+: không sinh "từ" rỗng do thừa dấu cách
            for (char c : w.toCharArray()) {
                if (Character.isDigit(c) &amp;&amp; (c - '0') % 2 == 1) {
                    count++;
                    break;                                   // từ này đã tính: sang từ kế
                }
            }
        }
        return count;
    }

    // f2: thay từ đối xứng ĐẦU TIÊN bằng "XX", mọi ký tự khác giữ nguyên vị trí
    @Override
    public String f2(String str) {
        int i = 0;
        while (i &lt; str.length()) {
            if (str.charAt(i) == ' ') {
                i++;
                continue;
            }
            int start = i;                                   // một từ chạy từ start tới dấu cách kế tiếp
            while (i &lt; str.length() &amp;&amp; str.charAt(i) != ' ') i++;
            String w = str.substring(start, i);
            if (new StringBuilder(w).reverse().toString().equals(w)) {     // equals, không bao giờ ==
                return str.substring(0, start) + "XX" + str.substring(i);
            }
        }
        return str;                                          // không có từ đối xứng: giữ nguyên
    }
}</code></pre>
<p>f1 <code>break</code> khỏi một từ ngay khi gặp một chữ số lẻ: "c34" tính một lần, không phải mỗi chữ số một lần. f2 <em>không</em> tách rồi nối lại: nó đi dọc chuỗi, tìm đầu và cuối của từng từ, và thay đúng đoạn đó — nên dấu cách đôi và mọi thứ quanh từ đối xứng được giữ nguyên. Từ một chữ cái ("a") đọc ngược vẫn vậy, nên cũng là từ đối xứng.</p>
</details>
<pre class="trich"><code class="language-java">// Bản thay cho Main.class đề cho (javap -c): hỏi TC trước, rồi tới chuỗi; kết quả in bằng printf + \\r\\n
class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        System.out.println("1. Test f1()");
        System.out.println("2. Test f2()");
        System.out.print("Enter TC (1 or 2): ");
        int tc = sc.nextInt();
        sc.nextLine();
        System.out.println("Enter a string:");
        String s = sc.nextLine();
        IString t = new MyString();
        System.out.println("OUTPUT:");
        switch (tc) {
            case 1: System.out.printf("%d\\r\\n", t.f1(s)); break;
            case 2: System.out.printf("%s\\r\\n", t.f2(s)); break;
        }
        System.out.println();
    }
}</code></pre>
<pre><code class="language-plaintext"># TC1 f1 (paper sample 1)
1
a a1 b2 c34 d6
# TC2 f2 (paper sample 2)
2
ab 12321 uv 12321 xy
# TC1 again, own test: two odd digits in one word
1
x13 579 b2
# TC2 again, own test: a one-letter word, double spaces
2
hi  a   level</code></pre>
<div class="out">=== TC1 f1 (paper sample 1) ===<br>
1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
2<br>
-&gt; PASS<br>
=== TC2 f2 (paper sample 2) ===<br>
1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
ab XX uv 12321 xy<br>
-&gt; PASS<br>
=== TC1 again, own test: two odd digits in one word ===<br>
1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
2<br>
-&gt; PASS<br>
=== TC2 again, own test: a one-letter word, double spaces ===<br>
1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
hi &nbsp;XX &nbsp;&nbsp;level<br>
-&gt; PASS<br>
4/4 runs match the expected output</div>`),
    bi(`<h2>5. Solved paper 2 — PE10 (FA25) question 4: MyFile</h2>
<p>Paper: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 10 (FA25)</a>, question 4. f1 — the extension of a file path, or "wrong format"; f2 — "New_" + the file name in upper case + its extension, or "wrong format". Sample path <code>c:\\MyFile\\data.txt</code> → <strong>txt</strong> and <strong>New_DATA.txt</strong> — only the base name is upper-cased, and only the FILE name is returned, not the folders.</p>
<details><summary>Solution (run on JDK 8)</summary>
<pre class="trich"><code class="language-java">class MyFile implements IFile {

    // the file name = what follows the LAST \\ or / (a dot in a folder name must not count)
    private String fileName(String path) {
        int cut = Math.max(path.lastIndexOf('\\\\'), path.lastIndexOf('/'));
        return path.substring(cut + 1);
    }

    // index of the dot that starts the extension, or -1 when there is no usable extension
    private int dotOf(String name) {
        int dot = name.lastIndexOf('.');
        if (dot &lt;= 0 || dot == name.length() - 1) {          // our rule: "data", ".txt" and "data." have no extension
            return -1;
        }
        return dot;
    }

    // f1: the extension, or "wrong format"
    @Override
    public String f1(String str) {
        String name = fileName(str);
        int dot = dotOf(name);
        return dot &lt; 0 ? "wrong format" : name.substring(dot + 1);
    }

    // f2: "New_" + the base name in UPPER case + the extension as it was
    @Override
    public String f2(String str) {
        String name = fileName(str);
        int dot = dotOf(name);
        if (dot &lt; 0) {
            return "wrong format";
        }
        return "New_" + name.substring(0, dot).toUpperCase() + name.substring(dot);
    }
}</code></pre>
<p>The file name is cut at the LAST <code>\\</code> or <code>/</code> with <code>lastIndexOf</code> — never <code>split("\\\\")</code>, which is a broken regular expression (section 8). The extension starts at the LAST dot of the file name, so a dot in a folder (<code>v1.2</code>) is ignored and <code>report.final.pdf</code> has the extension <code>pdf</code>.</p>
</details>
<div class="meo">🧠 Not fully certain: the paper does not define "wrong format" beyond "don't have the extension". We decided that <code>README</code> (no dot), <code>.txt</code> (dot first) and <code>data.</code> (dot last) have none — written as one helper, <code>dotOf</code>, with a comment. The two samples pass either way; if your reading differs, keep it in one place and say so in a comment.</div>
<pre class="trich"><code class="language-java">// Stand-in for the given Main.class (javap -c): it asks for the path FIRST, uses println for every prompt
class Main {
    public static void main(String[] args) {
        MyFile f = new MyFile();
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter file path:");
        String path = sc.nextLine();
        System.out.println("1. Test f1");
        System.out.println("2. Test f2");
        System.out.println("your choice:");
        int tc = sc.nextInt();
        sc.nextLine();
        System.out.println("OUTPUT:");
        switch (tc) {
            case 1: System.out.println(f.f1(path)); break;
            case 2: System.out.println(f.f2(path)); break;
        }
    }
}</code></pre>
<div class="out">=== TC1 f1 (paper sample 1) ===<br>
Enter file path:<br>
1. Test f1<br>
2. Test f2<br>
your choice:<br>
OUTPUT:<br>
txt<br>
-&gt; PASS<br>
=== TC2 f2 (paper sample 2) ===<br>
Enter file path:<br>
1. Test f1<br>
2. Test f2<br>
your choice:<br>
OUTPUT:<br>
New_DATA.txt<br>
-&gt; PASS<br>
=== TC1 again, own test: a dot in a folder name ===<br>
Enter file path:<br>
1. Test f1<br>
2. Test f2<br>
your choice:<br>
OUTPUT:<br>
docx<br>
-&gt; PASS<br>
=== TC1 again, own test: no extension ===<br>
Enter file path:<br>
1. Test f1<br>
2. Test f2<br>
your choice:<br>
OUTPUT:<br>
wrong format<br>
-&gt; PASS<br>
=== TC2 again, own test: two dots in the name ===<br>
Enter file path:<br>
1. Test f1<br>
2. Test f2<br>
your choice:<br>
OUTPUT:<br>
New_REPORT.FINAL.pdf<br>
-&gt; PASS<br>
5/5 runs match the expected output</div>`,
    `<h2>5. Giải mẫu 2 — đề PE10 (FA25) câu 4: MyFile</h2>
<p>Đề: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 10 (FA25)</a>, câu 4. f1 — phần mở rộng của một đường dẫn file, hoặc "wrong format"; f2 — "New_" + tên file viết hoa + phần mở rộng, hoặc "wrong format". Đường dẫn mẫu <code>c:\\MyFile\\data.txt</code> → <strong>txt</strong> và <strong>New_DATA.txt</strong> — chỉ tên gốc được viết hoa, và chỉ trả TÊN FILE, không kèm thư mục.</p>
<details><summary>Lời giải (chạy trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class MyFile implements IFile {

    // tên file = phần sau dấu \\ hoặc / CUỐI CÙNG (dấu chấm trong tên thư mục không được tính)
    private String fileName(String path) {
        int cut = Math.max(path.lastIndexOf('\\\\'), path.lastIndexOf('/'));
        return path.substring(cut + 1);
    }

    // chỉ số của dấu chấm mở đầu phần mở rộng, hoặc -1 khi không có phần mở rộng dùng được
    private int dotOf(String name) {
        int dot = name.lastIndexOf('.');
        if (dot &lt;= 0 || dot == name.length() - 1) {          // luật tự đặt: "data", ".txt" và "data." không có phần mở rộng
            return -1;
        }
        return dot;
    }

    // f1: phần mở rộng, hoặc "wrong format"
    @Override
    public String f1(String str) {
        String name = fileName(str);
        int dot = dotOf(name);
        return dot &lt; 0 ? "wrong format" : name.substring(dot + 1);
    }

    // f2: "New_" + tên gốc viết HOA + phần mở rộng giữ nguyên
    @Override
    public String f2(String str) {
        String name = fileName(str);
        int dot = dotOf(name);
        if (dot &lt; 0) {
            return "wrong format";
        }
        return "New_" + name.substring(0, dot).toUpperCase() + name.substring(dot);
    }
}</code></pre>
<p>Tên file được cắt ở dấu <code>\\</code> hoặc <code>/</code> CUỐI CÙNG bằng <code>lastIndexOf</code> — không bao giờ <code>split("\\\\")</code>, vốn là một biểu thức chính quy hỏng (mục 8). Phần mở rộng bắt đầu ở dấu chấm CUỐI của tên file, nên dấu chấm trong tên thư mục (<code>v1.2</code>) bị bỏ qua và <code>report.final.pdf</code> có phần mở rộng <code>pdf</code>.</p>
</details>
<div class="meo">🧠 Chỗ chưa chắc chắn hoàn toàn: đề không định nghĩa "wrong format" ngoài câu "không có phần mở rộng". Chúng tôi quyết định <code>README</code> (không có dấu chấm), <code>.txt</code> (dấu chấm đứng đầu) và <code>data.</code> (dấu chấm đứng cuối) đều không có — viết trong một hàm phụ duy nhất, <code>dotOf</code>, kèm chú thích. Hai mẫu đều qua với mọi cách hiểu; nếu bạn hiểu khác, hãy giữ luật ở một chỗ và ghi rõ bằng chú thích.</div>
<pre class="trich"><code class="language-java">// Bản thay cho Main.class đề cho (javap -c): hỏi đường dẫn TRƯỚC, mọi lời nhắc dùng println
class Main {
    public static void main(String[] args) {
        MyFile f = new MyFile();
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter file path:");
        String path = sc.nextLine();
        System.out.println("1. Test f1");
        System.out.println("2. Test f2");
        System.out.println("your choice:");
        int tc = sc.nextInt();
        sc.nextLine();
        System.out.println("OUTPUT:");
        switch (tc) {
            case 1: System.out.println(f.f1(path)); break;
            case 2: System.out.println(f.f2(path)); break;
        }
    }
}</code></pre>
<div class="out">=== TC1 f1 (paper sample 1) ===<br>
Enter file path:<br>
1. Test f1<br>
2. Test f2<br>
your choice:<br>
OUTPUT:<br>
txt<br>
-&gt; PASS<br>
=== TC2 f2 (paper sample 2) ===<br>
Enter file path:<br>
1. Test f1<br>
2. Test f2<br>
your choice:<br>
OUTPUT:<br>
New_DATA.txt<br>
-&gt; PASS<br>
=== TC1 again, own test: a dot in a folder name ===<br>
Enter file path:<br>
1. Test f1<br>
2. Test f2<br>
your choice:<br>
OUTPUT:<br>
docx<br>
-&gt; PASS<br>
=== TC1 again, own test: no extension ===<br>
Enter file path:<br>
1. Test f1<br>
2. Test f2<br>
your choice:<br>
OUTPUT:<br>
wrong format<br>
-&gt; PASS<br>
=== TC2 again, own test: two dots in the name ===<br>
Enter file path:<br>
1. Test f1<br>
2. Test f2<br>
your choice:<br>
OUTPUT:<br>
New_REPORT.FINAL.pdf<br>
-&gt; PASS<br>
5/5 runs match the expected output</div>`),
    bi(`<h2>6. The 10-mark paper — one question, one file in, one file out</h2>
<table>
<thead><tr><th>Paper</th><th>Classes to write</th><th>Commands in input.txt</th><th>Output to output.txt</th></tr></thead>
<tbody>
<tr><td>PE3 SP26</td><td>interface ISmartDevice, abstract Device, SmartPhone</td><td><code>add,id,model,storage,isOn</code> · print · search,id · check,id · sort · clear</td><td>"SmartPhone(…) is added", headers <code>---Print---</code>, <code>---Search Result---</code> …, "Empty", "Not found"</td></tr>
<tr><td>PE5 SU25</td><td>abstract Task, WorkTask, PersonalTask</td><td><code>Work id name project</code> · Personal … · Done id · PrintAll · PrintByType type</td><td>"Add new work: id name", "id is done!", <code>--PrintAll--</code>, <code>getInfo()</code> lines</td></tr>
<tr><td>PE9 FA25</td><td>interface EmployeeManagement, Employee (Comparable), InMemoryEmployeeManagement</td><td><code>Add id name salary dept</code> · Update … · Print · Sort · Clear</td><td>"Added:", "Updated:", "Employees:", "Sorted:" + <code>toString()</code> lines</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/44f33bd1460470dcda212299d31ecbe5b5208416.svg" alt="PE5: the classes you write, and the given Q1 skeleton that drives them" loading="lazy" /><p class="chu-thich">🧩 PE5: the classes you write, and the given Q1 skeleton that drives them</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title PE5 — abstract Task, two subclasses, the given Q1 skeleton
abstract class Task {
  - id : int
  - name : String
  - done : boolean
  --
  + Task(id : int, name : String)
  + markDone() : void
  + isDone() : boolean
  + getId() : int
  + getName() : String
  + {abstract} getInfo() : String
  + {abstract} getType() : String
}
class WorkTask {
  - project : String
  + getInfo() : String
  + getType() : String
}
class PersonalTask {
  - location : String
  + getInfo() : String
  + getType() : String
}
class Q1 &lt;&lt;given skeleton&gt;&gt; {
  ~ fi : String
  ~ fo : String
  ~ tasks : ArrayList&lt;Task&gt;
  + setFile(args : String[]) : void
  + read() : void
  + solve() : void
  + printResult() : void
  + {static} main(args : String[]) : void
}
Task &lt;|-- WorkTask
Task &lt;|-- PersonalTask
Q1 o-- "0..*" Task : one list\\nfor both kinds
note right of Q1
  FIXED: setFile, the try/catch of read()
  and printResult(), main()
  @STUDENT: variables, input, algorithm, output
end note
@enduml</code></pre></details>
<p>The given <code>Q1.java</code> is a skeleton with <strong>FIXED</strong> parts ("DO NOT EDIT ANY THINGS HERE": <code>setFile</code>, the try/catch of <code>read()</code> and <code>printResult()</code>, <code>main</code>) and <strong>@STUDENT</strong> parts (your variables, the reading, the algorithm, the writing). It starts with <code>package q1;</code>. The comment on <code>setFile</code> says it all: "Set input and output file for automatic rating — path of input file and path of output file". The marker runs your program with two file names:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/ce10f38a9740c51539bb0d4048e426224c9a3a2f.svg" alt="How a 10-mark paper is run: two names in, read → solve → printResult" loading="lazy" /><p class="chu-thich">🧩 How a 10-mark paper is run: two names in, read → solve → printResult</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title How the marker runs a 10-mark paper: two file names in, one file out
participant "Marking\\nsoftware" as M
participant "Q1.main(args)" as Q
participant "input1.txt" as I
participant "output1.txt" as O
M -&gt; Q : java -jar Q1.jar input1.txt output1.txt
Q -&gt; Q : setFile(args)\\nfi = args[0], fo = args[1]
Q -&gt; I : read(): Scanner(new File(fi))\\nT, then T command lines
Q -&gt; Q : solve(): run every command,\\ncollect the lines to print
Q -&gt; O : printResult(): FileWriter(fo)\\nfw.write(...)
M -&gt; O : compare with the expected file
@enduml</code></pre></details>
<p>Measured on the given files of the Exam Room, byte by byte (<code>od -c</code>): the input files end their lines with <strong><code>\\r\\n</code></strong> (Windows), and PE9's <code>input3.txt</code> carries <strong>spaces after the commands</strong> (<code>Sort      </code>). PE3's sample <code>output1.txt</code> also uses <code>\\r\\n</code> between lines and has no line break after the last line. Read every command with <code>nextLine().trim()</code> and split it with <code>"\\\\s+"</code> (or <code>","</code> for PE3).</p>
<div class="pitfall">PE9 says Clear prints "Cleared employee list.", while the sample table of the same paper (as transcribed in the Exam Room) shows <code>Clear all.</code> — the same "text vs sample" trap as PE10 question 1. The sample is what a marker built from the paper's own expected files checks. Compute the samples by hand before writing the output part.</div>`,
    `<h2>6. Đề 10 điểm — một câu, một file vào, một file ra</h2>
<table>
<thead><tr><th>Đề</th><th>Lớp phải viết</th><th>Lệnh trong input.txt</th><th>Ghi ra output.txt</th></tr></thead>
<tbody>
<tr><td>PE3 SP26</td><td>interface ISmartDevice, lớp trừu tượng Device, SmartPhone</td><td><code>add,id,model,storage,isOn</code> · print · search,id · check,id · sort · clear</td><td>"SmartPhone(…) is added", tiêu đề <code>---Print---</code>, <code>---Search Result---</code> …, "Empty", "Not found"</td></tr>
<tr><td>PE5 SU25</td><td>lớp trừu tượng Task, WorkTask, PersonalTask</td><td><code>Work id name project</code> · Personal … · Done id · PrintAll · PrintByType type</td><td>"Add new work: id name", "id is done!", <code>--PrintAll--</code>, các dòng <code>getInfo()</code></td></tr>
<tr><td>PE9 FA25</td><td>interface EmployeeManagement, Employee (Comparable), InMemoryEmployeeManagement</td><td><code>Add id name salary dept</code> · Update … · Print · Sort · Clear</td><td>"Added:", "Updated:", "Employees:", "Sorted:" + các dòng <code>toString()</code></td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/44f33bd1460470dcda212299d31ecbe5b5208416.svg" alt="PE5: các lớp bạn viết, và khung Q1 đề cho điều khiển chúng" loading="lazy" /><p class="chu-thich">🧩 PE5: các lớp bạn viết, và khung Q1 đề cho điều khiển chúng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title PE5 — abstract Task, two subclasses, the given Q1 skeleton
abstract class Task {
  - id : int
  - name : String
  - done : boolean
  --
  + Task(id : int, name : String)
  + markDone() : void
  + isDone() : boolean
  + getId() : int
  + getName() : String
  + {abstract} getInfo() : String
  + {abstract} getType() : String
}
class WorkTask {
  - project : String
  + getInfo() : String
  + getType() : String
}
class PersonalTask {
  - location : String
  + getInfo() : String
  + getType() : String
}
class Q1 &lt;&lt;given skeleton&gt;&gt; {
  ~ fi : String
  ~ fo : String
  ~ tasks : ArrayList&lt;Task&gt;
  + setFile(args : String[]) : void
  + read() : void
  + solve() : void
  + printResult() : void
  + {static} main(args : String[]) : void
}
Task &lt;|-- WorkTask
Task &lt;|-- PersonalTask
Q1 o-- "0..*" Task : one list\\nfor both kinds
note right of Q1
  FIXED: setFile, the try/catch of read()
  and printResult(), main()
  @STUDENT: variables, input, algorithm, output
end note
@enduml</code></pre></details>
<p><code>Q1.java</code> đề cho là một bộ khung có phần <strong>FIXED</strong> ("DO NOT EDIT ANY THINGS HERE": <code>setFile</code>, khối try/catch của <code>read()</code> và <code>printResult()</code>, <code>main</code>) và phần <strong>@STUDENT</strong> (biến của bạn, phần đọc, thuật toán, phần ghi). Nó mở đầu bằng <code>package q1;</code>. Chú thích của <code>setFile</code> nói hết: "Set input and output file for automatic rating — path of input file and path of output file" (đặt file vào và file ra cho việc chấm tự động). Máy chấm chạy chương trình của bạn với hai tên file:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/ce10f38a9740c51539bb0d4048e426224c9a3a2f.svg" alt="Đề 10 điểm được chạy thế nào: hai tên file vào, read → solve → printResult" loading="lazy" /><p class="chu-thich">🧩 Đề 10 điểm được chạy thế nào: hai tên file vào, read → solve → printResult</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title How the marker runs a 10-mark paper: two file names in, one file out
participant "Marking\\nsoftware" as M
participant "Q1.main(args)" as Q
participant "input1.txt" as I
participant "output1.txt" as O
M -&gt; Q : java -jar Q1.jar input1.txt output1.txt
Q -&gt; Q : setFile(args)\\nfi = args[0], fo = args[1]
Q -&gt; I : read(): Scanner(new File(fi))\\nT, then T command lines
Q -&gt; Q : solve(): run every command,\\ncollect the lines to print
Q -&gt; O : printResult(): FileWriter(fo)\\nfw.write(...)
M -&gt; O : compare with the expected file
@enduml</code></pre></details>
<p>Đo trên các file given của Exam Room, từng byte (<code>od -c</code>): file input xuống dòng bằng <strong><code>\\r\\n</code></strong> (Windows), và <code>input3.txt</code> của PE9 còn dính <strong>dấu cách sau lệnh</strong> (<code>Sort      </code>). File <code>output1.txt</code> mẫu của PE3 cũng dùng <code>\\r\\n</code> giữa các dòng và không xuống dòng sau dòng cuối. Đọc mọi lệnh bằng <code>nextLine().trim()</code> và tách bằng <code>"\\\\s+"</code> (hoặc <code>","</code> với PE3).</p>
<div class="pitfall">PE9 ghi lệnh Clear in "Cleared employee list.", trong khi bảng mẫu của chính đề đó (như Exam Room chép lại) cho thấy <code>Clear all.</code> — cùng cái bẫy "chữ của đề và mẫu" như câu 1 PE10. Mẫu là thứ một máy chấm dựng từ file kết quả của chính đề sẽ kiểm. Tính tay các mẫu trước khi viết phần ghi output.</div>`),
    bi(`<h2>7. Solved paper 3 — PE5 (SU25): the task manager, all 10 marks</h2>
<p>Paper: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 5 (SU25)</a>. Abstract <code>Task(id, name)</code> with <code>markDone</code>, <code>isDone</code>, getters and two abstract methods <code>getInfo()</code>, <code>getType()</code>; <code>WorkTask</code> (project) and <code>PersonalTask</code> (location) with <code>getInfo()</code> like <code>Work: [1] ReportX (ProjectA) - Done</code>; Q1 runs the commands of <code>input.txt</code>. Exam Room rubric: Task 2, the subclasses 3, adding and Done 3, the two prints 2.</p>
<details><summary>The classes (our own code, run on JDK 8)</summary>
<pre class="trich"><code class="language-java">abstract class Task {
    private int id;
    private String name;
    private boolean done;                                    // false by default = "Not Done"

    public Task(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public void markDone() { done = true; }
    public boolean isDone() { return done; }
    public int getId() { return id; }
    public String getName() { return name; }

    public abstract String getInfo();
    public abstract String getType();

    // shared by both subclasses: "Done" / "Not Done"
    protected String status() {
        return done ? "Done" : "Not Done";
    }
}

class WorkTask extends Task {
    private String project;

    public WorkTask(int id, String name, String project) {
        super(id, name);
        this.project = project;
    }

    @Override
    public String getInfo() {
        return "Work: [" + getId() + "] " + getName() + " (" + project + ") - " + status();
    }

    @Override
    public String getType() { return "Work"; }
}

class PersonalTask extends Task {
    private String location;

    public PersonalTask(int id, String name, String location) {
        super(id, name);
        this.location = location;
    }

    @Override
    public String getInfo() {
        return "Personal: [" + getId() + "] " + getName() + " (" + location + ") - " + status();
    }

    @Override
    public String getType() { return "Personal"; }
}</code></pre>
<p><code>status()</code> is a small <code>protected</code> helper in Task so both subclasses say "Done"/"Not Done" the same way; <code>done</code> stays private and only <code>markDone()</code> changes it.</p>
</details>
<details><summary>The skeleton, filled in (FIXED parts unchanged)</summary>
<pre class="trich"><code class="language-java">// The given Q1.java: everything outside the @STUDENT parts is copied unchanged (only "package q1;" is left out here, see the lesson)
class Q1 {
    //Change the name of input and output file based on practical paper
    String inputFile = "input.txt";
    String outputFile = "output.txt";

    //--VARIABLES - @STUDENT: DECLARE YOUR VARIABLES HERE:
    ArrayList&lt;String&gt; commands = new ArrayList&lt;String&gt;();      // the N command lines, as read
    ArrayList&lt;Task&gt; tasks = new ArrayList&lt;Task&gt;();             // ONE list for both kinds — ids are unique across all tasks
    ArrayList&lt;String&gt; lines = new ArrayList&lt;String&gt;();         // every line of output.txt, in order

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    String fi, fo;

    /**
     * Set input and output file for automatic rating
     * @param args path of input file and path of output file
     */
    public void setFile (String[] args){
        fi = args.length&gt;=2? args[0]: inputFile;
        fo = args.length&gt;=2? args[1]: outputFile;
    }

    /**
     * Reads data from input file
     */
    public void read(){
        try (Scanner sc  = new Scanner(new File(fi))){
    //--END FIXED PART----------------------------

            //INPUT - @STUDENT: ADD YOUR CODE FOR INPUT HERE:
            int n = Integer.parseInt(sc.nextLine().trim());     // whole line + trim: never nextInt() here
            for (int i = 0; i &lt; n &amp;&amp; sc.hasNextLine(); i++) {
                commands.add(sc.nextLine().trim());             // the given input files end lines with \\r\\n and may carry spaces

            }

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            sc.close();
        }catch(FileNotFoundException ex){
            System.out.println("Input Exception # " + ex);
        }
    }
    //--END FIXED PART----------------------------

    //ALGORITHM - @STUDENT: ADD YOUROWN METHODS HERE (IF NEED):
    Task findById(int id) {
        for (Task t : tasks) {
            if (t.getId() == id) return t;
        }
        return null;
    }

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    /**
     * Main algorithm
     */
    public void solve(){
    //--END FIXED PART----------------------------

        //ALGORITHM - @STUDENT: ADD YOUR CODE HERE:
        for (String cmd : commands) {
            String[] p = cmd.split("\\\\s+");                     // "Work 1 ReportX ProjectA" → 4 pieces
            if (p[0].equals("Work")) {
                Task t = new WorkTask(Integer.parseInt(p[1]), p[2], p[3]);
                tasks.add(t);
                lines.add("Add new work: " + t.getId() + " " + t.getName());     // the project is stored, NOT printed
            } else if (p[0].equals("Personal")) {
                Task t = new PersonalTask(Integer.parseInt(p[1]), p[2], p[3]);
                tasks.add(t);
                lines.add("Add new personal: " + t.getId() + " " + t.getName());
            } else if (p[0].equals("Done")) {
                Task t = findById(Integer.parseInt(p[1]));
                if (t != null) {                                // the paper says nothing about an unknown id
                    t.markDone();
                    lines.add(t.getId() + " is done!");
                }
            } else if (p[0].equals("PrintAll")) {
                lines.add("--PrintAll--");
                for (Task t : tasks) lines.add(t.getInfo());   // one call works for both subclasses: polymorphism
            } else if (p[0].equals("PrintByType")) {
                lines.add("--PrintByType: " + p[1] + "--");
                for (Task t : tasks) {
                    if (t.getType().equals(p[1])) lines.add(t.getInfo());
                }
            }
        }

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    }

    /**
     * Write result into output file
     */
    public void printResult(){
        try{
            FileWriter fw = new FileWriter(fo);
    //--END FIXED PART----------------------------

            //OUTPUT - @STUDENT: ADD YOUR CODE FOR OUTPUT HERE:
            for (int i = 0; i &lt; lines.size(); i++) {
                fw.write(lines.get(i) + (i &lt; lines.size() - 1 ? "\\r\\n" : ""));   // like the given sample output files: \\r\\n between lines
            }

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            fw.flush();
            fw.close();
        }catch (IOException ex){
            System.out.println("Output Exception # " + ex);
        }
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        Q1 q = new Q1();
        q.setFile(args);
        q.read();
        q.solve();
        q.printResult();
    }
    //--END FIXED PART----------------------------
}</code></pre>
<p>The three @STUDENT variables are the whole design: the command lines as read, ONE <code>ArrayList&lt;Task&gt;</code> for both kinds (ids are unique across all tasks, so <code>Done 3</code> needs no type), and the output lines in order. <code>read()</code> only reads, <code>solve()</code> only computes, <code>printResult()</code> only writes — exactly the split the FIXED parts impose. In our single-file version the line <code>package q1;</code> is left out so the lesson can run all classes together; in the exam keep it.</p>
<p>One choice of ours: <code>Done</code> with an unknown id prints nothing — the paper does not say. No sample tests it.</p>
</details>
<p>The "marker": it writes the paper's five sample inputs (with <code>\\r\\n</code>, like the given files) and calls <code>Q1.main</code> with an input name and an output name — the same thing as <code>java -jar Q1.jar input1.txt output1.txt</code>:</p>
<pre class="trich"><code class="language-java">// The marker calls Q1 with TWO arguments — input file, output file — that is what setFile(args) is for
public class PeQ1Task {
    static final String[][] TC = {
        { "1", "Work 1 ReportX ProjectA" },
        { "2", "Personal 2 Grocery Home", "Done 2" },
        { "4", "Work 1 ReportX ProjectA", "Personal 2 Grocery Home", "Done 1", "PrintAll" },
        { "5", "Work 1 Design ProjectX", "Work 2 Code ProjectX", "Personal 3 Call Home", "Done 2", "PrintByType Work" },
        { "7", "Personal 1 Read Library", "Work 2 Submit ProjectB", "Personal 3 Jog Park", "Done 3", "PrintAll", "Done 1", "PrintByType Personal" },
    };
    static final String[] MAU = {            // the paper's five sample output.txt
        "Add new work: 1 ReportX",
        "Add new personal: 2 Grocery\\n2 is done!",
        "Add new work: 1 ReportX\\nAdd new personal: 2 Grocery\\n1 is done!\\n--PrintAll--\\nWork: [1] ReportX (ProjectA) - Done\\nPersonal: [2] Grocery (Home) - Not Done",
        "Add new work: 1 Design\\nAdd new work: 2 Code\\nAdd new personal: 3 Call\\n2 is done!\\n--PrintByType: Work--\\nWork: [1] Design (ProjectX) - Not Done\\nWork: [2] Code (ProjectX) - Done",
        "Add new personal: 1 Read\\nAdd new work: 2 Submit\\nAdd new personal: 3 Jog\\n3 is done!\\n--PrintAll--\\nPersonal: [1] Read (Library) - Not Done\\nWork: [2] Submit (ProjectB) - Not Done\\nPersonal: [3] Jog (Park) - Done\\n1 is done!\\n--PrintByType: Personal--\\nPersonal: [1] Read (Library) - Done\\nPersonal: [3] Jog (Park) - Done",
    };

    public static void main(String[] args) throws Exception {
        File dir = new File("run");
        dir.mkdirs();
        int pass = 0;
        for (int i = 0; i &lt; TC.length; i++) {
            File in = new File(dir, "input" + (i + 1) + ".txt");
            File out = new File(dir, "output" + (i + 1) + ".txt");
            ghi(in, String.join("\\r\\n", TC[i]) + "\\r\\n");             // Windows line ends, like the given input files
            Q1.main(new String[] { in.getPath(), out.getPath() });   // = java -jar Q1.jar input1.txt output1.txt
            String got = doc(out).replace("\\r\\n", "\\n");
            boolean ok = got.trim().equals(MAU[i]);
            if (ok) pass++;
            System.out.println("=== input" + (i + 1) + ".txt → output" + (i + 1) + ".txt ===");
            System.out.println(got);
            System.out.println(ok ? "-&gt; PASS" : "-&gt; FAIL, the paper expects:\\n" + MAU[i]);
        }
        System.out.println(pass + "/" + TC.length + " output files match the samples");
    }</code></pre>
<div class="out">=== input1.txt → output1.txt ===<br>
Add new work: 1 ReportX<br>
-&gt; PASS<br>
=== input2.txt → output2.txt ===<br>
Add new personal: 2 Grocery<br>
2 is done!<br>
-&gt; PASS<br>
=== input3.txt → output3.txt ===<br>
Add new work: 1 ReportX<br>
Add new personal: 2 Grocery<br>
1 is done!<br>
--PrintAll--<br>
Work: [1] ReportX (ProjectA) - Done<br>
Personal: [2] Grocery (Home) - Not Done<br>
-&gt; PASS<br>
=== input4.txt → output4.txt ===<br>
Add new work: 1 Design<br>
Add new work: 2 Code<br>
Add new personal: 3 Call<br>
2 is done!<br>
--PrintByType: Work--<br>
Work: [1] Design (ProjectX) - Not Done<br>
Work: [2] Code (ProjectX) - Done<br>
-&gt; PASS<br>
=== input5.txt → output5.txt ===<br>
Add new personal: 1 Read<br>
Add new work: 2 Submit<br>
Add new personal: 3 Jog<br>
3 is done!<br>
--PrintAll--<br>
Personal: [1] Read (Library) - Not Done<br>
Work: [2] Submit (ProjectB) - Not Done<br>
Personal: [3] Jog (Park) - Done<br>
1 is done!<br>
--PrintByType: Personal--<br>
Personal: [1] Read (Library) - Done<br>
Personal: [3] Jog (Park) - Done<br>
-&gt; PASS<br>
5/5 output files match the samples</div>`,
    `<h2>7. Giải mẫu 3 — đề PE5 (SU25): quản lý công việc, trọn 10 điểm</h2>
<p>Đề: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 → PE → Đề 5 (SU25)</a>. Lớp trừu tượng <code>Task(id, name)</code> có <code>markDone</code>, <code>isDone</code>, các getter và hai phương thức trừu tượng <code>getInfo()</code>, <code>getType()</code>; <code>WorkTask</code> (project) và <code>PersonalTask</code> (location) với <code>getInfo()</code> dạng <code>Work: [1] ReportX (ProjectA) - Done</code>; Q1 chạy các lệnh trong <code>input.txt</code>. Rubric của Exam Room: Task 2, các lớp con 3, thêm và Done 3, hai lệnh in 2.</p>
<details><summary>Các lớp (code tự viết, chạy trên JDK 8)</summary>
<pre class="trich"><code class="language-java">abstract class Task {
    private int id;
    private String name;
    private boolean done;                                    // mặc định false = "Not Done"

    public Task(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public void markDone() { done = true; }
    public boolean isDone() { return done; }
    public int getId() { return id; }
    public String getName() { return name; }

    public abstract String getInfo();
    public abstract String getType();

    // dùng chung cho hai lớp con: "Done" / "Not Done"
    protected String status() {
        return done ? "Done" : "Not Done";
    }
}

class WorkTask extends Task {
    private String project;

    public WorkTask(int id, String name, String project) {
        super(id, name);
        this.project = project;
    }

    @Override
    public String getInfo() {
        return "Work: [" + getId() + "] " + getName() + " (" + project + ") - " + status();
    }

    @Override
    public String getType() { return "Work"; }
}

class PersonalTask extends Task {
    private String location;

    public PersonalTask(int id, String name, String location) {
        super(id, name);
        this.location = location;
    }

    @Override
    public String getInfo() {
        return "Personal: [" + getId() + "] " + getName() + " (" + location + ") - " + status();
    }

    @Override
    public String getType() { return "Personal"; }
}</code></pre>
<p><code>status()</code> là một hàm phụ <code>protected</code> nhỏ trong Task để hai lớp con nói "Done"/"Not Done" giống hệt nhau; <code>done</code> vẫn private và chỉ <code>markDone()</code> được đổi nó.</p>
</details>
<details><summary>Bộ khung, đã điền (phần FIXED giữ nguyên)</summary>
<pre class="trich"><code class="language-java">// Q1.java đề cho: mọi thứ ngoài phần @STUDENT chép nguyên (chỉ bỏ dòng "package q1;" ở đây, xem bài)
class Q1 {
    //Change the name of input and output file based on practical paper
    String inputFile = "input.txt";
    String outputFile = "output.txt";

    //--VARIABLES - @STUDENT: DECLARE YOUR VARIABLES HERE:
    ArrayList&lt;String&gt; commands = new ArrayList&lt;String&gt;();      // N dòng lệnh, như đọc được
    ArrayList&lt;Task&gt; tasks = new ArrayList&lt;Task&gt;();             // MỘT danh sách cho cả hai loại — id là duy nhất trên mọi task
    ArrayList&lt;String&gt; lines = new ArrayList&lt;String&gt;();         // mọi dòng của output.txt, theo thứ tự

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    String fi, fo;

    /**
     * Set input and output file for automatic rating
     * @param args path of input file and path of output file
     */
    public void setFile (String[] args){
        fi = args.length&gt;=2? args[0]: inputFile;
        fo = args.length&gt;=2? args[1]: outputFile;
    }

    /**
     * Reads data from input file
     */
    public void read(){
        try (Scanner sc  = new Scanner(new File(fi))){
    //--END FIXED PART----------------------------

            //INPUT - @STUDENT: ADD YOUR CODE FOR INPUT HERE:
            int n = Integer.parseInt(sc.nextLine().trim());     // cả dòng + trim: đừng dùng nextInt() ở đây
            for (int i = 0; i &lt; n &amp;&amp; sc.hasNextLine(); i++) {
                commands.add(sc.nextLine().trim());             // file input đề cho xuống dòng bằng \\r\\n và có thể dính dấu cách

            }

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            sc.close();
        }catch(FileNotFoundException ex){
            System.out.println("Input Exception # " + ex);
        }
    }
    //--END FIXED PART----------------------------

    //ALGORITHM - @STUDENT: ADD YOUROWN METHODS HERE (IF NEED):
    Task findById(int id) {
        for (Task t : tasks) {
            if (t.getId() == id) return t;
        }
        return null;
    }

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    /**
     * Main algorithm
     */
    public void solve(){
    //--END FIXED PART----------------------------

        //ALGORITHM - @STUDENT: ADD YOUR CODE HERE:
        for (String cmd : commands) {
            String[] p = cmd.split("\\\\s+");                     // "Work 1 ReportX ProjectA" → 4 mảnh
            if (p[0].equals("Work")) {
                Task t = new WorkTask(Integer.parseInt(p[1]), p[2], p[3]);
                tasks.add(t);
                lines.add("Add new work: " + t.getId() + " " + t.getName());     // project được lưu, KHÔNG in ra
            } else if (p[0].equals("Personal")) {
                Task t = new PersonalTask(Integer.parseInt(p[1]), p[2], p[3]);
                tasks.add(t);
                lines.add("Add new personal: " + t.getId() + " " + t.getName());
            } else if (p[0].equals("Done")) {
                Task t = findById(Integer.parseInt(p[1]));
                if (t != null) {                                // đề không nói gì về id không tồn tại
                    t.markDone();
                    lines.add(t.getId() + " is done!");
                }
            } else if (p[0].equals("PrintAll")) {
                lines.add("--PrintAll--");
                for (Task t : tasks) lines.add(t.getInfo());   // một lời gọi chạy cho cả hai lớp con: đa hình
            } else if (p[0].equals("PrintByType")) {
                lines.add("--PrintByType: " + p[1] + "--");
                for (Task t : tasks) {
                    if (t.getType().equals(p[1])) lines.add(t.getInfo());
                }
            }
        }

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    }

    /**
     * Write result into output file
     */
    public void printResult(){
        try{
            FileWriter fw = new FileWriter(fo);
    //--END FIXED PART----------------------------

            //OUTPUT - @STUDENT: ADD YOUR CODE FOR OUTPUT HERE:
            for (int i = 0; i &lt; lines.size(); i++) {
                fw.write(lines.get(i) + (i &lt; lines.size() - 1 ? "\\r\\n" : ""));   // giống file output mẫu đề cho: \\r\\n giữa các dòng
            }

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            fw.flush();
            fw.close();
        }catch (IOException ex){
            System.out.println("Output Exception # " + ex);
        }
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        Q1 q = new Q1();
        q.setFile(args);
        q.read();
        q.solve();
        q.printResult();
    }
    //--END FIXED PART----------------------------
}</code></pre>
<p>Ba biến @STUDENT là toàn bộ thiết kế: các dòng lệnh như đọc được, MỘT <code>ArrayList&lt;Task&gt;</code> cho cả hai loại (id là duy nhất trên mọi task, nên <code>Done 3</code> không cần biết loại), và các dòng output theo thứ tự. <code>read()</code> chỉ đọc, <code>solve()</code> chỉ tính, <code>printResult()</code> chỉ ghi — đúng cách chia mà phần FIXED áp đặt. Trong bản một file của bài, dòng <code>package q1;</code> được bỏ để chạy chung mọi lớp; trong phòng thi hãy giữ nguyên.</p>
<p>Một lựa chọn của chúng tôi: <code>Done</code> với id không tồn tại thì không in gì — đề không nói. Không mẫu nào kiểm chuyện này.</p>
</details>
<p>"Máy chấm": nó ghi năm file input mẫu của đề (xuống dòng <code>\\r\\n</code>, như file given) rồi gọi <code>Q1.main</code> với một tên file vào và một tên file ra — y như <code>java -jar Q1.jar input1.txt output1.txt</code>:</p>
<pre class="trich"><code class="language-java">// Máy chấm gọi Q1 với HAI tham số — file vào, file ra — setFile(args) có là để làm việc đó
public class PeQ1Task {
    static final String[][] TC = {
        { "1", "Work 1 ReportX ProjectA" },
        { "2", "Personal 2 Grocery Home", "Done 2" },
        { "4", "Work 1 ReportX ProjectA", "Personal 2 Grocery Home", "Done 1", "PrintAll" },
        { "5", "Work 1 Design ProjectX", "Work 2 Code ProjectX", "Personal 3 Call Home", "Done 2", "PrintByType Work" },
        { "7", "Personal 1 Read Library", "Work 2 Submit ProjectB", "Personal 3 Jog Park", "Done 3", "PrintAll", "Done 1", "PrintByType Personal" },
    };
    static final String[] MAU = {            // năm file output.txt mẫu của đề
        "Add new work: 1 ReportX",
        "Add new personal: 2 Grocery\\n2 is done!",
        "Add new work: 1 ReportX\\nAdd new personal: 2 Grocery\\n1 is done!\\n--PrintAll--\\nWork: [1] ReportX (ProjectA) - Done\\nPersonal: [2] Grocery (Home) - Not Done",
        "Add new work: 1 Design\\nAdd new work: 2 Code\\nAdd new personal: 3 Call\\n2 is done!\\n--PrintByType: Work--\\nWork: [1] Design (ProjectX) - Not Done\\nWork: [2] Code (ProjectX) - Done",
        "Add new personal: 1 Read\\nAdd new work: 2 Submit\\nAdd new personal: 3 Jog\\n3 is done!\\n--PrintAll--\\nPersonal: [1] Read (Library) - Not Done\\nWork: [2] Submit (ProjectB) - Not Done\\nPersonal: [3] Jog (Park) - Done\\n1 is done!\\n--PrintByType: Personal--\\nPersonal: [1] Read (Library) - Done\\nPersonal: [3] Jog (Park) - Done",
    };

    public static void main(String[] args) throws Exception {
        File dir = new File("run");
        dir.mkdirs();
        int pass = 0;
        for (int i = 0; i &lt; TC.length; i++) {
            File in = new File(dir, "input" + (i + 1) + ".txt");
            File out = new File(dir, "output" + (i + 1) + ".txt");
            ghi(in, String.join("\\r\\n", TC[i]) + "\\r\\n");             // xuống dòng kiểu Windows, như file input đề cho
            Q1.main(new String[] { in.getPath(), out.getPath() });   // = java -jar Q1.jar input1.txt output1.txt
            String got = doc(out).replace("\\r\\n", "\\n");
            boolean ok = got.trim().equals(MAU[i]);
            if (ok) pass++;
            System.out.println("=== input" + (i + 1) + ".txt → output" + (i + 1) + ".txt ===");
            System.out.println(got);
            System.out.println(ok ? "-&gt; PASS" : "-&gt; FAIL, the paper expects:\\n" + MAU[i]);
        }
        System.out.println(pass + "/" + TC.length + " output files match the samples");
    }</code></pre>
<div class="out">=== input1.txt → output1.txt ===<br>
Add new work: 1 ReportX<br>
-&gt; PASS<br>
=== input2.txt → output2.txt ===<br>
Add new personal: 2 Grocery<br>
2 is done!<br>
-&gt; PASS<br>
=== input3.txt → output3.txt ===<br>
Add new work: 1 ReportX<br>
Add new personal: 2 Grocery<br>
1 is done!<br>
--PrintAll--<br>
Work: [1] ReportX (ProjectA) - Done<br>
Personal: [2] Grocery (Home) - Not Done<br>
-&gt; PASS<br>
=== input4.txt → output4.txt ===<br>
Add new work: 1 Design<br>
Add new work: 2 Code<br>
Add new personal: 3 Call<br>
2 is done!<br>
--PrintByType: Work--<br>
Work: [1] Design (ProjectX) - Not Done<br>
Work: [2] Code (ProjectX) - Done<br>
-&gt; PASS<br>
=== input5.txt → output5.txt ===<br>
Add new personal: 1 Read<br>
Add new work: 2 Submit<br>
Add new personal: 3 Jog<br>
3 is done!<br>
--PrintAll--<br>
Personal: [1] Read (Library) - Not Done<br>
Work: [2] Submit (ProjectB) - Not Done<br>
Personal: [3] Jog (Park) - Done<br>
1 is done!<br>
--PrintByType: Personal--<br>
Personal: [1] Read (Library) - Done<br>
Personal: [3] Jog (Park) - Done<br>
-&gt; PASS<br>
5/5 output files match the samples</div>`),
    bi(`<h2>8. Fourteen ways to lose question 4 and the 10-mark paper — each one measured</h2>
<pre><code class="language-java">// release: 8
// Ten ways to lose the marks of a PE question 4 (String tools) and of the 10-mark file paper, each run for real
import java.util.*;

public class LoiMatDiemQ4 {
    public static void main(String[] args) {
        // P1 — PE7 countWords(): split(" ") turns a double space into an EMPTY word
        String s1 = "hello  world";
        xem("P1 split(\\" \\")", "2", String.valueOf(s1.split(" ").length), String.valueOf(s1.trim().split("\\\\s+").length));

        // P2 — PE7 getFirstWord(): a leading space makes the first piece ""
        String s2 = " hello world !";
        xem("P2 leading space", "HELLO", "[" + s2.split("\\\\s+")[0].toUpperCase() + "]", s2.trim().split("\\\\s+")[0].toUpperCase());

        // P3 — PE14 f1 "replace all . with :" — replaceAll() reads "." as a REGEX meaning "any character"
        String link = "https://fap.fpt.edu.vn";
        xem("P3 replaceAll(\\".\\")", "https://fap:fpt:edu:vn", link.replaceAll(".", ":"), link.replace(".", ":"));

        // P4 — PE10 f1: split(".") is the same regex: every character is a separator, nothing is left
        String file = "data.txt";
        String[] parts = file.split(".");
        xem("P4 split(\\".\\")", "txt", "length " + parts.length, file.split("\\\\.")[1]);

        // P5 — PE10: split("\\\\") on a Windows path throws before your logic even starts
        String path = "c:\\\\MyFile\\\\data.txt";
        String sai5;
        try {
            String[] p = path.split("\\\\");
            sai5 = p[p.length - 1];
        } catch (RuntimeException e) {
            sai5 = "CRASH " + e.getClass().getSimpleName();
        }
        xem("P5 split(\\"\\\\\\\\\\")", "data.txt", sai5, path.substring(path.lastIndexOf('\\\\') + 1));

        // P6 — PE8 calculateAverageValue(): adding the CHARACTERS '2' and '6' adds their codes 50 and 54
        String s6 = "abc123@56#";
        int sumSai = 0, sumDung = 0, n = 0;
        for (char c : s6.toCharArray()) {
            if (Character.isDigit(c) &amp;&amp; (c - '0') % 2 == 0) {
                sumSai += c;                                 // 50 + 54
                sumDung += c - '0';                          // 2 + 6
                n++;
            }
        }
        xem("P6 char codes", "4.00", String.format("%.2f", (double) sumSai / n), String.format("%.2f", (double) sumDung / n));

        // P7 — PE10 f2: a String never changes; toUpperCase() RETURNS a new one
        String base = "data";
        base.toUpperCase();                                  // the result is thrown away
        String sai7 = "New_" + base + ".txt";
        xem("P7 result not kept", "New_DATA.txt", sai7, "New_" + base.toUpperCase() + ".txt");

        // P8 — PE4 f2 palindrome: == compares two DIFFERENT objects, so "12321" is never a palindrome
        String w = "12321";
        String rev = new StringBuilder(w).reverse().toString();
        xem("P8 == on Strings", "true", String.valueOf(rev == w), String.valueOf(rev.equals(w)));

        // P9 — 10-mark paper: line 5 of the GIVEN PE9 input3.txt is "Sort" followed by spaces (measured byte by byte)
        Scanner f9 = new Scanner("5\\r\\nAdd 4 Daisy 2500.00 Finance      \\r\\nSort      ");
        f9.nextLine();
        f9.nextLine();
        String sort = f9.nextLine();
        xem("P9 is it the Sort command?", "true", String.valueOf(sort.equals("Sort")), String.valueOf(sort.trim().equals("Sort")));

        // P10 — 10-mark paper: nextInt() for T, then nextLine() for the first command
        Scanner f10 = new Scanner("2\\r\\nAdd 1 Alice 1500.00 HR\\r\\nPrint\\r\\n");
        f10.nextInt();
        String first = f10.nextLine();                       // the rest of line 1: ""
        Scanner g10 = new Scanner("2\\r\\nAdd 1 Alice 1500.00 HR\\r\\nPrint\\r\\n");
        Integer.parseInt(g10.nextLine().trim());
        String first2 = g10.nextLine();
        xem("P10 nextInt + nextLine", "Add 1 Alice 1500.00 HR", "[" + first + "]", first2);
    }

    static void xem(String bay, String mau, String sai, String dung) {
        System.out.println(bay);
        System.out.println("   expected : " + mau);
        System.out.println("   wrong    : " + sai + (sai.equals(mau) ? "   PASS" : "   FAIL"));
        System.out.println("   right    : " + dung + (dung.equals(mau) ? "   PASS" : "   FAIL"));
    }
}</code></pre>
<div class="out">P1 split(" ")<br>
&nbsp;&nbsp;&nbsp;expected : 2<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 3 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 2 &nbsp;&nbsp;PASS<br>
P2 leading space<br>
&nbsp;&nbsp;&nbsp;expected : HELLO<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: HELLO &nbsp;&nbsp;PASS<br>
P3 replaceAll(".")<br>
&nbsp;&nbsp;&nbsp;expected : https://fap:fpt:edu:vn<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: :::::::::::::::::::::: &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: https://fap:fpt:edu:vn &nbsp;&nbsp;PASS<br>
P4 split(".")<br>
&nbsp;&nbsp;&nbsp;expected : txt<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: length 0 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: txt &nbsp;&nbsp;PASS<br>
P5 split("\\\\")<br>
&nbsp;&nbsp;&nbsp;expected : data.txt<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: CRASH PatternSyntaxException &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: data.txt &nbsp;&nbsp;PASS<br>
P6 char codes<br>
&nbsp;&nbsp;&nbsp;expected : 4.00<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 52.00 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 4.00 &nbsp;&nbsp;PASS<br>
P7 result not kept<br>
&nbsp;&nbsp;&nbsp;expected : New_DATA.txt<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: New_data.txt &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: New_DATA.txt &nbsp;&nbsp;PASS<br>
P8 == on Strings<br>
&nbsp;&nbsp;&nbsp;expected : true<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: false &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: true &nbsp;&nbsp;PASS<br>
P9 is it the Sort command?<br>
&nbsp;&nbsp;&nbsp;expected : true<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: false &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: true &nbsp;&nbsp;PASS<br>
P10 nextInt + nextLine<br>
&nbsp;&nbsp;&nbsp;expected : Add 1 Alice 1500.00 HR<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: Add 1 Alice 1500.00 HR &nbsp;&nbsp;PASS</div>
<p>And the 10-mark skeleton on a real JDK 8 — the package, the two arguments, and two errors that come from outside your logic:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("Q1");
    viet(d, "input1.txt", "2\\r\\nWork 1 ReportX ProjectA\\r\\nDone 1\\r\\n");
    viet(d, "Q1.java", Q1);
    lenh(d, "javac", "-d", ".", "Q1.java");                       // package q1 ⇒ the class lands in q1/Q1.class
    lenh(d, "java", "q1.Q1", "input1.txt", "output1.txt");        // what the marker does: two arguments
    inFile(new File(d, "output1.txt"));
    lenh(d, "java", "Q1", "input1.txt", "output1.txt");           // forgetting the package in the class name
    lenh(d, "java", "q1.Q1");                                     // no arguments ⇒ the defaults input.txt / output.txt

    System.out.println("\\n== A: System.out.println instead of fw.write ==");
    viet(d, "Q1.java", Q1.replace("fw.write(line + \\"\\\\r\\\\n\\");", "System.out.println(line);"));
    lenh(d, "javac", "-d", ".", "Q1.java");
    lenh(d, "java", "q1.Q1", "input1.txt", "output1.txt");
    inFile(new File(d, "output1.txt"));

    System.out.println("\\n== B: the line found in the given Q1.java of PE3 ==");
    viet(d, "Q1.java", Q1.replace("import java.util.Scanner;\\n", "import java.util.Scanner;\\nimport static javafx.scene.input.KeyCode.T;\\n"));
    lenh(d, "javac", "-d", ".", "Q1.java");

    System.out.println("\\n== C: comparing a char with a String ==");
    viet(d, "C.java", "public class C {\\n    public static void main(String[] a) {\\n        String s = \\"java\\";\\n        if (s.charAt(0) == \\"j\\") System.out.println(\\"yes\\");\\n    }\\n}\\n");
    lenh(d, "javac", "C.java");
}</code></pre>
<div class="out">&gt; javac -d . Q1.java<br>
&gt; java q1.Q1 input1.txt output1.txt<br>
--- output1.txt (25 bytes) ---<br>
Add new work: 1 ReportX<br>
&gt; java Q1 input1.txt output1.txt<br>
Error: Could not find or load main class Q1<br>
(exit code 1)<br>
&gt; java q1.Q1<br>
Input Exception # java.io.FileNotFoundException: input.txt (No such file or directory)<br>
<br>
== A: System.out.println instead of fw.write ==<br>
&gt; javac -d . Q1.java<br>
&gt; java q1.Q1 input1.txt output1.txt<br>
Add new work: 1 ReportX<br>
--- output1.txt (0 bytes) ---<br>
<br>
== B: the line found in the given Q1.java of PE3 ==<br>
&gt; javac -d . Q1.java<br>
Q1.java:8: error: package javafx.scene.input does not exist<br>
import static javafx.scene.input.KeyCode.T;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Q1.java:8: error: static import only from classes and interfaces<br>
import static javafx.scene.input.KeyCode.T;<br>
^<br>
2 errors<br>
(exit code 1)<br>
<br>
== C: comparing a char with a String ==<br>
&gt; javac C.java<br>
C.java:4: error: incomparable types: char and String<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (s.charAt(0) == "j") System.out.println("yes");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<table>
<thead><tr><th>#</th><th>Mistake</th><th>Real effect</th><th>Rule</th></tr></thead>
<tbody>
<tr><td>P1</td><td><code>split(" ")</code> on "hello  world"</td><td>3 words</td><td><code>trim().split("\\\\s+")</code></td></tr>
<tr><td>P2</td><td>no <code>trim()</code> before splitting " hello world !"</td><td>first word ""</td><td>trim first</td></tr>
<tr><td>P3</td><td><code>replaceAll(".", ":")</code> (PE14)</td><td>every character becomes ":"</td><td><code>replace</code> for plain text</td></tr>
<tr><td>P4</td><td><code>split(".")</code> to get the extension</td><td>an empty array</td><td><code>split("\\\\.")</code> or <code>lastIndexOf('.')</code></td></tr>
<tr><td>P5</td><td><code>split("\\\\")</code> on a Windows path (PE10)</td><td><code>PatternSyntaxException</code></td><td><code>lastIndexOf('\\\\')</code></td></tr>
<tr><td>P6</td><td>adding the chars '2' and '6' (PE8)</td><td>average 52.00</td><td><code>c - '0'</code></td></tr>
<tr><td>P7</td><td><code>base.toUpperCase();</code> alone</td><td>New_data.txt</td><td>Strings never change: keep the result</td></tr>
<tr><td>P8</td><td><code>reversed == word</code></td><td>no palindrome ever found</td><td><code>equals</code></td></tr>
<tr><td>P9</td><td><code>"Sort      ".equals("Sort")</code> (PE9's real input)</td><td>the command is ignored</td><td><code>nextLine().trim()</code></td></tr>
<tr><td>P10</td><td><code>nextInt()</code> for T, then <code>nextLine()</code></td><td>first command ""</td><td><code>Integer.parseInt(sc.nextLine().trim())</code></td></tr>
<tr><td>—</td><td><code>java q1.Q1 input1.txt output1.txt</code></td><td>works: with a package, the class's full name is <code>q1.Q1</code></td><td>keep the package of the skeleton</td></tr>
<tr><td>A</td><td><code>System.out.println</code> instead of <code>fw.write</code></td><td>output1.txt: 0 bytes</td><td>everything goes through <code>fw</code></td></tr>
<tr><td>B</td><td><code>import static javafx.scene.input.KeyCode.T;</code> — a line found in the given Q1.java of PE3</td><td><code>package javafx.scene.input does not exist</code> on OpenJDK 8</td><td>delete imports you did not write on purpose</td></tr>
<tr><td>C</td><td><code>s.charAt(0) == "j"</code></td><td><code>incomparable types: char and String</code></td><td>a char with <code>'j'</code></td></tr>
<tr><td>—</td><td><code>java Q1</code> without the package / no arguments</td><td><code>Could not find or load main class Q1</code> / <code>FileNotFoundException: input.txt</code></td><td>how to run it by hand: package name + two file names</td></tr>
</tbody>
</table>
<div class="pitfall">B is a real surprise: a <code>static import</code> of JavaFX, probably added by the IDE when someone typed <code>T</code> (the skeleton has a variable <code>T</code>). Oracle's JDK 8 ships JavaFX, so it may compile on one PC and fail on another (Temurin/OpenJDK 8 has no JavaFX — measured above). Before building, read the import lines of your file.</div>`,
    `<h2>8. Mười bốn cách mất điểm ở câu 4 và đề 10 điểm — cách nào cũng đo thật</h2>
<pre><code class="language-java">// release: 8
// Mười cách mất điểm câu 4 đề PE (xử lý chuỗi) và đề 10 điểm đọc file, cái nào cũng chạy thật
import java.util.*;

public class LoiMatDiemQ4 {
    public static void main(String[] args) {
        // P1 — PE7 countWords(): split(" ") biến hai dấu cách liền nhau thành một từ RỖNG
        String s1 = "hello  world";
        xem("P1 split(\\" \\")", "2", String.valueOf(s1.split(" ").length), String.valueOf(s1.trim().split("\\\\s+").length));

        // P2 — PE7 getFirstWord(): dấu cách đầu chuỗi làm mảnh đầu tiên thành ""
        String s2 = " hello world !";
        xem("P2 leading space", "HELLO", "[" + s2.split("\\\\s+")[0].toUpperCase() + "]", s2.trim().split("\\\\s+")[0].toUpperCase());

        // P3 — PE14 f1 "thay mọi . bằng :" — replaceAll() hiểu "." là REGEX nghĩa là "ký tự bất kỳ"
        String link = "https://fap.fpt.edu.vn";
        xem("P3 replaceAll(\\".\\")", "https://fap:fpt:edu:vn", link.replaceAll(".", ":"), link.replace(".", ":"));

        // P4 — PE10 f1: split(".") cùng là regex: mọi ký tự đều là dấu tách, không còn gì
        String file = "data.txt";
        String[] parts = file.split(".");
        xem("P4 split(\\".\\")", "txt", "length " + parts.length, file.split("\\\\.")[1]);

        // P5 — PE10: split("\\\\") trên đường dẫn Windows ném lỗi trước cả khi logic của bạn chạy
        String path = "c:\\\\MyFile\\\\data.txt";
        String sai5;
        try {
            String[] p = path.split("\\\\");
            sai5 = p[p.length - 1];
        } catch (RuntimeException e) {
            sai5 = "CRASH " + e.getClass().getSimpleName();
        }
        xem("P5 split(\\"\\\\\\\\\\")", "data.txt", sai5, path.substring(path.lastIndexOf('\\\\') + 1));

        // P6 — PE8 calculateAverageValue(): cộng KÝ TỰ '2' và '6' là cộng mã của chúng, 50 và 54
        String s6 = "abc123@56#";
        int sumSai = 0, sumDung = 0, n = 0;
        for (char c : s6.toCharArray()) {
            if (Character.isDigit(c) &amp;&amp; (c - '0') % 2 == 0) {
                sumSai += c;                                 // 50 + 54
                sumDung += c - '0';                          // 2 + 6
                n++;
            }
        }
        xem("P6 char codes", "4.00", String.format("%.2f", (double) sumSai / n), String.format("%.2f", (double) sumDung / n));

        // P7 — PE10 f2: String không bao giờ đổi; toUpperCase() TRẢ VỀ một chuỗi mới
        String base = "data";
        base.toUpperCase();                                  // kết quả bị vứt đi
        String sai7 = "New_" + base + ".txt";
        xem("P7 result not kept", "New_DATA.txt", sai7, "New_" + base.toUpperCase() + ".txt");

        // P8 — PE4 f2 đối xứng: == so hai đối tượng KHÁC nhau, nên "12321" không bao giờ đối xứng
        String w = "12321";
        String rev = new StringBuilder(w).reverse().toString();
        xem("P8 == on Strings", "true", String.valueOf(rev == w), String.valueOf(rev.equals(w)));

        // P9 — đề 10 điểm: dòng 5 của file input3.txt ĐỀ CHO trong PE9 là "Sort" kèm dấu cách (đo từng byte)
        Scanner f9 = new Scanner("5\\r\\nAdd 4 Daisy 2500.00 Finance      \\r\\nSort      ");
        f9.nextLine();
        f9.nextLine();
        String sort = f9.nextLine();
        xem("P9 is it the Sort command?", "true", String.valueOf(sort.equals("Sort")), String.valueOf(sort.trim().equals("Sort")));

        // P10 — đề 10 điểm: nextInt() cho T, rồi nextLine() cho lệnh đầu tiên
        Scanner f10 = new Scanner("2\\r\\nAdd 1 Alice 1500.00 HR\\r\\nPrint\\r\\n");
        f10.nextInt();
        String first = f10.nextLine();                       // phần còn lại của dòng 1: ""
        Scanner g10 = new Scanner("2\\r\\nAdd 1 Alice 1500.00 HR\\r\\nPrint\\r\\n");
        Integer.parseInt(g10.nextLine().trim());
        String first2 = g10.nextLine();
        xem("P10 nextInt + nextLine", "Add 1 Alice 1500.00 HR", "[" + first + "]", first2);
    }

    static void xem(String bay, String mau, String sai, String dung) {
        System.out.println(bay);
        System.out.println("   expected : " + mau);
        System.out.println("   wrong    : " + sai + (sai.equals(mau) ? "   PASS" : "   FAIL"));
        System.out.println("   right    : " + dung + (dung.equals(mau) ? "   PASS" : "   FAIL"));
    }
}</code></pre>
<div class="out">P1 split(" ")<br>
&nbsp;&nbsp;&nbsp;expected : 2<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 3 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 2 &nbsp;&nbsp;PASS<br>
P2 leading space<br>
&nbsp;&nbsp;&nbsp;expected : HELLO<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: HELLO &nbsp;&nbsp;PASS<br>
P3 replaceAll(".")<br>
&nbsp;&nbsp;&nbsp;expected : https://fap:fpt:edu:vn<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: :::::::::::::::::::::: &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: https://fap:fpt:edu:vn &nbsp;&nbsp;PASS<br>
P4 split(".")<br>
&nbsp;&nbsp;&nbsp;expected : txt<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: length 0 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: txt &nbsp;&nbsp;PASS<br>
P5 split("\\\\")<br>
&nbsp;&nbsp;&nbsp;expected : data.txt<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: CRASH PatternSyntaxException &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: data.txt &nbsp;&nbsp;PASS<br>
P6 char codes<br>
&nbsp;&nbsp;&nbsp;expected : 4.00<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: 52.00 &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: 4.00 &nbsp;&nbsp;PASS<br>
P7 result not kept<br>
&nbsp;&nbsp;&nbsp;expected : New_DATA.txt<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: New_data.txt &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: New_DATA.txt &nbsp;&nbsp;PASS<br>
P8 == on Strings<br>
&nbsp;&nbsp;&nbsp;expected : true<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: false &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: true &nbsp;&nbsp;PASS<br>
P9 is it the Sort command?<br>
&nbsp;&nbsp;&nbsp;expected : true<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: false &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: true &nbsp;&nbsp;PASS<br>
P10 nextInt + nextLine<br>
&nbsp;&nbsp;&nbsp;expected : Add 1 Alice 1500.00 HR<br>
&nbsp;&nbsp;&nbsp;wrong &nbsp;&nbsp;&nbsp;: [] &nbsp;&nbsp;FAIL<br>
&nbsp;&nbsp;&nbsp;right &nbsp;&nbsp;&nbsp;: Add 1 Alice 1500.00 HR &nbsp;&nbsp;PASS</div>
<p>Và bộ khung 10 điểm trên JDK 8 thật — package, hai tham số, và hai lỗi đến từ bên ngoài logic của bạn:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("Q1");
    viet(d, "input1.txt", "2\\r\\nWork 1 ReportX ProjectA\\r\\nDone 1\\r\\n");
    viet(d, "Q1.java", Q1);
    lenh(d, "javac", "-d", ".", "Q1.java");                       // package q1 ⇒ lớp nằm ở q1/Q1.class
    lenh(d, "java", "q1.Q1", "input1.txt", "output1.txt");        // việc máy chấm làm: hai tham số
    inFile(new File(d, "output1.txt"));
    lenh(d, "java", "Q1", "input1.txt", "output1.txt");           // quên package trong tên lớp
    lenh(d, "java", "q1.Q1");                                     // không tham số ⇒ dùng mặc định input.txt / output.txt

    System.out.println("\\n== A: System.out.println instead of fw.write ==");
    viet(d, "Q1.java", Q1.replace("fw.write(line + \\"\\\\r\\\\n\\");", "System.out.println(line);"));
    lenh(d, "javac", "-d", ".", "Q1.java");
    lenh(d, "java", "q1.Q1", "input1.txt", "output1.txt");
    inFile(new File(d, "output1.txt"));

    System.out.println("\\n== B: the line found in the given Q1.java of PE3 ==");
    viet(d, "Q1.java", Q1.replace("import java.util.Scanner;\\n", "import java.util.Scanner;\\nimport static javafx.scene.input.KeyCode.T;\\n"));
    lenh(d, "javac", "-d", ".", "Q1.java");

    System.out.println("\\n== C: comparing a char with a String ==");
    viet(d, "C.java", "public class C {\\n    public static void main(String[] a) {\\n        String s = \\"java\\";\\n        if (s.charAt(0) == \\"j\\") System.out.println(\\"yes\\");\\n    }\\n}\\n");
    lenh(d, "javac", "C.java");
}</code></pre>
<div class="out">&gt; javac -d . Q1.java<br>
&gt; java q1.Q1 input1.txt output1.txt<br>
--- output1.txt (25 bytes) ---<br>
Add new work: 1 ReportX<br>
&gt; java Q1 input1.txt output1.txt<br>
Error: Could not find or load main class Q1<br>
(exit code 1)<br>
&gt; java q1.Q1<br>
Input Exception # java.io.FileNotFoundException: input.txt (No such file or directory)<br>
<br>
== A: System.out.println instead of fw.write ==<br>
&gt; javac -d . Q1.java<br>
&gt; java q1.Q1 input1.txt output1.txt<br>
Add new work: 1 ReportX<br>
--- output1.txt (0 bytes) ---<br>
<br>
== B: the line found in the given Q1.java of PE3 ==<br>
&gt; javac -d . Q1.java<br>
Q1.java:8: error: package javafx.scene.input does not exist<br>
import static javafx.scene.input.KeyCode.T;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Q1.java:8: error: static import only from classes and interfaces<br>
import static javafx.scene.input.KeyCode.T;<br>
^<br>
2 errors<br>
(exit code 1)<br>
<br>
== C: comparing a char with a String ==<br>
&gt; javac C.java<br>
C.java:4: error: incomparable types: char and String<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (s.charAt(0) == "j") System.out.println("yes");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<table>
<thead><tr><th>#</th><th>Lỗi</th><th>Hậu quả thật</th><th>Luật</th></tr></thead>
<tbody>
<tr><td>P1</td><td><code>split(" ")</code> trên "hello  world"</td><td>3 từ</td><td><code>trim().split("\\\\s+")</code></td></tr>
<tr><td>P2</td><td>không <code>trim()</code> trước khi tách " hello world !"</td><td>từ đầu là ""</td><td>trim trước</td></tr>
<tr><td>P3</td><td><code>replaceAll(".", ":")</code> (PE14)</td><td>mọi ký tự thành ":"</td><td><code>replace</code> cho chữ thường</td></tr>
<tr><td>P4</td><td><code>split(".")</code> để lấy phần mở rộng</td><td>mảng rỗng</td><td><code>split("\\\\.")</code> hoặc <code>lastIndexOf('.')</code></td></tr>
<tr><td>P5</td><td><code>split("\\\\")</code> trên đường dẫn Windows (PE10)</td><td><code>PatternSyntaxException</code></td><td><code>lastIndexOf('\\\\')</code></td></tr>
<tr><td>P6</td><td>cộng hai ký tự '2' và '6' (PE8)</td><td>trung bình 52.00</td><td><code>c - '0'</code></td></tr>
<tr><td>P7</td><td>gọi <code>base.toUpperCase();</code> rồi bỏ đó</td><td>New_data.txt</td><td>String không bao giờ đổi: giữ lấy kết quả</td></tr>
<tr><td>P8</td><td><code>reversed == word</code></td><td>không bao giờ thấy từ đối xứng</td><td><code>equals</code></td></tr>
<tr><td>P9</td><td><code>"Sort      ".equals("Sort")</code> (input thật của PE9)</td><td>lệnh bị bỏ qua</td><td><code>nextLine().trim()</code></td></tr>
<tr><td>P10</td><td><code>nextInt()</code> cho T, rồi <code>nextLine()</code></td><td>lệnh đầu tiên là ""</td><td><code>Integer.parseInt(sc.nextLine().trim())</code></td></tr>
<tr><td>—</td><td><code>java q1.Q1 input1.txt output1.txt</code></td><td>chạy đúng: có package thì tên đầy đủ của lớp là <code>q1.Q1</code></td><td>giữ package của bộ khung</td></tr>
<tr><td>A</td><td><code>System.out.println</code> thay vì <code>fw.write</code></td><td>output1.txt: 0 byte</td><td>mọi thứ đi qua <code>fw</code></td></tr>
<tr><td>B</td><td><code>import static javafx.scene.input.KeyCode.T;</code> — dòng có thật trong Q1.java given của PE3</td><td><code>package javafx.scene.input does not exist</code> trên OpenJDK 8</td><td>xoá các dòng import bạn không cố ý viết</td></tr>
<tr><td>C</td><td><code>s.charAt(0) == "j"</code></td><td><code>incomparable types: char and String</code></td><td>so char với <code>'j'</code></td></tr>
<tr><td>—</td><td><code>java Q1</code> thiếu package / không tham số</td><td><code>Could not find or load main class Q1</code> / <code>FileNotFoundException: input.txt</code></td><td>cách chạy tay: tên package + hai tên file</td></tr>
</tbody>
</table>
<div class="pitfall">B là một bất ngờ có thật: một <code>static import</code> của JavaFX, nhiều khả năng do IDE tự thêm khi ai đó gõ <code>T</code> (bộ khung có biến <code>T</code>). JDK 8 của Oracle có kèm JavaFX, nên có thể máy này biên dịch được còn máy kia thì không (Temurin/OpenJDK 8 không có JavaFX — đã đo ở trên). Trước khi build, hãy đọc các dòng import trong file của bạn.</div>`),
    bi(`<h2>9. Plans and checklists</h2>
<p><strong>Question 4 (about 15 minutes):</strong> compute both samples by hand → write <code>MyXxx implements IXxx</code> with both methods returning a dummy value → compile → f1, run its sample → f2, run its sample → one nasty input each → build, copy run + src.</p>
<p><strong>A 10-mark paper (85 minutes):</strong></p>
<table>
<thead><tr><th>Minutes</th><th>Do</th><th>Marks it protects</th></tr></thead>
<tbody>
<tr><td>0–8</td><td>read everything; write down the exact output line of every command, from the SAMPLES</td><td>all of them</td></tr>
<tr><td>8–28</td><td>interface / abstract class / subclasses, with <code>toString()</code>/<code>getInfo()</code> formats</td><td>about half (PE5: 5 of 10)</td></tr>
<tr><td>28–40</td><td><code>read()</code>: T with <code>parseInt(nextLine().trim())</code>, T lines with <code>trim()</code>; <code>printResult()</code>: write a list of lines</td><td>nothing works without them</td></tr>
<tr><td>40–65</td><td><code>solve()</code>: one command at a time, run input1, input2 … after each</td><td>the command marks</td></tr>
<tr><td>65–80</td><td>run every given input file; compare with the samples line by line; then Clean and Build</td><td>—</td></tr>
<tr><td>80–85</td><td>copy the jar into <strong>run</strong>, the project into <strong>src</strong>, submit</td><td>the whole paper</td></tr>
</tbody>
</table>
<ol>
<li>No <code>IXxx.java</code> created for a given interface; the class implements every method with the exact signature.</li>
<li>Words split with <code>trim().split("\\\\s+")</code>; texts replaced with <code>replace</code>, not <code>replaceAll</code>; paths cut with <code>lastIndexOf</code>.</li>
<li>Digits as values with <code>c - '0'</code>; chars compared with <code>'x'</code>; Strings with <code>equals</code>; results of String methods kept.</li>
<li>"The first …" stops at the first; ties broken as the paper says; the "none" answer exactly as written.</li>
<li>10-mark paper: <code>package q1;</code> and every FIXED line untouched; only @STUDENT parts edited.</li>
<li>T and every command read with <code>nextLine().trim()</code>; commands compared after trimming.</li>
<li>Every output line written with <code>fw.write</code>, in the order of the commands, labels copied from the samples.</li>
<li>Every given <code>inputN.txt</code> run (NetBeans: Project Properties → Run → Arguments <code>input1.txt output1.txt</code>), the output compared with the sample.</li>
<li>Imports read once: no stray <code>javafx</code> or unused <code>static</code> import.</li>
</ol>`,
    `<h2>9. Kế hoạch và danh sách kiểm</h2>
<p><strong>Câu 4 (khoảng 15 phút):</strong> tính tay hai mẫu → viết <code>MyXxx implements IXxx</code> với hai phương thức trả giá trị tạm → biên dịch → f1, chạy mẫu của nó → f2, chạy mẫu của nó → mỗi hàm một dữ liệu "khó chịu" → build, chép run + src.</p>
<p><strong>Đề 10 điểm (85 phút):</strong></p>
<table>
<thead><tr><th>Phút</th><th>Làm gì</th><th>Giữ được điểm nào</th></tr></thead>
<tbody>
<tr><td>0–8</td><td>đọc hết; ghi ra đúng dòng output của từng lệnh, lấy từ MẪU</td><td>tất cả</td></tr>
<tr><td>8–28</td><td>interface / lớp trừu tượng / lớp con, kèm định dạng <code>toString()</code>/<code>getInfo()</code></td><td>khoảng một nửa (PE5: 5 trên 10)</td></tr>
<tr><td>28–40</td><td><code>read()</code>: T bằng <code>parseInt(nextLine().trim())</code>, T dòng có <code>trim()</code>; <code>printResult()</code>: ghi một danh sách dòng</td><td>thiếu chúng thì không gì chạy</td></tr>
<tr><td>40–65</td><td><code>solve()</code>: từng lệnh một, chạy input1, input2 … sau mỗi lệnh</td><td>điểm của các lệnh</td></tr>
<tr><td>65–80</td><td>chạy mọi file input given; so với mẫu từng dòng; rồi Clean and Build</td><td>—</td></tr>
<tr><td>80–85</td><td>chép jar vào <strong>run</strong>, project vào <strong>src</strong>, nộp</td><td>cả đề</td></tr>
</tbody>
</table>
<ol>
<li>Không tạo <code>IXxx.java</code> cho interface đã cho; lớp hiện thực mọi phương thức với đúng chữ ký.</li>
<li>Tách từ bằng <code>trim().split("\\\\s+")</code>; thay chữ bằng <code>replace</code>, không phải <code>replaceAll</code>; cắt đường dẫn bằng <code>lastIndexOf</code>.</li>
<li>Giá trị chữ số bằng <code>c - '0'</code>; so char với <code>'x'</code>; so String bằng <code>equals</code>; giữ lấy kết quả của các phương thức String.</li>
<li>"Đầu tiên …" thì dừng ở cái đầu tiên; hoà thì phân xử như đề nói; câu trả lời cho ca "không có" đúng như đề viết.</li>
<li>Đề 10 điểm: <code>package q1;</code> và mọi dòng FIXED giữ nguyên; chỉ sửa phần @STUDENT.</li>
<li>T và mọi lệnh đọc bằng <code>nextLine().trim()</code>; so lệnh sau khi đã trim.</li>
<li>Mọi dòng output ghi bằng <code>fw.write</code>, theo thứ tự lệnh, nhãn chép từ mẫu.</li>
<li>Chạy mọi file <code>inputN.txt</code> given (NetBeans: Project Properties → Run → Arguments <code>input1.txt output1.txt</code>), so output với mẫu.</li>
<li>Đọc lại các dòng import một lần: không có <code>javafx</code> lạc hay <code>static</code> import thừa.</li>
</ol>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong><code>split(regex)</code></strong></td><td>tách theo biểu thức chính quy</td><td>Cuts a String at every match of a regular expression; <code>"\\\\s+"</code> = one or more spaces.</td></tr>
<tr><td><strong>regular expression (regex)</strong></td><td>biểu thức chính quy</td><td>A pattern language where <code>.</code> means any character and <code>\\</code> starts an escape; used by <code>split</code> and <code>replaceAll</code>.</td></tr>
<tr><td><strong><code>replace</code> vs <code>replaceAll</code></strong></td><td>thay chữ / thay theo regex</td><td><code>replace</code> swaps plain text; <code>replaceAll</code> treats its first argument as a regex.</td></tr>
<tr><td><strong>immutable String</strong></td><td>String bất biến</td><td>No method changes a String; <code>toUpperCase()</code> returns a new one that you must keep.</td></tr>
<tr><td><strong><code>char</code></strong></td><td>ký tự</td><td>One 16-bit character written <code>'a'</code>; its numeric code takes part in arithmetic (<code>'2'</code> is 50).</td></tr>
<tr><td><strong><code>StringBuilder</code></strong></td><td>bộ dựng chuỗi</td><td>A changeable buffer for building a String piece by piece; also <code>reverse()</code>.</td></tr>
<tr><td><strong>palindrome</strong></td><td>từ đối xứng</td><td>A word that reads the same backwards ("12321", "level", "a").</td></tr>
<tr><td><strong>file extension</strong></td><td>phần mở rộng</td><td>The part of a file name after its last dot ("txt" in data.txt).</td></tr>
<tr><td><strong>command-line arguments</strong></td><td>tham số dòng lệnh</td><td>The words after the class name in <code>java q1.Q1 input1.txt output1.txt</code>, received as <code>args</code>.</td></tr>
<tr><td><strong>FIXED / @STUDENT parts</strong></td><td>phần cố định / phần của sinh viên</td><td>Regions of the given Q1.java you must not touch / you fill in.</td></tr>
<tr><td><strong>CRLF (<code>\\r\\n</code>)</strong></td><td>xuống dòng kiểu Windows</td><td>The two-character line ending of Windows files; <code>nextLine()</code> handles it, <code>split("\\n")</code> leaves a <code>\\r</code>.</td></tr>
<tr><td><strong><code>FileWriter</code></strong></td><td>bộ ghi file</td><td>Writes characters into a file; nothing reaches the file unless it goes through <code>fw.write</code>.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong><code>split(regex)</code></strong></td><td>tách theo biểu thức chính quy</td><td>Cắt String tại mọi chỗ khớp một biểu thức chính quy; <code>"\\\\s+"</code> = một hoặc nhiều dấu cách.</td></tr>
<tr><td><strong>regular expression (regex)</strong></td><td>biểu thức chính quy</td><td>Ngôn ngữ mẫu trong đó <code>.</code> là ký tự bất kỳ và <code>\\</code> mở đầu ký tự thoát; <code>split</code> và <code>replaceAll</code> dùng nó.</td></tr>
<tr><td><strong><code>replace</code> vs <code>replaceAll</code></strong></td><td>thay chữ / thay theo regex</td><td><code>replace</code> thay chữ thường; <code>replaceAll</code> coi tham số đầu là regex.</td></tr>
<tr><td><strong>immutable String</strong></td><td>String bất biến</td><td>Không phương thức nào đổi được một String; <code>toUpperCase()</code> trả về chuỗi mới mà bạn phải giữ lấy.</td></tr>
<tr><td><strong><code>char</code></strong></td><td>ký tự</td><td>Một ký tự 16 bit viết <code>'a'</code>; mã số của nó tham gia phép tính (<code>'2'</code> là 50).</td></tr>
<tr><td><strong><code>StringBuilder</code></strong></td><td>bộ dựng chuỗi</td><td>Vùng đệm thay đổi được để dựng String từng mảnh; có cả <code>reverse()</code>.</td></tr>
<tr><td><strong>palindrome</strong></td><td>từ đối xứng</td><td>Một từ đọc ngược vẫn giống ("12321", "level", "a").</td></tr>
<tr><td><strong>file extension</strong></td><td>phần mở rộng</td><td>Phần tên file sau dấu chấm cuối cùng ("txt" trong data.txt).</td></tr>
<tr><td><strong>command-line arguments</strong></td><td>tham số dòng lệnh</td><td>Các từ sau tên lớp trong <code>java q1.Q1 input1.txt output1.txt</code>, nhận vào qua <code>args</code>.</td></tr>
<tr><td><strong>FIXED / @STUDENT parts</strong></td><td>phần cố định / phần của sinh viên</td><td>Các vùng của Q1.java đề cho bạn không được đụng tới / bạn điền vào.</td></tr>
<tr><td><strong>CRLF (<code>\\r\\n</code>)</strong></td><td>xuống dòng kiểu Windows</td><td>Kiểu kết thúc dòng hai ký tự của file Windows; <code>nextLine()</code> xử lý được, <code>split("\\n")</code> để lại một <code>\\r</code>.</td></tr>
<tr><td><strong><code>FileWriter</code></strong></td><td>bộ ghi file</td><td>Ghi ký tự vào một file; không gì vào file nếu không đi qua <code>fw.write</code>.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 7 things for question 4 and the 10-mark paper</h2>
<ol>
<li><strong>Question 4 is pure String work</strong> on a given interface: count, find, build; every edge of the two rules is worth marks.</li>
<li><strong>Words = <code>trim().split("\\\\s+")</code></strong>; <code>split</code> and <code>replaceAll</code> speak regex — <code>"."</code> and <code>"\\\\"</code> do not mean what they look like.</li>
<li><strong>Characters are numbers:</strong> <code>c - '0'</code> for a digit's value, <code>'x'</code> not <code>"x"</code>, <code>equals</code> for Strings, and keep the result of every String method.</li>
<li><strong>"The first", "ties", "none":</strong> each paper answers them differently — the samples and the wording decide.</li>
<li><strong>A 10-mark paper is read → solve → printResult</strong> inside a skeleton you must not break: package q1, FIXED parts, two file names from the marker.</li>
<li><strong>Real input files are Windows files with stray spaces:</strong> <code>nextLine().trim()</code> for everything, <code>parseInt</code> instead of <code>nextInt</code>.</li>
<li><strong>Output goes through <code>fw.write</code>,</strong> labels copied from the samples — and when text and samples disagree, the samples win.</li>
</ol>
<div class="callout">🧭 <strong>Go further — LAB211, Chapter 9 and Spring Boot</strong>: the 10-mark paper is a small LAB211 program: a model, a store, commands from a file. Chapter 9 teaches the file classes behind <code>Scanner(new File(…))</code> and <code>FileWriter</code>; in LabFlow the same "parse a line → command → object" step is what a Spring controller does with an HTTP request. Back to the start: <strong>🎯 PE drill 1</strong> has the 85-minute plan for a full four-question paper — then take one paper in the <a href="/exam?course=PRO192&amp;kind=PE">Exam Room</a> against the clock.</div>`,
    `<h2>📌 Tóm tắt — 7 điều cho câu 4 và đề 10 điểm</h2>
<ol>
<li><strong>Câu 4 là xử lý String thuần</strong> trên một interface cho sẵn: đếm, tìm, dựng chuỗi; mọi góc cạnh của hai luật đều đáng điểm.</li>
<li><strong>Tách từ = <code>trim().split("\\\\s+")</code></strong>; <code>split</code> và <code>replaceAll</code> nói ngôn ngữ regex — <code>"."</code> và <code>"\\\\"</code> không mang nghĩa như vẻ ngoài.</li>
<li><strong>Ký tự là con số:</strong> <code>c - '0'</code> cho giá trị chữ số, <code>'x'</code> chứ không phải <code>"x"</code>, <code>equals</code> cho String, và giữ lấy kết quả của mọi phương thức String.</li>
<li><strong>"Đầu tiên", "hoà", "không có":</strong> mỗi đề trả lời khác nhau — mẫu và câu chữ quyết định.</li>
<li><strong>Đề 10 điểm là read → solve → printResult</strong> trong một bộ khung không được làm vỡ: package q1, phần FIXED, hai tên file do máy chấm truyền vào.</li>
<li><strong>File input thật là file Windows dính dấu cách thừa:</strong> <code>nextLine().trim()</code> cho mọi thứ, <code>parseInt</code> thay vì <code>nextInt</code>.</li>
<li><strong>Output đi qua <code>fw.write</code>,</strong> nhãn chép từ mẫu — và khi chữ của đề với mẫu nói khác nhau, mẫu thắng.</li>
</ol>
<div class="callout">🧭 <strong>Đi tiếp — LAB211, Chương 9 và Spring Boot</strong>: đề 10 điểm là một chương trình LAB211 thu nhỏ: một model, một kho lưu, các lệnh đọc từ file. Chương 9 dạy các lớp file đứng sau <code>Scanner(new File(…))</code> và <code>FileWriter</code>; trong LabFlow, cùng bước "tách một dòng → lệnh → đối tượng" chính là việc một controller Spring làm với một HTTP request. Quay lại đầu: <strong>🎯 Luyện PE 1</strong> có kế hoạch 85 phút cho trọn một đề bốn câu — rồi làm một đề trong <a href="/exam?course=PRO192&amp;kind=PE">Exam Room</a> có bấm giờ.</div>`),
  ].join('\n'),
};

export default {
  extrasEnd: [L_x_luyen_pe_1, L_x_luyen_pe_2, L_x_luyen_pe_3, L_x_luyen_pe_4],
};
