/**
 * PRO192 — Object-Oriented Programming (Java, NetBeans). Kỳ 2. Tiên quyết: PRF192.
 * Bám giáo trình FLM (syl 12038): sách CHÍNH Core Java Vol 1&2 — Cay Horstmann
 * (Pearson 11th) + Java 8 Spec (Oracle) + học liệu FU; công cụ NetBeans/JDK.
 * KHUNG CHUẨN FLM 8 chương / 9 CLO:
 *  1 Introduction · 2 Basic Java language · 3 OOP · 4 Abstract class & Interface
 *  5 Error & Exception · 6 Array of Objects · 7 Collections · 8 File I/O.
 * Song ngữ EN/VI (khối .ml-en / .ml-vi). Code Java: <pre><code class="language-java">.
 * Giữ NGUYÊN slug/courseCode/semester/thumb(v3); syncOrder: true.
 * ⚠️ code: KHÔNG backtick, KHÔNG ${ }; escape & → &amp;, < → &lt;, > → &gt;.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/PRO192.mjs --apply
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 360, questions } });

/* ════════════════════ 📚 TÀI LIỆU THAM KHẢO ════════════════════ */
const taiLieu = doc('pro192-tai-lieu-tham-khao', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Sách chính Core Java (Horstmann) + Java 8 Spec + học liệu FU trên FLM, công cụ JDK/NetBeans, luyện code & lộ trình tự học.',
  [[
    `<span class="eyebrow">PRO192 · 📚 Reference hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">Everything for Object-Oriented Programming in Java — one place. The official FPTU textbook and lecture slides live on <strong>FLM</strong>; below are the main book, the language spec, and free, legal resources.</p>
<h3>📘 Main textbook (syllabus)</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Core Java Volume 1 &amp; 2 — Cay Horstmann (Pearson, 11th ed.)</div><div class="lz-ld">The definitive practical Java reference and the syllabus's main book. Volume 1 covers everything in this course; Volume 2 goes further (I/O, streams).</div></div>
  <div class="lz-layer"><div class="lz-lt">The Java Language Specification, Java SE 8 (Oracle)</div><div class="lz-ld">The authoritative rule book. This subject targets <strong>Java 8</strong> — check syntax here when in doubt.</div></div>
  <div class="lz-layer"><div class="lz-lt">FU "OOP using Java" materials</div><div class="lz-ld">The course-aligned learning resource, on FLM.</div></div>
</div>
<h3>🌐 Free official / legal resources</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — official PRO192 syllabus, slides &amp; textbook (log in with your FPTU account).</li>
<li><a href="https://dev.java/learn/" target="_blank" rel="noopener">dev.java — Learn Java</a> — Oracle's official tutorials.</li>
<li><a href="https://docs.oracle.com/javase/8/docs/api/" target="_blank" rel="noopener">Java 8 API documentation</a> — every class and method (String, ArrayList, HashMap…).</li>
</ul>
<h3>🛠️ Tools you need</h3>
<ul>
<li><a href="https://www.oracle.com/java/technologies/downloads/" target="_blank" rel="noopener">JDK (Java Development Kit) 8+</a> — the compiler (<code>javac</code>) and runtime (<code>java</code>).</li>
<li><a href="https://netbeans.apache.org/" target="_blank" rel="noopener">Apache NetBeans</a> — the IDE this course uses (build/run/debug built in).</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@coding.with.john" target="_blank" rel="noopener">Coding with John</a> — short, clear Java/OOP explanations.</li>
<li><a href="https://www.youtube.com/@BroCodez" target="_blank" rel="noopener">Bro Code — Java</a> — full beginner Java course.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation (exam core)</strong> — install JDK + NetBeans, then Java syntax, classes &amp; the four OOP pillars.</li>
<li><strong>Practice at the keyboard</strong> — retype every example and run it; 40% of the grade is you writing working Java.</li>
<li><strong>Go deeper</strong> — abstract classes &amp; interfaces, exceptions, object arrays, collections, file I/O.</li>
<li><strong>Job-ready</strong> — build one complete menu-driven program (entity + manager + file save) end to end.</li>
</ol></div>`,
    `<span class="eyebrow">PRO192 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Mọi thứ để học Lập trình hướng đối tượng bằng Java — gom về một chỗ. Giáo trình &amp; slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là sách chính, bản đặc tả ngôn ngữ, và nguồn miễn phí hợp pháp.</p>
<h3>📘 Sách chính (theo syllabus)</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Core Java Volume 1 &amp; 2 — Cay Horstmann (Pearson, bản 11)</div><div class="lz-ld">Tài liệu Java thực hành chuẩn mực và là sách chính của syllabus. Volume 1 phủ toàn bộ môn này; Volume 2 đi xa hơn (I/O, stream).</div></div>
  <div class="lz-layer"><div class="lz-lt">The Java Language Specification, Java SE 8 (Oracle)</div><div class="lz-ld">Cuốn luật gốc. Môn này nhắm <strong>Java 8</strong> — nghi ngờ cú pháp thì tra ở đây.</div></div>
  <div class="lz-layer"><div class="lz-lt">Học liệu "OOP using Java" của FU</div><div class="lz-ld">Tài nguyên học bám sát môn, trên FLM.</div></div>
</div>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — syllabus, slide &amp; giáo trình PRO192 chính thức (đăng nhập tài khoản FPTU).</li>
<li><a href="https://dev.java/learn/" target="_blank" rel="noopener">dev.java — Learn Java</a> — hướng dẫn chính thức của Oracle.</li>
<li><a href="https://docs.oracle.com/javase/8/docs/api/" target="_blank" rel="noopener">Tài liệu API Java 8</a> — mọi lớp &amp; phương thức (String, ArrayList, HashMap…).</li>
</ul>
<h3>🛠️ Công cụ bạn cần</h3>
<ul>
<li><a href="https://www.oracle.com/java/technologies/downloads/" target="_blank" rel="noopener">JDK (Java Development Kit) 8+</a> — trình biên dịch (<code>javac</code>) và runtime (<code>java</code>).</li>
<li><a href="https://netbeans.apache.org/" target="_blank" rel="noopener">Apache NetBeans</a> — IDE mà môn này dùng (build/run/debug tích hợp).</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@coding.with.john" target="_blank" rel="noopener">Coding with John</a> — giải thích Java/OOP ngắn gọn, rõ.</li>
<li><a href="https://www.youtube.com/@BroCodez" target="_blank" rel="noopener">Bro Code — Java</a> — khoá Java cho người mới đầy đủ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền (lõi thi)</strong> — cài JDK + NetBeans, rồi cú pháp Java, lớp &amp; bốn trụ cột OOP.</li>
<li><strong>Luyện ở bàn phím</strong> — gõ lại mọi ví dụ và chạy; 40% điểm là bạn viết Java chạy được.</li>
<li><strong>Đào sâu</strong> — abstract class &amp; interface, ngoại lệ, mảng đối tượng, collections, đọc/ghi tệp.</li>
<li><strong>Sẵn sàng đi làm</strong> — làm trọn một chương trình theo menu (entity + lớp quản lý + lưu tệp) đầu-cuối.</li>
</ol></div>`,
  ]]);

/* ════════════════════ GIỚI THIỆU MÔN HỌC ════════════════════ */
const intro = doc('pro192-gioi-thieu', 'Course overview: 9 CLOs & grading|||Tổng quan: 9 CLO & cấu trúc điểm',
  'Từ lập trình thủ tục (PRF192) sang hướng đối tượng với Java; 9 chuẩn đầu ra (CLO) và năm cột điểm (Assignment 20% · Lab 10% · Practical Exam 30% · Progress test 10% · Final 30%).',
  [[
    `<span class="eyebrow">PRO192 · Course introduction</span>
<h2>From procedures to objects</h2>
<p class="lead">In PRF192 you gave a computer step-by-step instructions in C. PRO192 teaches a new way to <strong>think</strong>: model your problem as a set of <strong>objects</strong> that hold their own data and know how to behave. This is <strong>object-oriented programming (OOP)</strong>, and the language is <strong>Java</strong> (built and run in NetBeans). Where PRF192 made you a programmer, PRO192 makes you a <em>software designer</em> — the prerequisite mindset for LAB211, PRJ301 and every later software course.</p>
<h3>Course map — the 8 FLM chapters</h3>
<div class="lz-map">
  <div class="lz-stage">Getting into Java</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Introduction</div><div class="lz-nsub">OO concepts · object terminology · install JDK/NetBeans</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Basic Java language</div><div class="lz-nsub">types · control · methods · Array/ArrayList · String · I/O</div></div></div>
  <div class="lz-stage">The heart of OOP</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">OOP</div><div class="lz-nsub">encapsulation · inheritance · polymorphism · abstraction</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Abstract class &amp; Interface</div><div class="lz-nsub">contracts for behavior</div></div></div>
  <div class="lz-stage">Robust, complete programs</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Error &amp; Exception</div><div class="lz-nsub">try/catch/finally · throw/throws · assertion</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Array of Objects</div><div class="lz-nsub">add · update · remove · sort · find</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Collections</div><div class="lz-nsub">List · Set · Map</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">File I/O</div><div class="lz-nsub">text/binary · object serialization</div></div></div>
</div>
<h3>The 9 Course Learning Outcomes (CLOs)</h3>
<table>
  <thead><tr><th>#</th><th>You will be able to…</th><th>Chapter</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Understand OO concepts to solve problems</td><td>1</td></tr>
    <tr><td>CLO2</td><td>Write Java programs (syntax &amp; semantics)</td><td>2</td></tr>
    <tr><td>CLO3</td><td>Use control statements &amp; methods correctly</td><td>2</td></tr>
    <tr><td>CLO4</td><td>Use Java's exception-handling mechanism</td><td>5</td></tr>
    <tr><td>CLO5</td><td>Identify classes, objects, members &amp; relationships</td><td>3</td></tr>
    <tr><td>CLO6</td><td>Use encapsulation, inheritance, polymorphism, abstraction</td><td>3</td></tr>
    <tr><td>CLO7</td><td>Use abstract classes and interfaces</td><td>3–4</td></tr>
    <tr><td>CLO8</td><td>Implement a complete program using object arrays</td><td>6</td></tr>
    <tr><td>CLO9</td><td>Use collection ADTs (list, set, map)</td><td>7</td></tr>
  </tbody>
</table>
<h3>Grade structure (syllabus)</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Assignment</td><td>20%</td><td>on-going, completion &gt; 0</td></tr>
    <tr><td>Lab</td><td>10%</td><td>on-going (6 labs), &gt; 0</td></tr>
    <tr><td>Practical Exam</td><td>30%</td><td>85 minutes at the keyboard, &gt; 0</td></tr>
    <tr><td>Progress Test</td><td>10%</td><td>2 tests, &gt; 0</td></tr>
    <tr><td>Final Exam</td><td>30%</td><td>50 multiple-choice questions, must reach &ge; 4/10</td></tr>
  </tbody>
</table>
<div class="callout warn">Two heavy practical gates: the <strong>Practical Exam alone is 30%</strong> and every on-going component has completion criterion <strong>&gt; 0</strong> — a single zero fails the subject. Pass when the weighted average is &ge; 5.0 <em>and</em> the Final is &ge; 4.0. The only preparation that works for the Practical Exam is writing lots of Java yourself.</div>
<div class="callout ok">OOP clicks through practice, not reading. For every concept in this course, write a small class and run it in NetBeans. To model a problem, list the <em>nouns</em> (they become classes) and the <em>verbs</em> (they become methods).</div>`,
    `<span class="eyebrow">PRO192 · Giới thiệu môn học</span>
<h2>Từ thủ tục sang đối tượng</h2>
<p class="lead">Ở PRF192 bạn ra lệnh cho máy tính từng bước bằng C. PRO192 dạy một cách <strong>tư duy</strong> mới: mô hình bài toán thành một tập <strong>đối tượng (object)</strong> tự giữ dữ liệu và biết cách hành xử. Đây là <strong>lập trình hướng đối tượng (OOP)</strong>, ngôn ngữ là <strong>Java</strong> (build &amp; chạy trong NetBeans). PRF192 biến bạn thành lập trình viên, PRO192 biến bạn thành <em>người thiết kế phần mềm</em> — tư duy tiên quyết cho LAB211, PRJ301 và mọi môn phần mềm sau này.</p>
<h3>Bản đồ môn học — 8 chương FLM</h3>
<div class="lz-map">
  <div class="lz-stage">Bước vào Java</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Giới thiệu</div><div class="lz-nsub">khái niệm OO · thuật ngữ đối tượng · cài JDK/NetBeans</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Java cơ bản</div><div class="lz-nsub">kiểu · điều khiển · phương thức · Array/ArrayList · String · I/O</div></div></div>
  <div class="lz-stage">Trái tim của OOP</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">OOP</div><div class="lz-nsub">đóng gói · kế thừa · đa hình · trừu tượng</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Abstract class &amp; Interface</div><div class="lz-nsub">hợp đồng cho hành vi</div></div></div>
  <div class="lz-stage">Chương trình bền, hoàn chỉnh</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Lỗi &amp; Ngoại lệ</div><div class="lz-nsub">try/catch/finally · throw/throws · assertion</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Mảng đối tượng</div><div class="lz-nsub">thêm · sửa · xoá · sắp xếp · tìm</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Collections</div><div class="lz-nsub">List · Set · Map</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Đọc/ghi tệp</div><div class="lz-nsub">text/binary · serialization đối tượng</div></div></div>
</div>
<h3>9 Chuẩn đầu ra môn học (CLO)</h3>
<table>
  <thead><tr><th>#</th><th>Bạn sẽ làm được…</th><th>Chương</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Hiểu các khái niệm OO để giải quyết vấn đề</td><td>1</td></tr>
    <tr><td>CLO2</td><td>Viết chương trình Java (cú pháp &amp; ngữ nghĩa)</td><td>2</td></tr>
    <tr><td>CLO3</td><td>Dùng đúng câu lệnh điều khiển &amp; phương thức</td><td>2</td></tr>
    <tr><td>CLO4</td><td>Dùng cơ chế xử lý ngoại lệ của Java</td><td>5</td></tr>
    <tr><td>CLO5</td><td>Nhận diện lớp, đối tượng, thành viên &amp; quan hệ</td><td>3</td></tr>
    <tr><td>CLO6</td><td>Dùng đóng gói, kế thừa, đa hình, trừu tượng</td><td>3</td></tr>
    <tr><td>CLO7</td><td>Dùng abstract class và interface</td><td>3–4</td></tr>
    <tr><td>CLO8</td><td>Cài đặt chương trình hoàn chỉnh dùng mảng đối tượng</td><td>6</td></tr>
    <tr><td>CLO9</td><td>Dùng các ADT collection (list, set, map)</td><td>7</td></tr>
  </tbody>
</table>
<h3>Cấu trúc điểm (syllabus)</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Assignment</td><td>20%</td><td>on-going, điều kiện &gt; 0</td></tr>
    <tr><td>Lab</td><td>10%</td><td>on-going (6 bài), &gt; 0</td></tr>
    <tr><td>Practical Exam</td><td>30%</td><td>85 phút gõ code, &gt; 0</td></tr>
    <tr><td>Progress Test</td><td>10%</td><td>2 bài, &gt; 0</td></tr>
    <tr><td>Final Exam</td><td>30%</td><td>50 câu trắc nghiệm, phải đạt &ge; 4/10</td></tr>
  </tbody>
</table>
<div class="callout warn">Hai cửa thực hành nặng: <strong>riêng Practical Exam đã 30%</strong> và mọi cột on-going có điều kiện hoàn thành <strong>&gt; 0</strong> — một điểm 0 là trượt môn. Qua môn khi trung bình có trọng số &ge; 5,0 <em>và</em> Final &ge; 4,0. Cách luyện duy nhất hiệu quả cho Practical Exam là tự viết thật nhiều Java.</div>
<div class="callout ok">OOP "thấm" qua luyện tập, không phải đọc. Với mỗi khái niệm trong môn, viết một lớp nhỏ và chạy trong NetBeans. Để mô hình một bài toán, liệt kê các <em>danh từ</em> (thành lớp) và các <em>động từ</em> (thành phương thức).</div>`,
  ]]);

