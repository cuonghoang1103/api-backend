/**
 * SWD392 · Mục 0 — giới thiệu môn (Chapter 0 Course Introduction).
 * Bài 📑 học theo từng slide: swd1 (Chapter_0-Course_Introduction.pptx, slide 1–8).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/SWD392/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node SWD392/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 0.A — 📑 Slide by slide · Chapter 0 Course Introduction: the textbook, the 24 chapters and how you are graded ───────── */
const L_swd1_1 = {
  title: '0.A — 📑 Slide by slide · Chapter 0 Course Introduction: the textbook, the 24 chapters and how you are graded|||0.A — 📑 Học theo từng slide · Chapter 0 Giới thiệu môn: giáo trình, 24 chương và cách chấm điểm',
  slug: 'swd392-slide-swd1-1',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Giảng đủ 8 slide Chapter 0 của trường: giáo trình Gomaa và phương pháp COMET, 6 loại kiến trúc, 4 case study, mục lục Part I–IV (kèm sơ đồ lộ trình PlantUML dựng thật) và cách tính điểm SWD392 (kèm chương trình Java tính đậu/rớt).',
  content: [
    bi(`<p class="lead">This is the school's very first deck of SWD392, <em>Chapter 0 — Course Introduction</em> (8 slides). It tells you which book the whole course follows, what that book covers, and how your final grade is computed.</p>
<p>After this lesson you can: name the textbook and its method (COMET), place every later chapter on one roadmap, list the six families of architecture the course designs, and compute whether a given set of scores passes — including the rule most students forget.</p>`,
    `<p class="lead">Đây là bộ slide đầu tiên của môn SWD392 ở trường, <em>Chapter 0 — Course Introduction</em> (8 slide). Nó cho biết cả môn bám theo cuốn sách nào, cuốn sách đó dạy gì, và điểm tổng kết của bạn được tính ra sao.</p>
<p>Học xong bài này bạn làm được: nói tên giáo trình và phương pháp của nó (COMET), đặt mọi chương phía sau lên một bản đồ lộ trình, kể sáu họ kiến trúc (architecture) mà môn sẽ thiết kế, và tự tính một bộ điểm có qua môn hay không — kể cả điều kiện mà sinh viên hay quên nhất.</p>`),
    walkHead('swd1', 1, 8),
    walk('swd1', [
      [1, 'Software Architecture and Design (SWD392)',
        `<p class="y-chinh">🎯 SWD392 = <strong>Software Architecture and Design</strong>: designing systems too big for one person, before writing the code.</p>
<p>The syllabus (ID 14179, 3 credits) describes the course as "concepts and methods for the architectural design of software systems of sufficient size and complexity to require the effort of several people for many months". You learn fundamental design concepts and notations (UML), compare several design methods, and design a relatively complex system in a small team (the Course Project).</p>
<p>Prerequisites are <strong>SWE201c/SWE202c</strong> (software engineering) and <strong>PRO192</strong> (OOP in Java) — you should already be comfortable with classes, inheritance and interfaces.</p>
<p class="meo">🧠 Architecture = the big decisions that are expensive to change later (how the system is split, how the parts talk). Design = everything inside those parts.</p>`,
        `<p class="y-chinh">🎯 SWD392 = <strong>Kiến trúc và thiết kế phần mềm</strong>: thiết kế những hệ thống quá lớn cho một người, TRƯỚC khi viết code.</p>
<p>Đề cương (mã 14179, 3 tín chỉ) mô tả môn là "khái niệm và phương pháp thiết kế kiến trúc (architectural design) cho hệ thống phần mềm đủ lớn và phức tạp tới mức cần nhiều người làm nhiều tháng". Bạn học các khái niệm và ký hiệu thiết kế nền tảng (UML — ngôn ngữ mô hình hoá thống nhất), so sánh vài phương pháp thiết kế, và cùng nhóm nhỏ thiết kế một hệ thống khá phức tạp (Course Project — đồ án môn).</p>
<p>Môn tiên quyết là <strong>SWE201c/SWE202c</strong> (kỹ nghệ phần mềm) và <strong>PRO192</strong> (lập trình hướng đối tượng bằng Java) — bạn cần quen lớp (class), kế thừa (inheritance) và interface.</p>
<p class="meo">🧠 Kiến trúc = những quyết định lớn, sau này đổi rất tốn kém (hệ thống chia thành phần nào, các phần nói chuyện với nhau ra sao). Thiết kế = mọi thứ bên trong từng phần đó.</p>`],
      [2, 'Book Overview — method and approach',
        `<p class="y-chinh">🎯 The whole course follows ONE book: Hassan Gomaa, <em>Software Modeling and Design</em> — a use-case–driven, UML-based method.</p>
<p><strong>Use case–driven</strong> means everything starts from what users want to do with the system (use cases); every later model is derived from and checked against them. <strong>UML-based</strong> means every model is drawn in the standard UML notation, so any engineer can read it.</p>
<p>Gomaa names his method <strong>COMET</strong> (Collaborative Object Modeling and architectural design mEThod). It is a "unified approach": the same steps take you from requirements, through analysis, to the software architecture — the slide's "covers modeling + design process".</p>
<p>The syllabus also lists Fowler's <em>UML Distilled</em> (for notation) and the GoF book <em>Design Patterns</em> (for Chapter 4 on this site).</p>
<div class="pitfall">⚠️ Exam trap: "COMET is a programming language / a tool". No — it is a <em>method</em> (a sequence of modeling steps). The tool can be Visual Paradigm, draw.io or PlantUML.</div>`,
        `<p class="y-chinh">🎯 Cả môn bám theo MỘT cuốn sách: Hassan Gomaa, <em>Software Modeling and Design</em> — phương pháp dẫn dắt bởi use case (use case–driven), dựa trên UML.</p>
<p><strong>Use case–driven</strong> (dẫn dắt bởi use case) nghĩa là mọi thứ bắt đầu từ việc người dùng muốn làm gì với hệ thống (use case — ca sử dụng); mọi mô hình phía sau đều suy ra từ đó và được đối chiếu lại với chúng. <strong>UML-based</strong> (dựa trên UML) nghĩa là mọi mô hình đều vẽ bằng ký hiệu UML chuẩn, kỹ sư nào cũng đọc được.</p>
<p>Gomaa đặt tên phương pháp của mình là <strong>COMET</strong> (Collaborative Object Modeling and architectural design mEThod — phương pháp mô hình hoá đối tượng cộng tác và thiết kế kiến trúc). Đây là "cách tiếp cận thống nhất" (unified approach): cùng một chuỗi bước đưa bạn từ yêu cầu, qua phân tích, tới kiến trúc phần mềm — đúng ý "covers modeling + design process" trên slide.</p>
<p>Đề cương còn liệt kê <em>UML Distilled</em> của Fowler (tra ký hiệu) và sách GoF <em>Design Patterns</em> (cho Chương 4 trên web này).</p>
<div class="pitfall">⚠️ Bẫy đề thi: "COMET là một ngôn ngữ lập trình / một công cụ". Sai — COMET là một <em>phương pháp</em> (một chuỗi bước mô hình hoá). Công cụ vẽ có thể là Visual Paradigm, draw.io hay PlantUML.</div>`],
      [3, 'Book Overview — architecture categories',
        `<p class="y-chinh">🎯 The book teaches six families of software architecture, each with its own design guidelines.</p>
<table>
<thead><tr><th>Architecture category</th><th>Core idea</th><th>Where in this course</th></tr></thead>
<tbody>
<tr><td>Object-oriented</td><td>classes and objects grouped into subsystems</td><td>school Ch.14</td></tr>
<tr><td>Client/Server</td><td>clients request, servers provide services</td><td>Ch.15 + Ch.21 case study</td></tr>
<tr><td>Service-oriented (SOA)</td><td>loosely coupled services with published interfaces</td><td>Ch.16 + Ch.22 case study</td></tr>
<tr><td>Component-based</td><td>deployable components with provided/required interfaces</td><td>Ch.17 + Ch.23 case study</td></tr>
<tr><td>Concurrent and real-time</td><td>many tasks running at once under timing limits</td><td>Ch.18 + Ch.24 case study</td></tr>
<tr><td>Software product line</td><td>a family of similar products sharing one architecture</td><td>Ch.19</td></tr>
</tbody>
</table>
<p>"Special considerations": each family gets tailored guidelines, the models always cover both <strong>structure</strong> (what the parts are) and <strong>behavior</strong> (how they interact over time), and designs are judged by reusability, scalability and <strong>quality attributes</strong> (Ch.20).</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): LabFlow AI (Spring Boot + React + PostgreSQL) is a <em>client/server</em> system — the React app is the client, the Spring Boot API is the server — and inside the server it is <em>object-oriented and layered</em> (controller → service → repository).</div>`,
        `<p class="y-chinh">🎯 Sách dạy sáu họ kiến trúc phần mềm, mỗi họ có bộ hướng dẫn thiết kế riêng.</p>
<table>
<thead><tr><th>Loại kiến trúc</th><th>Ý chính</th><th>Học ở đâu trong môn</th></tr></thead>
<tbody>
<tr><td>Object-oriented (hướng đối tượng)</td><td>lớp và đối tượng gom thành các hệ con (subsystem)</td><td>Chương 14 của trường</td></tr>
<tr><td>Client/Server (khách/chủ)</td><td>client gửi yêu cầu, server cung cấp dịch vụ</td><td>Ch.15 + case study Ch.21</td></tr>
<tr><td>Service-oriented — SOA (hướng dịch vụ)</td><td>các dịch vụ ghép lỏng, giao diện công bố rõ</td><td>Ch.16 + case study Ch.22</td></tr>
<tr><td>Component-based (dựa trên thành phần)</td><td>thành phần triển khai độc lập, có giao diện cung cấp/yêu cầu</td><td>Ch.17 + case study Ch.23</td></tr>
<tr><td>Concurrent and real-time (đồng thời, thời gian thực)</td><td>nhiều tác vụ chạy cùng lúc dưới ràng buộc thời gian</td><td>Ch.18 + case study Ch.24</td></tr>
<tr><td>Software product line (dòng sản phẩm)</td><td>một họ sản phẩm giống nhau dùng chung một kiến trúc</td><td>Ch.19</td></tr>
</tbody>
</table>
<p>"Special considerations" (lưu ý riêng): mỗi họ có hướng dẫn riêng; mô hình luôn phủ cả <strong>cấu trúc</strong> (structure — gồm những phần nào) lẫn <strong>hành vi</strong> (behavior — các phần tương tác theo thời gian ra sao); thiết kế được đánh giá theo khả năng tái sử dụng (reusability), khả năng mở rộng (scalability) và các <strong>thuộc tính chất lượng</strong> (quality attributes — Ch.20).</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): LabFlow AI (Spring Boot + React + PostgreSQL) là hệ <em>client/server</em> — app React là client, API Spring Boot là server — còn bên trong server là kiến trúc <em>hướng đối tượng, phân tầng</em> (controller → service → repository).</div>`],
      [4, 'Book Overview — case studies',
        `<p class="y-chinh">🎯 Four full case studies show each architecture family applied end to end — and each one has its own deck in this course.</p>
<table>
<thead><tr><th>Case study</th><th>Architecture</th><th>School deck</th></tr></thead>
<tbody>
<tr><td>Banking System</td><td>client/server</td><td>Ch.21</td></tr>
<tr><td>Online Shopping System</td><td>service-oriented (SOA)</td><td>Ch.22</td></tr>
<tr><td>Emergency Monitoring System</td><td>distributed component-based</td><td>Ch.23</td></tr>
<tr><td>Automated Guided Vehicle System</td><td>real-time</td><td>Ch.24</td></tr>
</tbody>
</table>
<p>A case study walks the <em>same</em> COMET steps you learn in Ch.6–11 (use cases → analysis model) and then Ch.12–18 (architecture) on one realistic system. Read them as worked examples: when you design your Course Project, copy their structure, not their content.</p>
<p class="meo">🧠 Pair them: Bank ↔ client/server, Shop ↔ services, Emergency ↔ components, Vehicle ↔ real-time.</p>`,
        `<p class="y-chinh">🎯 Bốn case study (nghiên cứu tình huống) đầy đủ cho thấy từng họ kiến trúc được áp dụng từ đầu tới cuối — và mỗi case có bộ slide riêng trong môn.</p>
<table>
<thead><tr><th>Case study</th><th>Kiến trúc</th><th>Bộ slide của trường</th></tr></thead>
<tbody>
<tr><td>Banking System (hệ thống ngân hàng)</td><td>client/server</td><td>Ch.21</td></tr>
<tr><td>Online Shopping System (mua sắm trực tuyến)</td><td>hướng dịch vụ (SOA)</td><td>Ch.22</td></tr>
<tr><td>Emergency Monitoring System (giám sát khẩn cấp)</td><td>dựa trên thành phần, phân tán</td><td>Ch.23</td></tr>
<tr><td>Automated Guided Vehicle System (xe tự hành)</td><td>thời gian thực</td><td>Ch.24</td></tr>
</tbody>
</table>
<p>Mỗi case study đi lại <em>đúng</em> các bước COMET bạn học ở Ch.6–11 (use case → mô hình phân tích) rồi Ch.12–18 (kiến trúc) trên một hệ thống thực tế. Hãy đọc chúng như bài giải mẫu: khi làm Course Project, bắt chước cách chúng tổ chức, đừng chép nội dung.</p>
<p class="meo">🧠 Ghép cặp cho nhớ: Ngân hàng ↔ client/server, Cửa hàng ↔ dịch vụ, Khẩn cấp ↔ thành phần, Xe tự hành ↔ thời gian thực.</p>`],
      [5, 'Content — Part I Overview',
        `<p class="y-chinh">🎯 Part I (Chapters 1–5) gives the vocabulary: what design is, the UML notation, life-cycle processes, design concepts, and the COMET method in one picture.</p>
<ul>
<li><strong>Ch.1 Introduction</strong> — software design, modeling and architecture; why models.</li>
<li><strong>Ch.2 Overview of the UML Notation</strong> — use case, class, sequence, state machine, deployment… diagrams.</li>
<li><strong>Ch.3 Software Life Cycle Models and Processes</strong> — waterfall, iterative, Unified Process, and where COMET fits.</li>
<li><strong>Ch.4 Software Design and Architecture Concepts</strong> — abstraction, information hiding, coupling and cohesion, concurrency.</li>
<li><strong>Ch.5 Overview of Software Modeling and Design Method</strong> — the COMET steps end to end.</li>
</ul>
<p>On this website these five decks form <em>Chapter 1 — Design fundamentals &amp; UML</em>.</p>`,
        `<p class="y-chinh">🎯 Part I (Chương 1–5) cho bạn bộ từ vựng: thiết kế là gì, ký hiệu UML, quy trình vòng đời, các khái niệm thiết kế, và cả phương pháp COMET trong một hình.</p>
<ul>
<li><strong>Ch.1 Introduction</strong> (giới thiệu) — thiết kế, mô hình hoá (modeling) và kiến trúc phần mềm; vì sao cần mô hình.</li>
<li><strong>Ch.2 Overview of the UML Notation</strong> (tổng quan ký hiệu UML) — sơ đồ use case, lớp (class), tuần tự (sequence), máy trạng thái (state machine), triển khai (deployment)…</li>
<li><strong>Ch.3 Software Life Cycle Models and Processes</strong> (mô hình vòng đời &amp; quy trình) — thác nước (waterfall), lặp (iterative), Unified Process, và COMET nằm ở đâu.</li>
<li><strong>Ch.4 Software Design and Architecture Concepts</strong> (khái niệm thiết kế &amp; kiến trúc) — trừu tượng hoá (abstraction), che giấu thông tin (information hiding), độ ghép (coupling) và độ kết dính (cohesion), đồng thời (concurrency).</li>
<li><strong>Ch.5 Overview of Software Modeling and Design Method</strong> (tổng quan phương pháp) — các bước COMET từ đầu tới cuối.</li>
</ul>
<p>Trên web này, năm bộ slide đó ghép thành <em>Chương 1 — Nền tảng thiết kế &amp; UML</em>.</p>`],
      [6, 'Content — Part II Software Modeling',
        `<p class="y-chinh">🎯 Part II (Chapters 6–11) is the <strong>analysis model</strong>: you describe the problem precisely before choosing an architecture.</p>
<ul>
<li><strong>Ch.6 Use Case Modeling</strong> — actors, use cases, use case descriptions (the requirements model).</li>
<li><strong>Ch.7 Static Modeling</strong> — classes, attributes, associations and multiplicity.</li>
<li><strong>Ch.8 Object and Class Structuring</strong> — sorting classes into boundary, control and entity objects.</li>
<li><strong>Ch.9 Dynamic Interaction Modeling</strong> — communication/sequence diagrams per use case.</li>
<li><strong>Ch.10 Finite State Machines</strong> — statecharts for objects whose behavior depends on their state.</li>
<li><strong>Ch.11 State-Dependent Dynamic Interaction Modeling</strong> — interactions driven by a state machine.</li>
</ul>
<p>This is the heart of the Progress Tests and of Assignments 01–02 (UC model, analysis model). On this website: <em>Chapter 2 — Requirements &amp; analysis modeling (COMET)</em>.</p>`,
        `<p class="y-chinh">🎯 Part II (Chương 6–11) là <strong>mô hình phân tích</strong> (analysis model): mô tả bài toán thật chính xác TRƯỚC khi chọn kiến trúc.</p>
<ul>
<li><strong>Ch.6 Use Case Modeling</strong> (mô hình use case) — tác nhân (actor), use case, đặc tả use case (use case description) — tức mô hình yêu cầu.</li>
<li><strong>Ch.7 Static Modeling</strong> (mô hình tĩnh) — lớp, thuộc tính, liên kết (association) và bội số (multiplicity).</li>
<li><strong>Ch.8 Object and Class Structuring</strong> (cấu trúc hoá đối tượng &amp; lớp) — xếp lớp vào ba loại: biên (boundary), điều khiển (control), thực thể (entity).</li>
<li><strong>Ch.9 Dynamic Interaction Modeling</strong> (mô hình tương tác động) — sơ đồ giao tiếp/tuần tự cho từng use case.</li>
<li><strong>Ch.10 Finite State Machines</strong> (máy trạng thái hữu hạn) — statechart cho đối tượng có hành vi phụ thuộc trạng thái.</li>
<li><strong>Ch.11 State-Dependent Dynamic Interaction Modeling</strong> (tương tác phụ thuộc trạng thái) — tương tác do một máy trạng thái điều khiển.</li>
</ul>
<p>Đây là trọng tâm của các Progress Test và Assignment 01–02 (mô hình UC, mô hình phân tích). Trên web này: <em>Chương 2 — Mô hình yêu cầu &amp; phân tích (COMET)</em>.</p>`],
      [7, 'Content — Part III Architectural Design',
        `<p class="y-chinh">🎯 Part III turns the analysis model into a <strong>software architecture</strong>; Part IV repeats everything on four case studies. The diagram below is the whole course on one page.</p>
<p>Listed on the slide: Ch.12 overview of architectures, Ch.14–19 one chapter per architecture family, Ch.20 quality attributes, then Part IV (Ch.21–24). Notice the slide <strong>skips Ch.13</strong> (Software Subsystem Architectural Design) — it is still taught (sessions 26–29 of the syllabus, its own deck), so do not skip it. Ch.19 (product lines) has no deck of its own in this semester's schedule.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4979e818996c15020a6923e1ea603114ad089ce8.svg" alt="The COMET roadmap: every school chapter placed on one flow (PlantUML, rendered for real)" loading="lazy" /><p class="chu-thich">🧩 The COMET roadmap: every school chapter placed on one flow (PlantUML, rendered for real)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title COMET roadmap of SWD392 — from requirements to architecture
' Part II of Gomaa's book = the analysis model
start
:Requirements modeling\\n(Ch.6 Use case modeling);
note right: actors + use cases\\n+ use case descriptions
partition "Analysis modeling (Part II)" {
  :Static modeling\\n(Ch.7);
  :Object &amp; class structuring\\n(Ch.8);
  :Dynamic interaction modeling\\n(Ch.9, Ch.11);
  :Finite state machines\\n(Ch.10);
}
partition "Design modeling (Part III)" {
  :Overall software architecture\\n(Ch.12–13 subsystems);
  :Architecture style per system type\\n(Ch.14–19: OO, client/server,\\nSOA, component, real-time, product line);
  :Check quality attributes\\n(Ch.20);
}
:Case studies (Part IV)\\nCh.21–24;
stop
@enduml</code></pre></details>
<p class="meo">🧠 Three models, in order: <strong>requirements</strong> (use cases) → <strong>analysis</strong> (Part II) → <strong>design</strong> (Part III). Almost every theory question asks "which model does X belong to?".</p>`,
        `<p class="y-chinh">🎯 Part III biến mô hình phân tích thành <strong>kiến trúc phần mềm</strong>; Part IV làm lại tất cả trên bốn case study. Sơ đồ dưới là cả môn học trong một trang.</p>
<p>Slide liệt kê: Ch.12 tổng quan kiến trúc, Ch.14–19 mỗi chương một họ kiến trúc, Ch.20 thuộc tính chất lượng, rồi Part IV (Ch.21–24). Để ý slide <strong>bỏ sót Ch.13</strong> (Software Subsystem Architectural Design — thiết kế kiến trúc hệ con) — chương này vẫn được dạy (buổi 26–29 trong đề cương, có bộ slide riêng), đừng bỏ qua. Ch.19 (dòng sản phẩm) không có bộ slide riêng trong lịch học kỳ này.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/4979e818996c15020a6923e1ea603114ad089ce8.svg" alt="Lộ trình COMET: mọi chương của trường đặt trên một luồng (PlantUML dựng thật)" loading="lazy" /><p class="chu-thich">🧩 Lộ trình COMET: mọi chương của trường đặt trên một luồng (PlantUML dựng thật)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title COMET roadmap of SWD392 — from requirements to architecture
' Phần II của sách Gomaa = mô hình phân tích
start
:Requirements modeling\\n(Ch.6 Use case modeling);
note right: actors + use cases\\n+ use case descriptions
partition "Analysis modeling (Part II)" {
  :Static modeling\\n(Ch.7);
  :Object &amp; class structuring\\n(Ch.8);
  :Dynamic interaction modeling\\n(Ch.9, Ch.11);
  :Finite state machines\\n(Ch.10);
}
partition "Design modeling (Part III)" {
  :Overall software architecture\\n(Ch.12–13 subsystems);
  :Architecture style per system type\\n(Ch.14–19: OO, client/server,\\nSOA, component, real-time, product line);
  :Check quality attributes\\n(Ch.20);
}
:Case studies (Part IV)\\nCh.21–24;
stop
@enduml</code></pre></details>
<p class="meo">🧠 Ba mô hình, đúng thứ tự: <strong>yêu cầu</strong> (requirements — use case) → <strong>phân tích</strong> (analysis — Part II) → <strong>thiết kế</strong> (design — Part III). Gần như câu lý thuyết nào cũng hỏi "X thuộc mô hình nào?".</p>`],
      [8, 'Evaluate — grading and completion criteria',
        `<p class="y-chinh">🎯 Ongoing 40% (3 progress tests 15% + 1 project 25%) + Final Exam 60% (PE 20% + TE 40%); you pass only if EVERY condition holds.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/42ce210a567faf3fed12a50e0296ee98a2a81103.svg" alt="SWD392 grading — components and pass conditions" loading="lazy" /><p class="chu-thich">🧩 SWD392 grading — components and pass conditions</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title SWD392 grading — components and pass conditions
' A WBS diagram would also work; a class-like tree keeps the weights readable
rectangle "Final Result 100%\\n(pass: &gt;= 5)" as FR
rectangle "Ongoing assessment 40%" as OA
rectangle "Final Exam 60%\\n(pass: &gt;= 4)" as FE
rectangle "3 Progress tests\\n15% · avg &gt; 0" as PT
rectangle "1 Course Project\\n25% · pass &gt;= 5" as PJ
rectangle "PE — Practical Exam\\n20%, 85 minutes" as PE
rectangle "TE — Theory Exam\\n40%, 60 minutes" as TE
FR -down-&gt; OA
FR -down-&gt; FE
OA -down-&gt; PT
OA -down-&gt; PJ
FE -down-&gt; PE
FE -down-&gt; TE
@enduml</code></pre></details>
<p>Completion criteria on the slide: progress-test average &gt; 0 (i.e. do not miss them all), project ≥ 5, final exam ≥ 4 and final result ≥ 5. The syllabus table is stricter: PE and TE each carry a completion mark of 4. The program below applies all rules to five students — the output is from really running it.</p>
<pre><code class="language-java">import java.util.List;

/** Slide 8 "Evaluate" as code: weights + completion criteria of SWD392 (syllabus 14179). */
public class KetQuaMon {
    record Student(String name, double[] progressTests, double project, double pe, double te) {}

    static double avg(double[] xs) {
        double s = 0;
        for (double x : xs) s += x;
        return xs.length == 0 ? 0 : s / xs.length;
    }

    static String verdict(Student s) {
        double pt = avg(s.progressTests());                    // 3 progress tests = 15%
        double finalExam = (s.pe() * 20 + s.te() * 40) / 60;   // Final Exam 60% = PE 20% + TE 40%
        double result = pt * 0.15 + s.project() * 0.25 + s.pe() * 0.20 + s.te() * 0.40;
        String why;
        if (pt &lt;= 0) why = "FAIL: progress test average must be &gt; 0";
        else if (s.project() &lt; 5) why = "FAIL: project must be &gt;= 5";
        else if (s.pe() &lt; 4 || s.te() &lt; 4) why = "FAIL: PE and TE must each be &gt;= 4";   // syllabus table
        else if (finalExam &lt; 4) why = "FAIL: final exam must be &gt;= 4";
        else if (result &lt; 5) why = "FAIL: final result must be &gt;= 5";
        else why = "PASS";
        return String.format("%-5s final exam %.2f | result %.2f -&gt; %s", s.name(), finalExam, result, why);
    }

    public static void main(String[] args) {
        List&lt;Student&gt; ss = List.of(
            new Student("An",   new double[]{7, 8, 6}, 8.0, 7.0, 6.5),
            new Student("Binh", new double[]{9, 9, 9}, 4.5, 9.0, 9.0),
            new Student("Chi",  new double[]{7, 7, 7}, 8.0, 9.0, 3.5),
            new Student("Dung", new double[]{0, 0, 0}, 9.0, 8.0, 8.0),
            new Student("Em",   new double[]{3, 4, 3}, 5.0, 5.0, 4.0));
        for (Student s : ss) System.out.println(verdict(s));
    }
}</code></pre>
<div class="out">An &nbsp;&nbsp;&nbsp;final exam 6.67 | result 7.05 -&gt; PASS<br>
Binh &nbsp;final exam 9.00 | result 7.88 -&gt; FAIL: project must be &gt;= 5<br>
Chi &nbsp;&nbsp;final exam 5.33 | result 6.25 -&gt; FAIL: PE and TE must each be &gt;= 4<br>
Dung &nbsp;final exam 8.00 | result 7.05 -&gt; FAIL: progress test average must be &gt; 0<br>
Em &nbsp;&nbsp;&nbsp;final exam 4.33 | result 4.35 -&gt; FAIL: final result must be &gt;= 5</div>
<div class="pitfall">⚠️ Look at Chi: result 6.25 and final exam 5.33, yet FAIL — the theory exam (3.5) is below 4. A high average never rescues a failed component. Binh fails too, with 9s everywhere, because the project is 4.5.</div>`,
        `<p class="y-chinh">🎯 Quá trình 40% (3 progress test 15% + 1 project 25%) + Thi cuối kỳ 60% (PE 20% + TE 40%); chỉ qua môn khi MỌI điều kiện đều đạt.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/42ce210a567faf3fed12a50e0296ee98a2a81103.svg" alt="SWD392 grading — components and pass conditions" loading="lazy" /><p class="chu-thich">🧩 SWD392 grading — components and pass conditions</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title SWD392 grading — components and pass conditions
' Có thể vẽ WBS; cây kiểu class dễ đọc trọng số hơn
rectangle "Final Result 100%\\n(pass: &gt;= 5)" as FR
rectangle "Ongoing assessment 40%" as OA
rectangle "Final Exam 60%\\n(pass: &gt;= 4)" as FE
rectangle "3 Progress tests\\n15% · avg &gt; 0" as PT
rectangle "1 Course Project\\n25% · pass &gt;= 5" as PJ
rectangle "PE — Practical Exam\\n20%, 85 minutes" as PE
rectangle "TE — Theory Exam\\n40%, 60 minutes" as TE
FR -down-&gt; OA
FR -down-&gt; FE
OA -down-&gt; PT
OA -down-&gt; PJ
FE -down-&gt; PE
FE -down-&gt; TE
@enduml</code></pre></details>
<p>Điều kiện hoàn thành (completion criteria) trên slide: trung bình progress test &gt; 0 (tức không được bỏ hết), project ≥ 5, điểm thi cuối ≥ 4 và điểm tổng kết ≥ 5. Bảng đánh giá trong đề cương còn chặt hơn: PE (thi thực hành) và TE (thi lý thuyết) MỖI phần có điểm liệt 4. Chương trình dưới áp mọi luật cho năm sinh viên — output là kết quả chạy thật.</p>
<pre><code class="language-java">import java.util.List;

/** Slide 8 "Evaluate" as code: weights + completion criteria of SWD392 (syllabus 14179). */
public class KetQuaMon {
    record Student(String name, double[] progressTests, double project, double pe, double te) {}

    static double avg(double[] xs) {
        double s = 0;
        for (double x : xs) s += x;
        return xs.length == 0 ? 0 : s / xs.length;
    }

    static String verdict(Student s) {
        double pt = avg(s.progressTests());                    // 3 bài progress test = 15%
        double finalExam = (s.pe() * 20 + s.te() * 40) / 60;   // Thi cuối 60% = PE 20% + TE 40%
        double result = pt * 0.15 + s.project() * 0.25 + s.pe() * 0.20 + s.te() * 0.40;
        String why;
        if (pt &lt;= 0) why = "FAIL: progress test average must be &gt; 0";
        else if (s.project() &lt; 5) why = "FAIL: project must be &gt;= 5";
        else if (s.pe() &lt; 4 || s.te() &lt; 4) why = "FAIL: PE and TE must each be &gt;= 4";   // bảng đánh giá của đề cương
        else if (finalExam &lt; 4) why = "FAIL: final exam must be &gt;= 4";
        else if (result &lt; 5) why = "FAIL: final result must be &gt;= 5";
        else why = "PASS";
        return String.format("%-5s final exam %.2f | result %.2f -&gt; %s", s.name(), finalExam, result, why);
    }

    public static void main(String[] args) {
        List&lt;Student&gt; ss = List.of(
            new Student("An",   new double[]{7, 8, 6}, 8.0, 7.0, 6.5),
            new Student("Binh", new double[]{9, 9, 9}, 4.5, 9.0, 9.0),
            new Student("Chi",  new double[]{7, 7, 7}, 8.0, 9.0, 3.5),
            new Student("Dung", new double[]{0, 0, 0}, 9.0, 8.0, 8.0),
            new Student("Em",   new double[]{3, 4, 3}, 5.0, 5.0, 4.0));
        for (Student s : ss) System.out.println(verdict(s));
    }
}</code></pre>
<div class="out">An &nbsp;&nbsp;&nbsp;final exam 6.67 | result 7.05 -&gt; PASS<br>
Binh &nbsp;final exam 9.00 | result 7.88 -&gt; FAIL: project must be &gt;= 5<br>
Chi &nbsp;&nbsp;final exam 5.33 | result 6.25 -&gt; FAIL: PE and TE must each be &gt;= 4<br>
Dung &nbsp;final exam 8.00 | result 7.05 -&gt; FAIL: progress test average must be &gt; 0<br>
Em &nbsp;&nbsp;&nbsp;final exam 4.33 | result 4.35 -&gt; FAIL: final result must be &gt;= 5</div>
<div class="pitfall">⚠️ Nhìn Chi: tổng kết 6.25, thi cuối 5.33 mà vẫn RỚT — vì lý thuyết (TE) chỉ 3.5, dưới 4. Điểm trung bình cao không cứu được một phần bị liệt. Bình cũng rớt dù toàn điểm 9, vì project chỉ 4.5.</div>`],
    ]),
    books([
      ['gomaa', 'Preface + Ch.1 (overview of the book and of COMET)', 'Lời nói đầu + Ch.1 (tổng quan sách và phương pháp COMET)'],
      ['fuSlides', 'Chapter 0 — Course Introduction (8 slides)', 'Chapter 0 — Course Introduction (8 slide)'],
    ]),
  ].join('\n'),
};

