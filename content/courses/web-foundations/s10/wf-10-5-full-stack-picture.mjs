/**
 * Bài 10.5 — Bức tranh full-stack (nâng cấp 02/11/2026). Output thật: _demo/_t10/10-5/chay.mjs — app ghi chú một tệp máy chủ
 * (Node 22.23: node:http + node:sqlite + scrypt + phiên cookie HttpOnly), Chromium thật (Playwright) đăng nhập và bấm "Add":
 * log trình duyệt (event → fetch → reply → dom) cạnh log máy chủ (http → auth → valid → sql → reply), một lần 422, và cùng API
 * qua curl (401 không cookie, đăng nhập, đọc). Deck: scripts/slides-src/wf-10-5.mjs. Code Lab: wf-10-5-full-stack-picture.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-10-5', 'The full-stack picture', 'Bức tranh full-stack', [
  [1, 'The full-stack picture',
    '<p>Ten chapters, many tools. This lesson puts them all into one small app and follows one click from start to end: the browser event, the fetch, the HTTP request, the session check, validation, the SQL query, the JSON reply and the DOM update. Every step prints one line, so you can see the whole web working at once.</p>',
    '<p>Mười chương, rất nhiều công cụ. Bài này gom tất cả vào một app nhỏ và đi theo một cú bấm từ đầu tới cuối: sự kiện trình duyệt, fetch, request HTTP, kiểm phiên, kiểm dữ liệu, truy vấn SQL, phản hồi JSON và cập nhật DOM. Mỗi bước in một dòng, để bạn thấy cả web vận hành cùng lúc.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to draw the path of one request through every layer, say which chapter each layer came from, read browser and server logs side by side, tell which layer a bug lives in from the status code, and choose your next course.</p>',
    '<p>Bạn sẽ vẽ được đường đi của một request qua mọi tầng, nói được mỗi tầng đến từ chương nào, đọc log trình duyệt và log máy chủ cạnh nhau, biết lỗi nằm ở tầng nào nhờ mã trạng thái, và chọn khoá học tiếp theo.</p>'],
  [3, 'One app, every chapter',
    '<p>The page is HTML with two forms. The script listens for submit events and calls fetch. The server is Node with no framework: it reads the cookie, checks the session, validates the body, and runs parameterised SQL on SQLite. Passwords are hashed with scrypt.</p>',
    '<p>Trang là HTML với hai form. Script nghe sự kiện submit và gọi fetch. Máy chủ là Node không framework: đọc cookie, kiểm phiên, kiểm phần thân, và chạy SQL có tham số trên SQLite. Mật khẩu được băm bằng scrypt.</p>'],
  [4, 'Logging in',
    '<p>The browser posted the email and a masked password. The server ran one SELECT, checked the hash, created a session and set an HttpOnly cookie. The next request carried that cookie automatically, the server recognised user one and returned two notes, and the page drew two list items.</p>',
    '<p>Trình duyệt gửi email và mật khẩu đã che. Máy chủ chạy một SELECT, kiểm mã băm, tạo phiên và đặt cookie HttpOnly. Request kế tiếp tự mang cookie đó, máy chủ nhận ra người dùng một và trả về hai ghi chú, và trang vẽ hai mục danh sách.</p>'],
  [5, 'One click, end to end',
    '<p>Clicking Add produced a submit event, a POST with JSON, and on the server: the session check, validation, one INSERT with parameters, and two hundred and one Created. The page then fetched the list again and drew three items. Each layer did exactly one job.</p>',
    '<p>Bấm Add sinh ra một sự kiện submit, một POST kèm JSON, và ở máy chủ: kiểm phiên, kiểm dữ liệu, một INSERT có tham số, và hai trăm lẻ một Created. Rồi trang lấy lại danh sách và vẽ ba mục. Mỗi tầng làm đúng một việc.</p>'],
  [6, 'When validation says no',
    '<p>An empty title was rejected by the server with four hundred twenty two and a readable message, and no SQL ran. The browser console showed the failed request, and the page displayed the message. The server never trusts the browser.</p>',
    '<p>Một tiêu đề trống bị máy chủ từ chối với bốn trăm hai mươi hai và thông báo dễ đọc, và không câu SQL nào chạy. Console trình duyệt hiện request hỏng, và trang hiển thị thông báo. Máy chủ không bao giờ tin trình duyệt.</p>'],
  [7, 'The same API without a browser',
    '<p>curl without a cookie got four hundred and one, log in first. After logging in with a cookie jar, the same GET returned all three notes. The API does not care who calls it, which is why every rule lives on the server.</p>',
    '<p>curl không có cookie nhận bốn trăm lẻ một, đăng nhập trước. Sau khi đăng nhập với hũ cookie, cùng lệnh GET trả về cả ba ghi chú. API không quan tâm ai gọi nó, đó là lý do mọi luật nằm ở máy chủ.</p>'],
  [8, 'Where a bug lives',
    '<p>No request in the network tab means the bug is in the page. A four hundred one is the session, four hundred twenty two is validation, five hundred is the server code or the database. Reading the status code first saves you from searching the wrong layer.</p>',
    '<p>Không có request nào trong tab Network nghĩa là lỗi ở trang. Bốn trăm lẻ một là phiên, bốn trăm hai mươi hai là kiểm dữ liệu, năm trăm là mã máy chủ hoặc CSDL. Đọc mã trạng thái trước giúp bạn khỏi tìm sai tầng.</p>'],
  [9, 'Summary and what comes next',
    '<p>The practice asks you to add a delete button through every layer, with a test for each status code. Then choose your next course: Node.js for the server side, React and Next.js for the interface, PostgreSQL for data.</p>',
    '<p>Bài luyện yêu cầu bạn thêm nút xoá đi qua mọi tầng, kèm phép kiểm cho từng mã trạng thái. Rồi chọn khoá tiếp theo: Node.js cho phía máy chủ, React và Next.js cho giao diện, PostgreSQL cho dữ liệu.</p>'],
]);

export default {
  title: '10.5 — The full-stack picture, and what comes next|||10.5 — Bức tranh full-stack, và điều tiếp theo',
  slug: 'wf-10-5-full-stack-picture',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/nu_pCVPKzTk', durationSeconds: 0 },
  description: 'Cả khoá trong một app ghi chú chạy thật (Node 22.23: node:http + node:sqlite + scrypt + cookie HttpOnly): Chromium bấm "Add" và log hai phía cạnh nhau — event → fetch → http → auth → valid → sql INSERT có tham số → 201 → dom; tiêu đề trống ⇒ 422 không chạy SQL; cùng API qua curl (401 rồi đăng nhập); đọc mã trạng thái để biết lỗi ở tầng nào; khoá tiếp theo.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>One click, every chapter</h2>
<p class="lead">After this lesson you can follow one request through every layer of a web app — event, fetch, HTTP, session, validation, SQL, JSON, DOM — say which chapter each layer came from, read the browser's log and the server's log side by side, and use the status code to tell which layer a bug is in. The app below is about 130 lines in three files, with no framework, and it does everything this course taught. Then: which course to take next.</p>

<h3>Step 1 — the whole path on one page</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Ch 2–4</span><span class="lz-t">HTML + JS event</span><span class="lz-d"><code>submit</code> on a form; <code>preventDefault()</code>.</span></div>
<div class="lz-step"><span class="lz-k">Ch 5–6</span><span class="lz-t">fetch → HTTP</span><span class="lz-d"><code>POST /api/notes</code> with a JSON body; the browser attaches the cookie.</span></div>
<div class="lz-step"><span class="lz-k">Ch 7</span><span class="lz-t">session</span><span class="lz-d">HttpOnly cookie → user id on the server; no session ⇒ 401.</span></div>
<div class="lz-step"><span class="lz-k">Ch 6 · 9</span><span class="lz-t">validation</span><span class="lz-d">Check the body at the boundary; bad ⇒ 422 with readable errors.</span></div>
<div class="lz-step"><span class="lz-k">Ch 8</span><span class="lz-t">SQL</span><span class="lz-d">Parameterised <code>INSERT</code> / <code>SELECT</code>, scoped by <code>user_id</code>.</span></div>
<div class="lz-step"><span class="lz-k">Ch 6</span><span class="lz-t">JSON reply</span><span class="lz-d">201 Created + <code>Location</code>, or 200 with the list.</span></div>
<div class="lz-step"><span class="lz-k">Ch 4</span><span class="lz-t">DOM update</span><span class="lz-d"><code>textContent</code>, never <code>innerHTML</code>, for user data.</span></div>
</div>

<h3>Step 2 — the app</h3>
<p>The server: <code>node:http</code> for HTTP, <code>node:sqlite</code> for the database, <code>node:crypto</code> for scrypt and session IDs. Every layer prints one line tagged with the request number.</p>
${ma('javascript', CODE['_t10/10-5/server.mjs'])}
<p>The page and its script:</p>
${ma('xml', CODE['_t10/10-5/page.html'])}
${ma('javascript', CODE['_t10/10-5/app.js'])}
<div class="pitfall co-tieu-de"><p><strong>Trap — logging secrets "just for debugging".</strong> The first version of <code>app.js</code> printed the request body as is — including the password, in plain text, in the console. Server logs are worse: they are stored, shipped to log services and read by many people. Mask passwords, tokens and cookies before logging (<code>password: '***'</code>, <code>sid=…</code> above), and never log full request bodies of login or payment routes.</p></div>

<h3>Step 3 — logging in: two logs, one story</h3>
<p>Chromium (driven by Playwright) typed the password and clicked "Log in". Left column: what DevTools' console showed. Right column: what the server's terminal showed.</p>
${ra(OUT['_t10/out/fs-login'])}
<p>Requests 1–2 are the page and its script. Request 3 is the login: one parameterised SELECT, a constant-time password check, a new session, and a <code>Set-Cookie</code> with <code>HttpOnly</code> (Lesson 7.2). Request 4 shows the payoff: the browser attached <code>sid=…</code> by itself, the server turned it into "user 1", and only user 1's notes were selected (<code>WHERE user_id = ?</code>).</p>

<h3>Step 4 — one click, end to end</h3>
${ra(OUT['_t10/out/fs-click'])}
<table>
<thead><tr><th>Line</th><th>Layer</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td><code>event submit #add</code></td><td>DOM event</td><td>4</td></tr>
<tr><td><code>fetch POST /api/notes {"title":…}</code></td><td>fetch, JSON</td><td>5–6</td></tr>
<tr><td><code>[req 5] http POST /api/notes (cookie: sid=…)</code></td><td>HTTP request</td><td>6</td></tr>
<tr><td><code>[req 5] auth session ok → user 1</code></td><td>session</td><td>7</td></tr>
<tr><td><code>[req 5] valid ok</code></td><td>validation at the boundary</td><td>6, 9</td></tr>
<tr><td><code>[req 5] sql INSERT … VALUES (?, ?) [1,"Ship the capstone"]</code></td><td>parameterised SQL</td><td>8</td></tr>
<tr><td><code>[req 5] reply 201 Created</code> / <code>reply 201 {…} (7 ms)</code></td><td>status + JSON</td><td>6</td></tr>
<tr><td><code>dom 3 &lt;li&gt; in #notes</code></td><td>DOM update</td><td>4</td></tr>
</tbody>
</table>
<p>The whole round trip took a few milliseconds on one machine (the numbers change each run); on the internet, add the network time from Chapter 1 — DNS, TCP, TLS — for every request. That is why the page fetches the list once after adding, instead of once per note.</p>

<h3>Step 5 — when the server says no</h3>
${ra(OUT['_t10/out/fs-invalid'])}
<p>A title of three spaces: the server trimmed it, found it empty, answered <code>422</code> — and <strong>no SQL ran</strong>. The browser printed its own line for the failed request, the script showed the server's message. The browser form could also check this, for speed; but only the server's check counts, because…</p>

<h3>Step 6 — …the API does not care who calls it</h3>
${ra(OUT['_t10/out/fs-curl'])}
<p>No browser, no page, no JavaScript validation — just HTTP. Without a cookie: <code>401</code>. With a cookie jar after logging in: the same JSON the page received. Anyone can send any request to your API, which is why authentication, validation and permissions live on the server (Chapters 6–7).</p>

<h3>Step 7 — find the layer from the symptom</h3>
<table>
<thead><tr><th>You see</th><th>The bug is probably in</th><th>Look at</th></tr></thead>
<tbody>
<tr><td>Nothing in the Network tab after clicking</td><td>the page (event, JS error)</td><td>Console errors, the event listener (10.2)</td></tr>
<tr><td><code>401</code> / <code>403</code></td><td>session / permissions</td><td>the cookie in the request, SameSite, expiry (Ch7)</td></tr>
<tr><td><code>400</code> / <code>422</code></td><td>the data sent</td><td>request body vs what the server expects (Ch6, 9)</td></tr>
<tr><td><code>404</code></td><td>the URL or method</td><td>path, method, route list (Ch6)</td></tr>
<tr><td><code>500</code></td><td>server code or database</td><td>the server log and stack trace (10.2, Ch8)</td></tr>
<tr><td><code>200</code> but the page is wrong</td><td>rendering</td><td>the JSON in Network vs what the DOM code does</td></tr>
<tr><td>CORS error in the console</td><td>server headers</td><td>origin and <code>Access-Control-*</code> (Ch7)</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — debugging the wrong layer.</strong> "The button doesn't work" can be any of seven layers. Before changing code, open DevTools → Network, click once, and read the status code of the request (or notice there is none). That one look tells you whether to open the HTML, the JavaScript, the route, the session code or the SQL — and saves hours spent fixing a layer that was never broken.</p></div>

<h3>What comes next</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Node.js</span><span class="v">The server side properly: Express, project structure, testing, security, deployment — the real version of this app.</span></div>
  <div class="kv"><span class="k">React → Next.js</span><span class="v">Interfaces built from components and state instead of manual DOM updates; server rendering.</span></div>
  <div class="kv"><span class="k">PostgreSQL + Prisma</span><span class="v">The database you will use in production, migrations, indexes, transactions.</span></div>
  <div class="kv"><span class="k">TypeScript · Git</span><span class="v">The deep versions of Chapters 9 and 10.</span></div>
  <div class="kv"><span class="k">Deploy (Docker, VPS, Nginx)</span><span class="v">Put the app on a real server with a domain and HTTPS.</span></div>
</div>
<p>A good order: Node.js first (you already know HTTP, sessions and SQL, so it will feel like a deeper version of this lesson), then React and Next.js, then PostgreSQL in depth.</p>

<div class="callout ok">
<p><strong>🧪 Practice (60 minutes) — add "delete" through every layer</strong></p>
<ol>
<li>Copy <code>server.mjs</code>, <code>page.html</code>, <code>app.js</code> into a folder and run <code>node server.mjs</code> (Node 22.5+); log in at <code>http://localhost:3460</code>.</li>
<li>Server: add <code>DELETE /api/notes/:id</code>. Session required (401). Delete only <code>WHERE id = ? AND user_id = ?</code>; if no row was deleted return 404, else 204. Log every layer like the others.</li>
<li>Page: render a "×" button next to each note (<code>textContent</code> for the title). Clicking it sends the DELETE and re-renders.</li>
<li>Test with curl: without a cookie (401), another user's note id (404 — create a second user to check), your own note (204).</li>
<li>Open DevTools → Network, delete a note, and match each server log line to the request you see.</li>
</ol>
<p>Hint: <code>stmt.run(...)</code> in <code>node:sqlite</code> returns <code>{ changes }</code> — 0 means nothing matched.</p>
<p><strong>Done when:</strong> the three curl cases give 401, 404 and 204; deleting in the page removes the note without a reload; and the server log shows <code>http → auth → sql → reply</code> for each delete. Then Code Lab module 10.5 and the Chapter 10 quiz.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">full stack</span><span class="v">toàn bộ các tầng — trình duyệt tới CSDL.</span></div>
  <div class="kv"><span class="k">round trip</span><span class="v">một vòng đi và về của request.</span></div>
  <div class="kv"><span class="k">layer</span><span class="v">tầng.</span></div>
  <div class="kv"><span class="k">request id</span><span class="v">mã request — gắn các dòng log của cùng một request.</span></div>
  <div class="kv"><span class="k">parameterised query</span><span class="v">truy vấn có tham số.</span></div>
  <div class="kv"><span class="k">201 Created / 422</span><span class="v">đã tạo / dữ liệu không xử lý được.</span></div>
  <div class="kv"><span class="k">cookie jar</span><span class="v">hũ cookie — tệp curl lưu cookie.</span></div>
  <div class="kv"><span class="k">source of truth</span><span class="v">nguồn sự thật — máy chủ và CSDL.</span></div>
  <div class="kv"><span class="k">masking</span><span class="v">che dữ liệu nhạy cảm trong log.</span></div>
  <div class="kv"><span class="k">Network tab</span><span class="v">tab Network của DevTools.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>One click = event → fetch → HTTP → session → validation → SQL → JSON → DOM.</li>
  <li>Browser and server logs tagged per request tell one story; mask secrets in both.</li>
  <li>The server validates and authorises every request — curl proves anyone can call your API.</li>
  <li>The status code (or a missing request) tells you which layer to debug first.</li>
  <li>Next: Node.js, then React/Next.js, then PostgreSQL in depth.</li>
</ul>
${nguon('📗', 'MDN — An overview of HTTP', 'The request/response model behind every step of this lesson', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview')}
${nguon('📘', 'Node.js — node:sqlite', 'The built-in SQLite module used by the server', 'https://nodejs.org/api/sqlite.html')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-0-4-du-an', title: 'Node.js 0.4 — The course project', sub: 'Build the production version of this app: Express, PostgreSQL, tests, deployment', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Một cú bấm, mọi chương</h2>
<p class="lead">Học xong bài này bạn lần theo được một request qua mọi tầng của một web app — sự kiện, fetch, HTTP, phiên, kiểm dữ liệu, SQL, JSON, DOM — nói được mỗi tầng đến từ chương nào, đọc log trình duyệt và log máy chủ cạnh nhau, và dùng mã trạng thái để biết lỗi nằm ở tầng nào. App dưới đây khoảng 130 dòng trong ba tệp, không framework, và làm mọi thứ khoá học đã dạy. Rồi: nên học khoá nào tiếp theo.</p>

<h3>Bước 1 — cả con đường trên một trang</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Ch 2–4</span><span class="lz-t">HTML + sự kiện JS</span><span class="lz-d"><code>submit</code> trên một form; <code>preventDefault()</code>.</span></div>
<div class="lz-step"><span class="lz-k">Ch 5–6</span><span class="lz-t">fetch → HTTP</span><span class="lz-d"><code>POST /api/notes</code> kèm phần thân JSON; trình duyệt tự gắn cookie.</span></div>
<div class="lz-step"><span class="lz-k">Ch 7</span><span class="lz-t">phiên</span><span class="lz-d">Cookie HttpOnly → id người dùng ở máy chủ; không có phiên ⇒ 401.</span></div>
<div class="lz-step"><span class="lz-k">Ch 6 · 9</span><span class="lz-t">kiểm dữ liệu</span><span class="lz-d">Kiểm phần thân ở ranh giới; sai ⇒ 422 kèm lỗi dễ đọc.</span></div>
<div class="lz-step"><span class="lz-k">Ch 8</span><span class="lz-t">SQL</span><span class="lz-d"><code>INSERT</code> / <code>SELECT</code> có tham số, giới hạn theo <code>user_id</code>.</span></div>
<div class="lz-step"><span class="lz-k">Ch 6</span><span class="lz-t">phản hồi JSON</span><span class="lz-d">201 Created + <code>Location</code>, hoặc 200 kèm danh sách.</span></div>
<div class="lz-step"><span class="lz-k">Ch 4</span><span class="lz-t">cập nhật DOM</span><span class="lz-d"><code>textContent</code>, không bao giờ <code>innerHTML</code>, cho dữ liệu người dùng.</span></div>
</div>

<h3>Bước 2 — app</h3>
<p>Máy chủ: <code>node:http</code> cho HTTP, <code>node:sqlite</code> cho CSDL, <code>node:crypto</code> cho scrypt và mã phiên. Mỗi tầng in một dòng gắn số thứ tự request.</p>
${ma('javascript', CODE['_t10/10-5/server.mjs'])}
<p>Trang và script của nó:</p>
${ma('xml', CODE['_t10/10-5/page.html'])}
${ma('javascript', CODE['_t10/10-5/app.js'])}
<div class="pitfall co-tieu-de"><p><strong>Bẫy — ghi log bí mật "chỉ để gỡ lỗi".</strong> Bản đầu của <code>app.js</code> in nguyên phần thân request — kể cả mật khẩu, dạng chữ thường, trong console. Log máy chủ còn tệ hơn: được lưu lại, gửi sang dịch vụ log và nhiều người đọc. Hãy che mật khẩu, token và cookie trước khi ghi log (<code>password: '***'</code>, <code>sid=…</code> ở trên), và không bao giờ ghi nguyên phần thân của route đăng nhập hay thanh toán.</p></div>

<h3>Bước 3 — đăng nhập: hai log, một câu chuyện</h3>
<p>Chromium (điều khiển bằng Playwright) gõ mật khẩu và bấm "Log in". Cột trái: thứ console DevTools hiện. Cột phải: thứ terminal của máy chủ hiện.</p>
${ra(OUT['_t10/out/fs-login'])}
<p>Request 1–2 là trang và script. Request 3 là đăng nhập: một SELECT có tham số, kiểm mật khẩu thời gian cố định, phiên mới, và một <code>Set-Cookie</code> có <code>HttpOnly</code> (Bài 7.2). Request 4 cho thấy thành quả: trình duyệt tự gắn <code>sid=…</code>, máy chủ biến nó thành "user 1", và chỉ ghi chú của user 1 được chọn (<code>WHERE user_id = ?</code>).</p>

<h3>Bước 4 — một cú bấm, từ đầu tới cuối</h3>
${ra(OUT['_t10/out/fs-click'])}
<table>
<thead><tr><th>Dòng</th><th>Tầng</th><th>Chương</th></tr></thead>
<tbody>
<tr><td><code>event submit #add</code></td><td>sự kiện DOM</td><td>4</td></tr>
<tr><td><code>fetch POST /api/notes {"title":…}</code></td><td>fetch, JSON</td><td>5–6</td></tr>
<tr><td><code>[req 5] http POST /api/notes (cookie: sid=…)</code></td><td>request HTTP</td><td>6</td></tr>
<tr><td><code>[req 5] auth session ok → user 1</code></td><td>phiên</td><td>7</td></tr>
<tr><td><code>[req 5] valid ok</code></td><td>kiểm dữ liệu ở ranh giới</td><td>6, 9</td></tr>
<tr><td><code>[req 5] sql INSERT … VALUES (?, ?) [1,"Ship the capstone"]</code></td><td>SQL có tham số</td><td>8</td></tr>
<tr><td><code>[req 5] reply 201 Created</code> / <code>reply 201 {…} (7 ms)</code></td><td>mã trạng thái + JSON</td><td>6</td></tr>
<tr><td><code>dom 3 &lt;li&gt; in #notes</code></td><td>cập nhật DOM</td><td>4</td></tr>
</tbody>
</table>
<p>Cả vòng mất vài mili giây trên một máy (con số đổi mỗi lần chạy); trên internet, cộng thêm thời gian mạng của Chương 1 — DNS, TCP, TLS — cho mỗi request. Đó là lý do trang lấy lại danh sách một lần sau khi thêm, thay vì mỗi ghi chú một lần.</p>

<h3>Bước 5 — khi máy chủ nói không</h3>
${ra(OUT['_t10/out/fs-invalid'])}
<p>Một tiêu đề gồm ba dấu cách: máy chủ cắt hai đầu, thấy rỗng, trả <code>422</code> — và <strong>không câu SQL nào chạy</strong>. Trình duyệt in dòng riêng cho request hỏng, script hiện thông báo của máy chủ. Form trên trình duyệt cũng có thể kiểm điều này cho nhanh; nhưng chỉ phép kiểm ở máy chủ mới tính, vì…</p>

<h3>Bước 6 — …API không quan tâm ai gọi nó</h3>
${ra(OUT['_t10/out/fs-curl'])}
<p>Không trình duyệt, không trang, không kiểm bằng JavaScript — chỉ HTTP. Không có cookie: <code>401</code>. Có hũ cookie sau khi đăng nhập: đúng JSON mà trang nhận được. Bất kỳ ai cũng gửi được bất kỳ request nào tới API của bạn, vì thế xác thực, kiểm dữ liệu và phân quyền nằm ở máy chủ (Chương 6–7).</p>

<h3>Bước 7 — tìm tầng từ triệu chứng</h3>
<table>
<thead><tr><th>Bạn thấy</th><th>Lỗi có lẽ nằm ở</th><th>Nhìn vào</th></tr></thead>
<tbody>
<tr><td>Không có gì trong tab Network sau khi bấm</td><td>trang (sự kiện, lỗi JS)</td><td>lỗi trong Console, trình nghe sự kiện (10.2)</td></tr>
<tr><td><code>401</code> / <code>403</code></td><td>phiên / quyền</td><td>cookie trong request, SameSite, hạn dùng (Ch7)</td></tr>
<tr><td><code>400</code> / <code>422</code></td><td>dữ liệu gửi đi</td><td>phần thân request so với thứ máy chủ chờ (Ch6, 9)</td></tr>
<tr><td><code>404</code></td><td>URL hoặc phương thức</td><td>đường dẫn, phương thức, danh sách route (Ch6)</td></tr>
<tr><td><code>500</code></td><td>mã máy chủ hoặc CSDL</td><td>log máy chủ và stack trace (10.2, Ch8)</td></tr>
<tr><td><code>200</code> mà trang hiển thị sai</td><td>phần hiển thị</td><td>JSON trong Network so với việc mã DOM làm</td></tr>
<tr><td>Lỗi CORS trong console</td><td>header của máy chủ</td><td>origin và <code>Access-Control-*</code> (Ch7)</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — gỡ lỗi sai tầng.</strong> "Nút không chạy" có thể là bất kỳ tầng nào trong bảy tầng. Trước khi sửa mã, mở DevTools → Network, bấm một lần, và đọc mã trạng thái của request (hoặc nhận ra không có request nào). Một lần nhìn đó cho biết nên mở HTML, JavaScript, route, mã phiên hay SQL — và tiết kiệm hàng giờ sửa một tầng chưa từng hỏng.</p></div>

<h3>Điều tiếp theo</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Node.js</span><span class="v">Phía máy chủ cho đúng nghĩa: Express, cấu trúc dự án, kiểm thử, bảo mật, deploy — phiên bản thật của app này.</span></div>
  <div class="kv"><span class="k">React → Next.js</span><span class="v">Giao diện dựng từ component và state thay vì cập nhật DOM bằng tay; render phía máy chủ.</span></div>
  <div class="kv"><span class="k">PostgreSQL + Prisma</span><span class="v">CSDL bạn sẽ dùng ở production, migration, chỉ mục, giao dịch.</span></div>
  <div class="kv"><span class="k">TypeScript · Git</span><span class="v">Bản chuyên sâu của Chương 9 và 10.</span></div>
  <div class="kv"><span class="k">Deploy (Docker, VPS, Nginx)</span><span class="v">Đưa app lên máy chủ thật với tên miền và HTTPS.</span></div>
</div>
<p>Một thứ tự tốt: Node.js trước (bạn đã biết HTTP, phiên và SQL, nên nó sẽ như phiên bản sâu hơn của bài này), rồi React và Next.js, rồi PostgreSQL chuyên sâu.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (60 phút) — thêm "xoá" đi qua mọi tầng</strong></p>
<ol>
<li>Chép <code>server.mjs</code>, <code>page.html</code>, <code>app.js</code> vào một thư mục và chạy <code>node server.mjs</code> (Node 22.5+); đăng nhập ở <code>http://localhost:3460</code>.</li>
<li>Máy chủ: thêm <code>DELETE /api/notes/:id</code>. Bắt buộc có phiên (401). Chỉ xoá <code>WHERE id = ? AND user_id = ?</code>; không dòng nào bị xoá thì trả 404, ngược lại 204. Ghi log từng tầng như các route khác.</li>
<li>Trang: vẽ một nút "×" cạnh mỗi ghi chú (<code>textContent</code> cho tiêu đề). Bấm nó gửi DELETE rồi vẽ lại.</li>
<li>Kiểm bằng curl: không cookie (401), id ghi chú của người khác (404 — tạo người dùng thứ hai để kiểm), ghi chú của mình (204).</li>
<li>Mở DevTools → Network, xoá một ghi chú, và ghép từng dòng log máy chủ với request bạn thấy.</li>
</ol>
<p>Gợi ý: <code>stmt.run(...)</code> trong <code>node:sqlite</code> trả về <code>{ changes }</code> — 0 nghĩa là không khớp gì.</p>
<p><strong>Xong khi:</strong> ba ca curl cho 401, 404 và 204; xoá trên trang làm ghi chú biến mất mà không tải lại; và log máy chủ hiện <code>http → auth → sql → reply</code> cho mỗi lần xoá. Sau đó làm module Code Lab 10.5 và bài kiểm tra Chương 10.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">full stack</span><span class="v">toàn bộ các tầng — trình duyệt tới CSDL.</span></div>
  <div class="kv"><span class="k">round trip</span><span class="v">một vòng đi và về của request.</span></div>
  <div class="kv"><span class="k">layer</span><span class="v">tầng.</span></div>
  <div class="kv"><span class="k">request id</span><span class="v">mã request — gắn các dòng log của cùng một request.</span></div>
  <div class="kv"><span class="k">parameterised query</span><span class="v">truy vấn có tham số.</span></div>
  <div class="kv"><span class="k">201 Created / 422</span><span class="v">đã tạo / dữ liệu không xử lý được.</span></div>
  <div class="kv"><span class="k">cookie jar</span><span class="v">hũ cookie — tệp curl lưu cookie.</span></div>
  <div class="kv"><span class="k">source of truth</span><span class="v">nguồn sự thật — máy chủ và CSDL.</span></div>
  <div class="kv"><span class="k">masking</span><span class="v">che dữ liệu nhạy cảm trong log.</span></div>
  <div class="kv"><span class="k">Network tab</span><span class="v">tab Network của DevTools.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một cú bấm = sự kiện → fetch → HTTP → phiên → kiểm dữ liệu → SQL → JSON → DOM.</li>
  <li>Log trình duyệt và máy chủ gắn theo request kể cùng một câu chuyện; che bí mật ở cả hai.</li>
  <li>Máy chủ kiểm dữ liệu và phân quyền mọi request — curl chứng minh ai cũng gọi được API của bạn.</li>
  <li>Mã trạng thái (hoặc việc không có request) cho biết nên gỡ lỗi tầng nào trước.</li>
  <li>Tiếp theo: Node.js, rồi React/Next.js, rồi PostgreSQL chuyên sâu.</li>
</ul>
${nguon('📗', 'MDN — An overview of HTTP', 'Mô hình request/response đứng sau mọi bước của bài này', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview')}
${nguon('📘', 'Node.js — node:sqlite', 'Module SQLite có sẵn mà máy chủ dùng', 'https://nodejs.org/api/sqlite.html')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-0-4-du-an', title: 'Node.js 0.4 — Dự án của khoá', sub: 'Dựng phiên bản production của app này: Express, PostgreSQL, kiểm thử, deploy', cta: 'Mở bài' })}
</div>
`,
};