/* ════════════════════ CHƯƠNG 1 — INTRODUCTION ════════════════════ */
const c1 = doc('pro192-1-1-gioi-thieu-oo', '1.1 — Welcome to OO: objects, classes & the JVM|||1.1 — Chào OO: đối tượng, lớp & JVM',
  'Vì sao đối tượng; thuật ngữ class/object/instance; bốn trụ cột; đối tượng đầu tiên; JVM & bytecode; cài JDK/NetBeans.',
  [[
    `<span class="eyebrow">PRO192 · Chapter 1 · Lesson 1.1</span>
<h2>Why objects? Procedural vs OO</h2>
<p class="lead">In C (PRF192) you thought <strong>procedurally</strong>: data in variables, and functions that act on it — kept separate. OOP (CLO1) bundles related <em>data</em> and <em>behavior</em> together into <strong>objects</strong>, built from blueprints called <strong>classes</strong>. As programs grow, keeping data and its behavior together is what keeps big systems buildable, reusable and maintainable.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Procedural (C): data and functions are separate</div><div class="lz-ld">A struct Student holds data; free functions like calcGPA(Student) act on it. As the program grows, it is easy to lose track of which function may touch which data.</div></div>
  <div class="lz-layer"><div class="lz-lt">Object-oriented (Java): data + behavior together</div><div class="lz-ld">A class Student holds both the data (name, grades) AND the methods (calculateGPA). The object owns and protects its own data.</div></div>
</div>
<h3>Object terminology</h3>
<p>A <strong>class</strong> is a blueprint; an <strong>object</strong> (an <em>instance</em>) is a concrete thing made from it. "Student" is a class; "the student named An with GPA 3.6" is an object. One class, many objects. Each object has <strong>state</strong> (its field values) and <strong>behavior</strong> (its methods), and a distinct <strong>identity</strong> in memory.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Class</div><div class="lz-t">blueprint</div><div class="lz-d">defines fields &amp; methods</div></div>
  <div class="lz-step"><div class="lz-k">new</div><div class="lz-t">create an object</div><div class="lz-d">an instance in memory</div></div>
  <div class="lz-step"><div class="lz-k">Object</div><div class="lz-t">concrete thing</div><div class="lz-d">its own data values</div></div>
</div>
<h3>Worked example — a first object</h3>
<pre><code class="language-java">public class Student {
    String name;
    double gpa;

    Student(String n, double g) { name = n; gpa = g; }

    boolean isPassing() { return gpa &gt;= 2.0; }   // behavior lives WITH the data
}

// in main:
Student an = new Student("An", 3.6);
System.out.println(an.name + " passing? " + an.isPassing());
</code></pre>
<div class="out"><b>Output:</b> An passing? true</div>
<p>The data (name, gpa) and the behavior (isPassing) travel together as one object — the essence of OO thinking.</p>
<div class="callout"><span class="badge">★ The four pillars are your roadmap</span> Everything in PRO192 rests on four ideas: <b>Encapsulation</b> (hide data), <b>Inheritance</b> (reuse), <b>Polymorphism</b> (one interface, many forms) and <b>Abstraction</b> (hide complexity) — all in Chapter 3. Every framework you will ever use (Spring, Android) is built from exactly these four. Memorise the names now and each chapter clicks into place.</div>
<div class="callout"><span class="badge">★ Write once, run anywhere — the JVM</span> Unlike C (which compiles straight to machine code for one CPU), <code>javac</code> compiles Java to <em>bytecode</em> (.class), which the <b>Java Virtual Machine</b> then runs on any OS. That extra layer is why the same .class file runs on Windows, macOS and Linux unchanged — the historical reason Java conquered enterprise and Android.</div>
<h3>Set up your tools</h3>
<p>Install the <strong>JDK 8+</strong> (compiler + runtime) and <strong>Apache NetBeans</strong> (the IDE this course uses). In NetBeans: <em>File → New Project → Java Application</em>, then run with the green ▶ button. Verify from a terminal with <code>java -version</code> and <code>javac -version</code>.</p>
<div class="callout ok">The mental shift: stop asking "what steps do I run?" and start asking "what things exist, what does each know, and what can each do?" Model the world as cooperating objects. This is the whole point of PRO192.</div>`,
    `<span class="eyebrow">PRO192 · Chương 1 · Bài 1.1</span>
<h2>Vì sao đối tượng? Thủ tục vs OO</h2>
<p class="lead">Trong C (PRF192) bạn tư duy <strong>thủ tục</strong>: dữ liệu ở biến, và hàm tác động lên nó — tách rời nhau. OOP (CLO1) gom <em>dữ liệu</em> và <em>hành vi</em> liên quan lại thành các <strong>đối tượng</strong>, xây từ khuôn mẫu gọi là <strong>lớp (class)</strong>. Khi chương trình lớn lên, giữ dữ liệu và hành vi ở cùng nhau là điều làm hệ thống lớn xây được, tái dùng được và bảo trì được.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Thủ tục (C): dữ liệu và hàm tách rời</div><div class="lz-ld">Một struct Student giữ dữ liệu; các hàm rời như calcGPA(Student) tác động lên nó. Khi chương trình lớn lên, dễ mất dấu hàm nào động tới dữ liệu nào.</div></div>
  <div class="lz-layer"><div class="lz-lt">Hướng đối tượng (Java): dữ liệu + hành vi ở cùng nhau</div><div class="lz-ld">Một lớp Student giữ cả dữ liệu (name, grades) LẪN các phương thức (calculateGPA). Đối tượng sở hữu và bảo vệ dữ liệu của chính nó.</div></div>
</div>
<h3>Thuật ngữ đối tượng</h3>
<p>Một <strong>lớp (class)</strong> là khuôn mẫu; một <strong>đối tượng (object)</strong> (một <em>thể hiện — instance</em>) là thứ cụ thể tạo từ nó. "Student" là một lớp; "sinh viên tên An với GPA 3.6" là một đối tượng. Một lớp, nhiều đối tượng. Mỗi đối tượng có <strong>trạng thái</strong> (giá trị các trường), <strong>hành vi</strong> (các phương thức) và một <strong>danh tính</strong> riêng trong bộ nhớ.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Lớp</div><div class="lz-t">khuôn mẫu</div><div class="lz-d">định nghĩa trường &amp; phương thức</div></div>
  <div class="lz-step"><div class="lz-k">new</div><div class="lz-t">tạo một đối tượng</div><div class="lz-d">một thể hiện trong bộ nhớ</div></div>
  <div class="lz-step"><div class="lz-k">Đối tượng</div><div class="lz-t">thứ cụ thể</div><div class="lz-d">giá trị dữ liệu riêng của nó</div></div>
</div>
<h3>Ví dụ có lời giải — đối tượng đầu tiên</h3>
<pre><code class="language-java">public class Student {
    String name;
    double gpa;

    Student(String n, double g) { name = n; gpa = g; }

    boolean isPassing() { return gpa &gt;= 2.0; }   // hành vi sống CÙNG dữ liệu
}

// trong main:
Student an = new Student("An", 3.6);
System.out.println(an.name + " passing? " + an.isPassing());
</code></pre>
<div class="out"><b>Kết quả:</b> An passing? true</div>
<p>Dữ liệu (name, gpa) và hành vi (isPassing) đi cùng nhau như một đối tượng — cốt lõi của tư duy OO.</p>
<div class="callout"><span class="badge">★ Bốn trụ cột là bản đồ của bạn</span> Mọi thứ trong PRO192 dựa trên bốn ý tưởng: <b>Đóng gói</b> (giấu dữ liệu), <b>Kế thừa</b> (tái dùng), <b>Đa hình</b> (một giao diện, nhiều hình dạng) và <b>Trừu tượng</b> (giấu độ phức tạp) — đều ở Chương 3. Mọi framework bạn từng dùng (Spring, Android) đều xây từ đúng bốn cái này. Thuộc tên ngay bây giờ và mỗi chương sẽ vào đúng chỗ.</div>
<div class="callout"><span class="badge">★ Viết một lần, chạy mọi nơi — JVM</span> Khác C (biên dịch thẳng ra mã máy cho một CPU), <code>javac</code> biên dịch Java thành <em>bytecode</em> (.class), rồi <b>Máy ảo Java (JVM)</b> chạy nó trên mọi hệ điều hành. Lớp trung gian đó là lý do cùng một file .class chạy trên Windows, macOS và Linux không đổi — lý do lịch sử khiến Java chinh phục doanh nghiệp và Android.</div>
<h3>Cài đặt công cụ</h3>
<p>Cài <strong>JDK 8+</strong> (trình biên dịch + runtime) và <strong>Apache NetBeans</strong> (IDE môn dùng). Trong NetBeans: <em>File → New Project → Java Application</em>, rồi chạy bằng nút ▶ xanh. Kiểm từ terminal bằng <code>java -version</code> và <code>javac -version</code>.</p>
<div class="callout ok">Chuyển dịch tư duy: thôi hỏi "tôi chạy các bước nào?" và bắt đầu hỏi "có những thứ gì tồn tại, mỗi thứ biết gì, và mỗi thứ làm được gì?" Mô hình thế giới thành các đối tượng hợp tác. Đây là toàn bộ mục đích của PRO192.</div>`,
  ]]);

const c1q = quiz('pro192-quiz-ch1', 'Chapter 1 Quiz|||Quiz chương 1', [
  { id: 'q1', points: 1, question: 'The main idea of OOP is to…|||Ý tưởng chính của OOP là…', options: ['keep data and functions separate|||giữ dữ liệu và hàm tách rời', 'bundle related data and behavior into objects|||gom dữ liệu và hành vi liên quan vào các đối tượng', 'avoid using functions|||tránh dùng hàm', 'only use global variables|||chỉ dùng biến toàn cục'], correctIndex: 1, explanation: 'OOP gom dữ liệu và hành vi liên quan vào cùng một đối tượng.|||OOP bundles related data and behavior into one object.' },
  { id: 'q2', points: 1, question: 'A class is a…, and an object is a…|||Một lớp là…, và một đối tượng là…', options: ['concrete instance … blueprint|||thể hiện cụ thể … khuôn mẫu', 'blueprint … concrete instance of it|||khuôn mẫu … thể hiện cụ thể của nó', 'function … variable|||hàm … biến', 'they are the same|||chúng như nhau'], correctIndex: 1, explanation: 'Lớp là khuôn mẫu; đối tượng là một thể hiện cụ thể tạo từ nó.|||A class is a blueprint; an object is a concrete instance of it.' },
  { id: 'q3', points: 1, question: 'javac compiles Java source to…, which the JVM runs.|||javac biên dịch mã nguồn Java thành…, rồi JVM chạy nó.', options: ['machine code for one CPU|||mã máy cho một CPU', 'bytecode (.class)|||bytecode (.class)', 'an .exe file|||một file .exe', 'assembly|||hợp ngữ'], correctIndex: 1, explanation: 'Java biên dịch ra bytecode (.class) — chạy trên mọi OS qua JVM.|||Java compiles to portable bytecode (.class), run on any OS by the JVM.' },
]);

