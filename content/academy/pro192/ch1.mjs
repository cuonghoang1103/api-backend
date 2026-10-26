/**
 * PRO192 · Chương 1 — tư duy OO & Java cơ bản (pro1, pro3, pro4, pro5, pro6).
 * Bài 📑 học theo từng slide: pro1 (tmp_01.pptx, slide 1–16); pro3 (tmp_03.pptx, slide 1–26); pro4 (tmp_04.pptx, slide 1–27); pro5 (tmp_05.pptx, slide 1–30); pro6 (tmp_06.pptx, slide 1–18).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: pro192-on-ch1.
 * Bài 🏗️ LAB CT Library (chuẩn LAB211, deck tự dựng): pro192-lab-1-danh-muc-sach.
 * Quiz viết lại (10 câu, giữ slug pro192-quiz-ch1).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { walk, walkHead, books, registerDeck, bi } from './_slides.mjs';

registerDeck('lab1', { code: 'PRO192 Lab 1', en: 'Lab 1 — CT Library: the first book catalogue', vi: 'Lab 1 — CT Library: danh mục sách đầu tiên', total: 17, w: 1280, h: 720, ver: 'v2' });

/* ───────── 1.A — 📑 Slide by slide · Introduction: complexity, abstraction, encapsulation, hierarchy, polymorphism (slides 1–16) ───────── */
const L_pro1_1 = {
  title: '1.A — 📑 Slide by slide · Introduction: complexity, abstraction, encapsulation, hierarchy, polymorphism (slides 1–16)|||1.A — 📑 Học theo từng slide · Introduction: độ phức tạp, trừu tượng, đóng gói, phân cấp, đa hình (slide 1–16)',
  slug: 'pro192-slide-pro1-1',
  type: 'VIDEO',
  description: 'Giảng đủ 16 slide bộ "Introduction" của trường: vì sao phần mềm phức tạp, hai cách chia bài toán (theo hoạt động và theo đối tượng) qua ví dụ ghi danh khoá học, bốn khái niệm nền của hướng đối tượng — trừu tượng, đóng gói, phân cấp (has-a, is-a-kind-of), đa hình — mỗi ý có chương trình Java chạy thật (cả lỗi biên dịch thật của JDK 8), sơ đồ UML dựng lại từ hình trên slide, và chỉ rõ chỗ slide lấy từ một giáo trình C++ (slide 13 là code C++ có lỗi).',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.A · school deck "Introduction", slides 1–16</span>
<h2>Why objects at all? — the idea of the whole course in 16 slides</h2>
<p class="lead">In PRF192 you solved problems by writing <em>steps</em>. This deck explains why big programs need a second way of thinking — splitting the world into <em>things</em> that keep their own data and their own behaviour — and names the four ideas every later chapter builds on: <strong>abstraction, encapsulation, hierarchy (inheritance), polymorphism</strong>. The slides are short and abstract, so each one below gets a concrete Java program that was compiled and run for real, and the pictures are redrawn as standard UML.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–6</td><td>complexity; activities vs things (course enrolment example)</td><td>split one small problem both ways and say which nouns become classes</td></tr>
<tr><td>7–11</td><td>object terminology; abstraction; class vs object</td><td>explain class, object, instance, state, and why "a horse cannot bark" is enforced by the compiler</td></tr>
<tr><td>12–13</td><td>encapsulation</td><td>write a class with private data and public methods, and explain why the inside can change without breaking callers</td></tr>
<tr><td>14</td><td>hierarchy</td><td>tell "has a" (aggregation) from "is a kind of" (inheritance) in code and in UML</td></tr>
<tr><td>15–16</td><td>polymorphism; summary</td><td>predict which method runs when one call meets objects of different types</td></tr>
</tbody>
</table>
<div class="callout"><strong>Where this deck comes from.</strong> The text is adapted from a C++ course (Chris Szalwinski, Seneca College — the FU offline material cites it). That is why slide 13 shows C++ code and slides 6 and 14 use a home-made notation instead of UML. Everything is translated to Java and UML below; the older web lesson 1.1 "Why objects?" further down stays as a short summary.</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.A · bộ slide "Introduction" của trường, slide 1–16</span>
<h2>Sao lại phải là đối tượng? — ý tưởng của cả môn trong 16 slide</h2>
<p class="lead">Ở PRF192 bạn giải bài bằng cách viết <em>các bước</em>. Bộ slide này giải thích vì sao chương trình lớn cần thêm một cách nghĩ thứ hai — chia thế giới thành các <em>sự vật</em> tự giữ dữ liệu và hành vi của mình — và gọi tên bốn ý mà mọi chương sau xây lên: <strong>trừu tượng (abstraction), đóng gói (encapsulation), phân cấp (hierarchy — kế thừa), đa hình (polymorphism)</strong>. Slide ngắn và trừu tượng, nên mỗi slide dưới đây có một chương trình Java đã biên dịch và chạy thật, còn hình vẽ được dựng lại thành UML chuẩn.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–6</td><td>độ phức tạp; chia theo hoạt động hay theo sự vật (ví dụ ghi danh khoá học)</td><td>chia một bài toán nhỏ theo cả hai cách và chỉ ra danh từ nào thành lớp</td></tr>
<tr><td>7–11</td><td>thuật ngữ đối tượng; trừu tượng; lớp và đối tượng</td><td>giải thích lớp, đối tượng, thể hiện (instance), trạng thái, và vì sao "ngựa không sủa được" do trình biên dịch canh giữ</td></tr>
<tr><td>12–13</td><td>đóng gói</td><td>viết lớp có dữ liệu private và phương thức public, giải thích vì sao ruột thay đổi mà nơi gọi không vỡ</td></tr>
<tr><td>14</td><td>phân cấp</td><td>phân biệt "có một" (kết tập) với "là một loại" (kế thừa) trong code và trong UML</td></tr>
<tr><td>15–16</td><td>đa hình; tóm tắt</td><td>đoán đúng phương thức nào chạy khi một lời gọi gặp đối tượng khác kiểu</td></tr>
</tbody>
</table>
<div class="callout"><strong>Bộ slide này từ đâu ra.</strong> Chữ trên slide được chuyển thể từ một giáo trình C++ (Chris Szalwinski, Seneca College — học liệu offline của FU có trích dẫn). Vì vậy slide 13 là code C++ và slide 6, 14 dùng ký hiệu tự chế thay vì UML. Bên dưới mọi thứ được dịch sang Java và UML; bài web cũ 1.1 "Vì sao đối tượng?" phía dưới vẫn giữ làm bản tóm tắt ngắn.</div>`),
    walkHead('pro1', 1, 16),
    walk('pro1', [
      [1, 'Introduction',
        `<p class="y-chinh">🎯 The opening deck of PRO192 (syllabus sessions 1–2, CLO1): <em>what</em> object-oriented programming is and <em>why</em> it exists — before any Java syntax.</p>
<p>The syllabus calls this "1.1 Welcome to Object-Oriented" and "1.2 Object Terminology". Session 2 also covers installing the JDK and an IDE — that is the separate one-slide deck in Section 0 and the ⭐ lesson "Installing the environment".</p>
<p class="meo">🧠 One sentence for the deck: <em>a big program is easier to build when it is made of objects that each know their own data and their own job.</em></p>`,
        `<p class="y-chinh">🎯 Bộ slide mở đầu PRO192 (buổi 1–2 theo đề cương, CLO1): lập trình hướng đối tượng <em>là gì</em> và <em>sinh ra để làm gì</em> — trước khi học cú pháp Java nào.</p>
<p>Đề cương gọi phần này là "1.1 Welcome to Object-Oriented" và "1.2 Object Terminology". Buổi 2 còn có phần cài JDK và IDE — đó là bộ slide một trang ở Mục 0 và bài ⭐ "Cài môi trường".</p>
<p class="meo">🧠 Một câu cho cả bộ slide: <em>chương trình lớn dễ làm hơn khi nó được ghép từ các đối tượng, mỗi đối tượng tự biết dữ liệu của mình và việc của mình.</em></p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Two goals: understand why we need a language for <strong>complex applications</strong>, and learn the <strong>object terminology</strong> — four concepts: abstraction, encapsulation, hierarchy, polymorphism.</p>
<p>These four words return in every chapter: encapsulation in Chapters 2–3, hierarchy (inheritance) and polymorphism in Chapter 4, abstraction again with abstract classes and interfaces in Chapter 5. FE questions ask you to match each word with its definition, and interviewers start almost every Java fresher interview with "What are the four pillars of OOP?".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/95165b4fde398c48a5a33691f3d117ea9c0dc226.svg" alt="The four concepts of this deck, each with the one idea to remember" loading="lazy" /><p class="chu-thich">🧩 The four concepts of this deck, each with the one idea to remember</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startmindmap
title Slides 7 and 16 — the four fundamental object concepts
' The slide says Hierarchy; most books say Inheritance
* Object-oriented\\nprogramming
** Abstraction
*** keep only what matters
*** class = common structure
** Encapsulation
*** data + logic together
*** details hidden (private)
left side
** Hierarchy
*** has a — aggregation
*** is a kind of — inheritance
** Polymorphism
*** same call, behaviour\\nchosen by the object
@endmindmap</code></pre></details>
<p class="meo">🧠 Order to remember them: <strong>A-E-H-P</strong> — "<strong>A</strong>n <strong>E</strong>gg <strong>H</strong>atches <strong>P</strong>olymorphs": first decide what matters (A), then hide it inside (E), then organise families (H), then let each member answer in its own way (P).</p>`,
        `<p class="y-chinh">🎯 Hai mục tiêu: hiểu vì sao cần một ngôn ngữ cho <strong>ứng dụng phức tạp</strong>, và học <strong>thuật ngữ đối tượng</strong> — bốn khái niệm: trừu tượng, đóng gói, phân cấp, đa hình.</p>
<p>Bốn từ này quay lại ở mọi chương: đóng gói ở Chương 2–3, phân cấp (kế thừa) và đa hình ở Chương 4, trừu tượng lại xuất hiện với abstract class và interface ở Chương 5. Đề FE hay bắt nối mỗi từ với định nghĩa của nó, còn gần như buổi phỏng vấn Java fresher nào cũng mở đầu bằng "Bốn trụ cột của OOP là gì?".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/95165b4fde398c48a5a33691f3d117ea9c0dc226.svg" alt="Bốn khái niệm của bộ slide, mỗi khái niệm kèm đúng một ý cần nhớ" loading="lazy" /><p class="chu-thich">🧩 Bốn khái niệm của bộ slide, mỗi khái niệm kèm đúng một ý cần nhớ</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startmindmap
title Slides 7 and 16 — the four fundamental object concepts
' Slide gọi là Hierarchy; phần lớn sách gọi là Inheritance
* Object-oriented\\nprogramming
** Abstraction
*** keep only what matters
*** class = common structure
** Encapsulation
*** data + logic together
*** details hidden (private)
left side
** Hierarchy
*** has a — aggregation
*** is a kind of — inheritance
** Polymorphism
*** same call, behaviour\\nchosen by the object
@endmindmap</code></pre></details>
<p class="meo">🧠 Thứ tự để nhớ: <strong>T-Đ-P-Đ</strong> — <strong>T</strong>rừu tượng (chọn cái quan trọng) → <strong>Đ</strong>óng gói (giấu nó vào trong) → <strong>P</strong>hân cấp (xếp thành họ hàng) → <strong>Đ</strong>a hình (mỗi thành viên trả lời theo cách riêng).</p>`],
      [3, 'A Language for Complex Applications',
        `<p class="y-chinh">🎯 Real applications are complex because the <strong>problem domain</strong> — the part of the real world the software serves — is intricate; a useful program must represent part of that complexity.</p>
<p><strong>Problem domain</strong> = the area of expertise the software is about: for FAP it is students, courses, timetables, attendance, marks; for a banking app it is customers, accounts, transactions. You cannot make FAP simple by ignoring attendance — the rules exist in the real school, so the code must hold them somewhere.</p>
<p>➕ <strong>How big is "complex"?</strong> The FU offline material says modern applications exceed hundreds of thousands or millions of lines, are written by many developers, and live for years. No one can keep that in their head. The software-engineering answer is to build it from pieces that are <strong>highly cohesive</strong> (each piece does one job well) and <strong>loosely coupled</strong> (pieces depend on each other as little as possible) — and object-oriented languages are the tool for exactly that.</p>
<div class="callout">🧭 <strong>Go further — LAB211, PRJ301, Spring Boot</strong>: LAB211 asks for console programs of a few hundred lines; your PRJ301 Assignment and the LabFlow capstone reach thousands of lines spread over dozens of classes. The habits of this deck are what keep those projects readable.</div>`,
        `<p class="y-chinh">🎯 Ứng dụng thật phức tạp vì <strong>miền bài toán (problem domain)</strong> — phần thế giới thật mà phần mềm phục vụ — vốn rắc rối; một chương trình dùng được phải thể hiện được một phần độ phức tạp đó.</p>
<p><strong>Miền bài toán</strong> = lĩnh vực mà phần mềm nói về: với FAP là sinh viên, môn học, thời khoá biểu, điểm danh, điểm số; với app ngân hàng là khách hàng, tài khoản, giao dịch. Bạn không thể làm FAP đơn giản bằng cách bỏ qua điểm danh — luật đó có thật ở trường, nên code phải giữ nó ở đâu đó.</p>
<p>➕ <strong>"Phức tạp" là cỡ nào?</strong> Học liệu offline của FU viết: ứng dụng hiện đại vượt hàng trăm nghìn đến hàng triệu dòng code, do nhiều lập trình viên viết và sống nhiều năm. Không ai giữ hết trong đầu được. Câu trả lời của kỹ nghệ phần mềm là ghép nó từ các mảnh có <strong>độ kết dính cao (high cohesion)</strong> — mỗi mảnh làm tốt một việc — và <strong>liên kết lỏng (loose coupling)</strong> — các mảnh phụ thuộc nhau càng ít càng tốt; ngôn ngữ hướng đối tượng chính là công cụ cho việc đó.</p>
<div class="callout">🧭 <strong>Đi tiếp — LAB211, PRJ301, Spring Boot</strong>: LAB211 đòi chương trình console vài trăm dòng; Assignment PRJ301 và đồ án LabFlow lên tới hàng nghìn dòng chia trong hàng chục lớp. Thói quen của bộ slide này là thứ giữ cho các dự án đó còn đọc được.</div>`],
      [4, 'Complexity',
        `<p class="y-chinh">🎯 We build a solution by extracting the <strong>most important features</strong> of the problem domain, and there are two ways to cut it: into <strong>activities</strong> (distinct algorithms — verbs) or into <strong>things</strong> (distinct objects — nouns).</p>
<p>The two ways are <strong>not mutually exclusive</strong>: you start with one, and its results become the basis for the other. Listing the nouns of a problem gives you candidate classes; listing the verbs gives you their methods. Then you go round again — the process is <strong>iterative</strong>.</p>
<table>
<thead><tr><th></th><th>Decompose into activities (procedural, PRF192)</th><th>Decompose into things (object-oriented, PRO192)</th></tr></thead>
<tbody>
<tr><td>Question you ask</td><td>"What steps must happen?"</td><td>"What things exist, what does each know, what can each do?"</td></tr>
<tr><td>Unit of code</td><td>a function / procedure</td><td>a class (data + methods together)</td></tr>
<tr><td>Where the data lives</td><td>passed around, often global</td><td>inside the object that owns it</td></tr>
<tr><td>When a rule changes</td><td>hunt every function that touches the data</td><td>change the one class that owns the rule</td></tr>
</tbody>
</table>
<p>➕ The FU material adds a nice note: this choice is older than computers — Heraclitus described the world as <em>process</em>, Democritus as <em>discrete atoms</em>. Slides 5 and 6 show the same enrolment problem cut both ways.</p>`,
        `<p class="y-chinh">🎯 Ta dựng lời giải bằng cách rút ra <strong>các đặc điểm quan trọng nhất</strong> của miền bài toán, và có hai cách cắt: theo <strong>hoạt động (activities)</strong> — các thuật toán riêng biệt, tức động từ — hoặc theo <strong>sự vật (things)</strong> — các đối tượng riêng biệt, tức danh từ.</p>
<p>Hai cách này <strong>không loại trừ nhau (not mutually exclusive)</strong>: bắt đầu bằng một cách, rồi lấy kết quả của nó làm nền cho cách kia. Liệt kê danh từ của bài toán cho bạn các lớp ứng viên; liệt kê động từ cho bạn các phương thức của chúng. Rồi lặp lại vòng nữa — quá trình này <strong>lặp đi lặp lại (iterative)</strong>.</p>
<table>
<thead><tr><th></th><th>Chia theo hoạt động (thủ tục, PRF192)</th><th>Chia theo sự vật (hướng đối tượng, PRO192)</th></tr></thead>
<tbody>
<tr><td>Câu bạn hỏi</td><td>"Phải có những bước nào?"</td><td>"Có những sự vật nào, mỗi thứ biết gì, làm được gì?"</td></tr>
<tr><td>Đơn vị code</td><td>một hàm / thủ tục</td><td>một lớp (dữ liệu + phương thức đi cùng nhau)</td></tr>
<tr><td>Dữ liệu nằm ở đâu</td><td>truyền qua lại, hay để toàn cục</td><td>bên trong đối tượng sở hữu nó</td></tr>
<tr><td>Khi một luật thay đổi</td><td>đi lùng mọi hàm đụng vào dữ liệu</td><td>sửa đúng một lớp sở hữu luật đó</td></tr>
</tbody>
</table>
<p>➕ Học liệu FU thêm một ý hay: lựa chọn này còn cổ hơn máy tính — Heraclitus mô tả thế giới là <em>quá trình</em>, Democritus mô tả là <em>các nguyên tử rời rạc</em>. Slide 5 và 6 cắt cùng bài toán ghi danh theo cả hai cách.</p>`],
      [5, 'Complexity Example',
        `<p class="y-chinh">🎯 The example: a course enrolment system where each participant enrols in several face-to-face courses, enrols in several hybrid courses, and earns a grade in each. A <strong>structure diagram</strong> splits it into three <em>activities</em>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/43d13ce1527e6c952ec283d8239e5bf5ce70f204.svg" alt="Slide 5 redrawn: the problem as a tree of activities (verbs)" loading="lazy" /><p class="chu-thich">🧩 Slide 5 redrawn: the problem as a tree of activities (verbs)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startwbs
title Slide 5 redrawn — structure chart: the problem split into ACTIVITIES
' The procedural view: one root task broken into steps
* Course Participation
** Enroll in a Course
** Enroll in a Hybrid Course
** Earn a Grade
@endwbs</code></pre></details>
<p>In code, "activities" means procedures that work on data kept somewhere else — here in parallel arrays, exactly the PRF192 style:</p>
<pre class="trich"><code class="language-java">static String[] codes = new String[10];
static boolean[] hybrid = new boolean[10];
static double[] grades = new double[10];
static int count = 0;

static void enrollInCourse(String code)       { codes[count] = code; hybrid[count] = false; grades[count] = -1; count++; }
static void enrollInHybridCourse(String code) { codes[count] = code; hybrid[count] = true;  grades[count] = -1; count++; }
static void earnGrade(String code, double g)  { for (int i = 0; i &lt; count; i++) if (codes[i].equals(code)) grades[i] = g; }</code></pre>
<p>It works for this toy, but look at the cost: four arrays must stay in step by index, any function can change any grade, and adding "a hybrid course has an online platform" means a fifth array and edits in every procedure.</p>
<div class="pitfall">FE trap: a structure chart (activity tree) is a <strong>procedural</strong> design tool, not a UML class diagram. If a question shows boxes like "Enroll in a Course" connected as a tree, the answer is "decomposition into activities/algorithms".</div>`,
        `<p class="y-chinh">🎯 Ví dụ: hệ thống ghi danh khoá học, mỗi người tham gia ghi danh vài môn học trực tiếp (face-to-face), ghi danh vài môn học kết hợp (hybrid — vừa online vừa trên lớp) và nhận điểm cho từng môn. Một <strong>sơ đồ cấu trúc (structure diagram)</strong> chia nó thành ba <em>hoạt động</em>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/43d13ce1527e6c952ec283d8239e5bf5ce70f204.svg" alt="Slide 5 vẽ lại: bài toán thành cây các hoạt động (động từ)" loading="lazy" /><p class="chu-thich">🧩 Slide 5 vẽ lại: bài toán thành cây các hoạt động (động từ)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startwbs
title Slide 5 redrawn — structure chart: the problem split into ACTIVITIES
' Góc nhìn thủ tục: một việc gốc chia thành các bước
* Course Participation
** Enroll in a Course
** Enroll in a Hybrid Course
** Earn a Grade
@endwbs</code></pre></details>
<p>Trong code, "hoạt động" nghĩa là các thủ tục làm việc trên dữ liệu đặt ở chỗ khác — ở đây là các mảng song song, đúng kiểu PRF192:</p>
<pre class="trich"><code class="language-java">static String[] codes = new String[10];
static boolean[] hybrid = new boolean[10];
static double[] grades = new double[10];
static int count = 0;

static void enrollInCourse(String code)       { codes[count] = code; hybrid[count] = false; grades[count] = -1; count++; }
static void enrollInHybridCourse(String code) { codes[count] = code; hybrid[count] = true;  grades[count] = -1; count++; }
static void earnGrade(String code, double g)  { for (int i = 0; i &lt; count; i++) if (codes[i].equals(code)) grades[i] = g; }</code></pre>
<p>Với bài đồ chơi thì chạy được, nhưng nhìn cái giá: bốn mảng phải khớp nhau theo chỉ số, hàm nào cũng sửa được điểm nào, và thêm ý "môn hybrid có nền tảng học online" nghĩa là thêm mảng thứ năm và sửa mọi thủ tục.</p>
<div class="pitfall">Bẫy FE: sơ đồ cấu trúc (cây hoạt động) là công cụ thiết kế <strong>thủ tục</strong>, không phải sơ đồ lớp UML. Câu hỏi nào cho các hộp như "Enroll in a Course" nối thành cây thì đáp án là "chia theo hoạt động/thuật toán".</div>`],
      [6, 'Complexity Example',
        `<p class="y-chinh">🎯 Switching attention to the <strong>objects</strong>: there is a Course and a Hybrid Course; a Course <em>has a</em> Code and <em>uses a</em> Grading Scheme; a Hybrid Course <em>is a kind of</em> Course. The activities now become part of the objects' own description.</p>
<p>The slide's picture uses Seneca's home-made notation (a filled circle for "has a", an open circle for "uses a", an arrow for "is a kind of"). Here is the same picture in standard <strong>UML</strong> — the notation you will use in SWD392 and in every design document:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b7fce094152f305539cc1735a82003e892a60e6b.svg" alt="Slide 6 in UML: composition (has a), dependency (uses a), generalization (is a kind of)" loading="lazy" /><p class="chu-thich">🧩 Slide 6 in UML: composition (has a), dependency (uses a), generalization (is a kind of)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 6 redrawn in standard UML — the problem split into THINGS
' Slide notation → UML: filled circle "has a" → composition ◆, open circle "uses a" → dependency (dashed), arrow "is a kind of" → generalization △
hide empty members
class Code
class Course
class "Grading Scheme" as GradingScheme
class "Hybrid Course" as HybridCourse
Course *-- Code : has a &gt;
Course ..&gt; GradingScheme : uses a &gt;
HybridCourse --|&gt; Course : is a kind of
@enduml</code></pre></details>
<p>The same enrolment, now built from things. The verbs of slide 5 did not disappear — <code>enroll</code> and <code>earnGrade</code> became methods of <code>Participant</code>, and "which mode is this course" became <code>Course.mode()</code>:</p>
<pre><code class="language-java">// release: 8
// Slides 4–6: the SAME course-enrolment problem decomposed two ways — into activities (procedures) and into things (objects)
import java.util.ArrayList;
import java.util.List;

public class ThuTucVaDoiTuong {

    // ── Way 1 — activities (slide 5): data in parallel arrays, verbs as free-standing procedures
    static String[] codes = new String[10];
    static boolean[] hybrid = new boolean[10];
    static double[] grades = new double[10];
    static int count = 0;

    static void enrollInCourse(String code)       { codes[count] = code; hybrid[count] = false; grades[count] = -1; count++; }
    static void enrollInHybridCourse(String code) { codes[count] = code; hybrid[count] = true;  grades[count] = -1; count++; }
    static void earnGrade(String code, double g)  { for (int i = 0; i &lt; count; i++) if (codes[i].equals(code)) grades[i] = g; }

    public static void main(String[] args) {
        System.out.println("Way 1 - activities:");
        enrollInCourse("PRO192");
        enrollInHybridCourse("MAE101");
        earnGrade("PRO192", 8.5);
        earnGrade("MAE101", 7.0);
        for (int i = 0; i &lt; count; i++)
            System.out.println("  " + codes[i] + " (" + (hybrid[i] ? "hybrid" : "face-to-face") + ") grade " + grades[i]);

        System.out.println("Way 2 - things:");
        Participant an = new Participant("An");
        an.enroll(new Course("PRO192"));
        an.enroll(new HybridCourse("MAE101"));
        an.earnGrade("PRO192", 8.5);
        an.earnGrade("MAE101", 7.0);
        an.printTranscript();
    }
}

// ── Way 2 — things (slide 6): each noun becomes a class that keeps its own data AND its own behaviour
class Course {
    private final String code;                          // a Course HAS a Code
    Course(String code) { this.code = code; }
    String getCode() { return code; }
    String mode() { return "face-to-face"; }
}

class HybridCourse extends Course {                     // a Hybrid Course IS A KIND OF Course
    HybridCourse(String code) { super(code); }
    @Override
    String mode() { return "hybrid"; }
}

class Enrollment {
    final Course course;
    double grade = -1;                                  // -1 = no grade yet
    Enrollment(Course course) { this.course = course; }
}

class Participant {
    private final String name;
    private final List&lt;Enrollment&gt; enrollments = new ArrayList&lt;&gt;();
    Participant(String name) { this.name = name; }

    void enroll(Course c) { enrollments.add(new Enrollment(c)); }
    void earnGrade(String code, double g) {
        for (Enrollment e : enrollments) if (e.course.getCode().equals(code)) e.grade = g;
    }
    void printTranscript() {
        for (Enrollment e : enrollments)
            System.out.println("  " + name + ": " + e.course.getCode() + " (" + e.course.mode() + ") grade " + e.grade);
    }
}</code></pre>
<div class="out">Way 1 - activities:<br>
&nbsp;&nbsp;PRO192 (face-to-face) grade 8.5<br>
&nbsp;&nbsp;MAE101 (hybrid) grade 7.0<br>
Way 2 - things:<br>
&nbsp;&nbsp;An: PRO192 (face-to-face) grade 8.5<br>
&nbsp;&nbsp;An: MAE101 (hybrid) grade 7.0</div>
<p>Both halves print the same transcript. The difference is where knowledge lives: in Way 2 only <code>HybridCourse</code> knows it is hybrid, and no line outside <code>Participant</code> can touch its list of enrolments.</p>
<p class="meo">🧠 Read relationships aloud: "Course <strong>has a</strong> Code" → a field; "Course <strong>uses a</strong> GradingScheme" → a parameter or local variable; "HybridCourse <strong>is a kind of</strong> Course" → <code>extends</code>.</p>`,
        `<p class="y-chinh">🎯 Chuyển sự chú ý sang các <strong>đối tượng</strong>: có Course (môn học) và Hybrid Course (môn kết hợp); Course <em>có một (has a)</em> Code, <em>dùng một (uses a)</em> Grading Scheme (thang chấm điểm); Hybrid Course <em>là một loại (is a kind of)</em> Course. Các hoạt động giờ trở thành một phần mô tả của chính đối tượng.</p>
<p>Hình trên slide dùng ký hiệu tự chế của Seneca (chấm tròn đặc = "has a", chấm tròn rỗng = "uses a", mũi tên = "is a kind of"). Đây là cùng hình đó bằng <strong>UML</strong> chuẩn — ký hiệu bạn sẽ dùng ở SWD392 và trong mọi tài liệu thiết kế:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b7fce094152f305539cc1735a82003e892a60e6b.svg" alt="Slide 6 bằng UML: hợp thành (has a), phụ thuộc (uses a), tổng quát hoá (is a kind of)" loading="lazy" /><p class="chu-thich">🧩 Slide 6 bằng UML: hợp thành (has a), phụ thuộc (uses a), tổng quát hoá (is a kind of)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 6 redrawn in standard UML — the problem split into THINGS
' Ký hiệu slide → UML: chấm tròn đặc "has a" → hợp thành ◆, chấm rỗng "uses a" → phụ thuộc (nét đứt), mũi tên "is a kind of" → tổng quát hoá △
hide empty members
class Code
class Course
class "Grading Scheme" as GradingScheme
class "Hybrid Course" as HybridCourse
Course *-- Code : has a &gt;
Course ..&gt; GradingScheme : uses a &gt;
HybridCourse --|&gt; Course : is a kind of
@enduml</code></pre></details>
<p>Cùng việc ghi danh, giờ dựng từ sự vật. Các động từ của slide 5 không biến mất — <code>enroll</code> và <code>earnGrade</code> thành phương thức của <code>Participant</code>, còn "môn này học kiểu gì" thành <code>Course.mode()</code>:</p>
<pre><code class="language-java">// release: 8
// Slide 4–6: CÙNG bài toán ghi danh khoá học, chia theo hai cách — thành hoạt động (thủ tục) và thành sự vật (đối tượng)
import java.util.ArrayList;
import java.util.List;

public class ThuTucVaDoiTuong {

    // Cách 1 — hoạt động (slide 5): dữ liệu trong các mảng song song, động từ là các thủ tục rời ──
    static String[] codes = new String[10];
    static boolean[] hybrid = new boolean[10];
    static double[] grades = new double[10];
    static int count = 0;

    static void enrollInCourse(String code)       { codes[count] = code; hybrid[count] = false; grades[count] = -1; count++; }
    static void enrollInHybridCourse(String code) { codes[count] = code; hybrid[count] = true;  grades[count] = -1; count++; }
    static void earnGrade(String code, double g)  { for (int i = 0; i &lt; count; i++) if (codes[i].equals(code)) grades[i] = g; }

    public static void main(String[] args) {
        System.out.println("Way 1 - activities:");
        enrollInCourse("PRO192");
        enrollInHybridCourse("MAE101");
        earnGrade("PRO192", 8.5);
        earnGrade("MAE101", 7.0);
        for (int i = 0; i &lt; count; i++)
            System.out.println("  " + codes[i] + " (" + (hybrid[i] ? "hybrid" : "face-to-face") + ") grade " + grades[i]);

        System.out.println("Way 2 - things:");
        Participant an = new Participant("An");
        an.enroll(new Course("PRO192"));
        an.enroll(new HybridCourse("MAE101"));
        an.earnGrade("PRO192", 8.5);
        an.earnGrade("MAE101", 7.0);
        an.printTranscript();
    }
}

// Cách 2 — sự vật (slide 6): mỗi danh từ thành một lớp giữ dữ liệu VÀ hành vi của chính nó ──
class Course {
    private final String code;                          // Course CÓ một Code
    Course(String code) { this.code = code; }
    String getCode() { return code; }
    String mode() { return "face-to-face"; }
}

class HybridCourse extends Course {                     // Hybrid Course LÀ MỘT LOẠI Course
    HybridCourse(String code) { super(code); }
    @Override
    String mode() { return "hybrid"; }
}

class Enrollment {
    final Course course;
    double grade = -1;                                  // -1 = chưa có điểm
    Enrollment(Course course) { this.course = course; }
}

class Participant {
    private final String name;
    private final List&lt;Enrollment&gt; enrollments = new ArrayList&lt;&gt;();
    Participant(String name) { this.name = name; }

    void enroll(Course c) { enrollments.add(new Enrollment(c)); }
    void earnGrade(String code, double g) {
        for (Enrollment e : enrollments) if (e.course.getCode().equals(code)) e.grade = g;
    }
    void printTranscript() {
        for (Enrollment e : enrollments)
            System.out.println("  " + name + ": " + e.course.getCode() + " (" + e.course.mode() + ") grade " + e.grade);
    }
}</code></pre>
<div class="out">Way 1 - activities:<br>
&nbsp;&nbsp;PRO192 (face-to-face) grade 8.5<br>
&nbsp;&nbsp;MAE101 (hybrid) grade 7.0<br>
Way 2 - things:<br>
&nbsp;&nbsp;An: PRO192 (face-to-face) grade 8.5<br>
&nbsp;&nbsp;An: MAE101 (hybrid) grade 7.0</div>
<p>Hai nửa in ra cùng một bảng điểm. Khác nhau ở chỗ kiến thức nằm đâu: ở Cách 2 chỉ <code>HybridCourse</code> biết nó là hybrid, và không dòng nào ngoài <code>Participant</code> chạm được vào danh sách ghi danh của nó.</p>
<p class="meo">🧠 Đọc to quan hệ: "Course <strong>có một</strong> Code" → một trường (field); "Course <strong>dùng một</strong> GradingScheme" → một tham số hay biến cục bộ; "HybridCourse <strong>là một loại</strong> Course" → <code>extends</code>.</p>`],
      [7, 'Object Terminology',
        `<p class="y-chinh">🎯 Object-oriented thinking rests on <strong>four fundamental concepts</strong>: abstraction, encapsulation, hierarchy and polymorphism. Slides 8–15 take them one by one.</p>
<p>➕ Why "objects" and "chunks"? The FU material cites George Miller (Princeton): people can hold only about <strong>seven chunks</strong> of information at once. An object is a chunk: instead of remembering forty variables and functions, you remember "a Student", "a Course", "an Enrollment" and trust each to manage its own details.</p>
<div class="pitfall">Naming trap: this deck says <strong>Hierarchy</strong>, but slide 16, Core Java and most FE questions list the four pillars as <strong>abstraction, encapsulation, inheritance, polymorphism</strong>. Hierarchy is the wider word (it also covers "has a"); inheritance is the "is a kind of" half of it. If an FE option says "inheritance", that is the pillar.</div>`,
        `<p class="y-chinh">🎯 Tư duy hướng đối tượng đứng trên <strong>bốn khái niệm nền</strong>: trừu tượng, đóng gói, phân cấp và đa hình. Slide 8–15 đi từng khái niệm một.</p>
<p>➕ Vì sao lại là "đối tượng" và "mảng thông tin (chunk)"? Học liệu FU dẫn nghiên cứu của George Miller (Princeton): con người chỉ giữ được khoảng <strong>bảy mảng thông tin</strong> cùng lúc. Một đối tượng là một mảng: thay vì nhớ bốn mươi biến và hàm, bạn nhớ "một Student", "một Course", "một Enrollment" và tin mỗi thứ tự lo phần chi tiết của nó.</p>
<div class="pitfall">Bẫy tên gọi: bộ slide này nói <strong>Hierarchy (phân cấp)</strong>, nhưng slide 16, sách Core Java và phần lớn câu FE kể bốn trụ cột là <strong>abstraction, encapsulation, inheritance, polymorphism</strong>. Hierarchy là từ rộng hơn (gồm cả quan hệ "has a"); inheritance (kế thừa) là nửa "is a kind of" của nó. Phương án FE ghi "inheritance" thì đó là trụ cột.</div>`],
      [8, 'Abstraction',
        `<p class="y-chinh">🎯 Abstraction reduces the complexity of a problem domain: each object is an abstraction of <strong>one important aspect</strong> of the domain, and ignores the <strong>non-essential features</strong>.</p>
<p>The slide's picture: a bookshelf labelled "Problem Domain", and three arrows marked "Abstraction" pulling out <em>Notes a</em>, <em>Book a</em> and <em>Book b</em>. Out of everything a real book has (paper weight, smell, price history), a library program keeps only title, author, pages — what it needs.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/06f4744c45195e4758bd96e63de86aa72838f1b0.svg" alt="Slides 8 and 11 redrawn: classes Book and Notes, and the three objects taken from the shelf" loading="lazy" /><p class="chu-thich">🧩 Slides 8 and 11 redrawn: classes Book and Notes, and the three objects taken from the shelf</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 8 and 11 redrawn — abstraction picks objects out of the problem domain; a class is their common structure
' Two classes, three objects (instances)
class Book {
  - title : String
  - author : String
  + page(n : int) : String
}
class Notes {
  - sheets : List&lt;String&gt;
  + shuffleToFront(n : int) : void
}
object "bookA : Book" as bookA {
  title = "Core Java I"
  author = "Horstmann"
}
object "bookB : Book" as bookB {
  title = "Effective Java"
  author = "Bloch"
}
object "notesA : Notes" as notesA {
  sheets = [OOP, JVM, PE tips]
}
Book ..&gt; bookA : &lt;&lt;instantiate&gt;&gt;
Book ..&gt; bookB : &lt;&lt;instantiate&gt;&gt;
Notes ..&gt; notesA : &lt;&lt;instantiate&gt;&gt;
@enduml</code></pre></details>
<p><strong>What is "essential" depends on the program</strong>, not on the thing. For a library, a book's weight is noise; for a shipping company, weight is the most important field. That is why there is no single correct <code>Book</code> class — there is the right abstraction for <em>this</em> problem.</p>
<p class="meo">🧠 Abstraction = a good map: a metro map drops streets and distances, keeps stations and lines — useless for driving, perfect for the metro.</p>`,
        `<p class="y-chinh">🎯 Trừu tượng hoá (abstraction) làm giảm độ phức tạp của miền bài toán: mỗi đối tượng là bản trừu tượng của <strong>một khía cạnh quan trọng</strong> trong miền, và bỏ qua <strong>các đặc điểm không thiết yếu</strong>.</p>
<p>Hình trên slide: một giá sách ghi "Problem Domain", ba mũi tên ghi "Abstraction" rút ra <em>Notes a</em>, <em>Book a</em> và <em>Book b</em>. Trong mọi thứ một cuốn sách thật có (định lượng giấy, mùi, lịch sử giá), chương trình thư viện chỉ giữ tên sách, tác giả, các trang — đúng thứ nó cần.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/06f4744c45195e4758bd96e63de86aa72838f1b0.svg" alt="Slide 8 và 11 vẽ lại: lớp Book và Notes, cùng ba đối tượng lấy ra từ giá sách" loading="lazy" /><p class="chu-thich">🧩 Slide 8 và 11 vẽ lại: lớp Book và Notes, cùng ba đối tượng lấy ra từ giá sách</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 8 and 11 redrawn — abstraction picks objects out of the problem domain; a class is their common structure
' Hai lớp, ba đối tượng (thể hiện)
class Book {
  - title : String
  - author : String
  + page(n : int) : String
}
class Notes {
  - sheets : List&lt;String&gt;
  + shuffleToFront(n : int) : void
}
object "bookA : Book" as bookA {
  title = "Core Java I"
  author = "Horstmann"
}
object "bookB : Book" as bookB {
  title = "Effective Java"
  author = "Bloch"
}
object "notesA : Notes" as notesA {
  sheets = [OOP, JVM, PE tips]
}
Book ..&gt; bookA : &lt;&lt;instantiate&gt;&gt;
Book ..&gt; bookB : &lt;&lt;instantiate&gt;&gt;
Notes ..&gt; notesA : &lt;&lt;instantiate&gt;&gt;
@enduml</code></pre></details>
<p><strong>Cái gì là "thiết yếu" tuỳ vào chương trình</strong>, không tuỳ vào đồ vật. Với thư viện, cân nặng cuốn sách là thừa; với công ty vận chuyển, cân nặng lại là trường quan trọng nhất. Vì thế không có một lớp <code>Book</code> đúng duy nhất — chỉ có bản trừu tượng đúng cho <em>bài toán này</em>.</p>
<p class="meo">🧠 Trừu tượng = một tấm bản đồ tốt: bản đồ metro bỏ phố xá và khoảng cách, giữ ga và tuyến — vô dụng khi lái xe, hoàn hảo khi đi metro.</p>`],
      [9, 'Abstraction',
        `<p class="y-chinh">🎯 Each object has a <strong>crisp boundary</strong> that separates it from every other object, and <strong>integrity</strong>: it can only behave in ways appropriate to itself — an ear cannot see, a horse cannot bark.</p>
<p>In Java this is not a polite wish — the <strong>compiler enforces it</strong>. A <code>Horse</code> object offers exactly the methods its class declares. Asking it to <code>bark()</code> is not a runtime surprise; the program never compiles. Real run on JDK 8 (the exam JDK):</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== slide 9: each object behaves only in ways appropriate to itself ==");
    viet(d, "Farm.java",
        "class Horse { void neigh() { System.out.println(\\"Neigh!\\"); } }\\n" +
        "class Dog   { void bark()  { System.out.println(\\"Woof!\\"); } }\\n" +
        "public class Farm {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Horse h = new Horse();\\n" +
        "        h.neigh();\\n" +
        "        h.bark();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Farm.java");
    System.out.println("== slide 13: implementation details hidden inside the object ==");
    viet(d, "School.java",
        "class Student {\\n" +
        "    private double gpa;\\n" +
        "    public boolean setGpa(double g) { if (g &lt; 0 || g &gt; 10) return false; gpa = g; return true; }\\n" +
        "    public double getGpa() { return gpa; }\\n" +
        "}\\n" +
        "public class School {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Student s = new Student();\\n" +
        "        s.gpa = -3;\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "School.java");
}</code></pre>
<div class="out">== slide 9: each object behaves only in ways appropriate to itself ==<br>
&gt; javac Farm.java<br>
Farm.java:7: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;h.bark();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method bark()<br>
&nbsp;&nbsp;location: variable h of type Horse<br>
1 error<br>
(exit code 1)<br>
== slide 13: implementation details hidden inside the object ==<br>
&gt; javac School.java<br>
School.java:9: error: gpa has private access in Student<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;s.gpa = -3;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>Read the first error carefully, you will see it hundreds of times: <code>cannot find symbol</code> + <code>symbol: method bark()</code> + <code>location: variable h of type Horse</code> = "type Horse has no method called bark". The second error is slide 13's encapsulation, enforced the same way.</p>
<p>➕ The FU material contrasts a <strong>book</strong> (bound pages, fixed order) with <strong>notes</strong> (loose sheets you can reorder): different objects, different boundaries, different allowed behaviour. In the program for slides 10–11 below, <code>Notes</code> has <code>shuffleToFront</code> and <code>Book</code> simply has no such method.</p>`,
        `<p class="y-chinh">🎯 Mỗi đối tượng có <strong>đường biên rõ ràng (crisp boundary)</strong> tách nó khỏi mọi đối tượng khác, và có <strong>tính toàn vẹn (integrity)</strong>: nó chỉ cư xử theo cách phù hợp với chính nó — tai không nhìn được, ngựa không sủa được.</p>
<p>Trong Java đây không phải lời khuyên lịch sự — <strong>trình biên dịch canh giữ</strong> nó. Một đối tượng <code>Horse</code> chỉ có đúng các phương thức mà lớp của nó khai báo. Bắt nó <code>bark()</code> không phải bất ngờ lúc chạy; chương trình không bao giờ biên dịch được. Chạy thật trên JDK 8 (JDK của phòng thi):</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== slide 9: each object behaves only in ways appropriate to itself ==");
    viet(d, "Farm.java",
        "class Horse { void neigh() { System.out.println(\\"Neigh!\\"); } }\\n" +
        "class Dog   { void bark()  { System.out.println(\\"Woof!\\"); } }\\n" +
        "public class Farm {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Horse h = new Horse();\\n" +
        "        h.neigh();\\n" +
        "        h.bark();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Farm.java");
    System.out.println("== slide 13: implementation details hidden inside the object ==");
    viet(d, "School.java",
        "class Student {\\n" +
        "    private double gpa;\\n" +
        "    public boolean setGpa(double g) { if (g &lt; 0 || g &gt; 10) return false; gpa = g; return true; }\\n" +
        "    public double getGpa() { return gpa; }\\n" +
        "}\\n" +
        "public class School {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Student s = new Student();\\n" +
        "        s.gpa = -3;\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "School.java");
}</code></pre>
<div class="out">== slide 9: each object behaves only in ways appropriate to itself ==<br>
&gt; javac Farm.java<br>
Farm.java:7: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;h.bark();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method bark()<br>
&nbsp;&nbsp;location: variable h of type Horse<br>
1 error<br>
(exit code 1)<br>
== slide 13: implementation details hidden inside the object ==<br>
&gt; javac School.java<br>
School.java:9: error: gpa has private access in Student<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;s.gpa = -3;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>Đọc kỹ lỗi thứ nhất, bạn sẽ gặp nó hàng trăm lần: <code>cannot find symbol</code> (không tìm thấy ký hiệu) + <code>symbol: method bark()</code> + <code>location: variable h of type Horse</code> = "kiểu Horse không có phương thức nào tên bark". Lỗi thứ hai là tính đóng gói của slide 13, cũng được canh giữ y như vậy.</p>
<p>➕ Học liệu FU so sánh <strong>cuốn sách</strong> (trang đóng gáy, thứ tự cố định) với <strong>tập ghi chú</strong> (tờ rời, sắp lại được): đối tượng khác nhau, đường biên khác nhau, hành vi được phép khác nhau. Trong chương trình của slide 10–11 bên dưới, <code>Notes</code> có <code>shuffleToFront</code> còn <code>Book</code> đơn giản là không có phương thức đó.</p>`],
      [10, 'Abstraction',
        `<p class="y-chinh">🎯 Many objects with similar features and similar behaviour share a <strong>common structure</strong>; the description of that structure is a <strong>class</strong> — it describes the <em>data</em> an object holds and the <em>behaviour</em> of the object.</p>
<p>This is the yellow box of the slide and the most important definition of the chapter. A class is not an object; it is the <strong>blueprint</strong> (the cookie cutter). It says "every Book has a title, an author and pages, and can return a page"; it does not say which title.</p>
<pre class="trich"><code class="language-java">class Book {                                     // the CLASS: every book has a title and an author
    private final String title;
    private final String author;
    private final List&lt;String&gt; pages = new ArrayList&lt;&gt;();

    Book(String title, String author, String... pageTexts) {
        this.title = title;
        this.author = author;
        Collections.addAll(pages, pageTexts);
    }
    String describe() { return "\\"" + title + "\\" by " + author + ", " + pages.size() + " bound pages"; }
    String page(int n) { return pages.get(n - 1); }          // a book can be read page by page…
}                                                             // …but has NO method to reorder its pages

class Notes {                                   // a different abstraction: loose pages
    private final List&lt;String&gt; sheets = new ArrayList&lt;&gt;();
    void add(String sheet) { sheets.add(sheet); }
    void shuffleToFront(int n) { sheets.add(0, sheets.remove(n - 1)); }   // notes CAN be rearranged
    String describe() { return sheets.size() + " loose sheets " + sheets; }
}</code></pre>
<p>Two parts in every class, matching the slide's "data and behaviour": <strong>fields</strong> (the data: <code>title</code>, <code>author</code>, <code>pages</code>) and <strong>methods</strong> (the behaviour: <code>describe()</code>, <code>page(n)</code>). The constructor <code>Book(…)</code> is the special method that fills the fields of a new object — Chapter 2 is all about it.</p>
<p class="meo">🧠 Class = the form you print; object = each filled-in copy. One form, as many copies as you like.</p>`,
        `<p class="y-chinh">🎯 Nhiều đối tượng có đặc điểm giống nhau và cư xử giống nhau thì dùng chung một <strong>cấu trúc chung</strong>; bản mô tả cấu trúc đó gọi là <strong>lớp (class)</strong> — nó mô tả <em>dữ liệu</em> mà đối tượng giữ và <em>hành vi</em> của đối tượng.</p>
<p>Đây là ô vàng trên slide và là định nghĩa quan trọng nhất của chương. Lớp không phải đối tượng; nó là <strong>bản thiết kế (blueprint)</strong> — cái khuôn bánh. Nó nói "cuốn Book nào cũng có tên, tác giả và các trang, và trả về được một trang"; nó không nói tên sách nào.</p>
<pre class="trich"><code class="language-java">class Book {                                     // LỚP: cuốn sách nào cũng có tên và tác giả
    private final String title;
    private final String author;
    private final List&lt;String&gt; pages = new ArrayList&lt;&gt;();

    Book(String title, String author, String... pageTexts) {
        this.title = title;
        this.author = author;
        Collections.addAll(pages, pageTexts);
    }
    String describe() { return "\\"" + title + "\\" by " + author + ", " + pages.size() + " bound pages"; }
    String page(int n) { return pages.get(n - 1); }          // sách thì đọc từng trang…
}                                                             // …nhưng KHÔNG có phương thức nào đảo trang

class Notes {                                   // một trừu tượng khác: các tờ rời
    private final List&lt;String&gt; sheets = new ArrayList&lt;&gt;();
    void add(String sheet) { sheets.add(sheet); }
    void shuffleToFront(int n) { sheets.add(0, sheets.remove(n - 1)); }   // ghi chú THÌ sắp lại được
    String describe() { return sheets.size() + " loose sheets " + sheets; }
}</code></pre>
<p>Mỗi lớp có hai phần, đúng như "dữ liệu và hành vi" trên slide: <strong>trường (field)</strong> — dữ liệu: <code>title</code>, <code>author</code>, <code>pages</code> — và <strong>phương thức (method)</strong> — hành vi: <code>describe()</code>, <code>page(n)</code>. Constructor (hàm khởi tạo) <code>Book(…)</code> là phương thức đặc biệt điền các trường cho một đối tượng mới — Chương 2 nói kỹ về nó.</p>
<p class="meo">🧠 Lớp = tờ mẫu đơn bạn in ra; đối tượng = từng bản đã điền. Một mẫu, bao nhiêu bản cũng được.</p>`],
      [11, 'Abstraction Classes and Objects',
        `<p class="y-chinh">🎯 Objects of one class share the <strong>same set of variables and types</strong> but hold <strong>different values</strong> (their state); each object is an <strong>instance</strong> of its class — "object" and "instance" mean the same thing.</p>
<p>The slide's picture: the classes <em>Notes</em> and <em>Book</em> (dashed ovals) produce, by <strong>instantiation</strong>, the objects <em>Notes a</em>, <em>Book a</em> and <em>Book b</em>. In Java, instantiation is the keyword <code>new</code>:</p>
<pre><code class="language-java">// release: 8
// Slides 8–11: one class = one common structure; many objects = many different states
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Book {                                     // the CLASS: every book has a title and an author
    private final String title;
    private final String author;
    private final List&lt;String&gt; pages = new ArrayList&lt;&gt;();

    Book(String title, String author, String... pageTexts) {
        this.title = title;
        this.author = author;
        Collections.addAll(pages, pageTexts);
    }
    String describe() { return "\\"" + title + "\\" by " + author + ", " + pages.size() + " bound pages"; }
    String page(int n) { return pages.get(n - 1); }          // a book can be read page by page…
}                                                             // …but has NO method to reorder its pages

class Notes {                                   // a different abstraction: loose pages
    private final List&lt;String&gt; sheets = new ArrayList&lt;&gt;();
    void add(String sheet) { sheets.add(sheet); }
    void shuffleToFront(int n) { sheets.add(0, sheets.remove(n - 1)); }   // notes CAN be rearranged
    String describe() { return sheets.size() + " loose sheets " + sheets; }
}

public class LopVaDoiTuong {
    public static void main(String[] args) {
        Book bookA = new Book("Core Java I", "Horstmann", "ch1", "ch2", "ch3");   // instance 1
        Book bookB = new Book("Effective Java", "Bloch", "item1", "item2");        // instance 2
        Notes notesA = new Notes();
        notesA.add("OOP"); notesA.add("JVM"); notesA.add("PE tips");

        System.out.println("bookA:  " + bookA.describe());
        System.out.println("bookB:  " + bookB.describe());
        System.out.println("bookA page 2: " + bookA.page(2));
        notesA.shuffleToFront(3);
        System.out.println("notesA: " + notesA.describe());

        System.out.println("same class?   " + (bookA.getClass() == bookB.getClass()));
        System.out.println("same object?  " + (bookA == bookB));
    }
}</code></pre>
<div class="out">bookA: &nbsp;"Core Java I" by Horstmann, 3 bound pages<br>
bookB: &nbsp;"Effective Java" by Bloch, 2 bound pages<br>
bookA page 2: ch2<br>
notesA: 3 loose sheets [PE tips, OOP, JVM]<br>
same class? &nbsp;&nbsp;true<br>
same object? &nbsp;false</div>
<p>Read the last two lines: <code>bookA</code> and <code>bookB</code> come from the <strong>same class</strong> (<code>true</code>) but are <strong>different objects</strong> (<code>false</code>) — same structure, different state. <code>==</code> on objects asks "is this the very same object?", not "do they have equal values?" — the root of the famous String-comparison bug in Chapter 1.</p>
<table>
<thead><tr><th>Word</th><th>Meaning</th><th>In the program</th></tr></thead>
<tbody>
<tr><td>class</td><td>the common structure</td><td><code>Book</code>, <code>Notes</code></td></tr>
<tr><td>object = instance</td><td>one concrete thing built from a class</td><td><code>bookA</code>, <code>bookB</code>, <code>notesA</code></td></tr>
<tr><td>state</td><td>the current values of an object's fields</td><td>title "Core Java I", 3 pages</td></tr>
<tr><td>instantiation</td><td>creating an object from a class</td><td><code>new Book(...)</code></td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Các đối tượng cùng lớp có <strong>cùng bộ biến và kiểu</strong> nhưng giữ <strong>giá trị khác nhau</strong> (trạng thái — state); mỗi đối tượng là một <strong>thể hiện (instance)</strong> của lớp — "object" và "instance" là một nghĩa.</p>
<p>Hình trên slide: lớp <em>Notes</em> và <em>Book</em> (hình bầu dục nét đứt) tạo ra, bằng <strong>sự tạo thể hiện (instantiation)</strong>, các đối tượng <em>Notes a</em>, <em>Book a</em> và <em>Book b</em>. Trong Java, tạo thể hiện chính là từ khoá <code>new</code>:</p>
<pre><code class="language-java">// release: 8
// Slide 8–11: một lớp = một cấu trúc chung; nhiều đối tượng = nhiều trạng thái khác nhau
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Book {                                     // LỚP: cuốn sách nào cũng có tên và tác giả
    private final String title;
    private final String author;
    private final List&lt;String&gt; pages = new ArrayList&lt;&gt;();

    Book(String title, String author, String... pageTexts) {
        this.title = title;
        this.author = author;
        Collections.addAll(pages, pageTexts);
    }
    String describe() { return "\\"" + title + "\\" by " + author + ", " + pages.size() + " bound pages"; }
    String page(int n) { return pages.get(n - 1); }          // sách thì đọc từng trang…
}                                                             // …nhưng KHÔNG có phương thức nào đảo trang

class Notes {                                   // một trừu tượng khác: các tờ rời
    private final List&lt;String&gt; sheets = new ArrayList&lt;&gt;();
    void add(String sheet) { sheets.add(sheet); }
    void shuffleToFront(int n) { sheets.add(0, sheets.remove(n - 1)); }   // ghi chú THÌ sắp lại được
    String describe() { return sheets.size() + " loose sheets " + sheets; }
}

public class LopVaDoiTuong {
    public static void main(String[] args) {
        Book bookA = new Book("Core Java I", "Horstmann", "ch1", "ch2", "ch3");   // thể hiện 1
        Book bookB = new Book("Effective Java", "Bloch", "item1", "item2");        // thể hiện 2
        Notes notesA = new Notes();
        notesA.add("OOP"); notesA.add("JVM"); notesA.add("PE tips");

        System.out.println("bookA:  " + bookA.describe());
        System.out.println("bookB:  " + bookB.describe());
        System.out.println("bookA page 2: " + bookA.page(2));
        notesA.shuffleToFront(3);
        System.out.println("notesA: " + notesA.describe());

        System.out.println("same class?   " + (bookA.getClass() == bookB.getClass()));
        System.out.println("same object?  " + (bookA == bookB));
    }
}</code></pre>
<div class="out">bookA: &nbsp;"Core Java I" by Horstmann, 3 bound pages<br>
bookB: &nbsp;"Effective Java" by Bloch, 2 bound pages<br>
bookA page 2: ch2<br>
notesA: 3 loose sheets [PE tips, OOP, JVM]<br>
same class? &nbsp;&nbsp;true<br>
same object? &nbsp;false</div>
<p>Đọc hai dòng cuối: <code>bookA</code> và <code>bookB</code> từ <strong>cùng một lớp</strong> (<code>true</code>) nhưng là <strong>hai đối tượng khác nhau</strong> (<code>false</code>) — cùng cấu trúc, khác trạng thái. <code>==</code> trên đối tượng hỏi "có phải đúng cùng một đối tượng không?", chứ không hỏi "giá trị có bằng nhau không?" — gốc của lỗi so sánh String nổi tiếng ở Chương 1.</p>
<table>
<thead><tr><th>Từ</th><th>Nghĩa</th><th>Trong chương trình</th></tr></thead>
<tbody>
<tr><td>class (lớp)</td><td>cấu trúc chung</td><td><code>Book</code>, <code>Notes</code></td></tr>
<tr><td>object = instance (đối tượng = thể hiện)</td><td>một thứ cụ thể dựng từ lớp</td><td><code>bookA</code>, <code>bookB</code>, <code>notesA</code></td></tr>
<tr><td>state (trạng thái)</td><td>giá trị hiện tại của các trường của đối tượng</td><td>tên "Core Java I", 3 trang</td></tr>
<tr><td>instantiation (tạo thể hiện)</td><td>tạo đối tượng từ lớp</td><td><code>new Book(...)</code></td></tr>
</tbody>
</table>`],
      [12, 'Encapsulation',
        `<p class="y-chinh">🎯 Encapsulation separates an object's <strong>implementation details</strong> from its <strong>external appearance</strong>; it combines, inside the object, the <strong>data</strong> that describes its state and the <strong>algorithms</strong> that define its behaviour.</p>
<p>The slide's picture: <em>Data</em> + <em>Logic</em> → <em>Encapsulation</em> → <em>Object</em>. Two ideas live in that one word, and the FE tests both:</p>
<table>
<thead><tr><th>Idea</th><th>Meaning</th><th>Java tool</th></tr></thead>
<tbody>
<tr><td>bundling</td><td>data and the code that works on it travel together in one class</td><td>fields + methods in the same <code>class</code></td></tr>
<tr><td>information hiding</td><td>the outside world sees only a small public interface</td><td><code>private</code> fields, <code>public</code> methods</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/d6a157386c31b2fd6159bc265b4d53f858d1ad9e.svg" alt="Slides 12–13: what is inside the capsule, and what the client is allowed to see" loading="lazy" /><p class="chu-thich">🧩 Slides 12–13: what is inside the capsule, and what the client is allowed to see</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 12–13 — encapsulation: data + logic inside, only a small public face outside
' The client only sees the public operations
class Student {
  - enroll : String
  - name : String
  - gpa : double
  --
  + Student(enroll : String)
  + setName(name : String) : void
  + setGpa(gpa : double) : boolean
  + getEnroll() : String
  + getName() : String
  + getGpa() : double
}
class "Client code\\n(main, other classes)" as Client
Client ..&gt; Student : calls only + members
note right of Student
  "-" private: invisible outside
  "+" public: the interface
  setGpa rejects -3 or 11
end note
@enduml</code></pre></details>
<p>The FU material calls encapsulation "the primary concept of object-oriented programming": it keeps a class <strong>highly cohesive</strong> inside and <strong>loosely coupled</strong> to its clients — exactly the two goals of slide 3.</p>
<p class="meo">🧠 A capsule pill: you swallow it without knowing the chemistry inside, and the factory can change the recipe without changing how you take it.</p>`,
        `<p class="y-chinh">🎯 Đóng gói (encapsulation) tách <strong>chi tiết cài đặt</strong> của đối tượng khỏi <strong>bộ mặt bên ngoài</strong> của nó; nó gộp, bên trong đối tượng, <strong>dữ liệu</strong> mô tả trạng thái và <strong>thuật toán</strong> định nghĩa hành vi.</p>
<p>Hình trên slide: <em>Data</em> + <em>Logic</em> → <em>Encapsulation</em> → <em>Object</em>. Một từ này chứa hai ý, và đề FE hỏi cả hai:</p>
<table>
<thead><tr><th>Ý</th><th>Nghĩa</th><th>Công cụ Java</th></tr></thead>
<tbody>
<tr><td>gộp (bundling)</td><td>dữ liệu và code xử lý nó đi cùng nhau trong một lớp</td><td>trường + phương thức trong cùng một <code>class</code></td></tr>
<tr><td>che giấu thông tin (information hiding)</td><td>thế giới bên ngoài chỉ thấy một giao diện công khai nhỏ</td><td>trường <code>private</code>, phương thức <code>public</code></td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/d6a157386c31b2fd6159bc265b4d53f858d1ad9e.svg" alt="Slide 12–13: bên trong viên nang có gì, và bên dùng được phép thấy gì" loading="lazy" /><p class="chu-thich">🧩 Slide 12–13: bên trong viên nang có gì, và bên dùng được phép thấy gì</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 12–13 — encapsulation: data + logic inside, only a small public face outside
' Phía dùng chỉ thấy các thao tác public
class Student {
  - enroll : String
  - name : String
  - gpa : double
  --
  + Student(enroll : String)
  + setName(name : String) : void
  + setGpa(gpa : double) : boolean
  + getEnroll() : String
  + getName() : String
  + getGpa() : double
}
class "Client code\\n(main, other classes)" as Client
Client ..&gt; Student : calls only + members
note right of Student
  "-" private: invisible outside
  "+" public: the interface
  setGpa rejects -3 or 11
end note
@enduml</code></pre></details>
<p>Học liệu FU gọi đóng gói là "khái niệm hàng đầu của lập trình hướng đối tượng": nó giữ cho lớp <strong>kết dính cao</strong> bên trong và <strong>liên kết lỏng</strong> với bên dùng — đúng hai mục tiêu của slide 3.</p>
<p class="meo">🧠 Viên thuốc con nhộng: bạn uống mà không cần biết hoá chất bên trong, và nhà máy đổi công thức được mà không đổi cách bạn uống.</p>`],
      [13, 'Encapsulation',
        `<p class="y-chinh">🎯 A <strong>well-encapsulated</strong> object hides <em>all</em> its implementation details, so a developer can <strong>change its internal structure without changing any software that uses it</strong>.</p>
<div class="pitfall">The box on this slide is <strong>C++</strong>, not Java (it was copied from a C++ course): <code>char enroll[10];</code> and the <code>public:</code> label do not exist in Java. It also has two bugs in any language: <code>char[] getEnroll();</code> is illegal C++ (a function cannot return an array) and <code>getGpac()</code> is a typo for <code>getGpa()</code>. Note that <code>setEnroll</code> sits <em>above</em> <code>public:</code>, so in C++ it is private. Do not copy this syntax into a PE.</div>
<p>The same idea in Java — and a real proof of the slide's second bullet. Two classes with <strong>different insides</strong> (<code>double gpa</code> versus <code>int gpaTimes100</code>), the same public methods, and the same client lines:</p>
<pre class="trich"><code class="language-java">class StudentV2 {
    private String enroll;
    private String name;
    private int gpaTimes100;               // version 2: a different INSIDE — hundredths as an int

    public StudentV2(String enroll) { this.enroll = enroll; }
    public void setName(String name) { if (name != null &amp;&amp; !name.trim().isEmpty()) this.name = name.trim(); }
    public boolean setGpa(double gpa) {
        if (gpa &lt; 0 || gpa &gt; 10) return false;
        this.gpaTimes100 = (int) Math.round(gpa * 100);
        return true;
    }
    public String getEnroll() { return enroll; }
    public String getName() { return name; }
    public double getGpa() { return gpaTimes100 / 100.0; }   // same public answer
}</code></pre>
<pre><code class="language-java">// release: 8
// Slide 13 rewritten in Java: two DIFFERENT insides, one public face — the client code is the same line for line and prints the same

class StudentV1 {
    private String enroll;                 // private: hidden inside the object
    private String name;
    private double gpa;                    // version 1 stores the GPA as a double

    public StudentV1(String enroll) { this.enroll = enroll; }
    public void setName(String name) { if (name != null &amp;&amp; !name.trim().isEmpty()) this.name = name.trim(); }
    public boolean setGpa(double gpa) {    // the object protects its own integrity
        if (gpa &lt; 0 || gpa &gt; 10) return false;
        this.gpa = gpa;
        return true;
    }
    public String getEnroll() { return enroll; }
    public String getName() { return name; }
    public double getGpa() { return gpa; }
}

class StudentV2 {
    private String enroll;
    private String name;
    private int gpaTimes100;               // version 2: a different INSIDE — hundredths as an int

    public StudentV2(String enroll) { this.enroll = enroll; }
    public void setName(String name) { if (name != null &amp;&amp; !name.trim().isEmpty()) this.name = name.trim(); }
    public boolean setGpa(double gpa) {
        if (gpa &lt; 0 || gpa &gt; 10) return false;
        this.gpaTimes100 = (int) Math.round(gpa * 100);
        return true;
    }
    public String getEnroll() { return enroll; }
    public String getName() { return name; }
    public double getGpa() { return gpaTimes100 / 100.0; }   // same public answer
}

public class StudentDongGoi {
    public static void main(String[] args) {
        StudentV1 a = new StudentV1("HE190001");
        a.setName("  Nguyen Van An ");
        System.out.println("setGpa(-3)  accepted? " + a.setGpa(-3));
        System.out.println("setGpa(8.25) accepted? " + a.setGpa(8.25));
        System.out.println(a.getEnroll() + " | " + a.getName() + " | " + a.getGpa());

        StudentV2 b = new StudentV2("HE190001");      // the SAME client lines, only the class name differs
        b.setName("  Nguyen Van An ");
        System.out.println("setGpa(-3)  accepted? " + b.setGpa(-3));
        System.out.println("setGpa(8.25) accepted? " + b.setGpa(8.25));
        System.out.println(b.getEnroll() + " | " + b.getName() + " | " + b.getGpa());
    }
}</code></pre>
<div class="out">setGpa(-3) &nbsp;accepted? false<br>
setGpa(8.25) accepted? true<br>
HE190001 | Nguyen Van An | 8.25<br>
setGpa(-3) &nbsp;accepted? false<br>
setGpa(8.25) accepted? true<br>
HE190001 | Nguyen Van An | 8.25</div>
<p>Both halves print exactly the same, including refusing a GPA of -3. The client never saw the field, so the field could change. The program for slide 9 shows the other half: <code>s.gpa = -3</code> from outside does not even compile (<code>gpa has private access in Student</code>).</p>
<div class="callout">🧭 <strong>Go further — LAB211 and Spring Boot</strong>: LAB211 graders open your entity classes and check for private fields + getters/setters + validation in setters. In Spring Boot, JPA entities and DTOs follow the same rule, and you can swap how a field is stored (for example a database column type) without touching the controllers that call the getters.</div>`,
        `<p class="y-chinh">🎯 Một đối tượng <strong>được đóng gói tốt</strong> giấu <em>mọi</em> chi tiết cài đặt, nên lập trình viên có thể <strong>đổi cấu trúc bên trong mà không phải đổi phần mềm nào đang dùng nó</strong>.</p>
<div class="pitfall">Khung code trên slide này là <strong>C++</strong>, không phải Java (chép từ một giáo trình C++): <code>char enroll[10];</code> và nhãn <code>public:</code> không tồn tại trong Java. Nó còn có hai lỗi ở bất kỳ ngôn ngữ nào: <code>char[] getEnroll();</code> sai luật C++ (hàm không trả về mảng được) và <code>getGpac()</code> là gõ nhầm của <code>getGpa()</code>. Để ý <code>setEnroll</code> nằm <em>trên</em> <code>public:</code>, nên trong C++ nó là private. Đừng chép cú pháp này vào bài PE.</div>
<p>Cùng ý đó bằng Java — và một bằng chứng chạy thật cho gạch đầu dòng thứ hai của slide. Hai lớp có <strong>ruột khác nhau</strong> (<code>double gpa</code> và <code>int gpaTimes100</code>), cùng các phương thức public, và cùng các dòng code phía người dùng:</p>
<pre class="trich"><code class="language-java">class StudentV2 {
    private String enroll;
    private String name;
    private int gpaTimes100;               // bản 2: RUỘT khác — lưu phần trăm dạng int

    public StudentV2(String enroll) { this.enroll = enroll; }
    public void setName(String name) { if (name != null &amp;&amp; !name.trim().isEmpty()) this.name = name.trim(); }
    public boolean setGpa(double gpa) {
        if (gpa &lt; 0 || gpa &gt; 10) return false;
        this.gpaTimes100 = (int) Math.round(gpa * 100);
        return true;
    }
    public String getEnroll() { return enroll; }
    public String getName() { return name; }
    public double getGpa() { return gpaTimes100 / 100.0; }   // câu trả lời công khai như cũ
}</code></pre>
<pre><code class="language-java">// release: 8
// Slide 13 viết lại bằng Java: hai phần RUỘT khác nhau, một bộ mặt công khai — code phía người dùng giống từng dòng và in ra y hệt

class StudentV1 {
    private String enroll;                 // private: giấu bên trong đối tượng
    private String name;
    private double gpa;                    // bản 1 lưu GPA dạng double

    public StudentV1(String enroll) { this.enroll = enroll; }
    public void setName(String name) { if (name != null &amp;&amp; !name.trim().isEmpty()) this.name = name.trim(); }
    public boolean setGpa(double gpa) {    // đối tượng tự bảo vệ tính toàn vẹn của nó
        if (gpa &lt; 0 || gpa &gt; 10) return false;
        this.gpa = gpa;
        return true;
    }
    public String getEnroll() { return enroll; }
    public String getName() { return name; }
    public double getGpa() { return gpa; }
}

class StudentV2 {
    private String enroll;
    private String name;
    private int gpaTimes100;               // bản 2: RUỘT khác — lưu phần trăm dạng int

    public StudentV2(String enroll) { this.enroll = enroll; }
    public void setName(String name) { if (name != null &amp;&amp; !name.trim().isEmpty()) this.name = name.trim(); }
    public boolean setGpa(double gpa) {
        if (gpa &lt; 0 || gpa &gt; 10) return false;
        this.gpaTimes100 = (int) Math.round(gpa * 100);
        return true;
    }
    public String getEnroll() { return enroll; }
    public String getName() { return name; }
    public double getGpa() { return gpaTimes100 / 100.0; }   // câu trả lời công khai như cũ
}

public class StudentDongGoi {
    public static void main(String[] args) {
        StudentV1 a = new StudentV1("HE190001");
        a.setName("  Nguyen Van An ");
        System.out.println("setGpa(-3)  accepted? " + a.setGpa(-3));
        System.out.println("setGpa(8.25) accepted? " + a.setGpa(8.25));
        System.out.println(a.getEnroll() + " | " + a.getName() + " | " + a.getGpa());

        StudentV2 b = new StudentV2("HE190001");      // CÙNG các dòng client, chỉ khác tên lớp
        b.setName("  Nguyen Van An ");
        System.out.println("setGpa(-3)  accepted? " + b.setGpa(-3));
        System.out.println("setGpa(8.25) accepted? " + b.setGpa(8.25));
        System.out.println(b.getEnroll() + " | " + b.getName() + " | " + b.getGpa());
    }
}</code></pre>
<div class="out">setGpa(-3) &nbsp;accepted? false<br>
setGpa(8.25) accepted? true<br>
HE190001 | Nguyen Van An | 8.25<br>
setGpa(-3) &nbsp;accepted? false<br>
setGpa(8.25) accepted? true<br>
HE190001 | Nguyen Van An | 8.25</div>
<p>Hai nửa in ra y hệt nhau, kể cả việc từ chối GPA bằng -3. Phía người dùng chưa từng thấy trường đó, nên trường đó đổi được. Chương trình của slide 9 cho thấy nửa còn lại: viết <code>s.gpa = -3</code> từ bên ngoài thì biên dịch còn không qua (<code>gpa has private access in Student</code> — gpa là truy cập riêng của Student).</p>
<div class="callout">🧭 <strong>Đi tiếp — LAB211 và Spring Boot</strong>: người chấm LAB211 mở lớp thực thể (entity) của bạn và kiểm tra trường private + getter/setter + kiểm tra dữ liệu trong setter. Ở Spring Boot, entity JPA và DTO theo đúng luật này, và bạn đổi được cách lưu một trường (ví dụ kiểu cột trong CSDL) mà không đụng tới controller đang gọi getter.</div>`],
      [14, 'Hierarchy',
        `<p class="y-chinh">🎯 Objects can be related hierarchically in two ways: <strong>aggregation</strong> — a "has a" relationship, the parent object has a child object and the two need not share a structure — and <strong>shared structure and behaviour</strong> — an "is a kind of" relationship, a hierarchy of classes.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/abee014144fc4ad3d9c2ebd3428b0e298c5147ff.svg" alt="Slide 14 in UML: Order has an ISBN (aggregation, hollow diamond); Special Order is a kind of Order (generalization, hollow triangle)" loading="lazy" /><p class="chu-thich">🧩 Slide 14 in UML: Order has an ISBN (aggregation, hollow diamond); Special Order is a kind of Order (generalization, hollow triangle)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 14 redrawn in UML — the two kinds of hierarchy
' Left: aggregation (has a). Right: inheritance (is a kind of)
hide empty members
package "aggregation — has a" {
  class Order
  class ISBN
  Order o-- ISBN : has a &gt;
}
package "shared structure and behaviour — is a kind of" {
  class "Order " as Order2
  class "Special Order" as SpecialOrder
  SpecialOrder --|&gt; Order2
}
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Slides 6 and 14: "has a" (aggregation/composition), "uses a" (dependency) and "is a kind of" (inheritance) written in Java

class Isbn {
    private final String value;
    Isbn(String value) { this.value = value; }
    @Override public String toString() { return value; }
}

class Order {
    private final Isbn isbn;                          // HAS-A: an Order has an ISBN (a field)
    private final int quantity;
    Order(Isbn isbn, int quantity) { this.isbn = isbn; this.quantity = quantity; }
    double price(double unitPrice) { return unitPrice * quantity; }
    String describe() { return "Order of " + quantity + " x ISBN " + isbn; }
}

class SpecialOrder extends Order {                    // IS-A-KIND-OF: a SpecialOrder is an Order
    SpecialOrder(Isbn isbn, int quantity) { super(isbn, quantity); }
    @Override
    double price(double unitPrice) { return super.price(unitPrice) + 15000; }   // + gift-wrapping fee
    @Override
    String describe() { return super.describe() + " (special: gift-wrapped)"; }
}

class GradingScheme {
    String letter(double mark) { return mark &gt;= 8.5 ? "A" : mark &gt;= 7 ? "B" : mark &gt;= 5 ? "C" : "F"; }
}

class Course {
    private final String code;                        // HAS-A Code
    Course(String code) { this.code = code; }
    String result(double mark, GradingScheme scheme) { // USES-A: the scheme is only borrowed for this call
        return code + " " + mark + " -&gt; " + scheme.letter(mark);
    }
}

public class CoCoVaLaMotLoai {
    public static void main(String[] args) {
        Isbn isbn = new Isbn("978-0-13-516630-7");
        Order normal = new Order(isbn, 2);
        Order special = new SpecialOrder(isbn, 2);    // a SpecialOrder can stand wherever an Order is expected
        System.out.println(normal.describe() + " = " + normal.price(250000));
        System.out.println(special.describe() + " = " + special.price(250000));
        System.out.println("special instanceof Order? " + (special instanceof Order));
        System.out.println("normal instanceof SpecialOrder? " + (normal instanceof SpecialOrder));

        Course pro = new Course("PRO192");
        System.out.println(pro.result(8.7, new GradingScheme()));
    }
}</code></pre>
<div class="out">Order of 2 x ISBN 978-0-13-516630-7 = 500000.0<br>
Order of 2 x ISBN 978-0-13-516630-7 (special: gift-wrapped) = 515000.0<br>
special instanceof Order? true<br>
normal instanceof SpecialOrder? false<br>
PRO192 8.7 -&gt; A</div>
<p>Read the output: a <code>SpecialOrder</code> <strong>is an</strong> <code>Order</code> (<code>instanceof</code> is true), so it can stand wherever an <code>Order</code> is expected, and it reuses <code>Order</code>'s code through <code>super</code> while adding a gift-wrapping fee. An ordinary <code>Order</code> is not a <code>SpecialOrder</code>. The ISBN, on the other hand, is not an Order at all — it is a <em>part</em> the order holds in a field.</p>
<p>➕ UML separates two strengths of "has a": <strong>aggregation</strong> (hollow diamond — the part can exist on its own, like a book's ISBN) and <strong>composition</strong> (filled diamond — the part lives and dies with the whole, like the code of a course). Chapter 4 is all about the "is a kind of" side.</p>
<p class="meo">🧠 Test sentence: if "X is a Y" sounds right, use <code>extends</code>; if "X has a Y" sounds right, use a field. "A car is an engine" is wrong ⇒ the engine is a field.</p>`,
        `<p class="y-chinh">🎯 Các đối tượng có thể quan hệ phân cấp theo hai cách: <strong>kết tập (aggregation)</strong> — quan hệ "có một (has a)", đối tượng cha có một đối tượng con và hai bên không cần chung cấu trúc — và <strong>chung cấu trúc và hành vi</strong> — quan hệ "là một loại (is a kind of)", tức một cây phân cấp lớp.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/abee014144fc4ad3d9c2ebd3428b0e298c5147ff.svg" alt="Slide 14 bằng UML: Order có một ISBN (kết tập, hình thoi rỗng); Special Order là một loại Order (tổng quát hoá, tam giác rỗng)" loading="lazy" /><p class="chu-thich">🧩 Slide 14 bằng UML: Order có một ISBN (kết tập, hình thoi rỗng); Special Order là một loại Order (tổng quát hoá, tam giác rỗng)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 14 redrawn in UML — the two kinds of hierarchy
' Trái: kết tập (có một). Phải: kế thừa (là một loại)
hide empty members
package "aggregation — has a" {
  class Order
  class ISBN
  Order o-- ISBN : has a &gt;
}
package "shared structure and behaviour — is a kind of" {
  class "Order " as Order2
  class "Special Order" as SpecialOrder
  SpecialOrder --|&gt; Order2
}
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Slide 6 và 14: "có một" (kết tập/hợp thành), "dùng một" (phụ thuộc) và "là một loại" (kế thừa) viết bằng Java

class Isbn {
    private final String value;
    Isbn(String value) { this.value = value; }
    @Override public String toString() { return value; }
}

class Order {
    private final Isbn isbn;                          // CÓ-MỘT: Order có một ISBN (một trường)
    private final int quantity;
    Order(Isbn isbn, int quantity) { this.isbn = isbn; this.quantity = quantity; }
    double price(double unitPrice) { return unitPrice * quantity; }
    String describe() { return "Order of " + quantity + " x ISBN " + isbn; }
}

class SpecialOrder extends Order {                    // LÀ-MỘT-LOẠI: SpecialOrder là một Order
    SpecialOrder(Isbn isbn, int quantity) { super(isbn, quantity); }
    @Override
    double price(double unitPrice) { return super.price(unitPrice) + 15000; }   // + phí gói quà
    @Override
    String describe() { return super.describe() + " (special: gift-wrapped)"; }
}

class GradingScheme {
    String letter(double mark) { return mark &gt;= 8.5 ? "A" : mark &gt;= 7 ? "B" : mark &gt;= 5 ? "C" : "F"; }
}

class Course {
    private final String code;                        // CÓ-MỘT Code
    Course(String code) { this.code = code; }
    String result(double mark, GradingScheme scheme) { // DÙNG-MỘT: chỉ mượn scheme cho lần gọi này
        return code + " " + mark + " -&gt; " + scheme.letter(mark);
    }
}

public class CoCoVaLaMotLoai {
    public static void main(String[] args) {
        Isbn isbn = new Isbn("978-0-13-516630-7");
        Order normal = new Order(isbn, 2);
        Order special = new SpecialOrder(isbn, 2);    // SpecialOrder đứng được ở mọi chỗ cần Order
        System.out.println(normal.describe() + " = " + normal.price(250000));
        System.out.println(special.describe() + " = " + special.price(250000));
        System.out.println("special instanceof Order? " + (special instanceof Order));
        System.out.println("normal instanceof SpecialOrder? " + (normal instanceof SpecialOrder));

        Course pro = new Course("PRO192");
        System.out.println(pro.result(8.7, new GradingScheme()));
    }
}</code></pre>
<div class="out">Order of 2 x ISBN 978-0-13-516630-7 = 500000.0<br>
Order of 2 x ISBN 978-0-13-516630-7 (special: gift-wrapped) = 515000.0<br>
special instanceof Order? true<br>
normal instanceof SpecialOrder? false<br>
PRO192 8.7 -&gt; A</div>
<p>Đọc output: một <code>SpecialOrder</code> <strong>là một</strong> <code>Order</code> (<code>instanceof</code> ra true), nên nó đứng được ở mọi chỗ cần <code>Order</code>, và nó dùng lại code của <code>Order</code> qua <code>super</code> rồi cộng thêm phí gói quà. Một <code>Order</code> thường thì không phải <code>SpecialOrder</code>. Còn ISBN thì chẳng phải Order chút nào — nó là một <em>bộ phận</em> mà đơn hàng giữ trong một trường.</p>
<p>➕ UML tách hai mức của "has a": <strong>kết tập (aggregation)</strong> — thoi rỗng, bộ phận tồn tại độc lập được, như ISBN của sách — và <strong>hợp thành (composition)</strong> — thoi đặc, bộ phận sống chết cùng tổng thể, như mã của một môn học. Chương 4 nói hết về phía "is a kind of".</p>
<p class="meo">🧠 Câu thử: nếu "X là một Y" nghe đúng thì dùng <code>extends</code>; nếu "X có một Y" nghe đúng thì dùng một trường. "Ô tô là một động cơ" nghe sai ⇒ động cơ là một trường.</p>`],
      [15, 'Polymorphism',
        `<p class="y-chinh">🎯 Polymorphism relates the <strong>implementation</strong> used for an object to the object's <strong>type</strong>: a <code>mode()</code> query on a Course gives a different answer from the same query on a Hybrid Course, while <code>assessments()</code> gives the same answer for both — both are Course objects.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b17d7e0b7d50c738d27a89834054cb9a80f2c3a8.svg" alt="Slide 15 redrawn: mode() is overridden in HybridCourse, assessments() is inherited from Course" loading="lazy" /><p class="chu-thich">🧩 Slide 15 redrawn: mode() is overridden in HybridCourse, assessments() is inherited from Course</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 15 redrawn — the same query, the implementation chosen by the object's type
' mode() is overridden, assessments() is inherited
class Course {
  # code : String
  + mode() : String
  + assessments() : String
}
class HybridCourse {
  + mode() : String
}
HybridCourse --|&gt; Course
object "c1 : Course" as c1
object "c2 : HybridCourse" as c2
c1 ..&gt; Course : mode() runs Course.mode()
c2 ..&gt; HybridCourse : mode() runs HybridCourse.mode()\\nassessments() runs Course.assessments()
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Slide 15: polymorphism — the same question mode() gets a different answer depending on the object's real type; assessments() is shared

class Course {
    protected final String code;
    Course(String code) { this.code = code; }
    String mode() { return "face-to-face, in a classroom"; }
    String assessments() { return "2 progress tests + PE + FE"; }    // inherited unchanged
}

class HybridCourse extends Course {
    HybridCourse(String code) { super(code); }
    @Override
    String mode() { return "hybrid: online videos + campus labs"; } // overridden
}

public class DaHinhKhoaHoc {
    public static void main(String[] args) {
        Course[] courses = { new Course("PRO192"), new HybridCourse("SSG104") };
        for (Course c : courses) {                       // the variable type is Course every time…
            System.out.println(c.code + " mode:        " + c.mode());          // …but the OBJECT decides
            System.out.println(c.code + " assessments: " + c.assessments());
        }
        Course c = new HybridCourse("SWE201c");
        System.out.println("declared Course, real object " + c.getClass().getSimpleName() + " -&gt; " + c.mode());
    }
}</code></pre>
<div class="out">PRO192 mode: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;face-to-face, in a classroom<br>
PRO192 assessments: 2 progress tests + PE + FE<br>
SSG104 mode: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hybrid: online videos + campus labs<br>
SSG104 assessments: 2 progress tests + PE + FE<br>
declared Course, real object HybridCourse -&gt; hybrid: online videos + campus labs</div>
<p>The loop variable <code>c</code> is declared as <code>Course</code> every time, yet the second line of each pair differs: Java looks at the <strong>real object</strong> at run time to choose which <code>mode()</code> to run. That is the whole trick — the calling code does not need an <code>if (isHybrid)</code>; each object answers in its own way. The last line makes it explicit: declared <code>Course</code>, real object <code>HybridCourse</code>, hybrid answer.</p>
<p>"Poly-morph" is Greek for "many forms". The FU material adds why it matters: it <strong>minimises duplicated code</strong> inside one inheritance hierarchy — <code>assessments()</code> is written once and shared.</p>
<div class="pitfall">FE/PE trap: <code>Course c = new HybridCourse("X"); c.mode();</code> runs <code>HybridCourse.mode()</code> — the object decides, not the variable type. But you can only <em>call</em> methods that <code>Course</code> declares; Chapter 4 shows the compile error when you try a method that exists only in the subclass.</div>`,
        `<p class="y-chinh">🎯 Đa hình (polymorphism) gắn <strong>phần cài đặt</strong> được dùng cho một đối tượng với <strong>kiểu</strong> của đối tượng đó: hỏi <code>mode()</code> một Course cho câu trả lời khác hỏi cùng câu đó với một Hybrid Course, còn <code>assessments()</code> thì trả lời như nhau — vì cả hai đều là đối tượng Course.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b17d7e0b7d50c738d27a89834054cb9a80f2c3a8.svg" alt="Slide 15 vẽ lại: mode() bị ghi đè trong HybridCourse, assessments() kế thừa từ Course" loading="lazy" /><p class="chu-thich">🧩 Slide 15 vẽ lại: mode() bị ghi đè trong HybridCourse, assessments() kế thừa từ Course</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 15 redrawn — the same query, the implementation chosen by the object's type
' mode() bị ghi đè, assessments() được kế thừa
class Course {
  # code : String
  + mode() : String
  + assessments() : String
}
class HybridCourse {
  + mode() : String
}
HybridCourse --|&gt; Course
object "c1 : Course" as c1
object "c2 : HybridCourse" as c2
c1 ..&gt; Course : mode() runs Course.mode()
c2 ..&gt; HybridCourse : mode() runs HybridCourse.mode()\\nassessments() runs Course.assessments()
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Slide 15: đa hình — cùng câu hỏi mode() nhận câu trả lời khác nhau tùy kiểu thật của đối tượng; assessments() thì dùng chung

class Course {
    protected final String code;
    Course(String code) { this.code = code; }
    String mode() { return "face-to-face, in a classroom"; }
    String assessments() { return "2 progress tests + PE + FE"; }    // kế thừa nguyên xi
}

class HybridCourse extends Course {
    HybridCourse(String code) { super(code); }
    @Override
    String mode() { return "hybrid: online videos + campus labs"; } // ghi đè
}

public class DaHinhKhoaHoc {
    public static void main(String[] args) {
        Course[] courses = { new Course("PRO192"), new HybridCourse("SSG104") };
        for (Course c : courses) {                       // kiểu biến lần nào cũng là Course…
            System.out.println(c.code + " mode:        " + c.mode());          // …nhưng ĐỐI TƯỢNG quyết định
            System.out.println(c.code + " assessments: " + c.assessments());
        }
        Course c = new HybridCourse("SWE201c");
        System.out.println("declared Course, real object " + c.getClass().getSimpleName() + " -&gt; " + c.mode());
    }
}</code></pre>
<div class="out">PRO192 mode: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;face-to-face, in a classroom<br>
PRO192 assessments: 2 progress tests + PE + FE<br>
SSG104 mode: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hybrid: online videos + campus labs<br>
SSG104 assessments: 2 progress tests + PE + FE<br>
declared Course, real object HybridCourse -&gt; hybrid: online videos + campus labs</div>
<p>Biến vòng lặp <code>c</code> lần nào cũng khai báo kiểu <code>Course</code>, vậy mà dòng thứ hai của mỗi cặp lại khác nhau: lúc chạy Java nhìn vào <strong>đối tượng thật</strong> để chọn chạy <code>mode()</code> nào. Toàn bộ mánh nằm ở đó — code gọi không cần <code>if (isHybrid)</code>; mỗi đối tượng tự trả lời theo cách riêng. Dòng cuối nói thẳng ra: khai báo <code>Course</code>, đối tượng thật <code>HybridCourse</code>, câu trả lời kiểu hybrid.</p>
<p>"Poly-morph" là tiếng Hy Lạp nghĩa là "nhiều hình dạng". Học liệu FU thêm lý do nó quan trọng: nó <strong>giảm code lặp</strong> trong cùng một cây kế thừa — <code>assessments()</code> viết một lần và dùng chung.</p>
<div class="pitfall">Bẫy FE/PE: <code>Course c = new HybridCourse("X"); c.mode();</code> chạy <code>HybridCourse.mode()</code> — đối tượng quyết định, không phải kiểu của biến. Nhưng bạn chỉ <em>gọi</em> được các phương thức mà <code>Course</code> khai báo; Chương 4 cho xem lỗi biên dịch khi gọi một phương thức chỉ lớp con mới có.</div>`],
      [16, 'Summary',
        `<p class="y-chinh">🎯 Objects are abstractions of the most important chunks of a problem domain; a class describes the structure common to similar objects, each object is one instance; encapsulation hides the implementation so a class can be upgraded without changing client code; the cornerstones are abstraction, encapsulation, inheritance and polymorphism.</p>
<table>
<thead><tr><th>Concept</th><th>One-line definition</th><th>Java you saw in this lesson</th><th>Chapter that goes deep</th></tr></thead>
<tbody>
<tr><td>Abstraction</td><td>keep only what matters for this problem</td><td><code>Book</code> keeps title, author, pages</td><td>1, 5</td></tr>
<tr><td>Encapsulation</td><td>data + logic together, details hidden</td><td><code>private double gpa</code> + <code>setGpa</code> that rejects -3</td><td>2, 3</td></tr>
<tr><td>Hierarchy / inheritance</td><td>"has a" (field) and "is a kind of" (<code>extends</code>)</td><td><code>Order</code> has <code>Isbn</code>; <code>SpecialOrder extends Order</code></td><td>4</td></tr>
<tr><td>Polymorphism</td><td>same call, behaviour chosen by the real object</td><td><code>c.mode()</code> in a loop over <code>Course[]</code></td><td>4, 5</td></tr>
</tbody>
</table>
<p>Note the small inconsistency: slide 7 says <em>hierarchy</em>, this summary says <em>inheritance</em> — see slide 7. Next lesson (1.B) leaves concepts for tools: what Java is, how <code>javac</code> and the JVM work, and your first program.</p>`,
        `<p class="y-chinh">🎯 Đối tượng là bản trừu tượng của những mảng thông tin quan trọng nhất trong miền bài toán; lớp mô tả cấu trúc chung của các đối tượng giống nhau, mỗi đối tượng là một thể hiện; đóng gói giấu phần cài đặt nên lớp nâng cấp được mà không phải sửa code phía người dùng; các trụ cột là trừu tượng, đóng gói, kế thừa và đa hình.</p>
<table>
<thead><tr><th>Khái niệm</th><th>Định nghĩa một dòng</th><th>Java đã thấy trong bài</th><th>Chương đi sâu</th></tr></thead>
<tbody>
<tr><td>Trừu tượng (abstraction)</td><td>chỉ giữ thứ quan trọng cho bài toán này</td><td><code>Book</code> giữ tên, tác giả, các trang</td><td>1, 5</td></tr>
<tr><td>Đóng gói (encapsulation)</td><td>dữ liệu + xử lý đi cùng nhau, chi tiết bị giấu</td><td><code>private double gpa</code> + <code>setGpa</code> từ chối -3</td><td>2, 3</td></tr>
<tr><td>Phân cấp / kế thừa</td><td>"có một" (trường) và "là một loại" (<code>extends</code>)</td><td><code>Order</code> có <code>Isbn</code>; <code>SpecialOrder extends Order</code></td><td>4</td></tr>
<tr><td>Đa hình (polymorphism)</td><td>cùng lời gọi, hành vi do đối tượng thật quyết định</td><td><code>c.mode()</code> trong vòng lặp trên <code>Course[]</code></td><td>4, 5</td></tr>
</tbody>
</table>
<p>Để ý chỗ lệch nhỏ: slide 7 nói <em>hierarchy</em>, phần tóm tắt này nói <em>inheritance</em> — xem lại slide 7. Bài sau (1.B) rời khái niệm để sang công cụ: Java là gì, <code>javac</code> và JVM làm việc ra sao, và chương trình đầu tiên của bạn.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>For a library system, list five nouns and three verbs. Which nouns are classes, which are just fields?</li>
<li>Why does <code>bookA == bookB</code> print <code>false</code> even if both had the same title?</li>
<li>Give one "has a" and one "is a kind of" relationship from your own life at FPTU, and say how each looks in Java.</li>
</ul>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Với hệ thống thư viện, kể năm danh từ và ba động từ. Danh từ nào là lớp, danh từ nào chỉ là trường?</li>
<li>Vì sao <code>bookA == bookB</code> in ra <code>false</code> kể cả khi hai cuốn cùng tên?</li>
<li>Cho một quan hệ "có một" và một quan hệ "là một loại" từ chính đời sinh viên FPTU của bạn, và nói mỗi cái viết bằng Java trông ra sao.</li>
</ul>`),
    books([
      ['horstmann1', 'Ch. 4.1 "Introduction to Object-Oriented Programming" (classes, objects, relationships between classes)', 'Chương 4.1 "Introduction to Object-Oriented Programming" (lớp, đối tượng, quan hệ giữa các lớp)'],
      ['fuOffline', 'part "Introduction" — Complexity, Object Terminology, UML class diagram', 'phần "Introduction" — Complexity, Object Terminology, sơ đồ lớp UML'],
      ['szalwinski', '"Object Terminology" — the original text of this deck (C++)', '"Object Terminology" — bản gốc của bộ slide này (C++)'],
    ]),
  ].join('\n'),
};

/* ───────── 1.B — 📑 Slide by slide · Getting Started (1/2): history, bytecode and the JVM, the platform, PATH (slides 1–10) ───────── */
const L_pro3_1 = {
  title: '1.B — 📑 Slide by slide · Getting Started (1/2): history, bytecode and the JVM, the platform, PATH (slides 1–10)|||1.B — 📑 Học theo từng slide · Getting Started (1/2): lịch sử, bytecode và JVM, nền tảng Java, PATH (slide 1–10)',
  slug: 'pro192-slide-pro3-1',
  type: 'VIDEO',
  description: 'Giảng slide 1–10 bộ "Getting Started": lịch sử Java có mốc năm đã tra (Oak 1991, công bố 1995, JDK 1.0 năm 1996, các bản LTS 8/11/17/21/25), chỗ slide ghi chưa chuẩn, mười một đặc điểm của Java (chạy thử robust và đa luồng trên JDK 8), Java làm được gì hôm nay, biên dịch ra bytecode rồi chạy trên JVM (javac, file .class bắt đầu bằng CAFEBABE, javap xem lệnh JVM — chạy thật), kiến trúc JVM, nền tảng Java = JVM + API, và biến PATH/CLASSPATH (đo thật dấu chấm đầu CLASSPATH làm gì).',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.B · school deck "Getting Started", slides 1–10</span>
<h2>From an idea at Sun in 1991 to the <code>javac</code> on your laptop</h2>
<p class="lead">Deck 1 gave you the <em>ideas</em> of objects. This deck gives you the <em>tool</em>: what Java is, where it came from, and the single trick that made it famous — compile once to <strong>bytecode</strong>, run it on any <strong>Java Virtual Machine</strong>. Lesson 1.B covers slides 1–10 (the technology); lesson 1.C covers slides 11–26 (your first program, running it, and the classic errors).</p>
<div class="callout"><strong>How to read the commands on these pages.</strong> Every <code>&gt; javac …</code> and <code>&gt; java …</code> transcript below was produced by a small Java program that really runs the JDK tools — on a real <strong>JDK 8</strong> (the exam-room JDK, Temurin 1.8.0 in a container), in a folder that ignores upper/lower case like the lab's Windows disks. What you read is what the console printed. The deck's screenshots are Windows XP with JDK 1.6 and NetBeans 8.0.2; where that is out of date, the lesson says so.</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.B · bộ slide "Getting Started" của trường, slide 1–10</span>
<h2>Từ một ý tưởng ở Sun năm 1991 tới cái <code>javac</code> trên laptop của bạn</h2>
<p class="lead">Bộ slide 1 cho bạn <em>ý tưởng</em> về đối tượng. Bộ này cho bạn <em>công cụ</em>: Java là gì, từ đâu ra, và cái mánh duy nhất làm nó nổi tiếng — biên dịch một lần ra <strong>bytecode</strong>, chạy trên bất kỳ <strong>máy ảo Java (Java Virtual Machine — JVM)</strong> nào. Bài 1.B giảng slide 1–10 (công nghệ); bài 1.C giảng slide 11–26 (chương trình đầu tiên, cách chạy nó, và các lỗi kinh điển).</p>
<div class="callout"><strong>Cách đọc các lệnh trên trang này.</strong> Mọi đoạn <code>&gt; javac …</code> và <code>&gt; java …</code> bên dưới được tạo bởi một chương trình Java nhỏ chạy thật các công cụ JDK — trên <strong>JDK 8</strong> thật (JDK của phòng thi, Temurin 1.8.0 trong container), trong một thư mục không phân biệt chữ hoa/thường giống ổ đĩa Windows ở phòng lab. Bạn đọc thấy gì là console đã in đúng như vậy. Ảnh chụp trên slide là Windows XP với JDK 1.6 và NetBeans 8.0.2; chỗ nào đã cũ, bài nói rõ.</div>`),
    walkHead('pro3', 1, 10),
    walk('pro3', [
      [1, 'Getting Started',
        `<p class="y-chinh">🎯 The deck follows Oracle's tutorial trail "Getting Started" (the link on the slide): what Java technology is, the "Hello World!" application, a closer look at it, and common problems.</p>
<p>That tutorial is still online, but its own banner now says: <em>"The Java Tutorials have been written for JDK 8 … See Dev.java for updated tutorials"</em>. So it matches the exam JDK exactly — and for modern Java (records, <code>var</code>, new <code>switch</code>) use <strong>dev.java/learn</strong>.</p>
<p class="meo">🧠 The slide's link starts with <code>http://</code>; today the site redirects to <code>https://</code> — type the https version.</p>`,
        `<p class="y-chinh">🎯 Bộ slide đi theo trail "Getting Started" của bộ hướng dẫn Oracle (link trên slide): công nghệ Java là gì, chương trình "Hello World!", xem kỹ chương trình đó, và các lỗi hay gặp.</p>
<p>Bộ hướng dẫn đó vẫn còn trên mạng, nhưng dòng thông báo của chính nó giờ ghi: <em>"The Java Tutorials have been written for JDK 8 … See Dev.java for updated tutorials"</em> (bộ hướng dẫn viết cho JDK 8, xem Dev.java cho bản cập nhật). Vậy nó khớp đúng JDK phòng thi — còn với Java hiện đại (record, <code>var</code>, <code>switch</code> kiểu mới) hãy dùng <strong>dev.java/learn</strong>.</p>
<p class="meo">🧠 Link trên slide bắt đầu bằng <code>http://</code>; ngày nay trang tự chuyển sang <code>https://</code> — cứ gõ bản https.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Nine goals: about Java technology, what it can do, how it is platform-independent, the Java platform, environment variables, the first program in NetBeans, the structure of a Java program, and how end users run it.</p>
<table>
<thead><tr><th>Objective (slide 2)</th><th>Slides</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>About the Java technology · What can Java do</td><td>3–6</td><td>1.B</td></tr>
<tr><td>Platform independence · the JVM · the Java platform</td><td>7–9</td><td>1.B</td></tr>
<tr><td>Set up environment variables</td><td>10</td><td>1.B (+ ⭐ "Installing the environment")</td></tr>
<tr><td>The first Java program in NetBeans</td><td>11–18</td><td>1.C</td></tr>
<tr><td>End users run Java programs · JDK tools</td><td>19–22</td><td>1.C</td></tr>
<tr><td>Structure of a Java program · common problems · try and explore</td><td>23–26</td><td>1.C</td></tr>
</tbody>
</table>
<p>Syllabus: session 2 ("Installation JDK – IDE") and the start of "Chapter 2: Basic Java language" (CLO2 — practise Java syntax and semantics).</p>`,
        `<p class="y-chinh">🎯 Chín mục tiêu: về công nghệ Java, Java làm được gì, vì sao Java độc lập nền tảng, nền tảng Java, biến môi trường, chương trình đầu tiên trong NetBeans, cấu trúc một chương trình Java, và người dùng cuối chạy nó thế nào.</p>
<table>
<thead><tr><th>Mục tiêu (slide 2)</th><th>Slide</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>Về công nghệ Java · Java làm được gì</td><td>3–6</td><td>1.B</td></tr>
<tr><td>Độc lập nền tảng · JVM · nền tảng Java</td><td>7–9</td><td>1.B</td></tr>
<tr><td>Đặt biến môi trường</td><td>10</td><td>1.B (+ ⭐ "Cài môi trường")</td></tr>
<tr><td>Chương trình Java đầu tiên trong NetBeans</td><td>11–18</td><td>1.C</td></tr>
<tr><td>Người dùng cuối chạy chương trình · công cụ JDK</td><td>19–22</td><td>1.C</td></tr>
<tr><td>Cấu trúc chương trình Java · lỗi hay gặp · thử và khám phá</td><td>23–26</td><td>1.C</td></tr>
</tbody>
</table>
<p>Đề cương: buổi 2 ("Installation JDK – IDE") và đầu "Chapter 2: Basic Java language" (CLO2 — thực hành cú pháp và ngữ nghĩa Java).</p>`],
      [3, 'About the Java Technology(1)',
        `<p class="y-chinh">🎯 History, part 1: Sun Microsystems engineers designed a language called <strong>Oak</strong> for small consumer devices (it had to be platform-independent, extremely reliable and compact); when that market failed and the Web appeared, Sun re-aimed it at the Internet and renamed it <strong>Java</strong>; the <strong>HotJava</strong> browser, itself written in Java, showed what it could do.</p>
<p>Checked against public sources, the slide is close but not exact:</p>
<table>
<thead><tr><th>Slide says</th><th>Checked fact</th></tr></thead>
<tbody>
<tr><td>1990, Gosling, Bill Joy, Naughton develop Oak</td><td>the Green Project and the Oak language started in <strong>June 1991</strong>; the usual founders named are James Gosling, Mike Sheridan and Patrick Naughton</td></tr>
<tr><td>1993, devices failed, Sun turns Oak into an Internet project named Java</td><td>the set-top-box/PDA market did not take off; Oak was renamed Java around 1994–95 because the name "Oak" was already taken</td></tr>
<tr><td>1994, HotJava browser introduced</td><td>HotJava (first called WebRunner) was built in 1994; Sun <strong>publicly announced Java and HotJava on 23 May 1995</strong> at SunWorld; <strong>JDK 1.0</strong> shipped on 23 January 1996</td></tr>
</tbody>
</table>
<p>The three requirements of Oak — <em>platform-independent, reliable, compact</em> — explain almost every design choice of Java you will meet: bytecode (slide 7), no pointers and array-bounds checks (slide 5), a small core language.</p>
<p class="meo">🧠 Where the name comes from: the team drank a lot of coffee (Java is an Indonesian island famous for coffee) — hence the coffee-cup logo and the <code>CAFEBABE</code> you will find at the start of every <code>.class</code> file (slide 7).</p>`,
        `<p class="y-chinh">🎯 Lịch sử, phần 1: kỹ sư Sun Microsystems thiết kế ngôn ngữ <strong>Oak</strong> cho thiết bị điện tử tiêu dùng nhỏ (yêu cầu: độc lập nền tảng, cực kỳ đáng tin, gọn nhẹ); khi thị trường đó thất bại còn Web thì xuất hiện, Sun chuyển hướng nó sang Internet và đổi tên thành <strong>Java</strong>; trình duyệt <strong>HotJava</strong>, viết chính bằng Java, cho thấy nó làm được gì.</p>
<p>Đối chiếu với nguồn công khai, slide gần đúng nhưng chưa chính xác:</p>
<table>
<thead><tr><th>Slide ghi</th><th>Sự thật đã tra</th></tr></thead>
<tbody>
<tr><td>1990, Gosling, Bill Joy, Naughton phát triển Oak</td><td>Green Project và ngôn ngữ Oak bắt đầu <strong>tháng 6/1991</strong>; ba người thường được nhắc là James Gosling, Mike Sheridan và Patrick Naughton</td></tr>
<tr><td>1993, thiết bị thất bại, Sun biến Oak thành dự án Internet tên Java</td><td>thị trường đầu thu truyền hình/PDA không cất cánh; Oak đổi tên thành Java khoảng 1994–95 vì cái tên "Oak" đã có người dùng</td></tr>
<tr><td>1994, ra mắt trình duyệt HotJava</td><td>HotJava (lúc đầu tên WebRunner) được làm năm 1994; Sun <strong>công bố Java và HotJava ngày 23/05/1995</strong> tại SunWorld; <strong>JDK 1.0</strong> phát hành ngày 23/01/1996</td></tr>
</tbody>
</table>
<p>Ba yêu cầu của Oak — <em>độc lập nền tảng, đáng tin, gọn nhẹ</em> — giải thích gần như mọi lựa chọn thiết kế của Java bạn sẽ gặp: bytecode (slide 7), không có con trỏ và có kiểm tra biên mảng (slide 5), lõi ngôn ngữ nhỏ.</p>
<p class="meo">🧠 Cái tên từ đâu ra: cả nhóm uống rất nhiều cà phê (Java là hòn đảo Indonesia nổi tiếng cà phê) — nên mới có logo cốc cà phê và chữ <code>CAFEBABE</code> nằm ở đầu mọi file <code>.class</code> (slide 7).</p>`],
      [4, 'About the Java Technology(2)',
        `<p class="y-chinh">🎯 History, part 2, as four eras: embedded systems (1991–1994), a client-side wonder (1995–1997 — applets in the browser), moving into the middle tier (1997 onward — Java on servers), and "future: may gain more success".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/e4491883c96390fe59684a94993c67ccb7a57234.svg" alt="Slides 3–4 widened: from Oak to the long-term-support (LTS) releases, with the two versions that matter for you" loading="lazy" /><p class="chu-thich">🧩 Slides 3–4 widened: from Oak to the long-term-support (LTS) releases, with the two versions that matter for you</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 3–4 widened — Java from Oak to the LTS releases
' Dates checked against the Java version history (October 2026)
rectangle "1991\\nGreen Project\\nOak language" as A
rectangle "May 1995\\nJava + HotJava\\nannounced" as B
rectangle "Jan 1996\\nJDK 1.0" as C
rectangle "Sep 2004\\nJ2SE 5.0\\ngenerics" as D
rectangle "Mar 2014\\nJava 8 (LTS)\\nlambdas\\n← the exam JDK" as E #FEF9C3
rectangle "Sep 2018\\nJava 11 (LTS)" as F
rectangle "Sep 2021\\nJava 17 (LTS)\\n← Spring Boot 3" as G #ECFDF5
rectangle "Sep 2023\\nJava 21 (LTS)" as H
rectangle "Sep 2025\\nJava 25 (LTS)" as I
A -right-&gt; B
B -right-&gt; C
C -right-&gt; D
D -right-&gt; E
E -down-&gt; F
F -left-&gt; G
G -left-&gt; H
H -left-&gt; I
@enduml</code></pre></details>
<p>The slide stops around 2005. What actually happened next:</p>
<table>
<thead><tr><th>Era</th><th>What happened</th><th>Why you care</th></tr></thead>
<tbody>
<tr><td>client side (applets)</td><td>browsers dropped the Java plug-in; the Applet API was deprecated for removal in JDK 17 and <strong>removed in JDK 26</strong> (2026)</td><td>you will never write an applet — old FE questions about applets are history</td></tr>
<tr><td>middle tier (servers)</td><td>servlets (1997), J2EE (1999), then Spring (2004) and Spring Boot (2014)</td><td>PRJ301 and your LabFlow capstone live exactly here</td></tr>
<tr><td>2008 →</td><td>Android apps were written in Java for a decade (Kotlin is now preferred, on the same JVM ideas)</td><td>the OOP of PRO192 is the OOP of Android</td></tr>
<tr><td>2010</td><td>Oracle bought Sun (27 January 2010); Java's code had been open-sourced as OpenJDK in 2006–2007</td><td>free JDKs like Eclipse Temurin are OpenJDK builds</td></tr>
<tr><td>2017 →</td><td>a new feature release every six months; long-term-support (LTS) versions: 8 (2014), 11, 17, 21, 25 (Sep 2025)</td><td>exam = Java 8; Spring Boot 3 = Java 17+</td></tr>
</tbody>
</table>
<div class="callout">🧭 <strong>Go further — Spring Boot</strong>: Spring Boot 3 requires Java 17 or newer, so your capstone will use a modern LTS (17, 21 or 25) while PRO192 exams still use 8. Everything you learn about classes and objects carries over unchanged; only newer <em>conveniences</em> (records, <code>var</code>, text blocks) are added on top.</div>`,
        `<p class="y-chinh">🎯 Lịch sử, phần 2, chia bốn thời kỳ: hệ thống nhúng (1991–1994), "kỳ quan phía client" (1995–1997 — applet chạy trong trình duyệt), tiến vào tầng giữa (1997 trở đi — Java trên server), và "tương lai: có thể còn thành công hơn".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/e4491883c96390fe59684a94993c67ccb7a57234.svg" alt="Slide 3–4 mở rộng: từ Oak tới các bản hỗ trợ dài hạn (LTS), kèm hai phiên bản quan trọng với bạn" loading="lazy" /><p class="chu-thich">🧩 Slide 3–4 mở rộng: từ Oak tới các bản hỗ trợ dài hạn (LTS), kèm hai phiên bản quan trọng với bạn</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 3–4 widened — Java from Oak to the LTS releases
' Mốc năm đối chiếu lịch sử phiên bản Java (10/2026)
rectangle "1991\\nGreen Project\\nOak language" as A
rectangle "May 1995\\nJava + HotJava\\nannounced" as B
rectangle "Jan 1996\\nJDK 1.0" as C
rectangle "Sep 2004\\nJ2SE 5.0\\ngenerics" as D
rectangle "Mar 2014\\nJava 8 (LTS)\\nlambdas\\n← the exam JDK" as E #FEF9C3
rectangle "Sep 2018\\nJava 11 (LTS)" as F
rectangle "Sep 2021\\nJava 17 (LTS)\\n← Spring Boot 3" as G #ECFDF5
rectangle "Sep 2023\\nJava 21 (LTS)" as H
rectangle "Sep 2025\\nJava 25 (LTS)" as I
A -right-&gt; B
B -right-&gt; C
C -right-&gt; D
D -right-&gt; E
E -down-&gt; F
F -left-&gt; G
G -left-&gt; H
H -left-&gt; I
@enduml</code></pre></details>
<p>Slide dừng ở khoảng năm 2005. Chuyện thật sự xảy ra sau đó:</p>
<table>
<thead><tr><th>Thời kỳ</th><th>Chuyện gì xảy ra</th><th>Vì sao bạn cần biết</th></tr></thead>
<tbody>
<tr><td>phía client (applet)</td><td>trình duyệt bỏ plug-in Java; Applet API bị đánh dấu sẽ xoá ở JDK 17 và <strong>bị xoá hẳn ở JDK 26</strong> (2026)</td><td>bạn sẽ không bao giờ viết applet — câu FE cũ về applet giờ là lịch sử</td></tr>
<tr><td>tầng giữa (server)</td><td>servlet (1997), J2EE (1999), rồi Spring (2004) và Spring Boot (2014)</td><td>PRJ301 và đồ án LabFlow của bạn nằm đúng ở đây</td></tr>
<tr><td>2008 →</td><td>ứng dụng Android được viết bằng Java suốt một thập kỷ (giờ ưu tiên Kotlin, trên cùng ý tưởng JVM)</td><td>OOP của PRO192 chính là OOP của Android</td></tr>
<tr><td>2010</td><td>Oracle mua Sun (27/01/2010); mã nguồn Java đã được mở thành OpenJDK giai đoạn 2006–2007</td><td>các JDK miễn phí như Eclipse Temurin đều là bản dựng OpenJDK</td></tr>
<tr><td>2017 →</td><td>sáu tháng ra một bản tính năng; các bản hỗ trợ dài hạn (LTS): 8 (2014), 11, 17, 21, 25 (9/2025)</td><td>phòng thi = Java 8; Spring Boot 3 = Java 17+</td></tr>
</tbody>
</table>
<div class="callout">🧭 <strong>Đi tiếp — Spring Boot</strong>: Spring Boot 3 đòi Java 17 trở lên, nên đồ án của bạn sẽ dùng một bản LTS hiện đại (17, 21 hoặc 25) trong khi bài thi PRO192 vẫn dùng 8. Mọi thứ bạn học về lớp và đối tượng dùng lại nguyên vẹn; các bản mới chỉ thêm <em>tiện ích</em> lên trên (record, <code>var</code>, text block).</div>`],
      [5, 'About the Java Technology(3)',
        `<p class="y-chinh">🎯 Java is a <strong>high-level</strong> language with eleven characteristics: simple, object oriented, distributed, multithreaded, dynamic linking, architecture neutral, portable, high performance, robust, secure.</p>
<p>These "buzzwords" come from Sun's 1995 white paper <em>The Java Language Environment</em> (Gosling and McGilton), which also listed <em>interpreted</em>. Three of them you can see in a 30-line program — real run on JDK 8:</p>
<pre><code class="language-java">// chay: jdk8
// Slide 5: three of the slide's eleven adjectives you can SEE in a 30-line program — robust, multithreaded, object oriented
public class DacDiemJava {
    public static void main(String[] args) throws InterruptedException {
        // Robust: an array knows its length; a wrong index is CAUGHT, never silently overwrites memory as in C
        int[] marks = {8, 6, 9};
        try {
            marks[3] = 10;
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("robust: " + e);
        }
        // Robust: no pointers, and a missing object is an error you can see, not a random crash
        String s = null;
        try {
            System.out.println(s.length());
        } catch (NullPointerException e) {
            System.out.println("robust: NullPointerException caught");
        }
        // Multithreaded: two threads count at the same time; join() waits for both
        final int[] sum = new int[2];
        Thread a = new Thread(() -&gt; { for (int i = 1; i &lt;= 1000; i++) sum[0] += i; });
        Thread b = new Thread(() -&gt; { for (int i = 1001; i &lt;= 2000; i++) sum[1] += i; });
        a.start(); b.start();
        a.join(); b.join();
        System.out.println("multithreaded: 1 + 2 + ... + 2000 = " + (sum[0] + sum[1]));
        // Object oriented: even text is an object that carries its own behaviour
        System.out.println("object oriented: \\"java\\".toUpperCase() = " + "java".toUpperCase());
    }
}</code></pre>
<div class="out">robust: java.lang.ArrayIndexOutOfBoundsException: 3<br>
robust: NullPointerException caught<br>
multithreaded: 1 + 2 + ... + 2000 = 2001000<br>
object oriented: "java".toUpperCase() = JAVA</div>
<p>What each word means for you in PRO192:</p>
<table>
<thead><tr><th>Word</th><th>Plain meaning</th><th>Where you meet it</th></tr></thead>
<tbody>
<tr><td>simple</td><td>no pointers, no manual memory freeing, no header files (compared with C/C++)</td><td>from day one</td></tr>
<tr><td>object oriented</td><td>everything is inside classes</td><td>the whole course</td></tr>
<tr><td>robust</td><td>strict types, array-bounds checks, exceptions instead of crashes</td><td>Ch. 6 (exceptions)</td></tr>
<tr><td>architecture neutral · portable</td><td>bytecode runs on any CPU/OS with a JVM</td><td>slide 7</td></tr>
<tr><td>multithreaded</td><td>several tasks at once in one program</td><td>beyond PRO192 (servers in PRJ301)</td></tr>
<tr><td>dynamic linking</td><td>classes are loaded when first needed, not glued into one .exe</td><td>slide 8 (class loader)</td></tr>
<tr><td>secure · distributed</td><td>bytecode verification; network APIs built in</td><td>background</td></tr>
<tr><td>high performance</td><td>the JIT compiler turns hot bytecode into machine code</td><td>slide 8</td></tr>
</tbody>
</table>
<div class="pitfall">Version trap seen above: JDK 8 prints <code>ArrayIndexOutOfBoundsException: 3</code>; JDK 11 and newer print <code>Index 3 out of bounds for length 3</code> (measured on JDK 21 while building this page). Do not be surprised if an FE answer key shows the old short message.</div>`,
        `<p class="y-chinh">🎯 Java là ngôn ngữ <strong>bậc cao (high-level)</strong> với mười một đặc điểm: đơn giản, hướng đối tượng, phân tán, đa luồng, liên kết động, trung lập kiến trúc, khả chuyển, hiệu năng cao, bền vững (robust), an toàn.</p>
<p>Các "từ khoá quảng cáo" này lấy từ sách trắng năm 1995 của Sun <em>The Java Language Environment</em> (Gosling và McGilton), bản gốc còn có thêm <em>interpreted</em> (thông dịch). Ba trong số đó bạn thấy được trong 30 dòng code — chạy thật trên JDK 8:</p>
<pre><code class="language-java">// chay: jdk8
// Slide 5: ba trong mười một tính từ của slide mà bạn THẤY được trong 30 dòng code — robust, multithreaded, object oriented
public class DacDiemJava {
    public static void main(String[] args) throws InterruptedException {
        // Robust (bền): mảng biết độ dài của nó; chỉ số sai bị BẮT, không âm thầm ghi đè bộ nhớ như C
        int[] marks = {8, 6, 9};
        try {
            marks[3] = 10;
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("robust: " + e);
        }
        // Robust: không có con trỏ, và đối tượng "không có" là lỗi thấy được, không phải sập ngẫu nhiên
        String s = null;
        try {
            System.out.println(s.length());
        } catch (NullPointerException e) {
            System.out.println("robust: NullPointerException caught");
        }
        // Multithreaded (đa luồng): hai luồng đếm cùng lúc; join() chờ cả hai xong
        final int[] sum = new int[2];
        Thread a = new Thread(() -&gt; { for (int i = 1; i &lt;= 1000; i++) sum[0] += i; });
        Thread b = new Thread(() -&gt; { for (int i = 1001; i &lt;= 2000; i++) sum[1] += i; });
        a.start(); b.start();
        a.join(); b.join();
        System.out.println("multithreaded: 1 + 2 + ... + 2000 = " + (sum[0] + sum[1]));
        // Object oriented (hướng đối tượng): đến chữ cũng là đối tượng mang theo hành vi của nó
        System.out.println("object oriented: \\"java\\".toUpperCase() = " + "java".toUpperCase());
    }
}</code></pre>
<div class="out">robust: java.lang.ArrayIndexOutOfBoundsException: 3<br>
robust: NullPointerException caught<br>
multithreaded: 1 + 2 + ... + 2000 = 2001000<br>
object oriented: "java".toUpperCase() = JAVA</div>
<p>Mỗi từ nghĩa là gì với bạn ở PRO192:</p>
<table>
<thead><tr><th>Từ</th><th>Nghĩa dễ hiểu</th><th>Gặp ở đâu</th></tr></thead>
<tbody>
<tr><td>simple (đơn giản)</td><td>không con trỏ, không tự giải phóng bộ nhớ, không file header (so với C/C++)</td><td>ngay từ ngày đầu</td></tr>
<tr><td>object oriented (hướng đối tượng)</td><td>mọi thứ nằm trong lớp</td><td>cả môn</td></tr>
<tr><td>robust (bền vững)</td><td>kiểu chặt, kiểm tra biên mảng, ngoại lệ thay vì sập</td><td>Ch. 6 (ngoại lệ)</td></tr>
<tr><td>architecture neutral · portable (trung lập kiến trúc · khả chuyển)</td><td>bytecode chạy trên mọi CPU/hệ điều hành có JVM</td><td>slide 7</td></tr>
<tr><td>multithreaded (đa luồng)</td><td>nhiều việc cùng lúc trong một chương trình</td><td>ngoài PRO192 (server ở PRJ301)</td></tr>
<tr><td>dynamic linking (liên kết động)</td><td>lớp được nạp khi cần lần đầu, không dán chung vào một file .exe</td><td>slide 8 (class loader)</td></tr>
<tr><td>secure · distributed (an toàn · phân tán)</td><td>kiểm tra bytecode; API mạng có sẵn</td><td>kiến thức nền</td></tr>
<tr><td>high performance (hiệu năng cao)</td><td>trình biên dịch JIT biến bytecode chạy nhiều thành mã máy</td><td>slide 8</td></tr>
</tbody>
</table>
<div class="pitfall">Bẫy phiên bản thấy ngay ở trên: JDK 8 in <code>ArrayIndexOutOfBoundsException: 3</code>; JDK 11 trở lên in <code>Index 3 out of bounds for length 3</code> (đo trên JDK 21 lúc dựng trang này). Đừng ngạc nhiên nếu đáp án FE cho thông báo ngắn kiểu cũ.</div>`],
      [6, 'What can Java Technology do?',
        `<p class="y-chinh">🎯 Java is both a <strong>language</strong> and a <strong>platform</strong>: the JDK gives you development tools, a large API, deployment technologies, user-interface toolkits and integration libraries — and with them you build desktop, web, network, game, distributed and embedded applications.</p>
<table>
<thead><tr><th>Slide's category</th><th>Example in 2026</th></tr></thead>
<tbody>
<tr><td>Desktop application (console, GUI)</td><td>your PRO192/LAB211 console programs; IntelliJ IDEA and NetBeans themselves are Java GUI apps</td></tr>
<tr><td>Web-based application</td><td>PRJ301 servlets/JSP; Spring Boot back ends (banks, e-commerce, your LabFlow)</td></tr>
<tr><td>Network-based application</td><td>REST APIs, chat servers</td></tr>
<tr><td>Game</td><td>Minecraft: Java Edition</td></tr>
<tr><td>Distributed application</td><td>Kafka, Hadoop, Elasticsearch — big-data and messaging systems that run on the JVM</td></tr>
<tr><td>Embedded (apps on devices)</td><td>smart cards (Java Card), set-top boxes; Android was Java-based for a decade</td></tr>
</tbody>
</table>
<p>The left column of the slide is the JDK's own toolbox: <strong>development tools</strong> (<code>javac</code>, <code>java</code>, <code>javap</code>, <code>jar</code> — slide 22), the <strong>API</strong> (thousands of ready-made classes — slide 9), <strong>UI toolkits</strong> (Swing — used by the Banking sample project of this course — and JavaFX, which since JDK 11 is a separate download).</p>
<p class="meo">🧠 "Learn once, use everywhere": the OOP and the Java syntax of PRO192 are identical in a console exercise, an Android app and a Spring Boot server — only the libraries around them change.</p>`,
        `<p class="y-chinh">🎯 Java vừa là <strong>ngôn ngữ</strong> vừa là <strong>nền tảng</strong>: JDK cho bạn công cụ phát triển, một bộ API lớn, công nghệ triển khai, bộ công cụ giao diện và thư viện tích hợp — và với chúng bạn làm ứng dụng desktop, web, mạng, game, phân tán và nhúng.</p>
<table>
<thead><tr><th>Loại trên slide</th><th>Ví dụ năm 2026</th></tr></thead>
<tbody>
<tr><td>Ứng dụng desktop (console, giao diện đồ hoạ)</td><td>chương trình console PRO192/LAB211 của bạn; chính IntelliJ IDEA và NetBeans là ứng dụng GUI viết bằng Java</td></tr>
<tr><td>Ứng dụng web</td><td>servlet/JSP của PRJ301; back end Spring Boot (ngân hàng, thương mại điện tử, LabFlow của bạn)</td></tr>
<tr><td>Ứng dụng mạng</td><td>REST API, server chat</td></tr>
<tr><td>Game</td><td>Minecraft: Java Edition</td></tr>
<tr><td>Ứng dụng phân tán</td><td>Kafka, Hadoop, Elasticsearch — hệ thống dữ liệu lớn và hàng đợi tin nhắn chạy trên JVM</td></tr>
<tr><td>Nhúng (ứng dụng trên thiết bị)</td><td>thẻ thông minh (Java Card), đầu thu truyền hình; Android dựa trên Java suốt một thập kỷ</td></tr>
</tbody>
</table>
<p>Cột trái của slide là hộp đồ nghề của chính JDK: <strong>công cụ phát triển</strong> (<code>javac</code>, <code>java</code>, <code>javap</code>, <code>jar</code> — slide 22), <strong>API</strong> (hàng nghìn lớp làm sẵn — slide 9), <strong>bộ công cụ giao diện</strong> (Swing — project mẫu Banking của môn dùng nó — và JavaFX, từ JDK 11 phải tải riêng).</p>
<p class="meo">🧠 "Học một lần, dùng khắp nơi": OOP và cú pháp Java của PRO192 y hệt nhau trong bài tập console, ứng dụng Android và server Spring Boot — chỉ thư viện xung quanh là đổi.</p>`],
      [7, 'How can Java support platform-independence?',
        `<p class="y-chinh">🎯 <code>javac</code> compiles the plain-text <code>file.java</code> into <strong>platform-independent bytecode</strong> (<code>file.class</code>); the <strong>JVM</strong> (<code>java</code>) on each machine — IBM, Macintosh, Sparc… — interprets that same bytecode. Compile once, run anywhere.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/8c983cd88921d6729e6ad45ac73c3642373e5c30.svg" alt="Slide 7 redrawn: one compile, the same .class on three operating systems" loading="lazy" /><p class="chu-thich">🧩 Slide 7 redrawn: one compile, the same .class on three operating systems</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 7 redrawn — compile once to bytecode, run on any JVM
' javac runs once on the developer's machine; java runs on every user's machine
left to right direction
rectangle "HelloWorld.java\\n(plain text source)" as SRC
rectangle "javac\\n(Java compiler)" as JAVAC
rectangle "HelloWorld.class\\n(platform-independent\\nbytecode, CAFEBABE…)" as CLS
node "JVM on Windows\\n(java.exe)" as W
node "JVM on macOS\\n(java)" as M
node "JVM on Linux\\n(java)" as L
SRC --&gt; JAVAC
JAVAC --&gt; CLS
CLS --&gt; W
CLS --&gt; M
CLS --&gt; L
@enduml</code></pre></details>
<p>The slide's screenshots show <code>javac.exe</code> in <code>C:\\Program Files\\Java\\jdk1.6.0\\bin</code> and <code>java.exe</code> in the JRE's <code>bin</code> (JDK 6 on Windows XP). Here is the whole cycle for real on JDK 8, plus a look <em>inside</em> the bytecode with <code>javap</code>:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");                                   // an empty folder, like a fresh project
    viet(lab, "HelloWorld.java",
        "public class HelloWorld {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        System.out.println(\\"Hello World!\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "HelloWorld.java");                        // step 1: compile — source code to bytecode
    System.out.println("files now: " + Arrays.toString(sapXep(lab.list())));
    byte[] b = docDau(new File(lab, "HelloWorld.class"), 8);      // the first 8 bytes of the .class file
    System.out.printf("first bytes of HelloWorld.class: %02X%02X%02X%02X ... major version = %d%n",
        b[0], b[1], b[2], b[3], ((b[6] &amp; 0xFF) &lt;&lt; 8) | (b[7] &amp; 0xFF));
    lenh(lab, "java", "HelloWorld");                              // step 2: run — the JVM loads and executes the bytecode
    lenh(lab, "javap", "-c", "HelloWorld");                       // look INSIDE the bytecode (JVM instructions)
}</code></pre>
<div class="out">&gt; javac HelloWorld.java<br>
files now: [HelloWorld.class, HelloWorld.java]<br>
first bytes of HelloWorld.class: CAFEBABE ... major version = 52<br>
&gt; java HelloWorld<br>
Hello World!<br>
&gt; javap -c HelloWorld<br>
Compiled from "HelloWorld.java"<br>
public class HelloWorld {<br>
&nbsp;&nbsp;public HelloWorld();<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: invokespecial #1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/Object."&lt;init&gt;":()V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: return<br>
<br>
&nbsp;&nbsp;public static void main(java.lang.String[]);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: getstatic &nbsp;&nbsp;&nbsp;&nbsp;#2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field java/lang/System.out:Ljava/io/PrintStream;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String Hello World!<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5: invokevirtual #4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/io/PrintStream.println:(Ljava/lang/String;)V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8: return<br>
}</div>
<p>Three things to read in that output: (1) every <code>.class</code> file starts with the bytes <code>CAFEBABE</code>, followed by a version number — <strong>52 = Java 8</strong> (61 = Java 17, 65 = Java 21); (2) the bytecode is instructions for an imaginary machine (<code>getstatic</code>, <code>ldc</code>, <code>invokevirtual</code>), not for an Intel or ARM chip; (3) <code>javap</code> shows a constructor <code>HelloWorld()</code> you never wrote — the compiler added a default one (Chapter 2).</p>
<div class="pitfall">FE trap: "Java is compiled" and "Java is interpreted" are <strong>both</strong> half true — source is compiled to bytecode by <code>javac</code>; bytecode is then interpreted <em>and</em> JIT-compiled by the JVM. Platform independence comes from the <strong>bytecode + JVM</strong>, not from the source code.</div>`,
        `<p class="y-chinh">🎯 <code>javac</code> biên dịch file chữ <code>file.java</code> thành <strong>bytecode độc lập nền tảng</strong> (<code>file.class</code>); <strong>JVM</strong> (<code>java</code>) trên mỗi máy — IBM, Macintosh, Sparc… — thông dịch đúng bytecode đó. Biên dịch một lần, chạy ở mọi nơi.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/8c983cd88921d6729e6ad45ac73c3642373e5c30.svg" alt="Slide 7 vẽ lại: một lần biên dịch, cùng một file .class trên ba hệ điều hành" loading="lazy" /><p class="chu-thich">🧩 Slide 7 vẽ lại: một lần biên dịch, cùng một file .class trên ba hệ điều hành</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 7 redrawn — compile once to bytecode, run on any JVM
' javac chạy một lần trên máy lập trình viên; java chạy trên máy mỗi người dùng
left to right direction
rectangle "HelloWorld.java\\n(plain text source)" as SRC
rectangle "javac\\n(Java compiler)" as JAVAC
rectangle "HelloWorld.class\\n(platform-independent\\nbytecode, CAFEBABE…)" as CLS
node "JVM on Windows\\n(java.exe)" as W
node "JVM on macOS\\n(java)" as M
node "JVM on Linux\\n(java)" as L
SRC --&gt; JAVAC
JAVAC --&gt; CLS
CLS --&gt; W
CLS --&gt; M
CLS --&gt; L
@enduml</code></pre></details>
<p>Ảnh chụp trên slide cho thấy <code>javac.exe</code> trong <code>C:\\Program Files\\Java\\jdk1.6.0\\bin</code> và <code>java.exe</code> trong <code>bin</code> của JRE (JDK 6 trên Windows XP). Đây là trọn vòng chạy thật trên JDK 8, cộng thêm nhìn <em>vào trong</em> bytecode bằng <code>javap</code>:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File lab = new File("lab");                                   // một thư mục trống, như project mới
    viet(lab, "HelloWorld.java",
        "public class HelloWorld {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        System.out.println(\\"Hello World!\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(lab, "javac", "HelloWorld.java");                        // bước 1: biên dịch — mã nguồn thành bytecode
    System.out.println("files now: " + Arrays.toString(sapXep(lab.list())));
    byte[] b = docDau(new File(lab, "HelloWorld.class"), 8);      // 8 byte đầu của file .class
    System.out.printf("first bytes of HelloWorld.class: %02X%02X%02X%02X ... major version = %d%n",
        b[0], b[1], b[2], b[3], ((b[6] &amp; 0xFF) &lt;&lt; 8) | (b[7] &amp; 0xFF));
    lenh(lab, "java", "HelloWorld");                              // bước 2: chạy — JVM nạp và thực thi bytecode
    lenh(lab, "javap", "-c", "HelloWorld");                       // nhìn VÀO TRONG bytecode (lệnh của JVM)
}</code></pre>
<div class="out">&gt; javac HelloWorld.java<br>
files now: [HelloWorld.class, HelloWorld.java]<br>
first bytes of HelloWorld.class: CAFEBABE ... major version = 52<br>
&gt; java HelloWorld<br>
Hello World!<br>
&gt; javap -c HelloWorld<br>
Compiled from "HelloWorld.java"<br>
public class HelloWorld {<br>
&nbsp;&nbsp;public HelloWorld();<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: aload_0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1: invokespecial #1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/lang/Object."&lt;init&gt;":()V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: return<br>
<br>
&nbsp;&nbsp;public static void main(java.lang.String[]);<br>
&nbsp;&nbsp;&nbsp;&nbsp;Code:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: getstatic &nbsp;&nbsp;&nbsp;&nbsp;#2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Field java/lang/System.out:Ljava/io/PrintStream;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3: ldc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// String Hello World!<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5: invokevirtual #4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Method java/io/PrintStream.println:(Ljava/lang/String;)V<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8: return<br>
}</div>
<p>Ba điều cần đọc trong output: (1) file <code>.class</code> nào cũng bắt đầu bằng các byte <code>CAFEBABE</code>, theo sau là số phiên bản — <strong>52 = Java 8</strong> (61 = Java 17, 65 = Java 21); (2) bytecode là lệnh cho một cỗ máy tưởng tượng (<code>getstatic</code>, <code>ldc</code>, <code>invokevirtual</code>), không phải cho chip Intel hay ARM; (3) <code>javap</code> cho thấy một constructor <code>HelloWorld()</code> bạn chưa hề viết — trình biên dịch tự thêm constructor mặc định (Chương 2).</p>
<div class="pitfall">Bẫy FE: "Java là ngôn ngữ biên dịch" và "Java là ngôn ngữ thông dịch" <strong>đều</strong> đúng một nửa — mã nguồn được <code>javac</code> biên dịch ra bytecode; rồi bytecode được JVM thông dịch <em>và</em> biên dịch JIT. Tính độc lập nền tảng đến từ <strong>bytecode + JVM</strong>, không phải từ mã nguồn.</div>`],
      [8, 'Java Virtual Machine',
        `<p class="y-chinh">🎯 The Java Virtual Machine is an <strong>abstract computing machine</strong>: like a real one it has an instruction set and manages memory areas at run time — and it exists as software on top of each real machine.</p>
<p>That sentence is quoted from <em>The Java Virtual Machine Specification</em> (the syllabus's material 1 — the slide's link points to its SE 8 edition), which also says the best-known earlier virtual machine was the P-code machine of UCSD Pascal. The figure on the slide, redrawn:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/2264b77b857d5e605f3347fe28665652625644c3.svg" alt="Slide 8 redrawn: class loader, the runtime memory areas, the execution engine and the native interface" loading="lazy" /><p class="chu-thich">🧩 Slide 8 redrawn: class loader, the runtime memory areas, the execution engine and the native interface</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 8 redrawn — the main parts of a Java Virtual Machine
' Same boxes as the slide's figure; the arrows show who talks to whom
rectangle ".class files\\n(your classes + API classes)" as CF
component "Class Loader" as CL
rectangle "&lt;b&gt;JVM Memory&lt;/b&gt; (runtime data areas)\\n• Method Area — class code, static fields\\n• Heap — every object, every array\\n• Java Stacks — one per thread: local variables\\n• PC Registers — the next instruction of each thread\\n• Native Method Stacks" as MEM
component "Execution Engine\\n(interpreter + JIT compiler\\n+ garbage collector)" as EE
component "Native Method\\nInterface (JNI)" as JNI
rectangle "Native Method Libraries\\n(.dll / .so / .dylib)" as NL
CF -down-&gt; CL : load, verify
CL -down-&gt; MEM
MEM &lt;-down-&gt; EE
EE -right-&gt; JNI
JNI -right-&gt; NL
@enduml</code></pre></details>
<table>
<thead><tr><th>Part</th><th>What it does</th><th>Where PRO192 meets it</th></tr></thead>
<tbody>
<tr><td>Class Loader</td><td>finds <code>.class</code> files on the class path, checks them, loads them when first used</td><td>"Could not find or load main class" (lesson 1.C)</td></tr>
<tr><td>Method Area</td><td>the code of each class and its <code>static</code> fields</td><td><code>static</code> members (Ch. 2)</td></tr>
<tr><td>Heap</td><td>every object created with <code>new</code>, every array</td><td>Ch. 2 "Memory management"</td></tr>
<tr><td>Java Stacks</td><td>one per thread; a frame per method call with its local variables</td><td>recursion, <code>StackOverflowError</code></td></tr>
<tr><td>Execution Engine</td><td>interprets bytecode, JIT-compiles hot code, runs the garbage collector</td><td>why Java is fast enough</td></tr>
<tr><td>Native interface</td><td>calls code written in C (the OS, drivers)</td><td>you rarely touch it</td></tr>
</tbody>
</table>
<p class="meo">🧠 The JVM is like an interpreter at a conference: the speaker (your bytecode) speaks one language; each country (OS) brings its own interpreter (JVM) — the speech never changes.</p>`,
        `<p class="y-chinh">🎯 Máy ảo Java là một <strong>máy tính trừu tượng</strong>: như máy thật, nó có tập lệnh và quản lý các vùng nhớ lúc chạy — và nó tồn tại dưới dạng phần mềm chạy trên từng máy thật.</p>
<p>Câu đó trích từ <em>The Java Virtual Machine Specification</em> (tài liệu 1 của đề cương — link trên slide trỏ tới bản SE 8), tài liệu này còn nói máy ảo nổi tiếng nhất trước đó là máy P-code của UCSD Pascal. Hình trên slide, vẽ lại:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/2264b77b857d5e605f3347fe28665652625644c3.svg" alt="Slide 8 vẽ lại: bộ nạp lớp, các vùng nhớ lúc chạy, bộ máy thực thi và giao diện native" loading="lazy" /><p class="chu-thich">🧩 Slide 8 vẽ lại: bộ nạp lớp, các vùng nhớ lúc chạy, bộ máy thực thi và giao diện native</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 8 redrawn — the main parts of a Java Virtual Machine
' Đúng các hộp trong hình của slide; mũi tên cho thấy ai nói chuyện với ai
rectangle ".class files\\n(your classes + API classes)" as CF
component "Class Loader" as CL
rectangle "&lt;b&gt;JVM Memory&lt;/b&gt; (runtime data areas)\\n• Method Area — class code, static fields\\n• Heap — every object, every array\\n• Java Stacks — one per thread: local variables\\n• PC Registers — the next instruction of each thread\\n• Native Method Stacks" as MEM
component "Execution Engine\\n(interpreter + JIT compiler\\n+ garbage collector)" as EE
component "Native Method\\nInterface (JNI)" as JNI
rectangle "Native Method Libraries\\n(.dll / .so / .dylib)" as NL
CF -down-&gt; CL : load, verify
CL -down-&gt; MEM
MEM &lt;-down-&gt; EE
EE -right-&gt; JNI
JNI -right-&gt; NL
@enduml</code></pre></details>
<table>
<thead><tr><th>Bộ phận</th><th>Làm gì</th><th>PRO192 gặp ở đâu</th></tr></thead>
<tbody>
<tr><td>Class Loader (bộ nạp lớp)</td><td>tìm file <code>.class</code> trên class path, kiểm tra, nạp khi dùng lần đầu</td><td>"Could not find or load main class" (bài 1.C)</td></tr>
<tr><td>Method Area (vùng phương thức)</td><td>code của từng lớp và các trường <code>static</code></td><td>thành viên <code>static</code> (Ch. 2)</td></tr>
<tr><td>Heap (vùng nhớ động)</td><td>mọi đối tượng tạo bằng <code>new</code>, mọi mảng</td><td>Ch. 2 "Quản lý bộ nhớ"</td></tr>
<tr><td>Java Stacks (ngăn xếp)</td><td>mỗi luồng một cái; mỗi lời gọi phương thức một khung chứa biến cục bộ</td><td>đệ quy, <code>StackOverflowError</code></td></tr>
<tr><td>Execution Engine (bộ máy thực thi)</td><td>thông dịch bytecode, biên dịch JIT phần chạy nhiều, chạy bộ thu gom rác</td><td>vì sao Java đủ nhanh</td></tr>
<tr><td>Native interface (giao diện native)</td><td>gọi code viết bằng C (hệ điều hành, driver)</td><td>hiếm khi đụng tới</td></tr>
</tbody>
</table>
<p class="meo">🧠 JVM giống người phiên dịch ở hội nghị: diễn giả (bytecode của bạn) nói một thứ tiếng; mỗi nước (hệ điều hành) mang người phiên dịch của mình (JVM) — bài nói không đổi một chữ.</p>`],
      [9, 'Java Platform',
        `<p class="y-chinh">🎯 A platform is the hardware or software environment a program runs in; the <strong>Java platform</strong> is a software-only platform with two components: the <strong>JVM</strong> and the <strong>Java API</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/2f809f73da45df329c96da1184c1895c0427264c.svg" alt="Slide 9 redrawn: your program talks to the API; the API runs on the JVM; the JVM runs on the real machine" loading="lazy" /><p class="chu-thich">🧩 Slide 9 redrawn: your program talks to the API; the API runs on the JVM; the JVM runs on the real machine</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 9 redrawn — the Java platform sits between your program and the machine
' Your code only talks to the API; the JVM hides the operating system
rectangle "MyProgram.java (your code)" as P #FFFFFF
rectangle "Java platform" as JP {
  rectangle "Java API — ready-made classes\\n(String, Math, ArrayList, Scanner, LocalDate…)" as API #ECFDF5
  rectangle "Java Virtual Machine" as JVM #F0F9FF
}
rectangle "Operating system + hardware\\n(Windows / macOS / Linux, x86 / ARM)" as OS #FFF7ED
P -down-&gt; API : calls
API -down-&gt; JVM : runs on
JVM -down-&gt; OS : runs on
@enduml</code></pre></details>
<p>The <strong>API</strong> (Application Programming Interface) is a large library of ready-made classes grouped in packages: <code>java.lang</code> (String, Math — imported automatically), <code>java.util</code> (ArrayList, Scanner, Collections), <code>java.io</code> (files), <code>java.time</code> (dates, since Java 8). None of the work below is our code — we only call it:</p>
<pre><code class="language-java">// release: 8
// Slide 9: the Java platform = JVM + API — a few ready-made API classes doing real work, no code of ours inside them
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ApiCoSan {
    public static void main(String[] args) {
        // java.lang.Math — imported automatically
        System.out.println("sqrt(2)      = " + Math.sqrt(2));
        System.out.println("max(7, 3)    = " + Math.max(7, 3));
        // java.lang.String — text is an object with methods
        String name = "nguyen van an";
        System.out.println("upper case   = " + name.toUpperCase());
        System.out.println("length       = " + name.length());
        // java.util.ArrayList + Collections — a list that grows, and a ready-made sort
        List&lt;Integer&gt; marks = new ArrayList&lt;&gt;();
        marks.add(8); marks.add(5); marks.add(9); marks.add(7);
        Collections.sort(marks);
        System.out.println("sorted marks = " + marks);
        // java.time (since Java 8) — dates without counting days by hand
        LocalDate start = LocalDate.of(2026, 9, 7);
        LocalDate exam = start.plusWeeks(10);
        DayOfWeek day = exam.getDayOfWeek();
        System.out.println("10 weeks after " + start + " is " + exam + " (" + day + ")");
    }
}</code></pre>
<div class="out">sqrt(2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 1.4142135623730951<br>
max(7, 3) &nbsp;&nbsp;&nbsp;= 7<br>
upper case &nbsp;&nbsp;= NGUYEN VAN AN<br>
length &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 13<br>
sorted marks = [5, 7, 8, 9]<br>
10 weeks after 2026-09-07 is 2026-11-16 (MONDAY)</div>
<p>Knowing the API is half of being productive in Java: PE questions expect <code>String</code> methods (<code>toUpperCase</code>, <code>substring</code>, <code>split</code>), <code>ArrayList</code> and <code>Collections.sort</code> without hesitation. The official reference is the API documentation (docs.oracle.com/javase/8/docs/api for the exam JDK).</p>
<div class="pitfall">FE trap: "the Java platform = JDK" is wrong. Platform = <strong>JVM + API</strong> (what programs need to <em>run</em>); the JDK adds the developer tools on top (slide 22).</div>`,
        `<p class="y-chinh">🎯 Nền tảng (platform) là môi trường phần cứng hoặc phần mềm mà chương trình chạy trong đó; <strong>nền tảng Java</strong> là nền tảng thuần phần mềm gồm hai thành phần: <strong>JVM</strong> và <strong>Java API</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/2f809f73da45df329c96da1184c1895c0427264c.svg" alt="Slide 9 vẽ lại: chương trình của bạn nói chuyện với API; API chạy trên JVM; JVM chạy trên máy thật" loading="lazy" /><p class="chu-thich">🧩 Slide 9 vẽ lại: chương trình của bạn nói chuyện với API; API chạy trên JVM; JVM chạy trên máy thật</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 9 redrawn — the Java platform sits between your program and the machine
' Code của bạn chỉ nói chuyện với API; JVM che hệ điều hành đi
rectangle "MyProgram.java (your code)" as P #FFFFFF
rectangle "Java platform" as JP {
  rectangle "Java API — ready-made classes\\n(String, Math, ArrayList, Scanner, LocalDate…)" as API #ECFDF5
  rectangle "Java Virtual Machine" as JVM #F0F9FF
}
rectangle "Operating system + hardware\\n(Windows / macOS / Linux, x86 / ARM)" as OS #FFF7ED
P -down-&gt; API : calls
API -down-&gt; JVM : runs on
JVM -down-&gt; OS : runs on
@enduml</code></pre></details>
<p><strong>API</strong> (Application Programming Interface — giao diện lập trình ứng dụng) là một thư viện lớn các lớp làm sẵn, gom theo gói (package): <code>java.lang</code> (String, Math — tự import sẵn), <code>java.util</code> (ArrayList, Scanner, Collections), <code>java.io</code> (tệp), <code>java.time</code> (ngày tháng, từ Java 8). Không phần việc nào dưới đây là code của ta — ta chỉ gọi nó:</p>
<pre><code class="language-java">// release: 8
// Slide 9: nền tảng Java = JVM + API — vài lớp API có sẵn làm việc thật, bên trong không có dòng code nào của ta
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ApiCoSan {
    public static void main(String[] args) {
        // java.lang.Math — tự import sẵn
        System.out.println("sqrt(2)      = " + Math.sqrt(2));
        System.out.println("max(7, 3)    = " + Math.max(7, 3));
        // java.lang.String — chữ là đối tượng có phương thức
        String name = "nguyen van an";
        System.out.println("upper case   = " + name.toUpperCase());
        System.out.println("length       = " + name.length());
        // java.util.ArrayList + Collections — danh sách tự lớn, và hàm sắp xếp có sẵn
        List&lt;Integer&gt; marks = new ArrayList&lt;&gt;();
        marks.add(8); marks.add(5); marks.add(9); marks.add(7);
        Collections.sort(marks);
        System.out.println("sorted marks = " + marks);
        // java.time (từ Java 8) — ngày tháng không phải tự đếm
        LocalDate start = LocalDate.of(2026, 9, 7);
        LocalDate exam = start.plusWeeks(10);
        DayOfWeek day = exam.getDayOfWeek();
        System.out.println("10 weeks after " + start + " is " + exam + " (" + day + ")");
    }
}</code></pre>
<div class="out">sqrt(2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 1.4142135623730951<br>
max(7, 3) &nbsp;&nbsp;&nbsp;= 7<br>
upper case &nbsp;&nbsp;= NGUYEN VAN AN<br>
length &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 13<br>
sorted marks = [5, 7, 8, 9]<br>
10 weeks after 2026-09-07 is 2026-11-16 (MONDAY)</div>
<p>Biết API là một nửa của việc làm Java năng suất: câu PE mặc định bạn dùng phương thức <code>String</code> (<code>toUpperCase</code>, <code>substring</code>, <code>split</code>), <code>ArrayList</code> và <code>Collections.sort</code> không chút ngập ngừng. Tài liệu tra cứu chính thức là API documentation (docs.oracle.com/javase/8/docs/api cho JDK phòng thi).</p>
<div class="pitfall">Bẫy FE: "nền tảng Java = JDK" là sai. Nền tảng = <strong>JVM + API</strong> (thứ chương trình cần để <em>chạy</em>); JDK thêm công cụ cho lập trình viên lên trên (slide 22).</div>`],
      [10, 'Set up Environment Variables',
        `<p class="y-chinh">🎯 After installing the JDK, set environment variables that point to its folder — on Windows XP: My Computer → Properties → Advanced → Environment Variables → System Variables → Path → Edit; the slide also sets a <code>CLASSPATH</code> that begins with a dot, "so classes are searched first in the current working folder".</p>
<p><strong>PATH</strong> is the list of folders Windows searches when you type a command. Add the JDK's <code>bin</code> (for example <code>C:\\Program Files\\Eclipse Adoptium\\jdk-8.0.504.1-hotspot\\bin</code>) and <code>javac</code> works in any Command Prompt. Without it you get the classic <code>'javac' is not recognized as an internal or external command</code> (slide 24).</p>
<p><strong>CLASSPATH</strong> is the list of places where <code>java</code> looks for <code>.class</code> files. Here is what it really does — four runs on JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File work = new File("work");                                 // our "current working folder"
    viet(work, "HelloWorld.java", HELLO);
    new File("libs").mkdirs();                                    // some other folder that a CLASSPATH might list
    lenh(work, "javac", "HelloWorld.java");
    System.out.println("-- 1. no CLASSPATH at all: java searches the current folder by default --");
    lenhEnv(work, null, "java", "HelloWorld");
    System.out.println("-- 2. CLASSPATH = &lt;root&gt;/libs  (no dot): the current folder is NOT searched any more --");
    lenhEnv(work, new File("libs").getAbsolutePath(), "java", "HelloWorld");
    System.out.println("-- 3. CLASSPATH = .:&lt;root&gt;/libs  (dot first, like the slide's \\".;C:\\\\...\\"): found again --");
    lenhEnv(work, "." + File.pathSeparator + new File("libs").getAbsolutePath(), "java", "HelloWorld");
    System.out.println("-- 4. -cp on the command line beats the CLASSPATH variable --");
    lenhEnv(work, new File("libs").getAbsolutePath(), "java", "-cp", ".", "HelloWorld");
}</code></pre>
<div class="out">&gt; javac HelloWorld.java<br>
-- 1. no CLASSPATH at all: java searches the current folder by default --<br>
&gt; java HelloWorld<br>
Hello World!<br>
-- 2. CLASSPATH = &lt;root&gt;/libs &nbsp;(no dot): the current folder is NOT searched any more --<br>
&gt; java HelloWorld<br>
Error: Could not find or load main class HelloWorld<br>
(exit code 1)<br>
-- 3. CLASSPATH = .:&lt;root&gt;/libs &nbsp;(dot first, like the slide's ".;C:\\..."): found again --<br>
&gt; java HelloWorld<br>
Hello World!<br>
-- 4. -cp on the command line beats the CLASSPATH variable --<br>
&gt; java -cp . HelloWorld<br>
Hello World!</div>
<p>Run 2 is why the slide insists on the leading dot: once CLASSPATH is set, it <em>replaces</em> the default "current folder". The modern advice is simpler: <strong>do not set CLASSPATH at all</strong> (the default is already the current folder) and pass <code>-cp</code> when you need something else. The slide's <code>jdk1.6.0\\lib</code> entry has been unnecessary for many years. Windows 10/11 path today: Settings → System → About → Advanced system settings → Environment Variables.</p>
<div class="pitfall">Lab trap: a stray CLASSPATH left by some other software (without the dot) makes <code>java HelloWorld</code> fail in the very folder that contains <code>HelloWorld.class</code> — exactly run 2 above. Check it with <code>echo %CLASSPATH%</code>. On Windows the separator is <code>;</code>, on macOS/Linux <code>:</code>.</div>`,
        `<p class="y-chinh">🎯 Cài JDK xong, đặt biến môi trường trỏ tới thư mục của nó — trên Windows XP: My Computer → Properties → Advanced → Environment Variables → System Variables → Path → Edit; slide còn đặt một <code>CLASSPATH</code> bắt đầu bằng dấu chấm, "để lớp được tìm trước tiên trong thư mục làm việc hiện tại".</p>
<p><strong>PATH</strong> là danh sách thư mục mà Windows lục tìm khi bạn gõ một lệnh. Thêm thư mục <code>bin</code> của JDK (ví dụ <code>C:\\Program Files\\Eclipse Adoptium\\jdk-8.0.504.1-hotspot\\bin</code>) là <code>javac</code> chạy được ở mọi Command Prompt. Thiếu nó bạn gặp lỗi kinh điển <code>'javac' is not recognized as an internal or external command</code> (slide 24).</p>
<p><strong>CLASSPATH</strong> là danh sách nơi <code>java</code> đi tìm file <code>.class</code>. Đây là việc nó thật sự làm — bốn lần chạy trên JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File work = new File("work");                                 // "thư mục làm việc hiện tại" của ta
    viet(work, "HelloWorld.java", HELLO);
    new File("libs").mkdirs();                                    // một thư mục khác mà CLASSPATH có thể liệt kê
    lenh(work, "javac", "HelloWorld.java");
    System.out.println("-- 1. no CLASSPATH at all: java searches the current folder by default --");
    lenhEnv(work, null, "java", "HelloWorld");
    System.out.println("-- 2. CLASSPATH = &lt;root&gt;/libs  (no dot): the current folder is NOT searched any more --");
    lenhEnv(work, new File("libs").getAbsolutePath(), "java", "HelloWorld");
    System.out.println("-- 3. CLASSPATH = .:&lt;root&gt;/libs  (dot first, like the slide's \\".;C:\\\\...\\"): found again --");
    lenhEnv(work, "." + File.pathSeparator + new File("libs").getAbsolutePath(), "java", "HelloWorld");
    System.out.println("-- 4. -cp on the command line beats the CLASSPATH variable --");
    lenhEnv(work, new File("libs").getAbsolutePath(), "java", "-cp", ".", "HelloWorld");
}</code></pre>
<div class="out">&gt; javac HelloWorld.java<br>
-- 1. no CLASSPATH at all: java searches the current folder by default --<br>
&gt; java HelloWorld<br>
Hello World!<br>
-- 2. CLASSPATH = &lt;root&gt;/libs &nbsp;(no dot): the current folder is NOT searched any more --<br>
&gt; java HelloWorld<br>
Error: Could not find or load main class HelloWorld<br>
(exit code 1)<br>
-- 3. CLASSPATH = .:&lt;root&gt;/libs &nbsp;(dot first, like the slide's ".;C:\\..."): found again --<br>
&gt; java HelloWorld<br>
Hello World!<br>
-- 4. -cp on the command line beats the CLASSPATH variable --<br>
&gt; java -cp . HelloWorld<br>
Hello World!</div>
<p>Lần chạy 2 là lý do slide nhấn mạnh dấu chấm ở đầu: một khi CLASSPATH đã được đặt, nó <em>thay thế</em> giá trị mặc định "thư mục hiện tại". Lời khuyên ngày nay đơn giản hơn: <strong>đừng đặt CLASSPATH</strong> (mặc định đã là thư mục hiện tại) và dùng <code>-cp</code> khi cần chỗ khác. Mục <code>jdk1.6.0\\lib</code> trên slide đã thừa từ nhiều năm nay. Đường đi trên Windows 10/11 hiện nay: Settings → System → About → Advanced system settings → Environment Variables.</p>
<div class="pitfall">Bẫy phòng lab: một CLASSPATH lạc (không có dấu chấm) do phần mềm khác để lại làm <code>java HelloWorld</code> hỏng ngay trong thư mục chứa <code>HelloWorld.class</code> — đúng lần chạy 2 ở trên. Kiểm tra bằng <code>echo %CLASSPATH%</code>. Trên Windows dấu tách là <code>;</code>, trên macOS/Linux là <code>:</code>.</div>`],
    ]),
    bi(`<p>Continue with <strong>1.B → 1.C</strong>: the first program in NetBeans, running it without NetBeans, and every classic error, each produced for real.</p>`,
    `<p>Học tiếp <strong>1.B → 1.C</strong>: chương trình đầu tiên trong NetBeans, chạy nó không cần NetBeans, và mọi lỗi kinh điển, mỗi lỗi đều tạo ra thật.</p>`),
    books([
      ['horstmann1', 'Ch. 1 "An Introduction to Java" (white paper buzzwords, a short history) and Ch. 2 "The Java Programming Environment"', 'Chương 1 "An Introduction to Java" (các từ khoá của sách trắng, lịch sử ngắn) và Chương 2 "The Java Programming Environment"'],
      ['jvms8', 'Chapter 1 "Introduction" and Chapter 2.5 "Run-Time Data Areas"', 'Chương 1 "Introduction" và mục 2.5 "Run-Time Data Areas"'],
      ['javaTutorial', 'trail "Getting Started" — "The Java Technology Phenomenon"', 'trail "Getting Started" — "The Java Technology Phenomenon"'],
      ['fuOffline', 'part "Foundations" — Java Virtual Machine, Java Platform', 'phần "Foundations" — Java Virtual Machine, Java Platform'],
    ]),
  ].join('\n'),
};

/* ───────── 1.C — 📑 Slide by slide · Getting Started (2/2): first program, running it, JDK tools, errors (slides 11–26) ───────── */
const L_pro3_2 = {
  title: '1.C — 📑 Slide by slide · Getting Started (2/2): first program, running it, JDK tools, errors (slides 11–26)|||1.C — 📑 Học theo từng slide · Getting Started (2/2): chương trình đầu tiên, cách chạy, công cụ JDK, lỗi hay gặp (slide 11–26)',
  slug: 'pro192-slide-pro3-2',
  type: 'VIDEO',
  description: 'Giảng slide 11–26 bộ "Getting Started": tạo project NetBeans, cấu trúc thư mục src/build/nbproject, thêm lớp (và vì sao không nên để default package), viết và chạy Hello World theo bốn cách, chạy ngoài NetBeans bằng java -cp và file BAT, javac/java/javap, giải phẫu chương trình Hello World, lỗi biên dịch và lỗi chạy kinh điển, sáu chỗ sửa của slide "Try and Explore" — mọi lệnh đều chạy thật trên JDK 8 và in đúng thông báo thật; chỉ ra chỗ slide sai (lớp Employee không có main).',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.C · school deck "Getting Started", slides 11–26</span>
<h2>Your first program — in NetBeans, then without it, then broken on purpose</h2>
<p class="lead">Slides 11–18 build Hello World in NetBeans step by step; slides 19–22 run it the way an end user (or the PE grader) does, from a command line; slides 23–26 take the program apart and break it in every classic way. The screenshots are NetBeans 8.0.2 — the menus are almost the same in NetBeans 31 (see the ⭐ lessons "Installing the environment" and "First hands-on session" in Section 0). Every console transcript is a real run on JDK 8.</p>`,
    `<span class="eyebrow">Chương 1 · Bài 1.C · bộ slide "Getting Started" của trường, slide 11–26</span>
<h2>Chương trình đầu tiên — trong NetBeans, rồi không cần nó, rồi cố tình làm hỏng</h2>
<p class="lead">Slide 11–18 dựng Hello World trong NetBeans từng bước; slide 19–22 chạy nó theo cách người dùng cuối (hay máy chấm PE) chạy, từ dòng lệnh; slide 23–26 mổ xẻ chương trình và làm hỏng nó theo mọi kiểu kinh điển. Ảnh chụp là NetBeans 8.0.2 — menu ở NetBeans 31 gần như y hệt (xem các bài ⭐ "Cài môi trường" và "Buổi thực hành đầu tiên" ở Mục 0). Mọi đoạn console đều là lần chạy thật trên JDK 8.</p>`),
    walkHead('pro3', 11, 26),
    walk('pro3', [
      [11, 'The first Java program in the NetBeans',
        `<p class="y-chinh">🎯 The goal: a program that prints <code>Hello World</code>, in four steps — (1) create a NetBeans project, (2) add a Java class, (3) write the code, (4) compile and run.</p>
<p>Why start with something so small? Because it tests the <strong>whole chain</strong> at once: the JDK is installed, NetBeans finds it, the compiler works, the JVM runs, and you can see output. If Hello World works, every later failure is in <em>your</em> code, not in the setup.</p>
<p>What NetBeans does for you in these four steps, in terms of the tools of lesson 1.B:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/0408a352128ac71869c497fe9d0f2bc70a289dfb.svg" alt="Slides 17–18: what &quot;Run&quot; really does — save, javac into build/classes, then java" loading="lazy" /><p class="chu-thich">🧩 Slides 17–18: what "Run" really does — save, javac into build/classes, then java</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 17–18 — what happens when you press Run in NetBeans
' Run = save → compile changed files → start java with build/classes on the classpath
start
:press Run File (Shift+F6)\\nor Run Project (F6);
if (Run Project and no main class set?) then (yes)
  :dialog "Select the main class";
endif
:save every edited .java file;
:javac → build/classes/*.class;
if (compile errors?) then (yes)
  :red lines + messages in Output;
  stop
endif
:java -cp build/classes HelloWorld;
:program output + "BUILD SUCCESSFUL"\\nin the Output window;
stop
@enduml</code></pre></details>
<p class="meo">🧠 An IDE is not magic: it is a text editor plus buttons that type <code>javac</code> and <code>java</code> for you. Slides 19–22 type them by hand.</p>`,
        `<p class="y-chinh">🎯 Mục tiêu: một chương trình in ra <code>Hello World</code>, qua bốn bước — (1) tạo project NetBeans, (2) thêm một lớp Java, (3) viết code, (4) biên dịch và chạy.</p>
<p>Sao lại bắt đầu bằng thứ nhỏ thế? Vì nó thử <strong>cả dây chuyền</strong> một lúc: JDK đã cài, NetBeans tìm thấy nó, trình biên dịch chạy, JVM chạy, và bạn thấy được output. Hello World chạy được thì mọi lỗi về sau nằm trong code <em>của bạn</em>, không phải trong khâu cài đặt.</p>
<p>NetBeans làm gì giúp bạn trong bốn bước này, nói bằng các công cụ của bài 1.B:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/0408a352128ac71869c497fe9d0f2bc70a289dfb.svg" alt="Slide 17–18: &quot;Run&quot; thật sự làm gì — lưu, javac ra build/classes, rồi java" loading="lazy" /><p class="chu-thich">🧩 Slide 17–18: "Run" thật sự làm gì — lưu, javac ra build/classes, rồi java</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 17–18 — what happens when you press Run in NetBeans
' Run = lưu → biên dịch file đã đổi → khởi động java với build/classes trong classpath
start
:press Run File (Shift+F6)\\nor Run Project (F6);
if (Run Project and no main class set?) then (yes)
  :dialog "Select the main class";
endif
:save every edited .java file;
:javac → build/classes/*.class;
if (compile errors?) then (yes)
  :red lines + messages in Output;
  stop
endif
:java -cp build/classes HelloWorld;
:program output + "BUILD SUCCESSFUL"\\nin the Output window;
stop
@enduml</code></pre></details>
<p class="meo">🧠 IDE không phải phép màu: nó là trình soạn chữ cộng các nút bấm gõ hộ bạn <code>javac</code> và <code>java</code>. Slide 19–22 gõ tay các lệnh đó.</p>`],
      [12, 'Step 1- New Project',
        `<p class="y-chinh">🎯 File → New Project → Category <strong>Java</strong> → Project <strong>Java Application</strong> → Next → name it (FirstPrj) and choose a location; the checkbox <strong>Create Main Class</strong> decides whether NetBeans generates a class with <code>main</code> for you.</p>
<p>The slide's advice: if the box is <strong>checked</strong>, NetBeans creates a main class automatically (in NetBeans 8 it is named after the project, <code>firstprj.FirstPrj</code> — the slide says "Main", which was the name in much older versions); if it is <strong>unchecked</strong>, you start empty and can put several small programs, each with its own <code>main</code>, into one project — handy for practising.</p>
<table>
<thead><tr><th>NetBeans 8.0.2 (slide)</th><th>NetBeans 12–31 (today)</th></tr></thead>
<tbody>
<tr><td>Categories: Java → Java Application</td><td>Categories: <strong>Java with Ant</strong> → Java Application (the same project type; Maven and Gradle projects sit next to it)</td></tr>
<tr><td>Project Location: K:\\GiangDay\\FU\\…</td><td>any folder you own — avoid paths with spaces or Vietnamese accents</td></tr>
<tr><td>Create Main Class ☐</td><td>same checkbox</td></tr>
</tbody>
</table>
<div class="pitfall">PE trap: the exam's given project tells you where to write your classes (often "in the default package of the NetBean"). Do not create a new project or rename packages in the exam — the grader's <code>Main</code> expects your class exactly where the paper says.</div>`,
        `<p class="y-chinh">🎯 File → New Project → Category <strong>Java</strong> → Project <strong>Java Application</strong> → Next → đặt tên (FirstPrj) và chọn chỗ lưu; ô <strong>Create Main Class</strong> quyết định NetBeans có tự sinh một lớp chứa <code>main</code> cho bạn hay không.</p>
<p>Lời khuyên của slide: nếu <strong>tích</strong> ô, NetBeans tự tạo lớp main (ở NetBeans 8 nó đặt theo tên project, <code>firstprj.FirstPrj</code> — slide ghi "Main", đó là tên ở các bản cũ hơn nhiều); nếu <strong>bỏ tích</strong>, bạn bắt đầu với project trống và có thể để nhiều chương trình nhỏ, mỗi cái một <code>main</code> riêng, trong cùng một project — tiện để luyện tập.</p>
<table>
<thead><tr><th>NetBeans 8.0.2 (slide)</th><th>NetBeans 12–31 (hiện nay)</th></tr></thead>
<tbody>
<tr><td>Categories: Java → Java Application</td><td>Categories: <strong>Java with Ant</strong> → Java Application (cùng loại project; project Maven và Gradle nằm cạnh)</td></tr>
<tr><td>Project Location: K:\\GiangDay\\FU\\…</td><td>thư mục nào của bạn cũng được — tránh đường dẫn có dấu cách hay tiếng Việt có dấu</td></tr>
<tr><td>Create Main Class ☐</td><td>ô y như cũ</td></tr>
</tbody>
</table>
<div class="pitfall">Bẫy PE: project đề cho sẵn sẽ nói bạn viết lớp ở đâu (thường là "trong default package của NetBean"). Đừng tạo project mới hay đổi tên package trong giờ thi — lớp <code>Main</code> của máy chấm chờ lớp của bạn đúng chỗ đề ghi.</div>`],
      [13, 'New Project... Initial Project Structure',
        `<p class="y-chinh">🎯 The new project as folders on disk (Windows Explorer: FirstPrj → nbproject, src) and as NetBeans shows it (Projects tab: FirstPrj → Source Packages → &lt;default package&gt;, Libraries → JDK 1.8 (Default)).</p>
<p>The two views are the same thing seen differently. After the first build (slide 18) one more folder appears:</p>
<pre><code class="language-plaintext">FirstPrj/
├── nbproject/          NetBeans settings (project.properties: which JDK, source level…)
├── src/                your .java files  = "Source Packages" in NetBeans
│   └── HelloWorld.java
├── build/
│   └── classes/        the .class files javac produced  (created by Build/Run)
├── dist/
│   └── FirstPrj.jar    created by "Clean and Build"
└── build.xml           the Ant script NetBeans runs</code></pre>
<p><strong>Libraries → JDK 1.8 (Default)</strong> means this project compiles with Java 8 — exactly what you want for PRO192. In a modern NetBeans running on JDK 21 you set this per project (Project Properties → Libraries → Java Platform), as the ⭐ installation lesson shows.</p>
<p class="meo">🧠 Submit <code>src</code> (your work) and <code>dist/*.jar</code> (the runnable result); never zip <code>build</code> — it is regenerated anyway. The PE asks for exactly that: a <em>run</em> folder with the jar and a <em>src</em> folder with the project.</p>`,
        `<p class="y-chinh">🎯 Project mới dưới dạng thư mục trên đĩa (Windows Explorer: FirstPrj → nbproject, src) và dưới dạng NetBeans hiển thị (tab Projects: FirstPrj → Source Packages → &lt;default package&gt;, Libraries → JDK 1.8 (Default)).</p>
<p>Hai góc nhìn là cùng một thứ. Sau lần build đầu tiên (slide 18) có thêm một thư mục:</p>
<pre><code class="language-plaintext">FirstPrj/
├── nbproject/          cấu hình NetBeans (project.properties: dùng JDK nào, mức mã nguồn…)
├── src/                các file .java của bạn = "Source Packages" trong NetBeans
│   └── HelloWorld.java
├── build/
│   └── classes/        các file .class javac tạo ra (Build/Run tạo)
├── dist/
│   └── FirstPrj.jar    do "Clean and Build" tạo
└── build.xml           kịch bản Ant mà NetBeans chạy</code></pre>
<p><strong>Libraries → JDK 1.8 (Default)</strong> nghĩa là project này biên dịch bằng Java 8 — đúng thứ bạn muốn cho PRO192. Với NetBeans mới chạy trên JDK 21, bạn đặt điều này cho từng project (Project Properties → Libraries → Java Platform), như bài ⭐ cài môi trường hướng dẫn.</p>
<p class="meo">🧠 Nộp <code>src</code> (công sức của bạn) và <code>dist/*.jar</code> (kết quả chạy được); đừng nén <code>build</code> — đằng nào nó cũng được tạo lại. Đề PE đòi đúng như vậy: thư mục <em>run</em> chứa file jar và thư mục <em>src</em> chứa project.</p>`],
      [14, 'Step 2: Add a Java Class',
        `<p class="y-chinh">🎯 Right-click &lt;default package&gt; → New → Java Class → Class Name <code>HelloWorld</code> → Finish. A <strong>package</strong> is a subdirectory of the project's <code>src</code> folder; in this demo the package is left empty on purpose.</p>
<p>The slide circles NetBeans' warning in red: <em>"It is highly recommended that you do not place Java classes in the default package."</em> Why? Classes in the <strong>default package</strong> (no <code>package</code> line) cannot be imported by classes inside a named package, and two libraries with the same class name would clash. Real projects always use packages (<code>model</code>, <code>view</code>, <code>controller</code> in the Banking sample; <code>com.labflow.reservation</code> in Spring Boot).</p>
<p>So why does the demo — and the PE — use the default package? Simplicity: one folder, no <code>package</code> line, nothing to get wrong. Follow the exam paper's instruction in the exam, and use packages everywhere else (Chapter 3 covers them).</p>
<div class="pitfall">If the PE says "in the default package", do <strong>not</strong> add <code>package xyz;</code> at the top — the grader's code is in the default package and will not see your class.</div>`,
        `<p class="y-chinh">🎯 Chuột phải &lt;default package&gt; → New → Java Class → Class Name <code>HelloWorld</code> → Finish. <strong>Package (gói)</strong> là một thư mục con của thư mục <code>src</code> trong project; ở demo này package cố ý để trống.</p>
<p>Slide khoanh đỏ cảnh báo của NetBeans: <em>"It is highly recommended that you do not place Java classes in the default package"</em> (rất nên tránh đặt lớp Java vào default package). Vì sao? Lớp trong <strong>default package</strong> (không có dòng <code>package</code>) không import được từ lớp nằm trong package có tên, và hai thư viện có cùng tên lớp sẽ đụng nhau. Dự án thật luôn dùng package (<code>model</code>, <code>view</code>, <code>controller</code> trong project mẫu Banking; <code>com.labflow.reservation</code> trong Spring Boot).</p>
<p>Vậy sao demo — và bài PE — lại dùng default package? Vì đơn giản: một thư mục, không có dòng <code>package</code>, không có gì để sai. Trong giờ thi làm đúng chỉ dẫn của đề, ngoài giờ thi dùng package ở mọi nơi (Chương 3 nói kỹ).</p>
<div class="pitfall">Nếu đề PE ghi "in the default package", <strong>đừng</strong> thêm <code>package xyz;</code> ở đầu file — code của máy chấm nằm ở default package và sẽ không thấy lớp của bạn.</div>`],
      [15, 'Add a Java Class...',
        `<p class="y-chinh">🎯 The result of step 2: a new file <code>HelloWorld.java</code> (about 1 KB) appears in <code>FirstPrj\\src</code> on disk, and in NetBeans under &lt;default package&gt;, opened in the editor with a license-header comment and an empty <code>public class HelloWorld { }</code>.</p>
<p>The rule that NetBeans just followed for you is the first rule of Java source files: a <strong><code>public</code> class must live in a file with exactly the same name</strong> — <code>HelloWorld</code> ⇒ <code>HelloWorld.java</code>, with the same upper/lower case. Slide 25 breaks this rule on purpose and shows the compiler's reaction.</p>
<p>The grey <code>/* To change this license header … */</code> block is a NetBeans template comment — harmless, delete it if you like. The <code>/**…4 lines */</code> fold just below is a <strong>Javadoc</strong> comment (slide 23).</p>
<p class="meo">🧠 One public class = one file = one name. Rename the class in NetBeans with Refactor → Rename (Ctrl+R) so the file is renamed too.</p>`,
        `<p class="y-chinh">🎯 Kết quả bước 2: một file mới <code>HelloWorld.java</code> (khoảng 1 KB) xuất hiện trong <code>FirstPrj\\src</code> trên đĩa, và trong NetBeans dưới &lt;default package&gt;, mở sẵn trong trình soạn với một chú thích license ở đầu và một lớp rỗng <code>public class HelloWorld { }</code>.</p>
<p>Luật mà NetBeans vừa làm hộ bạn là luật đầu tiên của file nguồn Java: <strong>lớp <code>public</code> phải nằm trong file có đúng cùng tên</strong> — <code>HelloWorld</code> ⇒ <code>HelloWorld.java</code>, giống cả chữ hoa chữ thường. Slide 25 cố tình phá luật này và cho xem trình biên dịch phản ứng ra sao.</p>
<p>Khối xám <code>/* To change this license header … */</code> là chú thích mẫu của NetBeans — vô hại, muốn thì xoá. Khối gập <code>/**…4 lines */</code> ngay dưới là chú thích <strong>Javadoc</strong> (slide 23).</p>
<p class="meo">🧠 Một lớp public = một file = một tên. Đổi tên lớp trong NetBeans bằng Refactor → Rename (Ctrl+R) để file được đổi tên theo.</p>`],
      [16, 'Step 3: Write code',
        `<p class="y-chinh">🎯 Inside the class, type the <code>main</code> method with one statement: <code>System.out.println("Hello World!");</code> — the program the whole deck is about.</p>
<pre><code class="language-java">// release: 8
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}</code></pre>
<div class="out">Hello World!</div>
<p>Every word has a job (slide 23 goes through them): <code>public class HelloWorld</code> declares the class; <code>public static void main(String[] args)</code> is the <strong>entry point</strong> the JVM looks for; <code>System.out</code> is the standard output stream (an object); <code>println</code> prints a line and moves to the next one. The first line <code>// release: 8</code> is only this site's marker: the program is also compiled with <code>--release 8</code> and run on a real JDK 8.</p>
<p>NetBeans helps while you type: write <code>psvm</code> + Tab for the main method and <code>sout</code> + Tab for <code>System.out.println("")</code>; Alt+Shift+F formats the code.</p>
<div class="pitfall">Typing traps from C: <code>System</code> and <code>String</code> start with a capital letter; the string uses straight double quotes <code>"…"</code> (curly quotes copied from Word do not compile); every statement ends with <code>;</code>.</div>`,
        `<p class="y-chinh">🎯 Bên trong lớp, gõ phương thức <code>main</code> với một câu lệnh: <code>System.out.println("Hello World!");</code> — chương trình mà cả bộ slide nói về.</p>
<pre><code class="language-java">// release: 8
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}</code></pre>
<div class="out">Hello World!</div>
<p>Từ nào cũng có việc (slide 23 đi qua từng từ): <code>public class HelloWorld</code> khai báo lớp; <code>public static void main(String[] args)</code> là <strong>điểm vào (entry point)</strong> mà JVM đi tìm; <code>System.out</code> là luồng xuất chuẩn (một đối tượng); <code>println</code> in một dòng rồi xuống dòng. Dòng đầu <code>// release: 8</code> chỉ là dấu riêng của web này: chương trình còn được biên dịch với <code>--release 8</code> và chạy trên JDK 8 thật.</p>
<p>NetBeans giúp bạn khi gõ: gõ <code>psvm</code> + Tab ra phương thức main, <code>sout</code> + Tab ra <code>System.out.println("")</code>; Alt+Shift+F để định dạng code.</p>
<div class="pitfall">Bẫy gõ phím mang từ C sang: <code>System</code> và <code>String</code> viết hoa chữ đầu; chuỗi dùng ngoặc kép thẳng <code>"…"</code> (ngoặc cong chép từ Word không biên dịch được); câu lệnh nào cũng kết thúc bằng <code>;</code>.</div>`],
      [17, 'Step 4: 4 ways to Compile/Run program in NetBeans',
        `<p class="y-chinh">🎯 Four ways to run: (1) right-click the file in the Projects tab → Run File (Shift+F6); (2) right-click inside the editor → Run File; (3) the green ▶ Run Project button (F6) — the first time it asks "Project FirstPrj does not have a main class set. Select the main class: HelloWorld"; (4) right-click the project → Run.</p>
<table>
<thead><tr><th>Action</th><th>Shortcut</th><th>Runs</th><th>Use it when</th></tr></thead>
<tbody>
<tr><td>Compile File</td><td>F9</td><td>only <code>javac</code> on this file</td><td>you want to check for errors quickly</td></tr>
<tr><td>Run File</td><td>Shift+F6</td><td>the <code>main</code> of <em>this</em> file</td><td>a project with several practice programs</td></tr>
<tr><td>Run Project</td><td>F6</td><td>the project's configured main class</td><td>the real program / the PE project</td></tr>
<tr><td>Clean and Build</td><td>Shift+F11</td><td>deletes build/, compiles everything, builds dist/*.jar</td><td>before submitting (the jar goes in the PE "run" folder)</td></tr>
</tbody>
</table>
<p>The main-class choice of way (3) is saved in the project (Project Properties → Run → Main Class). If F6 runs the "wrong" program, that setting is why.</p>
<div class="pitfall">PE trap: in the exam you run the <strong>given</strong> <code>Main</code> (F6), not your own class. If you press Shift+F6 on your class, nothing happens (it has no <code>main</code>) or you test the wrong thing.</div>`,
        `<p class="y-chinh">🎯 Bốn cách chạy: (1) chuột phải file ở tab Projects → Run File (Shift+F6); (2) chuột phải trong trình soạn → Run File; (3) nút ▶ xanh Run Project (F6) — lần đầu nó hỏi "Project FirstPrj does not have a main class set. Select the main class: HelloWorld" (project chưa đặt lớp main, hãy chọn); (4) chuột phải project → Run.</p>
<table>
<thead><tr><th>Thao tác</th><th>Phím tắt</th><th>Chạy gì</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td>Compile File</td><td>F9</td><td>chỉ <code>javac</code> file này</td><td>muốn kiểm lỗi cho nhanh</td></tr>
<tr><td>Run File</td><td>Shift+F6</td><td><code>main</code> của <em>file này</em></td><td>project có nhiều chương trình luyện tập</td></tr>
<tr><td>Run Project</td><td>F6</td><td>lớp main đã cấu hình của project</td><td>chương trình thật / project PE</td></tr>
<tr><td>Clean and Build</td><td>Shift+F11</td><td>xoá build/, biên dịch tất cả, tạo dist/*.jar</td><td>trước khi nộp (file jar vào thư mục "run" của PE)</td></tr>
</tbody>
</table>
<p>Lựa chọn lớp main ở cách (3) được lưu trong project (Project Properties → Run → Main Class). Nếu F6 chạy "nhầm" chương trình, đó là lý do.</p>
<div class="pitfall">Bẫy PE: trong giờ thi bạn chạy lớp <code>Main</code> <strong>đề cho</strong> (F6), không phải lớp của bạn. Bấm Shift+F6 trên lớp của bạn thì hoặc chẳng có gì xảy ra (nó không có <code>main</code>), hoặc bạn thử sai thứ.</div>`],
      [18, 'Result',
        `<p class="y-chinh">🎯 After Run, NetBeans has created <code>FirstPrj\\build\\classes\\HelloWorld.class</code> on disk, and the Output window shows <code>run:</code>, <code>Hello World!</code> and <code>BUILD SUCCESSFUL (total time: 0 seconds)</code>.</p>
<p>Read the Output window as three parts: <code>run:</code> is the Ant target NetBeans started; the lines in between are <strong>your program's</strong> output (everything printed by <code>System.out</code>); <code>BUILD SUCCESSFUL</code> is Ant reporting that the build and run finished without a compile error — it does <em>not</em> mean your output is correct.</p>
<p>The same <code>.class</code> file is what the JVM ran in lesson 1.B (<code>CAFEBABE</code>, version 52). Slides 19–21 run it again without NetBeans.</p>
<div class="pitfall">Beginner trap: "BUILD SUCCESSFUL" with wrong numbers is still wrong. And <code>BUILD FAILED</code> above a red stack trace often means a <strong>runtime</strong> error (an exception), not a compile error — read the first red line.</div>`,
        `<p class="y-chinh">🎯 Sau khi Run, NetBeans đã tạo <code>FirstPrj\\build\\classes\\HelloWorld.class</code> trên đĩa, và cửa sổ Output hiện <code>run:</code>, <code>Hello World!</code> và <code>BUILD SUCCESSFUL (total time: 0 seconds)</code>.</p>
<p>Đọc cửa sổ Output thành ba phần: <code>run:</code> là target Ant mà NetBeans khởi chạy; các dòng ở giữa là output <strong>của chương trình bạn</strong> (mọi thứ in bằng <code>System.out</code>); <code>BUILD SUCCESSFUL</code> là Ant báo việc build và chạy xong mà không có lỗi biên dịch — nó <em>không</em> có nghĩa output của bạn đúng.</p>
<p>File <code>.class</code> này chính là thứ JVM đã chạy ở bài 1.B (<code>CAFEBABE</code>, phiên bản 52). Slide 19–21 chạy lại nó mà không cần NetBeans.</p>
<div class="pitfall">Bẫy người mới: "BUILD SUCCESSFUL" mà số in ra sai thì vẫn là sai. Và <code>BUILD FAILED</code> nằm dưới một khối chữ đỏ (stack trace) thường là lỗi <strong>lúc chạy</strong> (một ngoại lệ), không phải lỗi biên dịch — đọc dòng đỏ đầu tiên.</div>`],
      [19, 'End users run Java Programs',
        `<p class="y-chinh">🎯 End users do not have NetBeans: they run a program with the Java Runtime Environment's <code>java</code> command — <code>java -cp &lt;folder of the classes&gt; HelloWorld</code> (or the long form <code>-classpath</code>); the slide then asks you to retry with <code>Helloworld</code> and <code>helloworld</code> and comment.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File prj = new File("Demos/FirstPrj");                        // the NetBeans project folder of slide 13
    viet(new File(prj, "src"), "HelloWorld.java", HELLO);
    File classes = new File(prj, "build/classes");
    classes.mkdirs();
    // NetBeans "Build" = javac with -d build/classes
    lenh(prj, "javac", "-d", "build/classes", "src/HelloWorld.java");
    File root = new File(".");
    System.out.println("-- slide 19: from another folder, tell java WHERE the classes are --");
    lenh(root, "java", "-cp", "Demos/FirstPrj/build/classes", "HelloWorld");
    lenh(root, "java", "-classpath", "Demos/FirstPrj/build/classes", "HelloWorld");
    System.out.println("-- slide 19: re-try it using Helloworld, helloworld --");
    lenh(root, "java", "-cp", "Demos/FirstPrj/build/classes", "Helloworld");
    lenh(root, "java", "-cp", "Demos/FirstPrj/build/classes", "helloworld");
    System.out.println("-- slide 20: cd into the classes folder, then no -cp is needed --");
    lenh(classes, "java", "HelloWorld");
    System.out.println("-- and what if we forget -cp outside that folder? --");
    lenh(root, "java", "HelloWorld");
}</code></pre>
<div class="out">&gt; javac -d build/classes src/HelloWorld.java<br>
-- slide 19: from another folder, tell java WHERE the classes are --<br>
&gt; java -cp Demos/FirstPrj/build/classes HelloWorld<br>
Hello World!<br>
&gt; java -classpath Demos/FirstPrj/build/classes HelloWorld<br>
Hello World!<br>
-- slide 19: re-try it using Helloworld, helloworld --<br>
&gt; java -cp Demos/FirstPrj/build/classes Helloworld<br>
Error: Could not find or load main class Helloworld<br>
(exit code 1)<br>
&gt; java -cp Demos/FirstPrj/build/classes helloworld<br>
Error: Could not find or load main class helloworld<br>
(exit code 1)<br>
-- slide 20: cd into the classes folder, then no -cp is needed --<br>
&gt; java HelloWorld<br>
Hello World!<br>
-- and what if we forget -cp outside that folder? --<br>
&gt; java HelloWorld<br>
Error: Could not find or load main class HelloWorld<br>
(exit code 1)</div>
<p>The slide's question, answered from the real run: <code>Helloworld</code> and <code>helloworld</code> both fail with <code>Could not find or load main class</code> — <strong>even on a disk that ignores case</strong> (Windows NTFS, and the folder used here). The file <code>HelloWorld.class</code> is found, but a Java class name is case-sensitive, and the class inside is called <code>HelloWorld</code>. Newer JDKs (11+) add a second line explaining it: <code>Caused by: java.lang.NoClassDefFoundError: HelloWorld (wrong name: Helloworld)</code>.</p>
<p>The last command shows the third rule: outside the classes folder and without <code>-cp</code>, <code>java</code> looks only in the current folder and finds nothing.</p>
<p class="meo">🧠 After <code>java</code> you type a <strong>class name</strong> (case-sensitive, no <code>.class</code>); after <code>javac</code> you type a <strong>file name</strong> (with <code>.java</code>).</p>`,
        `<p class="y-chinh">🎯 Người dùng cuối không có NetBeans: họ chạy chương trình bằng lệnh <code>java</code> của Java Runtime Environment — <code>java -cp &lt;thư mục chứa các lớp&gt; HelloWorld</code> (hoặc dạng dài <code>-classpath</code>); slide còn bảo bạn thử lại với <code>Helloworld</code> và <code>helloworld</code> rồi nhận xét.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File prj = new File("Demos/FirstPrj");                        // thư mục project NetBeans của slide 13
    viet(new File(prj, "src"), "HelloWorld.java", HELLO);
    File classes = new File(prj, "build/classes");
    classes.mkdirs();
    // "Build" của NetBeans = javac với -d build/classes
    lenh(prj, "javac", "-d", "build/classes", "src/HelloWorld.java");
    File root = new File(".");
    System.out.println("-- slide 19: from another folder, tell java WHERE the classes are --");
    lenh(root, "java", "-cp", "Demos/FirstPrj/build/classes", "HelloWorld");
    lenh(root, "java", "-classpath", "Demos/FirstPrj/build/classes", "HelloWorld");
    System.out.println("-- slide 19: re-try it using Helloworld, helloworld --");
    lenh(root, "java", "-cp", "Demos/FirstPrj/build/classes", "Helloworld");
    lenh(root, "java", "-cp", "Demos/FirstPrj/build/classes", "helloworld");
    System.out.println("-- slide 20: cd into the classes folder, then no -cp is needed --");
    lenh(classes, "java", "HelloWorld");
    System.out.println("-- and what if we forget -cp outside that folder? --");
    lenh(root, "java", "HelloWorld");
}</code></pre>
<div class="out">&gt; javac -d build/classes src/HelloWorld.java<br>
-- slide 19: from another folder, tell java WHERE the classes are --<br>
&gt; java -cp Demos/FirstPrj/build/classes HelloWorld<br>
Hello World!<br>
&gt; java -classpath Demos/FirstPrj/build/classes HelloWorld<br>
Hello World!<br>
-- slide 19: re-try it using Helloworld, helloworld --<br>
&gt; java -cp Demos/FirstPrj/build/classes Helloworld<br>
Error: Could not find or load main class Helloworld<br>
(exit code 1)<br>
&gt; java -cp Demos/FirstPrj/build/classes helloworld<br>
Error: Could not find or load main class helloworld<br>
(exit code 1)<br>
-- slide 20: cd into the classes folder, then no -cp is needed --<br>
&gt; java HelloWorld<br>
Hello World!<br>
-- and what if we forget -cp outside that folder? --<br>
&gt; java HelloWorld<br>
Error: Could not find or load main class HelloWorld<br>
(exit code 1)</div>
<p>Câu hỏi của slide, trả lời bằng lần chạy thật: <code>Helloworld</code> và <code>helloworld</code> đều hỏng với <code>Could not find or load main class</code> (không tìm thấy hoặc không nạp được lớp main) — <strong>kể cả trên ổ đĩa không phân biệt hoa thường</strong> (NTFS của Windows, và thư mục dùng ở đây). File <code>HelloWorld.class</code> vẫn được tìm thấy, nhưng tên lớp Java phân biệt hoa thường, mà lớp bên trong tên là <code>HelloWorld</code>. JDK mới (11+) in thêm dòng thứ hai giải thích: <code>Caused by: java.lang.NoClassDefFoundError: HelloWorld (wrong name: Helloworld)</code>.</p>
<p>Lệnh cuối cho thấy luật thứ ba: ở ngoài thư mục classes và không có <code>-cp</code>, <code>java</code> chỉ tìm trong thư mục hiện tại và không thấy gì.</p>
<p class="meo">🧠 Sau <code>java</code> gõ <strong>tên lớp</strong> (phân biệt hoa thường, không có <code>.class</code>); sau <code>javac</code> gõ <strong>tên file</strong> (có <code>.java</code>).</p>`],
      [20, 'End users run Java Programs...',
        `<p class="y-chinh">🎯 If the CLASSPATH variable contains <code>.</code> (the current folder), you can <code>cd</code> into the classes folder and type just <code>java HelloWorld</code>; <code>K:</code> changes the working drive, <code>cd</code> changes the working directory.</p>
<p>That is the line <code>-- slide 20: cd into the classes folder …</code> in the run above: once you stand in <code>build/classes</code>, no <code>-cp</code> is needed, because "the current folder" is where Java looks by default (or, as slide 10 showed, where a CLASSPATH beginning with <code>.</code> tells it to look first).</p>
<table>
<thead><tr><th>Command Prompt command</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>K:</code></td><td>switch to drive K (each drive has its own current folder)</td></tr>
<tr><td><code>cd K:\\GiangDay\\FU\\Java-OOP\\Demos\\FirstPrj\\build\\classes</code></td><td>change the current directory</td></tr>
<tr><td><code>cd ..</code></td><td>go up one folder</td></tr>
<tr><td><code>dir</code></td><td>list the files here (should show HelloWorld.class)</td></tr>
<tr><td><code>java HelloWorld</code></td><td>run the class found in the current folder</td></tr>
</tbody>
</table>
<div class="pitfall">Windows trap: <code>cd D:\\folder</code> while you are on drive C does <strong>not</strong> move you to D — type <code>D:</code> first, or use <code>cd /d D:\\folder</code>.</div>`,
        `<p class="y-chinh">🎯 Nếu biến CLASSPATH có <code>.</code> (thư mục hiện tại), bạn có thể <code>cd</code> vào thư mục classes rồi chỉ gõ <code>java HelloWorld</code>; <code>K:</code> đổi ổ đĩa làm việc, <code>cd</code> đổi thư mục làm việc.</p>
<p>Đó là dòng <code>-- slide 20: cd into the classes folder …</code> trong lần chạy ở trên: khi đã đứng trong <code>build/classes</code> thì không cần <code>-cp</code>, vì "thư mục hiện tại" là nơi Java tìm theo mặc định (hoặc, như slide 10 cho thấy, là nơi một CLASSPATH bắt đầu bằng <code>.</code> bảo nó tìm trước tiên).</p>
<table>
<thead><tr><th>Lệnh Command Prompt</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td><code>K:</code></td><td>chuyển sang ổ K (mỗi ổ có thư mục hiện tại riêng)</td></tr>
<tr><td><code>cd K:\\GiangDay\\FU\\Java-OOP\\Demos\\FirstPrj\\build\\classes</code></td><td>đổi thư mục hiện tại</td></tr>
<tr><td><code>cd ..</code></td><td>lùi lên một thư mục</td></tr>
<tr><td><code>dir</code></td><td>liệt kê file ở đây (phải thấy HelloWorld.class)</td></tr>
<tr><td><code>java HelloWorld</code></td><td>chạy lớp tìm thấy trong thư mục hiện tại</td></tr>
</tbody>
</table>
<div class="pitfall">Bẫy Windows: gõ <code>cd D:\\folder</code> khi đang ở ổ C <strong>không</strong> đưa bạn sang ổ D — gõ <code>D:</code> trước, hoặc dùng <code>cd /d D:\\folder</code>.</div>`],
      [21, 'End users run Java Programs...',
        `<p class="y-chinh">🎯 A developer should give end users an easier way to run the program: a <strong>BAT file</strong> — a text file saved as <code>HelloWorld.bat</code> next to the class, containing <code>java HelloWorld</code> and <code>Pause</code>; double-click it and the console window stays open with "Press any key to continue . . .".</p>
<pre><code class="language-bat">java HelloWorld
Pause</code></pre>
<p>The slide saves it with Notepad ("Save as type: All Files", so it does not become <code>HelloWorld.bat.txt</code>). <code>Pause</code> is there because a double-clicked console window closes the moment the program ends — too fast to read the output.</p>
<p>➕ Today the usual way to hand over a Java program is a <strong>jar file</strong>: NetBeans "Clean and Build" makes <code>dist/FirstPrj.jar</code>, and the user runs <code>java -jar FirstPrj.jar</code> — one file instead of a folder of classes. That jar is also what the PE wants in its "run" folder; the ⭐ lesson "First hands-on session" builds one by hand, for real.</p>
<pre><code class="language-bat">@echo off
java -jar "%~dp0FirstPrj.jar"
pause</code></pre>
<p class="meo">🧠 <code>%~dp0</code> = "the folder this .bat file is in" — so the shortcut works wherever the user copies the folder.</p>`,
        `<p class="y-chinh">🎯 Lập trình viên nên cho người dùng cuối một cách chạy dễ hơn: một <strong>file BAT</strong> — file chữ lưu thành <code>HelloWorld.bat</code> cạnh file lớp, chứa <code>java HelloWorld</code> và <code>Pause</code>; bấm đúp là chạy và cửa sổ console đứng lại với "Press any key to continue . . .".</p>
<pre><code class="language-bat">java HelloWorld
Pause</code></pre>
<p>Slide lưu nó bằng Notepad ("Save as type: All Files", để nó không thành <code>HelloWorld.bat.txt</code>). Có <code>Pause</code> vì cửa sổ console mở bằng bấm đúp sẽ đóng ngay khi chương trình kết thúc — quá nhanh để đọc output.</p>
<p>➕ Ngày nay cách thường dùng để giao một chương trình Java là <strong>file jar</strong>: "Clean and Build" của NetBeans tạo <code>dist/FirstPrj.jar</code>, người dùng chạy <code>java -jar FirstPrj.jar</code> — một file thay vì cả thư mục lớp. File jar đó cũng là thứ đề PE đòi trong thư mục "run"; bài ⭐ "Buổi thực hành đầu tiên" đóng một file jar bằng tay, chạy thật.</p>
<pre><code class="language-bat">@echo off
java -jar "%~dp0FirstPrj.jar"
pause</code></pre>
<p class="meo">🧠 <code>%~dp0</code> = "thư mục chứa chính file .bat này" — nên lối tắt chạy được dù người dùng chép thư mục đi đâu.</p>`],
      [22, 'Explain JDK and its tools',
        `<p class="y-chinh">🎯 Two JDK tools: <code>javac [option] source</code> — the Java compiler, <em>source</em> is one or more file names ending in <code>.java</code>; and <code>java [option] classname [arguments]</code> — the Java launcher ("interpreter"), <em>classname</em> is the name of the class to run.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/16b953b20bc66982606536a014d270ccf96b889e.svg" alt="Slide 22 widened: the JDK contains the tools plus a runtime; the runtime contains the launcher, the API and the JVM" loading="lazy" /><p class="chu-thich">🧩 Slide 22 widened: the JDK contains the tools plus a runtime; the runtime contains the launcher, the API and the JVM</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 22 widened — JDK ⊃ JRE ⊃ JVM (and where javac and java live)
' Developers install the JDK; before Java 11 end users could install only a JRE
rectangle "JDK — Java Development Kit (for developers)" as JDK {
  rectangle "development tools\\njavac · jar · javap · javadoc · jdb" as TOOLS #FFFFFF
  rectangle "JRE — Java Runtime Environment (to run programs)" as JRE {
    rectangle "java launcher (java.exe)" as LAUNCH #FFFFFF
    rectangle "Java API class library\\n(rt.jar in JDK 8; modules since JDK 9)" as LIB #ECFDF5
    rectangle "JVM" as JVM #F0F9FF
  }
}
TOOLS -[hidden]down- JRE
@enduml</code></pre></details>
<p>The slide's picture (Employee.java → <code>javac Employee.java</code> → Employee.class → <code>java Employee</code> → Output) has a hidden bug: the slide's <code>Employee</code> class has <strong>no <code>main</code></strong>. It compiles, but it cannot be started. Real run on JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Employee.java",                                     // typed from the slide's Notepad window
        "class Employee {\\n" +
        "    int empId;\\n" +
        "    String empName;\\n" +
        "    String address;\\n" +
        "    void login() {\\n" +
        "        System.out.println(\\"Employee\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Employee.java");                           // compiles fine: a class without main is legal
    lenh(d, "java", "Employee");                                 // but it cannot be STARTED
    System.out.println("== add an entry point, compile again ==");
    viet(d, "Employee.java",
        "class Employee {\\n" +
        "    int empId;\\n" +
        "    String empName;\\n" +
        "    String address;\\n" +
        "    void login() {\\n" +
        "        System.out.println(\\"Employee\\");\\n" +
        "    }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        new Employee().login();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Employee.java");
    lenh(d, "java", "Employee");
}</code></pre>
<div class="out">&gt; javac Employee.java<br>
&gt; java Employee<br>
Error: Main method not found in class Employee, please define the main method as:<br>
&nbsp;&nbsp;&nbsp;public static void main(String[] args)<br>
or a JavaFX application class must extend javafx.application.Application<br>
(exit code 1)<br>
== add an entry point, compile again ==<br>
&gt; javac Employee.java<br>
&gt; java Employee<br>
Employee</div>
<table>
<thead><tr><th>Tool</th><th>Typical use</th><th>Seen in</th></tr></thead>
<tbody>
<tr><td><code>javac</code></td><td><code>javac -d build/classes src/*.java</code></td><td>lessons 1.B, 1.C</td></tr>
<tr><td><code>java</code></td><td><code>java -cp build/classes HelloWorld</code> · <code>java -jar app.jar</code></td><td>slides 19–21</td></tr>
<tr><td><code>javap</code></td><td><code>javap -c HelloWorld</code> — show the bytecode</td><td>slide 7</td></tr>
<tr><td><code>jar</code></td><td><code>jar cfe app.jar Main -C build/classes .</code> — pack classes</td><td>⭐ First hands-on session</td></tr>
<tr><td><code>javadoc</code></td><td>build HTML docs from <code>/** … */</code> comments</td><td>slide 23</td></tr>
</tbody>
</table>
<p>➕ Since Java 11 Oracle no longer ships a separate JRE; you install the JDK, and applications that need a small runtime build one with <code>jlink</code>. JDK 8 still comes with a <code>jre</code> folder inside.</p>`,
        `<p class="y-chinh">🎯 Hai công cụ của JDK: <code>javac [option] source</code> — trình biên dịch Java, <em>source</em> là một hay nhiều tên file đuôi <code>.java</code>; và <code>java [option] classname [arguments]</code> — trình khởi chạy Java ("trình thông dịch"), <em>classname</em> là tên lớp cần chạy.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/16b953b20bc66982606536a014d270ccf96b889e.svg" alt="Slide 22 mở rộng: JDK chứa công cụ cộng một bộ chạy; bộ chạy chứa trình khởi chạy, API và JVM" loading="lazy" /><p class="chu-thich">🧩 Slide 22 mở rộng: JDK chứa công cụ cộng một bộ chạy; bộ chạy chứa trình khởi chạy, API và JVM</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 22 widened — JDK ⊃ JRE ⊃ JVM (and where javac and java live)
' Lập trình viên cài JDK; trước Java 11 người dùng cuối có thể chỉ cài JRE
rectangle "JDK — Java Development Kit (for developers)" as JDK {
  rectangle "development tools\\njavac · jar · javap · javadoc · jdb" as TOOLS #FFFFFF
  rectangle "JRE — Java Runtime Environment (to run programs)" as JRE {
    rectangle "java launcher (java.exe)" as LAUNCH #FFFFFF
    rectangle "Java API class library\\n(rt.jar in JDK 8; modules since JDK 9)" as LIB #ECFDF5
    rectangle "JVM" as JVM #F0F9FF
  }
}
TOOLS -[hidden]down- JRE
@enduml</code></pre></details>
<p>Hình trên slide (Employee.java → <code>javac Employee.java</code> → Employee.class → <code>java Employee</code> → Output) giấu một lỗi: lớp <code>Employee</code> trên slide <strong>không có <code>main</code></strong>. Nó biên dịch được, nhưng không khởi động được. Chạy thật trên JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Employee.java",                                     // gõ lại từ cửa sổ Notepad trên slide
        "class Employee {\\n" +
        "    int empId;\\n" +
        "    String empName;\\n" +
        "    String address;\\n" +
        "    void login() {\\n" +
        "        System.out.println(\\"Employee\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Employee.java");                           // biên dịch êm: lớp không có main là hợp lệ
    lenh(d, "java", "Employee");                                 // nhưng không KHỞI ĐỘNG được
    System.out.println("== add an entry point, compile again ==");
    viet(d, "Employee.java",
        "class Employee {\\n" +
        "    int empId;\\n" +
        "    String empName;\\n" +
        "    String address;\\n" +
        "    void login() {\\n" +
        "        System.out.println(\\"Employee\\");\\n" +
        "    }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        new Employee().login();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Employee.java");
    lenh(d, "java", "Employee");
}</code></pre>
<div class="out">&gt; javac Employee.java<br>
&gt; java Employee<br>
Error: Main method not found in class Employee, please define the main method as:<br>
&nbsp;&nbsp;&nbsp;public static void main(String[] args)<br>
or a JavaFX application class must extend javafx.application.Application<br>
(exit code 1)<br>
== add an entry point, compile again ==<br>
&gt; javac Employee.java<br>
&gt; java Employee<br>
Employee</div>
<table>
<thead><tr><th>Công cụ</th><th>Cách dùng điển hình</th><th>Đã gặp ở</th></tr></thead>
<tbody>
<tr><td><code>javac</code></td><td><code>javac -d build/classes src/*.java</code></td><td>bài 1.B, 1.C</td></tr>
<tr><td><code>java</code></td><td><code>java -cp build/classes HelloWorld</code> · <code>java -jar app.jar</code></td><td>slide 19–21</td></tr>
<tr><td><code>javap</code></td><td><code>javap -c HelloWorld</code> — xem bytecode</td><td>slide 7</td></tr>
<tr><td><code>jar</code></td><td><code>jar cfe app.jar Main -C build/classes .</code> — đóng gói các lớp</td><td>⭐ Buổi thực hành đầu tiên</td></tr>
<tr><td><code>javadoc</code></td><td>sinh tài liệu HTML từ chú thích <code>/** … */</code></td><td>slide 23</td></tr>
</tbody>
</table>
<p>➕ Từ Java 11 Oracle không còn phát hành JRE riêng; bạn cài JDK, còn ứng dụng nào cần bộ chạy gọn thì tự dựng bằng <code>jlink</code>. JDK 8 vẫn có thư mục <code>jre</code> nằm bên trong.</p>`],
      [23, 'A Closer Look at the Hello World Application',
        `<p class="y-chinh">🎯 Three parts of Hello World: <strong>comments</strong> (<code>/* … */</code> traditional, <code>// …</code> to end of line), the <strong>class declaration</strong> <code>public class ClassName { … }</code>, and the <strong>main method</strong> <code>public static void main(String[] args)</code> — the entry point; <code>public</code> and <code>static</code> may be written in either order, and <code>main</code> receives one argument, an array of <code>String</code>.</p>
<table>
<thead><tr><th>Piece</th><th>Why it is there</th></tr></thead>
<tbody>
<tr><td><code>public</code></td><td>the JVM, which is outside your class, must be allowed to call <code>main</code></td></tr>
<tr><td><code>static</code></td><td>the JVM calls <code>main</code> before any object exists — so it must belong to the class, not to an object</td></tr>
<tr><td><code>void</code></td><td><code>main</code> returns nothing to the JVM (to return an exit code use <code>System.exit(n)</code>)</td></tr>
<tr><td><code>main</code></td><td>the exact name the launcher looks for</td></tr>
<tr><td><code>String[] args</code></td><td>the words typed after the class name on the command line</td></tr>
</tbody>
</table>
<p>The slide promises "a demonstration for passing strings to <code>main</code> in the next session" — here it is now, real on JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Greet.java",
        "public class Greet {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        System.out.println(\\"args.length = \\" + args.length);\\n" +
        "        for (int i = 0; i &lt; args.length; i++)\\n" +
        "            System.out.println(\\"args[\\" + i + \\"] = \\" + args[i]);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Greet.java");
    lenh(d, "java", "Greet");
    lenh(d, "java", "Greet", "An", "Binh", "42");
    lenh(d, "java", "Greet", "Nguyen Van An");                   // ONE argument containing spaces (the console's quotes are already removed)
}</code></pre>
<div class="out">&gt; javac Greet.java<br>
&gt; java Greet<br>
args.length = 0<br>
&gt; java Greet An Binh 42<br>
args.length = 3<br>
args[0] = An<br>
args[1] = Binh<br>
args[2] = 42<br>
&gt; java Greet Nguyen Van An<br>
args.length = 1<br>
args[0] = Nguyen Van An</div>
<p>➕ A third comment form, <code>/** … */</code>, is a <strong>Javadoc</strong> comment: tools turn it into HTML documentation, and NetBeans shows it when you hover over a method. The slide's example line has a typo — <code>public class HelloWord</code> (missing "l") — which would only compile in a file named <code>HelloWord.java</code>.</p>
<div class="pitfall">In NetBeans you pass <code>args</code> through Project Properties → Run → Arguments; pressing F6 with nothing there gives <code>args.length = 0</code>, as in the first run above.</div>`,
        `<p class="y-chinh">🎯 Ba phần của Hello World: <strong>chú thích</strong> (<code>/* … */</code> kiểu truyền thống, <code>// …</code> tới hết dòng), <strong>khai báo lớp</strong> <code>public class ClassName { … }</code>, và <strong>phương thức main</strong> <code>public static void main(String[] args)</code> — điểm vào chương trình; <code>public</code> và <code>static</code> viết theo thứ tự nào cũng được, và <code>main</code> nhận một đối số là mảng <code>String</code>.</p>
<table>
<thead><tr><th>Thành phần</th><th>Vì sao có mặt</th></tr></thead>
<tbody>
<tr><td><code>public</code></td><td>JVM nằm ngoài lớp của bạn, phải được phép gọi <code>main</code></td></tr>
<tr><td><code>static</code></td><td>JVM gọi <code>main</code> trước khi có đối tượng nào — nên nó phải thuộc về lớp, không thuộc về đối tượng</td></tr>
<tr><td><code>void</code></td><td><code>main</code> không trả gì cho JVM (muốn trả mã thoát thì dùng <code>System.exit(n)</code>)</td></tr>
<tr><td><code>main</code></td><td>đúng cái tên mà trình khởi chạy đi tìm</td></tr>
<tr><td><code>String[] args</code></td><td>các từ gõ sau tên lớp trên dòng lệnh</td></tr>
</tbody>
</table>
<p>Slide hứa "buổi sau sẽ demo truyền chuỗi vào <code>main</code>" — đây, làm luôn, chạy thật trên JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Greet.java",
        "public class Greet {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        System.out.println(\\"args.length = \\" + args.length);\\n" +
        "        for (int i = 0; i &lt; args.length; i++)\\n" +
        "            System.out.println(\\"args[\\" + i + \\"] = \\" + args[i]);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Greet.java");
    lenh(d, "java", "Greet");
    lenh(d, "java", "Greet", "An", "Binh", "42");
    lenh(d, "java", "Greet", "Nguyen Van An");                   // MỘT đối số có dấu cách (dấu nháy của console đã được bỏ)
}</code></pre>
<div class="out">&gt; javac Greet.java<br>
&gt; java Greet<br>
args.length = 0<br>
&gt; java Greet An Binh 42<br>
args.length = 3<br>
args[0] = An<br>
args[1] = Binh<br>
args[2] = 42<br>
&gt; java Greet Nguyen Van An<br>
args.length = 1<br>
args[0] = Nguyen Van An</div>
<p>➕ Kiểu chú thích thứ ba, <code>/** … */</code>, là chú thích <strong>Javadoc</strong>: công cụ biến nó thành tài liệu HTML, và NetBeans hiện nó khi bạn rê chuột lên phương thức. Dòng ví dụ trên slide có lỗi gõ — <code>public class HelloWord</code> (thiếu chữ "l") — chỉ biên dịch được nếu file tên là <code>HelloWord.java</code>.</p>
<div class="pitfall">Trong NetBeans bạn truyền <code>args</code> qua Project Properties → Run → Arguments; bấm F6 khi ô đó trống thì <code>args.length = 0</code>, như lần chạy đầu ở trên.</div>`],
      [24, 'Common Problems and Their Solutions',
        `<p class="y-chinh">🎯 Compiler problems: <code>'javac' is not recognized…</code> (fix the PATH), <strong>syntax errors</strong> and <strong>semantic errors</strong>; runtime problems: <code>NoClassDefFoundError</code> / <code>Could not find or load main class HelloWorld.class</code> — the class name is incorrect.</p>
<p><code>'javac' is not recognized as an internal or external command, operable program or batch file</code> is printed by Windows, not by Java: the JDK's <code>bin</code> is not on the PATH (slide 10). A classic cause: the Oracle JDK 8 installer puts only <code>java</code> (not <code>javac</code>) into a shortcut folder on the PATH, so <code>java -version</code> works while <code>javac</code> does not. The other problems, produced for real on JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== syntax error: a missing semicolon ==");
    viet(d, "HelloWorld.java",
        "public class HelloWorld {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        System.out.println(\\"Hello World!\\")\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "HelloWorld.java");
    System.out.println("== semantic error: the grammar is fine, the meaning is not ==");
    viet(d, "HelloWorld.java",
        "public class HelloWorld {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int count = \\"Hello World!\\";\\n" +
        "        System.out.println(count);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "HelloWorld.java");
    System.out.println("== case matters inside the code: system.out ==");
    viet(d, "HelloWorld.java",
        "public class HelloWorld {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        system.out.println(\\"Hello World!\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "HelloWorld.java");
    System.out.println("== runtime: the .class name typed after java ==");
    viet(d, "HelloWorld.java",
        "public class HelloWorld {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        System.out.println(\\"Hello World!\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "HelloWorld.java");
    lenh(d, "java", "HelloWorld.class");
    lenh(d, "java", "HelloWorld.java");
    lenh(d, "java", "Hello");
    lenh(d, "java", "HelloWorld");
}</code></pre>
<div class="out">== syntax error: a missing semicolon ==<br>
&gt; javac HelloWorld.java<br>
HelloWorld.java:3: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println("Hello World!")<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== semantic error: the grammar is fine, the meaning is not ==<br>
&gt; javac HelloWorld.java<br>
HelloWorld.java:3: error: incompatible types: String cannot be converted to int<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int count = "Hello World!";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== case matters inside the code: system.out ==<br>
&gt; javac HelloWorld.java<br>
HelloWorld.java:3: error: package system does not exist<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;system.out.println("Hello World!");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== runtime: the .class name typed after java ==<br>
&gt; javac HelloWorld.java<br>
&gt; java HelloWorld.class<br>
Error: Could not find or load main class HelloWorld.class<br>
(exit code 1)<br>
&gt; java HelloWorld.java<br>
Error: Could not find or load main class HelloWorld.java<br>
(exit code 1)<br>
&gt; java Hello<br>
Error: Could not find or load main class Hello<br>
(exit code 1)<br>
&gt; java HelloWorld<br>
Hello World!</div>
<table>
<thead><tr><th>Message</th><th>Kind</th><th>What it really means</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>';' expected</code></td><td>syntax error (grammar)</td><td>the line above the caret ends without <code>;</code> — javac points at where it noticed</td><td>add the <code>;</code></td></tr>
<tr><td><code>incompatible types: String cannot be converted to int</code></td><td>semantic error (meaning)</td><td>grammar fine, types do not fit</td><td>fix the type or convert (<code>Integer.parseInt</code>)</td></tr>
<tr><td><code>package system does not exist</code></td><td>semantic error</td><td><code>system</code> (lower case) is read as a package name</td><td><code>System</code></td></tr>
<tr><td><code>Could not find or load main class HelloWorld.class</code></td><td>runtime</td><td>you typed a file name after <code>java</code></td><td><code>java HelloWorld</code></td></tr>
</tbody>
</table>
<p>The slide's <code>Exception in thread "main" java.lang.NoClassDefFoundError</code> is how JDK 6 (the deck's JDK) reported a wrong class name; JDK 7 and 8 print the shorter <code>Error: Could not find or load main class …</code> seen above.</p>
<p class="meo">🧠 Fix compiler errors <strong>from the first one down</strong> — one missing brace can produce twenty errors after it.</p>`,
        `<p class="y-chinh">🎯 Lỗi lúc biên dịch: <code>'javac' is not recognized…</code> (sửa PATH), <strong>lỗi cú pháp (syntax error)</strong> và <strong>lỗi ngữ nghĩa (semantic error)</strong>; lỗi lúc chạy: <code>NoClassDefFoundError</code> / <code>Could not find or load main class HelloWorld.class</code> — tên lớp gõ sai.</p>
<p><code>'javac' is not recognized as an internal or external command, operable program or batch file</code> là do Windows in, không phải Java: thư mục <code>bin</code> của JDK chưa có trong PATH (slide 10). Một nguyên nhân kinh điển: bộ cài Oracle JDK 8 chỉ đặt <code>java</code> (không có <code>javac</code>) vào một thư mục lối tắt trong PATH, nên <code>java -version</code> chạy mà <code>javac</code> thì không. Các lỗi còn lại, tạo ra thật trên JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== syntax error: a missing semicolon ==");
    viet(d, "HelloWorld.java",
        "public class HelloWorld {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        System.out.println(\\"Hello World!\\")\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "HelloWorld.java");
    System.out.println("== semantic error: the grammar is fine, the meaning is not ==");
    viet(d, "HelloWorld.java",
        "public class HelloWorld {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int count = \\"Hello World!\\";\\n" +
        "        System.out.println(count);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "HelloWorld.java");
    System.out.println("== case matters inside the code: system.out ==");
    viet(d, "HelloWorld.java",
        "public class HelloWorld {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        system.out.println(\\"Hello World!\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "HelloWorld.java");
    System.out.println("== runtime: the .class name typed after java ==");
    viet(d, "HelloWorld.java",
        "public class HelloWorld {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        System.out.println(\\"Hello World!\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "HelloWorld.java");
    lenh(d, "java", "HelloWorld.class");
    lenh(d, "java", "HelloWorld.java");
    lenh(d, "java", "Hello");
    lenh(d, "java", "HelloWorld");
}</code></pre>
<div class="out">== syntax error: a missing semicolon ==<br>
&gt; javac HelloWorld.java<br>
HelloWorld.java:3: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println("Hello World!")<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== semantic error: the grammar is fine, the meaning is not ==<br>
&gt; javac HelloWorld.java<br>
HelloWorld.java:3: error: incompatible types: String cannot be converted to int<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int count = "Hello World!";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== case matters inside the code: system.out ==<br>
&gt; javac HelloWorld.java<br>
HelloWorld.java:3: error: package system does not exist<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;system.out.println("Hello World!");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== runtime: the .class name typed after java ==<br>
&gt; javac HelloWorld.java<br>
&gt; java HelloWorld.class<br>
Error: Could not find or load main class HelloWorld.class<br>
(exit code 1)<br>
&gt; java HelloWorld.java<br>
Error: Could not find or load main class HelloWorld.java<br>
(exit code 1)<br>
&gt; java Hello<br>
Error: Could not find or load main class Hello<br>
(exit code 1)<br>
&gt; java HelloWorld<br>
Hello World!</div>
<table>
<thead><tr><th>Thông báo</th><th>Loại</th><th>Thật ra nghĩa là</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td><code>';' expected</code></td><td>lỗi cú pháp (ngữ pháp)</td><td>dòng phía trên dấu mũ thiếu <code>;</code> — javac chỉ vào chỗ nó phát hiện</td><td>thêm <code>;</code></td></tr>
<tr><td><code>incompatible types: String cannot be converted to int</code></td><td>lỗi ngữ nghĩa (ý nghĩa)</td><td>ngữ pháp đúng, kiểu không khớp</td><td>sửa kiểu hoặc chuyển đổi (<code>Integer.parseInt</code>)</td></tr>
<tr><td><code>package system does not exist</code></td><td>lỗi ngữ nghĩa</td><td><code>system</code> (chữ thường) bị hiểu là tên package</td><td><code>System</code></td></tr>
<tr><td><code>Could not find or load main class HelloWorld.class</code></td><td>lúc chạy</td><td>bạn gõ tên file sau <code>java</code></td><td><code>java HelloWorld</code></td></tr>
</tbody>
</table>
<p>Dòng <code>Exception in thread "main" java.lang.NoClassDefFoundError</code> trên slide là cách JDK 6 (JDK của bộ slide) báo tên lớp sai; JDK 7 và 8 in câu ngắn hơn <code>Error: Could not find or load main class …</code> như thấy ở trên.</p>
<p class="meo">🧠 Sửa lỗi biên dịch <strong>từ lỗi đầu tiên trở xuống</strong> — thiếu một dấu ngoặc nhọn có thể sinh ra hai mươi lỗi phía sau.</p>`],
      [25, 'Try and Explore',
        `<p class="y-chinh">🎯 Five edits to try — if there is no error, run it: rename the public class to <code>HelloWorld2</code>; make it a non-public <code>class HelloWorld2</code>; write <code>String args[]</code>; drop <code>static</code>; drop <code>public static</code>. Here are all five (plus a sixth from slide 23), compiled and run for real on JDK 8, always in a file called <code>HelloWorld.java</code>:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    thu(1, "public class HelloWorld2", "public static void main(String[] args)", "HelloWorld2");
    thu(2, "class HelloWorld2", "public static void main(String[] args)", "HelloWorld2");
    thu(3, "public class HelloWorld", "public static void main(String args[])", "HelloWorld");
    thu(4, "public class HelloWorld", "public void main(String[] args)", "HelloWorld");
    thu(5, "public class HelloWorld", "void main(String[] args)", "HelloWorld");
    thu(6, "public class HelloWorld", "static public void main(String[] args)", "HelloWorld");
}

// Save the variant in HelloWorld.java (the file name never changes), compile it, and if it compiled, run it
static void thu(int n, String classLine, String mainLine, String runName) throws Exception {
    File d = new File("try" + n);
    System.out.println("=== edit " + n + ":  " + classLine + " { " + mainLine + " { ... } }");
    viet(d, "HelloWorld.java",
        classLine + " {\\n" +
        "    " + mainLine + " {\\n" +
        "        System.out.println(\\"Hello World!\\");\\n" +
        "    }\\n" +
        "}\\n");
    if (lenhOk(d, "javac", "HelloWorld.java")) {
        System.out.println("files: " + Arrays.toString(sapXep(d.list())));
        lenh(d, "java", runName);
    }
}</code></pre>
<div class="out">=== edit 1: &nbsp;public class HelloWorld2 { public static void main(String[] args) { ... } }<br>
&gt; javac HelloWorld.java<br>
HelloWorld.java:1: error: class HelloWorld2 is public, should be declared in a file named HelloWorld2.java<br>
public class HelloWorld2 {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
=== edit 2: &nbsp;class HelloWorld2 { public static void main(String[] args) { ... } }<br>
&gt; javac HelloWorld.java<br>
files: [HelloWorld.java, HelloWorld2.class]<br>
&gt; java HelloWorld2<br>
Hello World!<br>
=== edit 3: &nbsp;public class HelloWorld { public static void main(String args[]) { ... } }<br>
&gt; javac HelloWorld.java<br>
files: [HelloWorld.class, HelloWorld.java]<br>
&gt; java HelloWorld<br>
Hello World!<br>
=== edit 4: &nbsp;public class HelloWorld { public void main(String[] args) { ... } }<br>
&gt; javac HelloWorld.java<br>
files: [HelloWorld.class, HelloWorld.java]<br>
&gt; java HelloWorld<br>
Error: Main method is not static in class HelloWorld, please define the main method as:<br>
&nbsp;&nbsp;&nbsp;public static void main(String[] args)<br>
(exit code 1)<br>
=== edit 5: &nbsp;public class HelloWorld { void main(String[] args) { ... } }<br>
&gt; javac HelloWorld.java<br>
files: [HelloWorld.class, HelloWorld.java]<br>
&gt; java HelloWorld<br>
Error: Main method not found in class HelloWorld, please define the main method as:<br>
&nbsp;&nbsp;&nbsp;public static void main(String[] args)<br>
or a JavaFX application class must extend javafx.application.Application<br>
(exit code 1)<br>
=== edit 6: &nbsp;public class HelloWorld { static public void main(String[] args) { ... } }<br>
&gt; javac HelloWorld.java<br>
files: [HelloWorld.class, HelloWorld.java]<br>
&gt; java HelloWorld<br>
Hello World!</div>
<table>
<thead><tr><th>Edit</th><th>Compiles?</th><th>Runs?</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>1 <code>public class HelloWorld2</code></td><td>❌ public class must be in <code>HelloWorld2.java</code></td><td>—</td><td>file name = public class name</td></tr>
<tr><td>2 <code>class HelloWorld2</code></td><td>✅ produces <code>HelloWorld2.class</code></td><td>✅ as <code>java HelloWorld2</code></td><td>a non-public class may sit in any file; the .class is named after the class</td></tr>
<tr><td>3 <code>String args[]</code></td><td>✅</td><td>✅</td><td>C-style array syntax is legal (the Java style <code>String[] args</code> is preferred)</td></tr>
<tr><td>4 <code>public void main</code></td><td>✅</td><td>❌ "Main method is not static"</td><td><code>main</code> must be <code>static</code></td></tr>
<tr><td>5 <code>void main</code></td><td>✅</td><td>❌ "Main method not found"</td><td><code>main</code> must be <code>public static</code></td></tr>
<tr><td>6 <code>static public void main</code></td><td>✅</td><td>✅</td><td>modifier order does not matter (slide 23)</td></tr>
</tbody>
</table>
<p>➕ <strong>Java 25 changed edits 4 and 5.</strong> JEP 512 (final in JDK 25, September 2025) allows "instance main methods": <code>void main()</code> without <code>public</code>, <code>static</code> or <code>String[]</code> is accepted as an entry point. On the exam's JDK 8 — and on JDK 21 — the rows above still hold. Answer FE questions with the classic rules.</p>`,
        `<p class="y-chinh">🎯 Năm chỗ sửa để thử — không lỗi thì chạy: đổi lớp public thành <code>HelloWorld2</code>; thành lớp không public <code>class HelloWorld2</code>; viết <code>String args[]</code>; bỏ <code>static</code>; bỏ <code>public static</code>. Đây là cả năm (cộng chỗ thứ sáu lấy từ slide 23), biên dịch và chạy thật trên JDK 8, lần nào cũng trong file tên <code>HelloWorld.java</code>:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    thu(1, "public class HelloWorld2", "public static void main(String[] args)", "HelloWorld2");
    thu(2, "class HelloWorld2", "public static void main(String[] args)", "HelloWorld2");
    thu(3, "public class HelloWorld", "public static void main(String args[])", "HelloWorld");
    thu(4, "public class HelloWorld", "public void main(String[] args)", "HelloWorld");
    thu(5, "public class HelloWorld", "void main(String[] args)", "HelloWorld");
    thu(6, "public class HelloWorld", "static public void main(String[] args)", "HelloWorld");
}

// Lưu biến thể vào HelloWorld.java (tên file không đổi), biên dịch, nếu được thì chạy
static void thu(int n, String classLine, String mainLine, String runName) throws Exception {
    File d = new File("try" + n);
    System.out.println("=== edit " + n + ":  " + classLine + " { " + mainLine + " { ... } }");
    viet(d, "HelloWorld.java",
        classLine + " {\\n" +
        "    " + mainLine + " {\\n" +
        "        System.out.println(\\"Hello World!\\");\\n" +
        "    }\\n" +
        "}\\n");
    if (lenhOk(d, "javac", "HelloWorld.java")) {
        System.out.println("files: " + Arrays.toString(sapXep(d.list())));
        lenh(d, "java", runName);
    }
}</code></pre>
<div class="out">=== edit 1: &nbsp;public class HelloWorld2 { public static void main(String[] args) { ... } }<br>
&gt; javac HelloWorld.java<br>
HelloWorld.java:1: error: class HelloWorld2 is public, should be declared in a file named HelloWorld2.java<br>
public class HelloWorld2 {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
=== edit 2: &nbsp;class HelloWorld2 { public static void main(String[] args) { ... } }<br>
&gt; javac HelloWorld.java<br>
files: [HelloWorld.java, HelloWorld2.class]<br>
&gt; java HelloWorld2<br>
Hello World!<br>
=== edit 3: &nbsp;public class HelloWorld { public static void main(String args[]) { ... } }<br>
&gt; javac HelloWorld.java<br>
files: [HelloWorld.class, HelloWorld.java]<br>
&gt; java HelloWorld<br>
Hello World!<br>
=== edit 4: &nbsp;public class HelloWorld { public void main(String[] args) { ... } }<br>
&gt; javac HelloWorld.java<br>
files: [HelloWorld.class, HelloWorld.java]<br>
&gt; java HelloWorld<br>
Error: Main method is not static in class HelloWorld, please define the main method as:<br>
&nbsp;&nbsp;&nbsp;public static void main(String[] args)<br>
(exit code 1)<br>
=== edit 5: &nbsp;public class HelloWorld { void main(String[] args) { ... } }<br>
&gt; javac HelloWorld.java<br>
files: [HelloWorld.class, HelloWorld.java]<br>
&gt; java HelloWorld<br>
Error: Main method not found in class HelloWorld, please define the main method as:<br>
&nbsp;&nbsp;&nbsp;public static void main(String[] args)<br>
or a JavaFX application class must extend javafx.application.Application<br>
(exit code 1)<br>
=== edit 6: &nbsp;public class HelloWorld { static public void main(String[] args) { ... } }<br>
&gt; javac HelloWorld.java<br>
files: [HelloWorld.class, HelloWorld.java]<br>
&gt; java HelloWorld<br>
Hello World!</div>
<table>
<thead><tr><th>Chỗ sửa</th><th>Biên dịch?</th><th>Chạy?</th><th>Bài học</th></tr></thead>
<tbody>
<tr><td>1 <code>public class HelloWorld2</code></td><td>❌ lớp public phải nằm trong <code>HelloWorld2.java</code></td><td>—</td><td>tên file = tên lớp public</td></tr>
<tr><td>2 <code>class HelloWorld2</code></td><td>✅ sinh ra <code>HelloWorld2.class</code></td><td>✅ bằng <code>java HelloWorld2</code></td><td>lớp không public nằm trong file nào cũng được; file .class mang tên lớp</td></tr>
<tr><td>3 <code>String args[]</code></td><td>✅</td><td>✅</td><td>cú pháp mảng kiểu C hợp lệ (nên dùng kiểu Java <code>String[] args</code>)</td></tr>
<tr><td>4 <code>public void main</code></td><td>✅</td><td>❌ "Main method is not static"</td><td><code>main</code> phải là <code>static</code></td></tr>
<tr><td>5 <code>void main</code></td><td>✅</td><td>❌ "Main method not found"</td><td><code>main</code> phải là <code>public static</code></td></tr>
<tr><td>6 <code>static public void main</code></td><td>✅</td><td>✅</td><td>thứ tự modifier không quan trọng (slide 23)</td></tr>
</tbody>
</table>
<p>➕ <strong>Java 25 đã đổi kết quả của chỗ sửa 4 và 5.</strong> JEP 512 (chính thức ở JDK 25, tháng 9/2025) cho phép "phương thức main của đối tượng (instance main method)": <code>void main()</code> không cần <code>public</code>, <code>static</code> hay <code>String[]</code> vẫn được nhận làm điểm vào. Trên JDK 8 của phòng thi — và trên JDK 21 — bảng trên vẫn đúng. Trả lời câu FE theo luật cổ điển.</p>`],
      [26, 'Summary',
        `<p class="y-chinh">🎯 The deck gave an overview of Java technology, what to download, install and type to create Hello World, a closer look at the program, and what to do when compiling or running goes wrong.</p>
<table>
<thead><tr><th>You should now be able to</th><th>Check</th></tr></thead>
<tbody>
<tr><td>explain bytecode, JVM, API, JDK vs JRE</td><td>lesson 1.B slides 7–9, slide 22</td></tr>
<tr><td>create, run and package a NetBeans project</td><td>slides 12–18, 21</td></tr>
<tr><td>run a class from the command line with <code>-cp</code></td><td>slides 19–20</td></tr>
<tr><td>read and fix the four classic messages</td><td>slide 24</td></tr>
<tr><td>say which <code>main</code> signatures run on JDK 8</td><td>slide 25</td></tr>
</tbody>
</table>
<p>Next in Chapter 1 (P2): the deck <em>Learning the Java Language</em> — types, variables, arrays, operators and control flow, the part where your PRF192 knowledge carries straight over.</p>
<div class="callout">🧭 <strong>Go further — LAB211 and PRJ301</strong>: LAB211 checks are run from the command line exactly like slide 19; PRJ301 replaces <code>java HelloWorld</code> with a Tomcat server that calls your classes — the class path and "Could not find class" problems come back there as <code>ClassNotFoundException</code> in a web app.</div>`,
        `<p class="y-chinh">🎯 Bộ slide cho cái nhìn tổng quan về công nghệ Java, cần tải gì, cài gì, gõ gì để có Hello World, xem kỹ chương trình đó, và làm gì khi biên dịch hay chạy gặp lỗi.</p>
<table>
<thead><tr><th>Giờ bạn phải làm được</th><th>Xem lại</th></tr></thead>
<tbody>
<tr><td>giải thích bytecode, JVM, API, JDK khác JRE</td><td>bài 1.B slide 7–9, slide 22</td></tr>
<tr><td>tạo, chạy và đóng gói một project NetBeans</td><td>slide 12–18, 21</td></tr>
<tr><td>chạy một lớp từ dòng lệnh với <code>-cp</code></td><td>slide 19–20</td></tr>
<tr><td>đọc và sửa bốn thông báo lỗi kinh điển</td><td>slide 24</td></tr>
<tr><td>nói được chữ ký <code>main</code> nào chạy trên JDK 8</td><td>slide 25</td></tr>
</tbody>
</table>
<p>Tiếp theo trong Chương 1 (P2): bộ slide <em>Learning the Java Language</em> — kiểu, biến, mảng, toán tử và cấu trúc điều khiển, phần mà kiến thức PRF192 của bạn dùng lại thẳng được.</p>
<div class="callout">🧭 <strong>Đi tiếp — LAB211 và PRJ301</strong>: bài LAB211 được chạy kiểm từ dòng lệnh y như slide 19; PRJ301 thay <code>java HelloWorld</code> bằng một server Tomcat gọi các lớp của bạn — các lỗi class path và "không tìm thấy lớp" quay lại ở đó dưới dạng <code>ClassNotFoundException</code> trong ứng dụng web.</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>Your friend's <code>java -version</code> works but <code>javac</code> is "not recognized". What is wrong and how do you fix it?</li>
<li>Why does <code>java Helloworld</code> fail on Windows although Windows found the file?</li>
<li>Write the <code>main</code> signature from memory, then explain each of its five words.</li>
</ul>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li><code>java -version</code> của bạn bạn chạy được nhưng <code>javac</code> thì "not recognized". Sai ở đâu và sửa thế nào?</li>
<li>Vì sao <code>java Helloworld</code> hỏng trên Windows dù Windows vẫn tìm thấy file?</li>
<li>Viết chữ ký <code>main</code> không nhìn sách, rồi giải thích từng từ trong năm từ của nó.</li>
</ul>`),
    books([
      ['horstmann1', 'Ch. 2 "The Java Programming Environment" (2.3 command-line tools, 2.4 using an IDE) and Ch. 3.1 "A Simple Java Program"', 'Chương 2 "The Java Programming Environment" (2.3 công cụ dòng lệnh, 2.4 dùng IDE) và mục 3.1 "A Simple Java Program"'],
      ['javaTutorial', 'trail "Getting Started" — "The Hello World! Application", "A Closer Look", "Common Problems"', 'trail "Getting Started" — "The Hello World! Application", "A Closer Look", "Common Problems"'],
      ['fuOffline', 'part "Foundations" — The first Java program in NetBeans', 'phần "Foundations" — The first Java program in NetBeans'],
      ['devJava', '"Getting Started with Java" (and JEP 512 instance main methods, JDK 25)', '"Getting Started with Java" (và JEP 512 instance main method, JDK 25)'],
    ]),
  ].join('\n'),
};

/* ───────── 1.D — 📑 Slide by slide · Learning the Java Language: types, arrays, operators, casting, scope (slides 1–27) ───────── */
const L_pro4_1 = {
  title: '1.D — 📑 Slide by slide · Learning the Java Language: types, arrays, operators, casting, scope (slides 1–27)|||1.D — 📑 Học theo từng slide · Learning the Java Language: kiểu, mảng, toán tử, ép kiểu, phạm vi (slide 1–27)',
  slug: 'pro192-slide-pro4-1',
  type: 'VIDEO',
  description: 'Giảng đủ 27 slide bộ "Learning the Java Language": định danh và từ khoá (javac 1.8 báo lỗi thật), 8 kiểu nguyên thủy đo bằng lớp bao, tràn số, kiểu tham chiếu, mảng một và hai chiều vẽ stack/heap, toán tử và dịch bit đủ 32 bit (slide ghi "2 byte" là sai), hằng bát phân 034, thứ tự tính a[b]=b=0, switch trên String, for-each chỉ đọc, ép kiểu thu hẹp, phạm vi biến (Java không có global/file scope), nhập bằng Scanner, phong cách code, truyền tham số cho main — mọi đoạn code chạy thật trên JDK 8.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.D · school deck "Learning the Java Language", slides 1–27</span>
<h2>From PRF192 C to Java: the 20% that is new and the 80% that only looks the same</h2>
<p class="lead">This deck covers the "traditional" part of Java — variables, types, arrays, operators, control flow, casting, scope and console input — and keeps saying "the same as in C". That is <em>mostly</em> true, and exactly the "mostly" is where FE questions and PE bugs live: Java has no unsigned types but has <code>&gt;&gt;&gt;</code>, evaluates strictly left to right, forbids narrowing without a cast, refuses to redeclare a variable in an inner block, and treats every array as an object on the heap. Each slide below is explained, corrected where it is wrong, and backed by code that really ran on JDK 8.</p>
<div class="callout"><strong>How to read the outputs.</strong> Programs marked <code>// release: 8</code> were compiled with <code>javac --release 8</code> and run both on this site's JDK and on a real JDK 8 (Temurin 1.8.0 in a container) — the two outputs were identical. Transcripts that start with <code>&gt; javac</code> are real JDK 8 console sessions, error messages included, word for word.</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.D · bộ slide "Learning the Java Language" của trường, slide 1–27</span>
<h2>Từ C của PRF192 sang Java: 20% thật sự mới và 80% chỉ trông giống</h2>
<p class="lead">Bộ slide này đi qua phần "truyền thống" của Java — biến, kiểu, mảng, toán tử, cấu trúc điều khiển, ép kiểu, phạm vi và nhập từ bàn phím — và cứ nhắc "giống C". Điều đó <em>phần lớn</em> đúng, và chính chỗ "phần lớn" là nơi câu FE và lỗi PE nằm: Java không có kiểu không dấu nhưng có <code>&gt;&gt;&gt;</code>, tính toán hạng đúng trái sang phải, cấm thu hẹp kiểu mà không ép, không cho khai báo lại biến trong khối con, và coi mọi mảng là một đối tượng trên heap. Từng slide dưới đây được giảng, sửa chỗ sai, và kèm code chạy thật trên JDK 8.</p>
<div class="callout"><strong>Cách đọc output.</strong> Chương trình có dòng <code>// release: 8</code> được biên dịch bằng <code>javac --release 8</code> và chạy cả trên JDK của web lẫn trên JDK 8 thật (Temurin 1.8.0 trong container) — hai output trùng khít. Các đoạn bắt đầu bằng <code>&gt; javac</code> là phiên console JDK 8 thật, thông báo lỗi giữ nguyên từng chữ.</div>`),
    walkHead('pro4', 1, 27),
    walk('pro4', [
      [1, 'Learning the Java Language',
        `<p class="y-chinh">🎯 Title slide: the deck follows Oracle's tutorial trail "Learning the Java Language" (the link on the slide) — the language basics every later chapter stands on.</p>
<p>That trail has chapters on object-oriented concepts, language basics, classes and objects, annotations, interfaces and inheritance, numbers and strings, generics and packages. This deck takes only the <strong>Language Basics</strong> part; the next two decks (Numbers and Strings, Support Classes) finish Chapter 1.</p>
<p class="meo">🧠 The link starts with <code>http://</code>; type <code>https://docs.oracle.com/javase/tutorial/java/</code>. The tutorial is written for JDK 8 — exactly your exam JDK — and is still online.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề: bộ slide đi theo trail "Learning the Java Language" trong bộ hướng dẫn của Oracle (link trên slide) — phần nền ngôn ngữ mà mọi chương sau đứng lên trên.</p>
<p>Trail đó có các chương về khái niệm hướng đối tượng, cơ bản ngôn ngữ (language basics), lớp và đối tượng, annotation, interface và kế thừa, số và chuỗi, generics và package. Bộ slide này chỉ lấy phần <strong>Language Basics</strong>; hai bộ tiếp theo (Numbers and Strings, Support Classes) hoàn tất Chương 1.</p>
<p class="meo">🧠 Link bắt đầu bằng <code>http://</code>; hãy gõ <code>https://docs.oracle.com/javase/tutorial/java/</code>. Bộ hướng dẫn viết cho JDK 8 — đúng JDK phòng thi — và vẫn còn trên mạng.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Three goals: the fundamentals of the language (data types, variables, arrays, operators, logic constructs), passing arguments to <code>main</code>, and input/output of variables.</p>
<table>
<thead><tr><th>Objective (slide 2)</th><th>Slides</th><th>Code you will see run</th></tr></thead>
<tbody>
<tr><td>Identifiers, keywords, primitive and reference types</td><td>3–5</td><td><code>DatTenBien</code>, <code>KieuNguyenThuy</code>, <code>KieuThamChieu</code></td></tr>
<tr><td>One- and two-dimensional arrays</td><td>6–9</td><td><code>MangMotChieu</code>, <code>MangHaiChieu</code></td></tr>
<tr><td>Operators, literals, expressions, evaluation order</td><td>10–16</td><td><code>ToanTu</code>, <code>UseOps</code>, <code>HangSo</code>, <code>BieuThuc</code></td></tr>
<tr><td>Logic constructs, String, casting, scope</td><td>17–22</td><td><code>DieuKhien</code>, <code>KieuString</code>, <code>EpKieu</code>, <code>LoiPhamVi</code></td></tr>
<tr><td>Input/output, style, arguments of main</td><td>23–26</td><td><code>NhapXuat</code>, <code>ThamSoAdding</code></td></tr>
</tbody>
</table>
<p>Syllabus: the "Basic Java language" sessions (CLO2 — use Java syntax and semantics correctly). In the PE this is never a separate question — it is the material every question is written in.</p>`,
        `<p class="y-chinh">🎯 Ba mục tiêu: nền tảng của ngôn ngữ (kiểu dữ liệu, biến, mảng, toán tử, cấu trúc logic), truyền đối số cho <code>main</code>, và nhập/xuất giá trị biến.</p>
<table>
<thead><tr><th>Mục tiêu (slide 2)</th><th>Slide</th><th>Code bạn sẽ thấy chạy</th></tr></thead>
<tbody>
<tr><td>Định danh, từ khoá, kiểu nguyên thủy và kiểu tham chiếu</td><td>3–5</td><td><code>DatTenBien</code>, <code>KieuNguyenThuy</code>, <code>KieuThamChieu</code></td></tr>
<tr><td>Mảng một chiều và hai chiều</td><td>6–9</td><td><code>MangMotChieu</code>, <code>MangHaiChieu</code></td></tr>
<tr><td>Toán tử, hằng (literal), biểu thức, thứ tự tính</td><td>10–16</td><td><code>ToanTu</code>, <code>UseOps</code>, <code>HangSo</code>, <code>BieuThuc</code></td></tr>
<tr><td>Cấu trúc logic, String, ép kiểu, phạm vi</td><td>17–22</td><td><code>DieuKhien</code>, <code>KieuString</code>, <code>EpKieu</code>, <code>LoiPhamVi</code></td></tr>
<tr><td>Nhập/xuất, phong cách, đối số của main</td><td>23–26</td><td><code>NhapXuat</code>, <code>ThamSoAdding</code></td></tr>
</tbody>
</table>
<p>Đề cương: các buổi "Basic Java language" (CLO2 — dùng đúng cú pháp và ngữ nghĩa Java). Ở PE phần này không bao giờ là một câu riêng — nó là chất liệu mà mọi câu được viết bằng.</p>`],
      [3, 'Keywords and Identifiers',
        `<p class="y-chinh">🎯 Keywords are mostly the same as in C; an <strong>identifier</strong> (a name you choose) starts with a letter, <code>$</code> or <code>_</code>, continues with letters, digits, <code>$</code> or <code>_</code>; Java is case-sensitive; an identifier cannot be a keyword.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "TenHopLe.java",
        "public class TenHopLe {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int $tien = 100, _dem = 2, soLuong2 = 3;   // letter, $ or _ first; digits later\\n" +
        "        int count = 1, Count = 2, COUNT = 3;        // three DIFFERENT variables\\n" +
        "        System.out.println($tien + \\" \\" + _dem + \\" \\" + soLuong2);\\n" +
        "        System.out.println(count + \\" \\" + Count + \\" \\" + COUNT);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "TenHopLe.java");
    lenh(d, "java", "TenHopLe");
    viet(d, "TenSai.java",
        "public class TenSai {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int 2nd = 1;        // starts with a digit\\n" +
        "        int class = 3;      // a keyword\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "TenSai.java");
    viet(d, "TenGachNoi.java",
        "public class TenGachNoi {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int my-var = 2;     // '-' is the minus operator, not part of a name\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "TenGachNoi.java");
}</code></pre>
<div class="out">&gt; javac TenHopLe.java<br>
&gt; java TenHopLe<br>
100 2 3<br>
1 2 3<br>
&gt; javac TenSai.java<br>
TenSai.java:3: error: not a statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int 2nd = 1; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// starts with a digit<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:3: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int 2nd = 1; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// starts with a digit<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:4: error: not a statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int class = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a keyword<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:4: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int class = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a keyword<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:4: error: &lt;identifier&gt; expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int class = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a keyword<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:4: error: illegal start of type<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int class = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a keyword<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:4: error: &lt;identifier&gt; expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int class = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a keyword<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:4: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int class = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a keyword<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:6: error: reached end of file while parsing<br>
}<br>
&nbsp;^<br>
9 errors<br>
(exit code 1)<br>
&gt; javac TenGachNoi.java<br>
TenGachNoi.java:3: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int my-var = 2; &nbsp;&nbsp;&nbsp;&nbsp;// '-' is the minus operator, not part of a name<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>Read the real messages: javac never says "bad identifier". <code>int 2nd</code> becomes <code>not a statement</code> + <code>';' expected</code>; <code>int class</code> alone produces six errors plus "reached end of file", because <code>class</code> starts a class declaration in javac's eyes; <code>my-var</code> is read as <code>my - var</code>. And <code>count</code>, <code>Count</code>, <code>COUNT</code> are three different variables.</p>
<table>
<thead><tr><th>Rule (JLS 8 §3.8–3.9)</th><th>Detail</th></tr></thead>
<tbody>
<tr><td>50 keywords</td><td>includes <code>const</code> and <code>goto</code>: reserved but never used</td></tr>
<tr><td><code>true</code>, <code>false</code>, <code>null</code></td><td>literals, not keywords — still not allowed as names</td></tr>
<tr><td>"letter"</td><td>any Unicode letter: <code>điểm</code> is a legal name (avoid it: encodings break)</td></tr>
<tr><td>Conventions</td><td><code>soLuong</code> (variables, methods), <code>SinhVien</code> (classes), <code>MAX_SIZE</code> (constants)</td></tr>
</tbody>
</table>
<div class="pitfall">Fix compile errors <strong>from the first one down</strong>: in <code>TenSai.java</code> two wrong names produced nine messages.</div>`,
        `<p class="y-chinh">🎯 Từ khoá phần lớn giống C; <strong>định danh (identifier)</strong> — cái tên bạn tự đặt — bắt đầu bằng chữ cái, <code>$</code> hoặc <code>_</code>, các ký tự sau là chữ, số, <code>$</code> hoặc <code>_</code>; Java phân biệt hoa thường; định danh không được trùng từ khoá.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "TenHopLe.java",
        "public class TenHopLe {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int $tien = 100, _dem = 2, soLuong2 = 3;   // letter, $ or _ first; digits later\\n" +
        "        int count = 1, Count = 2, COUNT = 3;        // three DIFFERENT variables\\n" +
        "        System.out.println($tien + \\" \\" + _dem + \\" \\" + soLuong2);\\n" +
        "        System.out.println(count + \\" \\" + Count + \\" \\" + COUNT);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "TenHopLe.java");
    lenh(d, "java", "TenHopLe");
    viet(d, "TenSai.java",
        "public class TenSai {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int 2nd = 1;        // starts with a digit\\n" +
        "        int class = 3;      // a keyword\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "TenSai.java");
    viet(d, "TenGachNoi.java",
        "public class TenGachNoi {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int my-var = 2;     // '-' is the minus operator, not part of a name\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "TenGachNoi.java");
}</code></pre>
<div class="out">&gt; javac TenHopLe.java<br>
&gt; java TenHopLe<br>
100 2 3<br>
1 2 3<br>
&gt; javac TenSai.java<br>
TenSai.java:3: error: not a statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int 2nd = 1; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// starts with a digit<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:3: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int 2nd = 1; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// starts with a digit<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:4: error: not a statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int class = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a keyword<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:4: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int class = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a keyword<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:4: error: &lt;identifier&gt; expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int class = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a keyword<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:4: error: illegal start of type<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int class = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a keyword<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:4: error: &lt;identifier&gt; expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int class = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a keyword<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:4: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int class = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a keyword<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
TenSai.java:6: error: reached end of file while parsing<br>
}<br>
&nbsp;^<br>
9 errors<br>
(exit code 1)<br>
&gt; javac TenGachNoi.java<br>
TenGachNoi.java:3: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int my-var = 2; &nbsp;&nbsp;&nbsp;&nbsp;// '-' is the minus operator, not part of a name<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>Đọc thông báo thật: javac không bao giờ nói "tên sai". <code>int 2nd</code> thành <code>not a statement</code> (không phải câu lệnh) + <code>';' expected</code>; riêng <code>int class</code> đã sinh ra sáu lỗi cộng thêm "reached end of file", vì với javac <code>class</code> mở đầu một khai báo lớp; <code>my-var</code> bị đọc thành <code>my - var</code>. Còn <code>count</code>, <code>Count</code>, <code>COUNT</code> là ba biến khác nhau.</p>
<table>
<thead><tr><th>Luật (JLS 8 §3.8–3.9)</th><th>Chi tiết</th></tr></thead>
<tbody>
<tr><td>50 từ khoá</td><td>có cả <code>const</code> và <code>goto</code>: giữ chỗ nhưng không dùng</td></tr>
<tr><td><code>true</code>, <code>false</code>, <code>null</code></td><td>là literal (hằng), không phải từ khoá — vẫn không được dùng làm tên</td></tr>
<tr><td>"chữ cái"</td><td>mọi chữ cái Unicode: <code>điểm</code> là tên hợp lệ (nên tránh: dễ hỏng mã hoá)</td></tr>
<tr><td>Quy ước đặt tên</td><td><code>soLuong</code> (biến, phương thức), <code>SinhVien</code> (lớp), <code>MAX_SIZE</code> (hằng)</td></tr>
</tbody>
</table>
<div class="pitfall">Sửa lỗi biên dịch <strong>từ lỗi đầu tiên trở xuống</strong>: trong <code>TenSai.java</code> chỉ hai tên sai đã sinh ra chín thông báo.</div>`],
      [4, 'Primitive Data Types - Variables',
        `<p class="y-chinh">🎯 A <strong>primitive</strong> is a simple, non-object type holding a single value; Java has eight: <code>char</code> (2 bytes, <code>\\u0000</code>..<code>￿</code>), <code>byte</code> 1, <code>short</code> 2, <code>int</code> 4, <code>long</code> 8, <code>float</code> 4, <code>double</code> 8 and <code>boolean</code>; declare with <code>Type var [= initial value];</code>.</p>
<p>The slide's "-27 … 27 - 1" are powers whose superscript got lost: −2<sup>7</sup> … 2<sup>7</sup>−1, −2<sup>15</sup> … 2<sup>15</sup>−1 and so on. Here are the real limits, read from the wrapper classes, plus two behaviours C programmers do not expect:</p>
<pre><code class="language-java">// release: 8
// Slide 4: the eight primitive types — sizes and ranges read from the wrapper classes, plus overflow and default values
public class KieuNguyenThuy {
    static int soNguyen;          // fields get default values
    static double soThuc;
    static boolean dungSai;
    static char kyTu;

    public static void main(String[] args) {
        System.out.printf("%-7s %5s  %-22s %s%n", "type", "bytes", "min", "max");
        System.out.printf("%-7s %5d  %-22d %d%n", "byte", Byte.BYTES, Byte.MIN_VALUE, Byte.MAX_VALUE);
        System.out.printf("%-7s %5d  %-22d %d%n", "short", Short.BYTES, Short.MIN_VALUE, Short.MAX_VALUE);
        System.out.printf("%-7s %5d  %-22d %d%n", "int", Integer.BYTES, Integer.MIN_VALUE, Integer.MAX_VALUE);
        System.out.printf("%-7s %5d  %-22d %d%n", "long", Long.BYTES, Long.MIN_VALUE, Long.MAX_VALUE);
        System.out.printf("%-7s %5d  %-22d %d%n", "char", Character.BYTES, (int) Character.MIN_VALUE, (int) Character.MAX_VALUE);
        System.out.printf("%-7s %5d  %-22s %s%n", "float", Float.BYTES, Float.MIN_VALUE, Float.MAX_VALUE);
        System.out.printf("%-7s %5d  %-22s %s%n", "double", Double.BYTES, Double.MIN_VALUE, Double.MAX_VALUE);
        System.out.println("boolean: only true / false (no number, no size you can rely on)");
        int max = Integer.MAX_VALUE;
        System.out.println("max + 1        = " + (max + 1));                 // silent overflow, no error
        long sai = 2147483647 + 1;                                           // int + int overflows BEFORE it is widened to long
        long dung = 2147483647L + 1;
        System.out.println("long sai       = " + sai);
        System.out.println("long dung      = " + dung);
        char c = 'A';
        System.out.println("'A' + 1        = " + (c + 1));                   // char is a number underneath
        System.out.println("(char)('A'+1)  = " + (char) (c + 1));
        System.out.println("'\\\\u0041'       = " + 'A');
        System.out.println("defaults: int=" + soNguyen + ", double=" + soThuc + ", boolean=" + dungSai
            + ", char code=" + (int) kyTu);
    }
}</code></pre>
<div class="out">type &nbsp;&nbsp;&nbsp;bytes &nbsp;min &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max<br>
byte &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;-128 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;127<br>
short &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;-32768 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32767<br>
int &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;-2147483648 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2147483647<br>
long &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;-9223372036854775808 &nbsp;&nbsp;9223372036854775807<br>
char &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;65535<br>
float &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;1.4E-45 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.4028235E38<br>
double &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;4.9E-324 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.7976931348623157E308<br>
boolean: only true / false (no number, no size you can rely on)<br>
max + 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= -2147483648<br>
long sai &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= -2147483648<br>
long dung &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 2147483648<br>
'A' + 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 66<br>
(char)('A'+1) &nbsp;= B<br>
'\\u0041' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= A<br>
defaults: int=0, double=0.0, boolean=false, char code=0</div>
<p>What the output proves: sizes are <strong>fixed on every machine</strong> (in C an <code>int</code> may be 2 or 4 bytes); integer overflow wraps around <strong>silently</strong>; <code>2147483647 + 1</code> overflows <em>before</em> it is stored in a <code>long</code> — add <code>L</code>; <code>char</code> is an unsigned 16-bit number, so <code>'A' + 1</code> is 66; <code>Float.MIN_VALUE</code> and <code>Double.MIN_VALUE</code> are the smallest <em>positive</em> values, not the most negative ones.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/839a1a9bb7f06b49080ac1677e3a092240836bd2.svg" alt="Slides 4–5 in one picture: eight primitive types, three kinds of reference types" loading="lazy" /><p class="chu-thich">🧩 Slides 4–5 in one picture: eight primitive types, three kinds of reference types</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 4–5 — every Java variable is one of two kinds
left to right direction
' Primitive = the value itself; reference = the address of an object on the heap
rectangle "Java data types" as T
rectangle "Primitive types (8)\\nthe variable HOLDS the value" as P #ECFDF5
rectangle "Reference types\\nthe variable holds an ADDRESS (or null)" as R #EEF2FF
rectangle "integral\\nbyte 1B · short 2B · int 4B · long 8B" as I #FFFFFF
rectangle "character\\nchar 2B (UTF-16 code unit, 0..65535)" as C #FFFFFF
rectangle "floating point\\nfloat 4B · double 8B" as F #FFFFFF
rectangle "logical\\nboolean (true / false)" as B #FFFFFF
rectangle "class types\\nString, Scanner, Integer, Student…" as K #FFFFFF
rectangle "array types\\nint[], String[], int[][]" as A #FFFFFF
rectangle "interface types\\nList, Comparator, Comparable…" as N #FFFFFF
T --&gt; P
T --&gt; R
P --&gt; I
P --&gt; C
P --&gt; F
P --&gt; B
R --&gt; K
R --&gt; A
R --&gt; N
note right of B
  default value of a field: 0, 0.0, false, '\\u0000'
  copy = copy the value
end note
note right of N
  default value of a field: null
  copy = copy the address (two names, one object)
end note
@enduml</code></pre></details>
<div class="pitfall">FE trap: "boolean is 1 bit / 1 byte" — the language does not define its size (the slide leaves the cell empty on purpose), and <code>boolean</code> cannot be converted to or from a number.</div>`,
        `<p class="y-chinh">🎯 Kiểu <strong>nguyên thủy (primitive)</strong> là kiểu đơn giản, không phải đối tượng, giữ đúng một giá trị; Java có tám kiểu: <code>char</code> (2 byte, <code>\\u0000</code>..<code>￿</code>), <code>byte</code> 1, <code>short</code> 2, <code>int</code> 4, <code>long</code> 8, <code>float</code> 4, <code>double</code> 8 và <code>boolean</code>; khai báo bằng <code>Kiểu tênBiến [= giá trị đầu];</code>.</p>
<p>Chỗ "-27 … 27 - 1" trên slide là luỹ thừa bị mất chỉ số trên: −2<sup>7</sup> … 2<sup>7</sup>−1, −2<sup>15</sup> … 2<sup>15</sup>−1, v.v. Đây là giới hạn thật, đọc từ các lớp bao, cùng hai hành vi mà người học C không ngờ tới:</p>
<pre><code class="language-java">// release: 8
// Slide 4: tám kiểu nguyên thủy — kích thước và miền giá trị đọc từ lớp bao, cộng tràn số và giá trị mặc định
public class KieuNguyenThuy {
    static int soNguyen;          // trường được gán giá trị mặc định
    static double soThuc;
    static boolean dungSai;
    static char kyTu;

    public static void main(String[] args) {
        System.out.printf("%-7s %5s  %-22s %s%n", "type", "bytes", "min", "max");
        System.out.printf("%-7s %5d  %-22d %d%n", "byte", Byte.BYTES, Byte.MIN_VALUE, Byte.MAX_VALUE);
        System.out.printf("%-7s %5d  %-22d %d%n", "short", Short.BYTES, Short.MIN_VALUE, Short.MAX_VALUE);
        System.out.printf("%-7s %5d  %-22d %d%n", "int", Integer.BYTES, Integer.MIN_VALUE, Integer.MAX_VALUE);
        System.out.printf("%-7s %5d  %-22d %d%n", "long", Long.BYTES, Long.MIN_VALUE, Long.MAX_VALUE);
        System.out.printf("%-7s %5d  %-22d %d%n", "char", Character.BYTES, (int) Character.MIN_VALUE, (int) Character.MAX_VALUE);
        System.out.printf("%-7s %5d  %-22s %s%n", "float", Float.BYTES, Float.MIN_VALUE, Float.MAX_VALUE);
        System.out.printf("%-7s %5d  %-22s %s%n", "double", Double.BYTES, Double.MIN_VALUE, Double.MAX_VALUE);
        System.out.println("boolean: only true / false (no number, no size you can rely on)");
        int max = Integer.MAX_VALUE;
        System.out.println("max + 1        = " + (max + 1));                 // tràn số im lặng, không báo lỗi
        long sai = 2147483647 + 1;                                           // int + int tràn TRƯỚC khi được nới sang long
        long dung = 2147483647L + 1;
        System.out.println("long sai       = " + sai);
        System.out.println("long dung      = " + dung);
        char c = 'A';
        System.out.println("'A' + 1        = " + (c + 1));                   // char bên dưới là một con số
        System.out.println("(char)('A'+1)  = " + (char) (c + 1));
        System.out.println("'\\\\u0041'       = " + 'A');
        System.out.println("defaults: int=" + soNguyen + ", double=" + soThuc + ", boolean=" + dungSai
            + ", char code=" + (int) kyTu);
    }
}</code></pre>
<div class="out">type &nbsp;&nbsp;&nbsp;bytes &nbsp;min &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max<br>
byte &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;-128 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;127<br>
short &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;-32768 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32767<br>
int &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;-2147483648 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2147483647<br>
long &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;-9223372036854775808 &nbsp;&nbsp;9223372036854775807<br>
char &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;65535<br>
float &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;1.4E-45 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.4028235E38<br>
double &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;4.9E-324 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.7976931348623157E308<br>
boolean: only true / false (no number, no size you can rely on)<br>
max + 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= -2147483648<br>
long sai &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= -2147483648<br>
long dung &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 2147483648<br>
'A' + 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 66<br>
(char)('A'+1) &nbsp;= B<br>
'\\u0041' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= A<br>
defaults: int=0, double=0.0, boolean=false, char code=0</div>
<p>Output chứng minh: kích thước <strong>cố định trên mọi máy</strong> (trong C, <code>int</code> có thể 2 hoặc 4 byte); tràn số nguyên quay vòng <strong>im lặng</strong>, không báo lỗi; <code>2147483647 + 1</code> tràn <em>trước</em> khi được cất vào <code>long</code> — phải thêm <code>L</code>; <code>char</code> là số 16 bit không dấu, nên <code>'A' + 1</code> bằng 66; <code>Float.MIN_VALUE</code> và <code>Double.MIN_VALUE</code> là giá trị <em>dương</em> nhỏ nhất, không phải số âm nhất.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/839a1a9bb7f06b49080ac1677e3a092240836bd2.svg" alt="Slide 4–5 trong một hình: tám kiểu nguyên thủy, ba loại kiểu tham chiếu" loading="lazy" /><p class="chu-thich">🧩 Slide 4–5 trong một hình: tám kiểu nguyên thủy, ba loại kiểu tham chiếu</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 4–5 — every Java variable is one of two kinds
left to right direction
' Nguyên thủy = chính giá trị; tham chiếu = địa chỉ của một đối tượng trên heap
rectangle "Java data types" as T
rectangle "Primitive types (8)\\nthe variable HOLDS the value" as P #ECFDF5
rectangle "Reference types\\nthe variable holds an ADDRESS (or null)" as R #EEF2FF
rectangle "integral\\nbyte 1B · short 2B · int 4B · long 8B" as I #FFFFFF
rectangle "character\\nchar 2B (UTF-16 code unit, 0..65535)" as C #FFFFFF
rectangle "floating point\\nfloat 4B · double 8B" as F #FFFFFF
rectangle "logical\\nboolean (true / false)" as B #FFFFFF
rectangle "class types\\nString, Scanner, Integer, Student…" as K #FFFFFF
rectangle "array types\\nint[], String[], int[][]" as A #FFFFFF
rectangle "interface types\\nList, Comparator, Comparable…" as N #FFFFFF
T --&gt; P
T --&gt; R
P --&gt; I
P --&gt; C
P --&gt; F
P --&gt; B
R --&gt; K
R --&gt; A
R --&gt; N
note right of B
  default value of a field: 0, 0.0, false, '\\u0000'
  copy = copy the value
end note
note right of N
  default value of a field: null
  copy = copy the address (two names, one object)
end note
@enduml</code></pre></details>
<div class="pitfall">Bẫy FE: "boolean chiếm 1 bit / 1 byte" — ngôn ngữ không quy định kích thước của nó (slide cố ý để trống ô đó), và <code>boolean</code> không đổi qua lại được với số.</div>`],
      [5, 'Reference Data Types - Variables',
        `<p class="y-chinh">🎯 A <strong>reference</strong> variable contains the reference (address) of a dynamically created object; reference types are class types, array types and interface types; the default value of any reference variable is <code>null</code>; example: <code>String s = new String("Hello");</code> — the picture shows <code>s</code> on the stack holding 2000, and the object "Hello" at address 2000 on the heap.</p>
<pre><code class="language-java">// release: 8
// Slide 5: a reference variable holds the ADDRESS of an object, not the object — copying it copies the address
public class KieuThamChieu {
    static String chuaGan;        // a reference field with no value yet

    public static void main(String[] args) {
        int a = 10;
        int b = a;                // copies the VALUE 10
        b = 99;
        System.out.println("primitive: a = " + a + ", b = " + b);

        int[] x = {10, 20};
        int[] y = x;              // copies the ADDRESS: x and y now point to ONE array
        y[0] = 99;
        System.out.println("reference: x[0] = " + x[0] + ", same object? " + (x == y));

        String s = new String("Hello");
        String t = s;
        System.out.println("s == t ? " + (s == t) + "   (one String object, two names)");

        System.out.println("default of a reference field: " + chuaGan);
        try {
            System.out.println(chuaGan.length());                          // calling a method on null
        } catch (NullPointerException e) {
            System.out.println("chuaGan.length() -&gt; " + e.getClass().getSimpleName());
        }
    }
}</code></pre>
<div class="out">primitive: a = 10, b = 99<br>
reference: x[0] = 99, same object? true<br>
s == t ? true &nbsp;&nbsp;(one String object, two names)<br>
default of a reference field: null<br>
chuaGan.length() -&gt; NullPointerException</div>
<p>The one sentence to remember: <strong>assigning a reference copies the address, never the object</strong>. After <code>int[] y = x;</code> there is one array with two names, so writing through <code>y</code> changes what <code>x</code> sees. A reference that holds <code>null</code> points nowhere; calling a method on it throws <code>NullPointerException</code> — the most common runtime error in every Java course and job.</p>
<p>➕ Two details the slide skips: (1) a <em>local</em> variable has no default at all — using it before assigning is a compile error ("variable might not have been initialized"); only fields and array elements get <code>0</code>/<code>false</code>/<code>null</code>; (2) Java has no pointer arithmetic: you cannot add 4 to an address as in C.</p>
<div class="pitfall">FE trap: "<code>String</code> is a primitive type" — no, it is a class (a reference type); it only <em>looks</em> primitive because of literals like <code>"Hi"</code> and the <code>+</code> operator.</div>`,
        `<p class="y-chinh">🎯 Biến <strong>tham chiếu (reference)</strong> chứa tham chiếu (địa chỉ) của một đối tượng được tạo động; kiểu tham chiếu gồm kiểu lớp, kiểu mảng và kiểu interface; giá trị mặc định của mọi biến tham chiếu là <code>null</code>; ví dụ: <code>String s = new String("Hello");</code> — hình vẽ <code>s</code> trên stack giữ số 2000, còn đối tượng "Hello" ở địa chỉ 2000 trên heap.</p>
<pre><code class="language-java">// release: 8
// Slide 5: biến tham chiếu giữ ĐỊA CHỈ của đối tượng, không giữ đối tượng — chép biến là chép địa chỉ
public class KieuThamChieu {
    static String chuaGan;        // trường tham chiếu chưa được gán

    public static void main(String[] args) {
        int a = 10;
        int b = a;                // chép GIÁ TRỊ 10
        b = 99;
        System.out.println("primitive: a = " + a + ", b = " + b);

        int[] x = {10, 20};
        int[] y = x;              // chép ĐỊA CHỈ: x và y cùng trỏ MỘT mảng
        y[0] = 99;
        System.out.println("reference: x[0] = " + x[0] + ", same object? " + (x == y));

        String s = new String("Hello");
        String t = s;
        System.out.println("s == t ? " + (s == t) + "   (one String object, two names)");

        System.out.println("default of a reference field: " + chuaGan);
        try {
            System.out.println(chuaGan.length());                          // gọi phương thức trên null
        } catch (NullPointerException e) {
            System.out.println("chuaGan.length() -&gt; " + e.getClass().getSimpleName());
        }
    }
}</code></pre>
<div class="out">primitive: a = 10, b = 99<br>
reference: x[0] = 99, same object? true<br>
s == t ? true &nbsp;&nbsp;(one String object, two names)<br>
default of a reference field: null<br>
chuaGan.length() -&gt; NullPointerException</div>
<p>Câu duy nhất cần nhớ: <strong>gán biến tham chiếu là chép địa chỉ, không bao giờ chép đối tượng</strong>. Sau <code>int[] y = x;</code> chỉ có một mảng với hai cái tên, nên ghi qua <code>y</code> thì <code>x</code> cũng thấy. Tham chiếu chứa <code>null</code> thì không trỏ đi đâu; gọi phương thức trên nó ném <code>NullPointerException</code> — lỗi lúc chạy phổ biến nhất ở mọi khoá học và mọi công việc Java.</p>
<p>➕ Hai chi tiết slide bỏ qua: (1) biến <em>cục bộ</em> không có giá trị mặc định nào — dùng trước khi gán là lỗi biên dịch ("variable might not have been initialized"); chỉ trường (field) và phần tử mảng mới được gán <code>0</code>/<code>false</code>/<code>null</code>; (2) Java không có phép toán con trỏ: không thể cộng 4 vào địa chỉ như trong C.</p>
<div class="pitfall">Bẫy FE: "<code>String</code> là kiểu nguyên thủy" — sai, nó là một lớp (kiểu tham chiếu); nó chỉ <em>trông</em> như nguyên thủy nhờ các literal như <code>"Hi"</code> và toán tử <code>+</code>.</div>`],
      [6, 'One Dimensional Arrays (1)',
        `<p class="y-chinh">🎯 An <strong>array</strong> is a container object that holds a fixed number of values of a single type; its length is set when it is created; each item is an <strong>element</strong>, reached by its numerical <strong>index</strong> — the figure shows an array of length 10, indexes 0 to 9, and "element at index 8" as the ninth box.</p>
<p>Three words carry the whole slide: <em>object</em> (an array lives on the heap and is reached through a reference — slide 8), <em>fixed</em> (it never grows: to "add" an element you create a bigger array and copy, which is exactly why <code>ArrayList</code> exists — Chapter 8), and <em>index from 0</em> (the last index is <code>length - 1</code>).</p>
<p>Unlike C, Java <strong>checks every index</strong>: <code>a[10]</code> on a 10-element array does not read random memory, it throws <code>ArrayIndexOutOfBoundsException</code> (you will see it on slide 8). And <code>length</code> is a field, not a method: <code>a.length</code>, while a String uses <code>s.length()</code>.</p>
<div class="pitfall">FE trap: "<code>int[] arr = new int[100];</code> — the maximum index is 100" is wrong: it is 99; there are 100 elements, all <code>0</code> by default.</div>`,
        `<p class="y-chinh">🎯 <strong>Mảng (array)</strong> là một đối tượng chứa một số lượng cố định giá trị cùng kiểu; độ dài được chốt khi tạo mảng; mỗi ô là một <strong>phần tử (element)</strong>, truy cập bằng <strong>chỉ số (index)</strong> — hình vẽ mảng dài 10, chỉ số 0 đến 9, và "phần tử ở chỉ số 8" là ô thứ chín.</p>
<p>Ba chữ gánh cả slide: <em>đối tượng</em> (mảng nằm trên heap và được với tới qua một tham chiếu — slide 8), <em>cố định</em> (mảng không bao giờ dài ra: muốn "thêm" phần tử phải tạo mảng lớn hơn rồi chép sang, đó chính là lý do có <code>ArrayList</code> — Chương 8), và <em>chỉ số từ 0</em> (chỉ số cuối là <code>length - 1</code>).</p>
<p>Khác C, Java <strong>kiểm tra mọi chỉ số</strong>: <code>a[10]</code> trên mảng 10 phần tử không đọc bộ nhớ lung tung, mà ném <code>ArrayIndexOutOfBoundsException</code> (bạn sẽ thấy ở slide 8). Và <code>length</code> là một trường, không phải phương thức: <code>a.length</code>, còn String thì dùng <code>s.length()</code>.</p>
<div class="pitfall">Bẫy FE: "<code>int[] arr = new int[100];</code> — chỉ số lớn nhất là 100" là sai: là 99; có 100 phần tử, mặc định đều bằng <code>0</code>.</div>`],
      [7, 'One Dimensional Arrays (2)',
        `<p class="y-chinh">🎯 Declare a variable that refers to an array (<code>int[] anArray;</code> or <code>float anArrayOfFloats[];</code>), create it with <code>new</code> (<code>anArray = new int[10];</code>), then initialise and access it by index; copy arrays with <code>System.arraycopy</code>.</p>
<pre class="trich"><code class="language-java">int[] ar;                     // a reference, no array yet
ar = new int[3];              // 3 ints on the heap, all 0
System.out.println("new int[3]   -&gt; " + Arrays.toString(ar) + ", length = " + ar.length);
ar[0] = 1; ar[1] = 2; ar[2] = 3;
int[] a3 = {1, 2, 3, 4, 5};   // declare + create + fill in one line
int a4[] = {1, 2, 3, 4, 5};   // C-style brackets are legal too
float anArrayOfFloats[] = new float[2];
String[] names = new String[2];
System.out.println("ar = " + Arrays.toString(ar) + ", a3.length = " + a3.length + ", a4[4] = " + a4[4]);
System.out.println("defaults: float " + Arrays.toString(anArrayOfFloats) + ", String " + Arrays.toString(names));</code></pre>
<pre class="trich"><code class="language-java">int[] src = {1, 2, 3, 4, 5, 6, 7};
int[] dst = new int[5];
System.arraycopy(src, 2, dst, 0, 3);           // from src[2], to dst[0], 3 elements
System.out.println("arraycopy    -&gt; " + Arrays.toString(dst));
int[] ban = Arrays.copyOf(src, 3);              // a NEW array (Java 6+)
int[] bietDanh = src;                           // NOT a copy, just a second name
bietDanh[0] = 100;
System.out.println("copyOf       -&gt; " + Arrays.toString(ban) + ", src[0] after alias write = " + src[0]);</code></pre>
<div class="out">new int[3] &nbsp;&nbsp;-&gt; [0, 0, 0], length = 3<br>
ar = [1, 2, 3], a3.length = 5, a4[4] = 5<br>
defaults: float [0.0, 0.0], String [null, null]<br>
arraycopy &nbsp;&nbsp;&nbsp;-&gt; [3, 4, 5, 0, 0]<br>
copyOf &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [1, 2, 3], src[0] after alias write = 100<br>
ar[3] = 4 &nbsp;&nbsp;&nbsp;-&gt; ArrayIndexOutOfBoundsException<br>
int x[], y; &nbsp;-&gt; x.length = 5, y = 5</div>
<p><code>System.arraycopy(src, srcPos, dest, destPos, length)</code> copies into an array that must <strong>already exist</strong> and be long enough; <code>Arrays.copyOf(src, n)</code> (since Java 6) creates a new array for you. Neither is the same as <code>bietDanh = src</code>, which copies nothing but the address — writing <code>bietDanh[0] = 100</code> changed <code>src[0]</code>.</p>
<p class="meo">🧠 Prefer <code>int[] a</code> (the type is "array of int") over <code>int a[]</code> (C style). Slide 8 shows why the C style can fool you.</p>`,
        `<p class="y-chinh">🎯 Khai báo biến trỏ tới mảng (<code>int[] anArray;</code> hoặc <code>float anArrayOfFloats[];</code>), tạo mảng bằng <code>new</code> (<code>anArray = new int[10];</code>), rồi khởi tạo và truy cập theo chỉ số; chép mảng bằng <code>System.arraycopy</code>.</p>
<pre class="trich"><code class="language-java">int[] ar;                     // mới có biến tham chiếu, chưa có mảng
ar = new int[3];              // 3 số int trên heap, đều bằng 0
System.out.println("new int[3]   -&gt; " + Arrays.toString(ar) + ", length = " + ar.length);
ar[0] = 1; ar[1] = 2; ar[2] = 3;
int[] a3 = {1, 2, 3, 4, 5};   // khai báo + tạo + gán trong một dòng
int a4[] = {1, 2, 3, 4, 5};   // dấu ngoặc kiểu C cũng hợp lệ
float anArrayOfFloats[] = new float[2];
String[] names = new String[2];
System.out.println("ar = " + Arrays.toString(ar) + ", a3.length = " + a3.length + ", a4[4] = " + a4[4]);
System.out.println("defaults: float " + Arrays.toString(anArrayOfFloats) + ", String " + Arrays.toString(names));</code></pre>
<pre class="trich"><code class="language-java">int[] src = {1, 2, 3, 4, 5, 6, 7};
int[] dst = new int[5];
System.arraycopy(src, 2, dst, 0, 3);           // từ src[2], tới dst[0], 3 phần tử
System.out.println("arraycopy    -&gt; " + Arrays.toString(dst));
int[] ban = Arrays.copyOf(src, 3);              // một mảng MỚI (Java 6+)
int[] bietDanh = src;                           // KHÔNG phải bản sao, chỉ là tên thứ hai
bietDanh[0] = 100;
System.out.println("copyOf       -&gt; " + Arrays.toString(ban) + ", src[0] after alias write = " + src[0]);</code></pre>
<div class="out">new int[3] &nbsp;&nbsp;-&gt; [0, 0, 0], length = 3<br>
ar = [1, 2, 3], a3.length = 5, a4[4] = 5<br>
defaults: float [0.0, 0.0], String [null, null]<br>
arraycopy &nbsp;&nbsp;&nbsp;-&gt; [3, 4, 5, 0, 0]<br>
copyOf &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [1, 2, 3], src[0] after alias write = 100<br>
ar[3] = 4 &nbsp;&nbsp;&nbsp;-&gt; ArrayIndexOutOfBoundsException<br>
int x[], y; &nbsp;-&gt; x.length = 5, y = 5</div>
<p><code>System.arraycopy(nguồn, vịTríNguồn, đích, vịTríĐích, sốPhầnTử)</code> chép vào một mảng đích phải <strong>có sẵn</strong> và đủ dài; <code>Arrays.copyOf(nguồn, n)</code> (từ Java 6) tự tạo mảng mới cho bạn. Cả hai đều khác <code>bietDanh = src</code>, phép gán chỉ chép địa chỉ — ghi <code>bietDanh[0] = 100</code> đã đổi luôn <code>src[0]</code>.</p>
<p class="meo">🧠 Nên viết <code>int[] a</code> (kiểu là "mảng int") thay vì <code>int a[]</code> (kiểu C). Slide 8 cho thấy vì sao kiểu C có thể lừa bạn.</p>`],
      [8, 'One Dimensional Arrays (3): Stack and Heap',
        `<p class="y-chinh">🎯 <code>int[] ar; ar = new int[3]; ar[0]=1; ar[1]=2; ar[2]=3;</code> — four ways to declare (<code>int a2[];</code>, <code>int[] a3 = {1,2,3,4,5};</code>, <code>int a4[] = {…};</code>); the picture: <code>ar</code> on the <strong>stack</strong> holds 10000, the three ints live at address 10000 on the <strong>heap</strong>, while <code>int n = 10</code> keeps 10 itself — "an array is a reference variable".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/0a99a2f811b1b10ada1fd120f3134cfc3d0003db.svg" alt="Slide 8 redrawn as a UML object diagram: a value variable vs an array reference" loading="lazy" /><p class="chu-thich">🧩 Slide 8 redrawn as a UML object diagram: a value variable vs an array reference</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 8 redrawn — int n = 10 vs int[] ar = new int[3]
' A value variable stores 10 itself; an array variable stores where the array lives
left to right direction
package "Stack (frame of main)" as S #F8FAFC {
  object "n : int" as n {
    value = 10
  }
  object "ar : int[]" as ar {
    value = @10000 (an address)
  }
}
package "Heap" as H #FFF7ED {
  object "int[3] @10000" as arr {
    length = 3
    [0] = 1
    [1] = 2
    [2] = 3
  }
}
ar --&gt; arr : refers to
@enduml</code></pre></details>
<p>(The first text line of this slide is the word "Stack" from the picture; the slide's real title is "One Dimensional Arrays (3)".) The last part of the run above belongs to this slide:</p>
<pre class="trich"><code class="language-java">try {
    ar[3] = 4;                                  // valid indexes are 0..length-1
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("ar[3] = 4    -&gt; " + e.getClass().getSimpleName());
}
int x[], y;                                     // trap: only x is an array, y is a plain int
y = 5;
x = new int[y];
System.out.println("int x[], y;  -&gt; x.length = " + x.length + ", y = " + y);</code></pre>
<p>Two traps proven: an index outside <code>0..length-1</code> stops the program with <code>ArrayIndexOutOfBoundsException</code>; and in <code>int x[], y;</code> only <code>x</code> is an array — the brackets belong to the name, not to the type. With <code>int[] x, y;</code> both would be arrays.</p>
<div class="pitfall">FE trap: "What happens when you assign an array to another array?" — both variables reference the same memory location; no copy is made.</div>`,
        `<p class="y-chinh">🎯 <code>int[] ar; ar = new int[3]; ar[0]=1; ar[1]=2; ar[2]=3;</code> — bốn cách khai báo (<code>int a2[];</code>, <code>int[] a3 = {1,2,3,4,5};</code>, <code>int a4[] = {…};</code>); hình vẽ: <code>ar</code> trên <strong>stack</strong> giữ số 10000, ba số int nằm ở địa chỉ 10000 trên <strong>heap</strong>, còn <code>int n = 10</code> giữ chính số 10 — "mảng là một biến tham chiếu".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/0a99a2f811b1b10ada1fd120f3134cfc3d0003db.svg" alt="Slide 8 vẽ lại bằng sơ đồ đối tượng UML: biến giá trị và biến tham chiếu mảng" loading="lazy" /><p class="chu-thich">🧩 Slide 8 vẽ lại bằng sơ đồ đối tượng UML: biến giá trị và biến tham chiếu mảng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 8 redrawn — int n = 10 vs int[] ar = new int[3]
' Biến giá trị lưu chính số 10; biến mảng lưu nơi mảng đang nằm
left to right direction
package "Stack (frame of main)" as S #F8FAFC {
  object "n : int" as n {
    value = 10
  }
  object "ar : int[]" as ar {
    value = @10000 (an address)
  }
}
package "Heap" as H #FFF7ED {
  object "int[3] @10000" as arr {
    length = 3
    [0] = 1
    [1] = 2
    [2] = 3
  }
}
ar --&gt; arr : refers to
@enduml</code></pre></details>
<p>(Dòng chữ đầu tiên của slide này là chữ "Stack" trong hình; tiêu đề thật của slide là "One Dimensional Arrays (3)".) Phần cuối của lần chạy ở trên thuộc về slide này:</p>
<pre class="trich"><code class="language-java">try {
    ar[3] = 4;                                  // chỉ số hợp lệ là 0..length-1
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("ar[3] = 4    -&gt; " + e.getClass().getSimpleName());
}
int x[], y;                                     // bẫy: chỉ x là mảng, y là int thường
y = 5;
x = new int[y];
System.out.println("int x[], y;  -&gt; x.length = " + x.length + ", y = " + y);</code></pre>
<p>Hai bẫy đã chứng minh: chỉ số ngoài <code>0..length-1</code> làm chương trình dừng với <code>ArrayIndexOutOfBoundsException</code>; và trong <code>int x[], y;</code> chỉ <code>x</code> là mảng — dấu ngoặc thuộc về tên biến, không thuộc về kiểu. Viết <code>int[] x, y;</code> thì cả hai đều là mảng.</p>
<div class="pitfall">Bẫy FE: "Gán một mảng cho mảng khác thì sao?" — cả hai biến cùng tham chiếu một vùng nhớ; không có bản sao nào được tạo.</div>`],
      [9, 'Multiple Dimensional Arrays',
        `<p class="y-chinh">🎯 <code>int m[][] = {{1,2,3,4}, {91,92}, {2001,2002}};</code> is an array of row references whose rows can have different lengths; <code>m[1] = replacement;</code> replaces a whole row; a rectangular matrix is <code>m = new int[r][c];</code> and an element is <code>m[i][j]</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 9: a 2D array is an array of row references — rows can have different lengths and can be replaced
import java.util.Arrays;

public class MangHaiChieu {
    public static void main(String[] args) {
        int m[][] = { {1, 2, 3, 4}, {91, 92}, {2001, 2002} };
        System.out.println("m.length = " + m.length + ", row lengths = " + m[0].length + " " + m[1].length + " " + m[2].length);
        int[] replacement = {5, 6, 7, 8, 9, 10};
        int[] cu = m[1];                       // keep the old row to look at it
        m[1] = replacement;                    // swap a whole ROW reference
        System.out.println("after m[1] = replacement: " + Arrays.deepToString(m));
        System.out.println("m[1] == replacement ? " + (m[1] == replacement) + ", old row still " + Arrays.toString(cu));
        replacement[0] = 500;                  // the matrix sees it: they share one row
        System.out.println("m[1][0] = " + m[1][0]);
        int r = 3, c = 4;
        int[][] t = new int[r][c];             // r rows x c columns, all 0
        for (int i = 0; i &lt; t.length; i++)
            for (int j = 0; j &lt; t[i].length; j++)
                t[i][j] = i * 10 + j;
        for (int[] hang : t) {
            for (int v : hang) System.out.printf("%4d", v);
            System.out.println();
        }
        int[][] tamGiac = new int[3][];        // rows created later, one by one
        for (int i = 0; i &lt; tamGiac.length; i++) tamGiac[i] = new int[i + 1];
        System.out.println("triangle: " + Arrays.deepToString(tamGiac) + ", println(t) prints " + (t.toString().startsWith("[[I@") ? "[[I@..." : "?"));
    }
}</code></pre>
<div class="out">m.length = 3, row lengths = 4 2 2<br>
after m[1] = replacement: [[1, 2, 3, 4], [5, 6, 7, 8, 9, 10], [2001, 2002]]<br>
m[1] == replacement ? true, old row still [91, 92]<br>
m[1][0] = 500<br>
&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;1 &nbsp;&nbsp;2 &nbsp;&nbsp;3<br>
&nbsp;&nbsp;10 &nbsp;11 &nbsp;12 &nbsp;13<br>
&nbsp;&nbsp;20 &nbsp;21 &nbsp;22 &nbsp;23<br>
triangle: [[0], [0, 0], [0, 0, 0]], println(t) prints [[I@...</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/57e27c93c558d7f53f8e68e84c003a154dc99573.svg" alt="Slide 9 redrawn: m points to a table of row references; after m[1] = replacement the old row {91, 92} is garbage" loading="lazy" /><p class="chu-thich">🧩 Slide 9 redrawn: m points to a table of row references; after m[1] = replacement the old row {91, 92} is garbage</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 9 redrawn — m[1] = replacement swaps a whole row reference
' After the assignment nothing points to {91, 92} any more: it becomes garbage
left to right direction
object "m : int[][]" as m
object "int[][3] (row table)" as rows {
  [0] = ref
  [1] = ref
  [2] = ref
}
object "int[4]" as r0 {
  1, 2, 3, 4
}
object "int[2] (old row)" as r1 #FEE2E2 {
  91, 92
}
object "int[2]" as r2 {
  2001, 2002
}
object "replacement : int[]" as rep
object "int[6]" as r3 #ECFDF5 {
  5, 6, 7, 8, 9, 10
}
m --&gt; rows
rows --&gt; r0 : [0]
rows ..&gt; r1 : [1] before
rows --&gt; r3 : [1] after
rows --&gt; r2 : [2]
rep --&gt; r3
note bottom of r1
  no reference left
  -&gt; garbage collector
end note
@enduml</code></pre></details>
<p>The slide's picture uses made-up addresses (8000, 100, 200, 500, 1000); the diagram above keeps the idea and drops the numbers. Three consequences: rows of different lengths ("jagged" arrays) are normal; <code>m.length</code> is the number of <strong>rows</strong>, <code>m[i].length</code> the length of row <code>i</code>; and after <code>m[1] = replacement</code> the matrix and <code>replacement</code> <em>share</em> one row — writing <code>replacement[0] = 500</code> changed <code>m[1][0]</code>.</p>
<p class="meo">🧠 Print a 2D array with <code>Arrays.deepToString(m)</code>; <code>Arrays.toString(m)</code> or <code>println(m)</code> only show addresses like <code>[[I@1b6d3586</code>.</p>`,
        `<p class="y-chinh">🎯 <code>int m[][] = {{1,2,3,4}, {91,92}, {2001,2002}};</code> là mảng các tham chiếu tới hàng, các hàng có thể dài khác nhau; <code>m[1] = replacement;</code> thay cả một hàng; ma trận chữ nhật là <code>m = new int[r][c];</code> và một phần tử là <code>m[i][j]</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 9: mảng 2 chiều là mảng các tham chiếu tới hàng — các hàng dài khác nhau và có thể bị thay
import java.util.Arrays;

public class MangHaiChieu {
    public static void main(String[] args) {
        int m[][] = { {1, 2, 3, 4}, {91, 92}, {2001, 2002} };
        System.out.println("m.length = " + m.length + ", row lengths = " + m[0].length + " " + m[1].length + " " + m[2].length);
        int[] replacement = {5, 6, 7, 8, 9, 10};
        int[] cu = m[1];                       // giữ hàng cũ để xem
        m[1] = replacement;                    // thay cả tham chiếu HÀNG
        System.out.println("after m[1] = replacement: " + Arrays.deepToString(m));
        System.out.println("m[1] == replacement ? " + (m[1] == replacement) + ", old row still " + Arrays.toString(cu));
        replacement[0] = 500;                  // ma trận thấy ngay: hai bên dùng chung một hàng
        System.out.println("m[1][0] = " + m[1][0]);
        int r = 3, c = 4;
        int[][] t = new int[r][c];             // r hàng x c cột, toàn 0
        for (int i = 0; i &lt; t.length; i++)
            for (int j = 0; j &lt; t[i].length; j++)
                t[i][j] = i * 10 + j;
        for (int[] hang : t) {
            for (int v : hang) System.out.printf("%4d", v);
            System.out.println();
        }
        int[][] tamGiac = new int[3][];        // các hàng tạo sau, từng hàng một
        for (int i = 0; i &lt; tamGiac.length; i++) tamGiac[i] = new int[i + 1];
        System.out.println("triangle: " + Arrays.deepToString(tamGiac) + ", println(t) prints " + (t.toString().startsWith("[[I@") ? "[[I@..." : "?"));
    }
}</code></pre>
<div class="out">m.length = 3, row lengths = 4 2 2<br>
after m[1] = replacement: [[1, 2, 3, 4], [5, 6, 7, 8, 9, 10], [2001, 2002]]<br>
m[1] == replacement ? true, old row still [91, 92]<br>
m[1][0] = 500<br>
&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;1 &nbsp;&nbsp;2 &nbsp;&nbsp;3<br>
&nbsp;&nbsp;10 &nbsp;11 &nbsp;12 &nbsp;13<br>
&nbsp;&nbsp;20 &nbsp;21 &nbsp;22 &nbsp;23<br>
triangle: [[0], [0, 0], [0, 0, 0]], println(t) prints [[I@...</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/57e27c93c558d7f53f8e68e84c003a154dc99573.svg" alt="Slide 9 vẽ lại: m trỏ tới bảng các tham chiếu hàng; sau m[1] = replacement hàng cũ {91, 92} thành rác" loading="lazy" /><p class="chu-thich">🧩 Slide 9 vẽ lại: m trỏ tới bảng các tham chiếu hàng; sau m[1] = replacement hàng cũ {91, 92} thành rác</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 9 redrawn — m[1] = replacement swaps a whole row reference
' Sau phép gán không còn gì trỏ tới {91, 92}: nó thành rác
left to right direction
object "m : int[][]" as m
object "int[][3] (row table)" as rows {
  [0] = ref
  [1] = ref
  [2] = ref
}
object "int[4]" as r0 {
  1, 2, 3, 4
}
object "int[2] (old row)" as r1 #FEE2E2 {
  91, 92
}
object "int[2]" as r2 {
  2001, 2002
}
object "replacement : int[]" as rep
object "int[6]" as r3 #ECFDF5 {
  5, 6, 7, 8, 9, 10
}
m --&gt; rows
rows --&gt; r0 : [0]
rows ..&gt; r1 : [1] before
rows --&gt; r3 : [1] after
rows --&gt; r2 : [2]
rep --&gt; r3
note bottom of r1
  no reference left
  -&gt; garbage collector
end note
@enduml</code></pre></details>
<p>Hình trên slide dùng địa chỉ bịa (8000, 100, 200, 500, 1000); sơ đồ trên giữ ý và bỏ con số. Ba hệ quả: hàng dài khác nhau (mảng "răng cưa" — jagged) là bình thường; <code>m.length</code> là số <strong>hàng</strong>, <code>m[i].length</code> là độ dài hàng <code>i</code>; và sau <code>m[1] = replacement</code> thì ma trận và <code>replacement</code> <em>dùng chung</em> một hàng — ghi <code>replacement[0] = 500</code> đã đổi <code>m[1][0]</code>.</p>
<p class="meo">🧠 In mảng 2 chiều bằng <code>Arrays.deepToString(m)</code>; <code>Arrays.toString(m)</code> hay <code>println(m)</code> chỉ in ra địa chỉ kiểu <code>[[I@1b6d3586</code>.</p>`],
      [10, 'Operators',
        `<p class="y-chinh">🎯 The operator table in descending precedence: unary <code>++ -- + - ! ~ (type)</code>; arithmetic <code>* / %</code> then <code>+ -</code>; shift <code>&lt;&lt; &gt;&gt; &gt;&gt;&gt;</code>; comparison <code>&lt; &lt;= &gt; &gt;= instanceof</code> then <code>== !=</code>; bitwise <code>&amp; ^ |</code>; short-circuit <code>&amp;&amp; ||</code>; conditional <code>?:</code>; assignment <code>= op=</code> — "the same as in C".</p>
<p>Corrections to the table: <code>&amp;</code>, <code>^</code> and <code>|</code> are <strong>three</strong> levels (&amp; binds tighter than ^, ^ tighter than |), and <code>&amp;&amp;</code> binds tighter than <code>||</code>; the top level missing from the slide is postfix (<code>a[i]</code>, <code>obj.f</code>, <code>m()</code>, <code>x++</code>). And "same as C" is not quite true: <code>&gt;&gt;&gt;</code> and <code>instanceof</code> exist only in Java, <code>+</code> also joins Strings, and <code>&amp;</code>/<code>|</code> also work on <code>boolean</code> (without short-circuit). The ones that trip beginners, run for real:</p>
<pre class="trich"><code class="language-java">System.out.println("7 / 2 = " + (7 / 2) + "   7 % 2 = " + (7 % 2));
System.out.println("-7 / 2 = " + (-7 / 2) + "  -7 % 2 = " + (-7 % 2));     // truncates toward zero; % keeps the sign of the left side
System.out.println("7.0 / 2 = " + (7.0 / 2) + "  (double) 7 / 2 = " + ((double) 7 / 2) + "  (double) (7 / 2) = " + ((double) (7 / 2)));
System.out.println("1.0 / 0 = " + (1.0 / 0) + "  0.0 / 0 = " + (0.0 / 0));
try {
    System.out.println(1 / 0);
} catch (ArithmeticException e) {
    System.out.println("1 / 0   -&gt; " + e.getMessage());
}</code></pre>
<pre class="trich"><code class="language-java">int x = 0;
boolean an = (x != 0) &amp;&amp; (10 / x &gt; 1);        // right side skipped: no division by zero
System.out.println("(x != 0) &amp;&amp; (10 / x &gt; 1) = " + an);
dem = 0; boolean a1 = false &amp;&amp; ghiNhan();
System.out.println("false &amp;&amp; f() -&gt; f called " + dem + " time(s)");
dem = 0; boolean a2 = false &amp; ghiNhan();
System.out.println("false &amp;  f() -&gt; f called " + dem + " time(s)");</code></pre>
<pre class="trich"><code class="language-java">int i = 5;
i += 2.7;                     // compound assignment casts back to int silently
System.out.println("int i = 5; i += 2.7; -&gt; i = " + i);
int diem = 7;
String ketQua = diem &gt;= 5 ? "pass" : "fail";
System.out.println("diem &gt;= 5 ? \\"pass\\" : \\"fail\\" -&gt; " + ketQua);
Object o = "Hello";
System.out.println("\\"Hello\\" instanceof String = " + (o instanceof String) + ", instanceof Integer = " + (o instanceof Integer));</code></pre>
<div class="out">7 / 2 = 3 &nbsp;&nbsp;7 % 2 = 1<br>
-7 / 2 = -3 &nbsp;-7 % 2 = -1<br>
7.0 / 2 = 3.5 &nbsp;(double) 7 / 2 = 3.5 &nbsp;(double) (7 / 2) = 3.0<br>
1.0 / 0 = Infinity &nbsp;0.0 / 0 = NaN<br>
1 / 0 &nbsp;&nbsp;-&gt; / by zero<br>
(x != 0) &amp;&amp; (10 / x &gt; 1) = false<br>
false &amp;&amp; f() -&gt; f called 0 time(s)<br>
false &amp; &nbsp;f() -&gt; f called 1 time(s)<br>
int i = 5; i += 2.7; -&gt; i = 7<br>
diem &gt;= 5 ? "pass" : "fail" -&gt; pass<br>
"Hello" instanceof String = true, instanceof Integer = false</div>
<p>Integer division drops the fraction (toward zero, so <code>-7 / 2</code> is <code>-3</code>), and <code>%</code> takes the sign of the left operand; <code>(double)(7 / 2)</code> is <code>3.0</code> because the division already happened in <code>int</code>. Integer <code>/ 0</code> throws; floating-point <code>/ 0</code> gives <code>Infinity</code> or <code>NaN</code>. <code>&amp;&amp;</code> skips its right side when the left is <code>false</code> — the guard <code>x != 0 &amp;&amp; 10 / x &gt; 1</code> is safe — while <code>&amp;</code> evaluates both. <code>i += 2.7</code> compiles (and truncates) although <code>i = i + 2.7</code> would not.</p>`,
        `<p class="y-chinh">🎯 Bảng toán tử theo độ ưu tiên giảm dần: một ngôi <code>++ -- + - ! ~ (type)</code>; số học <code>* / %</code> rồi <code>+ -</code>; dịch bit <code>&lt;&lt; &gt;&gt; &gt;&gt;&gt;</code>; so sánh <code>&lt; &lt;= &gt; &gt;= instanceof</code> rồi <code>== !=</code>; bit <code>&amp; ^ |</code>; đoản mạch <code>&amp;&amp; ||</code>; điều kiện <code>?:</code>; gán <code>= op=</code> — "giống C".</p>
<p>Sửa bảng: <code>&amp;</code>, <code>^</code> và <code>|</code> là <strong>ba</strong> mức (&amp; chặt hơn ^, ^ chặt hơn |), và <code>&amp;&amp;</code> chặt hơn <code>||</code>; mức cao nhất mà slide thiếu là hậu tố (<code>a[i]</code>, <code>obj.f</code>, <code>m()</code>, <code>x++</code>). Và "giống C" chưa hẳn đúng: <code>&gt;&gt;&gt;</code> và <code>instanceof</code> chỉ Java có, <code>+</code> còn dùng để nối String, và <code>&amp;</code>/<code>|</code> cũng dùng được cho <code>boolean</code> (không đoản mạch). Những toán tử hay làm người mới vấp, chạy thật:</p>
<pre class="trich"><code class="language-java">System.out.println("7 / 2 = " + (7 / 2) + "   7 % 2 = " + (7 % 2));
System.out.println("-7 / 2 = " + (-7 / 2) + "  -7 % 2 = " + (-7 % 2));     // cắt về phía 0; % mang dấu của vế trái
System.out.println("7.0 / 2 = " + (7.0 / 2) + "  (double) 7 / 2 = " + ((double) 7 / 2) + "  (double) (7 / 2) = " + ((double) (7 / 2)));
System.out.println("1.0 / 0 = " + (1.0 / 0) + "  0.0 / 0 = " + (0.0 / 0));
try {
    System.out.println(1 / 0);
} catch (ArithmeticException e) {
    System.out.println("1 / 0   -&gt; " + e.getMessage());
}</code></pre>
<pre class="trich"><code class="language-java">int x = 0;
boolean an = (x != 0) &amp;&amp; (10 / x &gt; 1);        // vế phải bị bỏ qua: không chia cho 0
System.out.println("(x != 0) &amp;&amp; (10 / x &gt; 1) = " + an);
dem = 0; boolean a1 = false &amp;&amp; ghiNhan();
System.out.println("false &amp;&amp; f() -&gt; f called " + dem + " time(s)");
dem = 0; boolean a2 = false &amp; ghiNhan();
System.out.println("false &amp;  f() -&gt; f called " + dem + " time(s)");</code></pre>
<pre class="trich"><code class="language-java">int i = 5;
i += 2.7;                     // gán kết hợp tự ép về int, im lặng
System.out.println("int i = 5; i += 2.7; -&gt; i = " + i);
int diem = 7;
String ketQua = diem &gt;= 5 ? "pass" : "fail";
System.out.println("diem &gt;= 5 ? \\"pass\\" : \\"fail\\" -&gt; " + ketQua);
Object o = "Hello";
System.out.println("\\"Hello\\" instanceof String = " + (o instanceof String) + ", instanceof Integer = " + (o instanceof Integer));</code></pre>
<div class="out">7 / 2 = 3 &nbsp;&nbsp;7 % 2 = 1<br>
-7 / 2 = -3 &nbsp;-7 % 2 = -1<br>
7.0 / 2 = 3.5 &nbsp;(double) 7 / 2 = 3.5 &nbsp;(double) (7 / 2) = 3.0<br>
1.0 / 0 = Infinity &nbsp;0.0 / 0 = NaN<br>
1 / 0 &nbsp;&nbsp;-&gt; / by zero<br>
(x != 0) &amp;&amp; (10 / x &gt; 1) = false<br>
false &amp;&amp; f() -&gt; f called 0 time(s)<br>
false &amp; &nbsp;f() -&gt; f called 1 time(s)<br>
int i = 5; i += 2.7; -&gt; i = 7<br>
diem &gt;= 5 ? "pass" : "fail" -&gt; pass<br>
"Hello" instanceof String = true, instanceof Integer = false</div>
<p>Chia số nguyên bỏ phần lẻ (cắt về phía 0, nên <code>-7 / 2</code> là <code>-3</code>), và <code>%</code> mang dấu của toán hạng trái; <code>(double)(7 / 2)</code> là <code>3.0</code> vì phép chia đã xảy ra trong <code>int</code>. Số nguyên <code>/ 0</code> ném ngoại lệ; số thực <code>/ 0</code> cho <code>Infinity</code> hoặc <code>NaN</code>. <code>&amp;&amp;</code> bỏ qua vế phải khi vế trái là <code>false</code> — lá chắn <code>x != 0 &amp;&amp; 10 / x &gt; 1</code> an toàn — còn <code>&amp;</code> tính cả hai vế. <code>i += 2.7</code> biên dịch được (và cắt phần lẻ) trong khi <code>i = i + 2.7</code> thì không.</p>`],
      [11, 'Using Operators Demonstration',
        `<p class="y-chinh">🎯 The demo program <code>UseOps</code>: shift <code>-1</code> left, right and unsigned-right by one, combine <code>3</code> and <code>4</code> with <code>|</code>, <code>&amp;</code>, <code>^</code>, and test <code>"Hello" instanceof String</code>.</p>
<pre class="trich"><code class="language-java">int x = -1;
System.out.println("-1&lt;&lt;1: " + (x &lt;&lt; 1));
System.out.println("-1&gt;&gt;1: " + (x &gt;&gt; 1));
System.out.println("-1&gt;&gt;&gt;1: " + (x &gt;&gt;&gt; 1));
System.out.println("3|4: " + (3 | 4));
System.out.println("3&amp;4: " + (3 &amp; 4));
System.out.println("3^4: " + (3 ^ 4));
String S = "Hello";
boolean result = S instanceof String;
System.out.println("Hello is an instance of String: " + result);</code></pre>
<p>Same code as the slide's screenshot (the file adds a second part, explained on slide 12). Predict each line before you look at the output on the next slide: that is exactly how FE "what is printed?" questions on operators are built.</p>
<p><code>instanceof</code> answers "is this object of that class (or a subclass)?": it returns <code>true</code> here because <code>S</code> really refers to a <code>String</code>. You will use it a lot in Chapter 4 (polymorphism) before a cast; <code>null instanceof String</code> is always <code>false</code>.</p>
<p class="meo">🧠 Read <code>x &lt;&lt; n</code> as "multiply by 2<sup>n</sup>" and <code>x &gt;&gt; n</code> as "divide by 2<sup>n</sup>, rounding down" — <code>1 &lt;&lt; 10</code> is 1024.</p>`,
        `<p class="y-chinh">🎯 Chương trình demo <code>UseOps</code>: dịch <code>-1</code> sang trái, sang phải và sang phải không dấu một bit, kết hợp <code>3</code> và <code>4</code> bằng <code>|</code>, <code>&amp;</code>, <code>^</code>, và thử <code>"Hello" instanceof String</code>.</p>
<pre class="trich"><code class="language-java">int x = -1;
System.out.println("-1&lt;&lt;1: " + (x &lt;&lt; 1));
System.out.println("-1&gt;&gt;1: " + (x &gt;&gt; 1));
System.out.println("-1&gt;&gt;&gt;1: " + (x &gt;&gt;&gt; 1));
System.out.println("3|4: " + (3 | 4));
System.out.println("3&amp;4: " + (3 &amp; 4));
System.out.println("3^4: " + (3 ^ 4));
String S = "Hello";
boolean result = S instanceof String;
System.out.println("Hello is an instance of String: " + result);</code></pre>
<p>Code y như ảnh chụp của slide (file có thêm phần thứ hai, giảng ở slide 12). Hãy đoán từng dòng trước khi xem output ở slide sau: đó chính là cách câu FE "in ra gì?" về toán tử được ra đề.</p>
<p><code>instanceof</code> trả lời câu hỏi "đối tượng này có thuộc lớp kia (hoặc lớp con) không?": ở đây nó trả <code>true</code> vì <code>S</code> thật sự trỏ tới một <code>String</code>. Bạn sẽ dùng nó nhiều ở Chương 4 (đa hình) trước khi ép kiểu; <code>null instanceof String</code> luôn là <code>false</code>.</p>
<p class="meo">🧠 Đọc <code>x &lt;&lt; n</code> là "nhân 2<sup>n</sup>" và <code>x &gt;&gt; n</code> là "chia 2<sup>n</sup>, làm tròn xuống" — <code>1 &lt;&lt; 10</code> bằng 1024.</p>`],
      [12, 'Using Operators Demonstration',
        `<p class="y-chinh">🎯 The output (<code>-2</code>, <code>-1</code>, <code>2147483647</code>, <code>7</code>, <code>0</code>, <code>7</code>, <code>true</code>) explained bit by bit: <code>-1</code> is all ones in two's complement; <code>&lt;&lt;1</code> shifts in a 0; <code>&gt;&gt;1</code> copies the sign bit; <code>&gt;&gt;&gt;1</code> shifts in a 0, making the number positive.</p>
<div class="out">-1&lt;&lt;1: -2<br>
-1&gt;&gt;1: -1<br>
-1&gt;&gt;&gt;1: 2147483647<br>
3|4: 7<br>
3&amp;4: 0<br>
3^4: 7<br>
Hello is an instance of String: true<br>
-- the same values, all 32 bits of an int --<br>
&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;0000 0000 0000 0000 0000 0000 0000 0001 &nbsp;= 1<br>
&nbsp;~1 &nbsp;&nbsp;&nbsp;1111 1111 1111 1111 1111 1111 1111 1110 &nbsp;= -2<br>
-1 &nbsp;&nbsp;&nbsp;&nbsp;1111 1111 1111 1111 1111 1111 1111 1111 &nbsp;= -1<br>
-1&lt;&lt;1 &nbsp;1111 1111 1111 1111 1111 1111 1111 1110 &nbsp;= -2<br>
-1&gt;&gt;1 &nbsp;1111 1111 1111 1111 1111 1111 1111 1111 &nbsp;= -1<br>
-1&gt;&gt;&gt;1 0111 1111 1111 1111 1111 1111 1111 1111 &nbsp;= 2147483647<br>
&nbsp;3|4 &nbsp;&nbsp;0000 0000 0000 0000 0000 0000 0000 0111 &nbsp;= 7<br>
~5 = -6 &nbsp;&nbsp;8 &gt;&gt; 1 = 4 &nbsp;&nbsp;1 &lt;&lt; 10 = 1024</div>
<p>⚠️ The slide is wrong in one place: its box says "Use 2 bytes to store value" and draws 16 bits. An <code>int</code> has <strong>32 bits</strong> (4 bytes, slide 4). With 16 bits, <code>0111 1111 1111 1111</code> would be 32767, not 2147483647 — the number the real run prints. The second half of the output above shows all 32 bits, built with <code>Integer.toBinaryString</code>:</p>
<pre class="trich"><code class="language-java">System.out.println("-- the same values, all 32 bits of an int --");
in32(" 1     ", 1);
in32(" ~1    ", ~1);
in32("-1     ", -1);
in32("-1&lt;&lt;1  ", -1 &lt;&lt; 1);
in32("-1&gt;&gt;1  ", -1 &gt;&gt; 1);
in32("-1&gt;&gt;&gt;1 ", -1 &gt;&gt;&gt; 1);
in32(" 3|4   ", 3 | 4);
System.out.println("~5 = " + (~5) + "   8 &gt;&gt; 1 = " + (8 &gt;&gt; 1) + "   1 &lt;&lt; 10 = " + (1 &lt;&lt; 10));</code></pre>
<p>Two's complement in one rule: <code>-x</code> equals <code>~x + 1</code> (flip every bit, add one) — so <code>~5</code> is <code>-6</code>. <code>3 | 4</code> sets the bits that are 1 in either (011 | 100 = 111 = 7); <code>3 &amp; 4</code> keeps the bits that are 1 in both (none = 0); <code>3 ^ 4</code> keeps the bits that differ (also 7 here).</p>
<div class="pitfall">FE trap: <code>-1 &gt;&gt; 1</code> is <code>-1</code> (not 0, not a huge number); <code>-1 &gt;&gt;&gt; 1</code> is <code>2147483647</code> for an <code>int</code> — and for a <code>long</code> it would be 9223372036854775807.</div>`,
        `<p class="y-chinh">🎯 Output (<code>-2</code>, <code>-1</code>, <code>2147483647</code>, <code>7</code>, <code>0</code>, <code>7</code>, <code>true</code>) được giải thích từng bit: <code>-1</code> là toàn bit 1 theo bù hai (two's complement); <code>&lt;&lt;1</code> đẩy vào một bit 0; <code>&gt;&gt;1</code> chép bit dấu; <code>&gt;&gt;&gt;1</code> đẩy vào bit 0, làm số thành dương.</p>
<div class="out">-1&lt;&lt;1: -2<br>
-1&gt;&gt;1: -1<br>
-1&gt;&gt;&gt;1: 2147483647<br>
3|4: 7<br>
3&amp;4: 0<br>
3^4: 7<br>
Hello is an instance of String: true<br>
-- the same values, all 32 bits of an int --<br>
&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;0000 0000 0000 0000 0000 0000 0000 0001 &nbsp;= 1<br>
&nbsp;~1 &nbsp;&nbsp;&nbsp;1111 1111 1111 1111 1111 1111 1111 1110 &nbsp;= -2<br>
-1 &nbsp;&nbsp;&nbsp;&nbsp;1111 1111 1111 1111 1111 1111 1111 1111 &nbsp;= -1<br>
-1&lt;&lt;1 &nbsp;1111 1111 1111 1111 1111 1111 1111 1110 &nbsp;= -2<br>
-1&gt;&gt;1 &nbsp;1111 1111 1111 1111 1111 1111 1111 1111 &nbsp;= -1<br>
-1&gt;&gt;&gt;1 0111 1111 1111 1111 1111 1111 1111 1111 &nbsp;= 2147483647<br>
&nbsp;3|4 &nbsp;&nbsp;0000 0000 0000 0000 0000 0000 0000 0111 &nbsp;= 7<br>
~5 = -6 &nbsp;&nbsp;8 &gt;&gt; 1 = 4 &nbsp;&nbsp;1 &lt;&lt; 10 = 1024</div>
<p>⚠️ Slide sai một chỗ: hộp chữ ghi "Use 2 bytes to store value" và vẽ 16 bit. Một <code>int</code> có <strong>32 bit</strong> (4 byte, slide 4). Nếu chỉ 16 bit thì <code>0111 1111 1111 1111</code> là 32767, không phải 2147483647 — con số mà lần chạy thật in ra. Nửa sau của output trên hiện đủ 32 bit, dựng bằng <code>Integer.toBinaryString</code>:</p>
<pre class="trich"><code class="language-java">System.out.println("-- the same values, all 32 bits of an int --");
in32(" 1     ", 1);
in32(" ~1    ", ~1);
in32("-1     ", -1);
in32("-1&lt;&lt;1  ", -1 &lt;&lt; 1);
in32("-1&gt;&gt;1  ", -1 &gt;&gt; 1);
in32("-1&gt;&gt;&gt;1 ", -1 &gt;&gt;&gt; 1);
in32(" 3|4   ", 3 | 4);
System.out.println("~5 = " + (~5) + "   8 &gt;&gt; 1 = " + (8 &gt;&gt; 1) + "   1 &lt;&lt; 10 = " + (1 &lt;&lt; 10));</code></pre>
<p>Bù hai trong một luật: <code>-x</code> bằng <code>~x + 1</code> (lật mọi bit rồi cộng một) — nên <code>~5</code> là <code>-6</code>. <code>3 | 4</code> bật các bit bằng 1 ở ít nhất một bên (011 | 100 = 111 = 7); <code>3 &amp; 4</code> giữ các bit bằng 1 ở cả hai bên (không có = 0); <code>3 ^ 4</code> giữ các bit khác nhau (ở đây cũng là 7).</p>
<div class="pitfall">Bẫy FE: <code>-1 &gt;&gt; 1</code> là <code>-1</code> (không phải 0, không phải số khổng lồ); <code>-1 &gt;&gt;&gt; 1</code> là <code>2147483647</code> với <code>int</code> — còn với <code>long</code> sẽ là 9223372036854775807.</div>`],
      [13, 'Literals and Value Variables',
        `<p class="y-chinh">🎯 Literals: a character <code>'a'</code>; a String <code>"Hello"</code>; integers <code>28</code>, <code>0x1c</code>, <code>0X1A</code> (type <code>int</code> by default) and <code>123l</code>, <code>123L</code> (<code>long</code>); floating point <code>1.234</code> (<code>double</code> by default), <code>1.3f</code>/<code>1.3F</code>, <code>1.3E+21</code>, <code>1.3d</code>/<code>1.3D</code>; a <strong>value variable</strong> such as <code>int n = 10</code> keeps 10 itself on the stack.</p>
<pre><code class="language-java">// release: 8
// Slide 13: literals — integer bases, long/float/double suffixes, characters and escape sequences
public class HangSo {
    public static void main(String[] args) {
        System.out.println("28 = " + 28 + ", 0x1c = " + 0x1c + ", 0X1A = " + 0X1A);
        System.out.println("034 = " + 034 + "   (leading 0 = OCTAL!)");
        System.out.println("0b1010 = " + 0b1010 + ", 1_000_000 = " + 1_000_000);   // Java 7+
        long l = 123L;
        float f = 1.3f;
        double d = 1.234, e = 1.3E+21, dd = 1.3d;
        System.out.println("123L = " + l + ", 1.3f = " + f + ", 1.234 = " + d + ", 1.3E+21 = " + e + ", 1.3d = " + dd);
        System.out.println("0.1 + 0.2 = " + (0.1 + 0.2) + "   0.1f + 0.2f = " + (0.1f + 0.2f));
        char c = 'a';
        String S = "Hello";
        System.out.println("char 'a' = " + c + ", code " + (int) c + "; String S = " + S);
        System.out.println("tab:[\\t] quote:[\\"] apostrophe:[\\'] backslash:[\\\\] unicode \\\\u0041:[\\u0041]");
        System.out.println("line 1\\nline 2");
    }
}</code></pre>
<div class="out">28 = 28, 0x1c = 28, 0X1A = 26<br>
034 = 28 &nbsp;&nbsp;(leading 0 = OCTAL!)<br>
0b1010 = 10, 1_000_000 = 1000000<br>
123L = 123, 1.3f = 1.3, 1.234 = 1.234, 1.3E+21 = 1.3E21, 1.3d = 1.3<br>
0.1 + 0.2 = 0.30000000000000004 &nbsp;&nbsp;0.1f + 0.2f = 0.3<br>
char 'a' = a, code 97; String S = Hello<br>
tab:[	] quote:["] apostrophe:['] backslash:[\\] unicode \\u0041:[A]<br>
line 1<br>
line 2</div>
<p>The slide's "Escape sequences: see the page 10" points to a page that is not in the deck; here they are: <code>\\t</code> tab, <code>\\n</code> new line, <code>\\"</code> double quote, <code>\\'</code> single quote, <code>\\\\</code> backslash, <code>\\uXXXX</code> a Unicode character (also <code>\\r</code>, <code>\\b</code>, <code>\\f</code>). ➕ Missing from the slide: a leading <code>0</code> means <strong>octal</strong> (<code>034</code> is 28), Java 7 added binary <code>0b1010</code> and underscores <code>1_000_000</code>.</p>
<p>Write <code>L</code>, never <code>l</code> — <code>123l</code> looks like 1231. And <code>0.1 + 0.2</code> is not exactly <code>0.3</code> in binary floating point: never compare money or grades with <code>==</code> on <code>double</code>.</p>
<div class="pitfall">FE trap: <code>float f = 3.4;</code> does not compile — <code>3.4</code> is a <code>double</code> literal; write <code>3.4f</code> or cast (slide 20 shows the real error message).</div>`,
        `<p class="y-chinh">🎯 Literal (hằng viết thẳng trong code): ký tự <code>'a'</code>; String <code>"Hello"</code>; số nguyên <code>28</code>, <code>0x1c</code>, <code>0X1A</code> (mặc định kiểu <code>int</code>) và <code>123l</code>, <code>123L</code> (<code>long</code>); số thực <code>1.234</code> (mặc định <code>double</code>), <code>1.3f</code>/<code>1.3F</code>, <code>1.3E+21</code>, <code>1.3d</code>/<code>1.3D</code>; <strong>biến giá trị</strong> như <code>int n = 10</code> giữ chính số 10 trên stack.</p>
<pre><code class="language-java">// release: 8
// Slide 13: hằng (literal) — cơ số số nguyên, hậu tố long/float/double, ký tự và chuỗi thoát
public class HangSo {
    public static void main(String[] args) {
        System.out.println("28 = " + 28 + ", 0x1c = " + 0x1c + ", 0X1A = " + 0X1A);
        System.out.println("034 = " + 034 + "   (leading 0 = OCTAL!)");
        System.out.println("0b1010 = " + 0b1010 + ", 1_000_000 = " + 1_000_000);   // từ Java 7
        long l = 123L;
        float f = 1.3f;
        double d = 1.234, e = 1.3E+21, dd = 1.3d;
        System.out.println("123L = " + l + ", 1.3f = " + f + ", 1.234 = " + d + ", 1.3E+21 = " + e + ", 1.3d = " + dd);
        System.out.println("0.1 + 0.2 = " + (0.1 + 0.2) + "   0.1f + 0.2f = " + (0.1f + 0.2f));
        char c = 'a';
        String S = "Hello";
        System.out.println("char 'a' = " + c + ", code " + (int) c + "; String S = " + S);
        System.out.println("tab:[\\t] quote:[\\"] apostrophe:[\\'] backslash:[\\\\] unicode \\\\u0041:[\\u0041]");
        System.out.println("line 1\\nline 2");
    }
}</code></pre>
<div class="out">28 = 28, 0x1c = 28, 0X1A = 26<br>
034 = 28 &nbsp;&nbsp;(leading 0 = OCTAL!)<br>
0b1010 = 10, 1_000_000 = 1000000<br>
123L = 123, 1.3f = 1.3, 1.234 = 1.234, 1.3E+21 = 1.3E21, 1.3d = 1.3<br>
0.1 + 0.2 = 0.30000000000000004 &nbsp;&nbsp;0.1f + 0.2f = 0.3<br>
char 'a' = a, code 97; String S = Hello<br>
tab:[	] quote:["] apostrophe:['] backslash:[\\] unicode \\u0041:[A]<br>
line 1<br>
line 2</div>
<p>Slide ghi "Escape sequences: see the page 10" (chuỗi thoát: xem trang 10) — trang đó không có trong bộ slide; đây là chúng: <code>\\t</code> tab, <code>\\n</code> xuống dòng, <code>\\"</code> ngoặc kép, <code>\\'</code> nháy đơn, <code>\\\\</code> dấu gạch chéo ngược, <code>\\uXXXX</code> một ký tự Unicode (còn <code>\\r</code>, <code>\\b</code>, <code>\\f</code>). ➕ Slide thiếu: số <code>0</code> ở đầu nghĩa là <strong>bát phân</strong> (<code>034</code> là 28), Java 7 thêm số nhị phân <code>0b1010</code> và dấu gạch dưới <code>1_000_000</code>.</p>
<p>Viết <code>L</code>, đừng viết <code>l</code> — <code>123l</code> trông như 1231. Và <code>0.1 + 0.2</code> không đúng bằng <code>0.3</code> trong số thực nhị phân: đừng bao giờ so tiền hay điểm bằng <code>==</code> trên <code>double</code>.</p>
<div class="pitfall">Bẫy FE: <code>float f = 3.4;</code> không biên dịch được — <code>3.4</code> là literal <code>double</code>; viết <code>3.4f</code> hoặc ép kiểu (slide 20 cho xem thông báo lỗi thật).</div>`],
      [14, 'Java Expressions',
        `<p class="y-chinh">🎯 Java is expression-oriented; a simple expression is a constant (<code>7</code>, <code>false</code>), a char literal (<code>'A'</code>), a String literal (<code>"foo"</code>), the name of a declared variable (<code>x</code>), or such expressions combined with operators: <code>i++</code>, <code>x + 2</code>, <code>(x + 2)</code>.</p>
<p>Two small corrections: the slide calls <code>i++</code> a "binary operator" — it is a <strong>unary</strong> (postfix) operator with one operand; "two|one" was meant as "two (binary) or one (unary)". The quotes on the slide (<code>'3‘</code>, <code>"foo“</code>) are curly quotes from PowerPoint: typed into NetBeans they do not compile.</p>
<p>What makes something an expression is that it has a <strong>value and a type</strong>: <code>x + 2</code> is an <code>int</code>, <code>x &gt; 2</code> is a <code>boolean</code>, <code>"a" + 1</code> is a <code>String</code>, and even an assignment <code>b = 0</code> is an expression whose value is 0 — slide 16 depends on that. A statement is an expression (or declaration) followed by <code>;</code>.</p>
<div class="pitfall">FE trap: <code>if (yob)</code> with <code>int yob</code> does not compile in Java — a condition must be a <code>boolean</code> expression, unlike C where any number works.</div>`,
        `<p class="y-chinh">🎯 Java là ngôn ngữ hướng biểu thức (expression-oriented); một biểu thức đơn giản là một hằng (<code>7</code>, <code>false</code>), một literal ký tự (<code>'A'</code>), một literal String (<code>"foo"</code>), tên một biến đã khai báo (<code>x</code>), hoặc các biểu thức đó kết hợp bằng toán tử: <code>i++</code>, <code>x + 2</code>, <code>(x + 2)</code>.</p>
<p>Hai chỗ sửa nhỏ: slide gọi <code>i++</code> là "toán tử hai ngôi (binary)" — thật ra nó là toán tử <strong>một ngôi</strong> (hậu tố) chỉ có một toán hạng; "two|one" ý là "hai (hai ngôi) hoặc một (một ngôi)". Dấu nháy trên slide (<code>'3‘</code>, <code>"foo“</code>) là nháy cong của PowerPoint: gõ vào NetBeans sẽ không biên dịch được.</p>
<p>Thứ làm nên một biểu thức là nó có <strong>giá trị và kiểu</strong>: <code>x + 2</code> là <code>int</code>, <code>x &gt; 2</code> là <code>boolean</code>, <code>"a" + 1</code> là <code>String</code>, và kể cả phép gán <code>b = 0</code> cũng là biểu thức có giá trị 0 — slide 16 dựa vào điều đó. Câu lệnh là một biểu thức (hoặc khai báo) kèm dấu <code>;</code>.</p>
<div class="pitfall">Bẫy FE: <code>if (yob)</code> với <code>int yob</code> không biên dịch được trong Java — điều kiện phải là biểu thức <code>boolean</code>, khác C nơi số nào cũng được.</div>`],
      [15, 'Evaluating Expressions and Operator Precedence',
        `<p class="y-chinh">🎯 The compiler evaluates such expressions from the innermost to the outermost parentheses, left to right: with <code>x = 1, y = 2, z = 3</code>, <code>((8 * (y + z)) + y) * x</code> becomes <code>((8 * 5) + y) * x</code> → <code>(40 + y) * x</code> → <code>42 * x</code> → <code>42</code>.</p>
<pre class="trich"><code class="language-java">int x = 1; int y = 2; int z = 3;
int answer = ((8 * (y + z)) + y) * x;
System.out.println("((8 * (y + z)) + y) * x = " + answer);
System.out.println("8 * y + z + y * x       = " + (8 * y + z + y * x) + "   (no parentheses: * before +)");</code></pre>
<p>The two first lines of the run on slide 16 confirm 42, and show that without parentheses the same numbers give 21, because <code>*</code> binds tighter than <code>+</code>. Parentheses only <strong>group</strong>; they do not change the order in which Java reads operands.</p>
<p>➕ More precise than the slide: the Java Language Specification (§15.7) guarantees that <strong>operands are evaluated left to right</strong> — the left operand of a binary operator completely before the right one — and precedence then decides how the values are combined. In C the order of evaluating operands is unspecified; in Java it is fixed, which is why the strange expressions on slide 16 have one correct answer.</p>
<p class="meo">🧠 In the exam, rewrite a dense expression step by step on paper, exactly like the yellow box on the slide.</p>`,
        `<p class="y-chinh">🎯 Trình biên dịch tính các biểu thức như vậy từ ngoặc trong cùng ra ngoặc ngoài cùng, từ trái sang phải: với <code>x = 1, y = 2, z = 3</code>, <code>((8 * (y + z)) + y) * x</code> thành <code>((8 * 5) + y) * x</code> → <code>(40 + y) * x</code> → <code>42 * x</code> → <code>42</code>.</p>
<pre class="trich"><code class="language-java">int x = 1; int y = 2; int z = 3;
int answer = ((8 * (y + z)) + y) * x;
System.out.println("((8 * (y + z)) + y) * x = " + answer);
System.out.println("8 * y + z + y * x       = " + (8 * y + z + y * x) + "   (no parentheses: * before +)");</code></pre>
<p>Hai dòng đầu của lần chạy ở slide 16 xác nhận 42, và cho thấy bỏ ngoặc thì cùng các số đó ra 21, vì <code>*</code> chặt hơn <code>+</code>. Dấu ngoặc chỉ <strong>gom nhóm</strong>; nó không đổi thứ tự Java đọc các toán hạng.</p>
<p>➕ Chính xác hơn slide: Đặc tả ngôn ngữ Java (JLS §15.7) bảo đảm <strong>các toán hạng được tính từ trái sang phải</strong> — toán hạng trái của toán tử hai ngôi được tính xong hẳn trước toán hạng phải — rồi độ ưu tiên quyết định cách ghép các giá trị. Trong C thứ tự tính toán hạng là không xác định; trong Java nó cố định, nên các biểu thức kỳ quặc ở slide 16 có đúng một đáp án.</p>
<p class="meo">🧠 Trong giờ thi, viết lại biểu thức dày đặc từng bước ra giấy, y như hộp vàng trên slide.</p>`],
      [16, 'Operator Precedence- Evaluation Order',
        `<p class="y-chinh">🎯 <code>UseOps_2</code>: with <code>int[] a = {4, 4}; int b = 1;</code> the statement <code>a[b] = b = 0;</code> prints <code>a: 4,0</code> — first <code>[ ]</code> locates <code>a[b]</code> = <code>a[1]</code>, then <code>=</code> (from the right) does <code>b = 0</code>, which returns 0, so <code>a[1] = 0</code>.</p>
<pre class="trich"><code class="language-java">int[] a = {4, 4};
int b = 1;
a[b] = b = 0;                 // a[b] is located FIRST (a[1]), then b = 0, then a[1] = 0
System.out.println("a: " + a[0] + "," + a[1]);</code></pre>
<pre class="trich"><code class="language-java">int i = 5;
int p = i++;                  // use, then add
int q = ++i;                  // add, then use
System.out.println("p = i++ -&gt; " + p + ",  q = ++i -&gt; " + q + ",  i = " + i);
int k = 1;
k = k++;                      // classic trap: the old value is written back
System.out.println("k = k++  -&gt; k = " + k);
int j = 1;
int r = j + j++ + ++j;        // 1 + 1 + 3, strictly left to right
System.out.println("j + j++ + ++j -&gt; " + r + ", j = " + j);
int s = 10;
s -= s++ - --s;               // left operand s is read first (10)
System.out.println("s -= s++ - --s -&gt; s = " + s);</code></pre>
<div class="out">((8 * (y + z)) + y) * x = 42<br>
8 * y + z + y * x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 21 &nbsp;&nbsp;(no parentheses: * before +)<br>
a: 4,0<br>
p = i++ -&gt; 5, &nbsp;q = ++i -&gt; 7, &nbsp;i = 7<br>
k = k++ &nbsp;-&gt; k = 1<br>
j + j++ + ++j -&gt; 5, j = 3<br>
s -= s++ - --s -&gt; s = 10</div>
<p>The slide's explanation is right and comes from JLS §15.26.1: in an array assignment the array reference and the <strong>index are evaluated first</strong>, then the right-hand side. So the <code>b</code> inside <code>a[b]</code> is read while it is still 1. The extra lines are the classic increment questions: <code>i++</code> gives the old value, <code>++i</code> the new one; <code>k = k++</code> leaves <code>k</code> unchanged (the old value 1 is written back over the incremented 2); <code>j + j++ + ++j</code> is 1 + 1 + 3 = 5 because each operand is read left to right.</p>
<div class="pitfall">PE/LAB211 advice: never write <code>k = k++</code> or two <code>++</code> on the same variable in one expression in real code — only FE asks you to read it.</div>`,
        `<p class="y-chinh">🎯 <code>UseOps_2</code>: với <code>int[] a = {4, 4}; int b = 1;</code> câu lệnh <code>a[b] = b = 0;</code> in ra <code>a: 4,0</code> — trước hết <code>[ ]</code> xác định <code>a[b]</code> = <code>a[1]</code>, rồi <code>=</code> (từ phải sang) làm <code>b = 0</code>, trả về 0, nên <code>a[1] = 0</code>.</p>
<pre class="trich"><code class="language-java">int[] a = {4, 4};
int b = 1;
a[b] = b = 0;                 // a[b] được xác định TRƯỚC (a[1]), rồi b = 0, rồi a[1] = 0
System.out.println("a: " + a[0] + "," + a[1]);</code></pre>
<pre class="trich"><code class="language-java">int i = 5;
int p = i++;                  // dùng rồi mới cộng
int q = ++i;                  // cộng rồi mới dùng
System.out.println("p = i++ -&gt; " + p + ",  q = ++i -&gt; " + q + ",  i = " + i);
int k = 1;
k = k++;                      // bẫy kinh điển: giá trị cũ được ghi đè lại
System.out.println("k = k++  -&gt; k = " + k);
int j = 1;
int r = j + j++ + ++j;        // 1 + 1 + 3, đúng trái sang phải
System.out.println("j + j++ + ++j -&gt; " + r + ", j = " + j);
int s = 10;
s -= s++ - --s;               // toán hạng trái s được đọc trước (10)
System.out.println("s -= s++ - --s -&gt; s = " + s);</code></pre>
<div class="out">((8 * (y + z)) + y) * x = 42<br>
8 * y + z + y * x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 21 &nbsp;&nbsp;(no parentheses: * before +)<br>
a: 4,0<br>
p = i++ -&gt; 5, &nbsp;q = ++i -&gt; 7, &nbsp;i = 7<br>
k = k++ &nbsp;-&gt; k = 1<br>
j + j++ + ++j -&gt; 5, j = 3<br>
s -= s++ - --s -&gt; s = 10</div>
<p>Lời giải của slide đúng và bắt nguồn từ JLS §15.26.1: trong phép gán phần tử mảng, tham chiếu mảng và <strong>chỉ số được tính trước</strong>, rồi mới tới vế phải. Nên chữ <code>b</code> trong <code>a[b]</code> được đọc lúc nó vẫn là 1. Các dòng thêm là các câu hỏi tăng/giảm kinh điển: <code>i++</code> cho giá trị cũ, <code>++i</code> cho giá trị mới; <code>k = k++</code> để <code>k</code> không đổi (giá trị cũ 1 được ghi đè lên số 2 vừa tăng); <code>j + j++ + ++j</code> là 1 + 1 + 3 = 5 vì mỗi toán hạng được đọc từ trái sang phải.</p>
<div class="pitfall">Lời khuyên PE/LAB211: trong code thật đừng bao giờ viết <code>k = k++</code> hay hai lần <code>++</code> trên cùng một biến trong một biểu thức — chỉ FE mới bắt bạn đọc nó.</div>`],
      [17, 'Basic Constructs',
        `<p class="y-chinh">🎯 The basic constructs are taken from C: selection (<code>if</code>, <code>if … else</code>, <code>switch (char/int exp) … case … default …</code>) and loops (<code>for</code>, <code>do … while</code>, <code>while</code>).</p>
<pre class="trich"><code class="language-java">String lenh = "add";
switch (lenh) {               // String in switch: Java 7+
    case "add":  System.out.println("switch: adding");
    case "list": System.out.println("switch: listing   &lt;- fell through, no break above");
                 break;
    default:     System.out.println("switch: unknown");
}
char loai = 'B';
switch (loai) {
    case 'A': case 'B': System.out.println("switch char: good"); break;
    default:            System.out.println("switch char: other");
}</code></pre>
<pre class="trich"><code class="language-java">int tong = 0, n = 0;
do {
    n++;
    if (n % 2 == 0) continue; // skip even numbers
    tong += n;
} while (n &lt; 9);
System.out.println("do-while, sum of odd 1..9 = " + tong);
ngoai:
for (int i = 1; i &lt;= 3; i++) {
    for (int j = 1; j &lt;= 3; j++) {
        if (i * j == 4) { System.out.println("labelled break at i=" + i + ", j=" + j); break ngoai; }
    }
}</code></pre>
<p>(The output is shown on slide 18, after the Chao part.) ⚠️ "<code>switch (char/int exp)</code>" is out of date: since Java 7 a switch also works on a <strong>String</strong>, and it always accepted <code>byte</code>, <code>short</code>, <code>char</code>, <code>int</code>, their wrapper classes and <code>enum</code> (JLS §14.11) — never <code>long</code>, <code>double</code> or <code>boolean</code>. Without <code>break</code> the execution "falls through" into the next case, exactly as in C: "add" printed two lines.</p>
<p>Two more Java-only tools: <code>continue</code> skips to the next turn, and a <strong>labelled break</strong> (<code>break ngoai;</code>) leaves both nested loops at once — there is no <code>goto</code>. ➕ Java 14 added <code>switch</code> expressions with <code>case "add" -&gt;</code>; they do not compile on the exam's JDK 8.</p>`,
        `<p class="y-chinh">🎯 Các cấu trúc cơ bản lấy từ C: rẽ nhánh (<code>if</code>, <code>if … else</code>, <code>switch (biểu thức char/int) … case … default …</code>) và vòng lặp (<code>for</code>, <code>do … while</code>, <code>while</code>).</p>
<pre class="trich"><code class="language-java">String lenh = "add";
switch (lenh) {               // switch trên String: từ Java 7
    case "add":  System.out.println("switch: adding");
    case "list": System.out.println("switch: listing   &lt;- fell through, no break above");
                 break;
    default:     System.out.println("switch: unknown");
}
char loai = 'B';
switch (loai) {
    case 'A': case 'B': System.out.println("switch char: good"); break;
    default:            System.out.println("switch char: other");
}</code></pre>
<pre class="trich"><code class="language-java">int tong = 0, n = 0;
do {
    n++;
    if (n % 2 == 0) continue; // bỏ số chẵn
    tong += n;
} while (n &lt; 9);
System.out.println("do-while, sum of odd 1..9 = " + tong);
ngoai:
for (int i = 1; i &lt;= 3; i++) {
    for (int j = 1; j &lt;= 3; j++) {
        if (i * j == 4) { System.out.println("labelled break at i=" + i + ", j=" + j); break ngoai; }
    }
}</code></pre>
<p>(Output hiện ở slide 18, sau phần Chao.) ⚠️ "<code>switch (char/int exp)</code>" đã lỗi thời: từ Java 7 switch chạy được cả trên <strong>String</strong>, và xưa nay nó vẫn nhận <code>byte</code>, <code>short</code>, <code>char</code>, <code>int</code>, các lớp bao của chúng và <code>enum</code> (JLS §14.11) — không bao giờ nhận <code>long</code>, <code>double</code> hay <code>boolean</code>. Thiếu <code>break</code> thì luồng chạy "rơi" xuống case tiếp theo, y như C: "add" in ra hai dòng.</p>
<p>Thêm hai công cụ riêng của Java: <code>continue</code> nhảy sang vòng kế, và <strong>break có nhãn</strong> (<code>break ngoai;</code>) thoát cả hai vòng lồng nhau một lúc — Java không có <code>goto</code>. ➕ Java 14 thêm biểu thức <code>switch</code> với <code>case "add" -&gt;</code>; nó không biên dịch được trên JDK 8 của phòng thi.</p>`],
      [18, 'Basic Logic Constructs',
        `<p class="y-chinh">🎯 Logic constructs are the same as C statements, plus the <strong>enhanced for</strong> loop: the class <code>Chao</code> prints <code>Hello</code>, then the array <code>{1,2,3,4,5}</code> with a classic <code>for</code>, with <code>for (int x : a)</code>, and again after <code>for (int x : a) x += 10;</code> — still <code>1,2,3,4,5,</code> ("Read only").</p>
<pre class="trich"><code class="language-java">System.out.println("Hello");
int a[] = { 1, 2, 3, 4, 5 };
for (int i = 0; i &lt; a.length; i++) System.out.print(a[i] + ",");
System.out.println();
for (int x : a) System.out.print(x + ",");
System.out.println();
for (int x : a) x += 10;      // changes the COPY x, never the array
for (int i = 0; i &lt; a.length; i++) System.out.print(a[i] + ",");
System.out.println();</code></pre>
<div class="out">Hello<br>
1,2,3,4,5,<br>
1,2,3,4,5,<br>
1,2,3,4,5,<br>
switch: adding<br>
switch: listing &nbsp;&nbsp;&lt;- fell through, no break above<br>
switch char: good<br>
do-while, sum of odd 1..9 = 25<br>
labelled break at i=2, j=2</div>
<p>The picture explains it: in each turn <code>x</code> receives a <strong>copy</strong> of one element (an arrow from <code>a[0]</code> to the box <code>x</code>), so <code>x += 10</code> changes the copy and the array stays the same. To change elements, use an index: <code>for (int i = 0; i &lt; a.length; i++) a[i] += 10;</code>. With an array of objects, <code>x.setGpa(…)</code> inside a for-each <em>does</em> change the objects (the copy is a copy of the reference) — Chapter 7.</p>
<p>On the slide NetBeans shows a light bulb at <code>import java.lang.*;</code>: the import is useless, <code>java.lang</code> (String, System, Math) is always imported automatically. The class also sits in a <code>package com;</code>.</p>
<div class="pitfall">FE trap: "the enhanced for loop can modify the elements of an int array" — false; it can read them only.</div>`,
        `<p class="y-chinh">🎯 Cấu trúc logic giống câu lệnh C, cộng thêm vòng <strong>for cải tiến (for-each)</strong>: lớp <code>Chao</code> in <code>Hello</code>, rồi in mảng <code>{1,2,3,4,5}</code> bằng <code>for</code> cổ điển, bằng <code>for (int x : a)</code>, và in lại sau <code>for (int x : a) x += 10;</code> — vẫn là <code>1,2,3,4,5,</code> ("Read only" — chỉ đọc).</p>
<pre class="trich"><code class="language-java">System.out.println("Hello");
int a[] = { 1, 2, 3, 4, 5 };
for (int i = 0; i &lt; a.length; i++) System.out.print(a[i] + ",");
System.out.println();
for (int x : a) System.out.print(x + ",");
System.out.println();
for (int x : a) x += 10;      // đổi BẢN SAO x, không đổi mảng
for (int i = 0; i &lt; a.length; i++) System.out.print(a[i] + ",");
System.out.println();</code></pre>
<div class="out">Hello<br>
1,2,3,4,5,<br>
1,2,3,4,5,<br>
1,2,3,4,5,<br>
switch: adding<br>
switch: listing &nbsp;&nbsp;&lt;- fell through, no break above<br>
switch char: good<br>
do-while, sum of odd 1..9 = 25<br>
labelled break at i=2, j=2</div>
<p>Hình vẽ giải thích: ở mỗi vòng <code>x</code> nhận một <strong>bản sao</strong> của một phần tử (mũi tên từ <code>a[0]</code> sang ô <code>x</code>), nên <code>x += 10</code> sửa bản sao còn mảng thì giữ nguyên. Muốn sửa phần tử thì dùng chỉ số: <code>for (int i = 0; i &lt; a.length; i++) a[i] += 10;</code>. Với mảng đối tượng, <code>x.setGpa(…)</code> trong for-each <em>có</em> làm đổi đối tượng (bản sao ở đây là bản sao tham chiếu) — Chương 7.</p>
<p>Trên slide NetBeans hiện bóng đèn ở dòng <code>import java.lang.*;</code>: import đó thừa, <code>java.lang</code> (String, System, Math) luôn được tự động import. Lớp này còn nằm trong <code>package com;</code>.</p>
<div class="pitfall">Bẫy FE: "vòng for cải tiến sửa được phần tử của mảng int" — sai; nó chỉ đọc được.</div>`],
      [19, 'The String type',
        `<p class="y-chinh">🎯 A <code>String</code> represents a sequence of zero or more Unicode characters: <code>String name = "Steve";</code>, the empty string <code>""</code>, or <code>null</code> (no string at all); strings are joined with <code>+</code>: <code>"foo" + "bar" + "!"</code>; and Java is case-sensitive.</p>
<pre><code class="language-java">// release: 8
// Slide 19: String literals, empty vs null, and how + decides between "add" and "concatenate"
public class KieuString {
    public static void main(String[] args) {
        String name = "Steve";
        String rong = "";
        String khong = null;
        String x = "foo" + "bar" + "!";
        System.out.println(x + ", length " + x.length() + "; \\"\\".length() = " + rong.length() + ", isEmpty = " + rong.isEmpty());
        System.out.println("null + \\"!\\" = " + (khong + "!"));          // null becomes the text "null"
        System.out.println("1 + 2 + \\"3\\" = " + (1 + 2 + "3"));         // left to right: 3, then "33"
        System.out.println("\\"3\\" + 1 + 2 = " + ("3" + 1 + 2));
        System.out.println("\\"3\\" + (1 + 2) = " + ("3" + (1 + 2)));
        System.out.println("'a' + 'b' = " + ('a' + 'b') + ",  \\"\\" + 'a' + 'b' = " + ("" + 'a' + 'b'));
        System.out.println("\\"steve\\".equals(name) = " + "steve".equals(name) + ", equalsIgnoreCase = " + "steve".equalsIgnoreCase(name));
    }
}</code></pre>
<div class="out">foobar!, length 7; "".length() = 0, isEmpty = true<br>
null + "!" = null!<br>
1 + 2 + "3" = 33<br>
"3" + 1 + 2 = 312<br>
"3" + (1 + 2) = 33<br>
'a' + 'b' = 195, &nbsp;"" + 'a' + 'b' = ab<br>
"steve".equals(name) = false, equalsIgnoreCase = true</div>
<p>Three ideas the output makes concrete. <strong>Empty is not null</strong>: <code>""</code> is a real String of length 0, <code>null</code> means the variable refers to nothing (calling <code>.length()</code> on it throws). <strong><code>+</code> works left to right</strong>: <code>1 + 2 + "3"</code> adds first (3) and then joins ("33"), while <code>"3" + 1 + 2</code> joins all the way ("312"); <code>'a' + 'b'</code> is 195 because two <code>char</code>s add as numbers. <strong>Case matters</strong> for <code>equals</code>; use <code>equalsIgnoreCase</code> when it should not.</p>
<p>String is a <em>class</em>, not a primitive — Numbers and Strings (lesson 1.E–1.F) spends a whole deck on it: the string pool, <code>==</code> vs <code>equals</code>, immutability, StringBuilder.</p>
<div class="pitfall">FE trap: <code>System.out.println(1 + 2 + "3" + 4 + 5);</code> prints <code>3345</code> — the numbers before the first String are added, everything after it is joined.</div>`,
        `<p class="y-chinh">🎯 <code>String</code> biểu diễn một dãy không hoặc nhiều ký tự Unicode: <code>String name = "Steve";</code>, chuỗi rỗng <code>""</code>, hoặc <code>null</code> (không có chuỗi nào); nối chuỗi bằng <code>+</code>: <code>"foo" + "bar" + "!"</code>; và Java phân biệt hoa thường.</p>
<pre><code class="language-java">// release: 8
// Slide 19: hằng String, chuỗi rỗng và null, và cách + quyết định "cộng số" hay "nối chuỗi"
public class KieuString {
    public static void main(String[] args) {
        String name = "Steve";
        String rong = "";
        String khong = null;
        String x = "foo" + "bar" + "!";
        System.out.println(x + ", length " + x.length() + "; \\"\\".length() = " + rong.length() + ", isEmpty = " + rong.isEmpty());
        System.out.println("null + \\"!\\" = " + (khong + "!"));          // null thành chữ "null"
        System.out.println("1 + 2 + \\"3\\" = " + (1 + 2 + "3"));         // trái sang phải: 3, rồi "33"
        System.out.println("\\"3\\" + 1 + 2 = " + ("3" + 1 + 2));
        System.out.println("\\"3\\" + (1 + 2) = " + ("3" + (1 + 2)));
        System.out.println("'a' + 'b' = " + ('a' + 'b') + ",  \\"\\" + 'a' + 'b' = " + ("" + 'a' + 'b'));
        System.out.println("\\"steve\\".equals(name) = " + "steve".equals(name) + ", equalsIgnoreCase = " + "steve".equalsIgnoreCase(name));
    }
}</code></pre>
<div class="out">foobar!, length 7; "".length() = 0, isEmpty = true<br>
null + "!" = null!<br>
1 + 2 + "3" = 33<br>
"3" + 1 + 2 = 312<br>
"3" + (1 + 2) = 33<br>
'a' + 'b' = 195, &nbsp;"" + 'a' + 'b' = ab<br>
"steve".equals(name) = false, equalsIgnoreCase = true</div>
<p>Ba ý mà output làm rõ. <strong>Rỗng khác null</strong>: <code>""</code> là một String thật dài 0, còn <code>null</code> nghĩa là biến không trỏ tới gì cả (gọi <code>.length()</code> trên nó sẽ ném ngoại lệ). <strong><code>+</code> chạy từ trái sang phải</strong>: <code>1 + 2 + "3"</code> cộng trước (3) rồi mới nối ("33"), còn <code>"3" + 1 + 2</code> nối một mạch ("312"); <code>'a' + 'b'</code> là 195 vì hai <code>char</code> cộng như số. <strong>Hoa thường có nghĩa</strong> với <code>equals</code>; dùng <code>equalsIgnoreCase</code> khi muốn bỏ qua.</p>
<p>String là một <em>lớp</em>, không phải kiểu nguyên thủy — bộ Numbers and Strings (bài 1.E–1.F) dành cả một deck cho nó: string pool, <code>==</code> và <code>equals</code>, tính bất biến, StringBuilder.</p>
<div class="pitfall">Bẫy FE: <code>System.out.println(1 + 2 + "3" + 4 + 5);</code> in ra <code>3345</code> — các số đứng trước String đầu tiên được cộng, mọi thứ sau nó được nối.</div>`],
      [20, 'Type Conversions and Explicit Casting',
        `<p class="y-chinh">🎯 <code>Casting_Convert_1</code>: <code>x = n;</code> (byte → short) is a widening conversion and is OK; <code>n = y;</code> (short → byte) is a narrowing conversion and is <strong>not allowed</strong> without an explicit cast; <code>n = (byte) y;</code> compiles and prints <code>0</code>; a <code>boolean</code> cannot be converted to any other type; a non-boolean can be converted to another non-boolean.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Casting_Convert_1.java",
        "public class Casting_Convert_1 {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        short x, y = 256;\\n" +
        "        byte m, n = 6;\\n" +
        "        x = n;\\n" +
        "        n = y;            // narrowing without a cast\\n" +
        "        float f = 3.4;    // 3.4 is a double literal\\n" +
        "        int k = true;     // boolean -&gt; int\\n" +
        "        boolean b = 1;    // int -&gt; boolean\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Casting_Convert_1.java");
}</code></pre>
<div class="out">&gt; javac Casting_Convert_1.java<br>
Casting_Convert_1.java:6: error: incompatible types: possible lossy conversion from short to byte<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n = y; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// narrowing without a cast<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Casting_Convert_1.java:7: error: incompatible types: possible lossy conversion from double to float<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;float f = 3.4; &nbsp;&nbsp;&nbsp;// 3.4 is a double literal<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Casting_Convert_1.java:8: error: incompatible types: boolean cannot be converted to int<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int k = true; &nbsp;&nbsp;&nbsp;&nbsp;// boolean -&gt; int<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Casting_Convert_1.java:9: error: incompatible types: int cannot be converted to boolean<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;boolean b = 1; &nbsp;&nbsp;&nbsp;// int -&gt; boolean<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
4 errors<br>
(exit code 1)</div>
<p>Those are javac 1.8's exact words — "possible lossy conversion" is the message you will see most. With the cast it compiles; why <code>(byte) 256</code> is 0 is drawn on the slide: 256 is <code>0000 0001 0000 0000</code> and a <code>byte</code> keeps only the <strong>low 8 bits</strong>, <code>0000 0000</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 20: the school's Casting_Convert_1 result, then what every narrowing cast really does to the bits
public class EpKieu {
    public static void main(String[] args) {
        short x, y = 256;
        byte m, n = 6;
        x = n;                        // widening: byte -&gt; short, automatic
        n = (byte) y;                 // narrowing: keeps only the LOW 8 bits of 0000 0001 0000 0000
        System.out.println(n);
        System.out.println("(byte) 200    = " + (byte) 200);
        System.out.println("(int) 3.99    = " + (int) 3.99 + ",  (int) -3.99 = " + (int) -3.99);
        System.out.println("Math.round(3.5) = " + Math.round(3.5) + ", Math.round(-3.5) = " + Math.round(-3.5));
        System.out.println("(int) 'A'     = " + (int) 'A' + ",  (char) 97 = " + (char) 97);
        System.out.println("(int) 1e10    = " + (int) 1e10 + "   (a double too big saturates at Integer.MAX_VALUE)");
        int a = 7, b = 2;
        double tb1 = a / b, tb2 = (double) a / b;
        System.out.println("a / b into double = " + tb1 + ",  (double) a / b = " + tb2);
        long big = 3_000_000_000L;
        System.out.println("(int) 3000000000L = " + (int) big);
        byte k = 10;
        k += 5;                       // compound assignment hides a cast
        System.out.println("byte k = 10; k += 5; -&gt; " + k);
    }
}</code></pre>
<div class="out">0<br>
(byte) 200 &nbsp;&nbsp;&nbsp;= -56<br>
(int) 3.99 &nbsp;&nbsp;&nbsp;= 3, &nbsp;(int) -3.99 = -3<br>
Math.round(3.5) = 4, Math.round(-3.5) = -3<br>
(int) 'A' &nbsp;&nbsp;&nbsp;&nbsp;= 65, &nbsp;(char) 97 = a<br>
(int) 1e10 &nbsp;&nbsp;&nbsp;= 2147483647 &nbsp;&nbsp;(a double too big saturates at Integer.MAX_VALUE)<br>
a / b into double = 3.0, &nbsp;(double) a / b = 3.5<br>
(int) 3000000000L = -1294967296<br>
byte k = 10; k += 5; -&gt; 15</div>
<p>The rules behind the output: widening goes <code>byte → short → int → long → float → double</code> (and <code>char → int</code>) automatically; narrowing needs a cast and cuts bits (<code>(byte) 200</code> is −56), drops the fraction toward zero (<code>(int) -3.99</code> is −3) or saturates (<code>(int) 1e10</code>). ➕ Two exceptions to "narrowing is not allowed": a <em>constant</em> that fits is accepted (<code>byte b = 10;</code>), and compound assignment casts silently (<code>k += 5</code>).</p>
<div class="pitfall">PE trap: <code>double avg = sum / n;</code> with two ints gives a whole number (3.0, not 3.5) — cast one operand: <code>(double) sum / n</code>.</div>`,
        `<p class="y-chinh">🎯 <code>Casting_Convert_1</code>: <code>x = n;</code> (byte → short) là chuyển kiểu mở rộng (widening), hợp lệ; <code>n = y;</code> (short → byte) là chuyển kiểu thu hẹp (narrowing), <strong>không được phép</strong> nếu không ép kiểu tường minh; <code>n = (byte) y;</code> biên dịch được và in ra <code>0</code>; <code>boolean</code> không đổi được sang kiểu nào khác; kiểu không phải boolean thì đổi được sang kiểu không phải boolean khác.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Casting_Convert_1.java",
        "public class Casting_Convert_1 {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        short x, y = 256;\\n" +
        "        byte m, n = 6;\\n" +
        "        x = n;\\n" +
        "        n = y;            // narrowing without a cast\\n" +
        "        float f = 3.4;    // 3.4 is a double literal\\n" +
        "        int k = true;     // boolean -&gt; int\\n" +
        "        boolean b = 1;    // int -&gt; boolean\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Casting_Convert_1.java");
}</code></pre>
<div class="out">&gt; javac Casting_Convert_1.java<br>
Casting_Convert_1.java:6: error: incompatible types: possible lossy conversion from short to byte<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n = y; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// narrowing without a cast<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Casting_Convert_1.java:7: error: incompatible types: possible lossy conversion from double to float<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;float f = 3.4; &nbsp;&nbsp;&nbsp;// 3.4 is a double literal<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Casting_Convert_1.java:8: error: incompatible types: boolean cannot be converted to int<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int k = true; &nbsp;&nbsp;&nbsp;&nbsp;// boolean -&gt; int<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Casting_Convert_1.java:9: error: incompatible types: int cannot be converted to boolean<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;boolean b = 1; &nbsp;&nbsp;&nbsp;// int -&gt; boolean<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
4 errors<br>
(exit code 1)</div>
<p>Đó là nguyên văn của javac 1.8 — "possible lossy conversion" (có thể mất dữ liệu khi chuyển) là thông báo bạn sẽ gặp nhiều nhất. Có ép kiểu thì biên dịch được; vì sao <code>(byte) 256</code> ra 0 đã được vẽ trên slide: 256 là <code>0000 0001 0000 0000</code> mà <code>byte</code> chỉ giữ <strong>8 bit thấp</strong>, <code>0000 0000</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 20: kết quả Casting_Convert_1 của trường, rồi mỗi phép ép hẹp thật sự làm gì với các bit
public class EpKieu {
    public static void main(String[] args) {
        short x, y = 256;
        byte m, n = 6;
        x = n;                        // nới rộng: byte -&gt; short, tự động
        n = (byte) y;                 // thu hẹp: chỉ giữ 8 bit THẤP của 0000 0001 0000 0000
        System.out.println(n);
        System.out.println("(byte) 200    = " + (byte) 200);
        System.out.println("(int) 3.99    = " + (int) 3.99 + ",  (int) -3.99 = " + (int) -3.99);
        System.out.println("Math.round(3.5) = " + Math.round(3.5) + ", Math.round(-3.5) = " + Math.round(-3.5));
        System.out.println("(int) 'A'     = " + (int) 'A' + ",  (char) 97 = " + (char) 97);
        System.out.println("(int) 1e10    = " + (int) 1e10 + "   (a double too big saturates at Integer.MAX_VALUE)");
        int a = 7, b = 2;
        double tb1 = a / b, tb2 = (double) a / b;
        System.out.println("a / b into double = " + tb1 + ",  (double) a / b = " + tb2);
        long big = 3_000_000_000L;
        System.out.println("(int) 3000000000L = " + (int) big);
        byte k = 10;
        k += 5;                       // gán kết hợp giấu một phép ép kiểu
        System.out.println("byte k = 10; k += 5; -&gt; " + k);
    }
}</code></pre>
<div class="out">0<br>
(byte) 200 &nbsp;&nbsp;&nbsp;= -56<br>
(int) 3.99 &nbsp;&nbsp;&nbsp;= 3, &nbsp;(int) -3.99 = -3<br>
Math.round(3.5) = 4, Math.round(-3.5) = -3<br>
(int) 'A' &nbsp;&nbsp;&nbsp;&nbsp;= 65, &nbsp;(char) 97 = a<br>
(int) 1e10 &nbsp;&nbsp;&nbsp;= 2147483647 &nbsp;&nbsp;(a double too big saturates at Integer.MAX_VALUE)<br>
a / b into double = 3.0, &nbsp;(double) a / b = 3.5<br>
(int) 3000000000L = -1294967296<br>
byte k = 10; k += 5; -&gt; 15</div>
<p>Luật đứng sau output: mở rộng đi theo <code>byte → short → int → long → float → double</code> (và <code>char → int</code>) một cách tự động; thu hẹp cần ép kiểu và sẽ cắt bit (<code>(byte) 200</code> là −56), bỏ phần lẻ về phía 0 (<code>(int) -3.99</code> là −3) hoặc bão hoà (<code>(int) 1e10</code>). ➕ Hai ngoại lệ của câu "không cho thu hẹp": một <em>hằng</em> vừa vặn thì được nhận (<code>byte b = 10;</code>), và phép gán kết hợp tự ép kiểu im lặng (<code>k += 5</code>).</p>
<div class="pitfall">Bẫy PE: <code>double avg = sum / n;</code> với hai số int cho ra số nguyên (3.0, không phải 3.5) — ép một toán hạng: <code>(double) sum / n</code>.</div>`],
      [21, 'Scope',
        `<p class="y-chinh">🎯 The <strong>scope</strong> of a declaration is the part of the program where that declaration is visible; the slide lists global, file, function, class and block scope; a non-global declaration is visible from the declaration to the closing brace that ends it, and is called a local declaration.</p>
<p>⚠️ This slide (and the matching page of the FU offline material) was written for C++: <strong>Java has no global scope and no file scope</strong>. There are no variables or functions outside a class; even <code>main</code> lives inside one. The scopes you really have in Java:</p>
<table>
<thead><tr><th>Java scope</th><th>Example</th><th>Visible</th></tr></thead>
<tbody>
<tr><td>class (members)</td><td>fields and methods of <code>Student</code></td><td>in the whole class; outside it as allowed by <code>private</code>/<code>public</code> (Chapter 3)</td></tr>
<tr><td>method parameter</td><td><code>args</code> in <code>main(String[] args)</code></td><td>the whole method body</td></tr>
<tr><td>local variable</td><td><code>int S = 0;</code></td><td>from the declaration to the end of its block <code>}</code></td></tr>
<tr><td>block</td><td>a variable declared inside <code>if { … }</code></td><td>only inside those braces</td></tr>
<tr><td>for-loop variable</td><td><code>for (int i = 0; …)</code></td><td>only inside the loop</td></tr>
</tbody>
</table>
<p>Closest thing to a "global": a <code>public static</code> field such as <code>Math.PI</code> — but it still belongs to a class and is reached through the class name.</p>
<p class="meo">🧠 Declare a variable in the smallest scope that works, right before its first use. It makes slide 22's errors impossible.</p>`,
        `<p class="y-chinh">🎯 <strong>Phạm vi (scope)</strong> của một khai báo là phần chương trình mà khai báo đó được nhìn thấy; slide liệt kê phạm vi toàn cục, tệp, hàm, lớp và khối; khai báo không toàn cục được nhìn thấy từ chỗ khai báo tới dấu ngoặc đóng kết thúc nó, và được gọi là khai báo cục bộ.</p>
<p>⚠️ Slide này (và trang tương ứng trong học liệu offline FU) được viết cho C++: <strong>Java không có phạm vi toàn cục (global) và phạm vi tệp (file)</strong>. Không có biến hay hàm nào nằm ngoài lớp; ngay cả <code>main</code> cũng ở trong một lớp. Các phạm vi bạn thật sự có trong Java:</p>
<table>
<thead><tr><th>Phạm vi trong Java</th><th>Ví dụ</th><th>Thấy được ở đâu</th></tr></thead>
<tbody>
<tr><td>lớp (thành viên)</td><td>trường và phương thức của <code>Student</code></td><td>trong cả lớp; bên ngoài thì tuỳ <code>private</code>/<code>public</code> (Chương 3)</td></tr>
<tr><td>tham số phương thức</td><td><code>args</code> trong <code>main(String[] args)</code></td><td>cả thân phương thức</td></tr>
<tr><td>biến cục bộ</td><td><code>int S = 0;</code></td><td>từ chỗ khai báo tới cuối khối <code>}</code> chứa nó</td></tr>
<tr><td>khối</td><td>biến khai báo trong <code>if { … }</code></td><td>chỉ trong cặp ngoặc đó</td></tr>
<tr><td>biến vòng for</td><td><code>for (int i = 0; …)</code></td><td>chỉ trong vòng lặp</td></tr>
</tbody>
</table>
<p>Thứ gần với "toàn cục" nhất: một trường <code>public static</code> như <code>Math.PI</code> — nhưng nó vẫn thuộc một lớp và được gọi qua tên lớp.</p>
<p class="meo">🧠 Khai báo biến ở phạm vi nhỏ nhất dùng được, ngay trước lần dùng đầu tiên. Làm vậy thì các lỗi ở slide 22 không thể xảy ra.</p>`],
      [22, 'Scope of a Variable',
        `<p class="y-chinh">🎯 <code>ScopeDemo</code>: <code>y</code> is declared inside the <code>if</code> block, so <code>y = 6;</code> after the block is an error; <code>i</code> is declared in the <code>for</code>, so <code>k += i;</code> after the loop is an error — the scope of <code>y</code> and of <code>i</code> are marked on the slide.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "ScopeDemo.java",
        "public class ScopeDemo {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int x = 2, k = 2;\\n" +
        "        if (x &lt; 2) {\\n" +
        "            int y = 3;\\n" +
        "            int z = 4;\\n" +
        "        }\\n" +
        "        y = 6;                          // y lives only inside the if block\\n" +
        "        for (int i = 1; i &lt; 3; i++) x += i;\\n" +
        "        k += i;                         // i lives only inside the for\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "ScopeDemo.java");
    viet(d, "ScopeFixed.java",
        "public class ScopeFixed {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int x = 2, k = 2;\\n" +
        "        int y = 0;                      // declared where every user can see it\\n" +
        "        if (x &lt; 2) { y = 3; }\\n" +
        "        y = 6;\\n" +
        "        int i;\\n" +
        "        for (i = 1; i &lt; 3; i++) x += i;\\n" +
        "        k += i;\\n" +
        "        System.out.println(\\"x=\\" + x + \\" y=\\" + y + \\" k=\\" + k + \\" i=\\" + i);\\n" +
        "    }\\n" +
        "}\\n");
    if (lenhOk(d, "javac", "ScopeFixed.java")) lenh(d, "java", "ScopeFixed");
    viet(d, "Shadow.java",
        "public class Shadow {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int n = 1;\\n" +
        "        {\\n" +
        "            int n = 2;                  // legal in C, an error in Java\\n" +
        "        }\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Shadow.java");
}</code></pre>
<div class="out">&gt; javac ScopeDemo.java<br>
ScopeDemo.java:8: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;y = 6; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// y lives only inside the if block<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable y<br>
&nbsp;&nbsp;location: class ScopeDemo<br>
ScopeDemo.java:10: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;k += i; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// i lives only inside the for<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable i<br>
&nbsp;&nbsp;location: class ScopeDemo<br>
2 errors<br>
(exit code 1)<br>
&gt; javac ScopeFixed.java<br>
&gt; java ScopeFixed<br>
x=5 y=6 k=5 i=3<br>
&gt; javac Shadow.java<br>
Shadow.java:5: error: variable n is already defined in method main(String[])<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int n = 2; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// legal in C, an error in Java<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>javac says <code>cannot find symbol</code>: outside its scope the variable does not exist at all — it is not "hidden", it is gone. The fix moves each declaration to the scope where it is used (<code>ScopeFixed</code> prints <code>x=5 y=6 k=5 i=3</code>: the loop added 1 and 2 to <code>x</code>, and <code>i</code> stopped at 3).</p>
<p>The third file shows a rule Java has and C does not: you <strong>cannot redeclare</strong> a local variable inside a nested block (<code>variable n is already defined</code>). A local variable <em>may</em> have the same name as a field — then the field is reached with <code>this.name</code>, which is exactly what every constructor and setter in Chapter 2 does.</p>
<div class="pitfall">LAB211 trap: declaring <code>Scanner sc</code> or a counter inside a loop when you need it after the loop. If the compiler says "cannot find symbol" for a variable you can see on the screen, look at the braces.</div>`,
        `<p class="y-chinh">🎯 <code>ScopeDemo</code>: <code>y</code> được khai báo trong khối <code>if</code>, nên <code>y = 6;</code> sau khối là lỗi; <code>i</code> được khai báo trong <code>for</code>, nên <code>k += i;</code> sau vòng lặp là lỗi — phạm vi của <code>y</code> và của <code>i</code> được đánh dấu trên slide.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "ScopeDemo.java",
        "public class ScopeDemo {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int x = 2, k = 2;\\n" +
        "        if (x &lt; 2) {\\n" +
        "            int y = 3;\\n" +
        "            int z = 4;\\n" +
        "        }\\n" +
        "        y = 6;                          // y lives only inside the if block\\n" +
        "        for (int i = 1; i &lt; 3; i++) x += i;\\n" +
        "        k += i;                         // i lives only inside the for\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "ScopeDemo.java");
    viet(d, "ScopeFixed.java",
        "public class ScopeFixed {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int x = 2, k = 2;\\n" +
        "        int y = 0;                      // declared where every user can see it\\n" +
        "        if (x &lt; 2) { y = 3; }\\n" +
        "        y = 6;\\n" +
        "        int i;\\n" +
        "        for (i = 1; i &lt; 3; i++) x += i;\\n" +
        "        k += i;\\n" +
        "        System.out.println(\\"x=\\" + x + \\" y=\\" + y + \\" k=\\" + k + \\" i=\\" + i);\\n" +
        "    }\\n" +
        "}\\n");
    if (lenhOk(d, "javac", "ScopeFixed.java")) lenh(d, "java", "ScopeFixed");
    viet(d, "Shadow.java",
        "public class Shadow {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        int n = 1;\\n" +
        "        {\\n" +
        "            int n = 2;                  // legal in C, an error in Java\\n" +
        "        }\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Shadow.java");
}</code></pre>
<div class="out">&gt; javac ScopeDemo.java<br>
ScopeDemo.java:8: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;y = 6; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// y lives only inside the if block<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable y<br>
&nbsp;&nbsp;location: class ScopeDemo<br>
ScopeDemo.java:10: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;k += i; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// i lives only inside the for<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable i<br>
&nbsp;&nbsp;location: class ScopeDemo<br>
2 errors<br>
(exit code 1)<br>
&gt; javac ScopeFixed.java<br>
&gt; java ScopeFixed<br>
x=5 y=6 k=5 i=3<br>
&gt; javac Shadow.java<br>
Shadow.java:5: error: variable n is already defined in method main(String[])<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int n = 2; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// legal in C, an error in Java<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>javac báo <code>cannot find symbol</code> (không tìm thấy ký hiệu): ra khỏi phạm vi thì biến không tồn tại nữa — không phải "bị giấu", mà là không còn. Cách sửa dời mỗi khai báo về phạm vi nơi nó được dùng (<code>ScopeFixed</code> in <code>x=5 y=6 k=5 i=3</code>: vòng lặp cộng 1 và 2 vào <code>x</code>, và <code>i</code> dừng ở 3).</p>
<p>File thứ ba cho thấy một luật Java có mà C không có: <strong>không được khai báo lại</strong> biến cục bộ trong khối lồng bên trong (<code>variable n is already defined</code>). Biến cục bộ <em>được phép</em> trùng tên với một trường — khi đó trường được gọi bằng <code>this.ten</code>, đúng điều mà mọi constructor và setter ở Chương 2 làm.</p>
<div class="pitfall">Bẫy LAB211: khai báo <code>Scanner sc</code> hay biến đếm bên trong vòng lặp trong khi cần nó sau vòng lặp. Nếu trình biên dịch báo "cannot find symbol" cho một biến bạn nhìn thấy ngay trên màn hình, hãy nhìn các dấu ngoặc.</div>`],
      [23, 'Input/Output Data',
        `<p class="y-chinh">🎯 Output goes through <code>java.lang.System</code> (<code>System.out.print/println/format</code>); input through <code>java.util.Scanner</code>; the demo reads <code>n</code>, then <code>n</code> integers, prints them with <code>format("%5d", …)</code> and their sum; see the documentation of <code>String</code>'s <code>format</code> method and format strings for details; the box suggests <code>n = sc.nextInt();</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 23: the school's InputOutputDemo — read n and n integers with Scanner, print them with format("%5d"), sum them
/* Write a program that will accept an array of integers then
   print out entered value and the sum of values */
import java.util.Scanner;

public class NhapXuat {
    public static void main(String args[]) {
        int a[];  // array of integers
        int n;    // number of elements of the array
        int i;    // variable for traversing the array
        Scanner sc = new Scanner(System.in);   // object for the keyboard
        System.out.print("Enter number of elements: ");
        n = Integer.parseInt(sc.nextLine());
        a = new int[n];   // mem. allocating for elements of the array
        for (i = 0; i &lt; n; i++) {
            System.out.print("Enter the " + (i + 1) + "/" + n + " element: ");
            a[i] = Integer.parseInt(sc.nextLine());
        }
        System.out.print("Entered values: ");
        for (i = 0; i &lt; n; i++) System.out.format("%5d", a[i]);
        int S = 0;
        for (int x : a) S += x;
        System.out.println("\\nSum of values: " + S);
    }
}</code></pre>
<div class="out">Enter number of elements: Enter the 1/5 element: Enter the 2/5 element: Enter the 3/5 element: Enter the 4/5 element: Enter the 5/5 element: Entered values: &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;7<br>
Sum of values: 14</div>
<p>Keyboard input used for this run (one value per line, as on the slide: 5, then 1 4 2 0 7):</p>
<pre><code class="language-plaintext">5
1
4
2
0
7</code></pre>
<p>The prompts appear on one line because the input came from a file, not from your typing; in NetBeans each number you type is followed by Enter, as in the slide's Output window. The program reads <strong>whole lines</strong> with <code>sc.nextLine()</code> and converts with <code>Integer.parseInt</code> — the robust pattern. The box's alternative <code>n = sc.nextInt();</code> works too, but mixing <code>nextInt()</code> with a later <code>nextLine()</code> reads an empty line (the ⭐ "First hands-on session" in Section 0 runs that bug for real). <code>%5d</code> prints an integer right-aligned in 5 columns — the whole printf language is in deck pro5, slide 28.</p>
<div class="callout">🧭 <strong>Go further — LAB211</strong>: every LAB211 program starts with exactly this: a loop that reads a line, checks it (<code>parseInt</code> inside <code>try/catch</code>, range check) and asks again — practice exercise 5 of this chapter builds that helper.</div>`,
        `<p class="y-chinh">🎯 Xuất dữ liệu qua <code>java.lang.System</code> (<code>System.out.print/println/format</code>); nhập qua <code>java.util.Scanner</code>; demo đọc <code>n</code>, rồi <code>n</code> số nguyên, in chúng bằng <code>format("%5d", …)</code> cùng tổng; xem tài liệu phương thức <code>format</code> của <code>String</code> và chuỗi định dạng để biết chi tiết; hộp chữ gợi ý <code>n = sc.nextInt();</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 23: InputOutputDemo của trường — đọc n và n số nguyên bằng Scanner, in bằng format("%5d"), tính tổng
/* Write a program that will accept an array of integers then
   print out entered value and the sum of values */
import java.util.Scanner;

public class NhapXuat {
    public static void main(String args[]) {
        int a[];  // mảng số nguyên
        int n;    // số phần tử của mảng
        int i;    // biến duyệt mảng
        Scanner sc = new Scanner(System.in);   // đối tượng đọc bàn phím
        System.out.print("Enter number of elements: ");
        n = Integer.parseInt(sc.nextLine());
        a = new int[n];   // cấp phát bộ nhớ cho các phần tử
        for (i = 0; i &lt; n; i++) {
            System.out.print("Enter the " + (i + 1) + "/" + n + " element: ");
            a[i] = Integer.parseInt(sc.nextLine());
        }
        System.out.print("Entered values: ");
        for (i = 0; i &lt; n; i++) System.out.format("%5d", a[i]);
        int S = 0;
        for (int x : a) S += x;
        System.out.println("\\nSum of values: " + S);
    }
}</code></pre>
<div class="out">Enter number of elements: Enter the 1/5 element: Enter the 2/5 element: Enter the 3/5 element: Enter the 4/5 element: Enter the 5/5 element: Entered values: &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;7<br>
Sum of values: 14</div>
<p>Dữ liệu bàn phím dùng cho lần chạy này (mỗi giá trị một dòng, như slide: 5, rồi 1 4 2 0 7):</p>
<pre><code class="language-plaintext">5
1
4
2
0
7</code></pre>
<p>Các lời nhắc nằm trên một dòng vì dữ liệu đến từ tệp chứ không phải do bạn gõ; trong NetBeans sau mỗi số bạn gõ là một lần Enter, như cửa sổ Output trên slide. Chương trình đọc <strong>cả dòng</strong> bằng <code>sc.nextLine()</code> rồi đổi bằng <code>Integer.parseInt</code> — cách làm chắc chắn. Cách trong hộp chữ <code>n = sc.nextInt();</code> cũng chạy, nhưng trộn <code>nextInt()</code> với một <code>nextLine()</code> phía sau sẽ đọc phải một dòng rỗng (bài ⭐ "Buổi thực hành đầu tiên" ở Mục 0 chạy thật lỗi đó). <code>%5d</code> in số nguyên căn phải trong 5 cột — cả "ngôn ngữ" printf nằm ở deck pro5, slide 28.</p>
<div class="callout">🧭 <strong>Đi tiếp — LAB211</strong>: chương trình LAB211 nào cũng mở đầu đúng như vậy: một vòng lặp đọc một dòng, kiểm tra nó (<code>parseInt</code> trong <code>try/catch</code>, kiểm tra miền giá trị) rồi hỏi lại — bài thực hành 5 của chương này dựng hàm hỗ trợ đó.</div>`],
      [24, 'Elements of Java Style',
        `<p class="y-chinh">🎯 Four style rules: indent statements inside a block relative to the block's first and last line; use comments wisely; put the opening brace at the end of the line that starts the block and each closing brace on its own line, aligned with that line's first character; choose descriptive variable names.</p>
<pre><code class="language-java">// hard to read: everything works, nothing is clear
public class t{public static void main(String[] a){int x=0;for(int i=1;i&lt;=10;i++)
{x+=i;}System.out.println(x);}}

// the same program in Java style
public class SumOneToTen {
    public static void main(String[] args) {
        int sum = 0;                         // running total
        for (int i = 1; i &lt;= 10; i++) {
            sum += i;
        }
        System.out.println(sum);
    }
}</code></pre>
<p>The brace rule is the "K&amp;R" style that Oracle's old Code Conventions and today's Google Java Style both use; NetBeans applies it for you with <strong>Alt+Shift+F</strong> (Format). "Comments wisely" means: explain <em>why</em>, not <em>what</em> — <code>sum += i; // add i to sum</code> adds nothing. Names: <code>camelCase</code> for variables and methods, <code>PascalCase</code> for classes, <code>UPPER_CASE</code> for constants (slide 3).</p>
<p class="meo">🧠 Style is graded: LAB211 reviewers and PRJ301 code reviews deduct for unreadable code even when it works. Press Alt+Shift+F before every submission.</p>`,
        `<p class="y-chinh">🎯 Bốn luật phong cách: thụt lề các câu lệnh trong khối so với dòng đầu và dòng cuối của khối; dùng chú thích hợp lý; đặt ngoặc mở ở cuối dòng bắt đầu khối và mỗi ngoặc đóng nằm trên một dòng riêng, thẳng hàng với ký tự đầu của dòng đó; đặt tên biến có nghĩa.</p>
<pre><code class="language-java">// khó đọc: chạy đúng nhưng chẳng gì rõ ràng
public class t{public static void main(String[] a){int x=0;for(int i=1;i&lt;=10;i++)
{x+=i;}System.out.println(x);}}

// cùng chương trình theo phong cách Java
public class SumOneToTen {
    public static void main(String[] args) {
        int sum = 0;                         // tổng cộng dồn
        for (int i = 1; i &lt;= 10; i++) {
            sum += i;
        }
        System.out.println(sum);
    }
}</code></pre>
<p>Luật ngoặc nhọn là phong cách "K&amp;R" mà bộ Code Conventions cũ của Oracle lẫn Google Java Style ngày nay đều dùng; NetBeans tự áp dụng cho bạn bằng <strong>Alt+Shift+F</strong> (Format). "Chú thích hợp lý" nghĩa là giải thích <em>vì sao</em>, không phải <em>làm gì</em> — <code>sum += i; // cộng i vào sum</code> chẳng thêm được gì. Tên: <code>camelCase</code> cho biến và phương thức, <code>PascalCase</code> cho lớp, <code>UPPER_CASE</code> cho hằng (slide 3).</p>
<p class="meo">🧠 Phong cách có được chấm: người review LAB211 và code review ở PRJ301 trừ điểm code khó đọc dù nó chạy đúng. Bấm Alt+Shift+F trước mỗi lần nộp.</p>`],
      [25, 'Pass Arguments to the method main',
        `<p class="y-chinh">🎯 <code>Adding.java</code> (project FirstPrj, next to HelloWorld): <code>double x = Double.parseDouble(args[0]); double y = Double.parseDouble(args[1]); System.out.println("Sum=" + (x + y));</code> — the numbers come from the command line, not from the keyboard.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Adding.java",
        "public class Adding {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        double x = Double.parseDouble(args[0]);\\n" +
        "        double y = Double.parseDouble(args[1]);\\n" +
        "        System.out.println(\\"Sum=\\" + (x + y));\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Adding.java");
    lenh(d, "java", "Adding", "12.789", "4.32");      // what Adding.bat and the NetBeans Arguments box do
    lenh(d, "java", "Adding", "0.1", "0.2");
    lenh(d, "java", "Adding", "12.789");               // only ONE argument
    lenh(d, "java", "Adding", "12,789", "4.32");       // Vietnamese decimal comma
}</code></pre>
<div class="out">&gt; javac Adding.java<br>
&gt; java Adding 12.789 4.32<br>
Sum=17.109<br>
&gt; java Adding 0.1 0.2<br>
Sum=0.30000000000000004<br>
&gt; java Adding 12.789<br>
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
&gt; java Adding 12,789 4.32<br>
Exception in thread "main" java.lang.NumberFormatException: For input string: "12,789"<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)</div>
<p><code>args</code> is an array of <strong>Strings</strong>, one per word typed after the class name (lesson 1.C showed the mechanics), so every number must be converted: <code>Double.parseDouble</code>, <code>Integer.parseInt</code> — wrapper-class methods from the next deck. The run proves three things: <code>12.789 + 4.32</code> prints <code>Sum=17.109</code> as on the slide; <code>0.1 + 0.2</code> is not exactly 0.3; and the program trusts its input completely — a missing argument throws <code>ArrayIndexOutOfBoundsException: 1</code>, a comma decimal throws <code>NumberFormatException</code>.</p>
<p class="meo">🧠 A real program checks <code>args.length</code> first and prints a usage line ("Usage: java Adding a b") instead of crashing.</p>`,
        `<p class="y-chinh">🎯 <code>Adding.java</code> (project FirstPrj, cạnh HelloWorld): <code>double x = Double.parseDouble(args[0]); double y = Double.parseDouble(args[1]); System.out.println("Sum=" + (x + y));</code> — các số đến từ dòng lệnh, không phải từ bàn phím.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Adding.java",
        "public class Adding {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        double x = Double.parseDouble(args[0]);\\n" +
        "        double y = Double.parseDouble(args[1]);\\n" +
        "        System.out.println(\\"Sum=\\" + (x + y));\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Adding.java");
    lenh(d, "java", "Adding", "12.789", "4.32");      // điều Adding.bat và ô Arguments của NetBeans làm
    lenh(d, "java", "Adding", "0.1", "0.2");
    lenh(d, "java", "Adding", "12.789");               // chỉ MỘT đối số
    lenh(d, "java", "Adding", "12,789", "4.32");       // dấu phẩy thập phân kiểu Việt
}</code></pre>
<div class="out">&gt; javac Adding.java<br>
&gt; java Adding 12.789 4.32<br>
Sum=17.109<br>
&gt; java Adding 0.1 0.2<br>
Sum=0.30000000000000004<br>
&gt; java Adding 12.789<br>
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
&gt; java Adding 12,789 4.32<br>
Exception in thread "main" java.lang.NumberFormatException: For input string: "12,789"<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)</div>
<p><code>args</code> là mảng <strong>String</strong>, mỗi phần tử là một từ gõ sau tên lớp (bài 1.C đã cho xem cơ chế), nên số nào cũng phải đổi kiểu: <code>Double.parseDouble</code>, <code>Integer.parseInt</code> — phương thức của lớp bao ở deck sau. Lần chạy chứng minh ba điều: <code>12.789 + 4.32</code> in ra <code>Sum=17.109</code> như slide; <code>0.1 + 0.2</code> không đúng bằng 0.3; và chương trình tin đầu vào tuyệt đối — thiếu đối số thì ném <code>ArrayIndexOutOfBoundsException: 1</code>, dùng dấu phẩy thập phân thì ném <code>NumberFormatException</code>.</p>
<p class="meo">🧠 Chương trình thật kiểm tra <code>args.length</code> trước và in một dòng hướng dẫn ("Usage: java Adding a b") thay vì sập.</p>`],
      [26, 'Pass Arguments to the method main',
        `<p class="y-chinh">🎯 Two ways to pass the arguments: in NetBeans, right-click the project → Properties → Run → Main Class <code>Adding</code>, Arguments <code>12.789 4.32</code> → OK → Run (Output <code>Sum=17.109</code>); or a batch file <code>Adding.bat</code> containing <code>java Adding 12.789 4.32</code> and <code>Pause</code>.</p>
<p>Both do what the console session on slide 25 did with <code>&gt; java Adding 12.789 4.32</code>. The NetBeans setting belongs to the <strong>project configuration</strong>, so it is used by Run Project (F6), not by Run File (Shift+F6). <code>Pause</code> in the .bat keeps the black window open until a key is pressed, so the user can read the result.</p>
<pre><code class="language-bat">@echo off
rem Adding.bat — must be in the folder that contains Adding.class (or use -cp)
java Adding 12.789 4.32
pause</code></pre>
<p>Where you meet this again: Spring Boot programs are started the same way — <code>java -jar labflow.jar --server.port=8081</code> — and Spring turns each <code>--name=value</code> argument into a configuration property. Your PE, however, never uses arguments: the given <code>Main</code> reads from the keyboard.</p>
<div class="callout">🧭 <strong>Go further — Spring Boot</strong>: in the capstone you will rarely parse <code>args</code> yourself; <code>SpringApplication.run(App.class, args)</code> receives them and the framework does the parsing.</div>`,
        `<p class="y-chinh">🎯 Hai cách truyền đối số: trong NetBeans, chuột phải project → Properties → Run → Main Class <code>Adding</code>, Arguments <code>12.789 4.32</code> → OK → Run (Output <code>Sum=17.109</code>); hoặc một file batch <code>Adding.bat</code> chứa <code>java Adding 12.789 4.32</code> và <code>Pause</code>.</p>
<p>Cả hai làm đúng điều phiên console ở slide 25 làm với <code>&gt; java Adding 12.789 4.32</code>. Thiết lập trong NetBeans thuộc <strong>cấu hình project</strong>, nên nó được dùng khi Run Project (F6), không phải khi Run File (Shift+F6). <code>Pause</code> trong file .bat giữ cửa sổ đen lại tới khi bấm một phím, để người dùng đọc được kết quả.</p>
<pre><code class="language-bat">@echo off
rem Adding.bat — phải nằm trong thư mục chứa Adding.class (hoặc dùng -cp)
java Adding 12.789 4.32
pause</code></pre>
<p>Gặp lại ở đâu: chương trình Spring Boot được khởi động y như vậy — <code>java -jar labflow.jar --server.port=8081</code> — và Spring biến mỗi đối số <code>--ten=giaTri</code> thành một thuộc tính cấu hình. Còn bài PE thì không bao giờ dùng đối số: lớp <code>Main</code> đề cho đọc từ bàn phím.</p>
<div class="callout">🧭 <strong>Đi tiếp — Spring Boot</strong>: ở đồ án bạn hiếm khi tự phân tích <code>args</code>; <code>SpringApplication.run(App.class, args)</code> nhận chúng và framework lo phần phân tích.</div>`],
      [27, 'Summary',
        `<p class="y-chinh">🎯 The deck covered the traditional features of the language — variables, data types, operators and control flow; the two categories of types, primitive and reference; and that the scope of a declaration is the part of the program where it is visible.</p>
<table>
<thead><tr><th>You should now be able to</th><th>Check</th></tr></thead>
<tbody>
<tr><td>name the 8 primitive types with their sizes, and say what a reference holds</td><td>slides 4–5, <code>KieuNguyenThuy</code></td></tr>
<tr><td>create, copy and print 1D and 2D arrays, and explain <code>a = b</code> for arrays</td><td>slides 6–9</td></tr>
<tr><td>predict <code>&gt;&gt;</code>, <code>&gt;&gt;&gt;</code>, <code>%</code>, integer division, <code>a[b] = b = 0</code>, <code>k = k++</code></td><td>slides 10–16</td></tr>
<tr><td>use switch on a String, for-each (read-only), labelled break</td><td>slides 17–18</td></tr>
<tr><td>read javac's "possible lossy conversion" and "cannot find symbol" and fix them</td><td>slides 20–22</td></tr>
<tr><td>read numbers with Scanner + parseInt and print them with format</td><td>slide 23</td></tr>
</tbody>
</table>
<p>Next: deck <em>Numbers and Strings</em> (lessons 1.E–1.F) — wrapper classes, Math, String vs StringBuilder, Scanner and formatted output.</p>`,
        `<p class="y-chinh">🎯 Bộ slide đã đi qua các đặc điểm truyền thống của ngôn ngữ — biến, kiểu dữ liệu, toán tử và cấu trúc điều khiển; hai nhóm kiểu, nguyên thủy và tham chiếu; và phạm vi của một khai báo là phần chương trình nơi nó được nhìn thấy.</p>
<table>
<thead><tr><th>Giờ bạn phải làm được</th><th>Xem lại</th></tr></thead>
<tbody>
<tr><td>kể 8 kiểu nguyên thủy kèm kích thước, và nói biến tham chiếu giữ gì</td><td>slide 4–5, <code>KieuNguyenThuy</code></td></tr>
<tr><td>tạo, chép và in mảng 1 và 2 chiều, giải thích <code>a = b</code> với mảng</td><td>slide 6–9</td></tr>
<tr><td>đoán đúng <code>&gt;&gt;</code>, <code>&gt;&gt;&gt;</code>, <code>%</code>, chia nguyên, <code>a[b] = b = 0</code>, <code>k = k++</code></td><td>slide 10–16</td></tr>
<tr><td>dùng switch trên String, for-each (chỉ đọc), break có nhãn</td><td>slide 17–18</td></tr>
<tr><td>đọc và sửa "possible lossy conversion" và "cannot find symbol" của javac</td><td>slide 20–22</td></tr>
<tr><td>đọc số bằng Scanner + parseInt và in bằng format</td><td>slide 23</td></tr>
</tbody>
</table>
<p>Tiếp theo: deck <em>Numbers and Strings</em> (bài 1.E–1.F) — lớp bao, Math, String và StringBuilder, Scanner và xuất có định dạng.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>Why does <code>long x = 2147483647 + 1;</code> store a negative number, and how do you fix it with one character?</li>
<li>After <code>int[] a = {1, 2}; int[] b = a; b[0] = 9;</code>, what is <code>a[0]</code>? Draw the stack and the heap.</li>
<li>Name two scopes the slide lists that do not exist in Java, and two that do.</li>
</ul>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Vì sao <code>long x = 2147483647 + 1;</code> cất vào một số âm, và sửa bằng đúng một ký tự thế nào?</li>
<li>Sau <code>int[] a = {1, 2}; int[] b = a; b[0] = 9;</code> thì <code>a[0]</code> bằng bao nhiêu? Vẽ stack và heap.</li>
<li>Kể hai phạm vi slide liệt kê nhưng Java không có, và hai phạm vi Java có.</li>
</ul>`),
    books([
      ['horstmann1', 'Ch. 3 "Fundamental Programming Structures in Java" (3.2–3.10: data types, variables, operators, strings, input/output, control flow, arrays)', 'Chương 3 "Fundamental Programming Structures in Java" (3.2–3.10: kiểu dữ liệu, biến, toán tử, chuỗi, nhập/xuất, điều khiển, mảng)'],
      ['javaTutorial', 'trail "Learning the Java Language" — lesson "Language Basics"', 'trail "Learning the Java Language" — bài "Language Basics"'],
      ['jls8', '§3.8–3.10 (identifiers, keywords, literals), §4.2 (primitive types), §5.1–5.2 (conversions), §14.11 (switch), §15.7 (evaluation order)', '§3.8–3.10 (định danh, từ khoá, literal), §4.2 (kiểu nguyên thủy), §5.1–5.2 (chuyển kiểu), §14.11 (switch), §15.7 (thứ tự tính)'],
      ['fuOffline', 'part "Foundations" — data types, scope', 'phần "Foundations" — kiểu dữ liệu, phạm vi'],
    ]),
  ].join('\n'),
};

/* ───────── 1.E — 📑 Slide by slide · Numbers and Strings (1/2): wrapper classes, Math, autoboxing, Character (slides 1–13) ───────── */
const L_pro5_1 = {
  title: '1.E — 📑 Slide by slide · Numbers and Strings (1/2): wrapper classes, Math, autoboxing, Character (slides 1–13)|||1.E — 📑 Học theo từng slide · Numbers and Strings (1/2): lớp bao, Math, tự đóng/mở hộp, Character (slide 1–13)',
  slug: 'pro192-slide-pro5-1',
  type: 'VIDEO',
  description: 'Giảng slide 1–13 bộ "Numbers and Strings": lớp bao (wrapper) của 8 kiểu nguyên thủy vẽ lại bằng UML, khai báo final của Integer (javac 1.8 báo lỗi thật khi kế thừa), hằng và phương thức parse/valueOf/toBinaryString, tính bất biến, WrapperDemo y như slide chạy trên JDK 8, lớp Math và các ca làm tròn âm, autoboxing với bốn bẫy (bộ đệm Integer 127/128, Long.equals(5), mở hộp null, remove(int) và remove(Object)), lớp Character và bài đếm ký tự kiểu PE.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.E · school deck "Numbers and Strings", slides 1–13</span>
<h2>Every primitive has an object twin — and the twin has rules of its own</h2>
<p class="lead">Deck 1.D stayed with primitives. This deck introduces the classes that <em>wrap</em> them — <code>Integer</code>, <code>Double</code>, <code>Character</code>… — plus <code>Math</code> and, in lesson 1.F, the String family. You use wrappers every day without noticing (<code>Integer.parseInt</code>, <code>ArrayList&lt;Integer&gt;</code>), and FE loves the places where the twin behaves differently from the primitive: <code>==</code> on two <code>Integer</code>s, unboxing <code>null</code>, <code>remove(1)</code> on a list of numbers.</p>
<div class="callout"><strong>Exam JDK vs modern JDK.</strong> The slides use <code>new Integer(5)</code>. It compiles and runs on JDK 8 (the run below is a real JDK 8), but it has been deprecated since Java 9 and marked for removal since Java 16 — in your own code write <code>Integer.valueOf(5)</code> or simply <code>Integer x = 5;</code>.</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.E · bộ slide "Numbers and Strings" của trường, slide 1–13</span>
<h2>Mỗi kiểu nguyên thủy có một "người anh em" là đối tượng — và người anh em đó có luật riêng</h2>
<p class="lead">Bài 1.D ở với kiểu nguyên thủy. Bộ slide này giới thiệu các lớp <em>bọc (wrap)</em> chúng — <code>Integer</code>, <code>Double</code>, <code>Character</code>… — cộng lớp <code>Math</code> và, ở bài 1.F, họ String. Bạn dùng lớp bao hằng ngày mà không để ý (<code>Integer.parseInt</code>, <code>ArrayList&lt;Integer&gt;</code>), và FE rất thích những chỗ "người anh em" cư xử khác kiểu nguyên thủy: <code>==</code> trên hai <code>Integer</code>, mở hộp <code>null</code>, <code>remove(1)</code> trên danh sách số.</p>
<div class="callout"><strong>JDK phòng thi và JDK hiện đại.</strong> Slide dùng <code>new Integer(5)</code>. Nó biên dịch và chạy được trên JDK 8 (lần chạy bên dưới là JDK 8 thật), nhưng đã bị đánh dấu lỗi thời (deprecated) từ Java 9 và đánh dấu sẽ xoá từ Java 16 — code của bạn hãy viết <code>Integer.valueOf(5)</code> hoặc đơn giản <code>Integer x = 5;</code>.</div>`),
    walkHead('pro5', 1, 13),
    walk('pro5', [
      [1, 'Numbers and Strings',
        `<p class="y-chinh">🎯 Title slide with three links: the tutorial trail "Numbers and Strings", the Java SE 8 documentation home (docs.oracle.com/javase/8/docs) and the page to download the JDK 8 documentation for offline use.</p>
<p>The third link is the useful one for the exam room: the PE allows "your own study materials stored on your computer", and the downloaded API documentation (a folder of HTML pages) is exactly that — open <code>api/index.html</code> and search for <code>String</code> or <code>Collections</code> without internet. The old technetwork URL on the slide now redirects; search "Java SE 8 Documentation download" on oracle.com.</p>
<p class="meo">🧠 Bookmark docs.oracle.com/javase/8/docs/api — the class list on the left and the "Method Summary" table of each class answer most "which method…?" questions faster than any search engine.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề với ba link: trail "Numbers and Strings" của bộ hướng dẫn, trang chủ tài liệu Java SE 8 (docs.oracle.com/javase/8/docs) và trang tải tài liệu JDK 8 để dùng không cần mạng.</p>
<p>Link thứ ba mới là cái có ích ở phòng thi: PE cho phép "tài liệu học tập của riêng bạn lưu trên máy", và bộ tài liệu API tải về (một thư mục trang HTML) đúng là thứ đó — mở <code>api/index.html</code> rồi tìm <code>String</code> hay <code>Collections</code> mà không cần internet. URL technetwork cũ trên slide giờ đã chuyển hướng; hãy tìm "Java SE 8 Documentation download" trên oracle.com.</p>
<p class="meo">🧠 Đánh dấu docs.oracle.com/javase/8/docs/api — danh sách lớp bên trái và bảng "Method Summary" của mỗi lớp trả lời phần lớn câu hỏi "phương thức nào…?" nhanh hơn mọi công cụ tìm kiếm.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Working with numbers (the wrapper classes Number and Character, autoboxing and unboxing, <code>java.lang.Math</code>) and with strings (create and manipulate them, compare String and StringBuilder, scan text, format output).</p>
<table>
<thead><tr><th>Objective</th><th>Slides</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>Wrapper classes, Integer, Number</td><td>3–9</td><td>1.E</td></tr>
<tr><td>Math, autoboxing/unboxing, Character</td><td>10–13</td><td>1.E</td></tr>
<tr><td>String, string pool, String methods</td><td>14–19</td><td>1.F</td></tr>
<tr><td>StringBuffer / StringBuilder, concatenation</td><td>20–23</td><td>1.F</td></tr>
<tr><td>Scanner, splitting strings</td><td>24–27</td><td>1.F</td></tr>
<tr><td>Formatted output (format, DecimalFormat)</td><td>28–29</td><td>1.F</td></tr>
</tbody>
</table>
<p>Why this matters for the PE: question 4 of most real papers is "implement <code>f1(String)</code> and <code>f2(String)</code>" — counting digits, reversing words, building a new string. Everything needed for it is in this deck.</p>`,
        `<p class="y-chinh">🎯 Làm việc với số (các lớp bao Number và Character, tự đóng hộp và mở hộp, <code>java.lang.Math</code>) và với chuỗi (tạo và xử lý chuỗi, so sánh String với StringBuilder, quét văn bản, định dạng xuất).</p>
<table>
<thead><tr><th>Mục tiêu</th><th>Slide</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>Lớp bao, Integer, Number</td><td>3–9</td><td>1.E</td></tr>
<tr><td>Math, đóng/mở hộp, Character</td><td>10–13</td><td>1.E</td></tr>
<tr><td>String, string pool, phương thức String</td><td>14–19</td><td>1.F</td></tr>
<tr><td>StringBuffer / StringBuilder, nối chuỗi</td><td>20–23</td><td>1.F</td></tr>
<tr><td>Scanner, tách chuỗi</td><td>24–27</td><td>1.F</td></tr>
<tr><td>Xuất có định dạng (format, DecimalFormat)</td><td>28–29</td><td>1.F</td></tr>
</tbody>
</table>
<p>Vì sao quan trọng với PE: câu 4 của phần lớn đề thật là "cài đặt <code>f1(String)</code> và <code>f2(String)</code>" — đếm chữ số, đảo từ, dựng chuỗi mới. Mọi thứ cần cho nó nằm trong bộ slide này.</p>`],
      [3, 'Introduction',
        `<p class="y-chinh">🎯 Some operations on numbers are critical (for example converting a string to a number); Java libraries have classes that wrap a primitive number and support operations on it — the <strong>wrapper classes</strong>; <code>String</code> is a common, predefined class; all of them are in the <code>java.lang</code> package.</p>
<p>The first bullet ("a class can contain no data field or some data fields") is a leftover from an earlier deck; the idea that matters is the second one. A primitive has no methods — you cannot write <code>5.toString()</code> — so Java puts each primitive inside a small class that does: <code>Integer.parseInt("12")</code>, <code>Double.valueOf("2.5")</code>, <code>Character.isDigit('7')</code>.</p>
<table>
<thead><tr><th>Primitive</th><th>Wrapper</th><th>Primitive</th><th>Wrapper</th></tr></thead>
<tbody>
<tr><td><code>byte</code></td><td><code>Byte</code></td><td><code>float</code></td><td><code>Float</code></td></tr>
<tr><td><code>short</code></td><td><code>Short</code></td><td><code>double</code></td><td><code>Double</code></td></tr>
<tr><td><code>int</code></td><td><code>Integer</code></td><td><code>char</code></td><td><code>Character</code></td></tr>
<tr><td><code>long</code></td><td><code>Long</code></td><td><code>boolean</code></td><td><code>Boolean</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 Only two names are not "the primitive with a capital letter": <code>int → Integer</code> and <code>char → Character</code>. Because <code>java.lang</code> is imported automatically, you never import them.</p>`,
        `<p class="y-chinh">🎯 Một số thao tác trên số là rất quan trọng (ví dụ đổi chuỗi sang số); thư viện Java có các lớp bọc một số nguyên thủy và hỗ trợ thao tác trên nó — gọi là <strong>lớp bao (wrapper class)</strong>; <code>String</code> là một lớp thông dụng định nghĩa sẵn; tất cả nằm trong gói <code>java.lang</code>.</p>
<p>Gạch đầu dòng thứ nhất ("một lớp có thể không có hoặc có vài trường dữ liệu") là phần sót lại từ một deck trước; ý quan trọng là gạch thứ hai. Kiểu nguyên thủy không có phương thức — không viết được <code>5.toString()</code> — nên Java đặt mỗi kiểu nguyên thủy vào một lớp nhỏ có phương thức: <code>Integer.parseInt("12")</code>, <code>Double.valueOf("2.5")</code>, <code>Character.isDigit('7')</code>.</p>
<table>
<thead><tr><th>Nguyên thủy</th><th>Lớp bao</th><th>Nguyên thủy</th><th>Lớp bao</th></tr></thead>
<tbody>
<tr><td><code>byte</code></td><td><code>Byte</code></td><td><code>float</code></td><td><code>Float</code></td></tr>
<tr><td><code>short</code></td><td><code>Short</code></td><td><code>double</code></td><td><code>Double</code></td></tr>
<tr><td><code>int</code></td><td><code>Integer</code></td><td><code>char</code></td><td><code>Character</code></td></tr>
<tr><td><code>long</code></td><td><code>Long</code></td><td><code>boolean</code></td><td><code>Boolean</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 Chỉ có hai tên không phải "kiểu nguyên thủy viết hoa chữ đầu": <code>int → Integer</code> và <code>char → Character</code>. Vì <code>java.lang</code> được import tự động, bạn không bao giờ phải import chúng.</p>`],
      [4, 'Numbers Classes',
        `<p class="y-chinh">🎯 The Java platform provides a wrapper class for each primitive type; the hierarchy (from the API docs): <code>Object</code> → <code>Boolean</code>, <code>Character</code>, <code>Math</code>, <code>Number</code> → <code>Byte</code>, <code>Double</code>, <code>Float</code>, <code>Integer</code>, <code>Long</code>, <code>Short</code>; all numeric wrappers are subclasses of the <strong>abstract class</strong> <code>Number</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/4b15a319ebcccbc2fe0b95c05f68ead0b0cdd02a.svg" alt="Slides 4–7 redrawn in UML: the six numeric wrappers under the abstract Number; Boolean and Character beside them" loading="lazy" /><p class="chu-thich">🧩 Slides 4–7 redrawn in UML: the six numeric wrappers under the abstract Number; Boolean and Character beside them</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 4–7 redrawn — the wrapper classes in UML
' Six numeric wrappers extend the abstract class Number; Boolean and Character do not
class Object
abstract class Number {
  + {abstract} intValue() : int
  + {abstract} longValue() : long
  + {abstract} doubleValue() : double
  + byteValue() : byte
}
interface "Comparable&lt;T&gt;" as Comparable {
  + compareTo(o : T) : int
}
interface Serializable &lt;&lt;marker, no methods&gt;&gt;
class Byte &lt;&lt;final&gt;&gt;
class Short &lt;&lt;final&gt;&gt;
class "Integer" as Integer &lt;&lt;final&gt;&gt; {
  + {static} MAX_VALUE : int
  + {static} MIN_VALUE : int
  + {static} parseInt(s : String) : int
  + {static} valueOf(i : int) : Integer
}
class Long &lt;&lt;final&gt;&gt;
class Float &lt;&lt;final&gt;&gt;
class Double &lt;&lt;final&gt;&gt;
class Boolean &lt;&lt;final&gt;&gt;
class Character &lt;&lt;final&gt;&gt;
Object &lt;|-- Number
Object &lt;|-- Boolean
Object &lt;|-- Character
Number &lt;|-- Byte
Number &lt;|-- Short
Number &lt;|-- Integer
Number &lt;|-- Long
Number &lt;|-- Float
Number &lt;|-- Double
Number ..|&gt; Serializable
Integer ..|&gt; Comparable
note bottom of Integer
  final: no subclass allowed
  no setter: immutable
end note
@enduml</code></pre></details>
<p>Read the diagram from the top: <code>Number</code> is abstract (you cannot write <code>new Number()</code>) and declares <code>intValue()</code>, <code>doubleValue()</code>… so any numeric wrapper can be converted to any primitive. <code>Boolean</code> and <code>Character</code> are <em>not</em> numbers. The slide's picture also lists <code>Math</code> and <code>Character.Subset</code> because it copies the API "class hierarchy" page — they are not wrappers.</p>
<p>That is your first real class hierarchy, and it previews Chapters 4–5: an abstract superclass, final subclasses, an interface (<code>Comparable</code>) implemented by each.</p>
<div class="pitfall">FE trap: "Which class is the superclass of Integer?" — <code>Number</code>, not <code>Object</code> directly and not <code>Long</code>.</div>`,
        `<p class="y-chinh">🎯 Nền tảng Java cung cấp một lớp bao cho mỗi kiểu nguyên thủy; cây kế thừa (lấy từ tài liệu API): <code>Object</code> → <code>Boolean</code>, <code>Character</code>, <code>Math</code>, <code>Number</code> → <code>Byte</code>, <code>Double</code>, <code>Float</code>, <code>Integer</code>, <code>Long</code>, <code>Short</code>; mọi lớp bao số đều là lớp con của <strong>lớp trừu tượng (abstract class)</strong> <code>Number</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/4b15a319ebcccbc2fe0b95c05f68ead0b0cdd02a.svg" alt="Slide 4–7 vẽ lại bằng UML: sáu lớp bao số dưới lớp trừu tượng Number; Boolean và Character đứng bên cạnh" loading="lazy" /><p class="chu-thich">🧩 Slide 4–7 vẽ lại bằng UML: sáu lớp bao số dưới lớp trừu tượng Number; Boolean và Character đứng bên cạnh</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 4–7 redrawn — the wrapper classes in UML
' Sáu lớp bao số kế thừa lớp trừu tượng Number; Boolean và Character thì không
class Object
abstract class Number {
  + {abstract} intValue() : int
  + {abstract} longValue() : long
  + {abstract} doubleValue() : double
  + byteValue() : byte
}
interface "Comparable&lt;T&gt;" as Comparable {
  + compareTo(o : T) : int
}
interface Serializable &lt;&lt;marker, no methods&gt;&gt;
class Byte &lt;&lt;final&gt;&gt;
class Short &lt;&lt;final&gt;&gt;
class "Integer" as Integer &lt;&lt;final&gt;&gt; {
  + {static} MAX_VALUE : int
  + {static} MIN_VALUE : int
  + {static} parseInt(s : String) : int
  + {static} valueOf(i : int) : Integer
}
class Long &lt;&lt;final&gt;&gt;
class Float &lt;&lt;final&gt;&gt;
class Double &lt;&lt;final&gt;&gt;
class Boolean &lt;&lt;final&gt;&gt;
class Character &lt;&lt;final&gt;&gt;
Object &lt;|-- Number
Object &lt;|-- Boolean
Object &lt;|-- Character
Number &lt;|-- Byte
Number &lt;|-- Short
Number &lt;|-- Integer
Number &lt;|-- Long
Number &lt;|-- Float
Number &lt;|-- Double
Number ..|&gt; Serializable
Integer ..|&gt; Comparable
note bottom of Integer
  final: no subclass allowed
  no setter: immutable
end note
@enduml</code></pre></details>
<p>Đọc sơ đồ từ trên xuống: <code>Number</code> là trừu tượng (không viết được <code>new Number()</code>) và khai báo <code>intValue()</code>, <code>doubleValue()</code>… nên lớp bao số nào cũng đổi được sang kiểu nguyên thủy nào. <code>Boolean</code> và <code>Character</code> <em>không</em> phải số. Hình trên slide còn có <code>Math</code> và <code>Character.Subset</code> vì nó chép trang "class hierarchy" của API — chúng không phải lớp bao.</p>
<p>Đây là cây lớp thật đầu tiên của bạn, và nó báo trước Chương 4–5: một lớp cha trừu tượng, các lớp con final, một interface (<code>Comparable</code>) mà lớp nào cũng cài đặt.</p>
<div class="pitfall">Bẫy FE: "Lớp cha của Integer là lớp nào?" — <code>Number</code>, không phải trực tiếp <code>Object</code>, cũng không phải <code>Long</code>.</div>`],
      [5, 'Numbers Classes: A Declaration',
        `<p class="y-chinh">🎯 The declaration <code>public final class Integer extends Number implements Comparable&lt;Integer&gt;</code> and its fields: <code>static int BYTES</code> (bytes in two's complement), <code>MAX_VALUE</code> (2<sup>31</sup>−1), <code>MIN_VALUE</code> (−2<sup>31</sup>), <code>SIZE</code> (bits), <code>static Class&lt;Integer&gt; TYPE</code> (the primitive type <code>int</code>).</p>
<pre class="trich"><code class="language-java">System.out.println("Integer.MAX_VALUE = " + Integer.MAX_VALUE + ", SIZE = " + Integer.SIZE + " bits, BYTES = " + Integer.BYTES);
System.out.println("Integer.TYPE = " + Integer.TYPE + ", Double.MIN_VALUE = " + Double.MIN_VALUE);
Number n = Integer.valueOf(65);            // every numeric wrapper IS-A Number
System.out.println("Number n = 65 -&gt; doubleValue " + n.doubleValue() + ", byteValue " + n.byteValue());</code></pre>
<p>Every word of the declaration is a chapter of PRO192: <code>final</code> (no subclass — next slide), <code>extends Number</code> (inheritance, Ch. 4), <code>implements Comparable&lt;Integer&gt;</code> (an interface with <code>compareTo</code>, Ch. 5 — it is why <code>Collections.sort</code> can sort a list of Integers, deck pro6). The fields are <code>static</code>: they belong to the class, so you write <code>Integer.MAX_VALUE</code>, not <code>x.MAX_VALUE</code>.</p>
<p><code>BYTES</code> was added in Java 8 — fine for the exam JDK. The output of this program is shown under slide 7.</p>
<p class="meo">🧠 Use <code>Integer.MAX_VALUE</code> as the starting value when you look for a minimum in a loop, <code>Integer.MIN_VALUE</code> when you look for a maximum.</p>`,
        `<p class="y-chinh">🎯 Khai báo <code>public final class Integer extends Number implements Comparable&lt;Integer&gt;</code> và các trường của nó: <code>static int BYTES</code> (số byte theo bù hai), <code>MAX_VALUE</code> (2<sup>31</sup>−1), <code>MIN_VALUE</code> (−2<sup>31</sup>), <code>SIZE</code> (số bit), <code>static Class&lt;Integer&gt; TYPE</code> (kiểu nguyên thủy <code>int</code>).</p>
<pre class="trich"><code class="language-java">System.out.println("Integer.MAX_VALUE = " + Integer.MAX_VALUE + ", SIZE = " + Integer.SIZE + " bits, BYTES = " + Integer.BYTES);
System.out.println("Integer.TYPE = " + Integer.TYPE + ", Double.MIN_VALUE = " + Double.MIN_VALUE);
Number n = Integer.valueOf(65);            // mọi lớp bao số ĐỀU LÀ Number
System.out.println("Number n = 65 -&gt; doubleValue " + n.doubleValue() + ", byteValue " + n.byteValue());</code></pre>
<p>Mỗi chữ trong khai báo là một chương của PRO192: <code>final</code> (không có lớp con — slide sau), <code>extends Number</code> (kế thừa, Ch. 4), <code>implements Comparable&lt;Integer&gt;</code> (một interface có <code>compareTo</code>, Ch. 5 — chính nhờ nó mà <code>Collections.sort</code> sắp được danh sách Integer, deck pro6). Các trường là <code>static</code>: thuộc về lớp, nên viết <code>Integer.MAX_VALUE</code>, không viết <code>x.MAX_VALUE</code>.</p>
<p><code>BYTES</code> được thêm ở Java 8 — dùng được trên JDK phòng thi. Output của chương trình này hiện dưới slide 7.</p>
<p class="meo">🧠 Dùng <code>Integer.MAX_VALUE</code> làm giá trị khởi đầu khi tìm nhỏ nhất trong vòng lặp, <code>Integer.MIN_VALUE</code> khi tìm lớn nhất.</p>`],
      [6, 'Numbers Classes: A Declaration',
        `<p class="y-chinh">🎯 The two constructors <code>Integer(int value)</code> and <code>Integer(String s)</code>, and the consequence of <code>final</code>: we cannot create a subclass of a wrapper class.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "MyInteger.java",
        "public class MyInteger extends Integer {\\n" +
        "    public MyInteger(int v) { super(v); }\\n" +
        "}\\n");
    lenh(d, "javac", "MyInteger.java");
}</code></pre>
<div class="out">&gt; javac MyInteger.java<br>
MyInteger.java:1: error: cannot inherit from final Integer<br>
public class MyInteger extends Integer {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>javac 1.8's exact message: <code>cannot inherit from final Integer</code>. Why the designers made the wrappers final: their values are shared and cached (slide 12), used as keys in maps and passed everywhere — a subclass that changed <code>equals</code> or the value could break every program that trusts an <code>Integer</code> to be an integer.</p>
<p>⚠️ Out of date: both constructors are <strong>deprecated since Java 9</strong> and "for removal" since Java 16. They still work on JDK 8 (and on 17 with a warning); the replacements are <code>Integer.valueOf(int)</code>, <code>Integer.valueOf(String)</code> or autoboxing (<code>Integer x = 5;</code>), which can reuse cached objects.</p>
<div class="pitfall">FE trap: "<code>new Integer("12a")</code> returns 0" — no, it throws <code>NumberFormatException</code>, exactly like <code>Integer.parseInt("12a")</code>.</div>`,
        `<p class="y-chinh">🎯 Hai constructor <code>Integer(int value)</code> và <code>Integer(String s)</code>, và hệ quả của <code>final</code>: không thể tạo lớp con của một lớp bao.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "MyInteger.java",
        "public class MyInteger extends Integer {\\n" +
        "    public MyInteger(int v) { super(v); }\\n" +
        "}\\n");
    lenh(d, "javac", "MyInteger.java");
}</code></pre>
<div class="out">&gt; javac MyInteger.java<br>
MyInteger.java:1: error: cannot inherit from final Integer<br>
public class MyInteger extends Integer {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>Nguyên văn của javac 1.8: <code>cannot inherit from final Integer</code> (không thể kế thừa lớp final Integer). Vì sao người thiết kế cho lớp bao là final: giá trị của chúng được dùng chung và lưu đệm (slide 12), làm khoá trong map và được truyền đi khắp nơi — một lớp con đổi <code>equals</code> hay đổi giá trị có thể làm hỏng mọi chương trình đang tin <code>Integer</code> là một số nguyên.</p>
<p>⚠️ Đã lỗi thời: cả hai constructor bị <strong>deprecated từ Java 9</strong> và "sắp xoá" từ Java 16. Chúng vẫn chạy trên JDK 8 (và trên 17 kèm cảnh báo); thay bằng <code>Integer.valueOf(int)</code>, <code>Integer.valueOf(String)</code> hoặc tự đóng hộp (<code>Integer x = 5;</code>), những cách có thể dùng lại đối tượng đã lưu đệm.</p>
<div class="pitfall">Bẫy FE: "<code>new Integer("12a")</code> trả về 0" — sai, nó ném <code>NumberFormatException</code>, y như <code>Integer.parseInt("12a")</code>.</div>`],
      [7, 'Numbers Classes: A Declaration',
        `<p class="y-chinh">🎯 Some common methods of <code>Integer</code> (the Method Summary table: <code>xxxValue</code>, <code>compare</code>, <code>compareTo</code>, <code>parseInt(s)</code>, <code>parseInt(s, radix)</code>, <code>toBinaryString</code>, <code>toHexString</code>, <code>toOctalString</code>, <code>toString(i, radix)</code>, <code>valueOf</code>…); wrapper classes are <strong>immutable</strong> because they do not have setters.</p>
<pre class="trich"><code class="language-java">System.out.println("parseInt(\\"1234\\") = " + Integer.parseInt("1234") + ", parseInt(\\"1A\\", 16) = " + Integer.parseInt("1A", 16)
    + ", parseInt(\\"-101\\", 2) = " + Integer.parseInt("-101", 2));
System.out.println("toBinaryString(10) = " + Integer.toBinaryString(10) + ", toHexString(255) = " + Integer.toHexString(255)
    + ", toOctalString(8) = " + Integer.toOctalString(8) + ", toString(255, 2) = " + Integer.toString(255, 2));
System.out.println("Double.parseDouble(\\"2.5e3\\") = " + Double.parseDouble("2.5e3") + ", Boolean.parseBoolean(\\"TRUE\\") = "
    + Boolean.parseBoolean("TRUE") + ", (\\"yes\\") = " + Boolean.parseBoolean("yes"));
System.out.println("Integer.compare(3, 7) = " + Integer.compare(3, 7) + ", Integer.max(3, 7) = " + Integer.max(3, 7)
    + ", Integer.valueOf(7).compareTo(3) = " + Integer.valueOf(7).compareTo(3));
try {
    Integer.parseInt(" 12");                // a space is not a digit
} catch (NumberFormatException e) {
    System.out.println("parseInt(\\" 12\\") -&gt; " + e.getMessage());
}
System.out.println("parseInt(\\" 12\\".trim()) = " + Integer.parseInt(" 12".trim()));</code></pre>
<pre class="trich"><code class="language-java">Integer a = 5;
Integer b = a;                              // two names, one Integer object
a++;                                        // creates a NEW Integer(6); the old 5 is untouched
System.out.println("a = " + a + ", b = " + b + "  (Integer has no setter: it is immutable)");</code></pre>
<div class="out">Integer.MAX_VALUE = 2147483647, SIZE = 32 bits, BYTES = 4<br>
Integer.TYPE = int, Double.MIN_VALUE = 4.9E-324<br>
Number n = 65 -&gt; doubleValue 65.0, byteValue 65<br>
parseInt("1234") = 1234, parseInt("1A", 16) = 26, parseInt("-101", 2) = -5<br>
toBinaryString(10) = 1010, toHexString(255) = ff, toOctalString(8) = 10, toString(255, 2) = 11111111<br>
Double.parseDouble("2.5e3") = 2500.0, Boolean.parseBoolean("TRUE") = true, ("yes") = false<br>
Integer.compare(3, 7) = -1, Integer.max(3, 7) = 7, Integer.valueOf(7).compareTo(3) = 1<br>
parseInt(" 12") -&gt; For input string: " 12"<br>
parseInt(" 12".trim()) = 12<br>
a = 6, b = 5 &nbsp;(Integer has no setter: it is immutable)</div>
<p>The methods you will actually use: <code>parseInt</code> (String → int, the radix version reads hex or binary), <code>valueOf</code> (→ Integer object), <code>toBinaryString</code>/<code>toString(i, 2)</code> (int → digits in base 2), <code>compare(a, b)</code> (negative, 0 or positive — the safe way to write a comparator, deck pro6). <code>parseInt(" 12")</code> fails because of the space: <strong>trim the input first</strong>. <code>Boolean.parseBoolean</code> never throws: anything except "true" (any case) is <code>false</code>.</p>
<p><strong>Immutable</strong> is proven by the last line: <code>a++</code> did not change the Integer object 5, it created a new Integer 6 and moved <code>a</code> to it; <code>b</code> still sees 5. The same is true of <code>String</code> (lesson 1.F).</p>
<div class="pitfall">PE trap: "do not use built-in methods such as Integer.toBinaryString()" appears in real papers (PE1 Q4) — then convert by repeated division by 2, and use the built-in only to check yourself.</div>`,
        `<p class="y-chinh">🎯 Một số phương thức thông dụng của <code>Integer</code> (bảng Method Summary: <code>xxxValue</code>, <code>compare</code>, <code>compareTo</code>, <code>parseInt(s)</code>, <code>parseInt(s, radix)</code>, <code>toBinaryString</code>, <code>toHexString</code>, <code>toOctalString</code>, <code>toString(i, radix)</code>, <code>valueOf</code>…); lớp bao là <strong>bất biến (immutable)</strong> vì chúng không có setter.</p>
<pre class="trich"><code class="language-java">System.out.println("parseInt(\\"1234\\") = " + Integer.parseInt("1234") + ", parseInt(\\"1A\\", 16) = " + Integer.parseInt("1A", 16)
    + ", parseInt(\\"-101\\", 2) = " + Integer.parseInt("-101", 2));
System.out.println("toBinaryString(10) = " + Integer.toBinaryString(10) + ", toHexString(255) = " + Integer.toHexString(255)
    + ", toOctalString(8) = " + Integer.toOctalString(8) + ", toString(255, 2) = " + Integer.toString(255, 2));
System.out.println("Double.parseDouble(\\"2.5e3\\") = " + Double.parseDouble("2.5e3") + ", Boolean.parseBoolean(\\"TRUE\\") = "
    + Boolean.parseBoolean("TRUE") + ", (\\"yes\\") = " + Boolean.parseBoolean("yes"));
System.out.println("Integer.compare(3, 7) = " + Integer.compare(3, 7) + ", Integer.max(3, 7) = " + Integer.max(3, 7)
    + ", Integer.valueOf(7).compareTo(3) = " + Integer.valueOf(7).compareTo(3));
try {
    Integer.parseInt(" 12");                // dấu cách không phải chữ số
} catch (NumberFormatException e) {
    System.out.println("parseInt(\\" 12\\") -&gt; " + e.getMessage());
}
System.out.println("parseInt(\\" 12\\".trim()) = " + Integer.parseInt(" 12".trim()));</code></pre>
<pre class="trich"><code class="language-java">Integer a = 5;
Integer b = a;                              // hai tên, một đối tượng Integer
a++;                                        // tạo Integer(6) MỚI; số 5 cũ không đổi
System.out.println("a = " + a + ", b = " + b + "  (Integer has no setter: it is immutable)");</code></pre>
<div class="out">Integer.MAX_VALUE = 2147483647, SIZE = 32 bits, BYTES = 4<br>
Integer.TYPE = int, Double.MIN_VALUE = 4.9E-324<br>
Number n = 65 -&gt; doubleValue 65.0, byteValue 65<br>
parseInt("1234") = 1234, parseInt("1A", 16) = 26, parseInt("-101", 2) = -5<br>
toBinaryString(10) = 1010, toHexString(255) = ff, toOctalString(8) = 10, toString(255, 2) = 11111111<br>
Double.parseDouble("2.5e3") = 2500.0, Boolean.parseBoolean("TRUE") = true, ("yes") = false<br>
Integer.compare(3, 7) = -1, Integer.max(3, 7) = 7, Integer.valueOf(7).compareTo(3) = 1<br>
parseInt(" 12") -&gt; For input string: " 12"<br>
parseInt(" 12".trim()) = 12<br>
a = 6, b = 5 &nbsp;(Integer has no setter: it is immutable)</div>
<p>Những phương thức bạn sẽ thật sự dùng: <code>parseInt</code> (String → int, bản có radix đọc được hệ 16 hay hệ 2), <code>valueOf</code> (→ đối tượng Integer), <code>toBinaryString</code>/<code>toString(i, 2)</code> (int → chữ số hệ 2), <code>compare(a, b)</code> (âm, 0 hoặc dương — cách an toàn để viết comparator, deck pro6). <code>parseInt(" 12")</code> hỏng vì dấu cách: <strong>trim dữ liệu nhập trước</strong>. <code>Boolean.parseBoolean</code> không bao giờ ném lỗi: mọi thứ khác "true" (hoa thường tuỳ ý) đều là <code>false</code>.</p>
<p><strong>Bất biến</strong> được chứng minh ở dòng cuối: <code>a++</code> không đổi đối tượng Integer 5, nó tạo một Integer 6 mới và chuyển <code>a</code> sang đó; <code>b</code> vẫn thấy 5. <code>String</code> cũng y như vậy (bài 1.F).</p>
<div class="pitfall">Bẫy PE: câu "không được dùng phương thức có sẵn như Integer.toBinaryString()" có trong đề thật (PE1 câu 4) — khi đó đổi bằng cách chia 2 liên tiếp, và chỉ dùng hàm có sẵn để tự kiểm tra.</div>`],
      [8, 'Numbers Classes…',
        `<p class="y-chinh">🎯 Use a Number object rather than a primitive when (1) a method expects an object, (2) you need constants of the class such as <code>MIN_VALUE</code>/<code>MAX_VALUE</code>, (3) you use class methods to convert values to and from other primitive types and strings.</p>
<p>Reason (1) is the big one today: collections hold <strong>objects only</strong>. <code>ArrayList&lt;int&gt;</code> does not compile; you write <code>ArrayList&lt;Integer&gt;</code> and autoboxing (slide 11) converts for you. Reason (2) and (3) actually need the <em>class</em>, not an object: <code>Integer.MAX_VALUE</code> and <code>Integer.parseInt</code> are static.</p>
<table>
<thead><tr><th>Use the primitive (<code>int</code>)</th><th>Use the wrapper (<code>Integer</code>)</th></tr></thead>
<tbody>
<tr><td>counters, loop indexes, arithmetic</td><td>elements of <code>List</code>, <code>Set</code>, keys/values of <code>Map</code></td></tr>
<tr><td>fields that must always have a value</td><td>a value that may be "missing" (<code>null</code>), e.g. an optional field read from a file or a database</td></tr>
<tr><td>performance-critical code</td><td>generic code (<code>Comparator&lt;Integer&gt;</code>, Chapter 8)</td></tr>
</tbody>
</table>
<p class="meo">🧠 Default to the primitive; switch to the wrapper only when a collection or a possible <code>null</code> forces you.</p>`,
        `<p class="y-chinh">🎯 Dùng đối tượng Number thay vì kiểu nguyên thủy khi (1) một phương thức đòi đối tượng, (2) cần hằng của lớp như <code>MIN_VALUE</code>/<code>MAX_VALUE</code>, (3) dùng phương thức của lớp để đổi giá trị qua lại với kiểu nguyên thủy khác và chuỗi.</p>
<p>Lý do (1) là quan trọng nhất ngày nay: collection chỉ chứa <strong>đối tượng</strong>. <code>ArrayList&lt;int&gt;</code> không biên dịch được; bạn viết <code>ArrayList&lt;Integer&gt;</code> và cơ chế tự đóng hộp (slide 11) đổi giúp bạn. Lý do (2) và (3) thật ra cần <em>lớp</em>, không cần đối tượng: <code>Integer.MAX_VALUE</code> và <code>Integer.parseInt</code> là static.</p>
<table>
<thead><tr><th>Dùng kiểu nguyên thủy (<code>int</code>)</th><th>Dùng lớp bao (<code>Integer</code>)</th></tr></thead>
<tbody>
<tr><td>biến đếm, chỉ số vòng lặp, tính toán</td><td>phần tử của <code>List</code>, <code>Set</code>, khoá/giá trị của <code>Map</code></td></tr>
<tr><td>trường luôn phải có giá trị</td><td>giá trị có thể "thiếu" (<code>null</code>), vd một trường tuỳ chọn đọc từ tệp hay cơ sở dữ liệu</td></tr>
<tr><td>code cần tốc độ</td><td>code generic (<code>Comparator&lt;Integer&gt;</code>, Chương 8)</td></tr>
</tbody>
</table>
<p class="meo">🧠 Mặc định dùng kiểu nguyên thủy; chỉ chuyển sang lớp bao khi collection hoặc khả năng <code>null</code> bắt buộc.</p>`],
      [9, 'Numbers Classes- A Demo',
        `<p class="y-chinh">🎯 <code>WrapperDemo</code>: <code>int x = 5;</code> stores 5 itself, <code>Integer obj = new Integer(5);</code> stores a reference to an object containing 5; <strong>boxing</strong> wraps a primitive value into an object, <strong>unboxing</strong> takes the primitive value out of a wrapper object.</p>
<pre><code class="language-java">// chay: jdk8
// Slide 9: the school's WrapperDemo, exactly as on the slide (new Integer(...) is fine on JDK 8, deprecated since JDK 9)
public class WrapperDemo {
    public static void main(String[] args) {
        int n = 7;
        Integer intObj = new Integer(5);
        System.out.println(intObj);
        System.out.println(intObj.toString());
        intObj = n;                    // boxing
        System.out.println(intObj);
        int y = intObj * 2;            // unboxing
        int z = intObj.intValue();
        System.out.println("y= " + y + ", z= " + z);
        n = Integer.parseInt("1234");
        System.out.println("n= " + n);
        n = Integer.parseInt("1A", 16);
        System.out.println("n= " + n);
    }
}</code></pre>
<div class="out">5<br>
5<br>
7<br>
y= 14, z= 7<br>
n= 1234<br>
n= 26</div>
<p>Same code and same output as the slide (5, 5, 7, <code>y= 14, z= 7</code>, <code>n= 1234</code>, <code>n= 26</code>), run on a real JDK 8 because of <code>new Integer</code>. Line by line: <code>println(intObj)</code> calls <code>toString()</code> for you; <code>intObj = n</code> boxes 7 into a new Integer; <code>intObj * 2</code> unboxes automatically; <code>intValue()</code> unboxes explicitly; <code>parseInt("1A", 16)</code> reads hexadecimal (1×16 + 10 = 26).</p>
<p>The slide's picture is the reference/value picture of deck 1.D: <code>x</code> is a box with 5 in it; <code>obj</code> is a box with an arrow to another box that holds 5. Comparing two such arrows with <code>==</code> compares arrows, not fives — slide 12.</p>`,
        `<p class="y-chinh">🎯 <code>WrapperDemo</code>: <code>int x = 5;</code> cất chính số 5, <code>Integer obj = new Integer(5);</code> cất tham chiếu tới một đối tượng chứa 5; <strong>đóng hộp (boxing)</strong> là bọc giá trị nguyên thủy vào một đối tượng, <strong>mở hộp (unboxing)</strong> là lấy giá trị nguyên thủy ra khỏi đối tượng bao.</p>
<pre><code class="language-java">// chay: jdk8
// Slide 9: WrapperDemo của trường, y như slide (new Integer(...) chạy tốt trên JDK 8, bị đánh dấu lỗi thời từ JDK 9)
public class WrapperDemo {
    public static void main(String[] args) {
        int n = 7;
        Integer intObj = new Integer(5);
        System.out.println(intObj);
        System.out.println(intObj.toString());
        intObj = n;                    // đóng hộp
        System.out.println(intObj);
        int y = intObj * 2;            // mở hộp
        int z = intObj.intValue();
        System.out.println("y= " + y + ", z= " + z);
        n = Integer.parseInt("1234");
        System.out.println("n= " + n);
        n = Integer.parseInt("1A", 16);
        System.out.println("n= " + n);
    }
}</code></pre>
<div class="out">5<br>
5<br>
7<br>
y= 14, z= 7<br>
n= 1234<br>
n= 26</div>
<p>Cùng code và cùng output với slide (5, 5, 7, <code>y= 14, z= 7</code>, <code>n= 1234</code>, <code>n= 26</code>), chạy trên JDK 8 thật vì có <code>new Integer</code>. Từng dòng: <code>println(intObj)</code> tự gọi <code>toString()</code>; <code>intObj = n</code> đóng hộp 7 vào một Integer mới; <code>intObj * 2</code> tự mở hộp; <code>intValue()</code> mở hộp tường minh; <code>parseInt("1A", 16)</code> đọc hệ mười sáu (1×16 + 10 = 26).</p>
<p>Hình trên slide chính là hình tham chiếu/giá trị của bài 1.D: <code>x</code> là cái hộp có số 5 bên trong; <code>obj</code> là cái hộp có mũi tên chỉ tới một hộp khác chứa 5. So sánh hai mũi tên như vậy bằng <code>==</code> là so mũi tên, không so số 5 — slide 12.</p>`],
      [10, 'The java.lang.Math class',
        `<p class="y-chinh">🎯 <code>java.lang.Math</code> provides constants (<code>Math.E</code>, <code>Math.PI</code>) and static methods: basic (<code>ceil</code>, <code>floor</code>, <code>abs</code>…), exponential and logarithmic (<code>exp</code>, <code>sqrt</code>, <code>pow</code>), trigonometric (<code>cos</code>, <code>sin</code>) and <code>random()</code>, a pseudo-random number between 0.0 and 1.0.</p>
<pre><code class="language-java">// release: 8
// Slide 10: java.lang.Math — every method is static; the rounding family and the edge cases FE likes
public class LopMath {
    public static void main(String[] args) {
        System.out.println("PI = " + Math.PI + ", E = " + Math.E);
        System.out.println("sqrt(16) = " + Math.sqrt(16) + ", pow(2, 10) = " + Math.pow(2, 10) + ", cbrt(27) = " + Math.cbrt(27));
        System.out.println("abs(-7) = " + Math.abs(-7) + ", max(3, 9) = " + Math.max(3, 9) + ", min(2.5, -1) = " + Math.min(2.5, -1));
        System.out.println("hypot(3, 4) = " + Math.hypot(3, 4) + ", cos(0) = " + Math.cos(0) + ", sin(PI/2) = " + Math.sin(Math.PI / 2));
        double[] ds = {2.5, 2.4, -2.5, -2.6};
        System.out.println("   x     ceil   floor  round  rint");
        for (double x : ds)
            System.out.printf("%5.1f  %5.1f  %5.1f  %5d  %5.1f%n", x, Math.ceil(x), Math.floor(x), Math.round(x), Math.rint(x));
        System.out.println("sqrt(-1) = " + Math.sqrt(-1) + ", abs(Integer.MIN_VALUE) = " + Math.abs(Integer.MIN_VALUE));
        int min = 7, max = 0;
        for (int i = 0; i &lt; 100000; i++) {
            int dice = (int) (Math.random() * 6) + 1;     // random() is in [0.0, 1.0)
            if (dice &lt; min) min = dice;
            if (dice &gt; max) max = dice;
        }
        System.out.println("100000 dice rolls with (int)(Math.random()*6)+1 -&gt; smallest " + min + ", largest " + max);
    }
}</code></pre>
<div class="out">PI = 3.141592653589793, E = 2.718281828459045<br>
sqrt(16) = 4.0, pow(2, 10) = 1024.0, cbrt(27) = 3.0<br>
abs(-7) = 7, max(3, 9) = 9, min(2.5, -1) = -1.0<br>
hypot(3, 4) = 5.0, cos(0) = 1.0, sin(PI/2) = 1.0<br>
&nbsp;&nbsp;&nbsp;x &nbsp;&nbsp;&nbsp;&nbsp;ceil &nbsp;&nbsp;floor &nbsp;round &nbsp;rint<br>
&nbsp;&nbsp;2.5 &nbsp;&nbsp;&nbsp;3.0 &nbsp;&nbsp;&nbsp;2.0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;2.0<br>
&nbsp;&nbsp;2.4 &nbsp;&nbsp;&nbsp;3.0 &nbsp;&nbsp;&nbsp;2.0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;2.0<br>
&nbsp;-2.5 &nbsp;&nbsp;-2.0 &nbsp;&nbsp;-3.0 &nbsp;&nbsp;&nbsp;&nbsp;-2 &nbsp;&nbsp;-2.0<br>
&nbsp;-2.6 &nbsp;&nbsp;-2.0 &nbsp;&nbsp;-3.0 &nbsp;&nbsp;&nbsp;&nbsp;-3 &nbsp;&nbsp;-3.0<br>
sqrt(-1) = NaN, abs(Integer.MIN_VALUE) = -2147483648<br>
100000 dice rolls with (int)(Math.random()*6)+1 -&gt; smallest 1, largest 6</div>
<p>Everything in <code>Math</code> is <code>static</code> and you never create a Math object. The rounding table is the part FE tests: <code>ceil</code> goes up, <code>floor</code> goes down (for −2.5: up is −2.0, down is −3.0); <code>round</code> rounds half <strong>up</strong> (2.5 → 3, −2.5 → −2) and returns a <code>long</code>; <code>rint</code> rounds half to even. <code>pow</code> and <code>sqrt</code> return <code>double</code> (<code>pow(2, 10)</code> is <code>1024.0</code>). <code>Math.random()</code> is in [0.0, 1.0) — 1.0 is never returned — so <code>(int)(Math.random() * 6) + 1</code> gives a fair die 1..6.</p>
<p>Two edge cases from the run: <code>sqrt(-1)</code> is <code>NaN</code>, not an exception; <code>abs(Integer.MIN_VALUE)</code> is still negative, because +2147483648 does not fit in an <code>int</code>.</p>
<div class="pitfall">FE trap: <code>Math.round(-2.5)</code> is <code>-2</code>, not <code>-3</code> — round adds 0.5 and takes the floor.</div>`,
        `<p class="y-chinh">🎯 <code>java.lang.Math</code> cung cấp hằng (<code>Math.E</code>, <code>Math.PI</code>) và phương thức static: cơ bản (<code>ceil</code>, <code>floor</code>, <code>abs</code>…), mũ và lôgarit (<code>exp</code>, <code>sqrt</code>, <code>pow</code>), lượng giác (<code>cos</code>, <code>sin</code>) và <code>random()</code>, một số giả ngẫu nhiên giữa 0.0 và 1.0.</p>
<pre><code class="language-java">// release: 8
// Slide 10: java.lang.Math — mọi phương thức đều static; họ hàm làm tròn và các ca biên FE hay hỏi
public class LopMath {
    public static void main(String[] args) {
        System.out.println("PI = " + Math.PI + ", E = " + Math.E);
        System.out.println("sqrt(16) = " + Math.sqrt(16) + ", pow(2, 10) = " + Math.pow(2, 10) + ", cbrt(27) = " + Math.cbrt(27));
        System.out.println("abs(-7) = " + Math.abs(-7) + ", max(3, 9) = " + Math.max(3, 9) + ", min(2.5, -1) = " + Math.min(2.5, -1));
        System.out.println("hypot(3, 4) = " + Math.hypot(3, 4) + ", cos(0) = " + Math.cos(0) + ", sin(PI/2) = " + Math.sin(Math.PI / 2));
        double[] ds = {2.5, 2.4, -2.5, -2.6};
        System.out.println("   x     ceil   floor  round  rint");
        for (double x : ds)
            System.out.printf("%5.1f  %5.1f  %5.1f  %5d  %5.1f%n", x, Math.ceil(x), Math.floor(x), Math.round(x), Math.rint(x));
        System.out.println("sqrt(-1) = " + Math.sqrt(-1) + ", abs(Integer.MIN_VALUE) = " + Math.abs(Integer.MIN_VALUE));
        int min = 7, max = 0;
        for (int i = 0; i &lt; 100000; i++) {
            int dice = (int) (Math.random() * 6) + 1;     // random() nằm trong [0.0, 1.0)
            if (dice &lt; min) min = dice;
            if (dice &gt; max) max = dice;
        }
        System.out.println("100000 dice rolls with (int)(Math.random()*6)+1 -&gt; smallest " + min + ", largest " + max);
    }
}</code></pre>
<div class="out">PI = 3.141592653589793, E = 2.718281828459045<br>
sqrt(16) = 4.0, pow(2, 10) = 1024.0, cbrt(27) = 3.0<br>
abs(-7) = 7, max(3, 9) = 9, min(2.5, -1) = -1.0<br>
hypot(3, 4) = 5.0, cos(0) = 1.0, sin(PI/2) = 1.0<br>
&nbsp;&nbsp;&nbsp;x &nbsp;&nbsp;&nbsp;&nbsp;ceil &nbsp;&nbsp;floor &nbsp;round &nbsp;rint<br>
&nbsp;&nbsp;2.5 &nbsp;&nbsp;&nbsp;3.0 &nbsp;&nbsp;&nbsp;2.0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;2.0<br>
&nbsp;&nbsp;2.4 &nbsp;&nbsp;&nbsp;3.0 &nbsp;&nbsp;&nbsp;2.0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;2.0<br>
&nbsp;-2.5 &nbsp;&nbsp;-2.0 &nbsp;&nbsp;-3.0 &nbsp;&nbsp;&nbsp;&nbsp;-2 &nbsp;&nbsp;-2.0<br>
&nbsp;-2.6 &nbsp;&nbsp;-2.0 &nbsp;&nbsp;-3.0 &nbsp;&nbsp;&nbsp;&nbsp;-3 &nbsp;&nbsp;-3.0<br>
sqrt(-1) = NaN, abs(Integer.MIN_VALUE) = -2147483648<br>
100000 dice rolls with (int)(Math.random()*6)+1 -&gt; smallest 1, largest 6</div>
<p>Mọi thứ trong <code>Math</code> đều là <code>static</code> và bạn không bao giờ tạo đối tượng Math. Bảng làm tròn là phần FE hay hỏi: <code>ceil</code> lên trần, <code>floor</code> xuống sàn (với −2.5: lên là −2.0, xuống là −3.0); <code>round</code> làm tròn nửa <strong>lên trên</strong> (2.5 → 3, −2.5 → −2) và trả về <code>long</code>; <code>rint</code> làm tròn nửa về số chẵn. <code>pow</code> và <code>sqrt</code> trả <code>double</code> (<code>pow(2, 10)</code> là <code>1024.0</code>). <code>Math.random()</code> nằm trong [0.0, 1.0) — không bao giờ trả 1.0 — nên <code>(int)(Math.random() * 6) + 1</code> cho con xúc xắc công bằng 1..6.</p>
<p>Hai ca biên trong lần chạy: <code>sqrt(-1)</code> là <code>NaN</code>, không ném ngoại lệ; <code>abs(Integer.MIN_VALUE)</code> vẫn âm, vì +2147483648 không vừa trong <code>int</code>.</p>
<div class="pitfall">Bẫy FE: <code>Math.round(-2.5)</code> là <code>-2</code>, không phải <code>-3</code> — round cộng 0.5 rồi lấy sàn.</div>`],
      [11, 'Auto boxing and Unboxing (1)',
        `<p class="y-chinh">🎯 Java 5.0 introduced two simple but convenient features: converting a primitive value into an object of the corresponding wrapper class is called <strong>autoboxing</strong>; converting an object of a wrapper type to its primitive value is called <strong>unboxing</strong> — both done automatically by the compiler.</p>
<p>"Automatically" means the <em>compiler</em> inserts the calls for you: <code>Integer i = 5;</code> is compiled as <code>Integer i = Integer.valueOf(5);</code> and <code>int k = i;</code> as <code>int k = i.intValue();</code>. Nothing is magic at run time — which is why unboxing a <code>null</code> crashes (it is a method call on null) and why <code>valueOf</code>'s cache shows through <code>==</code> (next slide).</p>
<table>
<thead><tr><th>You write</th><th>The compiler generates</th></tr></thead>
<tbody>
<tr><td><code>Integer a = 25;</code></td><td><code>Integer a = Integer.valueOf(25);</code></td></tr>
<tr><td><code>int t = a * 9;</code></td><td><code>int t = a.intValue() * 9;</code></td></tr>
<tr><td><code>list.add(7);</code></td><td><code>list.add(Integer.valueOf(7));</code></td></tr>
<tr><td><code>Double d = 2.5;</code></td><td><code>Double d = Double.valueOf(2.5);</code></td></tr>
</tbody>
</table>
<p>Before Java 5 (2004) every one of those calls had to be written by hand, which is why old textbooks and slides are full of <code>new Integer(…)</code>.</p>`,
        `<p class="y-chinh">🎯 Java 5.0 giới thiệu hai tiện ích đơn giản mà tiện lợi: đổi một giá trị nguyên thủy thành đối tượng của lớp bao tương ứng gọi là <strong>tự đóng hộp (autoboxing)</strong>; đổi một đối tượng lớp bao về giá trị nguyên thủy gọi là <strong>mở hộp (unboxing)</strong> — cả hai do trình biên dịch làm tự động.</p>
<p>"Tự động" nghĩa là <em>trình biên dịch</em> chèn lời gọi thay bạn: <code>Integer i = 5;</code> được biên dịch thành <code>Integer i = Integer.valueOf(5);</code> và <code>int k = i;</code> thành <code>int k = i.intValue();</code>. Lúc chạy chẳng có phép màu nào — nên mở hộp <code>null</code> sẽ sập (đó là lời gọi phương thức trên null) và bộ đệm của <code>valueOf</code> lộ ra qua <code>==</code> (slide sau).</p>
<table>
<thead><tr><th>Bạn viết</th><th>Trình biên dịch sinh ra</th></tr></thead>
<tbody>
<tr><td><code>Integer a = 25;</code></td><td><code>Integer a = Integer.valueOf(25);</code></td></tr>
<tr><td><code>int t = a * 9;</code></td><td><code>int t = a.intValue() * 9;</code></td></tr>
<tr><td><code>list.add(7);</code></td><td><code>list.add(Integer.valueOf(7));</code></td></tr>
<tr><td><code>Double d = 2.5;</code></td><td><code>Double d = Double.valueOf(2.5);</code></td></tr>
</tbody>
</table>
<p>Trước Java 5 (2004) từng lời gọi đó phải viết tay, vì vậy sách và slide cũ đầy <code>new Integer(…)</code>.</p>`],
      [12, 'Auto boxing and Unboxing…',
        `<p class="y-chinh">🎯 Samples: <code>Integer wrappedInt = 25;</code> (boxing), a method <code>Double area(double radius) { return Math.PI * radius * radius; }</code> whose <code>double</code> result is boxed into a <code>Double</code>, and <code>int times9 = wi * 9;</code> (unboxing).</p>
<pre><code class="language-java">// release: 8
// Slides 11–12: autoboxing and unboxing (Java 5) — the convenience, and the four traps it hides
import java.util.ArrayList;
import java.util.List;

public class TuDongBocGoi {
    static Double area(double radius) {
        return Math.PI * radius * radius;        // boxing: double -&gt; Double
    }

    public static void main(String[] args) {
        Integer wrappedInt = 25;                 // boxing or auto boxing
        Integer wi = 234;
        int times9 = wi * 9;                     // unboxing
        System.out.println("wrappedInt = " + wrappedInt + ", times9 = " + times9 + ", area(1) = " + area(1));
        Integer a = 127, b = 127, c = 128, d = 128;
        System.out.println("127 == 127 ? " + (a == b) + "   128 == 128 ? " + (c == d) + "   128 equals 128 ? " + c.equals(d));
        Long l = 5L;
        System.out.println("Long 5 equals(5) ? " + l.equals(5) + "   equals(5L) ? " + l.equals(5L));
        Integer khong = null;
        try {
            int x = khong;                       // unboxing null
        } catch (NullPointerException e) {
            System.out.println("int x = (Integer) null -&gt; " + e.getClass().getSimpleName());
        }
        List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();
        list.add(10); list.add(20); list.add(1);
        list.remove(1);                          // remove(int index): removes 20
        System.out.println("after remove(1): " + list);
        list.remove(Integer.valueOf(1));         // remove(Object): removes the value 1
        System.out.println("after remove(Integer.valueOf(1)): " + list);
    }
}</code></pre>
<div class="out">wrappedInt = 25, times9 = 2106, area(1) = 3.141592653589793<br>
127 == 127 ? true &nbsp;&nbsp;128 == 128 ? false &nbsp;&nbsp;128 equals 128 ? true<br>
Long 5 equals(5) ? false &nbsp;&nbsp;equals(5L) ? true<br>
int x = (Integer) null -&gt; NullPointerException<br>
after remove(1): [10, 1]<br>
after remove(Integer.valueOf(1)): [10]</div>
<p>The first line is the slide. The rest are the four traps autoboxing hides, all real: (1) <code>==</code> on two <code>Integer</code>s compares <strong>references</strong>: values −128..127 come from a cache (the same object), so <code>127 == 127</code> is true but <code>128 == 128</code> is false — always compare wrapper values with <code>equals</code>; (2) <code>Long.equals(5)</code> is false because <code>5</code> is boxed to an <em>Integer</em>, and a Long is never equal to an Integer; (3) unboxing <code>null</code> throws <code>NullPointerException</code>; (4) on a <code>List&lt;Integer&gt;</code>, <code>remove(1)</code> removes the element at <strong>index</strong> 1 — use <code>remove(Integer.valueOf(1))</code> to remove the value 1.</p>
<div class="pitfall">FE trap (seen in real banks): <code>Integer x = 1000, y = 1000; x == y</code> → <code>false</code>; <code>x.equals(y)</code> → <code>true</code>.</div>`,
        `<p class="y-chinh">🎯 Ví dụ: <code>Integer wrappedInt = 25;</code> (đóng hộp), phương thức <code>Double area(double radius) { return Math.PI * radius * radius; }</code> có kết quả <code>double</code> được đóng hộp thành <code>Double</code>, và <code>int times9 = wi * 9;</code> (mở hộp).</p>
<pre><code class="language-java">// release: 8
// Slide 11–12: tự đóng hộp và mở hộp (Java 5) — sự tiện lợi, và bốn cái bẫy nó che giấu
import java.util.ArrayList;
import java.util.List;

public class TuDongBocGoi {
    static Double area(double radius) {
        return Math.PI * radius * radius;        // đóng hộp: double -&gt; Double
    }

    public static void main(String[] args) {
        Integer wrappedInt = 25;                 // đóng hộp tự động
        Integer wi = 234;
        int times9 = wi * 9;                     // mở hộp
        System.out.println("wrappedInt = " + wrappedInt + ", times9 = " + times9 + ", area(1) = " + area(1));
        Integer a = 127, b = 127, c = 128, d = 128;
        System.out.println("127 == 127 ? " + (a == b) + "   128 == 128 ? " + (c == d) + "   128 equals 128 ? " + c.equals(d));
        Long l = 5L;
        System.out.println("Long 5 equals(5) ? " + l.equals(5) + "   equals(5L) ? " + l.equals(5L));
        Integer khong = null;
        try {
            int x = khong;                       // mở hộp null
        } catch (NullPointerException e) {
            System.out.println("int x = (Integer) null -&gt; " + e.getClass().getSimpleName());
        }
        List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();
        list.add(10); list.add(20); list.add(1);
        list.remove(1);                          // remove(int chỉ số): xoá 20
        System.out.println("after remove(1): " + list);
        list.remove(Integer.valueOf(1));         // remove(Object): xoá giá trị 1
        System.out.println("after remove(Integer.valueOf(1)): " + list);
    }
}</code></pre>
<div class="out">wrappedInt = 25, times9 = 2106, area(1) = 3.141592653589793<br>
127 == 127 ? true &nbsp;&nbsp;128 == 128 ? false &nbsp;&nbsp;128 equals 128 ? true<br>
Long 5 equals(5) ? false &nbsp;&nbsp;equals(5L) ? true<br>
int x = (Integer) null -&gt; NullPointerException<br>
after remove(1): [10, 1]<br>
after remove(Integer.valueOf(1)): [10]</div>
<p>Dòng đầu là slide. Phần còn lại là bốn cái bẫy mà tự đóng hộp che giấu, đều chạy thật: (1) <code>==</code> trên hai <code>Integer</code> so sánh <strong>tham chiếu</strong>: các giá trị −128..127 lấy từ bộ đệm (cùng một đối tượng), nên <code>127 == 127</code> đúng mà <code>128 == 128</code> sai — luôn so giá trị lớp bao bằng <code>equals</code>; (2) <code>Long.equals(5)</code> sai vì <code>5</code> được đóng hộp thành <em>Integer</em>, mà Long không bao giờ bằng Integer; (3) mở hộp <code>null</code> ném <code>NullPointerException</code>; (4) trên <code>List&lt;Integer&gt;</code>, <code>remove(1)</code> xoá phần tử ở <strong>chỉ số</strong> 1 — dùng <code>remove(Integer.valueOf(1))</code> để xoá giá trị 1.</p>
<div class="pitfall">Bẫy FE (có trong ngân hàng đề thật): <code>Integer x = 1000, y = 1000; x == y</code> → <code>false</code>; <code>x.equals(y)</code> → <code>true</code>.</div>`],
      [13, 'Characters',
        `<p class="y-chinh">🎯 A <code>char</code> is a 2-byte Unicode character; the <code>Character</code> class offers useful static methods — <code>isLetter</code>, <code>isDigit</code>, <code>isUpperCase</code>, <code>toUpperCase</code>…; <code>Character ch = new Character('a');</code>; a character preceded by a backslash is an <strong>escape sequence</strong> with a special meaning to the compiler (the slide's table: <code>\\t \\b \\n \\r \\f \\' \\" \\\\</code>).</p>
<pre><code class="language-java">// release: 8
// Slide 13: char and the Character helper class — classify, convert, and count characters (a PE Q4 favourite)
public class KyTu {
    public static void main(String[] args) {
        char[] mau = {'a', 'Z', '7', ' ', '#'};
        for (char c : mau)
            System.out.printf("'%c' letter=%-5b digit=%-5b upper=%-5b space=%-5b%n", c,
                Character.isLetter(c), Character.isDigit(c), Character.isUpperCase(c), Character.isWhitespace(c));
        System.out.println("toUpperCase('q') = " + Character.toUpperCase('q') + ", getNumericValue('7') = " + Character.getNumericValue('7')
            + ", '7' - '0' = " + ('7' - '0'));
        String s = "PRO192 Java 8 - OOP rocks!";
        int chu = 0, so = 0, hoa = 0, khac = 0;
        for (int i = 0; i &lt; s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) so++;
            else if (Character.isLetter(c)) { chu++; if (Character.isUpperCase(c)) hoa++; }
            else khac++;
        }
        System.out.println("\\"" + s + "\\": letters=" + chu + " (upper " + hoa + "), digits=" + so + ", other=" + khac);
        StringBuilder dao = new StringBuilder();
        for (char c : s.toCharArray())          // swap upper and lower case
            dao.append(Character.isUpperCase(c) ? Character.toLowerCase(c) : Character.toUpperCase(c));
        System.out.println("swapped case: " + dao);
    }
}</code></pre>
<div class="out">'a' letter=true &nbsp;digit=false upper=false space=false<br>
'Z' letter=true &nbsp;digit=false upper=true &nbsp;space=false<br>
'7' letter=false digit=true &nbsp;upper=false space=false<br>
' ' letter=false digit=false upper=false space=true<br>
'#' letter=false digit=false upper=false space=false<br>
toUpperCase('q') = Q, getNumericValue('7') = 7, '7' - '0' = 7<br>
"PRO192 Java 8 - OOP rocks!": letters=15 (upper 7), digits=4, other=7<br>
swapped case: pro192 jAVA 8 - oop ROCKS!</div>
<p>This is the toolbox of PE question 4: loop over <code>s.charAt(i)</code> (or <code>s.toCharArray()</code>), classify each character with <code>Character.isDigit</code>/<code>isLetter</code>/<code>isUpperCase</code>, count or build a new string. <code>c - '0'</code> turns a digit character into its value (same as <code>Character.getNumericValue</code> for 0–9) — the classic way to sum the digits in a string.</p>
<p><code>new Character('a')</code> is deprecated like <code>new Integer</code>; write <code>char ch = 'a';</code> or <code>Character.valueOf('a')</code>. Note "2 bytes": a <code>char</code> is one UTF-16 code unit, so emoji and some rare characters need two <code>char</code>s.</p>
<div class="pitfall">Trap: <code>Character.isLetter</code> is true for every Unicode letter, including <code>'ă'</code> or <code>'ê'</code>; if a PE rule says "letters A–Z or a–z", test <code>(c &gt;= 'a' &amp;&amp; c &lt;= 'z') || (c &gt;= 'A' &amp;&amp; c &lt;= 'Z')</code> instead.</div>`,
        `<p class="y-chinh">🎯 <code>char</code> là một ký tự Unicode 2 byte; lớp <code>Character</code> cung cấp các phương thức static hữu ích — <code>isLetter</code>, <code>isDigit</code>, <code>isUpperCase</code>, <code>toUpperCase</code>…; <code>Character ch = new Character('a');</code>; ký tự đứng sau dấu gạch chéo ngược là một <strong>chuỗi thoát (escape sequence)</strong> có nghĩa đặc biệt với trình biên dịch (bảng trên slide: <code>\\t \\b \\n \\r \\f \\' \\" \\\\</code>).</p>
<pre><code class="language-java">// release: 8
// Slide 13: char và lớp hỗ trợ Character — phân loại, chuyển đổi và đếm ký tự (dạng câu PE Q4 hay ra)
public class KyTu {
    public static void main(String[] args) {
        char[] mau = {'a', 'Z', '7', ' ', '#'};
        for (char c : mau)
            System.out.printf("'%c' letter=%-5b digit=%-5b upper=%-5b space=%-5b%n", c,
                Character.isLetter(c), Character.isDigit(c), Character.isUpperCase(c), Character.isWhitespace(c));
        System.out.println("toUpperCase('q') = " + Character.toUpperCase('q') + ", getNumericValue('7') = " + Character.getNumericValue('7')
            + ", '7' - '0' = " + ('7' - '0'));
        String s = "PRO192 Java 8 - OOP rocks!";
        int chu = 0, so = 0, hoa = 0, khac = 0;
        for (int i = 0; i &lt; s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) so++;
            else if (Character.isLetter(c)) { chu++; if (Character.isUpperCase(c)) hoa++; }
            else khac++;
        }
        System.out.println("\\"" + s + "\\": letters=" + chu + " (upper " + hoa + "), digits=" + so + ", other=" + khac);
        StringBuilder dao = new StringBuilder();
        for (char c : s.toCharArray())          // đảo hoa thường
            dao.append(Character.isUpperCase(c) ? Character.toLowerCase(c) : Character.toUpperCase(c));
        System.out.println("swapped case: " + dao);
    }
}</code></pre>
<div class="out">'a' letter=true &nbsp;digit=false upper=false space=false<br>
'Z' letter=true &nbsp;digit=false upper=true &nbsp;space=false<br>
'7' letter=false digit=true &nbsp;upper=false space=false<br>
' ' letter=false digit=false upper=false space=true<br>
'#' letter=false digit=false upper=false space=false<br>
toUpperCase('q') = Q, getNumericValue('7') = 7, '7' - '0' = 7<br>
"PRO192 Java 8 - OOP rocks!": letters=15 (upper 7), digits=4, other=7<br>
swapped case: pro192 jAVA 8 - oop ROCKS!</div>
<p>Đây là hộp đồ nghề của câu PE số 4: lặp qua <code>s.charAt(i)</code> (hoặc <code>s.toCharArray()</code>), phân loại từng ký tự bằng <code>Character.isDigit</code>/<code>isLetter</code>/<code>isUpperCase</code>, rồi đếm hoặc dựng chuỗi mới. <code>c - '0'</code> đổi ký tự chữ số thành giá trị của nó (giống <code>Character.getNumericValue</code> với 0–9) — cách kinh điển để cộng các chữ số trong một chuỗi.</p>
<p><code>new Character('a')</code> bị deprecated như <code>new Integer</code>; hãy viết <code>char ch = 'a';</code> hoặc <code>Character.valueOf('a')</code>. Chú ý "2 byte": một <code>char</code> là một đơn vị mã UTF-16, nên emoji và vài ký tự hiếm cần hai <code>char</code>.</p>
<div class="pitfall">Bẫy: <code>Character.isLetter</code> đúng với mọi chữ cái Unicode, kể cả <code>'ă'</code> hay <code>'ê'</code>; nếu đề PE ghi "chữ cái A–Z hoặc a–z" thì kiểm <code>(c &gt;= 'a' &amp;&amp; c &lt;= 'z') || (c &gt;= 'A' &amp;&amp; c &lt;= 'Z')</code>.</div>`],
    ]),
    bi(`<p>Continue with <strong>1.E → 1.F</strong>: String, the string pool, StringBuilder, Scanner, split and formatted output.</p>`,
    `<p>Học tiếp <strong>1.E → 1.F</strong>: String, string pool, StringBuilder, Scanner, split và xuất có định dạng.</p>`),
    books([
      ['horstmann1', 'Ch. 5.4 "Object Wrappers and Autoboxing" and Ch. 3.5.2 "Mathematical Functions and Constants"', 'Mục 5.4 "Object Wrappers and Autoboxing" và mục 3.5.2 "Mathematical Functions and Constants"'],
      ['javaTutorial', 'trail "Learning the Java Language" — lesson "Numbers and Strings": Numbers, Characters', 'trail "Learning the Java Language" — bài "Numbers and Strings": Numbers, Characters'],
      ['apiDocs', 'classes Integer, Number, Math, Character (java.lang)', 'các lớp Integer, Number, Math, Character (java.lang)'],
    ]),
  ].join('\n'),
};

/* ───────── 1.F — 📑 Slide by slide · Numbers and Strings (2/2): String, StringBuilder, Scanner, format (slides 14–30) ───────── */
const L_pro5_2 = {
  title: '1.F — 📑 Slide by slide · Numbers and Strings (2/2): String, StringBuilder, Scanner, format (slides 14–30)|||1.F — 📑 Học theo từng slide · Numbers and Strings (2/2): String, StringBuilder, Scanner, format (slide 14–30)',
  slug: 'pro192-slide-pro5-2',
  type: 'VIDEO',
  description: 'Giảng slide 14–30 bộ "Numbers and Strings": String bất biến, string pool và == với equals (StringDemo y như slide, thêm hằng biên dịch và intern), compareTo, bảng phương thức String chạy thật, replaceAll là regex, StringBuffer và StringBuilder (javap trên JDK 8 thật cho thấy s += i tạo StringBuilder mới mỗi vòng), concat với null, Scanner trên chuỗi và tệp với dấu phân cách regex, split và StringTokenizer cùng các bẫy của split, printf/format và DecimalFormat theo locale và cách làm tròn — chỉ ra chỗ slide sai (Serializable không có phương thức).',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.F · school deck "Numbers and Strings", slides 14–30</span>
<h2>Strings: the class you will use in every single PE question</h2>
<p class="lead">Slides 14–30 are about text: how a <code>String</code> is built and why it never changes, why <code>==</code> sometimes "works" on strings and must still never be used, the mutable <code>StringBuilder</code>, reading tokens with <code>Scanner</code>, cutting text with <code>split</code>, and printing aligned tables with <code>format</code>. PE question 4 ("<code>f1(String)</code>, <code>f2(String)</code>") is built entirely from this lesson — the 🧪 practice of this chapter has four of them, solved and run on JDK 8.</p>`,
    `<span class="eyebrow">Chương 1 · Bài 1.F · bộ slide "Numbers and Strings" của trường, slide 14–30</span>
<h2>Chuỗi: lớp bạn sẽ dùng trong mọi câu PE</h2>
<p class="lead">Slide 14–30 nói về văn bản: <code>String</code> được tạo ra sao và vì sao nó không bao giờ đổi, vì sao <code>==</code> đôi khi "chạy đúng" trên chuỗi mà vẫn không bao giờ được dùng, lớp khả biến <code>StringBuilder</code>, đọc token bằng <code>Scanner</code>, cắt văn bản bằng <code>split</code>, và in bảng thẳng hàng bằng <code>format</code>. Câu PE số 4 ("<code>f1(String)</code>, <code>f2(String)</code>") được làm hoàn toàn từ bài này — phần 🧪 thực hành của chương có bốn câu như vậy, có lời giải chạy trên JDK 8.</p>`),
    walkHead('pro5', 14, 30),
    walk('pro5', [
      [14, 'Strings',
        `<p class="y-chinh">🎯 Java encapsulates strings of 16-bit Unicode characters in three classes: <code>String</code> (implements <code>CharSequence</code>, <code>Comparable&lt;T&gt;</code>, <code>Serializable</code>), <code>StringBuffer</code> and <code>StringBuilder</code> (both implement <code>CharSequence</code>, <code>Serializable</code>).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/e4ceaaa82ee4d57ad1cd73b67e0e4be9700919d3.svg" alt="Slides 14 and 20–22 in UML: three classes, one interface CharSequence, and the line between immutable and mutable" loading="lazy" /><p class="chu-thich">🧩 Slides 14 and 20–22 in UML: three classes, one interface CharSequence, and the line between immutable and mutable</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 14, 20–22 — String vs StringBuilder vs StringBuffer
' All three are CharSequence; only String is immutable
interface CharSequence {
  + length() : int
  + charAt(i : int) : char
  + toString() : String
}
interface "Comparable&lt;String&gt;" as Cmp
interface Serializable &lt;&lt;marker, no methods&gt;&gt;
class String &lt;&lt;final, immutable&gt;&gt; {
  + substring(..) : String
  + toUpperCase() : String
  + concat(s : String) : String
  ..every "change" returns a NEW String..
}
abstract class AbstractStringBuilder &lt;&lt;package-private&gt;&gt; {
  + append(..)
  + insert(..)
  + reverse()
  ..changes THIS object in place..
}
class StringBuilder &lt;&lt;final&gt;&gt; {
  Java 5, not synchronized
  fast, one thread
}
class StringBuffer &lt;&lt;final&gt;&gt; {
  Java 1.0, synchronized
  thread-safe, slower
}
String ..|&gt; CharSequence
String ..|&gt; Cmp
String ..|&gt; Serializable
AbstractStringBuilder ..|&gt; CharSequence
AbstractStringBuilder &lt;|-- StringBuilder
AbstractStringBuilder &lt;|-- StringBuffer
StringBuilder ..|&gt; Serializable
StringBuffer ..|&gt; Serializable
@enduml</code></pre></details>
<p>⚠️ The last sentence of the slide is wrong: "Interface Serializable declared methods for processing a string as a stream of characters". <code>java.io.Serializable</code> declares <strong>no methods at all</strong> — it is a <em>marker</em> interface that says "objects of this class may be turned into bytes" (saved to a file, sent over a network — Chapter 9). The methods for treating text as a sequence of characters (<code>length()</code>, <code>charAt()</code>) come from <code>CharSequence</code>.</p>
<p>Why three classes: <code>String</code> is immutable and shareable; <code>StringBuilder</code> and <code>StringBuffer</code> are mutable "work benches" for building text step by step (slides 20–22). <code>String</code> is also <code>final</code>, like the wrappers.</p>`,
        `<p class="y-chinh">🎯 Java đóng gói chuỗi ký tự Unicode 16 bit trong ba lớp: <code>String</code> (cài đặt <code>CharSequence</code>, <code>Comparable&lt;T&gt;</code>, <code>Serializable</code>), <code>StringBuffer</code> và <code>StringBuilder</code> (cả hai cài đặt <code>CharSequence</code>, <code>Serializable</code>).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/e4ceaaa82ee4d57ad1cd73b67e0e4be9700919d3.svg" alt="Slide 14 và 20–22 bằng UML: ba lớp, một interface CharSequence, và ranh giới giữa bất biến và khả biến" loading="lazy" /><p class="chu-thich">🧩 Slide 14 và 20–22 bằng UML: ba lớp, một interface CharSequence, và ranh giới giữa bất biến và khả biến</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 14, 20–22 — String vs StringBuilder vs StringBuffer
' Cả ba đều là CharSequence; chỉ String là bất biến
interface CharSequence {
  + length() : int
  + charAt(i : int) : char
  + toString() : String
}
interface "Comparable&lt;String&gt;" as Cmp
interface Serializable &lt;&lt;marker, no methods&gt;&gt;
class String &lt;&lt;final, immutable&gt;&gt; {
  + substring(..) : String
  + toUpperCase() : String
  + concat(s : String) : String
  ..every "change" returns a NEW String..
}
abstract class AbstractStringBuilder &lt;&lt;package-private&gt;&gt; {
  + append(..)
  + insert(..)
  + reverse()
  ..changes THIS object in place..
}
class StringBuilder &lt;&lt;final&gt;&gt; {
  Java 5, not synchronized
  fast, one thread
}
class StringBuffer &lt;&lt;final&gt;&gt; {
  Java 1.0, synchronized
  thread-safe, slower
}
String ..|&gt; CharSequence
String ..|&gt; Cmp
String ..|&gt; Serializable
AbstractStringBuilder ..|&gt; CharSequence
AbstractStringBuilder &lt;|-- StringBuilder
AbstractStringBuilder &lt;|-- StringBuffer
StringBuilder ..|&gt; Serializable
StringBuffer ..|&gt; Serializable
@enduml</code></pre></details>
<p>⚠️ Câu cuối của slide sai: "Interface Serializable khai báo các phương thức để xử lý chuỗi như một luồng ký tự". <code>java.io.Serializable</code> <strong>không khai báo phương thức nào</strong> — nó là interface <em>đánh dấu (marker)</em>, nói rằng "đối tượng của lớp này được phép biến thành byte" (lưu ra tệp, gửi qua mạng — Chương 9). Các phương thức coi văn bản là dãy ký tự (<code>length()</code>, <code>charAt()</code>) đến từ <code>CharSequence</code>.</p>
<p>Vì sao có ba lớp: <code>String</code> bất biến và dùng chung được; <code>StringBuilder</code> và <code>StringBuffer</code> là "bàn thợ" khả biến để dựng văn bản từng bước (slide 20–22). <code>String</code> cũng là <code>final</code>, giống lớp bao.</p>`],
      [15, 'The String Class',
        `<p class="y-chinh">🎯 A <code>String</code> is <strong>immutable</strong>: once created, its content cannot change (no setter); almost all its methods return a <em>new</em> string; construct one with <code>new String("immutable")</code>, <code>new String(new char[] {'a','b','c'})</code> or simply <code>String s3 = "immutable";</code>.</p>
<pre><code class="language-java">// release: 8
// Slides 14–15: three ways to build a String, and proof that a String never changes — methods return NEW strings
public class ChuoiBatBien {
    public static void main(String[] args) {
        String s1 = new String("immutable");
        String s2 = new String(new char[] {'a', 'b', 'c'});
        String s3 = "immutable";
        System.out.println("s1 = " + s1 + ", s2 = " + s2 + ", s3 = " + s3);

        String s = "java";
        s.toUpperCase();                        // result thrown away: s is unchanged
        s.concat(" 8");
        s.replace('a', 'o');
        System.out.println("after calling methods without assigning: " + s);
        String t = s.toUpperCase().concat(" 8").replace('A', 'O');
        System.out.println("assign the result: t = " + t + ", s still = " + s);

        CharSequence cs = s;                    // String, StringBuilder, StringBuffer are all CharSequence
        CharSequence cs2 = new StringBuilder("java");
        System.out.println("CharSequence lengths: " + cs.length() + " " + cs2.length() + ", same text? " + cs.toString().contentEquals(cs2));
    }
}</code></pre>
<div class="out">s1 = immutable, s2 = abc, s3 = immutable<br>
after calling methods without assigning: java<br>
assign the result: t = JOVO 8, s still = java<br>
CharSequence lengths: 4 4, same text? true</div>
<p>The decisive lines: calling <code>s.toUpperCase()</code>, <code>s.concat(" 8")</code> and <code>s.replace('a', 'o')</code> without using the result left <code>s</code> as <code>java</code> — each call produced a new String that was thrown away. To keep a change you must <strong>assign the result</strong>: <code>t = s.toUpperCase()…</code>. Prefer the literal form <code>"immutable"</code>: <code>new String("…")</code> forces an extra copy for no benefit (slide 16).</p>
<div class="pitfall">PE trap: <code>name.trim();</code> on its own line does nothing. Write <code>name = name.trim();</code> — the most common reason a "correct" setter fails the grader.</div>`,
        `<p class="y-chinh">🎯 <code>String</code> là <strong>bất biến (immutable)</strong>: đã tạo thì nội dung không đổi được (không có setter); hầu hết phương thức của nó trả về một chuỗi <em>mới</em>; tạo chuỗi bằng <code>new String("immutable")</code>, <code>new String(new char[] {'a','b','c'})</code> hoặc đơn giản <code>String s3 = "immutable";</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 14–15: ba cách tạo String, và bằng chứng String không bao giờ đổi — các phương thức trả về chuỗi MỚI
public class ChuoiBatBien {
    public static void main(String[] args) {
        String s1 = new String("immutable");
        String s2 = new String(new char[] {'a', 'b', 'c'});
        String s3 = "immutable";
        System.out.println("s1 = " + s1 + ", s2 = " + s2 + ", s3 = " + s3);

        String s = "java";
        s.toUpperCase();                        // kết quả bị vứt: s không đổi
        s.concat(" 8");
        s.replace('a', 'o');
        System.out.println("after calling methods without assigning: " + s);
        String t = s.toUpperCase().concat(" 8").replace('A', 'O');
        System.out.println("assign the result: t = " + t + ", s still = " + s);

        CharSequence cs = s;                    // String, StringBuilder, StringBuffer đều là CharSequence
        CharSequence cs2 = new StringBuilder("java");
        System.out.println("CharSequence lengths: " + cs.length() + " " + cs2.length() + ", same text? " + cs.toString().contentEquals(cs2));
    }
}</code></pre>
<div class="out">s1 = immutable, s2 = abc, s3 = immutable<br>
after calling methods without assigning: java<br>
assign the result: t = JOVO 8, s still = java<br>
CharSequence lengths: 4 4, same text? true</div>
<p>Các dòng quyết định: gọi <code>s.toUpperCase()</code>, <code>s.concat(" 8")</code> và <code>s.replace('a', 'o')</code> mà không dùng kết quả thì <code>s</code> vẫn là <code>java</code> — mỗi lời gọi tạo một String mới rồi bị vứt đi. Muốn giữ thay đổi phải <strong>gán kết quả</strong>: <code>t = s.toUpperCase()…</code>. Nên dùng dạng literal <code>"immutable"</code>: <code>new String("…")</code> bắt tạo thêm một bản sao mà chẳng được gì (slide 16).</p>
<div class="pitfall">Bẫy PE: <code>name.trim();</code> đứng một mình trên một dòng chẳng làm gì cả. Hãy viết <code>name = name.trim();</code> — lý do phổ biến nhất khiến một setter "đúng" vẫn bị máy chấm đánh trượt.</div>`],
      [16, 'String pool',
        `<p class="y-chinh">🎯 <code>StringDemo</code>: two literals <code>"Hello"</code> share one object in the <strong>string pool</strong> (<code>s1==s2: true</code>); two <code>new String("Hello")</code> are two objects (<code>s3==s4: false</code>) with the same text (<code>s3 equals s4: true</code>); <code>==</code> is "shallow comparing" (two references), <code>equals</code> is "deep comparing" (two values); the string pool is a way to save memory.</p>
<pre class="trich"><code class="language-java">String s1 = "Hello";   // string pool
String s2 = "Hello";   // string pool
System.out.println("s1==s2: " + (s1 == s2));
String s3 = new String("Hello");
String s4 = new String("Hello");
System.out.println("s3==s4: " + (s3 == s4));
System.out.println("s3 equals s4: " + (s3.equals(s4)));
String s5 = new String(new char[] {'H', 'E', 'L', 'L', 'O'});
System.out.println("s3 equals s5 ignoring case: " + (s3.equalsIgnoreCase(s5)));
System.out.println(s5);
s5 = s5.toLowerCase();
System.out.println(s5);</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/38582ed21f00b3a0971c2a08cc80a3197279629a.svg" alt="Slide 16 redrawn: s1 and s2 share the pooled literal; s3 and s4 are separate objects; s5 moves to a new object and &quot;HELLO&quot; becomes garbage" loading="lazy" /><p class="chu-thich">🧩 Slide 16 redrawn: s1 and s2 share the pooled literal; s3 and s4 are separate objects; s5 moves to a new object and "HELLO" becomes garbage</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 16 redrawn — literals share the pool, new String(...) always makes a new object
' s1 and s2 point to ONE pooled "Hello"; s3 and s4 are two separate heap objects
left to right direction
package "Stack (main)" #F8FAFC {
  object s1
  object s2
  object s3
  object s4
  object s5
}
package "Heap" #FFF7ED {
  package "String pool" #FEF9C3 {
    object "Hello (pooled)" as P
  }
  object "Hello (new #1)" as H1
  object "Hello (new #2)" as H2
  object "HELLO (garbage after s5 moves)" as U #FEE2E2
  object "hello" as L #ECFDF5
}
s1 --&gt; P
s2 --&gt; P
s3 --&gt; H1
s4 --&gt; H2
s5 ..&gt; U : before
s5 --&gt; L : after toLowerCase()
note "s1 == s2 -&gt; true (same address)\\ns3 == s4 -&gt; false (two objects)\\ns3.equals(s4) -&gt; true (same text)" as N
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">String hel = "Hel";
String a = "Hel" + "lo";          // constant expression: joined by javac, stored in the pool
String b = hel + "lo";            // joined at run time: a new object on the heap
final String HEL = "Hel";
String c = HEL + "lo";            // final + literal is still a constant
System.out.println("\\"Hel\\" + \\"lo\\" == s1 ? " + (a == s1) + ",  hel + \\"lo\\" == s1 ? " + (b == s1)
    + ",  HEL + \\"lo\\" == s1 ? " + (c == s1));
System.out.println("b.intern() == s1 ? " + (b.intern() == s1) + ",  s3.intern() == s1 ? " + (s3.intern() == s1));</code></pre>
<div class="out">s1==s2: true<br>
s3==s4: false<br>
s3 equals s4: true<br>
s3 equals s5 ignoring case: true<br>
HELLO<br>
hello<br>
"Hel" + "lo" == s1 ? true, &nbsp;hel + "lo" == s1 ? false, &nbsp;HEL + "lo" == s1 ? true<br>
b.intern() == s1 ? true, &nbsp;s3.intern() == s1 ? true</div>
<p>The slide's six lines match the real run. The extra lines show <strong>when</strong> the pool is used: literals and <em>compile-time constants</em> (<code>"Hel" + "lo"</code>, or a <code>final</code> variable plus a literal) are joined by javac and pooled; anything joined at run time (<code>hel + "lo"</code>, a value read from the keyboard, from a file, from a database) is a new object, so <code>==</code> is <code>false</code> even with identical text. <code>intern()</code> returns the pooled copy.</p>
<div class="pitfall">Rule for PE, LAB211 and every job: compare Strings with <code>equals</code> (or <code>equalsIgnoreCase</code>), never with <code>==</code>. Input from <code>Scanner</code> is never pooled, so <code>input == "yes"</code> is always false.</div>`,
        `<p class="y-chinh">🎯 <code>StringDemo</code>: hai literal <code>"Hello"</code> dùng chung một đối tượng trong <strong>string pool</strong> (vùng chuỗi hằng — <code>s1==s2: true</code>); hai <code>new String("Hello")</code> là hai đối tượng (<code>s3==s4: false</code>) có cùng nội dung (<code>s3 equals s4: true</code>); <code>==</code> là "so sánh nông" (hai tham chiếu), <code>equals</code> là "so sánh sâu" (hai giá trị); string pool là cách tiết kiệm bộ nhớ.</p>
<pre class="trich"><code class="language-java">String s1 = "Hello";   // vùng chuỗi hằng
String s2 = "Hello";   // string pool
System.out.println("s1==s2: " + (s1 == s2));
String s3 = new String("Hello");
String s4 = new String("Hello");
System.out.println("s3==s4: " + (s3 == s4));
System.out.println("s3 equals s4: " + (s3.equals(s4)));
String s5 = new String(new char[] {'H', 'E', 'L', 'L', 'O'});
System.out.println("s3 equals s5 ignoring case: " + (s3.equalsIgnoreCase(s5)));
System.out.println(s5);
s5 = s5.toLowerCase();
System.out.println(s5);</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/38582ed21f00b3a0971c2a08cc80a3197279629a.svg" alt="Slide 16 vẽ lại: s1 và s2 dùng chung literal trong pool; s3 và s4 là hai đối tượng riêng; s5 chuyển sang đối tượng mới và &quot;HELLO&quot; thành rác" loading="lazy" /><p class="chu-thich">🧩 Slide 16 vẽ lại: s1 và s2 dùng chung literal trong pool; s3 và s4 là hai đối tượng riêng; s5 chuyển sang đối tượng mới và "HELLO" thành rác</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 16 redrawn — literals share the pool, new String(...) always makes a new object
' s1 và s2 cùng trỏ MỘT "Hello" trong pool; s3 và s4 là hai đối tượng riêng trên heap
left to right direction
package "Stack (main)" #F8FAFC {
  object s1
  object s2
  object s3
  object s4
  object s5
}
package "Heap" #FFF7ED {
  package "String pool" #FEF9C3 {
    object "Hello (pooled)" as P
  }
  object "Hello (new #1)" as H1
  object "Hello (new #2)" as H2
  object "HELLO (garbage after s5 moves)" as U #FEE2E2
  object "hello" as L #ECFDF5
}
s1 --&gt; P
s2 --&gt; P
s3 --&gt; H1
s4 --&gt; H2
s5 ..&gt; U : before
s5 --&gt; L : after toLowerCase()
note "s1 == s2 -&gt; true (same address)\\ns3 == s4 -&gt; false (two objects)\\ns3.equals(s4) -&gt; true (same text)" as N
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">String hel = "Hel";
String a = "Hel" + "lo";          // biểu thức hằng: javac nối sẵn, nằm trong pool
String b = hel + "lo";            // nối lúc chạy: một đối tượng mới trên heap
final String HEL = "Hel";
String c = HEL + "lo";            // final + literal vẫn là hằng
System.out.println("\\"Hel\\" + \\"lo\\" == s1 ? " + (a == s1) + ",  hel + \\"lo\\" == s1 ? " + (b == s1)
    + ",  HEL + \\"lo\\" == s1 ? " + (c == s1));
System.out.println("b.intern() == s1 ? " + (b.intern() == s1) + ",  s3.intern() == s1 ? " + (s3.intern() == s1));</code></pre>
<div class="out">s1==s2: true<br>
s3==s4: false<br>
s3 equals s4: true<br>
s3 equals s5 ignoring case: true<br>
HELLO<br>
hello<br>
"Hel" + "lo" == s1 ? true, &nbsp;hel + "lo" == s1 ? false, &nbsp;HEL + "lo" == s1 ? true<br>
b.intern() == s1 ? true, &nbsp;s3.intern() == s1 ? true</div>
<p>Sáu dòng của slide khớp lần chạy thật. Các dòng thêm cho thấy <strong>khi nào</strong> pool được dùng: literal và <em>hằng lúc biên dịch</em> (<code>"Hel" + "lo"</code>, hay biến <code>final</code> cộng một literal) được javac nối sẵn và đưa vào pool; mọi thứ nối lúc chạy (<code>hel + "lo"</code>, giá trị đọc từ bàn phím, từ tệp, từ cơ sở dữ liệu) là đối tượng mới, nên <code>==</code> ra <code>false</code> dù chữ y hệt. <code>intern()</code> trả về bản trong pool.</p>
<div class="pitfall">Luật cho PE, LAB211 và mọi công việc: so sánh String bằng <code>equals</code> (hoặc <code>equalsIgnoreCase</code>), không bao giờ bằng <code>==</code>. Dữ liệu từ <code>Scanner</code> không bao giờ nằm trong pool, nên <code>input == "yes"</code> luôn sai.</div>`],
      [17, 'The String Class',
        `<p class="y-chinh">🎯 To compare two strings you should use <code>equals()</code>: <code>String st1 = "abc"; String st2 = "xyz"; if (st1.equals(st2)) { … }</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 17: comparing strings — equals for "same text", compareTo for "which comes first", and null-safety
import java.util.Objects;

public class SoSanhChuoi {
    public static void main(String[] args) {
        String st1 = "abc";
        String st2 = "xyz";
        if (st1.equals(st2)) System.out.println("equal");
        else System.out.println("st1.equals(st2) = false");
        System.out.println("\\"abc\\".compareTo(\\"xyz\\") = " + "abc".compareTo("xyz") + "   ('a' - 'x' = " + ('a' - 'x') + ")");
        System.out.println("\\"apple\\".compareTo(\\"Apple\\") = " + "apple".compareTo("Apple")
            + ", compareToIgnoreCase = " + "apple".compareToIgnoreCase("Apple"));
        System.out.println("\\"Ab\\".compareTo(\\"Abc\\") = " + "Ab".compareTo("Abc") + "   (prefix: difference of lengths)");
        System.out.println("\\"10\\".compareTo(\\"9\\") = " + "10".compareTo("9") + "   (text order, not number order!)");
        String nhap = null;
        System.out.println("\\"admin\\".equals(nhap) = " + "admin".equals(nhap) + ", Objects.equals(nhap, null) = " + Objects.equals(nhap, null));
        try {
            System.out.println(nhap.equals("admin"));
        } catch (NullPointerException e) {
            System.out.println("nhap.equals(\\"admin\\") -&gt; " + e.getClass().getSimpleName());
        }
    }
}</code></pre>
<div class="out">st1.equals(st2) = false<br>
"abc".compareTo("xyz") = -23 &nbsp;&nbsp;('a' - 'x' = -23)<br>
"apple".compareTo("Apple") = 32, compareToIgnoreCase = 0<br>
"Ab".compareTo("Abc") = -1 &nbsp;&nbsp;(prefix: difference of lengths)<br>
"10".compareTo("9") = -8 &nbsp;&nbsp;(text order, not number order!)<br>
"admin".equals(nhap) = false, Objects.equals(nhap, null) = true<br>
nhap.equals("admin") -&gt; NullPointerException</div>
<p>Beyond "equal or not", <code>compareTo</code> tells the <strong>order</strong>: negative if the first string comes first, 0 if equal, positive otherwise. Its value is the difference of the first different characters (<code>'a' - 'x'</code> = −23), or the difference of lengths when one is a prefix of the other (<code>"Ab"</code> vs <code>"Abc"</code> → −1). Upper-case letters come before lower-case ones (<code>'A'</code> is 65, <code>'a'</code> is 97), and <code>"10"</code> comes before <code>"9"</code> — text order, not number order.</p>
<p>Null-safety: <code>"admin".equals(nhap)</code> is safe when <code>nhap</code> is null (it just returns false), <code>nhap.equals("admin")</code> throws. Put the literal (or the variable you know is not null) on the left, or use <code>Objects.equals(a, b)</code> (Java 7).</p>
<div class="pitfall">FE trap: "<code>"apple".compareTo("Apple")</code> returns 0" — no, 32; only <code>compareToIgnoreCase</code> returns 0.</div>`,
        `<p class="y-chinh">🎯 Để so sánh hai chuỗi nên dùng <code>equals()</code>: <code>String st1 = "abc"; String st2 = "xyz"; if (st1.equals(st2)) { … }</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 17: so sánh chuỗi — equals cho "cùng nội dung", compareTo cho "chuỗi nào đứng trước", và an toàn với null
import java.util.Objects;

public class SoSanhChuoi {
    public static void main(String[] args) {
        String st1 = "abc";
        String st2 = "xyz";
        if (st1.equals(st2)) System.out.println("equal");
        else System.out.println("st1.equals(st2) = false");
        System.out.println("\\"abc\\".compareTo(\\"xyz\\") = " + "abc".compareTo("xyz") + "   ('a' - 'x' = " + ('a' - 'x') + ")");
        System.out.println("\\"apple\\".compareTo(\\"Apple\\") = " + "apple".compareTo("Apple")
            + ", compareToIgnoreCase = " + "apple".compareToIgnoreCase("Apple"));
        System.out.println("\\"Ab\\".compareTo(\\"Abc\\") = " + "Ab".compareTo("Abc") + "   (prefix: difference of lengths)");
        System.out.println("\\"10\\".compareTo(\\"9\\") = " + "10".compareTo("9") + "   (text order, not number order!)");
        String nhap = null;
        System.out.println("\\"admin\\".equals(nhap) = " + "admin".equals(nhap) + ", Objects.equals(nhap, null) = " + Objects.equals(nhap, null));
        try {
            System.out.println(nhap.equals("admin"));
        } catch (NullPointerException e) {
            System.out.println("nhap.equals(\\"admin\\") -&gt; " + e.getClass().getSimpleName());
        }
    }
}</code></pre>
<div class="out">st1.equals(st2) = false<br>
"abc".compareTo("xyz") = -23 &nbsp;&nbsp;('a' - 'x' = -23)<br>
"apple".compareTo("Apple") = 32, compareToIgnoreCase = 0<br>
"Ab".compareTo("Abc") = -1 &nbsp;&nbsp;(prefix: difference of lengths)<br>
"10".compareTo("9") = -8 &nbsp;&nbsp;(text order, not number order!)<br>
"admin".equals(nhap) = false, Objects.equals(nhap, null) = true<br>
nhap.equals("admin") -&gt; NullPointerException</div>
<p>Ngoài "bằng hay không", <code>compareTo</code> cho biết <strong>thứ tự</strong>: âm nếu chuỗi thứ nhất đứng trước, 0 nếu bằng, dương nếu ngược lại. Giá trị của nó là hiệu của cặp ký tự khác nhau đầu tiên (<code>'a' - 'x'</code> = −23), hoặc hiệu độ dài khi chuỗi này là tiền tố của chuỗi kia (<code>"Ab"</code> so với <code>"Abc"</code> → −1). Chữ hoa đứng trước chữ thường (<code>'A'</code> là 65, <code>'a'</code> là 97), và <code>"10"</code> đứng trước <code>"9"</code> — thứ tự chữ, không phải thứ tự số.</p>
<p>An toàn với null: <code>"admin".equals(nhap)</code> an toàn khi <code>nhap</code> là null (chỉ trả false), còn <code>nhap.equals("admin")</code> thì ném ngoại lệ. Đặt literal (hoặc biến bạn biết chắc khác null) bên trái, hoặc dùng <code>Objects.equals(a, b)</code> (Java 7).</p>
<div class="pitfall">Bẫy FE: "<code>"apple".compareTo("Apple")</code> trả về 0" — sai, là 32; chỉ <code>compareToIgnoreCase</code> mới trả 0.</div>`],
      [18, 'The String Class',
        `<p class="y-chinh">🎯 The method table of <code>String</code>, grouped by return type: <code>char charAt</code>, <code>char[] toCharArray</code>, <code>byte[] getBytes</code>, <code>int</code> (<code>compareTo</code>, <code>indexOf</code>, <code>lastIndexOf</code>, <code>length</code>…), <code>String</code> (<code>trim</code>, <code>concat</code>, <code>replace</code>, <code>replaceAll</code>, <code>substring</code>, <code>toLowerCase</code>, <code>toUpperCase</code>…), <code>static String</code> (<code>format</code>, <code>valueOf</code>, <code>copyValueOf</code>), <code>boolean</code> (<code>contains</code>, <code>endsWith</code>, <code>startsWith</code>, <code>isEmpty</code>, <code>matches</code>, <code>equals</code>…), <code>String[] split</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 18: the String methods you will use in every PE question, each with its real result
public class PhuongThucString {
    public static void main(String[] args) {
        String s = "  Object Oriented Programming  ";
        String t = s.trim();
        System.out.println("trim()            -&gt; [" + t + "]");
        System.out.println("length()          -&gt; " + t.length());
        System.out.println("charAt(0)         -&gt; " + t.charAt(0));
        System.out.println("indexOf('e')      -&gt; " + t.indexOf('e') + ", lastIndexOf('e') -&gt; " + t.lastIndexOf('e') + ", indexOf(\\"xyz\\") -&gt; " + t.indexOf("xyz"));
        System.out.println("indexOf('e', 5)   -&gt; " + t.indexOf('e', 5));
        System.out.println("substring(7)      -&gt; " + t.substring(7));
        System.out.println("substring(0, 6)   -&gt; " + t.substring(0, 6) + "   (end index NOT included)");
        System.out.println("contains(\\"Orient\\") -&gt; " + t.contains("Orient") + ", startsWith(\\"Obj\\") -&gt; " + t.startsWith("Obj")
            + ", endsWith(\\"ing\\") -&gt; " + t.endsWith("ing"));
        System.out.println("toUpperCase()     -&gt; " + t.toUpperCase());
        System.out.println("replace('o', '0') -&gt; " + t.replace('o', '0'));
        System.out.println("replaceFirst(\\"[aeiou]\\", \\"*\\") -&gt; " + t.replaceFirst("[aeiou]", "*"));
        System.out.println("concat(\\"!\\")       -&gt; " + t.concat("!"));
        System.out.println("isEmpty()         -&gt; " + t.isEmpty() + ", \\"   \\".trim().isEmpty() -&gt; " + "   ".trim().isEmpty());
        System.out.println("matches(\\"[A-Za-z ]+\\") -&gt; " + t.matches("[A-Za-z ]+"));
        char[] cs = t.toCharArray();
        System.out.println("toCharArray().length -&gt; " + cs.length + ", String.valueOf(3.5) -&gt; " + String.valueOf(3.5)
            + ", String.valueOf(cs, 0, 6) -&gt; " + String.valueOf(cs, 0, 6));
        System.out.println("String.join(\\"-\\", \\"a\\", \\"b\\", \\"c\\") -&gt; " + String.join("-", "a", "b", "c") + "   (Java 8)");
        System.out.println("String.format(\\"%05d|%-6s|\\", 42, \\"ab\\") -&gt; " + String.format("%05d|%-6s|", 42, "ab"));
        try {
            t.substring(5, 2);
        } catch (StringIndexOutOfBoundsException e) {
            System.out.println("substring(5, 2)   -&gt; " + e.getClass().getSimpleName());
        }
    }
}</code></pre>
<div class="out">trim() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [Object Oriented Programming]<br>
length() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 27<br>
charAt(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; O<br>
indexOf('e') &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 3, lastIndexOf('e') -&gt; 13, indexOf("xyz") -&gt; -1<br>
indexOf('e', 5) &nbsp;&nbsp;-&gt; 10<br>
substring(7) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; Oriented Programming<br>
substring(0, 6) &nbsp;&nbsp;-&gt; Object &nbsp;&nbsp;(end index NOT included)<br>
contains("Orient") -&gt; true, startsWith("Obj") -&gt; true, endsWith("ing") -&gt; true<br>
toUpperCase() &nbsp;&nbsp;&nbsp;&nbsp;-&gt; OBJECT ORIENTED PROGRAMMING<br>
replace('o', '0') -&gt; Object Oriented Pr0gramming<br>
replaceFirst("[aeiou]", "*") -&gt; Obj*ct Oriented Programming<br>
concat("!") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; Object Oriented Programming!<br>
isEmpty() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; false, " &nbsp;&nbsp;".trim().isEmpty() -&gt; true<br>
matches("[A-Za-z ]+") -&gt; true<br>
toCharArray().length -&gt; 27, String.valueOf(3.5) -&gt; 3.5, String.valueOf(cs, 0, 6) -&gt; Object<br>
String.join("-", "a", "b", "c") -&gt; a-b-c &nbsp;&nbsp;(Java 8)<br>
String.format("%05d|%-6s|", 42, "ab") -&gt; 00042|ab &nbsp;&nbsp;&nbsp;|<br>
substring(5, 2) &nbsp;&nbsp;-&gt; StringIndexOutOfBoundsException</div>
<p>Keep this output open while you practise: it answers most FE "what does it return?" questions. The rules worth memorising: indexes start at 0 and <code>indexOf</code> returns −1 when not found; <code>substring(begin, end)</code> <strong>includes begin and excludes end</strong> (so its length is <code>end - begin</code>); <code>replace</code> works on plain text while <code>replaceFirst</code>/<code>replaceAll</code>/<code>matches</code>/<code>split</code> take a <strong>regular expression</strong>; static helpers are called on the class: <code>String.valueOf(3.5)</code>, <code>String.format(…)</code>, <code>String.join(…)</code> (Java 8).</p>
<div class="pitfall">FE trap: <code>"Object".substring(1, 3)</code> is <code>"bj"</code> (indexes 1 and 2) — not <code>"bje"</code>; and <code>substring(5, 2)</code> throws <code>StringIndexOutOfBoundsException</code>.</div>`,
        `<p class="y-chinh">🎯 Bảng phương thức của <code>String</code>, nhóm theo kiểu trả về: <code>char charAt</code>, <code>char[] toCharArray</code>, <code>byte[] getBytes</code>, <code>int</code> (<code>compareTo</code>, <code>indexOf</code>, <code>lastIndexOf</code>, <code>length</code>…), <code>String</code> (<code>trim</code>, <code>concat</code>, <code>replace</code>, <code>replaceAll</code>, <code>substring</code>, <code>toLowerCase</code>, <code>toUpperCase</code>…), <code>static String</code> (<code>format</code>, <code>valueOf</code>, <code>copyValueOf</code>), <code>boolean</code> (<code>contains</code>, <code>endsWith</code>, <code>startsWith</code>, <code>isEmpty</code>, <code>matches</code>, <code>equals</code>…), <code>String[] split</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 18: các phương thức String bạn dùng trong mọi câu PE, mỗi cái kèm kết quả thật
public class PhuongThucString {
    public static void main(String[] args) {
        String s = "  Object Oriented Programming  ";
        String t = s.trim();
        System.out.println("trim()            -&gt; [" + t + "]");
        System.out.println("length()          -&gt; " + t.length());
        System.out.println("charAt(0)         -&gt; " + t.charAt(0));
        System.out.println("indexOf('e')      -&gt; " + t.indexOf('e') + ", lastIndexOf('e') -&gt; " + t.lastIndexOf('e') + ", indexOf(\\"xyz\\") -&gt; " + t.indexOf("xyz"));
        System.out.println("indexOf('e', 5)   -&gt; " + t.indexOf('e', 5));
        System.out.println("substring(7)      -&gt; " + t.substring(7));
        System.out.println("substring(0, 6)   -&gt; " + t.substring(0, 6) + "   (end index NOT included)");
        System.out.println("contains(\\"Orient\\") -&gt; " + t.contains("Orient") + ", startsWith(\\"Obj\\") -&gt; " + t.startsWith("Obj")
            + ", endsWith(\\"ing\\") -&gt; " + t.endsWith("ing"));
        System.out.println("toUpperCase()     -&gt; " + t.toUpperCase());
        System.out.println("replace('o', '0') -&gt; " + t.replace('o', '0'));
        System.out.println("replaceFirst(\\"[aeiou]\\", \\"*\\") -&gt; " + t.replaceFirst("[aeiou]", "*"));
        System.out.println("concat(\\"!\\")       -&gt; " + t.concat("!"));
        System.out.println("isEmpty()         -&gt; " + t.isEmpty() + ", \\"   \\".trim().isEmpty() -&gt; " + "   ".trim().isEmpty());
        System.out.println("matches(\\"[A-Za-z ]+\\") -&gt; " + t.matches("[A-Za-z ]+"));
        char[] cs = t.toCharArray();
        System.out.println("toCharArray().length -&gt; " + cs.length + ", String.valueOf(3.5) -&gt; " + String.valueOf(3.5)
            + ", String.valueOf(cs, 0, 6) -&gt; " + String.valueOf(cs, 0, 6));
        System.out.println("String.join(\\"-\\", \\"a\\", \\"b\\", \\"c\\") -&gt; " + String.join("-", "a", "b", "c") + "   (Java 8)");
        System.out.println("String.format(\\"%05d|%-6s|\\", 42, \\"ab\\") -&gt; " + String.format("%05d|%-6s|", 42, "ab"));
        try {
            t.substring(5, 2);
        } catch (StringIndexOutOfBoundsException e) {
            System.out.println("substring(5, 2)   -&gt; " + e.getClass().getSimpleName());
        }
    }
}</code></pre>
<div class="out">trim() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [Object Oriented Programming]<br>
length() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 27<br>
charAt(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; O<br>
indexOf('e') &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 3, lastIndexOf('e') -&gt; 13, indexOf("xyz") -&gt; -1<br>
indexOf('e', 5) &nbsp;&nbsp;-&gt; 10<br>
substring(7) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; Oriented Programming<br>
substring(0, 6) &nbsp;&nbsp;-&gt; Object &nbsp;&nbsp;(end index NOT included)<br>
contains("Orient") -&gt; true, startsWith("Obj") -&gt; true, endsWith("ing") -&gt; true<br>
toUpperCase() &nbsp;&nbsp;&nbsp;&nbsp;-&gt; OBJECT ORIENTED PROGRAMMING<br>
replace('o', '0') -&gt; Object Oriented Pr0gramming<br>
replaceFirst("[aeiou]", "*") -&gt; Obj*ct Oriented Programming<br>
concat("!") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; Object Oriented Programming!<br>
isEmpty() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; false, " &nbsp;&nbsp;".trim().isEmpty() -&gt; true<br>
matches("[A-Za-z ]+") -&gt; true<br>
toCharArray().length -&gt; 27, String.valueOf(3.5) -&gt; 3.5, String.valueOf(cs, 0, 6) -&gt; Object<br>
String.join("-", "a", "b", "c") -&gt; a-b-c &nbsp;&nbsp;(Java 8)<br>
String.format("%05d|%-6s|", 42, "ab") -&gt; 00042|ab &nbsp;&nbsp;&nbsp;|<br>
substring(5, 2) &nbsp;&nbsp;-&gt; StringIndexOutOfBoundsException</div>
<p>Hãy mở output này khi luyện tập: nó trả lời phần lớn câu FE "trả về gì?". Các luật đáng thuộc: chỉ số bắt đầu từ 0 và <code>indexOf</code> trả −1 khi không thấy; <code>substring(begin, end)</code> <strong>lấy begin và bỏ end</strong> (nên độ dài là <code>end - begin</code>); <code>replace</code> làm trên chữ thường còn <code>replaceFirst</code>/<code>replaceAll</code>/<code>matches</code>/<code>split</code> nhận một <strong>biểu thức chính quy (regex)</strong>; hàm static được gọi qua tên lớp: <code>String.valueOf(3.5)</code>, <code>String.format(…)</code>, <code>String.join(…)</code> (Java 8).</p>
<div class="pitfall">Bẫy FE: <code>"Object".substring(1, 3)</code> là <code>"bj"</code> (chỉ số 1 và 2) — không phải <code>"bje"</code>; còn <code>substring(5, 2)</code> ném <code>StringIndexOutOfBoundsException</code>.</div>`],
      [19, 'The String Class',
        `<p class="y-chinh">🎯 <code>StringDemo</code> with keyboard input: read an origin string, a substring to replace and its replacement, apply <code>replaceAll</code>, print the result, its upper-case form and the origin again, then read an index and print that character with <code>format("The %d(th)character:%c\\n", …)</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 19: the school's StringDemo — replaceAll, toUpperCase, charAt with keyboard input
import java.util.Scanner;

public class StringDemo {
    public static void main(String aegs[]) {     // the slide's typo "aegs": any parameter name works
        Scanner sc = new Scanner(System.in);
        String origin, replaced, replacement;
        System.out.print("Enter the origin string: ");
        origin = sc.nextLine();
        System.out.print("Replaced substring: ");
        replaced = sc.nextLine();
        System.out.print("Replacement substring: ");
        replacement = sc.nextLine();
        origin = origin.replaceAll(replaced, replacement);
        System.out.println("After replacing: " + origin);
        System.out.println("Uppercase: " + origin.toUpperCase());
        System.out.println("Origin: " + origin);
        System.out.print("Enter an index: ");
        int index = Integer.parseInt(sc.nextLine());
        System.out.format("The %d(th)character:%c\\n", index, origin.charAt(index));
        System.out.println("-- replaceAll uses a REGEX, replace does not --");
        System.out.println("\\"a.b.c\\".replaceAll(\\".\\", \\"-\\") = " + "a.b.c".replaceAll(".", "-"));
        System.out.println("\\"a.b.c\\".replace(\\".\\", \\"-\\")    = " + "a.b.c".replace(".", "-"));
        System.out.println("\\"1+1=2\\".replaceAll(\\"\\\\\\\\+\\", \\" plus \\") = " + "1+1=2".replaceAll("\\\\+", " plus "));
    }
}</code></pre>
<div class="out">Enter the origin string: Replaced substring: Replacement substring: After replacing: do not hate me<br>
Uppercase: DO NOT HATE ME<br>
Origin: do not hate me<br>
Enter an index: The 3(th)character:n<br>
-- replaceAll uses a REGEX, replace does not --<br>
"a.b.c".replaceAll(".", "-") = -----<br>
"a.b.c".replace(".", "-") &nbsp;&nbsp;&nbsp;= a-b-c<br>
"1+1=2".replaceAll("\\\\+", " plus ") = 1 plus 1=2</div>
<p>Keyboard input used (the slide's own example):</p>
<pre><code class="language-plaintext">do not love me
love
hate
3</code></pre>
<p>Output identical to the slide: <code>do not hate me</code>, <code>DO NOT HATE ME</code>, <code>Origin: do not hate me</code> (the origin variable was <em>reassigned</em>, so it holds the replaced text), and character 3 is <code>n</code> (d=0, o=1, space=2, n=3). The <code>main(String aegs[])</code> typo on the slide compiles — the parameter name does not matter.</p>
<p>➕ The extra lines show why <code>replaceAll</code> is risky with user input: its first argument is a <strong>regex</strong>, so <code>"."</code> means "any character" and every character became <code>-</code>. Use <code>replace</code> for plain text; escape special characters (<code>"\\\\+"</code>) when you really need a regex.</p>`,
        `<p class="y-chinh">🎯 <code>StringDemo</code> có nhập bàn phím: đọc chuỗi gốc, chuỗi con cần thay và chuỗi thay thế, gọi <code>replaceAll</code>, in kết quả, dạng chữ hoa và chuỗi gốc lần nữa, rồi đọc một chỉ số và in ký tự đó bằng <code>format("The %d(th)character:%c\\n", …)</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 19: StringDemo của trường — replaceAll, toUpperCase, charAt với dữ liệu nhập bàn phím
import java.util.Scanner;

public class StringDemo {
    public static void main(String aegs[]) {     // lỗi gõ "aegs" của slide: tên tham số nào cũng được
        Scanner sc = new Scanner(System.in);
        String origin, replaced, replacement;
        System.out.print("Enter the origin string: ");
        origin = sc.nextLine();
        System.out.print("Replaced substring: ");
        replaced = sc.nextLine();
        System.out.print("Replacement substring: ");
        replacement = sc.nextLine();
        origin = origin.replaceAll(replaced, replacement);
        System.out.println("After replacing: " + origin);
        System.out.println("Uppercase: " + origin.toUpperCase());
        System.out.println("Origin: " + origin);
        System.out.print("Enter an index: ");
        int index = Integer.parseInt(sc.nextLine());
        System.out.format("The %d(th)character:%c\\n", index, origin.charAt(index));
        System.out.println("-- replaceAll uses a REGEX, replace does not --");
        System.out.println("\\"a.b.c\\".replaceAll(\\".\\", \\"-\\") = " + "a.b.c".replaceAll(".", "-"));
        System.out.println("\\"a.b.c\\".replace(\\".\\", \\"-\\")    = " + "a.b.c".replace(".", "-"));
        System.out.println("\\"1+1=2\\".replaceAll(\\"\\\\\\\\+\\", \\" plus \\") = " + "1+1=2".replaceAll("\\\\+", " plus "));
    }
}</code></pre>
<div class="out">Enter the origin string: Replaced substring: Replacement substring: After replacing: do not hate me<br>
Uppercase: DO NOT HATE ME<br>
Origin: do not hate me<br>
Enter an index: The 3(th)character:n<br>
-- replaceAll uses a REGEX, replace does not --<br>
"a.b.c".replaceAll(".", "-") = -----<br>
"a.b.c".replace(".", "-") &nbsp;&nbsp;&nbsp;= a-b-c<br>
"1+1=2".replaceAll("\\\\+", " plus ") = 1 plus 1=2</div>
<p>Dữ liệu bàn phím đã dùng (chính ví dụ của slide):</p>
<pre><code class="language-plaintext">do not love me
love
hate
3</code></pre>
<p>Output trùng slide: <code>do not hate me</code>, <code>DO NOT HATE ME</code>, <code>Origin: do not hate me</code> (biến origin đã bị <em>gán lại</em>, nên nó giữ chuỗi đã thay), và ký tự số 3 là <code>n</code> (d=0, o=1, dấu cách=2, n=3). Lỗi gõ <code>main(String aegs[])</code> trên slide vẫn biên dịch được — tên tham số không quan trọng.</p>
<p>➕ Các dòng thêm cho thấy vì sao <code>replaceAll</code> nguy hiểm với dữ liệu người dùng: đối số đầu là <strong>regex</strong>, nên <code>"."</code> nghĩa là "ký tự bất kỳ" và mọi ký tự đều thành <code>-</code>. Dùng <code>replace</code> cho chữ thường; thoát ký tự đặc biệt (<code>"\\\\+"</code>) khi thật sự cần regex.</p>`],
      [20, 'StringBuffer, StringBuilder Classes',
        `<p class="y-chinh">🎯 <code>StringBuffer</code> and <code>StringBuilder</code> represent strings that can be modified; <code>StringBuffer</code> is thread-safe, <code>StringBuilder</code> (Java 5.0) is not; most of their methods are like String's; a thread is a unit of code running; in a multi-threaded program, threads that access common data must take turns through <strong>synchronized</strong> methods — a class whose methods are synchronized is called thread-safe.</p>
<p>The slide says that when two threads access common data "their values are not un-predictable" — a double negative; the intended meaning is the opposite: the values <strong>become unpredictable</strong> (a "race condition") unless access is synchronized. That is why <code>StringBuffer</code>'s methods are <code>synchronized</code>: only one thread at a time can append.</p>
<p>In PRO192 and LAB211 your programs have one thread, so the rule is simple: <strong>use <code>StringBuilder</code></strong>. It has the same methods as <code>StringBuffer</code> and does not pay for locking it does not need. <code>StringBuffer</code> survives in old code and in the slide's demo (next slide).</p>
<div class="callout">🧭 <strong>Go further — PRJ301 / Spring Boot</strong>: a web server serves many requests at the same time on many threads — there "thread-safe" stops being theory. A shared object (a servlet, a Spring bean) must not keep per-request data in fields.</div>`,
        `<p class="y-chinh">🎯 <code>StringBuffer</code> và <code>StringBuilder</code> biểu diễn chuỗi sửa được; <code>StringBuffer</code> an toàn luồng (thread-safe), <code>StringBuilder</code> (Java 5.0) thì không; phần lớn phương thức của chúng giống của String; luồng (thread) là một đơn vị code đang chạy; trong chương trình đa luồng, các luồng cùng truy cập dữ liệu chung phải lần lượt qua các phương thức <strong>synchronized</strong> — lớp có các phương thức synchronized gọi là thread-safe.</p>
<p>Slide viết khi hai luồng truy cập dữ liệu chung thì "giá trị không phải không đoán trước được" — phủ định kép; ý đúng là ngược lại: giá trị <strong>trở nên không đoán trước được</strong> ("race condition" — tranh chấp) nếu truy cập không được đồng bộ. Vì vậy các phương thức của <code>StringBuffer</code> là <code>synchronized</code>: mỗi lúc chỉ một luồng được append.</p>
<p>Ở PRO192 và LAB211 chương trình của bạn chỉ có một luồng, nên luật rất đơn giản: <strong>dùng <code>StringBuilder</code></strong>. Nó có đúng các phương thức của <code>StringBuffer</code> và không phải trả giá cho việc khoá mà nó không cần. <code>StringBuffer</code> còn sống trong code cũ và trong demo của slide (slide sau).</p>
<div class="callout">🧭 <strong>Đi tiếp — PRJ301 / Spring Boot</strong>: web server phục vụ nhiều request cùng lúc trên nhiều luồng — ở đó "thread-safe" không còn là lý thuyết. Một đối tượng dùng chung (servlet, bean Spring) không được giữ dữ liệu riêng của từng request trong trường.</div>`],
      [21, 'The StringBuffer - threadsafe',
        `<p class="y-chinh">🎯 <code>public final class StringBuffer extends Object implements Serializable, CharSequence</code>, and the demo: <code>"01234567"</code> → <code>append("ABC")</code> → <code>insert(2, "FAT PERSON")</code> → <code>reverse()</code>.</p>
<pre class="trich"><code class="language-java">StringBuffer sb = new StringBuffer("01234567");
System.out.println(sb);
sb.append("ABC");
System.out.println(sb);
sb.insert(2, "FAT PERSON");
System.out.println(sb);
sb.reverse();
System.out.println(sb);</code></pre>
<p>The output (shown under slide 22) is the slide's four lines: <code>01234567</code>, <code>01234567ABC</code>, <code>01FAT PERSON234567ABC</code>, <code>CBA765432NOSREP TAF10</code>. Unlike String's methods, every call <strong>changed the same object</strong> — no assignment needed: <code>sb.append("ABC");</code> on its own line works, exactly what <code>s.concat("ABC");</code> did <em>not</em> do on slide 15.</p>
<p>The API's actual declaration (JDK 8) is <code>public final class StringBuffer extends AbstractStringBuilder implements Serializable, CharSequence</code> — the slide simplified the parent class, which is package-private and shared with StringBuilder (the UML on slide 14).</p>`,
        `<p class="y-chinh">🎯 <code>public final class StringBuffer extends Object implements Serializable, CharSequence</code>, và demo: <code>"01234567"</code> → <code>append("ABC")</code> → <code>insert(2, "FAT PERSON")</code> → <code>reverse()</code>.</p>
<pre class="trich"><code class="language-java">StringBuffer sb = new StringBuffer("01234567");
System.out.println(sb);
sb.append("ABC");
System.out.println(sb);
sb.insert(2, "FAT PERSON");
System.out.println(sb);
sb.reverse();
System.out.println(sb);</code></pre>
<p>Output (hiện dưới slide 22) là bốn dòng của slide: <code>01234567</code>, <code>01234567ABC</code>, <code>01FAT PERSON234567ABC</code>, <code>CBA765432NOSREP TAF10</code>. Khác phương thức của String, mỗi lời gọi <strong>sửa chính đối tượng đó</strong> — không cần gán: <code>sb.append("ABC");</code> đứng một mình vẫn có tác dụng, đúng điều mà <code>s.concat("ABC");</code> ở slide 15 <em>không</em> làm được.</p>
<p>Khai báo thật trong API (JDK 8) là <code>public final class StringBuffer extends AbstractStringBuilder implements Serializable, CharSequence</code> — slide đã rút gọn lớp cha, vốn là lớp package-private dùng chung với StringBuilder (sơ đồ UML ở slide 14).</p>`],
      [22, 'StringBuilder',
        `<p class="y-chinh">🎯 <code>StringBuilder</code> (Java 5.0) is nearly identical to <code>StringBuffer</code>; the major difference: it is not thread-safe; use a StringBuffer if several threads share a mutable string, and a StringBuilder for a single thread — it is generally faster.</p>
<pre class="trich"><code class="language-java">StringBuilder b = new StringBuilder("Java");
StringBuilder same = b.append(" 8");      // returns the SAME object, so calls can be chained
System.out.println("b == b.append(...) ? " + (b == same) + ", b = " + b);
b.insert(0, "[").append("]").setCharAt(1, 'j');
System.out.println("insert/append/setCharAt -&gt; " + b);
b.deleteCharAt(0).delete(b.length() - 1, b.length()).replace(0, 4, "JAVA");
System.out.println("deleteCharAt/delete/replace -&gt; " + b + ", length " + b.length() + ", indexOf(\\"8\\") " + b.indexOf("8"));
String ketQua = b.toString();             // back to an immutable String
System.out.println("toString() -&gt; \\"" + ketQua + "\\", String.equals(StringBuilder)? " + ketQua.equals(b)
    + ", contentEquals? " + ketQua.contentEquals(b));</code></pre>
<div class="out">01234567<br>
01234567ABC<br>
01FAT PERSON234567ABC<br>
CBA765432NOSREP TAF10<br>
b == b.append(...) ? true, b = Java 8<br>
insert/append/setCharAt -&gt; [java 8]<br>
deleteCharAt/delete/replace -&gt; JAVA 8, length 6, indexOf("8") 5<br>
toString() -&gt; "JAVA 8", String.equals(StringBuilder)? false, contentEquals? true</div>
<p>Each method returns the <strong>same</strong> builder (<code>b == b.append(...)</code> is true), which is why calls can be chained. Convert back with <code>toString()</code> when you need a String — and note that <code>String.equals(StringBuilder)</code> is false even with the same text (different classes); compare with <code>contentEquals</code> or compare two Strings. Why it matters for speed — what JDK 8 really compiles <code>s += i</code> in a loop into:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Loop.java",
        "public class Loop {\\n" +
        "    static String plus(int n) {\\n" +
        "        String s = \\"\\";\\n" +
        "        for (int i = 0; i &lt; n; i++) s += i;\\n" +
        "        return s;\\n" +
        "    }\\n" +
        "    static String builder(int n) {\\n" +
        "        StringBuilder sb = new StringBuilder();\\n" +
        "        for (int i = 0; i &lt; n; i++) sb.append(i);\\n" +
        "        return sb.toString();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Loop.java");
    javapLoc(d, "Loop");            // print only the lines that create objects or jump back
}</code></pre>
<div class="out">&gt; javac Loop.java<br>
&gt; javap -c Loop &nbsp;&nbsp;(only lines with: method names, new, goto)<br>
&nbsp;&nbsp;static java.lang.String plus(int);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10: new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#3 &nbsp;&nbsp;// class java/lang/StringBuilder<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32: goto &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5<br>
&nbsp;&nbsp;static java.lang.String builder(int);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#3 &nbsp;&nbsp;// class java/lang/StringBuilder<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24: goto &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10</div>
<p>In <code>plus</code>, the <code>new StringBuilder</code> sits <em>inside</em> the loop (at bytecode 10, before the <code>goto 5</code> that jumps back): every turn creates a builder and a new String — n turns, n² character copies. In <code>builder</code> it is created once, before the loop.</p>
<div class="pitfall">PE habit: build any string in a loop (reversing words, joining results) with one <code>StringBuilder</code>, then <code>toString()</code> once at the end.</div>`,
        `<p class="y-chinh">🎯 <code>StringBuilder</code> (Java 5.0) gần như giống hệt <code>StringBuffer</code>; khác biệt chính: nó không an toàn luồng; dùng StringBuffer nếu nhiều luồng dùng chung một chuỗi khả biến, và StringBuilder cho một luồng — thường nhanh hơn.</p>
<pre class="trich"><code class="language-java">StringBuilder b = new StringBuilder("Java");
StringBuilder same = b.append(" 8");      // trả về CHÍNH đối tượng đó, nên gọi nối tiếp được
System.out.println("b == b.append(...) ? " + (b == same) + ", b = " + b);
b.insert(0, "[").append("]").setCharAt(1, 'j');
System.out.println("insert/append/setCharAt -&gt; " + b);
b.deleteCharAt(0).delete(b.length() - 1, b.length()).replace(0, 4, "JAVA");
System.out.println("deleteCharAt/delete/replace -&gt; " + b + ", length " + b.length() + ", indexOf(\\"8\\") " + b.indexOf("8"));
String ketQua = b.toString();             // quay về String bất biến
System.out.println("toString() -&gt; \\"" + ketQua + "\\", String.equals(StringBuilder)? " + ketQua.equals(b)
    + ", contentEquals? " + ketQua.contentEquals(b));</code></pre>
<div class="out">01234567<br>
01234567ABC<br>
01FAT PERSON234567ABC<br>
CBA765432NOSREP TAF10<br>
b == b.append(...) ? true, b = Java 8<br>
insert/append/setCharAt -&gt; [java 8]<br>
deleteCharAt/delete/replace -&gt; JAVA 8, length 6, indexOf("8") 5<br>
toString() -&gt; "JAVA 8", String.equals(StringBuilder)? false, contentEquals? true</div>
<p>Mỗi phương thức trả về <strong>chính</strong> builder đó (<code>b == b.append(...)</code> là true), nên các lời gọi nối tiếp được. Đổi lại thành String bằng <code>toString()</code> khi cần — và chú ý <code>String.equals(StringBuilder)</code> là false dù cùng chữ (khác lớp); hãy so bằng <code>contentEquals</code> hoặc so hai String. Vì sao điều này quan trọng với tốc độ — JDK 8 thật sự biên dịch <code>s += i</code> trong vòng lặp thành gì:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Loop.java",
        "public class Loop {\\n" +
        "    static String plus(int n) {\\n" +
        "        String s = \\"\\";\\n" +
        "        for (int i = 0; i &lt; n; i++) s += i;\\n" +
        "        return s;\\n" +
        "    }\\n" +
        "    static String builder(int n) {\\n" +
        "        StringBuilder sb = new StringBuilder();\\n" +
        "        for (int i = 0; i &lt; n; i++) sb.append(i);\\n" +
        "        return sb.toString();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Loop.java");
    javapLoc(d, "Loop");            // chỉ in các dòng tạo đối tượng hoặc nhảy ngược
}</code></pre>
<div class="out">&gt; javac Loop.java<br>
&gt; javap -c Loop &nbsp;&nbsp;(only lines with: method names, new, goto)<br>
&nbsp;&nbsp;static java.lang.String plus(int);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10: new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#3 &nbsp;&nbsp;// class java/lang/StringBuilder<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32: goto &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5<br>
&nbsp;&nbsp;static java.lang.String builder(int);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0: new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#3 &nbsp;&nbsp;// class java/lang/StringBuilder<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24: goto &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10</div>
<p>Trong <code>plus</code>, lệnh <code>new StringBuilder</code> nằm <em>trong</em> vòng lặp (ở bytecode 10, trước lệnh <code>goto 5</code> nhảy ngược lại): mỗi vòng tạo một builder và một String mới — n vòng, n² lần chép ký tự. Trong <code>builder</code> nó được tạo đúng một lần, trước vòng lặp.</p>
<div class="pitfall">Thói quen PE: dựng mọi chuỗi trong vòng lặp (đảo từ, ghép kết quả) bằng một <code>StringBuilder</code>, rồi gọi <code>toString()</code> một lần ở cuối.</div>`],
      [23, 'String Concatenation, the Easy Way',
        `<p class="y-chinh">🎯 Two ways to concatenate: the method <code>String.concat()</code> (and <code>StringBuffer.append()</code> for a buffer), or the overloaded <code>+</code> operator.</p>
<pre><code class="language-java">// release: 8
// Slide 23: the two ways to concatenate — concat() and + — and how they differ with null and with numbers
public class NoiChuoi {
    public static void main(String[] args) {
        String a = "Hello", b = null;
        System.out.println("a.concat(\\" World\\") = " + a.concat(" World"));
        System.out.println("a + \\" World\\"       = " + (a + " World"));
        System.out.println("a + b              = " + (a + b));
        try {
            System.out.println(a.concat(b));
        } catch (NullPointerException e) {
            System.out.println("a.concat(null)     -&gt; " + e.getClass().getSimpleName());
        }
        System.out.println("a + 1 + 2          = " + (a + 1 + 2) + ",  a.concat(String.valueOf(1 + 2)) = " + a.concat(String.valueOf(1 + 2)));
        StringBuffer buf = new StringBuffer(a);
        buf.append(' ').append(2026).append(true);
        System.out.println("StringBuffer.append chain = " + buf);
        String s = "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i &lt; 5; i++) { s += i; sb.append(i); }   // same text, very different cost
        System.out.println("loop with += : " + s + ",  loop with StringBuilder: " + sb);
    }
}</code></pre>
<div class="out">a.concat(" World") = Hello World<br>
a + " World" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= Hello World<br>
a + b &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= Hellonull<br>
a.concat(null) &nbsp;&nbsp;&nbsp;&nbsp;-&gt; NullPointerException<br>
a + 1 + 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= Hello12, &nbsp;a.concat(String.valueOf(1 + 2)) = Hello3<br>
StringBuffer.append chain = Hello 2026true<br>
loop with += : 01234, &nbsp;loop with StringBuilder: 01234</div>
<p>They are not interchangeable: <code>+</code> accepts anything (numbers, <code>char</code>, <code>boolean</code>, <code>null</code> — which becomes the text "null") and works left to right (<code>a + 1 + 2</code> is <code>Hello12</code>); <code>concat</code> accepts only a String and throws <code>NullPointerException</code> for <code>null</code>. <code>append</code> on a StringBuffer/StringBuilder accepts every type and returns the builder, so it chains.</p>
<p>"Overloaded" means one operator symbol with several meanings chosen by the operand types — Java does this only for <code>+</code> on Strings; you cannot overload operators in your own classes (unlike C++). Overloading of <em>methods</em> comes in Chapter 4.</p>
<p class="meo">🧠 For one-off joins use <code>+</code> (it is the clearest); in loops use <code>StringBuilder.append</code>; to join a list with a separator use <code>String.join(", ", list)</code>.</p>`,
        `<p class="y-chinh">🎯 Hai cách nối chuỗi: phương thức <code>String.concat()</code> (và <code>StringBuffer.append()</code> cho buffer), hoặc toán tử <code>+</code> được nạp chồng (overloaded).</p>
<pre><code class="language-java">// release: 8
// Slide 23: hai cách nối chuỗi — concat() và + — và chúng khác nhau thế nào với null và với số
public class NoiChuoi {
    public static void main(String[] args) {
        String a = "Hello", b = null;
        System.out.println("a.concat(\\" World\\") = " + a.concat(" World"));
        System.out.println("a + \\" World\\"       = " + (a + " World"));
        System.out.println("a + b              = " + (a + b));
        try {
            System.out.println(a.concat(b));
        } catch (NullPointerException e) {
            System.out.println("a.concat(null)     -&gt; " + e.getClass().getSimpleName());
        }
        System.out.println("a + 1 + 2          = " + (a + 1 + 2) + ",  a.concat(String.valueOf(1 + 2)) = " + a.concat(String.valueOf(1 + 2)));
        StringBuffer buf = new StringBuffer(a);
        buf.append(' ').append(2026).append(true);
        System.out.println("StringBuffer.append chain = " + buf);
        String s = "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i &lt; 5; i++) { s += i; sb.append(i); }   // cùng chữ, chi phí rất khác
        System.out.println("loop with += : " + s + ",  loop with StringBuilder: " + sb);
    }
}</code></pre>
<div class="out">a.concat(" World") = Hello World<br>
a + " World" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= Hello World<br>
a + b &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= Hellonull<br>
a.concat(null) &nbsp;&nbsp;&nbsp;&nbsp;-&gt; NullPointerException<br>
a + 1 + 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= Hello12, &nbsp;a.concat(String.valueOf(1 + 2)) = Hello3<br>
StringBuffer.append chain = Hello 2026true<br>
loop with += : 01234, &nbsp;loop with StringBuilder: 01234</div>
<p>Chúng không thay thế nhau được: <code>+</code> nhận mọi thứ (số, <code>char</code>, <code>boolean</code>, <code>null</code> — thành chữ "null") và chạy từ trái sang phải (<code>a + 1 + 2</code> là <code>Hello12</code>); <code>concat</code> chỉ nhận String và ném <code>NullPointerException</code> với <code>null</code>. <code>append</code> trên StringBuffer/StringBuilder nhận mọi kiểu và trả về chính builder, nên gọi nối tiếp được.</p>
<p>"Nạp chồng (overloaded)" nghĩa là một ký hiệu toán tử mang nhiều nghĩa, chọn theo kiểu toán hạng — Java chỉ làm điều đó với <code>+</code> trên String; bạn không nạp chồng toán tử được trong lớp của mình (khác C++). Nạp chồng <em>phương thức</em> sẽ học ở Chương 4.</p>
<p class="meo">🧠 Nối một lần thì dùng <code>+</code> (rõ ràng nhất); trong vòng lặp dùng <code>StringBuilder.append</code>; nối một danh sách kèm dấu phân cách thì dùng <code>String.join(", ", list)</code>.</p>`],
      [24, 'Scanning Text',
        `<p class="y-chinh">🎯 <code>java.util.Scanner</code> gets data, one item after another, from a data source of characters (memory variable, keyboard, file) into variables: <code>next()</code>/<code>nextXXX()</code> get data, <code>hasNext()</code>/<code>hasNextXXX()</code> check whether data is available; a <strong>token</strong> is a group of characters that has a meaning; delimiters between tokens are skipped.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7c191ad7f29e324aec8a5065df0aca8eb0d85dac.svg" alt="Slide 24's diagram widened: one Scanner, three kinds of source, the token loop, and where nextLine is different" loading="lazy" /><p class="chu-thich">🧩 Slide 24's diagram widened: one Scanner, three kinds of source, the token loop, and where nextLine is different</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 24–26 — how a Scanner turns characters into values
' The same Scanner methods work on the keyboard, a String or a File
start
:data source\\n(System.in · a String · a File);
:characters arrive one after another;
repeat
  :skip delimiters\\n(default: whitespace; or useDelimiter(regex));
  :collect characters up to the next delimiter\\n(that group is one TOKEN);
  if (which call?) then (next())
    :return the token as a String;
  elseif (nextInt() / nextDouble()) then
    :convert the token;\\nwrong format -&gt; InputMismatchException;
  else (nextLine())
    :return the REST of the current line\\n(delimiters ignored);
  endif
repeat while (hasNext() / hasNextInt() ... ?) is (true)
-&gt; false;
stop
@enduml</code></pre></details>
<p>The same Scanner methods work whatever the source is: <code>new Scanner(System.in)</code> (keyboard), <code>new Scanner("abc 123")</code> (a String — slide 25), <code>new Scanner(new File("f1.txt"))</code> (a file — slide 26). <code>nextInt()</code> converts the next token and throws <code>InputMismatchException</code> if it is not a number — check with <code>hasNextInt()</code> first, as the second half of the next program does.</p>
<p><code>nextLine()</code> is the odd one: it does not look for a token, it returns the <strong>rest of the current line</strong>. That difference is the "nextInt then nextLine reads an empty line" bug (Section 0, ⭐ "First hands-on session").</p>`,
        `<p class="y-chinh">🎯 <code>java.util.Scanner</code> lấy dữ liệu, từng mục một, từ một nguồn dữ liệu là các ký tự (biến trong bộ nhớ, bàn phím, tệp) đưa vào biến: <code>next()</code>/<code>nextXXX()</code> để lấy dữ liệu, <code>hasNext()</code>/<code>hasNextXXX()</code> để kiểm tra còn dữ liệu không; <strong>token</strong> là một nhóm ký tự có nghĩa; dấu phân cách giữa các token bị bỏ qua.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7c191ad7f29e324aec8a5065df0aca8eb0d85dac.svg" alt="Sơ đồ của slide 24 mở rộng: một Scanner, ba loại nguồn, vòng lặp token, và chỗ nextLine khác biệt" loading="lazy" /><p class="chu-thich">🧩 Sơ đồ của slide 24 mở rộng: một Scanner, ba loại nguồn, vòng lặp token, và chỗ nextLine khác biệt</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 24–26 — how a Scanner turns characters into values
' Cùng các phương thức Scanner dùng được cho bàn phím, một String hoặc một File
start
:data source\\n(System.in · a String · a File);
:characters arrive one after another;
repeat
  :skip delimiters\\n(default: whitespace; or useDelimiter(regex));
  :collect characters up to the next delimiter\\n(that group is one TOKEN);
  if (which call?) then (next())
    :return the token as a String;
  elseif (nextInt() / nextDouble()) then
    :convert the token;\\nwrong format -&gt; InputMismatchException;
  else (nextLine())
    :return the REST of the current line\\n(delimiters ignored);
  endif
repeat while (hasNext() / hasNextInt() ... ?) is (true)
-&gt; false;
stop
@enduml</code></pre></details>
<p>Cùng các phương thức Scanner dùng được với nguồn nào cũng vậy: <code>new Scanner(System.in)</code> (bàn phím), <code>new Scanner("abc 123")</code> (một String — slide 25), <code>new Scanner(new File("f1.txt"))</code> (một tệp — slide 26). <code>nextInt()</code> đổi token kế tiếp và ném <code>InputMismatchException</code> nếu nó không phải số — hãy kiểm bằng <code>hasNextInt()</code> trước, như nửa sau của chương trình tiếp theo.</p>
<p><code>nextLine()</code> là kẻ khác người: nó không tìm token, nó trả về <strong>phần còn lại của dòng hiện tại</strong>. Chính sự khác biệt đó gây ra lỗi "nextInt rồi nextLine đọc phải dòng rỗng" (Mục 0, bài ⭐ "Buổi thực hành đầu tiên").</p>`],
      [25, 'Scanning data from a string',
        `<p class="y-chinh">🎯 <code>ScannerDemo</code>: scan the words of a Vietnamese sentence; read <code>"abc 123 556.78"</code> with <code>next()</code>, <code>nextInt()</code>, <code>nextDouble()</code>; then use the delimiter <code>"[au\\\\s]+"</code> — one or more of <code>a</code>, <code>u</code> or white space — on <code>"  How are     you!   "</code>, giving <code>How</code>, <code>re</code>, <code>yo</code>, <code>!</code>.</p>
<pre><code class="language-java">// release: 8
// Slides 24–25: the school's ScannerDemo — a Scanner reads tokens from a String, with the default or a custom delimiter
import java.util.Scanner;

public class ScannerDemo {
    public static void main(String[] args) {
        String S = "Anh hùng khôn quá mỹ nhân quan";
        Scanner sc1 = new Scanner(S);
        while (sc1.hasNext()) System.out.println(sc1.next());
        System.out.println();
        String S2 = "abc 123 556.78";
        Scanner sc2 = new Scanner(S2);
        System.out.println(sc2.next());
        System.out.println(sc2.nextInt());
        System.out.println(sc2.nextDouble());
        System.out.println();
        String S3 = "  How are     you!   ";
        String delim = "[au\\\\s]+";   // s: space, +: &gt;=1 occurrence
        Scanner sc3 = new Scanner(S3);
        sc3.useDelimiter(delim);
        while (sc3.hasNext()) System.out.println(sc3.next());
        Scanner sc4 = new Scanner("12 abc 3.5");
        System.out.println("hasNextInt? " + sc4.hasNextInt() + " -&gt; " + sc4.nextInt());
        System.out.println("hasNextInt? " + sc4.hasNextInt() + " (next token is \\"" + sc4.next() + "\\")");
        System.out.println("hasNextDouble? " + sc4.hasNextDouble() + " -&gt; " + sc4.nextDouble() + ", hasNext? " + sc4.hasNext());
    }
}</code></pre>
<div class="out">Anh<br>
hùng<br>
khôn<br>
quá<br>
mỹ<br>
nhân<br>
quan<br>
<br>
abc<br>
123<br>
556.78<br>
<br>
How<br>
re<br>
yo<br>
!<br>
hasNextInt? true -&gt; 12<br>
hasNextInt? false (next token is "abc")<br>
hasNextDouble? true -&gt; 3.5, hasNext? false</div>
<p>The default delimiter is <strong>white space</strong> (one or more spaces, tabs, line breaks), so the seven Vietnamese words come out one per line — Unicode letters are fine. In the regex <code>[au\\\\s]+</code>, <code>[…]</code> means "one of these characters", <code>\\s</code> means white space (written <code>\\\\s</code> inside a Java string), <code>+</code> means "one or more". "are" loses its <code>a</code>, "you!" loses its <code>u</code>; leading delimiters are skipped, so no empty token appears.</p>
<p>The <code>hasNextInt()</code> lines show the safe way to read mixed input: ask first, then read; when the next token is not a number, consume it with <code>next()</code> to move on.</p>
<div class="pitfall">FE trap: after <code>sc.useDelimiter(",")</code> the spaces are <em>not</em> delimiters any more — <code>"1, 2"</code> gives the tokens <code>"1"</code> and <code>" 2"</code>, and <code>nextInt()</code> fails on the second one.</div>`,
        `<p class="y-chinh">🎯 <code>ScannerDemo</code>: tách các từ của một câu tiếng Việt; đọc <code>"abc 123 556.78"</code> bằng <code>next()</code>, <code>nextInt()</code>, <code>nextDouble()</code>; rồi dùng dấu phân cách <code>"[au\\\\s]+"</code> — một hoặc nhiều ký tự <code>a</code>, <code>u</code> hay khoảng trắng — trên <code>"  How are     you!   "</code>, ra <code>How</code>, <code>re</code>, <code>yo</code>, <code>!</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 24–25: ScannerDemo của trường — Scanner đọc token từ một String, với dấu phân cách mặc định hoặc tự đặt
import java.util.Scanner;

public class ScannerDemo {
    public static void main(String[] args) {
        String S = "Anh hùng khôn quá mỹ nhân quan";
        Scanner sc1 = new Scanner(S);
        while (sc1.hasNext()) System.out.println(sc1.next());
        System.out.println();
        String S2 = "abc 123 556.78";
        Scanner sc2 = new Scanner(S2);
        System.out.println(sc2.next());
        System.out.println(sc2.nextInt());
        System.out.println(sc2.nextDouble());
        System.out.println();
        String S3 = "  How are     you!   ";
        String delim = "[au\\\\s]+";   // s: khoảng trắng, +: xuất hiện &gt;= 1 lần
        Scanner sc3 = new Scanner(S3);
        sc3.useDelimiter(delim);
        while (sc3.hasNext()) System.out.println(sc3.next());
        Scanner sc4 = new Scanner("12 abc 3.5");
        System.out.println("hasNextInt? " + sc4.hasNextInt() + " -&gt; " + sc4.nextInt());
        System.out.println("hasNextInt? " + sc4.hasNextInt() + " (next token is \\"" + sc4.next() + "\\")");
        System.out.println("hasNextDouble? " + sc4.hasNextDouble() + " -&gt; " + sc4.nextDouble() + ", hasNext? " + sc4.hasNext());
    }
}</code></pre>
<div class="out">Anh<br>
hùng<br>
khôn<br>
quá<br>
mỹ<br>
nhân<br>
quan<br>
<br>
abc<br>
123<br>
556.78<br>
<br>
How<br>
re<br>
yo<br>
!<br>
hasNextInt? true -&gt; 12<br>
hasNextInt? false (next token is "abc")<br>
hasNextDouble? true -&gt; 3.5, hasNext? false</div>
<p>Dấu phân cách mặc định là <strong>khoảng trắng</strong> (một hoặc nhiều dấu cách, tab, xuống dòng), nên bảy từ tiếng Việt ra mỗi từ một dòng — chữ Unicode không vấn đề gì. Trong regex <code>[au\\\\s]+</code>, <code>[…]</code> nghĩa là "một trong các ký tự này", <code>\\s</code> là khoảng trắng (viết <code>\\\\s</code> trong chuỗi Java), <code>+</code> là "một hoặc nhiều". "are" mất chữ <code>a</code>, "you!" mất chữ <code>u</code>; dấu phân cách ở đầu bị bỏ qua, nên không có token rỗng nào.</p>
<p>Các dòng <code>hasNextInt()</code> cho thấy cách an toàn để đọc dữ liệu lẫn lộn: hỏi trước, đọc sau; khi token kế tiếp không phải số thì "ăn" nó bằng <code>next()</code> để đi tiếp.</p>
<div class="pitfall">Bẫy FE: sau <code>sc.useDelimiter(",")</code> dấu cách <em>không còn</em> là dấu phân cách — <code>"1, 2"</code> cho các token <code>"1"</code> và <code>" 2"</code>, và <code>nextInt()</code> hỏng ở token thứ hai.</div>`],
      [26, 'Scanning data from a text file, Specifying Delimiters',
        `<p class="y-chinh">🎯 <code>ScannerDemo2</code>: create <code>f1.txt</code> in the project folder (NetBeans: New File → Other → Empty File) containing <code>abc123...asq8907dfr</code>; open it with <code>new Scanner(new File("f1.txt"))</code> inside <code>try … catch</code>; with the delimiter <code>"[[.]\\\\d]+"</code> (dots and digits) the tokens are <code>abc</code>, <code>asq</code>, <code>dfr</code>; common regex patterns: <code>[ ]</code> one character, <code>.</code> any character, <code>\\d</code> digit, <code>\\w</code> word character, <code>\\s</code> space, quantifiers <code>*</code> (≥0), <code>+</code> (≥1), <code>?</code> (0 or 1), <code>[a-zA-Z]</code>; see <code>java.util.regex.Pattern</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 26: the school's ScannerDemo2 — read tokens from a text file with a regex delimiter (the file is created first, in a temp folder)
import java.io.File;
import java.io.FileWriter;
import java.nio.file.Files;
import java.util.Scanner;

public class ScannerFile {
    public static void main(String[] args) throws Exception {
        File thuMuc = Files.createTempDirectory("chapter08").toFile();
        File f = new File(thuMuc, "f1.txt");
        FileWriter w = new FileWriter(f);
        w.write("abc123...asq8907dfr");               // the content of f1.txt on the slide
        w.close();
        try {
            Scanner sc = new Scanner(f);
            sc.useDelimiter("[[.]\\\\d]+");             // one or more of: '.' or a digit
            while (sc.hasNext())
                System.out.println(sc.next());
            sc.close();
        } catch (Exception e) {
            System.out.println(e);
        }
        try {
            new Scanner(new File(thuMuc, "khong-co.txt"));
        } catch (Exception e) {
            System.out.println(e.getClass().getName());     // the message holds a temp path, so print the class only
        }
        f.delete();
        thuMuc.delete();
    }
}</code></pre>
<div class="out">abc<br>
asq<br>
dfr<br>
java.io.FileNotFoundException</div>
<p>Same three tokens as the slide. The program first writes the file into a temporary folder so the run does not depend on the current directory; in NetBeans <code>new File("f1.txt")</code> is relative to the <strong>project folder</strong> (where <code>build.xml</code> is), which is why the slide puts the file there and not in <code>src</code>. Inside <code>[ ]</code> a dot is a literal dot, so <code>[.]</code> equals <code>\\\\.</code>.</p>
<p><code>new Scanner(File)</code> can throw <code>FileNotFoundException</code>, a <em>checked</em> exception: the compiler forces <code>try/catch</code> (or <code>throws</code>) — the last line of the run shows it for a missing file. Chapter 6 explains checked exceptions; Chapter 9 reads files properly.</p>`,
        `<p class="y-chinh">🎯 <code>ScannerDemo2</code>: tạo <code>f1.txt</code> trong thư mục project (NetBeans: New File → Other → Empty File) chứa <code>abc123...asq8907dfr</code>; mở bằng <code>new Scanner(new File("f1.txt"))</code> trong <code>try … catch</code>; với dấu phân cách <code>"[[.]\\\\d]+"</code> (dấu chấm và chữ số) các token là <code>abc</code>, <code>asq</code>, <code>dfr</code>; các mẫu regex hay dùng: <code>[ ]</code> một ký tự, <code>.</code> ký tự bất kỳ, <code>\\d</code> chữ số, <code>\\w</code> ký tự chữ, <code>\\s</code> khoảng trắng, lượng từ <code>*</code> (≥0), <code>+</code> (≥1), <code>?</code> (0 hoặc 1), <code>[a-zA-Z]</code>; xem <code>java.util.regex.Pattern</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 26: ScannerDemo2 của trường — đọc token từ tệp văn bản với dấu phân cách regex (tạo tệp trước, trong thư mục tạm)
import java.io.File;
import java.io.FileWriter;
import java.nio.file.Files;
import java.util.Scanner;

public class ScannerFile {
    public static void main(String[] args) throws Exception {
        File thuMuc = Files.createTempDirectory("chapter08").toFile();
        File f = new File(thuMuc, "f1.txt");
        FileWriter w = new FileWriter(f);
        w.write("abc123...asq8907dfr");               // nội dung f1.txt trên slide
        w.close();
        try {
            Scanner sc = new Scanner(f);
            sc.useDelimiter("[[.]\\\\d]+");             // một hoặc nhiều ký tự: '.' hoặc chữ số
            while (sc.hasNext())
                System.out.println(sc.next());
            sc.close();
        } catch (Exception e) {
            System.out.println(e);
        }
        try {
            new Scanner(new File(thuMuc, "khong-co.txt"));
        } catch (Exception e) {
            System.out.println(e.getClass().getName());     // thông báo chứa đường dẫn tạm, nên chỉ in tên lớp
        }
        f.delete();
        thuMuc.delete();
    }
}</code></pre>
<div class="out">abc<br>
asq<br>
dfr<br>
java.io.FileNotFoundException</div>
<p>Ra đúng ba token như slide. Chương trình ghi tệp vào một thư mục tạm trước để lần chạy không phụ thuộc thư mục hiện tại; trong NetBeans <code>new File("f1.txt")</code> tính từ <strong>thư mục project</strong> (nơi có <code>build.xml</code>), vì vậy slide đặt tệp ở đó chứ không đặt trong <code>src</code>. Trong <code>[ ]</code> dấu chấm là dấu chấm thật, nên <code>[.]</code> tương đương <code>\\\\.</code>.</p>
<p><code>new Scanner(File)</code> có thể ném <code>FileNotFoundException</code>, một ngoại lệ <em>checked</em>: trình biên dịch bắt buộc <code>try/catch</code> (hoặc <code>throws</code>) — dòng cuối của lần chạy cho thấy nó khi tệp không tồn tại. Chương 6 giải thích ngoại lệ checked; Chương 9 đọc tệp bài bản.</p>`],
      [27, 'Splitting a string into substrings',
        `<p class="y-chinh">🎯 Split a string into substrings with the method <code>split(delimiters)</code> of <code>String</code> and with the class <code>java.util.StringTokenizer</code>: <code>str.split("[ ,.]+")</code> and <code>new StringTokenizer(str, "[ ,.]")</code> both give the 8 words of "I study hard. So, I pass the examination" (<code>countTokens()</code> = 8).</p>
<pre><code class="language-java">// release: 8
// Slide 27: the school's SplittingStringDemo — String.split (regex) vs StringTokenizer (a SET of characters) — plus the split traps
import java.util.Arrays;
import java.util.StringTokenizer;

public class TachChuoi {
    public static void main(String[] args) {
        String str = "I study hard. So, I pass the examination";
        // Using the method String[] split() of the String class
        String[] strs = str.split("[ ,.]+");
        for (String s : strs) System.out.println(s);
        System.out.println();
        // Using the java.util.StringTokenizer class
        StringTokenizer stk = new StringTokenizer(str, "[ ,.]");
        System.out.println("Number of substrings: " + stk.countTokens());
        while (stk.hasMoreTokens())
            System.out.println(stk.nextToken());
        System.out.println("-- split traps --");
        System.out.println("\\"a.b.c\\".split(\\".\\").length   = " + "a.b.c".split(".").length + "   (\\".\\" = any character in a regex)");
        System.out.println("\\"a.b.c\\".split(\\"\\\\\\\\.\\")        = " + Arrays.toString("a.b.c".split("\\\\.")));
        System.out.println("\\"a,,b\\".split(\\",\\")           = " + Arrays.toString("a,,b".split(",")) + "   (empty token kept)");
        System.out.println("\\",a,b,,\\".split(\\",\\")         = " + Arrays.toString(",a,b,,".split(",")) + "   (leading kept, trailing dropped)");
        System.out.println("\\"  two  spaces \\".trim().split(\\"\\\\\\\\s+\\") = " + Arrays.toString("  two  spaces ".trim().split("\\\\s+")));
        System.out.println("\\"  two\\".split(\\"\\\\\\\\s+\\")        = " + Arrays.toString("  two".split("\\\\s+")) + "   (forgot trim: empty first word)");
        System.out.println("\\"k=v=w\\".split(\\"=\\", 2)         = " + Arrays.toString("k=v=w".split("=", 2)));
    }
}</code></pre>
<div class="out">I<br>
study<br>
hard<br>
So<br>
I<br>
pass<br>
the<br>
examination<br>
<br>
Number of substrings: 8<br>
I<br>
study<br>
hard<br>
So<br>
I<br>
pass<br>
the<br>
examination<br>
-- split traps --<br>
"a.b.c".split(".").length &nbsp;&nbsp;= 0 &nbsp;&nbsp;("." = any character in a regex)<br>
"a.b.c".split("\\\\.") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= [a, b, c]<br>
"a,,b".split(",") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= [a, , b] &nbsp;&nbsp;(empty token kept)<br>
",a,b,,".split(",") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= [, a, b] &nbsp;&nbsp;(leading kept, trailing dropped)<br>
" &nbsp;two &nbsp;spaces ".trim().split("\\\\s+") = [two, spaces]<br>
" &nbsp;two".split("\\\\s+") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= [, two] &nbsp;&nbsp;(forgot trim: empty first word)<br>
"k=v=w".split("=", 2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= [k, v=w]</div>
<p>The two calls look alike but read their second argument differently: <code>split</code> takes a <strong>regex</strong> (<code>[ ,.]+</code> = one or more of space, comma, dot); <code>StringTokenizer</code> takes a <strong>set of single characters</strong>, each one a delimiter — so the slide's <code>"[ ,.]"</code> also makes <code>[</code> and <code>]</code> delimiters (harmless here) and the <code>+</code> is not needed because consecutive delimiters are always merged. <code>StringTokenizer</code> is a legacy class (its own documentation recommends <code>split</code>).</p>
<p>The split traps, all real: <code>split(".")</code> returns an empty array (dot = any character); trailing empty strings are dropped but leading ones are kept; forgetting <code>trim()</code> gives an empty first "word" — the classic off-by-one in "count the words" PE questions; <code>split(regex, 2)</code> cuts only at the first match.</p>
<div class="pitfall">PE pattern: <code>String[] words = str.trim().split("\\\\s+");</code> — the safest way to get the words of a sentence (PE papers define "word = a string without spaces").</div>`,
        `<p class="y-chinh">🎯 Tách chuỗi thành các chuỗi con bằng phương thức <code>split(dấuPhânCách)</code> của <code>String</code> và bằng lớp <code>java.util.StringTokenizer</code>: <code>str.split("[ ,.]+")</code> và <code>new StringTokenizer(str, "[ ,.]")</code> đều cho 8 từ của "I study hard. So, I pass the examination" (<code>countTokens()</code> = 8).</p>
<pre><code class="language-java">// release: 8
// Slide 27: SplittingStringDemo của trường — String.split (regex) và StringTokenizer (một TẬP ký tự) — cộng các bẫy của split
import java.util.Arrays;
import java.util.StringTokenizer;

public class TachChuoi {
    public static void main(String[] args) {
        String str = "I study hard. So, I pass the examination";
        // Dùng phương thức split() của lớp String
        String[] strs = str.split("[ ,.]+");
        for (String s : strs) System.out.println(s);
        System.out.println();
        // Dùng lớp java.util.StringTokenizer
        StringTokenizer stk = new StringTokenizer(str, "[ ,.]");
        System.out.println("Number of substrings: " + stk.countTokens());
        while (stk.hasMoreTokens())
            System.out.println(stk.nextToken());
        System.out.println("-- split traps --");
        System.out.println("\\"a.b.c\\".split(\\".\\").length   = " + "a.b.c".split(".").length + "   (\\".\\" = any character in a regex)");
        System.out.println("\\"a.b.c\\".split(\\"\\\\\\\\.\\")        = " + Arrays.toString("a.b.c".split("\\\\.")));
        System.out.println("\\"a,,b\\".split(\\",\\")           = " + Arrays.toString("a,,b".split(",")) + "   (empty token kept)");
        System.out.println("\\",a,b,,\\".split(\\",\\")         = " + Arrays.toString(",a,b,,".split(",")) + "   (leading kept, trailing dropped)");
        System.out.println("\\"  two  spaces \\".trim().split(\\"\\\\\\\\s+\\") = " + Arrays.toString("  two  spaces ".trim().split("\\\\s+")));
        System.out.println("\\"  two\\".split(\\"\\\\\\\\s+\\")        = " + Arrays.toString("  two".split("\\\\s+")) + "   (forgot trim: empty first word)");
        System.out.println("\\"k=v=w\\".split(\\"=\\", 2)         = " + Arrays.toString("k=v=w".split("=", 2)));
    }
}</code></pre>
<div class="out">I<br>
study<br>
hard<br>
So<br>
I<br>
pass<br>
the<br>
examination<br>
<br>
Number of substrings: 8<br>
I<br>
study<br>
hard<br>
So<br>
I<br>
pass<br>
the<br>
examination<br>
-- split traps --<br>
"a.b.c".split(".").length &nbsp;&nbsp;= 0 &nbsp;&nbsp;("." = any character in a regex)<br>
"a.b.c".split("\\\\.") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= [a, b, c]<br>
"a,,b".split(",") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= [a, , b] &nbsp;&nbsp;(empty token kept)<br>
",a,b,,".split(",") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= [, a, b] &nbsp;&nbsp;(leading kept, trailing dropped)<br>
" &nbsp;two &nbsp;spaces ".trim().split("\\\\s+") = [two, spaces]<br>
" &nbsp;two".split("\\\\s+") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= [, two] &nbsp;&nbsp;(forgot trim: empty first word)<br>
"k=v=w".split("=", 2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= [k, v=w]</div>
<p>Hai lời gọi trông giống nhau nhưng hiểu đối số thứ hai khác nhau: <code>split</code> nhận <strong>regex</strong> (<code>[ ,.]+</code> = một hoặc nhiều dấu cách, phẩy, chấm); <code>StringTokenizer</code> nhận <strong>một tập các ký tự đơn</strong>, mỗi ký tự là một dấu phân cách — nên <code>"[ ,.]"</code> trên slide còn biến cả <code>[</code> và <code>]</code> thành dấu phân cách (ở đây vô hại) và không cần <code>+</code> vì các dấu phân cách liền nhau luôn được gộp. <code>StringTokenizer</code> là lớp cũ (chính tài liệu của nó khuyên dùng <code>split</code>).</p>
<p>Các bẫy của split, đều chạy thật: <code>split(".")</code> trả về mảng rỗng (dấu chấm = ký tự bất kỳ); chuỗi rỗng ở cuối bị bỏ nhưng ở đầu thì giữ; quên <code>trim()</code> sẽ được một "từ" đầu tiên rỗng — lỗi lệch một kinh điển ở câu PE "đếm từ"; <code>split(regex, 2)</code> chỉ cắt ở chỗ khớp đầu tiên.</p>
<div class="pitfall">Mẫu PE: <code>String[] words = str.trim().split("\\\\s+");</code> — cách chắc nhất để lấy các từ của một câu (đề PE định nghĩa "word = chuỗi không chứa dấu cách").</div>`],
      [28, 'Formatting Output',
        `<p class="y-chinh">🎯 The format specifier <code>%[argument_index$][flags][width][.precision]conversion</code> (details in the API: <code>java.util.Formatter</code>, "syntax"); <code>PrintWithFormat</code> prints <code>Hello, 5,  3Ah, 7.20,     8.900,  A,true</code> and, with argument indexes <code>%3$3b,%1$3d,%2$12s</code>, <code>true,  5,       Hello</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 28: the school's PrintWithFormat — %[argument_index$][flags][width][.precision]conversion — and the flags you will need
public class DinhDangXuat {
    public static void main(String[] args) {
        String S = "Hello";
        int i = 5;
        long l = 58;
        float f = 7.2f;
        double d = 8.9;
        boolean b = true;
        char c = 'A';
        System.out.format("%s,%2d,%4Xh,%5.2f,%10.3f,%3c,%b\\n", S, i, l, f, d, c, b);
        System.out.format("%3$3b,%1$3d,%2$12s\\n", i, S, b);
        System.out.println(String.format("[%-8s] [%8s] [%08.2f] [%+d] [%,d]", "left", "right", 3.14159, 7, 1234567));
        System.out.println(String.format("[%.3s] [%e] [%x] [%o] [%%] [%c]", "Programming", 12345.678, 255, 8, 65));
        System.out.printf("%-6s|%5s|%8s%n", "ID", "Qty", "Price");
        System.out.printf("%-6s|%5d|%8.2f%n", "SE001", 3, 12.5);
        System.out.printf("%-6s|%5d|%8.2f%n", "SE002", 12, 1999.999);
        System.out.println("%.2f of 2.675 -&gt; " + String.format("%.2f", 2.675) + ",  %.1f of 0.25 -&gt; " + String.format("%.1f", 0.25)
            + ",  %.0f of 2.5 -&gt; " + String.format("%.0f", 2.5) + "   (format rounds HALF_UP)");
    }
}</code></pre>
<div class="out">Hello, 5, &nbsp;3Ah, 7.20, &nbsp;&nbsp;&nbsp;&nbsp;8.900, &nbsp;A,true<br>
true, &nbsp;5, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hello<br>
[left &nbsp;&nbsp;&nbsp;] [ &nbsp;&nbsp;right] [00003.14] [+7] [1,234,567]<br>
[Pro] [1.234568e+04] [ff] [10] [%] [A]<br>
ID &nbsp;&nbsp;&nbsp;| &nbsp;Qty| &nbsp;&nbsp;Price<br>
SE001 | &nbsp;&nbsp;&nbsp;3| &nbsp;&nbsp;12.50<br>
SE002 | &nbsp;&nbsp;12| 2000.00<br>
%.2f of 2.675 -&gt; 2.68, &nbsp;%.1f of 0.25 -&gt; 0.3, &nbsp;%.0f of 2.5 -&gt; 3 &nbsp;&nbsp;(format rounds HALF_UP)</div>
<p>Decode the slide's line piece by piece: <code>%s</code> String; <code>%2d</code> int in width 2; <code>%4X</code> hexadecimal upper-case in width 4 (58 = <code>3A</code>, the <code>h</code> is plain text); <code>%5.2f</code> 2 decimals in width 5; <code>%10.3f</code> 3 decimals in width 10; <code>%3c</code> a char; <code>%b</code> boolean. In <code>%3$3b</code>, <code>3$</code> means "the third argument", so the order of arguments no longer has to match the order of specifiers.</p>
<p>The flags you will need: <code>-</code> left-align (<code>%-8s</code>), <code>0</code> pad with zeros, <code>+</code> always show the sign, <code>,</code> group thousands; <code>%n</code> is a portable new line, <code>%%</code> prints a percent sign. <code>System.out.printf</code> = <code>System.out.format</code>; <code>String.format</code> returns the text instead of printing it — what a <code>toString()</code> needs. <code>%.2f</code> rounds half-up on the decimal text (2.675 → 2.68).</p>
<div class="pitfall">PE trap: the given <code>Main</code> compares your output character by character. <code>%.2f</code> vs <code>%.1f</code>, a missing space or a different Locale (a comma instead of a dot) fails the test — copy the format from the paper exactly.</div>`,
        `<p class="y-chinh">🎯 Đặc tả định dạng <code>%[argument_index$][flags][width][.precision]conversion</code> (chi tiết trong API: <code>java.util.Formatter</code>, mục "syntax"); <code>PrintWithFormat</code> in <code>Hello, 5,  3Ah, 7.20,     8.900,  A,true</code> và, với chỉ số đối số <code>%3$3b,%1$3d,%2$12s</code>, in <code>true,  5,       Hello</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 28: PrintWithFormat của trường — %[argument_index$][flags][width][.precision]conversion — và các cờ bạn sẽ cần
public class DinhDangXuat {
    public static void main(String[] args) {
        String S = "Hello";
        int i = 5;
        long l = 58;
        float f = 7.2f;
        double d = 8.9;
        boolean b = true;
        char c = 'A';
        System.out.format("%s,%2d,%4Xh,%5.2f,%10.3f,%3c,%b\\n", S, i, l, f, d, c, b);
        System.out.format("%3$3b,%1$3d,%2$12s\\n", i, S, b);
        System.out.println(String.format("[%-8s] [%8s] [%08.2f] [%+d] [%,d]", "left", "right", 3.14159, 7, 1234567));
        System.out.println(String.format("[%.3s] [%e] [%x] [%o] [%%] [%c]", "Programming", 12345.678, 255, 8, 65));
        System.out.printf("%-6s|%5s|%8s%n", "ID", "Qty", "Price");
        System.out.printf("%-6s|%5d|%8.2f%n", "SE001", 3, 12.5);
        System.out.printf("%-6s|%5d|%8.2f%n", "SE002", 12, 1999.999);
        System.out.println("%.2f of 2.675 -&gt; " + String.format("%.2f", 2.675) + ",  %.1f of 0.25 -&gt; " + String.format("%.1f", 0.25)
            + ",  %.0f of 2.5 -&gt; " + String.format("%.0f", 2.5) + "   (format rounds HALF_UP)");
    }
}</code></pre>
<div class="out">Hello, 5, &nbsp;3Ah, 7.20, &nbsp;&nbsp;&nbsp;&nbsp;8.900, &nbsp;A,true<br>
true, &nbsp;5, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hello<br>
[left &nbsp;&nbsp;&nbsp;] [ &nbsp;&nbsp;right] [00003.14] [+7] [1,234,567]<br>
[Pro] [1.234568e+04] [ff] [10] [%] [A]<br>
ID &nbsp;&nbsp;&nbsp;| &nbsp;Qty| &nbsp;&nbsp;Price<br>
SE001 | &nbsp;&nbsp;&nbsp;3| &nbsp;&nbsp;12.50<br>
SE002 | &nbsp;&nbsp;12| 2000.00<br>
%.2f of 2.675 -&gt; 2.68, &nbsp;%.1f of 0.25 -&gt; 0.3, &nbsp;%.0f of 2.5 -&gt; 3 &nbsp;&nbsp;(format rounds HALF_UP)</div>
<p>Giải mã dòng của slide từng mảnh: <code>%s</code> String; <code>%2d</code> số nguyên rộng 2; <code>%4X</code> hệ mười sáu chữ hoa rộng 4 (58 = <code>3A</code>, chữ <code>h</code> là chữ thường in ra); <code>%5.2f</code> 2 chữ số thập phân rộng 5; <code>%10.3f</code> 3 chữ số thập phân rộng 10; <code>%3c</code> một ký tự; <code>%b</code> boolean. Trong <code>%3$3b</code>, <code>3$</code> nghĩa là "đối số thứ ba", nên thứ tự đối số không cần trùng thứ tự đặc tả nữa.</p>
<p>Các cờ (flag) bạn sẽ cần: <code>-</code> căn trái (<code>%-8s</code>), <code>0</code> chèn số 0, <code>+</code> luôn hiện dấu, <code>,</code> nhóm hàng nghìn; <code>%n</code> là xuống dòng chạy trên mọi hệ điều hành, <code>%%</code> in dấu phần trăm. <code>System.out.printf</code> = <code>System.out.format</code>; <code>String.format</code> trả về chuỗi thay vì in — đúng thứ một <code>toString()</code> cần. <code>%.2f</code> làm tròn nửa lên trên phần chữ thập phân (2.675 → 2.68).</p>
<div class="pitfall">Bẫy PE: lớp <code>Main</code> đề cho so output của bạn từng ký tự. <code>%.2f</code> với <code>%.1f</code>, thiếu một dấu cách hay khác Locale (dấu phẩy thay cho dấu chấm) đều trượt test — chép định dạng từ đề cho thật chính xác.</div>`],
      [29, 'Formatting Output',
        `<p class="y-chinh">🎯 <code>DecimalFormatDemo</code>: <code>new DecimalFormat(pattern).format(value)</code> with <code>"###,###.###"</code> → <code>123,456.789</code>, <code>"###.##"</code> → <code>123456.79</code>, <code>"000000.000"</code> → <code>000123.780</code>, <code>"$###,###.###"</code> → <code>$12,345.67</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 29: the school's DecimalFormatDemo, then the two things the slide does not say — the locale and HALF_EVEN rounding
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class DecimalFormatDemo {
    static public String customFormat(String pattern, double value) {
        DecimalFormat myFormatter = new DecimalFormat(pattern);
        String output = myFormatter.format(value);
        return output;
    }

    static public void main(String[] args) {
        System.out.println(customFormat("###,###.###", 123456.789));
        System.out.println(customFormat("###.##", 123456.789));
        System.out.println(customFormat("000000.000", 123.78));
        System.out.println(customFormat("$###,###.###", 12345.67));
        DecimalFormat vn = new DecimalFormat("#,##0.###", new DecimalFormatSymbols(new Locale("vi", "VN")));
        DecimalFormat us = new DecimalFormat("#,##0.###", new DecimalFormatSymbols(Locale.US));
        System.out.println("vi-VN: " + vn.format(123456.789) + "   en-US: " + us.format(123456.789));
        DecimalFormat mot = new DecimalFormat("0", new DecimalFormatSymbols(Locale.US));
        System.out.println("pattern \\"0\\": 0.5 -&gt; " + mot.format(0.5) + ", 1.5 -&gt; " + mot.format(1.5) + ", 2.5 -&gt; " + mot.format(2.5)
            + ", 3.5 -&gt; " + mot.format(3.5) + "   (HALF_EVEN)");
        System.out.println("Math.round: 0.5 -&gt; " + Math.round(0.5) + ", 1.5 -&gt; " + Math.round(1.5) + ", 2.5 -&gt; " + Math.round(2.5)
            + ", 3.5 -&gt; " + Math.round(3.5) + "   (HALF_UP)");
        DecimalFormat phanTram = new DecimalFormat("#0.0%", new DecimalFormatSymbols(Locale.US));
        System.out.println("percent: " + phanTram.format(0.8567));
    }
}</code></pre>
<div class="out">123,456.789<br>
123456.79<br>
000123.780<br>
$12,345.67<br>
vi-VN: 123.456,789 &nbsp;&nbsp;en-US: 123,456.789<br>
pattern "0": 0.5 -&gt; 0, 1.5 -&gt; 2, 2.5 -&gt; 2, 3.5 -&gt; 4 &nbsp;&nbsp;(HALF_EVEN)<br>
Math.round: 0.5 -&gt; 1, 1.5 -&gt; 2, 2.5 -&gt; 3, 3.5 -&gt; 4 &nbsp;&nbsp;(HALF_UP)<br>
percent: 85.7%</div>
<p>The four lines match the slide. Pattern symbols: <code>0</code> a digit that is always shown (pads with zeros), <code>#</code> a digit shown only if needed, <code>,</code> the grouping separator, <code>.</code> the decimal separator, <code>%</code> multiply by 100 and show a percent sign; other characters such as <code>$</code> are printed as they are.</p>
<p>➕ What the slide does not say, and the run proves: (1) the separators follow the <strong>Locale</strong> — on a Windows set to Vietnamese the same pattern prints <code>123.456,789</code>; pass <code>new DecimalFormatSymbols(Locale.US)</code> when the output must be exact (this site's programs run with Locale en-US); (2) <code>DecimalFormat</code> rounds <strong>HALF_EVEN</strong> ("banker's rounding": 0.5 → 0, 2.5 → 2), while <code>Math.round</code> and <code>%.0f</code> round half up (2.5 → 3).</p>
<div class="pitfall">PE trap: if the paper's sample shows <code>12.50</code>, use <code>String.format("%.2f", x)</code>; DecimalFormat's rounding and Locale can give a different last digit or separator.</div>`,
        `<p class="y-chinh">🎯 <code>DecimalFormatDemo</code>: <code>new DecimalFormat(mẫu).format(giáTrị)</code> với <code>"###,###.###"</code> → <code>123,456.789</code>, <code>"###.##"</code> → <code>123456.79</code>, <code>"000000.000"</code> → <code>000123.780</code>, <code>"$###,###.###"</code> → <code>$12,345.67</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 29: DecimalFormatDemo của trường, rồi hai điều slide không nói — locale và cách làm tròn HALF_EVEN
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class DecimalFormatDemo {
    static public String customFormat(String pattern, double value) {
        DecimalFormat myFormatter = new DecimalFormat(pattern);
        String output = myFormatter.format(value);
        return output;
    }

    static public void main(String[] args) {
        System.out.println(customFormat("###,###.###", 123456.789));
        System.out.println(customFormat("###.##", 123456.789));
        System.out.println(customFormat("000000.000", 123.78));
        System.out.println(customFormat("$###,###.###", 12345.67));
        DecimalFormat vn = new DecimalFormat("#,##0.###", new DecimalFormatSymbols(new Locale("vi", "VN")));
        DecimalFormat us = new DecimalFormat("#,##0.###", new DecimalFormatSymbols(Locale.US));
        System.out.println("vi-VN: " + vn.format(123456.789) + "   en-US: " + us.format(123456.789));
        DecimalFormat mot = new DecimalFormat("0", new DecimalFormatSymbols(Locale.US));
        System.out.println("pattern \\"0\\": 0.5 -&gt; " + mot.format(0.5) + ", 1.5 -&gt; " + mot.format(1.5) + ", 2.5 -&gt; " + mot.format(2.5)
            + ", 3.5 -&gt; " + mot.format(3.5) + "   (HALF_EVEN)");
        System.out.println("Math.round: 0.5 -&gt; " + Math.round(0.5) + ", 1.5 -&gt; " + Math.round(1.5) + ", 2.5 -&gt; " + Math.round(2.5)
            + ", 3.5 -&gt; " + Math.round(3.5) + "   (HALF_UP)");
        DecimalFormat phanTram = new DecimalFormat("#0.0%", new DecimalFormatSymbols(Locale.US));
        System.out.println("percent: " + phanTram.format(0.8567));
    }
}</code></pre>
<div class="out">123,456.789<br>
123456.79<br>
000123.780<br>
$12,345.67<br>
vi-VN: 123.456,789 &nbsp;&nbsp;en-US: 123,456.789<br>
pattern "0": 0.5 -&gt; 0, 1.5 -&gt; 2, 2.5 -&gt; 2, 3.5 -&gt; 4 &nbsp;&nbsp;(HALF_EVEN)<br>
Math.round: 0.5 -&gt; 1, 1.5 -&gt; 2, 2.5 -&gt; 3, 3.5 -&gt; 4 &nbsp;&nbsp;(HALF_UP)<br>
percent: 85.7%</div>
<p>Bốn dòng trùng slide. Ký hiệu mẫu: <code>0</code> chữ số luôn hiện (chèn số 0), <code>#</code> chữ số chỉ hiện khi cần, <code>,</code> dấu nhóm hàng nghìn, <code>.</code> dấu thập phân, <code>%</code> nhân 100 và hiện dấu phần trăm; ký tự khác như <code>$</code> được in nguyên.</p>
<p>➕ Điều slide không nói, và lần chạy chứng minh: (1) các dấu phân cách theo <strong>Locale</strong> — trên máy Windows đặt tiếng Việt cùng mẫu đó in <code>123.456,789</code>; hãy truyền <code>new DecimalFormatSymbols(Locale.US)</code> khi output phải chính xác (các chương trình của web chạy với Locale en-US); (2) <code>DecimalFormat</code> làm tròn <strong>HALF_EVEN</strong> ("làm tròn kiểu ngân hàng": 0.5 → 0, 2.5 → 2), còn <code>Math.round</code> và <code>%.0f</code> làm tròn nửa lên (2.5 → 3).</p>
<div class="pitfall">Bẫy PE: nếu mẫu output của đề hiện <code>12.50</code>, dùng <code>String.format("%.2f", x)</code>; cách làm tròn và Locale của DecimalFormat có thể cho chữ số cuối hoặc dấu phân cách khác.</div>`],
      [30, 'Summary',
        `<p class="y-chinh">🎯 Working with numbers (wrapper classes Number and Character, <code>java.lang.Math</code>, autoboxing and unboxing — Math is listed twice on the slide) and the String class (create and manipulate strings, compare String and StringBuilder), scanning text and formatting output.</p>
<table>
<thead><tr><th>You should now be able to</th><th>Check</th></tr></thead>
<tbody>
<tr><td>explain why <code>==</code> on two Strings or two Integers can be true or false with equal values</td><td>slides 16 (1.F), 12 (1.E)</td></tr>
<tr><td>keep a String change by assigning the result; build text in a loop with StringBuilder</td><td>slides 15, 21–22</td></tr>
<tr><td>predict <code>substring</code>, <code>indexOf</code>, <code>compareTo</code>, <code>split</code> results, including the traps</td><td>slides 17–18, 27</td></tr>
<tr><td>read tokens from a String or a file with Scanner and a regex delimiter</td><td>slides 24–26</td></tr>
<tr><td>print exact output with <code>format</code> / <code>String.format</code> and know when DecimalFormat differs</td><td>slides 28–29</td></tr>
</tbody>
</table>
<p>Next: deck <em>Support Classes</em> (lesson 1.G) — the static algorithms of <code>Collections</code> and <code>Arrays</code>, and sorting with <code>Comparable</code> and <code>Comparator</code>.</p>`,
        `<p class="y-chinh">🎯 Làm việc với số (lớp bao Number và Character, <code>java.lang.Math</code>, tự đóng hộp và mở hộp — slide ghi Math hai lần) và lớp String (tạo và xử lý chuỗi, so sánh String với StringBuilder), quét văn bản và định dạng xuất.</p>
<table>
<thead><tr><th>Giờ bạn phải làm được</th><th>Xem lại</th></tr></thead>
<tbody>
<tr><td>giải thích vì sao <code>==</code> trên hai String hay hai Integer có thể đúng hoặc sai dù giá trị bằng nhau</td><td>slide 16 (1.F), 12 (1.E)</td></tr>
<tr><td>giữ thay đổi của String bằng cách gán kết quả; dựng văn bản trong vòng lặp bằng StringBuilder</td><td>slide 15, 21–22</td></tr>
<tr><td>đoán đúng kết quả <code>substring</code>, <code>indexOf</code>, <code>compareTo</code>, <code>split</code>, kể cả các bẫy</td><td>slide 17–18, 27</td></tr>
<tr><td>đọc token từ String hay tệp bằng Scanner với dấu phân cách regex</td><td>slide 24–26</td></tr>
<tr><td>in output chính xác bằng <code>format</code> / <code>String.format</code> và biết khi nào DecimalFormat khác</td><td>slide 28–29</td></tr>
</tbody>
</table>
<p>Tiếp theo: deck <em>Support Classes</em> (bài 1.G) — các thuật toán static của <code>Collections</code> và <code>Arrays</code>, và sắp xếp bằng <code>Comparable</code> và <code>Comparator</code>.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>Why is <code>"Hel" + "lo" == "Hello"</code> true but <code>sc.nextLine() == "Hello"</code> false when the user types Hello?</li>
<li>What does <code>"  a  b ".split(" ").length</code> return, and how do you get exactly the two words?</li>
<li>Write the <code>printf</code> that prints a name left-aligned in 10 columns and a price with 2 decimals right-aligned in 8.</li>
</ul>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Vì sao <code>"Hel" + "lo" == "Hello"</code> đúng mà <code>sc.nextLine() == "Hello"</code> lại sai khi người dùng gõ Hello?</li>
<li><code>"  a  b ".split(" ").length</code> trả về bao nhiêu, và làm sao lấy đúng hai từ?</li>
<li>Viết lệnh <code>printf</code> in tên căn trái trong 10 cột và giá có 2 chữ số thập phân căn phải trong 8 cột.</li>
</ul>`),
    books([
      ['horstmann1', 'Ch. 3.6 "Strings" (3.6.1–3.6.9: substrings, concatenation, immutability, equality, building strings) and 3.7 "Input and Output" (Scanner, formatting output)', 'Mục 3.6 "Strings" (3.6.1–3.6.9: chuỗi con, nối, bất biến, so sánh bằng, dựng chuỗi) và 3.7 "Input and Output" (Scanner, định dạng xuất)'],
      ['javaTutorial', 'trail "Learning the Java Language" — lesson "Numbers and Strings": Strings, The StringBuilder Class; trail "Basic I/O" — Scanning, Formatting', 'trail "Learning the Java Language" — bài "Numbers and Strings": Strings, The StringBuilder Class; trail "Basic I/O" — Scanning, Formatting'],
      ['apiDocs', 'String, StringBuilder, StringBuffer, java.util.Scanner, java.util.Formatter (format syntax), java.text.DecimalFormat, java.util.regex.Pattern', 'String, StringBuilder, StringBuffer, java.util.Scanner, java.util.Formatter (cú pháp định dạng), java.text.DecimalFormat, java.util.regex.Pattern'],
    ]),
  ].join('\n'),
};

/* ───────── 1.G — 📑 Slide by slide · Support Classes: Collections, Comparator, Arrays (slides 1–18) ───────── */
const L_pro6_1 = {
  title: '1.G — 📑 Slide by slide · Support Classes: Collections, Comparator, Arrays (slides 1–18)|||1.G — 📑 Học theo từng slide · Support Classes: Collections, Comparator, Arrays (slide 1–18)',
  slug: 'pro192-slide-pro6-1',
  type: 'VIDEO',
  description: 'Giảng đủ 18 slide bộ "Support Classes": lớp tiện ích Collections và Arrays vẽ bằng UML, CollectionsDemo viết lại có generics và hạt giống cố định (vẫn ra "Position of 8: 4" như slide), sắp xếp chuỗi theo mã ký tự, Arrays.asList là khung nhìn cố định kích thước, Employee với Comparable (theo ID) và Comparator ẩn danh (lương giảm rồi ID tăng) cùng bản lambda Java 8, bẫy comparator bằng phép trừ bị tràn số, reverse/fill/copy/swap/addAll, binarySearch trả -(vị trí chèn)-1, frequency/disjoint/min/max, ArraysDemo y như slide — mọi code chạy thật trên JDK 8.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.G · school deck "Support Classes", slides 1–18</span>
<h2>Do not write a sort in the exam: two classes already did it for you</h2>
<p class="lead">In PRF192 you wrote bubble sort and linear search by hand. In Java, <code>java.util.Collections</code> (for lists) and <code>java.util.Arrays</code> (for arrays) provide tested, fast versions of sort, search, min/max, reverse, shuffle and more — all <code>static</code>. The one thing they cannot guess is <em>how to compare your objects</em>; that is the job of <code>Comparable</code> and <code>Comparator</code>, the most useful idea of this deck and the key to every "sort the list by … then by …" question in PE and LAB211.</p>
<div class="callout"><strong>About the code.</strong> The slides use raw types (<code>ArrayList</code>, <code>Comparator</code> without <code>&lt;…&gt;</code>), which compile on JDK 8 with warnings and need casts. Every program here uses generics (Java 5+) and was compiled with <code>--release 8</code> and run on a real JDK 8 — so it is safe for the exam.</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.G · bộ slide "Support Classes" của trường, slide 1–18</span>
<h2>Đừng tự viết hàm sắp xếp trong giờ thi: có hai lớp đã làm sẵn cho bạn</h2>
<p class="lead">Ở PRF192 bạn tự viết sắp xếp nổi bọt và tìm kiếm tuần tự. Trong Java, <code>java.util.Collections</code> (cho danh sách) và <code>java.util.Arrays</code> (cho mảng) cung cấp sẵn các bản đã kiểm thử, chạy nhanh của sort, tìm kiếm, min/max, đảo, xáo trộn và hơn nữa — tất cả đều <code>static</code>. Điều duy nhất chúng không đoán được là <em>so sánh đối tượng của bạn thế nào</em>; đó là việc của <code>Comparable</code> và <code>Comparator</code>, ý tưởng hữu ích nhất của bộ slide và là chìa khoá cho mọi câu "sắp xếp danh sách theo … rồi theo …" ở PE và LAB211.</p>
<div class="callout"><strong>Về code.</strong> Slide dùng kiểu thô (<code>ArrayList</code>, <code>Comparator</code> không có <code>&lt;…&gt;</code>), biên dịch được trên JDK 8 nhưng có cảnh báo và cần ép kiểu. Mọi chương trình ở đây dùng generics (Java 5+), được biên dịch với <code>--release 8</code> và chạy trên JDK 8 thật — dùng được ở phòng thi.</div>`),
    walkHead('pro6', 1, 18),
    walk('pro6', [
      [1, 'Support Classes',
        `<p class="y-chinh">🎯 Title slide: "Support Classes" — the classes that support work on collections and arrays: <code>Collections</code> and <code>Arrays</code>.</p>
<p>The deck follows the "Algorithms" lesson of Oracle's Collections trail. You meet <code>ArrayList</code> here before Chapter 8 explains it properly; for now read <code>ArrayList&lt;Integer&gt;</code> as "a resizable array of Integers" with <code>add</code>, <code>get(i)</code>, <code>size()</code> and <code>remove</code>.</p>
<p class="meo">🧠 Note the "s": <code>Collection</code> (no s) is an interface — a group of objects; <code>Collections</code> (with s) is the helper class full of static methods. Same pattern: <code>Array</code> (reflection, rarely used) vs <code>Arrays</code>.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề: "Support Classes" (lớp hỗ trợ) — các lớp hỗ trợ làm việc với collection và mảng: <code>Collections</code> và <code>Arrays</code>.</p>
<p>Bộ slide đi theo bài "Algorithms" trong trail Collections của Oracle. Bạn gặp <code>ArrayList</code> ở đây trước khi Chương 8 giảng kỹ; tạm hiểu <code>ArrayList&lt;Integer&gt;</code> là "mảng Integer tự co giãn" với <code>add</code>, <code>get(i)</code>, <code>size()</code> và <code>remove</code>.</p>
<p class="meo">🧠 Để ý chữ "s": <code>Collection</code> (không s) là một interface — một nhóm đối tượng; <code>Collections</code> (có s) là lớp hỗ trợ đầy phương thức static. Cùng kiểu đó: <code>Array</code> (dùng cho reflection, hiếm gặp) và <code>Arrays</code>.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Use the <code>Collections</code> class — sorting and shuffling, routine data manipulation (copy, reverse, swap, addAll…), searching (<code>binarySearch</code>), composition (<code>frequency</code>, <code>disjoint</code>), finding extreme values (min, max, with a comparator) — and use the <code>Arrays</code> class.</p>
<table>
<thead><tr><th>Objective</th><th>Slides</th><th>Program</th></tr></thead>
<tbody>
<tr><td>The two support classes</td><td>3–4, 16</td><td>UML diagram</td></tr>
<tr><td>Collections demo (disjoint, addAll, min/max, frequency, sort, binarySearch, shuffle)</td><td>5–6</td><td><code>CollectionsDemo</code></td></tr>
<tr><td>Sorting, Comparable and Comparator</td><td>7–11</td><td><code>SapXepDanhSach</code>, <code>SortDemo</code></td></tr>
<tr><td>Routine manipulation</td><td>12</td><td><code>ThaoTacDanhSach</code></td></tr>
<tr><td>Searching, composition, extremes</td><td>13–15</td><td><code>TimKiem</code></td></tr>
<tr><td>Arrays</td><td>16–17</td><td><code>ArraysDemo</code></td></tr>
</tbody>
</table>
<p>PE link: the "list" question (often Q3, with an interface like <code>f1(List)</code>, <code>f2(List)</code>) asks you to sort, find min/max, count or remove — this deck gives you one-line tools for most of it.</p>`,
        `<p class="y-chinh">🎯 Dùng lớp <code>Collections</code> — sắp xếp và xáo trộn, thao tác dữ liệu thường ngày (copy, reverse, swap, addAll…), tìm kiếm (<code>binarySearch</code>), kết hợp (<code>frequency</code>, <code>disjoint</code>), tìm giá trị cực trị (min, max, kèm comparator) — và dùng lớp <code>Arrays</code>.</p>
<table>
<thead><tr><th>Mục tiêu</th><th>Slide</th><th>Chương trình</th></tr></thead>
<tbody>
<tr><td>Hai lớp hỗ trợ</td><td>3–4, 16</td><td>sơ đồ UML</td></tr>
<tr><td>Demo Collections (disjoint, addAll, min/max, frequency, sort, binarySearch, shuffle)</td><td>5–6</td><td><code>CollectionsDemo</code></td></tr>
<tr><td>Sắp xếp, Comparable và Comparator</td><td>7–11</td><td><code>SapXepDanhSach</code>, <code>SortDemo</code></td></tr>
<tr><td>Thao tác thường ngày</td><td>12</td><td><code>ThaoTacDanhSach</code></td></tr>
<tr><td>Tìm kiếm, kết hợp, cực trị</td><td>13–15</td><td><code>TimKiem</code></td></tr>
<tr><td>Arrays</td><td>16–17</td><td><code>ArraysDemo</code></td></tr>
</tbody>
</table>
<p>Liên hệ PE: câu "danh sách" (thường là câu 3, với interface kiểu <code>f1(List)</code>, <code>f2(List)</code>) bắt bạn sắp xếp, tìm min/max, đếm hoặc xoá — bộ slide này cho bạn công cụ một dòng cho phần lớn việc đó.</p>`],
      [3, 'Introduction',
        `<p class="y-chinh">🎯 An algorithm on a list can be applied to lists whose element types differ; these <strong>polymorphic algorithms</strong> are reusable pieces of functionality provided by the Java platform; all come from the <code>Collections</code> and <code>Arrays</code> classes (support classes, both direct subclasses of <code>Object</code>) and take the form of static methods whose first argument is the collection to work on.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/bf9fb8e7d89186d50171f8ee40d6ef3f953c3d17.svg" alt="Slides 3, 4 and 16 in UML: two utility classes of static methods, and the interfaces they work with" loading="lazy" /><p class="chu-thich">🧩 Slides 3, 4 and 16 in UML: two utility classes of static methods, and the interfaces they work with</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 3–4, 16 — the two support classes: static algorithms over lists and arrays
' Nobody creates a Collections or Arrays object: every method is static
class Collections &lt;&lt;utility&gt;&gt; {
  + {static} sort(list) / sort(list, c)
  + {static} reverse(list) · shuffle(list)
  + {static} swap(list, i, j) · fill(list, x)
  + {static} copy(dest, src) · addAll(c, x...)
  + {static} binarySearch(list, key) : int
  + {static} frequency(c, x) : int
  + {static} disjoint(c1, c2) : boolean
  + {static} min(c) · max(c) · max(c, comp)
}
class Arrays &lt;&lt;utility&gt;&gt; {
  + {static} toString(a) · deepToString(a)
  + {static} sort(a) · sort(a, from, to) · sort(T[], c)
  + {static} binarySearch(a, key) : int
  + {static} equals(a, b) : boolean
  + {static} copyOf(a, n) · copyOfRange(a, i, j)
  + {static} fill(a, x) · asList(x...) : List
}
interface "List&lt;E&gt;" as List
interface "Comparator&lt;T&gt;" as Comparator {
  + compare(a : T, b : T) : int
}
interface "Comparable&lt;T&gt;" as Comparable {
  + compareTo(o : T) : int
}
Collections ..&gt; List : works on
Collections ..&gt; Comparator : optional order
Collections ..&gt; Comparable : natural order
Arrays ..&gt; Comparator : optional order (objects only)
Arrays ..&gt; List : asList() gives a fixed-size view
@enduml</code></pre></details>
<p>"Polymorphic" here means: one <code>Collections.sort</code> sorts a list of Integers, of Strings or of your own Employees — the method does not care about the element type as long as it knows how to <strong>compare</strong> two elements (slides 8–11). That is the same idea Chapter 4 calls polymorphism, met early.</p>
<p>"Static methods whose first argument is the collection": you write <code>Collections.sort(list)</code>, not <code>list.sort()</code> (Java 8 did add <code>List.sort(comparator)</code>, shown on slide 11). Nobody ever creates a <code>new Collections()</code> — its constructor is private.</p>`,
        `<p class="y-chinh">🎯 Một thuật toán trên danh sách áp dụng được cho các danh sách có kiểu phần tử khác nhau; các <strong>thuật toán đa hình (polymorphic algorithms)</strong> này là những mảnh chức năng dùng lại được do nền tảng Java cung cấp; tất cả đến từ lớp <code>Collections</code> và <code>Arrays</code> (lớp hỗ trợ, đều là lớp con trực tiếp của <code>Object</code>) và đều ở dạng phương thức static có đối số đầu tiên là collection cần xử lý.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/bf9fb8e7d89186d50171f8ee40d6ef3f953c3d17.svg" alt="Slide 3, 4 và 16 bằng UML: hai lớp tiện ích chứa phương thức static, và các interface chúng làm việc cùng" loading="lazy" /><p class="chu-thich">🧩 Slide 3, 4 và 16 bằng UML: hai lớp tiện ích chứa phương thức static, và các interface chúng làm việc cùng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 3–4, 16 — the two support classes: static algorithms over lists and arrays
' Không ai tạo đối tượng Collections hay Arrays: mọi phương thức đều static
class Collections &lt;&lt;utility&gt;&gt; {
  + {static} sort(list) / sort(list, c)
  + {static} reverse(list) · shuffle(list)
  + {static} swap(list, i, j) · fill(list, x)
  + {static} copy(dest, src) · addAll(c, x...)
  + {static} binarySearch(list, key) : int
  + {static} frequency(c, x) : int
  + {static} disjoint(c1, c2) : boolean
  + {static} min(c) · max(c) · max(c, comp)
}
class Arrays &lt;&lt;utility&gt;&gt; {
  + {static} toString(a) · deepToString(a)
  + {static} sort(a) · sort(a, from, to) · sort(T[], c)
  + {static} binarySearch(a, key) : int
  + {static} equals(a, b) : boolean
  + {static} copyOf(a, n) · copyOfRange(a, i, j)
  + {static} fill(a, x) · asList(x...) : List
}
interface "List&lt;E&gt;" as List
interface "Comparator&lt;T&gt;" as Comparator {
  + compare(a : T, b : T) : int
}
interface "Comparable&lt;T&gt;" as Comparable {
  + compareTo(o : T) : int
}
Collections ..&gt; List : works on
Collections ..&gt; Comparator : optional order
Collections ..&gt; Comparable : natural order
Arrays ..&gt; Comparator : optional order (objects only)
Arrays ..&gt; List : asList() gives a fixed-size view
@enduml</code></pre></details>
<p>"Đa hình" ở đây nghĩa là: một hàm <code>Collections.sort</code> sắp được danh sách Integer, String hay Employee của bạn — phương thức không quan tâm kiểu phần tử, miễn là nó biết cách <strong>so sánh</strong> hai phần tử (slide 8–11). Đó chính là ý tưởng mà Chương 4 gọi là đa hình, gặp sớm.</p>
<p>"Phương thức static có đối số đầu là collection": bạn viết <code>Collections.sort(list)</code>, không viết <code>list.sort()</code> (Java 8 có thêm <code>List.sort(comparator)</code>, xem slide 11). Không ai tạo <code>new Collections()</code> — constructor của nó là private.</p>`],
      [4, 'The Collections class',
        `<p class="y-chinh">🎯 <code>Collections</code> is a support class containing static methods that accept collections as their parameters; the slide links to its API page.</p>
<p>⚠️ The link is <code>file:///J:/Softs/JavaSofts/JavaDocs/docs-Java8/api/java/util/Collections.html</code> — a path on drive J: of the lecturer's computer. It opens nothing on yours. Use <strong>docs.oracle.com/javase/8/docs/api/java/util/Collections.html</strong>, or the same page inside the JDK 8 documentation you downloaded (deck pro5, slide 1).</p>
<p>How to read that API page fast: the "Method Summary" table lists every method with its return type; a signature like <code>static &lt;T&gt; void sort(List&lt;T&gt; list, Comparator&lt;? super T&gt; c)</code> reads "for any element type T, sort a List of T using a Comparator able to compare T's". The generic parts (<code>&lt;T&gt;</code>, <code>? super T</code>) are explained in Chapter 8; you can use the methods without them.</p>
<p class="meo">🧠 In NetBeans, type <code>Collections.</code> and wait: the code-completion popup lists all methods with their Javadoc — the offline API is built in.</p>`,
        `<p class="y-chinh">🎯 <code>Collections</code> là lớp hỗ trợ chứa các phương thức static nhận collection làm tham số; slide dẫn link tới trang API của nó.</p>
<p>⚠️ Link là <code>file:///J:/Softs/JavaSofts/JavaDocs/docs-Java8/api/java/util/Collections.html</code> — một đường dẫn trên ổ J: của máy giảng viên. Trên máy bạn nó không mở được gì. Hãy dùng <strong>docs.oracle.com/javase/8/docs/api/java/util/Collections.html</strong>, hoặc chính trang đó trong bộ tài liệu JDK 8 bạn đã tải (deck pro5, slide 1).</p>
<p>Cách đọc nhanh trang API đó: bảng "Method Summary" liệt kê mọi phương thức kèm kiểu trả về; chữ ký như <code>static &lt;T&gt; void sort(List&lt;T&gt; list, Comparator&lt;? super T&gt; c)</code> đọc là "với mọi kiểu phần tử T, sắp một List các T bằng một Comparator so sánh được các T". Phần generic (<code>&lt;T&gt;</code>, <code>? super T</code>) được giải thích ở Chương 8; bạn dùng được phương thức mà chưa cần hiểu chúng.</p>
<p class="meo">🧠 Trong NetBeans, gõ <code>Collections.</code> rồi đợi: cửa sổ gợi ý code liệt kê mọi phương thức kèm Javadoc — API ngoại tuyến có sẵn trong IDE.</p>`],
      [5, 'Collections Demo.',
        `<p class="y-chinh">🎯 <code>CollectionsDemo</code>, part 1: an <code>ArrayList</code> and a <code>Vector</code> are each filled with 10 random numbers 0..29 (<code>rd.nextInt(30)</code>, "MAXIMUM VALUE = 29"), printed, tested with <code>Collections.disjoint</code>, joined with <code>Collections.addAll(v, ar.toArray())</code>, then <code>Collections.min</code> and <code>max</code> are taken.</p>
<pre><code class="language-java">// release: 8
// Slides 5–6: the school's CollectionsDemo with generics and a FIXED random seed, so the output is the same on every run
import java.util.ArrayList;
import java.util.Collections;
import java.util.Random;
import java.util.Vector;

public class CollectionsDemo {
    public static void main(String[] args) {
        ArrayList&lt;Integer&gt; ar = new ArrayList&lt;Integer&gt;();
        Vector&lt;Integer&gt; v = new Vector&lt;Integer&gt;();
        Random rd = new Random(14);            // the slide uses new Random(): different numbers every run
        for (int i = 1; i &lt;= 10; i++) {
            ar.add(rd.nextInt(30));             // 0..29 — MAXIMUM VALUE = 29
            v.add(rd.nextInt(30));
        }
        System.out.println("ar=" + ar);
        System.out.println("v=" + v);
        boolean dis = Collections.disjoint(ar, v);
        System.out.println("ar and v are disjunct: " + dis);
        Collections.addAll(v, ar.toArray(new Integer[0]));
        System.out.println("After adding, v=" + v);
        int minVal = Collections.min(v);        // no (int) cast needed with generics
        int maxVal = Collections.max(v);
        System.out.println("min= " + minVal + ", max= " + maxVal);
        int fre = Collections.frequency(v, 8);
        System.out.println("Occurences of 8: " + fre);
        Collections.sort(v);
        System.out.println("After sorting, v=" + v);
        int pos = Collections.binarySearch(v, 8);
        System.out.println("Position of 8: " + pos);
        Collections.shuffle(v, new Random(2026));
        System.out.println("After shuffling, v=" + v);
    }
}</code></pre>
<div class="out">ar=[5, 17, 8, 26, 25, 27, 22, 12, 9, 24]<br>
v=[24, 11, 8, 23, 27, 11, 8, 6, 4, 25]<br>
ar and v are disjunct: false<br>
After adding, v=[24, 11, 8, 23, 27, 11, 8, 6, 4, 25, 5, 17, 8, 26, 25, 27, 22, 12, 9, 24]<br>
min= 4, max= 27<br>
Occurences of 8: 3<br>
After sorting, v=[4, 5, 6, 8, 8, 8, 9, 11, 11, 12, 17, 22, 23, 24, 24, 25, 25, 26, 27, 27]<br>
Position of 8: 4<br>
After shuffling, v=[11, 6, 25, 8, 8, 4, 22, 9, 11, 12, 24, 27, 26, 8, 24, 23, 25, 5, 17, 27]</div>
<p>Two changes from the slide, both on purpose: (1) <strong>generics</strong> — <code>ArrayList&lt;Integer&gt;</code> instead of a raw <code>ArrayList</code>, so <code>Collections.min(v)</code> already returns an Integer and the slide's <code>(int)</code> casts disappear; (2) <strong><code>new Random(14)</code></strong> instead of <code>new Random()</code>. Without a seed every run prints different numbers (the slide's run shows one possible result); with a fixed seed the "random" sequence is the same each time — what you want in tests. Seed 14 was chosen because it gives data like the slide's: 8 appears three times, so slide 6's <code>Position of 8: 4</code> comes out identical.</p>
<p><code>Vector</code> is the old (Java 1.0), synchronized ancestor of ArrayList — like StringBuffer vs StringBuilder; use ArrayList. <code>nextInt(30)</code> returns 0..29: the bound is <strong>excluded</strong>.</p>`,
        `<p class="y-chinh">🎯 <code>CollectionsDemo</code>, phần 1: một <code>ArrayList</code> và một <code>Vector</code> mỗi cái được nạp 10 số ngẫu nhiên 0..29 (<code>rd.nextInt(30)</code>, "MAXIMUM VALUE = 29"), được in ra, thử bằng <code>Collections.disjoint</code>, gộp bằng <code>Collections.addAll(v, ar.toArray())</code>, rồi lấy <code>Collections.min</code> và <code>max</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 5–6: CollectionsDemo của trường, dùng generics và hạt giống ngẫu nhiên CỐ ĐỊNH để output lần nào cũng như nhau
import java.util.ArrayList;
import java.util.Collections;
import java.util.Random;
import java.util.Vector;

public class CollectionsDemo {
    public static void main(String[] args) {
        ArrayList&lt;Integer&gt; ar = new ArrayList&lt;Integer&gt;();
        Vector&lt;Integer&gt; v = new Vector&lt;Integer&gt;();
        Random rd = new Random(14);            // slide dùng new Random(): mỗi lần chạy một khác
        for (int i = 1; i &lt;= 10; i++) {
            ar.add(rd.nextInt(30));             // 0..29 — GIÁ TRỊ LỚN NHẤT = 29
            v.add(rd.nextInt(30));
        }
        System.out.println("ar=" + ar);
        System.out.println("v=" + v);
        boolean dis = Collections.disjoint(ar, v);
        System.out.println("ar and v are disjunct: " + dis);
        Collections.addAll(v, ar.toArray(new Integer[0]));
        System.out.println("After adding, v=" + v);
        int minVal = Collections.min(v);        // có generics thì không cần ép (int)
        int maxVal = Collections.max(v);
        System.out.println("min= " + minVal + ", max= " + maxVal);
        int fre = Collections.frequency(v, 8);
        System.out.println("Occurences of 8: " + fre);
        Collections.sort(v);
        System.out.println("After sorting, v=" + v);
        int pos = Collections.binarySearch(v, 8);
        System.out.println("Position of 8: " + pos);
        Collections.shuffle(v, new Random(2026));
        System.out.println("After shuffling, v=" + v);
    }
}</code></pre>
<div class="out">ar=[5, 17, 8, 26, 25, 27, 22, 12, 9, 24]<br>
v=[24, 11, 8, 23, 27, 11, 8, 6, 4, 25]<br>
ar and v are disjunct: false<br>
After adding, v=[24, 11, 8, 23, 27, 11, 8, 6, 4, 25, 5, 17, 8, 26, 25, 27, 22, 12, 9, 24]<br>
min= 4, max= 27<br>
Occurences of 8: 3<br>
After sorting, v=[4, 5, 6, 8, 8, 8, 9, 11, 11, 12, 17, 22, 23, 24, 24, 25, 25, 26, 27, 27]<br>
Position of 8: 4<br>
After shuffling, v=[11, 6, 25, 8, 8, 4, 22, 9, 11, 12, 24, 27, 26, 8, 24, 23, 25, 5, 17, 27]</div>
<p>Hai chỗ khác slide, đều cố ý: (1) <strong>generics</strong> — <code>ArrayList&lt;Integer&gt;</code> thay vì <code>ArrayList</code> thô, nên <code>Collections.min(v)</code> trả sẵn Integer và các phép ép <code>(int)</code> của slide biến mất; (2) <strong><code>new Random(14)</code></strong> thay vì <code>new Random()</code>. Không có hạt giống (seed) thì mỗi lần chạy in ra số khác (lần chạy trên slide chỉ là một kết quả có thể); có hạt giống cố định thì dãy "ngẫu nhiên" lần nào cũng như nhau — đúng điều bạn muốn khi kiểm thử. Hạt giống 14 được chọn vì nó cho dữ liệu giống slide: số 8 xuất hiện ba lần, nên dòng <code>Position of 8: 4</code> ở slide 6 ra y hệt.</p>
<p><code>Vector</code> là "tổ tiên" cũ (Java 1.0), có synchronized, của ArrayList — giống StringBuffer với StringBuilder; hãy dùng ArrayList. <code>nextInt(30)</code> trả 0..29: cận trên bị <strong>loại trừ</strong>.</p>`],
      [6, 'Collections Demo.',
        `<p class="y-chinh">🎯 <code>CollectionsDemo</code>, part 2 and the output: <code>Collections.frequency(v, 8)</code> counts the 8s, <code>Collections.sort(v)</code> sorts ascending, <code>Collections.binarySearch(v, 8)</code> finds a position of 8, <code>Collections.shuffle(v)</code> mixes the list randomly.</p>
<p>Read the output above line by line against the code: <code>disjunct: false</code> because 24, 8, 27 and 25 appear in both lists (the slide's "disjunct" is a typo for <strong>disjoint</strong>, "having no element in common"); after <code>addAll</code>, v has 20 elements; min 4, max 27; three 8s; after sorting the 8s sit at indexes 3, 4 and 5, and binarySearch returned <strong>4</strong> — with duplicates it returns <em>some</em> matching index, not necessarily the first.</p>
<p><code>shuffle</code> also takes a <code>Random</code>, here <code>new Random(2026)</code>, so the shuffled order is reproducible. A fair shuffle of a deck of cards in a game is exactly <code>Collections.shuffle(deck)</code> — an FE favourite ("which class shuffles an ArrayList?" → <code>Collections</code>).</p>
<div class="pitfall">FE trap: "binarySearch returns the index of the first occurrence" — not guaranteed. To find the first one, use <code>indexOf</code> (linear) or search left from the returned index.</div>`,
        `<p class="y-chinh">🎯 <code>CollectionsDemo</code>, phần 2 và output: <code>Collections.frequency(v, 8)</code> đếm số lần có số 8, <code>Collections.sort(v)</code> sắp tăng dần, <code>Collections.binarySearch(v, 8)</code> tìm một vị trí của 8, <code>Collections.shuffle(v)</code> trộn danh sách ngẫu nhiên.</p>
<p>Đọc output ở trên từng dòng đối chiếu với code: <code>disjunct: false</code> vì 24, 8, 27 và 25 có mặt ở cả hai danh sách (chữ "disjunct" của slide là gõ sai của <strong>disjoint</strong>, "không có phần tử chung"); sau <code>addAll</code>, v có 20 phần tử; min 4, max 27; ba số 8; sau khi sắp các số 8 nằm ở chỉ số 3, 4 và 5, và binarySearch trả về <strong>4</strong> — khi có phần tử trùng nó trả về <em>một</em> chỉ số khớp nào đó, không chắc là cái đầu tiên.</p>
<p><code>shuffle</code> cũng nhận một <code>Random</code>, ở đây <code>new Random(2026)</code>, nên thứ tự sau khi trộn lặp lại được. Xáo bộ bài công bằng trong một game chính là <code>Collections.shuffle(deck)</code> — câu FE quen thuộc ("lớp nào xáo trộn ArrayList?" → <code>Collections</code>).</p>
<div class="pitfall">Bẫy FE: "binarySearch trả về chỉ số của lần xuất hiện đầu tiên" — không được bảo đảm. Muốn lấy cái đầu tiên, dùng <code>indexOf</code> (tuần tự) hoặc dò về bên trái từ chỉ số nhận được.</div>`],
      [7, 'Sorting',
        `<p class="y-chinh">🎯 The sort algorithm reorders a List so that its elements are in ascending order according to an ordering relationship; example: <code>List&lt;String&gt; list = Arrays.asList(args); Collections.sort(list); System.out.println(list);</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 7: the school's Sort example (Arrays.asList + Collections.sort), with args filled in, and what "ascending" means for Strings
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SapXepDanhSach {
    public static void main(String[] args) {
        String[] a = {"pear", "Apple", "banana", "apple", "Cherry", "10", "9"};   // what "java Sort ..." would pass
        List&lt;String&gt; list = Arrays.asList(a);
        Collections.sort(list);
        System.out.println(list);
        System.out.println("the array was sorted too: " + Arrays.toString(a));     // asList is a VIEW of the array
        Collections.sort(list, String.CASE_INSENSITIVE_ORDER);
        System.out.println("CASE_INSENSITIVE_ORDER: " + list);
        Collections.sort(list, Collections.reverseOrder());
        System.out.println("reverseOrder(): " + list);
        try {
            list.add("kiwi");
        } catch (UnsupportedOperationException e) {
            System.out.println("Arrays.asList(...).add -&gt; " + e.getClass().getSimpleName());
        }
        List&lt;String&gt; sua = new ArrayList&lt;String&gt;(list);   // a real, resizable copy
        sua.add("kiwi");
        System.out.println("new ArrayList&lt;&gt;(list).add OK: size " + sua.size());
        List&lt;Integer&gt; so = new ArrayList&lt;Integer&gt;(Arrays.asList(10, 9, 100, 1));
        Collections.sort(so);
        System.out.println("numbers sort as numbers: " + so);
    }
}</code></pre>
<div class="out">[10, 9, Apple, Cherry, apple, banana, pear]<br>
the array was sorted too: [10, 9, Apple, Cherry, apple, banana, pear]<br>
CASE_INSENSITIVE_ORDER: [10, 9, Apple, apple, banana, Cherry, pear]<br>
reverseOrder(): [pear, banana, apple, Cherry, Apple, 9, 10]<br>
Arrays.asList(...).add -&gt; UnsupportedOperationException<br>
new ArrayList&lt;&gt;(list).add OK: size 8<br>
numbers sort as numbers: [1, 9, 10, 100]</div>
<p>"Ordering relationship" for Strings is <code>compareTo</code>, i.e. character codes: digits &lt; upper case &lt; lower case, so <code>10</code> comes before <code>9</code> and <code>Cherry</code> before <code>apple</code>. For a human order use <code>String.CASE_INSENSITIVE_ORDER</code>; for descending, <code>Collections.reverseOrder()</code>; numbers in a <code>List&lt;Integer&gt;</code> sort as numbers (1, 9, 10, 100).</p>
<p>➕ <code>Arrays.asList(a)</code> is not a normal ArrayList: it is a fixed-size <strong>view</strong> of the array — sorting the list sorted the array <code>a</code> too, and <code>add</code> throws <code>UnsupportedOperationException</code>. Copy it into <code>new ArrayList&lt;&gt;(…)</code> when you need to add or remove. (The slide's version reads the words from <code>args</code>; this run fills the array directly so the output is fixed.)</p>
<div class="pitfall">FE trap: "<code>Collections.sort</code> works on any Collection" — no, only on a <code>List</code> (a Set has no positions to reorder).</div>`,
        `<p class="y-chinh">🎯 Thuật toán sort sắp lại một List để các phần tử theo thứ tự tăng dần theo một quan hệ thứ tự; ví dụ: <code>List&lt;String&gt; list = Arrays.asList(args); Collections.sort(list); System.out.println(list);</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 7: ví dụ Sort của trường (Arrays.asList + Collections.sort), điền sẵn args, và "tăng dần" nghĩa là gì với String
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SapXepDanhSach {
    public static void main(String[] args) {
        String[] a = {"pear", "Apple", "banana", "apple", "Cherry", "10", "9"};   // điều "java Sort ..." sẽ truyền vào
        List&lt;String&gt; list = Arrays.asList(a);
        Collections.sort(list);
        System.out.println(list);
        System.out.println("the array was sorted too: " + Arrays.toString(a));     // asList là một KHUNG NHÌN của mảng
        Collections.sort(list, String.CASE_INSENSITIVE_ORDER);
        System.out.println("CASE_INSENSITIVE_ORDER: " + list);
        Collections.sort(list, Collections.reverseOrder());
        System.out.println("reverseOrder(): " + list);
        try {
            list.add("kiwi");
        } catch (UnsupportedOperationException e) {
            System.out.println("Arrays.asList(...).add -&gt; " + e.getClass().getSimpleName());
        }
        List&lt;String&gt; sua = new ArrayList&lt;String&gt;(list);   // một bản sao thật, đổi kích thước được
        sua.add("kiwi");
        System.out.println("new ArrayList&lt;&gt;(list).add OK: size " + sua.size());
        List&lt;Integer&gt; so = new ArrayList&lt;Integer&gt;(Arrays.asList(10, 9, 100, 1));
        Collections.sort(so);
        System.out.println("numbers sort as numbers: " + so);
    }
}</code></pre>
<div class="out">[10, 9, Apple, Cherry, apple, banana, pear]<br>
the array was sorted too: [10, 9, Apple, Cherry, apple, banana, pear]<br>
CASE_INSENSITIVE_ORDER: [10, 9, Apple, apple, banana, Cherry, pear]<br>
reverseOrder(): [pear, banana, apple, Cherry, Apple, 9, 10]<br>
Arrays.asList(...).add -&gt; UnsupportedOperationException<br>
new ArrayList&lt;&gt;(list).add OK: size 8<br>
numbers sort as numbers: [1, 9, 10, 100]</div>
<p>"Quan hệ thứ tự" của String là <code>compareTo</code>, tức mã ký tự: chữ số &lt; chữ hoa &lt; chữ thường, nên <code>10</code> đứng trước <code>9</code> và <code>Cherry</code> đứng trước <code>apple</code>. Muốn thứ tự "của con người" thì dùng <code>String.CASE_INSENSITIVE_ORDER</code>; muốn giảm dần thì <code>Collections.reverseOrder()</code>; số trong <code>List&lt;Integer&gt;</code> được sắp như số (1, 9, 10, 100).</p>
<p>➕ <code>Arrays.asList(a)</code> không phải ArrayList bình thường: nó là một <strong>khung nhìn</strong> cố định kích thước của mảng — sắp danh sách thì mảng <code>a</code> cũng bị sắp theo, và <code>add</code> ném <code>UnsupportedOperationException</code>. Chép sang <code>new ArrayList&lt;&gt;(…)</code> khi cần thêm hay xoá. (Bản trên slide đọc các từ từ <code>args</code>; lần chạy này điền thẳng mảng để output cố định.)</p>
<div class="pitfall">Bẫy FE: "<code>Collections.sort</code> chạy trên mọi Collection" — sai, chỉ trên <code>List</code> (Set không có vị trí để sắp lại).</div>`],
      [8, 'Comparator Interface',
        `<p class="y-chinh">🎯 A <code>Comparator</code> is a comparison function that imposes a total ordering on a collection of objects; the next demo sorts a list of employees by your own criteria: <strong>descending salaries, then ascending IDs</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b8cc484130017f899e199a6f321669a384afd7c7.svg" alt="Slides 9–11 redrawn: Employee implements Comparable (one natural order, by ID); a separate Comparator object gives a second order" loading="lazy" /><p class="chu-thich">🧩 Slides 9–11 redrawn: Employee implements Comparable (one natural order, by ID); a separate Comparator object gives a second order</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 9–11 redrawn — one natural order, any number of extra orders
' Comparable lives INSIDE the class (one order); a Comparator is a separate object (many orders)
interface "Comparable&lt;Employee&gt;" as Cmp {
  + compareTo(o : Employee) : int
}
interface "Comparator&lt;Employee&gt;" as Ctr {
  + compare(a : Employee, b : Employee) : int
}
class Employee {
  ~ ID : String
  ~ name : String
  ~ salary : int
  + Employee(id : String, n : String, s : int)
  + toString() : String
  + compareTo(emp : Employee) : int
  + {static} compareObj : Comparator&lt;Employee&gt;
}
class "anonymous class\\n(salary desc, then ID asc)" as Anon
class SortDemo {
  + {static} main(args : String[])
}
Employee ..|&gt; Cmp
Anon ..|&gt; Ctr
Employee *-- Anon : compareObj
SortDemo ..&gt; Employee : Collections.sort(list)\\nCollections.sort(list, Employee.compareObj)
note right of Cmp
  Collections.sort(list)
  uses compareTo -&gt; by ID
end note
note right of Ctr
  return &lt; 0 : a first
  return 0   : equal
  return &gt; 0 : b first
end note
@enduml</code></pre></details>
<p>Two interfaces, two places to put the rule. <code>Comparable&lt;T&gt;</code> is implemented <em>by the class itself</em> (<code>compareTo(T other)</code>) and gives its one "natural" order — String, Integer and the Employee of slide 9 have one. <code>Comparator&lt;T&gt;</code> is a <em>separate</em> object (<code>compare(T a, T b)</code>), so you can have as many orders as you like without touching the class.</p>
<table>
<thead><tr><th>Result of compare(a, b) / a.compareTo(b)</th><th>Meaning for sorting</th></tr></thead>
<tbody>
<tr><td>negative</td><td>a comes before b</td></tr>
<tr><td>0</td><td>a and b are equal in this order</td></tr>
<tr><td>positive</td><td>a comes after b</td></tr>
</tbody>
</table>
<p>"Total ordering" means the rule must be consistent: if a &lt; b and b &lt; c then a &lt; c, and every pair can be compared. A comparator that breaks this (or overflows — slide 11) makes sort produce nonsense or throw "Comparison method violates its general contract!".</p>`,
        `<p class="y-chinh">🎯 <code>Comparator</code> là một hàm so sánh áp đặt một thứ tự toàn phần lên một tập đối tượng; demo tiếp theo sắp danh sách nhân viên theo tiêu chí riêng: <strong>lương giảm dần, rồi ID tăng dần</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b8cc484130017f899e199a6f321669a384afd7c7.svg" alt="Slide 9–11 vẽ lại: Employee cài đặt Comparable (một thứ tự tự nhiên, theo ID); một đối tượng Comparator riêng cho thứ tự thứ hai" loading="lazy" /><p class="chu-thich">🧩 Slide 9–11 vẽ lại: Employee cài đặt Comparable (một thứ tự tự nhiên, theo ID); một đối tượng Comparator riêng cho thứ tự thứ hai</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 9–11 redrawn — one natural order, any number of extra orders
' Comparable nằm TRONG lớp (một thứ tự); Comparator là đối tượng riêng (nhiều thứ tự)
interface "Comparable&lt;Employee&gt;" as Cmp {
  + compareTo(o : Employee) : int
}
interface "Comparator&lt;Employee&gt;" as Ctr {
  + compare(a : Employee, b : Employee) : int
}
class Employee {
  ~ ID : String
  ~ name : String
  ~ salary : int
  + Employee(id : String, n : String, s : int)
  + toString() : String
  + compareTo(emp : Employee) : int
  + {static} compareObj : Comparator&lt;Employee&gt;
}
class "anonymous class\\n(salary desc, then ID asc)" as Anon
class SortDemo {
  + {static} main(args : String[])
}
Employee ..|&gt; Cmp
Anon ..|&gt; Ctr
Employee *-- Anon : compareObj
SortDemo ..&gt; Employee : Collections.sort(list)\\nCollections.sort(list, Employee.compareObj)
note right of Cmp
  Collections.sort(list)
  uses compareTo -&gt; by ID
end note
note right of Ctr
  return &lt; 0 : a first
  return 0   : equal
  return &gt; 0 : b first
end note
@enduml</code></pre></details>
<p>Hai interface, hai chỗ đặt luật. <code>Comparable&lt;T&gt;</code> được cài đặt <em>bởi chính lớp đó</em> (<code>compareTo(T khác)</code>) và cho đúng một thứ tự "tự nhiên" — String, Integer và Employee ở slide 9 đều có. <code>Comparator&lt;T&gt;</code> là một đối tượng <em>riêng</em> (<code>compare(T a, T b)</code>), nên bạn có bao nhiêu thứ tự tuỳ thích mà không phải sửa lớp.</p>
<table>
<thead><tr><th>Kết quả compare(a, b) / a.compareTo(b)</th><th>Nghĩa khi sắp xếp</th></tr></thead>
<tbody>
<tr><td>âm</td><td>a đứng trước b</td></tr>
<tr><td>0</td><td>a và b bằng nhau theo thứ tự này</td></tr>
<tr><td>dương</td><td>a đứng sau b</td></tr>
</tbody>
</table>
<p>"Thứ tự toàn phần" nghĩa là luật phải nhất quán: nếu a &lt; b và b &lt; c thì a &lt; c, và cặp nào cũng so được. Comparator phá luật này (hoặc bị tràn số — slide 11) làm sort cho kết quả vô nghĩa hoặc ném "Comparison method violates its general contract!".</p>`],
      [9, 'Comparator Interface – Demo.',
        `<p class="y-chinh">🎯 <code>Employee</code> (package <code>sort</code>) with fields <code>ID</code>, <code>name</code>, <code>salary</code>, a constructor, <code>toString()</code> returning <code>ID + "," + name + "," + salary</code>, and <code>implements Comparable</code> with <code>compareTo(Object emp)</code> comparing by <strong>ID</strong> — the "standard comparing".</p>
<pre class="trich"><code class="language-java">class Employee implements Comparable&lt;Employee&gt; {
    String ID = "", name = "";
    int salary = 0;

    public Employee(String id, String n, int s) {
        ID = id; name = n; salary = s;
    }

    @Override
    public String toString() {
        return ID + "," + name + "," + salary;
    }

    @Override // standard comparing: based on ID
    public int compareTo(Employee emp) {
        return ID.compareTo(emp.ID);
    }

    // an anonymous object for comparing 2 employees: descending salaries then ascending IDs
    public static Comparator&lt;Employee&gt; compareObj = new Comparator&lt;Employee&gt;() {
        @Override
        public int compare(Employee emp1, Employee emp2) {
            int d = emp1.salary - emp2.salary;
            if (d &gt; 0) return -1;
            if (d == 0) return emp1.ID.compareTo(emp2.ID);
            return 1;
        }
    };
}</code></pre>
<p>Differences from the slide: <code>Comparable&lt;Employee&gt;</code> instead of raw <code>Comparable</code>, so the parameter is an <code>Employee</code> and the cast <code>((Employee) emp)</code> disappears; the useless <code>import java.lang.Comparable;</code> is dropped (java.lang is automatic). <code>ID.compareTo(emp.ID)</code> simply reuses String's order — the cleanest way to write a <code>compareTo</code> is to delegate to fields that already know how to compare.</p>
<p><code>@Override</code> asks the compiler to check that the method really overrides/implements one from a supertype; misspell <code>compareTo</code> and it becomes a compile error instead of a silent bug. In a PE file you put this class in its own <code>Employee.java</code> with <code>public class</code>.</p>`,
        `<p class="y-chinh">🎯 <code>Employee</code> (package <code>sort</code>) có các trường <code>ID</code>, <code>name</code>, <code>salary</code>, một constructor, <code>toString()</code> trả về <code>ID + "," + name + "," + salary</code>, và <code>implements Comparable</code> với <code>compareTo(Object emp)</code> so theo <strong>ID</strong> — "so sánh chuẩn".</p>
<pre class="trich"><code class="language-java">class Employee implements Comparable&lt;Employee&gt; {
    String ID = "", name = "";
    int salary = 0;

    public Employee(String id, String n, int s) {
        ID = id; name = n; salary = s;
    }

    @Override
    public String toString() {
        return ID + "," + name + "," + salary;
    }

    @Override // so sánh chuẩn: theo ID
    public int compareTo(Employee emp) {
        return ID.compareTo(emp.ID);
    }

    // một đối tượng ẩn danh so sánh 2 nhân viên: lương giảm dần rồi ID tăng dần
    public static Comparator&lt;Employee&gt; compareObj = new Comparator&lt;Employee&gt;() {
        @Override
        public int compare(Employee emp1, Employee emp2) {
            int d = emp1.salary - emp2.salary;
            if (d &gt; 0) return -1;
            if (d == 0) return emp1.ID.compareTo(emp2.ID);
            return 1;
        }
    };
}</code></pre>
<p>Khác slide: <code>Comparable&lt;Employee&gt;</code> thay cho <code>Comparable</code> thô, nên tham số là <code>Employee</code> và phép ép <code>((Employee) emp)</code> biến mất; bỏ dòng <code>import java.lang.Comparable;</code> thừa (java.lang tự động có). <code>ID.compareTo(emp.ID)</code> dùng lại thứ tự của String — cách gọn nhất để viết <code>compareTo</code> là giao việc cho các trường vốn đã biết tự so sánh.</p>
<p><code>@Override</code> nhờ trình biên dịch kiểm tra phương thức thật sự ghi đè/cài đặt một phương thức của kiểu cha; gõ sai <code>compareTo</code> là thành lỗi biên dịch thay vì lỗi ngầm. Trong bài PE bạn đặt lớp này trong file riêng <code>Employee.java</code> với <code>public class</code>.</p>`],
      [10, 'Comparator Interface- Demo.',
        `<p class="y-chinh">🎯 Inside <code>Employee</code>, a <code>public static Comparator compareObj</code> is created as an <strong>anonymous object</strong> comparing two employees by descending salary then ascending ID: <code>d = salary1 - salary2</code>; <code>d &gt; 0</code> → return −1; <code>d == 0</code> → compare IDs; otherwise return 1.</p>
<p>The code is the <code>compareObj</code> field in the Employee listing above. Read the logic: a <em>higher</em> salary must come <em>first</em>, so when emp1 earns more (<code>d &gt; 0</code>) the comparator returns a negative number — the reverse of the natural order; on equal salary it falls back to <code>ID.compareTo</code>, ascending.</p>
<p><code>new Comparator&lt;Employee&gt;() { … }</code> is an <strong>anonymous class</strong>: a class with no name, declared and instantiated in one expression, implementing the interface's single method. Chapter 5 covers it; Java 8 lambdas (next slide) shorten it to one line. Making it a <code>static</code> field means one shared comparator for the whole program: <code>Employee.compareObj</code>.</p>
<div class="pitfall">The subtraction <code>d = emp1.salary - emp2.salary</code> is safe only because salaries are small; with values near ±2 billion it overflows and the sign flips — slide 11 runs that failure. Prefer <code>Integer.compare(a, b)</code>.</div>`,
        `<p class="y-chinh">🎯 Bên trong <code>Employee</code>, một <code>public static Comparator compareObj</code> được tạo dưới dạng <strong>đối tượng ẩn danh</strong> so sánh hai nhân viên theo lương giảm dần rồi ID tăng dần: <code>d = salary1 - salary2</code>; <code>d &gt; 0</code> → trả −1; <code>d == 0</code> → so ID; còn lại trả 1.</p>
<p>Code chính là trường <code>compareObj</code> trong đoạn Employee ở trên. Đọc logic: lương <em>cao hơn</em> phải đứng <em>trước</em>, nên khi emp1 lương nhiều hơn (<code>d &gt; 0</code>) comparator trả số âm — ngược với thứ tự tự nhiên; lương bằng nhau thì quay về <code>ID.compareTo</code>, tăng dần.</p>
<p><code>new Comparator&lt;Employee&gt;() { … }</code> là một <strong>lớp ẩn danh (anonymous class)</strong>: lớp không có tên, được khai báo và tạo đối tượng trong cùng một biểu thức, cài đặt phương thức duy nhất của interface. Chương 5 giảng kỹ; lambda của Java 8 (slide sau) rút nó còn một dòng. Để nó là trường <code>static</code> nghĩa là cả chương trình dùng chung một comparator: <code>Employee.compareObj</code>.</p>
<div class="pitfall">Phép trừ <code>d = emp1.salary - emp2.salary</code> chỉ an toàn vì lương nhỏ; với giá trị gần ±2 tỷ nó bị tràn và đổi dấu — slide 11 chạy thật lỗi đó. Nên dùng <code>Integer.compare(a, b)</code>.</div>`],
      [11, 'Comparator Interface- Demo.',
        `<p class="y-chinh">🎯 <code>SortDemo</code>: three employees (ID004 Michel 400, ID001 Helen 200, ID003 Hemming 400); <code>Collections.sort(list)</code> sorts on IDs ascending; <code>Collections.sort(list, Employee.compareObj)</code> sorts on descending salary then ascending IDs — output <code>[ID003,Hemming,400, ID004,Michel,400, ID001,Helen,200]</code>.</p>
<pre class="trich"><code class="language-java">ArrayList&lt;Employee&gt; list = new ArrayList&lt;Employee&gt;();
list.add(new Employee("ID004", "Michel", 400));
list.add(new Employee("ID001", "Helen", 200));
list.add(new Employee("ID003", "Hemming", 400));
Collections.sort(list);
System.out.println("Sorting on IDs ascending");
System.out.println(list);
Collections.sort(list, Employee.compareObj);
System.out.println("Sorting on descending salary then ascending IDs");
System.out.println(list);</code></pre>
<pre class="trich"><code class="language-java">Comparator&lt;Employee&gt; java8 = Comparator.comparingInt((Employee e) -&gt; e.salary).reversed()
                                       .thenComparing(e -&gt; e.ID);
Collections.shuffle(list, new java.util.Random(1));
Collections.sort(list, java8);
System.out.println("Java 8 comparator, same rule: " + list);
list.sort((e1, e2) -&gt; e1.name.compareTo(e2.name));        // List.sort + lambda, Java 8
System.out.println("by name: " + list);</code></pre>
<pre class="trich"><code class="language-java">Comparator&lt;Integer&gt; truSo = new Comparator&lt;Integer&gt;() {   // the "subtract" trick breaks with large numbers
    public int compare(Integer a, Integer b) { return a - b; }
};
ArrayList&lt;Integer&gt; so = new ArrayList&lt;Integer&gt;();
so.add(2_000_000_000); so.add(-2_000_000_000); so.add(0);
Collections.sort(so, truSo);
System.out.println("sorted with a - b      : " + so);
Collections.sort(so, new Comparator&lt;Integer&gt;() {
    public int compare(Integer a, Integer b) { return Integer.compare(a, b); }
});
System.out.println("sorted with Integer.compare: " + so);</code></pre>
<div class="out">Sorting on IDs ascending<br>
[ID001,Helen,200, ID003,Hemming,400, ID004,Michel,400]<br>
Sorting on descending salary then ascending IDs<br>
[ID003,Hemming,400, ID004,Michel,400, ID001,Helen,200]<br>
Java 8 comparator, same rule: [ID003,Hemming,400, ID004,Michel,400, ID001,Helen,200]<br>
by name: [ID001,Helen,200, ID003,Hemming,400, ID004,Michel,400]<br>
sorted with a - b &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: [2000000000, -2000000000, 0]<br>
sorted with Integer.compare: [-2000000000, 0, 2000000000]</div>
<p>The first four lines match the slide exactly. The Java 8 lines express the same rule declaratively — <code>comparingInt(salary).reversed().thenComparing(ID)</code> — and give the same order from a shuffled list; <code>list.sort(lambda)</code> sorts by name. Lambdas <strong>do</strong> compile on the exam's JDK 8 (they were introduced in Java 8), so you may use them in the PE.</p>
<p>The last two lines are the overflow trap: <code>a - b</code> for 2,000,000,000 and −2,000,000,000 is 4,000,000,000, which wraps to a negative <code>int</code>, so the "comparator" says the big number is smaller — the sorted list is wrong and nothing warns you. <code>Integer.compare</code> (Java 7) never overflows.</p>
<div class="callout">🧭 <strong>Go further — LAB211 / Spring Boot</strong>: "list sorted by X descending, then Y ascending" is in almost every LAB211 assignment; in Spring Data the same idea becomes <code>Sort.by("salary").descending().and(Sort.by("id"))</code>.</div>`,
        `<p class="y-chinh">🎯 <code>SortDemo</code>: ba nhân viên (ID004 Michel 400, ID001 Helen 200, ID003 Hemming 400); <code>Collections.sort(list)</code> sắp theo ID tăng dần; <code>Collections.sort(list, Employee.compareObj)</code> sắp theo lương giảm dần rồi ID tăng dần — output <code>[ID003,Hemming,400, ID004,Michel,400, ID001,Helen,200]</code>.</p>
<pre class="trich"><code class="language-java">ArrayList&lt;Employee&gt; list = new ArrayList&lt;Employee&gt;();
list.add(new Employee("ID004", "Michel", 400));
list.add(new Employee("ID001", "Helen", 200));
list.add(new Employee("ID003", "Hemming", 400));
Collections.sort(list);
System.out.println("Sorting on IDs ascending");
System.out.println(list);
Collections.sort(list, Employee.compareObj);
System.out.println("Sorting on descending salary then ascending IDs");
System.out.println(list);</code></pre>
<pre class="trich"><code class="language-java">Comparator&lt;Employee&gt; java8 = Comparator.comparingInt((Employee e) -&gt; e.salary).reversed()
                                       .thenComparing(e -&gt; e.ID);
Collections.shuffle(list, new java.util.Random(1));
Collections.sort(list, java8);
System.out.println("Java 8 comparator, same rule: " + list);
list.sort((e1, e2) -&gt; e1.name.compareTo(e2.name));        // List.sort + lambda, Java 8
System.out.println("by name: " + list);</code></pre>
<pre class="trich"><code class="language-java">Comparator&lt;Integer&gt; truSo = new Comparator&lt;Integer&gt;() {   // mẹo "trừ hai số" hỏng với số lớn
    public int compare(Integer a, Integer b) { return a - b; }
};
ArrayList&lt;Integer&gt; so = new ArrayList&lt;Integer&gt;();
so.add(2_000_000_000); so.add(-2_000_000_000); so.add(0);
Collections.sort(so, truSo);
System.out.println("sorted with a - b      : " + so);
Collections.sort(so, new Comparator&lt;Integer&gt;() {
    public int compare(Integer a, Integer b) { return Integer.compare(a, b); }
});
System.out.println("sorted with Integer.compare: " + so);</code></pre>
<div class="out">Sorting on IDs ascending<br>
[ID001,Helen,200, ID003,Hemming,400, ID004,Michel,400]<br>
Sorting on descending salary then ascending IDs<br>
[ID003,Hemming,400, ID004,Michel,400, ID001,Helen,200]<br>
Java 8 comparator, same rule: [ID003,Hemming,400, ID004,Michel,400, ID001,Helen,200]<br>
by name: [ID001,Helen,200, ID003,Hemming,400, ID004,Michel,400]<br>
sorted with a - b &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: [2000000000, -2000000000, 0]<br>
sorted with Integer.compare: [-2000000000, 0, 2000000000]</div>
<p>Bốn dòng đầu trùng khít slide. Các dòng Java 8 diễn đạt cùng luật theo kiểu khai báo — <code>comparingInt(salary).reversed().thenComparing(ID)</code> — và cho cùng thứ tự từ một danh sách đã trộn; <code>list.sort(lambda)</code> sắp theo tên. Lambda <strong>có</strong> biên dịch được trên JDK 8 của phòng thi (chúng ra đời ở Java 8), nên bạn được dùng ở PE.</p>
<p>Hai dòng cuối là bẫy tràn số: <code>a - b</code> với 2.000.000.000 và −2.000.000.000 bằng 4.000.000.000, quay vòng thành một <code>int</code> âm, nên "comparator" bảo số lớn là số nhỏ hơn — danh sách sắp sai mà không có gì cảnh báo. <code>Integer.compare</code> (Java 7) không bao giờ tràn.</p>
<div class="callout">🧭 <strong>Đi tiếp — LAB211 / Spring Boot</strong>: "danh sách sắp theo X giảm dần, rồi Y tăng dần" có trong gần như mọi bài LAB211; ở Spring Data cùng ý tưởng đó thành <code>Sort.by("salary").descending().and(Sort.by("id"))</code>.</div>`],
      [12, 'Routine Data Manipulation (1)',
        `<p class="y-chinh">🎯 <code>Collections</code> provides five algorithms for routine data manipulation on List objects: <code>reverse()</code>, <code>fill()</code>, <code>copy()</code>, <code>swap()</code> and <code>addAll()</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 12: the five routine-manipulation algorithms of Collections — reverse, fill, copy, swap, addAll — plus rotate and nCopies
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ThaoTacDanhSach {
    public static void main(String[] args) {
        List&lt;String&gt; l = new ArrayList&lt;String&gt;(Arrays.asList("A", "B", "C", "D", "E"));
        Collections.reverse(l);
        System.out.println("reverse        -&gt; " + l);
        Collections.swap(l, 0, 4);
        System.out.println("swap(0, 4)     -&gt; " + l);
        Collections.rotate(l, 2);
        System.out.println("rotate(2)      -&gt; " + l);
        Collections.addAll(l, "X", "Y");
        System.out.println("addAll(X, Y)   -&gt; " + l);
        List&lt;String&gt; dich = new ArrayList&lt;String&gt;(Collections.nCopies(9, "-"));
        Collections.copy(dich, l);                      // dest must already be at least as LONG as src
        System.out.println("copy into 9    -&gt; " + dich);
        try {
            Collections.copy(new ArrayList&lt;String&gt;(), l); // an empty list has size 0, whatever its capacity
        } catch (IndexOutOfBoundsException e) {
            System.out.println("copy into []   -&gt; " + e.getMessage());
        }
        Collections.fill(l, "Z");
        System.out.println("fill(Z)        -&gt; " + l);
    }
}</code></pre>
<div class="out">reverse &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [E, D, C, B, A]<br>
swap(0, 4) &nbsp;&nbsp;&nbsp;&nbsp;-&gt; [A, D, C, B, E]<br>
rotate(2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [B, E, A, D, C]<br>
addAll(X, Y) &nbsp;&nbsp;-&gt; [B, E, A, D, C, X, Y]<br>
copy into 9 &nbsp;&nbsp;&nbsp;-&gt; [B, E, A, D, C, X, Y, -, -]<br>
copy into [] &nbsp;&nbsp;-&gt; Source does not fit in dest<br>
fill(Z) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [Z, Z, Z, Z, Z, Z, Z]</div>
<table>
<thead><tr><th>Method</th><th>Does</th><th>Watch out</th></tr></thead>
<tbody>
<tr><td><code>reverse(list)</code></td><td>reverses the order in place</td><td>—</td></tr>
<tr><td><code>swap(list, i, j)</code></td><td>exchanges two positions</td><td>indexes must exist</td></tr>
<tr><td><code>fill(list, x)</code></td><td>replaces EVERY element with x</td><td>does not add elements</td></tr>
<tr><td><code>copy(dest, src)</code></td><td>overwrites the first src.size() elements of dest</td><td>dest.size() must be ≥ src.size(), else "Source does not fit in dest"</td></tr>
<tr><td><code>addAll(c, x, y, …)</code></td><td>adds the given elements</td><td>varargs: any number of values</td></tr>
</tbody>
</table>
<p>The <code>copy</code> trap is real: a brand-new <code>ArrayList</code> has <strong>size 0</strong> whatever its capacity, so copying into it throws <code>IndexOutOfBoundsException: Source does not fit in dest</code>. Usually you do not want <code>copy</code> at all — <code>new ArrayList&lt;&gt;(src)</code> makes a copy of any size. ➕ <code>rotate(list, k)</code> and <code>nCopies(n, x)</code> are two more helpers used above.</p>`,
        `<p class="y-chinh">🎯 <code>Collections</code> cung cấp năm thuật toán thao tác dữ liệu thường ngày trên List: <code>reverse()</code>, <code>fill()</code>, <code>copy()</code>, <code>swap()</code> và <code>addAll()</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 12: năm thuật toán thao tác thường ngày của Collections — reverse, fill, copy, swap, addAll — cộng rotate và nCopies
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ThaoTacDanhSach {
    public static void main(String[] args) {
        List&lt;String&gt; l = new ArrayList&lt;String&gt;(Arrays.asList("A", "B", "C", "D", "E"));
        Collections.reverse(l);
        System.out.println("reverse        -&gt; " + l);
        Collections.swap(l, 0, 4);
        System.out.println("swap(0, 4)     -&gt; " + l);
        Collections.rotate(l, 2);
        System.out.println("rotate(2)      -&gt; " + l);
        Collections.addAll(l, "X", "Y");
        System.out.println("addAll(X, Y)   -&gt; " + l);
        List&lt;String&gt; dich = new ArrayList&lt;String&gt;(Collections.nCopies(9, "-"));
        Collections.copy(dich, l);                      // đích phải DÀI ít nhất bằng nguồn
        System.out.println("copy into 9    -&gt; " + dich);
        try {
            Collections.copy(new ArrayList&lt;String&gt;(), l); // danh sách rỗng có size 0, dù capacity bao nhiêu
        } catch (IndexOutOfBoundsException e) {
            System.out.println("copy into []   -&gt; " + e.getMessage());
        }
        Collections.fill(l, "Z");
        System.out.println("fill(Z)        -&gt; " + l);
    }
}</code></pre>
<div class="out">reverse &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [E, D, C, B, A]<br>
swap(0, 4) &nbsp;&nbsp;&nbsp;&nbsp;-&gt; [A, D, C, B, E]<br>
rotate(2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [B, E, A, D, C]<br>
addAll(X, Y) &nbsp;&nbsp;-&gt; [B, E, A, D, C, X, Y]<br>
copy into 9 &nbsp;&nbsp;&nbsp;-&gt; [B, E, A, D, C, X, Y, -, -]<br>
copy into [] &nbsp;&nbsp;-&gt; Source does not fit in dest<br>
fill(Z) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [Z, Z, Z, Z, Z, Z, Z]</div>
<table>
<thead><tr><th>Phương thức</th><th>Làm gì</th><th>Coi chừng</th></tr></thead>
<tbody>
<tr><td><code>reverse(list)</code></td><td>đảo thứ tự ngay tại chỗ</td><td>—</td></tr>
<tr><td><code>swap(list, i, j)</code></td><td>đổi chỗ hai vị trí</td><td>chỉ số phải tồn tại</td></tr>
<tr><td><code>fill(list, x)</code></td><td>thay MỌI phần tử bằng x</td><td>không thêm phần tử</td></tr>
<tr><td><code>copy(dest, src)</code></td><td>ghi đè src.size() phần tử đầu của dest</td><td>dest.size() phải ≥ src.size(), không thì "Source does not fit in dest"</td></tr>
<tr><td><code>addAll(c, x, y, …)</code></td><td>thêm các phần tử cho trước</td><td>varargs: bao nhiêu giá trị cũng được</td></tr>
</tbody>
</table>
<p>Bẫy <code>copy</code> là thật: một <code>ArrayList</code> mới tinh có <strong>size 0</strong> dù capacity bao nhiêu, nên chép vào nó ném <code>IndexOutOfBoundsException: Source does not fit in dest</code>. Thường bạn chẳng cần <code>copy</code> — <code>new ArrayList&lt;&gt;(src)</code> tạo bản sao cỡ nào cũng được. ➕ <code>rotate(list, k)</code> và <code>nCopies(n, x)</code> là hai hàm phụ nữa đã dùng ở trên.</p>`],
      [13, 'Searching',
        `<p class="y-chinh">🎯 Condition: the list is in ascending order; <code>binarySearch</code> searches for a specified element in a sorted List; return value ≥ 0 → present, &lt; 0 → absent.</p>
<pre class="trich"><code class="language-java">List&lt;Integer&gt; l = new ArrayList&lt;Integer&gt;(Arrays.asList(1, 3, 5, 7, 9));
System.out.println("list " + l);
System.out.println("binarySearch 7 -&gt; " + Collections.binarySearch(l, 7));
int p = Collections.binarySearch(l, 4);       // absent: -(insertion point) - 1
System.out.println("binarySearch 4 -&gt; " + p + "   =&gt; insert at " + (-p - 1));
l.add(-p - 1, 4);
System.out.println("after inserting 4 there -&gt; " + l);
List&lt;Integer&gt; chuaSap = Arrays.asList(9, 1, 7, 3, 5);
System.out.println("binarySearch 9 in UNSORTED " + chuaSap + " -&gt; " + Collections.binarySearch(chuaSap, 9) + "   (wrong answer, no error)");</code></pre>
<p>(The output of <code>TimKiem</code> is under slide 15.) The negative value is not just "absent": it is <code>-(insertion point) - 1</code>, where the insertion point is the index at which the key <em>would</em> go to keep the list sorted. For 4 in [1, 3, 5, 7, 9] the result is −3, so the insertion point is 2 — and inserting there keeps the list sorted. The "−1" exists so that "insert at position 0" (−1) is still negative.</p>
<p>The condition matters: on the unsorted list <code>[9, 1, 7, 3, 5]</code> searching for 9 returned −6 although 9 is at index 0. The API calls the result "undefined" — there is no exception, just a wrong answer. Sort first, with the <strong>same</strong> comparator you search with (<code>binarySearch(list, key, comparator)</code>).</p>
<p class="meo">🧠 Binary search halves the range each step: about 20 comparisons for a million elements, versus up to a million for <code>indexOf</code>. CSD201 proves it.</p>`,
        `<p class="y-chinh">🎯 Điều kiện: danh sách đã sắp tăng dần; <code>binarySearch</code> tìm một phần tử cho trước trong List đã sắp; giá trị trả về ≥ 0 → có mặt, &lt; 0 → không có.</p>
<pre class="trich"><code class="language-java">List&lt;Integer&gt; l = new ArrayList&lt;Integer&gt;(Arrays.asList(1, 3, 5, 7, 9));
System.out.println("list " + l);
System.out.println("binarySearch 7 -&gt; " + Collections.binarySearch(l, 7));
int p = Collections.binarySearch(l, 4);       // không có: -(vị trí chèn) - 1
System.out.println("binarySearch 4 -&gt; " + p + "   =&gt; insert at " + (-p - 1));
l.add(-p - 1, 4);
System.out.println("after inserting 4 there -&gt; " + l);
List&lt;Integer&gt; chuaSap = Arrays.asList(9, 1, 7, 3, 5);
System.out.println("binarySearch 9 in UNSORTED " + chuaSap + " -&gt; " + Collections.binarySearch(chuaSap, 9) + "   (wrong answer, no error)");</code></pre>
<p>(Output của <code>TimKiem</code> nằm dưới slide 15.) Số âm không chỉ nghĩa là "không có": nó là <code>-(vị trí chèn) - 1</code>, trong đó vị trí chèn là chỉ số mà khoá <em>sẽ</em> được đặt vào để danh sách vẫn có thứ tự. Với 4 trong [1, 3, 5, 7, 9] kết quả là −3, nên vị trí chèn là 2 — và chèn vào đó thì danh sách vẫn đúng thứ tự. Phần "−1" có để "chèn ở vị trí 0" (−1) vẫn là số âm.</p>
<p>Điều kiện là bắt buộc: trên danh sách chưa sắp <code>[9, 1, 7, 3, 5]</code>, tìm 9 trả −6 dù 9 nằm ở chỉ số 0. API gọi kết quả đó là "không xác định" — không có ngoại lệ, chỉ là đáp án sai. Hãy sắp trước, bằng <strong>cùng</strong> comparator dùng để tìm (<code>binarySearch(list, key, comparator)</code>).</p>
<p class="meo">🧠 Tìm kiếm nhị phân chia đôi khoảng tìm mỗi bước: khoảng 20 lần so sánh cho một triệu phần tử, so với tới một triệu lần của <code>indexOf</code>. CSD201 sẽ chứng minh.</p>`],
      [14, 'Composition',
        `<p class="y-chinh">🎯 <code>frequency</code> counts how many times a specified element occurs in a collection; <code>disjoint</code> tells whether two collections are disjoint, that is, whether they contain no elements in common.</p>
<pre class="trich"><code class="language-java">List&lt;String&gt; a = Arrays.asList("java", "c", "java", "sql", "java");
List&lt;String&gt; b = Arrays.asList("python", "go");
System.out.println("frequency(java) = " + Collections.frequency(a, "java") + ", disjoint(a, b) = " + Collections.disjoint(a, b)
    + ", disjoint(a, [sql]) = " + Collections.disjoint(a, Arrays.asList("sql")));</code></pre>
<p>Both compare elements with <code>equals</code>, not <code>==</code> — so they work correctly for Strings read from input and for Integers above 127 (deck pro5). For your own classes (Employee…), <code>frequency</code> and <code>disjoint</code> only find "equal" objects if the class overrides <code>equals</code> (Chapter 4); otherwise two objects with the same data count as different.</p>
<p>Why "composition": the tutorial groups algorithms that test something about the <em>composition</em> (the content) of one or two collections. In practice: <code>frequency</code> answers "how many students are in class SE1801?", <code>disjoint</code> answers "do these two exam rooms share a student?".</p>`,
        `<p class="y-chinh">🎯 <code>frequency</code> đếm số lần một phần tử cho trước xuất hiện trong collection; <code>disjoint</code> cho biết hai collection có rời nhau không, tức là không có phần tử chung nào.</p>
<pre class="trich"><code class="language-java">List&lt;String&gt; a = Arrays.asList("java", "c", "java", "sql", "java");
List&lt;String&gt; b = Arrays.asList("python", "go");
System.out.println("frequency(java) = " + Collections.frequency(a, "java") + ", disjoint(a, b) = " + Collections.disjoint(a, b)
    + ", disjoint(a, [sql]) = " + Collections.disjoint(a, Arrays.asList("sql")));</code></pre>
<p>Cả hai so phần tử bằng <code>equals</code>, không phải <code>==</code> — nên chúng chạy đúng với String đọc từ bàn phím và Integer trên 127 (deck pro5). Với lớp của bạn (Employee…), <code>frequency</code> và <code>disjoint</code> chỉ tìm thấy đối tượng "bằng nhau" nếu lớp ghi đè <code>equals</code> (Chương 4); không thì hai đối tượng cùng dữ liệu vẫn bị coi là khác.</p>
<p>Vì sao gọi là "composition": bộ hướng dẫn gom các thuật toán kiểm tra một điều gì đó về <em>thành phần</em> (nội dung) của một hoặc hai collection. Thực tế: <code>frequency</code> trả lời "lớp SE1801 có bao nhiêu sinh viên?", <code>disjoint</code> trả lời "hai phòng thi này có chung sinh viên nào không?".</p>`],
      [15, 'Finding Extreme Values',
        `<p class="y-chinh">🎯 The methods <code>min(…)</code> and <code>max(…)</code> find the extreme values of a collection — with the natural order, or with a Comparator.</p>
<pre class="trich"><code class="language-java">List&lt;String&gt; words = Arrays.asList("banana", "Fig", "apple", "kiwi");
Comparator&lt;String&gt; theoDoDai = new Comparator&lt;String&gt;() {
    public int compare(String x, String y) { return x.length() - y.length(); }
};
System.out.println("min = " + Collections.min(words) + ", max = " + Collections.max(words)
    + ", shortest = " + Collections.min(words, theoDoDai) + ", longest = " + Collections.max(words, theoDoDai));
try {
    Collections.max(new ArrayList&lt;Integer&gt;());
} catch (java.util.NoSuchElementException e) {
    System.out.println("max of an empty list -&gt; " + e.getClass().getSimpleName());
}</code></pre>
<div class="out">list [1, 3, 5, 7, 9]<br>
binarySearch 7 -&gt; 3<br>
binarySearch 4 -&gt; -3 &nbsp;&nbsp;=&gt; insert at 2<br>
after inserting 4 there -&gt; [1, 3, 4, 5, 7, 9]<br>
binarySearch 9 in UNSORTED [9, 1, 7, 3, 5] -&gt; -6 &nbsp;&nbsp;(wrong answer, no error)<br>
frequency(java) = 3, disjoint(a, b) = true, disjoint(a, [sql]) = false<br>
min = Fig, max = kiwi, shortest = Fig, longest = banana<br>
max of an empty list -&gt; NoSuchElementException</div>
<p>The slide is one line; here is what it means. <code>min(words)</code> uses the natural (String) order, so <code>Fig</code> (capital F) is the minimum and <code>kiwi</code> the maximum; with a length comparator the same list gives <code>Fig</code> as shortest and <code>banana</code> as longest. On ties, <code>max</code>/<code>min</code> return the first one found. On an empty collection both throw <code>NoSuchElementException</code> — check <code>isEmpty()</code> first when the list may be empty.</p>
<p>PE use: "find the employee with the highest salary" is <code>Collections.max(list, comparatorBySalary)</code> — one line instead of a loop. If the paper says "return null / 'Not found' when the list is empty", that check is yours to write.</p>
<div class="pitfall">FE trap: <code>Collections.max</code> on a list of Strings is the <em>alphabetically last</em> by character codes, not the longest one.</div>`,
        `<p class="y-chinh">🎯 Các phương thức <code>min(…)</code> và <code>max(…)</code> tìm giá trị cực trị của một collection — theo thứ tự tự nhiên, hoặc theo một Comparator.</p>
<pre class="trich"><code class="language-java">List&lt;String&gt; words = Arrays.asList("banana", "Fig", "apple", "kiwi");
Comparator&lt;String&gt; theoDoDai = new Comparator&lt;String&gt;() {
    public int compare(String x, String y) { return x.length() - y.length(); }
};
System.out.println("min = " + Collections.min(words) + ", max = " + Collections.max(words)
    + ", shortest = " + Collections.min(words, theoDoDai) + ", longest = " + Collections.max(words, theoDoDai));
try {
    Collections.max(new ArrayList&lt;Integer&gt;());
} catch (java.util.NoSuchElementException e) {
    System.out.println("max of an empty list -&gt; " + e.getClass().getSimpleName());
}</code></pre>
<div class="out">list [1, 3, 5, 7, 9]<br>
binarySearch 7 -&gt; 3<br>
binarySearch 4 -&gt; -3 &nbsp;&nbsp;=&gt; insert at 2<br>
after inserting 4 there -&gt; [1, 3, 4, 5, 7, 9]<br>
binarySearch 9 in UNSORTED [9, 1, 7, 3, 5] -&gt; -6 &nbsp;&nbsp;(wrong answer, no error)<br>
frequency(java) = 3, disjoint(a, b) = true, disjoint(a, [sql]) = false<br>
min = Fig, max = kiwi, shortest = Fig, longest = banana<br>
max of an empty list -&gt; NoSuchElementException</div>
<p>Slide chỉ có một dòng; đây là ý nghĩa của nó. <code>min(words)</code> dùng thứ tự tự nhiên (của String), nên <code>Fig</code> (F hoa) là nhỏ nhất và <code>kiwi</code> lớn nhất; với comparator theo độ dài, cùng danh sách đó cho <code>Fig</code> là ngắn nhất và <code>banana</code> dài nhất. Khi bằng nhau, <code>max</code>/<code>min</code> trả về cái gặp đầu tiên. Trên collection rỗng cả hai ném <code>NoSuchElementException</code> — kiểm <code>isEmpty()</code> trước khi danh sách có thể rỗng.</p>
<p>Dùng ở PE: "tìm nhân viên lương cao nhất" là <code>Collections.max(list, comparatorTheoLuong)</code> — một dòng thay cho vòng lặp. Nếu đề ghi "trả về null / 'Not found' khi danh sách rỗng" thì phần kiểm tra đó bạn phải tự viết.</p>
<div class="pitfall">Bẫy FE: <code>Collections.max</code> trên danh sách String là chuỗi <em>đứng cuối theo mã ký tự</em>, không phải chuỗi dài nhất.</div>`],
      [16, 'The Arrays Class',
        `<p class="y-chinh">🎯 <code>Arrays</code> is similar to <code>Collections</code>, but it accepts <strong>arrays</strong> as its parameters ("It it similar" on the slide is a typo); the slide links to its API page.</p>
<p>The link is the same dead <code>file:///J:/…</code> path as slide 4 — use <strong>docs.oracle.com/javase/8/docs/api/java/util/Arrays.html</strong>. Most methods exist in one version per primitive type plus one for objects: <code>sort(int[])</code>, <code>sort(double[])</code>, …, <code>sort(Object[])</code>, <code>sort(T[], Comparator)</code>.</p>
<table>
<thead><tr><th>Collections (List)</th><th>Arrays (array)</th></tr></thead>
<tbody>
<tr><td><code>Collections.sort(list)</code></td><td><code>Arrays.sort(a)</code></td></tr>
<tr><td><code>Collections.binarySearch(list, k)</code></td><td><code>Arrays.binarySearch(a, k)</code></td></tr>
<tr><td><code>list.toString()</code></td><td><code>Arrays.toString(a)</code> / <code>Arrays.deepToString(m)</code></td></tr>
<tr><td><code>list.equals(other)</code></td><td><code>Arrays.equals(a, b)</code></td></tr>
<tr><td><code>Collections.fill(list, x)</code></td><td><code>Arrays.fill(a, x)</code></td></tr>
<tr><td><code>new ArrayList&lt;&gt;(list)</code></td><td><code>Arrays.copyOf(a, n)</code> / <code>copyOfRange(a, i, j)</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 A Comparator works only on <strong>object</strong> arrays: <code>Arrays.sort(int[], comparator)</code> does not exist — use <code>Integer[]</code> to sort numbers in descending order (slide 17).</p>`,
        `<p class="y-chinh">🎯 <code>Arrays</code> giống <code>Collections</code>, nhưng nhận <strong>mảng</strong> làm tham số ("It it similar" trên slide là gõ sai); slide dẫn link tới trang API của nó.</p>
<p>Link vẫn là đường dẫn chết <code>file:///J:/…</code> như slide 4 — hãy dùng <strong>docs.oracle.com/javase/8/docs/api/java/util/Arrays.html</strong>. Phần lớn phương thức có một bản cho mỗi kiểu nguyên thủy cộng một bản cho đối tượng: <code>sort(int[])</code>, <code>sort(double[])</code>, …, <code>sort(Object[])</code>, <code>sort(T[], Comparator)</code>.</p>
<table>
<thead><tr><th>Collections (List)</th><th>Arrays (mảng)</th></tr></thead>
<tbody>
<tr><td><code>Collections.sort(list)</code></td><td><code>Arrays.sort(a)</code></td></tr>
<tr><td><code>Collections.binarySearch(list, k)</code></td><td><code>Arrays.binarySearch(a, k)</code></td></tr>
<tr><td><code>list.toString()</code></td><td><code>Arrays.toString(a)</code> / <code>Arrays.deepToString(m)</code></td></tr>
<tr><td><code>list.equals(other)</code></td><td><code>Arrays.equals(a, b)</code></td></tr>
<tr><td><code>Collections.fill(list, x)</code></td><td><code>Arrays.fill(a, x)</code></td></tr>
<tr><td><code>new ArrayList&lt;&gt;(list)</code></td><td><code>Arrays.copyOf(a, n)</code> / <code>copyOfRange(a, i, j)</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 Comparator chỉ dùng được với mảng <strong>đối tượng</strong>: không có <code>Arrays.sort(int[], comparator)</code> — dùng <code>Integer[]</code> để sắp số giảm dần (slide 17).</p>`],
      [17, 'Arrays Class: Demo.',
        `<p class="y-chinh">🎯 <code>ArraysDemo</code>: <code>Arrays.toString</code> of three arrays, <code>Arrays.equals</code> (ar1 vs ar2 false, ar2 vs ar3 true), <code>copyOf(ar1, 3)</code> = [5, 1, 4], <code>copyOfRange(ar1, 2, 6)</code> = [4, 7, 9, 3], <code>sort(ar1)</code>, and <code>binarySearch(ar1, 7)</code> = 7.</p>
<pre><code class="language-java">// release: 8
// Slides 16–17: the school's ArraysDemo, then the Arrays methods that save time in PE — fill, sort a range, sort with a Comparator, deepToString
import java.util.Arrays;
import java.util.Collections;

public class ArraysDemo {
    public static void main(String[] args) {
        int ar1[] = {5, 1, 4, 7, 9, 3, 4, 5, 3};
        int ar2[] = {5, 6, 7, 8, 9};
        int ar3[] = {5, 6, 7, 8, 9};
        System.out.println("ar1=" + Arrays.toString(ar1));
        System.out.println("ar2=" + Arrays.toString(ar2));
        System.out.println("ar3=" + Arrays.toString(ar3));
        boolean eq = Arrays.equals(ar1, ar2);
        System.out.println("ar1=ar2: " + eq);
        eq = Arrays.equals(ar2, ar3);
        System.out.println("ar2=ar3: " + eq);
        int numOfElements = 3, from = 2, before = 6;
        int ar4[] = Arrays.copyOf(ar1, numOfElements);
        System.out.println("ar4= " + Arrays.toString(ar4));
        int ar5[] = Arrays.copyOfRange(ar1, from, before);
        System.out.println("ar5=" + Arrays.toString(ar5));
        Arrays.sort(ar1);
        System.out.println("After sorting, ar1=" + Arrays.toString(ar1));
        int pos = Arrays.binarySearch(ar1, 7);
        System.out.println("Binary search 7, pos= " + pos);
        System.out.println("ar2 == ar3 ? " + (ar2 == ar3) + ", ar2.equals(ar3) ? " + ar2.equals(ar3) + "   (both compare addresses)");
        int[] f = new int[5];
        Arrays.fill(f, 7);
        int[] g = {9, 8, 7, 6, 5, 4};
        Arrays.sort(g, 1, 4);                         // sorts only indexes 1..3
        System.out.println("fill(7) -&gt; " + Arrays.toString(f) + ", sort(g, 1, 4) -&gt; " + Arrays.toString(g));
        Integer[] h = {3, 1, 2};                      // a Comparator needs objects: Integer[], not int[]
        Arrays.sort(h, Collections.reverseOrder());
        String[] names = {"Lan", "an", "Binh"};
        Arrays.sort(names, String.CASE_INSENSITIVE_ORDER);
        System.out.println("Integer[] reverse -&gt; " + Arrays.toString(h) + ", names ignoring case -&gt; " + Arrays.toString(names));
        int[][] m = {{1, 2}, {3, 4}};
        System.out.println("toString(m) starts with " + Arrays.toString(m).substring(0, 4) + "..., deepToString(m) -&gt; " + Arrays.deepToString(m));
    }
}</code></pre>
<div class="out">ar1=[5, 1, 4, 7, 9, 3, 4, 5, 3]<br>
ar2=[5, 6, 7, 8, 9]<br>
ar3=[5, 6, 7, 8, 9]<br>
ar1=ar2: false<br>
ar2=ar3: true<br>
ar4= [5, 1, 4]<br>
ar5=[4, 7, 9, 3]<br>
After sorting, ar1=[1, 3, 3, 4, 4, 5, 5, 7, 9]<br>
Binary search 7, pos= 7<br>
ar2 == ar3 ? false, ar2.equals(ar3) ? false &nbsp;&nbsp;(both compare addresses)<br>
fill(7) -&gt; [7, 7, 7, 7, 7], sort(g, 1, 4) -&gt; [9, 6, 7, 8, 5, 4]<br>
Integer[] reverse -&gt; [3, 2, 1], names ignoring case -&gt; [an, Binh, Lan]<br>
toString(m) starts with [[I@..., deepToString(m) -&gt; [[1, 2], [3, 4]]</div>
<p>The slide's nine lines match. <code>copyOfRange(a, from, to)</code> follows the same "from included, to excluded" rule as <code>substring</code> (indexes 2..5 → four elements). After sorting, 7 is at index 7 of <code>[1, 3, 3, 4, 4, 5, 5, 7, 9]</code>.</p>
<p>The extra lines: <code>ar2 == ar3</code> and <code>ar2.equals(ar3)</code> are <strong>both false</strong> — an array's <code>equals</code> is inherited from <code>Object</code> and compares addresses; only <code>Arrays.equals</code> compares contents. <code>sort(g, 1, 4)</code> sorts a range; an <code>Integer[]</code> sorts with <code>Collections.reverseOrder()</code>; <code>deepToString</code> prints 2D arrays.</p>
<div class="pitfall">FE trap: "Which method compares two arrays for equality?" — <code>Arrays.equals()</code>; <code>a.equals(b)</code> and <code>a == b</code> are true only for the same array object.</div>`,
        `<p class="y-chinh">🎯 <code>ArraysDemo</code>: <code>Arrays.toString</code> của ba mảng, <code>Arrays.equals</code> (ar1 với ar2 false, ar2 với ar3 true), <code>copyOf(ar1, 3)</code> = [5, 1, 4], <code>copyOfRange(ar1, 2, 6)</code> = [4, 7, 9, 3], <code>sort(ar1)</code>, và <code>binarySearch(ar1, 7)</code> = 7.</p>
<pre><code class="language-java">// release: 8
// Slide 16–17: ArraysDemo của trường, rồi các phương thức Arrays tiết kiệm thời gian ở PE — fill, sắp một đoạn, sắp theo Comparator, deepToString
import java.util.Arrays;
import java.util.Collections;

public class ArraysDemo {
    public static void main(String[] args) {
        int ar1[] = {5, 1, 4, 7, 9, 3, 4, 5, 3};
        int ar2[] = {5, 6, 7, 8, 9};
        int ar3[] = {5, 6, 7, 8, 9};
        System.out.println("ar1=" + Arrays.toString(ar1));
        System.out.println("ar2=" + Arrays.toString(ar2));
        System.out.println("ar3=" + Arrays.toString(ar3));
        boolean eq = Arrays.equals(ar1, ar2);
        System.out.println("ar1=ar2: " + eq);
        eq = Arrays.equals(ar2, ar3);
        System.out.println("ar2=ar3: " + eq);
        int numOfElements = 3, from = 2, before = 6;
        int ar4[] = Arrays.copyOf(ar1, numOfElements);
        System.out.println("ar4= " + Arrays.toString(ar4));
        int ar5[] = Arrays.copyOfRange(ar1, from, before);
        System.out.println("ar5=" + Arrays.toString(ar5));
        Arrays.sort(ar1);
        System.out.println("After sorting, ar1=" + Arrays.toString(ar1));
        int pos = Arrays.binarySearch(ar1, 7);
        System.out.println("Binary search 7, pos= " + pos);
        System.out.println("ar2 == ar3 ? " + (ar2 == ar3) + ", ar2.equals(ar3) ? " + ar2.equals(ar3) + "   (both compare addresses)");
        int[] f = new int[5];
        Arrays.fill(f, 7);
        int[] g = {9, 8, 7, 6, 5, 4};
        Arrays.sort(g, 1, 4);                         // chỉ sắp chỉ số 1..3
        System.out.println("fill(7) -&gt; " + Arrays.toString(f) + ", sort(g, 1, 4) -&gt; " + Arrays.toString(g));
        Integer[] h = {3, 1, 2};                      // Comparator cần đối tượng: Integer[], không phải int[]
        Arrays.sort(h, Collections.reverseOrder());
        String[] names = {"Lan", "an", "Binh"};
        Arrays.sort(names, String.CASE_INSENSITIVE_ORDER);
        System.out.println("Integer[] reverse -&gt; " + Arrays.toString(h) + ", names ignoring case -&gt; " + Arrays.toString(names));
        int[][] m = {{1, 2}, {3, 4}};
        System.out.println("toString(m) starts with " + Arrays.toString(m).substring(0, 4) + "..., deepToString(m) -&gt; " + Arrays.deepToString(m));
    }
}</code></pre>
<div class="out">ar1=[5, 1, 4, 7, 9, 3, 4, 5, 3]<br>
ar2=[5, 6, 7, 8, 9]<br>
ar3=[5, 6, 7, 8, 9]<br>
ar1=ar2: false<br>
ar2=ar3: true<br>
ar4= [5, 1, 4]<br>
ar5=[4, 7, 9, 3]<br>
After sorting, ar1=[1, 3, 3, 4, 4, 5, 5, 7, 9]<br>
Binary search 7, pos= 7<br>
ar2 == ar3 ? false, ar2.equals(ar3) ? false &nbsp;&nbsp;(both compare addresses)<br>
fill(7) -&gt; [7, 7, 7, 7, 7], sort(g, 1, 4) -&gt; [9, 6, 7, 8, 5, 4]<br>
Integer[] reverse -&gt; [3, 2, 1], names ignoring case -&gt; [an, Binh, Lan]<br>
toString(m) starts with [[I@..., deepToString(m) -&gt; [[1, 2], [3, 4]]</div>
<p>Chín dòng của slide khớp. <code>copyOfRange(a, from, to)</code> theo cùng luật "lấy from, bỏ to" như <code>substring</code> (chỉ số 2..5 → bốn phần tử). Sau khi sắp, 7 nằm ở chỉ số 7 của <code>[1, 3, 3, 4, 4, 5, 5, 7, 9]</code>.</p>
<p>Các dòng thêm: <code>ar2 == ar3</code> và <code>ar2.equals(ar3)</code> <strong>đều false</strong> — <code>equals</code> của mảng thừa kế từ <code>Object</code> và so địa chỉ; chỉ <code>Arrays.equals</code> mới so nội dung. <code>sort(g, 1, 4)</code> sắp một đoạn; mảng <code>Integer[]</code> sắp được với <code>Collections.reverseOrder()</code>; <code>deepToString</code> in mảng 2 chiều.</p>
<div class="pitfall">Bẫy FE: "Phương thức nào so sánh hai mảng bằng nhau?" — <code>Arrays.equals()</code>; <code>a.equals(b)</code> và <code>a == b</code> chỉ đúng khi là cùng một đối tượng mảng.</div>`],
      [18, 'Summary',
        `<p class="y-chinh">🎯 Support classes <code>Collections</code> and <code>Arrays</code>: use Collections for sorting/shuffling, routine data manipulation, searching/composition and finding extreme values; use the Arrays class for the same work on arrays.</p>
<table>
<thead><tr><th>You should now be able to</th><th>Check</th></tr></thead>
<tbody>
<tr><td>sort a list naturally, case-insensitively, in reverse</td><td>slide 7</td></tr>
<tr><td>write <code>compareTo</code> and a <code>Comparator</code> for "X descending, then Y ascending" without overflow</td><td>slides 8–11</td></tr>
<tr><td>explain a negative <code>binarySearch</code> result and when its answer is meaningless</td><td>slide 13</td></tr>
<tr><td>use <code>frequency</code>, <code>disjoint</code>, <code>min</code>/<code>max</code> with a comparator</td><td>slides 14–15</td></tr>
<tr><td>compare, copy, sort and print arrays with <code>Arrays</code></td><td>slides 16–17</td></tr>
</tbody>
</table>
<p>End of Chapter 1 slides. Next: the 🧪 practice of Chapter 1 (PE question 4 and LAB211-style exercises, all solved on JDK 8) and the rewritten Chapter 1 quiz.</p>`,
        `<p class="y-chinh">🎯 Lớp hỗ trợ <code>Collections</code> và <code>Arrays</code>: dùng Collections để sắp xếp/xáo trộn, thao tác dữ liệu thường ngày, tìm kiếm/kết hợp và tìm cực trị; dùng lớp Arrays cho cùng các việc đó trên mảng.</p>
<table>
<thead><tr><th>Giờ bạn phải làm được</th><th>Xem lại</th></tr></thead>
<tbody>
<tr><td>sắp danh sách theo tự nhiên, không phân biệt hoa thường, ngược lại</td><td>slide 7</td></tr>
<tr><td>viết <code>compareTo</code> và một <code>Comparator</code> cho "X giảm dần, rồi Y tăng dần" không bị tràn số</td><td>slide 8–11</td></tr>
<tr><td>giải thích kết quả âm của <code>binarySearch</code> và khi nào đáp án của nó vô nghĩa</td><td>slide 13</td></tr>
<tr><td>dùng <code>frequency</code>, <code>disjoint</code>, <code>min</code>/<code>max</code> kèm comparator</td><td>slide 14–15</td></tr>
<tr><td>so sánh, chép, sắp và in mảng bằng <code>Arrays</code></td><td>slide 16–17</td></tr>
</tbody>
</table>
<p>Hết phần slide của Chương 1. Tiếp theo: 🧪 thực hành Chương 1 (câu PE số 4 và bài kiểu LAB211, đều có lời giải trên JDK 8) và quiz Chương 1 viết lại.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>Write a Comparator for students: GPA descending, then name ascending ignoring case.</li>
<li><code>Collections.binarySearch</code> returns −5. Where would the key be inserted?</li>
<li>Why does <code>Arrays.asList(arr).add(x)</code> throw, and how do you get a list you can add to?</li>
</ul>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Viết Comparator cho sinh viên: GPA giảm dần, rồi tên tăng dần không phân biệt hoa thường.</li>
<li><code>Collections.binarySearch</code> trả về −5. Khoá sẽ được chèn ở vị trí nào?</li>
<li>Vì sao <code>Arrays.asList(arr).add(x)</code> ném ngoại lệ, và làm sao có danh sách thêm phần tử được?</li>
</ul>`),
    books([
      ['horstmann1', 'Ch. 6.1.8 "The Comparator Interface", Ch. 3.10.7 "Array Sorting" and Ch. 9.6 "Algorithms" (sorting and shuffling, binary search, simple algorithms)', 'Mục 6.1.8 "The Comparator Interface", mục 3.10.7 "Array Sorting" và mục 9.6 "Algorithms" (sắp xếp và xáo trộn, tìm nhị phân, thuật toán đơn giản)'],
      ['javaTutorial', 'trail "Collections" — lesson "Algorithms"; "Object Ordering" (Comparable, Comparator)', 'trail "Collections" — bài "Algorithms"; "Object Ordering" (Comparable, Comparator)'],
      ['apiDocs', 'java.util.Collections, java.util.Arrays, java.util.Comparator, java.lang.Comparable', 'java.util.Collections, java.util.Arrays, java.util.Comparator, java.lang.Comparable'],
    ]),
  ].join('\n'),
};

/* ───────── 1.H — 🧪 Practice + 🗂 Glossary + 📌 Summary · Strings, arrays, sorting: PE question 4 and LAB211 input ───────── */
const L_on_ch1 = {
  title: '1.H — 🧪 Practice + 🗂 Glossary + 📌 Summary · Strings, arrays, sorting: PE question 4 and LAB211 input|||1.H — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Chuỗi, mảng, sắp xếp: câu 4 PE và nhập liệu LAB211',
  slug: 'pro192-on-ch1',
  type: 'VIDEO',
  description: '7 bài tập Chương 1 bám dạng đề PE PRO192 thật và LAB211, lời giải chạy thật trên JDK 8: câu 4 kiểu IString (đếm từ có chữ hoa và chữ số, đảo từng từ) với Main đọc như harness đề cho, từ dài nhất và trung bình chữ số chẵn, phần mở rộng và tên tệp mới từ đường dẫn, giải trọn câu 4 đề PE1 (viết tắt, đổi nhị phân không dùng hàm có sẵn), hàm nhập số có kiểm tra kiểu LAB211 với sắp xếp và tìm nhị phân, menu quản lý nhân viên sắp theo Comparator, bảng điểm chuẩn hoá tên; kèm bảng thuật ngữ Anh–Việt và tóm tắt chương.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.H · Practice &amp; review</span>
<h2>Seven exercises in the shape of the real PE and LAB211</h2>
<p class="lead">Chapter 1 gave you the language (1.D), numbers and strings (1.E–1.F) and the support classes (1.G). The PE never asks "what is a wrapper class?" — it asks you to <strong>write code</strong> that a given <code>Main</code> calls and compares character by character. Question 4 of most real papers is a pair of String functions; LAB211 opens every assignment with validated keyboard input and a sorted list. Try each exercise first (the time is a target for the exam room), then open the solution: every one was compiled with <code>--release 8</code> and run on a real JDK 8.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Lessons</th></tr></thead>
<tbody>
<tr><td>1</td><td>PE Q4 shape: implement an interface, split words, classify characters, build a string</td><td>1.E slide 13, 1.F slides 21–22, 27</td></tr>
<tr><td>2</td><td>longest word, digits inside a string, avoiding NaN</td><td>1.F slides 18, 27; 1.D slide 10</td></tr>
<tr><td>3</td><td>path → file name → extension with lastIndexOf/substring, "wrong format"</td><td>1.F slide 18</td></tr>
<tr><td>4</td><td>the real PE1 Q4: acronym, decimal → binary by hand</td><td>1.E slide 7, 1.F slide 22</td></tr>
<tr><td>5</td><td>LAB211 input loop with parseInt + try/catch, Arrays.sort / binarySearch</td><td>1.D slide 23, 1.G slides 13, 17</td></tr>
<tr><td>6</td><td>LAB211 menu: list of objects, validation with matches, Comparator, max</td><td>1.G slides 8–15</td></tr>
<tr><td>7</td><td>normalising names, String.format tables, ranking</td><td>1.F slides 27–28</td></tr>
</tbody>
</table>
<p>Real papers of this shape are in the Exam Room: <a href="/exam?course=PRO192&amp;kind=PE">PRO192 PE papers</a> — PE1, PE4, PE6, PE8, PE10, PE11 and PE14 all have a question 4 like exercises 1–4.</p>`,
    `<span class="eyebrow">Chương 1 · Bài 1.H · Thực hành &amp; ôn tập</span>
<h2>Bảy bài tập theo đúng dạng PE và LAB211 thật</h2>
<p class="lead">Chương 1 đã cho bạn ngôn ngữ (1.D), số và chuỗi (1.E–1.F) và các lớp hỗ trợ (1.G). Đề PE không bao giờ hỏi "lớp bao là gì?" — nó bắt bạn <strong>viết code</strong> để một lớp <code>Main</code> đề cho gọi tới và so từng ký tự. Câu 4 của phần lớn đề thật là một cặp hàm xử lý String; LAB211 mở đầu mọi bài bằng nhập bàn phím có kiểm tra và một danh sách được sắp xếp. Hãy tự làm từng bài trước (thời gian ghi kèm là mục tiêu cho phòng thi), rồi mới mở lời giải: bài nào cũng được biên dịch với <code>--release 8</code> và chạy trên JDK 8 thật.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Bài học</th></tr></thead>
<tbody>
<tr><td>1</td><td>dạng câu 4 PE: cài đặt interface, tách từ, phân loại ký tự, dựng chuỗi</td><td>1.E slide 13, 1.F slide 21–22, 27</td></tr>
<tr><td>2</td><td>từ dài nhất, chữ số trong chuỗi, tránh NaN</td><td>1.F slide 18, 27; 1.D slide 10</td></tr>
<tr><td>3</td><td>đường dẫn → tên tệp → phần mở rộng bằng lastIndexOf/substring, "wrong format"</td><td>1.F slide 18</td></tr>
<tr><td>4</td><td>câu 4 thật của đề PE1: viết tắt, đổi thập phân → nhị phân bằng tay</td><td>1.E slide 7, 1.F slide 22</td></tr>
<tr><td>5</td><td>vòng nhập kiểu LAB211 với parseInt + try/catch, Arrays.sort / binarySearch</td><td>1.D slide 23, 1.G slide 13, 17</td></tr>
<tr><td>6</td><td>menu LAB211: danh sách đối tượng, kiểm tra bằng matches, Comparator, max</td><td>1.G slide 8–15</td></tr>
<tr><td>7</td><td>chuẩn hoá tên, bảng String.format, xếp loại</td><td>1.F slide 27–28</td></tr>
</tbody>
</table>
<p>Đề thật dạng này có trong Exam Room: <a href="/exam?course=PRO192&amp;kind=PE">đề PE PRO192</a> — PE1, PE4, PE6, PE8, PE10, PE11 và PE14 đều có câu 4 giống bài 1–4.</p>`),
    bi(`<h3>🧪 Exercise 1 — PE question 4: f1 counts, f2 builds (~20 min)</h3>
<p>The interface <code>IString</code> is given (compiled) and must not be rewritten. In the default package write <code>MyString implements IString</code>: <strong>f1</strong> returns the number of words that contain at least one upper-case letter <em>and</em> at least one digit; <strong>f2</strong> returns the string in which every word is reversed, the order of the words is kept, and words are separated by exactly one space (word = a string without spaces). An empty or blank string gives 0 and "".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/48bf56ff41c570993c5f84821833b961b6f28101.svg" alt="The parts of a PE question 4: the given interface and Main, the class you write" loading="lazy" /><p class="chu-thich">🧩 The parts of a PE question 4: the given interface and Main, the class you write</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title PE question 4 — what is given, what you write, how it is graded
' The grader's Main only knows the interface; your class must match its method names exactly
interface IString &lt;&lt;given, compiled&gt;&gt; {
  + f1(str : String) : int
  + f2(str : String) : String
}
class MyString &lt;&lt;YOU write this&gt;&gt; {
  + f1(str : String) : int
  + f2(str : String) : String
  - helper methods you may add
}
class Main &lt;&lt;given&gt;&gt; {
  + {static} main(args : String[])
  reads TC (1 or 2) and a string,
  prints "OUTPUT:" then the result
}
MyString ..|&gt; IString
Main ..&gt; IString : IString t = new MyString()
note right of MyString
  default package, file MyString.java
  public class MyString implements IString
  exact names: f1, f2 (case-sensitive)
end note
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">class MyString implements IString {
    // f1: number of words that contain at least one UPPERCASE letter AND at least one digit
    @Override
    public int f1(String str) {
        if (str == null || str.trim().isEmpty()) return 0;
        int count = 0;
        for (String w : str.trim().split("\\\\s+")) {
            boolean coHoa = false, coSo = false;
            for (char c : w.toCharArray()) {
                if (Character.isUpperCase(c)) coHoa = true;
                if (Character.isDigit(c)) coSo = true;
            }
            if (coHoa &amp;&amp; coSo) count++;
        }
        return count;
    }

    // f2: reverse every word, keep the order of the words, one space between words
    @Override
    public String f2(String str) {
        if (str == null || str.trim().isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (String w : str.trim().split("\\\\s+")) {
            if (sb.length() &gt; 0) sb.append(' ');
            sb.append(new StringBuilder(w).reverse());
        }
        return sb.toString();
    }
}</code></pre>
<p>The Main of this file imitates the given harness — menu, TC, string, <code>OUTPUT:</code> — and was fed three test cases: <code>1</code> / <code>PRO192 is Java8 and se1801 or SE1801</code>; <code>2</code> / <code>  Hello   Java 8  world </code>; <code>1</code> / a blank line.</p>
<div class="out">1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
3<br>
------------------<br>
1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
olleH avaJ 8 dlrow<br>
------------------<br>
1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
0<br>
------------------</div>
<p>Why each line is written that way: <code>trim().split("\\\\s+")</code> survives leading, trailing and repeated spaces (the second test has all three); two <code>boolean</code> flags let one pass over the characters test both conditions; the reversed words go into one <code>StringBuilder</code> and the separator is added <em>before</em> every word except the first, so there is no trailing space. <code>se1801</code> is not counted (no upper-case letter), <code>Java8</code> is.</p>
<div class="pitfall">Exam traps: the class must be <code>public class MyString</code> in <code>MyString.java</code> in the default package; the method names are exactly <code>f1</code> and <code>f2</code>; never print inside f1/f2 — the given Main prints the returned value, an extra <code>println</code> breaks the comparison.</div>
</details>`,
    `<h3>🧪 Bài 1 — Câu 4 PE: f1 đếm, f2 dựng chuỗi (~20 phút)</h3>
<p>Interface <code>IString</code> đề cho sẵn (đã biên dịch), không được viết lại. Trong default package viết <code>MyString implements IString</code>: <strong>f1</strong> trả về số từ chứa ít nhất một chữ hoa <em>và</em> ít nhất một chữ số; <strong>f2</strong> trả về chuỗi trong đó mỗi từ bị đảo ngược, thứ tự các từ giữ nguyên, và giữa các từ đúng một dấu cách (từ = chuỗi không chứa dấu cách). Chuỗi rỗng hoặc toàn dấu cách cho 0 và "".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/48bf56ff41c570993c5f84821833b961b6f28101.svg" alt="Các phần của câu 4 PE: interface và Main đề cho, lớp bạn tự viết" loading="lazy" /><p class="chu-thich">🧩 Các phần của câu 4 PE: interface và Main đề cho, lớp bạn tự viết</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title PE question 4 — what is given, what you write, how it is graded
' Main của máy chấm chỉ biết interface; lớp của bạn phải khớp đúng tên phương thức
interface IString &lt;&lt;given, compiled&gt;&gt; {
  + f1(str : String) : int
  + f2(str : String) : String
}
class MyString &lt;&lt;YOU write this&gt;&gt; {
  + f1(str : String) : int
  + f2(str : String) : String
  - helper methods you may add
}
class Main &lt;&lt;given&gt;&gt; {
  + {static} main(args : String[])
  reads TC (1 or 2) and a string,
  prints "OUTPUT:" then the result
}
MyString ..|&gt; IString
Main ..&gt; IString : IString t = new MyString()
note right of MyString
  default package, file MyString.java
  public class MyString implements IString
  exact names: f1, f2 (case-sensitive)
end note
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class MyString implements IString {
    // f1: số từ chứa ít nhất một chữ HOA VÀ ít nhất một chữ số
    @Override
    public int f1(String str) {
        if (str == null || str.trim().isEmpty()) return 0;
        int count = 0;
        for (String w : str.trim().split("\\\\s+")) {
            boolean coHoa = false, coSo = false;
            for (char c : w.toCharArray()) {
                if (Character.isUpperCase(c)) coHoa = true;
                if (Character.isDigit(c)) coSo = true;
            }
            if (coHoa &amp;&amp; coSo) count++;
        }
        return count;
    }

    // f2: đảo từng từ, giữ thứ tự các từ, giữa các từ đúng một dấu cách
    @Override
    public String f2(String str) {
        if (str == null || str.trim().isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (String w : str.trim().split("\\\\s+")) {
            if (sb.length() &gt; 0) sb.append(' ');
            sb.append(new StringBuilder(w).reverse());
        }
        return sb.toString();
    }
}</code></pre>
<p>Main của file này bắt chước harness đề cho — menu, TC, chuỗi, <code>OUTPUT:</code> — và được nạp ba ca thử: <code>1</code> / <code>PRO192 is Java8 and se1801 or SE1801</code>; <code>2</code> / <code>  Hello   Java 8  world </code>; <code>1</code> / một dòng trống.</p>
<div class="out">1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
3<br>
------------------<br>
1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
olleH avaJ 8 dlrow<br>
------------------<br>
1. Test f1()<br>
2. Test f2()<br>
Enter TC (1 or 2): Enter a string:<br>
OUTPUT:<br>
0<br>
------------------</div>
<p>Vì sao từng dòng viết như vậy: <code>trim().split("\\\\s+")</code> chịu được dấu cách ở đầu, ở cuối và lặp nhiều lần (ca thứ hai có đủ cả ba); hai cờ <code>boolean</code> giúp một lượt duyệt ký tự kiểm được cả hai điều kiện; các từ đảo được đưa vào một <code>StringBuilder</code> và dấu cách được thêm <em>trước</em> mỗi từ trừ từ đầu, nên không dư dấu cách ở cuối. <code>se1801</code> không được đếm (không có chữ hoa), <code>Java8</code> thì có.</p>
<div class="pitfall">Bẫy phòng thi: lớp phải là <code>public class MyString</code> trong <code>MyString.java</code> ở default package; tên phương thức đúng là <code>f1</code> và <code>f2</code>; đừng in gì trong f1/f2 — Main đề cho in giá trị trả về, thêm một <code>println</code> là hỏng phép so sánh.</div>
</details>`),
    bi(`<h3>🧪 Exercise 2 — Longest word and the average of even digits (~15 min)</h3>
<p>Implement <code>IUtilities</code> (PE8 question 4 type): <code>getLengthOfLongestWord(sentence)</code> returns the length of the longest word (words separated by spaces); <code>calculateAverageValue(str)</code> returns the average of the <strong>even digits</strong> in <code>str</code> (0, 2, 4, 6, 8). Decide what to return when there is no even digit, and say why.</p>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre><code class="language-java">// release: 8
// Practice 2 (PE8 question 4 type): length of the longest word, and the average of the EVEN digits in a string
interface IUtilities {
    int getLengthOfLongestWord(String sentence);
    double calculateAverageValue(String str);
}

class MyUtilities implements IUtilities {
    @Override
    public int getLengthOfLongestWord(String sentence) {
        int max = 0;
        for (String w : sentence.trim().split("\\\\s+"))
            if (w.length() &gt; max) max = w.length();
        return max;
    }

    @Override
    public double calculateAverageValue(String str) {
        int tong = 0, dem = 0;
        for (int i = 0; i &lt; str.length(); i++) {
            char c = str.charAt(i);
            if (c &gt;= '0' &amp;&amp; c &lt;= '9' &amp;&amp; (c - '0') % 2 == 0) {   // '0' counts: 0 is even
                tong += c - '0';
                dem++;
            }
        }
        return dem == 0 ? 0 : (double) tong / dem;             // no even digit: avoid 0/0 = NaN
    }
}

public class Bai2SoTrongChuoi {
    public static void main(String[] args) {
        IUtilities u = new MyUtilities();
        String[] tests = {"Object oriented programming", "  a  bb ccc  ", "ab2c45x08", "no digits here", "1357"};
        for (String s : tests) {
            System.out.printf("[%s] -&gt; longest = %d, average of even digits = %.2f%n",
                s, u.getLengthOfLongestWord(s), u.calculateAverageValue(s));
        }
    }
}</code></pre>
<div class="out">[Object oriented programming] -&gt; longest = 11, average of even digits = 0.00<br>
[ &nbsp;a &nbsp;bb ccc &nbsp;] -&gt; longest = 3, average of even digits = 0.00<br>
[ab2c45x08] -&gt; longest = 9, average of even digits = 3.50<br>
[no digits here] -&gt; longest = 6, average of even digits = 0.00<br>
[1357] -&gt; longest = 4, average of even digits = 0.00</div>
<p>In <code>ab2c45x08</code> the even digits are 2, 4, 0, 8: (2 + 4 + 0 + 8) / 4 = 3.50 — note that <strong>0 is even</strong> and must be counted. <code>c - '0'</code> turns a digit character into its value; <code>(double) tong / dem</code> avoids integer division (deck 1.D slide 20). With no even digit, <code>0 / 0</code> on doubles would be <code>NaN</code> (deck 1.D slide 10) — the guard returns 0 instead; if a paper specifies another value (−1, "Not found"), follow the paper.</p>
</details>`,
    `<h3>🧪 Bài 2 — Từ dài nhất và trung bình các chữ số chẵn (~15 phút)</h3>
<p>Cài đặt <code>IUtilities</code> (dạng câu 4 đề PE8): <code>getLengthOfLongestWord(sentence)</code> trả về độ dài từ dài nhất (các từ cách nhau bằng dấu cách); <code>calculateAverageValue(str)</code> trả về trung bình các <strong>chữ số chẵn</strong> trong <code>str</code> (0, 2, 4, 6, 8). Tự quyết định trả về gì khi không có chữ số chẵn nào, và giải thích vì sao.</p>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre><code class="language-java">// release: 8
// Bài 2 (dạng câu 4 đề PE8): độ dài từ dài nhất, và trung bình các chữ số CHẴN trong chuỗi
interface IUtilities {
    int getLengthOfLongestWord(String sentence);
    double calculateAverageValue(String str);
}

class MyUtilities implements IUtilities {
    @Override
    public int getLengthOfLongestWord(String sentence) {
        int max = 0;
        for (String w : sentence.trim().split("\\\\s+"))
            if (w.length() &gt; max) max = w.length();
        return max;
    }

    @Override
    public double calculateAverageValue(String str) {
        int tong = 0, dem = 0;
        for (int i = 0; i &lt; str.length(); i++) {
            char c = str.charAt(i);
            if (c &gt;= '0' &amp;&amp; c &lt;= '9' &amp;&amp; (c - '0') % 2 == 0) {   // '0' cũng tính: 0 là số chẵn
                tong += c - '0';
                dem++;
            }
        }
        return dem == 0 ? 0 : (double) tong / dem;             // không có chữ số chẵn: tránh 0/0 = NaN
    }
}

public class Bai2SoTrongChuoi {
    public static void main(String[] args) {
        IUtilities u = new MyUtilities();
        String[] tests = {"Object oriented programming", "  a  bb ccc  ", "ab2c45x08", "no digits here", "1357"};
        for (String s : tests) {
            System.out.printf("[%s] -&gt; longest = %d, average of even digits = %.2f%n",
                s, u.getLengthOfLongestWord(s), u.calculateAverageValue(s));
        }
    }
}</code></pre>
<div class="out">[Object oriented programming] -&gt; longest = 11, average of even digits = 0.00<br>
[ &nbsp;a &nbsp;bb ccc &nbsp;] -&gt; longest = 3, average of even digits = 0.00<br>
[ab2c45x08] -&gt; longest = 9, average of even digits = 3.50<br>
[no digits here] -&gt; longest = 6, average of even digits = 0.00<br>
[1357] -&gt; longest = 4, average of even digits = 0.00</div>
<p>Trong <code>ab2c45x08</code> các chữ số chẵn là 2, 4, 0, 8: (2 + 4 + 0 + 8) / 4 = 3.50 — chú ý <strong>0 là số chẵn</strong> và phải được tính. <code>c - '0'</code> đổi ký tự chữ số thành giá trị; <code>(double) tong / dem</code> tránh chia nguyên (bài 1.D slide 20). Không có chữ số chẵn nào thì <code>0 / 0</code> trên số thực sẽ là <code>NaN</code> (bài 1.D slide 10) — câu điều kiện trả 0 thay vào đó; nếu đề quy định giá trị khác (−1, "Not found") thì làm theo đề.</p>
</details>`),
    bi(`<h3>🧪 Exercise 3 — From a path to an extension and a new file name (~15 min)</h3>
<p>Implement <code>IFile</code> (PE10 question 4 type): <code>f1(path)</code> returns the extension of the file the path points to; <code>f2(path)</code> returns <code>"New_"</code> + the file name in upper case. Both return <code>"wrong format"</code> when the file has no extension. The path may use <code>\\</code> (Windows) or <code>/</code>. Rule chosen for this exercise (a real paper would state its own): the file name is the text after the last separator, and it is valid when it contains a dot that is neither its first nor its last character.</p>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre><code class="language-java">// release: 8
// Practice 3 (PE10 question 4 type): file extension and "New_" + upper-case file name from a path, or "wrong format"
interface IFile {
    String f1(String str);
    String f2(String str);
}

class MyFile implements IFile {
    // the file name = the text after the last '/' or '\\'
    private String tenTep(String path) {
        int cat = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\\\'));
        return path.substring(cat + 1);
    }

    // valid when the name has a dot that is neither the first nor the last character
    private boolean hopLe(String ten) {
        int dot = ten.lastIndexOf('.');
        return dot &gt; 0 &amp;&amp; dot &lt; ten.length() - 1;
    }

    @Override
    public String f1(String str) {
        String ten = tenTep(str.trim());
        if (!hopLe(ten)) return "wrong format";
        return ten.substring(ten.lastIndexOf('.') + 1);
    }

    @Override
    public String f2(String str) {
        String ten = tenTep(str.trim());
        if (!hopLe(ten)) return "wrong format";
        return "New_" + ten.toUpperCase();
    }
}

public class Bai3DuongDan {
    public static void main(String[] args) {
        IFile f = new MyFile();
        String[] tests = {"C:\\\\data\\\\report.txt", "/home/an/photo.final.JPG", "notes", "D:/backup/archive.", ".gitignore", "a/b.c/readme"};
        for (String s : tests)
            System.out.printf("%-26s f1 = %-14s f2 = %s%n", s, f.f1(s), f.f2(s));
    }
}</code></pre>
<div class="out">C:\\data\\report.txt &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f1 = txt &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f2 = New_REPORT.TXT<br>
/home/an/photo.final.JPG &nbsp;&nbsp;f1 = JPG &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f2 = New_PHOTO.FINAL.JPG<br>
notes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f1 = wrong format &nbsp;&nbsp;f2 = wrong format<br>
D:/backup/archive. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f1 = wrong format &nbsp;&nbsp;f2 = wrong format<br>
.gitignore &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f1 = wrong format &nbsp;&nbsp;f2 = wrong format<br>
a/b.c/readme &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f1 = wrong format &nbsp;&nbsp;f2 = wrong format</div>
<p>The two tools are <code>lastIndexOf</code> and <code>substring</code>: the <em>last</em> separator gives the file name, the <em>last</em> dot gives the extension (<code>photo.final.JPG</code> → <code>JPG</code>). <code>Math.max</code> of the two <code>lastIndexOf</code> calls handles both separator styles at once; when there is none, −1 + 1 = 0 takes the whole string. The edge cases each test one rule: no dot (<code>notes</code>), a dot at the end (<code>archive.</code>), a dot at the start (<code>.gitignore</code>, a hidden file on Linux), and a dot only in a <em>folder</em> name (<code>b.c/readme</code>).</p>
<div class="pitfall">In a Java string a single backslash is written <code>"\\\\"</code>; <code>'\\\\'</code> is the backslash character.</div>
</details>`,
    `<h3>🧪 Bài 3 — Từ đường dẫn ra phần mở rộng và tên tệp mới (~15 phút)</h3>
<p>Cài đặt <code>IFile</code> (dạng câu 4 đề PE10): <code>f1(path)</code> trả về phần mở rộng của tệp mà đường dẫn trỏ tới; <code>f2(path)</code> trả về <code>"New_"</code> + tên tệp viết hoa. Cả hai trả <code>"wrong format"</code> khi tệp không có phần mở rộng. Đường dẫn có thể dùng <code>\\</code> (Windows) hoặc <code>/</code>. Luật chọn cho bài này (đề thật sẽ ghi luật của nó): tên tệp là phần chữ sau dấu phân cách cuối cùng, và hợp lệ khi nó chứa một dấu chấm không đứng đầu cũng không đứng cuối.</p>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre><code class="language-java">// release: 8
// Bài 3 (dạng câu 4 đề PE10): phần mở rộng và tên tệp "New_" + chữ hoa lấy từ một đường dẫn, hoặc "wrong format"
interface IFile {
    String f1(String str);
    String f2(String str);
}

class MyFile implements IFile {
    // tên tệp = phần chữ sau dấu '/' hoặc '\\' cuối cùng
    private String tenTep(String path) {
        int cat = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\\\'));
        return path.substring(cat + 1);
    }

    // hợp lệ khi tên có dấu chấm không đứng đầu cũng không đứng cuối
    private boolean hopLe(String ten) {
        int dot = ten.lastIndexOf('.');
        return dot &gt; 0 &amp;&amp; dot &lt; ten.length() - 1;
    }

    @Override
    public String f1(String str) {
        String ten = tenTep(str.trim());
        if (!hopLe(ten)) return "wrong format";
        return ten.substring(ten.lastIndexOf('.') + 1);
    }

    @Override
    public String f2(String str) {
        String ten = tenTep(str.trim());
        if (!hopLe(ten)) return "wrong format";
        return "New_" + ten.toUpperCase();
    }
}

public class Bai3DuongDan {
    public static void main(String[] args) {
        IFile f = new MyFile();
        String[] tests = {"C:\\\\data\\\\report.txt", "/home/an/photo.final.JPG", "notes", "D:/backup/archive.", ".gitignore", "a/b.c/readme"};
        for (String s : tests)
            System.out.printf("%-26s f1 = %-14s f2 = %s%n", s, f.f1(s), f.f2(s));
    }
}</code></pre>
<div class="out">C:\\data\\report.txt &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f1 = txt &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f2 = New_REPORT.TXT<br>
/home/an/photo.final.JPG &nbsp;&nbsp;f1 = JPG &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f2 = New_PHOTO.FINAL.JPG<br>
notes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f1 = wrong format &nbsp;&nbsp;f2 = wrong format<br>
D:/backup/archive. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f1 = wrong format &nbsp;&nbsp;f2 = wrong format<br>
.gitignore &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f1 = wrong format &nbsp;&nbsp;f2 = wrong format<br>
a/b.c/readme &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f1 = wrong format &nbsp;&nbsp;f2 = wrong format</div>
<p>Hai công cụ là <code>lastIndexOf</code> và <code>substring</code>: dấu phân cách <em>cuối cùng</em> cho tên tệp, dấu chấm <em>cuối cùng</em> cho phần mở rộng (<code>photo.final.JPG</code> → <code>JPG</code>). <code>Math.max</code> của hai lời gọi <code>lastIndexOf</code> xử lý cùng lúc cả hai kiểu dấu phân cách; khi không có cái nào, −1 + 1 = 0 lấy cả chuỗi. Mỗi ca biên thử một luật: không có dấu chấm (<code>notes</code>), dấu chấm ở cuối (<code>archive.</code>), dấu chấm ở đầu (<code>.gitignore</code>, tệp ẩn trên Linux), và dấu chấm chỉ nằm trong tên <em>thư mục</em> (<code>b.c/readme</code>).</p>
<div class="pitfall">Trong chuỗi Java một dấu gạch chéo ngược viết là <code>"\\\\"</code>; <code>'\\\\'</code> là ký tự gạch chéo ngược.</div>
</details>`),
    bi(`<h3>🧪 Exercise 4 — The real PE1 question 4: acronym and binary (~20 min)</h3>
<p>From paper PE1 (SP26): <code>buildAcronym(string)</code> returns "" for null or empty input, splits by one space, takes the first character of each word <em>if it is a letter A–Z or a–z</em>, upper-cases it, no spaces ("object oriented programming" → <code>OOP</code>, "123 data structure" → <code>DS</code>); <code>decimalToBinary(n)</code> (n ≥ 0) returns the binary digits, "0" for 0, <strong>without</strong> <code>Integer.toBinaryString()</code> (5 → <code>101</code>, 10 → <code>1010</code>).</p>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre><code class="language-java">// release: 8
// Practice 4 (the real PE1 question 4): buildAcronym and decimalToBinary WITHOUT Integer.toBinaryString — then checked against it
interface IStringNumberTool {
    String buildAcronym(String string);
    String decimalToBinary(int n);
}

class MyStringNumberTool implements IStringNumberTool {
    @Override
    public String buildAcronym(String string) {
        if (string == null || string.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (String w : string.split(" ")) {                   // the paper: "split the string by one space"
            if (w.isEmpty()) continue;
            char c = w.charAt(0);
            if ((c &gt;= 'a' &amp;&amp; c &lt;= 'z') || (c &gt;= 'A' &amp;&amp; c &lt;= 'Z'))  // letters A–Z / a–z only
                sb.append(Character.toUpperCase(c));
        }
        return sb.toString();
    }

    @Override
    public String decimalToBinary(int n) {
        if (n == 0) return "0";
        StringBuilder sb = new StringBuilder();
        while (n &gt; 0) {
            sb.append(n % 2);                                   // remainders give the bits from right to left
            n /= 2;
        }
        return sb.reverse().toString();
    }
}

public class Bai4NhiPhan {
    public static void main(String[] args) {
        IStringNumberTool t = new MyStringNumberTool();
        String[] samples = {"object oriented programming", "Java virtual machine", "123 data structure", "artificial intelligence", ""};
        for (String s : samples) System.out.println("\\"" + s + "\\" -&gt; \\"" + t.buildAcronym(s) + "\\"");
        System.out.println("5 -&gt; " + t.decimalToBinary(5) + ", 10 -&gt; " + t.decimalToBinary(10) + ", 0 -&gt; " + t.decimalToBinary(0));
        int sai = 0;
        for (int n = 0; n &lt;= 100000; n++)                       // self-check against the built-in (allowed for TESTING)
            if (!t.decimalToBinary(n).equals(Integer.toBinaryString(n))) sai++;
        System.out.println("checked 0..100000 against Integer.toBinaryString: " + sai + " mismatch(es)");
    }
}</code></pre>
<div class="out">"object oriented programming" -&gt; "OOP"<br>
"Java virtual machine" -&gt; "JVM"<br>
"123 data structure" -&gt; "DS"<br>
"artificial intelligence" -&gt; "AI"<br>
"" -&gt; ""<br>
5 -&gt; 101, 10 -&gt; 1010, 0 -&gt; 0<br>
checked 0..100000 against Integer.toBinaryString: 0 mismatch(es)</div>
<p>The four examples of the paper give exactly the expected results. <code>decimalToBinary</code> is the school method: divide by 2, collect the remainders, read them backwards — <code>sb.reverse()</code> does the "backwards". The letter test is written with ranges, not <code>Character.isLetter</code>, because the paper says A–Z/a–z (deck 1.E slide 13). The last line is how to <strong>test</strong> yourself: the forbidden built-in is fine in a checking loop that you delete before submitting — here 100,001 values, 0 mismatches.</p>
<p>Open the real paper with its given materials: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 PE1</a>.</p>
</details>`,
    `<h3>🧪 Bài 4 — Câu 4 thật của đề PE1: viết tắt và nhị phân (~20 phút)</h3>
<p>Từ đề PE1 (SP26): <code>buildAcronym(string)</code> trả "" khi đầu vào null hoặc rỗng, tách theo một dấu cách, lấy ký tự đầu của mỗi từ <em>nếu nó là chữ A–Z hoặc a–z</em>, viết hoa, không có dấu cách ("object oriented programming" → <code>OOP</code>, "123 data structure" → <code>DS</code>); <code>decimalToBinary(n)</code> (n ≥ 0) trả về các chữ số nhị phân, "0" khi n là 0, <strong>không</strong> dùng <code>Integer.toBinaryString()</code> (5 → <code>101</code>, 10 → <code>1010</code>).</p>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre><code class="language-java">// release: 8
// Bài 4 (câu 4 đề PE1 thật): buildAcronym và decimalToBinary KHÔNG dùng Integer.toBinaryString — rồi đối chiếu với nó
interface IStringNumberTool {
    String buildAcronym(String string);
    String decimalToBinary(int n);
}

class MyStringNumberTool implements IStringNumberTool {
    @Override
    public String buildAcronym(String string) {
        if (string == null || string.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (String w : string.split(" ")) {                   // đề: "tách chuỗi theo đúng một dấu cách"
            if (w.isEmpty()) continue;
            char c = w.charAt(0);
            if ((c &gt;= 'a' &amp;&amp; c &lt;= 'z') || (c &gt;= 'A' &amp;&amp; c &lt;= 'Z'))  // chỉ chữ A–Z / a–z
                sb.append(Character.toUpperCase(c));
        }
        return sb.toString();
    }

    @Override
    public String decimalToBinary(int n) {
        if (n == 0) return "0";
        StringBuilder sb = new StringBuilder();
        while (n &gt; 0) {
            sb.append(n % 2);                                   // số dư cho các bit từ phải sang trái
            n /= 2;
        }
        return sb.reverse().toString();
    }
}

public class Bai4NhiPhan {
    public static void main(String[] args) {
        IStringNumberTool t = new MyStringNumberTool();
        String[] samples = {"object oriented programming", "Java virtual machine", "123 data structure", "artificial intelligence", ""};
        for (String s : samples) System.out.println("\\"" + s + "\\" -&gt; \\"" + t.buildAcronym(s) + "\\"");
        System.out.println("5 -&gt; " + t.decimalToBinary(5) + ", 10 -&gt; " + t.decimalToBinary(10) + ", 0 -&gt; " + t.decimalToBinary(0));
        int sai = 0;
        for (int n = 0; n &lt;= 100000; n++)                       // tự kiểm với hàm có sẵn (được phép khi THỬ)
            if (!t.decimalToBinary(n).equals(Integer.toBinaryString(n))) sai++;
        System.out.println("checked 0..100000 against Integer.toBinaryString: " + sai + " mismatch(es)");
    }
}</code></pre>
<div class="out">"object oriented programming" -&gt; "OOP"<br>
"Java virtual machine" -&gt; "JVM"<br>
"123 data structure" -&gt; "DS"<br>
"artificial intelligence" -&gt; "AI"<br>
"" -&gt; ""<br>
5 -&gt; 101, 10 -&gt; 1010, 0 -&gt; 0<br>
checked 0..100000 against Integer.toBinaryString: 0 mismatch(es)</div>
<p>Bốn ví dụ của đề cho đúng kết quả mong đợi. <code>decimalToBinary</code> là cách làm ở trường phổ thông: chia 2, gom số dư, đọc ngược — <code>sb.reverse()</code> lo phần "đọc ngược". Phép thử chữ cái viết bằng khoảng, không dùng <code>Character.isLetter</code>, vì đề ghi A–Z/a–z (bài 1.E slide 13). Dòng cuối là cách <strong>tự kiểm</strong>: hàm có sẵn bị cấm vẫn dùng được trong vòng lặp kiểm tra mà bạn xoá đi trước khi nộp — ở đây 100.001 giá trị, 0 chỗ lệch.</p>
<p>Mở đề thật kèm given materials: <a href="/exam?course=PRO192&amp;kind=PE">Exam Room → PRO192 PE1</a>.</p>
</details>`),
    bi(`<h3>🧪 Exercise 5 — LAB211 input that never crashes (~20 min)</h3>
<p>Write <code>nhapSo(prompt, min, max)</code> that keeps asking until the user types an integer in [min, max], printing why an input was rejected. Use it to read n (1..10) and n numbers in [−1000, 1000]; print the numbers, min, max and average (2 decimals), the sorted numbers (without changing the input order), then search a value with binary search and say where it is or where it would be inserted.</p>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">// keeps asking until the user types an integer in [min, max]
static int nhapSo(String loiNhac, int min, int max) {
    while (true) {
        System.out.print(loiNhac);
        String dong = sc.nextLine().trim();
        try {
            int x = Integer.parseInt(dong);
            if (x &gt;= min &amp;&amp; x &lt;= max) return x;
            System.out.println("  -&gt; out of range [" + min + ", " + max + "], try again");
        } catch (NumberFormatException e) {
            System.out.println("  -&gt; \\"" + dong + "\\" is not an integer, try again");
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">int n = nhapSo("Number of elements (1..10): ", 1, 10);
int[] a = new int[n];
for (int i = 0; i &lt; n; i++) a[i] = nhapSo("a[" + i + "] = ", -1000, 1000);
int min = Integer.MAX_VALUE, max = Integer.MIN_VALUE, tong = 0;
for (int x : a) { min = Math.min(min, x); max = Math.max(max, x); tong += x; }
System.out.println("Entered : " + Arrays.toString(a));
System.out.printf("min = %d, max = %d, average = %.2f%n", min, max, (double) tong / n);
int[] sapXep = Arrays.copyOf(a, n);              // sort a COPY, keep the input order
Arrays.sort(sapXep);
System.out.println("Sorted  : " + Arrays.toString(sapXep));
int k = nhapSo("Value to search: ", -1000, 1000);
int pos = Arrays.binarySearch(sapXep, k);
System.out.println(pos &gt;= 0 ? k + " found at index " + pos + " of the sorted array"
                            : k + " not found (it would be inserted at index " + (-pos - 1) + ")");</code></pre>
<p>Keyboard input, including wrong values on purpose: <code>abc</code>, <code>0</code>, <code>12</code>, <code>5</code>, then <code>7</code>, <code>-3</code>, <code>x</code>, <code>7</code>, <code>2000</code>, <code>10</code>, <code>0</code>, then <code>4</code> to search.</p>
<div class="out">Number of elements (1..10): &nbsp;&nbsp;-&gt; "abc" is not an integer, try again<br>
Number of elements (1..10): &nbsp;&nbsp;-&gt; out of range [1, 10], try again<br>
Number of elements (1..10): &nbsp;&nbsp;-&gt; out of range [1, 10], try again<br>
Number of elements (1..10): a[0] = a[1] = a[2] = &nbsp;&nbsp;-&gt; "x" is not an integer, try again<br>
a[2] = a[3] = &nbsp;&nbsp;-&gt; out of range [-1000, 1000], try again<br>
a[3] = a[4] = Entered : [7, -3, 7, 10, 0]<br>
min = -3, max = 10, average = 4.20<br>
Sorted &nbsp;: [-3, 0, 7, 7, 10]<br>
Value to search: 4 not found (it would be inserted at index 2)</div>
<p>The loop is the LAB211 pattern you will reuse in every assignment: read a whole line, <code>trim</code>, <code>parseInt</code> inside <code>try</code>, check the range, otherwise explain and repeat — the program never ends with a red stack trace. <code>Arrays.copyOf</code> before <code>Arrays.sort</code> keeps the original order for "Entered". The search result for 4 is negative, and <code>-pos - 1</code> = 2 is where 4 would go (deck 1.G slide 13). (The prompts run together because input comes from a file — in NetBeans you see each typed value.)</p>
</details>`,
    `<h3>🧪 Bài 5 — Nhập liệu kiểu LAB211 không bao giờ sập (~20 phút)</h3>
<p>Viết <code>nhapSo(lờiNhắc, min, max)</code> hỏi lại tới khi người dùng gõ một số nguyên trong [min, max], có in lý do khi từ chối. Dùng nó đọc n (1..10) và n số trong [−1000, 1000]; in các số, min, max và trung bình (2 chữ số thập phân), dãy đã sắp (không làm đổi thứ tự nhập), rồi tìm một giá trị bằng tìm nhị phân và nói nó ở đâu hoặc sẽ được chèn vào đâu.</p>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">// hỏi lại tới khi người dùng gõ một số nguyên trong [min, max]
static int nhapSo(String loiNhac, int min, int max) {
    while (true) {
        System.out.print(loiNhac);
        String dong = sc.nextLine().trim();
        try {
            int x = Integer.parseInt(dong);
            if (x &gt;= min &amp;&amp; x &lt;= max) return x;
            System.out.println("  -&gt; out of range [" + min + ", " + max + "], try again");
        } catch (NumberFormatException e) {
            System.out.println("  -&gt; \\"" + dong + "\\" is not an integer, try again");
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">int n = nhapSo("Number of elements (1..10): ", 1, 10);
int[] a = new int[n];
for (int i = 0; i &lt; n; i++) a[i] = nhapSo("a[" + i + "] = ", -1000, 1000);
int min = Integer.MAX_VALUE, max = Integer.MIN_VALUE, tong = 0;
for (int x : a) { min = Math.min(min, x); max = Math.max(max, x); tong += x; }
System.out.println("Entered : " + Arrays.toString(a));
System.out.printf("min = %d, max = %d, average = %.2f%n", min, max, (double) tong / n);
int[] sapXep = Arrays.copyOf(a, n);              // sắp một BẢN SAO, giữ nguyên thứ tự nhập
Arrays.sort(sapXep);
System.out.println("Sorted  : " + Arrays.toString(sapXep));
int k = nhapSo("Value to search: ", -1000, 1000);
int pos = Arrays.binarySearch(sapXep, k);
System.out.println(pos &gt;= 0 ? k + " found at index " + pos + " of the sorted array"
                            : k + " not found (it would be inserted at index " + (-pos - 1) + ")");</code></pre>
<p>Dữ liệu bàn phím, có cố ý gõ sai: <code>abc</code>, <code>0</code>, <code>12</code>, <code>5</code>, rồi <code>7</code>, <code>-3</code>, <code>x</code>, <code>7</code>, <code>2000</code>, <code>10</code>, <code>0</code>, rồi <code>4</code> để tìm.</p>
<div class="out">Number of elements (1..10): &nbsp;&nbsp;-&gt; "abc" is not an integer, try again<br>
Number of elements (1..10): &nbsp;&nbsp;-&gt; out of range [1, 10], try again<br>
Number of elements (1..10): &nbsp;&nbsp;-&gt; out of range [1, 10], try again<br>
Number of elements (1..10): a[0] = a[1] = a[2] = &nbsp;&nbsp;-&gt; "x" is not an integer, try again<br>
a[2] = a[3] = &nbsp;&nbsp;-&gt; out of range [-1000, 1000], try again<br>
a[3] = a[4] = Entered : [7, -3, 7, 10, 0]<br>
min = -3, max = 10, average = 4.20<br>
Sorted &nbsp;: [-3, 0, 7, 7, 10]<br>
Value to search: 4 not found (it would be inserted at index 2)</div>
<p>Vòng lặp này là mẫu LAB211 bạn sẽ dùng lại ở mọi bài: đọc cả dòng, <code>trim</code>, <code>parseInt</code> trong <code>try</code>, kiểm tra miền giá trị, sai thì giải thích rồi hỏi lại — chương trình không bao giờ kết thúc bằng khối chữ đỏ. <code>Arrays.copyOf</code> trước <code>Arrays.sort</code> giữ nguyên thứ tự gốc cho dòng "Entered". Kết quả tìm 4 là số âm, và <code>-pos - 1</code> = 2 là chỗ 4 sẽ được chèn (bài 1.G slide 13). (Các lời nhắc nằm sát nhau vì dữ liệu đến từ tệp — trong NetBeans bạn thấy từng giá trị đã gõ.)</p>
</details>`),
    bi(`<h3>🧪 Exercise 6 — A LAB211 menu over a list of employees (~30 min)</h3>
<p>Class <code>NhanVien</code> (id, name, salary, getters, <code>toString</code> with <code>String.format</code>). Menu: 1 Add — id must match "E + 3 digits" (accept lower case, store upper case), must be unique, salary a positive integer; 2 List sorted by salary descending, then id ascending, without changing the stored order; 3 Search by part of the name, ignoring case; 4 Statistics — count, total, average, the highest-paid employee; 5 Exit; any other choice is rejected.</p>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">class NhanVien {
    private String id;
    private String name;
    private int salary;

    public NhanVien(String id, String name, int salary) { this.id = id; this.name = name; this.salary = salary; }
    public String getId() { return id; }
    public String getName() { return name; }
    public int getSalary() { return salary; }

    @Override
    public String toString() { return String.format("%-6s %-18s %8d", id, name, salary); }
}</code></pre>
<pre class="trich"><code class="language-java">static final Comparator&lt;NhanVien&gt; LUONG_GIAM_MA_TANG = new Comparator&lt;NhanVien&gt;() {
    @Override
    public int compare(NhanVien a, NhanVien b) {
        int c = Integer.compare(b.getSalary(), a.getSalary());   // b before a: descending
        return c != 0 ? c : a.getId().compareTo(b.getId());
    }
};

static void them() {
    System.out.print("ID (E + 3 digits): ");
    String id = sc.nextLine().trim().toUpperCase();
    if (!id.matches("E\\\\d{3}")) { System.out.println("  -&gt; invalid ID format"); return; }
    for (NhanVien nv : ds)
        if (nv.getId().equals(id)) { System.out.println("  -&gt; ID already exists"); return; }
    System.out.print("Name: ");
    String name = sc.nextLine().trim();
    System.out.print("Salary: ");
    int salary;
    try { salary = Integer.parseInt(sc.nextLine().trim()); }
    catch (NumberFormatException e) { System.out.println("  -&gt; salary must be an integer"); return; }
    if (name.isEmpty() || salary &lt;= 0) { System.out.println("  -&gt; empty name or salary &lt;= 0"); return; }
    ds.add(new NhanVien(id, name, salary));
    System.out.println("  -&gt; added");
}

static void lietKe() {
    List&lt;NhanVien&gt; ban = new ArrayList&lt;NhanVien&gt;(ds);          // sort a copy: the stored order stays
    Collections.sort(ban, LUONG_GIAM_MA_TANG);
    for (NhanVien nv : ban) System.out.println(nv);
}

static void timTheoTen() {
    System.out.print("Name contains: ");
    String k = sc.nextLine().trim().toLowerCase();
    int dem = 0;
    for (NhanVien nv : ds)
        if (nv.getName().toLowerCase().contains(k)) { System.out.println(nv); dem++; }
    if (dem == 0) System.out.println("  -&gt; not found");
}

static void thongKe() {
    if (ds.isEmpty()) { System.out.println("  -&gt; empty list"); return; }
    NhanVien cao = Collections.max(ds, new Comparator&lt;NhanVien&gt;() {
        public int compare(NhanVien a, NhanVien b) { return Integer.compare(a.getSalary(), b.getSalary()); }
    });
    long tong = 0;
    for (NhanVien nv : ds) tong += nv.getSalary();
    System.out.printf("count = %d, total = %d, average = %.2f%nhighest: %s%n", ds.size(), tong, (double) tong / ds.size(), cao);
}

public static void main(String[] args) {
    while (true) {
        System.out.println("1.Add 2.List 3.Search 4.Statistics 5.Exit");
        System.out.print("Choose: ");
        String chon = sc.nextLine().trim();
        switch (chon) {                                       // switch on a String: Java 7+, fine on JDK 8
            case "1": them(); break;
            case "2": lietKe(); break;
            case "3": timTheoTen(); break;
            case "4": thongKe(); break;
            case "5": System.out.println("Bye"); return;
            default:  System.out.println("  -&gt; choose 1..5");
        }
    }
}</code></pre>
<p>Session typed: add E002 Tran Thi Binh 1500; add <code>e001</code> Nguyen Van An 1500; add <code>E1</code> (bad format); add E003 with salary <code>abc</code>; add E003 Le Van Cuong 2000; add E002 again (duplicate); list; search "van"; statistics; choice 9; exit.</p>
<div class="out">1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: ID (E + 3 digits): Name: Salary: &nbsp;&nbsp;-&gt; added<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: ID (E + 3 digits): Name: Salary: &nbsp;&nbsp;-&gt; added<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: ID (E + 3 digits): &nbsp;&nbsp;-&gt; invalid ID format<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: ID (E + 3 digits): Name: Salary: &nbsp;&nbsp;-&gt; salary must be an integer<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: ID (E + 3 digits): Name: Salary: &nbsp;&nbsp;-&gt; added<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: ID (E + 3 digits): &nbsp;&nbsp;-&gt; ID already exists<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: E003 &nbsp;&nbsp;Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2000<br>
E001 &nbsp;&nbsp;Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1500<br>
E002 &nbsp;&nbsp;Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1500<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: Name contains: E001 &nbsp;&nbsp;Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1500<br>
E003 &nbsp;&nbsp;Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2000<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: count = 3, total = 5000, average = 1666.67<br>
highest: E003 &nbsp;&nbsp;Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2000<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: &nbsp;&nbsp;-&gt; choose 1..5<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: Bye</div>
<p>Every tool comes from this chapter: <code>matches("E\\\\d{3}")</code> (regex, 1.F slide 26) validates the id; <code>equals</code> — never <code>==</code> — detects duplicates; a <code>Comparator</code> built with <code>Integer.compare</code> (no overflow, 1.G slide 11) sorts a <em>copy</em> of the list; <code>toLowerCase().contains</code> searches ignoring case; <code>Collections.max</code> with a salary comparator finds the top earner; <code>switch</code> on a String (Java 7+) drives the menu. E001 and E002 have the same salary, so the id decides their order.</p>
<div class="callout">🧭 <strong>Go further — LAB211 / PRJ301</strong>: this is the skeleton of LAB211's "management" programs; in PRJ301 the same list lives in a database table and the comparator becomes <code>ORDER BY salary DESC, id ASC</code>.</div>
</details>`,
    `<h3>🧪 Bài 6 — Menu LAB211 trên danh sách nhân viên (~30 phút)</h3>
<p>Lớp <code>NhanVien</code> (id, name, salary, getter, <code>toString</code> dùng <code>String.format</code>). Menu: 1 Thêm — mã phải khớp "E + 3 chữ số" (nhận chữ thường, lưu chữ hoa), không được trùng, lương là số nguyên dương; 2 Liệt kê theo lương giảm dần, rồi mã tăng dần, không làm đổi thứ tự đã lưu; 3 Tìm theo một phần của tên, không phân biệt hoa thường; 4 Thống kê — số người, tổng, trung bình, người lương cao nhất; 5 Thoát; lựa chọn khác bị từ chối.</p>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class NhanVien {
    private String id;
    private String name;
    private int salary;

    public NhanVien(String id, String name, int salary) { this.id = id; this.name = name; this.salary = salary; }
    public String getId() { return id; }
    public String getName() { return name; }
    public int getSalary() { return salary; }

    @Override
    public String toString() { return String.format("%-6s %-18s %8d", id, name, salary); }
}</code></pre>
<pre class="trich"><code class="language-java">static final Comparator&lt;NhanVien&gt; LUONG_GIAM_MA_TANG = new Comparator&lt;NhanVien&gt;() {
    @Override
    public int compare(NhanVien a, NhanVien b) {
        int c = Integer.compare(b.getSalary(), a.getSalary());   // b trước a: giảm dần
        return c != 0 ? c : a.getId().compareTo(b.getId());
    }
};

static void them() {
    System.out.print("ID (E + 3 digits): ");
    String id = sc.nextLine().trim().toUpperCase();
    if (!id.matches("E\\\\d{3}")) { System.out.println("  -&gt; invalid ID format"); return; }
    for (NhanVien nv : ds)
        if (nv.getId().equals(id)) { System.out.println("  -&gt; ID already exists"); return; }
    System.out.print("Name: ");
    String name = sc.nextLine().trim();
    System.out.print("Salary: ");
    int salary;
    try { salary = Integer.parseInt(sc.nextLine().trim()); }
    catch (NumberFormatException e) { System.out.println("  -&gt; salary must be an integer"); return; }
    if (name.isEmpty() || salary &lt;= 0) { System.out.println("  -&gt; empty name or salary &lt;= 0"); return; }
    ds.add(new NhanVien(id, name, salary));
    System.out.println("  -&gt; added");
}

static void lietKe() {
    List&lt;NhanVien&gt; ban = new ArrayList&lt;NhanVien&gt;(ds);          // sắp bản sao: thứ tự lưu giữ nguyên
    Collections.sort(ban, LUONG_GIAM_MA_TANG);
    for (NhanVien nv : ban) System.out.println(nv);
}

static void timTheoTen() {
    System.out.print("Name contains: ");
    String k = sc.nextLine().trim().toLowerCase();
    int dem = 0;
    for (NhanVien nv : ds)
        if (nv.getName().toLowerCase().contains(k)) { System.out.println(nv); dem++; }
    if (dem == 0) System.out.println("  -&gt; not found");
}

static void thongKe() {
    if (ds.isEmpty()) { System.out.println("  -&gt; empty list"); return; }
    NhanVien cao = Collections.max(ds, new Comparator&lt;NhanVien&gt;() {
        public int compare(NhanVien a, NhanVien b) { return Integer.compare(a.getSalary(), b.getSalary()); }
    });
    long tong = 0;
    for (NhanVien nv : ds) tong += nv.getSalary();
    System.out.printf("count = %d, total = %d, average = %.2f%nhighest: %s%n", ds.size(), tong, (double) tong / ds.size(), cao);
}

public static void main(String[] args) {
    while (true) {
        System.out.println("1.Add 2.List 3.Search 4.Statistics 5.Exit");
        System.out.print("Choose: ");
        String chon = sc.nextLine().trim();
        switch (chon) {                                       // switch trên String: từ Java 7, chạy trên JDK 8
            case "1": them(); break;
            case "2": lietKe(); break;
            case "3": timTheoTen(); break;
            case "4": thongKe(); break;
            case "5": System.out.println("Bye"); return;
            default:  System.out.println("  -&gt; choose 1..5");
        }
    }
}</code></pre>
<p>Phiên đã gõ: thêm E002 Tran Thi Binh 1500; thêm <code>e001</code> Nguyen Van An 1500; thêm <code>E1</code> (sai định dạng); thêm E003 với lương <code>abc</code>; thêm E003 Le Van Cuong 2000; thêm lại E002 (trùng); liệt kê; tìm "van"; thống kê; chọn 9; thoát.</p>
<div class="out">1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: ID (E + 3 digits): Name: Salary: &nbsp;&nbsp;-&gt; added<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: ID (E + 3 digits): Name: Salary: &nbsp;&nbsp;-&gt; added<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: ID (E + 3 digits): &nbsp;&nbsp;-&gt; invalid ID format<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: ID (E + 3 digits): Name: Salary: &nbsp;&nbsp;-&gt; salary must be an integer<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: ID (E + 3 digits): Name: Salary: &nbsp;&nbsp;-&gt; added<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: ID (E + 3 digits): &nbsp;&nbsp;-&gt; ID already exists<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: E003 &nbsp;&nbsp;Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2000<br>
E001 &nbsp;&nbsp;Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1500<br>
E002 &nbsp;&nbsp;Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1500<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: Name contains: E001 &nbsp;&nbsp;Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1500<br>
E003 &nbsp;&nbsp;Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2000<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: count = 3, total = 5000, average = 1666.67<br>
highest: E003 &nbsp;&nbsp;Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2000<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: &nbsp;&nbsp;-&gt; choose 1..5<br>
1.Add 2.List 3.Search 4.Statistics 5.Exit<br>
Choose: Bye</div>
<p>Mọi công cụ đều từ chương này: <code>matches("E\\\\d{3}")</code> (regex, 1.F slide 26) kiểm tra mã; <code>equals</code> — không bao giờ <code>==</code> — phát hiện trùng; một <code>Comparator</code> viết bằng <code>Integer.compare</code> (không tràn số, 1.G slide 11) sắp một <em>bản sao</em> của danh sách; <code>toLowerCase().contains</code> tìm không phân biệt hoa thường; <code>Collections.max</code> với comparator theo lương tìm người lương cao nhất; <code>switch</code> trên String (Java 7+) điều khiển menu. E001 và E002 cùng lương, nên mã quyết định thứ tự của họ.</p>
<div class="callout">🧭 <strong>Đi tiếp — LAB211 / PRJ301</strong>: đây là khung của các chương trình "quản lý" ở LAB211; ở PRJ301 cùng danh sách đó nằm trong một bảng cơ sở dữ liệu và comparator trở thành <code>ORDER BY salary DESC, id ASC</code>.</div>
</details>`),
    bi(`<h3>🧪 Exercise 7 — Normalised names and an aligned report (~15 min)</h3>
<p>Given names typed carelessly ("  nGUYEN   van  an ") and GPAs, print a framed table: number, normalised full name ("Nguyen Van An"), GPA with 2 decimals right-aligned, rank (Excellent ≥ 9, Very good ≥ 8, Good ≥ 6.5, Average ≥ 5, Weak), and the average row.</p>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">// "  nGUYEN   van  an " -&gt; "Nguyen Van An"
static String chuanHoaTen(String s) {
    StringBuilder sb = new StringBuilder();
    for (String w : s.trim().toLowerCase().split("\\\\s+")) {
        if (sb.length() &gt; 0) sb.append(' ');
        sb.append(Character.toUpperCase(w.charAt(0))).append(w.substring(1));
    }
    return sb.toString();
}</code></pre>
<pre class="trich"><code class="language-java">static String xepLoai(double d) {
    if (d &gt;= 9) return "Excellent";
    if (d &gt;= 8) return "Very good";
    if (d &gt;= 6.5) return "Good";
    if (d &gt;= 5) return "Average";
    return "Weak";
}</code></pre>
<pre class="trich"><code class="language-java">String[] ten = {"  nGUYEN   van  an ", "tran THI binh", " le van   cuong", "PHAM thu   ha  "};
double[] diem = {8.75, 9.0, 4.999, 6.5};
StringBuilder bang = new StringBuilder();
String vien = "+----+----------------------+-------+-----------+\\n";
bang.append(vien).append(String.format("| %-2s | %-20s | %5s | %-9s |%n", "No", "Full name", "GPA", "Rank")).append(vien);
double tong = 0;
for (int i = 0; i &lt; ten.length; i++) {
    bang.append(String.format("| %2d | %-20s | %5.2f | %-9s |%n", i + 1, chuanHoaTen(ten[i]), diem[i], xepLoai(diem[i])));
    tong += diem[i];
}
bang.append(vien).append(String.format("| %-27s | %5.2f | %-9s |%n", "Average", tong / ten.length, "")).append(vien);
System.out.print(bang);
System.out.println("note: 4.999 prints as 5.00 but ranks \\"" + xepLoai(4.999) + "\\" — rank on the value, not on the printed text");</code></pre>
<div class="out">+----+----------------------+-------+-----------+<br>
| No | Full name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;GPA | Rank &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
+----+----------------------+-------+-----------+<br>
| &nbsp;1 | Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;8.75 | Very good |<br>
| &nbsp;2 | Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;9.00 | Excellent |<br>
| &nbsp;3 | Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;5.00 | Weak &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
| &nbsp;4 | Pham Thu Ha &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;6.50 | Good &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
+----+----------------------+-------+-----------+<br>
| Average &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;7.31 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
+----+----------------------+-------+-----------+<br>
note: 4.999 prints as 5.00 but ranks "Weak" — rank on the value, not on the printed text</div>
<p>Normalising is <code>trim</code> + <code>toLowerCase</code> + <code>split("\\\\s+")</code>, then upper-case the first character of each word and append the rest — LAB211's "format a name" requirement in five lines. <code>%-20s</code> left-aligns text, <code>%5.2f</code> right-aligns numbers; the whole table is built in one <code>StringBuilder</code> and printed once. The last line is a real trap: 4.999 <em>prints</em> as 5.00 but is still below 5 — rank on the value, never on the formatted text.</p>
</details>`,
    `<h3>🧪 Bài 7 — Chuẩn hoá tên và bảng báo cáo thẳng hàng (~15 phút)</h3>
<p>Cho các tên gõ cẩu thả ("  nGUYEN   van  an ") và điểm GPA, in một bảng có khung: số thứ tự, họ tên đã chuẩn hoá ("Nguyen Van An"), GPA 2 chữ số thập phân căn phải, xếp loại (Excellent ≥ 9, Very good ≥ 8, Good ≥ 6.5, Average ≥ 5, Weak), và dòng trung bình.</p>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">// "  nGUYEN   van  an " -&gt; "Nguyen Van An"
static String chuanHoaTen(String s) {
    StringBuilder sb = new StringBuilder();
    for (String w : s.trim().toLowerCase().split("\\\\s+")) {
        if (sb.length() &gt; 0) sb.append(' ');
        sb.append(Character.toUpperCase(w.charAt(0))).append(w.substring(1));
    }
    return sb.toString();
}</code></pre>
<pre class="trich"><code class="language-java">static String xepLoai(double d) {
    if (d &gt;= 9) return "Excellent";
    if (d &gt;= 8) return "Very good";
    if (d &gt;= 6.5) return "Good";
    if (d &gt;= 5) return "Average";
    return "Weak";
}</code></pre>
<pre class="trich"><code class="language-java">String[] ten = {"  nGUYEN   van  an ", "tran THI binh", " le van   cuong", "PHAM thu   ha  "};
double[] diem = {8.75, 9.0, 4.999, 6.5};
StringBuilder bang = new StringBuilder();
String vien = "+----+----------------------+-------+-----------+\\n";
bang.append(vien).append(String.format("| %-2s | %-20s | %5s | %-9s |%n", "No", "Full name", "GPA", "Rank")).append(vien);
double tong = 0;
for (int i = 0; i &lt; ten.length; i++) {
    bang.append(String.format("| %2d | %-20s | %5.2f | %-9s |%n", i + 1, chuanHoaTen(ten[i]), diem[i], xepLoai(diem[i])));
    tong += diem[i];
}
bang.append(vien).append(String.format("| %-27s | %5.2f | %-9s |%n", "Average", tong / ten.length, "")).append(vien);
System.out.print(bang);
System.out.println("note: 4.999 prints as 5.00 but ranks \\"" + xepLoai(4.999) + "\\" — rank on the value, not on the printed text");</code></pre>
<div class="out">+----+----------------------+-------+-----------+<br>
| No | Full name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;GPA | Rank &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
+----+----------------------+-------+-----------+<br>
| &nbsp;1 | Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;8.75 | Very good |<br>
| &nbsp;2 | Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;9.00 | Excellent |<br>
| &nbsp;3 | Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;5.00 | Weak &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
| &nbsp;4 | Pham Thu Ha &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;6.50 | Good &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
+----+----------------------+-------+-----------+<br>
| Average &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;7.31 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br>
+----+----------------------+-------+-----------+<br>
note: 4.999 prints as 5.00 but ranks "Weak" — rank on the value, not on the printed text</div>
<p>Chuẩn hoá là <code>trim</code> + <code>toLowerCase</code> + <code>split("\\\\s+")</code>, rồi viết hoa ký tự đầu của mỗi từ và nối phần còn lại — yêu cầu "định dạng tên" của LAB211 trong năm dòng. <code>%-20s</code> căn trái chữ, <code>%5.2f</code> căn phải số; cả bảng được dựng trong một <code>StringBuilder</code> và in một lần. Dòng cuối là một bẫy thật: 4.999 <em>in ra</em> là 5.00 nhưng vẫn nhỏ hơn 5 — xếp loại theo giá trị, đừng bao giờ theo chữ đã định dạng.</p>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>identifier</strong></td><td>định danh (tên tự đặt)</td><td>A name you choose for a variable, method or class: letter, $ or _ first, case-sensitive.</td></tr>
<tr><td><strong>primitive type</strong></td><td>kiểu nguyên thủy</td><td>One of the eight non-object types (byte…double, char, boolean); the variable holds the value itself.</td></tr>
<tr><td><strong>reference</strong></td><td>tham chiếu</td><td>A variable that holds the address of an object on the heap, or null.</td></tr>
<tr><td><strong>heap / stack</strong></td><td>vùng nhớ heap / ngăn xếp</td><td>The heap stores objects and arrays; the stack stores method frames and their local variables.</td></tr>
<tr><td><strong>overflow</strong></td><td>tràn số</td><td>An integer result too big for its type wraps around silently, e.g. Integer.MAX_VALUE + 1.</td></tr>
<tr><td><strong>narrowing / widening</strong></td><td>thu hẹp / mở rộng kiểu</td><td>Widening (int → long) is automatic; narrowing (int → byte) needs an explicit cast and may lose data.</td></tr>
<tr><td><strong>cast</strong></td><td>ép kiểu</td><td>Writing (type) before a value to convert it, e.g. (double) sum / n.</td></tr>
<tr><td><strong>short-circuit</strong></td><td>đoản mạch</td><td><code>&amp;&amp;</code> and <code>||</code> skip the right operand when the left already decides the result.</td></tr>
<tr><td><strong>scope</strong></td><td>phạm vi</td><td>The part of the program where a declaration is visible; Java has class, method, block and loop scopes.</td></tr>
<tr><td><strong>wrapper class</strong></td><td>lớp bao</td><td>A class holding one primitive value (Integer, Double, Character…), final and immutable.</td></tr>
<tr><td><strong>autoboxing / unboxing</strong></td><td>tự đóng hộp / mở hộp</td><td>The compiler converts int ↔ Integer automatically (Java 5); unboxing null throws.</td></tr>
<tr><td><strong>immutable</strong></td><td>bất biến</td><td>An object whose state never changes after creation; String and the wrappers are immutable.</td></tr>
<tr><td><strong>string pool</strong></td><td>vùng chuỗi hằng</td><td>The JVM area where string literals are shared, so equal literals are one object.</td></tr>
<tr><td><strong>token / delimiter</strong></td><td>token / dấu phân cách</td><td>Scanner splits input into tokens separated by delimiters (white space by default).</td></tr>
<tr><td><strong>regular expression (regex)</strong></td><td>biểu thức chính quy</td><td>A pattern language used by split, replaceAll, matches and useDelimiter, e.g. "\\\\s+".</td></tr>
<tr><td><strong>format specifier</strong></td><td>đặc tả định dạng</td><td>A %… code in printf/String.format, e.g. %-10s, %5.2f, %05d.</td></tr>
<tr><td><strong>Comparable / Comparator</strong></td><td>giao diện so sánh</td><td>Comparable: one natural order inside the class (compareTo); Comparator: a separate ordering object (compare).</td></tr>
<tr><td><strong>binary search</strong></td><td>tìm kiếm nhị phân</td><td>Search in a sorted list by halving the range; returns -(insertion point) - 1 when absent.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>identifier</strong></td><td>định danh (tên tự đặt)</td><td>Cái tên bạn đặt cho biến, phương thức hay lớp: bắt đầu bằng chữ, $ hoặc _, phân biệt hoa thường.</td></tr>
<tr><td><strong>primitive type</strong></td><td>kiểu nguyên thủy</td><td>Một trong tám kiểu không phải đối tượng (byte…double, char, boolean); biến giữ chính giá trị.</td></tr>
<tr><td><strong>reference</strong></td><td>tham chiếu</td><td>Biến giữ địa chỉ của một đối tượng trên heap, hoặc null.</td></tr>
<tr><td><strong>heap / stack</strong></td><td>vùng nhớ heap / ngăn xếp</td><td>Heap chứa đối tượng và mảng; stack chứa khung của các lời gọi phương thức và biến cục bộ.</td></tr>
<tr><td><strong>overflow</strong></td><td>tràn số</td><td>Kết quả nguyên quá lớn so với kiểu thì quay vòng im lặng, vd Integer.MAX_VALUE + 1.</td></tr>
<tr><td><strong>narrowing / widening</strong></td><td>thu hẹp / mở rộng kiểu</td><td>Mở rộng (int → long) tự động; thu hẹp (int → byte) phải ép kiểu tường minh và có thể mất dữ liệu.</td></tr>
<tr><td><strong>cast</strong></td><td>ép kiểu</td><td>Viết (kiểu) trước một giá trị để đổi kiểu, vd (double) sum / n.</td></tr>
<tr><td><strong>short-circuit</strong></td><td>đoản mạch</td><td><code>&amp;&amp;</code> và <code>||</code> bỏ qua toán hạng phải khi vế trái đã quyết định kết quả.</td></tr>
<tr><td><strong>scope</strong></td><td>phạm vi</td><td>Phần chương trình nơi một khai báo được nhìn thấy; Java có phạm vi lớp, phương thức, khối và vòng lặp.</td></tr>
<tr><td><strong>wrapper class</strong></td><td>lớp bao</td><td>Lớp chứa một giá trị nguyên thủy (Integer, Double, Character…), final và bất biến.</td></tr>
<tr><td><strong>autoboxing / unboxing</strong></td><td>tự đóng hộp / mở hộp</td><td>Trình biên dịch tự đổi int ↔ Integer (Java 5); mở hộp null thì ném ngoại lệ.</td></tr>
<tr><td><strong>immutable</strong></td><td>bất biến</td><td>Đối tượng không bao giờ đổi trạng thái sau khi tạo; String và lớp bao là bất biến.</td></tr>
<tr><td><strong>string pool</strong></td><td>vùng chuỗi hằng</td><td>Vùng của JVM nơi các literal chuỗi được dùng chung, nên các literal bằng nhau là một đối tượng.</td></tr>
<tr><td><strong>token / delimiter</strong></td><td>token / dấu phân cách</td><td>Scanner chia dữ liệu thành các token ngăn bởi dấu phân cách (mặc định là khoảng trắng).</td></tr>
<tr><td><strong>regular expression (regex)</strong></td><td>biểu thức chính quy</td><td>Ngôn ngữ mẫu dùng bởi split, replaceAll, matches và useDelimiter, vd "\\\\s+".</td></tr>
<tr><td><strong>format specifier</strong></td><td>đặc tả định dạng</td><td>Mã %… trong printf/String.format, vd %-10s, %5.2f, %05d.</td></tr>
<tr><td><strong>Comparable / Comparator</strong></td><td>giao diện so sánh</td><td>Comparable: một thứ tự tự nhiên nằm trong lớp (compareTo); Comparator: một đối tượng thứ tự riêng (compare).</td></tr>
<tr><td><strong>binary search</strong></td><td>tìm kiếm nhị phân</td><td>Tìm trong danh sách đã sắp bằng cách chia đôi khoảng; trả -(vị trí chèn) - 1 khi không có.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 1</h2>
<ol>
<li><strong>Two kinds of variables.</strong> Primitives hold values; references hold addresses. <code>b = a</code> on arrays or objects copies the address — one object, two names.</li>
<li><strong>Java is strict where C is loose.</strong> Fixed sizes, silent overflow but no unchecked narrowing (cast!), boolean conditions only, operands evaluated left to right, no redeclaring a variable in an inner block, no global scope.</li>
<li><strong>Integer division and <code>%</code></strong> cut toward zero; cast one operand to <code>double</code> before dividing an average.</li>
<li><strong>Wrappers</strong> (Integer…) are final and immutable; autoboxing is compiler sugar — compare them with <code>equals</code>, never <code>==</code>, and beware unboxing <code>null</code>.</li>
<li><strong>Strings never change</strong>: assign the result (<code>s = s.trim()</code>); compare with <code>equals</code>; build text in loops with <code>StringBuilder</code>.</li>
<li><strong>Know the String toolbox</strong>: <code>charAt</code>, <code>indexOf</code>/<code>lastIndexOf</code>, <code>substring(begin, end)</code> (end excluded), <code>trim().split("\\\\s+")</code>, <code>replace</code> vs regex <code>replaceAll</code>, <code>String.format</code>.</li>
<li><strong>Read input robustly</strong>: <code>nextLine()</code> + <code>parseInt</code> in a <code>try</code>, check the range, ask again; print exactly the format the grader expects.</li>
<li><strong>Do not hand-write algorithms</strong> the platform has: <code>Collections</code>/<code>Arrays</code> sort, binarySearch (sorted only!), min/max, frequency — and teach them your order with a <code>Comparator</code> built on <code>Integer.compare</code>.</li>
</ol>
<div class="callout">🧭 <strong>Go further</strong>: LAB211 uses every item of this list from its first assignment; CSD201 re-implements sort and binary search so you know what <code>Collections.sort</code> does; Chapter 2 starts drawing your own classes on the heap.</div>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 1</h2>
<ol>
<li><strong>Hai loại biến.</strong> Kiểu nguyên thủy giữ giá trị; tham chiếu giữ địa chỉ. <code>b = a</code> với mảng hay đối tượng là chép địa chỉ — một đối tượng, hai cái tên.</li>
<li><strong>Java chặt chẽ ở chỗ C dễ dãi.</strong> Kích thước cố định, tràn số im lặng nhưng không cho thu hẹp ngầm (phải ép kiểu!), điều kiện phải là boolean, toán hạng tính trái sang phải, không khai báo lại biến trong khối con, không có phạm vi toàn cục.</li>
<li><strong>Chia nguyên và <code>%</code></strong> cắt về phía 0; ép một toán hạng sang <code>double</code> trước khi chia để tính trung bình.</li>
<li><strong>Lớp bao</strong> (Integer…) là final và bất biến; tự đóng hộp chỉ là "đường" của trình biên dịch — so sánh chúng bằng <code>equals</code>, không bao giờ <code>==</code>, và coi chừng mở hộp <code>null</code>.</li>
<li><strong>String không bao giờ đổi</strong>: gán kết quả (<code>s = s.trim()</code>); so sánh bằng <code>equals</code>; dựng văn bản trong vòng lặp bằng <code>StringBuilder</code>.</li>
<li><strong>Thuộc hộp đồ nghề String</strong>: <code>charAt</code>, <code>indexOf</code>/<code>lastIndexOf</code>, <code>substring(begin, end)</code> (bỏ end), <code>trim().split("\\\\s+")</code>, <code>replace</code> và <code>replaceAll</code> dùng regex, <code>String.format</code>.</li>
<li><strong>Nhập liệu chắc chắn</strong>: <code>nextLine()</code> + <code>parseInt</code> trong <code>try</code>, kiểm miền giá trị, hỏi lại; in đúng từng ký tự định dạng mà máy chấm chờ.</li>
<li><strong>Đừng tự viết thuật toán</strong> mà nền tảng đã có: <code>Collections</code>/<code>Arrays</code> sort, binarySearch (chỉ trên dãy đã sắp!), min/max, frequency — và dạy chúng thứ tự của bạn bằng một <code>Comparator</code> dùng <code>Integer.compare</code>.</li>
</ol>
<div class="callout">🧭 <strong>Đi tiếp</strong>: LAB211 dùng mọi điều trong danh sách này ngay từ bài đầu tiên; CSD201 tự cài lại sort và tìm nhị phân để bạn hiểu <code>Collections.sort</code> làm gì; Chương 2 bắt đầu vẽ các lớp của chính bạn trên heap.</div>`),
  ].join('\n'),
};

/* ───────── Lab 1 — 🏗️ CT Library: the first book catalogue (strings, ISBN-13, Comparator — LAB211 layers) ───────── */
const L_lab1 = {
  title: 'Lab 1 — 🏗️ CT Library: the first book catalogue (strings, ISBN-13, Comparator — LAB211 layers)|||Lab 1 — 🏗️ CT Library: danh mục sách đầu tiên (chuỗi, ISBN-13, Comparator — đúng tầng LAB211)',
  slug: 'pro192-lab-1-danh-muc-sach',
  type: 'VIDEO',
  description: 'Lab 1 của dự án CT Library (sau Chương 1), viết đúng chuẩn review LAB211 ngay từ đầu: menu console, chuẩn hoá tên sách Title Case, kiểm ISBN-13 với chữ số kiểm tra và bốn thông báo lỗi nói rõ sai ở đâu, chặn trùng ISBN, tìm theo một phần tên, sắp A–Z bằng Collections.sort + Comparator. Có starter (5 hàm TODO) và đáp án tải về, bộ chấm kiểu PE so từng dòng với expected.txt, đáp án qua lint.py + javac --release 8 + JDK 8 thật, slide giảng từng bước, bẫy == và nextInt có output thật, rubric 10 điểm.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lab 1 · CT Library</span>
<h2>Lab 1 — the first book catalogue</h2>
<p class="lead">This is the first of nine labs of <strong>CT Library</strong>, the app of the CuongThai reading club that grows with every chapter (Mục 0, lesson 0.2). Each lab is a ticket from your team lead, comes with a <strong>starter</strong> project, a PE-style <strong>grader</strong> that compares your output line by line with <code>expected.txt</code>, and a full <strong>solution</strong>. Every lab is written exactly the way the LAB211 reviewer wants it — so doing PRO192 labs <em>is</em> training for LAB211.</p>
<p>Plan about <strong>3 hours</strong>: 20 minutes to read the given code, 2 hours for the five TODOs, the rest to make <code>check.sh</code> print PASS and <code>lint.py</code> stay silent. Watch the slides first (below), then do the steps.</p>`,
    `<span class="eyebrow">Chương 1 · Lab 1 · CT Library</span>
<h2>Lab 1 — danh mục sách đầu tiên</h2>
<p class="lead">Đây là lab đầu tiên trong chín lab của <strong>CT Library</strong> — ứng dụng của câu lạc bộ đọc sách CuongThai, lớn dần sau mỗi chương (Mục 0, bài 0.2). Mỗi lab là một ticket (phiếu việc) của trưởng nhóm, kèm một dự án <strong>starter</strong> (khung làm sẵn), một <strong>bộ chấm</strong> kiểu đề PE so output của bạn từng dòng với <code>expected.txt</code>, và một <strong>đáp án</strong> đầy đủ. Lab nào cũng viết đúng kiểu thầy review LAB211 muốn — nên làm lab PRO192 <em>chính là</em> luyện LAB211.</p>
<p>Dành khoảng <strong>3 giờ</strong>: 20 phút đọc phần code cho sẵn, 2 giờ cho năm TODO, phần còn lại để <code>check.sh</code> in PASS và <code>lint.py</code> im lặng. Xem slide trước (ngay dưới), rồi làm theo từng bước.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 Lab 1 (17 slides)</h2>
<p>The deck of this lab, made for CT Library (it is not a school deck). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project, compiled with <code>javac --release 8</code> and run — the same runs you find in the steps below.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 Lab 1 (17 slide)</h2>
<p>Bộ slide của lab này, dựng riêng cho CT Library (không phải slide của trường). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ dự án thật, biên dịch bằng <code>javac --release 8</code> rồi chạy — đúng những lần chạy bạn gặp lại ở các bước bên dưới.</p>`),
    walk('lab1', [
      [1, 'Lab 1 — CT Library: the first book catalogue',
        `<p class="y-chinh">🎯 Lab 1 turns Chapter 1 — strings, arrays, Scanner, sorting with a Comparator — into a small but real program: a console book catalogue that cleans what people type and refuses what is wrong.</p>
<p>You will not write classes yet (that is Chapter 2 and Lab 2). The classes are given, already split into the nine packages the LAB211 reviewer expects. Your job is the logic inside five methods — the parts that need exactly what Chapter 1 taught: <code>trim</code>, <code>split</code>, <code>substring</code>, <code>StringBuilder</code>, <code>charAt</code>, <code>%</code>, <code>Collections.sort</code> and a <code>Comparator</code>.</p>`,
        `<p class="y-chinh">🎯 Lab 1 biến Chương 1 — chuỗi, mảng, Scanner, sắp xếp bằng Comparator — thành một chương trình nhỏ mà thật: danh mục sách trên console, biết làm sạch chữ người dùng gõ và từ chối chữ sai.</p>
<p>Bạn chưa phải viết lớp (đó là Chương 2 và Lab 2). Các lớp đã cho sẵn, chia đúng chín package mà thầy review LAB211 đòi. Việc của bạn là phần xử lý bên trong năm phương thức — đúng những thứ Chương 1 vừa dạy: <code>trim</code>, <code>split</code>, <code>substring</code>, <code>StringBuilder</code>, <code>charAt</code>, phép <code>%</code>, <code>Collections.sort</code> và một <code>Comparator</code> (bộ so sánh).</p>`],
      [2, 'Ticket CTL-1 — what the club asked for',
        `<p class="y-chinh">🎯 A ticket says WHAT is needed and HOW we will know it is done — five checks you can measure, not "make it work".</p>
<p>The club's spreadsheet is the problem: titles typed any way, ISBNs with a digit missing, the same book twice. The five acceptance checks: the grader prints <strong>PASS 77/77</strong>; the reviewer's tool <code>lint.py</code> finds <strong>0 violations</strong>; the code compiles with <code>javac --release 8</code> (the exam room has JDK 8); every wrong input gets a message and the program never crashes; and your Git history has at least three commits. In a company every pull request is judged the same way — by checks, not by feelings.</p>`,
        `<p class="y-chinh">🎯 Ticket nói CẦN GÌ và LÀM SAO BIẾT LÀ XONG — năm tiêu chí đo được, không phải "làm cho chạy".</p>
<p>Vấn đề là bảng tính của câu lạc bộ: tên sách gõ đủ kiểu, ISBN thiếu chữ số, một cuốn nhập hai lần. Năm tiêu chí nghiệm thu: bộ chấm in <strong>PASS 77/77</strong>; công cụ của thầy <code>lint.py</code> báo <strong>0 vi phạm</strong>; code biên dịch được với <code>javac --release 8</code> (phòng thi dùng JDK 8); mọi chữ gõ sai đều có thông báo và chương trình không bao giờ sập; lịch sử Git có ít nhất ba commit. Ở công ty, mọi pull request đều được duyệt đúng kiểu này — bằng phép kiểm, không bằng cảm giác.</p>`],
      [3, 'The program you will finish',
        `<p class="y-chinh">🎯 Four menu items, four sample books, and a session that types wrong things on purpose — that session is <code>harness/input.txt</code>.</p>
<p>The screenshot is the real beginning of the grader's run: <code>abc</code> at the menu gets "Lua chon phai la 1 so nguyen…", <code>7</code> gets "…tu 0 den 3", then <code>2</code> lists the four sample books sorted A–Z. The prompts look glued to the answers because the keyboard is a file: nothing is echoed. That is normal — the PE grader runs your program the same way.</p>`,
        `<p class="y-chinh">🎯 Bốn mục menu, bốn sách mẫu, và một phiên cố tình gõ sai — phiên đó chính là tệp <code>harness/input.txt</code>.</p>
<p>Ảnh là phần đầu thật của lần chạy bộ chấm: gõ <code>abc</code> ở menu nhận "Lua chon phai la 1 so nguyen…", gõ <code>7</code> nhận "…tu 0 den 3", rồi <code>2</code> liệt kê bốn sách mẫu theo A–Z. Câu nhắc trông dính vào câu trả lời vì bàn phím là một tệp: chữ gõ không được in lại. Chuyện bình thường — bộ chấm của đề PE cũng chạy chương trình của bạn đúng như vậy.</p>`],
      [4, 'Nine packages — the LAB211 reviewer checks this first',
        `<p class="y-chinh">🎯 Gate 1 of every LAB211 review is the package tree: <code>constants, controller, dto, main, model, repository, service, utils, view</code>. Wrong tree, no review.</p>
<p>Read the picture from the left. <strong>Main</strong> reads the keyboard and asks <strong>utils/Validation</strong> to check each line; it packs clean values into a DTO and calls the <strong>controller</strong> once. The controller holds the <strong>repository</strong> (the only class that keeps the list of <strong>model</strong> objects) and calls it for CRUD; it hands data to the <strong>service</strong> for business work (here: sorting); it gives the result to the <strong>view</strong>, which prints. Two red lines are forbidden: the controller never imports <code>model</code>, the service never holds a repository.</p>
<p class="meo">🧠 The same shape returns in LAB211, in PRJ301 (servlet = controller, JSP = view) and in Spring Boot (<code>@RestController</code>, <code>@Service</code>, <code>@Repository</code>). Learn it once.</p>`,
        `<p class="y-chinh">🎯 Cửa 1 của mọi lần review LAB211 là cây package: <code>constants, controller, dto, main, model, repository, service, utils, view</code>. Sai cây thì thầy không review.</p>
<p>Đọc hình từ trái. <strong>Main</strong> đọc bàn phím và nhờ <strong>utils/Validation</strong> kiểm từng dòng; gom giá trị sạch vào một DTO (phiếu dữ liệu) rồi gọi <strong>controller</strong> đúng một lần. Controller giữ <strong>repository</strong> (lớp duy nhất giữ danh sách các đối tượng <strong>model</strong>) và gọi nó để làm CRUD (thêm, đọc, sửa, xoá); đưa dữ liệu cho <strong>service</strong> làm nghiệp vụ (ở đây: sắp xếp); đưa kết quả cho <strong>view</strong> in ra. Hai đường đỏ bị cấm: controller không bao giờ import <code>model</code>, service không bao giờ giữ repository.</p>
<p class="meo">🧠 Đúng hình này quay lại ở LAB211, ở PRJ301 (servlet = controller, JSP = view) và ở Spring Boot (<code>@RestController</code>, <code>@Service</code>, <code>@Repository</code>). Học một lần, dùng mãi.</p>`],
      [5, 'The rules that get a lab rejected',
        `<p class="y-chinh">🎯 Seven rules, each with a reason you can say aloud at the review — the reviewer asks "why?" more often than "what?".</p>
<p>The controller holds the repository so that one place decides when data is saved; the service gets data as a parameter so it can be tested with any list. Only DTOs cross the controller, so the screen never touches the real objects. Every sentence lives in <code>Message</code> and every number in <code>Constants</code>: change a rule in one line. More than two parameters means "pack them into a DTO" (utils may take three, like <code>getChoice(input, min, max)</code>). A comment on every class, method and block is gate 3. No <code>System.exit</code>, no static variable in <code>Main</code>, and input is always read with <code>nextLine()</code>.</p>
<div class="pitfall"><p><strong>Real case (LAB211, 26/10):</strong> a student's <code>ConvertService</code> created its own repository and saved data inside the service. The reviewer: "CRUD must not be in the service — take every repository call out of the service and into the repository package." CT Library is written that way from Lab 1.</p></div>`,
        `<p class="y-chinh">🎯 Bảy luật, mỗi luật kèm một lý do nói thành lời được khi review — thầy hỏi "tại sao?" nhiều hơn hỏi "cái gì?".</p>
<p>Controller giữ repository để một chỗ duy nhất quyết định khi nào lưu dữ liệu; service nhận dữ liệu qua tham số nên thử được với bất kỳ danh sách nào. Chỉ DTO đi qua controller, nên màn hình không bao giờ chạm vào đối tượng thật. Mọi câu chữ nằm ở <code>Message</code>, mọi con số ở <code>Constants</code>: đổi luật chỉ sửa một dòng. Quá hai tham số nghĩa là "gói vào một DTO" (utils được ba, như <code>getChoice(input, min, max)</code>). Comment cho mọi lớp, phương thức và khối lệnh là cửa 3. Không <code>System.exit</code>, không biến static trong <code>Main</code>, và luôn đọc bằng <code>nextLine()</code>.</p>
<div class="pitfall"><p><strong>Chuyện thật (LAB211, 26/10):</strong> <code>ConvertService</code> của một bạn tự tạo repository và lưu dữ liệu ngay trong service. Thầy: "CRUD không được nằm trong service. Mấy cái repo gọi trong service đưa ra hết ngoài, đưa vào package repository." CT Library viết đúng như vậy ngay từ Lab 1.</p></div>`],
      [6, 'One request through the layers: "2 — list books"',
        `<p class="y-chinh">🎯 Follow one request and the layers stop being abstract: Main → controller → repository → service → view, each doing one job.</p>
<p>Main reads <code>2</code> and calls <code>showAllBooks()</code>. The controller asks the repository for <code>findAll()</code> — which returns <strong>copies</strong> (<code>BookResponseDTO</code>), never the real <code>Book</code> objects — and passes that list straight to <code>bookService.sortByTitle(...)</code>. Notice that the controller never declares a <code>Book</code> variable: it does not even import <code>model</code>. Then it calls <code>showResult</code>, which sets the view's fields and calls <code>display()</code> exactly once.</p>`,
        `<p class="y-chinh">🎯 Theo một yêu cầu đi qua là các tầng hết trừu tượng: Main → controller → repository → service → view, mỗi tầng một việc.</p>
<p>Main đọc <code>2</code> rồi gọi <code>showAllBooks()</code>. Controller hỏi repository <code>findAll()</code> — hàm trả về <strong>bản sao</strong> (<code>BookResponseDTO</code>), không bao giờ là đối tượng <code>Book</code> thật — và đưa thẳng danh sách đó vào <code>bookService.sortByTitle(...)</code>. Để ý: controller không hề khai báo biến kiểu <code>Book</code>, nó còn không import <code>model</code>. Cuối cùng gọi <code>showResult</code>: gán các trường của view rồi gọi <code>display()</code> đúng một lần.</p>`],
      [7, 'Your starter: all given except 5 method bodies',
        `<p class="y-chinh">🎯 The starter compiles and runs; five method bodies are placeholders marked <code>TODO Lab 1.x</code>. Read the given classes before writing anything.</p>
<p>TODO 1.1 is not code: make the folder a Git repository and commit after each step. 1.2 and 1.3 live in <code>Validation</code> (cleaning and checking what was typed), 1.4 and 1.5 in <code>BookRepository</code> (the list), 1.6 in <code>BookService</code> (sorting). In NetBeans, <em>Window → Action Items</em> lists every TODO with a click to jump there.</p>`,
        `<p class="y-chinh">🎯 Starter biên dịch và chạy được; năm thân phương thức chỉ là chỗ giữ đánh dấu <code>TODO Lab 1.x</code>. Đọc các lớp cho sẵn trước khi viết gì.</p>
<p>TODO 1.1 không phải code: biến thư mục thành kho Git và commit sau mỗi bước. 1.2 và 1.3 nằm trong <code>Validation</code> (làm sạch và kiểm chữ đã gõ), 1.4 và 1.5 trong <code>BookRepository</code> (danh sách), 1.6 trong <code>BookService</code> (sắp xếp). Trong NetBeans, <em>Window → Action Items</em> liệt kê mọi TODO, bấm là nhảy tới.</p>`],
      [8, 'TODO 1.2 — Title Case in four moves',
        `<p class="y-chinh">🎯 Clean a title in four moves: trim, split on one-or-more spaces, capitalise each word, join with single spaces in a <code>StringBuilder</code>.</p>
<p>The regex <code>\\s+</code> means "one or more whitespace characters", so three spaces between two words still give two words, not empty ones. For each word, <code>substring(0, 1).toUpperCase()</code> plus <code>substring(1).toLowerCase()</code>. The checks come in order: empty after trimming → "khong duoc de trong"; longer than 60 after cleaning → a message that shows both lengths. <code>StringBuilder</code> because <code>String</code> is immutable — <code>+=</code> in a loop builds a new string every turn, and checklist item 3.8 forbids it.</p>`,
        `<p class="y-chinh">🎯 Làm sạch tên sách trong bốn bước: trim, tách theo một-hay-nhiều dấu cách, viết hoa chữ đầu từng từ, nối lại bằng đúng một dấu cách trong <code>StringBuilder</code>.</p>
<p>Biểu thức chính quy (regex) <code>\\s+</code> nghĩa là "một hay nhiều ký tự trắng", nên ba dấu cách giữa hai từ vẫn cho hai từ, không sinh từ rỗng. Mỗi từ: <code>substring(0, 1).toUpperCase()</code> cộng <code>substring(1).toLowerCase()</code>. Kiểm theo thứ tự: rỗng sau khi trim → "khong duoc de trong"; dài hơn 60 sau khi làm sạch → thông báo ghi cả hai độ dài. Dùng <code>StringBuilder</code> vì <code>String</code> bất biến (immutable) — <code>+=</code> trong vòng lặp tạo chuỗi mới mỗi vòng, và mục 3.8 của tờ checklist cấm.</p>`],
      [9, 'TODO 1.3 — the ISBN-13 check digit, by hand',
        `<p class="y-chinh">🎯 The 13th digit of an ISBN-13 is computed from the first 12: weights 1, 3, 1, 3…, sum, then <code>(10 − sum % 10) % 10</code>. Do it once by hand before coding it.</p>
<p>For 978-0-13-235088-? the products are 9, 21, 8, 0, 1, 9, 2, 9, 5, 0, 8, 24 — sum 96, remainder 6, check digit 4. The outer <code>% 10</code> handles the case where the remainder is 0 (check digit 0, not 10). The real output shows the four messages in the order the code checks them: a wrong character with its position, the digit count, the 978/979 prefix, and the check digit — telling the user the digit it should be.</p>`,
        `<p class="y-chinh">🎯 Chữ số thứ 13 của ISBN-13 được tính từ 12 chữ số đầu: trọng số 1, 3, 1, 3…, cộng lại, rồi <code>(10 − tổng % 10) % 10</code>. Tự tính bằng tay một lần trước khi viết code.</p>
<p>Với 978-0-13-235088-? các tích là 9, 21, 8, 0, 1, 9, 2, 9, 5, 0, 8, 24 — tổng 96, dư 6, chữ số kiểm tra 4. Phép <code>% 10</code> bên ngoài lo trường hợp dư bằng 0 (chữ số kiểm tra là 0, không phải 10). Output thật cho thấy bốn thông báo đúng thứ tự code kiểm: ký tự sai kèm vị trí, số chữ số, tiền tố 978/979, và chữ số kiểm tra — nói luôn cho người dùng chữ số đúng phải là bao nhiêu.</p>`],
      [10, 'TODO 1.3 — the code, one loop per job',
        `<p class="y-chinh">🎯 Two loops, two jobs: the first collects digits and rejects bad characters; the second computes the weighted sum. Mixing them makes both harder to read and to debug.</p>
<p><code>Constants.DIGITS.indexOf(character)</code> turns a character into its value (0–9) or −1 — no <code>Character.isDigit</code>, which would also accept Arabic-Indic digits. All declarations sit at the top of the method and are initialised (checklist 2.6, 3.7); every <code>if</code> and <code>for</code> has a comment; the numbers 13, 3, 10 come from <code>Constants</code>. The error position is <code>i + 1</code> because people count from 1.</p>`,
        `<p class="y-chinh">🎯 Hai vòng lặp, hai việc: vòng đầu gom chữ số và từ chối ký tự lạ; vòng sau tính tổng có trọng số. Trộn hai việc vào một vòng thì cả đọc lẫn debug đều khó hơn.</p>
<p><code>Constants.DIGITS.indexOf(character)</code> đổi một ký tự thành giá trị của nó (0–9) hoặc −1 — không dùng <code>Character.isDigit</code> vì hàm đó nhận cả chữ số Ả Rập. Mọi khai báo nằm đầu phương thức và có giá trị khởi tạo (checklist 2.6, 3.7); mọi <code>if</code>, <code>for</code> có comment; các số 13, 3, 10 lấy từ <code>Constants</code>. Vị trí lỗi là <code>i + 1</code> vì con người đếm từ 1.</p>`],
      [11, 'TODO 1.4 — the repository refuses a duplicate ISBN',
        `<p class="y-chinh">🎯 "Is this ISBN already taken?" can only be answered by the object that holds the list — so the duplicate check lives in <code>BookRepository.addBook</code>, not in <code>Validation</code>.</p>
<p><code>findByIsbn</code> (given, private) walks the list comparing with <code>equals</code>. If it finds a book, <code>addBook</code> throws an <code>Exception</code> whose message names the book that owns the ISBN; the controller catches it and shows it. Nothing is added. Throwing (instead of returning <code>false</code>) lets the reason travel up with the error.</p>`,
        `<p class="y-chinh">🎯 Câu hỏi "ISBN này đã có chưa?" chỉ đối tượng đang giữ danh sách mới trả lời được — nên phần chặn trùng nằm ở <code>BookRepository.addBook</code>, không ở <code>Validation</code>.</p>
<p><code>findByIsbn</code> (cho sẵn, private) duyệt danh sách và so bằng <code>equals</code>. Tìm thấy thì <code>addBook</code> ném (throw) một <code>Exception</code> có thông báo nêu tên cuốn sách đang giữ ISBN đó; controller bắt lại và đưa cho view in. Không thêm gì. Ném lỗi (thay vì trả về <code>false</code>) để lý do đi lên cùng với lỗi.</p>`],
      [12, 'TODO 1.5 — search: part of the title, any case',
        `<p class="y-chinh">🎯 Case-insensitive search = compare lower case with lower case: <code>title.toLowerCase().contains(keyword.toLowerCase())</code>.</p>
<p>Lower-case the keyword once before the loop, not once per book. Each hit becomes a new <code>BookResponseDTO</code> through <code>toResponseDTO</code> — the caller gets copies, never the real books. The controller then sends the hits to the same <code>sortByTitle</code> as the full list: one sorting method, two uses.</p>`,
        `<p class="y-chinh">🎯 Tìm không phân biệt hoa thường = so chữ thường với chữ thường: <code>title.toLowerCase().contains(keyword.toLowerCase())</code>.</p>
<p>Đổi từ khoá sang chữ thường một lần trước vòng lặp, không phải mỗi cuốn một lần. Mỗi cuốn khớp được chép thành một <code>BookResponseDTO</code> mới qua <code>toResponseDTO</code> — nơi gọi nhận bản sao, không bao giờ nhận sách thật. Sau đó controller đưa kết quả vào đúng hàm <code>sortByTitle</code> dùng cho cả danh sách: một hàm sắp xếp, hai chỗ dùng.</p>`],
      [13, 'TODO 1.6 — a Comparator is "the rule for who goes first"',
        `<p class="y-chinh">🎯 A <code>Comparator</code> answers one question for two items: negative ⇒ the first goes first, zero ⇒ tie, positive ⇒ the second goes first. <code>Collections.sort</code> asks it as often as it needs.</p>
<p>Titles are compared with <code>compareToIgnoreCase</code>; on a tie the ISBN decides, so the order never depends on the order of insertion. The method sorts a <strong>copy</strong> (<code>new ArrayList&lt;&gt;(bookList)</code>) and then writes the row numbers 1, 2, 3… with <code>setNo</code> — numbering must come <em>after</em> sorting (a real bug in a LAB211 P0021 submission numbered first, then sorted, and showed "11, 10" in the wrong order).</p>`,
        `<p class="y-chinh">🎯 <code>Comparator</code> trả lời một câu hỏi cho hai phần tử: số âm ⇒ phần tử đầu đứng trước, bằng 0 ⇒ ngang nhau, số dương ⇒ phần tử sau đứng trước. <code>Collections.sort</code> hỏi nó bao nhiêu lần tuỳ ý.</p>
<p>Tên so bằng <code>compareToIgnoreCase</code>; trùng tên thì ISBN quyết định, để thứ tự không bao giờ phụ thuộc thứ tự thêm vào. Hàm sắp một <strong>bản sao</strong> (<code>new ArrayList&lt;&gt;(bookList)</code>) rồi mới ghi số thứ tự 1, 2, 3… bằng <code>setNo</code> — đánh số phải đi <em>sau</em> sắp xếp (một bài P0021 LAB211 thật đánh số trước rồi mới sắp, ra "11, 10" lộn thứ tự).</p>`],
      [14, 'The harness: red before your TODOs, green after',
        `<p class="y-chinh">🎯 <code>check.sh</code> runs your <code>Main</code> with <code>harness/input.txt</code> as the keyboard and compares every line with <code>expected.txt</code>: FAIL shows the first lines that differ, PASS means all 77 match.</p>
<p>On the untouched starter, line 10 already differs: the rows show number 0 and the insertion order — <code>sortByTitle</code> is still a placeholder. Fix one TODO at a time and run the grader again; the number of differing lines drops. In NetBeans the grader is <code>test/harness/CheckHarness.java</code> (Test Packages): right-click, <em>Run File</em>. Your real output is written to <code>harness/actual.txt</code> so you can compare it side by side.</p>`,
        `<p class="y-chinh">🎯 <code>check.sh</code> chạy <code>Main</code> của bạn với <code>harness/input.txt</code> làm bàn phím rồi so từng dòng với <code>expected.txt</code>: FAIL in những dòng khác đầu tiên, PASS nghĩa là khớp đủ 77 dòng.</p>
<p>Với starter chưa sửa gì, dòng 10 đã khác: các hàng có số thứ tự 0 và giữ thứ tự thêm vào — <code>sortByTitle</code> vẫn chỉ là chỗ giữ. Sửa từng TODO một rồi chạy lại bộ chấm; số dòng khác giảm dần. Trong NetBeans bộ chấm là <code>test/harness/CheckHarness.java</code> (Test Packages): chuột phải, <em>Run File</em>. Output thật của bạn được ghi vào <code>harness/actual.txt</code> để mở cạnh nhau mà so.</p>`],
      [15, 'Trap 1 — comparing the typed ISBN with ==',
        `<p class="y-chinh">🎯 <code>==</code> on two Strings compares references (are they the same object?), not characters. A string read from the keyboard is a new object, so <code>==</code> says <code>false</code> even with the same digits.</p>
<p>Two literals written in the source share one object in the <strong>string pool</strong>, which is why <code>==</code> seems to "work" in a quick test and then fails with real input. Always <code>equals</code> (or <code>equalsIgnoreCase</code>, <code>contains</code>). This is a favourite FE question and a favourite PE bug.</p>`,
        `<p class="y-chinh">🎯 <code>==</code> giữa hai String so tham chiếu (có phải cùng một đối tượng?), không so ký tự. Chuỗi đọc từ bàn phím là một đối tượng mới, nên <code>==</code> trả <code>false</code> dù cùng chữ số.</p>
<p>Hai hằng chuỗi viết trong mã nguồn dùng chung một đối tượng trong <strong>string pool</strong> (vùng chứa hằng chuỗi), vì vậy <code>==</code> có vẻ "chạy được" khi thử nhanh rồi hỏng với dữ liệu thật. Luôn dùng <code>equals</code> (hoặc <code>equalsIgnoreCase</code>, <code>contains</code>). Câu hỏi ruột của đề FE và lỗi ruột của bài PE.</p>`],
      [16, 'Trap 2 — nextInt() then nextLine(): an empty title',
        `<p class="y-chinh">🎯 <code>nextInt()</code> reads the number and leaves the Enter in the buffer; the next <code>nextLine()</code> eats that Enter and returns an empty string.</p>
<p>In the real run the user typed <code>1</code>, <code>Clean Code</code>, <code>2</code>: the title comes back <code>[]</code> and "Clean Code" only arrives with the next call. The LAB211 rule (and the <code>lint.py</code> INPUT rule) avoids the whole problem: read every line with <code>nextLine()</code> and convert with <code>Integer.parseInt</code> inside <code>try</code> — exactly what <code>Validation.getChoice</code> does.</p>`,
        `<p class="y-chinh">🎯 <code>nextInt()</code> đọc con số và để phím Enter lại trong bộ đệm; <code>nextLine()</code> ngay sau nuốt phím Enter đó và trả về chuỗi rỗng.</p>
<p>Trong lần chạy thật người dùng gõ <code>1</code>, <code>Clean Code</code>, <code>2</code>: tên sách ra <code>[]</code>, còn "Clean Code" tới lượt gọi sau mới đến. Luật LAB211 (và luật INPUT của <code>lint.py</code>) tránh hẳn chuyện này: đọc mọi dòng bằng <code>nextLine()</code> rồi đổi bằng <code>Integer.parseInt</code> trong <code>try</code> — đúng như <code>Validation.getChoice</code> làm.</p>`],
      [17, 'Rubric — 10 points, PE style',
        `<p class="y-chinh">🎯 Ten points: two for the structure, six for the five TODOs, one for the standards — and the harness decides the functional points, line by line.</p>
<p>Grade yourself honestly before opening the solution. Then answer the three self-check questions aloud, as you would at a LAB211 review — the answers are in the self-check section at the end of this page.</p>`,
        `<p class="y-chinh">🎯 Mười điểm: hai cho cấu trúc, sáu cho năm TODO, một cho chuẩn code — và bộ chấm quyết định phần chức năng, từng dòng một.</p>
<p>Tự chấm thật lòng trước khi mở đáp án. Rồi trả lời thành tiếng ba câu tự kiểm, như khi đứng trước thầy review LAB211 — đáp án ở mục Tự kiểm cuối trang.</p>`],
    ]),
    bi(`<h2>1. The ticket</h2>
<div class="callout"><p><strong>CTL-1 · CT Library · priority: high.</strong> "Our 300-member reading club keeps its books in a spreadsheet. Titles are typed any way (<code>"  clean    CODE "</code>), some ISBNs have a digit missing, and the same book was entered twice. Build a console catalogue: add a book (title + ISBN-13), list all books A–Z, search by part of the title. Clean every title. Refuse every wrong ISBN with a message that says exactly what is wrong. Never crash. Write it the way our LAB211 reviewer wants it." — the team lead</p></div>
<table>
<thead><tr><th>You need</th><th>From</th></tr></thead>
<tbody>
<tr><td><code>trim</code>, <code>split("\\\\s+")</code>, <code>substring</code>, <code>toUpperCase</code>/<code>toLowerCase</code>, <code>StringBuilder</code></td><td>1.F (String, StringBuilder)</td></tr>
<tr><td><code>charAt</code>, loops, <code>%</code>, <code>String.format</code></td><td>1.D (language basics), 1.F</td></tr>
<tr><td><code>Scanner.nextLine</code> + <code>Integer.parseInt</code> in <code>try</code></td><td>1.D slide 23, 1.H exercise 5</td></tr>
<tr><td><code>ArrayList</code>, <code>Collections.sort</code> + <code>Comparator</code></td><td>1.G, 1.H exercise 6</td></tr>
<tr><td>reading a small class (fields, getters)</td><td>1.A, 1.H exercise 6</td></tr>
</tbody>
</table>`,
    `<h2>1. Ticket</h2>
<div class="callout"><p><strong>CTL-1 · CT Library · ưu tiên: cao.</strong> "Câu lạc bộ đọc sách 300 thành viên của chúng ta quản lý sách bằng bảng tính. Tên sách gõ đủ kiểu (<code>"  clean    CODE "</code>), vài ISBN thiếu chữ số, có cuốn bị nhập hai lần. Làm một danh mục sách trên console: thêm sách (tên + ISBN-13), liệt kê mọi sách theo A–Z, tìm theo một phần tên. Làm sạch mọi tên sách. Từ chối mọi ISBN sai bằng một thông báo nói rõ sai ở đâu. Không bao giờ sập. Viết đúng kiểu thầy review LAB211 muốn." — trưởng nhóm</p></div>
<table>
<thead><tr><th>Bạn cần</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td><code>trim</code>, <code>split("\\\\s+")</code>, <code>substring</code>, <code>toUpperCase</code>/<code>toLowerCase</code>, <code>StringBuilder</code></td><td>1.F (String, StringBuilder)</td></tr>
<tr><td><code>charAt</code>, vòng lặp, <code>%</code>, <code>String.format</code></td><td>1.D (cú pháp cơ bản), 1.F</td></tr>
<tr><td><code>Scanner.nextLine</code> + <code>Integer.parseInt</code> trong <code>try</code></td><td>1.D slide 23, 1.H bài 5</td></tr>
<tr><td><code>ArrayList</code>, <code>Collections.sort</code> + <code>Comparator</code></td><td>1.G, 1.H bài 6</td></tr>
<tr><td>đọc một lớp nhỏ (trường, getter)</td><td>1.A, 1.H bài 6</td></tr>
</tbody>
</table>`),
    bi(`<h2>2. Requirements and acceptance criteria</h2>
<ol>
<li><strong>Menu</strong> <code>1</code> add · <code>2</code> list A–Z · <code>3</code> search · <code>0</code> exit; anything else → a message, then the menu asks again. Four sample books are loaded at start (from <code>Constants.SAMPLE_BOOK_ARRAY</code>).</li>
<li><strong>Title</strong>: trimmed, spaces between words collapsed to one, each word capitalised ("Title Case"); empty → error; longer than 60 characters after cleaning → error showing both lengths.</li>
<li><strong>ISBN-13</strong>: <code>-</code> and spaces may be typed and are dropped; any other non-digit → error naming the character and its position; not exactly 13 digits → error with the count; not starting with 978/979 → error; wrong check digit → error naming the correct digit. Stored as 13 digits.</li>
<li><strong>Duplicate ISBN</strong> → the book is not added; the message names the book that already has it.</li>
<li><strong>Search</strong> by part of the title, ignoring case; no hit → a message with the keyword.</li>
<li><strong>Lists</strong> (all books and search hits) sorted by title A–Z ignoring case, ties by ISBN, numbered 1, 2, 3… after sorting.</li>
<li><strong>Standards</strong>: the nine LAB211 packages; controller holds the repository; service holds no repository; controller does not import <code>model</code>; every text in <code>Message</code>, every number in <code>Constants</code>; Javadoc + a comment per block; ≤ 2 parameters (utils ≤ 3); lines ≤ 100 characters; no <code>System.exit</code>; only <code>nextLine()</code>.</li>
</ol>
<div class="callout ok"><p><strong>Done means (all five):</strong> <code>check.sh</code> prints <code>PASS: 77/77 dong khop expected.txt</code> · <code>python3 lint.py CTLibrary-Lab1</code> prints <code>✓ … — sạch</code> · <code>javac --release 8</code> compiles with no error · no input in <code>harness/input.txt</code> crashes the program · <code>git log --oneline</code> shows at least 3 commits.</p></div>`,
    `<h2>2. Yêu cầu và tiêu chí đạt</h2>
<ol>
<li><strong>Menu</strong> <code>1</code> thêm · <code>2</code> liệt kê A–Z · <code>3</code> tìm · <code>0</code> thoát; gõ thứ khác → có thông báo rồi hỏi lại. Bốn sách mẫu được nạp khi mở chương trình (từ <code>Constants.SAMPLE_BOOK_ARRAY</code>).</li>
<li><strong>Tên sách</strong>: bỏ dấu cách hai đầu, gộp dấu cách giữa các từ còn một, viết hoa chữ đầu mỗi từ ("Title Case"); rỗng → báo lỗi; dài hơn 60 ký tự sau khi làm sạch → báo lỗi ghi cả hai độ dài.</li>
<li><strong>ISBN-13</strong>: được gõ <code>-</code> và dấu cách, chúng bị bỏ đi; ký tự nào khác chữ số → báo lỗi nêu ký tự đó và vị trí; không đúng 13 chữ số → báo lỗi kèm số chữ số; không bắt đầu bằng 978/979 → báo lỗi; sai chữ số kiểm tra → báo lỗi nêu chữ số đúng. Lưu dạng 13 chữ số.</li>
<li><strong>Trùng ISBN</strong> → không thêm; thông báo nêu tên cuốn sách đang giữ ISBN đó.</li>
<li><strong>Tìm</strong> theo một phần tên, không phân biệt hoa thường; không có → thông báo kèm từ khoá.</li>
<li><strong>Danh sách</strong> (toàn bộ và kết quả tìm) sắp theo tên A–Z không phân biệt hoa thường, trùng tên thì theo ISBN, đánh số 1, 2, 3… sau khi sắp.</li>
<li><strong>Chuẩn code</strong>: đủ chín package LAB211; controller giữ repository; service không giữ repository; controller không import <code>model</code>; mọi câu chữ ở <code>Message</code>, mọi con số ở <code>Constants</code>; Javadoc + comment mỗi khối; ≤ 2 tham số (utils ≤ 3); dòng ≤ 100 ký tự; không <code>System.exit</code>; chỉ <code>nextLine()</code>.</li>
</ol>
<div class="callout ok"><p><strong>Xong nghĩa là (đủ cả năm):</strong> <code>check.sh</code> in <code>PASS: 77/77 dong khop expected.txt</code> · <code>python3 lint.py CTLibrary-Lab1</code> in <code>✓ … — sạch</code> · <code>javac --release 8</code> biên dịch không lỗi · không dòng gõ nào trong <code>harness/input.txt</code> làm chương trình sập · <code>git log --oneline</code> có ít nhất 3 commit.</p></div>`),
    bi(`<h2>3. Files</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab1-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab1-starter.zip</span><span class="lc-sub">NetBeans project (Java 8) · 5 TODO method bodies · harness/input.txt + expected.txt · CheckHarness · check.sh / check.bat</span></span>
<span class="lc-cta">Download</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab1-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab1-solution.zip</span><span class="lc-sub">the full solution — open it only after your own attempt</span></span>
<span class="lc-cta">Download</span>
</a>
<p>Unzip, then in NetBeans <em>File → Open Project</em> and pick the <code>CTLibrary-Lab1</code> folder. <em>Run</em> (F6) starts the menu. To grade: <em>Test Packages → harness → CheckHarness.java → right-click → Run File</em>, or from a terminal in the project folder:</p>
<pre><code class="language-bash">cd CTLibrary-Lab1
./check.sh                 # Windows: check.bat
git init
git add -A
git commit -m "Lab 1: starter"</code></pre>
<p>Project tree — every package the reviewer looks for:</p>
<pre><code class="language-plaintext">CTLibrary-Lab1/
  src/constants/   Message.java (every sentence) · Constants.java (every number, sample books)
  src/model/       Book.java                     (given — a JavaBean)
  src/dto/         BookRequestDTO.java · BookResponseDTO.java   (given)
  src/repository/  BookRepository.java           TODO 1.4, 1.5
  src/service/     BookService.java              TODO 1.6
  src/controller/  BookController.java           (given — read it first)
  src/view/        BookView.java                 (given)
  src/utils/       Validation.java               TODO 1.2, 1.3
  src/main/        Main.java                     (given — the menu)
  harness/         input.txt · expected.txt      (the grader's keyboard and answer key)
  test/harness/    CheckHarness.java             (the grader)</code></pre>`,
    `<h2>3. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab1-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab1-starter.zip</span><span class="lc-sub">dự án NetBeans (Java 8) · 5 thân hàm TODO · harness/input.txt + expected.txt · CheckHarness · check.sh / check.bat</span></span>
<span class="lc-cta">Tải về</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab1-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab1-solution.zip</span><span class="lc-sub">đáp án đầy đủ — chỉ mở sau khi đã tự làm</span></span>
<span class="lc-cta">Tải về</span>
</a>
<p>Giải nén, rồi trong NetBeans chọn <em>File → Open Project</em> và trỏ tới thư mục <code>CTLibrary-Lab1</code>. <em>Run</em> (F6) mở menu. Để chấm: <em>Test Packages → harness → CheckHarness.java → chuột phải → Run File</em>, hoặc mở terminal ở thư mục dự án:</p>
<pre><code class="language-bash">cd CTLibrary-Lab1
./check.sh                 # Windows: check.bat
git init
git add -A
git commit -m "Lab 1: starter"</code></pre>
<p>Cây dự án — đủ mọi package thầy tìm:</p>
<pre><code class="language-plaintext">CTLibrary-Lab1/
  src/constants/   Message.java (mọi câu chữ) · Constants.java (mọi con số, sách mẫu)
  src/model/       Book.java                     (cho sẵn — một JavaBean)
  src/dto/         BookRequestDTO.java · BookResponseDTO.java   (cho sẵn)
  src/repository/  BookRepository.java           TODO 1.4, 1.5
  src/service/     BookService.java              TODO 1.6
  src/controller/  BookController.java           (cho sẵn — đọc đầu tiên)
  src/view/        BookView.java                 (cho sẵn)
  src/utils/       Validation.java               TODO 1.2, 1.3
  src/main/        Main.java                     (cho sẵn — menu)
  harness/         input.txt · expected.txt      (bàn phím và đáp án của bộ chấm)
  test/harness/    CheckHarness.java             (bộ chấm)</code></pre>`),
    bi(`<h2>4. Step by step</h2>
<h4>Step 0 — read before you write (20 min)</h4>
<p>Open <code>Main</code>, then <code>BookController</code>, then <code>BookView</code>. Answer for yourself: which class owns the list? Who prints? How many times does a <code>case</code> call the controller? Then run the starter's grader once — you will see it FAIL; that is your starting point.</p>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">Dong 10:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: 1 &nbsp;&nbsp;&nbsp;9780134685991 &nbsp;Effective Java<br>
&nbsp;&nbsp;ban in : 0 &nbsp;&nbsp;&nbsp;9780135957059 &nbsp;The Pragmatic Programmer<br>
Dong 11:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: 2 &nbsp;&nbsp;&nbsp;9780596009205 &nbsp;Head First Java<br>
&nbsp;&nbsp;ban in : 0 &nbsp;&nbsp;&nbsp;9780134685991 &nbsp;Effective Java<br>
Dong 12:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: 3 &nbsp;&nbsp;&nbsp;9780321349606 &nbsp;Java Concurrency In Practice<br>
&nbsp;&nbsp;ban in : 0 &nbsp;&nbsp;&nbsp;9780321349606 &nbsp;Java Concurrency In Practice<br>
…</div>
<p>Line 10 is the first table row: the starter prints number 0 and keeps the insertion order. Nothing is broken except the five TODOs.</p>

<h4>Step 1 — TODO 1.1: Git (5 min)</h4>
<p>Initialise the repository (commands above), then commit after each of the steps below — <code>git commit -m "Lab 1.2: Title Case"</code> and so on. Small commits are what teams expect, and they let you go back when a change breaks the grader.</p>

<h4>Step 2 — TODO 1.2 <code>Validation.getTitle</code> (25 min)</h4>
<p>Clean the title as in slide 8. Hints, one at a time:</p>
<details><summary>Hint 1 — the steps</summary><p><code>trim()</code> → empty? throw <code>Message.ERROR_TITLE_EMPTY</code> → <code>split(Constants.REGEX_SPACES)</code> → for each word append a space (except before the first) and the word in Title Case → length check → <code>toString()</code>.</p></details>
<details><summary>Hint 2 — one word</summary><p><code>word.substring(0, 1).toUpperCase()</code> then <code>word.substring(1).toLowerCase()</code>. A one-letter word still works: <code>substring(1)</code> of "a" is "".</p></details>
<details><summary>Solution (the method in the solution project)</summary>
<pre class="trich"><code class="language-java">// Chuan hoa ten sach: bo dau cach thua, moi tu viet hoa chu dau (Title Case)
public static String getTitle(String input) throws Exception {
    // Ten bo dau cach 2 dau; bo noi cac tu da chuan hoa (khong dung String +=)
    String text = input.trim();
    StringBuilder titleBuilder = new StringBuilder();

    // Rong (hoac chi co dau cach) thi bao loi
    if (text.isEmpty()) {
        throw new Exception(Message.ERROR_TITLE_EMPTY);
    }

    // Tach theo 1 hay nhieu dau cach, chuan hoa tung tu
    for (String word : text.split(Constants.REGEX_SPACES)) {
        // Tu thu 2 tro di thi them 1 dau cach phia truoc
        if (titleBuilder.length() &gt; 0) {
            titleBuilder.append(Constants.SPACE);
        }

        // Chu dau viet hoa, phan con lai viet thuong
        titleBuilder.append(word.substring(0, 1).toUpperCase());
        titleBuilder.append(word.substring(1).toLowerCase());
    }

    // Ten da chuan hoa dai qua gioi han thi bao do dai
    if (titleBuilder.length() &gt; Constants.TITLE_MAX_LENGTH) {
        throw new Exception(String.format(Message.ERROR_TITLE_LENGTH, titleBuilder.length(),
                Constants.TITLE_MAX_LENGTH));
    }

    return titleBuilder.toString();
}</code></pre>
</details>

<h4>Step 3 — TODO 1.3 <code>Validation.getIsbn</code> (40 min)</h4>
<p>Four checks in this order, each with its own message from <code>Message</code>: character, length, prefix, check digit (slides 9–10). Work the example 978-0-13-235088-4 on paper first.</p>
<details><summary>Hint 1 — the first loop</summary><p>For <code>i</code> from 0: <code>char character = text.charAt(i)</code>. If <code>Constants.DIGITS.indexOf(character) &gt;= 0</code>, append it; else if it is not in <code>Constants.ISBN_SEPARATORS</code>, throw <code>String.format(Message.ERROR_ISBN_CHARACTER, character, i + 1)</code>.</p></details>
<details><summary>Hint 2 — the sum</summary><p>For the first 12 digits: odd index (<code>i % 2 == 1</code>) ⇒ add <code>digit * Constants.ISBN_ODD_WEIGHT</code>, even index ⇒ add <code>digit</code>. Then <code>checkDigit = (10 − sum % 10) % 10</code> with the 10 from <code>Constants.ISBN_MODULO</code>.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Kiem ISBN-13: bo dau - va dau cach, du 13 chu so, dau 978/979, dung chu so kiem tra
public static String getIsbn(String input) throws Exception {
    // Ban go, cac chu so gom duoc, tien to, tong co trong so, chu so kiem tra, chu so cuoi
    String text = input.trim();
    StringBuilder digitBuilder = new StringBuilder();
    String prefix = "";
    int weightedSum = 0;
    int checkDigit = 0;
    int lastDigit = 0;

    // Duyet tung ky tu: chu so thi giu, dau - / dau cach thi bo, con lai la loi
    for (int i = 0; i &lt; text.length(); i++) {
        // Ky tu dang xet
        char character = text.charAt(i);

        // Chu so thi giu lai
        if (Constants.DIGITS.indexOf(character) &gt;= 0) {
            digitBuilder.append(character);
        } else if (Constants.ISBN_SEPARATORS.indexOf(character) &lt; 0) {
            // Khong phai chu so cung khong phai dau ngan cach: chi ro ky tu va vi tri
            throw new Exception(String.format(Message.ERROR_ISBN_CHARACTER, character, i + 1));
        }
    }

    // Thieu hoac thua chu so thi bao so chu so dang co
    if (digitBuilder.length() != Constants.ISBN_LENGTH) {
        throw new Exception(String.format(Message.ERROR_ISBN_LENGTH, Constants.ISBN_LENGTH,
                digitBuilder.length()));
    }

    // Lay 3 chu so dau
    prefix = digitBuilder.substring(0, Constants.ISBN_PREFIX_LENGTH);

    // Ba chu so dau phai la 978 hoac 979
    if ((!prefix.equals(Constants.ISBN_PREFIX_978)) &amp;&amp;
            (!prefix.equals(Constants.ISBN_PREFIX_979))) {
        throw new Exception(String.format(Message.ERROR_ISBN_PREFIX, prefix));
    }

    // Cong 12 chu so dau: vi tri chan nhan 1, vi tri le nhan 3
    for (int i = 0; i &lt; (Constants.ISBN_LENGTH - 1); i++) {
        // Gia tri cua chu so thu i
        int digit = Constants.DIGITS.indexOf(digitBuilder.charAt(i));

        // Vi tri le (1, 3, 5...) nhan 3, vi tri chan nhan 1
        if ((i % 2) == 1) {
            weightedSum = weightedSum + (digit * Constants.ISBN_ODD_WEIGHT);
        } else {
            // Vi tri chan giu nguyen
            weightedSum = weightedSum + digit;
        }
    }

    // Chu so kiem tra = (10 - tong % 10) % 10
    checkDigit = (Constants.ISBN_MODULO - (weightedSum % Constants.ISBN_MODULO))
            % Constants.ISBN_MODULO;

    // Gia tri chu so cuoi (chu so thu 13)
    lastDigit = Constants.DIGITS.indexOf(digitBuilder.charAt(Constants.ISBN_LENGTH - 1));

    // Chu so cuoi khac chu so tinh ra thi bao ca hai
    if (lastDigit != checkDigit) {
        throw new Exception(String.format(Message.ERROR_ISBN_CHECKSUM, checkDigit, lastDigit));
    }

    return digitBuilder.toString();
}</code></pre>
</details>
<p>What the grader expects when the four checks fire (real output of the solution):</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Ten sach: Ten sach khong duoc de trong hoac chi co dau cach. Moi nhap lai.<br>
Ten sach: ISBN-13: ISBN-13 phai co dung 13 chu so (khong tinh dau - va dau cach), ban nhap 12 chu so. Moi nhap lai.<br>
ISBN-13: ISBN chi gom chu so, dau - va dau cach. Ky tu 'O' o vi tri 13 khong hop le. Moi nhap lai.<br>
ISBN-13: ISBN-13 phai bat dau bang 978 hoac 979, ban nhap 977. Moi nhap lai.<br>
ISBN-13: ISBN sai chu so kiem tra: chu so cuoi phai la 4, ban nhap 5. Xem lai so in tren bia sach roi nhap lai.<br>
ISBN-13: Da them sach "Clean Code" (ISBN 9780132350884). Thu vien co 5 dau sach.<br>
…</div>

<h4>Step 4 — TODO 1.4 duplicate ISBN in <code>BookRepository.addBook</code> (10 min)</h4>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Them 1 sach tu phieu nhap; ISBN da co thi nem loi (khong them)
public void addBook(BookRequestDTO bookRequestDTO) throws Exception {
    // Sach dang giu ISBN nay (null neu chua co)
    Book existingBook = findByIsbn(bookRequestDTO.getIsbn());

    // Trung ISBN thi bao ro sach nao dang giu ISBN do
    if (existingBook != null) {
        throw new Exception(String.format(Message.ERROR_DUPLICATE_ISBN,
                existingBook.getIsbn(), existingBook.getTitle()));
    }

    // Doi phieu nhap thanh model roi them vao cuoi danh sach
    bookList.add(new Book(bookRequestDTO.getIsbn(), bookRequestDTO.getTitle()));
}</code></pre>
</details>

<h4>Step 5 — TODO 1.5 <code>BookRepository.findByKeyword</code> (10 min)</h4>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Tim sach co ten chua tu khoa (khong phan biet hoa thuong)
public ArrayList&lt;BookResponseDTO&gt; findByKeyword(String keyword) {
    // Danh sach dong bang tim duoc; tu khoa viet thuong de so khong phan biet hoa thuong
    ArrayList&lt;BookResponseDTO&gt; foundList = new ArrayList&lt;&gt;();
    String lowerKeyword = keyword.toLowerCase();

    // Duyet tung sach de so ten
    for (Book book : bookList) {
        // Ten chua tu khoa thi giu lai
        if (book.getTitle().toLowerCase().contains(lowerKeyword)) {
            foundList.add(toResponseDTO(book));
        }
    }

    return foundList;
}</code></pre>
</details>

<h4>Step 6 — TODO 1.6 <code>BookService.sortByTitle</code> (20 min)</h4>
<details><summary>Hint — the shape</summary><p><code>Collections.sort(sortedList, new Comparator&lt;BookResponseDTO&gt;() { @Override public int compare(BookResponseDTO first, BookResponseDTO second) { … } });</code> — an anonymous class, the same form as 1.G slide 9. Number the rows in a second loop.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Sap cac dong bang theo ten (A-Z, khong phan biet hoa thuong), trung ten thi theo ISBN;
// xong danh so thu tu tu 1
public ArrayList&lt;BookResponseDTO&gt; sortByTitle(ArrayList&lt;BookResponseDTO&gt; bookList) {
    // Ban sao de khong lam doi thu tu cua danh sach goc
    ArrayList&lt;BookResponseDTO&gt; sortedList = new ArrayList&lt;&gt;(bookList);

    // Comparator la "luat so": tra so am neu first dung truoc second
    Collections.sort(sortedList, new Comparator&lt;BookResponseDTO&gt;() {
        // So ten truoc, trung ten thi so ISBN
        @Override
        public int compare(BookResponseDTO first, BookResponseDTO second) {
            // Ket qua so ten (0 = trung ten)
            int byTitle = first.getTitle().compareToIgnoreCase(second.getTitle());

            // Trung ten thi ISBN quyet dinh thu tu
            if (byTitle == 0) {
                return first.getIsbn().compareTo(second.getIsbn());
            }

            return byTitle;
        }
    });

    // Danh so thu tu sau khi sap xep
    for (int i = 0; i &lt; sortedList.size(); i++) {
        sortedList.get(i).setNo(i + 1);
    }

    return sortedList;
}</code></pre>
</details>

<h4>Step 7 — grade, lint, commit (15 min)</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 77/77 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab1-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab1-Solution — sạch</div>
<p>If <code>lint.py</code> complains, it names the file, the line and the rule (for example <code>[COMMENT] … 'if' thiếu comment</code>) — fix and run it again. <code>lint.py</code> comes with the LAB211 kit of this site; if you do not have it, check the rules by hand with the list in requirement 7.</p>`,
    `<h2>4. Làm từng bước</h2>
<h4>Bước 0 — đọc trước khi viết (20 phút)</h4>
<p>Mở <code>Main</code>, rồi <code>BookController</code>, rồi <code>BookView</code>. Tự trả lời: lớp nào giữ danh sách? Ai in ra màn hình? Mỗi <code>case</code> gọi controller mấy lần? Sau đó chạy bộ chấm của starter một lần — bạn sẽ thấy FAIL; đó là điểm xuất phát.</p>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">Dong 10:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: 1 &nbsp;&nbsp;&nbsp;9780134685991 &nbsp;Effective Java<br>
&nbsp;&nbsp;ban in : 0 &nbsp;&nbsp;&nbsp;9780135957059 &nbsp;The Pragmatic Programmer<br>
Dong 11:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: 2 &nbsp;&nbsp;&nbsp;9780596009205 &nbsp;Head First Java<br>
&nbsp;&nbsp;ban in : 0 &nbsp;&nbsp;&nbsp;9780134685991 &nbsp;Effective Java<br>
Dong 12:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: 3 &nbsp;&nbsp;&nbsp;9780321349606 &nbsp;Java Concurrency In Practice<br>
&nbsp;&nbsp;ban in : 0 &nbsp;&nbsp;&nbsp;9780321349606 &nbsp;Java Concurrency In Practice<br>
…</div>
<p>Dòng 10 là hàng đầu tiên của bảng: starter in số thứ tự 0 và giữ nguyên thứ tự thêm vào. Không có gì hỏng ngoài năm TODO.</p>

<h4>Bước 1 — TODO 1.1: Git (5 phút)</h4>
<p>Khởi tạo kho (lệnh ở trên), rồi commit sau mỗi bước dưới đây — <code>git commit -m "Lab 1.2: Title Case"</code> và cứ thế. Commit nhỏ là thứ nhóm nào cũng mong, và giúp bạn quay lại khi một thay đổi làm bộ chấm đỏ.</p>

<h4>Bước 2 — TODO 1.2 <code>Validation.getTitle</code> (25 phút)</h4>
<p>Làm sạch tên sách như slide 8. Gợi ý, mở từng cái một:</p>
<details><summary>Gợi ý 1 — các bước</summary><p><code>trim()</code> → rỗng? ném <code>Message.ERROR_TITLE_EMPTY</code> → <code>split(Constants.REGEX_SPACES)</code> → với mỗi từ: thêm một dấu cách (trừ trước từ đầu) và từ đó dạng Title Case → kiểm độ dài → <code>toString()</code>.</p></details>
<details><summary>Gợi ý 2 — một từ</summary><p><code>word.substring(0, 1).toUpperCase()</code> rồi <code>word.substring(1).toLowerCase()</code>. Từ một chữ cái vẫn chạy: <code>substring(1)</code> của "a" là "".</p></details>
<details><summary>Lời giải (phương thức trong dự án đáp án)</summary>
<pre class="trich"><code class="language-java">// Chuan hoa ten sach: bo dau cach thua, moi tu viet hoa chu dau (Title Case)
public static String getTitle(String input) throws Exception {
    // Ten bo dau cach 2 dau; bo noi cac tu da chuan hoa (khong dung String +=)
    String text = input.trim();
    StringBuilder titleBuilder = new StringBuilder();

    // Rong (hoac chi co dau cach) thi bao loi
    if (text.isEmpty()) {
        throw new Exception(Message.ERROR_TITLE_EMPTY);
    }

    // Tach theo 1 hay nhieu dau cach, chuan hoa tung tu
    for (String word : text.split(Constants.REGEX_SPACES)) {
        // Tu thu 2 tro di thi them 1 dau cach phia truoc
        if (titleBuilder.length() &gt; 0) {
            titleBuilder.append(Constants.SPACE);
        }

        // Chu dau viet hoa, phan con lai viet thuong
        titleBuilder.append(word.substring(0, 1).toUpperCase());
        titleBuilder.append(word.substring(1).toLowerCase());
    }

    // Ten da chuan hoa dai qua gioi han thi bao do dai
    if (titleBuilder.length() &gt; Constants.TITLE_MAX_LENGTH) {
        throw new Exception(String.format(Message.ERROR_TITLE_LENGTH, titleBuilder.length(),
                Constants.TITLE_MAX_LENGTH));
    }

    return titleBuilder.toString();
}</code></pre>
</details>

<h4>Bước 3 — TODO 1.3 <code>Validation.getIsbn</code> (40 phút)</h4>
<p>Bốn phép kiểm theo đúng thứ tự, mỗi phép một thông báo riêng trong <code>Message</code>: ký tự, độ dài, tiền tố, chữ số kiểm tra (slide 9–10). Tính tay ví dụ 978-0-13-235088-4 ra giấy trước.</p>
<details><summary>Gợi ý 1 — vòng lặp đầu</summary><p>Với <code>i</code> từ 0: <code>char character = text.charAt(i)</code>. Nếu <code>Constants.DIGITS.indexOf(character) &gt;= 0</code> thì nối vào; còn nếu không nằm trong <code>Constants.ISBN_SEPARATORS</code> thì ném <code>String.format(Message.ERROR_ISBN_CHARACTER, character, i + 1)</code>.</p></details>
<details><summary>Gợi ý 2 — tổng có trọng số</summary><p>Với 12 chữ số đầu: chỉ số lẻ (<code>i % 2 == 1</code>) ⇒ cộng <code>digit * Constants.ISBN_ODD_WEIGHT</code>, chỉ số chẵn ⇒ cộng <code>digit</code>. Rồi <code>checkDigit = (10 − tổng % 10) % 10</code>, số 10 lấy từ <code>Constants.ISBN_MODULO</code>.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Kiem ISBN-13: bo dau - va dau cach, du 13 chu so, dau 978/979, dung chu so kiem tra
public static String getIsbn(String input) throws Exception {
    // Ban go, cac chu so gom duoc, tien to, tong co trong so, chu so kiem tra, chu so cuoi
    String text = input.trim();
    StringBuilder digitBuilder = new StringBuilder();
    String prefix = "";
    int weightedSum = 0;
    int checkDigit = 0;
    int lastDigit = 0;

    // Duyet tung ky tu: chu so thi giu, dau - / dau cach thi bo, con lai la loi
    for (int i = 0; i &lt; text.length(); i++) {
        // Ky tu dang xet
        char character = text.charAt(i);

        // Chu so thi giu lai
        if (Constants.DIGITS.indexOf(character) &gt;= 0) {
            digitBuilder.append(character);
        } else if (Constants.ISBN_SEPARATORS.indexOf(character) &lt; 0) {
            // Khong phai chu so cung khong phai dau ngan cach: chi ro ky tu va vi tri
            throw new Exception(String.format(Message.ERROR_ISBN_CHARACTER, character, i + 1));
        }
    }

    // Thieu hoac thua chu so thi bao so chu so dang co
    if (digitBuilder.length() != Constants.ISBN_LENGTH) {
        throw new Exception(String.format(Message.ERROR_ISBN_LENGTH, Constants.ISBN_LENGTH,
                digitBuilder.length()));
    }

    // Lay 3 chu so dau
    prefix = digitBuilder.substring(0, Constants.ISBN_PREFIX_LENGTH);

    // Ba chu so dau phai la 978 hoac 979
    if ((!prefix.equals(Constants.ISBN_PREFIX_978)) &amp;&amp;
            (!prefix.equals(Constants.ISBN_PREFIX_979))) {
        throw new Exception(String.format(Message.ERROR_ISBN_PREFIX, prefix));
    }

    // Cong 12 chu so dau: vi tri chan nhan 1, vi tri le nhan 3
    for (int i = 0; i &lt; (Constants.ISBN_LENGTH - 1); i++) {
        // Gia tri cua chu so thu i
        int digit = Constants.DIGITS.indexOf(digitBuilder.charAt(i));

        // Vi tri le (1, 3, 5...) nhan 3, vi tri chan nhan 1
        if ((i % 2) == 1) {
            weightedSum = weightedSum + (digit * Constants.ISBN_ODD_WEIGHT);
        } else {
            // Vi tri chan giu nguyen
            weightedSum = weightedSum + digit;
        }
    }

    // Chu so kiem tra = (10 - tong % 10) % 10
    checkDigit = (Constants.ISBN_MODULO - (weightedSum % Constants.ISBN_MODULO))
            % Constants.ISBN_MODULO;

    // Gia tri chu so cuoi (chu so thu 13)
    lastDigit = Constants.DIGITS.indexOf(digitBuilder.charAt(Constants.ISBN_LENGTH - 1));

    // Chu so cuoi khac chu so tinh ra thi bao ca hai
    if (lastDigit != checkDigit) {
        throw new Exception(String.format(Message.ERROR_ISBN_CHECKSUM, checkDigit, lastDigit));
    }

    return digitBuilder.toString();
}</code></pre>
</details>
<p>Bộ chấm chờ gì khi bốn phép kiểm báo lỗi (output thật của đáp án):</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Ten sach: Ten sach khong duoc de trong hoac chi co dau cach. Moi nhap lai.<br>
Ten sach: ISBN-13: ISBN-13 phai co dung 13 chu so (khong tinh dau - va dau cach), ban nhap 12 chu so. Moi nhap lai.<br>
ISBN-13: ISBN chi gom chu so, dau - va dau cach. Ky tu 'O' o vi tri 13 khong hop le. Moi nhap lai.<br>
ISBN-13: ISBN-13 phai bat dau bang 978 hoac 979, ban nhap 977. Moi nhap lai.<br>
ISBN-13: ISBN sai chu so kiem tra: chu so cuoi phai la 4, ban nhap 5. Xem lai so in tren bia sach roi nhap lai.<br>
ISBN-13: Da them sach "Clean Code" (ISBN 9780132350884). Thu vien co 5 dau sach.<br>
…</div>

<h4>Bước 4 — TODO 1.4 chặn trùng ISBN trong <code>BookRepository.addBook</code> (10 phút)</h4>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Them 1 sach tu phieu nhap; ISBN da co thi nem loi (khong them)
public void addBook(BookRequestDTO bookRequestDTO) throws Exception {
    // Sach dang giu ISBN nay (null neu chua co)
    Book existingBook = findByIsbn(bookRequestDTO.getIsbn());

    // Trung ISBN thi bao ro sach nao dang giu ISBN do
    if (existingBook != null) {
        throw new Exception(String.format(Message.ERROR_DUPLICATE_ISBN,
                existingBook.getIsbn(), existingBook.getTitle()));
    }

    // Doi phieu nhap thanh model roi them vao cuoi danh sach
    bookList.add(new Book(bookRequestDTO.getIsbn(), bookRequestDTO.getTitle()));
}</code></pre>
</details>

<h4>Bước 5 — TODO 1.5 <code>BookRepository.findByKeyword</code> (10 phút)</h4>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Tim sach co ten chua tu khoa (khong phan biet hoa thuong)
public ArrayList&lt;BookResponseDTO&gt; findByKeyword(String keyword) {
    // Danh sach dong bang tim duoc; tu khoa viet thuong de so khong phan biet hoa thuong
    ArrayList&lt;BookResponseDTO&gt; foundList = new ArrayList&lt;&gt;();
    String lowerKeyword = keyword.toLowerCase();

    // Duyet tung sach de so ten
    for (Book book : bookList) {
        // Ten chua tu khoa thi giu lai
        if (book.getTitle().toLowerCase().contains(lowerKeyword)) {
            foundList.add(toResponseDTO(book));
        }
    }

    return foundList;
}</code></pre>
</details>

<h4>Bước 6 — TODO 1.6 <code>BookService.sortByTitle</code> (20 phút)</h4>
<details><summary>Gợi ý — hình dáng</summary><p><code>Collections.sort(sortedList, new Comparator&lt;BookResponseDTO&gt;() { @Override public int compare(BookResponseDTO first, BookResponseDTO second) { … } });</code> — một lớp ẩn danh, đúng dạng 1.G slide 9. Đánh số các hàng trong một vòng lặp thứ hai.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Sap cac dong bang theo ten (A-Z, khong phan biet hoa thuong), trung ten thi theo ISBN;
// xong danh so thu tu tu 1
public ArrayList&lt;BookResponseDTO&gt; sortByTitle(ArrayList&lt;BookResponseDTO&gt; bookList) {
    // Ban sao de khong lam doi thu tu cua danh sach goc
    ArrayList&lt;BookResponseDTO&gt; sortedList = new ArrayList&lt;&gt;(bookList);

    // Comparator la "luat so": tra so am neu first dung truoc second
    Collections.sort(sortedList, new Comparator&lt;BookResponseDTO&gt;() {
        // So ten truoc, trung ten thi so ISBN
        @Override
        public int compare(BookResponseDTO first, BookResponseDTO second) {
            // Ket qua so ten (0 = trung ten)
            int byTitle = first.getTitle().compareToIgnoreCase(second.getTitle());

            // Trung ten thi ISBN quyet dinh thu tu
            if (byTitle == 0) {
                return first.getIsbn().compareTo(second.getIsbn());
            }

            return byTitle;
        }
    });

    // Danh so thu tu sau khi sap xep
    for (int i = 0; i &lt; sortedList.size(); i++) {
        sortedList.get(i).setNo(i + 1);
    }

    return sortedList;
}</code></pre>
</details>

<h4>Bước 7 — chấm, lint, commit (15 phút)</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 77/77 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab1-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab1-Solution — sạch</div>
<p>Nếu <code>lint.py</code> phàn nàn, nó nêu tệp, dòng và luật (ví dụ <code>[COMMENT] … 'if' thiếu comment</code>) — sửa rồi chạy lại. <code>lint.py</code> nằm trong bộ LAB211 của trang này; nếu chưa có, tự soát bằng danh sách ở yêu cầu 7.</p>`),
    bi(`<h2>5. The full solution — and the proof it is right</h2>
<p>The solution zip above is the complete project. It passed, for real: <code>lint.py</code> (the LAB211 reviewer's rules) with 0 violations, <code>javac --release 8</code>, the same run on a real JDK 8 (Docker <code>eclipse-temurin:8-jdk</code>) printing exactly what the JDK 21 run prints, and the grader with 77/77. Here is the complete run the grader compares against:</p>
<details><summary>Full run — java -cp build main.Main &lt; harness/input.txt (77 lines)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: Lua chon phai la 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Lua chon: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 0 den 3. Moi nhap lai.<br>
Lua chon: --- Danh sach sach ---<br>
No &nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;&nbsp;9780134685991 &nbsp;Effective Java<br>
2 &nbsp;&nbsp;&nbsp;9780596009205 &nbsp;Head First Java<br>
3 &nbsp;&nbsp;&nbsp;9780321349606 &nbsp;Java Concurrency In Practice<br>
4 &nbsp;&nbsp;&nbsp;9780135957059 &nbsp;The Pragmatic Programmer<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: Ten sach khong duoc de trong hoac chi co dau cach. Moi nhap lai.<br>
Ten sach: ISBN-13: ISBN-13 phai co dung 13 chu so (khong tinh dau - va dau cach), ban nhap 12 chu so. Moi nhap lai.<br>
ISBN-13: ISBN chi gom chu so, dau - va dau cach. Ky tu 'O' o vi tri 13 khong hop le. Moi nhap lai.<br>
ISBN-13: ISBN-13 phai bat dau bang 978 hoac 979, ban nhap 977. Moi nhap lai.<br>
ISBN-13: ISBN sai chu so kiem tra: chu so cuoi phai la 4, ban nhap 5. Xem lai so in tren bia sach roi nhap lai.<br>
ISBN-13: Da them sach "Clean Code" (ISBN 9780132350884). Thu vien co 5 dau sach.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: ISBN-13: Da co sach mang ISBN 9780134685991 ("Effective Java"). Moi dau sach chi them 1 lan.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: Ten sach dai 77 ky tu, toi da chi 60 ky tu. Hay rut gon roi nhap lai.<br>
Ten sach: ISBN-13: Da them sach "Refactoring" (ISBN 9780134757599). Thu vien co 6 dau sach.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: --- Danh sach sach ---<br>
No &nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;&nbsp;9780132350884 &nbsp;Clean Code<br>
2 &nbsp;&nbsp;&nbsp;9780134685991 &nbsp;Effective Java<br>
3 &nbsp;&nbsp;&nbsp;9780596009205 &nbsp;Head First Java<br>
4 &nbsp;&nbsp;&nbsp;9780321349606 &nbsp;Java Concurrency In Practice<br>
5 &nbsp;&nbsp;&nbsp;9780134757599 &nbsp;Refactoring<br>
6 &nbsp;&nbsp;&nbsp;9780135957059 &nbsp;The Pragmatic Programmer<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: --- Tim sach theo ten ---<br>
Tu khoa: Tu khoa khong duoc de trong. Hay nhap 1 phan cua ten sach, vi du: java.<br>
Tu khoa: No &nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;&nbsp;9780134685991 &nbsp;Effective Java<br>
2 &nbsp;&nbsp;&nbsp;9780596009205 &nbsp;Head First Java<br>
3 &nbsp;&nbsp;&nbsp;9780321349606 &nbsp;Java Concurrency In Practice<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: --- Tim sach theo ten ---<br>
Tu khoa: Khong co sach nao co ten chua "python". Hay thu tu khoa khac.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: Tam biet! Du lieu Lab 1 chi nam trong bo nho.</div>
</details>
<p>And the class that ties the layers together — read it until every line makes sense:</p>
<details><summary>BookController.java (given in the starter)</summary>
<pre><code class="language-java">package controller;

import constants.Constants;
import constants.Message;
import dto.BookRequestDTO;
import dto.BookResponseDTO;
import java.util.ArrayList;
import repository.BookRepository;
import service.BookService;
import view.BookView;

/**
 * Dieu phoi moi yeu cau ve sach: goi Repository de them/tim (CRUD), dua du lieu
 * cho Service sap xep, roi dua ket qua cho View in. Khong import model.
 *
 * @author CuongThai Academy
 */
public class BookController {

    // Kho sach (CRUD nam o Controller, khong o Service)
    private BookRepository bookRepository;

    // Nghiep vu sap xep
    private BookService bookService;

    // Man hinh in ket qua
    private BookView bookView;

    // Tao kho, service, view va nap sach mau
    public BookController() {
        bookRepository = new BookRepository();
        bookService = new BookService();
        bookView = new BookView();

        // Nap sach mau; loi thi in ra (khong xay ra voi du lieu mau dung)
        try {
            loadSampleBooks();
        } catch (Exception e) {
            // Du lieu mau trung ISBN thi bao loi
            showResult(e.getMessage(), new ArrayList&lt;BookResponseDTO&gt;());
        }
    }

    // Them 1 sach, bao ket qua (thanh cong hoac trung ISBN)
    public void addBook(BookRequestDTO bookRequestDTO) {
        // Cau ket qua se in
        String resultMessage = "";

        // Them vao kho; trung ISBN thi kho nem loi
        try {
            bookRepository.addBook(bookRequestDTO);
            resultMessage = String.format(Message.SUCCESS_ADD, bookRequestDTO.getTitle(),
                    bookRequestDTO.getIsbn(), bookRepository.countBooks());
        } catch (Exception e) {
            // Trung ISBN thi lay cau bao loi cua kho
            resultMessage = e.getMessage();
        }

        // In ket qua 1 lan
        showResult(resultMessage, new ArrayList&lt;BookResponseDTO&gt;());
    }

    // In moi sach, sap theo ten
    public void showAllBooks() {
        // Kho tra ban sao, Service sap xep + danh so
        ArrayList&lt;BookResponseDTO&gt; sortedList = bookService.sortByTitle(bookRepository.findAll());

        // Kho rong thi chi in cau bao rong, nguoc lai chi in bang
        if (sortedList.isEmpty()) {
            showResult(Message.EMPTY_LIST, sortedList);
        } else {
            // Co sach thi in bang, khong kem cau nao
            showResult("", sortedList);
        }
    }

    // Tim sach co ten chua tu khoa (phieu chi dien ten), in ket qua da sap theo ten
    public void searchBooks(BookRequestDTO bookRequestDTO) {
        // Kho tim theo tu khoa, Service sap xep + danh so
        ArrayList&lt;BookResponseDTO&gt; foundList
                = bookService.sortByTitle(bookRepository.findByKeyword(bookRequestDTO.getTitle()));

        // Khong tim thay thi chi in cau bao, nguoc lai chi in bang
        if (foundList.isEmpty()) {
            showResult(String.format(Message.NOT_FOUND, bookRequestDTO.getTitle()), foundList);
        } else {
            // Co ket qua thi in bang
            showResult("", foundList);
        }
    }

    // Dua cau thong bao + cac dong bang cho View roi goi in dung 1 lan
    private void showResult(String message, ArrayList&lt;BookResponseDTO&gt; responseList) {
        bookView.setMessage(message);
        bookView.setResponseList(responseList);
        bookView.display();
    }

    // Nap cac sach mau khai trong Constants
    private void loadSampleBooks() throws Exception {
        // Moi dong mau: { ten sach, ISBN }
        for (String[] rowArray : Constants.SAMPLE_BOOK_ARRAY) {
            bookRepository.addBook(new BookRequestDTO(rowArray[Constants.SAMPLE_ISBN_INDEX],
                    rowArray[Constants.SAMPLE_TITLE_INDEX]));
        }
    }
}</code></pre>
</details>`,
    `<h2>5. Đáp án đầy đủ — và bằng chứng là đúng</h2>
<p>Tệp zip đáp án ở trên là trọn dự án. Nó đã qua thật: <code>lint.py</code> (luật review của thầy LAB211) 0 vi phạm, <code>javac --release 8</code>, cùng lần chạy trên JDK 8 thật (Docker <code>eclipse-temurin:8-jdk</code>) in ra đúng y như JDK 21, và bộ chấm 77/77. Đây là trọn lần chạy mà bộ chấm dùng để so:</p>
<details><summary>Trọn lần chạy — java -cp build main.Main &lt; harness/input.txt (77 dòng)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: Lua chon phai la 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Lua chon: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 0 den 3. Moi nhap lai.<br>
Lua chon: --- Danh sach sach ---<br>
No &nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;&nbsp;9780134685991 &nbsp;Effective Java<br>
2 &nbsp;&nbsp;&nbsp;9780596009205 &nbsp;Head First Java<br>
3 &nbsp;&nbsp;&nbsp;9780321349606 &nbsp;Java Concurrency In Practice<br>
4 &nbsp;&nbsp;&nbsp;9780135957059 &nbsp;The Pragmatic Programmer<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: Ten sach khong duoc de trong hoac chi co dau cach. Moi nhap lai.<br>
Ten sach: ISBN-13: ISBN-13 phai co dung 13 chu so (khong tinh dau - va dau cach), ban nhap 12 chu so. Moi nhap lai.<br>
ISBN-13: ISBN chi gom chu so, dau - va dau cach. Ky tu 'O' o vi tri 13 khong hop le. Moi nhap lai.<br>
ISBN-13: ISBN-13 phai bat dau bang 978 hoac 979, ban nhap 977. Moi nhap lai.<br>
ISBN-13: ISBN sai chu so kiem tra: chu so cuoi phai la 4, ban nhap 5. Xem lai so in tren bia sach roi nhap lai.<br>
ISBN-13: Da them sach "Clean Code" (ISBN 9780132350884). Thu vien co 5 dau sach.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: ISBN-13: Da co sach mang ISBN 9780134685991 ("Effective Java"). Moi dau sach chi them 1 lan.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: Ten sach dai 77 ky tu, toi da chi 60 ky tu. Hay rut gon roi nhap lai.<br>
Ten sach: ISBN-13: Da them sach "Refactoring" (ISBN 9780134757599). Thu vien co 6 dau sach.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: --- Danh sach sach ---<br>
No &nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;&nbsp;9780132350884 &nbsp;Clean Code<br>
2 &nbsp;&nbsp;&nbsp;9780134685991 &nbsp;Effective Java<br>
3 &nbsp;&nbsp;&nbsp;9780596009205 &nbsp;Head First Java<br>
4 &nbsp;&nbsp;&nbsp;9780321349606 &nbsp;Java Concurrency In Practice<br>
5 &nbsp;&nbsp;&nbsp;9780134757599 &nbsp;Refactoring<br>
6 &nbsp;&nbsp;&nbsp;9780135957059 &nbsp;The Pragmatic Programmer<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: --- Tim sach theo ten ---<br>
Tu khoa: Tu khoa khong duoc de trong. Hay nhap 1 phan cua ten sach, vi du: java.<br>
Tu khoa: No &nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;&nbsp;9780134685991 &nbsp;Effective Java<br>
2 &nbsp;&nbsp;&nbsp;9780596009205 &nbsp;Head First Java<br>
3 &nbsp;&nbsp;&nbsp;9780321349606 &nbsp;Java Concurrency In Practice<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: --- Tim sach theo ten ---<br>
Tu khoa: Khong co sach nao co ten chua "python". Hay thu tu khoa khac.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
0. Thoat<br>
Lua chon: Tam biet! Du lieu Lab 1 chi nam trong bo nho.</div>
</details>
<p>Và lớp nối các tầng lại với nhau — đọc tới khi hiểu từng dòng:</p>
<details><summary>BookController.java (cho sẵn trong starter)</summary>
<pre><code class="language-java">package controller;

import constants.Constants;
import constants.Message;
import dto.BookRequestDTO;
import dto.BookResponseDTO;
import java.util.ArrayList;
import repository.BookRepository;
import service.BookService;
import view.BookView;

/**
 * Dieu phoi moi yeu cau ve sach: goi Repository de them/tim (CRUD), dua du lieu
 * cho Service sap xep, roi dua ket qua cho View in. Khong import model.
 *
 * @author CuongThai Academy
 */
public class BookController {

    // Kho sach (CRUD nam o Controller, khong o Service)
    private BookRepository bookRepository;

    // Nghiep vu sap xep
    private BookService bookService;

    // Man hinh in ket qua
    private BookView bookView;

    // Tao kho, service, view va nap sach mau
    public BookController() {
        bookRepository = new BookRepository();
        bookService = new BookService();
        bookView = new BookView();

        // Nap sach mau; loi thi in ra (khong xay ra voi du lieu mau dung)
        try {
            loadSampleBooks();
        } catch (Exception e) {
            // Du lieu mau trung ISBN thi bao loi
            showResult(e.getMessage(), new ArrayList&lt;BookResponseDTO&gt;());
        }
    }

    // Them 1 sach, bao ket qua (thanh cong hoac trung ISBN)
    public void addBook(BookRequestDTO bookRequestDTO) {
        // Cau ket qua se in
        String resultMessage = "";

        // Them vao kho; trung ISBN thi kho nem loi
        try {
            bookRepository.addBook(bookRequestDTO);
            resultMessage = String.format(Message.SUCCESS_ADD, bookRequestDTO.getTitle(),
                    bookRequestDTO.getIsbn(), bookRepository.countBooks());
        } catch (Exception e) {
            // Trung ISBN thi lay cau bao loi cua kho
            resultMessage = e.getMessage();
        }

        // In ket qua 1 lan
        showResult(resultMessage, new ArrayList&lt;BookResponseDTO&gt;());
    }

    // In moi sach, sap theo ten
    public void showAllBooks() {
        // Kho tra ban sao, Service sap xep + danh so
        ArrayList&lt;BookResponseDTO&gt; sortedList = bookService.sortByTitle(bookRepository.findAll());

        // Kho rong thi chi in cau bao rong, nguoc lai chi in bang
        if (sortedList.isEmpty()) {
            showResult(Message.EMPTY_LIST, sortedList);
        } else {
            // Co sach thi in bang, khong kem cau nao
            showResult("", sortedList);
        }
    }

    // Tim sach co ten chua tu khoa (phieu chi dien ten), in ket qua da sap theo ten
    public void searchBooks(BookRequestDTO bookRequestDTO) {
        // Kho tim theo tu khoa, Service sap xep + danh so
        ArrayList&lt;BookResponseDTO&gt; foundList
                = bookService.sortByTitle(bookRepository.findByKeyword(bookRequestDTO.getTitle()));

        // Khong tim thay thi chi in cau bao, nguoc lai chi in bang
        if (foundList.isEmpty()) {
            showResult(String.format(Message.NOT_FOUND, bookRequestDTO.getTitle()), foundList);
        } else {
            // Co ket qua thi in bang
            showResult("", foundList);
        }
    }

    // Dua cau thong bao + cac dong bang cho View roi goi in dung 1 lan
    private void showResult(String message, ArrayList&lt;BookResponseDTO&gt; responseList) {
        bookView.setMessage(message);
        bookView.setResponseList(responseList);
        bookView.display();
    }

    // Nap cac sach mau khai trong Constants
    private void loadSampleBooks() throws Exception {
        // Moi dong mau: { ten sach, ISBN }
        for (String[] rowArray : Constants.SAMPLE_BOOK_ARRAY) {
            bookRepository.addBook(new BookRequestDTO(rowArray[Constants.SAMPLE_ISBN_INDEX],
                    rowArray[Constants.SAMPLE_TITLE_INDEX]));
        }
    }
}</code></pre>
</details>`),
    bi(`<h2>6. Traps (with real output)</h2>
<div class="pitfall"><p><strong>Trap 1 — <code>==</code> on Strings.</strong> The typed ISBN is a new String object; <code>==</code> compares references.</p></div>
<pre><code class="language-java">// release: 8
// Lab 1 trap — comparing the typed ISBN with ==
import java.util.Scanner;

public class LabBaySoChuoi {
    public static void main(String[] args) {
        String stored = "9780134685991";                  // literal: lives in the string pool
        Scanner scanner = new Scanner(System.in);
        String typed = scanner.nextLine().trim();         // a NEW String object built at run time
        System.out.println("typed      = " + typed);
        System.out.println("== says    : " + (typed == stored));       // compares two REFERENCES
        System.out.println("equals says: " + typed.equals(stored));    // compares the CHARACTERS
        String sameLiteral = "9780134685991";
        System.out.println("two literals with == : " + (sameLiteral == stored));   // true only because of the pool
    }
}</code></pre>
<div class="out">typed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 9780134685991<br>
== says &nbsp;&nbsp;&nbsp;: false<br>
equals says: true<br>
two literals with == : true</div>
<div class="pitfall"><p><strong>Trap 2 — <code>nextInt()</code> then <code>nextLine()</code>.</strong> The Enter left behind becomes an empty title (input typed: 1, Clean Code, 2).</p></div>
<pre><code class="language-java">// release: 8
// Lab 1 trap — nextInt() then nextLine(): the title comes back empty
import java.util.Scanner;

public class LabBayNextInt {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Choice: ");
        int choice = scanner.nextInt();                   // reads "1" but leaves the Enter in the buffer
        System.out.print("Title: ");
        String title = scanner.nextLine();                // eats that leftover Enter at once
        System.out.println();
        System.out.println("choice = " + choice + ", title = [" + title + "]");
        String next = scanner.nextLine();                 // the real title only arrives now
        System.out.println("the next nextLine() = [" + next + "]");
        int fixed = Integer.parseInt(scanner.nextLine().trim());   // the LAB211 way: always nextLine() then parse
        System.out.println("nextLine() + parseInt = " + fixed);
    }
}</code></pre>
<div class="out">Choice: Title:<br>
choice = 1, title = []<br>
the next nextLine() = [Clean Code]<br>
nextLine() + parseInt = 2</div>
<div class="pitfall"><p><strong>Trap 3 — numbering before sorting.</strong> If <code>setNo</code> runs before <code>Collections.sort</code>, the numbers travel with the rows and come out 3, 1, 4, 2. Number in a second loop, after sorting.</p></div>
<div class="pitfall"><p><strong>Trap 4 — the duplicate check in the wrong layer.</strong> Putting it in <code>Validation</code> would need the list inside utils — a LAYER violation, and <code>lint.py</code> stops at it ("package 'utils' không được import 'repository'").</p></div>`,
    `<h2>6. Bẫy (kèm output thật)</h2>
<div class="pitfall"><p><strong>Bẫy 1 — <code>==</code> với String.</strong> ISBN vừa gõ là một đối tượng String mới; <code>==</code> so tham chiếu.</p></div>
<pre><code class="language-java">// release: 8
// Bẫy Lab 1 — so ISBN vừa gõ bằng ==
import java.util.Scanner;

public class LabBaySoChuoi {
    public static void main(String[] args) {
        String stored = "9780134685991";                  // hằng chuỗi: nằm trong string pool
        Scanner scanner = new Scanner(System.in);
        String typed = scanner.nextLine().trim();         // một đối tượng String MỚI tạo lúc chạy
        System.out.println("typed      = " + typed);
        System.out.println("== says    : " + (typed == stored));       // so hai THAM CHIẾU
        System.out.println("equals says: " + typed.equals(stored));    // so từng KÝ TỰ
        String sameLiteral = "9780134685991";
        System.out.println("two literals with == : " + (sameLiteral == stored));   // true chỉ vì pool
    }
}</code></pre>
<div class="out">typed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 9780134685991<br>
== says &nbsp;&nbsp;&nbsp;: false<br>
equals says: true<br>
two literals with == : true</div>
<div class="pitfall"><p><strong>Bẫy 2 — <code>nextInt()</code> rồi <code>nextLine()</code>.</strong> Phím Enter còn sót biến thành tên sách rỗng (dữ liệu gõ: 1, Clean Code, 2).</p></div>
<pre><code class="language-java">// release: 8
// Bẫy Lab 1 — nextInt() rồi nextLine(): tên sách rỗng
import java.util.Scanner;

public class LabBayNextInt {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Choice: ");
        int choice = scanner.nextInt();                   // đọc "1" nhưng để lại phím Enter trong bộ đệm
        System.out.print("Title: ");
        String title = scanner.nextLine();                // nuốt ngay phím Enter còn sót
        System.out.println();
        System.out.println("choice = " + choice + ", title = [" + title + "]");
        String next = scanner.nextLine();                 // tên sách thật giờ mới tới
        System.out.println("the next nextLine() = [" + next + "]");
        int fixed = Integer.parseInt(scanner.nextLine().trim());   // cách LAB211: luôn nextLine() rồi parse
        System.out.println("nextLine() + parseInt = " + fixed);
    }
}</code></pre>
<div class="out">Choice: Title:<br>
choice = 1, title = []<br>
the next nextLine() = [Clean Code]<br>
nextLine() + parseInt = 2</div>
<div class="pitfall"><p><strong>Bẫy 3 — đánh số trước khi sắp.</strong> Nếu <code>setNo</code> chạy trước <code>Collections.sort</code>, số thứ tự đi theo hàng và ra 3, 1, 4, 2. Đánh số ở vòng lặp thứ hai, sau khi sắp.</p></div>
<div class="pitfall"><p><strong>Bẫy 4 — chặn trùng sai tầng.</strong> Đặt nó vào <code>Validation</code> thì utils phải giữ danh sách — vi phạm tầng, và <code>lint.py</code> chặn ngay ("package 'utils' không được import 'repository'").</p></div>`),
    bi(`<h2>7. Rubric (10 points) and self-check</h2>
<table>
<thead><tr><th>Part</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>LAB211 structure: 9 packages, controller holds the repository, service has none, no <code>model</code> import in the controller</td><td>2</td><td>open the tree + <code>lint.py</code> LAYER rules</td></tr>
<tr><td>Title Case, empty, length (1.2)</td><td>2</td><td>grader lines 20, 25, 39</td></tr>
<tr><td>ISBN-13: 4 checks, 4 precise messages (1.3)</td><td>2</td><td>grader lines 21–24</td></tr>
<tr><td>Duplicate ISBN refused (1.4)</td><td>1</td><td>grader line 32</td></tr>
<tr><td>Search, any case (1.5)</td><td>1</td><td>grader lines 60–64, 71</td></tr>
<tr><td>Sort A–Z + numbering after sorting (1.6)</td><td>1</td><td>grader lines 9–13, 47–53</td></tr>
<tr><td>Standards: <code>lint.py</code> 0, comments, ≤ 100 characters, ≥ 3 commits</td><td>1</td><td><code>lint.py</code>, <code>git log</code></td></tr>
</tbody>
</table>
<p><strong>Self-check — answer aloud, then open:</strong></p>
<details><summary>1. Why is the duplicate check in the repository and not in Validation?</summary><p class="dap-an">✅ Validation only sees the typed text; the repository owns the list, so only it can know the ISBN is taken — and by which book. Utils may not import a repository (layer rule).</p></details>
<details><summary>2. What does compare return for "Clean Code" vs "clean code"?</summary><p class="dap-an">✅ <code>compareToIgnoreCase</code> gives 0 (a tie), so the comparator moves on to the ISBN — the order is still fully decided.</p></details>
<details><summary>3. The club wants titles up to 80 characters. Which file changes?</summary><p class="dap-an">✅ Only <code>constants/Constants.java</code>: <code>TITLE_MAX_LENGTH = 80</code>. <code>Validation</code> and the message already use the constant — that is the point of "no hard-coding".</p></details>`,
    `<h2>7. Rubric (10 điểm) và tự kiểm</h2>
<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Kiểm bằng</th></tr></thead>
<tbody>
<tr><td>Cấu trúc LAB211: 9 package, controller giữ repository, service không có, controller không import <code>model</code></td><td>2</td><td>mở cây dự án + luật LAYER của <code>lint.py</code></td></tr>
<tr><td>Title Case, rỗng, độ dài (1.2)</td><td>2</td><td>dòng 20, 25, 39 của bộ chấm</td></tr>
<tr><td>ISBN-13: 4 phép kiểm, 4 thông báo rõ ràng (1.3)</td><td>2</td><td>dòng 21–24</td></tr>
<tr><td>Chặn trùng ISBN (1.4)</td><td>1</td><td>dòng 32</td></tr>
<tr><td>Tìm không phân biệt hoa thường (1.5)</td><td>1</td><td>dòng 60–64, 71</td></tr>
<tr><td>Sắp A–Z + đánh số sau khi sắp (1.6)</td><td>1</td><td>dòng 9–13, 47–53</td></tr>
<tr><td>Chuẩn code: <code>lint.py</code> 0, comment, ≤ 100 ký tự, ≥ 3 commit</td><td>1</td><td><code>lint.py</code>, <code>git log</code></td></tr>
</tbody>
</table>
<p><strong>Tự kiểm — trả lời thành tiếng rồi mới mở:</strong></p>
<details><summary>1. Vì sao chặn trùng nằm ở repository mà không ở Validation?</summary><p class="dap-an">✅ Validation chỉ thấy chữ vừa gõ; repository giữ danh sách nên chỉ nó biết ISBN đã có — và thuộc cuốn nào. Utils không được import repository (luật tầng).</p></details>
<details><summary>2. compare trả gì khi so "Clean Code" với "clean code"?</summary><p class="dap-an">✅ <code>compareToIgnoreCase</code> trả 0 (ngang nhau), nên comparator chuyển sang so ISBN — thứ tự vẫn được quyết định trọn vẹn.</p></details>
<details><summary>3. Câu lạc bộ muốn tên sách dài tới 80 ký tự. Sửa tệp nào?</summary><p class="dap-an">✅ Chỉ <code>constants/Constants.java</code>: <code>TITLE_MAX_LENGTH = 80</code>. <code>Validation</code> và câu thông báo đều đã dùng hằng — đó chính là ý nghĩa của "không hardcode".</p></details>`),
    bi(`<h2>8. Extra challenges and what comes next</h2>
<ul>
<li>⭐ Accept the old 10-digit ISBN too: convert it to ISBN-13 ("978" + first 9 digits + new check digit). Which methods change, which stay?</li>
<li>⭐ Add menu item 4: list only the books whose title starts with a given letter — in which layer does "starts with" go?</li>
<li>⭐⭐ Show ISBNs with hyphens in the table (978-0-13-235088-4) without changing what is stored. Hint: a formatting job belongs to the DTO's <code>toString</code> or the view, not to the repository.</li>
</ul>
<div class="callout"><p><strong>Next — Lab 2 (after Chapter 2):</strong> you write the classes yourself. <code>Book</code> gets an id (B001…), an author, a year and a number of copies; <code>Member</code> joins; constructors, <code>this</code>, and the question that decides Chapter 2: when you change something, do you change the object — or only a copy of it?</p></div>`,
    `<h2>8. Thử thách thêm và việc tiếp theo</h2>
<ul>
<li>⭐ Nhận cả ISBN 10 chữ số kiểu cũ: đổi sang ISBN-13 ("978" + 9 chữ số đầu + chữ số kiểm tra mới). Phương thức nào phải sửa, phương thức nào giữ nguyên?</li>
<li>⭐ Thêm mục menu 4: liệt kê các sách có tên bắt đầu bằng một chữ cái cho trước — phần "bắt đầu bằng" đặt ở tầng nào?</li>
<li>⭐⭐ Hiện ISBN có gạch nối trong bảng (978-0-13-235088-4) mà không đổi dữ liệu đã lưu. Gợi ý: việc định dạng thuộc về <code>toString</code> của DTO hoặc view, không thuộc repository.</li>
</ul>
<div class="callout"><p><strong>Tiếp theo — Lab 2 (sau Chương 2):</strong> bạn tự viết lớp. <code>Book</code> có mã (B001…), tác giả, năm xuất bản và số bản; thêm <code>Member</code>; constructor, <code>this</code>, và câu hỏi quyết định Chương 2: khi sửa một thứ, bạn đang sửa đối tượng — hay chỉ sửa bản sao của nó?</p></div>`),
  ].join('\n'),
};

/* ───────── Quiz (pro192-quiz-ch1) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) What is the result of compiling and running this code?|||(Dạng câu FE) Biên dịch và chạy đoạn code sau cho kết quả gì?',
      code: `Integer x = new Integer(5);
Integer y = new Integer(10);
System.out.println((String) (x + y));`,
      codeLang: 'java',
      options: ['15|||15', '510|||510', 'A ClassCastException at run time|||Một ClassCastException lúc chạy', 'A compile-time error|||Lỗi biên dịch'],
      correctIndex: 3,
      points: 1,
      explanation: 'x + y unboxes both Integers and produces an int (15). An int cannot be cast to String — casts between a primitive and an unrelated reference type are rejected by the compiler: javac 1.8 says "incompatible types: int cannot be converted to String". To get "15" write String.valueOf(x + y) or "" + (x + y). "510" would need string concatenation, which never happens here.|||x + y mở hộp cả hai Integer và cho ra một int (15). Một int không ép được sang String — trình biên dịch từ chối ép giữa kiểu nguyên thủy và kiểu tham chiếu không liên quan: javac 1.8 báo "incompatible types: int cannot be converted to String". Muốn có "15" thì viết String.valueOf(x + y) hoặc "" + (x + y). "510" cần phép nối chuỗi, điều không hề xảy ra ở đây.' },
    { id: 'q2',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Đoạn code in ra gì?',
      code: `String s1 = "hello";
String s2 = new String("hello");
System.out.println((s1 == s2) + " " + s1.equals(s2));`,
      codeLang: 'java',
      options: ['true true|||true true', 'false true|||false true', 'true false|||true false', 'false false|||false false'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: "false true". The literal "hello" lives in the string pool; new String("hello") always creates a new object on the heap, so == (which compares references) is false, while equals compares the characters and is true. Lesson 1.F, slide 16.|||Output của chương trình thật: "false true". Literal "hello" nằm trong string pool; new String("hello") luôn tạo một đối tượng mới trên heap, nên == (so sánh tham chiếu) là false, còn equals so từng ký tự nên là true. Bài 1.F, slide 16.' },
    { id: 'q3',
      question: 'What is printed?|||Đoạn code in ra gì?',
      code: `Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println((a == b) + " " + (c == d));`,
      codeLang: 'java',
      options: ['true false|||true false', 'true true|||true true', 'false false|||false false', 'false true|||false true'],
      correctIndex: 0,
      points: 1,
      explanation: 'Output of the real program: "true false". Autoboxing calls Integer.valueOf, which returns cached objects for -128..127: both 127s are the same object. 128 is outside the cache, so c and d are two different objects and == compares references. Always compare wrapper values with equals (c.equals(d) is true). Lesson 1.E, slide 12.|||Output của chương trình thật: "true false". Tự đóng hộp gọi Integer.valueOf, hàm này trả đối tượng lưu đệm cho -128..127: hai số 127 là cùng một đối tượng. 128 nằm ngoài bộ đệm, nên c và d là hai đối tượng khác nhau và == so tham chiếu. Luôn so giá trị lớp bao bằng equals (c.equals(d) là true). Bài 1.E, slide 12.' },
    { id: 'q4',
      question: 'What is printed?|||Đoạn code in ra gì?',
      code: `byte b = (byte) 200;
System.out.println(b);`,
      codeLang: 'java',
      options: ['200|||200', '127|||127', '-56|||-56', 'A compile-time error: possible lossy conversion|||Lỗi biên dịch: possible lossy conversion'],
      correctIndex: 2,
      points: 1,
      explanation: "Output of the real program: \"-56\". The explicit cast makes it compile (without it javac would report possible lossy conversion). 200 is 1100 1000 in binary; a byte keeps those 8 bits, and as a signed two's-complement byte that is 200 - 256 = -56. The cast does not clamp to 127. Lesson 1.D, slide 20.|||Output của chương trình thật: \"-56\". Phép ép tường minh làm nó biên dịch được (thiếu nó javac sẽ báo possible lossy conversion). 200 là 1100 1000 ở hệ nhị phân; byte giữ 8 bit đó, và hiểu theo byte có dấu bù hai thì là 200 - 256 = -56. Phép ép không chặn về 127. Bài 1.D, slide 20." },
    { id: 'q5',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Đoạn code in ra gì?',
      code: `int sum = 0;
for (int i = 0; i <= 10; i++) {
    sum += (i % 2 == 0 ? i : -i);
}
System.out.println(sum);`,
      codeLang: 'java',
      options: ['5|||5', '2|||2', '3|||3', 'The program throws an exception|||Chương trình ném ngoại lệ'],
      correctIndex: 0,
      points: 1,
      explanation: 'Output of the real program: 5. For i = 0..10 the ternary adds even numbers and subtracts odd ones: (0 + 2 + 4 + 6 + 8 + 10) - (1 + 3 + 5 + 7 + 9) = 30 - 25 = 5. Nothing can throw here. Lesson 1.D, slides 10 and 17.|||Output của chương trình thật: 5. Với i = 0..10, toán tử ba ngôi cộng số chẵn và trừ số lẻ: (0 + 2 + 4 + 6 + 8 + 10) - (1 + 3 + 5 + 7 + 9) = 30 - 25 = 5. Ở đây không có gì ném ngoại lệ được. Bài 1.D, slide 10 và 17.' },
    { id: 'q6',
      question: 'What is printed?|||Đoạn code in ra gì?',
      code: `System.out.println(1 + 2 + "3" + 4 + 5);`,
      codeLang: 'java',
      options: ['15|||15', '12345|||12345', '339|||339', '3345|||3345'],
      correctIndex: 3,
      points: 1,
      explanation: 'Output of the real program: "3345". + is evaluated left to right: 1 + 2 = 3 (two ints add), 3 + "3" = "33" (an int and a String join), then "33" + 4 = "334" and "334" + 5 = "3345". After the first String everything is concatenation. Write "3" + (4 + 5) to get "39". Lesson 1.D, slide 19.|||Output của chương trình thật: "3345". + được tính từ trái sang phải: 1 + 2 = 3 (hai int cộng nhau), 3 + "3" = "33" (int với String thì nối), rồi "33" + 4 = "334" và "334" + 5 = "3345". Sau String đầu tiên mọi thứ là phép nối. Viết "3" + (4 + 5) mới được "39". Bài 1.D, slide 19.' },
    { id: 'q7',
      question: 'What is printed?|||Đoạn code in ra gì?',
      code: `System.out.println((-8 >> 1) + " " + (-8 >>> 28));`,
      codeLang: 'java',
      options: ['-4 -1|||-4 -1', '-4 15|||-4 15', '4 15|||4 15', '-4 268435455|||-4 268435455'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: "-4 15". >> copies the sign bit, so -8 >> 1 = -4 (divide by 2). >>> shifts in zeros: -8 is 1111…1000 (32 bits); shifting it 28 places right leaves only the top four 1-bits, 1111 = 15. -1 would be the result of -8 >> 28 (signed). An int has 32 bits, not 16 as the school slide draws. Lesson 1.D, slides 11–12.|||Output của chương trình thật: "-4 15". >> chép bit dấu, nên -8 >> 1 = -4 (chia 2). >>> đẩy vào các bit 0: -8 là 1111…1000 (32 bit); dịch phải 28 vị trí chỉ còn bốn bit 1 ở đầu, 1111 = 15. -1 là kết quả của -8 >> 28 (có dấu). Một int có 32 bit, không phải 16 như slide của trường vẽ. Bài 1.D, slide 11–12.' },
    { id: 'q8',
      question: 'What is printed?|||Đoạn code in ra gì?',
      code: `List<Integer> list = new ArrayList<Integer>(Arrays.asList(1, 3, 5, 7));
System.out.println(Collections.binarySearch(list, 4));`,
      codeLang: 'java',
      options: ['-1|||-1', '-2|||-2', '-3|||-3', '2|||2'],
      correctIndex: 2,
      points: 1,
      explanation: 'Output of the real program: -3. 4 is not in [1, 3, 5, 7]; binarySearch then returns -(insertion point) - 1. The insertion point (where 4 would go to keep the list sorted) is index 2, so the result is -2 - 1 = -3. Any negative value means "absent"; -1 is only returned when the insertion point is 0. Lesson 1.G, slide 13.|||Output của chương trình thật: -3. 4 không có trong [1, 3, 5, 7]; khi đó binarySearch trả về -(vị trí chèn) - 1. Vị trí chèn (chỗ 4 sẽ được đặt để danh sách vẫn có thứ tự) là chỉ số 2, nên kết quả là -2 - 1 = -3. Mọi giá trị âm đều nghĩa là "không có"; -1 chỉ xuất hiện khi vị trí chèn là 0. Bài 1.G, slide 13.' },
    { id: 'q9',
      question: 'What is printed?|||Đoạn code in ra gì?',
      code: `String s = "java";
s.toUpperCase();
s.concat("8");
System.out.println(s);`,
      codeLang: 'java',
      options: ['java|||java', 'JAVA|||JAVA', 'JAVA8|||JAVA8', 'java8|||java8'],
      correctIndex: 0,
      points: 1,
      explanation: 'Output of the real program: "java". String is immutable: toUpperCase() and concat("8") each return a NEW String, and both results are thrown away because they are not assigned. s still refers to "java". s = s.toUpperCase().concat("8") would give "JAVA8". Lesson 1.F, slide 15.|||Output của chương trình thật: "java". String là bất biến: toUpperCase() và concat("8") mỗi hàm trả về một String MỚI, và cả hai kết quả bị vứt đi vì không được gán. s vẫn trỏ tới "java". Viết s = s.toUpperCase().concat("8") mới ra "JAVA8". Bài 1.F, slide 15.' },
    { id: 'q10',
      question: '(FE question type) Given int[] arr = new int[100]; which statement is correct?|||(Dạng câu FE) Cho int[] arr = new int[100]; phát biểu nào đúng?',
      options: ['The maximum index of arr is 100|||Chỉ số lớn nhất của arr là 100', 'The maximum number of elements of arr is 100|||Số phần tử tối đa của arr là 100', 'Each element of arr is 1 by default|||Mỗi phần tử của arr mặc định bằng 1', 'arr[100] = 100; stores 100 in the last element|||arr[100] = 100; cất 100 vào phần tử cuối'],
      correctIndex: 1,
      points: 1,
      explanation: 'The array has exactly 100 elements, fixed at creation; indexes go from 0 to 99, so the maximum index is 99 and arr[100] throws ArrayIndexOutOfBoundsException at run time. Elements of a new int array are 0, not 1. Lesson 1.D, slides 6–8.|||Mảng có đúng 100 phần tử, cố định từ lúc tạo; chỉ số từ 0 tới 99, nên chỉ số lớn nhất là 99 và arr[100] ném ArrayIndexOutOfBoundsException lúc chạy. Phần tử của mảng int mới tạo bằng 0, không phải 1. Bài 1.D, slide 6–8.' },
  ],
};

export default {
  slides: [L_pro1_1, L_pro3_1, L_pro3_2, L_pro4_1, L_pro5_1, L_pro5_2, L_pro6_1],
  practice: L_on_ch1,
  labs: [L_lab1],
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 1 viết lại theo dạng câu FE PRO192, mỗi câu có giải thích song ngữ và đáp án kiểm bằng Java chạy thật: ép Integer sang String, == với literal và new String, bộ đệm Integer 127/128, ép (byte) 200, tổng với toán tử ba ngôi, 1 + 2 + "3" + 4 + 5, dịch bit >> và >>>, binarySearch với khoá không có, String bất biến, và mảng new int[100].',
};
