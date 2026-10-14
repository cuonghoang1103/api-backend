/**
 * PRJ301 · Chương 6 — kiến trúc MVC (prj4).
 * Bài 📑 học theo từng slide: prj4 (undefined, slide 1–15).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: prj301-on-ch6.
 * Quiz MỚI (10 câu, slug prj301-quiz-ch6).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRJ301/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRJ301/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 6.A — 📑 Slide by slide · MVC (1/1): Model, View, Controller, MVC2 & a full MVC app (Slot 14–16, slides 1–15) ───────── */
const L_prj4_1 = {
  title: '6.A — 📑 Slide by slide · MVC (1/1): Model, View, Controller, MVC2 & a full MVC app (Slot 14–16, slides 1–15)|||6.A — 📑 Học theo từng slide · MVC (1/1): Model, View, Controller, MVC2 & một app MVC trọn (Slot 14–16, slide 1–15)',
  slug: 'prj301-slide-prj4-1',
  type: 'VIDEO',
  description: 'Giảng đủ 15 slide bộ "MVC Architecture in Javaweb" (Slot 14–16): MVC là gì, Model 1 và Model 2, Model, View, Controller, MVC2 với Controller là Filter/Servlet, lợi ích, luồng điều khiển năm bước, MVC cổ điển (model báo view) khác MVC trên web ra sao, MVC trong Java desktop (Swing chạy thật), các framework Spring/Struts/JSF — và vì slide rất mỏng, bài dựng thêm một ứng dụng web MVC trọn chạy thật trên Tomcat 10.1 + SQL Server: front controller một servlet với bảng định tuyến (404/405), tầng service giữ luật nghiệp vụ, DAO JDBC, JSP + JSTL dưới WEB-INF, Post/Redirect/Get kèm thông báo flash, kiểm tra form hiện lỗi từng ô, phân trang giữ từ khoá tìm kiếm, một view JSON thứ hai cho cùng model; 8 sơ đồ PlantUML.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.A · school deck "MVC Architecture in Javaweb" (Slot 14–16), slides 1–15</span>
<h2>MVC — the shape of every PRJ301 project, built once for real</h2>
<p class="lead">Chapters 2–5 gave you the parts: a servlet reads the request, a JSP draws HTML, a DAO talks to SQL Server. <strong>MVC</strong> (Model–View–Controller) is the rule that says which part does which job, so a project of twenty pages stays readable. The school deck is short — 15 slides, several of them only a title and a picture — so this lesson goes much further than the slides (every addition is marked ➕): one complete MVC web application, run for real, that you can copy as the skeleton of your Assignment and your PE.</p>
<p>Why it matters: Assignment requirement <strong>1.3 "use the MVC model"</strong> is graded on your folder structure and on where your SQL and HTML live; the PE expects Controller → DAO → JSP; the FE asks "which component presents data", "MVC1 vs MVC2", "what happens to request attributes after a redirect". And for LabFlow, Spring MVC is this exact architecture with the boring parts written for you.</p>
<table>
<thead><tr><th>Part of this lesson</th><th>School slides</th><th>What you will be able to do</th></tr></thead>
<tbody>
<tr><td>Theory</td><td>1–3, 5–7, 9, 12</td><td>say what Model, View and Controller each do — and what they must NOT do</td></tr>
<tr><td>Model 1 vs Model 2</td><td>4, 8</td><td>explain why the JSP should not receive the request; recognise MVC2 with a servlet/filter as controller</td></tr>
<tr><td>Control flow</td><td>10–11</td><td>trace one request through C → M → V; explain Post/Redirect/Get; see why the web has no "model alerts view"</td></tr>
<tr><td>Desktop MVC, frameworks</td><td>13–14</td><td>run a Swing MVC; map Spring MVC, Struts and Jakarta Faces onto the pattern</td></tr>
<tr><td>➕ The app <code>mvc-thiet-bi</code></td><td>(beyond the slides)</td><td>front controller with a routing table, service layer, DAO, JSP + JSTL, validation with per-field errors, pagination, PRG + flash message, a JSON view</td></tr>
</tbody>
</table>
<div class="callout"><strong>The app used on every slide.</strong> <code>mvc-thiet-bi</code> manages lab equipment: table <code>Lab</code> (3 labs) and <code>Device</code> (11 devices, 4 per page). It runs on a real <strong>Tomcat 10.1</strong> against a real <strong>SQL Server</strong>; every response below was captured from it, in order, with one cookie jar (like one browser tab). Its DAO and <code>DBContext</code> follow exactly the style of Lesson 5.B (<code>jdbc-human</code>) — JDBC is not re-taught here; read 5.B if a line of JDBC looks new. The older lessons 6.1–6.3 below stay as short summaries.</div>
<table>
<thead><tr><th>Layer</th><th>Package / folder</th><th>Files</th></tr></thead>
<tbody>
<tr><td>Controller</td><td><code>controller</code></td><td><code>DeviceController</code> (one servlet, <code>/devices/*</code>)</td></tr>
<tr><td>Model — rules</td><td><code>service</code></td><td><code>DeviceService</code> (validation, paging)</td></tr>
<tr><td>Model — data access</td><td><code>dal</code></td><td><code>DeviceDAO</code>, <code>LabDAO</code>, <code>DBContext</code></td></tr>
<tr><td>Model — data</td><td><code>model</code></td><td><code>Device</code>, <code>Lab</code>, <code>Page&lt;T&gt;</code>, <code>DeviceForm</code></td></tr>
<tr><td>View</td><td><code>WEB-INF/views/device</code></td><td><code>list.jsp</code>, <code>form.jsp</code>, <code>list-json.jsp</code></td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 6 · Bài 6.A · bộ slide "MVC Architecture in Javaweb" của trường (Slot 14–16), slide 1–15</span>
<h2>MVC — dáng hình của mọi dự án PRJ301, dựng thật một lần cho trọn</h2>
<p class="lead">Chương 2–5 đã cho bạn các mảnh: servlet đọc request, JSP vẽ HTML, DAO nói chuyện với SQL Server. <strong>MVC</strong> (Model–View–Controller — Mô hình–Giao diện–Bộ điều khiển) là luật nói mảnh nào làm việc gì, để một dự án hai mươi trang vẫn đọc được. Bộ slide của trường ngắn — 15 slide, nhiều slide chỉ có tiêu đề và một tấm hình — nên bài này đi xa hơn slide nhiều (mọi phần thêm đều đánh dấu ➕): một ứng dụng web MVC trọn vẹn, chạy thật, mà bạn chép được làm bộ khung cho Assignment và bài PE.</p>
<p>Vì sao quan trọng: yêu cầu <strong>1.3 "Sử dụng mô hình MVC"</strong> của Assignment được chấm qua cấu trúc thư mục và chỗ bạn đặt SQL, HTML; PE mặc định Controller → DAO → JSP; FE hỏi "thành phần nào hiển thị dữ liệu", "MVC1 khác MVC2", "request attribute ra sao sau redirect". Còn với LabFlow, Spring MVC chính là kiến trúc này, chỉ là phần nhàm chán đã có người viết hộ.</p>
<table>
<thead><tr><th>Phần của bài</th><th>Slide trường</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>Lý thuyết</td><td>1–3, 5–7, 9, 12</td><td>nói được Model, View, Controller mỗi cái làm gì — và KHÔNG được làm gì</td></tr>
<tr><td>Model 1 và Model 2</td><td>4, 8</td><td>giải thích vì sao JSP không nên nhận request; nhận ra MVC2 với servlet/filter làm controller</td></tr>
<tr><td>Luồng điều khiển</td><td>10–11</td><td>lần theo một request qua C → M → V; giải thích Post/Redirect/Get; hiểu vì sao web không có bước "model báo view"</td></tr>
<tr><td>MVC desktop, framework</td><td>13–14</td><td>chạy một MVC bằng Swing; đặt Spring MVC, Struts và Jakarta Faces vào khuôn mẫu</td></tr>
<tr><td>➕ App <code>mvc-thiet-bi</code></td><td>(ngoài slide)</td><td>front controller có bảng định tuyến, tầng service, DAO, JSP + JSTL, kiểm tra dữ liệu hiện lỗi từng ô, phân trang, PRG + thông báo flash, một view JSON</td></tr>
</tbody>
</table>
<div class="callout"><strong>App dùng ở mọi slide.</strong> <code>mvc-thiet-bi</code> quản lý thiết bị phòng lab: bảng <code>Lab</code> (3 phòng) và <code>Device</code> (11 thiết bị, 4 cái mỗi trang). Nó chạy trên một <strong>Tomcat 10.1</strong> thật với một <strong>SQL Server</strong> thật; mọi response bên dưới được ghi lại từ nó, theo đúng thứ tự, dùng chung một hũ cookie (như một tab trình duyệt). DAO và <code>DBContext</code> của nó theo đúng phong cách bài 5.B (<code>jdbc-human</code>) — bài này không giảng lại JDBC; dòng JDBC nào thấy lạ thì đọc lại 5.B. Các bài cũ 6.1–6.3 bên dưới vẫn giữ làm bản tóm tắt ngắn.</div>
<table>
<thead><tr><th>Tầng</th><th>Gói / thư mục</th><th>File</th></tr></thead>
<tbody>
<tr><td>Controller</td><td><code>controller</code></td><td><code>DeviceController</code> (một servlet, <code>/devices/*</code>)</td></tr>
<tr><td>Model — luật</td><td><code>service</code></td><td><code>DeviceService</code> (kiểm tra dữ liệu, phân trang)</td></tr>
<tr><td>Model — truy cập dữ liệu</td><td><code>dal</code></td><td><code>DeviceDAO</code>, <code>LabDAO</code>, <code>DBContext</code></td></tr>
<tr><td>Model — dữ liệu</td><td><code>model</code></td><td><code>Device</code>, <code>Lab</code>, <code>Page&lt;T&gt;</code>, <code>DeviceForm</code></td></tr>
<tr><td>View</td><td><code>WEB-INF/views/device</code></td><td><code>list.jsp</code>, <code>form.jsp</code>, <code>list-json.jsp</code></td></tr>
</tbody>
</table>`),
    walkHead('prj4', 1, 15),
    walk('prj4', [
      [1, 'MVC Architecture in Javaweb',
        `<p class="y-chinh">🎯 The deck of Slot 14–16: how to organise a Java web application into Model, View and Controller — the architecture the syllabus calls CLO6, "understand and be able to work with simple MVC Architecture".</p>
<p>The syllabus words it even more concretely: <em>"Basic Web application development applying MVC Design Pattern using <strong>Servlet/Filter as Controller</strong>"</em>. Keep that sentence: it tells you the controller is Java code (a servlet, sometimes a filter), never a JSP. The footer "n/41" is the template's leftover — the deck has 15 slides.</p>
<p>Where it sits in the course: after JDBC (Chapter 5, the Model's data) and JSP/JSTL (Chapter 3, the View). MVC is the glue — it introduces almost no new API; it is a decision about <em>where code goes</em>.</p>
<p class="meo">🧠 One sentence for the whole deck: <em>the controller decides, the model knows, the view shows.</em></p>`,
        `<p class="y-chinh">🎯 Bộ slide của Slot 14–16: tổ chức một ứng dụng Java web thành Model, View và Controller — kiến trúc mà đề cương gọi là CLO6, "hiểu và làm việc được với kiến trúc MVC đơn giản".</p>
<p>Đề cương còn viết cụ thể hơn: <em>"phát triển ứng dụng web cơ bản áp dụng mẫu thiết kế MVC, dùng <strong>Servlet/Filter làm Controller</strong>"</em>. Hãy giữ câu đó: nó nói controller là code Java (một servlet, đôi khi một filter), không bao giờ là một JSP. Chân slide ghi "n/41" là đồ thừa của mẫu slide — deck chỉ có 15 slide.</p>
<p>Nó nằm ở đâu trong môn: sau JDBC (Chương 5, dữ liệu của Model) và JSP/JSTL (Chương 3, phần View). MVC là chất keo — nó gần như không đem tới API mới nào; nó là một quyết định về <em>code đặt ở đâu</em>.</p>
<p class="meo">🧠 Một câu cho cả deck: <em>controller quyết định, model hiểu biết, view trình bày.</em></p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Two goals: <strong>understand</strong> the MVC architecture pattern, and <strong>apply</strong> it in a Java web application.</p>
<p>The deck covers the first goal in 13 slides of text and pictures. It never shows a line of code, so the second goal — the one the Assignment and the PE grade — is what the ➕ parts of this lesson add:</p>
<table>
<thead><tr><th>Objective</th><th>Covered by</th><th>In this lesson</th></tr></thead>
<tbody>
<tr><td>Understand MVC</td><td>slides 3–13</td><td>definitions, Model 1 vs Model 2, control flow, desktop vs web MVC</td></tr>
<tr><td>Apply MVC in a Java web app</td><td>(not in the slides)</td><td>➕ <code>mvc-thiet-bi</code>: controller, service, DAO, JSP views, PRG, validation, pagination</td></tr>
<tr><td>Know the frameworks</td><td>slide 14</td><td>➕ the same app as Spring MVC (illustration), for LabFlow</td></tr>
</tbody>
</table>
<div class="pitfall">Exam trap: "MVC" is not a library you add to the project. Nothing in Tomcat checks it. A project "uses MVC" only if you can point to a controller with no HTML, a JSP with no SQL, and a model with no <code>HttpServletRequest</code> — that is exactly what a teacher looks for when grading 1.3.</div>`,
        `<p class="y-chinh">🎯 Hai mục tiêu: <strong>hiểu</strong> mẫu kiến trúc MVC, và <strong>áp dụng</strong> nó vào một ứng dụng Java web.</p>
<p>Deck lo mục tiêu thứ nhất bằng 13 slide chữ và hình. Nó không hề cho xem một dòng code nào, nên mục tiêu thứ hai — đúng thứ Assignment và PE chấm — là phần các mục ➕ của bài này bổ sung:</p>
<table>
<thead><tr><th>Mục tiêu</th><th>Học ở</th><th>Trong bài này</th></tr></thead>
<tbody>
<tr><td>Hiểu MVC</td><td>slide 3–13</td><td>định nghĩa, Model 1 và Model 2, luồng điều khiển, MVC desktop và MVC web</td></tr>
<tr><td>Áp dụng MVC vào app Java web</td><td>(không có trong slide)</td><td>➕ <code>mvc-thiet-bi</code>: controller, service, DAO, view JSP, PRG, kiểm tra dữ liệu, phân trang</td></tr>
<tr><td>Biết các framework</td><td>slide 14</td><td>➕ cùng app đó viết bằng Spring MVC (minh hoạ), cho LabFlow</td></tr>
</tbody>
</table>
<div class="pitfall">Bẫy thi: "MVC" không phải một thư viện bạn thêm vào dự án. Tomcat không kiểm gì cả. Một dự án "dùng MVC" chỉ khi bạn chỉ ra được một controller không có HTML, một JSP không có SQL, và một model không có <code>HttpServletRequest</code> — đúng thứ thầy cô nhìn vào khi chấm mục 1.3.</div>`],
      [3, 'What is MVC',
        `<p class="y-chinh">🎯 MVC is a <strong>design pattern</strong> that splits the program logic of a user interface into three interconnected elements: the <strong>Model</strong> (data, logic and rules, independent of the UI), the <strong>View</strong> (any representation of the information) and the <strong>Controller</strong> (accepts input and turns it into commands for the model or view).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/bd484c24bfb8ae1d59328bfcb38809ede4004746.svg" alt="The three roles on the web: the controller receives, the model knows, the view shows" loading="lazy" /><p class="chu-thich">🧩 The three roles on the web: the controller receives, the model knows, the view shows</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 3: three components, each with ONE job (web version)
left to right direction
actor "User\\n(browser)" as U
rectangle "Controller\\n(servlet)\\n\\nreads the request\\ncalls the Model\\nchooses the View" as C
rectangle "Model\\n(JavaBeans + service + DAO)\\n\\ndata, rules, database\\nknows nothing about HTTP" as M
rectangle "View\\n(JSP + JSTL)\\n\\nshows the data it is given\\nno SQL, no decisions" as V
database "SQL Server" as DB
U --&gt; C : 1. HTTP request
C --&gt; M : 2. command / query
M --&gt; DB : SQL
C --&gt; V : 3. forward + attributes
V ..&gt; M : 4. reads beans (EL)
V --&gt; U : 5. HTML response
@enduml</code></pre></details>
<p>Read the three definitions as three <em>prohibitions</em> — that is how you use them when writing code:</p>
<table>
<thead><tr><th>Component</th><th>Its one job</th><th>It must NOT…</th></tr></thead>
<tbody>
<tr><td>Model</td><td>hold data and enforce rules ("quantity is 0–999", "a code is unique")</td><td>import anything from <code>jakarta.servlet</code>; know which page will show it</td></tr>
<tr><td>View</td><td>turn the data it is given into HTML (or JSON…)</td><td>open a connection, run SQL, decide where the user goes next</td></tr>
<tr><td>Controller</td><td>read the request, call the model, choose the view</td><td>contain SQL or build HTML strings</td></tr>
</tbody>
</table>
<p>➕ History: Trygve Reenskaug wrote the first notes on MVC in 1979 at Xerox PARC, for the Smalltalk-79 system; his first names were Model–View–<em>Editor</em>. It was born for desktop GUIs, decades before servlets — slide 11 shows the trace of that origin. The slide's sentence about "a bar chart for management and a tabular view for accountants" is the classic illustration: one model, many views.</p>
<div class="pitfall">FE trap (FE question type): "Which is NOT a component of MVC? Database / Model / View / Controller" — the answer is <strong>Database</strong>. The database is where the model's data is <em>stored</em>; it is not one of the three roles. The same trick appears with "Service layer": a service is part of the Model in our app, but it is not a fourth MVC component.</div>`,
        `<p class="y-chinh">🎯 MVC là một <strong>mẫu thiết kế (design pattern)</strong> chia logic chương trình của một giao diện người dùng thành ba phần liên kết với nhau: <strong>Model</strong> (dữ liệu, logic và luật, độc lập với giao diện), <strong>View</strong> (bất kỳ cách trình bày thông tin nào) và <strong>Controller</strong> (nhận dữ liệu vào và biến nó thành lệnh cho model hoặc view).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/bd484c24bfb8ae1d59328bfcb38809ede4004746.svg" alt="Ba vai trò trên web: controller tiếp nhận, model hiểu biết, view trình bày" loading="lazy" /><p class="chu-thich">🧩 Ba vai trò trên web: controller tiếp nhận, model hiểu biết, view trình bày</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 3: three components, each with ONE job (web version)
left to right direction
actor "User\\n(browser)" as U
rectangle "Controller\\n(servlet)\\n\\nreads the request\\ncalls the Model\\nchooses the View" as C
rectangle "Model\\n(JavaBeans + service + DAO)\\n\\ndata, rules, database\\nknows nothing about HTTP" as M
rectangle "View\\n(JSP + JSTL)\\n\\nshows the data it is given\\nno SQL, no decisions" as V
database "SQL Server" as DB
U --&gt; C : 1. HTTP request
C --&gt; M : 2. command / query
M --&gt; DB : SQL
C --&gt; V : 3. forward + attributes
V ..&gt; M : 4. reads beans (EL)
V --&gt; U : 5. HTML response
@enduml</code></pre></details>
<p>Hãy đọc ba định nghĩa như ba <em>điều cấm</em> — đó là cách dùng chúng lúc viết code:</p>
<table>
<thead><tr><th>Thành phần</th><th>Việc duy nhất của nó</th><th>Nó KHÔNG được…</th></tr></thead>
<tbody>
<tr><td>Model</td><td>giữ dữ liệu và bắt tuân theo luật ("số lượng 0–999", "mã là duy nhất")</td><td>import thứ gì từ <code>jakarta.servlet</code>; biết trang nào sẽ hiển thị nó</td></tr>
<tr><td>View</td><td>biến dữ liệu được đưa thành HTML (hoặc JSON…)</td><td>mở kết nối, chạy SQL, quyết định người dùng đi đâu tiếp</td></tr>
<tr><td>Controller</td><td>đọc request, gọi model, chọn view</td><td>chứa SQL hay tự dựng chuỗi HTML</td></tr>
</tbody>
</table>
<p>➕ Lịch sử: Trygve Reenskaug viết những ghi chú đầu tiên về MVC năm 1979 ở Xerox PARC, cho hệ Smalltalk-79; tên đầu tiên ông đặt là Model–View–<em>Editor</em>. Nó sinh ra cho giao diện desktop, trước servlet cả mấy chục năm — slide 11 còn giữ dấu vết của gốc gác đó. Câu trên slide về "biểu đồ cột cho ban quản lý và bảng số cho kế toán" là ví dụ kinh điển: một model, nhiều view.</p>
<div class="pitfall">Bẫy FE (dạng câu FE): "Cái nào KHÔNG phải thành phần của MVC? Database / Model / View / Controller" — đáp án là <strong>Database</strong>. CSDL là nơi <em>lưu</em> dữ liệu của model; nó không phải một trong ba vai trò. Mẹo tương tự xuất hiện với "Service layer": service là một phần của Model trong app của ta, nhưng không phải thành phần MVC thứ tư.</div>`],
      [4, 'MVC Architecture',
        `<p class="y-chinh">🎯 The JSP specification described two ways to build web apps with JSP: <strong>Model 1</strong> (top picture) — the JSP itself receives the request and sends the reply, helped by a JavaBean; and <strong>Model 2</strong> (bottom picture) — a servlet receives the request, JSPs only present, which is the MVC style.</p>
<p>⚠️ The slide mixes the bullets of both pictures: "the JSP page is responsible for processing requests and sending back replies" describes <em>Model 1</em>; "integrates servlets and JSP pages… JSP for presentation, servlets for processing… promotes MVC" describes <em>Model 2</em>. Redrawn with the two cleanly separated:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/13bfdfe467212c7bfd78bf8919e49b9bbd85ea15.svg" alt="Slide 4 redrawn: in Model 1 the JSP is the entry point; in Model 2 the servlet is" loading="lazy" /><p class="chu-thich">🧩 Slide 4 redrawn: in Model 1 the JSP is the entry point; in Model 2 the servlet is</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 4: Model 1 (the JSP does everything) and Model 2 (= MVC)
left to right direction
rectangle "Model 1" {
  actor "Browser" as B1
  rectangle "JSP\\n(receives the request\\nAND draws the page)" as J1
  rectangle "JavaBean" as JB1
  database "DB" as D1
  B1 --&gt; J1 : request
  J1 --&gt; B1 : response
  J1 --&gt; JB1
  JB1 --&gt; D1
}
rectangle "Model 2 (MVC)" {
  actor "Browser" as B2
  rectangle "Controller\\nServlet" as S2
  rectangle "Model\\nJavaBean" as JB2
  rectangle "View\\nJSP" as J2
  database "DB" as D2
  B2 --&gt; S2 : request
  S2 --&gt; JB2 : instantiate / call
  JB2 --&gt; D2
  S2 --&gt; J2 : select view (forward)
  J2 ..&gt; JB2 : read
  J2 --&gt; B2 : response
}
@enduml</code></pre></details>
<p>Model 1 for real — the browser calls the JSP, the JSP reads the parameter and calls the DAO bean itself:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/webapp/model1/devices.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@ page contentType="text/html;charset=UTF-8" session="false" trimDirectiveWhitespaces="true" %&gt;
&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;
&lt;%-- Model 1 (slide 4, top picture): the browser calls THIS JSP directly; it reads the request, calls the bean and draws the page — controller and view in one file --%&gt;
&lt;jsp:useBean id="dao" class="dal.DeviceDAO" scope="page"/&gt;
&lt;%-- Controller work, but inside the view --%&gt;
&lt;%
    String q = request.getParameter("q");
    if (q == null) q = "";
    request.setAttribute("rows", dao.findPage(q, 0, 100));
%&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices (Model 1)&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;/tr&gt;
  &lt;c:forEach items="&#36;{rows}" var="d"&gt;
  &lt;tr&gt;&lt;td&gt;&#36;{d.code}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{d.name}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{d.quantity}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{d.lab.name}"/&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/c:forEach&gt;
&lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/model1/devices.jsp?q=Kit HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices (Model 1)&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;ESP-01&lt;/td&gt;&lt;td&gt;Kit ESP32&lt;/td&gt;&lt;td&gt;20&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>It works — the same table as the MVC version. The problem shows up as the app grows: every page re-implements "read parameters, check login, call the database, handle errors", the URL is a file name (<code>devices.jsp</code>), and Java hides inside HTML where no one tests it. Model 2 moves all of that into one servlet; the JSPs move under <code>WEB-INF</code>, where the browser cannot reach them directly:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/WEB-INF/views/device/list.jsp HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 683

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<div class="pitfall">FE trap (FE question type): "In which architecture does the JSP act as both the view and the model/controller?" — <strong>MVC1 (Model 1)</strong>. "MVC2" means the servlet is the controller. And the FE statement "a client may directly access resources in WEB-INF" is <strong>false</strong> — the 404 above is the proof.</div>`,
        `<p class="y-chinh">🎯 Đặc tả JSP mô tả hai cách xây app web với JSP: <strong>Model 1</strong> (hình trên) — chính JSP nhận request và gửi trả lời, có JavaBean phụ giúp; và <strong>Model 2</strong> (hình dưới) — một servlet nhận request, JSP chỉ trình bày, đó là kiểu MVC.</p>
<p>⚠️ Slide trộn gạch đầu dòng của hai hình: "trang JSP chịu trách nhiệm xử lý request và gửi trả lời" là mô tả <em>Model 1</em>; "kết hợp servlet và JSP… JSP cho tầng trình bày, servlet cho xử lý… thúc đẩy MVC" là mô tả <em>Model 2</em>. Vẽ lại, tách bạch hai cách:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/13bfdfe467212c7bfd78bf8919e49b9bbd85ea15.svg" alt="Slide 4 vẽ lại: ở Model 1 JSP là cửa vào; ở Model 2 servlet là cửa vào" loading="lazy" /><p class="chu-thich">🧩 Slide 4 vẽ lại: ở Model 1 JSP là cửa vào; ở Model 2 servlet là cửa vào</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 4: Model 1 (the JSP does everything) and Model 2 (= MVC)
left to right direction
rectangle "Model 1" {
  actor "Browser" as B1
  rectangle "JSP\\n(receives the request\\nAND draws the page)" as J1
  rectangle "JavaBean" as JB1
  database "DB" as D1
  B1 --&gt; J1 : request
  J1 --&gt; B1 : response
  J1 --&gt; JB1
  JB1 --&gt; D1
}
rectangle "Model 2 (MVC)" {
  actor "Browser" as B2
  rectangle "Controller\\nServlet" as S2
  rectangle "Model\\nJavaBean" as JB2
  rectangle "View\\nJSP" as J2
  database "DB" as D2
  B2 --&gt; S2 : request
  S2 --&gt; JB2 : instantiate / call
  JB2 --&gt; D2
  S2 --&gt; J2 : select view (forward)
  J2 ..&gt; JB2 : read
  J2 --&gt; B2 : response
}
@enduml</code></pre></details>
<p>Model 1 chạy thật — trình duyệt gọi JSP, JSP tự đọc tham số và tự gọi bean DAO:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/webapp/model1/devices.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@ page contentType="text/html;charset=UTF-8" session="false" trimDirectiveWhitespaces="true" %&gt;
&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;
&lt;%-- Model 1 (slide 4, hình trên): trình duyệt gọi THẲNG JSP này; nó đọc request, gọi bean rồi vẽ trang — controller và view chung một file --%&gt;
&lt;jsp:useBean id="dao" class="dal.DeviceDAO" scope="page"/&gt;
&lt;%-- Việc của controller, nhưng nằm trong view --%&gt;
&lt;%
    String q = request.getParameter("q");
    if (q == null) q = "";
    request.setAttribute("rows", dao.findPage(q, 0, 100));
%&gt;
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices (Model 1)&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;/tr&gt;
  &lt;c:forEach items="&#36;{rows}" var="d"&gt;
  &lt;tr&gt;&lt;td&gt;&#36;{d.code}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{d.name}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{d.quantity}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{d.lab.name}"/&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/c:forEach&gt;
&lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/model1/devices.jsp?q=Kit HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices (Model 1)&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;ESP-01&lt;/td&gt;&lt;td&gt;Kit ESP32&lt;/td&gt;&lt;td&gt;20&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Nó chạy được — ra đúng cái bảng như bản MVC. Vấn đề lộ ra khi app lớn lên: trang nào cũng tự làm lại "đọc tham số, kiểm đăng nhập, gọi CSDL, xử lý lỗi", URL là tên file (<code>devices.jsp</code>), và code Java trốn trong HTML, chỗ không ai kiểm thử. Model 2 dồn tất cả vào một servlet; JSP chuyển vào dưới <code>WEB-INF</code>, chỗ trình duyệt không gọi thẳng được:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/WEB-INF/views/device/list.jsp HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 683

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<div class="pitfall">Bẫy FE (dạng câu FE): "Trong kiến trúc nào JSP vừa là view vừa là model/controller?" — <strong>MVC1 (Model 1)</strong>. "MVC2" nghĩa là servlet làm controller. Còn phát biểu FE "client có thể truy cập trực tiếp tài nguyên trong WEB-INF" là <strong>sai</strong> — cái 404 ở trên là bằng chứng.</div>`],
      [5, 'The Model',
        `<p class="y-chinh">🎯 The Model is the specific representation of the information the system works with; its <strong>logic ensures the integrity of the data</strong> and lets you <strong>derive</strong> new information from it.</p>
<p>⚠️ The slide's picture is a database cylinder, which makes many students think "Model = database". It is not: the model is <strong>Java code</strong> — the data classes (JavaBeans), the rules, and the DAO that loads and saves them. The database only stores the result. In our app the model is three packages:</p>
<table>
<thead><tr><th>Package</th><th>Class</th><th>What the slide's words mean here</th></tr></thead>
<tbody>
<tr><td><code>model</code></td><td><code>Device</code>, <code>Lab</code></td><td>"representation of the information": one object per row, the foreign key becomes a <code>Lab</code> object</td></tr>
<tr><td><code>service</code></td><td><code>DeviceService</code></td><td>"logic ensures integrity": code format, uniqueness, quantity 0–999, the lab exists</td></tr>
<tr><td><code>dal</code></td><td><code>DeviceDAO</code>, <code>LabDAO</code></td><td>loads and saves the objects with JDBC (5.B style)</td></tr>
<tr><td><code>model</code></td><td><code>Page&lt;T&gt;</code></td><td>"allows to derive it": the number of pages is computed from the total, never stored</td></tr>
</tbody>
</table>
<p>The integrity rules, all in one method of the service — no <code>HttpServletRequest</code> in sight, so it can be unit-tested without Tomcat:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/service/DeviceService.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Checks every rule; saves only when there is no error. Returns field → message (empty = saved)
public Map&lt;String, String&gt; save(DeviceForm f) throws SQLException {
    Map&lt;String, String&gt; errors = new LinkedHashMap&lt;&gt;();
    int id = f.getId().isEmpty() ? 0 : Integer.parseInt(f.getId());
    String code = f.getCode().toUpperCase();
    if (code.isEmpty()) errors.put("code", "Code is required");
    else if (!code.matches("[A-Z]{3}-\\\\d{2}")) errors.put("code", "Code must look like OSC-01");
    else if (devices.existsCode(code, id)) errors.put("code", "Code " + code + " already exists");
    if (f.getName().isEmpty()) errors.put("name", "Name is required");
    else if (f.getName().length() &gt; 100) errors.put("name", "Name is at most 100 characters");
    int quantity = -1;
    try { quantity = Integer.parseInt(f.getQuantity()); } catch (NumberFormatException e) { }   // checked below
    if (quantity &lt; 0 || quantity &gt; 999) errors.put("quantity", "Quantity must be a whole number 0–999");
    int labId = -1;
    try { labId = Integer.parseInt(f.getLabId()); } catch (NumberFormatException e) { }   // checked below
    if (labId &lt; 0 || !labs.exists(labId)) errors.put("labId", "Choose a lab");
    if (!errors.isEmpty()) return errors;                            // nothing is written

    Device d = new Device();
    d.setId(id);
    d.setCode(code);
    d.setName(f.getName());
    d.setQuantity(quantity);
    d.setLab(new Lab(labId, null));
    if (id == 0) devices.insert(d); else devices.update(d);
    f.setCode(code);                                                 // the controller reports the normalised code
    return errors;
}</code></pre>
<p>And a derived value — 11 devices, 4 per page, 3 pages, computed with integers only:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/model/Page.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public int getTotalPages() {
    return Math.max(1, (total + size - 1) / size);   // ceiling without double: 11 rows / 4 ⇒ 3 pages
}</code></pre>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): the same split becomes <code>@Entity</code> classes (data), <code>@Service</code> classes (rules, often <code>@Transactional</code>) and Spring Data <code>JpaRepository</code> interfaces (the DAO, written for you). Validation rules move to annotations such as <code>@NotBlank</code>, <code>@Pattern</code>, <code>@Min</code> — but they stay in the model, never in the controller.</div>`,
        `<p class="y-chinh">🎯 Model là cách biểu diễn cụ thể thông tin mà hệ thống làm việc cùng; <strong>logic của nó giữ cho dữ liệu toàn vẹn (đúng luật)</strong> và cho phép <strong>suy ra</strong> thông tin mới từ đó.</p>
<p>⚠️ Hình trên slide là một hình trụ CSDL, khiến nhiều bạn nghĩ "Model = cơ sở dữ liệu". Không phải: model là <strong>code Java</strong> — các lớp dữ liệu (JavaBean), các luật, và DAO nạp/lưu chúng. CSDL chỉ cất kết quả. Trong app của ta model gồm ba gói:</p>
<table>
<thead><tr><th>Gói</th><th>Lớp</th><th>Chữ trên slide nghĩa là gì ở đây</th></tr></thead>
<tbody>
<tr><td><code>model</code></td><td><code>Device</code>, <code>Lab</code></td><td>"cách biểu diễn thông tin": mỗi dòng một đối tượng, khoá ngoại thành một đối tượng <code>Lab</code></td></tr>
<tr><td><code>service</code></td><td><code>DeviceService</code></td><td>"logic giữ toàn vẹn": định dạng mã, không trùng mã, số lượng 0–999, phòng lab có thật</td></tr>
<tr><td><code>dal</code></td><td><code>DeviceDAO</code>, <code>LabDAO</code></td><td>nạp và lưu đối tượng bằng JDBC (kiểu 5.B)</td></tr>
<tr><td><code>model</code></td><td><code>Page&lt;T&gt;</code></td><td>"cho phép suy ra": số trang được tính từ tổng, không bao giờ lưu</td></tr>
</tbody>
</table>
<p>Các luật toàn vẹn, gom trong một phương thức của service — không thấy <code>HttpServletRequest</code> nào, nên kiểm thử đơn vị (unit test) được mà không cần Tomcat:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/service/DeviceService.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Kiểm mọi luật; chỉ lưu khi không có lỗi. Trả về ô → thông báo (rỗng = đã lưu)
public Map&lt;String, String&gt; save(DeviceForm f) throws SQLException {
    Map&lt;String, String&gt; errors = new LinkedHashMap&lt;&gt;();
    int id = f.getId().isEmpty() ? 0 : Integer.parseInt(f.getId());
    String code = f.getCode().toUpperCase();
    if (code.isEmpty()) errors.put("code", "Code is required");
    else if (!code.matches("[A-Z]{3}-\\\\d{2}")) errors.put("code", "Code must look like OSC-01");
    else if (devices.existsCode(code, id)) errors.put("code", "Code " + code + " already exists");
    if (f.getName().isEmpty()) errors.put("name", "Name is required");
    else if (f.getName().length() &gt; 100) errors.put("name", "Name is at most 100 characters");
    int quantity = -1;
    try { quantity = Integer.parseInt(f.getQuantity()); } catch (NumberFormatException e) { }   // kiểm ở dưới
    if (quantity &lt; 0 || quantity &gt; 999) errors.put("quantity", "Quantity must be a whole number 0–999");
    int labId = -1;
    try { labId = Integer.parseInt(f.getLabId()); } catch (NumberFormatException e) { }   // kiểm ở dưới
    if (labId &lt; 0 || !labs.exists(labId)) errors.put("labId", "Choose a lab");
    if (!errors.isEmpty()) return errors;                            // không ghi gì cả

    Device d = new Device();
    d.setId(id);
    d.setCode(code);
    d.setName(f.getName());
    d.setQuantity(quantity);
    d.setLab(new Lab(labId, null));
    if (id == 0) devices.insert(d); else devices.update(d);
    f.setCode(code);                                                 // controller báo lại mã đã chuẩn hoá
    return errors;
}</code></pre>
<p>Và một giá trị suy ra — 11 thiết bị, 4 cái mỗi trang, 3 trang, tính chỉ bằng số nguyên:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/model/Page.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public int getTotalPages() {
    return Math.max(1, (total + size - 1) / size);   // làm tròn lên không cần double: 11 dòng / 4 ⇒ 3 trang
}</code></pre>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): cách chia này thành các lớp <code>@Entity</code> (dữ liệu), lớp <code>@Service</code> (luật, thường kèm <code>@Transactional</code>) và interface <code>JpaRepository</code> của Spring Data (chính là DAO, viết sẵn cho bạn). Luật kiểm tra chuyển thành annotation như <code>@NotBlank</code>, <code>@Pattern</code>, <code>@Min</code> — nhưng vẫn nằm ở model, không bao giờ ở controller.</div>`],
      [6, 'The View',
        `<p class="y-chinh">🎯 The View represents the model in a format suitable for interacting with it — what people usually call the "user interface" (a Java GUI, HTML, XML).</p>
<p>The slide shows three website templates: the point is that the same data can be dressed in completely different pages without touching the model. In a Java web app the view is a <strong>JSP using EL and JSTL</strong> (Chapter 3). Our list view only reads the request attributes the controller prepared — <code>page</code>, <code>q</code>, <code>flash</code>:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/webapp/WEB-INF/views/device/list.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;c:forEach items="&#36;{page.items}" var="d"&gt;
  &lt;tr&gt;&lt;td&gt;&#36;{d.code}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{d.name}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{d.quantity}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{d.lab.name}"/&gt;&lt;/td&gt;
      &lt;td&gt;&lt;a href="&#36;{pageContext.request.contextPath}/devices/edit?id=&#36;{d.id}"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/c:forEach&gt;
  &lt;c:if test="&#36;{empty page.items}"&gt;&lt;tr&gt;&lt;td colspan="5"&gt;No device matches.&lt;/td&gt;&lt;/tr&gt;&lt;/c:if&gt;
&lt;/table&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Lab devices&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices" method="get"&gt;
  &lt;input name="q" value="" placeholder="name contains…"&gt; &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;OSC-01&lt;/td&gt;&lt;td&gt;Máy hiện sóng Rigol&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Lab Điện tử&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=1"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;MUL-01&lt;/td&gt;&lt;td&gt;Đồng hồ vạn năng&lt;/td&gt;&lt;td&gt;10&lt;/td&gt;&lt;td&gt;Lab Điện tử&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=2"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;PSU-01&lt;/td&gt;&lt;td&gt;Nguồn DC 0–30V&lt;/td&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;Lab Điện tử&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=3"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SOL-01&lt;/td&gt;&lt;td&gt;Máy hàn thiếc&lt;/td&gt;&lt;td&gt;8&lt;/td&gt;&lt;td&gt;Lab Điện tử&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=4"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 1/3 · 11 device(s)
  &lt;strong&gt;[1]&lt;/strong&gt; &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=2"&gt;2&lt;/a&gt; &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=3"&gt;3&lt;/a&gt; &lt;/p&gt;
&lt;a href="/mvc-thiet-bi/devices/new"&gt;Add a device&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Three habits of a good view, all visible above: no <code>&lt;% %&gt;</code> scriptlet; user-typed text goes through <code>&lt;c:out&gt;</code> (it escapes <code>&lt; &gt; &amp;</code>, so a device name can never inject HTML — practice 6.4 shows the attack); and links are built from <code>pageContext.request.contextPath</code>, not hard-coded.</p>
<div class="pitfall">A view that does <code>if (user.role == 'ADMIN')</code> to hide a button is fine (that is presentation). A view that <em>decides</em> to load other data, or redirects, is doing the controller's job. Rule of thumb: if you could replace the JSP by a JSON view without losing behaviour, it is a real view.</div>`,
        `<p class="y-chinh">🎯 View trình bày model theo một dạng phù hợp để tương tác và truy cập dữ liệu — thứ người ta hay gọi là "giao diện người dùng" (GUI Java, HTML, XML).</p>
<p>Slide cho xem ba mẫu website: ý là cùng một dữ liệu có thể khoác những trang hoàn toàn khác nhau mà không đụng tới model. Trong app Java web, view là một <strong>JSP dùng EL và JSTL</strong> (Chương 3). View danh sách của ta chỉ đọc các request attribute mà controller đã chuẩn bị — <code>page</code>, <code>q</code>, <code>flash</code>:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/webapp/WEB-INF/views/device/list.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;c:forEach items="&#36;{page.items}" var="d"&gt;
  &lt;tr&gt;&lt;td&gt;&#36;{d.code}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{d.name}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{d.quantity}&lt;/td&gt;&lt;td&gt;&lt;c:out value="&#36;{d.lab.name}"/&gt;&lt;/td&gt;
      &lt;td&gt;&lt;a href="&#36;{pageContext.request.contextPath}/devices/edit?id=&#36;{d.id}"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/c:forEach&gt;
  &lt;c:if test="&#36;{empty page.items}"&gt;&lt;tr&gt;&lt;td colspan="5"&gt;No device matches.&lt;/td&gt;&lt;/tr&gt;&lt;/c:if&gt;
&lt;/table&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Lab devices&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices" method="get"&gt;
  &lt;input name="q" value="" placeholder="name contains…"&gt; &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;OSC-01&lt;/td&gt;&lt;td&gt;Máy hiện sóng Rigol&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;td&gt;Lab Điện tử&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=1"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;MUL-01&lt;/td&gt;&lt;td&gt;Đồng hồ vạn năng&lt;/td&gt;&lt;td&gt;10&lt;/td&gt;&lt;td&gt;Lab Điện tử&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=2"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;PSU-01&lt;/td&gt;&lt;td&gt;Nguồn DC 0–30V&lt;/td&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;Lab Điện tử&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=3"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SOL-01&lt;/td&gt;&lt;td&gt;Máy hàn thiếc&lt;/td&gt;&lt;td&gt;8&lt;/td&gt;&lt;td&gt;Lab Điện tử&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=4"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 1/3 · 11 device(s)
  &lt;strong&gt;[1]&lt;/strong&gt; &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=2"&gt;2&lt;/a&gt; &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=3"&gt;3&lt;/a&gt; &lt;/p&gt;
&lt;a href="/mvc-thiet-bi/devices/new"&gt;Add a device&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Ba thói quen của một view tốt, đều thấy ở trên: không có scriptlet <code>&lt;% %&gt;</code>; chữ người dùng gõ đi qua <code>&lt;c:out&gt;</code> (nó thoát <code>&lt; &gt; &amp;</code>, nên tên thiết bị không bao giờ chèn được HTML — bài thực hành 6.4 cho xem đòn tấn công); và liên kết dựng từ <code>pageContext.request.contextPath</code>, không gõ cứng.</p>
<div class="pitfall">Một view viết <code>if (user.role == 'ADMIN')</code> để ẩn một nút thì ổn (đó là trình bày). Một view <em>tự quyết</em> nạp thêm dữ liệu khác, hay tự chuyển hướng, là đang làm việc của controller. Mẹo nhớ: nếu thay JSP bằng một view JSON mà không mất hành vi nào, thì đó là một view đúng nghĩa.</div>`],
      [7, 'The Controller',
        `<p class="y-chinh">🎯 The Controller is the link between view and model: it receives and responds to events — typically user actions — and invokes changes on the model and, probably, on the view.</p>
<p>The slide's pictures are Facebook buttons: <em>Đăng nhập</em> (log in), <em>Thích</em> (like), <em>Bình luận</em> (comment), <em>Tìm kiếm</em> (search), <em>Tạo tài khoản mới</em> (create account). On the web every such click becomes one <strong>HTTP request</strong>, and each request needs exactly one piece of controller code. In our app that list of "events" is written down as a routing table:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/controller/DeviceController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// The routing table: "METHOD /path" → handler. Adding a feature = one line here + one method
private final Map&lt;String, Action&gt; routes = Map.of(
        "GET /",        this::list,
        "GET /new",     this::showCreate,
        "POST /create", this::create,
        "GET /edit",    this::showEdit,
        "POST /update", this::update,
        "POST /delete", this::delete);</code></pre>
<p>One handler, complete — read the request, ask the model, pick the view, nothing else:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/controller/DeviceController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private void list(HttpServletRequest req, HttpServletResponse resp) throws Exception {
    String q = req.getParameter("q");
    req.setAttribute("q", q == null ? "" : q.trim());
    req.setAttribute("page", service.list(q, parseInt(req.getParameter("page"), 1)));   // ask the Model
    moveFlash(req);
    String view = "json".equals(req.getParameter("format")) ? "list-json.jsp" : "list.jsp";   // same Model, two Views
    req.getRequestDispatcher(VIEWS + view).forward(req, resp);                              // pick the View
}</code></pre>
<p>Notice what is <em>not</em> there: no SQL, no HTML, no rule like "quantity ≤ 999". The controller is the only class that knows about <code>HttpServletRequest</code>, parameters, status codes, forward and redirect — the HTTP side of the app.</p>
<p class="meo">🧠 Map the slide's buttons: Tìm kiếm → <code>GET /devices?q=…</code>; Đăng nhập / Tạo tài khoản → a <code>POST</code> that changes state, then a redirect. A "read" is a GET, a "change" is a POST — the controller enforces that.</p>`,
        `<p class="y-chinh">🎯 Controller là mối nối giữa view và model: nó nhận và phản hồi các sự kiện — thường là thao tác của người dùng — và gọi các thay đổi trên model, có thể cả trên view.</p>
<p>Hình trên slide là các nút Facebook: <em>Đăng nhập</em>, <em>Thích</em>, <em>Bình luận</em>, <em>Tìm kiếm</em>, <em>Tạo tài khoản mới</em>. Trên web mỗi cú bấm như thế thành một <strong>HTTP request</strong>, và mỗi request cần đúng một đoạn code controller. Trong app của ta danh sách "sự kiện" đó được viết ra thành một bảng định tuyến (routing table):</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/controller/DeviceController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Bảng định tuyến: "METHOD /đường-dẫn" → hàm xử lý. Thêm tính năng = một dòng ở đây + một phương thức
private final Map&lt;String, Action&gt; routes = Map.of(
        "GET /",        this::list,
        "GET /new",     this::showCreate,
        "POST /create", this::create,
        "GET /edit",    this::showEdit,
        "POST /update", this::update,
        "POST /delete", this::delete);</code></pre>
<p>Một hàm xử lý trọn vẹn — đọc request, hỏi model, chọn view, không gì khác:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/controller/DeviceController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private void list(HttpServletRequest req, HttpServletResponse resp) throws Exception {
    String q = req.getParameter("q");
    req.setAttribute("q", q == null ? "" : q.trim());
    req.setAttribute("page", service.list(q, parseInt(req.getParameter("page"), 1)));   // hỏi Model
    moveFlash(req);
    String view = "json".equals(req.getParameter("format")) ? "list-json.jsp" : "list.jsp";   // cùng Model, hai View
    req.getRequestDispatcher(VIEWS + view).forward(req, resp);                              // chọn View
}</code></pre>
<p>Để ý thứ <em>không</em> có ở đó: không SQL, không HTML, không luật kiểu "số lượng ≤ 999". Controller là lớp duy nhất biết về <code>HttpServletRequest</code>, tham số, mã trạng thái, forward và redirect — phía HTTP của app.</p>
<p class="meo">🧠 Đối chiếu các nút trên slide: Tìm kiếm → <code>GET /devices?q=…</code>; Đăng nhập / Tạo tài khoản → một <code>POST</code> làm đổi trạng thái, rồi chuyển hướng. "Đọc" là GET, "đổi" là POST — controller giữ luật đó.</p>`],
      [8, 'MVC2',
        `<p class="y-chinh">🎯 MVC2 builds the MVC pattern into a web container: a <strong>Controller (Filter/Servlet)</strong> receives every request, a <strong>View (JSP)</strong> presents, a <strong>Model (JavaBean)</strong> talks to the database. Pros: centralised navigation, easy to maintain, extend and test, better separation of concerns. Con: you write the controller yourself, and changing it means recompiling and redeploying.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/f1d85eac92d7c0e50f18e26ba295195371445e35.svg" alt="Slide 8 redrawn, each box labelled with its file in our app" loading="lazy" /><p class="chu-thich">🧩 Slide 8 redrawn, each box labelled with its file in our app</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 8: MVC2 inside the container — and what each box is in our app
left to right direction
actor "Browser" as B
node "Container (Tomcat 10.1)" {
  rectangle "Controller (Filter/Servlet)\\nDeviceController /devices/*" as C
  rectangle "View (JSP)\\nlist.jsp, form.jsp" as V
  rectangle "Model (Java Bean)\\nDevice, Page, DeviceService, DeviceDAO" as M
}
database "Database\\nPRJ301_MvcThietBi" as DB
B --&gt; C : every request
C --&gt; V : forward
C --&gt; M : call
V --&gt; M : read properties
M --&gt; DB : JDBC
@enduml</code></pre></details>
<p>"Navigation control is centralized" is literally one method in our app — the <strong>Front Controller</strong>: one servlet mapped to <code>/devices/*</code> looks up <code>METHOD + path</code> in the table, and answers 404 for an unknown page and 405 (with an <code>Allow</code> header) for a known page with the wrong method:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/controller/DeviceController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String path = req.getPathInfo() == null ? "/" : req.getPathInfo();   // /devices ⇒ null, /devices/edit ⇒ "/edit"
    Action action = routes.get(req.getMethod() + " " + path);
    if (action == null) {
        Set&lt;String&gt; allowed = routes.keySet().stream().filter(k -&gt; k.endsWith(" " + path))
                .map(k -&gt; k.substring(0, k.indexOf(' '))).collect(Collectors.toCollection(java.util.TreeSet::new));
        if (allowed.isEmpty()) { resp.sendError(404); return; }          // no such page
        resp.setHeader("Allow", String.join(", ", allowed));
        resp.sendError(405);                                               // page exists, wrong method
        return;
    }
    try {
        action.run(req, resp);
    } catch (ServletException | IOException e) {
        throw e;
    } catch (Exception e) {                                                // SQLException… ⇒ one place turns it into a 500
        throw new ServletException(e);
    }
}</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/20d6802a308b6d813fbad2b0cbf7b300f1ef86bf.svg" alt="The front controller's decision, request by request" loading="lazy" /><p class="chu-thich">🧩 The front controller's decision, request by request</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Front Controller: one servlet, one routing table
start
:request arrives at /devices/*;
:key = method + " " + pathInfo\\n(e.g. POST /create);
if (key in routes?) then (yes)
  :run the handler method;
  :handler calls DeviceService;
  if (form valid?) then (yes)
    :sendRedirect /devices (PRG);
  else (no)
    :forward form.jsp with errors;
  endif
else (no)
  if (path known with another method?) then (yes)
    :405 + Allow header;
  else (no)
    :404;
  endif
endif
stop
@enduml</code></pre></details>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices/create HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 405
Allow: POST
Content-Type: text/html;charset=utf-8

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 405 – Method Not Allowed
Type Status Report
Description The method received in the request-line is known by the origin server but not supported by the target resource.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices/report HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 683

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p>➕ Why "Filter/Servlet"? Apache Struts 2 uses a <em>filter</em> (<code>StrutsPrepareAndExecuteFilter</code>, mapped to <code>/*</code>) as its front controller; Spring MVC uses a <em>servlet</em> (<code>DispatcherServlet</code>). Both are the same idea. Lesson 5.B's <code>jdbc-human</code> used the other style, one servlet per action ("page controller") — fine for 4 pages, painful for 40; read the old lesson 6.2 for the comparison table.</p>
<div class="pitfall">About the "con": only the controller and model need a recompile — JSPs are recompiled by Tomcat on the next request. And frameworks did not remove the recompile; what they removed is the hand-written routing, parameter binding and validation plumbing you see above. FE question type: "MVC2 improves testability because components can be tested in isolation" — true.</div>`,
        `<p class="y-chinh">🎯 MVC2 đưa mẫu MVC vào một web container: một <strong>Controller (Filter/Servlet)</strong> nhận mọi request, một <strong>View (JSP)</strong> trình bày, một <strong>Model (JavaBean)</strong> nói chuyện với CSDL. Ưu điểm: điều hướng tập trung một chỗ, dễ bảo trì, dễ mở rộng, dễ kiểm thử, tách bạch trách nhiệm tốt hơn. Nhược điểm: bạn tự viết controller, và đổi nó là phải biên dịch lại rồi deploy lại.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/f1d85eac92d7c0e50f18e26ba295195371445e35.svg" alt="Slide 8 vẽ lại, mỗi hộp ghi tên file tương ứng trong app của ta" loading="lazy" /><p class="chu-thich">🧩 Slide 8 vẽ lại, mỗi hộp ghi tên file tương ứng trong app của ta</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 8: MVC2 inside the container — and what each box is in our app
left to right direction
actor "Browser" as B
node "Container (Tomcat 10.1)" {
  rectangle "Controller (Filter/Servlet)\\nDeviceController /devices/*" as C
  rectangle "View (JSP)\\nlist.jsp, form.jsp" as V
  rectangle "Model (Java Bean)\\nDevice, Page, DeviceService, DeviceDAO" as M
}
database "Database\\nPRJ301_MvcThietBi" as DB
B --&gt; C : every request
C --&gt; V : forward
C --&gt; M : call
V --&gt; M : read properties
M --&gt; DB : JDBC
@enduml</code></pre></details>
<p>"Điều hướng tập trung" đúng nghĩa đen là một phương thức trong app của ta — <strong>Front Controller</strong> (bộ điều khiển đứng trước): một servlet ánh xạ tới <code>/devices/*</code> tra <code>METHOD + đường dẫn</code> trong bảng, trả 404 cho trang không có và 405 (kèm header <code>Allow</code>) cho trang có nhưng sai method:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/controller/DeviceController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String path = req.getPathInfo() == null ? "/" : req.getPathInfo();   // /devices ⇒ null, /devices/edit ⇒ "/edit"
    Action action = routes.get(req.getMethod() + " " + path);
    if (action == null) {
        Set&lt;String&gt; allowed = routes.keySet().stream().filter(k -&gt; k.endsWith(" " + path))
                .map(k -&gt; k.substring(0, k.indexOf(' '))).collect(Collectors.toCollection(java.util.TreeSet::new));
        if (allowed.isEmpty()) { resp.sendError(404); return; }          // không có trang này
        resp.setHeader("Allow", String.join(", ", allowed));
        resp.sendError(405);                                               // trang có, sai method
        return;
    }
    try {
        action.run(req, resp);
    } catch (ServletException | IOException e) {
        throw e;
    } catch (Exception e) {                                                // SQLException… ⇒ một chỗ duy nhất biến nó thành 500
        throw new ServletException(e);
    }
}</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/20d6802a308b6d813fbad2b0cbf7b300f1ef86bf.svg" alt="Quyết định của front controller, từng request một" loading="lazy" /><p class="chu-thich">🧩 Quyết định của front controller, từng request một</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Front Controller: one servlet, one routing table
start
:request arrives at /devices/*;
:key = method + " " + pathInfo\\n(e.g. POST /create);
if (key in routes?) then (yes)
  :run the handler method;
  :handler calls DeviceService;
  if (form valid?) then (yes)
    :sendRedirect /devices (PRG);
  else (no)
    :forward form.jsp with errors;
  endif
else (no)
  if (path known with another method?) then (yes)
    :405 + Allow header;
  else (no)
    :404;
  endif
endif
stop
@enduml</code></pre></details>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices/create HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 405
Allow: POST
Content-Type: text/html;charset=utf-8

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 405 – Method Not Allowed
Type Status Report
Description The method received in the request-line is known by the origin server but not supported by the target resource.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices/report HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 683

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p>➕ Vì sao "Filter/Servlet"? Apache Struts 2 dùng một <em>filter</em> (<code>StrutsPrepareAndExecuteFilter</code>, ánh xạ <code>/*</code>) làm front controller; Spring MVC dùng một <em>servlet</em> (<code>DispatcherServlet</code>). Cả hai cùng một ý. App <code>jdbc-human</code> ở bài 5.B dùng kiểu còn lại, mỗi hành động một servlet ("page controller") — ổn với 4 trang, khổ với 40 trang; đọc bài cũ 6.2 để xem bảng so sánh.</p>
<div class="pitfall">Về "nhược điểm": chỉ controller và model cần biên dịch lại — JSP được Tomcat tự biên dịch lại ở request kế tiếp. Và framework không xoá được việc biên dịch lại; thứ chúng xoá là phần định tuyến, gắn tham số và kiểm tra dữ liệu viết tay như bạn thấy ở trên. Dạng câu FE: "MVC2 cải thiện khả năng kiểm thử vì các thành phần kiểm thử riêng được" — đúng.</div>`],
      [9, 'Benefits',
        `<p class="y-chinh">🎯 Seven benefits: organisation, rapid application development, code reuse, parallel development, the same information shown in different ways, views reflecting data changes, and the ability to change the user interface (or port it) without touching the application code.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/bdcae158cb3271223aaa26e778e2c3da6029a548.svg" alt="&quot;Organization&quot;: the packages of the app, arrows only go downwards" loading="lazy" /><p class="chu-thich">🧩 "Organization": the packages of the app, arrows only go downwards</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 9 "organization": the packages of mvc-thiet-bi and who may call whom
skinparam packageStyle folder
hide empty members
hide circle
package "controller" as PC {
  class DeviceController
}
package "service" as PS {
  class DeviceService
}
package "dal" as PD {
  class DeviceDAO
  class LabDAO
  class DBContext
}
package "model" as PM {
  class Device
  class Lab
  class "Page&lt;T&gt;" as Page
  class DeviceForm
}
package "WEB-INF/views/device" as PV {
  class "list.jsp" as L
  class "form.jsp" as F
}
DeviceController --&gt; DeviceService
DeviceController ..&gt; L : forward
DeviceController ..&gt; F : forward
DeviceService --&gt; DeviceDAO
DeviceService --&gt; LabDAO
DeviceDAO --&gt; DBContext
LabDAO --&gt; DBContext
DeviceDAO ..&gt; Device
L ..&gt; Page : reads
F ..&gt; DeviceForm : reads
@enduml</code></pre></details>
<table>
<thead><tr><th>Benefit on the slide</th><th>Where you can see it in <code>mvc-thiet-bi</code></th></tr></thead>
<tbody>
<tr><td>Organization</td><td>four packages + one views folder; a bug in paging lives in <code>DeviceService</code>, a typo on the page in <code>list.jsp</code></td></tr>
<tr><td>Reusing code</td><td><code>DeviceForm</code> and <code>form.jsp</code> serve both "add" and "edit"; <code>DeviceDAO.map</code> serves every read</td></tr>
<tr><td>Parallel development</td><td>one person writes JSPs against attribute names (<code>page.items</code>), another the DAO — they agree only on <code>Device</code></td></tr>
<tr><td>Same information, different ways</td><td>the same <code>Page&lt;Device&gt;</code> rendered as HTML (above) and as JSON (below)</td></tr>
<tr><td>Views reflect changes</td><td>after an update the next GET builds a new view from fresh data (slide 10)</td></tr>
<tr><td>Other UI / environments</td><td>an Android app could call <code>?format=json</code>; the service and DAO do not change</td></tr>
</tbody>
</table>
<p>"The same information in different ways", for real — the controller keeps the model and only swaps the view (<code>list-json.jsp</code>):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices?format=json&amp;page=3 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: application/json;charset=UTF-8


{"page": 3, "totalPages": 3, "total": 11, "items": [

  {"code": "RPI-01", "name": "Raspberry Pi 4", "quantity": 10, "lab": "Lab IoT"},
  {"code": "SEN-01", "name": "Bộ cảm biến 37 món", "quantity": 5, "lab": "Lab IoT"},
  {"code": "ARD-01", "name": "Arduino Uno R3", "quantity": 15, "lab": "Lab IoT"}
]}</code></pre>
<p class="meo">🧠 Rapid development is real only <em>after</em> the skeleton exists: the first entity costs an afternoon, the fifth costs twenty minutes, because you copy the controller-service-DAO-JSP set. That is why you should build the skeleton in week one of the Assignment.</p>`,
        `<p class="y-chinh">🎯 Bảy lợi ích: có tổ chức, phát triển ứng dụng nhanh, dùng lại code, phát triển song song, cùng một thông tin hiển thị nhiều cách, view phản ánh ngay thay đổi của dữ liệu, và đổi được giao diện (hoặc chuyển sang môi trường khác) mà không đụng tới code ứng dụng.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/bdcae158cb3271223aaa26e778e2c3da6029a548.svg" alt="&quot;Có tổ chức&quot;: các gói của app, mũi tên chỉ đi xuống" loading="lazy" /><p class="chu-thich">🧩 "Có tổ chức": các gói của app, mũi tên chỉ đi xuống</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 9 "organization": the packages of mvc-thiet-bi and who may call whom
skinparam packageStyle folder
hide empty members
hide circle
package "controller" as PC {
  class DeviceController
}
package "service" as PS {
  class DeviceService
}
package "dal" as PD {
  class DeviceDAO
  class LabDAO
  class DBContext
}
package "model" as PM {
  class Device
  class Lab
  class "Page&lt;T&gt;" as Page
  class DeviceForm
}
package "WEB-INF/views/device" as PV {
  class "list.jsp" as L
  class "form.jsp" as F
}
DeviceController --&gt; DeviceService
DeviceController ..&gt; L : forward
DeviceController ..&gt; F : forward
DeviceService --&gt; DeviceDAO
DeviceService --&gt; LabDAO
DeviceDAO --&gt; DBContext
LabDAO --&gt; DBContext
DeviceDAO ..&gt; Device
L ..&gt; Page : reads
F ..&gt; DeviceForm : reads
@enduml</code></pre></details>
<table>
<thead><tr><th>Lợi ích trên slide</th><th>Thấy ở đâu trong <code>mvc-thiet-bi</code></th></tr></thead>
<tbody>
<tr><td>Có tổ chức (organization)</td><td>bốn gói + một thư mục view; lỗi phân trang nằm ở <code>DeviceService</code>, lỗi chính tả trên trang nằm ở <code>list.jsp</code></td></tr>
<tr><td>Dùng lại code</td><td><code>DeviceForm</code> và <code>form.jsp</code> phục vụ cả "thêm" lẫn "sửa"; <code>DeviceDAO.map</code> phục vụ mọi lần đọc</td></tr>
<tr><td>Phát triển song song</td><td>một người viết JSP theo tên attribute (<code>page.items</code>), người khác viết DAO — hai bên chỉ cần thống nhất lớp <code>Device</code></td></tr>
<tr><td>Cùng thông tin, nhiều cách</td><td>cùng một <code>Page&lt;Device&gt;</code> hiện thành HTML (ở trên) và thành JSON (ở dưới)</td></tr>
<tr><td>View phản ánh thay đổi</td><td>sau khi sửa, lần GET kế tiếp dựng view mới từ dữ liệu mới (slide 10)</td></tr>
<tr><td>Giao diện / môi trường khác</td><td>một app Android gọi được <code>?format=json</code>; service và DAO không đổi</td></tr>
</tbody>
</table>
<p>"Cùng thông tin, nhiều cách", chạy thật — controller giữ nguyên model và chỉ đổi view (<code>list-json.jsp</code>):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices?format=json&amp;page=3 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: application/json;charset=UTF-8


{"page": 3, "totalPages": 3, "total": 11, "items": [

  {"code": "RPI-01", "name": "Raspberry Pi 4", "quantity": 10, "lab": "Lab IoT"},
  {"code": "SEN-01", "name": "Bộ cảm biến 37 món", "quantity": 5, "lab": "Lab IoT"},
  {"code": "ARD-01", "name": "Arduino Uno R3", "quantity": 15, "lab": "Lab IoT"}
]}</code></pre>
<p class="meo">🧠 "Phát triển nhanh" chỉ đúng <em>sau khi</em> đã có bộ khung: thực thể đầu tiên tốn một buổi chiều, thực thể thứ năm tốn hai mươi phút, vì bạn chép nguyên bộ controller-service-DAO-JSP. Đó là lý do nên dựng bộ khung ngay tuần đầu làm Assignment.</p>`],
      [10, 'The MVC pattern — control flow',
        `<p class="y-chinh">🎯 The control flow in five steps: (1) the user acts on the interface, (2) the controller takes the input event, (3) the controller notifies the model — which may or may not change its state, (4) a new view is generated from the model's data, (5) the interface waits for the next interaction.</p>
<p>Measured on our app with the most important flow of any PE: <em>add a record</em>. The sequence, then the real requests:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/069b92046a13eb866b2efc9ce212db7b5a863aa4.svg" alt="Slide 10's five steps on a real &quot;add device&quot;: POST, 302, GET" loading="lazy" /><p class="chu-thich">🧩 Slide 10's five steps on a real "add device": POST, 302, GET</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 10, five steps, measured on our app: add a device, then Post/Redirect/Get
actor User
participant "Browser" as B
participant "DeviceController\\n(Controller)" as C
participant "DeviceService\\n+ DeviceDAO (Model)" as M
database "SQL Server" as DB
participant "list.jsp\\n(View)" as V
User -&gt; B : 1. fills the form, clicks Save
B -&gt; C : 2. POST /devices/create
C -&gt; M : 3. save(form)
M -&gt; DB : SELECT 1 … WHERE code = ?\\nINSERT INTO Device …
M --&gt; C : no errors
C --&gt; B : 302 Location: /devices (flash in session)
B -&gt; C : GET /devices
C -&gt; M : list(q, page)
M -&gt; DB : COUNT + OFFSET/FETCH
M --&gt; C : Page&lt;Device&gt;
C -&gt; V : 4. forward (page, flash)
V --&gt; B : 200 HTML
B -&gt; User : 5. waits for the next action
@enduml</code></pre></details>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/controller/DeviceController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private void create(HttpServletRequest req, HttpServletResponse resp) throws Exception {
    DeviceForm form = readForm(req);
    form.setId("");                                                        // create never trusts an id from the browser
    Map&lt;String, String&gt; errors = service.save(form);
    if (!errors.isEmpty()) {                                               // invalid ⇒ same request, form again, NO redirect
        showForm(req, resp, form, errors);
        return;
    }
    flash(req, "Added " + form.getCode());
    resp.sendRedirect(req.getContextPath() + "/devices");                  // valid ⇒ Post/Redirect/Get
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /mvc-thiet-bi/devices/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 75

code=osc-02&amp;name=M%C3%A1y+hi%E1%BB%87n+s%C3%B3ng+Siglent&amp;quantity=2&amp;labId=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…; Path=/mvc-thiet-bi; HttpOnly
Location: /mvc-thiet-bi/devices
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices?page=3 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Lab devices&lt;/h1&gt;
&lt;p class="flash"&gt;Added OSC-02&lt;/p&gt;&lt;form action="/mvc-thiet-bi/devices" method="get"&gt;
  &lt;input name="q" value="" placeholder="name contains…"&gt; &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;RPI-01&lt;/td&gt;&lt;td&gt;Raspberry Pi 4&lt;/td&gt;&lt;td&gt;10&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=9"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SEN-01&lt;/td&gt;&lt;td&gt;Bộ cảm biến 37 món&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=10"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;ARD-01&lt;/td&gt;&lt;td&gt;Arduino Uno R3&lt;/td&gt;&lt;td&gt;15&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=11"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;OSC-02&lt;/td&gt;&lt;td&gt;Máy hiện sóng Siglent&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Lab Điện tử&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=12"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 3/3 · 12 device(s)
  &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=1"&gt;1&lt;/a&gt; &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=2"&gt;2&lt;/a&gt; &lt;strong&gt;[3]&lt;/strong&gt; &lt;/p&gt;
&lt;a href="/mvc-thiet-bi/devices/new"&gt;Add a device&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Step 4 happens in a <em>second</em> request. The POST changes the model and answers <strong>302</strong>; the browser then GETs the list. This is <strong>Post/Redirect/Get</strong> (PRG): pressing F5 now repeats the harmless GET, not the INSERT. The "Added OSC-02" message travelled in the session (a request attribute would have died with the POST) and is shown <em>once</em> — the same GET again has no message:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/controller/DeviceController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private static void flash(HttpServletRequest req, String msg) { req.getSession().setAttribute("flash", msg); }

private static void moveFlash(HttpServletRequest req) {               // show once, then forget
    HttpSession s = req.getSession(false);
    if (s != null &amp;&amp; s.getAttribute("flash") != null) {
        req.setAttribute("flash", s.getAttribute("flash"));
        s.removeAttribute("flash");
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices?page=3 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Lab devices&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices" method="get"&gt;
  &lt;input name="q" value="" placeholder="name contains…"&gt; &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
… (16 more lines / còn 16 dòng)</code></pre>
<p>"Which may not involve a change of state": when validation fails, the model refuses, nothing is written, and the controller shows the form again <em>in the same request</em> (no redirect — the errors and typed values must survive). Each message sits next to its own field:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /mvc-thiet-bi/devices/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 38

code=osc01&amp;name=&amp;quantity=-3&amp;labId=abc</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add device&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add device&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices/create" method="post"&gt;
  &lt;label&gt;Code &lt;input name="code" value="osc01"&gt;&lt;/label&gt;
  &lt;span class="error"&gt;Code must look like OSC-01&lt;/span&gt;&lt;br&gt;
  &lt;label&gt;Name &lt;input name="name" value=""&gt;&lt;/label&gt;
  &lt;span class="error"&gt;Name is required&lt;/span&gt;&lt;br&gt;
  &lt;label&gt;Quantity &lt;input name="quantity" value="-3"&gt;&lt;/label&gt;
  &lt;span class="error"&gt;Quantity must be a whole number 0–999&lt;/span&gt;&lt;br&gt;
  &lt;label&gt;Lab &lt;select name="labId"&gt;
    &lt;option value=""&gt;-- choose --&lt;/option&gt;
    &lt;option value="1" &gt;Lab Điện tử&lt;/option&gt;
    &lt;option value="2" &gt;Lab Mạng&lt;/option&gt;
    &lt;option value="3" &gt;Lab IoT&lt;/option&gt;
    &lt;/select&gt;&lt;/label&gt;
  &lt;span class="error"&gt;Choose a lab&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /mvc-thiet-bi/devices/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 57

code=esp-01&amp;name=Kit+ESP32+m%E1%BB%9Bi&amp;quantity=5&amp;labId=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add device&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add device&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices/create" method="post"&gt;
  &lt;label&gt;Code &lt;input name="code" value="esp-01"&gt;&lt;/label&gt;
  &lt;span class="error"&gt;Code ESP-01 already exists&lt;/span&gt;&lt;br&gt;
  &lt;label&gt;Name &lt;input name="name" value="Kit ESP32 mới"&gt;&lt;/label&gt;
  &lt;br&gt;
  &lt;label&gt;Quantity &lt;input name="quantity" value="5"&gt;&lt;/label&gt;
  &lt;br&gt;
  &lt;label&gt;Lab &lt;select name="labId"&gt;
    &lt;option value=""&gt;-- choose --&lt;/option&gt;
… (9 more lines / còn 9 dòng)</code></pre>
<div class="pitfall">FE trap (FE question type): after <code>request.setAttribute("data", …)</code> then <code>response.sendRedirect(…)</code>, the attribute is <strong>lost</strong> — the redirect makes the browser send a brand-new request. Use forward to keep request attributes, the session (flash) to carry a message across a redirect.</div>`,
        `<p class="y-chinh">🎯 Luồng điều khiển năm bước: (1) người dùng thao tác trên giao diện, (2) controller nhận sự kiện đầu vào, (3) controller báo hành động đó cho model — có thể làm hoặc không làm đổi trạng thái model, (4) một view mới được tạo từ dữ liệu của model, (5) giao diện chờ lần tương tác kế tiếp.</p>
<p>Đo trên app của ta bằng luồng quan trọng nhất của mọi đề PE: <em>thêm một bản ghi</em>. Sơ đồ tuần tự, rồi các request thật:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/069b92046a13eb866b2efc9ce212db7b5a863aa4.svg" alt="Năm bước của slide 10 trên một lần &quot;thêm thiết bị&quot; thật: POST, 302, GET" loading="lazy" /><p class="chu-thich">🧩 Năm bước của slide 10 trên một lần "thêm thiết bị" thật: POST, 302, GET</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 10, five steps, measured on our app: add a device, then Post/Redirect/Get
actor User
participant "Browser" as B
participant "DeviceController\\n(Controller)" as C
participant "DeviceService\\n+ DeviceDAO (Model)" as M
database "SQL Server" as DB
participant "list.jsp\\n(View)" as V
User -&gt; B : 1. fills the form, clicks Save
B -&gt; C : 2. POST /devices/create
C -&gt; M : 3. save(form)
M -&gt; DB : SELECT 1 … WHERE code = ?\\nINSERT INTO Device …
M --&gt; C : no errors
C --&gt; B : 302 Location: /devices (flash in session)
B -&gt; C : GET /devices
C -&gt; M : list(q, page)
M -&gt; DB : COUNT + OFFSET/FETCH
M --&gt; C : Page&lt;Device&gt;
C -&gt; V : 4. forward (page, flash)
V --&gt; B : 200 HTML
B -&gt; User : 5. waits for the next action
@enduml</code></pre></details>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/controller/DeviceController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private void create(HttpServletRequest req, HttpServletResponse resp) throws Exception {
    DeviceForm form = readForm(req);
    form.setId("");                                                        // thêm mới không tin id gửi từ trình duyệt
    Map&lt;String, String&gt; errors = service.save(form);
    if (!errors.isEmpty()) {                                               // sai ⇒ cùng request, hiện lại form, KHÔNG redirect
        showForm(req, resp, form, errors);
        return;
    }
    flash(req, "Added " + form.getCode());
    resp.sendRedirect(req.getContextPath() + "/devices");                  // hợp lệ ⇒ Post/Redirect/Get
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /mvc-thiet-bi/devices/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 75

code=osc-02&amp;name=M%C3%A1y+hi%E1%BB%87n+s%C3%B3ng+Siglent&amp;quantity=2&amp;labId=1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…; Path=/mvc-thiet-bi; HttpOnly
Location: /mvc-thiet-bi/devices
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices?page=3 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Lab devices&lt;/h1&gt;
&lt;p class="flash"&gt;Added OSC-02&lt;/p&gt;&lt;form action="/mvc-thiet-bi/devices" method="get"&gt;
  &lt;input name="q" value="" placeholder="name contains…"&gt; &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;RPI-01&lt;/td&gt;&lt;td&gt;Raspberry Pi 4&lt;/td&gt;&lt;td&gt;10&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=9"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SEN-01&lt;/td&gt;&lt;td&gt;Bộ cảm biến 37 món&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=10"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;ARD-01&lt;/td&gt;&lt;td&gt;Arduino Uno R3&lt;/td&gt;&lt;td&gt;15&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=11"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;OSC-02&lt;/td&gt;&lt;td&gt;Máy hiện sóng Siglent&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;td&gt;Lab Điện tử&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=12"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 3/3 · 12 device(s)
  &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=1"&gt;1&lt;/a&gt; &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=2"&gt;2&lt;/a&gt; &lt;strong&gt;[3]&lt;/strong&gt; &lt;/p&gt;
&lt;a href="/mvc-thiet-bi/devices/new"&gt;Add a device&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Bước 4 xảy ra ở một request <em>thứ hai</em>. POST làm đổi model và trả <strong>302</strong>; trình duyệt sau đó GET trang danh sách. Đây là <strong>Post/Redirect/Get</strong> (PRG — Gửi/Chuyển hướng/Lấy): bấm F5 lúc này chỉ lặp lại cái GET vô hại, không lặp lại câu INSERT. Thông báo "Added OSC-02" đi nhờ session (một request attribute sẽ chết cùng cái POST) và chỉ hiện <em>một lần</em> — GET lại lần nữa thì không còn thông báo:</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/controller/DeviceController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private static void flash(HttpServletRequest req, String msg) { req.getSession().setAttribute("flash", msg); }

private static void moveFlash(HttpServletRequest req) {               // hiện một lần rồi quên
    HttpSession s = req.getSession(false);
    if (s != null &amp;&amp; s.getAttribute("flash") != null) {
        req.setAttribute("flash", s.getAttribute("flash"));
        s.removeAttribute("flash");
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices?page=3 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Lab devices&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices" method="get"&gt;
  &lt;input name="q" value="" placeholder="name contains…"&gt; &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
… (16 more lines / còn 16 dòng)</code></pre>
<p>"Có thể không làm đổi trạng thái": khi kiểm tra dữ liệu thất bại, model từ chối, không ghi gì, và controller hiện lại form <em>trong cùng request</em> (không redirect — lỗi và giá trị đã gõ phải còn nguyên). Mỗi thông báo nằm ngay cạnh ô của nó:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /mvc-thiet-bi/devices/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 38

code=osc01&amp;name=&amp;quantity=-3&amp;labId=abc</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add device&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add device&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices/create" method="post"&gt;
  &lt;label&gt;Code &lt;input name="code" value="osc01"&gt;&lt;/label&gt;
  &lt;span class="error"&gt;Code must look like OSC-01&lt;/span&gt;&lt;br&gt;
  &lt;label&gt;Name &lt;input name="name" value=""&gt;&lt;/label&gt;
  &lt;span class="error"&gt;Name is required&lt;/span&gt;&lt;br&gt;
  &lt;label&gt;Quantity &lt;input name="quantity" value="-3"&gt;&lt;/label&gt;
  &lt;span class="error"&gt;Quantity must be a whole number 0–999&lt;/span&gt;&lt;br&gt;
  &lt;label&gt;Lab &lt;select name="labId"&gt;
    &lt;option value=""&gt;-- choose --&lt;/option&gt;
    &lt;option value="1" &gt;Lab Điện tử&lt;/option&gt;
    &lt;option value="2" &gt;Lab Mạng&lt;/option&gt;
    &lt;option value="3" &gt;Lab IoT&lt;/option&gt;
    &lt;/select&gt;&lt;/label&gt;
  &lt;span class="error"&gt;Choose a lab&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /mvc-thiet-bi/devices/create HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 57

code=esp-01&amp;name=Kit+ESP32+m%E1%BB%9Bi&amp;quantity=5&amp;labId=3</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Add device&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Add device&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices/create" method="post"&gt;
  &lt;label&gt;Code &lt;input name="code" value="esp-01"&gt;&lt;/label&gt;
  &lt;span class="error"&gt;Code ESP-01 already exists&lt;/span&gt;&lt;br&gt;
  &lt;label&gt;Name &lt;input name="name" value="Kit ESP32 mới"&gt;&lt;/label&gt;
  &lt;br&gt;
  &lt;label&gt;Quantity &lt;input name="quantity" value="5"&gt;&lt;/label&gt;
  &lt;br&gt;
  &lt;label&gt;Lab &lt;select name="labId"&gt;
    &lt;option value=""&gt;-- choose --&lt;/option&gt;
… (9 more lines / còn 9 dòng)</code></pre>
<div class="pitfall">Bẫy FE (dạng câu FE): sau <code>request.setAttribute("data", …)</code> rồi <code>response.sendRedirect(…)</code>, attribute <strong>bị mất</strong> — redirect bắt trình duyệt gửi một request hoàn toàn mới. Muốn giữ request attribute thì forward; muốn mang một thông báo qua redirect thì dùng session (flash).</div>`],
      [11, 'The MVC pattern — the picture',
        `<p class="y-chinh">🎯 The same cycle as a picture: (1) the user interacts with a view, (2) the view alerts the controller of an event, (3) the controller updates the model, (4) the <strong>model alerts the view that it has changed</strong>, (5) the view grabs the model data and updates itself.</p>
<p>⚠️ This picture is <em>classic</em> (desktop) MVC, and step 4 does not exist in a servlet/JSP app. On the desktop the view is a live object that subscribes to the model (the Observer pattern); on the web the "view" is HTML already sitting in someone's browser, and the server cannot reach it. A web view is rebuilt from scratch on every request — which is exactly why slide 10 says "it generates a new view".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/67c1ac41a864cf19e8a53d7e62e587d6d6e7e29c.svg" alt="Step 4 (&quot;model alerts view&quot;) exists on the desktop, not on the web" loading="lazy" /><p class="chu-thich">🧩 Step 4 ("model alerts view") exists on the desktop, not on the web</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 11: classic MVC (desktop) vs MVC on the web
participant "View" as V
participant "Controller" as C
participant "Model" as M
== Desktop (Smalltalk, Swing): the model PUSHES ==
V -&gt; C : 2. event (click)
C -&gt; M : 3. update
M -&gt; V : 4. "I have changed" (listener)
V -&gt; M : 5. get data, repaint
== Web (servlet + JSP): one request = one cycle ==
V -&gt; C : HTTP request (the old page is gone)
C -&gt; M : call service / DAO
C -&gt; V : forward a NEW view with fresh data
note over M : no step 4 on the web — the server cannot\\nreach a page the browser already shows\\n(only WebSocket / SSE / polling can)
@enduml</code></pre></details>
<p>The desktop version runs on slide 13 (Swing): you will see the model print "notify 2 view(s)". On the web, the closest thing to step 4 is <em>another request</em>: the browser asks again (F5, polling every few seconds) or keeps a channel open (WebSocket, Server-Sent Events — beyond PRJ301).</p>
<p class="meo">🧠 Desktop MVC: the model <strong>pushes</strong>. Web MVC: the browser <strong>pulls</strong>, one request = one full C → M → V cycle.</p>`,
        `<p class="y-chinh">🎯 Cùng chu trình đó dưới dạng hình: (1) người dùng tương tác với view, (2) view báo cho controller một sự kiện, (3) controller cập nhật model, (4) <strong>model báo cho view rằng nó đã thay đổi</strong>, (5) view lấy dữ liệu model và tự cập nhật.</p>
<p>⚠️ Hình này là MVC <em>cổ điển</em> (desktop), và bước 4 không tồn tại trong một app servlet/JSP. Trên desktop, view là một đối tượng đang sống, đăng ký theo dõi model (mẫu Observer — người quan sát); trên web, "view" là đoạn HTML đã nằm sẵn trong trình duyệt của ai đó, và server không với tới nó được. View trên web được dựng lại từ đầu ở mỗi request — đúng lý do slide 10 viết "nó tạo ra một view mới".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/67c1ac41a864cf19e8a53d7e62e587d6d6e7e29c.svg" alt="Bước 4 (&quot;model báo view&quot;) có trên desktop, không có trên web" loading="lazy" /><p class="chu-thich">🧩 Bước 4 ("model báo view") có trên desktop, không có trên web</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 11: classic MVC (desktop) vs MVC on the web
participant "View" as V
participant "Controller" as C
participant "Model" as M
== Desktop (Smalltalk, Swing): the model PUSHES ==
V -&gt; C : 2. event (click)
C -&gt; M : 3. update
M -&gt; V : 4. "I have changed" (listener)
V -&gt; M : 5. get data, repaint
== Web (servlet + JSP): one request = one cycle ==
V -&gt; C : HTTP request (the old page is gone)
C -&gt; M : call service / DAO
C -&gt; V : forward a NEW view with fresh data
note over M : no step 4 on the web — the server cannot\\nreach a page the browser already shows\\n(only WebSocket / SSE / polling can)
@enduml</code></pre></details>
<p>Bản desktop chạy thật ở slide 13 (Swing): bạn sẽ thấy model in "notify 2 view(s)". Trên web, thứ gần với bước 4 nhất là <em>một request khác</em>: trình duyệt hỏi lại (F5, hỏi định kỳ vài giây một lần — polling) hoặc giữ một kênh mở (WebSocket, Server-Sent Events — ngoài phạm vi PRJ301).</p>
<p class="meo">🧠 MVC desktop: model <strong>đẩy</strong> (push). MVC web: trình duyệt <strong>kéo</strong> (pull), một request = một vòng C → M → V trọn vẹn.</p>`],
      [12, 'Where it can use?',
        `<p class="y-chinh">🎯 MVC applies to all types of systems ("all ty of systems" on the slide is a typo for <em>types</em>) and to all technologies — Java, Python, Ruby, Perl, Smalltalk…</p>
<p>➕ What that means in practice — the same three roles appear, under different names, in the frameworks you will meet after PRJ301:</p>
<table>
<thead><tr><th>Language</th><th>Framework</th><th>Controller</th><th>View</th><th>Model</th></tr></thead>
<tbody>
<tr><td>Java</td><td>Spring MVC / Spring Boot</td><td><code>@Controller</code> class</td><td>Thymeleaf or JSP template</td><td><code>@Entity</code> + <code>@Service</code> + repository</td></tr>
<tr><td>Python</td><td>Django</td><td>"view" function (Django calls the controller a <em>view</em>)</td><td>template</td><td><code>models.Model</code> class</td></tr>
<tr><td>Ruby</td><td>Ruby on Rails</td><td><code>ApplicationController</code> subclass</td><td>ERB template</td><td><code>ActiveRecord</code> class</td></tr>
<tr><td>C#</td><td>ASP.NET Core MVC</td><td><code>Controller</code> class</td><td>Razor view (.cshtml)</td><td>model classes + EF Core</td></tr>
<tr><td>PHP</td><td>Laravel</td><td>controller class</td><td>Blade template</td><td>Eloquent model</td></tr>
</tbody>
</table>
<div class="pitfall">Django renames the parts (it calls itself "MTV": Model–Template–View, where its <em>view</em> is our controller). Do not let names fool you: ask "who receives the request, who knows the data, who draws the page".</div>
<p class="meo">🧠 Learn MVC once in PRJ301 and you can read any of these frameworks in an afternoon — the routing table, the model, the template are always there.</p>`,
        `<p class="y-chinh">🎯 MVC áp dụng cho mọi loại hệ thống ("all ty of systems" trên slide là gõ thiếu chữ <em>types</em>) và mọi công nghệ — Java, Python, Ruby, Perl, Smalltalk…</p>
<p>➕ Trong thực tế điều đó nghĩa là — cùng ba vai trò ấy xuất hiện, dưới những cái tên khác, trong các framework bạn sẽ gặp sau PRJ301:</p>
<table>
<thead><tr><th>Ngôn ngữ</th><th>Framework</th><th>Controller</th><th>View</th><th>Model</th></tr></thead>
<tbody>
<tr><td>Java</td><td>Spring MVC / Spring Boot</td><td>lớp <code>@Controller</code></td><td>template Thymeleaf hoặc JSP</td><td><code>@Entity</code> + <code>@Service</code> + repository</td></tr>
<tr><td>Python</td><td>Django</td><td>hàm "view" (Django gọi controller là <em>view</em>)</td><td>template</td><td>lớp <code>models.Model</code></td></tr>
<tr><td>Ruby</td><td>Ruby on Rails</td><td>lớp con của <code>ApplicationController</code></td><td>template ERB</td><td>lớp <code>ActiveRecord</code></td></tr>
<tr><td>C#</td><td>ASP.NET Core MVC</td><td>lớp <code>Controller</code></td><td>Razor view (.cshtml)</td><td>lớp model + EF Core</td></tr>
<tr><td>PHP</td><td>Laravel</td><td>lớp controller</td><td>template Blade</td><td>model Eloquent</td></tr>
</tbody>
</table>
<div class="pitfall">Django đổi tên các phần (nó tự gọi là "MTV": Model–Template–View, trong đó <em>view</em> của nó là controller của ta). Đừng để cái tên đánh lừa: hãy hỏi "ai nhận request, ai biết dữ liệu, ai vẽ trang".</div>
<p class="meo">🧠 Học MVC một lần cho chắc ở PRJ301 thì đọc framework nào trong số này cũng chỉ mất một buổi chiều — bảng định tuyến, model, template lúc nào cũng có mặt.</p>`],
      [13, 'MVC in Java',
        `<p class="y-chinh">🎯 MVC in (desktop) Java: the Model is written by the developer; the View is a set of objects of classes that inherit from <code>java.awt.Component</code>; the Controller is the event-processing thread plus the listener classes (often anonymous) implementing <code>ActionListener</code>, <code>MouseListener</code>, <code>WindowListener</code>…</p>
<p>This slide is about <strong>Swing/AWT</strong> (the PRO192 world), not about servlets — it is here to show where the pattern came from. A complete Swing MVC, run for real (headless: no window, but the components, the listener and the event code are the real ones):</p>
<pre class="trich"><code class="language-java">interface CounterListener { void changed(int newValue); }

static class CounterModel {                            // Model: data + rules, no Swing import needed
    private int value;
    private final List&lt;CounterListener&gt; listeners = new ArrayList&lt;&gt;();
    void addListener(CounterListener l) { listeners.add(l); }
    void increment() {
        if (value == 3) { System.out.println("model: rule — max is 3, ignored"); return; }
        value++;
        System.out.println("model: value = " + value + " → notify " + listeners.size() + " view(s)");
        for (CounterListener l : listeners) l.changed(value);   // slide 11 step 4: the model ALERTS the view
    }
}</code></pre>
<pre class="trich"><code class="language-java">CounterModel model = new CounterModel();
JLabel label = new JLabel("0");                     // View 1: a label
model.addListener(v -&gt; { label.setText(String.valueOf(v)); System.out.println("view 1 (JLabel): text = " + label.getText()); });
model.addListener(v -&gt; System.out.println("view 2 (bar): " + "#".repeat(v)));   // View 2: same model, another look
JButton plus = new JButton("+1");
plus.addActionListener(e -&gt; {                       // Controller: turns the click into a command for the model
    System.out.println("controller: '" + e.getActionCommand() + "' clicked");
    model.increment();
});
for (int i = 0; i &lt; 4; i++) plus.doClick();         // simulate four clicks</code></pre>
<div class="out">controller: '+1' clicked<br>
model: value = 1 → notify 2 view(s)<br>
view 1 (JLabel): text = 1<br>
view 2 (bar): #<br>
controller: '+1' clicked<br>
model: value = 2 → notify 2 view(s)<br>
view 1 (JLabel): text = 2<br>
view 2 (bar): ##<br>
controller: '+1' clicked<br>
model: value = 3 → notify 2 view(s)<br>
view 1 (JLabel): text = 3<br>
view 2 (bar): ###<br>
controller: '+1' clicked<br>
model: rule — max is 3, ignored</div>
<p>Read the output against slide 11: the controller (the <code>ActionListener</code>) only calls <code>increment()</code>; the model applies its rule (max 3) and <em>notifies</em> two different views — step 4, which the web app cannot do. Same model, two views (a label and a bar): slide 9's "same information in different ways", on the desktop.</p>
<table>
<thead><tr><th>Desktop (slide 13)</th><th>Web (this chapter)</th></tr></thead>
<tbody>
<tr><td>View = <code>JLabel</code>, <code>JButton</code> (subclasses of <code>java.awt.Component</code>)</td><td>View = JSP + JSTL producing HTML</td></tr>
<tr><td>Controller = <code>ActionListener</code> on the event thread</td><td>Controller = servlet <code>service()</code> on a Tomcat worker thread</td></tr>
<tr><td>Model notifies listeners</td><td>no notification: the next request reads the model again</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 MVC trong Java (desktop): Model do lập trình viên viết; View là tập các đối tượng thuộc lớp kế thừa <code>java.awt.Component</code>; Controller là luồng xử lý sự kiện cùng các lớp lắng nghe (thường là lớp vô danh — anonymous class) cài đặt <code>ActionListener</code>, <code>MouseListener</code>, <code>WindowListener</code>…</p>
<p>Slide này nói về <strong>Swing/AWT</strong> (thế giới của PRO192), không phải servlet — nó có mặt để cho thấy khuôn mẫu sinh ra từ đâu. Một MVC Swing trọn vẹn, chạy thật (chế độ headless: không có cửa sổ, nhưng thành phần, listener và code sự kiện đều là thật):</p>
<pre class="trich"><code class="language-java">interface CounterListener { void changed(int newValue); }

static class CounterModel {                            // Model: dữ liệu + luật, không cần import Swing
    private int value;
    private final List&lt;CounterListener&gt; listeners = new ArrayList&lt;&gt;();
    void addListener(CounterListener l) { listeners.add(l); }
    void increment() {
        if (value == 3) { System.out.println("model: rule — max is 3, ignored"); return; }
        value++;
        System.out.println("model: value = " + value + " → notify " + listeners.size() + " view(s)");
        for (CounterListener l : listeners) l.changed(value);   // slide 11 bước 4: model BÁO cho view
    }
}</code></pre>
<pre class="trich"><code class="language-java">CounterModel model = new CounterModel();
JLabel label = new JLabel("0");                     // View 1: một nhãn
model.addListener(v -&gt; { label.setText(String.valueOf(v)); System.out.println("view 1 (JLabel): text = " + label.getText()); });
model.addListener(v -&gt; System.out.println("view 2 (bar): " + "#".repeat(v)));   // View 2: cùng model, cách hiện khác
JButton plus = new JButton("+1");
plus.addActionListener(e -&gt; {                       // Controller: biến cú bấm thành lệnh cho model
    System.out.println("controller: '" + e.getActionCommand() + "' clicked");
    model.increment();
});
for (int i = 0; i &lt; 4; i++) plus.doClick();         // giả lập bốn cú bấm</code></pre>
<div class="out">controller: '+1' clicked<br>
model: value = 1 → notify 2 view(s)<br>
view 1 (JLabel): text = 1<br>
view 2 (bar): #<br>
controller: '+1' clicked<br>
model: value = 2 → notify 2 view(s)<br>
view 1 (JLabel): text = 2<br>
view 2 (bar): ##<br>
controller: '+1' clicked<br>
model: value = 3 → notify 2 view(s)<br>
view 1 (JLabel): text = 3<br>
view 2 (bar): ###<br>
controller: '+1' clicked<br>
model: rule — max is 3, ignored</div>
<p>Đọc output đối chiếu với slide 11: controller (cái <code>ActionListener</code>) chỉ gọi <code>increment()</code>; model áp luật của nó (tối đa 3) rồi <em>báo</em> cho hai view khác nhau — bước 4, thứ app web không làm được. Cùng một model, hai view (một nhãn và một thanh): "cùng thông tin, nhiều cách" của slide 9, phiên bản desktop.</p>
<table>
<thead><tr><th>Desktop (slide 13)</th><th>Web (chương này)</th></tr></thead>
<tbody>
<tr><td>View = <code>JLabel</code>, <code>JButton</code> (lớp con của <code>java.awt.Component</code>)</td><td>View = JSP + JSTL sinh ra HTML</td></tr>
<tr><td>Controller = <code>ActionListener</code> trên luồng sự kiện</td><td>Controller = <code>service()</code> của servlet trên một luồng worker của Tomcat</td></tr>
<tr><td>Model báo cho các listener</td><td>không có báo: request kế tiếp đọc lại model</td></tr>
</tbody>
</table>`],
      [14, 'MVC Framework',
        `<p class="y-chinh">🎯 Three Java MVC frameworks: <strong>Spring</strong> ("old but gold", still evolving), <strong>Struts</strong> (free, open source, builds web apps on the MVC pattern) and <strong>JavaServer Faces</strong> (the slide: "supported by Oracle, so it produces a super long and complicated document").</p>
<p>➕ Corrected and up to date (checked October 2026):</p>
<table>
<thead><tr><th>Framework</th><th>Today</th><th>Front controller</th></tr></thead>
<tbody>
<tr><td>Spring MVC (in Spring Boot)</td><td>the industry default; Spring 1.0 shipped in March 2004; Spring Boot 3 needs Java 17 and <code>jakarta.*</code></td><td><code>DispatcherServlet</code> (a servlet)</td></tr>
<tr><td>Apache Struts</td><td>Struts 1 is end-of-life (last release 1.3.10, December 2008); Struts 2 is still maintained but rarely chosen for new projects</td><td><code>StrutsPrepareAndExecuteFilter</code> (a filter)</td></tr>
<tr><td>Jakarta Faces (ex-JSF)</td><td>renamed with Jakarta EE; Faces 4.0 = Jakarta EE 10, 4.1 = EE 11; governed by the Eclipse Foundation, not Oracle</td><td><code>FacesServlet</code> (component-based)</td></tr>
</tbody>
</table>
<p>The slide's sentence about JSF is not a real reason — the specification's length says nothing about the framework. The useful difference: Spring MVC and Struts are <em>request-based</em> (exactly our routing table), Faces is <em>component-based</em> (the page is a tree of UI components with their own state). Here is our list action as Spring Boot would write it — the routing table became annotations, <code>getParameter</code> became method parameters:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/d33082a3106790305c60a83827265dd705441221.svg" alt="The same GET /devices in Spring Boot: DispatcherServlet is our DeviceController.service()" loading="lazy" /><p class="chu-thich">🧩 The same GET /devices in Spring Boot: DispatcherServlet is our DeviceController.service()</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 14: the same MVC in Spring Boot — the framework writes the front controller for you
participant "Browser" as B
participant "DispatcherServlet\\n(front controller)" as D
participant "DeviceController\\n@Controller" as C
participant "DeviceService\\n@Service" as S
participant "DeviceRepository\\nSpring Data JPA" as R
participant "ViewResolver\\n(Thymeleaf / JSP)" as VR
B -&gt; D : GET /devices?page=2
D -&gt; C : @GetMapping("/devices") list(q, page, model)
C -&gt; S : list(q, page)
S -&gt; R : findByNameContaining(q, pageable)
R --&gt; S : Page&lt;Device&gt;
C --&gt; D : return "device/list" (+ Model)
D -&gt; VR : resolve "device/list"
VR --&gt; B : 200 HTML
@enduml</code></pre></details>
<pre><code class="language-java">@Controller
@RequestMapping("/devices")
public class DeviceController {
    private final DeviceService service;
    public DeviceController(DeviceService service) { this.service = service; }   // injected by Spring

    @GetMapping                                   // = "GET /" in our routing table
    public String list(@RequestParam(defaultValue = "") String q,
                       @RequestParam(defaultValue = "1") int page, Model model) {
        model.addAttribute("q", q);
        model.addAttribute("page", service.list(q, page));
        return "device/list";                     // = forward(VIEWS + "list.jsp")
    }

    @PostMapping("/create")                       // = "POST /create"
    public String create(@Valid DeviceForm form, BindingResult errors, RedirectAttributes flash) {
        if (errors.hasErrors()) return "device/form";
        service.save(form);
        flash.addFlashAttribute("flash", "Added " + form.getCode());   // = our session flash
        return "redirect:/devices";               // = sendRedirect (PRG)
    }
}</code></pre>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): every line above has a twin in <code>DeviceController</code> of this lesson — that is the point of building it by hand first. LabFlow's REST API is the JSON-view variant: <code>@RestController</code> returns objects, Jackson turns them into JSON (slide 9's second view), React draws the page.</div>`,
        `<p class="y-chinh">🎯 Ba framework MVC của Java: <strong>Spring</strong> ("cũ mà xịn — old but gold", vẫn đang phát triển), <strong>Struts</strong> (miễn phí, mã nguồn mở, dựng app web theo mẫu MVC) và <strong>JavaServer Faces</strong> (slide: "được Oracle hỗ trợ, nên nó sinh ra tài liệu siêu dài và phức tạp").</p>
<p>➕ Đính chính và cập nhật (kiểm tháng 10/2026):</p>
<table>
<thead><tr><th>Framework</th><th>Ngày nay</th><th>Front controller</th></tr></thead>
<tbody>
<tr><td>Spring MVC (trong Spring Boot)</td><td>mặc định của ngành; Spring 1.0 ra tháng 3/2004; Spring Boot 3 cần Java 17 và <code>jakarta.*</code></td><td><code>DispatcherServlet</code> (một servlet)</td></tr>
<tr><td>Apache Struts</td><td>Struts 1 đã hết đời (bản cuối 1.3.10, tháng 12/2008); Struts 2 vẫn được bảo trì nhưng hiếm khi được chọn cho dự án mới</td><td><code>StrutsPrepareAndExecuteFilter</code> (một filter)</td></tr>
<tr><td>Jakarta Faces (trước là JSF)</td><td>đổi tên cùng Jakarta EE; Faces 4.0 = Jakarta EE 10, 4.1 = EE 11; do Eclipse Foundation quản, không còn là Oracle</td><td><code>FacesServlet</code> (dựa trên component)</td></tr>
</tbody>
</table>
<p>Câu về JSF trên slide không phải một lý do thật — độ dài bản đặc tả chẳng nói lên gì về framework. Khác biệt đáng nhớ: Spring MVC và Struts <em>dựa trên request</em> (đúng như bảng định tuyến của ta), còn Faces <em>dựa trên component</em> (trang là một cây thành phần giao diện có trạng thái riêng). Đây là hành động list của ta viết theo kiểu Spring Boot — bảng định tuyến thành annotation, <code>getParameter</code> thành tham số của phương thức:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/d33082a3106790305c60a83827265dd705441221.svg" alt="Cùng GET /devices trong Spring Boot: DispatcherServlet chính là DeviceController.service() của ta" loading="lazy" /><p class="chu-thich">🧩 Cùng GET /devices trong Spring Boot: DispatcherServlet chính là DeviceController.service() của ta</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 14: the same MVC in Spring Boot — the framework writes the front controller for you
participant "Browser" as B
participant "DispatcherServlet\\n(front controller)" as D
participant "DeviceController\\n@Controller" as C
participant "DeviceService\\n@Service" as S
participant "DeviceRepository\\nSpring Data JPA" as R
participant "ViewResolver\\n(Thymeleaf / JSP)" as VR
B -&gt; D : GET /devices?page=2
D -&gt; C : @GetMapping("/devices") list(q, page, model)
C -&gt; S : list(q, page)
S -&gt; R : findByNameContaining(q, pageable)
R --&gt; S : Page&lt;Device&gt;
C --&gt; D : return "device/list" (+ Model)
D -&gt; VR : resolve "device/list"
VR --&gt; B : 200 HTML
@enduml</code></pre></details>
<pre><code class="language-java">@Controller
@RequestMapping("/devices")
public class DeviceController {
    private final DeviceService service;
    public DeviceController(DeviceService service) { this.service = service; }   // Spring tiêm vào (inject)

    @GetMapping                                   // = "GET /" trong bảng định tuyến của ta
    public String list(@RequestParam(defaultValue = "") String q,
                       @RequestParam(defaultValue = "1") int page, Model model) {
        model.addAttribute("q", q);
        model.addAttribute("page", service.list(q, page));
        return "device/list";                     // = forward(VIEWS + "list.jsp")
    }

    @PostMapping("/create")                       // = "POST /create"
    public String create(@Valid DeviceForm form, BindingResult errors, RedirectAttributes flash) {
        if (errors.hasErrors()) return "device/form";
        service.save(form);
        flash.addFlashAttribute("flash", "Added " + form.getCode());   // = flash qua session của ta
        return "redirect:/devices";               // = sendRedirect (PRG)
    }
}</code></pre>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): mỗi dòng ở trên đều có một "anh em sinh đôi" trong <code>DeviceController</code> của bài này — đó chính là lý do phải tự tay dựng nó trước. API REST của LabFlow là biến thể "view JSON": <code>@RestController</code> trả về đối tượng, Jackson biến chúng thành JSON (view thứ hai của slide 9), React vẽ trang.</div>`],
      [15, 'Summary',
        `<p class="y-chinh">🎯 The deck covered: an MVC introduction (what MVC is), the MVC architecture (the Model, the View, the Controller, MVC2), the benefits, the MVC pattern and where it can be used, MVC in Java, and the frameworks. ("MCV in Java" on the slide is a typo.)</p>
<table>
<thead><tr><th>Summary line</th><th>Slides</th><th>Can you…</th></tr></thead>
<tbody>
<tr><td>What is MVC</td><td>3</td><td>say the one job of M, V and C — and what each must not do?</td></tr>
<tr><td>Model / View / Controller</td><td>5–7</td><td>point to the file of each in <code>mvc-thiet-bi</code>?</td></tr>
<tr><td>MVC2</td><td>4, 8</td><td>explain Model 1 vs Model 2 and write a front controller with 404/405?</td></tr>
<tr><td>Benefits, pattern</td><td>9–11</td><td>trace POST → 302 → GET and explain why F5 is safe; why the web has no "model alerts view"?</td></tr>
<tr><td>MVC in Java, frameworks</td><td>13–14</td><td>map our controller onto Spring's <code>@GetMapping</code>/<code>redirect:</code>?</td></tr>
</tbody>
</table>
<p>➕ Beyond the deck, this lesson added: a service layer for rules, validation with per-field errors and sticky values, flash messages, pagination that keeps the search, a second (JSON) view, views protected under <code>WEB-INF</code>. Next: the 🧪 practice 6.4 turns each into an exercise (refactor a "god servlet", PRG vs forward, XSS in a view, an unsafe front controller), then the Chapter 6 quiz.</p>`,
        `<p class="y-chinh">🎯 Deck đã học: giới thiệu MVC (MVC là gì), kiến trúc MVC (Model, View, Controller, MVC2), lợi ích, mẫu MVC và nơi dùng được, MVC trong Java, và các framework. ("MCV in Java" trên slide là gõ nhầm.)</p>
<table>
<thead><tr><th>Dòng tóm tắt</th><th>Slide</th><th>Bạn đã làm được…</th></tr></thead>
<tbody>
<tr><td>MVC là gì</td><td>3</td><td>nói được việc duy nhất của M, V, C — và mỗi cái không được làm gì?</td></tr>
<tr><td>Model / View / Controller</td><td>5–7</td><td>chỉ ra file của từng cái trong <code>mvc-thiet-bi</code>?</td></tr>
<tr><td>MVC2</td><td>4, 8</td><td>giải thích Model 1 và Model 2, viết một front controller có 404/405?</td></tr>
<tr><td>Lợi ích, khuôn mẫu</td><td>9–11</td><td>lần theo POST → 302 → GET và giải thích vì sao F5 an toàn; vì sao web không có "model báo view"?</td></tr>
<tr><td>MVC trong Java, framework</td><td>13–14</td><td>đặt controller của ta lên <code>@GetMapping</code>/<code>redirect:</code> của Spring?</td></tr>
</tbody>
</table>
<p>➕ Ngoài deck, bài này thêm: tầng service giữ luật, kiểm tra dữ liệu hiện lỗi từng ô và giữ giá trị đã gõ, thông báo flash, phân trang giữ từ khoá tìm kiếm, một view thứ hai (JSON), view được che dưới <code>WEB-INF</code>. Tiếp theo: bài 🧪 thực hành 6.4 biến từng thứ thành bài tập (tách một "servlet ôm hết", PRG và forward, XSS trong view, một front controller không an toàn), rồi tới quiz Chương 6.</p>`],
    ]),
    bi(`<h2>📌 What to take away from slides 1–15</h2>
<ul>
<li>Controller = servlet (or filter): reads the request, calls the model, chooses the view. No SQL, no HTML.</li>
<li>Model = JavaBeans + service (rules) + DAO (JDBC). No <code>jakarta.servlet</code>. The database is not "the model".</li>
<li>View = JSP + JSTL under <code>WEB-INF</code>, reached only by forward; escape user text with <code>&lt;c:out&gt;</code>.</li>
<li>Model 1 = the JSP receives the request (MVC1); Model 2 = a servlet does (MVC2).</li>
<li>Front controller = one servlet + one routing table; unknown path → 404, wrong method → 405.</li>
<li>Invalid form → forward back with errors (same request); valid POST → <strong>redirect</strong> (PRG); a message across the redirect goes in the session (flash). Request attributes die with a redirect.</li>
<li>On the web there is no "model alerts view": each request rebuilds the view.</li>
</ul>`,
    `<h2>📌 Cần mang theo gì từ slide 1–15</h2>
<ul>
<li>Controller = servlet (hoặc filter): đọc request, gọi model, chọn view. Không SQL, không HTML.</li>
<li>Model = JavaBean + service (luật) + DAO (JDBC). Không <code>jakarta.servlet</code>. CSDL không phải là "model".</li>
<li>View = JSP + JSTL dưới <code>WEB-INF</code>, chỉ tới được qua forward; thoát chữ người dùng bằng <code>&lt;c:out&gt;</code>.</li>
<li>Model 1 = JSP nhận request (MVC1); Model 2 = servlet nhận (MVC2).</li>
<li>Front controller = một servlet + một bảng định tuyến; đường dẫn lạ → 404, sai method → 405.</li>
<li>Form sai → forward về kèm lỗi (cùng request); POST hợp lệ → <strong>redirect</strong> (PRG); thông báo cần qua redirect thì để trong session (flash). Request attribute chết theo redirect.</li>
<li>Trên web không có "model báo view": mỗi request dựng lại view.</li>
</ul>`),
    books([
      ['williams', 'Ch.4 "Using JSPs to Display Content" (JSP as the view), Ch.13 "Replacing Your Servlets with Controllers" and Ch.14 "Using Services and Repositories to Support Your Controllers" (the same layers in Spring)', 'Ch.4 "Using JSPs to Display Content" (JSP làm view), Ch.13 "Replacing Your Servlets with Controllers" và Ch.14 "Using Services and Repositories to Support Your Controllers" (cùng các tầng ấy trong Spring)'],
      ['servletSpec', 'Ch.9 "Dispatching Requests" (RequestDispatcher forward/include) and Ch.12 "Mapping Requests to Servlets" (path mapping /devices/*, getPathInfo)', 'Ch.9 "Dispatching Requests" (RequestDispatcher forward/include) và Ch.12 "Mapping Requests to Servlets" (ánh xạ đường dẫn /devices/*, getPathInfo)'],
    ]),
  ].join('\n'),
};

/* ───────── 6.4 — 🧪 Practice + 🗂 Glossary + 📌 Summary · MVC: god servlet, PRG, validation & XSS, front controller, paging ───────── */
const L_on_ch6 = {
  title: '6.4 — 🧪 Practice + 🗂 Glossary + 📌 Summary · MVC: god servlet, PRG, validation & XSS, front controller, paging|||6.4 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · MVC: tách servlet, PRG, XSS, front controller, phân trang',
  slug: 'prj301-on-ch6',
  type: 'VIDEO',
  description: '7 bài tập Chương 6 có lời giải chạy thật trên Tomcat 10.1 + SQL Server: xếp từng dòng code vào đúng M/V/C, tách một servlet "ôm hết" (JDBC + luật + HTML) thành Controller → DAO → JSP và thấy view thoát HTML, forward sau POST làm F5 tạo đơn trùng còn Post/Redirect/Get thì không (kèm thông báo flash và request attribute mất sau redirect), kiểm tra form ở server hiện lỗi từng ô và giữ giá trị đã gõ — rồi một đòn XSS thật qua EL trần bị c:out chặn, một front controller dựng đường dẫn view từ request làm lộ trang admin và bản sửa bằng bảng định tuyến cố định, phân trang giữ từ khoá tìm kiếm, và thêm một action mới rồi đối chiếu với Spring MVC; 16 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.4 · Practice &amp; review</span>
<h2>MVC for real — seven exercises that turn the slides into a PE skeleton</h2>
<p class="lead">Lesson 6.A built one complete MVC app. These seven exercises take it apart: you decide where code belongs, refactor a servlet that does everything, see with real requests why a POST must end in a redirect, why a view must escape, and why a front controller must never build a path from the request. Every solution ran on Tomcat 10.1 (and SQL Server where needed); the real responses are under each exercise.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>put each line of code in M, V or C</td><td>3, 5–7</td></tr>
<tr><td>2</td><td>split a "god servlet" into Controller → DAO → JSP</td><td>4, 8</td></tr>
<tr><td>3</td><td>forward vs Post/Redirect/Get; flash message; attributes after a redirect</td><td>10</td></tr>
<tr><td>4</td><td>server-side validation, per-field errors, sticky values; XSS in a view</td><td>6, 10</td></tr>
<tr><td>5</td><td>a front controller that leaks a page, and the safe routing table</td><td>8</td></tr>
<tr><td>6</td><td>paging that keeps the search, clamped page numbers</td><td>9 (➕ Ch.6 extension, PE)</td></tr>
<tr><td>7</td><td>add an action to the front controller; the same in Spring MVC</td><td>8, 14</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 6 · Bài 6.4 · Thực hành &amp; ôn tập</span>
<h2>MVC thật sự — bảy bài tập biến slide thành bộ khung bài PE</h2>
<p class="lead">Bài 6.A đã dựng một app MVC trọn vẹn. Bảy bài tập này tháo nó ra: bạn quyết định code thuộc về đâu, tách một servlet làm tất cả mọi thứ, thấy bằng request thật vì sao một POST phải kết thúc bằng redirect, vì sao view phải thoát ký tự, và vì sao front controller không bao giờ được dựng đường dẫn từ request. Lời giải nào cũng đã chạy trên Tomcat 10.1 (và SQL Server khi cần); response thật nằm dưới từng bài.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>1</td><td>xếp mỗi dòng code vào M, V hay C</td><td>3, 5–7</td></tr>
<tr><td>2</td><td>tách một "servlet ôm hết" thành Controller → DAO → JSP</td><td>4, 8</td></tr>
<tr><td>3</td><td>forward và Post/Redirect/Get; thông báo flash; attribute sau redirect</td><td>10</td></tr>
<tr><td>4</td><td>kiểm tra dữ liệu ở server, lỗi từng ô, giữ giá trị đã gõ; XSS trong view</td><td>6, 10</td></tr>
<tr><td>5</td><td>một front controller làm lộ trang, và bảng định tuyến an toàn</td><td>8</td></tr>
<tr><td>6</td><td>phân trang giữ từ khoá tìm kiếm, kẹp số trang</td><td>9 (➕ mở rộng Ch.6, PE)</td></tr>
<tr><td>7</td><td>thêm một action vào front controller; cùng việc đó trong Spring MVC</td><td>8, 14</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — Where does this line belong? (~10 min)</h3>
<p>Each line below comes from a classmate's Assignment. Write M (model: bean, service, DAO), V (view: JSP) or C (controller: servlet) next to it — and mark ✗ the ones that are in the wrong place in their project.</p>
<table>
<thead><tr><th>#</th><th>Line (and where the classmate put it)</th></tr></thead>
<tbody>
<tr><td>a</td><td><code>ps.setString(1, "%" + q + "%");</code> — in <code>DeviceDAO</code></td></tr>
<tr><td>b</td><td><code>&lt;c:forEach items="&#36;{page.items}" var="d"&gt;</code> — in <code>list.jsp</code></td></tr>
<tr><td>c</td><td><code>if (quantity &gt; 999) errors.put("quantity", …)</code> — in <code>list.jsp</code> as a scriptlet</td></tr>
<tr><td>d</td><td><code>resp.sendRedirect(req.getContextPath() + "/devices");</code> — in <code>DeviceController</code></td></tr>
<tr><td>e</td><td><code>out.println("&lt;tr&gt;&lt;td&gt;" + d.getName() + "&lt;/td&gt;&lt;/tr&gt;");</code> — in <code>DeviceController</code></td></tr>
<tr><td>f</td><td><code>int pages = (total + size - 1) / size;</code> — in <code>Page</code></td></tr>
<tr><td>g</td><td><code>Connection con = DBContext.getConnection();</code> — in <code>list.jsp</code></td></tr>
<tr><td>h</td><td><code>req.getParameter("page")</code> — in <code>DeviceService</code></td></tr>
</tbody>
</table>
<p class="dap-an">✅ a = M (DAO) ✓ · b = V ✓ · c = M — ✗ a rule belongs in the service (<code>DeviceService.save</code>), never in a JSP · d = C ✓ (only the controller speaks HTTP) · e = V — ✗ HTML strings in a controller: forward to a JSP instead · f = M ✓ (a derived value) · g = M — ✗ a JSP must never open a connection (that is Model 1) · h = C — ✗ the service should receive an <code>int page</code>, not read the request; then it can be tested without Tomcat.</p>
<div class="pitfall">The quick test for any line: does it mention <code>HttpServletRequest</code>/<code>Response</code>, a parameter name or a status code? → controller. Does it mention SQL, a rule, or compute a value? → model. Does it produce markup? → view. Two answers for one line means the line should be split.</div>`,
    `<h3>🧪 Bài 1 — Dòng này thuộc về đâu? (~10 phút)</h3>
<p>Mỗi dòng dưới đây lấy từ Assignment của một bạn cùng lớp. Ghi M (model: bean, service, DAO), V (view: JSP) hay C (controller: servlet) bên cạnh — và đánh dấu ✗ những dòng đang nằm sai chỗ trong dự án của bạn ấy.</p>
<table>
<thead><tr><th>#</th><th>Dòng code (và chỗ bạn ấy đặt nó)</th></tr></thead>
<tbody>
<tr><td>a</td><td><code>ps.setString(1, "%" + q + "%");</code> — trong <code>DeviceDAO</code></td></tr>
<tr><td>b</td><td><code>&lt;c:forEach items="&#36;{page.items}" var="d"&gt;</code> — trong <code>list.jsp</code></td></tr>
<tr><td>c</td><td><code>if (quantity &gt; 999) errors.put("quantity", …)</code> — trong <code>list.jsp</code> dạng scriptlet</td></tr>
<tr><td>d</td><td><code>resp.sendRedirect(req.getContextPath() + "/devices");</code> — trong <code>DeviceController</code></td></tr>
<tr><td>e</td><td><code>out.println("&lt;tr&gt;&lt;td&gt;" + d.getName() + "&lt;/td&gt;&lt;/tr&gt;");</code> — trong <code>DeviceController</code></td></tr>
<tr><td>f</td><td><code>int pages = (total + size - 1) / size;</code> — trong <code>Page</code></td></tr>
<tr><td>g</td><td><code>Connection con = DBContext.getConnection();</code> — trong <code>list.jsp</code></td></tr>
<tr><td>h</td><td><code>req.getParameter("page")</code> — trong <code>DeviceService</code></td></tr>
</tbody>
</table>
<p class="dap-an">✅ a = M (DAO) ✓ · b = V ✓ · c = M — ✗ luật phải nằm trong service (<code>DeviceService.save</code>), không bao giờ trong JSP · d = C ✓ (chỉ controller nói HTTP) · e = V — ✗ chuỗi HTML trong controller: hãy forward sang JSP · f = M ✓ (một giá trị suy ra) · g = M — ✗ JSP không bao giờ được mở kết nối (đó là Model 1) · h = C — ✗ service nên nhận một <code>int page</code>, không tự đọc request; khi đó kiểm thử được mà không cần Tomcat.</p>
<div class="pitfall">Phép thử nhanh cho bất kỳ dòng nào: nó nhắc tới <code>HttpServletRequest</code>/<code>Response</code>, tên tham số hay mã trạng thái? → controller. Nó nhắc tới SQL, một luật, hay tính một giá trị? → model. Nó sinh ra thẻ HTML? → view. Một dòng mà có hai câu trả lời nghĩa là dòng đó nên được tách ra.</div>`),
    bi(`<h3>🧪 Exercise 2 — Split a "god servlet" (~20 min)</h3>
<p>This servlet works, and it is what many first Assignments look like: connection, SQL, a business rule (GPA ≥ 8 is "excellent") and HTML, all in one <code>doGet</code>. Split it into a model (<code>Student</code> with the rule, <code>StudentDAO</code> with the SQL), a controller and a JSP view. Then compare the two responses — one row has a name somebody typed with HTML inside it.</p>
<p class="ghi-chu">📄 <code>ch6-tach-mvc/src/main/java/god/GodServlet.java</code></p>
<pre class="web-src"><code class="language-java">package god;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

// BEFORE: one servlet does everything — connection, SQL, rule (gpa ≥ 8 = excellent) and HTML
@WebServlet("/god")
public class GodServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/html;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("&lt;table border=\\"1\\"&gt;&lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;GPA&lt;/th&gt;&lt;th&gt;Rank&lt;/th&gt;&lt;/tr&gt;");
        String url = "jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
                + ";databaseName=PRJ301_Ch6TachMvc;encrypt=true;trustServerCertificate=true";
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            try (Connection con = DriverManager.getConnection(url, env("DB_USER", "sa"), env("DB_PASSWORD", "sa"));
                 PreparedStatement ps = con.prepareStatement("SELECT id, name, gpa FROM Student ORDER BY id");
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    double gpa = rs.getDouble("gpa");
                    out.println("&lt;tr&gt;&lt;td&gt;" + rs.getString("name") + "&lt;/td&gt;&lt;td&gt;" + gpa + "&lt;/td&gt;&lt;td&gt;"
                            + (gpa &gt;= 8 ? "excellent" : "good") + "&lt;/td&gt;&lt;/tr&gt;");   // rule + HTML + data, mixed
                }
            }
        } catch (ClassNotFoundException | SQLException e) {
            out.println("&lt;tr&gt;&lt;td colspan=\\"3\\"&gt;" + e.getMessage() + "&lt;/td&gt;&lt;/tr&gt;");
        }
        out.println("&lt;/table&gt;");
    }

    private static String env(String k, String d) { String v = System.getenv(k); return (v == null || v.isBlank()) ? d : v; }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch6-tach-mvc/god HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;table border="1"&gt;&lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;GPA&lt;/th&gt;&lt;th&gt;Rank&lt;/th&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Nguyễn An&lt;/td&gt;&lt;td&gt;8.2&lt;/td&gt;&lt;td&gt;excellent&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Trần Bình &lt;b&gt;lớp trưởng&lt;/b&gt;&lt;/td&gt;&lt;td&gt;7.5&lt;/td&gt;&lt;td&gt;good&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Lê Chi&lt;/td&gt;&lt;td&gt;9.0&lt;/td&gt;&lt;td&gt;excellent&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;</code></pre>