/* ════════════════════ CHƯƠNG 2 — BASIC JAVA LANGUAGE ════════════════════ */
const c2a = doc('pro192-2-1-cu-phap-java', '2.1 — Syntax, types, control & methods|||2.1 — Cú pháp, kiểu, điều khiển & phương thức',
  'Cấu trúc file Java, kiểu nguyên thuỷ, điều khiển luồng, phương thức & truyền tham số (by value), nhập chuẩn Scanner, và bộ nhớ stack/heap.',
  [[
    `<span class="eyebrow">PRO192 · Chapter 2 · Lesson 2.1</span>
<h2>Your first Java program</h2>
<p class="lead">Java syntax (CLO2) looks familiar after C — same operators, same if/for/while — but everything lives <strong>inside a class</strong>, and there are no pointers to manage.</p>
<pre><code class="language-java">public class Hello {
    public static void main(String[] args) {
        System.out.println("Xin chao PRO192!");
    }
}
</code></pre>
<div class="out"><b>Output:</b> Xin chao PRO192!</div>
<h3>Primitive types &amp; key differences from C</h3>
<pre><code class="language-java">int age = 20;
double gpa = 3.6;
boolean passed = true;
char grade = 'A';
String name = "An";   // String is an object (a class), not a primitive
</code></pre>
<table>
  <thead><tr><th>C</th><th>Java</th></tr></thead>
  <tbody>
    <tr><td>Functions can be free-standing</td><td>Everything is inside a class</td></tr>
    <tr><td>printf(...)</td><td>System.out.println(...) / printf(...)</td></tr>
    <tr><td>Pointers &amp; manual malloc/free</td><td>References; automatic garbage collection</td></tr>
    <tr><td>char arrays for text</td><td>The String class (compare with .equals(), not ==)</td></tr>
    <tr><td>#include headers</td><td>import packages</td></tr>
  </tbody>
</table>
<h3>Control flow &amp; methods (parameter passing)</h3>
<p>if / switch / for / while are nearly identical to C. A <strong>method</strong> is a named block that may take parameters and return a value. Java passes arguments <strong>by value</strong>: a copy is passed, so reassigning a parameter inside a method does not change the caller's variable.</p>
<pre><code class="language-java">static int max(int a, int b) {    // method with two parameters
    return (a &gt; b) ? a : b;
}

public static void main(String[] args) {
    int[] diem = {8, 6, 9, 7};
    int tong = 0;
    for (int d : diem) tong += d;              // enhanced for-loop
    double tb = (double) tong / diem.length;   // cast to avoid integer division
    System.out.println("Tong = " + tong + ", TB = " + tb);
    System.out.println("Max(8,6) = " + max(8, 6));
}
</code></pre>
<div class="out"><b>Output:</b><br>Tong = 30, TB = 7.5<br>Max(8,6) = 8</div>
<h3>Standard input with Scanner</h3>
<pre><code class="language-java">import java.util.Scanner;

Scanner sc = new Scanner(System.in);
System.out.print("Ten: ");
String ten = sc.nextLine();
System.out.print("Tuoi: ");
int tuoi = sc.nextInt();
System.out.println(ten + " - " + tuoi);
</code></pre>
<div class="pitfall">Mixing <code>nextInt()</code> then <code>nextLine()</code> is a classic bug: <code>nextInt()</code> leaves the newline in the buffer, so the next <code>nextLine()</code> reads an empty string. Add an extra <code>sc.nextLine()</code> to consume it, or read everything as lines and parse.</div>
<div class="callout"><span class="badge">★ Dynamic memory: stack vs heap</span> A primitive local (<code>int age</code>) lives on the <strong>stack</strong>. An object created with <code>new</code> lives on the <strong>heap</strong>; the variable holds a <em>reference</em> to it. When no reference points to an object any more, the <strong>garbage collector</strong> reclaims it automatically — no <code>free()</code> like in C. That is why two variables set to the same object see each other's changes: they hold the same reference.</div>`,
    `<span class="eyebrow">PRO192 · Chương 2 · Bài 2.1</span>
<h2>Chương trình Java đầu tiên</h2>
<p class="lead">Cú pháp Java (CLO2) trông quen sau C — cùng toán tử, cùng if/for/while — nhưng mọi thứ nằm <strong>bên trong một lớp</strong>, và không có con trỏ để quản lý.</p>
<pre><code class="language-java">public class Hello {
    public static void main(String[] args) {
        System.out.println("Xin chao PRO192!");
    }
}
</code></pre>
<div class="out"><b>Kết quả:</b> Xin chao PRO192!</div>
<h3>Kiểu nguyên thuỷ &amp; khác biệt chính so với C</h3>
<pre><code class="language-java">int age = 20;
double gpa = 3.6;
boolean passed = true;
char grade = 'A';
String name = "An";   // String là đối tượng (một lớp), không phải kiểu nguyên thuỷ
</code></pre>
<table>
  <thead><tr><th>C</th><th>Java</th></tr></thead>
  <tbody>
    <tr><td>Hàm có thể đứng độc lập</td><td>Mọi thứ nằm trong một lớp</td></tr>
    <tr><td>printf(...)</td><td>System.out.println(...) / printf(...)</td></tr>
    <tr><td>Con trỏ &amp; malloc/free thủ công</td><td>Tham chiếu; tự động dọn rác</td></tr>
    <tr><td>Mảng char cho văn bản</td><td>Lớp String (so bằng .equals(), không phải ==)</td></tr>
    <tr><td>#include header</td><td>import package</td></tr>
  </tbody>
</table>
<h3>Điều khiển luồng &amp; phương thức (truyền tham số)</h3>
<p>if / switch / for / while gần như y hệt C. Một <strong>phương thức</strong> là một khối có tên, có thể nhận tham số và trả về giá trị. Java truyền đối số <strong>theo giá trị (by value)</strong>: một bản sao được truyền, nên gán lại tham số trong phương thức không đổi biến của hàm gọi.</p>
<pre><code class="language-java">static int max(int a, int b) {    // phương thức hai tham số
    return (a &gt; b) ? a : b;
}

public static void main(String[] args) {
    int[] diem = {8, 6, 9, 7};
    int tong = 0;
    for (int d : diem) tong += d;              // vòng for tăng cường
    double tb = (double) tong / diem.length;   // ép kiểu tránh chia nguyên
    System.out.println("Tong = " + tong + ", TB = " + tb);
    System.out.println("Max(8,6) = " + max(8, 6));
}
</code></pre>
<div class="out"><b>Kết quả:</b><br>Tong = 30, TB = 7.5<br>Max(8,6) = 8</div>
<h3>Nhập chuẩn với Scanner</h3>
<pre><code class="language-java">import java.util.Scanner;

Scanner sc = new Scanner(System.in);
System.out.print("Ten: ");
String ten = sc.nextLine();
System.out.print("Tuoi: ");
int tuoi = sc.nextInt();
System.out.println(ten + " - " + tuoi);
</code></pre>
<div class="pitfall">Trộn <code>nextInt()</code> rồi <code>nextLine()</code> là lỗi kinh điển: <code>nextInt()</code> để lại ký tự xuống dòng trong bộ đệm, nên <code>nextLine()</code> kế đọc phải chuỗi rỗng. Thêm một <code>sc.nextLine()</code> để "nuốt" nó, hoặc đọc tất cả bằng dòng rồi tự parse.</div>
<div class="callout"><span class="badge">★ Bộ nhớ động: stack vs heap</span> Biến nguyên thuỷ cục bộ (<code>int age</code>) nằm trên <strong>stack</strong>. Đối tượng tạo bằng <code>new</code> nằm trên <strong>heap</strong>; biến giữ một <em>tham chiếu</em> tới nó. Khi không còn tham chiếu nào trỏ tới, <strong>bộ dọn rác</strong> tự thu hồi — không có <code>free()</code> như C. Đó là lý do hai biến trỏ cùng một đối tượng thấy thay đổi của nhau: chúng giữ cùng một tham chiếu.</div>`,
  ]]);

const c2b = doc('pro192-2-2-array-string', '2.2 — Array, ArrayList, String & StringBuffer|||2.2 — Array, ArrayList, String & StringBuffer',
  'Mảng cố định vs ArrayList lớn lên được; String bất biến vs StringBuffer/StringBuilder đổi được tại chỗ.',
  [[
    `<span class="eyebrow">PRO192 · Chapter 2 · Lesson 2.2</span>
<h2>Arrays, ArrayList, and text</h2>
<h3>Array vs ArrayList</h3>
<p>An <strong>array</strong> has a fixed length chosen when you create it. An <strong>ArrayList</strong> (from <code>java.util</code>) grows and shrinks automatically and gives you <code>add</code>, <code>get</code>, <code>remove</code>, <code>size</code>.</p>
<pre><code class="language-java">int[] a = new int[3];          // fixed size 3
a[0] = 10;
System.out.println(a.length);   // 3  -- a field, not a method

import java.util.ArrayList;
ArrayList&lt;String&gt; names = new ArrayList&lt;&gt;();   // growable
names.add("An");
names.add("Binh");
names.add("Chi");
names.remove("Binh");
System.out.println(names.size() + " " + names.get(0));   // 2 An
</code></pre>
<div class="out"><b>Output:</b><br>3<br>2 An</div>
<table>
  <thead><tr><th></th><th>Array</th><th>ArrayList</th></tr></thead>
  <tbody>
    <tr><td>Size</td><td>fixed at creation</td><td>grows/shrinks</td></tr>
    <tr><td>Length</td><td><code>a.length</code> (field)</td><td><code>list.size()</code> (method)</td></tr>
    <tr><td>Element access</td><td><code>a[i]</code></td><td><code>list.get(i)</code></td></tr>
    <tr><td>Holds</td><td>primitives or objects</td><td>objects only (Integer, not int)</td></tr>
  </tbody>
</table>
<h3>String vs StringBuffer / StringBuilder</h3>
<p>A <strong>String</strong> is <em>immutable</em>: every "change" makes a new object. Building a big string in a loop with <code>+</code> creates lots of throw-away objects. <strong>StringBuffer</strong> (thread-safe) and <strong>StringBuilder</strong> (faster, single-thread) are mutable — they edit one buffer in place.</p>
<pre><code class="language-java">String s = "Ha";
s = s + "noi";        // a NEW String object; the old "Ha" is discarded

StringBuilder sb = new StringBuilder();
for (int i = 1; i &lt;= 3; i++) sb.append(i).append(",");
System.out.println(sb.toString());   // 1,2,3,
System.out.println("HANOI".toLowerCase().substring(0, 2));   // ha
</code></pre>
<div class="out"><b>Output:</b><br>1,2,3,<br>ha</div>
<div class="callout"><span class="badge">★ Why == is wrong for String</span> <code>==</code> compares <em>references</em> (same object?), not contents. Two Strings with the same letters can be different objects, so <code>a == b</code> may be <code>false</code> while <code>a.equals(b)</code> is <code>true</code>. Always compare String contents with <code>.equals()</code> (or <code>.equalsIgnoreCase()</code>). This is the most common beginner bug in Java.</div>
<div class="note-ct">Rule of thumb: fixed, known size and top speed → array. Unknown/changing count → ArrayList. Building text in a loop → StringBuilder. You will use all three constantly in the Practical Exam.</div>`,
    `<span class="eyebrow">PRO192 · Chương 2 · Bài 2.2</span>
<h2>Mảng, ArrayList và văn bản</h2>
<h3>Array vs ArrayList</h3>
<p>Một <strong>mảng (array)</strong> có độ dài cố định chọn lúc tạo. Một <strong>ArrayList</strong> (trong <code>java.util</code>) tự lớn lên/co lại và cho bạn <code>add</code>, <code>get</code>, <code>remove</code>, <code>size</code>.</p>
<pre><code class="language-java">int[] a = new int[3];          // cố định kích thước 3
a[0] = 10;
System.out.println(a.length);   // 3  -- một trường, không phải phương thức

import java.util.ArrayList;
ArrayList&lt;String&gt; names = new ArrayList&lt;&gt;();   // lớn lên được
names.add("An");
names.add("Binh");
names.add("Chi");
names.remove("Binh");
System.out.println(names.size() + " " + names.get(0));   // 2 An
</code></pre>
<div class="out"><b>Kết quả:</b><br>3<br>2 An</div>
<table>
  <thead><tr><th></th><th>Array</th><th>ArrayList</th></tr></thead>
  <tbody>
    <tr><td>Kích thước</td><td>cố định lúc tạo</td><td>lớn/co được</td></tr>
    <tr><td>Độ dài</td><td><code>a.length</code> (trường)</td><td><code>list.size()</code> (phương thức)</td></tr>
    <tr><td>Truy cập</td><td><code>a[i]</code></td><td><code>list.get(i)</code></td></tr>
    <tr><td>Chứa</td><td>nguyên thuỷ hoặc đối tượng</td><td>chỉ đối tượng (Integer, không phải int)</td></tr>
  </tbody>
</table>
<h3>String vs StringBuffer / StringBuilder</h3>
<p>Một <strong>String</strong> <em>bất biến (immutable)</em>: mỗi lần "đổi" tạo một đối tượng mới. Ghép một chuỗi lớn trong vòng lặp bằng <code>+</code> tạo rất nhiều đối tượng bỏ đi. <strong>StringBuffer</strong> (an toàn đa luồng) và <strong>StringBuilder</strong> (nhanh hơn, đơn luồng) đổi được — sửa một buffer tại chỗ.</p>
<pre><code class="language-java">String s = "Ha";
s = s + "noi";        // một String MỚI; "Ha" cũ bị bỏ

StringBuilder sb = new StringBuilder();
for (int i = 1; i &lt;= 3; i++) sb.append(i).append(",");
System.out.println(sb.toString());   // 1,2,3,
System.out.println("HANOI".toLowerCase().substring(0, 2));   // ha
</code></pre>
<div class="out"><b>Kết quả:</b><br>1,2,3,<br>ha</div>
<div class="callout"><span class="badge">★ Vì sao == sai với String</span> <code>==</code> so <em>tham chiếu</em> (cùng đối tượng?), không phải nội dung. Hai String cùng chữ có thể là hai đối tượng khác nhau, nên <code>a == b</code> có thể <code>false</code> trong khi <code>a.equals(b)</code> là <code>true</code>. Luôn so nội dung String bằng <code>.equals()</code> (hoặc <code>.equalsIgnoreCase()</code>). Đây là lỗi hay gặp nhất của người mới học Java.</div>
<div class="note-ct">Quy tắc ngón tay cái: kích thước cố định, biết trước và cần tốc độ → mảng. Số lượng chưa biết/thay đổi → ArrayList. Ghép văn bản trong vòng lặp → StringBuilder. Bạn sẽ dùng cả ba liên tục trong Practical Exam.</div>`,
  ]]);

const c2q = quiz('pro192-quiz-ch2', 'Chapter 2 Quiz|||Quiz chương 2', [
  { id: 'q1', points: 1, question: 'To compare the CONTENTS of two Strings in Java, use…|||Để so sánh NỘI DUNG hai String trong Java, dùng…', options: ['==', '.equals()', '&gt;', '.compare'], correctIndex: 1, explanation: '== so tham chiếu; .equals() so nội dung.|||== compares references; .equals() compares contents.' },
  { id: 'q2', points: 1, question: 'A key advantage of ArrayList over a plain array is that it…|||Ưu điểm chính của ArrayList so với mảng thường là nó…', options: ['is fixed-size|||cố định kích thước', 'grows and shrinks automatically|||tự lớn lên và co lại', 'cannot hold objects|||không chứa được đối tượng', 'is always faster|||luôn nhanh hơn'], correctIndex: 1, explanation: 'ArrayList lớn/co động; mảng cố định kích thước.|||ArrayList resizes dynamically; an array has a fixed size.' },
  { id: 'q3', points: 1, question: 'Java passes method arguments…|||Java truyền đối số phương thức…', options: ['by reference always|||luôn theo tham chiếu', 'by value (a copy)|||theo giá trị (một bản sao)', 'by pointer|||theo con trỏ', 'randomly|||ngẫu nhiên'], correctIndex: 1, explanation: 'Java truyền by value — bản sao của giá trị (với đối tượng là bản sao của tham chiếu).|||Java is pass-by-value — a copy of the value (for objects, a copy of the reference).' },
]);

