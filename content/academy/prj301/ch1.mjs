/**
 * PRJ301 · Chương 1 — web hoạt động ra sao (prj1 slide 1–16: HTML, servlet, HTTP).
 * Bài 📑 học theo từng slide: prj1 (undefined, slide 1–16).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: prj301-on-ch1.
 * Quiz MỚI (10 câu, slug prj301-quiz-ch1).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRJ301/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRJ301/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 1.A — 📑 Slide by slide · Basic Java web app (1/3): HTML, browsers, servlets, HTTP (Slot 1–5, slides 1–16) ───────── */
const L_prj1_1 = {
  title: '1.A — 📑 Slide by slide · Basic Java web app (1/3): HTML, browsers, servlets, HTTP (Slot 1–5, slides 1–16)|||1.A — 📑 Học theo từng slide · Ứng dụng Java web cơ bản (1/3): HTML, trình duyệt, servlet, HTTP (Slot 1–5, slide 1–16)',
  slug: 'prj301-slide-prj1-1',
  type: 'VIDEO',
  description: 'Giảng slide 1–16 bộ "Introduction to Basic Java Web Application" (Slot 1–5): HTML là gì, thẻ, tài liệu = trang web, trình duyệt làm gì, servlet là gì và sơ đồ Browser–Web Server–Servlet Container–Database, gói jakarta.servlet (slide viết javax), HTTP request (method, URL, header, body), request mẫu, safe/idempotent, HTTP response và mã trạng thái, response mẫu có Set-Cookie — mọi ví dụ là ứng dụng web chạy thật trên Tomcat 10.1 kèm request và response thật, sơ đồ luồng request dựng bằng PlantUML.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.A · school deck "Session 1, Introduction to Basic Java Web Application" (Slot 1–5), slides 1–16</span>
<h2>How the web works — from an HTML file to an HTTP conversation with a Java server</h2>
<p class="lead">Before writing any servlet you need one clear picture: a browser sends a short <strong>text message</strong> (the HTTP request) to a server, and the server sends a text message back (the HTTP response). Everything in PRJ301 — servlets, JSP, sessions, filters, MVC, even Spring Boot later — is a way of producing that response. These 16 slides give you the picture; this lesson makes it concrete by showing you the <em>exact</em> text that travels, captured from a real Tomcat 10.1 server.</p>
<p>Why it matters: the FE multiple-choice exam asks about status codes (401 vs 404 vs 500 vs 503), GET vs POST, which methods are idempotent, and what a request or response contains. The PE and the Assignment assume you can read a request/response in the browser's DevTools (F12 → Network) to debug your own app.</p>
<table>
<thead><tr><th>Lesson</th><th>School slides</th><th>What you will be able to do</th></tr></thead>
<tbody>
<tr><td>1.A (this one)</td><td>1–16</td><td>explain HTML, browsers, servlets and the servlet container; read every line of a raw HTTP request and response; pick the right method and status code</td></tr>
<tr><td>2.A</td><td>17–31</td><td>write, map and run a servlet; explain its life cycle; read headers; read form data with getParameter</td></tr>
<tr><td>2.B</td><td>32–43</td><td>lay out a web application (WEB-INF, classes, lib, web.xml), configure servlets and welcome files, build and deploy a WAR</td></tr>
</tbody>
</table>
<div class="callout"><strong>How to read the code on these pages.</strong> Every example is a small web application that the site's generator deployed on a real <strong>Apache Tomcat 10.1</strong> (JDK 17). Under each piece of code you see the <strong>request</strong> that was sent and the <strong>response Tomcat really returned</strong> — not a typed-up imitation. The school slides still write <code>javax.servlet</code> (Tomcat 9 and older); the code here uses <code>jakarta.servlet</code>, which is what Tomcat 10+ and Spring Boot 3 require — only the package name changes. The older web lessons 1.1 and 1.2 below this one stay as a short summary.</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.A · bộ slide "Session 1, Introduction to Basic Java Web Application" của trường (Slot 1–5), slide 1–16</span>
<h2>Web hoạt động ra sao — từ một file HTML tới cuộc "nói chuyện" HTTP với một server Java</h2>
<p class="lead">Trước khi viết servlet nào, bạn cần một bức tranh rõ ràng: trình duyệt gửi một <strong>đoạn văn bản</strong> ngắn (HTTP request — yêu cầu) tới server, và server gửi lại một đoạn văn bản (HTTP response — phản hồi). Mọi thứ trong PRJ301 — servlet, JSP, session, filter, MVC, kể cả Spring Boot sau này — đều là các cách để tạo ra cái response đó. 16 slide này cho bạn bức tranh; bài này làm nó cụ thể bằng cách cho bạn xem <em>đúng</em> đoạn chữ đi trên mạng, ghi lại từ một server Tomcat 10.1 thật.</p>
<p>Vì sao quan trọng: đề trắc nghiệm FE hỏi mã trạng thái (401, 404, 500, 503 khác nhau ra sao), GET khác POST thế nào, method nào idempotent, một request hay response gồm những gì. Bài PE và Assignment thì mặc định bạn đọc được request/response trong DevTools của trình duyệt (F12 → tab Network) để tự gỡ lỗi ứng dụng của mình.</p>
<table>
<thead><tr><th>Bài</th><th>Slide trường</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1.A (bài này)</td><td>1–16</td><td>giải thích HTML, trình duyệt, servlet và servlet container; đọc từng dòng của một HTTP request và response thô; chọn đúng method và mã trạng thái</td></tr>
<tr><td>2.A</td><td>17–31</td><td>viết, ánh xạ và chạy một servlet; giải thích vòng đời của nó; đọc header; đọc dữ liệu form bằng getParameter</td></tr>
<tr><td>2.B</td><td>32–43</td><td>bố trí một ứng dụng web (WEB-INF, classes, lib, web.xml), cấu hình servlet và welcome file, đóng gói và deploy file WAR</td></tr>
</tbody>
</table>
<div class="callout"><strong>Cách đọc code trên các trang này.</strong> Mỗi ví dụ là một ứng dụng web nhỏ mà bộ sinh bài của web đã deploy (triển khai) lên một <strong>Apache Tomcat 10.1</strong> thật (JDK 17). Dưới mỗi đoạn code bạn thấy <strong>request</strong> đã gửi và <strong>response Tomcat thật sự trả về</strong> — không phải bản gõ tay bắt chước. Slide trường vẫn viết <code>javax.servlet</code> (Tomcat 9 trở về trước); code ở đây dùng <code>jakarta.servlet</code>, đúng thứ Tomcat 10+ và Spring Boot 3 đòi — chỉ đổi tên gói. Hai bài web cũ 1.1 và 1.2 nằm dưới bài này vẫn giữ làm bản tóm tắt ngắn.</div>`),
    walkHead('prj1', 1, 16),
    walk('prj1', [
      [1, 'Session 1, Introduction to Basic Java Web Application',
        `<p class="y-chinh">🎯 The first deck of PRJ301 (sessions 1–5 of the syllabus): what a Java web application is, how to set up Tomcat and NetBeans, and how to build and deploy your first servlet.</p>
<p>The title says "Session 1", the footer says "AdvJ" (the course's old name, <em>Advanced Java</em>) and "n/41", but the deck has <strong>43</strong> slides — the footer was never updated. This site numbers slides by what you see in the deck (1–43), so "slide 42" here is the one whose footer says "42/41".</p>
<p>The deck is split over two web chapters: slides 1–16 here (how the web works), slides 17–43 in Chapter 2 (servlets in depth, web.xml, WAR). Syllabus CLO1: <em>understand the basic web application structure and be able to deploy a web application</em>.</p>
<p class="meo">🧠 One sentence for the whole deck: <em>a Java web application is Java code that a server runs to answer HTTP requests.</em></p>`,
        `<p class="y-chinh">🎯 Bộ slide đầu tiên của PRJ301 (buổi 1–5 của đề cương): ứng dụng Java web là gì, cài Tomcat và NetBeans ra sao, và làm sao viết rồi deploy servlet đầu tiên.</p>
<p>Tiêu đề ghi "Session 1", chân slide ghi "AdvJ" (tên cũ của môn, <em>Advanced Java</em> — Java nâng cao) và "n/41", nhưng deck có <strong>43</strong> slide — số ở chân trang chưa bao giờ được sửa. Web này đánh số slide theo đúng thứ tự bạn thấy trong deck (1–43), nên "slide 42" ở đây là slide có chân trang ghi "42/41".</p>
<p>Deck được chia cho hai chương web: slide 1–16 ở đây (web hoạt động ra sao), slide 17–43 ở Chương 2 (servlet chuyên sâu, web.xml, WAR). CLO1 của đề cương: <em>hiểu cấu trúc cơ bản của ứng dụng web và deploy (triển khai) được một ứng dụng web</em>.</p>
<p class="meo">🧠 Một câu cho cả deck: <em>ứng dụng Java web là code Java mà server chạy để trả lời các HTTP request.</em></p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Three goals: understand the core Java web server technologies (and how web <em>design</em> differs from <em>server</em> technology), set up the environment (JDK, Tomcat 10+, NetBeans 13+), and build, run and deploy a first servlet and JSP.</p>
<p><strong>Web design vs server technologies</strong>: HTML, CSS and JavaScript decide how a page <em>looks</em> and behaves in the browser (front end). Server technologies — servlets, JSP, JDBC — decide what page is sent at all: who is logged in, what is in the database, what happens when a form is submitted (back end). PRJ301 is mostly back end, with just enough HTML to build forms.</p>
<table>
<thead><tr><th>Slide line</th><th>What it means today</th><th>Where on this site</th></tr></thead>
<tbody>
<tr><td>JDK 1.8 or higher</td><td>⚠️ outdated: Tomcat 10.1 needs Java <strong>11+</strong> (Tomcat 10.0 ran on Java 8 but reached end of life on 2022-10-31) — install <strong>JDK 17</strong>, the version Spring Boot 3 requires</td><td>⭐ lesson "Installing the environment"</td></tr>
<tr><td>Servlet container: Tomcat 10 or higher</td><td>Tomcat <strong>10.1</strong> (Servlet 6.0, Jakarta EE 10); <code>jakarta.*</code> packages</td><td>slide 10, ⭐ "Start here"</td></tr>
<tr><td>Integrate NetBeans 13 or higher</td><td>any recent Apache NetBeans works; IntelliJ IDEA or VS Code are alternatives</td><td>⭐ "Installing the environment"</td></tr>
<tr><td>Create servlet / JSP, deploy</td><td>slides 17–18, 40–42</td><td>Chapter 2, ⭐ "First hands-on session"</td></tr>
</tbody>
</table>
<div class="pitfall">Exam trap: "JDK 1.8 + Tomcat 10.1" does <strong>not</strong> start — Tomcat 10.1's own startup refuses an old JVM. If your lab PC has Java 8, either install JDK 17 or use the Tomcat version the lab provides.</div>`,
        `<p class="y-chinh">🎯 Ba mục tiêu: hiểu các công nghệ cốt lõi của server Java web (và <em>thiết kế web</em> khác <em>công nghệ phía server</em> ra sao), cài môi trường (JDK, Tomcat 10+, NetBeans 13+), và viết, chạy, deploy servlet cùng JSP đầu tiên.</p>
<p><strong>Thiết kế web và công nghệ server</strong>: HTML, CSS và JavaScript quyết định trang <em>trông thế nào</em> và cư xử ra sao trong trình duyệt (front end — phía người dùng). Công nghệ phía server — servlet, JSP, JDBC — quyết định gửi trang nào: ai đang đăng nhập, trong CSDL có gì, chuyện gì xảy ra khi form được gửi (back end — phía máy chủ). PRJ301 chủ yếu là back end, kèm vừa đủ HTML để làm form.</p>
<table>
<thead><tr><th>Dòng trên slide</th><th>Nghĩa ngày nay</th><th>Học ở đâu trên web</th></tr></thead>
<tbody>
<tr><td>JDK 1.8 or higher</td><td>⚠️ đã cũ: Tomcat 10.1 cần Java <strong>11 trở lên</strong> (Tomcat 10.0 chạy trên Java 8 nhưng đã hết hỗ trợ từ 31/10/2022) — hãy cài <strong>JDK 17</strong>, đúng bản Spring Boot 3 đòi</td><td>bài ⭐ "Cài môi trường"</td></tr>
<tr><td>Servlet container: Tomcat 10 or higher</td><td>Tomcat <strong>10.1</strong> (Servlet 6.0, Jakarta EE 10); gói <code>jakarta.*</code></td><td>slide 10, bài ⭐ "Bắt đầu tại đây"</td></tr>
<tr><td>Integrate NetBeans 13 or higher</td><td>NetBeans bản gần đây nào cũng được; IntelliJ IDEA hay VS Code là lựa chọn khác</td><td>bài ⭐ "Cài môi trường"</td></tr>
<tr><td>Tạo servlet / JSP, deploy</td><td>slide 17–18, 40–42</td><td>Chương 2, bài ⭐ "Buổi thực hành đầu tiên"</td></tr>
</tbody>
</table>
<div class="pitfall">Bẫy thi/thực hành: "JDK 1.8 + Tomcat 10.1" <strong>không</strong> khởi động được — chính Tomcat 10.1 từ chối JVM cũ. Nếu máy phòng lab chỉ có Java 8, hãy cài JDK 17 hoặc dùng đúng bản Tomcat phòng lab cấp sẵn.</div>`],
      [3, 'What is HTML?',
        `<p class="y-chinh">🎯 HTML (HyperText Markup Language) describes web pages; it is a <strong>markup</strong> language — a set of tags that label parts of a text — not a programming language.</p>
<p><strong>Markup vs programming</strong>: a programming language (Java) has variables, conditions and loops — it <em>computes</em>. HTML has none of that; it only says "this is a heading", "this is a paragraph", "this is a link". You cannot write <code>if</code> in HTML. That is exactly why we need servlets: HTML cannot decide anything, so Java decides and then <em>writes</em> HTML.</p>
<p><strong>HyperText</strong> = text with links (hyperlinks) to other texts — the "web" part. Tim Berners-Lee created HTML and HTTP at CERN in 1989–1991; HTML today is the "HTML Living Standard" maintained by WHATWG.</p>
<pre><code class="language-html">&lt;h1&gt;Lab rules&lt;/h1&gt;
&lt;p&gt;Bring your &lt;strong&gt;student card&lt;/strong&gt;.&lt;/p&gt;
&lt;a href="https://fap.fpt.edu.vn"&gt;FAP&lt;/a&gt;</code></pre>
<p class="meo">🧠 Think of HTML as the highlighter pens you use on a printed text: they do not change the words, they tell the reader what each part is.</p>`,
        `<p class="y-chinh">🎯 HTML (HyperText Markup Language — ngôn ngữ đánh dấu siêu văn bản) mô tả trang web; nó là ngôn ngữ <strong>đánh dấu (markup)</strong> — một bộ thẻ dán nhãn cho các phần của văn bản — chứ không phải ngôn ngữ lập trình.</p>
<p><strong>Đánh dấu khác lập trình</strong>: ngôn ngữ lập trình (Java) có biến, điều kiện, vòng lặp — nó <em>tính toán</em>. HTML không có gì trong số đó; nó chỉ nói "đây là tiêu đề", "đây là đoạn văn", "đây là liên kết". Bạn không viết được <code>if</code> trong HTML. Đó chính là lý do cần servlet: HTML không tự quyết định được gì, nên Java quyết định rồi <em>viết ra</em> HTML.</p>
<p><strong>HyperText (siêu văn bản)</strong> = văn bản có liên kết (hyperlink) tới văn bản khác — chính là phần "mạng nhện" của web. Tim Berners-Lee tạo ra HTML và HTTP ở CERN trong khoảng 1989–1991; HTML ngày nay là "HTML Living Standard" (chuẩn sống) do nhóm WHATWG duy trì.</p>
<pre><code class="language-html">&lt;h1&gt;Lab rules&lt;/h1&gt;
&lt;p&gt;Bring your &lt;strong&gt;student card&lt;/strong&gt;.&lt;/p&gt;
&lt;a href="https://fap.fpt.edu.vn"&gt;FAP&lt;/a&gt;</code></pre>
<p class="meo">🧠 Hãy nghĩ HTML như mấy cây bút dạ quang bạn tô lên bài in: chúng không đổi chữ, chúng chỉ cho người đọc biết từng phần là gì.</p>`],
      [4, 'HTML Tags',
        `<p class="y-chinh">🎯 Tags are keywords in angle brackets (<code>&lt;html&gt;</code>); most come in pairs — a start (opening) tag and an end (closing) tag such as <code>&lt;b&gt;</code> … <code>&lt;/b&gt;</code>.</p>
<table>
<thead><tr><th>Term</th><th>Example</th><th>Note</th></tr></thead>
<tbody>
<tr><td>start / opening tag</td><td><code>&lt;p&gt;</code></td><td>may carry attributes: <code>&lt;a href="..."&gt;</code></td></tr>
<tr><td>end / closing tag</td><td><code>&lt;/p&gt;</code></td><td>same name with a slash</td></tr>
<tr><td>element</td><td><code>&lt;p&gt;Hello&lt;/p&gt;</code></td><td>start tag + content + end tag</td></tr>
<tr><td>void (empty) element</td><td><code>&lt;br&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;img&gt;</code></td><td>no content, no end tag; <code>&lt;br /&gt;</code> is the XHTML-style spelling the slides use</td></tr>
<tr><td>attribute</td><td><code>name="user"</code></td><td>extra information inside the start tag: name="value"</td></tr>
</tbody>
</table>
<p><strong>Nesting rule</strong>: close tags in the reverse order you opened them: <code>&lt;p&gt;&lt;b&gt;x&lt;/b&gt;&lt;/p&gt;</code>, never <code>&lt;p&gt;&lt;b&gt;x&lt;/p&gt;&lt;/b&gt;</code>. Browsers forgive mistakes silently, which is why a missing <code>&lt;/div&gt;</code> breaks your layout without any error message.</p>
<p>The slide's <code>&lt;b&gt;</code> means "bold" (looks only); modern HTML prefers <code>&lt;strong&gt;</code> (meaning: important) — screen readers announce it.</p>
<div class="pitfall">In a servlet you write HTML inside Java strings: <code>out.println("&lt;h1&gt;Hi&lt;/h1&gt;")</code>. A missing <code>&lt;/table&gt;</code> there compiles fine and only shows up as a broken page — check the page source (Ctrl+U).</div>`,
        `<p class="y-chinh">🎯 Thẻ (tag) là từ khoá nằm trong dấu ngoặc nhọn (<code>&lt;html&gt;</code>); phần lớn đi thành cặp — thẻ mở (start/opening tag) và thẻ đóng (end/closing tag) như <code>&lt;b&gt;</code> … <code>&lt;/b&gt;</code>.</p>
<table>
<thead><tr><th>Thuật ngữ</th><th>Ví dụ</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>thẻ mở (start tag)</td><td><code>&lt;p&gt;</code></td><td>có thể mang thuộc tính: <code>&lt;a href="..."&gt;</code></td></tr>
<tr><td>thẻ đóng (end tag)</td><td><code>&lt;/p&gt;</code></td><td>cùng tên, thêm dấu gạch chéo</td></tr>
<tr><td>phần tử (element)</td><td><code>&lt;p&gt;Hello&lt;/p&gt;</code></td><td>thẻ mở + nội dung + thẻ đóng</td></tr>
<tr><td>phần tử rỗng (void element)</td><td><code>&lt;br&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;img&gt;</code></td><td>không có nội dung, không có thẻ đóng; <code>&lt;br /&gt;</code> là cách viết kiểu XHTML mà slide dùng</td></tr>
<tr><td>thuộc tính (attribute)</td><td><code>name="user"</code></td><td>thông tin thêm nằm trong thẻ mở: tên="giá trị"</td></tr>
</tbody>
</table>
<p><strong>Luật lồng thẻ</strong>: đóng thẻ theo thứ tự ngược với lúc mở: <code>&lt;p&gt;&lt;b&gt;x&lt;/b&gt;&lt;/p&gt;</code>, không bao giờ <code>&lt;p&gt;&lt;b&gt;x&lt;/p&gt;&lt;/b&gt;</code>. Trình duyệt tha lỗi một cách im lặng, nên thiếu một <code>&lt;/div&gt;</code> là vỡ bố cục mà không hề có thông báo lỗi.</p>
<p><code>&lt;b&gt;</code> trên slide nghĩa là "in đậm" (chỉ về hình thức); HTML hiện đại chuộng <code>&lt;strong&gt;</code> (về nghĩa: quan trọng) — phần mềm đọc màn hình cho người khiếm thị sẽ nhấn giọng chỗ đó.</p>
<div class="pitfall">Trong servlet bạn viết HTML bên trong chuỗi Java: <code>out.println("&lt;h1&gt;Hi&lt;/h1&gt;")</code>. Thiếu một <code>&lt;/table&gt;</code> ở đó vẫn biên dịch bình thường, chỉ lộ ra thành trang vỡ — hãy xem mã nguồn trang (Ctrl+U).</div>`],
      [5, 'HTML Documents = Web Pages',
        `<p class="y-chinh">🎯 An HTML document (tags + plain text) describes a web page; "HTML document" and "web page" are the same thing seen from two sides — the file and what you see.</p>
<p>Where does the document come from? Two possibilities, and the whole course is about the second:</p>
<table>
<thead><tr><th></th><th>Static page</th><th>Dynamic page</th></tr></thead>
<tbody>
<tr><td>The HTML is…</td><td>a file that already exists on the server's disk</td><td>written by a program at the moment of the request</td></tr>
<tr><td>Same URL, two visits</td><td>always the same bytes</td><td>can differ (logged-in user, database rows, form input)</td></tr>
<tr><td>Who produces it</td><td>the server reads and sends the file</td><td>a servlet / JSP runs Java code</td></tr>
<tr><td>Example</td><td><code>index.html</code>, a CSS file, a logo</td><td>the product list from SQL Server, "Hello, Cuong"</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/f96cc17e8d4082cd0d68bffd8b2adbc4392e590b.svg" alt="Static vs dynamic: the file is sent as-is, or Java writes the HTML for this request" loading="lazy" /><p class="chu-thich">🧩 Static vs dynamic: the file is sent as-is, or Java writes the HTML for this request</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Static page vs dynamic page — who writes the HTML?
' Two requests, two kinds of answer
actor "Browser" as B
participant "Tomcat\\n(web server)" as T
collections "index.html\\n(file on disk)" as F
participant "HelloServlet\\n(Java code)" as S
== Static: the file already exists ==
B -&gt; T : GET /trang-tinh/index.html
T -&gt; F : read the file
F --&gt; T : same bytes every time
T --&gt; B : 200 + the file, unchanged
== Dynamic: Java writes the HTML now ==
B -&gt; T : GET /xin-chao/hello?name=Cuong
T -&gt; S : doGet(request, response)
S -&gt; S : build HTML from the request\\n(name, 6 x 7 = 42 ...)
S --&gt; T : response.getWriter().println(...)
T --&gt; B : 200 + HTML that did not exist a moment ago
@enduml</code></pre></details>
<p>Both are served by the same Tomcat: files under the web application folder are sent by Tomcat's built-in <em>default servlet</em>; URLs mapped to your servlets run your code. The next slides show both, for real.</p>`,
        `<p class="y-chinh">🎯 Một tài liệu HTML (thẻ + chữ thường) mô tả một trang web; "tài liệu HTML" và "trang web" là cùng một thứ nhìn từ hai phía — cái file và cái bạn nhìn thấy.</p>
<p>Tài liệu đó từ đâu ra? Có hai khả năng, và cả môn học xoay quanh khả năng thứ hai:</p>
<table>
<thead><tr><th></th><th>Trang tĩnh (static)</th><th>Trang động (dynamic)</th></tr></thead>
<tbody>
<tr><td>HTML là…</td><td>một file có sẵn trên đĩa của server</td><td>được một chương trình viết ra ngay lúc có request</td></tr>
<tr><td>Cùng URL, hai lần vào</td><td>luôn đúng những byte đó</td><td>có thể khác (người đang đăng nhập, dòng trong CSDL, dữ liệu form)</td></tr>
<tr><td>Ai tạo ra</td><td>server đọc file rồi gửi đi</td><td>servlet / JSP chạy code Java</td></tr>
<tr><td>Ví dụ</td><td><code>index.html</code>, file CSS, logo</td><td>danh sách sản phẩm lấy từ SQL Server, "Hello, Cuong"</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/f96cc17e8d4082cd0d68bffd8b2adbc4392e590b.svg" alt="Tĩnh và động: file được gửi nguyên vẹn, hoặc Java viết HTML cho riêng request này" loading="lazy" /><p class="chu-thich">🧩 Tĩnh và động: file được gửi nguyên vẹn, hoặc Java viết HTML cho riêng request này</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Static page vs dynamic page — who writes the HTML?
' Hai request, hai kiểu trả lời
actor "Browser" as B
participant "Tomcat\\n(web server)" as T
collections "index.html\\n(file on disk)" as F
participant "HelloServlet\\n(Java code)" as S
== Static: the file already exists ==
B -&gt; T : GET /trang-tinh/index.html
T -&gt; F : read the file
F --&gt; T : same bytes every time
T --&gt; B : 200 + the file, unchanged
== Dynamic: Java writes the HTML now ==
B -&gt; T : GET /xin-chao/hello?name=Cuong
T -&gt; S : doGet(request, response)
S -&gt; S : build HTML from the request\\n(name, 6 x 7 = 42 ...)
S --&gt; T : response.getWriter().println(...)
T --&gt; B : 200 + HTML that did not exist a moment ago
@enduml</code></pre></details>
<p>Cả hai đều do cùng một Tomcat phục vụ: file nằm trong thư mục ứng dụng web được gửi bởi <em>default servlet</em> (servlet mặc định) có sẵn của Tomcat; URL được ánh xạ tới servlet của bạn thì chạy code của bạn. Các slide sau cho xem cả hai, chạy thật.</p>`],
      [6, 'Web browser',
        `<p class="y-chinh">🎯 A browser (the slide names Internet Explorer and Firefox; today Chrome, Edge, Firefox, Safari) reads HTML documents and displays them as pages; it does not show the tags, it uses them to decide how to show the content.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/95b344e8ac1356015519a39ea7e68b9115605c37.svg" alt="What the browser does with the response it receives" loading="lazy" /><p class="chu-thich">🧩 What the browser does with the response it receives</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title What the browser does with an HTML document (slide 6)
start
:receive the response\\n(status line, headers, body);
:read Content-Type\\n(text/html; charset=UTF-8);
:parse the HTML text into a tree of elements (DOM)\\n&lt;html&gt; &gt; &lt;body&gt; &gt; &lt;h1&gt;, &lt;p&gt;, &lt;a&gt;;
if (more files referenced?\\n(CSS, images, scripts)) then (yes)
  :send one more GET per file;
else (no)
endif
:lay out and paint the page\\n(tags themselves are never shown);
stop
@enduml</code></pre></details>
<p>Two consequences you will meet in PRJ301:</p>
<ul>
<li><strong>The browser trusts the Content-Type header</strong> to know whether the body is HTML, plain text, JSON or an image. Send HTML labelled <code>text/plain</code> and the user sees raw tags.</li>
<li><strong>One page = many requests.</strong> The HTML arrives first; every <code>&lt;link&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;script&gt;</code> inside it triggers another GET. In DevTools → Network you will see 10–50 requests for one page.</li>
</ul>
<p class="meo">🧠 "View page source" (Ctrl+U) shows what the <em>server sent</em>; "Inspect" (F12 → Elements) shows what the browser <em>built</em> from it. When your servlet output looks wrong, look at the source first.</p>`,
        `<p class="y-chinh">🎯 Trình duyệt (slide kể Internet Explorer và Firefox; ngày nay là Chrome, Edge, Firefox, Safari) đọc tài liệu HTML và hiển thị thành trang; nó không hiện các thẻ ra, mà dùng chúng để quyết định hiển thị nội dung thế nào.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/95b344e8ac1356015519a39ea7e68b9115605c37.svg" alt="Trình duyệt làm gì với response nó nhận được" loading="lazy" /><p class="chu-thich">🧩 Trình duyệt làm gì với response nó nhận được</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title What the browser does with an HTML document (slide 6)
start
:receive the response\\n(status line, headers, body);
:read Content-Type\\n(text/html; charset=UTF-8);
:parse the HTML text into a tree of elements (DOM)\\n&lt;html&gt; &gt; &lt;body&gt; &gt; &lt;h1&gt;, &lt;p&gt;, &lt;a&gt;;
if (more files referenced?\\n(CSS, images, scripts)) then (yes)
  :send one more GET per file;
else (no)
endif
:lay out and paint the page\\n(tags themselves are never shown);
stop
@enduml</code></pre></details>
<p>Hai hệ quả bạn sẽ gặp trong PRJ301:</p>
<ul>
<li><strong>Trình duyệt tin header Content-Type</strong> để biết body là HTML, chữ thường, JSON hay ảnh. Gửi HTML mà dán nhãn <code>text/plain</code> thì người dùng thấy nguyên các thẻ.</li>
<li><strong>Một trang = nhiều request.</strong> HTML về trước; mỗi <code>&lt;link&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;script&gt;</code> trong đó kéo theo một GET nữa. Trong DevTools → Network bạn sẽ thấy 10–50 request cho một trang.</li>
</ul>
<p class="meo">🧠 "View page source" (Ctrl+U — xem mã nguồn trang) cho thấy thứ <em>server đã gửi</em>; "Inspect" (F12 → Elements) cho thấy thứ trình duyệt <em>dựng lên</em> từ đó. Khi output servlet trông sai, hãy xem mã nguồn trước.</p>`],
      [7, 'Web page example',
        `<p class="y-chinh">🎯 A complete page: <code>&lt;html&gt;</code> wraps everything, <code>&lt;body&gt;</code> holds what is shown — a heading <code>&lt;h1&gt;</code>, a paragraph <code>&lt;p&gt;</code> and a link <code>&lt;a href&gt;</code>.</p>
<p>The page below is the slide's code, typed character for character into <code>slide7.html</code> and served by Tomcat — a <strong>static</strong> page: Tomcat sends the file unchanged.</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /trang-tinh/slide7.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"145-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 145

&lt;html&gt;
	&lt;body&gt;
		&lt;h1&gt;My First Heading&lt;/h1&gt;
		&lt;p&gt;My first paragraph&lt;/p&gt;
		&lt;a href=âhttp:\\\\cms.fpt.edu.vnâ&gt;Studying place&lt;/a&gt;
	&lt;/body&gt;
&lt;/html&gt;</code></pre>
<div class="pitfall">The slide's link has two bugs copied from a word processor: <strong>curly quotes</strong> <code>“…”</code> instead of straight <code>"…"</code>, and <strong>backslashes</strong> <code>http:\\\\</code> instead of <code>https://</code>. The browser therefore treats the whole thing as a <em>relative</em> path inside the app — here is the request it really sends when you click, and Tomcat's answer:</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /trang-tinh/%E2%80%9Chttp://cms.fpt.edu.vn%E2%80%9D HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 814

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message The requested resource [/trang-tinh/%E2%80%9Chttp://cms.fpt.edu.vn%E2%80%9D] is not available
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p>The corrected page (with <code>&lt;!DOCTYPE html&gt;</code> and <code>&lt;meta charset="UTF-8"&gt;</code>, which every page you hand in should have):</p>
<p class="ghi-chu">📄 <code>trang-tinh/src/main/webapp/index.html</code></p>
<pre class="web-src"><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;My first page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;My First Heading&lt;/h1&gt;
    &lt;p&gt;My first paragraph&lt;/p&gt;
    &lt;a href="https://cms.fpt.edu.vn"&gt;Studying place&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`,
        `<p class="y-chinh">🎯 Một trang hoàn chỉnh: <code>&lt;html&gt;</code> bọc tất cả, <code>&lt;body&gt;</code> chứa phần được hiển thị — một tiêu đề <code>&lt;h1&gt;</code>, một đoạn văn <code>&lt;p&gt;</code> và một liên kết <code>&lt;a href&gt;</code>.</p>
<p>Trang dưới đây là code trên slide, gõ lại từng ký tự vào <code>slide7.html</code> rồi để Tomcat phục vụ — một trang <strong>tĩnh</strong>: Tomcat gửi file nguyên xi.</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /trang-tinh/slide7.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"145-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 145

&lt;html&gt;
	&lt;body&gt;
		&lt;h1&gt;My First Heading&lt;/h1&gt;
		&lt;p&gt;My first paragraph&lt;/p&gt;
		&lt;a href=âhttp:\\\\cms.fpt.edu.vnâ&gt;Studying place&lt;/a&gt;
	&lt;/body&gt;
&lt;/html&gt;</code></pre>
<div class="pitfall">Liên kết trên slide có hai lỗi mang theo từ trình soạn thảo văn bản: <strong>ngoặc kép cong</strong> <code>“…”</code> thay cho ngoặc thẳng <code>"…"</code>, và <strong>gạch ngược</strong> <code>http:\\\\</code> thay cho <code>https://</code>. Vì vậy trình duyệt coi cả cụm là một đường dẫn <em>tương đối</em> trong ứng dụng — đây là request nó thật sự gửi khi bạn bấm, và câu trả lời của Tomcat:</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /trang-tinh/%E2%80%9Chttp://cms.fpt.edu.vn%E2%80%9D HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 814

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message The requested resource [/trang-tinh/%E2%80%9Chttp://cms.fpt.edu.vn%E2%80%9D] is not available
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p>Trang đã sửa (có <code>&lt;!DOCTYPE html&gt;</code> và <code>&lt;meta charset="UTF-8"&gt;</code> — trang nào bạn nộp cũng nên có):</p>
<p class="ghi-chu">📄 <code>trang-tinh/src/main/webapp/index.html</code></p>
<pre class="web-src"><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;My first page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;My First Heading&lt;/h1&gt;
    &lt;p&gt;My first paragraph&lt;/p&gt;
    &lt;a href="https://cms.fpt.edu.vn"&gt;Studying place&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`],
      [8, 'What a Servlet is',
        `<p class="y-chinh">🎯 Servlets are small Java programs that run on a web server, receive requests from web clients (usually over HTTP) and send back responses — a portable way to produce dynamic, user-oriented content.</p>
<p>"Small" because a servlet is just one class; "runs on a web server" because you never call <code>main</code> — the server creates the object and calls its methods when a request arrives. Servlets appeared at Sun Microsystems in 1997 (Servlet 1.0) as Java's answer to <strong>CGI</strong> scripts, which started a whole new operating-system process for every request; a servlet stays loaded and serves every request with a thread.</p>
<p>Here is a dynamic page: the same URL gives different HTML depending on the request. The HTML exists nowhere on disk.</p>
<p class="ghi-chu">📄 <code>xin-chao/src/main/java/demo/HelloServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// A DYNAMIC page: the HTML does not exist anywhere on disk — Java writes it for each request
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String name = request.getParameter("name");           // ?name=... in the URL (null if absent)
        if (name == null || name.isBlank()) name = "guest";
        int a = 6, b = 7;
        response.setContentType("text/html;charset=UTF-8");    // say what we send + which charset
        PrintWriter out = response.getWriter();
        out.println("&lt;!DOCTYPE html&gt;");
        out.println("&lt;html&gt;&lt;body&gt;");
        out.println("&lt;h1&gt;Hello, " + escape(name) + "!&lt;/h1&gt;");
        out.println("&lt;p&gt;The server computed " + a + " x " + b + " = " + (a * b) + " for you.&lt;/p&gt;");
        out.println("&lt;/body&gt;&lt;/html&gt;");
    }

    // never print user input raw into HTML (see Chapter 2: XSS)
    private static String escape(String s) {
        return s.replace("&amp;", "&amp;amp;").replace("&lt;", "&amp;lt;").replace("&gt;", "&amp;gt;").replace("\\"", "&amp;quot;");
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /xin-chao/hello HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 114

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;body&gt;
&lt;h1&gt;Hello, guest!&lt;/h1&gt;
&lt;p&gt;The server computed 6 x 7 = 42 for you.&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /xin-chao/hello?name=Cuong HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 114

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;body&gt;
&lt;h1&gt;Hello, Cuong!&lt;/h1&gt;
&lt;p&gt;The server computed 6 x 7 = 42 for you.&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>"Portable": the same compiled servlet runs on Tomcat, Jetty, GlassFish, WildFly… because they all implement the same <em>Jakarta Servlet</em> specification.</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): a LabFlow <code>@RestController</code> method looks nothing like this class, yet it runs inside exactly this mechanism — Spring Boot starts an embedded Tomcat and registers one servlet (DispatcherServlet) that calls your controller. Slide 17 shows the picture.</div>`,
        `<p class="y-chinh">🎯 Servlet là những chương trình Java nhỏ chạy trên web server, nhận request từ client web (thường qua HTTP) và gửi lại response — một cách "di động" (chạy được ở nhiều server) để tạo nội dung động, theo từng người dùng.</p>
<p>"Nhỏ" vì một servlet chỉ là một lớp; "chạy trên web server" vì bạn không bao giờ gọi <code>main</code> — server tạo đối tượng và gọi các phương thức của nó khi request tới. Servlet ra đời ở Sun Microsystems năm 1997 (Servlet 1.0), là câu trả lời của Java cho các script <strong>CGI</strong> — loại script khởi động hẳn một tiến trình hệ điều hành mới cho mỗi request; còn servlet nạp một lần rồi phục vụ mọi request bằng luồng (thread).</p>
<p>Đây là một trang động: cùng URL nhưng HTML khác nhau tuỳ request. HTML này không nằm ở đâu trên đĩa.</p>
<p class="ghi-chu">📄 <code>xin-chao/src/main/java/demo/HelloServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Trang ĐỘNG: HTML không nằm sẵn trên đĩa — Java viết nó ra cho từng request
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String name = request.getParameter("name");           // ?name=... trên URL (null nếu không có)
        if (name == null || name.isBlank()) name = "guest";
        int a = 6, b = 7;
        response.setContentType("text/html;charset=UTF-8");    // nói rõ gửi gì + bảng mã nào
        PrintWriter out = response.getWriter();
        out.println("&lt;!DOCTYPE html&gt;");
        out.println("&lt;html&gt;&lt;body&gt;");
        out.println("&lt;h1&gt;Hello, " + escape(name) + "!&lt;/h1&gt;");
        out.println("&lt;p&gt;The server computed " + a + " x " + b + " = " + (a * b) + " for you.&lt;/p&gt;");
        out.println("&lt;/body&gt;&lt;/html&gt;");
    }

    // không bao giờ in thẳng dữ liệu người dùng vào HTML (xem Chương 2: XSS)
    private static String escape(String s) {
        return s.replace("&amp;", "&amp;amp;").replace("&lt;", "&amp;lt;").replace("&gt;", "&amp;gt;").replace("\\"", "&amp;quot;");
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /xin-chao/hello HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 114

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;body&gt;
&lt;h1&gt;Hello, guest!&lt;/h1&gt;
&lt;p&gt;The server computed 6 x 7 = 42 for you.&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /xin-chao/hello?name=Cuong HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 114

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;body&gt;
&lt;h1&gt;Hello, Cuong!&lt;/h1&gt;
&lt;p&gt;The server computed 6 x 7 = 42 for you.&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>"Di động (portable)": cùng một servlet đã biên dịch chạy được trên Tomcat, Jetty, GlassFish, WildFly… vì tất cả cùng cài đặt một đặc tả <em>Jakarta Servlet</em>.</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): một phương thức <code>@RestController</code> của LabFlow trông chẳng giống lớp này chút nào, nhưng nó chạy bên trong đúng cơ chế này — Spring Boot khởi động một Tomcat nhúng (embedded) và đăng ký một servlet (DispatcherServlet) để gọi controller của bạn. Slide 17 có hình minh hoạ.</div>`],
      [9, 'What a Servlet is...',
        `<p class="y-chinh">🎯 The picture of the whole course: a browser (client) sends a request over the Internet using HTTP; the web server hands it to the <strong>servlet container</strong>, which runs the right servlet; the servlet may talk to a database; the response travels back.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/3c63963c8cd1e08c6b25c86be19e58ab9518dad6.svg" alt="Slide 9 redrawn: client, Internet/HTTP, web server with its servlet container and servlets, database" loading="lazy" /><p class="chu-thich">🧩 Slide 9 redrawn: client, Internet/HTTP, web server with its servlet container and servlets, database</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title What a servlet is (slide 9): browser, web server, servlet container, database
left to right direction
node "Client PC" {
  component "Browser\\n(client)" as B
}
cloud "Internet\\nHTTP protocol" as NET
node "Web server (e.g. Tomcat)" {
  component "Servlet container\\n(Catalina)" as C {
    component "LoginServlet" as S1
    component "ProductServlet" as S2
    component "OrderServlet" as S3
  }
}
database "Database\\n(SQL Server)" as DB
B --&gt; NET : request
NET --&gt; C : request
C --&gt; NET : response
NET --&gt; B : response
S2 --&gt; DB : JDBC
@enduml</code></pre></details>
<p><strong>Web server vs servlet container</strong>: a pure web server (nginx, Apache httpd) only serves files and forwards traffic. A <em>servlet container</em> (also "web container") additionally creates servlet objects, calls their methods, manages sessions and security. Tomcat is both: its HTTP part is called <em>Coyote</em> (the connector, port 8080) and its container part <em>Catalina</em> — you will see both names in Tomcat's log.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/f0a4e149bf9c784a52af357c7ed8db540ce1a051.svg" alt="One request through Tomcat, step by step" loading="lazy" /><p class="chu-thich">🧩 One request through Tomcat, step by step</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title One request through Tomcat — what happens between the click and the page
actor User
participant "Browser" as B
participant "Connector\\n(port 8080)" as K
participant "Servlet container" as C
participant "ProductServlet" as S
database "SQL Server" as DB
User -&gt; B : click "Products"
B -&gt; K : HTTP request text\\nGET /shop/products HTTP/1.1
K -&gt; C : parse the text into\\nHttpServletRequest + HttpServletResponse
C -&gt; C : URL /shop/products\\n→ context /shop → servlet mapped to /products
C -&gt; S : service(req, resp) → doGet(req, resp)
S -&gt; DB : SELECT ... (JDBC)
DB --&gt; S : rows
S -&gt; S : resp.getWriter().println(HTML)
S --&gt; C : return
C --&gt; K : status + headers + body
K --&gt; B : HTTP response text\\nHTTP/1.1 200 ...
B --&gt; User : rendered page
@enduml</code></pre></details>
<p>Note the database is reached from the <strong>servlet</strong>, never from the browser: the browser cannot (and must not) open a connection to SQL Server. That is Chapter 5 (JDBC).</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): same picture, different names — React in the browser, embedded Tomcat + Spring MVC on the server, PostgreSQL behind it. "Servlet → JDBC → database" becomes "controller → service → repository (Spring Data JPA) → database".</div>`,
        `<p class="y-chinh">🎯 Bức tranh của cả môn: trình duyệt (client) gửi request qua Internet bằng giao thức HTTP; web server chuyển nó cho <strong>servlet container</strong> (bộ chứa servlet), container chạy đúng servlet; servlet có thể làm việc với cơ sở dữ liệu; response đi ngược trở về.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/3c63963c8cd1e08c6b25c86be19e58ab9518dad6.svg" alt="Slide 9 vẽ lại: client, Internet/HTTP, web server cùng servlet container và các servlet, cơ sở dữ liệu" loading="lazy" /><p class="chu-thich">🧩 Slide 9 vẽ lại: client, Internet/HTTP, web server cùng servlet container và các servlet, cơ sở dữ liệu</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title What a servlet is (slide 9): browser, web server, servlet container, database
left to right direction
node "Client PC" {
  component "Browser\\n(client)" as B
}
cloud "Internet\\nHTTP protocol" as NET
node "Web server (e.g. Tomcat)" {
  component "Servlet container\\n(Catalina)" as C {
    component "LoginServlet" as S1
    component "ProductServlet" as S2
    component "OrderServlet" as S3
  }
}
database "Database\\n(SQL Server)" as DB
B --&gt; NET : request
NET --&gt; C : request
C --&gt; NET : response
NET --&gt; B : response
S2 --&gt; DB : JDBC
@enduml</code></pre></details>
<p><strong>Web server và servlet container</strong>: một web server thuần (nginx, Apache httpd) chỉ phục vụ file và chuyển tiếp lưu lượng. Một <em>servlet container</em> (còn gọi là "web container") làm thêm: tạo đối tượng servlet, gọi phương thức của chúng, quản lý session và bảo mật. Tomcat là cả hai: phần HTTP tên là <em>Coyote</em> (connector — bộ kết nối, cổng 8080), phần container tên là <em>Catalina</em> — bạn sẽ thấy cả hai cái tên này trong log của Tomcat.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/f0a4e149bf9c784a52af357c7ed8db540ce1a051.svg" alt="Một request đi qua Tomcat, từng bước" loading="lazy" /><p class="chu-thich">🧩 Một request đi qua Tomcat, từng bước</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title One request through Tomcat — what happens between the click and the page
actor User
participant "Browser" as B
participant "Connector\\n(port 8080)" as K
participant "Servlet container" as C
participant "ProductServlet" as S
database "SQL Server" as DB
User -&gt; B : click "Products"
B -&gt; K : HTTP request text\\nGET /shop/products HTTP/1.1
K -&gt; C : parse the text into\\nHttpServletRequest + HttpServletResponse
C -&gt; C : URL /shop/products\\n→ context /shop → servlet mapped to /products
C -&gt; S : service(req, resp) → doGet(req, resp)
S -&gt; DB : SELECT ... (JDBC)
DB --&gt; S : rows
S -&gt; S : resp.getWriter().println(HTML)
S --&gt; C : return
C --&gt; K : status + headers + body
K --&gt; B : HTTP response text\\nHTTP/1.1 200 ...
B --&gt; User : rendered page
@enduml</code></pre></details>
<p>Để ý: cơ sở dữ liệu được gọi từ <strong>servlet</strong>, không bao giờ từ trình duyệt: trình duyệt không thể (và không được phép) mở kết nối tới SQL Server. Đó là Chương 5 (JDBC).</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): cùng bức tranh, khác tên gọi — React ở trình duyệt, Tomcat nhúng + Spring MVC ở server, PostgreSQL phía sau. "Servlet → JDBC → CSDL" trở thành "controller → service → repository (Spring Data JPA) → CSDL".</div>`],
      [10, 'Architecture of the Servlet Package',
        `<p class="y-chinh">🎯 The servlet package gives you the interfaces and classes for writing servlets; for every call the container hands your servlet two objects: a <strong>ServletRequest</strong> (everything the client sent) and a <strong>ServletResponse</strong> (everything you send back).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/f2f3ddf34ba85153005c4907fe266362604822d7.svg" alt="The main types of the Servlet API and where your servlet fits" loading="lazy" /><p class="chu-thich">🧩 The main types of the Servlet API and where your servlet fits</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The Servlet API (slide 10) — jakarta.servlet and jakarta.servlet.http
set separator none
package "jakarta.servlet" {
  interface Servlet {
    + init(ServletConfig) : void
    + service(ServletRequest, ServletResponse) : void
    + destroy() : void
    + getServletConfig() : ServletConfig
    + getServletInfo() : String
  }
  abstract class GenericServlet {
    + init() : void
    + getInitParameter(String) : String
    + getServletContext() : ServletContext
  }
  interface ServletRequest {
    + getParameter(String) : String
    + getAttribute(String) : Object
  }
  interface ServletResponse {
    + setContentType(String) : void
    + getWriter() : PrintWriter
  }
}
package "jakarta.servlet.http" {
  abstract class HttpServlet {
    # doGet(HttpServletRequest, HttpServletResponse) : void
    # doPost(HttpServletRequest, HttpServletResponse) : void
    # doPut(...) / doDelete(...) / doHead(...) ...
    # service(HttpServletRequest, HttpServletResponse) : void
  }
  interface HttpServletRequest {
    + getMethod() : String
    + getHeader(String) : String
    + getCookies() : Cookie[]
    + getSession() : HttpSession
  }
  interface HttpServletResponse {
    + setStatus(int) : void
    + setHeader(String, String) : void
    + sendRedirect(String) : void
    + addCookie(Cookie) : void
  }
}
class FirstServlet &lt;&lt;your code&gt;&gt;
Servlet &lt;|.. GenericServlet
GenericServlet &lt;|-- HttpServlet
HttpServlet &lt;|-- FirstServlet
ServletRequest &lt;|-- HttpServletRequest
ServletResponse &lt;|-- HttpServletResponse
@enduml</code></pre></details>
<p>You almost never implement <code>Servlet</code> directly: you extend <code>HttpServlet</code>, which already implements <code>service()</code> and splits requests by HTTP method into <code>doGet</code>, <code>doPost</code>… For HTTP the container gives you the richer sub-interfaces <code>HttpServletRequest</code> / <code>HttpServletResponse</code> (headers, cookies, session, status codes, redirects).</p>
<p class="nhan">javax or jakarta?</p>
<p>The slide says <code>javax.servlet</code>. That name belonged to Sun/Oracle's Java EE. In 2017 Oracle handed Java EE to the Eclipse Foundation, which could not keep the "javax" name, so from <strong>Servlet 5.0 / Jakarta EE 9 (2020)</strong> the package is <code>jakarta.servlet</code>. Tomcat 10+ (and Spring Boot 3) only understand <code>jakarta</code>. The classes and methods are identical — <strong>only the package name changes</strong>.</p>
<table>
<thead><tr><th>On the slide (Tomcat ≤ 9)</th><th>In this course (Tomcat 10.1, Spring Boot 3)</th></tr></thead>
<tbody>
<tr><td><code>import javax.servlet.*;</code></td><td><code>import jakarta.servlet.*;</code></td></tr>
<tr><td><code>import javax.servlet.http.*;</code></td><td><code>import jakarta.servlet.http.*;</code></td></tr>
<tr><td>web.xml namespace <code>http://java.sun.com/xml/ns/j2ee</code></td><td><code>https://jakarta.ee/xml/ns/jakartaee</code></td></tr>
</tbody>
</table>
<div class="pitfall">A servlet written with <code>javax.servlet</code> still compiles if an old jar is on your classpath — and then on Tomcat 10 it is simply ignored: the URL answers <strong>404</strong>. The ⭐ lesson "Installing the environment" shows that real 404.</div>`,
        `<p class="y-chinh">🎯 Gói servlet cung cấp các interface và lớp để viết servlet; mỗi lần gọi, container đưa servlet của bạn hai đối tượng: một <strong>ServletRequest</strong> (mọi thứ client đã gửi) và một <strong>ServletResponse</strong> (mọi thứ bạn gửi lại).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/f2f3ddf34ba85153005c4907fe266362604822d7.svg" alt="Các kiểu chính của Servlet API và vị trí servlet của bạn" loading="lazy" /><p class="chu-thich">🧩 Các kiểu chính của Servlet API và vị trí servlet của bạn</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The Servlet API (slide 10) — jakarta.servlet and jakarta.servlet.http
set separator none
package "jakarta.servlet" {
  interface Servlet {
    + init(ServletConfig) : void
    + service(ServletRequest, ServletResponse) : void
    + destroy() : void
    + getServletConfig() : ServletConfig
    + getServletInfo() : String
  }
  abstract class GenericServlet {
    + init() : void
    + getInitParameter(String) : String
    + getServletContext() : ServletContext
  }
  interface ServletRequest {
    + getParameter(String) : String
    + getAttribute(String) : Object
  }
  interface ServletResponse {
    + setContentType(String) : void
    + getWriter() : PrintWriter
  }
}
package "jakarta.servlet.http" {
  abstract class HttpServlet {
    # doGet(HttpServletRequest, HttpServletResponse) : void
    # doPost(HttpServletRequest, HttpServletResponse) : void
    # doPut(...) / doDelete(...) / doHead(...) ...
    # service(HttpServletRequest, HttpServletResponse) : void
  }
  interface HttpServletRequest {
    + getMethod() : String
    + getHeader(String) : String
    + getCookies() : Cookie[]
    + getSession() : HttpSession
  }
  interface HttpServletResponse {
    + setStatus(int) : void
    + setHeader(String, String) : void
    + sendRedirect(String) : void
    + addCookie(Cookie) : void
  }
}
class FirstServlet &lt;&lt;your code&gt;&gt;
Servlet &lt;|.. GenericServlet
GenericServlet &lt;|-- HttpServlet
HttpServlet &lt;|-- FirstServlet
ServletRequest &lt;|-- HttpServletRequest
ServletResponse &lt;|-- HttpServletResponse
@enduml</code></pre></details>
<p>Bạn gần như không bao giờ tự cài đặt <code>Servlet</code>: bạn kế thừa <code>HttpServlet</code>, lớp này đã cài <code>service()</code> và tách request theo method HTTP thành <code>doGet</code>, <code>doPost</code>… Với HTTP, container đưa bạn các interface con giàu tính năng hơn là <code>HttpServletRequest</code> / <code>HttpServletResponse</code> (header, cookie, session, mã trạng thái, chuyển hướng).</p>
<p class="nhan">javax hay jakarta?</p>
<p>Slide ghi <code>javax.servlet</code>. Cái tên đó thuộc về Java EE của Sun/Oracle. Năm 2017 Oracle giao Java EE cho Eclipse Foundation, nhưng tổ chức này không được giữ tên "javax", nên từ <strong>Servlet 5.0 / Jakarta EE 9 (2020)</strong> gói đổi thành <code>jakarta.servlet</code>. Tomcat 10+ (và Spring Boot 3) chỉ hiểu <code>jakarta</code>. Các lớp và phương thức y hệt nhau — <strong>chỉ đổi tên gói</strong>.</p>
<table>
<thead><tr><th>Trên slide (Tomcat ≤ 9)</th><th>Trong môn này (Tomcat 10.1, Spring Boot 3)</th></tr></thead>
<tbody>
<tr><td><code>import javax.servlet.*;</code></td><td><code>import jakarta.servlet.*;</code></td></tr>
<tr><td><code>import javax.servlet.http.*;</code></td><td><code>import jakarta.servlet.http.*;</code></td></tr>
<tr><td>namespace của web.xml <code>http://java.sun.com/xml/ns/j2ee</code></td><td><code>https://jakarta.ee/xml/ns/jakartaee</code></td></tr>
</tbody>
</table>
<div class="pitfall">Một servlet viết bằng <code>javax.servlet</code> vẫn biên dịch được nếu classpath còn jar cũ — rồi trên Tomcat 10 nó bị lờ đi hoàn toàn: URL trả <strong>404</strong>. Bài ⭐ "Cài môi trường" cho xem cái 404 thật đó.</div>`],
      [11, 'HTTP Requests',
        `<p class="y-chinh">🎯 An HTTP request has four parts — a method, a URL, header fields and a body — and HTTP/1.1 defines the methods GET, HEAD, POST, PUT, DELETE, OPTIONS and TRACE (plus CONNECT; PATCH was added later).</p>
<pre class="trich"><code class="language-http">POST /phuong-thuc/notes HTTP/1.1          ← method, URL (path + ?query), protocol version
Host: localhost:8080                      ← header fields: "Name: value", one per line
Content-Type: application/x-www-form-urlencoded
Content-Length: 13
                                          ← one empty line = end of headers
text=Buy+milk                             ← body (only some methods send one)</code></pre>
<p>Every method below was sent for real to one servlet (<code>/notes</code>, code in slide 20). First, ask the server which methods it accepts:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">OPTIONS /phuong-thuc/notes HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Allow: GET, HEAD, POST, PUT, DELETE, OPTIONS
Content-Length: 0</code></pre>
<table>
<thead><tr><th>Method</th><th>Meaning (RFC 9110)</th><th>Real result on our servlet</th></tr></thead>
<tbody>
<tr><td>GET</td><td>read the resource</td><td>200 + the list</td></tr>
<tr><td>HEAD</td><td>like GET, but headers only</td><td>200, same Content-Length, no body</td></tr>
<tr><td>POST</td><td>process the data in the body (usually: create)</td><td>201 Created + Location</td></tr>
<tr><td>PUT</td><td>create or <em>replace</em> the resource at this URL</td><td>200</td></tr>
<tr><td>DELETE</td><td>remove the resource</td><td>204, then 404</td></tr>
<tr><td>OPTIONS</td><td>which methods are allowed here?</td><td>200 + <code>Allow</code></td></tr>
<tr><td>TRACE</td><td>echo my request back (debugging)</td><td>405 — Tomcat disables it (security)</td></tr>
</tbody>
</table>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">HEAD /phuong-thuc/notes HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 34</code></pre>
<div class="pitfall">The slide says POST sends data "of unlimited length". There is no limit in HTTP itself, but servers impose one: Tomcat's default <code>maxPostSize</code> is 2 MB for form data. GET has no body; its data goes into the URL, which browsers and servers limit to a few thousand characters.</div>`,
        `<p class="y-chinh">🎯 Một HTTP request có bốn phần — method (phương thức), URL, các trường header và body (thân) — và HTTP/1.1 định nghĩa các method GET, HEAD, POST, PUT, DELETE, OPTIONS và TRACE (cộng CONNECT; PATCH được thêm sau).</p>
<pre class="trich"><code class="language-http">POST /phuong-thuc/notes HTTP/1.1          ← method, URL (đường dẫn + ?query), phiên bản giao thức
Host: localhost:8080                      ← các trường header: "Tên: giá trị", mỗi dòng một cái
Content-Type: application/x-www-form-urlencoded
Content-Length: 13
                                          ← một dòng trống = hết phần header
text=Buy+milk                             ← body (chỉ vài method mới gửi body)</code></pre>
<p>Mọi method dưới đây đã được gửi thật tới cùng một servlet (<code>/notes</code>, code ở slide 20). Trước hết, hỏi server nó nhận những method nào:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">OPTIONS /phuong-thuc/notes HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Allow: GET, HEAD, POST, PUT, DELETE, OPTIONS
Content-Length: 0</code></pre>
<table>
<thead><tr><th>Method</th><th>Nghĩa (RFC 9110)</th><th>Kết quả thật trên servlet của ta</th></tr></thead>
<tbody>
<tr><td>GET</td><td>đọc tài nguyên</td><td>200 + danh sách</td></tr>
<tr><td>HEAD</td><td>như GET nhưng chỉ lấy header</td><td>200, cùng Content-Length, không có body</td></tr>
<tr><td>POST</td><td>xử lý dữ liệu trong body (thường là: tạo mới)</td><td>201 Created + Location</td></tr>
<tr><td>PUT</td><td>tạo hoặc <em>thay thế</em> tài nguyên ở đúng URL này</td><td>200</td></tr>
<tr><td>DELETE</td><td>xoá tài nguyên</td><td>204, rồi 404</td></tr>
<tr><td>OPTIONS</td><td>ở đây cho phép những method nào?</td><td>200 + <code>Allow</code></td></tr>
<tr><td>TRACE</td><td>gửi trả lại nguyên request của tôi (để gỡ lỗi)</td><td>405 — Tomcat tắt nó (vì bảo mật)</td></tr>
</tbody>
</table>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">HEAD /phuong-thuc/notes HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 34</code></pre>
<div class="pitfall">Slide nói POST gửi dữ liệu "dài không giới hạn". Bản thân HTTP không đặt giới hạn, nhưng server thì có: <code>maxPostSize</code> mặc định của Tomcat là 2 MB cho dữ liệu form. GET không có body; dữ liệu của nó nằm trên URL, mà trình duyệt và server chỉ cho vài nghìn ký tự.</div>`],
      [12, 'HTTP Request Sample',
        `<p class="y-chinh">🎯 A real request, line by line: <code>GET http://www.osborne.com/index.html HTTP/1.1</code>, then headers saying what the client accepts (types, language, compression), who it is (User-Agent), which site it wants (Host) and to keep the connection open.</p>
<table>
<thead><tr><th>Line</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>GET http://www.osborne.com/index.html HTTP/1.1</code></td><td>method, URL, version. The full URL ("absolute form") is what a browser sends to a <em>proxy</em>; to the site itself it sends only the path: <code>GET /index.html HTTP/1.1</code></td></tr>
<tr><td><code>Accept: image/*, application/vnd.ms-excel, */*</code></td><td>MIME types I can handle; <code>*/*</code> = anything</td></tr>
<tr><td><code>Accept-Language: en-gb</code></td><td>preferred language (British English)</td></tr>
<tr><td><code>Accept-Encoding: gzip, deflate</code></td><td>you may compress the body</td></tr>
<tr><td><code>User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)</code></td><td>the program: Internet Explorer 6 on Windows XP — this sample is from about 2002</td></tr>
<tr><td><code>Host: www.osborne.com</code></td><td>which website (one IP can host many sites); the only header HTTP/1.1 makes mandatory</td></tr>
<tr><td><code>Connection: Keep-Alive</code></td><td>reuse this TCP connection for the next requests</td></tr>
</tbody>
</table>
<p>We replayed these exact headers against a servlet that prints every header it receives (it is slide 22's <code>ShowRequestHeaders</code>, studied in Chapter 2):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/ShowRequestHeaders HTTP/1.1
Host: localhost:8080
Accept: image/*, application/vnd.ms-excel, */*
Accept-Language: en-gb
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)
Connection: Keep-Alive</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 381

&lt;TABLE&gt;
&lt;TR&gt;&lt;TD&gt;host&lt;/TD&gt;
&lt;TD&gt;localhost:8080&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;accept&lt;/TD&gt;
&lt;TD&gt;image/*, application/vnd.ms-excel, */*&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;accept-language&lt;/TD&gt;
&lt;TD&gt;en-gb&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;accept-encoding&lt;/TD&gt;
&lt;TD&gt;gzip, deflate&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;user-agent&lt;/TD&gt;
&lt;TD&gt;Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;connection&lt;/TD&gt;
&lt;TD&gt;Keep-Alive&lt;/TD&gt;&lt;/TR&gt;
&lt;/TABLE&gt;</code></pre>
<p>Notice the servlet reports header names in lower case — HTTP header names are <strong>case-insensitive</strong>, so <code>request.getHeader("user-agent")</code> and <code>getHeader("User-Agent")</code> return the same value.</p>`,
        `<p class="y-chinh">🎯 Một request thật, từng dòng: <code>GET http://www.osborne.com/index.html HTTP/1.1</code>, rồi các header cho biết client nhận được gì (kiểu dữ liệu, ngôn ngữ, nén), nó là ai (User-Agent), nó muốn vào trang nào (Host) và xin giữ kết nối mở.</p>
<table>
<thead><tr><th>Dòng</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td><code>GET http://www.osborne.com/index.html HTTP/1.1</code></td><td>method, URL, phiên bản. URL đầy đủ ("absolute form") là thứ trình duyệt gửi cho <em>proxy</em> (máy trung gian); gửi thẳng cho website thì chỉ có đường dẫn: <code>GET /index.html HTTP/1.1</code></td></tr>
<tr><td><code>Accept: image/*, application/vnd.ms-excel, */*</code></td><td>các kiểu MIME tôi xử lý được; <code>*/*</code> = gì cũng được</td></tr>
<tr><td><code>Accept-Language: en-gb</code></td><td>ngôn ngữ ưu tiên (tiếng Anh kiểu Anh)</td></tr>
<tr><td><code>Accept-Encoding: gzip, deflate</code></td><td>bạn được phép nén body</td></tr>
<tr><td><code>User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)</code></td><td>chương trình gửi: Internet Explorer 6 trên Windows XP — mẫu này từ khoảng năm 2002</td></tr>
<tr><td><code>Host: www.osborne.com</code></td><td>website nào (một IP có thể chứa nhiều site); header duy nhất HTTP/1.1 bắt buộc phải có</td></tr>
<tr><td><code>Connection: Keep-Alive</code></td><td>dùng lại kết nối TCP này cho các request tiếp theo</td></tr>
</tbody>
</table>
<p>Ta đã gửi lại đúng các header này tới một servlet in ra mọi header nó nhận được (đó là <code>ShowRequestHeaders</code> của slide 22, học ở Chương 2):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /FirstServlet/ShowRequestHeaders HTTP/1.1
Host: localhost:8080
Accept: image/*, application/vnd.ms-excel, */*
Accept-Language: en-gb
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)
Connection: Keep-Alive</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 381

&lt;TABLE&gt;
&lt;TR&gt;&lt;TD&gt;host&lt;/TD&gt;
&lt;TD&gt;localhost:8080&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;accept&lt;/TD&gt;
&lt;TD&gt;image/*, application/vnd.ms-excel, */*&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;accept-language&lt;/TD&gt;
&lt;TD&gt;en-gb&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;accept-encoding&lt;/TD&gt;
&lt;TD&gt;gzip, deflate&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;user-agent&lt;/TD&gt;
&lt;TD&gt;Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)&lt;/TD&gt;&lt;/TR&gt;
&lt;TR&gt;&lt;TD&gt;connection&lt;/TD&gt;
&lt;TD&gt;Keep-Alive&lt;/TD&gt;&lt;/TR&gt;
&lt;/TABLE&gt;</code></pre>
<p>Để ý servlet báo tên header bằng chữ thường — tên header HTTP <strong>không phân biệt hoa thường</strong>, nên <code>request.getHeader("user-agent")</code> và <code>getHeader("User-Agent")</code> trả cùng một giá trị.</p>`],
      [13, 'Idempotency and Safety Methods',
        `<p class="y-chinh">🎯 <strong>Safe</strong> methods (GET, HEAD, OPTIONS, TRACE) only read — they do not change the server. <strong>Idempotent</strong> methods (the safe ones plus PUT and DELETE) leave the server in the same state whether you send them once or ten times. <strong>POST</strong> is neither.</p>
<p>The slide draws this as two circles; "HAND" inside the Safe circle is a typo for <strong>HEAD</strong>, and POST sits outside both. As a table:</p>
<table>
<thead><tr><th>Method</th><th>Safe?</th><th>Idempotent?</th><th>Why</th></tr></thead>
<tbody>
<tr><td>GET, HEAD, OPTIONS, TRACE</td><td>✅</td><td>✅</td><td>reading changes nothing, so repeating changes nothing</td></tr>
<tr><td>PUT</td><td>❌</td><td>✅</td><td>"put THIS content at THIS URL": the 2nd time it is already there</td></tr>
<tr><td>DELETE</td><td>❌</td><td>✅</td><td>the 2nd time the resource is already gone (the <em>answer</em> may differ: 204 then 404 — the <em>state</em> does not)</td></tr>
<tr><td>POST</td><td>❌</td><td>❌</td><td>each POST may create something new</td></tr>
</tbody>
</table>
<p>Proof on the real servlet — the same POST twice creates <strong>two</strong> notes; the same PUT twice gives the same note; the same DELETE twice leaves the same state:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phuong-thuc/notes HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 13

text=Buy+milk</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 201
Location: notes?id=1
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

created #1</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phuong-thuc/notes HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 13

text=Buy+milk</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 201
Location: notes?id=2
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

created #2</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phuong-thuc/notes HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 34

2 note(s)
#1 Buy milk
#2 Buy milk</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">PUT /phuong-thuc/notes?id=1 HTTP/1.1
Host: localhost:8080
Content-Type: text/plain
Content-Length: 12

Buy oat milk</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 23

note #1 = Buy oat milk</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">DELETE /phuong-thuc/notes?id=2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 204
</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">DELETE /phuong-thuc/notes?id=2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 715

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message no note #2
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="meo">🧠 Why you care: browsers, proxies and mobile apps <em>retry</em> idempotent requests automatically after a network error, and ask "Confirm Form Resubmission?" before repeating a POST. Never change data in <code>doGet</code> (e.g. <code>delete?id=5</code> by GET) — a search-engine crawler or a prefetch would delete your data.</p>`,
        `<p class="y-chinh">🎯 Method <strong>an toàn (safe)</strong> (GET, HEAD, OPTIONS, TRACE) chỉ đọc — không đổi gì trên server. Method <strong>lũy đẳng (idempotent)</strong> (các method an toàn cộng PUT và DELETE) để server ở cùng một trạng thái dù bạn gửi một lần hay mười lần. <strong>POST</strong> không thuộc loại nào.</p>
<p>Slide vẽ bằng hai vòng tròn; chữ "HAND" trong vòng Safe là lỗi gõ của <strong>HEAD</strong>, còn POST nằm ngoài cả hai. Viết thành bảng:</p>
<table>
<thead><tr><th>Method</th><th>An toàn?</th><th>Lũy đẳng?</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>GET, HEAD, OPTIONS, TRACE</td><td>✅</td><td>✅</td><td>đọc thì không đổi gì, nên lặp lại cũng không đổi gì</td></tr>
<tr><td>PUT</td><td>❌</td><td>✅</td><td>"đặt NỘI DUNG NÀY vào URL NÀY": lần thứ 2 nó đã nằm sẵn đó</td></tr>
<tr><td>DELETE</td><td>❌</td><td>✅</td><td>lần thứ 2 tài nguyên đã không còn (<em>câu trả lời</em> có thể khác: 204 rồi 404 — <em>trạng thái</em> thì không)</td></tr>
<tr><td>POST</td><td>❌</td><td>❌</td><td>mỗi lần POST có thể tạo ra một thứ mới</td></tr>
</tbody>
</table>
<p>Chứng minh trên servlet thật — cùng một POST hai lần tạo ra <strong>hai</strong> ghi chú; cùng một PUT hai lần cho cùng một ghi chú; cùng một DELETE hai lần để lại cùng trạng thái:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phuong-thuc/notes HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 13

text=Buy+milk</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 201
Location: notes?id=1
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

created #1</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phuong-thuc/notes HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 13

text=Buy+milk</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 201
Location: notes?id=2
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

created #2</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phuong-thuc/notes HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 34

2 note(s)
#1 Buy milk
#2 Buy milk</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">PUT /phuong-thuc/notes?id=1 HTTP/1.1
Host: localhost:8080
Content-Type: text/plain
Content-Length: 12

Buy oat milk</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 23

note #1 = Buy oat milk</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">DELETE /phuong-thuc/notes?id=2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 204
</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">DELETE /phuong-thuc/notes?id=2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 715

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message no note #2
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="meo">🧠 Vì sao bạn cần quan tâm: trình duyệt, proxy và app di động tự <em>gửi lại</em> request lũy đẳng sau lỗi mạng, và hỏi "Confirm Form Resubmission?" (xác nhận gửi lại form) trước khi lặp một POST. Đừng bao giờ đổi dữ liệu trong <code>doGet</code> (vd xoá bằng GET <code>delete?id=5</code>) — một con bot của công cụ tìm kiếm hay một lần tải trước (prefetch) sẽ xoá mất dữ liệu của bạn.</p>`],
      [14, 'HTTP Responses',
        `<p class="y-chinh">🎯 An HTTP response has a result (status) code, header fields and a body, and the status code and all headers must be sent <strong>before</strong> any body content. Common codes: 404 not found, 401 authentication required, 500 server error, 503 overloaded.</p>
<p>Each code below was produced for real by one servlet (<code>/status/…</code>):</p>
<p class="ghi-chu">📄 <code>ma-trang-thai/src/main/java/demo/StatusServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String what = req.getPathInfo();                 // the part after /status, e.g. "/created"
    resp.setContentType("text/plain;charset=UTF-8");
    switch (what == null ? "/" : what) {
        case "/ok" -&gt; resp.getWriter().println("200 is the default: you did not call setStatus");
        case "/created" -&gt; {
            resp.setStatus(201);
            resp.setHeader("Location", "/ma-trang-thai/orders/42");   // the new resource
            resp.getWriter().println("order 42 created");
        }
        case "/accepted" -&gt; {
            resp.setStatus(202);
            resp.getWriter().println("report queued, check again later");
        }
        case "/secret" -&gt; {
            resp.setHeader("WWW-Authenticate", "Basic realm=\\"PRJ301\\"");
            resp.sendError(401);                       // 401 = who are you? log in first
        }
        case "/busy" -&gt; {
            resp.setHeader("Retry-After", "120");
            resp.sendError(503, "Server is overloaded, try again in 2 minutes");
        }
        case "/crash" -&gt; throw new IllegalStateException("bug in our code");   // uncaught ⇒ Tomcat answers 500
        default -&gt; resp.sendError(404, "No such demo: " + what);
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/khong-co-trang-nay HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 788

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message The requested resource [/ma-trang-thai/khong-co-trang-nay] is not available
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/status/secret HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 401
WWW-Authenticate: Basic realm="PRJ301"
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 687

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 401 – Unauthorized
Type Status Report
Description The request has not been applied to the target resource because it lacks valid authentication credentials for that resource.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/status/crash HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1136

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message bug in our code
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.IllegalStateException: bug in our code
demo.StatusServlet.doGet(StatusServlet.java:37)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Note The full stack trace of the root cause is available in the server logs.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/status/busy HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 503
Retry-After: 120
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 799

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 503 – Service Unavailable
Type Status Report
Message Server is overloaded, try again in 2 minutes
Description The server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay.
Apache Tomcat/10.1.61</code></pre>
<table>
<thead><tr><th>Code</th><th>Whose fault</th><th>Typical cause in PRJ301</th></tr></thead>
<tbody>
<tr><td>404 Not Found</td><td>the URL</td><td>wrong context path, servlet not mapped, typo in <code>@WebServlet</code>, javax instead of jakarta</td></tr>
<tr><td>401 Unauthorized</td><td>the client: not logged in</td><td>protected page (despite the name, 401 means "not <em>authenticated</em>"; "logged in but not allowed" is <strong>403 Forbidden</strong>)</td></tr>
<tr><td>500 Internal Server Error</td><td>your code</td><td>an uncaught exception (NullPointerException, SQLException…)</td></tr>
<tr><td>503 Service Unavailable</td><td>the server, temporarily</td><td>overloaded, being deployed, maintenance</td></tr>
</tbody>
</table>
<div class="pitfall">"Headers before body" is not just theory: once the first part of the body has been sent (the response is <em>committed</em>), <code>setStatus</code>, <code>setHeader</code>, <code>sendRedirect</code> no longer work — see slide 24 for the real proof. In Chapter 2 this is the famous <code>IllegalStateException: Cannot forward after response has been committed</code>.</div>`,
        `<p class="y-chinh">🎯 Một HTTP response có mã kết quả (mã trạng thái — status code), các trường header và body, và mã trạng thái cùng mọi header phải được gửi <strong>trước</strong> bất kỳ nội dung body nào. Các mã hay gặp: 404 không tìm thấy, 401 cần xác thực, 500 lỗi server, 503 quá tải.</p>
<p>Mỗi mã dưới đây do cùng một servlet (<code>/status/…</code>) tạo ra thật:</p>
<p class="ghi-chu">📄 <code>ma-trang-thai/src/main/java/demo/StatusServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String what = req.getPathInfo();                 // phần sau /status, vd "/created"
    resp.setContentType("text/plain;charset=UTF-8");
    switch (what == null ? "/" : what) {
        case "/ok" -&gt; resp.getWriter().println("200 is the default: you did not call setStatus");
        case "/created" -&gt; {
            resp.setStatus(201);
            resp.setHeader("Location", "/ma-trang-thai/orders/42");   // tài nguyên vừa tạo
            resp.getWriter().println("order 42 created");
        }
        case "/accepted" -&gt; {
            resp.setStatus(202);
            resp.getWriter().println("report queued, check again later");
        }
        case "/secret" -&gt; {
            resp.setHeader("WWW-Authenticate", "Basic realm=\\"PRJ301\\"");
            resp.sendError(401);                       // 401 = bạn là ai? đăng nhập trước đã
        }
        case "/busy" -&gt; {
            resp.setHeader("Retry-After", "120");
            resp.sendError(503, "Server is overloaded, try again in 2 minutes");
        }
        case "/crash" -&gt; throw new IllegalStateException("bug in our code");   // không bắt ⇒ Tomcat trả 500
        default -&gt; resp.sendError(404, "No such demo: " + what);
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/khong-co-trang-nay HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 788

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message The requested resource [/ma-trang-thai/khong-co-trang-nay] is not available
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/status/secret HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 401
WWW-Authenticate: Basic realm="PRJ301"
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 687

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 401 – Unauthorized
Type Status Report
Description The request has not been applied to the target resource because it lacks valid authentication credentials for that resource.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/status/crash HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1136

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message bug in our code
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
java.lang.IllegalStateException: bug in our code
demo.StatusServlet.doGet(StatusServlet.java:37)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:564)
jakarta.servlet.http.HttpServlet.service(HttpServlet.java:658)
org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:57)
Note The full stack trace of the root cause is available in the server logs.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/status/busy HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 503
Retry-After: 120
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 799

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 503 – Service Unavailable
Type Status Report
Message Server is overloaded, try again in 2 minutes
Description The server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay.
Apache Tomcat/10.1.61</code></pre>
<table>
<thead><tr><th>Mã</th><th>Lỗi của ai</th><th>Nguyên nhân hay gặp trong PRJ301</th></tr></thead>
<tbody>
<tr><td>404 Not Found</td><td>của URL</td><td>sai context path, servlet chưa ánh xạ, gõ sai <code>@WebServlet</code>, dùng javax thay vì jakarta</td></tr>
<tr><td>401 Unauthorized</td><td>của client: chưa đăng nhập</td><td>trang được bảo vệ (dù tên là "unauthorized", 401 nghĩa là "chưa <em>xác thực</em>"; "đã đăng nhập nhưng không có quyền" là <strong>403 Forbidden</strong>)</td></tr>
<tr><td>500 Internal Server Error</td><td>của code bạn</td><td>một exception không được bắt (NullPointerException, SQLException…)</td></tr>
<tr><td>503 Service Unavailable</td><td>của server, tạm thời</td><td>quá tải, đang deploy, đang bảo trì</td></tr>
</tbody>
</table>
<div class="pitfall">"Header trước body" không chỉ là lý thuyết: khi phần đầu của body đã được gửi đi (response đã <em>commit</em>), <code>setStatus</code>, <code>setHeader</code>, <code>sendRedirect</code> không còn tác dụng — xem bằng chứng thật ở slide 24. Sang Chương 2 đây là lỗi nổi tiếng <code>IllegalStateException: Cannot forward after response has been committed</code>.</div>`],
      [15, 'HTTP 1.1 Status Codes',
        `<p class="y-chinh">🎯 More codes: 101 Switching Protocols (change protocol, e.g. to WebSocket), 200 OK (the default for servlets), 201 Created (with a Location header), 202 Accepted (work not finished yet), 203 Non-Authoritative Information (a copy, headers may be inexact).</p>
<p>First learn the five <strong>classes</strong> — the first digit tells you who should act:</p>
<table>
<thead><tr><th>Class</th><th>Meaning</th><th>Examples you will meet</th></tr></thead>
<tbody>
<tr><td>1xx</td><td>informational, keep going</td><td>101 (WebSocket upgrade)</td></tr>
<tr><td>2xx</td><td>success</td><td>200 OK, 201 Created, 202 Accepted, 204 No Content</td></tr>
<tr><td>3xx</td><td>redirection: look elsewhere</td><td>301/302 (sendRedirect gives 302), 304 Not Modified</td></tr>
<tr><td>4xx</td><td>client error: fix the request</td><td>400, 401, 403, 404, 405 Method Not Allowed</td></tr>
<tr><td>5xx</td><td>server error: fix the server</td><td>500, 501 Not Implemented, 503</td></tr>
</tbody>
</table>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/status/ok HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 47

200 is the default: you did not call setStatus</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/status/created HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 201
Location: /ma-trang-thai/orders/42
Content-Type: text/plain;charset=UTF-8
Content-Length: 17

order 42 created</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/status/accepted HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 202
Content-Type: text/plain;charset=UTF-8
Content-Length: 33

report queued, check again later</code></pre>
<p class="nhan">➕ Beyond the slide — where is the word "OK"?</p>
<p>Look at the status lines above: <code>HTTP/1.1 200</code>, with no "OK". Since Tomcat 8.5 the <em>reason phrase</em> is not sent at all; the HTTP standard (RFC 9112) says clients must ignore it anyway and only the number counts. The slide's texts ("Everything's fine…") are descriptions, not part of the response.</p>
<p class="meo">🧠 2 = "đã xong", 3 = "đi chỗ khác", 4 = "bạn sai", 5 = "tôi (server) sai".</p>`,
        `<p class="y-chinh">🎯 Thêm các mã: 101 Switching Protocols (đổi giao thức, vd sang WebSocket), 200 OK (mặc định của servlet), 201 Created (kèm header Location), 202 Accepted (đã nhận, việc chưa xong), 203 Non-Authoritative Information (bản sao, header có thể không chính xác).</p>
<p>Học thuộc năm <strong>nhóm</strong> trước — chữ số đầu cho biết ai phải hành động:</p>
<table>
<thead><tr><th>Nhóm</th><th>Nghĩa</th><th>Ví dụ bạn sẽ gặp</th></tr></thead>
<tbody>
<tr><td>1xx</td><td>thông tin, cứ tiếp tục</td><td>101 (nâng cấp lên WebSocket)</td></tr>
<tr><td>2xx</td><td>thành công</td><td>200 OK, 201 Created, 202 Accepted, 204 No Content</td></tr>
<tr><td>3xx</td><td>chuyển hướng: tìm chỗ khác</td><td>301/302 (sendRedirect cho 302), 304 Not Modified</td></tr>
<tr><td>4xx</td><td>lỗi phía client: sửa request đi</td><td>400, 401, 403, 404, 405 Method Not Allowed</td></tr>
<tr><td>5xx</td><td>lỗi phía server: sửa server đi</td><td>500, 501 Not Implemented, 503</td></tr>
</tbody>
</table>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/status/ok HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 47

200 is the default: you did not call setStatus</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/status/created HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 201
Location: /ma-trang-thai/orders/42
Content-Type: text/plain;charset=UTF-8
Content-Length: 17

order 42 created</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ma-trang-thai/status/accepted HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 202
Content-Type: text/plain;charset=UTF-8
Content-Length: 33

report queued, check again later</code></pre>
<p class="nhan">➕ Mở rộng ngoài slide — chữ "OK" đâu rồi?</p>
<p>Nhìn các dòng trạng thái ở trên: <code>HTTP/1.1 200</code>, không có chữ "OK". Từ Tomcat 8.5 <em>reason phrase</em> (cụm chữ giải thích) không còn được gửi; chuẩn HTTP (RFC 9112) cũng nói client phải bỏ qua nó, chỉ con số mới có giá trị. Các dòng chữ trên slide ("Everything's fine…") là lời mô tả, không phải một phần của response.</p>
<p class="meo">🧠 2 = "đã xong", 3 = "đi chỗ khác", 4 = "bạn sai", 5 = "tôi (server) sai".</p>`],
      [16, 'HTTP Response Sample',
        `<p class="y-chinh">🎯 A real response from Google (2003): status line <code>HTTP/1.0 200 OK</code>, headers (Connection, Date, <strong>Set-Cookie</strong>, Cache-control, Content-Type, Server), a <strong>blank line</strong>, then the HTML body.</p>
<table>
<thead><tr><th>Header</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>Connection: Close</code></td><td>the server closes the TCP connection after this response</td></tr>
<tr><td><code>Date: Fri, 02 May 2003 ...</code></td><td>when the response was produced (GMT)</td></tr>
<tr><td><code>Set-Cookie: PREF=...; expires=...; path=/; domain=.google.co.uk</code></td><td>"please store this value and send it back to me" — until the date, for every path, for all google.co.uk sites</td></tr>
<tr><td><code>Cache-control: private</code></td><td>browsers may cache it, shared proxies may not</td></tr>
<tr><td><code>Content-Type: text/html</code></td><td>the body is HTML</td></tr>
<tr><td><code>Server: GWS/2.0</code></td><td>server software (Google Web Server)</td></tr>
</tbody>
</table>
<p><strong>Cookies are how stateless HTTP remembers you.</strong> HTTP forgets everything between two requests; the server gives the browser a cookie, the browser returns it in a <code>Cookie:</code> header on every later request. Tomcat uses exactly this for sessions — a cookie named <code>JSESSIONID</code>. Four real requests in one "browser tab" (session values masked as <code>…</code>):</p>
<p class="ghi-chu">📄 <code>dem-luot/src/main/java/demo/VisitServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// HTTP itself forgets everything between requests; the cookie + session below make the server "remember" you
@WebServlet("/visit")
public class VisitServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession();               // finds the session by the JSESSIONID cookie, or creates one
        Integer count = (Integer) session.getAttribute("count");
        count = (count == null) ? 1 : count + 1;
        session.setAttribute("count", count);                  // kept on the SERVER, not in the browser

        String name = req.getParameter("name");
        if (name != null) {                                    // ?name=… ⇒ remember the name in a cookie for 1 hour
            Cookie c = new Cookie("name", name);
            c.setMaxAge(3600);
            resp.addCookie(c);
        }
        String saved = null;
        if (req.getCookies() != null) {
            for (Cookie c : req.getCookies()) if (c.getName().equals("name")) saved = c.getValue();
        }

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("Visit #" + count + (session.isNew() ? " (new session)" : ""));
        out.println("Session ID: " + session.getId());
        out.println("Name cookie: " + (saved == null ? "(none)" : saved));
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /dem-luot/visit HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/dem-luot; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 88

Visit #1 (new session)
Session ID: …
Name cookie: (none)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /dem-luot/visit HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 74

Visit #2
Session ID: …
Name cookie: (none)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /dem-luot/visit HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…; name=Cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 73

Visit #4
Session ID: …
Name cookie: Cuong</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /dem-luot/visit HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/dem-luot; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 88

Visit #1 (new session)
Session ID: …(2)
Name cookie: (none)</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/83c7e4963b21357586fb43833ee359739879a91e.svg" alt="The JSESSIONID round trip that the four requests above show" loading="lazy" /><p class="chu-thich">🧩 The JSESSIONID round trip that the four requests above show</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title How a session survives between requests: the JSESSIONID cookie (slide 16)
participant "Browser\\n(cookie jar)" as B
participant "Tomcat" as T
participant "Session store\\n(server memory)" as M
B -&gt; T : GET /dem-luot/visit\\n(no cookie yet)
T -&gt; M : create session A1B2…\\ncount = 1
T --&gt; B : 200\\nSet-Cookie: JSESSIONID=A1B2…; Path=/dem-luot; HttpOnly
note over B : the browser stores the cookie
B -&gt; T : GET /dem-luot/visit\\nCookie: JSESSIONID=A1B2…
T -&gt; M : find session A1B2…\\ncount = 2
T --&gt; B : 200 "Visit #2" (no new Set-Cookie)
note over B, T : new browser / private window = no cookie\\n⇒ Tomcat makes a NEW session (count = 1 again)
@enduml</code></pre></details>
<div class="pitfall">FE question type: "What does the server send to create a cookie?" → the <strong>Set-Cookie</strong> response header; the browser sends it back in the <strong>Cookie</strong> request header. Chapter 4 covers sessions and cookies in depth.</div>`,
        `<p class="y-chinh">🎯 Một response thật của Google (2003): dòng trạng thái <code>HTTP/1.0 200 OK</code>, các header (Connection, Date, <strong>Set-Cookie</strong>, Cache-control, Content-Type, Server), một <strong>dòng trống</strong>, rồi tới body HTML.</p>
<table>
<thead><tr><th>Header</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td><code>Connection: Close</code></td><td>server đóng kết nối TCP sau response này</td></tr>
<tr><td><code>Date: Fri, 02 May 2003 ...</code></td><td>lúc response được tạo ra (giờ GMT)</td></tr>
<tr><td><code>Set-Cookie: PREF=...; expires=...; path=/; domain=.google.co.uk</code></td><td>"hãy cất giá trị này và gửi lại cho tôi" — tới ngày hết hạn, cho mọi đường dẫn, cho mọi site google.co.uk</td></tr>
<tr><td><code>Cache-control: private</code></td><td>trình duyệt được lưu đệm (cache), proxy dùng chung thì không</td></tr>
<tr><td><code>Content-Type: text/html</code></td><td>body là HTML</td></tr>
<tr><td><code>Server: GWS/2.0</code></td><td>phần mềm server (Google Web Server)</td></tr>
</tbody>
</table>
<p><strong>Cookie là cách HTTP "không trạng thái" (stateless) nhớ ra bạn.</strong> HTTP quên sạch mọi thứ giữa hai request; server đưa trình duyệt một cookie, trình duyệt gửi lại nó trong header <code>Cookie:</code> ở mọi request sau. Tomcat dùng đúng cách này cho session — một cookie tên <code>JSESSIONID</code>. Bốn request thật trong cùng một "tab trình duyệt" (giá trị session được che thành <code>…</code>):</p>
<p class="ghi-chu">📄 <code>dem-luot/src/main/java/demo/VisitServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

// Bản thân HTTP quên sạch giữa hai request; cookie + session dưới đây giúp server "nhớ" bạn
@WebServlet("/visit")
public class VisitServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession();               // tìm session theo cookie JSESSIONID, hoặc tạo mới
        Integer count = (Integer) session.getAttribute("count");
        count = (count == null) ? 1 : count + 1;
        session.setAttribute("count", count);                  // lưu ở SERVER, không ở trình duyệt

        String name = req.getParameter("name");
        if (name != null) {                                    // ?name=… ⇒ nhớ tên trong cookie 1 giờ
            Cookie c = new Cookie("name", name);
            c.setMaxAge(3600);
            resp.addCookie(c);
        }
        String saved = null;
        if (req.getCookies() != null) {
            for (Cookie c : req.getCookies()) if (c.getName().equals("name")) saved = c.getValue();
        }

        resp.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("Visit #" + count + (session.isNew() ? " (new session)" : ""));
        out.println("Session ID: " + session.getId());
        out.println("Name cookie: " + (saved == null ? "(none)" : saved));
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /dem-luot/visit HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/dem-luot; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 88

Visit #1 (new session)
Session ID: …
Name cookie: (none)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /dem-luot/visit HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 74

Visit #2
Session ID: …
Name cookie: (none)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /dem-luot/visit HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…; name=Cuong</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 73

Visit #4
Session ID: …
Name cookie: Cuong</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /dem-luot/visit HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/dem-luot; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 88

Visit #1 (new session)
Session ID: …(2)
Name cookie: (none)</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/83c7e4963b21357586fb43833ee359739879a91e.svg" alt="Vòng đi–về của cookie JSESSIONID mà bốn request trên cho thấy" loading="lazy" /><p class="chu-thich">🧩 Vòng đi–về của cookie JSESSIONID mà bốn request trên cho thấy</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title How a session survives between requests: the JSESSIONID cookie (slide 16)
participant "Browser\\n(cookie jar)" as B
participant "Tomcat" as T
participant "Session store\\n(server memory)" as M
B -&gt; T : GET /dem-luot/visit\\n(no cookie yet)
T -&gt; M : create session A1B2…\\ncount = 1
T --&gt; B : 200\\nSet-Cookie: JSESSIONID=A1B2…; Path=/dem-luot; HttpOnly
note over B : the browser stores the cookie
B -&gt; T : GET /dem-luot/visit\\nCookie: JSESSIONID=A1B2…
T -&gt; M : find session A1B2…\\ncount = 2
T --&gt; B : 200 "Visit #2" (no new Set-Cookie)
note over B, T : new browser / private window = no cookie\\n⇒ Tomcat makes a NEW session (count = 1 again)
@enduml</code></pre></details>
<div class="pitfall">Dạng câu FE: "Server gửi gì để tạo cookie?" → header response <strong>Set-Cookie</strong>; trình duyệt gửi lại nó trong header request <strong>Cookie</strong>. Chương 4 học sâu session và cookie.</div>`],
    ]),
    bi(`<h2>📌 What to take away from slides 1–16</h2>
<ul>
<li>HTML only <em>describes</em> a page; a servlet is Java that <em>writes</em> the page for each request.</li>
<li>Browser → (HTTP request: method, URL, headers, body) → web server / servlet container → servlet (→ database) → (HTTP response: status, headers, blank line, body) → browser.</li>
<li>Safe: GET, HEAD, OPTIONS, TRACE. Idempotent: those + PUT, DELETE. POST: neither — never change data with GET.</li>
<li>2xx done · 3xx go elsewhere · 4xx your request is wrong (401 not logged in, 403 not allowed, 404 no such URL, 405 wrong method) · 5xx the server failed (500 bug, 503 overloaded).</li>
<li>Cookies (<code>Set-Cookie</code> → <code>Cookie</code>) make stateless HTTP remember; JSESSIONID is Tomcat's session cookie.</li>
<li>Slides say <code>javax</code>; Tomcat 10+ and Spring Boot 3 need <code>jakarta</code> — same classes, new package name.</li>
</ul>`,
    `<h2>📌 Cần mang theo gì từ slide 1–16</h2>
<ul>
<li>HTML chỉ <em>mô tả</em> trang; servlet là Java <em>viết ra</em> trang cho từng request.</li>
<li>Trình duyệt → (HTTP request: method, URL, header, body) → web server / servlet container → servlet (→ CSDL) → (HTTP response: mã trạng thái, header, dòng trống, body) → trình duyệt.</li>
<li>An toàn: GET, HEAD, OPTIONS, TRACE. Lũy đẳng: các method đó + PUT, DELETE. POST: không thuộc loại nào — đừng bao giờ đổi dữ liệu bằng GET.</li>
<li>2xx xong · 3xx sang chỗ khác · 4xx request của bạn sai (401 chưa đăng nhập, 403 không có quyền, 404 không có URL đó, 405 sai method) · 5xx server hỏng (500 lỗi code, 503 quá tải).</li>
<li>Cookie (<code>Set-Cookie</code> → <code>Cookie</code>) giúp HTTP không trạng thái ghi nhớ; JSESSIONID là cookie session của Tomcat.</li>
<li>Slide viết <code>javax</code>; Tomcat 10+ và Spring Boot 3 cần <code>jakarta</code> — cùng các lớp, tên gói mới.</li>
</ul>`),
    books([
      ['williams', 'Ch.1 "Introducing Java Platform, Enterprise Edition" and Ch.3 "Writing Your First Servlet"', 'Ch.1 "Introducing Java Platform, Enterprise Edition" và Ch.3 "Writing Your First Servlet"'],
      ['rfc9110', '§9 Methods (9.2.1 safe, 9.2.2 idempotent) and §15 Status Codes', '§9 Methods (9.2.1 an toàn, 9.2.2 lũy đẳng) và §15 Status Codes'],
      ['mdnHttp', '"An overview of HTTP", "HTTP request methods", "HTTP response status codes", "Using HTTP cookies"', '"An overview of HTTP", "HTTP request methods", "HTTP response status codes", "Using HTTP cookies"'],
      ['mdnHtml', '"HTML basics" (getting started)', '"HTML basics" (bắt đầu)'],
    ]),
  ].join('\n'),
};

