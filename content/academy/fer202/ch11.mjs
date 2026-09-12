/**
 * FER202 · Chapter 11 additions — Client–Server Communication (Slot 18, 28
 * slides: HTTP, JSON, REST) and Fetching & Caching Data (Slot 19, 21 slides:
 * promises, async/await, fetch, axios CRUD) plus Exercises 26 (json-server)
 * and 27 (axios). Grounded slide-by-slide in Slot18/Slot19. Spliced into
 * Chapter 11 before its quiz; existing 11.1 / 11.2 lessons untouched.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const CODELAB = `/code-lab/react${REF}`;
const EXPHUB = `/exp-hub${REF}`;

/* ═══════════ 11.3 — Client–Server Communication (Slot 18) ═══════════ */
const HTTP = {
  title: '11.3 — Slide by slide: HTTP, JSON & REST (Slot 18)|||11.3 — Học theo từng slide: HTTP, JSON & REST (Slot 18)',
  slug: 'fer202-11-3-slot18-http-rest-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 28 slide Slot 18: client/server, bản chất bất đồng bộ của mạng, HTTP (verbs, request/response, mã trạng thái), JSON, và REST (nguyên tắc, resource & URI, verbs↔CRUD, representations, stateless).',
  content: [
    bi(
      `<span class="eyebrow">Chapter 11 · Lesson 11.3 · Slot 18 deck (28 slides)</span>
<h2>How the front-end talks to a server, slide by slide</h2>
<p class="lead">Before fetching data you need the vocabulary: <strong>HTTP</strong> (the protocol), <strong>JSON</strong> (the data format) and <strong>REST</strong> (how APIs are shaped). This deck is that foundation; Slot 19 (next lesson) does the actual fetching.</p>`,
      `<span class="eyebrow">Chương 11 · Bài 11.3 · Bộ slide Slot 18 (28 slide)</span>
<h2>Front-end nói chuyện với server thế nào, theo từng slide</h2>
<p class="lead">Trước khi lấy dữ liệu bạn cần từ vựng: <strong>HTTP</strong> (giao thức), <strong>JSON</strong> (định dạng dữ liệu) và <strong>REST</strong> (cách API được thiết kế). Bộ slide này là nền tảng đó; Slot 19 (bài kế) mới thực sự lấy dữ liệu.</p>`,
    ),
    walkHead('slot18', 1, 28),
    walk('slot18', [
      [1, 'Client-Server Communication', `<p>Title slide.</p>`, `<p>Slide bìa.</p>`],
      [2, 'Objectives', `<p>Set up a simple server that makes data available, access it from a browser, and use <code>json-server</code> as a simple static web server (Exercise 26).</p>`, `<p>Dựng một server đơn giản cung cấp dữ liệu, truy cập từ trình duyệt, và dùng <code>json-server</code> làm web server tĩnh đơn giản (Exercise 26).</p>`],
      [3, 'Networking essentials', `<p>Section divider.</p>`, `<p>Slide phân mục.</p>`],
      [4, 'Client and server', `<p>Web apps are not stand-alone — most have a <strong>“Cloud” backend</strong>. The client (browser, React) requests; the server holds the data and logic.</p>`, `<p>Web app không đứng một mình — đa số có <strong>backend "Cloud"</strong>. Client (trình duyệt, React) gửi yêu cầu; server giữ dữ liệu và logic.</p>`],
      [5, 'Communication is asynchronous', `<p>Network operations cause unexpected delays — data is <strong>not instantaneously available</strong>. You must write apps that recognise this asynchronous nature (promises, async/await — Slot 19).</p>`, `<p>Thao tác mạng gây trễ bất ngờ — dữ liệu <strong>không có ngay tức thì</strong>. Bạn phải viết app nhận biết bản chất bất đồng bộ này (promise, async/await — Slot 19).</p>`],
      [6, 'HTTP & its verbs', `<p><strong>HTTP</strong> is the client–server protocol of the Web for retrieving linked documents. The verbs: <code>HEAD, GET, POST, PUT, DELETE, TRACE, OPTIONS, CONNECT</code> — you mostly use GET/POST/PUT/DELETE.</p>`, `<p><strong>HTTP</strong> là giao thức client–server của Web để lấy tài liệu liên kết. Các verb: <code>HEAD, GET, POST, PUT, DELETE, TRACE, OPTIONS, CONNECT</code> — bạn dùng chủ yếu GET/POST/PUT/DELETE.</p>`],
      [7, 'HTTP — request/response cycle', `<p>The core loop: the client sends a <strong>request</strong>, the server returns a <strong>response</strong>. Every data operation in your app is one of these round-trips.</p>`, `<p>Vòng lặp cốt lõi: client gửi <strong>request</strong>, server trả <strong>response</strong>. Mọi thao tác dữ liệu trong app là một vòng đi-về như vậy.</p>`],
      [8, 'HTTP request message', `<p>A request has a <strong>method + URL</strong>, <strong>headers</strong> (e.g. <code>Content-Type</code>, <code>Authorization</code>) and an optional <strong>body</strong> (data for POST/PUT).</p>`, `<p>Một request có <strong>method + URL</strong>, các <strong>header</strong> (ví dụ <code>Content-Type</code>, <code>Authorization</code>) và một <strong>body</strong> tuỳ chọn (dữ liệu cho POST/PUT).</p>`],
      [9, 'HTTP response message', `<p>A response has a <strong>status code</strong>, <strong>headers</strong> and a <strong>body</strong> (usually JSON). Your code reads the status to know success/failure and the body for the data.</p>`, `<p>Một response có <strong>status code</strong>, các <strong>header</strong> và một <strong>body</strong> (thường là JSON). Code của bạn đọc status để biết thành/bại và body để lấy dữ liệu.</p>`],
      [10, 'HTTP response codes', `<p>The ones to know: <code>200 OK</code>, <code>201 Created</code>, <code>301 Moved Permanently</code>, <code>304 Not Modified</code>, <code>400 Bad Request</code>, <code>401 Unauthorized</code>, <code>403 Forbidden</code>, <code>404 Not Found</code>, <code>422 Unprocessable</code>, <code>500 Internal Server Error</code>, <code>505 HTTP Version Not Supported</code>. 2xx=ok, 4xx=client error, 5xx=server error.</p>`, `<p>Cần nhớ: <code>200 OK</code>, <code>201 Created</code>, <code>301 Moved Permanently</code>, <code>304 Not Modified</code>, <code>400 Bad Request</code>, <code>401 Unauthorized</code>, <code>403 Forbidden</code>, <code>404 Not Found</code>, <code>422 Unprocessable</code>, <code>500 Internal Server Error</code>, <code>505</code>. 2xx=ổn, 4xx=lỗi client, 5xx=lỗi server.</p>`],
      [11, 'HTTP response formats', `<p>The server may return data as <strong>XML</strong> or <strong>JSON</strong>. Modern web APIs almost always use JSON.</p>`, `<p>Server có thể trả dữ liệu dạng <strong>XML</strong> hoặc <strong>JSON</strong>. API web hiện đại gần như luôn dùng JSON.</p>`],
      [12, 'JSON', `<p><strong>JSON</strong> (JavaScript Object Notation) — a lightweight, language-independent, self-describing data-interchange format (json.org). It is the lingua franca between your React app and any API.</p>`, `<p><strong>JSON</strong> (JavaScript Object Notation) — định dạng trao đổi dữ liệu nhẹ, độc lập ngôn ngữ, tự mô tả (json.org). Nó là ngôn ngữ chung giữa app React và mọi API.</p>`],
      [13, 'JSON structure', `<p>JSON is name/value pairs (objects <code>{}</code>) and ordered lists (arrays <code>[]</code>). The slide's <code>promotions</code> example is an array of objects with <code>id, name, image, price, description</code> — exactly the shape you <code>.map()</code> into components.</p>`, `<p>JSON gồm cặp tên/giá trị (object <code>{}</code>) và danh sách có thứ tự (mảng <code>[]</code>). Ví dụ <code>promotions</code> trên slide là mảng object có <code>id, name, image, price, description</code> — đúng hình dạng bạn <code>.map()</code> ra component.</p>`],
      [14, 'Representational State Transfer (REST)', `<p>Section divider — the architectural style behind most web APIs.</p>`, `<p>Slide phân mục — phong cách kiến trúc đứng sau đa số web API.</p>`],
      [15, 'Web services: SOAP vs REST', `<p>Web services let systems interoperate over a network (SOA). Two approaches: <strong>SOAP</strong> (WSDL, XML, heavy) and <strong>REST</strong> (web standards, XML or JSON, simpler). React apps talk to REST APIs.</p>`, `<p>Web service cho các hệ thống liên thông qua mạng (SOA). Hai cách: <strong>SOAP</strong> (WSDL, XML, nặng) và <strong>REST</strong> (chuẩn web, XML hoặc JSON, đơn giản hơn). App React nói chuyện với REST API.</p>`],
      [16, 'What is REST?', `<p>REST is a style for distributed hypermedia systems (the Web), from Roy Fielding's dissertation (a principal author of HTTP). It is a set of principles for how resources are defined and addressed.</p>`, `<p>REST là phong cách cho hệ hypermedia phân tán (Web), từ luận án của Roy Fielding (một tác giả chính của HTTP). Nó là tập nguyên tắc về cách định nghĩa và định địa chỉ resource.</p>`],
      [17, 'REST — four principles', `<p>(1) Use HTTP methods explicitly, (2) be <strong>stateless</strong>, (3) expose directory-like URIs, (4) transfer data as XML/JSON. Memorise these four — they are common exam material.</p>`, `<p>(1) Dùng HTTP method rõ ràng, (2) <strong>stateless</strong>, (3) URI kiểu thư mục, (4) truyền dữ liệu bằng XML/JSON. Thuộc bốn nguyên tắc này — hay ra trong đề.</p>`],
      [18, 'REST and HTTP', `<p>REST captures what made the Web work: addressable resources via <strong>URIs</strong>, the HTTP protocol (request → response → display), full use of verbs (not just GET/POST but PUT/DELETE), and preserving <strong>idempotence</strong>.</p>`, `<p>REST nắm bắt điều làm Web thành công: resource định địa chỉ bằng <strong>URI</strong>, giao thức HTTP (request → response → hiển thị), dùng đủ verb (không chỉ GET/POST mà cả PUT/DELETE), và giữ <strong>idempotence</strong>.</p>`],
      [19, 'REST concepts', `<p>Section divider — resources, naming, verbs, representations, statelessness.</p>`, `<p>Slide phân mục — resource, đặt tên, verb, representation, tính stateless.</p>`],
      [20, 'Resources', `<p>The key REST abstraction is a <strong>resource</strong> — anything nameable (a document, image, a person, "today's weather", a collection). Each has a global identifier: a URI, e.g. <code>https://api.example.com/id/123</code>.</p>`, `<p>Trừu tượng cốt lõi của REST là <strong>resource</strong> — bất cứ thứ gì đặt tên được (tài liệu, ảnh, một người, "thời tiết hôm nay", một tập hợp). Mỗi cái có định danh toàn cục: một URI, ví dụ <code>https://api.example.com/id/123</code>.</p>`],
      [21, 'Naming resources', `<p>REST uses <strong>URIs</strong> in a directory structure: <code>/news/</code> (all news) → <code>/news/452</code> (one). Traversing from generic to specific navigates the data. Nouns, not verbs, in the path.</p>`, `<p>REST dùng <strong>URI</strong> theo cấu trúc thư mục: <code>/news/</code> (tất cả tin) → <code>/news/452</code> (một tin). Đi từ tổng quát tới cụ thể là điều hướng dữ liệu. Dùng danh từ, không phải động từ, trong path.</p>`],
      [22, 'Verbs ↔ CRUD', `<p>The mapping to memorise: <strong>GET → READ</strong>, <strong>POST → CREATE</strong>, <strong>PUT → UPDATE</strong>, <strong>DELETE → DELETE</strong>. The HTTP method <em>is</em> the operation; the URL is the resource.</p>`, `<p>Ánh xạ cần thuộc: <strong>GET → READ</strong>, <strong>POST → CREATE</strong>, <strong>PUT → UPDATE</strong>, <strong>DELETE → DELETE</strong>. HTTP method <em>chính là</em> thao tác; URL là resource.</p>`],
      [23, 'HTTP GET', `<p>GET requests information; it transfers data from server to client (XML/JSON). <code>GET /news/</code> = all news; <code>GET /news/452</code> = one. GET has no body and should not change data (safe).</p>`, `<p>GET yêu cầu thông tin; nó chuyển dữ liệu từ server về client (XML/JSON). <code>GET /news/</code> = tất cả tin; <code>GET /news/452</code> = một tin. GET không có body và không nên đổi dữ liệu (an toàn).</p>`],
      [24, 'POST, PUT, DELETE', `<p><strong>POST</strong> creates (<code>POST /feedback/</code> with a body creates new feedback); <strong>PUT</strong> updates (<code>PUT /news/123</code> with a body); <strong>DELETE</strong> removes (<code>DELETE /news/123</code>). POST/PUT/DELETE carry or target data on the server.</p>`, `<p><strong>POST</strong> tạo (<code>POST /feedback/</code> kèm body tạo feedback mới); <strong>PUT</strong> cập nhật (<code>PUT /news/123</code> kèm body); <strong>DELETE</strong> xoá (<code>DELETE /news/123</code>). POST/PUT/DELETE mang hoặc nhắm dữ liệu trên server.</p>`],
      [25, 'Representations', `<p>A resource can be represented in multiple formats (JSON, XML); the client can request a specific one if supported (via the <code>Accept</code> header). The data and its representation are separate.</p>`, `<p>Một resource có thể được biểu diễn nhiều định dạng (JSON, XML); client có thể yêu cầu một định dạng cụ thể nếu server hỗ trợ (qua header <code>Accept</code>). Dữ liệu và cách biểu diễn nó là tách rời.</p>`],
      [26, 'Stateless server', `<p>The server <strong>does not track client state</strong> — every request is independent and must carry all info needed (e.g. an auth token). The client tracks its own state (cookies, local storage). This is REST principle #2 and why REST scales.</p>`, `<p>Server <strong>không theo dõi state của client</strong> — mỗi request độc lập và phải mang đủ thông tin cần (ví dụ token auth). Client tự giữ state (cookie, local storage). Đây là nguyên tắc REST #2 và là lý do REST mở rộng tốt.</p>`],
      [27, 'Exercise 26: json-server', `<p>Hand-off to <strong>Exercise 26</strong> — set up a fake REST API and static server with <code>json-server</code>. Full brief in the next lessons.</p>`, `<p>Chuyển sang <strong>Exercise 26</strong> — dựng một REST API giả và server tĩnh bằng <code>json-server</code>. Đề đầy đủ ở các bài kế.</p>`],
      [28, 'Summary', `<p>Recap: the client and server communicate over HTTP (verbs, request/response, status codes) exchanging JSON; REST shapes APIs around resources named by URIs, with verbs mapped to CRUD, multiple representations, and a stateless server.</p>`, `<p>Tóm tắt: client và server giao tiếp qua HTTP (verb, request/response, status code) trao đổi JSON; REST thiết kế API quanh resource đặt tên bằng URI, verb ánh xạ CRUD, nhiều representation, và server stateless.</p>`],
    ]),
    books([
      ['mdn', 'HTTP overview, HTTP request methods, HTTP response status codes, and Working with JSON', 'Tổng quan HTTP, các method HTTP, mã trạng thái HTTP, và Làm việc với JSON'],
    ]),
  ].join('\n'),
};