/* ════════════════════ CHƯƠNG 3 — OOP ════════════════════ */
const c3a = doc('pro192-3-1-lop-doi-tuong', '3.1 — Classes, encapsulation & abstraction|||3.1 — Lớp, đóng gói & trừu tượng',
  'Định nghĩa lớp (data + function members), constructor & nạp chồng, this & constructor chaining, đóng gói với private + getter/setter, access modifiers, trừu tượng, sơ đồ lớp UML.',
  [[
    `<span class="eyebrow">PRO192 · Chapter 3 · Lesson 3.1</span>
<h2>Defining a class — data &amp; function members</h2>
<p class="lead">A class (CLO5) has <strong>fields</strong> (data members), <strong>methods</strong> (function members), and <strong>constructors</strong> that create and initialize objects.</p>
<pre><code class="language-java">public class Student {
    private String name;   // data members (kept private)
    private double gpa;

    public Student(String name, double gpa) {   // constructor
        this.name = name;    // 'this' = the object being built
        this.gpa = gpa;
    }
    public Student(String name) { this(name, 0.0); }   // constructor chaining via this(...)

    public double getGpa() { return gpa; }             // getter
    public void setGpa(double gpa) {                    // setter with validation
        if (gpa &gt;= 0 &amp;&amp; gpa &lt;= 4.0) this.gpa = gpa;
    }
    public boolean isPassing() { return gpa &gt;= 2.0; }  // behavior
    public String toString() { return name + " (" + gpa + ")"; }
}
</code></pre>
<h3>Encapsulation &amp; access modifiers (Pillar 1)</h3>
<p><strong>Encapsulation</strong> (CLO6) hides internal data and exposes it only through controlled methods. Make fields <code>private</code>, then provide getters/setters — so <code>setGpa(-9)</code> is rejected and the object protects its own invariants.</p>
<table>
  <thead><tr><th>Modifier</th><th>Visible to</th></tr></thead>
  <tbody>
    <tr><td>private</td><td>only this class</td></tr>
    <tr><td>(default / package)</td><td>the same package</td></tr>
    <tr><td>protected</td><td>package + subclasses</td></tr>
    <tr><td>public</td><td>everyone</td></tr>
  </tbody>
</table>
<h3>Abstraction (Pillar 4)</h3>
<p><strong>Abstraction</strong> exposes <em>what</em> an object does and hides <em>how</em>. You call <code>student.isPassing()</code> without knowing the internal logic — like driving a car without understanding the engine. Encapsulation hides the data; abstraction hides the complexity.</p>
<h3>Worked example</h3>
<pre><code class="language-java">Student an = new Student("An", 3.6);
an.setGpa(-9);                       // rejected by validation
System.out.println(an + " pass? " + an.isPassing());
</code></pre>
<div class="out"><b>Output:</b> An (3.6) pass? true</div>
<div class="callout"><span class="badge">Examinable</span> <b>this, constructor overloading &amp; chaining.</b> A class may have several constructors with different parameter lists (<em>overloading</em>) — Java picks the one matching your arguments. One constructor can call another with <code>this(...)</code> (chaining) to avoid repetition; it must be the <em>first</em> statement. Separate the two meanings of <code>this</code>: <code>this.field</code> (this object) vs <code>this(...)</code> (another constructor). If you write no constructor, Java supplies a hidden empty one — which disappears the moment you add your own.</div>
<div class="callout"><span class="badge">★ UML class diagram</span> A class is drawn as a box in three parts: <em>name</em> / <em>attributes</em> / <em>operations</em>. A minus sign means <code>private</code>, a plus sign <code>public</code>. So Student is: <code>- name: String</code>, <code>- gpa: double</code> / <code>+ getGpa(): double</code>, <code>+ isPassing(): boolean</code>. A line with an open arrow means "has-a" (association); a hollow triangle means "is-a" (inheritance, next lesson). Reading and sketching these is CLO5.</div>`,
    `<span class="eyebrow">PRO192 · Chương 3 · Bài 3.1</span>
<h2>Định nghĩa lớp — thành viên dữ liệu &amp; hàm</h2>
<p class="lead">Một lớp (CLO5) có <strong>trường (field)</strong> (thành viên dữ liệu), <strong>phương thức (method)</strong> (thành viên hàm), và <strong>constructor</strong> tạo và khởi tạo đối tượng.</p>
<pre><code class="language-java">public class Student {
    private String name;   // thành viên dữ liệu (để private)
    private double gpa;

    public Student(String name, double gpa) {   // constructor
        this.name = name;    // 'this' = đối tượng đang được tạo
        this.gpa = gpa;
    }
    public Student(String name) { this(name, 0.0); }   // constructor chaining qua this(...)

    public double getGpa() { return gpa; }             // getter
    public void setGpa(double gpa) {                    // setter có kiểm tra
        if (gpa &gt;= 0 &amp;&amp; gpa &lt;= 4.0) this.gpa = gpa;
    }
    public boolean isPassing() { return gpa &gt;= 2.0; }  // hành vi
    public String toString() { return name + " (" + gpa + ")"; }
}
</code></pre>
<h3>Đóng gói &amp; access modifier (Trụ cột 1)</h3>
<p><strong>Đóng gói</strong> (CLO6) giấu dữ liệu bên trong và chỉ lộ qua các phương thức có kiểm soát. Để trường <code>private</code>, rồi cung cấp getter/setter — nên <code>setGpa(-9)</code> bị từ chối và đối tượng bảo vệ bất biến của chính nó.</p>
<table>
  <thead><tr><th>Modifier</th><th>Thấy được bởi</th></tr></thead>
  <tbody>
    <tr><td>private</td><td>chỉ lớp này</td></tr>
    <tr><td>(mặc định / package)</td><td>cùng package</td></tr>
    <tr><td>protected</td><td>package + lớp con</td></tr>
    <tr><td>public</td><td>mọi nơi</td></tr>
  </tbody>
</table>
<h3>Trừu tượng (Trụ cột 4)</h3>
<p><strong>Trừu tượng</strong> lộ <em>cái gì</em> một đối tượng làm và giấu <em>làm sao</em>. Bạn gọi <code>student.isPassing()</code> mà không cần biết logic bên trong — như lái xe mà không cần hiểu động cơ. Đóng gói giấu dữ liệu; trừu tượng giấu độ phức tạp.</p>
<h3>Ví dụ có lời giải</h3>
<pre><code class="language-java">Student an = new Student("An", 3.6);
an.setGpa(-9);                       // bị kiểm tra từ chối
System.out.println(an + " pass? " + an.isPassing());
</code></pre>
<div class="out"><b>Kết quả:</b> An (3.6) pass? true</div>
<div class="callout"><span class="badge">Nằm trong phạm vi thi</span> <b>this, nạp chồng &amp; chaining constructor.</b> Một lớp có thể có nhiều constructor với danh sách tham số khác nhau (<em>overloading</em>) — Java chọn cái khớp đối số. Một constructor gọi được cái khác bằng <code>this(...)</code> (chaining) để tránh lặp; nó phải là câu lệnh <em>đầu tiên</em>. Phân biệt hai nghĩa của <code>this</code>: <code>this.field</code> (đối tượng này) vs <code>this(...)</code> (một constructor khác). Không viết constructor thì Java cấp một cái rỗng ẩn — biến mất ngay khi bạn thêm constructor riêng.</div>
<div class="callout"><span class="badge">★ Sơ đồ lớp UML</span> Một lớp vẽ thành một hộp ba phần: <em>tên</em> / <em>thuộc tính</em> / <em>thao tác</em>. Dấu trừ là <code>private</code>, dấu cộng là <code>public</code>. Vậy Student là: <code>- name: String</code>, <code>- gpa: double</code> / <code>+ getGpa(): double</code>, <code>+ isPassing(): boolean</code>. Đường mũi tên hở là "has-a" (kết hợp); tam giác rỗng là "is-a" (kế thừa, bài kế). Đọc và vẽ được những cái này là CLO5.</div>`,
  ]]);

const c3b = doc('pro192-3-2-ke-thua-da-hinh', '3.2 — Inheritance, polymorphism, overriding|||3.2 — Kế thừa, đa hình, ghi đè',
  'extends & super, quan hệ is-a, override vs overload, đa hình & dynamic dispatch, casting & instanceof.',
  [[
    `<span class="eyebrow">PRO192 · Chapter 3 · Lesson 3.2</span>
<h2>Inheritance (Pillar 2)</h2>
<p class="lead"><strong>Inheritance</strong> (CLO6) lets a new class reuse and extend an existing one — the "<strong>is-a</strong>" relationship. The subclass gets the parent's fields and methods, then adds or overrides.</p>
<pre><code class="language-java">public class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public void eat() { System.out.println(name + " is eating"); }
}

public class Cat extends Animal {    // Cat IS-A Animal
    public Cat(String name) { super(name); }   // call the parent constructor
    @Override
    public void eat() { System.out.println(name + " eats fish quietly"); }  // override
}

public class Dog extends Animal {
    public Dog(String name) { super(name); }
    public void bark() { System.out.println("Woof!"); }   // Dog-only behavior
}
</code></pre>
<p><code>super(...)</code> calls the parent constructor; <code>super.method()</code> calls the parent version. Java allows only <strong>single inheritance</strong> (one parent) — to combine behaviors you use interfaces (Chapter 4).</p>
<h3>Overriding vs overloading (examinable)</h3>
<table>
  <thead><tr><th></th><th>Overriding</th><th>Overloading</th></tr></thead>
  <tbody>
    <tr><td>Where</td><td>subclass redefines a parent method</td><td>same class, several methods same name</td></tr>
    <tr><td>Signature</td><td>identical (same name &amp; parameters)</td><td>different parameter lists</td></tr>
    <tr><td>Chosen at</td><td>runtime (dynamic)</td><td>compile time (static)</td></tr>
  </tbody>
</table>
<h3>Polymorphism (Pillar 3) &amp; dynamic dispatch</h3>
<pre><code class="language-java">Animal[] zoo = { new Dog("Rex"), new Cat("Miu"), new Dog("Bin") };
for (Animal a : zoo) {
    a.eat();   // each object runs ITS OWN version of eat()
}
</code></pre>
<div class="out"><b>Output:</b><br>Rex is eating<br>Miu eats fish quietly<br>Bin is eating</div>
<p>Even though the array is typed <code>Animal</code>, each object "remembers" its real class and runs the right <code>eat()</code>. This is <strong>dynamic dispatch</strong>: the method depends on the object's actual runtime type, not the reference type. Add a new subclass and the loop works unchanged.</p>
<div class="callout"><span class="badge">Examinable</span> <b>Casting &amp; instanceof.</b> To call a <code>Dog</code>-only method through an <code>Animal</code> reference, check then cast — on the Java 8 this subject targets, write them separately:
<pre><code class="language-java">for (Animal a : zoo) {
    if (a instanceof Dog) {
        Dog d = (Dog) a;   // safe downcast: the check already passed
        d.bark();
    }
}
</code></pre>
Downcasting without the check risks a <code>ClassCastException</code>. (Java 16 added <code>if (a instanceof Dog d)</code>, which folds the cast in — it does NOT compile on JDK 8, so do not use it in the exam.) Every class also secretly extends <code>java.lang.Object</code>, the source of <code>toString()</code>, <code>equals()</code> and <code>hashCode()</code>. The opposite of extensible is <code>final</code>: a final class cannot be subclassed, a final method cannot be overridden.</div>`,
    `<span class="eyebrow">PRO192 · Chương 3 · Bài 3.2</span>
<h2>Kế thừa (Trụ cột 2)</h2>
<p class="lead"><strong>Kế thừa</strong> (CLO6) cho một lớp mới tái dùng và mở rộng một lớp có sẵn — quan hệ "<strong>is-a</strong>". Lớp con nhận trường và phương thức của lớp cha, rồi thêm hoặc ghi đè.</p>
<pre><code class="language-java">public class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public void eat() { System.out.println(name + " is eating"); }
}

public class Cat extends Animal {    // Cat IS-A Animal
    public Cat(String name) { super(name); }   // gọi constructor cha
    @Override
    public void eat() { System.out.println(name + " eats fish quietly"); }  // ghi đè
}

public class Dog extends Animal {
    public Dog(String name) { super(name); }
    public void bark() { System.out.println("Woof!"); }   // hành vi riêng của Dog
}
</code></pre>
<p><code>super(...)</code> gọi constructor cha; <code>super.method()</code> gọi phiên bản của cha. Java chỉ cho <strong>kế thừa đơn</strong> (một lớp cha) — để kết hợp hành vi bạn dùng interface (Chương 4).</p>
<h3>Ghi đè vs nạp chồng (nằm trong phạm vi thi)</h3>
<table>
  <thead><tr><th></th><th>Overriding (ghi đè)</th><th>Overloading (nạp chồng)</th></tr></thead>
  <tbody>
    <tr><td>Ở đâu</td><td>lớp con định nghĩa lại một phương thức cha</td><td>cùng lớp, nhiều phương thức trùng tên</td></tr>
    <tr><td>Chữ ký</td><td>giống hệt (cùng tên &amp; tham số)</td><td>danh sách tham số khác nhau</td></tr>
    <tr><td>Chọn lúc</td><td>chạy (động)</td><td>biên dịch (tĩnh)</td></tr>
  </tbody>
</table>
<h3>Đa hình (Trụ cột 3) &amp; dynamic dispatch</h3>
<pre><code class="language-java">Animal[] zoo = { new Dog("Rex"), new Cat("Miu"), new Dog("Bin") };
for (Animal a : zoo) {
    a.eat();   // mỗi đối tượng chạy phiên bản eat() CỦA CHÍNH NÓ
}
</code></pre>
<div class="out"><b>Kết quả:</b><br>Rex is eating<br>Miu eats fish quietly<br>Bin is eating</div>
<p>Dù mảng có kiểu <code>Animal</code>, mỗi đối tượng "nhớ" lớp thật của nó và chạy đúng <code>eat()</code>. Đây là <strong>dynamic dispatch</strong>: phương thức phụ thuộc kiểu thật lúc chạy của đối tượng, không phải kiểu tham chiếu. Thêm một lớp con mới thì vòng lặp chạy không đổi.</p>
<div class="callout"><span class="badge">Nằm trong phạm vi thi</span> <b>Ép kiểu &amp; instanceof.</b> Để gọi một phương thức chỉ có ở <code>Dog</code> qua tham chiếu <code>Animal</code>, hãy kiểm rồi ép — trên Java 8 mà môn nhắm, viết tách rời:
<pre><code class="language-java">for (Animal a : zoo) {
    if (a instanceof Dog) {
        Dog d = (Dog) a;   // ép xuống an toàn: đã kiểm ở trên
        d.bark();
    }
}
</code></pre>
Ép xuống mà không kiểm dễ gây <code>ClassCastException</code>. (Java 16 thêm <code>if (a instanceof Dog d)</code> gộp phép ép vào — KHÔNG biên dịch trên JDK 8, đừng dùng khi thi.) Mọi lớp cũng âm thầm kế thừa <code>java.lang.Object</code>, nguồn của <code>toString()</code>, <code>equals()</code> và <code>hashCode()</code>. Ngược với "mở rộng được" là <code>final</code>: lớp final không kế thừa được, phương thức final không ghi đè được.</div>`,
  ]]);

const c3q = quiz('pro192-quiz-ch3', 'Chapter 3 Quiz|||Quiz chương 3', [
  { id: 'q1', points: 1, question: 'Making a field private and adding getters/setters is called…|||Để một trường private và thêm getter/setter gọi là…', options: ['inheritance|||kế thừa', 'encapsulation|||đóng gói', 'polymorphism|||đa hình', 'overloading|||nạp chồng'], correctIndex: 1, explanation: 'Giấu dữ liệu sau private + phương thức có kiểm soát = đóng gói.|||Hiding data behind private + controlled methods is encapsulation.' },
  { id: 'q2', points: 1, question: 'Dynamic dispatch means the method that runs depends on…|||Dynamic dispatch nghĩa là phương thức chạy phụ thuộc vào…', options: ['the reference type|||kiểu tham chiếu', 'the object actual runtime type|||kiểu thật lúc chạy của đối tượng', 'the file name|||tên file', 'the compiler|||trình biên dịch'], correctIndex: 1, explanation: 'Đa hình chọn phương thức theo lớp thật của đối tượng lúc chạy.|||Polymorphism picks the method by the object real class at runtime.' },
  { id: 'q3', points: 1, question: 'Before downcasting an Animal reference to Dog on JDK 8 you should…|||Trước khi ép xuống một tham chiếu Animal thành Dog trên JDK 8 bạn nên…', options: ['nothing, just cast|||không cần gì, cứ ép', 'check with instanceof first|||kiểm bằng instanceof trước', 'use == to compare|||dùng == để so', 'make Dog final|||để Dog là final'], correctIndex: 1, explanation: 'Kiểm instanceof trước để tránh ClassCastException.|||Check instanceof first to avoid a ClassCastException.' },
]);

