/**
 * SBA301 — Integrate Single Page Application with Spring Boot. Giáo trình FLM.
 * Full-stack React (SPA) + Spring Boot (REST). Không slide gốc → soạn từ syllabus
 * (React, fetch/client-server, Spring Boot REST, JPA, security, MongoDB) + kiến
 * thức, song ngữ, code React/Spring, kèm BÀI TẬP. Giữ NGUYÊN slug.
 * ⚠️ code: KHÔNG backtick & ${ } (dùng nối chuỗi); "\n" viết \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 420, questions } });

const intro = doc('sba301-0-1-overview', 'Course overview: SPA + Spring Boot|||Tổng quan môn: SPA + Spring Boot',
  'Mục tiêu, 8 CLO (ReactJS; fetch/client-server; Spring Boot REST; REST+JPA; security auth; Hibernate+Spring; Spring Data MongoDB; teamwork), lộ trình full-stack, đánh giá.',
  [[
    `<span class="eyebrow">SBA301 · Lesson 0.1 · Overview</span>
<h2>Integrate a Single Page Application with Spring Boot</h2>
<p class="lead">This is a <strong>full-stack</strong> course: a <strong>React</strong> single-page app on the front end talking to a <strong>Spring Boot</strong> REST API on the back end (with JPA and MongoDB for data, and JWT for security). It connects the React skills (FER202) and Spring skills (HSF302) into one working system.</p>
<h3>CLOs</h3>
<ul>
<li><strong>CLO1</strong> — the ReactJS library, services &amp; DI</li>
<li><strong>CLO2</strong> — fetching data in client–server communication</li>
<li><strong>CLO3</strong> — RESTful APIs with Spring Boot</li>
<li><strong>CLO4</strong> — connecting the REST service with JPA</li>
<li><strong>CLO5</strong> — security: authentication &amp; authorization</li>
<li><strong>CLO6</strong> — apps with Hibernate &amp; Spring</li>
<li><strong>CLO7</strong> — Spring Data with MongoDB</li>
<li><strong>CLO8</strong> — teamwork &amp; communication</li>
</ul>
<h3>The architecture</h3>
<p>Browser runs the <strong>React SPA</strong> (one HTML page, JS updates the DOM); it calls the <strong>Spring Boot API</strong> over HTTP (JSON); the API uses <strong>JPA/Hibernate</strong> (SQL) or <strong>MongoDB</strong> (NoSQL) for data. The two run as separate apps, so <strong>CORS</strong> and a token-based auth (<strong>JWT</strong>) glue them together.</p>`,
    `<span class="eyebrow">SBA301 · Bài 0.1 · Tổng quan</span>
<h2>Tích hợp ứng dụng trang đơn với Spring Boot</h2>
<p class="lead">Đây là môn <strong>full-stack</strong>: một app trang đơn <strong>React</strong> ở front-end nói chuyện với một API REST <strong>Spring Boot</strong> ở back-end (dùng JPA và MongoDB cho dữ liệu, JWT cho bảo mật). Nó nối kỹ năng React (FER202) và Spring (HSF302) thành một hệ chạy được.</p>
<h3>CLO</h3>
<ul>
<li><strong>CLO1</strong> — thư viện ReactJS, service &amp; DI</li>
<li><strong>CLO2</strong> — fetch dữ liệu trong giao tiếp client–server</li>
<li><strong>CLO3</strong> — API RESTful với Spring Boot</li>
<li><strong>CLO4</strong> — nối REST service với JPA</li>
<li><strong>CLO5</strong> — bảo mật: xác thực &amp; phân quyền</li>
<li><strong>CLO6</strong> — app với Hibernate &amp; Spring</li>
<li><strong>CLO7</strong> — Spring Data với MongoDB</li>
<li><strong>CLO8</strong> — làm nhóm &amp; giao tiếp</li>
</ul>
<h3>Kiến trúc</h3>
<p>Trình duyệt chạy <strong>React SPA</strong> (một trang HTML, JS cập nhật DOM); nó gọi <strong>API Spring Boot</strong> qua HTTP (JSON); API dùng <strong>JPA/Hibernate</strong> (SQL) hoặc <strong>MongoDB</strong> (NoSQL) cho dữ liệu. Hai bên chạy như hai app riêng, nên <strong>CORS</strong> và auth dựa token (<strong>JWT</strong>) gắn chúng lại.</p>`,
  ]]);

const c1 = doc('sba301-1-1-react', '1.1 — React essentials: components, props, state, hooks|||1.1 — React cơ bản: component, props, state, hook',
  'Component & JSX, props (dữ liệu vào) vs state (useState), render theo state, list & key; useEffect để gọi API; điều hướng SPA (React Router) ngắn gọn.',
  [[
    `<span class="eyebrow">SBA301 · Chapter 1 · Lesson 1.1</span>
<h2>React essentials</h2>
<p class="lead">A React UI is built from <strong>components</strong> — functions that return <strong>JSX</strong> (HTML-like syntax). Data flows down via <strong>props</strong>; a component's own changing data is <strong>state</strong>.</p>
<pre><code class="language-jsx">import { useState, useEffect } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);   // state

  useEffect(() => {                                // run once, fetch data
    fetch("http://localhost:8080/api/products")
      .then(r => r.json())
      .then(setProducts);
  }, []);

  return (
    &lt;ul&gt;
      {products.map(p =&gt; &lt;li key={p.id}&gt;{p.name} - {p.price}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}
</code></pre>
<p><code>useState</code> holds data that, when changed via its setter, re-renders the component. <code>useEffect(fn, [])</code> runs after the first render — the place to <strong>fetch</strong> from the API. Render a list with <code>.map</code> and a unique <code>key</code>. Navigation between "pages" without reloading uses <strong>React Router</strong>.</p>`,
    `<span class="eyebrow">SBA301 · Chương 1 · Bài 1.1</span>
<h2>React cơ bản</h2>
<p class="lead">Một UI React dựng từ <strong>component</strong> — hàm trả về <strong>JSX</strong> (cú pháp giống HTML). Dữ liệu chảy xuống qua <strong>props</strong>; dữ liệu tự thay đổi của component là <strong>state</strong>.</p>
<pre><code class="language-jsx">import { useState, useEffect } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);   // state

  useEffect(() => {                                // chạy một lần, fetch dữ liệu
    fetch("http://localhost:8080/api/products")
      .then(r => r.json())
      .then(setProducts);
  }, []);

  return (
    &lt;ul&gt;
      {products.map(p =&gt; &lt;li key={p.id}&gt;{p.name} - {p.price}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}
</code></pre>
<p><code>useState</code> giữ dữ liệu mà khi đổi qua setter sẽ re-render component. <code>useEffect(fn, [])</code> chạy sau lần render đầu — nơi <strong>fetch</strong> từ API. Render danh sách bằng <code>.map</code> và một <code>key</code> duy nhất. Điều hướng giữa "trang" không tải lại dùng <strong>React Router</strong>.</p>`,
  ]]);

const c1q = quiz('sba301-quiz-1', 'Quiz 1 — React|||Quiz 1 — React', [
  { id: 'q1', question: 'useState dùng để?', options: ['Gọi API', 'Giữ state, đổi → re-render component', 'Định tuyến', 'Style'], correctIndex: 1, explanation: 'useState giữ dữ liệu; setter đổi state → re-render.' },
  { id: 'q2', question: 'Nơi hợp lý để fetch API lần đầu?', options: ['Trong JSX', 'useEffect(fn, [])', 'useState', 'CSS'], correctIndex: 1, explanation: 'useEffect với [] chạy sau render đầu — chỗ gọi API.' },
  { id: 'q3', question: 'Render list cần thuộc tính nào cho mỗi phần tử?', options: ['id CSS', 'key duy nhất', 'ref', 'style'], correctIndex: 1, explanation: 'React cần key duy nhất để theo dõi từng item.' },
]);

const c2 = doc('sba301-2-1-spring-rest-cors', '2.1 — Spring Boot REST API + CORS for the SPA|||2.1 — API REST Spring Boot + CORS cho SPA',
  'Dựng REST API bằng Spring Boot (@RestController, JSON), bật CORS cho origin của React, và trả DTO; nối JPA cho dữ liệu.',
  [[
    `<span class="eyebrow">SBA301 · Chapter 2 · Lesson 2.1</span>
<h2>Spring Boot REST API + CORS</h2>
<p class="lead">The back end is a Spring Boot REST API (as in HSF302/PRN232). Because the React app runs on a different origin (e.g. <code>localhost:5173</code>) than the API (<code>localhost:8080</code>), the browser blocks calls unless the API enables <strong>CORS</strong>.</p>
<pre><code class="language-java">@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")   // allow the React dev server
public class ProductController {
    private final ProductRepository repo;
    public ProductController(ProductRepository repo) { this.repo = repo; }

    @GetMapping
    public List&lt;Product&gt; all() { return repo.findAll(); }

    @PostMapping
    public ResponseEntity&lt;Product&gt; create(@RequestBody Product p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(p));
    }
}
</code></pre>
<p><code>@CrossOrigin</code> (or a global CORS config) tells the browser the API accepts requests from the React origin. Spring auto-serializes objects to JSON. Data access uses a <strong>Spring Data JPA</strong> repository — the same pattern as HSF302.</p>`,
    `<span class="eyebrow">SBA301 · Chương 2 · Bài 2.1</span>
<h2>API REST Spring Boot + CORS</h2>
<p class="lead">Back-end là một API REST Spring Boot (như HSF302/PRN232). Vì app React chạy ở origin khác (vd <code>localhost:5173</code>) so với API (<code>localhost:8080</code>), trình duyệt chặn lời gọi trừ khi API bật <strong>CORS</strong>.</p>
<pre><code class="language-java">@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")   // cho phép React dev server
public class ProductController {
    private final ProductRepository repo;
    public ProductController(ProductRepository repo) { this.repo = repo; }

    @GetMapping
    public List&lt;Product&gt; all() { return repo.findAll(); }

    @PostMapping
    public ResponseEntity&lt;Product&gt; create(@RequestBody Product p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(p));
    }
}
</code></pre>
<p><code>@CrossOrigin</code> (hoặc cấu hình CORS toàn cục) báo trình duyệt API chấp nhận request từ origin React. Spring tự serialize object thành JSON. Truy cập dữ liệu dùng repository <strong>Spring Data JPA</strong> — cùng mẫu như HSF302.</p>`,
  ]]);

const c2q = quiz('sba301-quiz-2', 'Quiz 2 — REST & CORS|||Quiz 2 — REST & CORS', [
  { id: 'q1', question: 'Vì sao React (origin khác) bị chặn gọi API trừ khi bật CORS?', options: ['API chậm', 'Chính sách same-origin của trình duyệt; CORS cho phép origin cụ thể', 'Thiếu HTTPS', 'JSON lỗi'], correctIndex: 1, explanation: 'Trình duyệt chặn cross-origin trừ khi server bật CORS cho origin đó.' },
  { id: 'q2', question: '@RestController trả về?', options: ['View', 'Dữ liệu (JSON)', 'Status only', 'HTML tĩnh'], correctIndex: 1, explanation: '@RestController serialize object thành JSON cho client.' },
]);

const c3 = doc('sba301-3-1-connect-fetch', '3.1 — Connecting React ↔ Spring (fetch/axios, CRUD)|||3.1 — Nối React ↔ Spring (fetch/axios, CRUD)',
  'Gọi API từ React (fetch/axios GET/POST/PUT/DELETE), gửi/nhận JSON, xử lý loading/lỗi, và cập nhật state sau thao tác; luồng CRUD full-stack.',
  [[
    `<span class="eyebrow">SBA301 · Chapter 3 · Lesson 3.1</span>
<h2>Connecting React to Spring</h2>
<p class="lead">The SPA does CRUD by calling the API and updating its state. Use <code>fetch</code> (or <code>axios</code>) with JSON.</p>
<pre><code class="language-jsx">const API = "http://localhost:8080/api/products";

// CREATE
async function addProduct(p) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  });
  return res.json();
}

// DELETE then refresh state
async function remove(id, setProducts) {
  await fetch(API + "/" + id, { method: "DELETE" });
  setProducts(prev => prev.filter(p => p.id !== id));   // update UI
}
</code></pre>
<p>Set <code>Content-Type: application/json</code> and <code>JSON.stringify</code> the body for POST/PUT; check <code>res.ok</code>. After a change, update React state so the UI reflects it (optimistically or by re-fetching). Show a loading flag while awaiting, and handle errors in a <code>try/catch</code>. This request/response loop is the whole of client–server communication.</p>`,
    `<span class="eyebrow">SBA301 · Chương 3 · Bài 3.1</span>
<h2>Nối React với Spring</h2>
<p class="lead">SPA làm CRUD bằng cách gọi API và cập nhật state. Dùng <code>fetch</code> (hoặc <code>axios</code>) với JSON.</p>
<pre><code class="language-jsx">const API = "http://localhost:8080/api/products";

// CREATE
async function addProduct(p) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  });
  return res.json();
}

// DELETE rồi cập nhật state
async function remove(id, setProducts) {
  await fetch(API + "/" + id, { method: "DELETE" });
  setProducts(prev => prev.filter(p => p.id !== id));   // cập nhật UI
}
</code></pre>
<p>Đặt <code>Content-Type: application/json</code> và <code>JSON.stringify</code> body cho POST/PUT; kiểm <code>res.ok</code>. Sau khi đổi, cập nhật state React để UI phản ánh (optimistic hoặc re-fetch). Hiện cờ loading khi đang chờ, và bắt lỗi trong <code>try/catch</code>. Vòng request/response này là toàn bộ giao tiếp client–server.</p>`,
  ]]);

const c3e = doc('sba301-3-2-exercise', 'Exercise 1 — a CRUD list|||Bài tập 1 — danh sách CRUD',
  'Bài tập: viết component React nạp product khi mount và có nút xoá cập nhật UI; kèm lời giải.',
  [[
    `<span class="eyebrow">SBA301 · Chapter 3 · Exercise</span>
<h2>Exercise 1 — a product list with delete</h2>
<div class="callout"><span class="badge">Đề</span> Build a React component that loads products from the API on mount and lets the user delete one (removing it from the list without a full reload).</div>
<h3>Worked solution</h3>
<pre><code class="language-jsx">import { useState, useEffect } from "react";
const API = "http://localhost:8080/api/products";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API).then(r => r.json()).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  async function del(id) {
    await fetch(API + "/" + id, { method: "DELETE" });
    setItems(prev => prev.filter(p => p.id !== id));
  }

  if (loading) return &lt;p&gt;Loading...&lt;/p&gt;;
  return (
    &lt;ul&gt;
      {items.map(p =&gt; (
        &lt;li key={p.id}&gt;
          {p.name} &lt;button onClick={() =&gt; del(p.id)}&gt;Delete&lt;/button&gt;
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}
</code></pre>
<p><strong>Why:</strong> <code>useEffect([])</code> loads once on mount; the loading flag avoids rendering an empty list mid-fetch; <code>del</code> calls DELETE then filters the item out of state so React re-renders instantly — the standard optimistic-update pattern.</p>`,
    `<span class="eyebrow">SBA301 · Chương 3 · Bài tập</span>
<h2>Bài tập 1 — danh sách product có xoá</h2>
<div class="callout"><span class="badge">Đề</span> Xây một component React nạp product từ API khi mount và cho người dùng xoá một cái (bỏ khỏi danh sách không cần tải lại).</div>
<h3>Lời giải</h3>
<pre><code class="language-jsx">import { useState, useEffect } from "react";
const API = "http://localhost:8080/api/products";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API).then(r => r.json()).then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  async function del(id) {
    await fetch(API + "/" + id, { method: "DELETE" });
    setItems(prev => prev.filter(p => p.id !== id));
  }

  if (loading) return &lt;p&gt;Đang tải...&lt;/p&gt;;
  return (
    &lt;ul&gt;
      {items.map(p =&gt; (
        &lt;li key={p.id}&gt;
          {p.name} &lt;button onClick={() =&gt; del(p.id)}&gt;Xoá&lt;/button&gt;
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}
</code></pre>
<p><strong>Vì sao:</strong> <code>useEffect([])</code> nạp một lần khi mount; cờ loading tránh render danh sách rỗng giữa lúc fetch; <code>del</code> gọi DELETE rồi lọc item khỏi state để React re-render tức thì — mẫu optimistic-update chuẩn.</p>`,
  ]]);

const c3q = quiz('sba301-quiz-3', 'Quiz 3 — Client-server|||Quiz 3 — Client-server', [
  { id: 'q1', question: 'POST JSON từ React cần?', options: ['Object thô', 'JSON.stringify(body) + header Content-Type: application/json', 'FormData luôn', 'Không header'], correctIndex: 1, explanation: 'Stringify body và đặt Content-Type application/json.' },
  { id: 'q2', question: 'Sau khi DELETE, cập nhật UI bằng?', options: ['Tải lại cả trang', 'Cập nhật state React (filter item ra)', 'Không cần', 'Đổi CSS'], correctIndex: 1, explanation: 'Cập nhật state → React re-render, không cần reload.' },
]);

const c4 = doc('sba301-4-1-jpa-mongo-security', '4.1 — JPA, MongoDB & security (JWT)|||4.1 — JPA, MongoDB & bảo mật (JWT)',
  'Spring Data JPA (SQL) vs Spring Data MongoDB (NoSQL, document); và bảo mật end-to-end: login React → JWT → gửi Bearer token → API bảo vệ endpoint.',
  [[
    `<span class="eyebrow">SBA301 · Chapter 4 · Lesson 4.1</span>
<h2>JPA, MongoDB &amp; security</h2>
<h3>Two data stores, one Spring Data API</h3>
<p>Spring Data gives a uniform repository style over different stores. <strong>JPA</strong> for relational (SQL) — <code>JpaRepository&lt;Product, Long&gt;</code>; <strong>MongoDB</strong> for document (NoSQL) — <code>MongoRepository&lt;Review, String&gt;</code> where each document is JSON-like. Choose SQL for structured, related data; MongoDB for flexible, nested documents.</p>
<h3>End-to-end security with JWT</h3>
<p>The SPA can't use server sessions easily, so it uses <strong>JWT</strong>: log in, get a token, send it on every request.</p>
<pre><code class="language-jsx">// React: login, then attach the token
const res = await fetch("http://localhost:8080/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
const { token } = await res.json();
localStorage.setItem("token", token);

// later, protected call
fetch("http://localhost:8080/api/orders", {
  headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
});
</code></pre>
<p>On the server, Spring Security validates the <code>Authorization: Bearer</code> token and applies <strong>authorization</strong> (roles) to endpoints — the same JWT flow as PRN232, now front-to-back. <strong>Never</strong> hard-code secrets; serve over HTTPS in production.</p>`,
    `<span class="eyebrow">SBA301 · Chương 4 · Bài 4.1</span>
<h2>JPA, MongoDB &amp; bảo mật</h2>
<h3>Hai kho dữ liệu, một kiểu Spring Data</h3>
<p>Spring Data cho kiểu repository đồng nhất trên các kho khác nhau. <strong>JPA</strong> cho quan hệ (SQL) — <code>JpaRepository&lt;Product, Long&gt;</code>; <strong>MongoDB</strong> cho document (NoSQL) — <code>MongoRepository&lt;Review, String&gt;</code> mỗi document giống JSON. Chọn SQL cho dữ liệu có cấu trúc, liên quan; MongoDB cho document linh hoạt, lồng nhau.</p>
<h3>Bảo mật end-to-end với JWT</h3>
<p>SPA khó dùng session server, nên dùng <strong>JWT</strong>: đăng nhập, nhận token, gửi kèm mỗi request.</p>
<pre><code class="language-jsx">// React: đăng nhập, rồi gắn token
const res = await fetch("http://localhost:8080/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
const { token } = await res.json();
localStorage.setItem("token", token);

// sau đó, lời gọi cần bảo vệ
fetch("http://localhost:8080/api/orders", {
  headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
});
</code></pre>
<p>Phía server, Spring Security xác minh token <code>Authorization: Bearer</code> và áp <strong>phân quyền</strong> (role) cho endpoint — cùng luồng JWT như PRN232, giờ đầu-tới-cuối. <strong>Đừng</strong> hard-code secret; phục vụ qua HTTPS ở production.</p>`,
  ]]);

const c4q = quiz('sba301-quiz-4', 'Quiz 4 — JPA/Mongo & JWT|||Quiz 4 — JPA/Mongo & JWT', [
  { id: 'q1', question: 'MongoDB (Spring Data) hợp cho dữ liệu?', options: ['Có cấu trúc quan hệ chặt', 'Document linh hoạt, lồng nhau (NoSQL)', 'Chỉ số nguyên', 'Không lưu được'], correctIndex: 1, explanation: 'MongoDB là NoSQL document; JPA cho quan hệ SQL.' },
  { id: 'q2', question: 'SPA gửi JWT tới API trong?', options: ['Cookie bắt buộc', 'Header Authorization: Bearer <token>', 'Query string', 'Body luôn'], correctIndex: 1, explanation: 'Chuẩn là Authorization: Bearer <token>.' },
  { id: 'q3', question: 'Vì sao SPA dùng JWT thay session server?', options: ['Nhanh hơn', 'SPA/stateless dễ gắn token mỗi request; không dựa session server', 'Bắt buộc bởi React', 'Để đẹp'], correctIndex: 1, explanation: 'Token tự chứa, hợp kiến trúc SPA + API tách rời, stateless.' },
]);

const taiLieu = doc('sba301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">SBA301 · Resource hub</span>
<h2>📚 Course materials &amp; references</h2>
<p class="lead">A curated hub for self-study: the official FLM syllabus &amp; slides, books, free authoritative docs for React and Spring Boot, YouTube channels, tools, and a step-by-step roadmap. Every link is real and opens in a new tab.</p>
<div class="callout"><span class="badge">FLM</span> Log in to <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a> with your FPTU account to read the official syllabus and lecture slides for this course.</div>
<h3>📘 Syllabus &amp; slides</h3>
<ul>
<li><strong>FLM (flm.fpt.edu.vn)</strong> — the source of truth for SBA301: the 8 CLOs, per-session slides, and assessment scheme. Read the slide of a topic first, then use the sources below to build the full-stack app.</li>
</ul>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.roadtoreact.com/" target="_blank" rel="noopener">The Road to React — Robin Wieruch</a>: a practical, project-based path through modern React (hooks, data fetching).</li>
<li><a href="https://www.manning.com/books/spring-start-here" target="_blank" rel="noopener">Spring Start Here — Laurentiu Spilca (Manning)</a>: a gentle, hands-on introduction to Spring &amp; Spring Boot.</li>
</ul>
<h3>🌐 Free official docs</h3>
<ul>
<li><a href="https://react.dev/" target="_blank" rel="noopener">react.dev</a>: the official React docs — components, hooks, and the interactive tutorial.</li>
<li><a href="https://spring.io/guides" target="_blank" rel="noopener">spring.io/guides</a>: short official guides (REST service, CORS, data access, security).</li>
<li><a href="https://spring.io/projects/spring-boot" target="_blank" rel="noopener">Spring Boot reference</a>: the authoritative reference for auto-configuration and starters.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@NetNinja" target="_blank" rel="noopener">The Net Ninja</a> — clear React &amp; full-stack series.</li>
<li><a href="https://www.youtube.com/@amigoscode" target="_blank" rel="noopener">Amigoscode</a> — Spring Boot &amp; full-stack tutorials.</li>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp</a> — full-length React and Spring Boot courses.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://nodejs.org/" target="_blank" rel="noopener">Node.js</a> — runtime &amp; npm for the React front-end.</li>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">Visual Studio Code</a> — editor for the React side.</li>
<li><a href="https://www.jetbrains.com/idea/" target="_blank" rel="noopener">IntelliJ IDEA</a> — IDE for the Spring Boot back-end.</li>
<li><a href="https://www.postman.com/" target="_blank" rel="noopener">Postman</a> — test your REST API before wiring the SPA.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations for the exam</strong> — master React (components/props/state, hooks, fetch) and Spring Boot REST + CORS from the FLM slides.</li>
<li><strong>Practise on a project</strong> — build a CRUD SPA: a React front-end calling a Spring Boot API, tested first in Postman.</li>
<li><strong>Go deeper in practice</strong> — add Spring Data JPA (SQL) and MongoDB, then secure the app end-to-end with JWT.</li>
<li><strong>Job-ready</strong> — deploy the full-stack app, handle loading/error states cleanly, and explain the client–server data flow.</li>
</ol>`,
    `<span class="eyebrow">SBA301 · Trung tâm tài liệu</span>
<h2>📚 Tài liệu tham khảo môn học</h2>
<p class="lead">Trung tâm tài liệu để tự học: giáo trình &amp; slide chính thức trên FLM, sách, tài liệu uy tín miễn phí cho React và Spring Boot, kênh YouTube, công cụ, và lộ trình từng bước. Mọi link đều thật và mở ở tab mới.</p>
<div class="callout"><span class="badge">FLM</span> Đăng nhập <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a> bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của môn.</div>
<h3>📘 Giáo trình &amp; slide</h3>
<ul>
<li><strong>FLM (flm.fpt.edu.vn)</strong> — nguồn chuẩn của SBA301: 8 CLO, slide từng buổi, và cách đánh giá. Đọc slide của một chủ đề trước, rồi dùng các nguồn dưới để dựng app full-stack.</li>
</ul>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.roadtoreact.com/" target="_blank" rel="noopener">The Road to React — Robin Wieruch</a>: lộ trình React hiện đại theo dự án (hook, gọi dữ liệu).</li>
<li><a href="https://www.manning.com/books/spring-start-here" target="_blank" rel="noopener">Spring Start Here — Laurentiu Spilca (Manning)</a>: nhập môn Spring &amp; Spring Boot dễ hiểu, thực hành.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://react.dev/" target="_blank" rel="noopener">react.dev</a>: tài liệu React chính thức — component, hook, và tutorial tương tác.</li>
<li><a href="https://spring.io/guides" target="_blank" rel="noopener">spring.io/guides</a>: các guide chính thức ngắn (REST service, CORS, truy cập dữ liệu, security).</li>
<li><a href="https://spring.io/projects/spring-boot" target="_blank" rel="noopener">Spring Boot reference</a>: tài liệu chuẩn về auto-configuration và starter.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@NetNinja" target="_blank" rel="noopener">The Net Ninja</a> — series React &amp; full-stack mạch lạc.</li>
<li><a href="https://www.youtube.com/@amigoscode" target="_blank" rel="noopener">Amigoscode</a> — hướng dẫn Spring Boot &amp; full-stack.</li>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp</a> — khoá dài về React và Spring Boot.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://nodejs.org/" target="_blank" rel="noopener">Node.js</a> — runtime &amp; npm cho front-end React.</li>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">Visual Studio Code</a> — trình soạn cho phía React.</li>
<li><a href="https://www.jetbrains.com/idea/" target="_blank" rel="noopener">IntelliJ IDEA</a> — IDE cho back-end Spring Boot.</li>
<li><a href="https://www.postman.com/" target="_blank" rel="noopener">Postman</a> — test API REST trước khi nối SPA.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng để thi</strong> — nắm chắc React (component/props/state, hook, fetch) và Spring Boot REST + CORS từ slide FLM.</li>
<li><strong>Luyện trên project</strong> — dựng một SPA CRUD: front-end React gọi API Spring Boot, test trước bằng Postman.</li>
<li><strong>Đào sâu thực tế</strong> — thêm Spring Data JPA (SQL) và MongoDB, rồi bảo mật app end-to-end bằng JWT.</li>
<li><strong>Sẵn sàng đi làm</strong> — triển khai app full-stack, xử lý loading/lỗi gọn gàng, và giải thích được luồng dữ liệu client–server.</li>
</ol>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'SBA301',
    slug: 'sba301-integrate-single-page-application-with-spring-boot',
    title: 'Integrate single page application with Spring Boot',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SBA301.webp',
    shortDescription: 'Full-stack: a React SPA talking to a Spring Boot REST API — components/hooks, fetch, CORS, JPA & MongoDB, JWT security. Bilingual, with React/Spring code & exercises.|||Full-stack: React SPA nói chuyện với API REST Spring Boot — component/hook, fetch, CORS, JPA & MongoDB, bảo mật JWT. Song ngữ, code React/Spring & bài tập.',
    description: 'Môn <strong>SBA301 — Tích hợp ứng dụng trang đơn với Spring Boot</strong> (ngành Kỹ thuật phần mềm, kỳ 7). Full-stack: một <strong>React SPA</strong> ở front-end gọi một <strong>API REST Spring Boot</strong> ở back-end. Đi từ React cơ bản (component/props/state/hook, fetch) → Spring Boot REST + <strong>CORS</strong> → nối React ↔ Spring (fetch/axios CRUD, JSON) → <strong>JPA &amp; MongoDB</strong> → <strong>bảo mật JWT end-to-end</strong>. Nối FER202 (React) và HSF302 (Spring). Bám giáo trình FLM (8 CLO), song ngữ, code chạy được và bài tập kèm lời giải.',
    whatYouLearn: 'React (component/JSX, props vs state, useState/useEffect, list & key, React Router); Spring Boot REST API + CORS cho SPA; giao tiếp client–server (fetch/axios GET/POST/PUT/DELETE, JSON, loading/lỗi, cập nhật state); Spring Data JPA (SQL) & Spring Data MongoDB (NoSQL); bảo mật JWT end-to-end (login React → token → Bearer → Spring Security phân quyền).',
    requirements: 'Nên đã học React (FER202) và Spring (HSF302), hoặc quen JavaScript + Java. Cần Node.js (React), JDK + Spring Boot, và MySQL/MongoDB.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Kiến trúc full-stack, 8 CLO, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — React cơ bản|||Chapter 1 — React essentials', description: 'Component, props/state, hook, fetch.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Spring Boot REST + CORS|||Chapter 2 — Spring Boot REST + CORS', description: 'REST API, CORS cho SPA, JPA.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nối React ↔ Spring|||Chapter 3 — Connecting React ↔ Spring', description: 'fetch/axios CRUD, cập nhật state.', lessons: [c3, c3e, c3q] },
    { title: 'Chương 4 — JPA, MongoDB & JWT|||Chapter 4 — JPA, MongoDB & JWT', description: 'SQL vs NoSQL, bảo mật end-to-end.', lessons: [c4, c4q] },
  ],
};
