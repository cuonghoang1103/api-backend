/**
 * API Design — Mục 0: Vì sao thiết kế API quan trọng (soạn chi tiết 31/10/2026, đợt mẫu Mục 0 + Chương 1).
 * Dự án xuyên khoá: LabFlow API (đặt phòng lab / thiết bị) — Node 22 + Express 5, dữ liệu trong RAM tới Ch12.
 * Mọi output trong bài CHẠY THẬT: Node v22.23.3, Express 5.3.0, curl 8.7.1, HTTPie 3.2.4, macOS (31/10/2026).
 * Slide: deck api-00-1 … api-00-5 (scripts/slides-src), giảng EN/VI ở ./giang/.
 * LUẬT: < > trong code → &lt; &gt; ; & → &amp; ; backtick → &#96; ; ${ → \${ ; \" trong output → \\".
 * GIỮ slug cũ (api-0-8-bat-dau-tai-day, api-0-9-bat-dau-khi-khong-co, api-0-1-http, api-0-2-bo-cong-cu) và title chương.
 */
import G001 from './giang/api-00-1.mjs';
import G002 from './giang/api-00-2.mjs';
import G003 from './giang/api-00-3.mjs';
import G004 from './giang/api-00-4.mjs';
import G005 from './giang/api-00-5.mjs';

