/**
 * SWD392 · Chương 1 — nền tảng thiết kế & UML (slide trường Ch.1–5).
 * Bài 📑 học theo từng slide: swd2 (Chapter_1-Introduction.pptx, slide 1–21); swd3 (Chapter_2-Overview of the UML Notation-n.pptx, slide 1–23); swd4 (Chapter_3 - Software Life Cycle Models and Processes.pptx, slide 1–24); swd5 (Chapter_4-Software_Design_and_Architecture_Concepts.pptx, slide 1–25); swd6 (Chapter_5 - Overview of Software Modeling.pptx, slide 1–8).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: swd392-on-ch1.
 * Quiz viết lại (10 câu, giữ slug swd392-quiz-1).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/SWD392/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node SWD392/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 1.A — 📑 Slide by slide · Introduction: modeling, UML, architecture, COMET, 4+1 views (school Chapter 1, slides 1–21) ───────── */
const L_swd2_1 = {
  title: '1.A — 📑 Slide by slide · Introduction: modeling, UML, architecture, COMET, 4+1 views (school Chapter 1, slides 1–21)|||1.A — 📑 Học theo từng slide · Mở đầu: mô hình hoá, UML, kiến trúc, COMET, góc nhìn 4+1 (Chapter 1 của trường, slide 1–21)',
  slug: 'swd392-slide-swd2-1',
  type: 'VIDEO',
  description: 'Giảng đủ 21 slide Chapter 1 của trường (Gomaa Ch.1): mô hình hoá phần mềm là gì, phương pháp hướng đối tượng và UML, kiến trúc phần mềm, notation – concept – strategy – method, COMET và ba mô hình, UML thành chuẩn OMG, PIM/PSM (kèm sơ đồ PlantUML dựng thật và code Java), góc nhìn 4+1 của Kruchten, bốn góc nhìn của Hofmeister, bảy góc nhìn của Gomaa, lịch sử các phương pháp thiết kế.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.A · school deck "Chapter 1: Introduction", slides 1–21</span>
<h2>Introduction to software modeling and design — the deck, slide by slide</h2>
<p class="lead">This deck is sessions 1–2 of SWD392. It has no diagram to draw yet, but it gives you the vocabulary the whole course and the 60-minute theory exam are built on: model, view, UML, notation vs method, software architecture, COMET, PIM vs PSM, the 4+1 views. The textbook is Hassan Gomaa, <em>Software Modeling and Design</em>, chapter 1 — most sentences on the slides are copied from it, and the book's end-of-chapter multiple-choice questions look exactly like exam questions.</p>
<p>Wherever the slide is too short for a beginner, this lesson adds material and marks it <strong>➕ Beyond the slide</strong>. Diagrams are real PlantUML, rendered for you; open "PlantUML source" under each picture, copy it to <a href="https://www.plantuml.com/plantuml">plantuml.com</a> and change it.</p>
<div class="callout">🧭 <strong>Running example — LabFlow.</strong> Many examples use LabFlow, a lab-reservation system (students reserve lab slots, lab managers approve, the system sends notifications), built with Spring Boot + React + PostgreSQL. It is an <em>illustration</em>, not part of the school slides.</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.A · bộ slide "Chapter 1: Introduction" của trường, slide 1–21</span>
<h2>Mở đầu về mô hình hoá và thiết kế phần mềm — học bộ slide từng trang</h2>
<p class="lead">Đây là bộ slide của buổi 1–2 môn SWD392. Chưa phải vẽ sơ đồ nào, nhưng nó cho bạn bộ từ vựng mà cả môn và bài thi lý thuyết 60 phút dựa vào: mô hình (model), góc nhìn (view), UML, ký pháp (notation) khác phương pháp (method), kiến trúc phần mềm (software architecture), COMET, PIM khác PSM, mô hình 4+1 góc nhìn. Giáo trình là Hassan Gomaa, <em>Software Modeling and Design</em>, chương 1 — phần lớn câu trên slide chép từ sách, và câu trắc nghiệm cuối chương của sách giống hệt kiểu câu thi.</p>
<p>Chỗ nào slide quá ngắn với người mới, bài này giảng thêm và đánh dấu <strong>➕ Mở rộng ngoài slide</strong>. Sơ đồ là PlantUML thật, đã dựng sẵn; mở mục "Mã PlantUML" dưới mỗi hình, chép sang <a href="https://www.plantuml.com/plantuml">plantuml.com</a> rồi sửa thử.</p>
<div class="callout">🧭 <strong>Ví dụ xuyên suốt — LabFlow.</strong> Nhiều ví dụ dùng LabFlow, hệ thống đặt phòng lab (sinh viên đặt ca lab, quản lý lab duyệt, hệ thống gửi thông báo), làm bằng Spring Boot + React + PostgreSQL. Đây là <em>ví dụ minh hoạ</em>, không có trên slide trường.</div>`),
    walkHead('swd2', 1, 21),
    walk('swd2', [
      [1, 'Chapter 1: Introduction',
        `<p class="y-chinh">🎯 Chapter 1 answers: what does it mean to "model" and "design" software before writing code, and which language (UML) and method (COMET) this course uses.</p>
<p>The chapter is an overview: it defines the words, gives a short history, and points to the chapters where each idea is used for real (use cases in Ch.6, class diagrams in Ch.7, architecture from Ch.12).</p>
<p class="meo">🧠 Read this deck for <strong>definitions</strong>: theory-exam questions of the form "What is a software design strategy?" come straight from it.</p>`,
        `<p class="y-chinh">🎯 Chương 1 trả lời: "mô hình hoá" và "thiết kế" phần mềm trước khi viết code nghĩa là gì, và môn này dùng ngôn ngữ nào (UML), phương pháp nào (COMET).</p>
<p>Chương này là phần tổng quan: định nghĩa các từ, kể lịch sử ngắn, và chỉ ra chương nào sẽ dùng thật từng ý (use case ở Ch.6, sơ đồ lớp ở Ch.7, kiến trúc từ Ch.12).</p>
<p class="meo">🧠 Học bộ slide này để nắm <strong>định nghĩa</strong>: câu thi lý thuyết dạng "Software design strategy là gì?" lấy thẳng từ đây.</p>`],
      [2, 'Contents',
        `<p class="y-chinh">🎯 Ten boxes = ten sections of Gomaa chapter 1: modeling → OO methods and UML → architecture → method and notation → COMET → UML as a standard → multiple views → history (three boxes).</p>
<p>The slide lists box 9 "Evolution of object-oriented analysis and design methods", but the deck has no slide with that number: its content (Booch, Rumbaugh, Shlaer &amp; Mellor…) sits inside slide 20, and slide 21 is numbered "9. Survey…" instead of 10. Do not be confused by the numbering.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>What you must be able to do</th></tr></thead>
<tbody>
<tr><td>3–6</td><td>Modeling, OO methods, UML</td><td>define software modeling; name the 4 kinds of modeling</td></tr>
<tr><td>7</td><td>Software architecture</td><td>define it; two levels of detail; quality attributes</td></tr>
<tr><td>8–9</td><td>Method and notation</td><td>tell notation / concept / strategy / structuring criteria / method apart</td></tr>
<tr><td>10</td><td>COMET</td><td>name the 3 models and what each contains</td></tr>
<tr><td>11–13</td><td>UML standard, MDA</td><td>UML versions; PIM vs PSM</td></tr>
<tr><td>14–18</td><td>Multiple views</td><td>4+1 (Kruchten), 4 views (Hofmeister), 7 views (Gomaa) + their diagrams</td></tr>
<tr><td>19–21</td><td>History</td><td>who introduced what, and in which order</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Mười ô = mười mục của chương 1 sách Gomaa: mô hình hoá → phương pháp hướng đối tượng và UML → kiến trúc → phương pháp và ký pháp → COMET → UML thành chuẩn → nhiều góc nhìn → lịch sử (ba ô).</p>
<p>Slide ghi ô 9 "Evolution of object-oriented analysis and design methods" (sự phát triển của các phương pháp phân tích – thiết kế hướng đối tượng), nhưng bộ slide không có trang nào mang số đó: nội dung ấy (Booch, Rumbaugh, Shlaer &amp; Mellor…) nằm trong slide 20, còn slide 21 lại đánh số "9. Survey…" thay vì 10. Đừng bị rối vì số thứ tự.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong phải làm được</th></tr></thead>
<tbody>
<tr><td>3–6</td><td>Mô hình hoá, phương pháp OO, UML</td><td>định nghĩa software modeling; kể 4 loại mô hình hoá</td></tr>
<tr><td>7</td><td>Kiến trúc phần mềm</td><td>định nghĩa; hai mức chi tiết; thuộc tính chất lượng</td></tr>
<tr><td>8–9</td><td>Phương pháp và ký pháp</td><td>phân biệt notation / concept / strategy / structuring criteria / method</td></tr>
<tr><td>10</td><td>COMET</td><td>kể 3 mô hình và mỗi mô hình chứa gì</td></tr>
<tr><td>11–13</td><td>Chuẩn UML, MDA</td><td>các phiên bản UML; PIM khác PSM</td></tr>
<tr><td>14–18</td><td>Nhiều góc nhìn</td><td>4+1 (Kruchten), 4 góc nhìn (Hofmeister), 7 góc nhìn (Gomaa) + sơ đồ của từng cái</td></tr>
<tr><td>19–21</td><td>Lịch sử</td><td>ai đưa ra cái gì, theo thứ tự nào</td></tr>
</tbody>
</table>`],
      [3, '1. Software Modeling',
        `<p class="y-chinh">🎯 Software modeling = designing the software before coding it, using models seen from several views (requirements, static, dynamic); UML is the graphical language that makes those views easy to build and to communicate.</p>
<ul>
<li><strong>Model</strong>: a simplified picture of a system that keeps only what matters for one question. A map of Da Nang is a model: it drops the trees, keeps the streets.</li>
<li><strong>Model-based development</strong>: models are built and analysed <em>first</em>, and then direct the implementation — not drawn afterwards as decoration.</li>
<li><strong>Multiple views</strong>: one diagram cannot show everything. A <em>requirements model</em> says what users can do, a <em>static model</em> shows the classes and how they are related, a <em>dynamic model</em> shows what happens over time.</li>
</ul>
<div class="pitfall">The slide (and the book) write "Object <strong>Modeling</strong> Group". The organisation's real name is Object <strong>Management</strong> Group (OMG). If an exam option says "OMG = Object Management Group", it is correct; the acronym is what matters.</div>
<div class="callout">🧭 <strong>Apply to LabFlow (illustration).</strong> Requirements view: "Student reserves a lab slot". Static view: classes <code>Student</code>, <code>Lab</code>, <code>Reservation</code>. Dynamic view: a reservation goes Pending → Approved → Completed. Three views, one system.</div>`,
        `<p class="y-chinh">🎯 Mô hình hoá phần mềm (software modeling) = thiết kế phần mềm trước khi code, bằng các mô hình nhìn từ nhiều góc (yêu cầu, tĩnh, động); UML là ngôn ngữ hình vẽ giúp dựng và trao đổi các góc nhìn đó.</p>
<p>Định nghĩa của OMG trên slide: <em>"modeling is the designing of software applications before coding"</em> — mô hình hoá là thiết kế ứng dụng phần mềm trước khi viết code.</p>
<ul>
<li><strong>Mô hình (model)</strong>: bức tranh rút gọn của hệ thống, chỉ giữ cái cần cho một câu hỏi. Bản đồ Đà Nẵng là một mô hình: bỏ cây cối, giữ đường phố.</li>
<li><strong>Phát triển dựa trên mô hình (model-based)</strong>: mô hình được dựng và phân tích <em>trước</em>, rồi dẫn đường cho việc code — không phải vẽ sau cho đẹp hồ sơ.</li>
<li><strong>Nhiều góc nhìn (multiple views)</strong>: một sơ đồ không thể chứa mọi thứ. <em>Mô hình yêu cầu</em> nói người dùng làm được gì, <em>mô hình tĩnh</em> cho thấy các lớp và quan hệ giữa chúng, <em>mô hình động</em> cho thấy chuyện gì xảy ra theo thời gian.</li>
</ul>
<div class="pitfall">Slide (và sách) viết "Object <strong>Modeling</strong> Group". Tên thật của tổ chức là Object <strong>Management</strong> Group (OMG). Phương án thi ghi "OMG = Object Management Group" là đúng; điều thi hỏi là chữ viết tắt OMG.</div>
<div class="callout">🧭 <strong>Áp vào LabFlow (minh hoạ).</strong> Góc nhìn yêu cầu: "Sinh viên đặt một ca lab". Góc nhìn tĩnh: các lớp <code>Student</code>, <code>Lab</code>, <code>Reservation</code>. Góc nhìn động: một lượt đặt đi Pending → Approved → Completed. Ba góc nhìn, một hệ thống.</div>`],
      [4, '2. Object-Oriented Methods and the Unified Modeling Language',
        `<p class="y-chinh">🎯 OO methods rest on three concepts — information hiding, classes, inheritance; UML is the standard notation for OO models, but it is methodology-independent, so it must be paired with a method.</p>
<ul>
<li><strong>Information hiding</strong>: a module hides its data and details behind an interface; others use only the interface. Result: you can change the inside without breaking the outside.</li>
<li><strong>Class</strong>: the template for objects of one kind. <strong>Inheritance</strong>: a new class adapts an existing one systematically.</li>
</ul>
<p>The picture (Figure 1.1 of the book) shows a model of the Great Pyramid next to the real pyramid: people have built small models before building big things for thousands of years. Software models play the same role.</p>
<p class="meo">🧠 <strong>UML = the alphabet, the method = the grammar of the essay.</strong> UML tells you how to draw a class; it does not tell you which classes to draw or in what order. COMET (slide 10) does that.</p>
<div class="pitfall">"UML is a software development method" — <strong>false</strong>. UML is a <em>notation</em> (language); it is methodology-independent.</div>`,
        `<p class="y-chinh">🎯 Phương pháp hướng đối tượng (object-oriented — OO) dựa trên ba khái niệm — che giấu thông tin, lớp, kế thừa; UML là ký pháp chuẩn cho mô hình OO, nhưng UML không gắn với phương pháp nào (methodology-independent) nên phải đi kèm một phương pháp.</p>
<ul>
<li><strong>Che giấu thông tin (information hiding)</strong>: một module giấu dữ liệu và chi tiết sau một giao diện (interface); bên ngoài chỉ dùng giao diện. Nhờ vậy đổi ruột bên trong không làm hỏng bên ngoài.</li>
<li><strong>Lớp (class)</strong>: khuôn cho các đối tượng cùng loại. <strong>Kế thừa (inheritance)</strong>: lớp mới điều chỉnh một lớp có sẵn một cách có hệ thống.</li>
</ul>
<p>Hình bên (Figure 1.1 của sách) đặt mô hình kim tự tháp cạnh kim tự tháp thật: con người đã làm mô hình nhỏ trước khi xây thứ lớn từ hàng nghìn năm. Mô hình phần mềm đóng đúng vai đó.</p>
<p class="meo">🧠 <strong>UML = bảng chữ cái, phương pháp = cách viết bài văn.</strong> UML dạy vẽ một lớp thế nào; nó không nói phải vẽ lớp nào, theo thứ tự nào. COMET (slide 10) làm việc đó.</p>
<div class="pitfall">"UML là một phương pháp phát triển phần mềm" — <strong>sai</strong>. UML là <em>ký pháp</em> (ngôn ngữ); nó độc lập với phương pháp.</div>`],
      [5, '2. Object-Oriented Methods and the Unified Modeling Language',
        `<p class="y-chinh">🎯 A modern OO method combines four kinds of modeling — use case, static, state machine, object interaction — and draws all of them in UML; use case modeling states the functional requirements as actors + use cases.</p>
<table>
<thead><tr><th>Kind of modeling</th><th>Question it answers</th><th>UML diagram</th><th>Course chapter</th></tr></thead>
<tbody>
<tr><td>Use case modeling</td><td>What must the system do, for whom?</td><td>use case diagram + text description</td><td>Ch.6</td></tr>
<tr><td>Static modeling</td><td>Which classes exist, with which attributes and relationships?</td><td>class diagram</td><td>Ch.7–8</td></tr>
<tr><td>Object interaction modeling</td><td>Which objects send which messages to carry out one use case?</td><td>sequence / communication diagram</td><td>Ch.9</td></tr>
<tr><td>State machine modeling</td><td>How does one object react to events over time?</td><td>state machine (statechart)</td><td>Ch.10–11</td></tr>
</tbody>
</table>
<p><strong>Actor</strong> = someone or something outside the system that interacts with it (a user role, another system, a device). <strong>Use case</strong> = a sequence of interactions between an actor and the system that gives the actor a useful result, e.g. "Reserve Lab Slot".</p>
<p class="meo">🧠 Four kinds, one sentence: <em>who uses it (use case) — what it is made of (static) — who talks to whom (interaction) — how it changes (state)</em>.</p>`,
        `<p class="y-chinh">🎯 Một phương pháp OO hiện đại kết hợp bốn kiểu mô hình hoá — use case, tĩnh, máy trạng thái, tương tác đối tượng — và vẽ tất cả bằng UML; mô hình use case nêu yêu cầu chức năng bằng actor + use case.</p>
<table>
<thead><tr><th>Kiểu mô hình hoá</th><th>Trả lời câu hỏi</th><th>Sơ đồ UML</th><th>Chương của môn</th></tr></thead>
<tbody>
<tr><td>Use case modeling (mô hình ca sử dụng)</td><td>Hệ thống phải làm gì, cho ai?</td><td>use case diagram + đặc tả chữ</td><td>Ch.6</td></tr>
<tr><td>Static modeling (mô hình tĩnh)</td><td>Có những lớp nào, thuộc tính và quan hệ ra sao?</td><td>class diagram</td><td>Ch.7–8</td></tr>
<tr><td>Object interaction modeling (tương tác đối tượng)</td><td>Những đối tượng nào gửi thông điệp gì để thực hiện một use case?</td><td>sequence / communication diagram</td><td>Ch.9</td></tr>
<tr><td>State machine modeling (máy trạng thái)</td><td>Một đối tượng phản ứng với sự kiện theo thời gian thế nào?</td><td>state machine (statechart)</td><td>Ch.10–11</td></tr>
</tbody>
</table>
<p><strong>Actor (tác nhân)</strong> = người hoặc thứ gì đó ở ngoài hệ thống và tương tác với nó (một vai trò người dùng, một hệ thống khác, một thiết bị). <strong>Use case (ca sử dụng)</strong> = chuỗi tương tác giữa actor và hệ thống mang lại cho actor một kết quả có ích, ví dụ "Reserve Lab Slot" (đặt ca lab).</p>
<p>Yêu cầu chức năng (functional requirement) = hệ thống phải <em>làm gì</em>; khác với yêu cầu phi chức năng (non-functional) = làm <em>tốt đến mức nào</em> (nhanh, an toàn…) — slide 7.</p>
<p class="meo">🧠 Bốn kiểu, một câu: <em>ai dùng (use case) — làm bằng gì (tĩnh) — ai nói với ai (tương tác) — thay đổi ra sao (trạng thái)</em>.</p>`],
      [6, '2. Object-Oriented Methods and the Unified Modeling Language',
        `<p class="y-chinh">🎯 Static modeling = structural view (classes, attributes, relationships); dynamic modeling = behavioural view: use cases are "realized" by interacting objects, and state-dependent behaviour is described by statecharts.</p>
<ul>
<li><strong>Structural view</strong>: what exists and does not change while the program runs — like the floor plan of a house.</li>
<li><strong>Behavioural view</strong>: what happens over time — like the path of a visitor walking through the house.</li>
<li><strong>Realize a use case</strong>: show which objects work together, and in which order, to carry out that use case. This is exactly the sequence diagram you draw in Assignment 02.</li>
<li><strong>State-dependent</strong>: the reaction to an event depends on the current state. "Cancel" on a Pending reservation just deletes it; on an Approved one it must also free the slot.</li>
</ul>
<p class="meo">🧠 Static = <em>nouns</em> of the requirement (Student, Lab, Reservation). Dynamic = <em>verbs</em> (reserve, approve, cancel) and <em>states</em> (Pending, Approved).</p>`,
        `<p class="y-chinh">🎯 Mô hình tĩnh = góc nhìn cấu trúc (lớp, thuộc tính, quan hệ); mô hình động = góc nhìn hành vi: use case được "hiện thực hoá" (realized) bằng các đối tượng tương tác, còn hành vi phụ thuộc trạng thái được mô tả bằng statechart.</p>
<ul>
<li><strong>Góc nhìn cấu trúc (structural view)</strong>: cái gì tồn tại và không đổi khi chương trình chạy — như bản vẽ mặt bằng ngôi nhà.</li>
<li><strong>Góc nhìn hành vi (behavioral view)</strong>: chuyện gì xảy ra theo thời gian — như đường đi của người khách đi qua các phòng.</li>
<li><strong>Hiện thực hoá use case (realize)</strong>: chỉ ra những đối tượng nào phối hợp, theo thứ tự nào, để thực hiện use case đó. Đây chính là sequence diagram bạn vẽ trong Assignment 02.</li>
<li><strong>Phụ thuộc trạng thái (state-dependent)</strong>: phản ứng với một sự kiện tuỳ trạng thái hiện tại. "Huỷ" một lượt đặt đang Pending thì chỉ xoá; lượt đã Approved thì còn phải trả lại ca.</li>
</ul>
<p>Sơ đồ tương tác đối tượng (object interaction diagram) là tên chung của sequence diagram và communication diagram — bài 1.B, 1.C vẽ cả hai.</p>
<p class="meo">🧠 Tĩnh = <em>danh từ</em> trong yêu cầu (Student, Lab, Reservation). Động = <em>động từ</em> (đặt, duyệt, huỷ) và <em>trạng thái</em> (Pending, Approved).</p>`],
      [7, '3. Software Architectural Design',
        `<p class="y-chinh">🎯 A software architecture separates the overall structure — components and their interconnections — from the internal details of each component; it exists at two levels of detail and must satisfy quality attributes (performance, security, maintainability).</p>
<ul>
<li><strong>High level</strong>: the system split into <em>subsystems</em>. <strong>Low level</strong>: each subsystem split into <em>modules/components</em>.</li>
<li>At both levels what matters is the <strong>external view</strong>: which interfaces a part <em>provides</em> and which it <em>requires</em>, and how parts are connected — not how each part is coded.</li>
<li>Gomaa: designing components and connections is "programming-in-the-large"; designing the inside of one component is "programming-in-the-small". The architecture is also called the <em>high-level design</em>.</li>
</ul>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/385c26829123decf991e2bc2e28983fee9246900.svg" alt="LabFlow at the high level: three subsystems, their interfaces and connections — the inside of each box is hidden" loading="lazy" /><p class="chu-thich">🧩 LabFlow at the high level: three subsystems, their interfaces and connections — the inside of each box is hidden</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
skinparam packageStyle folder
' Slide 7 — software architecture = components + interconnections (high level: subsystems)
' Illustrative LabFlow example, not from the school slide
package "LabFlow" &lt;&lt;system&gt;&gt; {
  package "Web Client" &lt;&lt;subsystem&gt;&gt; {
    component [React SPA] as UI
  }
  package "Booking" &lt;&lt;subsystem&gt;&gt; {
    component [Reservation Service] as RS
    interface IReservation
    RS - IReservation
  }
  package "Notification" &lt;&lt;subsystem&gt;&gt; {
    component [Notification Service] as NS
    interface INotify
    NS - INotify
  }
  database "PostgreSQL" as DB
}
UI ..&gt; IReservation : REST / JSON
RS ..&gt; INotify : event
RS --&gt; DB : JPA
@enduml</code></pre></details>
<p><strong>How to read it:</strong> a folder = a subsystem; a box with the small component icon = a component; a lollipop (line + circle) = an interface the component <em>provides</em>; a dashed arrow to an interface = "uses / requires it". You can replace the Notification subsystem (e-mail → Zalo) without touching Booking, as long as <code>INotify</code> stays the same — that is information hiding at architecture level.</p>
<div class="callout">➕ <strong>Beyond the slide — functional vs non-functional.</strong> Functional requirements say <em>what</em> the system does (reserve a slot). Non-functional requirements — also called <em>quality attributes</em> — say <em>how well</em>: "the schedule page loads in under 2 s" (performance), "only the lab manager can approve" (security), "a new notification channel can be added in one day" (maintainability). Architecture decisions are driven mostly by the non-functional ones; Chapter 3 of this course (school Ch.20) is entirely about them.</div>`,
        `<p class="y-chinh">🎯 Kiến trúc phần mềm (software architecture) tách cấu trúc tổng thể — các thành phần (component) và kết nối giữa chúng — khỏi chi tiết bên trong từng thành phần; nó có hai mức chi tiết và phải đáp ứng các thuộc tính chất lượng (hiệu năng, bảo mật, dễ bảo trì).</p>
<ul>
<li><strong>Mức cao</strong>: chia hệ thống thành các <em>hệ thống con (subsystem)</em>. <strong>Mức thấp</strong>: chia mỗi subsystem thành <em>module/component</em>.</li>
<li>Ở cả hai mức, điều quan trọng là <strong>góc nhìn từ ngoài</strong>: một phần <em>cung cấp (provide)</em> giao diện nào, <em>cần (require)</em> giao diện nào, nối với nhau ra sao — không phải code bên trong viết thế nào.</li>
<li>Gomaa: thiết kế thành phần và kết nối là "lập trình tầm lớn" (programming-in-the-large); thiết kế ruột một thành phần là "lập trình tầm nhỏ" (programming-in-the-small). Kiến trúc còn được gọi là <em>thiết kế mức cao (high-level design)</em>.</li>
</ul>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/385c26829123decf991e2bc2e28983fee9246900.svg" alt="LabFlow ở mức cao: ba subsystem, giao diện và kết nối — ruột mỗi hộp bị giấu đi" loading="lazy" /><p class="chu-thich">🧩 LabFlow ở mức cao: ba subsystem, giao diện và kết nối — ruột mỗi hộp bị giấu đi</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
skinparam packageStyle folder
' Slide 7 — kiến trúc = thành phần + kết nối (mức cao: chia thành subsystem); ví dụ LabFlow minh hoạ
' Ví dụ LabFlow minh hoạ, không có trên slide trường
package "LabFlow" &lt;&lt;system&gt;&gt; {
  package "Web Client" &lt;&lt;subsystem&gt;&gt; {
    component [React SPA] as UI
  }
  package "Booking" &lt;&lt;subsystem&gt;&gt; {
    component [Reservation Service] as RS
    interface IReservation
    RS - IReservation
  }
  package "Notification" &lt;&lt;subsystem&gt;&gt; {
    component [Notification Service] as NS
    interface INotify
    NS - INotify
  }
  database "PostgreSQL" as DB
}
UI ..&gt; IReservation : REST / JSON
RS ..&gt; INotify : event
RS --&gt; DB : JPA
@enduml</code></pre></details>
<p><strong>Cách đọc:</strong> hình thư mục = một subsystem; hộp có biểu tượng component nhỏ = một component; que kẹo mút (đường + vòng tròn) = giao diện mà component <em>cung cấp</em>; mũi tên nét đứt chỉ vào giao diện = "dùng / cần nó". Bạn có thể thay subsystem Notification (e-mail → Zalo) mà không đụng tới Booking, miễn <code>INotify</code> giữ nguyên — đó là che giấu thông tin ở tầm kiến trúc.</p>
<div class="callout">➕ <strong>Mở rộng ngoài slide — chức năng và phi chức năng.</strong> Yêu cầu chức năng nói hệ thống làm <em>gì</em> (đặt ca). Yêu cầu phi chức năng — còn gọi là <em>thuộc tính chất lượng (quality attributes)</em> — nói làm <em>tốt đến đâu</em>: "trang lịch mở dưới 2 giây" (hiệu năng — performance), "chỉ quản lý lab được duyệt" (bảo mật — security), "thêm một kênh thông báo mới trong một ngày" (dễ bảo trì — maintainability). Quyết định kiến trúc chủ yếu do yêu cầu phi chức năng dẫn dắt; Chương 3 của môn (slide trường Ch.20) nói riêng về chúng.</div>`],
      [8, '4. Method and Notation',
        `<p class="y-chinh">🎯 A software design notation describes a design graphically, textually, or both; UML is a graphical notation — the slide shows the same class <code>CardAccount</code> written as text (left) and as a UML class box (right).</p>
<p>Textual notation examples: pseudocode, the code-like block on the slide. Graphical notation examples: UML class diagrams, flowcharts. Below, the right-hand box redrawn with PlantUML, and the left-hand text made into real, running Java:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/9915f9f2ce05fb80d6a498fb844ceb7fb7983027.svg" alt="The class CardAccount in UML: name compartment (with the stereotype «entity»), attribute compartment" loading="lazy" /><p class="chu-thich">🧩 The class CardAccount in UML: name compartment (with the stereotype «entity»), attribute compartment</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 8 — the same class in UML notation (graphical)
hide circle
skinparam classAttributeIconSize 0
class CardAccount &lt;&lt;entity&gt;&gt; {
  cardId : String
  accountNumber : String
  accountType : String
}
@enduml</code></pre></details>
<pre><code class="language-java">// Slide 8: the textual notation of the slide, written as real Java
public class CardAccount {
    // the three attributes of the UML box «entity» CardAccount
    String cardId;
    String accountNumber;
    String accountType;

    CardAccount(String cardId, String accountNumber, String accountType) {
        this.cardId = cardId;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
    }

    public static void main(String[] args) {
        // one class (the type) → many objects (instances)
        CardAccount a = new CardAccount("C-001", "0123456789", "DEBIT");
        CardAccount b = new CardAccount("C-002", "9876543210", "CREDIT");
        for (CardAccount x : new CardAccount[] { a, b }) {
            System.out.println(x.cardId + " | " + x.accountNumber + " | " + x.accountType);
        }
    }
}</code></pre>
<div class="out">C-001 | 0123456789 | DEBIT<br>
C-002 | 9876543210 | CREDIT</div>
<p><strong>Read the box:</strong> top compartment = class name, here with the stereotype <code>«entity»</code> (a class that stores long-lived data — explained in lesson 1.C, slide 21); middle compartment = attributes written <code>name : Type</code>. The operations compartment is omitted because the class has none.</p>
<div class="pitfall">Gomaa: a notation "suggests a particular approach for performing a design; however, it does <strong>not</strong> provide a systematic approach for producing a design". Knowing UML does not mean you know how to design — that is the difference between slide 8 and slide 9.</div>
<p class="meo">🧠 In UML the type comes <em>after</em> the name (<code>cardId : String</code>); in Java it comes <em>before</em> (<code>String cardId</code>). Mixing the two orders on a PE diagram is a classic lost point.</p>`,
        `<p class="y-chinh">🎯 Ký pháp thiết kế phần mềm (software design notation) mô tả một thiết kế bằng hình, bằng chữ, hoặc cả hai; UML là ký pháp dạng hình — slide đặt cùng một lớp <code>CardAccount</code> viết bằng chữ (trái) và vẽ thành hộp lớp UML (phải).</p>
<p>Ví dụ ký pháp dạng chữ: mã giả (pseudocode), khối giống code trên slide. Ví dụ dạng hình: sơ đồ lớp UML, lưu đồ (flowchart). Dưới đây là hộp bên phải vẽ lại bằng PlantUML, và phần chữ bên trái viết thành Java thật, chạy được:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/9915f9f2ce05fb80d6a498fb844ceb7fb7983027.svg" alt="Lớp CardAccount trong UML: ngăn tên (có stereotype «entity»), ngăn thuộc tính" loading="lazy" /><p class="chu-thich">🧩 Lớp CardAccount trong UML: ngăn tên (có stereotype «entity»), ngăn thuộc tính</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 8 — cùng lớp đó vẽ bằng ký hiệu UML (dạng hình)
hide circle
skinparam classAttributeIconSize 0
class CardAccount &lt;&lt;entity&gt;&gt; {
  cardId : String
  accountNumber : String
  accountType : String
}
@enduml</code></pre></details>
<pre><code class="language-java">// Slide 8: ký hiệu dạng chữ trên slide, viết thành Java thật
public class CardAccount {
    // ba thuộc tính trong hộp UML «entity» CardAccount
    String cardId;
    String accountNumber;
    String accountType;

    CardAccount(String cardId, String accountNumber, String accountType) {
        this.cardId = cardId;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
    }

    public static void main(String[] args) {
        // một lớp (kiểu) → nhiều đối tượng (thể hiện)
        CardAccount a = new CardAccount("C-001", "0123456789", "DEBIT");
        CardAccount b = new CardAccount("C-002", "9876543210", "CREDIT");
        for (CardAccount x : new CardAccount[] { a, b }) {
            System.out.println(x.cardId + " | " + x.accountNumber + " | " + x.accountType);
        }
    }
}</code></pre>
<div class="out">C-001 | 0123456789 | DEBIT<br>
C-002 | 9876543210 | CREDIT</div>
<p><strong>Đọc hộp:</strong> ngăn trên = tên lớp, ở đây kèm stereotype <code>«entity»</code> (lớp thực thể — lớp giữ dữ liệu sống lâu, giải thích ở bài 1.C, slide 21); ngăn giữa = thuộc tính, viết <code>tên : Kiểu</code>. Ngăn thao tác (operation) được bỏ vì lớp không có thao tác nào.</p>
<div class="pitfall">Gomaa: ký pháp "gợi ý một cách làm thiết kế, nhưng <strong>không</strong> cho một cách làm có hệ thống để tạo ra thiết kế". Biết UML không có nghĩa là biết thiết kế — đó chính là chỗ khác giữa slide 8 và slide 9.</div>
<p class="meo">🧠 Trong UML kiểu đứng <em>sau</em> tên (<code>cardId : String</code>); trong Java kiểu đứng <em>trước</em> (<code>String cardId</code>). Trộn hai thứ tự trên sơ đồ bài PE là lỗi mất điểm kinh điển.</p>`],
      [9, '4. Method and Notation',
        `<p class="y-chinh">🎯 Five terms, each with the slide's example: concept (information hiding), strategy (object-oriented decomposition), structuring criteria (object structuring criteria), method (a sequence of steps from requirements to design) — and COMET, a method built on them.</p>
<table>
<thead><tr><th>Term</th><th>Definition (Gomaa)</th><th>Example</th><th>Everyday analogy (building a house)</th></tr></thead>
<tbody>
<tr><td>Design notation</td><td>a way to describe a design, graphically/textually</td><td>UML, pseudocode</td><td>the symbols of an architect's drawing</td></tr>
<tr><td>Design concept</td><td>a fundamental idea applied when designing</td><td>information hiding</td><td>"rooms have doors, pipes hide in walls"</td></tr>
<tr><td>Design strategy</td><td>an overall plan and direction for the design</td><td>object-oriented decomposition</td><td>"design room by room" vs "design floor by floor"</td></tr>
<tr><td>Structuring criteria</td><td>heuristics/guidelines to split the system into components</td><td>object structuring criteria (Ch.8)</td><td>"a bathroom needs water, so put it near the pipes"</td></tr>
<tr><td>Design method</td><td>a systematic sequence of steps, from requirements to a design</td><td>COMET</td><td>the full procedure of an architecture firm</td></tr>
</tbody>
</table>
<p>Gomaa adds: a method <em>is based on</em> concepts, <em>employs</em> strategies, and <em>documents</em> the result with a notation. COMET's concepts: information hiding, classes, inheritance, concurrent tasks; its strategy: <strong>concurrent object design</strong> — structuring the system into active and passive objects (lesson 1.C, slide 17).</p>
<div class="pitfall">Gomaa's own quiz (Ch.1, questions 4–8) asks each definition with the other four as distractors. Memorise the key word: notation → <em>describe</em>; concept → <em>idea</em>; strategy → <em>plan and direction</em>; criteria → <em>guidelines</em>; method → <em>systematic steps</em>.</div>`,
        `<p class="y-chinh">🎯 Năm thuật ngữ, mỗi cái kèm ví dụ của slide: khái niệm — concept (che giấu thông tin), chiến lược — strategy (phân rã hướng đối tượng), tiêu chí cấu trúc — structuring criteria (tiêu chí chia đối tượng), phương pháp — method (chuỗi bước từ yêu cầu tới thiết kế) — và COMET, một phương pháp dựng trên chúng.</p>
<table>
<thead><tr><th>Thuật ngữ</th><th>Định nghĩa (Gomaa)</th><th>Ví dụ</th><th>Liên tưởng đời thường (xây nhà)</th></tr></thead>
<tbody>
<tr><td>Design notation (ký pháp)</td><td>cách mô tả thiết kế bằng hình/chữ</td><td>UML, mã giả</td><td>bộ ký hiệu trên bản vẽ kiến trúc</td></tr>
<tr><td>Design concept (khái niệm)</td><td>ý tưởng nền tảng áp dụng khi thiết kế</td><td>che giấu thông tin</td><td>"phòng có cửa, ống nước giấu trong tường"</td></tr>
<tr><td>Design strategy (chiến lược)</td><td>kế hoạch và hướng đi tổng thể của thiết kế</td><td>phân rã hướng đối tượng</td><td>"thiết kế từng phòng" hay "thiết kế từng tầng"</td></tr>
<tr><td>Structuring criteria (tiêu chí cấu trúc)</td><td>kinh nghiệm/hướng dẫn để chia hệ thống thành thành phần</td><td>tiêu chí chia đối tượng (Ch.8)</td><td>"nhà tắm cần nước nên đặt gần đường ống"</td></tr>
<tr><td>Design method (phương pháp)</td><td>chuỗi bước có hệ thống, từ yêu cầu ra thiết kế</td><td>COMET</td><td>toàn bộ quy trình làm việc của công ty kiến trúc</td></tr>
</tbody>
</table>
<p>Gomaa nói thêm: một phương pháp <em>dựa trên</em> các khái niệm, <em>dùng</em> các chiến lược, và <em>ghi lại</em> kết quả bằng một ký pháp. Khái niệm của COMET: che giấu thông tin, lớp, kế thừa, tác vụ đồng thời (concurrent tasks); chiến lược: <strong>thiết kế đối tượng đồng thời (concurrent object design)</strong> — chia hệ thống thành đối tượng chủ động và bị động (bài 1.C, slide 17).</p>
<div class="pitfall">Câu hỏi cuối chương của chính Gomaa (Ch.1, câu 4–8) hỏi từng định nghĩa, lấy bốn định nghĩa kia làm phương án nhiễu. Nhớ từ khoá: notation → <em>mô tả</em>; concept → <em>ý tưởng</em>; strategy → <em>kế hoạch và hướng đi</em>; criteria → <em>hướng dẫn chia</em>; method → <em>các bước có hệ thống</em>.</div>`],
      [10, '5. COMET: A UML-based Software Modeling and Design Method for Software Applications',
        `<p class="y-chinh">🎯 COMET is an iterative, use-case-driven, object-oriented method with three models: requirements model (actors + use cases), analysis model (objects that realize each use case and their interactions), design model (software architecture: distribution, concurrency, information hiding).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/5024e82854b50912c93b5da0f580aaf40628c787.svg" alt="COMET as a flow: requirements once, then analysis → design → construction repeated for each increment" loading="lazy" /><p class="chu-thich">🧩 COMET as a flow: requirements once, then analysis → design → construction repeated for each increment</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 10 — COMET: three models, use case driven, iterative
start
:Requirements Modeling
(actors + use cases);
note right: Requirements model
repeat
  :Analysis Modeling
  (objects that realize each use case
  + their interactions, statecharts);
  note right: Analysis model
  :Design Modeling
  (software architecture: subsystems,
  distribution, concurrency, information hiding);
  note right: Design model
  :Incremental Software Construction
  and Integration;
repeat while (more use cases / next increment?) is (yes) not (no)
:System Testing;
stop
@enduml</code></pre></details>
<ul>
<li><strong>Use case driven</strong>: every later model is organised around the use cases — each use case is realized in the analysis model, then allocated to the architecture.</li>
<li><strong>Iterative</strong>: you do not finish the whole analysis before any design; you loop (the arrow back up), adding use cases increment by increment.</li>
<li><strong>Analysis vs design</strong>: analysis talks about the <em>problem</em> (what objects exist in the domain, how they cooperate); design talks about the <em>solution</em> (subsystems, which machine runs what, threads, interfaces).</li>
</ul>
<p>This is also the structure of your three assignments: Assignment 01 = use case model, 02 = analysis model, 03 = design model.</p>
<div class="callout">🧭 <strong>Apply to LabFlow (illustration).</strong> Requirements: use case "Reserve Lab Slot" with actor Student. Analysis: objects <code>: ReservationUI</code>, <code>: ReservationControl</code>, <code>aLab : Lab</code>, <code>: Reservation</code> and the messages between them. Design: a Booking subsystem in the Spring Boot backend, a React client, a Notification subsystem sending e-mails asynchronously.</div>`,
        `<p class="y-chinh">🎯 COMET là phương pháp lặp (iterative), dẫn dắt bởi use case (use case driven), hướng đối tượng, gồm ba mô hình: mô hình yêu cầu (actor + use case), mô hình phân tích (các đối tượng hiện thực hoá từng use case và tương tác của chúng), mô hình thiết kế (kiến trúc phần mềm: phân tán, đồng thời, che giấu thông tin).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/5024e82854b50912c93b5da0f580aaf40628c787.svg" alt="COMET vẽ thành luồng: yêu cầu làm một lần, rồi phân tích → thiết kế → xây dựng lặp lại cho từng phần tăng thêm" loading="lazy" /><p class="chu-thich">🧩 COMET vẽ thành luồng: yêu cầu làm một lần, rồi phân tích → thiết kế → xây dựng lặp lại cho từng phần tăng thêm</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 10 — COMET: ba mô hình, dẫn dắt bởi use case, lặp nhiều vòng
start
:Requirements Modeling
(actors + use cases);
note right: Requirements model
repeat
  :Analysis Modeling
  (objects that realize each use case
  + their interactions, statecharts);
  note right: Analysis model
  :Design Modeling
  (software architecture: subsystems,
  distribution, concurrency, information hiding);
  note right: Design model
  :Incremental Software Construction
  and Integration;
repeat while (more use cases / next increment?) is (yes) not (no)
:System Testing;
stop
@enduml</code></pre></details>
<ul>
<li><strong>Dẫn dắt bởi use case</strong>: mọi mô hình sau đều xoay quanh use case — mỗi use case được hiện thực hoá trong mô hình phân tích, rồi được phân vào kiến trúc.</li>
<li><strong>Lặp</strong>: không phải xong hết phân tích rồi mới thiết kế; bạn đi vòng (mũi tên quay lên), thêm use case theo từng đợt tăng (increment).</li>
<li><strong>Phân tích khác thiết kế</strong>: phân tích nói về <em>bài toán</em> (trong miền nghiệp vụ có đối tượng nào, chúng phối hợp ra sao); thiết kế nói về <em>lời giải</em> (subsystem, máy nào chạy gì, luồng, giao diện).</li>
</ul>
<p>Đây cũng là cấu trúc ba bài assignment của bạn: Assignment 01 = mô hình use case, 02 = mô hình phân tích, 03 = mô hình thiết kế.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow (minh hoạ).</strong> Yêu cầu: use case "Reserve Lab Slot", actor Student. Phân tích: các đối tượng <code>: ReservationUI</code>, <code>: ReservationControl</code>, <code>aLab : Lab</code>, <code>: Reservation</code> và thông điệp giữa chúng. Thiết kế: subsystem Booking trong backend Spring Boot, client React, subsystem Notification gửi e-mail bất đồng bộ.</div>`],
      [11, '6. UML as a Standard',
        `<p class="y-chinh">🎯 UML is a standard maintained by the OMG: first adopted version UML 1.3, minor revisions 1.4 and 1.5, a major revision in 2003 with UML 2.0; today's books follow UML 2.</p>
<p>The timeline on the slide reads left to right:</p>
<table>
<thead><tr><th>Period</th><th>What happened</th></tr></thead>
<tbody>
<tr><td>before 1995 — fragmentation</td><td>dozens of OO notations; the big three: Grady Booch (Booch method), Jim Rumbaugh (OMT), Ivar Jacobson (OOSE, use cases)</td></tr>
<tr><td>1995–1996 — unification</td><td>Booch + Rumbaugh publish the Unified Method 0.8; Jacobson joins → UML 0.9 and 0.91</td></tr>
<tr><td>Jan–Sep 1997 — standardization</td><td>UML 1.0 then 1.1 submitted to the OMG with partner companies; UML 1.1 adopted in November 1997</td></tr>
<tr><td>1998 onwards — industrialization</td><td>revisions by the OMG's Revision Task Force (RTF): 1.2, 1.3, 1.4, 1.5; UML 2.0 (2003–2005), then 2.1 … 2.5</td></tr>
</tbody>
</table>
<p>The three authors are nicknamed "the Three Amigos". UML 2 added new diagrams (composite structure, timing, interaction overview) and loops/conditions inside sequence diagrams.</p>
<div class="pitfall">Two dates, two different questions: UML was first <strong>adopted as a standard in 1997</strong> (version 1.1, per Gomaa section 1.6), while the slide says "the first adopted version was UML 1.3" (the first formally published OMG specification, 1999). The <strong>major revision is UML 2.0 in 2003</strong> — the most-asked fact.</div>`,
        `<p class="y-chinh">🎯 UML là chuẩn do OMG duy trì: phiên bản được chấp nhận đầu tiên là UML 1.3, sửa nhỏ ở 1.4 và 1.5, sửa lớn năm 2003 với UML 2.0; sách hiện nay theo UML 2.</p>
<p>Dòng thời gian trên slide đọc từ trái sang phải:</p>
<table>
<thead><tr><th>Giai đoạn</th><th>Chuyện gì xảy ra</th></tr></thead>
<tbody>
<tr><td>trước 1995 — phân mảnh (fragmentation)</td><td>hàng chục ký pháp OO; ba cái lớn: Grady Booch (phương pháp Booch), Jim Rumbaugh (OMT), Ivar Jacobson (OOSE, use case)</td></tr>
<tr><td>1995–1996 — hợp nhất (unification)</td><td>Booch + Rumbaugh công bố Unified Method 0.8; Jacobson tham gia → UML 0.9 và 0.91</td></tr>
<tr><td>tháng 1–9/1997 — chuẩn hoá (standardization)</td><td>UML 1.0 rồi 1.1 nộp cho OMG cùng các công ty đối tác; UML 1.1 được chấp nhận tháng 11/1997</td></tr>
<tr><td>từ 1998 — công nghiệp hoá (industrialization)</td><td>Nhóm sửa đổi của OMG (Revision Task Force — RTF) ra 1.2, 1.3, 1.4, 1.5; UML 2.0 (2003–2005), rồi 2.1 … 2.5</td></tr>
</tbody>
</table>
<p>Ba tác giả có biệt danh "Three Amigos" (ba người bạn). UML 2 thêm sơ đồ mới (composite structure, timing, interaction overview) và vòng lặp/điều kiện trong sequence diagram.</p>
<div class="pitfall">Hai mốc, hai câu hỏi khác nhau: UML lần đầu <strong>được chấp nhận làm chuẩn năm 1997</strong> (bản 1.1, theo mục 1.6 của Gomaa), còn slide ghi "bản chấp nhận đầu tiên là UML 1.3" (bản đặc tả OMG chính thức đầu tiên, 1999). <strong>Bản sửa lớn là UML 2.0 năm 2003</strong> — ý hay bị hỏi nhất.</div>`],
      [12, '6.1 Model-Driven Architecture with UML',
        `<p class="y-chinh">🎯 Model-Driven Architecture (MDA, promoted by the OMG): build UML models of the architecture before implementation; a model is either platform-independent (PIM) or platform-specific (PSM), and building the PIM first lets one model be mapped to many platforms.</p>
<p><strong>Platform</strong> = the technology the software runs on: COM, CORBA, .NET, J2EE (today: Jakarta EE / Spring), Web Services… A PIM talks only about the business (students, labs, reservations); it could be implemented on any of those.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/ffc102e6240e5399957064e41562aa350ec42725.svg" alt="A PIM of LabFlow: business classes only, no framework, no Java/C# types" loading="lazy" /><p class="chu-thich">🧩 A PIM of LabFlow: business classes only, no framework, no Java/C# types</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 12-13 — PIM: no technology, only business concepts
hide circle
skinparam classAttributeIconSize 0
title PIM — Platform-Independent Model
class Student {
  studentId : String
  name : String
}
class Lab {
  labCode : String
  capacity : Integer
}
class Reservation {
  date : Date
  slot : Integer
  status : ReservationStatus
  approve()
  cancel()
}
Student "1" -- "0..*" Reservation : makes &gt;
Reservation "0..*" -- "1" Lab : for &gt;
@enduml</code></pre></details>
<p><strong>Read it:</strong> a Student makes 0..* reservations; each reservation is for exactly one Lab. The types (<code>Date</code>, <code>Integer</code>) are generic UML types, not <code>java.time.LocalDate</code>. Nothing says "database", "REST" or "Spring" — that is what makes it platform-independent.</p>
<p class="meo">🧠 PIM = <strong>what</strong> the business needs; PSM = <strong>how</strong> one technology does it. "Independent" comes first in time.</p>`,
        `<p class="y-chinh">🎯 Kiến trúc hướng mô hình (Model-Driven Architecture — MDA, do OMG đề xướng): dựng mô hình UML của kiến trúc trước khi hiện thực; mô hình có thể độc lập nền tảng (PIM) hoặc gắn với nền tảng (PSM), và dựng PIM trước thì một mô hình ánh xạ được sang nhiều nền tảng.</p>
<p><strong>Nền tảng (platform)</strong> = công nghệ mà phần mềm chạy trên đó: COM, CORBA, .NET, J2EE (nay là Jakarta EE / Spring), Web Services… PIM chỉ nói về nghiệp vụ (sinh viên, phòng lab, lượt đặt); nó có thể được làm bằng bất kỳ nền tảng nào trong số đó.</p>
<p>Câu trên slide: UML độc lập với phương pháp — UML chỉ là ký pháp ghi lại <em>kết quả</em> phân tích – thiết kế OO làm theo phương pháp bạn chọn.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/ffc102e6240e5399957064e41562aa350ec42725.svg" alt="PIM của LabFlow: chỉ có lớp nghiệp vụ, không framework, không kiểu Java/C#" loading="lazy" /><p class="chu-thich">🧩 PIM của LabFlow: chỉ có lớp nghiệp vụ, không framework, không kiểu Java/C#</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 12-13 — PIM: không có công nghệ, chỉ có khái niệm nghiệp vụ
hide circle
skinparam classAttributeIconSize 0
title PIM — Platform-Independent Model
class Student {
  studentId : String
  name : String
}
class Lab {
  labCode : String
  capacity : Integer
}
class Reservation {
  date : Date
  slot : Integer
  status : ReservationStatus
  approve()
  cancel()
}
Student "1" -- "0..*" Reservation : makes &gt;
Reservation "0..*" -- "1" Lab : for &gt;
@enduml</code></pre></details>
<p><strong>Đọc sơ đồ:</strong> một Student tạo 0..* lượt đặt (Reservation); mỗi lượt đặt dành cho đúng một Lab. Kiểu (<code>Date</code>, <code>Integer</code>) là kiểu UML chung, không phải <code>java.time.LocalDate</code>. Không có chữ nào nói "database", "REST" hay "Spring" — chính vì vậy nó độc lập nền tảng.</p>
<p class="meo">🧠 PIM = nghiệp vụ cần <strong>cái gì</strong>; PSM = một công nghệ làm điều đó <strong>thế nào</strong>. Chữ "Independent" (độc lập) đến trước về thời gian.</p>`],
      [13, '6.1 Model-Driven Architecture with UML',
        `<p class="y-chinh">🎯 The comparison table: PIM = independent of any platform, abstract business logic and structure, built before choosing the platform, mappable to many platforms; PSM = tied to one chosen platform, detailed implementation, built after the choice, less reusable.</p>
<p>Here is the same LabFlow model after the team chose Spring Boot + JPA — a PSM. Compare it with the PIM on slide 12:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b397763106d76fe638e38814fcb4fe46760b0920.svg" alt="The PSM: the same Reservation, now with Java types, JPA annotations, a Spring Data repository and a REST controller" loading="lazy" /><p class="chu-thich">🧩 The PSM: the same Reservation, now with Java types, JPA annotations, a Spring Data repository and a REST controller</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 13 — PSM: the same model mapped to Spring Boot + JPA (Java platform)
hide circle
skinparam classAttributeIconSize 0
title PSM — Platform-Specific Model (Spring Boot / JPA)
class Reservation &lt;&lt;@Entity&gt;&gt; {
  - id : Long {@Id @GeneratedValue}
  - date : LocalDate
  - slot : int
  - status : ReservationStatus {@Enumerated}
  - student : Student {@ManyToOne}
  - lab : Lab {@ManyToOne}
  + approve() : void
  + cancel() : void
}
interface "JpaRepository&lt;Reservation, Long&gt;" as JpaRepo &lt;&lt;Spring Data&gt;&gt;
interface ReservationRepository {
  + findByLabAndDate(lab : Lab, date : LocalDate) : List&lt;Reservation&gt;
}
ReservationRepository -up-|&gt; JpaRepo
class ReservationController &lt;&lt;@RestController&gt;&gt; {
  + create(dto : ReservationRequest) : ResponseEntity&lt;ReservationDto&gt;
}
ReservationController ..&gt; ReservationRepository : uses
ReservationRepository ..&gt; Reservation : stores
@enduml</code></pre></details>
<table>
<thead><tr><th>Criterion</th><th>PIM (slide 12 diagram)</th><th>PSM (diagram above)</th></tr></thead>
<tbody>
<tr><td>Types</td><td>Date, Integer</td><td>LocalDate, int, Long</td></tr>
<tr><td>Identity</td><td>not mentioned</td><td><code>id : Long {@Id @GeneratedValue}</code></td></tr>
<tr><td>Associations</td><td>line Student — Reservation</td><td>field <code>student : Student {@ManyToOne}</code></td></tr>
<tr><td>Extra classes</td><td>none</td><td>ReservationRepository (extends JpaRepository), ReservationController</td></tr>
<tr><td>Reusable on .NET?</td><td>yes, as is</td><td>no — must be redrawn for ASP.NET / Entity Framework</td></tr>
</tbody>
</table>
<div class="pitfall">Gomaa's quiz Ch.1 Q9–10: PIM = "a precise model of the software architecture <strong>before</strong> a commitment is made to a specific platform"; PSM = "a precise model … <strong>mapped to</strong> a specific platform". The distractor "a specific hardware platform" is wrong for both — the platform here is software/middleware.</div>`,
        `<p class="y-chinh">🎯 Bảng so sánh: PIM = không phụ thuộc nền tảng nào, logic nghiệp vụ và cấu trúc ở mức trừu tượng, dựng trước khi chọn nền tảng, ánh xạ được sang nhiều nền tảng; PSM = gắn với một nền tảng đã chọn, chi tiết hiện thực, dựng sau khi chọn, khó dùng lại.</p>
<p>Đây là cùng mô hình LabFlow sau khi nhóm chọn Spring Boot + JPA — một PSM. So với PIM ở slide 12:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b397763106d76fe638e38814fcb4fe46760b0920.svg" alt="PSM: vẫn Reservation đó, giờ có kiểu Java, chú thích JPA, repository Spring Data và controller REST" loading="lazy" /><p class="chu-thich">🧩 PSM: vẫn Reservation đó, giờ có kiểu Java, chú thích JPA, repository Spring Data và controller REST</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 13 — PSM: cùng mô hình đó đã gắn vào Spring Boot + JPA (nền Java)
hide circle
skinparam classAttributeIconSize 0
title PSM — Platform-Specific Model (Spring Boot / JPA)
class Reservation &lt;&lt;@Entity&gt;&gt; {
  - id : Long {@Id @GeneratedValue}
  - date : LocalDate
  - slot : int
  - status : ReservationStatus {@Enumerated}
  - student : Student {@ManyToOne}
  - lab : Lab {@ManyToOne}
  + approve() : void
  + cancel() : void
}
interface "JpaRepository&lt;Reservation, Long&gt;" as JpaRepo &lt;&lt;Spring Data&gt;&gt;
interface ReservationRepository {
  + findByLabAndDate(lab : Lab, date : LocalDate) : List&lt;Reservation&gt;
}
ReservationRepository -up-|&gt; JpaRepo
class ReservationController &lt;&lt;@RestController&gt;&gt; {
  + create(dto : ReservationRequest) : ResponseEntity&lt;ReservationDto&gt;
}
ReservationController ..&gt; ReservationRepository : uses
ReservationRepository ..&gt; Reservation : stores
@enduml</code></pre></details>
<table>
<thead><tr><th>Tiêu chí</th><th>PIM (sơ đồ slide 12)</th><th>PSM (sơ đồ trên)</th></tr></thead>
<tbody>
<tr><td>Kiểu dữ liệu</td><td>Date, Integer</td><td>LocalDate, int, Long</td></tr>
<tr><td>Định danh</td><td>không nhắc</td><td><code>id : Long {@Id @GeneratedValue}</code></td></tr>
<tr><td>Liên kết</td><td>đường Student — Reservation</td><td>trường <code>student : Student {@ManyToOne}</code></td></tr>
<tr><td>Lớp thêm</td><td>không</td><td>ReservationRepository (kế thừa JpaRepository), ReservationController</td></tr>
<tr><td>Dùng lại trên .NET?</td><td>được, giữ nguyên</td><td>không — phải vẽ lại cho ASP.NET / Entity Framework</td></tr>
</tbody>
</table>
<div class="pitfall">Câu hỏi cuối Ch.1 của Gomaa (câu 9–10): PIM = "mô hình chính xác của kiến trúc phần mềm <strong>trước khi</strong> cam kết với một nền tảng cụ thể"; PSM = "mô hình chính xác … <strong>đã ánh xạ</strong> sang một nền tảng cụ thể". Phương án nhiễu "một nền tảng phần cứng cụ thể" sai với cả hai — nền tảng ở đây là phần mềm/middleware.</div>`],
      [14, '7. Multiple Views of Software Architecture',
        `<p class="y-chinh">🎯 An architecture is described from several views; Kruchten (1995) proposed the 4+1 view model, where the use case view is the "+1" that unifies the other four.</p>
<p>The picture: four boxes — Logical view, Implementation view, Process view, Deployment view — around a yellow oval "Use-Case View" in the middle. Each box names its audience and concern (red and italic text):</p>
<table>
<thead><tr><th>View</th><th>Audience (on the slide)</th><th>Concern</th><th>Typical UML diagram</th></tr></thead>
<tbody>
<tr><td>Logical</td><td>analysts / designers</td><td>structure — functionality</td><td>class, communication/sequence, state</td></tr>
<tr><td>Implementation (development)</td><td>programmers</td><td>software management — modules, packages, code organisation</td><td>package, component</td></tr>
<tr><td>Process</td><td>system integrators</td><td>performance, scalability, throughput — concurrency</td><td>activity, concurrent communication</td></tr>
<tr><td>Deployment (physical)</td><td>system engineering</td><td>system topology, delivery, installation, communication</td><td>deployment</td></tr>
<tr><td>Use case (+1)</td><td>end-users</td><td>functionality — the scenarios that tie everything together</td><td>use case (+ scenarios)</td></tr>
</tbody>
</table>
<p>Why "+1"? The four views are checked against the same scenarios: "Reserve Lab Slot" must make sense in the logical view (which classes), the process view (which threads), the implementation view (which modules) and the deployment view (which servers).</p>`,
        `<p class="y-chinh">🎯 Kiến trúc được mô tả từ nhiều góc nhìn (view); Kruchten (1995) đưa ra mô hình 4+1 góc nhìn, trong đó góc nhìn use case là cái "+1" gắn kết bốn góc nhìn còn lại.</p>
<p>Hình: bốn ô — Logical view, Implementation view, Process view, Deployment view — quanh hình bầu dục vàng "Use-Case View" ở giữa. Mỗi ô ghi người quan tâm và mối quan tâm (chữ đỏ và chữ nghiêng):</p>
<table>
<thead><tr><th>Góc nhìn</th><th>Người quan tâm (trên slide)</th><th>Mối quan tâm</th><th>Sơ đồ UML thường dùng</th></tr></thead>
<tbody>
<tr><td>Logical (logic)</td><td>analyst / designer (người phân tích, thiết kế)</td><td>cấu trúc — chức năng</td><td>class, communication/sequence, state</td></tr>
<tr><td>Implementation / development (hiện thực)</td><td>programmer (lập trình viên)</td><td>quản lý phần mềm — module, package, tổ chức code</td><td>package, component</td></tr>
<tr><td>Process (tiến trình)</td><td>system integrator (người tích hợp hệ thống)</td><td>hiệu năng, khả năng mở rộng, thông lượng — tính đồng thời</td><td>activity, concurrent communication</td></tr>
<tr><td>Deployment / physical (triển khai)</td><td>system engineering (kỹ sư hệ thống)</td><td>sơ đồ mạng, phân phối, cài đặt, truyền thông</td><td>deployment</td></tr>
<tr><td>Use case (+1)</td><td>end-user (người dùng cuối)</td><td>chức năng — các kịch bản gắn kết mọi thứ</td><td>use case (+ kịch bản)</td></tr>
</tbody>
</table>
<p>Vì sao "+1"? Bốn góc nhìn được kiểm bằng cùng các kịch bản: "Reserve Lab Slot" phải hợp lý trong góc nhìn logic (lớp nào), tiến trình (luồng nào), hiện thực (module nào) và triển khai (máy chủ nào).</p>`],
      [15, '7. Multiple Views of Software Architecture',
        `<p class="y-chinh">🎯 The four views of Kruchten in one line each: logical = static modeling view; process = concurrent process/task view; development (implementation and deployment) = subsystem and component design view; plus the use case view.</p>
<p>The same 4+1 picture is repeated; the slide just names what each view is <em>made of</em>. Note that Gomaa's wording merges implementation and deployment into one "development" view.</p>
<div class="pitfall">Theory-exam trap: "In the 4+1 model the <strong>logical</strong> view is the unifying view" — <strong>false</strong>, the <strong>use case</strong> view is. And "process view = the steps of the development process" — <strong>false</strong>: it means processes/threads running at the same time.</div>
<p class="meo">🧠 Order to remember: <strong>L-P-D + U</strong> — Logical (what classes), Process (what runs in parallel), Development (what code modules), + Use cases (why).</p>
<div class="callout">🧭 <strong>Apply to LabFlow (illustration).</strong> Logical: class diagram Student/Lab/Reservation. Process: the web request thread + an asynchronous e-mail sender. Development: Maven modules / packages <code>controller</code>, <code>service</code>, <code>repository</code>. Deployment: browser → VPS with nginx, backend and PostgreSQL containers. Use cases: Reserve Lab Slot, Approve Reservation.</div>`,
        `<p class="y-chinh">🎯 Bốn góc nhìn của Kruchten, mỗi cái một dòng: logical = góc nhìn mô hình tĩnh; process = góc nhìn tiến trình/tác vụ đồng thời; development (hiện thực và triển khai) = góc nhìn thiết kế subsystem và component; cộng góc nhìn use case.</p>
<p>Hình 4+1 được lặp lại; slide chỉ nói mỗi góc nhìn <em>gồm những gì</em>. Để ý cách viết của Gomaa gộp implementation và deployment thành một góc nhìn "development" (phát triển).</p>
<div class="pitfall">Bẫy thi lý thuyết: "Trong mô hình 4+1, góc nhìn <strong>logical</strong> là góc nhìn gắn kết" — <strong>sai</strong>, đó là góc nhìn <strong>use case</strong>. Và "process view = các bước của quy trình phát triển" — <strong>sai</strong>: nó nói về các tiến trình/luồng chạy đồng thời.</div>
<p class="meo">🧠 Thứ tự để nhớ: <strong>L-P-D + U</strong> — Logical (lớp nào), Process (cái gì chạy song song), Development (module code nào), + Use case (để làm gì).</p>
<div class="callout">🧭 <strong>Áp vào LabFlow (minh hoạ).</strong> Logical: class diagram Student/Lab/Reservation. Process: luồng xử lý request web + bộ gửi e-mail bất đồng bộ. Development: các module Maven / package <code>controller</code>, <code>service</code>, <code>repository</code>. Deployment: trình duyệt → VPS có các container nginx, backend, PostgreSQL. Use case: Reserve Lab Slot, Approve Reservation.</div>`],
      [16, '7. Multiple Views of Software Architecture',
        `<p class="y-chinh">🎯 Hofmeister et al. (2000) give an industrial set of four views: conceptual (main design elements and their relationships), code (source organised into object code, libraries, directories), module (subsystems and modules), execution (concurrent and distributed execution).</p>
<table>
<thead><tr><th>Hofmeister (2000)</th><th>Closest Kruchten view</th><th>LabFlow example</th></tr></thead>
<tbody>
<tr><td>Conceptual</td><td>logical</td><td>"Booking talks to Notification through INotify"</td></tr>
<tr><td>Module</td><td>development (implementation)</td><td>packages controller / service / repository</td></tr>
<tr><td>Code</td><td>development (implementation), at file level</td><td>src/main/java/…, labflow.jar, node_modules</td></tr>
<tr><td>Execution</td><td>process + deployment</td><td>backend container, async mail thread, PostgreSQL on the VPS</td></tr>
</tbody>
</table>
<p>Different authors cut the same cake differently; the idea is the same: no single diagram can describe an architecture.</p>
<div class="pitfall">Do not mix the two lists. "Conceptual, module, code, execution" = <strong>Hofmeister</strong>; "logical, process, development, physical + use case" = <strong>Kruchten 4+1</strong>.</div>`,
        `<p class="y-chinh">🎯 Hofmeister và cộng sự (2000) đưa ra bộ bốn góc nhìn theo kinh nghiệm công nghiệp: conceptual — khái niệm (các phần tử thiết kế chính và quan hệ), code — mã (mã nguồn tổ chức thành mã đích, thư viện, thư mục), module (subsystem và module), execution — thực thi (góc nhìn thực thi đồng thời và phân tán).</p>
<table>
<thead><tr><th>Hofmeister (2000)</th><th>Gần nhất với góc nhìn Kruchten</th><th>Ví dụ LabFlow</th></tr></thead>
<tbody>
<tr><td>Conceptual</td><td>logical</td><td>"Booking nói chuyện với Notification qua INotify"</td></tr>
<tr><td>Module</td><td>development (implementation)</td><td>các package controller / service / repository</td></tr>
<tr><td>Code</td><td>development, ở mức file</td><td>src/main/java/…, labflow.jar, node_modules</td></tr>
<tr><td>Execution</td><td>process + deployment</td><td>container backend, luồng gửi mail bất đồng bộ, PostgreSQL trên VPS</td></tr>
</tbody>
</table>
<p>Mỗi tác giả cắt cùng một chiếc bánh theo kiểu khác nhau; ý chung vẫn là: không một sơ đồ nào mô tả hết được một kiến trúc.</p>
<div class="pitfall">Đừng trộn hai danh sách. "Conceptual, module, code, execution" = <strong>Hofmeister</strong>; "logical, process, development, physical + use case" = <strong>Kruchten 4+1</strong>.</div>`],
      [17, '7. Multiple Views of Software Architecture',
        `<p class="y-chinh">🎯 Gomaa's own seven views, each with its UML diagram — this slide gives the first three: use case view (use case diagram + descriptions), static view (class diagrams), dynamic interaction view (communication diagrams).</p>
<ul>
<li><strong>Use case view</strong> — functional requirements; an <em>input</em> to the architecture. Each use case = a sequence of interactions between actors (external users) and the system.</li>
<li><strong>Static view</strong> — classes and relationships: associations, whole/part (composition or aggregation), generalization/specialization. Drawn on <em>class diagrams</em>.</li>
<li><strong>Dynamic interaction view</strong> — objects and the messages between them; can also show the execution order of one scenario. Drawn on <em>communication diagrams</em>.</li>
</ul>
<p>All three diagrams are drawn in lessons 1.B and 1.C (use case: slide 5; class relationships: slides 8–9; communication: slide 12).</p>
<div class="pitfall">Gomaa depicts the dynamic interaction view on <strong>communication</strong> diagrams (COMET prefers them for architecture); many other books use sequence diagrams. If a question asks "according to the course/Gomaa", answer communication diagram.</div>`,
        `<p class="y-chinh">🎯 Bảy góc nhìn riêng của Gomaa, mỗi cái kèm sơ đồ UML — slide này cho ba cái đầu: góc nhìn use case (use case diagram + đặc tả), góc nhìn tĩnh (class diagram), góc nhìn tương tác động (communication diagram).</p>
<ul>
<li><strong>Use case view</strong> — yêu cầu chức năng; là <em>đầu vào</em> để dựng kiến trúc. Mỗi use case = chuỗi tương tác giữa actor (người dùng bên ngoài) và hệ thống.</li>
<li><strong>Static view (góc nhìn tĩnh)</strong> — lớp và quan hệ: liên kết (association), toàn thể/bộ phận (hợp thành — composition, hoặc kết tập — aggregation), tổng quát hoá/chuyên biệt hoá (generalization/specialization). Vẽ trên <em>class diagram</em>.</li>
<li><strong>Dynamic interaction view (góc nhìn tương tác động)</strong> — đối tượng và thông điệp giữa chúng; cũng dùng để chỉ thứ tự thực thi của một kịch bản. Vẽ trên <em>communication diagram</em>.</li>
</ul>
<p>Cả ba sơ đồ được vẽ ở bài 1.B và 1.C (use case: slide 5; quan hệ lớp: slide 8–9; communication: slide 12).</p>
<div class="pitfall">Gomaa vẽ góc nhìn tương tác động bằng <strong>communication</strong> diagram (COMET ưa dùng nó cho kiến trúc); nhiều sách khác dùng sequence diagram. Câu hỏi ghi "theo môn học/Gomaa" thì trả lời communication diagram.</div>`],
      [18, '7. Multiple Views of Software Architecture',
        `<p class="y-chinh">🎯 The other four Gomaa views: dynamic state machine view (statecharts), structural component view (structured class diagrams: components, ports, provided/required interfaces), dynamic concurrent view (concurrent communication diagrams), deployment view (deployment diagrams).</p>
<table>
<thead><tr><th>Gomaa view</th><th>Shows</th><th>UML diagram</th><th>Where in this course</th></tr></thead>
<tbody>
<tr><td>Use case</td><td>functional requirements</td><td>use case diagram</td><td>Ch.2 (school Ch.6)</td></tr>
<tr><td>Static</td><td>classes + relationships</td><td>class diagram</td><td>Ch.2 (school Ch.7)</td></tr>
<tr><td>Dynamic interaction</td><td>objects + messages for a scenario</td><td>communication diagram</td><td>Ch.2 (school Ch.9, 11)</td></tr>
<tr><td>Dynamic state machine</td><td>control and sequencing of a control object</td><td>statechart</td><td>Ch.2 (school Ch.10)</td></tr>
<tr><td>Structural component</td><td>components, ports, provided/required interfaces</td><td>structured class (composite structure) diagram</td><td>Ch.3 (school Ch.17)</td></tr>
<tr><td>Dynamic concurrent</td><td>concurrent components on distributed nodes, messages</td><td>concurrent communication diagram</td><td>Ch.3 (school Ch.13, 18)</td></tr>
<tr><td>Deployment</td><td>components assigned to hardware nodes</td><td>deployment diagram</td><td>Ch.3 (school Ch.12–13)</td></tr>
</tbody>
</table>
<p><strong>Port</strong> = a named connection point on a component; each port offers (provides) or needs (requires) interfaces. <strong>Node</strong> = a physical computer or device.</p>
<p class="meo">🧠 Seven views = <strong>U-S-I-M-C-C-D</strong>: Use case, Static, Interaction, Machine (state), Component, Concurrent, Deployment.</p>`,
        `<p class="y-chinh">🎯 Bốn góc nhìn còn lại của Gomaa: máy trạng thái động (statechart), thành phần cấu trúc (structured class diagram: component, port, interface cung cấp/cần), đồng thời động (concurrent communication diagram), triển khai (deployment diagram).</p>
<table>
<thead><tr><th>Góc nhìn Gomaa</th><th>Cho thấy</th><th>Sơ đồ UML</th><th>Học ở đâu trong môn</th></tr></thead>
<tbody>
<tr><td>Use case</td><td>yêu cầu chức năng</td><td>use case diagram</td><td>Ch.2 (trường Ch.6)</td></tr>
<tr><td>Static (tĩnh)</td><td>lớp + quan hệ</td><td>class diagram</td><td>Ch.2 (trường Ch.7)</td></tr>
<tr><td>Dynamic interaction (tương tác động)</td><td>đối tượng + thông điệp của một kịch bản</td><td>communication diagram</td><td>Ch.2 (trường Ch.9, 11)</td></tr>
<tr><td>Dynamic state machine (máy trạng thái)</td><td>điều khiển và trình tự của một đối tượng điều khiển</td><td>statechart</td><td>Ch.2 (trường Ch.10)</td></tr>
<tr><td>Structural component (thành phần cấu trúc)</td><td>component, port, interface cung cấp/cần</td><td>structured class (composite structure) diagram</td><td>Ch.3 (trường Ch.17)</td></tr>
<tr><td>Dynamic concurrent (đồng thời động)</td><td>component đồng thời trên các nút phân tán, thông điệp</td><td>concurrent communication diagram</td><td>Ch.3 (trường Ch.13, 18)</td></tr>
<tr><td>Deployment (triển khai)</td><td>component được gán cho nút phần cứng</td><td>deployment diagram</td><td>Ch.3 (trường Ch.12–13)</td></tr>
</tbody>
</table>
<p><strong>Port (cổng)</strong> = điểm nối có tên trên một component; mỗi port cung cấp (provide) hoặc cần (require) các interface. <strong>Node (nút)</strong> = một máy tính hoặc thiết bị vật lý.</p>
<p class="meo">🧠 Bảy góc nhìn = <strong>U-S-I-M-C-C-D</strong>: Use case, Static, Interaction, Machine (trạng thái), Component, Concurrent, Deployment.</p>`],
      [19, '8. Evolution of Software Modeling and Design Methods',
        `<p class="y-chinh">🎯 1960s: little systematic design, flowcharts as documentation; 1968: Dijkstra's T.H.E. operating system — one of the first design methods, hierarchical architecture, the first to address concurrent system design; mid–late 1970s: two strategies — data flow–oriented design (Structured Design) and data structured design.</p>
<ul>
<li><strong>Flowchart</strong>: boxes and arrows for the steps of one program — good for a small algorithm, useless for a system of 100 modules.</li>
<li><strong>Hierarchical architecture</strong> (T.H.E.): the system in layers, each layer using only the one below — the ancestor of today's Controller → Service → Repository layering.</li>
<li><strong>Structured Design</strong> (data flow–oriented): draw how data flows through the system (data flow diagrams), then map them to modules. It introduced <strong>coupling</strong> and <strong>cohesion</strong>, still the first two words of any design review.</li>
<li><strong>Data structured design</strong>: understand the problem through its data structures first, then derive the program from them (Jackson Structured Programming, Warnier/Orr).</li>
</ul>
<div class="callout">➕ <strong>Beyond the slide — coupling and cohesion in one line each.</strong> <em>Coupling</em> = how much one module depends on others (want it <strong>low</strong>). <em>Cohesion</em> = how strongly the parts inside one module belong together (want it <strong>high</strong>). The web lesson 1.1 of this chapter covers them with examples.</div>`,
        `<p class="y-chinh">🎯 Thập niên 1960: gần như không thiết kế có hệ thống, lưu đồ (flowchart) dùng làm tài liệu; 1968: hệ điều hành T.H.E. của Dijkstra — một trong những phương pháp thiết kế đầu tiên, kiến trúc phân cấp, là cái đầu tiên tính đến thiết kế hệ thống đồng thời; giữa–cuối 1970: hai chiến lược — thiết kế hướng luồng dữ liệu (Structured Design) và thiết kế theo cấu trúc dữ liệu.</p>
<ul>
<li><strong>Lưu đồ (flowchart)</strong>: hộp và mũi tên cho các bước của một chương trình — hợp với thuật toán nhỏ, vô dụng với hệ thống 100 module.</li>
<li><strong>Kiến trúc phân cấp (hierarchical)</strong> (T.H.E.): hệ thống chia tầng, mỗi tầng chỉ dùng tầng ngay dưới — tổ tiên của cách chia Controller → Service → Repository hiện nay.</li>
<li><strong>Structured Design (thiết kế có cấu trúc, hướng luồng dữ liệu)</strong>: vẽ dữ liệu chảy qua hệ thống thế nào (sơ đồ luồng dữ liệu — data flow diagram), rồi ánh xạ thành module. Nó đưa ra <strong>coupling</strong> và <strong>cohesion</strong>, đến nay vẫn là hai từ đầu tiên của mọi buổi soát thiết kế.</li>
<li><strong>Thiết kế theo cấu trúc dữ liệu (data structured design)</strong>: hiểu bài toán qua cấu trúc dữ liệu trước, rồi suy ra chương trình (Jackson Structured Programming, Warnier/Orr).</li>
</ul>
<div class="callout">➕ <strong>Mở rộng ngoài slide — coupling và cohesion, mỗi cái một dòng.</strong> <em>Coupling (độ kết dính giữa module)</em> = một module phụ thuộc module khác nhiều đến đâu (muốn <strong>thấp</strong>). <em>Cohesion (độ gắn kết bên trong)</em> = các phần trong một module thuộc về nhau chặt đến đâu (muốn <strong>cao</strong>). Bài 1.1 của chương này trên web giảng kỹ kèm ví dụ.</div>`],
      [20, '8. Evolution of Software Modeling and Design Methods',
        `<p class="y-chinh">🎯 1970s–1980s: data structured design; in databases, separating logical from physical data (the basis of DBMSs) and Chen's Entity–Relationship modeling; mid–late 1980s: object-oriented methods (Booch, Wirfs-Brock, Rumbaugh, Shlaer &amp; Mellor, Coad &amp; Yourdon) focusing on problem-domain modeling, information hiding and inheritance.</p>
<ul>
<li><strong>ER modeling</strong> (Chen, 1976) — the ERD you draw in DBI202. OO static modeling grew out of it: a class ≈ an entity type <em>plus operations</em>.</li>
<li><strong>Problem-domain modeling</strong>: model the real-world things first (Student, Lab), then turn them into software classes.</li>
<li>Those methods later merged: Booch + Rumbaugh (OMT) + Jacobson (use cases) → UML (slide 11).</li>
</ul>
<div class="callout">➕ <strong>Beyond the slide — what the deck skips (Gomaa 1.8–1.9).</strong> Parnas (1972) introduced <strong>information hiding</strong> — the concept under all OO design. Rumbaugh's OMT showed that <em>dynamic</em> modeling (statecharts, sequence diagrams) matters as much as static modeling. Jacobson (1992) introduced the <strong>use case</strong>. Harel (1987) invented statecharts. These names appear in theory questions of the form "who introduced…".</div>
<div class="pitfall">"The main difference between a class and an ER entity type" — the class has <strong>operations</strong>, the entity type does not (Gomaa 1.9). A frequent short-answer question.</div>`,
        `<p class="y-chinh">🎯 1970–1980: thiết kế theo cấu trúc dữ liệu; trong CSDL, tách dữ liệu logic khỏi dữ liệu vật lý (nền của DBMS) và mô hình Thực thể – Liên kết (ER) của Chen; giữa–cuối 1980: các phương pháp hướng đối tượng (Booch, Wirfs-Brock, Rumbaugh, Shlaer &amp; Mellor, Coad &amp; Yourdon) tập trung vào mô hình hoá miền bài toán, che giấu thông tin và kế thừa.</p>
<ul>
<li><strong>Mô hình ER</strong> (Chen, 1976) — chính là ERD bạn vẽ ở DBI202. Mô hình tĩnh OO lớn lên từ đó: một lớp ≈ một kiểu thực thể <em>cộng thêm thao tác</em>.</li>
<li><strong>Mô hình hoá miền bài toán (problem domain modeling)</strong>: mô hình các thứ ngoài đời trước (Student, Lab), rồi mới biến thành lớp phần mềm.</li>
<li>Các phương pháp đó sau này hợp nhất: Booch + Rumbaugh (OMT) + Jacobson (use case) → UML (slide 11).</li>
</ul>
<div class="callout">➕ <strong>Mở rộng ngoài slide — phần bộ slide bỏ qua (Gomaa 1.8–1.9).</strong> Parnas (1972) đưa ra <strong>che giấu thông tin</strong> — khái niệm nằm dưới mọi thiết kế OO. OMT của Rumbaugh cho thấy mô hình <em>động</em> (statechart, sequence diagram) quan trọng ngang mô hình tĩnh. Jacobson (1992) đưa ra <strong>use case</strong>. Harel (1987) phát minh statechart. Các tên này xuất hiện trong câu thi dạng "ai đưa ra…".</div>
<div class="pitfall">"Khác biệt chính giữa lớp (class) và kiểu thực thể ER" — lớp có <strong>thao tác (operation)</strong>, kiểu thực thể thì không (Gomaa 1.9). Câu hỏi ngắn hay gặp.</div>`],
      [21, '9. Survey of Concurrent, Distributed, and Real-Time Design Methods',
        `<p class="y-chinh">🎯 Methods for concurrent, distributed and real-time systems: CODARTS (Gomaa, 1993) — information-hiding modules + concurrent task structuring; Octopus — use cases, static modeling, object interactions, statecharts; ROOM — OO real-time design with active objects (ROOMcharts); COMET — UML-based, use-case-driven, for concurrent, distributed and real-time systems.</p>
<ul>
<li><strong>Concurrent</strong>: several things run at the same time (threads, tasks). <strong>Distributed</strong>: the parts run on different machines connected by a network. <strong>Real-time</strong>: a correct answer that comes too late is a wrong answer (brakes, elevators, ATMs).</li>
<li><strong>Active object</strong>: an object with its own thread of control (lesson 1.C, slide 17). ROOM calls them actors and describes them with ROOMcharts, a variant of statecharts.</li>
<li>COMET is the newest in this line and the one the course uses; it extends CODARTS to UML 2 and to web/service/component architectures.</li>
</ul>
<p class="meo">🧠 Pair them: <strong>CODARTS → task structuring</strong>, <strong>ROOM → active objects/ROOMcharts</strong>, <strong>Octopus → use cases + statecharts</strong>, <strong>COMET → UML + use-case-driven</strong>.</p>
<div class="callout">🧭 <strong>Apply to LabFlow (illustration).</strong> LabFlow is not real-time, but it is concurrent (many students reserve at once — two must not get the same slot) and distributed (browser, backend, database on different machines). That is why concurrency and deployment views still matter for a web project.</div>`,
        `<p class="y-chinh">🎯 Các phương pháp cho hệ thống đồng thời, phân tán, thời gian thực: CODARTS (Gomaa, 1993) — module che giấu thông tin + chia tác vụ đồng thời; Octopus — use case, mô hình tĩnh, tương tác đối tượng, statechart; ROOM — thiết kế thời gian thực hướng đối tượng với đối tượng chủ động (ROOMchart); COMET — dựa trên UML, dẫn dắt bởi use case, cho hệ đồng thời, phân tán và thời gian thực.</p>
<ul>
<li><strong>Đồng thời (concurrent)</strong>: nhiều việc chạy cùng lúc (luồng, tác vụ). <strong>Phân tán (distributed)</strong>: các phần chạy trên nhiều máy nối mạng. <strong>Thời gian thực (real-time)</strong>: câu trả lời đúng nhưng đến muộn là câu trả lời sai (phanh xe, thang máy, ATM).</li>
<li><strong>Đối tượng chủ động (active object)</strong>: đối tượng có luồng điều khiển riêng (bài 1.C, slide 17). ROOM gọi chúng là actor và mô tả bằng ROOMchart, một biến thể của statechart.</li>
<li>COMET là phương pháp mới nhất trong dòng này và là cái môn học dùng; nó mở rộng CODARTS sang UML 2 và sang kiến trúc web/dịch vụ/component.</li>
</ul>
<p class="meo">🧠 Ghép cặp: <strong>CODARTS → chia tác vụ</strong>, <strong>ROOM → đối tượng chủ động/ROOMchart</strong>, <strong>Octopus → use case + statechart</strong>, <strong>COMET → UML + dẫn dắt bởi use case</strong>.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow (minh hoạ).</strong> LabFlow không phải hệ thời gian thực, nhưng nó đồng thời (nhiều sinh viên đặt cùng lúc — hai người không được lấy cùng một ca) và phân tán (trình duyệt, backend, CSDL trên các máy khác nhau). Vì thế góc nhìn đồng thời và triển khai vẫn quan trọng với một dự án web.</div>`],
    ]),
    bi(`<h2>📌 What to remember from Chapter 1</h2>
<ul>
<li>Modeling = designing before coding, from several views (requirements, static, dynamic).</li>
<li>UML = a standard <em>notation</em> (OMG; 1.x from 1997, 2.0 in 2003), methodology-independent; COMET = a <em>method</em> (use-case-driven, iterative, three models).</li>
<li>Notation / concept / strategy / structuring criteria / method — five different words.</li>
<li>Architecture = components + interconnections, hiding internals; two levels (subsystems, modules); driven by quality attributes.</li>
<li>PIM (before choosing a platform) vs PSM (mapped to one platform).</li>
<li>Views: Kruchten 4+1 (use case unifies), Hofmeister 4, Gomaa 7 — each view has its UML diagram.</li>
</ul>
<p>Next: lesson 1.B draws the UML diagrams themselves (school Chapter 2).</p>`,
    `<h2>📌 Cần nhớ gì từ Chương 1</h2>
<ul>
<li>Mô hình hoá = thiết kế trước khi code, từ nhiều góc nhìn (yêu cầu, tĩnh, động).</li>
<li>UML = <em>ký pháp</em> chuẩn (OMG; 1.x từ 1997, 2.0 năm 2003), độc lập phương pháp; COMET = <em>phương pháp</em> (dẫn dắt bởi use case, lặp, ba mô hình).</li>
<li>Notation / concept / strategy / structuring criteria / method — năm từ khác nhau.</li>
<li>Kiến trúc = thành phần + kết nối, giấu phần bên trong; hai mức (subsystem, module); do thuộc tính chất lượng dẫn dắt.</li>
<li>PIM (trước khi chọn nền tảng) và PSM (đã ánh xạ vào một nền tảng).</li>
<li>Góc nhìn: Kruchten 4+1 (use case gắn kết), Hofmeister 4, Gomaa 7 — mỗi góc nhìn có sơ đồ UML của nó.</li>
</ul>
<p>Tiếp theo: bài 1.B vẽ chính các sơ đồ UML (Chapter 2 của trường).</p>`),
    books([
      ['gomaa', 'Chapter 1 "Introduction" (sections 1.1–1.10) and its 10 multiple-choice exercises', 'Chương 1 "Introduction" (mục 1.1–1.10) và 10 câu trắc nghiệm cuối chương'],
      ['fowler', 'Chapter 1 "Introduction" — ways of using UML (sketch, blueprint, programming language)', 'Chương 1 "Introduction" — các cách dùng UML (phác thảo, bản thiết kế, ngôn ngữ lập trình)'],
      ['fuSlides', 'deck "Chapter 1: Introduction" (21 slides)', 'bộ "Chapter 1: Introduction" (21 slide)'],
    ]),
  ].join('\n'),
};

/* ───────── 1.B — 📑 Slide by slide · UML notation (1): use case, class, relationships, communication (school Ch.2, slides 1–12) ───────── */
const L_swd3_1 = {
  title: '1.B — 📑 Slide by slide · UML notation (1): use case, class, relationships, communication (school Ch.2, slides 1–12)|||1.B — 📑 Học theo từng slide · Ký pháp UML (1): use case, lớp, quan hệ, communication (Chapter 2 của trường, slide 1–12)',
  slug: 'swd392-slide-swd3-1',
  type: 'VIDEO',
  description: 'Giảng slide 1–12 Chapter 2 của trường (Gomaa Ch.2): 14 loại sơ đồ UML, use case diagram (actor, ranh giới, include/extend, package, actor kế thừa), lớp và đối tượng, class diagram với sáu quan hệ và bội số, kế thừa – lớp trừu tượng – hiện thực hoá – phụ thuộc, tầm nhìn + - #, communication diagram — mỗi loại có sơ đồ PlantUML dựng thật, cách đọc, cách vẽ từng bước, lỗi hay mắc, và code Java tương ứng.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.B · school deck "Chapter 2: Overview of the UML Notation", slides 1–12</span>
<h2>The UML notation (part 1) — the deck, slide by slide</h2>
<p class="lead">This deck is a picture book: almost every slide is one UML figure with a one-line caption. That is exactly what the exam tests — the 60-minute theory exam shows you a symbol and asks what it means, and the 85-minute PE makes you <em>draw</em> use case, class, sequence and state diagrams. So for every diagram type this lesson gives you: the slide's figure explained, a <strong>real PlantUML diagram</strong> rendered for you, <strong>how to read it</strong>, <strong>how to draw it step by step</strong>, and the <strong>mistakes that lose marks</strong>. Material the slide does not have is marked <strong>➕ Beyond the slide</strong>.</p>
<div class="callout"><strong>How to practise.</strong> Under each diagram, open "PlantUML source", copy it into <a href="https://www.plantuml.com/plantuml">plantuml.com</a> (or the PlantUML plugin of VS Code / IntelliJ) and change one thing — add a class, flip an arrow — then look at what changed. Drawing by hand on paper first, then in PlantUML, is the fastest way to be ready for the PE.</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.B · bộ slide "Chapter 2: Overview of the UML Notation" của trường, slide 1–12</span>
<h2>Ký pháp UML (phần 1) — học bộ slide từng trang</h2>
<p class="lead">Bộ slide này là một cuốn sách tranh: gần như mỗi slide là một hình UML với một dòng chú thích. Đó chính là thứ đề thi kiểm: bài lý thuyết 60 phút cho bạn xem một ký hiệu rồi hỏi nó nghĩa là gì, còn bài PE 85 phút bắt bạn <em>vẽ</em> use case, class, sequence và state diagram. Vì vậy với mỗi loại sơ đồ, bài này cho bạn: giải thích hình trên slide, một <strong>sơ đồ PlantUML thật</strong> đã dựng sẵn, <strong>cách đọc</strong>, <strong>cách vẽ từng bước</strong>, và <strong>những lỗi mất điểm</strong>. Phần slide không có được đánh dấu <strong>➕ Mở rộng ngoài slide</strong>.</p>
<div class="callout"><strong>Cách luyện.</strong> Dưới mỗi sơ đồ, mở "Mã PlantUML", chép vào <a href="https://www.plantuml.com/plantuml">plantuml.com</a> (hoặc plugin PlantUML của VS Code / IntelliJ) rồi sửa một thứ — thêm một lớp, đảo một mũi tên — và xem hình đổi ra sao. Vẽ tay trên giấy trước, rồi vẽ bằng PlantUML, là cách nhanh nhất để sẵn sàng cho bài PE.</div>`),
    walkHead('swd3', 1, 12),
    walk('swd3', [
      [1, 'Chapter 2: Overview of the UML Notation',
        `<p class="y-chinh">🎯 Chapter 2 is a tour of the UML symbols that COMET uses — not all of UML, only the parts that bring a clear benefit (Gomaa follows Fowler's advice here).</p>
<p>Each later chapter uses one of these diagrams in depth (use case → Ch.6, class → Ch.7, interaction → Ch.9, statechart → Ch.10…). Here you only need to <em>recognise and read</em> every symbol; drawing them well comes with practice.</p>`,
        `<p class="y-chinh">🎯 Chương 2 là chuyến tham quan các ký hiệu UML mà COMET dùng — không phải toàn bộ UML, chỉ phần mang lại lợi ích rõ ràng (Gomaa theo lời khuyên của Fowler ở đây).</p>
<p>Mỗi chương sau dùng sâu một loại sơ đồ (use case → Ch.6, class → Ch.7, tương tác → Ch.9, statechart → Ch.10…). Ở đây bạn chỉ cần <em>nhận ra và đọc được</em> mọi ký hiệu (notation — ký pháp); vẽ đẹp thì luyện dần.</p>`],
      [2, 'Content',
        `<p class="y-chinh">🎯 Eleven sections: UML diagrams, use case diagrams, classes and objects, class diagrams, interaction diagrams, state machine diagrams, packages, concurrent communication diagrams, deployment diagrams, UML extension mechanisms, conventions used in the book.</p>
<p>This lesson (1.B) covers sections 1–5 (slides 3–12); lesson 1.C covers sections 6–10 (slides 13–23). Section 11 "Conventions used in this book" has no slide; its naming rules are summarised at the end of lesson 1.C because they help you name things correctly in the PE.</p>`,
        `<p class="y-chinh">🎯 Mười một mục: các loại sơ đồ UML, use case diagram, lớp và đối tượng, class diagram, sơ đồ tương tác, sơ đồ máy trạng thái, package, concurrent communication diagram, deployment diagram, cơ chế mở rộng UML, quy ước đặt tên của sách.</p>
<p>Bài này (1.B) học mục 1–5 (slide 3–12); bài 1.C học mục 6–10 (slide 13–23). Mục 11 "Conventions used in this book" (quy ước dùng trong sách) không có slide; quy tắc đặt tên của nó được tóm ở cuối bài 1.C vì giúp bạn đặt tên đúng trong bài PE.</p>`],
      [3, '1. UML Diagrams',
        `<p class="y-chinh">🎯 UML diagrams split into two families: structural (what the system is made of) and behavioral (what it does over time); interaction diagrams are a sub-family of behavioral.</p>
<table>
<thead><tr><th>Family</th><th>Diagrams on the slide</th><th>One-line meaning</th></tr></thead>
<tbody>
<tr><td>Structural (7)</td><td>class, object, package, component, composite structure, deployment, profile</td><td>the static parts and how they are connected</td></tr>
<tr><td>Behavioral (3 + interaction)</td><td>activity, use case, state machine</td><td>what users do, how work flows, how one object changes state</td></tr>
<tr><td>Interaction (4, inside behavioral)</td><td>sequence, communication, interaction overview, timing</td><td>which objects exchange which messages</td></tr>
</tbody>
</table>
<p>That is UML 2's 14 diagrams. COMET mainly uses: use case, class, sequence, communication, state machine, package, deployment, (concurrent) communication, composite structure.</p>
<p class="nhan">➕ Beyond the slide — a component diagram, one of the structural diagrams the chapter does not draw:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/3624c95a8cc07a4b9cbf3e5336371decf176dfdb.svg" alt="Component diagram (structural): components with provided interfaces (ball) and required interfaces (dashed arrow)" loading="lazy" /><p class="chu-thich">🧩 Component diagram (structural): components with provided interfaces (ball) and required interfaces (dashed arrow)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 3 — a structural diagram example: component diagram with provided (ball) and required (socket/dependency) interfaces
' Illustrative LabFlow example
skinparam componentStyle uml2
component "Booking" as B
component "Notification" as N
component "Mail Gateway" as M
interface IReservation
interface INotify
interface IEmail
IReservation - B
B ..&gt; INotify : requires
INotify - N
N ..&gt; IEmail : requires
IEmail - M
@enduml</code></pre></details>
<p><strong>Read:</strong> Booking <em>provides</em> <code>IReservation</code> and <em>requires</em> <code>INotify</code>, which Notification provides. Each component can be replaced by another that offers the same interface.</p>
<div class="pitfall">"Use case diagram is a structural diagram" — <strong>false</strong>, it is behavioral. "Object diagram is behavioral" — <strong>false</strong>, it is structural (a snapshot of objects at one moment).</div>`,
        `<p class="y-chinh">🎯 Sơ đồ UML chia hai họ: cấu trúc — structural (hệ thống làm bằng gì) và hành vi — behavioral (nó làm gì theo thời gian); sơ đồ tương tác (interaction) là một nhánh con của hành vi.</p>
<table>
<thead><tr><th>Họ</th><th>Sơ đồ trên slide</th><th>Nghĩa một dòng</th></tr></thead>
<tbody>
<tr><td>Structural — cấu trúc (7)</td><td>class, object, package, component, composite structure, deployment, profile</td><td>các phần tĩnh và cách chúng nối với nhau</td></tr>
<tr><td>Behavioral — hành vi (3 + tương tác)</td><td>activity, use case, state machine</td><td>người dùng làm gì, công việc chảy ra sao, một đối tượng đổi trạng thái thế nào</td></tr>
<tr><td>Interaction — tương tác (4, nằm trong hành vi)</td><td>sequence, communication, interaction overview, timing</td><td>đối tượng nào trao thông điệp nào cho nhau</td></tr>
</tbody>
</table>
<p>Đó là 14 sơ đồ của UML 2. COMET chủ yếu dùng: use case, class, sequence, communication, state machine, package, deployment, (concurrent) communication, composite structure.</p>
<p class="nhan">➕ Mở rộng ngoài slide — một component diagram, sơ đồ cấu trúc mà chương không vẽ:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/3624c95a8cc07a4b9cbf3e5336371decf176dfdb.svg" alt="Component diagram (cấu trúc): component với interface cung cấp (quả bóng) và interface cần (mũi tên nét đứt)" loading="lazy" /><p class="chu-thich">🧩 Component diagram (cấu trúc): component với interface cung cấp (quả bóng) và interface cần (mũi tên nét đứt)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 3 — ví dụ sơ đồ cấu trúc: component diagram với interface cung cấp (quả bóng) và interface cần (mũi tên phụ thuộc)
' Ví dụ LabFlow minh hoạ
skinparam componentStyle uml2
component "Booking" as B
component "Notification" as N
component "Mail Gateway" as M
interface IReservation
interface INotify
interface IEmail
IReservation - B
B ..&gt; INotify : requires
INotify - N
N ..&gt; IEmail : requires
IEmail - M
@enduml</code></pre></details>
<p><strong>Đọc:</strong> Booking <em>cung cấp</em> <code>IReservation</code> và <em>cần</em> <code>INotify</code>, thứ mà Notification cung cấp. Mỗi component có thể thay bằng component khác miễn là cùng interface.</p>
<div class="pitfall">"Use case diagram là sơ đồ cấu trúc" — <strong>sai</strong>, nó là sơ đồ hành vi. "Object diagram là sơ đồ hành vi" — <strong>sai</strong>, nó là sơ đồ cấu trúc (ảnh chụp các đối tượng tại một thời điểm).</div>`],
      [4, '1. UML Diagrams',
        `<p class="y-chinh">🎯 The bar chart shows how often each diagram is used in practice (100% = class): class 100%, activity 98%, sequence 97%, use case 96%, state machine 96%, communications 82%, component 80%, deployment 80%, object 71%, package 70%, composite structure 52%, timing 40%, interaction overview 39%, profile 11%.</p>
<p>Lesson: five diagrams cover almost all real use — <strong>class, activity, sequence, use case, state machine</strong>. These are also the five of the PE. Activity is used a lot in industry even though COMET barely uses it (Gomaa uses it only in Ch.6 to describe use-case flows), so here is one:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/a9a0fcf6cdb2b4794bf7b5cc36f2edc718335302.svg" alt="Activity diagram (behavioral) with two swimlanes: the steps of &quot;Reserve Lab Slot&quot;" loading="lazy" /><p class="chu-thich">🧩 Activity diagram (behavioral) with two swimlanes: the steps of "Reserve Lab Slot"</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 4 — activity diagram (98% usage): flow of the "Reserve Lab Slot" steps
|Student|
start
:Choose lab, date and slot;
|LabFlow|
:Check slot availability;
if (slot free?) then (yes)
  :Create reservation (Pending);
  fork
    :Notify Lab Manager;
  fork again
    :Show "waiting for approval";
  end fork
else (no)
  :Offer waitlist;
endif
|Student|
:See result;
stop
@enduml</code></pre></details>
<p><strong>Read:</strong> black dot = start; rounded box = an action; diamond = a decision (<code>[slot free?]</code>, with guards <em>yes</em>/<em>no</em>) or a merge; thick bar = fork (both branches run in parallel) and join; bull's-eye = end; columns (<em>swimlanes</em>) say <em>who</em> does each action.</p>
<p><strong>Draw it step by step:</strong> (1) list the steps as verbs; (2) put a start and an end; (3) add a diamond wherever the text says "if"; (4) label every exit of a diamond with a guard; (5) add swimlanes if more than one actor/part does the work.</p>
<div class="pitfall">Activity ≠ state machine: an activity box is a <em>step being done</em> ("Check availability"); a state is a <em>situation you wait in</em> ("Pending"). Using verbs as state names is a common PE mistake.</div>`,
        `<p class="y-chinh">🎯 Biểu đồ cột cho thấy mỗi sơ đồ được dùng thường xuyên đến đâu (100% = class): class 100%, activity 98%, sequence 97%, use case 96%, state machine 96%, communication 82%, component 80%, deployment 80%, object 71%, package 70%, composite structure 52%, timing 40%, interaction overview 39%, profile 11%.</p>
<p>Bài học: năm sơ đồ phủ gần hết việc thực tế — <strong>class, activity, sequence, use case, state machine</strong>. Đây cũng là năm sơ đồ của bài PE. Activity được dùng nhiều ngoài công ty dù COMET gần như không dùng (Gomaa chỉ dùng ở Ch.6 để tả luồng use case), nên đây là một ví dụ:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/a9a0fcf6cdb2b4794bf7b5cc36f2edc718335302.svg" alt="Activity diagram (hành vi) có hai làn bơi: các bước của &quot;Reserve Lab Slot&quot;" loading="lazy" /><p class="chu-thich">🧩 Activity diagram (hành vi) có hai làn bơi: các bước của "Reserve Lab Slot"</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 4 — activity diagram (98% người dùng): luồng các bước của "Reserve Lab Slot"
|Student|
start
:Choose lab, date and slot;
|LabFlow|
:Check slot availability;
if (slot free?) then (yes)
  :Create reservation (Pending);
  fork
    :Notify Lab Manager;
  fork again
    :Show "waiting for approval";
  end fork
else (no)
  :Offer waitlist;
endif
|Student|
:See result;
stop
@enduml</code></pre></details>
<p><strong>Đọc:</strong> chấm đen = bắt đầu; hộp bo góc = một hành động (action); hình thoi = rẽ nhánh (<code>[slot free?]</code>, với điều kiện canh — guard <em>yes</em>/<em>no</em>) hoặc gộp nhánh (merge); thanh đậm = tách song song (fork) và hợp lại (join); mắt bò = kết thúc; các cột (<em>swimlane — làn bơi</em>) nói <em>ai</em> làm mỗi hành động.</p>
<p><strong>Vẽ từng bước:</strong> (1) liệt kê các bước bằng động từ; (2) đặt điểm bắt đầu và kết thúc; (3) thêm hình thoi ở mọi chỗ đề bài nói "nếu"; (4) ghi guard cho mọi lối ra của hình thoi; (5) thêm làn bơi nếu có hơn một actor/bộ phận làm việc.</p>
<div class="pitfall">Activity khác state machine: hộp activity là <em>một bước đang làm</em> ("Check availability"); state là <em>một tình trạng đang chờ ở đó</em> ("Pending"). Đặt tên state bằng động từ là lỗi hay gặp trong bài PE.</div>`],
      [5, '2. Use Case Diagrams',
        `<p class="y-chinh">🎯 Four symbols: actor (stick figure, outside), system boundary (box), use case (ellipse inside the box), relationship (a line — the communication association between an actor and the use cases it takes part in).</p>
<p>The slide's airport example: a <em>Passenger Service</em> system; actors Check-In Representative, Passenger, Customs of Destination Airport, Baggage Transportation; use cases Check-In, Automated Check-In, Express Check-In, Boarding, Requesting Passenger List. The "Private" label marks the ellipse of a use case. Our own example, with the two relationships between use cases (Gomaa Figure 2.1) added:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/54cc88bb5625e7bfc1a0dc85c5a43d794fb80989.svg" alt="Use case diagram of LabFlow: actors, system boundary, use cases, associations, «include» and «extend»" loading="lazy" /><p class="chu-thich">🧩 Use case diagram of LabFlow: actors, system boundary, use cases, associations, «include» and «extend»</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 5 — actor, system boundary, use case, association, include/extend
left to right direction
skinparam packageStyle rectangle
actor Student
actor "Lab Manager" as LM
actor "Email System" as Mail &lt;&lt;external system&gt;&gt;
rectangle LabFlow {
  usecase "Reserve Lab Slot" as UC1
  usecase "Cancel Reservation" as UC2
  usecase "Approve Reservation" as UC3
  usecase "Check Availability" as UC4
  usecase "Join Waitlist" as UC5
}
Student -- UC1
Student -- UC2
LM -- UC3
UC3 -- Mail
UC1 ..&gt; UC4 : &lt;&lt;include&gt;&gt;
UC5 ..&gt; UC1 : &lt;&lt;extend&gt;&gt;
@enduml</code></pre></details>
<p><strong>Read:</strong> Student takes part in Reserve Lab Slot and Cancel Reservation; Lab Manager approves; the external Email System is a secondary actor (the system talks to it). <code>Reserve Lab Slot ..&gt; Check Availability «include»</code> = reserving <em>always</em> checks availability. <code>Join Waitlist ..&gt; Reserve Lab Slot «extend»</code> = joining the waitlist <em>sometimes</em> extends reserving (only when the slot is full).</p>
<p><strong>Draw it step by step:</strong> (1) find actors = roles or external systems outside the software; (2) for each actor list the goals it has ("verb + noun": Reserve Lab Slot); (3) draw the system box, put the ellipses inside and the actors outside; (4) connect each actor to its use cases with plain lines; (5) only then add include/extend if a step is shared or optional.</p>
<div class="pitfall">Top mark-losers: (a) arrows on actor–use case lines to show "data flow" — use plain lines; (b) use cases that are screens or buttons ("Login Page", "Click Save") instead of goals; (c) <strong>the extend arrow points to the base use case</strong> (Join Waitlist → Reserve Lab Slot), the include arrow points to the included one; (d) drawing the database as an actor — it is inside the system.</div>`,
        `<p class="y-chinh">🎯 Bốn ký hiệu: actor — tác nhân (hình người que, ở ngoài), ranh giới hệ thống — system boundary (hình chữ nhật), use case (hình elip trong khung), quan hệ — relationship (một đường thẳng — liên kết giao tiếp giữa actor và các use case nó tham gia).</p>
<p>Ví dụ sân bay trên slide: hệ thống <em>Passenger Service</em>; actor Check-In Representative (nhân viên làm thủ tục), Passenger (hành khách), Customs of Destination Airport (hải quan sân bay đến), Baggage Transportation (vận chuyển hành lý); use case Check-In, Automated Check-In, Express Check-In, Boarding, Requesting Passenger List. Nhãn "Private" chỉ vào hình elip của một use case. Ví dụ của chúng ta, thêm hai quan hệ giữa các use case (Hình 2.1 của Gomaa):</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/54cc88bb5625e7bfc1a0dc85c5a43d794fb80989.svg" alt="Use case diagram của LabFlow: actor, ranh giới hệ thống, use case, liên kết, «include» và «extend»" loading="lazy" /><p class="chu-thich">🧩 Use case diagram của LabFlow: actor, ranh giới hệ thống, use case, liên kết, «include» và «extend»</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 5 — actor, ranh giới hệ thống, use case, liên kết, include/extend
left to right direction
skinparam packageStyle rectangle
actor Student
actor "Lab Manager" as LM
actor "Email System" as Mail &lt;&lt;external system&gt;&gt;
rectangle LabFlow {
  usecase "Reserve Lab Slot" as UC1
  usecase "Cancel Reservation" as UC2
  usecase "Approve Reservation" as UC3
  usecase "Check Availability" as UC4
  usecase "Join Waitlist" as UC5
}
Student -- UC1
Student -- UC2
LM -- UC3
UC3 -- Mail
UC1 ..&gt; UC4 : &lt;&lt;include&gt;&gt;
UC5 ..&gt; UC1 : &lt;&lt;extend&gt;&gt;
@enduml</code></pre></details>
<p><strong>Đọc:</strong> Student tham gia Reserve Lab Slot và Cancel Reservation; Lab Manager duyệt; Email System bên ngoài là actor phụ (hệ thống nói chuyện với nó). <code>Reserve Lab Slot ..&gt; Check Availability «include»</code> = đặt ca <em>luôn luôn</em> kiểm tra còn trống. <code>Join Waitlist ..&gt; Reserve Lab Slot «extend»</code> = vào danh sách chờ <em>đôi khi</em> mở rộng việc đặt ca (chỉ khi ca đã đầy).</p>
<p><strong>Vẽ từng bước:</strong> (1) tìm actor = vai trò hoặc hệ thống bên ngoài phần mềm; (2) với mỗi actor, liệt kê mục tiêu của nó ("động từ + danh từ": Reserve Lab Slot); (3) vẽ khung hệ thống, elip ở trong, actor ở ngoài; (4) nối actor với use case bằng đường thẳng trơn; (5) sau cùng mới thêm include/extend nếu có bước dùng chung hoặc tuỳ chọn.</p>
<div class="pitfall">Lỗi mất điểm nhiều nhất: (a) vẽ mũi tên trên đường actor–use case để chỉ "luồng dữ liệu" — dùng đường trơn; (b) use case là màn hình hay nút bấm ("Login Page", "Click Save") thay vì mục tiêu; (c) <strong>mũi tên extend chỉ về use case gốc</strong> (Join Waitlist → Reserve Lab Slot), mũi tên include chỉ vào use case được gộp; (d) vẽ database thành actor — nó nằm trong hệ thống.</div>`],
      [6, '2. Use Case Diagrams',
        `<p class="y-chinh">🎯 A bigger use case diagram: use cases grouped into packages (broadcast, maintenance, discussion…) inside the Broadcasting System, and actor generalization — Premium Member → Member → General Member.</p>
<p>On the slide, the hollow triangle between actors means <em>generalization</em>: a Member is a special General Member, a Premium Member is a special Member. The child actor inherits every use case of its parent: General Member can Watch Archived Programs; Member can do that <em>and</em> Watch Live Programs; Premium Member can do all of it <em>and</em> Join Program Discussion, Subscribe to Newsletter. The Administrator uploads, archives, updates the timetable and delivers the newsletter. The same ideas on LabFlow:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/c98827fc73fbb3f0fa69b9492d62ccd69a40d1a5.svg" alt="Use cases grouped in packages; Team Leader → Student → User (actor generalization)" loading="lazy" /><p class="chu-thich">🧩 Use cases grouped in packages; Team Leader → Student → User (actor generalization)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
skinparam packageStyle folder
' Slide 6 — use cases grouped in packages + actor generalization
left to right direction
actor "User" as U
actor "Student" as S
actor "Team Leader" as TL
actor "Lab Manager" as LM
S -up-|&gt; U
TL -up-|&gt; S
rectangle "LabFlow" {
  package booking {
    usecase "View Lab Schedule" as V
    usecase "Reserve Lab Slot" as R
  }
  package team {
    usecase "Register Project Team" as T
  }
  package administration {
    usecase "Approve Reservation" as A
    usecase "Manage Labs" as M
  }
}
U -- V
S -- R
TL -- T
A -- LM
M -- LM
@enduml</code></pre></details>
<p><strong>Read:</strong> the arrow goes from child to parent, triangle at the parent. Team Leader can Register Project Team, Reserve Lab Slot (inherited from Student) and View Lab Schedule (inherited from User).</p>
<div class="pitfall">Triangle direction is the classic trap: it sits at the <strong>more general</strong> actor. If you draw User → Student, you have said every user is a student. Also: packages here only <em>organise</em> use cases (by area); they are not subsystems.</div>
<p class="meo">🧠 Use actor generalization only when the child really does <em>everything</em> the parent does plus more; otherwise just connect each actor to its own use cases.</p>`,
        `<p class="y-chinh">🎯 Một use case diagram lớn hơn: use case được gom vào các package (broadcast, maintenance, discussion…) trong Broadcasting System, và tổng quát hoá actor (actor generalization) — Premium Member → Member → General Member.</p>
<p>Trên slide, tam giác rỗng giữa hai actor nghĩa là <em>tổng quát hoá</em>: Member là một General Member đặc biệt, Premium Member là một Member đặc biệt. Actor con thừa hưởng mọi use case của actor cha: General Member xem được chương trình lưu trữ (Watch Archived Programs); Member làm được việc đó <em>và</em> xem trực tiếp (Watch Live Programs); Premium Member làm được tất cả <em>và</em> tham gia thảo luận (Join Program Discussion), đăng ký bản tin (Subscribe to Newsletter). Administrator tải lên, lưu trữ, cập nhật lịch phát và gửi bản tin. Cùng ý đó trên LabFlow:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/c98827fc73fbb3f0fa69b9492d62ccd69a40d1a5.svg" alt="Use case gom vào package; Team Leader → Student → User (tổng quát hoá actor)" loading="lazy" /><p class="chu-thich">🧩 Use case gom vào package; Team Leader → Student → User (tổng quát hoá actor)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
skinparam packageStyle folder
' Slide 6 — gom use case vào package + tổng quát hoá actor
left to right direction
actor "User" as U
actor "Student" as S
actor "Team Leader" as TL
actor "Lab Manager" as LM
S -up-|&gt; U
TL -up-|&gt; S
rectangle "LabFlow" {
  package booking {
    usecase "View Lab Schedule" as V
    usecase "Reserve Lab Slot" as R
  }
  package team {
    usecase "Register Project Team" as T
  }
  package administration {
    usecase "Approve Reservation" as A
    usecase "Manage Labs" as M
  }
}
U -- V
S -- R
TL -- T
A -- LM
M -- LM
@enduml</code></pre></details>
<p><strong>Đọc:</strong> mũi tên đi từ con tới cha, tam giác nằm ở cha. Team Leader được Register Project Team, Reserve Lab Slot (thừa hưởng từ Student) và View Lab Schedule (thừa hưởng từ User).</p>
<div class="pitfall">Chiều tam giác là bẫy kinh điển: nó nằm ở actor <strong>tổng quát hơn</strong>. Vẽ User → Student là bạn đã nói mọi người dùng đều là sinh viên. Thêm: package ở đây chỉ để <em>sắp xếp</em> use case theo mảng; nó không phải subsystem.</div>
<p class="meo">🧠 Chỉ dùng tổng quát hoá actor khi con thật sự làm <em>mọi</em> việc của cha và thêm nữa; nếu không, cứ nối từng actor với use case riêng của nó.</p>`],
      [7, '3. Classes and Objects',
        `<p class="y-chinh">🎯 A class is a box with up to three compartments — name, attributes, operations; an object (an instance) is drawn the same way but named <code>anObject : Class</code>, underlined.</p>
<p>The slide's large figure is an order system; redrawn in PlantUML so you can read every symbol:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/d3a0ce28ee4f1697cddedf0ba2b7b664301e1a48.svg" alt="The slide's Order example: one Customer has 0..* Orders; an Order aggregates 1..* OrderDetails (line items), each for one Item; an Order is paid by 1..* Payments, which are Cash, Check or Credit" loading="lazy" /><p class="chu-thich">🧩 The slide's Order example: one Customer has 0..* Orders; an Order aggregates 1..* OrderDetails (line items), each for one Item; an Order is paid by 1..* Payments, which are Cash, Check or Credit</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 7 — the school's Order example redrawn (classes, attributes, operations, associations, aggregation, generalization)
hide circle
skinparam classAttributeIconSize 0
class Customer {
  -name : String
  -address
}
class Order {
  -date : Date
  -status : String
  +calcSubTotal()
  +calcTax()
  +calcTotal()
  +calcTotalWeight()
}
class OrderDetail {
  -quantity
  -taxStatus : String
  +calcSubTotal()
  +calcWeight()
  +calcTax()
}
class Item {
  -shippingWeight
  -description : String
  +getPriceForQuantity()
  +getTax()
  +inStock()
}
class Payment {
  -amount : float
}
class Cash {
  -cashTendered : float
}
class Check {
  -name : String
  -bankID : String
  +authorized()
}
class Credit {
  -name : String
  -type : String
  -expDate
  +authorized()
}
Customer "1" -down- "0..*" Order
Order "1" o-right--- "1..*" OrderDetail : line item
OrderDetail "0..*" -down- "1" Item
Order "1" -- "1..*" Payment
Cash -up-|&gt; Payment
Check -up-|&gt; Payment
Credit -up-|&gt; Payment
@enduml</code></pre></details>
<p>The small figures on the slide: class <code>Packet</code> labelled <em>Attributes</em> (<code>-originator : String</code>, <code>-destination</code>, <code>-content</code>) and <em>Operations</em> (<code>+isOriginator(n : Node) : boolean</code>, <code>+getContent() : String</code>); class <code>Member</code> showing Public / Protected / Private (slide 10). Now the difference class ↔ object (Gomaa Figure 2.2):</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/a1ec0711b291867121212b5c3e33bc8863628df3.svg" alt="Class vs objects: r1 and r2 are two instances of Reservation, linked to the same Lab object" loading="lazy" /><p class="chu-thich">🧩 Class vs objects: r1 and r2 are two instances of Reservation, linked to the same Lab object</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 7 — class (the type) vs objects (instances); object name : ClassName
allowmixing
hide circle
skinparam classAttributeIconSize 0
class Reservation {
  -date : Date
  -slot : Integer
  -status : String
  +approve()
  +cancel()
}
object "__r1 : Reservation__" as r1 {
  date = 2026-10-05
  slot = 2
  status = "APPROVED"
}
object "__r2 : Reservation__" as r2 {
  date = 2026-10-05
  slot = 3
  status = "PENDING"
}
object "__: Lab__" as lab {
  labCode = "LAB-401"
}
r1 ..&gt; Reservation : &lt;&lt;instanceOf&gt;&gt;
r2 ..&gt; Reservation : &lt;&lt;instanceOf&gt;&gt;
r1 -- lab
r2 -- lab
@enduml</code></pre></details>
<p>Object names can be written three ways: <code>r1 : Reservation</code> (name + class), <code>r1</code> (name only), <code>: Reservation</code> (anonymous object of class Reservation). In object boxes the attributes carry <em>values</em> (<code>slot = 2</code>), not types.</p>
<div class="pitfall">Gomaa: objects are underlined on object diagrams, but <strong>not</strong> underlined on communication and sequence diagrams. And a class name is a singular noun starting with a capital (<code>Reservation</code>, not <code>reservations</code>).</div>`,
        `<p class="y-chinh">🎯 Lớp (class) là hộp có tối đa ba ngăn — tên, thuộc tính (attribute), thao tác (operation); đối tượng (object — một thể hiện, instance) vẽ giống vậy nhưng tên viết <code>tênĐốiTượng : Lớp</code>, gạch chân.</p>
<p>Hình lớn trên slide là hệ thống đặt hàng; vẽ lại bằng PlantUML để bạn đọc từng ký hiệu:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/d3a0ce28ee4f1697cddedf0ba2b7b664301e1a48.svg" alt="Ví dụ Order của slide: một Customer có 0..* Order; một Order kết tập 1..* OrderDetail (dòng hàng), mỗi dòng ứng một Item; một Order được trả bằng 1..* Payment, là Cash, Check hoặc Credit" loading="lazy" /><p class="chu-thich">🧩 Ví dụ Order của slide: một Customer có 0..* Order; một Order kết tập 1..* OrderDetail (dòng hàng), mỗi dòng ứng một Item; một Order được trả bằng 1..* Payment, là Cash, Check hoặc Credit</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 7 — vẽ lại ví dụ Order của slide trường (lớp, thuộc tính, thao tác, association, aggregation, generalization)
hide circle
skinparam classAttributeIconSize 0
class Customer {
  -name : String
  -address
}
class Order {
  -date : Date
  -status : String
  +calcSubTotal()
  +calcTax()
  +calcTotal()
  +calcTotalWeight()
}
class OrderDetail {
  -quantity
  -taxStatus : String
  +calcSubTotal()
  +calcWeight()
  +calcTax()
}
class Item {
  -shippingWeight
  -description : String
  +getPriceForQuantity()
  +getTax()
  +inStock()
}
class Payment {
  -amount : float
}
class Cash {
  -cashTendered : float
}
class Check {
  -name : String
  -bankID : String
  +authorized()
}
class Credit {
  -name : String
  -type : String
  -expDate
  +authorized()
}
Customer "1" -down- "0..*" Order
Order "1" o-right--- "1..*" OrderDetail : line item
OrderDetail "0..*" -down- "1" Item
Order "1" -- "1..*" Payment
Cash -up-|&gt; Payment
Check -up-|&gt; Payment
Credit -up-|&gt; Payment
@enduml</code></pre></details>
<p>Các hình nhỏ trên slide: lớp <code>Packet</code> có nhãn <em>Attributes</em> (<code>-originator : String</code>, <code>-destination</code>, <code>-content</code>) và <em>Operations</em> (<code>+isOriginator(n : Node) : boolean</code>, <code>+getContent() : String</code>); lớp <code>Member</code> chỉ ra Public / Protected / Private (slide 10). Giờ tới chỗ khác nhau giữa lớp và đối tượng (Hình 2.2 của Gomaa):</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/a1ec0711b291867121212b5c3e33bc8863628df3.svg" alt="Lớp và đối tượng: r1 và r2 là hai thể hiện của Reservation, cùng nối tới một đối tượng Lab" loading="lazy" /><p class="chu-thich">🧩 Lớp và đối tượng: r1 và r2 là hai thể hiện của Reservation, cùng nối tới một đối tượng Lab</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 7 — lớp (kiểu) và đối tượng (thể hiện); tên đối tượng : TênLớp, gạch chân
allowmixing
hide circle
skinparam classAttributeIconSize 0
class Reservation {
  -date : Date
  -slot : Integer
  -status : String
  +approve()
  +cancel()
}
object "__r1 : Reservation__" as r1 {
  date = 2026-10-05
  slot = 2
  status = "APPROVED"
}
object "__r2 : Reservation__" as r2 {
  date = 2026-10-05
  slot = 3
  status = "PENDING"
}
object "__: Lab__" as lab {
  labCode = "LAB-401"
}
r1 ..&gt; Reservation : &lt;&lt;instanceOf&gt;&gt;
r2 ..&gt; Reservation : &lt;&lt;instanceOf&gt;&gt;
r1 -- lab
r2 -- lab
@enduml</code></pre></details>
<p>Tên đối tượng viết được ba kiểu: <code>r1 : Reservation</code> (tên + lớp), <code>r1</code> (chỉ tên), <code>: Reservation</code> (đối tượng vô danh của lớp Reservation). Trong hộp đối tượng, thuộc tính mang <em>giá trị</em> (<code>slot = 2</code>), không phải kiểu.</p>
<p><strong>Đọc hình Order:</strong> <code>+</code>/<code>-</code> là tầm nhìn (slide 10); số ở hai đầu đường là bội số (slide 8); kim cương rỗng ở phía Order là kết tập (aggregation); tam giác rỗng ở Payment là kế thừa — Cash, Check, Credit là các loại Payment.</p>
<div class="pitfall">Gomaa: đối tượng được gạch chân trên object diagram, nhưng <strong>không</strong> gạch chân trên communication và sequence diagram. Và tên lớp là danh từ số ít viết hoa chữ đầu (<code>Reservation</code>, không phải <code>reservations</code>).</div>`],
      [8, '4. Classes Diagrams',
        `<p class="y-chinh">🎯 In a class diagram classes are boxes and relationships are lines; there are six main relationships — inheritance, realization/implementation, composition, aggregation, association, dependency — and each association end carries a multiplicity.</p>
<p>The slide's legend of arrows, and all six in one small library model:</p>
<table>
<thead><tr><th>Relationship</th><th>Line and head</th><th>Meaning</th><th>Java</th></tr></thead>
<tbody>
<tr><td>Association</td><td>solid line (arrowhead optional = navigability)</td><td>objects of the two classes are linked</td><td>a field referring to the other class</td></tr>
<tr><td>Inheritance (generalization)</td><td>solid line, <strong>hollow triangle</strong> at the parent</td><td>"is a kind of"</td><td><code>extends</code></td></tr>
<tr><td>Realization / implementation</td><td><strong>dashed</strong> line, hollow triangle at the interface</td><td>"implements the contract of"</td><td><code>implements</code></td></tr>
<tr><td>Dependency</td><td>dashed line, open arrow</td><td>"uses, temporarily"</td><td>a parameter or local variable</td></tr>
<tr><td>Aggregation</td><td>solid line, <strong>hollow diamond</strong> at the whole</td><td>whole/part, the part can live alone</td><td>a list of objects created elsewhere</td></tr>
<tr><td>Composition</td><td>solid line, <strong>filled diamond</strong> at the whole</td><td>strong whole/part, the part dies with the whole</td><td>the whole creates and owns its parts</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/74cade84a44b17f69d3769efd1d4bd8baa81202d.svg" alt="The six relationships: composition Library–Shelf, aggregation Shelf–Book, generalization PrintedBook/EBook → Book, realization Book → Searchable, association Member–Loan–Book, dependency LoanService → FineCalculator" loading="lazy" /><p class="chu-thich">🧩 The six relationships: composition Library–Shelf, aggregation Shelf–Book, generalization PrintedBook/EBook → Book, realization Book → Searchable, association Member–Loan–Book, dependency LoanService → FineCalculator</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 8 — the six relationships in one small library model
hide circle
skinparam classAttributeIconSize 0
class Library
class Shelf
class Book {
  -isbn : String
  -title : String
}
class PrintedBook {
  -pages : int
}
class EBook {
  -fileSizeMb : double
}
interface Searchable &lt;&lt;interface&gt;&gt; {
  +matches(keyword : String) : boolean
}
class Member {
  -name : String
}
class Loan {
  -dueDate : Date
}
class LoanService {
  +checkOut(m : Member, b : Book) : Loan
}
class FineCalculator {
  +fine(loan : Loan) : double
}
Library "1" *-- "1..*" Shelf : composition
Shelf "1" o-- "0..*" Book : aggregation
PrintedBook -up-|&gt; Book
EBook -up-|&gt; Book
Book .up.|&gt; Searchable : realization
Member "1" -- "0..*" Loan : association
Loan "0..*" -- "1" Book
LoanService ..&gt; FineCalculator : dependency
@enduml</code></pre></details>
<p>The same model as running Java — each relationship becomes a different piece of code:</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;

// The six class relationships of slide 8, as Java code (library model)
interface Searchable {                              // «interface»
    boolean matches(String keyword);
}

class Book implements Searchable {                  // REALIZATION: implements
    final String title;
    Book(String title) { this.title = title; }
    public boolean matches(String keyword) { return title.toLowerCase().contains(keyword.toLowerCase()); }
}

class EBook extends Book {                          // GENERALIZATION: extends
    EBook(String title) { super(title); }
}

class Shelf {
    final List&lt;Book&gt; books = new ArrayList&lt;&gt;();     // AGGREGATION: holds books created elsewhere
    void put(Book b) { books.add(b); }
}

class Library {
    private final List&lt;Shelf&gt; shelves = new ArrayList&lt;&gt;();
    Library(int n) {                                // COMPOSITION: the whole creates and owns its parts
        for (int i = 0; i &lt; n; i++) shelves.add(new Shelf());
    }
    Shelf shelf(int i) { return shelves.get(i); }
    int shelfCount() { return shelves.size(); }
}

class Member {
    final String name;
    final List&lt;Loan&gt; loans = new ArrayList&lt;&gt;();     // ASSOCIATION 1 -- 0..*: a field that refers to other objects
    Member(String name) { this.name = name; }
}

class Loan {
    final Member member;                            // the other end of the association
    final Book book;
    final int daysLate;
    Loan(Member m, Book b, int daysLate) { this.member = m; this.book = b; this.daysLate = daysLate; m.loans.add(this); }
}

class FineCalculator {
    double fine(Loan loan) { return loan.daysLate * 5000; }
}

class LoanService {
    // DEPENDENCY: FineCalculator is only a parameter, no field keeps it
    double totalFine(Member m, FineCalculator calc) {
        double sum = 0;
        for (Loan l : m.loans) sum += calc.fine(l);
        return sum;
    }
}

public class SauQuanHe {
    public static void main(String[] args) {
        Book java = new Book("Java Programming");
        Book uml = new EBook("UML Distilled");
        Library lib = new Library(2);
        lib.shelf(0).put(java);
        lib.shelf(0).put(uml);
        System.out.println("shelves = " + lib.shelfCount() + ", books on shelf 0 = " + lib.shelf(0).books.size());

        lib = null;                                 // the library is gone → its shelves are gone too
        System.out.println("book still exists: " + uml.title + " (EBook? " + (uml instanceof EBook) + ")");

        Member lan = new Member("Lan");
        new Loan(lan, java, 3);
        new Loan(lan, uml, 0);
        System.out.println(lan.name + " has " + lan.loans.size() + " loans");
        System.out.println("fine = " + new LoanService().totalFine(lan, new FineCalculator()));
        System.out.println("search 'uml' -&gt; " + uml.matches("uml"));
    }
}</code></pre>
<div class="out">shelves = 2, books on shelf 0 = 2<br>
book still exists: UML Distilled (EBook? true)<br>
Lan has 2 loans<br>
fine = 15000.0<br>
search 'uml' -&gt; true</div>
<p><strong>Multiplicity</strong> = how many objects at the far end relate to <em>one</em> object at the near end: <code>1</code> exactly one, <code>0..1</code> zero or one, <code>*</code> (= <code>0..*</code>) many, <code>1..*</code> one or more, <code>m..n</code> numerically specified. The slide's example: one Company has <code>1..*</code> Employees, each Employee belongs to exactly <code>1</code> Company.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/76829ba9f3ed60b2117e6f1517f1addf2db2da1b.svg" alt="Multiplicity examples: 0..1 student card, 1..* computers, * reservations, 3..5 team members" loading="lazy" /><p class="chu-thich">🧩 Multiplicity examples: 0..1 student card, 1..* computers, * reservations, 3..5 team members</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 8 — multiplicity: how many objects at the other end, for ONE object at this end
hide circle
hide members
left to right direction
class Student
class StudentCard
class Lab
class Computer
class Reservation
class ProjectTeam
Student "1" -- "0..1" StudentCard : owns &gt;
Lab "1" -- "1..*" Computer : contains &gt;
Lab "1" -- "*" Reservation : booked by &gt;
ProjectTeam "1" -- "3..5" Student : has members &gt;
@enduml</code></pre></details>
<p><strong>Read multiplicity from the far side:</strong> "one ProjectTeam has <em>3..5</em> Students" — the number written next to Student. The small ▶ tells you in which direction to read the association name.</p>
<div class="pitfall">(a) The diamond sits at the <strong>whole</strong>, never at the part. (b) Composition vs aggregation: ask "if the whole is deleted, is the part deleted too?" — yes → filled diamond. (c) Multiplicity is written next to the class it counts; swapping ends turns "a Lab has many reservations" into "a Reservation has many labs".</div>`,
        `<p class="y-chinh">🎯 Trong class diagram, lớp là hộp và quan hệ là đường nối; có sáu quan hệ chính — kế thừa (inheritance), hiện thực hoá (realization/implementation), hợp thành (composition), kết tập (aggregation), liên kết (association), phụ thuộc (dependency) — và mỗi đầu của liên kết mang một bội số (multiplicity).</p>
<p>Bảng ký hiệu mũi tên của slide, và cả sáu quan hệ trong một mô hình thư viện nhỏ:</p>
<table>
<thead><tr><th>Quan hệ</th><th>Nét và đầu mũi tên</th><th>Nghĩa</th><th>Trong Java</th></tr></thead>
<tbody>
<tr><td>Association (liên kết)</td><td>nét liền (đầu mũi tên tuỳ chọn = chiều điều hướng)</td><td>đối tượng hai lớp có nối với nhau</td><td>một trường trỏ tới lớp kia</td></tr>
<tr><td>Inheritance / generalization (kế thừa / tổng quát hoá)</td><td>nét liền, <strong>tam giác rỗng</strong> ở lớp cha</td><td>"là một loại của"</td><td><code>extends</code></td></tr>
<tr><td>Realization (hiện thực hoá)</td><td>nét <strong>đứt</strong>, tam giác rỗng ở interface</td><td>"thực hiện hợp đồng của"</td><td><code>implements</code></td></tr>
<tr><td>Dependency (phụ thuộc)</td><td>nét đứt, mũi tên hở</td><td>"dùng tạm thời"</td><td>tham số hoặc biến cục bộ</td></tr>
<tr><td>Aggregation (kết tập)</td><td>nét liền, <strong>kim cương rỗng</strong> ở phía toàn thể</td><td>toàn thể/bộ phận, bộ phận sống độc lập được</td><td>danh sách đối tượng được tạo ở chỗ khác</td></tr>
<tr><td>Composition (hợp thành)</td><td>nét liền, <strong>kim cương đặc</strong> ở phía toàn thể</td><td>toàn thể/bộ phận chặt, bộ phận chết theo toàn thể</td><td>toàn thể tự tạo và sở hữu bộ phận</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/74cade84a44b17f69d3769efd1d4bd8baa81202d.svg" alt="Sáu quan hệ: hợp thành Library–Shelf, kết tập Shelf–Book, tổng quát hoá PrintedBook/EBook → Book, hiện thực hoá Book → Searchable, liên kết Member–Loan–Book, phụ thuộc LoanService → FineCalculator" loading="lazy" /><p class="chu-thich">🧩 Sáu quan hệ: hợp thành Library–Shelf, kết tập Shelf–Book, tổng quát hoá PrintedBook/EBook → Book, hiện thực hoá Book → Searchable, liên kết Member–Loan–Book, phụ thuộc LoanService → FineCalculator</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 8 — sáu quan hệ trong một mô hình thư viện nhỏ
hide circle
skinparam classAttributeIconSize 0
class Library
class Shelf
class Book {
  -isbn : String
  -title : String
}
class PrintedBook {
  -pages : int
}
class EBook {
  -fileSizeMb : double
}
interface Searchable &lt;&lt;interface&gt;&gt; {
  +matches(keyword : String) : boolean
}
class Member {
  -name : String
}
class Loan {
  -dueDate : Date
}
class LoanService {
  +checkOut(m : Member, b : Book) : Loan
}
class FineCalculator {
  +fine(loan : Loan) : double
}
Library "1" *-- "1..*" Shelf : composition
Shelf "1" o-- "0..*" Book : aggregation
PrintedBook -up-|&gt; Book
EBook -up-|&gt; Book
Book .up.|&gt; Searchable : realization
Member "1" -- "0..*" Loan : association
Loan "0..*" -- "1" Book
LoanService ..&gt; FineCalculator : dependency
@enduml</code></pre></details>
<p>Cùng mô hình đó viết thành Java chạy thật — mỗi quan hệ thành một kiểu code khác nhau:</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;

// Sáu quan hệ lớp của slide 8, viết thành code Java (mô hình thư viện)
interface Searchable {                              // «interface»
    boolean matches(String keyword);
}

class Book implements Searchable {                  // HIỆN THỰC HOÁ: implements
    final String title;
    Book(String title) { this.title = title; }
    public boolean matches(String keyword) { return title.toLowerCase().contains(keyword.toLowerCase()); }
}

class EBook extends Book {                          // TỔNG QUÁT HOÁ: extends
    EBook(String title) { super(title); }
}

class Shelf {
    final List&lt;Book&gt; books = new ArrayList&lt;&gt;();     // KẾT TẬP: giữ sách được tạo ở nơi khác
    void put(Book b) { books.add(b); }
}

class Library {
    private final List&lt;Shelf&gt; shelves = new ArrayList&lt;&gt;();
    Library(int n) {                                // HỢP THÀNH: cái toàn thể tự tạo và sở hữu bộ phận
        for (int i = 0; i &lt; n; i++) shelves.add(new Shelf());
    }
    Shelf shelf(int i) { return shelves.get(i); }
    int shelfCount() { return shelves.size(); }
}

class Member {
    final String name;
    final List&lt;Loan&gt; loans = new ArrayList&lt;&gt;();     // LIÊN KẾT 1 -- 0..*: một trường trỏ tới đối tượng khác
    Member(String name) { this.name = name; }
}

class Loan {
    final Member member;                            // đầu kia của liên kết
    final Book book;
    final int daysLate;
    Loan(Member m, Book b, int daysLate) { this.member = m; this.book = b; this.daysLate = daysLate; m.loans.add(this); }
}

class FineCalculator {
    double fine(Loan loan) { return loan.daysLate * 5000; }
}

class LoanService {
    // PHỤ THUỘC: FineCalculator chỉ là tham số, không có trường nào giữ nó
    double totalFine(Member m, FineCalculator calc) {
        double sum = 0;
        for (Loan l : m.loans) sum += calc.fine(l);
        return sum;
    }
}

public class SauQuanHe {
    public static void main(String[] args) {
        Book java = new Book("Java Programming");
        Book uml = new EBook("UML Distilled");
        Library lib = new Library(2);
        lib.shelf(0).put(java);
        lib.shelf(0).put(uml);
        System.out.println("shelves = " + lib.shelfCount() + ", books on shelf 0 = " + lib.shelf(0).books.size());

        lib = null;                                 // thư viện mất → các kệ của nó cũng mất
        System.out.println("book still exists: " + uml.title + " (EBook? " + (uml instanceof EBook) + ")");

        Member lan = new Member("Lan");
        new Loan(lan, java, 3);
        new Loan(lan, uml, 0);
        System.out.println(lan.name + " has " + lan.loans.size() + " loans");
        System.out.println("fine = " + new LoanService().totalFine(lan, new FineCalculator()));
        System.out.println("search 'uml' -&gt; " + uml.matches("uml"));
    }
}</code></pre>
<div class="out">shelves = 2, books on shelf 0 = 2<br>
book still exists: UML Distilled (EBook? true)<br>
Lan has 2 loans<br>
fine = 15000.0<br>
search 'uml' -&gt; true</div>
<p><strong>Bội số (multiplicity)</strong> = có bao nhiêu đối tượng ở đầu xa liên quan tới <em>một</em> đối tượng ở đầu gần: <code>1</code> đúng một, <code>0..1</code> không hoặc một, <code>*</code> (= <code>0..*</code>) nhiều, <code>1..*</code> một hoặc nhiều, <code>m..n</code> ghi số cụ thể. Ví dụ trên slide: một Company có <code>1..*</code> Employee, mỗi Employee thuộc đúng <code>1</code> Company.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/76829ba9f3ed60b2117e6f1517f1addf2db2da1b.svg" alt="Ví dụ bội số: 0..1 thẻ sinh viên, 1..* máy tính, * lượt đặt, 3..5 thành viên nhóm" loading="lazy" /><p class="chu-thich">🧩 Ví dụ bội số: 0..1 thẻ sinh viên, 1..* máy tính, * lượt đặt, 3..5 thành viên nhóm</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 8 — bội số: với MỘT đối tượng ở đầu này thì có bao nhiêu đối tượng ở đầu kia
hide circle
hide members
left to right direction
class Student
class StudentCard
class Lab
class Computer
class Reservation
class ProjectTeam
Student "1" -- "0..1" StudentCard : owns &gt;
Lab "1" -- "1..*" Computer : contains &gt;
Lab "1" -- "*" Reservation : booked by &gt;
ProjectTeam "1" -- "3..5" Student : has members &gt;
@enduml</code></pre></details>
<p><strong>Đọc bội số từ phía xa:</strong> "một ProjectTeam có <em>3..5</em> Student" — con số ghi cạnh Student. Dấu ▶ nhỏ cho biết đọc tên liên kết theo chiều nào.</p>
<div class="pitfall">(a) Kim cương nằm ở phía <strong>toàn thể</strong>, không bao giờ ở phía bộ phận. (b) Hợp thành hay kết tập: hỏi "xoá toàn thể thì bộ phận có bị xoá theo không?" — có → kim cương đặc. (c) Bội số ghi cạnh lớp mà nó đếm; đảo hai đầu thì "một Lab có nhiều lượt đặt" thành "một Reservation có nhiều Lab".</div>`],
      [9, '4. Classes Diagrams',
        `<p class="y-chinh">🎯 Four examples on one slide: generalization (Printer and FileServer are kinds of Server), abstract class and abstract method (Person, <code>printInfo()</code> in italics), realization (classes implementing the interface IShape), dependency (ReportGenerator uses Formatter).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/071d4c6f48000d5bd2be8cdd49355d8d64293492.svg" alt="The slide's four examples redrawn: generalization, abstract class/method, realization, dependency" loading="lazy" /><p class="chu-thich">🧩 The slide's four examples redrawn: generalization, abstract class/method, realization, dependency</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 9 — generalization, abstract class &amp; method, realization, dependency (school examples)
hide circle
skinparam classAttributeIconSize 0
class Server {
  +isForMe(p : Packet) : boolean
}
class Printer {
  +print(p : Packet)
}
class FileServer {
  +save(p : Packet)
}
Printer -up-|&gt; Server
FileServer -up-|&gt; Server

abstract class Person &lt;&lt;abstract&gt;&gt; {
  -name
  -address
  {abstract} +printInfo()
}
class Employee {
  +getSalary()
  +printInfo()
}
class Customer {
  +printBalance()
  +printInfo()
}
Employee -up-|&gt; Person
Customer -up-|&gt; Person

interface IShape &lt;&lt;interface&gt;&gt; {
  +showName()
}
class Circle {
  -name
  +showName()
}
class Square {
  -name
  +showName()
}
Circle .up.|&gt; IShape
Square .up.|&gt; IShape

class ReportGenerator
class Formatter
ReportGenerator .right.&gt; Formatter
@enduml</code></pre></details>
<ul>
<li><strong>Generalization</strong>: subclasses inherit <code>isForMe(p : Packet)</code> and add their own <code>print</code> / <code>save</code>.</li>
<li><strong>Abstract class</strong>: its name is in <em>italics</em> (or marked <code>{abstract}</code>); you cannot create a Person, only an Employee or a Customer. An <strong>abstract method</strong> (<em>italic</em> <code>printInfo()</code>) has no body; every concrete subclass must implement it — which is why both Employee and Customer list <code>printInfo()</code> again.</li>
<li><strong>Realization</strong>: the interface IShape only declares <code>showName()</code>; each class provides the code.</li>
<li><strong>Dependency</strong>: ReportGenerator uses a Formatter (e.g. as a parameter) but does not keep it.</li>
</ul>
<div class="pitfall">The slide's realization figure names <strong>both</strong> classes "Circle" — a mistake in the figure (two classes cannot share a name in one package); read it as Circle and another shape, e.g. Square, as redrawn above. Also: italic handwriting is hard to see on paper — in the PE write <code>{abstract}</code> next to the name.</div>
<div class="callout">➕ <strong>Beyond the slide — abstract class or interface?</strong> Use an abstract class when subclasses share <em>data and code</em> (Person has name, address); use an interface when unrelated classes share only a <em>contract</em> (anything that can be searched). In Spring Boot you meet interfaces everywhere: <code>ReservationRepository extends JpaRepository</code>, services injected by interface.</div>`,
        `<p class="y-chinh">🎯 Bốn ví dụ trên một slide: tổng quát hoá (Printer và FileServer là các loại Server), lớp trừu tượng và phương thức trừu tượng (Person, <code>printInfo()</code> in nghiêng), hiện thực hoá (các lớp cài đặt interface IShape), phụ thuộc (ReportGenerator dùng Formatter).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/071d4c6f48000d5bd2be8cdd49355d8d64293492.svg" alt="Bốn ví dụ của slide vẽ lại: tổng quát hoá, lớp/phương thức trừu tượng, hiện thực hoá, phụ thuộc" loading="lazy" /><p class="chu-thich">🧩 Bốn ví dụ của slide vẽ lại: tổng quát hoá, lớp/phương thức trừu tượng, hiện thực hoá, phụ thuộc</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 9 — tổng quát hoá, lớp &amp; phương thức trừu tượng, hiện thực hoá, phụ thuộc (ví dụ của slide trường)
hide circle
skinparam classAttributeIconSize 0
class Server {
  +isForMe(p : Packet) : boolean
}
class Printer {
  +print(p : Packet)
}
class FileServer {
  +save(p : Packet)
}
Printer -up-|&gt; Server
FileServer -up-|&gt; Server

abstract class Person &lt;&lt;abstract&gt;&gt; {
  -name
  -address
  {abstract} +printInfo()
}
class Employee {
  +getSalary()
  +printInfo()
}
class Customer {
  +printBalance()
  +printInfo()
}
Employee -up-|&gt; Person
Customer -up-|&gt; Person

interface IShape &lt;&lt;interface&gt;&gt; {
  +showName()
}
class Circle {
  -name
  +showName()
}
class Square {
  -name
  +showName()
}
Circle .up.|&gt; IShape
Square .up.|&gt; IShape

class ReportGenerator
class Formatter
ReportGenerator .right.&gt; Formatter
@enduml</code></pre></details>
<ul>
<li><strong>Tổng quát hoá</strong>: lớp con thừa hưởng <code>isForMe(p : Packet)</code> và thêm <code>print</code> / <code>save</code> của riêng mình.</li>
<li><strong>Lớp trừu tượng (abstract class)</strong>: tên in <em>nghiêng</em> (hoặc ghi <code>{abstract}</code>); không tạo được Person, chỉ tạo được Employee hay Customer. <strong>Phương thức trừu tượng</strong> (<code>printInfo()</code> in <em>nghiêng</em>) không có thân; mọi lớp con cụ thể phải cài đặt nó — vì vậy cả Employee lẫn Customer đều ghi lại <code>printInfo()</code>.</li>
<li><strong>Hiện thực hoá</strong>: interface IShape chỉ khai báo <code>showName()</code>; mỗi lớp tự viết code.</li>
<li><strong>Phụ thuộc</strong>: ReportGenerator dùng một Formatter (vd làm tham số) nhưng không giữ lại.</li>
</ul>
<div class="pitfall">Hình hiện thực hoá trên slide đặt tên <strong>cả hai</strong> lớp là "Circle" — lỗi của hình (hai lớp không thể trùng tên trong một package); hiểu là Circle và một hình khác, vd Square, như vẽ lại ở trên. Thêm: chữ nghiêng viết tay trên giấy khó thấy — trong bài PE hãy ghi <code>{abstract}</code> cạnh tên.</div>
<div class="callout">➕ <strong>Mở rộng ngoài slide — lớp trừu tượng hay interface?</strong> Dùng lớp trừu tượng khi các lớp con dùng chung <em>dữ liệu và code</em> (Person có name, address); dùng interface khi các lớp không họ hàng chỉ chung một <em>hợp đồng</em> (thứ gì cũng tìm kiếm được). Trong Spring Boot bạn gặp interface khắp nơi: <code>ReservationRepository extends JpaRepository</code>, service được tiêm (inject) qua interface.</div>`],
      [10, '4. Classes Diagrams',
        `<p class="y-chinh">🎯 Visibility says whether an element can be seen from outside its class: <code>+</code> public (visible from outside), <code>-</code> private (only inside the defining class), <code>#</code> protected (inside the class and all its subclasses).</p>
<p>The slide's Member class: <code>+ name : String</code>, <code># address : String</code>, <code>- id : Integer</code>, <code>+ Display()</code>, <code>- Add()</code>, <code>- Edit()</code>, <code># Delete</code>. Redrawn with a subclass to show what <code>#</code> means:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/ad0de2aa43d7d3e9ed287cf831ae0f863624a5b8.svg" alt="Visibility: PremiumMember sees + and # members of Member, not the - ones" loading="lazy" /><p class="chu-thich">🧩 Visibility: PremiumMember sees + and # members of Member, not the - ones</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 10 — visibility: + public, - private, # protected (the slide's Member class + a subclass)
hide circle
skinparam classAttributeIconSize 0
class Member {
  +name : String
  #address : String
  -id : Integer
  +display()
  -add()
  -edit()
  #delete()
}
class PremiumMember {
  -discount : double
  +display()
}
PremiumMember -up-|&gt; Member
note right of PremiumMember
  can use name and address (+, #)
  cannot use id or add() (-)
end note
@enduml</code></pre></details>
<pre><code class="language-java">// Slide 10: + public, - private, # protected, in Java
class Member {
    public String name = "Lan";          // + name
    protected String address = "Da Nang"; // # address
    private int id = 42;                  // - id

    public String display() { return name + " / " + address + " / id=" + id; } // inside the class: sees everything
}

class PremiumMember extends Member {
    String card() {
        // name (+) and address (#) are visible in a subclass
        return name + " @ " + address;
        // return "" + id;  ← compile error: id has private access in Member
    }
}

public class Visibility {
    public static void main(String[] args) {
        PremiumMember p = new PremiumMember();
        System.out.println(p.display());
        System.out.println(p.card());
        System.out.println(p.name);      // public: visible anywhere
        System.out.println(p.address);   // compiles ONLY because this class is in the same package (Java rule)
    }
}</code></pre>
<div class="out">Lan / Da Nang / id=42<br>
Lan @ Da Nang<br>
Lan<br>
Da Nang</div>
<p>The commented line in <code>card()</code> would not compile: <code>id</code> is private. The last line of <code>main</code> reads a protected field from a class that is <em>not</em> a subclass — Java allows it only because both classes are in the same package.</p>
<div class="pitfall">Java's <code>protected</code> is wider than UML's <code>#</code>: it also opens the member to every class in the same package. Java also has a fourth level, package-private (no keyword), drawn in UML as <code>~</code>. The exam asks the UML meaning: <code>#</code> = class + subclasses.</div>
<p class="meo">🧠 Default design rule (information hiding): attributes <code>-</code>, operations the outside needs <code>+</code>, helpers <code>-</code>. A class diagram full of <code>+</code> attributes is a design smell.</p>`,
        `<p class="y-chinh">🎯 Tầm nhìn (visibility) cho biết một phần tử có được thấy từ ngoài lớp không: <code>+</code> public (thấy từ bên ngoài), <code>-</code> private (chỉ trong lớp định nghĩa nó), <code>#</code> protected (trong lớp đó và mọi lớp con).</p>
<p>Lớp Member của slide: <code>+ name : String</code>, <code># address : String</code>, <code>- id : Integer</code>, <code>+ Display()</code>, <code>- Add()</code>, <code>- Edit()</code>, <code># Delete</code>. Vẽ lại kèm một lớp con để thấy <code>#</code> nghĩa là gì:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/ad0de2aa43d7d3e9ed287cf831ae0f863624a5b8.svg" alt="Tầm nhìn: PremiumMember thấy phần + và # của Member, không thấy phần -" loading="lazy" /><p class="chu-thich">🧩 Tầm nhìn: PremiumMember thấy phần + và # của Member, không thấy phần -</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 10 — tầm nhìn: + public, - private, # protected (lớp Member của slide + một lớp con)
hide circle
skinparam classAttributeIconSize 0
class Member {
  +name : String
  #address : String
  -id : Integer
  +display()
  -add()
  -edit()
  #delete()
}
class PremiumMember {
  -discount : double
  +display()
}
PremiumMember -up-|&gt; Member
note right of PremiumMember
  can use name and address (+, #)
  cannot use id or add() (-)
end note
@enduml</code></pre></details>
<pre><code class="language-java">// Slide 10: + public, - private, # protected, trong Java
class Member {
    public String name = "Lan";          // + name
    protected String address = "Da Nang"; // # address
    private int id = 42;                  // - id

    public String display() { return name + " / " + address + " / id=" + id; } // bên trong lớp: thấy tất cả
}

class PremiumMember extends Member {
    String card() {
        // name (+) và address (#) thấy được ở lớp con
        return name + " @ " + address;
        // lỗi biên dịch: id là private trong Member
    }
}

public class Visibility {
    public static void main(String[] args) {
        PremiumMember p = new PremiumMember();
        System.out.println(p.display());
        System.out.println(p.card());
        System.out.println(p.name);      // public: nơi nào cũng thấy
        System.out.println(p.address);   // biên dịch được CHỈ VÌ lớp này cùng package (luật riêng của Java)
    }
}</code></pre>
<div class="out">Lan / Da Nang / id=42<br>
Lan @ Da Nang<br>
Lan<br>
Da Nang</div>
<p>Dòng bị chú thích trong <code>card()</code> sẽ không biên dịch được: <code>id</code> là private. Dòng cuối của <code>main</code> đọc một trường protected từ một lớp <em>không</em> phải lớp con — Java cho phép chỉ vì hai lớp cùng package.</p>
<div class="pitfall"><code>protected</code> của Java rộng hơn <code>#</code> của UML: nó mở thêm cho mọi lớp cùng package. Java còn mức thứ tư, package-private (không từ khoá), UML vẽ là <code>~</code>. Đề thi hỏi nghĩa theo UML: <code>#</code> = lớp + lớp con.</div>
<p class="meo">🧠 Luật thiết kế mặc định (che giấu thông tin): thuộc tính <code>-</code>, thao tác mà bên ngoài cần <code>+</code>, hàm phụ <code>-</code>. Một class diagram đầy thuộc tính <code>+</code> là dấu hiệu thiết kế kém.</p>`],
      [11, '5. Interaction Diagrams',
        `<p class="y-chinh">🎯 UML has two main kinds of interaction diagrams — the communication diagram and the sequence diagram — both showing how objects interact by sending messages.</p>
<table>
<thead><tr><th></th><th>Communication diagram (slide 12)</th><th>Sequence diagram (lesson 1.C, slide 13)</th></tr></thead>
<tbody>
<tr><td>Emphasis</td><td>which objects are linked to which (structure)</td><td>the order of messages in time</td></tr>
<tr><td>Order shown by</td><td>numbers on the messages (1, 2, 3…)</td><td>top-to-bottom position</td></tr>
<tr><td>Old name</td><td>collaboration diagram (UML 1.x)</td><td>—</td></tr>
<tr><td>Loops / conditions</td><td><code>3*:</code> iteration, <code>4 [cond]:</code> condition</td><td>frames <code>loop</code>, <code>alt</code>, <code>opt</code> (UML 2)</td></tr>
<tr><td>Gomaa/COMET uses it for</td><td>dynamic interaction view, analysis &amp; architecture</td><td>detailed ordering of one scenario</td></tr>
</tbody>
</table>
<p>Both diagrams carry the <em>same information</em>; tools can convert one into the other. Lesson 1.C draws the same scenario both ways so you can compare.</p>
<p>Objects on interaction diagrams are boxes whose names are <strong>not underlined</strong> (Gomaa 2.5).</p>`,
        `<p class="y-chinh">🎯 UML có hai loại sơ đồ tương tác chính — communication diagram (sơ đồ giao tiếp) và sequence diagram (sơ đồ tuần tự) — cả hai cho thấy các đối tượng tương tác bằng cách gửi thông điệp (message).</p>
<table>
<thead><tr><th></th><th>Communication diagram (slide 12)</th><th>Sequence diagram (bài 1.C, slide 13)</th></tr></thead>
<tbody>
<tr><td>Nhấn mạnh</td><td>đối tượng nào nối với đối tượng nào (cấu trúc)</td><td>thứ tự thông điệp theo thời gian</td></tr>
<tr><td>Thứ tự thể hiện bằng</td><td>số trên thông điệp (1, 2, 3…)</td><td>vị trí từ trên xuống dưới</td></tr>
<tr><td>Tên cũ</td><td>collaboration diagram (UML 1.x)</td><td>—</td></tr>
<tr><td>Lặp / điều kiện</td><td><code>3*:</code> lặp, <code>4 [đk]:</code> có điều kiện</td><td>khung <code>loop</code>, <code>alt</code>, <code>opt</code> (UML 2)</td></tr>
<tr><td>Gomaa/COMET dùng cho</td><td>góc nhìn tương tác động, phân tích &amp; kiến trúc</td><td>thứ tự chi tiết của một kịch bản</td></tr>
</tbody>
</table>
<p>Hai sơ đồ chứa <em>cùng một thông tin</em>; công cụ có thể đổi qua lại. Bài 1.C vẽ cùng một kịch bản bằng cả hai để bạn so.</p>
<p>Đối tượng trên sơ đồ tương tác là hộp có tên <strong>không gạch chân</strong> (Gomaa 2.5).</p>`],
      [12, '5.1 Interaction Diagrams',
        `<p class="y-chinh">🎯 A communication diagram (called a collaboration diagram in UML 1.x) shows objects, the links between them, and numbered messages along the links; <code>3*</code> means a message sent several times, <code>4[Condition]</code> a message sent only if the condition is true.</p>
<p>The slide's Figure 2.5: <code>: Actor</code> sends <code>1: Input Message</code> to <code>objectA</code>, which sends <code>2: Internal Message</code> to <code>objectB1 : ClassB</code>, which sends <code>3*: Iteration Message</code> to <code>anObject</code>, which sends <code>4[Condition]: Conditional Message</code> to <code>: ClassC</code>. The same notation on LabFlow:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4eaa74c58582bd9843a585709e4d051891137649.svg" alt="Communication diagram of &quot;Reserve Lab Slot&quot;: links + numbered messages; ▶ ▼ show the direction of each message" loading="lazy" /><p class="chu-thich">🧩 Communication diagram of "Reserve Lab Slot": links + numbered messages; ▶ ▼ show the direction of each message</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 12 — communication diagram: objects + links + numbered messages (arrow shows the direction of each message)
' PlantUML has no dedicated communication diagram: rectangles (objects) and labelled links draw it
actor ": Student" as A
rectangle ": ReservationUI" as UI
rectangle ": ReservationControl" as C
rectangle "aLab : Lab" as L
rectangle ": Reservation" as R
A -right- UI : "1: Reserve Request ▶"
UI -down- C : "2: Reserve(lab, date, slot) ▼"
C -right- L : "3*: Check Slot ▶"
C -down- R : "4 [slot free]: Create ▼"
@enduml</code></pre></details>
<p><strong>Read:</strong> follow the numbers, not the layout. 1 — the student asks the UI; 2 — the UI asks the control object to reserve; 3* — the control checks the lab <em>once per requested slot</em>; 4 — only if the slot is free, it creates a Reservation.</p>
<p><strong>Draw it step by step:</strong> (1) take one use case scenario; (2) put the actor and every object that takes part (UI, control, entities); (3) draw a link between two objects only if one sends a message to the other; (4) write each message as <code>number: Name(arguments)</code> with a small arrow for direction; (5) use <code>*</code> for loops and <code>[condition]</code> for choices; nested numbering (1.1, 1.2) when a message triggers sub-messages (see the Librarian example in lesson 1.C, slide 18).</p>
<div class="pitfall">A link without a message, a message without a number, or two messages with the same number all lose marks. The link line has <strong>no arrowhead</strong> — the direction is the small arrow next to the message label.</div>`,
        `<p class="y-chinh">🎯 Communication diagram (UML 1.x gọi là collaboration diagram — sơ đồ cộng tác) cho thấy các đối tượng, đường nối (link) giữa chúng và thông điệp đánh số dọc theo đường nối; <code>3*</code> là thông điệp gửi nhiều lần, <code>4[Condition]</code> là thông điệp chỉ gửi khi điều kiện đúng.</p>
<p>Hình 2.5 trên slide: <code>: Actor</code> gửi <code>1: Input Message</code> cho <code>objectA</code>, nó gửi <code>2: Internal Message</code> cho <code>objectB1 : ClassB</code>, nó gửi <code>3*: Iteration Message</code> (thông điệp lặp) cho <code>anObject</code>, nó gửi <code>4[Condition]: Conditional Message</code> (thông điệp có điều kiện) cho <code>: ClassC</code>. Cùng ký pháp đó trên LabFlow:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4eaa74c58582bd9843a585709e4d051891137649.svg" alt="Communication diagram của &quot;Reserve Lab Slot&quot;: đường nối + thông điệp đánh số; ▶ ▼ chỉ chiều của từng thông điệp" loading="lazy" /><p class="chu-thich">🧩 Communication diagram của "Reserve Lab Slot": đường nối + thông điệp đánh số; ▶ ▼ chỉ chiều của từng thông điệp</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 12 — communication diagram: đối tượng + đường nối + thông điệp đánh số (mũi tên chỉ chiều thông điệp)
' PlantUML không có loại communication diagram riêng: vẽ bằng hình chữ nhật (đối tượng) + đường nối có nhãn
actor ": Student" as A
rectangle ": ReservationUI" as UI
rectangle ": ReservationControl" as C
rectangle "aLab : Lab" as L
rectangle ": Reservation" as R
A -right- UI : "1: Reserve Request ▶"
UI -down- C : "2: Reserve(lab, date, slot) ▼"
C -right- L : "3*: Check Slot ▶"
C -down- R : "4 [slot free]: Create ▼"
@enduml</code></pre></details>
<p><strong>Đọc:</strong> đi theo số, đừng theo bố cục. 1 — sinh viên yêu cầu giao diện; 2 — giao diện nhờ đối tượng điều khiển đặt ca; 3* — đối tượng điều khiển kiểm tra phòng lab <em>một lần cho mỗi ca được yêu cầu</em>; 4 — chỉ khi ca còn trống, nó tạo một Reservation.</p>
<p><strong>Vẽ từng bước:</strong> (1) lấy một kịch bản của use case; (2) đặt actor và mọi đối tượng tham gia (giao diện, điều khiển, thực thể); (3) chỉ vẽ đường nối giữa hai đối tượng nếu một bên gửi thông điệp cho bên kia; (4) ghi mỗi thông điệp dạng <code>số: Tên(tham số)</code> kèm mũi tên nhỏ chỉ chiều; (5) dùng <code>*</code> cho lặp và <code>[điều kiện]</code> cho lựa chọn; đánh số lồng (1.1, 1.2) khi một thông điệp kéo theo các thông điệp con (xem ví dụ Librarian ở bài 1.C, slide 18).</p>
<div class="pitfall">Đường nối không có thông điệp, thông điệp không đánh số, hay hai thông điệp trùng số đều mất điểm. Đường nối <strong>không có đầu mũi tên</strong> — chiều nằm ở mũi tên nhỏ cạnh nhãn thông điệp.</div>`],
    ]),
    bi(`<h2>📌 Symbols you must recognise after slides 1–12</h2>
<table>
<thead><tr><th>Symbol</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>stick figure outside a box</td><td>actor</td></tr>
<tr><td>ellipse inside a box</td><td>use case; the box is the system boundary</td></tr>
<tr><td>dashed arrow «include» / «extend»</td><td>always included / optionally extends (arrow points to the base use case)</td></tr>
<tr><td>box name / attributes / operations</td><td>class; <code>name : Class</code> underlined = object</td></tr>
<tr><td>solid line + hollow triangle</td><td>generalization (triangle at the parent)</td></tr>
<tr><td>dashed line + hollow triangle</td><td>realization of an interface</td></tr>
<tr><td>hollow / filled diamond</td><td>aggregation / composition (diamond at the whole)</td></tr>
<tr><td>dashed open arrow</td><td>dependency</td></tr>
<tr><td>1, 0..1, *, 1..*, m..n</td><td>multiplicity</td></tr>
<tr><td>+ - # (~)</td><td>public, private, protected (package)</td></tr>
<tr><td>numbered messages on links</td><td>communication diagram</td></tr>
</tbody>
</table>
<p>Continue with lesson 1.C: sequence, state machine, package, concurrent communication, deployment, stereotypes, tagged values, constraints.</p>`,
    `<h2>📌 Ký hiệu phải nhận ra sau slide 1–12</h2>
<table>
<thead><tr><th>Ký hiệu</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td>người que ngoài khung</td><td>actor</td></tr>
<tr><td>elip trong khung</td><td>use case; khung là ranh giới hệ thống</td></tr>
<tr><td>mũi tên đứt «include» / «extend»</td><td>luôn gộp vào / mở rộng khi cần (mũi tên extend chỉ về use case gốc)</td></tr>
<tr><td>hộp tên / thuộc tính / thao tác</td><td>lớp; <code>tên : Lớp</code> gạch chân = đối tượng</td></tr>
<tr><td>nét liền + tam giác rỗng</td><td>tổng quát hoá (tam giác ở lớp cha)</td></tr>
<tr><td>nét đứt + tam giác rỗng</td><td>hiện thực hoá interface</td></tr>
<tr><td>kim cương rỗng / đặc</td><td>kết tập / hợp thành (kim cương ở phía toàn thể)</td></tr>
<tr><td>mũi tên hở nét đứt</td><td>phụ thuộc</td></tr>
<tr><td>1, 0..1, *, 1..*, m..n</td><td>bội số</td></tr>
<tr><td>+ - # (~)</td><td>public, private, protected (package)</td></tr>
<tr><td>thông điệp đánh số trên đường nối</td><td>communication diagram</td></tr>
</tbody>
</table>
<p>Học tiếp bài 1.C: sequence, state machine, package, concurrent communication, deployment, stereotype, tagged value, ràng buộc.</p>`),
    books([
      ['gomaa', 'Chapter 2, sections 2.1–2.5 (Figures 2.1–2.5)', 'Chương 2, mục 2.1–2.5 (Hình 2.1–2.5)'],
      ['fowler', 'Chapter 3 "Class Diagrams: The Essentials", Chapter 5 "Class Diagrams: Advanced Concepts", Chapter 9 "Use Cases"', 'Chương 3 "Class Diagrams: The Essentials", Chương 5 "Class Diagrams: Advanced Concepts", Chương 9 "Use Cases"'],
      ['plantuml', '"Use Case Diagram", "Class Diagram", "Object Diagram", "Activity Diagram (new syntax)", "Component Diagram"', 'các mục "Use Case Diagram", "Class Diagram", "Object Diagram", "Activity Diagram (new syntax)", "Component Diagram"'],
      ['fuSlides', 'deck "Chapter 2: Overview of the UML Notation", slides 1–12', 'bộ "Chapter 2: Overview of the UML Notation", slide 1–12'],
    ]),
  ].join('\n'),
};

/* ───────── 1.C — 📑 Slide by slide · UML notation (2): sequence, state, package, deployment (school Ch.2, slides 13–23) ───────── */
const L_swd3_2 = {
  title: '1.C — 📑 Slide by slide · UML notation (2): sequence, state, package, deployment (school Ch.2, slides 13–23)|||1.C — 📑 Học theo từng slide · Ký pháp UML (2): sequence, trạng thái, package, triển khai, stereotype (Chapter 2 của trường, slide 13–23)',
  slug: 'swd392-slide-swd3-2',
  type: 'VIDEO',
  description: 'Giảng slide 13–23 Chapter 2 của trường (Gomaa Ch.2): sequence diagram (lifeline, activation, loop/alt), statechart (trạng thái hợp, entry/exit, Event [condition] / Action), package diagram và kiến trúc phân tầng, đối tượng chủ động/bị động, thông điệp đồng bộ/bất đồng bộ, deployment diagram, stereotype «entity» «control» «boundary», tagged value, ràng buộc và OCL, quy ước đặt tên — mỗi loại có sơ đồ PlantUML dựng thật, cách đọc, cách vẽ từng bước, lỗi hay mắc.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.C · school deck "Chapter 2: Overview of the UML Notation", slides 13–23</span>
<h2>The UML notation (part 2) — the deck, slide by slide</h2>
<p class="lead">Second half of the UML tour: the behaviour diagrams you will draw most in Assignment 02 and the PE (sequence, state machine), the architecture diagrams of Assignment 03 (package, concurrent communication, deployment), and the three ways UML lets you add your own meaning (stereotypes, tagged values, constraints). Same structure as lesson 1.B: slide figure explained → real PlantUML diagram → how to read → how to draw → mistakes.</p>`,
    `<span class="eyebrow">Chương 1 · Bài 1.C · bộ slide "Chapter 2: Overview of the UML Notation" của trường, slide 13–23</span>
<h2>Ký pháp UML (phần 2) — học bộ slide từng trang</h2>
<p class="lead">Nửa sau chuyến tham quan UML: các sơ đồ hành vi bạn sẽ vẽ nhiều nhất ở Assignment 02 và bài PE (sequence, state machine), các sơ đồ kiến trúc của Assignment 03 (package, concurrent communication, deployment), và ba cách UML cho bạn thêm nghĩa riêng (stereotype, tagged value, ràng buộc — constraint). Cấu trúc như bài 1.B: giải thích hình trên slide → sơ đồ PlantUML thật → cách đọc → cách vẽ → lỗi hay mắc.</p>`),
    walkHead('swd3', 13, 23),
    walk('swd3', [
      [13, '5.2 Sequence Diagrams',
        `<p class="y-chinh">🎯 A sequence diagram shows the same interaction as a communication diagram but arranged in time: objects across the top, time running downwards, messages as horizontal arrows.</p>
<p>The slide's Figure 2.6: <code>: Actor</code>, <code>objectA</code>, <code>objectB1 : ClassB</code>, <code>anObject</code>, <code>: ClassC</code> across the top; messages 1: Input Message, 2: Internal Message, 3: Another Message, 4: Request Message going down. The LabFlow scenario of slide 12, now as a sequence diagram:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e43b34e79b71b12176cce647ebe01785c7cdf39a.svg" alt="Sequence diagram of &quot;Reserve Lab Slot&quot; — the same messages 1, 2, 3*, 4 as the communication diagram, plus the replies and UML 2 frames" loading="lazy" /><p class="chu-thich">🧩 Sequence diagram of "Reserve Lab Slot" — the same messages 1, 2, 3*, 4 as the communication diagram, plus the replies and UML 2 frames</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 13 — sequence diagram: the SAME scenario as the communication diagram, ordered in time
hide footbox
actor ": Student" as A
participant ": ReservationUI" as UI
participant ": ReservationControl" as C
participant "aLab : Lab" as L
participant ": Reservation" as R
A -&gt; UI : 1: Reserve Request
activate UI
UI -&gt; C : 2: Reserve(lab, date, slot)
activate C
loop for each requested slot
  C -&gt; L : 3*: Check Slot
  L --&gt; C : free / taken
end
alt slot free
  C -&gt; R ** : 4 [slot free]: Create
  C --&gt; UI : reservation (Pending)
else slot taken
  C --&gt; UI : Slot Unavailable
end
deactivate C
UI --&gt; A : Show Result
deactivate UI
@enduml</code></pre></details>
<p><strong>Read:</strong> the dashed vertical line under each box is its <em>lifeline</em>; the thin rectangle on it is the <em>activation bar</em> (the object is busy). Solid arrow with a filled head = a call; dashed arrow = a reply. The <code>loop</code> frame repeats message 3 for each slot; the <code>alt</code> frame is an if/else with guards <code>[slot free]</code> / <code>[slot taken]</code>. <code>: Reservation</code> starts lower than the others because it is <em>created</em> by message 4.</p>
<p><strong>Draw it step by step:</strong> (1) actor at the far left, then boundary (UI), control, entities from left to right; (2) write the messages of the use case's main flow top-down; (3) add replies only where a value comes back; (4) wrap repeated messages in <code>loop</code>, alternatives in <code>alt</code>, optional ones in <code>opt</code>; (5) check that every message name is an operation of the receiving class (this links it to your class diagram).</p>
<div class="pitfall">(a) The actor talks only to a boundary/UI object — never straight to an entity or the database. (b) A message arrow ends at the <strong>receiver's</strong> lifeline, and the receiver must have that operation. (c) Gomaa: "the spacing between messages is not relevant" — only the order is.</div>`,
        `<p class="y-chinh">🎯 Sequence diagram (sơ đồ tuần tự) cho thấy cùng một tương tác như communication diagram nhưng xếp theo thời gian: đối tượng xếp ngang phía trên, thời gian chạy xuống dưới, thông điệp là mũi tên nằm ngang.</p>
<p>Hình 2.6 trên slide: <code>: Actor</code>, <code>objectA</code>, <code>objectB1 : ClassB</code>, <code>anObject</code>, <code>: ClassC</code> ở hàng trên; các thông điệp 1: Input Message, 2: Internal Message, 3: Another Message, 4: Request Message đi dần xuống. Kịch bản LabFlow của slide 12, giờ vẽ thành sequence diagram:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e43b34e79b71b12176cce647ebe01785c7cdf39a.svg" alt="Sequence diagram của &quot;Reserve Lab Slot&quot; — cùng các thông điệp 1, 2, 3*, 4 như communication diagram, thêm các thông điệp trả về và khung UML 2" loading="lazy" /><p class="chu-thich">🧩 Sequence diagram của "Reserve Lab Slot" — cùng các thông điệp 1, 2, 3*, 4 như communication diagram, thêm các thông điệp trả về và khung UML 2</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 13 — sequence diagram: CÙNG kịch bản với communication diagram, xếp theo thời gian
hide footbox
actor ": Student" as A
participant ": ReservationUI" as UI
participant ": ReservationControl" as C
participant "aLab : Lab" as L
participant ": Reservation" as R
A -&gt; UI : 1: Reserve Request
activate UI
UI -&gt; C : 2: Reserve(lab, date, slot)
activate C
loop for each requested slot
  C -&gt; L : 3*: Check Slot
  L --&gt; C : free / taken
end
alt slot free
  C -&gt; R ** : 4 [slot free]: Create
  C --&gt; UI : reservation (Pending)
else slot taken
  C --&gt; UI : Slot Unavailable
end
deactivate C
UI --&gt; A : Show Result
deactivate UI
@enduml</code></pre></details>
<p><strong>Đọc:</strong> đường đứt thẳng đứng dưới mỗi hộp là <em>đường đời (lifeline)</em>; hình chữ nhật mảnh trên nó là <em>thanh kích hoạt (activation bar)</em> (đối tượng đang bận xử lý). Mũi tên liền đầu đặc = một lời gọi; mũi tên nét đứt = trả về (reply). Khung <code>loop</code> lặp thông điệp 3 cho mỗi ca; khung <code>alt</code> là if/else với điều kiện <code>[slot free]</code> / <code>[slot taken]</code>. <code>: Reservation</code> bắt đầu thấp hơn các hộp khác vì nó được <em>tạo ra</em> bởi thông điệp 4.</p>
<p><strong>Vẽ từng bước:</strong> (1) actor ở ngoài cùng bên trái, rồi đối tượng biên (UI), điều khiển, thực thể từ trái sang phải; (2) viết thông điệp của luồng chính của use case từ trên xuống; (3) chỉ thêm mũi tên trả về khi có giá trị quay lại; (4) bọc thông điệp lặp trong <code>loop</code>, lựa chọn trong <code>alt</code>, tuỳ chọn trong <code>opt</code>; (5) kiểm tra mỗi tên thông điệp là một thao tác của lớp nhận (đây là mối nối với class diagram của bạn).</p>
<div class="pitfall">(a) Actor chỉ nói chuyện với đối tượng biên/UI — không bao giờ gọi thẳng thực thể hay database. (b) Mũi tên thông điệp kết thúc ở lifeline của <strong>bên nhận</strong>, và bên nhận phải có thao tác đó. (c) Gomaa: "khoảng cách giữa các thông điệp không có nghĩa" — chỉ thứ tự có nghĩa.</div>`],
      [14, '6. State Machine Diagrams',
        `<p class="y-chinh">🎯 A state transition diagram is called a state machine diagram in UML; Gomaa uses the shorter word statechart. States are rounded boxes, transitions are arrows labelled <code>Event [condition] / Action</code>, the initial state is a black dot, the final state a bull's-eye, and a composite state contains substates.</p>
<p>The slide's Figure 2.7: an <em>Event</em> enters <em>composite state A</em>; inside, Substate A1 has <code>entry / Action</code> and <code>exit / Action</code>; <code>Event [condition] / Action</code> moves A1 → A2; <code>Event / Action</code> leaves A2 to the Final State. The life of a LabFlow reservation, using every one of those symbols:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/a4818d3129cccb00a3871ef7f5741fea0acffb00.svg" alt="Statechart of a Reservation: initial and final states, composite state Active with substates, entry/exit actions, Event [condition] / Action" loading="lazy" /><p class="chu-thich">🧩 Statechart of a Reservation: initial and final states, composite state Active with substates, entry/exit actions, Event [condition] / Action</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 14 — state machine: initial state, composite state, substates, entry/exit, Event [condition] / Action, final state
hide empty description
[*] --&gt; Pending
Pending : entry / Notify Lab Manager
Pending --&gt; Rejected : Reject / Notify Student
Pending --&gt; Cancelled : Cancel
state Active {
  [*] --&gt; Approved
  Approved : entry / Send Confirmation
  Approved --&gt; InUse : Check In [within 15 minutes of start]
  InUse : entry / Unlock Lab Door
  InUse : exit / Lock Lab Door
}
Pending --&gt; Active : Approve [slot still free] / Reserve Slot
Active --&gt; Cancelled : Cancel / Release Slot
InUse --&gt; Completed : Check Out / Record Usage
Completed --&gt; [*]
Rejected --&gt; [*]
Cancelled --&gt; [*]
@enduml</code></pre></details>
<p><strong>Read a transition label</strong> — <code>Approve [slot still free] / Reserve Slot</code>: when the event <em>Approve</em> happens, <em>if</em> the condition <em>slot still free</em> is true, the object performs the action <em>Reserve Slot</em> and moves to the new state. If the condition is false, nothing happens. <code>entry / Unlock Lab Door</code> runs every time the state InUse is entered; <code>exit / Lock Lab Door</code> every time it is left. The transition <em>Cancel / Release Slot</em> leaves the composite state Active from <strong>any</strong> of its substates — that is the power of composite states.</p>
<p><strong>Draw it step by step:</strong> (1) pick one object whose behaviour depends on its history; (2) list its states as adjectives/situations (Pending, Approved) — not verbs; (3) initial dot → first state; (4) for each state ask "which events can happen here?" and draw a transition for each; (5) add conditions and actions; (6) group states sharing the same outgoing transition into a composite state.</p>
<div class="pitfall">(a) Event and action swapped (<code>Send Email / Approve</code>). (b) A state with no way out except the final state, or a state no transition reaches. (c) The initial pseudostate is not a state — it has no name and nothing points into it. ➕ Gomaa also shows <em>orthogonal regions</em> (Figure 2.8): a composite state split by a dashed line into parts that are active at the same time.</div>`,
        `<p class="y-chinh">🎯 Sơ đồ chuyển trạng thái (state transition diagram) trong UML gọi là state machine diagram (sơ đồ máy trạng thái); Gomaa dùng từ ngắn hơn là statechart. Trạng thái là hộp bo góc, chuyển tiếp (transition) là mũi tên ghi <code>Sự kiện [điều kiện] / Hành động</code>, trạng thái đầu là chấm đen, trạng thái cuối là mắt bò, và trạng thái hợp (composite state) chứa các trạng thái con (substate).</p>
<p>Hình 2.7 trên slide: một <em>Event</em> đưa vào <em>composite state A</em>; bên trong, Substate A1 có <code>entry / Action</code> (hành động khi vào) và <code>exit / Action</code> (hành động khi ra); <code>Event [condition] / Action</code> chuyển A1 → A2; <code>Event / Action</code> đưa A2 tới Final State. Vòng đời một lượt đặt LabFlow, dùng đủ các ký hiệu đó:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/a4818d3129cccb00a3871ef7f5741fea0acffb00.svg" alt="Statechart của Reservation: trạng thái đầu và cuối, trạng thái hợp Active có trạng thái con, hành động entry/exit, Event [condition] / Action" loading="lazy" /><p class="chu-thich">🧩 Statechart của Reservation: trạng thái đầu và cuối, trạng thái hợp Active có trạng thái con, hành động entry/exit, Event [condition] / Action</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 14 — máy trạng thái: trạng thái đầu, trạng thái hợp, trạng thái con, entry/exit, Sự kiện [điều kiện] / Hành động, trạng thái cuối
hide empty description
[*] --&gt; Pending
Pending : entry / Notify Lab Manager
Pending --&gt; Rejected : Reject / Notify Student
Pending --&gt; Cancelled : Cancel
state Active {
  [*] --&gt; Approved
  Approved : entry / Send Confirmation
  Approved --&gt; InUse : Check In [within 15 minutes of start]
  InUse : entry / Unlock Lab Door
  InUse : exit / Lock Lab Door
}
Pending --&gt; Active : Approve [slot still free] / Reserve Slot
Active --&gt; Cancelled : Cancel / Release Slot
InUse --&gt; Completed : Check Out / Record Usage
Completed --&gt; [*]
Rejected --&gt; [*]
Cancelled --&gt; [*]
@enduml</code></pre></details>
<p><strong>Đọc nhãn chuyển tiếp</strong> — <code>Approve [slot still free] / Reserve Slot</code>: khi sự kiện <em>Approve</em> xảy ra, <em>nếu</em> điều kiện <em>ca vẫn còn trống</em> đúng, đối tượng làm hành động <em>Reserve Slot</em> và sang trạng thái mới. Điều kiện sai thì không có gì xảy ra. <code>entry / Unlock Lab Door</code> chạy mỗi lần vào trạng thái InUse; <code>exit / Lock Lab Door</code> mỗi lần rời nó. Chuyển tiếp <em>Cancel / Release Slot</em> rời trạng thái hợp Active từ <strong>bất kỳ</strong> trạng thái con nào — đó là sức mạnh của trạng thái hợp.</p>
<p><strong>Vẽ từng bước:</strong> (1) chọn một đối tượng mà hành vi phụ thuộc lịch sử của nó; (2) liệt kê trạng thái dạng tính từ/tình trạng (Pending, Approved) — không dùng động từ; (3) chấm đầu → trạng thái đầu tiên; (4) với mỗi trạng thái hỏi "ở đây có thể xảy ra sự kiện gì?" và vẽ một chuyển tiếp cho mỗi cái; (5) thêm điều kiện và hành động; (6) gom các trạng thái có chung chuyển tiếp đi ra thành một trạng thái hợp.</p>
<div class="pitfall">(a) Đảo sự kiện và hành động (<code>Send Email / Approve</code>). (b) Trạng thái không có lối ra ngoài trạng thái cuối, hoặc trạng thái không chuyển tiếp nào đi tới. (c) Trạng thái đầu (initial pseudostate) không phải trạng thái — không có tên và không mũi tên nào chỉ vào nó. ➕ Gomaa còn có <em>vùng trực giao (orthogonal region)</em> (Hình 2.8): trạng thái hợp chia bằng nét đứt thành các phần cùng hoạt động một lúc.</div>`],
      [15, '7. Packages',
        `<p class="y-chinh">🎯 A package groups model elements (e.g. a system or subsystem); it is drawn as a folder — a rectangle with a small tab; packages can be nested, can be related by dependency or generalization, and can contain classes, objects or use cases.</p>
<p>The slide's Figure 2.9: a package stereotyped <code>«system»</code> SystemPackage containing two packages <code>«subsystem»</code> Subsystem PackageA and PackageB. The same on LabFlow, with a dependency between the subsystems:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/af3e3a513b784bb13d9db4cdec2d546581f0d976.svg" alt="Package diagram: the «system» LabFlow contains «subsystem» Booking and Notification; Booking depends on Notification" loading="lazy" /><p class="chu-thich">🧩 Package diagram: the «system» LabFlow contains «subsystem» Booking and Notification; Booking depends on Notification</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
skinparam packageStyle folder
' Slide 15 — packages: «system» package containing «subsystem» packages, dependency between packages
hide circle
hide members
package "LabFlow" &lt;&lt;system&gt;&gt; {
  package "Booking" &lt;&lt;subsystem&gt;&gt; {
    class Reservation
    class Lab
  }
  package "Notification" &lt;&lt;subsystem&gt;&gt; {
    class EmailSender
  }
}
"Booking" ..&gt; "Notification" : &lt;&lt;use&gt;&gt;
@enduml</code></pre></details>
<p><strong>Read:</strong> the dashed arrow <code>«use»</code> means "something in Booking uses something in Notification"; if Notification changes, Booking may have to change. The reverse is not true.</p>
<p class="meo">🧠 In Java a UML package maps to a Java <code>package</code> (a folder of classes). A package diagram of your project is therefore the folder structure of <code>src/main/java</code>, plus the arrows saying who imports whom.</p>
<div class="pitfall">Avoid dependency cycles (A → B and B → A): the exam and reviewers treat a cycle between packages as a design flaw, because neither package can be changed or reused alone.</div>`,
        `<p class="y-chinh">🎯 Package (gói) gom các phần tử mô hình (vd một hệ thống hoặc subsystem); vẽ như cái thư mục — hình chữ nhật có một thẻ nhỏ ở góc; package lồng nhau được, nối nhau bằng phụ thuộc hoặc tổng quát hoá, và chứa được lớp, đối tượng hoặc use case.</p>
<p>Hình 2.9 trên slide: một package mang stereotype <code>«system»</code> SystemPackage chứa hai package <code>«subsystem»</code> Subsystem PackageA và PackageB. Cùng ý đó trên LabFlow, thêm một phụ thuộc giữa hai subsystem:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/af3e3a513b784bb13d9db4cdec2d546581f0d976.svg" alt="Package diagram: «system» LabFlow chứa «subsystem» Booking và Notification; Booking phụ thuộc Notification" loading="lazy" /><p class="chu-thich">🧩 Package diagram: «system» LabFlow chứa «subsystem» Booking và Notification; Booking phụ thuộc Notification</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
skinparam packageStyle folder
' Slide 15 — package «system» chứa các package «subsystem», phụ thuộc giữa package
hide circle
hide members
package "LabFlow" &lt;&lt;system&gt;&gt; {
  package "Booking" &lt;&lt;subsystem&gt;&gt; {
    class Reservation
    class Lab
  }
  package "Notification" &lt;&lt;subsystem&gt;&gt; {
    class EmailSender
  }
}
"Booking" ..&gt; "Notification" : &lt;&lt;use&gt;&gt;
@enduml</code></pre></details>
<p><strong>Đọc:</strong> mũi tên đứt <code>«use»</code> nghĩa là "có thứ trong Booking dùng thứ trong Notification"; Notification đổi thì Booking có thể phải đổi theo. Chiều ngược lại thì không.</p>
<p class="meo">🧠 Trong Java, package UML ứng với <code>package</code> của Java (một thư mục chứa lớp). Vì vậy package diagram của dự án chính là cấu trúc thư mục <code>src/main/java</code>, cộng các mũi tên nói ai import ai.</p>
<div class="pitfall">Tránh vòng phụ thuộc (A → B và B → A): đề thi và người chấm coi vòng giữa các package là lỗi thiết kế, vì không package nào sửa hay dùng lại riêng được.</div>`],
      [16, '7. Packages',
        `<p class="y-chinh">🎯 A real layered application drawn with nested packages: Users and External Systems outside; Presentation Layer (User Interface, Presentation Logic), Services Layer, Business Layer (Application Facade, Business Workflow, Business Components, Business Entities), Data Layer (Data Access, Service Agents), a Cross Cutting column (Security, Operational Management, Communication), and at the bottom Data Sources and External Services.</p>
<p>This is the classic Microsoft "layered application" reference picture. Dependencies (dashed arrows) always point <em>downwards</em>: a layer uses the one below, never the one above; cross-cutting concerns are used by every layer. The same idea for a Spring Boot project like LabFlow:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/dabf217b21fb857f45b8dc1d0a78c5a676320caf.svg" alt="LabFlow backend as layered packages: controller → service → repository → PostgreSQL; security is cross-cutting" loading="lazy" /><p class="chu-thich">🧩 LabFlow backend as layered packages: controller → service → repository → PostgreSQL; security is cross-cutting</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
skinparam packageStyle folder
' Slide 16 — a layered application drawn as nested packages (LabFlow backend, Spring Boot) — illustrative
package "LabFlow backend" &lt;&lt;layered application&gt;&gt; {
  package "Presentation Layer" as P {
    package controller
    package dto
  }
  package "Business Layer" as B {
    package service
    package domain
  }
  package "Data Layer" as D {
    package repository
  }
  package "Cross-cutting" as X {
    package security
  }
}
database PostgreSQL
controller ..&gt; service
controller ..&gt; dto
service ..&gt; domain
service ..&gt; repository
repository ..&gt; PostgreSQL
security .left.&gt; controller : filters requests
@enduml</code></pre></details>
<p><strong>Read:</strong> <code>controller</code> (Presentation) calls <code>service</code> (Business), which uses <code>domain</code> classes and <code>repository</code> (Data), which talks to the database. <code>security</code> filters requests before any controller runs.</p>
<div class="callout">🧭 <strong>Apply to LabFlow (illustration).</strong> This is also the "package diagram" section of an SDS report (Report 4). Draw it from your real folders; if a <code>repository</code> class imports a <code>controller</code> class, the diagram shows an upward arrow — a bug in the architecture to fix.</div>
<div class="pitfall">Layers are <strong>not</strong> tiers: layers are logical groups of code (can all run in one JAR); tiers are physical machines (browser, server, DB) — the latter belong on a deployment diagram (slide 19).</div>`,
        `<p class="y-chinh">🎯 Một ứng dụng phân tầng (layered) thật vẽ bằng package lồng nhau: Users và External Systems ở ngoài; Presentation Layer (User Interface, Presentation Logic), Services Layer, Business Layer (Application Facade, Business Workflow, Business Components, Business Entities), Data Layer (Data Access, Service Agents), cột Cross Cutting — xuyên suốt (Security, Operational Management, Communication), và dưới đáy Data Sources, External Services.</p>
<p>Đây là hình tham chiếu "layered application" kinh điển của Microsoft. Phụ thuộc (mũi tên đứt) luôn chỉ <em>xuống dưới</em>: một tầng dùng tầng dưới, không bao giờ dùng tầng trên; các mối quan tâm xuyên suốt (cross-cutting concern) được mọi tầng dùng. Cùng ý đó cho một dự án Spring Boot như LabFlow:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/dabf217b21fb857f45b8dc1d0a78c5a676320caf.svg" alt="Backend LabFlow vẽ thành package phân tầng: controller → service → repository → PostgreSQL; security là xuyên suốt" loading="lazy" /><p class="chu-thich">🧩 Backend LabFlow vẽ thành package phân tầng: controller → service → repository → PostgreSQL; security là xuyên suốt</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
skinparam packageStyle folder
' Slide 16 — ứng dụng phân tầng vẽ bằng package lồng nhau (backend LabFlow, Spring Boot) — minh hoạ
package "LabFlow backend" &lt;&lt;layered application&gt;&gt; {
  package "Presentation Layer" as P {
    package controller
    package dto
  }
  package "Business Layer" as B {
    package service
    package domain
  }
  package "Data Layer" as D {
    package repository
  }
  package "Cross-cutting" as X {
    package security
  }
}
database PostgreSQL
controller ..&gt; service
controller ..&gt; dto
service ..&gt; domain
service ..&gt; repository
repository ..&gt; PostgreSQL
security .left.&gt; controller : filters requests
@enduml</code></pre></details>
<p><strong>Đọc:</strong> <code>controller</code> (tầng trình bày) gọi <code>service</code> (tầng nghiệp vụ), service dùng các lớp <code>domain</code> và <code>repository</code> (tầng dữ liệu), repository nói chuyện với CSDL. <code>security</code> lọc request trước khi controller nào chạy.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow (minh hoạ).</strong> Đây cũng là phần "package diagram" của báo cáo SDS (Report 4). Vẽ từ chính thư mục thật; nếu một lớp <code>repository</code> import một lớp <code>controller</code>, sơ đồ sẽ hiện mũi tên đi lên — một lỗi kiến trúc cần sửa.</div>
<div class="pitfall">Tầng (layer) <strong>không</strong> phải là tầng máy (tier): layer là nhóm code logic (có thể chạy chung trong một file JAR); tier là máy vật lý (trình duyệt, máy chủ, CSDL) — tier thuộc về deployment diagram (slide 19).</div>`],
      [17, '8. Concurrent Communication Diagrams',
        `<p class="y-chinh">🎯 An active object represents a concurrent object, process, thread or task: it has its own thread of control and runs concurrently with other objects; a passive object has no thread of control; active objects are shown on concurrent communication diagrams (the concurrency view).</p>
<p>The slide's Figure 2.10: four boxes — active object, active multiobject (stacked boxes), passive object, passive multiobject — each stereotyped <code>«active object»</code> or <code>«passive object»</code>. In UML 2 an active object is also drawn with double vertical lines on its left and right sides; <em>multiobject</em> is UML 1.x notation for "several objects of the same class".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/509bb4722074afb979c0052c56aa21585f8af37a.svg" alt="Two active objects share one passive queue: the handler puts requests in, the sender takes them out" loading="lazy" /><p class="chu-thich">🧩 Two active objects share one passive queue: the handler puts requests in, the sender takes them out</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 17 — active objects (own thread of control) vs passive objects (run only when called)
' PlantUML cannot draw the UML 2 double side-bars, so the stereotype «active object» is used (Gomaa Figure 2.10 does the same)
rectangle ": ReservationHandler" as H &lt;&lt;active object&gt;&gt;
rectangle ": NotificationSender" as N &lt;&lt;active object&gt;&gt;
rectangle ": ReservationQueue" as Q &lt;&lt;passive object&gt;&gt;
rectangle ": Reservation" as R &lt;&lt;passive object&gt;&gt;
H -down-&gt; Q : put()
N -down-&gt; Q : get()
H -down-&gt; R : update()
@enduml</code></pre></details>
<p><strong>Read:</strong> ReservationHandler and NotificationSender each run in their own thread. ReservationQueue is passive: it only does something when one of them calls <code>put()</code> or <code>get()</code>. Because two threads touch the queue, its operations must be synchronised — exactly the kind of decision the concurrency view makes visible.</p>
<p class="meo">🧠 In Java: an active object ≈ an object that owns a <code>Thread</code> / an <code>@Async</code> worker / a message listener; a passive object ≈ an ordinary object whose methods run in the caller's thread.</p>`,
        `<p class="y-chinh">🎯 Đối tượng chủ động (active object) biểu diễn một đối tượng, tiến trình, luồng hay tác vụ đồng thời: nó có luồng điều khiển riêng và chạy song song với đối tượng khác; đối tượng bị động (passive object) không có luồng điều khiển; đối tượng chủ động được vẽ trên concurrent communication diagram (góc nhìn đồng thời).</p>
<p>Hình 2.10 trên slide: bốn hộp — active object, active multiobject (các hộp xếp chồng), passive object, passive multiobject — mỗi cái mang stereotype <code>«active object»</code> hoặc <code>«passive object»</code>. Trong UML 2, đối tượng chủ động còn được vẽ với hai vạch đứng kép ở cạnh trái và phải; <em>multiobject</em> là ký pháp UML 1.x cho "nhiều đối tượng cùng lớp".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/509bb4722074afb979c0052c56aa21585f8af37a.svg" alt="Hai đối tượng chủ động dùng chung một hàng đợi bị động: handler bỏ yêu cầu vào, sender lấy ra" loading="lazy" /><p class="chu-thich">🧩 Hai đối tượng chủ động dùng chung một hàng đợi bị động: handler bỏ yêu cầu vào, sender lấy ra</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 17 — đối tượng chủ động (có luồng điều khiển riêng) và bị động (chỉ chạy khi được gọi)
' PlantUML không vẽ được hai vạch đứng hai bên của UML 2 nên dùng stereotype «active object» (Hình 2.10 của Gomaa cũng làm vậy)
rectangle ": ReservationHandler" as H &lt;&lt;active object&gt;&gt;
rectangle ": NotificationSender" as N &lt;&lt;active object&gt;&gt;
rectangle ": ReservationQueue" as Q &lt;&lt;passive object&gt;&gt;
rectangle ": Reservation" as R &lt;&lt;passive object&gt;&gt;
H -down-&gt; Q : put()
N -down-&gt; Q : get()
H -down-&gt; R : update()
@enduml</code></pre></details>
<p><strong>Đọc:</strong> ReservationHandler và NotificationSender mỗi cái chạy trong luồng riêng. ReservationQueue bị động: nó chỉ làm gì đó khi một trong hai gọi <code>put()</code> hoặc <code>get()</code>. Vì hai luồng cùng đụng vào hàng đợi, các thao tác của nó phải được đồng bộ hoá — đúng loại quyết định mà góc nhìn đồng thời làm lộ ra.</p>
<p class="meo">🧠 Trong Java: đối tượng chủ động ≈ đối tượng sở hữu một <code>Thread</code> / một worker <code>@Async</code> / một bộ nghe thông điệp (message listener); đối tượng bị động ≈ đối tượng thường, phương thức chạy trong luồng của người gọi.</p>`],
      [18, '8. Concurrent Communication Diagrams',
        `<p class="y-chinh">🎯 Messages between tasks on a concurrent communication diagram are either asynchronous (loosely coupled — the sender does not wait) or synchronous (tightly coupled — the sender waits, possibly for a reply).</p>
<p>The slide's example is a library: <code>Librarian</code> → <code>: UI</code> (1: EnquireBorrower) → <code>: Transaction</code> (1.1: CalAmtCanBorrow(id), 1.1.3: GetCheckedOutMedia(id), 1.1.4: IsMediaOverdue(id)) → <code>: Fine</code> (1.1.1: create, 1.1.2: CalFines(id)); 1.1.5: amount returns to the UI, then 1.2: DisplayInvalidMsg(). The list on the right is the same messages in order — note the <strong>nested numbering</strong>: 1.1.x are the steps caused by 1.1.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e7d41d5cc878254b868d5f80f4d3437809cce352.svg" alt="Concurrent communication diagram: an asynchronous e-mail request and a synchronous payment call with reply" loading="lazy" /><p class="chu-thich">🧩 Concurrent communication diagram: an asynchronous e-mail request and a synchronous payment call with reply</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 18 — concurrent communication diagram: active objects + asynchronous / synchronous messages
actor ": Student" as A
rectangle ": ReservationHandler" as H &lt;&lt;active object&gt;&gt;
rectangle ": NotificationSender" as N &lt;&lt;active object&gt;&gt;
rectangle ": PaymentGateway" as P &lt;&lt;active object&gt;&gt;
rectangle ": EmailServer" as E &lt;&lt;external system&gt;&gt;
A -right- H : "1: reserveRequest ▶"
H -right- N : "2: «asynchronous» sendEmail(msg) ▶"
H -down- P : "3: «synchronous» chargeDeposit(amount) ▼\\n4: «reply» receipt ▲"
N -down- E : "2.1: «asynchronous» send(mail) ▼"
@enduml</code></pre></details>
<p>UML distinguishes the two kinds by the <strong>arrowhead</strong> (Gomaa Figure 2.11). A sequence diagram shows the heads most clearly:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/c54cf0d7506e9b6058979a3c9159f1131ccda369.svg" alt="Arrowheads: open stick = asynchronous; filled = synchronous; dashed = reply" loading="lazy" /><p class="chu-thich">🧩 Arrowheads: open stick = asynchronous; filled = synchronous; dashed = reply</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 18 — the arrowheads: synchronous (filled), asynchronous (open stick), reply (dashed)
participant ": ReservationHandler" as H
participant ": NotificationSender" as N
participant ": PaymentGateway" as P
H -&gt;&gt; N : sendEmail(msg) «asynchronous»
note right of H : H does NOT wait
H -&gt; P : chargeDeposit(amount) «synchronous»
activate P
note right of H : H waits here
P --&gt; H : receipt «reply»
deactivate P
@enduml</code></pre></details>
<table>
<thead><tr><th>Kind</th><th>Arrow (UML 1.4 and 2)</th><th>Sender</th><th>LabFlow example</th></tr></thead>
<tbody>
<tr><td>Asynchronous (loosely coupled)</td><td>solid line, open stick arrowhead</td><td>continues immediately; the message may wait in a queue</td><td>send confirmation e-mail</td></tr>
<tr><td>Synchronous without reply</td><td>solid line, filled arrowhead</td><td>waits until the receiver accepts it</td><td>hand a job to a worker</td></tr>
<tr><td>Synchronous with reply</td><td>filled arrowhead + dashed reply arrow</td><td>waits for the answer</td><td>charge a deposit, get a receipt</td></tr>
<tr><td>Simple message (analysis)</td><td>stick arrow, no decision yet</td><td>—</td><td>used in analysis models before choosing</td></tr>
</tbody>
</table>
<div class="pitfall">"Asynchronous = tightly coupled" is the reverse of the truth: asynchronous = <strong>loosely</strong> coupled. Also, in UML 1.3 the asynchronous head was a half arrowhead — old figures may look different.</div>`,
        `<p class="y-chinh">🎯 Thông điệp giữa các tác vụ trên concurrent communication diagram là bất đồng bộ (asynchronous — ghép lỏng, loosely coupled: bên gửi không chờ) hoặc đồng bộ (synchronous — ghép chặt, tightly coupled: bên gửi chờ, có thể chờ cả câu trả lời).</p>
<p>Ví dụ trên slide là thư viện: <code>Librarian</code> (thủ thư) → <code>: UI</code> (1: EnquireBorrower — hỏi người mượn) → <code>: Transaction</code> (1.1: CalAmtCanBorrow(id) — tính số được mượn, 1.1.3: GetCheckedOutMedia(id), 1.1.4: IsMediaOverdue(id)) → <code>: Fine</code> (1.1.1: create, 1.1.2: CalFines(id) — tính tiền phạt); 1.1.5: amount trả về UI, rồi 1.2: DisplayInvalidMsg(). Danh sách bên phải là chính các thông điệp đó theo thứ tự — để ý <strong>đánh số lồng</strong>: 1.1.x là các bước do 1.1 kéo theo.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e7d41d5cc878254b868d5f80f4d3437809cce352.svg" alt="Concurrent communication diagram: một yêu cầu gửi e-mail bất đồng bộ và một lời gọi thanh toán đồng bộ có trả lời" loading="lazy" /><p class="chu-thich">🧩 Concurrent communication diagram: một yêu cầu gửi e-mail bất đồng bộ và một lời gọi thanh toán đồng bộ có trả lời</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 18 — concurrent communication diagram: đối tượng chủ động + thông điệp bất đồng bộ / đồng bộ
actor ": Student" as A
rectangle ": ReservationHandler" as H &lt;&lt;active object&gt;&gt;
rectangle ": NotificationSender" as N &lt;&lt;active object&gt;&gt;
rectangle ": PaymentGateway" as P &lt;&lt;active object&gt;&gt;
rectangle ": EmailServer" as E &lt;&lt;external system&gt;&gt;
A -right- H : "1: reserveRequest ▶"
H -right- N : "2: «asynchronous» sendEmail(msg) ▶"
H -down- P : "3: «synchronous» chargeDeposit(amount) ▼\\n4: «reply» receipt ▲"
N -down- E : "2.1: «asynchronous» send(mail) ▼"
@enduml</code></pre></details>
<p>UML phân biệt hai loại bằng <strong>đầu mũi tên</strong> (Hình 2.11 của Gomaa). Sequence diagram cho thấy đầu mũi tên rõ nhất:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/c54cf0d7506e9b6058979a3c9159f1131ccda369.svg" alt="Đầu mũi tên: que hở = bất đồng bộ; tô đặc = đồng bộ; nét đứt = trả lời" loading="lazy" /><p class="chu-thich">🧩 Đầu mũi tên: que hở = bất đồng bộ; tô đặc = đồng bộ; nét đứt = trả lời</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 18 — các đầu mũi tên: đồng bộ (tô đặc), bất đồng bộ (mũi que hở), trả lời (nét đứt)
participant ": ReservationHandler" as H
participant ": NotificationSender" as N
participant ": PaymentGateway" as P
H -&gt;&gt; N : sendEmail(msg) «asynchronous»
note right of H : H does NOT wait
H -&gt; P : chargeDeposit(amount) «synchronous»
activate P
note right of H : H waits here
P --&gt; H : receipt «reply»
deactivate P
@enduml</code></pre></details>
<table>
<thead><tr><th>Loại</th><th>Mũi tên (UML 1.4 và 2)</th><th>Bên gửi</th><th>Ví dụ LabFlow</th></tr></thead>
<tbody>
<tr><td>Bất đồng bộ (ghép lỏng)</td><td>nét liền, đầu que hở</td><td>đi tiếp ngay; thông điệp có thể nằm chờ trong hàng đợi</td><td>gửi e-mail xác nhận</td></tr>
<tr><td>Đồng bộ không trả lời</td><td>nét liền, đầu tô đặc</td><td>chờ tới khi bên nhận nhận lấy</td><td>giao việc cho một worker</td></tr>
<tr><td>Đồng bộ có trả lời</td><td>đầu tô đặc + mũi tên trả lời nét đứt</td><td>chờ câu trả lời</td><td>thu tiền cọc, nhận biên lai</td></tr>
<tr><td>Thông điệp đơn (phân tích)</td><td>mũi que, chưa quyết loại</td><td>—</td><td>dùng ở mô hình phân tích trước khi chọn</td></tr>
</tbody>
</table>
<div class="pitfall">"Bất đồng bộ = ghép chặt" là ngược sự thật: bất đồng bộ = ghép <strong>lỏng</strong>. Thêm: ở UML 1.3 đầu mũi tên bất đồng bộ là nửa mũi tên — hình cũ có thể trông khác.</div>`],
      [19, '9. Deployment Diagrams',
        `<p class="y-chinh">🎯 A deployment diagram shows the physical configuration of the system: physical nodes (drawn as cubes) and the physical connections between them, such as network connections.</p>
<p>The slide's Figure 2.13 has two examples, redrawn here: an ATMClient node <code>{1 node per ATM}</code> connected to a BankServer <code>{1 node}</code> over a <code>«wide area network»</code>; and Server1, Server2, Client1–3 all attached to a <code>«local area network»</code> drawn as a node, the form used when more than two nodes share a network.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/ff25fac066b252fa97f684158593acf169f83595.svg" alt="The school's Figure 2.13: nodes, connections stereotyped with the network type, constraints giving how many nodes exist" loading="lazy" /><p class="chu-thich">🧩 The school's Figure 2.13: nodes, connections stereotyped with the network type, constraints giving how many nodes exist</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 19 — deployment diagram (school Figure 2.13): nodes as cubes, connections with stereotypes, constraints
node "ATMClient\\n{1 node per ATM}" as ATM
node "BankServer\\n{1 node}" as BS
ATM - BS : &lt;&lt;wide area network&gt;&gt;

node Server1
node Server2
node "&lt;&lt;local area network&gt;&gt;" as LAN
node Client1
node Client2
node Client3
Server1 -- LAN
Server2 -- LAN
LAN -- Client1
LAN -- Client2
LAN -- Client3
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/ba651a47a3de4a3435d0dc87ee3425dc7d2d655a.svg" alt="➕ LabFlow deployment (illustration): which software artifact runs on which node" loading="lazy" /><p class="chu-thich">🧩 ➕ LabFlow deployment (illustration): which software artifact runs on which node</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 19 — LabFlow deployment (illustrative): which software runs on which hardware node
node "Student PC\\n{many}" as PC {
  artifact "Browser (React SPA)" as SPA
}
node "VPS\\n{1 node}" as VPS &lt;&lt;Ubuntu server&gt;&gt; {
  node "nginx" &lt;&lt;container&gt;&gt; as NG
  node "backend" &lt;&lt;container&gt;&gt; as BE {
    artifact "labflow.jar" as JAR
  }
  node "postgres" &lt;&lt;container&gt;&gt; as PG
}
PC -- VPS : &lt;&lt;internet, HTTPS&gt;&gt;
NG -- BE : &lt;&lt;HTTP&gt;&gt;
BE -- PG : &lt;&lt;JDBC&gt;&gt;
@enduml</code></pre></details>
<p><strong>Read:</strong> each cube is a machine (or, nested, an execution environment such as a Docker container); the text in braces is a <em>constraint</em> (how many of this node); the stereotype on a line is the kind of connection. <code>labflow.jar</code> is an <em>artifact</em> — a file that is deployed onto a node.</p>
<p><strong>Draw it step by step:</strong> (1) list the machines/devices; (2) draw a cube for each, with <code>{how many}</code>; (3) connect cubes that talk, stereotype each line with the protocol/network; (4) put artifacts (JAR, SPA bundle, database) inside the node where they run.</p>
<div class="pitfall">Do not put classes or use cases in a deployment diagram, and do not confuse it with a component diagram: component = logical parts and interfaces; deployment = hardware nodes and what is installed on them.</div>`,
        `<p class="y-chinh">🎯 Deployment diagram (sơ đồ triển khai) cho thấy cấu hình vật lý của hệ thống: các nút vật lý (vẽ là khối hộp) và các kết nối vật lý giữa chúng, ví dụ kết nối mạng.</p>
<p>Hình 2.13 trên slide có hai ví dụ, vẽ lại ở đây: nút ATMClient <code>{1 node per ATM}</code> (mỗi máy ATM một nút) nối với BankServer <code>{1 node}</code> qua <code>«wide area network»</code> (mạng diện rộng); và Server1, Server2, Client1–3 cùng gắn vào một <code>«local area network»</code> (mạng cục bộ) vẽ thành một nút — cách vẽ dùng khi hơn hai nút chung một mạng.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/ff25fac066b252fa97f684158593acf169f83595.svg" alt="Hình 2.13 của trường: nút, kết nối mang stereotype loại mạng, ràng buộc cho biết có bao nhiêu nút" loading="lazy" /><p class="chu-thich">🧩 Hình 2.13 của trường: nút, kết nối mang stereotype loại mạng, ràng buộc cho biết có bao nhiêu nút</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 19 — deployment diagram (Hình 2.13 của trường): nút là khối hộp, kết nối có stereotype, ràng buộc
node "ATMClient\\n{1 node per ATM}" as ATM
node "BankServer\\n{1 node}" as BS
ATM - BS : &lt;&lt;wide area network&gt;&gt;

node Server1
node Server2
node "&lt;&lt;local area network&gt;&gt;" as LAN
node Client1
node Client2
node Client3
Server1 -- LAN
Server2 -- LAN
LAN -- Client1
LAN -- Client2
LAN -- Client3
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/ba651a47a3de4a3435d0dc87ee3425dc7d2d655a.svg" alt="➕ Triển khai LabFlow (minh hoạ): phần mềm nào chạy trên nút nào" loading="lazy" /><p class="chu-thich">🧩 ➕ Triển khai LabFlow (minh hoạ): phần mềm nào chạy trên nút nào</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 19 — triển khai LabFlow (minh hoạ): phần mềm nào chạy trên nút phần cứng nào
node "Student PC\\n{many}" as PC {
  artifact "Browser (React SPA)" as SPA
}
node "VPS\\n{1 node}" as VPS &lt;&lt;Ubuntu server&gt;&gt; {
  node "nginx" &lt;&lt;container&gt;&gt; as NG
  node "backend" &lt;&lt;container&gt;&gt; as BE {
    artifact "labflow.jar" as JAR
  }
  node "postgres" &lt;&lt;container&gt;&gt; as PG
}
PC -- VPS : &lt;&lt;internet, HTTPS&gt;&gt;
NG -- BE : &lt;&lt;HTTP&gt;&gt;
BE -- PG : &lt;&lt;JDBC&gt;&gt;
@enduml</code></pre></details>
<p><strong>Đọc:</strong> mỗi khối hộp là một máy (hoặc, khi lồng vào, một môi trường chạy như container Docker); chữ trong ngoặc nhọn là <em>ràng buộc</em> (có bao nhiêu nút này); stereotype trên đường nối là loại kết nối. <code>labflow.jar</code> là một <em>artifact</em> — một file được cài lên nút.</p>
<p><strong>Vẽ từng bước:</strong> (1) liệt kê các máy/thiết bị; (2) vẽ một khối hộp cho mỗi cái, kèm <code>{bao nhiêu}</code>; (3) nối các khối có nói chuyện với nhau, ghi stereotype giao thức/mạng trên đường; (4) đặt artifact (JAR, gói SPA, CSDL) vào trong nút nơi nó chạy.</p>
<div class="pitfall">Đừng đặt lớp hay use case vào deployment diagram, và đừng lẫn với component diagram: component = các phần logic và interface; deployment = nút phần cứng và thứ được cài lên đó.</div>`],
      [20, '10. UML Extension Mechanisms',
        `<p class="y-chinh">🎯 UML provides three mechanisms to extend the language: stereotypes, tagged values, and constraints.</p>
<table>
<thead><tr><th>Mechanism</th><th>Written as</th><th>Adds</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Stereotype</td><td>«name» (guillemets)</td><td>a new <em>kind</em> of an existing element</td><td>«entity» class, «subsystem» package, «asynchronous» message</td></tr>
<tr><td>Tagged value</td><td>{tag = value}</td><td>extra <em>properties</em> of an element</td><td>{version = 1.0, author = Gill}</td></tr>
<tr><td>Constraint</td><td>{condition} or OCL</td><td>a <em>rule</em> that must stay true</td><td>{balance >= 0}</td></tr>
</tbody>
</table>
<p>You have already met all three in this chapter: <code>«system»</code>/<code>«subsystem»</code> on packages (slide 15), <code>«active object»</code> (slide 17), <code>{1 node per ATM}</code> on a deployment node (slide 19).</p>
<p class="meo">🧠 <strong>S-T-C</strong>: Stereotype = what kind, Tagged value = extra info, Constraint = rule.</p>`,
        `<p class="y-chinh">🎯 UML cho ba cơ chế để mở rộng ngôn ngữ: stereotype (khuôn mẫu), tagged value (giá trị gắn thẻ) và constraint (ràng buộc).</p>
<table>
<thead><tr><th>Cơ chế</th><th>Cách viết</th><th>Thêm gì</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Stereotype</td><td>«tên» (ngoặc kép góc)</td><td>một <em>loại</em> mới của một phần tử có sẵn</td><td>lớp «entity», package «subsystem», thông điệp «asynchronous»</td></tr>
<tr><td>Tagged value</td><td>{thẻ = giá trị}</td><td><em>thuộc tính bổ sung</em> của phần tử</td><td>{version = 1.0, author = Gill}</td></tr>
<tr><td>Constraint</td><td>{điều kiện} hoặc OCL</td><td>một <em>luật</em> luôn phải đúng</td><td>{balance >= 0}</td></tr>
</tbody>
</table>
<p>Bạn đã gặp cả ba trong chương này: <code>«system»</code>/<code>«subsystem»</code> trên package (slide 15), <code>«active object»</code> (slide 17), <code>{1 node per ATM}</code> trên nút triển khai (slide 19).</p>
<p class="meo">🧠 <strong>S-T-C</strong>: Stereotype = loại gì, Tagged value = thông tin thêm, Constraint = luật.</p>`],
      [21, '10.1 Stereotype',
        `<p class="y-chinh">🎯 A stereotype defines a new building block derived from an existing UML element but tailored to the modeler's problem — like a special label: it does not create a new element, it extends the meaning of an existing one; stereotypes can be standard UML or defined by the modeler.</p>
<p>The slide's examples: <code>«entity»</code> on Customer (a data class), <code>«controller»</code> on OrderController (controls workflow), <code>«boundary»</code> on LoginUI (a user-interface class). Figure 2.14 shows two notations — (a) the name in guillemets, (b) the icons of the Unified Software Development Process:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/69e0ac4f624a0d33bddb048a63c986546d2ccf93.svg" alt="Alternative a: standard notation, the stereotype in «guillemets» above the class name" loading="lazy" /><p class="chu-thich">🧩 Alternative a: standard notation, the stereotype in «guillemets» above the class name</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 21 — stereotypes, alternative a: standard «guillemets» notation (school Figure 2.14a)
hide circle
hide members
class ProcessPlan &lt;&lt;entity&gt;&gt;
class ElevatorControl &lt;&lt;control&gt;&gt;
class SensorInterface &lt;&lt;boundary&gt;&gt;
class Customer &lt;&lt;entity&gt;&gt;
class OrderController &lt;&lt;control&gt;&gt;
class LoginUI &lt;&lt;boundary&gt;&gt;
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4ce3c79a867e208e500dc2306cb723f87b35b9a0.svg" alt="Alternative b: the boundary (circle with a bar), control (circle with an arrow) and entity (circle on a line) icons" loading="lazy" /><p class="chu-thich">🧩 Alternative b: the boundary (circle with a bar), control (circle with an arrow) and entity (circle on a line) icons</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 21 — stereotypes, alternative b: icons of the Unified Software Development Process (school Figure 2.14b)
left to right direction
actor User
boundary LoginUI
control LoginControl
entity UserAccount
User -- LoginUI
LoginUI -- LoginControl
LoginControl -- UserAccount
@enduml</code></pre></details>
<p><strong>Read:</strong> boundary = talks to the outside (a user or another system); control = coordinates one use case; entity = long-lived data. COMET's whole object structuring (Ch.8) is built on these three stereotypes — the objects in the sequence diagram of slide 13 are one of each.</p>
<div class="pitfall">The slide writes <code>«controller»</code>, but Gomaa and USDP write <strong><code>«control»</code></strong>. Use «control» in the exam and in assignments. Also write guillemets «…» (or &lt;&lt;…&gt;&gt; when typing) — never quotes "…".</div>`,
        `<p class="y-chinh">🎯 Stereotype định nghĩa một khối dựng mới, sinh ra từ một phần tử UML có sẵn nhưng may đo cho bài toán của người mô hình hoá — như một nhãn đặc biệt: nó không tạo phần tử mới, chỉ mở rộng nghĩa của phần tử có sẵn; stereotype có thể là chuẩn của UML hoặc do người mô hình tự định nghĩa.</p>
<p>Ví dụ trên slide: <code>«entity»</code> (thực thể) trên Customer (lớp dữ liệu), <code>«controller»</code> trên OrderController (điều khiển luồng công việc), <code>«boundary»</code> (biên) trên LoginUI (lớp giao diện người dùng). Hình 2.14 cho hai cách vẽ — (a) tên trong ngoặc kép góc, (b) biểu tượng của Unified Software Development Process:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/69e0ac4f624a0d33bddb048a63c986546d2ccf93.svg" alt="Cách a: ký pháp chuẩn, stereotype trong «ngoặc kép góc» trên tên lớp" loading="lazy" /><p class="chu-thich">🧩 Cách a: ký pháp chuẩn, stereotype trong «ngoặc kép góc» trên tên lớp</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 21 — stereotype, cách a: ký hiệu chuẩn «ngoặc kép góc» (Hình 2.14a)
hide circle
hide members
class ProcessPlan &lt;&lt;entity&gt;&gt;
class ElevatorControl &lt;&lt;control&gt;&gt;
class SensorInterface &lt;&lt;boundary&gt;&gt;
class Customer &lt;&lt;entity&gt;&gt;
class OrderController &lt;&lt;control&gt;&gt;
class LoginUI &lt;&lt;boundary&gt;&gt;
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4ce3c79a867e208e500dc2306cb723f87b35b9a0.svg" alt="Cách b: biểu tượng boundary (vòng tròn có vạch), control (vòng tròn có mũi tên) và entity (vòng tròn trên một gạch)" loading="lazy" /><p class="chu-thich">🧩 Cách b: biểu tượng boundary (vòng tròn có vạch), control (vòng tròn có mũi tên) và entity (vòng tròn trên một gạch)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 21 — stereotype, cách b: biểu tượng của Unified Software Development Process (Hình 2.14b)
left to right direction
actor User
boundary LoginUI
control LoginControl
entity UserAccount
User -- LoginUI
LoginUI -- LoginControl
LoginControl -- UserAccount
@enduml</code></pre></details>
<p><strong>Đọc:</strong> boundary = nói chuyện với bên ngoài (người dùng hoặc hệ thống khác); control = điều phối một use case; entity = dữ liệu sống lâu. Toàn bộ việc chia đối tượng của COMET (Ch.8) dựng trên ba stereotype này — các đối tượng trong sequence diagram ở slide 13 là mỗi loại một cái.</p>
<div class="pitfall">Slide viết <code>«controller»</code>, nhưng Gomaa và USDP viết <strong><code>«control»</code></strong>. Dùng «control» trong bài thi và assignment. Và viết ngoặc kép góc «…» (hoặc &lt;&lt;…&gt;&gt; khi gõ máy) — không dùng ngoặc kép thường "…".</div>`],
      [22, '10.2 Tagged Values',
        `<p class="y-chinh">🎯 A tagged value extends the properties of a UML element with new information — like adding extra attributes to describe the element; format <code>name = value</code>, in braces, commas between several.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e0b503e19c5956d1b6516d1f1be180484ab18026.svg" alt="The slide's Figure 2.15: class Account with tagged values {version = 1.0, author = Gill} and a constraint on balance" loading="lazy" /><p class="chu-thich">🧩 The slide's Figure 2.15: class Account with tagged values {version = 1.0, author = Gill} and a constraint on balance</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 22 — tagged values {tag = value} + a constraint on an attribute (school Figure 2.15)
hide circle
skinparam classAttributeIconSize 0
class "Account\\n{version = 1.0, author = Gill}" as Account &lt;&lt;entity&gt;&gt; {
  -accountNumber : Integer
  -balance : Real {balance &gt;= 0}
}
@enduml</code></pre></details>
<p><strong>Read:</strong> <code>{version = 1.0, author = Gill}</code> under the class name is information <em>about the model element</em> (who wrote it, which version), not data stored in each Account object. <code>{balance &gt;= 0}</code> after the attribute is a constraint — next slide.</p>
<div class="pitfall">Do not confuse a tagged value with an attribute: an attribute (<code>-balance : Real</code>) has a value in <em>every object</em> at run time; a tagged value has one value for the <em>class in the model</em>.</div>
<p class="meo">🧠 In Java, the closest thing to a tagged value is an annotation with parameters on the class, e.g. <code>@Table(name = "reservations")</code> — information about the class for tools, not data in objects (compare the PSM in lesson 1.A, slide 13).</p>`,
        `<p class="y-chinh">🎯 Tagged value mở rộng thuộc tính của một phần tử UML bằng thông tin mới — như thêm thuộc tính phụ để mô tả phần tử; dạng <code>tên = giá trị</code>, đặt trong ngoặc nhọn, nhiều cái cách nhau dấu phẩy.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e0b503e19c5956d1b6516d1f1be180484ab18026.svg" alt="Hình 2.15 của slide: lớp Account có tagged value {version = 1.0, author = Gill} và một ràng buộc trên balance" loading="lazy" /><p class="chu-thich">🧩 Hình 2.15 của slide: lớp Account có tagged value {version = 1.0, author = Gill} và một ràng buộc trên balance</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 22 — tagged value {tag = value} + ràng buộc trên thuộc tính (Hình 2.15)
hide circle
skinparam classAttributeIconSize 0
class "Account\\n{version = 1.0, author = Gill}" as Account &lt;&lt;entity&gt;&gt; {
  -accountNumber : Integer
  -balance : Real {balance &gt;= 0}
}
@enduml</code></pre></details>
<p><strong>Đọc:</strong> <code>{version = 1.0, author = Gill}</code> dưới tên lớp là thông tin <em>về phần tử mô hình</em> (ai viết, phiên bản nào), không phải dữ liệu lưu trong từng đối tượng Account. <code>{balance &gt;= 0}</code> sau thuộc tính là ràng buộc — slide sau.</p>
<div class="pitfall">Đừng lẫn tagged value với thuộc tính: thuộc tính (<code>-balance : Real</code>) có giá trị trong <em>mỗi đối tượng</em> lúc chạy; tagged value có một giá trị cho <em>lớp trong mô hình</em>.</div>
<p class="meo">🧠 Trong Java, thứ gần tagged value nhất là annotation có tham số trên lớp, vd <code>@Table(name = "reservations")</code> — thông tin về lớp cho công cụ, không phải dữ liệu trong đối tượng (so với PSM ở bài 1.A, slide 13).</p>`],
      [23, '10.3 Constraints',
        `<p class="y-chinh">🎯 A constraint is a rule or condition that must hold true, written inside braces <code>{}</code> or in OCL (Object Constraint Language); example <code>{size &gt;= 0}</code>.</p>
<p>The slide's figure shows "three ways to show UML constraints" on a Stack: inside the class after the attribute (<code>size : Integer {size &gt;= 0}</code>), in a note attached to an operation (<code>{post condition: new size = old size + 1}</code> for <code>push</code>), and in a separate note (<code>{post condition: new size = old size – 1}</code> for <code>pop</code>). Redrawn, with the OCL form added:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/2573dbf99862721caa28f6b2018855aa90335208.svg" alt="Constraints on Stack: inline {size &gt;= 0}, notes with post conditions, and the same rule in OCL" loading="lazy" /><p class="chu-thich">🧩 Constraints on Stack: inline {size >= 0}, notes with post conditions, and the same rule in OCL</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 23 — three ways to show constraints: inside {}, in a note, in OCL
hide circle
skinparam classAttributeIconSize 0
class Stack {
  -size : Integer {size &gt;= 0}
  +push(element)
  +pop() : Object
}
note right of Stack::push
  {post condition: new size = old size + 1}
end note
note right of Stack::pop
  {post condition: new size = old size - 1}
end note
note bottom of Stack
  OCL:
  context Stack::pop() : Object
  pre: size &gt; 0
  post: size = size@pre - 1
end note
@enduml</code></pre></details>
<p><strong>Read the OCL:</strong> <code>context Stack::pop()</code> = the rule is about operation pop of Stack; <code>pre: size &gt; 0</code> = you may call it only on a non-empty stack; <code>post: size = size@pre - 1</code> = afterwards the size is the old size (<code>@pre</code>) minus one.</p>
<div class="callout">🧭 <strong>Apply to LabFlow (illustration).</strong> <code>Lab {capacity &gt; 0}</code>, <code>Reservation {endTime &gt; startTime}</code>, <code>ProjectTeam {3..5 members}</code>. In code they become Bean Validation annotations (<code>@Positive</code>, <code>@Size(min = 3, max = 5)</code>) or database CHECK constraints — the same rule, three places.</div>
<div class="pitfall">Braces mean two different things: <code>{version = 1.0}</code> (with <code>=</code> as a label) is a tagged value; <code>{balance &gt;= 0}</code> (a condition that is true or false) is a constraint.</div>`,
        `<p class="y-chinh">🎯 Ràng buộc (constraint) là một luật hay điều kiện phải luôn đúng, viết trong ngoặc nhọn <code>{}</code> hoặc bằng OCL (Object Constraint Language — ngôn ngữ ràng buộc đối tượng); ví dụ <code>{size &gt;= 0}</code>.</p>
<p>Hình trên slide cho "ba cách thể hiện ràng buộc UML" trên một Stack: trong lớp sau thuộc tính (<code>size : Integer {size &gt;= 0}</code>), trong một note gắn với thao tác (<code>{post condition: new size = old size + 1}</code> cho <code>push</code> — hậu điều kiện: kích thước mới = cũ + 1), và trong một note riêng (<code>{post condition: new size = old size – 1}</code> cho <code>pop</code>). Vẽ lại, thêm dạng OCL:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/2573dbf99862721caa28f6b2018855aa90335208.svg" alt="Ràng buộc trên Stack: viết liền {size &gt;= 0}, note có hậu điều kiện, và cùng luật đó bằng OCL" loading="lazy" /><p class="chu-thich">🧩 Ràng buộc trên Stack: viết liền {size >= 0}, note có hậu điều kiện, và cùng luật đó bằng OCL</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 23 — ba cách ghi ràng buộc: trong {}, trong note, bằng OCL
hide circle
skinparam classAttributeIconSize 0
class Stack {
  -size : Integer {size &gt;= 0}
  +push(element)
  +pop() : Object
}
note right of Stack::push
  {post condition: new size = old size + 1}
end note
note right of Stack::pop
  {post condition: new size = old size - 1}
end note
note bottom of Stack
  OCL:
  context Stack::pop() : Object
  pre: size &gt; 0
  post: size = size@pre - 1
end note
@enduml</code></pre></details>
<p><strong>Đọc OCL:</strong> <code>context Stack::pop()</code> = luật nói về thao tác pop của Stack; <code>pre: size &gt; 0</code> (tiền điều kiện) = chỉ được gọi khi ngăn xếp không rỗng; <code>post: size = size@pre - 1</code> (hậu điều kiện) = sau đó kích thước bằng kích thước cũ (<code>@pre</code>) trừ một.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow (minh hoạ).</strong> <code>Lab {capacity &gt; 0}</code>, <code>Reservation {endTime &gt; startTime}</code>, <code>ProjectTeam {3..5 members}</code>. Trong code chúng thành annotation Bean Validation (<code>@Positive</code>, <code>@Size(min = 3, max = 5)</code>) hoặc ràng buộc CHECK trong CSDL — cùng một luật, ba chỗ.</div>
<div class="pitfall">Ngoặc nhọn mang hai nghĩa: <code>{version = 1.0}</code> (dấu <code>=</code> gán nhãn) là tagged value; <code>{balance &gt;= 0}</code> (điều kiện đúng hoặc sai) là ràng buộc.</div>`],
    ]),
    bi(`<h2>➕ Beyond the slides — naming conventions (Gomaa 2.11, no slide)</h2>
<table>
<thead><tr><th>Element</th><th>Analysis model</th><th>Design model</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Use case</td><td>capitals, spaces</td><td>same</td><td>Withdraw Funds, Reserve Lab Slot</td></tr>
<tr><td>Class</td><td>UpperCamelCase, no spaces</td><td>same</td><td>CheckingAccount, Reservation</td></tr>
<tr><td>Attribute</td><td>lowerCamelCase; type capitalised</td><td>same</td><td>accountNumber : Integer</td></tr>
<tr><td>Object</td><td><code>aName</code> or <code>: Class</code></td><td>same</td><td>aCheckingAccount, : Reservation</td></tr>
<tr><td>Message</td><td>Capitals, spaces (simple message)</td><td>lowerCamelCase with parameters</td><td>Reserve Request → reserveRequest(labId)</td></tr>
<tr><td>State, event, action</td><td>Capitals, spaces</td><td>same</td><td>Waiting For PIN, Cash Dispensed</td></tr>
<tr><td>Operation</td><td>—</td><td>lowerCamelCase</td><td>validatePassword(userPassword)</td></tr>
</tbody>
</table>
<h2>📌 Symbols you must recognise after slides 13–23</h2>
<ul>
<li>Sequence: lifeline (dashed), activation bar, filled arrow = call, dashed = reply, frames loop/alt/opt.</li>
<li>Statechart: black dot, rounded states, <code>Event [condition] / Action</code>, entry/exit, composite state, bull's-eye.</li>
<li>Package: folder with a tab, «system»/«subsystem», dashed dependency arrows pointing downwards in layers.</li>
<li>Active object («active object» / double side bars) vs passive; asynchronous (open head, loosely coupled) vs synchronous (filled head, tightly coupled).</li>
<li>Deployment: cubes, <code>{n nodes}</code>, «network» on connections, artifacts inside nodes.</li>
<li>Extension: «stereotype», {tag = value}, {constraint} / OCL; boundary–control–entity.</li>
</ul>
<div class="callout">📝 <strong>Self-check before the quiz:</strong> without looking, draw on paper (1) the LabFlow use case diagram with one include and one extend, (2) the six relationship arrows, (3) the reservation statechart. Then compare with the diagrams above.</div>`,
    `<h2>➕ Mở rộng ngoài slide — quy ước đặt tên (Gomaa 2.11, không có slide)</h2>
<table>
<thead><tr><th>Phần tử</th><th>Mô hình phân tích</th><th>Mô hình thiết kế</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Use case</td><td>viết hoa chữ đầu, có dấu cách</td><td>như vậy</td><td>Withdraw Funds, Reserve Lab Slot</td></tr>
<tr><td>Lớp</td><td>UpperCamelCase, không dấu cách</td><td>như vậy</td><td>CheckingAccount, Reservation</td></tr>
<tr><td>Thuộc tính</td><td>lowerCamelCase; kiểu viết hoa</td><td>như vậy</td><td>accountNumber : Integer</td></tr>
<tr><td>Đối tượng</td><td><code>aTên</code> hoặc <code>: Lớp</code></td><td>như vậy</td><td>aCheckingAccount, : Reservation</td></tr>
<tr><td>Thông điệp</td><td>Viết hoa, có dấu cách (thông điệp đơn)</td><td>lowerCamelCase kèm tham số</td><td>Reserve Request → reserveRequest(labId)</td></tr>
<tr><td>Trạng thái, sự kiện, hành động</td><td>Viết hoa, có dấu cách</td><td>như vậy</td><td>Waiting For PIN, Cash Dispensed</td></tr>
<tr><td>Thao tác</td><td>—</td><td>lowerCamelCase</td><td>validatePassword(userPassword)</td></tr>
</tbody>
</table>
<h2>📌 Ký hiệu phải nhận ra sau slide 13–23</h2>
<ul>
<li>Sequence: lifeline (nét đứt), thanh kích hoạt, mũi tên đầu đặc = gọi, nét đứt = trả về, khung loop/alt/opt.</li>
<li>Statechart: chấm đen, trạng thái bo góc, <code>Event [condition] / Action</code>, entry/exit, trạng thái hợp, mắt bò.</li>
<li>Package: thư mục có thẻ, «system»/«subsystem», mũi tên phụ thuộc nét đứt chỉ xuống dưới giữa các tầng.</li>
<li>Đối tượng chủ động («active object» / hai vạch đứng kép) và bị động; bất đồng bộ (đầu hở, ghép lỏng) và đồng bộ (đầu đặc, ghép chặt).</li>
<li>Deployment: khối hộp, <code>{n nút}</code>, «mạng» trên đường nối, artifact trong nút.</li>
<li>Mở rộng: «stereotype», {thẻ = giá trị}, {ràng buộc} / OCL; boundary–control–entity.</li>
</ul>
<div class="callout">📝 <strong>Tự kiểm trước khi làm quiz:</strong> không nhìn bài, vẽ ra giấy (1) use case diagram LabFlow có một include và một extend, (2) sáu mũi tên quan hệ, (3) statechart của lượt đặt. Rồi so với các sơ đồ ở trên.</div>`),
    books([
      ['gomaa', 'Chapter 2, sections 2.5.2–2.11 (Figures 2.6–2.15)', 'Chương 2, mục 2.5.2–2.11 (Hình 2.6–2.15)'],
      ['fowler', 'Chapter 4 "Sequence Diagrams", Chapter 7 "Package Diagrams", Chapter 8 "Deployment Diagrams", Chapter 10 "State Machine Diagrams"', 'Chương 4 "Sequence Diagrams", Chương 7 "Package Diagrams", Chương 8 "Deployment Diagrams", Chương 10 "State Machine Diagrams"'],
      ['plantuml', '"Sequence Diagram", "State Diagram", "Deployment Diagram", notes and stereotypes', 'các mục "Sequence Diagram", "State Diagram", "Deployment Diagram", note và stereotype'],
      ['fuSlides', 'deck "Chapter 2: Overview of the UML Notation", slides 13–23', 'bộ "Chapter 2: Overview of the UML Notation", slide 13–23'],
    ]),
  ].join('\n'),
};

/* ───────── 1.D — 📑 Slide by slide · Life cycle models (1): waterfall, prototyping, incremental, spiral (school Ch.3, slides 1–13) ───────── */
const L_swd4_1 = {
  title: '1.D — 📑 Slide by slide · Life cycle models (1): waterfall, prototyping, incremental, spiral (school Ch.3, slides 1–13)|||1.D — 📑 Học theo từng slide · Mô hình vòng đời (1): thác nước, nguyên mẫu, tăng dần, xoắn ốc (Chapter 3 của trường, slide 1–13)',
  slug: 'swd392-slide-swd4-1',
  type: 'VIDEO',
  description: 'Giảng slide 1–13 Chapter 3 của trường (Gomaa Ch.3): vòng đời phần mềm là gì, mô hình thác nước và hai giới hạn lớn của nó, nguyên mẫu bỏ đi (cho yêu cầu và cho thiết kế), nguyên mẫu tiến hoá / phát triển tăng dần, kết hợp hai cách, mô hình xoắn ốc hướng rủi ro — mỗi mô hình có sơ đồ PlantUML dựng thật, bảng so sánh, bẫy thi trắc nghiệm, phần mở rộng Agile/Scrum và cách áp vào đồ án LabFlow.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.D · school deck "Chapter 3: Software Life Cycle Models and Processes", slides 1–13</span>
<h2>Software life cycle models (part 1) — the deck, slide by slide</h2>
<p class="lead">Before you can design software you must know <em>when</em> design happens and what comes before and after it. This deck compares the classic ways of organising a project: <strong>waterfall</strong>, <strong>throwaway prototyping</strong>, <strong>incremental development</strong> (evolutionary prototyping), their <strong>combination</strong>, and the risk-driven <strong>spiral</strong>. The 60-minute theory exam loves this chapter because the models are easy to confuse: "which model is risk-driven?", "which one fixes the late testing of requirements?". Every model below gets a real diagram, a plain-language explanation and the traps. Material the slide does not have is marked <strong>➕ Beyond the slide</strong>.</p>
<div class="callout"><strong>What you should be able to do after this lesson:</strong> draw each model from memory, name its main strength and weakness, and say which model a team should choose for a given situation (requirements unclear? high technical risk? need an early working version?).</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.D · bộ slide "Chapter 3: Software Life Cycle Models and Processes" của trường, slide 1–13</span>
<h2>Mô hình vòng đời phần mềm (phần 1) — học bộ slide từng trang</h2>
<p class="lead">Trước khi thiết kế phần mềm, bạn phải biết thiết kế diễn ra <em>lúc nào</em>, trước nó là gì và sau nó là gì. Bộ slide này so sánh các cách tổ chức một dự án kinh điển: <strong>thác nước (waterfall)</strong>, <strong>nguyên mẫu bỏ đi (throwaway prototyping)</strong>, <strong>phát triển tăng dần (incremental development)</strong> hay còn gọi nguyên mẫu tiến hoá, <strong>cách kết hợp</strong> hai cái đó, và mô hình <strong>xoắn ốc (spiral)</strong> hướng rủi ro. Bài lý thuyết 60 phút rất thích chương này vì các mô hình dễ nhầm: "mô hình nào hướng rủi ro?", "mô hình nào khắc phục việc yêu cầu bị kiểm quá muộn?". Mỗi mô hình dưới đây có sơ đồ dựng thật, lời giải thích dễ hiểu và các bẫy. Phần slide không có được đánh dấu <strong>➕ Mở rộng ngoài slide</strong>.</p>
<div class="callout"><strong>Học xong bài này bạn làm được:</strong> vẽ lại từng mô hình không cần nhìn, nói được điểm mạnh và điểm yếu chính của nó, và chọn được mô hình hợp với một tình huống (yêu cầu còn mù mờ? rủi ro kỹ thuật cao? cần sớm có bản chạy được?).</div>`),
    walkHead('swd4', 1, 13),
    walk('swd4', [
      [1, 'Chapter 3: Software Life Cycle Models and Processes',
        `<p class="y-chinh">🎯 Chapter 3 answers one question: in what order, and how many times, does a team do requirements, design, coding and testing?</p>
<p>A <em>process model</em> (or life cycle model) is the team's plan of work. Design — the subject of SWD392 — is one phase inside it. Gomaa needs this chapter so that Chapter 5 can place his own method, COMET, inside a life cycle.</p>`,
        `<p class="y-chinh">🎯 Chương 3 trả lời một câu: đội làm yêu cầu, thiết kế, viết code và kiểm thử theo thứ tự nào, và làm bao nhiêu vòng?</p>
<p>Một <em>mô hình quy trình (process model)</em> hay mô hình vòng đời (life cycle model) là kế hoạch làm việc của đội. Thiết kế — chủ đề của SWD392 — là một pha nằm trong đó. Gomaa cần chương này để tới Chương 5 đặt phương pháp riêng của ông, COMET, vào một vòng đời.</p>`],
      [2, 'Content',
        `<p class="y-chinh">🎯 Four parts: (1) software life cycle models, (2) design verification and validation, (3) software life cycle activities, (4) software testing.</p>
<p>This lesson (1.D) covers part 1 up to the spiral model (slides 3–13). Lesson 1.E covers the Unified Process and parts 2–4 (slides 14–24). Part 1 is the biggest and the one most asked in the theory exam.</p>`,
        `<p class="y-chinh">🎯 Bốn phần: (1) các mô hình vòng đời phần mềm, (2) xác minh và thẩm định thiết kế (verification and validation), (3) các hoạt động trong vòng đời, (4) kiểm thử phần mềm (software testing).</p>
<p>Bài này (1.D) học phần 1 tới mô hình xoắn ốc (slide 3–13). Bài 1.E học Unified Process và phần 2–4 (slide 14–24). Phần 1 dài nhất và hay ra thi lý thuyết nhất.</p>`],
      [3, '1. Software life cycle models',
        `<p class="y-chinh">🎯 A software life cycle is a <strong>phased</strong> approach to developing software, with specific <strong>deliverables</strong> and <strong>milestones</strong> in each phase; a life cycle model is an abstraction of the process, used for <strong>planning</strong>.</p>
<table>
<thead><tr><th>Word</th><th>Meaning</th><th>LabFlow example</th></tr></thead>
<tbody>
<tr><td>phase</td><td>a stretch of work with one goal</td><td>"design phase"</td></tr>
<tr><td>deliverable</td><td>a document or product a phase must hand over</td><td>the SRS, the design document, the code</td></tr>
<tr><td>milestone</td><td>a checkpoint where you decide whether to go on</td><td>"Report 3 approved by the supervisor"</td></tr>
<tr><td>model</td><td>a simplified picture of how phases follow each other</td><td>waterfall, spiral…</td></tr>
</tbody>
</table>
<p>The model is not the project itself; it is a map you use to plan people, time and documents. Real projects deviate from it — which is exactly the story of the next slides.</p>
<div class="pitfall">Gomaa's own quiz: "What is a software life cycle?" — answer <strong>"a phased approach to developing software"</strong>, not "a cyclic approach" and not "the life of the software". The word <em>cycle</em> tempts you to choose "cyclic".</div>`,
        `<p class="y-chinh">🎯 Vòng đời phần mềm (software life cycle) là cách phát triển phần mềm <strong>chia theo pha</strong> (phase), mỗi pha có <strong>sản phẩm bàn giao</strong> (deliverable) và <strong>cột mốc</strong> (milestone) cụ thể; mô hình vòng đời là một bản trừu tượng hoá của quy trình, dùng để <strong>lập kế hoạch</strong>.</p>
<table>
<thead><tr><th>Từ</th><th>Nghĩa</th><th>Ví dụ LabFlow</th></tr></thead>
<tbody>
<tr><td>phase — pha</td><td>một khúc công việc có một mục tiêu</td><td>"pha thiết kế"</td></tr>
<tr><td>deliverable — sản phẩm bàn giao</td><td>tài liệu hoặc sản phẩm pha đó phải nộp</td><td>SRS, tài liệu thiết kế, code</td></tr>
<tr><td>milestone — cột mốc</td><td>điểm dừng để quyết định có đi tiếp không</td><td>"Report 3 được thầy duyệt"</td></tr>
<tr><td>model — mô hình</td><td>bức tranh đơn giản hoá cách các pha nối nhau</td><td>thác nước, xoắn ốc…</td></tr>
</tbody>
</table>
<p>Mô hình không phải chính dự án; nó là tấm bản đồ để lên kế hoạch người, thời gian và tài liệu. Dự án thật luôn lệch khỏi nó — và đó chính là câu chuyện của các slide sau.</p>
<div class="pitfall">Câu trắc nghiệm của chính Gomaa: "What is a software life cycle?" — đáp án <strong>"a phased approach to developing software"</strong> (cách phát triển chia theo pha), không phải "a cyclic approach" (vòng lặp) và không phải "the life of the software". Chữ <em>cycle</em> dễ dụ bạn chọn "cyclic".</div>`],
      [4, '1.1. Waterfall Life Cycle Model',
        `<p class="y-chinh">🎯 The waterfall model (Gomaa Figure 3.1): seven phases in a staircase — Requirements Analysis &amp; Specification → Architectural Design → Detailed Design → Coding → Unit Testing → Integration Testing → System &amp; Acceptance Testing.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/ec09e7eee1aeca2c1aa10d164b52c7209241315d.svg" alt="The waterfall life cycle (Figure 3.1): water only flows down — each phase starts when the previous one is finished" loading="lazy" /><p class="chu-thich">🧩 The waterfall life cycle (Figure 3.1): water only flows down — each phase starts when the previous one is finished</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 4 — the waterfall life cycle (Gomaa Figure 3.1): each phase finishes before the next starts
start
:Requirements Analysis &amp; Specification;
note right: output: SRS
:Architectural Design;
note right: output: components + interfaces
:Detailed Design;
note right: output: algorithms, data structures
:Coding;
:Unit Testing;
:Integration Testing;
:System &amp; Acceptance Testing;
note right: the user sees a working system\\nonly here
stop
@enduml</code></pre></details>
<p><strong>Read it like water falling down steps:</strong> the output of one phase is the input of the next. Requirements produce the SRS; architectural design splits the system into components; detailed design fills in each component's algorithms; then code, then three levels of testing.</p>
<p>Notice the symmetry, which the V-model of lesson 1.E makes explicit: the design phases on the way down are checked by the test phases at the bottom (detailed design ↔ unit testing, architectural design ↔ integration testing, requirements ↔ system/acceptance testing).</p>
<p class="meo">🧠 Remember the order as "R-A-D-C-U-I-S": Requirements, Architecture, Detail, Code, Unit, Integration, System.</p>
<div class="pitfall">The text export of this slide lists "Detailed Design" last; the picture shows the correct order — it comes right after Architectural Design. Exam questions use the book's order.</div>`,
        `<p class="y-chinh">🎯 Mô hình thác nước (Hình 3.1 của Gomaa): bảy pha xếp bậc thang — Phân tích &amp; đặc tả yêu cầu → Thiết kế kiến trúc → Thiết kế chi tiết → Viết code → Kiểm thử đơn vị → Kiểm thử tích hợp → Kiểm thử hệ thống &amp; nghiệm thu.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/ec09e7eee1aeca2c1aa10d164b52c7209241315d.svg" alt="Vòng đời thác nước (Hình 3.1): nước chỉ chảy xuống — pha sau bắt đầu khi pha trước đã xong" loading="lazy" /><p class="chu-thich">🧩 Vòng đời thác nước (Hình 3.1): nước chỉ chảy xuống — pha sau bắt đầu khi pha trước đã xong</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 4 — vòng đời thác nước (Hình 3.1 của Gomaa): xong hẳn một pha mới sang pha sau
start
:Requirements Analysis &amp; Specification;
note right: output: SRS
:Architectural Design;
note right: output: components + interfaces
:Detailed Design;
note right: output: algorithms, data structures
:Coding;
:Unit Testing;
:Integration Testing;
:System &amp; Acceptance Testing;
note right: the user sees a working system\\nonly here
stop
@enduml</code></pre></details>
<p><strong>Đọc như nước chảy xuống bậc thang:</strong> đầu ra của pha này là đầu vào của pha sau. Pha yêu cầu cho ra SRS (Software Requirements Specification — bản đặc tả yêu cầu); thiết kế kiến trúc (architectural design) chia hệ thống thành các thành phần; thiết kế chi tiết (detailed design) viết thuật toán cho từng thành phần; rồi viết code, rồi ba mức kiểm thử.</p>
<p>Để ý tính đối xứng, thứ mà mô hình chữ V ở bài 1.E vẽ rõ ra: các pha thiết kế trên đường đi xuống được kiểm bởi các pha kiểm thử ở dưới đáy (thiết kế chi tiết ↔ kiểm thử đơn vị — unit testing, thiết kế kiến trúc ↔ kiểm thử tích hợp — integration testing, yêu cầu ↔ kiểm thử hệ thống/nghiệm thu — system/acceptance testing).</p>
<p class="meo">🧠 Nhớ thứ tự bằng "R-A-D-C-U-I-S": Requirements, Architecture, Detail, Code, Unit, Integration, System.</p>
<div class="pitfall">Bản chữ trích từ slide này ghi "Detailed Design" ở cuối; hình trên slide cho thứ tự đúng — nó nằm ngay sau Architectural Design. Câu hỏi thi dùng thứ tự của sách.</div>`],
      [5, '1.1 Waterfall Life Cycle Model',
        `<p class="y-chinh">🎯 The waterfall was the <strong>earliest widely used</strong> life cycle model; it is an <strong>idealized</strong> model in which each phase is completed before the next starts, with <strong>no iteration and no overlap</strong>.</p>
<p>The picture on this slide is the popular six-box version: Requirements → Design → Development → Testing → Deployment → Maintenance. It is the same idea as slide 4 with coarser phases, plus the two phases after delivery (deployment and maintenance) that Gomaa's figure leaves out.</p>
<p><strong>Why it appeared:</strong> Gomaa explains that in the 1960s software costs grew while hardware became cheap; the "software crisis" of the late 1960s led to the term <em>software engineering</em>, and the phased waterfall was the first disciplined answer. It is a big improvement over "code and fix".</p>
<p><strong>When it still works well:</strong> requirements are stable and well understood (a payroll change required by law, a port of an old system), the team has built the same kind of system before, or a contract demands signed documents per phase.</p>
<div class="callout">➕ <strong>Beyond the slide — a piece of history.</strong> The name comes from Winston Royce's 1970 paper. Ironically Royce drew the pure staircase and then said it is "risky and invites failure"; he recommended feedback between phases and building a pilot version first — the ideas of slides 7–9.</div>`,
        `<p class="y-chinh">🎯 Thác nước là mô hình vòng đời <strong>sớm nhất được dùng rộng rãi</strong>; nó là mô hình <strong>lý tưởng hoá</strong> (idealized): pha trước xong hẳn mới bắt đầu pha sau, <strong>không lặp (iteration) và không chồng lấn (overlap)</strong>.</p>
<p>Hình trên slide là bản sáu ô quen thuộc: Requirements (yêu cầu) → Design (thiết kế) → Development (phát triển) → Testing (kiểm thử) → Deployment (triển khai) → Maintenance (bảo trì). Cùng ý với slide 4 nhưng pha gộp to hơn, và có thêm hai pha sau khi giao hàng (triển khai và bảo trì) mà hình của Gomaa bỏ qua.</p>
<p><strong>Vì sao nó ra đời:</strong> Gomaa kể rằng những năm 1960 chi phí phần mềm tăng vọt trong khi phần cứng rẻ dần; "khủng hoảng phần mềm" (software crisis) cuối thập niên 60 sinh ra thuật ngữ <em>kỹ nghệ phần mềm (software engineering)</em>, và thác nước chia pha là câu trả lời có kỷ luật đầu tiên. Nó hơn hẳn kiểu "code rồi sửa" (code and fix).</p>
<p><strong>Khi nào vẫn hợp:</strong> yêu cầu ổn định và đã hiểu rõ (sửa phần mềm lương theo luật mới, chuyển một hệ thống cũ sang nền tảng mới), đội đã làm loại hệ thống này nhiều lần, hoặc hợp đồng bắt ký tài liệu từng pha.</p>
<div class="callout">➕ <strong>Mở rộng ngoài slide — một mẩu lịch sử.</strong> Cái tên đến từ bài báo năm 1970 của Winston Royce. Trớ trêu là Royce vẽ bậc thang thuần tuý rồi nói nó "rủi ro và dễ dẫn tới thất bại"; ông khuyên có phản hồi giữa các pha và làm một bản thử trước — chính là ý của slide 7–9.</div>`],
      [6, '1.2 Limitations of the Waterfall Model — does not show iteration in software life cycle',
        `<p class="y-chinh">🎯 Four limitations: the waterfall (1) does not show iteration, (2) does not show overlap between phases, (3) tests software requirements late, (4) makes the operational system available late.</p>
<table>
<thead><tr><th>Limitation</th><th>What goes wrong in practice</th><th>Which alternative fixes it (Gomaa 3.1.2)</th></tr></thead>
<tbody>
<tr><td>no iteration</td><td>errors found later cannot officially go back</td><td>waterfall with iteration (slide 7)</td></tr>
<tr><td>no overlap</td><td>people wait idle for the previous phase to finish</td><td>overlap in practice (slide 7)</td></tr>
<tr><td>requirements tested late</td><td>a wrong requirement is discovered only in system/acceptance testing — the most expensive moment</td><td><strong>throwaway prototyping</strong> (slide 8)</td></tr>
<tr><td>working system late</td><td>a big design or performance problem appears when it is too late to act</td><td><strong>evolutionary prototyping / incremental development</strong> (slide 10)</td></tr>
</tbody>
</table>
<p>Gomaa stresses the third point: studies show errors in the requirements specification are usually the <em>last</em> to be detected and the <em>most costly</em> to correct. Users cannot judge a 40-page SRS; they can judge a screen they click on.</p>
<div class="pitfall">Exam pairing (Gomaa's questions 3–4): limitation "requirements are not properly tested until a working system is available" → fixed by <strong>throwaway prototyping</strong>. Limitation "working system available late" → fixed by <strong>evolutionary prototyping / incremental development</strong>. "Software is developed in phases" is <em>not</em> a limitation — every model has phases.</div>`,
        `<p class="y-chinh">🎯 Bốn giới hạn: thác nước (1) không thể hiện việc lặp, (2) không thể hiện sự chồng lấn giữa các pha, (3) kiểm yêu cầu phần mềm quá muộn, (4) có hệ thống chạy được quá muộn.</p>
<table>
<thead><tr><th>Giới hạn</th><th>Thực tế hỏng ở đâu</th><th>Cách nào khắc phục (Gomaa 3.1.2)</th></tr></thead>
<tbody>
<tr><td>không lặp</td><td>lỗi phát hiện muộn không được chính thức quay lại sửa</td><td>thác nước có lặp (slide 7)</td></tr>
<tr><td>không chồng lấn</td><td>người ngồi chờ pha trước xong</td><td>chồng lấn trong thực tế (slide 7)</td></tr>
<tr><td>yêu cầu kiểm muộn</td><td>yêu cầu sai chỉ lộ ra ở kiểm thử hệ thống/nghiệm thu — lúc đắt nhất</td><td><strong>nguyên mẫu bỏ đi (throwaway prototyping)</strong> (slide 8)</td></tr>
<tr><td>có bản chạy muộn</td><td>vấn đề lớn về thiết kế hay hiệu năng lộ ra khi đã quá muộn</td><td><strong>nguyên mẫu tiến hoá / phát triển tăng dần</strong> (slide 10)</td></tr>
</tbody>
</table>
<p>Gomaa nhấn mạnh ý thứ ba: nhiều nghiên cứu cho thấy lỗi trong bản đặc tả yêu cầu thường được phát hiện <em>sau cùng</em> và <em>tốn nhất</em> để sửa. Người dùng không đánh giá nổi một SRS 40 trang; họ đánh giá được một màn hình bấm thử.</p>
<div class="pitfall">Cặp hay ra thi (câu 3–4 cuối chương của Gomaa): giới hạn "yêu cầu không được kiểm đúng nghĩa cho tới khi có hệ thống chạy được" → khắc phục bằng <strong>throwaway prototyping</strong>. Giới hạn "có hệ thống chạy được quá muộn" → khắc phục bằng <strong>evolutionary prototyping / incremental development</strong>. "Phần mềm được làm theo pha" <em>không</em> phải giới hạn — mô hình nào cũng có pha.</div>`],
      [7, '1.2 Limitations of the Waterfall Model',
        `<p class="y-chinh">🎯 In practice some <strong>overlap</strong> between successive phases is often necessary, and some <strong>iteration</strong> between phases when errors are detected — Gomaa Figure 3.2 adds dotted "go back" arrows to the waterfall.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/c13e71dfb136ccd179a138ac2ba16d4cbfd3a914.svg" alt="Waterfall with iteration between phases (Figure 3.2): solid arrows go forward, dashed &quot;rework&quot; arrows go back one phase" loading="lazy" /><p class="chu-thich">🧩 Waterfall with iteration between phases (Figure 3.2): solid arrows go forward, dashed "rework" arrows go back one phase</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 7 — waterfall with iteration between phases (Gomaa Figure 3.2): dotted arrows go back one phase when an error is found
rectangle "Requirements\\nAnalysis &amp; Specification" as R
rectangle "Architectural\\nDesign" as A
rectangle "Detailed\\nDesign" as D
rectangle "Coding" as C
rectangle "Unit\\nTesting" as U
rectangle "Integration\\nTesting" as I
rectangle "System &amp;\\nAcceptance Testing" as S
R -right-&gt; A
A -down-&gt; D
D -right-&gt; C
C -down-&gt; U
U -right-&gt; I
I -down-&gt; S
A .up.&gt; R : rework
D .up.&gt; A : rework
C .left.&gt; D : rework
U .up.&gt; C : rework
I .left.&gt; U : rework
S .up.&gt; I : rework
@enduml</code></pre></details>
<p><strong>Read:</strong> each dashed arrow means "while doing this phase we found a mistake made in the previous one, so we go back and fix it". A coder finds that the detailed design forgot a case; a unit test shows the code is wrong; integration testing shows two components disagree on an interface.</p>
<p>Notice what the figure still does <em>not</em> fix: the arrows only go back <strong>one</strong> step. A requirement error found in acceptance testing must climb the whole staircase — every phase in between is redone. That is why the next slides attack the problem at the start (prototype the requirements) or change the shape entirely (increments).</p>
<p class="meo">🧠 Picture a staircase where you may step back one stair, but a fall from the top floor still hurts.</p>`,
        `<p class="y-chinh">🎯 Thực tế thường cần một chút <strong>chồng lấn</strong> giữa các pha liên tiếp, và một chút <strong>lặp</strong> giữa các pha khi phát hiện lỗi — Hình 3.2 của Gomaa thêm các mũi tên chấm "quay lại" vào thác nước.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/c13e71dfb136ccd179a138ac2ba16d4cbfd3a914.svg" alt="Thác nước có lặp giữa các pha (Hình 3.2): mũi tên liền đi tới, mũi tên đứt &quot;rework — làm lại&quot; lùi một pha" loading="lazy" /><p class="chu-thich">🧩 Thác nước có lặp giữa các pha (Hình 3.2): mũi tên liền đi tới, mũi tên đứt "rework — làm lại" lùi một pha</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 7 — thác nước có lặp giữa các pha (Hình 3.2): mũi tên chấm quay lại pha trước khi phát hiện lỗi
rectangle "Requirements\\nAnalysis &amp; Specification" as R
rectangle "Architectural\\nDesign" as A
rectangle "Detailed\\nDesign" as D
rectangle "Coding" as C
rectangle "Unit\\nTesting" as U
rectangle "Integration\\nTesting" as I
rectangle "System &amp;\\nAcceptance Testing" as S
R -right-&gt; A
A -down-&gt; D
D -right-&gt; C
C -down-&gt; U
U -right-&gt; I
I -down-&gt; S
A .up.&gt; R : rework
D .up.&gt; A : rework
C .left.&gt; D : rework
U .up.&gt; C : rework
I .left.&gt; U : rework
S .up.&gt; I : rework
@enduml</code></pre></details>
<p><strong>Đọc:</strong> mỗi mũi tên đứt nghĩa là "đang làm pha này thì thấy lỗi của pha trước, nên quay lại sửa". Người viết code thấy thiết kế chi tiết quên một trường hợp; kiểm thử đơn vị cho thấy code sai; kiểm thử tích hợp cho thấy hai thành phần hiểu interface (giao diện lập trình) khác nhau.</p>
<p>Để ý hình vẫn <em>chưa</em> chữa được gì: mũi tên chỉ lùi <strong>một</strong> bậc. Lỗi yêu cầu phát hiện ở kiểm thử nghiệm thu phải leo ngược cả cầu thang — mọi pha ở giữa đều phải làm lại. Vì vậy các slide sau tấn công vấn đề ngay từ đầu (làm nguyên mẫu cho yêu cầu) hoặc đổi hẳn hình dạng (làm theo bước tăng — increment).</p>
<p class="meo">🧠 Hình dung cầu thang cho phép lùi một bậc, nhưng ngã từ tầng thượng xuống thì vẫn đau.</p>`],
      [8, '1.3 Throwaway Prototyping',
        `<p class="y-chinh">🎯 A <strong>throwaway prototype</strong> is built quickly to clarify user requirements — especially for systems with a complex user interface — and is then thrown away; it breaks the communication barrier between users and developers (Figure 3.3).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/26a320b6fd16be124247cf4ce10af6fe7c791db9.svg" alt="Throwaway prototyping of software requirements (Figure 3.3): a loop between the SRS and the prototype, then the normal waterfall" loading="lazy" /><p class="chu-thich">🧩 Throwaway prototyping of software requirements (Figure 3.3): a loop between the SRS and the prototype, then the normal waterfall</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 8 — throwaway prototyping of software requirements (Gomaa Figure 3.3): the prototype loops back into the SRS, then is thrown away
rectangle "Requirements\\nAnalysis &amp; Specification" as R
rectangle "Throwaway\\nPrototyping" as P
rectangle "Architectural\\nDesign" as A
rectangle "Detailed\\nDesign" as D
rectangle "Coding" as C
rectangle "Unit Testing" as U
rectangle "Integration\\nTesting" as I
rectangle "System &amp;\\nAcceptance Testing" as S
R -down-&gt; P : preliminary SRS
P -up-&gt; R : user feedback\\n(revised SRS)
R -right-&gt; A
A -down-&gt; D
D -right-&gt; C
C -down-&gt; U
U -right-&gt; I
I -down-&gt; S
@enduml</code></pre></details>
<p><strong>How it runs:</strong> write a <em>preliminary</em> SRS → build a quick prototype (clickable screens, fake data) → users try it and react ("we also need to see who booked before me") → write a <em>revised</em> SRS → throw the prototype away → continue with the conventional life cycle.</p>
<p><strong>Why throw it away?</strong> It was built fast, without architecture, tests or error handling. Its value is the <em>knowledge</em> it produced, not its code. Keeping it tempts the team to ship a hack.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): a Figma mock-up of the "Reserve Equipment" screens shown to two lab managers before writing Report 3 is a throwaway prototype. It is cheap and it validates the requirements before any Spring Boot code exists.</div>
<div class="pitfall">Throwaway prototyping mainly fixes the <strong>requirements</strong> problem (validation "build the right system"). It does <strong>not</strong> give an early operational system — that is evolutionary prototyping.</div>`,
        `<p class="y-chinh">🎯 <strong>Nguyên mẫu bỏ đi (throwaway prototype)</strong> được làm nhanh để làm rõ yêu cầu người dùng — nhất là với hệ thống có giao diện phức tạp — rồi bỏ đi; nó phá rào cản giao tiếp giữa người dùng và lập trình viên (Hình 3.3).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/26a320b6fd16be124247cf4ce10af6fe7c791db9.svg" alt="Nguyên mẫu bỏ đi cho yêu cầu (Hình 3.3): một vòng lặp giữa SRS và nguyên mẫu, rồi đi tiếp thác nước bình thường" loading="lazy" /><p class="chu-thich">🧩 Nguyên mẫu bỏ đi cho yêu cầu (Hình 3.3): một vòng lặp giữa SRS và nguyên mẫu, rồi đi tiếp thác nước bình thường</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 8 — nguyên mẫu bỏ đi để làm rõ yêu cầu (Hình 3.3): nguyên mẫu quay vòng về SRS rồi bị bỏ
rectangle "Requirements\\nAnalysis &amp; Specification" as R
rectangle "Throwaway\\nPrototyping" as P
rectangle "Architectural\\nDesign" as A
rectangle "Detailed\\nDesign" as D
rectangle "Coding" as C
rectangle "Unit Testing" as U
rectangle "Integration\\nTesting" as I
rectangle "System &amp;\\nAcceptance Testing" as S
R -down-&gt; P : preliminary SRS
P -up-&gt; R : user feedback\\n(revised SRS)
R -right-&gt; A
A -down-&gt; D
D -right-&gt; C
C -down-&gt; U
U -right-&gt; I
I -down-&gt; S
@enduml</code></pre></details>
<p><strong>Cách chạy:</strong> viết SRS <em>sơ bộ</em> (preliminary) → dựng nhanh nguyên mẫu (màn hình bấm được, dữ liệu giả) → người dùng dùng thử và phản hồi ("chúng tôi cũng cần xem ai đặt trước mình") → viết SRS <em>đã sửa</em> (revised) → bỏ nguyên mẫu → đi tiếp vòng đời thông thường.</p>
<p><strong>Sao lại bỏ đi?</strong> Nó được làm vội, không kiến trúc, không test, không xử lý lỗi. Giá trị của nó là <em>hiểu biết</em> nó mang lại, không phải code của nó. Giữ lại thì đội dễ đem bản chắp vá đi giao.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): bản mock-up Figma các màn hình "Reserve Equipment" đem cho hai quản lý phòng lab xem trước khi viết Report 3 chính là một nguyên mẫu bỏ đi. Nó rẻ và nó kiểm chứng yêu cầu trước khi có dòng code Spring Boot nào.</div>
<div class="pitfall">Nguyên mẫu bỏ đi chủ yếu chữa vấn đề <strong>yêu cầu</strong> (thẩm định — validation, "làm đúng hệ thống cần làm"). Nó <strong>không</strong> cho bạn một hệ thống chạy được sớm — đó là việc của nguyên mẫu tiến hoá.</div>`],
      [9, '1.3 Throwaway Prototyping',
        `<p class="y-chinh">🎯 Throwaway prototypes can also be used for <strong>experimental prototyping of the design</strong> (Figure 3.4) — to check whether an algorithm is logically correct or meets its performance goals.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/3117e999ba699288d429ac9a37a2d6be9caa31fc.svg" alt="Throwaway prototyping of the architectural design (Figure 3.4): the prototype loop now hangs under Architectural Design" loading="lazy" /><p class="chu-thich">🧩 Throwaway prototyping of the architectural design (Figure 3.4): the prototype loop now hangs under Architectural Design</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 9 — throwaway prototyping of the architectural design (Gomaa Figure 3.4): try risky algorithms / performance before committing
rectangle "Requirements\\nAnalysis &amp; Specification" as R
rectangle "Architectural\\nDesign" as A
rectangle "Throwaway\\nPrototyping" as P
rectangle "Incremental\\nComponent Construction" as C
rectangle "Incremental\\nSystem Integration" as I
rectangle "System &amp;\\nAcceptance Testing" as S
R -right-&gt; A
A -down-&gt; P : design experiment
P -up-&gt; A : is it correct?\\nfast enough?
A -right-&gt; C
C -down-&gt; I
I -right-&gt; S
A .up.&gt; R : rework
C .left.&gt; A : rework
I .up.&gt; C : rework
S .left.&gt; I : rework
@enduml</code></pre></details>
<p>This time the users are not the audience; the <em>designers</em> are. Before committing the architecture, they build a small experiment: can the matching algorithm handle 5,000 bookings in time? does the chosen library really stream video? The experiment is thrown away; the decision stays.</p>
<p>Notice the rest of the figure: after architectural design come <em>Incremental Component Construction</em> and <em>Incremental System Integration</em> — Gomaa already combines this with incremental building, which slide 10 explains.</p>
<div class="callout">➕ <strong>Beyond the slide — today's name.</strong> Agile teams call a design experiment a <strong>spike</strong>: a time-boxed task (say one day) whose output is an answer, not production code. Same idea, 30 years later.</div>`,
        `<p class="y-chinh">🎯 Nguyên mẫu bỏ đi còn dùng được để <strong>thử nghiệm thiết kế</strong> (Hình 3.4) — kiểm xem một thuật toán có đúng logic không, có đạt mục tiêu hiệu năng (performance) không.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/3117e999ba699288d429ac9a37a2d6be9caa31fc.svg" alt="Nguyên mẫu bỏ đi cho thiết kế kiến trúc (Hình 3.4): vòng nguyên mẫu giờ treo dưới Architectural Design" loading="lazy" /><p class="chu-thich">🧩 Nguyên mẫu bỏ đi cho thiết kế kiến trúc (Hình 3.4): vòng nguyên mẫu giờ treo dưới Architectural Design</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 9 — nguyên mẫu bỏ đi cho thiết kế kiến trúc (Hình 3.4): thử thuật toán / hiệu năng rủi ro trước khi chốt
rectangle "Requirements\\nAnalysis &amp; Specification" as R
rectangle "Architectural\\nDesign" as A
rectangle "Throwaway\\nPrototyping" as P
rectangle "Incremental\\nComponent Construction" as C
rectangle "Incremental\\nSystem Integration" as I
rectangle "System &amp;\\nAcceptance Testing" as S
R -right-&gt; A
A -down-&gt; P : design experiment
P -up-&gt; A : is it correct?\\nfast enough?
A -right-&gt; C
C -down-&gt; I
I -right-&gt; S
A .up.&gt; R : rework
C .left.&gt; A : rework
I .up.&gt; C : rework
S .left.&gt; I : rework
@enduml</code></pre></details>
<p>Lần này người xem không phải người dùng mà là <em>người thiết kế</em>. Trước khi chốt kiến trúc, họ làm một thí nghiệm nhỏ: thuật toán ghép lịch có xử lý kịp 5.000 lượt đặt không? thư viện đã chọn có thật sự phát video dạng luồng không? Thí nghiệm bị bỏ; quyết định thì ở lại.</p>
<p>Để ý phần còn lại của hình: sau thiết kế kiến trúc là <em>Incremental Component Construction</em> (xây thành phần theo bước tăng) và <em>Incremental System Integration</em> (tích hợp hệ thống theo bước tăng) — Gomaa đã ghép sẵn với cách làm tăng dần mà slide 10 giải thích.</p>
<div class="callout">➕ <strong>Mở rộng ngoài slide — tên gọi ngày nay.</strong> Đội Agile gọi thí nghiệm thiết kế là <strong>spike</strong>: một việc có khung thời gian cố định (ví dụ một ngày) mà đầu ra là câu trả lời, không phải code sản phẩm. Cùng một ý, 30 năm sau.</div>`],
      [10, '1.4 Evolutionary Prototyping by Incremental Development',
        `<p class="y-chinh">🎯 In <strong>evolutionary prototyping</strong> (a form of <strong>incremental development</strong>) the prototype is not thrown away: it evolves through several intermediate <em>operational</em> systems into the delivered system; the goal is a subset of the system working early, then built on gradually (Figure 3.5).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/90e3d157359e0383487e880d8e6bce6235b64946.svg" alt="Incremental development life cycle (Figure 3.5): construct and integrate one increment, it becomes an evolutionary prototype, loop back for the next" loading="lazy" /><p class="chu-thich">🧩 Incremental development life cycle (Figure 3.5): construct and integrate one increment, it becomes an evolutionary prototype, loop back for the next</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 10 — incremental development / evolutionary prototyping (Gomaa Figure 3.5): each increment becomes a working system that feeds the next loop
rectangle "Requirements\\nAnalysis &amp; Specification" as R
rectangle "Architectural\\nDesign" as A
rectangle "Incremental\\nComponent Construction" as C
rectangle "Incremental\\nSystem Integration" as I
rectangle "Evolutionary\\nPrototyping" as E
rectangle "System &amp;\\nAcceptance Testing" as S
R -right-&gt; A
A -right-&gt; C
C -down-&gt; I
I -down-&gt; E : increment n works
E -up-&gt; C : next increment
E -up-&gt; A : design changes
E -up-&gt; R : requirement changes
I -right-&gt; S : last increment
@enduml</code></pre></details>
<p><strong>Read:</strong> requirements and the architecture are done for the whole system first. Then the loop "construct a few components → integrate them → you have a working evolutionary prototype" repeats; each pass adds an increment. Feedback may send you back to design or even requirements.</p>
<table>
<thead><tr><th></th><th>Throwaway prototype</th><th>Evolutionary prototype</th></tr></thead>
<tbody>
<tr><td>Kept?</td><td>no, discarded</td><td>yes, it <em>becomes</em> the product</td></tr>
<tr><td>Built how</td><td>fast and dirty</td><td>carefully, quality built in from the start</td></tr>
<tr><td>Main goal</td><td>clarify requirements / test a design idea</td><td>have a working subset early; spread integration over time</td></tr>
<tr><td>Fixes which waterfall limitation</td><td>requirements tested late</td><td>working system available late</td></tr>
</tbody>
</table>
<p>Gomaa's advice: the first increment should test a <em>complete path</em> from external input to external output, and use cases help choose which subset goes into each increment.</p>`,
        `<p class="y-chinh">🎯 Với <strong>nguyên mẫu tiến hoá (evolutionary prototyping)</strong> — một dạng <strong>phát triển tăng dần (incremental development)</strong> — nguyên mẫu không bị bỏ: nó lớn dần qua nhiều hệ thống trung gian <em>chạy được</em> (operational) cho tới khi thành hệ thống giao cho khách; mục tiêu là sớm có một phần hệ thống chạy, rồi xây thêm dần (Hình 3.5).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/90e3d157359e0383487e880d8e6bce6235b64946.svg" alt="Vòng đời phát triển tăng dần (Hình 3.5): xây và tích hợp một bước tăng, nó thành nguyên mẫu tiến hoá, quay lại làm bước tiếp" loading="lazy" /><p class="chu-thich">🧩 Vòng đời phát triển tăng dần (Hình 3.5): xây và tích hợp một bước tăng, nó thành nguyên mẫu tiến hoá, quay lại làm bước tiếp</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 10 — phát triển tăng dần / nguyên mẫu tiến hoá (Hình 3.5): mỗi bước tăng là một hệ thống chạy được và quay lại vòng sau
rectangle "Requirements\\nAnalysis &amp; Specification" as R
rectangle "Architectural\\nDesign" as A
rectangle "Incremental\\nComponent Construction" as C
rectangle "Incremental\\nSystem Integration" as I
rectangle "Evolutionary\\nPrototyping" as E
rectangle "System &amp;\\nAcceptance Testing" as S
R -right-&gt; A
A -right-&gt; C
C -down-&gt; I
I -down-&gt; E : increment n works
E -up-&gt; C : next increment
E -up-&gt; A : design changes
E -up-&gt; R : requirement changes
I -right-&gt; S : last increment
@enduml</code></pre></details>
<p><strong>Đọc:</strong> yêu cầu và kiến trúc làm cho cả hệ thống trước. Sau đó vòng "xây vài thành phần → tích hợp → có một nguyên mẫu tiến hoá chạy được" lặp lại; mỗi vòng thêm một bước tăng (increment). Phản hồi có thể đưa bạn quay lại thiết kế, thậm chí quay lại yêu cầu.</p>
<table>
<thead><tr><th></th><th>Nguyên mẫu bỏ đi</th><th>Nguyên mẫu tiến hoá</th></tr></thead>
<tbody>
<tr><td>Có giữ lại?</td><td>không, bỏ đi</td><td>có, nó <em>trở thành</em> sản phẩm</td></tr>
<tr><td>Làm thế nào</td><td>nhanh và ẩu</td><td>cẩn thận, chất lượng có từ đầu</td></tr>
<tr><td>Mục tiêu chính</td><td>làm rõ yêu cầu / thử một ý thiết kế</td><td>sớm có phần chạy được; rải việc tích hợp theo thời gian</td></tr>
<tr><td>Chữa giới hạn nào của thác nước</td><td>yêu cầu kiểm muộn</td><td>có hệ thống chạy muộn</td></tr>
</tbody>
</table>
<p>Lời khuyên của Gomaa: bước tăng đầu tiên nên đi trọn <em>một đường xuyên suốt</em> từ đầu vào bên ngoài tới đầu ra bên ngoài, và dùng use case để chọn phần nào đưa vào mỗi bước tăng.</p>`],
      [11, '1.5 Combining Throwaway Prototyping and Incremental Development',
        `<p class="y-chinh">🎯 Incremental development gives a working system (the evolutionary prototype) earlier than the waterfall; it can be combined with throwaway prototyping — first a throwaway prototype clarifies the requirements, then incremental development builds the system; requirements may still change later because the user environment changes.</p>
<p>The combination takes the best of both: the throwaway loop fixes <em>requirements tested late</em>, the incremental loop fixes <em>working system late</em>. Gomaa adds a warning the slide does not show: because the evolutionary prototype <em>is</em> the product, "software quality has to be built into the system from the start" — in particular the architecture must be carefully designed and all interfaces specified <em>before</em> the increments start.</p>
<p>Why do requirements still change? The users' world moves: a new regulation, a new department, a competitor's feature. A good process expects change instead of pretending it will not happen.</p>
<div class="pitfall">Do not confuse the two words: <strong>incremental</strong> = the system grows piece by piece (add features); <strong>iterative</strong> = you repeat and refine the same activity (redo the design better). Evolutionary prototyping is both.</div>`,
        `<p class="y-chinh">🎯 Phát triển tăng dần cho hệ thống chạy được (nguyên mẫu tiến hoá) sớm hơn thác nước; có thể kết hợp với nguyên mẫu bỏ đi — trước tiên nguyên mẫu bỏ đi làm rõ yêu cầu, sau đó phát triển tăng dần xây hệ thống; yêu cầu vẫn có thể đổi về sau vì môi trường của người dùng thay đổi.</p>
<p>Cách kết hợp lấy cái hay của cả hai: vòng nguyên mẫu bỏ đi chữa <em>yêu cầu kiểm muộn</em>, vòng tăng dần chữa <em>có bản chạy muộn</em>. Gomaa thêm một lời cảnh báo slide không ghi: vì nguyên mẫu tiến hoá <em>chính là</em> sản phẩm, "chất lượng phải được xây vào hệ thống ngay từ đầu" — nhất là kiến trúc phải thiết kế cẩn thận và mọi interface phải đặc tả rõ <em>trước khi</em> bắt đầu các bước tăng.</p>
<p>Sao yêu cầu vẫn đổi? Thế giới của người dùng dịch chuyển: quy định mới, phòng ban mới, đối thủ có tính năng mới. Quy trình tốt là quy trình chờ sẵn thay đổi, thay vì giả vờ nó không xảy ra.</p>
<div class="pitfall">Đừng lẫn hai chữ: <strong>incremental — tăng dần</strong> = hệ thống lớn lên từng mảnh (thêm tính năng); <strong>iterative — lặp</strong> = làm lại và tinh chỉnh cùng một việc (làm lại thiết kế cho tốt hơn). Nguyên mẫu tiến hoá là cả hai.</div>`],
      [12, '1.5 Combining Throwaway Prototyping and Incremental Development',
        `<p class="y-chinh">🎯 Gomaa Figure 3.6: the combined life cycle — a throwaway prototyping loop under Requirements Analysis &amp; Specification, then the incremental loop (component construction → system integration → evolutionary prototype) feeding back to design and requirements.</p>
<p>Read it as the two earlier figures glued together: the top-left corner is Figure 3.3 (throwaway loop around the SRS); the rest is Figure 3.5 (the evolutionary prototype sends arrows back to Incremental Component Construction, Architectural Design and Requirements). The last increment goes to System &amp; Acceptance Testing.</p>
<p>Draw it yourself in three steps: (1) draw Figure 3.5; (2) hang a "Throwaway Prototyping" box under the requirements box with a two-way loop; (3) check that every arrow from "Evolutionary Prototyping" points <em>backwards</em>.</p>
<p class="meo">🧠 This figure is almost exactly the COMET life cycle of Chapter 5 (lesson 1.H) — only the box names change to "modeling". Learn it once, use it twice.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): mock-ups for requirements (throwaway), then each two-week sprint delivers a running increment on the staging server (evolutionary). That is exactly this figure — your capstone process is a combined model even if nobody calls it that.</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/362eb3844c9312305a649e750edb3cfab62c3b43.svg" alt="LabFlow (illustration): Scrum sprints are small increments — pick use cases, build, test, demo, repeat" loading="lazy" /><p class="chu-thich">🧩 LabFlow (illustration): Scrum sprints are small increments — pick use cases, build, test, demo, repeat</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' LabFlow (illustration) — a 2-week Scrum sprint is one small iteration: pick use cases, build, test, demo
start
:Product backlog\\n(use cases of LabFlow);
repeat
  :Sprint planning:\\npick 2-3 use cases;
  :Design + code + unit test\\n(Spring Boot, React);
  :Integration test,\\nmerge to main;
  :Sprint review: demo to supervisor\\n= validation;
  :Retrospective;
repeat while (backlog empty?) is (no)
-&gt;yes;
:Final report + defense;
stop
@enduml</code></pre></details>`,
        `<p class="y-chinh">🎯 Hình 3.6 của Gomaa: vòng đời kết hợp — một vòng nguyên mẫu bỏ đi treo dưới Requirements Analysis &amp; Specification, rồi vòng tăng dần (xây thành phần → tích hợp hệ thống → nguyên mẫu tiến hoá) phản hồi ngược về thiết kế và yêu cầu.</p>
<p>Đọc nó như hai hình trước dán lại: góc trên trái là Hình 3.3 (vòng nguyên mẫu bỏ đi quanh SRS); phần còn lại là Hình 3.5 (nguyên mẫu tiến hoá bắn mũi tên ngược về Incremental Component Construction, Architectural Design và Requirements). Bước tăng cuối cùng đi vào System &amp; Acceptance Testing.</p>
<p>Tự vẽ trong ba bước: (1) vẽ Hình 3.5; (2) treo ô "Throwaway Prototyping" dưới ô yêu cầu với vòng hai chiều; (3) kiểm tra mọi mũi tên đi ra từ "Evolutionary Prototyping" đều chỉ <em>ngược về sau</em>.</p>
<p class="meo">🧠 Hình này gần y hệt vòng đời COMET của Chương 5 (bài 1.H) — chỉ đổi tên ô thành "modeling". Học một lần, dùng hai lần.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): mock-up để chốt yêu cầu (bỏ đi), rồi mỗi sprint hai tuần giao một bước tăng chạy được trên máy chủ thử (tiến hoá). Chính là hình này — quy trình đồ án của bạn là mô hình kết hợp dù không ai gọi tên như vậy.</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/362eb3844c9312305a649e750edb3cfab62c3b43.svg" alt="LabFlow (minh hoạ): sprint Scrum là các bước tăng nhỏ — chọn use case, làm, kiểm thử, demo, lặp lại" loading="lazy" /><p class="chu-thich">🧩 LabFlow (minh hoạ): sprint Scrum là các bước tăng nhỏ — chọn use case, làm, kiểm thử, demo, lặp lại</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' LabFlow (minh hoạ) — một sprint Scrum 2 tuần là một vòng lặp nhỏ: chọn use case, làm, kiểm thử, demo
start
:Product backlog\\n(use cases of LabFlow);
repeat
  :Sprint planning:\\npick 2-3 use cases;
  :Design + code + unit test\\n(Spring Boot, React);
  :Integration test,\\nmerge to main;
  :Sprint review: demo to supervisor\\n= validation;
  :Retrospective;
repeat while (backlog empty?) is (no)
-&gt;yes;
:Final report + defense;
stop
@enduml</code></pre></details>`],
      [13, '1.6 Spiral Model — the radial coordinate represents cost',
        `<p class="y-chinh">🎯 The spiral model (Boehm 1988) is <strong>risk-driven</strong>: the <strong>radial</strong> coordinate (distance from the centre) represents <strong>cost</strong>, the <strong>angular</strong> coordinate represents progress within a cycle, and every cycle passes four quadrants — (1) define objectives, alternatives and constraints, (2) analyze risks, (3) develop product, (4) plan next cycle.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/888e3d973c71e0f5253bf3f1112d5849d43e5b17.svg" alt="The spiral model (Figure 3.7) unrolled into a loop: each turn of the spiral = one pass through the four quadrants" loading="lazy" /><p class="chu-thich">🧩 The spiral model (Figure 3.7) unrolled into a loop: each turn of the spiral = one pass through the four quadrants</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 13 — the spiral model (Boehm 1988, Gomaa Figure 3.7) drawn as a loop: every cycle passes the same 4 quadrants
start
repeat
  :1. Define objectives,\\nalternatives and constraints;
  :2. Analyze risks;
  note right
    risk-driven: the risks found here
    decide the extra activities
    (e.g. a throwaway prototype)
  end note
  :3. Develop product\\n(requirements, design or code);
  :4. Plan next cycle;
repeat while (product finished?) is (no)
-&gt;yes;
stop
@enduml</code></pre></details>
<p><strong>Read the spiral:</strong> start at the centre; each turn goes clockwise through the four quadrants; the spiral gets wider as more money has been spent. The number of cycles depends on the project.</p>
<p><strong>What "risk-driven" means (Gomaa 3.1.6):</strong> in quadrant 2 the team lists what could make the project fail, and plans extra activities to reduce each risk. Example: risk "requirements not well understood" → activity "build a throwaway prototype". Gomaa calls these project-specific risks <em>process drivers</em>. So the spiral <em>contains</em> the other models: a cycle can be a prototype, a waterfall step or an increment.</p>
<table>
<thead><tr><th>Quadrant</th><th>Question the team answers</th><th>LabFlow example</th></tr></thead>
<tbody>
<tr><td>1 Objectives</td><td>what do we want this cycle, and what options exist?</td><td>"real-time availability: polling or WebSocket?"</td></tr>
<tr><td>2 Risks</td><td>what could go wrong, how do we reduce it?</td><td>"WebSocket behind the school proxy may fail → spike"</td></tr>
<tr><td>3 Develop</td><td>build/model the product for this cycle</td><td>implement the chosen option</td></tr>
<tr><td>4 Plan</td><td>how did it go, what is the next cycle?</td><td>review, plan the next cycle</td></tr>
</tbody>
</table>
<div class="pitfall">Top trap: "Which approach does the spiral model emphasize?" → <strong>risk-driven development</strong> (not incremental, not prototyping). And the axes: radius = <strong>cost</strong>, angle = <strong>progress</strong> — exam options often swap them.</div>`,
        `<p class="y-chinh">🎯 Mô hình xoắn ốc (spiral, Boehm 1988) <strong>hướng rủi ro (risk-driven)</strong>: toạ độ <strong>bán kính</strong> (khoảng cách tới tâm) biểu diễn <strong>chi phí (cost)</strong>, toạ độ <strong>góc</strong> biểu diễn tiến độ trong một vòng, và mỗi vòng đi qua bốn góc phần tư — (1) xác định mục tiêu, phương án và ràng buộc, (2) phân tích rủi ro, (3) phát triển sản phẩm, (4) lên kế hoạch vòng sau.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/888e3d973c71e0f5253bf3f1112d5849d43e5b17.svg" alt="Mô hình xoắn ốc (Hình 3.7) trải ra thành vòng lặp: mỗi vòng xoắn = một lượt qua bốn góc phần tư" loading="lazy" /><p class="chu-thich">🧩 Mô hình xoắn ốc (Hình 3.7) trải ra thành vòng lặp: mỗi vòng xoắn = một lượt qua bốn góc phần tư</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 13 — mô hình xoắn ốc (Boehm 1988, Hình 3.7) vẽ thành vòng lặp: mỗi vòng đi qua đúng 4 góc phần tư
start
repeat
  :1. Define objectives,\\nalternatives and constraints;
  :2. Analyze risks;
  note right
    risk-driven: the risks found here
    decide the extra activities
    (e.g. a throwaway prototype)
  end note
  :3. Develop product\\n(requirements, design or code);
  :4. Plan next cycle;
repeat while (product finished?) is (no)
-&gt;yes;
stop
@enduml</code></pre></details>
<p><strong>Đọc hình xoắn:</strong> bắt đầu ở tâm; mỗi vòng đi theo chiều kim đồng hồ qua bốn góc phần tư; đường xoắn càng xa tâm nghĩa là đã tiêu càng nhiều tiền. Số vòng tuỳ dự án.</p>
<p><strong>"Hướng rủi ro" nghĩa là gì (Gomaa 3.1.6):</strong> ở góc phần tư 2, đội liệt kê những gì có thể làm dự án thất bại, và lên các hoạt động bổ sung để giảm từng rủi ro. Ví dụ: rủi ro "yêu cầu chưa hiểu rõ" → hoạt động "làm một nguyên mẫu bỏ đi". Gomaa gọi các rủi ro riêng của dự án này là <em>process drivers</em> (yếu tố dẫn dắt quy trình). Vì vậy xoắn ốc <em>bao trùm</em> các mô hình khác: một vòng có thể là một nguyên mẫu, một bước thác nước hay một bước tăng.</p>
<table>
<thead><tr><th>Góc phần tư</th><th>Đội trả lời câu gì</th><th>Ví dụ LabFlow</th></tr></thead>
<tbody>
<tr><td>1 Mục tiêu</td><td>vòng này muốn gì, có những phương án nào?</td><td>"cập nhật chỗ trống tức thời: hỏi định kỳ (polling) hay WebSocket?"</td></tr>
<tr><td>2 Rủi ro</td><td>cái gì có thể hỏng, giảm bằng cách nào?</td><td>"WebSocket có thể bị proxy của trường chặn → làm thử (spike)"</td></tr>
<tr><td>3 Phát triển</td><td>xây/mô hình hoá sản phẩm cho vòng này</td><td>cài phương án đã chọn</td></tr>
<tr><td>4 Kế hoạch</td><td>vòng này ra sao, vòng sau làm gì?</td><td>tổng kết, lên kế hoạch vòng sau</td></tr>
</tbody>
</table>
<div class="pitfall">Bẫy số một: "Which approach does the spiral model emphasize?" → <strong>risk-driven development</strong> (phát triển hướng rủi ro), không phải incremental, không phải prototyping. Và hai trục: bán kính = <strong>chi phí</strong>, góc = <strong>tiến độ</strong> — đáp án nhiễu hay tráo hai cái này.</div>`],
    ]),
    bi(`<h2>📌 Compare the models at a glance (slides 3–13)</h2>
<table>
<thead><tr><th>Model</th><th>Shape</th><th>Strength</th><th>Weakness</th><th>Choose it when</th></tr></thead>
<tbody>
<tr><td>Waterfall</td><td>one pass, phase after phase</td><td>simple to plan, clear documents</td><td>requirements tested late, working system late</td><td>requirements stable and well known</td></tr>
<tr><td>Waterfall + iteration</td><td>one pass, step back one phase</td><td>realistic fixes</td><td>late requirement errors still costly</td><td>as above, in practice</td></tr>
<tr><td>Throwaway prototyping</td><td>quick prototype, then discard</td><td>clarifies requirements / tests a design idea early</td><td>costs time for code you throw away</td><td>complex UI, unclear requirements</td></tr>
<tr><td>Incremental (evolutionary)</td><td>many working increments</td><td>early working system, integration spread out</td><td>needs a solid architecture first</td><td>need early value, long project</td></tr>
<tr><td>Spiral</td><td>cycles of 4 quadrants</td><td>explicit risk management; contains the others</td><td>needs risk-analysis skill; hard to contract</td><td>large, high-risk projects</td></tr>
</tbody>
</table>
<div class="callout">➕ <strong>Beyond the slide — where Agile fits.</strong> The Agile Manifesto (2001) and Scrum push incremental + iterative development to short cycles (1–4 week sprints) with a working increment every sprint and the customer reviewing it. In the terms of this chapter, a Scrum project is evolutionary prototyping with very short increments, often preceded by UI mock-ups (throwaway). The theory exam still asks about Gomaa's models, but in interviews you will be asked "Waterfall vs Agile?" — answer with the two waterfall limitations of slide 6.</div>
<p>Continue with lesson 1.E: the Unified Process (USDP/RUP), verification vs validation, the life cycle activities and the four testing levels.</p>`,
    `<h2>📌 So sánh các mô hình trong một bảng (slide 3–13)</h2>
<table>
<thead><tr><th>Mô hình</th><th>Hình dạng</th><th>Điểm mạnh</th><th>Điểm yếu</th><th>Chọn khi</th></tr></thead>
<tbody>
<tr><td>Thác nước</td><td>một lượt, pha nối pha</td><td>dễ lên kế hoạch, tài liệu rõ</td><td>yêu cầu kiểm muộn, bản chạy có muộn</td><td>yêu cầu ổn định, đã hiểu rõ</td></tr>
<tr><td>Thác nước có lặp</td><td>một lượt, lùi được một pha</td><td>sửa lỗi thực tế hơn</td><td>lỗi yêu cầu phát hiện muộn vẫn đắt</td><td>như trên, trong thực tế</td></tr>
<tr><td>Nguyên mẫu bỏ đi</td><td>làm nhanh một bản thử rồi bỏ</td><td>làm rõ yêu cầu / thử ý thiết kế sớm</td><td>tốn công viết code để bỏ</td><td>giao diện phức tạp, yêu cầu mù mờ</td></tr>
<tr><td>Tăng dần (tiến hoá)</td><td>nhiều bước tăng chạy được</td><td>sớm có bản chạy, tích hợp rải đều</td><td>cần kiến trúc vững trước</td><td>cần giá trị sớm, dự án dài</td></tr>
<tr><td>Xoắn ốc</td><td>nhiều vòng 4 góc phần tư</td><td>quản lý rủi ro rõ ràng; bao trùm các mô hình khác</td><td>cần người giỏi phân tích rủi ro; khó ký hợp đồng</td><td>dự án lớn, rủi ro cao</td></tr>
</tbody>
</table>
<div class="callout">➕ <strong>Mở rộng ngoài slide — Agile nằm ở đâu.</strong> Tuyên ngôn Agile (Agile Manifesto, 2001) và Scrum đẩy cách làm tăng dần + lặp xuống các vòng ngắn (sprint 1–4 tuần), mỗi sprint có một bước tăng chạy được và khách hàng xem lại nó. Theo ngôn ngữ của chương này, dự án Scrum là nguyên mẫu tiến hoá với bước tăng rất ngắn, thường có mock-up giao diện (bỏ đi) đi trước. Bài lý thuyết vẫn hỏi mô hình của Gomaa, nhưng đi phỏng vấn bạn sẽ gặp câu "Waterfall khác Agile thế nào?" — trả lời bằng hai giới hạn của thác nước ở slide 6.</div>
<p>Học tiếp bài 1.E: Unified Process (USDP/RUP), xác minh và thẩm định (verification vs validation), các hoạt động trong vòng đời và bốn mức kiểm thử.</p>`),
    books([
      ['gomaa', 'Chapter 3, section 3.1.1–3.1.6 (Figures 3.1–3.7) and the multiple-choice exercises at the end of the chapter', 'Chương 3, mục 3.1.1–3.1.6 (Hình 3.1–3.7) và các câu trắc nghiệm cuối chương'],
      ['fowler', 'Chapter 2 "Development Process" (iterative vs waterfall, where UML fits)', 'Chương 2 "Development Process" (lặp và thác nước, UML nằm ở đâu)'],
      ['plantuml', '"Activity Diagram (new syntax)" — repeat loops, notes', 'mục "Activity Diagram (new syntax)" — vòng lặp repeat, note'],
      ['fuSlides', 'deck "Chapter 3: Software Life Cycle Models and Processes", slides 1–13', 'bộ "Chapter 3: Software Life Cycle Models and Processes", slide 1–13'],
    ]),
  ].join('\n'),
};

/* ───────── 1.E — 📑 Slide by slide · Life cycles (2): Unified Process, V&V, testing (school Ch.3, slides 14–24) ───────── */
const L_swd4_2 = {
  title: '1.E — 📑 Slide by slide · Life cycles (2): Unified Process, V&V, testing (school Ch.3, slides 14–24)|||1.E — 📑 Học theo từng slide · Vòng đời (2): Unified Process, xác minh & thẩm định, kiểm thử (Chapter 3 của trường, slide 14–24)',
  slug: 'swd392-slide-swd4-2',
  type: 'VIDEO',
  description: 'Giảng slide 14–24 Chapter 3 của trường (Gomaa Ch.3): Unified Software Development Process (USDP/RUP) — artifact, workflow, phase, năm workflow và bốn pha, verification và validation, đảm bảo chất lượng, phân tích hiệu năng thiết kế, các hoạt động của vòng đời, mô hình chữ V và bốn mức kiểm thử (unit, integration, system, acceptance), hộp trắng và hộp đen, độ phủ câu lệnh và độ phủ nhánh với Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.E · school deck "Chapter 3: Software Life Cycle Models and Processes", slides 14–24</span>
<h2>Software life cycle models (part 2) — the deck, slide by slide</h2>
<p class="lead">The second half of Chapter 3: the <strong>Unified Software Development Process</strong> (the UML-based process that COMET is designed to fit), the difference between <strong>verification</strong> and <strong>validation</strong>, the four engineering <strong>activities</strong> every model contains, and the four <strong>testing levels</strong>. Almost every slide here is a definition — and definitions are exactly what the multiple-choice theory exam asks. For each one you get the meaning in plain words, an example from LabFlow, and the trap answer.</p>`,
    `<span class="eyebrow">Chương 1 · Bài 1.E · bộ slide "Chapter 3: Software Life Cycle Models and Processes" của trường, slide 14–24</span>
<h2>Mô hình vòng đời phần mềm (phần 2) — học bộ slide từng trang</h2>
<p class="lead">Nửa sau Chương 3: <strong>Unified Software Development Process</strong> (quy trình dựa trên UML mà COMET được thiết kế để khớp vào), khác nhau giữa <strong>xác minh (verification)</strong> và <strong>thẩm định (validation)</strong>, bốn <strong>hoạt động</strong> kỹ thuật mô hình nào cũng có, và bốn <strong>mức kiểm thử</strong>. Gần như slide nào ở đây cũng là một định nghĩa — và định nghĩa chính là thứ bài trắc nghiệm lý thuyết hỏi. Với mỗi định nghĩa bạn có: nghĩa bằng lời dễ hiểu, ví dụ từ LabFlow, và đáp án bẫy.</p>`),
    walkHead('swd4', 14, 24),
    walk('swd4', [
      [14, '1.7 Unified Software Development Process',
        `<p class="y-chinh">🎯 The <strong>USDP</strong> (Jacobson et al. 1999), also called the <strong>Rational Unified Process (RUP)</strong>, is a <strong>use case–driven</strong> process that uses UML; it is <strong>iterative</strong> and has <strong>five core workflows</strong> and <strong>four phases</strong>.</p>
<table>
<thead><tr><th>Term</th><th>Definition on the slide</th><th>In plain words</th><th>LabFlow example</th></tr></thead>
<tbody>
<tr><td>artifact</td><td>a piece of information produced, modified or used by a process</td><td>any output you can hand over</td><td>use case diagram, class diagram, source code, test plan</td></tr>
<tr><td>workflow</td><td>a sequence of activities that produces a result of observable value</td><td>a <em>kind</em> of work, done again in every iteration</td><td>"analysis": draw the analysis class and sequence diagrams</td></tr>
<tr><td>phase</td><td>the time between two major milestones, where objectives are met, artifacts completed and a go/no-go decision made</td><td>a <em>period</em> on the calendar</td><td>"elaboration: weeks 3–6"</td></tr>
</tbody>
</table>
<p>The key idea: <strong>workflows and phases are two different axes</strong>. Workflows say <em>what</em> kind of work (requirements, analysis, design, implementation, test); phases say <em>when</em> in the project (inception, elaboration, construction, transition). In every phase you do a bit of every workflow — only the amount changes (next slide).</p>
<p class="meo">🧠 "Use case–driven" = use cases drive everything: they are the requirements, they select what each iteration builds, and they become the test cases. COMET (Chapter 5) keeps this idea.</p>
<div class="callout">➕ <strong>Beyond the slide — who made it.</strong> The "three amigos" Jacobson, Booch and Rumbaugh unified their methods into UML (1997) and this process at Rational Software (bought by IBM in 2003). Tools like Rational Rose came from the same company — that is why old FPTU syllabi mention "Rational".</div>`,
        `<p class="y-chinh">🎯 <strong>USDP</strong> (Jacobson và cộng sự, 1999), còn gọi <strong>Rational Unified Process (RUP)</strong>, là quy trình <strong>hướng use case (use case–driven)</strong> dùng UML; nó <strong>lặp (iterative)</strong>, có <strong>năm workflow lõi</strong> (core workflow — luồng công việc) và <strong>bốn pha</strong>.</p>
<table>
<thead><tr><th>Thuật ngữ</th><th>Định nghĩa trên slide</th><th>Nói dễ hiểu</th><th>Ví dụ LabFlow</th></tr></thead>
<tbody>
<tr><td>artifact — sản phẩm/tạo tác</td><td>một mẩu thông tin được quy trình tạo ra, sửa đổi hoặc sử dụng</td><td>mọi đầu ra đem nộp được</td><td>use case diagram, class diagram, mã nguồn, kế hoạch kiểm thử</td></tr>
<tr><td>workflow — luồng công việc</td><td>chuỗi hoạt động cho ra một kết quả có giá trị quan sát được</td><td>một <em>loại</em> việc, làm lại ở mọi vòng lặp</td><td>"analysis": vẽ class diagram và sequence diagram phân tích</td></tr>
<tr><td>phase — pha</td><td>khoảng thời gian giữa hai cột mốc lớn, trong đó đạt mục tiêu, hoàn tất artifact và quyết định có đi tiếp không</td><td>một <em>khoảng</em> trên lịch</td><td>"elaboration: tuần 3–6"</td></tr>
</tbody>
</table>
<p>Ý then chốt: <strong>workflow và phase là hai trục khác nhau</strong>. Workflow nói <em>loại</em> việc gì (yêu cầu, phân tích, thiết kế, cài đặt, kiểm thử); phase nói <em>lúc nào</em> trong dự án (khởi đầu, chi tiết hoá, xây dựng, chuyển giao). Pha nào cũng làm một ít mọi workflow — chỉ khác lượng (slide sau).</p>
<p class="meo">🧠 "Hướng use case" = use case dẫn dắt mọi thứ: chúng là yêu cầu, chúng quyết định mỗi vòng lặp xây gì, và chúng biến thành ca kiểm thử (test case). COMET (Chương 5) giữ nguyên ý này.</p>
<div class="callout">➕ <strong>Mở rộng ngoài slide — ai làm ra nó.</strong> "Ba chàng lính ngự lâm" Jacobson, Booch và Rumbaugh hợp nhất phương pháp của họ thành UML (1997) và thành quy trình này tại Rational Software (IBM mua lại năm 2003). Công cụ như Rational Rose cũng từ công ty đó — vì vậy đề cương cũ của FPTU nhắc tới "Rational".</div>`],
      [15, '1.7 Unified Software Development Process',
        `<p class="y-chinh">🎯 Gomaa Figure 3.8 (from Jacobson et al.): a grid with the five core workflows as rows, the four phases as columns and the iterations along the bottom; the height of each grey "hill" shows how much effort that workflow takes at that moment.</p>
<p>Reading the hills of the figure (● = little, ●●● = a lot):</p>
<table>
<thead><tr><th>Workflow</th><th>Inception</th><th>Elaboration</th><th>Construction</th><th>Transition</th></tr></thead>
<tbody>
<tr><td>Requirements</td><td>●● rising</td><td>●●● peak</td><td>● fading</td><td>—</td></tr>
<tr><td>Analysis</td><td>●</td><td>●●● peak</td><td>●</td><td>—</td></tr>
<tr><td>Design</td><td>●</td><td>●● rising</td><td>●●● peak early</td><td>●</td></tr>
<tr><td>Implementation</td><td>●</td><td>●●</td><td>●●● the bulk</td><td>●</td></tr>
<tr><td>Test</td><td>—</td><td>●● per iteration</td><td>●● per iteration</td><td>●●● peak</td></tr>
</tbody>
</table>
<p><strong>Three things to notice:</strong> (1) every workflow runs across several phases — this is <em>not</em> a waterfall; (2) requirements and analysis are heaviest in elaboration, implementation in construction, testing peaks in transition; (3) the bottom row shows <em>iterations</em> #1…#n — each phase contains one or more iterations, and Gomaa notes that a phase iteration corresponds to a <strong>cycle of the spiral model</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e13433553d6fd58bcbd634835a29baa4a47cd051.svg" alt="The four USDP phases in time and the milestone that closes each one (milestone names: Kruchten, beyond the slide)" loading="lazy" /><p class="chu-thich">🧩 The four USDP phases in time and the milestone that closes each one (milestone names: Kruchten, beyond the slide)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slides 15 and 17 — the four USDP/RUP phases in time, each ending with a milestone (milestone names from Kruchten, beyond the slide)
start
partition "Inception" {
  :seed idea, key use cases,\\nbusiness case, main risks;
}
:&lt;&lt;milestone&gt;&gt; Lifecycle Objectives;
partition "Elaboration" {
  :most use cases, **architecture defined**\\nand proven by an executable baseline;
}
:&lt;&lt;milestone&gt;&gt; Lifecycle Architecture;
partition "Construction" {
  :build the rest, iteration by iteration;
}
:&lt;&lt;milestone&gt;&gt; Initial Operational Capability (beta);
partition "Transition" {
  :hand over to users: beta test,\\ntraining, fixes;
}
:&lt;&lt;milestone&gt;&gt; Product Release;
stop
@enduml</code></pre></details>
<div class="pitfall">"In which phase is the software architecture defined?" → <strong>Elaboration</strong> (slide 17), even though the design <em>hill</em> peaks around the start of construction. Don't answer "Construction because design effort is highest there".</div>`,
        `<p class="y-chinh">🎯 Hình 3.8 của Gomaa (lấy từ Jacobson và cộng sự): một lưới với năm workflow lõi là các hàng, bốn pha là các cột và các vòng lặp (iteration) chạy dưới đáy; độ cao của mỗi "ngọn đồi" xám cho biết workflow đó tốn bao nhiêu công sức ở thời điểm ấy.</p>
<p>Đọc các ngọn đồi trên hình (● = ít, ●●● = nhiều):</p>
<table>
<thead><tr><th>Workflow</th><th>Inception (khởi đầu)</th><th>Elaboration (chi tiết hoá)</th><th>Construction (xây dựng)</th><th>Transition (chuyển giao)</th></tr></thead>
<tbody>
<tr><td>Requirements — yêu cầu</td><td>●● đang lên</td><td>●●● đỉnh</td><td>● giảm dần</td><td>—</td></tr>
<tr><td>Analysis — phân tích</td><td>●</td><td>●●● đỉnh</td><td>●</td><td>—</td></tr>
<tr><td>Design — thiết kế</td><td>●</td><td>●● đang lên</td><td>●●● đỉnh ở đầu pha</td><td>●</td></tr>
<tr><td>Implementation — cài đặt</td><td>●</td><td>●●</td><td>●●● phần lớn</td><td>●</td></tr>
<tr><td>Test — kiểm thử</td><td>—</td><td>●● mỗi vòng lặp</td><td>●● mỗi vòng lặp</td><td>●●● đỉnh</td></tr>
</tbody>
</table>
<p><strong>Ba điều cần để ý:</strong> (1) workflow nào cũng chạy qua nhiều pha — đây <em>không</em> phải thác nước; (2) yêu cầu và phân tích nặng nhất ở elaboration, cài đặt ở construction, kiểm thử lên đỉnh ở transition; (3) hàng dưới cùng là các <em>vòng lặp</em> #1…#n — mỗi pha chứa một hoặc nhiều vòng lặp, và Gomaa ghi rằng một vòng lặp của pha tương ứng một <strong>vòng của mô hình xoắn ốc</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e13433553d6fd58bcbd634835a29baa4a47cd051.svg" alt="Bốn pha của USDP theo thời gian và cột mốc khép lại mỗi pha (tên cột mốc theo Kruchten, ngoài slide)" loading="lazy" /><p class="chu-thich">🧩 Bốn pha của USDP theo thời gian và cột mốc khép lại mỗi pha (tên cột mốc theo Kruchten, ngoài slide)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 15 và 17 — bốn pha của USDP/RUP theo thời gian, mỗi pha kết thúc bằng một cột mốc (tên cột mốc theo Kruchten, ngoài slide)
start
partition "Inception" {
  :seed idea, key use cases,\\nbusiness case, main risks;
}
:&lt;&lt;milestone&gt;&gt; Lifecycle Objectives;
partition "Elaboration" {
  :most use cases, **architecture defined**\\nand proven by an executable baseline;
}
:&lt;&lt;milestone&gt;&gt; Lifecycle Architecture;
partition "Construction" {
  :build the rest, iteration by iteration;
}
:&lt;&lt;milestone&gt;&gt; Initial Operational Capability (beta);
partition "Transition" {
  :hand over to users: beta test,\\ntraining, fixes;
}
:&lt;&lt;milestone&gt;&gt; Product Release;
stop
@enduml</code></pre></details>
<div class="pitfall">"Kiến trúc phần mềm được xác định ở pha nào?" → <strong>Elaboration</strong> (slide 17), dù <em>ngọn đồi</em> thiết kế cao nhất quanh đầu pha construction. Đừng trả lời "Construction vì ở đó công thiết kế nhiều nhất".</div>`],
      [16, '1.7 Unified Software Development Process',
        `<p class="y-chinh">🎯 Each cycle goes through all four phases; each of the five workflows has one main product: requirements → <strong>use case model</strong>; analysis → <strong>analysis model</strong>; design → <strong>design model and deployment model</strong>; implementation → <strong>implementation model</strong>; test → <strong>test model</strong>.</p>
<table>
<thead><tr><th>Workflow</th><th>Product (model)</th><th>What is inside, concretely</th><th>Where you meet it in SWD392</th></tr></thead>
<tbody>
<tr><td>Requirements</td><td>use case model</td><td>actors, use cases, use case descriptions</td><td>Ch.6, Assignment 01</td></tr>
<tr><td>Analysis</td><td>analysis model</td><td>analysis classes (entity/boundary/control), sequence/communication diagrams, statecharts</td><td>Ch.7–11, Assignment 02</td></tr>
<tr><td>Design</td><td>design model + deployment model</td><td>subsystems, design classes with operations, patterns; nodes and what runs on them</td><td>Ch.12–18, Assignment 03</td></tr>
<tr><td>Implementation</td><td>implementation model</td><td>source code, components, build files</td><td>your Spring Boot + React code</td></tr>
<tr><td>Test</td><td>test model</td><td>test cases and test procedures</td><td>integration/system tests of the project</td></tr>
</tbody>
</table>
<p>Notice design is the only workflow with <strong>two</strong> products — a favourite detail for a trick option. The deployment model is the deployment diagram you saw in lesson 1.C (nodes = machines, connections = networks).</p>
<p class="meo">🧠 Say it as a chain: <em>use case → analysis → design + deployment → implementation → test</em> — the same chain as the SWD392 assignments.</p>`,
        `<p class="y-chinh">🎯 Mỗi chu kỳ đi qua cả bốn pha; mỗi workflow trong năm workflow có một sản phẩm chính: requirements → <strong>use case model</strong> (mô hình use case); analysis → <strong>analysis model</strong> (mô hình phân tích); design → <strong>design model và deployment model</strong> (mô hình thiết kế và mô hình triển khai); implementation → <strong>implementation model</strong> (mô hình cài đặt); test → <strong>test model</strong> (mô hình kiểm thử).</p>
<table>
<thead><tr><th>Workflow</th><th>Sản phẩm (mô hình)</th><th>Cụ thể bên trong có gì</th><th>Gặp ở đâu trong SWD392</th></tr></thead>
<tbody>
<tr><td>Requirements</td><td>use case model</td><td>actor, use case, đặc tả use case</td><td>Ch.6, Assignment 01</td></tr>
<tr><td>Analysis</td><td>analysis model</td><td>lớp phân tích (entity/boundary/control), sequence/communication diagram, statechart</td><td>Ch.7–11, Assignment 02</td></tr>
<tr><td>Design</td><td>design model + deployment model</td><td>subsystem, lớp thiết kế có thao tác, pattern; các nút máy và thứ chạy trên đó</td><td>Ch.12–18, Assignment 03</td></tr>
<tr><td>Implementation</td><td>implementation model</td><td>mã nguồn, component, file build</td><td>code Spring Boot + React của bạn</td></tr>
<tr><td>Test</td><td>test model</td><td>ca kiểm thử (test case) và thủ tục kiểm thử</td><td>kiểm thử tích hợp/hệ thống của đồ án</td></tr>
</tbody>
</table>
<p>Để ý design là workflow duy nhất có <strong>hai</strong> sản phẩm — chi tiết rất hay bị cài vào phương án nhiễu. Deployment model chính là deployment diagram bạn đã gặp ở bài 1.C (nút = máy, đường nối = mạng).</p>
<p class="meo">🧠 Đọc thành một chuỗi: <em>use case → analysis → design + deployment → implementation → test</em> — cũng chính là chuỗi các Assignment của SWD392.</p>`],
      [17, '1.7 Unified Software Development Process',
        `<p class="y-chinh">🎯 Like the spiral, the USDP is <strong>risk-driven</strong>; its four phases are <strong>Inception</strong> (the seed idea is developed enough to justify elaboration), <strong>Elaboration</strong> (the software architecture is defined), <strong>Construction</strong> (the software is built until ready for release), <strong>Transition</strong> (the software is turned over to the user community).</p>
<table>
<thead><tr><th>Phase</th><th>Goal (slide)</th><th>Typical output</th><th>LabFlow (illustration)</th></tr></thead>
<tbody>
<tr><td>Inception</td><td>seed idea → enough to justify going on</td><td>vision, key use cases, main risks</td><td>proposal: "reserve lab equipment, waitlist, AI assistant"; supervisor says go</td></tr>
<tr><td>Elaboration</td><td><strong>architecture defined</strong></td><td>most use cases, architecture proven by running code</td><td>layered Spring Boot + React + PostgreSQL, one use case working end to end</td></tr>
<tr><td>Construction</td><td>build until ready to release</td><td>the remaining features, iteration by iteration</td><td>sprints 3–8: all use cases, tests</td></tr>
<tr><td>Transition</td><td>turn it over to users</td><td>beta, fixes, training, handover</td><td>lab trial with real students, final report, defense</td></tr>
</tbody>
</table>
<p>Why "risk-driven"? Elaboration is placed early exactly to attack the biggest technical risk — the architecture — while changes are still cheap. If the architecture fails, you find out in week 5, not week 14.</p>
<p class="meo">🧠 Order: <strong>I-E-C-T</strong> — "I Eat Cold Toast". And each phase ends at a milestone where you decide go / no-go (slide 14's definition).</p>
<div class="pitfall">Traps: (a) USDP phases are <em>not</em> the same as waterfall phases — "Construction" is not only coding, it still contains some requirements and design; (b) "Transition" is handover to users, not "moving to a new technology"; (c) both spiral and USDP are risk-driven.</div>`,
        `<p class="y-chinh">🎯 Giống xoắn ốc, USDP <strong>hướng rủi ro</strong>; bốn pha của nó là <strong>Inception — khởi đầu</strong> (ý tưởng hạt giống được phát triển đủ để biện minh cho việc vào elaboration), <strong>Elaboration — chi tiết hoá</strong> (kiến trúc phần mềm được xác định), <strong>Construction — xây dựng</strong> (phần mềm được xây tới mức sẵn sàng phát hành), <strong>Transition — chuyển giao</strong> (phần mềm được giao cho cộng đồng người dùng).</p>
<table>
<thead><tr><th>Pha</th><th>Mục tiêu (slide)</th><th>Đầu ra điển hình</th><th>LabFlow (minh hoạ)</th></tr></thead>
<tbody>
<tr><td>Inception</td><td>ý tưởng → đủ để quyết định đi tiếp</td><td>tầm nhìn, use case chính, rủi ro chính</td><td>đề xuất: "đặt thiết bị lab, danh sách chờ, trợ lý AI"; thầy đồng ý</td></tr>
<tr><td>Elaboration</td><td><strong>xác định kiến trúc</strong></td><td>phần lớn use case, kiến trúc chứng minh bằng code chạy được</td><td>Spring Boot phân tầng + React + PostgreSQL, một use case chạy trọn từ đầu tới cuối</td></tr>
<tr><td>Construction</td><td>xây tới khi sẵn sàng phát hành</td><td>các tính năng còn lại, từng vòng lặp</td><td>sprint 3–8: đủ use case, có test</td></tr>
<tr><td>Transition</td><td>giao cho người dùng</td><td>bản beta, sửa lỗi, đào tạo, bàn giao</td><td>chạy thử ở lab với sinh viên thật, báo cáo cuối, bảo vệ</td></tr>
</tbody>
</table>
<p>Sao lại "hướng rủi ro"? Elaboration đặt sớm chính là để đánh vào rủi ro kỹ thuật lớn nhất — kiến trúc — khi thay đổi còn rẻ. Nếu kiến trúc hỏng, bạn biết ở tuần 5, không phải tuần 14.</p>
<p class="meo">🧠 Thứ tự: <strong>I-E-C-T</strong> — "Ít Em Còn Thức". Và mỗi pha kết thúc ở một cột mốc để quyết định đi tiếp hay dừng (định nghĩa ở slide 14).</p>
<div class="pitfall">Bẫy: (a) pha của USDP <em>không</em> giống pha của thác nước — "Construction" không chỉ là viết code, nó vẫn có một ít yêu cầu và thiết kế; (b) "Transition" là bàn giao cho người dùng, không phải "chuyển sang công nghệ mới"; (c) cả xoắn ốc lẫn USDP đều hướng rủi ro.</div>`],
      [18, '2. Design Verification and Validation',
        `<p class="y-chinh">🎯 <strong>Validation</strong> = "build the <strong>right system</strong>": the system conforms to the user's needs. <strong>Verification</strong> = "build the <strong>system right</strong>": each phase is built according to the specification from the previous phase (Boehm 1981).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/45e94cd521fa1111613d3558f170425583d402df.svg" alt="Verification compares each product with the one before it; validation compares the final system with what users really need" loading="lazy" /><p class="chu-thich">🧩 Verification compares each product with the one before it; validation compares the final system with what users really need</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 18 — verification checks each phase against the previous one; validation checks the product against the user's real needs
actor User
rectangle "User's real needs" as N
rectangle "SRS (requirements)" as R
rectangle "Design" as D
rectangle "Code" as C
rectangle "Running system" as S
User -right- N
N -down-&gt; R : written down as
R -down-&gt; D
D -down-&gt; C
C -down-&gt; S
D .up.&gt; R : verification:\\nconforms to SRS?
C .up.&gt; D : verification:\\nconforms to design?
S .up.&gt; N : validation:\\nis it what users need?
note right of D
  verification = "building the system right"
  validation = "building the right system"
end note
@enduml</code></pre></details>
<table>
<thead><tr><th></th><th>Verification</th><th>Validation</th></tr></thead>
<tbody>
<tr><td>Question</td><td>did we build it right?</td><td>did we build the right thing?</td></tr>
<tr><td>Compared against</td><td>the previous phase's specification (SRS, design)</td><td>the users' real needs</td></tr>
<tr><td>Techniques</td><td>reviews, inspections, requirements tracing, unit/integration tests</td><td>prototypes shown to users, acceptance testing, demos</td></tr>
<tr><td>LabFlow example</td><td>the ReservationService follows the sequence diagram of Report 4</td><td>lab managers confirm the waitlist rule is what they actually want</td></tr>
</tbody>
</table>
<p>A system can pass verification and fail validation: every phase faithfully follows the SRS, but the SRS itself was wrong — a perfect implementation of the wrong idea.</p>
<p class="meo">🧠 Val<strong>i</strong>dation — "is it what the <strong>I</strong>n-house users want?". Veri<strong>f</strong>ication — "does it <strong>f</strong>ollow the spec?".</p>
<div class="pitfall">This pair is almost guaranteed on the theory exam, and the options are the two English phrases. "Building the right system" = <strong>validation</strong>; "building the system right" = <strong>verification</strong>. Read the word order slowly.</div>`,
        `<p class="y-chinh">🎯 <strong>Thẩm định (validation)</strong> = "làm <strong>đúng hệ thống cần làm</strong>" (build the right system): hệ thống khớp nhu cầu người dùng. <strong>Xác minh (verification)</strong> = "làm <strong>hệ thống cho đúng</strong>" (build the system right): mỗi pha được làm đúng theo đặc tả của pha trước (Boehm 1981).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/45e94cd521fa1111613d3558f170425583d402df.svg" alt="Xác minh so mỗi sản phẩm với sản phẩm trước nó; thẩm định so hệ thống cuối cùng với nhu cầu thật của người dùng" loading="lazy" /><p class="chu-thich">🧩 Xác minh so mỗi sản phẩm với sản phẩm trước nó; thẩm định so hệ thống cuối cùng với nhu cầu thật của người dùng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 18 — xác minh (verification) so mỗi pha với pha trước; thẩm định (validation) so sản phẩm với nhu cầu thật của người dùng
actor User
rectangle "User's real needs" as N
rectangle "SRS (requirements)" as R
rectangle "Design" as D
rectangle "Code" as C
rectangle "Running system" as S
User -right- N
N -down-&gt; R : written down as
R -down-&gt; D
D -down-&gt; C
C -down-&gt; S
D .up.&gt; R : verification:\\nconforms to SRS?
C .up.&gt; D : verification:\\nconforms to design?
S .up.&gt; N : validation:\\nis it what users need?
note right of D
  verification = "building the system right"
  validation = "building the right system"
end note
@enduml</code></pre></details>
<table>
<thead><tr><th></th><th>Verification — xác minh</th><th>Validation — thẩm định</th></tr></thead>
<tbody>
<tr><td>Câu hỏi</td><td>làm có đúng cách không?</td><td>có làm đúng thứ cần làm không?</td></tr>
<tr><td>So với</td><td>đặc tả của pha trước (SRS, thiết kế)</td><td>nhu cầu thật của người dùng</td></tr>
<tr><td>Kỹ thuật</td><td>rà soát (review), thanh tra (inspection), truy vết yêu cầu, kiểm thử đơn vị/tích hợp</td><td>nguyên mẫu đưa người dùng xem, kiểm thử nghiệm thu, demo</td></tr>
<tr><td>Ví dụ LabFlow</td><td>ReservationService làm đúng theo sequence diagram trong Report 4</td><td>quản lý lab xác nhận luật danh sách chờ đúng là thứ họ cần</td></tr>
</tbody>
</table>
<p>Một hệ thống có thể qua xác minh mà trượt thẩm định: mọi pha trung thành với SRS, nhưng chính SRS đã sai — cài đặt hoàn hảo một ý tưởng sai.</p>
<p class="meo">🧠 Validation — "có phải thứ người dùng muốn?" (nhìn ra <em>ngoài</em>, về người dùng). Verification — "có theo đúng đặc tả?" (nhìn <em>vào trong</em>, về tài liệu).</p>
<div class="pitfall">Cặp này gần như chắc chắn có trong bài lý thuyết, và các phương án chính là hai cụm tiếng Anh. "Building the right system" = <strong>validation</strong>; "building the system right" = <strong>verification</strong>. Đọc chậm thứ tự từ.</div>`],
      [19, '2.1 Software Quality Assurance',
        `<p class="y-chinh">🎯 <strong>Software quality assurance (SQA)</strong> is the set of activities that ensure the quality of the software product; verification and validation are its important goals; throwaway prototyping helps validation (before the system is built), technical reviews help both, and verification ensures the design conforms to the SRS.</p>
<ul>
<li><strong>Throwaway prototyping → validation</strong>, early: users check the idea before the team builds it (slide 8).</li>
<li><strong>Software technical reviews</strong> (walkthroughs, inspections): a group reads a design or code and hunts for defects — useful for verification and validation.</li>
<li><strong>Requirements tracing</strong> (in the book, not on the slide): link each requirement to the design elements and tests that satisfy it, so nothing is forgotten — a verification tool.</li>
</ul>
<p>SQA is broader than testing: testing finds defects in something that exists; SQA also prevents defects (standards, reviews, checklists) before anything runs.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): a pull request on GitHub that a teammate must approve is a technical review; a table "UC05 Reserve Equipment → ReservationService.reserve() → ReservationServiceTest" in Report 4 is requirements tracing.</div>`,
        `<p class="y-chinh">🎯 <strong>Đảm bảo chất lượng phần mềm (software quality assurance — SQA)</strong> là tập hoạt động nhằm bảo đảm chất lượng sản phẩm phần mềm; xác minh và thẩm định là mục tiêu quan trọng của nó; nguyên mẫu bỏ đi giúp thẩm định (trước khi xây hệ thống), rà soát kỹ thuật giúp cả hai, và xác minh bảo đảm thiết kế khớp SRS.</p>
<ul>
<li><strong>Nguyên mẫu bỏ đi → thẩm định</strong>, từ sớm: người dùng kiểm ý tưởng trước khi đội xây (slide 8).</li>
<li><strong>Rà soát kỹ thuật (software technical review)</strong> (walkthrough — đọc lướt cùng nhau, inspection — thanh tra): một nhóm đọc thiết kế hay code để săn lỗi — dùng được cho cả xác minh lẫn thẩm định.</li>
<li><strong>Truy vết yêu cầu (requirements tracing)</strong> (có trong sách, không có trên slide): nối mỗi yêu cầu với phần thiết kế và ca kiểm thử đáp ứng nó, để không sót gì — một công cụ xác minh.</li>
</ul>
<p>SQA rộng hơn kiểm thử: kiểm thử tìm lỗi trong thứ đã có; SQA còn phòng lỗi (chuẩn viết, rà soát, danh sách kiểm) trước khi có gì chạy.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): một pull request trên GitHub mà bạn cùng nhóm phải duyệt là rà soát kỹ thuật; bảng "UC05 Reserve Equipment → ReservationService.reserve() → ReservationServiceTest" trong Report 4 là truy vết yêu cầu.</div>`],
      [20, '2.2 Performance Analysis of Software Designs',
        `<p class="y-chinh">🎯 Analyse the <strong>performance</strong> of a design <strong>before implementation</strong> to estimate whether it meets its goals; problems found early can still be fixed; approaches: <strong>queuing models, simulation models, Petri nets, real-time scheduling theory</strong>.</p>
<table>
<thead><tr><th>Approach</th><th>Idea in one line</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td>Queuing model</td><td>requests arrive, wait in a queue, get served — compute waiting time from arrival and service rates</td><td>servers, web APIs</td></tr>
<tr><td>Simulation model</td><td>a program imitates the system with random inputs and measures it</td><td>complex systems where formulas are too hard</td></tr>
<tr><td>Petri net</td><td>a graph of places and transitions with tokens, for concurrent behaviour</td><td>concurrent designs, deadlock analysis</td></tr>
<tr><td>Real-time scheduling theory</td><td>proves that periodic tasks always meet their deadlines</td><td>embedded / real-time systems (Ch.18)</td></tr>
</tbody>
</table>
<p>➕ A queuing intuition you can use in interviews: if requests arrive almost as fast as the server can handle them, the queue — and the response time — explodes. At 50% load waiting is short; near 100% it grows without limit. That is why architects keep headroom.</p>
<p class="nhan">You only need to recognise the four names for the exam; the book does not go deeper here.</p>`,
        `<p class="y-chinh">🎯 Phân tích <strong>hiệu năng (performance)</strong> của thiết kế <strong>trước khi cài đặt</strong> để ước lượng nó có đạt mục tiêu không; phát hiện sớm thì còn sửa được; các cách: <strong>mô hình hàng đợi (queuing), mô hình mô phỏng (simulation), mạng Petri (Petri net), lý thuyết lập lịch thời gian thực (real-time scheduling theory)</strong>.</p>
<table>
<thead><tr><th>Cách</th><th>Ý tưởng một dòng</th><th>Hay dùng cho</th></tr></thead>
<tbody>
<tr><td>Mô hình hàng đợi</td><td>yêu cầu tới, xếp hàng, được phục vụ — tính thời gian chờ từ tốc độ đến và tốc độ phục vụ</td><td>máy chủ, web API</td></tr>
<tr><td>Mô hình mô phỏng</td><td>một chương trình bắt chước hệ thống với đầu vào ngẫu nhiên rồi đo</td><td>hệ thống phức tạp, công thức khó</td></tr>
<tr><td>Mạng Petri</td><td>đồ thị gồm vị trí (place) và chuyển tiếp (transition) với thẻ (token), cho hành vi đồng thời</td><td>thiết kế đồng thời, phân tích bế tắc (deadlock)</td></tr>
<tr><td>Lập lịch thời gian thực</td><td>chứng minh các tác vụ định kỳ luôn kịp hạn chót</td><td>hệ nhúng / thời gian thực (Ch.18)</td></tr>
</tbody>
</table>
<p>➕ Một trực giác về hàng đợi dùng được khi phỏng vấn: nếu yêu cầu tới gần bằng tốc độ máy chủ xử lý, hàng đợi — và thời gian phản hồi — bùng nổ. Tải 50% thì chờ ít; gần 100% thì chờ tăng không giới hạn. Vì vậy kiến trúc sư luôn chừa khoảng dư.</p>
<p class="nhan">Đi thi bạn chỉ cần nhận ra bốn cái tên; sách không đi sâu hơn ở đây.</p>`],
      [21, '3. Software life cycle activities',
        `<p class="y-chinh">🎯 Whatever model you choose, the same activities happen. <strong>Requirements analysis and specification</strong>: identify and analyse the users' requirements and write them in an SRS — a complete description of the system's <strong>external behaviour</strong>, not how it works inside. <strong>Architectural design</strong>: structure the system into components and define the <strong>interfaces</strong> between them.</p>
<p><strong>SRS = WHAT, not HOW.</strong> "A member can reserve a free slot and receives an email confirmation" is a requirement. "ReservationService calls JavaMailSender" is design — it must not be in the SRS. Gomaa calls the SRS an <em>external specification</em>.</p>
<p><strong>Architecture = the big boxes and how they connect.</strong> The definition (Bass, Clements, Kazman; Shaw, Garlan) separates the overall structure — components and interconnections — from the internal details of each component. Gomaa adds two names: architecture is <em>programming-in-the-large</em>, detailed design is <em>programming-in-the-small</em>.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): SEP490 Report 3 (SRS) holds the use cases and the state machine of a reservation — external behaviour. Report 4 (SDD) holds the architecture: React client, Spring Boot backend split into controller/service/repository, PostgreSQL, and the REST interfaces between them.</div>
<div class="pitfall">"The SRS describes how the system works internally" — <strong>false</strong>. And the architecture defines interfaces <em>between</em> components; algorithms <em>inside</em> a component belong to detailed design.</div>`,
        `<p class="y-chinh">🎯 Chọn mô hình nào thì các hoạt động vẫn như nhau. <strong>Phân tích và đặc tả yêu cầu</strong>: xác định, phân tích yêu cầu người dùng và viết vào SRS — mô tả đầy đủ <strong>hành vi bên ngoài</strong> của hệ thống, không nói bên trong nó chạy ra sao. <strong>Thiết kế kiến trúc</strong>: chia hệ thống thành các thành phần (component) và định nghĩa <strong>interface</strong> (giao diện) giữa chúng.</p>
<p><strong>SRS = CÁI GÌ, không phải THẾ NÀO.</strong> "Thành viên đặt được ca còn trống và nhận email xác nhận" là yêu cầu. "ReservationService gọi JavaMailSender" là thiết kế — không được nằm trong SRS. Gomaa gọi SRS là <em>đặc tả bên ngoài (external specification)</em>.</p>
<p><strong>Kiến trúc = các hộp lớn và cách chúng nối nhau.</strong> Định nghĩa (Bass, Clements, Kazman; Shaw, Garlan) tách cấu trúc tổng thể — thành phần và kết nối — khỏi chi tiết bên trong mỗi thành phần. Gomaa thêm hai tên gọi: kiến trúc là <em>lập trình tầm lớn (programming-in-the-large)</em>, thiết kế chi tiết là <em>lập trình tầm nhỏ (programming-in-the-small)</em>.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): Report 3 (SRS) của SEP490 chứa use case và máy trạng thái của lượt đặt — hành vi bên ngoài. Report 4 (SDD) chứa kiến trúc: client React, backend Spring Boot chia controller/service/repository, PostgreSQL, và các interface REST giữa chúng.</div>
<div class="pitfall">"SRS mô tả bên trong hệ thống chạy thế nào" — <strong>sai</strong>. Và kiến trúc định nghĩa interface <em>giữa</em> các thành phần; thuật toán <em>bên trong</em> một thành phần thuộc thiết kế chi tiết.</div>`],
      [22, '3. Software life cycle activities',
        `<p class="y-chinh">🎯 <strong>Detailed design</strong>: define the algorithmic details of each component and its internal data structures. <strong>Coding</strong>: code each component in the project's programming language.</p>
<p>The book adds two details worth knowing: detailed design is often written in a <strong>Program Design Language (PDL)</strong> — also called Structured English or <em>pseudocode</em>; and coding follows the project's <strong>coding and documentation standards</strong>.</p>
<pre><code class="language-plaintext">Detailed design of ReservationService.reserve (pseudocode / PDL)
  IF slot is not free THEN
      add member to waitlist of slot
      RETURN "waitlisted"
  ENDIF
  create reservation with status PENDING
  send notification to lab manager
  RETURN "pending approval"</code></pre>
<p>From here the coder translates line by line into Java. The four activities of slides 21–22 are exactly the four waterfall "down" steps of slide 4; the four testing levels of slides 23–24 are the "up" steps.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): coding standards = the team's Checkstyle/ESLint rules and the naming rules (controller ends with <code>Controller</code>, DTO ends with <code>Dto</code>). Agreeing on them in sprint 1 saves hours of review later.</div>`,
        `<p class="y-chinh">🎯 <strong>Thiết kế chi tiết (detailed design)</strong>: định nghĩa chi tiết thuật toán của từng thành phần và cấu trúc dữ liệu bên trong. <strong>Viết code (coding)</strong>: cài từng thành phần bằng ngôn ngữ lập trình dự án đã chọn.</p>
<p>Sách thêm hai chi tiết đáng biết: thiết kế chi tiết hay được viết bằng <strong>ngôn ngữ thiết kế chương trình (Program Design Language — PDL)</strong>, còn gọi Structured English hay <em>mã giả (pseudocode)</em>; và việc viết code theo <strong>chuẩn viết code và chuẩn tài liệu</strong> của dự án.</p>
<pre><code class="language-plaintext">Thiết kế chi tiết ReservationService.reserve (mã giả / PDL)
  NẾU ca không còn trống THÌ
      thêm thành viên vào danh sách chờ của ca
      TRẢ VỀ "waitlisted"
  HẾT NẾU
  tạo lượt đặt trạng thái PENDING
  gửi thông báo cho quản lý lab
  TRẢ VỀ "pending approval"</code></pre>
<p>Từ đây người viết code dịch từng dòng sang Java. Bốn hoạt động của slide 21–22 chính là bốn bậc "đi xuống" của thác nước ở slide 4; bốn mức kiểm thử của slide 23–24 là các bậc "đi lên".</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): chuẩn viết code = luật Checkstyle/ESLint của nhóm và quy tắc đặt tên (controller kết thúc bằng <code>Controller</code>, DTO kết thúc bằng <code>Dto</code>). Thống nhất ngay sprint 1 thì tiết kiệm hàng giờ review sau này.</div>`],
      [23, '4. Software testing',
        `<p class="y-chinh">🎯 The <strong>V-model</strong>: the left arm goes down through specifications (requirement specification → high level design → detail design → program specification → coding) — <em>verification</em>; the right arm goes up through testing (unit → integration → system → user acceptance) — <em>validation</em>; each level on the right tests the specification opposite it.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/7c8e249ea66e14d78a237f19bcb9b439b567374e.svg" alt="The V-model redrawn from the slide: each dashed arrow says which test level checks which specification" loading="lazy" /><p class="chu-thich">🧩 The V-model redrawn from the slide: each dashed arrow says which test level checks which specification</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 23 — the V-model: going down the left = verification of each specification, going up the right = testing; each dashed arrow pairs a specification with the test level that checks it
rectangle "Requirement\\nSpecification" as RS
rectangle "High Level\\nDesign" as HL
rectangle "Detail\\nDesign" as DD
rectangle "Program\\nSpecification" as PS
rectangle "Coding" as C
rectangle "Unit\\nTesting" as UT
rectangle "Integration\\nTesting" as IT
rectangle "System\\nTesting" as ST
rectangle "User Acceptance\\nTesting" as UAT
RS -down-&gt; HL
HL -down-&gt; DD
DD -down-&gt; PS
PS -down-&gt; C
C -up-&gt; UT
UT -up-&gt; IT
IT -up-&gt; ST
ST -up-&gt; UAT
RS .right.&gt; UAT : tested by
HL .right.&gt; ST : tested by
DD .right.&gt; IT : tested by
PS .right.&gt; UT : tested by
@enduml</code></pre></details>
<table>
<thead><tr><th>Left (specification)</th><th>tested by (right)</th><th>Who / what</th></tr></thead>
<tbody>
<tr><td>Requirement Specification</td><td>User Acceptance Testing</td><td>the users, against their needs</td></tr>
<tr><td>High Level Design</td><td>System Testing</td><td>an independent test team, against the SRS</td></tr>
<tr><td>Detail Design</td><td>Integration Testing</td><td>developers, the interfaces between components</td></tr>
<tr><td>Program Specification</td><td>Unit Testing</td><td>developers, one component at a time</td></tr>
</tbody>
</table>
<p>The V-model is the waterfall bent in the middle; its value is that you <strong>write each test plan while writing the specification opposite it</strong> — acceptance tests are designed together with the requirements, long before any code.</p>
<div class="pitfall">The slide labels the whole left arm "Verification" and the right arm "Validation". Strictly, in Gomaa's words, unit and integration testing are also verification (does the code match its design?); only acceptance testing against the users' needs is pure validation. If an exam option says "unit testing is validation", be careful.</div>`,
        `<p class="y-chinh">🎯 <strong>Mô hình chữ V (V-model)</strong>: nhánh trái đi xuống qua các đặc tả (đặc tả yêu cầu → thiết kế mức cao → thiết kế chi tiết → đặc tả chương trình → viết code) — <em>xác minh</em>; nhánh phải đi lên qua kiểm thử (đơn vị → tích hợp → hệ thống → nghiệm thu người dùng) — <em>thẩm định</em>; mỗi mức bên phải kiểm đặc tả đối diện nó.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/7c8e249ea66e14d78a237f19bcb9b439b567374e.svg" alt="Mô hình chữ V vẽ lại từ slide: mỗi mũi tên đứt cho biết mức kiểm thử nào kiểm đặc tả nào" loading="lazy" /><p class="chu-thich">🧩 Mô hình chữ V vẽ lại từ slide: mỗi mũi tên đứt cho biết mức kiểm thử nào kiểm đặc tả nào</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 23 — mô hình chữ V: đi xuống nhánh trái là đặc tả, đi lên nhánh phải là kiểm thử; mỗi mũi tên đứt ghép một đặc tả với mức kiểm thử kiểm nó
rectangle "Requirement\\nSpecification" as RS
rectangle "High Level\\nDesign" as HL
rectangle "Detail\\nDesign" as DD
rectangle "Program\\nSpecification" as PS
rectangle "Coding" as C
rectangle "Unit\\nTesting" as UT
rectangle "Integration\\nTesting" as IT
rectangle "System\\nTesting" as ST
rectangle "User Acceptance\\nTesting" as UAT
RS -down-&gt; HL
HL -down-&gt; DD
DD -down-&gt; PS
PS -down-&gt; C
C -up-&gt; UT
UT -up-&gt; IT
IT -up-&gt; ST
ST -up-&gt; UAT
RS .right.&gt; UAT : tested by
HL .right.&gt; ST : tested by
DD .right.&gt; IT : tested by
PS .right.&gt; UT : tested by
@enduml</code></pre></details>
<table>
<thead><tr><th>Bên trái (đặc tả)</th><th>được kiểm bởi (bên phải)</th><th>Ai / kiểm cái gì</th></tr></thead>
<tbody>
<tr><td>Requirement Specification — đặc tả yêu cầu</td><td>User Acceptance Testing — nghiệm thu</td><td>người dùng, so với nhu cầu của họ</td></tr>
<tr><td>High Level Design — thiết kế mức cao</td><td>System Testing — kiểm thử hệ thống</td><td>đội kiểm thử độc lập, so với SRS</td></tr>
<tr><td>Detail Design — thiết kế chi tiết</td><td>Integration Testing — kiểm thử tích hợp</td><td>lập trình viên, interface giữa các thành phần</td></tr>
<tr><td>Program Specification — đặc tả chương trình</td><td>Unit Testing — kiểm thử đơn vị</td><td>lập trình viên, từng thành phần một</td></tr>
</tbody>
</table>
<p>Mô hình chữ V là thác nước bị bẻ gập ở giữa; giá trị của nó là bạn <strong>viết kế hoạch kiểm thử ngay khi viết đặc tả đối diện</strong> — ca nghiệm thu được thiết kế cùng lúc với yêu cầu, rất lâu trước khi có code.</p>
<div class="pitfall">Slide gắn nhãn cả nhánh trái là "Verification" và nhánh phải là "Validation". Nói chặt theo Gomaa thì kiểm thử đơn vị và tích hợp cũng là xác minh (code có khớp thiết kế không?); chỉ nghiệm thu so với nhu cầu người dùng mới là thẩm định thuần. Nếu phương án ghi "unit testing is validation", hãy cẩn thận.</div>`],
      [24, '4. Software testing',
        `<p class="y-chinh">🎯 Four testing levels: <strong>unit test</strong> (individual components, uses test-coverage criteria), <strong>integration</strong> (combine tested components into progressively more complex groups), <strong>system test</strong> (functional testing, load testing), <strong>UAT</strong> (carried out by the end users).</p>
<table>
<thead><tr><th>Level</th><th>Box</th><th>What Gomaa adds (3.4)</th></tr></thead>
<tbody>
<tr><td>Unit</td><td>white box</td><td>coverage criteria: <strong>statement coverage</strong> (every statement at least once), <strong>branch coverage</strong> (every outcome of every branch at least once)</td></tr>
<tr><td>Integration</td><td>white box</td><td>keep adding components until the whole system is assembled and all <strong>interfaces</strong> are tested</td></tr>
<tr><td>System</td><td>black box</td><td>against the SRS, preferably by an <strong>independent test team</strong>: functional, load (stress), performance testing</td></tr>
<tr><td>Acceptance (UAT)</td><td>black box</td><td>by the <strong>user organization</strong>, usually at the user's site, before accepting the system</td></tr>
</tbody>
</table>
<p><strong>White box</strong> = you test with knowledge of the internals (the code); <strong>black box</strong> = you test from the requirements only, without knowing the internals. Branch coverage is stronger than statement coverage — the program below reaches 100% statements with one test but only half of the branch outcomes:</p>
<pre><code class="language-java">// Slide 24 (beyond the slide): statement coverage vs branch coverage on one tiny method
import java.util.LinkedHashSet;
import java.util.Set;

public class CoverageDemo {
    static Set&lt;String&gt; hit = new LinkedHashSet&lt;&gt;(); // which statements / branch outcomes ran

    // Late fine for LabFlow equipment: 5,000 VND per late day
    static int fine(int daysLate) {
        hit.add("S1");                       // int f = 0
        int f = 0;
        if (daysLate &gt; 0) {
            hit.add("B-true");               // branch taken
            hit.add("S2");
            f = daysLate * 5000;
        } else {
            hit.add("B-false");              // branch not taken (no statement inside!)
        }
        hit.add("S3");                       // return f
        return f;
    }

    static void report(String name) {
        int s = 0, b = 0;
        for (String x : hit) { if (x.startsWith("S")) s++; else b++; }
        System.out.println(name + " -&gt; statements " + s + "/3, branch outcomes " + b + "/2 " + hit);
        hit.clear();
    }

    public static void main(String[] args) {
        System.out.println("fine(3) = " + fine(3));
        report("Test set A {3}");
        fine(3); fine(0);
        report("Test set B {3, 0}");
    }
}</code></pre>
<div class="out">fine(3) = 15000<br>
Test set A {3} -&gt; statements 3/3, branch outcomes 1/2 [S1, B-true, S2, S3]<br>
Test set B {3, 0} -&gt; statements 3/3, branch outcomes 2/2 [S1, B-true, S2, S3, B-false]</div>
<p>Test set A executes all three statements but never takes the <code>false</code> side of the <code>if</code>; a bug there (say, returning −1 for zero days) would go unnoticed. Adding <code>fine(0)</code> reaches full branch coverage.</p>
<div class="pitfall">Gomaa's questions 9–10: "white box testing" = testing <strong>with</strong> knowledge of the system internals; "black box testing" = testing <strong>without</strong> knowledge of the software internals. Options (a) "unit testing" / "system testing" are examples, not definitions — pick the definition.</div>`,
        `<p class="y-chinh">🎯 Bốn mức kiểm thử: <strong>unit test — kiểm thử đơn vị</strong> (từng thành phần riêng, dùng tiêu chí độ phủ), <strong>integration — kiểm thử tích hợp</strong> (ghép các thành phần đã kiểm thành nhóm ngày càng lớn), <strong>system test — kiểm thử hệ thống</strong> (kiểm thử chức năng, kiểm thử tải), <strong>UAT — kiểm thử nghiệm thu người dùng</strong> (do chính người dùng cuối làm).</p>
<table>
<thead><tr><th>Mức</th><th>Hộp</th><th>Gomaa nói thêm (3.4)</th></tr></thead>
<tbody>
<tr><td>Unit</td><td>hộp trắng</td><td>tiêu chí độ phủ: <strong>độ phủ câu lệnh (statement coverage)</strong> — mọi câu lệnh chạy ít nhất một lần, <strong>độ phủ nhánh (branch coverage)</strong> — mọi kết quả của mọi nhánh được thử ít nhất một lần</td></tr>
<tr><td>Integration</td><td>hộp trắng</td><td>ghép dần thành phần cho tới khi đủ cả hệ thống và mọi <strong>interface</strong> đã được kiểm</td></tr>
<tr><td>System</td><td>hộp đen</td><td>so với SRS, tốt nhất do <strong>đội kiểm thử độc lập</strong>: kiểm thử chức năng, tải (stress), hiệu năng</td></tr>
<tr><td>Acceptance (UAT)</td><td>hộp đen</td><td>do <strong>tổ chức người dùng</strong> làm, thường tại chỗ người dùng, trước khi nhận hệ thống</td></tr>
</tbody>
</table>
<p><strong>Hộp trắng (white box)</strong> = kiểm thử khi biết phần bên trong (code); <strong>hộp đen (black box)</strong> = kiểm thử chỉ từ yêu cầu, không biết bên trong. Độ phủ nhánh mạnh hơn độ phủ câu lệnh — chương trình dưới đây đạt 100% câu lệnh chỉ với một ca kiểm thử nhưng mới được một nửa số kết quả nhánh:</p>
<pre><code class="language-java">// Slide 24 (mở rộng): độ phủ câu lệnh và độ phủ nhánh trên một hàm nhỏ
import java.util.LinkedHashSet;
import java.util.Set;

public class CoverageDemo {
    static Set&lt;String&gt; hit = new LinkedHashSet&lt;&gt;(); // câu lệnh / nhánh nào đã chạy

    // Tiền phạt trả thiết bị LabFlow trễ: 5.000đ mỗi ngày
    static int fine(int daysLate) {
        hit.add("S1");                       // int f = 0
        int f = 0;
        if (daysLate &gt; 0) {
            hit.add("B-true");               // nhánh đúng
            hit.add("S2");
            f = daysLate * 5000;
        } else {
            hit.add("B-false");              // nhánh sai (bên trong không có câu lệnh nào của code gốc)
        }
        hit.add("S3");                       // return f
        return f;
    }

    static void report(String name) {
        int s = 0, b = 0;
        for (String x : hit) { if (x.startsWith("S")) s++; else b++; }
        System.out.println(name + " -&gt; statements " + s + "/3, branch outcomes " + b + "/2 " + hit);
        hit.clear();
    }

    public static void main(String[] args) {
        System.out.println("fine(3) = " + fine(3));
        report("Test set A {3}");
        fine(3); fine(0);
        report("Test set B {3, 0}");
    }
}</code></pre>
<div class="out">fine(3) = 15000<br>
Test set A {3} -&gt; statements 3/3, branch outcomes 1/2 [S1, B-true, S2, S3]<br>
Test set B {3, 0} -&gt; statements 3/3, branch outcomes 2/2 [S1, B-true, S2, S3, B-false]</div>
<p>Bộ ca A chạy cả ba câu lệnh nhưng chưa bao giờ đi vào phía <code>false</code> của <code>if</code>; một lỗi ở đó (ví dụ trả −1 khi trễ 0 ngày) sẽ lọt qua. Thêm <code>fine(0)</code> là đạt đủ độ phủ nhánh.</p>
<div class="pitfall">Câu 9–10 cuối chương của Gomaa: "white box testing" = kiểm thử <strong>có</strong> hiểu biết về phần bên trong; "black box testing" = kiểm thử <strong>không</strong> biết phần bên trong. Phương án "unit testing" / "system testing" chỉ là ví dụ, không phải định nghĩa — hãy chọn định nghĩa.</div>`],
    ]),
    bi(`<h2>📌 Must-know after slides 14–24</h2>
<ul>
<li>USDP/RUP: use case–driven, UML, iterative, risk-driven; <strong>5 workflows</strong> (requirements, analysis, design, implementation, test) × <strong>4 phases</strong> (inception, elaboration, construction, transition).</li>
<li>Artifact = information produced/modified/used; workflow = activities giving an observable result; phase = time between two major milestones.</li>
<li>Products: use case model · analysis model · design model + deployment model · implementation model · test model. Architecture is defined in <strong>elaboration</strong>.</li>
<li>Validation = build the right system (user's needs); verification = build the system right (previous phase's specification).</li>
<li>Activities: requirements (SRS = external behaviour) → architectural design (components + interfaces) → detailed design (algorithms, data structures, PDL) → coding.</li>
<li>Testing: unit and integration = white box; system and acceptance = black box; statement vs branch coverage.</li>
</ul>
<div class="callout">📝 <strong>Self-check:</strong> without looking, draw the V-model and write next to each test level who performs it and whether it is white or black box. Then explain to yourself why a LabFlow feature can pass all unit tests and still fail the lab managers' acceptance test.</div>`,
    `<h2>📌 Phải nhớ sau slide 14–24</h2>
<ul>
<li>USDP/RUP: hướng use case, dùng UML, lặp, hướng rủi ro; <strong>5 workflow</strong> (yêu cầu, phân tích, thiết kế, cài đặt, kiểm thử) × <strong>4 pha</strong> (inception, elaboration, construction, transition).</li>
<li>Artifact = thông tin được tạo/sửa/dùng; workflow = chuỗi hoạt động cho kết quả quan sát được; phase = khoảng thời gian giữa hai cột mốc lớn.</li>
<li>Sản phẩm: use case model · analysis model · design model + deployment model · implementation model · test model. Kiến trúc được xác định ở <strong>elaboration</strong>.</li>
<li>Thẩm định (validation) = làm đúng hệ thống cần làm (nhu cầu người dùng); xác minh (verification) = làm hệ thống cho đúng (đặc tả của pha trước).</li>
<li>Hoạt động: yêu cầu (SRS = hành vi bên ngoài) → thiết kế kiến trúc (thành phần + interface) → thiết kế chi tiết (thuật toán, cấu trúc dữ liệu, PDL) → viết code.</li>
<li>Kiểm thử: đơn vị và tích hợp = hộp trắng; hệ thống và nghiệm thu = hộp đen; độ phủ câu lệnh và độ phủ nhánh.</li>
</ul>
<div class="callout">📝 <strong>Tự kiểm:</strong> không nhìn bài, vẽ mô hình chữ V và ghi cạnh mỗi mức kiểm thử ai làm và nó là hộp trắng hay hộp đen. Rồi tự giải thích vì sao một tính năng LabFlow có thể qua hết unit test mà vẫn trượt bài nghiệm thu của quản lý lab.</div>`),
    books([
      ['gomaa', 'Chapter 3, sections 3.1.7–3.4 (Figure 3.8) and exercises 7–10', 'Chương 3, mục 3.1.7–3.4 (Hình 3.8) và câu trắc nghiệm 7–10'],
      ['fowler', 'Chapter 2 "Development Process" — iterative development and the Rational Unified Process', 'Chương 2 "Development Process" — phát triển lặp và Rational Unified Process'],
      ['plantuml', '"Activity Diagram (new syntax)" — partitions; "Deployment Diagram" — rectangles and arrows', 'mục "Activity Diagram (new syntax)" — partition; "Deployment Diagram" — rectangle và mũi tên'],
      ['fuSlides', 'deck "Chapter 3: Software Life Cycle Models and Processes", slides 14–24', 'bộ "Chapter 3: Software Life Cycle Models and Processes", slide 14–24'],
    ]),
  ].join('\n'),
};

/* ───────── 1.F — 📑 Slide by slide · Design concepts (1): objects, information hiding, inheritance (school Ch.4, slides 1–13) ───────── */
const L_swd5_1 = {
  title: '1.F — 📑 Slide by slide · Design concepts (1): objects, information hiding, inheritance (school Ch.4, slides 1–13)|||1.F — 📑 Học theo từng slide · Khái niệm thiết kế (1): đối tượng, che giấu thông tin, kế thừa (Chapter 4 của trường, slide 1–13)',
  slug: 'swd392-slide-swd5-1',
  type: 'VIDEO',
  description: 'Giảng slide 1–13 Chapter 4 của trường (Gomaa Ch.4): đối tượng và lớp, thuộc tính và thao tác, interface và chữ ký, che giấu thông tin (Parnas) và thiết kế đối tượng hai bước, ví dụ ngăn xếp đổi cấu trúc dữ liệu, kết dính và ghép nối (mở rộng), kế thừa và tổng quát hoá/chuyên biệt hoá, bảy bước tìm kế thừa, lớp trừu tượng hay interface — có class diagram PlantUML dựng thật và Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.F · school deck "Chapter 4: Software Design and Architecture Concepts", slides 1–13</span>
<h2>Software design concepts (part 1) — the deck, slide by slide</h2>
<p class="lead">This deck is the vocabulary of the whole course. Every later chapter assumes you know what an <strong>object</strong>, a <strong>class</strong>, an <strong>interface</strong> and <strong>information hiding</strong> are, and when <strong>inheritance</strong> is right or wrong. The ideas are old (Parnas 1972, Simula 67) but they are exactly what a Spring Boot codebase is built on, and what interviewers test with "explain encapsulation" or "abstract class vs interface". Each concept below gets a UML diagram rendered for real, <strong>Java code that runs</strong> with its real output, and the exam traps. Two ideas the slides skip but the course needs — <strong>coupling and cohesion</strong> — are added as <strong>➕ Beyond the slide</strong>.</p>`,
    `<span class="eyebrow">Chương 1 · Bài 1.F · bộ slide "Chapter 4: Software Design and Architecture Concepts" của trường, slide 1–13</span>
<h2>Các khái niệm thiết kế phần mềm (phần 1) — học bộ slide từng trang</h2>
<p class="lead">Bộ slide này là bộ từ vựng của cả môn. Mọi chương sau đều coi như bạn đã biết <strong>đối tượng (object)</strong>, <strong>lớp (class)</strong>, <strong>interface</strong> và <strong>che giấu thông tin (information hiding)</strong> là gì, và khi nào <strong>kế thừa (inheritance)</strong> đúng hay sai. Các ý này đã cũ (Parnas 1972, Simula 67) nhưng chính là nền của một dự án Spring Boot, và là thứ nhà tuyển dụng hỏi bằng câu "giải thích encapsulation" hay "abstract class khác interface thế nào". Mỗi khái niệm dưới đây có sơ đồ UML dựng thật, <strong>code Java chạy thật</strong> kèm output thật, và các bẫy thi. Hai ý slide bỏ qua nhưng môn học rất cần — <strong>ghép nối (coupling) và kết dính (cohesion)</strong> — được thêm ở phần <strong>➕ Mở rộng ngoài slide</strong>.</p>`),
    walkHead('swd5', 1, 13),
    walk('swd5', [
      [1, 'Chapter 4: Software Design and Architecture Concepts',
        `<p class="y-chinh">🎯 Chapter 4 collects the key design concepts that "have shown their value over the years": object-oriented concepts, information hiding, inheritance, concurrency, design patterns, software architecture and components, quality attributes.</p>
<p>Think of it as a toolbox: Chapters 6–11 use the object concepts to <em>analyse</em>, Chapters 12–18 use architecture, components and concurrency to <em>design</em>.</p>`,
        `<p class="y-chinh">🎯 Chương 4 gom các khái niệm thiết kế then chốt "đã chứng tỏ giá trị qua nhiều năm": khái niệm hướng đối tượng, che giấu thông tin, kế thừa, xử lý đồng thời (concurrency), mẫu thiết kế (design pattern), kiến trúc phần mềm và thành phần (component), thuộc tính chất lượng (quality attribute).</p>
<p>Hãy coi nó là hộp đồ nghề: Chương 6–11 dùng các khái niệm đối tượng để <em>phân tích</em>, Chương 12–18 dùng kiến trúc, component và đồng thời để <em>thiết kế</em>.</p>`],
      [2, 'Content',
        `<p class="y-chinh">🎯 Seven topics: object-oriented concepts, information hiding, inheritance and generalisation/specialisation, concurrent processing, design patterns, software architecture and components, software quality attributes.</p>
<p>This lesson (1.F) covers the first three (slides 3–13); lesson 1.G covers concurrency, patterns, architecture and quality attributes (slides 14–25). ("Attibutes" on the slide is a typo for "Attributes".)</p>`,
        `<p class="y-chinh">🎯 Bảy chủ đề: khái niệm hướng đối tượng, che giấu thông tin, kế thừa và tổng quát hoá/chuyên biệt hoá (generalisation/specialisation), xử lý đồng thời, mẫu thiết kế, kiến trúc phần mềm và component, thuộc tính chất lượng phần mềm.</p>
<p>Bài này (1.F) học ba chủ đề đầu (slide 3–13); bài 1.G học đồng thời, mẫu thiết kế, kiến trúc và thuộc tính chất lượng (slide 14–25). (Chữ "Attibutes" trên slide là lỗi gõ của "Attributes".)</p>`],
      [3, '1. Object Oriented Concepts',
        `<p class="y-chinh">🎯 An <strong>object</strong> is a real-world physical or conceptual entity that helps us understand the real world and so forms the basis of a software solution; a <strong>class</strong> (object class) is a collection of objects with the same characteristics; an object is an <strong>instance</strong> of a class.</p>
<ul>
<li><strong>Physical</strong> objects can be seen or touched: a microscope, a lab room, a door. <strong>Conceptual</strong> objects are abstract: an account, a reservation, a transaction.</li>
<li>An object <strong>groups data and the procedures (operations) that work on that data</strong> — this is Gomaa's design-level definition and a classic exam answer.</li>
<li>Each object has a unique <strong>identity</strong>: two identical blue balls are still two objects.</li>
</ul>
<p>The slide's note "chú ý phân biệt object và entity" (tell object and entity apart): in everyday speech "entity" means any real-world thing; in COMET, <code>«entity»</code> is a specific <em>kind</em> of object — a long-lived object that stores data (Ch.8), next to <code>«boundary»</code> and <code>«control»</code> objects. And in databases an entity (ERD) is a table-like concept without operations.</p>
<div class="pitfall">Gomaa's questions 2–3: "a characteristic of an object?" → <strong>groups data and procedures that operate on the data</strong> (not "a function", not "a module"); "what is a class?" → <strong>a collection of objects with the same characteristics</strong> (not "an object instance").</div>`,
        `<p class="y-chinh">🎯 <strong>Đối tượng (object)</strong> là một thực thể vật lý hoặc khái niệm trong thế giới thật, giúp ta hiểu thế giới thật và vì thế là nền của lời giải phần mềm; <strong>lớp (class)</strong> hay object class là tập các đối tượng có cùng đặc điểm; một đối tượng là một <strong>thể hiện (instance)</strong> của một lớp.</p>
<ul>
<li>Đối tượng <strong>vật lý</strong> thấy được, sờ được: cái kính hiển vi, phòng lab, cánh cửa. Đối tượng <strong>khái niệm</strong> thì trừu tượng: tài khoản, lượt đặt chỗ, giao dịch.</li>
<li>Một đối tượng <strong>gom dữ liệu và các thủ tục (thao tác — operation) xử lý dữ liệu đó</strong> — đây là định nghĩa mức thiết kế của Gomaa và là đáp án thi kinh điển.</li>
<li>Mỗi đối tượng có <strong>định danh (identity)</strong> riêng: hai quả bóng xanh giống hệt nhau vẫn là hai đối tượng.</li>
</ul>
<p>Ghi chú trên slide "chú ý phân biệt object và entity": trong lời nói thường, "entity" là mọi thứ ngoài đời; trong COMET, <code>«entity»</code> là một <em>loại</em> đối tượng cụ thể — đối tượng sống lâu dùng để lưu dữ liệu (Ch.8), bên cạnh đối tượng <code>«boundary»</code> (biên) và <code>«control»</code> (điều khiển). Còn trong cơ sở dữ liệu, entity (của ERD) là khái niệm giống bảng, không có thao tác.</p>
<div class="pitfall">Câu 2–3 cuối chương của Gomaa: "đặc điểm của một đối tượng?" → <strong>gom dữ liệu và các thủ tục xử lý dữ liệu đó</strong> (không phải "một hàm", không phải "một module"); "lớp là gì?" → <strong>tập các đối tượng có cùng đặc điểm</strong> (không phải "một thể hiện đối tượng").</div>`],
      [4, '1. Object Oriented Concepts',
        `<p class="y-chinh">🎯 Gomaa Figures 4.2–4.3: class <code>Account</code> with attributes <code>accountNumber : Integer</code>, <code>balance : Real</code> and operations <code>readBalance()</code>, <code>credit(amount)</code>, <code>debit(amount)</code>, <code>open(accountNumber)</code>, <code>close()</code>; two objects <code>anAccount</code> (1234, 567.25) and <code>anotherAccount</code> (5678, 1879.44) each hold their own values.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/8fc1c7943669c3e62f7e672df19a2794f6bc81c8.svg" alt="The slide's Account class and its two objects: same attributes and operations, different values" loading="lazy" /><p class="chu-thich">🧩 The slide's Account class and its two objects: same attributes and operations, different values</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 4 (Gomaa Figures 4.2 and 4.3): class Account with attributes and operations, two objects holding their own values
class Account {
  accountNumber : Integer
  balance : Real
  --
  readBalance() : Real
  credit(amount : Real)
  debit(amount : Real)
  open(accountNumber : Integer)
  close()
}
object "anAccount : Account" as a1 {
  accountNumber = 1234
  balance = 567.25
}
object "anotherAccount : Account" as a2 {
  accountNumber = 5678
  balance = 1879.44
}
a1 ..&gt; Account : &lt;&lt;instanceOf&gt;&gt;
a2 ..&gt; Account : &lt;&lt;instanceOf&gt;&gt;
@enduml</code></pre></details>
<p>An <strong>attribute</strong> is a data value held by an object; each object has its own value. An <strong>operation</strong> is the specification of a function performed by an object; all objects of a class share the same operations. The same model in Java:</p>
<pre><code class="language-java">// Slide 4 (Gomaa Fig. 4.2-4.3): one class Account, two objects with their own attribute values
class Account {
    private int accountNumber;   // attribute
    private double balance;

    void open(int accountNumber) { this.accountNumber = accountNumber; }   // operations
    void credit(double amount)   { balance += amount; }
    void debit(double amount)    { balance -= amount; }
    double readBalance()         { return balance; }
    void close()                 { System.out.println("account " + accountNumber + " closed"); }
    int number()                 { return accountNumber; }
}

public class AccountObjects {
    public static void main(String[] args) {
        Account anAccount = new Account();          // object 1 = instance of Account
        anAccount.open(1234);
        anAccount.credit(567.25);
        Account anotherAccount = new Account();     // object 2: same class, different values
        anotherAccount.open(5678);
        anotherAccount.credit(1879.44);
        System.out.println("anAccount      : " + anAccount.number() + ", balance = " + anAccount.readBalance());
        System.out.println("anotherAccount : " + anotherAccount.number() + ", balance = " + anotherAccount.readBalance());
        Account same = anAccount;                   // two references, ONE object (identity)
        same.debit(67.25);
        System.out.println("anAccount after debit via 'same': " + anAccount.readBalance());
        System.out.println("same object? " + (same == anAccount) + " | anAccount == anotherAccount? " + (anAccount == anotherAccount));
        anotherAccount.close();
    }
}</code></pre>
<div class="out">anAccount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1234, balance = 567.25<br>
anotherAccount : 5678, balance = 1879.44<br>
anAccount after debit via 'same': 500.0<br>
same object? true | anAccount == anotherAccount? false<br>
account 5678 closed</div>
<p>The last two lines show <strong>identity</strong>: <code>same</code> and <code>anAccount</code> are two variables pointing to ONE object (debit through one, the other sees it); <code>anAccount</code> and <code>anotherAccount</code> are two objects even if their values were equal.</p>
<p class="nhan">➕ Two more words from Gomaa 4.1.1 that the exam uses: the <strong>signature</strong> of an operation = its name, parameters and return value; an object's <strong>interface</strong> = the set of operations it provides (their signatures). An object's <em>type</em> is defined by its interface, its <em>implementation</em> by its class.</p>
<div class="pitfall">(a) Object boxes: name underlined, <code>name : Class</code>, attributes with <strong>values</strong>. (b) "Signature" is not just the name — Gomaa's question 5 answer is <strong>name, parameters and return value</strong>. (c) The slide shows 567.25 / 1879.44 while the book text says 525.36 / 1,897.44 — the values do not matter, the idea does.</div>`,
        `<p class="y-chinh">🎯 Hình 4.2–4.3 của Gomaa: lớp <code>Account</code> có thuộc tính <code>accountNumber : Integer</code>, <code>balance : Real</code> và thao tác <code>readBalance()</code>, <code>credit(amount)</code> (ghi có), <code>debit(amount)</code> (ghi nợ), <code>open(accountNumber)</code>, <code>close()</code>; hai đối tượng <code>anAccount</code> (1234, 567.25) và <code>anotherAccount</code> (5678, 1879.44) giữ giá trị riêng của mình.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/8fc1c7943669c3e62f7e672df19a2794f6bc81c8.svg" alt="Lớp Account của slide và hai đối tượng của nó: cùng thuộc tính và thao tác, khác giá trị" loading="lazy" /><p class="chu-thich">🧩 Lớp Account của slide và hai đối tượng của nó: cùng thuộc tính và thao tác, khác giá trị</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 4 (Hình 4.2 và 4.3): lớp Account có thuộc tính và thao tác, hai đối tượng giữ giá trị riêng
class Account {
  accountNumber : Integer
  balance : Real
  --
  readBalance() : Real
  credit(amount : Real)
  debit(amount : Real)
  open(accountNumber : Integer)
  close()
}
object "anAccount : Account" as a1 {
  accountNumber = 1234
  balance = 567.25
}
object "anotherAccount : Account" as a2 {
  accountNumber = 5678
  balance = 1879.44
}
a1 ..&gt; Account : &lt;&lt;instanceOf&gt;&gt;
a2 ..&gt; Account : &lt;&lt;instanceOf&gt;&gt;
@enduml</code></pre></details>
<p><strong>Thuộc tính (attribute)</strong> là một giá trị dữ liệu mà đối tượng giữ; mỗi đối tượng có giá trị riêng. <strong>Thao tác (operation)</strong> là đặc tả của một chức năng đối tượng thực hiện; mọi đối tượng cùng lớp dùng chung một bộ thao tác. Cùng mô hình đó bằng Java:</p>
<pre><code class="language-java">// Slide 4 (Hình 4.2-4.3): một lớp Account, hai đối tượng với giá trị thuộc tính riêng
class Account {
    private int accountNumber;   // thuộc tính
    private double balance;

    void open(int accountNumber) { this.accountNumber = accountNumber; }   // thao tác
    void credit(double amount)   { balance += amount; }
    void debit(double amount)    { balance -= amount; }
    double readBalance()         { return balance; }
    void close()                 { System.out.println("account " + accountNumber + " closed"); }
    int number()                 { return accountNumber; }
}

public class AccountObjects {
    public static void main(String[] args) {
        Account anAccount = new Account();          // đối tượng 1 = thể hiện của Account
        anAccount.open(1234);
        anAccount.credit(567.25);
        Account anotherAccount = new Account();     // đối tượng 2: cùng lớp, giá trị khác
        anotherAccount.open(5678);
        anotherAccount.credit(1879.44);
        System.out.println("anAccount      : " + anAccount.number() + ", balance = " + anAccount.readBalance());
        System.out.println("anotherAccount : " + anotherAccount.number() + ", balance = " + anotherAccount.readBalance());
        Account same = anAccount;                   // hai biến tham chiếu, MỘT đối tượng (định danh)
        same.debit(67.25);
        System.out.println("anAccount after debit via 'same': " + anAccount.readBalance());
        System.out.println("same object? " + (same == anAccount) + " | anAccount == anotherAccount? " + (anAccount == anotherAccount));
        anotherAccount.close();
    }
}</code></pre>
<div class="out">anAccount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1234, balance = 567.25<br>
anotherAccount : 5678, balance = 1879.44<br>
anAccount after debit via 'same': 500.0<br>
same object? true | anAccount == anotherAccount? false<br>
account 5678 closed</div>
<p>Hai dòng cuối cho thấy <strong>định danh</strong>: <code>same</code> và <code>anAccount</code> là hai biến cùng trỏ vào MỘT đối tượng (ghi nợ qua biến này, biến kia thấy ngay); <code>anAccount</code> và <code>anotherAccount</code> là hai đối tượng dù giá trị có bằng nhau đi nữa.</p>
<p class="nhan">➕ Thêm hai từ của Gomaa 4.1.1 hay ra thi: <strong>chữ ký (signature)</strong> của thao tác = tên, tham số và giá trị trả về; <strong>interface</strong> của đối tượng = tập các thao tác nó cung cấp (các chữ ký đó). <em>Kiểu (type)</em> của đối tượng do interface quyết định, <em>cài đặt (implementation)</em> do lớp quyết định.</p>
<div class="pitfall">(a) Hộp đối tượng: tên gạch chân, dạng <code>tên : Lớp</code>, thuộc tính mang <strong>giá trị</strong>. (b) "Signature" không chỉ là cái tên — đáp án câu 5 của Gomaa là <strong>tên, tham số và giá trị trả về</strong>. (c) Slide ghi 567.25 / 1879.44 còn chữ trong sách ghi 525.36 / 1,897.44 — con số không quan trọng, ý mới quan trọng.</div>`],
      [5, '2. Information hiding',
        `<p class="y-chinh">🎯 <strong>Information hiding</strong> decides what information of an object is visible and what is hidden; designing an object is a <strong>two-step process</strong> — first the <strong>interface</strong> (external view, part of high-level design), then the <strong>internals</strong> (part of detailed design).</p>
<p><strong>Where it comes from (Gomaa 4.2):</strong> early programs shared <em>global data</em>, so changing one data structure broke every module that touched it. Parnas (1972) proposed: each module hides one <strong>design decision that is likely to change</strong> — its <em>secret</em>. Change the secret, and only that module changes. <strong>Encapsulation</strong> is another name for information hiding by an object.</p>
<p>Gomaa's classic example is a stack used by several modules. If the stack is a global array, every module manipulates the array index; switch to a linked list and every module must be rewritten. If the stack is an information-hiding object with <code>push</code>, <code>pop</code>, <code>empty</code>, only the stack changes:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/d5ee5f839e9c312244c6d26b2ec485e5ad6cf7cc.svg" alt="Gomaa 4.2.2 as a class diagram: the client knows only the Stack interface; array or linked list is the hidden secret" loading="lazy" /><p class="chu-thich">🧩 Gomaa 4.2.2 as a class diagram: the client knows only the Stack interface; array or linked list is the hidden secret</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Gomaa 4.2.2 (beyond the slide) — one Stack interface, two hidden implementations; clients depend only on the interface
interface Stack {
  + push(item : String)
  + pop() : String
  + empty() : boolean
}
class ArrayStack {
  - items : String[10]
  - top : int
}
class LinkedStack {
  - list : LinkedList&lt;String&gt;
}
class ReverseClient {
  + reverse(s : Stack, words) : String
}
ArrayStack .up.|&gt; Stack
LinkedStack .up.|&gt; Stack
ReverseClient .right.&gt; Stack : uses
@enduml</code></pre></details>
<pre><code class="language-java">// Gomaa 4.2.2 (beyond the slide): the stack example — change the hidden data structure, the client does not change
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

interface Stack {                  // the interface = the only thing clients know
    void push(String item);
    String pop();
    boolean empty();
}

class ArrayStack implements Stack {        // secret: an array + an index
    private final String[] items = new String[10];
    private int top = 0;
    public void push(String item) { items[top++] = item; }
    public String pop() { return items[--top]; }
    public boolean empty() { return top == 0; }
}

class LinkedStack implements Stack {       // secret: a linked list
    private final LinkedList&lt;String&gt; list = new LinkedList&lt;&gt;();
    public void push(String item) { list.addFirst(item); }
    public String pop() { return list.removeFirst(); }
    public boolean empty() { return list.isEmpty(); }
}

public class StackHiding {
    // The client code is written ONCE against the interface
    static String reverse(Stack s, String... words) {
        for (String w : words) s.push(w);
        List&lt;String&gt; out = new ArrayList&lt;&gt;();
        while (!s.empty()) out.add(s.pop());
        return String.join(" ", out);
    }

    public static void main(String[] args) {
        System.out.println("ArrayStack : " + reverse(new ArrayStack(), "design", "for", "change"));
        System.out.println("LinkedStack: " + reverse(new LinkedStack(), "design", "for", "change"));
    }
}</code></pre>
<div class="out">ArrayStack : change for design<br>
LinkedStack: change for design</div>
<p>The <code>reverse</code> method was written once and gives the same result with both implementations — the data structure changed "drastically" but the <em>interface</em> did not. Gomaa calls this form of hiding <strong>data abstraction</strong>.</p>
<div class="pitfall">Gomaa's question 8: "What is information hiding in software design?" → <strong>hiding a design decision that is considered likely to change</strong>. Not "hiding information so it cannot be found", not "to make it secure". Question 9: data abstraction = <strong>encapsulating data so that its structure is hidden</strong>.</div>`,
        `<p class="y-chinh">🎯 <strong>Che giấu thông tin (information hiding)</strong> quyết định phần thông tin nào của đối tượng được lộ ra và phần nào bị giấu; thiết kế một đối tượng là <strong>quy trình hai bước</strong> — trước tiên thiết kế <strong>interface</strong> (góc nhìn bên ngoài, thuộc thiết kế mức cao), rồi mới thiết kế <strong>phần bên trong</strong> (internals, thuộc thiết kế chi tiết).</p>
<p><strong>Ý này từ đâu ra (Gomaa 4.2):</strong> chương trình thời đầu dùng chung <em>dữ liệu toàn cục (global data)</em>, nên sửa một cấu trúc dữ liệu là hỏng mọi module chạm vào nó. Parnas (1972) đề xuất: mỗi module giấu một <strong>quyết định thiết kế có khả năng thay đổi</strong> — gọi là <em>bí mật (secret)</em> của nó. Đổi bí mật thì chỉ module đó phải sửa. <strong>Đóng gói (encapsulation)</strong> là tên khác của việc một đối tượng che giấu thông tin.</p>
<p>Ví dụ kinh điển của Gomaa là một ngăn xếp (stack) được nhiều module dùng. Nếu stack là mảng toàn cục, module nào cũng tự thao tác chỉ số mảng; đổi sang danh sách liên kết là phải viết lại mọi module. Nếu stack là đối tượng che giấu thông tin với <code>push</code>, <code>pop</code>, <code>empty</code>, chỉ riêng stack phải đổi:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/d5ee5f839e9c312244c6d26b2ec485e5ad6cf7cc.svg" alt="Gomaa 4.2.2 vẽ thành class diagram: phía gọi chỉ biết interface Stack; mảng hay danh sách liên kết là bí mật bị giấu" loading="lazy" /><p class="chu-thich">🧩 Gomaa 4.2.2 vẽ thành class diagram: phía gọi chỉ biết interface Stack; mảng hay danh sách liên kết là bí mật bị giấu</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Gomaa 4.2.2 (mở rộng) — một interface Stack, hai cài đặt bị che giấu; phía gọi chỉ phụ thuộc interface
interface Stack {
  + push(item : String)
  + pop() : String
  + empty() : boolean
}
class ArrayStack {
  - items : String[10]
  - top : int
}
class LinkedStack {
  - list : LinkedList&lt;String&gt;
}
class ReverseClient {
  + reverse(s : Stack, words) : String
}
ArrayStack .up.|&gt; Stack
LinkedStack .up.|&gt; Stack
ReverseClient .right.&gt; Stack : uses
@enduml</code></pre></details>
<pre><code class="language-java">// Gomaa 4.2.2 (mở rộng): ví dụ ngăn xếp — đổi cấu trúc dữ liệu bị che giấu, phía gọi không phải đổi
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

interface Stack {                  // interface = thứ duy nhất phía gọi biết
    void push(String item);
    String pop();
    boolean empty();
}

class ArrayStack implements Stack {        // bí mật: một mảng + một chỉ số
    private final String[] items = new String[10];
    private int top = 0;
    public void push(String item) { items[top++] = item; }
    public String pop() { return items[--top]; }
    public boolean empty() { return top == 0; }
}

class LinkedStack implements Stack {       // bí mật: một danh sách liên kết
    private final LinkedList&lt;String&gt; list = new LinkedList&lt;&gt;();
    public void push(String item) { list.addFirst(item); }
    public String pop() { return list.removeFirst(); }
    public boolean empty() { return list.isEmpty(); }
}

public class StackHiding {
    // Code phía gọi viết MỘT lần theo interface
    static String reverse(Stack s, String... words) {
        for (String w : words) s.push(w);
        List&lt;String&gt; out = new ArrayList&lt;&gt;();
        while (!s.empty()) out.add(s.pop());
        return String.join(" ", out);
    }

    public static void main(String[] args) {
        System.out.println("ArrayStack : " + reverse(new ArrayStack(), "design", "for", "change"));
        System.out.println("LinkedStack: " + reverse(new LinkedStack(), "design", "for", "change"));
    }
}</code></pre>
<div class="out">ArrayStack : change for design<br>
LinkedStack: change for design</div>
<p>Hàm <code>reverse</code> được viết một lần và cho cùng kết quả với cả hai cài đặt — cấu trúc dữ liệu đổi "tận gốc" nhưng <em>interface</em> thì không. Gomaa gọi dạng che giấu này là <strong>trừu tượng hoá dữ liệu (data abstraction)</strong>.</p>
<div class="pitfall">Câu 8 của Gomaa: "Information hiding trong thiết kế phần mềm là gì?" → <strong>giấu một quyết định thiết kế có khả năng thay đổi</strong>. Không phải "giấu thông tin để không ai tìm thấy", không phải "để bảo mật". Câu 9: data abstraction = <strong>đóng gói dữ liệu để cấu trúc của nó bị giấu đi</strong>.</div>`],
      [6, '2. Information hiding',
        `<p class="y-chinh">🎯 Step 1 — <strong>design the interface (external view)</strong>: decide what services the object provides — its public methods and their contract (inputs, outputs, behaviour) — without caring how they are implemented. Example: <code>BankAccount</code> offers <code>deposit(amount)</code>, <code>withdraw(amount)</code>, <code>getBalance()</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b9b6102232257936ae3a98a42974055f7080252d.svg" alt="BankAccount after both steps: the + operations are the interface (step 1), the - attributes and helper rules are the internals (step 2)" loading="lazy" /><p class="chu-thich">🧩 BankAccount after both steps: the + operations are the interface (step 1), the - attributes and helper rules are the internals (step 2)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slides 5-7 — information hiding: clients see only the interface (step 1); the internals (step 2) stay private
class Client
class BankAccount {
  - accountNumber : String
  - balance : double
  --
  + deposit(amount : double)
  + withdraw(amount : double)
  + getBalance() : double
  - checkPositive(amount : double)
  - checkEnough(amount : double)
}
Client ..&gt; BankAccount : calls only + operations
note right of BankAccount
  Step 1 (high-level design): the + operations = interface
  Step 2 (detailed design): the - attributes and
  - helper rules = internals, hidden
end note
@enduml</code></pre></details>
<p>The caller's code uses only the three public operations — it does not know whether the balance is a <code>double</code>, a <code>BigDecimal</code> or a row in PostgreSQL:</p>
<pre class="trich"><code class="language-java">BankAccount acc = new BankAccount("FU-001");
acc.deposit(500);
acc.withdraw(200);
System.out.println("balance = " + acc.getBalance());
try { acc.withdraw(1000); } catch (IllegalStateException e) { System.out.println("rejected: " + e.getMessage()); }
try { acc.deposit(-50); }   catch (IllegalArgumentException e) { System.out.println("rejected: " + e.getMessage()); }
// acc.balance = 1_000_000;  &lt;- compile error: balance has private access
System.out.println("balance still = " + acc.getBalance());</code></pre>
<p><strong>How to design an interface step by step:</strong> (1) list what other objects need <em>from</em> this one (verbs: deposit, withdraw, check balance); (2) write each as a signature (name, parameters, return); (3) state the contract in one line each (what is valid input, what happens on error); (4) stop — do <em>not</em> decide storage yet.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): the REST API of LabFlow is an interface in exactly this sense. Agree on <code>POST /reservations</code>, <code>DELETE /reservations/{id}</code>, <code>GET /slots?labId=</code> with the frontend teammate first; each side then designs its internals independently.</div>`,
        `<p class="y-chinh">🎯 Bước 1 — <strong>thiết kế interface (góc nhìn bên ngoài)</strong>: quyết định đối tượng cung cấp những dịch vụ nào — các phương thức public và hợp đồng của chúng (đầu vào, đầu ra, hành vi) — chưa cần quan tâm cài đặt ra sao. Ví dụ: <code>BankAccount</code> cung cấp <code>deposit(amount)</code> (nạp tiền), <code>withdraw(amount)</code> (rút tiền), <code>getBalance()</code> (xem số dư).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b9b6102232257936ae3a98a42974055f7080252d.svg" alt="BankAccount sau cả hai bước: các thao tác + là interface (bước 1), thuộc tính - và các luật phụ là phần bên trong (bước 2)" loading="lazy" /><p class="chu-thich">🧩 BankAccount sau cả hai bước: các thao tác + là interface (bước 1), thuộc tính - và các luật phụ là phần bên trong (bước 2)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 5-7 — che giấu thông tin: phía gọi chỉ thấy interface (bước 1); phần bên trong (bước 2) vẫn private
class Client
class BankAccount {
  - accountNumber : String
  - balance : double
  --
  + deposit(amount : double)
  + withdraw(amount : double)
  + getBalance() : double
  - checkPositive(amount : double)
  - checkEnough(amount : double)
}
Client ..&gt; BankAccount : calls only + operations
note right of BankAccount
  Step 1 (high-level design): the + operations = interface
  Step 2 (detailed design): the - attributes and
  - helper rules = internals, hidden
end note
@enduml</code></pre></details>
<p>Code phía gọi chỉ dùng ba thao tác public — nó không biết số dư là <code>double</code>, <code>BigDecimal</code> hay một dòng trong PostgreSQL:</p>
<pre class="trich"><code class="language-java">BankAccount acc = new BankAccount("FU-001");
acc.deposit(500);
acc.withdraw(200);
System.out.println("balance = " + acc.getBalance());
try { acc.withdraw(1000); } catch (IllegalStateException e) { System.out.println("rejected: " + e.getMessage()); }
try { acc.deposit(-50); }   catch (IllegalArgumentException e) { System.out.println("rejected: " + e.getMessage()); }
// lỗi biên dịch: balance là private
System.out.println("balance still = " + acc.getBalance());</code></pre>
<p><strong>Thiết kế interface từng bước:</strong> (1) liệt kê những gì đối tượng khác cần <em>từ</em> đối tượng này (động từ: nạp, rút, xem số dư); (2) viết mỗi thứ thành một chữ ký (tên, tham số, kiểu trả về); (3) ghi hợp đồng mỗi cái một dòng (đầu vào nào hợp lệ, lỗi thì sao); (4) dừng — <em>chưa</em> quyết định lưu trữ thế nào.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): REST API của LabFlow chính là một interface theo đúng nghĩa này. Thống nhất <code>POST /reservations</code>, <code>DELETE /reservations/{id}</code>, <code>GET /slots?labId=</code> với bạn làm frontend trước; sau đó mỗi bên tự thiết kế phần bên trong của mình.</div>`],
      [7, '3. Information hiding',
        `<p class="y-chinh">🎯 Step 2 — <strong>design the internals (detailed design)</strong>: decide how the object works — private attributes (<code>balance</code>, <code>accountNumber</code>) and hidden logic: in <code>withdraw</code> check <code>balance &gt;= amount</code>, in <code>deposit</code> ensure <code>amount &gt; 0</code>; these details are not exposed. (The slide numbers this section "3." by mistake — it is still section 2.)</p>
<pre><code class="language-java">// Slides 5-7: design an object in two steps — (1) the interface (public), (2) the internals (private)
class BankAccount {
    // Step 2 — internals: hidden data + hidden rules
    private final String accountNumber;
    private double balance;

    BankAccount(String accountNumber) { this.accountNumber = accountNumber; }

    // Step 1 — interface: what the object offers
    public void deposit(double amount) {
        if (amount &lt;= 0) throw new IllegalArgumentException("amount must be &gt; 0");   // rule hidden inside
        balance += amount;
    }
    public void withdraw(double amount) {
        if (balance &lt; amount) throw new IllegalStateException("insufficient balance"); // check balance &gt;= amount
        balance -= amount;
    }
    public double getBalance() { return balance; }
}

public class BankAccountHiding {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("FU-001");
        acc.deposit(500);
        acc.withdraw(200);
        System.out.println("balance = " + acc.getBalance());
        try { acc.withdraw(1000); } catch (IllegalStateException e) { System.out.println("rejected: " + e.getMessage()); }
        try { acc.deposit(-50); }   catch (IllegalArgumentException e) { System.out.println("rejected: " + e.getMessage()); }
        // acc.balance = 1_000_000;  &lt;- compile error: balance has private access
        System.out.println("balance still = " + acc.getBalance());
    }
}</code></pre>
<div class="out">balance = 300.0<br>
rejected: insufficient balance<br>
rejected: amount must be &gt; 0<br>
balance still = 300.0</div>
<p>The rules live in one place. No caller can set <code>acc.balance = 1_000_000</code> (compile error), and no caller can forget the "amount &gt; 0" check, because the caller never does the check — the object does.</p>
<p>Gomaa's warning (4.2.3): "It is generally not a good idea to reveal all the variables … through get and set operations — little information is hidden." A class with a getter and setter for every field is information hiding in name only.</p>
<div class="callout">➕ <strong>Beyond the slide — coupling and cohesion, the two measures of a good module.</strong> Information hiding is the <em>technique</em>; these two words (Stevens, Myers and Constantine, 1974) are how you <em>judge</em> the result, and SWD392 exams and interviews use them constantly.
<ul>
<li><strong>Cohesion (độ kết dính)</strong> — how strongly the things <em>inside one module</em> belong together. Aim <strong>high</strong>: one clear responsibility. Scale from worst to best: coincidental → logical → temporal → procedural → communicational → sequential → <strong>functional</strong>.</li>
<li><strong>Coupling (độ ghép nối)</strong> — how much one module <em>depends on others</em>. Aim <strong>low</strong>: depend on few modules, through small interfaces. Scale from worst to best: content → common (global data) → external → control → stamp → <strong>data</strong>.</li>
</ul></div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/85524fe06bbb1f92428a85efc5dbe159461d2117.svg" alt="Before: one &quot;manager&quot; class does everything (low cohesion) and every page depends on it (high coupling). After: focused classes, dependencies through interfaces" loading="lazy" /><p class="chu-thich">🧩 Before: one "manager" class does everything (low cohesion) and every page depends on it (high coupling). After: focused classes, dependencies through interfaces</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Beyond the slide — low cohesion + high coupling (left) refactored to high cohesion + low coupling (right)
package "Before" {
  class LabFlowManager {
    + reserve(slot)
    + sendEmail(to, text)
    + exportExcel()
    + hashPassword(pw)
    + calculateFine(days)
    - jdbcConnection
  }
  class ReportPage
  class LoginPage
  class BookingPage
  ReportPage --&gt; LabFlowManager
  LoginPage --&gt; LabFlowManager
  BookingPage --&gt; LabFlowManager
}
package "After" {
  class ReservationService {
    + reserve(slot)
    + cancel(id)
  }
  interface Notifier {
    + send(to, text)
  }
  interface ReservationRepository {
    + save(r)
  }
  class FineCalculator {
    + calculateFine(days)
  }
  ReservationService ..&gt; Notifier
  ReservationService ..&gt; ReservationRepository
  ReservationService ..&gt; FineCalculator
}
@enduml</code></pre></details>
<div class="pitfall">Memorise the direction: <strong>high cohesion, low coupling</strong>. Options like "high coupling improves reuse" or "low cohesion means focused" are traps. Global data is <em>common coupling</em> — exactly what Parnas's information hiding removes.</div>`,
        `<p class="y-chinh">🎯 Bước 2 — <strong>thiết kế phần bên trong (thiết kế chi tiết)</strong>: quyết định đối tượng chạy thế nào — thuộc tính private (<code>balance</code>, <code>accountNumber</code>) và logic ẩn: trong <code>withdraw</code> kiểm <code>balance &gt;= amount</code>, trong <code>deposit</code> bảo đảm <code>amount &gt; 0</code>; các chi tiết này không lộ ra ngoài. (Slide đánh số mục này là "3." — nhầm, nó vẫn là mục 2.)</p>
<pre><code class="language-java">// Slide 5-7: thiết kế đối tượng hai bước — (1) interface (public), (2) phần bên trong (private)
class BankAccount {
    // Bước 2 — bên trong: dữ liệu ẩn + luật ẩn
    private final String accountNumber;
    private double balance;

    BankAccount(String accountNumber) { this.accountNumber = accountNumber; }

    // Bước 1 — interface: đối tượng cung cấp dịch vụ gì
    public void deposit(double amount) {
        if (amount &lt;= 0) throw new IllegalArgumentException("amount must be &gt; 0");   // luật nằm bên trong
        balance += amount;
    }
    public void withdraw(double amount) {
        if (balance &lt; amount) throw new IllegalStateException("insufficient balance"); // kiểm balance &gt;= amount
        balance -= amount;
    }
    public double getBalance() { return balance; }
}

public class BankAccountHiding {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("FU-001");
        acc.deposit(500);
        acc.withdraw(200);
        System.out.println("balance = " + acc.getBalance());
        try { acc.withdraw(1000); } catch (IllegalStateException e) { System.out.println("rejected: " + e.getMessage()); }
        try { acc.deposit(-50); }   catch (IllegalArgumentException e) { System.out.println("rejected: " + e.getMessage()); }
        // lỗi biên dịch: balance là private
        System.out.println("balance still = " + acc.getBalance());
    }
}</code></pre>
<div class="out">balance = 300.0<br>
rejected: insufficient balance<br>
rejected: amount must be &gt; 0<br>
balance still = 300.0</div>
<p>Các luật nằm ở một chỗ. Không phía gọi nào gán được <code>acc.balance = 1_000_000</code> (lỗi biên dịch), và không phía gọi nào quên được việc kiểm "amount &gt; 0", vì phía gọi không bao giờ tự kiểm — đối tượng kiểm.</p>
<p>Lời cảnh báo của Gomaa (4.2.3): "Nói chung không nên lộ mọi biến … qua các thao tác get và set — như vậy chẳng giấu được bao nhiêu." Một lớp có getter và setter cho mọi trường chỉ che giấu thông tin trên danh nghĩa.</p>
<div class="callout">➕ <strong>Mở rộng ngoài slide — ghép nối và kết dính, hai thước đo của một module tốt.</strong> Che giấu thông tin là <em>kỹ thuật</em>; hai từ này (Stevens, Myers và Constantine, 1974) là cách bạn <em>chấm</em> kết quả, và đề thi SWD392 lẫn phỏng vấn dùng chúng liên tục.
<ul>
<li><strong>Cohesion — độ kết dính</strong>: các thứ <em>bên trong một module</em> gắn bó với nhau chặt tới đâu. Nhắm <strong>cao</strong>: một trách nhiệm rõ ràng. Thang từ tệ tới tốt: coincidental (ngẫu nhiên) → logical (cùng loại) → temporal (cùng thời điểm) → procedural (cùng thủ tục) → communicational (cùng dữ liệu) → sequential (nối tiếp) → <strong>functional (cùng một chức năng)</strong>.</li>
<li><strong>Coupling — độ ghép nối</strong>: một module <em>phụ thuộc module khác</em> nhiều tới đâu. Nhắm <strong>thấp</strong>: phụ thuộc ít module, qua interface nhỏ. Thang từ tệ tới tốt: content (chọc vào ruột nhau) → common (dữ liệu toàn cục) → external → control (truyền cờ điều khiển) → stamp (truyền cả cấu trúc) → <strong>data (chỉ truyền dữ liệu cần)</strong>.</li>
</ul></div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/85524fe06bbb1f92428a85efc5dbe159461d2117.svg" alt="Trước: một lớp &quot;manager&quot; làm mọi việc (kết dính thấp) và trang nào cũng phụ thuộc nó (ghép nối chặt). Sau: các lớp tập trung, phụ thuộc qua interface" loading="lazy" /><p class="chu-thich">🧩 Trước: một lớp "manager" làm mọi việc (kết dính thấp) và trang nào cũng phụ thuộc nó (ghép nối chặt). Sau: các lớp tập trung, phụ thuộc qua interface</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Mở rộng — kết dính thấp + ghép nối chặt (trái) được tách thành kết dính cao + ghép nối lỏng (phải)
package "Before" {
  class LabFlowManager {
    + reserve(slot)
    + sendEmail(to, text)
    + exportExcel()
    + hashPassword(pw)
    + calculateFine(days)
    - jdbcConnection
  }
  class ReportPage
  class LoginPage
  class BookingPage
  ReportPage --&gt; LabFlowManager
  LoginPage --&gt; LabFlowManager
  BookingPage --&gt; LabFlowManager
}
package "After" {
  class ReservationService {
    + reserve(slot)
    + cancel(id)
  }
  interface Notifier {
    + send(to, text)
  }
  interface ReservationRepository {
    + save(r)
  }
  class FineCalculator {
    + calculateFine(days)
  }
  ReservationService ..&gt; Notifier
  ReservationService ..&gt; ReservationRepository
  ReservationService ..&gt; FineCalculator
}
@enduml</code></pre></details>
<div class="pitfall">Thuộc lòng chiều: <strong>kết dính cao, ghép nối thấp (high cohesion, low coupling)</strong>. Phương án kiểu "ghép nối cao giúp tái sử dụng" hay "kết dính thấp nghĩa là tập trung" là bẫy. Dữ liệu toàn cục là <em>common coupling</em> — chính thứ mà che giấu thông tin của Parnas loại bỏ.</div>`],
      [8, '4. Inheritance and generalization/specialization',
        `<p class="y-chinh">🎯 <strong>Inheritance</strong> is a useful abstraction mechanism in analysis and design, a <strong>classification</strong> mechanism used in many fields, and a mechanism for <strong>sharing and reusing code</strong> between classes: a child class inherits the properties (encapsulated data and operations) of a parent class.</p>
<p>Classification example from the book: animals → mammals, fish, reptiles; cats and dogs share mammal properties but a dog barks and a cat mews. In software the <strong>parent</strong> is called <em>superclass</em> or <em>base class</em>, the <strong>child</strong> <em>subclass</em> or <em>derived class</em>; adapting a parent into a child is <strong>specialization</strong>, the reverse view is <strong>generalization</strong>.</p>
<p>A child adapts its parent in two ways: it <strong>adds</strong> instance variables and operations, and it may <strong>redefine</strong> (override) operations. Gomaa's bank example (Figure 4.9, not on the slide):</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/81812c8794a66287faba806139f69c9fb99a600d.svg" alt="Gomaa Figure 4.9: common attributes go up to Account; each subclass adds its own attributes and operations; CheckingAccount redefines credit()" loading="lazy" /><p class="chu-thich">🧩 Gomaa Figure 4.9: common attributes go up to Account; each subclass adds its own attributes and operations; CheckingAccount redefines credit()</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Gomaa Figure 4.9 (beyond the slide) — a generalization/specialization hierarchy of bank accounts
class Account {
  # accountNumber : Integer
  # balance : Real = 0
  + readBalance() : Real
  + credit(amount : Real)
  + debit(amount : Real)
  + open(accountNumber : Integer)
  + close()
}
class CheckingAccount {
  - lastDepositAmount : Real = 0
  + credit(amount : Real)
  + readLastDepositAmount() : Real
}
class SavingsAccount {
  - cumulativeInterest : Real = 0
  + addInterest(interestRate : Real)
  + readCumulativeInterest() : Real
}
CheckingAccount -up-|&gt; Account
SavingsAccount -up-|&gt; Account
@enduml</code></pre></details>
<div class="pitfall">Gomaa's question 10: "What is inheritance?" → <strong>a mechanism for sharing and reusing code between classes</strong>. And the book warns: a child <em>suppressing</em> an operation of its parent is possible but not recommended — the subclass would no longer share the superclass's interface (this is the Liskov idea you meet with SOLID).</div>`,
        `<p class="y-chinh">🎯 <strong>Kế thừa (inheritance)</strong> là cơ chế trừu tượng hữu ích trong phân tích và thiết kế, là cơ chế <strong>phân loại (classification)</strong> dùng ở nhiều ngành, và là cơ chế <strong>chia sẻ và tái sử dụng code</strong> giữa các lớp: lớp con thừa hưởng các thuộc tính (dữ liệu được đóng gói và thao tác) của lớp cha.</p>
<p>Ví dụ phân loại trong sách: động vật → thú, cá, bò sát; chó và mèo có chung đặc điểm của thú nhưng chó sủa còn mèo kêu meo. Trong phần mềm, <strong>cha</strong> gọi là <em>superclass</em> hay <em>base class</em> (lớp cơ sở), <strong>con</strong> là <em>subclass</em> hay <em>derived class</em> (lớp dẫn xuất); biến cha thành con là <strong>chuyên biệt hoá (specialization)</strong>, nhìn ngược lại là <strong>tổng quát hoá (generalization)</strong>.</p>
<p>Lớp con điều chỉnh lớp cha theo hai cách: <strong>thêm</strong> biến thể hiện và thao tác, và có thể <strong>định nghĩa lại</strong> (ghi đè — override) thao tác. Ví dụ ngân hàng của Gomaa (Hình 4.9, không có trên slide):</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/81812c8794a66287faba806139f69c9fb99a600d.svg" alt="Hình 4.9 của Gomaa: thuộc tính chung dồn lên Account; mỗi lớp con thêm thuộc tính và thao tác riêng; CheckingAccount định nghĩa lại credit()" loading="lazy" /><p class="chu-thich">🧩 Hình 4.9 của Gomaa: thuộc tính chung dồn lên Account; mỗi lớp con thêm thuộc tính và thao tác riêng; CheckingAccount định nghĩa lại credit()</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 4.9 của Gomaa (mở rộng) — cây tổng quát hoá/chuyên biệt hoá của tài khoản ngân hàng
class Account {
  # accountNumber : Integer
  # balance : Real = 0
  + readBalance() : Real
  + credit(amount : Real)
  + debit(amount : Real)
  + open(accountNumber : Integer)
  + close()
}
class CheckingAccount {
  - lastDepositAmount : Real = 0
  + credit(amount : Real)
  + readLastDepositAmount() : Real
}
class SavingsAccount {
  - cumulativeInterest : Real = 0
  + addInterest(interestRate : Real)
  + readCumulativeInterest() : Real
}
CheckingAccount -up-|&gt; Account
SavingsAccount -up-|&gt; Account
@enduml</code></pre></details>
<div class="pitfall">Câu 10 của Gomaa: "Inheritance là gì?" → <strong>cơ chế chia sẻ và tái sử dụng code giữa các lớp</strong>. Và sách cảnh báo: lớp con <em>chặn bỏ</em> một thao tác của cha thì làm được nhưng không nên — lớp con sẽ không còn chung interface với lớp cha (đây là ý Liskov mà bạn sẽ gặp ở SOLID).</div>`],
      [9, '4. Inheritance and generalization/specialization',
        `<p class="y-chinh">🎯 The slide's Java code of the parent class <code>Person</code>: two <code>protected</code> attributes <code>name</code> and <code>age</code> (encapsulated data), a constructor <code>Person(String name, int age)</code>, and the operation <code>introduce()</code> that prints "I am … years old."</p>
<p><strong>Read it line by line:</strong> <code>protected</code> = visible in the class and its subclasses (UML <code>#</code>, lesson 1.B) — chosen so that <code>Student</code> can use <code>name</code> directly. The constructor fills the attributes with <code>this.name = name</code> (<code>this</code> = "the object being created"). <code>introduce()</code> is the behaviour every person has.</p>
<p>Why <code>protected</code> and not <code>private</code>? It is a trade-off. <code>protected</code> is convenient for subclasses but couples them to the parent's fields: rename <code>name</code> and every subclass breaks. Many teams keep fields <code>private</code> and give subclasses a <code>protected getName()</code> instead — information hiding applied to inheritance.</p>
<p class="meo">🧠 The slide's comments are Vietnamese — "Lớp cha (Parent class / Superclass)", "Thuộc tính (encapsulated data)", "Phương thức (operation)". Map each word to its English term; the exam is in English.</p>`,
        `<p class="y-chinh">🎯 Code Java của lớp cha <code>Person</code> trên slide: hai thuộc tính <code>protected</code> là <code>name</code> và <code>age</code> (dữ liệu được đóng gói), một constructor <code>Person(String name, int age)</code>, và thao tác <code>introduce()</code> in ra "I am … years old."</p>
<p><strong>Đọc từng dòng:</strong> <code>protected</code> = thấy được trong lớp và các lớp con (UML ghi <code>#</code>, bài 1.B) — chọn vậy để <code>Student</code> dùng thẳng <code>name</code>. Constructor (hàm khởi tạo) gán giá trị cho thuộc tính bằng <code>this.name = name</code> (<code>this</code> = "đối tượng đang được tạo"). <code>introduce()</code> là hành vi mà người nào cũng có.</p>
<p>Sao lại <code>protected</code> mà không <code>private</code>? Đó là một sự đánh đổi. <code>protected</code> tiện cho lớp con nhưng buộc chặt chúng vào trường của cha: đổi tên <code>name</code> là mọi lớp con hỏng. Nhiều đội giữ trường <code>private</code> và cho lớp con một <code>protected getName()</code> — che giấu thông tin áp vào kế thừa.</p>
<p class="meo">🧠 Chú thích trên slide viết tiếng Việt — "Lớp cha (Parent class / Superclass)", "Thuộc tính (encapsulated data)", "Phương thức (operation)". Hãy nối mỗi từ với thuật ngữ tiếng Anh; đề thi viết bằng tiếng Anh.</p>`],
      [10, '4. Inheritance and generalization/specialization',
        `<p class="y-chinh">🎯 The subclass <code>Student extends Person</code>: it adds a private <code>studentId</code>, calls the parent constructor with <code>super(name, age)</code>, adds its own operation <code>study()</code>, and <strong>overrides</strong> <code>introduce()</code> with <code>@Override</code>.</p>
<p>The slide's two classes, plus a <code>Teacher</code> and a <code>Staff</code> from slides 11–12, running together:</p>
<pre><code class="language-java">// Slides 9-13: Person (superclass) and Student (subclass) from the slide, plus Teacher (step 4) and Staff (step 7)
import java.util.List;

class Person {
    protected String name;   // # in UML
    protected int age;

    public Person(String name, int age) { this.name = name; this.age = age; }

    public void introduce() { System.out.println("I am " + name + ", " + age + " years old."); }
}

class Student extends Person {
    private String studentId;

    public Student(String name, int age, String studentId) {
        super(name, age);                 // call the parent constructor
        this.studentId = studentId;
    }
    public void study() { System.out.println(name + " is studying."); }

    @Override
    public void introduce() { System.out.println("I am student " + name + ", " + age + " years old, ID: " + studentId); }
}

class Teacher extends Person {
    private String employeeId;
    public Teacher(String name, int age, String employeeId) { super(name, age); this.employeeId = employeeId; }
    public void teach() { System.out.println(name + " is teaching SWD392."); }
}

class Staff extends Person {             // step 7: extend later without touching Person
    public Staff(String name, int age) { super(name, age); }
}

public class InheritancePerson {
    public static void main(String[] args) {
        List&lt;Person&gt; people = List.of(
            new Student("Cuong", 20, "SE190001"),
            new Teacher("Lan", 35, "EMP042"),
            new Staff("Minh", 28));
        for (Person p : people) p.introduce();   // same call, behaviour chosen by the real class
        ((Student) people.get(0)).study();
        ((Teacher) people.get(1)).teach();
    }
}</code></pre>
<div class="out">I am student Cuong, 20 years old, ID: SE190001<br>
I am Lan, 35 years old.<br>
I am Minh, 28 years old.<br>
Cuong is studying.<br>
Lan is teaching SWD392.</div>
<p><strong>Read the output:</strong> the loop calls the same <code>p.introduce()</code> three times, but the Student prints its ID — Java picks the method of the <em>real</em> class at run time (<strong>polymorphism</strong>, dynamic binding). Teacher and Staff did not override, so they inherit Person's version. <code>study()</code> and <code>teach()</code> exist only in their subclasses, so we need a cast to call them through a <code>Person</code> variable.</p>
<ul>
<li><code>super(name, age)</code> must be the first line of the child constructor — the parent part of the object is built first.</li>
<li><code>@Override</code> asks the compiler to check that a parent method with the same signature really exists — a typo like <code>introduse()</code> becomes a compile error instead of a silent new method.</li>
</ul>`,
        `<p class="y-chinh">🎯 Lớp con <code>Student extends Person</code>: thêm <code>studentId</code> private, gọi constructor của cha bằng <code>super(name, age)</code>, thêm thao tác riêng <code>study()</code>, và <strong>ghi đè (override)</strong> <code>introduce()</code> với <code>@Override</code>.</p>
<p>Hai lớp của slide, thêm <code>Teacher</code> và <code>Staff</code> từ slide 11–12, chạy cùng nhau:</p>
<pre><code class="language-java">// Slide 9-13: Person (lớp cha) và Student (lớp con) của slide, thêm Teacher (bước 4) và Staff (bước 7)
import java.util.List;

class Person {
    protected String name;   // # trong UML
    protected int age;

    public Person(String name, int age) { this.name = name; this.age = age; }

    public void introduce() { System.out.println("I am " + name + ", " + age + " years old."); }
}

class Student extends Person {
    private String studentId;

    public Student(String name, int age, String studentId) {
        super(name, age);                 // gọi constructor lớp cha
        this.studentId = studentId;
    }
    public void study() { System.out.println(name + " is studying."); }

    @Override
    public void introduce() { System.out.println("I am student " + name + ", " + age + " years old, ID: " + studentId); }
}

class Teacher extends Person {
    private String employeeId;
    public Teacher(String name, int age, String employeeId) { super(name, age); this.employeeId = employeeId; }
    public void teach() { System.out.println(name + " is teaching SWD392."); }
}

class Staff extends Person {             // bước 7: thêm sau mà không sửa Person
    public Staff(String name, int age) { super(name, age); }
}

public class InheritancePerson {
    public static void main(String[] args) {
        List&lt;Person&gt; people = List.of(
            new Student("Cuong", 20, "SE190001"),
            new Teacher("Lan", 35, "EMP042"),
            new Staff("Minh", 28));
        for (Person p : people) p.introduce();   // cùng lời gọi, hành vi theo lớp thật
        ((Student) people.get(0)).study();
        ((Teacher) people.get(1)).teach();
    }
}</code></pre>
<div class="out">I am student Cuong, 20 years old, ID: SE190001<br>
I am Lan, 35 years old.<br>
I am Minh, 28 years old.<br>
Cuong is studying.<br>
Lan is teaching SWD392.</div>
<p><strong>Đọc output:</strong> vòng lặp gọi cùng một <code>p.introduce()</code> ba lần, nhưng Student in ra mã số — Java chọn phương thức của lớp <em>thật</em> lúc chạy (<strong>đa hình — polymorphism</strong>, liên kết động — dynamic binding). Teacher và Staff không ghi đè nên dùng bản của Person. <code>study()</code> và <code>teach()</code> chỉ có ở lớp con, nên phải ép kiểu (cast) mới gọi được qua biến kiểu <code>Person</code>.</p>
<ul>
<li><code>super(name, age)</code> phải là dòng đầu tiên của constructor lớp con — phần "cha" của đối tượng được dựng trước.</li>
<li><code>@Override</code> nhờ trình biên dịch kiểm tra đúng là có phương thức cha cùng chữ ký — gõ nhầm <code>introduse()</code> sẽ thành lỗi biên dịch thay vì lặng lẽ tạo phương thức mới.</li>
</ul>`],
      [11, '4. Inheritance and generalization/specialization',
        `<p class="y-chinh">🎯 Steps to identify inheritance in analysis and design (1–4): (1) identify the entities of the problem domain; (2) group objects with common characteristics; (3) define the superclass with the shared characteristics; (4) define subclasses that inherit and add their own.</p>
<table>
<thead><tr><th>Step</th><th>What you do</th><th>School example</th><th>LabFlow (illustration)</th></tr></thead>
<tbody>
<tr><td>1 Identify entities</td><td>read requirements, list the main objects</td><td>Person, Student, Teacher, Staff, Course</td><td>Member, LabManager, Admin, Equipment, Reservation</td></tr>
<tr><td>2 Group common characteristics</td><td>compare data and behaviour</td><td>Student and Teacher both have name, age, address</td><td>Member and LabManager both have fullName, email, login()</td></tr>
<tr><td>3 Define the superclass</td><td>put the shared part in a more abstract class</td><td>Person: name, age, introduce()</td><td>User: fullName, email, login()</td></tr>
<tr><td>4 Define subclasses</td><td>each adds what is unique</td><td>Student: studentId, study(); Teacher: employeeId, teach()</td><td>Member: studentCode, reserve(); LabManager: approve()</td></tr>
</tbody>
</table>
<p>Work bottom-up: you do not start by inventing a superclass; you <em>discover</em> it by noticing repetition among concrete classes. If you find no real repetition, you need no superclass.</p>`,
        `<p class="y-chinh">🎯 Các bước tìm kế thừa khi phân tích và thiết kế (1–4): (1) xác định các thực thể của miền bài toán; (2) gom các đối tượng có đặc điểm chung; (3) định nghĩa lớp cha chứa phần chung; (4) định nghĩa lớp con thừa hưởng và thêm phần riêng.</p>
<table>
<thead><tr><th>Bước</th><th>Làm gì</th><th>Ví dụ của trường</th><th>LabFlow (minh hoạ)</th></tr></thead>
<tbody>
<tr><td>1 Xác định thực thể</td><td>đọc yêu cầu, liệt kê đối tượng chính</td><td>Person, Student, Teacher, Staff, Course</td><td>Member, LabManager, Admin, Equipment, Reservation</td></tr>
<tr><td>2 Gom đặc điểm chung</td><td>so dữ liệu và hành vi</td><td>Student và Teacher đều có name, age, address</td><td>Member và LabManager đều có fullName, email, login()</td></tr>
<tr><td>3 Định nghĩa lớp cha</td><td>đưa phần chung vào lớp trừu tượng hơn</td><td>Person: name, age, introduce()</td><td>User: fullName, email, login()</td></tr>
<tr><td>4 Định nghĩa lớp con</td><td>mỗi lớp thêm phần riêng</td><td>Student: studentId, study(); Teacher: employeeId, teach()</td><td>Member: studentCode, reserve(); LabManager: approve()</td></tr>
</tbody>
</table>
<p>Làm từ dưới lên: bạn không bắt đầu bằng việc bịa ra một lớp cha; bạn <em>phát hiện</em> nó khi thấy các lớp cụ thể lặp lại nhau. Không có lặp thật thì không cần lớp cha.</p>`],
      [12, '4. Inheritance and generalization/specialization',
        `<p class="y-chinh">🎯 Steps 5–7: (5) validate with the <strong>"is-a"</strong> test — a Student <em>is a</em> Person (valid), a Course is <em>not</em> a Person (no inheritance); (6) choose the abstraction level — an <strong>abstract class</strong> if the superclass defines general behaviour and should not be instantiated, an <strong>interface</strong> if only common behaviour without shared data is needed; (7) design for reuse and extension — e.g. Staff can inherit from Person later.</p>
<table>
<thead><tr><th>Question</th><th>Abstract class</th><th>Interface</th></tr></thead>
<tbody>
<tr><td>Shares data (fields)?</td><td>yes (name, age)</td><td>no — only method contracts</td></tr>
<tr><td>Can be instantiated?</td><td>no</td><td>no</td></tr>
<tr><td>A class can have how many?</td><td>one parent (Java)</td><td>many</td></tr>
<tr><td>Use when</td><td>related classes share state + code: Person → Student/Teacher</td><td>unrelated classes share a capability: Searchable, Notifier</td></tr>
</tbody>
</table>
<p><strong>The "is-a" test is also a "has-a" test in disguise:</strong> a Student <em>has</em> Courses — that is an <em>association</em>, not inheritance. A Car <em>has an</em> Engine — composition. Use inheritance only for genuine "kind of" relationships.</p>
<div class="callout">➕ <strong>Beyond the slide — "favour composition over inheritance"</strong> (GoF, 1994). Deep inheritance trees are fragile: a change in the parent ripples to every child. When the relationship is "uses" or "has", or behaviour must change at run time, give the object a field of an interface type instead. Chapter 4 of this course (patterns) shows this many times.</div>
<div class="pitfall">Trap: "Course extends Person because both have a name" — shared attributes are <strong>not</strong> enough; the is-a sentence must be true in the real world.</div>`,
        `<p class="y-chinh">🎯 Bước 5–7: (5) kiểm bằng phép thử <strong>"is-a" (là một)</strong> — Student <em>là một</em> Person (hợp lệ), Course <em>không phải</em> Person (không kế thừa); (6) chọn mức trừu tượng — <strong>lớp trừu tượng (abstract class)</strong> nếu lớp cha chỉ định nghĩa hành vi chung và không nên tạo đối tượng, <strong>interface</strong> nếu chỉ cần hành vi chung mà không chia sẻ dữ liệu; (7) tính tới tái sử dụng và mở rộng — ví dụ sau này Staff cũng kế thừa được từ Person.</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Abstract class — lớp trừu tượng</th><th>Interface</th></tr></thead>
<tbody>
<tr><td>Chia sẻ dữ liệu (trường)?</td><td>có (name, age)</td><td>không — chỉ hợp đồng phương thức</td></tr>
<tr><td>Tạo đối tượng trực tiếp được?</td><td>không</td><td>không</td></tr>
<tr><td>Một lớp có được mấy cái?</td><td>một lớp cha (Java)</td><td>nhiều</td></tr>
<tr><td>Dùng khi</td><td>các lớp họ hàng chung trạng thái + code: Person → Student/Teacher</td><td>các lớp không họ hàng chung một năng lực: Searchable, Notifier</td></tr>
</tbody>
</table>
<p><strong>Phép thử "is-a" thật ra cũng là phép thử "has-a" (có một):</strong> Student <em>có</em> các Course — đó là <em>liên kết (association)</em>, không phải kế thừa. Car <em>có một</em> Engine — hợp thành (composition). Chỉ dùng kế thừa cho quan hệ "là một loại của" thật sự.</p>
<div class="callout">➕ <strong>Mở rộng ngoài slide — "ưu tiên hợp thành hơn kế thừa" (favour composition over inheritance)</strong> (GoF, 1994). Cây kế thừa sâu rất dễ vỡ: sửa lớp cha là lan xuống mọi lớp con. Khi quan hệ là "dùng" hay "có", hoặc hành vi phải đổi lúc chạy, hãy cho đối tượng một trường có kiểu interface. Chương 4 của khoá này (design pattern) cho thấy điều đó rất nhiều lần.</div>
<div class="pitfall">Bẫy: "Course extends Person vì cả hai đều có name" — chung thuộc tính là <strong>chưa đủ</strong>; câu "là một" phải đúng ngoài đời thật.</div>`],
      [13, '4. Inheritance and generalization/specialization',
        `<p class="y-chinh">🎯 The slide's class diagram (drawn in Visual Paradigm): <code>Person</code> (<code>#name : string</code>, <code>#age : int</code>, <code>+Person(name, age)</code>, <code>+introduce() : void</code>) and <code>Student</code> (<code>-studentId : string</code>, constructor, <code>+introduce() : void</code>, <code>+study() : void</code>) joined by a <strong>generalization</strong> arrow with a hollow triangle at Person.</p>
<p>Redrawn in PlantUML and completed with the other subclasses and the "not a Person" class from slides 11–12:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/53eeb4118fb01cd239ba65ac3544863b43837413.svg" alt="Person with three subclasses (hollow triangle at the parent); Course is linked by associations, not by inheritance" loading="lazy" /><p class="chu-thich">🧩 Person with three subclasses (hollow triangle at the parent); Course is linked by associations, not by inheritance</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slides 11-13 — generalization/specialization: Person is the superclass; Student, Teacher, Staff are subclasses; Course is NOT a Person (association, not inheritance)
class Person {
  # name : String
  # age : int
  + Person(name, age)
  + introduce() : void
}
class Student {
  - studentId : String
  + Student(name : String, age : int, studentId : String)
  + introduce() : void
  + study() : void
}
class Teacher {
  - employeeId : String
  + teach() : void
}
class Staff
class Course {
  - code : String
}
Student -up-|&gt; Person
Teacher -up-|&gt; Person
Staff -up-|&gt; Person
Student "0..*" -- "1..*" Course : enrolls in &gt;
Teacher "1" -- "0..*" Course : teaches &gt;
@enduml</code></pre></details>
<p><strong>Read the code ↔ diagram mapping:</strong> <code>protected</code> → <code>#</code>, <code>private</code> → <code>-</code>, <code>public</code> → <code>+</code>; <code>extends</code> → solid line with hollow triangle pointing to the parent; <code>introduce()</code> listed again in Student = it is overridden. Inherited attributes (<code>name</code>, <code>age</code>) are <strong>not</strong> repeated in the subclass box.</p>
<div class="pitfall">PE drawing mistakes: (a) triangle at the child — wrong, it points to the <strong>parent</strong>; (b) copying <code>name</code>, <code>age</code> into Student — wrong, inherited members are not redrawn; (c) using a dashed line — that is <em>realization</em> (implements an interface), not generalization.</div>`,
        `<p class="y-chinh">🎯 Class diagram trên slide (vẽ bằng Visual Paradigm): <code>Person</code> (<code>#name : string</code>, <code>#age : int</code>, <code>+Person(name, age)</code>, <code>+introduce() : void</code>) và <code>Student</code> (<code>-studentId : string</code>, constructor, <code>+introduce() : void</code>, <code>+study() : void</code>) nối bằng mũi tên <strong>tổng quát hoá</strong> có tam giác rỗng ở phía Person.</p>
<p>Vẽ lại bằng PlantUML và bổ sung các lớp con còn lại cùng lớp "không phải Person" của slide 11–12:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/53eeb4118fb01cd239ba65ac3544863b43837413.svg" alt="Person với ba lớp con (tam giác rỗng ở lớp cha); Course nối bằng liên kết, không phải kế thừa" loading="lazy" /><p class="chu-thich">🧩 Person với ba lớp con (tam giác rỗng ở lớp cha); Course nối bằng liên kết, không phải kế thừa</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 11-13 — tổng quát hoá/chuyên biệt hoá: Person là lớp cha; Student, Teacher, Staff là lớp con; Course KHÔNG phải Person (liên kết, không kế thừa)
class Person {
  # name : String
  # age : int
  + Person(name, age)
  + introduce() : void
}
class Student {
  - studentId : String
  + Student(name : String, age : int, studentId : String)
  + introduce() : void
  + study() : void
}
class Teacher {
  - employeeId : String
  + teach() : void
}
class Staff
class Course {
  - code : String
}
Student -up-|&gt; Person
Teacher -up-|&gt; Person
Staff -up-|&gt; Person
Student "0..*" -- "1..*" Course : enrolls in &gt;
Teacher "1" -- "0..*" Course : teaches &gt;
@enduml</code></pre></details>
<p><strong>Đọc cách code ↔ sơ đồ khớp nhau:</strong> <code>protected</code> → <code>#</code>, <code>private</code> → <code>-</code>, <code>public</code> → <code>+</code>; <code>extends</code> → nét liền có tam giác rỗng chỉ về lớp cha; <code>introduce()</code> ghi lại trong Student = nó được ghi đè. Thuộc tính thừa hưởng (<code>name</code>, <code>age</code>) <strong>không</strong> ghi lại trong hộp lớp con.</p>
<div class="pitfall">Lỗi vẽ trong bài PE: (a) tam giác đặt ở lớp con — sai, nó chỉ về <strong>lớp cha</strong>; (b) chép <code>name</code>, <code>age</code> xuống Student — sai, thành phần thừa hưởng không vẽ lại; (c) dùng nét đứt — đó là <em>hiện thực hoá (realization)</em>, cài đặt interface, không phải tổng quát hoá.</div>`],
    ]),
    bi(`<h2>📌 Must-know after slides 1–13</h2>
<table>
<thead><tr><th>Term</th><th>One-line definition (Gomaa)</th></tr></thead>
<tbody>
<tr><td>object</td><td>groups data and the operations that operate on the data; has identity</td></tr>
<tr><td>class</td><td>collection of objects with the same characteristics; an object is its instance</td></tr>
<tr><td>attribute / operation</td><td>data value held by an object / specification of a function performed by an object</td></tr>
<tr><td>signature</td><td>operation name + parameters + return value</td></tr>
<tr><td>interface</td><td>the set of operations an object provides</td></tr>
<tr><td>information hiding</td><td>hide a design decision likely to change (the module's secret) behind an interface</td></tr>
<tr><td>data abstraction</td><td>encapsulate a data structure so its structure is hidden</td></tr>
<tr><td>inheritance</td><td>mechanism for sharing and reusing code between classes (is-a)</td></tr>
<tr><td>cohesion / coupling (➕)</td><td>aim for high cohesion inside a module, low coupling between modules</td></tr>
</tbody>
</table>
<p>Continue with lesson 1.F's second half, 1.G: concurrent objects and messages, design patterns, architecture = components + connectors, quality attributes.</p>`,
    `<h2>📌 Phải nhớ sau slide 1–13</h2>
<table>
<thead><tr><th>Thuật ngữ</th><th>Định nghĩa một dòng (Gomaa)</th></tr></thead>
<tbody>
<tr><td>object — đối tượng</td><td>gom dữ liệu và các thao tác xử lý dữ liệu đó; có định danh</td></tr>
<tr><td>class — lớp</td><td>tập đối tượng cùng đặc điểm; đối tượng là thể hiện của nó</td></tr>
<tr><td>attribute / operation</td><td>giá trị dữ liệu đối tượng giữ / đặc tả một chức năng đối tượng thực hiện</td></tr>
<tr><td>signature — chữ ký</td><td>tên thao tác + tham số + giá trị trả về</td></tr>
<tr><td>interface</td><td>tập các thao tác một đối tượng cung cấp</td></tr>
<tr><td>information hiding — che giấu thông tin</td><td>giấu một quyết định thiết kế dễ thay đổi (bí mật của module) sau một interface</td></tr>
<tr><td>data abstraction — trừu tượng hoá dữ liệu</td><td>đóng gói cấu trúc dữ liệu để cấu trúc bị giấu</td></tr>
<tr><td>inheritance — kế thừa</td><td>cơ chế chia sẻ và tái sử dụng code giữa các lớp (is-a)</td></tr>
<tr><td>cohesion / coupling (➕)</td><td>kết dính cao bên trong module, ghép nối thấp giữa các module</td></tr>
</tbody>
</table>
<p>Học tiếp bài 1.G: đối tượng đồng thời và thông điệp, mẫu thiết kế, kiến trúc = component + connector, thuộc tính chất lượng.</p>`),
    books([
      ['gomaa', 'Chapter 4, sections 4.1–4.3 (Figures 4.1–4.9) and exercises 1–10', 'Chương 4, mục 4.1–4.3 (Hình 4.1–4.9) và câu trắc nghiệm 1–10'],
      ['fowler', 'Chapter 3 "Class Diagrams: The Essentials" (generalization) and Chapter 5 "Class Diagrams: Advanced Concepts" (interfaces and abstract classes)', 'Chương 3 "Class Diagrams: The Essentials" (tổng quát hoá) và Chương 5 "Class Diagrams: Advanced Concepts" (interface và lớp trừu tượng)'],
      ['gof', 'Introduction, section "Class versus Interface Inheritance" and "Favor object composition over class inheritance"', 'Phần mở đầu, mục "Class versus Interface Inheritance" và "Favor object composition over class inheritance"'],
      ['plantuml', '"Class Diagram" — visibility, abstract/interface, generalization; "Object Diagram"', 'mục "Class Diagram" — tầm nhìn, abstract/interface, tổng quát hoá; "Object Diagram"'],
      ['fuSlides', 'deck "Chapter 4: Software Design and Architecture Concepts", slides 1–13', 'bộ "Chapter 4: Software Design and Architecture Concepts", slide 1–13'],
    ]),
  ].join('\n'),
};

/* ───────── 1.G — 📑 Slide by slide · Design concepts (2): concurrency, patterns, architecture, quality (school Ch.4, slides 14–25) ───────── */
const L_swd5_2 = {
  title: '1.G — 📑 Slide by slide · Design concepts (2): concurrency, patterns, architecture, quality (school Ch.4, slides 14–25)|||1.G — 📑 Học theo từng slide · Khái niệm thiết kế (2): đồng thời, mẫu, kiến trúc, chất lượng (Chapter 4 của trường, slide 14–25)',
  slug: 'swd392-slide-swd5-2',
  type: 'VIDEO',
  description: 'Giảng slide 14–25 Chapter 4 của trường (Gomaa Ch.4): ứng dụng tuần tự và đồng thời, đối tượng chủ động/bị động, ba bài toán hợp tác (loại trừ tương hỗ, đồng bộ, producer/consumer), thông điệp bất đồng bộ (ghép lỏng) và đồng bộ có trả lời (ghép chặt), năm loại mẫu và Singleton, MVC, kiến trúc = component + connector + giao thức, đảo ngược phụ thuộc trong Spring Boot (mở rộng), chín thuộc tính chất lượng — có sơ đồ dựng thật và Java đa luồng chạy thật, output tất định.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.G · school deck "Chapter 4: Software Design and Architecture Concepts", slides 14–25</span>
<h2>Software design concepts (part 2) — the deck, slide by slide</h2>
<p class="lead">The second half of Chapter 4 moves from single objects to <strong>systems</strong>: objects that run <strong>concurrently</strong> and talk by <strong>messages</strong>, reusable <strong>patterns</strong>, <strong>architecture</strong> made of components and connectors, and the <strong>quality attributes</strong> an architecture must deliver. Concurrency is abstract on slides, so here every idea runs: real Java threads, queues and semaphores, with output that is the same on every run. Two extensions the slides do not have — <strong>MVC in Spring</strong> and <strong>dependency inversion</strong> — connect the theory to the LabFlow backend.</p>`,
    `<span class="eyebrow">Chương 1 · Bài 1.G · bộ slide "Chapter 4: Software Design and Architecture Concepts" của trường, slide 14–25</span>
<h2>Các khái niệm thiết kế phần mềm (phần 2) — học bộ slide từng trang</h2>
<p class="lead">Nửa sau Chương 4 đi từ từng đối tượng lên <strong>hệ thống</strong>: các đối tượng chạy <strong>đồng thời (concurrently)</strong> và nói chuyện bằng <strong>thông điệp (message)</strong>, <strong>mẫu (pattern)</strong> tái sử dụng, <strong>kiến trúc</strong> gồm component và connector, và các <strong>thuộc tính chất lượng (quality attribute)</strong> mà kiến trúc phải đạt. Đồng thời trên slide rất trừu tượng, nên ở đây ý nào cũng chạy thật: luồng (thread) Java thật, hàng đợi, semaphore, với output giống hệt nhau mọi lần chạy. Hai phần mở rộng slide không có — <strong>MVC trong Spring</strong> và <strong>đảo ngược phụ thuộc (dependency inversion)</strong> — nối lý thuyết với backend LabFlow.</p>`),
    walkHead('swd5', 14, 25),
    walk('swd5', [
      [14, '5. Sequential and Concurrent Applications',
        `<p class="y-chinh">🎯 A <strong>sequential application</strong> has passive objects and a single thread of control: control passes to the called operation, then returns. A <strong>concurrent application</strong> has several concurrent objects, each with its own thread; it supports asynchronous messages — the source continues after sending, and the destination buffers the message if busy.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/74d3f34340c297befb7f0b369411e9912aa80d14.svg" alt="Top: sequential — Invoice calls TaxCalculator and waits for the reply. Bottom: concurrent — userA sends an asynchronous message and keeps working; the message waits in a buffer until userB is free" loading="lazy" /><p class="chu-thich">🧩 Top: sequential — Invoice calls TaxCalculator and waits for the reply. Bottom: concurrent — userA sends an asynchronous message and keeps working; the message waits in a buffer until userB is free</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 14 — sequential (synchronous call, caller waits) vs concurrent (asynchronous message, sender continues)
participant ": Invoice" as I
participant ": TaxCalculator" as T
participant "userA : UserObject" as A
queue "message buffer\\n(server)" as Q
participant "userB : UserObject" as B
== Sequential application: one thread of control ==
I -&gt; T : calculateTax(amount)
activate T
T --&gt; I : tax
deactivate T
note over I : continues only after the reply
== Concurrent application: each object has its own thread ==
A -&gt;&gt; Q : send("hi")
note over A : keeps typing, reads history...
Q -&gt;&gt; B : deliver later (B was busy)
@enduml</code></pre></details>
<p>The slide's tax example as running code — note that both objects run on the same thread, <code>main</code>:</p>
<pre><code class="language-java">// Slide 14: a sequential application — one thread; control passes to the called operation, then returns
class TaxCalculator {                       // passive object: runs only when called
    double calculateTax(double amount) {
        System.out.println("  TaxCalculator: computing 10% of " + amount + " on thread " + Thread.currentThread().getName());
        return amount * 0.10;
    }
}

class Invoice {
    private final TaxCalculator calc = new TaxCalculator();
    void total(double amount) {
        System.out.println("Invoice: call calculateTax() and WAIT");
        double tax = calc.calculateTax(amount);          // synchronous call = method invocation
        System.out.println("Invoice: got " + tax + " back, continue -&gt; total = " + (amount + tax));
    }
}

public class SequentialCall {
    public static void main(String[] args) {
        new Invoice().total(200.0);
    }
}</code></pre>
<div class="out">Invoice: call calculateTax() and WAIT<br>
&nbsp;&nbsp;TaxCalculator: computing 10% of 200.0 on thread main<br>
Invoice: got 20.0 back, continue -&gt; total = 220.0</div>
<p><strong>Thread of control</strong> = the one "cursor" that executes instructions. In a sequential program there is exactly one; when Invoice calls <code>calculateTax()</code>, the cursor jumps into TaxCalculator and comes back. Gomaa: in a sequential application only <strong>synchronous</strong> communication (a procedure call / method invocation) exists. In the chat example, A's app and B's app are separate concurrent objects: A's message goes into a buffer on the server; A does not wait for B.</p>
<div class="pitfall">"A sequential application supports asynchronous messages" — <strong>false</strong>: sequential = synchronous calls only. Asynchronous messaging needs at least two threads of control.</div>`,
        `<p class="y-chinh">🎯 <strong>Ứng dụng tuần tự (sequential application)</strong> có các đối tượng bị động và một luồng điều khiển (thread of control) duy nhất: quyền điều khiển chuyển sang thao tác được gọi, rồi quay về. <strong>Ứng dụng đồng thời (concurrent application)</strong> có nhiều đối tượng đồng thời, mỗi cái một luồng riêng; nó hỗ trợ thông điệp bất đồng bộ — bên gửi chạy tiếp sau khi gửi, và bên nhận đưa thông điệp vào bộ đệm (buffer) nếu đang bận.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/74d3f34340c297befb7f0b369411e9912aa80d14.svg" alt="Trên: tuần tự — Invoice gọi TaxCalculator và chờ trả lời. Dưới: đồng thời — userA gửi thông điệp bất đồng bộ rồi làm tiếp; thông điệp nằm chờ trong bộ đệm tới khi userB rảnh" loading="lazy" /><p class="chu-thich">🧩 Trên: tuần tự — Invoice gọi TaxCalculator và chờ trả lời. Dưới: đồng thời — userA gửi thông điệp bất đồng bộ rồi làm tiếp; thông điệp nằm chờ trong bộ đệm tới khi userB rảnh</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 14 — tuần tự (gọi đồng bộ, bên gọi chờ) và đồng thời (thông điệp bất đồng bộ, bên gửi đi tiếp)
participant ": Invoice" as I
participant ": TaxCalculator" as T
participant "userA : UserObject" as A
queue "message buffer\\n(server)" as Q
participant "userB : UserObject" as B
== Sequential application: one thread of control ==
I -&gt; T : calculateTax(amount)
activate T
T --&gt; I : tax
deactivate T
note over I : continues only after the reply
== Concurrent application: each object has its own thread ==
A -&gt;&gt; Q : send("hi")
note over A : keeps typing, reads history...
Q -&gt;&gt; B : deliver later (B was busy)
@enduml</code></pre></details>
<p>Ví dụ tính thuế của slide bằng code chạy thật — để ý cả hai đối tượng chạy trên cùng một luồng, <code>main</code>:</p>
<pre><code class="language-java">// Slide 14: ứng dụng tuần tự — một luồng; quyền điều khiển chuyển sang thao tác được gọi rồi quay về
class TaxCalculator {                       // đối tượng bị động: chỉ chạy khi được gọi
    double calculateTax(double amount) {
        System.out.println("  TaxCalculator: computing 10% of " + amount + " on thread " + Thread.currentThread().getName());
        return amount * 0.10;
    }
}

class Invoice {
    private final TaxCalculator calc = new TaxCalculator();
    void total(double amount) {
        System.out.println("Invoice: call calculateTax() and WAIT");
        double tax = calc.calculateTax(amount);          // gọi đồng bộ = gọi phương thức
        System.out.println("Invoice: got " + tax + " back, continue -&gt; total = " + (amount + tax));
    }
}

public class SequentialCall {
    public static void main(String[] args) {
        new Invoice().total(200.0);
    }
}</code></pre>
<div class="out">Invoice: call calculateTax() and WAIT<br>
&nbsp;&nbsp;TaxCalculator: computing 10% of 200.0 on thread main<br>
Invoice: got 20.0 back, continue -&gt; total = 220.0</div>
<p><strong>Luồng điều khiển</strong> = một "con trỏ" duy nhất đang thực thi lệnh. Chương trình tuần tự có đúng một; khi Invoice gọi <code>calculateTax()</code>, con trỏ nhảy vào TaxCalculator rồi quay về. Gomaa: ứng dụng tuần tự chỉ có giao tiếp <strong>đồng bộ</strong> (gọi thủ tục / gọi phương thức). Trong ví dụ chat, app của A và app của B là hai đối tượng đồng thời riêng; tin nhắn của A vào bộ đệm trên máy chủ; A không chờ B.</p>
<div class="pitfall">"Ứng dụng tuần tự hỗ trợ thông điệp bất đồng bộ" — <strong>sai</strong>: tuần tự = chỉ gọi đồng bộ. Thông điệp bất đồng bộ cần ít nhất hai luồng điều khiển.</div>`],
      [15, '6. Concurrent Objects',
        `<p class="y-chinh">🎯 A <strong>concurrent object</strong> — also called <em>active object, concurrent process, concurrent task or thread</em> — has its own thread of control and executes independently; a <strong>passive object</strong> has no thread: its operations are invoked by concurrent objects (and it may call other passive objects); a concurrent object represents the execution of a sequential program or component inside a concurrent program.</p>
<table>
<thead><tr><th></th><th>Active (concurrent) object</th><th>Passive object</th></tr></thead>
<tbody>
<tr><td>Own thread of control?</td><td>yes</td><td>no</td></tr>
<tr><td>Starts work by itself?</td><td>yes — loops, waits for events or messages</td><td>no — waits to be called</td></tr>
<tr><td>Runs in whose thread?</td><td>its own</td><td>the caller's (Gomaa: "executes within the thread of control of the concurrent object")</td></tr>
<tr><td>UML notation (lesson 1.C)</td><td>box with double vertical sides, or <code>«active object»</code></td><td>normal box</td></tr>
<tr><td>Java</td><td>a <code>Thread</code> / <code>Runnable</code> task, an <code>@Async</code> worker, a Kafka consumer</td><td>an ordinary object: an entity, a service method</td></tr>
</tbody>
</table>
<p>Gomaa adds: <em>inside</em> one concurrent object there is no concurrency — it runs one sequential thread; system concurrency comes from running many concurrent objects in parallel. They run at different speeds and only now and then must communicate and synchronize — which creates the three problems of the next slide.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): each HTTP request in Spring Boot is handled on its own thread from Tomcat's pool — the request handlers are the active parts; <code>ReservationService</code> is a passive object running inside whichever request thread calls it. A <code>@Scheduled</code> job that expires unconfirmed reservations every minute is an active object with its own timer thread.</div>`,
        `<p class="y-chinh">🎯 <strong>Đối tượng đồng thời (concurrent object)</strong> — còn gọi <em>đối tượng chủ động (active object), tiến trình đồng thời, tác vụ đồng thời (task) hay luồng (thread)</em> — có luồng điều khiển riêng và chạy độc lập; <strong>đối tượng bị động (passive object)</strong> không có luồng: thao tác của nó được đối tượng đồng thời gọi (và nó có thể gọi đối tượng bị động khác); một đối tượng đồng thời thể hiện việc thực thi một chương trình hay thành phần tuần tự bên trong một chương trình đồng thời.</p>
<table>
<thead><tr><th></th><th>Đối tượng chủ động (đồng thời)</th><th>Đối tượng bị động</th></tr></thead>
<tbody>
<tr><td>Có luồng riêng?</td><td>có</td><td>không</td></tr>
<tr><td>Tự bắt đầu làm việc?</td><td>có — lặp, chờ sự kiện hoặc thông điệp</td><td>không — chờ được gọi</td></tr>
<tr><td>Chạy trong luồng của ai?</td><td>của chính nó</td><td>của bên gọi (Gomaa: "chạy bên trong luồng điều khiển của đối tượng đồng thời")</td></tr>
<tr><td>Ký hiệu UML (bài 1.C)</td><td>hộp có hai cạnh đứng kép, hoặc <code>«active object»</code></td><td>hộp thường</td></tr>
<tr><td>Java</td><td>một tác vụ <code>Thread</code> / <code>Runnable</code>, một worker <code>@Async</code>, một consumer Kafka</td><td>một đối tượng thường: entity, phương thức service</td></tr>
</tbody>
</table>
<p>Gomaa thêm: <em>bên trong</em> một đối tượng đồng thời không có đồng thời — nó chạy một luồng tuần tự; tính đồng thời của hệ thống đến từ việc chạy song song nhiều đối tượng đồng thời. Chúng chạy với tốc độ khác nhau và chỉ thỉnh thoảng phải giao tiếp và đồng bộ — sinh ra ba bài toán của slide sau.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): mỗi request HTTP trong Spring Boot được xử lý trên một luồng riêng lấy từ pool của Tomcat — phần xử lý request là phần chủ động; <code>ReservationService</code> là đối tượng bị động chạy trong luồng request nào gọi nó. Một job <code>@Scheduled</code> mỗi phút huỷ các lượt đặt chưa xác nhận là một đối tượng chủ động có luồng hẹn giờ riêng.</div>`],
      [16, '7. Cooperation between Concurrent Objects',
        `<p class="y-chinh">🎯 Three problems arise when concurrent objects cooperate: <strong>mutual exclusion</strong> (exclusive access to a shared resource — shared data or a physical device), <strong>synchronization</strong> (two objects must synchronize their operations), <strong>producer/consumer</strong> (objects must communicate to pass data from one to another).</p>
<table>
<thead><tr><th>Problem</th><th>Plain meaning</th><th>Everyday picture</th><th>LabFlow (illustration)</th></tr></thead>
<tbody>
<tr><td>Mutual exclusion</td><td>only one at a time may use the resource</td><td>one key for the lab room</td><td>two students booking the LAST free slot at the same second</td></tr>
<tr><td>Synchronization</td><td>B must wait for A's event (no data)</td><td>the second relay runner waits for the baton</td><td>"send reminder" waits until "approval" has happened</td></tr>
<tr><td>Producer/consumer</td><td>A produces data that B consumes</td><td>a kitchen passes dishes to a waiter</td><td>reservation service produces events, notification service consumes them</td></tr>
</tbody>
</table>
<p>Mutual exclusion in running code — two threads book 100,000 times each on ONE shared counter; <code>synchronized</code> lets only one thread inside <code>book()</code> at a time:</p>
<pre><code class="language-java">// Slide 16: mutual exclusion — two active objects update ONE shared counter; synchronized gives exclusive access
class SlotCounter {                         // shared resource
    private int booked = 0;
    synchronized void book() { booked++; }  // only one thread at a time inside
    int booked() { return booked; }
}

public class MutualExclusion {
    public static void main(String[] args) throws InterruptedException {
        SlotCounter counter = new SlotCounter();
        Runnable clerk = () -&gt; { for (int i = 0; i &lt; 100_000; i++) counter.book(); };
        Thread a = new Thread(clerk), b = new Thread(clerk);
        a.start(); b.start();
        a.join(); b.join();
        System.out.println("expected 200000, got " + counter.booked());
        // Remove 'synchronized' and the result is usually LESS than 200000 (lost updates) — try it
    }
}</code></pre>
<div class="out">expected 200000, got 200000</div>
<p>Without <code>synchronized</code>, <code>booked++</code> (read, add, write) of the two threads interleaves and updates get lost — the total comes out below 200,000 and different on each run. That is a <em>race condition</em>. Gomaa also names a variant: the <strong>multiple readers and writers</strong> problem, where many readers may share access but a writer needs it alone.</p>
<div class="pitfall">Match the name to the definition carefully: "exclusive access to a resource" = <strong>mutual exclusion</strong>; "pass data from one object to another" = <strong>producer/consumer</strong>; "synchronize operations" (no data) = <strong>synchronization</strong>. Interprocess communication (IPC) is the other name for communication between concurrent objects.</div>`,
        `<p class="y-chinh">🎯 Ba bài toán nảy sinh khi các đối tượng đồng thời hợp tác: <strong>loại trừ tương hỗ (mutual exclusion)</strong> (truy cập độc quyền một tài nguyên dùng chung — dữ liệu chung hay thiết bị vật lý), <strong>đồng bộ (synchronization)</strong> (hai đối tượng phải khớp nhịp thao tác với nhau), <strong>producer/consumer — bên sản xuất/bên tiêu thụ</strong> (các đối tượng phải giao tiếp để chuyển dữ liệu từ bên này sang bên kia).</p>
<table>
<thead><tr><th>Bài toán</th><th>Nghĩa dễ hiểu</th><th>Hình ảnh đời thường</th><th>LabFlow (minh hoạ)</th></tr></thead>
<tbody>
<tr><td>Loại trừ tương hỗ</td><td>mỗi lúc chỉ một bên dùng tài nguyên</td><td>một chìa khoá phòng lab</td><td>hai sinh viên đặt CA CUỐI CÙNG còn trống trong cùng một giây</td></tr>
<tr><td>Đồng bộ</td><td>B phải chờ sự kiện của A (không trao dữ liệu)</td><td>người chạy tiếp sức thứ hai chờ nhận gậy</td><td>"gửi nhắc lịch" chờ tới khi "đã duyệt" xảy ra</td></tr>
<tr><td>Producer/consumer</td><td>A tạo dữ liệu, B dùng dữ liệu</td><td>bếp chuyển món cho phục vụ</td><td>service đặt chỗ tạo sự kiện, service thông báo tiêu thụ chúng</td></tr>
</tbody>
</table>
<p>Loại trừ tương hỗ bằng code chạy thật — hai luồng mỗi luồng đặt 100.000 lần trên MỘT bộ đếm dùng chung; <code>synchronized</code> chỉ cho một luồng ở trong <code>book()</code> mỗi lúc:</p>
<pre><code class="language-java">// Slide 16: loại trừ tương hỗ — hai đối tượng chủ động cùng sửa MỘT bộ đếm dùng chung; synchronized cho quyền truy cập độc quyền
class SlotCounter {                         // tài nguyên dùng chung
    private int booked = 0;
    synchronized void book() { booked++; }  // mỗi lúc chỉ một luồng được vào
    int booked() { return booked; }
}

public class MutualExclusion {
    public static void main(String[] args) throws InterruptedException {
        SlotCounter counter = new SlotCounter();
        Runnable clerk = () -&gt; { for (int i = 0; i &lt; 100_000; i++) counter.book(); };
        Thread a = new Thread(clerk), b = new Thread(clerk);
        a.start(); b.start();
        a.join(); b.join();
        System.out.println("expected 200000, got " + counter.booked());
        // Bỏ 'synchronized' thì kết quả thường NHỎ hơn 200000 (mất cập nhật) — hãy thử
    }
}</code></pre>
<div class="out">expected 200000, got 200000</div>
<p>Bỏ <code>synchronized</code> thì <code>booked++</code> (đọc, cộng, ghi) của hai luồng xen kẽ nhau và mất cập nhật — tổng ra dưới 200.000 và mỗi lần chạy một khác. Đó là <em>tranh chấp (race condition)</em>. Gomaa còn nêu một biến thể: bài toán <strong>nhiều người đọc, người ghi (multiple readers and writers)</strong>, nhiều người đọc được dùng chung nhưng người ghi phải dùng một mình.</p>
<div class="pitfall">Khớp tên với định nghĩa thật kỹ: "truy cập độc quyền một tài nguyên" = <strong>mutual exclusion</strong>; "chuyển dữ liệu từ đối tượng này sang đối tượng khác" = <strong>producer/consumer</strong>; "khớp nhịp thao tác" (không có dữ liệu) = <strong>synchronization</strong>. Interprocess communication (IPC — giao tiếp liên tiến trình) là tên khác của giao tiếp giữa các đối tượng đồng thời.</div>`],
      [17, '7.1 Synchronization Problem',
        `<p class="y-chinh">🎯 <strong>Event synchronization</strong> is used when two tasks must synchronize <strong>without communicating data</strong>; example: Task A downloads data, Task B processes it only after the event "Task A completed" (the data itself sits in a file or shared memory). Gomaa Figure 4.10: <code>pick&amp;PlaceRobot</code> and <code>drillingRobot</code> exchange <code>1: partReady</code> and <code>2: partCompleted</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/6724ca7d4768aad67a42e2c14509275f969b0691.svg" alt="Figure 4.10 redrawn: two active objects synchronizing by events — no data travels, only &quot;it has happened&quot;" loading="lazy" /><p class="chu-thich">🧩 Figure 4.10 redrawn: two active objects synchronizing by events — no data travels, only "it has happened"</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 17 (Gomaa Figure 4.10) — event synchronization between two active objects: partReady / partCompleted
rectangle "pick&amp;PlaceRobot" as P &lt;&lt;active object&gt;&gt;
rectangle "drillingRobot" as D &lt;&lt;active object&gt;&gt;
P -right- D : "1: partReady ▶\\n2: partCompleted ◀"
@enduml</code></pre></details>
<p><strong>The robot story (Gomaa 4.4.4):</strong> the pick-and-place robot puts a part at the work location, moves out of the collision zone, then <code>signal(partReady)</code> and <code>wait(partCompleted)</code>. The drilling robot does <code>wait(partReady)</code>, drills four holes, moves away, <code>signal(partCompleted)</code>. The source task <em>signals</em>; the destination task <em>waits</em> and is suspended until the event is signalled (if it was already signalled, it does not wait). Both robots loop. In Java, a semaphore plays the role of each event:</p>
<pre><code class="language-java">// Slide 17 (Gomaa Fig. 4.10): event synchronization between two active objects — no data passed, only signal/wait
import java.util.concurrent.Semaphore;

public class EventSync {
    static final Semaphore partReady = new Semaphore(0);      // event "partReady" (not signalled yet)
    static final Semaphore partCompleted = new Semaphore(0);  // event "partCompleted"

    public static void main(String[] args) throws InterruptedException {
        Thread pickAndPlace = new Thread(() -&gt; {               // active object 1 = its own thread
            for (int part = 1; part &lt;= 2; part++) {
                System.out.println("pick&amp;PlaceRobot: part " + part + " placed, arm moved to safe position");
                partReady.release();                             // signal(partReady)
                partCompleted.acquireUninterruptibly();          // wait(partCompleted)
                System.out.println("pick&amp;PlaceRobot: part " + part + " removed");
            }
        });
        Thread drilling = new Thread(() -&gt; {                   // active object 2
            for (int part = 1; part &lt;= 2; part++) {
                partReady.acquireUninterruptibly();              // wait(partReady): suspended until signalled
                System.out.println("  drillingRobot: 4 holes drilled in part " + part);
                partCompleted.release();                         // signal(partCompleted)
            }
        });
        pickAndPlace.start(); drilling.start();
        pickAndPlace.join(); drilling.join();
    }
}</code></pre>
<div class="out">pick&amp;PlaceRobot: part 1 placed, arm moved to safe position<br>
&nbsp;&nbsp;drillingRobot: 4 holes drilled in part 1<br>
pick&amp;PlaceRobot: part 1 removed<br>
pick&amp;PlaceRobot: part 2 placed, arm moved to safe position<br>
&nbsp;&nbsp;drillingRobot: 4 holes drilled in part 2<br>
pick&amp;PlaceRobot: part 2 removed</div>
<p>The output order is the same every run although the two threads are independent: the events force it. The drilling robot can never print before the part is placed, and the part is never removed before drilling ends — exactly the safety the robots need.</p>
<p class="meo">🧠 Synchronization = a traffic light between threads: it carries no goods, only "go".</p>`,
        `<p class="y-chinh">🎯 <strong>Đồng bộ sự kiện (event synchronization)</strong> dùng khi hai tác vụ phải khớp nhịp <strong>mà không trao dữ liệu</strong>; ví dụ: Task A tải dữ liệu, Task B chỉ xử lý sau sự kiện "Task A đã xong" (bản thân dữ liệu nằm trong file hoặc bộ nhớ chung). Hình 4.10 của Gomaa: <code>pick&amp;PlaceRobot</code> (robot gắp-đặt) và <code>drillingRobot</code> (robot khoan) trao nhau <code>1: partReady</code> và <code>2: partCompleted</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/6724ca7d4768aad67a42e2c14509275f969b0691.svg" alt="Hình 4.10 vẽ lại: hai đối tượng chủ động đồng bộ bằng sự kiện — không có dữ liệu đi qua, chỉ có &quot;việc đó đã xảy ra&quot;" loading="lazy" /><p class="chu-thich">🧩 Hình 4.10 vẽ lại: hai đối tượng chủ động đồng bộ bằng sự kiện — không có dữ liệu đi qua, chỉ có "việc đó đã xảy ra"</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 17 (Hình 4.10) — đồng bộ sự kiện giữa hai đối tượng chủ động: partReady / partCompleted
rectangle "pick&amp;PlaceRobot" as P &lt;&lt;active object&gt;&gt;
rectangle "drillingRobot" as D &lt;&lt;active object&gt;&gt;
P -right- D : "1: partReady ▶\\n2: partCompleted ◀"
@enduml</code></pre></details>
<p><strong>Chuyện hai robot (Gomaa 4.4.4):</strong> robot gắp-đặt đặt chi tiết vào vị trí làm việc, lùi khỏi vùng va chạm, rồi <code>signal(partReady)</code> (báo) và <code>wait(partCompleted)</code> (chờ). Robot khoan <code>wait(partReady)</code>, khoan bốn lỗ, lùi ra, <code>signal(partCompleted)</code>. Tác vụ nguồn <em>báo tín hiệu</em>; tác vụ đích <em>chờ</em> và bị treo cho tới khi sự kiện được báo (nếu đã báo từ trước thì không phải chờ). Cả hai robot chạy vòng lặp. Trong Java, mỗi sự kiện đóng vai bằng một semaphore:</p>
<pre><code class="language-java">// Slide 17 (Hình 4.10): đồng bộ sự kiện giữa hai đối tượng chủ động — không trao dữ liệu, chỉ signal/wait
import java.util.concurrent.Semaphore;

public class EventSync {
    static final Semaphore partReady = new Semaphore(0);      // sự kiện "partReady" (chưa báo)
    static final Semaphore partCompleted = new Semaphore(0);  // sự kiện "partCompleted"

    public static void main(String[] args) throws InterruptedException {
        Thread pickAndPlace = new Thread(() -&gt; {               // đối tượng chủ động 1 = một luồng riêng
            for (int part = 1; part &lt;= 2; part++) {
                System.out.println("pick&amp;PlaceRobot: part " + part + " placed, arm moved to safe position");
                partReady.release();                             // signal(partReady)
                partCompleted.acquireUninterruptibly();          // wait(partCompleted)
                System.out.println("pick&amp;PlaceRobot: part " + part + " removed");
            }
        });
        Thread drilling = new Thread(() -&gt; {                   // đối tượng chủ động 2
            for (int part = 1; part &lt;= 2; part++) {
                partReady.acquireUninterruptibly();              // wait(partReady): bị treo tới khi có tín hiệu
                System.out.println("  drillingRobot: 4 holes drilled in part " + part);
                partCompleted.release();                         // signal(partCompleted)
            }
        });
        pickAndPlace.start(); drilling.start();
        pickAndPlace.join(); drilling.join();
    }
}</code></pre>
<div class="out">pick&amp;PlaceRobot: part 1 placed, arm moved to safe position<br>
&nbsp;&nbsp;drillingRobot: 4 holes drilled in part 1<br>
pick&amp;PlaceRobot: part 1 removed<br>
pick&amp;PlaceRobot: part 2 placed, arm moved to safe position<br>
&nbsp;&nbsp;drillingRobot: 4 holes drilled in part 2<br>
pick&amp;PlaceRobot: part 2 removed</div>
<p>Thứ tự output lần nào chạy cũng như nhau dù hai luồng độc lập: chính các sự kiện ép thứ tự đó. Robot khoan không bao giờ in trước khi chi tiết được đặt, và chi tiết không bao giờ bị lấy đi trước khi khoan xong — đúng sự an toàn mà hai robot cần.</p>
<p class="meo">🧠 Đồng bộ = cột đèn giao thông giữa các luồng: không chở hàng, chỉ báo "đi".</p>`],
      [18, '7.2. Producer/Consumer Problem',
        `<p class="y-chinh">🎯 The <strong>producer</strong> concurrent object produces information that the <strong>consumer</strong> concurrent object consumes; each has its own thread and they run asynchronously; their message communication may be <strong>asynchronous or synchronous</strong>. Example: a log processing system — the producer keeps generating log data, the consumer reads it to store or analyse, through a buffer/queue.</p>
<p><strong>Why it is a problem (Gomaa 4.4.5):</strong> the two run at their own speeds. If the consumer is ready but no data exists, it must wait. If the producer has data but the consumer is busy, either the producer is held up, or the data is <em>buffered</em> so the producer can go on. Message communication solves both needs at once: it (1) <strong>transfers data</strong> from producer to consumer and (2) <strong>synchronizes</strong> them.</p>
<table>
<thead><tr><th>Choice</th><th>Producer after sending</th><th>Queue between them?</th><th>Coupling</th><th>Next slide</th></tr></thead>
<tbody>
<tr><td>Asynchronous</td><td>continues immediately</td><td>yes, FIFO queue may build up</td><td>loose</td><td>19</td></tr>
<tr><td>Synchronous with reply</td><td>waits for the reply</td><td>no</td><td>tight</td><td>20</td></tr>
</tbody>
</table>
<p>Concurrent objects may be on the same node or distributed over several nodes; the logic is the same, only the connector differs (slide 23).</p>
<div class="callout">➕ <strong>Beyond the slide — the industrial version.</strong> Logging pipelines, order processing and notifications in real companies use a message broker (Kafka, RabbitMQ) as the queue between producers and consumers — exactly this pattern, at scale. It is also why "explain producer/consumer" and "why use a message queue?" are common backend interview questions.</div>`,
        `<p class="y-chinh">🎯 Đối tượng đồng thời <strong>producer (bên sản xuất)</strong> tạo thông tin mà đối tượng đồng thời <strong>consumer (bên tiêu thụ)</strong> dùng; mỗi bên có luồng riêng và chạy bất đồng bộ; giao tiếp thông điệp giữa chúng có thể <strong>bất đồng bộ hoặc đồng bộ</strong>. Ví dụ: hệ thống xử lý log — producer liên tục sinh dữ liệu log, consumer đọc để lưu vào cơ sở dữ liệu hoặc phân tích, qua một bộ đệm/hàng đợi.</p>
<p><strong>Vì sao đây là bài toán (Gomaa 4.4.5):</strong> hai bên chạy theo tốc độ riêng. Consumer sẵn sàng mà chưa có dữ liệu thì phải chờ. Producer có dữ liệu mà consumer đang bận thì hoặc producer bị giữ lại, hoặc dữ liệu được <em>đệm (buffer)</em> để producer làm tiếp. Giao tiếp bằng thông điệp giải cả hai nhu cầu cùng lúc: nó (1) <strong>chuyển dữ liệu</strong> từ producer sang consumer và (2) <strong>đồng bộ</strong> hai bên.</p>
<table>
<thead><tr><th>Lựa chọn</th><th>Producer sau khi gửi</th><th>Có hàng đợi giữa hai bên?</th><th>Ghép nối</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Bất đồng bộ (asynchronous)</td><td>đi tiếp ngay</td><td>có, hàng đợi FIFO có thể dồn lên</td><td>lỏng</td><td>19</td></tr>
<tr><td>Đồng bộ có trả lời (synchronous with reply)</td><td>chờ trả lời</td><td>không</td><td>chặt</td><td>20</td></tr>
</tbody>
</table>
<p>Các đối tượng đồng thời có thể ở cùng một nút máy hay rải trên nhiều nút; logic giống nhau, chỉ khác connector (slide 23).</p>
<div class="callout">➕ <strong>Mở rộng ngoài slide — phiên bản công nghiệp.</strong> Dòng xử lý log, xử lý đơn hàng và gửi thông báo ở công ty thật dùng một message broker (Kafka, RabbitMQ) làm hàng đợi giữa producer và consumer — đúng mẫu này, ở quy mô lớn. Đó cũng là lý do "giải thích producer/consumer" và "sao phải dùng message queue?" là câu phỏng vấn backend rất hay gặp.</div>`],
      [19, '7.2.1. Asynchronous Message Communication',
        `<p class="y-chinh">🎯 Asynchronous message communication: the producer sends a message <strong>without waiting</strong> for a response and continues other tasks at once; the consumer receives it later; they may run at different speeds; a <strong>FIFO message queue</strong> buffers messages between them; if no message is available, the consumer is <strong>suspended</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/3d7c88bf00c89d05f00e8ddd38df0612cb8b9b99.svg" alt="Gomaa Figure 4.11: asynchronous (loosely coupled) message — the open arrowhead of the message label means &quot;send and don't wait&quot;" loading="lazy" /><p class="chu-thich">🧩 Gomaa Figure 4.11: asynchronous (loosely coupled) message — the open arrowhead of the message label means "send and don't wait"</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slides 18-19 (Gomaa Figure 4.11) — asynchronous (loosely coupled) message communication; a FIFO queue may build up
rectangle "aProducer" as P &lt;&lt;active object&gt;&gt;
rectangle "aConsumer" as C &lt;&lt;active object&gt;&gt;
P -right- C : "1: sendAsynchronousMessage (in message) ▶"
note bottom of C
  FIFO message queue in front of the consumer;
  the consumer is suspended when it is empty
end note
@enduml</code></pre></details>
<pre><code class="language-java">// Slides 18-19 (Gomaa Fig. 4.11): asynchronous (loosely coupled) messages through a FIFO queue
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class AsyncMessages {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue&lt;String&gt; queue = new LinkedBlockingQueue&lt;&gt;();   // the FIFO message queue (the connector)
        int[] sentBeforeFirstRead = new int[1];

        Thread producer = new Thread(() -&gt; {       // e.g. a service writing log lines
            for (int i = 1; i &lt;= 4; i++) queue.add("log #" + i);   // send and DON'T wait
            queue.add("END");
            sentBeforeFirstRead[0] = queue.size();
        });
        producer.start();
        producer.join();                            // the producer already finished all its work
        System.out.println("producer finished; messages waiting in queue: " + sentBeforeFirstRead[0]);

        Thread consumer = new Thread(() -&gt; {       // reads later, at its own speed
            try {
                String m;
                while (!(m = queue.take()).equals("END"))   // take() suspends the consumer if the queue is empty
                    System.out.println("  consumer stored " + m);
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        consumer.start();
        consumer.join();
        System.out.println("order kept (FIFO), nothing lost");
    }
}</code></pre>
<div class="out">producer finished; messages waiting in queue: 5<br>
&nbsp;&nbsp;consumer stored log #1<br>
&nbsp;&nbsp;consumer stored log #2<br>
&nbsp;&nbsp;consumer stored log #3<br>
&nbsp;&nbsp;consumer stored log #4<br>
order kept (FIFO), nothing lost</div>
<p><strong>Read the output:</strong> the producer finished all its work — five messages sit in the queue — before the consumer even started. It never waited for anyone. The consumer then reads them in the same order they were sent (FIFO = first in, first out), and <code>take()</code> would suspend it if the queue became empty.</p>
<p>Gomaa's other name for it: <strong>loosely coupled</strong> message communication — the producer does not need the consumer to be alive, fast or even present at the moment of sending. In UML (lesson 1.C) the asynchronous message is drawn with an open (stick) arrowhead.</p>
<div class="pitfall">"With asynchronous communication the producer waits for the consumer" — <strong>false</strong>. "The consumer is suspended if no message is available" — <strong>true</strong> (both for async and sync). "A queue can build up" — true only for <strong>asynchronous</strong>.</div>`,
        `<p class="y-chinh">🎯 Giao tiếp thông điệp bất đồng bộ: producer gửi thông điệp <strong>không chờ</strong> trả lời và làm việc khác ngay; consumer nhận sau; hai bên có thể chạy tốc độ khác nhau; một <strong>hàng đợi thông điệp FIFO</strong> đệm thông điệp giữa hai bên; nếu chưa có thông điệp thì consumer bị <strong>treo (suspended)</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/3d7c88bf00c89d05f00e8ddd38df0612cb8b9b99.svg" alt="Hình 4.11 của Gomaa: thông điệp bất đồng bộ (ghép lỏng) — đầu mũi tên hở cạnh nhãn nghĩa là &quot;gửi rồi không chờ&quot;" loading="lazy" /><p class="chu-thich">🧩 Hình 4.11 của Gomaa: thông điệp bất đồng bộ (ghép lỏng) — đầu mũi tên hở cạnh nhãn nghĩa là "gửi rồi không chờ"</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 18-19 (Hình 4.11) — giao tiếp thông điệp bất đồng bộ (ghép lỏng); hàng đợi FIFO có thể dồn lên
rectangle "aProducer" as P &lt;&lt;active object&gt;&gt;
rectangle "aConsumer" as C &lt;&lt;active object&gt;&gt;
P -right- C : "1: sendAsynchronousMessage (in message) ▶"
note bottom of C
  FIFO message queue in front of the consumer;
  the consumer is suspended when it is empty
end note
@enduml</code></pre></details>
<pre><code class="language-java">// Slide 18-19 (Hình 4.11): thông điệp bất đồng bộ (ghép lỏng) qua hàng đợi FIFO
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class AsyncMessages {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue&lt;String&gt; queue = new LinkedBlockingQueue&lt;&gt;();   // hàng đợi thông điệp FIFO (bộ nối)
        int[] sentBeforeFirstRead = new int[1];

        Thread producer = new Thread(() -&gt; {       // vd một dịch vụ ghi log
            for (int i = 1; i &lt;= 4; i++) queue.add("log #" + i);   // gửi và KHÔNG chờ
            queue.add("END");
            sentBeforeFirstRead[0] = queue.size();
        });
        producer.start();
        producer.join();                            // producer đã xong hết việc
        System.out.println("producer finished; messages waiting in queue: " + sentBeforeFirstRead[0]);

        Thread consumer = new Thread(() -&gt; {       // đọc sau, theo tốc độ của mình
            try {
                String m;
                while (!(m = queue.take()).equals("END"))   // take() treo consumer nếu hàng đợi rỗng
                    System.out.println("  consumer stored " + m);
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        consumer.start();
        consumer.join();
        System.out.println("order kept (FIFO), nothing lost");
    }
}</code></pre>
<div class="out">producer finished; messages waiting in queue: 5<br>
&nbsp;&nbsp;consumer stored log #1<br>
&nbsp;&nbsp;consumer stored log #2<br>
&nbsp;&nbsp;consumer stored log #3<br>
&nbsp;&nbsp;consumer stored log #4<br>
order kept (FIFO), nothing lost</div>
<p><strong>Đọc output:</strong> producer làm xong hết việc — năm thông điệp nằm trong hàng đợi — trước cả khi consumer bắt đầu. Nó không chờ ai. Sau đó consumer đọc đúng thứ tự đã gửi (FIFO = first in, first out — vào trước ra trước), và <code>take()</code> sẽ treo nó nếu hàng đợi rỗng.</p>
<p>Tên khác của Gomaa: giao tiếp thông điệp <strong>ghép lỏng (loosely coupled)</strong> — producer không cần consumer còn sống, chạy nhanh hay thậm chí có mặt đúng lúc gửi. Trong UML (bài 1.C) thông điệp bất đồng bộ vẽ bằng đầu mũi tên hở (dạng que).</p>
<div class="pitfall">"Giao tiếp bất đồng bộ thì producer chờ consumer" — <strong>sai</strong>. "Consumer bị treo nếu chưa có thông điệp" — <strong>đúng</strong> (cả bất đồng bộ lẫn đồng bộ). "Hàng đợi có thể dồn lên" — chỉ đúng với <strong>bất đồng bộ</strong>.</div>`],
      [20, '7.2.2. Synchronous Message Communication',
        `<p class="y-chinh">🎯 Synchronous message communication with reply: the producer sends a message and <strong>waits for the reply</strong>; the consumer receives, processes, generates and sends back a reply; then both continue. Gomaa Figure 4.12: <code>1: sendSynchronousMessageWithReply (in message, out response)</code> from aProducer to aConsumer — <strong>tightly coupled</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/a671674ba12c5e78abdff6ee760c010667fda88b.svg" alt="Figure 4.12 redrawn: one message carries an input parameter in and an output parameter (the response) back" loading="lazy" /><p class="chu-thich">🧩 Figure 4.12 redrawn: one message carries an input parameter in and an output parameter (the response) back</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 20 (Gomaa Figure 4.12) — synchronous (tightly coupled) message communication with reply
rectangle "aProducer" as P &lt;&lt;active object&gt;&gt;
rectangle "aConsumer" as C &lt;&lt;active object&gt;&gt;
P -right- C : "1: sendSynchronousMessageWithReply\\n(in message, out response) ▶"
@enduml</code></pre></details>
<pre><code class="language-java">// Slide 20 (Gomaa Fig. 4.12): synchronous (tightly coupled) message with reply — the producer waits
import java.util.concurrent.SynchronousQueue;

public class SyncWithReply {
    record Request(String text, SynchronousQueue&lt;String&gt; replyTo) {}

    public static void main(String[] args) throws InterruptedException {
        SynchronousQueue&lt;Request&gt; channel = new SynchronousQueue&lt;&gt;();   // no buffer: hand-over only

        Thread consumer = new Thread(() -&gt; {
            try {
                for (int i = 0; i &lt; 2; i++) {
                    Request r = channel.take();                            // receive the message
                    System.out.println("  consumer: processing '" + r.text() + "'");
                    r.replyTo().put("OK:" + r.text().toUpperCase());       // send back a reply
                }
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        consumer.start();

        for (String text : new String[] {"reserve slot 2", "cancel slot 5"}) {
            SynchronousQueue&lt;String&gt; reply = new SynchronousQueue&lt;&gt;();
            System.out.println("producer: send '" + text + "' and WAIT");
            channel.put(new Request(text, reply));                         // blocks until the consumer takes it
            System.out.println("producer: reply = " + reply.take() + " -&gt; continue");   // blocks until the reply
        }
        consumer.join();
    }
}</code></pre>
<div class="out">producer: send 'reserve slot 2' and WAIT<br>
&nbsp;&nbsp;consumer: processing 'reserve slot 2'<br>
producer: reply = OK:RESERVE SLOT 2 -&gt; continue<br>
producer: send 'cancel slot 5' and WAIT<br>
&nbsp;&nbsp;consumer: processing 'cancel slot 5'<br>
producer: reply = OK:CANCEL SLOT 5 -&gt; continue</div>
<p><strong>Read the output:</strong> "send … and WAIT" is always followed by the consumer's processing and then the reply — the producer is stuck until the reply arrives. Because each message is handed over directly, <strong>no queue builds up</strong> for a producer/consumer pair (Gomaa 4.4.7). The notation <code>(in message, out response)</code> says the same message both delivers data and brings the answer back.</p>
<table>
<thead><tr><th></th><th>Asynchronous (slide 19)</th><th>Synchronous with reply (slide 20)</th></tr></thead>
<tbody>
<tr><td>Also called</td><td>loosely coupled</td><td>tightly coupled</td></tr>
<tr><td>Producer</td><td>continues at once</td><td>blocked until reply</td></tr>
<tr><td>Queue</td><td>FIFO may build up</td><td>none</td></tr>
<tr><td>Everyday example</td><td>email, Zalo message</td><td>phone call</td></tr>
<tr><td>LabFlow</td><td>"reservation created" event → notification service</td><td>React → <code>POST /reservations</code> → waits for 201 + JSON</td></tr>
</tbody>
</table>
<p class="nhan">Gomaa also mentions synchronous communication <em>without</em> reply (the producer waits until the consumer has accepted the message) — details in Chapter 12.</p>`,
        `<p class="y-chinh">🎯 Giao tiếp thông điệp đồng bộ có trả lời: producer gửi thông điệp và <strong>chờ trả lời</strong>; consumer nhận, xử lý, tạo và gửi lại trả lời; rồi cả hai cùng đi tiếp. Hình 4.12 của Gomaa: <code>1: sendSynchronousMessageWithReply (in message, out response)</code> từ aProducer tới aConsumer — <strong>ghép chặt (tightly coupled)</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/a671674ba12c5e78abdff6ee760c010667fda88b.svg" alt="Hình 4.12 vẽ lại: một thông điệp mang tham số vào (in) và mang tham số ra (out — câu trả lời) quay về" loading="lazy" /><p class="chu-thich">🧩 Hình 4.12 vẽ lại: một thông điệp mang tham số vào (in) và mang tham số ra (out — câu trả lời) quay về</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 20 (Hình 4.12) — giao tiếp thông điệp đồng bộ (ghép chặt) có trả lời
rectangle "aProducer" as P &lt;&lt;active object&gt;&gt;
rectangle "aConsumer" as C &lt;&lt;active object&gt;&gt;
P -right- C : "1: sendSynchronousMessageWithReply\\n(in message, out response) ▶"
@enduml</code></pre></details>
<pre><code class="language-java">// Slide 20 (Hình 4.12): thông điệp đồng bộ (ghép chặt) có trả lời — producer phải chờ
import java.util.concurrent.SynchronousQueue;

public class SyncWithReply {
    record Request(String text, SynchronousQueue&lt;String&gt; replyTo) {}

    public static void main(String[] args) throws InterruptedException {
        SynchronousQueue&lt;Request&gt; channel = new SynchronousQueue&lt;&gt;();   // không có bộ đệm: chỉ trao tay

        Thread consumer = new Thread(() -&gt; {
            try {
                for (int i = 0; i &lt; 2; i++) {
                    Request r = channel.take();                            // nhận thông điệp
                    System.out.println("  consumer: processing '" + r.text() + "'");
                    r.replyTo().put("OK:" + r.text().toUpperCase());       // gửi trả lời
                }
            } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        });
        consumer.start();

        for (String text : new String[] {"reserve slot 2", "cancel slot 5"}) {
            SynchronousQueue&lt;String&gt; reply = new SynchronousQueue&lt;&gt;();
            System.out.println("producer: send '" + text + "' and WAIT");
            channel.put(new Request(text, reply));                         // chặn tới khi consumer nhận
            System.out.println("producer: reply = " + reply.take() + " -&gt; continue");   // chặn tới khi có trả lời
        }
        consumer.join();
    }
}</code></pre>
<div class="out">producer: send 'reserve slot 2' and WAIT<br>
&nbsp;&nbsp;consumer: processing 'reserve slot 2'<br>
producer: reply = OK:RESERVE SLOT 2 -&gt; continue<br>
producer: send 'cancel slot 5' and WAIT<br>
&nbsp;&nbsp;consumer: processing 'cancel slot 5'<br>
producer: reply = OK:CANCEL SLOT 5 -&gt; continue</div>
<p><strong>Đọc output:</strong> sau "send … and WAIT" luôn là consumer xử lý rồi mới tới trả lời — producer đứng yên tới khi có trả lời. Vì mỗi thông điệp được trao tay trực tiếp, <strong>không có hàng đợi dồn lên</strong> với một cặp producer/consumer (Gomaa 4.4.7). Ký pháp <code>(in message, out response)</code> nói rằng cùng một thông điệp vừa mang dữ liệu đi vừa mang câu trả lời về.</p>
<table>
<thead><tr><th></th><th>Bất đồng bộ (slide 19)</th><th>Đồng bộ có trả lời (slide 20)</th></tr></thead>
<tbody>
<tr><td>Tên khác</td><td>ghép lỏng (loosely coupled)</td><td>ghép chặt (tightly coupled)</td></tr>
<tr><td>Producer</td><td>đi tiếp ngay</td><td>bị chặn tới khi có trả lời</td></tr>
<tr><td>Hàng đợi</td><td>FIFO có thể dồn lên</td><td>không có</td></tr>
<tr><td>Ví dụ đời thường</td><td>email, tin nhắn Zalo</td><td>gọi điện thoại</td></tr>
<tr><td>LabFlow</td><td>sự kiện "đã tạo lượt đặt" → service thông báo</td><td>React → <code>POST /reservations</code> → chờ 201 + JSON</td></tr>
</tbody>
</table>
<p class="nhan">Gomaa còn nhắc giao tiếp đồng bộ <em>không</em> trả lời (producer chờ tới khi consumer nhận thông điệp) — chi tiết ở Chương 12.</p>`],
      [21, '8. Design patterns',
        `<p class="y-chinh">🎯 A <strong>design pattern</strong> describes a recurring design <strong>problem</strong>, a <strong>solution</strong> to it, and the <strong>context</strong> in which the solution works. The main kinds of reusable patterns: <strong>design patterns</strong> (e.g. Singleton), <strong>architectural patterns</strong> (e.g. MVC), <strong>analysis patterns</strong> (e.g. Accountability), <strong>product line–specific patterns</strong> (e.g. an automotive software line), <strong>idioms</strong> (e.g. RAII in C++).</p>
<table>
<thead><tr><th>Kind</th><th>Size / level</th><th>Who described it (Gomaa 4.5)</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Design pattern</td><td>a small group of collaborating objects ("micro-architecture")</td><td>Gamma, Helm, Johnson, Vlissides — the "Gang of Four", 1995, 23 patterns</td><td>Singleton, Observer, Strategy</td></tr>
<tr><td>Architectural pattern</td><td>structure of major subsystems</td><td>Buschmann et al. (Siemens), 1996</td><td>MVC, layers, client/server, broker</td></tr>
<tr><td>Analysis pattern</td><td>recurring structures in analysis class models</td><td>Fowler</td><td>Accountability (party–role–responsibility)</td></tr>
<tr><td>Product line–specific</td><td>tailored to one domain</td><td>Gomaa and others</td><td>factory automation, e-commerce</td></tr>
<tr><td>Idiom</td><td>lowest level, tied to one programming language</td><td>—</td><td>RAII (C++), try-with-resources (Java)</td></tr>
</tbody>
</table>
<p>History: the idea of a pattern comes from Christopher Alexander's books on the architecture of <em>buildings</em> (1979). Patterns stop you "reinventing the wheel" when the same problem comes back in a new project.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/47670a51402973019458c8a3bc292aaa1c36feb8.svg" alt="The slide's MVC example as it appears in a Spring Boot + React LabFlow (illustration): View, Controller and Model each have one job" loading="lazy" /><p class="chu-thich">🧩 The slide's MVC example as it appears in a Spring Boot + React LabFlow (illustration): View, Controller and Model each have one job</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 21 — the MVC architectural pattern (example on the slide), as Spring MVC does it in LabFlow — illustrative
actor User
component "View\\n(React page / template)" as V
component "Controller\\n(ReservationController)" as C
component "Model\\n(Reservation, ReservationService)" as M
database PostgreSQL
User --&gt; V : clicks "Reserve"
V --&gt; C : HTTP POST /reservations
C --&gt; M : reserve(slot)
M --&gt; PostgreSQL : save
M ..&gt; C : result
C ..&gt; V : data to show
@enduml</code></pre></details>
<div class="pitfall">Order by size: <strong>architectural &gt; design &gt; idiom</strong>. "MVC is a design pattern (GoF)" — the slide classifies it as an <strong>architectural</strong> pattern. And a pattern is not just a solution: problem + solution + <strong>context</strong>.</div>`,
        `<p class="y-chinh">🎯 <strong>Mẫu thiết kế (design pattern)</strong> mô tả một <strong>vấn đề</strong> thiết kế lặp đi lặp lại, một <strong>lời giải</strong> cho nó, và <strong>bối cảnh (context)</strong> mà lời giải đó dùng được. Các loại mẫu tái sử dụng chính: <strong>mẫu thiết kế</strong> (vd Singleton), <strong>mẫu kiến trúc (architectural pattern)</strong> (vd MVC), <strong>mẫu phân tích (analysis pattern)</strong> (vd Accountability), <strong>mẫu riêng cho dòng sản phẩm (product line–specific)</strong> (vd dòng phần mềm ô tô), <strong>thành ngữ lập trình (idiom)</strong> (vd RAII trong C++).</p>
<table>
<thead><tr><th>Loại</th><th>Cỡ / mức</th><th>Ai mô tả (Gomaa 4.5)</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Design pattern</td><td>một nhóm nhỏ đối tượng cộng tác ("vi kiến trúc")</td><td>Gamma, Helm, Johnson, Vlissides — "Gang of Four" (nhóm bốn người), 1995, 23 mẫu</td><td>Singleton, Observer, Strategy</td></tr>
<tr><td>Architectural pattern</td><td>cấu trúc các subsystem lớn</td><td>Buschmann và cộng sự (Siemens), 1996</td><td>MVC, phân tầng, client/server, broker</td></tr>
<tr><td>Analysis pattern</td><td>cấu trúc lặp lại trong mô hình lớp phân tích</td><td>Fowler</td><td>Accountability (bên – vai trò – trách nhiệm)</td></tr>
<tr><td>Product line–specific</td><td>may đo cho một lĩnh vực</td><td>Gomaa và người khác</td><td>tự động hoá nhà máy, thương mại điện tử</td></tr>
<tr><td>Idiom</td><td>mức thấp nhất, gắn với một ngôn ngữ</td><td>—</td><td>RAII (C++), try-with-resources (Java)</td></tr>
</tbody>
</table>
<p>Lịch sử: ý tưởng "mẫu" đến từ sách về kiến trúc <em>nhà cửa</em> của Christopher Alexander (1979). Mẫu giúp bạn khỏi "phát minh lại bánh xe" khi cùng một vấn đề quay lại ở dự án mới.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/47670a51402973019458c8a3bc292aaa1c36feb8.svg" alt="Ví dụ MVC của slide như nó xuất hiện trong LabFlow Spring Boot + React (minh hoạ): View, Controller và Model mỗi phần một việc" loading="lazy" /><p class="chu-thich">🧩 Ví dụ MVC của slide như nó xuất hiện trong LabFlow Spring Boot + React (minh hoạ): View, Controller và Model mỗi phần một việc</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 21 — mẫu kiến trúc MVC (ví dụ trên slide), theo cách Spring MVC làm trong LabFlow — minh hoạ
actor User
component "View\\n(React page / template)" as V
component "Controller\\n(ReservationController)" as C
component "Model\\n(Reservation, ReservationService)" as M
database PostgreSQL
User --&gt; V : clicks "Reserve"
V --&gt; C : HTTP POST /reservations
C --&gt; M : reserve(slot)
M --&gt; PostgreSQL : save
M ..&gt; C : result
C ..&gt; V : data to show
@enduml</code></pre></details>
<div class="pitfall">Xếp theo cỡ: <strong>kiến trúc &gt; thiết kế &gt; idiom</strong>. "MVC là design pattern (GoF)" — slide xếp nó là mẫu <strong>kiến trúc</strong>. Và một mẫu không chỉ là lời giải: vấn đề + lời giải + <strong>bối cảnh</strong>.</div>`],
      [22, '8. Design patterns',
        `<p class="y-chinh">🎯 The slide's Singleton code: <code>DatabaseConnection</code> keeps a <code>private static</code> instance, has a <code>private</code> constructor so nobody outside can call <code>new</code>, and a <code>public static getInstance()</code> that creates the instance the first time and returns it; <code>db1 == db2</code> prints <code>true</code> — one object.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4f3a0354458b2821c940fd957ed9764ad8bff8b5.svg" alt="Singleton in UML: static members are underlined; the class holds a reference to its only instance" loading="lazy" /><p class="chu-thich">🧩 Singleton in UML: static members are underlined; the class holds a reference to its only instance</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 22 — the Singleton pattern: a static instance, a private constructor, a static getInstance()
class DatabaseConnection &lt;&lt;singleton&gt;&gt; {
  - {static} instance : DatabaseConnection
  - DatabaseConnection()
  + {static} getInstance() : DatabaseConnection
}
class SingletonExample {
  + {static} main(args : String[])
}
SingletonExample ..&gt; DatabaseConnection : getInstance()
@enduml</code></pre></details>
<pre><code class="language-java">// Slide 22: the Singleton design pattern exactly as on the slide (DatabaseConnection)
class DatabaseConnection {
    private static DatabaseConnection instance;

    // private constructor: nobody outside can call new
    private DatabaseConnection() {
        System.out.println("Connecting to database...");
    }

    public static DatabaseConnection getInstance() {
        if (instance == null) {                      // created lazily, the first time only
            instance = new DatabaseConnection();
        }
        return instance;
    }
}

public class SingletonExample {
    public static void main(String[] args) {
        DatabaseConnection db1 = DatabaseConnection.getInstance();
        DatabaseConnection db2 = DatabaseConnection.getInstance();
        System.out.println(db1 == db2);              // true: the same object
        // DatabaseConnection db3 = new DatabaseConnection();  &lt;- compile error: constructor is private
    }
}</code></pre>
<div class="out">Connecting to database...<br>
true</div>
<p><strong>Read the output:</strong> "Connecting to database..." appears <em>once</em> although <code>getInstance()</code> is called twice — the second call finds <code>instance != null</code> and returns the same object. This is <em>lazy initialization</em>: nothing is created until first use.</p>
<p>Problem – solution – context in one line: <em>problem</em> "exactly one shared object must exist"; <em>solution</em> private constructor + static accessor; <em>context</em> a shared resource such as a configuration or a connection pool.</p>
<div class="pitfall">➕ The slide's version is <strong>not thread-safe</strong>: two threads can both see <code>null</code> and create two instances (slide 16's race). Fixes: an eager <code>static final</code> field, a holder class, an <code>enum</code>, or <code>synchronized</code>. In Spring Boot you rarely write this by hand — every <code>@Service</code>/<code>@Repository</code> bean is a singleton <em>by default</em>, managed by the container. Full pattern treatment: Chapter 4 of this course (GoF).</div>`,
        `<p class="y-chinh">🎯 Code Singleton trên slide: <code>DatabaseConnection</code> giữ một thể hiện <code>private static</code>, có constructor <code>private</code> nên bên ngoài không gọi được <code>new</code>, và <code>public static getInstance()</code> tạo thể hiện ở lần gọi đầu rồi trả nó về; <code>db1 == db2</code> in ra <code>true</code> — một đối tượng.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4f3a0354458b2821c940fd957ed9764ad8bff8b5.svg" alt="Singleton trong UML: thành phần static được gạch chân; lớp giữ tham chiếu tới thể hiện duy nhất của nó" loading="lazy" /><p class="chu-thich">🧩 Singleton trong UML: thành phần static được gạch chân; lớp giữ tham chiếu tới thể hiện duy nhất của nó</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 22 — mẫu Singleton: một thể hiện static, constructor private, getInstance() static
class DatabaseConnection &lt;&lt;singleton&gt;&gt; {
  - {static} instance : DatabaseConnection
  - DatabaseConnection()
  + {static} getInstance() : DatabaseConnection
}
class SingletonExample {
  + {static} main(args : String[])
}
SingletonExample ..&gt; DatabaseConnection : getInstance()
@enduml</code></pre></details>
<pre><code class="language-java">// Slide 22: mẫu thiết kế Singleton đúng như trên slide (DatabaseConnection)
class DatabaseConnection {
    private static DatabaseConnection instance;

    // constructor private: bên ngoài không gọi new được
    private DatabaseConnection() {
        System.out.println("Connecting to database...");
    }

    public static DatabaseConnection getInstance() {
        if (instance == null) {                      // tạo trễ, chỉ lần đầu
            instance = new DatabaseConnection();
        }
        return instance;
    }
}

public class SingletonExample {
    public static void main(String[] args) {
        DatabaseConnection db1 = DatabaseConnection.getInstance();
        DatabaseConnection db2 = DatabaseConnection.getInstance();
        System.out.println(db1 == db2);              // true: cùng một đối tượng
        // lỗi biên dịch: constructor là private
    }
}</code></pre>
<div class="out">Connecting to database...<br>
true</div>
<p><strong>Đọc output:</strong> "Connecting to database..." chỉ hiện <em>một lần</em> dù <code>getInstance()</code> được gọi hai lần — lần hai thấy <code>instance != null</code> và trả về chính đối tượng cũ. Đây là <em>khởi tạo trễ (lazy initialization)</em>: chưa dùng thì chưa tạo.</p>
<p>Vấn đề – lời giải – bối cảnh trong một dòng: <em>vấn đề</em> "phải có đúng một đối tượng dùng chung"; <em>lời giải</em> constructor private + hàm truy cập static; <em>bối cảnh</em> tài nguyên dùng chung như cấu hình hay pool kết nối.</p>
<div class="pitfall">➕ Bản trên slide <strong>không an toàn luồng (not thread-safe)</strong>: hai luồng có thể cùng thấy <code>null</code> và tạo hai thể hiện (chính tranh chấp ở slide 16). Cách sửa: trường <code>static final</code> tạo sẵn, lớp holder, <code>enum</code>, hoặc <code>synchronized</code>. Trong Spring Boot bạn hiếm khi tự viết — mọi bean <code>@Service</code>/<code>@Repository</code> <em>mặc định</em> là singleton do container quản lý. Học đầy đủ mẫu này ở Chương 4 của khoá (GoF).</div>`],
      [23, '6. Software architecture and components',
        `<p class="y-chinh">🎯 A <strong>software architecture</strong> separates the overall structure — components and their interconnections — from the internal details of each component; a <strong>component</strong> is a self-contained, usually concurrent object with a well-defined interface, usable in applications other than the one it was designed for; a <strong>connector</strong> encapsulates the interconnection protocol between components. <strong>Software architecture = Components + Connectors + Interaction protocols.</strong> (The in-body numbering of this deck jumps around — patterns are "8.", this is "6." — it is the 6th topic of the contents list, book section 4.6.)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e2579a30454b73bbeadf80ceab07fbb9872e79c8.svg" alt="LabFlow illustration: three components; a synchronous REST connector and an asynchronous message-broker connector" loading="lazy" /><p class="chu-thich">🧩 LabFlow illustration: three components; a synchronous REST connector and an asynchronous message-broker connector</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 23 — software architecture = components + connectors + interaction protocols (LabFlow illustration)
component "Web Client" as W
component "Booking Service" as B
component "Notification Service" as N
interface IReservation
queue "message broker\\n(async connector)" as Q
B - IReservation
W ..&gt; IReservation : REST call: request + reply\\n(synchronous, tightly coupled)
B --&gt; Q : ReservationCreated
Q --&gt; N : deliver later\\n(asynchronous, loosely coupled)
@enduml</code></pre></details>
<p><strong>Two points Gomaa adds (4.6.1–4.6.2):</strong> (1) a component is fully specified by the operations it <strong>provides and the operations it requires</strong> — ordinary objects are described only by what they provide; (2) the same logical communication can use different connectors: asynchronous messages between components on one node may use a shared-memory buffer, between nodes a network connector.</p>
<div class="callout">➕ <strong>Beyond the slide — dependency inversion, how Spring Boot achieves low coupling.</strong> Make high-level code (the service) depend on an <em>interface</em>, and let the framework inject the implementation. Swapping the implementation — real email vs a fake for tests — needs no change to the service:</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/9112eadb2af423fa1fe50bce4889be8c38d370e9.svg" alt="LabFlow layered backend (illustration): ReservationService depends on the Notifier and ReservationRepository interfaces; implementations live outside and are injected" loading="lazy" /><p class="chu-thich">🧩 LabFlow layered backend (illustration): ReservationService depends on the Notifier and ReservationRepository interfaces; implementations live outside and are injected</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' LabFlow (illustration) — layered Spring Boot backend; the service depends on interfaces, implementations are injected
package "controller" {
  class ReservationController &lt;&lt;boundary&gt;&gt;
}
package "service" {
  class ReservationService &lt;&lt;control&gt;&gt;
  interface Notifier
}
package "repository" {
  interface ReservationRepository
}
package "infrastructure" {
  class EmailNotifier
  class "JPA proxy (generated by Spring)" as JpaImpl
}
ReservationController --&gt; ReservationService
ReservationService --&gt; Notifier
ReservationService --&gt; ReservationRepository
EmailNotifier ..|&gt; Notifier
JpaImpl ..|&gt; ReservationRepository
@enduml</code></pre></details>
<pre><code class="language-java">// Beyond the slide: low coupling through an interface (dependency inversion, the D of SOLID) — the Spring Boot way
import java.util.ArrayList;
import java.util.List;

interface Notifier {                                   // the service depends on THIS abstraction
    void send(String to, String message);
}

class EmailNotifier implements Notifier {              // real implementation (production)
    public void send(String to, String message) { System.out.println("  [email to " + to + "] " + message); }
}

class FakeNotifier implements Notifier {               // test double: records instead of sending
    final List&lt;String&gt; sent = new ArrayList&lt;&gt;();
    public void send(String to, String message) { sent.add(to + ": " + message); }
}

class ReservationService {
    private final Notifier notifier;                   // high cohesion: only reservation logic here
    ReservationService(Notifier notifier) { this.notifier = notifier; }   // injected (constructor injection)

    boolean reserve(String member, int slot, int freeSlots) {
        if (slot &gt; freeSlots) return false;
        notifier.send(member, "slot " + slot + " reserved");
        return true;
    }
}

public class DipLabFlow {
    public static void main(String[] args) {
        ReservationService prod = new ReservationService(new EmailNotifier());
        System.out.println("production: " + prod.reserve("an@fpt.edu.vn", 2, 5));

        FakeNotifier fake = new FakeNotifier();
        ReservationService test = new ReservationService(fake);          // same service, swapped dependency
        System.out.println("test: " + test.reserve("binh@fpt.edu.vn", 3, 5) + ", " + test.reserve("chi@fpt.edu.vn", 9, 5));
        System.out.println("test recorded: " + fake.sent);
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;[email to an@fpt.edu.vn] slot 2 reserved<br>
production: true<br>
test: true, false<br>
test recorded: [binh@fpt.edu.vn: slot 3 reserved]</div>
<p>The service has <strong>high cohesion</strong> (only reservation rules) and <strong>low coupling</strong> (knows two small interfaces, no email library, no SQL). That is the "D" of SOLID; you will meet it again in Chapter 4 of this course.</p>
<div class="pitfall">Match the pairs: asynchronous = <strong>loosely</strong> coupled; synchronous = <strong>tightly</strong> coupled. A component's interface includes <strong>required</strong> operations too — an option saying "a component is described only by the operations it provides" is false.</div>`,
        `<p class="y-chinh">🎯 <strong>Kiến trúc phần mềm (software architecture)</strong> tách cấu trúc tổng thể — các thành phần và kết nối giữa chúng — khỏi chi tiết bên trong từng thành phần; <strong>component (thành phần)</strong> là một đối tượng tự đủ (self-contained), thường là đồng thời, có interface định nghĩa rõ, dùng được trong ứng dụng khác với ứng dụng nó được thiết kế ban đầu; <strong>connector (bộ nối)</strong> đóng gói giao thức kết nối giữa các component. <strong>Kiến trúc phần mềm = Component + Connector + Giao thức tương tác (interaction protocol).</strong> (Số mục trong thân bộ slide nhảy lung tung — mẫu thiết kế là "8.", mục này là "6." — nó là chủ đề thứ 6 của trang mục lục, mục 4.6 của sách.)</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e2579a30454b73bbeadf80ceab07fbb9872e79c8.svg" alt="Minh hoạ LabFlow: ba component; một connector REST đồng bộ và một connector message broker bất đồng bộ" loading="lazy" /><p class="chu-thich">🧩 Minh hoạ LabFlow: ba component; một connector REST đồng bộ và một connector message broker bất đồng bộ</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 23 — kiến trúc phần mềm = component + connector + giao thức tương tác (minh hoạ LabFlow)
component "Web Client" as W
component "Booking Service" as B
component "Notification Service" as N
interface IReservation
queue "message broker\\n(async connector)" as Q
B - IReservation
W ..&gt; IReservation : REST call: request + reply\\n(synchronous, tightly coupled)
B --&gt; Q : ReservationCreated
Q --&gt; N : deliver later\\n(asynchronous, loosely coupled)
@enduml</code></pre></details>
<p><strong>Hai ý Gomaa thêm (4.6.1–4.6.2):</strong> (1) một component được đặc tả đầy đủ bằng các thao tác nó <strong>cung cấp (provided) và các thao tác nó cần (required)</strong> — đối tượng thường chỉ được mô tả bằng thứ nó cung cấp; (2) cùng một kiểu giao tiếp logic có thể dùng connector khác nhau: thông điệp bất đồng bộ giữa hai component trên cùng một máy có thể dùng bộ đệm bộ nhớ chung, giữa hai máy thì dùng connector qua mạng.</p>
<div class="callout">➕ <strong>Mở rộng ngoài slide — đảo ngược phụ thuộc (dependency inversion), cách Spring Boot đạt ghép nối thấp.</strong> Cho code mức cao (service) phụ thuộc vào <em>interface</em>, và để framework tiêm (inject) cài đặt vào. Đổi cài đặt — email thật hay đồ giả để test — không phải sửa service:</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/9112eadb2af423fa1fe50bce4889be8c38d370e9.svg" alt="Backend LabFlow phân tầng (minh hoạ): ReservationService phụ thuộc interface Notifier và ReservationRepository; cài đặt nằm bên ngoài và được tiêm vào" loading="lazy" /><p class="chu-thich">🧩 Backend LabFlow phân tầng (minh hoạ): ReservationService phụ thuộc interface Notifier và ReservationRepository; cài đặt nằm bên ngoài và được tiêm vào</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' LabFlow (minh hoạ) — backend Spring Boot phân tầng; service phụ thuộc interface, cài đặt được tiêm vào
package "controller" {
  class ReservationController &lt;&lt;boundary&gt;&gt;
}
package "service" {
  class ReservationService &lt;&lt;control&gt;&gt;
  interface Notifier
}
package "repository" {
  interface ReservationRepository
}
package "infrastructure" {
  class EmailNotifier
  class "JPA proxy (generated by Spring)" as JpaImpl
}
ReservationController --&gt; ReservationService
ReservationService --&gt; Notifier
ReservationService --&gt; ReservationRepository
EmailNotifier ..|&gt; Notifier
JpaImpl ..|&gt; ReservationRepository
@enduml</code></pre></details>
<pre><code class="language-java">// Mở rộng: ghép nối lỏng qua interface (đảo ngược phụ thuộc, chữ D của SOLID) — đúng kiểu Spring Boot
import java.util.ArrayList;
import java.util.List;

interface Notifier {                                   // service phụ thuộc vào trừu tượng NÀY
    void send(String to, String message);
}

class EmailNotifier implements Notifier {              // cài đặt thật (chạy thật)
    public void send(String to, String message) { System.out.println("  [email to " + to + "] " + message); }
}

class FakeNotifier implements Notifier {               // đồ giả để test: ghi lại thay vì gửi
    final List&lt;String&gt; sent = new ArrayList&lt;&gt;();
    public void send(String to, String message) { sent.add(to + ": " + message); }
}

class ReservationService {
    private final Notifier notifier;                   // kết dính cao: ở đây chỉ có logic đặt chỗ
    ReservationService(Notifier notifier) { this.notifier = notifier; }   // được tiêm vào (constructor injection)

    boolean reserve(String member, int slot, int freeSlots) {
        if (slot &gt; freeSlots) return false;
        notifier.send(member, "slot " + slot + " reserved");
        return true;
    }
}

public class DipLabFlow {
    public static void main(String[] args) {
        ReservationService prod = new ReservationService(new EmailNotifier());
        System.out.println("production: " + prod.reserve("an@fpt.edu.vn", 2, 5));

        FakeNotifier fake = new FakeNotifier();
        ReservationService test = new ReservationService(fake);          // cùng service, đổi phụ thuộc
        System.out.println("test: " + test.reserve("binh@fpt.edu.vn", 3, 5) + ", " + test.reserve("chi@fpt.edu.vn", 9, 5));
        System.out.println("test recorded: " + fake.sent);
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;[email to an@fpt.edu.vn] slot 2 reserved<br>
production: true<br>
test: true, false<br>
test recorded: [binh@fpt.edu.vn: slot 3 reserved]</div>
<p>Service có <strong>kết dính cao</strong> (chỉ có luật đặt chỗ) và <strong>ghép nối thấp</strong> (biết hai interface nhỏ, không biết thư viện email, không biết SQL). Đó là chữ "D" của SOLID; bạn sẽ gặp lại ở Chương 4 của khoá.</p>
<div class="pitfall">Ghép cặp cho đúng: bất đồng bộ = ghép <strong>lỏng</strong>; đồng bộ = ghép <strong>chặt</strong>. Interface của component gồm cả thao tác <strong>cần (required)</strong> — phương án nói "component chỉ được mô tả bằng các thao tác nó cung cấp" là sai.</div>`],
      [24, '10. Software quality attributes',
        `<p class="y-chinh">🎯 Quality attributes (the <strong>nonfunctional requirements</strong>) are addressed and evaluated when the architecture is developed and deeply affect product quality: <strong>maintainability</strong> (changed after deployment), <strong>modifiability</strong> (modified during and after initial development), <strong>testability</strong> (capable of being tested), <strong>traceability</strong> (products of each phase traced back to products of previous phases).</p>
<table>
<thead><tr><th>Attribute</th><th>Definition (slide)</th><th>Slide example</th><th>LabFlow design choice that helps</th></tr></thead>
<tbody>
<tr><td>Maintainability</td><td>capable of being changed <strong>after deployment</strong></td><td>banking app patched for a small bug without a rewrite</td><td>layered code, one responsibility per class</td></tr>
<tr><td>Modifiability</td><td>modified <strong>during and after</strong> initial development</td><td>add "QR scan" to a payment app without touching other features</td><td>information hiding; new feature = new class behind an interface</td></tr>
<tr><td>Testability</td><td>capable of being tested</td><td>login module with unit tests and mock data</td><td>dependency inversion (the FakeNotifier above)</td></tr>
<tr><td>Traceability</td><td>each phase's products traced back to the previous phase</td><td>"change password": SRS → design → code → test case</td><td>use case IDs in Report 3 repeated in class names, tests, commits</td></tr>
</tbody>
</table>
<p>Why "at architecture time"? Because these qualities come from the <em>structure</em>. You cannot add testability to a 5,000-line god class at the end; you get it by designing small components with interfaces from the start.</p>
<div class="pitfall">Maintainability vs modifiability is the classic pair: maintainability = change <strong>after deployment</strong> (fixes, patches); modifiability = change <strong>during and after initial development</strong> (new features). Traceability is about links <strong>between phases</strong>, not about logging.</div>`,
        `<p class="y-chinh">🎯 Thuộc tính chất lượng (chính là <strong>yêu cầu phi chức năng — nonfunctional requirement</strong>) được xử lý và đánh giá ngay khi xây kiến trúc, và ảnh hưởng sâu tới chất lượng sản phẩm: <strong>maintainability — khả năng bảo trì</strong> (sửa được sau khi triển khai), <strong>modifiability — khả năng sửa đổi</strong> (sửa được trong và sau giai đoạn phát triển đầu), <strong>testability — khả năng kiểm thử</strong>, <strong>traceability — khả năng truy vết</strong> (sản phẩm mỗi pha truy ngược được về sản phẩm pha trước).</p>
<table>
<thead><tr><th>Thuộc tính</th><th>Định nghĩa (slide)</th><th>Ví dụ của slide</th><th>Lựa chọn thiết kế LabFlow giúp đạt nó</th></tr></thead>
<tbody>
<tr><td>Maintainability</td><td>sửa được <strong>sau khi triển khai</strong></td><td>app ngân hàng vá một lỗi nhỏ mà không viết lại</td><td>code phân tầng, mỗi lớp một trách nhiệm</td></tr>
<tr><td>Modifiability</td><td>sửa đổi được <strong>trong và sau</strong> phát triển ban đầu</td><td>thêm "quét QR" vào app thanh toán mà không đụng tính năng khác</td><td>che giấu thông tin; tính năng mới = lớp mới sau một interface</td></tr>
<tr><td>Testability</td><td>kiểm thử được</td><td>module đăng nhập có unit test và dữ liệu giả (mock)</td><td>đảo ngược phụ thuộc (FakeNotifier ở trên)</td></tr>
<tr><td>Traceability</td><td>sản phẩm mỗi pha truy ngược được về pha trước</td><td>"đổi mật khẩu": SRS → thiết kế → code → test case</td><td>mã use case trong Report 3 lặp lại trong tên lớp, test, commit</td></tr>
</tbody>
</table>
<p>Sao lại "ngay lúc làm kiến trúc"? Vì các phẩm chất này đến từ <em>cấu trúc</em>. Không thể thêm khả năng kiểm thử vào một "god class" 5.000 dòng ở phút cuối; bạn có nó bằng cách thiết kế các component nhỏ có interface ngay từ đầu.</p>
<div class="pitfall">Maintainability và modifiability là cặp kinh điển: maintainability = sửa <strong>sau khi triển khai</strong> (vá lỗi); modifiability = sửa <strong>trong và sau phát triển ban đầu</strong> (thêm tính năng). Traceability nói về liên kết <strong>giữa các pha</strong>, không phải ghi log.</div>`],
      [25, '10. Software quality attributes',
        `<p class="y-chinh">🎯 Five more: <strong>scalability</strong> (can grow after initial deployment), <strong>reusability</strong> (can be reused), <strong>performance</strong> (meets goals such as throughput and response time), <strong>security</strong> (resists security threats), <strong>availability</strong> (can address system failure).</p>
<table>
<thead><tr><th>Attribute</th><th>Slide example</th><th>Typical architectural tactic</th></tr></thead>
<tbody>
<tr><td>Scalability</td><td>e-commerce to 1 million concurrent users by adding servers</td><td>stateless servers behind a load balancer, add nodes</td></tr>
<tr><td>Reusability</td><td>one PaymentService library used by e-wallet, e-commerce, ticketing</td><td>components with clean provided/required interfaces</td></tr>
<tr><td>Performance</td><td>search API under 200 ms at 10,000 concurrent requests</td><td>caching, indexes, async processing (slide 19)</td></tr>
<tr><td>Security</td><td>OTP and encryption against spoofing</td><td>authentication, authorization, encryption</td></tr>
<tr><td>Availability</td><td>internet banking at 99.99% SLA survives one server failing</td><td>redundancy, failover, health checks</td></tr>
</tbody>
</table>
<p>Nine attributes in total (slides 24–25) — exactly Gomaa's list in 4.7. They often <strong>conflict</strong>: encryption (security) costs time (performance); many small services (scalability) make testing harder. Architecture is choosing the trade-off that fits the requirements. Chapter 20 (lesson in Chapter 3 of this course) studies each attribute in depth.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): write measurable NFRs in Report 3, e.g. "slot search responds in under 1 s for 200 concurrent users", "passwords stored with BCrypt", "no reservation lost if the email server is down" (availability + the async queue of slide 19). A NFR without a number cannot be tested.</div>
<p class="meo">🧠 Nine attributes: "<strong>M</strong>y <strong>M</strong>om <strong>T</strong>ests <strong>T</strong>ea, <strong>S</strong>o <strong>R</strong>eal <strong>P</strong>eople <strong>S</strong>ip <strong>A</strong>ll" — Maintainability, Modifiability, Testability, Traceability, Scalability, Reusability, Performance, Security, Availability.</p>`,
        `<p class="y-chinh">🎯 Thêm năm thuộc tính: <strong>scalability — khả năng mở rộng</strong> (lớn lên được sau khi triển khai), <strong>reusability — khả năng tái sử dụng</strong>, <strong>performance — hiệu năng</strong> (đạt mục tiêu như thông lượng — throughput và thời gian phản hồi), <strong>security — bảo mật</strong> (chống được mối đe doạ), <strong>availability — tính sẵn sàng</strong> (xử lý được khi hệ thống gặp sự cố).</p>
<table>
<thead><tr><th>Thuộc tính</th><th>Ví dụ của slide</th><th>Chiến thuật kiến trúc điển hình</th></tr></thead>
<tbody>
<tr><td>Scalability</td><td>thương mại điện tử lên 1 triệu người dùng đồng thời bằng cách thêm máy chủ</td><td>máy chủ không giữ trạng thái (stateless) sau bộ cân bằng tải, thêm nút</td></tr>
<tr><td>Reusability</td><td>một thư viện PaymentService dùng cho ví điện tử, thương mại điện tử, bán vé</td><td>component có interface cung cấp/cần rõ ràng</td></tr>
<tr><td>Performance</td><td>API tìm kiếm dưới 200 ms với 10.000 request đồng thời</td><td>cache, index, xử lý bất đồng bộ (slide 19)</td></tr>
<tr><td>Security</td><td>OTP và mã hoá chống giả mạo</td><td>xác thực, phân quyền, mã hoá</td></tr>
<tr><td>Availability</td><td>ngân hàng điện tử SLA 99,99% vẫn chạy khi một máy chủ hỏng</td><td>dự phòng (redundancy), chuyển đổi dự phòng (failover), kiểm tra sức khoẻ</td></tr>
</tbody>
</table>
<p>Tổng cộng chín thuộc tính (slide 24–25) — đúng danh sách 4.7 của Gomaa. Chúng hay <strong>xung đột</strong>: mã hoá (bảo mật) tốn thời gian (hiệu năng); nhiều service nhỏ (mở rộng) làm kiểm thử khó hơn. Làm kiến trúc là chọn sự đánh đổi hợp với yêu cầu. Chapter 20 (bài ở Chương 3 của khoá) học sâu từng thuộc tính.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): viết yêu cầu phi chức năng đo được trong Report 3, ví dụ "tìm ca trống phản hồi dưới 1 giây với 200 người dùng đồng thời", "mật khẩu lưu bằng BCrypt", "không mất lượt đặt nào khi máy chủ email sập" (sẵn sàng + hàng đợi bất đồng bộ của slide 19). Yêu cầu phi chức năng không có con số thì không kiểm thử được.</div>
<p class="meo">🧠 Chín thuộc tính, nhớ bằng "<strong>M</strong>ẹ <strong>M</strong>ua <strong>T</strong>rà <strong>T</strong>ươi, <strong>S</strong>áng <strong>R</strong>a <strong>P</strong>ha <strong>S</strong>ẵn <strong>A</strong>nh uống": Maintainability, Modifiability, Testability, Traceability, Scalability, Reusability, Performance, Security, Availability.</p>`],
    ]),
    bi(`<h2>📌 Must-know after slides 14–25</h2>
<ul>
<li>Sequential = passive objects, one thread, synchronous calls only. Concurrent = several active objects, each with its own thread, asynchronous messages possible.</li>
<li>Active/concurrent object = own thread (also: process, task, thread); passive object = no thread, runs in the caller's thread.</li>
<li>Three cooperation problems: mutual exclusion (exclusive access), synchronization (events, no data), producer/consumer (pass data).</li>
<li>Asynchronous = loosely coupled, producer continues, FIFO queue may build up. Synchronous with reply = tightly coupled, producer waits, no queue.</li>
<li>Pattern = problem + solution + context; five kinds: design, architectural, analysis, product line–specific, idioms.</li>
<li>Architecture = components + connectors + interaction protocols; a component has provided <em>and</em> required interfaces.</li>
<li>Nine quality attributes = nonfunctional requirements, decided at architecture time.</li>
</ul>
<div class="callout">📝 <strong>Self-check:</strong> explain in two sentences why a LabFlow email notification should be sent asynchronously rather than inside the <code>POST /reservations</code> request. (Hint: availability, performance, loose coupling.)</div>`,
    `<h2>📌 Phải nhớ sau slide 14–25</h2>
<ul>
<li>Tuần tự = đối tượng bị động, một luồng, chỉ gọi đồng bộ. Đồng thời = nhiều đối tượng chủ động, mỗi cái một luồng, có thể dùng thông điệp bất đồng bộ.</li>
<li>Đối tượng chủ động/đồng thời = có luồng riêng (còn gọi process, task, thread); đối tượng bị động = không có luồng, chạy trong luồng của bên gọi.</li>
<li>Ba bài toán hợp tác: loại trừ tương hỗ (truy cập độc quyền), đồng bộ (sự kiện, không dữ liệu), producer/consumer (chuyển dữ liệu).</li>
<li>Bất đồng bộ = ghép lỏng, producer đi tiếp, hàng đợi FIFO có thể dồn. Đồng bộ có trả lời = ghép chặt, producer chờ, không có hàng đợi.</li>
<li>Mẫu = vấn đề + lời giải + bối cảnh; năm loại: design, architectural, analysis, product line–specific, idiom.</li>
<li>Kiến trúc = component + connector + giao thức tương tác; component có interface cung cấp <em>và</em> interface cần.</li>
<li>Chín thuộc tính chất lượng = yêu cầu phi chức năng, được quyết định lúc làm kiến trúc.</li>
</ul>
<div class="callout">📝 <strong>Tự kiểm:</strong> giải thích trong hai câu vì sao email thông báo của LabFlow nên gửi bất đồng bộ thay vì gửi ngay trong request <code>POST /reservations</code>. (Gợi ý: tính sẵn sàng, hiệu năng, ghép lỏng.)</div>`),
    books([
      ['gomaa', 'Chapter 4, sections 4.4–4.7 (Figures 4.10–4.12)', 'Chương 4, mục 4.4–4.7 (Hình 4.10–4.12)'],
      ['gof', 'Chapter 1 "Introduction" (what a pattern is: name, problem, solution, consequences) and the Singleton pattern', 'Chương 1 "Introduction" (mẫu là gì: tên, vấn đề, lời giải, hệ quả) và mẫu Singleton'],
      ['fowler', 'Chapter 4 "Sequence Diagrams" (asynchronous vs synchronous messages) and Chapter 14 "Component Diagrams"', 'Chương 4 "Sequence Diagrams" (thông điệp bất đồng bộ và đồng bộ) và Chương 14 "Component Diagrams"'],
      ['plantuml', '"Sequence Diagram" (->> asynchronous arrows, queue participants), "Component Diagram"', 'mục "Sequence Diagram" (mũi tên ->> bất đồng bộ, participant queue), "Component Diagram"'],
      ['fuSlides', 'deck "Chapter 4: Software Design and Architecture Concepts", slides 14–25', 'bộ "Chapter 4: Software Design and Architecture Concepts", slide 14–25'],
    ]),
  ].join('\n'),
};

/* ───────── 1.H — 📑 Slide by slide · COMET overview: use case–based life cycle, three models (school Ch.5, slides 1–8) ───────── */
const L_swd6_1 = {
  title: '1.H — 📑 Slide by slide · COMET overview: use case–based life cycle, three models (school Ch.5, slides 1–8)|||1.H — 📑 Học theo từng slide · Tổng quan COMET: vòng đời dựa trên use case, ba mô hình, kiến trúc (Chapter 5 của trường, slide 1–8)',
  slug: 'swd392-slide-swd6-1',
  type: 'VIDEO',
  description: 'Giảng trọn 8 slide Chapter 5 của trường (Gomaa Ch.5): vòng đời COMET dựa trên use case (Hình 5.1) và sáu pha của nó, sơ đồ nào thuộc mô hình yêu cầu / phân tích / thiết kế, so sánh COMET với USDP và xoắn ốc, bản đồ chương sách cho phần còn lại của môn và sáu loại kiến trúc — sơ đồ PlantUML dựng thật, chỗ slide khác sách, bẫy thi và cách áp vào đồ án LabFlow.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.H · school deck "Chapter 5: Overview of Software Modeling and Design Method", slides 1–8</span>
<h2>COMET overview — the deck, slide by slide</h2>
<p class="lead">This short deck is the <strong>map of the rest of SWD392</strong>. It puts together what lessons 1.A–1.G introduced — UML (Ch.2), life cycle models (Ch.3) and design concepts (Ch.4) — into Gomaa's method, <strong>COMET</strong> (Collaborative Object Modeling and Architectural Design Method). After this lesson you should know which diagram belongs to which phase, which chapter teaches it, and how COMET relates to the USDP and the spiral model — three things the theory exam asks and the Course Project needs.</p>`,
    `<span class="eyebrow">Chương 1 · Bài 1.H · bộ slide "Chapter 5: Overview of Software Modeling and Design Method" của trường, slide 1–8</span>
<h2>Tổng quan COMET — học bộ slide từng trang</h2>
<p class="lead">Bộ slide ngắn này là <strong>tấm bản đồ của phần còn lại của SWD392</strong>. Nó ghép những gì bài 1.A–1.G đã giới thiệu — UML (Ch.2), mô hình vòng đời (Ch.3) và khái niệm thiết kế (Ch.4) — thành phương pháp của Gomaa, <strong>COMET</strong> (Collaborative Object Modeling and Architectural Design Method — phương pháp mô hình hoá đối tượng cộng tác và thiết kế kiến trúc). Học xong bài này bạn phải biết sơ đồ nào thuộc pha nào, chương nào dạy nó, và COMET liên quan thế nào tới USDP và mô hình xoắn ốc — ba thứ bài lý thuyết hay hỏi và Course Project cần tới.</p>`),
    walkHead('swd6', 1, 8),
    walk('swd6', [
      [1, 'Chapter 5: Overview of Software Modeling and Design Method',
        `<p class="y-chinh">🎯 Chapter 5 presents COMET from a life cycle point of view: an <strong>iterative, use case–driven, object-oriented</strong> method that covers the requirements, analysis and design modeling phases, and fits both the USDP and the spiral model.</p>
<p>It is the bridge between Part I of the book (overview, Ch.1–5) and Part II onwards (the actual modeling, Ch.6–20). Every later lesson of this course follows the steps named here.</p>`,
        `<p class="y-chinh">🎯 Chương 5 trình bày COMET từ góc nhìn vòng đời: một phương pháp <strong>lặp, hướng use case, hướng đối tượng</strong>, phủ các pha mô hình hoá yêu cầu, phân tích và thiết kế, và khớp được với cả USDP lẫn mô hình xoắn ốc.</p>
<p>Nó là cây cầu giữa Phần I của sách (tổng quan, Ch.1–5) và Phần II trở đi (mô hình hoá thật sự, Ch.6–20). Mọi bài sau của khoá này đi theo đúng các bước được nêu tên ở đây.</p>`],
      [2, 'Content',
        `<p class="y-chinh">🎯 Four parts: the COMET use case–based software life cycle; COMET life cycle vs other software processes; requirements, analysis and design modeling; designing software architectures.</p>
<p>Slides 3–5 describe the life cycle, slide 6 the comparison, slide 7 the three modeling activities, slide 8 the kinds of architecture. (Gomaa's section 5.5 also describes the <em>steps</em> of using COMET — they appear throughout Chapters 6–18.)</p>`,
        `<p class="y-chinh">🎯 Bốn phần: vòng đời phần mềm dựa trên use case của COMET; so sánh vòng đời COMET với các quy trình khác; mô hình hoá yêu cầu, phân tích và thiết kế; thiết kế kiến trúc phần mềm.</p>
<p>Slide 3–5 tả vòng đời, slide 6 phần so sánh, slide 7 ba hoạt động mô hình hoá, slide 8 các loại kiến trúc. (Sách của Gomaa còn tả các <em>bước</em> dùng COMET — chúng rải khắp Chương 6–18.)</p>`],
      [3, 'COMET Use Case–Based Software Life Cycle',
        `<p class="y-chinh">🎯 The <strong>COMET use case–based software life cycle model</strong> is a <strong>highly iterative</strong> software development process built around the <strong>use case</strong> concept (Gomaa Figure 5.1).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/2809b1ef8e49c73e96e4559c7940d64bc31804af.svg" alt="Figure 5.1 redrawn: from the User to the Customer through requirements, analysis and design modeling, then incremental construction and integration, with many arrows going back" loading="lazy" /><p class="chu-thich">🧩 Figure 5.1 redrawn: from the User to the Customer through requirements, analysis and design modeling, then incremental construction and integration, with many arrows going back</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 3 (Gomaa Figure 5.1) — the COMET use case-based software life cycle: highly iterative, from the User to the Customer
actor User
actor Customer
rectangle "Requirements\\nModeling" as RM
rectangle "Throwaway\\nPrototyping" as TP
rectangle "Analysis\\nModeling" as AM
rectangle "Design\\nModeling" as DM
rectangle "Incremental Software\\nConstruction" as IC
rectangle "Incremental Software\\nIntegration" as II
rectangle "Incremental\\nPrototyping" as IP
rectangle "System\\nTesting" as ST
User -right-&gt; RM
RM -down-&gt; TP
TP -up-&gt; RM
RM -right-&gt; AM
AM -right-&gt; DM
DM -down-&gt; IC
IC -right-&gt; II
II -down-&gt; IP : increment ok
IP -up-&gt; IC : next increment
IP -up-&gt; DM
IP -up-&gt; AM
IP -up-&gt; RM
II -right-&gt; ST
ST -right-&gt; Customer
ST .up.&gt; IP : problems found
AM .left.&gt; RM
DM .left.&gt; AM
@enduml</code></pre></details>
<p><strong>Read the figure left to right:</strong> the <em>User</em> takes part in Requirements Modeling (with a Throwaway Prototyping loop if requirements are unclear) → Analysis Modeling → Design Modeling → Incremental Software Construction → Incremental Software Integration → System Testing → the <em>Customer</em>. The <em>Incremental Prototyping</em> box collects each finished increment and sends arrows back to every earlier phase.</p>
<p>Compare with Figure 3.6 of lesson 1.D — it is the same "throwaway + incremental" combination, with the phases renamed as <em>modeling</em> activities. That is no accident: Gomaa built COMET on his own life cycle research.</p>
<p>How the use case ties the phases together (Gomaa 5.1): in requirements each use case is a sequence of interactions between actors and the system; in analysis the use case is <em>realized</em> by the objects that take part and their interactions; in design the architecture and component interfaces are built; construction and integration pick <em>use cases</em> for each increment; testing builds a test case per use case.</p>
<div class="pitfall">Two actors on the figure, two different names: <strong>User</strong> gives requirements at the start, <strong>Customer</strong> receives the tested system at the end.</div>`,
        `<p class="y-chinh">🎯 <strong>Mô hình vòng đời phần mềm dựa trên use case của COMET</strong> là quy trình phát triển <strong>lặp rất nhiều (highly iterative)</strong>, xây quanh khái niệm <strong>use case</strong> (Hình 5.1 của Gomaa).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/2809b1ef8e49c73e96e4559c7940d64bc31804af.svg" alt="Hình 5.1 vẽ lại: từ User tới Customer qua mô hình hoá yêu cầu, phân tích, thiết kế, rồi xây và tích hợp theo bước tăng, với rất nhiều mũi tên quay ngược" loading="lazy" /><p class="chu-thich">🧩 Hình 5.1 vẽ lại: từ User tới Customer qua mô hình hoá yêu cầu, phân tích, thiết kế, rồi xây và tích hợp theo bước tăng, với rất nhiều mũi tên quay ngược</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 3 (Hình 5.1) — vòng đời phần mềm dựa trên use case của COMET: lặp rất nhiều, đi từ User tới Customer
actor User
actor Customer
rectangle "Requirements\\nModeling" as RM
rectangle "Throwaway\\nPrototyping" as TP
rectangle "Analysis\\nModeling" as AM
rectangle "Design\\nModeling" as DM
rectangle "Incremental Software\\nConstruction" as IC
rectangle "Incremental Software\\nIntegration" as II
rectangle "Incremental\\nPrototyping" as IP
rectangle "System\\nTesting" as ST
User -right-&gt; RM
RM -down-&gt; TP
TP -up-&gt; RM
RM -right-&gt; AM
AM -right-&gt; DM
DM -down-&gt; IC
IC -right-&gt; II
II -down-&gt; IP : increment ok
IP -up-&gt; IC : next increment
IP -up-&gt; DM
IP -up-&gt; AM
IP -up-&gt; RM
II -right-&gt; ST
ST -right-&gt; Customer
ST .up.&gt; IP : problems found
AM .left.&gt; RM
DM .left.&gt; AM
@enduml</code></pre></details>
<p><strong>Đọc hình từ trái sang phải:</strong> <em>User</em> (người dùng) tham gia Requirements Modeling — mô hình hoá yêu cầu (kèm vòng Throwaway Prototyping nếu yêu cầu còn mù mờ) → Analysis Modeling — mô hình hoá phân tích → Design Modeling — mô hình hoá thiết kế → Incremental Software Construction — xây phần mềm theo bước tăng → Incremental Software Integration — tích hợp theo bước tăng → System Testing — kiểm thử hệ thống → <em>Customer</em> (khách hàng). Ô <em>Incremental Prototyping</em> gom mỗi bước tăng đã xong và bắn mũi tên ngược về mọi pha trước.</p>
<p>So với Hình 3.6 ở bài 1.D — đó chính là tổ hợp "bỏ đi + tăng dần", chỉ đổi tên các pha thành hoạt động <em>mô hình hoá</em>. Không phải tình cờ: Gomaa xây COMET trên chính nghiên cứu vòng đời của ông.</p>
<p>Use case buộc các pha lại với nhau thế nào (Gomaa 5.1): ở pha yêu cầu, mỗi use case là một chuỗi tương tác giữa actor và hệ thống; ở pha phân tích, use case được <em>hiện thực hoá (realized)</em> bằng các đối tượng tham gia và tương tác giữa chúng; ở pha thiết kế, kiến trúc và interface của component được dựng; xây dựng và tích hợp chọn <em>use case</em> cho mỗi bước tăng; kiểm thử dựng một test case cho mỗi use case.</p>
<div class="pitfall">Hai actor trên hình, hai cái tên khác nhau: <strong>User</strong> đưa yêu cầu lúc đầu, <strong>Customer</strong> nhận hệ thống đã kiểm thử lúc cuối.</div>`],
      [4, 'COMET Use Case–Based Software Life Cycle',
        `<p class="y-chinh">🎯 What each modeling phase produces (school slide): <strong>requirements</strong> — use case diagram (actors, use cases) + use case narratives; <strong>analysis</strong> — analysis class diagram, state machine diagram, sequence diagram, activity diagram; <strong>design</strong> — design class diagram, component diagram, deployment diagram.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/72a90da1832dc6ada6364282de8f461b9dc6be95.svg" alt="The three COMET models according to Gomaa 5.3 — with the chapter of the book that teaches each part" loading="lazy" /><p class="chu-thich">🧩 The three COMET models according to Gomaa 5.3 — with the chapter of the book that teaches each part</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
skinparam packageStyle folder
' Slides 4 and 7 — the three COMET models and the diagrams produced in each (chapters of Gomaa in brackets)
package "Requirements Model (Ch.6) — system = black box" as R {
  rectangle "• use case diagram: actors + use cases\\l• use case descriptions (narratives)\\l• nonfunctional requirements\\l" as r
}
package "Analysis Model (Ch.7-11) — understand the PROBLEM" as A {
  rectangle "• static model: class diagram of domain classes (Ch.7)\\l• object structuring: &lt;&lt;entity&gt;&gt; &lt;&lt;boundary&gt;&gt; &lt;&lt;control&gt;&gt; (Ch.8)\\l• dynamic interaction: communication / sequence diagrams (Ch.9, 11)\\l• dynamic state machine modeling: statecharts (Ch.10)\\l" as a
}
package "Design Model (Ch.12-18) — compose the SOLUTION" as D {
  rectangle "• integrated communication diagram, subsystems (Ch.13)\\l• architectural and design patterns (Ch.12, 15-18)\\l• class interfaces, information hiding classes (Ch.14)\\l• active or passive objects, sync or async messages (Ch.18)\\l" as d
}
r -down-&gt; a : each use case is realized\\n(objects + their interactions)
a -down-&gt; d : mapped to the operational environment
@enduml</code></pre></details>
<p><strong>The book says it more precisely (5.1.1–5.1.3, 5.3):</strong></p>
<ul>
<li><strong>Requirements</strong>: the system is a black box; functional requirements = actors + use cases, each with a narrative; if requirements are not understood, build a throwaway prototype.</li>
<li><strong>Analysis</strong> = understand the <em>problem</em> (decompose): <em>static model</em> (class diagrams of problem-domain classes, attributes but no operations yet), <em>object structuring</em> (entity / boundary / control objects), <em>dynamic interaction model</em> (communication or sequence diagrams realizing each use case), <em>state machines</em> for state-dependent objects.</li>
<li><strong>Design</strong> = compose the <em>solution</em>: map the analysis model to the operational environment, split into subsystems, choose patterns, design class interfaces, decide active/passive objects and sync/async messages.</li>
</ul>
<div class="pitfall">The school slide lists the <strong>activity diagram</strong> under analysis; in Gomaa's COMET the analysis activities are static modeling, object structuring, dynamic interaction and state machine modeling — activity diagrams appear only in Ch.6 to describe use case flows. If an exam question quotes the book ("what is carried out during analysis modeling?"), the answer is <strong>developing static and dynamic models</strong>. Also: <em>operations</em> are added in the design model, not in the analysis class diagram.</div>`,
        `<p class="y-chinh">🎯 Mỗi pha mô hình hoá cho ra gì (slide trường): <strong>yêu cầu</strong> — use case diagram (actor, use case) + đặc tả use case bằng lời (narrative); <strong>phân tích</strong> — class diagram phân tích, state machine diagram, sequence diagram, activity diagram; <strong>thiết kế</strong> — class diagram thiết kế, component diagram, deployment diagram.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/72a90da1832dc6ada6364282de8f461b9dc6be95.svg" alt="Ba mô hình của COMET theo Gomaa 5.3 — kèm chương sách dạy từng phần" loading="lazy" /><p class="chu-thich">🧩 Ba mô hình của COMET theo Gomaa 5.3 — kèm chương sách dạy từng phần</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
skinparam packageStyle folder
' Slide 4 và 7 — ba mô hình của COMET và các sơ đồ tạo ra ở mỗi mô hình (chương sách Gomaa trong ngoặc)
package "Requirements Model (Ch.6) — system = black box" as R {
  rectangle "• use case diagram: actors + use cases\\l• use case descriptions (narratives)\\l• nonfunctional requirements\\l" as r
}
package "Analysis Model (Ch.7-11) — understand the PROBLEM" as A {
  rectangle "• static model: class diagram of domain classes (Ch.7)\\l• object structuring: &lt;&lt;entity&gt;&gt; &lt;&lt;boundary&gt;&gt; &lt;&lt;control&gt;&gt; (Ch.8)\\l• dynamic interaction: communication / sequence diagrams (Ch.9, 11)\\l• dynamic state machine modeling: statecharts (Ch.10)\\l" as a
}
package "Design Model (Ch.12-18) — compose the SOLUTION" as D {
  rectangle "• integrated communication diagram, subsystems (Ch.13)\\l• architectural and design patterns (Ch.12, 15-18)\\l• class interfaces, information hiding classes (Ch.14)\\l• active or passive objects, sync or async messages (Ch.18)\\l" as d
}
r -down-&gt; a : each use case is realized\\n(objects + their interactions)
a -down-&gt; d : mapped to the operational environment
@enduml</code></pre></details>
<p><strong>Sách nói chính xác hơn (5.1.1–5.1.3, 5.3):</strong></p>
<ul>
<li><strong>Yêu cầu</strong>: hệ thống là hộp đen; yêu cầu chức năng = actor + use case, mỗi use case có một đặc tả bằng lời; nếu chưa hiểu yêu cầu thì làm nguyên mẫu bỏ đi.</li>
<li><strong>Phân tích</strong> = hiểu <em>bài toán</em> (chia nhỏ ra): <em>mô hình tĩnh (static model)</em> (class diagram của các lớp miền bài toán, có thuộc tính nhưng chưa có thao tác), <em>cấu trúc hoá đối tượng (object structuring)</em> (đối tượng entity / boundary / control), <em>mô hình tương tác động (dynamic interaction model)</em> (communication hoặc sequence diagram hiện thực hoá từng use case), <em>máy trạng thái (state machine)</em> cho đối tượng phụ thuộc trạng thái.</li>
<li><strong>Thiết kế</strong> = ghép nên <em>lời giải</em>: ánh xạ mô hình phân tích vào môi trường vận hành, chia subsystem, chọn pattern, thiết kế interface của lớp, quyết định đối tượng chủ động/bị động và thông điệp đồng bộ/bất đồng bộ.</li>
</ul>
<div class="pitfall">Slide trường xếp <strong>activity diagram</strong> vào pha phân tích; trong COMET của Gomaa, hoạt động phân tích là mô hình tĩnh, cấu trúc hoá đối tượng, tương tác động và máy trạng thái — activity diagram chỉ xuất hiện ở Ch.6 để tả luồng use case. Nếu câu hỏi trích sách ("what is carried out during analysis modeling?"), đáp án là <strong>developing static and dynamic models</strong> (xây mô hình tĩnh và động). Thêm nữa: <em>thao tác (operation)</em> được thêm ở mô hình thiết kế, không phải ở class diagram phân tích.</div>`],
      [5, 'COMET Use Case–Based Software Life Cycle',
        `<p class="y-chinh">🎯 The last phases: <strong>incremental software integration</strong> — sequence diagrams of integration scenarios test the interaction flows of each increment, package/component diagrams track which modules are integrated; <strong>system testing</strong> — use case diagrams (revisited) are the basis of functional test cases, activity/sequence diagrams model the test scenarios.</p>
<table>
<thead><tr><th>Phase (Gomaa 5.1.4–5.1.6)</th><th>What is done</th><th>Box</th><th>Who</th></tr></thead>
<tbody>
<tr><td>Incremental software construction</td><td>pick a subset of use cases; <strong>detailed design, coding and unit testing</strong> of the classes in that subset</td><td>white</td><td>development team</td></tr>
<tr><td>Incremental software integration</td><td><strong>integration testing</strong> of each increment: test cases per use case, the interfaces between the objects of each use case</td><td>white</td><td>development team</td></tr>
<tr><td>System testing</td><td><strong>functional testing</strong> against the requirements, test cases per black-box use case; every increment released to the customer passes it</td><td>black</td><td>separate test team</td></tr>
</tbody>
</table>
<p>The same diagrams live on: the sequence diagram you drew in analysis becomes the script of an integration test; the use case becomes a system test. That is <em>traceability</em> (lesson 1.G, slide 24) built into the method.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): increment 1 = use cases "Log In" + "Reserve Equipment" end to end; its integration test follows the sequence diagram <code>ReservationController → ReservationService → ReservationRepository</code> (e.g. a <code>@SpringBootTest</code>); the system test is the use case's main and alternative flows clicked through the UI.</div>
<div class="pitfall">Gomaa's questions 4–6: construction = "detailed design, coding, and <strong>unit testing</strong> of the classes in a subset"; integration = "<strong>integration testing</strong> of the classes in each increment"; system testing = <strong>black box</strong> testing.</div>`,
        `<p class="y-chinh">🎯 Các pha cuối: <strong>tích hợp phần mềm theo bước tăng</strong> — sequence diagram của các kịch bản tích hợp dùng để kiểm luồng tương tác của mỗi bước tăng, package/component diagram theo dõi module nào đã được tích hợp; <strong>kiểm thử hệ thống</strong> — use case diagram (dùng lại) là cơ sở để thiết kế ca kiểm thử chức năng, activity/sequence diagram mô hình hoá kịch bản kiểm thử.</p>
<table>
<thead><tr><th>Pha (Gomaa 5.1.4–5.1.6)</th><th>Làm gì</th><th>Hộp</th><th>Ai làm</th></tr></thead>
<tbody>
<tr><td>Xây phần mềm theo bước tăng</td><td>chọn một tập use case; <strong>thiết kế chi tiết, viết code và kiểm thử đơn vị</strong> các lớp của tập đó</td><td>trắng</td><td>đội phát triển</td></tr>
<tr><td>Tích hợp theo bước tăng</td><td><strong>kiểm thử tích hợp</strong> mỗi bước tăng: ca kiểm thử theo use case, kiểm các interface giữa đối tượng của từng use case</td><td>trắng</td><td>đội phát triển</td></tr>
<tr><td>Kiểm thử hệ thống</td><td><strong>kiểm thử chức năng</strong> so với yêu cầu, ca kiểm thử theo từng use case hộp đen; mọi bước tăng giao cho khách đều phải qua</td><td>đen</td><td>đội kiểm thử riêng</td></tr>
</tbody>
</table>
<p>Các sơ đồ vẫn sống tiếp: sequence diagram vẽ lúc phân tích thành kịch bản của một bài kiểm thử tích hợp; use case thành một bài kiểm thử hệ thống. Đó là <em>khả năng truy vết (traceability)</em> (bài 1.G, slide 24) được gắn sẵn vào phương pháp.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): bước tăng 1 = use case "Log In" + "Reserve Equipment" chạy trọn từ đầu tới cuối; bài kiểm thử tích hợp của nó đi theo sequence diagram <code>ReservationController → ReservationService → ReservationRepository</code> (vd một <code>@SpringBootTest</code>); bài kiểm thử hệ thống là bấm qua giao diện đủ luồng chính và luồng thay thế của use case.</div>
<div class="pitfall">Câu 4–6 cuối chương của Gomaa: construction = "thiết kế chi tiết, viết code và <strong>kiểm thử đơn vị</strong> các lớp trong một tập con"; integration = "<strong>kiểm thử tích hợp</strong> các lớp của mỗi bước tăng"; system testing = kiểm thử <strong>hộp đen</strong>.</div>`],
      [6, 'COMET Life Cycle vs. Other Software Processes',
        `<p class="y-chinh">🎯 <strong>USDP (RUP)</strong>: each phase of the COMET life cycle corresponds to a workflow of the USDP (requirements, analysis, design, implementation, test). <strong>Spiral</strong>: COMET can be used with the spiral model — during planning of a cycle the project manager decides which technical activity (requirements, analysis or design modeling) is done in the <strong>third quadrant (develop product)</strong>; risk analysis and cycle planning decide how many iterations each activity needs.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/450eee2db9228e4f29187773b5a07b4eee0b2bc8.svg" alt="COMET phases mapped to USDP workflows (Gomaa 5.2.1): the first three have the same names; integration and system testing both map to Test" loading="lazy" /><p class="chu-thich">🧩 COMET phases mapped to USDP workflows (Gomaa 5.2.1): the first three have the same names; integration and system testing both map to Test</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 6 — each COMET phase corresponds to a USDP (RUP) workflow
left to right direction
package "COMET life cycle phases" {
  rectangle "Requirements Modeling" as C1
  rectangle "Analysis Modeling" as C2
  rectangle "Design Modeling" as C3
  rectangle "Incremental Software Construction" as C4
  rectangle "Incremental Software Integration" as C5
  rectangle "System Testing" as C6
}
package "USDP / RUP core workflows" {
  rectangle "Requirements" as U1
  rectangle "Analysis" as U2
  rectangle "Design" as U3
  rectangle "Implementation" as U4
  rectangle "Test" as U5
}
C1 --&gt; U1
C2 --&gt; U2
C3 --&gt; U3
C4 --&gt; U4
C5 --&gt; U5 : development team
C6 --&gt; U5 : separate test team
@enduml</code></pre></details>
<p><strong>Details from the book:</strong> COMET's first three phases have the <em>same names</em> as the first three USDP workflows — COMET was strongly influenced by Jacobson's earlier work. Incremental construction ↔ implementation. Integration <em>and</em> system testing ↔ the single test workflow; COMET keeps them apart because integration testing is a development-team activity, while a separate test team should do system testing. And the difference in focus: USDP emphasises <em>process</em> (life cycle detail), COMET emphasises <em>method</em> (how to model).</p>
<p><strong>With the spiral</strong> (lesson 1.D, slide 13): quadrant 2 (risks) and quadrant 4 (planning) decide how many turns each modeling activity takes; quadrant 3 is where the modeling happens.</p>
<div class="pitfall">"COMET replaces the USDP" — <strong>false</strong>: COMET is <em>compatible</em> with USDP and with the spiral. And the spiral quadrant in which COMET's modeling happens is the <strong>third</strong> (develop product), not the second (analyze risks).</div>`,
        `<p class="y-chinh">🎯 <strong>USDP (RUP)</strong>: mỗi pha của vòng đời COMET tương ứng một workflow của USDP (requirements, analysis, design, implementation, test). <strong>Xoắn ốc</strong>: COMET dùng được với mô hình xoắn ốc — khi lập kế hoạch cho một vòng, quản lý dự án (PM) quyết định hoạt động kỹ thuật nào (mô hình hoá yêu cầu, phân tích hay thiết kế) làm ở <strong>góc phần tư thứ ba (phát triển sản phẩm)</strong>; phân tích rủi ro và lập kế hoạch vòng quyết định mỗi hoạt động cần bao nhiêu vòng lặp.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/450eee2db9228e4f29187773b5a07b4eee0b2bc8.svg" alt="Các pha của COMET ánh xạ sang workflow của USDP (Gomaa 5.2.1): ba pha đầu cùng tên; tích hợp và kiểm thử hệ thống đều ứng với Test" loading="lazy" /><p class="chu-thich">🧩 Các pha của COMET ánh xạ sang workflow của USDP (Gomaa 5.2.1): ba pha đầu cùng tên; tích hợp và kiểm thử hệ thống đều ứng với Test</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 6 — mỗi pha của COMET tương ứng một workflow của USDP (RUP)
left to right direction
package "COMET life cycle phases" {
  rectangle "Requirements Modeling" as C1
  rectangle "Analysis Modeling" as C2
  rectangle "Design Modeling" as C3
  rectangle "Incremental Software Construction" as C4
  rectangle "Incremental Software Integration" as C5
  rectangle "System Testing" as C6
}
package "USDP / RUP core workflows" {
  rectangle "Requirements" as U1
  rectangle "Analysis" as U2
  rectangle "Design" as U3
  rectangle "Implementation" as U4
  rectangle "Test" as U5
}
C1 --&gt; U1
C2 --&gt; U2
C3 --&gt; U3
C4 --&gt; U4
C5 --&gt; U5 : development team
C6 --&gt; U5 : separate test team
@enduml</code></pre></details>
<p><strong>Chi tiết trong sách:</strong> ba pha đầu của COMET <em>trùng tên</em> với ba workflow đầu của USDP — COMET chịu ảnh hưởng mạnh từ công trình trước đó của Jacobson. Xây theo bước tăng ↔ implementation. Tích hợp <em>và</em> kiểm thử hệ thống ↔ một workflow test duy nhất; COMET tách riêng hai việc vì kiểm thử tích hợp là việc của đội phát triển, còn kiểm thử hệ thống nên do một đội kiểm thử riêng làm. Và khác nhau về trọng tâm: USDP nhấn mạnh <em>quy trình</em> (chi tiết vòng đời), COMET nhấn mạnh <em>phương pháp</em> (mô hình hoá thế nào).</p>
<p><strong>Với xoắn ốc</strong> (bài 1.D, slide 13): góc phần tư 2 (rủi ro) và 4 (kế hoạch) quyết định mỗi hoạt động mô hình hoá đi bao nhiêu vòng; góc phần tư 3 là nơi việc mô hình hoá diễn ra.</p>
<div class="pitfall">"COMET thay thế USDP" — <strong>sai</strong>: COMET <em>tương thích</em> với USDP và với xoắn ốc. Và góc phần tư của xoắn ốc nơi COMET mô hình hoá là góc <strong>thứ ba</strong> (phát triển sản phẩm), không phải góc thứ hai (phân tích rủi ro).</div>`],
      [7, 'Requirements, Analysis, and Design Modeling',
        `<p class="y-chinh">🎯 Where each activity is taught: <strong>requirements modeling</strong> — Chapter 6; <strong>analysis modeling</strong> — Chapters 7, 8, 9, 10, 11; <strong>design modeling</strong> — Chapters 12 to 18.</p>
<table>
<thead><tr><th>Book chapter</th><th>Topic</th><th>School deck</th><th>Web lesson (this course)</th></tr></thead>
<tbody>
<tr><td>Ch.6</td><td>use case modeling</td><td>swd7</td><td>Chapter 2</td></tr>
<tr><td>Ch.7</td><td>static modeling (class diagrams)</td><td>swd9</td><td>Chapter 2</td></tr>
<tr><td>Ch.8</td><td>object and class structuring (entity/boundary/control)</td><td>swd10</td><td>Chapter 2</td></tr>
<tr><td>Ch.9</td><td>dynamic interaction modeling (sequence/communication)</td><td>swd11</td><td>Chapter 2</td></tr>
<tr><td>Ch.10</td><td>finite state machines (statecharts)</td><td>swd12</td><td>Chapter 2</td></tr>
<tr><td>Ch.11</td><td>state-dependent dynamic interaction</td><td>swd13</td><td>Chapter 2</td></tr>
<tr><td>Ch.12–18</td><td>patterns, subsystems, OO / client-server / SOA / component / real-time architectures</td><td>swd16–swd26</td><td>Chapter 3</td></tr>
<tr><td>Ch.20</td><td>software quality attributes</td><td>swd8</td><td>Chapter 3</td></tr>
</tbody>
</table>
<p><strong>The key sentence of section 5.3:</strong> "analysis is breaking down or decomposing the problem so it is understood better; design is synthesizing or composing (putting together) the solution." In analysis you postpone decisions such as active vs passive objects, sync vs async messages and the operation names at the receiver — those are design decisions.</p>
<p class="meo">🧠 Analysis = <strong>what</strong> the problem is (problem domain); design = <strong>how</strong> we solve it (solution domain). Same distinction as SRS vs architecture in lesson 1.E.</p>`,
        `<p class="y-chinh">🎯 Mỗi hoạt động được dạy ở đâu: <strong>mô hình hoá yêu cầu</strong> — Chương 6; <strong>mô hình hoá phân tích</strong> — Chương 7, 8, 9, 10, 11; <strong>mô hình hoá thiết kế</strong> — Chương 12 tới 18.</p>
<table>
<thead><tr><th>Chương sách</th><th>Chủ đề</th><th>Bộ slide trường</th><th>Bài trên web (khoá này)</th></tr></thead>
<tbody>
<tr><td>Ch.6</td><td>mô hình hoá use case</td><td>swd7</td><td>Chương 2</td></tr>
<tr><td>Ch.7</td><td>mô hình tĩnh (class diagram)</td><td>swd9</td><td>Chương 2</td></tr>
<tr><td>Ch.8</td><td>cấu trúc hoá đối tượng và lớp (entity/boundary/control)</td><td>swd10</td><td>Chương 2</td></tr>
<tr><td>Ch.9</td><td>mô hình tương tác động (sequence/communication)</td><td>swd11</td><td>Chương 2</td></tr>
<tr><td>Ch.10</td><td>máy trạng thái hữu hạn (statechart)</td><td>swd12</td><td>Chương 2</td></tr>
<tr><td>Ch.11</td><td>tương tác động phụ thuộc trạng thái</td><td>swd13</td><td>Chương 2</td></tr>
<tr><td>Ch.12–18</td><td>pattern, subsystem, kiến trúc OO / client-server / SOA / component / thời gian thực</td><td>swd16–swd26</td><td>Chương 3</td></tr>
<tr><td>Ch.20</td><td>thuộc tính chất lượng phần mềm</td><td>swd8</td><td>Chương 3</td></tr>
</tbody>
</table>
<p><strong>Câu then chốt của mục 5.3:</strong> "phân tích là chia nhỏ (decompose) bài toán để hiểu nó hơn; thiết kế là tổng hợp, ghép lại (compose) lời giải." Lúc phân tích bạn hoãn các quyết định như đối tượng chủ động hay bị động, thông điệp đồng bộ hay bất đồng bộ, tên thao tác ở bên nhận — đó là quyết định thiết kế.</p>
<p class="meo">🧠 Phân tích = bài toán là <strong>gì</strong> (miền bài toán — problem domain); thiết kế = giải <strong>thế nào</strong> (miền lời giải — solution domain). Cùng một phân biệt như SRS và kiến trúc ở bài 1.E.</p>`],
      [8, 'Designing Software Architectures',
        `<p class="y-chinh">🎯 Six kinds of software architecture, each with its chapter: <strong>object-oriented</strong> (Ch.14), <strong>client/server</strong> (Ch.15), <strong>service-oriented</strong> (Ch.16), <strong>distributed component-based</strong> (Ch.17), <strong>real-time</strong> (Ch.18), <strong>software product line</strong> (Ch.19).</p>
<table>
<thead><tr><th>Architecture</th><th>One-line idea (Gomaa 5.4)</th><th>Where you meet it today</th></tr></thead>
<tbody>
<tr><td>Object-oriented</td><td>information hiding, classes, inheritance inside one program</td><td>the inside of any Spring Boot service</td></tr>
<tr><td>Client/server</td><td>one server, many clients</td><td>React app ↔ LabFlow backend</td></tr>
<tr><td>Service-oriented (SOA)</td><td>autonomous distributed services composed into applications</td><td>microservices, REST/gRPC APIs</td></tr>
<tr><td>Distributed component-based</td><td>configurable components deployed on distributed nodes</td><td>modules deployed separately, message brokers</td></tr>
<tr><td>Real-time</td><td>concurrent, many streams of input events, state-dependent control</td><td>embedded systems, IoT, robots (slide 17 of lesson 1.G)</td></tr>
<tr><td>Software product line</td><td>a family of products: commonality + variability</td><td>one codebase configured for several customers</td></tr>
</tbody>
</table>
<p>For a web developer the first three matter most; real-time and product lines are lighter for this course (study enough for the theory exam). Chapter 19 (product lines) is not in the school's deck list; the others are in Chapter 3 of this course.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): LabFlow is <strong>client/server</strong> at the top level (React client, Spring Boot server, PostgreSQL), <strong>layered object-oriented</strong> inside the server, and uses one asynchronous connector for notifications. In Report 4 you name these choices and justify them with quality attributes — exactly what Assignment 03 of SWD392 asks.</div>`,
        `<p class="y-chinh">🎯 Sáu loại kiến trúc phần mềm, mỗi loại một chương: <strong>hướng đối tượng</strong> (Ch.14), <strong>client/server</strong> (Ch.15), <strong>hướng dịch vụ (service-oriented)</strong> (Ch.16), <strong>dựa trên component phân tán (distributed component-based)</strong> (Ch.17), <strong>thời gian thực (real-time)</strong> (Ch.18), <strong>dòng sản phẩm phần mềm (software product line)</strong> (Ch.19).</p>
<table>
<thead><tr><th>Kiến trúc</th><th>Ý một dòng (Gomaa 5.4)</th><th>Ngày nay gặp ở đâu</th></tr></thead>
<tbody>
<tr><td>Hướng đối tượng</td><td>che giấu thông tin, lớp, kế thừa trong một chương trình</td><td>bên trong mọi service Spring Boot</td></tr>
<tr><td>Client/server</td><td>một máy chủ, nhiều máy khách</td><td>app React ↔ backend LabFlow</td></tr>
<tr><td>Hướng dịch vụ (SOA)</td><td>các dịch vụ phân tán tự trị được ghép thành ứng dụng</td><td>microservice, API REST/gRPC</td></tr>
<tr><td>Component phân tán</td><td>component cấu hình được, triển khai trên nhiều nút</td><td>module triển khai riêng, message broker</td></tr>
<tr><td>Thời gian thực</td><td>đồng thời, nhiều luồng sự kiện đầu vào, điều khiển phụ thuộc trạng thái</td><td>hệ nhúng, IoT, robot (slide 17 bài 1.G)</td></tr>
<tr><td>Dòng sản phẩm</td><td>một họ sản phẩm: phần chung + phần biến đổi</td><td>một bộ mã cấu hình cho nhiều khách hàng</td></tr>
</tbody>
</table>
<p>Với lập trình viên web, ba loại đầu quan trọng nhất; thời gian thực và dòng sản phẩm nhẹ hơn với môn này (học đủ để thi lý thuyết). Chương 19 (dòng sản phẩm) không có trong danh sách slide của trường; các loại còn lại nằm ở Chương 3 của khoá.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): LabFlow ở mức cao nhất là <strong>client/server</strong> (client React, server Spring Boot, PostgreSQL), bên trong server là <strong>hướng đối tượng phân tầng</strong>, và dùng một connector bất đồng bộ cho thông báo. Trong Report 4 bạn gọi tên các lựa chọn này và biện minh bằng thuộc tính chất lượng — đúng thứ Assignment 03 của SWD392 yêu cầu.</div>`],
    ]),
    bi(`<h2>📌 Chapter 1 done — what you now have</h2>
<ul>
<li>COMET = use case–based, highly iterative life cycle: requirements → analysis → design modeling → incremental construction → incremental integration → system testing, with throwaway and incremental prototyping loops.</li>
<li>Requirements model = actors + use cases (black box); analysis model = static + dynamic models of the problem; design model = architecture of the solution.</li>
<li>COMET phases ↔ USDP workflows; with the spiral, modeling happens in quadrant 3.</li>
<li>Analysis decomposes the problem; design composes the solution.</li>
</ul>
<div class="callout">📝 <strong>Self-check before Chapter 2:</strong> for LabFlow, write one line per phase of Figure 5.1 saying what you would produce (e.g. "Requirements modeling: use case diagram with Member, Lab Manager, Admin + 8 use case descriptions"). Chapter 2 starts with the first of those lines: use case modeling.</div>`,
    `<h2>📌 Xong Chương 1 — giờ bạn đã có</h2>
<ul>
<li>COMET = vòng đời dựa trên use case, lặp rất nhiều: mô hình hoá yêu cầu → phân tích → thiết kế → xây theo bước tăng → tích hợp theo bước tăng → kiểm thử hệ thống, có vòng nguyên mẫu bỏ đi và nguyên mẫu tăng dần.</li>
<li>Mô hình yêu cầu = actor + use case (hộp đen); mô hình phân tích = mô hình tĩnh + động của bài toán; mô hình thiết kế = kiến trúc của lời giải.</li>
<li>Pha COMET ↔ workflow USDP; với xoắn ốc, mô hình hoá diễn ra ở góc phần tư 3.</li>
<li>Phân tích chia nhỏ bài toán; thiết kế ghép nên lời giải.</li>
</ul>
<div class="callout">📝 <strong>Tự kiểm trước Chương 2:</strong> với LabFlow, viết mỗi pha của Hình 5.1 một dòng nói bạn sẽ tạo ra gì (vd "Requirements modeling: use case diagram có Member, Lab Manager, Admin + 8 bản đặc tả use case"). Chương 2 bắt đầu đúng từ dòng đầu tiên: mô hình hoá use case.</div>`),
    books([
      ['gomaa', 'Chapter 5, sections 5.1–5.4 (Figure 5.1) and the six exercises at the end of the chapter', 'Chương 5, mục 5.1–5.4 (Hình 5.1) và sáu câu trắc nghiệm cuối chương'],
      ['fowler', 'Chapter 2 "Development Process" — fitting UML into a process', 'Chương 2 "Development Process" — đặt UML vào một quy trình'],
      ['plantuml', '"Deployment Diagram" (rectangle, actor, arrows) and packages with folder style', 'mục "Deployment Diagram" (rectangle, actor, mũi tên) và package kiểu thư mục'],
      ['fuSlides', 'deck "Chapter 5: Overview of Software Modeling and Design Method", slides 1–8', 'bộ "Chapter 5: Overview of Software Modeling and Design Method", slide 1–8'],
    ]),
  ].join('\n'),
};

/* ───────── 1.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Read and draw UML, choose a life cycle, judge a design ───────── */
const L_on_ch1 = {
  title: '1.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Read and draw UML, choose a life cycle, judge a design|||1.3 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Đọc và vẽ UML, chọn vòng đời, đánh giá một thiết kế',
  slug: 'swd392-on-ch1',
  type: 'VIDEO',
  description: '7 bài tập kiểu PT/FE/PE cho Chương 1 trên case "FU Bike" (xe đạp dùng chung trong trường): nhận diện 6 loại sơ đồ UML, đọc class diagram có đủ 6 quan hệ + bội số (và tìm bội số sai), vẽ class diagram từ đoạn mô tả, chọn mô hình vòng đời cho 5 tình huống, tách lớp ôm đồm thành kết dính cao – ghép nối lỏng (Java chạy thật), che giấu thông tin sau interface, và phân biệt thông điệp đồng bộ / bất đồng bộ (producer/consumer chạy thật). 13 sơ đồ PlantUML dựng thật, 19 thuật ngữ Anh–Việt, tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.3 · Practice &amp; review</span>
<h2>Chapter 1 in seven exercises — read UML, draw UML, judge a design</h2>
<p class="lead">Chapter 1 is mostly theory (school slides Ch.1–5: modeling, UML notation, life cycles, design concepts, COMET). The exam still asks you to <strong>use</strong> it: name a diagram at a glance, read multiplicities without mixing up the ends, pick a life cycle model for a story, and say why one design is better than another. These seven exercises train exactly that. Every diagram on this page was rendered by PlantUML and every program output was produced by running the Java code.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task, <strong>cover the solution</strong>, and answer on paper first — draw the diagrams by hand, the way PE and FE expect you to think.</li>
<li>Compare with the solution and read the "why" of each decision; then read the pitfall box — it is the answer you were about to give.</li>
<li>Open the PlantUML code under each diagram, paste it into plantuml.com or the VS Code plugin, change one line, and watch the diagram change.</li>
</ol></div>
<h3>The case: FU Bike</h3>
<p>FU Bike is a (made-up) bike-sharing system on campus. A <strong>city</strong> has many <strong>stations</strong>; each station has 4–20 <strong>docks</strong>; a dock holds at most one <strong>bike</strong> (classic or electric). A <strong>rider</strong> scans a QR code to unlock a bike, rides, returns it to any dock and pays a fare (students get 20% off). Dock sensors report events — bike returned, bike removed, low battery.</p>
<table>
<thead><tr><th>Exercise</th><th>Topic</th><th>Lessons</th><th>Exam shape</th></tr></thead>
<tbody>
<tr><td>1</td><td>Name six UML diagrams</td><td>1.B, 1.C</td><td>FE multiple choice</td></tr>
<tr><td>2</td><td>Read a class diagram: six relationships, multiplicity</td><td>1.B, 1.C</td><td>FE / PT</td></tr>
<tr><td>3</td><td>Draw a class diagram from a text</td><td>1.B, 1.C</td><td>PE question 1</td></tr>
<tr><td>4</td><td>Choose a life cycle model</td><td>1.D, 1.E, 1.H</td><td>FE / PT short answer</td></tr>
<tr><td>5</td><td>Coupling and cohesion, before → after (Java)</td><td>1.1, 1.F, 1.G</td><td>PT / oral defence</td></tr>
<tr><td>6</td><td>Information hiding (Java)</td><td>1.F</td><td>FE / PT</td></tr>
<tr><td>7</td><td>Synchronous vs asynchronous messages (Java)</td><td>1.G</td><td>FE / PT</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 1 · Bài 1.3 · Thực hành &amp; ôn tập</span>
<h2>Chương 1 qua bảy bài tập — đọc UML, vẽ UML, đánh giá một thiết kế</h2>
<p class="lead">Chương 1 phần lớn là lý thuyết (slide trường Ch.1–5: mô hình hoá, ký hiệu UML, vòng đời phần mềm, khái niệm thiết kế, COMET). Nhưng đề thi vẫn bắt bạn <strong>dùng</strong> nó: nhìn qua là gọi đúng tên sơ đồ, đọc bội số (multiplicity) không nhầm đầu, chọn mô hình vòng đời (life cycle model) cho một tình huống, và nói được vì sao thiết kế này tốt hơn thiết kế kia. Bảy bài dưới đây luyện đúng những việc đó. Mọi sơ đồ trong trang đều được PlantUML dựng thật, mọi output đều do chạy code Java thật.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Đọc đề, <strong>che lời giải</strong>, tự làm ra giấy trước — vẽ tay các sơ đồ, đúng kiểu tư duy mà PE và FE đòi hỏi.</li>
<li>So với lời giải và đọc phần "vì sao" của từng quyết định; rồi đọc ô bẫy — đó chính là đáp án bạn suýt viết.</li>
<li>Mở mã PlantUML dưới mỗi sơ đồ, dán vào plantuml.com hoặc plugin VS Code, sửa một dòng, và xem sơ đồ đổi theo.</li>
</ol></div>
<h3>Case dùng chung: FU Bike</h3>
<p>FU Bike là hệ thống xe đạp dùng chung trong khuôn viên trường (tự đặt để luyện tập). Một <strong>thành phố (City)</strong> có nhiều <strong>trạm (Station)</strong>; mỗi trạm có 4–20 <strong>ngàm giữ xe (Dock)</strong>; một ngàm giữ tối đa một <strong>xe (Bike)</strong> (xe thường hoặc xe điện). <strong>Người đi xe (Rider)</strong> quét mã QR để mở khoá, đạp đi, trả xe vào ngàm bất kỳ và trả tiền (sinh viên giảm 20%). Cảm biến ở ngàm báo các sự kiện — xe đã trả, xe bị lấy ra, pin yếu.</p>
<table>
<thead><tr><th>Bài</th><th>Chủ đề</th><th>Bài giảng liên quan</th><th>Dạng đề</th></tr></thead>
<tbody>
<tr><td>1</td><td>Gọi tên sáu loại sơ đồ UML</td><td>1.B, 1.C</td><td>trắc nghiệm FE</td></tr>
<tr><td>2</td><td>Đọc class diagram: sáu quan hệ, bội số</td><td>1.B, 1.C</td><td>FE / PT</td></tr>
<tr><td>3</td><td>Vẽ class diagram từ đoạn mô tả</td><td>1.B, 1.C</td><td>câu 1 của PE</td></tr>
<tr><td>4</td><td>Chọn mô hình vòng đời</td><td>1.D, 1.E, 1.H</td><td>FE / PT tự luận ngắn</td></tr>
<tr><td>5</td><td>Ghép nối và kết dính, trước → sau (Java)</td><td>1.1, 1.F, 1.G</td><td>PT / vấn đáp</td></tr>
<tr><td>6</td><td>Che giấu thông tin (Java)</td><td>1.F</td><td>FE / PT</td></tr>
<tr><td>7</td><td>Thông điệp đồng bộ và bất đồng bộ (Java)</td><td>1.G</td><td>FE / PT</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — Name the diagram (FE style · ~6 min)</h3>
<p class="nhan">Task</p>
<p>Six small FU Bike diagrams follow, labelled A–F. For each one give (a) its UML name, (b) whether it shows <strong>structure</strong> (static) or <strong>behaviour</strong> (dynamic), and (c) in which COMET model it first appears — requirements, analysis or design.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/f4f4b16f2aea9a09d173b619b64dec0bcbfe6374.svg" alt="Diagram A" loading="lazy" /><p class="chu-thich">🧩 Diagram A</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 1, diagram A — identify the diagram type (a use case diagram)
left to right direction
actor Rider
actor "Payment Gateway" as PG
rectangle "FU Bike" {
  usecase "Rent Bike" as U1
  usecase "Return Bike" as U2
  usecase "Validate Rider" as U3
}
Rider -- U1
Rider -- U2
U1 ..&gt; U3 : &lt;&lt;include&gt;&gt;
U2 -- PG
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/6ce1ac6739100aa726a714c3cbaca47a47630891.svg" alt="Diagram B" loading="lazy" /><p class="chu-thich">🧩 Diagram B</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 1, diagram B — identify the diagram type (a class diagram)
hide circle
class Station {
  - name : String
  - capacity : int
}
class Bike {
  - code : String
  - batteryLevel : int
  + unlock() : void
}
Station "1" -- "0..*" Bike : holds &gt;
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/027ba1310438273fb7e5153bbf99ff7c8d5adcbc.svg" alt="Diagram C" loading="lazy" /><p class="chu-thich">🧩 Diagram C</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 1, diagram C — identify the diagram type (a sequence diagram)
actor Rider
participant ":RentalUI" as UI
participant ":RentalControl" as C
participant ":Bike" as B
Rider -&gt; UI : scan QR
UI -&gt; C : rent(bikeCode)
C -&gt; B : unlock()
B --&gt; C : unlocked
C --&gt; UI : trip started
UI --&gt; Rider : show timer
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e6db652a0ce7fbc7ec9eef2691c9fb8a025131d3.svg" alt="Diagram D" loading="lazy" /><p class="chu-thich">🧩 Diagram D</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 1, diagram D — identify the diagram type (a communication diagram: objects, links, numbered messages)
left to right direction
actor Rider
rectangle ":RentalUI" as UI
rectangle ":RentalControl" as C
rectangle ":Bike" as B
Rider -- UI : "1: scan QR ▶"
UI -- C : "1.1: rent(bikeCode) ▶"
C -- B : "1.2: unlock() ▶"
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/3ce7b1c43a5061b52a104f773cc9fbd633d1063e.svg" alt="Diagram E" loading="lazy" /><p class="chu-thich">🧩 Diagram E</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 1, diagram E — identify the diagram type (a state machine diagram)
hide empty description
[*] --&gt; Available
Available --&gt; InUse : Unlocked
InUse --&gt; Available : Returned [battery &gt; 20%]
InUse --&gt; Charging : Returned [battery &lt;= 20%]
Charging --&gt; Available : Charged
Available --&gt; UnderRepair : Fault Reported
UnderRepair --&gt; Available : Repaired
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/f6db8c36aade41a677e2bb8aa0974c8382320c6e.svg" alt="Diagram F" loading="lazy" /><p class="chu-thich">🧩 Diagram F</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 1, diagram F — identify the diagram type (a deployment diagram)
node "Rider Phone" as P {
  artifact "FU Bike App"
}
node "Application Server" as S {
  artifact "bike-service.jar"
}
database "Bike DB" as D
node "Station Controller" as SC
P -- S : HTTPS
S -- D : JDBC
S -- SC : MQTT
@enduml</code></pre></details>
<p class="nhan">Solution</p>
<table>
<thead><tr><th>Diagram</th><th>UML name</th><th>Static / dynamic</th><th>First used in COMET</th><th>The clue</th></tr></thead>
<tbody>
<tr><td>A</td><td>use case diagram</td><td>behaviour (functional view)</td><td>requirements model</td><td>stick-figure actors, ovals, a system boundary, «include»</td></tr>
<tr><td>B</td><td>class diagram</td><td>structure</td><td>analysis model (static model), refined in design</td><td>boxes with three compartments, a named association with multiplicities</td></tr>
<tr><td>C</td><td>sequence diagram</td><td>behaviour (interaction)</td><td>analysis model (dynamic model)</td><td>lifelines going down; time runs from top to bottom</td></tr>
<tr><td>D</td><td>communication diagram</td><td>behaviour (interaction)</td><td>analysis model (dynamic model)</td><td>the same objects joined by links; order is given only by the numbers 1, 1.1, 1.2</td></tr>
<tr><td>E</td><td>state machine diagram (statechart)</td><td>behaviour (one object over time)</td><td>analysis model (dynamic model)</td><td>rounded states, a black start dot, events with [guards] on arrows</td></tr>
<tr><td>F</td><td>deployment diagram</td><td>structure (physical)</td><td>design model (architecture)</td><td>3-D nodes, artifacts, links labelled with protocols</td></tr>
</tbody>
</table>
<p class="dap-an">✅ A use case · B class · C sequence · D communication · E state machine · F deployment. Only B and F are static; A, C, D, E describe behaviour.</p>
<p>Why C and D are the pair teachers love: they are two views of the <strong>same interaction</strong>. A sequence diagram makes the <strong>time order</strong> easy to read; a communication diagram makes the <strong>links between objects</strong> easy to read and needs the decimal numbers to show order. PE question 2 often asks you to choose one and justify it — "step-by-step, time-ordered" means sequence.</p>
<div class="pitfall">Two classic slips: (1) calling diagram D an "object diagram" — an object diagram shows objects and links at one moment <em>with no messages</em>; numbered messages make it a communication diagram. (2) calling E an "activity diagram" — an activity diagram shows the steps of a process (actions, decisions, swimlanes); a state machine shows the states of <em>one object</em> and the events that move it.</div>`,
    `<h3>🧪 Bài 1 — Gọi tên sơ đồ (dạng FE · ~6 phút)</h3>
<p class="nhan">Đề</p>
<p>Dưới đây là sáu sơ đồ nhỏ của FU Bike, đặt tên A–F. Với mỗi sơ đồ, cho biết (a) tên UML của nó, (b) nó mô tả <strong>cấu trúc</strong> (tĩnh — static) hay <strong>hành vi</strong> (động — dynamic), và (c) nó xuất hiện lần đầu ở mô hình nào của COMET — mô hình yêu cầu (requirements), phân tích (analysis) hay thiết kế (design).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/f4f4b16f2aea9a09d173b619b64dec0bcbfe6374.svg" alt="Sơ đồ A" loading="lazy" /><p class="chu-thich">🧩 Sơ đồ A</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bài 1, sơ đồ A — nhận diện loại sơ đồ (use case diagram)
left to right direction
actor Rider
actor "Payment Gateway" as PG
rectangle "FU Bike" {
  usecase "Rent Bike" as U1
  usecase "Return Bike" as U2
  usecase "Validate Rider" as U3
}
Rider -- U1
Rider -- U2
U1 ..&gt; U3 : &lt;&lt;include&gt;&gt;
U2 -- PG
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/6ce1ac6739100aa726a714c3cbaca47a47630891.svg" alt="Sơ đồ B" loading="lazy" /><p class="chu-thich">🧩 Sơ đồ B</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bài 1, sơ đồ B — nhận diện loại sơ đồ (class diagram)
hide circle
class Station {
  - name : String
  - capacity : int
}
class Bike {
  - code : String
  - batteryLevel : int
  + unlock() : void
}
Station "1" -- "0..*" Bike : holds &gt;
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/027ba1310438273fb7e5153bbf99ff7c8d5adcbc.svg" alt="Sơ đồ C" loading="lazy" /><p class="chu-thich">🧩 Sơ đồ C</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bài 1, sơ đồ C — nhận diện loại sơ đồ (sequence diagram)
actor Rider
participant ":RentalUI" as UI
participant ":RentalControl" as C
participant ":Bike" as B
Rider -&gt; UI : scan QR
UI -&gt; C : rent(bikeCode)
C -&gt; B : unlock()
B --&gt; C : unlocked
C --&gt; UI : trip started
UI --&gt; Rider : show timer
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e6db652a0ce7fbc7ec9eef2691c9fb8a025131d3.svg" alt="Sơ đồ D" loading="lazy" /><p class="chu-thich">🧩 Sơ đồ D</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bài 1, sơ đồ D — nhận diện loại sơ đồ (communication diagram: đối tượng, đường nối, thông điệp đánh số)
left to right direction
actor Rider
rectangle ":RentalUI" as UI
rectangle ":RentalControl" as C
rectangle ":Bike" as B
Rider -- UI : "1: scan QR ▶"
UI -- C : "1.1: rent(bikeCode) ▶"
C -- B : "1.2: unlock() ▶"
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/3ce7b1c43a5061b52a104f773cc9fbd633d1063e.svg" alt="Sơ đồ E" loading="lazy" /><p class="chu-thich">🧩 Sơ đồ E</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bài 1, sơ đồ E — nhận diện loại sơ đồ (state machine diagram)
hide empty description
[*] --&gt; Available
Available --&gt; InUse : Unlocked
InUse --&gt; Available : Returned [battery &gt; 20%]
InUse --&gt; Charging : Returned [battery &lt;= 20%]
Charging --&gt; Available : Charged
Available --&gt; UnderRepair : Fault Reported
UnderRepair --&gt; Available : Repaired
@enduml</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/f6db8c36aade41a677e2bb8aa0974c8382320c6e.svg" alt="Sơ đồ F" loading="lazy" /><p class="chu-thich">🧩 Sơ đồ F</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bài 1, sơ đồ F — nhận diện loại sơ đồ (deployment diagram)
node "Rider Phone" as P {
  artifact "FU Bike App"
}
node "Application Server" as S {
  artifact "bike-service.jar"
}
database "Bike DB" as D
node "Station Controller" as SC
P -- S : HTTPS
S -- D : JDBC
S -- SC : MQTT
@enduml</code></pre></details>
<p class="nhan">Lời giải</p>
<table>
<thead><tr><th>Sơ đồ</th><th>Tên UML</th><th>Tĩnh / động</th><th>Dùng lần đầu trong COMET</th><th>Dấu hiệu nhận ra</th></tr></thead>
<tbody>
<tr><td>A</td><td>use case diagram (sơ đồ ca sử dụng)</td><td>hành vi (góc nhìn chức năng)</td><td>mô hình yêu cầu</td><td>actor hình người que, hình bầu dục, khung ranh giới hệ thống, «include»</td></tr>
<tr><td>B</td><td>class diagram (sơ đồ lớp)</td><td>cấu trúc</td><td>mô hình phân tích (mô hình tĩnh), tinh chỉnh ở thiết kế</td><td>hộp ba ngăn, một liên kết có tên kèm bội số</td></tr>
<tr><td>C</td><td>sequence diagram (sơ đồ tuần tự)</td><td>hành vi (tương tác)</td><td>mô hình phân tích (mô hình động)</td><td>các đường đời (lifeline) chạy xuống; thời gian đi từ trên xuống dưới</td></tr>
<tr><td>D</td><td>communication diagram (sơ đồ giao tiếp)</td><td>hành vi (tương tác)</td><td>mô hình phân tích (mô hình động)</td><td>cùng các đối tượng đó nối bằng đường liên kết; thứ tự chỉ thể hiện bằng số 1, 1.1, 1.2</td></tr>
<tr><td>E</td><td>state machine diagram (statechart — sơ đồ trạng thái)</td><td>hành vi (một đối tượng theo thời gian)</td><td>mô hình phân tích (mô hình động)</td><td>trạng thái bo góc, chấm đen bắt đầu, sự kiện kèm [điều kiện canh] trên mũi tên</td></tr>
<tr><td>F</td><td>deployment diagram (sơ đồ triển khai)</td><td>cấu trúc (vật lý)</td><td>mô hình thiết kế (kiến trúc)</td><td>nút (node) hình khối 3 chiều, artifact, đường nối ghi giao thức</td></tr>
</tbody>
</table>
<p class="dap-an">✅ A use case · B class · C sequence · D communication · E state machine · F deployment. Chỉ B và F là tĩnh; A, C, D, E mô tả hành vi.</p>
<p>Vì sao C và D là cặp thầy cô thích hỏi: chúng là hai góc nhìn của <strong>cùng một tương tác</strong>. Sequence diagram giúp đọc <strong>thứ tự thời gian</strong> dễ; communication diagram giúp đọc <strong>các đường liên kết giữa đối tượng</strong> dễ và phải dùng số thập phân để thể hiện thứ tự. Câu 2 của PE hay bắt chọn một loại và giải thích — đề nói "step-by-step, time-ordered" (từng bước, theo thứ tự thời gian) thì chọn sequence.</p>
<div class="pitfall">Hai lỗi kinh điển: (1) gọi sơ đồ D là "object diagram" — object diagram (sơ đồ đối tượng) chỉ vẽ đối tượng và liên kết tại một thời điểm, <em>không có thông điệp</em>; có thông điệp đánh số thì là communication diagram. (2) gọi E là "activity diagram" — activity diagram (sơ đồ hoạt động) vẽ các bước của một quy trình (hành động, rẽ nhánh, làn bơi); state machine vẽ các trạng thái của <em>một đối tượng</em> và sự kiện làm nó chuyển trạng thái.</div>`),
    bi(`<h3>🧪 Exercise 2 — Read a class diagram: six relationships and multiplicity (FE / PT style · ~12 min)</h3>
<p class="nhan">Task</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/299c68a4323380185ce4fe35f33223e85d7bc9e4.svg" alt="FU Bike — class diagram to read" loading="lazy" /><p class="chu-thich">🧩 FU Bike — class diagram to read</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 2 — read this class diagram: six kinds of relationship and their multiplicities
title FU Bike — class diagram to read
hide circle
class City
class Station
class Dock
class Bike {
  - code : String
}
class EBike {
  - batteryLevel : int
}
class ClassicBike
class Rider
class Trip {
  - start : DateTime
  - minutes : int
}
interface PricingPolicy &lt;&lt;interface&gt;&gt; {
  + fare(t : Trip) : int
}
class StudentPricing
class TripService {
  + endTrip(t : Trip) : int
}
City "1" o-- "1..*" Station
Station "1" *-- "4..20" Dock
Dock "1" -- "0..1" Bike : holds &gt;
EBike -up-|&gt; Bike
ClassicBike -up-|&gt; Bike
Rider "1" -- "0..*" Trip : makes &gt;
Trip "0..*" -- "1" Bike : uses &gt;
StudentPricing .up.|&gt; PricingPolicy
TripService ..&gt; PricingPolicy
@enduml</code></pre></details>
<ol>
<li>The diagram has nine lines between classes. Name the kind of each: association, aggregation, composition, generalization, realization or dependency.</li>
<li>Read these multiplicities as two English sentences each: City–Station, Station–Dock, Rider–Trip.</li>
<li>The school closes Station S1. What happens to its docks? The city is removed from the system. What happens to its stations?</li>
<li>One multiplicity contradicts the story of FU Bike. Find it and fix it.</li>
<li>In Java, how do the line TripService → PricingPolicy and the line Rider — Trip look different?</li>
</ol>
<p class="nhan">Solution</p>
<table>
<thead><tr><th>Line</th><th>Kind</th><th>Notation you see</th></tr></thead>
<tbody>
<tr><td>City ◇— Station</td><td>aggregation (weak whole/part)</td><td>hollow diamond at the whole</td></tr>
<tr><td>Station ◆— Dock</td><td>composition (strong whole/part)</td><td>filled diamond at the whole</td></tr>
<tr><td>Dock — Bike "holds"</td><td>association</td><td>plain line, name and reading arrow</td></tr>
<tr><td>EBike —▷ Bike, ClassicBike —▷ Bike</td><td>generalization (two lines)</td><td>solid line, hollow triangle at the parent</td></tr>
<tr><td>Rider — Trip "makes", Trip — Bike "uses"</td><td>association (two lines)</td><td>plain line with multiplicities</td></tr>
<tr><td>StudentPricing ⋯▷ PricingPolicy</td><td>realization</td><td>dashed line, hollow triangle at the interface</td></tr>
<tr><td>TripService ⋯> PricingPolicy</td><td>dependency</td><td>dashed line, open arrow</td></tr>
</tbody>
</table>
<p>(b) <strong>Read each end from the other side</strong>: the number next to a class tells how many of <em>that</em> class one object on the far side is linked to.</p>
<pre><code class="language-plaintext">City "1" o-- "1..*" Station   : one city has one or more stations; each station belongs to exactly one city
Station "1" *-- "4..20" Dock  : one station has 4 to 20 docks; each dock belongs to exactly one station
Rider "1" -- "0..*" Trip      : one rider makes zero or more trips; each trip is made by exactly one rider</code></pre>
<p>(c) Composition means the parts live and die with the whole: closing S1 <strong>deletes its docks</strong>. Aggregation is weaker: the stations are part of the city but can exist without it — removing the city record does <strong>not</strong> force the stations to disappear (they could be moved to another city).</p>
<p>(d) <strong>Dock "1" — "0..1" Bike</strong> says every bike is held by exactly one dock at all times. But a bike that is being ridden is in no dock. The fix is <strong>Dock "0..1" — "0..1" Bike</strong>: a dock holds at most one bike, and a bike is in at most one dock.</p>
<p>(e) An association is a lasting link, usually a field (a Trip keeps a reference to its Rider). A dependency is a short use — TripService receives or creates a PricingPolicy inside a method and keeps no field of it.</p>
<pre><code class="language-plaintext">class Trip { private Rider rider; ... }                        // association: a field
class TripService {
    int endTrip(Trip t, PricingPolicy p) { return p.fare(t); }   // dependency: a parameter only
}</code></pre>
<p class="dap-an">✅ Six kinds appear: 1 aggregation, 1 composition, 3 associations, 2 generalizations, 1 realization, 1 dependency. The wrong multiplicity is the Dock end of Dock–Bike: it must be 0..1.</p>
<div class="pitfall">The most common mark lost in PE question 1: <strong>the diamond on the wrong end</strong>. The diamond always sits on the <strong>whole</strong> (Station), never on the part (Dock). The second: multiplicity written at the wrong end — "a station has 4..20 docks" puts 4..20 next to <strong>Dock</strong>.</div>`,
    `<h3>🧪 Bài 2 — Đọc class diagram: sáu quan hệ và bội số (dạng FE / PT · ~12 phút)</h3>
<p class="nhan">Đề</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/299c68a4323380185ce4fe35f33223e85d7bc9e4.svg" alt="FU Bike — class diagram to read" loading="lazy" /><p class="chu-thich">🧩 FU Bike — class diagram to read</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bài 2 — đọc class diagram này: sáu loại quan hệ và bội số của chúng
title FU Bike — class diagram to read
hide circle
class City
class Station
class Dock
class Bike {
  - code : String
}
class EBike {
  - batteryLevel : int
}
class ClassicBike
class Rider
class Trip {
  - start : DateTime
  - minutes : int
}
interface PricingPolicy &lt;&lt;interface&gt;&gt; {
  + fare(t : Trip) : int
}
class StudentPricing
class TripService {
  + endTrip(t : Trip) : int
}
City "1" o-- "1..*" Station
Station "1" *-- "4..20" Dock
Dock "1" -- "0..1" Bike : holds &gt;
EBike -up-|&gt; Bike
ClassicBike -up-|&gt; Bike
Rider "1" -- "0..*" Trip : makes &gt;
Trip "0..*" -- "1" Bike : uses &gt;
StudentPricing .up.|&gt; PricingPolicy
TripService ..&gt; PricingPolicy
@enduml</code></pre></details>
<ol>
<li>Sơ đồ có chín đường nối giữa các lớp. Gọi tên loại của từng đường: liên kết (association), kết tập (aggregation), hợp thành (composition), tổng quát hoá (generalization), hiện thực hoá (realization) hay phụ thuộc (dependency).</li>
<li>Đọc các bội số sau thành hai câu tiếng Anh mỗi cặp: City–Station, Station–Dock, Rider–Trip.</li>
<li>Trường đóng cửa trạm S1. Các ngàm của nó ra sao? Xoá thành phố khỏi hệ thống. Các trạm ra sao?</li>
<li>Có một bội số mâu thuẫn với câu chuyện FU Bike. Tìm và sửa nó.</li>
<li>Trong Java, đường TripService → PricingPolicy và đường Rider — Trip khác nhau thế nào?</li>
</ol>
<p class="nhan">Lời giải</p>
<table>
<thead><tr><th>Đường nối</th><th>Loại</th><th>Ký hiệu nhìn thấy</th></tr></thead>
<tbody>
<tr><td>City ◇— Station</td><td>kết tập (toàn thể/bộ phận lỏng)</td><td>hình thoi rỗng ở phía toàn thể</td></tr>
<tr><td>Station ◆— Dock</td><td>hợp thành (toàn thể/bộ phận chặt)</td><td>hình thoi đặc ở phía toàn thể</td></tr>
<tr><td>Dock — Bike "holds"</td><td>liên kết</td><td>nét liền, có tên và mũi tên chiều đọc</td></tr>
<tr><td>EBike —▷ Bike, ClassicBike —▷ Bike</td><td>tổng quát hoá (hai đường)</td><td>nét liền, tam giác rỗng ở lớp cha</td></tr>
<tr><td>Rider — Trip "makes", Trip — Bike "uses"</td><td>liên kết (hai đường)</td><td>nét liền kèm bội số</td></tr>
<tr><td>StudentPricing ⋯▷ PricingPolicy</td><td>hiện thực hoá</td><td>nét đứt, tam giác rỗng ở interface</td></tr>
<tr><td>TripService ⋯> PricingPolicy</td><td>phụ thuộc</td><td>nét đứt, mũi tên hở</td></tr>
</tbody>
</table>
<p>(b) <strong>Đọc mỗi đầu từ phía bên kia</strong>: con số đứng cạnh một lớp cho biết một đối tượng ở đầu bên kia nối với bao nhiêu đối tượng của <em>lớp đó</em>.</p>
<pre><code class="language-plaintext">City "1" o-- "1..*" Station   : one city has one or more stations; each station belongs to exactly one city
                                (một thành phố có một hoặc nhiều trạm; mỗi trạm thuộc đúng một thành phố)
Station "1" *-- "4..20" Dock  : one station has 4 to 20 docks; each dock belongs to exactly one station
                                (một trạm có 4 đến 20 ngàm; mỗi ngàm thuộc đúng một trạm)
Rider "1" -- "0..*" Trip      : one rider makes zero or more trips; each trip is made by exactly one rider
                                (một người đi xe có 0 hoặc nhiều chuyến; mỗi chuyến do đúng một người đi)</code></pre>
<p>(c) Hợp thành nghĩa là bộ phận sống và chết cùng toàn thể: đóng trạm S1 thì <strong>các ngàm của nó bị xoá theo</strong>. Kết tập lỏng hơn: trạm là một phần của thành phố nhưng có thể tồn tại độc lập — xoá bản ghi thành phố <strong>không</strong> bắt các trạm biến mất (có thể chuyển sang thành phố khác).</p>
<p>(d) <strong>Dock "1" — "0..1" Bike</strong> nói rằng lúc nào mỗi xe cũng nằm trong đúng một ngàm. Nhưng xe đang được đạp thì không nằm trong ngàm nào. Sửa thành <strong>Dock "0..1" — "0..1" Bike</strong>: một ngàm giữ tối đa một xe, một xe nằm trong tối đa một ngàm.</p>
<p>(e) Liên kết là mối nối lâu dài, thường là một thuộc tính (field) — Trip giữ tham chiếu tới Rider của nó. Phụ thuộc là dùng thoáng qua — TripService nhận hoặc tạo một PricingPolicy trong một phương thức và không giữ nó làm thuộc tính.</p>
<pre><code class="language-plaintext">class Trip { private Rider rider; ... }                        // liên kết: một thuộc tính
class TripService {
    int endTrip(Trip t, PricingPolicy p) { return p.fare(t); }   // phụ thuộc: chỉ là tham số
}</code></pre>
<p class="dap-an">✅ Có đủ sáu loại: 1 kết tập, 1 hợp thành, 3 liên kết, 2 tổng quát hoá, 1 hiện thực hoá, 1 phụ thuộc. Bội số sai là đầu Dock của cặp Dock–Bike: phải là 0..1.</p>
<div class="pitfall">Lỗi mất điểm nhiều nhất ở câu 1 của PE: <strong>đặt hình thoi sai đầu</strong>. Hình thoi luôn nằm ở phía <strong>toàn thể</strong> (Station), không bao giờ ở phía bộ phận (Dock). Lỗi thứ hai: ghi bội số sai đầu — "một trạm có 4..20 ngàm" thì 4..20 đứng cạnh <strong>Dock</strong>.</div>`),
    bi(`<h3>🧪 Exercise 3 — Draw a class diagram from a text (PE question 1 style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>The campus café wants an ordering app. Draw the class diagram (class names, a few attributes, all relationships with multiplicities) for this text:</p>
<div class="callout">(1) A customer places zero or more orders; every order belongs to one customer. (2) An order is made of one or more order lines, and a line has no meaning without its order. (3) Each order line refers to exactly one drink; a drink can appear in many lines. (4) A drink is either a coffee or a tea — there is no "plain drink". (5) An order may use at most one voucher; a voucher can be used by many orders. (6) The shop accepts cash or an e-wallet; both provide the operation pay(amount). (7) OrderService's checkout operation receives an order and a payment method as parameters.</div>
<p class="nhan">Solution</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b249984fab4e7bde00661321be71a57c4e48a625.svg" alt="Solution — Coffee order class diagram" loading="lazy" /><p class="chu-thich">🧩 Solution — Coffee order class diagram</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 3 solution — a coffee order drawn from a text description: every sentence becomes one relationship
title Solution — Coffee order class diagram
hide circle
class Customer {
  - name : String
}
class Order {
  - createdAt : DateTime
  + total() : int
}
class OrderLine {
  - quantity : int
  - size : String
}
abstract class Drink {
  - name : String
  - basePrice : int
}
class Coffee {
  - shots : int
}
class Tea {
  - leaf : String
}
class Voucher {
  - code : String
  - percent : int
}
interface PaymentMethod &lt;&lt;interface&gt;&gt; {
  + pay(amount : int) : boolean
}
class Cash
class EWallet
class OrderService {
  + checkout(o : Order, p : PaymentMethod) : void
}
Customer "1" -- "0..*" Order : places &gt;
Order "1" *-- "1..*" OrderLine
OrderLine "0..*" -- "1" Drink : refers to &gt;
Coffee -up-|&gt; Drink
Tea -up-|&gt; Drink
Order "0..*" -- "0..1" Voucher : uses &gt;
Cash .up.|&gt; PaymentMethod
EWallet .up.|&gt; PaymentMethod
OrderService ..&gt; PaymentMethod
OrderService ..&gt; Order
@enduml</code></pre></details>
<table>
<thead><tr><th>Sentence</th><th>Relationship drawn</th><th>Why this and not another</th></tr></thead>
<tbody>
<tr><td>(1)</td><td>Customer "1" — "0..*" Order, association</td><td>two independent things that know each other; an order does not die with the customer's account in the model</td></tr>
<tr><td>(2)</td><td>Order "1" ◆— "1..*" OrderLine, composition</td><td>"no meaning without its order" is the test for composition; deleting the order deletes its lines</td></tr>
<tr><td>(3)</td><td>OrderLine "0..*" — "1" Drink, association</td><td>the drink exists before and after the order; not a part of the line</td></tr>
<tr><td>(4)</td><td>Coffee, Tea —▷ Drink, generalization; Drink abstract (italic)</td><td>"is either … or …" = is-a; "no plain drink" = no object of Drink itself</td></tr>
<tr><td>(5)</td><td>Order "0..*" — "0..1" Voucher, association</td><td>"at most one" = 0..1 next to Voucher; "many orders" = 0..* next to Order</td></tr>
<tr><td>(6)</td><td>Cash, EWallet ⋯▷ «interface» PaymentMethod, realization</td><td>they share only an operation, not data — an interface, not a parent class</td></tr>
<tr><td>(7)</td><td>OrderService ⋯> Order, OrderService ⋯> PaymentMethod, dependency</td><td>parameters are a temporary use, not a stored link</td></tr>
</tbody>
</table>
<p class="dap-an">✅ One composition, three associations, two generalizations, two realizations, two dependencies — each traced back to one sentence. In the exam, write the sentence number next to each line on your draft: it is the fastest way to check you have not skipped a requirement.</p>
<div class="pitfall">Marks are lost for: an aggregation (hollow diamond) for sentence 2 — "no meaning without" asks for the <strong>filled</strong> diamond; a class Drink that is not abstract; drawing PaymentMethod as a superclass with a solid line (it has no attributes to inherit — it is an interface, dashed line); and adding a <code>customerId</code> attribute to Order — the association already says it (foreign keys belong to the database design, not the analysis class diagram).</div>`,
    `<h3>🧪 Bài 3 — Vẽ class diagram từ đoạn mô tả (dạng câu 1 PE · ~15 phút)</h3>
<p class="nhan">Đề</p>
<p>Quán cà phê trong trường muốn có app đặt món. Vẽ class diagram (tên lớp, vài thuộc tính, mọi quan hệ kèm bội số) cho đoạn mô tả sau:</p>
<div class="callout">(1) A customer places zero or more orders; every order belongs to one customer. (2) An order is made of one or more order lines, and a line has no meaning without its order. (3) Each order line refers to exactly one drink; a drink can appear in many lines. (4) A drink is either a coffee or a tea — there is no "plain drink". (5) An order may use at most one voucher; a voucher can be used by many orders. (6) The shop accepts cash or an e-wallet; both provide the operation pay(amount). (7) OrderService's checkout operation receives an order and a payment method as parameters.
<br><em>Dịch:</em> (1) Khách đặt 0 hoặc nhiều đơn; mỗi đơn thuộc một khách. (2) Đơn gồm một hoặc nhiều dòng đơn, dòng đơn không có nghĩa nếu tách khỏi đơn. (3) Mỗi dòng đơn trỏ tới đúng một đồ uống; một đồ uống có thể nằm trong nhiều dòng. (4) Đồ uống là cà phê hoặc trà — không có "đồ uống trơn". (5) Một đơn dùng tối đa một voucher; một voucher dùng được cho nhiều đơn. (6) Quán nhận tiền mặt hoặc ví điện tử; cả hai đều có thao tác pay(amount). (7) Thao tác checkout của OrderService nhận một đơn và một phương thức thanh toán làm tham số.</div>
<p class="nhan">Lời giải</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b249984fab4e7bde00661321be71a57c4e48a625.svg" alt="Solution — Coffee order class diagram" loading="lazy" /><p class="chu-thich">🧩 Solution — Coffee order class diagram</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Lời giải bài 3 — đơn cà phê vẽ từ đoạn mô tả: mỗi câu thành một quan hệ
title Solution — Coffee order class diagram
hide circle
class Customer {
  - name : String
}
class Order {
  - createdAt : DateTime
  + total() : int
}
class OrderLine {
  - quantity : int
  - size : String
}
abstract class Drink {
  - name : String
  - basePrice : int
}
class Coffee {
  - shots : int
}
class Tea {
  - leaf : String
}
class Voucher {
  - code : String
  - percent : int
}
interface PaymentMethod &lt;&lt;interface&gt;&gt; {
  + pay(amount : int) : boolean
}
class Cash
class EWallet
class OrderService {
  + checkout(o : Order, p : PaymentMethod) : void
}
Customer "1" -- "0..*" Order : places &gt;
Order "1" *-- "1..*" OrderLine
OrderLine "0..*" -- "1" Drink : refers to &gt;
Coffee -up-|&gt; Drink
Tea -up-|&gt; Drink
Order "0..*" -- "0..1" Voucher : uses &gt;
Cash .up.|&gt; PaymentMethod
EWallet .up.|&gt; PaymentMethod
OrderService ..&gt; PaymentMethod
OrderService ..&gt; Order
@enduml</code></pre></details>
<table>
<thead><tr><th>Câu</th><th>Quan hệ vẽ</th><th>Vì sao chọn cái này</th></tr></thead>
<tbody>
<tr><td>(1)</td><td>Customer "1" — "0..*" Order, liên kết</td><td>hai thứ độc lập biết nhau; trong mô hình, đơn không chết theo tài khoản khách</td></tr>
<tr><td>(2)</td><td>Order "1" ◆— "1..*" OrderLine, hợp thành</td><td>"không có nghĩa nếu tách khỏi" chính là phép thử của hợp thành; xoá đơn thì xoá luôn các dòng</td></tr>
<tr><td>(3)</td><td>OrderLine "0..*" — "1" Drink, liên kết</td><td>đồ uống có trước và còn sau đơn; nó không phải bộ phận của dòng đơn</td></tr>
<tr><td>(4)</td><td>Coffee, Tea —▷ Drink, tổng quát hoá; Drink trừu tượng (chữ nghiêng)</td><td>"là … hoặc …" = quan hệ is-a (là một); "không có đồ uống trơn" = không có đối tượng nào của chính lớp Drink</td></tr>
<tr><td>(5)</td><td>Order "0..*" — "0..1" Voucher, liên kết</td><td>"tối đa một" = 0..1 đứng cạnh Voucher; "nhiều đơn" = 0..* đứng cạnh Order</td></tr>
<tr><td>(6)</td><td>Cash, EWallet ⋯▷ «interface» PaymentMethod, hiện thực hoá</td><td>chúng chỉ chung một thao tác, không chung dữ liệu — là interface, không phải lớp cha</td></tr>
<tr><td>(7)</td><td>OrderService ⋯> Order, OrderService ⋯> PaymentMethod, phụ thuộc</td><td>tham số là dùng tạm, không phải mối nối được lưu lại</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Một hợp thành, ba liên kết, hai tổng quát hoá, hai hiện thực hoá, hai phụ thuộc — cái nào cũng truy về được một câu của đề. Trong phòng thi, ghi số câu cạnh mỗi đường trên bản nháp: đó là cách nhanh nhất để chắc không bỏ sót yêu cầu nào.</p>
<div class="pitfall">Hay mất điểm vì: dùng kết tập (thoi rỗng) cho câu 2 — "không có nghĩa nếu tách khỏi" đòi thoi <strong>đặc</strong>; lớp Drink không để trừu tượng; vẽ PaymentMethod thành lớp cha nét liền (nó chẳng có thuộc tính nào để kế thừa — là interface, nét đứt); và thêm thuộc tính <code>customerId</code> vào Order — đường liên kết đã nói điều đó rồi (khoá ngoại thuộc về thiết kế CSDL, không thuộc class diagram phân tích).</div>`),
    bi(`<h3>🧪 Exercise 4 — Choose a life cycle model (FE / PT short answer · ~10 min)</h3>
<p class="nhan">Task</p>
<p>For each project, choose the most suitable software life cycle model from school Chapter 3 and give one reason.</p>
<ol type="a">
<li>A tax office replaces its payroll-tax calculator. The rules are fixed by law and well understood; every requirement must be verified and signed off before release.</li>
<li>A start-up wants a campus food-delivery app. The users cannot say which screens they want until they see something.</li>
<li>The university wants its new LMS to deliver course enrolment in three months, then grades, then timetables — each part used by real students as soon as it is ready.</li>
<li>A driverless shuttle for the campus uses a new sensor technology. Failure is dangerous, the budget is large, and the managers want to decide after every round whether to continue.</li>
<li>A 40-person team models everything in UML and plans the project in phases — inception, elaboration, construction, transition — each with several iterations.</li>
</ol>
<p class="nhan">Solution</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/fbd2d5a84c93c30c10b9599b212419ba99211275.svg" alt="Choosing a life cycle model — questions in order" loading="lazy" /><p class="chu-thich">🧩 Choosing a life cycle model — questions in order</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 4 — a decision path for choosing a life cycle model (a study aid, not a rule from the book)
title Choosing a life cycle model — questions in order
start
if (Requirements stable and well understood?) then (yes)
  if (Safety or regulation needs formal V&amp;V?) then (yes)
    :Waterfall + V model;
  else (no)
    :Waterfall;
  endif
else (no)
  if (Unclear user interface or requirements?) then (yes)
    :Throwaway prototyping\\nthen build properly;
  elseif (Need an early working subset?) then (yes)
    :Incremental development\\n(evolutionary prototyping);
  elseif (High technical or business risk?) then (yes)
    :Spiral model\\n(risk analysis each cycle);
  else (large OO project, UML)
    :Unified Process (USDP)\\nor COMET life cycle;
  endif
endif
stop
@enduml</code></pre></details>
<table>
<thead><tr><th>Project</th><th>Model</th><th>The reason in one sentence</th></tr></thead>
<tbody>
<tr><td>a</td><td>Waterfall (with V-model testing)</td><td>requirements are stable and fully known, and the phases with sign-off and verification match a regulated project</td></tr>
<tr><td>b</td><td>Throwaway prototyping</td><td>a quick UI prototype clarifies the requirements and breaks the communication barrier with users; it is then thrown away and the real system is built</td></tr>
<tr><td>c</td><td>Incremental development (evolutionary prototyping)</td><td>a working subset early, then built on gradually — each increment is an operational system</td></tr>
<tr><td>d</td><td>Spiral model</td><td>each cycle starts with objectives and risk analysis; the radial coordinate shows cost and the go/no-go decision is made every round</td></tr>
<tr><td>e</td><td>Unified Software Development Process (USDP / RUP)</td><td>four phases, each split into iterations, with workflows requirements → analysis → design → implementation → test</td></tr>
</tbody>
</table>
<p>Where does <strong>COMET</strong> fit? Its life cycle is use case–based and highly iterative, and school slide Ch.5-6 says it can be used <strong>with USDP</strong> (each COMET phase ↔ one USDP workflow) or <strong>with the spiral model</strong> (the project manager chooses in each cycle whether the product-development quadrant does requirements, analysis or design modeling).</p>
<p class="dap-an">✅ a Waterfall · b Throwaway prototyping · c Incremental / evolutionary prototyping · d Spiral · e Unified Process. The decision path above is a study aid: ask about stability, then UI clarity, then early delivery, then risk.</p>
<div class="pitfall">Do not mix the two prototypes. A <strong>throwaway</strong> prototype is discarded after it has answered a question (usually "what should the UI be?"); an <strong>evolutionary</strong> prototype is kept and grows into the product. And the waterfall's weakness named on the slides is that it <strong>does not show iteration</strong> — requirements are frozen early, so late changes are expensive.</div>`,
    `<h3>🧪 Bài 4 — Chọn mô hình vòng đời (dạng FE / PT tự luận ngắn · ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Với mỗi dự án, chọn mô hình vòng đời phần mềm (software life cycle model) phù hợp nhất trong Chapter 3 của trường và nêu một lý do.</p>
<ol type="a">
<li>Cục thuế thay phần mềm tính thuế thu nhập. Luật đã cố định và được hiểu rõ; mọi yêu cầu phải được kiểm chứng và ký duyệt trước khi phát hành.</li>
<li>Một start-up muốn làm app giao đồ ăn trong trường. Người dùng không nói được mình muốn màn hình nào cho tới khi thấy một cái gì đó.</li>
<li>Trường muốn hệ thống LMS mới có chức năng đăng ký môn sau ba tháng, rồi đến điểm, rồi thời khoá biểu — phần nào xong là sinh viên dùng thật ngay.</li>
<li>Xe đưa đón tự lái trong trường dùng công nghệ cảm biến mới. Hỏng thì nguy hiểm, ngân sách lớn, và quản lý muốn sau mỗi vòng được quyết có làm tiếp hay không.</li>
<li>Một đội 40 người mô hình hoá mọi thứ bằng UML và chia dự án thành các pha — inception, elaboration, construction, transition — mỗi pha có nhiều vòng lặp.</li>
</ol>
<p class="nhan">Lời giải</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/fbd2d5a84c93c30c10b9599b212419ba99211275.svg" alt="Choosing a life cycle model — questions in order" loading="lazy" /><p class="chu-thich">🧩 Choosing a life cycle model — questions in order</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bài 4 — đường quyết định để chọn mô hình vòng đời (công cụ học, không phải luật trong sách)
title Choosing a life cycle model — questions in order
start
if (Requirements stable and well understood?) then (yes)
  if (Safety or regulation needs formal V&amp;V?) then (yes)
    :Waterfall + V model;
  else (no)
    :Waterfall;
  endif
else (no)
  if (Unclear user interface or requirements?) then (yes)
    :Throwaway prototyping\\nthen build properly;
  elseif (Need an early working subset?) then (yes)
    :Incremental development\\n(evolutionary prototyping);
  elseif (High technical or business risk?) then (yes)
    :Spiral model\\n(risk analysis each cycle);
  else (large OO project, UML)
    :Unified Process (USDP)\\nor COMET life cycle;
  endif
endif
stop
@enduml</code></pre></details>
<table>
<thead><tr><th>Dự án</th><th>Mô hình</th><th>Lý do trong một câu</th></tr></thead>
<tbody>
<tr><td>a</td><td>Thác nước — waterfall (kèm kiểm thử kiểu mô hình chữ V)</td><td>yêu cầu ổn định và biết đủ, các pha có ký duyệt và kiểm chứng hợp với dự án chịu quy định pháp lý</td></tr>
<tr><td>b</td><td>Làm mẫu bỏ đi — throwaway prototyping</td><td>bản mẫu giao diện làm nhanh giúp làm rõ yêu cầu và phá rào cản giao tiếp với người dùng; xong thì bỏ, rồi xây hệ thống thật</td></tr>
<tr><td>c</td><td>Phát triển tăng dần — incremental development (làm mẫu tiến hoá)</td><td>có một phần hệ thống chạy được sớm, rồi xây dần lên — mỗi bước tăng là một hệ thống dùng được</td></tr>
<tr><td>d</td><td>Xoắn ốc — spiral model</td><td>mỗi vòng bắt đầu bằng mục tiêu và phân tích rủi ro; bán kính thể hiện chi phí, sau mỗi vòng quyết định đi tiếp hay dừng</td></tr>
<tr><td>e</td><td>Quy trình hợp nhất — USDP / RUP</td><td>bốn pha, mỗi pha chia nhiều vòng lặp, với các luồng công việc yêu cầu → phân tích → thiết kế → cài đặt → kiểm thử</td></tr>
</tbody>
</table>
<p><strong>COMET</strong> nằm ở đâu? Vòng đời COMET dựa trên use case và lặp nhiều vòng; slide trường Ch.5 (slide 6) nói nó dùng được <strong>cùng USDP</strong> (mỗi pha COMET ↔ một luồng công việc USDP) hoặc <strong>cùng mô hình xoắn ốc</strong> (ở mỗi vòng, quản lý dự án chọn góc phần tư phát triển sản phẩm sẽ làm mô hình yêu cầu, phân tích hay thiết kế).</p>
<p class="dap-an">✅ a Thác nước · b Làm mẫu bỏ đi · c Tăng dần / làm mẫu tiến hoá · d Xoắn ốc · e Quy trình hợp nhất. Đường quyết định ở trên chỉ là công cụ học: hỏi độ ổn định của yêu cầu, rồi độ rõ của giao diện, rồi nhu cầu giao sớm, rồi rủi ro.</p>
<div class="pitfall">Đừng lẫn hai loại bản mẫu. Bản mẫu <strong>bỏ đi (throwaway)</strong> bị vứt sau khi đã trả lời xong một câu hỏi (thường là "giao diện nên thế nào?"); bản mẫu <strong>tiến hoá (evolutionary)</strong> được giữ lại và lớn dần thành sản phẩm. Và điểm yếu của thác nước mà slide nêu là nó <strong>không thể hiện vòng lặp</strong> — yêu cầu bị chốt sớm nên thay đổi muộn rất tốn kém.</div>`),
    bi(`<h3>🧪 Exercise 5 — Coupling and cohesion: before → after (PT / oral defence style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Below is the first version of FU Bike's trip code. (a) Name what is wrong in terms of cohesion and coupling. (b) Redesign it so that each class has one job and classes depend on small interfaces. (c) Show that the behaviour did not change, and that switching SMS to e-mail no longer touches the trip logic.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/cf6a6fe365f67a436e6c8a937757c37b749e71bd.svg" alt="Before — low cohesion, high coupling" loading="lazy" /><p class="chu-thich">🧩 Before — low cohesion, high coupling</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 5, before — one class with four jobs, its data public, another class reaching in
title Before — low cohesion, high coupling
hide circle
class TripManager {
  + table : List&lt;String[]&gt;
  + endTrip(rider, bikeType, minutes, student) : int
  + printReport() : void
}
note right of TripManager
  pricing rules
  + storage
  + SMS text
  + reporting
end note
class AdminPage {
  + resetDay(m : TripManager) : void
}
AdminPage ..&gt; TripManager : m.table.clear()
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">class TripManager {
    public List&lt;String[]&gt; table = new ArrayList&lt;&gt;();   // public data: any class may add or delete rows

    public int endTrip(String rider, String bikeType, int minutes, boolean student) {
        int fare;                                                   // job 1: pricing rules
        if (bikeType.equals("EBIKE")) fare = 3000 + minutes * 500;
        else fare = 2000 + minutes * 200;
        if (student) fare = fare * 80 / 100;
        table.add(new String[] { rider, bikeType, String.valueOf(minutes), String.valueOf(fare) });   // job 2: storage
        System.out.println("SMS to " + rider + ": " + minutes + " min, fare " + fare + " VND");       // job 3: messaging
        return fare;
    }

    public void printReport() {                                     // job 4: reporting
        int sum = 0;
        for (String[] row : table) sum += Integer.parseInt(row[3]);
        System.out.println("report: " + table.size() + " trips, revenue " + sum + " VND");
    }
}

class AdminPage {
    void resetDay(TripManager m) {
        m.table.clear();                                            // content coupling: reaches into another class's data
    }
}</code></pre>
<div class="out">SMS to An: 10 min, fare 6400 VND<br>
SMS to Binh: 25 min, fare 7000 VND<br>
report: 2 trips, revenue 13400 VND<br>
report: 0 trips, revenue 0 VND</div>
<p class="nhan">Solution</p>
<p>(a) <strong>Low cohesion</strong>: TripManager does four unrelated jobs (pricing rules, storage, messaging, reporting) — any change to any of them edits this one class. <strong>High coupling</strong>: its data is public and AdminPage reaches in and calls <code>m.table.clear()</code> (content coupling — the worst kind); every caller also depends on the concrete class, so SMS cannot be swapped.</p>
<p>(b) Split by job and connect through interfaces:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/5258eeb0af7ebb866bea235ce25e2c06cf1c850c.svg" alt="After — high cohesion, low coupling" loading="lazy" /><p class="chu-thich">🧩 After — high cohesion, low coupling</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 5, after — one job per class; TripService depends on interfaces only
title After — high cohesion, low coupling
hide circle
class TripService {
  - calc : FareCalculator
  - repo : TripRepository
  - notifier : Notifier
  + endTrip(rider, bikeType, minutes, student) : int
}
class FareCalculator {
  + fare(bikeType, minutes, student) : int
}
interface TripRepository &lt;&lt;interface&gt;&gt; {
  + save(t : Trip)
  + all() : List&lt;Trip&gt;
  + clear()
}
class InMemoryTripRepository {
  - rows : List&lt;Trip&gt;
}
interface Notifier &lt;&lt;interface&gt;&gt; {
  + send(to, text)
}
class SmsNotifier
class EmailNotifier
class ReportService {
  + print()
}
TripService --&gt; FareCalculator
TripService --&gt; TripRepository
TripService --&gt; Notifier
ReportService --&gt; TripRepository
InMemoryTripRepository .up.|&gt; TripRepository
SmsNotifier .up.|&gt; Notifier
EmailNotifier .up.|&gt; Notifier
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">record Trip(String rider, String bikeType, int minutes, int fare) {}

class FareCalculator {                                   // only pricing rules
    int fare(String bikeType, int minutes, boolean student) {
        int fare = bikeType.equals("EBIKE") ? 3000 + minutes * 500 : 2000 + minutes * 200;
        return student ? fare * 80 / 100 : fare;
    }
}

interface TripRepository {                               // only storage — how is hidden
    void save(Trip t);
    List&lt;Trip&gt; all();
    void clear();
}

class InMemoryTripRepository implements TripRepository {
    private final List&lt;Trip&gt; rows = new ArrayList&lt;&gt;();   // private: nobody else can touch the list
    public void save(Trip t) { rows.add(t); }
    public List&lt;Trip&gt; all() { return List.copyOf(rows); }
    public void clear() { rows.clear(); }
}

interface Notifier { void send(String to, String text); }  // only messaging

class SmsNotifier implements Notifier {
    public void send(String to, String text) { System.out.println("SMS to " + to + ": " + text); }
}

class EmailNotifier implements Notifier {
    public void send(String to, String text) { System.out.println("EMAIL to " + to + ": " + text); }
}

class TripService {                                      // coordinates the three helpers, depends only on their interfaces
    private final FareCalculator calc;
    private final TripRepository repo;
    private final Notifier notifier;

    TripService(FareCalculator calc, TripRepository repo, Notifier notifier) {
        this.calc = calc; this.repo = repo; this.notifier = notifier;
    }

    int endTrip(String rider, String bikeType, int minutes, boolean student) {
        int fare = calc.fare(bikeType, minutes, student);
        repo.save(new Trip(rider, bikeType, minutes, fare));
        notifier.send(rider, minutes + " min, fare " + fare + " VND");
        return fare;
    }
}

class ReportService {
    private final TripRepository repo;
    ReportService(TripRepository repo) { this.repo = repo; }
    void print() {
        int sum = repo.all().stream().mapToInt(Trip::fare).sum();
        System.out.println("report: " + repo.all().size() + " trips, revenue " + sum + " VND");
    }
}</code></pre>
<p>(c) Same trips, same fares, same report — plus a new line: e-mail instead of SMS by passing a different Notifier. TripService was not edited.</p>
<pre class="trich"><code class="language-java">TripRepository repo = new InMemoryTripRepository();
TripService trips = new TripService(new FareCalculator(), repo, new SmsNotifier());
ReportService report = new ReportService(repo);
trips.endTrip("An", "EBIKE", 10, true);
trips.endTrip("Binh", "CLASSIC", 25, false);
report.print();
repo.clear();                                                   // resetting goes through the interface
report.print();
// change of requirement: e-mail instead of SMS — TripService is not edited
new TripService(new FareCalculator(), repo, new EmailNotifier()).endTrip("Chi", "EBIKE", 4, true);</code></pre>
<div class="out">SMS to An: 10 min, fare 6400 VND<br>
SMS to Binh: 25 min, fare 7000 VND<br>
report: 2 trips, revenue 13400 VND<br>
report: 0 trips, revenue 0 VND<br>
EMAIL to Chi: 4 min, fare 4000 VND</div>
<table>
<thead><tr><th>Question</th><th>Before</th><th>After</th></tr></thead>
<tbody>
<tr><td>How many reasons to change TripManager / TripService?</td><td>4 (price, storage, message, report)</td><td>1 (the steps of ending a trip)</td></tr>
<tr><td>Who can delete stored trips?</td><td>anyone holding the object (public list)</td><td>only through TripRepository.clear()</td></tr>
<tr><td>Change SMS → e-mail</td><td>edit TripManager</td><td>pass a different Notifier</td></tr>
<tr><td>Unit-test the fare rule</td><td>needs the whole manager, prints SMS</td><td>test FareCalculator alone</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Before: low cohesion + high (content) coupling. After: each class is highly cohesive, TripService is loosely coupled — it knows FareCalculator and two interfaces, never the concrete storage or messaging classes. Output identical for the same inputs.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): a Spring Boot <code>ReservationService</code> that receives <code>ReservationRepository</code> and <code>NotificationPort</code> through its constructor is exactly the "after" shape. Spring's dependency injection simply does the <code>new …</code> lines of <code>main</code> for you.</div>
<div class="pitfall">"Low coupling" does not mean "no connections" — TripService still uses three collaborators. It means each connection is <strong>narrow</strong> (a small interface) and <strong>explicit</strong> (constructor, not a public field). And do not say "high cohesion = many methods": cohesion is about how closely the methods of one class belong to one purpose.</div>`,
    `<h3>🧪 Bài 5 — Ghép nối và kết dính: trước → sau (dạng PT / vấn đáp · ~15 phút)</h3>
<p class="nhan">Đề</p>
<p>Dưới đây là phiên bản đầu của code chuyến đi FU Bike. (a) Chỉ ra chỗ sai theo góc độ kết dính (cohesion) và ghép nối (coupling). (b) Thiết kế lại để mỗi lớp một việc và các lớp phụ thuộc vào interface nhỏ. (c) Chứng minh hành vi không đổi, và việc đổi SMS sang e-mail không còn đụng tới logic chuyến đi.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/cf6a6fe365f67a436e6c8a937757c37b749e71bd.svg" alt="Before — low cohesion, high coupling" loading="lazy" /><p class="chu-thich">🧩 Before — low cohesion, high coupling</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bài 5, trước — một lớp bốn việc, dữ liệu public, lớp khác thò tay vào
title Before — low cohesion, high coupling
hide circle
class TripManager {
  + table : List&lt;String[]&gt;
  + endTrip(rider, bikeType, minutes, student) : int
  + printReport() : void
}
note right of TripManager
  pricing rules
  + storage
  + SMS text
  + reporting
end note
class AdminPage {
  + resetDay(m : TripManager) : void
}
AdminPage ..&gt; TripManager : m.table.clear()
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">class TripManager {
    public List&lt;String[]&gt; table = new ArrayList&lt;&gt;();   // dữ liệu public: lớp nào cũng thêm/xoá dòng được

    public int endTrip(String rider, String bikeType, int minutes, boolean student) {
        int fare;                                                   // việc 1: luật tính giá
        if (bikeType.equals("EBIKE")) fare = 3000 + minutes * 500;
        else fare = 2000 + minutes * 200;
        if (student) fare = fare * 80 / 100;
        table.add(new String[] { rider, bikeType, String.valueOf(minutes), String.valueOf(fare) });   // việc 2: lưu trữ
        System.out.println("SMS to " + rider + ": " + minutes + " min, fare " + fare + " VND");       // việc 3: gửi tin
        return fare;
    }

    public void printReport() {                                     // việc 4: báo cáo
        int sum = 0;
        for (String[] row : table) sum += Integer.parseInt(row[3]);
        System.out.println("report: " + table.size() + " trips, revenue " + sum + " VND");
    }
}

class AdminPage {
    void resetDay(TripManager m) {
        m.table.clear();                                            // ghép nối nội dung: thò tay vào dữ liệu của lớp khác
    }
}</code></pre>
<div class="out">SMS to An: 10 min, fare 6400 VND<br>
SMS to Binh: 25 min, fare 7000 VND<br>
report: 2 trips, revenue 13400 VND<br>
report: 0 trips, revenue 0 VND</div>
<p class="nhan">Lời giải</p>
<p>(a) <strong>Kết dính thấp</strong>: TripManager làm bốn việc không liên quan (luật giá, lưu trữ, gửi tin, báo cáo) — đổi bất kỳ việc nào cũng phải sửa lớp này. <strong>Ghép nối chặt</strong>: dữ liệu của nó để public và AdminPage thò tay vào gọi <code>m.table.clear()</code> (ghép nối nội dung — content coupling, loại tệ nhất); mọi nơi gọi đều phụ thuộc lớp cụ thể nên không thay được SMS.</p>
<p>(b) Tách theo việc và nối qua interface:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/5258eeb0af7ebb866bea235ce25e2c06cf1c850c.svg" alt="After — high cohesion, low coupling" loading="lazy" /><p class="chu-thich">🧩 After — high cohesion, low coupling</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bài 5, sau — mỗi lớp một việc; TripService chỉ phụ thuộc interface
title After — high cohesion, low coupling
hide circle
class TripService {
  - calc : FareCalculator
  - repo : TripRepository
  - notifier : Notifier
  + endTrip(rider, bikeType, minutes, student) : int
}
class FareCalculator {
  + fare(bikeType, minutes, student) : int
}
interface TripRepository &lt;&lt;interface&gt;&gt; {
  + save(t : Trip)
  + all() : List&lt;Trip&gt;
  + clear()
}
class InMemoryTripRepository {
  - rows : List&lt;Trip&gt;
}
interface Notifier &lt;&lt;interface&gt;&gt; {
  + send(to, text)
}
class SmsNotifier
class EmailNotifier
class ReportService {
  + print()
}
TripService --&gt; FareCalculator
TripService --&gt; TripRepository
TripService --&gt; Notifier
ReportService --&gt; TripRepository
InMemoryTripRepository .up.|&gt; TripRepository
SmsNotifier .up.|&gt; Notifier
EmailNotifier .up.|&gt; Notifier
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">record Trip(String rider, String bikeType, int minutes, int fare) {}

class FareCalculator {                                   // chỉ luật tính giá
    int fare(String bikeType, int minutes, boolean student) {
        int fare = bikeType.equals("EBIKE") ? 3000 + minutes * 500 : 2000 + minutes * 200;
        return student ? fare * 80 / 100 : fare;
    }
}

interface TripRepository {                               // chỉ lưu trữ — lưu thế nào thì giấu
    void save(Trip t);
    List&lt;Trip&gt; all();
    void clear();
}

class InMemoryTripRepository implements TripRepository {
    private final List&lt;Trip&gt; rows = new ArrayList&lt;&gt;();   // private: không ai khác đụng được danh sách
    public void save(Trip t) { rows.add(t); }
    public List&lt;Trip&gt; all() { return List.copyOf(rows); }
    public void clear() { rows.clear(); }
}

interface Notifier { void send(String to, String text); }  // chỉ gửi tin

class SmsNotifier implements Notifier {
    public void send(String to, String text) { System.out.println("SMS to " + to + ": " + text); }
}

class EmailNotifier implements Notifier {
    public void send(String to, String text) { System.out.println("EMAIL to " + to + ": " + text); }
}

class TripService {                                      // điều phối ba lớp phụ, chỉ phụ thuộc interface của chúng
    private final FareCalculator calc;
    private final TripRepository repo;
    private final Notifier notifier;

    TripService(FareCalculator calc, TripRepository repo, Notifier notifier) {
        this.calc = calc; this.repo = repo; this.notifier = notifier;
    }

    int endTrip(String rider, String bikeType, int minutes, boolean student) {
        int fare = calc.fare(bikeType, minutes, student);
        repo.save(new Trip(rider, bikeType, minutes, fare));
        notifier.send(rider, minutes + " min, fare " + fare + " VND");
        return fare;
    }
}

class ReportService {
    private final TripRepository repo;
    ReportService(TripRepository repo) { this.repo = repo; }
    void print() {
        int sum = repo.all().stream().mapToInt(Trip::fare).sum();
        System.out.println("report: " + repo.all().size() + " trips, revenue " + sum + " VND");
    }
}</code></pre>
<p>(c) Cùng các chuyến, cùng giá, cùng báo cáo — thêm một dòng mới: gửi e-mail thay SMS chỉ bằng cách truyền một Notifier khác. TripService không bị sửa.</p>
<pre class="trich"><code class="language-java">TripRepository repo = new InMemoryTripRepository();
TripService trips = new TripService(new FareCalculator(), repo, new SmsNotifier());
ReportService report = new ReportService(repo);
trips.endTrip("An", "EBIKE", 10, true);
trips.endTrip("Binh", "CLASSIC", 25, false);
report.print();
repo.clear();                                                   // xoá dữ liệu đi qua interface
report.print();
// đổi yêu cầu: gửi e-mail thay SMS — không sửa TripService
new TripService(new FareCalculator(), repo, new EmailNotifier()).endTrip("Chi", "EBIKE", 4, true);</code></pre>
<div class="out">SMS to An: 10 min, fare 6400 VND<br>
SMS to Binh: 25 min, fare 7000 VND<br>
report: 2 trips, revenue 13400 VND<br>
report: 0 trips, revenue 0 VND<br>
EMAIL to Chi: 4 min, fare 4000 VND</div>
<table>
<thead><tr><th>Câu hỏi</th><th>Trước</th><th>Sau</th></tr></thead>
<tbody>
<tr><td>Có mấy lý do phải sửa TripManager / TripService?</td><td>4 (giá, lưu trữ, tin nhắn, báo cáo)</td><td>1 (các bước kết thúc chuyến)</td></tr>
<tr><td>Ai xoá được các chuyến đã lưu?</td><td>bất kỳ ai cầm đối tượng (danh sách public)</td><td>chỉ qua TripRepository.clear()</td></tr>
<tr><td>Đổi SMS → e-mail</td><td>sửa TripManager</td><td>truyền Notifier khác</td></tr>
<tr><td>Kiểm thử đơn vị luật giá</td><td>cần cả lớp quản lý, còn in SMS</td><td>kiểm FareCalculator riêng</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Trước: kết dính thấp + ghép nối chặt (ghép nối nội dung). Sau: mỗi lớp kết dính cao, TripService ghép nối lỏng — nó chỉ biết FareCalculator và hai interface, không bao giờ biết lớp lưu trữ hay gửi tin cụ thể. Output giống hệt với cùng đầu vào.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): một <code>ReservationService</code> của Spring Boot nhận <code>ReservationRepository</code> và <code>NotificationPort</code> qua constructor chính là hình dạng "sau". Cơ chế tiêm phụ thuộc (dependency injection) của Spring chỉ làm hộ bạn mấy dòng <code>new …</code> trong <code>main</code>.</div>
<div class="pitfall">"Ghép nối lỏng" không có nghĩa là "không nối với ai" — TripService vẫn dùng ba cộng sự. Nó nghĩa là mỗi mối nối <strong>hẹp</strong> (một interface nhỏ) và <strong>tường minh</strong> (qua constructor, không qua thuộc tính public). Và đừng nói "kết dính cao = nhiều phương thức": kết dính là mức độ các phương thức của một lớp cùng phục vụ một mục đích.</div>`),
    bi(`<h3>🧪 Exercise 6 — Information hiding (FE / PT style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>Each station keeps a waiting list of at most three riders who want the next returned bike. The first version exposes its array and counter. (a) Show what can go wrong. (b) Redesign the waiting list with information hiding. (c) Prove that you can replace the array by a queue without changing any client.</p>
<pre class="trich"><code class="language-java">class ExposedWaitlist {                         // data structure is public
    public String[] riders = new String[3];
    public int count = 0;
}</code></pre>
<p class="nhan">Solution</p>
<p>(a) Nothing protects the data: a client adds "An" twice, another "fixes" the counter to 7, and the next insert crashes. The rules (no duplicates, at most three) live in every client — or nowhere.</p>
<p>(b) Following Gomaa's two steps: first design the <strong>interface</strong> — the operations clients may call (join, next, size); then the <strong>internals</strong>, which are private. The rules move inside the object, next to the data they protect.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/dff50893cbfd6dc7bff099ae7def8e0ad318ffa3.svg" alt="Solution — information hiding behind an interface" loading="lazy" /><p class="chu-thich">🧩 Solution — information hiding behind an interface</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 6 solution — the client knows only the Waitlist operations; the array or the queue stays hidden
title Solution — information hiding behind an interface
hide circle
class StationKiosk &lt;&lt;client&gt;&gt;
interface Waitlist &lt;&lt;interface&gt;&gt; {
  + join(rider : String) : boolean
  + next() : String
  + size() : int
}
class ArrayWaitlist {
  - riders : String[3]
  - count : int
}
class DequeWaitlist {
  - q : Deque&lt;String&gt;
  - capacity : int
}
StationKiosk ..&gt; Waitlist : uses
ArrayWaitlist .up.|&gt; Waitlist
DequeWaitlist .up.|&gt; Waitlist
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">interface Waitlist {                            // what clients may do — the only thing they know
    boolean join(String rider);                 // false when full or already waiting
    String next();                              // null when empty
    int size();
}

class ArrayWaitlist implements Waitlist {       // version 1: array
    private final String[] riders = new String[3];
    private int count = 0;
    public boolean join(String r) {
        if (count == riders.length) return false;
        for (int i = 0; i &lt; count; i++) if (riders[i].equals(r)) return false;
        riders[count++] = r;
        return true;
    }
    public String next() {
        if (count == 0) return null;
        String first = riders[0];
        System.arraycopy(riders, 1, riders, 0, --count);
        return first;
    }
    public int size() { return count; }
}

class DequeWaitlist implements Waitlist {       // version 2: a queue — clients do not notice the change
    private final Deque&lt;String&gt; q = new ArrayDeque&lt;&gt;();
    private final int capacity = 3;
    public boolean join(String r) {
        if (q.size() == capacity || q.contains(r)) return false;
        return q.offer(r);
    }
    public String next() { return q.poll(); }
    public int size() { return q.size(); }
}</code></pre>
<p>(c) One client method, two implementations, the same results:</p>
<pre class="trich"><code class="language-java">static void useWaitlist(String label, Waitlist w) {  // one client, two implementations
    List&lt;Boolean&gt; ok = new ArrayList&lt;&gt;();
    for (String r : new String[] { "An", "Binh", "An", "Chi", "Dung" }) ok.add(w.join(r));
    System.out.println(label + " join results " + ok + ", size " + w.size() + ", next " + w.next() + ", size " + w.size());
}</code></pre>
<div class="out">exposed: crashed at index 7 of 3<br>
array: join results [true, true, false, true, false], size 3, next An, size 2<br>
deque: join results [true, true, false, true, false], size 3, next An, size 2</div>
<p class="dap-an">✅ Information hiding = hide the <strong>design decision</strong> that is likely to change (here: array or queue) behind a stable interface. The duplicate "An" and the fifth rider are refused by the object itself; swapping the data structure changed zero lines of client code.</p>
<div class="pitfall">Private fields with a public getter <em>and setter</em> for each one are not information hiding — <code>setCount(7)</code> breaks the list just as well as <code>count = 7</code>. Hide the data structure and offer <strong>operations with meaning</strong> (join, next), not raw access.</div>`,
    `<h3>🧪 Bài 6 — Che giấu thông tin (dạng FE / PT · ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Mỗi trạm giữ một hàng chờ tối đa ba người muốn lấy chiếc xe được trả kế tiếp. Phiên bản đầu để lộ mảng và bộ đếm. (a) Chỉ ra điều gì có thể hỏng. (b) Thiết kế lại hàng chờ theo nguyên lý che giấu thông tin (information hiding). (c) Chứng minh có thể thay mảng bằng hàng đợi mà không phải sửa client nào.</p>
<pre class="trich"><code class="language-java">class ExposedWaitlist {                         // cấu trúc dữ liệu để public
    public String[] riders = new String[3];
    public int count = 0;
}</code></pre>
<p class="nhan">Lời giải</p>
<p>(a) Không có gì bảo vệ dữ liệu: một client thêm "An" hai lần, client khác "sửa" bộ đếm thành 7, và lần thêm tiếp theo thì sập. Các luật (không trùng, tối đa ba người) phải nằm ở mọi client — hoặc chẳng nằm ở đâu cả.</p>
<p>(b) Theo hai bước của Gomaa: trước tiên thiết kế <strong>interface</strong> — các thao tác client được gọi (join, next, size); sau đó mới đến <strong>phần bên trong</strong>, để private. Các luật chuyển vào trong đối tượng, nằm ngay cạnh dữ liệu mà chúng bảo vệ.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/dff50893cbfd6dc7bff099ae7def8e0ad318ffa3.svg" alt="Solution — information hiding behind an interface" loading="lazy" /><p class="chu-thich">🧩 Solution — information hiding behind an interface</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Lời giải bài 6 — client chỉ biết các thao tác của Waitlist; mảng hay hàng đợi đều bị giấu
title Solution — information hiding behind an interface
hide circle
class StationKiosk &lt;&lt;client&gt;&gt;
interface Waitlist &lt;&lt;interface&gt;&gt; {
  + join(rider : String) : boolean
  + next() : String
  + size() : int
}
class ArrayWaitlist {
  - riders : String[3]
  - count : int
}
class DequeWaitlist {
  - q : Deque&lt;String&gt;
  - capacity : int
}
StationKiosk ..&gt; Waitlist : uses
ArrayWaitlist .up.|&gt; Waitlist
DequeWaitlist .up.|&gt; Waitlist
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">interface Waitlist {                            // client được làm gì — thứ duy nhất client biết
    boolean join(String rider);                 // false khi đầy hoặc đã chờ rồi
    String next();                              // null khi rỗng
    int size();
}

class ArrayWaitlist implements Waitlist {       // phiên bản 1: mảng
    private final String[] riders = new String[3];
    private int count = 0;
    public boolean join(String r) {
        if (count == riders.length) return false;
        for (int i = 0; i &lt; count; i++) if (riders[i].equals(r)) return false;
        riders[count++] = r;
        return true;
    }
    public String next() {
        if (count == 0) return null;
        String first = riders[0];
        System.arraycopy(riders, 1, riders, 0, --count);
        return first;
    }
    public int size() { return count; }
}

class DequeWaitlist implements Waitlist {       // phiên bản 2: hàng đợi — client không hề biết có thay đổi
    private final Deque&lt;String&gt; q = new ArrayDeque&lt;&gt;();
    private final int capacity = 3;
    public boolean join(String r) {
        if (q.size() == capacity || q.contains(r)) return false;
        return q.offer(r);
    }
    public String next() { return q.poll(); }
    public int size() { return q.size(); }
}</code></pre>
<p>(c) Một phương thức client, hai cách cài đặt, cùng kết quả:</p>
<pre class="trich"><code class="language-java">static void useWaitlist(String label, Waitlist w) {  // một client, hai cách cài đặt
    List&lt;Boolean&gt; ok = new ArrayList&lt;&gt;();
    for (String r : new String[] { "An", "Binh", "An", "Chi", "Dung" }) ok.add(w.join(r));
    System.out.println(label + " join results " + ok + ", size " + w.size() + ", next " + w.next() + ", size " + w.size());
}</code></pre>
<div class="out">exposed: crashed at index 7 of 3<br>
array: join results [true, true, false, true, false], size 3, next An, size 2<br>
deque: join results [true, true, false, true, false], size 3, next An, size 2</div>
<p class="dap-an">✅ Che giấu thông tin = giấu <strong>quyết định thiết kế</strong> dễ thay đổi (ở đây: mảng hay hàng đợi) sau một interface ổn định. Chữ "An" trùng và người thứ năm bị chính đối tượng từ chối; đổi cấu trúc dữ liệu mà client không phải sửa dòng nào.</p>
<div class="pitfall">Thuộc tính private mà mỗi cái có sẵn getter <em>và setter</em> public thì không phải che giấu thông tin — <code>setCount(7)</code> phá hàng chờ y như <code>count = 7</code>. Hãy giấu cấu trúc dữ liệu và đưa ra các <strong>thao tác có nghĩa</strong> (join, next), không phải quyền truy cập thô.</div>`),
    bi(`<h3>🧪 Exercise 7 — Synchronous or asynchronous? (FE / PT style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>(a) Classify each message as synchronous (the sender waits for a reply — tightly coupled) or asynchronous (the sender continues — loosely coupled): (1) the app asks UnlockService to unlock bike B-07 and must know whether it worked; (2) a dock sensor reports "bike removed"; (3) a dock sensor reports "low battery"; (4) the app asks for the fare before showing the payment screen. (b) Draw the two kinds on one sequence diagram. (c) Explain the output of the program below.</p>
<p class="nhan">Solution</p>
<table>
<thead><tr><th>Message</th><th>Kind</th><th>Why</th></tr></thead>
<tbody>
<tr><td>1 unlock(B-07)</td><td>synchronous with reply</td><td>the rider cannot start until the app knows the lock opened</td></tr>
<tr><td>2 bikeRemoved</td><td>asynchronous</td><td>the sensor must not stop reading while the logger is busy; nobody replies</td></tr>
<tr><td>3 lowBattery</td><td>asynchronous</td><td>same — an event notification, queued for the consumer</td></tr>
<tr><td>4 fare request</td><td>synchronous with reply</td><td>the next screen needs the number</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/80b1291d074fdc480c1a6184bc5fe120ce496809.svg" alt="Solution — sync vs async messages in FU Bike" loading="lazy" /><p class="chu-thich">🧩 Solution — sync vs async messages in FU Bike</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 7 solution — synchronous calls (filled arrow, reply awaited) and asynchronous events (open arrow, no waiting)
title Solution — sync vs async messages in FU Bike
actor Rider
participant ":BikeApp" as A
participant ":UnlockService" as U
participant ":DockSensor" as S
queue "event queue" as Q
participant ":TripLogger" as L
Rider -&gt; A : 1: scan QR
A -&gt; U : 2: unlock(bikeId)
activate U
U --&gt; A : 3: UNLOCKED
deactivate U
A --&gt; Rider : 4: show "ride started"
S -&gt;&gt; Q : 5: bikeRemoved(dock 5)
S -&gt;&gt; Q : 6: lowBattery(dock 3)
Q -&gt;&gt; L : 7: deliver events one by one
@enduml</code></pre></details>
<p>On a sequence diagram a <strong>synchronous</strong> message has a filled arrowhead and its reply a dashed arrow; an <strong>asynchronous</strong> message has an open arrowhead and no reply. In Gomaa's producer/consumer problem the asynchronous messages wait in a <strong>queue</strong> between the two concurrent objects.</p>
<pre class="trich"><code class="language-java">UnlockService service = new UnlockService();
String reply = service.unlock("B-07");           // the app waits here until the reply comes back
System.out.println("app: reply = " + reply);</code></pre>
<pre class="trich"><code class="language-java">BlockingQueue&lt;String&gt; queue = new ArrayBlockingQueue&lt;&gt;(10);   // the message buffer between the two objects
List&lt;String&gt; stored = Collections.synchronizedList(new ArrayList&lt;&gt;());
Thread logger = new Thread(() -&gt; {                             // consumer: its own thread of control
    try {
        while (true) {
            String event = queue.take();
            if (event.equals("STOP")) break;
            stored.add("stored: " + event);
        }
    } catch (InterruptedException ex) { Thread.currentThread().interrupt(); }
});
logger.start();
for (String ev : List.of("DOCK-3 bike returned", "DOCK-5 bike removed", "DOCK-3 low battery")) {
    queue.put(ev);                                             // producer does not wait for any reply
}
System.out.println("sensor: sent 3 events, waited for no reply");
queue.put("STOP");
logger.join();
stored.forEach(System.out::println);</code></pre>
<div class="out">app: reply = UNLOCKED B-07<br>
sensor: sent 3 events, waited for no reply<br>
stored: DOCK-3 bike returned<br>
stored: DOCK-5 bike removed<br>
stored: DOCK-3 low battery</div>
<p>(c) Line 1 appears only after <code>unlock</code> returned — the caller waited. Line 2 is printed right after the three <code>put</code> calls: the sensor did not wait for any processing. The logger thread took the events from the queue in order (FIFO) and handled them at its own pace; main prints its list after <code>join</code>, so the output order is always the same.</p>
<p class="dap-an">✅ 1 and 4 synchronous (with reply), 2 and 3 asynchronous. Rule of thumb: if the sender needs the answer to continue, it is synchronous; if it is "fire and forget" and the receiver may be slower, it is asynchronous with a queue.</p>
<div class="pitfall">Asynchronous ≠ "no ordering". A queue keeps the order of the messages from one producer; what is lost is the <strong>waiting</strong>. And a synchronous call without a reply exists too (the sender waits until the receiver accepts the message) — the slides call the common case "synchronous message communication with reply".</div>`,
    `<h3>🧪 Bài 7 — Đồng bộ hay bất đồng bộ? (dạng FE / PT · ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>(a) Phân loại mỗi thông điệp là đồng bộ (synchronous — bên gửi chờ trả lời, ghép chặt) hay bất đồng bộ (asynchronous — bên gửi đi tiếp, ghép lỏng): (1) app nhờ UnlockService mở khoá xe B-07 và phải biết có mở được không; (2) cảm biến ngàm báo "xe bị lấy ra"; (3) cảm biến ngàm báo "pin yếu"; (4) app hỏi tiền cước trước khi hiện màn hình thanh toán. (b) Vẽ cả hai loại trên cùng một sequence diagram. (c) Giải thích output của chương trình bên dưới.</p>
<p class="nhan">Lời giải</p>
<table>
<thead><tr><th>Thông điệp</th><th>Loại</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>1 unlock(B-07)</td><td>đồng bộ có trả lời</td><td>người đi xe chưa đi được cho tới khi app biết khoá đã mở</td></tr>
<tr><td>2 bikeRemoved</td><td>bất đồng bộ</td><td>cảm biến không được dừng đọc trong lúc bộ ghi nhật ký bận; không ai trả lời</td></tr>
<tr><td>3 lowBattery</td><td>bất đồng bộ</td><td>như trên — một thông báo sự kiện, xếp hàng chờ bên nhận</td></tr>
<tr><td>4 hỏi tiền cước</td><td>đồng bộ có trả lời</td><td>màn hình tiếp theo cần con số đó</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/80b1291d074fdc480c1a6184bc5fe120ce496809.svg" alt="Solution — sync vs async messages in FU Bike" loading="lazy" /><p class="chu-thich">🧩 Solution — sync vs async messages in FU Bike</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Lời giải bài 7 — gọi đồng bộ (mũi tên đặc, chờ trả lời) và sự kiện bất đồng bộ (mũi tên hở, không chờ)
title Solution — sync vs async messages in FU Bike
actor Rider
participant ":BikeApp" as A
participant ":UnlockService" as U
participant ":DockSensor" as S
queue "event queue" as Q
participant ":TripLogger" as L
Rider -&gt; A : 1: scan QR
A -&gt; U : 2: unlock(bikeId)
activate U
U --&gt; A : 3: UNLOCKED
deactivate U
A --&gt; Rider : 4: show "ride started"
S -&gt;&gt; Q : 5: bikeRemoved(dock 5)
S -&gt;&gt; Q : 6: lowBattery(dock 3)
Q -&gt;&gt; L : 7: deliver events one by one
@enduml</code></pre></details>
<p>Trên sequence diagram, thông điệp <strong>đồng bộ</strong> có đầu mũi tên đặc và lời trả lời là mũi tên nét đứt; thông điệp <strong>bất đồng bộ</strong> có đầu mũi tên hở và không có trả lời. Trong bài toán producer/consumer (bên sinh/bên tiêu thụ) của Gomaa, các thông điệp bất đồng bộ nằm chờ trong một <strong>hàng đợi (queue)</strong> giữa hai đối tượng chạy song song.</p>
<pre class="trich"><code class="language-java">UnlockService service = new UnlockService();
String reply = service.unlock("B-07");           // ứng dụng đứng chờ ở đây tới khi có trả lời
System.out.println("app: reply = " + reply);</code></pre>
<pre class="trich"><code class="language-java">BlockingQueue&lt;String&gt; queue = new ArrayBlockingQueue&lt;&gt;(10);   // bộ đệm thông điệp giữa hai đối tượng
List&lt;String&gt; stored = Collections.synchronizedList(new ArrayList&lt;&gt;());
Thread logger = new Thread(() -&gt; {                             // consumer: luồng điều khiển riêng
    try {
        while (true) {
            String event = queue.take();
            if (event.equals("STOP")) break;
            stored.add("stored: " + event);
        }
    } catch (InterruptedException ex) { Thread.currentThread().interrupt(); }
});
logger.start();
for (String ev : List.of("DOCK-3 bike returned", "DOCK-5 bike removed", "DOCK-3 low battery")) {
    queue.put(ev);                                             // producer không chờ trả lời
}
System.out.println("sensor: sent 3 events, waited for no reply");
queue.put("STOP");
logger.join();
stored.forEach(System.out::println);</code></pre>
<div class="out">app: reply = UNLOCKED B-07<br>
sensor: sent 3 events, waited for no reply<br>
stored: DOCK-3 bike returned<br>
stored: DOCK-5 bike removed<br>
stored: DOCK-3 low battery</div>
<p>(c) Dòng 1 chỉ hiện sau khi <code>unlock</code> trả về — bên gọi đã chờ. Dòng 2 in ngay sau ba lệnh <code>put</code>: cảm biến không chờ xử lý gì cả. Luồng logger lấy sự kiện khỏi hàng đợi theo thứ tự (vào trước ra trước — FIFO) và xử lý theo nhịp của nó; main in danh sách sau <code>join</code>, nên thứ tự output lần nào chạy cũng như nhau.</p>
<p class="dap-an">✅ 1 và 4 đồng bộ (có trả lời), 2 và 3 bất đồng bộ. Mẹo: bên gửi cần câu trả lời mới đi tiếp được thì là đồng bộ; "gửi rồi quên" và bên nhận có thể chậm hơn thì là bất đồng bộ qua hàng đợi.</p>
<div class="pitfall">Bất đồng bộ ≠ "không có thứ tự". Hàng đợi giữ đúng thứ tự thông điệp của một bên sinh; cái mất đi là <strong>sự chờ đợi</strong>. Và cũng có gọi đồng bộ không có trả lời (bên gửi chờ tới khi bên nhận nhận thông điệp) — slide gọi trường hợp hay gặp là "synchronous message communication with reply".</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>UML (Unified Modeling Language)</strong></td><td>ngôn ngữ mô hình hoá thống nhất</td><td>The standard graphical notation for describing software models, managed by the OMG.</td></tr>
<tr><td><strong>static model / dynamic model</strong></td><td>mô hình tĩnh / mô hình động</td><td>Static diagrams show structure (class, deployment); dynamic ones show behaviour over time (sequence, state machine).</td></tr>
<tr><td><strong>use case diagram</strong></td><td>sơ đồ ca sử dụng</td><td>Shows actors and the use cases they take part in, inside a system boundary.</td></tr>
<tr><td><strong>sequence diagram</strong></td><td>sơ đồ tuần tự</td><td>An interaction diagram where time runs top to bottom along object lifelines.</td></tr>
<tr><td><strong>communication diagram</strong></td><td>sơ đồ giao tiếp</td><td>An interaction diagram that shows objects, their links and numbered messages.</td></tr>
<tr><td><strong>state machine diagram (statechart)</strong></td><td>sơ đồ máy trạng thái</td><td>Shows the states of one object and the events that move it between them.</td></tr>
<tr><td><strong>deployment diagram</strong></td><td>sơ đồ triển khai</td><td>Shows physical nodes, the artifacts deployed on them and the links between nodes.</td></tr>
<tr><td><strong>multiplicity</strong></td><td>bội số</td><td>How many objects of the class at that end one object at the other end is linked to (1, 0..1, *, 1..*).</td></tr>
<tr><td><strong>aggregation</strong></td><td>kết tập</td><td>A weak whole/part link (hollow diamond): the part can exist without the whole.</td></tr>
<tr><td><strong>composition</strong></td><td>hợp thành</td><td>A strong whole/part link (filled diamond): the parts are created and deleted with the whole.</td></tr>
<tr><td><strong>generalization / specialization</strong></td><td>tổng quát hoá / chuyên biệt hoá</td><td>An is-a relationship: the subclass inherits the attributes and operations of the superclass.</td></tr>
<tr><td><strong>realization</strong></td><td>hiện thực hoá</td><td>A class implements the operations promised by an interface (dashed line, hollow triangle).</td></tr>
<tr><td><strong>dependency</strong></td><td>phụ thuộc</td><td>A short-lived use of another class, such as a parameter or a local variable (dashed arrow).</td></tr>
<tr><td><strong>cohesion</strong></td><td>độ kết dính</td><td>How strongly the responsibilities of one class belong to a single purpose; aim high.</td></tr>
<tr><td><strong>coupling</strong></td><td>độ ghép nối</td><td>How much one class depends on the internals of others; aim low.</td></tr>
<tr><td><strong>information hiding</strong></td><td>che giấu thông tin</td><td>Hide a changeable design decision, such as a data structure, behind an interface of operations.</td></tr>
<tr><td><strong>throwaway / evolutionary prototype</strong></td><td>bản mẫu bỏ đi / bản mẫu tiến hoá</td><td>A throwaway prototype is discarded after clarifying requirements; an evolutionary one grows into the product.</td></tr>
<tr><td><strong>spiral model</strong></td><td>mô hình xoắn ốc</td><td>A risk-driven life cycle in which every cycle plans, analyses risks, develops and reviews.</td></tr>
<tr><td><strong>synchronous / asynchronous message</strong></td><td>thông điệp đồng bộ / bất đồng bộ</td><td>With a synchronous message the sender waits (often for a reply); with an asynchronous one it continues at once.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>UML (Unified Modeling Language)</strong></td><td>ngôn ngữ mô hình hoá thống nhất</td><td>Ký hiệu đồ hoạ chuẩn để mô tả mô hình phần mềm, do OMG quản lý.</td></tr>
<tr><td><strong>static model / dynamic model</strong></td><td>mô hình tĩnh / mô hình động</td><td>Sơ đồ tĩnh cho thấy cấu trúc (class, deployment); sơ đồ động cho thấy hành vi theo thời gian (sequence, state machine).</td></tr>
<tr><td><strong>use case diagram</strong></td><td>sơ đồ ca sử dụng</td><td>Cho thấy các actor và những use case họ tham gia, trong khung ranh giới hệ thống.</td></tr>
<tr><td><strong>sequence diagram</strong></td><td>sơ đồ tuần tự</td><td>Sơ đồ tương tác, thời gian chạy từ trên xuống dọc các đường đời của đối tượng.</td></tr>
<tr><td><strong>communication diagram</strong></td><td>sơ đồ giao tiếp</td><td>Sơ đồ tương tác cho thấy đối tượng, các đường liên kết và thông điệp đánh số.</td></tr>
<tr><td><strong>state machine diagram (statechart)</strong></td><td>sơ đồ máy trạng thái</td><td>Cho thấy các trạng thái của một đối tượng và sự kiện làm nó chuyển trạng thái.</td></tr>
<tr><td><strong>deployment diagram</strong></td><td>sơ đồ triển khai</td><td>Cho thấy các nút vật lý, artifact triển khai trên đó và đường nối giữa các nút.</td></tr>
<tr><td><strong>multiplicity</strong></td><td>bội số</td><td>Một đối tượng ở đầu bên kia nối với bao nhiêu đối tượng của lớp ở đầu này (1, 0..1, *, 1..*).</td></tr>
<tr><td><strong>aggregation</strong></td><td>kết tập</td><td>Quan hệ toàn thể/bộ phận lỏng (thoi rỗng): bộ phận tồn tại được khi không có toàn thể.</td></tr>
<tr><td><strong>composition</strong></td><td>hợp thành</td><td>Quan hệ toàn thể/bộ phận chặt (thoi đặc): bộ phận được tạo và bị xoá cùng toàn thể.</td></tr>
<tr><td><strong>generalization / specialization</strong></td><td>tổng quát hoá / chuyên biệt hoá</td><td>Quan hệ "là một": lớp con kế thừa thuộc tính và thao tác của lớp cha.</td></tr>
<tr><td><strong>realization</strong></td><td>hiện thực hoá</td><td>Một lớp cài đặt các thao tác mà interface đã hứa (nét đứt, tam giác rỗng).</td></tr>
<tr><td><strong>dependency</strong></td><td>phụ thuộc</td><td>Việc dùng thoáng qua một lớp khác, như tham số hay biến cục bộ (mũi tên nét đứt).</td></tr>
<tr><td><strong>cohesion</strong></td><td>độ kết dính</td><td>Mức độ các trách nhiệm của một lớp cùng phục vụ một mục đích; nên cao.</td></tr>
<tr><td><strong>coupling</strong></td><td>độ ghép nối</td><td>Mức độ một lớp phụ thuộc vào phần bên trong của lớp khác; nên thấp.</td></tr>
<tr><td><strong>information hiding</strong></td><td>che giấu thông tin</td><td>Giấu một quyết định thiết kế dễ đổi, như cấu trúc dữ liệu, sau một interface gồm các thao tác.</td></tr>
<tr><td><strong>throwaway / evolutionary prototype</strong></td><td>bản mẫu bỏ đi / bản mẫu tiến hoá</td><td>Bản mẫu bỏ đi bị vứt sau khi làm rõ yêu cầu; bản mẫu tiến hoá lớn dần thành sản phẩm.</td></tr>
<tr><td><strong>spiral model</strong></td><td>mô hình xoắn ốc</td><td>Vòng đời dẫn dắt bởi rủi ro, mỗi vòng đều lập kế hoạch, phân tích rủi ro, phát triển và đánh giá.</td></tr>
<tr><td><strong>synchronous / asynchronous message</strong></td><td>thông điệp đồng bộ / bất đồng bộ</td><td>Với thông điệp đồng bộ bên gửi phải chờ (thường chờ trả lời); với bất đồng bộ bên gửi đi tiếp ngay.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 1</h2>
<ol>
<li><strong>A model is a simplified view</strong> for one purpose; COMET builds three in a row: requirements (use cases) → analysis (static + dynamic) → design (architecture).</li>
<li><strong>Recognise diagrams by their shape</strong>: ovals + actors = use case; three-compartment boxes = class; lifelines = sequence; links + 1, 1.1 numbers = communication; rounded states + events = state machine; 3-D nodes = deployment.</li>
<li><strong>Six class relationships</strong>: association (line), aggregation (hollow ◇ at the whole), composition (filled ◆ at the whole), generalization (solid ▷ to parent), realization (dashed ▷ to interface), dependency (dashed arrow).</li>
<li><strong>Multiplicity is read from the far end</strong>: the number next to a class = how many of that class one object on the other side has.</li>
<li><strong>Life cycles</strong>: waterfall (stable requirements, no iteration shown) · throwaway prototype (clarify UI, then discard) · incremental/evolutionary (early working subset) · spiral (risk analysis every cycle) · USDP (4 phases × iterations). COMET works with USDP or spiral.</li>
<li><strong>High cohesion, low coupling</strong>: one purpose per class; connections narrow (interfaces) and explicit (constructor), never through public data.</li>
<li><strong>Information hiding</strong>: design the interface first, hide the data structure and its rules inside; then the internals can change freely.</li>
<li><strong>Synchronous vs asynchronous</strong>: the sender waits (filled arrow + reply) or continues (open arrow, queue between concurrent objects).</li>
</ol>
<h3>✅ Check yourself before the quiz</h3>
<ol>
<li>Which two UML diagrams show the same interaction, and what does each make easier to read?</li>
<li>"A Library has many Bookshelves; a bookshelf cannot exist without its library." Which relationship, and where is the diamond?</li>
<li>A project must show users something working in six weeks and keep growing it. Which life cycle model?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) sequence (time order) and communication (links between objects). (2) Composition, filled diamond at Library; multiplicity Library "1" — "1..*" Bookshelf. (3) Incremental development / evolutionary prototyping.</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 1</h2>
<ol>
<li><strong>Mô hình là một góc nhìn giản lược</strong> phục vụ một mục đích; COMET dựng ba mô hình nối tiếp: yêu cầu (use case) → phân tích (tĩnh + động) → thiết kế (kiến trúc).</li>
<li><strong>Nhận ra sơ đồ qua hình dạng</strong>: bầu dục + actor = use case; hộp ba ngăn = class; đường đời = sequence; đường nối + số 1, 1.1 = communication; trạng thái bo góc + sự kiện = state machine; nút khối 3 chiều = deployment.</li>
<li><strong>Sáu quan hệ giữa lớp</strong>: liên kết (nét liền), kết tập (◇ rỗng ở toàn thể), hợp thành (◆ đặc ở toàn thể), tổng quát hoá (▷ nét liền tới lớp cha), hiện thực hoá (▷ nét đứt tới interface), phụ thuộc (mũi tên nét đứt).</li>
<li><strong>Bội số đọc từ đầu bên kia</strong>: con số cạnh một lớp = một đối tượng phía bên kia có bao nhiêu đối tượng của lớp đó.</li>
<li><strong>Vòng đời</strong>: thác nước (yêu cầu ổn định, không thể hiện lặp) · làm mẫu bỏ đi (làm rõ giao diện rồi vứt) · tăng dần/tiến hoá (có phần chạy được sớm) · xoắn ốc (phân tích rủi ro mỗi vòng) · USDP (4 pha × nhiều vòng lặp). COMET dùng được với USDP hoặc xoắn ốc.</li>
<li><strong>Kết dính cao, ghép nối lỏng</strong>: mỗi lớp một mục đích; mối nối hẹp (interface) và tường minh (constructor), không bao giờ qua dữ liệu public.</li>
<li><strong>Che giấu thông tin</strong>: thiết kế interface trước, giấu cấu trúc dữ liệu cùng các luật của nó bên trong; nhờ vậy phần bên trong đổi thoải mái.</li>
<li><strong>Đồng bộ và bất đồng bộ</strong>: bên gửi chờ (mũi tên đặc + trả lời) hoặc đi tiếp (mũi tên hở, hàng đợi nằm giữa hai đối tượng chạy song song).</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm bài trắc nghiệm (quiz)</h3>
<ol>
<li>Hai sơ đồ UML nào thể hiện cùng một tương tác, và mỗi cái giúp đọc điều gì dễ hơn?</li>
<li>"A Library has many Bookshelves; a bookshelf cannot exist without its library." Quan hệ gì, và hình thoi nằm ở đâu?</li>
<li>Dự án phải cho người dùng thấy thứ chạy được sau sáu tuần và tiếp tục lớn dần. Chọn mô hình vòng đời nào?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) sequence (thứ tự thời gian) và communication (đường liên kết giữa các đối tượng). (2) Hợp thành, thoi đặc ở Library; bội số Library "1" — "1..*" Bookshelf. (3) Phát triển tăng dần / làm mẫu tiến hoá.</p>`),
  ].join('\n'),
};

/* ───────── Quiz (swd392-quiz-1) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'Which UML diagram shows the physical computers (nodes), the software artifacts installed on them and the network links between them?|||Sơ đồ UML nào thể hiện các máy vật lý (node), các artifact phần mềm cài trên chúng và đường mạng nối giữa chúng?',
      options: ['Class diagram|||Class diagram (sơ đồ lớp)', 'Package diagram|||Package diagram (sơ đồ gói)', 'Deployment diagram|||Deployment diagram (sơ đồ triển khai)', 'Communication diagram|||Communication diagram (sơ đồ giao tiếp)'],
      correctIndex: 2,
      points: 1,
      explanation: 'A deployment diagram draws 3-D nodes (phone, server, database host), the artifacts deployed on each, and the links labelled with protocols — the physical view of the architecture. D is tempting because it also has boxes joined by lines, but those boxes are objects exchanging numbered messages, not machines.|||Deployment diagram vẽ các node hình khối 3 chiều (điện thoại, máy chủ, máy CSDL), artifact triển khai trên từng node, và đường nối ghi giao thức — góc nhìn vật lý của kiến trúc. D dễ nhầm vì cũng có hộp nối bằng đường, nhưng hộp đó là đối tượng trao đổi thông điệp đánh số, không phải máy.' },
    { id: 'q2',
      question: 'Read this class diagram fragment. Which statement is correct?|||Đọc đoạn class diagram này. Phát biểu nào đúng?',
      code: `class Station
class Dock
Station "1" *-- "4..20" Dock`,
      codeLang: 'plantuml',
      options: ['A station has 4 to 20 docks; each dock belongs to exactly one station and is deleted with it|||Một trạm có 4 đến 20 ngàm; mỗi ngàm thuộc đúng một trạm và bị xoá cùng trạm', 'A dock has 4 to 20 stations; each station belongs to exactly one dock|||Một ngàm có 4 đến 20 trạm; mỗi trạm thuộc đúng một ngàm', 'A station has 4 to 20 docks; a dock can move to another station because the link is an aggregation|||Một trạm có 4 đến 20 ngàm; ngàm chuyển được sang trạm khác vì đây là kết tập', 'A station has exactly one dock, which may be shared by 4 to 20 stations|||Một trạm có đúng một ngàm, dùng chung cho 4 đến 20 trạm'],
      correctIndex: 0,
      points: 1,
      explanation: '*-- is composition (filled diamond at Station, the whole): parts live and die with their whole. Multiplicity is read from the far end — the 4..20 written next to Dock says how many docks one station has. C is tempting because the numbers are read correctly, but it names the relationship aggregation (o--, hollow diamond); B reads the ends the wrong way round.|||*-- là hợp thành (thoi đặc ở Station, phía toàn thể): bộ phận sống và chết cùng toàn thể. Bội số đọc từ đầu bên kia — số 4..20 đứng cạnh Dock cho biết một trạm có bao nhiêu ngàm. C dễ nhầm vì đọc số đúng, nhưng gọi sai thành kết tập (o--, thoi rỗng); B đọc ngược hai đầu.' },
    { id: 'q3',
      question: 'Compared with a sequence diagram of the same interaction, a communication diagram…|||So với sequence diagram của cùng một tương tác, communication diagram…',
      options: ['shows a different interaction, because it cannot show messages|||thể hiện một tương tác khác, vì nó không vẽ được thông điệp', 'shows the links between the objects, and gives the order of messages only by their sequence numbers|||thể hiện các đường liên kết giữa đối tượng, và cho biết thứ tự thông điệp chỉ bằng số thứ tự', 'shows the states of one object and the events that change them|||thể hiện các trạng thái của một đối tượng và các sự kiện làm nó đổi trạng thái', 'is used only in the design model, while sequence diagrams belong to the requirements model|||chỉ dùng trong mô hình thiết kế, còn sequence diagram thuộc mô hình yêu cầu'],
      correctIndex: 1,
      points: 1,
      explanation: 'Both are interaction diagrams carrying the same objects and messages. The sequence diagram makes time order visible (top to bottom); the communication diagram makes the links visible and needs numbers such as 1, 1.1, 1.2 to show order. C describes a state machine. D is false: in COMET both appear in the dynamic part of the analysis model.|||Cả hai là sơ đồ tương tác mang cùng các đối tượng và thông điệp. Sequence diagram làm lộ thứ tự thời gian (trên xuống dưới); communication diagram làm lộ các đường liên kết và cần số như 1, 1.1, 1.2 để thể hiện thứ tự. C là state machine. D sai: trong COMET cả hai đều nằm ở phần động của mô hình phân tích.' },
    { id: 'q4',
      question: 'In a class diagram, {ordered} is written next to the end of an association to say that the linked objects are kept in order. Which UML extension mechanism is this?|||Trong class diagram, {ordered} được ghi cạnh một đầu liên kết để nói các đối tượng được nối giữ theo thứ tự. Đây là cơ chế mở rộng UML nào?',
      options: ['A stereotype|||Một stereotype (khuôn mẫu)', 'A tagged value|||Một tagged value (giá trị gắn thẻ)', 'A constraint|||Một constraint (ràng buộc)', 'A note|||Một note (ghi chú)'],
      correctIndex: 2,
      points: 1,
      explanation: 'UML has three extension mechanisms: stereotypes in guillemets («entity»), tagged values as {tag = value} (e.g. {version = 1.2}), and constraints as a condition in braces that must hold ({ordered}, {xor}). A is wrong because stereotypes use « », not braces. B is tempting because both use braces, but a tagged value has the form name = value; {ordered} states a rule, so it is a constraint.|||UML có ba cơ chế mở rộng: stereotype trong dấu « » («entity»), tagged value dạng {tag = value} (vd {version = 1.2}), và constraint là một điều kiện trong ngoặc nhọn phải luôn đúng ({ordered}, {xor}). A sai vì stereotype dùng « », không dùng ngoặc nhọn. B dễ nhầm vì cũng dùng ngoặc nhọn, nhưng tagged value có dạng tên = giá trị; {ordered} phát biểu một luật nên là constraint.' },
    { id: 'q5',
      question: 'According to the school slides, what is the main limitation of the waterfall life cycle model?|||Theo slide của trường, hạn chế chính của mô hình vòng đời thác nước là gì?',
      options: ['It cannot be used together with UML|||Nó không dùng chung được với UML', 'It needs a working prototype before requirements are written|||Nó cần một bản mẫu chạy được trước khi viết yêu cầu', 'It spends too much of every cycle on risk analysis|||Nó tốn quá nhiều thời gian mỗi vòng cho phân tích rủi ro', 'It does not show iteration: requirements are fixed early, so late changes are expensive and users see the system late|||Nó không thể hiện vòng lặp: yêu cầu bị chốt sớm nên thay đổi muộn rất tốn kém và người dùng thấy hệ thống muộn'],
      correctIndex: 3,
      points: 1,
      explanation: 'The slide title is literally "Limitations of the Waterfall Model — does not show iteration in software life cycle": phases run once in order, so requirement errors are discovered late. C describes the spiral model, where risk analysis is part of every cycle; B mixes up waterfall with prototyping.|||Tiêu đề slide ghi đúng "Limitations of the Waterfall Model — does not show iteration in software life cycle": các pha chạy một lần theo thứ tự, nên lỗi yêu cầu bị phát hiện muộn. C là đặc điểm của mô hình xoắn ốc, nơi phân tích rủi ro nằm trong mỗi vòng; B lẫn thác nước với làm mẫu.' },
    { id: 'q6',
      question: 'A team quickly builds screens with fake data to find out what the users really want, collects feedback, and then discards those screens before building the real system. This is…|||Một nhóm dựng nhanh vài màn hình với dữ liệu giả để tìm hiểu người dùng thật sự muốn gì, thu phản hồi, rồi bỏ các màn hình đó trước khi xây hệ thống thật. Đây là…',
      options: ['Throwaway prototyping|||Làm mẫu bỏ đi (throwaway prototyping)', 'Evolutionary prototyping|||Làm mẫu tiến hoá (evolutionary prototyping)', 'Incremental development|||Phát triển tăng dần (incremental development)', 'The waterfall model|||Mô hình thác nước (waterfall)'],
      correctIndex: 0,
      points: 1,
      explanation: 'A throwaway prototype clarifies requirements — especially a complex user interface — and breaks the communication barrier with users; then it is thrown away. B is the tempting one: an evolutionary prototype is also built early, but it is kept and grows through operational versions into the delivered system — the opposite of "discard".|||Bản mẫu bỏ đi dùng để làm rõ yêu cầu — nhất là giao diện phức tạp — và phá rào cản giao tiếp với người dùng; xong thì vứt. B là phương án dễ nhầm: bản mẫu tiến hoá cũng làm sớm, nhưng được giữ lại và lớn dần qua các phiên bản chạy được thành hệ thống giao nộp — ngược hẳn với "bỏ đi".' },
    { id: 'q7',
      question: "In Boehm's spiral model shown in the slides, what does the radial coordinate (the distance from the centre) represent?|||Trong mô hình xoắn ốc của Boehm trên slide, toạ độ bán kính (khoảng cách tới tâm) biểu diễn điều gì?",
      options: ['Calendar time|||Thời gian theo lịch', 'Cumulative cost|||Chi phí tích luỹ', 'The level of risk|||Mức độ rủi ro', 'The number of features delivered|||Số tính năng đã giao'],
      correctIndex: 1,
      points: 1,
      explanation: 'The slide says "the radial coordinate represents cost": each turn of the spiral adds cost, while the angle shows the progress through the four quadrants (objectives, risk analysis, development, planning of the next cycle). C is tempting because risk drives the spiral, but risk analysis is one quadrant, not the radius.|||Slide ghi "the radial coordinate represents cost": mỗi vòng xoắn cộng thêm chi phí, còn góc cho biết tiến độ qua bốn góc phần tư (mục tiêu, phân tích rủi ro, phát triển, lập kế hoạch vòng sau). C dễ nhầm vì rủi ro dẫn dắt vòng xoắn, nhưng phân tích rủi ro là một góc phần tư, không phải bán kính.' },
    { id: 'q8',
      question: 'CheckingAccount and SavingsAccount specialize Account (generalization/specialization). What does this program print?|||CheckingAccount và SavingsAccount chuyên biệt hoá Account (tổng quát hoá/chuyên biệt hoá). Chương trình này in ra gì?',
      code: `static abstract class Account {
    double balance = 100;
    String type() { return "Account"; }
    double fee() { return 0; }
}
static class CheckingAccount extends Account {
    String type() { return "Checking"; }
    double fee() { return 2; }
}
static class SavingsAccount extends Account {
    String type() { return "Savings"; }
}

public static void main(String[] args) {
    Account[] accounts = { new CheckingAccount(), new SavingsAccount() };
    StringJoiner out = new StringJoiner(" ");
    for (Account a : accounts) out.add(a.type() + ":" + (a.balance - a.fee()));
    System.out.println(out);
}`,
      codeLang: 'java',
      options: ['Account:100.0 Account:100.0|||Account:100.0 Account:100.0', 'Checking:100.0 Savings:100.0|||Checking:100.0 Savings:100.0', 'Checking:98.0 Savings:100.0|||Checking:98.0 Savings:100.0', 'Checking:98.0 Savings:98.0|||Checking:98.0 Savings:98.0'],
      correctIndex: 2,
      points: 1,
      explanation: 'The variable type is Account, but the object decides which operation runs (polymorphism). CheckingAccount overrides both type() and fee(), so it prints Checking and 100 - 2 = 98.0. SavingsAccount overrides only type(), so it inherits fee() = 0 from Account: 100.0. A is the classic mistake of thinking the declared type Account chooses the method; D wrongly assumes the fee is inherited from the sibling class.|||Kiểu biến là Account, nhưng chính đối tượng quyết định thao tác nào chạy (đa hình). CheckingAccount ghi đè cả type() lẫn fee(), nên in Checking và 100 - 2 = 98.0. SavingsAccount chỉ ghi đè type(), nên kế thừa fee() = 0 của Account: 100.0. A là lỗi kinh điển khi nghĩ kiểu khai báo Account chọn phương thức; D nhầm rằng phí được kế thừa từ lớp anh em.' },
    { id: 'q9',
      question: 'A class exposes its internal array and counter as public fields, and several clients update them directly. Which change applies information hiding?|||Một lớp để lộ mảng và bộ đếm bên trong thành thuộc tính public, và nhiều client sửa trực tiếp chúng. Thay đổi nào áp dụng đúng nguyên lý che giấu thông tin?',
      options: ['Make the array and counter private and offer operations such as join(rider) and next() that enforce the rules|||Để mảng và bộ đếm private, đưa ra các thao tác như join(rider) và next() tự kiểm các luật', 'Keep the fields but add a public getter and setter for each one|||Giữ các thuộc tính nhưng thêm getter và setter public cho từng cái', 'Declare the class final so that nobody can extend it|||Khai báo lớp là final để không ai kế thừa được', 'Add a comment asking clients not to change the counter|||Thêm chú thích nhắc client đừng sửa bộ đếm'],
      correctIndex: 0,
      points: 1,
      explanation: 'Information hiding hides a design decision likely to change — here the data structure — behind an interface of meaningful operations, and keeps the rules next to the data. Then the array can become a queue without touching clients. B is tempting because the fields become private, but setCount(7) still lets any client break the object: raw access is not hiding.|||Che giấu thông tin là giấu một quyết định thiết kế dễ thay đổi — ở đây là cấu trúc dữ liệu — sau một interface gồm các thao tác có nghĩa, và giữ luật ngay cạnh dữ liệu. Khi đó mảng đổi thành hàng đợi mà client không phải sửa. B dễ nhầm vì thuộc tính thành private, nhưng setCount(7) vẫn cho mọi client phá đối tượng: truy cập thô không phải là che giấu.' },
    { id: 'q10',
      question: 'A sensor object sends an event and continues immediately; the event waits in a queue until a logger object, running in its own thread, takes it. Which kind of communication is this?|||Một đối tượng cảm biến gửi một sự kiện rồi đi tiếp ngay; sự kiện nằm chờ trong hàng đợi cho tới khi đối tượng ghi nhật ký, chạy trên luồng riêng, lấy nó ra. Đây là kiểu giao tiếp nào?',
      options: ['Tightly coupled (synchronous) message communication with reply|||Giao tiếp thông điệp ghép chặt (đồng bộ) có trả lời', 'A dependency relationship between two classes|||Một quan hệ phụ thuộc giữa hai lớp', 'Synchronous communication without reply|||Giao tiếp đồng bộ không có trả lời', 'Loosely coupled (asynchronous) message communication|||Giao tiếp thông điệp ghép lỏng (bất đồng bộ)'],
      correctIndex: 3,
      points: 1,
      explanation: 'In the producer/consumer problem, asynchronous (loosely coupled) communication lets the producer continue without waiting; a queue buffers the messages between the two concurrent objects. C is tempting because there is no reply, but "synchronous" means the sender waits until the receiver accepts the message — here it does not wait at all. B is a static class relationship, not a kind of message.|||Trong bài toán producer/consumer, giao tiếp bất đồng bộ (ghép lỏng) cho bên sinh đi tiếp mà không chờ; một hàng đợi làm bộ đệm thông điệp giữa hai đối tượng chạy song song. C dễ nhầm vì không có trả lời, nhưng "đồng bộ" nghĩa là bên gửi phải chờ tới khi bên nhận nhận thông điệp — ở đây nó không chờ gì cả. B là quan hệ tĩnh giữa các lớp, không phải một kiểu thông điệp.' },
  ],
};

export default {
  slides: [L_swd2_1, L_swd3_1, L_swd3_2, L_swd4_1, L_swd4_2, L_swd5_1, L_swd5_2, L_swd6_1],
  practice: L_on_ch1,
  quiz: QUIZ,
  quizDescription: '10 câu lý thuyết kiểu FE/PT cho Chương 1: nhận ra sơ đồ triển khai, đọc bội số và hợp thành trên một đoạn PlantUML, so sánh sequence với communication diagram, ràng buộc {ordered} trong cơ chế mở rộng UML, điểm yếu của mô hình thác nước, bản mẫu bỏ đi, trục bán kính của mô hình xoắn ốc, đa hình khi gọi qua lớp cha (Java chạy thật), che giấu thông tin và thông điệp bất đồng bộ qua hàng đợi — mỗi câu có giải thích song ngữ vì sao đúng và vì sao phương án dễ nhầm nhất lại sai.',
};