/* ═══════════ 11.4 — Fetching & Caching Data (Slot 19) ═══════════ */
const FETCHING = {
  title: '11.4 — Slide by slide: Fetching data with fetch & axios (Slot 19)|||11.4 — Học theo từng slide: Lấy dữ liệu với fetch & axios (Slot 19)',
  slug: 'fer202-11-4-slot19-fetch-axios-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 21 slide Slot 19: promise (pending/fulfilled/rejected), thoát callback hell, async/await, chạy async trong useEffect, window.fetch, và axios CRUD (get/post/put/delete) — kèm code.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 11 · Lesson 11.4 · Slot 19 deck (21 slides)</span>
<h2>Actually fetching data, slide by slide</h2>
<p class="lead">Now the doing: <strong>promises</strong> and <strong>async/await</strong>, where to run async code in React (<code>useEffect</code>), the built-in <strong><code>fetch</code></strong>, and <strong>axios</strong> for all four CRUD verbs. Exercise 27 follows.</p>`,
      `<span class="eyebrow">Chương 11 · Bài 11.4 · Bộ slide Slot 19 (21 slide)</span>
<h2>Thực sự lấy dữ liệu, theo từng slide</h2>
<p class="lead">Giờ là phần làm: <strong>promise</strong> và <strong>async/await</strong>, chạy code async ở đâu trong React (<code>useEffect</code>), <strong><code>fetch</code></strong> dựng sẵn, và <strong>axios</strong> cho cả bốn verb CRUD. Exercise 27 nằm ngay sau.</p>`,
    ),
    walkHead('slot19', 1, 21),
    walk('slot19', [
      [1, 'Fetching and Caching Data', `<p>Title slide.</p>`, `<p>Slide bìa.</p>`],
      [2, 'Objectives', `<p>When to fetch and store data in React, <code>window.fetch</code>, what promises are, how async/await works, and simplifying requests with Axios.</p>`, `<p>Khi nào fetch và lưu dữ liệu trong React, <code>window.fetch</code>, promise là gì, async/await hoạt động ra sao, và đơn giản hoá request với Axios.</p>`],
      [3, 'Promise & async/await', `<p>A <strong>promise</strong> represents an async result — it lets you write async code in a synchronous style, returning a "promise" of a future value. Three states: <strong>pending</strong>, <strong>fulfilled</strong>, <strong>rejected</strong>.</p>`, `<p>Một <strong>promise</strong> đại diện kết quả async — cho bạn viết code async theo kiểu đồng bộ, trả về "lời hứa" về một giá trị tương lai. Ba trạng thái: <strong>pending</strong>, <strong>fulfilled</strong>, <strong>rejected</strong>.</p>`],
      [4, 'Promise example', `<p>Consume a promise with <code>.then(value =&gt; …)</code> for success and <code>.catch(err =&gt; …)</code> for failure — the two branches of pending → fulfilled/rejected.</p>`, `<p>Dùng một promise với <code>.then(value =&gt; …)</code> cho thành công và <code>.catch(err =&gt; …)</code> cho thất bại — hai nhánh của pending → fulfilled/rejected.</p>`],
      [5, 'Why promises?', `<p>They solve <strong>callback hell</strong> (deeply nested callbacks), can be <strong>chained</strong>, and offer instant <code>Promise.resolve(v)</code>/<code>Promise.reject(e)</code>. The slide's <code>fetchData</code> resolves after a <code>setTimeout</code> — the shape of every async op.</p>`, `<p>Chúng giải quyết <strong>callback hell</strong> (callback lồng sâu), <strong>nối chuỗi</strong> được, và có <code>Promise.resolve(v)</code>/<code>Promise.reject(e)</code> tức thì. <code>fetchData</code> trên slide resolve sau một <code>setTimeout</code> — hình dạng của mọi thao tác async.</p>`],
      [6, 'How async tasks are handled', `<p>JavaScript is single-threaded; async work (timers, network) is handed to the environment and its result queued on the event loop (Chapter 1, slide 15). Your <code>.then</code>/<code>await</code> runs when the result is ready, without blocking the UI.</p>`, `<p>JavaScript đơn luồng; việc async (timer, mạng) được giao cho môi trường và kết quả xếp hàng trên event loop (Chương 1, slide 15). <code>.then</code>/<code>await</code> của bạn chạy khi kết quả sẵn sàng, không chặn UI.</p>`],
      [7, 'Converting callbacks to promises', `<p>The slide contrasts nested callbacks (<code>db.verifyUser(…, cb)</code> inside <code>db.getRoles(…, cb)</code> inside <code>db.logAccess(…)</code>) with the flat promise chain (<code>.then().catch()</code>) — the same logic, readable.</p>`, `<p>Slide đối chiếu callback lồng (<code>db.verifyUser(…, cb)</code> trong <code>db.getRoles(…, cb)</code> trong <code>db.logAccess(…)</code>) với chuỗi promise phẳng (<code>.then().catch()</code>) — cùng logic, dễ đọc.</p>`],
      [8, 'What is async/await?', `<p>Syntax that makes async code read like sync. Mark a function <code>async</code> (it returns a promise) and use <code>await</code> inside to pause until a promise settles — no <code>.then</code> chains.</p>`, `<p>Cú pháp làm code async đọc như đồng bộ. Đánh dấu hàm <code>async</code> (nó trả về promise) và dùng <code>await</code> bên trong để tạm dừng tới khi promise xong — không cần chuỗi <code>.then</code>.</p>`],
      [9, 'Async/await example', `<p>Wrap <code>await</code> in <code>try/catch/finally</code>: <code>try { const r = await fetchData(); setData(r); } catch(e){ setError(e); } finally { setLoading(false); }</code>. This loading/error/data triad is the standard fetch UI pattern.</p>`, `<p>Bọc <code>await</code> trong <code>try/catch/finally</code>: <code>try { const r = await fetchData(); setData(r); } catch(e){ setError(e); } finally { setLoading(false); }</code>. Bộ ba loading/error/data này là mẫu UI fetch chuẩn.</p>`],
      [10, 'Where to run async code — useEffect', `<p>Fetch a component's initial data in a <code>useEffect</code>: <code>useEffect(() =&gt; { fetch(url).then(r =&gt; r.json()).then(setData); }, [])</code>. Run it on mount (<code>[]</code>) or when inputs change (deps). Never call fetch directly in the render body.</p>`, `<p>Lấy dữ liệu ban đầu của component trong <code>useEffect</code>: <code>useEffect(() =&gt; { fetch(url).then(r =&gt; r.json()).then(setData); }, [])</code>. Chạy khi mount (<code>[]</code>) hoặc khi đầu vào đổi (deps). Đừng gọi fetch thẳng trong thân render.</p>`],
      [11, 'Ways to fetch', `<p>RESTful APIs use HTTP over unique URLs: <strong>GET</strong> to read, <strong>POST</strong> to add, <strong>PUT</strong> to update, <strong>DELETE</strong> to remove (the CRUD map from Slot 18). Two tools to call them: <code>fetch</code> and <code>axios</code>.</p>`, `<p>REST API dùng HTTP trên URL riêng: <strong>GET</strong> đọc, <strong>POST</strong> thêm, <strong>PUT</strong> cập nhật, <strong>DELETE</strong> xoá (bản đồ CRUD từ Slot 18). Hai công cụ để gọi: <code>fetch</code> và <code>axios</code>.</p>`],
      [12, 'Getting data with fetch', `<p><code>window.fetch</code> is built into every modern browser — no library. <code>fetch(url).then(r =&gt; r.json()).then(data =&gt; setData(data)).catch(console.error)</code>. Note the two-step: fetch resolves to a Response, then <code>.json()</code> parses the body (also a promise).</p>`, `<p><code>window.fetch</code> có sẵn trong mọi trình duyệt hiện đại — không cần thư viện. <code>fetch(url).then(r =&gt; r.json()).then(data =&gt; setData(data)).catch(console.error)</code>. Chú ý hai bước: fetch resolve ra một Response, rồi <code>.json()</code> phân tích body (cũng là promise).</p>`],
      [13, 'Getting data with axios', `<p><strong>Axios</strong> is a popular request library (<code>npm install axios</code>) with conveniences over fetch: <code>axios.get/post/put/delete</code>, automatic JSON parsing (no <code>.json()</code> step), and easier error handling. <code>axios.get(url).then(resp =&gt; setData(resp.data))</code>.</p>`, `<p><strong>Axios</strong> là thư viện request phổ biến (<code>npm install axios</code>) tiện hơn fetch: <code>axios.get/post/put/delete</code>, tự phân tích JSON (không cần bước <code>.json()</code>), và xử lý lỗi dễ hơn. <code>axios.get(url).then(resp =&gt; setData(resp.data))</code>.</p>`],
      [14, 'Show the result', `<p>Render the fetched array: <code>{repos.length &gt; 0 &amp;&amp; &lt;ul&gt;{repos.map(r =&gt; &lt;li key={r.id}&gt;{r.description}&lt;/li&gt;)}&lt;/ul&gt;}</code>. Guard with <code>length &gt; 0</code> so nothing renders before data arrives.</p>`, `<p>Render mảng đã fetch: <code>{repos.length &gt; 0 &amp;&amp; &lt;ul&gt;{repos.map(r =&gt; &lt;li key={r.id}&gt;{r.description}&lt;/li&gt;)}&lt;/ul&gt;}</code>. Chặn bằng <code>length &gt; 0</code> để không render gì trước khi có dữ liệu.</p>`],
      [15, 'GET with axios', `<p><code>axios.get('/posts').then(res =&gt; setData(res.data)).catch(console.error)</code> — READ. The data is on <code>res.data</code> (already parsed).</p>`, `<p><code>axios.get('/posts').then(res =&gt; setData(res.data)).catch(console.error)</code> — READ. Dữ liệu nằm ở <code>res.data</code> (đã parse sẵn).</p>`],
      [16, 'POST with axios', `<p><code>axios.post('/posts', { title, body })</code> — CREATE. The second argument is the request body; axios serialises it to JSON automatically.</p>`, `<p><code>axios.post('/posts', { title, body })</code> — CREATE. Đối số thứ hai là body request; axios tự chuyển nó thành JSON.</p>`],
      [17, 'PUT with axios', `<p><code>axios.put('/posts/1', { title, body })</code> — UPDATE the resource at that URL with the new content.</p>`, `<p><code>axios.put('/posts/1', { title, body })</code> — UPDATE resource ở URL đó bằng nội dung mới.</p>`],
      [18, 'DELETE with axios', `<p><code>axios.delete('/posts/1')</code> — DELETE the resource. No body; the URL identifies what to remove.</p>`, `<p><code>axios.delete('/posts/1')</code> — DELETE resource. Không body; URL xác định thứ cần xoá.</p>`],
      [19, 'Full CRUD code', `<p>A <code>Restful</code> component wiring all four: state for data + each result, and handlers <code>handleGet/Post/Put/Delete</code> each calling the matching axios method. This is the complete client side of a REST resource.</p>`, `<p>Một component <code>Restful</code> nối cả bốn: state cho data + từng kết quả, và các handler <code>handleGet/Post/Put/Delete</code> mỗi cái gọi method axios tương ứng. Đây là toàn bộ phía client của một resource REST.</p>`],
      [20, 'Exercise 27: axios', `<p>Hand-off to <strong>Exercise 27</strong> — build an AxiosDemo that fetches and displays data. Full brief in the next lessons.</p>`, `<p>Chuyển sang <strong>Exercise 27</strong> — dựng một AxiosDemo fetch và hiển thị dữ liệu. Đề đầy đủ ở các bài kế.</p>`],
      [21, 'Summary', `<p>Recap: promises (pending/fulfilled/rejected) and async/await tame async code; run fetches in <code>useEffect</code> with a loading/error/data pattern; <code>fetch</code> needs a <code>.json()</code> step, <code>axios</code> parses automatically and offers <code>get/post/put/delete</code> for full CRUD.</p>`, `<p>Tóm tắt: promise (pending/fulfilled/rejected) và async/await thuần hoá code async; chạy fetch trong <code>useEffect</code> với mẫu loading/error/data; <code>fetch</code> cần bước <code>.json()</code>, <code>axios</code> parse tự động và có <code>get/post/put/delete</code> cho CRUD đầy đủ.</p>`],
    ]),
    books([
      ['mdn', 'Using the Fetch API, Promises, and async/await', 'Dùng Fetch API, Promise, và async/await'],
      ['reactdoc', '“You Might Not Need an Effect” and “Fetching data” guidance', '“You Might Not Need an Effect” và hướng dẫn “Fetching data”'],
    ]),
  ].join('\n'),
};