/* ───────── 1.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · HTTP by hand: raw messages, methods, status codes, cookies, forms ───────── */
const L_on_ch1 = {
  title: '1.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · HTTP by hand: raw messages, methods, status codes, cookies, forms|||1.3 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · HTTP bằng tay: thông điệp thô, method, mã trạng thái, cookie, form',
  slug: 'prj301-on-ch1',
  type: 'VIDEO',
  description: '6 bài tập Chương 1 trên một case đặt phòng lab: đọc từng dòng một request/response thô, viết trang động bảng cửu chương có trả 400 khi dữ liệu sai, chọn đúng method và mã trạng thái (201, 204, 400, 404, 409) cho từng tình huống, dự đoán rồi kiểm chứng tính lũy đẳng, nhớ ngôn ngữ bằng cookie, viết form tìm kiếm GET có checkbox nhiều giá trị — mọi lời giải là ứng dụng chạy thật trên Tomcat 10.1 kèm response thật; 16 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.3 · Practice &amp; review</span>
<h2>HTTP by hand — six exercises on one case: booking a lab room</h2>
<p class="lead">Chapter 1 is about the conversation between browser and server. These exercises make you <em>produce</em> and <em>predict</em> that conversation: read a raw message, write a dynamic page, choose methods and status codes, predict what repeated requests do, remember a choice with a cookie, and build a form. Every solution is a small app that ran on a real Tomcat 10.1 — compare your prediction with the real response before reading the explanation.</p>
<div class="callout"><strong>How to use this page.</strong> Do each exercise on paper or in NetBeans first. Then open the solution, run it yourself if you can, and read "Why" — it explains each decision and the mark you would lose in a PE or FE.</div>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>read every line of a raw request and response</td><td>11–16</td></tr>
<tr><td>2</td><td>dynamic page with input checking (200 / 400)</td><td>5, 8, 14</td></tr>
<tr><td>3</td><td>choose method + status code for each use case</td><td>11, 13–15</td></tr>
<tr><td>4</td><td>predict repeated requests (idempotency)</td><td>13</td></tr>
<tr><td>5</td><td>remember a choice with a cookie</td><td>16</td></tr>
<tr><td>6</td><td>a search form with GET, radio and checkboxes</td><td>3–7 (+ 25–28)</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 1 · Bài 1.3 · Thực hành &amp; ôn tập</span>
<h2>HTTP bằng tay — sáu bài tập trên một case: đặt phòng lab</h2>
<p class="lead">Chương 1 nói về cuộc trò chuyện giữa trình duyệt và server. Các bài tập này bắt bạn <em>tạo ra</em> và <em>đoán trước</em> cuộc trò chuyện đó: đọc một thông điệp thô, viết một trang động, chọn method và mã trạng thái, đoán xem request lặp lại sẽ làm gì, ghi nhớ một lựa chọn bằng cookie, và dựng một form. Mỗi lời giải là một ứng dụng nhỏ đã chạy trên Tomcat 10.1 thật — hãy so dự đoán của bạn với response thật trước khi đọc phần giải thích.</p>
<div class="callout"><strong>Cách dùng trang này.</strong> Làm từng bài ra giấy hoặc trong NetBeans trước. Rồi mở lời giải, tự chạy lại nếu được, và đọc phần "Vì sao" — nó giải thích từng quyết định và chỗ bạn sẽ mất điểm trong PE hay FE.</div>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>1</td><td>đọc từng dòng của request và response thô</td><td>11–16</td></tr>
<tr><td>2</td><td>trang động có kiểm tra dữ liệu (200 / 400)</td><td>5, 8, 14</td></tr>
<tr><td>3</td><td>chọn method + mã trạng thái cho từng ca sử dụng</td><td>11, 13–15</td></tr>
<tr><td>4</td><td>dự đoán request lặp lại (lũy đẳng)</td><td>13</td></tr>
<tr><td>5</td><td>nhớ một lựa chọn bằng cookie</td><td>16</td></tr>
<tr><td>6</td><td>form tìm kiếm dùng GET, radio và checkbox</td><td>3–7 (+ 25–28)</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — Label every line of a real exchange (~10 min)</h3>
<p>A student books lab room LAB-201 for slot 2. Below is the exact request the browser sent and the response Tomcat returned. For <strong>each line</strong>, say: which part of the message it is (request line / header / blank line / body / status line), and what it means.</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /dat-phong/bookings HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 19

room=LAB-201&amp;slot=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 201
Location: bookings?id=1
Content-Type: text/plain;charset=UTF-8
Content-Length: 23

booking #1 = LAB-201@2</code></pre>
<p class="dap-an">✅ Solution.</p>
<table>
<thead><tr><th>Line</th><th>Part</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>POST /dat-phong/bookings HTTP/1.1</code></td><td>request line</td><td>method POST (create), path = context <code>/dat-phong</code> + servlet <code>/bookings</code>, protocol HTTP/1.1</td></tr>
<tr><td><code>Host: localhost:8080</code></td><td>header</td><td>which site — the only header HTTP/1.1 requires</td></tr>
<tr><td><code>Content-Type: application/x-www-form-urlencoded</code></td><td>header</td><td>the body is form data: <code>name=value&amp;name=value</code></td></tr>
<tr><td><code>Content-Length: 19</code></td><td>header</td><td>the body is 19 bytes: count <code>room=LAB-201&amp;slot=2</code></td></tr>
<tr><td>(empty)</td><td>blank line</td><td>end of headers</td></tr>
<tr><td><code>room=LAB-201&amp;slot=2</code></td><td>body</td><td>the two form fields</td></tr>
<tr><td><code>HTTP/1.1 201</code></td><td>status line</td><td>version + code 201 Created; no reason phrase (Tomcat ≥ 8.5)</td></tr>
<tr><td><code>Location: bookings?id=1</code></td><td>header</td><td>where the new booking can be read</td></tr>
<tr><td><code>Content-Type: text/plain;charset=UTF-8</code></td><td>header</td><td>body is plain text in UTF-8</td></tr>
<tr><td><code>booking #1 = LAB-201@2</code></td><td>body</td><td>the server's message</td></tr>
</tbody>
</table>
<div class="pitfall">FE wording: "An HTTP request contains a request method, a request URL, header fields and a body"; "an HTTP response contains a result code, header fields and a body". Both lists appear on slides 11 and 14 — options that add "an ACK flag" or "a response code in the request" are distractors.</div>`,
    `<h3>🧪 Bài 1 — Gọi tên từng dòng của một lần trao đổi thật (~10 phút)</h3>
<p>Một sinh viên đặt phòng lab LAB-201 cho ca 2. Dưới đây là đúng request trình duyệt đã gửi và response Tomcat trả về. Với <strong>từng dòng</strong>, hãy cho biết: nó là phần nào của thông điệp (dòng request / header / dòng trống / body / dòng trạng thái), và nghĩa là gì.</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /dat-phong/bookings HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 19

room=LAB-201&amp;slot=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 201
Location: bookings?id=1
Content-Type: text/plain;charset=UTF-8
Content-Length: 23

booking #1 = LAB-201@2</code></pre>
<p class="dap-an">✅ Lời giải.</p>
<table>
<thead><tr><th>Dòng</th><th>Phần</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td><code>POST /dat-phong/bookings HTTP/1.1</code></td><td>dòng request</td><td>method POST (tạo mới), đường dẫn = context <code>/dat-phong</code> + servlet <code>/bookings</code>, giao thức HTTP/1.1</td></tr>
<tr><td><code>Host: localhost:8080</code></td><td>header</td><td>site nào — header duy nhất HTTP/1.1 bắt buộc</td></tr>
<tr><td><code>Content-Type: application/x-www-form-urlencoded</code></td><td>header</td><td>body là dữ liệu form: <code>name=value&amp;name=value</code></td></tr>
<tr><td><code>Content-Length: 19</code></td><td>header</td><td>body dài 19 byte: đếm <code>room=LAB-201&amp;slot=2</code></td></tr>
<tr><td>(trống)</td><td>dòng trống</td><td>hết phần header</td></tr>
<tr><td><code>room=LAB-201&amp;slot=2</code></td><td>body</td><td>hai ô của form</td></tr>
<tr><td><code>HTTP/1.1 201</code></td><td>dòng trạng thái</td><td>phiên bản + mã 201 Created; không có reason phrase (Tomcat ≥ 8.5)</td></tr>
<tr><td><code>Location: bookings?id=1</code></td><td>header</td><td>lượt đặt mới đọc ở đâu</td></tr>
<tr><td><code>Content-Type: text/plain;charset=UTF-8</code></td><td>header</td><td>body là chữ thường, mã UTF-8</td></tr>
<tr><td><code>booking #1 = LAB-201@2</code></td><td>body</td><td>lời nhắn của server</td></tr>
</tbody>
</table>
<div class="pitfall">Cách đề FE diễn đạt: "An HTTP request contains a request method, a request URL, header fields and a body"; "an HTTP response contains a result code, header fields and a body". Cả hai danh sách nằm ở slide 11 và 14 — phương án thêm "ACK flag" hay "response code trong request" là phương án gây nhiễu.</div>`),
    bi(`<h3>🧪 Exercise 2 — A dynamic page that checks its input (~15 min)</h3>
<p>Write a servlet <code>/table?n=…</code> that shows the multiplication table of <code>n</code> (1–9). No <code>n</code> ⇒ table of 2. A non-number or a number outside 1–9 must answer <strong>400 Bad Request</strong> with a clear message, not a 500.</p>
<p class="ghi-chu">📄 <code>bang-cuu-chuong/src/main/java/demo/TableServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Exercise 2: a dynamic page — the multiplication table of n, built for each request
@WebServlet("/table")
public class TableServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String raw = req.getParameter("n");
        int n;
        try {
            n = (raw == null) ? 2 : Integer.parseInt(raw.trim());   // default: the table of 2
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "n must be a whole number");   // 400: the CLIENT sent bad data
            return;
        }
        if (n &lt; 1 || n &gt; 9) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "n must be between 1 and 9");
            return;
        }
        resp.setContentType("text/html;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("&lt;h1&gt;Table of " + n + "&lt;/h1&gt;");
        out.println("&lt;ul&gt;");
        for (int i = 1; i &lt;= 10; i++) out.println("&lt;li&gt;" + n + " x " + i + " = " + (n * i) + "&lt;/li&gt;");
        out.println("&lt;/ul&gt;");
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /bang-cuu-chuong/table?n=7 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 231

&lt;h1&gt;Table of 7&lt;/h1&gt;
&lt;ul&gt;
&lt;li&gt;7 x 1 = 7&lt;/li&gt;
&lt;li&gt;7 x 2 = 14&lt;/li&gt;
&lt;li&gt;7 x 3 = 21&lt;/li&gt;
&lt;li&gt;7 x 4 = 28&lt;/li&gt;
&lt;li&gt;7 x 5 = 35&lt;/li&gt;
&lt;li&gt;7 x 6 = 42&lt;/li&gt;
&lt;li&gt;7 x 7 = 49&lt;/li&gt;
&lt;li&gt;7 x 8 = 56&lt;/li&gt;
&lt;li&gt;7 x 9 = 63&lt;/li&gt;
&lt;li&gt;7 x 10 = 70&lt;/li&gt;
&lt;/ul&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /bang-cuu-chuong/table?n=abc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 809

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 400 – Bad Request
Type Status Report
Message n must be a whole number
Description The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive req … (+14 chars / ký tự)
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /bang-cuu-chuong/table?n=12 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 810

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 400 – Bad Request
Type Status Report
Message n must be between 1 and 9
Description The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive req … (+14 chars / ký tự)
Apache Tomcat/10.1.61</code></pre>
<p class="dap-an">✅ Why: <code>getParameter</code> always returns a <code>String</code> (or <code>null</code>), so the number must be parsed, and <code>Integer.parseInt("abc")</code> throws <code>NumberFormatException</code>. Uncaught, that becomes a <strong>500</strong> — "the server is broken" — which is a lie: the <em>client</em> sent bad data, so the honest answer is <strong>400</strong>. <code>sendError(400, message)</code> sets the status and lets Tomcat build the error page (the message appears in it). Note the <code>return;</code> after each <code>sendError</code>: without it the code continues and tries to write a table into a committed response.</p>`,
    `<h3>🧪 Bài 2 — Trang động biết kiểm tra dữ liệu vào (~15 phút)</h3>
<p>Viết servlet <code>/table?n=…</code> hiện bảng cửu chương của <code>n</code> (1–9). Không có <code>n</code> ⇒ bảng 2. Không phải số, hoặc số ngoài 1–9, phải trả <strong>400 Bad Request</strong> kèm thông báo rõ ràng, không được ra 500.</p>
<p class="ghi-chu">📄 <code>bang-cuu-chuong/src/main/java/demo/TableServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Bài 2: trang động — bảng cửu chương của n, dựng cho từng request
@WebServlet("/table")
public class TableServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String raw = req.getParameter("n");
        int n;
        try {
            n = (raw == null) ? 2 : Integer.parseInt(raw.trim());   // mặc định: bảng 2
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "n must be a whole number");   // 400: CLIENT gửi dữ liệu sai
            return;
        }
        if (n &lt; 1 || n &gt; 9) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "n must be between 1 and 9");
            return;
        }
        resp.setContentType("text/html;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        out.println("&lt;h1&gt;Table of " + n + "&lt;/h1&gt;");
        out.println("&lt;ul&gt;");
        for (int i = 1; i &lt;= 10; i++) out.println("&lt;li&gt;" + n + " x " + i + " = " + (n * i) + "&lt;/li&gt;");
        out.println("&lt;/ul&gt;");
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /bang-cuu-chuong/table?n=7 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 231

&lt;h1&gt;Table of 7&lt;/h1&gt;
&lt;ul&gt;
&lt;li&gt;7 x 1 = 7&lt;/li&gt;
&lt;li&gt;7 x 2 = 14&lt;/li&gt;
&lt;li&gt;7 x 3 = 21&lt;/li&gt;
&lt;li&gt;7 x 4 = 28&lt;/li&gt;
&lt;li&gt;7 x 5 = 35&lt;/li&gt;
&lt;li&gt;7 x 6 = 42&lt;/li&gt;
&lt;li&gt;7 x 7 = 49&lt;/li&gt;
&lt;li&gt;7 x 8 = 56&lt;/li&gt;
&lt;li&gt;7 x 9 = 63&lt;/li&gt;
&lt;li&gt;7 x 10 = 70&lt;/li&gt;
&lt;/ul&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /bang-cuu-chuong/table?n=abc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 809

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 400 – Bad Request
Type Status Report
Message n must be a whole number
Description The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive req … (+14 chars / ký tự)
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /bang-cuu-chuong/table?n=12 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 810

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 400 – Bad Request
Type Status Report
Message n must be between 1 and 9
Description The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive req … (+14 chars / ký tự)
Apache Tomcat/10.1.61</code></pre>
<p class="dap-an">✅ Vì sao: <code>getParameter</code> luôn trả <code>String</code> (hoặc <code>null</code>), nên phải đổi sang số, và <code>Integer.parseInt("abc")</code> ném <code>NumberFormatException</code>. Không bắt thì nó thành <strong>500</strong> — "server hỏng" — mà như vậy là nói sai: chính <em>client</em> gửi dữ liệu sai, nên câu trả lời trung thực là <strong>400</strong>. <code>sendError(400, message)</code> đặt mã trạng thái và để Tomcat dựng trang lỗi (thông báo hiện trong đó). Để ý <code>return;</code> sau mỗi <code>sendError</code>: thiếu nó code chạy tiếp và cố viết bảng vào một response đã commit.</p>`),
    bi(`<h3>🧪 Exercise 3 — Choose the method and the status code (~15 min)</h3>
<p>For a lab-booking web app, fill in the method and the status code the server should answer for each situation.</p>
<table>
<thead><tr><th>Situation</th><th>Method</th><th>Status</th></tr></thead>
<tbody>
<tr><td>1. show my bookings</td><td>?</td><td>?</td></tr>
<tr><td>2. book LAB-201 slot 2 (free)</td><td>?</td><td>?</td></tr>
<tr><td>3. book LAB-201 slot 2 again (already taken)</td><td>?</td><td>?</td></tr>
<tr><td>4. book with the room field empty</td><td>?</td><td>?</td></tr>
<tr><td>5. cancel booking #1</td><td>?</td><td>?</td></tr>
<tr><td>6. cancel booking #1 again</td><td>?</td><td>?</td></tr>
<tr><td>7. open the bookings page without being logged in</td><td>GET</td><td>?</td></tr>
<tr><td>8. a student opens the admin report</td><td>GET</td><td>?</td></tr>
<tr><td>9. the database server is down</td><td>any</td><td>?</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Solution — situations 1–6 were run for real on the <code>dat-phong</code> app:</p>
<table>
<thead><tr><th>Situation</th><th>Method</th><th>Status</th><th>Why</th></tr></thead>
<tbody>
<tr><td>1</td><td>GET</td><td>200</td><td>read only, safe</td></tr>
<tr><td>2</td><td>POST</td><td>201 Created + <code>Location</code></td><td>creates a new resource</td></tr>
<tr><td>3</td><td>POST</td><td>409 Conflict</td><td>the request is valid but clashes with the current state</td></tr>
<tr><td>4</td><td>POST</td><td>400 Bad Request</td><td>the client's data is incomplete</td></tr>
<tr><td>5</td><td>DELETE</td><td>204 No Content</td><td>done, nothing to send back</td></tr>
<tr><td>6</td><td>DELETE</td><td>404 Not Found</td><td>nothing left to delete — state unchanged (idempotent)</td></tr>
<tr><td>7</td><td>GET</td><td>401 (or, in a web page app, 302 to the login page)</td><td>not authenticated</td></tr>
<tr><td>8</td><td>GET</td><td>403 Forbidden</td><td>authenticated, not allowed</td></tr>
<tr><td>9</td><td>any</td><td>500 / 503</td><td>server-side failure; 503 if it is temporary and known</td></tr>
</tbody>
</table>
<p class="ghi-chu">📄 <code>dat-phong/src/main/java/demo/BookingServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override   // create: 201, or 400 (bad input) / 409 (slot taken)
protected synchronized void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    String room = req.getParameter("room"), slot = req.getParameter("slot");
    if (room == null || slot == null || room.isBlank() || slot.isBlank()) {
        resp.sendError(400, "room and slot are required");
        return;
    }
    String key = room + "@" + slot;
    if (bookings.containsValue(key)) {
        resp.sendError(409, key + " is already booked");     // 409 Conflict
        return;
    }
    int id = nextId++;
    bookings.put(id, key);
    resp.setStatus(201);
    resp.setHeader("Location", "bookings?id=" + id);
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("booking #" + id + " = " + key);
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /dat-phong/bookings HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 19

room=LAB-201&amp;slot=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 409
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 703

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 409 – Conflict
Type Status Report
Message LAB-201@2 is already booked
Description The request could not be completed due to a conflict with the current state of the target resource.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /dat-phong/bookings HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 12

room=LAB-203</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 811

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 400 – Bad Request
Type Status Report
Message room and slot are required
Description The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive req … (+14 chars / ký tự)
Apache Tomcat/10.1.61</code></pre>
<div class="pitfall">401 vs 403 is a classic FE trap: 401 = "who are you?" (log in), 403 = "I know who you are, and the answer is no". In the PE, a student page that answers 200 with an empty admin table instead of blocking access loses the Filter marks (Chapter 8).</div>`,
    `<h3>🧪 Bài 3 — Chọn method và mã trạng thái (~15 phút)</h3>
<p>Với một ứng dụng web đặt phòng lab, điền method và mã trạng thái server nên trả cho từng tình huống.</p>
<table>
<thead><tr><th>Tình huống</th><th>Method</th><th>Mã</th></tr></thead>
<tbody>
<tr><td>1. xem các lượt đặt của tôi</td><td>?</td><td>?</td></tr>
<tr><td>2. đặt LAB-201 ca 2 (còn trống)</td><td>?</td><td>?</td></tr>
<tr><td>3. đặt LAB-201 ca 2 lần nữa (đã có người đặt)</td><td>?</td><td>?</td></tr>
<tr><td>4. đặt mà bỏ trống ô phòng</td><td>?</td><td>?</td></tr>
<tr><td>5. huỷ lượt đặt #1</td><td>?</td><td>?</td></tr>
<tr><td>6. huỷ lượt đặt #1 lần nữa</td><td>?</td><td>?</td></tr>
<tr><td>7. mở trang lượt đặt khi chưa đăng nhập</td><td>GET</td><td>?</td></tr>
<tr><td>8. sinh viên mở báo cáo của admin</td><td>GET</td><td>?</td></tr>
<tr><td>9. server CSDL bị sập</td><td>bất kỳ</td><td>?</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Lời giải — tình huống 1–6 đã chạy thật trên ứng dụng <code>dat-phong</code>:</p>
<table>
<thead><tr><th>Tình huống</th><th>Method</th><th>Mã</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>1</td><td>GET</td><td>200</td><td>chỉ đọc, an toàn</td></tr>
<tr><td>2</td><td>POST</td><td>201 Created + <code>Location</code></td><td>tạo một tài nguyên mới</td></tr>
<tr><td>3</td><td>POST</td><td>409 Conflict</td><td>request hợp lệ nhưng đụng với trạng thái hiện tại</td></tr>
<tr><td>4</td><td>POST</td><td>400 Bad Request</td><td>dữ liệu client gửi thiếu</td></tr>
<tr><td>5</td><td>DELETE</td><td>204 No Content</td><td>xong, không có gì gửi lại</td></tr>
<tr><td>6</td><td>DELETE</td><td>404 Not Found</td><td>không còn gì để xoá — trạng thái không đổi (lũy đẳng)</td></tr>
<tr><td>7</td><td>GET</td><td>401 (hoặc, ở ứng dụng trang web, 302 về trang đăng nhập)</td><td>chưa xác thực</td></tr>
<tr><td>8</td><td>GET</td><td>403 Forbidden</td><td>đã xác thực, nhưng không được phép</td></tr>
<tr><td>9</td><td>bất kỳ</td><td>500 / 503</td><td>lỗi phía server; 503 nếu biết là tạm thời</td></tr>
</tbody>
</table>
<p class="ghi-chu">📄 <code>dat-phong/src/main/java/demo/BookingServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override   // tạo mới: 201, hoặc 400 (dữ liệu sai) / 409 (ca đã có người đặt)
protected synchronized void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    String room = req.getParameter("room"), slot = req.getParameter("slot");
    if (room == null || slot == null || room.isBlank() || slot.isBlank()) {
        resp.sendError(400, "room and slot are required");
        return;
    }
    String key = room + "@" + slot;
    if (bookings.containsValue(key)) {
        resp.sendError(409, key + " is already booked");     // 409 Xung đột
        return;
    }
    int id = nextId++;
    bookings.put(id, key);
    resp.setStatus(201);
    resp.setHeader("Location", "bookings?id=" + id);
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("booking #" + id + " = " + key);
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /dat-phong/bookings HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 19

room=LAB-201&amp;slot=2</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 409
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 703

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 409 – Conflict
Type Status Report
Message LAB-201@2 is already booked
Description The request could not be completed due to a conflict with the current state of the target resource.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /dat-phong/bookings HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 12

room=LAB-203</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 400
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 811

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 400 – Bad Request
Type Status Report
Message room and slot are required
Description The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive req … (+14 chars / ký tự)
Apache Tomcat/10.1.61</code></pre>
<div class="pitfall">401 hay 403 là bẫy FE kinh điển: 401 = "bạn là ai?" (đăng nhập đi), 403 = "tôi biết bạn là ai, và câu trả lời là không". Trong PE, trang của sinh viên mà trả 200 kèm bảng admin trống thay vì chặn truy cập sẽ mất điểm phần Filter (Chương 8).</div>`),
    bi(`<h3>🧪 Exercise 4 — Predict, then check: repeating requests (~10 min)</h3>
<p>Starting from booking #1 (LAB-201@2) and #2 (LAB-202@2), predict the answer to each request and the final list:</p>
<ol>
<li><code>DELETE /dat-phong/bookings?id=1</code></li>
<li>the same <code>DELETE</code> again</li>
<li><code>GET /dat-phong/bookings</code></li>
</ol>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /dat-phong/bookings HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

2 booking(s)
#1 LAB-201@2
#2 LAB-202@2</code></pre>
<p class="ghi-chu">📄 <code>dat-phong/src/main/java/demo/BookingServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override   // cancel: 204, or 404 if it does not exist (any more)
protected synchronized void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    int id = Integer.parseInt(req.getParameter("id"));
    if (bookings.remove(id) == null) resp.sendError(404, "no booking #" + id);
    else resp.setStatus(204);
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">DELETE /dat-phong/bookings?id=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 204
</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">DELETE /dat-phong/bookings?id=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 718

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message no booking #1
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /dat-phong/bookings HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 26

1 booking(s)
#2 LAB-202@2</code></pre>
<p class="dap-an">✅ 204, then 404, then one booking left (#2). The two DELETE <em>answers</em> differ, but the <em>state</em> after one or two DELETEs is identical — that is what idempotent means. In exercise 3, repeating the POST did <strong>not</strong> leave the state unchanged (it was rejected with 409 only because the servlet checks for duplicates; without that check you would get two identical bookings). That is why browsers warn before re-sending a POST.</p>`,
    `<h3>🧪 Bài 4 — Đoán trước, rồi kiểm chứng: request lặp lại (~10 phút)</h3>
<p>Bắt đầu từ lượt đặt #1 (LAB-201@2) và #2 (LAB-202@2), đoán câu trả lời của từng request và danh sách cuối cùng:</p>
<ol>
<li><code>DELETE /dat-phong/bookings?id=1</code></li>
<li>lại đúng <code>DELETE</code> đó</li>
<li><code>GET /dat-phong/bookings</code></li>
</ol>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /dat-phong/bookings HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 39

2 booking(s)
#1 LAB-201@2
#2 LAB-202@2</code></pre>
<p class="ghi-chu">📄 <code>dat-phong/src/main/java/demo/BookingServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override   // huỷ: 204, hoặc 404 nếu không (còn) tồn tại
protected synchronized void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    int id = Integer.parseInt(req.getParameter("id"));
    if (bookings.remove(id) == null) resp.sendError(404, "no booking #" + id);
    else resp.setStatus(204);
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">DELETE /dat-phong/bookings?id=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 204
</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">DELETE /dat-phong/bookings?id=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 718

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message no booking #1
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /dat-phong/bookings HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 26

1 booking(s)
#2 LAB-202@2</code></pre>
<p class="dap-an">✅ 204, rồi 404, rồi còn một lượt đặt (#2). Hai <em>câu trả lời</em> của DELETE khác nhau, nhưng <em>trạng thái</em> sau một hay hai lần DELETE là y hệt — đó chính là nghĩa của lũy đẳng. Ở bài 3, lặp lại POST <strong>không</strong> giữ nguyên trạng thái (nó bị từ chối bằng 409 chỉ vì servlet có kiểm tra trùng; bỏ phép kiểm đó đi là bạn có hai lượt đặt giống hệt nhau). Đó là lý do trình duyệt cảnh báo trước khi gửi lại một POST.</p>`),
    bi(`<h3>🧪 Exercise 5 — Remember the language with a cookie (~15 min)</h3>
<p><code>/greet</code> says "Xin chào!" by default. <code>/greet?lang=en</code> switches to English <strong>and remembers it for 30 days</strong>: later visits without the parameter stay in English. A different browser (no cookie) starts again in Vietnamese. No session, no database.</p>
<p class="ghi-chu">📄 <code>ngon-ngu/src/main/java/demo/GreetServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Exercise 5: remember the language with a cookie — no session, no database
@WebServlet("/greet")
public class GreetServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String lang = req.getParameter("lang");                 // 1. explicit choice in the URL
        if (lang != null) {
            Cookie c = new Cookie("lang", lang);
            c.setMaxAge(30 * 24 * 60 * 60);                      // keep 30 days
            c.setPath(req.getContextPath());                      // send it back for the whole app
            resp.addCookie(c);
        } else if (req.getCookies() != null) {                  // 2. otherwise the remembered choice
            for (Cookie c : req.getCookies()) if ("lang".equals(c.getName())) lang = c.getValue();
        }
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println("en".equals(lang) ? "Hello!" : "Xin chào!");   // 3. default Vietnamese
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ngon-ngu/greet HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

Xin chào!</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ngon-ngu/greet?lang=en HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: lang=en; Max-Age=2592000; Expires=…; Path=/ngon-ngu
Content-Type: text/plain;charset=UTF-8
Content-Length: 7

Hello!</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ngon-ngu/greet HTTP/1.1
Host: localhost:8080
Cookie: lang=en</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 7

Hello!</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ngon-ngu/greet HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

Xin chào!</code></pre>
<p class="dap-an">✅ Why: the server cannot remember anything between requests by itself, so the preference is stored <em>in the browser</em>: <code>Set-Cookie: lang=en; Max-Age=2592000; …; Path=/ngon-ngu</code>. From then on the browser adds <code>Cookie: lang=en</code> to every request under <code>/ngon-ngu</code>. <code>Max-Age</code> is in seconds (30 × 24 × 3600); without it the cookie dies when the browser closes. <code>setPath(getContextPath())</code> makes it valid for the whole app, not only for the folder of <code>/greet</code>.</p>
<div class="pitfall">Cookies are stored and editable by the user: fine for a language choice, <strong>never</strong> for "role=admin" or a price. Things the user must not change go in the session (server side) — Chapter 4.</div>`,
    `<h3>🧪 Bài 5 — Nhớ ngôn ngữ bằng cookie (~15 phút)</h3>
<p><code>/greet</code> mặc định chào "Xin chào!". <code>/greet?lang=en</code> chuyển sang tiếng Anh <strong>và nhớ lựa chọn đó 30 ngày</strong>: các lần sau không có tham số vẫn là tiếng Anh. Một trình duyệt khác (không có cookie) bắt đầu lại bằng tiếng Việt. Không session, không CSDL.</p>
<p class="ghi-chu">📄 <code>ngon-ngu/src/main/java/demo/GreetServlet.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// Bài 5: nhớ ngôn ngữ bằng cookie — không session, không CSDL
@WebServlet("/greet")
public class GreetServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String lang = req.getParameter("lang");                 // 1. chọn rõ trên URL
        if (lang != null) {
            Cookie c = new Cookie("lang", lang);
            c.setMaxAge(30 * 24 * 60 * 60);                      // giữ 30 ngày
            c.setPath(req.getContextPath());                      // gửi lại cho cả ứng dụng
            resp.addCookie(c);
        } else if (req.getCookies() != null) {                  // 2. không thì lấy lựa chọn đã nhớ
            for (Cookie c : req.getCookies()) if ("lang".equals(c.getName())) lang = c.getValue();
        }
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println("en".equals(lang) ? "Hello!" : "Xin chào!");   // 3. mặc định tiếng Việt
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ngon-ngu/greet HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

Xin chào!</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ngon-ngu/greet?lang=en HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: lang=en; Max-Age=2592000; Expires=…; Path=/ngon-ngu
Content-Type: text/plain;charset=UTF-8
Content-Length: 7

Hello!</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ngon-ngu/greet HTTP/1.1
Host: localhost:8080
Cookie: lang=en</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 7

Hello!</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ngon-ngu/greet HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

Xin chào!</code></pre>
<p class="dap-an">✅ Vì sao: tự server không nhớ được gì giữa các request, nên lựa chọn được cất <em>trong trình duyệt</em>: <code>Set-Cookie: lang=en; Max-Age=2592000; …; Path=/ngon-ngu</code>. Từ đó trình duyệt thêm <code>Cookie: lang=en</code> vào mọi request dưới <code>/ngon-ngu</code>. <code>Max-Age</code> tính bằng giây (30 × 24 × 3600); không đặt thì cookie mất khi đóng trình duyệt. <code>setPath(getContextPath())</code> làm nó có hiệu lực cho cả ứng dụng, không chỉ thư mục của <code>/greet</code>.</p>
<div class="pitfall">Cookie được người dùng lưu và sửa được: dùng cho lựa chọn ngôn ngữ thì ổn, <strong>không bao giờ</strong> dùng cho "role=admin" hay giá tiền. Thứ người dùng không được đổi thì đặt trong session (phía server) — Chương 4.</div>`),
    bi(`<h3>🧪 Exercise 6 — A search form with GET (~15 min)</h3>
<p>Write a static page "Find a free lab room" with: a building drop-down (Alpha/Beta), a required date, a slot radio group (1–3, slot 1 checked), two checkboxes "need" (projector, PCs) and a Search button. Searching must produce a URL that can be bookmarked. Then predict the exact URL for: Beta, 2026-10-20, slot 2, both checkboxes.</p>
<p class="ghi-chu">📄 <code>trang-dat-phong/src/main/webapp/index.html</code></p>
<pre class="web-src"><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;LabFlow — find a free lab&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Find a free lab room&lt;/h1&gt;
    &lt;form action="index.html" method="get"&gt;
        &lt;label&gt;Building:
            &lt;select name="building"&gt;
                &lt;option value="alpha"&gt;Alpha&lt;/option&gt;
                &lt;option value="beta"&gt;Beta&lt;/option&gt;
            &lt;/select&gt;
        &lt;/label&gt;
        &lt;br&gt;
        &lt;label&gt;Date: &lt;input type="date" name="date" required&gt;&lt;/label&gt;
        &lt;br&gt;
        Slot:
        &lt;input type="radio" name="slot" value="1" checked&gt; 1
        &lt;input type="radio" name="slot" value="2"&gt; 2
        &lt;input type="radio" name="slot" value="3"&gt; 3
        &lt;br&gt;
        &lt;label&gt;&lt;input type="checkbox" name="need" value="projector"&gt; projector&lt;/label&gt;
        &lt;label&gt;&lt;input type="checkbox" name="need" value="pc"&gt; PCs&lt;/label&gt;
        &lt;br&gt;
        &lt;button type="submit"&gt;Search&lt;/button&gt;
    &lt;/form&gt;
    &lt;p&gt;Rules: &lt;a href="rules.html"&gt;read before booking&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /trang-dat-phong/index.html?building=beta&amp;date=2026-10-20&amp;slot=2&amp;need=projector&amp;need=pc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"1013-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 1013

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
… (28 more lines / còn 28 dòng)</code></pre>
<p class="dap-an">✅ Why each choice: <code>method="get"</code> because searching changes nothing and the result should be bookmarkable — the fields become the query string in the order they appear in the form. The radio buttons share <code>name="slot"</code> so only one is sent; the checkboxes share <code>name="need"</code> so <em>both</em> are sent: <code>need=projector&amp;need=pc</code> — in a servlet you read them with <code>getParameterValues("need")</code> (exercise 4 of Chapter 2). The response is just the page again: a static file ignores its query string; Chapter 2 puts a servlet behind it.</p>`,
    `<h3>🧪 Bài 6 — Form tìm kiếm dùng GET (~15 phút)</h3>
<p>Viết trang tĩnh "Find a free lab room" gồm: danh sách thả xuống chọn toà (Alpha/Beta), ô ngày bắt buộc, nhóm radio chọn ca (1–3, mặc định ca 1), hai checkbox "need" (projector, PCs) và nút Search. Tìm kiếm phải tạo ra một URL lưu bookmark được. Sau đó đoán chính xác URL khi chọn: Beta, 2026-10-20, ca 2, cả hai checkbox.</p>
<p class="ghi-chu">📄 <code>trang-dat-phong/src/main/webapp/index.html</code></p>
<pre class="web-src"><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;LabFlow — find a free lab&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Find a free lab room&lt;/h1&gt;
    &lt;form action="index.html" method="get"&gt;
        &lt;label&gt;Building:
            &lt;select name="building"&gt;
                &lt;option value="alpha"&gt;Alpha&lt;/option&gt;
                &lt;option value="beta"&gt;Beta&lt;/option&gt;
            &lt;/select&gt;
        &lt;/label&gt;
        &lt;br&gt;
        &lt;label&gt;Date: &lt;input type="date" name="date" required&gt;&lt;/label&gt;
        &lt;br&gt;
        Slot:
        &lt;input type="radio" name="slot" value="1" checked&gt; 1
        &lt;input type="radio" name="slot" value="2"&gt; 2
        &lt;input type="radio" name="slot" value="3"&gt; 3
        &lt;br&gt;
        &lt;label&gt;&lt;input type="checkbox" name="need" value="projector"&gt; projector&lt;/label&gt;
        &lt;label&gt;&lt;input type="checkbox" name="need" value="pc"&gt; PCs&lt;/label&gt;
        &lt;br&gt;
        &lt;button type="submit"&gt;Search&lt;/button&gt;
    &lt;/form&gt;
    &lt;p&gt;Rules: &lt;a href="rules.html"&gt;read before booking&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /trang-dat-phong/index.html?building=beta&amp;date=2026-10-20&amp;slot=2&amp;need=projector&amp;need=pc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"1013-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 1013

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
… (28 more lines / còn 28 dòng)</code></pre>
<p class="dap-an">✅ Vì sao từng lựa chọn: <code>method="get"</code> vì tìm kiếm không đổi gì và kết quả nên lưu bookmark được — các ô thành query string theo đúng thứ tự xuất hiện trong form. Các nút radio dùng chung <code>name="slot"</code> nên chỉ một giá trị được gửi; các checkbox dùng chung <code>name="need"</code> nên <em>cả hai</em> được gửi: <code>need=projector&amp;need=pc</code> — trong servlet bạn đọc chúng bằng <code>getParameterValues("need")</code> (bài 4 của Chương 2). Response chỉ là lại trang đó: file tĩnh bỏ qua query string; Chương 2 đặt một servlet phía sau nó.</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>HTTP request</strong></td><td>yêu cầu HTTP</td><td>The text a client sends: request line (method, URL, version), headers, a blank line, an optional body.</td></tr>
<tr><td><strong>HTTP response</strong></td><td>phản hồi HTTP</td><td>The text a server returns: status line, headers, a blank line, the body.</td></tr>
<tr><td><strong>method</strong></td><td>phương thức (GET, POST…)</td><td>The verb of a request: what the client wants done with the resource.</td></tr>
<tr><td><strong>status code</strong></td><td>mã trạng thái</td><td>A 3-digit number; the first digit gives the class (2 success, 3 redirect, 4 client error, 5 server error).</td></tr>
<tr><td><strong>header</strong></td><td>trường đầu (header)</td><td>A "Name: value" line carrying extra information, such as Content-Type or Cookie.</td></tr>
<tr><td><strong>safe method</strong></td><td>method an toàn</td><td>A method that only reads and never changes the server: GET, HEAD, OPTIONS, TRACE.</td></tr>
<tr><td><strong>idempotent</strong></td><td>lũy đẳng</td><td>Sending the request once or many times leaves the same state (safe methods, PUT, DELETE).</td></tr>
<tr><td><strong>servlet</strong></td><td>servlet</td><td>A Java class run by a container to answer HTTP requests.</td></tr>
<tr><td><strong>servlet container</strong></td><td>bộ chứa servlet</td><td>The program (Tomcat) that creates servlets, calls them and manages sessions.</td></tr>
<tr><td><strong>static page</strong></td><td>trang tĩnh</td><td>A file sent unchanged; the same bytes for every visitor.</td></tr>
<tr><td><strong>dynamic page</strong></td><td>trang động</td><td>HTML written by a program for this particular request.</td></tr>
<tr><td><strong>query string</strong></td><td>chuỗi truy vấn</td><td>The part of a URL after "?": name=value pairs joined by "&amp;".</td></tr>
<tr><td><strong>cookie</strong></td><td>cookie</td><td>A small name=value the server asks the browser to store and send back.</td></tr>
<tr><td><strong>Content-Type</strong></td><td>kiểu nội dung</td><td>The header that says what the body is (text/html, text/plain…) and its charset.</td></tr>
<tr><td><strong>context path</strong></td><td>đường dẫn ngữ cảnh</td><td>The first part of the URL, naming the web application, e.g. /dat-phong.</td></tr>
<tr><td><strong>jakarta namespace</strong></td><td>không gian tên jakarta</td><td>The package name used by Tomcat 10+ and Spring Boot 3 instead of javax.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>HTTP request</strong></td><td>yêu cầu HTTP</td><td>Đoạn chữ client gửi: dòng request (method, URL, phiên bản), các header, một dòng trống, body tuỳ có.</td></tr>
<tr><td><strong>HTTP response</strong></td><td>phản hồi HTTP</td><td>Đoạn chữ server trả về: dòng trạng thái, các header, một dòng trống, body.</td></tr>
<tr><td><strong>method</strong></td><td>phương thức (GET, POST…)</td><td>Động từ của request: client muốn làm gì với tài nguyên.</td></tr>
<tr><td><strong>status code</strong></td><td>mã trạng thái</td><td>Số 3 chữ số; chữ số đầu cho biết nhóm (2 thành công, 3 chuyển hướng, 4 lỗi client, 5 lỗi server).</td></tr>
<tr><td><strong>header</strong></td><td>trường đầu (header)</td><td>Một dòng "Tên: giá trị" mang thông tin thêm, như Content-Type hay Cookie.</td></tr>
<tr><td><strong>safe method</strong></td><td>method an toàn</td><td>Method chỉ đọc, không bao giờ đổi server: GET, HEAD, OPTIONS, TRACE.</td></tr>
<tr><td><strong>idempotent</strong></td><td>lũy đẳng</td><td>Gửi request một hay nhiều lần đều để lại cùng trạng thái (method an toàn, PUT, DELETE).</td></tr>
<tr><td><strong>servlet</strong></td><td>servlet</td><td>Một lớp Java do container chạy để trả lời HTTP request.</td></tr>
<tr><td><strong>servlet container</strong></td><td>bộ chứa servlet</td><td>Chương trình (Tomcat) tạo servlet, gọi chúng và quản lý session.</td></tr>
<tr><td><strong>static page</strong></td><td>trang tĩnh</td><td>Một file gửi nguyên vẹn; mọi người truy cập nhận cùng các byte đó.</td></tr>
<tr><td><strong>dynamic page</strong></td><td>trang động</td><td>HTML được một chương trình viết ra cho riêng request này.</td></tr>
<tr><td><strong>query string</strong></td><td>chuỗi truy vấn</td><td>Phần của URL sau dấu "?": các cặp name=value nối bằng "&amp;".</td></tr>
<tr><td><strong>cookie</strong></td><td>cookie</td><td>Một cặp name=value nhỏ server nhờ trình duyệt cất và gửi lại.</td></tr>
<tr><td><strong>Content-Type</strong></td><td>kiểu nội dung</td><td>Header cho biết body là gì (text/html, text/plain…) và bảng mã của nó.</td></tr>
<tr><td><strong>context path</strong></td><td>đường dẫn ngữ cảnh</td><td>Phần đầu của URL, gọi tên ứng dụng web, vd /dat-phong.</td></tr>
<tr><td><strong>jakarta namespace</strong></td><td>không gian tên jakarta</td><td>Tên gói mà Tomcat 10+ và Spring Boot 3 dùng thay cho javax.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 1</h2>
<ol>
<li>HTML describes a page; a servlet writes the page; Tomcat runs the servlet.</li>
<li>Request = method + URL + headers + blank line + optional body. Response = status + headers + blank line + body.</li>
<li>GET reads (URL parameters, bookmarkable); POST sends data in the body (not encrypted — use HTTPS).</li>
<li>Safe: GET, HEAD, OPTIONS, TRACE. Idempotent: those + PUT, DELETE. POST: neither.</li>
<li>2xx done (200, 201 + Location, 204) · 3xx elsewhere (302, 304) · 4xx client (400, 401, 403, 404, 405, 409) · 5xx server (500, 501, 503).</li>
<li>Bad input from the client deserves 400, not a 500 stack trace.</li>
<li>Cookies (<code>Set-Cookie</code> → <code>Cookie</code>) make HTTP remember; keep only harmless data in them.</li>
<li>Slides say <code>javax</code>; Tomcat 10+ needs <code>jakarta</code>.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 1</h2>
<ol>
<li>HTML mô tả trang; servlet viết ra trang; Tomcat chạy servlet.</li>
<li>Request = method + URL + header + dòng trống + body tuỳ có. Response = mã trạng thái + header + dòng trống + body.</li>
<li>GET để đọc (tham số trên URL, lưu bookmark được); POST gửi dữ liệu trong body (không được mã hoá — hãy dùng HTTPS).</li>
<li>An toàn: GET, HEAD, OPTIONS, TRACE. Lũy đẳng: các method đó + PUT, DELETE. POST: không thuộc loại nào.</li>
<li>2xx xong (200, 201 + Location, 204) · 3xx sang chỗ khác (302, 304) · 4xx lỗi client (400, 401, 403, 404, 405, 409) · 5xx lỗi server (500, 501, 503).</li>
<li>Client gửi dữ liệu sai thì trả 400, không phải một trang 500 kèm stack trace.</li>
<li>Cookie (<code>Set-Cookie</code> → <code>Cookie</code>) giúp HTTP ghi nhớ; chỉ để dữ liệu vô hại trong đó.</li>
<li>Slide viết <code>javax</code>; Tomcat 10+ cần <code>jakarta</code>.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (prj301-quiz-ch1) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) What does an HTTP response contain?|||(Dạng câu FE) Một HTTP response chứa những gì?',
      options: ['A request method and a request URL|||Một method của request và một URL của request', 'A result code and an ACK flag|||Một mã kết quả và một cờ ACK', 'Only a body, because headers belong to requests|||Chỉ có body, vì header là của request', 'A result (status) code, header fields and a body|||Một mã kết quả (mã trạng thái), các trường header và một body'],
      correctIndex: 3,
      points: 1,
      explanation: 'Slide 14: a response has a status code, header fields and a body — and the status and headers are sent before the body. A describes a request; ACK is a TCP flag, not part of HTTP; responses have headers too (Content-Type, Set-Cookie…).|||Slide 14: một response có mã trạng thái, các trường header và body — và mã trạng thái cùng header được gửi trước body. A là thành phần của request; ACK là cờ của TCP, không thuộc HTTP; response cũng có header (Content-Type, Set-Cookie…).' },
    { id: 'q2',
      question: 'A login form uses method="get". What is the main problem?|||Một form đăng nhập dùng method="get". Vấn đề chính là gì?',
      options: ['The password appears in the URL, so it ends up in the address bar, history and server logs|||Mật khẩu hiện trên URL, nên nằm luôn trên thanh địa chỉ, lịch sử duyệt web và log của server', 'GET encrypts the data, so the server cannot read the password|||GET mã hoá dữ liệu, nên server không đọc được mật khẩu', 'GET cannot send more than one parameter|||GET không gửi được quá một tham số', "The servlet's doPost method will be called twice|||Phương thức doPost của servlet sẽ bị gọi hai lần"],
      correctIndex: 0,
      points: 1,
      explanation: 'GET puts form data into the query string of the URL, which is visible and stored in many places — never use it for passwords. B is false: neither GET nor POST encrypts anything (HTTPS does). C: a query string can carry many name=value pairs. D: a GET request calls doGet, not doPost.|||GET đặt dữ liệu form vào query string của URL, thứ hiện ra và bị lưu ở nhiều nơi — đừng bao giờ dùng cho mật khẩu. B sai: cả GET lẫn POST đều không mã hoá gì (HTTPS mới mã hoá). C: query string chở được nhiều cặp name=value. D: request GET gọi doGet, không gọi doPost.' },
    { id: 'q3',
      question: 'A student is logged in, but opens a page reserved for administrators. Which status code fits best?|||Một sinh viên đã đăng nhập, nhưng mở một trang chỉ dành cho quản trị viên. Mã trạng thái nào hợp nhất?',
      options: ['401 Unauthorized|||401 Unauthorized', '404 Not Found|||404 Not Found', '403 Forbidden|||403 Forbidden', '503 Service Unavailable|||503 Service Unavailable'],
      correctIndex: 2,
      points: 1,
      explanation: '403 means "I know who you are, and you are not allowed". 401, despite its name, means "not authenticated — log in first", which is wrong here because the student is logged in. 404 means the resource does not exist; 503 means the server is temporarily overloaded or in maintenance.|||403 nghĩa là "tôi biết bạn là ai, và bạn không được phép". 401, dù tên là "unauthorized", nghĩa là "chưa xác thực — đăng nhập trước đã", sai ở đây vì sinh viên đã đăng nhập. 404 nghĩa là tài nguyên không tồn tại; 503 nghĩa là server tạm thời quá tải hoặc đang bảo trì.' },
    { id: 'q4',
      question: 'Which group lists only idempotent methods?|||Nhóm nào chỉ gồm các method lũy đẳng?',
      options: ['GET, POST, PUT|||GET, POST, PUT', 'GET, PUT, DELETE|||GET, PUT, DELETE', 'POST, DELETE, OPTIONS|||POST, DELETE, OPTIONS', 'POST and PATCH only|||Chỉ POST và PATCH'],
      correctIndex: 1,
      points: 1,
      explanation: 'Idempotent = repeating the request leaves the same state: the safe methods (GET, HEAD, OPTIONS, TRACE) plus PUT and DELETE. Every other option contains POST, which may create a new resource each time — two identical POSTs created two notes in the slide 13 demo.|||Lũy đẳng = lặp lại request vẫn để lại cùng trạng thái: các method an toàn (GET, HEAD, OPTIONS, TRACE) cộng PUT và DELETE. Mọi phương án khác đều có POST, method có thể tạo tài nguyên mới mỗi lần — hai POST giống hệt nhau đã tạo hai ghi chú trong demo của slide 13.' },
    { id: 'q5',
      question: 'On Tomcat 10.1 a servlet answers successfully. Which first line will the raw response show?|||Trên Tomcat 10.1 một servlet trả lời thành công. Dòng đầu của response thô sẽ là gì?',
      options: ['GET /app/hello HTTP/1.1|||GET /app/hello HTTP/1.1', '200 OK HTTP/1.1|||200 OK HTTP/1.1', 'Content-Type: text/html|||Content-Type: text/html', 'HTTP/1.1 200|||HTTP/1.1 200'],
      correctIndex: 3,
      points: 1,
      explanation: 'The status line is [HTTP version] [status code] [reason phrase]; Tomcat 8.5+ no longer sends the reason phrase, so the real line is "HTTP/1.1 200" (clients must ignore the phrase anyway). A is a request line; B has the wrong order; C is a header, which comes after the status line.|||Dòng trạng thái là [phiên bản HTTP] [mã trạng thái] [reason phrase]; Tomcat 8.5+ không gửi reason phrase nữa, nên dòng thật là "HTTP/1.1 200" (dù sao client cũng phải bỏ qua cụm chữ đó). A là dòng request; B sai thứ tự; C là một header, nằm sau dòng trạng thái.' },
    { id: 'q6',
      question: '(FE question type) When a servlet accepts a call from a client, which two objects does it receive?|||(Dạng câu FE) Khi một servlet nhận một lời gọi từ client, nó nhận được hai đối tượng nào?',
      options: ['ServletRequest and ServletResponse|||ServletRequest và ServletResponse', 'HttpSession and Cookie|||HttpSession và Cookie', 'ServletConfig and ServletContext|||ServletConfig và ServletContext', 'PrintWriter and Scanner|||PrintWriter và Scanner'],
      correctIndex: 0,
      points: 1,
      explanation: 'Slide 10: the request object wraps what the client sent, the response object wraps what the servlet sends back (for HTTP: HttpServletRequest/HttpServletResponse). Sessions and cookies are reached through the request; ServletConfig/ServletContext are configuration objects available from the servlet itself; PrintWriter is obtained from the response.|||Slide 10: đối tượng request gói mọi thứ client gửi, đối tượng response gói thứ servlet gửi lại (với HTTP: HttpServletRequest/HttpServletResponse). Session và cookie lấy qua request; ServletConfig/ServletContext là đối tượng cấu hình servlet tự lấy được; PrintWriter lấy từ response.' },
    { id: 'q7',
      question: 'How does a server ask the browser to store a cookie, and how does the browser return it?|||Server nhờ trình duyệt cất cookie bằng cách nào, và trình duyệt gửi lại nó ra sao?',
      options: ['The browser sends Set-Cookie, the server answers with Cookie|||Trình duyệt gửi Set-Cookie, server trả lời bằng Cookie', 'Both use the Cookie header in the request|||Cả hai đều dùng header Cookie trong request', 'The server puts the cookie in the URL, the browser in the body|||Server đặt cookie trên URL, trình duyệt đặt trong body', 'The server sends a Set-Cookie response header; the browser sends it back in a Cookie request header|||Server gửi header response Set-Cookie; trình duyệt gửi lại nó trong header request Cookie'],
      correctIndex: 3,
      points: 1,
      explanation: 'Slide 16 and the dem-luot demo: the response carries "Set-Cookie: JSESSIONID=…; Path=/dem-luot; HttpOnly" once, then every later request carries "Cookie: JSESSIONID=…". A swaps the directions; cookies travel in headers, not in the URL or body.|||Slide 16 và demo dem-luot: response mang "Set-Cookie: JSESSIONID=…; Path=/dem-luot; HttpOnly" một lần, rồi mọi request sau mang "Cookie: JSESSIONID=…". A đảo ngược chiều; cookie đi trong header, không nằm trên URL hay trong body.' },
    { id: 'q8',
      question: '/table?n=abc reaches a servlet that does Integer.parseInt(request.getParameter("n")). What should a well-written servlet answer?|||/table?n=abc tới một servlet có Integer.parseInt(request.getParameter("n")). Servlet viết tốt nên trả lời gì?',
      options: ['500 Internal Server Error, because an exception was thrown|||500 Internal Server Error, vì đã có exception', '400 Bad Request, by catching NumberFormatException and calling sendError(400, …)|||400 Bad Request, bằng cách bắt NumberFormatException và gọi sendError(400, …)', '200 OK with an empty page|||200 OK kèm một trang trống', '302 to the home page without explanation|||302 về trang chủ mà không giải thích'],
      correctIndex: 1,
      points: 1,
      explanation: 'The client sent bad data, so the honest status is 400 (4xx = client error). Letting the exception escape gives 500, which wrongly says the server is broken; 200 with nothing and a silent redirect hide the problem from the user.|||Client gửi dữ liệu sai, nên mã trung thực là 400 (4xx = lỗi phía client). Để exception lọt ra ngoài cho 500, tức là nói sai rằng server hỏng; 200 kèm trang trống hay chuyển hướng im lặng đều giấu vấn đề khỏi người dùng.' },
    { id: 'q9',
      question: 'A servlet written with "import javax.servlet.*" and @WebServlet("/hello") is deployed on Tomcat 10.1 without errors. What does GET /app/hello return?|||Một servlet viết với "import javax.servlet.*" và @WebServlet("/hello") được deploy lên Tomcat 10.1 không báo lỗi. GET /app/hello trả về gì?',
      options: ["200 and the servlet's output, because the classes are identical|||200 và output của servlet, vì các lớp y hệt nhau", '500, because Tomcat converts javax at run time and fails|||500, vì Tomcat đổi javax lúc chạy và bị lỗi', '404, because Tomcat 10 only recognises jakarta.servlet annotations, so /hello is not mapped|||404, vì Tomcat 10 chỉ nhận annotation jakarta.servlet, nên /hello không được ánh xạ', '405, because the method name is wrong|||405, vì sai tên method'],
      correctIndex: 2,
      points: 1,
      explanation: 'Since Jakarta EE 9 the packages are jakarta.*; Tomcat 10+ ignores the old javax annotation, so nothing is mapped to /hello — the real response in the "Installing the environment" lesson is a 404. Only the package name differs, but it matters. Conversion happens only for WARs placed in webapps-javaee, not at run time.|||Từ Jakarta EE 9 các gói là jakarta.*; Tomcat 10+ bỏ qua annotation javax cũ, nên không có gì ánh xạ tới /hello — response thật trong bài "Cài môi trường" là 404. Chỉ khác tên gói, nhưng khác là hỏng. Việc chuyển đổi chỉ xảy ra với WAR đặt trong webapps-javaee, không xảy ra lúc chạy.' },
    { id: 'q10',
      question: 'What does an HTTP HEAD request return?|||Một HTTP request HEAD trả về gì?',
      options: ['The same status and headers as GET, but no body|||Cùng mã trạng thái và header như GET, nhưng không có body', 'Only the HTML <head> element of the page|||Chỉ phần tử <head> của trang HTML', 'The list of methods the server allows|||Danh sách các method server cho phép', 'A copy of the request, for debugging|||Một bản sao của request, để gỡ lỗi'],
      correctIndex: 0,
      points: 1,
      explanation: "HEAD is \"GET without the body\": the slide 11 demo returned 200 with the same Content-Length (34) as GET and no body — useful to check existence or size. B confuses it with HTML's <head>; C is OPTIONS (the Allow header); D is TRACE.|||HEAD là \"GET không có body\": demo slide 11 trả 200 với cùng Content-Length (34) như GET và không có body — có ích để kiểm tra tồn tại hay kích thước. B nhầm với <head> của HTML; C là OPTIONS (header Allow); D là TRACE." },
  ],
};

const QUIZ_LESSON = {
  title: 'Quiz Ch.1 — How the web works: HTTP requests, responses, methods, status codes, cookies|||Quiz Ch.1 — Web hoạt động ra sao: HTTP request, response, method, mã trạng thái, cookie',
  slug: 'prj301-quiz-ch1',
  type: 'QUIZ',
  description: '10 câu ôn Chương 1 viết lại theo dạng câu FE PRJ301: thành phần của một HTTP response, GET và dữ liệu nhạy cảm, phân biệt 401/403/404/503, method lũy đẳng, cấu trúc dòng trạng thái (Tomcat không gửi reason phrase), hai đối tượng container đưa cho servlet, Set-Cookie và Cookie, trả 400 khi client gửi dữ liệu sai, servlet javax trên Tomcat 10, method HEAD — mỗi câu có giải thích song ngữ.',
  quiz: QUIZ,
};

export default {
  slides: [L_prj1_1],
  practice: L_on_ch1,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 1 viết lại theo dạng câu FE PRJ301: thành phần của một HTTP response, GET và dữ liệu nhạy cảm, phân biệt 401/403/404/503, method lũy đẳng, cấu trúc dòng trạng thái (Tomcat không gửi reason phrase), hai đối tượng container đưa cho servlet, Set-Cookie và Cookie, trả 400 khi client gửi dữ liệu sai, servlet javax trên Tomcat 10, method HEAD — mỗi câu có giải thích song ngữ.',
  quizLesson: QUIZ_LESSON,
};
