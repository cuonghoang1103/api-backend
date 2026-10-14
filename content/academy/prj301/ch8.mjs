/**
 * PRJ301 · Chương 8 — Filter & Listener (prj10, prj11).
 * Bài 📑 học theo từng slide: prj10 (undefined, slide 1–21); prj11 (undefined, slide 1–18).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: prj301-on-ch8.
 * Quiz viết lại (10 câu, giữ slug prj301-quiz-3).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRJ301/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRJ301/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 8.A — 📑 Slide by slide · Filters: the chain, mappings, blocking, response wrappers (Slot 25–26, slides 1–21) ───────── */
const L_prj10_1 = {
  title: '8.A — 📑 Slide by slide · Filters: the chain, mappings, blocking, response wrappers (Slot 25–26, slides 1–21)|||8.A — 📑 Học theo từng slide · Filter: chuỗi filter, ánh xạ, chặn request, bọc response (Slot 25–26, slide 1–21)',
  slug: 'prj301-slide-prj10-1',
  type: 'VIDEO',
  description: 'Giảng trọn 21 slide bộ "Session 9, FILTERS": filter là gì và bốn việc nó làm được với request (cho qua, sửa request, chặn bằng redirect/mã trạng thái/output thay thế), công dụng, một hay nhiều filter và luật thứ tự thật (url-pattern trước servlet-name, "after" chạy ngược), tạo filter (init/doFilter/destroy, invoker servlet đã bị bỏ), khai báo filter và filter-mapping, dispatcher REQUEST/FORWARD/INCLUDE/ERROR, ví dụ Reporting Filter, init-param, chặn response, bọc response bằng wrapper — mọi ví dụ chạy thật trên Tomcat 10.1 kèm request, response và log console thật; chỉ ra các chỗ slide sai (thiếu toString, gán trường dùng chung giữa các luồng, slide 20 trùng slide 19, wrapper hỏng với file tĩnh) và sửa; nối sang Spring Security.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.A · school deck "Session 9, FILTERS" (Slot 25–26), slides 1–21</span>
<h2>Filters — code that stands in front of your servlets</h2>
<p class="lead">By Chapter 6 every protected servlet starts with the same five lines: "is there a user in the session? if not, redirect to login". Every <code>doPost</code> starts with <code>setCharacterEncoding("UTF-8")</code>. A <strong>filter</strong> (bộ lọc) is the place where such code is written <em>once</em>: the container runs it before the servlet, JSP or static file, and it may let the request through, change it, or stop it. These 21 slides teach the mechanism; this lesson runs every piece of it on a real Tomcat 10.1 and shows where the slides are wrong.</p>
<p>Why it matters: the Assignment requires it by name — <strong>requirement 1.9: "use a Filter to authorise users according to the business rules"</strong> — and the PE login task is graded on whether a guest can reach a protected URL. The FE asks about <code>chain.doFilter</code>, filter order, <code>&lt;filter-mapping&gt;</code> and what filters are used for. And Spring Security, which LabFlow will use, is literally a chain of servlet filters.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>Where it is graded</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>what a filter is, what it is for, one or many filters</td><td>FE: definition, uses, order</td></tr>
<tr><td>6–9</td><td>writing, declaring and mapping a filter; dispatcher types</td><td>FE: methods, web.xml tags · PE: mapping the auth filter</td></tr>
<tr><td>10–15</td><td>a logging filter, init parameters, blocking a request</td><td>PE + Assignment 1.9: the login/role filter</td></tr>
<tr><td>16–21</td><td>changing the response with a wrapper</td><td>rarely graded; the slides' code is broken — fixed here</td></tr>
</tbody>
</table>
<div class="callout"><strong>How to read this lesson.</strong> Every filter below ran on <strong>Apache Tomcat 10.1</strong> (JDK 17) with <code>jakarta.servlet</code> (the slides write <code>javax.servlet</code> — only the package name changes, see the ⭐ lesson "Start here"). Under the code: the request sent, the response Tomcat returned, and the lines the filters printed on Tomcat's console, in the order they really happened. The older web lesson 8.1 below stays as a short summary; exercises with the role-based login filter are in lesson 8.3.</div>`,
    `<span class="eyebrow">Chương 8 · Bài 8.A · bộ slide "Session 9, FILTERS" của trường (Slot 25–26), slide 1–21</span>
<h2>Filter — đoạn code đứng chắn trước các servlet của bạn</h2>
<p class="lead">Tới Chương 6, servlet nào cần bảo vệ cũng mở đầu bằng đúng năm dòng: "trong session có user chưa? chưa thì chuyển về trang đăng nhập". <code>doPost</code> nào cũng mở đầu bằng <code>setCharacterEncoding("UTF-8")</code>. <strong>Filter</strong> (bộ lọc) là chỗ viết những đoạn code như vậy <em>một lần</em>: container chạy nó trước servlet, JSP hay file tĩnh, và nó có thể cho request đi qua, sửa request, hoặc chặn lại. 21 slide này dạy cơ chế; bài này chạy từng mảnh trên Tomcat 10.1 thật và chỉ ra chỗ nào slide sai.</p>
<p>Vì sao quan trọng: Assignment đòi đích danh — <strong>yêu cầu 1.9: "Sử dụng Filter để phân quyền người dùng theo nghiệp vụ"</strong> — và câu đăng nhập của đề PE được chấm ở chỗ khách chưa đăng nhập có vào được URL bảo vệ hay không. Đề FE hỏi <code>chain.doFilter</code>, thứ tự filter, <code>&lt;filter-mapping&gt;</code> và filter dùng để làm gì. Còn Spring Security, thứ LabFlow sẽ dùng, đúng nghĩa đen là một chuỗi servlet filter.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Được chấm ở đâu</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>filter là gì, dùng làm gì, một hay nhiều filter</td><td>FE: định nghĩa, công dụng, thứ tự</td></tr>
<tr><td>6–9</td><td>viết, khai báo và ánh xạ filter; các loại dispatcher</td><td>FE: các phương thức, thẻ web.xml · PE: ánh xạ filter đăng nhập</td></tr>
<tr><td>10–15</td><td>filter ghi log, tham số khởi tạo, chặn request</td><td>PE + Assignment 1.9: filter đăng nhập/vai trò</td></tr>
<tr><td>16–21</td><td>sửa response bằng wrapper</td><td>ít khi ra đề; code trên slide hỏng — sửa ở đây</td></tr>
</tbody>
</table>
<div class="callout"><strong>Cách đọc bài này.</strong> Mọi filter dưới đây đã chạy trên <strong>Apache Tomcat 10.1</strong> (JDK 17) với <code>jakarta.servlet</code> (slide viết <code>javax.servlet</code> — chỉ đổi tên gói, xem bài ⭐ "Bắt đầu tại đây"). Dưới code là request đã gửi, response Tomcat trả về, và những dòng các filter in ra console của Tomcat, đúng thứ tự chúng thật sự xảy ra. Bài web cũ 8.1 bên dưới giữ làm bản tóm tắt ngắn; bài tập với filter đăng nhập theo vai trò nằm ở bài 8.3.</div>`),
    walkHead('prj10', 1, 21),
    walk('prj10', [
      [1, 'Session 9, FILTERS',
        `<p class="y-chinh">🎯 The filter deck of PRJ301 — "Session 9" in the deck's own numbering, sessions 49–52 of the current syllabus (CLO5: <em>work with other server-side objects in a Java web application</em>).</p>
<p>The footer still says "n/41", copied from the first deck's template; this deck has <strong>21</strong> slides and this site numbers them 1–21 as you see them.</p>
<p>A filter is the second kind of server-side object you meet after the servlet. It is not a servlet: it has no URL of its own and never answers on its own initiative — it only <em>wraps</em> the processing of requests that go to other resources.</p>
<p>What you should be able to do after this lesson: write a filter, declare and map it in web.xml or with <code>@WebFilter</code>, predict the order of several filters, block a request three different ways, and build the login/role filter that Assignment requirement 1.9 asks for (lesson 8.3, exercise 3).</p>
<p class="meo">🧠 One sentence for the whole deck: <em>a filter is a checkpoint the request passes on the way in and the response passes on the way out.</em></p>`,
        `<p class="y-chinh">🎯 Deck filter của PRJ301 — "Session 9" theo cách đánh số của chính deck, tức buổi 49–52 của đề cương hiện hành (CLO5: <em>làm việc với các đối tượng phía server khác trong ứng dụng Java web</em>).</p>
<p>Chân slide vẫn ghi "n/41", chép từ mẫu của deck đầu tiên; deck này có <strong>21</strong> slide và web đánh số 1–21 đúng như bạn thấy.</p>
<p>Filter là loại đối tượng phía server thứ hai bạn gặp sau servlet. Nó không phải servlet: nó không có URL riêng và không bao giờ tự mình trả lời — nó chỉ <em>bọc quanh</em> việc xử lý những request đi tới tài nguyên khác.</p>
<p>Học xong bài này bạn cần làm được: viết một filter, khai báo và ánh xạ nó trong web.xml hoặc bằng <code>@WebFilter</code>, đoán đúng thứ tự của nhiều filter, chặn một request theo ba cách khác nhau, và dựng filter đăng nhập/vai trò mà yêu cầu 1.9 của Assignment đòi (bài 8.3, bài tập 3).</p>
<p class="meo">🧠 Một câu cho cả deck: <em>filter là trạm kiểm soát mà request đi qua lúc vào và response đi qua lúc ra.</em></p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Three goals: understand the purpose of a filter; create, declare and map one; order several filters properly.</p>
<p>These three lines are, word for word, the section titles of Chapter 9 of the syllabus textbook (Williams, <em>Professional Java for Web Applications</em>: "Understanding the Purpose of Filters", "Creating, Declaring, and Mapping Filters", "Ordering Your Filters Properly") — the chapter to read if a slide is too short.</p>
<table>
<thead><tr><th>Goal</th><th>Slides</th><th>Real example on this page</th></tr></thead>
<tbody>
<tr><td>purpose</td><td>3–4</td><td><code>loc-chan</code>: one filter, four outcomes</td></tr>
<tr><td>create, declare, map</td><td>6–13</td><td><code>loc-bao-cao</code> (slides 10–12 as written), <code>loc-dispatcher</code></td></tr>
<tr><td>ordering</td><td>5 (only a picture on the slides)</td><td><code>loc-chuoi</code>: F1, F2, F3 measured</td></tr>
</tbody>
</table>
<p>"Ordering" gets one picture and no rule on the slides. The rule is in slide 5 below, measured — and it is a classic FE question.</p>`,
        `<p class="y-chinh">🎯 Ba mục tiêu: hiểu filter để làm gì; tạo, khai báo và ánh xạ một filter; sắp thứ tự nhiều filter cho đúng.</p>
<p>Ba dòng này chép nguyên văn tên các mục của Chương 9 trong giáo trình của đề cương (Williams, <em>Professional Java for Web Applications</em>: "Understanding the Purpose of Filters", "Creating, Declaring, and Mapping Filters", "Ordering Your Filters Properly") — chương nên đọc khi slide quá ngắn.</p>
<table>
<thead><tr><th>Mục tiêu</th><th>Slide</th><th>Ví dụ chạy thật trên trang này</th></tr></thead>
<tbody>
<tr><td>mục đích</td><td>3–4</td><td><code>loc-chan</code>: một filter, bốn kết cục</td></tr>
<tr><td>tạo, khai báo, ánh xạ</td><td>6–13</td><td><code>loc-bao-cao</code> (slide 10–12 đúng như viết), <code>loc-dispatcher</code></td></tr>
<tr><td>thứ tự</td><td>5 (slide chỉ có một hình)</td><td><code>loc-chuoi</code>: đo thật F1, F2, F3</td></tr>
</tbody>
</table>
<p>"Thứ tự" trên slide chỉ có một hình, không có luật. Luật nằm ở slide 5 bên dưới, có đo thật — và là câu FE kinh điển.</p>`],
      [3, 'What is Filter?',
        `<p class="y-chinh">🎯 A filter is a small program that runs on the server <strong>before</strong> the servlet or JSP it is attached to; it can examine the request and then (1) invoke the resource normally, (2) invoke it with a modified request, (3) invoke it but modify the response, or (4) not invoke it at all — redirect, return a status code, or write its own output.</p>
<p>All four choices live in one method, <code>doFilter</code>. Whether the resource runs depends on one line: <code>chain.doFilter(request, response)</code>. Call it ⇒ the request goes on; don't ⇒ the request stops at the filter, and whatever the filter wrote is the response.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/82732567bc5719da608829bd5040586ee29f370e.svg" alt="Slide 3 as a decision: the four things a filter may do with a request" loading="lazy" /><p class="chu-thich">🧩 Slide 3 as a decision: the four things a filter may do with a request</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 3 as a decision: what a filter may do with a request (all four measured in loc-chan)
start
:doFilter(request, response, chain);
if (User-Agent is a bad bot?) then (yes)
  :sendRedirect("blocked.html")\\n→ 302;
  stop
elseif (path under /private?) then (yes)
  :sendError(403)\\n→ status code only;
  stop
elseif (path under /shop?) then (yes)
  :write own text, status 503\\n→ replacement output;
  stop
else (no)
  :chain.doFilter(new TrimmedRequest(req), response)\\n→ resource runs with a MODIFIED request;
endif
:(code here runs on the way back)\\nthe response is already produced;
stop
@enduml</code></pre></details>
<p>One filter, <code>GateFilter</code>, makes every one of these choices for real (its code is studied on slides 13–15). A normal request goes on — with the parameter <code>q</code> trimmed by a <em>request wrapper</em> (choice 2):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-chan/hello?q=%20%20Java%20Web%20%20 HTTP/1.1
Host: localhost:8080
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 42

Servlet reached: /hello · q = [Java Web]</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">GateFilter.init(): blocked-agent=BadBot, forbidden-prefix=/private, maintenance-prefix=/shop<br>
GateFilter: /hello → pass on (trimmed parameters)<br>
HelloServlet: /hello</div>
<p>A bad bot is redirected, a private URL gets a bare status code, and the shop gets the filter's own page — the servlet never runs (no "HelloServlet" line in the log):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-chan/hello?q=Java HTTP/1.1
Host: localhost:8080
User-Agent: BadBot/2.1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /loc-chan/blocked.html
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">GateFilter: /hello → redirect (bad agent)</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-chan/private/report HTTP/1.1
Host: localhost:8080
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 619

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 403 – Forbidden
Type Status Report
Description The server understood the request but refuses to authorize it.
Apache Tomcat/10.1.61</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">GateFilter: /private/report → 403</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-chan/shop/cart HTTP/1.1
Host: localhost:8080
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 503
Content-Type: text/plain;charset=UTF-8
Content-Length: 60

The shop is closed for maintenance. Please come back later.</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">GateFilter: /shop/cart → replacement page</div>
<p>Choice 3 ("modify the response before sending it") needs a response wrapper — slides 16–20.</p>`,
        `<p class="y-chinh">🎯 Filter là một chương trình nhỏ chạy trên server <strong>trước</strong> servlet hay JSP mà nó gắn vào; nó xem xét request rồi (1) gọi tài nguyên bình thường, (2) gọi tài nguyên với request đã sửa, (3) gọi tài nguyên nhưng sửa response trước khi gửi, hoặc (4) không gọi tài nguyên — chuyển hướng, trả một mã trạng thái, hoặc tự viết output thay thế.</p>
<p>Cả bốn lựa chọn nằm trong một phương thức, <code>doFilter</code>. Tài nguyên có chạy hay không phụ thuộc đúng một dòng: <code>chain.doFilter(request, response)</code>. Gọi nó ⇒ request đi tiếp; không gọi ⇒ request dừng ở filter, và những gì filter đã viết chính là response.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/82732567bc5719da608829bd5040586ee29f370e.svg" alt="Slide 3 thành sơ đồ quyết định: bốn việc filter có thể làm với một request" loading="lazy" /><p class="chu-thich">🧩 Slide 3 thành sơ đồ quyết định: bốn việc filter có thể làm với một request</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 3 as a decision: what a filter may do with a request (all four measured in loc-chan)
start
:doFilter(request, response, chain);
if (User-Agent is a bad bot?) then (yes)
  :sendRedirect("blocked.html")\\n→ 302;
  stop
elseif (path under /private?) then (yes)
  :sendError(403)\\n→ status code only;
  stop
elseif (path under /shop?) then (yes)
  :write own text, status 503\\n→ replacement output;
  stop
else (no)
  :chain.doFilter(new TrimmedRequest(req), response)\\n→ resource runs with a MODIFIED request;
endif
:(code here runs on the way back)\\nthe response is already produced;
stop
@enduml</code></pre></details>
<p>Một filter, <code>GateFilter</code>, thực hiện thật từng lựa chọn này (code của nó học ở slide 13–15). Request bình thường được đi tiếp — với tham số <code>q</code> đã được bỏ dấu cách hai đầu nhờ một <em>request wrapper</em> (lựa chọn 2):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-chan/hello?q=%20%20Java%20Web%20%20 HTTP/1.1
Host: localhost:8080
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 42

Servlet reached: /hello · q = [Java Web]</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">GateFilter.init(): blocked-agent=BadBot, forbidden-prefix=/private, maintenance-prefix=/shop<br>
GateFilter: /hello → pass on (trimmed parameters)<br>
HelloServlet: /hello</div>
<p>Bot xấu bị chuyển hướng, URL riêng tư nhận một mã trạng thái trần, còn cửa hàng nhận trang do filter tự viết — servlet không hề chạy (log không có dòng "HelloServlet"):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-chan/hello?q=Java HTTP/1.1
Host: localhost:8080
User-Agent: BadBot/2.1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /loc-chan/blocked.html
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">GateFilter: /hello → redirect (bad agent)</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-chan/private/report HTTP/1.1
Host: localhost:8080
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 619

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 403 – Forbidden
Type Status Report
Description The server understood the request but refuses to authorize it.
Apache Tomcat/10.1.61</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">GateFilter: /private/report → 403</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-chan/shop/cart HTTP/1.1
Host: localhost:8080
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 503
Content-Type: text/plain;charset=UTF-8
Content-Length: 60

The shop is closed for maintenance. Please come back later.</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">GateFilter: /shop/cart → replacement page</div>
<p>Lựa chọn 3 ("sửa response trước khi gửi") cần một response wrapper — slide 16–20.</p>`],
      [4, 'What it can be used for ?',
        `<p class="y-chinh">🎯 Typical uses: authentication (block requests by user identity), logging and auditing, image conversion, data compression, localization, XSL/T transformation of XML.</p>
<p>The common idea: <strong>a concern that applies to many URLs</strong> ("cross-cutting concern") — not the business logic of one page. The list is from about 2005; here is what each line means today:</p>
<table>
<thead><tr><th>Slide line</th><th>Today</th><th>On this site</th></tr></thead>
<tbody>
<tr><td>Authentication</td><td>still filter job #1: login check + role check (Assignment 1.9)</td><td>8.3 exercises 2–3</td></tr>
<tr><td>Logging and auditing</td><td>one line per request, with the final status</td><td>8.3 exercise 4</td></tr>
<tr><td>Image conversion</td><td>done once at upload time or by a CDN, rarely per request</td><td>—</td></tr>
<tr><td>Data compression</td><td>usually Tomcat's connector (<code>compression="on"</code>) or nginx, not your code</td><td>—</td></tr>
<tr><td>Localization</td><td>character encoding (UTF-8) and language from <code>Accept-Language</code></td><td>8.3 exercise 1</td></tr>
<tr><td>XSL/T of XML</td><td>outdated (XML pages); today: JSON for APIs</td><td>—</td></tr>
<tr><td>(➕ not on the slide)</td><td>CORS headers, security headers (CSP, HSTS), rate limiting, CSRF tokens</td><td>Spring Security</td></tr>
</tbody>
</table>
<div class="pitfall">FE question type: "Which is NOT a use of a filter?" with a distractor like "link bootstrap.min.css in a JSP" — that is page markup, not request processing. Also wrong: "filters replace servlets" — a filter never has its own URL.</div>`,
        `<p class="y-chinh">🎯 Công dụng điển hình: xác thực (chặn request theo danh tính người dùng), ghi log và kiểm toán, chuyển đổi ảnh, nén dữ liệu, bản địa hoá, biến đổi XML bằng XSL/T.</p>
<p>Ý chung: <strong>một mối quan tâm áp dụng cho nhiều URL</strong> ("cross-cutting concern" — mối quan tâm cắt ngang) — không phải nghiệp vụ của một trang. Danh sách này có từ khoảng 2005; mỗi dòng ngày nay nghĩa là:</p>
<table>
<thead><tr><th>Dòng trên slide</th><th>Ngày nay</th><th>Trên web này</th></tr></thead>
<tbody>
<tr><td>Authentication (xác thực)</td><td>vẫn là việc số 1 của filter: kiểm đăng nhập + kiểm vai trò (Assignment 1.9)</td><td>8.3 bài 2–3</td></tr>
<tr><td>Logging and auditing (log, kiểm toán)</td><td>mỗi request một dòng, kèm mã trạng thái cuối cùng</td><td>8.3 bài 4</td></tr>
<tr><td>Image conversion (chuyển ảnh)</td><td>làm một lần lúc tải lên hoặc do CDN làm, hiếm khi làm theo từng request</td><td>—</td></tr>
<tr><td>Data compression (nén)</td><td>thường do connector của Tomcat (<code>compression="on"</code>) hoặc nginx, không phải code của bạn</td><td>—</td></tr>
<tr><td>Localization (bản địa hoá)</td><td>bảng mã ký tự (UTF-8) và ngôn ngữ lấy từ <code>Accept-Language</code></td><td>8.3 bài 1</td></tr>
<tr><td>XSL/T của XML</td><td>đã lỗi thời (trang XML); ngày nay: JSON cho API</td><td>—</td></tr>
<tr><td>(➕ ngoài slide)</td><td>header CORS, header bảo mật (CSP, HSTS), giới hạn tần suất, token CSRF</td><td>Spring Security</td></tr>
</tbody>
</table>
<div class="pitfall">Dạng câu FE: "Cái nào KHÔNG phải công dụng của filter?" với phương án nhiễu kiểu "liên kết bootstrap.min.css trong JSP" — đó là mã trang, không phải xử lý request. Cũng sai: "filter thay thế servlet" — filter không bao giờ có URL riêng.</div>`],
      [5, 'One or many filters',
        `<p class="y-chinh">🎯 Left picture: the filter stands between the HTTP request and every kind of resource (servlet, JSP, static file). Right picture: three filters F1, F2, F3 and three servlets — S1 passes F1 and F3, S2 passes all three, S3 passes only F1.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/c46d49648be58ce0f74359fd2b2662035f157556.svg" alt="Slide 5 (left) redrawn: one filter in front of servlets, JSPs and static files" loading="lazy" /><p class="chu-thich">🧩 Slide 5 (left) redrawn: one filter in front of servlets, JSPs and static files</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 5 (left): a filter stands between the request and EVERY kind of resource
left to right direction
actor "Browser" as B
rectangle "Web app (one WAR on Tomcat)" {
  component "ServletFilter" as F
  rectangle "Servlet" as S
  rectangle "JSP" as J
  rectangle "Static file\\n(.html, .css, .png)" as H
}
B --&gt; F : HTTP request
F --&gt; S : chain.doFilter
F --&gt; J : chain.doFilter
F --&gt; H : chain.doFilter
F ..&gt; B : or answer directly\\n(redirect / 403 / own page)
@enduml</code></pre></details>
<p>We built the right-hand picture exactly: F1 on <code>/*</code>, F2 on <code>/s2</code>, F3 on servlets S1 and S2 — and wrote F3's mapping <em>first</em> in the file. Each filter prints a line before and after <code>chain.doFilter</code>:</p>
<p class="ghi-chu">📄 <code>loc-chuoi/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;filter&gt;&lt;filter-name&gt;F1&lt;/filter-name&gt;&lt;filter-class&gt;chain.F1&lt;/filter-class&gt;&lt;/filter&gt;
    &lt;filter&gt;&lt;filter-name&gt;F2&lt;/filter-name&gt;&lt;filter-class&gt;chain.F2&lt;/filter-class&gt;&lt;/filter&gt;
    &lt;filter&gt;&lt;filter-name&gt;F3&lt;/filter-name&gt;&lt;filter-class&gt;chain.F3&lt;/filter-class&gt;&lt;/filter&gt;

    &lt;!-- F3 is mapped FIRST in the file, but by SERVLET NAME --&gt;
    &lt;filter-mapping&gt;
        &lt;filter-name&gt;F3&lt;/filter-name&gt;
        &lt;servlet-name&gt;S1&lt;/servlet-name&gt;
        &lt;servlet-name&gt;S2&lt;/servlet-name&gt;
    &lt;/filter-mapping&gt;
    &lt;!-- F1 and F2 are mapped by URL pattern --&gt;
    &lt;filter-mapping&gt;
        &lt;filter-name&gt;F1&lt;/filter-name&gt;
        &lt;url-pattern&gt;/*&lt;/url-pattern&gt;
    &lt;/filter-mapping&gt;
    &lt;filter-mapping&gt;
        &lt;filter-name&gt;F2&lt;/filter-name&gt;
        &lt;url-pattern&gt;/s2&lt;/url-pattern&gt;
    &lt;/filter-mapping&gt;

    &lt;servlet&gt;&lt;servlet-name&gt;S1&lt;/servlet-name&gt;&lt;servlet-class&gt;chain.S1&lt;/servlet-class&gt;&lt;/servlet&gt;
    &lt;servlet&gt;&lt;servlet-name&gt;S2&lt;/servlet-name&gt;&lt;servlet-class&gt;chain.S2&lt;/servlet-class&gt;&lt;/servlet&gt;
    &lt;servlet&gt;&lt;servlet-name&gt;S3&lt;/servlet-name&gt;&lt;servlet-class&gt;chain.S3&lt;/servlet-class&gt;&lt;/servlet&gt;
    &lt;servlet-mapping&gt;&lt;servlet-name&gt;S1&lt;/servlet-name&gt;&lt;url-pattern&gt;/s1&lt;/url-pattern&gt;&lt;/servlet-mapping&gt;
    &lt;servlet-mapping&gt;&lt;servlet-name&gt;S2&lt;/servlet-name&gt;&lt;url-pattern&gt;/s2&lt;/url-pattern&gt;&lt;/servlet-mapping&gt;
    &lt;servlet-mapping&gt;&lt;servlet-name&gt;S3&lt;/servlet-name&gt;&lt;url-pattern&gt;/s3&lt;/url-pattern&gt;&lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>loc-chuoi/src/main/java/chain/F1.java</code></p>
<pre class="web-src"><code class="language-java">package chain;

import java.io.IOException;
import jakarta.servlet.*;

// Slide 5: one of the three green filters — it only records that the request went through it
public class F1 implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws IOException, ServletException {
        String trace = (String) req.getAttribute("trace");                  // what earlier filters wrote
        req.setAttribute("trace", (trace == null ? "" : trace + " → ") + "F1");
        System.out.println("F1: before chain.doFilter");                   // on the way IN
        chain.doFilter(req, resp);                                          // next filter, or the servlet
        System.out.println("F1: after chain.doFilter");                    // on the way OUT
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-chuoi/s2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 37

S2 reached through: F1 → F2 → F3</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">F1: before chain.doFilter<br>
F2: before chain.doFilter<br>
F3: before chain.doFilter<br>
S2: doGet<br>
F3: after chain.doFilter<br>
F2: after chain.doFilter<br>
F1: after chain.doFilter</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-chuoi/s1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 30

S1 reached through: F1 → F3</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">F1: before chain.doFilter<br>
F3: before chain.doFilter<br>
S1: doGet<br>
F3: after chain.doFilter<br>
F1: after chain.doFilter</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-chuoi/s3 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 23

S3 reached through: F1</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">F1: before chain.doFilter<br>
S3: doGet<br>
F1: after chain.doFilter</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/818736f9c969b6894c788907fd45fb4667a54c33.svg" alt="The same run as a sequence: calls nest like method calls, so the &quot;after&quot; lines come back in reverse" loading="lazy" /><p class="chu-thich">🧩 The same run as a sequence: calls nest like method calls, so the "after" lines come back in reverse</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 5 (right), measured on Tomcat 10.1: GET /s2 passes F1, F2, F3 — and comes back in reverse
participant "Tomcat" as T
participant "F1\\n(url /*)" as F1
participant "F2\\n(url /s2)" as F2
participant "F3\\n(servlet-name S1, S2)" as F3
participant "S2" as S
T -&gt; F1 : doFilter(req, resp, chain)
activate F1
F1 -&gt; F2 : chain.doFilter
activate F2
F2 -&gt; F3 : chain.doFilter
activate F3
F3 -&gt; S : chain.doFilter → service()
activate S
S --&gt; F3 : response written
deactivate S
F3 --&gt; F2 : "F3: after"
deactivate F3
F2 --&gt; F1 : "F2: after"
deactivate F2
F1 --&gt; T : "F1: after"
deactivate F1
note over F1, F3 : ORDER = url-pattern mappings in web.xml order,\\nTHEN servlet-name mappings in web.xml order
@enduml</code></pre></details>
<p><strong>The ordering rule</strong> (Jakarta Servlet spec, Ch.6): the container first takes the <code>&lt;filter-mapping&gt;</code>s that match by <strong>url-pattern</strong>, in the order they appear in web.xml, and <em>then</em> those that match by <strong>servlet-name</strong>, in web.xml order. That is why F3 — written first — ran last.</p>
<div class="pitfall">FE question type: "what decides the order?" — the order of the <code>&lt;filter-mapping&gt;</code> elements (not of the <code>&lt;filter&gt;</code> declarations), url-pattern ones before servlet-name ones. <code>@WebFilter</code> has no attribute for order: when order matters, declare the mappings in web.xml.</div>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): you register a filter as a bean (or with <code>FilterRegistrationBean</code>) and give it a number with <code>@Order</code> / <code>setOrder</code>; a smaller number runs earlier. Spring Security's whole filter chain sits at one position in this list (diagram at slide 21).</div>`,
        `<p class="y-chinh">🎯 Hình trái: filter đứng giữa HTTP request và mọi loại tài nguyên (servlet, JSP, file tĩnh). Hình phải: ba filter F1, F2, F3 và ba servlet — S1 đi qua F1 và F3, S2 đi qua cả ba, S3 chỉ qua F1.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/c46d49648be58ce0f74359fd2b2662035f157556.svg" alt="Slide 5 (trái) vẽ lại: một filter đứng trước servlet, JSP và file tĩnh" loading="lazy" /><p class="chu-thich">🧩 Slide 5 (trái) vẽ lại: một filter đứng trước servlet, JSP và file tĩnh</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 5 (left): a filter stands between the request and EVERY kind of resource
left to right direction
actor "Browser" as B
rectangle "Web app (one WAR on Tomcat)" {
  component "ServletFilter" as F
  rectangle "Servlet" as S
  rectangle "JSP" as J
  rectangle "Static file\\n(.html, .css, .png)" as H
}
B --&gt; F : HTTP request
F --&gt; S : chain.doFilter
F --&gt; J : chain.doFilter
F --&gt; H : chain.doFilter
F ..&gt; B : or answer directly\\n(redirect / 403 / own page)
@enduml</code></pre></details>
<p>Ta dựng đúng hình bên phải: F1 trên <code>/*</code>, F2 trên <code>/s2</code>, F3 trên servlet S1 và S2 — và viết mapping của F3 <em>đầu tiên</em> trong file. Mỗi filter in một dòng trước và sau <code>chain.doFilter</code>:</p>
<p class="ghi-chu">📄 <code>loc-chuoi/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;filter&gt;&lt;filter-name&gt;F1&lt;/filter-name&gt;&lt;filter-class&gt;chain.F1&lt;/filter-class&gt;&lt;/filter&gt;
    &lt;filter&gt;&lt;filter-name&gt;F2&lt;/filter-name&gt;&lt;filter-class&gt;chain.F2&lt;/filter-class&gt;&lt;/filter&gt;
    &lt;filter&gt;&lt;filter-name&gt;F3&lt;/filter-name&gt;&lt;filter-class&gt;chain.F3&lt;/filter-class&gt;&lt;/filter&gt;

    &lt;!-- F3 được ánh xạ ĐẦU TIÊN trong file, nhưng bằng TÊN SERVLET --&gt;
    &lt;filter-mapping&gt;
        &lt;filter-name&gt;F3&lt;/filter-name&gt;
        &lt;servlet-name&gt;S1&lt;/servlet-name&gt;
        &lt;servlet-name&gt;S2&lt;/servlet-name&gt;
    &lt;/filter-mapping&gt;
    &lt;!-- F1 và F2 được ánh xạ bằng URL pattern --&gt;
    &lt;filter-mapping&gt;
        &lt;filter-name&gt;F1&lt;/filter-name&gt;
        &lt;url-pattern&gt;/*&lt;/url-pattern&gt;
    &lt;/filter-mapping&gt;
    &lt;filter-mapping&gt;
        &lt;filter-name&gt;F2&lt;/filter-name&gt;
        &lt;url-pattern&gt;/s2&lt;/url-pattern&gt;
    &lt;/filter-mapping&gt;

    &lt;servlet&gt;&lt;servlet-name&gt;S1&lt;/servlet-name&gt;&lt;servlet-class&gt;chain.S1&lt;/servlet-class&gt;&lt;/servlet&gt;
    &lt;servlet&gt;&lt;servlet-name&gt;S2&lt;/servlet-name&gt;&lt;servlet-class&gt;chain.S2&lt;/servlet-class&gt;&lt;/servlet&gt;
    &lt;servlet&gt;&lt;servlet-name&gt;S3&lt;/servlet-name&gt;&lt;servlet-class&gt;chain.S3&lt;/servlet-class&gt;&lt;/servlet&gt;
    &lt;servlet-mapping&gt;&lt;servlet-name&gt;S1&lt;/servlet-name&gt;&lt;url-pattern&gt;/s1&lt;/url-pattern&gt;&lt;/servlet-mapping&gt;
    &lt;servlet-mapping&gt;&lt;servlet-name&gt;S2&lt;/servlet-name&gt;&lt;url-pattern&gt;/s2&lt;/url-pattern&gt;&lt;/servlet-mapping&gt;
    &lt;servlet-mapping&gt;&lt;servlet-name&gt;S3&lt;/servlet-name&gt;&lt;url-pattern&gt;/s3&lt;/url-pattern&gt;&lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>loc-chuoi/src/main/java/chain/F1.java</code></p>
<pre class="web-src"><code class="language-java">package chain;

import java.io.IOException;
import jakarta.servlet.*;

// Slide 5: một trong ba filter màu xanh — chỉ ghi lại rằng request đã đi qua nó
public class F1 implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws IOException, ServletException {
        String trace = (String) req.getAttribute("trace");                  // điều các filter trước đã ghi
        req.setAttribute("trace", (trace == null ? "" : trace + " → ") + "F1");
        System.out.println("F1: before chain.doFilter");                   // trên đường VÀO
        chain.doFilter(req, resp);                                          // filter kế tiếp, hoặc servlet
        System.out.println("F1: after chain.doFilter");                    // trên đường RA
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-chuoi/s2 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 37

S2 reached through: F1 → F2 → F3</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">F1: before chain.doFilter<br>
F2: before chain.doFilter<br>
F3: before chain.doFilter<br>
S2: doGet<br>
F3: after chain.doFilter<br>
F2: after chain.doFilter<br>
F1: after chain.doFilter</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-chuoi/s1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 30

S1 reached through: F1 → F3</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">F1: before chain.doFilter<br>
F3: before chain.doFilter<br>
S1: doGet<br>
F3: after chain.doFilter<br>
F1: after chain.doFilter</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-chuoi/s3 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 23

S3 reached through: F1</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">F1: before chain.doFilter<br>
S3: doGet<br>
F1: after chain.doFilter</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/818736f9c969b6894c788907fd45fb4667a54c33.svg" alt="Cùng lần chạy đó dưới dạng sơ đồ tuần tự: các lời gọi lồng nhau như gọi hàm, nên các dòng &quot;after&quot; quay về theo thứ tự ngược" loading="lazy" /><p class="chu-thich">🧩 Cùng lần chạy đó dưới dạng sơ đồ tuần tự: các lời gọi lồng nhau như gọi hàm, nên các dòng "after" quay về theo thứ tự ngược</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 5 (right), measured on Tomcat 10.1: GET /s2 passes F1, F2, F3 — and comes back in reverse
participant "Tomcat" as T
participant "F1\\n(url /*)" as F1
participant "F2\\n(url /s2)" as F2
participant "F3\\n(servlet-name S1, S2)" as F3
participant "S2" as S
T -&gt; F1 : doFilter(req, resp, chain)
activate F1
F1 -&gt; F2 : chain.doFilter
activate F2
F2 -&gt; F3 : chain.doFilter
activate F3
F3 -&gt; S : chain.doFilter → service()
activate S
S --&gt; F3 : response written
deactivate S
F3 --&gt; F2 : "F3: after"
deactivate F3
F2 --&gt; F1 : "F2: after"
deactivate F2
F1 --&gt; T : "F1: after"
deactivate F1
note over F1, F3 : ORDER = url-pattern mappings in web.xml order,\\nTHEN servlet-name mappings in web.xml order
@enduml</code></pre></details>
<p><strong>Luật thứ tự</strong> (đặc tả Jakarta Servlet, Ch.6): container lấy trước các <code>&lt;filter-mapping&gt;</code> khớp theo <strong>url-pattern</strong>, theo thứ tự xuất hiện trong web.xml, <em>rồi mới</em> tới các mapping khớp theo <strong>servlet-name</strong>, cũng theo thứ tự trong web.xml. Vì thế F3 — viết đầu tiên — lại chạy sau cùng.</p>
<div class="pitfall">Dạng câu FE: "cái gì quyết định thứ tự?" — thứ tự các phần tử <code>&lt;filter-mapping&gt;</code> (không phải thứ tự khai <code>&lt;filter&gt;</code>), mapping url-pattern đứng trước mapping servlet-name. <code>@WebFilter</code> không có thuộc tính nào cho thứ tự: khi thứ tự quan trọng, hãy khai mapping trong web.xml.</div>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): bạn đăng ký filter như một bean (hoặc bằng <code>FilterRegistrationBean</code>) và gán số thứ tự bằng <code>@Order</code> / <code>setOrder</code>; số nhỏ chạy trước. Cả chuỗi filter của Spring Security chỉ chiếm một vị trí trong danh sách này (sơ đồ ở slide 21).</div>`],
      [6, 'Creating a Basic Filter',
        `<p class="y-chinh">🎯 Five steps: (1) a class implementing <code>Filter</code> (init, doFilter, destroy); (2) put the behaviour in <code>doFilter</code>; (3) call <code>doFilter</code> on the <code>FilterChain</code>; (4) register the filter for the right servlets/JSPs; (5) "disable the invoker servlet".</p>
<p>Steps 1–4 are what every filter in this lesson does; slides 7–9 detail them. Step 3 is the one people forget — and forgetting it gives a blank page with status 200, because nothing after the filter ever runs.</p>
<p><strong>Step 5 is history.</strong> Tomcat up to version 6 shipped an <em>invoker servlet</em> that ran any class by name at <code>/servlet/ClassName</code>, bypassing your <code>&lt;servlet-mapping&gt;</code> — so a filter mapped to <code>/admin</code> could be skipped by calling <code>/servlet/AdminServlet</code>. The invoker was removed in Tomcat 7 (2011). On Tomcat 10.1 there is nothing to disable; the line survives from the source the slides were adapted from (Marty Hall's servlet books).</p>
<table>
<thead><tr><th>Step</th><th>Where on this page</th></tr></thead>
<tbody>
<tr><td>1 class + 3 methods</td><td>slide 7 (<code>TestFilter</code>)</td></tr>
<tr><td>2 behaviour in doFilter</td><td>slides 10, 14, 15</td></tr>
<tr><td>3 chain.doFilter</td><td>slides 3, 5, 14</td></tr>
<tr><td>4 register / map</td><td>slides 8, 9, 12, 13</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Năm bước: (1) một lớp cài đặt <code>Filter</code> (init, doFilter, destroy); (2) đặt hành vi vào <code>doFilter</code>; (3) gọi <code>doFilter</code> của <code>FilterChain</code>; (4) đăng ký filter cho đúng servlet/JSP; (5) "tắt invoker servlet".</p>
<p>Bước 1–4 là việc filter nào trong bài này cũng làm; slide 7–9 nói chi tiết. Bước 3 là bước hay bị quên — và quên nó thì được một trang trắng với mã 200, vì không có gì phía sau filter được chạy.</p>
<p><strong>Bước 5 đã là lịch sử.</strong> Tomcat tới bản 6 có sẵn một <em>invoker servlet</em> chạy bất kỳ lớp nào theo tên tại <code>/servlet/ClassName</code>, bỏ qua <code>&lt;servlet-mapping&gt;</code> của bạn — nên một filter ánh xạ vào <code>/admin</code> có thể bị né bằng cách gọi <code>/servlet/AdminServlet</code>. Invoker bị gỡ bỏ từ Tomcat 7 (2011). Trên Tomcat 10.1 không còn gì để tắt; dòng này sót lại từ nguồn mà slide chuyển thể (các sách servlet của Marty Hall).</p>
<table>
<thead><tr><th>Bước</th><th>Ở đâu trên trang này</th></tr></thead>
<tbody>
<tr><td>1 lớp + 3 phương thức</td><td>slide 7 (<code>TestFilter</code>)</td></tr>
<tr><td>2 hành vi trong doFilter</td><td>slide 10, 14, 15</td></tr>
<tr><td>3 chain.doFilter</td><td>slide 3, 5, 14</td></tr>
<tr><td>4 đăng ký / ánh xạ</td><td>slide 8, 9, 12, 13</td></tr>
</tbody>
</table>`],
      [7, 'Create a class that implements the Filter Interface',
        `<p class="y-chinh">🎯 The class must implement <code>Filter</code> (slide: <code>javax.servlet.Filter</code>; Tomcat 10+: <code>jakarta.servlet.Filter</code>) with three methods: <code>init(FilterConfig)</code>, <code>doFilter(ServletRequest, ServletResponse, FilterChain)</code> — run for every request to the mapped resource — and <code>destroy()</code>.</p>
<p class="ghi-chu">📄 <code>loc-bao-cao/src/main/java/TestFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void init(FilterConfig config) throws ServletException {
    context = config.getServletContext();
    System.out.println("TestFilter.init() — filter created when the app starts");
}</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/5275151fb322b0a53581b32279abdb0d1e709828.svg" alt="The life of a filter: one object, created with the application, not with the first request" loading="lazy" /><p class="chu-thich">🧩 The life of a filter: one object, created with the application, not with the first request</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title The life of a filter (slides 6–7): one object, created with the app, called on every matching request
[*] --&gt; Ready : app deployed\\n/ new object + init(FilterConfig)
Ready --&gt; Ready : each matching request\\n/ doFilter(req, resp, chain)
Ready --&gt; [*] : app stopped or undeployed\\n/ destroy()
Ready : ONE object shared by all threads\\n⇒ no per-request data in fields
@enduml</code></pre></details>
<p>Measured on Tomcat 10.1: <code>init</code> ran <strong>when the app was deployed</strong>, before any request (its line is the first in the log of slide 11's run); <code>destroy</code> ran when the app was removed (slide 12's run). Unlike servlets, filters have no "lazy" mode — every declared filter is created at start-up.</p>
<p><strong>The parameters are the general types</strong> <code>ServletRequest</code>/<code>ServletResponse</code>, because filters predate HTTP-only thinking. To read the session, URI or headers you cast: <code>HttpServletRequest req = (HttpServletRequest) request;</code> — every filter in this lesson starts like that.</p>
<p>➕ Since Servlet 4.0, <code>init</code> and <code>destroy</code> are <em>default</em> methods of the interface: a filter that needs no setup can implement only <code>doFilter</code>. The FE still expects you to name all three.</p>
<div class="pitfall">FE question type: "which method is called first when a filter is initialised?" — <code>init()</code>, called once. "When is <code>destroy()</code> called?" — once, at the end of the filter's life (the app is stopped or undeployed), not after each request.</div>`,
        `<p class="y-chinh">🎯 Lớp phải cài đặt <code>Filter</code> (slide: <code>javax.servlet.Filter</code>; Tomcat 10+: <code>jakarta.servlet.Filter</code>) với ba phương thức: <code>init(FilterConfig)</code>, <code>doFilter(ServletRequest, ServletResponse, FilterChain)</code> — chạy cho mỗi request tới tài nguyên đã ánh xạ — và <code>destroy()</code>.</p>
<p class="ghi-chu">📄 <code>loc-bao-cao/src/main/java/TestFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void init(FilterConfig config) throws ServletException {
    context = config.getServletContext();
    System.out.println("TestFilter.init() — filter created when the app starts");
}</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/5275151fb322b0a53581b32279abdb0d1e709828.svg" alt="Vòng đời của filter: một đối tượng, được tạo cùng ứng dụng, không phải cùng request đầu tiên" loading="lazy" /><p class="chu-thich">🧩 Vòng đời của filter: một đối tượng, được tạo cùng ứng dụng, không phải cùng request đầu tiên</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title The life of a filter (slides 6–7): one object, created with the app, called on every matching request
[*] --&gt; Ready : app deployed\\n/ new object + init(FilterConfig)
Ready --&gt; Ready : each matching request\\n/ doFilter(req, resp, chain)
Ready --&gt; [*] : app stopped or undeployed\\n/ destroy()
Ready : ONE object shared by all threads\\n⇒ no per-request data in fields
@enduml</code></pre></details>
<p>Đo trên Tomcat 10.1: <code>init</code> chạy <strong>lúc ứng dụng được deploy</strong>, trước mọi request (dòng của nó đứng đầu log trong lần chạy ở slide 11); <code>destroy</code> chạy khi ứng dụng bị gỡ (lần chạy ở slide 12). Khác servlet, filter không có chế độ "nạp lười" — filter nào đã khai đều được tạo lúc khởi động.</p>
<p><strong>Tham số là các kiểu tổng quát</strong> <code>ServletRequest</code>/<code>ServletResponse</code>, vì filter có từ trước khi mọi thứ chỉ là HTTP. Muốn đọc session, URI hay header thì ép kiểu: <code>HttpServletRequest req = (HttpServletRequest) request;</code> — filter nào trong bài này cũng mở đầu như vậy.</p>
<p>➕ Từ Servlet 4.0, <code>init</code> và <code>destroy</code> là phương thức <em>default</em> của interface: filter không cần chuẩn bị gì có thể chỉ cài <code>doFilter</code>. Đề FE vẫn chờ bạn kể đủ cả ba.</p>
<div class="pitfall">Dạng câu FE: "phương thức nào được gọi đầu tiên khi filter khởi tạo?" — <code>init()</code>, gọi một lần. "<code>destroy()</code> được gọi khi nào?" — một lần, ở cuối đời filter (ứng dụng dừng hoặc bị gỡ), không phải sau mỗi request.</div>`],
      [8, 'Register the Filter',
        `<p class="y-chinh">🎯 Register a filter in web.xml with two elements: <code>&lt;filter&gt;</code> (a name + the class) and <code>&lt;filter-mapping&gt;</code> (the same name + the URL pattern it guards).</p>
<p>It mirrors <code>&lt;servlet&gt;</code> + <code>&lt;servlet-mapping&gt;</code> from Chapter 2: one element says <em>what</em>, the other says <em>where</em>. The slide's sentence "register filter in servlet" means "in the web application's web.xml" — a filter is never registered inside a servlet.</p>
<pre><code class="language-xml">&lt;filter&gt;
    &lt;filter-name&gt;Auth&lt;/filter-name&gt;                    &lt;!-- any name, used only to connect the two --&gt;
    &lt;filter-class&gt;filter.AuthorizationFilter&lt;/filter-class&gt;   &lt;!-- fully qualified class name --&gt;
&lt;/filter&gt;
&lt;filter-mapping&gt;
    &lt;filter-name&gt;Auth&lt;/filter-name&gt;
    &lt;url-pattern&gt;/*&lt;/url-pattern&gt;                       &lt;!-- same pattern kinds as servlets: /x, /x/*, *.jsp --&gt;
&lt;/filter-mapping&gt;</code></pre>
<p>➕ The annotation form (Servlet 3.0+), used by the role filter of lesson 8.3 — no web.xml needed:</p>
<pre><code class="language-java">@WebFilter("/*")
public class AuthorizationFilter implements Filter { ... }</code></pre>
<div class="pitfall">FE question type: "which XML elements define a filter?" — <code>&lt;filter&gt;</code> and <code>&lt;filter-mapping&gt;</code>. Invented names like <code>&lt;servlet-filter&gt;</code> or <code>&lt;filter-definition&gt;</code> do not exist. "Where can a filter be declared?" — web.xml <em>or</em> <code>@WebFilter</code>, both.</div>`,
        `<p class="y-chinh">🎯 Đăng ký filter trong web.xml bằng hai phần tử: <code>&lt;filter&gt;</code> (một cái tên + lớp) và <code>&lt;filter-mapping&gt;</code> (cùng cái tên đó + URL pattern mà nó canh gác).</p>
<p>Nó giống hệt <code>&lt;servlet&gt;</code> + <code>&lt;servlet-mapping&gt;</code> ở Chương 2: một phần tử nói <em>cái gì</em>, phần tử kia nói <em>ở đâu</em>. Câu "register filter in servlet" trên slide nghĩa là "trong web.xml của ứng dụng web" — filter không bao giờ được đăng ký bên trong một servlet.</p>
<pre><code class="language-xml">&lt;filter&gt;
    &lt;filter-name&gt;Auth&lt;/filter-name&gt;                    &lt;!-- tên tuỳ ý, chỉ để nối hai phần tử --&gt;
    &lt;filter-class&gt;filter.AuthorizationFilter&lt;/filter-class&gt;   &lt;!-- tên lớp đầy đủ --&gt;
&lt;/filter&gt;
&lt;filter-mapping&gt;
    &lt;filter-name&gt;Auth&lt;/filter-name&gt;
    &lt;url-pattern&gt;/*&lt;/url-pattern&gt;                       &lt;!-- cùng các kiểu pattern như servlet: /x, /x/*, *.jsp --&gt;
&lt;/filter-mapping&gt;</code></pre>
<p>➕ Dạng annotation (Servlet 3.0+), dùng trong filter vai trò của bài 8.3 — không cần web.xml:</p>
<pre><code class="language-java">@WebFilter("/*")
public class AuthorizationFilter implements Filter { ... }</code></pre>
<div class="pitfall">Dạng câu FE: "phần tử XML nào định nghĩa filter?" — <code>&lt;filter&gt;</code> và <code>&lt;filter-mapping&gt;</code>. Những tên bịa như <code>&lt;servlet-filter&gt;</code> hay <code>&lt;filter-definition&gt;</code> không tồn tại. "Filter khai báo ở đâu được?" — web.xml <em>hoặc</em> <code>@WebFilter</code>, cả hai.</div>`],
      [9, 'Understanding filter and mapping tags',
        `<p class="y-chinh">🎯 Inside <code>&lt;filter&gt;</code>: icon, filter-name, display-name, filter-class, init-param. Inside <code>&lt;filter-mapping&gt;</code>: filter-name, url-pattern <em>or</em> servlet-name, and an optional <code>&lt;dispatcher&gt;</code> — REQUEST, FORWARD, INCLUDE or ERROR — saying which <em>kind</em> of request the mapping applies to.</p>
<p><strong>Dispatcher types</strong>: a JSP can be reached directly by the browser (REQUEST), by a servlet's <code>forward()</code> (FORWARD), by <code>&lt;jsp:include&gt;</code>/<code>include()</code> (INCLUDE), or as an <code>&lt;error-page&gt;</code> (ERROR). With no <code>&lt;dispatcher&gt;</code>, a mapping covers <strong>REQUEST only</strong>. Below, one class is declared twice: <em>RequestOnly</em> without dispatcher, <em>AllTypes</em> with all four.</p>
<p class="ghi-chu">📄 <code>loc-dispatcher/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;filter&gt;
        &lt;filter-name&gt;RequestOnly&lt;/filter-name&gt;
        &lt;filter-class&gt;demo.SpyFilter&lt;/filter-class&gt;
    &lt;/filter&gt;
    &lt;filter&gt;
        &lt;filter-name&gt;AllTypes&lt;/filter-name&gt;
        &lt;filter-class&gt;demo.SpyFilter&lt;/filter-class&gt;
    &lt;/filter&gt;

    &lt;filter-mapping&gt;                          &lt;!-- no &lt;dispatcher&gt; ⇒ REQUEST only --&gt;
        &lt;filter-name&gt;RequestOnly&lt;/filter-name&gt;
        &lt;url-pattern&gt;*.jsp&lt;/url-pattern&gt;
    &lt;/filter-mapping&gt;
    &lt;filter-mapping&gt;
        &lt;filter-name&gt;AllTypes&lt;/filter-name&gt;
        &lt;url-pattern&gt;*.jsp&lt;/url-pattern&gt;
        &lt;dispatcher&gt;REQUEST&lt;/dispatcher&gt;
        &lt;dispatcher&gt;FORWARD&lt;/dispatcher&gt;
        &lt;dispatcher&gt;INCLUDE&lt;/dispatcher&gt;
        &lt;dispatcher&gt;ERROR&lt;/dispatcher&gt;
    &lt;/filter-mapping&gt;

    &lt;error-page&gt;
        &lt;exception-type&gt;java.lang.Throwable&lt;/exception-type&gt;
        &lt;location&gt;/WEB-INF/views/error.jsp&lt;/location&gt;
    &lt;/error-page&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>loc-dispatcher/src/main/java/demo/SpyFilter.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;

// One class, declared TWICE in web.xml under two names with different &lt;dispatcher&gt; lists
public class SpyFilter implements Filter {
    private String name;

    @Override
    public void init(FilterConfig config) {
        name = config.getFilterName();          // "RequestOnly" or "AllTypes"
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest r = (HttpServletRequest) req;
        // getDispatcherType(): how did this request reach the resource?
        String target = r.getDispatcherType() == DispatcherType.INCLUDE
                ? (String) r.getAttribute(RequestDispatcher.INCLUDE_SERVLET_PATH)   // the included page
                : r.getServletPath();
        System.out.println(name + " sees " + r.getDispatcherType() + " " + target);
        chain.doFilter(req, resp);
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-dispatcher/show HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 60

result.jsp: forwarded by ShowServlet
footer.jsp (included)</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">AllTypes sees FORWARD /WEB-INF/views/result.jsp<br>
AllTypes sees INCLUDE /WEB-INF/views/footer.jsp</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-dispatcher/page.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 38

page.jsp: reached by a normal request</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">RequestOnly sees REQUEST /page.jsp<br>
AllTypes sees REQUEST /page.jsp</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-dispatcher/crash HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/plain;charset=UTF-8
Content-Length: 45

error.jsp: something went wrong (status 500)</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">AllTypes sees ERROR /WEB-INF/views/error.jsp</div>
<p>Forward vs redirect (syllabus session 51) seen from a filter: a <strong>forward</strong> happens inside the same request, so only FORWARD-mapped filters run again; a <strong>redirect</strong> is a 302 answer, and the browser's next request is a brand-new REQUEST that passes every filter from the start:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-dispatcher/go HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /loc-dispatcher/page.jsp
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-dispatcher/page.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 38

page.jsp: reached by a normal request</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">RequestOnly sees REQUEST /page.jsp<br>
AllTypes sees REQUEST /page.jsp</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/e28e16a8dbca58ecc53368ee56d12e4a33acb125.svg" alt="Forward stays inside one request; redirect makes a new one" loading="lazy" /><p class="chu-thich">🧩 Forward stays inside one request; redirect makes a new one</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 9: &lt;dispatcher&gt; — forward stays inside ONE request, redirect makes a NEW one
participant "Browser" as B
participant "ShowServlet /show\\nGoServlet /go" as S
participant "RequestOnly\\n(no &lt;dispatcher&gt;)" as R
participant "AllTypes\\n(REQUEST, FORWARD,\\nINCLUDE, ERROR)" as A
participant "JSP" as J
== forward ==
B -&gt; S : GET /show
S -&gt; A : forward("/WEB-INF/views/result.jsp")\\nDispatcherType.FORWARD
note over R : skipped: its mapping\\ncovers REQUEST only
A -&gt; J : chain.doFilter → result.jsp
J --&gt; B : 200 — the browser still shows /show
== redirect ==
B -&gt; S : GET /go
S --&gt; B : 302 Location: /page.jsp
B -&gt; R : NEW request GET /page.jsp\\nDispatcherType.REQUEST
R -&gt; A : chain.doFilter
A -&gt; J : chain.doFilter → page.jsp
J --&gt; B : 200 — the browser now shows /page.jsp
@enduml</code></pre></details>
<div class="pitfall">Security consequence: a login filter mapped to <code>*.jsp</code> with the default dispatcher does <strong>not</strong> run when a servlet forwards to <code>/WEB-INF/views/x.jsp</code>. Protect the <em>URLs the browser calls</em> (<code>/admin/*</code>, or <code>/*</code> with a public list) — lesson 8.3, exercise 3.</div>`,
        `<p class="y-chinh">🎯 Trong <code>&lt;filter&gt;</code>: icon, filter-name, display-name, filter-class, init-param. Trong <code>&lt;filter-mapping&gt;</code>: filter-name, url-pattern <em>hoặc</em> servlet-name, và một <code>&lt;dispatcher&gt;</code> tuỳ chọn — REQUEST, FORWARD, INCLUDE hoặc ERROR — cho biết mapping áp dụng cho <em>loại</em> request nào.</p>
<p><strong>Các loại dispatcher</strong>: một JSP có thể được trình duyệt gọi thẳng (REQUEST), được servlet <code>forward()</code> tới (FORWARD), được <code>&lt;jsp:include&gt;</code>/<code>include()</code> chèn vào (INCLUDE), hoặc được hiện như <code>&lt;error-page&gt;</code> (ERROR). Không ghi <code>&lt;dispatcher&gt;</code> thì mapping chỉ áp dụng cho <strong>REQUEST</strong>. Dưới đây một lớp được khai hai lần: <em>RequestOnly</em> không có dispatcher, <em>AllTypes</em> có đủ bốn loại.</p>
<p class="ghi-chu">📄 <code>loc-dispatcher/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;filter&gt;
        &lt;filter-name&gt;RequestOnly&lt;/filter-name&gt;
        &lt;filter-class&gt;demo.SpyFilter&lt;/filter-class&gt;
    &lt;/filter&gt;
    &lt;filter&gt;
        &lt;filter-name&gt;AllTypes&lt;/filter-name&gt;
        &lt;filter-class&gt;demo.SpyFilter&lt;/filter-class&gt;
    &lt;/filter&gt;

    &lt;filter-mapping&gt;                          &lt;!-- không có &lt;dispatcher&gt; ⇒ chỉ REQUEST --&gt;
        &lt;filter-name&gt;RequestOnly&lt;/filter-name&gt;
        &lt;url-pattern&gt;*.jsp&lt;/url-pattern&gt;
    &lt;/filter-mapping&gt;
    &lt;filter-mapping&gt;
        &lt;filter-name&gt;AllTypes&lt;/filter-name&gt;
        &lt;url-pattern&gt;*.jsp&lt;/url-pattern&gt;
        &lt;dispatcher&gt;REQUEST&lt;/dispatcher&gt;
        &lt;dispatcher&gt;FORWARD&lt;/dispatcher&gt;
        &lt;dispatcher&gt;INCLUDE&lt;/dispatcher&gt;
        &lt;dispatcher&gt;ERROR&lt;/dispatcher&gt;
    &lt;/filter-mapping&gt;

    &lt;error-page&gt;
        &lt;exception-type&gt;java.lang.Throwable&lt;/exception-type&gt;
        &lt;location&gt;/WEB-INF/views/error.jsp&lt;/location&gt;
    &lt;/error-page&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>loc-dispatcher/src/main/java/demo/SpyFilter.java</code></p>
<pre class="web-src"><code class="language-java">package demo;

import java.io.IOException;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;

// Một lớp, khai HAI lần trong web.xml dưới hai tên với danh sách &lt;dispatcher&gt; khác nhau
public class SpyFilter implements Filter {
    private String name;

    @Override
    public void init(FilterConfig config) {
        name = config.getFilterName();          // "RequestOnly" hoặc "AllTypes"
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest r = (HttpServletRequest) req;
        // getDispatcherType(): request tới tài nguyên bằng đường nào?
        String target = r.getDispatcherType() == DispatcherType.INCLUDE
                ? (String) r.getAttribute(RequestDispatcher.INCLUDE_SERVLET_PATH)   // trang được include
                : r.getServletPath();
        System.out.println(name + " sees " + r.getDispatcherType() + " " + target);
        chain.doFilter(req, resp);
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-dispatcher/show HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 60

result.jsp: forwarded by ShowServlet
footer.jsp (included)</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">AllTypes sees FORWARD /WEB-INF/views/result.jsp<br>
AllTypes sees INCLUDE /WEB-INF/views/footer.jsp</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-dispatcher/page.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 38

page.jsp: reached by a normal request</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">RequestOnly sees REQUEST /page.jsp<br>
AllTypes sees REQUEST /page.jsp</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-dispatcher/crash HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/plain;charset=UTF-8
Content-Length: 45

error.jsp: something went wrong (status 500)</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">AllTypes sees ERROR /WEB-INF/views/error.jsp</div>
<p>Forward và redirect (buổi 51 của đề cương) nhìn từ phía filter: <strong>forward</strong> diễn ra bên trong cùng một request, nên chỉ filter có mapping FORWARD mới chạy lại; <strong>redirect</strong> là một câu trả lời 302, và request tiếp theo của trình duyệt là một REQUEST hoàn toàn mới, đi qua mọi filter từ đầu:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-dispatcher/go HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /loc-dispatcher/page.jsp
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-dispatcher/page.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 38

page.jsp: reached by a normal request</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">RequestOnly sees REQUEST /page.jsp<br>
AllTypes sees REQUEST /page.jsp</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/e28e16a8dbca58ecc53368ee56d12e4a33acb125.svg" alt="Forward nằm trong một request; redirect tạo request mới" loading="lazy" /><p class="chu-thich">🧩 Forward nằm trong một request; redirect tạo request mới</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 9: &lt;dispatcher&gt; — forward stays inside ONE request, redirect makes a NEW one
participant "Browser" as B
participant "ShowServlet /show\\nGoServlet /go" as S
participant "RequestOnly\\n(no &lt;dispatcher&gt;)" as R
participant "AllTypes\\n(REQUEST, FORWARD,\\nINCLUDE, ERROR)" as A
participant "JSP" as J
== forward ==
B -&gt; S : GET /show
S -&gt; A : forward("/WEB-INF/views/result.jsp")\\nDispatcherType.FORWARD
note over R : skipped: its mapping\\ncovers REQUEST only
A -&gt; J : chain.doFilter → result.jsp
J --&gt; B : 200 — the browser still shows /show
== redirect ==
B -&gt; S : GET /go
S --&gt; B : 302 Location: /page.jsp
B -&gt; R : NEW request GET /page.jsp\\nDispatcherType.REQUEST
R -&gt; A : chain.doFilter
A -&gt; J : chain.doFilter → page.jsp
J --&gt; B : 200 — the browser now shows /page.jsp
@enduml</code></pre></details>
<div class="pitfall">Hệ quả bảo mật: filter đăng nhập ánh xạ vào <code>*.jsp</code> với dispatcher mặc định <strong>không</strong> chạy khi servlet forward tới <code>/WEB-INF/views/x.jsp</code>. Hãy bảo vệ <em>các URL trình duyệt gọi</em> (<code>/admin/*</code>, hoặc <code>/*</code> kèm danh sách công khai) — bài 8.3, bài tập 3.</div>`],
      [10, 'Example : Reporting Filter',
        `<p class="y-chinh">🎯 The Reporting Filter: <code>TestFilter implements Filter</code>; in <code>doFilter</code> it casts the request, prints "<em>host</em> tried to access <em>URL</em> on <em>date</em>." and calls <code>chain.doFilter</code>; <code>init</code> and <code>destroy</code> are empty.</p>
<p>The slide's code with <code>jakarta</code> imports. Two honest changes, both marked in comments: the date is left out (so the recorded log is the same on every run), and a line after <code>chain.doFilter</code> shows the "way back" that slide 14 talks about:</p>
<p class="ghi-chu">📄 <code>loc-bao-cao/src/main/java/TestFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws ServletException, IOException {
    HttpServletRequest req = (HttpServletRequest) request;     // the chain hands us the general types
    // slide 10 also prints "on " + new Date() — left out so this recorded log stays the same on every run
    System.out.println(req.getRemoteHost() + " tried to access " + req.getRequestURL() + ".");
    context.log("TestFilter: " + req.getRequestURI());         // slide 14: goes to Tomcat's log FILE, not the console
    chain.doFilter(request, response);                         // pass the request on: next filter, or the servlet
    System.out.println("TestFilter: back from the servlet, response status " + ((HttpServletResponse) response).getStatus());
}</code></pre>
<p>Line by line: the cast is needed because <code>getRequestURL()</code> belongs to <code>HttpServletRequest</code>; <code>getRemoteHost()</code> returns the client's address — on Tomcat it is the IP (<code>172.17.0.1</code> in our run, the Docker gateway), not a host name, because DNS lookups are off by default (<code>enableLookups="false"</code>); <code>chain.doFilter</code> hands the request to the servlet.</p>
<p>The classes are in the <em>default package</em>, as on the slide. Tomcat accepts it, but you cannot <code>import</code> a class from the default package — in your Assignment put filters in a package (<code>filter</code>, <code>controller</code>…).</p>`,
        `<p class="y-chinh">🎯 Reporting Filter (filter báo cáo): <code>TestFilter implements Filter</code>; trong <code>doFilter</code> nó ép kiểu request, in ra "<em>máy</em> tried to access <em>URL</em> on <em>ngày giờ</em>." rồi gọi <code>chain.doFilter</code>; <code>init</code> và <code>destroy</code> để trống.</p>
<p>Code của slide với import <code>jakarta</code>. Hai thay đổi minh bạch, đều ghi trong chú thích: bỏ ngày giờ (để log ghi lại giống nhau mọi lần chạy), và thêm một dòng sau <code>chain.doFilter</code> để thấy "đường về" mà slide 14 nói tới:</p>
<p class="ghi-chu">📄 <code>loc-bao-cao/src/main/java/TestFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws ServletException, IOException {
    HttpServletRequest req = (HttpServletRequest) request;     // chuỗi đưa ta kiểu tổng quát
    // slide 10 in thêm "on " + new Date() — bỏ đi để log ghi lại giống nhau mọi lần chạy
    System.out.println(req.getRemoteHost() + " tried to access " + req.getRequestURL() + ".");
    context.log("TestFilter: " + req.getRequestURI());         // slide 14: vào FILE log của Tomcat, không ra console
    chain.doFilter(request, response);                         // chuyển request đi tiếp: filter kế, hoặc servlet
    System.out.println("TestFilter: back from the servlet, response status " + ((HttpServletResponse) response).getStatus());
}</code></pre>
<p>Từng dòng: phải ép kiểu vì <code>getRequestURL()</code> thuộc <code>HttpServletRequest</code>; <code>getRemoteHost()</code> trả địa chỉ của client — trên Tomcat đó là IP (<code>172.17.0.1</code> trong lần chạy này, cổng mạng của Docker), không phải tên máy, vì mặc định tắt tra DNS (<code>enableLookups="false"</code>); <code>chain.doFilter</code> chuyển request cho servlet.</p>
<p>Các lớp nằm ở <em>default package</em> (gói mặc định), y như slide. Tomcat chấp nhận, nhưng bạn không <code>import</code> được lớp ở gói mặc định — trong Assignment hãy đặt filter vào một gói (<code>filter</code>, <code>controller</code>…).</p>`],
      [11, 'Example : Reporting FilterCode for Servlet',
        `<p class="y-chinh">🎯 The servlet the filter guards: <code>TestServlet</code> sets <code>text/html</code> and prints a tiny page with an <code>H2</code> "Test" on a beige background.</p>
<p class="ghi-chu">📄 <code>loc-bao-cao/src/main/java/TestServlet.java</code></p>
<pre class="web-src"><code class="language-java">// Slide 11, rewritten for Tomcat 10+ (javax → jakarta)
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class TestServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.println("TestServlet.doGet()");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("&lt;HTML&gt;\\n" +
                "&lt;HEAD&gt;&lt;TITLE&gt;Test&lt;/TITLE&gt;&lt;/HEAD&gt;\\n" +
                "&lt;BODY BGCOLOR=\\"#FDF5E6\\"&gt;\\n" +
                "&lt;H2&gt;Test&lt;/H2&gt;\\n" +
                "&lt;/BODY&gt;&lt;/HTML&gt;");
    }
}</code></pre>
<p>Now one request to <code>/loc-bao-cao/TestServlet</code>. Read the log from top to bottom — it is the real order of events:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-bao-cao/TestServlet HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 94

&lt;HTML&gt;
&lt;HEAD&gt;&lt;TITLE&gt;Test&lt;/TITLE&gt;&lt;/HEAD&gt;
&lt;BODY BGCOLOR="#FDF5E6"&gt;
&lt;H2&gt;Test&lt;/H2&gt;
&lt;/BODY&gt;&lt;/HTML&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">TestFilter.init() — filter created when the app starts<br>
172.17.0.1 tried to access http://localhost:8080/loc-bao-cao/TestServlet.<br>
TestServlet.doGet()<br>
TestFilter: back from the servlet, response status 200</div>
<ol>
<li><code>TestFilter.init()</code> — printed at deployment (the runner's first record includes the deployment log).</li>
<li>the filter's line, <em>before</em> the servlet;</li>
<li><code>TestServlet.doGet()</code> — the servlet runs inside <code>chain.doFilter</code>;</li>
<li>back in the filter, which can now read the final status (200).</li>
</ol>
<p>The servlet's HTML is 1999-style (upper-case tags, <code>BGCOLOR</code>): it works, but the Assignment's pages should use HTML5 + CSS (Bootstrap 5 — requirement 1.4). Note <code>setContentType("text/html")</code> came out as <code>text/html;charset=UTF-8</code>: Tomcat 10.1 adds the UTF-8 default.</p>`,
        `<p class="y-chinh">🎯 Servlet được filter canh gác: <code>TestServlet</code> đặt <code>text/html</code> và in một trang nhỏ có <code>H2</code> "Test" trên nền màu be.</p>
<p class="ghi-chu">📄 <code>loc-bao-cao/src/main/java/TestServlet.java</code></p>
<pre class="web-src"><code class="language-java">// Slide 11, viết lại cho Tomcat 10+ (javax → jakarta)
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class TestServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        System.out.println("TestServlet.doGet()");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("&lt;HTML&gt;\\n" +
                "&lt;HEAD&gt;&lt;TITLE&gt;Test&lt;/TITLE&gt;&lt;/HEAD&gt;\\n" +
                "&lt;BODY BGCOLOR=\\"#FDF5E6\\"&gt;\\n" +
                "&lt;H2&gt;Test&lt;/H2&gt;\\n" +
                "&lt;/BODY&gt;&lt;/HTML&gt;");
    }
}</code></pre>
<p>Giờ gửi một request tới <code>/loc-bao-cao/TestServlet</code>. Đọc log từ trên xuống — đó là thứ tự sự kiện thật:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-bao-cao/TestServlet HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 94

&lt;HTML&gt;
&lt;HEAD&gt;&lt;TITLE&gt;Test&lt;/TITLE&gt;&lt;/HEAD&gt;
&lt;BODY BGCOLOR="#FDF5E6"&gt;
&lt;H2&gt;Test&lt;/H2&gt;
&lt;/BODY&gt;&lt;/HTML&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">TestFilter.init() — filter created when the app starts<br>
172.17.0.1 tried to access http://localhost:8080/loc-bao-cao/TestServlet.<br>
TestServlet.doGet()<br>
TestFilter: back from the servlet, response status 200</div>
<ol>
<li><code>TestFilter.init()</code> — in ra lúc deploy (bản ghi đầu tiên có kèm log lúc deploy).</li>
<li>dòng của filter, <em>trước</em> servlet;</li>
<li><code>TestServlet.doGet()</code> — servlet chạy bên trong <code>chain.doFilter</code>;</li>
<li>quay về filter, lúc này đọc được mã trạng thái cuối cùng (200).</li>
</ol>
<p>HTML của servlet theo kiểu năm 1999 (thẻ chữ hoa, <code>BGCOLOR</code>): chạy được, nhưng trang của Assignment nên dùng HTML5 + CSS (Bootstrap 5 — yêu cầu 1.4). Để ý <code>setContentType("text/html")</code> ra thành <code>text/html;charset=UTF-8</code>: Tomcat 10.1 tự thêm mặc định UTF-8.</p>`],
      [12, 'Example : Reporting FilterWeb.xml',
        `<p class="y-chinh">🎯 web.xml declares the filter "Reporter" (class <code>TestFilter</code>) and maps it with <code>&lt;servlet-name&gt;TestServlet&lt;/servlet-name&gt;</code> — to a <em>servlet</em>, not to a URL; then the usual <code>&lt;servlet&gt;</code> + <code>&lt;servlet-mapping&gt;</code> to <code>/TestServlet</code>.</p>
<p class="ghi-chu">📄 <code>loc-bao-cao/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!-- Slide 12 + the header every Tomcat 10.1 web.xml needs (the slide shows only &lt;web-app&gt;) --&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;filter&gt;
        &lt;filter-name&gt;Reporter&lt;/filter-name&gt;
        &lt;filter-class&gt;TestFilter&lt;/filter-class&gt;
    &lt;/filter&gt;

    &lt;filter-mapping&gt;
        &lt;filter-name&gt;Reporter&lt;/filter-name&gt;
        &lt;servlet-name&gt;TestServlet&lt;/servlet-name&gt;   &lt;!-- mapped to a SERVLET, not to a URL --&gt;
    &lt;/filter-mapping&gt;

    &lt;servlet&gt;
        &lt;servlet-name&gt;TestServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;TestServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;

    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;TestServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/TestServlet&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p>The slide shows a bare <code>&lt;web-app&gt;</code>. Tomcat 10.1 accepts that, but write the full header above (Servlet 6.0 namespace) — NetBeans generates it for you.</p>
<p><strong>Mapping by servlet-name</strong> means "wherever this servlet is reached from": if you later add a second URL for TestServlet, the filter follows automatically. The price: nothing else is filtered. A static page in the same app does not trigger the filter — no log line at all:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-bao-cao/index.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"206-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 206

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Static page&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;&lt;p&gt;A static file: no servlet, so the Reporter filter (mapped to TestServlet only) does not run.&lt;/p&gt;&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>And removing the app calls <code>destroy()</code>:</p>
<p class="ghi-chu">🛑 Undeploy the application (delete the WAR) — the Tomcat console prints:</p>
<div class="out log">TestFilter.destroy() — app is being stopped</div>`,
        `<p class="y-chinh">🎯 web.xml khai filter "Reporter" (lớp <code>TestFilter</code>) và ánh xạ nó bằng <code>&lt;servlet-name&gt;TestServlet&lt;/servlet-name&gt;</code> — vào một <em>servlet</em>, không phải một URL; sau đó là cặp <code>&lt;servlet&gt;</code> + <code>&lt;servlet-mapping&gt;</code> quen thuộc tới <code>/TestServlet</code>.</p>
<p class="ghi-chu">📄 <code>loc-bao-cao/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!-- Slide 12 + phần đầu mọi web.xml cho Tomcat 10.1 cần (slide chỉ ghi &lt;web-app&gt;) --&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;filter&gt;
        &lt;filter-name&gt;Reporter&lt;/filter-name&gt;
        &lt;filter-class&gt;TestFilter&lt;/filter-class&gt;
    &lt;/filter&gt;

    &lt;filter-mapping&gt;
        &lt;filter-name&gt;Reporter&lt;/filter-name&gt;
        &lt;servlet-name&gt;TestServlet&lt;/servlet-name&gt;   &lt;!-- ánh xạ tới một SERVLET, không phải một URL --&gt;
    &lt;/filter-mapping&gt;

    &lt;servlet&gt;
        &lt;servlet-name&gt;TestServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;TestServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;

    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;TestServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/TestServlet&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p>Slide chỉ ghi <code>&lt;web-app&gt;</code> trần. Tomcat 10.1 vẫn nhận, nhưng hãy viết đủ phần đầu như trên (namespace Servlet 6.0) — NetBeans tự sinh giúp bạn.</p>
<p><strong>Ánh xạ theo servlet-name</strong> nghĩa là "servlet này được gọi từ đâu cũng được lọc": sau này thêm URL thứ hai cho TestServlet thì filter tự đi theo. Cái giá: ngoài servlet đó ra không gì bị lọc. Một trang tĩnh trong cùng ứng dụng không kích hoạt filter — log trống trơn:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-bao-cao/index.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"206-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 206

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Static page&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;&lt;p&gt;A static file: no servlet, so the Reporter filter (mapped to TestServlet only) does not run.&lt;/p&gt;&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Và gỡ ứng dụng thì <code>destroy()</code> được gọi:</p>
<p class="ghi-chu">🛑 Gỡ ứng dụng khỏi Tomcat (xoá file WAR) — console của Tomcat in ra:</p>
<div class="out log">TestFilter.destroy() — app is being stopped</div>`],
      [13, 'Initialization Parameter in Filter',
        `<p class="y-chinh">🎯 A filter can receive <code>&lt;init-param&gt;</code> name/value pairs inside its <code>&lt;filter&gt;</code> element, and read them in <code>init</code> with <code>config.getInitParameter("param1")</code>.</p>
<p>"Developers, End Users, Deployers" on the slide: the <em>developer</em> writes the filter once; the <em>deployer</em> (whoever installs the app on a server) can change its behaviour by editing web.xml, without recompiling. <code>GateFilter</code> from slide 3 takes its three rules this way:</p>
<p class="ghi-chu">📄 <code>loc-chan/src/main/webapp/WEB-INF/web.xml</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-xml">&lt;filter&gt;
    &lt;filter-name&gt;Gate&lt;/filter-name&gt;
    &lt;filter-class&gt;gate.GateFilter&lt;/filter-class&gt;
    &lt;init-param&gt;
        &lt;param-name&gt;blocked-agent&lt;/param-name&gt;
        &lt;param-value&gt;BadBot&lt;/param-value&gt;
    &lt;/init-param&gt;
    &lt;init-param&gt;
        &lt;param-name&gt;forbidden-prefix&lt;/param-name&gt;
        &lt;param-value&gt;/private&lt;/param-value&gt;
    &lt;/init-param&gt;
    &lt;init-param&gt;
        &lt;param-name&gt;maintenance-prefix&lt;/param-name&gt;
        &lt;param-value&gt;/shop&lt;/param-value&gt;
    &lt;/init-param&gt;
&lt;/filter&gt;
&lt;filter-mapping&gt;
    &lt;filter-name&gt;Gate&lt;/filter-name&gt;
    &lt;servlet-name&gt;gate.HelloServlet&lt;/servlet-name&gt;   &lt;!-- @WebServlet's default name = the class name --&gt;
&lt;/filter-mapping&gt;</code></pre>
<p class="ghi-chu">📄 <code>loc-chan/src/main/java/gate/GateFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void init(FilterConfig config) throws ServletException {
    blockedAgent = config.getInitParameter("blocked-agent");           // slide 13: config.getInitParameter
    forbiddenPrefix = config.getInitParameter("forbidden-prefix");
    maintenancePrefix = config.getInitParameter("maintenance-prefix");
    System.out.println("GateFilter.init(): blocked-agent=" + blockedAgent
            + ", forbidden-prefix=" + forbiddenPrefix + ", maintenance-prefix=" + maintenancePrefix);
}</code></pre>
<p>The values were printed at deployment: <code>GateFilter.init(): blocked-agent=BadBot, forbidden-prefix=/private, maintenance-prefix=/shop</code> (first line of the log in slide 3's first run). Read them <strong>once</strong> in <code>init</code> into fields — they never change while the app runs, so this is safe even though the filter object is shared by all threads.</p>
<div class="pitfall">Three different "parameters", three different methods: filter init-param → <code>FilterConfig.getInitParameter</code>; servlet init-param → <code>getServletConfig().getInitParameter</code>; context-param (whole app) → <code>getServletContext().getInitParameter</code>. A filter reading a context-param with <code>config.getInitParameter</code> gets <code>null</code>.</div>`,
        `<p class="y-chinh">🎯 Filter có thể nhận các cặp tên/giá trị <code>&lt;init-param&gt;</code> đặt trong phần tử <code>&lt;filter&gt;</code>, và đọc chúng trong <code>init</code> bằng <code>config.getInitParameter("param1")</code>.</p>
<p>"Developers, End Users, Deployers" trên slide: <em>lập trình viên</em> viết filter một lần; <em>người triển khai</em> (ai cài ứng dụng lên server) đổi được hành vi của nó bằng cách sửa web.xml, không phải biên dịch lại. <code>GateFilter</code> ở slide 3 nhận ba luật của nó theo cách này:</p>
<p class="ghi-chu">📄 <code>loc-chan/src/main/webapp/WEB-INF/web.xml</code> (trích)</p>
<pre class="web-src trich"><code class="language-xml">&lt;filter&gt;
    &lt;filter-name&gt;Gate&lt;/filter-name&gt;
    &lt;filter-class&gt;gate.GateFilter&lt;/filter-class&gt;
    &lt;init-param&gt;
        &lt;param-name&gt;blocked-agent&lt;/param-name&gt;
        &lt;param-value&gt;BadBot&lt;/param-value&gt;
    &lt;/init-param&gt;
    &lt;init-param&gt;
        &lt;param-name&gt;forbidden-prefix&lt;/param-name&gt;
        &lt;param-value&gt;/private&lt;/param-value&gt;
    &lt;/init-param&gt;
    &lt;init-param&gt;
        &lt;param-name&gt;maintenance-prefix&lt;/param-name&gt;
        &lt;param-value&gt;/shop&lt;/param-value&gt;
    &lt;/init-param&gt;
&lt;/filter&gt;
&lt;filter-mapping&gt;
    &lt;filter-name&gt;Gate&lt;/filter-name&gt;
    &lt;servlet-name&gt;gate.HelloServlet&lt;/servlet-name&gt;   &lt;!-- tên mặc định của @WebServlet = tên lớp đầy đủ --&gt;
&lt;/filter-mapping&gt;</code></pre>
<p class="ghi-chu">📄 <code>loc-chan/src/main/java/gate/GateFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void init(FilterConfig config) throws ServletException {
    blockedAgent = config.getInitParameter("blocked-agent");           // slide 13: config.getInitParameter
    forbiddenPrefix = config.getInitParameter("forbidden-prefix");
    maintenancePrefix = config.getInitParameter("maintenance-prefix");
    System.out.println("GateFilter.init(): blocked-agent=" + blockedAgent
            + ", forbidden-prefix=" + forbiddenPrefix + ", maintenance-prefix=" + maintenancePrefix);
}</code></pre>
<p>Các giá trị được in ra lúc deploy: <code>GateFilter.init(): blocked-agent=BadBot, forbidden-prefix=/private, maintenance-prefix=/shop</code> (dòng đầu log trong lần chạy đầu tiên ở slide 3). Đọc chúng <strong>một lần</strong> trong <code>init</code> vào các trường — chúng không đổi trong lúc ứng dụng chạy, nên an toàn dù đối tượng filter được mọi luồng dùng chung.</p>
<div class="pitfall">Ba loại "tham số", ba phương thức khác nhau: init-param của filter → <code>FilterConfig.getInitParameter</code>; init-param của servlet → <code>getServletConfig().getInitParameter</code>; context-param (cả ứng dụng) → <code>getServletContext().getInitParameter</code>. Filter đọc context-param bằng <code>config.getInitParameter</code> sẽ nhận <code>null</code>.</div>`],
      [14, 'Blocking the Response (1)',
        `<p class="y-chinh">🎯 What a filter normally does: cast the request, log "<em>host</em> tried to access <em>URL</em> on <em>date</em>" with <code>context.log(...)</code>, then <code>chain.doFilter(request, response)</code> — "this will call the next filter or servlet or JSP".</p>
<p>The title says "blocking" but this slide does <em>not</em> block: it is the "let it through" case, to compare with slide 15. Two details the slide leaves out:</p>
<ul>
<li><strong>Where <code>context</code> comes from</strong>: a field filled in <code>init</code> with <code>config.getServletContext()</code> — exactly what <code>TestFilter</code> does (slide 7).</li>
<li><strong>Where <code>context.log</code> writes</strong>: not to the console. We checked inside the container: the line went to Tomcat's file <code>logs/localhost.&lt;date&gt;.log</code> (in NetBeans: the "Apache Tomcat … Log" tab), which is why our examples also print with <code>System.out</code>.</li>
</ul>
<p><strong>"After" code runs on the way back.</strong> <code>chain.doFilter</code> returns only when everything behind it has finished, so code after it sees the finished response — the "TestFilter: back from the servlet, response status 200" line in slide 11's log. A logging filter writes its line there (lesson 8.3, exercise 4, measures what happens when the servlet throws).</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): Spring's <code>OncePerRequestFilter</code> is this same shape — you override <code>doFilterInternal(request, response, chain)</code>, already typed as HTTP, and call <code>chain.doFilter</code>; a JWT filter in LabFlow reads the <code>Authorization</code> header before that call.</div>`,
        `<p class="y-chinh">🎯 Việc filter thường làm: ép kiểu request, ghi log "<em>máy</em> tried to access <em>URL</em> on <em>ngày giờ</em>" bằng <code>context.log(...)</code>, rồi <code>chain.doFilter(request, response)</code> — "lời gọi này gọi filter kế tiếp, hoặc servlet, hoặc JSP".</p>
<p>Tiêu đề ghi "blocking" (chặn) nhưng slide này <em>không</em> chặn gì: đây là trường hợp "cho qua", để so với slide 15. Hai chi tiết slide bỏ qua:</p>
<ul>
<li><strong><code>context</code> lấy từ đâu</strong>: một trường được gán trong <code>init</code> bằng <code>config.getServletContext()</code> — đúng như <code>TestFilter</code> làm (slide 7).</li>
<li><strong><code>context.log</code> ghi vào đâu</strong>: không ra console. Ta đã kiểm bên trong container: dòng log nằm trong file <code>logs/localhost.&lt;ngày&gt;.log</code> của Tomcat (trong NetBeans: tab "Apache Tomcat … Log"), vì thế các ví dụ ở đây in thêm bằng <code>System.out</code>.</li>
</ul>
<p><strong>Code "sau" chạy trên đường về.</strong> <code>chain.doFilter</code> chỉ trả về khi mọi thứ phía sau đã làm xong, nên code đặt sau nó thấy response đã hoàn tất — dòng "TestFilter: back from the servlet, response status 200" trong log ở slide 11. Filter ghi log viết dòng của nó ở chỗ này (bài 8.3, bài tập 4, đo xem chuyện gì xảy ra khi servlet ném exception).</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): <code>OncePerRequestFilter</code> của Spring có đúng hình dạng này — bạn ghi đè <code>doFilterInternal(request, response, chain)</code>, kiểu đã là HTTP sẵn, và gọi <code>chain.doFilter</code>; filter JWT của LabFlow đọc header <code>Authorization</code> trước lời gọi đó.</div>`],
      [15, 'Blocking the Response (2)',
        `<p class="y-chinh">🎯 Blocking: after logging, <code>if (condition) response.sendRedirect("some other page/site"); else chain.doFilter(request, response);</code> — the resource runs only in the <code>else</code> branch.</p>
<p class="ghi-chu">📄 <code>loc-chan/src/main/java/gate/GateFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    String path = req.getServletPath();
    String agent = req.getHeader("User-Agent");

    if (agent != null &amp;&amp; agent.contains(blockedAgent)) {               // (a) redirect elsewhere
        System.out.println("GateFilter: " + path + " → redirect (bad agent)");
        resp.sendRedirect(req.getContextPath() + "/blocked.html");
        return;                                                          // ⚠ stop here: do NOT call chain.doFilter
    }
    if (path.startsWith(forbiddenPrefix)) {                             // (b) a particular status code
        System.out.println("GateFilter: " + path + " → 403");
        resp.sendError(HttpServletResponse.SC_FORBIDDEN);
        return;
    }
    if (path.startsWith(maintenancePrefix)) {                           // (c) replacement output
        System.out.println("GateFilter: " + path + " → replacement page");
        resp.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println("The shop is closed for maintenance. Please come back later.");
        return;
    }
    System.out.println("GateFilter: " + path + " → pass on (trimmed parameters)");
    chain.doFilter(new TrimmedRequest(req), response);                 // (d) modified request
}</code></pre>
<p><code>GateFilter</code> extends the slide's <code>if/else</code> into three ways of blocking, each ending with <code>return</code>. The bad bot gets the slide's exact behaviour — a redirect, then the servlet is never called:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-chan/hello?q=Java HTTP/1.1
Host: localhost:8080
User-Agent: BadBot/2.1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /loc-chan/blocked.html
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">GateFilter: /hello → redirect (bad agent)</div>
<p>Why <code>blocked.html</code> does not loop back into the filter: the filter is mapped to the servlet <code>gate.HelloServlet</code> only. A login filter on <code>/*</code> that redirects to a page <em>it also guards</em> sends the browser round in circles — lesson 8.3, exercise 2 shows the real 302 → 302 → 302.</p>
<div class="pitfall">Two bugs copied from the slide's style: (1) the slide's string uses curly quotes <code>“…”</code> — Java does not compile it; (2) forgetting <code>return</code> (or the <code>else</code>) after <code>sendRedirect</code> means the code goes on to <code>chain.doFilter</code> and the servlet runs anyway, writing into an already-committed response. Always: block ⇒ answer ⇒ <code>return</code>.</div>
<p class="meo">🧠 <code>sendRedirect</code> for "go somewhere else" (login page), <code>sendError(403)</code> for "you may not", your own output for "come back later" — the three are visible as 302, 403, 503 in the runs of slide 3.</p>`,
        `<p class="y-chinh">🎯 Chặn request: sau khi ghi log, <code>if (condition) response.sendRedirect("some other page/site"); else chain.doFilter(request, response);</code> — tài nguyên chỉ chạy ở nhánh <code>else</code>.</p>
<p class="ghi-chu">📄 <code>loc-chan/src/main/java/gate/GateFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    String path = req.getServletPath();
    String agent = req.getHeader("User-Agent");

    if (agent != null &amp;&amp; agent.contains(blockedAgent)) {               // (a) chuyển hướng sang chỗ khác
        System.out.println("GateFilter: " + path + " → redirect (bad agent)");
        resp.sendRedirect(req.getContextPath() + "/blocked.html");
        return;                                                          // ⚠ dừng ở đây: KHÔNG gọi chain.doFilter
    }
    if (path.startsWith(forbiddenPrefix)) {                             // (b) một mã trạng thái cụ thể
        System.out.println("GateFilter: " + path + " → 403");
        resp.sendError(HttpServletResponse.SC_FORBIDDEN);
        return;
    }
    if (path.startsWith(maintenancePrefix)) {                           // (c) output thay thế
        System.out.println("GateFilter: " + path + " → replacement page");
        resp.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println("The shop is closed for maintenance. Please come back later.");
        return;
    }
    System.out.println("GateFilter: " + path + " → pass on (trimmed parameters)");
    chain.doFilter(new TrimmedRequest(req), response);                 // (d) request đã sửa
}</code></pre>
<p><code>GateFilter</code> mở rộng <code>if/else</code> của slide thành ba cách chặn, cách nào cũng kết thúc bằng <code>return</code>. Bot xấu nhận đúng hành vi của slide — chuyển hướng, và servlet không bao giờ được gọi:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-chan/hello?q=Java HTTP/1.1
Host: localhost:8080
User-Agent: BadBot/2.1</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /loc-chan/blocked.html
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">GateFilter: /hello → redirect (bad agent)</div>
<p>Vì sao <code>blocked.html</code> không vòng ngược vào filter: filter chỉ ánh xạ vào servlet <code>gate.HelloServlet</code>. Một filter đăng nhập trên <code>/*</code> mà chuyển hướng tới trang <em>chính nó cũng canh</em> sẽ làm trình duyệt chạy vòng tròn — bài 8.3, bài tập 2 cho xem 302 → 302 → 302 thật.</p>
<div class="pitfall">Hai lỗi đến từ cách viết của slide: (1) chuỗi trên slide dùng ngoặc kép cong <code>“…”</code> — Java không biên dịch được; (2) quên <code>return</code> (hoặc <code>else</code>) sau <code>sendRedirect</code> thì code chạy tiếp xuống <code>chain.doFilter</code> và servlet vẫn chạy, viết vào một response đã commit. Luôn nhớ: chặn ⇒ trả lời ⇒ <code>return</code>.</div>
<p class="meo">🧠 <code>sendRedirect</code> cho "đi chỗ khác" (trang đăng nhập), <code>sendError(403)</code> cho "bạn không được phép", output tự viết cho "quay lại sau" — ba cái thấy rõ là 302, 403, 503 trong các lần chạy ở slide 3.</p>`],
      [16, 'Modifying the response',
        `<p class="y-chinh">🎯 If the filter just calls <code>chain.doFilter(request, response)</code>, the servlet/JSP generates the response and closes the stream — too late to change it. So the filter creates its own buffer, gives it to the servlet as if it were the response, and edits the content once the servlet is done.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/b202025bd067bb18f70fcc3c6f8d079b5d63a823.svg" alt="Slides 16–18 as a sequence: the JSP writes into the wrapper's buffer; the filter edits and sends" loading="lazy" /><p class="chu-thich">🧩 Slides 16–18 as a sequence: the JSP writes into the wrapper's buffer; the filter edits and sends</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 16–18: the filter hands the JSP a FAKE response, then edits what was written
participant "Tomcat" as T
participant "ReplaceSiteNameFilter" as F
participant "StringWrapper\\n(own StringWriter)" as W
participant "index.jsp" as J
T -&gt; F : doFilter(req, realResponse, chain)
F -&gt; W : new StringWrapper(realResponse)
F -&gt; J : chain.doFilter(req, wrapper)
J -&gt; W : getWriter().write("... test.com ...")
note right of W : the text lands in the\\nStringWriter, not on the network
J --&gt; F : return
F -&gt; W : toString()
W --&gt; F : "... test.com ..."
F -&gt; F : doModification: replace\\ntest.com → new.com
F -&gt; T : realResponse.getWriter().write(modified)
@enduml</code></pre></details>
<p>"Closes the stream" is a simplification: what matters is that bytes written to the real response may already be <strong>sent</strong> (committed — Chapter 1, slide 14) when the buffer fills or the JSP flushes. Once sent, they cannot be taken back. The trick is the <strong>wrapper</strong>: <code>HttpServletResponseWrapper</code> is a class that forwards every method to a real response, so you override only the ones you want — here <code>getWriter()</code>, returning a writer onto your own buffer.</p>
<p>The same trick on the request side is <code>HttpServletRequestWrapper</code> — the <code>TrimmedRequest</code> of slide 3, which overrides <code>getParameter</code>:</p>
<p class="ghi-chu">📄 <code>loc-chan/src/main/java/gate/GateFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// The servlet sees getParameter() values without spaces around them.
static class TrimmedRequest extends HttpServletRequestWrapper {
    TrimmedRequest(HttpServletRequest req) { super(req); }

    @Override
    public String getParameter(String name) {
        String v = super.getParameter(name);
        return v == null ? null : v.trim();
    }
}</code></pre>
<p class="meo">🧠 A wrapper is the <em>Decorator</em> design pattern: same interface, one or two methods changed, everything else delegated.</p>`,
        `<p class="y-chinh">🎯 Nếu filter chỉ gọi <code>chain.doFilter(request, response)</code>, servlet/JSP tạo response và đóng luồng — quá muộn để sửa. Nên filter tạo bộ đệm riêng, đưa nó cho servlet như thể đó là response, và sửa nội dung khi servlet làm xong.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/b202025bd067bb18f70fcc3c6f8d079b5d63a823.svg" alt="Slide 16–18 thành sơ đồ tuần tự: JSP viết vào bộ đệm của wrapper; filter sửa rồi gửi đi" loading="lazy" /><p class="chu-thich">🧩 Slide 16–18 thành sơ đồ tuần tự: JSP viết vào bộ đệm của wrapper; filter sửa rồi gửi đi</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 16–18: the filter hands the JSP a FAKE response, then edits what was written
participant "Tomcat" as T
participant "ReplaceSiteNameFilter" as F
participant "StringWrapper\\n(own StringWriter)" as W
participant "index.jsp" as J
T -&gt; F : doFilter(req, realResponse, chain)
F -&gt; W : new StringWrapper(realResponse)
F -&gt; J : chain.doFilter(req, wrapper)
J -&gt; W : getWriter().write("... test.com ...")
note right of W : the text lands in the\\nStringWriter, not on the network
J --&gt; F : return
F -&gt; W : toString()
W --&gt; F : "... test.com ..."
F -&gt; F : doModification: replace\\ntest.com → new.com
F -&gt; T : realResponse.getWriter().write(modified)
@enduml</code></pre></details>
<p>"Đóng luồng" là cách nói đơn giản hoá: điều quan trọng là các byte viết vào response thật có thể đã được <strong>gửi đi</strong> (commit — Chương 1, slide 14) khi bộ đệm đầy hoặc JSP gọi flush. Đã gửi thì không lấy lại được. Mẹo nằm ở <strong>wrapper</strong> (lớp bọc): <code>HttpServletResponseWrapper</code> là lớp chuyển mọi phương thức sang một response thật, nên bạn chỉ ghi đè những cái cần đổi — ở đây là <code>getWriter()</code>, trả về một writer ghi vào bộ đệm của chính bạn.</p>
<p>Mẹo tương tự ở phía request là <code>HttpServletRequestWrapper</code> — lớp <code>TrimmedRequest</code> ở slide 3, ghi đè <code>getParameter</code>:</p>
<p class="ghi-chu">📄 <code>loc-chan/src/main/java/gate/GateFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Servlet thấy giá trị getParameter() đã bỏ dấu cách hai đầu.
static class TrimmedRequest extends HttpServletRequestWrapper {
    TrimmedRequest(HttpServletRequest req) { super(req); }

    @Override
    public String getParameter(String name) {
        String v = super.getParameter(name);
        return v == null ? null : v.trim();
    }
}</code></pre>
<p class="meo">🧠 Wrapper chính là mẫu thiết kế <em>Decorator</em>: cùng interface, đổi một hai phương thức, còn lại chuyển hết cho đối tượng gốc.</p>`],
      [17, 'Modifying the response:Creating our Wrapper Class',
        `<p class="y-chinh">🎯 <code>StringWrapper extends HttpServletResponseWrapper</code>: it holds a <code>StringWriter</code>, creates it in the constructor after <code>super(response)</code>, and overrides <code>getWriter()</code> to return <code>new PrintWriter(stringwriter)</code>.</p>
<p class="ghi-chu">📄 <code>loc-thay-chu/src/main/java/StringWrapper.java</code></p>
<pre class="web-src"><code class="language-java">// Slide 17 (javax → jakarta) + the toString() that slide 18 calls but the slide's screenshot cuts off
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class StringWrapper extends HttpServletResponseWrapper {
    private StringWriter stringwriter;

    public StringWrapper(HttpServletResponse response) {
        super(response);
        stringwriter = new StringWriter();     // our own buffer: the servlet/JSP writes HERE
    }

    public PrintWriter getWriter() {
        return (new PrintWriter(stringwriter));
    }

    @Override
    public String toString() {                 // without this, slide 18 would get "StringWrapper@1b2c3d"
        return stringwriter.toString();
    }
}</code></pre>
<p>The screenshot on the slide stops at line 18 — and slide 18 then calls <code>responsewrapper.toString()</code>, expecting the captured text. Without an override, <code>toString()</code> is <code>Object</code>'s: it returns something like <code>StringWrapper@1b2c3d</code>, and that is what the user would see. The override above (marked <code>[tostring]</code>) is the missing piece.</p>
<p>Two more limits of this wrapper, measured on slide 20: it captures <code>getWriter()</code> only, not <code>getOutputStream()</code>; and it lets <code>setContentLength</code> through to the real response, so a servlet that sets a length makes the header wrong after the text changes. Lesson 8.3 exercise 5 builds a wrapper without these holes.</p>`,
        `<p class="y-chinh">🎯 <code>StringWrapper extends HttpServletResponseWrapper</code>: nó giữ một <code>StringWriter</code>, tạo nó trong constructor sau <code>super(response)</code>, và ghi đè <code>getWriter()</code> để trả về <code>new PrintWriter(stringwriter)</code>.</p>
<p class="ghi-chu">📄 <code>loc-thay-chu/src/main/java/StringWrapper.java</code></p>
<pre class="web-src"><code class="language-java">// Slide 17 (javax → jakarta) + hàm toString() mà slide 18 gọi nhưng ảnh chụp trên slide bị cắt mất
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class StringWrapper extends HttpServletResponseWrapper {
    private StringWriter stringwriter;

    public StringWrapper(HttpServletResponse response) {
        super(response);
        stringwriter = new StringWriter();     // bộ đệm riêng: servlet/JSP viết VÀO ĐÂY
    }

    public PrintWriter getWriter() {
        return (new PrintWriter(stringwriter));
    }

    @Override
    public String toString() {                 // thiếu hàm này, slide 18 nhận "StringWrapper@1b2c3d"
        return stringwriter.toString();
    }
}</code></pre>
<p>Ảnh chụp trên slide dừng ở dòng 18 — rồi slide 18 gọi <code>responsewrapper.toString()</code>, chờ nhận chữ đã bắt được. Không ghi đè thì <code>toString()</code> là của <code>Object</code>: trả về thứ kiểu <code>StringWrapper@1b2c3d</code>, và đó là thứ người dùng sẽ nhìn thấy. Hàm ghi đè ở trên (đánh dấu <code>[tostring]</code>) chính là mảnh còn thiếu.</p>
<p>Thêm hai giới hạn của wrapper này, đo ở slide 20: nó chỉ bắt <code>getWriter()</code>, không bắt <code>getOutputStream()</code>; và nó để <code>setContentLength</code> lọt sang response thật, nên servlet nào đặt độ dài thì header sẽ sai sau khi chữ bị đổi. Bài 8.3 bài tập 5 dựng một wrapper không có các lỗ hổng này.</p>`],
      [18, 'Modifying the response:In Filter Class',
        `<p class="y-chinh">🎯 In <code>doFilter</code>: cast to HTTP types, wrap the response in a <code>StringWrapper</code>, call <code>chain.doFilter(req, responsewrapper)</code>, run <code>doModification</code> on <code>responsewrapper.toString()</code>, then write the result with the <em>real</em> <code>response.getWriter()</code>.</p>
<p class="ghi-chu">📄 <code>loc-thay-chu/src/main/java/ReplaceSiteNameFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
        throws ServletException, IOException {
    HttpServletRequest request = (HttpServletRequest) req;      // local, not a field
    HttpServletResponse response = (HttpServletResponse) resp;

    StringWrapper responsewrapper = new StringWrapper(response);
    chain.doFilter(request, responsewrapper);                  // the JSP writes into OUR buffer
    String modifiedresponse = doModification(responsewrapper.toString());

    PrintWriter out = response.getWriter();                    // the REAL response
    out.write(modifiedresponse);
}</code></pre>
<div class="pitfall">A real bug on the slide: lines 32–33 write <code>request = (HttpServletRequest) req;</code> and <code>response = …</code> with no type — so <code>request</code> and <code>response</code> are <strong>fields</strong> of the filter. There is ONE filter object for all users (slide 7); two requests at the same moment overwrite each other's fields, and user A's page can be written into user B's response. Here they are local variables — the rule for every filter and servlet: no per-request data in fields.</div>
<p>The order of the three steps is the whole idea: (1) let the JSP write into the buffer, (2) change the text, (3) only now touch the real response. Writing to the real response before <code>chain.doFilter</code> returns would send the unmodified text.</p>`,
        `<p class="y-chinh">🎯 Trong <code>doFilter</code>: ép sang kiểu HTTP, bọc response trong một <code>StringWrapper</code>, gọi <code>chain.doFilter(req, responsewrapper)</code>, chạy <code>doModification</code> trên <code>responsewrapper.toString()</code>, rồi viết kết quả bằng <code>response.getWriter()</code> <em>thật</em>.</p>
<p class="ghi-chu">📄 <code>loc-thay-chu/src/main/java/ReplaceSiteNameFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
        throws ServletException, IOException {
    HttpServletRequest request = (HttpServletRequest) req;      // biến cục bộ, không phải trường
    HttpServletResponse response = (HttpServletResponse) resp;

    StringWrapper responsewrapper = new StringWrapper(response);
    chain.doFilter(request, responsewrapper);                  // JSP viết vào bộ đệm CỦA TA
    String modifiedresponse = doModification(responsewrapper.toString());

    PrintWriter out = response.getWriter();                    // response THẬT
    out.write(modifiedresponse);
}</code></pre>
<div class="pitfall">Một lỗi thật trên slide: dòng 32–33 viết <code>request = (HttpServletRequest) req;</code> và <code>response = …</code> không có kiểu — tức <code>request</code> và <code>response</code> là <strong>trường</strong> của filter. Chỉ có MỘT đối tượng filter cho mọi người dùng (slide 7); hai request cùng lúc sẽ ghi đè trường của nhau, và trang của người A có thể bị viết vào response của người B. Ở đây chúng là biến cục bộ — luật cho mọi filter và servlet: không để dữ liệu của từng request trong trường.</div>
<p>Thứ tự ba bước chính là toàn bộ ý tưởng: (1) để JSP viết vào bộ đệm, (2) đổi chữ, (3) tới lúc này mới đụng vào response thật. Viết vào response thật trước khi <code>chain.doFilter</code> trả về thì chữ chưa sửa sẽ bị gửi đi.</p>`],
      [19, 'Modifying the response:In Web.xml',
        `<p class="y-chinh">🎯 web.xml declares filter "Replacement" (class <code>ReplaceSiteNameFilter</code>) with two init-params, <code>target</code> = test.com and <code>replacement</code> = new.com, mapped to <code>/index.jsp</code> — "test.com will be replaced by new.com".</p>
<p class="ghi-chu">📄 <code>loc-thay-chu/src/main/webapp/WEB-INF/web.xml</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-xml">&lt;filter&gt;
    &lt;filter-name&gt;Replacement&lt;/filter-name&gt;
    &lt;filter-class&gt;ReplaceSiteNameFilter&lt;/filter-class&gt;
    &lt;init-param&gt;
        &lt;param-name&gt;target&lt;/param-name&gt;
        &lt;param-value&gt;test.com&lt;/param-value&gt;
    &lt;/init-param&gt;
    &lt;init-param&gt;
        &lt;param-name&gt;replacement&lt;/param-name&gt;
        &lt;param-value&gt;new.com&lt;/param-value&gt;
    &lt;/init-param&gt;
&lt;/filter&gt;
&lt;filter-mapping&gt;
    &lt;filter-name&gt;Replacement&lt;/filter-name&gt;
    &lt;url-pattern&gt;/index.jsp&lt;/url-pattern&gt;
&lt;/filter-mapping&gt;</code></pre>
<p>The JSP contains "test.com" twice; the browser receives "new.com" twice, and the Content-Length matches the new text (the JSP never set one):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-thay-chu/index.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 148

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;title&gt;Contact&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Visit new.com for the course page.&lt;/p&gt;
&lt;p&gt;Mail: help@new.com&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>A question worth testing rather than guessing: the filter is mapped to <code>/index.jsp</code> — does it still run when the user opens the bare folder <code>/loc-thay-chu/</code>, which Tomcat serves through the welcome file? It does: Tomcat maps the welcome file during URL mapping, so the filter sees <code>/index.jsp</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-thay-chu/ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 148

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;title&gt;Contact&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Visit new.com for the course page.&lt;/p&gt;
&lt;p&gt;Mail: help@new.com&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>`,
        `<p class="y-chinh">🎯 web.xml khai filter "Replacement" (lớp <code>ReplaceSiteNameFilter</code>) với hai init-param, <code>target</code> = test.com và <code>replacement</code> = new.com, ánh xạ vào <code>/index.jsp</code> — "test.com sẽ bị thay bằng new.com".</p>
<p class="ghi-chu">📄 <code>loc-thay-chu/src/main/webapp/WEB-INF/web.xml</code> (trích)</p>
<pre class="web-src trich"><code class="language-xml">&lt;filter&gt;
    &lt;filter-name&gt;Replacement&lt;/filter-name&gt;
    &lt;filter-class&gt;ReplaceSiteNameFilter&lt;/filter-class&gt;
    &lt;init-param&gt;
        &lt;param-name&gt;target&lt;/param-name&gt;
        &lt;param-value&gt;test.com&lt;/param-value&gt;
    &lt;/init-param&gt;
    &lt;init-param&gt;
        &lt;param-name&gt;replacement&lt;/param-name&gt;
        &lt;param-value&gt;new.com&lt;/param-value&gt;
    &lt;/init-param&gt;
&lt;/filter&gt;
&lt;filter-mapping&gt;
    &lt;filter-name&gt;Replacement&lt;/filter-name&gt;
    &lt;url-pattern&gt;/index.jsp&lt;/url-pattern&gt;
&lt;/filter-mapping&gt;</code></pre>
<p>JSP có "test.com" hai lần; trình duyệt nhận "new.com" hai lần, và Content-Length khớp với chữ mới (JSP không tự đặt độ dài):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-thay-chu/index.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 148

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;title&gt;Contact&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Visit new.com for the course page.&lt;/p&gt;
&lt;p&gt;Mail: help@new.com&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>Một câu hỏi nên thử chứ đừng đoán: filter ánh xạ vào <code>/index.jsp</code> — nó có chạy khi người dùng mở thư mục trần <code>/loc-thay-chu/</code>, thứ Tomcat phục vụ qua welcome file, không? Có: Tomcat ánh xạ welcome file ngay trong bước ánh xạ URL, nên filter thấy <code>/index.jsp</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-thay-chu/ HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 148

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;title&gt;Contact&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;Visit new.com for the course page.&lt;/p&gt;
&lt;p&gt;Mail: help@new.com&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>`],
      [20, 'Modifying the response:Modification Method',
        `<p class="y-chinh">🎯 The title promises the <code>doModification</code> method, but the slide is a copy of slide 19 (same web.xml, same side text) — the method is never shown.</p>
<p>It is one line — replace every <code>target</code> by <code>replacement</code>:</p>
<p class="ghi-chu">📄 <code>loc-thay-chu/src/main/java/ReplaceSiteNameFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private String doModification(String original) {               // the method slide 20 never shows
    return original.replace(target, replacement);
}</code></pre>
<p>➕ <strong>Where the slides' wrapper breaks.</strong> We also mapped the same filter to a static page, <code>about.html</code>. Tomcat's default servlet sends files with <code>getOutputStream()</code>, which <code>StringWrapper</code> does not override — so the bytes go straight to the real response, and then the filter's <code>response.getWriter()</code> throws:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /loc-thay-chu/about.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Accept-Ranges: bytes
ETag: W/"120-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 120

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
About test.com</code></pre>
<p>Read it carefully: status <strong>500</strong>, yet the body is the <em>original</em> file, "About test.com", unchanged. Tomcat's log has <code>IllegalStateException: getOutputStream() has already been called for this response</code> at <code>ReplaceSiteNameFilter.doFilter</code>. A servlet response may be written either through the writer or through the stream, never both. The full fix — capture both, recompute the length — is lesson 8.3, exercise 5.</p>`,
        `<p class="y-chinh">🎯 Tiêu đề hứa hàm <code>doModification</code>, nhưng slide này là bản sao của slide 19 (cùng web.xml, cùng dòng chữ bên cạnh) — hàm đó không hề được cho xem.</p>
<p>Nó chỉ một dòng — thay mọi <code>target</code> bằng <code>replacement</code>:</p>
<p class="ghi-chu">📄 <code>loc-thay-chu/src/main/java/ReplaceSiteNameFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private String doModification(String original) {               // hàm mà slide 20 không cho xem
    return original.replace(target, replacement);
}</code></pre>
<p>➕ <strong>Chỗ wrapper của slide bị vỡ.</strong> Ta ánh xạ thêm cùng filter đó vào một trang tĩnh, <code>about.html</code>. Default servlet của Tomcat gửi file bằng <code>getOutputStream()</code>, thứ mà <code>StringWrapper</code> không ghi đè — nên các byte đi thẳng tới response thật, rồi <code>response.getWriter()</code> của filter ném lỗi:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /loc-thay-chu/about.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Accept-Ranges: bytes
ETag: W/"120-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 120

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
About test.com</code></pre>
<p>Đọc kỹ: mã trạng thái <strong>500</strong>, vậy mà body lại là file <em>gốc</em>, "About test.com", không đổi gì. Log của Tomcat có <code>IllegalStateException: getOutputStream() has already been called for this response</code> tại <code>ReplaceSiteNameFilter.doFilter</code>. Một response chỉ được viết qua writer hoặc qua stream, không bao giờ cả hai. Cách sửa trọn — bắt cả hai, tính lại độ dài — là bài 8.3, bài tập 5.</p>`],
      [21, 'Summary',
        `<p class="y-chinh">🎯 The deck covered: what a filter is; what it is for; how to use one — creating a basic filter, the example, init parameters, blocking the response, modifying the response.</p>
<table>
<thead><tr><th>Summary line</th><th>Slides here</th><th>Can you…</th></tr></thead>
<tbody>
<tr><td>What a filter is</td><td>3, 5, 7</td><td>say what <code>chain.doFilter</code> does, and what happens without it?</td></tr>
<tr><td>What it is used for</td><td>4</td><td>name 4 real uses, and one thing that is NOT a filter's job?</td></tr>
<tr><td>Create, declare, map</td><td>6–9, 12</td><td>write <code>&lt;filter&gt;</code> + <code>&lt;filter-mapping&gt;</code> and <code>@WebFilter</code>; predict the order of 3 filters?</td></tr>
<tr><td>Init parameters</td><td>13</td><td>read an <code>&lt;init-param&gt;</code> in <code>init</code>?</td></tr>
<tr><td>Blocking</td><td>14–15</td><td>redirect, send 403, or write a replacement page — and <code>return</code>?</td></tr>
<tr><td>Modifying the response</td><td>16–20</td><td>explain why a wrapper is needed and what the slides' version misses?</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/e6107117271b6f6993225a9b52391b9ec0d7bf93.svg" alt="In Spring Boot: Spring Security is one servlet filter running its own chain" loading="lazy" /><p class="chu-thich">🧩 In Spring Boot: Spring Security is one servlet filter running its own chain</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title In Spring Boot: Spring Security is ONE servlet filter that runs its own chain of filters
participant "Browser" as B
participant "Tomcat\\nfilter chain" as T
participant "DelegatingFilterProxy\\n(a jakarta.servlet.Filter)" as D
participant "FilterChainProxy\\n(springSecurityFilterChain)" as P
participant "security filters\\n(CSRF, login, JWT,\\nauthorization…)" as SF
participant "DispatcherServlet" as DS
B -&gt; T : GET /api/admin/users
T -&gt; D : doFilter
D -&gt; P : doFilter
P -&gt; SF : run each filter in order
alt not authenticated / wrong role
  SF --&gt; B : 401 or 403 (chain stops here)
else allowed
  SF -&gt; DS : chain.doFilter → your @RestController
  DS --&gt; B : 200 + JSON
end
@enduml</code></pre></details>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): LabFlow's login and role checks will not be written as your own filter — they are configured in a <code>SecurityFilterChain</code> bean (<code>.requestMatchers("/api/admin/**").hasRole("ADMIN")</code>). But underneath it is exactly this lesson: one <code>jakarta.servlet.Filter</code> registered in Tomcat (<code>DelegatingFilterProxy</code>) that runs an ordered list of filters, each either calling <code>chain.doFilter</code> or answering 401/403 itself.</div>`,
        `<p class="y-chinh">🎯 Deck đã học: filter là gì; dùng làm gì; cách dùng — tạo filter cơ bản, ví dụ, tham số khởi tạo, chặn response, sửa response.</p>
<table>
<thead><tr><th>Dòng tóm tắt</th><th>Slide ở đây</th><th>Bạn đã làm được…</th></tr></thead>
<tbody>
<tr><td>Filter là gì</td><td>3, 5, 7</td><td>nói được <code>chain.doFilter</code> làm gì, và thiếu nó thì sao?</td></tr>
<tr><td>Dùng làm gì</td><td>4</td><td>kể 4 công dụng thật, và một việc KHÔNG phải của filter?</td></tr>
<tr><td>Tạo, khai báo, ánh xạ</td><td>6–9, 12</td><td>viết <code>&lt;filter&gt;</code> + <code>&lt;filter-mapping&gt;</code> và <code>@WebFilter</code>; đoán đúng thứ tự 3 filter?</td></tr>
<tr><td>Tham số khởi tạo</td><td>13</td><td>đọc một <code>&lt;init-param&gt;</code> trong <code>init</code>?</td></tr>
<tr><td>Chặn</td><td>14–15</td><td>chuyển hướng, gửi 403, hoặc viết trang thay thế — và <code>return</code>?</td></tr>
<tr><td>Sửa response</td><td>16–20</td><td>giải thích vì sao cần wrapper và bản của slide thiếu gì?</td></tr>
</tbody>
</table>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/e6107117271b6f6993225a9b52391b9ec0d7bf93.svg" alt="Trong Spring Boot: Spring Security là một servlet filter chạy chuỗi filter riêng của nó" loading="lazy" /><p class="chu-thich">🧩 Trong Spring Boot: Spring Security là một servlet filter chạy chuỗi filter riêng của nó</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title In Spring Boot: Spring Security is ONE servlet filter that runs its own chain of filters
participant "Browser" as B
participant "Tomcat\\nfilter chain" as T
participant "DelegatingFilterProxy\\n(a jakarta.servlet.Filter)" as D
participant "FilterChainProxy\\n(springSecurityFilterChain)" as P
participant "security filters\\n(CSRF, login, JWT,\\nauthorization…)" as SF
participant "DispatcherServlet" as DS
B -&gt; T : GET /api/admin/users
T -&gt; D : doFilter
D -&gt; P : doFilter
P -&gt; SF : run each filter in order
alt not authenticated / wrong role
  SF --&gt; B : 401 or 403 (chain stops here)
else allowed
  SF -&gt; DS : chain.doFilter → your @RestController
  DS --&gt; B : 200 + JSON
end
@enduml</code></pre></details>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): việc kiểm đăng nhập và vai trò của LabFlow sẽ không viết thành filter tự làm — chúng được cấu hình trong một bean <code>SecurityFilterChain</code> (<code>.requestMatchers("/api/admin/**").hasRole("ADMIN")</code>). Nhưng bên dưới vẫn đúng là bài này: một <code>jakarta.servlet.Filter</code> đăng ký trong Tomcat (<code>DelegatingFilterProxy</code>) chạy một danh sách filter có thứ tự, mỗi filter hoặc gọi <code>chain.doFilter</code>, hoặc tự trả lời 401/403.</div>`],
    ]),
    bi(`<h2>📌 What to take away from slides 1–21</h2>
<ul>
<li>A filter runs before (and after) the servlet/JSP/static file it is mapped to; <code>chain.doFilter</code> = "go on", no call = "stop here and my output is the response".</li>
<li>Three methods: <code>init</code> once at deployment, <code>doFilter</code> per request on many threads, <code>destroy</code> once at undeploy. One object ⇒ no per-request data in fields.</li>
<li>Declare with <code>&lt;filter&gt;</code> + <code>&lt;filter-mapping&gt;</code> (url-pattern or servlet-name) or <code>@WebFilter</code>; default dispatcher = REQUEST only.</li>
<li>Order: url-pattern mappings in web.xml order, then servlet-name mappings; "after" code runs in reverse.</li>
<li>Block = <code>sendRedirect</code> / <code>sendError</code> / own output, then <code>return</code>. Never guard your own login page.</li>
<li>Changing a response needs a wrapper that captures the body; the slides' version misses <code>toString</code>, <code>getOutputStream</code> and the length.</li>
</ul>`,
    `<h2>📌 Cần mang theo gì từ slide 1–21</h2>
<ul>
<li>Filter chạy trước (và sau) servlet/JSP/file tĩnh mà nó ánh xạ vào; <code>chain.doFilter</code> = "đi tiếp", không gọi = "dừng ở đây và output của tôi là response".</li>
<li>Ba phương thức: <code>init</code> một lần lúc deploy, <code>doFilter</code> mỗi request trên nhiều luồng, <code>destroy</code> một lần lúc gỡ. Một đối tượng ⇒ không để dữ liệu từng request trong trường.</li>
<li>Khai bằng <code>&lt;filter&gt;</code> + <code>&lt;filter-mapping&gt;</code> (url-pattern hoặc servlet-name) hoặc <code>@WebFilter</code>; dispatcher mặc định = chỉ REQUEST.</li>
<li>Thứ tự: mapping url-pattern theo thứ tự trong web.xml, rồi mapping servlet-name; code "sau" chạy ngược lại.</li>
<li>Chặn = <code>sendRedirect</code> / <code>sendError</code> / output tự viết, rồi <code>return</code>. Đừng bao giờ canh chính trang đăng nhập của mình.</li>
<li>Sửa response cần một wrapper bắt được body; bản của slide thiếu <code>toString</code>, <code>getOutputStream</code> và độ dài.</li>
</ul>`),
    books([
      ['williams', 'Ch.9 "Improving Your Application Using Filters" (purpose, creating/declaring/mapping, ordering, practical uses, authentication filter)', 'Ch.9 "Improving Your Application Using Filters" (mục đích, tạo/khai báo/ánh xạ, thứ tự, công dụng thực tế, filter xác thực)'],
      ['oracleFilters', 'the whole article — the source of slides 3–4 and the dispatcher list of slide 9', 'cả bài — nguồn của slide 3–4 và danh sách dispatcher ở slide 9'],
      ['servletSpec', 'Ch.6 "Filtering" (filter lifecycle, wrapping requests and responses, filter mapping order, dispatcher types)', 'Ch.6 "Filtering" (vòng đời filter, bọc request và response, thứ tự ánh xạ filter, các loại dispatcher)'],
    ]),
  ].join('\n'),
};

/* ───────── 8.B — 📑 Slide by slide · Event listeners: app, session and attribute events (Slot 27, slides 1–18) ───────── */
const L_prj11_1 = {
  title: '8.B — 📑 Slide by slide · Event listeners: app, session and attribute events (Slot 27, slides 1–18)|||8.B — 📑 Học theo từng slide · Event listener: sự kiện của ứng dụng, session và attribute (Slot 27, slide 1–18)',
  slug: 'prj301-slide-prj11-1',
  type: 'VIDEO',
  description: 'Giảng trọn 18 slide bộ "Session 10, EVENT LISTENERS": sự kiện và listener là gì (sửa định nghĩa sai trên slide), dùng để làm gì (slide trống — bổ sung đầy đủ), hai cấp × hai loại sự kiện và bốn interface (thêm cấp request và HttpSessionBindingListener theo đề cương), kịch bản ServletContextListener quản lý kết nối CSDL (làm bằng connection pool thật trên SQL Server), khai báo bằng web.xml và @WebListener, thứ tự gọi đo thật (khởi tạo theo thứ tự khai, huỷ ngược lại), quy tắc viết listener an toàn luồng, từng phương thức của ServletContextListener, ServletContextAttributeListener, HttpSessionListener (đếm người online: JSP tự tạo session, hết hạn, đăng xuất) và HttpSessionAttributeListener — mọi ví dụ chạy thật trên Tomcat 10.1 kèm log console thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.B · school deck "Session 10, EVENT LISTENERS" (Slot 27), slides 1–18</span>
<h2>Listeners — code that runs when something happens to the application itself</h2>
<p class="lead">A servlet answers a request. A filter wraps a request. A <strong>listener</strong> (bộ lắng nghe) is not about requests at all: the container calls it when the application starts or stops, when a session is created or destroyed, when an attribute is added, replaced or removed. It is where you open a connection pool once at start-up, load data every page needs, count who is online, and clean up before shutdown.</p>
<p>Why it matters: the FE asks which interface handles which event (<code>HttpSessionListener</code> vs <code>ServletContextListener</code>), when <code>contextInitialized</code> runs and what <code>&lt;listener&gt;</code> declares. In the Assignment a listener is the clean home for "load the categories once" and "number of users online" on the admin dashboard.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>Real example here</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>what events and listeners are, what for</td><td>the table of uses (slide 4 is blank on the deck)</td></tr>
<tr><td>6–8</td><td>2 levels × 2 categories = 4 interfaces</td><td><code>nghe-thuoc-tinh</code>: one class, three interfaces</td></tr>
<tr><td>9–12</td><td>the database scenario, declaring, rules</td><td><code>nghe-khoi-dong</code>: a real connection pool on SQL Server</td></tr>
<tr><td>13–17</td><td>each interface's methods</td><td><code>nghe-dem-online</code>: counting sessions; <code>nghe-thuoc-tinh</code>: attribute events</td></tr>
</tbody>
</table>
<div class="callout"><strong>How to read this lesson.</strong> Listeners print to Tomcat's console, so under each request you see the log lines the container's events produced — in the order Tomcat really called them (including at deployment and at undeployment). Code uses <code>jakarta.servlet</code>; the slides say <code>javax.servlet</code> — only the package name changes. The older web lesson 8.2 below stays as a summary; exercises 6–7 of lesson 8.3 use listeners again.</div>`,
    `<span class="eyebrow">Chương 8 · Bài 8.B · bộ slide "Session 10, EVENT LISTENERS" của trường (Slot 27), slide 1–18</span>
<h2>Listener — code chạy khi có chuyện xảy ra với chính ứng dụng</h2>
<p class="lead">Servlet trả lời một request. Filter bọc quanh một request. <strong>Listener</strong> (bộ lắng nghe) thì chẳng liên quan tới request: container gọi nó khi ứng dụng khởi động hay dừng, khi một session được tạo hay bị huỷ, khi một attribute được thêm, thay hay xoá. Đó là chỗ mở connection pool một lần lúc khởi động, nạp dữ liệu mà trang nào cũng cần, đếm ai đang online, và dọn dẹp trước khi tắt.</p>
<p>Vì sao quan trọng: đề FE hỏi interface nào xử lý sự kiện nào (<code>HttpSessionListener</code> hay <code>ServletContextListener</code>), <code>contextInitialized</code> chạy khi nào và <code>&lt;listener&gt;</code> khai báo cái gì. Trong Assignment, listener là chỗ gọn gàng cho "nạp danh mục một lần" và "số người đang online" trên trang quản trị.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Ví dụ chạy thật ở đây</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>sự kiện và listener là gì, để làm gì</td><td>bảng công dụng (slide 4 trên deck để trống)</td></tr>
<tr><td>6–8</td><td>2 cấp × 2 loại = 4 interface</td><td><code>nghe-thuoc-tinh</code>: một lớp, ba interface</td></tr>
<tr><td>9–12</td><td>kịch bản CSDL, khai báo, quy tắc</td><td><code>nghe-khoi-dong</code>: connection pool thật trên SQL Server</td></tr>
<tr><td>13–17</td><td>các phương thức của từng interface</td><td><code>nghe-dem-online</code>: đếm session; <code>nghe-thuoc-tinh</code>: sự kiện attribute</td></tr>
</tbody>
</table>
<div class="callout"><strong>Cách đọc bài này.</strong> Listener in ra console của Tomcat, nên dưới mỗi request bạn thấy những dòng log do các sự kiện của container sinh ra — đúng thứ tự Tomcat thật sự gọi (kể cả lúc deploy và lúc gỡ ứng dụng). Code dùng <code>jakarta.servlet</code>; slide viết <code>javax.servlet</code> — chỉ đổi tên gói. Bài web cũ 8.2 bên dưới giữ làm bản tóm tắt; bài tập 6–7 của bài 8.3 dùng lại listener.</div>`),
    walkHead('prj11', 1, 18),
    walk('prj11', [
      [1, 'Session 10, EVENT LISTENERS',
        `<p class="y-chinh">🎯 The listener deck — "Session 10" in the deck's numbering, sessions 53–54 of the current syllabus (CLO5), the last new technology before the Assignment evaluation sessions.</p>
<p>18 slides, footer "n/41" as in every PRJ301 deck. The syllabus lists six event classes for these two sessions: <code>ServletContextEvent</code>, <code>HttpSessionEvent</code>, <code>ServletRequestEvent</code>, <code>ServletContextAttributeEvent</code>, <code>HttpSessionBindingEvent</code>, <code>ServletRequestAttributeEvent</code>. The deck teaches four listener interfaces; the request-level ones and <code>HttpSessionBindingListener</code> are added here, marked ➕.</p>
<p>The idea is the <strong>Observer</strong> pattern you know from Java Swing buttons: you do not call the listener — you register it, and the container calls it when the event happens.</p>
<p class="meo">🧠 One sentence for the whole deck: <em>a listener is a method Tomcat calls for you when the application, a session or an attribute changes.</em></p>`,
        `<p class="y-chinh">🎯 Deck listener — "Session 10" theo cách đánh số của deck, tức buổi 53–54 của đề cương hiện hành (CLO5), công nghệ mới cuối cùng trước các buổi chấm Assignment.</p>
<p>18 slide, chân trang "n/41" như mọi deck PRJ301. Đề cương liệt kê sáu lớp sự kiện cho hai buổi này: <code>ServletContextEvent</code>, <code>HttpSessionEvent</code>, <code>ServletRequestEvent</code>, <code>ServletContextAttributeEvent</code>, <code>HttpSessionBindingEvent</code>, <code>ServletRequestAttributeEvent</code>. Deck dạy bốn interface listener; các interface cấp request và <code>HttpSessionBindingListener</code> được giảng thêm ở đây, đánh dấu ➕.</p>
<p>Ý tưởng là mẫu <strong>Observer</strong> (người quan sát) mà bạn đã gặp ở nút bấm Java Swing: bạn không gọi listener — bạn đăng ký nó, và container gọi nó khi sự kiện xảy ra.</p>
<p class="meo">🧠 Một câu cho cả deck: <em>listener là một phương thức Tomcat gọi giùm bạn khi ứng dụng, một session hay một attribute thay đổi.</em></p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Two goals: understand the purpose of event listeners; create, declare and invoke them.</p>
<p>"Invoke" needs a correction: <em>you</em> never invoke a listener. You create the class and declare it; the <strong>container</strong> invokes it. What you control is which events you subscribe to (by the interfaces you implement) and, for listeners of the same kind, the order (by the order of declaration — slide 10).</p>
<table>
<thead><tr><th>Goal</th><th>Slides</th><th>Can you, after this lesson…</th></tr></thead>
<tbody>
<tr><td>purpose</td><td>3–5, 9</td><td>give three real uses of a listener in a web app?</td></tr>
<tr><td>create</td><td>7, 12–17</td><td>implement the right interface and its methods?</td></tr>
<tr><td>declare</td><td>10–11</td><td>write <code>&lt;listener&gt;</code> in web.xml or use <code>@WebListener</code>?</td></tr>
<tr><td>invoke</td><td>10, 14, 16</td><td>say when Tomcat calls each method, and in what order?</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Hai mục tiêu: hiểu mục đích của event listener; tạo, khai báo và gọi chúng.</p>
<p>"Gọi (invoke)" cần sửa lại cho đúng: <em>bạn</em> không bao giờ gọi listener. Bạn tạo lớp và khai báo nó; <strong>container</strong> gọi nó. Thứ bạn điều khiển được là đăng ký nhận sự kiện nào (qua các interface bạn cài đặt) và, với các listener cùng loại, thứ tự (qua thứ tự khai báo — slide 10).</p>
<table>
<thead><tr><th>Mục tiêu</th><th>Slide</th><th>Học xong, bạn làm được…</th></tr></thead>
<tbody>
<tr><td>mục đích</td><td>3–5, 9</td><td>kể ba công dụng thật của listener trong web app?</td></tr>
<tr><td>tạo</td><td>7, 12–17</td><td>cài đúng interface và các phương thức của nó?</td></tr>
<tr><td>khai báo</td><td>10–11</td><td>viết <code>&lt;listener&gt;</code> trong web.xml hoặc dùng <code>@WebListener</code>?</td></tr>
<tr><td>gọi</td><td>10, 14, 16</td><td>nói Tomcat gọi từng phương thức khi nào, theo thứ tự nào?</td></tr>
</tbody>
</table>`],
      [3, 'What is Event Listeners?',
        `<p class="y-chinh">🎯 The slide: "Event Listeners is occurrence of something; in the web application world an event can be initialization of application, destroying an application, request from client, creating/destroying a session, attribute modification in session etc."</p>
<p><strong>The definition is mixed up</strong> — it describes the <em>event</em>, not the listener. Correctly:</p>
<table>
<thead><tr><th>Word</th><th>Meaning</th><th>Example</th></tr></thead>
<tbody>
<tr><td>event (sự kiện)</td><td>something that happened, described by an object</td><td><code>HttpSessionEvent</code>: "this session was just created"</td></tr>
<tr><td>listener (bộ lắng nghe)</td><td>an object whose methods the container calls when that kind of event happens</td><td><code>HttpSessionListener.sessionCreated(event)</code></td></tr>
<tr><td>source</td><td>the thing the event happened to</td><td>the <code>ServletContext</code>, an <code>HttpSession</code>, a <code>ServletRequest</code></td></tr>
</tbody>
</table>
<p>The list of examples is right, and it is the whole deck in one line: application initialised/destroyed (slide 14), a request from a client (➕ request listeners, slide 8), session created/destroyed (slide 16), attribute modified (slides 15, 17). The bullet "Text" on the slide is an empty placeholder left from the template — nothing is missing.</p>
<div class="pitfall">FE question type: "what does a session listener do?" — it is told about session <em>lifecycle</em> events (created, destroyed). It does not "change session data" and does not "record conversations".</div>`,
        `<p class="y-chinh">🎯 Slide ghi: "Event Listeners là sự xảy ra của một điều gì đó; trong thế giới ứng dụng web, một sự kiện có thể là khởi tạo ứng dụng, huỷ ứng dụng, request từ client, tạo/huỷ session, sửa attribute trong session v.v."</p>
<p><strong>Định nghĩa bị lẫn</strong> — nó mô tả <em>sự kiện</em>, không phải listener. Viết đúng:</p>
<table>
<thead><tr><th>Từ</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>event (sự kiện)</td><td>một chuyện đã xảy ra, được mô tả bằng một đối tượng</td><td><code>HttpSessionEvent</code>: "session này vừa được tạo"</td></tr>
<tr><td>listener (bộ lắng nghe)</td><td>một đối tượng có các phương thức mà container gọi khi loại sự kiện đó xảy ra</td><td><code>HttpSessionListener.sessionCreated(event)</code></td></tr>
<tr><td>source (nguồn)</td><td>thứ mà sự kiện xảy ra với nó</td><td><code>ServletContext</code>, một <code>HttpSession</code>, một <code>ServletRequest</code></td></tr>
</tbody>
</table>
<p>Danh sách ví dụ thì đúng, và chính là cả deck gói trong một dòng: ứng dụng khởi tạo/huỷ (slide 14), request từ client (➕ listener cấp request, slide 8), session tạo/huỷ (slide 16), attribute bị sửa (slide 15, 17). Gạch đầu dòng "Text" trên slide là chỗ trống còn sót của mẫu slide — không thiếu gì cả.</p>
<div class="pitfall">Dạng câu FE: "session listener làm gì?" — nó được báo về các sự kiện <em>vòng đời</em> của session (tạo, huỷ). Nó không "sửa dữ liệu session" và không "ghi lại hội thoại".</div>`],
      [4, 'What it can be used for ?',
        `<p class="y-chinh">🎯 The slide has only its title — the content was never filled in. Here is what listeners are really used for, each with the example on this site.</p>
<table>
<thead><tr><th>Use</th><th>Interface</th><th>Real example</th></tr></thead>
<tbody>
<tr><td>open shared resources once at start-up, close them at shutdown (connection pool, thread pool, scheduler)</td><td>ServletContextListener</td><td><code>nghe-khoi-dong</code> (slide 9)</td></tr>
<tr><td>load data every page needs (categories, settings) into application scope</td><td>ServletContextListener</td><td>8.3 exercise 7</td></tr>
<tr><td>count sessions ("visitors online")</td><td>HttpSessionListener</td><td><code>nghe-dem-online</code> (slide 16)</td></tr>
<tr><td>list logged-in users</td><td>HttpSessionAttributeListener</td><td>8.3 exercise 6</td></tr>
<tr><td>clean up when a session ends (release a held seat or cart reservation)</td><td>HttpSessionListener / HttpSessionBindingListener</td><td>slide 17</td></tr>
<tr><td>audit changes to application settings</td><td>ServletContextAttributeListener</td><td><code>nghe-thuoc-tinh</code> (slide 15)</td></tr>
<tr><td>➕ measure every request, set up per-request context</td><td>ServletRequestListener</td><td>slide 8</td></tr>
</tbody>
</table>
<p>Common thread: <strong>things that are not tied to one URL</strong> but to the life of the app or of a session. If it is tied to URLs (check login before <code>/admin/*</code>), it is a filter's job, not a listener's.</p>
<div class="pitfall">FE question type: "in <code>contextInitialized</code>, what would you typically do?" — initialise shared objects such as database connections (not handle requests, not create sessions). "In <code>sessionDestroyed</code>?" — release what the session held (not authenticate users).</div>`,
        `<p class="y-chinh">🎯 Slide chỉ có tiêu đề — nội dung chưa từng được điền. Dưới đây là những việc listener thật sự được dùng, mỗi việc kèm ví dụ trên web này.</p>
<table>
<thead><tr><th>Công dụng</th><th>Interface</th><th>Ví dụ chạy thật</th></tr></thead>
<tbody>
<tr><td>mở tài nguyên dùng chung một lần lúc khởi động, đóng khi tắt (connection pool, thread pool, bộ lập lịch)</td><td>ServletContextListener</td><td><code>nghe-khoi-dong</code> (slide 9)</td></tr>
<tr><td>nạp dữ liệu mà trang nào cũng cần (danh mục, cấu hình) vào phạm vi application</td><td>ServletContextListener</td><td>8.3 bài 7</td></tr>
<tr><td>đếm session ("khách đang online")</td><td>HttpSessionListener</td><td><code>nghe-dem-online</code> (slide 16)</td></tr>
<tr><td>liệt kê người đã đăng nhập</td><td>HttpSessionAttributeListener</td><td>8.3 bài 6</td></tr>
<tr><td>dọn dẹp khi session kết thúc (trả lại ghế đang giữ, huỷ giỏ hàng tạm)</td><td>HttpSessionListener / HttpSessionBindingListener</td><td>slide 17</td></tr>
<tr><td>kiểm toán thay đổi cấu hình ứng dụng</td><td>ServletContextAttributeListener</td><td><code>nghe-thuoc-tinh</code> (slide 15)</td></tr>
<tr><td>➕ đo từng request, chuẩn bị ngữ cảnh cho mỗi request</td><td>ServletRequestListener</td><td>slide 8</td></tr>
</tbody>
</table>
<p>Điểm chung: <strong>những việc không gắn với một URL</strong> mà gắn với vòng đời của ứng dụng hay của một session. Việc gắn với URL (kiểm đăng nhập trước <code>/admin/*</code>) là việc của filter, không phải listener.</p>
<div class="pitfall">Dạng câu FE: "trong <code>contextInitialized</code> thường làm gì?" — khởi tạo đối tượng dùng chung như kết nối CSDL (không xử lý request, không tạo session). "Trong <code>sessionDestroyed</code>?" — giải phóng những gì session đang giữ (không xác thực người dùng).</div>`],
      [5, 'Describe servlet event listeners',
        `<p class="y-chinh">🎯 The agenda of the rest of the deck: event categories and listener interfaces; a typical scenario; declaration and invocation; coding and deployment guidelines; listener methods and related classes.</p>
<p>The five topics in the order a programmer meets them: <em>which interface</em> to implement (slides 6–8) → <em>what to do</em> in it (9) → <em>how to register</em> it (10–11) → <em>rules</em> to respect (12) → <em>each method</em> in detail (13–17).</p>
<p>The deck's wording ("Coding and Deployment Guidelines", "Methods and Related Classes", the database scenario, the <code>com.acme</code> example) comes from Oracle's documentation for OC4J, Oracle's old Java EE server — the same family of documents as the filter article of the syllabus. That is why some names are dated; the API itself has not changed except <code>javax</code> → <code>jakarta</code>.</p>
<table>
<thead><tr><th>Topic</th><th>Slides</th><th>Example app</th></tr></thead>
<tbody>
<tr><td>categories and interfaces</td><td>6–8</td><td><code>nghe-thuoc-tinh</code></td></tr>
<tr><td>typical scenario</td><td>9</td><td><code>nghe-khoi-dong</code></td></tr>
<tr><td>declaration and invocation</td><td>10–11</td><td><code>nghe-khoi-dong</code></td></tr>
<tr><td>guidelines</td><td>12</td><td><code>nghe-dem-online</code></td></tr>
<tr><td>methods and classes</td><td>13–17</td><td>all three</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Mục lục phần còn lại của deck: các loại sự kiện và interface listener; một kịch bản điển hình; khai báo và cách được gọi; quy tắc viết và triển khai; các phương thức listener và lớp liên quan.</p>
<p>Năm chủ đề theo đúng thứ tự lập trình viên gặp chúng: cài <em>interface nào</em> (slide 6–8) → <em>làm gì</em> trong đó (9) → <em>đăng ký</em> thế nào (10–11) → <em>quy tắc</em> phải giữ (12) → <em>từng phương thức</em> chi tiết (13–17).</p>
<p>Cách diễn đạt của deck ("Coding and Deployment Guidelines", "Methods and Related Classes", kịch bản CSDL, ví dụ <code>com.acme</code>) lấy từ tài liệu của Oracle cho OC4J, server Java EE cũ của Oracle — cùng họ tài liệu với bài đọc về filter trong đề cương. Vì thế vài cái tên đã cũ; còn API thì không đổi gì ngoài <code>javax</code> → <code>jakarta</code>.</p>
<table>
<thead><tr><th>Chủ đề</th><th>Slide</th><th>App ví dụ</th></tr></thead>
<tbody>
<tr><td>loại sự kiện và interface</td><td>6–8</td><td><code>nghe-thuoc-tinh</code></td></tr>
<tr><td>kịch bản điển hình</td><td>9</td><td><code>nghe-khoi-dong</code></td></tr>
<tr><td>khai báo và cách gọi</td><td>10–11</td><td><code>nghe-khoi-dong</code></td></tr>
<tr><td>quy tắc</td><td>12</td><td><code>nghe-dem-online</code></td></tr>
<tr><td>phương thức và lớp</td><td>13–17</td><td>cả ba</td></tr>
</tbody>
</table>`],
      [6, 'Event Categories and Listener Interfaces',
        `<p class="y-chinh">🎯 Two levels of servlet events: <strong>servlet-context level</strong> (application level — resources or state held by the one <code>ServletContext</code> of the app) and <strong>session level</strong> (resources or state of the series of requests from one user — the <code>HttpSession</code>).</p>
<p>These are two of the four scopes of Chapter 4: <em>application</em> (one per web app, lives from deployment to undeployment) and <em>session</em> (one per browser, lives from the first <code>getSession()</code> to <code>invalidate()</code> or timeout). Each scope has its own life and its own attribute map, so each can produce events.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/2619817365ddd552b33ce3b5a371459670a42ccd.svg" alt="Two levels × two categories = four interfaces (the request level is added from the syllabus)" loading="lazy" /><p class="chu-thich">🧩 Two levels × two categories = four interfaces (the request level is added from the syllabus)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 6–8: two LEVELS × two CATEGORIES = four listener interfaces (+ the request level, beyond the slides)
skinparam rectangle {
  BackgroundColor #F8FAFC
}
rectangle "Application level\\n(ServletContext, one per app)" as APP {
  rectangle "Lifecycle\\nServletContextListener\\ncontextInitialized / contextDestroyed" as A1
  rectangle "Attributes\\nServletContextAttributeListener\\nattributeAdded / Removed / Replaced" as A2
}
rectangle "Session level\\n(HttpSession, one per browser)" as SES {
  rectangle "Lifecycle\\nHttpSessionListener\\nsessionCreated / sessionDestroyed" as S1
  rectangle "Attributes\\nHttpSessionAttributeListener\\nattributeAdded / Removed / Replaced" as S2
}
rectangle "(+) Request level (not on the slides)\\n(ServletRequest, one per request)" as REQ {
  rectangle "Lifecycle\\nServletRequestListener" as R1
  rectangle "Attributes\\nServletRequestAttributeListener" as R2
}
APP -[hidden]down- SES
SES -[hidden]down- REQ
@enduml</code></pre></details>
<p>➕ The current specification has a third level, the <strong>request</strong> (one per HTTP request, the shortest-lived scope), with its own two listeners — listed in the syllabus (session 53–54) though not on the slides. The page scope of JSP has no listener.</p>`,
        `<p class="y-chinh">🎯 Hai cấp sự kiện servlet: <strong>cấp servlet context</strong> (cấp ứng dụng — tài nguyên hay trạng thái do <code>ServletContext</code> duy nhất của app giữ) và <strong>cấp session</strong> (tài nguyên hay trạng thái của chuỗi request từ một người dùng — <code>HttpSession</code>).</p>
<p>Đây là hai trong bốn scope (phạm vi) của Chương 4: <em>application</em> (mỗi web app một cái, sống từ lúc deploy tới lúc gỡ) và <em>session</em> (mỗi trình duyệt một cái, sống từ lần <code>getSession()</code> đầu tiên tới <code>invalidate()</code> hoặc hết hạn). Mỗi scope có vòng đời riêng và bảng attribute riêng, nên mỗi scope đều sinh ra sự kiện được.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/2619817365ddd552b33ce3b5a371459670a42ccd.svg" alt="Hai cấp × hai loại = bốn interface (cấp request được thêm theo đề cương)" loading="lazy" /><p class="chu-thich">🧩 Hai cấp × hai loại = bốn interface (cấp request được thêm theo đề cương)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 6–8: two LEVELS × two CATEGORIES = four listener interfaces (+ the request level, beyond the slides)
skinparam rectangle {
  BackgroundColor #F8FAFC
}
rectangle "Application level\\n(ServletContext, one per app)" as APP {
  rectangle "Lifecycle\\nServletContextListener\\ncontextInitialized / contextDestroyed" as A1
  rectangle "Attributes\\nServletContextAttributeListener\\nattributeAdded / Removed / Replaced" as A2
}
rectangle "Session level\\n(HttpSession, one per browser)" as SES {
  rectangle "Lifecycle\\nHttpSessionListener\\nsessionCreated / sessionDestroyed" as S1
  rectangle "Attributes\\nHttpSessionAttributeListener\\nattributeAdded / Removed / Replaced" as S2
}
rectangle "(+) Request level (not on the slides)\\n(ServletRequest, one per request)" as REQ {
  rectangle "Lifecycle\\nServletRequestListener" as R1
  rectangle "Attributes\\nServletRequestAttributeListener" as R2
}
APP -[hidden]down- SES
SES -[hidden]down- REQ
@enduml</code></pre></details>
<p>➕ Đặc tả hiện hành có cấp thứ ba, <strong>request</strong> (mỗi HTTP request một cái, scope sống ngắn nhất), với hai listener riêng — đề cương (buổi 53–54) có kể tên dù slide không có. Scope page của JSP thì không có listener.</p>`],
      [7, 'Event Categories and Listener Interfaces: each of these two levels has two event categories',
        `<p class="y-chinh">🎯 Each level has two categories: <strong>lifecycle changes</strong> and <strong>attribute changes</strong>. You can write one or more listener classes per category, and <strong>one class may monitor several categories</strong>, by implementing the matching interfaces of <code>javax.servlet</code> / <code>javax.servlet.http</code> (today <code>jakarta.servlet</code> / <code>jakarta.servlet.http</code>).</p>
<p>"One class, several categories" for real — <code>AttributeSpy</code> implements three interfaces at once and is registered with one <code>@WebListener</code>:</p>
<p class="ghi-chu">📄 <code>nghe-thuoc-tinh/src/main/java/spy/AttributeSpy.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void sessionCreated(HttpSessionEvent e) {
    System.out.println("sessionCreated");
}

@Override
public void sessionDestroyed(HttpSessionEvent e) {
    System.out.println("sessionDestroyed (attributes still readable: user = " + e.getSession().getAttribute("user") + ")");
}</code></pre>
<p>Which package: the application-level interfaces live in <code>jakarta.servlet</code> (no HTTP needed), the session-level ones in <code>jakarta.servlet.http</code> (sessions are an HTTP idea) — a detail that also tells you the class names: <code>ServletContext…</code> versus <code>HttpSession…</code>.</p>
<p><strong>Lifecycle</strong> = the object is born or dies. <strong>Attribute</strong> = something is put in, replaced in or taken out of the object's attribute map with <code>setAttribute</code>/<code>removeAttribute</code>. Slides 14–17 take the four combinations one by one.</p>`,
        `<p class="y-chinh">🎯 Mỗi cấp có hai loại: <strong>thay đổi vòng đời</strong> và <strong>thay đổi attribute</strong>. Bạn viết được một hay nhiều lớp listener cho mỗi loại, và <strong>một lớp có thể theo dõi nhiều loại</strong>, bằng cách cài các interface tương ứng của <code>javax.servlet</code> / <code>javax.servlet.http</code> (nay là <code>jakarta.servlet</code> / <code>jakarta.servlet.http</code>).</p>
<p>"Một lớp, nhiều loại" chạy thật — <code>AttributeSpy</code> cài ba interface cùng lúc và được đăng ký bằng một <code>@WebListener</code>:</p>
<p class="ghi-chu">📄 <code>nghe-thuoc-tinh/src/main/java/spy/AttributeSpy.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void sessionCreated(HttpSessionEvent e) {
    System.out.println("sessionCreated");
}

@Override
public void sessionDestroyed(HttpSessionEvent e) {
    System.out.println("sessionDestroyed (attributes still readable: user = " + e.getSession().getAttribute("user") + ")");
}</code></pre>
<p>Gói nào: các interface cấp ứng dụng nằm trong <code>jakarta.servlet</code> (không cần HTTP), các interface cấp session nằm trong <code>jakarta.servlet.http</code> (session là khái niệm của HTTP) — chi tiết này cũng giúp nhớ tên lớp: <code>ServletContext…</code> và <code>HttpSession…</code>.</p>
<p><strong>Vòng đời</strong> = đối tượng sinh ra hoặc chết đi. <strong>Attribute</strong> = có thứ được đặt vào, thay thế, hay lấy ra khỏi bảng attribute của đối tượng bằng <code>setAttribute</code>/<code>removeAttribute</code>. Slide 14–17 đi lần lượt bốn tổ hợp.</p>`],
      [8, 'Table 1: Event Listener Categories and Interfaces',
        `<p class="y-chinh">🎯 Table 1: context lifecycle (created — first request can be served; imminent shutdown) → <code>ServletContextListener</code>; context attributes (added, removed, replaced) → <code>ServletContextAttributeListener</code>; session lifecycle (creation, invalidation, timeout) → <code>HttpSessionListener</code>; session attributes (added, removed, replaced) → <code>HttpSessionAttributeListener</code>.</p>
<table>
<thead><tr><th>Event category</th><th>Events</th><th>Interface (Tomcat 10+)</th><th>Methods</th></tr></thead>
<tbody>
<tr><td>context lifecycle</td><td>app ready; app about to stop</td><td><code>jakarta.servlet.ServletContextListener</code></td><td>contextInitialized, contextDestroyed</td></tr>
<tr><td>context attributes</td><td>added, removed, replaced</td><td><code>jakarta.servlet.ServletContextAttributeListener</code></td><td>attributeAdded, attributeRemoved, attributeReplaced</td></tr>
<tr><td>session lifecycle</td><td>created; invalidated or timed out</td><td><code>jakarta.servlet.http.HttpSessionListener</code></td><td>sessionCreated, sessionDestroyed</td></tr>
<tr><td>session attributes</td><td>added, removed, replaced</td><td><code>jakarta.servlet.http.HttpSessionAttributeListener</code></td><td>attributeAdded, attributeRemoved, attributeReplaced</td></tr>
<tr><td>➕ request lifecycle</td><td>request enters / leaves the app</td><td><code>jakarta.servlet.ServletRequestListener</code></td><td>requestInitialized, requestDestroyed</td></tr>
<tr><td>➕ request attributes</td><td>added, removed, replaced</td><td><code>jakarta.servlet.ServletRequestAttributeListener</code></td><td>attributeAdded, attributeRemoved, attributeReplaced</td></tr>
<tr><td>➕ binding (the value itself)</td><td>object put into / taken out of a session</td><td><code>jakarta.servlet.http.HttpSessionBindingListener</code></td><td>valueBound, valueUnbound</td></tr>
</tbody>
</table>
<p>Note "invalidation" and "timeout" are the same event, <code>sessionDestroyed</code> — the listener cannot tell them apart from the event alone (slide 16 shows both for real).</p>
<div class="pitfall">FE question type: "which interface handles session events?" with distractors <code>ServletRequestListener</code>, <code>ServletContextListener</code> and an invented <code>ServletResponseListener</code> — there is <strong>no</strong> response listener in the Servlet API.</div>`,
        `<p class="y-chinh">🎯 Bảng 1: vòng đời context (được tạo — có thể phục vụ request đầu tiên; sắp tắt) → <code>ServletContextListener</code>; attribute của context (thêm, xoá, thay) → <code>ServletContextAttributeListener</code>; vòng đời session (tạo, invalidate, hết hạn) → <code>HttpSessionListener</code>; attribute của session (thêm, xoá, thay) → <code>HttpSessionAttributeListener</code>.</p>
<table>
<thead><tr><th>Loại sự kiện</th><th>Sự kiện</th><th>Interface (Tomcat 10+)</th><th>Phương thức</th></tr></thead>
<tbody>
<tr><td>vòng đời context</td><td>app sẵn sàng; app sắp dừng</td><td><code>jakarta.servlet.ServletContextListener</code></td><td>contextInitialized, contextDestroyed</td></tr>
<tr><td>attribute của context</td><td>thêm, xoá, thay</td><td><code>jakarta.servlet.ServletContextAttributeListener</code></td><td>attributeAdded, attributeRemoved, attributeReplaced</td></tr>
<tr><td>vòng đời session</td><td>được tạo; bị invalidate hoặc hết hạn</td><td><code>jakarta.servlet.http.HttpSessionListener</code></td><td>sessionCreated, sessionDestroyed</td></tr>
<tr><td>attribute của session</td><td>thêm, xoá, thay</td><td><code>jakarta.servlet.http.HttpSessionAttributeListener</code></td><td>attributeAdded, attributeRemoved, attributeReplaced</td></tr>
<tr><td>➕ vòng đời request</td><td>request vào / rời ứng dụng</td><td><code>jakarta.servlet.ServletRequestListener</code></td><td>requestInitialized, requestDestroyed</td></tr>
<tr><td>➕ attribute của request</td><td>thêm, xoá, thay</td><td><code>jakarta.servlet.ServletRequestAttributeListener</code></td><td>attributeAdded, attributeRemoved, attributeReplaced</td></tr>
<tr><td>➕ gắn kết (chính giá trị)</td><td>đối tượng được đặt vào / lấy ra khỏi session</td><td><code>jakarta.servlet.http.HttpSessionBindingListener</code></td><td>valueBound, valueUnbound</td></tr>
</tbody>
</table>
<p>Để ý "invalidation" và "timeout" là cùng một sự kiện, <code>sessionDestroyed</code> — chỉ nhìn sự kiện thì listener không phân biệt được hai trường hợp (slide 16 cho xem cả hai chạy thật).</p>
<div class="pitfall">Dạng câu FE: "interface nào xử lý sự kiện session?" với phương án nhiễu <code>ServletRequestListener</code>, <code>ServletContextListener</code> và một <code>ServletResponseListener</code> bịa ra — Servlet API <strong>không có</strong> listener nào cho response.</div>`],
      [9, 'Typical Event Listener Scenario',
        `<p class="y-chinh">🎯 The typical scenario: a context lifecycle listener manages the database connection — notified at start-up, it logs in to the database and stores the connection in the servlet context; servlets use it for SQL; notified of imminent shutdown, it closes the connection.</p>
<p>The idea is right; the detail "stores <em>the connection object</em>" is not how it is done today. One <code>Connection</code> shared by every servlet means every user's queries go through one channel one after another, a transaction of user A can swallow user B's statements, and when the database restarts the one connection is dead for everybody. So the listener stores a <strong>connection pool</strong> (a <code>DataSource</code>): servlets borrow a connection, use it, and <code>close()</code> gives it back.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/d6d7d9fc0b771c76b876f678beca005701e882c3.svg" alt="Slide 9 as Tomcat ran it: two listeners at start-up, a servlet borrowing from the pool, shutdown in reverse" loading="lazy" /><p class="chu-thich">🧩 Slide 9 as Tomcat ran it: two listeners at start-up, a servlet borrowing from the pool, shutdown in reverse</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title One application's life, as Tomcat 10.1 really ran it (nghe-khoi-dong): listeners first, in web.xml order — then reversed
participant "Tomcat" as T
participant "MyConnectionManager\\n(listener #1)" as L1
participant "MyLoggingModule\\n(listener #2)" as L2
participant "RegistrationServlet" as S
database "SQL Server" as DB
== deploy ==
T -&gt; L1 : contextInitialized
L1 -&gt; DB : open a test connection
L1 -&gt; L1 : ctx.setAttribute("db", pool)
T -&gt; L2 : contextInitialized
== requests ==
T -&gt; S : GET /registrations?course=PRJ301
S -&gt; DB : pool.getConnection() + SELECT ... WHERE course = ?
== undeploy ==
T -&gt; L2 : contextDestroyed (FIRST)
T -&gt; L1 : contextDestroyed (LAST)
L1 -&gt; DB : pool.close()
@enduml</code></pre></details>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;display-name&gt;MyListeningApplication&lt;/display-name&gt;
    &lt;listener&gt;
        &lt;listener-class&gt;com.acme.MyConnectionManager&lt;/listener-class&gt;
    &lt;/listener&gt;
    &lt;listener&gt;
        &lt;listener-class&gt;com.acme.MyLoggingModule&lt;/listener-class&gt;
    &lt;/listener&gt;
    &lt;servlet&gt;
        &lt;display-name&gt;RegistrationServlet&lt;/display-name&gt;
        &lt;servlet-name&gt;RegistrationServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;com.acme.RegistrationServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;RegistrationServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/registrations&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/java/com/acme/MyConnectionManager.java</code></p>
<pre class="web-src"><code class="language-java">package com.acme;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Collections;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import org.apache.tomcat.dbcp.dbcp2.BasicDataSource;   // the connection pool that ships inside Tomcat (lib/tomcat-dbcp.jar)

// Slide 9's scenario with one fix: the context holds a POOL of connections (a DataSource), not ONE Connection
public class MyConnectionManager implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext ctx = sce.getServletContext();
        BasicDataSource pool = new BasicDataSource();
        pool.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        pool.setDriverClassLoader(getClass().getClassLoader());   // the driver jar is in WEB-INF/lib
        pool.setUrl("jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
                + ";databaseName=PRJ301_NgheKhoiDong;encrypt=true;trustServerCertificate=true");
        pool.setUsername(env("DB_USER", "sa"));
        pool.setPassword(env("DB_PASSWORD", "123"));
        pool.setMaxTotal(10);                                     // at most 10 connections open at once
        try (Connection c = pool.getConnection()) {               // fail fast: check the database NOW
            DatabaseMetaData md = c.getMetaData();
            System.out.println("MyConnectionManager: pool ready → " + md.getDatabaseProductName()
                    + " " + md.getDatabaseMajorVersion());
        } catch (SQLException e) {
            System.out.println("MyConnectionManager: database unreachable → " + e.getMessage());
        }
        ctx.setAttribute("db", pool);                             // every servlet can now use it
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        BasicDataSource pool = (BasicDataSource) sce.getServletContext().getAttribute("db");
        try {
            pool.close();                                         // close every pooled connection
            System.out.println("MyConnectionManager: pool closed");
        } catch (SQLException e) {
            System.out.println("MyConnectionManager: close failed → " + e.getMessage());
        }
        // the driver class came from THIS app's WEB-INF/lib: unregister it, or Tomcat warns about a memory leak
        for (Driver d : Collections.list(DriverManager.getDrivers())) {
            if (d.getClass().getClassLoader() == getClass().getClassLoader()) {
                try {
                    DriverManager.deregisterDriver(d);
                    System.out.println("MyConnectionManager: JDBC driver deregistered");
                } catch (SQLException e) {
                    System.out.println("MyConnectionManager: deregister failed → " + e.getMessage());
                }
            }
        }
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-khoi-dong/registrations?course=PRJ301 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 60

Students in PRJ301:
- Nguyễn Văn An
- Trần Thị Bình</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">MyConnectionManager: pool ready → Microsoft SQL Server 15<br>
MyLoggingModule: application started — context path /nghe-khoi-dong</div>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/java/com/acme/RegistrationServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    DataSource db = (DataSource) getServletContext().getAttribute("db");     // put there by the listener
    String course = req.getParameter("course");
    resp.setContentType("text/plain;charset=UTF-8");
    PrintWriter out = resp.getWriter();
    String sql = "SELECT student FROM Registration WHERE course = ? ORDER BY id";
    try (Connection c = db.getConnection();                                  // borrow from the pool
         PreparedStatement ps = c.prepareStatement(sql)) {
        ps.setString(1, course);                                              // user data ⇒ always a parameter
        try (ResultSet rs = ps.executeQuery()) {
            out.println("Students in " + course + ":");
            while (rs.next()) out.println("- " + rs.getString("student"));
        }
    } catch (SQLException e) {                                                // close() returned the connection to the pool
        throw new ServletException(e);
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-khoi-dong/registrations?course=SWD392 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 40

Students in SWD392:
- Lê Minh Cường</code></pre>
<p>The pool is Tomcat's own (<code>BasicDataSource</code> from <code>lib/tomcat-dbcp.jar</code>, already on the server, so nothing to download). The "pool ready → Microsoft SQL Server 15" line was printed at deployment — before the first request — by the test connection that makes a wrong password fail <em>at start-up</em>, not at the first user's click. The query uses a <code>PreparedStatement</code> with <code>?</code> because <code>course</code> comes from the user (Chapter 5: SQL injection).</p>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): you never write this listener — Spring Boot creates a HikariCP pool from <code>spring.datasource.url/username/password</code> at start-up and closes it at shutdown, and a <code>JdbcTemplate</code> or Spring Data repository borrows connections for you. The life cycle is the same: open once, borrow per request, close at the end.</div>`,
        `<p class="y-chinh">🎯 Kịch bản điển hình: một listener vòng đời context quản lý kết nối CSDL — được báo lúc khởi động, nó đăng nhập vào CSDL và cất connection vào servlet context; các servlet dùng nó để chạy SQL; được báo sắp tắt, nó đóng connection.</p>
<p>Ý tưởng thì đúng; chi tiết "cất <em>đối tượng connection</em>" thì ngày nay không ai làm thế. Một <code>Connection</code> mọi servlet dùng chung nghĩa là truy vấn của mọi người dùng xếp hàng qua một kênh, giao dịch của người A có thể nuốt lệnh của người B, và khi CSDL khởi động lại thì kết nối duy nhất đó chết với tất cả mọi người. Nên listener cất một <strong>connection pool</strong> (bể kết nối — một <code>DataSource</code>): servlet mượn một kết nối, dùng xong, <code>close()</code> là trả lại bể.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/d6d7d9fc0b771c76b876f678beca005701e882c3.svg" alt="Slide 9 đúng như Tomcat đã chạy: hai listener lúc khởi động, servlet mượn kết nối từ pool, lúc tắt thì ngược lại" loading="lazy" /><p class="chu-thich">🧩 Slide 9 đúng như Tomcat đã chạy: hai listener lúc khởi động, servlet mượn kết nối từ pool, lúc tắt thì ngược lại</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title One application's life, as Tomcat 10.1 really ran it (nghe-khoi-dong): listeners first, in web.xml order — then reversed
participant "Tomcat" as T
participant "MyConnectionManager\\n(listener #1)" as L1
participant "MyLoggingModule\\n(listener #2)" as L2
participant "RegistrationServlet" as S
database "SQL Server" as DB
== deploy ==
T -&gt; L1 : contextInitialized
L1 -&gt; DB : open a test connection
L1 -&gt; L1 : ctx.setAttribute("db", pool)
T -&gt; L2 : contextInitialized
== requests ==
T -&gt; S : GET /registrations?course=PRJ301
S -&gt; DB : pool.getConnection() + SELECT ... WHERE course = ?
== undeploy ==
T -&gt; L2 : contextDestroyed (FIRST)
T -&gt; L1 : contextDestroyed (LAST)
L1 -&gt; DB : pool.close()
@enduml</code></pre></details>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/webapp/WEB-INF/web.xml</code></p>
<pre class="web-src"><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"&gt;
    &lt;display-name&gt;MyListeningApplication&lt;/display-name&gt;
    &lt;listener&gt;
        &lt;listener-class&gt;com.acme.MyConnectionManager&lt;/listener-class&gt;
    &lt;/listener&gt;
    &lt;listener&gt;
        &lt;listener-class&gt;com.acme.MyLoggingModule&lt;/listener-class&gt;
    &lt;/listener&gt;
    &lt;servlet&gt;
        &lt;display-name&gt;RegistrationServlet&lt;/display-name&gt;
        &lt;servlet-name&gt;RegistrationServlet&lt;/servlet-name&gt;
        &lt;servlet-class&gt;com.acme.RegistrationServlet&lt;/servlet-class&gt;
    &lt;/servlet&gt;
    &lt;servlet-mapping&gt;
        &lt;servlet-name&gt;RegistrationServlet&lt;/servlet-name&gt;
        &lt;url-pattern&gt;/registrations&lt;/url-pattern&gt;
    &lt;/servlet-mapping&gt;
&lt;/web-app&gt;</code></pre>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/java/com/acme/MyConnectionManager.java</code></p>
<pre class="web-src"><code class="language-java">package com.acme;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Collections;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import org.apache.tomcat.dbcp.dbcp2.BasicDataSource;   // connection pool có sẵn trong Tomcat (lib/tomcat-dbcp.jar)

// Kịch bản của slide 9 với một chỗ sửa: context giữ một POOL kết nối (DataSource), không phải MỘT Connection
public class MyConnectionManager implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext ctx = sce.getServletContext();
        BasicDataSource pool = new BasicDataSource();
        pool.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        pool.setDriverClassLoader(getClass().getClassLoader());   // jar driver nằm trong WEB-INF/lib
        pool.setUrl("jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
                + ";databaseName=PRJ301_NgheKhoiDong;encrypt=true;trustServerCertificate=true");
        pool.setUsername(env("DB_USER", "sa"));
        pool.setPassword(env("DB_PASSWORD", "123"));
        pool.setMaxTotal(10);                                     // tối đa 10 kết nối mở cùng lúc
        try (Connection c = pool.getConnection()) {               // hỏng thì báo ngay: kiểm CSDL NGAY BÂY GIỜ
            DatabaseMetaData md = c.getMetaData();
            System.out.println("MyConnectionManager: pool ready → " + md.getDatabaseProductName()
                    + " " + md.getDatabaseMajorVersion());
        } catch (SQLException e) {
            System.out.println("MyConnectionManager: database unreachable → " + e.getMessage());
        }
        ctx.setAttribute("db", pool);                             // servlet nào cũng dùng được
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        BasicDataSource pool = (BasicDataSource) sce.getServletContext().getAttribute("db");
        try {
            pool.close();                                         // đóng mọi kết nối trong pool
            System.out.println("MyConnectionManager: pool closed");
        } catch (SQLException e) {
            System.out.println("MyConnectionManager: close failed → " + e.getMessage());
        }
        // lớp driver đến từ WEB-INF/lib của CHÍNH app này: huỷ đăng ký, không thì Tomcat cảnh báo rò bộ nhớ
        for (Driver d : Collections.list(DriverManager.getDrivers())) {
            if (d.getClass().getClassLoader() == getClass().getClassLoader()) {
                try {
                    DriverManager.deregisterDriver(d);
                    System.out.println("MyConnectionManager: JDBC driver deregistered");
                } catch (SQLException e) {
                    System.out.println("MyConnectionManager: deregister failed → " + e.getMessage());
                }
            }
        }
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-khoi-dong/registrations?course=PRJ301 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 60

Students in PRJ301:
- Nguyễn Văn An
- Trần Thị Bình</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">MyConnectionManager: pool ready → Microsoft SQL Server 15<br>
MyLoggingModule: application started — context path /nghe-khoi-dong</div>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/java/com/acme/RegistrationServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    DataSource db = (DataSource) getServletContext().getAttribute("db");     // do listener đặt vào
    String course = req.getParameter("course");
    resp.setContentType("text/plain;charset=UTF-8");
    PrintWriter out = resp.getWriter();
    String sql = "SELECT student FROM Registration WHERE course = ? ORDER BY id";
    try (Connection c = db.getConnection();                                  // mượn từ pool
         PreparedStatement ps = c.prepareStatement(sql)) {
        ps.setString(1, course);                                              // dữ liệu người dùng ⇒ luôn là tham số
        try (ResultSet rs = ps.executeQuery()) {
            out.println("Students in " + course + ":");
            while (rs.next()) out.println("- " + rs.getString("student"));
        }
    } catch (SQLException e) {                                                // close() trả kết nối về pool
        throw new ServletException(e);
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-khoi-dong/registrations?course=SWD392 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 40

Students in SWD392:
- Lê Minh Cường</code></pre>
<p>Pool ở đây là của chính Tomcat (<code>BasicDataSource</code> trong <code>lib/tomcat-dbcp.jar</code>, có sẵn trên server, không phải tải gì). Dòng "pool ready → Microsoft SQL Server 15" được in lúc deploy — trước request đầu tiên — nhờ kết nối thử, giúp sai mật khẩu thì hỏng <em>ngay lúc khởi động</em>, chứ không đợi tới cú bấm của người dùng đầu tiên. Câu truy vấn dùng <code>PreparedStatement</code> với <code>?</code> vì <code>course</code> đến từ người dùng (Chương 5: SQL injection).</p>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): bạn không bao giờ phải viết listener này — Spring Boot tạo pool HikariCP từ <code>spring.datasource.url/username/password</code> lúc khởi động và đóng nó lúc tắt, còn <code>JdbcTemplate</code> hay repository của Spring Data mượn kết nối giùm bạn. Vòng đời y hệt: mở một lần, mượn theo từng request, đóng lúc kết thúc.</div>`],
      [10, 'Event Listener Declaration and Invocation',
        `<p class="y-chinh">🎯 Listeners are declared in web.xml with <code>&lt;listener&gt;</code> elements directly under <code>&lt;web-app&gt;</code>, one per listener, each with a <code>&lt;listener-class&gt;</code>; within one event category they are invoked in the order they are declared.</p>
<p>Note what is <em>not</em> there: no name, no URL pattern, no mapping. A listener is not tied to URLs; the container looks at which interfaces the class implements and calls it for those events. Our <code>nghe-khoi-dong</code> app declares two context listeners — the connection manager first. Removing the app shows the other half of the rule, measured:</p>
<p class="ghi-chu">🛑 Undeploy the application (delete the WAR) — the Tomcat console prints:</p>
<div class="out log">MyLoggingModule: application stopping<br>
MyConnectionManager: pool closed<br>
MyConnectionManager: JDBC driver deregistered</div>
<p><strong>Start-up in declaration order, shutdown in reverse order</strong> (the specification requires it): the logging module stops before the connection manager closes the pool, so a listener declared later can still use what an earlier one created. Put the listener that creates resources <em>first</em>.</p>
<p>➕ The annotation form (Servlet 3.0+), used by most examples here: put <code>@WebListener</code> on the class — no web.xml. As with <code>@WebFilter</code>, annotations give no control over order; declare in web.xml when order matters.</p>
<div class="pitfall">FE question type: "what is <code>&lt;listener&gt;</code> used for?" — declaring a listener class that handles web-application events. It does not map listeners to URL patterns and does not configure parameters.</div>`,
        `<p class="y-chinh">🎯 Listener được khai trong web.xml bằng các phần tử <code>&lt;listener&gt;</code> nằm ngay dưới <code>&lt;web-app&gt;</code>, mỗi listener một phần tử, mỗi phần tử có một <code>&lt;listener-class&gt;</code>; trong cùng một loại sự kiện, chúng được gọi theo thứ tự khai báo.</p>
<p>Để ý những gì <em>không</em> có: không tên, không URL pattern, không mapping. Listener không gắn với URL; container xem lớp cài những interface nào và gọi nó cho các sự kiện đó. App <code>nghe-khoi-dong</code> khai hai context listener — trình quản lý kết nối đứng trước. Gỡ ứng dụng cho thấy nửa còn lại của luật, đo thật:</p>
<p class="ghi-chu">🛑 Gỡ ứng dụng khỏi Tomcat (xoá file WAR) — console của Tomcat in ra:</p>
<div class="out log">MyLoggingModule: application stopping<br>
MyConnectionManager: pool closed<br>
MyConnectionManager: JDBC driver deregistered</div>
<p><strong>Khởi động theo thứ tự khai báo, tắt theo thứ tự ngược lại</strong> (đặc tả bắt buộc như vậy): module ghi log dừng trước khi trình quản lý kết nối đóng pool, nên listener khai sau vẫn dùng được thứ listener khai trước đã tạo. Hãy đặt listener tạo tài nguyên <em>lên đầu</em>.</p>
<p>➕ Dạng annotation (Servlet 3.0+), dùng trong phần lớn ví dụ ở đây: gắn <code>@WebListener</code> lên lớp — không cần web.xml. Giống <code>@WebFilter</code>, annotation không cho điều khiển thứ tự; khi thứ tự quan trọng hãy khai trong web.xml.</p>
<div class="pitfall">Dạng câu FE: "<code>&lt;listener&gt;</code> dùng để làm gì?" — khai một lớp listener xử lý sự kiện của ứng dụng web. Nó không ánh xạ listener vào URL pattern và không cấu hình tham số.</div>`],
      [11, 'Event Listener Declaration and Invocation',
        `<p class="y-chinh">🎯 The example from the Sun Java Servlet Specification 2.3: a <code>&lt;web-app&gt;</code> with a display-name, two <code>&lt;listener&gt;</code> elements (<code>com.acme.MyConnectionManager</code>, <code>com.acme.MyLoggingModule</code>) and then the <code>&lt;servlet&gt;</code> elements.</p>
<p>We used exactly these names, with the Servlet 6.0 header:</p>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/webapp/WEB-INF/web.xml</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-xml">&lt;display-name&gt;MyListeningApplication&lt;/display-name&gt;
&lt;listener&gt;
    &lt;listener-class&gt;com.acme.MyConnectionManager&lt;/listener-class&gt;
&lt;/listener&gt;
&lt;listener&gt;
    &lt;listener-class&gt;com.acme.MyLoggingModule&lt;/listener-class&gt;
&lt;/listener&gt;
&lt;servlet&gt;
    &lt;display-name&gt;RegistrationServlet&lt;/display-name&gt;
    &lt;servlet-name&gt;RegistrationServlet&lt;/servlet-name&gt;
    &lt;servlet-class&gt;com.acme.RegistrationServlet&lt;/servlet-class&gt;
&lt;/servlet&gt;</code></pre>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/java/com/acme/MyLoggingModule.java</code></p>
<pre class="web-src"><code class="language-java">package com.acme;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;

// The second listener of slide 11 — it only reports when it is called
public class MyLoggingModule implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("MyLoggingModule: application started — context path " + sce.getServletContext().getContextPath());
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("MyLoggingModule: application stopping");
    }
}</code></pre>
<div class="pitfall">A real typo on the slide: the first listener is written <code>&lt;listenerclass&gt;</code> — without the hyphen. We deployed that on the same Tomcat 10.1: the app starts, Tomcat prints <strong>no warning at all</strong>, and the listener <strong>never runs</strong> (a misspelled element is simply ignored). In your Assignment that means "my listener does nothing" with no error to search for — compare tag names letter by letter, or let NetBeans' XML validation underline them.</div>
<p>Servlet 2.3 is from 2001; its web.xml still used a DTD in which the order of elements mattered (listeners before servlets). The order here follows it, and it is still the natural order to read.</p>`,
        `<p class="y-chinh">🎯 Ví dụ lấy từ Sun Java Servlet Specification 2.3: một <code>&lt;web-app&gt;</code> có display-name, hai phần tử <code>&lt;listener&gt;</code> (<code>com.acme.MyConnectionManager</code>, <code>com.acme.MyLoggingModule</code>) rồi tới các phần tử <code>&lt;servlet&gt;</code>.</p>
<p>Ta dùng đúng các tên này, với phần đầu của Servlet 6.0:</p>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/webapp/WEB-INF/web.xml</code> (trích)</p>
<pre class="web-src trich"><code class="language-xml">&lt;display-name&gt;MyListeningApplication&lt;/display-name&gt;
&lt;listener&gt;
    &lt;listener-class&gt;com.acme.MyConnectionManager&lt;/listener-class&gt;
&lt;/listener&gt;
&lt;listener&gt;
    &lt;listener-class&gt;com.acme.MyLoggingModule&lt;/listener-class&gt;
&lt;/listener&gt;
&lt;servlet&gt;
    &lt;display-name&gt;RegistrationServlet&lt;/display-name&gt;
    &lt;servlet-name&gt;RegistrationServlet&lt;/servlet-name&gt;
    &lt;servlet-class&gt;com.acme.RegistrationServlet&lt;/servlet-class&gt;
&lt;/servlet&gt;</code></pre>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/java/com/acme/MyLoggingModule.java</code></p>
<pre class="web-src"><code class="language-java">package com.acme;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;

// Listener thứ hai của slide 11 — chỉ báo khi được gọi
public class MyLoggingModule implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("MyLoggingModule: application started — context path " + sce.getServletContext().getContextPath());
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("MyLoggingModule: application stopping");
    }
}</code></pre>
<div class="pitfall">Một lỗi gõ thật trên slide: listener đầu tiên được viết <code>&lt;listenerclass&gt;</code> — thiếu dấu gạch nối. Ta đã deploy đúng như thế trên cùng Tomcat 10.1: ứng dụng vẫn khởi động, Tomcat <strong>không in một cảnh báo nào</strong>, và listener <strong>không bao giờ chạy</strong> (phần tử viết sai tên bị lờ đi). Trong Assignment, đó là cảnh "listener của tôi không làm gì cả" mà không có lỗi nào để tìm — hãy so tên thẻ từng chữ, hoặc để NetBeans kiểm tra XML gạch chân giúp.</div>
<p>Servlet 2.3 ra năm 2001; web.xml thời đó còn dùng DTD, trong đó thứ tự các phần tử có ý nghĩa (listener đứng trước servlet). Thứ tự ở đây theo đúng như thế, và vẫn là thứ tự dễ đọc nhất.</p>`],
      [12, 'Event Listener Coding and Deployment Guidelines',
        `<p class="y-chinh">🎯 Three rules: (1) attribute changes may happen at the same time on many threads and the container does not synchronise the notifications — the listener must keep its own data consistent; (2) every listener class needs a public no-argument constructor; (3) the class must be in the WAR, under <code>/WEB-INF/classes</code> or in a JAR in <code>/WEB-INF/lib</code>.</p>
<p><strong>Rule 1 in practice</strong>: two users logging in at the same moment ⇒ two threads call <code>sessionCreated</code> together. A plain <code>int</code> counter (<code>count++</code> is read–add–write) can lose an update. The online counter therefore stores an <code>AtomicInteger</code>, created once in <code>contextInitialized</code>:</p>
<p class="ghi-chu">📄 <code>nghe-dem-online/src/main/java/online/OnlineCounter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void contextInitialized(ServletContextEvent sce) {
    sce.getServletContext().setAttribute("online", new AtomicInteger());   // one shared counter, safe for many threads
}

@Override
public void sessionCreated(HttpSessionEvent se) {
    int n = counter(se).incrementAndGet();
    System.out.println("sessionCreated   → online = " + n);
}

@Override
public void sessionDestroyed(HttpSessionEvent se) {                      // logout (invalidate) OR timeout
    int n = counter(se).decrementAndGet();
    System.out.println("sessionDestroyed → online = " + n);
}

private static AtomicInteger counter(HttpSessionEvent se) {
    return (AtomicInteger) se.getSession().getServletContext().getAttribute("online");
}</code></pre>
<p><strong>Rule 2</strong> exists because the container creates the object itself with <code>new</code> (by reflection) — it cannot guess arguments. So no constructor parameters; read configuration from the context (<code>getInitParameter</code>) inside the methods. <strong>Rule 3</strong> is the same as for servlets and filters (Chapter 2, WAR layout).</p>`,
        `<p class="y-chinh">🎯 Ba quy tắc: (1) thay đổi attribute có thể xảy ra cùng lúc trên nhiều luồng và container không đồng bộ các thông báo — listener phải tự giữ dữ liệu của nó nhất quán; (2) lớp listener nào cũng cần constructor public không tham số; (3) lớp phải nằm trong WAR, dưới <code>/WEB-INF/classes</code> hoặc trong một JAR ở <code>/WEB-INF/lib</code>.</p>
<p><strong>Quy tắc 1 ngoài đời</strong>: hai người đăng nhập cùng lúc ⇒ hai luồng cùng gọi <code>sessionCreated</code>. Một bộ đếm <code>int</code> thường (<code>count++</code> là đọc–cộng–ghi) có thể mất một lần cập nhật. Vì vậy bộ đếm online cất một <code>AtomicInteger</code>, tạo một lần trong <code>contextInitialized</code>:</p>
<p class="ghi-chu">📄 <code>nghe-dem-online/src/main/java/online/OnlineCounter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void contextInitialized(ServletContextEvent sce) {
    sce.getServletContext().setAttribute("online", new AtomicInteger());   // một bộ đếm dùng chung, an toàn khi nhiều luồng
}

@Override
public void sessionCreated(HttpSessionEvent se) {
    int n = counter(se).incrementAndGet();
    System.out.println("sessionCreated   → online = " + n);
}

@Override
public void sessionDestroyed(HttpSessionEvent se) {                      // đăng xuất (invalidate) HOẶC hết hạn
    int n = counter(se).decrementAndGet();
    System.out.println("sessionDestroyed → online = " + n);
}

private static AtomicInteger counter(HttpSessionEvent se) {
    return (AtomicInteger) se.getSession().getServletContext().getAttribute("online");
}</code></pre>
<p><strong>Quy tắc 2</strong> có vì container tự tạo đối tượng bằng <code>new</code> (qua reflection) — nó không đoán được tham số. Nên không có tham số constructor; đọc cấu hình từ context (<code>getInitParameter</code>) bên trong các phương thức. <strong>Quy tắc 3</strong> giống hệt servlet và filter (Chương 2, bố cục WAR).</p>`],
      [13, 'Event Listener Methods and Related Classes',
        `<p class="y-chinh">🎯 The last part of the deck lists, for each interface, the methods the container calls when a context or session event occurs; each method receives an event object of a specific type.</p>
<p>The event object is how the listener finds out <em>what</em> happened <em>to whom</em>. What each one gives you:</p>
<table>
<thead><tr><th>Event class</th><th>Passed to</th><th>Useful getters</th></tr></thead>
<tbody>
<tr><td><code>ServletContextEvent</code></td><td>contextInitialized / contextDestroyed</td><td><code>getServletContext()</code></td></tr>
<tr><td><code>ServletContextAttributeEvent</code></td><td>context attribute… methods</td><td><code>getName()</code>, <code>getValue()</code>, <code>getServletContext()</code></td></tr>
<tr><td><code>HttpSessionEvent</code></td><td>sessionCreated / sessionDestroyed</td><td><code>getSession()</code> (then <code>getId()</code>, <code>getServletContext()</code>)</td></tr>
<tr><td><code>HttpSessionBindingEvent</code></td><td>session attribute… methods, valueBound / valueUnbound</td><td><code>getName()</code>, <code>getValue()</code>, <code>getSession()</code></td></tr>
<tr><td>➕ <code>ServletRequestEvent</code></td><td>requestInitialized / requestDestroyed</td><td><code>getServletRequest()</code>, <code>getServletContext()</code></td></tr>
</tbody>
</table>
<p>The <code>getServletContext()</code> path matters most: a session or attribute listener reaches application scope through it — that is how the online counter finds its shared <code>AtomicInteger</code> (<code>se.getSession().getServletContext()</code>, slide 12).</p>`,
        `<p class="y-chinh">🎯 Phần cuối deck liệt kê, cho từng interface, các phương thức mà container gọi khi có sự kiện của context hay session; mỗi phương thức nhận một đối tượng sự kiện thuộc kiểu riêng.</p>
<p>Đối tượng sự kiện là cách listener biết <em>chuyện gì</em> xảy ra <em>với ai</em>. Mỗi loại cho bạn:</p>
<table>
<thead><tr><th>Lớp sự kiện</th><th>Truyền vào</th><th>Getter hữu ích</th></tr></thead>
<tbody>
<tr><td><code>ServletContextEvent</code></td><td>contextInitialized / contextDestroyed</td><td><code>getServletContext()</code></td></tr>
<tr><td><code>ServletContextAttributeEvent</code></td><td>các phương thức attribute… của context</td><td><code>getName()</code>, <code>getValue()</code>, <code>getServletContext()</code></td></tr>
<tr><td><code>HttpSessionEvent</code></td><td>sessionCreated / sessionDestroyed</td><td><code>getSession()</code> (rồi <code>getId()</code>, <code>getServletContext()</code>)</td></tr>
<tr><td><code>HttpSessionBindingEvent</code></td><td>các phương thức attribute… của session, valueBound / valueUnbound</td><td><code>getName()</code>, <code>getValue()</code>, <code>getSession()</code></td></tr>
<tr><td>➕ <code>ServletRequestEvent</code></td><td>requestInitialized / requestDestroyed</td><td><code>getServletRequest()</code>, <code>getServletContext()</code></td></tr>
</tbody>
</table>
<p>Đường <code>getServletContext()</code> quan trọng nhất: listener của session hay attribute đi tới phạm vi application qua nó — đó là cách bộ đếm online tìm thấy <code>AtomicInteger</code> dùng chung (<code>se.getSession().getServletContext()</code>, slide 12).</p>`],
      [14, 'ServletContextListener Methods, ServletContextEvent Class',
        `<p class="y-chinh">🎯 <code>ServletContextListener</code>: <code>contextInitialized(ServletContextEvent)</code> — the context has been created and the app is ready to process requests; <code>contextDestroyed(ServletContextEvent)</code> — the app is about to shut down.</p>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/java/com/acme/MyConnectionManager.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void contextInitialized(ServletContextEvent sce) {
    ServletContext ctx = sce.getServletContext();
    BasicDataSource pool = new BasicDataSource();
    pool.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
    pool.setDriverClassLoader(getClass().getClassLoader());   // the driver jar is in WEB-INF/lib
    pool.setUrl("jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
            + ";databaseName=PRJ301_NgheKhoiDong;encrypt=true;trustServerCertificate=true");
    pool.setUsername(env("DB_USER", "sa"));
    pool.setPassword(env("DB_PASSWORD", "123"));
    pool.setMaxTotal(10);                                     // at most 10 connections open at once
    try (Connection c = pool.getConnection()) {               // fail fast: check the database NOW
        DatabaseMetaData md = c.getMetaData();
        System.out.println("MyConnectionManager: pool ready → " + md.getDatabaseProductName()
                + " " + md.getDatabaseMajorVersion());
    } catch (SQLException e) {
        System.out.println("MyConnectionManager: database unreachable → " + e.getMessage());
    }
    ctx.setAttribute("db", pool);                             // every servlet can now use it
}</code></pre>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/java/com/acme/MyConnectionManager.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void contextDestroyed(ServletContextEvent sce) {
    BasicDataSource pool = (BasicDataSource) sce.getServletContext().getAttribute("db");
    try {
        pool.close();                                         // close every pooled connection
        System.out.println("MyConnectionManager: pool closed");
    } catch (SQLException e) {
        System.out.println("MyConnectionManager: close failed → " + e.getMessage());
    }
    // the driver class came from THIS app's WEB-INF/lib: unregister it, or Tomcat warns about a memory leak
    for (Driver d : Collections.list(DriverManager.getDrivers())) {
        if (d.getClass().getClassLoader() == getClass().getClassLoader()) {
            try {
                DriverManager.deregisterDriver(d);
                System.out.println("MyConnectionManager: JDBC driver deregistered");
            } catch (SQLException e) {
                System.out.println("MyConnectionManager: deregister failed → " + e.getMessage());
            }
        }
    }
}</code></pre>
<p><strong>When exactly</strong> (measured): <code>contextInitialized</code> runs during deployment, before any filter's <code>init</code>, before any request; <code>contextDestroyed</code> runs on undeploy, reload or shutdown, after the filters and servlets were destroyed. Two lessons learned while building these examples:</p>
<ul>
<li><strong>An exception in <code>contextInitialized</code> stops the whole app.</strong> Our first version of exercise 7 (lesson 8.3) forgot <code>Class.forName</code> for the driver; <code>DriverManager</code> answered "No suitable driver", the listener threw, and Tomcat logged "One or more listeners failed to start" — every URL of the app then gave 404. Fail loudly at start-up is good; read <code>logs/localhost.*.log</code> to see why.</li>
<li><strong>Clean up what you opened.</strong> Without the driver-deregistration loop above, Tomcat warns on undeploy: "registered the JDBC driver … but failed to unregister it … To prevent a memory leak, the JDBC Driver has been forcibly unregistered". With it, the warning is gone.</li>
</ul>
<div class="pitfall">FE question type: "when is <code>contextInitialized()</code> invoked?" — when the web application is deployed/started (not on each request, not when a session is created). "Purpose of <code>contextDestroyed()</code>?" — clean up resources when the app is shutting down.</div>`,
        `<p class="y-chinh">🎯 <code>ServletContextListener</code>: <code>contextInitialized(ServletContextEvent)</code> — context đã được tạo và ứng dụng sẵn sàng xử lý request; <code>contextDestroyed(ServletContextEvent)</code> — ứng dụng sắp tắt.</p>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/java/com/acme/MyConnectionManager.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void contextInitialized(ServletContextEvent sce) {
    ServletContext ctx = sce.getServletContext();
    BasicDataSource pool = new BasicDataSource();
    pool.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
    pool.setDriverClassLoader(getClass().getClassLoader());   // jar driver nằm trong WEB-INF/lib
    pool.setUrl("jdbc:sqlserver://" + env("DB_HOST", "localhost") + ":" + env("DB_PORT", "1433")
            + ";databaseName=PRJ301_NgheKhoiDong;encrypt=true;trustServerCertificate=true");
    pool.setUsername(env("DB_USER", "sa"));
    pool.setPassword(env("DB_PASSWORD", "123"));
    pool.setMaxTotal(10);                                     // tối đa 10 kết nối mở cùng lúc
    try (Connection c = pool.getConnection()) {               // hỏng thì báo ngay: kiểm CSDL NGAY BÂY GIỜ
        DatabaseMetaData md = c.getMetaData();
        System.out.println("MyConnectionManager: pool ready → " + md.getDatabaseProductName()
                + " " + md.getDatabaseMajorVersion());
    } catch (SQLException e) {
        System.out.println("MyConnectionManager: database unreachable → " + e.getMessage());
    }
    ctx.setAttribute("db", pool);                             // servlet nào cũng dùng được
}</code></pre>
<p class="ghi-chu">📄 <code>nghe-khoi-dong/src/main/java/com/acme/MyConnectionManager.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void contextDestroyed(ServletContextEvent sce) {
    BasicDataSource pool = (BasicDataSource) sce.getServletContext().getAttribute("db");
    try {
        pool.close();                                         // đóng mọi kết nối trong pool
        System.out.println("MyConnectionManager: pool closed");
    } catch (SQLException e) {
        System.out.println("MyConnectionManager: close failed → " + e.getMessage());
    }
    // lớp driver đến từ WEB-INF/lib của CHÍNH app này: huỷ đăng ký, không thì Tomcat cảnh báo rò bộ nhớ
    for (Driver d : Collections.list(DriverManager.getDrivers())) {
        if (d.getClass().getClassLoader() == getClass().getClassLoader()) {
            try {
                DriverManager.deregisterDriver(d);
                System.out.println("MyConnectionManager: JDBC driver deregistered");
            } catch (SQLException e) {
                System.out.println("MyConnectionManager: deregister failed → " + e.getMessage());
            }
        }
    }
}</code></pre>
<p><strong>Chính xác là khi nào</strong> (đo thật): <code>contextInitialized</code> chạy trong lúc deploy, trước <code>init</code> của mọi filter, trước mọi request; <code>contextDestroyed</code> chạy khi gỡ, nạp lại hoặc tắt server, sau khi filter và servlet đã bị huỷ. Hai bài học có được khi dựng các ví dụ này:</p>
<ul>
<li><strong>Exception trong <code>contextInitialized</code> làm sập cả ứng dụng.</strong> Bản đầu của bài tập 7 (bài 8.3) quên <code>Class.forName</code> cho driver; <code>DriverManager</code> báo "No suitable driver", listener ném lỗi, và Tomcat ghi "One or more listeners failed to start" — mọi URL của ứng dụng sau đó trả 404. Hỏng ầm ĩ ngay lúc khởi động là tốt; đọc <code>logs/localhost.*.log</code> để biết vì sao.</li>
<li><strong>Mở gì thì dọn nấy.</strong> Không có vòng lặp huỷ đăng ký driver ở trên, Tomcat cảnh báo khi gỡ app: "registered the JDBC driver … but failed to unregister it … To prevent a memory leak, the JDBC Driver has been forcibly unregistered". Có nó thì cảnh báo biến mất.</li>
</ul>
<div class="pitfall">Dạng câu FE: "<code>contextInitialized()</code> được gọi khi nào?" — khi ứng dụng web được deploy/khởi động (không phải mỗi request, không phải khi tạo session). "Mục đích của <code>contextDestroyed()</code>?" — dọn dẹp tài nguyên khi ứng dụng đang tắt.</div>`],
      [15, 'ServletContextAttributeListener Methods,ServletContextAttributeEventClass',
        `<p class="y-chinh">🎯 <code>ServletContextAttributeListener</code>: <code>attributeAdded</code>, <code>attributeRemoved</code>, <code>attributeReplaced</code>, each receiving a <code>ServletContextAttributeEvent</code> — called when an attribute is added to, removed from or replaced in the servlet context.</p>
<p class="ghi-chu">📄 <code>nghe-thuoc-tinh/src/main/java/spy/AttributeSpy.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Slide 15: application-scope attributes
@Override
public void attributeAdded(ServletContextAttributeEvent e) {
    if (mine(e.getName())) System.out.println("context attributeAdded    " + e.getName() + " = " + e.getValue());
}

@Override
public void attributeReplaced(ServletContextAttributeEvent e) {
    if (mine(e.getName())) System.out.println("context attributeReplaced " + e.getName() + " : event.getValue() = " + e.getValue()
            + " · context now has " + e.getServletContext().getAttribute(e.getName()));
}

@Override
public void attributeRemoved(ServletContextAttributeEvent e) {
    if (mine(e.getName())) System.out.println("context attributeRemoved  " + e.getName() + " = " + e.getValue());
}</code></pre>
<p>Three requests to a servlet that sets, changes, then removes the application attribute <code>theme</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-thuoc-tinh/theme?set=dark HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 25

application theme = dark</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">context attributeAdded &nbsp;&nbsp;&nbsp;theme = dark</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-thuoc-tinh/theme?set=light HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 26

application theme = light</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">context attributeReplaced theme : event.getValue() = dark · context now has light</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-thuoc-tinh/theme?remove HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 25

application theme = null</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">context attributeRemoved &nbsp;theme = light</div>
<p>Look at the second log line: in <code>attributeReplaced</code>, <code>event.getValue()</code> returns the <strong>old</strong> value (dark), while the context already holds the new one (light). That is the documented contract — "if the attribute was replaced, this is the old value" — and it lets an audit log write "theme: dark → light".</p>
<p>Why the <code>mine(...)</code> check: Tomcat itself puts attributes into every context at start-up (names starting with <code>org.apache.</code> and <code>jakarta.</code>, such as the temp directory and the JSP class path); without the check, the log would start with a dozen lines you did not cause.</p>`,
        `<p class="y-chinh">🎯 <code>ServletContextAttributeListener</code>: <code>attributeAdded</code>, <code>attributeRemoved</code>, <code>attributeReplaced</code>, mỗi cái nhận một <code>ServletContextAttributeEvent</code> — được gọi khi một attribute được thêm vào, xoá khỏi hoặc thay thế trong servlet context.</p>
<p class="ghi-chu">📄 <code>nghe-thuoc-tinh/src/main/java/spy/AttributeSpy.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Slide 15: attribute phạm vi application
@Override
public void attributeAdded(ServletContextAttributeEvent e) {
    if (mine(e.getName())) System.out.println("context attributeAdded    " + e.getName() + " = " + e.getValue());
}

@Override
public void attributeReplaced(ServletContextAttributeEvent e) {
    if (mine(e.getName())) System.out.println("context attributeReplaced " + e.getName() + " : event.getValue() = " + e.getValue()
            + " · context now has " + e.getServletContext().getAttribute(e.getName()));
}

@Override
public void attributeRemoved(ServletContextAttributeEvent e) {
    if (mine(e.getName())) System.out.println("context attributeRemoved  " + e.getName() + " = " + e.getValue());
}</code></pre>
<p>Ba request tới một servlet đặt, đổi rồi xoá attribute <code>theme</code> của application:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-thuoc-tinh/theme?set=dark HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 25

application theme = dark</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">context attributeAdded &nbsp;&nbsp;&nbsp;theme = dark</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-thuoc-tinh/theme?set=light HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 26

application theme = light</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">context attributeReplaced theme : event.getValue() = dark · context now has light</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-thuoc-tinh/theme?remove HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 25

application theme = null</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">context attributeRemoved &nbsp;theme = light</div>
<p>Nhìn dòng log thứ hai: trong <code>attributeReplaced</code>, <code>event.getValue()</code> trả giá trị <strong>cũ</strong> (dark), trong khi context đã giữ giá trị mới (light). Đó là hợp đồng có ghi trong tài liệu — "nếu attribute bị thay, đây là giá trị cũ" — và nhờ thế log kiểm toán ghi được "theme: dark → light".</p>
<p>Vì sao có phép kiểm <code>mine(...)</code>: chính Tomcat đặt attribute vào mọi context lúc khởi động (tên bắt đầu bằng <code>org.apache.</code> và <code>jakarta.</code>, như thư mục tạm và classpath của JSP); không lọc thì log sẽ mở đầu bằng cả chục dòng không phải do bạn gây ra.</p>`],
      [16, 'HttpSessionListener Methods, HttpSessionEvent Class',
        `<p class="y-chinh">🎯 <code>HttpSessionListener</code>: <code>sessionCreated(HttpSessionEvent)</code> — a session was created; <code>sessionDestroyed(HttpSessionEvent)</code> — a session was destroyed.</p>
<p>The classic use, an online counter (code on slide 12), followed through seven real requests from five "browsers". The counter starts at 0 and reading it does not create a session:</p>
<p class="ghi-chu">📄 <code>nghe-dem-online/src/main/java/online/OnlineCounter.java</code></p>
<pre class="web-src"><code class="language-java">package online;

import java.util.concurrent.atomic.AtomicInteger;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

// Slide 16 put to work: count the sessions that are alive right now
@WebListener
public class OnlineCounter implements HttpSessionListener, ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        sce.getServletContext().setAttribute("online", new AtomicInteger());   // one shared counter, safe for many threads
    }

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        int n = counter(se).incrementAndGet();
        System.out.println("sessionCreated   → online = " + n);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {                      // logout (invalidate) OR timeout
        int n = counter(se).decrementAndGet();
        System.out.println("sessionDestroyed → online = " + n);
    }

    private static AtomicInteger counter(HttpSessionEvent se) {
        return (AtomicInteger) se.getSession().getServletContext().getAttribute("online");
    }
}</code></pre>
<p class="ghi-chu">📄 <code>nghe-dem-online/src/main/java/online/SiteServlet.java</code></p>
<pre class="web-src"><code class="language-java">package online;

import java.io.IOException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

// /online: read the counter · /login: create a session · /logout: invalidate · /wait: sleep, then look for the session
@WebServlet({"/online", "/login", "/logout", "/wait"})
public class SiteServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String path = req.getServletPath();
        String note = "";
        if (path.equals("/login")) {
            HttpSession s = req.getSession();                            // creates a session ⇒ sessionCreated
            s.setAttribute("user", req.getParameter("user"));
            String ttl = req.getParameter("ttl");
            if (ttl != null) s.setMaxInactiveInterval(Integer.parseInt(ttl));   // seconds of inactivity allowed
            note = "welcome " + s.getAttribute("user");
        } else if (path.equals("/logout")) {
            HttpSession s = req.getSession(false);                       // never create one just to destroy it
            if (s != null) s.invalidate();                               // ⇒ sessionDestroyed
            note = "bye";
        } else if (path.equals("/wait")) {
            try { Thread.sleep(2500); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            note = req.getSession(false) == null ? "your session has expired" : "still logged in";
        }
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println((note.isEmpty() ? "" : note + " · ") + "online now: " + getServletContext().getAttribute("online"));
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/online HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 14

online now: 0</code></pre>
<p>A guest who only opens a JSP page — and the counter goes up, because <strong>a JSP creates a session by default</strong>. The same kind of page with <code>session="false"</code> does not:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/home.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/nghe-dem-online; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 76

Home page (a JSP: it creates a session unless told not to) · online now: 1</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">sessionCreated &nbsp;&nbsp;→ online = 1</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/about.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 46

About page (session="false") · online now: 1</code></pre>
<p>Login creates a session (<code>sessionCreated</code>), logout destroys it (<code>sessionDestroyed</code> after <code>invalidate()</code>):</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/login?user=an HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/nghe-dem-online; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 28

welcome an · online now: 2</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">sessionCreated &nbsp;&nbsp;→ online = 2</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 21

bye · online now: 1</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">sessionDestroyed → online = 1</div>
<p>Timeout: Binh's session may be idle for 1 second only (<code>setMaxInactiveInterval(1)</code>); his next click comes 2.5 seconds later — the container destroys the session and calls the same <code>sessionDestroyed</code>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/login?user=binh&amp;ttl=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(3); Path=/nghe-dem-online; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 30

welcome binh · online now: 2</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">sessionCreated &nbsp;&nbsp;→ online = 2</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/wait HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 42

your session has expired · online now: 1</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">sessionDestroyed → online = 1</div>
<p>Finally the app is removed: the guest's session from the JSP visit was still alive, and Tomcat destroyed it too:</p>
<p class="ghi-chu">🛑 Undeploy the application (delete the WAR) — the Tomcat console prints:</p>
<div class="out log">sessionDestroyed → online = 0</div>
<div class="pitfall">So "online = sessions" over-counts: every crawler or guest that opens one JSP adds a session that lives for the full timeout (30 minutes by default). For "logged-in users" listen to the <em>user attribute</em> instead (lesson 8.3, exercise 6) — and put <code>session="false"</code> on public JSPs that do not need one.</div>`,
        `<p class="y-chinh">🎯 <code>HttpSessionListener</code>: <code>sessionCreated(HttpSessionEvent)</code> — một session vừa được tạo; <code>sessionDestroyed(HttpSessionEvent)</code> — một session vừa bị huỷ.</p>
<p>Công dụng kinh điển, bộ đếm online (code ở slide 12), theo qua bảy request thật từ năm "trình duyệt". Bộ đếm bắt đầu từ 0 và việc đọc nó không tạo session:</p>
<p class="ghi-chu">📄 <code>nghe-dem-online/src/main/java/online/OnlineCounter.java</code></p>
<pre class="web-src"><code class="language-java">package online;

import java.util.concurrent.atomic.AtomicInteger;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

// Slide 16 đem ra dùng: đếm số session đang sống
@WebListener
public class OnlineCounter implements HttpSessionListener, ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        sce.getServletContext().setAttribute("online", new AtomicInteger());   // một bộ đếm dùng chung, an toàn khi nhiều luồng
    }

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        int n = counter(se).incrementAndGet();
        System.out.println("sessionCreated   → online = " + n);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {                      // đăng xuất (invalidate) HOẶC hết hạn
        int n = counter(se).decrementAndGet();
        System.out.println("sessionDestroyed → online = " + n);
    }

    private static AtomicInteger counter(HttpSessionEvent se) {
        return (AtomicInteger) se.getSession().getServletContext().getAttribute("online");
    }
}</code></pre>
<p class="ghi-chu">📄 <code>nghe-dem-online/src/main/java/online/SiteServlet.java</code></p>
<pre class="web-src"><code class="language-java">package online;

import java.io.IOException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

// /online: đọc bộ đếm · /login: tạo session · /logout: huỷ · /wait: ngủ rồi tìm session
@WebServlet({"/online", "/login", "/logout", "/wait"})
public class SiteServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String path = req.getServletPath();
        String note = "";
        if (path.equals("/login")) {
            HttpSession s = req.getSession();                            // tạo session ⇒ sessionCreated
            s.setAttribute("user", req.getParameter("user"));
            String ttl = req.getParameter("ttl");
            if (ttl != null) s.setMaxInactiveInterval(Integer.parseInt(ttl));   // số giây được phép không hoạt động
            note = "welcome " + s.getAttribute("user");
        } else if (path.equals("/logout")) {
            HttpSession s = req.getSession(false);                       // đừng tạo session chỉ để huỷ nó
            if (s != null) s.invalidate();                               // ⇒ sessionDestroyed
            note = "bye";
        } else if (path.equals("/wait")) {
            try { Thread.sleep(2500); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            note = req.getSession(false) == null ? "your session has expired" : "still logged in";
        }
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().println((note.isEmpty() ? "" : note + " · ") + "online now: " + getServletContext().getAttribute("online"));
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/online HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 14

online now: 0</code></pre>
<p>Một khách chỉ mở một trang JSP — vậy mà bộ đếm tăng, vì <strong>JSP mặc định tạo session</strong>. Trang cùng loại có <code>session="false"</code> thì không:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/home.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/nghe-dem-online; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 76

Home page (a JSP: it creates a session unless told not to) · online now: 1</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">sessionCreated &nbsp;&nbsp;→ online = 1</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/about.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 46

About page (session="false") · online now: 1</code></pre>
<p>Đăng nhập tạo session (<code>sessionCreated</code>), đăng xuất huỷ nó (<code>sessionDestroyed</code> sau <code>invalidate()</code>):</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/login?user=an HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/nghe-dem-online; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 28

welcome an · online now: 2</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">sessionCreated &nbsp;&nbsp;→ online = 2</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 21

bye · online now: 1</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">sessionDestroyed → online = 1</div>
<p>Hết hạn: session của Bình chỉ được để yên 1 giây (<code>setMaxInactiveInterval(1)</code>); cú bấm tiếp theo của bạn ấy đến sau 2,5 giây — container huỷ session và gọi cùng <code>sessionDestroyed</code>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/login?user=binh&amp;ttl=1 HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(3); Path=/nghe-dem-online; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 30

welcome binh · online now: 2</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">sessionCreated &nbsp;&nbsp;→ online = 2</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-dem-online/wait HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 42

your session has expired · online now: 1</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">sessionDestroyed → online = 1</div>
<p>Cuối cùng gỡ ứng dụng: session của khách xem JSP vẫn còn sống, và Tomcat huỷ nốt nó:</p>
<p class="ghi-chu">🛑 Gỡ ứng dụng khỏi Tomcat (xoá file WAR) — console của Tomcat in ra:</p>
<div class="out log">sessionDestroyed → online = 0</div>
<div class="pitfall">Vậy "online = số session" đếm dư: mỗi con bot hay khách mở một trang JSP thêm một session sống trọn thời hạn (mặc định 30 phút). Muốn đếm "người đã đăng nhập" thì lắng nghe <em>attribute user</em> (bài 8.3, bài tập 6) — và đặt <code>session="false"</code> cho các JSP công khai không cần session.</div>`],
      [17, 'HttpSessionAttributeListener Methods, HttpSessionBindingEvent Class',
        `<p class="y-chinh">🎯 <code>HttpSessionAttributeListener</code>: <code>attributeAdded</code>, <code>attributeRemoved</code>, <code>attributeReplaced</code>, each receiving an <code>HttpSessionBindingEvent</code> — called when an attribute is added to, removed from or replaced in a session.</p>
<p class="ghi-chu">📄 <code>nghe-thuoc-tinh/src/main/java/spy/AttributeSpy.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// Slide 17: session-scope attributes — the event class is HttpSessionBindingEvent
@Override
public void attributeAdded(HttpSessionBindingEvent e) {
    System.out.println("session attributeAdded    " + e.getName() + " = " + e.getValue());
}

@Override
public void attributeReplaced(HttpSessionBindingEvent e) {
    System.out.println("session attributeReplaced " + e.getName() + " : event.getValue() = " + e.getValue()
            + " · session now has " + e.getSession().getAttribute(e.getName()));
}

@Override
public void attributeRemoved(HttpSessionBindingEvent e) {
    System.out.println("session attributeRemoved  " + e.getName() + " = " + e.getValue());
}</code></pre>
<p>The login servlet puts two attributes into the session: <code>user</code> (a String) and <code>online</code> (an <code>OnlineUser</code> object that is itself a ➕ <code>HttpSessionBindingListener</code>):</p>
<p class="ghi-chu">📄 <code>nghe-thuoc-tinh/src/main/java/spy/LoginServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    HttpSession s = req.getSession();                            // creates the session the first time
    String name = req.getParameter("name");
    s.setAttribute("user", name);                                // a plain String
    s.setAttribute("online", new OnlineUser(name));              // an object that listens to its own binding
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("logged in as " + name);
}</code></pre>
<p class="ghi-chu">📄 <code>nghe-thuoc-tinh/src/main/java/spy/OnlineUser.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void valueBound(HttpSessionBindingEvent e) {
    System.out.println("OnlineUser.valueBound   " + name + " (attribute \\"" + e.getName() + "\\")");
}

@Override
public void valueUnbound(HttpSessionBindingEvent e) {
    System.out.println("OnlineUser.valueUnbound " + name);
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-thuoc-tinh/login?name=An HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/nghe-thuoc-tinh; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 16

logged in as An</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">sessionCreated<br>
session attributeAdded &nbsp;&nbsp;&nbsp;user = An<br>
OnlineUser.valueBound &nbsp;&nbsp;An (attribute "online")<br>
session attributeAdded &nbsp;&nbsp;&nbsp;online = OnlineUser(An)</div>
<p>Same browser logs in again as Binh — both attributes are <em>replaced</em>:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-thuoc-tinh/login?name=Binh HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 18

logged in as Binh</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">session attributeReplaced user : event.getValue() = An · session now has Binh<br>
OnlineUser.valueBound &nbsp;&nbsp;Binh (attribute "online")<br>
OnlineUser.valueUnbound An<br>
session attributeReplaced online : event.getValue() = OnlineUser(Binh) · session now has OnlineUser(Binh)</div>
<p>For <code>user</code> (a String), <code>event.getValue()</code> is the old value "An", as documented. For <code>online</code> Tomcat 10.1 printed the <strong>new</strong> object: when the new value is itself a binding listener, Tomcat builds the event for <code>valueBound</code> with the new value and passes the same event to <code>attributeReplaced</code>. Measured, against the Javadoc — so do not build logic on <code>getValue()</code> in <code>attributeReplaced</code> for such objects; read the session for the new value, and keep the old one yourself if you need it.</p>
<p>Logout (<code>invalidate()</code>) — the order of events:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nghe-thuoc-tinh/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

logged out</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">sessionDestroyed (attributes still readable: user = Binh)<br>
OnlineUser.valueUnbound Binh<br>
session attributeRemoved &nbsp;online = OnlineUser(Binh)<br>
session attributeRemoved &nbsp;user = Binh</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/8687f836d05371be4b34fd99d9b6c8db422eca7a.svg" alt="The events of one session, in the order Tomcat really called them" loading="lazy" /><p class="chu-thich">🧩 The events of one session, in the order Tomcat really called them</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 16–17: the events of one session (order measured on Tomcat 10.1)
[*] --&gt; Alive : getSession() creates it\\n/ sessionCreated
Alive : JSESSIONID cookie points here
Alive : setAttribute(new name) → attributeAdded
Alive : setAttribute(same name) → attributeReplaced
Alive : removeAttribute(name) → attributeRemoved
Alive --&gt; Ending : invalidate()\\nor timeout
Ending : 1. sessionDestroyed\\n(attributes still readable)
Ending : 2. attributeRemoved for each attribute
Ending --&gt; [*]
@enduml</code></pre></details>
<p><code>sessionDestroyed</code> comes <strong>first</strong>, while the attributes are still readable ("Receives notification that a session is about to be invalidated"), then each attribute is unbound and removed. So a cleanup listener can still read who the user was.</p>`,
        `<p class="y-chinh">🎯 <code>HttpSessionAttributeListener</code>: <code>attributeAdded</code>, <code>attributeRemoved</code>, <code>attributeReplaced</code>, mỗi cái nhận một <code>HttpSessionBindingEvent</code> — được gọi khi một attribute được thêm vào, xoá khỏi hoặc thay thế trong một session.</p>
<p class="ghi-chu">📄 <code>nghe-thuoc-tinh/src/main/java/spy/AttributeSpy.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Slide 17: attribute phạm vi session — lớp sự kiện là HttpSessionBindingEvent
@Override
public void attributeAdded(HttpSessionBindingEvent e) {
    System.out.println("session attributeAdded    " + e.getName() + " = " + e.getValue());
}

@Override
public void attributeReplaced(HttpSessionBindingEvent e) {
    System.out.println("session attributeReplaced " + e.getName() + " : event.getValue() = " + e.getValue()
            + " · session now has " + e.getSession().getAttribute(e.getName()));
}

@Override
public void attributeRemoved(HttpSessionBindingEvent e) {
    System.out.println("session attributeRemoved  " + e.getName() + " = " + e.getValue());
}</code></pre>
<p>Servlet đăng nhập đặt hai attribute vào session: <code>user</code> (một String) và <code>online</code> (một đối tượng <code>OnlineUser</code>, bản thân nó là một ➕ <code>HttpSessionBindingListener</code>):</p>
<p class="ghi-chu">📄 <code>nghe-thuoc-tinh/src/main/java/spy/LoginServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    HttpSession s = req.getSession();                            // lần đầu thì tạo session
    String name = req.getParameter("name");
    s.setAttribute("user", name);                                // một String bình thường
    s.setAttribute("online", new OnlineUser(name));              // một đối tượng tự lắng nghe việc nó được gắn vào
    resp.setContentType("text/plain;charset=UTF-8");
    resp.getWriter().println("logged in as " + name);
}</code></pre>
<p class="ghi-chu">📄 <code>nghe-thuoc-tinh/src/main/java/spy/OnlineUser.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void valueBound(HttpSessionBindingEvent e) {
    System.out.println("OnlineUser.valueBound   " + name + " (attribute \\"" + e.getName() + "\\")");
}

@Override
public void valueUnbound(HttpSessionBindingEvent e) {
    System.out.println("OnlineUser.valueUnbound " + name);
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-thuoc-tinh/login?name=An HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/nghe-thuoc-tinh; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 16

logged in as An</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">sessionCreated<br>
session attributeAdded &nbsp;&nbsp;&nbsp;user = An<br>
OnlineUser.valueBound &nbsp;&nbsp;An (attribute "online")<br>
session attributeAdded &nbsp;&nbsp;&nbsp;online = OnlineUser(An)</div>
<p>Cùng trình duyệt đăng nhập lại với tên Bình — cả hai attribute bị <em>thay thế</em>:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-thuoc-tinh/login?name=Binh HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 18

logged in as Binh</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">session attributeReplaced user : event.getValue() = An · session now has Binh<br>
OnlineUser.valueBound &nbsp;&nbsp;Binh (attribute "online")<br>
OnlineUser.valueUnbound An<br>
session attributeReplaced online : event.getValue() = OnlineUser(Binh) · session now has OnlineUser(Binh)</div>
<p>Với <code>user</code> (một String), <code>event.getValue()</code> là giá trị cũ "An", đúng như tài liệu. Với <code>online</code>, Tomcat 10.1 lại in đối tượng <strong>mới</strong>: khi giá trị mới tự nó là binding listener, Tomcat dựng sự kiện cho <code>valueBound</code> bằng giá trị mới rồi dùng lại chính sự kiện đó cho <code>attributeReplaced</code>. Đo thật, trái với Javadoc — nên đừng dựng logic dựa trên <code>getValue()</code> trong <code>attributeReplaced</code> với loại đối tượng này; đọc session để lấy giá trị mới, và tự giữ giá trị cũ nếu cần.</p>
<p>Đăng xuất (<code>invalidate()</code>) — thứ tự các sự kiện:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nghe-thuoc-tinh/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

logged out</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">sessionDestroyed (attributes still readable: user = Binh)<br>
OnlineUser.valueUnbound Binh<br>
session attributeRemoved &nbsp;online = OnlineUser(Binh)<br>
session attributeRemoved &nbsp;user = Binh</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/8687f836d05371be4b34fd99d9b6c8db422eca7a.svg" alt="Các sự kiện của một session, theo đúng thứ tự Tomcat đã gọi" loading="lazy" /><p class="chu-thich">🧩 Các sự kiện của một session, theo đúng thứ tự Tomcat đã gọi</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 16–17: the events of one session (order measured on Tomcat 10.1)
[*] --&gt; Alive : getSession() creates it\\n/ sessionCreated
Alive : JSESSIONID cookie points here
Alive : setAttribute(new name) → attributeAdded
Alive : setAttribute(same name) → attributeReplaced
Alive : removeAttribute(name) → attributeRemoved
Alive --&gt; Ending : invalidate()\\nor timeout
Ending : 1. sessionDestroyed\\n(attributes still readable)
Ending : 2. attributeRemoved for each attribute
Ending --&gt; [*]
@enduml</code></pre></details>
<p><code>sessionDestroyed</code> đến <strong>trước</strong>, lúc attribute vẫn còn đọc được ("nhận thông báo rằng một session sắp bị invalidate"), sau đó từng attribute mới bị gỡ và xoá. Nhờ vậy listener dọn dẹp vẫn đọc được người dùng là ai.</p>`],
      [18, 'Summary',
        `<p class="y-chinh">🎯 The deck covered: what event listeners are; what they can be used for; servlet event listeners — categories and interfaces, the typical scenario, declaration and invocation, coding and deployment guidelines, methods and related classes.</p>
<table>
<thead><tr><th>Summary line</th><th>Slides here</th><th>Can you…</th></tr></thead>
<tbody>
<tr><td>What listeners are</td><td>1–3</td><td>tell an event from a listener, and a listener from a filter?</td></tr>
<tr><td>What they are used for</td><td>4, 9</td><td>name four uses (pool, cache, online count, cleanup)?</td></tr>
<tr><td>Categories and interfaces</td><td>6–8</td><td>fill the 2 × 2 table from memory (+ request level)?</td></tr>
<tr><td>Declaration and invocation</td><td>10–11</td><td>write <code>&lt;listener&gt;</code> / <code>@WebListener</code>; state the start-up and shutdown order?</td></tr>
<tr><td>Guidelines</td><td>12</td><td>make a shared counter thread-safe?</td></tr>
<tr><td>Methods and classes</td><td>13–17</td><td>say when each method runs, and what <code>getValue()</code> returns on replace?</td></tr>
</tbody>
</table>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): servlet listeners still work there (<code>@WebListener</code> + <code>@ServletComponentScan</code>, or a <code>ServletListenerRegistrationBean</code>), but most start-up work moves to Spring's own events — an <code>ApplicationRunner</code> or <code>@EventListener(ApplicationReadyEvent.class)</code> to load data once. A LabFlow API with JWT keeps no <code>HttpSession</code> at all, so "users online" there means "tokens used in the last minutes", computed from the database, not from session events.</div>`,
        `<p class="y-chinh">🎯 Deck đã học: event listener là gì; dùng để làm gì; servlet event listener — các loại và interface, kịch bản điển hình, khai báo và cách được gọi, quy tắc viết và triển khai, các phương thức và lớp liên quan.</p>
<table>
<thead><tr><th>Dòng tóm tắt</th><th>Slide ở đây</th><th>Bạn đã làm được…</th></tr></thead>
<tbody>
<tr><td>Listener là gì</td><td>1–3</td><td>phân biệt sự kiện với listener, và listener với filter?</td></tr>
<tr><td>Dùng để làm gì</td><td>4, 9</td><td>kể bốn công dụng (pool, cache, đếm online, dọn dẹp)?</td></tr>
<tr><td>Loại và interface</td><td>6–8</td><td>điền thuộc bảng 2 × 2 (+ cấp request)?</td></tr>
<tr><td>Khai báo và cách gọi</td><td>10–11</td><td>viết <code>&lt;listener&gt;</code> / <code>@WebListener</code>; nói đúng thứ tự khởi động và tắt?</td></tr>
<tr><td>Quy tắc</td><td>12</td><td>làm bộ đếm dùng chung an toàn luồng?</td></tr>
<tr><td>Phương thức và lớp</td><td>13–17</td><td>nói mỗi phương thức chạy khi nào, và <code>getValue()</code> trả gì khi thay thế?</td></tr>
</tbody>
</table>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): servlet listener vẫn chạy ở đó (<code>@WebListener</code> + <code>@ServletComponentScan</code>, hoặc <code>ServletListenerRegistrationBean</code>), nhưng phần lớn việc lúc khởi động chuyển sang sự kiện của chính Spring — một <code>ApplicationRunner</code> hoặc <code>@EventListener(ApplicationReadyEvent.class)</code> để nạp dữ liệu một lần. API của LabFlow dùng JWT thì không giữ <code>HttpSession</code> nào, nên "người đang online" ở đó nghĩa là "token được dùng trong vài phút gần đây", tính từ CSDL, không phải từ sự kiện session.</div>`],
    ]),
    bi(`<h2>📌 What to take away from slides 1–18</h2>
<ul>
<li>An event is what happened; a listener is the object the container calls about it. You register listeners; you never call them.</li>
<li>2 levels × 2 categories: <code>ServletContextListener</code>, <code>ServletContextAttributeListener</code>, <code>HttpSessionListener</code>, <code>HttpSessionAttributeListener</code> (+ request-level listeners, + <code>HttpSessionBindingListener</code>). No response listener exists.</li>
<li>Declare with <code>&lt;listener&gt;&lt;listener-class&gt;</code> (no mapping) or <code>@WebListener</code>; start-up in declaration order, shutdown in reverse.</li>
<li><code>contextInitialized</code>: open the pool / load shared data, before any request; an exception there stops the app. <code>contextDestroyed</code>: close what you opened.</li>
<li><code>sessionDestroyed</code> fires on <code>invalidate()</code>, on timeout and on undeploy — before attributes are removed. JSPs create sessions unless <code>session="false"</code>.</li>
<li>Listeners run on many threads: use atomic or concurrent collections for shared counters and lists.</li>
</ul>`,
    `<h2>📌 Cần mang theo gì từ slide 1–18</h2>
<ul>
<li>Sự kiện là chuyện đã xảy ra; listener là đối tượng được container gọi để báo về chuyện đó. Bạn đăng ký listener; bạn không bao giờ gọi nó.</li>
<li>2 cấp × 2 loại: <code>ServletContextListener</code>, <code>ServletContextAttributeListener</code>, <code>HttpSessionListener</code>, <code>HttpSessionAttributeListener</code> (+ listener cấp request, + <code>HttpSessionBindingListener</code>). Không có listener cho response.</li>
<li>Khai bằng <code>&lt;listener&gt;&lt;listener-class&gt;</code> (không có mapping) hoặc <code>@WebListener</code>; khởi động theo thứ tự khai, tắt theo thứ tự ngược lại.</li>
<li><code>contextInitialized</code>: mở pool / nạp dữ liệu dùng chung, trước mọi request; ném exception ở đó là ứng dụng không chạy. <code>contextDestroyed</code>: đóng những gì đã mở.</li>
<li><code>sessionDestroyed</code> được gọi khi <code>invalidate()</code>, khi hết hạn và khi gỡ ứng dụng — trước khi attribute bị xoá. JSP tự tạo session trừ khi có <code>session="false"</code>.</li>
<li>Listener chạy trên nhiều luồng: dùng kiểu atomic hoặc collection đồng thời cho bộ đếm và danh sách dùng chung.</li>
</ul>`),
    books([
      ['williams', 'Ch.5 "Maintaining State Using Sessions" (the part on detecting session changes with listeners) and Ch.9 (a ServletContextListener used to register filters at start-up)', 'Ch.5 "Maintaining State Using Sessions" (phần phát hiện thay đổi session bằng listener) và Ch.9 (dùng ServletContextListener để đăng ký filter lúc khởi động)'],
      ['servletSpec', 'Ch.11 "Application Lifecycle Events" (event types and listener interfaces, deployment declarations, listener instances and threading, ordering at shutdown)', 'Ch.11 "Application Lifecycle Events" (loại sự kiện và interface listener, khai báo khi triển khai, đối tượng listener và luồng, thứ tự khi tắt)'],
      ['tomcatDocs', "\"JNDI Datasource How-To\" (Tomcat's built-in connection pool, the one used in slide 9)", '"JNDI Datasource How-To" (connection pool có sẵn của Tomcat, đúng loại dùng ở slide 9)'],
    ]),
  ].join('\n'),
};

/* ───────── 8.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Filters & listeners: UTF-8, roles, audit, wrappers, online users ───────── */
const L_on_ch8 = {
  title: '8.3 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Filters & listeners: UTF-8, roles, audit, wrappers, online users|||8.3 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Filter & listener: UTF-8, phân quyền, nhật ký, wrapper, online',
  slug: 'prj301-on-ch8',
  type: 'VIDEO',
  description: '7 bài tập Chương 8 có lời giải chạy thật trên Tomcat 10.1: filter mã hoá UTF-8 (thấy "Cường" vỡ chữ rồi được sửa), lỗi vòng lặp chuyển hướng khi filter canh chính trang đăng nhập, filter phân quyền theo vai trò đúng yêu cầu 1.9 của Assignment (đăng nhập từ SQL Server bằng PreparedStatement, chặn SQL injection, redirect khi chưa đăng nhập, 403 khi sai vai trò, chặn open redirect, đổi session id), filter ghi nhật ký đọc mã trạng thái sau chain.doFilter, response wrapper làm đúng cho cả JSP lẫn file tĩnh, listener liệt kê người đang đăng nhập, listener nạp danh mục từ CSDL một lần lúc khởi động; 16 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.3 · Practice &amp; review</span>
<h2>Filters and listeners for real — seven exercises, one of them is Assignment requirement 1.9</h2>
<p class="lead">Lessons 8.A and 8.B ran the school's examples. Now you use filters and listeners the way a real PRJ301 project does: one filter fixes Vietnamese text for the whole site, one filter decides who may open which page (the Assignment asks for exactly this), one filter writes an audit line, a wrapper adds a footer to every page, and two listeners keep application-wide information — who is logged in, and data loaded once from SQL Server. Every solution ran on Tomcat 10.1; the real responses and console lines are shown under each.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>From</th></tr></thead>
<tbody>
<tr><td>1</td><td>encoding filter with an init-param</td><td>8.A slides 4, 13</td></tr>
<tr><td>2</td><td>find the bug: a login filter that guards its own login page</td><td>8.A slide 15</td></tr>
<tr><td>3</td><td>⭐ role-based authorization filter + login from SQL Server (Assignment 1.9)</td><td>8.A slides 9, 15 + Ch.5 + Ch.4</td></tr>
<tr><td>4</td><td>audit filter: code after chain.doFilter, and exceptions</td><td>8.A slide 14</td></tr>
<tr><td>5</td><td>a response wrapper that works for JSP and static files</td><td>8.A slides 16–20</td></tr>
<tr><td>6</td><td>who is logged in: HttpSessionAttributeListener</td><td>8.B slides 16–17</td></tr>
<tr><td>7</td><td>load data once at start-up: ServletContextListener + JSTL</td><td>8.B slides 9, 14 + Ch.3</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 8 · Bài 8.3 · Thực hành &amp; ôn tập</span>
<h2>Filter và listener thật sự — bảy bài tập, trong đó có yêu cầu 1.9 của Assignment</h2>
<p class="lead">Bài 8.A và 8.B đã chạy các ví dụ của trường. Giờ bạn dùng filter và listener đúng như một dự án PRJ301 thật: một filter sửa tiếng Việt cho cả site, một filter quyết định ai được mở trang nào (Assignment đòi đúng cái này), một filter ghi dòng nhật ký, một wrapper thêm chân trang cho mọi trang, và hai listener giữ thông tin chung của ứng dụng — ai đang đăng nhập, và dữ liệu nạp một lần từ SQL Server. Lời giải nào cũng đã chạy trên Tomcat 10.1; response và các dòng console thật nằm ngay bên dưới.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Từ đâu</th></tr></thead>
<tbody>
<tr><td>1</td><td>filter mã hoá có init-param</td><td>8.A slide 4, 13</td></tr>
<tr><td>2</td><td>tìm lỗi: filter đăng nhập canh luôn chính trang đăng nhập</td><td>8.A slide 15</td></tr>
<tr><td>3</td><td>⭐ filter phân quyền theo vai trò + đăng nhập từ SQL Server (Assignment 1.9)</td><td>8.A slide 9, 15 + Ch.5 + Ch.4</td></tr>
<tr><td>4</td><td>filter nhật ký: code sau chain.doFilter, và exception</td><td>8.A slide 14</td></tr>
<tr><td>5</td><td>response wrapper chạy đúng cho JSP và file tĩnh</td><td>8.A slide 16–20</td></tr>
<tr><td>6</td><td>ai đang đăng nhập: HttpSessionAttributeListener</td><td>8.B slide 16–17</td></tr>
<tr><td>7</td><td>nạp dữ liệu một lần lúc khởi động: ServletContextListener + JSTL</td><td>8.B slide 9, 14 + Ch.3</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — One filter for Vietnamese text (~10 min)</h3>
<p>Tomcat 10+ already decodes forms as UTF-8 (its <code>conf/web.xml</code> says so), which hides the problem on your laptop. Lab PCs with Tomcat 9, other servers, and many old PRJ301 projects decode as ISO-8859-1. To see what happens there, this app declares the old default in its own web.xml, then maps an encoding filter to <code>/fixed/*</code> only, so the same servlet can be called with and without the filter. The form sends the name "Cường".</p>
<p class="ghi-chu">📄 <code>ma-hoa-utf8/src/main/webapp/WEB-INF/web.xml</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-xml">&lt;!-- Pretend to be an OLD server: Tomcat ≤ 9 decodes form data as ISO-8859-1 by default --&gt;
&lt;request-character-encoding&gt;ISO-8859-1&lt;/request-character-encoding&gt;
&lt;response-character-encoding&gt;ISO-8859-1&lt;/response-character-encoding&gt;</code></pre>
<p class="ghi-chu">📄 <code>ma-hoa-utf8/src/main/java/demo/EncodingFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
        throws IOException, ServletException {
    req.setCharacterEncoding(encoding);     // how to DECODE the form body — must run before the first getParameter
    resp.setCharacterEncoding(encoding);    // how to ENCODE what the servlet writes
    chain.doFilter(req, resp);
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ma-hoa-utf8/plain/echo HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

name=C%C6%B0%E1%BB%9Dng</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=ISO-8859-1
Content-Length: 58

request decoded as ISO-8859-1 ? name = CÆ°á»ng (8 chars)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /ma-hoa-utf8/fixed/echo HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

name=C%C6%B0%E1%BB%9Dng</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

request decoded as UTF-8 → name = Cường (5 chars)</code></pre>
<p class="dap-an">✅ Why: the browser sent 7 bytes for "ường" in UTF-8; decoding them as ISO-8859-1 turns each byte into its own character, so "Cường" (5 characters) became 8 — one of them invisible. Even the arrow "→" in the servlet's text became "?" because ISO-8859-1 has no such character. The filter fixes both directions in one place: <code>setCharacterEncoding</code> on the request <strong>before anyone calls getParameter</strong> (after that it is ignored), and on the response before anyone calls <code>getWriter</code>. Map it to <code>/*</code> and declare it <em>first</em> in web.xml so it runs before any other filter reads a parameter. The encoding comes from an <code>&lt;init-param&gt;</code> (8.A slide 13).</p>`,
    `<h3>🧪 Bài 1 — Một filter cho chữ tiếng Việt (~10 phút)</h3>
<p>Tomcat 10+ vốn đã giải mã form bằng UTF-8 (<code>conf/web.xml</code> của nó ghi vậy), nên vấn đề bị che mất trên máy bạn. Máy phòng lab dùng Tomcat 9, server khác, và rất nhiều project PRJ301 cũ giải mã bằng ISO-8859-1. Để thấy chuyện gì xảy ra ở đó, app này tự khai mặc định cũ trong web.xml của nó, rồi ánh xạ một filter mã hoá chỉ vào <code>/fixed/*</code>, để gọi được cùng một servlet khi có và không có filter. Form gửi tên "Cường".</p>
<p class="ghi-chu">📄 <code>ma-hoa-utf8/src/main/webapp/WEB-INF/web.xml</code> (trích)</p>
<pre class="web-src trich"><code class="language-xml">&lt;!-- Giả làm server CŨ: Tomcat ≤ 9 mặc định giải mã dữ liệu form bằng ISO-8859-1 --&gt;
&lt;request-character-encoding&gt;ISO-8859-1&lt;/request-character-encoding&gt;
&lt;response-character-encoding&gt;ISO-8859-1&lt;/response-character-encoding&gt;</code></pre>
<p class="ghi-chu">📄 <code>ma-hoa-utf8/src/main/java/demo/EncodingFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
        throws IOException, ServletException {
    req.setCharacterEncoding(encoding);     // cách GIẢI MÃ body form — phải chạy trước getParameter đầu tiên
    resp.setCharacterEncoding(encoding);    // cách MÃ HOÁ thứ servlet viết ra
    chain.doFilter(req, resp);
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ma-hoa-utf8/plain/echo HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

name=C%C6%B0%E1%BB%9Dng</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=ISO-8859-1
Content-Length: 58

request decoded as ISO-8859-1 ? name = CÆ°á»ng (8 chars)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /ma-hoa-utf8/fixed/echo HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

name=C%C6%B0%E1%BB%9Dng</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

request decoded as UTF-8 → name = Cường (5 chars)</code></pre>
<p class="dap-an">✅ Vì sao: trình duyệt gửi 7 byte cho "ường" theo UTF-8; giải mã chúng bằng ISO-8859-1 thì mỗi byte thành một ký tự riêng, nên "Cường" (5 ký tự) thành 8 — trong đó có một ký tự vô hình. Ngay cả mũi tên "→" trong chữ của servlet cũng thành "?" vì ISO-8859-1 không có ký tự đó. Filter sửa cả hai chiều ở một chỗ: <code>setCharacterEncoding</code> cho request <strong>trước khi ai đó gọi getParameter</strong> (gọi sau thì bị lờ đi), và cho response trước khi ai đó gọi <code>getWriter</code>. Hãy ánh xạ nó vào <code>/*</code> và khai nó <em>đầu tiên</em> trong web.xml để nó chạy trước mọi filter khác đọc tham số. Bảng mã lấy từ một <code>&lt;init-param&gt;</code> (8.A slide 13).</p>`),
    bi(`<h3>🧪 Exercise 2 — Find the bug before the browser does (~10 min)</h3>
<p>A first attempt at "only logged-in users": a filter on <code>/*</code> that redirects anyone without an account in the session to <code>login.html</code>. Read the code, predict what the browser does when a guest opens <code>/home.html</code>, then check the three real requests.</p>
<p class="ghi-chu">📄 <code>vong-lap/src/main/java/demo/LoginRequiredFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    HttpSession session = req.getSession(false);
    if (session == null || session.getAttribute("account") == null) {
        System.out.println("LoginRequiredFilter: " + req.getServletPath() + " → redirect to login.html");
        resp.sendRedirect(req.getContextPath() + "/login.html");
        return;
    }
    chain.doFilter(request, response);
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /vong-lap/home.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /vong-lap/login.html
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">LoginRequiredFilter: /home.html → redirect to login.html</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /vong-lap/login.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /vong-lap/login.html
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">LoginRequiredFilter: /login.html → redirect to login.html</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /vong-lap/login.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /vong-lap/login.html
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">LoginRequiredFilter: /login.html → redirect to login.html</div>
<p class="dap-an">✅ The filter guards <code>/*</code> — which includes <code>login.html</code> itself, and the form's target <code>login</code>. A guest is redirected to the login page, the login page is a new request without an account, so it is redirected to the login page, forever. Chrome and Firefox give up after 20 redirects with "ERR_TOO_MANY_REDIRECTS" / "The page isn't redirecting properly". The fix is a <strong>public list</strong> checked first: the login page, the login servlet, CSS/JS/images (otherwise the login page has no styles) — exactly what exercise 3 does. Mapping the filter to <code>/admin/*</code> only also avoids the loop, but then every new protected area needs a new mapping.</p>`,
    `<h3>🧪 Bài 2 — Tìm lỗi trước khi trình duyệt tìm ra (~10 phút)</h3>
<p>Lần thử đầu cho "chỉ người đã đăng nhập": một filter trên <code>/*</code> chuyển hướng bất kỳ ai không có account trong session sang <code>login.html</code>. Đọc code, đoán trình duyệt làm gì khi một khách mở <code>/home.html</code>, rồi kiểm tra bằng ba request thật.</p>
<p class="ghi-chu">📄 <code>vong-lap/src/main/java/demo/LoginRequiredFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    HttpSession session = req.getSession(false);
    if (session == null || session.getAttribute("account") == null) {
        System.out.println("LoginRequiredFilter: " + req.getServletPath() + " → redirect to login.html");
        resp.sendRedirect(req.getContextPath() + "/login.html");
        return;
    }
    chain.doFilter(request, response);
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /vong-lap/home.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /vong-lap/login.html
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">LoginRequiredFilter: /home.html → redirect to login.html</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /vong-lap/login.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /vong-lap/login.html
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">LoginRequiredFilter: /login.html → redirect to login.html</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /vong-lap/login.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /vong-lap/login.html
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">LoginRequiredFilter: /login.html → redirect to login.html</div>
<p class="dap-an">✅ Filter canh <code>/*</code> — bao gồm luôn <code>login.html</code>, và cả đích <code>login</code> của form. Khách bị chuyển tới trang đăng nhập, trang đăng nhập là một request mới không có account, nên lại bị chuyển tới trang đăng nhập, mãi mãi. Chrome và Firefox bỏ cuộc sau 20 lần chuyển hướng với "ERR_TOO_MANY_REDIRECTS" / "The page isn't redirecting properly". Cách sửa là một <strong>danh sách công khai</strong> được kiểm đầu tiên: trang đăng nhập, servlet đăng nhập, CSS/JS/ảnh (không thì trang đăng nhập mất hết giao diện) — đúng như bài 3 làm. Chỉ ánh xạ filter vào <code>/admin/*</code> cũng tránh được vòng lặp, nhưng khi đó mỗi khu vực cần bảo vệ mới lại cần thêm một mapping.</p>`),
    bi(`<h3>🧪 Exercise 3 — ⭐ Authorization by role: Assignment requirement 1.9 (~45 min)</h3>
<p>Build the security of a small clinic app. Accounts with a role live in SQL Server. Rules: <code>/admin/**</code> → ADMIN only; <code>/staff/**</code> → STAFF or ADMIN; any other page → any logged-in user; <code>/login</code> and <code>/css/**</code> → everyone. A guest who opens a protected URL goes to the login page and, after logging in, comes back to that URL. A logged-in user without the right role gets a 403 page. The servlets themselves must contain <strong>no</strong> security check.</p>
<p class="ghi-chu">📄 <code>phan-quyen/setup.sql</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Account (
    username VARCHAR(30)   NOT NULL PRIMARY KEY,
    password VARCHAR(100)  NOT NULL,      -- plain text ONLY for the exercise; real apps store a hash (BCrypt)
    fullName NVARCHAR(100) NOT NULL,
    role     VARCHAR(10)   NOT NULL CHECK (role IN ('ADMIN', 'STAFF', 'CUSTOMER'))
);
INSERT INTO Account (username, password, fullName, role) VALUES
    ('admin',  'Admin@123', N'Quản trị viên', 'ADMIN'),
    ('staff1', 'Staff@123', N'Nhân viên Lan', 'STAFF'),
    ('khach1', 'Khach@123', N'Khách Minh',    'CUSTOMER');</code></pre>
<p class="ghi-chu">📄 <code>phan-quyen/src/main/java/dal/AccountDAO.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">// The account if user + password match, otherwise null.
public Account login(String username, String password) throws SQLException {
    String sql = "SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?";
    try (Connection c = DBContext.getConnection();
         PreparedStatement ps = c.prepareStatement(sql)) {
        ps.setString(1, username);          // typed data is sent as DATA, never glued into the SQL text
        ps.setString(2, password);
        try (ResultSet rs = ps.executeQuery()) {
            return rs.next() ? new Account(rs.getString("username"), rs.getString("fullName"), rs.getString("role")) : null;
        }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phan-quyen/src/main/java/filter/AuthorizationFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    String path = req.getServletPath();                       // "/admin/users", "/css/site.css", "/login"…

    if (isPublic(path)) {                                     // 1. public pages: everyone, no check
        chain.doFilter(request, response);
        return;
    }
    HttpSession session = req.getSession(false);              // never create a session just to check
    Account acc = session == null ? null : (Account) session.getAttribute("account");
    if (acc == null) {                                        // 2. not logged in → REDIRECT to the login page
        String next = req.getRequestURI() + (req.getQueryString() == null ? "" : "?" + req.getQueryString());
        resp.sendRedirect(req.getContextPath() + "/login?next=" + URLEncoder.encode(next, StandardCharsets.UTF_8));
        return;
    }
    if (!allowed(path, acc.getRole())) {                      // 3. logged in, wrong role → 403, FORWARD (the URL stays)
        System.out.println("AuthorizationFilter: " + acc.getUsername() + " (" + acc.getRole() + ") denied " + path);
        resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
        req.getRequestDispatcher("/WEB-INF/views/403.jsp").forward(request, response);
        return;
    }
    chain.doFilter(request, response);                        // 4. allowed
}</code></pre>
<p class="ghi-chu">📄 <code>phan-quyen/src/main/java/filter/AuthorizationFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">private static boolean isPublic(String path) {
    return path.equals("/login") || path.startsWith("/css/");
}

// The role table of the business: /admin/** → ADMIN · /staff/** → STAFF or ADMIN · the rest → any logged-in user.
private static boolean allowed(String path, String role) {
    if (path.startsWith("/admin/")) return role.equals("ADMIN");
    if (path.startsWith("/staff/")) return role.equals("STAFF") || role.equals("ADMIN");
    return true;
}</code></pre>
<p class="ghi-chu">📄 <code>phan-quyen/src/main/java/controller/LoginServlet.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    Account acc;
    try {
        acc = dao.login(req.getParameter("user"), req.getParameter("pass"));
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    if (acc == null) {
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        req.setAttribute("error", "Wrong username or password");
        req.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(req, resp);
        return;
    }
    HttpSession session = req.getSession();
    req.changeSessionId();                                    // new id after login: blocks session fixation
    session.setAttribute("account", acc);
    String next = req.getParameter("next");
    boolean safe = next != null &amp;&amp; next.startsWith(req.getContextPath() + "/") &amp;&amp; !next.startsWith("//");
    resp.sendRedirect(safe ? next : req.getContextPath() + "/home");   // only back INTO this app (no open redirect)
}</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/6ace27652cb602b360d2f347572d7fe5f4dfa83c.svg" alt="The four decisions of the AuthorizationFilter, in order" loading="lazy" /><p class="chu-thich">🧩 The four decisions of the AuthorizationFilter, in order</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title AuthorizationFilter (Assignment 1.9): one place decides who may open which URL
start
:path = req.getServletPath();
if (public? /login, /css/**) then (yes)
  :chain.doFilter;
  stop
endif
:acc = session?.getAttribute("account");
if (acc == null?) then (not logged in)
  :sendRedirect(/login?next=URL)\\n→ 302;
  stop
endif
if (role allowed for this path?) then (no)
  :setStatus(403) + forward 403.jsp\\n(URL stays);
  stop
else (yes)
  :chain.doFilter → servlet;
endif
stop
@enduml</code></pre></details>
<p>Follow one browser, then another, through twelve real requests. A guest asks for the admin page and is sent to login with <code>next</code>; the stylesheet stays public:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/admin/users HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phan-quyen/login?next=%2Fphan-quyen%2Fadmin%2Fusers
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/css/site.css HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/css

body { font-family: system-ui, sans-serif; margin: 2rem; }
.error { color: #b91c1c; }</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/login?next=%2Fphan-quyen%2Fadmin%2Fusers HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/phan-quyen; HttpOnly
Content-Type: text/html;charset=UTF-8
Content-Length: 400

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Login&lt;/title&gt;&lt;link rel="stylesheet" href="css/site.css"&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Login&lt;/h1&gt;

&lt;form method="post" action="login"&gt;
  &lt;input type="hidden" name="next" value="/phan-quyen/admin/users"&gt;
  &lt;input name="user" placeholder="username"&gt; &lt;input type="password" name="pass" placeholder="password"&gt;
  &lt;button&gt;Login&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>An SQL-injection attempt (<code>admin'--</code>) fails — the username is a parameter, not SQL text:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phan-quyen/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 28

user=admin%27--&amp;pass=x&amp;next=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 401
Content-Type: text/html;charset=UTF-8
Content-Length: 424

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
Login
Wrong username or password
Login</code></pre>
<p>A STAFF account logs in, is sent back to <code>next</code>, and is refused there (403, URL unchanged); its own area works:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phan-quyen/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 63

user=staff1&amp;pass=Staff%40123&amp;next=%2Fphan-quyen%2Fadmin%2Fusers</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(2); Path=/phan-quyen; HttpOnly
Location: /phan-quyen/admin/users
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/admin/users HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 223

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Not allowed&lt;/h1&gt;
&lt;p&gt;staff1 (STAFF) cannot open this page.&lt;/p&gt;
&lt;p&gt;&lt;a href="/phan-quyen/home"&gt;Back to home&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">AuthorizationFilter: staff1 (STAFF) denied /admin/users</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/staff/orders HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 51

Orders to process today: 3 (seen by staff1, STAFF)</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phan-quyen/login
Content-Length: 0</code></pre>
<p>The ADMIN logs in from the same browser and reads the account list from the database:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phan-quyen/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 33

user=admin&amp;pass=Admin%40123&amp;next=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(3); Path=/phan-quyen; HttpOnly
Location: /phan-quyen/home
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/admin/users HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 395

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Users&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Accounts&lt;/h1&gt;
&lt;table&gt;
  &lt;tr&gt;&lt;th&gt;Username&lt;/th&gt;&lt;th&gt;Full name&lt;/th&gt;&lt;th&gt;Role&lt;/th&gt;&lt;/tr&gt;

  &lt;tr&gt;&lt;td&gt;admin&lt;/td&gt;&lt;td&gt;Quản trị viên&lt;/td&gt;&lt;td&gt;ADMIN&lt;/td&gt;&lt;/tr&gt;

  &lt;tr&gt;&lt;td&gt;khach1&lt;/td&gt;&lt;td&gt;Khách Minh&lt;/td&gt;&lt;td&gt;CUSTOMER&lt;/td&gt;&lt;/tr&gt;

  &lt;tr&gt;&lt;td&gt;staff1&lt;/td&gt;&lt;td&gt;Nhân viên Lan&lt;/td&gt;&lt;td&gt;STAFF&lt;/td&gt;&lt;/tr&gt;

&lt;/table&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>A CUSTOMER clicks a forged link whose <code>next</code> points to another site — the app refuses to send him there — and cannot open the staff area:</p>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">POST /phan-quyen/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 68

user=khach1&amp;pass=Khach%40123&amp;next=https%3A%2F%2Fevil.example%2Fsteal</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(4); Path=/phan-quyen; HttpOnly
Location: /phan-quyen/home
Content-Length: 0</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/staff/orders HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 226

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Not allowed&lt;/h1&gt;
&lt;p&gt;khach1 (CUSTOMER) cannot open this page.&lt;/p&gt;
&lt;p&gt;&lt;a href="/phan-quyen/home"&gt;Back to home&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">AuthorizationFilter: khach1 (CUSTOMER) denied /staff/orders</div>
<p class="dap-an">✅ Why each decision: <strong>(1)</strong> one filter on <code>/*</code> with a <em>public list first</em> (exercise 2) and a <em>role table</em> in one method — adding a page never means editing ten servlets. <strong>(2)</strong> not logged in ⇒ <strong>redirect</strong> (the browser must go to another page, and <code>next</code> remembers where it came from); wrong role ⇒ <strong>403 + forward</strong> (the user is known, the answer is "no", the URL stays — 8.A slide 9). <strong>(3)</strong> <code>getSession(false)</code>: checking must not create sessions for every visitor. <strong>(4)</strong> <code>PreparedStatement</code>: the typed <code>admin'--</code> is compared as a username, so no row matches (with string concatenation it would comment out the password check and log in as admin — Chapter 5). <strong>(5)</strong> <code>changeSessionId()</code> after login: the JSESSIONID changed from "…" to "…(2)" — an id an attacker planted before login is useless after it (session fixation). <strong>(6)</strong> <code>next</code> is accepted only if it starts with this app's context path — otherwise the login page becomes a free "open redirect" for phishing links. <strong>(7)</strong> the 403 page is a JSP under <code>/WEB-INF</code>, unreachable directly, reached by <em>forward</em> — the default REQUEST dispatcher means the filter does not run again on it.</p>
<div class="pitfall">Plain-text passwords are for the exercise only. In the Assignment store a hash (BCrypt, or at least SHA-256 with a salt) and compare hashes. Also: hiding the "Users" link from STAFF in the JSP is not security — the filter is; the 403 above was produced by typing the URL directly.</div>
<div class="callout">🧭 <strong>In Spring Boot / LabFlow</strong> (illustration): the whole filter becomes configuration — <code>http.authorizeHttpRequests(a -&gt; a.requestMatchers("/login", "/css/**").permitAll().requestMatchers("/admin/**").hasRole("ADMIN").requestMatchers("/staff/**").hasAnyRole("STAFF", "ADMIN").anyRequest().authenticated())</code>, with the same four outcomes: pass, redirect to login, 403, pass. Spring Security also changes the session id after login and checks the redirect target for you.</div>`,
    `<h3>🧪 Bài 3 — ⭐ Phân quyền theo vai trò: yêu cầu 1.9 của Assignment (~45 phút)</h3>
<p>Dựng phần bảo mật cho một app phòng khám nhỏ. Tài khoản kèm vai trò nằm trong SQL Server. Luật: <code>/admin/**</code> → chỉ ADMIN; <code>/staff/**</code> → STAFF hoặc ADMIN; mọi trang khác → ai đã đăng nhập cũng được; <code>/login</code> và <code>/css/**</code> → ai cũng vào được. Khách mở một URL được bảo vệ thì bị đưa tới trang đăng nhập và, đăng nhập xong, được đưa về đúng URL đó. Người đã đăng nhập mà sai vai trò thì nhận trang 403. Bản thân các servlet <strong>không</strong> được chứa phép kiểm bảo mật nào.</p>
<p class="ghi-chu">📄 <code>phan-quyen/setup.sql</code> (trích)</p>
<pre class="web-src trich"><code class="language-sql">CREATE TABLE Account (
    username VARCHAR(30)   NOT NULL PRIMARY KEY,
    password VARCHAR(100)  NOT NULL,      -- chữ thường CHỈ cho bài tập; app thật lưu mã băm (BCrypt)
    fullName NVARCHAR(100) NOT NULL,
    role     VARCHAR(10)   NOT NULL CHECK (role IN ('ADMIN', 'STAFF', 'CUSTOMER'))
);
INSERT INTO Account (username, password, fullName, role) VALUES
    ('admin',  'Admin@123', N'Quản trị viên', 'ADMIN'),
    ('staff1', 'Staff@123', N'Nhân viên Lan', 'STAFF'),
    ('khach1', 'Khach@123', N'Khách Minh',    'CUSTOMER');</code></pre>
<p class="ghi-chu">📄 <code>phan-quyen/src/main/java/dal/AccountDAO.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">// Trả tài khoản nếu user + mật khẩu khớp, ngược lại null.
public Account login(String username, String password) throws SQLException {
    String sql = "SELECT username, fullName, role FROM Account WHERE username = ? AND password = ?";
    try (Connection c = DBContext.getConnection();
         PreparedStatement ps = c.prepareStatement(sql)) {
        ps.setString(1, username);          // dữ liệu người gõ được gửi như DỮ LIỆU, không bao giờ dán vào chữ SQL
        ps.setString(2, password);
        try (ResultSet rs = ps.executeQuery()) {
            return rs.next() ? new Account(rs.getString("username"), rs.getString("fullName"), rs.getString("role")) : null;
        }
    }
}</code></pre>
<p class="ghi-chu">📄 <code>phan-quyen/src/main/java/filter/AuthorizationFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    String path = req.getServletPath();                       // "/admin/users", "/css/site.css", "/login"…

    if (isPublic(path)) {                                     // 1. trang công khai: ai cũng vào, không kiểm
        chain.doFilter(request, response);
        return;
    }
    HttpSession session = req.getSession(false);              // không tạo session chỉ để kiểm tra
    Account acc = session == null ? null : (Account) session.getAttribute("account");
    if (acc == null) {                                        // 2. chưa đăng nhập → CHUYỂN HƯỚNG tới trang đăng nhập
        String next = req.getRequestURI() + (req.getQueryString() == null ? "" : "?" + req.getQueryString());
        resp.sendRedirect(req.getContextPath() + "/login?next=" + URLEncoder.encode(next, StandardCharsets.UTF_8));
        return;
    }
    if (!allowed(path, acc.getRole())) {                      // 3. đã đăng nhập, sai vai trò → 403, FORWARD (URL giữ nguyên)
        System.out.println("AuthorizationFilter: " + acc.getUsername() + " (" + acc.getRole() + ") denied " + path);
        resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
        req.getRequestDispatcher("/WEB-INF/views/403.jsp").forward(request, response);
        return;
    }
    chain.doFilter(request, response);                        // 4. được phép
}</code></pre>
<p class="ghi-chu">📄 <code>phan-quyen/src/main/java/filter/AuthorizationFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">private static boolean isPublic(String path) {
    return path.equals("/login") || path.startsWith("/css/");
}

// Bảng vai trò của nghiệp vụ: /admin/** → ADMIN · /staff/** → STAFF hoặc ADMIN · còn lại → ai đã đăng nhập cũng được.
private static boolean allowed(String path, String role) {
    if (path.startsWith("/admin/")) return role.equals("ADMIN");
    if (path.startsWith("/staff/")) return role.equals("STAFF") || role.equals("ADMIN");
    return true;
}</code></pre>
<p class="ghi-chu">📄 <code>phan-quyen/src/main/java/controller/LoginServlet.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    Account acc;
    try {
        acc = dao.login(req.getParameter("user"), req.getParameter("pass"));
    } catch (SQLException e) {
        throw new ServletException(e);
    }
    if (acc == null) {
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        req.setAttribute("error", "Wrong username or password");
        req.getRequestDispatcher("/WEB-INF/views/login.jsp").forward(req, resp);
        return;
    }
    HttpSession session = req.getSession();
    req.changeSessionId();                                    // id mới sau đăng nhập: chặn session fixation
    session.setAttribute("account", acc);
    String next = req.getParameter("next");
    boolean safe = next != null &amp;&amp; next.startsWith(req.getContextPath() + "/") &amp;&amp; !next.startsWith("//");
    resp.sendRedirect(safe ? next : req.getContextPath() + "/home");   // chỉ quay lại TRONG app này (không open redirect)
}</code></pre>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRJ301/uml/6ace27652cb602b360d2f347572d7fe5f4dfa83c.svg" alt="Bốn quyết định của AuthorizationFilter, theo thứ tự" loading="lazy" /><p class="chu-thich">🧩 Bốn quyết định của AuthorizationFilter, theo thứ tự</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title AuthorizationFilter (Assignment 1.9): one place decides who may open which URL
start
:path = req.getServletPath();
if (public? /login, /css/**) then (yes)
  :chain.doFilter;
  stop
endif
:acc = session?.getAttribute("account");
if (acc == null?) then (not logged in)
  :sendRedirect(/login?next=URL)\\n→ 302;
  stop
endif
if (role allowed for this path?) then (no)
  :setStatus(403) + forward 403.jsp\\n(URL stays);
  stop
else (yes)
  :chain.doFilter → servlet;
endif
stop
@enduml</code></pre></details>
<p>Theo một trình duyệt, rồi một trình duyệt khác, qua mười hai request thật. Khách xin trang admin và bị đưa tới đăng nhập kèm <code>next</code>; file CSS vẫn công khai:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/admin/users HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phan-quyen/login?next=%2Fphan-quyen%2Fadmin%2Fusers
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/css/site.css HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/css

body { font-family: system-ui, sans-serif; margin: 2rem; }
.error { color: #b91c1c; }</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/login?next=%2Fphan-quyen%2Fadmin%2Fusers HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/phan-quyen; HttpOnly
Content-Type: text/html;charset=UTF-8
Content-Length: 400

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Login&lt;/title&gt;&lt;link rel="stylesheet" href="css/site.css"&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Login&lt;/h1&gt;

&lt;form method="post" action="login"&gt;
  &lt;input type="hidden" name="next" value="/phan-quyen/admin/users"&gt;
  &lt;input name="user" placeholder="username"&gt; &lt;input type="password" name="pass" placeholder="password"&gt;
  &lt;button&gt;Login&lt;/button&gt;
&lt;/form&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>Một lần thử SQL injection (<code>admin'--</code>) thất bại — tên đăng nhập là tham số, không phải chữ SQL:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phan-quyen/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 28

user=admin%27--&amp;pass=x&amp;next=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 401
Content-Type: text/html;charset=UTF-8
Content-Length: 424

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
Login
Wrong username or password
Login</code></pre>
<p>Tài khoản STAFF đăng nhập, được đưa về <code>next</code>, và bị từ chối ở đó (403, URL giữ nguyên); khu vực của chính nó thì vào được:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phan-quyen/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…
Content-Length: 63

user=staff1&amp;pass=Staff%40123&amp;next=%2Fphan-quyen%2Fadmin%2Fusers</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(2); Path=/phan-quyen; HttpOnly
Location: /phan-quyen/admin/users
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/admin/users HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 223

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Not allowed&lt;/h1&gt;
&lt;p&gt;staff1 (STAFF) cannot open this page.&lt;/p&gt;
&lt;p&gt;&lt;a href="/phan-quyen/home"&gt;Back to home&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">AuthorizationFilter: staff1 (STAFF) denied /admin/users</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/staff/orders HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 51

Orders to process today: 3 (seen by staff1, STAFF)</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(2)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /phan-quyen/login
Content-Length: 0</code></pre>
<p>ADMIN đăng nhập trên cùng trình duyệt và đọc danh sách tài khoản từ CSDL:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phan-quyen/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Cookie: JSESSIONID=…(2)
Content-Length: 33

user=admin&amp;pass=Admin%40123&amp;next=</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(3); Path=/phan-quyen; HttpOnly
Location: /phan-quyen/home
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/admin/users HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 395

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Users&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Accounts&lt;/h1&gt;
&lt;table&gt;
  &lt;tr&gt;&lt;th&gt;Username&lt;/th&gt;&lt;th&gt;Full name&lt;/th&gt;&lt;th&gt;Role&lt;/th&gt;&lt;/tr&gt;

  &lt;tr&gt;&lt;td&gt;admin&lt;/td&gt;&lt;td&gt;Quản trị viên&lt;/td&gt;&lt;td&gt;ADMIN&lt;/td&gt;&lt;/tr&gt;

  &lt;tr&gt;&lt;td&gt;khach1&lt;/td&gt;&lt;td&gt;Khách Minh&lt;/td&gt;&lt;td&gt;CUSTOMER&lt;/td&gt;&lt;/tr&gt;

  &lt;tr&gt;&lt;td&gt;staff1&lt;/td&gt;&lt;td&gt;Nhân viên Lan&lt;/td&gt;&lt;td&gt;STAFF&lt;/td&gt;&lt;/tr&gt;

&lt;/table&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>Một CUSTOMER bấm vào đường link giả có <code>next</code> trỏ sang site khác — ứng dụng không đưa anh ta tới đó — và không vào được khu vực nhân viên:</p>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">POST /phan-quyen/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded
Content-Length: 68

user=khach1&amp;pass=Khach%40123&amp;next=https%3A%2F%2Fevil.example%2Fsteal</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Set-Cookie: JSESSIONID=…(4); Path=/phan-quyen; HttpOnly
Location: /phan-quyen/home
Content-Length: 0</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /phan-quyen/staff/orders HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(4)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 403
Content-Type: text/html;charset=UTF-8
Content-Length: 226

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;403 — Not allowed&lt;/h1&gt;
&lt;p&gt;khach1 (CUSTOMER) cannot open this page.&lt;/p&gt;
&lt;p&gt;&lt;a href="/phan-quyen/home"&gt;Back to home&lt;/a&gt;&lt;/p&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">AuthorizationFilter: khach1 (CUSTOMER) denied /staff/orders</div>
<p class="dap-an">✅ Vì sao từng quyết định: <strong>(1)</strong> một filter trên <code>/*</code> với <em>danh sách công khai kiểm trước</em> (bài 2) và <em>bảng vai trò</em> trong một phương thức — thêm trang mới không bao giờ phải sửa mười servlet. <strong>(2)</strong> chưa đăng nhập ⇒ <strong>redirect</strong> (trình duyệt phải sang trang khác, và <code>next</code> nhớ nó đến từ đâu); sai vai trò ⇒ <strong>403 + forward</strong> (biết người dùng là ai rồi, câu trả lời là "không", URL giữ nguyên — 8.A slide 9). <strong>(3)</strong> <code>getSession(false)</code>: việc kiểm tra không được tạo session cho mọi khách ghé qua. <strong>(4)</strong> <code>PreparedStatement</code>: chuỗi <code>admin'--</code> gõ vào được so như một tên đăng nhập, nên không dòng nào khớp (nối chuỗi thì nó biến phần kiểm mật khẩu thành chú thích và đăng nhập được như admin — Chương 5). <strong>(5)</strong> <code>changeSessionId()</code> sau đăng nhập: JSESSIONID đổi từ "…" sang "…(2)" — một id kẻ tấn công cài sẵn trước lúc đăng nhập trở nên vô dụng (session fixation). <strong>(6)</strong> <code>next</code> chỉ được chấp nhận khi bắt đầu bằng context path của chính app — không thì trang đăng nhập thành "open redirect" miễn phí cho link lừa đảo. <strong>(7)</strong> trang 403 là JSP trong <code>/WEB-INF</code>, không vào thẳng được, tới bằng <em>forward</em> — dispatcher mặc định REQUEST nên filter không chạy lại trên nó.</p>
<div class="pitfall">Mật khẩu dạng chữ thường chỉ dùng cho bài tập. Trong Assignment hãy lưu mã băm (BCrypt, hoặc ít nhất SHA-256 có salt) và so mã băm. Thêm nữa: giấu link "Users" khỏi STAFF trong JSP không phải là bảo mật — filter mới là; cái 403 ở trên có được nhờ gõ thẳng URL.</div>
<div class="callout">🧭 <strong>Trong Spring Boot / LabFlow</strong> (ví dụ minh hoạ): cả filter này thành cấu hình — <code>http.authorizeHttpRequests(a -&gt; a.requestMatchers("/login", "/css/**").permitAll().requestMatchers("/admin/**").hasRole("ADMIN").requestMatchers("/staff/**").hasAnyRole("STAFF", "ADMIN").anyRequest().authenticated())</code>, với đúng bốn kết cục: cho qua, chuyển về đăng nhập, 403, cho qua. Spring Security còn tự đổi session id sau đăng nhập và kiểm đích chuyển hướng giùm bạn.</div>`),
    bi(`<h3>🧪 Exercise 4 — An audit filter: what the code after chain.doFilter really sees (~15 min)</h3>
<p>Write one line per request — method, URI, final status — for a page that works, a redirect, a missing page, and a servlet that throws (<code>?qty=abc</code>). Predict the four lines first.</p>
<p class="ghi-chu">📄 <code>nhat-ky-truy-cap/src/main/java/demo/AuditFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    String line = req.getMethod() + " " + req.getRequestURI();
    try {
        chain.doFilter(request, response);                      // everything downstream runs inside this call
        System.out.println("AUDIT " + line + " → " + resp.getStatus());
    } catch (IOException | ServletException | RuntimeException e) {
        System.out.println("AUDIT " + line + " → exception " + e.getClass().getSimpleName()
                + " (status still " + resp.getStatus() + ")");
        throw e;                                                // let Tomcat produce the 500 page
    }
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nhat-ky-truy-cap/products HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

3 products</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">AUDIT GET /nhat-ky-truy-cap/products → 200</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nhat-ky-truy-cap/old-products HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /nhat-ky-truy-cap/products
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">AUDIT GET /nhat-ky-truy-cap/old-products → 302</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nhat-ky-truy-cap/nothing-here HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 785

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message The requested resource [/nhat-ky-truy-cap/nothing-here] is not available
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">AUDIT GET /nhat-ky-truy-cap/nothing-here → 404</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nhat-ky-truy-cap/order?qty=abc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1429

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message For input string: "abc"
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
… (11 more lines / còn 11 dòng)</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">AUDIT GET /nhat-ky-truy-cap/order → exception NumberFormatException (status still 200)</div>
<p class="dap-an">✅ After <code>chain.doFilter</code> returns normally, <code>getStatus()</code> is the final status: 200, 302, and even 404 for a URL no servlet maps (the filter on <code>/*</code> also wraps Tomcat's default servlet). The fourth is the trap: the exception travels <em>up through</em> <code>chain.doFilter</code>, so code after it does not run — without the <code>catch</code> there would be no audit line at all — and at that moment the status is still <strong>200</strong>. Tomcat turns the exception into the 500 page only after the filter has returned. So an audit filter must catch (and rethrow), and record "exception" rather than trusting <code>getStatus()</code>.</p>`,
    `<h3>🧪 Bài 4 — Filter nhật ký: code sau chain.doFilter thật sự thấy gì (~15 phút)</h3>
<p>Ghi một dòng cho mỗi request — method, URI, mã trạng thái cuối — cho một trang chạy tốt, một lần chuyển hướng, một trang không tồn tại, và một servlet ném exception (<code>?qty=abc</code>). Đoán bốn dòng trước.</p>
<p class="ghi-chu">📄 <code>nhat-ky-truy-cap/src/main/java/demo/AuditFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse resp = (HttpServletResponse) response;
    String line = req.getMethod() + " " + req.getRequestURI();
    try {
        chain.doFilter(request, response);                      // mọi thứ phía sau chạy BÊN TRONG lời gọi này
        System.out.println("AUDIT " + line + " → " + resp.getStatus());
    } catch (IOException | ServletException | RuntimeException e) {
        System.out.println("AUDIT " + line + " → exception " + e.getClass().getSimpleName()
                + " (status still " + resp.getStatus() + ")");
        throw e;                                                // để Tomcat tạo trang 500
    }
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nhat-ky-truy-cap/products HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 11

3 products</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">AUDIT GET /nhat-ky-truy-cap/products → 200</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nhat-ky-truy-cap/old-products HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 302
Location: /nhat-ky-truy-cap/products
Content-Length: 0</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">AUDIT GET /nhat-ky-truy-cap/old-products → 302</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nhat-ky-truy-cap/nothing-here HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 404
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 785

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 404 – Not Found
Type Status Report
Message The requested resource [/nhat-ky-truy-cap/nothing-here] is not available
Description The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
Apache Tomcat/10.1.61</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">AUDIT GET /nhat-ky-truy-cap/nothing-here → 404</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nhat-ky-truy-cap/order?qty=abc HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 500
Content-Type: text/html;charset=utf-8
Content-Language: en
Content-Length: 1429

[HTML → text: what the browser shows · chữ trình duyệt hiển thị]
HTTP Status 500 – Internal Server Error
Type Exception Report
Message For input string: "abc"
Description The server encountered an unexpected condition that prevented it from fulfilling the request.
Exception
… (11 more lines / còn 11 dòng)</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">AUDIT GET /nhat-ky-truy-cap/order → exception NumberFormatException (status still 200)</div>
<p class="dap-an">✅ Khi <code>chain.doFilter</code> trả về bình thường, <code>getStatus()</code> là mã cuối cùng: 200, 302, và cả 404 cho URL không servlet nào ánh xạ (filter trên <code>/*</code> bọc luôn default servlet của Tomcat). Cái thứ tư là bẫy: exception đi <em>ngược lên xuyên qua</em> <code>chain.doFilter</code>, nên code đặt sau nó không chạy — không có <code>catch</code> thì không có dòng nhật ký nào — và đúng lúc đó mã trạng thái vẫn là <strong>200</strong>. Tomcat chỉ biến exception thành trang 500 sau khi filter đã trả về. Vì vậy filter nhật ký phải bắt (rồi ném lại), và ghi "exception" chứ đừng tin <code>getStatus()</code>.</p>`),
    bi(`<h3>🧪 Exercise 5 — A response wrapper that does not break (~25 min)</h3>
<p>Add the same footer before <code>&lt;/body&gt;</code> of every HTML page — JSP pages <em>and</em> static <code>.html</code> files — and leave JSON untouched. Slides 16–20's <code>StringWrapper</code> fails here (8.A slide 20: a 500 on the static page). Fix all three holes: capture <code>getOutputStream()</code> as well as <code>getWriter()</code>, stop early flushes from reaching the real response, and send the correct new length.</p>
<p class="ghi-chu">📄 <code>chen-chan-trang/src/main/java/demo/CaptureResponse.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public ServletOutputStream getOutputStream() {
    if (writer != null) throw new IllegalStateException("getWriter() already called");
    if (stream == null) stream = new ServletOutputStream() {
        @Override public void write(int b) { buffer.write(b); }
        @Override public boolean isReady() { return true; }
        @Override public void setWriteListener(WriteListener l) { }
    };
    return stream;
}

@Override
public PrintWriter getWriter() throws IOException {
    if (stream != null) throw new IllegalStateException("getOutputStream() already called");
    if (writer == null) writer = new PrintWriter(new OutputStreamWriter(buffer, getCharacterEncoding()));
    return writer;
}

@Override public void flushBuffer() { if (writer != null) writer.flush(); }   // JSP flushes: keep it in OUR buffer
@Override public void setContentLength(int len) { }                           // the length will change: we set it later
@Override public void setContentLengthLong(long len) { }</code></pre>
<p class="ghi-chu">📄 <code>chen-chan-trang/src/main/java/demo/FooterFilter.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
    HttpServletResponse real = (HttpServletResponse) resp;
    CaptureResponse capture = new CaptureResponse(real);
    chain.doFilter(req, capture);                               // servlet / JSP / static file writes into the buffer
    byte[] body = capture.getBytes();
    String type = capture.getContentType();
    if (type != null &amp;&amp; type.startsWith("text/html")) {          // only HTML pages get a footer
        Charset cs = Charset.forName(capture.getCharacterEncoding());
        String html = new String(body, cs).replace("&lt;/body&gt;", footer + "\\n&lt;/body&gt;");
        body = html.getBytes(cs);
    }
    real.setContentLength(body.length);                         // the NEW length
    real.getOutputStream().write(body);
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /chen-chan-trang/index.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 169

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;title&gt;Clinic&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Phòng khám PRJ301&lt;/h1&gt;
&lt;footer&gt;© 2026 PRJ301 Clinic · Hotline 1900 0000&lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /chen-chan-trang/about.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"117-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 177

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;About&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;About us&lt;/p&gt;
&lt;footer&gt;© 2026 PRJ301 Clinic · Hotline 1900 0000&lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /chen-chan-trang/api/doctors HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: application/json;charset=UTF-8
Content-Length: 27

[{"id":1,"name":"BS. Hà"}]</code></pre>
<p class="dap-an">✅ Why: the JSP writes through <code>getWriter()</code>, the default servlet through <code>getOutputStream()</code> — both now land in one byte buffer, and each refuses to work if the other was used (the same rule as a real response). <code>flushBuffer</code> is overridden because a JSP flushes at the end; passing that to the real response would commit it before the footer is added. <code>setContentLength</code> is swallowed because the servlet's length (the file's size) is wrong after the change; the filter sets the new one. The text is decoded and re-encoded with the response's own charset, so "Phòng khám" and "©" survive. The JSON response is passed through byte for byte because its type is not <code>text/html</code>.</p>`,
    `<h3>🧪 Bài 5 — Một response wrapper không bị vỡ (~25 phút)</h3>
<p>Thêm cùng một chân trang trước <code>&lt;/body&gt;</code> của mọi trang HTML — trang JSP <em>và</em> file <code>.html</code> tĩnh — và để nguyên JSON. <code>StringWrapper</code> của slide 16–20 hỏng ở đây (8.A slide 20: lỗi 500 với trang tĩnh). Vá cả ba lỗ: bắt cả <code>getOutputStream()</code> lẫn <code>getWriter()</code>, chặn lệnh flush sớm đi tới response thật, và gửi đúng độ dài mới.</p>
<p class="ghi-chu">📄 <code>chen-chan-trang/src/main/java/demo/CaptureResponse.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public ServletOutputStream getOutputStream() {
    if (writer != null) throw new IllegalStateException("getWriter() already called");
    if (stream == null) stream = new ServletOutputStream() {
        @Override public void write(int b) { buffer.write(b); }
        @Override public boolean isReady() { return true; }
        @Override public void setWriteListener(WriteListener l) { }
    };
    return stream;
}

@Override
public PrintWriter getWriter() throws IOException {
    if (stream != null) throw new IllegalStateException("getOutputStream() already called");
    if (writer == null) writer = new PrintWriter(new OutputStreamWriter(buffer, getCharacterEncoding()));
    return writer;
}

@Override public void flushBuffer() { if (writer != null) writer.flush(); }   // JSP gọi flush: giữ trong bộ đệm CỦA TA
@Override public void setContentLength(int len) { }                           // độ dài sẽ đổi: ta đặt sau
@Override public void setContentLengthLong(long len) { }</code></pre>
<p class="ghi-chu">📄 <code>chen-chan-trang/src/main/java/demo/FooterFilter.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
    HttpServletResponse real = (HttpServletResponse) resp;
    CaptureResponse capture = new CaptureResponse(real);
    chain.doFilter(req, capture);                               // servlet / JSP / file tĩnh viết vào bộ đệm
    byte[] body = capture.getBytes();
    String type = capture.getContentType();
    if (type != null &amp;&amp; type.startsWith("text/html")) {          // chỉ trang HTML mới có chân trang
        Charset cs = Charset.forName(capture.getCharacterEncoding());
        String html = new String(body, cs).replace("&lt;/body&gt;", footer + "\\n&lt;/body&gt;");
        body = html.getBytes(cs);
    }
    real.setContentLength(body.length);                         // độ dài MỚI
    real.getOutputStream().write(body);
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /chen-chan-trang/index.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 169

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;title&gt;Clinic&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;h1&gt;Phòng khám PRJ301&lt;/h1&gt;
&lt;footer&gt;© 2026 PRJ301 Clinic · Hotline 1900 0000&lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /chen-chan-trang/about.html HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Accept-Ranges: bytes
ETag: W/"117-1767225600000"
Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT
Content-Type: text/html
Content-Length: 177

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;About&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;p&gt;About us&lt;/p&gt;
&lt;footer&gt;© 2026 PRJ301 Clinic · Hotline 1900 0000&lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /chen-chan-trang/api/doctors HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: application/json;charset=UTF-8
Content-Length: 27

[{"id":1,"name":"BS. Hà"}]</code></pre>
<p class="dap-an">✅ Vì sao: JSP viết qua <code>getWriter()</code>, default servlet viết qua <code>getOutputStream()</code> — giờ cả hai cùng đổ vào một bộ đệm byte, và cái này từ chối chạy nếu cái kia đã được dùng (đúng luật của response thật). Phải ghi đè <code>flushBuffer</code> vì JSP gọi flush ở cuối; để lệnh đó tới response thật thì response bị commit trước khi kịp thêm chân trang. <code>setContentLength</code> bị nuốt đi vì độ dài của servlet (kích thước file) sai sau khi sửa; filter tự đặt độ dài mới. Chữ được giải mã và mã hoá lại bằng chính charset của response, nên "Phòng khám" và "©" còn nguyên. Response JSON được chuyển qua nguyên từng byte vì kiểu của nó không phải <code>text/html</code>.</p>`),
    bi(`<h3>🧪 Exercise 6 — Who is logged in right now? (~15 min)</h3>
<p>The admin dashboard wants the names of the users currently logged in — not the number of sessions (8.B slide 16 showed that a guest opening one JSP already counts). A user is "logged in" while the session holds the attribute <code>user</code>. Handle: login, two users at once, the same browser switching account, logout that keeps the session.</p>
<p class="ghi-chu">📄 <code>ai-dang-online/src/main/java/online/WhoIsOnline.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void attributeAdded(HttpSessionBindingEvent e) {                // login
    if (KEY.equals(e.getName())) users(e).add((String) e.getValue());
}

@Override
public void attributeReplaced(HttpSessionBindingEvent e) {             // same browser, another account
    if (!KEY.equals(e.getName())) return;
    users(e).remove((String) e.getValue());                            // for a String value: the OLD one
    users(e).add((String) e.getSession().getAttribute(KEY));           // the new one
}

@Override
public void attributeRemoved(HttpSessionBindingEvent e) {              // logout, invalidate, timeout
    if (KEY.equals(e.getName())) users(e).remove((String) e.getValue());
}</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ai-dang-online/index.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/ai-dang-online; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 56

A guest page (this JSP creates a session) · online: []</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ai-dang-online/login?u=an HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/ai-dang-online; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 13

online: [an]</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ai-dang-online/login?u=binh HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(3); Path=/ai-dang-online; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 19

online: [an, binh]</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ai-dang-online/login?u=chi HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 18

online: [an, chi]</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ai-dang-online/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 13

online: [an]</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /ai-dang-online/who HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 13

online: [an]</code></pre>
<p class="dap-an">✅ Why: listening to the <code>user</code> <em>attribute</em> ignores guests (the JSP visitor has a session but no <code>user</code> — the list stays empty). <code>attributeReplaced</code> handles the account switch: for a String value <code>getValue()</code> is the <strong>old</strong> name (binh), the session already holds the new one (chi). <code>attributeRemoved</code> covers logout, <code>invalidate()</code> and timeout alike, because a dying session removes its attributes (8.B slide 17). The set is a <code>ConcurrentSkipListSet</code>: safe when many threads change it (8.B slide 12) and sorted for display.</p>`,
    `<h3>🧪 Bài 6 — Ai đang đăng nhập lúc này? (~15 phút)</h3>
<p>Trang quản trị muốn tên những người đang đăng nhập — không phải số session (8.B slide 16 cho thấy một khách mở một JSP đã được tính). Một người "đang đăng nhập" khi session giữ attribute <code>user</code>. Xử lý: đăng nhập, hai người cùng lúc, cùng trình duyệt đổi tài khoản, đăng xuất mà vẫn giữ session.</p>
<p class="ghi-chu">📄 <code>ai-dang-online/src/main/java/online/WhoIsOnline.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void attributeAdded(HttpSessionBindingEvent e) {                // đăng nhập
    if (KEY.equals(e.getName())) users(e).add((String) e.getValue());
}

@Override
public void attributeReplaced(HttpSessionBindingEvent e) {             // cùng trình duyệt, tài khoản khác
    if (!KEY.equals(e.getName())) return;
    users(e).remove((String) e.getValue());                            // với giá trị String: giá trị CŨ
    users(e).add((String) e.getSession().getAttribute(KEY));           // giá trị mới
}

@Override
public void attributeRemoved(HttpSessionBindingEvent e) {              // đăng xuất, invalidate, hết hạn
    if (KEY.equals(e.getName())) users(e).remove((String) e.getValue());
}</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ai-dang-online/index.jsp HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…; Path=/ai-dang-online; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 56

A guest page (this JSP creates a session) · online: []</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ai-dang-online/login?u=an HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(2); Path=/ai-dang-online; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 13

online: [an]</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ai-dang-online/login?u=binh HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Set-Cookie: JSESSIONID=…(3); Path=/ai-dang-online; HttpOnly
Content-Type: text/plain;charset=UTF-8
Content-Length: 19

online: [an, binh]</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ai-dang-online/login?u=chi HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 18

online: [an, chi]</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ai-dang-online/logout HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=…(3)</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 13

online: [an]</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /ai-dang-online/who HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/plain;charset=UTF-8
Content-Length: 13

online: [an]</code></pre>
<p class="dap-an">✅ Vì sao: lắng nghe <em>attribute</em> <code>user</code> thì bỏ qua được khách (người xem JSP có session nhưng không có <code>user</code> — danh sách vẫn trống). <code>attributeReplaced</code> xử lý việc đổi tài khoản: với giá trị String, <code>getValue()</code> là tên <strong>cũ</strong> (binh), session thì đã giữ tên mới (chi). <code>attributeRemoved</code> phủ cả đăng xuất, <code>invalidate()</code> lẫn hết hạn, vì session lúc chết sẽ xoá các attribute của nó (8.B slide 17). Tập hợp là <code>ConcurrentSkipListSet</code>: an toàn khi nhiều luồng cùng sửa (8.B slide 12) và có thứ tự sẵn để hiển thị.</p>`),
    bi(`<h3>🧪 Exercise 7 — Load the menu once, show it on every page (~20 min)</h3>
<p>Every page of the clinic shows the list of specialties from SQL Server. Querying it on every request is wasteful; it changes perhaps once a month. Load it once when the app starts, keep it in application scope, and print it on two different pages with JSTL.</p>
<p class="ghi-chu">📄 <code>nap-danh-muc/src/main/java/listener/StartupListener.java</code> (excerpt)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void contextInitialized(ServletContextEvent sce) {
    try {
        List&lt;Specialty&gt; list = new SpecialtyDAO().findAll();             // ONE query, at deployment
        sce.getServletContext().setAttribute("specialties", List.copyOf(list));   // read-only copy: safe to share
        System.out.println("StartupListener: loaded " + list.size() + " specialties into application scope");
    } catch (SQLException e) {
        throw new IllegalStateException("cannot load specialties", e);   // fail the deployment loudly
    }
}</code></pre>
<p class="ghi-chu">📄 <code>nap-danh-muc/src/main/webapp/WEB-INF/views/page.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@ page contentType="text/html;charset=UTF-8" session="false" %&gt;&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;&#36;{title}&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;nav&gt;&lt;c:forEach var="s" items="&#36;{applicationScope.specialties}"&gt;&lt;a href="doctors?specialty=&#36;{s.id}"&gt;&#36;{s.name}&lt;/a&gt; &lt;/c:forEach&gt;&lt;/nav&gt;
&lt;h1&gt;&#36;{title}&lt;/h1&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nap-danh-muc/home HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 311

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Home&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;nav&gt;&lt;a href="doctors?specialty=1"&gt;Nội tổng quát&lt;/a&gt; &lt;a href="doctors?specialty=2"&gt;Nhi&lt;/a&gt; &lt;a href="doctors?specialty=3"&gt;Răng hàm mặt&lt;/a&gt; &lt;a href="doctors?specialty=4"&gt;Da liễu&lt;/a&gt; &lt;/nav&gt;
&lt;h1&gt;Home&lt;/h1&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Tomcat console (System.out) meanwhile:</p>
<div class="out log">StartupListener: loaded 4 specialties into application scope</div>
<p class="nhan">📤 Request sent to Tomcat → 📥 the REAL response Tomcat 10.1 returned</p>
<pre class="http-req"><code class="language-http">GET /nap-danh-muc/booking HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 341

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Book an appointment&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;nav&gt;&lt;a href="doctors?specialty=1"&gt;Nội tổng quát&lt;/a&gt; &lt;a href="doctors?specialty=2"&gt;Nhi&lt;/a&gt; &lt;a href="doctors?specialty=3"&gt;Răng hàm mặt&lt;/a&gt; &lt;a href="doctors?specialty=4"&gt;Da liễu&lt;/a&gt; &lt;/nav&gt;
&lt;h1&gt;Book an appointment&lt;/h1&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="ghi-chu">🛑 Undeploy the application (delete the WAR) — the Tomcat console prints:</p>
<div class="out log">StartupListener: application stopped</div>
<p class="dap-an">✅ Why: the log has exactly one "loaded 4 specialties" line, printed at deployment; the two page requests add nothing — no query. <code>&#36;{applicationScope.specialties}</code> reads the attribute the listener set (Chapter 4: application scope; Chapter 3: <code>c:forEach</code>). <code>List.copyOf</code> stores a read-only list, so no servlet can change the shared menu by accident while another thread reads it. If loading fails, the listener throws and the app does not start — better than a site with an empty menu. To refresh after an admin edits specialties, the admin servlet simply calls <code>setAttribute("specialties", newList)</code> again. The DAO needs <code>Class.forName</code>: without it the first version of this exercise failed with "No suitable driver" (8.B slide 14).</p>`,
    `<h3>🧪 Bài 7 — Nạp menu một lần, hiện ở mọi trang (~20 phút)</h3>
<p>Trang nào của phòng khám cũng hiện danh sách chuyên khoa lấy từ SQL Server. Truy vấn mỗi request là phí; nó có khi một tháng mới đổi một lần. Hãy nạp một lần lúc ứng dụng khởi động, giữ trong phạm vi application, và in nó ở hai trang khác nhau bằng JSTL.</p>
<p class="ghi-chu">📄 <code>nap-danh-muc/src/main/java/listener/StartupListener.java</code> (trích)</p>
<pre class="web-src trich"><code class="language-java">@Override
public void contextInitialized(ServletContextEvent sce) {
    try {
        List&lt;Specialty&gt; list = new SpecialtyDAO().findAll();             // MỘT câu truy vấn, lúc deploy
        sce.getServletContext().setAttribute("specialties", List.copyOf(list));   // bản chỉ-đọc: chia sẻ an toàn
        System.out.println("StartupListener: loaded " + list.size() + " specialties into application scope");
    } catch (SQLException e) {
        throw new IllegalStateException("cannot load specialties", e);   // cho deploy hỏng rõ ràng
    }
}</code></pre>
<p class="ghi-chu">📄 <code>nap-danh-muc/src/main/webapp/WEB-INF/views/page.jsp</code></p>
<pre class="web-src"><code class="language-html">&lt;%@ page contentType="text/html;charset=UTF-8" session="false" %&gt;&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;&#36;{title}&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;nav&gt;&lt;c:forEach var="s" items="&#36;{applicationScope.specialties}"&gt;&lt;a href="doctors?specialty=&#36;{s.id}"&gt;&#36;{s.name}&lt;/a&gt; &lt;/c:forEach&gt;&lt;/nav&gt;
&lt;h1&gt;&#36;{title}&lt;/h1&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nap-danh-muc/home HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 311

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Home&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;nav&gt;&lt;a href="doctors?specialty=1"&gt;Nội tổng quát&lt;/a&gt; &lt;a href="doctors?specialty=2"&gt;Nhi&lt;/a&gt; &lt;a href="doctors?specialty=3"&gt;Răng hàm mặt&lt;/a&gt; &lt;a href="doctors?specialty=4"&gt;Da liễu&lt;/a&gt; &lt;/nav&gt;
&lt;h1&gt;Home&lt;/h1&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="ghi-chu">🖨 Console của Tomcat (System.out) trong lúc xử lý:</p>
<div class="out log">StartupListener: loaded 4 specialties into application scope</div>
<p class="nhan">📤 Request gửi tới Tomcat → 📥 response THẬT Tomcat 10.1 trả về</p>
<pre class="http-req"><code class="language-http">GET /nap-danh-muc/booking HTTP/1.1
Host: localhost:8080</code></pre>
<pre class="http-res"><code class="language-http">HTTP/1.1 200
Content-Type: text/html;charset=UTF-8
Content-Length: 341

&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset="UTF-8"&gt;&lt;title&gt;Book an appointment&lt;/title&gt;&lt;/head&gt;
&lt;body&gt;
&lt;nav&gt;&lt;a href="doctors?specialty=1"&gt;Nội tổng quát&lt;/a&gt; &lt;a href="doctors?specialty=2"&gt;Nhi&lt;/a&gt; &lt;a href="doctors?specialty=3"&gt;Răng hàm mặt&lt;/a&gt; &lt;a href="doctors?specialty=4"&gt;Da liễu&lt;/a&gt; &lt;/nav&gt;
&lt;h1&gt;Book an appointment&lt;/h1&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p class="ghi-chu">🛑 Gỡ ứng dụng khỏi Tomcat (xoá file WAR) — console của Tomcat in ra:</p>
<div class="out log">StartupListener: application stopped</div>
<p class="dap-an">✅ Vì sao: log có đúng một dòng "loaded 4 specialties", in lúc deploy; hai request trang không thêm gì — không truy vấn nào. <code>&#36;{applicationScope.specialties}</code> đọc attribute mà listener đã đặt (Chương 4: phạm vi application; Chương 3: <code>c:forEach</code>). <code>List.copyOf</code> cất một danh sách chỉ-đọc, nên không servlet nào lỡ tay sửa menu dùng chung trong lúc luồng khác đang đọc. Nạp lỗi thì listener ném exception và ứng dụng không khởi động — còn hơn một site có menu trống. Muốn làm mới sau khi admin sửa chuyên khoa, servlet admin chỉ cần gọi lại <code>setAttribute("specialties", newList)</code>. DAO cần <code>Class.forName</code>: thiếu nó, bản đầu của bài này đã hỏng với "No suitable driver" (8.B slide 14).</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>filter</strong></td><td>bộ lọc</td><td>An object the container runs before (and after) the resource a request is mapped to; it can pass, change or stop the request.</td></tr>
<tr><td><strong>filter chain</strong></td><td>chuỗi filter</td><td>The ordered list of filters matching a request, ending with the servlet; each passes on with chain.doFilter.</td></tr>
<tr><td><strong>filter mapping</strong></td><td>ánh xạ filter</td><td>The url-pattern or servlet-name a filter guards; url-pattern mappings run first, in web.xml order.</td></tr>
<tr><td><strong>dispatcher type</strong></td><td>loại điều phối</td><td>How a resource is reached: REQUEST, FORWARD, INCLUDE or ERROR; a mapping without dispatcher covers REQUEST only.</td></tr>
<tr><td><strong>init-param</strong></td><td>tham số khởi tạo</td><td>A name/value given to one filter (or servlet) in web.xml, read with getInitParameter in init.</td></tr>
<tr><td><strong>request wrapper</strong></td><td>lớp bọc request</td><td>A subclass of HttpServletRequestWrapper that changes a few methods (e.g. getParameter) and delegates the rest.</td></tr>
<tr><td><strong>response wrapper</strong></td><td>lớp bọc response</td><td>A subclass of HttpServletResponseWrapper that captures what the servlet writes so a filter can change it.</td></tr>
<tr><td><strong>authentication</strong></td><td>xác thực</td><td>Checking who the user is (login). Missing ⇒ redirect to login (or 401).</td></tr>
<tr><td><strong>authorization</strong></td><td>phân quyền</td><td>Checking what a known user may do (role). Not allowed ⇒ 403.</td></tr>
<tr><td><strong>open redirect</strong></td><td>chuyển hướng mở</td><td>A flaw where a URL parameter can send users to any external site after login.</td></tr>
<tr><td><strong>session fixation</strong></td><td>cố định session</td><td>An attack that plants a session id before login; prevented by changing the id after login.</td></tr>
<tr><td><strong>event listener</strong></td><td>bộ lắng nghe sự kiện</td><td>An object the container calls when the application, a session, a request or an attribute changes.</td></tr>
<tr><td><strong>ServletContextListener</strong></td><td>listener vòng đời ứng dụng</td><td>contextInitialized at deployment (before any request), contextDestroyed at shutdown.</td></tr>
<tr><td><strong>HttpSessionListener</strong></td><td>listener vòng đời session</td><td>sessionCreated when a session is created, sessionDestroyed on invalidate, timeout or undeploy.</td></tr>
<tr><td><strong>attribute listener</strong></td><td>listener attribute</td><td>attributeAdded / attributeReplaced / attributeRemoved for context, session or request attributes.</td></tr>
<tr><td><strong>connection pool</strong></td><td>bể kết nối</td><td>A set of open database connections that requests borrow and return; created once at start-up.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>filter</strong></td><td>bộ lọc</td><td>Đối tượng container chạy trước (và sau) tài nguyên mà request được ánh xạ tới; nó có thể cho qua, sửa hoặc chặn request.</td></tr>
<tr><td><strong>filter chain</strong></td><td>chuỗi filter</td><td>Danh sách có thứ tự các filter khớp với một request, kết thúc ở servlet; mỗi filter chuyển tiếp bằng chain.doFilter.</td></tr>
<tr><td><strong>filter mapping</strong></td><td>ánh xạ filter</td><td>url-pattern hoặc servlet-name mà filter canh giữ; mapping url-pattern chạy trước, theo thứ tự trong web.xml.</td></tr>
<tr><td><strong>dispatcher type</strong></td><td>loại điều phối</td><td>Cách một tài nguyên được gọi tới: REQUEST, FORWARD, INCLUDE hoặc ERROR; mapping không ghi dispatcher chỉ áp dụng cho REQUEST.</td></tr>
<tr><td><strong>init-param</strong></td><td>tham số khởi tạo</td><td>Cặp tên/giá trị cấp cho một filter (hoặc servlet) trong web.xml, đọc bằng getInitParameter trong init.</td></tr>
<tr><td><strong>request wrapper</strong></td><td>lớp bọc request</td><td>Lớp con của HttpServletRequestWrapper đổi vài phương thức (vd getParameter) và chuyển phần còn lại cho request gốc.</td></tr>
<tr><td><strong>response wrapper</strong></td><td>lớp bọc response</td><td>Lớp con của HttpServletResponseWrapper bắt lấy thứ servlet viết ra để filter sửa được.</td></tr>
<tr><td><strong>authentication</strong></td><td>xác thực</td><td>Kiểm tra người dùng là ai (đăng nhập). Chưa có ⇒ chuyển về đăng nhập (hoặc 401).</td></tr>
<tr><td><strong>authorization</strong></td><td>phân quyền</td><td>Kiểm tra người dùng đã biết được phép làm gì (vai trò). Không được phép ⇒ 403.</td></tr>
<tr><td><strong>open redirect</strong></td><td>chuyển hướng mở</td><td>Lỗ hổng khi một tham số URL có thể đưa người dùng tới site bên ngoài bất kỳ sau khi đăng nhập.</td></tr>
<tr><td><strong>session fixation</strong></td><td>cố định session</td><td>Kiểu tấn công cài sẵn session id trước khi đăng nhập; chặn bằng cách đổi id sau khi đăng nhập.</td></tr>
<tr><td><strong>event listener</strong></td><td>bộ lắng nghe sự kiện</td><td>Đối tượng container gọi khi ứng dụng, session, request hoặc attribute thay đổi.</td></tr>
<tr><td><strong>ServletContextListener</strong></td><td>listener vòng đời ứng dụng</td><td>contextInitialized lúc deploy (trước mọi request), contextDestroyed lúc tắt.</td></tr>
<tr><td><strong>HttpSessionListener</strong></td><td>listener vòng đời session</td><td>sessionCreated khi session được tạo, sessionDestroyed khi invalidate, hết hạn hoặc gỡ ứng dụng.</td></tr>
<tr><td><strong>attribute listener</strong></td><td>listener attribute</td><td>attributeAdded / attributeReplaced / attributeRemoved cho attribute của context, session hoặc request.</td></tr>
<tr><td><strong>connection pool</strong></td><td>bể kết nối</td><td>Tập kết nối CSDL mở sẵn mà các request mượn rồi trả; được tạo một lần lúc khởi động.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 8</h2>
<ol>
<li>A filter wraps requests to the resources it is mapped to; <code>chain.doFilter</code> passes on, not calling it stops the request. Block = redirect / sendError / own output, then <code>return</code>.</li>
<li>Filter life: <code>init</code> at deployment, <code>doFilter</code> per request on many threads, <code>destroy</code> at undeploy — no per-request data in fields.</li>
<li>Order: url-pattern mappings in web.xml order, then servlet-name mappings; code after <code>chain.doFilter</code> runs in reverse and sees the final status (but not when an exception passes through).</li>
<li>Default dispatcher is REQUEST: forwards and error pages skip such filters; a redirect is a new request through every filter.</li>
<li>Assignment 1.9 pattern: one filter on <code>/*</code>, public list first, not logged in ⇒ redirect with <code>next</code>, wrong role ⇒ 403; login with <code>PreparedStatement</code>, <code>changeSessionId()</code>, safe <code>next</code>.</li>
<li>Changing a response needs a wrapper that captures both writer and stream, holds back flushes and fixes the length.</li>
<li>Listeners: 2 levels × 2 categories (+ request level, + binding); declared with <code>&lt;listener&gt;</code> or <code>@WebListener</code>; start-up in declaration order, shutdown reversed.</li>
<li><code>contextInitialized</code> for pools and shared data (an exception stops the app); session listeners for online counts — count logged-in users by the user attribute, because JSPs create sessions.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 8</h2>
<ol>
<li>Filter bọc quanh các request tới tài nguyên mà nó ánh xạ; <code>chain.doFilter</code> là cho đi tiếp, không gọi là chặn request. Chặn = redirect / sendError / output tự viết, rồi <code>return</code>.</li>
<li>Vòng đời filter: <code>init</code> lúc deploy, <code>doFilter</code> mỗi request trên nhiều luồng, <code>destroy</code> lúc gỡ — không để dữ liệu từng request trong trường.</li>
<li>Thứ tự: mapping url-pattern theo thứ tự trong web.xml, rồi tới mapping servlet-name; code sau <code>chain.doFilter</code> chạy ngược lại và thấy mã trạng thái cuối (trừ khi có exception đi xuyên qua).</li>
<li>Dispatcher mặc định là REQUEST: forward và trang lỗi bỏ qua các filter đó; redirect là request mới, đi qua mọi filter.</li>
<li>Mẫu cho Assignment 1.9: một filter trên <code>/*</code>, kiểm danh sách công khai trước, chưa đăng nhập ⇒ redirect kèm <code>next</code>, sai vai trò ⇒ 403; đăng nhập bằng <code>PreparedStatement</code>, <code>changeSessionId()</code>, <code>next</code> an toàn.</li>
<li>Sửa response cần wrapper bắt cả writer lẫn stream, giữ lại lệnh flush và sửa độ dài.</li>
<li>Listener: 2 cấp × 2 loại (+ cấp request, + binding); khai bằng <code>&lt;listener&gt;</code> hoặc <code>@WebListener</code>; khởi động theo thứ tự khai, tắt thì ngược lại.</li>
<li><code>contextInitialized</code> cho pool và dữ liệu dùng chung (ném exception là app không chạy); listener session cho số người online — đếm người đăng nhập theo attribute user, vì JSP tự tạo session.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (prj301-quiz-3) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) LoggingFilter is mapped to /* and prints the date, then calls chain.doFilter. A client requests index.jsp. Steps: 1 the filter intercepts the request and logs the date · 2 the server runs the JSP and generates HTML · 3 the final HTML reaches the browser · 4 the request continues to index.jsp · 5 the HTML response comes back through LoggingFilter. Which order is correct?|||(Dạng câu FE) LoggingFilter được ánh xạ vào /* và in ngày giờ, rồi gọi chain.doFilter. Client yêu cầu index.jsp. Các bước: 1 filter chặn request và ghi ngày giờ · 2 server chạy JSP và tạo HTML · 3 HTML cuối cùng tới trình duyệt · 4 request đi tiếp tới index.jsp · 5 response HTML quay lại qua LoggingFilter. Thứ tự nào đúng?',
      options: ['4 → 1 → 2 → 3 → 5|||4 → 1 → 2 → 3 → 5', '1 → 2 → 4 → 5 → 3|||1 → 2 → 4 → 5 → 3', '1 → 4 → 2 → 5 → 3|||1 → 4 → 2 → 5 → 3', '2 → 1 → 4 → 3 → 5|||2 → 1 → 4 → 3 → 5'],
      correctIndex: 2,
      points: 1,
      explanation: 'The filter runs first (1); chain.doFilter passes the request on (4); the JSP runs inside that call (2); when it returns, control is back in the filter (5) — the "TestFilter: back from the servlet" line in lesson 8.A — and only then the response leaves the server (3). The JSP cannot run before the request has passed the filter (B, D), and the filter is always the first to see the request (A).|||Filter chạy trước (1); chain.doFilter chuyển request đi tiếp (4); JSP chạy bên trong lời gọi đó (2); khi nó trả về, quyền điều khiển quay lại filter (5) — dòng "TestFilter: back from the servlet" ở bài 8.A — và chỉ sau đó response mới rời server (3). JSP không thể chạy trước khi request đi qua filter (B, D), và filter luôn là thứ thấy request đầu tiên (A).' },
    { id: 'q2',
      question: 'In web.xml the FIRST <filter-mapping> maps F3 by <servlet-name>S2</servlet-name>; then F1 is mapped to the url-pattern /* and F2 to /s2. Each filter prints its name before chain.doFilter. What does GET /s2 print?|||Trong web.xml, <filter-mapping> ĐẦU TIÊN ánh xạ F3 bằng <servlet-name>S2</servlet-name>; sau đó F1 ánh xạ vào url-pattern /* và F2 vào /s2. Mỗi filter in tên mình trước chain.doFilter. GET /s2 in ra gì?',
      code: `<filter-mapping><filter-name>F3</filter-name><servlet-name>S2</servlet-name></filter-mapping>
<filter-mapping><filter-name>F1</filter-name><url-pattern>/*</url-pattern></filter-mapping>
<filter-mapping><filter-name>F2</filter-name><url-pattern>/s2</url-pattern></filter-mapping>`,
      codeLang: 'xml',
      options: ['F3, F1, F2 — mappings run in the order they are written|||F3, F1, F2 — mapping chạy theo thứ tự viết', 'F1, F2, F3 — url-pattern mappings first (in file order), then servlet-name mappings|||F1, F2, F3 — mapping url-pattern trước (theo thứ tự trong file), rồi tới mapping servlet-name', 'F2, F1, F3 — the most specific url-pattern runs first|||F2, F1, F3 — url-pattern cụ thể nhất chạy trước', 'only F2 — like servlets, only the best matching filter runs|||chỉ F2 — giống servlet, chỉ filter khớp nhất được chạy'],
      correctIndex: 1,
      points: 1,
      explanation: 'Measured in lesson 8.A (app loc-chuoi, slide 5): "S2 reached through: F1 → F2 → F3". The Servlet spec builds the chain from url-pattern mappings in web.xml order, then servlet-name mappings in web.xml order — so F3, written first, runs last. Unlike servlets, ALL matching filters run (D), and specificity does not reorder them (C).|||Đo thật ở bài 8.A (app loc-chuoi, slide 5): "S2 reached through: F1 → F2 → F3". Đặc tả Servlet dựng chuỗi từ các mapping url-pattern theo thứ tự trong web.xml, rồi mới tới các mapping servlet-name theo thứ tự trong web.xml — nên F3, viết đầu tiên, lại chạy cuối. Khác servlet, MỌI filter khớp đều chạy (D), và độ cụ thể không đổi thứ tự (C).' },
    { id: 'q3',
      question: 'An AuthorizationFilter on /* implements Assignment requirement 1.9. A guest opens /admin/users; later a logged-in STAFF user opens /admin/users (ADMIN only). What should the two responses be?|||Một AuthorizationFilter trên /* thực hiện yêu cầu 1.9 của Assignment. Một khách mở /admin/users; sau đó một người dùng STAFF đã đăng nhập mở /admin/users (chỉ dành cho ADMIN). Hai response nên là gì?',
      options: ['guest: 302 redirect to /login?next=…; STAFF: 403 Forbidden|||khách: 302 chuyển về /login?next=…; STAFF: 403 Forbidden', 'guest: 403; STAFF: 302 redirect to /login|||khách: 403; STAFF: 302 chuyển về /login', 'both: 404, so attackers do not learn the page exists|||cả hai: 404, để kẻ tấn công không biết trang tồn tại', 'both: 200 with the page, and the JSP hides the admin table|||cả hai: 200 kèm trang, và JSP giấu bảng admin'],
      correctIndex: 0,
      points: 1,
      explanation: 'Real run of exercise 3 in lesson 8.3: the guest got 302 Location /phan-quyen/login?next=%2Fphan-quyen%2Fadmin%2Fusers (not authenticated ⇒ send to login, remember where); staff1 got 403 with the "Not allowed" page (authenticated but not authorised). B swaps the two cases. D is the classic mistake: hiding in the view is not security — the URL typed directly must be refused by the filter.|||Lần chạy thật bài tập 3 ở bài 8.3: khách nhận 302 Location /phan-quyen/login?next=%2Fphan-quyen%2Fadmin%2Fusers (chưa xác thực ⇒ đưa về đăng nhập, nhớ chỗ cũ); staff1 nhận 403 với trang "Not allowed" (đã xác thực nhưng không có quyền). B đảo ngược hai trường hợp. D là lỗi kinh điển: giấu ở view không phải bảo mật — URL gõ thẳng phải bị filter từ chối.' },
    { id: 'q4',
      question: 'A filter is mapped to *.jsp with no <dispatcher> element. ListServlet (/list) forwards to /WEB-INF/views/list.jsp. When the browser requests /list, does the filter run for list.jsp?|||Một filter được ánh xạ vào *.jsp, không có phần tử <dispatcher>. ListServlet (/list) forward tới /WEB-INF/views/list.jsp. Khi trình duyệt gọi /list, filter có chạy cho list.jsp không?',
      options: ['Yes — every JSP that produces output passes its filters|||Có — JSP nào tạo output cũng đi qua filter của nó', 'Yes, but only if the servlet uses sendRedirect instead of forward|||Có, nhưng chỉ khi servlet dùng sendRedirect thay vì forward', 'No — files under /WEB-INF are never filtered|||Không — file trong /WEB-INF không bao giờ bị lọc', 'No — without <dispatcher> a mapping covers REQUEST only, and a forward is a FORWARD dispatch|||Không — không có <dispatcher> thì mapping chỉ áp dụng cho REQUEST, mà forward là dispatch kiểu FORWARD'],
      correctIndex: 3,
      points: 1,
      explanation: 'Measured in lesson 8.A slide 9 (app loc-dispatcher): for GET /show forwarding to /WEB-INF/views/result.jsp only "AllTypes sees FORWARD" was printed; "RequestOnly" stayed silent. C is wrong: the AllTypes filter did run on that /WEB-INF page. B mixes things up: a redirect makes the browser request a different URL, which cannot be a /WEB-INF page.|||Đo thật ở bài 8.A slide 9 (app loc-dispatcher): với GET /show forward tới /WEB-INF/views/result.jsp chỉ in "AllTypes sees FORWARD"; "RequestOnly" im lặng. C sai: filter AllTypes vẫn chạy trên trang /WEB-INF đó. B lẫn lộn: redirect khiến trình duyệt gọi một URL khác, mà URL đó không thể là trang trong /WEB-INF.' },
    { id: 'q5',
      question: "A DAO builds \"SELECT ... FROM Account WHERE username = '\" + u + \"' AND password = '\" + p + \"'\". A user types admin'-- as username and anything as password. What happens, and what is the fix?|||Một DAO tạo câu \"SELECT ... FROM Account WHERE username = '\" + u + \"' AND password = '\" + p + \"'\". Người dùng gõ admin'-- làm username và mật khẩu bất kỳ. Chuyện gì xảy ra, và sửa thế nào?",
      options: ['The driver rejects the quote; no fix is needed|||Driver từ chối dấu nháy; không cần sửa gì', 'The rest of the query becomes a comment, so the user logs in as admin; use a PreparedStatement with ? and setString|||Phần còn lại của câu thành chú thích, nên người đó đăng nhập được với tư cách admin; dùng PreparedStatement với ? và setString', 'SQL Server throws a syntax error; wrap the call in try/catch|||SQL Server báo lỗi cú pháp; bọc lời gọi trong try/catch', 'Nothing happens because passwords are checked in Java, not in SQL|||Không có gì xảy ra vì mật khẩu được kiểm trong Java, không phải trong SQL'],
      correctIndex: 1,
      points: 1,
      explanation: "The text becomes WHERE username = 'admin'-- ' AND password = '…' — everything after -- is a comment, so only the username is checked (SQL injection, Chapter 5). With a PreparedStatement the typed text is sent as data: exercise 3 of lesson 8.3 sent exactly user=admin'-- and got 401 \"Wrong username or password\". try/catch (C) hides errors, it does not stop injection.|||Câu thành WHERE username = 'admin'-- ' AND password = '…' — mọi thứ sau -- là chú thích, nên chỉ còn kiểm username (SQL injection, Chương 5). Với PreparedStatement, chữ gõ vào được gửi như dữ liệu: bài tập 3 của bài 8.3 gửi đúng user=admin'-- và nhận 401 \"Wrong username or password\". try/catch (C) giấu lỗi, không chặn được injection." },
    { id: 'q6',
      question: "In an MVC login, LoginServlet's doPost checks the password with the DAO. After a SUCCESSFUL login, why should it call response.sendRedirect(\".../home\") rather than forward to home.jsp?|||Trong đăng nhập theo MVC, doPost của LoginServlet kiểm mật khẩu bằng DAO. Sau khi đăng nhập THÀNH CÔNG, vì sao nên gọi response.sendRedirect(\".../home\") thay vì forward tới home.jsp?",
      options: ['forward cannot pass the user object to the JSP|||forward không truyền được đối tượng user sang JSP', 'sendRedirect is faster because it stays on the server|||sendRedirect nhanh hơn vì nó ở lại trên server', 'Post/Redirect/Get: the browser then GETs /home, so F5 does not re-send the POST and the URL shows /home|||Post/Redirect/Get: trình duyệt sau đó GET /home, nên F5 không gửi lại POST và URL hiện /home', 'forward is not allowed inside doPost|||forward không được phép dùng trong doPost'],
      correctIndex: 2,
      points: 1,
      explanation: 'A redirect answers 302 and the browser makes a new GET; refreshing that page repeats a harmless GET, not the password POST ("Confirm Form Resubmission"). The user is already in the session, so nothing needs to be passed (A is false anyway: forward shares request attributes). B is backwards: redirect costs an extra round trip; forward is the one that stays on the server. Forward works fine in doPost (D) — it is how a FAILED login shows the form again with an error.|||Redirect trả 302 và trình duyệt tạo một GET mới; tải lại trang đó chỉ lặp một GET vô hại, không gửi lại POST mật khẩu ("Confirm Form Resubmission"). User đã nằm trong session nên không cần truyền gì (dù sao A cũng sai: forward dùng chung attribute của request). B ngược: redirect tốn thêm một lượt đi về; forward mới là cái ở lại trên server. Forward dùng bình thường trong doPost (D) — đó là cách đăng nhập THẤT BẠI hiện lại form kèm lỗi.' },
    { id: 'q7',
      question: 'An HttpSessionListener counts sessions as "users online". A search-engine bot, never logged in, fetches home.jsp, a JSP without any page directive about sessions. What happens to the counter?|||Một HttpSessionListener đếm session làm "người đang online". Một con bot của công cụ tìm kiếm, chưa từng đăng nhập, tải home.jsp — một JSP không có directive page nào về session. Bộ đếm thế nào?',
      options: ['It goes up by 1, because a JSP creates a session by default|||Tăng 1, vì JSP mặc định tạo session', 'It stays the same, because only getSession() in a servlet creates sessions|||Giữ nguyên, vì chỉ getSession() trong servlet mới tạo session', 'It stays the same, because bots do not send cookies|||Giữ nguyên, vì bot không gửi cookie', 'It goes up only after 30 minutes, when the session times out|||Chỉ tăng sau 30 phút, khi session hết hạn'],
      correctIndex: 0,
      points: 1,
      explanation: 'Measured in lesson 8.B slide 16 (app nghe-dem-online): a new browser fetching home.jsp got Set-Cookie: JSESSIONID and the log printed "sessionCreated → online = 1"; about.jsp with session="false" did not. The generated servlet of a JSP calls getSession() unless session="false". Cookies only matter for the NEXT request (C): the session is created anyway, and a bot that ignores the cookie creates a new one on every fetch.|||Đo thật ở bài 8.B slide 16 (app nghe-dem-online): một trình duyệt mới tải home.jsp nhận Set-Cookie: JSESSIONID và log in "sessionCreated → online = 1"; about.jsp có session="false" thì không. Servlet sinh ra từ JSP gọi getSession() trừ khi có session="false". Cookie chỉ có ý nghĩa ở request SAU (C): session vẫn được tạo, và bot bỏ qua cookie thì mỗi lần tải lại tạo thêm một session mới.' },
    { id: 'q8',
      question: 'web.xml declares two listeners: first ConnectionManager (opens a pool in contextInitialized, closes it in contextDestroyed), then LoggingModule. Each prints a line in both methods. What is printed when the application is undeployed?|||web.xml khai hai listener: trước là ConnectionManager (mở pool trong contextInitialized, đóng trong contextDestroyed), sau là LoggingModule. Mỗi cái in một dòng trong cả hai phương thức. Khi gỡ ứng dụng, cái gì được in ra?',
      options: ['ConnectionManager: pool closed, then LoggingModule: stopping — same order as declared|||ConnectionManager: pool closed, rồi LoggingModule: stopping — đúng thứ tự khai', 'Nothing: contextDestroyed is only called when Tomcat itself shuts down|||Không gì cả: contextDestroyed chỉ được gọi khi chính Tomcat tắt', 'The order is random, because listeners run on different threads|||Thứ tự ngẫu nhiên, vì các listener chạy trên các luồng khác nhau', 'LoggingModule: stopping, then ConnectionManager: pool closed — reverse order|||LoggingModule: stopping, rồi ConnectionManager: pool closed — thứ tự ngược lại'],
      correctIndex: 3,
      points: 1,
      explanation: 'Measured in lesson 8.B (app nghe-khoi-dong): at deployment "MyConnectionManager: pool ready" came before "MyLoggingModule: application started"; at undeploy "MyLoggingModule: application stopping" came before "MyConnectionManager: pool closed". The spec requires contextDestroyed in reverse declaration order, so later listeners can still use what earlier ones created. Undeploy and reload also call it (B).|||Đo thật ở bài 8.B (app nghe-khoi-dong): lúc deploy "MyConnectionManager: pool ready" đứng trước "MyLoggingModule: application started"; lúc gỡ "MyLoggingModule: application stopping" đứng trước "MyConnectionManager: pool closed". Đặc tả đòi contextDestroyed theo thứ tự ngược với lúc khai, để listener khai sau vẫn dùng được thứ listener khai trước đã tạo. Gỡ ứng dụng và nạp lại cũng gọi nó (B).' },
    { id: 'q9',
      question: 'A ServletContextAttributeListener prints event.getValue() in attributeReplaced. The application attribute theme was "dark"; a servlet calls getServletContext().setAttribute("theme", "light"). What does the listener print?|||Một ServletContextAttributeListener in event.getValue() trong attributeReplaced. Attribute theme của application đang là "dark"; một servlet gọi getServletContext().setAttribute("theme", "light"). Listener in ra gì?',
      options: ['light — the value just set|||light — giá trị vừa đặt', 'dark — for a replaced attribute the event carries the OLD value|||dark — với attribute bị thay, sự kiện mang giá trị CŨ', 'null — the old value is already gone|||null — giá trị cũ đã mất', 'Nothing: setAttribute on an existing name fires attributeAdded, not attributeReplaced|||Không gì cả: setAttribute với tên đã có gọi attributeAdded, không phải attributeReplaced'],
      correctIndex: 1,
      points: 1,
      explanation: 'Real log of lesson 8.B slide 15: "context attributeReplaced theme : event.getValue() = dark · context now has light". The Javadoc says it: if the attribute was replaced, getValue() is the old value — the new one is read from the context. Same for a String session attribute (8.B slide 17), which is how exercise 6 of lesson 8.3 swaps the old user name for the new one.|||Log thật của bài 8.B slide 15: "context attributeReplaced theme : event.getValue() = dark · context now has light". Javadoc ghi rõ: nếu attribute bị thay, getValue() là giá trị cũ — giá trị mới thì đọc từ context. Tương tự với attribute String trong session (8.B slide 17), đó là cách bài tập 6 của bài 8.3 đổi tên người dùng cũ sang tên mới.' },
    { id: 'q10',
      question: 'Slide 9 of the listener deck opens "the database connection" in contextInitialized and stores it in the servlet context for all servlets. What is the better version of that idea?|||Slide 9 của deck listener mở "kết nối CSDL" trong contextInitialized và cất vào servlet context cho mọi servlet dùng. Phiên bản tốt hơn của ý tưởng đó là gì?',
      options: ['Open a new Connection in contextInitialized for every request|||Mở một Connection mới trong contextInitialized cho mỗi request', "Store the single Connection in each user's session instead|||Cất Connection duy nhất vào session của từng người dùng", 'Create a connection pool (a DataSource) in contextInitialized, store it in application scope, let each request borrow a connection and close() it, and close the pool in contextDestroyed|||Tạo một connection pool (một DataSource) trong contextInitialized, cất vào phạm vi application, để mỗi request mượn một kết nối rồi close() nó, và đóng pool trong contextDestroyed', 'Keep the single shared Connection but mark doGet as synchronized|||Giữ Connection dùng chung duy nhất nhưng đánh dấu doGet là synchronized'],
      correctIndex: 2,
      points: 1,
      explanation: "One shared Connection serialises every user's queries, mixes their transactions and dies for everyone when the database restarts; synchronized (D) makes the site one-user-at-a-time. contextInitialized runs once, not per request (A). A session-held connection (B) means one open connection per visitor. The app nghe-khoi-dong does C with Tomcat's BasicDataSource — the same thing Spring Boot does with HikariCP.|||Một Connection dùng chung bắt truy vấn của mọi người xếp hàng, trộn lẫn giao dịch của họ và chết với tất cả khi CSDL khởi động lại; synchronized (D) biến site thành mỗi lúc một người dùng. contextInitialized chạy một lần, không phải mỗi request (A). Kết nối giữ trong session (B) nghĩa là mỗi khách một kết nối mở. App nghe-khoi-dong làm đúng C với BasicDataSource của Tomcat — y như Spring Boot làm với HikariCP." },
  ],
};

export default {
  slides: [L_prj10_1, L_prj11_1],
  practice: L_on_ch8,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 5–8 có giải thích song ngữ, nhiều câu dựa trên response và log chạy thật trên Tomcat 10.1: thứ tự xử lý khi có filter ghi log (dạng câu FE), thứ tự chuỗi filter (url-pattern trước servlet-name), filter phân quyền theo vai trò của Assignment (302 khi chưa đăng nhập, 403 khi sai vai trò), dispatcher mặc định REQUEST, SQL injection và PreparedStatement, Post/Redirect/Get trong MVC, JSP tự tạo session làm sai bộ đếm online, thứ tự contextDestroyed, giá trị cũ trong attributeReplaced, connection pool mở trong contextInitialized.',
};