/* ════════════════════ CHƯƠNG 4 — ABSTRACT CLASS & INTERFACE ════════════════════ */
const c4 = doc('pro192-4-1-abstract-interface', '4.1 — Abstract classes & interfaces|||4.1 — Abstract class & interface',
  'Hợp đồng cho hành vi: abstract class (is-a có code chung) vs interface (can-do, implements nhiều), Comparable, default method.',
  [[
    `<span class="eyebrow">PRO192 · Chapter 4 · Lesson 4.1</span>
<h2>Contracts for behavior</h2>
<p class="lead">Sometimes you define <em>what</em> a group of classes must do without saying <em>how</em> (CLO7). Two tools: <strong>abstract classes</strong> and <strong>interfaces</strong>.</p>
<h3>Abstract class</h3>
<p>An <strong>abstract class</strong> cannot be instantiated (no <code>new</code>). It can hold finished methods and <strong>abstract methods</strong> (declared, not implemented) that subclasses must fill in.</p>
<pre><code class="language-java">public abstract class Shape {
    public abstract double area();   // no body — subclasses must implement
    public void describe() { System.out.println("Area = " + area()); }
}
public class Circle extends Shape {
    private double r;
    public Circle(double r) { this.r = r; }
    public double area() { return 3.14159 * r * r; }
}
public class Rectangle extends Shape {
    private double w, h;
    public Rectangle(double w, double h) { this.w = w; this.h = h; }
    public double area() { return w * h; }
}
</code></pre>
<h3>Interface</h3>
<p>An <strong>interface</strong> is a pure contract — method signatures a class promises to implement. A class can <code>implements</code> many interfaces (working around single inheritance).</p>
<pre><code class="language-java">public interface Payable {          // a contract we write ourselves
    double monthlyPay();
}
public class Employee implements Payable, Comparable&lt;Employee&gt; {
    private double salary;
    public Employee(double salary) { this.salary = salary; }
    public double monthlyPay() { return salary; }            // from Payable
    public int compareTo(Employee o) {                        // from Comparable (JDK)
        return Double.compare(this.salary, o.salary);
    }
}
</code></pre>
<p>Java ships interfaces you <em>implement</em> rather than write. The first is <code>java.lang.Comparable&lt;T&gt;</code> with one method <code>int compareTo(T other)</code> — implement it and <code>Collections.sort</code> can sort your objects.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Abstract class — "is-a" with shared code</div><div class="lz-ld">Use when subclasses share fields/implementation. One parent only.</div></div>
  <div class="lz-layer"><div class="lz-lt">Interface — "can-do" capability</div><div class="lz-ld">Use to give unrelated classes a shared ability. A class can implement many.</div></div>
</div>
<h3>Worked example</h3>
<pre><code class="language-java">Shape[] shapes = { new Circle(2), new Rectangle(3, 4) };
for (Shape s : shapes) s.describe();   // describe() calls each shape's own area()
</code></pre>
<div class="out"><b>Output:</b><br>Area = 12.56636<br>Area = 12.0</div>
<div class="callout"><span class="badge">Examinable · default methods</span> Since Java 8 an interface can carry a <code>default</code> method with a real body, so new behavior can be added without breaking the classes that already implement it — that is how <code>java.util.List</code> gained <code>sort()</code>. Rule now: <b>interface for capability, abstract class for shared state.</b></div>
<div class="note-ct">Rule of thumb: an abstract class says "a Circle IS-A Shape"; an interface says "an Employee CAN-DO being paid and, via Comparable, being sorted". Both enable polymorphism.</div>`,
    `<span class="eyebrow">PRO192 · Chương 4 · Bài 4.1</span>
<h2>Hợp đồng cho hành vi</h2>
<p class="lead">Đôi khi bạn định nghĩa <em>cái gì</em> một nhóm lớp phải làm mà không nói <em>làm sao</em> (CLO7). Hai công cụ: <strong>abstract class</strong> và <strong>interface</strong>.</p>
<h3>Abstract class (lớp trừu tượng)</h3>
<p>Một <strong>abstract class</strong> không thể tạo thể hiện (không <code>new</code>). Nó chứa được cả phương thức hoàn thiện lẫn <strong>phương thức trừu tượng</strong> (khai báo, chưa cài đặt) mà lớp con phải điền.</p>
<pre><code class="language-java">public abstract class Shape {
    public abstract double area();   // không thân — lớp con phải cài đặt
    public void describe() { System.out.println("Area = " + area()); }
}
public class Circle extends Shape {
    private double r;
    public Circle(double r) { this.r = r; }
    public double area() { return 3.14159 * r * r; }
}
public class Rectangle extends Shape {
    private double w, h;
    public Rectangle(double w, double h) { this.w = w; this.h = h; }
    public double area() { return w * h; }
}
</code></pre>
<h3>Interface</h3>
<p>Một <strong>interface</strong> là hợp đồng thuần — các chữ ký phương thức mà lớp hứa hiện thực. Một lớp <code>implements</code> được nhiều interface (vòng qua giới hạn kế thừa đơn).</p>
<pre><code class="language-java">public interface Payable {          // hợp đồng do ta tự viết
    double monthlyPay();
}
public class Employee implements Payable, Comparable&lt;Employee&gt; {
    private double salary;
    public Employee(double salary) { this.salary = salary; }
    public double monthlyPay() { return salary; }            // từ Payable
    public int compareTo(Employee o) {                        // từ Comparable (JDK)
        return Double.compare(this.salary, o.salary);
    }
}
</code></pre>
<p>Java có sẵn những interface bạn <em>implements</em> chứ không tự viết. Cái đầu tiên là <code>java.lang.Comparable&lt;T&gt;</code> với một phương thức <code>int compareTo(T other)</code> — hiện thực nó và <code>Collections.sort</code> sắp xếp được đối tượng của bạn.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Abstract class — "is-a" có code dùng chung</div><div class="lz-ld">Dùng khi các lớp con chia sẻ trường/cài đặt. Chỉ một lớp cha.</div></div>
  <div class="lz-layer"><div class="lz-lt">Interface — khả năng "can-do"</div><div class="lz-ld">Dùng để cho các lớp không liên quan một khả năng chung. Một lớp implements được nhiều.</div></div>
</div>
<h3>Ví dụ có lời giải</h3>
<pre><code class="language-java">Shape[] shapes = { new Circle(2), new Rectangle(3, 4) };
for (Shape s : shapes) s.describe();   // describe() gọi area() riêng của mỗi hình
</code></pre>
<div class="out"><b>Kết quả:</b><br>Area = 12.56636<br>Area = 12.0</div>
<div class="callout"><span class="badge">Thi · default method</span> Từ Java 8 một interface có thể mang phương thức <code>default</code> có thân thật, nên thêm được hành vi mới mà không phá các lớp đã implements — đó là cách <code>java.util.List</code> có <code>sort()</code>. Quy tắc nay: <b>interface cho khả năng, abstract class cho trạng thái dùng chung.</b></div>
<div class="note-ct">Quy tắc ngón tay cái: abstract class nói "một Circle LÀ MỘT Shape"; interface nói "một Employee CÓ THỂ được trả tiền, và qua Comparable thì được sắp xếp". Cả hai bật đa hình.</div>`,
  ]]);

const c4q = quiz('pro192-quiz-ch4', 'Chapter 4 Quiz|||Quiz chương 4', [
  { id: 'q1', points: 1, question: 'An abstract class…|||Một abstract class…', options: ['can be instantiated with new|||có thể tạo thể hiện bằng new', 'cannot be instantiated and may have abstract methods|||không thể tạo thể hiện và có thể có phương thức trừu tượng', 'has no methods|||không có phương thức', 'is the same as an object|||giống một đối tượng'], correctIndex: 1, explanation: 'Không new được; có thể chứa phương thức trừu tượng lớp con phải cài.|||Cannot be instantiated; may declare abstract methods subclasses must implement.' },
  { id: 'q2', points: 1, question: 'How many interfaces can a Java class implement?|||Một lớp Java implements được bao nhiêu interface?', options: ['only one|||chỉ một', 'many|||nhiều', 'zero|||không', 'exactly two|||đúng hai'], correctIndex: 1, explanation: 'Một lớp implements nhiều interface — vòng qua kế thừa đơn.|||A class can implement many interfaces — working around single inheritance.' },
  { id: 'q3', points: 1, question: 'Since Java 8, an interface method WITH a body is a…|||Từ Java 8, một phương thức interface CÓ thân là…', options: ['abstract method|||phương thức trừu tượng', 'default method|||phương thức default', 'constructor|||constructor', 'private field|||trường private'], correctIndex: 1, explanation: 'default method cho interface có hành vi sẵn mà không phá lớp cũ.|||A default method gives an interface ready behavior without breaking existing classes.' },
]);

/* ════════════════════ CHƯƠNG 5 — ERROR & EXCEPTION ════════════════════ */
const c5 = doc('pro192-5-1-ngoai-le', '5.1 — Exceptions: try/catch/finally, throw & assertion|||5.1 — Ngoại lệ: try/catch/finally, throw & assertion',
  'Xử lý lỗi lúc chạy gọn gàng; checked vs unchecked; throw/throws; try-with-resources; assertion.',
  [[
    `<span class="eyebrow">PRO192 · Chapter 5 · Lesson 5.1</span>
<h2>Handling errors gracefully</h2>
<p class="lead">Programs fail: a file is missing, input is invalid. Java's <strong>exception handling</strong> (CLO4) lets you catch problems and respond instead of crashing.</p>
<pre><code class="language-java">try {
    int result = 10 / 0;        // throws ArithmeticException
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero!");
} finally {
    System.out.println("This always runs (cleanup)");
}
</code></pre>
<div class="out"><b>Output:</b><br>Cannot divide by zero!<br>This always runs (cleanup)</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">try</div><div class="lz-t">risky code</div><div class="lz-d">might throw an exception</div></div>
  <div class="lz-step"><div class="lz-k">catch</div><div class="lz-t">handle it</div><div class="lz-d">respond to the error</div></div>
  <div class="lz-step"><div class="lz-k">finally</div><div class="lz-t">always runs</div><div class="lz-d">cleanup (close files etc.)</div></div>
</div>
<h3>Checked vs unchecked; throw / throws</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Checked (e.g. IOException)</div><div class="lz-ld">The compiler forces you to handle or declare them with <code>throws</code>. For recoverable, expected problems like file access.</div></div>
  <div class="lz-layer"><div class="lz-lt">Unchecked (e.g. NullPointerException, ArithmeticException)</div><div class="lz-ld">Runtime bugs the compiler does not force you to catch — usually you fix the code.</div></div>
</div>
<pre><code class="language-java">// throws: declare that this method may raise a checked exception
static void checkAge(int age) throws Exception {
    if (age &lt; 0) throw new Exception("Age cannot be negative");   // raise your own
}
</code></pre>
<h3>Worked example — skip bad input</h3>
<pre><code class="language-java">String[] inputs = {"12", "9x", "7"};
int tong = 0;
for (String s : inputs) {
    try { tong += Integer.parseInt(s); }
    catch (NumberFormatException e) { System.out.println("Bo qua gia tri sai: " + s); }
}
System.out.println("Tong hop le = " + tong);
</code></pre>
<div class="out"><b>Output:</b><br>Bo qua gia tri sai: 9x<br>Tong hop le = 19</div>
<p>The bad value throws, is caught, and the loop keeps going — robustness in one pattern.</p>
<div class="callout"><span class="badge">★ try-with-resources</span> Writing <code>try (BufferedReader r = new BufferedReader(...)) { ... }</code> auto-closes the resource when the block ends, even on an exception — no <code>finally</code> needed. Any object implementing <code>AutoCloseable</code> works this way (you will use it in Chapter 8).</div>
<div class="callout"><span class="badge">Syllabus · assertion</span> An <strong>assertion</strong> checks a condition you believe is always true: <code>assert gpa &gt;= 0 : "gpa must be non-negative";</code>. If it fails, an <code>AssertionError</code> is thrown. Assertions are for catching programmer bugs during development (run with <code>java -ea</code>), NOT for validating user input — use exceptions for that.</div>`,
    `<span class="eyebrow">PRO192 · Chương 5 · Bài 5.1</span>
<h2>Xử lý lỗi gọn gàng</h2>
<p class="lead">Chương trình sẽ gặp lỗi: thiếu tệp, nhập không hợp lệ. <strong>Xử lý ngoại lệ</strong> của Java (CLO4) cho bạn bắt vấn đề và phản hồi thay vì sập.</p>
<pre><code class="language-java">try {
    int result = 10 / 0;        // ném ArithmeticException
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero!");
} finally {
    System.out.println("This always runs (cleanup)");
}
</code></pre>
<div class="out"><b>Kết quả:</b><br>Cannot divide by zero!<br>This always runs (cleanup)</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">try</div><div class="lz-t">code rủi ro</div><div class="lz-d">có thể ném ngoại lệ</div></div>
  <div class="lz-step"><div class="lz-k">catch</div><div class="lz-t">bắt &amp; xử lý</div><div class="lz-d">phản hồi lỗi</div></div>
  <div class="lz-step"><div class="lz-k">finally</div><div class="lz-t">luôn chạy</div><div class="lz-d">dọn dẹp (đóng tệp…)</div></div>
</div>
<h3>Checked vs unchecked; throw / throws</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Checked (vd IOException)</div><div class="lz-ld">Trình biên dịch buộc bạn xử lý hoặc khai báo bằng <code>throws</code>. Cho vấn đề dự kiến, khắc phục được như truy cập tệp.</div></div>
  <div class="lz-layer"><div class="lz-lt">Unchecked (vd NullPointerException, ArithmeticException)</div><div class="lz-ld">Lỗi lúc chạy mà trình biên dịch không bắt catch — thường bạn sửa code.</div></div>
</div>
<pre><code class="language-java">// throws: khai báo rằng phương thức này có thể phát một ngoại lệ checked
static void checkAge(int age) throws Exception {
    if (age &lt; 0) throw new Exception("Age cannot be negative");   // tự phát ngoại lệ
}
</code></pre>
<h3>Ví dụ có lời giải — bỏ qua dữ liệu sai</h3>
<pre><code class="language-java">String[] inputs = {"12", "9x", "7"};
int tong = 0;
for (String s : inputs) {
    try { tong += Integer.parseInt(s); }
    catch (NumberFormatException e) { System.out.println("Bo qua gia tri sai: " + s); }
}
System.out.println("Tong hop le = " + tong);
</code></pre>
<div class="out"><b>Kết quả:</b><br>Bo qua gia tri sai: 9x<br>Tong hop le = 19</div>
<p>Giá trị sai ném lỗi, bị bắt, và vòng lặp chạy tiếp — tính bền trong một mẫu.</p>
<div class="callout"><span class="badge">★ try-with-resources</span> Viết <code>try (BufferedReader r = new BufferedReader(...)) { ... }</code> tự đóng tài nguyên khi hết khối, kể cả khi có ngoại lệ — không cần <code>finally</code>. Mọi đối tượng implements <code>AutoCloseable</code> đều chạy kiểu này (bạn dùng ở Chương 8).</div>
<div class="callout"><span class="badge">Syllabus · assertion</span> Một <strong>assertion</strong> kiểm một điều kiện bạn tin luôn đúng: <code>assert gpa &gt;= 0 : "gpa must be non-negative";</code>. Sai thì ném <code>AssertionError</code>. Assertion để bắt lỗi lập trình lúc phát triển (chạy với <code>java -ea</code>), KHÔNG dùng để validate input người dùng — cái đó dùng ngoại lệ.</div>`,
  ]]);