/* ───────── ⭐ Start here (1/2) — What SWD392 is, why it matters, and where to put your effort ───────── */
const L_x_bat_dau_tai_day = {
  title: '⭐ Start here (1/2) — What SWD392 is, why it matters, and where to put your effort|||⭐ Bắt đầu tại đây (1/2) — SWD392 là gì, vì sao quan trọng, và nên dồn sức vào đâu',
  slug: 'swd392-bat-dau-tai-day',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài định hướng tự thêm ngoài giáo trình: thiết kế và kiến trúc phần mềm là gì (bản vẽ nhà trước khi xây), lịch sử ngắn có mốc năm (Parnas 1972, coupling/cohesion, Booch–Rumbaugh–Jacobson, GoF 1994, UML 1997, Agile 2001, microservices, C4), vì sao môn này quan trọng với đồ án SEP490, phỏng vấn fresher Java/Spring, Spring Boot và điểm thi cuối 60%; nói thật phần nào nhẹ và nên dồn sức vào đâu — kèm bản đồ môn dựng bằng PlantUML.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ Start here 1/2 · added by this site, not part of the school slides</span>
<h2>Before the slides: what "designing software" actually means, and why a whole course is about it</h2>
<p class="lead">Until now (PRO192, LAB211, maybe SWP391) your job was: "make this program work". SWD392 asks a different question: "<em>before</em> anybody writes code, what should the system look like, so that five people can build it for months without stepping on each other?" This page gives you the big picture in one sitting. Nothing here is examined word for word, but every later lesson assumes you have these pictures in your head.</p>
<div class="callout"><p><strong>How this Section 0 is arranged.</strong> The four ⭐ lessons at the top (this one, "How to study", "Installing UML tools", "First hands-on session") are extra material written for this site. Then comes 0.A — the school's own Chapter 0 deck, slide by slide — and lessons 0.1–0.6 (course overview, pass conditions, CLOs, tool list, project topic bank, how students lose marks). This page does not repeat 0.1–0.6; it explains <em>why</em> the course is worth your effort and <em>where</em> the effort pays off.</p></div>`,
    `<span class="eyebrow">Mục 0 · ⭐ Bắt đầu tại đây 1/2 · phần web tự thêm, không có trong slide trường</span>
<h2>Trước khi vào slide: "thiết kế phần mềm" thật ra nghĩa là gì, và vì sao cả một môn học về nó</h2>
<p class="lead">Tới giờ (PRO192, LAB211, có thể cả SWP391) việc của bạn là: "làm cho chương trình chạy". SWD392 hỏi một câu khác: "<em>trước khi</em> ai đó viết code, hệ thống nên có hình dạng thế nào, để năm người cùng xây nó trong nhiều tháng mà không giẫm chân nhau?" Trang này cho bạn bức tranh lớn trong một lần đọc. Không có gì ở đây thi nguyên văn, nhưng mọi bài sau đều giả định bạn đã có sẵn những hình dung này.</p>
<div class="callout"><p><strong>Mục 0 được sắp thế nào.</strong> Bốn bài ⭐ ở đầu (bài này, "Học thế nào", "Cài công cụ vẽ UML", "Buổi thực hành đầu tiên") là phần web tự viết thêm. Sau đó là bài 0.A — bộ slide Chapter 0 của chính trường, giảng từng slide — rồi các bài 0.1–0.6 (tổng quan môn, điều kiện qua môn, chuẩn đầu ra CLO, danh sách công cụ, ngân hàng đề tài project, vì sao mất điểm). Trang này không lặp lại 0.1–0.6; nó giải thích <em>vì sao</em> môn đáng để bạn bỏ công, và công bỏ vào <em>chỗ nào</em> thì sinh lời.</p></div>`),
    bi(`<h2>1. Design and architecture — the house-blueprint picture</h2>
<p>Imagine building a three-storey house. Nobody starts by laying bricks. First an architect draws <strong>floor plans</strong> (where the rooms are), an <strong>electrical plan</strong>, a <strong>plumbing plan</strong>. Each drawing shows the same house from one angle, for one group of workers. The electrician does not need the paint colours; the plumber does not need the furniture layout. And some decisions — how many floors, where the staircase goes — are almost impossible to change once the concrete is poured.</p>
<p>Software is the same, just invisible:</p>
<table>
<thead><tr><th>Level</th><th>Question it answers</th><th>Cost of changing it later</th><th>House analogy</th><th>LabFlow example</th></tr></thead>
<tbody>
<tr><td>Architecture</td><td>How is the system split into big parts, and how do the parts talk?</td><td>Very high</td><td>Number of floors, load-bearing walls, staircase</td><td>React front end + Spring Boot back end + PostgreSQL, talking over REST</td></tr>
<tr><td>Design</td><td>Inside one part: which classes, which responsibilities, which relationships?</td><td>Medium</td><td>Room layout on one floor</td><td><code>ReservationService</code> owns the booking rules; <code>Reservation</code> has a status</td></tr>
<tr><td>Code</td><td>How does one method work?</td><td>Low</td><td>Paint colour, a shelf</td><td>The loop that checks whether two time slots overlap</td></tr>
</tbody>
</table>
<p><strong>UML</strong> (Unified Modeling Language) is the drawing language — the "architectural symbols" of software. A <strong>use case diagram</strong> is like the list of what the owners want to do in the house; a <strong>class diagram</strong> is the floor plan; a <strong>sequence diagram</strong> shows who talks to whom, in what order, for one task; a <strong>state machine</strong> shows how one thing (an order, a booking) changes over its life.</p>
<p class="meo">🧠 One sentence: <strong>architecture = the decisions that are expensive to change</strong>; design = the decisions inside those boundaries; code = everything else. SWD392 is about the first two.</p>`,
    `<h2>1. Thiết kế và kiến trúc — hình ảnh bản vẽ nhà</h2>
<p>Hãy tưởng tượng xây một căn nhà ba tầng. Không ai bắt đầu bằng việc xếp gạch. Trước hết kiến trúc sư vẽ <strong>mặt bằng</strong> (phòng nào ở đâu), <strong>bản vẽ điện</strong>, <strong>bản vẽ cấp thoát nước</strong>. Mỗi bản vẽ nhìn cùng một căn nhà từ một góc, cho một nhóm thợ. Thợ điện không cần biết màu sơn; thợ nước không cần biết kê bàn ghế ra sao. Và vài quyết định — mấy tầng, cầu thang đặt đâu — gần như không đổi được nữa khi bê tông đã đổ.</p>
<p>Phần mềm cũng y như vậy, chỉ là vô hình:</p>
<table>
<thead><tr><th>Mức</th><th>Trả lời câu hỏi gì</th><th>Đổi về sau tốn cỡ nào</th><th>Ví von căn nhà</th><th>Ví dụ LabFlow</th></tr></thead>
<tbody>
<tr><td>Kiến trúc (architecture)</td><td>Hệ thống chia thành những phần lớn nào, các phần nói chuyện với nhau ra sao?</td><td>Rất tốn</td><td>Số tầng, tường chịu lực, cầu thang</td><td>Front end React + back end Spring Boot + PostgreSQL, nói chuyện qua REST</td></tr>
<tr><td>Thiết kế (design)</td><td>Bên trong một phần: những lớp nào, trách nhiệm gì, quan hệ thế nào?</td><td>Vừa</td><td>Cách chia phòng trên một tầng</td><td><code>ReservationService</code> giữ luật đặt lịch; <code>Reservation</code> có trạng thái</td></tr>
<tr><td>Code</td><td>Một hàm chạy thế nào?</td><td>Ít</td><td>Màu sơn, một cái kệ</td><td>Vòng lặp kiểm tra hai khung giờ có chồng nhau không</td></tr>
</tbody>
</table>
<p><strong>UML</strong> (Unified Modeling Language — ngôn ngữ mô hình hoá thống nhất) là ngôn ngữ vẽ — "bộ ký hiệu kiến trúc" của phần mềm. <strong>Use case diagram</strong> (sơ đồ ca sử dụng) giống danh sách chủ nhà muốn làm gì trong căn nhà; <strong>class diagram</strong> (sơ đồ lớp) là bản vẽ mặt bằng; <strong>sequence diagram</strong> (sơ đồ tuần tự) cho thấy ai nói với ai, theo thứ tự nào, cho một việc; <strong>state machine</strong> (máy trạng thái) cho thấy một thứ (một đơn hàng, một lượt đặt lab) thay đổi thế nào trong suốt vòng đời của nó.</p>
<p class="meo">🧠 Một câu: <strong>kiến trúc = những quyết định đổi rất tốn</strong>; thiết kế = các quyết định bên trong ranh giới đó; code = phần còn lại. SWD392 dạy hai cái đầu.</p>`),
    bi(`<h2>2. A short, dated history — so the names in the slides stop being random</h2>
<table>
<thead><tr><th>When</th><th>What happened</th><th>Where you meet it in SWD392</th></tr></thead>
<tbody>
<tr><td>1968</td><td>The NATO Software Engineering conference (Garmisch) popularises the phrase "software engineering" — large projects were failing and people wanted engineering discipline</td><td>Chapter 1 (why design at all)</td></tr>
<tr><td>1972</td><td>David Parnas publishes "On the Criteria To Be Used in Decomposing Systems into Modules": split a system by <strong>information hiding</strong> — each module hides one design decision that is likely to change</td><td>Chapter 4 (design concepts)</td></tr>
<tr><td>1974</td><td>Stevens, Myers and Constantine publish "Structured Design" (IBM Systems Journal), introducing <strong>coupling</strong> and <strong>cohesion</strong> as the yardsticks of a good module split</td><td>Chapter 4, and every design review for the rest of your career</td></tr>
<tr><td>Late 1980s – early 1990s</td><td>Object-oriented methods compete: Grady Booch (Booch method), James Rumbaugh (OMT), Ivar Jacobson (OOSE — the origin of the <strong>use case</strong>)</td><td>Chapter 2 (UML notation), Chapter 6 (use cases)</td></tr>
<tr><td>1994</td><td>Gamma, Helm, Johnson and Vlissides (the "Gang of Four", GoF) publish <em>Design Patterns</em>: 23 named solutions to recurring design problems</td><td>Chapter 4 on this site (Design Patterns appendix)</td></tr>
<tr><td>1997</td><td>The three methods merge into <strong>UML</strong>; version 1.1 is adopted as a standard by the OMG (Object Management Group). UML 2.0 follows in 2005</td><td>Every diagram in this course</td></tr>
<tr><td>Late 1990s</td><td>Rational Software (where Booch, Rumbaugh and Jacobson worked) packages a process around UML: the <strong>Rational Unified Process (RUP)</strong> — iterative, use case–driven</td><td>Chapter 3 (life cycle models)</td></tr>
<tr><td>Around 2000</td><td>Hassan Gomaa describes <strong>COMET</strong>, the use case–driven UML method your textbook follows; <em>Software Modeling and Design</em> (the course book) appears in 2011</td><td>The whole course</td></tr>
<tr><td>2001</td><td>The <strong>Agile Manifesto</strong>: working software and responding to change over heavy up-front documents</td><td>Chapter 3; also why modern teams draw fewer, more useful diagrams</td></tr>
<tr><td>Early 2000s</td><td>Robert C. Martin collects the <strong>SOLID</strong> principles (the acronym itself was coined a little later)</td><td>Chapter 4 on this site (SOLID appendix)</td></tr>
<tr><td>2010s</td><td><strong>Microservices</strong> become a mainstream style (the widely cited Lewis–Fowler article is from 2014); Simon Brown's <strong>C4 model</strong> spreads as a lightweight way to draw architecture at four zoom levels</td><td>Chapter 3 (SOA is the ancestor), and the ⭐ Advanced section later on</td></tr>
</tbody>
</table>
<p class="meo">🧠 The story in one line: <strong>modules (1970s) → objects (1980s–90s) → one shared notation, UML (1997) → lighter processes (2001) → services (2010s)</strong>. Each step kept the earlier ideas — coupling and cohesion from 1974 are still how people judge a microservice split today.</p>`,
    `<h2>2. Lịch sử ngắn có mốc năm — để mấy cái tên trong slide không còn là chữ vô nghĩa</h2>
<table>
<thead><tr><th>Khi nào</th><th>Chuyện gì xảy ra</th><th>Gặp lại ở đâu trong SWD392</th></tr></thead>
<tbody>
<tr><td>1968</td><td>Hội nghị Software Engineering của NATO (Garmisch) làm phổ biến cụm từ "software engineering" (kỹ nghệ phần mềm) — các dự án lớn liên tục thất bại và người ta muốn làm phần mềm có kỷ luật như ngành kỹ thuật</td><td>Chapter 1 (vì sao phải thiết kế)</td></tr>
<tr><td>1972</td><td>David Parnas công bố bài "On the Criteria To Be Used in Decomposing Systems into Modules": chia hệ thống theo <strong>che giấu thông tin (information hiding)</strong> — mỗi mô-đun giấu đi một quyết định thiết kế dễ thay đổi</td><td>Chapter 4 (khái niệm thiết kế)</td></tr>
<tr><td>1974</td><td>Stevens, Myers và Constantine công bố "Structured Design" (IBM Systems Journal), đưa ra <strong>độ phụ thuộc (coupling)</strong> và <strong>độ kết dính (cohesion)</strong> làm thước đo một cách chia mô-đun tốt</td><td>Chapter 4, và mọi buổi review thiết kế suốt nghề sau này</td></tr>
<tr><td>Cuối thập niên 1980 – đầu 1990</td><td>Các phương pháp hướng đối tượng cạnh tranh nhau: Grady Booch (phương pháp Booch), James Rumbaugh (OMT), Ivar Jacobson (OOSE — nơi sinh ra khái niệm <strong>use case</strong>)</td><td>Chapter 2 (ký hiệu UML), Chapter 6 (use case)</td></tr>
<tr><td>1994</td><td>Gamma, Helm, Johnson và Vlissides ("Gang of Four" — GoF, "băng nhóm bốn người") xuất bản <em>Design Patterns</em>: 23 lời giải có tên cho những vấn đề thiết kế lặp đi lặp lại</td><td>Chương 4 trên web (phụ lục Design Patterns)</td></tr>
<tr><td>1997</td><td>Ba phương pháp hợp nhất thành <strong>UML</strong>; bản 1.1 được OMG (Object Management Group — tổ chức chuẩn hoá) chấp nhận làm chuẩn. UML 2.0 ra năm 2005</td><td>Mọi sơ đồ trong môn</td></tr>
<tr><td>Cuối thập niên 1990</td><td>Công ty Rational Software (nơi Booch, Rumbaugh, Jacobson cùng làm) đóng gói một quy trình quanh UML: <strong>Rational Unified Process (RUP)</strong> — lặp (iterative), dẫn dắt bởi use case</td><td>Chapter 3 (mô hình vòng đời)</td></tr>
<tr><td>Khoảng năm 2000</td><td>Hassan Gomaa mô tả <strong>COMET</strong>, phương pháp UML dẫn dắt bởi use case mà giáo trình của bạn đi theo; cuốn <em>Software Modeling and Design</em> (sách của môn) ra năm 2011</td><td>Cả môn</td></tr>
<tr><td>2001</td><td><strong>Tuyên ngôn Agile (Agile Manifesto)</strong>: ưu tiên phần mềm chạy được và thích ứng thay đổi hơn là tài liệu đồ sộ làm trước</td><td>Chapter 3; và là lý do đội hiện đại vẽ ít sơ đồ hơn nhưng sơ đồ nào cũng có ích</td></tr>
<tr><td>Đầu thập niên 2000</td><td>Robert C. Martin tập hợp các nguyên tắc <strong>SOLID</strong> (bản thân chữ viết tắt SOLID được đặt muộn hơn một chút)</td><td>Chương 4 trên web (phụ lục SOLID)</td></tr>
<tr><td>Thập niên 2010</td><td><strong>Microservices</strong> (vi dịch vụ) thành kiểu kiến trúc phổ biến (bài báo hay được trích của Lewis và Fowler là năm 2014); <strong>mô hình C4</strong> của Simon Brown lan rộng như một cách nhẹ nhàng để vẽ kiến trúc ở bốn mức phóng to</td><td>Chapter 3 (SOA là tổ tiên), và phần ⭐ Chuyên sâu về sau</td></tr>
</tbody>
</table>
<p class="meo">🧠 Cả câu chuyện trong một dòng: <strong>mô-đun (1970s) → đối tượng (1980s–90s) → một bộ ký hiệu chung là UML (1997) → quy trình nhẹ hơn (2001) → dịch vụ (2010s)</strong>. Mỗi bước giữ lại ý tưởng cũ — coupling và cohesion từ 1974 vẫn là thước người ta dùng để chấm cách chia microservice hôm nay.</p>`),
    bi(`<h2>3. Why SWD392 matters — four concrete reasons</h2>
<h3>(a) Your capstone (SEP490) reports are written with exactly these diagrams</h3>
<p>The capstone report templates in the school's own template folder ask for things SWD392 teaches. <strong>Report 3 — Software Requirement Specification (SRS)</strong> needs actors, use case diagrams, use case specifications (primary/secondary actor, preconditions, main and alternative sequences, postconditions) and swim-lane workflow diagrams. <strong>Report 4 — Software Design Document (SDD)</strong> needs a system architecture diagram, a package diagram, the database design, and for each feature a class diagram plus sequence diagram(s). State machines are not a separate heading in that SRS template, but the SWD392 Course Project report has its own "State diagram" section and Assignment 02 asks for at least three statecharts — and in LabFlow the reservation life cycle (pending → approved → cancelled…) is exactly the kind of rule a committee asks you to explain.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e314117e3cc378132611fba518843c7669230880.svg" alt="What SWD392 feeds into your capstone reports (SEP490)" loading="lazy" /><p class="chu-thich">🧩 What SWD392 feeds into your capstone reports (SEP490)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Which SWD392 skill feeds which section of the capstone reports
title What SWD392 feeds into your capstone reports (SEP490)
left to right direction
rectangle "Learned in SWD392" as S {
  rectangle "Use case diagram\\n+ use case description (Ch.6)" as A
  rectangle "Activity diagram\\n(workflow of a use case)" as B
  rectangle "Architecture: subsystems,\\nlayers, client/server (Ch.12–15)" as C
  rectangle "Class + sequence diagrams\\n(Ch.7–9, 11)" as D
  rectangle "Relational database design\\n(CLO5)" as E
}
rectangle "Report 3 — SRS" as R3 {
  rectangle "1.3 User requirements\\n(actors, UC diagrams)" as R31
  rectangle "2. Use case specifications" as R32
  rectangle "1.2 Main workflows\\n(swim-lane diagrams)" as R33
}
rectangle "Report 4 — SDD" as R4 {
  rectangle "1.1 System architecture\\n1.2 Package diagram" as R41
  rectangle "2. Database design" as R42
  rectangle "3. Detailed design\\n(class + sequence per feature)" as R43
}
A --&gt; R31
A --&gt; R32
B --&gt; R33
C --&gt; R41
E --&gt; R42
D --&gt; R43
@enduml</code></pre></details>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): LabFlow starts its SWP391 → SEP490 run in October 2026. The use cases you draw in SWD392's Course Project and the ones in LabFlow's SRS are the same skill — learn it properly once here and you do not have to learn it again under deadline pressure.</div>
<h3>(b) Fresher interviews for Java/Spring jobs ask about this material</h3>
<table>
<thead><tr><th>Typical interview request</th><th>Where SWD392 covers it</th></tr></thead>
<tbody>
<tr><td>"What are the SOLID principles? Give an example of one you applied."</td><td>SOLID appendix (web Chapter 4)</td></tr>
<tr><td>"Which design patterns do you know? When would you use Strategy / Observer / Factory / Singleton?"</td><td>Design Patterns appendix (web Chapter 4); PE question 5 is exactly this</td></tr>
<tr><td>"Draw the architecture of your project on the whiteboard."</td><td>Chapter 12–15 (subsystems, layered, client/server) + your Course Project</td></tr>
<tr><td>"Monolith or microservices — which would you choose here, and why?"</td><td>Chapter 15–16 (client/server, SOA) + Chapter 20 (quality attributes decide the trade-off)</td></tr>
<tr><td>"What is the difference between aggregation and composition?"</td><td>Chapter 7 (static modeling); PE question 1</td></tr>
</tbody>
</table>
<h3>(c) Spring Boot is built out of these ideas</h3>
<p>When you write a Spring Boot back end (as LabFlow does), you are already standing on SWD392 concepts, whether or not you know their names:</p>
<ul>
<li><strong>Dependency Injection / Inversion of Control (DI/IoC)</strong> — you declare what a class needs in its constructor; the Spring container creates the objects and passes them in. This is the practical form of the <strong>D in SOLID</strong> (Dependency Inversion: depend on abstractions, not concrete classes).</li>
<li><strong>Layered architecture</strong> — <code>@RestController</code> → <code>@Service</code> → <code>Repository</code> → database. That is Chapter 12–14's layered style, and each layer only calls the layer below.</li>
<li><strong>GoF patterns built in</strong> — beans are singletons by default (one instance per container, a Spring variant of Singleton); <code>@Transactional</code> and AOP work through <strong>Proxy</strong> objects; <code>JdbcTemplate</code>/<code>RestTemplate</code> follow the <strong>Template Method</strong> idea (the template runs the fixed steps, you supply the variable part); <code>ApplicationEvent</code> + <code>@EventListener</code> is <strong>Observer</strong>; <code>DispatcherServlet</code> is a Front Controller.</li>
</ul>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/6866c25476b1891a6dad67757592e6106d9877b6.svg" alt="LabFlow in Spring Boot — layers wired by dependency injection" loading="lazy" /><p class="chu-thich">🧩 LabFlow in Spring Boot — layers wired by dependency injection</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Spring Boot layering in LabFlow (illustration): each layer depends on the one below, injected by Spring
title LabFlow in Spring Boot — layers wired by dependency injection
class ReservationController &lt;&lt;@RestController&gt;&gt; {
  - service : ReservationService
  + create(req : ReservationRequest) : ReservationDto
}
class ReservationService &lt;&lt;@Service&gt;&gt; {
  - repo : ReservationRepository
  - notifier : Notifier
  + reserve(studentId : Long, slotId : Long) : Reservation
}
interface ReservationRepository &lt;&lt;JpaRepository&gt;&gt; {
  + save(r : Reservation) : Reservation
  + findBySlotId(slotId : Long) : List&lt;Reservation&gt;
}
interface Notifier {
  + send(to : String, msg : String) : void
}
class EmailNotifier &lt;&lt;@Component&gt;&gt;
class Reservation &lt;&lt;@Entity&gt;&gt; {
  - id : Long
  - status : ReservationStatus
}
ReservationController --&gt; ReservationService : calls
ReservationService --&gt; ReservationRepository : calls
ReservationService --&gt; Notifier : calls
EmailNotifier ..|&gt; Notifier
ReservationRepository ..&gt; Reservation : stores
note right of ReservationService
  Depends on INTERFACES, not on
  concrete classes (SOLID "D").
  The Spring container creates the
  objects and passes them in through
  the constructor (DI / IoC).
end note
@enduml</code></pre></details>
<p>Read the diagram top-down: the controller only knows the service, the service only knows two <em>interfaces</em>. Swap <code>EmailNotifier</code> for an SMS notifier and not one line of <code>ReservationService</code> changes — that is low coupling in practice.</p>
<h3>(d) The final exam is 60% of your grade</h3>
<p>The syllabus weights: Course Project 25%, Progress tests 15%, Final exam 60% = <strong>Practical Exam (PE) 20%, 85 minutes</strong> + <strong>Theory Exam (TE) 40%, 60 minutes</strong>, each with a minimum of 4. Lesson 0.2 explains the pass gates in detail. What matters here: the sample PE (template in the school folder) is five questions — class diagram, sequence/communication diagram, statechart, architecture choice, design pattern. Every one of them is a drawing or design decision, not a definition.</p>`,
    `<h2>3. Vì sao SWD392 quan trọng — bốn lý do cụ thể</h2>
<h3>(a) Báo cáo đồ án tốt nghiệp (SEP490) viết bằng đúng những sơ đồ này</h3>
<p>Các mẫu báo cáo đồ án trong thư mục mẫu của trường đòi đúng những thứ SWD392 dạy. <strong>Report 3 — Software Requirement Specification (SRS, đặc tả yêu cầu phần mềm)</strong> cần tác nhân (actor), use case diagram, đặc tả use case (tác nhân chính/phụ, điều kiện trước — precondition, luồng chính và luồng thay thế — main/alternative sequence, điều kiện sau — postcondition) và sơ đồ luồng công việc dạng làn bơi (swim-lane). <strong>Report 4 — Software Design Document (SDD, tài liệu thiết kế)</strong> cần sơ đồ kiến trúc hệ thống, package diagram (sơ đồ gói), thiết kế CSDL, và với mỗi chức năng một class diagram cùng sequence diagram. Máy trạng thái (state machine) không phải một mục riêng trong mẫu SRS đó, nhưng báo cáo Course Project của SWD392 có hẳn mục "State diagram" và Assignment 02 đòi ít nhất ba statechart — còn trong LabFlow, vòng đời của một lượt đặt lab (chờ duyệt → đã duyệt → đã huỷ…) đúng là loại luật hội đồng hay bắt giải thích.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/e314117e3cc378132611fba518843c7669230880.svg" alt="What SWD392 feeds into your capstone reports (SEP490)" loading="lazy" /><p class="chu-thich">🧩 What SWD392 feeds into your capstone reports (SEP490)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Kỹ năng SWD392 nào nuôi mục nào của báo cáo đồ án
title What SWD392 feeds into your capstone reports (SEP490)
left to right direction
rectangle "Learned in SWD392" as S {
  rectangle "Use case diagram\\n+ use case description (Ch.6)" as A
  rectangle "Activity diagram\\n(workflow of a use case)" as B
  rectangle "Architecture: subsystems,\\nlayers, client/server (Ch.12–15)" as C
  rectangle "Class + sequence diagrams\\n(Ch.7–9, 11)" as D
  rectangle "Relational database design\\n(CLO5)" as E
}
rectangle "Report 3 — SRS" as R3 {
  rectangle "1.3 User requirements\\n(actors, UC diagrams)" as R31
  rectangle "2. Use case specifications" as R32
  rectangle "1.2 Main workflows\\n(swim-lane diagrams)" as R33
}
rectangle "Report 4 — SDD" as R4 {
  rectangle "1.1 System architecture\\n1.2 Package diagram" as R41
  rectangle "2. Database design" as R42
  rectangle "3. Detailed design\\n(class + sequence per feature)" as R43
}
A --&gt; R31
A --&gt; R32
B --&gt; R33
C --&gt; R41
E --&gt; R42
D --&gt; R43
@enduml</code></pre></details>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): LabFlow bắt đầu chặng SWP391 → SEP490 từ tháng 10/2026. Use case bạn vẽ trong Course Project SWD392 và use case trong SRS của LabFlow là cùng một kỹ năng — học cho chắc một lần ở đây thì không phải học lại dưới áp lực hạn nộp.</div>
<h3>(b) Phỏng vấn fresher Java/Spring hỏi đúng phần này</h3>
<table>
<thead><tr><th>Câu hay gặp khi phỏng vấn</th><th>SWD392 dạy ở đâu</th></tr></thead>
<tbody>
<tr><td>"SOLID là gì? Kể một nguyên tắc em đã áp dụng."</td><td>Phụ lục SOLID (Chương 4 trên web)</td></tr>
<tr><td>"Em biết design pattern nào? Khi nào dùng Strategy / Observer / Factory / Singleton?"</td><td>Phụ lục Design Patterns (Chương 4 trên web); câu 5 đề PE hỏi đúng kiểu này</td></tr>
<tr><td>"Vẽ kiến trúc dự án của em lên bảng."</td><td>Chapter 12–15 (subsystem — hệ con, phân tầng, client/server) + Course Project của bạn</td></tr>
<tr><td>"Monolith hay microservices — ở đây em chọn cái nào, vì sao?"</td><td>Chapter 15–16 (client/server, SOA) + Chapter 20 (thuộc tính chất lượng — quality attributes — quyết định sự đánh đổi)</td></tr>
<tr><td>"Aggregation khác composition thế nào?"</td><td>Chapter 7 (mô hình tĩnh — static modeling); câu 1 đề PE</td></tr>
</tbody>
</table>
<h3>(c) Spring Boot được dựng từ chính những ý tưởng này</h3>
<p>Khi viết back end Spring Boot (như LabFlow), bạn đã đứng trên các khái niệm SWD392, dù có biết tên chúng hay không:</p>
<ul>
<li><strong>Tiêm phụ thuộc / Đảo ngược điều khiển (Dependency Injection / Inversion of Control — DI/IoC)</strong> — bạn khai báo lớp cần gì trong constructor; Spring container tự tạo đối tượng và đưa vào. Đây là dạng thực hành của <strong>chữ D trong SOLID</strong> (Dependency Inversion — phụ thuộc vào trừu tượng, không phụ thuộc lớp cụ thể).</li>
<li><strong>Kiến trúc phân tầng (layered architecture)</strong> — <code>@RestController</code> → <code>@Service</code> → <code>Repository</code> → CSDL. Đó chính là kiểu phân tầng ở Chapter 12–14, mỗi tầng chỉ gọi tầng ngay dưới.</li>
<li><strong>Pattern GoF có sẵn</strong> — bean mặc định là singleton (một thể hiện cho mỗi container, một biến thể Singleton của Spring); <code>@Transactional</code> và AOP chạy qua đối tượng <strong>Proxy</strong> (đại diện); <code>JdbcTemplate</code>/<code>RestTemplate</code> theo ý tưởng <strong>Template Method</strong> (khuôn chạy các bước cố định, bạn cung cấp phần thay đổi); <code>ApplicationEvent</code> + <code>@EventListener</code> là <strong>Observer</strong> (người quan sát); <code>DispatcherServlet</code> là một Front Controller (bộ điều khiển cửa trước).</li>
</ul>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/6866c25476b1891a6dad67757592e6106d9877b6.svg" alt="LabFlow in Spring Boot — layers wired by dependency injection" loading="lazy" /><p class="chu-thich">🧩 LabFlow in Spring Boot — layers wired by dependency injection</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Phân tầng Spring Boot trong LabFlow (minh hoạ): tầng trên phụ thuộc tầng dưới, Spring tiêm vào
title LabFlow in Spring Boot — layers wired by dependency injection
class ReservationController &lt;&lt;@RestController&gt;&gt; {
  - service : ReservationService
  + create(req : ReservationRequest) : ReservationDto
}
class ReservationService &lt;&lt;@Service&gt;&gt; {
  - repo : ReservationRepository
  - notifier : Notifier
  + reserve(studentId : Long, slotId : Long) : Reservation
}
interface ReservationRepository &lt;&lt;JpaRepository&gt;&gt; {
  + save(r : Reservation) : Reservation
  + findBySlotId(slotId : Long) : List&lt;Reservation&gt;
}
interface Notifier {
  + send(to : String, msg : String) : void
}
class EmailNotifier &lt;&lt;@Component&gt;&gt;
class Reservation &lt;&lt;@Entity&gt;&gt; {
  - id : Long
  - status : ReservationStatus
}
ReservationController --&gt; ReservationService : calls
ReservationService --&gt; ReservationRepository : calls
ReservationService --&gt; Notifier : calls
EmailNotifier ..|&gt; Notifier
ReservationRepository ..&gt; Reservation : stores
note right of ReservationService
  Depends on INTERFACES, not on
  concrete classes (SOLID "D").
  The Spring container creates the
  objects and passes them in through
  the constructor (DI / IoC).
end note
@enduml</code></pre></details>
<p>Đọc sơ đồ từ trên xuống: controller chỉ biết service, service chỉ biết hai <em>interface</em>. Đổi <code>EmailNotifier</code> sang gửi SMS thì không một dòng nào của <code>ReservationService</code> phải sửa — đó là coupling thấp (phụ thuộc lỏng) ngoài đời thật.</p>
<h3>(d) Thi cuối kỳ chiếm 60% điểm</h3>
<p>Trọng số theo đề cương: Course Project 25%, Progress test 15%, Final exam 60% = <strong>Practical Exam (PE — thi thực hành) 20%, 85 phút</strong> + <strong>Theory Exam (TE — thi lý thuyết) 40%, 60 phút</strong>, mỗi phần tối thiểu 4 điểm. Bài 0.2 giải thích chi tiết các "cổng" qua môn. Điều quan trọng ở đây: đề PE mẫu (mẫu trong thư mục của trường) có năm câu — class diagram, sequence/communication diagram, statechart, chọn kiến trúc, chọn design pattern. Câu nào cũng là vẽ hoặc ra quyết định thiết kế, không câu nào là học thuộc định nghĩa.</p>`),
    bi(`<h2>4. Honest talk: which parts are lighter for a web developer</h2>
<p>Not every chapter is equally useful for your career. Being honest about that helps you spend energy wisely — but "lighter" never means "skip", because every chapter can appear in the Theory exam.</p>
<table>
<thead><tr><th>Part</th><th>Honest verdict</th><th>What to do</th></tr></thead>
<tbody>
<tr><td>COMET vocabulary: «boundary», «control», «entity», «coordinator», «state dependent control»…</td><td>Academic — few companies use these exact words. <strong>But</strong> PE question 2 explicitly requires these stereotypes on every object</td><td>Learn them properly; they are free marks in the PE</td></tr>
<tr><td>Chapter 17 + 23 — component-based architectures (Emergency Monitoring case)</td><td>Rarely drawn in day-to-day web work</td><td>Learn the definitions, the key diagram types and the case study story — enough to pass TE</td></tr>
<tr><td>Chapter 18 + 24 — concurrent and real-time architectures (Automated Guided Vehicle case)</td><td>Mostly embedded/industrial systems; far from a Spring + React job</td><td>Same: learn to pass. (Useful again if you ever do IoT — LabFlow v2 plans an ESP32 sensor)</td></tr>
<tr><td>Chapter 19 — software product line architectures</td><td>In the book, but not scheduled in the syllabus sessions and there is no school deck for it</td><td>Skim only if your lecturer mentions it</td></tr>
<tr><td>Chapter 3 — life cycle models</td><td>Short, definition-heavy</td><td>Quick review before TE</td></tr>
</tbody>
</table>
<p>Everything else — use cases, class diagrams, sequence/communication diagrams, state machines, patterns, SOLID, layered/client-server/service architectures, quality attributes — is used in real jobs every week.</p>`,
    `<h2>4. Nói thật: phần nào nhẹ hơn với dân làm web</h2>
<p>Không phải chương nào cũng có ích như nhau cho nghề nghiệp của bạn. Nói thật điều đó giúp bạn phân bổ sức — nhưng "nhẹ" không bao giờ có nghĩa là "bỏ", vì chương nào cũng có thể ra trong bài thi lý thuyết (TE).</p>
<table>
<thead><tr><th>Phần</th><th>Nhận xét thật</th><th>Nên làm gì</th></tr></thead>
<tbody>
<tr><td>Bộ từ vựng COMET: «boundary» (biên), «control» (điều khiển), «entity» (thực thể), «coordinator», «state dependent control»…</td><td>Mang tính học thuật — ít công ty dùng đúng mấy chữ này. <strong>Nhưng</strong> câu 2 đề PE bắt buộc ghi các stereotype (khuôn mẫu) này trên từng đối tượng</td><td>Học cho chắc; đây là điểm "cho không" trong PE</td></tr>
<tr><td>Chapter 17 + 23 — kiến trúc dựa trên thành phần (component-based), case Emergency Monitoring</td><td>Hiếm khi vẽ trong công việc web hằng ngày</td><td>Học định nghĩa, các loại sơ đồ chính và câu chuyện case study — đủ để qua TE</td></tr>
<tr><td>Chapter 18 + 24 — kiến trúc đồng thời và thời gian thực (concurrent, real-time), case xe tự hành AGV</td><td>Chủ yếu cho hệ nhúng/công nghiệp; xa công việc Spring + React</td><td>Như trên: học đủ thi. (Sẽ có ích lại nếu bạn làm IoT — LabFlow v2 có kế hoạch cảm biến ESP32)</td></tr>
<tr><td>Chapter 19 — kiến trúc dòng sản phẩm (product line)</td><td>Có trong sách, nhưng không có buổi nào trong lịch đề cương và trường không có bộ slide</td><td>Chỉ đọc lướt nếu giảng viên nhắc tới</td></tr>
<tr><td>Chapter 3 — mô hình vòng đời (life cycle models)</td><td>Ngắn, nặng định nghĩa</td><td>Ôn nhanh trước TE</td></tr>
</tbody>
</table>
<p>Mọi phần còn lại — use case, class diagram, sequence/communication diagram, máy trạng thái, pattern, SOLID, kiến trúc phân tầng/client-server/dịch vụ, quality attributes — đều được dùng trong công việc thật hằng tuần.</p>`),
    bi(`<h2>5. Where to put your effort — the course map</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/7f5833ec5ece098df6b986623d282eba2c1b3c91.svg" alt="SWD392 map — where to put your effort (more stars = more effort)" loading="lazy" /><p class="chu-thich">🧩 SWD392 map — where to put your effort (more stars = more effort)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startmindmap
' Course map: what SWD392 covers and how hard to push each part
title SWD392 map — where to put your effort (more stars = more effort)
* SWD392\\nSoftware Architecture\\nand Design
** ★★ Foundations (Ch.1–5)\\nUML notation · life cycle\\ndesign concepts
*** coupling · cohesion\\ninformation hiding
** ★★★ Requirements &amp; analysis (Ch.6–11)
*** use case diagram\\n+ use case description
*** class diagram (static model)
*** sequence / communication
*** state machine (statechart)
** ★★★ Design patterns + SOLID
*** creational · structural\\n· behavioral (GoF)
*** SOLID principles
left side
** ★★ Architecture (Ch.12–16, 20–22)
*** subsystems · layered\\nclient/server · SOA
*** quality attributes (Ch.20)
** ★ Lighter for web developers
*** component-based (Ch.17, 23)
*** real-time (Ch.18, 24)
** ★ AI tools (CLO7)
*** ChatGPT · PlantUML · Copilot
@endmindmap</code></pre></details>
<p>The ranking is not a feeling; it comes from where the marks and the job skills actually are:</p>
<ol>
<li><strong>★★★ Chapters 6–11: use case, class, sequence/communication, state machine.</strong> In the sample PE, questions 1–3 are exactly these and carry <strong>8 of the 10 points</strong>. They are also Evaluation 1 of the Course Project and the heart of your SRS/SDD.</li>
<li><strong>★★★ Design patterns + SOLID.</strong> PE question 5, a big share of TE, Evaluation 2 of the project (one creational, one structural, one behavioral pattern) — and the most-asked interview topic.</li>
<li><strong>★★ Architecture, Chapters 12–16 + 20–22.</strong> PE question 4 (name an architecture, justify it, one advantage and one disadvantage), the SDD's architecture section, and whiteboard interviews.</li>
<li><strong>★★ Foundations, Chapters 1–5.</strong> Notation you must read fluently, plus coupling/cohesion/information hiding.</li>
<li><strong>★ Component-based, real-time, AI tools.</strong> Learn enough to pass TE; use the AI tools (CLO7) as helpers, never as a replacement for understanding.</li>
</ol>
<div class="pitfall">⚠️ The most common way to fail SWD392 is to "read the slides" all term and draw for the first time in the exam room. The PE gives you 85 minutes to produce four diagrams and two design decisions. If you have never timed yourself drawing a statechart, 85 minutes disappears very fast. The next lesson shows a study rhythm that prevents this.</div>`,
    `<h2>5. Dồn sức vào đâu — bản đồ môn</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/7f5833ec5ece098df6b986623d282eba2c1b3c91.svg" alt="SWD392 map — where to put your effort (more stars = more effort)" loading="lazy" /><p class="chu-thich">🧩 SWD392 map — where to put your effort (more stars = more effort)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startmindmap
' Bản đồ môn: SWD392 gồm gì và dồn sức vào phần nào
title SWD392 map — where to put your effort (more stars = more effort)
* SWD392\\nSoftware Architecture\\nand Design
** ★★ Foundations (Ch.1–5)\\nUML notation · life cycle\\ndesign concepts
*** coupling · cohesion\\ninformation hiding
** ★★★ Requirements &amp; analysis (Ch.6–11)
*** use case diagram\\n+ use case description
*** class diagram (static model)
*** sequence / communication
*** state machine (statechart)
** ★★★ Design patterns + SOLID
*** creational · structural\\n· behavioral (GoF)
*** SOLID principles
left side
** ★★ Architecture (Ch.12–16, 20–22)
*** subsystems · layered\\nclient/server · SOA
*** quality attributes (Ch.20)
** ★ Lighter for web developers
*** component-based (Ch.17, 23)
*** real-time (Ch.18, 24)
** ★ AI tools (CLO7)
*** ChatGPT · PlantUML · Copilot
@endmindmap</code></pre></details>
<p>Thứ hạng này không phải cảm tính; nó đến từ chỗ điểm số và kỹ năng nghề thật sự nằm ở đâu:</p>
<ol>
<li><strong>★★★ Chapter 6–11: use case, class, sequence/communication, máy trạng thái.</strong> Trong đề PE mẫu, câu 1–3 đúng là mấy thứ này và chiếm <strong>8 trên 10 điểm</strong>. Chúng cũng là Evaluation 1 của Course Project và là trái tim của SRS/SDD.</li>
<li><strong>★★★ Design patterns + SOLID.</strong> Câu 5 đề PE, phần lớn TE, Evaluation 2 của project (một pattern khởi tạo — creational, một cấu trúc — structural, một hành vi — behavioral) — và là chủ đề phỏng vấn bị hỏi nhiều nhất.</li>
<li><strong>★★ Kiến trúc, Chapter 12–16 + 20–22.</strong> Câu 4 đề PE (gọi tên một kiến trúc, lý giải, một ưu điểm và một nhược điểm), mục kiến trúc của SDD, và các buổi phỏng vấn vẽ bảng.</li>
<li><strong>★★ Nền tảng, Chapter 1–5.</strong> Ký hiệu bạn phải đọc trôi chảy, cộng coupling/cohesion/che giấu thông tin.</li>
<li><strong>★ Component-based, real-time, công cụ AI.</strong> Học đủ để qua TE; dùng công cụ AI (CLO7) làm trợ lý, không bao giờ thay cho việc tự hiểu.</li>
</ol>
<div class="pitfall">⚠️ Cách rớt SWD392 phổ biến nhất là "đọc slide" cả kỳ và lần đầu tự vẽ là trong phòng thi. PE cho 85 phút để làm ra bốn sơ đồ và hai quyết định thiết kế. Nếu bạn chưa từng bấm giờ tự vẽ một statechart, 85 phút trôi đi rất nhanh. Bài tiếp theo đưa ra một nhịp học để tránh chuyện đó.</div>`),
    bi(`<h2>6. What to do next</h2>
<ol>
<li>Read "⭐ Start here (2/2) — how to study SWD392" for the 60-session map and a weekly rhythm.</li>
<li>Install one diagram tool with "⭐ Installing UML tools" — PlantUML is the one used in every lesson on this site.</li>
<li>Do "⭐ First hands-on session": draw your first use case and class diagram for LabFlow. It takes about an hour and makes Chapters 6–7 much easier.</li>
<li>Then open 0.A (the school's Chapter 0 deck) and continue in order.</li>
</ol>`,
    `<h2>6. Làm gì tiếp theo</h2>
<ol>
<li>Đọc "⭐ Bắt đầu tại đây (2/2) — học SWD392 thế nào" để có bản đồ 60 buổi và nhịp học mỗi tuần.</li>
<li>Cài một công cụ vẽ sơ đồ theo bài "⭐ Cài công cụ vẽ UML" — PlantUML là công cụ mọi bài trên web này dùng.</li>
<li>Làm "⭐ Buổi thực hành đầu tiên": vẽ use case và class diagram đầu tiên cho LabFlow. Mất khoảng một giờ và làm Chapter 6–7 dễ hơn hẳn.</li>
<li>Sau đó mở bài 0.A (bộ slide Chapter 0 của trường) và đi tiếp theo thứ tự.</li>
</ol>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>software architecture</strong></td><td>kiến trúc phần mềm</td><td>The high-level structure of a system: its major parts and how they interact — the decisions that are expensive to change.</td></tr>
<tr><td><strong>software design</strong></td><td>thiết kế phần mềm</td><td>Deciding the classes, responsibilities and relationships inside each part of the architecture.</td></tr>
<tr><td><strong>UML</strong></td><td>ngôn ngữ mô hình hoá thống nhất</td><td>Unified Modeling Language — the standard notation for drawing software models, adopted by the OMG in 1997.</td></tr>
<tr><td><strong>COMET</strong></td><td>phương pháp COMET của Gomaa</td><td>Gomaa's use case–driven method that goes from requirements to analysis to architecture using UML.</td></tr>
<tr><td><strong>information hiding</strong></td><td>che giấu thông tin</td><td>Parnas's rule: each module hides one design decision so a change stays inside that module.</td></tr>
<tr><td><strong>coupling</strong></td><td>độ phụ thuộc giữa các mô-đun</td><td>How much one module depends on another; good designs keep it low.</td></tr>
<tr><td><strong>cohesion</strong></td><td>độ kết dính bên trong mô-đun</td><td>How closely the parts of one module belong together; good designs keep it high.</td></tr>
<tr><td><strong>use case</strong></td><td>ca sử dụng</td><td>A goal an actor achieves with the system, named verb + object, such as "Reserve Lab Slot".</td></tr>
<tr><td><strong>design pattern</strong></td><td>mẫu thiết kế</td><td>A named, reusable solution to a recurring design problem (23 in the GoF book).</td></tr>
<tr><td><strong>SOLID</strong></td><td>năm nguyên tắc thiết kế hướng đối tượng</td><td>Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion.</td></tr>
<tr><td><strong>dependency injection (DI)</strong></td><td>tiêm phụ thuộc</td><td>A container creates the objects a class needs and passes them in, instead of the class creating them itself.</td></tr>
<tr><td><strong>layered architecture</strong></td><td>kiến trúc phân tầng</td><td>Organising a system in layers (controller, service, repository) where each layer only uses the one below.</td></tr>
<tr><td><strong>SRS</strong></td><td>đặc tả yêu cầu phần mềm</td><td>Software Requirement Specification — capstone Report 3: actors, use cases, workflows, requirements.</td></tr>
<tr><td><strong>SDD</strong></td><td>tài liệu thiết kế phần mềm</td><td>Software Design Document — capstone Report 4: architecture, packages, database, class and sequence diagrams.</td></tr>
<tr><td><strong>quality attribute</strong></td><td>thuộc tính chất lượng</td><td>A non-functional property such as performance, security or maintainability that shapes the architecture (Chapter 20).</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>software architecture</strong></td><td>kiến trúc phần mềm</td><td>Cấu trúc tầm cao của hệ thống: các phần lớn và cách chúng tương tác — những quyết định đổi rất tốn.</td></tr>
<tr><td><strong>software design</strong></td><td>thiết kế phần mềm</td><td>Quyết định các lớp, trách nhiệm và quan hệ bên trong từng phần của kiến trúc.</td></tr>
<tr><td><strong>UML</strong></td><td>ngôn ngữ mô hình hoá thống nhất</td><td>Bộ ký hiệu chuẩn để vẽ mô hình phần mềm, được OMG chấp nhận năm 1997.</td></tr>
<tr><td><strong>COMET</strong></td><td>phương pháp COMET của Gomaa</td><td>Phương pháp dẫn dắt bởi use case của Gomaa, đi từ yêu cầu tới phân tích tới kiến trúc bằng UML.</td></tr>
<tr><td><strong>information hiding</strong></td><td>che giấu thông tin</td><td>Luật của Parnas: mỗi mô-đun giấu một quyết định thiết kế để khi đổi thì thay đổi nằm gọn trong mô-đun đó.</td></tr>
<tr><td><strong>coupling</strong></td><td>độ phụ thuộc giữa các mô-đun</td><td>Mức một mô-đun phụ thuộc vào mô-đun khác; thiết kế tốt giữ nó thấp.</td></tr>
<tr><td><strong>cohesion</strong></td><td>độ kết dính bên trong mô-đun</td><td>Mức các phần trong một mô-đun thuộc về nhau; thiết kế tốt giữ nó cao.</td></tr>
<tr><td><strong>use case</strong></td><td>ca sử dụng</td><td>Một mục tiêu tác nhân đạt được nhờ hệ thống, đặt tên động từ + tân ngữ, ví dụ "Reserve Lab Slot".</td></tr>
<tr><td><strong>design pattern</strong></td><td>mẫu thiết kế</td><td>Một lời giải có tên, dùng lại được cho vấn đề thiết kế lặp lại (sách GoF có 23 mẫu).</td></tr>
<tr><td><strong>SOLID</strong></td><td>năm nguyên tắc thiết kế hướng đối tượng</td><td>Đơn trách nhiệm, Mở/đóng, Thay thế Liskov, Tách interface, Đảo ngược phụ thuộc.</td></tr>
<tr><td><strong>dependency injection (DI)</strong></td><td>tiêm phụ thuộc</td><td>Container tạo các đối tượng một lớp cần rồi đưa vào, thay vì lớp tự tạo.</td></tr>
<tr><td><strong>layered architecture</strong></td><td>kiến trúc phân tầng</td><td>Tổ chức hệ thống thành tầng (controller, service, repository), mỗi tầng chỉ dùng tầng ngay dưới.</td></tr>
<tr><td><strong>SRS</strong></td><td>đặc tả yêu cầu phần mềm</td><td>Report 3 của đồ án: tác nhân, use case, luồng công việc, yêu cầu.</td></tr>
<tr><td><strong>SDD</strong></td><td>tài liệu thiết kế phần mềm</td><td>Report 4 của đồ án: kiến trúc, gói, CSDL, class và sequence diagram.</td></tr>
<tr><td><strong>quality attribute</strong></td><td>thuộc tính chất lượng</td><td>Tính chất phi chức năng như hiệu năng, bảo mật, dễ bảo trì — thứ định hình kiến trúc (Chapter 20).</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── ⭐ Start here (2/2) — How to study SWD392 without burning out: 60-session map, weekly rhythm, PE practice ───────── */
const L_x_hoc_the_nao = {
  title: '⭐ Start here (2/2) — How to study SWD392 without burning out: 60-session map, weekly rhythm, PE practice|||⭐ Bắt đầu tại đây (2/2) — Học SWD392 thế nào cho không nản: bản đồ 60 buổi, nhịp tuần, luyện PE',
  slug: 'swd392-hoc-the-nao',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài tự thêm ngoài giáo trình: bảng 60 buổi của đề cương nối với chương sách, bộ slide và phần điểm; lịch học đề xuất theo tuần (kể cả trước khi vào kỳ); vòng học mỗi chương vẽ tay → PlantUML → so đáp án; cách đọc sách Gomaa song song slide khi còn yếu tiếng Anh; cấu trúc đề PE 85 phút và cách luyện; dấu hiệu đang học sai và checklist cuối mỗi chương.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ Start here 2/2 · added by this site</span>
<h2>SWD392 is a drawing course disguised as a reading course</h2>
<p class="lead">The slides look like text to read. The exams and the project ask you to <em>produce</em> diagrams and decisions. This page turns the syllabus into a plan: what happens in each of the 60 sessions, what to do each week, how to practise one chapter, and how to rehearse the 85-minute practical exam.</p>
<p>The syllabus budgets <strong>150 study hours</strong>: 45 contact hours (60 sessions), the 145-minute final exam, and about <strong>102.6 hours of self-study</strong>. In other words, roughly two hours on your own for every hour in class. The plan below is built around that number.</p>`,
    `<span class="eyebrow">Mục 0 · ⭐ Bắt đầu tại đây 2/2 · phần web tự thêm</span>
<h2>SWD392 là môn VẼ đội lốt môn ĐỌC</h2>
<p class="lead">Slide trông như chữ để đọc. Nhưng bài thi và project bắt bạn <em>làm ra</em> sơ đồ và quyết định. Trang này biến đề cương thành kế hoạch: mỗi buổi trong 60 buổi học gì, mỗi tuần làm gì, luyện một chương ra sao, và tập dượt bài thi thực hành 85 phút thế nào.</p>
<p>Đề cương tính <strong>150 giờ học</strong>: 45 giờ trên lớp (60 buổi), 145 phút thi cuối, và khoảng <strong>102,6 giờ tự học</strong>. Nói cách khác, cứ một giờ trên lớp thì cần khoảng hai giờ tự học. Kế hoạch dưới đây dựng quanh con số đó.</p>`),
    bi(`<h2>1. The 60 sessions ↔ chapters ↔ decks ↔ marks</h2>
<p>Session topics are copied from the syllabus (ID 14179). "Deck" is the school slide deck as numbered on this site (swd1 … swd27); "Web" is the section of this course where you study it.</p>
<table>
<thead><tr><th>Sessions</th><th>Syllabus topic</th><th>Gomaa chapter · deck</th><th>Web</th><th>Marks it feeds</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>Course introduction · Intro to Software Design</td><td>Ch.0 swd1 · Ch.1 swd2 · Ch.2 swd3</td><td>Section 0, Chapter 1</td><td>TE</td></tr>
<tr><td>4–6</td><td>Intro to Software Design (Ch.3–4) · Course Project introduction (session 4)</td><td>Ch.3 swd4 · Ch.4 swd5</td><td>Chapter 1</td><td>TE, Project</td></tr>
<tr><td>7–10</td><td>Requirements and use case modeling (Ch.5–6) · Software quality attributes (Ch.20) · session 10: ChatGPT for use case descriptions, Copilot for boilerplate</td><td>Ch.5 swd6 · Ch.6 swd7 · Ch.20 swd8</td><td>Chapters 1, 2, 3</td><td>Project Eval 1, TE</td></tr>
<tr><td>11–14</td><td>Static modeling (Ch.7) · Object and class structuring (Ch.8)</td><td>Ch.7 swd9 · Ch.8 swd10</td><td>Chapter 2</td><td>PE Q1 (3 pts)</td></tr>
<tr><td>15–18</td><td>Dynamic interaction modeling (Ch.9, 11) · Finite state machines (Ch.10) · session 18: PlantUML diagrams</td><td>Ch.9 swd11 · Ch.10 swd12 · Ch.11 swd13</td><td>Chapter 2</td><td>PE Q2 (3 pts), PE Q3 (2 pts)</td></tr>
<tr><td>19–21</td><td>Design patterns: introduction, creational and structural, behavioral</td><td>Appendix swd14 (+ SOLID swd15)</td><td>Chapter 4</td><td>PE Q5, Project Eval 2, TE</td></tr>
<tr><td>22–25</td><td>Session 22: ChatGPT to suggest patterns + <strong>Progress test 1</strong> · Course Project on-going assessment 1</td><td>—</td><td>—</td><td>PT, Project Eval 1</td></tr>
<tr><td>26–29</td><td>Overview of software architecture (Ch.12) · Subsystem architectural design (Ch.13)</td><td>Ch.12 swd16 · Ch.13 swd17</td><td>Chapter 3</td><td>PE Q4, SDD</td></tr>
<tr><td>30–33</td><td>Object-oriented software architectures (Ch.14)</td><td>Ch.14 swd18</td><td>Chapter 3</td><td>PE Q4, TE</td></tr>
<tr><td>34–37</td><td>Client/server architectures (Ch.15) + Banking case study (Ch.21)</td><td>Ch.15 swd19 · Ch.21 swd20</td><td>Chapter 3</td><td>PE Q4, TE</td></tr>
<tr><td>38–41</td><td>Session 38: <strong>Progress test 2</strong> + ChatGPT/PlantUML for patterns · Course Project on-going assessment 2</td><td>—</td><td>—</td><td>PT, Project Eval 2</td></tr>
<tr><td>42–45</td><td>Service-oriented architectures (Ch.16) + Online Shopping case (Ch.22)</td><td>Ch.16 swd21 · Ch.22 swd22</td><td>Chapter 3</td><td>TE</td></tr>
<tr><td>46–49</td><td>Component-based architectures (Ch.17) + Emergency Monitoring case (Ch.23)</td><td>Ch.17 swd23 · Ch.23 swd24</td><td>Chapter 3</td><td>TE (lighter)</td></tr>
<tr><td>50–53</td><td>Concurrent and real-time architectures (Ch.18) + AGV case (Ch.24)</td><td>Ch.18 swd25 · Ch.24 swd26</td><td>Chapter 3</td><td>TE (lighter)</td></tr>
<tr><td>54</td><td><strong>Progress test 3</strong> · AI for architecture documentation, PlantUML/Mermaid, pattern suggestions</td><td>GenAI deck swd27</td><td>Chapter 5</td><td>PT, Project</td></tr>
<tr><td>55–59</td><td>Course Project final evaluation (teams 1–4, then 5–6)</td><td>—</td><td>Chapter 6</td><td>Project 25%</td></tr>
<tr><td>60</td><td>Course review</td><td>—</td><td>Final Exam</td><td>PE 20% + TE 40%</td></tr>
</tbody>
</table>
<p class="meo">🧠 Notice the rhythm: <strong>theory block → progress test + project checkpoint → theory block → …</strong>. Each progress test lands right after a block, so the fastest way to do well is to finish each chapter's practice lesson <em>before</em> the test, not the night before the final.</p>`,
    `<h2>1. 60 buổi ↔ chương ↔ bộ slide ↔ điểm</h2>
<p>Chủ đề từng buổi chép từ đề cương (mã 14179). "Bộ slide" là deck của trường theo số thứ tự trên web này (swd1 … swd27); "Web" là section của khoá này nơi bạn học phần đó.</p>
<table>
<thead><tr><th>Buổi</th><th>Chủ đề trong đề cương</th><th>Chương Gomaa · bộ slide</th><th>Web</th><th>Nuôi phần điểm nào</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>Giới thiệu môn · Nhập môn thiết kế phần mềm</td><td>Ch.0 swd1 · Ch.1 swd2 · Ch.2 swd3</td><td>Mục 0, Chương 1</td><td>TE</td></tr>
<tr><td>4–6</td><td>Nhập môn thiết kế (Ch.3–4) · giới thiệu Course Project (buổi 4)</td><td>Ch.3 swd4 · Ch.4 swd5</td><td>Chương 1</td><td>TE, Project</td></tr>
<tr><td>7–10</td><td>Mô hình yêu cầu và use case (Ch.5–6) · thuộc tính chất lượng (Ch.20) · buổi 10: ChatGPT viết đặc tả use case, Copilot sinh code khung</td><td>Ch.5 swd6 · Ch.6 swd7 · Ch.20 swd8</td><td>Chương 1, 2, 3</td><td>Project Eval 1, TE</td></tr>
<tr><td>11–14</td><td>Mô hình tĩnh (Ch.7) · Cấu trúc hoá đối tượng và lớp (Ch.8)</td><td>Ch.7 swd9 · Ch.8 swd10</td><td>Chương 2</td><td>PE câu 1 (3 điểm)</td></tr>
<tr><td>15–18</td><td>Mô hình tương tác động (Ch.9, 11) · Máy trạng thái hữu hạn (Ch.10) · buổi 18: vẽ bằng PlantUML</td><td>Ch.9 swd11 · Ch.10 swd12 · Ch.11 swd13</td><td>Chương 2</td><td>PE câu 2 (3 điểm), câu 3 (2 điểm)</td></tr>
<tr><td>19–21</td><td>Design patterns: nhập môn, nhóm khởi tạo và cấu trúc, nhóm hành vi</td><td>Phụ lục swd14 (+ SOLID swd15)</td><td>Chương 4</td><td>PE câu 5, Project Eval 2, TE</td></tr>
<tr><td>22–25</td><td>Buổi 22: ChatGPT gợi ý pattern + <strong>Progress test 1</strong> · đánh giá giữa kỳ Course Project lần 1</td><td>—</td><td>—</td><td>PT, Project Eval 1</td></tr>
<tr><td>26–29</td><td>Tổng quan kiến trúc (Ch.12) · Thiết kế kiến trúc hệ con — subsystem (Ch.13)</td><td>Ch.12 swd16 · Ch.13 swd17</td><td>Chương 3</td><td>PE câu 4, SDD</td></tr>
<tr><td>30–33</td><td>Kiến trúc hướng đối tượng (Ch.14)</td><td>Ch.14 swd18</td><td>Chương 3</td><td>PE câu 4, TE</td></tr>
<tr><td>34–37</td><td>Kiến trúc client/server (Ch.15) + case Ngân hàng (Ch.21)</td><td>Ch.15 swd19 · Ch.21 swd20</td><td>Chương 3</td><td>PE câu 4, TE</td></tr>
<tr><td>38–41</td><td>Buổi 38: <strong>Progress test 2</strong> + ChatGPT/PlantUML gợi ý pattern · đánh giá giữa kỳ Course Project lần 2</td><td>—</td><td>—</td><td>PT, Project Eval 2</td></tr>
<tr><td>42–45</td><td>Kiến trúc hướng dịch vụ — SOA (Ch.16) + case Mua sắm online (Ch.22)</td><td>Ch.16 swd21 · Ch.22 swd22</td><td>Chương 3</td><td>TE</td></tr>
<tr><td>46–49</td><td>Kiến trúc dựa trên thành phần (Ch.17) + case Giám sát khẩn cấp (Ch.23)</td><td>Ch.17 swd23 · Ch.23 swd24</td><td>Chương 3</td><td>TE (nhẹ)</td></tr>
<tr><td>50–53</td><td>Kiến trúc đồng thời và thời gian thực (Ch.18) + case xe AGV (Ch.24)</td><td>Ch.18 swd25 · Ch.24 swd26</td><td>Chương 3</td><td>TE (nhẹ)</td></tr>
<tr><td>54</td><td><strong>Progress test 3</strong> · AI hỗ trợ viết tài liệu kiến trúc, PlantUML/Mermaid, gợi ý pattern</td><td>Bộ GenAI swd27</td><td>Chương 5</td><td>PT, Project</td></tr>
<tr><td>55–59</td><td>Bảo vệ cuối Course Project (nhóm 1–4, rồi 5–6)</td><td>—</td><td>Chương 6</td><td>Project 25%</td></tr>
<tr><td>60</td><td>Ôn tập môn</td><td>—</td><td>Thi cuối kỳ</td><td>PE 20% + TE 40%</td></tr>
</tbody>
</table>
<p class="meo">🧠 Để ý nhịp: <strong>khối lý thuyết → progress test + mốc project → khối lý thuyết → …</strong>. Progress test nào cũng rơi ngay sau một khối, nên cách nhanh nhất để làm tốt là xong bài 🧪 thực hành của chương <em>trước</em> buổi test, chứ không phải đêm trước thi cuối.</p>`),
    bi(`<h2>2. A weekly plan (and what to do before the term starts)</h2>
<p>How the 60 sessions spread over weeks depends on your timetable on FAP — check it. The plan below assumes about 10 teaching weeks (6 sessions a week) and about 10 hours of self-study per week, which is what the syllabus' 102.6 hours works out to.</p>
<table>
<thead><tr><th>Week</th><th>Sessions</th><th>In class</th><th>Your self-study (≈10 h)</th></tr></thead>
<tbody>
<tr><td>Before the term</td><td>—</td><td>—</td><td>Section 0 (these four ⭐ lessons + 0.A), draw the first LabFlow diagrams, install PlantUML. If you have time, read Chapter 1 slide by slide</td></tr>
<tr><td>1</td><td>1–6</td><td>Ch.1–4, project introduced</td><td>Finish web Chapter 1; form a team; pick a project topic (lesson 0.5)</td></tr>
<tr><td>2</td><td>7–12</td><td>Ch.5–6, Ch.20, Ch.7 starts</td><td>Use case diagram + 3 use case descriptions for your project; Chapter 2 practice (use cases)</td></tr>
<tr><td>3</td><td>13–18</td><td>Ch.7–11</td><td>One class diagram, one sequence diagram, one statechart per day, timed; Chapter 2 quiz</td></tr>
<tr><td>4</td><td>19–24</td><td>Patterns, PT1, project assessment 1</td><td>Pattern flash cards (problem → pattern → UML); project Evaluation 1 deliverables</td></tr>
<tr><td>5</td><td>25–30</td><td>Project assessment, Ch.12–14</td><td>Draw your project's subsystem/layer diagram</td></tr>
<tr><td>6</td><td>31–36</td><td>Ch.14–15, Ch.21</td><td>Client/server case study; first full <strong>timed PE rehearsal</strong> (section 5 below)</td></tr>
<tr><td>7</td><td>37–42</td><td>PT2, project assessment 2, Ch.16</td><td>Evaluation 2: component + deployment diagrams, 3 patterns</td></tr>
<tr><td>8</td><td>43–48</td><td>Ch.16–17, Ch.22–23</td><td>SOA and component case studies — definitions and main diagrams</td></tr>
<tr><td>9</td><td>49–54</td><td>Ch.18, Ch.24, PT3</td><td>Real-time basics; second timed PE rehearsal; project report</td></tr>
<tr><td>10</td><td>55–60</td><td>Project defense, review</td><td>Rehearse the defense; third PE rehearsal; TE review from your mistake list</td></tr>
</tbody>
</table>`,
    `<h2>2. Kế hoạch theo tuần (và việc cần làm trước khi vào kỳ)</h2>
<p>60 buổi rải ra bao nhiêu tuần tuỳ thời khoá biểu của bạn trên FAP — hãy kiểm tra. Kế hoạch dưới giả định khoảng 10 tuần học (6 buổi/tuần) và khoảng 10 giờ tự học mỗi tuần, đúng bằng con số 102,6 giờ của đề cương chia ra.</p>
<table>
<thead><tr><th>Tuần</th><th>Buổi</th><th>Trên lớp</th><th>Bạn tự học (≈10 giờ)</th></tr></thead>
<tbody>
<tr><td>Trước khi vào kỳ</td><td>—</td><td>—</td><td>Mục 0 (bốn bài ⭐ này + 0.A), vẽ sơ đồ LabFlow đầu tiên, cài PlantUML. Còn thời gian thì học Chương 1 theo từng slide</td></tr>
<tr><td>1</td><td>1–6</td><td>Ch.1–4, giới thiệu project</td><td>Xong Chương 1 trên web; lập nhóm; chọn đề tài project (bài 0.5)</td></tr>
<tr><td>2</td><td>7–12</td><td>Ch.5–6, Ch.20, bắt đầu Ch.7</td><td>Use case diagram + 3 đặc tả use case cho project của nhóm; bài 🧪 thực hành Chương 2 (phần use case)</td></tr>
<tr><td>3</td><td>13–18</td><td>Ch.7–11</td><td>Mỗi ngày một class diagram, một sequence diagram, một statechart, có bấm giờ; quiz Chương 2</td></tr>
<tr><td>4</td><td>19–24</td><td>Pattern, PT1, đánh giá project lần 1</td><td>Thẻ ghi nhớ pattern (vấn đề → pattern → UML); sản phẩm Evaluation 1 của project</td></tr>
<tr><td>5</td><td>25–30</td><td>Đánh giá project, Ch.12–14</td><td>Vẽ sơ đồ hệ con/phân tầng cho project</td></tr>
<tr><td>6</td><td>31–36</td><td>Ch.14–15, Ch.21</td><td>Case client/server; <strong>tập dượt PE có bấm giờ</strong> lần đầu (mục 5 bên dưới)</td></tr>
<tr><td>7</td><td>37–42</td><td>PT2, đánh giá project lần 2, Ch.16</td><td>Evaluation 2: component diagram + deployment diagram, 3 pattern</td></tr>
<tr><td>8</td><td>43–48</td><td>Ch.16–17, Ch.22–23</td><td>Case SOA và component — định nghĩa và sơ đồ chính</td></tr>
<tr><td>9</td><td>49–54</td><td>Ch.18, Ch.24, PT3</td><td>Nền tảng real-time; tập dượt PE lần hai; viết báo cáo project</td></tr>
<tr><td>10</td><td>55–60</td><td>Bảo vệ project, ôn tập</td><td>Tập bảo vệ; tập dượt PE lần ba; ôn TE từ sổ lỗi sai của bạn</td></tr>
</tbody>
</table>`),
    bi(`<h2>3. The study loop for one chapter: by hand → PlantUML → compare</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b6b7d7d0c19e6c53cd94452eb57ac09078703ef5.svg" alt="One study loop per chapter (repeat for every chapter)" loading="lazy" /><p class="chu-thich">🧩 One study loop per chapter (repeat for every chapter)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' The study loop for every chapter
title One study loop per chapter (repeat for every chapter)
start
:Read the slide-by-slide lesson\\n(one sitting, 25–40 min);
:Close the page. Draw the chapter's diagram\\nBY HAND on paper from a short scenario;
:Type the same diagram in PlantUML\\nand render it;
if (Render error or looks wrong?) then (yes)
  :Fix syntax · re-read the notation rule\\n(arrow type, multiplicity, stereotype);
else (no)
endif
:Compare with the model answer\\nin the practice lesson;
:Write down every difference\\nin your own mistake list;
:Do the chapter quiz (10 questions)\\n— read every explanation;
if (Score &gt;= 8/10 and mistake list understood?) then (yes)
  :Next chapter;
else (no)
  :Redo one exercise tomorrow\\n(spaced repetition);
endif
stop
@enduml</code></pre></details>
<p>Why draw <strong>by hand first</strong>? Because the thinking is in the choices — which classes exist, which arrow, which multiplicity — not in the tool. If you start in a tool, you spend your attention on dragging boxes. A pencil sketch takes three minutes and shows you immediately what you do not know.</p>
<p>Why <strong>PlantUML second</strong>? Typing the diagram forces you to name every relationship precisely (<code>*--</code> composition, <code>o--</code> aggregation, <code>&lt;|--</code> inheritance, <code>..&gt;</code> dependency). A wrong symbol is a visible wrong character, easy to spot when you compare. And every diagram on this site comes with its PlantUML source under "PlantUML code", so you can compare text to text.</p>
<p>Why <strong>a mistake list</strong>? Because you will make the same five mistakes repeatedly (reversed include arrow, aggregation where composition was meant, missing multiplicity, a screen named as a use case, an entity with no attributes…). Writing them down once is how they stop.</p>
<p class="meo">🧠 A good day of SWD392 self-study is <strong>one diagram drawn, rendered, compared and corrected</strong> — not twenty slides read.</p>`,
    `<h2>3. Vòng học cho một chương: vẽ tay → PlantUML → so đáp án</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/b6b7d7d0c19e6c53cd94452eb57ac09078703ef5.svg" alt="One study loop per chapter (repeat for every chapter)" loading="lazy" /><p class="chu-thich">🧩 One study loop per chapter (repeat for every chapter)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Vòng học lặp lại cho mỗi chương
title One study loop per chapter (repeat for every chapter)
start
:Read the slide-by-slide lesson\\n(one sitting, 25–40 min);
:Close the page. Draw the chapter's diagram\\nBY HAND on paper from a short scenario;
:Type the same diagram in PlantUML\\nand render it;
if (Render error or looks wrong?) then (yes)
  :Fix syntax · re-read the notation rule\\n(arrow type, multiplicity, stereotype);
else (no)
endif
:Compare with the model answer\\nin the practice lesson;
:Write down every difference\\nin your own mistake list;
:Do the chapter quiz (10 questions)\\n— read every explanation;
if (Score &gt;= 8/10 and mistake list understood?) then (yes)
  :Next chapter;
else (no)
  :Redo one exercise tomorrow\\n(spaced repetition);
endif
stop
@enduml</code></pre></details>
<p>Vì sao <strong>vẽ tay trước</strong>? Vì phần tư duy nằm ở các lựa chọn — có những lớp nào, mũi tên loại gì, bội số (multiplicity) bao nhiêu — chứ không nằm ở công cụ. Bắt đầu bằng công cụ thì sự chú ý của bạn dồn vào kéo thả hộp. Phác bằng bút chì mất ba phút và cho bạn thấy ngay mình chưa hiểu chỗ nào.</p>
<p>Vì sao <strong>PlantUML sau đó</strong>? Gõ sơ đồ bắt bạn gọi đúng tên từng quan hệ (<code>*--</code> hợp thành — composition, <code>o--</code> kết tập — aggregation, <code>&lt;|--</code> kế thừa, <code>..&gt;</code> phụ thuộc — dependency). Ký hiệu sai là một ký tự sai nhìn thấy được, so đáp án phát hiện ngay. Và mọi sơ đồ trên web này đều kèm mã PlantUML ở mục "Mã PlantUML", nên bạn so được chữ với chữ.</p>
<p>Vì sao cần <strong>sổ lỗi sai</strong>? Vì bạn sẽ lặp đi lặp lại cùng năm lỗi (mũi tên include ngược, dùng aggregation khi ý là composition, thiếu bội số, đặt tên màn hình làm use case, entity không có thuộc tính…). Ghi chúng ra một lần là cách để chúng dừng lại.</p>
<p class="meo">🧠 Một ngày tự học SWD392 tốt là <strong>một sơ đồ được vẽ, dựng, so và sửa</strong> — không phải hai mươi slide đã đọc.</p>`),
    bi(`<h2>4. Reading Gomaa's book next to the slides (with weak English)</h2>
<p>The school slides are summaries of Hassan Gomaa's <em>Software Modeling and Design</em>. Each "📑 slide by slide" lesson on this site already explains every slide in Vietnamese and English. Use the book as a <strong>reference</strong>, not a novel:</p>
<ol>
<li><strong>Slides first, book second.</strong> Finish the web lesson for a deck, then open the matching book chapter.</li>
<li><strong>Read the figures before the text.</strong> Gomaa's chapters are built around figures (use case diagrams, class diagrams of the Banking System, statecharts of the ATM). Look at a figure, try to explain it aloud in Vietnamese, then read the paragraph around it to check.</li>
<li><strong>Read the chapter summary and the case study sections.</strong> The case studies (Banking, Online Shopping, Emergency Monitoring, AGV) come back in Chapters 21–24 and in exam questions.</li>
<li><strong>Keep a glossary.</strong> Every practice lesson on this site ends with a 🗂 Glossary table (English term, Vietnamese meaning, one sentence). Add your own words to it; review it before the TE.</li>
<li><strong>Do not translate whole pages.</strong> If a paragraph is still unclear after the figure and the glossary, copy just that paragraph into a translator — then check the result against the slide.</li>
</ol>
<div class="pitfall">⚠️ The book, the slides and your lecturer sometimes use slightly different notation details (for example, arrowheads on actor–use case lines, or how an extend condition is written). In the exam, follow <strong>what your lecturer accepts</strong>. When the web lesson notices a difference between slide and book, it says so explicitly.</div>`,
    `<h2>4. Đọc sách Gomaa song song slide (khi còn yếu tiếng Anh)</h2>
<p>Slide của trường là bản tóm tắt cuốn <em>Software Modeling and Design</em> của Hassan Gomaa. Mỗi bài "📑 học theo từng slide" trên web đã giảng từng slide bằng tiếng Việt và tiếng Anh. Hãy dùng sách để <strong>tra cứu</strong>, không đọc như tiểu thuyết:</p>
<ol>
<li><strong>Slide trước, sách sau.</strong> Xong bài web của một bộ slide rồi mới mở chương sách tương ứng.</li>
<li><strong>Đọc hình trước khi đọc chữ.</strong> Mỗi chương của Gomaa xây quanh các hình (use case diagram, class diagram của hệ Ngân hàng, statechart của máy ATM). Nhìn một hình, thử giải thích to bằng tiếng Việt, rồi mới đọc đoạn văn quanh nó để kiểm tra.</li>
<li><strong>Đọc phần tóm tắt chương và các phần case study.</strong> Các case study (Ngân hàng, Mua sắm online, Giám sát khẩn cấp, xe AGV) quay lại ở Chapter 21–24 và trong câu hỏi thi.</li>
<li><strong>Giữ một bảng thuật ngữ.</strong> Mỗi bài thực hành trên web kết bằng bảng 🗂 Thuật ngữ (thuật ngữ tiếng Anh, nghĩa tiếng Việt, một câu giải thích). Thêm từ của riêng bạn vào; ôn nó trước TE.</li>
<li><strong>Đừng dịch cả trang.</strong> Nếu một đoạn vẫn khó hiểu sau khi xem hình và tra bảng thuật ngữ, chỉ chép đúng đoạn đó vào công cụ dịch — rồi đối chiếu lại với slide.</li>
</ol>
<div class="pitfall">⚠️ Sách, slide và giảng viên đôi khi khác nhau ở chi tiết ký hiệu (ví dụ có vẽ đầu mũi tên trên đường nối actor–use case không, hay điều kiện extend viết thế nào). Trong phòng thi, làm theo <strong>cách giảng viên của bạn chấp nhận</strong>. Khi bài web thấy slide và sách khác nhau, bài sẽ nói rõ.</div>`),
    bi(`<h2>5. Practising for the PE — know the shape of the exam</h2>
<p>The school's PE template (SU25, "Library Management System" scenario) has a fixed shape. The instructions say: draw all diagrams using a UML tool, and submit diagrams and written answers in <strong>one document</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/95e1b12a44ae246e1abbc54cea3b42b68458e9c3.svg" alt="Sample PE (SU25 template) — 5 questions · 10 points · 85 minutes (suggested timing)" loading="lazy" /><p class="chu-thich">🧩 Sample PE (SU25 template) — 5 questions · 10 points · 85 minutes (suggested timing)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Structure of the sample PE (SU25 template): 5 questions, 10 points, 85 minutes
title Sample PE (SU25 template) — 5 questions · 10 points · 85 minutes (suggested timing)
left to right direction
rectangle "Q1 · 3.0 pts\\nClass diagram (entity level)\\naggregation · composition\\ngeneralization · multiplicity\\n≈ 25 min" as Q1
rectangle "Q2 · 3.0 pts\\nSequence OR communication\\nwith «boundary» «control»\\n«service» «entity»\\n≈ 25 min" as Q2
rectangle "Q3 · 2.0 pts\\nStatechart of one object\\nstates · events · actions\\n≈ 15 min" as Q3
rectangle "Q4 · 1.0 pt\\nPropose an architecture\\n+ why · 1 pro · 1 con\\n≈ 7 min" as Q4
rectangle "Q5 · 1.0 pt\\nName a design pattern\\n+ why it fits\\n≈ 5 min" as Q5
Q1 --&gt; Q2
Q2 --&gt; Q3
Q3 --&gt; Q4
Q4 --&gt; Q5
note bottom of Q5
  ≈ 8 min left to check
  and export images
  into ONE document
end note
@enduml</code></pre></details>
<table>
<thead><tr><th>Question</th><th>Points</th><th>What is asked (template)</th><th>Chapter to master</th></tr></thead>
<tbody>
<tr><td>1</td><td>3.0</td><td>Class diagram at entity level (names only), with aggregation, composition, generalization and multiplicities</td><td>Ch.7 static modeling</td></tr>
<tr><td>2</td><td>3.0</td><td>Choose sequence OR communication diagram for a time-ordered flow, draw it, label every object with its stereotype («boundary», «control», «service», «entity»)</td><td>Ch.8 structuring + Ch.9 dynamic interaction</td></tr>
<tr><td>3</td><td>2.0</td><td>Statechart of one object: all given states, the events that trigger transitions, and actions</td><td>Ch.10 finite state machines</td></tr>
<tr><td>4</td><td>1.0</td><td>Propose an architecture, explain why, one advantage and one disadvantage</td><td>Ch.12–16</td></tr>
<tr><td>5</td><td>1.0</td><td>Name the design pattern described (the template's example describes Strategy) and explain why it fits</td><td>Design Patterns appendix</td></tr>
</tbody>
</table>
<p>The minute estimates in the diagram are a <strong>suggestion</strong> proportional to the points, leaving about 8 minutes to check and export. How to rehearse:</p>
<ol>
<li>From week 6, once every two weeks: take a practice scenario (the school PE template itself first, then scenarios from the chapter practice lessons), set a timer for 85 minutes, and do all five questions in the tool you will use in the exam.</li>
<li>Mark yourself with the model answer. For Q1, count multiplicities and relationship kinds; for Q2, count stereotypes and message order; for Q3, check that every given state and event appears.</li>
<li>Put every lost point in your mistake list.</li>
</ol>
<div class="pitfall">⚠️ Two classic PE losses: (1) reading "entity level (showing only class names, no attributes)" and still spending ten minutes writing attributes; (2) in Q2, drawing the objects correctly but forgetting the stereotypes — the question says <em>you must</em> label them. Read each question's "Task" line twice.</div>
<p class="nhan">Which tool is allowed in the exam room?</p>
<p>The template only says "a UML tool". Which tools are installed on the exam machines is decided by the lecturer and the exam office each term — <strong>ask your lecturer early</strong>, and practise in that tool. The next lesson covers installing the common ones.</p>`,
    `<h2>5. Luyện PE — nắm hình dạng đề thi</h2>
<p>Mẫu đề PE của trường (SU25, bối cảnh "Library Management System" — hệ quản lý thư viện) có hình dạng cố định. Phần hướng dẫn ghi: vẽ mọi sơ đồ bằng một công cụ UML, nộp sơ đồ và câu trả lời viết trong <strong>một tài liệu duy nhất</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/95e1b12a44ae246e1abbc54cea3b42b68458e9c3.svg" alt="Sample PE (SU25 template) — 5 questions · 10 points · 85 minutes (suggested timing)" loading="lazy" /><p class="chu-thich">🧩 Sample PE (SU25 template) — 5 questions · 10 points · 85 minutes (suggested timing)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Cấu trúc đề PE mẫu (SU25): 5 câu, 10 điểm, 85 phút
title Sample PE (SU25 template) — 5 questions · 10 points · 85 minutes (suggested timing)
left to right direction
rectangle "Q1 · 3.0 pts\\nClass diagram (entity level)\\naggregation · composition\\ngeneralization · multiplicity\\n≈ 25 min" as Q1
rectangle "Q2 · 3.0 pts\\nSequence OR communication\\nwith «boundary» «control»\\n«service» «entity»\\n≈ 25 min" as Q2
rectangle "Q3 · 2.0 pts\\nStatechart of one object\\nstates · events · actions\\n≈ 15 min" as Q3
rectangle "Q4 · 1.0 pt\\nPropose an architecture\\n+ why · 1 pro · 1 con\\n≈ 7 min" as Q4
rectangle "Q5 · 1.0 pt\\nName a design pattern\\n+ why it fits\\n≈ 5 min" as Q5
Q1 --&gt; Q2
Q2 --&gt; Q3
Q3 --&gt; Q4
Q4 --&gt; Q5
note bottom of Q5
  ≈ 8 min left to check
  and export images
  into ONE document
end note
@enduml</code></pre></details>
<table>
<thead><tr><th>Câu</th><th>Điểm</th><th>Đề hỏi gì (theo mẫu)</th><th>Chương phải nắm</th></tr></thead>
<tbody>
<tr><td>1</td><td>3,0</td><td>Class diagram mức thực thể (chỉ tên lớp), có aggregation (kết tập), composition (hợp thành), generalization (tổng quát hoá) và bội số</td><td>Ch.7 mô hình tĩnh</td></tr>
<tr><td>2</td><td>3,0</td><td>Chọn sequence HOẶC communication diagram cho một luồng có thứ tự thời gian, vẽ nó, ghi stereotype cho mọi đối tượng («boundary», «control», «service», «entity»)</td><td>Ch.8 cấu trúc hoá + Ch.9 tương tác động</td></tr>
<tr><td>3</td><td>2,0</td><td>Statechart của một đối tượng: đủ các trạng thái cho sẵn, sự kiện (event) kích hoạt chuyển trạng thái, và hành động (action)</td><td>Ch.10 máy trạng thái hữu hạn</td></tr>
<tr><td>4</td><td>1,0</td><td>Đề xuất một kiến trúc, giải thích vì sao, một ưu điểm và một nhược điểm</td><td>Ch.12–16</td></tr>
<tr><td>5</td><td>1,0</td><td>Gọi tên design pattern được mô tả (ví dụ trong mẫu đang tả Strategy) và giải thích vì sao hợp</td><td>Phụ lục Design Patterns</td></tr>
</tbody>
</table>
<p>Số phút trong sơ đồ là <strong>gợi ý</strong> chia theo điểm, chừa khoảng 8 phút để soát và xuất ảnh. Cách tập dượt:</p>
<ol>
<li>Từ tuần 6, hai tuần một lần: lấy một kịch bản luyện tập (trước hết chính mẫu đề PE của trường, sau đó các kịch bản trong bài thực hành từng chương), đặt đồng hồ 85 phút, làm đủ năm câu bằng đúng công cụ bạn sẽ dùng trong phòng thi.</li>
<li>Tự chấm theo đáp án mẫu. Câu 1: đếm bội số và loại quan hệ; câu 2: đếm stereotype và thứ tự thông điệp; câu 3: kiểm mọi trạng thái và sự kiện đề cho đều có mặt.</li>
<li>Mỗi điểm bị mất ghi vào sổ lỗi sai.</li>
</ol>
<div class="pitfall">⚠️ Hai kiểu mất điểm PE kinh điển: (1) đọc "entity level (showing only class names, no attributes)" mà vẫn mất mười phút ghi thuộc tính; (2) câu 2 vẽ đúng đối tượng nhưng quên stereotype — đề ghi <em>you must</em> (bắt buộc) ghi chúng. Đọc dòng "Task" của mỗi câu hai lần.</div>
<p class="nhan">Phòng thi cho dùng công cụ nào?</p>
<p>Mẫu đề chỉ ghi "a UML tool" (một công cụ UML). Máy thi cài công cụ nào là do giảng viên và phòng khảo thí quyết định từng kỳ — <strong>hỏi giảng viên từ sớm</strong>, và luyện bằng đúng công cụ đó. Bài tiếp theo hướng dẫn cài các công cụ phổ biến.</p>`),
    bi(`<h2>6. Signs you are studying the wrong way — and the fix</h2>
<table>
<thead><tr><th>Sign</th><th>What it means</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>You have read every slide but never drawn a diagram</td><td>You are preparing for a reading test that does not exist</td><td>Start the loop in section 3 today, one diagram</td></tr>
<tr><td>You can define "composition" but hesitate to choose between it and aggregation for a real pair (Library–Bookshelf)</td><td>Knowledge without decision practice</td><td>Do the "which relationship?" exercises in the Chapter 2 practice lesson; always justify with "can the part exist without the whole?"</td></tr>
<tr><td>Your diagrams look right but you cannot explain why each class exists</td><td>Copying shapes (or AI output) instead of deriving them</td><td>For each class, write one sentence: "exists because the requirement says …"</td></tr>
<tr><td>You open ChatGPT before thinking</td><td>The project requires declaring AI use and <strong>explaining</strong> the output; the exam has no AI</td><td>Draw your own version first, then ask AI to critique it</td></tr>
<tr><td>You skip quizzes because "they are only practice"</td><td>You lose the explanations, which are where most exam traps are described</td><td>Do every quiz; read every explanation, even for correct answers</td></tr>
<tr><td>You study only before progress tests</td><td>The next block builds on the previous one (use cases → classes → sequences)</td><td>Keep the weekly rhythm; a small amount every day beats a marathon</td></tr>
</tbody>
</table>`,
    `<h2>6. Dấu hiệu đang học sai — và cách sửa</h2>
<table>
<thead><tr><th>Dấu hiệu</th><th>Nghĩa là gì</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>Đã đọc hết slide nhưng chưa từng vẽ một sơ đồ</td><td>Bạn đang ôn cho một bài thi đọc không hề tồn tại</td><td>Bắt đầu vòng học ở mục 3 ngay hôm nay, một sơ đồ</td></tr>
<tr><td>Định nghĩa được "composition" nhưng lưỡng lự khi phải chọn giữa nó và aggregation cho một cặp thật (Library–Bookshelf)</td><td>Có kiến thức mà chưa luyện ra quyết định</td><td>Làm các bài "chọn quan hệ nào?" trong bài thực hành Chương 2; luôn lý giải bằng câu hỏi "phần có tồn tại được khi không có toàn thể không?"</td></tr>
<tr><td>Sơ đồ trông đúng nhưng không giải thích được vì sao có từng lớp</td><td>Đang chép hình dạng (hoặc chép AI) thay vì suy ra</td><td>Với mỗi lớp, viết một câu: "có vì yêu cầu nói …"</td></tr>
<tr><td>Mở ChatGPT trước khi tự nghĩ</td><td>Project bắt khai báo việc dùng AI và <strong>giải thích</strong> được kết quả; phòng thi không có AI</td><td>Tự vẽ bản của mình trước, rồi nhờ AI nhận xét</td></tr>
<tr><td>Bỏ quiz vì "chỉ là luyện tập"</td><td>Mất phần giải thích, nơi mô tả phần lớn các bẫy đề thi</td><td>Làm mọi quiz; đọc mọi lời giải thích, kể cả câu đã đúng</td></tr>
<tr><td>Chỉ học trước mỗi progress test</td><td>Khối sau xây trên khối trước (use case → lớp → tuần tự)</td><td>Giữ nhịp tuần; mỗi ngày một ít thắng một đêm chạy marathon</td></tr>
</tbody>
</table>`),
    bi(`<h2>7. Checklist at the end of every chapter</h2>
<ul>
<li>☐ I finished the 📑 slide-by-slide lesson(s) of the chapter.</li>
<li>☐ I drew at least one diagram of the chapter's type by hand, then in PlantUML, and compared it with a model answer.</li>
<li>☐ I did the 🧪 practice lesson and can explain every decision in its answers.</li>
<li>☐ I scored at least 8/10 on the chapter quiz and read every explanation.</li>
<li>☐ I added the new terms to my glossary and the new mistakes to my mistake list.</li>
<li>☐ I applied the chapter to my own project (or to LabFlow): one diagram that I could put in a report.</li>
<li>☐ I can say in one sentence where this chapter shows up in the PE, the TE or the project.</li>
</ul>
<p class="meo">🧠 Seven ticks per chapter. If a tick is missing, the chapter is not finished — even if all the slides are read.</p>`,
    `<h2>7. Checklist cuối mỗi chương</h2>
<ul>
<li>☐ Tôi đã xong (các) bài 📑 học theo từng slide của chương.</li>
<li>☐ Tôi đã tự vẽ ít nhất một sơ đồ loại của chương bằng tay, rồi bằng PlantUML, và so với đáp án mẫu.</li>
<li>☐ Tôi đã làm bài 🧪 thực hành và giải thích được mọi quyết định trong lời giải.</li>
<li>☐ Tôi đạt ít nhất 8/10 quiz chương và đã đọc mọi lời giải thích.</li>
<li>☐ Tôi đã thêm thuật ngữ mới vào bảng thuật ngữ và lỗi mới vào sổ lỗi sai.</li>
<li>☐ Tôi đã áp chương này vào project của mình (hoặc LabFlow): một sơ đồ đưa được vào báo cáo.</li>
<li>☐ Tôi nói được trong một câu chương này xuất hiện ở đâu trong PE, TE hoặc project.</li>
</ul>
<p class="meo">🧠 Bảy dấu tích mỗi chương. Thiếu một dấu là chương chưa xong — kể cả khi đã đọc hết slide.</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>self-study</strong></td><td>tự học</td><td>Hours you study outside class; the syllabus budgets about 102.6 hours for SWD392.</td></tr>
<tr><td><strong>Practical Exam (PE)</strong></td><td>thi thực hành</td><td>The 85-minute final exam part (20%) where you draw diagrams and make design decisions.</td></tr>
<tr><td><strong>Theory Exam (TE)</strong></td><td>thi lý thuyết</td><td>The 60-minute final exam part (40%) on concepts, notation and patterns.</td></tr>
<tr><td><strong>Progress test (PT)</strong></td><td>bài kiểm tra tiến độ</td><td>One of three short tests during the term, together worth 15%.</td></tr>
<tr><td><strong>stereotype</strong></td><td>khuôn mẫu (nhãn phân loại)</td><td>A label in guillemets such as «entity» that tells what kind of element a class or object is.</td></tr>
<tr><td><strong>multiplicity</strong></td><td>bội số</td><td>The numbers at the ends of an association, such as 1 and 0..*, saying how many objects take part.</td></tr>
<tr><td><strong>aggregation</strong></td><td>kết tập (quan hệ toàn thể–bộ phận lỏng)</td><td>A whole–part relationship where the part can exist without the whole (hollow diamond).</td></tr>
<tr><td><strong>composition</strong></td><td>hợp thành (quan hệ toàn thể–bộ phận chặt)</td><td>A whole–part relationship where the part cannot exist without the whole (filled diamond).</td></tr>
<tr><td><strong>generalization</strong></td><td>tổng quát hoá (kế thừa)</td><td>An "is-a" relationship between a general class and a more specific one (hollow triangle arrow).</td></tr>
<tr><td><strong>statechart</strong></td><td>sơ đồ trạng thái</td><td>A diagram of the states of one object and the events that move it between them.</td></tr>
<tr><td><strong>event</strong></td><td>sự kiện</td><td>Something that happens and can trigger a transition, such as "dueDate passes".</td></tr>
<tr><td><strong>case study</strong></td><td>nghiên cứu tình huống</td><td>A complete worked example system in the book (Banking, Online Shopping, Emergency Monitoring, AGV).</td></tr>
<tr><td><strong>spaced repetition</strong></td><td>ôn lặp giãn cách</td><td>Reviewing something again after a gap (a day, a week) so it moves into long-term memory.</td></tr>
<tr><td><strong>model answer</strong></td><td>đáp án mẫu</td><td>A worked solution you compare your own diagram against, decision by decision.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>self-study</strong></td><td>tự học</td><td>Giờ học ngoài lớp; đề cương tính khoảng 102,6 giờ cho SWD392.</td></tr>
<tr><td><strong>Practical Exam (PE)</strong></td><td>thi thực hành</td><td>Phần thi cuối 85 phút (20%) nơi bạn vẽ sơ đồ và ra quyết định thiết kế.</td></tr>
<tr><td><strong>Theory Exam (TE)</strong></td><td>thi lý thuyết</td><td>Phần thi cuối 60 phút (40%) về khái niệm, ký hiệu và pattern.</td></tr>
<tr><td><strong>Progress test (PT)</strong></td><td>bài kiểm tra tiến độ</td><td>Một trong ba bài kiểm tra ngắn trong kỳ, cộng lại 15%.</td></tr>
<tr><td><strong>stereotype</strong></td><td>khuôn mẫu (nhãn phân loại)</td><td>Nhãn trong ngoặc «» như «entity» cho biết phần tử là loại gì.</td></tr>
<tr><td><strong>multiplicity</strong></td><td>bội số</td><td>Các con số ở hai đầu liên kết như 1 và 0..*, cho biết bao nhiêu đối tượng tham gia.</td></tr>
<tr><td><strong>aggregation</strong></td><td>kết tập (quan hệ toàn thể–bộ phận lỏng)</td><td>Quan hệ toàn thể–bộ phận mà bộ phận tồn tại được khi không có toàn thể (hình thoi rỗng).</td></tr>
<tr><td><strong>composition</strong></td><td>hợp thành (quan hệ toàn thể–bộ phận chặt)</td><td>Quan hệ toàn thể–bộ phận mà bộ phận không tồn tại được khi không có toàn thể (hình thoi đặc).</td></tr>
<tr><td><strong>generalization</strong></td><td>tổng quát hoá (kế thừa)</td><td>Quan hệ "là một" giữa lớp tổng quát và lớp cụ thể hơn (mũi tên tam giác rỗng).</td></tr>
<tr><td><strong>statechart</strong></td><td>sơ đồ trạng thái</td><td>Sơ đồ các trạng thái của một đối tượng và các sự kiện chuyển nó giữa các trạng thái.</td></tr>
<tr><td><strong>event</strong></td><td>sự kiện</td><td>Điều xảy ra và có thể kích hoạt một chuyển trạng thái, ví dụ "dueDate passes".</td></tr>
<tr><td><strong>case study</strong></td><td>nghiên cứu tình huống</td><td>Một hệ thống ví dụ trọn vẹn trong sách (Ngân hàng, Mua sắm online, Giám sát khẩn cấp, xe AGV).</td></tr>
<tr><td><strong>spaced repetition</strong></td><td>ôn lặp giãn cách</td><td>Ôn lại một điều sau một khoảng (một ngày, một tuần) để nó vào trí nhớ dài hạn.</td></tr>
<tr><td><strong>model answer</strong></td><td>đáp án mẫu</td><td>Lời giải mẫu để so sơ đồ của bạn, từng quyết định một.</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── ⭐ Installing UML tools step by step — PlantUML, draw.io, Visual Paradigm/StarUML — and fixing the common errors ───────── */
const L_x_cai_cong_cu_uml = {
  title: '⭐ Installing UML tools step by step — PlantUML, draw.io, Visual Paradigm/StarUML — and fixing the common errors|||⭐ Cài công cụ vẽ UML từng bước — PlantUML, draw.io, Visual Paradigm/StarUML — và sửa các lỗi hay gặp',
  slug: 'swd392-cai-cong-cu-uml',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài tự thêm ngoài giáo trình, bổ sung bài 0.4: cài PlantUML ba cách (trình duyệt, VS Code, IntelliJ) cùng Java và Graphviz, hai sơ đồ thử cài đặt; dùng draw.io; cài Visual Paradigm Community hoặc StarUML; các công cụ đề cương nêu (Visual Paradigm, MagicDraw, Visio, Rational); bảng lỗi hay gặp (thiếu Graphviz, lỗi cú pháp, chữ tiếng Việt, sơ đồ quá to, ảnh mờ khi dán vào báo cáo); công cụ nào cho việc nào và phòng thi dùng gì.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ Setup · added by this site</span>
<h2>Install once, test with two tiny diagrams, and know what every error message means</h2>
<p class="lead">Lesson 0.4 lists the tools; this page installs them. You need exactly two things: <strong>PlantUML</strong> (every diagram on this site is written in it, and the syllabus names it in CLO7) and <strong>one visual modeling tool</strong> — ideally the one your exam room uses. Budget 30–45 minutes.</p>
<table>
<thead><tr><th>Tool</th><th>Type</th><th>Cost</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td>PlantUML</td><td>Text → diagram (you type, it draws)</td><td>Free, open source</td><td>Everything on this site; diagrams kept in Git; diagrams generated or checked with AI</td></tr>
<tr><td>draw.io (diagrams.net)</td><td>Drag-and-drop in the browser or a desktop app</td><td>Free</td><td>Quick sketches, context diagrams, anything with a free layout</td></tr>
<tr><td>Visual Paradigm Community Edition</td><td>Full UML modeling tool</td><td>Free for non-commercial use</td><td>Formal models with many linked diagrams, if your lecturer uses it</td></tr>
<tr><td>StarUML</td><td>UML modeling tool</td><td>Paid licence; unregistered use shows reminders</td><td>An alternative to Visual Paradigm</td></tr>
<tr><td>MagicDraw / Rational Software Architect / Visio</td><td>Named in the syllabus "Tools" line</td><td>Commercial</td><td>Only if the school machines provide them — do not buy anything</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · ⭐ Cài đặt · phần web tự thêm</span>
<h2>Cài một lần, thử bằng hai sơ đồ nhỏ, và hiểu mọi thông báo lỗi</h2>
<p class="lead">Bài 0.4 liệt kê công cụ; trang này cài chúng. Bạn cần đúng hai thứ: <strong>PlantUML</strong> (mọi sơ đồ trên web này viết bằng nó, và đề cương nêu tên nó ở CLO7) và <strong>một công cụ mô hình hoá kéo-thả</strong> — tốt nhất là đúng công cụ phòng thi của bạn dùng. Dành 30–45 phút.</p>
<table>
<thead><tr><th>Công cụ</th><th>Loại</th><th>Chi phí</th><th>Dùng cho việc gì</th></tr></thead>
<tbody>
<tr><td>PlantUML</td><td>Chữ → sơ đồ (bạn gõ, nó vẽ)</td><td>Miễn phí, mã nguồn mở</td><td>Mọi thứ trên web này; sơ đồ lưu trong Git; sơ đồ sinh hoặc kiểm bằng AI</td></tr>
<tr><td>draw.io (diagrams.net)</td><td>Kéo-thả trên trình duyệt hoặc app desktop</td><td>Miễn phí</td><td>Phác nhanh, context diagram (sơ đồ ngữ cảnh), thứ gì cần bố cục tự do</td></tr>
<tr><td>Visual Paradigm Community Edition</td><td>Công cụ mô hình hoá UML đầy đủ</td><td>Miễn phí cho mục đích phi thương mại</td><td>Mô hình chính thức nhiều sơ đồ liên kết nhau, nếu giảng viên dùng nó</td></tr>
<tr><td>StarUML</td><td>Công cụ mô hình hoá UML</td><td>Bản quyền trả phí; dùng chưa đăng ký thì hiện nhắc nhở</td><td>Thay thế Visual Paradigm</td></tr>
<tr><td>MagicDraw / Rational Software Architect / Visio</td><td>Có tên trong dòng "Tools" của đề cương</td><td>Thương mại</td><td>Chỉ khi máy trường có sẵn — đừng mua gì cả</td></tr>
</tbody>
</table>`),
    bi(`<h2>1. PlantUML — what it is, and the one dependency that confuses everyone</h2>
<p>PlantUML is a <strong>Java program</strong> that reads a text file between <code>@startuml</code> and <code>@enduml</code> and produces an image (PNG or SVG). To place boxes for most diagram types (class, use case, component, state, activity…) it calls another program, <strong>Graphviz</strong> (its layout command is called <code>dot</code>). <strong>Sequence diagrams</strong> are laid out by PlantUML itself, so they work even without Graphviz. Recent PlantUML versions also contain a built-in layout engine called <em>Smetana</em>, switched on by the line <code>!pragma layout smetana</code> — a useful fallback when Graphviz cannot be installed, though its layouts are sometimes less tidy.</p>
<p class="meo">🧠 This explains the most common beginner story: "my sequence diagram works but my class diagram shows an error" = Java is fine, Graphviz is missing.</p>
<h3>Path A — no install at all: the online server</h3>
<ol>
<li>Open <code>https://www.plantuml.com/plantuml</code> in a browser.</li>
<li>Paste a diagram, click Submit, and the picture appears; links below it download PNG or SVG.</li>
</ol>
<div class="pitfall">⚠️ Your text is sent to a public server. Fine for school exercises; never paste company or confidential designs. Very large diagrams can also fail because the diagram is encoded into the URL — use a local install for those.</div>
<h3>Path B — VS Code (recommended: you already use it)</h3>
<ol>
<li><strong>Java.</strong> Open a terminal and run <code>java -version</code>. If you see a version (17 or 21 is typical for Spring Boot work), you are done. Otherwise install a JDK (for example Eclipse Temurin), then restart the terminal.</li>
<li><strong>Graphviz.</strong> Windows: <code>winget install graphviz</code>, or download the installer from graphviz.org and tick "add to PATH". macOS: <code>brew install graphviz</code>. Check with <code>dot -V</code> in a <em>new</em> terminal.</li>
<li><strong>Extension.</strong> In VS Code open Extensions (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>), search "PlantUML" and install the extension by <em>jebbs</em>.</li>
<li><strong>Preview.</strong> Create a file <code>test.puml</code>, paste the diagram below, and press <kbd>Alt</kbd>+<kbd>D</kbd> (macOS: <kbd>Option</kbd>+<kbd>D</kbd>) to open the live preview.</li>
<li><strong>Export.</strong> Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>) → "PlantUML: Export Current Diagram" → choose <code>png</code> or <code>svg</code>. The image is written next to your file (or into an <code>out</code> folder, depending on settings).</li>
</ol>
<h3>Path C — IntelliJ IDEA (if you code LabFlow's back end there)</h3>
<ol>
<li>Settings → Plugins → Marketplace, search "PlantUML", install <em>PlantUML Integration</em>, restart the IDE.</li>
<li>New → File → name it <code>test.puml</code>; the preview pane appears beside the editor, with buttons to copy or save the image.</li>
<li>If class diagrams fail but sequence diagrams work, install Graphviz as in Path B (or point the plugin's settings to the <code>dot</code> program).</li>
</ol>`,
    `<h2>1. PlantUML — nó là gì, và cái phụ thuộc làm ai cũng rối</h2>
<p>PlantUML là một <strong>chương trình Java</strong> đọc một file chữ nằm giữa <code>@startuml</code> và <code>@enduml</code> rồi xuất ra ảnh (PNG hoặc SVG). Để sắp chỗ các hộp cho phần lớn loại sơ đồ (class, use case, component, state, activity…), nó gọi một chương trình khác là <strong>Graphviz</strong> (lệnh bố cục của nó tên là <code>dot</code>). <strong>Sequence diagram</strong> do chính PlantUML tự bố cục, nên chạy được cả khi không có Graphviz. Các bản PlantUML gần đây còn có sẵn một bộ bố cục nội bộ tên <em>Smetana</em>, bật bằng dòng <code>!pragma layout smetana</code> — đường lùi hữu ích khi không cài được Graphviz, dù bố cục đôi khi kém gọn hơn.</p>
<p class="meo">🧠 Điều này giải thích câu chuyện hay gặp nhất của người mới: "sequence diagram chạy mà class diagram báo lỗi" = Java ổn, thiếu Graphviz.</p>
<h3>Cách A — không cài gì: máy chủ online</h3>
<ol>
<li>Mở <code>https://www.plantuml.com/plantuml</code> trên trình duyệt.</li>
<li>Dán sơ đồ, bấm Submit, hình hiện ra; các liên kết bên dưới tải PNG hoặc SVG.</li>
</ol>
<div class="pitfall">⚠️ Chữ của bạn được gửi lên một máy chủ công cộng. Bài tập ở trường thì không sao; đừng bao giờ dán thiết kế của công ty hay thứ cần bảo mật. Sơ đồ rất lớn cũng có thể hỏng vì sơ đồ được mã hoá vào URL — sơ đồ lớn thì dùng bản cài trên máy.</div>
<h3>Cách B — VS Code (khuyên dùng: bạn vốn đã dùng nó)</h3>
<ol>
<li><strong>Java.</strong> Mở terminal, chạy <code>java -version</code>. Thấy số phiên bản (17 hoặc 21 là thường gặp khi làm Spring Boot) là xong. Không thì cài một JDK (ví dụ Eclipse Temurin), rồi mở lại terminal.</li>
<li><strong>Graphviz.</strong> Windows: <code>winget install graphviz</code>, hoặc tải bộ cài từ graphviz.org và tick "add to PATH" (thêm vào biến đường dẫn). macOS: <code>brew install graphviz</code>. Kiểm bằng <code>dot -V</code> trong một terminal <em>mới</em>.</li>
<li><strong>Extension.</strong> Trong VS Code mở Extensions (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>), tìm "PlantUML" và cài extension của tác giả <em>jebbs</em>.</li>
<li><strong>Xem trước.</strong> Tạo file <code>test.puml</code>, dán sơ đồ bên dưới, bấm <kbd>Alt</kbd>+<kbd>D</kbd> (macOS: <kbd>Option</kbd>+<kbd>D</kbd>) để mở khung xem trước trực tiếp.</li>
<li><strong>Xuất ảnh.</strong> Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>) → "PlantUML: Export Current Diagram" → chọn <code>png</code> hoặc <code>svg</code>. Ảnh được ghi cạnh file của bạn (hoặc vào thư mục <code>out</code>, tuỳ cài đặt).</li>
</ol>
<h3>Cách C — IntelliJ IDEA (nếu bạn code back end LabFlow ở đó)</h3>
<ol>
<li>Settings → Plugins → Marketplace, tìm "PlantUML", cài <em>PlantUML Integration</em>, khởi động lại IDE.</li>
<li>New → File → đặt tên <code>test.puml</code>; khung xem trước hiện cạnh trình soạn thảo, có nút chép hoặc lưu ảnh.</li>
<li>Nếu class diagram lỗi mà sequence diagram chạy, cài Graphviz như Cách B (hoặc chỉ đường tới chương trình <code>dot</code> trong cài đặt của plugin).</li>
</ol>`),
    bi(`<h2>2. Two test diagrams — run both</h2>
<p><strong>Test 1</strong> is a sequence diagram: it needs only Java. If this fails, the problem is Java or the extension itself.</p>
<pre><code class="language-plantuml">@startuml
' Install test 1: a sequence diagram (built-in layout, works even without Graphviz)
title Install test 1 — sequence diagram
actor Student
participant "LabFlow" as S
Student -&gt; S : reserve(lab, slot)
S --&gt; Student : confirmed
@enduml</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/f6f02486e9fdf2dacedffc3dff90c4a8c2944d45.svg" alt="What Test 1 should look like" loading="lazy" /><p class="chu-thich">🧩 What Test 1 should look like</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Install test 1: a sequence diagram (built-in layout, works even without Graphviz)
title Install test 1 — sequence diagram
actor Student
participant "LabFlow" as S
Student -&gt; S : reserve(lab, slot)
S --&gt; Student : confirmed
@enduml</code></pre></details>
<p><strong>Test 2</strong> is a class diagram: it needs Graphviz. If Test 1 works and this one fails, install Graphviz (or add <code>!pragma layout smetana</code> as the second line and try again).</p>
<pre><code class="language-plantuml">@startuml
' Install test 2: a class diagram (needs Graphviz dot, or the smetana layout)
title Install test 2 — class diagram
class Lab {
  - name : String
}
class Equipment {
  - code : String
}
Lab "1" *-- "0..*" Equipment
@enduml</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/48c236fd1835de00af4235069d8378d10470214d.svg" alt="What Test 2 should look like" loading="lazy" /><p class="chu-thich">🧩 What Test 2 should look like</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Install test 2: a class diagram (needs Graphviz dot, or the smetana layout)
title Install test 2 — class diagram
class Lab {
  - name : String
}
class Equipment {
  - code : String
}
Lab "1" *-- "0..*" Equipment
@enduml</code></pre></details>
<p>Your colours will differ — this site adds a shared style file to every diagram (the <code>!include</code> line is removed from the code you see). The shapes, arrows and the numbers <code>1</code> and <code>0..*</code> must match.</p>
<p class="meo">🧠 Two built-in diagnostics: a file containing only <code>@startuml</code>, <code>testdot</code>, <code>@enduml</code> reports whether PlantUML can find Graphviz; the same with <code>version</code> prints the PlantUML, Java and Graphviz versions.</p>`,
    `<h2>2. Hai sơ đồ thử — chạy cả hai</h2>
<p><strong>Thử 1</strong> là sequence diagram: chỉ cần Java. Nếu hỏng thì lỗi nằm ở Java hoặc chính extension.</p>
<pre><code class="language-plantuml">@startuml
' Thử cài đặt 1: sequence diagram (tự bố cục, chạy được cả khi thiếu Graphviz)
title Install test 1 — sequence diagram
actor Student
participant "LabFlow" as S
Student -&gt; S : reserve(lab, slot)
S --&gt; Student : confirmed
@enduml</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/f6f02486e9fdf2dacedffc3dff90c4a8c2944d45.svg" alt="Thử 1 đúng thì trông như thế này" loading="lazy" /><p class="chu-thich">🧩 Thử 1 đúng thì trông như thế này</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Thử cài đặt 1: sequence diagram (tự bố cục, chạy được cả khi thiếu Graphviz)
title Install test 1 — sequence diagram
actor Student
participant "LabFlow" as S
Student -&gt; S : reserve(lab, slot)
S --&gt; Student : confirmed
@enduml</code></pre></details>
<p><strong>Thử 2</strong> là class diagram: cần Graphviz. Nếu Thử 1 chạy mà cái này hỏng, cài Graphviz (hoặc thêm dòng <code>!pragma layout smetana</code> làm dòng thứ hai rồi thử lại).</p>
<pre><code class="language-plantuml">@startuml
' Thử cài đặt 2: class diagram (cần Graphviz dot, hoặc bố cục smetana)
title Install test 2 — class diagram
class Lab {
  - name : String
}
class Equipment {
  - code : String
}
Lab "1" *-- "0..*" Equipment
@enduml</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/48c236fd1835de00af4235069d8378d10470214d.svg" alt="Thử 2 đúng thì trông như thế này" loading="lazy" /><p class="chu-thich">🧩 Thử 2 đúng thì trông như thế này</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Thử cài đặt 2: class diagram (cần Graphviz dot, hoặc bố cục smetana)
title Install test 2 — class diagram
class Lab {
  - name : String
}
class Equipment {
  - code : String
}
Lab "1" *-- "0..*" Equipment
@enduml</code></pre></details>
<p>Màu của bạn sẽ khác — web này thêm một file kiểu dùng chung vào mọi sơ đồ (dòng <code>!include</code> đã được gỡ khỏi mã bạn thấy). Hình dạng, mũi tên và các con số <code>1</code>, <code>0..*</code> phải giống.</p>
<p class="meo">🧠 Hai lệnh tự chẩn đoán có sẵn: một file chỉ gồm <code>@startuml</code>, <code>testdot</code>, <code>@enduml</code> sẽ báo PlantUML có tìm thấy Graphviz không; tương tự với <code>version</code> sẽ in phiên bản PlantUML, Java và Graphviz.</p>`),
    bi(`<h2>3. draw.io (diagrams.net) — drag and drop</h2>
<ol>
<li>Open <code>https://app.diagrams.net</code> (or install the desktop app from the project's GitHub releases page, which also works offline).</li>
<li>Choose where to save: <em>Device</em> saves a <code>.drawio</code> file on your computer — safest for coursework.</li>
<li>Turn on the UML shapes: bottom-left "+ More Shapes" → tick <strong>UML</strong> → Apply. You now have actor, use case, class, lifeline, state shapes.</li>
<li>Export: File → Export as → PNG or SVG. Tick <em>Include a copy of my diagram</em> to keep the exported PNG editable later, set Border width to about 10, and keep the background white.</li>
<li>Optional: the VS Code extension "Draw.io Integration" edits <code>.drawio.svg</code>/<code>.drawio.png</code> files directly inside your repository.</li>
</ol>
<div class="pitfall">⚠️ draw.io lets you draw <em>anything</em>, including wrong UML. A filled diamond on the wrong end, an open arrow where a hollow triangle was needed — the tool will not complain. PlantUML at least forces you to type the relationship kind.</div>`,
    `<h2>3. draw.io (diagrams.net) — kéo và thả</h2>
<ol>
<li>Mở <code>https://app.diagrams.net</code> (hoặc cài app desktop từ trang phát hành trên GitHub của dự án, chạy được cả khi không có mạng).</li>
<li>Chọn nơi lưu: <em>Device</em> lưu file <code>.drawio</code> trên máy bạn — an toàn nhất cho bài tập.</li>
<li>Bật bộ hình UML: góc dưới trái "+ More Shapes" → tick <strong>UML</strong> → Apply. Giờ bạn có hình actor, use case, class, lifeline (đường đời), state.</li>
<li>Xuất ảnh: File → Export as → PNG hoặc SVG. Tick <em>Include a copy of my diagram</em> để ảnh PNG sau này vẫn mở ra sửa được, đặt Border width khoảng 10, và giữ nền trắng.</li>
<li>Tuỳ chọn: extension VS Code "Draw.io Integration" sửa thẳng file <code>.drawio.svg</code>/<code>.drawio.png</code> ngay trong repo.</li>
</ol>
<div class="pitfall">⚠️ draw.io cho bạn vẽ <em>bất cứ thứ gì</em>, kể cả UML sai. Hình thoi đặc đặt nhầm đầu, mũi tên hở ở chỗ phải là tam giác rỗng — công cụ không phàn nàn gì. PlantUML ít nhất còn bắt bạn gõ ra loại quan hệ.</div>`),
    bi(`<h2>4. Visual Paradigm Community Edition or StarUML — a real modeling tool</h2>
<p>A modeling tool keeps a <strong>model</strong>, not just pictures: the class <code>Reservation</code> you draw in a class diagram is the same element you drag into a sequence diagram, so renaming it updates everywhere. That is why the syllabus lists this kind of tool (Rational Software Architect, Visual Paradigm, MagicDraw, Visio).</p>
<ol>
<li><strong>Visual Paradigm Community Edition:</strong> download from the official visual-paradigm.com site (the Community Edition is the free, non-commercial one), install, and follow the activation step it asks for on first start. Create a project → Diagram Navigator → pick "Use Case Diagram" or "Class Diagram".</li>
<li><strong>StarUML:</strong> download from staruml.io and install; without a licence it runs as an evaluation that shows reminders. Model Explorer → Add Diagram → Use Case / Class.</li>
<li><strong>Export for a report:</strong> in either tool, export the active diagram as PNG (or SVG) from the File/Export menu.</li>
</ol>
<div class="callout"><p><strong>Do not guess what the exam allows.</strong> The PE template only says "Draw all diagrams using a UML tool" and asks for one submitted document. Which tools are installed in the exam room is set by the lecturer and exam office each term. Ask in the first weeks, then practise every timed rehearsal in exactly that tool. Being slow in an unfamiliar tool costs more marks than any notation mistake.</p></div>
<p class="nhan">Free exports can be labelled</p>
<p>Free and evaluation editions of commercial modeling tools can add a small edition label or watermark to exported images. That is normally acceptable for coursework, but check once before your first report so it is not a surprise.</p>`,
    `<h2>4. Visual Paradigm Community Edition hoặc StarUML — một công cụ mô hình hoá thật</h2>
<p>Công cụ mô hình hoá giữ một <strong>mô hình</strong> (model), không chỉ là các bức hình: lớp <code>Reservation</code> bạn vẽ trong class diagram cũng chính là phần tử bạn kéo vào sequence diagram, nên đổi tên một chỗ là mọi chỗ cập nhật. Đó là lý do đề cương liệt kê loại công cụ này (Rational Software Architect, Visual Paradigm, MagicDraw, Visio).</p>
<ol>
<li><strong>Visual Paradigm Community Edition:</strong> tải từ trang chính thức visual-paradigm.com (Community Edition là bản miễn phí, phi thương mại), cài, và làm bước kích hoạt nó yêu cầu ở lần mở đầu. Tạo project → Diagram Navigator → chọn "Use Case Diagram" hoặc "Class Diagram".</li>
<li><strong>StarUML:</strong> tải từ staruml.io và cài; chưa có bản quyền thì chạy dạng dùng thử, có hiện nhắc nhở. Model Explorer → Add Diagram → Use Case / Class.</li>
<li><strong>Xuất cho báo cáo:</strong> ở cả hai công cụ, xuất sơ đồ đang mở thành PNG (hoặc SVG) từ menu File/Export.</li>
</ol>
<div class="callout"><p><strong>Đừng đoán phòng thi cho dùng gì.</strong> Mẫu đề PE chỉ ghi "Draw all diagrams using a UML tool" (vẽ mọi sơ đồ bằng một công cụ UML) và đòi nộp một tài liệu. Phòng thi cài công cụ nào do giảng viên và phòng khảo thí quyết định từng kỳ. Hỏi ngay những tuần đầu, rồi mọi lần tập dượt có bấm giờ đều làm bằng đúng công cụ đó. Chậm tay vì lạ công cụ mất điểm nhiều hơn bất kỳ lỗi ký hiệu nào.</p></div>
<p class="nhan">Bản miễn phí có thể gắn nhãn khi xuất</p>
<p>Bản miễn phí và bản dùng thử của các công cụ mô hình hoá thương mại có thể gắn một nhãn phiên bản nhỏ hoặc hình mờ (watermark) lên ảnh xuất ra. Với bài tập ở trường thường không sao, nhưng hãy kiểm một lần trước báo cáo đầu tiên để khỏi bất ngờ.</p>`),
    bi(`<h2>5. Common errors — message, cause, fix</h2>
<table>
<thead><tr><th>What you see</th><th>Cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>Class/use case diagram shows "Cannot find Graphviz" or "Dot executable … does not exist"; sequence diagrams work</td><td>Graphviz not installed, or installed but not on PATH</td><td>Install Graphviz; open a new terminal and check <code>dot -V</code>; restart VS Code/IntelliJ. If it still fails, set the environment variable <code>GRAPHVIZ_DOT</code> to the full path of <code>dot</code>, or add <code>!pragma layout smetana</code></td></tr>
<tr><td>Preview never appears; extension says Java not found</td><td>No JDK, or VS Code started before Java was installed</td><td><code>java -version</code>; install a JDK; fully quit and reopen the editor</td></tr>
<tr><td>"Syntax Error?" with a line number</td><td>A typo on or just before that line: missing <code>@enduml</code>, a name with spaces not in quotes, a <code>{</code> without <code>}</code>, curly "smart quotes" pasted from Word or a chat window</td><td>Go to the line; put names with spaces in straight quotes and give an alias (<code>actor "Lab Manager" as LM</code>); retype the quotes</td></tr>
<tr><td>Two diagram types mixed: arrows or keywords rejected</td><td>Sequence arrows inside a class diagram, or class syntax inside a sequence diagram</td><td>One file = one diagram type; split them</td></tr>
<tr><td>Vietnamese letters appear as boxes or broken characters</td><td>File not saved as UTF-8, or the font has no Vietnamese glyphs</td><td>Save as UTF-8; on the command line add <code>-charset UTF-8</code>; set a font with Vietnamese support (for example <code>skinparam defaultFontName Arial</code>). For exam and project diagrams, English labels avoid the problem entirely</td></tr>
<tr><td>The picture is huge and unreadable in the report</td><td>One diagram tries to show the whole system</td><td>Split per actor, per feature or per subsystem (the SRS template itself suggests one UC diagram per actor or workflow); use <code>left to right direction</code> and <code>hide empty members</code></td></tr>
<tr><td>The PNG is cut off at the edge</td><td>PlantUML limits image size (4096 px by default)</td><td>Set the environment variable <code>PLANTUML_LIMIT_SIZE=8192</code>, or export SVG instead</td></tr>
<tr><td>The diagram looks blurry once pasted into Word</td><td>Low-resolution PNG scaled up</td><td>Insert the SVG (current Word supports it), or add <code>skinparam dpi 200</code> and re-export the PNG</td></tr>
<tr><td>Lines cross everywhere</td><td>Graphviz chooses the layout</td><td>Reorder the declarations, add direction hints such as <code>-down-&gt;</code> or <code>-right-&gt;</code>, group related elements</td></tr>
<tr><td>draw.io: yesterday's work is gone</td><td>Saved to the browser's temporary storage</td><td>Always save to Device (or a cloud drive) as a <code>.drawio</code> file</td></tr>
</tbody>
</table>`,
    `<h2>5. Lỗi hay gặp — thông báo, nguyên nhân, cách sửa</h2>
<table>
<thead><tr><th>Bạn thấy gì</th><th>Nguyên nhân</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>Class/use case diagram báo "Cannot find Graphviz" hoặc "Dot executable … does not exist"; sequence diagram vẫn chạy</td><td>Chưa cài Graphviz, hoặc cài rồi nhưng không nằm trong PATH</td><td>Cài Graphviz; mở terminal mới kiểm <code>dot -V</code>; khởi động lại VS Code/IntelliJ. Vẫn hỏng thì đặt biến môi trường <code>GRAPHVIZ_DOT</code> bằng đường dẫn đầy đủ tới <code>dot</code>, hoặc thêm <code>!pragma layout smetana</code></td></tr>
<tr><td>Khung xem trước không bao giờ hiện; extension báo không thấy Java</td><td>Chưa có JDK, hoặc VS Code mở trước khi cài Java</td><td><code>java -version</code>; cài JDK; thoát hẳn rồi mở lại trình soạn thảo</td></tr>
<tr><td>"Syntax Error?" kèm số dòng</td><td>Gõ sai ở đúng dòng đó hoặc dòng ngay trước: thiếu <code>@enduml</code>, tên có dấu cách mà không để trong ngoặc kép, <code>{</code> không có <code>}</code>, dấu nháy "cong" dán từ Word hoặc khung chat</td><td>Tới đúng dòng; tên có dấu cách đặt trong nháy kép thẳng và đặt bí danh (<code>actor "Lab Manager" as LM</code>); gõ lại dấu nháy</td></tr>
<tr><td>Trộn hai loại sơ đồ: mũi tên hoặc từ khoá bị từ chối</td><td>Mũi tên sequence trong class diagram, hoặc cú pháp class trong sequence diagram</td><td>Một file = một loại sơ đồ; tách ra</td></tr>
<tr><td>Chữ tiếng Việt hiện ô vuông hoặc ký tự vỡ</td><td>File không lưu UTF-8, hoặc font không có dấu tiếng Việt</td><td>Lưu UTF-8; chạy dòng lệnh thì thêm <code>-charset UTF-8</code>; đặt font hỗ trợ tiếng Việt (ví dụ <code>skinparam defaultFontName Arial</code>). Với sơ đồ thi và project, ghi nhãn tiếng Anh là tránh hẳn chuyện này</td></tr>
<tr><td>Hình quá to, dán vào báo cáo không đọc nổi</td><td>Một sơ đồ cố ôm cả hệ thống</td><td>Tách theo actor, theo chức năng hoặc theo hệ con (chính mẫu SRS cũng gợi ý mỗi UC diagram cho một actor hoặc một luồng); dùng <code>left to right direction</code> và <code>hide empty members</code></td></tr>
<tr><td>Ảnh PNG bị cắt mất mép</td><td>PlantUML giới hạn kích thước ảnh (mặc định 4096 px)</td><td>Đặt biến môi trường <code>PLANTUML_LIMIT_SIZE=8192</code>, hoặc xuất SVG</td></tr>
<tr><td>Dán vào Word thì hình mờ</td><td>PNG độ phân giải thấp bị phóng to</td><td>Chèn SVG (Word bản hiện nay hỗ trợ), hoặc thêm <code>skinparam dpi 200</code> rồi xuất lại PNG</td></tr>
<tr><td>Đường nối cắt nhau khắp nơi</td><td>Graphviz tự chọn bố cục</td><td>Đổi thứ tự khai báo, thêm gợi ý hướng như <code>-down-&gt;</code> hoặc <code>-right-&gt;</code>, gom các phần tử liên quan</td></tr>
<tr><td>draw.io: bài hôm qua biến mất</td><td>Lưu vào bộ nhớ tạm của trình duyệt</td><td>Luôn lưu về Device (hoặc ổ đám mây) thành file <code>.drawio</code></td></tr>
</tbody>
</table>`),
    bi(`<h2>6. Which tool for which job</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/cb3acda2ec4bef40c8b8a8ed456e50092ffb97e9.svg" alt="Which UML tool for which job?" loading="lazy" /><p class="chu-thich">🧩 Which UML tool for which job?</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Which drawing tool to open for which job
title Which UML tool for which job?
start
if (Exam room (PE)?) then (yes)
  :Use exactly the tool the proctor allows\\n(ask the lecturer BEFORE exam week);
  stop
else (no)
endif
if (Diagram must live in Git,\\nbe diffed or generated by AI?) then (yes)
  :PlantUML\\n(VS Code / IntelliJ / plantuml.com);
elseif (Quick sketch, free layout,\\nshare a link with the team?) then (yes)
  :draw.io (diagrams.net);
else (formal model, many linked diagrams)
  :Visual Paradigm / StarUML\\n(a real UML modeling tool);
endif
:Export PNG or SVG for the report;
stop
@enduml</code></pre></details>
<ul>
<li><strong>Learning and this website:</strong> PlantUML. You can copy any diagram's code from a lesson, change one line, and see the effect in seconds.</li>
<li><strong>Course Project with AI (CLO7):</strong> the project brief explicitly suggests "Use PlantUML to generate diagrams" and requires you to declare every AI prompt and output. Text diagrams make that declaration easy: paste the prompt, the generated PlantUML, and your corrected version.</li>
<li><strong>Team whiteboarding:</strong> draw.io, shared by link.</li>
<li><strong>A large formal model, or when the lecturer grades with it:</strong> Visual Paradigm or StarUML.</li>
</ul>
<p class="nhan">Checklist before putting a diagram into a report</p>
<ul>
<li>☐ Title or caption says what the diagram shows ("Use case diagram — Student functions").</li>
<li>☐ Readable at 100% zoom on an A4 page; otherwise split it.</li>
<li>☐ Exported as SVG, or PNG at a sufficient DPI; white background.</li>
<li>☐ Source (<code>.puml</code> or <code>.drawio</code>) saved next to the image so you can fix it tomorrow.</li>
<li>☐ Names match the other diagrams (same class name in class, sequence and database design).</li>
</ul>`,
    `<h2>6. Công cụ nào cho việc nào</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/cb3acda2ec4bef40c8b8a8ed456e50092ffb97e9.svg" alt="Which UML tool for which job?" loading="lazy" /><p class="chu-thich">🧩 Which UML tool for which job?</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Việc nào mở công cụ nào
title Which UML tool for which job?
start
if (Exam room (PE)?) then (yes)
  :Use exactly the tool the proctor allows\\n(ask the lecturer BEFORE exam week);
  stop
else (no)
endif
if (Diagram must live in Git,\\nbe diffed or generated by AI?) then (yes)
  :PlantUML\\n(VS Code / IntelliJ / plantuml.com);
elseif (Quick sketch, free layout,\\nshare a link with the team?) then (yes)
  :draw.io (diagrams.net);
else (formal model, many linked diagrams)
  :Visual Paradigm / StarUML\\n(a real UML modeling tool);
endif
:Export PNG or SVG for the report;
stop
@enduml</code></pre></details>
<ul>
<li><strong>Học và web này:</strong> PlantUML. Bạn chép mã của bất kỳ sơ đồ nào trong bài, đổi một dòng, và thấy hiệu quả trong vài giây.</li>
<li><strong>Course Project có dùng AI (CLO7):</strong> đề project ghi rõ gợi ý "Use PlantUML to generate diagrams" và bắt khai báo mọi prompt và kết quả AI. Sơ đồ dạng chữ làm việc khai báo rất dễ: dán prompt, đoạn PlantUML AI sinh ra, và bản bạn đã sửa.</li>
<li><strong>Cả nhóm cùng phác thảo:</strong> draw.io, chia sẻ bằng liên kết.</li>
<li><strong>Mô hình chính thức lớn, hoặc khi giảng viên chấm bằng nó:</strong> Visual Paradigm hoặc StarUML.</li>
</ul>
<p class="nhan">Checklist trước khi đưa một sơ đồ vào báo cáo</p>
<ul>
<li>☐ Tiêu đề hoặc chú thích nói sơ đồ thể hiện gì ("Use case diagram — chức năng của Student").</li>
<li>☐ Đọc được ở mức phóng 100% trên trang A4; không thì tách ra.</li>
<li>☐ Xuất SVG, hoặc PNG đủ DPI; nền trắng.</li>
<li>☐ File nguồn (<code>.puml</code> hoặc <code>.drawio</code>) lưu cạnh ảnh để mai còn sửa được.</li>
<li>☐ Tên khớp với các sơ đồ khác (cùng tên lớp trong class diagram, sequence diagram và thiết kế CSDL).</li>
</ul>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>PlantUML</strong></td><td>công cụ vẽ UML bằng chữ</td><td>A Java program that turns text between @startuml and @enduml into a diagram image.</td></tr>
<tr><td><strong>Graphviz (dot)</strong></td><td>bộ bố cục đồ thị</td><td>The program PlantUML calls to place boxes and lines for most diagram types.</td></tr>
<tr><td><strong>layout engine</strong></td><td>bộ bố cục</td><td>The part that decides where each element goes on the page.</td></tr>
<tr><td><strong>JDK</strong></td><td>bộ công cụ phát triển Java</td><td>Java Development Kit — needed to run PlantUML and to build Spring Boot projects.</td></tr>
<tr><td><strong>PATH</strong></td><td>biến đường dẫn</td><td>The list of folders your terminal searches for programs such as java and dot.</td></tr>
<tr><td><strong>extension / plugin</strong></td><td>phần mở rộng</td><td>An add-on that gives an editor a new feature, such as PlantUML preview.</td></tr>
<tr><td><strong>export</strong></td><td>xuất ra</td><td>Saving a diagram as an image file (PNG, SVG) for a report.</td></tr>
<tr><td><strong>SVG</strong></td><td>ảnh vector</td><td>A scalable image format that stays sharp at any zoom.</td></tr>
<tr><td><strong>PNG</strong></td><td>ảnh điểm ảnh</td><td>A pixel image format; it becomes blurry when enlarged.</td></tr>
<tr><td><strong>UTF-8</strong></td><td>bảng mã UTF-8</td><td>The text encoding that stores Vietnamese letters correctly.</td></tr>
<tr><td><strong>modeling tool</strong></td><td>công cụ mô hình hoá</td><td>A tool that keeps one model behind many diagrams, so an element is shared between them.</td></tr>
<tr><td><strong>watermark</strong></td><td>hình mờ</td><td>A faint label a free or trial edition may stamp onto exported images.</td></tr>
<tr><td><strong>alias</strong></td><td>bí danh</td><td>A short name given to an element in PlantUML, as in actor "Lab Manager" as LM.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>PlantUML</strong></td><td>công cụ vẽ UML bằng chữ</td><td>Chương trình Java biến chữ nằm giữa @startuml và @enduml thành ảnh sơ đồ.</td></tr>
<tr><td><strong>Graphviz (dot)</strong></td><td>bộ bố cục đồ thị</td><td>Chương trình PlantUML gọi để sắp chỗ hộp và đường nối cho phần lớn loại sơ đồ.</td></tr>
<tr><td><strong>layout engine</strong></td><td>bộ bố cục</td><td>Phần quyết định mỗi phần tử nằm ở đâu trên trang.</td></tr>
<tr><td><strong>JDK</strong></td><td>bộ công cụ phát triển Java</td><td>Cần để chạy PlantUML và để build dự án Spring Boot.</td></tr>
<tr><td><strong>PATH</strong></td><td>biến đường dẫn</td><td>Danh sách thư mục terminal tìm chương trình như java và dot.</td></tr>
<tr><td><strong>extension / plugin</strong></td><td>phần mở rộng</td><td>Phần cài thêm cho trình soạn thảo một tính năng mới, như xem trước PlantUML.</td></tr>
<tr><td><strong>export</strong></td><td>xuất ra</td><td>Lưu sơ đồ thành file ảnh (PNG, SVG) cho báo cáo.</td></tr>
<tr><td><strong>SVG</strong></td><td>ảnh vector</td><td>Định dạng ảnh co giãn, phóng bao nhiêu vẫn nét.</td></tr>
<tr><td><strong>PNG</strong></td><td>ảnh điểm ảnh</td><td>Định dạng ảnh theo điểm ảnh; phóng to sẽ mờ.</td></tr>
<tr><td><strong>UTF-8</strong></td><td>bảng mã UTF-8</td><td>Cách mã hoá chữ lưu đúng chữ tiếng Việt.</td></tr>
<tr><td><strong>modeling tool</strong></td><td>công cụ mô hình hoá</td><td>Công cụ giữ một mô hình phía sau nhiều sơ đồ, nên một phần tử được dùng chung giữa chúng.</td></tr>
<tr><td><strong>watermark</strong></td><td>hình mờ</td><td>Nhãn mờ mà bản miễn phí hoặc dùng thử có thể đóng lên ảnh xuất ra.</td></tr>
<tr><td><strong>alias</strong></td><td>bí danh</td><td>Tên ngắn đặt cho một phần tử trong PlantUML, như actor "Lab Manager" as LM.</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── ⭐ First hands-on session — your first use case diagram and class diagram, for LabFlow ───────── */
const L_x_buoi_dau_tien = {
  title: '⭐ First hands-on session — your first use case diagram and class diagram, for LabFlow|||⭐ Buổi thực hành đầu tiên — vẽ use case diagram và class diagram đầu tiên cho LabFlow',
  slug: 'swd392-buoi-dau-tien',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài tự thêm ngoài giáo trình, cầm tay chỉ việc: từ một đoạn yêu cầu ngắn của LabFlow (đặt lab, mượn thiết bị, duyệt) tìm tác nhân, tìm use case, vẽ use case diagram bằng PlantUML, viết đặc tả một use case theo mẫu của trường; rồi gạch danh từ để tìm lớp, vẽ class diagram hai bước (tên + quan hệ, rồi thuộc tính + bội số + composition/aggregation/generalization); năm lỗi kinh điển; ba bài tự làm có lời giải dựng thật (Smart Coffee Shop, phiếu bảo trì LabFlow, câu hỏi nhanh).',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ First hands-on session · added by this site</span>
<h2>Open your UML tool. Really open it. We will draw two diagrams together</h2>
<p class="lead">This is the most valuable hour of Section 0. You will go from a paragraph of plain English to a <strong>use case diagram</strong> (what the system does, for whom) and a <strong>class diagram</strong> (what the system has to remember). These two are the first diagrams of every SWD392 project, of the SRS in your capstone, and together they are worth 3 of the 10 PE points (question 1) plus most of project Evaluation 1.</p>
<p>You need: a sheet of paper and a pencil, and PlantUML working (lesson "⭐ Installing UML tools", or simply the online server). Chapters 6 and 7 teach the full rules later — here you learn by doing, and every rule you meet is explained on the spot.</p>
<div class="callout">🧭 <strong>Apply it to LabFlow</strong> (illustration): the requirement below is a simplified slice of LabFlow, the capstone project this site follows. The real LabFlow has more actors (Guest, Lecturer, Admin) — we keep four so the first diagram stays small.</div>`,
    `<span class="eyebrow">Mục 0 · ⭐ Buổi thực hành đầu tiên · phần web tự thêm</span>
<h2>Mở công cụ UML lên. Mở thật sự. Cùng vẽ hai sơ đồ</h2>
<p class="lead">Đây là giờ học có giá trị nhất của Mục 0. Bạn sẽ đi từ một đoạn tiếng Anh bình thường tới một <strong>use case diagram</strong> (sơ đồ ca sử dụng — hệ thống làm gì, cho ai) và một <strong>class diagram</strong> (sơ đồ lớp — hệ thống phải nhớ những gì). Hai sơ đồ này là hai sơ đồ đầu tiên của mọi project SWD392, của SRS trong đồ án tốt nghiệp, và cộng lại chiếm 3 trên 10 điểm PE (câu 1) cùng phần lớn Evaluation 1 của project.</p>
<p>Bạn cần: một tờ giấy và bút chì, và PlantUML chạy được (bài "⭐ Cài công cụ vẽ UML", hoặc đơn giản là máy chủ online). Chapter 6 và 7 sẽ dạy đầy đủ luật sau — ở đây bạn học bằng cách làm, gặp luật nào giải thích luật đó ngay tại chỗ.</p>
<div class="callout">🧭 <strong>Áp vào LabFlow</strong> (ví dụ minh hoạ): đoạn yêu cầu dưới đây là một lát cắt rút gọn của LabFlow, đồ án tốt nghiệp mà web này đi theo. LabFlow thật có thêm tác nhân (Guest, Lecturer, Admin) — ở đây giữ bốn để sơ đồ đầu tiên còn nhỏ.</div>`),
    bi(`<h2>The requirement (read it twice, pencil in hand)</h2>
<pre><code class="language-plaintext">LabFlow — lab and equipment booking for a university (simplified)

A university has several buildings; each building contains one or more labs.
Each lab houses equipment (oscilloscopes, 3D printers, IoT kits...). A piece
of equipment can be moved from one lab to another.

A student searches for a free time slot in a lab and reserves it. The system
always checks that the slot is still available. If the slot is already full,
the student may join a waitlist for it instead. A student can cancel their own
reservation.

A lab manager approves or rejects pending reservations. When a reservation is
approved, the student receives an e-mail sent through the university's e-mail
system.

A student can request to borrow a piece of equipment. Lab staff hand the
equipment out at the lab desk and receive it back; the system records when it
was borrowed, when it is due, and when it was returned.</code></pre>
<p>On paper, <strong>circle every "who"</strong> (people, roles, other systems) and <strong>underline every "does what"</strong> (verbs with an object). Two minutes. Then continue.</p>`,
    `<h2>Đoạn yêu cầu (đọc hai lần, tay cầm bút chì)</h2>
<pre><code class="language-plaintext">LabFlow — lab and equipment booking for a university (simplified)

A university has several buildings; each building contains one or more labs.
Each lab houses equipment (oscilloscopes, 3D printers, IoT kits...). A piece
of equipment can be moved from one lab to another.

A student searches for a free time slot in a lab and reserves it. The system
always checks that the slot is still available. If the slot is already full,
the student may join a waitlist for it instead. A student can cancel their own
reservation.

A lab manager approves or rejects pending reservations. When a reservation is
approved, the student receives an e-mail sent through the university's e-mail
system.

A student can request to borrow a piece of equipment. Lab staff hand the
equipment out at the lab desk and receive it back; the system records when it
was borrowed, when it is due, and when it was returned.</code></pre>
<p>Tóm tắt tiếng Việt: trường có nhiều toà, mỗi toà có một hoặc nhiều phòng lab; mỗi lab chứa thiết bị, thiết bị chuyển được sang lab khác. Sinh viên tìm khung giờ trống và đặt; hệ thống luôn kiểm slot còn trống; slot đầy thì sinh viên có thể vào danh sách chờ (waitlist); sinh viên huỷ được lượt đặt của mình. Quản lý lab duyệt hoặc từ chối; khi duyệt, sinh viên nhận email qua hệ thống email của trường. Sinh viên yêu cầu mượn thiết bị; nhân viên lab giao và nhận lại tại quầy; hệ thống ghi thời điểm mượn, hạn trả, thời điểm trả.</p>
<p>Trên giấy, <strong>khoanh tròn mọi "ai"</strong> (người, vai trò, hệ thống khác) và <strong>gạch chân mọi "làm gì"</strong> (động từ kèm tân ngữ). Hai phút. Rồi đi tiếp.</p>`),
    bi(`<h2>Step 1 — Find the actors</h2>
<p>An <strong>actor</strong> is a <em>role</em> outside the system that interacts with it. Four kinds exist: a human role, an external system, an I/O device, and a timer. The school's Assignment 01 template gives the questions to ask: who is notified when something happens? who provides information or services to the system? who helps the system complete a task?</p>
<table>
<thead><tr><th>Candidate you circled</th><th>Actor?</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Student</td><td>✅ primary actor</td><td>Starts reserve, cancel, borrow — a role played by thousands of real people</td></tr>
<tr><td>Lab manager</td><td>✅ primary actor</td><td>Starts "approve reservation"</td></tr>
<tr><td>Lab staff</td><td>✅ primary actor</td><td>Starts "hand out" and "receive back"</td></tr>
<tr><td>University e-mail system</td><td>✅ secondary actor, external system</td><td>Outside LabFlow; LabFlow uses it to deliver the e-mail but it never starts a use case</td></tr>
<tr><td>Database</td><td>❌</td><td>It is <em>inside</em> the system you are designing — part of the solution, not a user of it</td></tr>
<tr><td>University, building, lab</td><td>❌</td><td>Things the system stores information about (they will become classes), not roles that interact</td></tr>
<tr><td>"Cường" (a specific student)</td><td>❌</td><td>An actor is a role, not a person; Cường plays the role Student</td></tr>
</tbody>
</table>
<p class="meo">🧠 Test for any candidate: "Is it outside my system, and does it exchange messages with my system?" Both yes → actor. Otherwise it is probably a class.</p>`,
    `<h2>Bước 1 — Tìm tác nhân (actor)</h2>
<p><strong>Tác nhân (actor)</strong> là một <em>vai trò</em> nằm ngoài hệ thống và tương tác với nó. Có bốn loại: vai trò con người, hệ thống bên ngoài (external system), thiết bị vào/ra (I/O device), và bộ hẹn giờ (timer). Mẫu Assignment 01 của trường cho sẵn các câu hỏi: ai được báo khi có chuyện xảy ra? ai cung cấp thông tin hoặc dịch vụ cho hệ thống? ai giúp hệ thống hoàn thành một việc?</p>
<table>
<thead><tr><th>Ứng viên bạn khoanh</th><th>Là actor?</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Student (sinh viên)</td><td>✅ tác nhân chính (primary)</td><td>Khởi động việc đặt, huỷ, mượn — một vai do hàng nghìn người thật đóng</td></tr>
<tr><td>Lab manager (quản lý lab)</td><td>✅ tác nhân chính</td><td>Khởi động "duyệt lượt đặt"</td></tr>
<tr><td>Lab staff (nhân viên lab)</td><td>✅ tác nhân chính</td><td>Khởi động "giao thiết bị" và "nhận lại"</td></tr>
<tr><td>Hệ thống email của trường</td><td>✅ tác nhân phụ (secondary), hệ thống bên ngoài</td><td>Nằm ngoài LabFlow; LabFlow dùng nó để gửi email nhưng nó không bao giờ khởi động một use case</td></tr>
<tr><td>Database (CSDL)</td><td>❌</td><td>Nó nằm <em>bên trong</em> hệ thống bạn đang thiết kế — là một phần của lời giải, không phải người dùng lời giải</td></tr>
<tr><td>Trường, toà nhà, lab</td><td>❌</td><td>Là những thứ hệ thống lưu thông tin về (sẽ thành lớp), không phải vai trò tương tác</td></tr>
<tr><td>"Cường" (một sinh viên cụ thể)</td><td>❌</td><td>Actor là một vai, không phải một người; Cường đóng vai Student</td></tr>
</tbody>
</table>
<p class="meo">🧠 Phép thử cho mọi ứng viên: "Nó có nằm ngoài hệ thống của mình không, và có trao đổi thông điệp với hệ thống không?" Cả hai đều có → actor. Không thì nhiều khả năng nó là một lớp (class).</p>`),
    bi(`<h2>Step 2 — Find the use cases</h2>
<p>A <strong>use case</strong> is a goal an actor reaches with the system — a whole piece of value, not a click. The template's rule: name it <strong>verb + object</strong> ("Reserve Lab Slot", not "Reservation" or "Reservation Page"). Ask of each actor: what will it use the system for? will it create, store, change, remove or read data? must it tell the system about an event, or be told about one?</p>
<table>
<thead><tr><th>Actor</th><th>Use case</th><th>From the sentence</th></tr></thead>
<tbody>
<tr><td>Student</td><td>Search Available Slots</td><td>"searches for a free time slot"</td></tr>
<tr><td>Student</td><td>Reserve Lab Slot</td><td>"reserves it"</td></tr>
<tr><td>— (always part of Reserve)</td><td>Check Slot Availability</td><td>"the system always checks that the slot is still available"</td></tr>
<tr><td>Student</td><td>Join Waitlist</td><td>"If the slot is already full, the student may join a waitlist"</td></tr>
<tr><td>Student</td><td>Cancel Reservation</td><td>"can cancel their own reservation"</td></tr>
<tr><td>Lab Manager (+ E-mail System)</td><td>Approve Reservation</td><td>"approves or rejects… the student receives an e-mail"</td></tr>
<tr><td>Student</td><td>Request Equipment Loan</td><td>"can request to borrow a piece of equipment"</td></tr>
<tr><td>Lab Staff</td><td>Hand Out Equipment</td><td>"hand the equipment out"</td></tr>
<tr><td>Lab Staff</td><td>Receive Returned Equipment</td><td>"receive it back"</td></tr>
</tbody>
</table>
<p>Two relationships between use cases appear here, and they are the ones students confuse most:</p>
<ul>
<li><code>&lt;&lt;include&gt;&gt;</code> — the base use case <strong>always</strong> performs the included one. "Reserve Lab Slot" <em>always</em> checks availability, so <code>Reserve Lab Slot ..&gt; Check Slot Availability</code>. The arrow goes <strong>from the base to the included</strong> use case.</li>
<li><code>&lt;&lt;extend&gt;&gt;</code> — the extending use case adds behaviour <strong>only under a condition</strong>. Joining the waitlist happens only "if the slot is already full", so <code>Join Waitlist ..&gt; Reserve Lab Slot</code>. The arrow goes <strong>from the extension to the base</strong> use case.</li>
</ul>
<p class="meo">🧠 Include = "always, and I call you"; extend = "sometimes, and I plug myself into you". The arrow always starts at the use case that "knows" about the other one.</p>
<div class="pitfall">⚠️ "Is Login a use case?" Many FPT lecturers accept "Login" on the diagram; in Gomaa's approach logging in is usually not a use case of its own because it gives the user no value by itself (it is a precondition of the others). Neither answer is universally right — follow your lecturer, and be consistent.</div>`,
    `<h2>Bước 2 — Tìm use case</h2>
<p><strong>Use case</strong> (ca sử dụng) là một mục tiêu tác nhân đạt được nhờ hệ thống — trọn một phần giá trị, không phải một cú nhấp chuột. Luật của mẫu: đặt tên <strong>động từ + tân ngữ</strong> ("Reserve Lab Slot", không phải "Reservation" hay "Reservation Page"). Hỏi với từng actor: nó dùng hệ thống để làm gì? nó có tạo, lưu, sửa, xoá hay đọc dữ liệu không? nó có phải báo cho hệ thống biết một sự kiện, hoặc được hệ thống báo không?</p>
<table>
<thead><tr><th>Actor</th><th>Use case</th><th>Lấy từ câu</th></tr></thead>
<tbody>
<tr><td>Student</td><td>Search Available Slots (tìm khung giờ trống)</td><td>"searches for a free time slot"</td></tr>
<tr><td>Student</td><td>Reserve Lab Slot (đặt khung giờ lab)</td><td>"reserves it"</td></tr>
<tr><td>— (luôn là một phần của Reserve)</td><td>Check Slot Availability (kiểm slot còn trống)</td><td>"the system always checks that the slot is still available"</td></tr>
<tr><td>Student</td><td>Join Waitlist (vào danh sách chờ)</td><td>"If the slot is already full, the student may join a waitlist"</td></tr>
<tr><td>Student</td><td>Cancel Reservation (huỷ lượt đặt)</td><td>"can cancel their own reservation"</td></tr>
<tr><td>Lab Manager (+ E-mail System)</td><td>Approve Reservation (duyệt lượt đặt)</td><td>"approves or rejects… the student receives an e-mail"</td></tr>
<tr><td>Student</td><td>Request Equipment Loan (yêu cầu mượn thiết bị)</td><td>"can request to borrow a piece of equipment"</td></tr>
<tr><td>Lab Staff</td><td>Hand Out Equipment (giao thiết bị)</td><td>"hand the equipment out"</td></tr>
<tr><td>Lab Staff</td><td>Receive Returned Equipment (nhận lại thiết bị)</td><td>"receive it back"</td></tr>
</tbody>
</table>
<p>Ở đây xuất hiện hai quan hệ giữa các use case, và đó chính là hai quan hệ sinh viên hay nhầm nhất:</p>
<ul>
<li><code>&lt;&lt;include&gt;&gt;</code> (bao gồm) — use case gốc <strong>luôn luôn</strong> thực hiện use case được bao gồm. "Reserve Lab Slot" <em>luôn</em> kiểm tra slot còn trống, nên <code>Reserve Lab Slot ..&gt; Check Slot Availability</code>. Mũi tên đi <strong>từ use case gốc tới use case được bao gồm</strong>.</li>
<li><code>&lt;&lt;extend&gt;&gt;</code> (mở rộng) — use case mở rộng thêm hành vi <strong>chỉ khi có điều kiện</strong>. Vào waitlist chỉ xảy ra "if the slot is already full" (nếu slot đã đầy), nên <code>Join Waitlist ..&gt; Reserve Lab Slot</code>. Mũi tên đi <strong>từ phần mở rộng tới use case gốc</strong>.</li>
</ul>
<p class="meo">🧠 Include = "luôn luôn, và tôi gọi bạn"; extend = "thỉnh thoảng, và tôi tự gắn vào bạn". Mũi tên luôn xuất phát từ use case "biết" về use case kia.</p>
<div class="pitfall">⚠️ "Login có phải use case không?" Nhiều giảng viên FPT chấp nhận vẽ "Login" lên sơ đồ; theo cách của Gomaa thì đăng nhập thường không là use case riêng vì tự nó không đem lại giá trị cho người dùng (nó là điều kiện trước của các use case khác). Không có đáp án đúng tuyệt đối — làm theo giảng viên của bạn, và làm nhất quán.</div>`),
    bi(`<h2>Step 3 — Draw it in PlantUML</h2>
<p>First sketch it on paper: stick figures on the left, one big rectangle labelled LabFlow, ovals inside. Then type it. Here is the result — open "PlantUML code" under the picture to copy the source.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/cf8eac92891c3dc3861895fd10991adeeb1c33a8.svg" alt="LabFlow — first use case diagram (reservations and equipment loans)" loading="lazy" /><p class="chu-thich">🧩 LabFlow — first use case diagram (reservations and equipment loans)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' First use case diagram of LabFlow (illustration) — actors outside, use cases inside the system boundary
title LabFlow — first use case diagram (reservations and equipment loans)
left to right direction
actor Student
actor "Lab Manager" as LM
actor "Lab Staff" as LS
actor "Email System" as Mail &lt;&lt;external system&gt;&gt;
rectangle LabFlow {
  usecase "Search Available Slots" as UC1
  usecase "Reserve Lab Slot" as UC2
  usecase "Check Slot Availability" as UC3
  usecase "Join Waitlist" as UC4
  usecase "Cancel Reservation" as UC5
  usecase "Approve Reservation" as UC6
  usecase "Request Equipment Loan" as UC7
  usecase "Hand Out Equipment" as UC8
  usecase "Receive Returned Equipment" as UC9
}
Student -- UC1
Student -- UC2
Student -- UC5
Student -- UC7
UC2 ..&gt; UC3 : &lt;&lt;include&gt;&gt;
UC4 ..&gt; UC2 : &lt;&lt;extend&gt;&gt;
LM -- UC6
UC6 -- Mail
LS -- UC8
LS -- UC9
@enduml</code></pre></details>
<p>What each kind of line in the code means:</p>
<table>
<thead><tr><th>PlantUML line</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>left to right direction</code></td><td>Put actors on the left and use cases to the right (easier to read)</td></tr>
<tr><td><code>actor "Lab Manager" as LM</code></td><td>An actor; a name with a space needs quotes, and <code>as LM</code> gives it a short alias</td></tr>
<tr><td><code>actor "Email System" as Mail &lt;&lt;external system&gt;&gt;</code></td><td>A stereotype in guillemets tells the reader this actor is a system, not a person</td></tr>
<tr><td><code>rectangle LabFlow { … }</code></td><td>The system boundary: use cases inside, actors outside</td></tr>
<tr><td><code>usecase "Reserve Lab Slot" as UC2</code></td><td>One use case with an alias</td></tr>
<tr><td><code>Student -- UC2</code></td><td>Association: the actor takes part in the use case</td></tr>
<tr><td><code>UC2 ..&gt; UC3 : &lt;&lt;include&gt;&gt;</code></td><td>Dashed arrow from base to included use case</td></tr>
<tr><td><code>UC4 ..&gt; UC2 : &lt;&lt;extend&gt;&gt;</code></td><td>Dashed arrow from the extending use case to the base one</td></tr>
</tbody>
</table>
<p>Read the picture as sentences: "A Student can Reserve Lab Slot, which always includes Check Slot Availability; Join Waitlist extends Reserve Lab Slot when the slot is full; a Lab Manager approves reservations, and the Email System takes part in that use case."</p>`,
    `<h2>Bước 3 — Vẽ bằng PlantUML</h2>
<p>Phác trên giấy trước: người que bên trái, một hình chữ nhật lớn ghi LabFlow, các hình bầu dục bên trong. Rồi mới gõ. Đây là kết quả — mở mục "Mã PlantUML" dưới hình để chép mã nguồn.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/cf8eac92891c3dc3861895fd10991adeeb1c33a8.svg" alt="LabFlow — first use case diagram (reservations and equipment loans)" loading="lazy" /><p class="chu-thich">🧩 LabFlow — first use case diagram (reservations and equipment loans)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Use case diagram đầu tiên của LabFlow (minh hoạ) — tác nhân ở ngoài, use case ở trong ranh giới hệ thống
title LabFlow — first use case diagram (reservations and equipment loans)
left to right direction
actor Student
actor "Lab Manager" as LM
actor "Lab Staff" as LS
actor "Email System" as Mail &lt;&lt;external system&gt;&gt;
rectangle LabFlow {
  usecase "Search Available Slots" as UC1
  usecase "Reserve Lab Slot" as UC2
  usecase "Check Slot Availability" as UC3
  usecase "Join Waitlist" as UC4
  usecase "Cancel Reservation" as UC5
  usecase "Approve Reservation" as UC6
  usecase "Request Equipment Loan" as UC7
  usecase "Hand Out Equipment" as UC8
  usecase "Receive Returned Equipment" as UC9
}
Student -- UC1
Student -- UC2
Student -- UC5
Student -- UC7
UC2 ..&gt; UC3 : &lt;&lt;include&gt;&gt;
UC4 ..&gt; UC2 : &lt;&lt;extend&gt;&gt;
LM -- UC6
UC6 -- Mail
LS -- UC8
LS -- UC9
@enduml</code></pre></details>
<p>Từng loại dòng trong mã có nghĩa là gì:</p>
<table>
<thead><tr><th>Dòng PlantUML</th><th>Ý nghĩa</th></tr></thead>
<tbody>
<tr><td><code>left to right direction</code></td><td>Đặt actor bên trái, use case bên phải (dễ đọc hơn)</td></tr>
<tr><td><code>actor "Lab Manager" as LM</code></td><td>Một actor; tên có dấu cách phải để trong nháy kép, <code>as LM</code> đặt bí danh (alias) ngắn</td></tr>
<tr><td><code>actor "Email System" as Mail &lt;&lt;external system&gt;&gt;</code></td><td>Stereotype (khuôn mẫu) trong ngoặc «» cho người đọc biết actor này là một hệ thống, không phải người</td></tr>
<tr><td><code>rectangle LabFlow { … }</code></td><td>Ranh giới hệ thống (system boundary): use case bên trong, actor bên ngoài</td></tr>
<tr><td><code>usecase "Reserve Lab Slot" as UC2</code></td><td>Một use case kèm bí danh</td></tr>
<tr><td><code>Student -- UC2</code></td><td>Liên kết (association): actor tham gia use case</td></tr>
<tr><td><code>UC2 ..&gt; UC3 : &lt;&lt;include&gt;&gt;</code></td><td>Mũi tên nét đứt từ use case gốc tới use case được bao gồm</td></tr>
<tr><td><code>UC4 ..&gt; UC2 : &lt;&lt;extend&gt;&gt;</code></td><td>Mũi tên nét đứt từ use case mở rộng tới use case gốc</td></tr>
</tbody>
</table>
<p>Đọc hình thành câu: "Student có thể Reserve Lab Slot, việc này luôn bao gồm Check Slot Availability; Join Waitlist mở rộng Reserve Lab Slot khi slot đã đầy; Lab Manager duyệt lượt đặt, và Email System tham gia use case đó."</p>`),
    bi(`<h2>Step 4 — Describe one use case in words</h2>
<p>A diagram shows <em>which</em> goals exist; the <strong>use case description</strong> (specification) says <em>how</em> each goal is reached. The school templates (Assignment 01, SRS Report 3) use these fields:</p>
<pre><code class="language-plaintext">Use case:            Reserve Lab Slot
Primary actor:       Student
Secondary actors:    None
Description:         A student reserves a free time slot in a lab; the reservation
                     waits for a lab manager's approval.
Dependency:          Includes Check Slot Availability; extended by Join Waitlist.
Preconditions:       The student is logged in and has chosen a lab and a time slot.
Main sequence:
  1. Student selects "Reserve" for the chosen lab and slot.
  2. System checks that the slot is still available (include: Check Slot Availability).
  3. System creates a reservation with status PENDING.
  4. System shows the reservation and its status to the student.
Alternative sequences:
  Step 2: if the slot is already full, the system offers the waitlist;
          the student may join it (extend: Join Waitlist) or stop.
  Step 3: if the student already holds a reservation that overlaps this
          slot, the system rejects the request and shows the conflict.
Postconditions:      A PENDING reservation exists for this student, lab and slot.</code></pre>
<p class="meo">🧠 Main sequence = alternating "actor does → system does" steps, numbered. Every "if" you are tempted to write in the main sequence belongs in the alternative sequences, referring to the step number where it branches.</p>`,
    `<h2>Bước 4 — Đặc tả một use case bằng lời</h2>
<p>Sơ đồ cho thấy <em>những</em> mục tiêu nào tồn tại; <strong>đặc tả use case</strong> (use case description/specification) nói mỗi mục tiêu đạt được <em>thế nào</em>. Các mẫu của trường (Assignment 01, SRS Report 3) dùng những trường sau: tác nhân chính/phụ (primary/secondary actor), mô tả, phụ thuộc (dependency — include/extend), điều kiện trước (precondition), luồng chính (main sequence), luồng thay thế (alternative sequences), điều kiện sau (postcondition). Đặc tả viết bằng tiếng Anh như trong báo cáo:</p>
<pre><code class="language-plaintext">Use case:            Reserve Lab Slot
Primary actor:       Student
Secondary actors:    None
Description:         A student reserves a free time slot in a lab; the reservation
                     waits for a lab manager's approval.
Dependency:          Includes Check Slot Availability; extended by Join Waitlist.
Preconditions:       The student is logged in and has chosen a lab and a time slot.
Main sequence:
  1. Student selects "Reserve" for the chosen lab and slot.
  2. System checks that the slot is still available (include: Check Slot Availability).
  3. System creates a reservation with status PENDING.
  4. System shows the reservation and its status to the student.
Alternative sequences:
  Step 2: if the slot is already full, the system offers the waitlist;
          the student may join it (extend: Join Waitlist) or stop.
  Step 3: if the student already holds a reservation that overlaps this
          slot, the system rejects the request and shows the conflict.
Postconditions:      A PENDING reservation exists for this student, lab and slot.</code></pre>
<p class="meo">🧠 Luồng chính = các bước xen kẽ "actor làm → hệ thống làm", có đánh số. Mọi chữ "nếu" bạn định viết vào luồng chính đều thuộc về luồng thay thế, ghi rõ rẽ nhánh ở bước số mấy.</p>`),
    bi(`<h2>Five classic mistakes — all in one (wrong) diagram</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/d6fccf499be00cb745553c1dac6edbb4c6ee1369.svg" alt="WRONG on purpose — five beginner mistakes in one use case diagram" loading="lazy" /><p class="chu-thich">🧩 WRONG on purpose — five beginner mistakes in one use case diagram</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' The same system drawn with five classic beginner mistakes (do NOT copy)
title WRONG on purpose — five beginner mistakes in one use case diagram
left to right direction
actor Student
actor Database
rectangle LabFlow {
  usecase "Reservation Page" as W1
  usecase "Click Submit Button" as W2
  usecase "Check Slot Availability" as W3
  usecase "Reserve Lab Slot" as W4
}
Student -- W1
Student -- W2
Student -- W4
W3 ..&gt; W4 : &lt;&lt;include&gt;&gt;
W4 -- Database
Student -- Database
note right of Database
  (1) The database is INSIDE the system,
  it is never an actor.
  (5) Actors never talk to each other
  in a use case diagram.
end note
note top of W1
  (2) A screen, not a goal:
  name = verb + object.
end note
note bottom of W2
  (3) One step of a use case,
  not a use case.
end note
note bottom of W3
  (4) Include arrow is reversed:
  it must go FROM the base use case
  (Reserve Lab Slot) TO the included one.
end note
@enduml</code></pre></details>
<ol>
<li><strong>The database as an actor.</strong> It is inside your system. If you need to show storage, that belongs in the architecture or deployment diagram, not here.</li>
<li><strong>A screen as a use case</strong> ("Reservation Page"). Screens belong to the UI design; use cases are goals named verb + object.</li>
<li><strong>A step as a use case</strong> ("Click Submit Button"). That is step 1 of the main sequence of "Reserve Lab Slot".</li>
<li><strong>The include arrow reversed.</strong> It must point from the base use case to the included one.</li>
<li><strong>An association between two actors.</strong> In a use case diagram actors communicate only through use cases. (Generalization between actors — "Lecturer is a kind of User" — is allowed; that is a different arrow.)</li>
</ol>`,
    `<h2>Năm lỗi kinh điển — gom trong một sơ đồ (sai)</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/d6fccf499be00cb745553c1dac6edbb4c6ee1369.svg" alt="WRONG on purpose — five beginner mistakes in one use case diagram" loading="lazy" /><p class="chu-thich">🧩 WRONG on purpose — five beginner mistakes in one use case diagram</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Cùng hệ thống, vẽ với năm lỗi kinh điển của người mới (ĐỪNG chép)
title WRONG on purpose — five beginner mistakes in one use case diagram
left to right direction
actor Student
actor Database
rectangle LabFlow {
  usecase "Reservation Page" as W1
  usecase "Click Submit Button" as W2
  usecase "Check Slot Availability" as W3
  usecase "Reserve Lab Slot" as W4
}
Student -- W1
Student -- W2
Student -- W4
W3 ..&gt; W4 : &lt;&lt;include&gt;&gt;
W4 -- Database
Student -- Database
note right of Database
  (1) The database is INSIDE the system,
  it is never an actor.
  (5) Actors never talk to each other
  in a use case diagram.
end note
note top of W1
  (2) A screen, not a goal:
  name = verb + object.
end note
note bottom of W2
  (3) One step of a use case,
  not a use case.
end note
note bottom of W3
  (4) Include arrow is reversed:
  it must go FROM the base use case
  (Reserve Lab Slot) TO the included one.
end note
@enduml</code></pre></details>
<ol>
<li><strong>Coi database là actor.</strong> Nó nằm trong hệ thống của bạn. Nếu cần thể hiện nơi lưu trữ thì đó là việc của sơ đồ kiến trúc hoặc sơ đồ triển khai (deployment), không phải ở đây.</li>
<li><strong>Coi màn hình là use case</strong> ("Reservation Page"). Màn hình thuộc thiết kế giao diện; use case là mục tiêu, đặt tên động từ + tân ngữ.</li>
<li><strong>Coi một bước là use case</strong> ("Click Submit Button"). Đó là bước 1 trong luồng chính của "Reserve Lab Slot".</li>
<li><strong>Mũi tên include bị ngược.</strong> Nó phải chỉ từ use case gốc tới use case được bao gồm.</li>
<li><strong>Nối liên kết giữa hai actor.</strong> Trong use case diagram, actor chỉ giao tiếp qua use case. (Tổng quát hoá giữa các actor — "Lecturer là một loại User" — thì được phép; đó là một loại mũi tên khác.)</li>
</ol>`),
    bi(`<h2>Step 5 — From nouns to classes</h2>
<p>Now the second question: what must the system <strong>remember</strong>? The classic beginner technique is <strong>noun extraction</strong>: underline every noun in the requirement and decide for each one whether it is a class, an attribute of a class, or noise. Chapter 7–8 refines this into COMET's entity/boundary/control classes; for a first diagram we only look for <strong>entity classes</strong> — long-lived data.</p>
<table>
<thead><tr><th>Noun</th><th>Decision</th><th>Reason</th></tr></thead>
<tbody>
<tr><td>university</td><td>❌ ignore</td><td>There is only one; it is the context of the whole system, not data it stores many of</td></tr>
<tr><td>building</td><td>✅ class <code>Building</code></td><td>Many buildings; each has a name and contains labs</td></tr>
<tr><td>lab</td><td>✅ class <code>Lab</code></td><td>Has a name, a capacity, equipment and reservations</td></tr>
<tr><td>equipment (oscilloscope, 3D printer…)</td><td>✅ class <code>Equipment</code></td><td>The examples are kinds of equipment — values of a "name"/"type" attribute, not separate classes (yet)</td></tr>
<tr><td>time slot</td><td>➡️ attributes <code>start</code>, <code>end</code> of <code>Reservation</code></td><td>In this simplified slice a slot only matters as the time of a reservation</td></tr>
<tr><td>reservation</td><td>✅ class <code>Reservation</code></td><td>Has a time, a status (pending, approved, rejected, cancelled), is created, approved, cancelled</td></tr>
<tr><td>waitlist</td><td>⏸ leave for later</td><td>It is a real concept (an entry with a position), but keep the first diagram small — it is a good extension exercise</td></tr>
<tr><td>student, lab manager, lab staff</td><td>✅ classes <code>Student</code>, <code>LabManager</code>, <code>LabStaff</code> under a general <code>User</code></td><td>The system stores data about them (name, e-mail) and links them to reservations and loans; they are both actors and entity classes</td></tr>
<tr><td>e-mail</td><td>❌ not an entity here</td><td>Sent through an external system; LabFlow does not need to remember it in this slice</td></tr>
<tr><td>loan ("borrowed, due, returned")</td><td>✅ class <code>Loan</code></td><td>The requirement says the system records three times — that is data with its own life</td></tr>
<tr><td>lab desk</td><td>❌ ignore</td><td>A physical place, no data about it is required</td></tr>
</tbody>
</table>
<div class="pitfall">⚠️ An actor can also be a class. <code>Student</code> is an actor in the use case diagram (a role interacting with the system) <em>and</em> an entity class in the class diagram (data the system stores). This double life confuses many students in the TE — both answers are correct, in their own diagram.</div>`,
    `<h2>Bước 5 — Từ danh từ ra lớp</h2>
<p>Giờ tới câu hỏi thứ hai: hệ thống phải <strong>nhớ</strong> những gì? Kỹ thuật kinh điển cho người mới là <strong>trích danh từ (noun extraction)</strong>: gạch chân mọi danh từ trong yêu cầu và quyết định với từng cái nó là một lớp (class), một thuộc tính (attribute) của lớp, hay nhiễu. Chapter 7–8 sẽ tinh chỉnh việc này thành các lớp entity/boundary/control của COMET; với sơ đồ đầu tiên ta chỉ tìm <strong>lớp thực thể (entity class)</strong> — dữ liệu sống lâu.</p>
<table>
<thead><tr><th>Danh từ</th><th>Quyết định</th><th>Lý do</th></tr></thead>
<tbody>
<tr><td>university (trường)</td><td>❌ bỏ</td><td>Chỉ có một; nó là bối cảnh của cả hệ thống, không phải dữ liệu lưu nhiều bản</td></tr>
<tr><td>building (toà nhà)</td><td>✅ lớp <code>Building</code></td><td>Nhiều toà; mỗi toà có tên và chứa các lab</td></tr>
<tr><td>lab</td><td>✅ lớp <code>Lab</code></td><td>Có tên, sức chứa (capacity), thiết bị và các lượt đặt</td></tr>
<tr><td>equipment (máy hiện sóng, máy in 3D…)</td><td>✅ lớp <code>Equipment</code></td><td>Các ví dụ là các loại thiết bị — là giá trị của thuộc tính "name"/"type", chưa phải lớp riêng</td></tr>
<tr><td>time slot (khung giờ)</td><td>➡️ thuộc tính <code>start</code>, <code>end</code> của <code>Reservation</code></td><td>Trong lát cắt rút gọn này slot chỉ có ý nghĩa là thời gian của một lượt đặt</td></tr>
<tr><td>reservation (lượt đặt)</td><td>✅ lớp <code>Reservation</code></td><td>Có thời gian, trạng thái (chờ, duyệt, từ chối, huỷ), được tạo, duyệt, huỷ</td></tr>
<tr><td>waitlist (danh sách chờ)</td><td>⏸ để sau</td><td>Là khái niệm thật (một mục có thứ tự), nhưng giữ sơ đồ đầu tiên nhỏ — là bài tập mở rộng tốt</td></tr>
<tr><td>student, lab manager, lab staff</td><td>✅ lớp <code>Student</code>, <code>LabManager</code>, <code>LabStaff</code> dưới lớp tổng quát <code>User</code></td><td>Hệ thống lưu dữ liệu về họ (tên, email) và nối họ với lượt đặt, lượt mượn; họ vừa là actor vừa là lớp thực thể</td></tr>
<tr><td>e-mail</td><td>❌ không là thực thể ở đây</td><td>Gửi qua hệ thống bên ngoài; trong lát cắt này LabFlow không cần nhớ nó</td></tr>
<tr><td>loan (lượt mượn — "borrowed, due, returned")</td><td>✅ lớp <code>Loan</code></td><td>Yêu cầu nói hệ thống ghi ba mốc thời gian — đó là dữ liệu có vòng đời riêng</td></tr>
<tr><td>lab desk (quầy lab)</td><td>❌ bỏ</td><td>Một địa điểm vật lý, không cần dữ liệu về nó</td></tr>
</tbody>
</table>
<div class="pitfall">⚠️ Một actor cũng có thể là một lớp. <code>Student</code> là actor trong use case diagram (vai trò tương tác với hệ thống) <em>và</em> là lớp thực thể trong class diagram (dữ liệu hệ thống lưu). Cuộc sống hai mặt này làm nhiều sinh viên rối trong TE — cả hai đều đúng, mỗi cái trong sơ đồ của nó.</div>`),
    bi(`<h2>Step 6 — Names and relationships first</h2>
<p>Draw only boxes with names and plain lines between classes that "know about" each other. Do not think about attributes yet. This is exactly the level PE question 1 asks for ("entity level, showing only class names").</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/9c25765ec10dd9c54f109f63c94b6fa2aa8c8eab.svg" alt="LabFlow — class diagram, step 1: names and relationships only" loading="lazy" /><p class="chu-thich">🧩 LabFlow — class diagram, step 1: names and relationships only</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Step 1 of the class diagram: class names and relationships only (entity level)
title LabFlow — class diagram, step 1: names and relationships only
hide empty members
class Building
class Lab
class Equipment
class Reservation
class Student
class LabManager
class LabStaff
class Loan
Building -- Lab
Lab -- Equipment
Student -- Reservation
Lab -- Reservation
LabManager -- Reservation
Student -- Loan
Loan -- Equipment
LabStaff -- Loan
@enduml</code></pre></details>
<p>Check every line with a sentence from the requirement: "each building contains labs" (Building–Lab), "each lab houses equipment" (Lab–Equipment), "a student reserves a lab slot" (Student–Reservation, Lab–Reservation), "a lab manager approves reservations" (LabManager–Reservation), "a student borrows equipment, lab staff hand it out" (Student–Loan, Equipment–Loan, LabStaff–Loan). A line you cannot justify with a sentence should not be there.</p>`,
    `<h2>Bước 6 — Tên và quan hệ trước</h2>
<p>Chỉ vẽ hộp có tên và đường nối trơn giữa các lớp "biết về" nhau. Chưa nghĩ tới thuộc tính. Đây đúng là mức câu 1 đề PE yêu cầu ("entity level, showing only class names" — mức thực thể, chỉ tên lớp).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/9c25765ec10dd9c54f109f63c94b6fa2aa8c8eab.svg" alt="LabFlow — class diagram, step 1: names and relationships only" loading="lazy" /><p class="chu-thich">🧩 LabFlow — class diagram, step 1: names and relationships only</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bước 1 của class diagram: chỉ tên lớp và quan hệ (mức thực thể)
title LabFlow — class diagram, step 1: names and relationships only
hide empty members
class Building
class Lab
class Equipment
class Reservation
class Student
class LabManager
class LabStaff
class Loan
Building -- Lab
Lab -- Equipment
Student -- Reservation
Lab -- Reservation
LabManager -- Reservation
Student -- Loan
Loan -- Equipment
LabStaff -- Loan
@enduml</code></pre></details>
<p>Kiểm từng đường nối bằng một câu trong yêu cầu: "each building contains labs" (Building–Lab), "each lab houses equipment" (Lab–Equipment), "a student reserves a lab slot" (Student–Reservation, Lab–Reservation), "a lab manager approves reservations" (LabManager–Reservation), "a student borrows equipment, lab staff hand it out" (Student–Loan, Equipment–Loan, LabStaff–Loan). Đường nào không biện minh được bằng một câu thì không nên có.</p>`),
    bi(`<h2>Step 7 — Attributes, multiplicities and the kind of each relationship</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/dcb362dc75c60272777034c6f11c8f8fd5e1c207.svg" alt="LabFlow — class diagram, step 2: attributes, multiplicities, kinds of relationship" loading="lazy" /><p class="chu-thich">🧩 LabFlow — class diagram, step 2: attributes, multiplicities, kinds of relationship</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Step 2: attributes, multiplicities, composition/aggregation, generalization
title LabFlow — class diagram, step 2: attributes, multiplicities, kinds of relationship
abstract class User &lt;&lt;entity&gt;&gt; {
  - id : Long
  - fullName : String
  - email : String
}
class Student &lt;&lt;entity&gt;&gt; {
  - studentCode : String
}
class LabManager &lt;&lt;entity&gt;&gt;
class LabStaff &lt;&lt;entity&gt;&gt;
class Building &lt;&lt;entity&gt;&gt; {
  - name : String
}
class Lab &lt;&lt;entity&gt;&gt; {
  - name : String
  - capacity : int
}
class Equipment &lt;&lt;entity&gt;&gt; {
  - code : String
  - name : String
}
class Reservation &lt;&lt;entity&gt;&gt; {
  - id : Long
  - start : LocalDateTime
  - end : LocalDateTime
  - status : ReservationStatus
  + approve() : void
  + cancel() : void
}
class Loan &lt;&lt;entity&gt;&gt; {
  - borrowedAt : LocalDateTime
  - dueAt : LocalDateTime
  - returnedAt : LocalDateTime [0..1]
}
enum ReservationStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}
User &lt;|-- Student
User &lt;|-- LabManager
User &lt;|-- LabStaff
Building "1" *-- "1..*" Lab : contains &gt;
Lab "1" o-- "0..*" Equipment : houses &gt;
Student "1" -- "0..*" Reservation : makes &gt;
Lab "1" -- "0..*" Reservation : is booked by &gt;
LabManager "0..1" -- "0..*" Reservation : approves &gt;
Student "1" -- "0..*" Loan : borrows &gt;
Equipment "1" -- "0..*" Loan : is lent in &gt;
LabStaff "1" -- "0..*" Loan : hands out &gt;
Reservation ..&gt; ReservationStatus
@enduml</code></pre></details>
<p>Every symbol in this diagram is a decision. Here is the reasoning, one by one:</p>
<table>
<thead><tr><th>Relationship</th><th>Symbol</th><th>Why this and not something else</th></tr></thead>
<tbody>
<tr><td>Building – Lab</td><td>Filled diamond at Building (composition), <code>1</code> to <code>1..*</code></td><td>In our system a lab cannot exist without its building — delete the building record and its labs go too. "Each building contains one or more labs" gives <code>1..*</code></td></tr>
<tr><td>Lab – Equipment</td><td>Hollow diamond at Lab (aggregation), <code>1</code> to <code>0..*</code></td><td>Whole–part, but the part lives on its own: "equipment can be moved from one lab to another". A new lab may have no equipment yet: <code>0..*</code></td></tr>
<tr><td>User ◁– Student, LabManager, LabStaff</td><td>Hollow triangle (generalization)</td><td>All three are users with a name and e-mail; each is "a kind of" User. <code>User</code> is abstract — nobody is just a "User"</td></tr>
<tr><td>Student – Reservation</td><td>Plain association, <code>1</code> to <code>0..*</code></td><td>One student makes zero or many reservations; each reservation belongs to exactly one student</td></tr>
<tr><td>Lab – Reservation</td><td>Plain association, <code>1</code> to <code>0..*</code></td><td>Each reservation is for exactly one lab</td></tr>
<tr><td>LabManager – Reservation</td><td>Plain association, <code>0..1</code> to <code>0..*</code></td><td>A PENDING reservation has no approver yet — hence <code>0..1</code>, not <code>1</code></td></tr>
<tr><td>Student / Equipment / LabStaff – Loan</td><td>Plain associations, <code>1</code> to <code>0..*</code></td><td>Each loan is one student borrowing one item, handed out by one staff member</td></tr>
<tr><td>Reservation ‥> ReservationStatus</td><td>Dependency on an enumeration</td><td>The status can only take four fixed values</td></tr>
</tbody>
</table>
<p class="meo">🧠 To read multiplicity, stand at one class and look at the number on the <strong>far</strong> end: from Student, the far end says <code>0..*</code> → "a student makes zero or more reservations". From Reservation, the far end says <code>1</code> → "a reservation is made by exactly one student".</p>
<div class="pitfall">⚠️ Four class-diagram mistakes worth avoiding from day one: (1) writing <code>studentId : Long</code> inside <code>Reservation</code> — in the analysis model the <em>association line</em> is the link; foreign keys appear later, in the database design; (2) aggregation where composition is meant, or the reverse — always ask "can the part exist without the whole?"; (3) missing multiplicities — PE question 1 explicitly requires them; (4) filling classes with getters and setters — they add nothing to an analysis diagram.</div>`,
    `<h2>Bước 7 — Thuộc tính, bội số và loại của từng quan hệ</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/dcb362dc75c60272777034c6f11c8f8fd5e1c207.svg" alt="LabFlow — class diagram, step 2: attributes, multiplicities, kinds of relationship" loading="lazy" /><p class="chu-thich">🧩 LabFlow — class diagram, step 2: attributes, multiplicities, kinds of relationship</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bước 2: thuộc tính, bội số, hợp thành/kết tập, tổng quát hoá
title LabFlow — class diagram, step 2: attributes, multiplicities, kinds of relationship
abstract class User &lt;&lt;entity&gt;&gt; {
  - id : Long
  - fullName : String
  - email : String
}
class Student &lt;&lt;entity&gt;&gt; {
  - studentCode : String
}
class LabManager &lt;&lt;entity&gt;&gt;
class LabStaff &lt;&lt;entity&gt;&gt;
class Building &lt;&lt;entity&gt;&gt; {
  - name : String
}
class Lab &lt;&lt;entity&gt;&gt; {
  - name : String
  - capacity : int
}
class Equipment &lt;&lt;entity&gt;&gt; {
  - code : String
  - name : String
}
class Reservation &lt;&lt;entity&gt;&gt; {
  - id : Long
  - start : LocalDateTime
  - end : LocalDateTime
  - status : ReservationStatus
  + approve() : void
  + cancel() : void
}
class Loan &lt;&lt;entity&gt;&gt; {
  - borrowedAt : LocalDateTime
  - dueAt : LocalDateTime
  - returnedAt : LocalDateTime [0..1]
}
enum ReservationStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}
User &lt;|-- Student
User &lt;|-- LabManager
User &lt;|-- LabStaff
Building "1" *-- "1..*" Lab : contains &gt;
Lab "1" o-- "0..*" Equipment : houses &gt;
Student "1" -- "0..*" Reservation : makes &gt;
Lab "1" -- "0..*" Reservation : is booked by &gt;
LabManager "0..1" -- "0..*" Reservation : approves &gt;
Student "1" -- "0..*" Loan : borrows &gt;
Equipment "1" -- "0..*" Loan : is lent in &gt;
LabStaff "1" -- "0..*" Loan : hands out &gt;
Reservation ..&gt; ReservationStatus
@enduml</code></pre></details>
<p>Mỗi ký hiệu trong sơ đồ này là một quyết định. Đây là lập luận, từng cái một:</p>
<table>
<thead><tr><th>Quan hệ</th><th>Ký hiệu</th><th>Vì sao chọn cái này mà không phải cái khác</th></tr></thead>
<tbody>
<tr><td>Building – Lab</td><td>Hình thoi đặc phía Building (composition — hợp thành), <code>1</code> tới <code>1..*</code></td><td>Trong hệ thống của ta, lab không tồn tại được khi không có toà nhà — xoá bản ghi toà nhà thì các lab đi theo. "Each building contains one or more labs" cho ra <code>1..*</code></td></tr>
<tr><td>Lab – Equipment</td><td>Hình thoi rỗng phía Lab (aggregation — kết tập), <code>1</code> tới <code>0..*</code></td><td>Quan hệ toàn thể–bộ phận, nhưng bộ phận sống độc lập: "equipment can be moved from one lab to another". Lab mới có thể chưa có thiết bị: <code>0..*</code></td></tr>
<tr><td>User ◁– Student, LabManager, LabStaff</td><td>Tam giác rỗng (generalization — tổng quát hoá)</td><td>Cả ba đều là người dùng có tên và email; mỗi cái là "một loại" User. <code>User</code> là lớp trừu tượng (abstract) — không ai chỉ là "User" trơn</td></tr>
<tr><td>Student – Reservation</td><td>Liên kết thường, <code>1</code> tới <code>0..*</code></td><td>Một sinh viên đặt không hoặc nhiều lượt; mỗi lượt đặt thuộc đúng một sinh viên</td></tr>
<tr><td>Lab – Reservation</td><td>Liên kết thường, <code>1</code> tới <code>0..*</code></td><td>Mỗi lượt đặt là cho đúng một lab</td></tr>
<tr><td>LabManager – Reservation</td><td>Liên kết thường, <code>0..1</code> tới <code>0..*</code></td><td>Lượt đặt còn PENDING (chờ duyệt) chưa có người duyệt — nên là <code>0..1</code>, không phải <code>1</code></td></tr>
<tr><td>Student / Equipment / LabStaff – Loan</td><td>Liên kết thường, <code>1</code> tới <code>0..*</code></td><td>Mỗi lượt mượn là một sinh viên mượn một món, do một nhân viên giao</td></tr>
<tr><td>Reservation ‥> ReservationStatus</td><td>Phụ thuộc vào một kiểu liệt kê (enumeration)</td><td>Trạng thái chỉ nhận bốn giá trị cố định</td></tr>
</tbody>
</table>
<p class="meo">🧠 Đọc bội số: đứng ở một lớp và nhìn con số ở đầu <strong>bên kia</strong>: từ Student, đầu bên kia ghi <code>0..*</code> → "một sinh viên đặt không hoặc nhiều lượt". Từ Reservation, đầu bên kia ghi <code>1</code> → "một lượt đặt do đúng một sinh viên tạo".</p>
<div class="pitfall">⚠️ Bốn lỗi class diagram nên tránh ngay từ ngày đầu: (1) ghi <code>studentId : Long</code> bên trong <code>Reservation</code> — trong mô hình phân tích (analysis model), chính <em>đường liên kết</em> là mối nối; khoá ngoại (foreign key) xuất hiện sau, ở thiết kế CSDL; (2) dùng aggregation khi ý là composition, hoặc ngược lại — luôn hỏi "bộ phận có tồn tại được khi không có toàn thể không?"; (3) thiếu bội số — câu 1 đề PE bắt buộc có; (4) nhồi getter/setter vào lớp — chúng không thêm gì cho sơ đồ phân tích.</div>`),
    bi(`<h2>🧪 Exercises — do them yourself before opening the answers</h2>
<h3>🧪 Exercise 1 — Smart Coffee Shop: actors and use cases (school PT1 trial case)</h3>
<p>From the school's "Smart Coffee Shop System" case study: customers order by scanning a QR code or through a mobile app, choose drinks and customise size/sugar/milk, and pay by cash, card or e-wallet. Orders go to the preparation area; <strong>IoT coffee machines brew standard drinks automatically</strong>, baristas prepare the others. When drinks are ready the system notifies the customer via a display screen, speaker or the app. When a coffee machine has an error (out of water, wrong temperature, jam) the system logs it and notifies staff. Managers view orders, revenue and best-selling drinks. <strong>Task:</strong> identify the actors (hint from the case: people <em>and</em> hardware devices) and draw a use case diagram for the ordering part.</p>
<details><summary>✅ Model answer and reasoning</summary>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/6f78c0ad2821455596c9d687c2ec7ebf0a6fac42.svg" alt="Exercise 1 — Smart Coffee Shop: ordering part (model answer)" loading="lazy" /><p class="chu-thich">🧩 Exercise 1 — Smart Coffee Shop: ordering part (model answer)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 1 answer: Smart Coffee Shop (PT1 trial case) — people AND devices can be actors
title Exercise 1 — Smart Coffee Shop: ordering part (model answer)
left to right direction
actor Customer
actor Barista
actor Manager
actor "Coffee Machine" as CM &lt;&lt;input/output device&gt;&gt;
actor "Display Screen" as DS &lt;&lt;output device&gt;&gt;
actor "Payment Gateway" as PG &lt;&lt;external system&gt;&gt;
rectangle "Smart Coffee Shop System" {
  usecase "Place Order" as U1
  usecase "Customize Drink" as U2
  usecase "Pay for Order" as U3
  usecase "Prepare Order" as U4
  usecase "Brew Standard Drink" as U5
  usecase "Notify Order Ready" as U6
  usecase "Report Machine Error" as U7
  usecase "View Sales Report" as U8
}
Customer -- U1
U2 ..&gt; U1 : &lt;&lt;extend&gt;&gt;
U1 ..&gt; U3 : &lt;&lt;include&gt;&gt;
U3 -- PG
Barista -- U4
U5 ..&gt; U4 : &lt;&lt;extend&gt;&gt;
U5 -- CM
U4 ..&gt; U6 : &lt;&lt;include&gt;&gt;
U6 -- DS
CM -- U7
Manager -- U8
@enduml</code></pre></details>
<ul>
<li><strong>Devices are actors.</strong> The coffee machine and the display screen are outside the software and exchange messages with it, so they are actors (Gomaa marks them «input/output device», «output device»).</li>
<li><strong>The coffee machine is a primary actor of "Report Machine Error"</strong> — it is the one that starts that use case by signalling the fault. The same device is a secondary actor of "Brew Standard Drink".</li>
<li><strong>"Brew Standard Drink" extends "Prepare Order"</strong>, because the machine brews only standard drinks — a condition. If every order were brewed by machine, it would be an include.</li>
<li><strong>"Customize Drink" extends "Place Order"</strong> — optional; <strong>"Pay for Order" is included</strong> — every order is paid.</li>
<li>The payment gateway is shown as an external-system actor for card and e-wallet payments; the case mentions receipt printers and speakers too — adding them as output-device actors of "Notify Order Ready" or "Pay for Order" is also correct.</li>
</ul>
</details>
<h3>🧪 Exercise 2 — LabFlow maintenance tickets: class diagram</h3>
<p>"A student can report a broken piece of equipment. Each ticket records a description, the time it was reported and a status (open, in progress, resolved). A lab staff member is assigned to the ticket later. A piece of equipment can have many tickets over its life. A ticket may attach up to three photos, which are deleted together with the ticket." <strong>Task:</strong> draw the entity class diagram with attributes, multiplicities and the correct kind of each relationship.</p>
<details><summary>✅ Model answer and reasoning</summary>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/29870f6c8904841a75e4541aecf8f67d8317eea2.svg" alt="Exercise 2 — LabFlow maintenance tickets (model answer)" loading="lazy" /><p class="chu-thich">🧩 Exercise 2 — LabFlow maintenance tickets (model answer)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Exercise 2 answer: LabFlow maintenance tickets (illustration)
title Exercise 2 — LabFlow maintenance tickets (model answer)
class Student &lt;&lt;entity&gt;&gt; {
  - studentCode : String
}
class LabStaff &lt;&lt;entity&gt;&gt; {
  - staffCode : String
}
class Equipment &lt;&lt;entity&gt;&gt; {
  - code : String
  - name : String
}
class MaintenanceTicket &lt;&lt;entity&gt;&gt; {
  - description : String
  - reportedAt : LocalDateTime
  - status : TicketStatus
  + assign(staff : LabStaff) : void
  + resolve() : void
}
class Photo &lt;&lt;entity&gt;&gt; {
  - url : String
}
enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
}
Student "1" -- "0..*" MaintenanceTicket : reports &gt;
Equipment "1" -- "0..*" MaintenanceTicket : is subject of &gt;
LabStaff "0..1" -- "0..*" MaintenanceTicket : is assigned &gt;
MaintenanceTicket "1" *-- "0..3" Photo : attaches &gt;
MaintenanceTicket ..&gt; TicketStatus
@enduml</code></pre></details>
<ul>
<li><strong>LabStaff <code>0..1</code></strong> — "assigned later": a new ticket has nobody yet.</li>
<li><strong>Photo is composition with <code>0..3</code></strong> — "deleted together with the ticket" is the textbook signal for composition; "up to three" gives the upper bound.</li>
<li><strong>Equipment <code>1</code> – <code>0..*</code> tickets</strong> — "many tickets over its life"; each ticket is about exactly one item.</li>
<li><strong>Status is an enumeration</strong> with the three listed values, not three classes and not a free-text string.</li>
<li>Operations <code>assign()</code> and <code>resolve()</code> are optional at this stage; they show the two events that change the status — a hint that a state machine for <code>MaintenanceTicket</code> would be a good Chapter 10 exercise.</li>
</ul>
</details>
<h3>🧪 Exercise 3 — Quick questions</h3>
<ol>
<li>In LabFlow, is "Send Email" a use case of the Email System?</li>
<li>A lecturer can do everything a student can, plus book a lab for a whole class. How would you show that between actors?</li>
<li>Should <code>Reservation</code> have an attribute <code>labName : String</code>?</li>
</ol>
<details><summary>✅ Answers</summary>
<p class="dap-an">✅ 1. No. The Email System is a secondary actor that takes part in "Approve Reservation"; it never starts a use case of LabFlow, and "Send Email" would describe the e-mail system's own work, not a goal LabFlow offers.</p>
<p class="dap-an">✅ 2. Actor generalization: <code>Lecturer</code> with a hollow-triangle arrow to <code>Student</code> (or both to a general <code>User</code>), then associate <code>Lecturer</code> with the extra use case "Reserve Lab for Class".</p>
<p class="dap-an">✅ 3. No. <code>Reservation</code> is already associated with <code>Lab</code>, and the lab's name lives in <code>Lab</code>. Copying it would store the same fact twice — the class-diagram version of the duplication DBI202 warns about.</p>
</details>`,
    `<h2>🧪 Bài tự làm — tự làm trước khi mở lời giải</h2>
<h3>🧪 Bài 1 — Smart Coffee Shop: tác nhân và use case (case PT1 thử của trường)</h3>
<p>Theo case study "Smart Coffee Shop System" của trường: khách gọi món bằng quét mã QR hoặc qua app điện thoại, chọn đồ uống và tuỳ chỉnh size/đường/sữa, trả bằng tiền mặt, thẻ hoặc ví điện tử. Đơn được gửi tới khu pha chế; <strong>máy pha cà phê IoT tự pha đồ uống tiêu chuẩn</strong>, barista làm các món còn lại. Khi đồ uống xong, hệ thống báo khách qua màn hình, loa hoặc app. Khi máy pha lỗi (hết nước, sai nhiệt độ, kẹt), hệ thống ghi log và báo nhân viên. Quản lý xem số đơn, doanh thu, món bán chạy. <strong>Yêu cầu:</strong> tìm tác nhân (gợi ý của đề: có cả người <em>và</em> thiết bị phần cứng) và vẽ use case diagram cho phần gọi món.</p>
<details><summary>✅ Lời giải mẫu và lập luận</summary>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/6f78c0ad2821455596c9d687c2ec7ebf0a6fac42.svg" alt="Exercise 1 — Smart Coffee Shop: ordering part (model answer)" loading="lazy" /><p class="chu-thich">🧩 Exercise 1 — Smart Coffee Shop: ordering part (model answer)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Lời giải bài 1: Smart Coffee Shop (đề thử PT1) — người VÀ thiết bị đều có thể là tác nhân
title Exercise 1 — Smart Coffee Shop: ordering part (model answer)
left to right direction
actor Customer
actor Barista
actor Manager
actor "Coffee Machine" as CM &lt;&lt;input/output device&gt;&gt;
actor "Display Screen" as DS &lt;&lt;output device&gt;&gt;
actor "Payment Gateway" as PG &lt;&lt;external system&gt;&gt;
rectangle "Smart Coffee Shop System" {
  usecase "Place Order" as U1
  usecase "Customize Drink" as U2
  usecase "Pay for Order" as U3
  usecase "Prepare Order" as U4
  usecase "Brew Standard Drink" as U5
  usecase "Notify Order Ready" as U6
  usecase "Report Machine Error" as U7
  usecase "View Sales Report" as U8
}
Customer -- U1
U2 ..&gt; U1 : &lt;&lt;extend&gt;&gt;
U1 ..&gt; U3 : &lt;&lt;include&gt;&gt;
U3 -- PG
Barista -- U4
U5 ..&gt; U4 : &lt;&lt;extend&gt;&gt;
U5 -- CM
U4 ..&gt; U6 : &lt;&lt;include&gt;&gt;
U6 -- DS
CM -- U7
Manager -- U8
@enduml</code></pre></details>
<ul>
<li><strong>Thiết bị là tác nhân.</strong> Máy pha và màn hình nằm ngoài phần mềm và trao đổi thông điệp với nó, nên là actor (Gomaa đánh dấu «input/output device» — thiết bị vào/ra, «output device» — thiết bị ra).</li>
<li><strong>Máy pha là tác nhân chính của "Report Machine Error"</strong> — chính nó khởi động use case đó bằng tín hiệu báo lỗi. Cùng thiết bị ấy là tác nhân phụ của "Brew Standard Drink".</li>
<li><strong>"Brew Standard Drink" extend "Prepare Order"</strong>, vì máy chỉ pha đồ uống tiêu chuẩn — có điều kiện. Nếu mọi đơn đều do máy pha thì mới là include.</li>
<li><strong>"Customize Drink" extend "Place Order"</strong> — tuỳ chọn; <strong>"Pay for Order" được include</strong> — đơn nào cũng phải trả tiền.</li>
<li>Cổng thanh toán (payment gateway) vẽ thành actor hệ thống bên ngoài cho thanh toán thẻ và ví điện tử; case còn nhắc máy in hoá đơn và loa — thêm chúng làm actor thiết bị ra của "Notify Order Ready" hoặc "Pay for Order" cũng đúng.</li>
</ul>
</details>
<h3>🧪 Bài 2 — Phiếu bảo trì LabFlow: class diagram</h3>
<p>"Sinh viên có thể báo hỏng một thiết bị. Mỗi phiếu (ticket) ghi mô tả, thời điểm báo và trạng thái (mở, đang xử lý, đã xong). Một nhân viên lab được giao phiếu sau đó. Một thiết bị có thể có nhiều phiếu trong suốt vòng đời. Một phiếu có thể đính kèm tối đa ba ảnh, ảnh bị xoá cùng phiếu." <strong>Yêu cầu:</strong> vẽ class diagram thực thể có thuộc tính, bội số và đúng loại của từng quan hệ.</p>
<details><summary>✅ Lời giải mẫu và lập luận</summary>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/SWD392/uml/29870f6c8904841a75e4541aecf8f67d8317eea2.svg" alt="Exercise 2 — LabFlow maintenance tickets (model answer)" loading="lazy" /><p class="chu-thich">🧩 Exercise 2 — LabFlow maintenance tickets (model answer)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Lời giải bài 2: phiếu bảo trì LabFlow (minh hoạ)
title Exercise 2 — LabFlow maintenance tickets (model answer)
class Student &lt;&lt;entity&gt;&gt; {
  - studentCode : String
}
class LabStaff &lt;&lt;entity&gt;&gt; {
  - staffCode : String
}
class Equipment &lt;&lt;entity&gt;&gt; {
  - code : String
  - name : String
}
class MaintenanceTicket &lt;&lt;entity&gt;&gt; {
  - description : String
  - reportedAt : LocalDateTime
  - status : TicketStatus
  + assign(staff : LabStaff) : void
  + resolve() : void
}
class Photo &lt;&lt;entity&gt;&gt; {
  - url : String
}
enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
}
Student "1" -- "0..*" MaintenanceTicket : reports &gt;
Equipment "1" -- "0..*" MaintenanceTicket : is subject of &gt;
LabStaff "0..1" -- "0..*" MaintenanceTicket : is assigned &gt;
MaintenanceTicket "1" *-- "0..3" Photo : attaches &gt;
MaintenanceTicket ..&gt; TicketStatus
@enduml</code></pre></details>
<ul>
<li><strong>LabStaff <code>0..1</code></strong> — "được giao sau đó": phiếu mới chưa có ai.</li>
<li><strong>Photo là composition với <code>0..3</code></strong> — "bị xoá cùng phiếu" là tín hiệu kinh điển của composition; "tối đa ba" cho cận trên.</li>
<li><strong>Equipment <code>1</code> – <code>0..*</code> phiếu</strong> — "nhiều phiếu trong suốt vòng đời"; mỗi phiếu nói về đúng một thiết bị.</li>
<li><strong>Status là kiểu liệt kê (enumeration)</strong> với ba giá trị đề cho, không phải ba lớp và không phải chuỗi tự do.</li>
<li>Thao tác <code>assign()</code> và <code>resolve()</code> là tuỳ chọn ở giai đoạn này; chúng cho thấy hai sự kiện làm đổi trạng thái — gợi ý rằng vẽ máy trạng thái cho <code>MaintenanceTicket</code> sẽ là bài tập hay ở Chapter 10.</li>
</ul>
</details>
<h3>🧪 Bài 3 — Câu hỏi nhanh</h3>
<ol>
<li>Trong LabFlow, "Send Email" có phải use case của Email System không?</li>
<li>Giảng viên làm được mọi việc sinh viên làm, cộng thêm đặt lab cho cả lớp. Thể hiện điều đó giữa các actor thế nào?</li>
<li><code>Reservation</code> có nên có thuộc tính <code>labName : String</code> không?</li>
</ol>
<details><summary>✅ Đáp án</summary>
<p class="dap-an">✅ 1. Không. Email System là tác nhân phụ tham gia "Approve Reservation"; nó không bao giờ khởi động một use case của LabFlow, và "Send Email" là mô tả việc của chính hệ thống email, không phải mục tiêu LabFlow cung cấp.</p>
<p class="dap-an">✅ 2. Tổng quát hoá actor (actor generalization): <code>Lecturer</code> có mũi tên tam giác rỗng tới <code>Student</code> (hoặc cả hai tới một <code>User</code> tổng quát), rồi nối <code>Lecturer</code> với use case thêm "Reserve Lab for Class".</p>
<p class="dap-an">✅ 3. Không. <code>Reservation</code> đã liên kết với <code>Lab</code>, và tên lab nằm trong <code>Lab</code>. Chép lại là lưu cùng một sự kiện hai lần — phiên bản class diagram của sự trùng lặp mà DBI202 cảnh báo.</p>
</details>`),
    bi(`<h2>📌 What you did in this hour</h2>
<ul>
<li>Found actors with one test: outside the system and exchanging messages with it; a role, not a person; devices and external systems count.</li>
<li>Named use cases verb + object; used include for "always", extend for "only if", with arrows in the right direction.</li>
<li>Wrote a use case description with the school template's fields.</li>
<li>Turned nouns into entity classes, attributes or noise — with a reason for each.</li>
<li>Drew a class diagram in two passes: names and lines first, then attributes, multiplicities, composition/aggregation/generalization.</li>
</ul>
<p>Keep your two LabFlow diagrams. When you reach Chapter 6 (use cases) and Chapter 7 (static modeling), redraw them from memory and compare — you will be surprised how much faster the second time is.</p>`,
    `<h2>📌 Bạn đã làm được gì trong giờ này</h2>
<ul>
<li>Tìm actor bằng một phép thử: ở ngoài hệ thống và trao đổi thông điệp với nó; là một vai, không phải một người; thiết bị và hệ thống bên ngoài đều tính.</li>
<li>Đặt tên use case động từ + tân ngữ; dùng include cho "luôn luôn", extend cho "chỉ khi", mũi tên đúng chiều.</li>
<li>Viết đặc tả use case theo các trường của mẫu trường.</li>
<li>Biến danh từ thành lớp thực thể, thuộc tính hoặc nhiễu — cái nào cũng có lý do.</li>
<li>Vẽ class diagram hai lượt: tên và đường nối trước, rồi thuộc tính, bội số, composition/aggregation/generalization.</li>
</ul>
<p>Giữ lại hai sơ đồ LabFlow của bạn. Tới Chapter 6 (use case) và Chapter 7 (mô hình tĩnh), hãy vẽ lại chúng từ trí nhớ rồi so — bạn sẽ ngạc nhiên lần hai nhanh hơn bao nhiêu.</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>actor</strong></td><td>tác nhân</td><td>A role outside the system that interacts with it: a human role, an external system, a device or a timer.</td></tr>
<tr><td><strong>primary actor</strong></td><td>tác nhân chính</td><td>The actor that starts a use case.</td></tr>
<tr><td><strong>secondary actor</strong></td><td>tác nhân phụ</td><td>An actor that takes part in a use case started by someone else.</td></tr>
<tr><td><strong>system boundary</strong></td><td>ranh giới hệ thống</td><td>The rectangle that separates the use cases inside from the actors outside.</td></tr>
<tr><td><strong>include</strong></td><td>bao gồm</td><td>The base use case always performs the included one; arrow from base to included.</td></tr>
<tr><td><strong>extend</strong></td><td>mở rộng</td><td>The extending use case adds behaviour to the base only under a condition; arrow from extension to base.</td></tr>
<tr><td><strong>use case description</strong></td><td>đặc tả use case</td><td>The text specification of a use case: actors, preconditions, main and alternative sequences, postconditions.</td></tr>
<tr><td><strong>precondition</strong></td><td>điều kiện trước</td><td>What must be true before the use case can start.</td></tr>
<tr><td><strong>postcondition</strong></td><td>điều kiện sau</td><td>What is true after the use case ends successfully.</td></tr>
<tr><td><strong>noun extraction</strong></td><td>trích danh từ</td><td>Underlining nouns in the requirement to find candidate classes and attributes.</td></tr>
<tr><td><strong>entity class</strong></td><td>lớp thực thể</td><td>A class for long-lived data the system must remember, marked «entity» in COMET.</td></tr>
<tr><td><strong>attribute</strong></td><td>thuộc tính</td><td>A piece of data held by a class, such as start or status.</td></tr>
<tr><td><strong>association</strong></td><td>liên kết</td><td>A structural link between two classes whose objects know about each other.</td></tr>
<tr><td><strong>enumeration</strong></td><td>kiểu liệt kê</td><td>A type with a fixed list of values, such as PENDING, APPROVED, REJECTED, CANCELLED.</td></tr>
<tr><td><strong>abstract class</strong></td><td>lớp trừu tượng</td><td>A general class that is never instantiated directly, such as User.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>actor</strong></td><td>tác nhân</td><td>Một vai trò ngoài hệ thống tương tác với nó: vai người, hệ thống ngoài, thiết bị hoặc bộ hẹn giờ.</td></tr>
<tr><td><strong>primary actor</strong></td><td>tác nhân chính</td><td>Tác nhân khởi động một use case.</td></tr>
<tr><td><strong>secondary actor</strong></td><td>tác nhân phụ</td><td>Tác nhân tham gia một use case do tác nhân khác khởi động.</td></tr>
<tr><td><strong>system boundary</strong></td><td>ranh giới hệ thống</td><td>Hình chữ nhật tách use case bên trong khỏi actor bên ngoài.</td></tr>
<tr><td><strong>include</strong></td><td>bao gồm</td><td>Use case gốc luôn thực hiện use case được bao gồm; mũi tên từ gốc tới cái được bao gồm.</td></tr>
<tr><td><strong>extend</strong></td><td>mở rộng</td><td>Use case mở rộng thêm hành vi vào use case gốc chỉ khi có điều kiện; mũi tên từ phần mở rộng tới gốc.</td></tr>
<tr><td><strong>use case description</strong></td><td>đặc tả use case</td><td>Bản đặc tả bằng lời: tác nhân, điều kiện trước, luồng chính và thay thế, điều kiện sau.</td></tr>
<tr><td><strong>precondition</strong></td><td>điều kiện trước</td><td>Điều phải đúng trước khi use case bắt đầu.</td></tr>
<tr><td><strong>postcondition</strong></td><td>điều kiện sau</td><td>Điều đúng sau khi use case kết thúc thành công.</td></tr>
<tr><td><strong>noun extraction</strong></td><td>trích danh từ</td><td>Gạch chân danh từ trong yêu cầu để tìm ứng viên lớp và thuộc tính.</td></tr>
<tr><td><strong>entity class</strong></td><td>lớp thực thể</td><td>Lớp cho dữ liệu sống lâu hệ thống phải nhớ, đánh dấu «entity» trong COMET.</td></tr>
<tr><td><strong>attribute</strong></td><td>thuộc tính</td><td>Một mẩu dữ liệu lớp nắm giữ, như start hay status.</td></tr>
<tr><td><strong>association</strong></td><td>liên kết</td><td>Mối nối cấu trúc giữa hai lớp mà các đối tượng biết về nhau.</td></tr>
<tr><td><strong>enumeration</strong></td><td>kiểu liệt kê</td><td>Kiểu có danh sách giá trị cố định, như PENDING, APPROVED, REJECTED, CANCELLED.</td></tr>
<tr><td><strong>abstract class</strong></td><td>lớp trừu tượng</td><td>Lớp tổng quát không bao giờ được tạo đối tượng trực tiếp, như User.</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

export default {
  slides: [L_swd1_1],
  extrasStart: [L_x_bat_dau_tai_day, L_x_hoc_the_nao, L_x_cai_cong_cu_uml, L_x_buoi_dau_tien],
};