export default {
  title: 'Section 0 — Why API design matters|||Mục 0 — Vì sao thiết kế API quan trọng',
  description: 'API là hợp đồng giữa các chương trình: lịch sử có nguồn, sự cố thật, cách học không nản, HTTP đọc từng dòng, công cụ gọi API, và dựng khung LabFlow API bằng Node 22 + Express 5.',
  lessons: [
    /* ─────────────────────────── Bắt đầu tại đây (1/2) ─────────────────────────── */
    {
      title: 'Start here (1/2) — What an API is, where it came from, and why designing it well matters to you|||Bắt đầu tại đây (1/2) — API là gì, ra đời thế nào, và vì sao thiết kế nó cho tốt lại quan trọng với bạn',
      slug: 'api-0-8-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'API là hợp đồng; phân biệt API/endpoint/route/resource, REST/RPC/GraphQL/gRPC, HTTP/REST; lịch sử có nguồn; khoá đưa bạn tới đâu với dự án LabFlow.',
      content: `${G001}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>What an API is, where it came from, and why designing it well matters to you</h2>
<p class="lead">Hello, and welcome. You have probably already written an API without calling it that: a route in Express, a servlet in PRJ301, an endpoint your React app calls. This course is about the step after “it works”: making an API that other people — your teammates, a mobile app, a lecturer at demo day, your future self — can use without guessing. We start slowly, with no code at all, and build up to a production-style API you can show in an interview.</p>

<h3>An API in one sentence — then in a restaurant</h3>
<p>An <strong>API</strong> (Application Programming Interface) is a <strong>contract between two programs</strong>: what one program may ask the other, how to ask, what it gets back, and what can go wrong.</p>
<p>In a restaurant you never walk into the kitchen. You read the <em>menu</em>, tell the <em>waiter</em>, and get a dish — or “sorry, sold out today”. The menu plus the waiter are the API. The kitchen can change cooks, ovens or suppliers on any evening; as long as the menu stays the same, no customer notices. That freedom to change the inside without breaking the outside is the main reason APIs exist.</p>
<p>A <strong>Web API</strong> is that contract carried over <strong>HTTP</strong>, the same protocol your browser uses. Here is what one call really looks like — you will produce this exact response yourself in lesson 0.3:</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_2</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 108
ETag: W/"6c-OwUZRHaXfZRYcu/76U3eSP0PivU"
Date: Sat, 31 Oct 2026 15:40:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "lab_2",
  "code": "AL-305",
  "name": "Phòng Lab IoT",
  "building": "Alpha",
  "capacity": 24
}</div>
<p>The first line says <em>it worked</em> (200), the lines after it describe the answer (it is JSON, 108 bytes long), and the part after the empty line is the data itself. Lesson 0.1 reads every one of these lines with you.</p>

<h3>Five words people mix up</h3>
<table>
  <thead><tr><th>Word</th><th>Meaning</th><th>LabFlow example</th></tr></thead>
  <tbody>
    <tr><td><strong>API</strong></td><td>The whole contract: every operation, data format and error</td><td>“the LabFlow API”</td></tr>
    <tr><td><strong>Resource</strong></td><td>A kind of thing the API lets you work with</td><td>a lab, a device, a booking</td></tr>
    <tr><td><strong>Endpoint</strong></td><td>One operation: an HTTP method + a path</td><td><code>POST /bookings</code></td></tr>
    <tr><td><strong>Route</strong></td><td>The server code that handles an endpoint</td><td><code>app.post('/bookings', …)</code></td></tr>
    <tr><td><strong>URL</strong></td><td>The full address of a resource</td><td><code>http://localhost:4000/labs/lab_1</code></td></tr>
  </tbody>
</table>
<p>The distinction that matters most: clients only ever see <strong>endpoints and resources</strong>. <strong>Routes</strong> are implementation. You can split a route file, rename a function or move from Express to Spring Boot, and as long as every endpoint keeps answering the same way, no client breaks. Design the endpoints; write the routes.</p>

<h3>REST, RPC, GraphQL, gRPC — four shapes for the same job</h3>
<table>
  <thead><tr><th>Style</th><th>A call looks like</th><th>Strong at</th><th>Where you meet it</th></tr></thead>
  <tbody>
    <tr><td><strong>REST</strong></td><td><code>GET /labs/lab_1</code></td><td>simple, cacheable, every tool understands it</td><td>most public web APIs, most junior jobs</td></tr>
    <tr><td><strong>RPC</strong></td><td><code>POST /bookLab</code> with <code>{"labId": …}</code></td><td>feels like calling a function</td><td>internal tools, JSON-RPC</td></tr>
    <tr><td><strong>GraphQL</strong></td><td><code>{ lab(id: 1) { name } }</code></td><td>the client picks exactly the fields it needs</td><td>Facebook, GitHub API v4</td></tr>
    <tr><td><strong>gRPC</strong></td><td><code>LabService.GetLab(request)</code></td><td>fast binary messages between services</td><td>microservices inside a company</td></tr>
  </tbody>
</table>
<p>None of them is “the best”. REST organises the API around <em>things</em> (resources) and a small set of standard verbs (HTTP methods). RPC organises it around <em>actions</em>. GraphQL gives the client a query language. gRPC trades readability for speed and strict schemas. This course starts with REST-style JSON over HTTP because it is what you will meet first, and because it forces you to understand HTTP properly — which the other three still rely on. Chapter 7 compares them on the same LabFlow features.</p>

<h3>HTTP is not REST</h3>
<p><strong>HTTP</strong> is a <em>protocol</em>: the rules for writing request and response messages — methods like GET and POST, status codes like 404, headers like <code>Content-Type</code>. Its meaning is defined today in RFC 9110 (2022). <strong>REST</strong> is an <em>architectural style</em> — a way of designing systems around resources, uniform methods and stateless requests — described by Roy Fielding in his 2000 doctoral dissertation at UC Irvine. HTTP is used by REST, by RPC and by GraphQL alike.</p>
<p>When a job advert says “experience with REST APIs”, it almost always means: JSON over HTTP, URLs that name resources, and HTTP methods and status codes used correctly. Purists argue about which APIs are “truly RESTful”; employers care that your API is predictable.</p>

<h3>A short history — with sources</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1976</span><span class="lz-t">RFC 707 — calling procedures on another machine</span><span class="lz-d">James E. White (Stanford Research Institute) describes a “procedure call” model for network resource sharing: the idea behind every RPC and every API.</span></div>
  <div class="lz-step"><span class="lz-k">1991–1996</span><span class="lz-t">HTTP is born, then grows headers and status codes</span><span class="lz-d">Tim Berners-Lee’s first HTTP has one method, GET. HTTP/1.0 (RFC 1945, 1996) adds headers, status codes and POST.</span></div>
  <div class="lz-step"><span class="lz-k">1998–2000</span><span class="lz-t">XML-RPC and SOAP</span><span class="lz-d">XML-RPC (Dave Winer, UserLand Software, with Microsoft, 1998) wraps function calls in XML; it evolves into SOAP (W3C Note, May 2000) with heavy “envelopes”.</span></div>
  <div class="lz-step"><span class="lz-k">2000</span><span class="lz-t">REST gets a name</span><span class="lz-d">Roy Fielding, who co-wrote HTTP/1.1, describes REST in his dissertation “Architectural Styles and the Design of Network-based Software Architectures”.</span></div>
  <div class="lz-step"><span class="lz-k">2011–2016</span><span class="lz-t">The contract becomes a file</span><span class="lz-d">Swagger 1.0 (Tony Tam, Wordnik, 2011) describes a REST API in one document; donated in 2015, it becomes the OpenAPI Specification in 2016.</span></div>
  <div class="lz-step"><span class="lz-k">2015</span><span class="lz-t">GraphQL and gRPC go public</span><span class="lz-d">Facebook, which built GraphQL internally in 2012, publishes the spec in 2015; Google open-sources gRPC, the successor of its internal “Stubby”, the same year.</span></div>
  <div class="lz-step"><span class="lz-k">2019–2023</span><span class="lz-t">Security and standards catch up</span><span class="lz-d">OWASP publishes the API Security Top 10 (2019, updated 2023). RFC 9110 (2022) restates HTTP semantics; RFC 9457 (2023) standardises the JSON shape of API errors.</span></div>
</div>
<p>Notice the direction: from “call a function over there” to “agree on a written, checkable contract”. That is exactly the direction of this course.</p>

<h3>Why APIs were invented</h3>
<p>Three problems kept repeating, and APIs are the answer to all three:</p>
<ul>
  <li><strong>One backend, many clients.</strong> LabFlow will have a web app, maybe a mobile app, an admin screen for lab managers, a script that exports usage reports, perhaps a Zalo or Discord bot. Without an API, each would read the database directly and re-implement the rules — “a room cannot be booked twice”, “only managers may retire a device”. Six copies of the rules means six ways to get them wrong.</li>
  <li><strong>Teams that move at different speeds.</strong> The front-end can build screens against an agreed contract while the back-end is still being written. The contract is the meeting point.</li>
  <li><strong>Hiding the inside.</strong> The database schema, the framework, even the programming language can change; the API stays. The restaurant kitchen again.</li>
</ul>

<h3>Writing endpoints is not the same as designing an API</h3>
<p>Before anyone uses your API, renaming <code>items</code> to <code>data</code> takes two minutes. After the first client ships — and especially after a mobile app is installed on phones that never update — the same rename means changing every client, keeping the old name alive for the old versions, and writing a plan. Every decision you make quietly becomes a <strong>promise</strong>. Designing an API means making those promises on purpose: choosing names, methods, status codes, error formats and limits <em>before</em> they are frozen by someone depending on them.</p>

<div class="pitfall"><p><strong>Trap — “the API is whatever my routes return”.</strong> If the contract is only the code, then every refactor can silently change it: a field disappears because a database column was renamed, an error message changes shape because a library was upgraded. Teams that last write the contract down (Chapter 7, OpenAPI) and test against it.</p></div>

<h3>What this does for you — concretely</h3>
<ul>
  <li><strong>Team projects (SWP391, capstone, LabFlow):</strong> agree on the endpoints and their JSON before splitting the work, and the “I thought it returned an array” arguments disappear.</li>
  <li><strong>Internship and junior interviews:</strong> typical questions are “What is the difference between PUT and PATCH?”, “When do you return 401 and when 403?”, “How do you paginate a large list?”, “How do you stop a payment being charged twice?”, “Design the API for a booking system.” Chapters 1–5 and 11 answer each.</li>
  <li><strong>Backend work:</strong> real tickets are often “add a filter to this list”, “version this endpoint”, “why do we get duplicate orders?” — design questions disguised as coding tasks.</li>
  <li><strong>Security:</strong> most API incidents in the next lesson were design mistakes, not exotic hacks. Knowing the patterns protects your users and your job.</li>
</ul>

<h3>What you will be able to build by the end</h3>
<ul>
  <li>A resource model and URL map for a real domain, with a reason for every method and status code (Chapter 1).</li>
  <li>One error format across the whole API, following RFC 9457, with per-field validation messages (Chapter 2).</li>
  <li>Cursor pagination, filtering and sorting that stay fast on large tables (Chapter 3).</li>
  <li>A versioning and deprecation policy that lets you change the API without breaking apps (Chapter 4).</li>
  <li>Idempotency keys, retries with backoff, rate limits and optimistic locking (Chapter 5).</li>
  <li>Authentication choices, object-level authorisation and the OWASP API Top 10 closed on your own API (Chapter 6).</li>
  <li>An OpenAPI 3.1 contract that generates documentation and checks your responses (Chapter 7).</li>
  <li>The systems view — latency budgets, caching, async jobs, webhooks — and a calm 45-minute answer to an API design interview (Chapters 8–11).</li>
  <li>A production-style LabFlow API as a portfolio piece (Chapter 12).</li>
</ul>

<h3>The project you build: LabFlow</h3>
<p>LabFlow lets students book <strong>lab rooms</strong> and <strong>devices</strong>, and lets <strong>lab managers</strong> approve bookings and keep equipment working. We start with four resources — <code>users</code>, <code>bookings</code>, <code>labs</code>, <code>devices</code> — and add more chapter by chapter (issue reports in the Chapter 1 lab, notifications and webhooks later).</p>
<p>Why LabFlow and not an online shop? Because booking is a better teacher. Double booking gives us <code>409 Conflict</code>. A student pressing “Book” twice on a slow network gives us the idempotency problem. A booking at “8:00” gives us time zones. Approvals give us permissions. And it is a real graduation-project domain, so everything you build is directly reusable.</p>

<h3>The roadmap</h3>
<table>
  <thead><tr><th>Phase</th><th>Chapters</th><th>You can then…</th></tr></thead>
  <tbody>
    <tr><td><strong>1 · The contract</strong></td><td>0 Start · 1 Resources and methods · 2 Errors and validation · 3 Pagination and filtering</td><td>design a clean API for a team project</td></tr>
    <tr><td><strong>2 · Living with clients</strong></td><td>4 Versioning · 5 Idempotency, retries, rate limits · 6 Security · 7 OpenAPI and contracts</td><td>change and secure an API that people depend on</td></tr>
    <tr><td><strong>3 · Systems</strong></td><td>8 Latency and availability · 9 Data at scale · 10 Async and realtime</td><td>reason about load, caching, queues and events</td></tr>
    <tr><td><strong>4 · Prove it</strong></td><td>11 The interview round · 12 Capstone</td><td>show a finished API and explain every decision</td></tr>
  </tbody>
</table>

<h3>What you need before you start</h3>
<ul>
  <li><strong>Needed:</strong> basic JavaScript (variables, functions, objects, arrays, <code>async</code>/<code>await</code> helps), comfort typing commands in a terminal, a computer that can run Node.js 22.</li>
  <li><strong>Not needed:</strong> previous Express experience (lesson 0.3 builds the project from zero), a database (data lives in memory until the capstone), or strong English (every term is explained in Vietnamese).</li>
</ul>

<h3>🧪 Practice (10 min)</h3>
<div class="callout ok"><ol>
  <li>Pick an app you use every week: the school portal, a food-delivery app, a library system.</li>
  <li>Write down five <strong>resources</strong> it must have (nouns: orders, restaurants, books…).</li>
  <li>For three of them, write one <strong>endpoint</strong> each in the form <code>METHOD /path</code> — for example <code>GET /restaurants</code>.</li>
  <li>For one endpoint, write two things that could <strong>go wrong</strong> and how the app should be told.</li>
</ol>
<p><strong>Done when:</strong> you have 5 nouns, 3 endpoints written as method + path, and 2 failure cases. There is no wrong answer yet — lesson 1.1 will show you how to check your own design.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">API</span><span class="v">A contract between two programs: what may be asked, how, what comes back, what can fail.</span></div>
  <div class="kv"><span class="k">Client / server</span><span class="v">The program that sends requests / the program that answers them.</span></div>
  <div class="kv"><span class="k">Resource</span><span class="v">A kind of thing the API exposes: labs, bookings, devices.</span></div>
  <div class="kv"><span class="k">Endpoint</span><span class="v">One operation: method + path, e.g. <code>POST /bookings</code>.</span></div>
  <div class="kv"><span class="k">Route</span><span class="v">Server code that handles an endpoint; invisible to clients.</span></div>
  <div class="kv"><span class="k">REST</span><span class="v">A design style around resources and uniform HTTP methods (Fielding, 2000).</span></div>
  <div class="kv"><span class="k">Contract</span><span class="v">The promises an API makes; changing them can break clients.</span></div>
  <div class="kv"><span class="k">Breaking change</span><span class="v">A change that makes existing clients fail, e.g. renaming a field.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>An API is a contract; a Web API carries it over HTTP.</li>
  <li>Clients see endpoints and resources; routes are implementation you may change freely.</li>
  <li>REST, RPC, GraphQL and gRPC solve the same problem with different shapes; we start with REST over HTTP.</li>
  <li>The history runs from remote calls (1976) to written, checkable contracts (OpenAPI) and security standards (OWASP).</li>
  <li>Decisions are cheap before clients exist and expensive after — designing means choosing them on purpose.</li>
  <li>You will build the LabFlow API, a real booking domain, one chapter at a time.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li>RFC 707, “A High-Level Framework for Network-Based Resource Sharing” (1976): <a href="https://www.rfc-editor.org/rfc/rfc707" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc707</a></li>
  <li>RFC 1945, HTTP/1.0 (1996): <a href="https://www.rfc-editor.org/rfc/rfc1945" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc1945</a> · RFC 9110, HTTP Semantics (2022): <a href="https://www.rfc-editor.org/rfc/rfc9110" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc9110</a></li>
  <li>XML-RPC history: <a href="https://en.wikipedia.org/wiki/XML-RPC" target="_blank" rel="noopener">en.wikipedia.org/wiki/XML-RPC</a></li>
  <li>Roy Fielding’s dissertation (2000): <a href="https://ics.uci.edu/~fielding/pubs/dissertation/top.htm" target="_blank" rel="noopener">ics.uci.edu/~fielding/pubs/dissertation/top.htm</a></li>
  <li>OpenAPI Specification history: <a href="https://en.wikipedia.org/wiki/OpenAPI_Specification" target="_blank" rel="noopener">en.wikipedia.org/wiki/OpenAPI_Specification</a></li>
  <li>GraphQL announcement (2015): <a href="https://graphql.org/blog/2015-09-14-graphql/" target="_blank" rel="noopener">graphql.org/blog/2015-09-14-graphql</a> · gRPC principles: <a href="https://grpc.io/blog/principles/" target="_blank" rel="noopener">grpc.io/blog/principles</a></li>
  <li>OWASP API Security Top 10 (2023): <a href="https://owasp.org/API-Security/editions/2023/en/0x11-t10/" target="_blank" rel="noopener">owasp.org/API-Security</a> · RFC 9457 Problem Details: <a href="https://www.rfc-editor.org/rfc/rfc9457" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc9457</a></li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>API là gì, ra đời thế nào, và vì sao thiết kế nó cho tốt lại quan trọng với bạn</h2>
<p class="lead">Chào bạn. Rất có thể bạn đã từng viết API mà không gọi tên nó: một route trong Express, một servlet ở môn PRJ301, một endpoint mà app React của bạn gọi tới. Khoá này nói về bước <em>sau</em> chữ "chạy được rồi": làm ra một API mà người khác — bạn cùng nhóm, một app di động, thầy cô trong buổi demo, và chính bạn của vài tháng sau — dùng được mà không phải đoán. Ta đi chậm, chưa có dòng code nào, rồi dần dần dựng lên một API kiểu production đủ để mang đi phỏng vấn.</p>

<h3>API trong một câu — rồi trong một nhà hàng</h3>
<p><strong>API</strong> (Application Programming Interface — giao diện lập trình ứng dụng) là <strong>một hợp đồng giữa hai chương trình</strong>: chương trình này được hỏi chương trình kia những gì, hỏi bằng cách nào, nhận lại gì, và chuyện gì có thể hỏng.</p>
<p>Vào nhà hàng, bạn không bao giờ bước vào bếp. Bạn đọc <em>thực đơn</em>, nói với <em>người phục vụ</em>, và nhận món ăn — hoặc câu "xin lỗi, hôm nay hết món này". Thực đơn cộng người phục vụ chính là API. Bếp có thể đổi đầu bếp, đổi lò, đổi nhà cung cấp vào bất kỳ tối nào; miễn thực đơn giữ nguyên thì chẳng khách nào nhận ra. Được tự do thay đổi bên trong mà không làm vỡ bên ngoài — đó là lý do lớn nhất khiến API tồn tại.</p>
<p><strong>Web API</strong> là hợp đồng đó được chở qua <strong>HTTP</strong>, cũng là giao thức trình duyệt của bạn đang dùng. Một lời gọi thật trông như sau — ở bài 0.3 bạn sẽ tự tạo ra đúng response này:</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_2</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 108
ETag: W/"6c-OwUZRHaXfZRYcu/76U3eSP0PivU"
Date: Sat, 31 Oct 2026 15:40:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "lab_2",
  "code": "AL-305",
  "name": "Phòng Lab IoT",
  "building": "Alpha",
  "capacity": 24
}</div>
<p>Dòng đầu nói <em>thành công</em> (200), các dòng tiếp theo mô tả câu trả lời (nó là JSON, dài 108 byte), còn phần sau dòng trống là chính dữ liệu. Bài 0.1 sẽ cùng bạn đọc từng dòng một.</p>

<h3>Năm từ hay bị dùng lẫn</h3>
<table>
  <thead><tr><th>Từ</th><th>Nghĩa</th><th>Ví dụ trong LabFlow</th></tr></thead>
  <tbody>
    <tr><td><strong>API</strong></td><td>Cả bản hợp đồng: mọi thao tác, định dạng dữ liệu, lỗi</td><td>"LabFlow API"</td></tr>
    <tr><td><strong>Resource</strong> (tài nguyên)</td><td>Một loại "thứ" mà API cho bạn làm việc cùng</td><td>một phòng lab, một thiết bị, một lượt đặt</td></tr>
    <tr><td><strong>Endpoint</strong> (điểm cuối)</td><td>Một thao tác: phương thức HTTP + đường dẫn</td><td><code>POST /bookings</code></td></tr>
    <tr><td><strong>Route</strong> (tuyến)</td><td>Đoạn code phía server xử lý một endpoint</td><td><code>app.post('/bookings', …)</code></td></tr>
    <tr><td><strong>URL</strong></td><td>Địa chỉ đầy đủ của một tài nguyên</td><td><code>http://localhost:4000/labs/lab_1</code></td></tr>
  </tbody>
</table>
<p>Điều quan trọng nhất cần phân biệt: client chỉ nhìn thấy <strong>endpoint và resource</strong>. <strong>Route</strong> là chuyện cài đặt bên trong. Bạn có thể tách tệp route, đổi tên hàm, thậm chí chuyển từ Express sang Spring Boot — miễn mọi endpoint vẫn trả lời y như cũ thì không client nào vỡ. Hãy <em>thiết kế</em> endpoint; còn route thì chỉ cần <em>viết</em>.</p>

<h3>REST, RPC, GraphQL, gRPC — bốn hình dạng cho cùng một việc</h3>
<table>
  <thead><tr><th>Kiểu</th><th>Một lời gọi trông như</th><th>Mạnh ở</th><th>Gặp ở đâu</th></tr></thead>
  <tbody>
    <tr><td><strong>REST</strong></td><td><code>GET /labs/lab_1</code></td><td>đơn giản, cache được, công cụ nào cũng hiểu</td><td>đa số API web công khai, đa số việc junior</td></tr>
    <tr><td><strong>RPC</strong></td><td><code>POST /bookLab</code> kèm <code>{"labId": …}</code></td><td>cảm giác như gọi một hàm</td><td>công cụ nội bộ, JSON-RPC</td></tr>
    <tr><td><strong>GraphQL</strong></td><td><code>{ lab(id: 1) { name } }</code></td><td>client tự chọn đúng những trường cần</td><td>Facebook, GitHub API v4</td></tr>
    <tr><td><strong>gRPC</strong></td><td><code>LabService.GetLab(request)</code></td><td>thông điệp nhị phân nhanh giữa các dịch vụ</td><td>microservice bên trong công ty</td></tr>
  </tbody>
</table>
<p>Không kiểu nào là "tốt nhất". REST tổ chức API quanh <em>sự vật</em> (tài nguyên) và một bộ nhỏ động từ chuẩn (các phương thức HTTP). RPC tổ chức quanh <em>hành động</em>. GraphQL trao cho client một ngôn ngữ truy vấn. gRPC đánh đổi sự dễ đọc lấy tốc độ và lược đồ chặt chẽ. Khoá bắt đầu bằng JSON kiểu REST qua HTTP vì đó là thứ bạn gặp đầu tiên khi đi làm, và vì nó buộc bạn hiểu HTTP cho đúng — nền mà ba kiểu kia vẫn dựa vào. Chương 7 so sánh cả bốn trên cùng các tính năng của LabFlow.</p>

<h3>HTTP không phải là REST</h3>
<p><strong>HTTP</strong> là một <em>giao thức</em> (protocol): bộ luật viết thông điệp request và response — phương thức như GET, POST; mã trạng thái như 404; header như <code>Content-Type</code>. Ý nghĩa của nó hiện được định nghĩa trong RFC 9110 (2022). <strong>REST</strong> là một <em>phong cách kiến trúc</em> (architectural style) — cách thiết kế hệ thống xoay quanh tài nguyên, bộ phương thức đồng nhất và request không giữ trạng thái — do Roy Fielding mô tả trong luận án tiến sĩ năm 2000 tại Đại học California, Irvine. REST dùng HTTP, nhưng RPC và GraphQL cũng dùng HTTP.</p>
<p>Khi tin tuyển dụng ghi "có kinh nghiệm REST API", gần như luôn có nghĩa: JSON qua HTTP, URL đặt tên theo tài nguyên, phương thức và mã trạng thái HTTP được dùng đúng. Giới "thuần tuý" hay tranh cãi API nào mới "REST thật"; nhà tuyển dụng thì chỉ cần API của bạn dễ đoán.</p>

<h3>Một chút lịch sử — có nguồn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1976</span><span class="lz-t">RFC 707 — gọi thủ tục trên một máy khác</span><span class="lz-d">James E. White (Viện Nghiên cứu Stanford) mô tả mô hình "gọi thủ tục" để chia sẻ tài nguyên qua mạng: ý tưởng gốc của mọi RPC và mọi API.</span></div>
  <div class="lz-step"><span class="lz-k">1991–1996</span><span class="lz-t">HTTP ra đời, rồi có thêm header và mã trạng thái</span><span class="lz-d">HTTP đầu tiên của Tim Berners-Lee chỉ có một phương thức là GET. HTTP/1.0 (RFC 1945, 1996) thêm header, mã trạng thái và POST.</span></div>
  <div class="lz-step"><span class="lz-k">1998–2000</span><span class="lz-t">XML-RPC và SOAP</span><span class="lz-d">XML-RPC (Dave Winer, UserLand Software, cùng Microsoft, 1998) bọc lời gọi hàm trong XML; nó phát triển thành SOAP (W3C Note, 5/2000) với những "phong bì" XML nặng nề.</span></div>
  <div class="lz-step"><span class="lz-k">2000</span><span class="lz-t">REST có tên gọi</span><span class="lz-d">Roy Fielding, người đồng tác giả HTTP/1.1, mô tả REST trong luận án "Architectural Styles and the Design of Network-based Software Architectures".</span></div>
  <div class="lz-step"><span class="lz-k">2011–2016</span><span class="lz-t">Hợp đồng trở thành một tệp</span><span class="lz-d">Swagger 1.0 (Tony Tam, Wordnik, 2011) mô tả cả một REST API trong một tài liệu; được trao cho cộng đồng năm 2015, nó đổi tên thành OpenAPI Specification năm 2016.</span></div>
  <div class="lz-step"><span class="lz-k">2015</span><span class="lz-t">GraphQL và gRPC công khai</span><span class="lz-d">Facebook — nơi dựng GraphQL nội bộ từ 2012 — công bố đặc tả năm 2015; cùng năm Google mở mã nguồn gRPC, hậu duệ của hệ thống nội bộ "Stubby".</span></div>
  <div class="lz-step"><span class="lz-k">2019–2023</span><span class="lz-t">Bảo mật và chuẩn mực theo kịp</span><span class="lz-d">OWASP công bố API Security Top 10 (2019, cập nhật 2023). RFC 9110 (2022) viết lại ngữ nghĩa HTTP; RFC 9457 (2023) chuẩn hoá hình dạng JSON của lỗi API.</span></div>
</div>
<p>Để ý hướng đi: từ "gọi một hàm ở đằng kia" tới "thống nhất một hợp đồng viết ra giấy và kiểm tra được". Đó cũng chính là hướng đi của khoá học.</p>

<h3>Vì sao người ta phát minh ra API</h3>
<p>Ba vấn đề cứ lặp đi lặp lại, và API là câu trả lời cho cả ba:</p>
<ul>
  <li><strong>Một backend, nhiều client.</strong> LabFlow sẽ có web app, có thể có app di động, màn hình quản trị cho quản lý lab, một script xuất báo cáo sử dụng, biết đâu một bot Zalo hay Discord. Không có API, mỗi bên sẽ tự đọc thẳng cơ sở dữ liệu và tự viết lại luật — "một phòng không được đặt trùng", "chỉ quản lý mới được cho thiết bị nghỉ". Sáu bản sao của luật là sáu cách để sai.</li>
  <li><strong>Các đội làm việc với tốc độ khác nhau.</strong> Front-end có thể dựng màn hình dựa trên hợp đồng đã thống nhất trong khi back-end còn đang viết. Hợp đồng là điểm hẹn.</li>
  <li><strong>Che giấu bên trong.</strong> Lược đồ cơ sở dữ liệu, framework, thậm chí ngôn ngữ lập trình có thể đổi; API thì giữ nguyên. Lại là chuyện cái bếp nhà hàng.</li>
</ul>

<h3>Viết endpoint không giống thiết kế API</h3>
<p>Trước khi có ai dùng API của bạn, đổi <code>items</code> thành <code>data</code> mất hai phút. Sau khi client đầu tiên lên production — nhất là khi một app di động đã nằm trên những chiếc điện thoại không bao giờ cập nhật — cùng việc đổi tên đó nghĩa là sửa mọi client, giữ tên cũ sống tiếp cho các bản cũ, và phải có kế hoạch. Mỗi quyết định của bạn lặng lẽ biến thành một <strong>lời hứa</strong>. Thiết kế API là đưa ra những lời hứa đó một cách có chủ đích: chọn tên, phương thức, mã trạng thái, định dạng lỗi và giới hạn <em>trước khi</em> chúng bị "đóng băng" bởi người đang phụ thuộc vào chúng.</p>

<div class="pitfall"><p><strong>Bẫy — "API là bất cứ thứ gì route của mình trả về".</strong> Nếu hợp đồng chỉ nằm trong code, mọi lần refactor (sửa cấu trúc code) đều có thể âm thầm đổi nó: một trường biến mất vì cột trong cơ sở dữ liệu bị đổi tên, một thông báo lỗi đổi hình dạng vì nâng cấp thư viện. Những đội làm lâu dài đều viết hợp đồng ra (Chương 7, OpenAPI) và kiểm thử theo nó.</p></div>

<h3>Nó giúp gì cho bạn — cụ thể</h3>
<ul>
  <li><strong>Đồ án nhóm (SWP391, capstone, LabFlow):</strong> thống nhất endpoint và JSON của chúng trước khi chia việc, thế là hết cảnh cãi nhau "tưởng nó trả về mảng".</li>
  <li><strong>Thực tập và phỏng vấn junior:</strong> câu hỏi quen thuộc là "PUT khác PATCH thế nào?", "khi nào trả 401, khi nào 403?", "phân trang một danh sách lớn ra sao?", "làm sao để một khoản thanh toán không bị trừ hai lần?", "thiết kế API cho hệ thống đặt lịch". Chương 1–5 và 11 trả lời từng câu.</li>
  <li><strong>Công việc backend:</strong> ticket thật thường là "thêm bộ lọc cho danh sách này", "đánh phiên bản cho endpoint này", "vì sao bị trùng đơn hàng?" — những câu hỏi thiết kế đội lốt việc code.</li>
  <li><strong>Bảo mật:</strong> phần lớn sự cố API ở bài sau là lỗi thiết kế, không phải tấn công gì cao siêu. Nắm được khuôn mẫu là bảo vệ người dùng và cả công việc của bạn.</li>
</ul>

<h3>Học xong bạn tự làm được gì</h3>
<ul>
  <li>Mô hình tài nguyên và bản đồ URL cho một nghiệp vụ thật, có lý do cho từng phương thức và mã trạng thái (Chương 1).</li>
  <li>Một định dạng lỗi duy nhất cho cả API theo RFC 9457, kèm thông báo lỗi theo từng trường (Chương 2).</li>
  <li>Phân trang bằng cursor, lọc và sắp xếp vẫn nhanh trên bảng lớn (Chương 3).</li>
  <li>Chính sách phiên bản và ngừng hỗ trợ giúp đổi API mà không làm vỡ app (Chương 4).</li>
  <li>Idempotency key (khoá chống làm hai lần), retry có lùi dần, rate limit và khoá lạc quan (Chương 5).</li>
  <li>Chọn cách xác thực, phân quyền theo đối tượng, bịt các lỗ trong OWASP API Top 10 trên chính API của bạn (Chương 6).</li>
  <li>Hợp đồng OpenAPI 3.1 sinh ra tài liệu và tự kiểm response (Chương 7).</li>
  <li>Góc nhìn hệ thống — ngân sách độ trễ, cache, việc chạy nền, webhook — và một câu trả lời bình tĩnh 45 phút cho vòng phỏng vấn thiết kế API (Chương 8–11).</li>
  <li>Một LabFlow API kiểu production làm sản phẩm cho portfolio (Chương 12).</li>
</ul>

<h3>Dự án bạn sẽ xây: LabFlow</h3>
<p>LabFlow cho sinh viên đặt <strong>phòng lab</strong> và <strong>thiết bị</strong>, cho <strong>quản lý lab</strong> duyệt lượt đặt và giữ thiết bị hoạt động. Ta bắt đầu với bốn tài nguyên — <code>users</code>, <code>bookings</code>, <code>labs</code>, <code>devices</code> — rồi thêm dần theo từng chương (báo hỏng thiết bị trong lab Chương 1, thông báo và webhook về sau).</p>
<p>Sao lại LabFlow mà không phải cửa hàng online? Vì đặt chỗ là người thầy tốt hơn. Đặt trùng giờ cho ta <code>409 Conflict</code>. Sinh viên bấm "Đặt" hai lần trên mạng chậm cho ta bài toán idempotency. Lượt đặt lúc "8:00" cho ta chuyện múi giờ. Việc duyệt cho ta phân quyền. Và đây là một đề tài đồ án tốt nghiệp có thật, nên mọi thứ bạn làm đều dùng lại được ngay.</p>

<h3>Lộ trình</h3>
<table>
  <thead><tr><th>Giai đoạn</th><th>Các chương</th><th>Xong thì bạn…</th></tr></thead>
  <tbody>
    <tr><td><strong>1 · Hợp đồng</strong></td><td>0 Bắt đầu · 1 Tài nguyên và phương thức · 2 Lỗi và kiểm dữ liệu · 3 Phân trang và lọc</td><td>thiết kế được API gọn gàng cho đồ án nhóm</td></tr>
    <tr><td><strong>2 · Sống chung với client</strong></td><td>4 Phiên bản · 5 Idempotency, retry, rate limit · 6 Bảo mật · 7 OpenAPI và hợp đồng</td><td>thay đổi và bảo vệ một API có người đang dùng</td></tr>
    <tr><td><strong>3 · Hệ thống</strong></td><td>8 Độ trễ và tính sẵn sàng · 9 Dữ liệu lớn dần · 10 Bất đồng bộ và thời gian thực</td><td>suy luận về tải, cache, hàng đợi và sự kiện</td></tr>
    <tr><td><strong>4 · Chứng minh</strong></td><td>11 Vòng phỏng vấn · 12 Dự án cuối khoá</td><td>trình bày một API hoàn chỉnh và giải thích từng quyết định</td></tr>
  </tbody>
</table>

<h3>Cần biết gì trước khi học</h3>
<ul>
  <li><strong>Cần:</strong> JavaScript cơ bản (biến, hàm, object, mảng; biết <code>async</code>/<code>await</code> càng tốt), quen gõ lệnh trên terminal, một máy chạy được Node.js 22.</li>
  <li><strong>Không cần:</strong> đã biết Express (bài 0.3 dựng dự án từ số 0), cơ sở dữ liệu (dữ liệu nằm trong bộ nhớ tới dự án cuối khoá), hay giỏi tiếng Anh (thuật ngữ nào cũng được giải nghĩa tiếng Việt).</li>
</ul>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
  <li>Chọn một ứng dụng bạn dùng hằng tuần: cổng thông tin trường, app giao đồ ăn, hệ thống thư viện.</li>
  <li>Ghi ra năm <strong>tài nguyên</strong> chắc chắn nó phải có (danh từ: đơn hàng, quán ăn, sách…).</li>
  <li>Với ba trong số đó, viết mỗi cái một <strong>endpoint</strong> theo dạng <code>PHƯƠNG_THỨC /đường-dẫn</code> — ví dụ <code>GET /restaurants</code>.</li>
  <li>Với một endpoint, viết hai thứ có thể <strong>hỏng</strong> và app nên được báo như thế nào.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có 5 danh từ, 3 endpoint viết dạng phương thức + đường dẫn, và 2 tình huống lỗi. Chưa có đáp án sai ở đây — bài 1.1 sẽ chỉ bạn cách tự kiểm thiết kế của mình.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">API (giao diện lập trình)</span><span class="v">Hợp đồng giữa hai chương trình: được hỏi gì, hỏi thế nào, nhận lại gì, cái gì có thể hỏng.</span></div>
  <div class="kv"><span class="k">Client / server (bên gọi / máy chủ)</span><span class="v">Chương trình gửi yêu cầu / chương trình trả lời yêu cầu.</span></div>
  <div class="kv"><span class="k">Resource (tài nguyên)</span><span class="v">Một loại "thứ" API cung cấp: phòng lab, lượt đặt, thiết bị.</span></div>
  <div class="kv"><span class="k">Endpoint (điểm cuối)</span><span class="v">Một thao tác: phương thức + đường dẫn, ví dụ <code>POST /bookings</code>.</span></div>
  <div class="kv"><span class="k">Route (tuyến)</span><span class="v">Code phía server xử lý một endpoint; client không nhìn thấy.</span></div>
  <div class="kv"><span class="k">REST</span><span class="v">Phong cách thiết kế quanh tài nguyên và các phương thức HTTP đồng nhất (Fielding, 2000).</span></div>
  <div class="kv"><span class="k">Contract (hợp đồng)</span><span class="v">Những lời hứa của API; đổi chúng có thể làm vỡ client.</span></div>
  <div class="kv"><span class="k">Breaking change (thay đổi phá vỡ)</span><span class="v">Thay đổi khiến client đang chạy bị lỗi, ví dụ đổi tên một trường.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>API là một hợp đồng; Web API chở hợp đồng đó qua HTTP.</li>
  <li>Client thấy endpoint và tài nguyên; route là phần cài đặt bạn được đổi thoải mái.</li>
  <li>REST, RPC, GraphQL, gRPC giải cùng một bài toán bằng các hình dạng khác nhau; ta bắt đầu với REST qua HTTP.</li>
  <li>Lịch sử đi từ gọi thủ tục từ xa (1976) tới hợp đồng viết ra và kiểm được (OpenAPI) cùng chuẩn bảo mật (OWASP).</li>
  <li>Quyết định rẻ khi chưa có client và đắt khi đã có — thiết kế là chọn chúng có chủ đích.</li>
  <li>Bạn sẽ xây LabFlow API, một nghiệp vụ đặt chỗ có thật, từng chương một.</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li>RFC 707, "A High-Level Framework for Network-Based Resource Sharing" (1976): <a href="https://www.rfc-editor.org/rfc/rfc707" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc707</a></li>
  <li>RFC 1945, HTTP/1.0 (1996): <a href="https://www.rfc-editor.org/rfc/rfc1945" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc1945</a> · RFC 9110, ngữ nghĩa HTTP (2022): <a href="https://www.rfc-editor.org/rfc/rfc9110" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc9110</a></li>
  <li>Lịch sử XML-RPC: <a href="https://en.wikipedia.org/wiki/XML-RPC" target="_blank" rel="noopener">en.wikipedia.org/wiki/XML-RPC</a></li>
  <li>Luận án của Roy Fielding (2000): <a href="https://ics.uci.edu/~fielding/pubs/dissertation/top.htm" target="_blank" rel="noopener">ics.uci.edu/~fielding/pubs/dissertation/top.htm</a></li>
  <li>Lịch sử OpenAPI Specification: <a href="https://en.wikipedia.org/wiki/OpenAPI_Specification" target="_blank" rel="noopener">en.wikipedia.org/wiki/OpenAPI_Specification</a></li>
  <li>Thông báo GraphQL (2015): <a href="https://graphql.org/blog/2015-09-14-graphql/" target="_blank" rel="noopener">graphql.org/blog/2015-09-14-graphql</a> · Nguyên tắc gRPC: <a href="https://grpc.io/blog/principles/" target="_blank" rel="noopener">grpc.io/blog/principles</a></li>
  <li>OWASP API Security Top 10 (2023): <a href="https://owasp.org/API-Security/editions/2023/en/0x11-t10/" target="_blank" rel="noopener">owasp.org/API-Security</a> · RFC 9457 Problem Details: <a href="https://www.rfc-editor.org/rfc/rfc9457" target="_blank" rel="noopener">rfc-editor.org/rfc/rfc9457</a></li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── Bắt đầu tại đây (2/2) ─────────────────────────── */
    {
      title: 'Start here (2/2) — When APIs go wrong: real incidents, and how to learn this without giving up|||Bắt đầu tại đây (2/2) — Khi API hỏng: những sự cố thật, và cách học để không bỏ cuộc',
      slug: 'api-0-9-bat-dau-khi-khong-co',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Năm sự cố API có nguồn (USPS, Optus, T-Mobile, Authy, Twitter), một tình huống demo đồ án, và kế hoạch học 2 tuần / 6–8 tuần không nản.',
      content: `${G002}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>When APIs go wrong — and how to learn this without giving up</h2>
<p class="lead">Rules about APIs can sound like bureaucracy: check this, version that, limit the other. This lesson shows where those rules come from — real incidents that hit millions of people, each traced back to an ordinary design decision. Then we turn to you: a typical student disaster, why people quit learning this topic, and a plan that keeps you going.</p>

<h3>How to read the stories</h3>
<p>Every incident below comes from a source you can open: the company’s own statement, a regulator’s court filing, a securities filing or the journalist who found it. Numbers are the ones those sources give; where only the attackers made a claim, we say so. For each story we ask three questions: <strong>what happened</strong>, <strong>which design rule would have stopped it</strong>, and <strong>which chapter of this course teaches that rule</strong>.</p>

<h3>1 · USPS, 2018 — logged in meant “allowed to see everyone”</h3>
<p>In November 2018 Brian Krebs reported that an API behind the US Postal Service’s “Informed Visibility” programme had weak authentication: any user logged in to usps.com could query <em>other</em> users’ account details — email addresses, phone numbers, street addresses — and wildcard searches returned whole data sets. About 60 million usps.com users were exposed. A researcher had reported the flaw more than a year earlier without a reply; USPS changed the API the day after Krebs contacted them.</p>
<p><strong>Design rule:</strong> authentication (“who are you?”) is not authorisation (“may you see <em>this</em> record?”). Every request that reads or changes a record must check ownership or role for that specific record. This failure is number one on the OWASP API list as <em>Broken Object Level Authorization</em> — Chapter 6. You will already see a small version in lesson 1.3, where Bình gets <code>403</code> when he tries to read An’s booking.</p>

<h3>2 · Optus, 2022 — one code change, one forgotten domain</h3>
<p>Optus, a major Australian telco, suffered a breach in September 2022. According to the regulator ACMA’s court filing, reported in June 2024, Optus <em>did</em> have access controls on the API, but a code change around 2018 weakened one of them so it could be bypassed. Optus found and fixed the problem on its main website in August 2021 — but not on a second, internet-facing API domain that had been dormant for years. Between 17 and 20 September 2022 an attacker used that domain to pull customer records. Reports give between about 9.5 and 10 million former and current customers affected (9.5 million in coverage of the ACMA case, 9.8 million records in other reports). Optus disputes that the error amounted to negligence; the case was still before the courts in the sources we read.</p>
<p><strong>Design rule:</strong> keep an <strong>inventory</strong> of every endpoint and every domain that serves them; remove what is unused; and protect access rules with <strong>automated tests</strong> so a refactor cannot silently weaken them. Chapter 6 (OWASP <em>Improper Inventory Management</em>) and Chapter 7 (contract tests).</p>

<h3>3 · T-Mobile, 2023 — one API, six quiet weeks</h3>
<p>In a filing to the US Securities and Exchange Commission dated 19 January 2023, T-Mobile said a bad actor had been obtaining data through a single API without authorisation, starting on or around 25 November 2022; the company identified the activity on 5 January 2023 and stopped it within a day. The data covered about 37 million current postpaid and prepaid customer accounts: name, billing address, email, phone number, date of birth, account number and plan details.</p>
<p><strong>Design rule:</strong> return only the fields a client needs (Chapter 2, response shapes), limit how fast one caller can pull data (Chapter 5, rate limits), and watch for unusual volumes so six weeks becomes six minutes (Chapter 8, monitoring).</p>

<h3>4 · Twilio Authy, 2024 — an endpoint with no login at all</h3>
<p>In July 2024 Twilio published a security alert: threat actors had been able to identify data associated with Authy accounts, including phone numbers, because of <strong>an unauthenticated endpoint</strong>. Twilio secured the endpoint so it no longer accepts unauthenticated requests. A hacking group posted a list of about 33 million phone numbers it said came from this; Twilio confirmed the issue without confirming the number. Asking “does this phone number have an account?” millions of times in a row is called <strong>enumeration</strong>.</p>
<p><strong>Design rule:</strong> every endpoint needs an explicit decision about who may call it (authentication by default, opt out on purpose), and rate limits that make trying millions of inputs impractical. Chapters 5 and 6.</p>

<h3>5 · Twitter, 2023 — the contract changed overnight</h3>
<p>Not every API failure leaks data. Around 12–13 January 2023 popular third-party Twitter clients such as Tweetbot and Twitterrific suddenly stopped working. On 19 January Twitter updated its developer terms to forbid third-party client apps, and Tweetbot — built by a small company over more than a decade — was withdrawn days later. Users and developers had no advance notice and no migration path.</p>
<p><strong>Design rule:</strong> an API is a promise to everyone who built on it. Breaking changes need versioning, a published deprecation notice and a sunset date people can plan for. Chapter 4.</p>

<h3>The pattern</h3>
<table>
  <thead><tr><th>Incident</th><th>What really failed</th><th>Design rule</th><th>Chapter</th></tr></thead>
  <tbody>
    <tr><td>USPS 2018</td><td>logged in = allowed everything</td><td>authorise each object</td><td>6</td></tr>
    <tr><td>Optus 2022</td><td>weakened rule, forgotten endpoint</td><td>inventory + automated contract tests</td><td>6, 7</td></tr>
    <tr><td>T-Mobile 2023</td><td>too much data, nobody watching</td><td>minimal fields, rate limits, alerts</td><td>2, 5, 8</td></tr>
    <tr><td>Authy 2024</td><td>endpoint without authentication</td><td>auth by default, anti-enumeration</td><td>5, 6</td></tr>
    <tr><td>Twitter 2023</td><td>contract changed overnight</td><td>versioning + deprecation policy</td><td>4</td></tr>
  </tbody>
</table>
<p>None of these needed a genius attacker. They needed an API whose contract nobody had fully thought through. That thinking is what you are about to practise.</p>

<h3>Closer to home: the demo-day disaster</h3>
<div class="callout warn"><p><strong>Illustrative scenario — not a real event.</strong> Every piece of it, though, happens in student projects every semester.</p></div>
<p>A team of four builds a lab-booking app. The night before demo day:</p>
<ol>
  <li>The back-end developer renames the list field <code>items</code> to <code>data</code> “for consistency” and pushes. The front-end still reads <code>items</code>, so the device list shows empty.</li>
  <li>The booking form sends <code>"2026-11-02T08:00"</code> without a time zone. The laptop in Hanoi would read it as 8:00 local time, but the server in a container runs on UTC and stores 08:00 UTC — which is 15:00 in Hanoi.</li>
  <li>Every error comes back as <code>200 OK</code> with <code>{"success": false}</code>. The front-end checks the status, sees 200 and shows “Booking successful!”.</li>
  <li>The edit-device form uses <code>PUT</code> but only sends the fields that changed. The server replaces the whole device, and the serial number and name are wiped.</li>
</ol>
<p>At the demo the lecturer books a lab for 8:00, sees “success”, and the booking says 15:00 next to an empty device list. Four small contract mistakes, one ruined demo. Lesson 1.2 fixes the PUT problem, 1.3 the status codes, 1.4 the time zone — and agreeing on the contract first (this whole course) fixes the rename.</p>

<h3>Why people give up on this topic — and the fix</h3>
<ul>
  <li><strong>Too many English terms at once</strong> — idempotent, payload, pagination, deprecation. <em>Fix:</em> every lesson ends with a 🗂 key-terms box in Vietnamese, and the slides introduce one idea per slide.</li>
  <li><strong>Theory without doing.</strong> Reading a table of status codes does not stick. <em>Fix:</em> every idea in this course comes with a real command and its real output, and you run it yourself.</li>
  <li><strong>Red errors feel like failure.</strong> <em>Fix:</em> a <code>4xx</code> is the API talking to you. We read errors line by line on purpose, until they feel like hints rather than punishments.</li>
</ul>
<p>API design is mostly two things: a <strong>vocabulary</strong> and a <strong>habit</strong> of asking “what if the request comes twice? what if the user is not the owner? what if the list has a million items?”. Both grow with repetition, not talent.</p>

<h3>One study session, five steps</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Slides — 10 minutes</span><span class="lz-d">Get the picture and the words. Read the explanation under each slide.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Written lesson — 20 minutes</span><span class="lz-d">The reasons, the traps, the full real output.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Type it yourself — 20 minutes</span><span class="lz-d">Run every curl command against your own LabFlow. Compare with the lesson.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">🧪 Practice — 15 minutes</span><span class="lz-d">A small task with a “done when” you can check yourself.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Quiz or chapter lab</span><span class="lz-d">Only at the end of a chapter. Score below 7/10? Re-read the lessons the explanations point to.</span></div>
</div>
<p>One rule: <strong>never paste a command you cannot explain</strong>. Read it, say what each part does, then run it.</p>

<h3>How long it takes</h3>
<table>
  <thead><tr><th>Plan</th><th>Pace</th><th>You finish with</th></tr></thead>
  <tbody>
    <tr><td><strong>Minimum · 2 weeks</strong></td><td>1 hour a day: Section 0 + Chapters 1–3</td><td>a clean contract for a team project: resources, methods, status codes, one error format, pagination</td></tr>
    <tr><td><strong>Full · 6–8 weeks</strong></td><td>1 hour a day + one weekend lab per chapter</td><td>the whole course and the capstone: a production-style API you can show and explain in interviews</td></tr>
  </tbody>
</table>
<p>Behind on the plan? Do not skip ahead — skip the stretch goals instead. Each chapter builds on the code of the previous one.</p>

<h3>When you are stuck: read the response first</h3>
<ol>
  <li><strong>Status code first.</strong> <code>4xx</code>: something about your request. <code>5xx</code>: the server failed. No status at all: nothing answered (is the server running? right port?).</li>
  <li><strong>Then the body.</strong> A well-designed API says what is wrong — LabFlow always sends an <code>error</code> code and a <code>message</code>.</li>
  <li><strong>Then <code>curl -v</code></strong> to see exactly what you sent: method, path, headers.</li>
  <li><strong>Then the server terminal</strong> — the stack trace for a 500 is there, never in the response.</li>
  <li><strong>Still stuck?</strong> Ask with three things: the exact command, the full output, and what you expected instead.</li>
</ol>
<p>Here is what a helpful error looks like — a real response from the LabFlow skeleton you build in lesson 0.3:</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_9</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 74
ETag: W/"4a-lXLsqA33DrufMdXbcY1kiV4Dmbs"
Date: Sat, 31 Oct 2026 16:27:32 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "LAB_NOT_FOUND",
  "message": "Không có phòng lab lab_9"
}</div>
<p>The status says “your request points at nothing”; the body says which lab. Nothing crashed — the API answered precisely.</p>

<h3>Milestones to tick</h3>
<ul>
  <li>☐ I can explain an API to a friend who does not study IT.</li>
  <li>☐ I can read a raw HTTP response line by line.</li>
  <li>☐ My LabFlow API runs and answers <code>curl</code>.</li>
  <li>☐ I chose method and status code for ten endpoints and can defend each.</li>
  <li>☐ My API has one error format everywhere.</li>
  <li>☐ A network retry can never book a lab twice.</li>
  <li>☐ My API has an OpenAPI file and a documentation page.</li>
  <li>☐ I can design an API on a whiteboard in 45 minutes.</li>
</ul>
<p>Write the date next to each tick. On a bad evening, that list is proof that you are moving.</p>

<h3>🧪 Practice (10 min)</h3>
<div class="callout ok"><ol>
  <li>Open one of the five incident sources (links below) and read it for five minutes.</li>
  <li>In one sentence, write what the API did wrong — in your own words, in Vietnamese if you like.</li>
  <li>Write the one design rule that would have prevented it.</li>
  <li>Choose your plan (2 weeks or 6–8 weeks) and put the first three study sessions in your calendar.</li>
</ol>
<p><strong>Done when:</strong> you have one sentence of “what went wrong”, one design rule, and three dated sessions in your calendar.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Authentication</span><span class="v">Checking who the caller is (login, token).</span></div>
  <div class="kv"><span class="k">Authorisation</span><span class="v">Checking what this caller may do with this specific record.</span></div>
  <div class="kv"><span class="k">Enumeration</span><span class="v">Trying many inputs in a row to discover which exist (ids, phone numbers).</span></div>
  <div class="kv"><span class="k">Rate limit</span><span class="v">A cap on how many requests one caller may send per period.</span></div>
  <div class="kv"><span class="k">Endpoint inventory</span><span class="v">The complete, maintained list of every endpoint and where it is served.</span></div>
  <div class="kv"><span class="k">Deprecation</span><span class="v">Announcing that part of an API will be removed, with a date.</span></div>
  <div class="kv"><span class="k">Payload / body</span><span class="v">The data carried inside a request or response.</span></div>
  <div class="kv"><span class="k">Status code</span><span class="v">The three-digit result of a response: 200, 404, 500…</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Big API incidents are usually ordinary design mistakes, not genius attacks.</li>
  <li>Authorise every object, keep an endpoint inventory, minimise data, rate-limit, and never change a contract overnight.</li>
  <li>Small contract mistakes — renamed fields, no time zone, 200 for errors, PUT with half a body — ruin student demos the same way.</li>
  <li>Study loop: slides → written lesson → type it yourself → 🧪 → quiz/lab.</li>
  <li>When stuck: status code, body, <code>curl -v</code>, server log, then ask with command + output + expectation.</li>
  <li>Choose the 2-week or 6–8-week plan and tick the milestones with dates.</li>
</ul>

<h3>Sources</h3>
<ul>
  <li>USPS: KrebsOnSecurity, 21 Nov 2018 — <a href="https://krebsonsecurity.com/2018/11/usps-site-exposed-data-on-60-million-users/" target="_blank" rel="noopener">krebsonsecurity.com/2018/11/usps-site-exposed-data-on-60-million-users</a></li>
  <li>Optus: iTnews, 20 Jun 2024 (ACMA statement of claim) — <a href="https://www.itnews.com.au/news/optus-breach-allegedly-enabled-by-access-control-coding-error-608985" target="_blank" rel="noopener">itnews.com.au/news/optus-breach-allegedly-enabled-by-access-control-coding-error-608985</a></li>
  <li>T-Mobile: SEC Form 8-K, Jan 2023 — <a href="https://www.sec.gov/Archives/edgar/data/1283699/000119312523010949/d641142d8k.htm" target="_blank" rel="noopener">sec.gov/Archives/edgar/data/1283699/000119312523010949/d641142d8k.htm</a></li>
  <li>Twilio Authy: Twilio security alert, Jul 2024 — <a href="https://www.twilio.com/en-us/changelog/Security_Alert_Authy_App_Android_iOS" target="_blank" rel="noopener">twilio.com/en-us/changelog/Security_Alert_Authy_App_Android_iOS</a>; the 33 million figure: <a href="https://mobilesyrup.com/2024/07/05/authy-confirms-hack-33-million-stolen-phone-numbers/" target="_blank" rel="noopener">MobileSyrup, 5 Jul 2024</a></li>
  <li>Twitter: TechCrunch, 19 Jan 2023 — <a href="https://techcrunch.com/2023/01/19/twitterrific-tweetbot-app-store-removal-twitter-api/" target="_blank" rel="noopener">techcrunch.com/2023/01/19/twitterrific-tweetbot-app-store-removal-twitter-api</a></li>
  <li>OWASP API Security Top 10 (2023) — <a href="https://owasp.org/API-Security/editions/2023/en/0x11-t10/" target="_blank" rel="noopener">owasp.org/API-Security/editions/2023/en/0x11-t10</a></li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Khi API hỏng — và cách học chủ đề này mà không bỏ cuộc</h2>
<p class="lead">Những luật về API nghe có thể giống thủ tục hành chính: kiểm cái này, đánh phiên bản cái kia, giới hạn cái nọ. Bài này cho bạn thấy các luật đó từ đâu ra — từ những sự cố có thật ảnh hưởng tới hàng triệu người, và lần ngược về một quyết định thiết kế rất bình thường. Sau đó ta quay sang bạn: một "thảm hoạ" điển hình của sinh viên, vì sao người ta hay bỏ ngang chủ đề này, và một kế hoạch giúp bạn đi tiếp.</p>

<h3>Đọc các câu chuyện thế nào</h3>
<p>Mỗi sự cố dưới đây đều có nguồn bạn mở ra đọc được: thông báo của chính công ty, hồ sơ khởi kiện của cơ quan quản lý, báo cáo gửi uỷ ban chứng khoán, hoặc bài của nhà báo đã phát hiện ra. Con số là con số các nguồn đó đưa; chỗ nào chỉ là lời tuyên bố của phía tấn công, ta nói rõ. Với mỗi chuyện ta hỏi ba câu: <strong>chuyện gì đã xảy ra</strong>, <strong>luật thiết kế nào lẽ ra đã chặn được</strong>, và <strong>chương nào trong khoá dạy luật đó</strong>.</p>

<h3>1 · USPS, 2018 — đăng nhập là "được xem tất cả mọi người"</h3>
<p>Tháng 11/2018, Brian Krebs đưa tin một API đứng sau chương trình "Informed Visibility" của Bưu điện Mỹ (USPS) có khâu xác thực yếu: bất kỳ ai đã đăng nhập usps.com đều tra được thông tin tài khoản của người <em>khác</em> — email, số điện thoại, địa chỉ nhà — và tìm kiếm với ký tự đại diện trả về cả bộ dữ liệu. Khoảng 60 triệu người dùng usps.com bị lộ. Một nhà nghiên cứu đã báo lỗi này từ hơn một năm trước mà không được hồi âm; USPS sửa API ngay hôm sau khi Krebs liên hệ.</p>
<p><strong>Luật thiết kế:</strong> xác thực (authentication — "bạn là ai?") khác với phân quyền (authorisation — "bạn có được xem <em>bản ghi này</em> không?"). Mọi request đọc hay sửa một bản ghi đều phải kiểm quyền sở hữu hoặc vai trò đối với đúng bản ghi đó. Lỗi này đứng số một trong danh sách OWASP với tên <em>Broken Object Level Authorization</em> (BOLA) — Chương 6. Bạn sẽ thấy một phiên bản nhỏ ngay ở bài 1.3, khi Bình nhận <code>403</code> lúc cố đọc lượt đặt của An.</p>

<h3>2 · Optus, 2022 — một lần sửa code, một tên miền bị bỏ quên</h3>
<p>Optus, một nhà mạng lớn của Úc, bị rò rỉ dữ liệu tháng 9/2022. Theo hồ sơ khởi kiện của cơ quan quản lý ACMA (được báo chí đưa tin tháng 6/2024), Optus <em>có</em> chốt kiểm soát truy cập trên API, nhưng một lần sửa code khoảng năm 2018 đã làm yếu một chốt khiến nó bị vượt qua được. Optus phát hiện và vá lỗi trên website chính vào tháng 8/2021 — nhưng <em>không</em> vá trên một tên miền API thứ hai vẫn mở ra Internet dù đã "ngủ" nhiều năm. Từ 17 tới 20/9/2022, kẻ tấn công dùng chính tên miền đó để kéo dữ liệu khách hàng. Các nguồn đưa con số khoảng 9,5 tới 10 triệu khách hàng cũ và hiện tại (9,5 triệu trong tin về vụ kiện của ACMA, 9,8 triệu bản ghi ở các tin khác). Optus không đồng ý rằng lỗi này là do cẩu thả; trong các nguồn chúng tôi đọc, vụ việc vẫn đang được toà xem xét.</p>
<p><strong>Luật thiết kế:</strong> giữ một <strong>danh sách</strong> (inventory) mọi endpoint và mọi tên miền phục vụ chúng; gỡ những gì không dùng; và bảo vệ luật phân quyền bằng <strong>test tự động</strong> để một lần refactor không âm thầm làm yếu nó. Chương 6 (OWASP <em>Improper Inventory Management</em>) và Chương 7 (kiểm thử theo hợp đồng).</p>

<h3>3 · T-Mobile, 2023 — một API, sáu tuần lặng lẽ</h3>
<p>Trong báo cáo gửi Uỷ ban Chứng khoán Mỹ (SEC) ngày 19/1/2023, T-Mobile cho biết một kẻ xấu đã lấy dữ liệu qua <em>một</em> API mà không được phép, bắt đầu từ khoảng ngày 25/11/2022; công ty phát hiện hoạt động này ngày 5/1/2023 và chặn được trong vòng một ngày. Dữ liệu thuộc khoảng 37 triệu tài khoản khách hàng trả trước và trả sau: họ tên, địa chỉ thanh toán, email, số điện thoại, ngày sinh, số tài khoản và thông tin gói cước.</p>
<p><strong>Luật thiết kế:</strong> chỉ trả về những trường client cần (Chương 2, hình dạng response), giới hạn tốc độ một bên được rút dữ liệu (Chương 5, rate limit), và theo dõi lưu lượng bất thường để sáu tuần rút xuống còn sáu phút (Chương 8, giám sát).</p>

<h3>4 · Twilio Authy, 2024 — một endpoint chẳng cần đăng nhập</h3>
<p>Tháng 7/2024, Twilio đăng cảnh báo bảo mật: kẻ tấn công đã dò ra được dữ liệu gắn với tài khoản Authy, trong đó có số điện thoại, vì có <strong>một endpoint không yêu cầu xác thực</strong>. Twilio đã khoá endpoint đó để nó không nhận request chưa xác thực nữa. Một nhóm hacker đăng danh sách khoảng 33 triệu số điện thoại mà họ nói lấy từ lỗ này; Twilio xác nhận sự cố nhưng không xác nhận con số. Hỏi "số điện thoại này có tài khoản không?" hàng triệu lần liên tiếp gọi là <strong>enumeration</strong> (dò liệt kê).</p>
<p><strong>Luật thiết kế:</strong> endpoint nào cũng cần một quyết định rõ ràng ai được gọi (mặc định phải xác thực, muốn mở thì mở có chủ đích), cộng rate limit khiến việc thử hàng triệu đầu vào trở nên bất khả thi. Chương 5 và 6.</p>

<h3>5 · Twitter, 2023 — hợp đồng đổi qua một đêm</h3>
<p>Không phải hỏng hóc API nào cũng làm lộ dữ liệu. Khoảng ngày 12–13/1/2023, các app Twitter của bên thứ ba nổi tiếng như Tweetbot, Twitterrific đột ngột ngừng hoạt động. Ngày 19/1, Twitter cập nhật điều khoản cho nhà phát triển để cấm hẳn ứng dụng client của bên thứ ba, và Tweetbot — do một công ty nhỏ xây dựng suốt hơn mười năm — bị rút khỏi kho ứng dụng vài ngày sau. Người dùng và nhà phát triển không được báo trước, cũng không có đường chuyển đổi.</p>
<p><strong>Luật thiết kế:</strong> API là lời hứa với tất cả những ai xây trên nó. Thay đổi phá vỡ cần quản lý phiên bản, thông báo ngừng hỗ trợ công khai và một ngày kết thúc (sunset) để người ta kịp chuẩn bị. Chương 4.</p>

<h3>Khuôn chung</h3>
<table>
  <thead><tr><th>Sự cố</th><th>Thật ra hỏng ở đâu</th><th>Luật thiết kế</th><th>Chương</th></tr></thead>
  <tbody>
    <tr><td>USPS 2018</td><td>đăng nhập = được làm mọi thứ</td><td>phân quyền từng đối tượng</td><td>6</td></tr>
    <tr><td>Optus 2022</td><td>luật bị yếu đi, endpoint bị quên</td><td>danh sách endpoint + test hợp đồng tự động</td><td>6, 7</td></tr>
    <tr><td>T-Mobile 2023</td><td>trả quá nhiều dữ liệu, không ai theo dõi</td><td>tối thiểu trường, rate limit, cảnh báo</td><td>2, 5, 8</td></tr>
    <tr><td>Authy 2024</td><td>endpoint không xác thực</td><td>mặc định xác thực, chống dò liệt kê</td><td>5, 6</td></tr>
    <tr><td>Twitter 2023</td><td>hợp đồng đổi qua đêm</td><td>phiên bản + chính sách ngừng hỗ trợ</td><td>4</td></tr>
  </tbody>
</table>
<p>Không vụ nào cần một kẻ tấn công thiên tài. Chúng chỉ cần một API mà hợp đồng của nó chưa ai nghĩ cho thấu. Cái "nghĩ cho thấu" đó chính là thứ bạn sắp luyện.</p>

<h3>Gần hơn với bạn: thảm hoạ ngày demo</h3>
<div class="callout warn"><p><strong>Tình huống minh hoạ — không phải sự kiện có thật.</strong> Nhưng từng mảnh của nó học kỳ nào cũng xảy ra ở các đồ án sinh viên.</p></div>
<p>Một nhóm bốn người làm app đặt phòng lab. Đêm trước buổi demo:</p>
<ol>
  <li>Bạn back-end đổi tên trường danh sách <code>items</code> thành <code>data</code> "cho thống nhất" rồi push. Front-end vẫn đọc <code>items</code>, nên danh sách thiết bị hiện trống trơn.</li>
  <li>Form đặt phòng gửi <code>"2026-11-02T08:00"</code> không kèm múi giờ. Laptop ở Hà Nội sẽ hiểu là 8:00 giờ địa phương, nhưng server trong container chạy giờ UTC nên lưu thành 08:00 UTC — tức 15:00 ở Hà Nội.</li>
  <li>Lỗi nào cũng trả về <code>200 OK</code> kèm <code>{"success": false}</code>. Front-end kiểm mã trạng thái, thấy 200, hiện "Đặt phòng thành công!".</li>
  <li>Form sửa thiết bị dùng <code>PUT</code> nhưng chỉ gửi những trường đã đổi. Server thay toàn bộ thiết bị, thế là số serial và tên bị xoá sạch.</li>
</ol>
<p>Lúc demo, thầy đặt phòng 8:00, thấy "thành công", còn lượt đặt thì ghi 15:00 bên cạnh một danh sách thiết bị trống. Bốn lỗi hợp đồng nhỏ, một buổi demo hỏng. Bài 1.2 sửa chuyện PUT, 1.3 sửa mã trạng thái, 1.4 sửa múi giờ — còn việc thống nhất hợp đồng trước (cả khoá này) sửa chuyện đổi tên.</p>

<h3>Vì sao người ta bỏ ngang chủ đề này — và cách chữa</h3>
<ul>
  <li><strong>Quá nhiều thuật ngữ tiếng Anh cùng lúc</strong> — idempotent, payload, pagination, deprecation. <em>Cách chữa:</em> cuối mỗi bài có ô 🗂 thuật ngữ giải nghĩa tiếng Việt, và mỗi slide chỉ giới thiệu một ý.</li>
  <li><strong>Học lý thuyết mà không làm.</strong> Đọc bảng mã trạng thái thì không nhớ được lâu. <em>Cách chữa:</em> mỗi ý trong khoá đều kèm một lệnh thật và output thật, và bạn tự chạy.</li>
  <li><strong>Dòng lỗi đỏ khiến mình thấy thất bại.</strong> <em>Cách chữa:</em> mã <code>4xx</code> là API đang nói chuyện với bạn. Ta cố ý đọc lỗi từng dòng, cho tới khi chúng giống gợi ý hơn là hình phạt.</li>
</ul>
<p>Thiết kế API phần lớn gồm hai thứ: một <strong>bộ từ vựng</strong> và một <strong>thói quen</strong> hỏi "nếu request tới hai lần thì sao? nếu người dùng không phải chủ thì sao? nếu danh sách có một triệu phần tử thì sao?". Cả hai lớn lên nhờ lặp lại, không nhờ năng khiếu.</p>

<h3>Một buổi học, năm bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Slide — 10 phút</span><span class="lz-d">Nắm bức tranh và từ vựng. Đọc phần giải thích dưới mỗi slide.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bài đọc chi tiết — 20 phút</span><span class="lz-d">Lý do, cái bẫy, output thật đầy đủ.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tự gõ lại — 20 phút</span><span class="lz-d">Chạy mọi lệnh curl trên LabFlow của chính bạn. So với bài.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">🧪 Thực hành — 15 phút</span><span class="lz-d">Một việc nhỏ có tiêu chí "đạt khi" bạn tự kiểm được.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Quiz hoặc lab chương</span><span class="lz-d">Chỉ làm khi hết chương. Dưới 7/10? Đọc lại các bài mà phần giải thích chỉ tới.</span></div>
</div>
<p>Một luật duy nhất: <strong>đừng bao giờ dán một lệnh mà bạn không giải thích được</strong>. Đọc nó, nói từng phần làm gì, rồi mới chạy.</p>

<h3>Mất bao lâu</h3>
<table>
  <thead><tr><th>Gói</th><th>Nhịp học</th><th>Học xong bạn có</th></tr></thead>
  <tbody>
    <tr><td><strong>Tối thiểu · 2 tuần</strong></td><td>mỗi ngày 1 giờ: Mục 0 + Chương 1–3</td><td>một hợp đồng gọn gàng cho đồ án nhóm: tài nguyên, phương thức, mã trạng thái, một định dạng lỗi, phân trang</td></tr>
    <tr><td><strong>Đầy đủ · 6–8 tuần</strong></td><td>mỗi ngày 1 giờ + một buổi lab cuối tuần cho mỗi chương</td><td>trọn khoá và dự án cuối khoá: một API kiểu production để trình bày và giải thích khi phỏng vấn</td></tr>
  </tbody>
</table>
<p>Bị chậm so với kế hoạch? Đừng nhảy cóc — hãy bỏ qua các mục "thử thách thêm". Chương sau dựng trên code của chương trước.</p>

<h3>Khi bị kẹt: đọc response trước tiên</h3>
<ol>
  <li><strong>Mã trạng thái trước.</strong> <code>4xx</code>: có gì đó ở request của bạn. <code>5xx</code>: server bị lỗi. Không có mã nào: chẳng ai trả lời (server có đang chạy không? đúng cổng chưa?).</li>
  <li><strong>Rồi tới body.</strong> Một API thiết kế tốt sẽ nói sai ở đâu — LabFlow luôn gửi mã <code>error</code> và một câu <code>message</code>.</li>
  <li><strong>Rồi <code>curl -v</code></strong> để thấy chính xác bạn đã gửi gì: phương thức, đường dẫn, header.</li>
  <li><strong>Rồi tới terminal của server</strong> — stack trace của lỗi 500 nằm ở đó, không bao giờ nằm trong response.</li>
  <li><strong>Vẫn kẹt?</strong> Hỏi kèm ba thứ: lệnh chính xác, toàn bộ output, và điều bạn mong đợi.</li>
</ol>
<p>Một lỗi "dễ thương" trông như sau — response thật từ khung LabFlow bạn dựng ở bài 0.3:</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_9</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 74
ETag: W/"4a-lXLsqA33DrufMdXbcY1kiV4Dmbs"
Date: Sat, 31 Oct 2026 16:27:32 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "LAB_NOT_FOUND",
  "message": "Không có phòng lab lab_9"
}</div>
<p>Mã trạng thái nói "request của bạn trỏ vào chỗ không có gì"; body nói rõ là phòng nào. Không có gì sập cả — API đã trả lời chính xác.</p>

<h3>Các cột mốc để đánh dấu</h3>
<ul>
  <li>☐ Mình giải thích được API cho một người bạn không học IT.</li>
  <li>☐ Mình đọc được một response HTTP "trần" từng dòng.</li>
  <li>☐ LabFlow API của mình chạy và trả lời <code>curl</code>.</li>
  <li>☐ Mình chọn phương thức và mã trạng thái cho mười endpoint và bảo vệ được từng lựa chọn.</li>
  <li>☐ API của mình có một định dạng lỗi duy nhất ở mọi nơi.</li>
  <li>☐ Một lần gửi lại do mạng chập chờn không bao giờ đặt một phòng hai lần.</li>
  <li>☐ API của mình có tệp OpenAPI và trang tài liệu.</li>
  <li>☐ Mình thiết kế được một API trên bảng trắng trong 45 phút.</li>
</ul>
<p>Ghi ngày cạnh mỗi dấu tích. Vào một buổi tối tệ, danh sách đó là bằng chứng bạn đang tiến lên.</p>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
  <li>Mở một trong năm nguồn sự cố (link bên dưới) và đọc trong năm phút.</li>
  <li>Viết một câu nói API đó đã sai ở đâu — bằng lời của bạn, tiếng Việt cũng được.</li>
  <li>Viết một luật thiết kế lẽ ra đã chặn được nó.</li>
  <li>Chọn gói học (2 tuần hay 6–8 tuần) và ghi ba buổi học đầu tiên vào lịch.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một câu "đã sai ở đâu", một luật thiết kế, và ba buổi học đã có ngày trong lịch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Authentication (xác thực)</span><span class="v">Kiểm tra bên gọi là ai (đăng nhập, token).</span></div>
  <div class="kv"><span class="k">Authorisation (phân quyền)</span><span class="v">Kiểm tra bên gọi được làm gì với đúng bản ghi này.</span></div>
  <div class="kv"><span class="k">Enumeration (dò liệt kê)</span><span class="v">Thử liên tiếp rất nhiều đầu vào để tìm ra cái nào tồn tại (id, số điện thoại).</span></div>
  <div class="kv"><span class="k">Rate limit (giới hạn tần suất)</span><span class="v">Mức trần số request một bên được gửi trong một khoảng thời gian.</span></div>
  <div class="kv"><span class="k">Endpoint inventory (danh sách endpoint)</span><span class="v">Bản liệt kê đầy đủ, được cập nhật, mọi endpoint và nơi chúng được phục vụ.</span></div>
  <div class="kv"><span class="k">Deprecation (ngừng hỗ trợ)</span><span class="v">Thông báo một phần của API sẽ bị gỡ, kèm ngày cụ thể.</span></div>
  <div class="kv"><span class="k">Payload / body (dữ liệu gửi kèm)</span><span class="v">Phần dữ liệu nằm trong request hoặc response.</span></div>
  <div class="kv"><span class="k">Status code (mã trạng thái)</span><span class="v">Kết quả ba chữ số của một response: 200, 404, 500…</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Sự cố API lớn thường là lỗi thiết kế bình thường, không phải tấn công thiên tài.</li>
  <li>Phân quyền từng đối tượng, giữ danh sách endpoint, tối thiểu dữ liệu, giới hạn tần suất, và đừng đổi hợp đồng qua một đêm.</li>
  <li>Lỗi hợp đồng nhỏ — đổi tên trường, thiếu múi giờ, 200 cho lỗi, PUT nửa body — làm hỏng demo của sinh viên y như vậy.</li>
  <li>Vòng học: slide → bài đọc → tự gõ → 🧪 → quiz/lab.</li>
  <li>Khi kẹt: mã trạng thái, body, <code>curl -v</code>, log server, rồi hỏi kèm lệnh + output + điều mong đợi.</li>
  <li>Chọn gói 2 tuần hoặc 6–8 tuần và đánh dấu các cột mốc kèm ngày.</li>
</ul>

<h3>Nguồn</h3>
<ul>
  <li>USPS: KrebsOnSecurity, 21/11/2018 — <a href="https://krebsonsecurity.com/2018/11/usps-site-exposed-data-on-60-million-users/" target="_blank" rel="noopener">krebsonsecurity.com/2018/11/usps-site-exposed-data-on-60-million-users</a></li>
  <li>Optus: iTnews, 20/6/2024 (hồ sơ khởi kiện của ACMA) — <a href="https://www.itnews.com.au/news/optus-breach-allegedly-enabled-by-access-control-coding-error-608985" target="_blank" rel="noopener">itnews.com.au/news/optus-breach-allegedly-enabled-by-access-control-coding-error-608985</a></li>
  <li>T-Mobile: báo cáo SEC Form 8-K, 1/2023 — <a href="https://www.sec.gov/Archives/edgar/data/1283699/000119312523010949/d641142d8k.htm" target="_blank" rel="noopener">sec.gov/Archives/edgar/data/1283699/000119312523010949/d641142d8k.htm</a></li>
  <li>Twilio Authy: cảnh báo bảo mật của Twilio, 7/2024 — <a href="https://www.twilio.com/en-us/changelog/Security_Alert_Authy_App_Android_iOS" target="_blank" rel="noopener">twilio.com/en-us/changelog/Security_Alert_Authy_App_Android_iOS</a>; con số 33 triệu: <a href="https://mobilesyrup.com/2024/07/05/authy-confirms-hack-33-million-stolen-phone-numbers/" target="_blank" rel="noopener">MobileSyrup, 5/7/2024</a></li>
  <li>Twitter: TechCrunch, 19/1/2023 — <a href="https://techcrunch.com/2023/01/19/twitterrific-tweetbot-app-store-removal-twitter-api/" target="_blank" rel="noopener">techcrunch.com/2023/01/19/twitterrific-tweetbot-app-store-removal-twitter-api</a></li>
  <li>OWASP API Security Top 10 (2023) — <a href="https://owasp.org/API-Security/editions/2023/en/0x11-t10/" target="_blank" rel="noopener">owasp.org/API-Security/editions/2023/en/0x11-t10</a></li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — HTTP you actually need: read a request and a response line by line|||0.1 — HTTP bạn thật sự cần: đọc request và response từng dòng',
      slug: 'api-0-1-http',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dựng máy chủ "tấm gương" bằng node:http, đọc curl -i và curl -v từng dòng, URL, header, mã trạng thái, phương thức, stateless và bẫy thiếu Content-Type.',
      content: `${G003}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>HTTP you actually need</h2>
<p class="lead">You do not need to know all of HTTP to design good APIs. You need to read a request and a response fluently — every line, and why it is there. In this lesson you build a tiny “mirror” server that shows exactly what arrives, then send it requests with curl until the format feels familiar.</p>

<h3>Step 0: a folder to practise in</h3>
<p>All the exercises in Section 0 live in one folder. Create it once:</p>
<pre><code class="language-bash">mkdir -p ~/thu-api
cd ~/thu-api
node -v      <span class="tok-comment"># needs v22 or newer — lesson 0.3 shows how to install it</span></code></pre>
<p>If <code>node -v</code> prints nothing or a version below 22, jump to “Step 1” of lesson 0.3, install Node, and come back. Everything else here needs only Node itself and <code>curl</code>, which ships with macOS, Linux and Windows 10/11 (on Windows PowerShell type <code>curl.exe</code> — lesson 0.2 explains why).</p>

<h3>The mirror server: see what really arrives</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · client</span><span class="lz-t">request line + headers</span><span class="lz-d">POST /bookings HTTP/1.1 · Content-Type · Authorization</span></div>
  <div class="lz-step"><span class="lz-k">2 · body</span><span class="lz-t">optional</span><span class="lz-d">JSON — only if Content-Type says so</span></div>
  <div class="lz-step"><span class="lz-k">3 · server</span><span class="lz-t">reads and routes</span><span class="lz-d">Express matches method + path</span></div>
  <div class="lz-step"><span class="lz-k">4 · response</span><span class="lz-t">status + headers + body</span><span class="lz-d">201 · Location · Content-Type · JSON</span></div>
</div>
<p>Frameworks hide the raw request from you. To learn HTTP we want the opposite: a server that shows everything. Save this as <code>echo.mjs</code> in <code>~/thu-api</code>:</p>
<pre><code class="language-javascript"><span class="tok-comment">// echo.mjs — máy chủ "tấm gương": in ra request nó nhận được, rồi trả lại dạng JSON</span>
<span class="tok-keyword">import</span> { createServer } <span class="tok-keyword">from</span> <span class="tok-string">'node:http'</span>;

<span class="tok-keyword">const</span> server = <span class="tok-function">createServer</span>((req, res) =&gt; {
  <span class="tok-keyword">let</span> body = <span class="tok-string">''</span>;
  req.<span class="tok-function">on</span>(<span class="tok-string">'data'</span>, (chunk) =&gt; (body += chunk));
  req.<span class="tok-function">on</span>(<span class="tok-string">'end'</span>, () =&gt; {
    console.<span class="tok-function">log</span>(&#96;\${req.method} \${req.url} HTTP/\${req.httpVersion}&#96;);
    console.<span class="tok-function">log</span>(req.headers);
    <span class="tok-keyword">if</span> (body) console.<span class="tok-function">log</span>(<span class="tok-string">'body:'</span>, body);
    <span class="tok-keyword">const</span> reply = { method: req.method, url: req.url, headers: req.headers, body };
    res.<span class="tok-function">writeHead</span>(<span class="tok-number">200</span>, { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json; charset=utf-8'</span> });
    res.<span class="tok-function">end</span>(JSON.<span class="tok-function">stringify</span>(reply, <span class="tok-keyword">null</span>, <span class="tok-number">2</span>));
  });
});

server.<span class="tok-function">listen</span>(<span class="tok-number">4001</span>, () =&gt; console.<span class="tok-function">log</span>(<span class="tok-string">'echo server: http://localhost:4001'</span>));</code></pre>
<table>
  <thead><tr><th>Line</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td><code>import { createServer } from 'node:http'</code></td><td>Node’s built-in HTTP server — nothing to install.</td></tr>
    <tr><td><code>req.on('data', …)</code></td><td>The body arrives in pieces (chunks); we glue them together.</td></tr>
    <tr><td><code>req.on('end', …)</code></td><td>Runs when the whole request has arrived.</td></tr>
    <tr><td><code>console.log(…)</code></td><td>Prints the request in the <em>server’s</em> terminal.</td></tr>
    <tr><td><code>res.writeHead(200, …)</code></td><td>Writes the status line and one header.</td></tr>
    <tr><td><code>res.end(JSON.stringify(reply, null, 2))</code></td><td>Sends the body — a readable, indented copy of what we saw — and ends the response.</td></tr>
  </tbody>
</table>
<p>Start it in one terminal and leave it running:</p>
<pre><code class="language-bash">node echo.mjs</code></pre>
<div class="out">echo server: http://localhost:4001</div>
<p>Open a <strong>second terminal</strong> for the requests. Two terminals — one for the server, one for the client — is the normal way to work for the rest of the course.</p>

<h3>curl -i: the response, headers included</h3>
<pre><code class="language-bash">curl -i 'http://localhost:4001/labs?building=Alpha'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Sat, 31 Oct 2026 15:39:54 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{
  "method": "GET",
  "url": "/labs?building=Alpha",
  "headers": {
    "host": "localhost:4001",
    "user-agent": "curl/8.7.1",
    "accept": "*/*"
  },
  "body": ""
}</div>
<p>Read it top to bottom:</p>
<ul>
  <li><code>HTTP/1.1 200 OK</code> — the <strong>status line</strong>: protocol version, status code, and a human reason phrase.</li>
  <li>Five <strong>headers</strong>, one per line in <code>Name: value</code> form. <code>Content-Type</code> came from our code; <code>Date</code>, <code>Connection</code>, <code>Keep-Alive</code> and <code>Transfer-Encoding</code> were added by Node’s HTTP server.</li>
  <li>An <strong>empty line</strong> — it means “headers finished”.</li>
  <li>The <strong>body</strong>: the mirror’s report. It shows that curl sent only three headers and no body, and that the server saw the URL as just <code>/labs?building=Alpha</code> — no host, no port.</li>
</ul>
<p>Look at the first terminal too. The server printed:</p>
<div class="out">GET /labs?building=Alpha HTTP/1.1
{ host: 'localhost:4001', 'user-agent': 'curl/8.7.1', accept: '*/*' }</div>

<div class="callout ok"><p><strong>Why the quotes around the URL?</strong> In zsh and bash, <code>?</code> and <code>&amp;</code> have special meanings. Wrapping a URL with a query in single quotes makes the shell pass it to curl untouched. Get into the habit now.</p></div>

<h3>curl -v: see the request you actually sent</h3>
<pre><code class="language-bash">curl -v http://localhost:4001/labs/lab_1</code></pre>
<div class="out">* Host localhost:4001 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:4001...
* Connected to localhost (::1) port 4001
&gt; GET /labs/lab_1 HTTP/1.1
&gt; Host: localhost:4001
&gt; User-Agent: curl/8.7.1
&gt; Accept: */*
&gt;
* Request completely sent off
&lt; HTTP/1.1 200 OK
&lt; Content-Type: application/json; charset=utf-8
&lt; Date: Sat, 31 Oct 2026 15:40:02 GMT
&lt; Connection: keep-alive
&lt; Keep-Alive: timeout=5
&lt; Transfer-Encoding: chunked
&lt;
{ [172 bytes data]
* Connection #0 to host localhost left intact
{
  "method": "GET",
  "url": "/labs/lab_1",
  …</div>
<table>
  <thead><tr><th>Prefix</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>*</code></td><td>curl telling you what it is doing: name lookup, connecting, done.</td></tr>
    <tr><td><code>&gt;</code></td><td>A line curl <strong>sent</strong> — this is your request, exactly.</td></tr>
    <tr><td><code>&lt;</code></td><td>A line curl <strong>received</strong> — the response status and headers.</td></tr>
  </tbody>
</table>
<p>Notice that <code>localhost</code> resolved to both <code>::1</code> (IPv6) and <code>127.0.0.1</code> (IPv4), and curl connected over IPv6 first. That is normal; both mean “this machine”.</p>

<h3>The five parts of a URL</h3>
<table>
  <thead><tr><th>Part</th><th>In <code>http://localhost:4001/labs?building=Alpha</code></th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>scheme</td><td><code>http</code></td><td>which protocol (<code>https</code> = HTTP over TLS encryption)</td></tr>
    <tr><td>host</td><td><code>localhost</code></td><td>which machine</td></tr>
    <tr><td>port</td><td><code>4001</code></td><td>which program on that machine (default 80 for http, 443 for https)</td></tr>
    <tr><td>path</td><td><code>/labs</code></td><td>which <strong>resource</strong></td></tr>
    <tr><td>query</td><td><code>?building=Alpha</code></td><td>options: filters, sorting, paging — <code>key=value</code> pairs joined by <code>&amp;</code></td></tr>
  </tbody>
</table>
<p>Host and port are used to <em>find</em> the server; once connected, the server sees only the path and query (the <code>Host</code> header still tells it which site you asked for). A good rule for API design, which Chapter 1 builds on: the <strong>path</strong> names the thing; the <strong>query</strong> says how you want it.</p>

<h3>Sending data: POST with a JSON body</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4001/bookings \\
  -H 'Content-Type: application/json' \\
  -d '{"labId":"lab_1","purpose":"Lab 3 SWT301"}'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Sat, 31 Oct 2026 15:40:02 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{
  "method": "POST",
  "url": "/bookings",
  "headers": {
    "host": "localhost:4001",
    "user-agent": "curl/8.7.1",
    "accept": "*/*",
    "content-type": "application/json",
    "content-length": "42"
  },
  "body": "{\\"labId\\":\\"lab_1\\",\\"purpose\\":\\"Lab 3 SWT301\\"}"
}</div>
<table>
  <thead><tr><th>Flag</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>-X POST</code></td><td>Use the POST method (curl’s default is GET).</td></tr>
    <tr><td><code>-H 'Content-Type: application/json'</code></td><td>Add a header saying the body is JSON.</td></tr>
    <tr><td><code>-d '…'</code></td><td>The data (body) to send.</td></tr>
    <tr><td><code>\\</code> at the end of a line</td><td>Shell line continuation: the command continues on the next line.</td></tr>
  </tbody>
</table>
<p>Two details in the output matter. First, curl added <code>content-length: 42</code> by itself: the body is exactly 42 bytes, and the server needs that number to know where the body ends. Second, the server received the body as a <strong>string</strong> — the escaped quotes <code>\\"</code> show it is text that still has to be parsed as JSON. In Express, <code>express.json()</code> does that parsing (lesson 0.3).</p>

<h3>The response: status codes tell the story</h3>
<table>
  <thead><tr><th>Family</th><th>Means</th><th>Codes you will use in this course</th></tr></thead>
  <tbody>
    <tr><td><strong>1xx</strong></td><td>informational, “hold on”</td><td>rare in APIs</td></tr>
    <tr><td><strong>2xx</strong></td><td>success</td><td>200 OK · 201 Created · 204 No Content</td></tr>
    <tr><td><strong>3xx</strong></td><td>look somewhere else</td><td>301 Moved Permanently · 304 Not Modified (Chapter 9)</td></tr>
    <tr><td><strong>4xx</strong></td><td>the <strong>client</strong> made a mistake</td><td>400 · 401 · 403 · 404 · 405 · 409 · 415 · 422 · 429</td></tr>
    <tr><td><strong>5xx</strong></td><td>the <strong>server</strong> failed</td><td>500 Internal Server Error · 503 Service Unavailable</td></tr>
  </tbody>
</table>
<p>The reason phrase (“OK”, “Not Found”) is only for humans; programs look at the number. When debugging, read the <strong>first digit first</strong>: it tells you whether to look at your request (4) or at the server (5).</p>

<h3>Headers you will actually meet</h3>
<table>
  <thead><tr><th>Header</th><th>Sent by</th><th>Job</th></tr></thead>
  <tbody>
    <tr><td><code>Content-Type</code></td><td>both</td><td>format of the body, e.g. <code>application/json; charset=utf-8</code></td></tr>
    <tr><td><code>Accept</code></td><td>client</td><td>formats the client can read; <code>*/*</code> means anything</td></tr>
    <tr><td><code>Authorization</code></td><td>client</td><td>who you are, e.g. <code>Bearer &lt;token&gt;</code> (lesson 1.3, Chapter 6)</td></tr>
    <tr><td><code>Content-Length</code></td><td>both</td><td>size of the body in bytes</td></tr>
    <tr><td><code>Location</code></td><td>server</td><td>URL of a resource just created (with 201) or of a redirect (with 3xx)</td></tr>
    <tr><td><code>Cache-Control</code>, <code>ETag</code></td><td>server</td><td>may this be cached, and which version is it (Chapter 9)</td></tr>
  </tbody>
</table>
<p>Header <strong>names</strong> are case-insensitive — <code>content-type</code> and <code>Content-Type</code> are the same header. That is why the mirror printed them in lowercase: Node normalises them. Header <strong>values</strong> are another matter; lesson 1.4 shows a bug that came from treating one as case-sensitive.</p>

<h3>Methods: the verb of the request</h3>
<table>
  <thead><tr><th>Method</th><th>Intent</th><th>LabFlow example</th></tr></thead>
  <tbody>
    <tr><td>GET</td><td>read; must not change anything</td><td><code>GET /labs</code></td></tr>
    <tr><td>POST</td><td>create a new member of a collection, or trigger an action</td><td><code>POST /bookings</code></td></tr>
    <tr><td>PUT</td><td>replace the whole resource at this URL</td><td><code>PUT /devices/dev_1</code></td></tr>
    <tr><td>PATCH</td><td>change some fields</td><td><code>PATCH /devices/dev_1</code></td></tr>
    <tr><td>DELETE</td><td>remove</td><td><code>DELETE /devices/dev_2</code></td></tr>
    <tr><td>HEAD</td><td>like GET but headers only</td><td><code>curl -I …</code></td></tr>
    <tr><td>OPTIONS</td><td>ask which methods are allowed here</td><td><code>curl -X OPTIONS …</code></td></tr>
  </tbody>
</table>
<p>Try HEAD on the mirror: <code>curl -I http://localhost:4001/labs</code> prints the status line and headers but no body. Lesson 1.2 explains which methods are <em>safe</em> and <em>idempotent</em> — the two promises that decide whether a client may resend a request.</p>

<h3>HTTP does not remember you</h3>
<p>HTTP is <strong>stateless</strong>: every request is understood on its own, with no memory of previous ones. If the server needs to know who you are, the request must say so — usually with an <code>Authorization</code> header or a cookie — <em>every time</em>. “Staying logged in” is the client re-sending its credential on each request.</p>
<p>This sounds like a limitation, but it is a superpower for APIs: because no request depends on server memory, you can run the same API on two, five or fifty servers behind a load balancer, and any of them can answer any request. Chapter 8 builds on this.</p>

<h3>HTTP/1.1, HTTP/2, HTTP/3</h3>
<p>Everything above is HTTP/1.1, which is plain text and easy to read. HTTP/2 (2015) sends the same messages as binary frames and lets many requests share one connection; HTTP/3 (2022) runs over QUIC on UDP instead of TCP. For API design nothing changes: methods, status codes and headers mean the same in all three, because their meaning is defined once, in RFC 9110. Learn the meaning on HTTP/1.1; the faster versions are an infrastructure choice.</p>

<h3>Trap: forgetting Content-Type</h3>
<p>Send JSON with <code>-d</code> but no header, and see what the mirror receives:</p>
<pre><code class="language-bash">curl -X POST http://localhost:4001/bookings -d '{"labId":"lab_1"}'</code></pre>
<div class="out">{
  "method": "POST",
  "url": "/bookings",
  "headers": {
    "host": "localhost:4001",
    "user-agent": "curl/8.7.1",
    "accept": "*/*",
    "content-length": "17",
    "content-type": "application/x-www-form-urlencoded"
  },
  "body": "{\\"labId\\":\\"lab_1\\"}"
}</div>
<p>curl labelled the body as an HTML <strong>form</strong>. The bytes arrived, but <code>express.json()</code> only parses bodies labelled JSON, so in an Express API your handler would see <strong>no body</strong>. Here is what the LabFlow API from Chapter 1 answers to the same mistake:</p>
<pre><code class="language-bash">curl -X POST http://localhost:4000/bookings -H "Authorization: Bearer tok_an" \\
  -d '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00"}'</code></pre>
<div class="out">{
  "error": "VALIDATION_FAILED",
  "message": "Dữ liệu gửi lên chưa đúng định dạng",
  "details": [
    {
      "field": "labId",
      "issue": "required"
    },
    {
      "field": "startAt",
      "issue": "must be ISO 8601 with timezone"
    },
    {
      "field": "endAt",
      "issue": "must be ISO 8601 with timezone"
    }
  ]
}</div>
<p>Every field is “missing”, although you clearly sent them. This is one of the most common “the API is broken!” moments in team projects. Fix it with <code>-H 'Content-Type: application/json'</code>, or use <code>curl --json '…'</code>, which sets the header for you (lesson 0.2).</p>

<div class="pitfall"><p><strong>Trap — testing with the browser address bar.</strong> The address bar can only send GET, cannot add an <code>Authorization</code> header and hides the status line. A page that “loads fine” in the browser tells you almost nothing about the API. Use curl and read the status line.</p></div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>With <code>echo.mjs</code> running, send <code>GET /labs/lab_3?view=full&amp;lang=vi</code> with <code>curl -i</code>. Find the path and the two query parameters in the mirror’s report.</li>
  <li>Send a POST with a JSON body <code>{"labId":"lab_2","seats":3}</code> — once with the Content-Type header, once without. Compare the <code>content-type</code> lines the mirror reports.</li>
  <li>Add your own header <code>-H 'X-Student: &lt;your name&gt;'</code> and find it in the server’s terminal. In what case is its name printed?</li>
  <li>Run <code>curl -v</code> on any URL and copy only the lines starting with <code>&gt;</code>. That is your complete request, as text.</li>
</ol>
<p><strong>Done when:</strong> you can point at the request line, every header and the body of your own request in the <code>curl -v</code> output, and explain why the version without Content-Type would fail in an Express API.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Request line / status line</span><span class="v">The first line of a request (method, path, version) / of a response (version, code, reason).</span></div>
  <div class="kv"><span class="k">Header</span><span class="v">A <code>Name: value</code> line of metadata about the message.</span></div>
  <div class="kv"><span class="k">Body</span><span class="v">The data after the empty line; optional.</span></div>
  <div class="kv"><span class="k">Query string</span><span class="v">The <code>?key=value&amp;…</code> part of a URL: options, not the resource itself.</span></div>
  <div class="kv"><span class="k">Status code</span><span class="v">Three digits; the first gives the family (2 ok, 4 client, 5 server).</span></div>
  <div class="kv"><span class="k">Content-Type</span><span class="v">Header that says what format the body is in.</span></div>
  <div class="kv"><span class="k">Stateless</span><span class="v">Each request carries everything needed; the server keeps no conversation memory.</span></div>
  <div class="kv"><span class="k">curl -i / -v</span><span class="v">Show response headers / show the full exchange in both directions.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Every API call is one request and exactly one response, both plain text in HTTP/1.1.</li>
  <li>A request is: request line, headers, empty line, optional body. A response: status line, headers, empty line, optional body.</li>
  <li><code>curl -i</code> shows the response with headers; <code>curl -v</code> shows what you actually sent.</li>
  <li>The URL path names the resource; the query gives options.</li>
  <li>Read the first digit of the status code first; header names are case-insensitive.</li>
  <li>HTTP is stateless, and any body needs a correct <code>Content-Type</code>.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-1-2-http-server" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SDN302 — lesson 1.2: APIs, HTTP &amp; a first Node server</span><span class="lc-sub">If you took SDN302 on Academy, this part will feel familiar. Same: the parts of a request and response (method, URL, headers, body, status) and a server built with Node’s http module. Different: SDN302 builds a server to return data; here the server is a mirror for reading HTTP itself. This lesson adds: reading curl -i and curl -v line by line, the five parts of a URL, statelessness and the missing Content-Type trap. If you have not taken SDN302, no problem — this lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SDN302 LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/java-web-application-development/learn?lessonSlug=prj301-http-servlet" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in PRJ301 — lesson 1.1: HTTP, request, response &amp; your first Servlet</span><span class="lc-sub">If you took PRJ301 on Academy, the request–response cycle, GET vs POST and status codes are the same ideas, seen from Java Servlets. This lesson adds: raw HTTP read with curl, the headers an API depends on, and why a missing Content-Type silently empties the body. If you have not taken PRJ301, this lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN PRJ301 LESSON →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-0-1-giao-thuc-quen" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper in the Authentication course — lesson 0.1: a protocol that forgets everything</span><span class="lc-sub">Same: every HTTP request stands alone; the server sees only a method, a path and headers. That lesson adds what this statelessness means for identity: remembering by IP (Bình becomes An behind one address) and by TCP connection (a new connection is a stranger) both fail on real requests, so the client must carry proof.</span></span>
  <span class="lc-cta">OPEN AUTHENTICATION LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>HTTP bạn thật sự cần</h2>
<p class="lead">Bạn không cần biết hết HTTP mới thiết kế được API tốt. Bạn cần đọc trôi chảy một request và một response — từng dòng, và vì sao dòng đó ở đó. Trong bài này bạn dựng một máy chủ "tấm gương" nhỏ xíu cho thấy chính xác cái gì tới nơi, rồi dùng curl gửi request tới nó cho tới khi định dạng này trở nên quen thuộc.</p>

<h3>Bước 0: một thư mục để tập</h3>
<p>Mọi bài tập của Mục 0 nằm trong một thư mục. Tạo nó một lần:</p>
<pre><code class="language-bash">mkdir -p ~/thu-api
cd ~/thu-api
node -v      <span class="tok-comment"># cần v22 trở lên — bài 0.3 hướng dẫn cài</span></code></pre>
<p>Nếu <code>node -v</code> không in gì hoặc in phiên bản dưới 22, hãy nhảy tới "Bước 1" của bài 0.3, cài Node rồi quay lại. Phần còn lại của bài chỉ cần Node và <code>curl</code> — curl có sẵn trên macOS, Linux và Windows 10/11 (trên Windows PowerShell hãy gõ <code>curl.exe</code> — bài 0.2 giải thích vì sao).</p>

<h3>Máy chủ tấm gương: thấy cái gì thật sự tới nơi</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · client</span><span class="lz-t">dòng request + header</span><span class="lz-d">POST /bookings HTTP/1.1 · Content-Type · Authorization</span></div>
  <div class="lz-step"><span class="lz-k">2 · body</span><span class="lz-t">tuỳ chọn</span><span class="lz-d">JSON — chỉ khi Content-Type nói vậy</span></div>
  <div class="lz-step"><span class="lz-k">3 · server</span><span class="lz-t">đọc và định tuyến</span><span class="lz-d">Express khớp phương thức + đường dẫn</span></div>
  <div class="lz-step"><span class="lz-k">4 · response</span><span class="lz-t">mã trạng thái + header + body</span><span class="lz-d">201 · Location · Content-Type · JSON</span></div>
</div>
<p>Framework giấu request "trần" khỏi mắt bạn. Để học HTTP ta cần điều ngược lại: một server phơi ra tất cả. Lưu tệp sau thành <code>echo.mjs</code> trong <code>~/thu-api</code>:</p>
<pre><code class="language-javascript"><span class="tok-comment">// echo.mjs — máy chủ "tấm gương": in ra request nó nhận được, rồi trả lại dạng JSON</span>
<span class="tok-keyword">import</span> { createServer } <span class="tok-keyword">from</span> <span class="tok-string">'node:http'</span>;

<span class="tok-keyword">const</span> server = <span class="tok-function">createServer</span>((req, res) =&gt; {
  <span class="tok-keyword">let</span> body = <span class="tok-string">''</span>;
  req.<span class="tok-function">on</span>(<span class="tok-string">'data'</span>, (chunk) =&gt; (body += chunk));
  req.<span class="tok-function">on</span>(<span class="tok-string">'end'</span>, () =&gt; {
    console.<span class="tok-function">log</span>(&#96;\${req.method} \${req.url} HTTP/\${req.httpVersion}&#96;);
    console.<span class="tok-function">log</span>(req.headers);
    <span class="tok-keyword">if</span> (body) console.<span class="tok-function">log</span>(<span class="tok-string">'body:'</span>, body);
    <span class="tok-keyword">const</span> reply = { method: req.method, url: req.url, headers: req.headers, body };
    res.<span class="tok-function">writeHead</span>(<span class="tok-number">200</span>, { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json; charset=utf-8'</span> });
    res.<span class="tok-function">end</span>(JSON.<span class="tok-function">stringify</span>(reply, <span class="tok-keyword">null</span>, <span class="tok-number">2</span>));
  });
});

server.<span class="tok-function">listen</span>(<span class="tok-number">4001</span>, () =&gt; console.<span class="tok-function">log</span>(<span class="tok-string">'echo server: http://localhost:4001'</span>));</code></pre>
<table>
  <thead><tr><th>Dòng</th><th>Làm gì</th></tr></thead>
  <tbody>
    <tr><td><code>import { createServer } from 'node:http'</code></td><td>Server HTTP có sẵn trong Node — không phải cài gì.</td></tr>
    <tr><td><code>req.on('data', …)</code></td><td>Body tới nơi thành từng mẩu (chunk); ta nối chúng lại.</td></tr>
    <tr><td><code>req.on('end', …)</code></td><td>Chạy khi toàn bộ request đã tới.</td></tr>
    <tr><td><code>console.log(…)</code></td><td>In request ra terminal <em>của server</em>.</td></tr>
    <tr><td><code>res.writeHead(200, …)</code></td><td>Viết dòng trạng thái và một header.</td></tr>
    <tr><td><code>res.end(JSON.stringify(reply, null, 2))</code></td><td>Gửi body — một bản sao thụt lề dễ đọc của những gì ta thấy — và kết thúc response.</td></tr>
  </tbody>
</table>
<p>Chạy nó ở một terminal và để đó:</p>
<pre><code class="language-bash">node echo.mjs</code></pre>
<div class="out">echo server: http://localhost:4001</div>
<p>Mở <strong>terminal thứ hai</strong> để gửi request. Hai terminal — một cho server, một cho client — là cách làm việc bình thường suốt phần còn lại của khoá.</p>

<h3>curl -i: response kèm cả header</h3>
<pre><code class="language-bash">curl -i 'http://localhost:4001/labs?building=Alpha'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Sat, 31 Oct 2026 15:39:54 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{
  "method": "GET",
  "url": "/labs?building=Alpha",
  "headers": {
    "host": "localhost:4001",
    "user-agent": "curl/8.7.1",
    "accept": "*/*"
  },
  "body": ""
}</div>
<p>Đọc từ trên xuống:</p>
<ul>
  <li><code>HTTP/1.1 200 OK</code> — <strong>dòng trạng thái</strong> (status line): phiên bản giao thức, mã trạng thái, và một cụm lý do cho người đọc.</li>
  <li>Năm <strong>header</strong>, mỗi dòng một cái theo dạng <code>Tên: giá-trị</code>. <code>Content-Type</code> do code của ta đặt; <code>Date</code>, <code>Connection</code>, <code>Keep-Alive</code> và <code>Transfer-Encoding</code> do server HTTP của Node tự thêm.</li>
  <li>Một <strong>dòng trống</strong> — nghĩa là "hết phần header".</li>
  <li><strong>Body</strong>: bản báo cáo của tấm gương. Nó cho thấy curl chỉ gửi ba header và không có body, và server thấy URL chỉ là <code>/labs?building=Alpha</code> — không có host, không có port.</li>
</ul>
<p>Nhìn sang terminal thứ nhất. Server đã in:</p>
<div class="out">GET /labs?building=Alpha HTTP/1.1
{ host: 'localhost:4001', 'user-agent': 'curl/8.7.1', accept: '*/*' }</div>

<div class="callout ok"><p><strong>Vì sao có dấu nháy quanh URL?</strong> Trong zsh và bash, <code>?</code> và <code>&amp;</code> mang nghĩa đặc biệt. Bọc URL có query trong dấu nháy đơn để shell chuyển nguyên văn nó cho curl. Tập thói quen này ngay từ bây giờ.</p></div>

<h3>curl -v: xem chính request bạn đã gửi</h3>
<pre><code class="language-bash">curl -v http://localhost:4001/labs/lab_1</code></pre>
<div class="out">* Host localhost:4001 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:4001...
* Connected to localhost (::1) port 4001
&gt; GET /labs/lab_1 HTTP/1.1
&gt; Host: localhost:4001
&gt; User-Agent: curl/8.7.1
&gt; Accept: */*
&gt;
* Request completely sent off
&lt; HTTP/1.1 200 OK
&lt; Content-Type: application/json; charset=utf-8
&lt; Date: Sat, 31 Oct 2026 15:40:02 GMT
&lt; Connection: keep-alive
&lt; Keep-Alive: timeout=5
&lt; Transfer-Encoding: chunked
&lt;
{ [172 bytes data]
* Connection #0 to host localhost left intact
{
  "method": "GET",
  "url": "/labs/lab_1",
  …</div>
<table>
  <thead><tr><th>Ký hiệu đầu dòng</th><th>Nghĩa</th></tr></thead>
  <tbody>
    <tr><td><code>*</code></td><td>curl kể nó đang làm gì: tra tên máy, kết nối, xong.</td></tr>
    <tr><td><code>&gt;</code></td><td>Một dòng curl đã <strong>gửi</strong> — đây chính xác là request của bạn.</td></tr>
    <tr><td><code>&lt;</code></td><td>Một dòng curl đã <strong>nhận</strong> — dòng trạng thái và header của response.</td></tr>
  </tbody>
</table>
<p>Để ý <code>localhost</code> được phân giải ra cả <code>::1</code> (IPv6) lẫn <code>127.0.0.1</code> (IPv4), và curl thử IPv6 trước. Điều đó bình thường; cả hai đều nghĩa là "chính máy này".</p>

<h3>Năm phần của một URL</h3>
<table>
  <thead><tr><th>Phần</th><th>Trong <code>http://localhost:4001/labs?building=Alpha</code></th><th>Nghĩa</th></tr></thead>
  <tbody>
    <tr><td>scheme</td><td><code>http</code></td><td>giao thức nào (<code>https</code> = HTTP qua mã hoá TLS)</td></tr>
    <tr><td>host</td><td><code>localhost</code></td><td>máy nào</td></tr>
    <tr><td>port (cổng)</td><td><code>4001</code></td><td>chương trình nào trên máy đó (mặc định 80 với http, 443 với https)</td></tr>
    <tr><td>path (đường dẫn)</td><td><code>/labs</code></td><td><strong>tài nguyên</strong> nào</td></tr>
    <tr><td>query</td><td><code>?building=Alpha</code></td><td>tuỳ chọn: lọc, sắp xếp, phân trang — các cặp <code>khoá=giá-trị</code> nối bằng <code>&amp;</code></td></tr>
  </tbody>
</table>
<p>Host và port dùng để <em>tìm</em> server; khi đã kết nối, server chỉ thấy path và query (header <code>Host</code> vẫn cho nó biết bạn hỏi website nào). Một luật thiết kế API mà Chương 1 sẽ xây tiếp: <strong>path</strong> gọi tên sự vật; <strong>query</strong> nói bạn muốn nó ra sao.</p>

<h3>Gửi dữ liệu: POST kèm body JSON</h3>
<pre><code class="language-bash">curl -i -X POST http://localhost:4001/bookings \\
  -H 'Content-Type: application/json' \\
  -d '{"labId":"lab_1","purpose":"Lab 3 SWT301"}'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Sat, 31 Oct 2026 15:40:02 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{
  "method": "POST",
  "url": "/bookings",
  "headers": {
    "host": "localhost:4001",
    "user-agent": "curl/8.7.1",
    "accept": "*/*",
    "content-type": "application/json",
    "content-length": "42"
  },
  "body": "{\\"labId\\":\\"lab_1\\",\\"purpose\\":\\"Lab 3 SWT301\\"}"
}</div>
<table>
  <thead><tr><th>Cờ</th><th>Nghĩa</th></tr></thead>
  <tbody>
    <tr><td><code>-X POST</code></td><td>Dùng phương thức POST (mặc định của curl là GET).</td></tr>
    <tr><td><code>-H 'Content-Type: application/json'</code></td><td>Thêm một header nói body là JSON.</td></tr>
    <tr><td><code>-d '…'</code></td><td>Dữ liệu (body) cần gửi.</td></tr>
    <tr><td><code>\\</code> ở cuối dòng</td><td>Nối dòng trong shell: lệnh còn tiếp ở dòng dưới.</td></tr>
  </tbody>
</table>
<p>Hai chi tiết trong output đáng chú ý. Một, curl tự thêm <code>content-length: 42</code>: body dài đúng 42 byte, và server cần con số đó để biết body kết thúc ở đâu. Hai, server nhận body dưới dạng <strong>chuỗi</strong> — các dấu nháy có gạch chéo <code>\\"</code> cho thấy đó vẫn là văn bản, còn phải được phân tích thành JSON. Trong Express, việc phân tích đó do <code>express.json()</code> làm (bài 0.3).</p>

<h3>Response: mã trạng thái kể câu chuyện</h3>
<table>
  <thead><tr><th>Họ</th><th>Nghĩa</th><th>Những mã bạn sẽ dùng trong khoá</th></tr></thead>
  <tbody>
    <tr><td><strong>1xx</strong></td><td>thông tin, "chờ chút"</td><td>hiếm gặp trong API</td></tr>
    <tr><td><strong>2xx</strong></td><td>thành công</td><td>200 OK · 201 Created · 204 No Content</td></tr>
    <tr><td><strong>3xx</strong></td><td>hãy tìm ở chỗ khác</td><td>301 Moved Permanently · 304 Not Modified (Chương 9)</td></tr>
    <tr><td><strong>4xx</strong></td><td><strong>client</strong> làm sai</td><td>400 · 401 · 403 · 404 · 405 · 409 · 415 · 422 · 429</td></tr>
    <tr><td><strong>5xx</strong></td><td><strong>server</strong> bị lỗi</td><td>500 Internal Server Error · 503 Service Unavailable</td></tr>
  </tbody>
</table>
<p>Cụm lý do ("OK", "Not Found") chỉ để người đọc; chương trình nhìn vào con số. Khi gỡ lỗi, hãy đọc <strong>chữ số đầu trước</strong>: nó cho biết nên nhìn vào request của bạn (4) hay vào server (5).</p>

<h3>Những header bạn sẽ thật sự gặp</h3>
<table>
  <thead><tr><th>Header</th><th>Ai gửi</th><th>Nhiệm vụ</th></tr></thead>
  <tbody>
    <tr><td><code>Content-Type</code></td><td>cả hai</td><td>định dạng của body, ví dụ <code>application/json; charset=utf-8</code></td></tr>
    <tr><td><code>Accept</code></td><td>client</td><td>các định dạng client đọc được; <code>*/*</code> là gì cũng được</td></tr>
    <tr><td><code>Authorization</code></td><td>client</td><td>bạn là ai, ví dụ <code>Bearer &lt;token&gt;</code> (bài 1.3, Chương 6)</td></tr>
    <tr><td><code>Content-Length</code></td><td>cả hai</td><td>kích thước body tính bằng byte</td></tr>
    <tr><td><code>Location</code></td><td>server</td><td>URL của tài nguyên vừa được tạo (đi với 201) hoặc nơi chuyển hướng (đi với 3xx)</td></tr>
    <tr><td><code>Cache-Control</code>, <code>ETag</code></td><td>server</td><td>có được cache không, và đây là phiên bản nào (Chương 9)</td></tr>
  </tbody>
</table>
<p><strong>Tên</strong> header không phân biệt hoa thường — <code>content-type</code> và <code>Content-Type</code> là cùng một header. Vì vậy tấm gương in chúng toàn chữ thường: Node đã chuẩn hoá. <strong>Giá trị</strong> header là chuyện khác; bài 1.4 cho thấy một lỗi sinh ra vì coi một giá trị là phân biệt hoa thường.</p>

<h3>Phương thức: động từ của request</h3>
<table>
  <thead><tr><th>Phương thức</th><th>Ý định</th><th>Ví dụ LabFlow</th></tr></thead>
  <tbody>
    <tr><td>GET</td><td>đọc; không được thay đổi gì</td><td><code>GET /labs</code></td></tr>
    <tr><td>POST</td><td>tạo một phần tử mới trong bộ sưu tập, hoặc kích hoạt một hành động</td><td><code>POST /bookings</code></td></tr>
    <tr><td>PUT</td><td>thay toàn bộ tài nguyên tại URL này</td><td><code>PUT /devices/dev_1</code></td></tr>
    <tr><td>PATCH</td><td>sửa một vài trường</td><td><code>PATCH /devices/dev_1</code></td></tr>
    <tr><td>DELETE</td><td>xoá</td><td><code>DELETE /devices/dev_2</code></td></tr>
    <tr><td>HEAD</td><td>như GET nhưng chỉ lấy header</td><td><code>curl -I …</code></td></tr>
    <tr><td>OPTIONS</td><td>hỏi ở đây được dùng những phương thức nào</td><td><code>curl -X OPTIONS …</code></td></tr>
  </tbody>
</table>
<p>Thử HEAD với tấm gương: <code>curl -I http://localhost:4001/labs</code> in dòng trạng thái và header nhưng không có body. Bài 1.2 giải thích phương thức nào <em>an toàn</em> (safe) và <em>idempotent</em> (lặp lại không đổi kết quả) — hai lời hứa quyết định client có được gửi lại request hay không.</p>

<h3>HTTP không nhớ bạn</h3>
<p>HTTP là <strong>stateless</strong> (không giữ trạng thái): mỗi request được hiểu riêng lẻ, không có ký ức về các request trước. Nếu server cần biết bạn là ai, request phải nói ra — thường bằng header <code>Authorization</code> hoặc cookie — <em>ở mọi lần</em>. "Vẫn đăng nhập" chính là việc client gửi lại thông tin xác thực ở từng request.</p>
<p>Nghe như một hạn chế, nhưng với API đó là siêu năng lực: vì không request nào phụ thuộc vào bộ nhớ của server, bạn có thể chạy cùng một API trên hai, năm hay năm mươi server phía sau bộ cân bằng tải, và server nào cũng trả lời được request nào. Chương 8 xây tiếp trên ý này.</p>

<h3>HTTP/1.1, HTTP/2, HTTP/3</h3>
<p>Mọi thứ ở trên là HTTP/1.1, dạng văn bản thuần, dễ đọc. HTTP/2 (2015) gửi cùng những thông điệp đó dưới dạng khung nhị phân và cho nhiều request dùng chung một kết nối; HTTP/3 (2022) chạy trên QUIC dùng UDP thay vì TCP. Với thiết kế API thì không gì thay đổi: phương thức, mã trạng thái và header mang cùng một nghĩa ở cả ba, vì nghĩa đó được định nghĩa một lần trong RFC 9110. Hãy học ý nghĩa trên HTTP/1.1; các phiên bản nhanh hơn là lựa chọn hạ tầng.</p>

<h3>Bẫy: quên Content-Type</h3>
<p>Gửi JSON bằng <code>-d</code> mà không có header, rồi xem tấm gương nhận được gì:</p>
<pre><code class="language-bash">curl -X POST http://localhost:4001/bookings -d '{"labId":"lab_1"}'</code></pre>
<div class="out">{
  "method": "POST",
  "url": "/bookings",
  "headers": {
    "host": "localhost:4001",
    "user-agent": "curl/8.7.1",
    "accept": "*/*",
    "content-length": "17",
    "content-type": "application/x-www-form-urlencoded"
  },
  "body": "{\\"labId\\":\\"lab_1\\"}"
}</div>
<p>curl đã dán nhãn body là một <strong>form</strong> HTML. Các byte vẫn tới nơi, nhưng <code>express.json()</code> chỉ phân tích những body được dán nhãn JSON, nên trong một API Express, handler của bạn sẽ thấy <strong>không có body nào</strong>. Đây là câu trả lời của LabFlow API (Chương 1) cho đúng lỗi đó:</p>
<pre><code class="language-bash">curl -X POST http://localhost:4000/bookings -H "Authorization: Bearer tok_an" \\
  -d '{"labId":"lab_1","startAt":"2026-11-02T08:00:00+07:00","endAt":"2026-11-02T10:00:00+07:00"}'</code></pre>
<div class="out">{
  "error": "VALIDATION_FAILED",
  "message": "Dữ liệu gửi lên chưa đúng định dạng",
  "details": [
    {
      "field": "labId",
      "issue": "required"
    },
    {
      "field": "startAt",
      "issue": "must be ISO 8601 with timezone"
    },
    {
      "field": "endAt",
      "issue": "must be ISO 8601 with timezone"
    }
  ]
}</div>
<p>Trường nào cũng bị coi là "thiếu", dù rõ ràng bạn đã gửi. Đây là một trong những khoảnh khắc "API hỏng rồi!" phổ biến nhất trong đồ án nhóm. Sửa bằng <code>-H 'Content-Type: application/json'</code>, hoặc dùng <code>curl --json '…'</code> để curl tự đặt header (bài 0.2).</p>

<div class="pitfall"><p><strong>Bẫy — thử API bằng thanh địa chỉ trình duyệt.</strong> Thanh địa chỉ chỉ gửi được GET, không thêm được header <code>Authorization</code> và giấu luôn dòng trạng thái. Một trang "mở được" trên trình duyệt gần như chẳng nói gì về API. Hãy dùng curl và đọc dòng trạng thái.</p></div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Với <code>echo.mjs</code> đang chạy, gửi <code>GET /labs/lab_3?view=full&amp;lang=vi</code> bằng <code>curl -i</code>. Tìm path và hai tham số query trong báo cáo của tấm gương.</li>
  <li>Gửi một POST có body JSON <code>{"labId":"lab_2","seats":3}</code> — một lần có header Content-Type, một lần không có. So sánh dòng <code>content-type</code> mà tấm gương báo về.</li>
  <li>Thêm header của riêng bạn <code>-H 'X-Student: &lt;tên bạn&gt;'</code> và tìm nó trong terminal của server. Tên của nó được in hoa hay thường?</li>
  <li>Chạy <code>curl -v</code> với một URL bất kỳ và chép riêng những dòng bắt đầu bằng <code>&gt;</code>. Đó là toàn bộ request của bạn, dưới dạng văn bản.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được dòng request, từng header và body của chính request mình trong output <code>curl -v</code>, và giải thích được vì sao bản không có Content-Type sẽ hỏng trong một API Express.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Request line / status line (dòng request / dòng trạng thái)</span><span class="v">Dòng đầu của request (phương thức, path, phiên bản) / của response (phiên bản, mã, lý do).</span></div>
  <div class="kv"><span class="k">Header (tiêu đề)</span><span class="v">Một dòng <code>Tên: giá-trị</code> mô tả thông tin về thông điệp.</span></div>
  <div class="kv"><span class="k">Body (thân)</span><span class="v">Phần dữ liệu sau dòng trống; có thể không có.</span></div>
  <div class="kv"><span class="k">Query string (chuỗi truy vấn)</span><span class="v">Phần <code>?khoá=giá-trị&amp;…</code> của URL: tuỳ chọn, không phải bản thân tài nguyên.</span></div>
  <div class="kv"><span class="k">Status code (mã trạng thái)</span><span class="v">Ba chữ số; chữ số đầu cho biết họ (2 ổn, 4 lỗi client, 5 lỗi server).</span></div>
  <div class="kv"><span class="k">Content-Type</span><span class="v">Header cho biết body thuộc định dạng gì.</span></div>
  <div class="kv"><span class="k">Stateless (không giữ trạng thái)</span><span class="v">Mỗi request mang đủ mọi thứ cần thiết; server không nhớ cuộc trò chuyện.</span></div>
  <div class="kv"><span class="k">curl -i / -v</span><span class="v">Hiện header của response / hiện toàn bộ cuộc trao đổi hai chiều.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mỗi lời gọi API là một request và đúng một response, cả hai đều là văn bản thuần trong HTTP/1.1.</li>
  <li>Request gồm: dòng request, header, dòng trống, body (tuỳ). Response gồm: dòng trạng thái, header, dòng trống, body (tuỳ).</li>
  <li><code>curl -i</code> hiện response kèm header; <code>curl -v</code> cho thấy bạn thật sự đã gửi gì.</li>
  <li>Path của URL gọi tên tài nguyên; query đưa tuỳ chọn.</li>
  <li>Đọc chữ số đầu của mã trạng thái trước; tên header không phân biệt hoa thường.</li>
  <li>HTTP không giữ trạng thái, và có body thì phải có <code>Content-Type</code> đúng.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=sdn302-1-2-http-server" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp phần này ở SDN302 — bài 1.2: API, HTTP &amp; server Node đầu tiên</span><span class="lc-sub">Nếu bạn đã học SDN302 trên Academy, phần này sẽ quen. Giống: các phần của request và response (phương thức, URL, header, body, mã trạng thái) và một server dựng bằng module http của Node. Khác: SDN302 dựng server để trả dữ liệu; ở đây server là tấm gương để đọc chính HTTP. Bài này thêm: đọc curl -i và curl -v từng dòng, năm phần của URL, tính không giữ trạng thái và bẫy thiếu Content-Type. Chưa học SDN302 cũng không sao — bài này tự đứng được từ đầu.</span></span>
  <span class="lc-cta">MỞ BÀI SDN302 →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/java-web-application-development/learn?lessonSlug=prj301-http-servlet" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp phần này ở PRJ301 — bài 1.1: HTTP, request, response &amp; Servlet đầu tiên</span><span class="lc-sub">Nếu bạn đã học PRJ301 trên Academy, vòng request–response, GET với POST và mã trạng thái là cùng những ý đó, nhìn từ Java Servlet. Bài này thêm: đọc HTTP "trần" bằng curl, những header mà một API dựa vào, và vì sao thiếu Content-Type làm body lặng lẽ biến mất. Chưa học PRJ301 thì bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI PRJ301 →</span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-0-1-giao-thuc-quen" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn ở khoá Authentication — bài 0.1: một giao thức quên sạch mọi thứ</span><span class="lc-sub">Giống: mỗi HTTP request đứng một mình; server chỉ thấy method, đường dẫn và header. Bài đó thêm ý nghĩa của việc không trạng thái với danh tính: nhớ theo IP (Bình thành An sau cùng một địa chỉ) và theo kết nối TCP (kết nối mới là người lạ) đều hỏng trên request thật, nên client phải mang theo bằng chứng.</span></span>
  <span class="lc-cta">MỞ BÀI AUTHENTICATION →</span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-6-1-request-response" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 6.1 — request and response from zero</span><span class="lc-sub">Type a request by hand over TCP, read every line of curl -v, stateless explained</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-6-1-request-response" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 6.1 — request và response từ số 0</span><span class="lc-sub">Gõ request bằng tay qua TCP, đọc từng dòng curl -v, phi trạng thái</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — Tools: curl, HTTPie, Postman and Bruno|||0.2 — Công cụ: curl, HTTPie, Postman và Bruno',
      slug: 'api-0-2-bo-cong-cu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mười cờ curl dùng cả khoá, curl trong script, bẫy PowerShell và dấu nháy, HTTPie và cái bẫy sắp xếp lại, Postman và Bruno (collection trong git).',
      content: `${G004}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Tools: curl, HTTPie, Postman and Bruno</h2>
<p class="lead">To design an API you have to talk to it a lot: send a request, read the status, change one header, try again. This lesson gives you a toolbox for that — curl first, because it shows everything and fits in one copy-pasteable line, then HTTPie, Postman and Bruno — and the traps each one hides. Keep the mirror server from lesson 0.1 running (<code>node echo.mjs</code>, port 4001): it shows exactly what every tool sends.</p>

<h3>Why the address bar is not a test tool</h3>
<p>A browser address bar sends one kind of request: <code>GET</code>, with the browser’s own headers. It cannot send <code>POST</code>, <code>PUT</code>, <code>PATCH</code> or <code>DELETE</code>, cannot add <code>Authorization: Bearer …</code>, cannot send a JSON body, and shows the status code only inside DevTools. For an API, that is not enough even to start.</p>

<h3>curl: the ten flags you will use</h3>
<table>
  <thead><tr><th>Flag</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><code>-i</code></td><td>include response headers</td><td><code>curl -i URL</code></td></tr>
    <tr><td><code>-v</code></td><td>verbose: the full exchange, both directions</td><td><code>curl -v URL</code></td></tr>
    <tr><td><code>-X</code></td><td>choose the method</td><td><code>-X DELETE</code></td></tr>
    <tr><td><code>-H</code></td><td>add a header (repeatable)</td><td><code>-H 'Authorization: Bearer tok_an'</code></td></tr>
    <tr><td><code>-d</code></td><td>send a body; implies POST unless <code>-X</code> says otherwise</td><td><code>-d 'a=1'</code></td></tr>
    <tr><td><code>--json</code></td><td>send JSON and set <code>Content-Type</code> + <code>Accept</code> (curl ≥ 7.82)</td><td><code>--json '{"a":1}'</code></td></tr>
    <tr><td><code>-I</code></td><td>HEAD request: status and headers only</td><td><code>curl -I URL</code></td></tr>
    <tr><td><code>-s</code></td><td>silent: no progress meter</td><td><code>curl -s URL</code></td></tr>
    <tr><td><code>-o FILE</code></td><td>write the body to a file (<code>/dev/null</code> = throw away)</td><td><code>-o /dev/null</code></td></tr>
    <tr><td><code>-w FORMAT</code></td><td>print chosen facts after the transfer</td><td><code>-w '%{http_code}\\n'</code></td></tr>
    <tr><td><code>-L</code></td><td>follow redirects (3xx)</td><td><code>curl -L URL</code></td></tr>
  </tbody>
</table>
<p>Check your version once with <code>curl --version</code>; this course was run with curl 8.7.1. The full manual is at <a href="https://curl.se/docs/manpage.html" target="_blank" rel="noopener">curl.se/docs/manpage.html</a>.</p>

<h3>--json: one flag instead of two headers</h3>
<pre><code class="language-bash">curl --json '{"labId":"lab_1"}' http://localhost:4001/bookings</code></pre>
<div class="out">{
  "method": "POST",
  "url": "/bookings",
  "headers": {
    "host": "localhost:4001",
    "user-agent": "curl/8.7.1",
    "content-type": "application/json",
    "accept": "application/json",
    "content-length": "17"
  },
  "body": "{\\"labId\\":\\"lab_1\\"}"
}</div>
<p>Three things happened without being asked: the method became <code>POST</code> (because there is a body), <code>content-type</code> became <code>application/json</code>, and <code>accept</code> became <code>application/json</code>. For <code>PUT</code>, <code>PATCH</code> or <code>DELETE</code> add <code>-X</code>: <code>curl -X PATCH --json '…' URL</code>.</p>

<h3>curl in scripts: only the status code</h3>
<pre><code class="language-bash">BASE=http://localhost:4001
curl -s -o /dev/null -w "%{http_code} %{content_type}\\n" $BASE/labs</code></pre>
<div class="out">200 application/json; charset=utf-8</div>
<p>A shell variable writes the host once; <code>-s</code> hides the progress meter, <code>-o /dev/null</code> discards the body, and <code>-w</code> prints just what you asked for. One line per endpoint gives a “smoke test” (a quick is-it-alive check): a <strong>404</strong> on a route you deployed means the route is not mounted; <strong>200</strong> or <strong>401</strong> means it is there. Real deploy scripts do exactly this after every release.</p>

<div class="callout ok"><p><strong>What is that progress meter?</strong> If you redirect curl’s output to a file or a pipe, curl prints a small transfer table (<code>% Total % Received …</code>) on the error stream. In an interactive terminal you usually do not see it. <code>-s</code> turns it off everywhere.</p></div>

<h3>Windows: the fake “curl” and the quotes</h3>
<p>In <strong>Windows PowerShell 5.1</strong>, the word <code>curl</code> is an <strong>alias</strong> for the PowerShell command <code>Invoke-WebRequest</code> — Microsoft’s documentation lists <code>iwr</code>, <code>curl</code> and <code>wget</code> as its aliases. It takes different parameters and prints different output, so lesson commands fail in confusing ways. The real curl ships with Windows 10 and 11 as <code>curl.exe</code>; type the <code>.exe</code>. PowerShell 7 no longer has the alias.</p>
<p>The second problem is quoting: PowerShell and <code>cmd</code> handle <code>'…'</code> and <code>"…"</code> differently from bash/zsh, so a JSON body in quotes often arrives broken. The easy fixes are to use <strong>Git Bash</strong> or <strong>WSL</strong> (all course commands then work as written), or to keep the JSON in a file:</p>
<pre><code class="language-powershell"><span class="tok-comment"># PowerShell — real curl, body from a file (shown for reference; the course outputs were produced on macOS)</span>
Set-Content body.json '{"labId":"lab_1"}'
curl.exe -i --json "@body.json" http://localhost:4001/bookings</code></pre>
<p>Source: <a href="https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest?view=powershell-5.1" target="_blank" rel="noopener">Microsoft Learn — Invoke-WebRequest (PowerShell 5.1)</a>.</p>

<h3>Trap: quotes around JSON in bash and zsh</h3>
<pre><code class="language-bash">BASE=http://localhost:4001
curl -s --json "{"labId":"lab_1"}" $BASE/bookings | grep body
echo '{"labId":"lab_1"}' &gt; body.json
curl -s --json @body.json $BASE/bookings | grep body</code></pre>
<div class="out">  "body": "{labId:lab_1}"
  "body": "{\\"labId\\":\\"lab_1\\"}\\n"</div>
<p>With double quotes outside, the shell treats each inner <code>"</code> as the end or start of a string and drops it, so the server receives <code>{labId:lab_1}</code> — not JSON. An Express API answers 400 (“Body không phải JSON hợp lệ” in LabFlow), and it is easy to blame the server. Rule: <strong>single quotes outside, double quotes inside</strong>, or keep the body in a file and use <code>@file</code>. Notice the file version also sent the newline that <code>echo</code> added — harmless for JSON.</p>

<h3>HTTPie: shorter commands for humans</h3>
<p>HTTPie (<code>http</code> command; install from <a href="https://httpie.io/docs/cli" target="_blank" rel="noopener">httpie.io/docs/cli</a>) uses a friendlier syntax and sends JSON by default:</p>
<pre><code class="language-bash">http POST :4001/bookings labId=lab_1 seats:=2 urgent:=true</code></pre>
<div class="out">HTTP/1.1 200 OK
Connection: keep-alive
Content-Type: application/json; charset=utf-8
Date: Sat, 31 Oct 2026 15:58:29 GMT
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{
    "body": "{\\"labId\\": \\"lab_1\\", \\"seats\\": 2, \\"urgent\\": true}",
    "headers": {
        "accept": "application/json, */*;q=0.5",
        "accept-encoding": "gzip, deflate, br, zstd",
        "connection": "keep-alive",
        "content-length": "46",
        "content-type": "application/json",
        "host": "localhost:4001",
        "user-agent": "HTTPie/3.2.4"
    },
    "method": "POST",
    "url": "/bookings"
}</div>
<table>
  <thead><tr><th>HTTPie syntax</th><th>Becomes</th></tr></thead>
  <tbody>
    <tr><td><code>:4001/bookings</code></td><td><code>http://localhost:4001/bookings</code></td></tr>
    <tr><td><code>labId=lab_1</code></td><td>JSON field with a <strong>string</strong> value</td></tr>
    <tr><td><code>seats:=2</code>, <code>urgent:=true</code></td><td>raw JSON: a <strong>number</strong>, a <strong>boolean</strong></td></tr>
    <tr><td><code>building==Alpha</code></td><td>query parameter <code>?building=Alpha</code></td></tr>
    <tr><td><code>Authorization:'Bearer tok_an'</code></td><td>a header</td></tr>
  </tbody>
</table>

<h3>Trap: HTTPie re-sorts what it shows you</h3>
<p>Compare the same LabFlow endpoint (from lesson 0.3) through both tools:</p>
<pre><code class="language-bash">http :4000/labs/lab_1</code></pre>
<div class="out">HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 122
Content-Type: application/json; charset=utf-8
Date: Sat, 31 Oct 2026 15:41:14 GMT
ETag: W/"7a-uvX+0yMOfNePX7T77wYjzSxsZuw"
Keep-Alive: timeout=5

{
    "building": "Alpha",
    "capacity": 30,
    "code": "AL-201",
    "id": "lab_1",
    "name": "Phòng Lab Mạng máy tính"
}</div>
<pre><code class="language-bash">curl http://localhost:4000/labs/lab_1</code></pre>
<div class="out">{
  "id": "lab_1",
  "code": "AL-201",
  "name": "Phòng Lab Mạng máy tính",
  "building": "Alpha",
  "capacity": 30
}</div>
<p>HTTPie’s pretty-printer sorted the JSON keys and the headers alphabetically and re-indented with four spaces. The server sent <code>id</code> first. JSON objects are unordered by definition, so clients should not depend on key order — but when you are checking “what exactly does my API return?”, read curl’s output or use <code>http --pretty=none</code>.</p>

<h3>Postman: the popular GUI</h3>
<ul>
  <li>Choose a method, type a URL, fill the <strong>Headers</strong> and <strong>Body</strong> tabs, press <strong>Send</strong>; status, headers and body appear in panels.</li>
  <li><strong>Collections</strong> group saved requests in folders; <strong>environments</strong> hold variables such as <code>{{baseUrl}}</code> = <code>http://localhost:4000</code> on your laptop and the real address on a server.</li>
  <li><strong>Tests</strong>: short scripts that check each response (status is 201, body has an <code>id</code>…).</li>
</ul>
<div class="pitfall"><p><strong>Trap — secrets in a shared workspace.</strong> Postman collections usually live in a Postman account or a cloud workspace. A token pasted into a shared workspace is a token published to everyone in it. Use environment variables marked as secret, or keep real secrets out entirely.</p></div>

<h3>Bruno: requests as plain files in your repo</h3>
<p>Bruno (<a href="https://docs.usebruno.com/introduction/what-is-bruno" target="_blank" rel="noopener">docs.usebruno.com</a>, open source under the MIT licence at <a href="https://github.com/usebruno/bruno" target="_blank" rel="noopener">github.com/usebruno/bruno</a>) is a desktop app like Postman, but <strong>offline-first</strong> and without an account. A collection is a folder of plain-text files — older versions use its own <code>.bru</code> format, newer ones YAML — so you commit it next to your code:</p>
<pre><code class="language-plaintext">labflow-api/
├── src/
├── package.json
└── api-requests/          ← Bruno collection
    ├── labs/
    │   ├── list-labs
    │   └── get-lab
    └── environments/
        └── local          ← baseUrl = http://localhost:4000</code></pre>
<p>In a team project this is a quiet superpower: when the back-end changes an endpoint, the matching request changes in the same pull request, and the front-end developer pulls a working example instead of reading a chat message.</p>

<h3>Which tool when?</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">curl</span><span class="lz-lnote">exact bytes, scripts, CI, every lesson of this course</span></div>
  <div class="lz-layer"><span class="lz-lname">HTTPie</span><span class="lz-lnote">readable output for people; re-sorts what it shows</span></div>
  <div class="lz-layer"><span class="lz-lname">Postman</span><span class="lz-lnote">GUI, collections shared in a team account</span></div>
  <div class="lz-layer"><span class="lz-lname">Bruno</span><span class="lz-lnote">requests as plain files in the repo — reviewed like code</span></div>
</div>
<table>
  <thead><tr><th>Tool</th><th>Best for</th><th>Shared how</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td><strong>curl</strong></td><td>lessons, bug reports, scripts, servers without a screen</td><td>one copy-paste line</td><td>free, preinstalled</td></tr>
    <tr><td><strong>HTTPie</strong></td><td>fast typing while exploring</td><td>one line</td><td>free CLI</td></tr>
    <tr><td><strong>Postman</strong></td><td>big third-party APIs, demos to non-developers</td><td>cloud workspace</td><td>free tier + paid plans</td></tr>
    <tr><td><strong>Bruno</strong></td><td>team projects that live in git</td><td>files in the repository</td><td>free core</td></tr>
  </tbody>
</table>
<p>The rule for this course: learn with <strong>curl</strong> (you see everything), choose <strong>one</strong> GUI for your team and commit its collection, and never paste real secrets into any of them.</p>

<a class="link-card" href="https://everything.curl.dev/http/post/json.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Everything curl — JSON (--json) — read 1 Nov 2026</span><span class="lc-sub">curl 7.82.0 added --json: it sends the data with POST and sets both Content-Type and Accept to application/json — curl does not check that the data is valid JSON.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>With <code>echo.mjs</code> running, set <code>BASE=http://localhost:4001</code> and send the same POST three ways: <code>-H</code> + <code>-d</code>, <code>--json</code>, and <code>--json @body.json</code>. Confirm all three show <code>"content-type": "application/json"</code>.</li>
  <li>Write a one-line smoke check that prints only the status code of <code>$BASE/health</code>, <code>$BASE/labs</code> and <code>$BASE/nothing</code> (the mirror answers 200 to everything — note it; in lesson 0.3 the real API will not).</li>
  <li>Reproduce the double-quote trap on purpose and read the broken body the mirror shows.</li>
  <li>If you use Windows: run <code>Get-Alias curl</code> in Windows PowerShell and note what it points to; then repeat step 1 with <code>curl.exe</code>.</li>
</ol>
<p><strong>Done when:</strong> you can send a JSON body with the right Content-Type in two different ways, and you can explain from the mirror output why the double-quote version is not JSON.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CLI</span><span class="v">Command-line interface: a program you drive by typing (curl, HTTPie).</span></div>
  <div class="kv"><span class="k">GUI</span><span class="v">Graphical interface with windows and buttons (Postman, Bruno).</span></div>
  <div class="kv"><span class="k">Collection</span><span class="v">A saved, organised set of requests in a GUI tool.</span></div>
  <div class="kv"><span class="k">Environment variable (tool)</span><span class="v">A named value such as <code>baseUrl</code> reused across requests.</span></div>
  <div class="kv"><span class="k">Alias</span><span class="v">A second name for a command; in PowerShell 5.1 <code>curl</code> = <code>Invoke-WebRequest</code>.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">A quick check that each endpoint answers at all, run after a deploy.</span></div>
  <div class="kv"><span class="k">Pretty-print</span><span class="v">Re-format output for reading — may re-order or re-indent it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The address bar only sends GET; API work needs control of method, headers and body.</li>
  <li>Ten curl flags (<code>-i -v -X -H -d --json -I -s -o -w -L</code>) cover this whole course.</li>
  <li><code>--json</code> sets Content-Type and Accept; with a body curl defaults to POST.</li>
  <li>Windows PowerShell 5.1: type <code>curl.exe</code>; in every shell, wrap JSON in single quotes or use <code>@file</code>.</li>
  <li>HTTPie is shorter but its pretty-printer re-sorts keys and headers.</li>
  <li>Postman lives in an account/workspace; Bruno keeps collections as files in git.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Công cụ: curl, HTTPie, Postman và Bruno</h2>
<p class="lead">Để thiết kế API, bạn phải "nói chuyện" với nó rất nhiều: gửi request, đọc mã trạng thái, đổi một header, thử lại. Bài này trao cho bạn một hộp đồ nghề cho việc đó — curl trước tiên, vì nó cho thấy mọi thứ và vừa trong một dòng dán được, rồi tới HTTPie, Postman và Bruno — cùng những cái bẫy mỗi công cụ giấu bên trong. Giữ máy chủ tấm gương ở bài 0.1 đang chạy (<code>node echo.mjs</code>, cổng 4001): nó cho thấy chính xác mỗi công cụ gửi đi những gì.</p>

<h3>Vì sao thanh địa chỉ không phải công cụ thử API</h3>
<p>Thanh địa chỉ trình duyệt chỉ gửi một kiểu request: <code>GET</code>, kèm các header của riêng trình duyệt. Nó không gửi được <code>POST</code>, <code>PUT</code>, <code>PATCH</code> hay <code>DELETE</code>, không thêm được <code>Authorization: Bearer …</code>, không gửi được body JSON, và chỉ hiện mã trạng thái trong DevTools. Với API, như thế còn chưa đủ để bắt đầu.</p>

<h3>curl: mười cờ bạn sẽ dùng</h3>
<table>
  <thead><tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td><code>-i</code></td><td>kèm header của response</td><td><code>curl -i URL</code></td></tr>
    <tr><td><code>-v</code></td><td>verbose (chi tiết): toàn bộ cuộc trao đổi, hai chiều</td><td><code>curl -v URL</code></td></tr>
    <tr><td><code>-X</code></td><td>chọn phương thức</td><td><code>-X DELETE</code></td></tr>
    <tr><td><code>-H</code></td><td>thêm một header (lặp lại được)</td><td><code>-H 'Authorization: Bearer tok_an'</code></td></tr>
    <tr><td><code>-d</code></td><td>gửi body; tự thành POST nếu không có <code>-X</code> khác</td><td><code>-d 'a=1'</code></td></tr>
    <tr><td><code>--json</code></td><td>gửi JSON và đặt luôn <code>Content-Type</code> + <code>Accept</code> (curl ≥ 7.82)</td><td><code>--json '{"a":1}'</code></td></tr>
    <tr><td><code>-I</code></td><td>request HEAD: chỉ mã trạng thái và header</td><td><code>curl -I URL</code></td></tr>
    <tr><td><code>-s</code></td><td>silent (im lặng): không in thanh tiến trình</td><td><code>curl -s URL</code></td></tr>
    <tr><td><code>-o TỆP</code></td><td>ghi body ra tệp (<code>/dev/null</code> = vứt đi)</td><td><code>-o /dev/null</code></td></tr>
    <tr><td><code>-w ĐỊNH_DẠNG</code></td><td>in ra những thông tin bạn chọn sau khi xong</td><td><code>-w '%{http_code}\\n'</code></td></tr>
    <tr><td><code>-L</code></td><td>đi theo chuyển hướng (3xx)</td><td><code>curl -L URL</code></td></tr>
  </tbody>
</table>
<p>Kiểm phiên bản một lần bằng <code>curl --version</code>; khoá này chạy với curl 8.7.1. Hướng dẫn đầy đủ ở <a href="https://curl.se/docs/manpage.html" target="_blank" rel="noopener">curl.se/docs/manpage.html</a>.</p>

<h3>--json: một cờ thay cho hai header</h3>
<pre><code class="language-bash">curl --json '{"labId":"lab_1"}' http://localhost:4001/bookings</code></pre>
<div class="out">{
  "method": "POST",
  "url": "/bookings",
  "headers": {
    "host": "localhost:4001",
    "user-agent": "curl/8.7.1",
    "content-type": "application/json",
    "accept": "application/json",
    "content-length": "17"
  },
  "body": "{\\"labId\\":\\"lab_1\\"}"
}</div>
<p>Ba điều xảy ra mà ta không cần yêu cầu: phương thức thành <code>POST</code> (vì có body), <code>content-type</code> thành <code>application/json</code>, và <code>accept</code> thành <code>application/json</code>. Với <code>PUT</code>, <code>PATCH</code> hay <code>DELETE</code> thì thêm <code>-X</code>: <code>curl -X PATCH --json '…' URL</code>.</p>

<h3>curl trong script: chỉ lấy mã trạng thái</h3>
<pre><code class="language-bash">BASE=http://localhost:4001
curl -s -o /dev/null -w "%{http_code} %{content_type}\\n" $BASE/labs</code></pre>
<div class="out">200 application/json; charset=utf-8</div>
<p>Biến shell giúp viết địa chỉ một lần; <code>-s</code> giấu thanh tiến trình, <code>-o /dev/null</code> bỏ body, và <code>-w</code> in đúng thứ bạn hỏi. Mỗi endpoint một dòng là có ngay một "smoke test" (kiểm tra nhanh còn sống không): <strong>404</strong> ở một route bạn vừa deploy nghĩa là route chưa được gắn; <strong>200</strong> hoặc <strong>401</strong> nghĩa là nó có ở đó. Các script deploy thật làm đúng việc này sau mỗi lần phát hành.</p>

<div class="callout ok"><p><strong>Cái bảng tiến trình đó là gì?</strong> Khi bạn chuyển output của curl vào tệp hay qua ống (pipe), curl in một bảng nhỏ về quá trình truyền (<code>% Total % Received …</code>) ra luồng lỗi. Trên terminal tương tác thường bạn không thấy nó. <code>-s</code> tắt nó ở mọi nơi.</p></div>

<h3>Windows: "curl" giả và chuyện dấu nháy</h3>
<p>Trong <strong>Windows PowerShell 5.1</strong>, chữ <code>curl</code> là một <strong>bí danh</strong> (alias) của lệnh PowerShell <code>Invoke-WebRequest</code> — tài liệu của Microsoft liệt kê <code>iwr</code>, <code>curl</code> và <code>wget</code> là các bí danh của nó. Nó nhận tham số khác, in output khác, nên lệnh trong bài sẽ hỏng theo những cách rất khó hiểu. curl thật có sẵn trên Windows 10 và 11 dưới tên <code>curl.exe</code>; hãy gõ cả phần <code>.exe</code>. PowerShell 7 không còn bí danh này.</p>
<p>Vấn đề thứ hai là dấu nháy: PowerShell và <code>cmd</code> xử lý <code>'…'</code> và <code>"…"</code> khác bash/zsh, nên body JSON trong dấu nháy thường tới nơi bị vỡ. Cách sửa dễ nhất là dùng <strong>Git Bash</strong> hoặc <strong>WSL</strong> (khi đó mọi lệnh của khoá chạy đúng như viết), hoặc để JSON trong một tệp:</p>
<pre><code class="language-powershell"><span class="tok-comment"># PowerShell — curl thật, body lấy từ tệp (chỉ để tham khảo; output của khoá chạy trên macOS)</span>
Set-Content body.json '{"labId":"lab_1"}'
curl.exe -i --json "@body.json" http://localhost:4001/bookings</code></pre>
<p>Nguồn: <a href="https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest?view=powershell-5.1" target="_blank" rel="noopener">Microsoft Learn — Invoke-WebRequest (PowerShell 5.1)</a>.</p>

<h3>Bẫy: dấu nháy quanh JSON trong bash và zsh</h3>
<pre><code class="language-bash">BASE=http://localhost:4001
curl -s --json "{"labId":"lab_1"}" $BASE/bookings | grep body
echo '{"labId":"lab_1"}' &gt; body.json
curl -s --json @body.json $BASE/bookings | grep body</code></pre>
<div class="out">  "body": "{labId:lab_1}"
  "body": "{\\"labId\\":\\"lab_1\\"}\\n"</div>
<p>Khi bọc ngoài bằng nháy kép, shell coi mỗi <code>"</code> bên trong là chỗ kết thúc hoặc bắt đầu một chuỗi và bỏ nó đi, nên server nhận <code>{labId:lab_1}</code> — không phải JSON. Một API Express sẽ trả 400 ("Body không phải JSON hợp lệ" ở LabFlow), và rất dễ đổ lỗi cho server. Luật: <strong>nháy đơn bên ngoài, nháy kép bên trong</strong>, hoặc để body trong tệp và dùng <code>@tệp</code>. Để ý bản dùng tệp còn gửi thêm ký tự xuống dòng mà <code>echo</code> thêm vào — vô hại với JSON.</p>

<h3>HTTPie: lệnh ngắn hơn, dành cho con người</h3>
<p>HTTPie (lệnh <code>http</code>; cài theo <a href="https://httpie.io/docs/cli" target="_blank" rel="noopener">httpie.io/docs/cli</a>) có cú pháp thân thiện hơn và gửi JSON theo mặc định:</p>
<pre><code class="language-bash">http POST :4001/bookings labId=lab_1 seats:=2 urgent:=true</code></pre>
<div class="out">HTTP/1.1 200 OK
Connection: keep-alive
Content-Type: application/json; charset=utf-8
Date: Sat, 31 Oct 2026 15:58:29 GMT
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{
    "body": "{\\"labId\\": \\"lab_1\\", \\"seats\\": 2, \\"urgent\\": true}",
    "headers": {
        "accept": "application/json, */*;q=0.5",
        "accept-encoding": "gzip, deflate, br, zstd",
        "connection": "keep-alive",
        "content-length": "46",
        "content-type": "application/json",
        "host": "localhost:4001",
        "user-agent": "HTTPie/3.2.4"
    },
    "method": "POST",
    "url": "/bookings"
}</div>
<table>
  <thead><tr><th>Cú pháp HTTPie</th><th>Trở thành</th></tr></thead>
  <tbody>
    <tr><td><code>:4001/bookings</code></td><td><code>http://localhost:4001/bookings</code></td></tr>
    <tr><td><code>labId=lab_1</code></td><td>trường JSON có giá trị <strong>chuỗi</strong></td></tr>
    <tr><td><code>seats:=2</code>, <code>urgent:=true</code></td><td>JSON thô: một <strong>số</strong>, một <strong>boolean</strong></td></tr>
    <tr><td><code>building==Alpha</code></td><td>tham số query <code>?building=Alpha</code></td></tr>
    <tr><td><code>Authorization:'Bearer tok_an'</code></td><td>một header</td></tr>
  </tbody>
</table>

<h3>Bẫy: HTTPie sắp xếp lại thứ nó hiển thị</h3>
<p>So sánh cùng một endpoint của LabFlow (bài 0.3) qua hai công cụ:</p>
<pre><code class="language-bash">http :4000/labs/lab_1</code></pre>
<div class="out">HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 122
Content-Type: application/json; charset=utf-8
Date: Sat, 31 Oct 2026 15:41:14 GMT
ETag: W/"7a-uvX+0yMOfNePX7T77wYjzSxsZuw"
Keep-Alive: timeout=5

{
    "building": "Alpha",
    "capacity": 30,
    "code": "AL-201",
    "id": "lab_1",
    "name": "Phòng Lab Mạng máy tính"
}</div>
<pre><code class="language-bash">curl http://localhost:4000/labs/lab_1</code></pre>
<div class="out">{
  "id": "lab_1",
  "code": "AL-201",
  "name": "Phòng Lab Mạng máy tính",
  "building": "Alpha",
  "capacity": 30
}</div>
<p>Bộ in đẹp của HTTPie đã sắp khoá JSON và header theo thứ tự chữ cái, thụt lề lại bằng bốn dấu cách. Server thật ra gửi <code>id</code> trước. Theo định nghĩa, object JSON không có thứ tự, nên client không được dựa vào thứ tự khoá — nhưng khi bạn đang kiểm "API của mình trả về chính xác cái gì?", hãy đọc output của curl hoặc dùng <code>http --pretty=none</code>.</p>

<h3>Postman: công cụ đồ hoạ phổ biến</h3>
<ul>
  <li>Chọn phương thức, gõ URL, điền tab <strong>Headers</strong> và <strong>Body</strong>, bấm <strong>Send</strong>; mã trạng thái, header và body hiện trong các khung.</li>
  <li><strong>Collection</strong> gom các request đã lưu theo thư mục; <strong>environment</strong> giữ các biến như <code>{{baseUrl}}</code> = <code>http://localhost:4000</code> trên laptop và địa chỉ thật trên server.</li>
  <li><strong>Tests</strong>: những đoạn script ngắn kiểm từng response (mã là 201, body có <code>id</code>…).</li>
</ul>
<div class="pitfall"><p><strong>Bẫy — bí mật trong workspace dùng chung.</strong> Collection của Postman thường nằm trong tài khoản Postman hoặc một workspace trên đám mây. Một token dán vào workspace chung là một token công bố cho mọi người trong đó. Dùng biến môi trường được đánh dấu bí mật, hoặc đừng để bí mật thật trong đó.</p></div>

<h3>Bruno: request là những tệp văn bản trong repo</h3>
<p>Bruno (<a href="https://docs.usebruno.com/introduction/what-is-bruno" target="_blank" rel="noopener">docs.usebruno.com</a>, mã nguồn mở giấy phép MIT tại <a href="https://github.com/usebruno/bruno" target="_blank" rel="noopener">github.com/usebruno/bruno</a>) là app desktop giống Postman nhưng <strong>ưu tiên offline</strong> và không cần tài khoản. Một collection là một thư mục các tệp văn bản thuần — bản cũ dùng định dạng <code>.bru</code> riêng, bản mới dùng YAML — nên bạn commit nó ngay cạnh code:</p>
<pre><code class="language-plaintext">labflow-api/
├── src/
├── package.json
└── api-requests/          ← collection của Bruno
    ├── labs/
    │   ├── list-labs
    │   └── get-lab
    └── environments/
        └── local          ← baseUrl = http://localhost:4000</code></pre>
<p>Trong đồ án nhóm đây là một siêu năng lực âm thầm: khi back-end đổi một endpoint, request tương ứng cũng đổi trong cùng pull request, và bạn front-end pull về được một ví dụ chạy được thay vì đọc tin nhắn trong nhóm chat.</p>

<h3>Khi nào dùng công cụ nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">curl</span><span class="lz-lnote">đúng từng byte, script, CI, mọi bài của khoá này</span></div>
  <div class="lz-layer"><span class="lz-lname">HTTPie</span><span class="lz-lnote">output dễ đọc cho người; tự sắp xếp lại thứ nó hiện</span></div>
  <div class="lz-layer"><span class="lz-lname">Postman</span><span class="lz-lnote">giao diện, collection chia sẻ qua tài khoản đội</span></div>
  <div class="lz-layer"><span class="lz-lname">Bruno</span><span class="lz-lnote">request là tệp thường trong repo — review như code</span></div>
</div>
<table>
  <thead><tr><th>Công cụ</th><th>Hợp nhất cho</th><th>Chia sẻ bằng</th><th>Chi phí</th></tr></thead>
  <tbody>
    <tr><td><strong>curl</strong></td><td>bài học, báo lỗi, script, server không có màn hình</td><td>một dòng dán được</td><td>miễn phí, có sẵn</td></tr>
    <tr><td><strong>HTTPie</strong></td><td>gõ nhanh khi khám phá</td><td>một dòng</td><td>CLI miễn phí</td></tr>
    <tr><td><strong>Postman</strong></td><td>API lớn của bên thứ ba, demo cho người không làm lập trình</td><td>workspace trên đám mây</td><td>gói miễn phí + gói trả phí</td></tr>
    <tr><td><strong>Bruno</strong></td><td>đồ án nhóm sống trong git</td><td>tệp trong repository</td><td>lõi miễn phí</td></tr>
  </tbody>
</table>
<p>Luật của khoá: học bằng <strong>curl</strong> (thấy được mọi thứ), chọn <strong>một</strong> công cụ đồ hoạ cho cả nhóm và commit collection của nó, và không bao giờ dán bí mật thật vào bất kỳ công cụ nào.</p>

<a class="link-card" href="https://everything.curl.dev/http/post/json.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Everything curl — JSON (--json) — đọc ngày 1/11/2026</span><span class="lc-sub">curl 7.82.0 thêm --json: gửi dữ liệu bằng POST và đặt cả Content-Type lẫn Accept là application/json — curl không kiểm dữ liệu có đúng JSON không.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Với <code>echo.mjs</code> đang chạy, đặt <code>BASE=http://localhost:4001</code> và gửi cùng một POST theo ba cách: <code>-H</code> + <code>-d</code>, <code>--json</code>, và <code>--json @body.json</code>. Xác nhận cả ba đều hiện <code>"content-type": "application/json"</code>.</li>
  <li>Viết lệnh kiểm nhanh mỗi dòng chỉ in mã trạng thái của <code>$BASE/health</code>, <code>$BASE/labs</code> và <code>$BASE/nothing</code> (tấm gương trả 200 cho mọi thứ — ghi nhận điều đó; ở bài 0.3 API thật sẽ không như vậy).</li>
  <li>Cố ý tái hiện bẫy nháy kép và đọc body bị vỡ mà tấm gương cho thấy.</li>
  <li>Nếu bạn dùng Windows: chạy <code>Get-Alias curl</code> trong Windows PowerShell và ghi lại nó trỏ tới đâu; rồi làm lại bước 1 bằng <code>curl.exe</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gửi được body JSON với Content-Type đúng theo hai cách khác nhau, và giải thích được từ output của tấm gương vì sao bản nháy kép không phải JSON.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CLI (giao diện dòng lệnh)</span><span class="v">Chương trình điều khiển bằng cách gõ lệnh (curl, HTTPie).</span></div>
  <div class="kv"><span class="k">GUI (giao diện đồ hoạ)</span><span class="v">Giao diện có cửa sổ và nút bấm (Postman, Bruno).</span></div>
  <div class="kv"><span class="k">Collection (bộ request)</span><span class="v">Một tập request đã lưu và sắp xếp trong công cụ đồ hoạ.</span></div>
  <div class="kv"><span class="k">Environment variable (biến môi trường của công cụ)</span><span class="v">Một giá trị có tên như <code>baseUrl</code>, dùng lại ở nhiều request.</span></div>
  <div class="kv"><span class="k">Alias (bí danh)</span><span class="v">Tên thứ hai của một lệnh; trong PowerShell 5.1 <code>curl</code> = <code>Invoke-WebRequest</code>.</span></div>
  <div class="kv"><span class="k">Smoke test (kiểm tra khói)</span><span class="v">Kiểm nhanh mọi endpoint có trả lời không, chạy sau mỗi lần deploy.</span></div>
  <div class="kv"><span class="k">Pretty-print (in đẹp)</span><span class="v">Định dạng lại output cho dễ đọc — có thể đổi thứ tự hoặc thụt lề.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Thanh địa chỉ chỉ gửi GET; làm API cần điều khiển được phương thức, header và body.</li>
  <li>Mười cờ curl (<code>-i -v -X -H -d --json -I -s -o -w -L</code>) đủ cho cả khoá.</li>
  <li><code>--json</code> đặt Content-Type và Accept; có body thì curl mặc định dùng POST.</li>
  <li>Windows PowerShell 5.1: gõ <code>curl.exe</code>; ở mọi shell, bọc JSON trong nháy đơn hoặc dùng <code>@tệp</code>.</li>
  <li>HTTPie ngắn gọn hơn nhưng bộ in đẹp của nó sắp xếp lại khoá và header.</li>
  <li>Postman sống trong tài khoản/workspace; Bruno giữ collection thành tệp trong git.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 0.3 (bài MỚI 31/10/2026) ─────────────────────────── */
    {
      title: '0.3 — Set up: your LabFlow API skeleton with Node 22 and Express 5|||0.3 — Dựng khung: LabFlow API đầu tiên với Node 22 và Express 5',
      slug: 'api-0-3-du-an-labflow',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cài/kiểm Node 22, tạo dự án, ba tệp server/app/db, ba endpoint đầu tiên, 404 và 500 trả JSON, npm run dev tự khởi động lại, khác biệt Express 5 với 4.',
      content: `${G005}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Set up: your LabFlow API skeleton</h2>
<p class="lead">Every chapter of this course adds something to one project: the LabFlow API. In this lesson you create it from an empty folder — Node.js 22, Express 5, three small files and three endpoints — and make sure that, from the very first day, it answers JSON even when something goes wrong. No database yet: the data lives in a JavaScript array, because the <em>contract</em> is what we design first.</p>

<h3>Step 1: Node.js 22</h3>
<pre><code class="language-bash">node -v
npm -v</code></pre>
<div class="out">v22.23.3
10.9.9</div>
<p>Any 22.x or newer is fine. If the command is missing or older:</p>
<table>
  <thead><tr><th>Your machine</th><th>Install</th></tr></thead>
  <tbody>
    <tr><td>macOS / Linux</td><td>install <strong>nvm</strong> (Node Version Manager) from <a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener">github.com/nvm-sh/nvm</a>, reopen the terminal, then <code>nvm install 22</code></td></tr>
    <tr><td>Windows</td><td>the LTS installer from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a>, or <strong>nvm-windows</strong>; then reopen the terminal</td></tr>
  </tbody>
</table>
<p>Why insist on 22? Two things this lesson relies on behave differently on older versions: <code>node --watch</code> (automatic restart) and the friendly handling of a missing <code>"type": "module"</code>.</p>

<h3>Step 2: create the project and install Express 5</h3>
<pre><code class="language-bash">mkdir labflow-api &amp;&amp; cd labflow-api
npm init -y
npm install express@5
npm ls express</code></pre>
<div class="out">Wrote to …/labflow-api/package.json:
…

added 65 packages, and audited 66 packages in 798ms

30 packages are looking for funding
  run &#96;npm fund&#96; for details

found 0 vulnerabilities
labflow-api@1.0.0 …/labflow-api
└── express@5.3.0</div>
<ul>
  <li><code>npm init -y</code> writes a <code>package.json</code> with default answers (<code>-y</code> = “yes to everything”).</li>
  <li><code>npm install express@5</code> installs the newest 5.x release and everything it depends on — 65 packages in <code>node_modules/</code> — and records it in <code>package.json</code>.</li>
  <li><code>npm ls express</code> prints which version you <em>really</em> got. Always check: many tutorials online were written for Express 4.</li>
</ul>
<div class="callout ok"><p><strong>Using git?</strong> Add a <code>.gitignore</code> with the single line <code>node_modules/</code>. The folder is recreated by <code>npm install</code> from <code>package.json</code> and <code>package-lock.json</code>, which you <em>do</em> commit.</p></div>

<h3>Step 3: package.json — four lines that matter</h3>
<p>Open <code>package.json</code> and make it look like this (your dependency version may be newer):</p>
<pre><code class="language-json">{
  "name": "labflow-api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js"
  },
  "engines": { "node": "&gt;=22" },
  "dependencies": {
    "express": "^5.3.0"
  }
}</code></pre>
<table>
  <thead><tr><th>Line</th><th>Why it is there</th></tr></thead>
  <tbody>
    <tr><td><code>"type": "module"</code></td><td>Lets every <code>.js</code> file use <code>import</code> / <code>export</code> (ES modules) instead of <code>require</code>.</td></tr>
    <tr><td><code>"dev": "node --watch src/server.js"</code></td><td>During development: restart the server automatically whenever a file changes.</td></tr>
    <tr><td><code>"start": "node src/server.js"</code></td><td>Run once, no watching — what a production server does.</td></tr>
    <tr><td><code>"engines"</code></td><td>Documents the Node version the project needs.</td></tr>
    <tr><td><code>"private": true</code></td><td>npm refuses to publish this package by accident.</td></tr>
  </tbody>
</table>

<h3>Step 4: three files, three jobs</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">server.js</span><span class="lz-t">start</span><span class="lz-d">listen on PORT — nothing else</span></div>
  <div class="lz-step"><span class="lz-k">app.js</span><span class="lz-t">the API</span><span class="lz-d">middleware + routes + error handler</span></div>
  <div class="lz-step"><span class="lz-k">db.js</span><span class="lz-t">the data</span><span class="lz-d">arrays in RAM until Chapter 12 (PostgreSQL)</span></div>
</div>
<pre><code class="language-plaintext">labflow-api/
├── package.json
└── src/
    ├── server.js   ← start the program (listen on a port)
    ├── app.js      ← the API itself: routes, 404, errors
    └── db.js       ← the data (in memory for now)</code></pre>
<p>Why split <code>app.js</code> from <code>server.js</code>? Because later we want to test the API by importing <code>app</code> directly, without opening a real port; and because “what the API does” and “how the process starts” are different concerns.</p>

<h3>src/db.js — the data</h3>
<pre><code class="language-javascript">// db.js — "cơ sở dữ liệu" tạm trong RAM. Tắt server là mất; Chương 12 thay bằng PostgreSQL.
export const labs = [
  { id: 'lab_1', code: 'AL-201', name: 'Phòng Lab Mạng máy tính', building: 'Alpha', capacity: 30 },
  { id: 'lab_2', code: 'AL-305', name: 'Phòng Lab IoT', building: 'Alpha', capacity: 24 },
  { id: 'lab_3', code: 'BE-102', name: 'Phòng Lab Phần mềm', building: 'Beta', capacity: 40 },
];</code></pre>
<p>Each lab has an <code>id</code> for machines — stable, used in URLs — and a <code>code</code> for people, printed on the door. Keeping both separate means a room can be renamed without breaking any URL. Lesson 1.4 explains the <code>lab_1</code> format.</p>

<h3>src/app.js — the API</h3>
<pre><code class="language-javascript">import express from 'express';
import { labs } from './db.js';

export const app = express();
app.disable('x-powered-by');                   // không khoe "X-Powered-By: Express"
app.set('json spaces', 2);                     // JSON thụt lề cho dễ đọc khi học
app.use(express.json());                       // đọc body JSON của request

app.get('/health', (req, res) =&gt; {
  res.json({ status: 'ok' });
});

app.get('/labs', (req, res) =&gt; {
  res.json({ data: labs });
});

app.get('/labs/:labId', (req, res) =&gt; {
  const lab = labs.find((l) =&gt; l.id === req.params.labId);
  if (!lab) {
    return res.status(404).json({ error: 'LAB_NOT_FOUND', message: &#96;Không có phòng lab \${req.params.labId}&#96; });
  }
  res.json(lab);
});

// Không route nào khớp ⇒ vẫn trả JSON, không trả trang HTML
app.use((req, res) =&gt; {
  res.status(404).json({ error: 'ROUTE_NOT_FOUND', message: &#96;Không có \${req.method} \${req.path}&#96; });
});

// Lỗi chưa lường trước ⇒ 500, không lộ stack trace cho client
app.use((err, req, res, next) =&gt; {
  console.error(err);
  res.status(500).json({ error: 'INTERNAL', message: 'Máy chủ gặp lỗi, thử lại sau' });
});</code></pre>
<p>Read it piece by piece:</p>
<ul>
  <li><code>express()</code> creates the application; <code>app.get(path, handler)</code> registers a route for GET requests on that path.</li>
  <li>A <strong>handler</strong> receives <code>req</code> (the request) and <code>res</code> (the response you are building). <code>res.json(x)</code> sends <code>x</code> as JSON with status 200; <code>res.status(404).json(x)</code> sets another status first.</li>
  <li><code>:labId</code> is a <strong>route parameter</strong>: in <code>/labs/lab_2</code>, Express puts <code>'lab_2'</code> in <code>req.params.labId</code>.</li>
  <li><code>app.use(fn)</code> without a path is <strong>middleware</strong> that runs for every request that reaches it. Express tries handlers in the order you register them, so the catch-all 404 must come <strong>after</strong> all routes.</li>
  <li>A function with <strong>four</strong> parameters <code>(err, req, res, next)</code> is an error handler. Express calls it when a route throws. It must also be last.</li>
  <li><code>return res.status(404)…</code> — the <code>return</code> stops the handler; without it the code would continue to <code>res.json(lab)</code> and try to send a second response.</li>
</ul>

<h3>src/server.js — start it</h3>
<pre><code class="language-javascript">import { app } from './app.js';

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () =&gt; console.log(&#96;LabFlow API chạy ở http://localhost:\${PORT}&#96;));</code></pre>
<p><code>process.env.PORT ?? 4000</code> reads the port from an environment variable and falls back to 4000. Hosting platforms and Docker tell your app which port to use exactly this way, and you can test another port without editing code: <code>PORT=5000 npm run dev</code>.</p>

<h3>Run it</h3>
<pre><code class="language-bash">npm run dev</code></pre>
<div class="out">&gt; labflow-api@0.1.0 dev
&gt; node --watch src/server.js

LabFlow API chạy ở http://localhost:4000
Restarting 'src/server.js'
LabFlow API chạy ở http://localhost:4000</div>
<p>The “Restarting” line appeared because we saved <code>app.js</code> while it was running: <code>--watch</code> noticed and restarted. Leave this terminal open (terminal 1) and use a second terminal for requests.</p>

<h3>First requests</h3>
<pre><code class="language-bash">curl -i http://localhost:4000/health</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 20
ETag: W/"14-FnPp73GyekB2vjRBo6C/2fUpoY8"
Date: Sat, 31 Oct 2026 16:04:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "status": "ok"
}</div>
<table>
  <thead><tr><th>Header</th><th>Who set it</th></tr></thead>
  <tbody>
    <tr><td><code>Content-Type</code></td><td><code>res.json()</code> — JSON, UTF-8</td></tr>
    <tr><td><code>Content-Length: 20</code></td><td>Express counted the bytes of the indented body</td></tr>
    <tr><td><code>ETag</code></td><td>Express: a fingerprint of the body; Chapter 9 uses it for caching</td></tr>
    <tr><td><code>Date</code>, <code>Connection</code>, <code>Keep-Alive</code></td><td>Node’s HTTP server</td></tr>
  </tbody>
</table>
<p>No <code>X-Powered-By</code> line: <code>app.disable('x-powered-by')</code> removed it. Advertising your framework only helps attackers pick exploits.</p>
<pre><code class="language-bash">curl http://localhost:4000/labs</code></pre>
<div class="out">{
  "data": [
    {
      "id": "lab_1",
      "code": "AL-201",
      "name": "Phòng Lab Mạng máy tính",
      "building": "Alpha",
      "capacity": 30
    },
    {
      "id": "lab_2",
      "code": "AL-305",
      "name": "Phòng Lab IoT",
      "building": "Alpha",
      "capacity": 24
    },
    {
      "id": "lab_3",
      "code": "BE-102",
      "name": "Phòng Lab Phần mềm",
      "building": "Beta",
      "capacity": 40
    }
  ]
}</div>
<p>Why <code>{ "data": [ … ] }</code> instead of a bare array? An object can grow: Chapter 3 adds paging information next to <code>data</code> without breaking anyone. A bare array cannot gain a sibling field.</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_2
curl -i http://localhost:4000/labs/lab_9</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 108
ETag: W/"6c-OwUZRHaXfZRYcu/76U3eSP0PivU"
Date: Sat, 31 Oct 2026 15:40:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "lab_2",
  "code": "AL-305",
  "name": "Phòng Lab IoT",
  "building": "Alpha",
  "capacity": 24
}
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 74
ETag: W/"4a-lXLsqA33DrufMdXbcY1kiV4Dmbs"
Date: Sat, 31 Oct 2026 16:27:32 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "LAB_NOT_FOUND",
  "message": "Không có phòng lab lab_9"
}</div>
<p>The error body has two fields with two readers. <code>error</code> is a stable code for <strong>programs</strong>: the front-end can write <code>if (body.error === 'LAB_NOT_FOUND')</code> and it will keep working even if the wording changes. <code>message</code> is for <strong>people</strong>. Chapter 2 turns this pair into the RFC 9457 standard.</p>

<h3>Why the JSON catch-all matters</h3>
<p>Our first version of <code>app.js</code> had only the routes. This is what an unknown URL returned then:</p>
<pre><code class="language-bash">curl -i http://localhost:4000/rooms</code></pre>
<div class="out">HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Security-Policy: default-src 'none'
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
Content-Length: 144
Date: Sat, 31 Oct 2026 15:40:25 GMT
Connection: keep-alive
Keep-Alive: timeout=5

&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
&lt;meta charset="utf-8"&gt;
&lt;title&gt;Error&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;pre&gt;Cannot GET /rooms&lt;/pre&gt;
&lt;/body&gt;
&lt;/html&gt;</div>
<p>Express’s default answer is an <strong>HTML page</strong>. A mobile app that calls <code>JSON.parse()</code> on every response crashes on it. With the catch-all added, the same request returns:</p>
<div class="out">HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 70
ETag: W/"46-uKTG7VzLov2XX7RvmtHyAl4tRiA"
Date: Sat, 31 Oct 2026 15:40:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "ROUTE_NOT_FOUND",
  "message": "Không có GET /rooms"
}</div>
<p>An API should answer in its own language — JSON — <em>every</em> time, including when the client is wrong and when the server is broken. The error handler does the same for crashes; lesson 1.3 shows it catching a real bug.</p>

<h3>Express 5 compared with Express 4</h3>
<table>
  <thead><tr><th>Topic</th><th>Express 4</th><th>Express 5 (this course)</th></tr></thead>
  <tbody>
    <tr><td>Error thrown in an <code>async</code> handler</td><td>not caught: the request hangs, or Node stops on the unhandled rejection</td><td>caught and passed to your error handler</td></tr>
    <tr><td>Wildcard route</td><td><code>app.get('*', …)</code></td><td>must be named: <code>app.get('/*splat', …)</code></td></tr>
    <tr><td>Optional parameter</td><td><code>'/:id?'</code></td><td><code>'/{:id}'</code></td></tr>
    <tr><td>Release</td><td>4.0 in 2014</td><td>5.0 in September 2024; the default “latest” on npm since 5.1 (March 2025)</td></tr>
  </tbody>
</table>
<p>If code copied from an older tutorial throws an error at startup, look for <code>*</code> or <code>?</code> in its route paths. Our catch-all uses <code>app.use(fn)</code> with no path, which works in both versions.</p>

<h3>Two errors you will meet on day one</h3>
<pre><code class="language-bash">curl -i http://localhost:4000/health        # server not running</code></pre>
<div class="out">curl: (7) Failed to connect to localhost port 4000 after 1 ms: Couldn't connect to server</div>
<p>There is no HTTP status at all — nothing is listening. Check terminal 1 (did the server crash? is it on another port?).</p>
<p>Forget <code>"type": "module"</code> in <code>package.json</code> and Node 22 prints:</p>
<div class="out">(node:92783) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///…/src/server.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /…/package.json.
(Use &#96;node --trace-warnings ...&#96; to show where the warning was created)</div>
<p>Node 22 guessed correctly and ran the file anyway, but tells you exactly what to add. Older versions refuse with <code>SyntaxError: Cannot use import statement outside a module</code>.</p>

<div class="pitfall"><p><strong>Trap — forgetting <code>return</code> before an early response.</strong> Write <code>if (!lab) res.status(404).json(…)</code> without <code>return</code> and the handler keeps going to <code>res.json(lab)</code>. We tried it: in this exact handler the mistake is <em>silent</em>, because <code>lab</code> is <code>undefined</code> and Express 5.3 sends nothing more. Change that last line to anything with a real body, such as <code>res.json({ found: lab })</code>, and the server terminal shows <code>Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client</code>. A bug that only shows up sometimes is the worst kind — one request, one response, always <code>return</code>.</p></div>

<a class="link-card" href="https://expressjs.com/en/guide/migrating-5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Express — Migrating to Express 5 — read 1 Nov 2026</span><span class="lc-sub">What changed from Express 4: rejected promises reach the error handler, new path syntax (/*splat), req.query is a read-only getter, req.body is undefined when not parsed.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
  <li>Build the skeleton exactly as above and run the four curl commands. Your output should match except for <code>Date</code> and possibly <code>ETag</code>.</li>
  <li>Add a fourth lab to <code>db.js</code> (pick your own room code). Without restarting by hand, call <code>GET /labs/lab_4</code> — <code>--watch</code> should already have reloaded.</li>
  <li>Stop the server, then start it with <code>PORT=4010 npm run dev</code> and call <code>/health</code> on the new port.</li>
  <li>Smoke test: print only the status codes of <code>/health</code>, <code>/labs</code>, <code>/labs/lab_9</code> and <code>/rooms</code> with <code>curl -s -o /dev/null -w '%{http_code}\\n'</code>.</li>
</ol>
<p><strong>Done when:</strong> your smoke test prints <code>200</code>, <code>200</code>, <code>404</code>, <code>404</code>, and both 404 bodies are JSON with an <code>error</code> field.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">npm package</span><span class="v">A reusable library installed into <code>node_modules/</code>; Express is one.</span></div>
  <div class="kv"><span class="k">package.json</span><span class="v">The project’s identity card: name, scripts, dependencies, settings.</span></div>
  <div class="kv"><span class="k">ES module</span><span class="v">JavaScript files that use <code>import</code>/<code>export</code>; enabled by <code>"type": "module"</code>.</span></div>
  <div class="kv"><span class="k">Handler</span><span class="v">The function that answers one route: <code>(req, res) =&gt; { … }</code>.</span></div>
  <div class="kv"><span class="k">Route parameter</span><span class="v">A named part of the path, <code>:labId</code>, read from <code>req.params</code>.</span></div>
  <div class="kv"><span class="k">Middleware</span><span class="v">A function that runs on requests in registration order; <code>app.use(…)</code>.</span></div>
  <div class="kv"><span class="k">Error handler</span><span class="v">Middleware with four parameters <code>(err, req, res, next)</code>, called when something throws.</span></div>
  <div class="kv"><span class="k">Health check</span><span class="v">An endpoint such as <code>/health</code> that tools call to ask “are you alive?”.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>npm init -y</code>, <code>npm install express@5</code>, then <code>"type": "module"</code> and <code>dev</code>/<code>start</code> scripts.</li>
  <li>Three files: <code>server.js</code> starts, <code>app.js</code> is the API, <code>db.js</code> holds the data.</li>
  <li><code>npm run dev</code> restarts on every save; work with two terminals.</li>
  <li>Lists are wrapped as <code>{ "data": [ … ] }</code> so they can grow later.</li>
  <li>Always answer JSON: a 404 catch-all and a four-argument error handler, registered last.</li>
  <li>Errors carry a stable <code>error</code> code for programs and a <code>message</code> for people.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-0-3-dang-nhap-sai" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Go deeper in the Authentication course — lesson 0.3: LabFlow ID, a login that runs and is wrong in six ways</span><span class="lc-sub">Same: one LabFlow world — An, Bình and Cô Lan, Node 22 and Express 5. That course builds LabFlow ID, the identity service of the platform, starting from a naive login attacked for real (plain passwords, email enumeration, a session id guessed in 4.37 s, no attempt limit); by Chapter 8 it signs LabFlow API users in through OpenID Connect.</span></span>
  <span class="lc-cta">OPEN AUTHENTICATION LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Dựng khung LabFlow API</h2>
<p class="lead">Chương nào của khoá cũng thêm một thứ vào cùng một dự án: LabFlow API. Ở bài này bạn tạo nó từ một thư mục trống — Node.js 22, Express 5, ba tệp nhỏ và ba endpoint — và bảo đảm ngay từ ngày đầu nó trả lời bằng JSON kể cả khi có gì đó hỏng. Chưa có cơ sở dữ liệu: dữ liệu nằm trong một mảng JavaScript, vì thứ ta thiết kế trước tiên là <em>hợp đồng</em>.</p>

<h3>Bước 1: Node.js 22</h3>
<pre><code class="language-bash">node -v
npm -v</code></pre>
<div class="out">v22.23.3
10.9.9</div>
<p>Bất kỳ 22.x hay mới hơn đều được. Nếu chưa có lệnh hoặc phiên bản cũ hơn:</p>
<table>
  <thead><tr><th>Máy của bạn</th><th>Cài đặt</th></tr></thead>
  <tbody>
    <tr><td>macOS / Linux</td><td>cài <strong>nvm</strong> (Node Version Manager — trình quản lý phiên bản Node) theo <a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener">github.com/nvm-sh/nvm</a>, mở lại terminal, rồi <code>nvm install 22</code></td></tr>
    <tr><td>Windows</td><td>bộ cài LTS ở <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a>, hoặc <strong>nvm-windows</strong>; rồi mở lại terminal</td></tr>
  </tbody>
</table>
<p>Sao phải đúng 22? Có hai thứ bài này dựa vào mà các bản cũ xử lý khác: <code>node --watch</code> (tự khởi động lại) và cách xử lý thân thiện khi thiếu <code>"type": "module"</code>.</p>

<h3>Bước 2: tạo dự án và cài Express 5</h3>
<pre><code class="language-bash">mkdir labflow-api &amp;&amp; cd labflow-api
npm init -y
npm install express@5
npm ls express</code></pre>
<div class="out">Wrote to …/labflow-api/package.json:
…

added 65 packages, and audited 66 packages in 798ms

30 packages are looking for funding
  run &#96;npm fund&#96; for details

found 0 vulnerabilities
labflow-api@1.0.0 …/labflow-api
└── express@5.3.0</div>
<ul>
  <li><code>npm init -y</code> viết ra <code>package.json</code> với các câu trả lời mặc định (<code>-y</code> = "đồng ý hết").</li>
  <li><code>npm install express@5</code> cài bản 5.x mới nhất cùng mọi thứ nó phụ thuộc — 65 gói trong <code>node_modules/</code> — và ghi lại vào <code>package.json</code>.</li>
  <li><code>npm ls express</code> in ra phiên bản bạn <em>thật sự</em> có. Luôn kiểm: rất nhiều hướng dẫn trên mạng viết cho Express 4.</li>
</ul>
<div class="callout ok"><p><strong>Có dùng git?</strong> Thêm tệp <code>.gitignore</code> chỉ với một dòng <code>node_modules/</code>. Thư mục đó được tạo lại bằng <code>npm install</code> từ <code>package.json</code> và <code>package-lock.json</code> — hai tệp này thì bạn <em>có</em> commit.</p></div>

<h3>Bước 3: package.json — bốn dòng quan trọng</h3>
<p>Mở <code>package.json</code> và sửa cho giống thế này (phiên bản dependency của bạn có thể mới hơn):</p>
<pre><code class="language-json">{
  "name": "labflow-api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js"
  },
  "engines": { "node": "&gt;=22" },
  "dependencies": {
    "express": "^5.3.0"
  }
}</code></pre>
<table>
  <thead><tr><th>Dòng</th><th>Vì sao có nó</th></tr></thead>
  <tbody>
    <tr><td><code>"type": "module"</code></td><td>Cho mọi tệp <code>.js</code> dùng <code>import</code> / <code>export</code> (ES module) thay vì <code>require</code>.</td></tr>
    <tr><td><code>"dev": "node --watch src/server.js"</code></td><td>Khi phát triển: tự khởi động lại server mỗi khi có tệp thay đổi.</td></tr>
    <tr><td><code>"start": "node src/server.js"</code></td><td>Chạy một lần, không theo dõi — đúng như server production làm.</td></tr>
    <tr><td><code>"engines"</code></td><td>Ghi rõ dự án cần phiên bản Node nào.</td></tr>
    <tr><td><code>"private": true</code></td><td>npm từ chối đăng gói này lên mạng do lỡ tay.</td></tr>
  </tbody>
</table>

<h3>Bước 4: ba tệp, ba nhiệm vụ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">server.js</span><span class="lz-t">khởi động</span><span class="lz-d">nghe ở PORT — không làm gì khác</span></div>
  <div class="lz-step"><span class="lz-k">app.js</span><span class="lz-t">API</span><span class="lz-d">middleware + route + bộ xử lý lỗi</span></div>
  <div class="lz-step"><span class="lz-k">db.js</span><span class="lz-t">dữ liệu</span><span class="lz-d">mảng trong RAM tới Chương 12 (PostgreSQL)</span></div>
</div>
<pre><code class="language-plaintext">labflow-api/
├── package.json
└── src/
    ├── server.js   ← khởi động chương trình (lắng nghe một cổng)
    ├── app.js      ← chính API: route, 404, lỗi
    └── db.js       ← dữ liệu (tạm trong bộ nhớ)</code></pre>
<p>Sao tách <code>app.js</code> khỏi <code>server.js</code>? Vì sau này ta muốn test API bằng cách import thẳng <code>app</code> mà không mở cổng thật; và vì "API làm gì" với "tiến trình khởi động thế nào" là hai mối quan tâm khác nhau.</p>

<h3>src/db.js — dữ liệu</h3>
<pre><code class="language-javascript">// db.js — "cơ sở dữ liệu" tạm trong RAM. Tắt server là mất; Chương 12 thay bằng PostgreSQL.
export const labs = [
  { id: 'lab_1', code: 'AL-201', name: 'Phòng Lab Mạng máy tính', building: 'Alpha', capacity: 30 },
  { id: 'lab_2', code: 'AL-305', name: 'Phòng Lab IoT', building: 'Alpha', capacity: 24 },
  { id: 'lab_3', code: 'BE-102', name: 'Phòng Lab Phần mềm', building: 'Beta', capacity: 40 },
];</code></pre>
<p>Mỗi phòng có <code>id</code> dành cho máy — ổn định, dùng trong URL — và <code>code</code> dành cho người, in trên cửa phòng. Giữ hai thứ tách biệt thì phòng có đổi tên cũng không làm vỡ URL nào. Bài 1.4 giải thích định dạng <code>lab_1</code>.</p>

<h3>src/app.js — API</h3>
<pre><code class="language-javascript">import express from 'express';
import { labs } from './db.js';

export const app = express();
app.disable('x-powered-by');                   // không khoe "X-Powered-By: Express"
app.set('json spaces', 2);                     // JSON thụt lề cho dễ đọc khi học
app.use(express.json());                       // đọc body JSON của request

app.get('/health', (req, res) =&gt; {
  res.json({ status: 'ok' });
});

app.get('/labs', (req, res) =&gt; {
  res.json({ data: labs });
});

app.get('/labs/:labId', (req, res) =&gt; {
  const lab = labs.find((l) =&gt; l.id === req.params.labId);
  if (!lab) {
    return res.status(404).json({ error: 'LAB_NOT_FOUND', message: &#96;Không có phòng lab \${req.params.labId}&#96; });
  }
  res.json(lab);
});

// Không route nào khớp ⇒ vẫn trả JSON, không trả trang HTML
app.use((req, res) =&gt; {
  res.status(404).json({ error: 'ROUTE_NOT_FOUND', message: &#96;Không có \${req.method} \${req.path}&#96; });
});

// Lỗi chưa lường trước ⇒ 500, không lộ stack trace cho client
app.use((err, req, res, next) =&gt; {
  console.error(err);
  res.status(500).json({ error: 'INTERNAL', message: 'Máy chủ gặp lỗi, thử lại sau' });
});</code></pre>
<p>Đọc từng mảnh:</p>
<ul>
  <li><code>express()</code> tạo ứng dụng; <code>app.get(đường-dẫn, handler)</code> đăng ký một route cho request GET ở đường dẫn đó.</li>
  <li><strong>Handler</strong> (hàm xử lý) nhận <code>req</code> (request) và <code>res</code> (response bạn đang dựng). <code>res.json(x)</code> gửi <code>x</code> dạng JSON với mã 200; <code>res.status(404).json(x)</code> đặt mã khác trước.</li>
  <li><code>:labId</code> là <strong>route parameter</strong> (tham số đường dẫn): với <code>/labs/lab_2</code>, Express đặt <code>'lab_2'</code> vào <code>req.params.labId</code>.</li>
  <li><code>app.use(fn)</code> không kèm đường dẫn là <strong>middleware</strong> (hàm trung gian) chạy cho mọi request đi tới nó. Express thử các handler theo đúng thứ tự bạn đăng ký, nên lưới hứng 404 phải đứng <strong>sau</strong> mọi route.</li>
  <li>Một hàm có <strong>bốn</strong> tham số <code>(err, req, res, next)</code> là bộ xử lý lỗi (error handler). Express gọi nó khi một route ném lỗi. Nó cũng phải đứng cuối.</li>
  <li><code>return res.status(404)…</code> — chữ <code>return</code> dừng handler lại; thiếu nó, code sẽ chạy tiếp tới <code>res.json(lab)</code> và cố gửi response thứ hai.</li>
</ul>

<h3>src/server.js — khởi động</h3>
<pre><code class="language-javascript">import { app } from './app.js';

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () =&gt; console.log(&#96;LabFlow API chạy ở http://localhost:\${PORT}&#96;));</code></pre>
<p><code>process.env.PORT ?? 4000</code> đọc cổng từ biến môi trường, không có thì dùng 4000. Các nền tảng hosting và Docker báo cho app biết dùng cổng nào đúng theo cách này, và bạn có thể thử cổng khác mà không sửa code: <code>PORT=5000 npm run dev</code>.</p>

<h3>Chạy thử</h3>
<pre><code class="language-bash">npm run dev</code></pre>
<div class="out">&gt; labflow-api@0.1.0 dev
&gt; node --watch src/server.js

LabFlow API chạy ở http://localhost:4000
Restarting 'src/server.js'
LabFlow API chạy ở http://localhost:4000</div>
<p>Dòng "Restarting" xuất hiện vì ta lưu <code>app.js</code> trong lúc server đang chạy: <code>--watch</code> nhận ra và khởi động lại. Giữ terminal này mở (terminal 1) và dùng terminal thứ hai để gửi request.</p>

<h3>Những request đầu tiên</h3>
<pre><code class="language-bash">curl -i http://localhost:4000/health</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 20
ETag: W/"14-FnPp73GyekB2vjRBo6C/2fUpoY8"
Date: Sat, 31 Oct 2026 16:04:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "status": "ok"
}</div>
<table>
  <thead><tr><th>Header</th><th>Ai đặt</th></tr></thead>
  <tbody>
    <tr><td><code>Content-Type</code></td><td><code>res.json()</code> — JSON, UTF-8</td></tr>
    <tr><td><code>Content-Length: 20</code></td><td>Express đếm số byte của body đã thụt lề</td></tr>
    <tr><td><code>ETag</code></td><td>Express: "dấu vân tay" của body; Chương 9 dùng nó để cache</td></tr>
    <tr><td><code>Date</code>, <code>Connection</code>, <code>Keep-Alive</code></td><td>server HTTP của Node</td></tr>
  </tbody>
</table>
<p>Không có dòng <code>X-Powered-By</code>: <code>app.disable('x-powered-by')</code> đã bỏ nó. Khoe framework mình dùng chỉ giúp kẻ tấn công chọn lỗ hổng.</p>
<pre><code class="language-bash">curl http://localhost:4000/labs</code></pre>
<div class="out">{
  "data": [
    {
      "id": "lab_1",
      "code": "AL-201",
      "name": "Phòng Lab Mạng máy tính",
      "building": "Alpha",
      "capacity": 30
    },
    {
      "id": "lab_2",
      "code": "AL-305",
      "name": "Phòng Lab IoT",
      "building": "Alpha",
      "capacity": 24
    },
    {
      "id": "lab_3",
      "code": "BE-102",
      "name": "Phòng Lab Phần mềm",
      "building": "Beta",
      "capacity": 40
    }
  ]
}</div>
<p>Sao lại là <code>{ "data": [ … ] }</code> chứ không phải một mảng trần? Vì object lớn thêm được: Chương 3 sẽ thêm thông tin phân trang cạnh <code>data</code> mà không làm vỡ ai. Một mảng trần thì không thể có "trường anh em".</p>
<pre><code class="language-bash">curl -i http://localhost:4000/labs/lab_2
curl -i http://localhost:4000/labs/lab_9</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 108
ETag: W/"6c-OwUZRHaXfZRYcu/76U3eSP0PivU"
Date: Sat, 31 Oct 2026 15:40:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id": "lab_2",
  "code": "AL-305",
  "name": "Phòng Lab IoT",
  "building": "Alpha",
  "capacity": 24
}
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 74
ETag: W/"4a-lXLsqA33DrufMdXbcY1kiV4Dmbs"
Date: Sat, 31 Oct 2026 16:27:32 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "LAB_NOT_FOUND",
  "message": "Không có phòng lab lab_9"
}</div>
<p>Body lỗi có hai trường với hai người đọc. <code>error</code> là mã ổn định dành cho <strong>chương trình</strong>: front-end có thể viết <code>if (body.error === 'LAB_NOT_FOUND')</code> và nó vẫn chạy dù câu chữ có đổi. <code>message</code> dành cho <strong>con người</strong>. Chương 2 nâng cặp này lên chuẩn RFC 9457.</p>

<h3>Vì sao lưới hứng JSON lại quan trọng</h3>
<p>Phiên bản <code>app.js</code> đầu tiên của ta chỉ có các route. Lúc đó một URL không tồn tại trả về thế này:</p>
<pre><code class="language-bash">curl -i http://localhost:4000/rooms</code></pre>
<div class="out">HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Security-Policy: default-src 'none'
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8
Content-Length: 144
Date: Sat, 31 Oct 2026 15:40:25 GMT
Connection: keep-alive
Keep-Alive: timeout=5

&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
&lt;meta charset="utf-8"&gt;
&lt;title&gt;Error&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;pre&gt;Cannot GET /rooms&lt;/pre&gt;
&lt;/body&gt;
&lt;/html&gt;</div>
<p>Câu trả lời mặc định của Express là một <strong>trang HTML</strong>. Một app di động gọi <code>JSON.parse()</code> trên mọi response sẽ sập ngay ở đây. Có lưới hứng rồi, cùng request đó trả về:</p>
<div class="out">HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 70
ETag: W/"46-uKTG7VzLov2XX7RvmtHyAl4tRiA"
Date: Sat, 31 Oct 2026 15:40:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "error": "ROUTE_NOT_FOUND",
  "message": "Không có GET /rooms"
}</div>
<p>Một API nên trả lời bằng chính ngôn ngữ của nó — JSON — <em>mọi lúc</em>, kể cả khi client sai và khi server hỏng. Bộ xử lý lỗi làm điều tương tự cho các lần sập; bài 1.3 cho thấy nó bắt một lỗi thật.</p>

<h3>Express 5 so với Express 4</h3>
<table>
  <thead><tr><th>Chủ đề</th><th>Express 4</th><th>Express 5 (khoá này)</th></tr></thead>
  <tbody>
    <tr><td>Lỗi ném ra trong handler <code>async</code></td><td>không được bắt: request treo, hoặc Node dừng vì promise bị từ chối không ai xử lý</td><td>được bắt và chuyển tới bộ xử lý lỗi của bạn</td></tr>
    <tr><td>Route ký tự đại diện</td><td><code>app.get('*', …)</code></td><td>phải có tên: <code>app.get('/*splat', …)</code></td></tr>
    <tr><td>Tham số tuỳ chọn</td><td><code>'/:id?'</code></td><td><code>'/{:id}'</code></td></tr>
    <tr><td>Phát hành</td><td>4.0 năm 2014</td><td>5.0 tháng 9/2024; thành bản "latest" mặc định trên npm từ 5.1 (3/2025)</td></tr>
  </tbody>
</table>
<p>Nếu code chép từ một hướng dẫn cũ báo lỗi ngay lúc khởi động, hãy tìm dấu <code>*</code> hoặc <code>?</code> trong các đường dẫn route. Lưới hứng của ta dùng <code>app.use(fn)</code> không đường dẫn nên chạy được ở cả hai bản.</p>

<h3>Hai lỗi bạn sẽ gặp ngay ngày đầu</h3>
<pre><code class="language-bash">curl -i http://localhost:4000/health        # server chưa chạy</code></pre>
<div class="out">curl: (7) Failed to connect to localhost port 4000 after 1 ms: Couldn't connect to server</div>
<p>Không có mã HTTP nào cả — chẳng có gì đang lắng nghe. Xem terminal 1 (server có bị sập không? có đang chạy ở cổng khác không?).</p>
<p>Quên <code>"type": "module"</code> trong <code>package.json</code>, Node 22 in ra:</p>
<div class="out">(node:92783) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///…/src/server.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /…/package.json.
(Use &#96;node --trace-warnings ...&#96; to show where the warning was created)</div>
<p>Node 22 đoán đúng và vẫn chạy tệp, nhưng nói rõ bạn cần thêm gì. Các bản cũ hơn từ chối luôn với <code>SyntaxError: Cannot use import statement outside a module</code>.</p>

<div class="pitfall"><p><strong>Bẫy — quên <code>return</code> trước một response sớm.</strong> Viết <code>if (!lab) res.status(404).json(…)</code> mà thiếu <code>return</code> thì handler chạy tiếp tới <code>res.json(lab)</code>. Chúng tôi đã thử: với đúng handler này, lỗi <em>im lặng</em>, vì <code>lab</code> là <code>undefined</code> và Express 5.3 không gửi thêm gì. Đổi dòng cuối thành thứ có body thật, như <code>res.json({ found: lab })</code>, là terminal của server hiện ngay <code>Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client</code>. Lỗi lúc có lúc không là loại lỗi tệ nhất — một request, một response, luôn <code>return</code>.</p></div>

<a class="link-card" href="https://expressjs.com/en/guide/migrating-5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Express — Migrating to Express 5 — đọc ngày 1/11/2026</span><span class="lc-sub">Khác Express 4: promise bị từ chối tự tới bộ xử lý lỗi, cú pháp đường dẫn mới (/*splat), req.query chỉ đọc, req.body là undefined khi chưa parse.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
  <li>Dựng khung đúng như trên và chạy bốn lệnh curl. Output của bạn phải khớp, trừ <code>Date</code> và có thể cả <code>ETag</code>.</li>
  <li>Thêm phòng lab thứ tư vào <code>db.js</code> (tự chọn mã phòng). Không khởi động lại bằng tay, gọi <code>GET /labs/lab_4</code> — <code>--watch</code> lẽ ra đã nạp lại rồi.</li>
  <li>Dừng server, khởi động lại bằng <code>PORT=4010 npm run dev</code> và gọi <code>/health</code> ở cổng mới.</li>
  <li>Smoke test: chỉ in mã trạng thái của <code>/health</code>, <code>/labs</code>, <code>/labs/lab_9</code> và <code>/rooms</code> bằng <code>curl -s -o /dev/null -w '%{http_code}\\n'</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> smoke test in ra <code>200</code>, <code>200</code>, <code>404</code>, <code>404</code>, và cả hai body 404 đều là JSON có trường <code>error</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">npm package (gói npm)</span><span class="v">Một thư viện dùng lại được, cài vào <code>node_modules/</code>; Express là một gói.</span></div>
  <div class="kv"><span class="k">package.json</span><span class="v">"Chứng minh thư" của dự án: tên, script, dependency, cấu hình.</span></div>
  <div class="kv"><span class="k">ES module</span><span class="v">Tệp JavaScript dùng <code>import</code>/<code>export</code>; bật bằng <code>"type": "module"</code>.</span></div>
  <div class="kv"><span class="k">Handler (hàm xử lý)</span><span class="v">Hàm trả lời một route: <code>(req, res) =&gt; { … }</code>.</span></div>
  <div class="kv"><span class="k">Route parameter (tham số đường dẫn)</span><span class="v">Một phần có tên trong path, <code>:labId</code>, đọc từ <code>req.params</code>.</span></div>
  <div class="kv"><span class="k">Middleware (hàm trung gian)</span><span class="v">Hàm chạy trên các request theo thứ tự đăng ký; <code>app.use(…)</code>.</span></div>
  <div class="kv"><span class="k">Error handler (bộ xử lý lỗi)</span><span class="v">Middleware bốn tham số <code>(err, req, res, next)</code>, được gọi khi có lỗi ném ra.</span></div>
  <div class="kv"><span class="k">Health check (kiểm tra sức khoẻ)</span><span class="v">Endpoint như <code>/health</code> mà các công cụ gọi để hỏi "còn sống không?".</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>npm init -y</code>, <code>npm install express@5</code>, rồi <code>"type": "module"</code> và hai script <code>dev</code>/<code>start</code>.</li>
  <li>Ba tệp: <code>server.js</code> khởi động, <code>app.js</code> là API, <code>db.js</code> giữ dữ liệu.</li>
  <li><code>npm run dev</code> tự khởi động lại mỗi lần lưu; làm việc với hai terminal.</li>
  <li>Danh sách được bọc thành <code>{ "data": [ … ] }</code> để sau này lớn thêm được.</li>
  <li>Luôn trả JSON: một lưới hứng 404 và một bộ xử lý lỗi bốn tham số, đăng ký sau cùng.</li>
  <li>Lỗi mang mã <code>error</code> ổn định cho chương trình và câu <code>message</code> cho con người.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/authentication/learn?lessonSlug=auth-0-3-dang-nhap-sai" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học sâu hơn ở khoá Authentication — bài 0.3: LabFlow ID, một cái đăng nhập chạy được và sai sáu chỗ</span><span class="lc-sub">Giống: cùng một thế giới LabFlow — An, Bình và Cô Lan, Node 22 và Express 5. Khoá đó dựng LabFlow ID, dịch vụ danh tính của nền tảng, bắt đầu từ một cái đăng nhập ngây thơ bị tấn công thật (mật khẩu thô, dò email, mã phiên đoán ra trong 4,37 s, không giới hạn lượt thử); tới Chương 8 nó cho người dùng LabFlow API đăng nhập qua OpenID Connect.</span></span>
  <span class="lc-cta">MỞ BÀI AUTHENTICATION →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 0.4 Kiểm tra (bài MỚI) ─────────────────────────── */
    {
      title: '0.4 — Section 0 check: contracts, HTTP and your first API|||0.4 — Kiểm tra Mục 0: hợp đồng, HTTP và API đầu tiên',
      slug: 'api-0-4-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về khái niệm API, đọc HTTP bằng curl, sự cố thật và khung LabFlow; mỗi câu có giải thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Check</span>
<h2>Section 0 check: contracts, HTTP and your first API</h2>
<p class="lead">Ten short situations from Section 0. Answer from memory first; each explanation says why the right answer is right and why the most tempting wrong one is wrong. Aim for 7/10 before starting Chapter 1.</p>
<h3>Self-check before you start</h3>
<ul>
  <li>I can explain the difference between an API, an endpoint, a route and a resource.</li>
  <li>I can say what HTTP is and what REST is, and why they are not the same.</li>
  <li>I can read a <code>curl -i</code> response: status line, headers, empty line, body.</li>
  <li>I can tell what I sent from what I received in <code>curl -v</code> output.</li>
  <li>I can name the design rule behind at least three of the five incidents.</li>
  <li>My LabFlow skeleton runs and answers JSON for <code>/labs/lab_9</code> and <code>/rooms</code>.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Kiểm tra Mục 0: hợp đồng, HTTP và API đầu tiên</h2>
<p class="lead">Mười tình huống ngắn từ Mục 0. Hãy trả lời bằng trí nhớ trước; mỗi câu đều giải thích vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai. Nhắm 7/10 trước khi vào Chương 1.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
  <li>Tôi giải thích được API, endpoint, route và resource khác nhau thế nào.</li>
  <li>Tôi nói được HTTP là gì, REST là gì, và vì sao chúng không phải một.</li>
  <li>Tôi đọc được response của <code>curl -i</code>: dòng trạng thái, header, dòng trống, body.</li>
  <li>Tôi phân biệt được cái mình gửi với cái mình nhận trong output <code>curl -v</code>.</li>
  <li>Tôi nêu được luật thiết kế đứng sau ít nhất ba trong năm sự cố.</li>
  <li>Khung LabFlow của tôi chạy và trả JSON cho <code>/labs/lab_9</code> lẫn <code>/rooms</code>.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your front-end teammate asks: "When I call POST /bookings and the room is already taken, what status and what JSON do I get back?" What is she really asking about?|||Bạn front-end cùng nhóm hỏi: "Khi mình gọi POST /bookings mà phòng đã có người đặt, mình nhận về mã gì và JSON gì?" Thật ra bạn ấy đang hỏi về cái gì?',
            options: [
              'The route function in your Express code|||Hàm route trong code Express của bạn',
              'The API contract: what that endpoint promises to return, including errors|||Hợp đồng API: endpoint đó hứa trả về gì, kể cả khi lỗi',
              'The database table that stores bookings|||Bảng cơ sở dữ liệu lưu các lượt đặt',
              'The HTTP version the server uses|||Phiên bản HTTP mà server dùng',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: She depends on the promise — status code and response shape for this case — not on how you implement it. The route function is tempting, but you could rewrite it completely without changing what she sees; the contract is what must stay stable.|||VI: Bạn ấy phụ thuộc vào lời hứa — mã trạng thái và hình dạng response trong tình huống này — chứ không phụ thuộc vào cách bạn cài đặt. Hàm route nghe hấp dẫn, nhưng bạn có thể viết lại nó hoàn toàn mà bạn ấy chẳng thấy gì khác; thứ phải giữ ổn định là hợp đồng.',
          },
          {
            question: 'You send a valid JSON body to your Express API with curl -X POST … -d and no -H option, and the handler sees req.body as empty. The mirror server shows "content-type": "application/x-www-form-urlencoded". Why?|||Bạn gửi một body JSON hợp lệ tới API Express bằng curl -X POST … -d mà không có tuỳ chọn -H, và handler thấy req.body rỗng. Máy chủ tấm gương cho thấy "content-type": "application/x-www-form-urlencoded". Vì sao?',
            options: [
              'POST requests cannot carry a body in HTTP/1.1|||Request POST không được mang body trong HTTP/1.1',
              'JSON bodies must be sent with PUT, not POST|||Body JSON phải gửi bằng PUT, không được gửi bằng POST',
              'express.json() only works on port 3000|||express.json() chỉ chạy ở cổng 3000',
              'With -d alone curl labels the body as a form, and express.json() only parses bodies labelled JSON|||Chỉ có -d thì curl dán nhãn body là form, mà express.json() chỉ phân tích body được dán nhãn JSON',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The bytes arrived, but with the wrong Content-Type, so express.json() skipped them. Add -H "Content-Type: application/json" or use --json. Any method can carry a JSON body — POST is exactly the right one for creating a booking.|||VI: Các byte đã tới nơi, nhưng với Content-Type sai, nên express.json() bỏ qua. Thêm -H "Content-Type: application/json" hoặc dùng --json. Phương thức nào cũng mang được body JSON — POST còn chính là phương thức đúng để tạo lượt đặt.',
          },
          {
            question: 'In curl -v output, what do the lines that start with ">" show?|||Trong output của curl -v, những dòng bắt đầu bằng ">" cho thấy điều gì?',
            options: [
              'The request exactly as curl sent it|||Request đúng như curl đã gửi đi',
              'The response headers from the server|||Các header response từ server',
              'Errors that curl hit while connecting|||Các lỗi curl gặp khi kết nối',
              'The body of the response|||Body của response',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: ">" marks lines curl sent (your request line and headers); "<" marks lines it received; "*" is curl describing the connection. Response headers are the "<" lines, which is the usual mix-up.|||VI: ">" đánh dấu những dòng curl đã gửi (dòng request và header của bạn); "<" là những dòng nó nhận; "*" là curl kể về kết nối. Header của response là các dòng "<" — đây là chỗ hay nhầm nhất.',
          },
          {
            question: 'In http://localhost:4000/labs?building=Beta, which part names the resource?|||Trong http://localhost:4000/labs?building=Beta, phần nào gọi tên tài nguyên?',
            options: [
              'localhost',
              '4000',
              '/labs',
              '?building=Beta',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The path /labs names the resource — the labs collection. The query ?building=Beta only filters it; /labs?building=Alpha is the same resource filtered differently. Host and port only locate the server.|||VI: Đường dẫn /labs gọi tên tài nguyên — bộ sưu tập labs. Query ?building=Beta chỉ lọc nó; /labs?building=Alpha là cùng một tài nguyên, lọc khác đi. Host và port chỉ dùng để tìm ra server.',
          },
          {
            question: 'A client receives 503 Service Unavailable. What should the client developer conclude first?|||Một client nhận về 503 Service Unavailable. Người viết client nên kết luận điều gì trước tiên?',
            options: [
              'Their request is malformed and must be fixed before retrying|||Request của họ sai định dạng, phải sửa rồi mới gửi lại',
              'The server side is failing or overloaded; the request itself may be fine, so retrying later can make sense|||Phía server đang lỗi hoặc quá tải; bản thân request có thể vẫn đúng, nên thử lại sau là hợp lý',
              'They are not logged in|||Họ chưa đăng nhập',
              'The resource has been deleted for good|||Tài nguyên đã bị xoá vĩnh viễn',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The first digit 5 means the server failed. 503 in particular means temporarily unavailable — overloaded or under maintenance. "Malformed request" is a 4xx idea (400); "not logged in" is 401; "gone for good" is 410.|||VI: Chữ số đầu là 5 nghĩa là server bị lỗi. Riêng 503 là tạm thời không phục vụ được — quá tải hoặc đang bảo trì. "Request sai định dạng" là chuyện của 4xx (400); "chưa đăng nhập" là 401; "mất vĩnh viễn" là 410.',
          },
          {
            question: 'In the USPS 2018 incident, any logged-in user could look up other users’ details. Which design rule would have prevented it?|||Trong sự cố USPS 2018, bất kỳ ai đã đăng nhập cũng tra được thông tin của người khác. Luật thiết kế nào lẽ ra đã chặn được?',
            options: [
              'Check on every request that this caller may access this specific record|||Ở mọi request, kiểm tra người gọi này có được truy cập đúng bản ghi này không',
              'Move the API from HTTP/1.1 to HTTP/2|||Chuyển API từ HTTP/1.1 sang HTTP/2',
              'Return 200 for every request to hide errors|||Trả 200 cho mọi request để giấu lỗi',
              'Rename the endpoints so they are harder to guess|||Đổi tên endpoint cho khó đoán hơn',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Users were authenticated, but the API never authorised access per record — the OWASP number one, BOLA (Chapter 6). Hard-to-guess names only hide the hole; anyone who finds the URL still gets everything.|||VI: Người dùng đã được xác thực, nhưng API không bao giờ phân quyền theo từng bản ghi — lỗi số một của OWASP, BOLA (Chương 6). Đặt tên khó đoán chỉ che lỗ hổng; ai tìm ra URL vẫn lấy được hết.',
          },
          {
            question: 'Twitter changed its developer terms in January 2023 and third-party apps such as Tweetbot stopped working with no advance notice. Which practice is about exactly this problem?|||Tháng 1/2023 Twitter đổi điều khoản cho nhà phát triển và các app bên thứ ba như Tweetbot ngừng chạy mà không được báo trước. Thực hành nào nói đúng về vấn đề này?',
            options: [
              'Rate limiting each client|||Giới hạn tần suất từng client',
              'Returning JSON for 404 errors|||Trả JSON cho lỗi 404',
              'Using curl instead of a browser|||Dùng curl thay cho trình duyệt',
              'Versioning, deprecation notices and a sunset timeline for breaking changes|||Quản lý phiên bản, thông báo ngừng hỗ trợ và lộ trình kết thúc cho thay đổi phá vỡ',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The contract changed overnight. Versioning and a published deprecation policy (Chapter 4) give clients time to adapt. Rate limiting is a real API practice, but it protects the server from too many calls — it does nothing for clients whose contract disappears.|||VI: Hợp đồng bị đổi qua một đêm. Quản lý phiên bản và chính sách ngừng hỗ trợ công khai (Chương 4) cho client thời gian thích nghi. Rate limit là thực hành có thật, nhưng nó bảo vệ server khỏi quá nhiều lời gọi — chẳng giúp gì cho client khi hợp đồng của họ biến mất.',
          },
          {
            question: 'Your first LabFlow skeleton returns "<!DOCTYPE html> … Cannot GET /rooms" for an unknown URL, and the mobile app crashes parsing it. What is the right fix?|||Khung LabFlow đầu tiên trả về "<!DOCTYPE html> … Cannot GET /rooms" cho một URL lạ, và app di động sập khi phân tích nó. Cách sửa đúng là gì?',
            options: [
              'Tell the mobile team to catch JSON parse errors|||Bảo đội mobile bắt lỗi khi phân tích JSON',
              'Return 200 with an empty object for unknown URLs|||Trả 200 kèm object rỗng cho URL lạ',
              'Add a catch-all app.use((req, res) => res.status(404).json(…)) after all routes|||Thêm lưới hứng app.use((req, res) => res.status(404).json(…)) sau mọi route',
              'Put the catch-all at the top of app.js so it runs first|||Đặt lưới hứng ở đầu app.js để nó chạy trước',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The API should always answer in JSON with the right status. Express tries handlers in registration order, so the catch-all must be after the routes. Putting it first is the tempting mistake: it would answer 404 for every request, including valid ones.|||VI: API nên luôn trả lời bằng JSON với đúng mã trạng thái. Express thử các handler theo thứ tự đăng ký, nên lưới hứng phải đứng sau các route. Đặt nó lên đầu là cái sai hấp dẫn: nó sẽ trả 404 cho mọi request, kể cả request hợp lệ.',
          },
          {
            question: 'HTTP is stateless. What does that mean for an API that needs to know who the user is?|||HTTP không giữ trạng thái (stateless). Điều đó nghĩa là gì với một API cần biết người dùng là ai?',
            options: [
              'Every request must carry the credential (for example an Authorization header)|||Mọi request phải mang thông tin xác thực (ví dụ header Authorization)',
              'The server remembers the user after the first request on the same connection|||Server nhớ người dùng sau request đầu tiên trên cùng kết nối',
              'Only GET requests can be authenticated|||Chỉ request GET mới xác thực được',
              'Users must log in again after every response|||Người dùng phải đăng nhập lại sau mỗi response',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Each request is understood alone, so it must include who you are every time; "staying logged in" is the client re-sending a cookie or token. Users do not type their password again — the client re-sends the credential for them.|||VI: Mỗi request được hiểu riêng lẻ, nên lần nào cũng phải kèm thông tin bạn là ai; "vẫn đăng nhập" là client tự gửi lại cookie hoặc token. Người dùng không phải gõ lại mật khẩu — client gửi lại thông tin xác thực thay cho họ.',
          },
          {
            question: 'A classmate on Windows PowerShell 5.1 runs the lesson’s curl -i command and gets output and errors that look nothing like the lesson. What is the most likely cause and fix?|||Một bạn dùng Windows PowerShell 5.1 chạy lệnh curl -i trong bài và nhận output, lỗi chẳng giống bài chút nào. Nguyên nhân và cách sửa khả dĩ nhất là gì?',
            options: [
              'Windows cannot send HTTP requests; use a Mac|||Windows không gửi được request HTTP; hãy dùng Mac',
              'In PowerShell 5.1 "curl" is an alias for Invoke-WebRequest; type curl.exe (or use Git Bash/WSL)|||Trong PowerShell 5.1 "curl" là bí danh của Invoke-WebRequest; hãy gõ curl.exe (hoặc dùng Git Bash/WSL)',
              'The LabFlow server only accepts requests from macOS|||Server LabFlow chỉ nhận request từ macOS',
              'The -i flag must be written in upper case on Windows|||Trên Windows cờ -i phải viết hoa',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Microsoft documents curl as an alias of Invoke-WebRequest in Windows PowerShell 5.1, a different command with different parameters. The real curl ships with Windows 10/11 as curl.exe. Upper-case -I is a different flag (HEAD request), not a Windows spelling.|||VI: Microsoft ghi rõ curl là bí danh của Invoke-WebRequest trong Windows PowerShell 5.1, một lệnh khác với tham số khác. curl thật có sẵn trên Windows 10/11 dưới tên curl.exe. -I viết hoa là một cờ khác hẳn (request HEAD), không phải cách viết riêng của Windows.',
          },
        ],
      },
    },
  ],
};