const c5q = quiz('pro192-quiz-ch5', 'Chapter 5 Quiz|||Quiz chương 5', [
  { id: 'q1', points: 1, question: 'The finally block…|||Khối finally…', options: ['runs only if there is an error|||chỉ chạy nếu có lỗi', 'always runs (used for cleanup)|||luôn chạy (dùng để dọn dẹp)', 'never runs|||không bao giờ chạy', 'catches the exception|||bắt ngoại lệ'], correctIndex: 1, explanation: 'finally luôn chạy dù có hay không có ngoại lệ — dùng để dọn dẹp.|||finally always runs whether or not an exception occurs — for cleanup.' },
  { id: 'q2', points: 1, question: 'A checked exception is one that…|||Ngoại lệ checked là loại mà…', options: ['the compiler forces you to handle or declare|||trình biên dịch buộc bạn xử lý hoặc khai báo', 'never happens|||không bao giờ xảy ra', 'cannot be caught|||không thể bắt', 'is always fatal|||luôn gây chết chương trình'], correctIndex: 0, explanation: 'Checked: phải catch hoặc khai báo throws (vd IOException).|||Checked: must be caught or declared with throws (e.g. IOException).' },
  { id: 'q3', points: 1, question: 'assert is intended for…|||assert dùng để…', options: ['validating user input|||validate input người dùng', 'catching programmer bugs during development|||bắt lỗi lập trình lúc phát triển', 'closing files|||đóng tệp', 'printing output|||in kết quả'], correctIndex: 1, explanation: 'Assertion bắt giả định sai lúc dev; validate input thì dùng ngoại lệ.|||Assertions catch wrong assumptions in dev; validate input with exceptions.' },
]);

/* ════════════════════ CHƯƠNG 6 — ARRAY OF OBJECTS ════════════════════ */
const c6 = doc('pro192-6-1-mang-doi-tuong', '6.1 — Array of objects: add, find, update, remove, sort|||6.1 — Mảng đối tượng: thêm, tìm, sửa, xoá, sắp xếp',
  'Quản lý một tập đối tượng bằng ArrayList; chương trình theo menu CLO8; sort bằng Comparator.',
  [[
    `<span class="eyebrow">PRO192 · Chapter 6 · Lesson 6.1</span>
<h2>From one object to a program</h2>
<p class="lead">Real programs manage <em>many</em> objects (CLO8). A list of objects is the backbone of a console management program: add, display, find, update, remove, sort.</p>
<pre><code class="language-java">import java.util.ArrayList;

ArrayList&lt;Student&gt; list = new ArrayList&lt;&gt;();
list.add(new Student("An", 3.6));
list.add(new Student("Binh", 3.1));
list.add(new Student("Chi", 2.8));

// FIND by name
Student found = null;
for (Student s : list) if (s.getName().equals("Binh")) { found = s; break; }

// UPDATE
if (found != null) found.setGpa(3.9);

// REMOVE
list.removeIf(s -&gt; s.getGpa() &lt; 3.0);   // drops Chi

System.out.println("Con lai: " + list.size());
for (Student s : list) System.out.println(s);
</code></pre>
<div class="out"><b>Output:</b><br>Con lai: 2<br>An (3.6)<br>Binh (3.9)</div>
<h3>The shape of a management program</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Store</div><div class="lz-nsub">an ArrayList of objects</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Menu loop</div><div class="lz-nsub">Add · Display · Find · Update · Remove · Sort · Exit</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">One method per action</div><div class="lz-nsub">one method does one job</div></div></div>
</div>
<h3>Sorting by a field — Comparator</h3>
<pre><code class="language-java">import java.util.Comparator;
import java.util.Collections;

// sort by GPA, highest first
list.sort(Comparator.comparingDouble(Student::getGpa).reversed());
for (Student s : list) System.out.println(s);
</code></pre>
<div class="out"><b>Output:</b><br>An (3.6)<br>Binh (3.9)  →  sorted desc: Binh (3.9), An (3.6)</div>
<div class="callout"><span class="badge">★ Aggregate &amp; filter</span> Every "report" feature is the same loop with a different question: <code>sum</code>/<code>average</code> (aggregate), <code>count where gpa &gt;= 2.0</code> (filter), <code>max</code> (find best). Master the loop-over-objects skeleton and you can build any menu feature the Assignment or Practical Exam asks for.</div>
<div class="note-ct">This is exactly the shape of your PRO192 Assignment and Practical Exam: a menu-driven program managing a collection of objects. An <code>ArrayList</code> grows as you add — no fixed size to guess, unlike a plain array. The next chapter formalises List / Set / Map.</div>`,
    `<span class="eyebrow">PRO192 · Chương 6 · Bài 6.1</span>
<h2>Từ một đối tượng tới một chương trình</h2>
<p class="lead">Chương trình thật quản lý <em>nhiều</em> đối tượng (CLO8). Một list đối tượng là xương sống của một chương trình quản lý console: thêm, hiển thị, tìm, sửa, xoá, sắp xếp.</p>
<pre><code class="language-java">import java.util.ArrayList;

ArrayList&lt;Student&gt; list = new ArrayList&lt;&gt;();
list.add(new Student("An", 3.6));
list.add(new Student("Binh", 3.1));
list.add(new Student("Chi", 2.8));

// TÌM theo tên
Student found = null;
for (Student s : list) if (s.getName().equals("Binh")) { found = s; break; }

// SỬA
if (found != null) found.setGpa(3.9);

// XOÁ
list.removeIf(s -&gt; s.getGpa() &lt; 3.0);   // bỏ Chi

System.out.println("Con lai: " + list.size());
for (Student s : list) System.out.println(s);
</code></pre>
<div class="out"><b>Kết quả:</b><br>Con lai: 2<br>An (3.6)<br>Binh (3.9)</div>
<h3>Hình dạng một chương trình quản lý</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Lưu</div><div class="lz-nsub">một ArrayList đối tượng</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Vòng lặp menu</div><div class="lz-nsub">Thêm · Hiện · Tìm · Sửa · Xoá · Sắp xếp · Thoát</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Mỗi hành động một phương thức</div><div class="lz-nsub">một phương thức làm một việc</div></div></div>
</div>
<h3>Sắp xếp theo một trường — Comparator</h3>
<pre><code class="language-java">import java.util.Comparator;
import java.util.Collections;

// sắp theo GPA, cao nhất trước
list.sort(Comparator.comparingDouble(Student::getGpa).reversed());
for (Student s : list) System.out.println(s);
</code></pre>
<div class="out"><b>Kết quả:</b><br>An (3.6)<br>Binh (3.9)  →  sắp giảm: Binh (3.9), An (3.6)</div>
<div class="callout"><span class="badge">★ Tổng hợp &amp; lọc</span> Mọi tính năng "báo cáo" đều là cùng vòng lặp với câu hỏi khác: <code>tổng</code>/<code>trung bình</code> (tổng hợp), <code>đếm nơi gpa &gt;= 2.0</code> (lọc), <code>max</code> (tìm cao nhất). Nắm bộ khung duyệt-qua-đối-tượng là xây được mọi tính năng menu mà Assignment hay Practical Exam yêu cầu.</div>
<div class="note-ct">Đây đúng hình dạng Assignment và Practical Exam PRO192: một chương trình theo menu quản lý một tập đối tượng. Một <code>ArrayList</code> lớn lên khi bạn thêm — không phải đoán kích thước cố định như mảng thường. Chương kế chính quy hoá List / Set / Map.</div>`,
  ]]);

const c6q = quiz('pro192-quiz-ch6', 'Chapter 6 Quiz|||Quiz chương 6', [
  { id: 'q1', points: 1, question: 'A typical console management program is built around a…|||Một chương trình quản lý console điển hình xây quanh một…', options: ['single print statement|||một câu in đơn', 'menu loop with one method per action|||vòng lặp menu với mỗi hành động một phương thức', 'private field|||một trường private', 'checked exception|||một ngoại lệ checked'], correctIndex: 1, explanation: 'Menu loop + mỗi hành động (thêm/tìm/sửa/xoá/sắp) một phương thức.|||A menu loop with one method per action (add/find/update/remove/sort).' },
  { id: 'q2', points: 1, question: 'To sort a list of objects by a chosen field you use a…|||Để sắp một list đối tượng theo một trường bạn dùng…', options: ['Scanner', 'Comparator', 'finally block|||khối finally', 'constructor'], correctIndex: 1, explanation: 'Comparator nói "sắp theo cái gì" cho list.sort/Collections.sort.|||A Comparator tells list.sort/Collections.sort what to sort by.' },
  { id: 'q3', points: 1, question: 'To find an object in a list by a property, you typically…|||Để tìm một đối tượng trong list theo thuộc tính, bạn thường…', options: ['loop and compare each element|||duyệt và so từng phần tử', 'call new|||gọi new', 'throw an exception|||ném một ngoại lệ', 'use ==|||dùng =='], correctIndex: 0, explanation: 'Duyệt qua list, so bằng .equals() cho tới khi khớp.|||Loop through the list comparing with .equals() until it matches.' },
]);

/* ════════════════════ CHƯƠNG 7 — COLLECTIONS ════════════════════ */
const c7 = doc('pro192-7-1-collections', '7.1 — Collections: List, Set & Map|||7.1 — Collections: List, Set & Map',
  'Ba ADT collection, generics, và hợp đồng equals()/hashCode() làm Set/Map chạy đúng.',
  [[
    `<span class="eyebrow">PRO192 · Chapter 7 · Lesson 7.1</span>
<h2>Dynamic, powerful data structures</h2>
<p class="lead">The <strong>Java Collections Framework</strong> (CLO9) provides flexible, growable data structures — the three you must know are <strong>List</strong>, <strong>Set</strong> and <strong>Map</strong>.</p>
<table>
  <thead><tr><th>Collection</th><th>Holds</th><th>Use when…</th></tr></thead>
  <tbody>
    <tr><td>List (ArrayList)</td><td>An ordered sequence; duplicates allowed</td><td>you need an indexed, growable list</td></tr>
    <tr><td>Set (HashSet)</td><td>Unique elements; no duplicates</td><td>you need to avoid repeats</td></tr>
    <tr><td>Map (HashMap)</td><td>Key → value pairs</td><td>you look things up by a key</td></tr>
  </tbody>
</table>
<pre><code class="language-java">import java.util.*;

List&lt;String&gt; list = new ArrayList&lt;&gt;(List.of("An", "Binh", "An"));
Set&lt;String&gt; set = new HashSet&lt;&gt;(list);   // duplicates dropped
Map&lt;String, Integer&gt; diem = new HashMap&lt;&gt;();
diem.put("An", 8);
diem.put("Binh", 7);
System.out.println("List size = " + list.size());
System.out.println("Set size = " + set.size());
System.out.println("Diem An = " + diem.get("An"));
</code></pre>
<div class="out"><b>Output:</b><br>List size = 3<br>Set size = 2<br>Diem An = 8</div>
<p>The List kept the duplicate "An" (size 3); the Set dropped it (size 2); the Map looked up a value by key instantly. The <code>&lt;String&gt;</code> part is <strong>generics</strong> — it tells the collection what type it holds, so the compiler catches type errors and you avoid casting.</p>
<div class="callout"><span class="badge">★ equals() &amp; hashCode() — the contract that makes Set/Map work</span> A HashSet/HashMap decides "same key?" by calling <code>hashCode()</code> then <code>equals()</code>. If you store your own objects (say Student) without overriding both, two "equal" students count as different — duplicates sneak into a Set and <code>map.get()</code> returns null. The rule: whenever you override <code>equals()</code>, override <code>hashCode()</code> to match. This is the single most common real-world collections bug.</p>
<pre><code class="language-java">@Override public boolean equals(Object o) {
    if (!(o instanceof Student)) return false;
    return name.equals(((Student) o).name);
}
@Override public int hashCode() { return name.hashCode(); }
</code></pre></div>
<div class="note-ct">Prefer collections over raw arrays in real Java: an ArrayList grows automatically, a HashSet removes duplicates for free, and a HashMap gives near-instant lookup by key. Choosing the right one is a real design decision.</div>`,
    `<span class="eyebrow">PRO192 · Chương 7 · Bài 7.1</span>
<h2>Cấu trúc dữ liệu động, mạnh mẽ</h2>
<p class="lead"><strong>Java Collections Framework</strong> (CLO9) cung cấp cấu trúc dữ liệu linh hoạt, lớn lên được — ba cái bạn phải biết là <strong>List</strong>, <strong>Set</strong> và <strong>Map</strong>.</p>
<table>
  <thead><tr><th>Collection</th><th>Chứa</th><th>Dùng khi…</th></tr></thead>
  <tbody>
    <tr><td>List (ArrayList)</td><td>Một dãy có thứ tự; cho phép trùng</td><td>bạn cần một danh sách có chỉ số, lớn lên được</td></tr>
    <tr><td>Set (HashSet)</td><td>Phần tử duy nhất; không trùng</td><td>bạn cần tránh lặp</td></tr>
    <tr><td>Map (HashMap)</td><td>Cặp khoá → giá trị</td><td>bạn tra cứu theo một khoá</td></tr>
  </tbody>
</table>
<pre><code class="language-java">import java.util.*;

List&lt;String&gt; list = new ArrayList&lt;&gt;(List.of("An", "Binh", "An"));
Set&lt;String&gt; set = new HashSet&lt;&gt;(list);   // loại trùng
Map&lt;String, Integer&gt; diem = new HashMap&lt;&gt;();
diem.put("An", 8);
diem.put("Binh", 7);
System.out.println("List size = " + list.size());
System.out.println("Set size = " + set.size());
System.out.println("Diem An = " + diem.get("An"));
</code></pre>
<div class="out"><b>Kết quả:</b><br>List size = 3<br>Set size = 2<br>Diem An = 8</div>
<p>List giữ bản trùng "An" (size 3); Set loại nó (size 2); Map tra một giá trị theo khoá tức thì. Phần <code>&lt;String&gt;</code> là <strong>generics</strong> — nó cho collection biết chứa kiểu gì, để trình biên dịch bắt lỗi kiểu và bạn khỏi ép kiểu.</p>
<div class="callout"><span class="badge">★ equals() &amp; hashCode() — hợp đồng làm Set/Map chạy đúng</span> HashSet/HashMap quyết định "cùng khoá?" bằng cách gọi <code>hashCode()</code> rồi <code>equals()</code>. Nếu bạn lưu đối tượng của mình (vd Student) mà không ghi đè cả hai, hai student "bằng nhau" bị tính là khác — bản trùng lọt vào Set và <code>map.get()</code> trả null. Quy tắc: hễ ghi đè <code>equals()</code> thì ghi đè <code>hashCode()</code> cho khớp. Đây là lỗi collections hay gặp nhất trong thực tế.</p>
<pre><code class="language-java">@Override public boolean equals(Object o) {
    if (!(o instanceof Student)) return false;
    return name.equals(((Student) o).name);
}
@Override public int hashCode() { return name.hashCode(); }
</code></pre></div>
<div class="note-ct">Ưu tiên collections hơn mảng thô trong Java thật: một ArrayList tự lớn lên, một HashSet loại trùng miễn phí, và một HashMap cho tra cứu theo khoá gần tức thì. Chọn đúng cái là một quyết định thiết kế thật.</div>`,
  ]]);