const EX26 = {
  title: 'Exercise 26 — Setting up a server with json-server|||Exercise 26 — Dựng server bằng json-server',
  slug: 'fer202-11-ex26-json-server',
  type: 'EXERCISE',
  description: 'Cài json-server, tạo db.json, chạy REST API giả (GET/POST/PUT/DELETE) và phục vụ nội dung tĩnh từ thư mục public — backend cho các bài fetch/axios.',
  content: bi(
    `<span class="eyebrow">Chapter 11 · Exercise 26 · Slot 18 slide 27</span>
<h2>A fake REST API with json-server</h2>
<p class="lead"><b>Goal:</b> stand up a full REST API from a single JSON file, so your React app has a real backend to fetch from.</p>
<ol>
  <li>Install: <code>npm install -g json-server</code> (or as a dev dependency).</li>
  <li>Create <code>db.json</code>:
<pre>{
  "posts":  [ { "id": 1, "title": "Hello", "body": "First post" } ],
  "users":  [ { "id": 1, "name": "An" } ]
}</pre></li>
  <li>Start it: <code>json-server --watch db.json --port 3001</code>.</li>
  <li>You now have a REST API for free:
    <ul>
      <li><code>GET http://localhost:3001/posts</code> — all posts</li>
      <li><code>GET /posts/1</code> · <code>POST /posts</code> · <code>PUT /posts/1</code> · <code>DELETE /posts/1</code></li>
    </ul>
  </li>
  <li>To serve static content too, put files in a <code>public/</code> folder — json-server serves it automatically.</li>
</ol>
<div class="out"><b>Result:</b> a working CRUD backend on <code>localhost:3001</code> that persists changes to <code>db.json</code> — perfect for the fetch/axios exercises without writing any server code.</div>
<div class="di-toi"><a class="link-card exphub" href="${EXPHUB}" target="_blank" rel="noopener"><span class="lc-ico">🛠️</span><span class="lc-body"><span class="lc-title">Local API setup</span><span class="lc-sub">json-server + CORS tips — Exp Hub.</span></span><span class="lc-cta">EXP HUB →</span></a></div>`,
    `<span class="eyebrow">Chương 11 · Exercise 26 · Slot 18 slide 27</span>
<h2>Một REST API giả với json-server</h2>
<p class="lead"><b>Mục tiêu:</b> dựng một REST API đầy đủ từ một file JSON, để app React có backend thật để fetch.</p>
<ol>
  <li>Cài: <code>npm install -g json-server</code> (hoặc làm dev dependency).</li>
  <li>Tạo <code>db.json</code>:
<pre>{
  "posts":  [ { "id": 1, "title": "Hello", "body": "First post" } ],
  "users":  [ { "id": 1, "name": "An" } ]
}</pre></li>
  <li>Chạy: <code>json-server --watch db.json --port 3001</code>.</li>
  <li>Bạn có ngay một REST API miễn phí:
    <ul>
      <li><code>GET http://localhost:3001/posts</code> — tất cả post</li>
      <li><code>GET /posts/1</code> · <code>POST /posts</code> · <code>PUT /posts/1</code> · <code>DELETE /posts/1</code></li>
    </ul>
  </li>
  <li>Muốn phục vụ nội dung tĩnh, đặt file vào thư mục <code>public/</code> — json-server tự phục vụ.</li>
</ol>
<div class="out"><b>Kết quả:</b> một backend CRUD chạy được ở <code>localhost:3001</code> lưu thay đổi vào <code>db.json</code> — hoàn hảo cho các bài fetch/axios mà không phải viết code server.</div>
<div class="di-toi"><a class="link-card exphub" href="${EXPHUB}" target="_blank" rel="noopener"><span class="lc-ico">🛠️</span><span class="lc-body"><span class="lc-title">Cài API cục bộ</span><span class="lc-sub">json-server + mẹo CORS — Exp Hub.</span></span><span class="lc-cta">EXP HUB →</span></a></div>`,
  ),
};