<p class="dap-an">✅ The solution: the rule moves into the bean (<code>getRank()</code>), the SQL into the DAO, and the controller shrinks to "ask, set attribute, forward":</p>
<p class="ghi-chu">📄 <code>ch6-tach-mvc/src/main/java/model/Student.java</code></p>
<pre class="web-src"><code class="language-java">package model;

// Model: the data AND the rule "gpa ≥ 8 is excellent" — written once, here
public class Student {
    private final int id;
    private final String name;
    private final double gpa;

    public Student(int id, String name, double gpa) { this.id = id; this.name = name; this.gpa = gpa; }

    public int getId() { return id; }
    public String getName() { return name; }
    public double getGpa() { return gpa; }
    public String getRank() { return gpa &gt;= 8 ? "excellent" : "good"; }
}</code></pre>
<p class="ghi-chu">📄 <code>ch6-tach-mvc/src/main/java/controller/StudentController.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.StudentDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

// AFTER: the controller only asks the Model and picks the View — three lines of real work
@WebServlet("/students")
public class StudentController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            req.setAttribute("students", new StudentDAO().findAll());
        } catch (SQLException e) {
            throw new ServletException(e);
        }
        req.getRequestDispatcher("/WEB-INF/views/students.jsp").forward(req, resp);
    }
}</code></pre>
<p class="ghi-chu">📄 <code>ch6-tach-mvc/src/main/webapp/WEB-INF/views/students.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@ page contentType="text/html;charset=UTF-8" session="false" trimDirectiveWhitespaces="true" %&gt;
&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;
&lt;%-- View: HTML only; c:out escapes &lt; &gt; &amp; so a name can never become markup --%&gt;
&lt;table border="1"&gt;&lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;GPA&lt;/th&gt;&lt;th&gt;Rank&lt;/th&gt;&lt;/tr&gt;
&lt;c:forEach items="&#36;{students}" var="s"&gt;
&lt;tr&gt;&lt;td&gt;&lt;c:out value="&#36;{s.name}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{s.gpa}&lt;/td&gt;&lt;td&gt;&#36;{s.rank}&lt;/td&gt;&lt;/tr&gt;
&lt;/c:forEach&gt;
&lt;/table&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch6-tach-mvc/students HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;table border="1"&gt;&lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;GPA&lt;/th&gt;&lt;th&gt;Rank&lt;/th&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Nguyễn An&lt;/td&gt;&lt;td&gt;8.2&lt;/td&gt;&lt;td&gt;excellent&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Trần Bình &amp;lt;b&amp;gt;lớp trưởng&amp;lt;/b&amp;gt;&lt;/td&gt;&lt;td&gt;7.5&lt;/td&gt;&lt;td&gt;good&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Lê Chi&lt;/td&gt;&lt;td&gt;9.0&lt;/td&gt;&lt;td&gt;excellent&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;</code></pre>
<p>Same data, same rule — and one difference that matters: the god servlet printed <code>&lt;b&gt;lớp trưởng&lt;/b&gt;</code> raw, so the browser made it bold (the name became markup). The JSP's <code>&lt;c:out&gt;</code> escaped it to <code>&amp;lt;b&amp;gt;</code>, so the user sees exactly what was typed. Moving HTML into a view is also what makes escaping systematic.</p>
<div class="pitfall">Refactoring must not change behaviour: before splitting, save the old page's output; after, compare. Here the only change is the escaping — a deliberate fix, not an accident.</div>`,
    `<h3>🧪 Bài 2 — Tách một "servlet ôm hết" (~20 phút)</h3>
<p>Servlet này chạy được, và là dáng của rất nhiều Assignment đầu tay: kết nối, SQL, một luật nghiệp vụ (GPA ≥ 8 là "giỏi") và HTML, tất cả trong một <code>doGet</code>. Hãy tách nó thành model (<code>Student</code> giữ luật, <code>StudentDAO</code> giữ SQL), một controller và một view JSP. Rồi so hai response — có một dòng mang cái tên ai đó gõ có HTML bên trong.</p>
<p class="ghi-chu">📄 <code>ch6-tach-mvc/src/main/java/god/GodServlet.java</code></p>
<pre class="web-src"><code class="language-java">package god;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

// TRƯỚC: một servlet làm hết — kết nối, SQL, luật (gpa ≥ 8 = giỏi) và HTML
@WebServlet("/god")
public class GodServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/html;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("&lt;table border=\\"1\\"&gt;&lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;GPA&lt;/th&gt;&lt;th&gt;Rank&lt;/th&gt;&lt;/tr&gt;");
        String url = "jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
                + ";databaseName=PRJ301_Ch6TachMvc;encrypt=true;trustServerCertificate=true";
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            try (Connection con = DriverManager.getConnection(url, env("DB_USER", "sa"), env("DB_PASSWORD", "sa"));
                 PreparedStatement ps = con.prepareStatement("SELECT id, name, gpa FROM Student ORDER BY id");
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    double gpa = rs.getDouble("gpa");
                    out.println("&lt;tr&gt;&lt;td&gt;" + rs.getString("name") + "&lt;/td&gt;&lt;td&gt;" + gpa + "&lt;/td&gt;&lt;td&gt;"
                            + (gpa &gt;= 8 ? "excellent" : "good") + "&lt;/td&gt;&lt;/tr&gt;");   // luật + HTML + dữ liệu, trộn lẫn
                }
            }
        } catch (ClassNotFoundException | SQLException e) {
            out.println("&lt;tr&gt;&lt;td colspan=\\"3\\"&gt;" + e.getMessage() + "&lt;/td&gt;&lt;/tr&gt;");
        }
        out.println("&lt;/table&gt;");
    }

    private static String env(String k, String d) { String v = System.getenv(k); return (v == null || v.isBlank()) ? d : v; }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch6-tach-mvc/god HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;table border="1"&gt;&lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;GPA&lt;/th&gt;&lt;th&gt;Rank&lt;/th&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Nguyễn An&lt;/td&gt;&lt;td&gt;8.2&lt;/td&gt;&lt;td&gt;excellent&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Trần Bình &lt;b&gt;lớp trưởng&lt;/b&gt;&lt;/td&gt;&lt;td&gt;7.5&lt;/td&gt;&lt;td&gt;good&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Lê Chi&lt;/td&gt;&lt;td&gt;9.0&lt;/td&gt;&lt;td&gt;excellent&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;</code></pre>
<p class="dap-an">✅ Lời giải: luật chuyển vào bean (<code>getRank()</code>), SQL chuyển vào DAO, và controller co lại còn "hỏi, đặt attribute, forward":</p>
<p class="ghi-chu">📄 <code>ch6-tach-mvc/src/main/java/model/Student.java</code></p>
<pre class="web-src"><code class="language-java">package model;

// Model: dữ liệu VÀ luật "gpa ≥ 8 là giỏi" — viết một lần, ở đây
public class Student {
    private final int id;
    private final String name;
    private final double gpa;

    public Student(int id, String name, double gpa) { this.id = id; this.name = name; this.gpa = gpa; }

    public int getId() { return id; }
    public String getName() { return name; }
    public double getGpa() { return gpa; }
    public String getRank() { return gpa &gt;= 8 ? "excellent" : "good"; }
}</code></pre>
<p class="ghi-chu">📄 <code>ch6-tach-mvc/src/main/java/controller/StudentController.java</code></p>
<pre class="web-src"><code class="language-java">package controller;

import dal.StudentDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

// SAU: controller chỉ hỏi Model và chọn View — ba dòng việc thật
@WebServlet("/students")
public class StudentController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            req.setAttribute("students", new StudentDAO().findAll());
        } catch (SQLException e) {
            throw new ServletException(e);
        }
        req.getRequestDispatcher("/WEB-INF/views/students.jsp").forward(req, resp);
    }
}</code></pre>
<p class="ghi-chu">📄 <code>ch6-tach-mvc/src/main/webapp/WEB-INF/views/students.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@ page contentType="text/html;charset=UTF-8" session="false" trimDirectiveWhitespaces="true" %&gt;
&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;
&lt;%-- View: chỉ HTML; c:out thoát &lt; &gt; &amp; nên một cái tên không bao giờ thành thẻ HTML --%&gt;
&lt;table border="1"&gt;&lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;GPA&lt;/th&gt;&lt;th&gt;Rank&lt;/th&gt;&lt;/tr&gt;
&lt;c:forEach items="&#36;{students}" var="s"&gt;
&lt;tr&gt;&lt;td&gt;&lt;c:out value="&#36;{s.name}"/&gt;&lt;/td&gt;&lt;td&gt;&#36;{s.gpa}&lt;/td&gt;&lt;td&gt;&#36;{s.rank}&lt;/td&gt;&lt;/tr&gt;
&lt;/c:forEach&gt;
&lt;/table&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch6-tach-mvc/students HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;table border="1"&gt;&lt;tr&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;GPA&lt;/th&gt;&lt;th&gt;Rank&lt;/th&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Nguyễn An&lt;/td&gt;&lt;td&gt;8.2&lt;/td&gt;&lt;td&gt;excellent&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Trần Bình &amp;lt;b&amp;gt;lớp trưởng&amp;lt;/b&amp;gt;&lt;/td&gt;&lt;td&gt;7.5&lt;/td&gt;&lt;td&gt;good&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;Lê Chi&lt;/td&gt;&lt;td&gt;9.0&lt;/td&gt;&lt;td&gt;excellent&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;</code></pre>
<p>Cùng dữ liệu, cùng luật — và một khác biệt quan trọng: servlet ôm hết in nguyên <code>&lt;b&gt;lớp trưởng&lt;/b&gt;</code>, nên trình duyệt in đậm nó (cái tên biến thành thẻ HTML). <code>&lt;c:out&gt;</code> của JSP thoát nó thành <code>&amp;lt;b&amp;gt;</code>, nên người dùng thấy đúng chữ đã gõ. Dồn HTML vào view cũng là cách làm cho việc thoát ký tự trở thành nếp chung.</p>
<div class="pitfall">Tái cấu trúc (refactor) không được đổi hành vi: trước khi tách, lưu output của trang cũ; sau đó, so lại. Ở đây thay đổi duy nhất là việc thoát ký tự — một chỗ sửa có chủ ý, không phải tai nạn.</div>`),
    bi(`<h3>🧪 Exercise 3 — Forward or redirect after a POST? (~15 min)</h3>
<p>Two servlets save an order. The first ends with <code>forward</code> to the result page; the second with <code>sendRedirect</code>. Predict what happens when the user presses F5 on the result page (the browser re-sends the last request), then check. The "store" counts every order.</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch6-prg/order-forward HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 14

item=Kit+ESP32</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;msg = [Ordered Kit ESP32] · flash = []&lt;/p&gt;
&lt;p&gt;Orders in the store: 1 → Kit ESP32&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch6-prg/order-forward HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 14

item=Kit+ESP32</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;msg = [Ordered Kit ESP32] · flash = []&lt;/p&gt;
&lt;p&gt;Orders in the store: 2 → Kit ESP32, Kit ESP32&lt;/p&gt;</code></pre>
<p class="dap-an">✅ With forward, the page the user sees is the answer to a <strong>POST</strong>; F5 re-sends that POST and a second "Kit ESP32" order appears (the browser even warns "Confirm form resubmission"). With Post/Redirect/Get, the POST answers 302, the page is the answer to a <strong>GET</strong>, and F5 is harmless:</p>
<p class="ghi-chu">📄 <code>ch6-prg/src/main/java/controller/OrderPrgServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    OrderStore.of(getServletContext()).add(req.getParameter("item"));
    req.setAttribute("msg", "lost after the redirect");                   // a REQUEST attribute dies with this request
    req.getSession().setAttribute("flash", "Ordered " + req.getParameter("item"));   // the SESSION survives to the next request
    resp.sendRedirect(req.getContextPath() + "/orders");                 // 302 ⇒ the browser GETs /orders
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch6-prg/order-prg HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 12

item=Arduino</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…; Path=/ch6-prg; HttpOnly
Location: /ch6-prg/orders
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch6-prg/orders HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;msg = [] · flash = [Ordered Arduino]&lt;/p&gt;
&lt;p&gt;Orders in the store: 3 → Kit ESP32, Kit ESP32, Arduino&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch6-prg/orders HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;msg = [] · flash = []&lt;/p&gt;
&lt;p&gt;Orders in the store: 3 → Kit ESP32, Kit ESP32, Arduino&lt;/p&gt;</code></pre>
<p>Two more things to read in these responses: <code>msg</code>, set as a <em>request</em> attribute before the redirect, is empty on the GET — it died with the POST; the <em>session</em> flash "Ordered Arduino" survived the redirect, was shown once, and is gone on F5. Still 3 orders.</p>
<div class="pitfall">FE question type: "What happens to request attributes when <code>sendRedirect()</code> is used?" → they are lost. And "Which is true about <code>sendRedirect()</code>?" → it changes the URL in the browser (forward does not). Rule for the PE: invalid form → forward back to the form; successful save → redirect.</div>`,
    `<h3>🧪 Bài 3 — Forward hay redirect sau một POST? (~15 phút)</h3>
<p>Hai servlet cùng lưu một đơn hàng. Cái thứ nhất kết thúc bằng <code>forward</code> sang trang kết quả; cái thứ hai bằng <code>sendRedirect</code>. Đoán chuyện gì xảy ra khi người dùng bấm F5 ở trang kết quả (trình duyệt gửi lại request cuối cùng), rồi kiểm tra. "Kho" đếm mọi đơn.</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch6-prg/order-forward HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 14

item=Kit+ESP32</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;msg = [Ordered Kit ESP32] · flash = []&lt;/p&gt;
&lt;p&gt;Orders in the store: 1 → Kit ESP32&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch6-prg/order-forward HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 14

item=Kit+ESP32</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;msg = [Ordered Kit ESP32] · flash = []&lt;/p&gt;
&lt;p&gt;Orders in the store: 2 → Kit ESP32, Kit ESP32&lt;/p&gt;</code></pre>
<p class="dap-an">✅ Với forward, trang người dùng thấy là câu trả lời cho một <strong>POST</strong>; F5 gửi lại cái POST đó và một đơn "Kit ESP32" thứ hai xuất hiện (trình duyệt còn cảnh báo "Confirm form resubmission" — xác nhận gửi lại form). Với Post/Redirect/Get, POST trả 302, trang là câu trả lời cho một <strong>GET</strong>, và F5 vô hại:</p>
<p class="ghi-chu">📄 <code>ch6-prg/src/main/java/controller/OrderPrgServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    OrderStore.of(getServletContext()).add(req.getParameter("item"));
    req.setAttribute("msg", "lost after the redirect");                   // attribute của REQUEST chết theo request này
    req.getSession().setAttribute("flash", "Ordered " + req.getParameter("item"));   // SESSION sống sang request kế
    resp.sendRedirect(req.getContextPath() + "/orders");                 // 302 ⇒ trình duyệt GET /orders
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch6-prg/order-prg HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 12

item=Arduino</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…; Path=/ch6-prg; HttpOnly
Location: /ch6-prg/orders
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch6-prg/orders HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;msg = [] · flash = [Ordered Arduino]&lt;/p&gt;
&lt;p&gt;Orders in the store: 3 → Kit ESP32, Kit ESP32, Arduino&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch6-prg/orders HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;msg = [] · flash = []&lt;/p&gt;
&lt;p&gt;Orders in the store: 3 → Kit ESP32, Kit ESP32, Arduino&lt;/p&gt;</code></pre>
<p>Hai điều nữa cần đọc trong các response này: <code>msg</code>, đặt làm attribute của <em>request</em> trước khi redirect, rỗng ở lần GET — nó chết cùng cái POST; còn flash trong <em>session</em> "Ordered Arduino" sống qua được redirect, hiện một lần, và biến mất khi F5. Vẫn 3 đơn.</p>
<div class="pitfall">Dạng câu FE: "Request attribute ra sao khi dùng <code>sendRedirect()</code>?" → bị mất. Và "Phát biểu nào đúng về <code>sendRedirect()</code>?" → nó đổi URL trên trình duyệt (forward thì không). Luật cho PE: form sai → forward về form; lưu thành công → redirect.</div>`),
    bi(`<h3>🧪 Exercise 4 — Validate on the server, show errors per field, and escape (~20 min)</h3>
<p>A registration form: name 2–50 characters, a valid email, age 16–60. Put the rules in the <em>model</em>, return one message per field, and send the typed values back so the user does not retype everything. Then a second question: what does the view do with a name like <code>&lt;script&gt;alert(document.cookie)&lt;/script&gt;"&gt;</code>?</p>
<p class="ghi-chu">📄 <code>ch6-dang-ky/src/main/java/model/Registration.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public Map&lt;String, String&gt; validate() {
    Map&lt;String, String&gt; e = new LinkedHashMap&lt;&gt;();
    if (name.length() &lt; 2 || name.length() &gt; 50) e.put("name", "Name: 2–50 characters");
    if (!email.matches("[^@\\\\s]+@[^@\\\\s]+\\\\.[a-z]{2,}")) e.put("email", "Email is not valid");
    try {
        int a = Integer.parseInt(age);
        if (a &lt; 16 || a &gt; 60) e.put("age", "Age must be 16–60");
    } catch (NumberFormatException ex) {
        e.put("age", "Age must be a number");
    }
    return e;
}</code></pre>
<p class="ghi-chu">📄 <code>ch6-dang-ky/src/main/java/controller/RegisterServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    Registration r = new Registration(req.getParameter("name"), req.getParameter("email"), req.getParameter("age"));
    Map&lt;String, String&gt; errors = r.validate();
    if (errors.isEmpty()) {
        resp.sendRedirect(req.getContextPath() + "/register?ok=1");          // PRG
        return;
    }
    req.setAttribute("reg", r);                                             // sticky: the typed values go back
    req.setAttribute("errors", errors);
    String view = req.getServletPath().equals("/register-raw") ? "form-raw.jsp" : "form.jsp";
    req.getRequestDispatcher("/WEB-INF/views/" + view).forward(req, resp);
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch6-dang-ky/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

name=A&amp;email=an%40fpt&amp;age=15</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;form method="post" action="register"&gt;
  &lt;input name="name" value="A"&gt; &lt;span class="error"&gt;Name: 2–50 characters&lt;/span&gt;&lt;br&gt;
  &lt;input name="email" value="an@fpt"&gt; &lt;span class="error"&gt;Email is not valid&lt;/span&gt;&lt;br&gt;
  &lt;input name="age" value="15"&gt; &lt;span class="error"&gt;Age must be 16–60&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Register&lt;/button&gt;
&lt;/form&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch6-dang-ky/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 66

name=Ho%C3%A0ng+C%C6%B0%E1%BB%9Dng&amp;email=cuong%40fpt.edu.vn&amp;age=20</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /ch6-dang-ky/register?ok=1
Content-Length: 0</code></pre>
<p class="dap-an">✅ Three errors, each beside its own field, and the three values kept. A valid submit redirects (PRG). Now the attack, against a view that writes plain EL <code>&#36;{reg.name}</code>, and against the one that uses <code>&lt;c:out&gt;</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch6-dang-ky/register-raw HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 74

name=%3Cscript%3Ealert(document.cookie)%3C%2Fscript%3E%22%3E&amp;email=x&amp;age=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;You typed: &lt;script&gt;alert(document.cookie)&lt;/script&gt;"&gt;&lt;/p&gt;
&lt;form method="post" action="register-raw"&gt;
  &lt;input name="name" value="&lt;script&gt;alert(document.cookie)&lt;/script&gt;"&gt;"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Register&lt;/button&gt;
&lt;/form&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ch6-dang-ky/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 74

name=%3Cscript%3Ealert(document.cookie)%3C%2Fscript%3E%22%3E&amp;email=x&amp;age=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;form method="post" action="register"&gt;
  &lt;input name="name" value="&amp;lt;script&amp;gt;alert(document.cookie)&amp;lt;/script&amp;gt;&amp;#034;&amp;gt;"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;input name="email" value="x"&gt; &lt;span class="error"&gt;Email is not valid&lt;/span&gt;&lt;br&gt;
  &lt;input name="age" value="x"&gt; &lt;span class="error"&gt;Age must be a number&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Register&lt;/button&gt;
&lt;/form&gt;</code></pre>
<p>Plain EL does <strong>not</strong> escape: the <code>&lt;script&gt;</code> lands in the page as code (a browser would run it and could send the session cookie away), and the <code>"&gt;</code> even breaks out of the <code>value="…"</code> attribute. <code>&lt;c:out&gt;</code> (or <code>fn:escapeXml</code>) turns <code>&lt; &gt; " </code> into <code>&amp;lt; &amp;gt; &amp;#034;</code> — harmless text.</p>
<div class="pitfall">Two separate defences, both needed: <strong>validation</strong> (in the model) rejects bad data; <strong>escaping</strong> (in the view) makes any text safe to display — even valid text such as a company called "A&amp;B &lt;Ltd&gt;". Client-side checks (HTML <code>required</code>, JavaScript) are a convenience only: a request can be sent without the browser, exactly as these runs did.</div>`,
    `<h3>🧪 Bài 4 — Kiểm tra ở server, hiện lỗi từng ô, và thoát ký tự (~20 phút)</h3>
<p>Một form đăng ký: tên 2–50 ký tự, email hợp lệ, tuổi 16–60. Đặt luật trong <em>model</em>, trả về mỗi ô một thông báo, và gửi lại giá trị đã gõ để người dùng không phải gõ lại từ đầu. Rồi câu hỏi thứ hai: view làm gì với một cái tên như <code>&lt;script&gt;alert(document.cookie)&lt;/script&gt;"&gt;</code>?</p>
<p class="ghi-chu">📄 <code>ch6-dang-ky/src/main/java/model/Registration.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public Map&lt;String, String&gt; validate() {
    Map&lt;String, String&gt; e = new LinkedHashMap&lt;&gt;();
    if (name.length() &lt; 2 || name.length() &gt; 50) e.put("name", "Name: 2–50 characters");
    if (!email.matches("[^@\\\\s]+@[^@\\\\s]+\\\\.[a-z]{2,}")) e.put("email", "Email is not valid");
    try {
        int a = Integer.parseInt(age);
        if (a &lt; 16 || a &gt; 60) e.put("age", "Age must be 16–60");
    } catch (NumberFormatException ex) {
        e.put("age", "Age must be a number");
    }
    return e;
}</code></pre>
<p class="ghi-chu">📄 <code>ch6-dang-ky/src/main/java/controller/RegisterServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    Registration r = new Registration(req.getParameter("name"), req.getParameter("email"), req.getParameter("age"));
    Map&lt;String, String&gt; errors = r.validate();
    if (errors.isEmpty()) {
        resp.sendRedirect(req.getContextPath() + "/register?ok=1");          // PRG
        return;
    }
    req.setAttribute("reg", r);                                             // form dính: giá trị đã gõ được trả lại
    req.setAttribute("errors", errors);
    String view = req.getServletPath().equals("/register-raw") ? "form-raw.jsp" : "form.jsp";
    req.getRequestDispatcher("/WEB-INF/views/" + view).forward(req, resp);
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch6-dang-ky/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 28

name=A&amp;email=an%40fpt&amp;age=15</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;form method="post" action="register"&gt;
  &lt;input name="name" value="A"&gt; &lt;span class="error"&gt;Name: 2–50 characters&lt;/span&gt;&lt;br&gt;
  &lt;input name="email" value="an@fpt"&gt; &lt;span class="error"&gt;Email is not valid&lt;/span&gt;&lt;br&gt;
  &lt;input name="age" value="15"&gt; &lt;span class="error"&gt;Age must be 16–60&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Register&lt;/button&gt;
&lt;/form&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch6-dang-ky/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 66

name=Ho%C3%A0ng+C%C6%B0%E1%BB%9Dng&amp;email=cuong%40fpt.edu.vn&amp;age=20</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /ch6-dang-ky/register?ok=1
Content-Length: 0</code></pre>
<p class="dap-an">✅ Ba lỗi, mỗi lỗi cạnh đúng ô của nó, và ba giá trị được giữ lại. Gửi hợp lệ thì chuyển hướng (PRG). Giờ tới đòn tấn công, nhắm vào một view viết EL trần <code>&#36;{reg.name}</code>, và vào view dùng <code>&lt;c:out&gt;</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch6-dang-ky/register-raw HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 74

name=%3Cscript%3Ealert(document.cookie)%3C%2Fscript%3E%22%3E&amp;email=x&amp;age=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;You typed: &lt;script&gt;alert(document.cookie)&lt;/script&gt;"&gt;&lt;/p&gt;
&lt;form method="post" action="register-raw"&gt;
  &lt;input name="name" value="&lt;script&gt;alert(document.cookie)&lt;/script&gt;"&gt;"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Register&lt;/button&gt;
&lt;/form&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ch6-dang-ky/register HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 74

name=%3Cscript%3Ealert(document.cookie)%3C%2Fscript%3E%22%3E&amp;email=x&amp;age=x</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;form method="post" action="register"&gt;
  &lt;input name="name" value="&amp;lt;script&amp;gt;alert(document.cookie)&amp;lt;/script&amp;gt;&amp;#034;&amp;gt;"&gt; &lt;span class="error"&gt;&lt;/span&gt;&lt;br&gt;
  &lt;input name="email" value="x"&gt; &lt;span class="error"&gt;Email is not valid&lt;/span&gt;&lt;br&gt;
  &lt;input name="age" value="x"&gt; &lt;span class="error"&gt;Age must be a number&lt;/span&gt;&lt;br&gt;
  &lt;button&gt;Register&lt;/button&gt;
&lt;/form&gt;</code></pre>
<p>EL trần <strong>không</strong> thoát ký tự: thẻ <code>&lt;script&gt;</code> rơi vào trang dưới dạng code (trình duyệt sẽ chạy nó và có thể gửi cookie phiên đi nơi khác — tấn công XSS), và cụm <code>"&gt;</code> còn phá vỡ thuộc tính <code>value="…"</code>. <code>&lt;c:out&gt;</code> (hoặc <code>fn:escapeXml</code>) biến <code>&lt; &gt; " </code> thành <code>&amp;lt; &amp;gt; &amp;#034;</code> — chữ vô hại.</p>
<div class="pitfall">Hai lớp phòng thủ riêng biệt, cần cả hai: <strong>kiểm tra dữ liệu</strong> (ở model) từ chối dữ liệu xấu; <strong>thoát ký tự</strong> (ở view) làm mọi chữ an toàn khi hiển thị — kể cả chữ hợp lệ như tên công ty "A&amp;B &lt;Ltd&gt;". Kiểm tra phía trình duyệt (thuộc tính <code>required</code>, JavaScript) chỉ để tiện: một request có thể gửi mà không cần trình duyệt, đúng như các lần chạy ở đây.</div>`),
    bi(`<h3>🧪 Exercise 5 — The front controller that leaks a page (~15 min)</h3>
<p>A classmate wrote a "generic" front controller so that adding a page needs no Java at all. What can an anonymous visitor reach with it? There is an admin page at <code>/WEB-INF/views/admin/users.jsp</code>.</p>
<p class="ghi-chu">📄 <code>ch6-front/src/main/java/controller/LazyFrontController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String action = req.getParameter("action");                      // "home", "about"… or "admin/users"
    req.getRequestDispatcher("/WEB-INF/views/" + action + ".jsp").forward(req, resp);
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch6-front/lazy?action=home HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;Home page&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch6-front/lazy?action=admin/users HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8



&lt;p&gt;ADMIN · user list: admin / teacher01 / student42 (password reset links…)&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch6-front/lazy HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 761

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message JSP file [/WEB-INF/views/null.jsp] not found
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="dap-an">✅ <code>?action=admin/users</code> reaches the admin page without any login: <code>forward</code> runs on the server, so <code>WEB-INF</code> does not protect a JSP from a controller that forwards anywhere it is told. And a missing action shows the internal path <code>/WEB-INF/views/null.jsp</code> to the visitor. The fix: a fixed table — only listed actions exist:</p>
<p class="ghi-chu">📄 <code>ch6-front/src/main/java/controller/SafeFrontController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private static final Map&lt;String, String&gt; VIEWS = Map.of(
        "home",  "/WEB-INF/views/home.jsp",
        "about", "/WEB-INF/views/about.jsp");</code></pre>
<p class="ghi-chu">📄 <code>ch6-front/src/main/java/controller/SafeFrontController.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String action = req.getParameter("action") == null ? "home" : req.getParameter("action");
    String view = VIEWS.get(action);
    if (view == null) { resp.sendError(404, "Unknown action"); return; }
    req.setAttribute("action", action);
    req.getRequestDispatcher(view).forward(req, resp);
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch6-front/safe?action=home HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;Home page&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ch6-front/safe?action=admin/users HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 719

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message Unknown action
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<div class="pitfall">Never concatenate a request value into a path — a view path, a file path, an <code>include</code>. It is the same mistake as concatenating into SQL (Practice 5.5): the fix is always a whitelist. Our <code>DeviceController</code> from 6.A uses the same idea (<code>routes</code> map). An admin page also needs a role check — that is the Filter of Chapter 8.</div>`,
    `<h3>🧪 Bài 5 — Front controller làm lộ trang (~15 phút)</h3>
<p>Một bạn cùng lớp viết một front controller "đa năng" để thêm trang không cần viết Java. Một người vào trang không đăng nhập thì tới được những gì? Có một trang admin ở <code>/WEB-INF/views/admin/users.jsp</code>.</p>
<p class="ghi-chu">📄 <code>ch6-front/src/main/java/controller/LazyFrontController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String action = req.getParameter("action");                      // "home", "about"… hoặc "admin/users"
    req.getRequestDispatcher("/WEB-INF/views/" + action + ".jsp").forward(req, resp);
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch6-front/lazy?action=home HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;Home page&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch6-front/lazy?action=admin/users HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8



&lt;p&gt;ADMIN · user list: admin / teacher01 / student42 (password reset links…)&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch6-front/lazy HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 761

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message JSP file [/WEB-INF/views/null.jsp] not found
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="dap-an">✅ <code>?action=admin/users</code> tới được trang admin mà không cần đăng nhập: <code>forward</code> chạy trên server, nên <code>WEB-INF</code> không che được JSP trước một controller chịu forward tới bất cứ đâu nó được bảo. Còn thiếu action thì lộ luôn đường dẫn nội bộ <code>/WEB-INF/views/null.jsp</code> cho người lạ. Cách sửa: một bảng cố định — chỉ action có trong danh sách mới tồn tại:</p>
<p class="ghi-chu">📄 <code>ch6-front/src/main/java/controller/SafeFrontController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private static final Map&lt;String, String&gt; VIEWS = Map.of(
        "home",  "/WEB-INF/views/home.jsp",
        "about", "/WEB-INF/views/about.jsp");</code></pre>
<p class="ghi-chu">📄 <code>ch6-front/src/main/java/controller/SafeFrontController.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String action = req.getParameter("action") == null ? "home" : req.getParameter("action");
    String view = VIEWS.get(action);
    if (view == null) { resp.sendError(404, "Unknown action"); return; }
    req.setAttribute("action", action);
    req.getRequestDispatcher(view).forward(req, resp);
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch6-front/safe?action=home HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;p&gt;Home page&lt;/p&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ch6-front/safe?action=admin/users HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 719

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message Unknown action
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<div class="pitfall">Không bao giờ nối giá trị từ request vào một đường dẫn — đường dẫn view, đường dẫn file, một <code>include</code>. Đó là cùng lỗi với việc nối vào SQL (Thực hành 5.5): cách sửa lúc nào cũng là danh sách trắng (whitelist). <code>DeviceController</code> ở bài 6.A dùng đúng ý đó (map <code>routes</code>). Trang admin còn cần kiểm vai trò — đó là Filter của Chương 8.</div>`),
    bi(`<h3>🧪 Exercise 6 — Paging that keeps the search (~15 min)</h3>
<p>The SQL for one page (<code>OFFSET ? ROWS FETCH NEXT ? ROWS ONLY</code>) was Practice 5.5, exercise 6 — here the question is the MVC side. (a) Who clamps <code>?page=99</code> and <code>?page=abc</code> — controller, service or JSP? (b) The user searched "Cisco" and clicks page 2: how does the link remember the search?</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/service/DeviceService.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">public Page&lt;Device&gt; list(String q, int page) throws SQLException {
    String query = q == null ? "" : q.trim();
    int total = devices.count(query);
    int pages = Math.max(1, (total + PAGE_SIZE - 1) / PAGE_SIZE);
    int number = Math.min(Math.max(page, 1), pages);                 // ?page=0 ⇒ 1, ?page=99 ⇒ last
    List&lt;Device&gt; items = devices.findPage(query, (number - 1) * PAGE_SIZE, PAGE_SIZE);
    return new Page&lt;&gt;(items, number, PAGE_SIZE, total);
}</code></pre>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/webapp/WEB-INF/views/device/list.jsp</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-html">&lt;p&gt;Page &#36;{page.number}/&#36;{page.totalPages} · &#36;{page.total} device(s)
  &lt;c:forEach begin="1" end="&#36;{page.totalPages}" var="i"&gt;
    &lt;c:url var="link" value="/devices"&gt;&lt;c:param name="q" value="&#36;{q}"/&gt;&lt;c:param name="page" value="&#36;{i}"/&gt;&lt;/c:url&gt;
    &lt;c:choose&gt;
      &lt;c:when test="&#36;{i == page.number}"&gt;&lt;strong&gt;[&#36;{i}]&lt;/strong&gt;&lt;/c:when&gt;
      &lt;c:otherwise&gt;&lt;a href="&#36;{link}"&gt;&#36;{i}&lt;/a&gt;&lt;/c:otherwise&gt;
    &lt;/c:choose&gt;&#36;{" "}
  &lt;/c:forEach&gt;
&lt;/p&gt;</code></pre>
<p class="dap-an">✅ (a) The controller only turns text into a number (<code>parseInt(…, 1)</code> — "abc" becomes 1); the <strong>service</strong> clamps to 1…totalPages, because "a page number is valid" is a rule. <code>?page=99</code> shows the last page:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices?page=99 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Lab devices&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices" method="get"&gt;
  &lt;input name="q" value="" placeholder="name contains…"&gt; &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;RPI-01&lt;/td&gt;&lt;td&gt;Raspberry Pi 4&lt;/td&gt;&lt;td&gt;10&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=9"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SEN-01&lt;/td&gt;&lt;td&gt;Bộ cảm biến 37 món&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=10"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;ARD-01&lt;/td&gt;&lt;td&gt;Arduino Uno R3&lt;/td&gt;&lt;td&gt;15&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=11"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 3/3 · 11 device(s)
  &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=1"&gt;1&lt;/a&gt; &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=2"&gt;2&lt;/a&gt; &lt;strong&gt;[3]&lt;/strong&gt; &lt;/p&gt;
&lt;a href="/mvc-thiet-bi/devices/new"&gt;Add a device&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>(b) Every page link is built with <code>&lt;c:url&gt;</code> + <code>&lt;c:param name="q"&gt;</code>, which adds the context path and URL-encodes the value (spaces, Vietnamese letters). Page 2 of the full list and the "Cisco" search:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices?page=2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Lab devices&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices" method="get"&gt;
  &lt;input name="q" value="" placeholder="name contains…"&gt; &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;RTR-01&lt;/td&gt;&lt;td&gt;Router Cisco 2901&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Lab Mạng&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=5"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SWI-01&lt;/td&gt;&lt;td&gt;Switch Cisco 2960&lt;/td&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;Lab Mạng&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=6"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;CAB-01&lt;/td&gt;&lt;td&gt;Bộ bấm cáp mạng&lt;/td&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;Lab Mạng&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=7"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;ESP-01&lt;/td&gt;&lt;td&gt;Kit ESP32&lt;/td&gt;&lt;td&gt;20&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=8"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 2/3 · 11 device(s)
  &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=1"&gt;1&lt;/a&gt; &lt;strong&gt;[2]&lt;/strong&gt; &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=3"&gt;3&lt;/a&gt; &lt;/p&gt;
&lt;a href="/mvc-thiet-bi/devices/new"&gt;Add a device&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices?q=Cisco HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Lab devices&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices" method="get"&gt;
  &lt;input name="q" value="Cisco" placeholder="name contains…"&gt; &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;RTR-01&lt;/td&gt;&lt;td&gt;Router Cisco 2901&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Lab Mạng&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=5"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SWI-01&lt;/td&gt;&lt;td&gt;Switch Cisco 2960&lt;/td&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;Lab Mạng&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=6"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 1/1 · 2 device(s)
  &lt;strong&gt;[1]&lt;/strong&gt; &lt;/p&gt;
&lt;a href="/mvc-thiet-bi/devices/new"&gt;Add a device&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<div class="pitfall">Two classic paging bugs: <code>total / size</code> in integer arithmetic (11 / 4 = 2 — the last 3 devices vanish; use <code>(total + size - 1) / size</code>), and page links that forget <code>q</code> (page 2 silently shows the unfiltered list). Both are visible above only because the response was checked, not guessed.</div>`,
    `<h3>🧪 Bài 6 — Phân trang mà vẫn giữ tìm kiếm (~15 phút)</h3>
<p>Câu SQL cho một trang (<code>OFFSET ? ROWS FETCH NEXT ? ROWS ONLY</code>) đã có ở Thực hành 5.5, bài 6 — ở đây câu hỏi là phía MVC. (a) Ai kẹp <code>?page=99</code> và <code>?page=abc</code> — controller, service hay JSP? (b) Người dùng tìm "Cisco" rồi bấm trang 2: liên kết nhớ từ khoá bằng cách nào?</p>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/java/service/DeviceService.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">public Page&lt;Device&gt; list(String q, int page) throws SQLException {
    String query = q == null ? "" : q.trim();
    int total = devices.count(query);
    int pages = Math.max(1, (total + PAGE_SIZE - 1) / PAGE_SIZE);
    int number = Math.min(Math.max(page, 1), pages);                 // ?page=0 ⇒ 1, ?page=99 ⇒ trang cuối
    List&lt;Device&gt; items = devices.findPage(query, (number - 1) * PAGE_SIZE, PAGE_SIZE);
    return new Page&lt;&gt;(items, number, PAGE_SIZE, total);
}</code></pre>
<p class="ghi-chu">📄 <code>mvc-thiet-bi/src/main/webapp/WEB-INF/views/device/list.jsp</code> (trích)</p>
<pre class="web-src trich"><code class="language-html">&lt;p&gt;Page &#36;{page.number}/&#36;{page.totalPages} · &#36;{page.total} device(s)
  &lt;c:forEach begin="1" end="&#36;{page.totalPages}" var="i"&gt;
    &lt;c:url var="link" value="/devices"&gt;&lt;c:param name="q" value="&#36;{q}"/&gt;&lt;c:param name="page" value="&#36;{i}"/&gt;&lt;/c:url&gt;
    &lt;c:choose&gt;
      &lt;c:when test="&#36;{i == page.number}"&gt;&lt;strong&gt;[&#36;{i}]&lt;/strong&gt;&lt;/c:when&gt;
      &lt;c:otherwise&gt;&lt;a href="&#36;{link}"&gt;&#36;{i}&lt;/a&gt;&lt;/c:otherwise&gt;
    &lt;/c:choose&gt;&#36;{" "}
  &lt;/c:forEach&gt;
&lt;/p&gt;</code></pre>
<p class="dap-an">✅ (a) Controller chỉ biến chữ thành số (<code>parseInt(…, 1)</code> — "abc" thành 1); <strong>service</strong> kẹp vào khoảng 1…tổng số trang, vì "số trang hợp lệ" là một luật. <code>?page=99</code> hiện trang cuối:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices?page=99 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Lab devices&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices" method="get"&gt;
  &lt;input name="q" value="" placeholder="name contains…"&gt; &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;RPI-01&lt;/td&gt;&lt;td&gt;Raspberry Pi 4&lt;/td&gt;&lt;td&gt;10&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=9"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SEN-01&lt;/td&gt;&lt;td&gt;Bộ cảm biến 37 món&lt;/td&gt;&lt;td&gt;5&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=10"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;ARD-01&lt;/td&gt;&lt;td&gt;Arduino Uno R3&lt;/td&gt;&lt;td&gt;15&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=11"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 3/3 · 11 device(s)
  &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=1"&gt;1&lt;/a&gt; &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=2"&gt;2&lt;/a&gt; &lt;strong&gt;[3]&lt;/strong&gt; &lt;/p&gt;
&lt;a href="/mvc-thiet-bi/devices/new"&gt;Add a device&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>(b) Mọi liên kết trang dựng bằng <code>&lt;c:url&gt;</code> + <code>&lt;c:param name="q"&gt;</code>, thẻ này tự thêm context path và mã hoá URL cho giá trị (dấu cách, chữ tiếng Việt). Trang 2 của danh sách đầy đủ và lần tìm "Cisco":</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices?page=2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Lab devices&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices" method="get"&gt;
  &lt;input name="q" value="" placeholder="name contains…"&gt; &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;RTR-01&lt;/td&gt;&lt;td&gt;Router Cisco 2901&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Lab Mạng&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=5"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SWI-01&lt;/td&gt;&lt;td&gt;Switch Cisco 2960&lt;/td&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;Lab Mạng&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=6"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;CAB-01&lt;/td&gt;&lt;td&gt;Bộ bấm cáp mạng&lt;/td&gt;&lt;td&gt;12&lt;/td&gt;&lt;td&gt;Lab Mạng&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=7"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;ESP-01&lt;/td&gt;&lt;td&gt;Kit ESP32&lt;/td&gt;&lt;td&gt;20&lt;/td&gt;&lt;td&gt;Lab IoT&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=8"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 2/3 · 11 device(s)
  &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=1"&gt;1&lt;/a&gt; &lt;strong&gt;[2]&lt;/strong&gt; &lt;a href="/mvc-thiet-bi/devices?q=&amp;page=3"&gt;3&lt;/a&gt; &lt;/p&gt;
&lt;a href="/mvc-thiet-bi/devices/new"&gt;Add a device&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices?q=Cisco HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Devices&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Lab devices&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices" method="get"&gt;
  &lt;input name="q" value="Cisco" placeholder="name contains…"&gt; &lt;button&gt;Search&lt;/button&gt;
&lt;/form&gt;
&lt;table border="1"&gt;
  &lt;tr&gt;&lt;th&gt;Code&lt;/th&gt;&lt;th&gt;Name&lt;/th&gt;&lt;th&gt;Qty&lt;/th&gt;&lt;th&gt;Lab&lt;/th&gt;&lt;th&gt;&lt;/th&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;RTR-01&lt;/td&gt;&lt;td&gt;Router Cisco 2901&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;&lt;td&gt;Lab Mạng&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=5"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;tr&gt;&lt;td&gt;SWI-01&lt;/td&gt;&lt;td&gt;Switch Cisco 2960&lt;/td&gt;&lt;td&gt;6&lt;/td&gt;&lt;td&gt;Lab Mạng&lt;/td&gt;
      &lt;td&gt;&lt;a href="/mvc-thiet-bi/devices/edit?id=6"&gt;edit&lt;/a&gt;&lt;/td&gt;&lt;/tr&gt;
  &lt;/table&gt;
&lt;p&gt;Page 1/1 · 2 device(s)
  &lt;strong&gt;[1]&lt;/strong&gt; &lt;/p&gt;
&lt;a href="/mvc-thiet-bi/devices/new"&gt;Add a device&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<div class="pitfall">Hai lỗi phân trang kinh điển: <code>total / size</code> chia số nguyên (11 / 4 = 2 — 3 thiết bị cuối biến mất; dùng <code>(total + size - 1) / size</code>), và liên kết trang quên <code>q</code> (trang 2 lặng lẽ hiện danh sách chưa lọc). Cả hai chỉ lộ ra vì response được kiểm tra thật, không phải đoán.</div>`),
    bi(`<h3>🧪 Exercise 7 — Add an action, then write it in Spring (~20 min)</h3>
<p>The teacher asks for one more feature in the PE: "edit a device; a wrong id must answer 404". In <code>mvc-thiet-bi</code> list exactly what you add, then say which Spring MVC annotation replaces each piece.</p>
<p class="dap-an">✅ Three additions, nothing else changes: one line in the routing table (<code>"GET /edit", this::showEdit</code>), one handler method that asks the service and answers 404 when the model returns <code>null</code>, and the existing <code>form.jsp</code> (it already serves "add" — reuse, slide 9). Real runs: the form filled from SQL Server, a valid update (302, PRG), and a missing id:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices/edit?id=5 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Edit device&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Edit device&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices/update" method="post"&gt;
  &lt;input type="hidden" name="id" value="5"&gt;&lt;label&gt;Code &lt;input name="code" value="RTR-01"&gt;&lt;/label&gt;
  &lt;br&gt;
  &lt;label&gt;Name &lt;input name="name" value="Router Cisco 2901"&gt;&lt;/label&gt;
  &lt;br&gt;
  &lt;label&gt;Quantity &lt;input name="quantity" value="4"&gt;&lt;/label&gt;
  &lt;br&gt;
  &lt;label&gt;Lab &lt;select name="labId"&gt;
    &lt;option value=""&gt;-- choose --&lt;/option&gt;
    &lt;option value="1" &gt;Lab Điện tử&lt;/option&gt;
    &lt;option value="2" selected&gt;Lab Mạng&lt;/option&gt;
    &lt;option value="3" &gt;Lab IoT&lt;/option&gt;
    &lt;/select&gt;&lt;/label&gt;
  &lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;form action="/mvc-thiet-bi/devices/delete" method="post"&gt;
  &lt;input type="hidden" name="id" value="5"&gt;&lt;button&gt;Delete&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /mvc-thiet-bi/devices/update HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 58

id=5&amp;code=RTR-01&amp;name=Router+Cisco+4321&amp;quantity=4&amp;labId=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /mvc-thiet-bi/devices
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices/edit?id=99 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 727

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message No device with this id
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<table>
<thead><tr><th>Our servlet code</th><th>Spring MVC</th></tr></thead>
<tbody>
<tr><td><code>@WebServlet("/devices/*")</code> + <code>routes</code> map</td><td><code>@Controller</code> + <code>@RequestMapping("/devices")</code></td></tr>
<tr><td><code>"GET /edit", this::showEdit</code></td><td><code>@GetMapping("/edit")</code> on the method</td></tr>
<tr><td><code>parseInt(req.getParameter("id"), 0)</code></td><td><code>@RequestParam int id</code></td></tr>
<tr><td><code>resp.sendError(404, …)</code></td><td><code>throw new ResponseStatusException(HttpStatus.NOT_FOUND)</code></td></tr>
<tr><td><code>req.setAttribute</code> + <code>forward(VIEWS + "form.jsp")</code></td><td><code>model.addAttribute(…)</code> + <code>return "device/form"</code></td></tr>
<tr><td><code>sendRedirect</code> + session flash</td><td><code>return "redirect:/devices"</code> + <code>RedirectAttributes.addFlashAttribute</code></td></tr>
<tr><td><code>throw new ServletException(e)</code> in one place</td><td><code>@ControllerAdvice</code> + <code>@ExceptionHandler</code></td></tr>
</tbody>
</table>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): the right-hand column is what you will type in LabFlow. When a Spring endpoint misbehaves, translate it back to the left column — it is the same request, the same 302, the same 404 underneath.</div>`,
    `<h3>🧪 Bài 7 — Thêm một action, rồi viết nó bằng Spring (~20 phút)</h3>
<p>Đề PE đòi thêm một tính năng: "sửa một thiết bị; id sai phải trả 404". Trong <code>mvc-thiet-bi</code>, liệt kê đúng những gì bạn thêm, rồi nói annotation nào của Spring MVC thay cho từng mảnh.</p>
<p class="dap-an">✅ Ba thứ thêm vào, không gì khác đổi: một dòng trong bảng định tuyến (<code>"GET /edit", this::showEdit</code>), một phương thức xử lý hỏi service và trả 404 khi model trả <code>null</code>, và <code>form.jsp</code> có sẵn (nó đã phục vụ "thêm" — dùng lại, slide 9). Chạy thật: form được điền từ SQL Server, một lần sửa hợp lệ (302, PRG), và một id không có:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices/edit?id=5 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Edit device&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Edit device&lt;/h1&gt;
&lt;form action="/mvc-thiet-bi/devices/update" method="post"&gt;
  &lt;input type="hidden" name="id" value="5"&gt;&lt;label&gt;Code &lt;input name="code" value="RTR-01"&gt;&lt;/label&gt;
  &lt;br&gt;
  &lt;label&gt;Name &lt;input name="name" value="Router Cisco 2901"&gt;&lt;/label&gt;
  &lt;br&gt;
  &lt;label&gt;Quantity &lt;input name="quantity" value="4"&gt;&lt;/label&gt;
  &lt;br&gt;
  &lt;label&gt;Lab &lt;select name="labId"&gt;
    &lt;option value=""&gt;-- choose --&lt;/option&gt;
    &lt;option value="1" &gt;Lab Điện tử&lt;/option&gt;
    &lt;option value="2" selected&gt;Lab Mạng&lt;/option&gt;
    &lt;option value="3" &gt;Lab IoT&lt;/option&gt;
    &lt;/select&gt;&lt;/label&gt;
  &lt;br&gt;
  &lt;button&gt;Save&lt;/button&gt;
&lt;/form&gt;
&lt;form action="/mvc-thiet-bi/devices/delete" method="post"&gt;
  &lt;input type="hidden" name="id" value="5"&gt;&lt;button&gt;Delete&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /mvc-thiet-bi/devices/update HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 58

id=5&amp;code=RTR-01&amp;name=Router+Cisco+4321&amp;quantity=4&amp;labId=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /mvc-thiet-bi/devices
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /mvc-thiet-bi/devices/edit?id=99 HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 727

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message No device with this id
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<table>
<thead><tr><th>Code servlet của ta</th><th>Spring MVC</th></tr></thead>
<tbody>
<tr><td><code>@WebServlet("/devices/*")</code> + map <code>routes</code></td><td><code>@Controller</code> + <code>@RequestMapping("/devices")</code></td></tr>
<tr><td><code>"GET /edit", this::showEdit</code></td><td><code>@GetMapping("/edit")</code> trên phương thức</td></tr>
<tr><td><code>parseInt(req.getParameter("id"), 0)</code></td><td><code>@RequestParam int id</code></td></tr>
<tr><td><code>resp.sendError(404, …)</code></td><td><code>throw new ResponseStatusException(HttpStatus.NOT_FOUND)</code></td></tr>
<tr><td><code>req.setAttribute</code> + <code>forward(VIEWS + "form.jsp")</code></td><td><code>model.addAttribute(…)</code> + <code>return "device/form"</code></td></tr>
<tr><td><code>sendRedirect</code> + flash qua session</td><td><code>return "redirect:/devices"</code> + <code>RedirectAttributes.addFlashAttribute</code></td></tr>
<tr><td><code>throw new ServletException(e)</code> ở một chỗ</td><td><code>@ControllerAdvice</code> + <code>@ExceptionHandler</code></td></tr>
</tbody>
</table>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): cột bên phải là thứ bạn sẽ gõ trong LabFlow. Khi một endpoint Spring chạy sai, hãy dịch ngược nó về cột bên trái — bên dưới vẫn là cùng một request, cùng cái 302, cùng cái 404.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>MVC</strong></td><td>Mô hình–Giao diện–Bộ điều khiển</td><td>Model–View–Controller: a design pattern that splits an app into data and rules (model), presentation (view) and input handling (controller).</td></tr>
<tr><td><strong>Model</strong></td><td>mô hình (dữ liệu + luật)</td><td>JavaBeans, services and DAOs: the data, the business rules and the database access; no HTTP code.</td></tr>
<tr><td><strong>View</strong></td><td>giao diện / phần trình bày</td><td>The JSP (with EL and JSTL) that turns the attributes it is given into HTML or JSON; no SQL, no decisions.</td></tr>
<tr><td><strong>Controller</strong></td><td>bộ điều khiển</td><td>The servlet (or filter) that reads the request, calls the model and chooses the view.</td></tr>
<tr><td><strong>Model 1 / MVC1</strong></td><td>mô hình 1</td><td>The JSP receives the request itself and does the work with JavaBeans; no separate controller.</td></tr>
<tr><td><strong>Model 2 / MVC2</strong></td><td>mô hình 2</td><td>A servlet (or filter) receives every request and forwards to JSPs that only present — MVC on the web.</td></tr>
<tr><td><strong>Front Controller</strong></td><td>bộ điều khiển đứng trước</td><td>One servlet that receives all requests of an area and dispatches them through a routing table (Spring's DispatcherServlet).</td></tr>
<tr><td><strong>routing table</strong></td><td>bảng định tuyến</td><td>The map "method + path → handler"; unknown path → 404, known path with the wrong method → 405.</td></tr>
<tr><td><strong>service layer</strong></td><td>tầng nghiệp vụ</td><td>Model classes that hold business rules spanning several DAOs (validation, paging, transactions).</td></tr>
<tr><td><strong>forward</strong></td><td>chuyển tiếp phía server</td><td>RequestDispatcher.forward: the server hands the same request to another resource; the URL does not change, request attributes survive.</td></tr>
<tr><td><strong>redirect</strong></td><td>chuyển hướng</td><td>sendRedirect answers 302 + Location; the browser sends a NEW request, so request attributes are lost.</td></tr>
<tr><td><strong>Post/Redirect/Get (PRG)</strong></td><td>mẫu Gửi/Chuyển hướng/Lấy</td><td>After a successful POST, redirect to a GET page so F5 does not resubmit the form.</td></tr>
<tr><td><strong>flash message</strong></td><td>thông báo hiện một lần</td><td>A message stored in the session before a redirect, shown once on the next page, then removed.</td></tr>
<tr><td><strong>sticky form</strong></td><td>form giữ giá trị</td><td>A rejected form shown again with the values the user typed, so nothing must be retyped.</td></tr>
<tr><td><strong>XSS (cross-site scripting)</strong></td><td>tấn công chèn mã script</td><td>Injecting HTML/JavaScript through user text that a page prints unescaped; stopped by c:out / fn:escapeXml in the view.</td></tr>
<tr><td><strong>separation of concerns</strong></td><td>tách bạch trách nhiệm</td><td>Each part of the code has one job, so it can be changed and tested alone — the goal of MVC.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>MVC</strong></td><td>Mô hình–Giao diện–Bộ điều khiển</td><td>Mẫu thiết kế chia app thành dữ liệu và luật (model), trình bày (view) và xử lý đầu vào (controller).</td></tr>
<tr><td><strong>Model</strong></td><td>mô hình (dữ liệu + luật)</td><td>JavaBean, service và DAO: dữ liệu, luật nghiệp vụ và truy cập CSDL; không có code HTTP.</td></tr>
<tr><td><strong>View</strong></td><td>giao diện / phần trình bày</td><td>JSP (dùng EL và JSTL) biến các attribute được đưa thành HTML hoặc JSON; không SQL, không quyết định.</td></tr>
<tr><td><strong>Controller</strong></td><td>bộ điều khiển</td><td>Servlet (hoặc filter) đọc request, gọi model và chọn view.</td></tr>
<tr><td><strong>Model 1 / MVC1</strong></td><td>mô hình 1</td><td>Chính JSP nhận request và làm việc cùng JavaBean; không có controller riêng.</td></tr>
<tr><td><strong>Model 2 / MVC2</strong></td><td>mô hình 2</td><td>Một servlet (hoặc filter) nhận mọi request và forward sang JSP chỉ để trình bày — MVC trên web.</td></tr>
<tr><td><strong>Front Controller</strong></td><td>bộ điều khiển đứng trước</td><td>Một servlet nhận mọi request của một vùng và điều phối chúng qua một bảng định tuyến (DispatcherServlet của Spring).</td></tr>
<tr><td><strong>routing table</strong></td><td>bảng định tuyến</td><td>Bảng "method + đường dẫn → hàm xử lý"; đường dẫn lạ → 404, đường dẫn có nhưng sai method → 405.</td></tr>
<tr><td><strong>service layer</strong></td><td>tầng nghiệp vụ</td><td>Các lớp model giữ luật nghiệp vụ trải qua nhiều DAO (kiểm tra dữ liệu, phân trang, giao dịch).</td></tr>
<tr><td><strong>forward</strong></td><td>chuyển tiếp phía server</td><td>RequestDispatcher.forward: server trao cùng request cho tài nguyên khác; URL không đổi, request attribute còn nguyên.</td></tr>
<tr><td><strong>redirect</strong></td><td>chuyển hướng</td><td>sendRedirect trả 302 + Location; trình duyệt gửi một request MỚI, nên request attribute bị mất.</td></tr>
<tr><td><strong>Post/Redirect/Get (PRG)</strong></td><td>mẫu Gửi/Chuyển hướng/Lấy</td><td>Sau một POST thành công, chuyển hướng sang trang GET để F5 không gửi lại form.</td></tr>
<tr><td><strong>flash message</strong></td><td>thông báo hiện một lần</td><td>Thông báo cất trong session trước khi redirect, hiện một lần ở trang kế rồi bị xoá.</td></tr>
<tr><td><strong>sticky form</strong></td><td>form giữ giá trị</td><td>Form bị từ chối hiện lại kèm giá trị người dùng đã gõ, để không phải gõ lại.</td></tr>
<tr><td><strong>XSS (cross-site scripting)</strong></td><td>tấn công chèn mã script</td><td>Chèn HTML/JavaScript qua chữ người dùng mà trang in ra không thoát; chặn bằng c:out / fn:escapeXml ở view.</td></tr>
<tr><td><strong>separation of concerns</strong></td><td>tách bạch trách nhiệm</td><td>Mỗi phần code có một việc, nên sửa và kiểm thử riêng được — mục tiêu của MVC.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 6</h2>
<ol>
<li>Controller (servlet/filter) reads the request, calls the model, chooses the view — no SQL, no HTML.</li>
<li>Model = JavaBeans + service (rules) + DAO (JDBC) — no <code>jakarta.servlet</code>; the database is not "the model".</li>
<li>View = JSP + JSTL under <code>WEB-INF</code>, reached only by forward; escape user text with <code>&lt;c:out&gt;</code> — plain EL does not escape.</li>
<li>Model 1 (MVC1): the JSP receives the request. Model 2 (MVC2): a servlet does. The PE and Assignment expect MVC2.</li>
<li>A front controller = one servlet + a fixed routing table; never build a view path (or any path) from a request value.</li>
<li>Invalid form → forward back with per-field errors and the typed values (same request). Valid POST → redirect (PRG).</li>
<li>Request attributes die with a redirect; carry a one-time message in the session (flash).</li>
<li>Paging: the service clamps the page and computes <code>(total + size - 1) / size</code>; page links keep the search with <code>&lt;c:param&gt;</code>.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 6</h2>
<ol>
<li>Controller (servlet/filter) đọc request, gọi model, chọn view — không SQL, không HTML.</li>
<li>Model = JavaBean + service (luật) + DAO (JDBC) — không <code>jakarta.servlet</code>; CSDL không phải là "model".</li>
<li>View = JSP + JSTL dưới <code>WEB-INF</code>, chỉ tới được qua forward; thoát chữ người dùng bằng <code>&lt;c:out&gt;</code> — EL trần không thoát.</li>
<li>Model 1 (MVC1): JSP nhận request. Model 2 (MVC2): servlet nhận. PE và Assignment đòi MVC2.</li>
<li>Front controller = một servlet + một bảng định tuyến cố định; không bao giờ dựng đường dẫn view (hay bất kỳ đường dẫn nào) từ giá trị của request.</li>
<li>Form sai → forward về kèm lỗi từng ô và giá trị đã gõ (cùng request). POST hợp lệ → redirect (PRG).</li>
<li>Request attribute chết theo redirect; thông báo một lần thì mang trong session (flash).</li>
<li>Phân trang: service kẹp số trang và tính <code>(total + size - 1) / size</code>; liên kết trang giữ từ khoá bằng <code>&lt;c:param&gt;</code>.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (prj301-quiz-ch6) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) In a Java web application built with MVC, which component is responsible for presenting the data to the user?|||(Dạng câu FE) Trong một ứng dụng Java web theo MVC, thành phần nào chịu trách nhiệm trình bày dữ liệu cho người dùng?',
      options: ['Model|||Model', 'View|||View', 'Controller|||Controller', 'Service|||Service'],
      correctIndex: 1,
      points: 1,
      explanation: 'The View (a JSP with EL/JSTL) turns the attributes it is given into HTML — list.jsp in lesson 6.A. The Model holds data and rules, the Controller reads the request and chooses the view; a Service is part of the Model, not a fourth component.|||View (một JSP dùng EL/JSTL) biến các attribute được đưa thành HTML — list.jsp ở bài 6.A. Model giữ dữ liệu và luật, Controller đọc request và chọn view; Service là một phần của Model, không phải thành phần thứ tư.' },
    { id: 'q2',
      question: '(FE question type) In which architecture does the JSP page itself receive the request and do the processing, so it acts as both the view and the controller?|||(Dạng câu FE) Trong kiến trúc nào chính trang JSP nhận request và xử lý, nên nó đóng vai cả view lẫn controller?',
      options: ['MVC1 (Model 1)|||MVC1 (Model 1)', 'MVC2 (Model 2)|||MVC2 (Model 2)', 'MVVM|||MVVM', 'Front Controller|||Front Controller'],
      correctIndex: 0,
      points: 1,
      explanation: 'Slide 4, top picture: in Model 1 the browser calls the JSP (model1/devices.jsp in 6.A reads the parameter and calls the DAO bean itself). In Model 2 (MVC2) a servlet receives the request and JSPs only present; a front controller is one way of writing that servlet. MVVM is a client-side pattern, not part of the JSP specification.|||Slide 4, hình trên: ở Model 1 trình duyệt gọi thẳng JSP (model1/devices.jsp ở bài 6.A tự đọc tham số và tự gọi bean DAO). Ở Model 2 (MVC2) một servlet nhận request còn JSP chỉ trình bày; front controller là một cách viết servlet đó. MVVM là mẫu phía client, không thuộc đặc tả JSP.' },
    { id: 'q3',
      question: '(FE question type) Which of the following is NOT one of the components of the MVC architecture?|||(Dạng câu FE) Cái nào sau đây KHÔNG phải một thành phần của kiến trúc MVC?',
      options: ['Model|||Model', 'View|||View', 'Controller|||Controller', 'Database|||Database (cơ sở dữ liệu)'],
      correctIndex: 3,
      points: 1,
      explanation: "MVC has exactly three roles: Model, View, Controller. The database is where the Model's data is stored (reached through the DAO) — slide 5's database picture is a picture of storage, not of the Model itself.|||MVC có đúng ba vai trò: Model, View, Controller. CSDL là nơi cất dữ liệu của Model (tới được qua DAO) — hình trụ CSDL ở slide 5 là hình của chỗ lưu trữ, không phải của chính Model." },
    { id: 'q4',
      question: '(FE question type) A servlet runs request.setAttribute("msg", "Saved") and then response.sendRedirect("orders"). What does the page /orders see in requestScope.msg?|||(Dạng câu FE) Một servlet chạy request.setAttribute("msg", "Saved") rồi response.sendRedirect("orders"). Trang /orders thấy gì trong requestScope.msg?',
      options: ['"Saved" — attributes travel with the redirect|||"Saved" — attribute đi theo redirect', '"Saved", but only if the JSP uses sessionScope|||"Saved", nhưng chỉ khi JSP dùng sessionScope', 'Nothing — the redirect makes the browser send a new request, so the attribute is lost|||Không có gì — redirect bắt trình duyệt gửi request mới, nên attribute bị mất', 'An IllegalStateException|||Một IllegalStateException'],
      correctIndex: 2,
      points: 1,
      explanation: 'Real run in practice 6.4, exercise 3 (ch6-prg#prg-get): "msg = []" after the redirect, while the SESSION flash "Ordered Arduino" survived. sendRedirect answers 302 + Location; the browser sends a brand-new GET with a brand-new request object. To carry a message, use the session (flash); to keep request attributes, forward instead.|||Chạy thật ở thực hành 6.4, bài 3 (ch6-prg#prg-get): "msg = []" sau redirect, trong khi flash trong SESSION "Ordered Arduino" vẫn sống. sendRedirect trả 302 + Location; trình duyệt gửi một GET hoàn toàn mới với một đối tượng request hoàn toàn mới. Muốn mang thông báo thì dùng session (flash); muốn giữ request attribute thì forward.' },
    { id: 'q5',
      question: 'A servlet saves an order in doPost and then FORWARDS to result.jsp. The user presses F5 on the result page and confirms. What happens?|||Một servlet lưu đơn hàng trong doPost rồi FORWARD sang result.jsp. Người dùng bấm F5 ở trang kết quả và xác nhận. Chuyện gì xảy ra?',
      options: ['The POST is sent again and the order is saved a second time|||POST được gửi lại và đơn hàng được lưu lần thứ hai', 'The browser only reloads result.jsp; nothing is saved|||Trình duyệt chỉ nạp lại result.jsp; không lưu gì', 'Tomcat detects the duplicate and answers 409|||Tomcat phát hiện trùng và trả 409', 'The session expires because the form was already used|||Session hết hạn vì form đã được dùng'],
      correctIndex: 0,
      points: 1,
      explanation: 'Real run (ch6-prg#forward-1 then #forward-f5): "Orders in the store: 1", then "2 → Kit ESP32, Kit ESP32". After a forward the page is the answer to the POST, so F5 re-sends the POST. Post/Redirect/Get fixes it: the POST answers 302 and the page is the answer to a GET (prg-f5 stays at 3 orders). Tomcat has no duplicate detection.|||Chạy thật (ch6-prg#forward-1 rồi #forward-f5): "Orders in the store: 1", rồi "2 → Kit ESP32, Kit ESP32". Sau forward, trang là câu trả lời cho cái POST, nên F5 gửi lại POST. Post/Redirect/Get sửa được: POST trả 302 và trang là câu trả lời cho một GET (prg-f5 vẫn 3 đơn). Tomcat không có cơ chế phát hiện trùng.' },
    { id: 'q6',
      question: "A JSP view prints the user's name with plain EL. The user typed <script>alert(1)</script> as the name. What does the HTML response contain?|||Một view JSP in tên người dùng bằng EL trần. Người dùng gõ tên là <script>alert(1)</script>. Response HTML chứa gì?",
      code: `<p>You typed: \${reg.name}</p>`,
      codeLang: 'html',
      options: ['The tag escaped into harmless text, shown as letters — EL always escapes HTML|||Thẻ bị thoát thành chữ vô hại, hiện ra dạng ký tự — EL luôn thoát HTML', 'An empty paragraph — Tomcat removes script tags|||Một đoạn rỗng — Tomcat xoá thẻ script', '<script>alert(1)</script> unchanged — the browser will run it (XSS); use c:out or fn:escapeXml|||<script>alert(1)</script> nguyên vẹn — trình duyệt sẽ chạy nó (XSS); hãy dùng c:out hoặc fn:escapeXml', 'A 400 Bad Request, because < is not allowed in a parameter|||Một lỗi 400 Bad Request, vì < không được phép trong tham số'],
      correctIndex: 2,
      points: 1,
      explanation: 'Real run (ch6-dang-ky#xss-raw): the response contained the <script> tag as code, and "> even broke out of the value attribute. Plain EL does NOT escape; the same input through <c:out> came back escaped as harmless text (ch6-dang-ky#xss-safe). Tomcat accepts < in a URL-encoded parameter and does not filter HTML.|||Chạy thật (ch6-dang-ky#xss-raw): response chứa thẻ <script> dưới dạng code, và "> còn phá vỡ thuộc tính value. EL trần KHÔNG thoát ký tự; cùng input đi qua <c:out> thì trả về dạng chữ đã thoát, vô hại (ch6-dang-ky#xss-safe). Tomcat chấp nhận < trong tham số đã mã hoá URL và không lọc HTML.' },
    { id: 'q7',
      question: '11 devices, 4 per page. A classmate computes the number of page links like this. What does it print?|||11 thiết bị, 4 cái mỗi trang. Một bạn tính số liên kết trang như sau. Nó in ra gì?',
      code: `// Quiz Ch.6 Q7: 11 devices, 4 per page — what does integer division give for the number of pages?
public class SoTrang {
    public static void main(String[] args) {
        int total = 11, size = 4;
        int pages = total / size;              // the classmate's line
        System.out.println(pages);
    }
}`,
      codeLang: 'java',
      options: ['3|||3', '2|||2', '2.75|||2.75', '3.0|||3.0'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: 2. int / int is integer division and drops the remainder, so the last 3 devices would get no page link. Lesson 6.A uses (total + size - 1) / size = 14 / 4 = 3 (Page.getTotalPages), or (int) Math.ceil(total / (double) size). 2.75 and 3.0 would need a double.|||Output của chương trình thật: 2. int / int là phép chia số nguyên và bỏ phần dư, nên 3 thiết bị cuối không có liên kết trang nào. Bài 6.A dùng (total + size - 1) / size = 14 / 4 = 3 (Page.getTotalPages), hoặc (int) Math.ceil(total / (double) size). 2.75 và 3.0 thì phải có double.' },
    { id: 'q8',
      question: 'The front controller of lesson 6.A (@WebServlet("/devices/*")) maps only "POST /create". What does a GET /devices/create answer?|||Front controller ở bài 6.A (@WebServlet("/devices/*")) chỉ ánh xạ "POST /create". GET /devices/create trả về gì?',
      options: ['200 with the add form|||200 kèm form thêm', '302 back to /devices|||302 về /devices', '404 Not Found|||404 Not Found', '405 Method Not Allowed with the header Allow: POST|||405 Method Not Allowed kèm header Allow: POST'],
      correctIndex: 3,
      points: 1,
      explanation: 'Real run (mvc-thiet-bi#get-create): "HTTP/1.1 405" and "Allow: POST". The controller looks up "GET /create" in its routing table, finds nothing, sees that the same path exists for POST, so it sets Allow and calls sendError(405). A path that exists for no method gets 404 (mvc-thiet-bi#khong-co). The add form is GET /devices/new.|||Chạy thật (mvc-thiet-bi#get-create): "HTTP/1.1 405" và "Allow: POST". Controller tra "GET /create" trong bảng định tuyến, không thấy, nhận ra cùng đường dẫn đó có với POST, nên đặt Allow và gọi sendError(405). Đường dẫn không có với method nào thì 404 (mvc-thiet-bi#khong-co). Form thêm là GET /devices/new.' },
    { id: 'q9',
      question: '(FE question type) What is the effect of adopting an MVC2 architecture on the testability of a web application?|||(Dạng câu FE) Dùng kiến trúc MVC2 ảnh hưởng thế nào tới khả năng kiểm thử của một ứng dụng web?',
      options: ['It improves testability, because the model, view and controller can be tested in isolation|||Nó cải thiện khả năng kiểm thử, vì model, view và controller kiểm thử riêng được', 'It makes testing harder, because there are more classes|||Nó làm kiểm thử khó hơn, vì có nhiều lớp hơn', 'It has no effect; architecture does not influence testing|||Không ảnh hưởng gì; kiến trúc không liên quan tới kiểm thử', 'It reduces testability, because view and controller become tightly coupled|||Nó giảm khả năng kiểm thử, vì view và controller bị gắn chặt vào nhau'],
      correctIndex: 0,
      points: 1,
      explanation: 'Slide 8 lists "easy to test" as a pro of MVC2. In lesson 6.A, DeviceService.save takes a plain DeviceForm and has no HttpServletRequest, so it can be unit-tested without Tomcat; the controller can be tested with a fake service. MVC2 LOOSENS the coupling between view and controller (the view only reads attributes).|||Slide 8 ghi "dễ kiểm thử" là ưu điểm của MVC2. Ở bài 6.A, DeviceService.save nhận một DeviceForm thuần và không có HttpServletRequest, nên kiểm thử đơn vị được mà không cần Tomcat; controller kiểm thử được với một service giả. MVC2 NỚI LỎNG sự gắn kết giữa view và controller (view chỉ đọc attribute).' },
    { id: 'q10',
      question: '(FE question type) A shop has a business rule: "quantity must be 0–999 and the product code must be unique". In an MVC web app, where should this rule be written?|||(Dạng câu FE) Một cửa hàng có luật nghiệp vụ: "số lượng phải 0–999 và mã sản phẩm không được trùng". Trong một app web MVC, luật này nên viết ở đâu?',
      options: ['In the JSP, with a scriptlet before the form is shown|||Trong JSP, bằng một scriptlet trước khi hiện form', 'Only in JavaScript in the browser, so the server stays simple|||Chỉ bằng JavaScript trên trình duyệt, để server đơn giản', 'In the Model — a service class (e.g. DeviceService), called by the controller|||Trong Model — một lớp service (vd DeviceService), được controller gọi', 'In web.xml, as an init-param of the servlet|||Trong web.xml, dạng init-param của servlet'],
      correctIndex: 2,
      points: 1,
      explanation: 'Rules that keep data valid belong to the Model (slide 5: "logic ensures the integrity of data"). Lesson 6.A puts them in DeviceService.save, which the controller calls; the rejected form came back with "Code ESP-01 already exists" (mvc-thiet-bi#create-dup). A JSP must not decide, a browser check can be bypassed by sending the request directly, and web.xml holds configuration, not rules.|||Luật giữ dữ liệu hợp lệ thuộc về Model (slide 5: "logic giữ toàn vẹn dữ liệu"). Bài 6.A đặt chúng trong DeviceService.save, được controller gọi; form bị từ chối trả về kèm "Code ESP-01 already exists" (mvc-thiet-bi#create-dup). JSP không được quyết định, kiểm tra trên trình duyệt bị vượt qua được bằng cách gửi thẳng request, còn web.xml chứa cấu hình, không chứa luật.' },
  ],
};

const QUIZ_LESSON = {
  title: 'Quiz Ch.6 — MVC: Model 1 vs 2, PRG, forward vs redirect, escaping, front controller|||Quiz Ch.6 — MVC: Model 1 và 2, PRG, forward và redirect, thoát ký tự, front controller',
  slug: 'prj301-quiz-ch6',
  type: 'QUIZ',
  description: '10 câu ôn Chương 6 viết lại theo dạng câu FE PRJ301: thành phần nào hiển thị dữ liệu, kiến trúc nào để JSP làm cả view lẫn controller, cái gì không phải thành phần MVC, request attribute ra sao sau sendRedirect, F5 sau một POST kết thúc bằng forward, EL trần in chữ người dùng thế nào, phép chia số trang bằng số nguyên, front controller trả gì khi sai method, MVC2 ảnh hưởng thế nào tới kiểm thử, và luật nghiệp vụ đặt ở đâu — mỗi câu có giải thích song ngữ, nhiều câu kiểm bằng ứng dụng chạy thật trên Tomcat 10.1.',
  quiz: QUIZ,
};

export default {
  slides: [L_prj4_1],
  practice: L_on_ch6,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 6 viết lại theo dạng câu FE PRJ301: thành phần nào hiển thị dữ liệu, kiến trúc nào để JSP làm cả view lẫn controller, cái gì không phải thành phần MVC, request attribute ra sao sau sendRedirect, F5 sau một POST kết thúc bằng forward, EL trần in chữ người dùng thế nào, phép chia số trang bằng số nguyên, front controller trả gì khi sai method, MVC2 ảnh hưởng thế nào tới kiểm thử, và luật nghiệp vụ đặt ở đâu — mỗi câu có giải thích song ngữ, nhiều câu kiểm bằng ứng dụng chạy thật trên Tomcat 10.1.',
  quizLesson: QUIZ_LESSON,
};