const c7q = quiz('pro192-quiz-ch7', 'Chapter 7 Quiz|||Quiz chương 7', [
  { id: 'q1', points: 1, question: 'Which collection automatically removes duplicates?|||Collection nào tự động loại trùng?', options: ['List', 'Set', 'Map', 'Array|||Mảng'], correctIndex: 1, explanation: 'Set (vd HashSet) chỉ giữ phần tử duy nhất.|||A Set (e.g. HashSet) keeps only unique elements.' },
  { id: 'q2', points: 1, question: 'A Map stores…|||Một Map lưu…', options: ['single values|||các giá trị đơn', 'key → value pairs|||các cặp khoá → giá trị', 'only numbers|||chỉ số', 'unique elements only|||chỉ phần tử duy nhất'], correctIndex: 1, explanation: 'Map là các cặp khoá→giá trị, tra theo khoá.|||A Map is key→value pairs, looked up by key.' },
  { id: 'q3', points: 1, question: 'When you override equals() on your class, you must also override…|||Khi ghi đè equals() trên lớp của bạn, bạn phải ghi đè thêm…', options: ['toString()', 'hashCode()', 'the constructor|||constructor', 'main()'], correctIndex: 1, explanation: 'equals() và hashCode() phải khớp để Set/Map chạy đúng.|||equals() and hashCode() must agree for Set/Map to work correctly.' },
]);

/* ════════════════════ CHƯƠNG 8 — FILE I/O ════════════════════ */
const c8 = doc('pro192-8-1-file-io', '8.1 — File I/O: text, binary & serialization|||8.1 — Đọc/ghi tệp: text, binary & serialization',
  'Luồng byte vs ký tự; đọc/ghi tệp văn bản an toàn với try-with-resources; ghi/đọc cả đối tượng bằng serialization.',
  [[
    `<span class="eyebrow">PRO192 · Chapter 8 · Lesson 8.1</span>
<h2>Persisting data with streams</h2>
<p class="lead">A program's data vanishes when it stops — unless you save it to a file. Java reads and writes files through <strong>streams</strong> (CLO3/CLO4): an ordered flow of data between your program and a source/target.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Byte streams (InputStream / OutputStream)</div><div class="lz-ld">Move raw bytes — for images, audio, any binary file.</div></div>
  <div class="lz-layer"><div class="lz-lt">Character streams (Reader / Writer)</div><div class="lz-ld">Move text with proper character encoding — for .txt, .csv, source files.</div></div>
</div>
<h3>Write then read text</h3>
<pre><code class="language-java">import java.io.*;

// write two records — try-with-resources auto-closes the file
try (BufferedWriter w = new BufferedWriter(new FileWriter("data.txt"))) {
    w.write("An,3.6"); w.newLine();
    w.write("Binh,3.1"); w.newLine();
} catch (IOException e) {
    System.out.println("Write failed: " + e.getMessage());
}

// read line by line and rebuild objects
try (BufferedReader r = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = r.readLine()) != null) {
        String[] p = line.split(",");
        System.out.println("Doc: " + p[0] + " GPA=" + p[1]);
    }
} catch (IOException e) { /* handle */ }
</code></pre>
<div class="out"><b>Output:</b><br>Doc: An GPA=3.6<br>Doc: Binh GPA=3.1</div>
<p>File I/O throws <strong>checked exceptions</strong> (IOException) — the compiler forces you to handle them (Chapter 5). <strong>try-with-resources</strong> closes the file even on error, preventing leaks.</p>
<h3>Object serialization — save a whole object</h3>
<pre><code class="language-java">import java.io.*;

class Student implements Serializable {   // opt in to serialization
    String name; double gpa;
    Student(String n, double g) { name = n; gpa = g; }
}

// write the object, then read it back
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("s.dat"))) {
    out.writeObject(new Student("An", 3.6));
}
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("s.dat"))) {
    Student s = (Student) in.readObject();      // cast back to Student
    System.out.println(s.name + " " + s.gpa);
} catch (IOException | ClassNotFoundException e) { /* handle */ }
</code></pre>
<div class="out"><b>Output:</b> An 3.6</div>
<div class="callout"><span class="badge">Syllabus · serialization</span> Writing CSV by hand works for simple data, but making a class <code>implements Serializable</code> lets Java save an <em>entire object</em>: <code>writeObject()</code> stores every field and <code>readObject()</code> reconstructs it (a binary file). Modern apps go further with JSON (Jackson/Gson) so the file is human-readable and cross-language — the format behind almost every web API you will build in PRJ301.</div>
<div class="note-ct">You can now build a complete Java program: model a domain with classes (the pillars), store objects in collections, handle errors, and save/load to files — a real, self-contained application. That is the leap PRO192 delivers.</div>`,
    `<span class="eyebrow">PRO192 · Chương 8 · Bài 8.1</span>
<h2>Lưu dữ liệu lâu dài bằng luồng</h2>
<p class="lead">Dữ liệu của một chương trình biến mất khi nó dừng — trừ khi bạn lưu ra tệp. Java đọc/ghi tệp qua <strong>luồng (stream)</strong> (CLO3/CLO4): một dòng dữ liệu có thứ tự giữa chương trình và một nguồn/đích.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Luồng byte (InputStream / OutputStream)</div><div class="lz-ld">Chuyển byte thô — cho ảnh, âm thanh, mọi tệp nhị phân.</div></div>
  <div class="lz-layer"><div class="lz-lt">Luồng ký tự (Reader / Writer)</div><div class="lz-ld">Chuyển văn bản với mã hoá ký tự đúng — cho .txt, .csv, tệp nguồn.</div></div>
</div>
<h3>Ghi rồi đọc văn bản</h3>
<pre><code class="language-java">import java.io.*;

// ghi hai bản ghi — try-with-resources tự đóng tệp
try (BufferedWriter w = new BufferedWriter(new FileWriter("data.txt"))) {
    w.write("An,3.6"); w.newLine();
    w.write("Binh,3.1"); w.newLine();
} catch (IOException e) {
    System.out.println("Write failed: " + e.getMessage());
}

// đọc từng dòng và dựng lại đối tượng
try (BufferedReader r = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = r.readLine()) != null) {
        String[] p = line.split(",");
        System.out.println("Doc: " + p[0] + " GPA=" + p[1]);
    }
} catch (IOException e) { /* xử lý */ }
</code></pre>
<div class="out"><b>Kết quả:</b><br>Doc: An GPA=3.6<br>Doc: Binh GPA=3.1</div>
<p>Đọc/ghi tệp ném <strong>ngoại lệ checked</strong> (IOException) — trình biên dịch buộc bạn xử lý (Chương 5). <strong>try-with-resources</strong> đóng tệp kể cả khi lỗi, ngăn rò rỉ.</p>
<h3>Serialization đối tượng — lưu cả một đối tượng</h3>
<pre><code class="language-java">import java.io.*;

class Student implements Serializable {   // đăng ký serialization
    String name; double gpa;
    Student(String n, double g) { name = n; gpa = g; }
}

// ghi đối tượng, rồi đọc lại
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("s.dat"))) {
    out.writeObject(new Student("An", 3.6));
}
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("s.dat"))) {
    Student s = (Student) in.readObject();      // ép lại về Student
    System.out.println(s.name + " " + s.gpa);
} catch (IOException | ClassNotFoundException e) { /* xử lý */ }
</code></pre>
<div class="out"><b>Kết quả:</b> An 3.6</div>
<div class="callout"><span class="badge">Syllabus · serialization</span> Viết CSV bằng tay ổn cho dữ liệu đơn giản, nhưng cho lớp <code>implements Serializable</code> giúp Java lưu cả <em>một đối tượng</em>: <code>writeObject()</code> lưu mọi trường và <code>readObject()</code> dựng lại nó (tệp nhị phân). App hiện đại đi xa hơn với JSON (Jackson/Gson) để tệp đọc được bằng mắt và đa ngôn ngữ — định dạng sau gần như mọi web API bạn sẽ xây ở PRJ301.</div>
<div class="note-ct">Giờ bạn xây được một chương trình Java hoàn chỉnh: mô hình một lĩnh vực bằng các lớp (các trụ cột), lưu đối tượng trong collections, xử lý lỗi, và lưu/nạp ra tệp — một ứng dụng thật, tự chứa. Đó là bước nhảy PRO192 mang lại.</div>`,
  ]]);

const c8q = quiz('pro192-quiz-ch8', 'Chapter 8 Quiz|||Quiz chương 8', [
  { id: 'q1', points: 1, question: 'Character streams (Reader/Writer) are used for…|||Luồng ký tự (Reader/Writer) dùng cho…', options: ['images and audio|||ảnh và âm thanh', 'text files|||tệp văn bản', 'compiling code|||biên dịch code', 'network sockets only|||chỉ socket mạng'], correctIndex: 1, explanation: 'Reader/Writer cho văn bản; byte stream cho nhị phân (ảnh/âm thanh).|||Reader/Writer for text; byte streams for binary (images/audio).' },
  { id: 'q2', points: 1, question: 'try-with-resources is useful because it…|||try-with-resources hữu ích vì nó…', options: ['runs faster|||chạy nhanh hơn', 'automatically closes the file/resource|||tự động đóng tệp/tài nguyên', 'skips exceptions|||bỏ qua ngoại lệ', 'needs no catch ever|||không bao giờ cần catch'], correctIndex: 1, explanation: 'Nó tự đóng tài nguyên khi hết khối, kể cả khi có lỗi.|||It auto-closes the resource when the block ends, even on error.' },
  { id: 'q3', points: 1, question: 'To save an entire object to a file, the class must…|||Để lưu cả một đối tượng ra tệp, lớp phải…', options: ['be final|||là final', 'implement Serializable|||implements Serializable', 'have no fields|||không có trường', 'extend Object|||extends Object'], correctIndex: 1, explanation: 'implements Serializable cho phép writeObject()/readObject().|||implements Serializable enables writeObject()/readObject().' },
]);

/* ════════════════════ ĐÁNH GIÁ — PE & FE ════════════════════ */
const pe = doc('pro192-thi-thuc-hanh', 'Practical Exam (85 min, 30%)|||Thi thực hành (85 phút, 30%)',
  'Số liệu thật của syllabus cho PE (85 phút, 30%, điều kiện >0), bài thi gồm gì, và luyện thế nào trên Java 8/NetBeans.',
  [[
    `<span class="eyebrow">PRO192 · Assessment · PE</span>
<h2>Practical Exam (85 minutes, 30% of the subject)</h2>
<p class="lead">Syllabus numbers, not a guess: the Practical Exam is <strong>on-going</strong>, <strong>1 part</strong>, <strong>85 minutes</strong>, worth <strong>30%</strong>, completion criterion <strong>&gt; 0</strong> — score zero and you fail the subject. It is the single heaviest component, equal to the final.</p>
<div class="callout warn"><span class="badge">What the syllabus does not say</span> It publishes no problem bank, no marking scheme and no allowed-resources list. Take those from your lecturer. Below is the shape the exam takes from the course content — CLO8 (a complete program using an object array) on the tool the syllabus names, <strong>NetBeans</strong> / <strong>Java 8</strong>.</div>
<h3>What 85 minutes has to contain</h3>
<table>
<thead><tr><th>Piece</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>Entity class: private fields, constructor(s), getters/setters, toString()</td><td>3.1</td></tr>
<tr><td>Inheritance / abstract parent + 2 subclasses overriding one method</td><td>3.2, 4.1</td></tr>
<tr><td>Object array / ArrayList (CLO8): add / display / find / update / remove</td><td>6.1, 7.1</td></tr>
<tr><td>Menu loop with validated input (try/catch, re-ask until valid)</td><td>5.1</td></tr>
<tr><td>Sort by a chosen field, and/or read/write a text file</td><td>6.1, 8.1</td></tr>
</tbody>
</table>
<h3>How to prepare, specifically</h3>
<ul>
<li><b>Type a full CRUD program from a blank NetBeans project, on a timer, at least five times.</b> Entity → manager class → menu → features. When the skeleton is muscle memory, 85 minutes is comfortable.</li>
<li><b>Compile after every feature.</b> A program that runs and does four of six features scores far more than a "complete" one that will not compile.</li>
<li><b>Do the easy features first</b> (add, display) before a tricky sort — bank partial credit.</li>
<li><b>Validate every input.</b> A crash on <code>InputMismatchException</code> costs the feature it was in.</li>
<li><b>Match the required output format exactly</b> — labels, spacing, printf widths, decimals.</li>
<li><b>Write Java 8.</b> Arrow <code>switch</code>, <code>var</code>, <code>if (x instanceof Dog d)</code> and text blocks all fail to compile on JDK 8 — use the classic forms.</li>
</ul>
<div class="callout"><span class="badge">Sample</span> Rehearse with the six Lab briefs and the Assignment from your class — they are the same shape as the PE.</div>`,
    `<span class="eyebrow">PRO192 · Đánh giá · PE</span>
<h2>Thi thực hành (85 phút, 30% điểm môn)</h2>
<p class="lead">Số liệu của syllabus, không phải phỏng đoán: Practical Exam là <strong>on-going</strong>, <strong>1 phần</strong>, <strong>85 phút</strong>, trọng số <strong>30%</strong>, điều kiện hoàn thành <strong>&gt; 0</strong> — bị 0 điểm là trượt môn. Đây là thành phần nặng nhất, ngang bài cuối kỳ.</p>
<div class="callout warn"><span class="badge">Cái syllabus KHÔNG nói</span> Nó không công bố ngân hàng đề, thang chấm hay danh sách tài liệu được mang vào. Hỏi giảng viên. Dưới đây là hình dạng bài suy ra từ nội dung môn — CLO8 (chương trình hoàn chỉnh dùng mảng đối tượng) trên công cụ syllabus nêu đích danh, <strong>NetBeans</strong> / <strong>Java 8</strong>.</div>
<h3>85 phút đó phải chứa những gì</h3>
<table>
<thead><tr><th>Mảnh</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>Lớp entity: trường private, constructor, getter/setter, toString()</td><td>3.1</td></tr>
<tr><td>Kế thừa / lớp cha abstract + 2 lớp con ghi đè một phương thức</td><td>3.2, 4.1</td></tr>
<tr><td>Mảng đối tượng / ArrayList (CLO8): thêm / hiện / tìm / sửa / xoá</td><td>6.1, 7.1</td></tr>
<tr><td>Vòng menu với nhập liệu có validate (try/catch, hỏi lại tới khi hợp lệ)</td><td>5.1</td></tr>
<tr><td>Sắp theo một trường, và/hoặc đọc–ghi tệp văn bản</td><td>6.1, 8.1</td></tr>
</tbody>
</table>
<h3>Luyện cụ thể thế nào</h3>
<ul>
<li><b>Gõ trọn một chương trình CRUD từ project NetBeans trống, có bấm giờ, ít nhất năm lần.</b> Entity → lớp quản lý → menu → các chức năng. Khi bộ khung thành phản xạ, 85 phút là thoải mái.</li>
<li><b>Biên dịch sau mỗi chức năng.</b> Chương trình chạy được và làm 4/6 chức năng ăn điểm hơn nhiều bản "hoàn chỉnh" không biên dịch nổi.</li>
<li><b>Làm chức năng dễ trước</b> (thêm, hiện) trước một hàm sort hóc búa — gom điểm phần.</li>
<li><b>Validate mọi input.</b> Sập vì <code>InputMismatchException</code> là mất nguyên chức năng đó.</li>
<li><b>Khớp đúng định dạng output yêu cầu</b> — nhãn, khoảng trắng, độ rộng printf, số thập phân.</li>
<li><b>Viết Java 8.</b> <code>switch</code> mũi tên, <code>var</code>, <code>if (x instanceof Dog d)</code> và text block đều không biên dịch trên JDK 8 — dùng dạng cổ điển.</li>
</ul>
<div class="callout"><span class="badge">Câu mẫu</span> Diễn tập bằng 6 đề Lab và Assignment của lớp bạn — chúng cùng hình dạng với PE.</div>`,
  ]]);