const EX27 = {
  title: 'Exercise 27 — Axios (fetch & display)|||Exercise 27 — Axios (fetch & hiển thị)',
  slug: 'fer202-11-ex27-axios',
  type: 'EXERCISE',
  description: 'Dựng AxiosDemo: fetch dữ liệu bằng axios trong useEffect với loading/error/data, và mở rộng sang POST/PUT/DELETE.',
  content: bi(
    `<span class="eyebrow">Chapter 11 · Exercise 27 · Slot 19 slide 20</span>
<h2>AxiosDemo — fetch and display</h2>
<pre><span class="hljs-keyword">import</span> <span class="hljs-title class_">React</span>, { useState, useEffect } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>;
<span class="hljs-keyword">import</span> axios <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;axios&#x27;</span>;

<span class="hljs-keyword">function</span> <span class="hljs-title function_">AxiosDemo</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [data, setData]   = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>);
  <span class="hljs-keyword">const</span> [error, setError] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>);
  <span class="hljs-keyword">const</span> [loading, setLoading] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">true</span>);

  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    axios.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;https://jsonplaceholder.typicode.com/posts&#x27;</span>)
      .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">res</span> =&gt;</span> <span class="hljs-title function_">setData</span>(res.<span class="hljs-property">data</span>))
      .<span class="hljs-title function_">catch</span>(<span class="hljs-function"><span class="hljs-params">err</span> =&gt;</span> <span class="hljs-title function_">setError</span>(err.<span class="hljs-property">message</span>))
      .<span class="hljs-title function_">finally</span>(<span class="hljs-function">() =&gt;</span> <span class="hljs-title function_">setLoading</span>(<span class="hljs-literal">false</span>));
  }, []);

  <span class="hljs-keyword">if</span> (loading) <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Loading…<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>;
  <span class="hljs-keyword">if</span> (error)   <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Error: {error}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>;
  <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>{data.map(p =&gt; <span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{p.id}</span>&gt;</span>{p.title}<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>)}<span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span></span>;
}
<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">AxiosDemo</span>;</pre>
<p><b>Extend it:</b> add buttons that <code>axios.post</code> a new post, <code>axios.put</code> an edit, and <code>axios.delete</code> one — the full CRUD from Slot 19 slide 19, ideally against your json-server from Exercise 26.</p>
<div class="pitfall"><b>Trap:</b> axios puts the parsed body on <code>res.data</code> — do not call <code>.json()</code> (that is a <code>fetch</code> thing). And errors reject the promise, so handle them in <code>.catch</code>/<code>try…catch</code>, unlike <code>fetch</code> which only rejects on network failure (a 404 still "succeeds").</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Build AxiosDemo</span><span class="lc-sub">GET + full CRUD — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 11 · Exercise 27 · Slot 19 slide 20</span>
<h2>AxiosDemo — fetch và hiển thị</h2>
<pre><span class="hljs-keyword">import</span> <span class="hljs-title class_">React</span>, { useState, useEffect } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>;
<span class="hljs-keyword">import</span> axios <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;axios&#x27;</span>;

<span class="hljs-keyword">function</span> <span class="hljs-title function_">AxiosDemo</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [data, setData]   = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>);
  <span class="hljs-keyword">const</span> [error, setError] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">null</span>);
  <span class="hljs-keyword">const</span> [loading, setLoading] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">true</span>);

  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> {
    axios.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;https://jsonplaceholder.typicode.com/posts&#x27;</span>)
      .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">res</span> =&gt;</span> <span class="hljs-title function_">setData</span>(res.<span class="hljs-property">data</span>))
      .<span class="hljs-title function_">catch</span>(<span class="hljs-function"><span class="hljs-params">err</span> =&gt;</span> <span class="hljs-title function_">setError</span>(err.<span class="hljs-property">message</span>))
      .<span class="hljs-title function_">finally</span>(<span class="hljs-function">() =&gt;</span> <span class="hljs-title function_">setLoading</span>(<span class="hljs-literal">false</span>));
  }, []);

  <span class="hljs-keyword">if</span> (loading) <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Đang tải…<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>;
  <span class="hljs-keyword">if</span> (error)   <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Lỗi: {error}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span></span>;
  <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">ul</span>&gt;</span>{data.map(p =&gt; <span class="hljs-tag">&lt;<span class="hljs-name">li</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{p.id}</span>&gt;</span>{p.title}<span class="hljs-tag">&lt;/<span class="hljs-name">li</span>&gt;</span>)}<span class="hljs-tag">&lt;/<span class="hljs-name">ul</span>&gt;</span></span>;
}
<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">AxiosDemo</span>;</pre>
<p><b>Mở rộng:</b> thêm nút <code>axios.post</code> tạo post mới, <code>axios.put</code> sửa, <code>axios.delete</code> xoá — CRUD đầy đủ từ Slot 19 slide 19, tốt nhất chạy với json-server ở Exercise 26.</p>
<div class="pitfall"><b>Bẫy:</b> axios đặt body đã parse ở <code>res.data</code> — đừng gọi <code>.json()</code> (đó là của <code>fetch</code>). Và lỗi làm reject promise, nên xử lý ở <code>.catch</code>/<code>try…catch</code>, khác <code>fetch</code> chỉ reject khi lỗi mạng (một 404 vẫn "thành công").</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Dựng AxiosDemo</span><span class="lc-sub">GET + CRUD đầy đủ — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

export default [HTTP, FETCHING, EX26, EX27];