const fe = {
  title: 'Final Exam (60 min, 30%, gate 4/10)|||Thi cuối kỳ (60 phút, 30%, cổng 4/10)',
  slug: 'pro192-thi-cuoi-ky',
  type: 'DOCUMENT',
  description: 'Syllabus cho gì (60 phút, 30%, ≥4, 50 MC theo bản trích) và cách ôn theo 9 CLO + câu mẫu.',
  content: bi(
    `<span class="eyebrow">PRO192 · Assessment · FE</span>
<h2>Final Exam (60 minutes, 30%, must reach 4/10)</h2>
<p class="lead">The syllabus states the Final Exam is <strong>1 part</strong>, weight <strong>30%</strong>, duration <strong>60 minutes</strong>, completion criterion <strong>&ge; 4</strong>/10, and per the FLM extract a <strong>50-question multiple-choice</strong> paper. Below that gate you fail the subject whatever your average.</p>
<h3>Revise by what is examinable</h3>
<p>Sixty minutes to cover nine CLOs. Work through them in order:</p>
<ul>
<li><b>CLO1, CLO5, CLO6 — the four pillars &amp; class relationships.</b> Encapsulation, inheritance, polymorphism, abstraction; <code>this</code> vs <code>super</code>; overloading vs overriding; static/abstract/final/access modifiers. Lessons 1.1, 3.1, 3.2.</li>
<li><b>CLO7 — abstract classes &amp; interfaces.</b> Interface members incl. default methods; when to choose which. Lesson 4.1.</li>
<li><b>CLO4 — exceptions.</b> Checked vs unchecked; try/catch/finally; throw vs throws; assertion. Lesson 5.1.</li>
<li><b>CLO2, CLO3 — Java syntax &amp; control.</b> Primitives, casting, instanceof, parameter passing, Array/ArrayList, String/StringBuffer. Lessons 2.1, 2.2, 3.2.</li>
<li><b>CLO8, CLO9 — object arrays &amp; collections.</b> List / Set / Map and what each guarantees; equals/hashCode. Lessons 6.1, 7.1.</li>
</ul>
<h3>In the room</h3>
<ul>
<li>Pace yourself: 60 minutes across 50 questions is ~70 seconds each — flag hard ones and return.</li>
<li>For code items, trace the program on paper line by line — predicted output beats intuition, especially on overriding and on <code>finally</code>.</li>
<li>Eliminate clearly wrong options first. Never leave a gated paper blank: 4/10 is the gate.</li>
</ul>
<div class="callout"><span class="badge">Sample</span> The quiz below draws from this course to practise the content. Real past papers are added in the exam room.</div>`,
    `<span class="eyebrow">PRO192 · Đánh giá · FE</span>
<h2>Thi cuối kỳ (60 phút, 30%, phải đạt 4/10)</h2>
<p class="lead">Syllabus nêu Thi cuối kỳ là <strong>1 phần</strong>, trọng số <strong>30%</strong>, thời lượng <strong>60 phút</strong>, điều kiện hoàn thành <strong>&ge; 4</strong>/10, và theo bản trích FLM là bài <strong>50 câu trắc nghiệm</strong>. Dưới mức đó là trượt môn dù trung bình bao nhiêu.</p>
<h3>Ôn theo phạm vi thi</h3>
<p>Sáu mươi phút phủ chín CLO. Đi theo thứ tự:</p>
<ul>
<li><b>CLO1, CLO5, CLO6 — bốn trụ cột &amp; quan hệ giữa các lớp.</b> Đóng gói, kế thừa, đa hình, trừu tượng; <code>this</code> vs <code>super</code>; overloading vs overriding; static/abstract/final/access modifier. Bài 1.1, 3.1, 3.2.</li>
<li><b>CLO7 — abstract class &amp; interface.</b> Thành viên interface kể cả default method; khi nào chọn cái nào. Bài 4.1.</li>
<li><b>CLO4 — ngoại lệ.</b> Checked vs unchecked; try/catch/finally; throw vs throws; assertion. Bài 5.1.</li>
<li><b>CLO2, CLO3 — cú pháp Java &amp; điều khiển.</b> Kiểu nguyên thuỷ, ép kiểu, instanceof, truyền tham số, Array/ArrayList, String/StringBuffer. Bài 2.1, 2.2, 3.2.</li>
<li><b>CLO8, CLO9 — mảng đối tượng &amp; collections.</b> List / Set / Map và cái nào bảo đảm gì; equals/hashCode. Bài 6.1, 7.1.</li>
</ul>
<h3>Trong phòng thi</h3>
<ul>
<li>Chia thời gian: 60 phút cho 50 câu ~70 giây/câu — đánh dấu câu khó và quay lại.</li>
<li>Với câu về code, trace chương trình trên giấy từng dòng — output dự đoán thắng trực giác, nhất là ở ghi đè và ở <code>finally</code>.</li>
<li>Loại phương án sai rõ ràng trước. Đừng bỏ trống bài có cổng điểm: 4/10 là cửa.</li>
</ul>
<div class="callout"><span class="badge">Câu mẫu</span> Quiz dưới đây lấy từ chính khoá học để luyện nội dung. Đề thi thật được thêm ở phòng thi.</div>`,
  ),
  quiz: {
    timeLimitSeconds: 420,
    questions: [
      { id: 'q1', points: 1, question: 'OOP bundles together…|||OOP gom lại với nhau…', options: ['only functions|||chỉ hàm', 'data and the behavior that acts on it|||dữ liệu và hành vi tác động lên nó', 'only variables|||chỉ biến', 'files and folders|||tệp và thư mục'], correctIndex: 1, explanation: 'OOP gom dữ liệu và hành vi vào đối tượng.|||OOP bundles data and behavior into objects.' },
      { id: 'q2', points: 1, question: 'Treating subclasses through a common parent type and running the right method is…|||Xử lý lớp con qua một kiểu cha chung và chạy đúng phương thức là…', options: ['encapsulation|||đóng gói', 'polymorphism|||đa hình', 'a getter|||một getter', 'a package|||một package'], correctIndex: 1, explanation: 'Đó là đa hình (dynamic dispatch).|||That is polymorphism (dynamic dispatch).' },
      { id: 'q3', points: 1, question: 'A class that cannot be instantiated but defines abstract methods is…|||Một lớp không tạo thể hiện được nhưng định nghĩa phương thức trừu tượng là…', options: ['an interface|||một interface', 'an abstract class|||một abstract class', 'a final class|||một lớp final', 'an object|||một đối tượng'], correctIndex: 1, explanation: 'Abstract class: không new được, có thể có phương thức trừu tượng.|||An abstract class cannot be instantiated and may declare abstract methods.' },
      { id: 'q4', points: 1, question: 'Which block always runs, whether or not an exception occurs?|||Khối nào luôn chạy, dù có hay không có ngoại lệ?', options: ['try', 'catch', 'finally', 'throw'], correctIndex: 2, explanation: 'finally luôn chạy — dùng để dọn dẹp.|||finally always runs — used for cleanup.' },
      { id: 'q5', points: 1, question: 'A HashMap is best when you need to…|||HashMap tốt nhất khi bạn cần…', options: ['store an ordered list|||lưu một danh sách có thứ tự', 'look up values by a key|||tra giá trị theo khoá', 'remove duplicates|||loại trùng', 'catch exceptions|||bắt ngoại lệ'], correctIndex: 1, explanation: 'Map tra theo khoá gần tức thì.|||A Map looks up by key near-instantly.' },
      { id: 'q6', points: 1, question: 'Generics like List<Student> give you…|||Generics như List<Student> cho bạn…', options: ['slower code|||code chậm hơn', 'compile-time type safety|||an toàn kiểu lúc biên dịch', 'more exceptions|||nhiều ngoại lệ hơn', 'no benefit|||không lợi ích'], correctIndex: 1, explanation: 'Generics cho an toàn kiểu lúc biên dịch, khỏi ép kiểu.|||Generics give compile-time type safety and avoid casting.' },
    ],
  },
};

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'PRO192',
    slug: 'object-oriented-programming',
    title: 'Object-Oriented Programming',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRO192.webp',
    shortDescription: 'Think in objects: Java classes, the four OOP pillars, abstract classes & interfaces, exceptions, object arrays, collections (List/Set/Map) and file I/O — in NetBeans, Java 8. Bilingual, runnable code & quizzes.|||Tư duy bằng đối tượng: lớp Java, bốn trụ cột OOP, abstract class & interface, ngoại lệ, mảng đối tượng, collections (List/Set/Map) và đọc/ghi tệp — trên NetBeans, Java 8. Song ngữ, code chạy được & quiz.',
    description: 'Môn <strong>PRO192 — Object-Oriented Programming</strong> (kỳ 2) chuyển từ tư duy thủ tục (PRF192, C) sang hướng đối tượng với <strong>Java</strong> trên <strong>NetBeans</strong>. Bám khung 8 chương của giáo trình FLM: <strong>Giới thiệu OO</strong> → <strong>Java cơ bản</strong> (kiểu, điều khiển, phương thức, Array/ArrayList, String/StringBuffer, I/O) → <strong>OOP</strong> (đóng gói, kế thừa, đa hình, trừu tượng) → <strong>abstract class &amp; interface</strong> → <strong>ngoại lệ</strong> → <strong>mảng đối tượng</strong> → <strong>collections</strong> → <strong>đọc/ghi tệp &amp; serialization</strong>. Song ngữ EN/VI, code Java chạy được, bổ sung chuyên sâu (this/super, casting &amp; instanceof, access modifier, constructor chaining, UML, overloading vs overriding, ArrayList vs array, equals/hashCode). Tiên quyết: PRF192.',
    whatYouLearn: 'Tư duy hướng đối tượng; cú pháp Java & JVM; kiểu/điều khiển/phương thức & truyền tham số by value; Array vs ArrayList, String vs StringBuffer; định nghĩa lớp, constructor & this, đóng gói + access modifier, trừu tượng; kế thừa (extends/super), đa hình & dynamic dispatch, override vs overload, casting & instanceof; abstract class & interface (Comparable, default method); xử lý ngoại lệ (try/catch/finally, throw/throws, assertion); mảng đối tượng (add/find/update/remove/sort); Java Collections (List/Set/Map, generics, equals/hashCode); đọc/ghi tệp text & serialization đối tượng; sơ đồ lớp UML.',
    requirements: 'Tiên quyết: đạt PRF192 (vững hàm, mảng, con trỏ trong C). Cần cài JDK (Java 8+) và Apache NetBeans.',
    documentsNote: 'Sách chính: Core Java Vol 1 & 2 — Cay Horstmann (Pearson 11th) · The Java Language Specification, Java SE 8 (Oracle) · học liệu "OOP using Java" của FU (trên FLM). Công cụ: JDK 8+, Apache NetBeans.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chính Core Java, Java 8 Spec, học liệu FU trên FLM; công cụ JDK/NetBeans; lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: '9 CLO, khung 8 chương & cấu trúc điểm.', lessons: [intro] },
    { title: 'Chương 1 — Giới thiệu OO|||Chapter 1 — Introduction', description: 'Khái niệm OO, thuật ngữ đối tượng, JVM, cài JDK/NetBeans.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Java cơ bản|||Chapter 2 — Basic Java language', description: 'Cú pháp, kiểu, điều khiển, phương thức, Array/ArrayList, String, I/O.', lessons: [c2a, c2b, c2q] },
    { title: 'Chương 3 — OOP|||Chapter 3 — OOP', description: 'Lớp, đóng gói, trừu tượng, kế thừa, đa hình, ghi đè.', lessons: [c3a, c3b, c3q] },
    { title: 'Chương 4 — Abstract class & Interface|||Chapter 4 — Abstract class & Interface', description: 'Hợp đồng cho hành vi; abstract vs interface; Comparable.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Lỗi & Ngoại lệ|||Chapter 5 — Error & Exception', description: 'try/catch/finally, throw/throws, checked/unchecked, assertion.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mảng đối tượng|||Chapter 6 — Array of Objects', description: 'Thêm/tìm/sửa/xoá/sắp xếp; chương trình theo menu CLO8.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Collections|||Chapter 7 — Collections', description: 'List, Set, Map, generics, equals/hashCode.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đọc/ghi tệp|||Chapter 8 — File I/O', description: 'Luồng text/binary, try-with-resources, serialization đối tượng.', lessons: [c8, c8q] },
    { title: 'Thi thực hành & Cuối kỳ|||Practical & Final Exam', description: 'PE (85 phút, 30%) và FE (60 phút, 30%, cổng 4/10) — số liệu syllabus & cách ôn.', lessons: [pe, fe] },
  ],
};
