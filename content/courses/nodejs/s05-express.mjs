/**
 * Node.js — Chương 5: Express, bộ khung của mọi API.
 * Mọi output trong chương này đo thật: Node v22.21.0, express 5.2.1 và 4.22.2.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 5 — Express, the skeleton of every API|||Chương 5 — Express, bộ khung của mọi API',
  description: 'Routing, middleware, xử lý lỗi tập trung và một Notes API hoàn chỉnh — bốn thứ mà mọi backend Node đều dựng lại.',
  lessons: [
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — From raw http to Express|||5.1 — Từ http thuần tới Express',
      slug: 'nodejs-5-1-tu-http-toi-express',
      type: 'VIDEO',
      description: 'Bốn nỗi khổ của http thuần ở bài 3.5 và cách Express xoá từng cái — kèm phép đếm dòng code thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>From raw <code>http</code> to Express</h2>
<p class="lead">At the end of lesson 3.5 we had a working HTTP server written with nothing but the core <code>http</code> module — and a list of four things that were painful. This chapter is that list, crossed out one item at a time. Express is not magic: everything it does, you could write yourself. The point is that you would write it the same way every time, badly, in every project.</p>

<h3>The four pains, restated</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1. Routing by hand</span><span class="v">A pile of <code>if (req.method === 'GET' &amp;&amp; url.pathname === …)</code>. Path parameters mean splitting strings yourself.</span></div>
  <div class="kv"><span class="k">2. Reading the body</span><span class="v">Bodies arrive as a stream. Every route needs the same collect-chunks-then-<code>JSON.parse</code> dance, plus a size limit so nobody can send you a 2GB request.</span></div>
  <div class="kv"><span class="k">3. Repeating yourself for cross-cutting work</span><span class="v">Logging, auth, CORS — needed by every route, with no place to put them once.</span></div>
  <div class="kv"><span class="k">4. Errors everywhere</span><span class="v">A <code>throw</code> inside a handler kills the whole process, so every route ends up wrapped in its own try/catch.</span></div>
</div>

<h3>Installing it</h3>
<pre><code>npm init -y
npm i express
node -e "console.log(require('express/package.json').version)"</code></pre>
<div class="out">5.2.1</div>
<p>Measured on the same machine, right after that install:</p>
<div class="out">packages in node_modules : 65
node_modules size        : 3.7M</div>
<p>Chapter 4 taught you to look at that number rather than ignore it. 65 packages is a real supply-chain surface — but it is also the entire HTTP layer of a production API, and it is the single most reviewed piece of code in the Node ecosystem.</p>
<div class="callout"><strong>Express 5 vs Express 4.</strong> Express 5 became the default <code>latest</code> tag on npm and most tutorials on the internet still show version 4. Two differences matter enough to mention now: v5 forwards errors from <code>async</code> handlers automatically (lesson 5.4 proves it with a hanging request), and wildcard routes changed from <code>*</code> to a named <code>*splat</code> (lesson 5.2). If you land on an old tutorial and something does not behave, check the version first.</div>

<h3>Your first Express app</h3>
<pre><code><span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;

<span class="tok-keyword">const</span> app = express();

app.<span class="tok-fn">get</span>(<span class="tok-string">'/health'</span>, (req, res) =&gt; {
  res.<span class="tok-fn">json</span>({ status: <span class="tok-string">'ok'</span>, uptime: <span class="tok-number">1.23</span> });
});

app.<span class="tok-fn">get</span>(<span class="tok-string">'/text'</span>, (req, res) =&gt; {
  res.<span class="tok-fn">send</span>(<span class="tok-string">'xin chao'</span>);
});

app.<span class="tok-fn">get</span>(<span class="tok-string">'/created'</span>, (req, res) =&gt; {
  res.<span class="tok-fn">status</span>(<span class="tok-number">201</span>).<span class="tok-fn">json</span>({ id: <span class="tok-number">7</span> });
});

app.<span class="tok-fn">listen</span>(<span class="tok-number">3000</span>, () =&gt; <span class="tok-fn">console</span>.log(<span class="tok-string">'listening on 3000'</span>));</code></pre>
<p>Nine meaningful lines. Now look at what those nine lines actually produce on the wire — this is <code>curl -i</code>, headers included, run against the server above:</p>
<pre><code>curl -i http://localhost:3000/health</code></pre>
<div class="out">HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 29
ETag: W/"1d-2xe9J8/s3zIFjfNNUDIyJOIy4PQ"
Date: Mon, 27 Jul 2026 15:28:34 GMT
Connection: keep-alive

{"status":"ok","uptime":1.23}</div>
<p>You wrote <code>res.json({...})</code>. Express serialised the object, set <code>Content-Type</code>, computed <code>Content-Length</code>, and generated an <code>ETag</code> so a repeat request can be answered with 304 and zero bytes of body. In lesson 3.5 you did the first three by hand and skipped the fourth.</p>

<h3><code>res.json</code> vs <code>res.send</code> — not the same thing</h3>
<pre><code>curl -i http://localhost:3000/text</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 8

xin chao</div>
<div class="pitfall"><code>res.send()</code> guesses the content type from the argument: a string becomes <strong><code>text/html</code></strong>, an object becomes JSON, a Buffer becomes <code>application/octet-stream</code>. That <code>text/html</code> is a real source of confusion — a frontend calling <code>await r.json()</code> on it will throw. For an API, use <code>res.json()</code> everywhere and never think about it again.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">res.json(obj)</span><span class="v">Always <code>application/json</code>. Uses <code>JSON.stringify</code> under the hood, so <code>undefined</code> fields disappear and <code>Date</code> becomes an ISO string.</span></div>
  <div class="kv"><span class="k">res.status(n)</span><span class="v">Only sets the code; it does not send. Chain it: <code>res.status(201).json(...)</code>.</span></div>
  <div class="kv"><span class="k">res.sendStatus(n)</span><span class="v">Sets the code AND sends its text ("Created"). Different function, easily confused with the one above.</span></div>
  <div class="kv"><span class="k">res.end()</span><span class="v">Ends with no body — the correct partner for 204 No Content.</span></div>
</div>

<h3>What you get for free on an unknown route</h3>
<pre><code>curl -i http://localhost:3000/does-not-exist</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Security-Policy: default-src 'none'
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8

&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;…</div>
<p>Express answers unmatched requests with a 404 HTML page. For a JSON API that is the wrong shape — your frontend expects <code>{ error: … }</code> and receives HTML. Lesson 5.4 replaces it with a JSON 404 handler. Notice this is already a lesson in how Express is built: it gives you a default, and every default is replaceable.</p>

<h3>Does it actually save code? Let us count</h3>
<p>The same Notes API — list, read, create, update, delete, with JSON parsing, a body size limit and 404s — written twice, once with the core <code>http</code> module and once with Express. Non-blank lines, counted with <code>grep -cve '^\\s*$'</code>:</p>
<div class="out">raw http, single file                     : 67 lines
  ├─ pure plumbing (send/readJson/dispatch): 27 lines
  └─ your actual business rules            : 40 lines

express
  ├─ routes/notes.routes.js (the 5 routes) : 32 lines
  ├─ app.js (wiring)                       : 15 lines
  ├─ middleware/errors.js                  : 20 lines
  └─ middleware/logger.js                  :  8 lines</div>
<p>Read that honestly: the totals are almost identical. Express did <em>not</em> make the program shorter — and anyone selling you a framework on line count is selling you something. What changed is <strong>which</strong> lines you own. In the raw version, 27 of 67 lines are plumbing you must get right and will copy into your next project. In the Express version those 27 lines are gone, replaced by <code>express.json()</code> and <code>Router()</code>, and the 20 lines of error handling are shared by every route you will ever add — while the raw version's plumbing grows with each one.</p>
<div class="callout ok">A better way to judge a framework: what does adding the <em>eleventh</em> route cost? In Express it costs three lines in a router file. In the raw version it costs another branch in an ever-growing <code>if</code> chain that already handles method, path segments, body reading and errors.</div>

<h3>The mistake everyone makes in week one</h3>
<pre><code>app.<span class="tok-fn">get</span>(<span class="tok-string">'/double'</span>, (req, res) =&gt; {
  <span class="tok-keyword">if</span> (!req.query.token) res.<span class="tok-fn">status</span>(<span class="tok-number">401</span>).<span class="tok-fn">json</span>({ error: <span class="tok-string">'Unauthorized'</span> });  <span class="tok-comment">// no return!</span>
  res.<span class="tok-fn">json</span>({ secret: <span class="tok-string">'private data'</span> });
});</code></pre>
<div class="out">client sees : {"error":"Unauthorized"}   [401]
server logs : [error handler] ERR_HTTP_HEADERS_SENT</div>
<div class="pitfall">The client got the right answer, so this bug hides for months. But the handler kept running and tried to send a second response; Node raised <code>ERR_HTTP_HEADERS_SENT</code> into the error handler. On a route where the second <code>res.json</code> came before an expensive database write, you would also be doing that write for a request you had already rejected. Rule: <strong>every <code>res.*</code> that ends a request gets a <code>return</code> in front of it</strong>, unless it is the last statement in the function.</div>
<div class="note-ct">Every API on cuongthai.com is an Express app of exactly this shape: one <code>app</code>, a stack of middleware, routers mounted under <code>/api/v1/…</code>, then a JSON 404 and one error handler at the bottom. The chapters after this one only add layers to that skeleton — database, auth, uploads, realtime — they never replace it.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Express.js Core Concepts</span><span class="lc-sub">10 exercises on app setup, routing and responses.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Từ <code>http</code> thuần tới Express</h2>
<p class="lead">Cuối bài 3.5 ta đã có một HTTP server chạy được, viết bằng đúng module lõi <code>http</code> — kèm một danh sách bốn thứ rất cực. Chương này chính là danh sách đó, gạch bỏ từng dòng một. Express không phải phép màu: mọi việc nó làm, bạn tự viết được hết. Vấn đề là bạn sẽ viết đi viết lại y hệt nhau, một cách cẩu thả, ở mọi dự án.</p>

<h3>Nhắc lại bốn nỗi khổ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1. Tự định tuyến bằng tay</span><span class="v">Một đống <code>if (req.method === 'GET' &amp;&amp; url.pathname === …)</code>. Muốn có tham số trên đường dẫn thì phải tự cắt chuỗi.</span></div>
  <div class="kv"><span class="k">2. Tự đọc body</span><span class="v">Body đến dưới dạng luồng. Route nào cũng phải lặp lại điệu nhảy gom-chunk-rồi-<code>JSON.parse</code>, cộng thêm giới hạn dung lượng để không ai gửi cho bạn một request 2GB.</span></div>
  <div class="kv"><span class="k">3. Lặp lại phần việc cắt ngang</span><span class="v">Ghi log, xác thực, CORS — route nào cũng cần, mà chẳng có chỗ nào để viết một lần.</span></div>
  <div class="kv"><span class="k">4. Lỗi rải khắp nơi</span><span class="v">Một câu <code>throw</code> trong handler giết cả tiến trình, nên cuối cùng route nào cũng phải tự bọc try/catch riêng.</span></div>
</div>

<h3>Cài đặt</h3>
<pre><code>npm init -y
npm i express
node -e "console.log(require('express/package.json').version)"</code></pre>
<div class="out">5.2.1</div>
<p>Đo ngay trên cùng máy, sau đúng lệnh cài đó:</p>
<div class="out">số gói trong node_modules : 65
dung lượng node_modules  : 3.7M</div>
<p>Chương 4 đã dạy bạn nhìn vào con số này thay vì lờ nó đi. 65 gói là một bề mặt chuỗi cung ứng thật — nhưng đó cũng là toàn bộ tầng HTTP của một API production, và là đoạn code được nhiều người soi nhất trong cả hệ sinh thái Node.</p>
<div class="callout"><strong>Express 5 và Express 4.</strong> Express 5 đã là bản <code>latest</code> mặc định trên npm, trong khi phần lớn bài hướng dẫn ngoài internet vẫn đang là bản 4. Có hai khác biệt đáng nói ngay: v5 <strong>tự động chuyển lỗi từ handler <code>async</code></strong> sang error handler (bài 5.4 sẽ chứng minh bằng một request bị treo), và route ký tự đại diện đổi từ <code>*</code> sang dạng có tên <code>*splat</code> (bài 5.2). Nếu bạn đọc một bài cũ mà thấy chạy không đúng, việc đầu tiên là kiểm tra phiên bản.</div>

<h3>Ứng dụng Express đầu tiên</h3>
<pre><code><span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;

<span class="tok-keyword">const</span> app = express();

app.<span class="tok-fn">get</span>(<span class="tok-string">'/health'</span>, (req, res) =&gt; {
  res.<span class="tok-fn">json</span>({ status: <span class="tok-string">'ok'</span>, uptime: <span class="tok-number">1.23</span> });
});

app.<span class="tok-fn">get</span>(<span class="tok-string">'/text'</span>, (req, res) =&gt; {
  res.<span class="tok-fn">send</span>(<span class="tok-string">'xin chao'</span>);
});

app.<span class="tok-fn">get</span>(<span class="tok-string">'/created'</span>, (req, res) =&gt; {
  res.<span class="tok-fn">status</span>(<span class="tok-number">201</span>).<span class="tok-fn">json</span>({ id: <span class="tok-number">7</span> });
});

app.<span class="tok-fn">listen</span>(<span class="tok-number">3000</span>, () =&gt; <span class="tok-fn">console</span>.log(<span class="tok-string">'listening on 3000'</span>));</code></pre>
<p>Chín dòng có nghĩa. Giờ hãy xem chín dòng đó thật sự tạo ra cái gì trên đường truyền — đây là <code>curl -i</code>, có kèm header, chạy thật với server ở trên:</p>
<pre><code>curl -i http://localhost:3000/health</code></pre>
<div class="out">HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 29
ETag: W/"1d-2xe9J8/s3zIFjfNNUDIyJOIy4PQ"
Date: Mon, 27 Jul 2026 15:28:34 GMT
Connection: keep-alive

{"status":"ok","uptime":1.23}</div>
<p>Bạn chỉ viết <code>res.json({...})</code>. Express đã tự chuyển object thành chuỗi, đặt <code>Content-Type</code>, tính <code>Content-Length</code>, và sinh ra <code>ETag</code> để lần gọi sau có thể trả 304 với body rỗng. Ở bài 3.5 bạn làm ba việc đầu bằng tay, còn việc thứ tư thì bỏ qua.</p>

<h3><code>res.json</code> và <code>res.send</code> — không phải một</h3>
<pre><code>curl -i http://localhost:3000/text</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 8

xin chao</div>
<div class="pitfall"><code>res.send()</code> tự đoán kiểu nội dung theo tham số: chuỗi thành <strong><code>text/html</code></strong>, object thành JSON, Buffer thành <code>application/octet-stream</code>. Cái <code>text/html</code> đó gây nhầm lẫn thật sự — frontend gọi <code>await r.json()</code> lên nó sẽ ném lỗi. Với một API, hãy dùng <code>res.json()</code> ở mọi chỗ và không bao giờ phải nghĩ về chuyện này nữa.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">res.json(obj)</span><span class="v">Luôn là <code>application/json</code>. Bên trong dùng <code>JSON.stringify</code>, nên trường <code>undefined</code> biến mất và <code>Date</code> thành chuỗi ISO.</span></div>
  <div class="kv"><span class="k">res.status(n)</span><span class="v">Chỉ đặt mã, KHÔNG gửi. Phải nối chuỗi: <code>res.status(201).json(...)</code>.</span></div>
  <div class="kv"><span class="k">res.sendStatus(n)</span><span class="v">Đặt mã VÀ gửi luôn phần chữ ("Created"). Là hàm khác, rất dễ nhầm với hàm trên.</span></div>
  <div class="kv"><span class="k">res.end()</span><span class="v">Kết thúc mà không có body — đúng cặp với mã 204 No Content.</span></div>
</div>

<h3>Bạn được tặng gì khi route không tồn tại</h3>
<pre><code>curl -i http://localhost:3000/does-not-exist</code></pre>
<div class="out">HTTP/1.1 404 Not Found
Content-Security-Policy: default-src 'none'
X-Content-Type-Options: nosniff
Content-Type: text/html; charset=utf-8

&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;…</div>
<p>Express trả lời request không khớp bằng một trang HTML 404. Với một API JSON thì đó là hình dạng sai — frontend chờ <code>{ error: … }</code> mà nhận về HTML. Bài 5.4 sẽ thay nó bằng một handler 404 dạng JSON. Để ý rằng đây đã là một bài học về cách Express được thiết kế: nó cho bạn một mặc định, và mọi mặc định đều thay được.</p>

<h3>Nó có thật sự tiết kiệm code không? Đếm thử</h3>
<p>Cùng một Notes API — liệt kê, đọc, tạo, sửa, xoá, có phân tích JSON, có giới hạn dung lượng body và có 404 — viết hai lần, một lần bằng module <code>http</code> lõi và một lần bằng Express. Đếm số dòng không rỗng bằng <code>grep -cve '^\\s*$'</code>:</p>
<div class="out">http thuần, một file                       : 67 dòng
  ├─ ống nước thuần tuý (send/readJson/dispatch): 27 dòng
  └─ nghiệp vụ thật sự của bạn              : 40 dòng

express
  ├─ routes/notes.routes.js (đúng 5 route)  : 32 dòng
  ├─ app.js (lắp ráp)                       : 15 dòng
  ├─ middleware/errors.js                   : 20 dòng
  └─ middleware/logger.js                   :  8 dòng</div>
<p>Hãy đọc con số này một cách trung thực: tổng số dòng gần như bằng nhau. Express <em>không</em> làm chương trình ngắn đi — và ai bán cho bạn một framework bằng lý lẽ "ít dòng hơn" thì đang bán cho bạn một thứ khác. Cái thay đổi là <strong>bạn sở hữu những dòng NÀO</strong>. Ở bản thuần, 27 trong 67 dòng là ống nước mà bạn phải làm cho đúng và sẽ copy sang dự án tiếp theo. Ở bản Express, 27 dòng đó biến mất, đổi lấy <code>express.json()</code> và <code>Router()</code>, còn 20 dòng xử lý lỗi thì được dùng chung cho mọi route bạn thêm về sau — trong khi ống nước của bản thuần thì phình to theo từng route mới.</p>
<div class="callout ok">Có một cách đánh giá framework tốt hơn: thêm route <em>thứ mười một</em> tốn bao nhiêu? Với Express là ba dòng trong một file router. Với bản thuần là thêm một nhánh nữa vào chuỗi <code>if</code> vốn đã phải gánh cả method, cắt đường dẫn, đọc body lẫn bắt lỗi.</div>

<h3>Lỗi mà ai cũng mắc trong tuần đầu</h3>
<pre><code>app.<span class="tok-fn">get</span>(<span class="tok-string">'/double'</span>, (req, res) =&gt; {
  <span class="tok-keyword">if</span> (!req.query.token) res.<span class="tok-fn">status</span>(<span class="tok-number">401</span>).<span class="tok-fn">json</span>({ error: <span class="tok-string">'Unauthorized'</span> });  <span class="tok-comment">// thiếu return!</span>
  res.<span class="tok-fn">json</span>({ secret: <span class="tok-string">'dữ liệu riêng tư'</span> });
});</code></pre>
<div class="out">client nhận : {"error":"Unauthorized"}   [401]
server log  : [error handler] ERR_HTTP_HEADERS_SENT</div>
<div class="pitfall">Client nhận đúng kết quả, nên con bug này nằm im hàng tháng trời. Nhưng handler vẫn chạy tiếp và cố gửi phản hồi thứ hai; Node ném <code>ERR_HTTP_HEADERS_SENT</code> vào error handler. Ở một route mà lệnh <code>res.json</code> thứ hai nằm sau một phép ghi cơ sở dữ liệu tốn kém, bạn còn đang thực hiện phép ghi đó cho một request mà mình đã từ chối. Quy tắc: <strong>mọi lệnh <code>res.*</code> kết thúc request đều phải có <code>return</code> đứng trước</strong>, trừ khi nó là câu lệnh cuối cùng của hàm.</div>
<div class="note-ct">Mọi API trên cuongthai.com đều là một ứng dụng Express đúng hình dạng này: một <code>app</code>, một chồng middleware, các router gắn dưới <code>/api/v1/…</code>, rồi một 404 dạng JSON và một error handler ở đáy. Các chương sau chỉ thêm tầng vào bộ khung đó — cơ sở dữ liệu, xác thực, tải file, realtime — chứ không bao giờ thay thế nó.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Kiến thức cốt lõi Express.js</span><span class="lc-sub">10 bài tập về khởi tạo app, định tuyến và phản hồi.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Routing: params, query and Router|||5.2 — Định tuyến: params, query và Router',
      slug: 'nodejs-5-2-dinh-tuyen',
      type: 'VIDEO',
      description: 'Cách Express khớp đường dẫn, vì sao thứ tự khai báo route là một loại bug, và cách tách route ra file bằng express.Router().',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Routing: params, query and <code>Router</code></h2>
<p class="lead">A route is a pair — a method and a path — plus a function. Express keeps them in an ordered list and walks that list top to bottom for every request. Almost everything surprising about routing follows from those two words: <strong>ordered list</strong>.</p>

<h3>The anatomy of a route</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Request arrives</div><div class="lz-d"><code>GET /notes/42?full=1</code></div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Express walks the stack</div><div class="lz-d">in declaration order, top to bottom</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">First match wins</div><div class="lz-d">the first entry whose method AND path match</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Handler runs</div><div class="lz-d"><code>req.params</code> and <code>req.query</code> are filled in</div></div>
</div>
<pre><code>app.get('/notes/:id', handler)
     │      │       └── path pattern
     │      └── HTTP method: get post put patch delete all
     └── the app (or a Router)</code></pre>

<h3>Path parameters</h3>
<pre><code>app.<span class="tok-fn">get</span>(<span class="tok-string">'/notes/:id'</span>, (req, res) =&gt; {
  res.<span class="tok-fn">json</span>({ params: req.params, query: req.query });
});</code></pre>
<pre><code>curl /notes/42</code></pre>
<div class="out">{"handler":":id","params":{"id":"42"},"query":{}}</div>
<div class="callout warn"><code>req.params.id</code> is the <strong>string</strong> <code>"42"</code>, never the number 42. A URL has no types. <code>Number(req.params.id)</code> is not optional — and neither is checking the result, because <code>Number('abc')</code> is <code>NaN</code> and <code>NaN</code> passed to a database query is a 500 waiting to happen.</div>

<h3>The ordering bug — a live demonstration</h3>
<p>Two routes, declared in the wrong order on purpose:</p>
<pre><code>app.<span class="tok-fn">get</span>(<span class="tok-string">'/notes/:id'</span>, (req, res) =&gt; res.json({ handler: <span class="tok-string">':id'</span>, params: req.params }));
app.<span class="tok-fn">get</span>(<span class="tok-string">'/notes/new'</span>, (req, res) =&gt; res.json({ handler: <span class="tok-string">'new'</span> }));</code></pre>
<pre><code>curl /notes/new</code></pre>
<div class="out">{"handler":":id","params":{"id":"new"}}</div>
<p>The "new note" page is gone. Express never even looked at the second route: <code>/notes/:id</code> came first in the list and <code>:id</code> happily matched the literal segment <code>new</code>. In a real app the handler would then run <code>SELECT * FROM notes WHERE id = Number('new')</code> and return a 404 or a 500, and you would spend an hour debugging the database.</p>
<pre><code><span class="tok-comment">// correct: specific routes BEFORE parameterised ones</span>
app.<span class="tok-fn">get</span>(<span class="tok-string">'/notes/new'</span>, …);
app.<span class="tok-fn">get</span>(<span class="tok-string">'/notes/:id'</span>, …);</code></pre>
<div class="out">GET /notes/new → {"handler":"new"}
GET /notes/42  → {"handler":":id","id":"42"}</div>
<div class="pitfall">This class of bug scales badly: the more routes a file has, the more likely a broad pattern shadows a narrow one, and nothing warns you — there is no compile step and no duplicate-route error. The habit that prevents it: <strong>inside a resource, declare from most specific to least specific</strong>, and keep each resource in its own router file so the list stays short enough to read.</div>

<h3>The query string</h3>
<pre><code>curl "/search?q=node&amp;tags=a&amp;tags=b&amp;page=2"</code></pre>
<div class="out">{"q":"node","tags":["a","b"],"page":"2"}</div>
<p>Three things to notice, all of which have caused production incidents:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Everything is a string</span><span class="v"><code>page</code> is <code>"2"</code>. <code>"2" + 1</code> is <code>"21"</code>. Always convert, always with a default: <code>Number(req.query.page ?? 1)</code>.</span></div>
  <div class="kv"><span class="k">A repeated key becomes an array</span><span class="v"><code>tags=a&amp;tags=b</code> gives <code>["a","b"]</code>. A single <code>tags=a</code> gives the string <code>"a"</code>. Code written against one shape breaks on the other — an attacker can flip the type of any query field by repeating it.</span></div>
  <div class="kv"><span class="k">The client controls the whole object</span><span class="v">Never spread <code>req.query</code> straight into a database <code>where</code> clause. Read the fields you expect, by name.</span></div>
</div>
<div class="callout ok">Defensive shape for a list endpoint — clamp the page size so nobody can request a million rows:
<pre><code><span class="tok-keyword">const</span> page  = Math.max(<span class="tok-number">1</span>, Number(req.query.page ?? <span class="tok-number">1</span>) || <span class="tok-number">1</span>);
<span class="tok-keyword">const</span> limit = Math.min(<span class="tok-number">50</span>, Math.max(<span class="tok-number">1</span>, Number(req.query.limit ?? <span class="tok-number">10</span>) || <span class="tok-number">10</span>));</code></pre></div>

<h3>Wildcards — and an Express 5 change</h3>
<pre><code>app.<span class="tok-fn">get</span>(<span class="tok-string">'/files/*splat'</span>, (req, res) =&gt; res.json({ params: req.params }));</code></pre>
<pre><code>curl /files/a/b/c.png</code></pre>
<div class="out">{"params":{"splat":["a","b","c.png"]}}</div>
<div class="callout"><strong>Version difference.</strong> Express 4 wrote this as <code>'/files/*'</code> and put the match in <code>req.params[0]</code> as one string. Express 5 requires the wildcard to be <strong>named</strong> and gives you an array of segments. The old optional-parameter syntax <code>'/notes/:id?'</code> was also removed in v5 — declare two routes instead. This is the number-one reason a copy-pasted v4 snippet throws <code>Missing parameter name</code> on startup.</div>

<h3><code>express.Router()</code> — one file per resource</h3>
<p>A single <code>app.js</code> with forty routes is unreadable and guarantees the ordering bug above. A Router is a mini-app: same <code>.get/.post/.use</code> API, mounted under a prefix.</p>
<pre><code><span class="tok-comment">// routes/notes.routes.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">const</span> router = Router();

router.<span class="tok-fn">get</span>(<span class="tok-string">'/'</span>,    listNotes);    <span class="tok-comment">// → GET  /api/v1/notes</span>
router.<span class="tok-fn">post</span>(<span class="tok-string">'/'</span>,   createNote);   <span class="tok-comment">// → POST /api/v1/notes</span>
router.<span class="tok-fn">get</span>(<span class="tok-string">'/:id'</span>, getNote);      <span class="tok-comment">// → GET  /api/v1/notes/:id</span>

<span class="tok-keyword">export default</span> router;</code></pre>
<pre><code><span class="tok-comment">// app.js</span>
<span class="tok-keyword">import</span> notesRouter <span class="tok-keyword">from</span> <span class="tok-string">'./routes/notes.routes.js'</span>;
app.<span class="tok-fn">use</span>(<span class="tok-string">'/api/v1/notes'</span>, notesRouter);</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Paths inside are relative</span><span class="v">The router never repeats its own prefix. Change the mount path in one place and every route moves.</span></div>
  <div class="kv"><span class="k">Middleware can be scoped to it</span><span class="v"><code>app.use('/api/v1/admin', requireAdmin, adminRouter)</code> — the guard runs for that subtree only.</span></div>
  <div class="kv"><span class="k">Ordering is now local</span><span class="v">You only have to reason about the order of one resource's routes, not all forty.</span></div>
  <div class="kv"><span class="k">mergeParams for nesting</span><span class="v"><code>Router({ mergeParams: true })</code> lets a child router see the parent's <code>:id</code> — needed for <code>/notes/:noteId/comments</code>.</span></div>
</div>
<div class="note-ct">This site's backend has around forty routers under <code>src/routes/</code>, one per resource — notes, messages, courses, uploads — each mounted on its own <code>/api/v1/…</code> prefix in one central file. That central file is the fastest way to answer "does this endpoint exist?", and it is also why the deploy script can smoke-test routes by URL: a route that 404s on an unauthenticated GET was never mounted.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Express.js Core Concepts</span><span class="lc-sub">Routing, params and routers, with exercises.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Định tuyến: params, query và <code>Router</code></h2>
<p class="lead">Một route là một cặp — phương thức và đường dẫn — cộng thêm một hàm. Express giữ chúng trong một danh sách có thứ tự và duyệt danh sách đó từ trên xuống cho mỗi request. Gần như mọi điều gây bất ngờ trong định tuyến đều bắt nguồn từ ba chữ đó: <strong>danh sách có thứ tự</strong>.</p>

<h3>Giải phẫu một route</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Request tới</div><div class="lz-d"><code>GET /notes/42?full=1</code></div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Express duyệt chồng</div><div class="lz-d">theo đúng thứ tự khai báo, từ trên xuống</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Khớp đầu tiên thì thắng</div><div class="lz-d">mục đầu tiên khớp CẢ method LẪN path</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Handler chạy</div><div class="lz-d"><code>req.params</code> và <code>req.query</code> được điền</div></div>
</div>
<pre><code>app.get('/notes/:id', handler)
     │      │       └── mẫu đường dẫn
     │      └── phương thức HTTP: get post put patch delete all
     └── app (hoặc một Router)</code></pre>

<h3>Tham số trên đường dẫn</h3>
<pre><code>app.<span class="tok-fn">get</span>(<span class="tok-string">'/notes/:id'</span>, (req, res) =&gt; {
  res.<span class="tok-fn">json</span>({ params: req.params, query: req.query });
});</code></pre>
<pre><code>curl /notes/42</code></pre>
<div class="out">{"handler":":id","params":{"id":"42"},"query":{}}</div>
<div class="callout warn"><code>req.params.id</code> là <strong>chuỗi</strong> <code>"42"</code>, không bao giờ là số 42. URL không có kiểu dữ liệu. Việc <code>Number(req.params.id)</code> là bắt buộc — và kiểm tra kết quả cũng bắt buộc, vì <code>Number('abc')</code> ra <code>NaN</code>, mà <code>NaN</code> ném vào truy vấn cơ sở dữ liệu là một lỗi 500 đang chờ tới lượt.</div>

<h3>Bug thứ tự — xem tận mắt</h3>
<p>Hai route, cố tình khai báo sai thứ tự:</p>
<pre><code>app.<span class="tok-fn">get</span>(<span class="tok-string">'/notes/:id'</span>, (req, res) =&gt; res.json({ handler: <span class="tok-string">':id'</span>, params: req.params }));
app.<span class="tok-fn">get</span>(<span class="tok-string">'/notes/new'</span>, (req, res) =&gt; res.json({ handler: <span class="tok-string">'new'</span> }));</code></pre>
<pre><code>curl /notes/new</code></pre>
<div class="out">{"handler":":id","params":{"id":"new"}}</div>
<p>Trang "tạo ghi chú mới" biến mất. Express thậm chí không thèm nhìn tới route thứ hai: <code>/notes/:id</code> đứng trước trong danh sách và <code>:id</code> khớp ngon lành với đoạn chữ <code>new</code>. Trong ứng dụng thật, handler sẽ chạy <code>SELECT * FROM notes WHERE id = Number('new')</code> rồi trả về 404 hoặc 500, còn bạn thì mất một tiếng đi gỡ lỗi ở cơ sở dữ liệu.</p>
<pre><code><span class="tok-comment">// đúng: route cụ thể đứng TRƯỚC route có tham số</span>
app.<span class="tok-fn">get</span>(<span class="tok-string">'/notes/new'</span>, …);
app.<span class="tok-fn">get</span>(<span class="tok-string">'/notes/:id'</span>, …);</code></pre>
<div class="out">GET /notes/new → {"handler":"new"}
GET /notes/42  → {"handler":":id","id":"42"}</div>
<div class="pitfall">Loại bug này càng lớn càng nguy: file càng nhiều route thì khả năng một mẫu rộng che mất một mẫu hẹp càng cao, mà chẳng có gì cảnh báo bạn — không có bước biên dịch, cũng không có lỗi "route trùng". Thói quen phòng tránh: <strong>trong cùng một tài nguyên, khai báo từ cụ thể nhất tới chung nhất</strong>, và tách mỗi tài nguyên ra một file router riêng để danh sách đủ ngắn mà đọc hết.</div>

<h3>Chuỗi truy vấn (query string)</h3>
<pre><code>curl "/search?q=node&amp;tags=a&amp;tags=b&amp;page=2"</code></pre>
<div class="out">{"q":"node","tags":["a","b"],"page":"2"}</div>
<p>Ba điều cần để ý, cả ba đều từng gây sự cố trên production:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Mọi thứ đều là chuỗi</span><span class="v"><code>page</code> là <code>"2"</code>. Mà <code>"2" + 1</code> ra <code>"21"</code>. Luôn ép kiểu, và luôn kèm giá trị mặc định: <code>Number(req.query.page ?? 1)</code>.</span></div>
  <div class="kv"><span class="k">Khoá lặp lại thì thành mảng</span><span class="v"><code>tags=a&amp;tags=b</code> cho ra <code>["a","b"]</code>. Còn <code>tags=a</code> một mình cho ra chuỗi <code>"a"</code>. Code viết theo một hình dạng sẽ vỡ với hình dạng kia — và kẻ tấn công có thể đổi kiểu của bất kỳ trường query nào chỉ bằng cách lặp nó.</span></div>
  <div class="kv"><span class="k">Client điều khiển toàn bộ object</span><span class="v">Đừng bao giờ đổ thẳng <code>req.query</code> vào mệnh đề <code>where</code> của cơ sở dữ liệu. Hãy đọc đúng những trường bạn mong đợi, theo tên.</span></div>
</div>
<div class="callout ok">Hình dạng phòng thủ cho một endpoint danh sách — chặn trần số bản ghi để không ai xin được một triệu dòng:
<pre><code><span class="tok-keyword">const</span> page  = Math.max(<span class="tok-number">1</span>, Number(req.query.page ?? <span class="tok-number">1</span>) || <span class="tok-number">1</span>);
<span class="tok-keyword">const</span> limit = Math.min(<span class="tok-number">50</span>, Math.max(<span class="tok-number">1</span>, Number(req.query.limit ?? <span class="tok-number">10</span>) || <span class="tok-number">10</span>));</code></pre></div>

<h3>Ký tự đại diện — và một thay đổi ở Express 5</h3>
<pre><code>app.<span class="tok-fn">get</span>(<span class="tok-string">'/files/*splat'</span>, (req, res) =&gt; res.json({ params: req.params }));</code></pre>
<pre><code>curl /files/a/b/c.png</code></pre>
<div class="out">{"params":{"splat":["a","b","c.png"]}}</div>
<div class="callout"><strong>Khác biệt phiên bản.</strong> Express 4 viết cái này là <code>'/files/*'</code> và đặt phần khớp vào <code>req.params[0]</code> dưới dạng một chuỗi. Express 5 bắt buộc ký tự đại diện phải <strong>có tên</strong> và trả về mảng các đoạn. Cú pháp tham số tuỳ chọn kiểu <code>'/notes/:id?'</code> cũng đã bị bỏ ở v5 — hãy khai báo hai route thay thế. Đây là nguyên nhân số một khiến một đoạn code v4 copy về ném lỗi <code>Missing parameter name</code> ngay lúc khởi động.</div>

<h3><code>express.Router()</code> — mỗi tài nguyên một file</h3>
<p>Một file <code>app.js</code> chứa bốn mươi route thì không đọc nổi, và bảo đảm sẽ dính bug thứ tự ở trên. Router là một ứng dụng thu nhỏ: cùng bộ API <code>.get/.post/.use</code>, được gắn dưới một tiền tố.</p>
<pre><code><span class="tok-comment">// routes/notes.routes.js</span>
<span class="tok-keyword">import</span> { Router } <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">const</span> router = Router();

router.<span class="tok-fn">get</span>(<span class="tok-string">'/'</span>,    listNotes);    <span class="tok-comment">// → GET  /api/v1/notes</span>
router.<span class="tok-fn">post</span>(<span class="tok-string">'/'</span>,   createNote);   <span class="tok-comment">// → POST /api/v1/notes</span>
router.<span class="tok-fn">get</span>(<span class="tok-string">'/:id'</span>, getNote);      <span class="tok-comment">// → GET  /api/v1/notes/:id</span>

<span class="tok-keyword">export default</span> router;</code></pre>
<pre><code><span class="tok-comment">// app.js</span>
<span class="tok-keyword">import</span> notesRouter <span class="tok-keyword">from</span> <span class="tok-string">'./routes/notes.routes.js'</span>;
app.<span class="tok-fn">use</span>(<span class="tok-string">'/api/v1/notes'</span>, notesRouter);</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Đường dẫn bên trong là tương đối</span><span class="v">Router không bao giờ lặp lại tiền tố của chính nó. Đổi chỗ gắn ở một nơi là cả cụm route dời theo.</span></div>
  <div class="kv"><span class="k">Middleware gắn được theo phạm vi</span><span class="v"><code>app.use('/api/v1/admin', requireAdmin, adminRouter)</code> — chốt chặn chỉ chạy cho nhánh cây đó.</span></div>
  <div class="kv"><span class="k">Thứ tự trở thành chuyện cục bộ</span><span class="v">Bạn chỉ phải suy nghĩ về thứ tự route của MỘT tài nguyên, thay vì cả bốn mươi.</span></div>
  <div class="kv"><span class="k">mergeParams khi lồng nhau</span><span class="v"><code>Router({ mergeParams: true })</code> cho router con nhìn thấy <code>:id</code> của cha — cần cho <code>/notes/:noteId/comments</code>.</span></div>
</div>
<div class="note-ct">Backend của website này có khoảng bốn mươi router trong <code>src/routes/</code>, mỗi tài nguyên một file — ghi chú, tin nhắn, khoá học, tải file — và mỗi cái được gắn vào tiền tố <code>/api/v1/…</code> riêng trong một file trung tâm. File trung tâm đó là cách nhanh nhất để trả lời "endpoint này có tồn tại không?", và cũng là lý do script deploy có thể smoke-test route bằng URL: một route trả 404 với lệnh GET không xác thực nghĩa là nó chưa bao giờ được gắn.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Kiến thức cốt lõi Express.js</span><span class="lc-sub">Định tuyến, tham số và router, kèm bài tập.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Middleware: the chain every request walks|||5.3 — Middleware: sợi dây chuyền mọi request đi qua',
      slug: 'nodejs-5-3-middleware',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-5-3-middleware.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-5-3-middleware.jpg',
        scenario: 'nodejs-middleware',
        durationSeconds: 26,
        caption: { en: "Middleware — the chain every request walks", vi: "Middleware — sợi dây chuyền mọi request đi qua" },
      },
      type: 'VIDEO',
      description: 'next(), thứ tự thực thi, express.json và express.static, middleware theo phạm vi, và chuyện gì xảy ra khi bạn quên next().',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Middleware: the chain every request walks</h2>
<p class="lead">Middleware is the one idea in Express worth understanding properly. Everything is middleware — body parsing, authentication, logging, your route handlers, even the error handler. Once you see the chain, Express stops having surprises.</p>

<h3>The definition, in one line</h3>
<pre><code><span class="tok-keyword">function</span> <span class="tok-fn">middleware</span>(req, res, next) { … }</code></pre>
<p>A function with three arguments that gets <code>req</code>, gets <code>res</code>, and gets a <code>next</code> to call when it is done. It has exactly three legal endings:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Call <code>next()</code></span><span class="v">"I am done, carry on down the chain." The most common ending.</span></div>
  <div class="kv"><span class="k">Send a response</span><span class="v"><code>res.json(…)</code> — the chain STOPS here. Nothing below runs.</span></div>
  <div class="kv"><span class="k">Call <code>next(err)</code></span><span class="v">Jump straight to the error handler, skipping every normal middleware in between (lesson 5.4).</span></div>
</div>
<div class="pitfall">There is a fourth, illegal ending: doing none of the above. The request then hangs until the client gives up. We will watch that happen in a minute — it is one of the hardest bugs to spot by reading code, because a missing <code>next()</code> looks like nothing at all.</div>

<h3>The chain, in execution order</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">app.use(logger)</span><span class="lz-lnote">global — runs for every request</span></div>
  <div class="lz-layer"><span class="lz-lname">app.use(express.json())</span><span class="lz-lnote">global — fills req.body</span></div>
  <div class="lz-layer"><span class="lz-lname">app.use('/api', mw)</span><span class="lz-lnote">path-scoped — only under /api</span></div>
  <div class="lz-layer"><span class="lz-lname">app.get('/api/notes', mw, handler)</span><span class="lz-lnote">route-level — only this route</span></div>
  <div class="lz-layer"><span class="lz-lname">app.use(notFound)</span><span class="lz-lnote">reached only if nothing above responded</span></div>
  <div class="lz-layer"><span class="lz-lname">app.use(errorHandler)</span><span class="lz-lnote">4 arguments — reached only via next(err)</span></div>
</div>
<p>That is not a diagram of a concept; it is the actual file order. Here it is running, with a <code>console.log</code> in each step:</p>
<pre><code>app.<span class="tok-fn">use</span>((req, res, next) =&gt; { console.log(<span class="tok-string">'1. global logger'</span>); next(); });
app.<span class="tok-fn">use</span>(express.<span class="tok-fn">static</span>(<span class="tok-string">'public'</span>));
app.<span class="tok-fn">use</span>(<span class="tok-string">'/api'</span>, (req, res, next) =&gt; { console.log(<span class="tok-string">'2. only for /api/*'</span>); next(); });
app.<span class="tok-fn">get</span>(<span class="tok-string">'/api/notes'</span>,
  (req, res, next) =&gt; { console.log(<span class="tok-string">'3. route-level middleware'</span>); next(); },
  (req, res)       =&gt; { console.log(<span class="tok-string">'4. final handler'</span>); res.json({ ok: <span class="tok-keyword">true</span> }); });
app.<span class="tok-fn">use</span>((req, res, next) =&gt; { console.log(<span class="tok-string">'X. after the routes'</span>); next(); });</code></pre>
<pre><code>curl /api/notes</code></pre>
<div class="out">1. global logger
2. only for /api/*
3. route-level middleware
4. final handler
{"ok":true}</div>
<p><code>X</code> never printed — step 4 ended the response and never called <code>next()</code>, so the chain stopped there. Now the same server with a path that does not match that route:</p>
<pre><code>curl /notes/new</code></pre>
<div class="out">1. global logger
X. after the routes
{"handler":"new"}</div>
<div class="callout">Two lessons in one output. <code>2</code> did not run because <code>/notes/new</code> is not under <code>/api</code>. <code>X</code> DID run, because it sits above the <code>/notes/new</code> route in the file and nothing had responded yet. "After the routes" is only true relative to the routes declared <em>above</em> it — position in the file is the whole API.</div>

<h3>The built-in middleware you will actually use</h3>
<h4><code>express.json()</code> — and what happens without it</h4>
<p>A route registered <strong>before</strong> <code>app.use(express.json())</code> versus one registered after, both sent the same POST body:</p>
<pre><code>curl -X POST /no-parser   -H 'Content-Type: application/json' -d '{"title":"Note 1"}'
curl -X POST /with-parser -H 'Content-Type: application/json' -d '{"title":"Note 1"}'</code></pre>
<div class="out">/no-parser   → {"type":"undefined"}
/with-parser → {"body":{"title":"Note 1"},"type":"object"}</div>
<div class="pitfall">This is the classic "why is <code>req.body</code> undefined" question, and the answer is always one of three things: you forgot <code>express.json()</code>, you registered the route above it, or the client did not send <code>Content-Type: application/json</code> — the parser deliberately ignores bodies of other types. In Express 5 an unparsed body is <code>undefined</code>, so <code>const { title } = req.body</code> throws a TypeError on the destructure. Write <code>req.body ?? {}</code> in handlers that must not crash.</div>
<p>Malformed JSON is rejected by the parser before your handler ever runs:</p>
<pre><code>curl -i -X POST /with-parser -H 'Content-Type: application/json' -d '{title:}'</code></pre>
<div class="out">HTTP/1.1 400 Bad Request
SyntaxError: Expected property name or '}' in JSON at position 1
    at JSON.parse (&lt;anonymous&gt;)
    at parse (/…/node_modules/body-parser/lib/types/json.js:91:21)
    …</div>
<div class="callout danger">Look at what that 400 leaked: absolute paths from the server's filesystem and the internal call stack. That is Express's <em>default</em> error handler, which prints stacks when <code>NODE_ENV</code> is not <code>production</code>. Two fixes, and you want both: set <code>NODE_ENV=production</code> on the server, and install your own error handler (lesson 5.4) so nothing depends on that environment variable being right.</div>
<pre><code>app.<span class="tok-fn">use</span>(express.<span class="tok-fn">json</span>({ limit: <span class="tok-string">'100kb'</span> }));           <span class="tok-comment">// always set a limit</span>
app.<span class="tok-fn">use</span>(express.<span class="tok-fn">urlencoded</span>({ extended: <span class="tok-keyword">true</span> }));      <span class="tok-comment">// HTML form posts</span></code></pre>
<div class="callout warn">The default body limit is 100kb. Raising it to <code>'50mb'</code> "so uploads work" is a bad trade: every request now gets to buffer 50MB of your RAM before you have authenticated anybody. File uploads belong on a streaming path instead — chapter 10.</div>

<h4><code>express.static()</code> — files without a route</h4>
<pre><code>app.<span class="tok-fn">use</span>(express.<span class="tok-fn">static</span>(<span class="tok-string">'public'</span>));</code></pre>
<pre><code>curl -i /hello.txt</code></pre>
<div class="out">HTTP/1.1 200 OK
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Mon, 27 Jul 2026 15:31:53 GMT
ETag: W/"25-19fa43439c9"
Content-Type: text/plain; charset=utf-8
Content-Length: 37</div>
<p>Content type from the extension, <code>Last-Modified</code>, <code>ETag</code>, and byte-range support — all free. Ask again with the ETag the server just gave you:</p>
<pre><code>curl -H 'If-None-Match: W/"25-19fa43439c9"' -i /hello.txt</code></pre>
<div class="out">304 — size=0 byte</div>
<p>Zero bytes of body on the wire because the browser already has the file. That is <code>express.static</code> implementing conditional requests for you, and it is exactly the machinery lesson 3.5's hand-written server did not have.</p>

<h3>Writing your own — a request logger with real timings</h3>
<pre><code><span class="tok-keyword">export function</span> <span class="tok-fn">requestLogger</span>(req, res, next) {
  <span class="tok-keyword">const</span> t0 = process.hrtime.<span class="tok-fn">bigint</span>();
  res.<span class="tok-fn">on</span>(<span class="tok-string">'finish'</span>, () =&gt; {                          <span class="tok-comment">// EventEmitter, lesson 3.4</span>
    <span class="tok-keyword">const</span> ms = Number(process.hrtime.<span class="tok-fn">bigint</span>() - t0) / <span class="tok-number">1e6</span>;
    console.log(\`\${req.method} \${req.originalUrl} \${res.statusCode} \${ms.toFixed(1)}ms\`);
  });
  <span class="tok-fn">next</span>();                                            <span class="tok-comment">// don't block the chain!</span>
}</code></pre>
<div class="out">POST /api/v1/notes 201 4.9ms
POST /api/v1/notes 422 0.9ms
GET /api/v1/notes?page=1&amp;limit=10 200 0.7ms
DELETE /api/v1/notes/2 204 0.7ms</div>
<p>Note the shape of the trick: the middleware itself does almost nothing and calls <code>next()</code> immediately. The measurement happens later, when the <code>finish</code> event fires on the response — that is the EventEmitter pattern from lesson 3.4 doing real work. If you tried to log after <code>next()</code> returned, you would print before the response was actually sent, because <code>next()</code> does not wait for async handlers.</p>
<div class="callout ok"><code>req.originalUrl</code> vs <code>req.url</code>: inside a router mounted at <code>/api/v1/notes</code>, <code>req.url</code> is the path <em>relative to the mount</em> (<code>/42</code>), while <code>req.originalUrl</code> is the full path the client asked for. Logs want the second one.</div>

<h3>Scoped middleware — the shape of every guard</h3>
<pre><code><span class="tok-keyword">const</span> requireAdmin = (req, res, next) =&gt; {
  <span class="tok-keyword">if</span> (req.headers[<span class="tok-string">'x-role'</span>] !== <span class="tok-string">'admin'</span>) <span class="tok-keyword">return</span> res.<span class="tok-fn">status</span>(<span class="tok-number">403</span>).<span class="tok-fn">json</span>({ error: <span class="tok-string">'Forbidden'</span> });
  <span class="tok-fn">next</span>();
};
app.<span class="tok-fn">get</span>(<span class="tok-string">'/admin/stats'</span>, requireAdmin, (req, res) =&gt; res.json({ users: <span class="tok-number">128</span> }));</code></pre>
<div class="out">no header      → {"error":"Forbidden"}   [403]
x-role: admin  → {"users":128}           [200]</div>
<p>Every authentication and authorisation system in chapter 8 is this function with a real token check instead of a header comparison. Notice the <code>return</code> in front of <code>res.status(403)</code> — lesson 5.1's rule, in the place it matters most: without it, a rejected request would still run the handler.</p>

<h3>The hang</h3>
<pre><code>app.<span class="tok-fn">use</span>(<span class="tok-string">'/hang'</span>, (req, res, next) =&gt; {
  console.log(<span class="tok-string">'middleware ran, but never calls next()'</span>);
});                                                  <span class="tok-comment">// ← no next(), no response</span>
app.<span class="tok-fn">get</span>(<span class="tok-string">'/hang'</span>, (req, res) =&gt; res.json({ reached: <span class="tok-keyword">true</span> }));</code></pre>
<pre><code>curl -m 3 /hang</code></pre>
<div class="out">server: middleware ran, but never calls next()
client: (nothing for 3 seconds)
curl exit=28   ← Operation timed out</div>
<div class="pitfall">No error, no log, no crash — the server is perfectly healthy and the request simply never ends. Worse, the connection stays open, so enough of these will exhaust your connection pool and take the whole API down. The most common real-world version is an <code>async</code> middleware with an early <code>return</code> on some branch that forgets both <code>res</code> and <code>next</code>. When a single endpoint "hangs forever" and everything else works, look for the middleware branch that ends without doing either.</div>
<div class="note-ct">The middleware stack on this site, in order: security headers → CORS → rate limiter → request logger → <code>express.json</code> → cookie parser → <code>authenticate</code> (decodes the JWT into <code>req.user</code>, does not reject) → routers, where individual routes add <code>requireAuth</code> or <code>requireAdmin</code>. Splitting "decode the token" from "require a token" is deliberate: it lets one endpoint serve both anonymous and logged-in visitors with different content, without writing the route twice.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Express.js Core Concepts</span><span class="lc-sub">Middleware, next() and the request pipeline.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Middleware: sợi dây chuyền mọi request đi qua</h2>
<p class="lead">Middleware là ý tưởng duy nhất trong Express đáng để hiểu cho tới nơi. Mọi thứ đều là middleware — phân tích body, xác thực, ghi log, chính các handler route của bạn, thậm chí cả error handler. Một khi nhìn ra sợi dây chuyền này, Express hết chỗ để làm bạn bất ngờ.</p>

<h3>Định nghĩa, gói trong một dòng</h3>
<pre><code><span class="tok-keyword">function</span> <span class="tok-fn">middleware</span>(req, res, next) { … }</code></pre>
<p>Một hàm ba tham số, nhận <code>req</code>, nhận <code>res</code>, và nhận một hàm <code>next</code> để gọi khi xong việc. Nó có đúng ba cái kết hợp lệ:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Gọi <code>next()</code></span><span class="v">"Tôi xong rồi, đi tiếp xuống dây chuyền." Đây là cái kết thường gặp nhất.</span></div>
  <div class="kv"><span class="k">Gửi phản hồi</span><span class="v"><code>res.json(…)</code> — dây chuyền DỪNG ở đây. Mọi thứ bên dưới không chạy.</span></div>
  <div class="kv"><span class="k">Gọi <code>next(err)</code></span><span class="v">Nhảy thẳng tới error handler, bỏ qua mọi middleware thường ở giữa (bài 5.4).</span></div>
</div>
<div class="pitfall">Còn một cái kết thứ tư, không hợp lệ: không làm cái nào trong ba cái trên. Request sẽ treo cho tới khi client bỏ cuộc. Lát nữa ta sẽ xem tận mắt — đây là một trong những bug khó phát hiện nhất khi đọc code, vì một lệnh <code>next()</code> bị thiếu trông chẳng khác gì không có gì cả.</div>

<h3>Dây chuyền, theo đúng thứ tự chạy</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">app.use(logger)</span><span class="lz-lnote">toàn cục — chạy với mọi request</span></div>
  <div class="lz-layer"><span class="lz-lname">app.use(express.json())</span><span class="lz-lnote">toàn cục — điền req.body</span></div>
  <div class="lz-layer"><span class="lz-lname">app.use('/api', mw)</span><span class="lz-lnote">theo đường dẫn — chỉ dưới /api</span></div>
  <div class="lz-layer"><span class="lz-lname">app.get('/api/notes', mw, handler)</span><span class="lz-lnote">cấp route — chỉ route này</span></div>
  <div class="lz-layer"><span class="lz-lname">app.use(notFound)</span><span class="lz-lnote">chỉ tới được nếu phía trên chưa ai trả lời</span></div>
  <div class="lz-layer"><span class="lz-lname">app.use(errorHandler)</span><span class="lz-lnote">4 tham số — chỉ tới được qua next(err)</span></div>
</div>
<p>Đó không phải sơ đồ minh hoạ một khái niệm; đó chính là thứ tự thật trong file. Đây là nó đang chạy, mỗi bước cắm một <code>console.log</code>:</p>
<pre><code>app.<span class="tok-fn">use</span>((req, res, next) =&gt; { console.log(<span class="tok-string">'1. logger toàn cục'</span>); next(); });
app.<span class="tok-fn">use</span>(express.<span class="tok-fn">static</span>(<span class="tok-string">'public'</span>));
app.<span class="tok-fn">use</span>(<span class="tok-string">'/api'</span>, (req, res, next) =&gt; { console.log(<span class="tok-string">'2. chỉ chạy với /api/*'</span>); next(); });
app.<span class="tok-fn">get</span>(<span class="tok-string">'/api/notes'</span>,
  (req, res, next) =&gt; { console.log(<span class="tok-string">'3. middleware riêng của route'</span>); next(); },
  (req, res)       =&gt; { console.log(<span class="tok-string">'4. handler cuối'</span>); res.json({ ok: <span class="tok-keyword">true</span> }); });
app.<span class="tok-fn">use</span>((req, res, next) =&gt; { console.log(<span class="tok-string">'X. sau các route'</span>); next(); });</code></pre>
<pre><code>curl /api/notes</code></pre>
<div class="out">1. logger toàn cục
2. chỉ chạy với /api/*
3. middleware riêng của route
4. handler cuối
{"ok":true}</div>
<p><code>X</code> không hề in ra — bước 4 đã kết thúc phản hồi và không gọi <code>next()</code>, nên dây chuyền dừng tại đó. Giờ vẫn server đó, nhưng gọi một đường dẫn không khớp route trên:</p>
<pre><code>curl /notes/new</code></pre>
<div class="out">1. logger toàn cục
X. sau các route
{"handler":"new"}</div>
<div class="callout">Một output, hai bài học. <code>2</code> không chạy vì <code>/notes/new</code> không nằm dưới <code>/api</code>. Còn <code>X</code> thì CÓ chạy, vì nó nằm phía trên route <code>/notes/new</code> trong file và lúc đó chưa ai trả lời cả. Chữ "sau các route" chỉ đúng so với những route khai báo <em>phía trên</em> nó — vị trí trong file chính là toàn bộ luật chơi.</div>

<h3>Những middleware có sẵn bạn sẽ dùng thật</h3>
<h4><code>express.json()</code> — và chuyện gì xảy ra khi thiếu nó</h4>
<p>Một route đăng ký <strong>trước</strong> <code>app.use(express.json())</code> so với một route đăng ký sau, cùng nhận một body POST giống hệt nhau:</p>
<pre><code>curl -X POST /no-parser   -H 'Content-Type: application/json' -d '{"title":"Ghi chú 1"}'
curl -X POST /with-parser -H 'Content-Type: application/json' -d '{"title":"Ghi chú 1"}'</code></pre>
<div class="out">/no-parser   → {"type":"undefined"}
/with-parser → {"body":{"title":"Ghi chú 1"},"type":"object"}</div>
<div class="pitfall">Đây chính là câu hỏi kinh điển "sao <code>req.body</code> lại undefined", và câu trả lời luôn là một trong ba: bạn quên <code>express.json()</code>, bạn đăng ký route phía trên nó, hoặc client không gửi <code>Content-Type: application/json</code> — bộ phân tích cố tình bỏ qua body có kiểu khác. Ở Express 5, body chưa phân tích là <code>undefined</code>, nên <code>const { title } = req.body</code> sẽ ném TypeError ngay lúc bóc tách. Hãy viết <code>req.body ?? {}</code> trong những handler không được phép sập.</div>
<p>JSON hỏng bị chặn ngay tại bộ phân tích, handler của bạn còn chưa kịp chạy:</p>
<pre><code>curl -i -X POST /with-parser -H 'Content-Type: application/json' -d '{title:}'</code></pre>
<div class="out">HTTP/1.1 400 Bad Request
SyntaxError: Expected property name or '}' in JSON at position 1
    at JSON.parse (&lt;anonymous&gt;)
    at parse (/…/node_modules/body-parser/lib/types/json.js:91:21)
    …</div>
<div class="callout danger">Hãy nhìn xem cái lỗi 400 đó để lộ những gì: đường dẫn tuyệt đối trên ổ đĩa của server và cả ngăn xếp gọi hàm bên trong. Đó là error handler <em>mặc định</em> của Express, nó in stack khi <code>NODE_ENV</code> khác <code>production</code>. Có hai cách sửa, và bạn nên làm cả hai: đặt <code>NODE_ENV=production</code> trên server, và tự cài error handler của mình (bài 5.4) để không việc gì phải phụ thuộc vào chuyện biến môi trường đó có được đặt đúng hay không.</div>
<pre><code>app.<span class="tok-fn">use</span>(express.<span class="tok-fn">json</span>({ limit: <span class="tok-string">'100kb'</span> }));           <span class="tok-comment">// luôn đặt giới hạn</span>
app.<span class="tok-fn">use</span>(express.<span class="tok-fn">urlencoded</span>({ extended: <span class="tok-keyword">true</span> }));      <span class="tok-comment">// form HTML gửi lên</span></code></pre>
<div class="callout warn">Giới hạn body mặc định là 100kb. Nâng lên <code>'50mb'</code> "cho upload chạy được" là một cuộc đổi chác tồi: từ giờ mọi request đều được phép đệm 50MB RAM của bạn trước khi bạn kịp xác thực ai cả. Tải file lên phải đi bằng đường luồng — chương 10.</div>

<h4><code>express.static()</code> — phục vụ file mà không cần route</h4>
<pre><code>app.<span class="tok-fn">use</span>(express.<span class="tok-fn">static</span>(<span class="tok-string">'public'</span>));</code></pre>
<pre><code>curl -i /hello.txt</code></pre>
<div class="out">HTTP/1.1 200 OK
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Mon, 27 Jul 2026 15:31:53 GMT
ETag: W/"25-19fa43439c9"
Content-Type: text/plain; charset=utf-8
Content-Length: 37</div>
<p>Kiểu nội dung suy ra từ phần mở rộng, <code>Last-Modified</code>, <code>ETag</code>, và hỗ trợ tải theo khoảng byte — tất cả miễn phí. Giờ hỏi lại với đúng cái ETag mà server vừa đưa:</p>
<pre><code>curl -H 'If-None-Match: W/"25-19fa43439c9"' -i /hello.txt</code></pre>
<div class="out">304 — size=0 byte</div>
<p>Không một byte body nào chạy trên dây, vì trình duyệt đã có sẵn file. Đó là <code>express.static</code> tự cài đặt cơ chế request có điều kiện giúp bạn, và đó đúng là phần bộ máy mà server viết tay ở bài 3.5 không hề có.</p>

<h3>Tự viết một cái — logger đo thời gian thật</h3>
<pre><code><span class="tok-keyword">export function</span> <span class="tok-fn">requestLogger</span>(req, res, next) {
  <span class="tok-keyword">const</span> t0 = process.hrtime.<span class="tok-fn">bigint</span>();
  res.<span class="tok-fn">on</span>(<span class="tok-string">'finish'</span>, () =&gt; {                          <span class="tok-comment">// EventEmitter, bài 3.4</span>
    <span class="tok-keyword">const</span> ms = Number(process.hrtime.<span class="tok-fn">bigint</span>() - t0) / <span class="tok-number">1e6</span>;
    console.log(\`\${req.method} \${req.originalUrl} \${res.statusCode} \${ms.toFixed(1)}ms\`);
  });
  <span class="tok-fn">next</span>();                                            <span class="tok-comment">// đừng chặn dây chuyền!</span>
}</code></pre>
<div class="out">POST /api/v1/notes 201 4.9ms
POST /api/v1/notes 422 0.9ms
GET /api/v1/notes?page=1&amp;limit=10 200 0.7ms
DELETE /api/v1/notes/2 204 0.7ms</div>
<p>Để ý hình dạng của mẹo này: bản thân middleware gần như không làm gì và gọi <code>next()</code> ngay lập tức. Phép đo diễn ra sau đó, khi sự kiện <code>finish</code> bắn ra trên response — chính là mẫu EventEmitter của bài 3.4 đang làm việc thật. Nếu bạn thử ghi log sau khi <code>next()</code> trả về, bạn sẽ in ra trước lúc phản hồi thực sự được gửi, vì <code>next()</code> không hề chờ các handler bất đồng bộ.</p>
<div class="callout ok"><code>req.originalUrl</code> và <code>req.url</code>: bên trong một router gắn ở <code>/api/v1/notes</code>, <code>req.url</code> là đường dẫn <em>tương đối so với chỗ gắn</em> (<code>/42</code>), còn <code>req.originalUrl</code> là đường dẫn đầy đủ mà client đã gọi. Log thì cần cái thứ hai.</div>

<h3>Middleware theo phạm vi — hình dạng của mọi chốt chặn</h3>
<pre><code><span class="tok-keyword">const</span> requireAdmin = (req, res, next) =&gt; {
  <span class="tok-keyword">if</span> (req.headers[<span class="tok-string">'x-role'</span>] !== <span class="tok-string">'admin'</span>) <span class="tok-keyword">return</span> res.<span class="tok-fn">status</span>(<span class="tok-number">403</span>).<span class="tok-fn">json</span>({ error: <span class="tok-string">'Forbidden'</span> });
  <span class="tok-fn">next</span>();
};
app.<span class="tok-fn">get</span>(<span class="tok-string">'/admin/stats'</span>, requireAdmin, (req, res) =&gt; res.json({ users: <span class="tok-number">128</span> }));</code></pre>
<div class="out">không header    → {"error":"Forbidden"}   [403]
x-role: admin   → {"users":128}           [200]</div>
<p>Mọi hệ thống xác thực và phân quyền ở chương 8 đều chính là hàm này, chỉ thay phép so sánh header bằng phép kiểm tra token thật. Để ý chữ <code>return</code> đứng trước <code>res.status(403)</code> — quy tắc của bài 5.1, ở đúng chỗ nó quan trọng nhất: thiếu nó thì một request đã bị từ chối vẫn chạy tiếp vào handler.</p>

<h3>Cú treo</h3>
<pre><code>app.<span class="tok-fn">use</span>(<span class="tok-string">'/hang'</span>, (req, res, next) =&gt; {
  console.log(<span class="tok-string">'middleware chạy, nhưng không bao giờ gọi next()'</span>);
});                                                  <span class="tok-comment">// ← không next(), không phản hồi</span>
app.<span class="tok-fn">get</span>(<span class="tok-string">'/hang'</span>, (req, res) =&gt; res.json({ reached: <span class="tok-keyword">true</span> }));</code></pre>
<pre><code>curl -m 3 /hang</code></pre>
<div class="out">server: middleware chạy, nhưng không bao giờ gọi next()
client: (im lặng suốt 3 giây)
curl exit=28   ← Operation timed out</div>
<div class="pitfall">Không lỗi, không log, không sập — server khoẻ mạnh hoàn toàn và request chỉ đơn giản là không bao giờ kết thúc. Tệ hơn, kết nối vẫn mở, nên đủ nhiều cú như vậy sẽ vắt cạn hồ kết nối và kéo sập cả API. Phiên bản hay gặp nhất ngoài đời là một middleware <code>async</code> có nhánh <code>return</code> sớm mà quên cả <code>res</code> lẫn <code>next</code>. Khi một endpoint duy nhất "treo mãi mãi" trong khi mọi thứ khác vẫn chạy, hãy đi tìm cái nhánh middleware kết thúc mà không làm cả hai việc đó.</div>
<div class="note-ct">Chồng middleware của website này, theo thứ tự: header bảo mật → CORS → giới hạn tần suất → logger → <code>express.json</code> → đọc cookie → <code>authenticate</code> (giải mã JWT vào <code>req.user</code>, KHÔNG từ chối) → các router, rồi từng route mới thêm <code>requireAuth</code> hoặc <code>requireAdmin</code>. Việc tách "giải mã token" khỏi "bắt buộc phải có token" là cố ý: nhờ đó một endpoint có thể phục vụ cả khách vãng lai lẫn người đã đăng nhập với nội dung khác nhau, mà không phải viết route hai lần.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Kiến thức cốt lõi Express.js</span><span class="lc-sub">Middleware, next() và đường ống xử lý request.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — Centralised error handling|||5.4 — Xử lý lỗi tập trung',
      slug: 'nodejs-5-4-xu-ly-loi',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-5-4-xu-ly-loi.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-5-4-xu-ly-loi.jpg',
        scenario: 'nodejs-error-handling',
        durationSeconds: 19,
        caption: { en: "Centralised error handling", vi: "Xử lý lỗi tập trung" },
      },
      type: 'VIDEO',
      description: 'Error middleware 4 tham số, lớp AppError, 404 dạng JSON, và cú treo request kinh điển của Express 4 với handler async.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Centralised error handling</h2>
<p class="lead">In lesson 3.5, a <code>throw</code> inside a handler killed the whole process — every visitor's connection died because one request hit a bad row. This lesson removes that failure mode permanently, with about twenty lines of code you will write once and never touch again.</p>

<h3>The error handler is just middleware with four arguments</h3>
<pre><code>app.<span class="tok-fn">use</span>((err, req, res, next) =&gt; {   <span class="tok-comment">// FOUR parameters — that is the signal</span>
  res.<span class="tok-fn">status</span>(<span class="tok-number">500</span>).<span class="tok-fn">json</span>({ error: <span class="tok-string">'Internal server error'</span> });
});</code></pre>
<div class="callout danger">Express decides a function is an error handler by counting its declared parameters, at registration time, using <code>fn.length</code>. Write <code>(err, req, res)</code> with three, and it silently becomes a normal middleware that never runs for errors. Omit the unused <code>next</code> and your error handling quietly disappears — with no warning at startup. If errors are "not reaching the handler", count the parameters first.</div>

<h3>How an error gets there</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">A</div><div class="lz-t">throw in sync code</div><div class="lz-d">Express catches it for you</div></div>
  <div class="lz-step"><div class="lz-k">B</div><div class="lz-t">next(err)</div><div class="lz-d">explicit — works everywhere, any version</div></div>
  <div class="lz-step"><div class="lz-k">C</div><div class="lz-t">throw in async code</div><div class="lz-d">Express 5 catches it · Express 4 does NOT</div></div>
  <div class="lz-step"><div class="lz-k">→</div><div class="lz-t">error handler</div><div class="lz-d">one place, one response shape</div></div>
</div>

<h3>Path C is the one that bites — proof</h3>
<p>The exact same two routes, run on Express 4.22.2 and on Express 5.2.1:</p>
<pre><code>app.<span class="tok-fn">get</span>(<span class="tok-string">'/sync-throw'</span>, (req, res) =&gt; {
  <span class="tok-keyword">throw new</span> Error(<span class="tok-string">'blew up in a sync handler'</span>);
});

app.<span class="tok-fn">get</span>(<span class="tok-string">'/async-throw'</span>, <span class="tok-keyword">async</span> (req, res) =&gt; {
  <span class="tok-keyword">await new</span> Promise((r) =&gt; setTimeout(r, <span class="tok-number">10</span>));
  <span class="tok-keyword">throw new</span> Error(<span class="tok-string">'blew up AFTER an await'</span>);
});</code></pre>
<p><strong>Express 4.22.2:</strong></p>
<div class="out">GET /sync-throw
  server : [error handler] caught: blew up in a sync handler
  client : {"error":"blew up in a sync handler"}   [500]

GET /async-throw
  server : !! unhandledRejection: blew up AFTER an await
  client : (nothing — 5 second timeout)
  curl exit=28,  http status = 000</div>
<p><strong>Express 5.2.1, identical code:</strong></p>
<div class="out">GET /sync-throw   → {"error":{"code":"INTERNAL","message":"…"}}   [500]
GET /async-throw  → {"error":{"code":"INTERNAL","message":"…"}}   [500]</div>
<div class="pitfall">On Express 4 the async route <strong>never answers</strong>. The client waits forever; the error only shows up as an <code>unhandledRejection</code> in the logs, disconnected from the request that caused it. Since every real route is async — you await the database — this is the single most common cause of "our API randomly hangs" in Express 4 codebases. The old fix was to wrap every handler: <code>const wrap = fn =&gt; (req, res, next) =&gt; Promise.resolve(fn(req, res, next)).catch(next);</code> — you will still see this in a lot of code, and on Express 5 you no longer need it.</div>
<div class="callout warn">Express 5 catches a rejected promise <em>returned by the handler</em>. It cannot catch an error thrown inside a callback you scheduled yourself — <code>setTimeout(() =&gt; { throw new Error('x') }, 10)</code> still crashes the process, because by the time it runs, the request's call stack is long gone. If you must throw from a callback, plumb it through <code>next(err)</code>.</div>

<h3>An error class that carries an HTTP status</h3>
<p>A raw <code>Error</code> has only a message, so the handler cannot tell "note not found" (404, the client's problem) from "database is down" (500, our problem). Give the error the two facts the HTTP layer needs:</p>
<pre><code><span class="tok-keyword">export class</span> AppError <span class="tok-keyword">extends</span> Error {
  <span class="tok-fn">constructor</span>(status, code, message) {
    <span class="tok-fn">super</span>(message);
    <span class="tok-keyword">this</span>.status = status;   <span class="tok-comment">// HTTP status</span>
    <span class="tok-keyword">this</span>.code = code;       <span class="tok-comment">// stable machine-readable string</span>
  }
}</code></pre>
<pre><code><span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">404</span>, <span class="tok-string">'NOTE_NOT_FOUND'</span>, <span class="tok-string">'Note 42 does not exist'</span>);
<span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">422</span>, <span class="tok-string">'VALIDATION_FAILED'</span>, <span class="tok-string">'title is required'</span>);</code></pre>
<div class="out">GET /app-error   → {"error":{"code":"NOTE_NOT_FOUND","message":"Không tìm thấy ghi chú"}}   [404]
GET /next-error  → {"error":{"code":"VALIDATION_FAILED","message":"title không được để trống"}} [422]</div>
<div class="callout ok">Why both a <code>status</code> and a <code>code</code>? The status is for HTTP and for proxies. The <code>code</code> is for your frontend: it can branch on <code>NOTE_NOT_FOUND</code> forever, while the human-readable message is free to change, get translated, or get rewritten by a designer. Never make a client parse the message string.</div>

<h3>The full handler</h3>
<pre><code><span class="tok-keyword">export function</span> <span class="tok-fn">errorHandler</span>(err, req, res, next) {
  <span class="tok-keyword">const</span> status = err.status || <span class="tok-number">500</span>;

  <span class="tok-comment">// 5xx = our bug: log the whole stack, we need it</span>
  <span class="tok-keyword">if</span> (status &gt;= <span class="tok-number">500</span>) console.error(<span class="tok-string">'[500]'</span>, err.stack);

  res.<span class="tok-fn">status</span>(status).<span class="tok-fn">json</span>({
    error: {
      code: err.code || <span class="tok-string">'INTERNAL'</span>,
      <span class="tok-comment">// 4xx messages are written FOR the client; 5xx messages are not</span>
      message: status &gt;= <span class="tok-number">500</span> ? <span class="tok-string">'Internal server error'</span> : err.message,
    },
  });
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Never echo a 500 message</span><span class="v">Internal messages leak table names, file paths and query fragments. Log them, do not send them.</span></div>
  <div class="kv"><span class="k">Always log 5xx with the stack</span><span class="v">A 500 you cannot reproduce is a 500 you cannot fix. 4xx are normal traffic — logging every one of them is just noise.</span></div>
  <div class="kv"><span class="k">One response shape, everywhere</span><span class="v"><code>{ error: { code, message } }</code>. The frontend writes ONE error handler instead of guessing per endpoint.</span></div>
  <div class="kv"><span class="k">Keep the 4th parameter</span><span class="v">Even unused. It is the only reason Express treats this as an error handler.</span></div>
</div>

<h3>The JSON 404 — and why order matters again</h3>
<pre><code><span class="tok-comment">// AFTER every route, BEFORE the error handler</span>
app.<span class="tok-fn">use</span>((req, res) =&gt; {
  res.<span class="tok-fn">status</span>(<span class="tok-number">404</span>).<span class="tok-fn">json</span>({
    error: { code: <span class="tok-string">'NOT_FOUND'</span>, message: \`Cannot \${req.method} \${req.path}\` },
  });
});

app.<span class="tok-fn">use</span>(errorHandler);   <span class="tok-comment">// LAST</span></code></pre>
<pre><code>curl /api/v1/khong-co</code></pre>
<div class="out">{"error":{"code":"NOT_FOUND","message":"Cannot GET /api/v1/khong-co"}}   [404]</div>
<div class="pitfall">Put these two above your routers and every request becomes a 404, because <code>app.use</code> with no path matches everything. It is the most common way to break a working app while "tidying up" the file — and the symptom (every endpoint suddenly 404s, including ones you did not touch) sends people hunting in completely the wrong place.</div>

<h3>The two errors that still kill the process</h3>
<p>Express catches errors <em>inside a request</em>. Two categories live outside any request, and both end the process by default in modern Node:</p>
<pre><code>process.<span class="tok-fn">on</span>(<span class="tok-string">'unhandledRejection'</span>, (reason) =&gt; {
  console.error(<span class="tok-string">'unhandledRejection'</span>, reason);
  process.<span class="tok-fn">exit</span>(<span class="tok-number">1</span>);        <span class="tok-comment">// log, then let the supervisor restart us</span>
});
process.<span class="tok-fn">on</span>(<span class="tok-string">'uncaughtException'</span>, (err) =&gt; {
  console.error(<span class="tok-string">'uncaughtException'</span>, err);
  process.<span class="tok-fn">exit</span>(<span class="tok-number">1</span>);
});</code></pre>
<div class="callout warn">Note what these handlers do <strong>not</strong> do: keep running. After an uncaught exception the process state is unknown — a half-finished transaction, a released lock, a corrupted module-level cache. Log it and exit; let Docker or systemd start a clean process. A server that "survives" an uncaught exception is a server quietly serving wrong data. This is exactly why lesson 1.4 spent time on <code>unhandledRejection</code>.</div>

<h3>Where validation errors come from</h3>
<p>Most 4xx responses in a real API are not thrown by you — they come from a library. The pattern is always the same: catch a known error type, convert it to your shape.</p>
<pre><code>app.<span class="tok-fn">use</span>((err, req, res, next) =&gt; {
  <span class="tok-comment">// body-parser's malformed-JSON error</span>
  <span class="tok-keyword">if</span> (err.type === <span class="tok-string">'entity.parse.failed'</span>)
    err = <span class="tok-keyword">new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">400</span>, <span class="tok-string">'INVALID_JSON'</span>, <span class="tok-string">'Request body is not valid JSON'</span>);
  <span class="tok-comment">// body too large</span>
  <span class="tok-keyword">if</span> (err.type === <span class="tok-string">'entity.too.large'</span>)
    err = <span class="tok-keyword">new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">413</span>, <span class="tok-string">'PAYLOAD_TOO_LARGE'</span>, <span class="tok-string">'Request body is too large'</span>);
  <span class="tok-comment">// … then the generic handling below</span>
});</code></pre>
<p>Chapter 7 adds Prisma's <code>P2002</code> (unique constraint) → 409 Conflict, and chapter 8 adds JWT's <code>TokenExpiredError</code> → 401. They all plug into this one function, which is the entire point of centralising.</p>
<div class="note-ct">This site's error handler does exactly the above and one thing more: it attaches a short request id to every 5xx, logs it beside the stack, and returns it in the response. When someone reports "it failed", the id in their screenshot finds the exact stack trace in the logs in one grep — instead of guessing which of four hundred 500s that day was theirs.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Express.js Core Concepts</span><span class="lc-sub">Error middleware and response shapes, with exercises.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Xử lý lỗi tập trung</h2>
<p class="lead">Ở bài 3.5, một câu <code>throw</code> trong handler giết cả tiến trình — kết nối của mọi người dùng chết theo chỉ vì một request đụng phải một bản ghi hỏng. Bài này xoá vĩnh viễn kiểu hỏng đó, bằng khoảng hai mươi dòng code bạn viết một lần rồi không bao giờ đụng lại.</p>

<h3>Error handler chỉ là middleware có bốn tham số</h3>
<pre><code>app.<span class="tok-fn">use</span>((err, req, res, next) =&gt; {   <span class="tok-comment">// BỐN tham số — đó chính là tín hiệu</span>
  res.<span class="tok-fn">status</span>(<span class="tok-number">500</span>).<span class="tok-fn">json</span>({ error: <span class="tok-string">'Lỗi hệ thống'</span> });
});</code></pre>
<div class="callout danger">Express xác định một hàm có phải error handler hay không bằng cách <strong>đếm số tham số khai báo</strong>, ngay lúc đăng ký, qua <code>fn.length</code>. Viết <code>(err, req, res)</code> ba tham số thì nó lặng lẽ trở thành middleware thường và không bao giờ chạy cho lỗi. Bỏ cái <code>next</code> không dùng đi là toàn bộ phần xử lý lỗi của bạn biến mất — mà không có cảnh báo nào lúc khởi động. Nếu lỗi "không tới được handler", việc đầu tiên là đếm tham số.</div>

<h3>Lỗi đi tới đó bằng đường nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">A</div><div class="lz-t">throw trong code đồng bộ</div><div class="lz-d">Express tự bắt giúp bạn</div></div>
  <div class="lz-step"><div class="lz-k">B</div><div class="lz-t">next(err)</div><div class="lz-d">tường minh — chạy ở mọi nơi, mọi phiên bản</div></div>
  <div class="lz-step"><div class="lz-k">C</div><div class="lz-t">throw trong code async</div><div class="lz-d">Express 5 bắt được · Express 4 thì KHÔNG</div></div>
  <div class="lz-step"><div class="lz-k">→</div><div class="lz-t">error handler</div><div class="lz-d">một chỗ, một hình dạng phản hồi</div></div>
</div>

<h3>Đường C mới là đường cắn người — bằng chứng</h3>
<p>Y hệt hai route đó, chạy trên Express 4.22.2 và trên Express 5.2.1:</p>
<pre><code>app.<span class="tok-fn">get</span>(<span class="tok-string">'/sync-throw'</span>, (req, res) =&gt; {
  <span class="tok-keyword">throw new</span> Error(<span class="tok-string">'nổ ở handler đồng bộ'</span>);
});

app.<span class="tok-fn">get</span>(<span class="tok-string">'/async-throw'</span>, <span class="tok-keyword">async</span> (req, res) =&gt; {
  <span class="tok-keyword">await new</span> Promise((r) =&gt; setTimeout(r, <span class="tok-number">10</span>));
  <span class="tok-keyword">throw new</span> Error(<span class="tok-string">'nổ SAU một lệnh await'</span>);
});</code></pre>
<p><strong>Express 4.22.2:</strong></p>
<div class="out">GET /sync-throw
  server : [error handler] đã bắt được: nổ ở handler đồng bộ
  client : {"error":"nổ ở handler đồng bộ"}   [500]

GET /async-throw
  server : !! unhandledRejection: nổ SAU một lệnh await
  client : (không gì cả — hết 5 giây timeout)
  curl exit=28,  http status = 000</div>
<p><strong>Express 5.2.1, cùng một đoạn code:</strong></p>
<div class="out">GET /sync-throw   → {"error":{"code":"INTERNAL","message":"…"}}   [500]
GET /async-throw  → {"error":{"code":"INTERNAL","message":"…"}}   [500]</div>
<div class="pitfall">Trên Express 4, route async <strong>không bao giờ trả lời</strong>. Client chờ vô tận; lỗi chỉ hiện ra dưới dạng <code>unhandledRejection</code> trong log, tách rời khỏi request đã gây ra nó. Mà mọi route thật đều là async — vì bạn phải await cơ sở dữ liệu — nên đây là nguyên nhân số một của câu than "API của bọn tôi thỉnh thoảng treo" trong các code base Express 4. Cách chữa ngày xưa là bọc mọi handler: <code>const wrap = fn =&gt; (req, res, next) =&gt; Promise.resolve(fn(req, res, next)).catch(next);</code> — bạn vẫn sẽ thấy nó trong rất nhiều code, và trên Express 5 thì không cần nữa.</div>
<div class="callout warn">Express 5 bắt được promise bị từ chối <em>do handler trả về</em>. Nó KHÔNG bắt được lỗi ném ra bên trong một callback do chính bạn hẹn giờ — <code>setTimeout(() =&gt; { throw new Error('x') }, 10)</code> vẫn làm sập tiến trình, vì lúc nó chạy thì ngăn xếp của request đã tan từ lâu. Nếu buộc phải ném từ trong callback, hãy dẫn nó ra bằng <code>next(err)</code>.</div>

<h3>Một lớp lỗi mang theo mã HTTP</h3>
<p>Một <code>Error</code> trần chỉ có message, nên handler không thể phân biệt "không tìm thấy ghi chú" (404, lỗi của client) với "cơ sở dữ liệu sập" (500, lỗi của ta). Hãy gắn vào lỗi đúng hai dữ kiện mà tầng HTTP cần:</p>
<pre><code><span class="tok-keyword">export class</span> AppError <span class="tok-keyword">extends</span> Error {
  <span class="tok-fn">constructor</span>(status, code, message) {
    <span class="tok-fn">super</span>(message);
    <span class="tok-keyword">this</span>.status = status;   <span class="tok-comment">// mã trạng thái HTTP</span>
    <span class="tok-keyword">this</span>.code = code;       <span class="tok-comment">// chuỗi ổn định cho máy đọc</span>
  }
}</code></pre>
<pre><code><span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">404</span>, <span class="tok-string">'NOTE_NOT_FOUND'</span>, <span class="tok-string">'Không tìm thấy ghi chú'</span>);
<span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">422</span>, <span class="tok-string">'VALIDATION_FAILED'</span>, <span class="tok-string">'title không được để trống'</span>);</code></pre>
<div class="out">GET /app-error   → {"error":{"code":"NOTE_NOT_FOUND","message":"Không tìm thấy ghi chú"}}   [404]
GET /next-error  → {"error":{"code":"VALIDATION_FAILED","message":"title không được để trống"}} [422]</div>
<div class="callout ok">Vì sao cần cả <code>status</code> lẫn <code>code</code>? Mã trạng thái dành cho HTTP và cho các proxy. Còn <code>code</code> dành cho frontend của bạn: nó có thể rẽ nhánh theo <code>NOTE_NOT_FOUND</code> mãi mãi, trong khi câu chữ dành cho người đọc thì được tự do thay đổi, được dịch, hoặc bị người thiết kế viết lại. Đừng bao giờ bắt client phải bóc tách chuỗi message.</div>

<h3>Bản handler đầy đủ</h3>
<pre><code><span class="tok-keyword">export function</span> <span class="tok-fn">errorHandler</span>(err, req, res, next) {
  <span class="tok-keyword">const</span> status = err.status || <span class="tok-number">500</span>;

  <span class="tok-comment">// 5xx = bug của mình: ghi cả stack, ta cần nó</span>
  <span class="tok-keyword">if</span> (status &gt;= <span class="tok-number">500</span>) console.error(<span class="tok-string">'[500]'</span>, err.stack);

  res.<span class="tok-fn">status</span>(status).<span class="tok-fn">json</span>({
    error: {
      code: err.code || <span class="tok-string">'INTERNAL'</span>,
      <span class="tok-comment">// message của 4xx viết CHO client; của 5xx thì không</span>
      message: status &gt;= <span class="tok-number">500</span> ? <span class="tok-string">'Lỗi hệ thống'</span> : err.message,
    },
  });
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Đừng bao giờ trả nguyên message của 500</span><span class="v">Message nội bộ để lộ tên bảng, đường dẫn file và mảnh câu truy vấn. Hãy ghi log, đừng gửi đi.</span></div>
  <div class="kv"><span class="k">Luôn log 5xx kèm stack</span><span class="v">Một lỗi 500 không tái hiện được là một lỗi 500 không sửa được. Còn 4xx là lưu lượng bình thường — log hết chỉ tổ ồn.</span></div>
  <div class="kv"><span class="k">Một hình dạng phản hồi, ở mọi nơi</span><span class="v"><code>{ error: { code, message } }</code>. Frontend viết MỘT chỗ bắt lỗi thay vì đoán mò theo từng endpoint.</span></div>
  <div class="kv"><span class="k">Giữ tham số thứ tư</span><span class="v">Kể cả khi không dùng. Đó là lý do duy nhất khiến Express coi hàm này là error handler.</span></div>
</div>

<h3>404 dạng JSON — và một lần nữa, thứ tự quyết định</h3>
<pre><code><span class="tok-comment">// SAU mọi route, TRƯỚC error handler</span>
app.<span class="tok-fn">use</span>((req, res) =&gt; {
  res.<span class="tok-fn">status</span>(<span class="tok-number">404</span>).<span class="tok-fn">json</span>({
    error: { code: <span class="tok-string">'NOT_FOUND'</span>, message: \`Cannot \${req.method} \${req.path}\` },
  });
});

app.<span class="tok-fn">use</span>(errorHandler);   <span class="tok-comment">// CUỐI CÙNG</span></code></pre>
<pre><code>curl /api/v1/khong-co</code></pre>
<div class="out">{"error":{"code":"NOT_FOUND","message":"Cannot GET /api/v1/khong-co"}}   [404]</div>
<div class="pitfall">Đặt hai thứ này lên trên các router thì mọi request đều thành 404, vì <code>app.use</code> không kèm đường dẫn sẽ khớp tất cả. Đây là cách phổ biến nhất để làm hỏng một ứng dụng đang chạy ngon trong lúc "dọn dẹp cho gọn file" — và triệu chứng của nó (mọi endpoint bỗng dưng 404, kể cả những cái bạn không hề đụng vào) đẩy người ta đi tìm nguyên nhân ở nơi hoàn toàn sai.</div>

<h3>Hai loại lỗi vẫn giết được tiến trình</h3>
<p>Express bắt lỗi <em>bên trong một request</em>. Có hai loại nằm ngoài mọi request, và trong Node hiện đại thì mặc định cả hai đều kết liễu tiến trình:</p>
<pre><code>process.<span class="tok-fn">on</span>(<span class="tok-string">'unhandledRejection'</span>, (reason) =&gt; {
  console.error(<span class="tok-string">'unhandledRejection'</span>, reason);
  process.<span class="tok-fn">exit</span>(<span class="tok-number">1</span>);        <span class="tok-comment">// ghi log, rồi để bộ giám sát khởi động lại</span>
});
process.<span class="tok-fn">on</span>(<span class="tok-string">'uncaughtException'</span>, (err) =&gt; {
  console.error(<span class="tok-string">'uncaughtException'</span>, err);
  process.<span class="tok-fn">exit</span>(<span class="tok-number">1</span>);
});</code></pre>
<div class="callout warn">Hãy để ý điều mà hai handler này <strong>không</strong> làm: chạy tiếp. Sau một ngoại lệ không bắt được, trạng thái tiến trình là không xác định — một giao dịch dở dang, một khoá đã nhả, một bộ nhớ đệm cấp module bị sai. Hãy ghi log rồi thoát; để Docker hoặc systemd dựng lên một tiến trình sạch. Một server "sống sót" qua ngoại lệ không bắt được là một server đang lặng lẽ phục vụ dữ liệu sai. Đây đúng là lý do bài 1.4 đã dành thời gian cho <code>unhandledRejection</code>.</div>

<h3>Lỗi kiểm tra dữ liệu đến từ đâu</h3>
<p>Phần lớn phản hồi 4xx trong một API thật không do bạn ném ra — chúng đến từ thư viện. Khuôn mẫu luôn giống nhau: bắt một loại lỗi đã biết, đổi nó sang hình dạng của mình.</p>
<pre><code>app.<span class="tok-fn">use</span>((err, req, res, next) =&gt; {
  <span class="tok-comment">// lỗi JSON hỏng của body-parser</span>
  <span class="tok-keyword">if</span> (err.type === <span class="tok-string">'entity.parse.failed'</span>)
    err = <span class="tok-keyword">new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">400</span>, <span class="tok-string">'INVALID_JSON'</span>, <span class="tok-string">'Body của request không phải JSON hợp lệ'</span>);
  <span class="tok-comment">// body quá lớn</span>
  <span class="tok-keyword">if</span> (err.type === <span class="tok-string">'entity.too.large'</span>)
    err = <span class="tok-keyword">new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">413</span>, <span class="tok-string">'PAYLOAD_TOO_LARGE'</span>, <span class="tok-string">'Body của request quá lớn'</span>);
  <span class="tok-comment">// … rồi tới phần xử lý chung bên dưới</span>
});</code></pre>
<p>Chương 7 sẽ thêm mã <code>P2002</code> của Prisma (vi phạm ràng buộc duy nhất) → 409 Conflict, chương 8 thêm <code>TokenExpiredError</code> của JWT → 401. Tất cả đều cắm vào đúng một hàm này, và đó chính là toàn bộ ý nghĩa của chữ "tập trung".</p>
<div class="note-ct">Error handler của website này làm đúng những việc trên, cộng thêm một việc nữa: gắn một mã request ngắn vào mọi lỗi 5xx, ghi mã đó cạnh stack trong log và trả nó về trong phản hồi. Khi ai đó báo "nó lỗi rồi", cái mã trong ảnh chụp màn hình của họ tìm ra đúng stack trace trong log chỉ bằng một lệnh grep — thay vì phải đoán xem trong bốn trăm lỗi 500 hôm đó thì cái nào là của họ.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Kiến thức cốt lõi Express.js</span><span class="lc-sub">Middleware xử lý lỗi và hình dạng phản hồi, kèm bài tập.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — Assembling the Notes API|||5.5 — Ráp thành Notes API hoàn chỉnh',
      slug: 'nodejs-5-5-notes-api',
      type: 'VIDEO',
      description: 'Cấu trúc thư mục theo tầng, đủ 5 route CRUD chạy thật, tách app khỏi server để test được, và tắt server đúng cách.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Assembling the Notes API</h2>
<p class="lead">Everything from this chapter, in one working application — the project we introduced in lesson 0.4. It stores notes in memory for now; chapter 7 swaps that for PostgreSQL by changing exactly one file, which is the point of the structure below.</p>

<h3>The file layout</h3>
<pre><code>src/
├── index.mjs                  ← starts the server, handles signals
├── app.mjs                    ← builds the Express app (no listen!)
├── routes/
│   └── notes.routes.mjs       ← HTTP: paths, status codes, validation
├── services/
│   └── notes.service.mjs      ← business rules, zero HTTP knowledge
└── middleware/
    ├── errors.mjs             ← AppError, notFound, errorHandler
    └── logger.mjs             ← request logger</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">index.mjs</span><span class="lz-lnote">process concerns: port, signals, shutdown</span></div>
  <div class="lz-layer"><span class="lz-lname">app.mjs</span><span class="lz-lnote">wiring: middleware order, mount points</span></div>
  <div class="lz-layer"><span class="lz-lname">routes/</span><span class="lz-lnote">HTTP translation: params in, status codes out</span></div>
  <div class="lz-layer"><span class="lz-lname">services/</span><span class="lz-lnote">the actual rules — no req, no res</span></div>
</div>
<div class="callout ok">The one rule that keeps this honest: <strong>a service file never imports <code>req</code> or <code>res</code></strong>. If a service needs the user id, it takes a <code>userId</code> argument. That single restriction is what lets you call the same function from a route, a background job (chapter 13) and a test (chapter 14) without a fake HTTP request.</div>

<h3>app.mjs — the wiring, in order</h3>
<pre><code><span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> notesRouter <span class="tok-keyword">from</span> <span class="tok-string">'./routes/notes.routes.mjs'</span>;
<span class="tok-keyword">import</span> { notFound, errorHandler } <span class="tok-keyword">from</span> <span class="tok-string">'./middleware/errors.mjs'</span>;
<span class="tok-keyword">import</span> { requestLogger } <span class="tok-keyword">from</span> <span class="tok-string">'./middleware/logger.mjs'</span>;

<span class="tok-keyword">export function</span> <span class="tok-fn">createApp</span>() {
  <span class="tok-keyword">const</span> app = <span class="tok-fn">express</span>();
  app.<span class="tok-fn">disable</span>(<span class="tok-string">'x-powered-by'</span>);                    <span class="tok-comment">// stop advertising the stack</span>
  app.<span class="tok-fn">use</span>(express.<span class="tok-fn">json</span>({ limit: <span class="tok-string">'100kb'</span> }));
  app.<span class="tok-fn">use</span>(requestLogger);

  app.<span class="tok-fn">get</span>(<span class="tok-string">'/health'</span>, (req, res) =&gt; res.<span class="tok-fn">json</span>({ status: <span class="tok-string">'ok'</span> }));
  app.<span class="tok-fn">use</span>(<span class="tok-string">'/api/v1/notes'</span>, notesRouter);

  app.<span class="tok-fn">use</span>(notFound);                               <span class="tok-comment">// after routes</span>
  app.<span class="tok-fn">use</span>(errorHandler);                           <span class="tok-comment">// last</span>
  <span class="tok-keyword">return</span> app;
}</code></pre>
<div class="callout"><strong>Why <code>createApp()</code> returns the app instead of listening.</strong> A function that builds an app can be called by a test with no port, no socket and no cleanup — chapter 14 does exactly that. It also means you can build two apps in one process. Any file that calls <code>app.listen()</code> at import time is a file you cannot test without starting a server.</div>

<h3>The router — HTTP, and nothing else</h3>
<pre><code><span class="tok-keyword">const</span> router = <span class="tok-fn">Router</span>();

router.<span class="tok-fn">get</span>(<span class="tok-string">'/'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> page  = Number(req.query.page ?? <span class="tok-number">1</span>);
  <span class="tok-keyword">const</span> limit = Math.<span class="tok-fn">min</span>(Number(req.query.limit ?? <span class="tok-number">10</span>), <span class="tok-number">50</span>);
  res.<span class="tok-fn">json</span>(service.<span class="tok-fn">list</span>({ page, limit, q: req.query.q }));
});

router.<span class="tok-fn">get</span>(<span class="tok-string">'/:id'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> note = service.<span class="tok-fn">get</span>(Number(req.params.id));
  <span class="tok-keyword">if</span> (!note) <span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">404</span>, <span class="tok-string">'NOTE_NOT_FOUND'</span>, \`Note \${req.params.id} does not exist\`);
  res.<span class="tok-fn">json</span>(note);
});

router.<span class="tok-fn">post</span>(<span class="tok-string">'/'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> { title, body } = req.body ?? {};
  <span class="tok-keyword">if</span> (<span class="tok-keyword">typeof</span> title !== <span class="tok-string">'string'</span> || title.<span class="tok-fn">trim</span>() === <span class="tok-string">''</span>)
    <span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">422</span>, <span class="tok-string">'VALIDATION_FAILED'</span>, <span class="tok-string">'title is required'</span>);
  <span class="tok-keyword">const</span> note = service.<span class="tok-fn">create</span>({ title: title.<span class="tok-fn">trim</span>(), body: body ?? <span class="tok-string">''</span> });
  res.<span class="tok-fn">status</span>(<span class="tok-number">201</span>).<span class="tok-fn">location</span>(\`/api/v1/notes/\${note.id}\`).<span class="tok-fn">json</span>(note);
});

router.<span class="tok-fn">patch</span>(<span class="tok-string">'/:id'</span>, (req, res) =&gt; { … });
router.<span class="tok-fn">delete</span>(<span class="tok-string">'/:id'</span>, (req, res) =&gt; {
  <span class="tok-keyword">if</span> (!service.<span class="tok-fn">remove</span>(Number(req.params.id)))
    <span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">404</span>, <span class="tok-string">'NOTE_NOT_FOUND'</span>, <span class="tok-string">'…'</span>);
  res.<span class="tok-fn">status</span>(<span class="tok-number">204</span>).<span class="tok-fn">end</span>();
});</code></pre>
<p>Notice how little is there. No try/catch — a thrown <code>AppError</code> lands in the error handler by itself (that is lesson 5.4 paying for itself). No JSON parsing — <code>express.json()</code> did it. No 404 page — <code>notFound</code> handles it. What is left is the part only you can write: which status code, which validation, which service call.</p>

<h3>Running the whole thing</h3>
<p>Every response below is real output from this exact code, captured with <code>curl</code>. The server log line is printed by the logger middleware.</p>
<pre><code>curl -i -X POST /api/v1/notes -H 'Content-Type: application/json' \\
     -d '{"title":"Learning Express","body":"chapter 5"}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /api/v1/notes/1
Content-Type: application/json; charset=utf-8

{"id":1,"title":"Learning Express","body":"chapter 5","createdAt":"2026-07-27T15:00:00.000Z"}

server log: POST /api/v1/notes 201 4.9ms</div>
<p>201 with a <code>Location</code> header pointing at the created resource — that is what "created" means in HTTP, and chapter 6 will make a habit of it. Now the same endpoint with a bad body:</p>
<pre><code>curl -X POST /api/v1/notes -H 'Content-Type: application/json' -d '{"body":"no title"}'</code></pre>
<div class="out">{"error":{"code":"VALIDATION_FAILED","message":"title is required"}}   [422]
server log: POST /api/v1/notes 422 0.9ms</div>
<pre><code>curl "/api/v1/notes?page=1&amp;limit=10"</code></pre>
<div class="out">{"items":[
   {"id":1,"title":"Learning Express","body":"chapter 5","createdAt":"…"},
   {"id":2,"title":"Second note","body":"","createdAt":"…"}
 ],"page":1,"limit":10,"total":2}</div>
<pre><code>curl "/api/v1/notes?q=express"</code></pre>
<div class="out">{"items":[{"id":1,"title":"Learning Express",…}],"page":1,"limit":10,"total":1}</div>
<pre><code>curl /api/v1/notes/999</code></pre>
<div class="out">{"error":{"code":"NOTE_NOT_FOUND","message":"Note 999 does not exist"}}   [404]</div>
<pre><code>curl -X PATCH /api/v1/notes/1 -H 'Content-Type: application/json' -d '{"body":"edited"}'
curl -X DELETE /api/v1/notes/2
curl /api/v1/khong-co</code></pre>
<div class="out">PATCH  → {"id":1,"title":"Learning Express","body":"edited",…}          [200]
DELETE → (empty body)                                                   [204]
404    → {"error":{"code":"NOT_FOUND","message":"Cannot GET /api/v1/khong-co"}}</div>
<div class="callout ok">Read the whole log column together: 201 · 422 · 200 · 200 · 404 · 200 · 204 · 404, every one under 5ms, every error the same JSON shape. That consistency is not politeness — it is what lets a frontend write one <code>catch</code> block and one loading state for an entire API.</div>

<h3>Shutting down without dropping requests</h3>
<p>Every deploy stops the old process. If you stop it wrongly, the requests in flight at that moment die with it — for a user that is a spinner that never resolves, or worse, a payment whose response never arrived.</p>
<pre><code><span class="tok-keyword">const</span> server = <span class="tok-fn">createApp</span>().<span class="tok-fn">listen</span>(PORT);

<span class="tok-keyword">function</span> <span class="tok-fn">shutdown</span>(signal) {
  console.log(\`\${signal}: no longer accepting connections, draining…\`);
  server.<span class="tok-fn">close</span>(() =&gt; {          <span class="tok-comment">// stop accepting, finish what is in flight</span>
    console.log(<span class="tok-string">'all in-flight requests done — clean exit'</span>);
    process.<span class="tok-fn">exit</span>(<span class="tok-number">0</span>);
  });
  setTimeout(() =&gt; process.<span class="tok-fn">exit</span>(<span class="tok-number">1</span>), <span class="tok-number">10_000</span>).<span class="tok-fn">unref</span>();   <span class="tok-comment">// hard cap</span>
}
process.<span class="tok-fn">on</span>(<span class="tok-string">'SIGTERM'</span>, () =&gt; <span class="tok-fn">shutdown</span>(<span class="tok-string">'SIGTERM'</span>));
process.<span class="tok-fn">on</span>(<span class="tok-string">'SIGINT'</span>,  () =&gt; <span class="tok-fn">shutdown</span>(<span class="tok-string">'SIGINT'</span>));</code></pre>
<p>Tested for real: a request to a route that takes 3 seconds, then <code>SIGTERM</code> half a second later.</p>
<div class="out">server: /slow started (takes 3s)
server: SIGTERM: no longer accepting connections, draining…
server: /slow responded
server: all in-flight requests done — clean exit
client: {"done":true}   [200]      ← the slow request SURVIVED
process: exited</div>
<div class="callout warn"><code>server.close()</code> stops <em>new</em> connections and waits for open ones. Note what it is not: <code>process.exit()</code> on the spot, which is what an unhandled <code>SIGTERM</code> effectively does — Docker sends SIGTERM, waits ~10 seconds, then sends SIGKILL. Without this handler every deploy silently kills whatever was in flight. The <code>unref()</code>'d timeout is the safety net for the opposite failure: a leaked keep-alive connection that would otherwise keep the process alive forever.</div>
<div class="pitfall">Under keep-alive, idle browser connections can hold <code>server.close()</code> open for seconds even with no active request. Node 18.2+ added <code>server.closeIdleConnections()</code> — call it right after <code>close()</code> to drop the idle ones while still finishing the active ones. Without it your "graceful" shutdown often ends up hitting the hard-kill timeout anyway.</div>

<h3>What this app still lacks — the rest of the course</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Data disappears on restart</span><span class="v">A <code>Map</code> in memory. Chapter 7 replaces the service internals with PostgreSQL + Prisma — the router does not change.</span></div>
  <div class="kv"><span class="k">Validation is hand-written</span><span class="v">Chapter 6 introduces a schema validator so rules are declared once and errors are consistent.</span></div>
  <div class="kv"><span class="k">Everybody sees every note</span><span class="v">Chapter 8 adds users, JWT and ownership checks.</span></div>
  <div class="kv"><span class="k">Nothing is tested</span><span class="v">Chapter 14 tests <code>createApp()</code> without opening a port — the reason it is a function.</span></div>
</div>
<div class="note-ct">This exact skeleton — <code>index</code> / <code>app</code> / <code>routes</code> / <code>services</code> / <code>middleware</code> — is the shape of the backend running cuongthai.com, and the deliberate boundary is the same one drawn above: routes speak HTTP, services speak business. The times that boundary got blurred (a service reaching for <code>req.user</code>, a route running a query directly) are exactly the files that later became painful to test and to reuse from a background job.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Express.js Core Concepts</span><span class="lc-sub">Build and structure a full Express application.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Ráp thành Notes API hoàn chỉnh</h2>
<p class="lead">Tất cả những gì có trong chương này, gộp lại thành một ứng dụng chạy được — chính là dự án đã giới thiệu ở bài 0.4. Tạm thời nó lưu ghi chú trong bộ nhớ; chương 7 sẽ đổi sang PostgreSQL bằng cách sửa đúng một file, và đó chính là lý do tồn tại của cấu trúc dưới đây.</p>

<h3>Bố cục thư mục</h3>
<pre><code>src/
├── index.mjs                  ← khởi động server, xử lý tín hiệu
├── app.mjs                    ← dựng ứng dụng Express (KHÔNG listen!)
├── routes/
│   └── notes.routes.mjs       ← HTTP: đường dẫn, mã trạng thái, kiểm tra dữ liệu
├── services/
│   └── notes.service.mjs      ← nghiệp vụ, không biết gì về HTTP
└── middleware/
    ├── errors.mjs             ← AppError, notFound, errorHandler
    └── logger.mjs             ← logger cho request</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">index.mjs</span><span class="lz-lnote">việc của tiến trình: cổng, tín hiệu, tắt máy</span></div>
  <div class="lz-layer"><span class="lz-lname">app.mjs</span><span class="lz-lnote">lắp ráp: thứ tự middleware, chỗ gắn router</span></div>
  <div class="lz-layer"><span class="lz-lname">routes/</span><span class="lz-lnote">phiên dịch HTTP: nhận tham số, trả mã trạng thái</span></div>
  <div class="lz-layer"><span class="lz-lname">services/</span><span class="lz-lnote">luật nghiệp vụ thật — không req, không res</span></div>
</div>
<div class="callout ok">Một quy tắc duy nhất giữ cho cấu trúc này trung thực: <strong>file service không bao giờ đụng tới <code>req</code> hay <code>res</code></strong>. Nếu service cần id người dùng, nó nhận một tham số <code>userId</code>. Đúng một ràng buộc đó cho phép bạn gọi cùng một hàm từ route, từ một tác vụ nền (chương 13) và từ một bài test (chương 14) mà không cần dựng request HTTP giả.</div>

<h3>app.mjs — phần lắp ráp, theo đúng thứ tự</h3>
<pre><code><span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">import</span> notesRouter <span class="tok-keyword">from</span> <span class="tok-string">'./routes/notes.routes.mjs'</span>;
<span class="tok-keyword">import</span> { notFound, errorHandler } <span class="tok-keyword">from</span> <span class="tok-string">'./middleware/errors.mjs'</span>;
<span class="tok-keyword">import</span> { requestLogger } <span class="tok-keyword">from</span> <span class="tok-string">'./middleware/logger.mjs'</span>;

<span class="tok-keyword">export function</span> <span class="tok-fn">createApp</span>() {
  <span class="tok-keyword">const</span> app = <span class="tok-fn">express</span>();
  app.<span class="tok-fn">disable</span>(<span class="tok-string">'x-powered-by'</span>);                    <span class="tok-comment">// thôi quảng cáo mình chạy bằng gì</span>
  app.<span class="tok-fn">use</span>(express.<span class="tok-fn">json</span>({ limit: <span class="tok-string">'100kb'</span> }));
  app.<span class="tok-fn">use</span>(requestLogger);

  app.<span class="tok-fn">get</span>(<span class="tok-string">'/health'</span>, (req, res) =&gt; res.<span class="tok-fn">json</span>({ status: <span class="tok-string">'ok'</span> }));
  app.<span class="tok-fn">use</span>(<span class="tok-string">'/api/v1/notes'</span>, notesRouter);

  app.<span class="tok-fn">use</span>(notFound);                               <span class="tok-comment">// sau các route</span>
  app.<span class="tok-fn">use</span>(errorHandler);                           <span class="tok-comment">// cuối cùng</span>
  <span class="tok-keyword">return</span> app;
}</code></pre>
<div class="callout"><strong>Vì sao <code>createApp()</code> trả về app thay vì tự listen.</strong> Một hàm dựng app có thể được bài test gọi mà không cần cổng, không cần socket, không cần dọn dẹp — chương 14 làm đúng như vậy. Nó cũng cho phép bạn dựng hai app trong cùng một tiến trình. Còn file nào gọi <code>app.listen()</code> ngay lúc import thì đó là file bạn không thể test nếu không khởi động cả server.</div>

<h3>Router — chỉ HTTP, không gì khác</h3>
<pre><code><span class="tok-keyword">const</span> router = <span class="tok-fn">Router</span>();

router.<span class="tok-fn">get</span>(<span class="tok-string">'/'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> page  = Number(req.query.page ?? <span class="tok-number">1</span>);
  <span class="tok-keyword">const</span> limit = Math.<span class="tok-fn">min</span>(Number(req.query.limit ?? <span class="tok-number">10</span>), <span class="tok-number">50</span>);
  res.<span class="tok-fn">json</span>(service.<span class="tok-fn">list</span>({ page, limit, q: req.query.q }));
});

router.<span class="tok-fn">get</span>(<span class="tok-string">'/:id'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> note = service.<span class="tok-fn">get</span>(Number(req.params.id));
  <span class="tok-keyword">if</span> (!note) <span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">404</span>, <span class="tok-string">'NOTE_NOT_FOUND'</span>, \`Note \${req.params.id} does not exist\`);
  res.<span class="tok-fn">json</span>(note);
});

router.<span class="tok-fn">post</span>(<span class="tok-string">'/'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> { title, body } = req.body ?? {};
  <span class="tok-keyword">if</span> (<span class="tok-keyword">typeof</span> title !== <span class="tok-string">'string'</span> || title.<span class="tok-fn">trim</span>() === <span class="tok-string">''</span>)
    <span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">422</span>, <span class="tok-string">'VALIDATION_FAILED'</span>, <span class="tok-string">'title là bắt buộc'</span>);
  <span class="tok-keyword">const</span> note = service.<span class="tok-fn">create</span>({ title: title.<span class="tok-fn">trim</span>(), body: body ?? <span class="tok-string">''</span> });
  res.<span class="tok-fn">status</span>(<span class="tok-number">201</span>).<span class="tok-fn">location</span>(\`/api/v1/notes/\${note.id}\`).<span class="tok-fn">json</span>(note);
});

router.<span class="tok-fn">patch</span>(<span class="tok-string">'/:id'</span>, (req, res) =&gt; { … });
router.<span class="tok-fn">delete</span>(<span class="tok-string">'/:id'</span>, (req, res) =&gt; {
  <span class="tok-keyword">if</span> (!service.<span class="tok-fn">remove</span>(Number(req.params.id)))
    <span class="tok-keyword">throw new</span> <span class="tok-fn">AppError</span>(<span class="tok-number">404</span>, <span class="tok-string">'NOTE_NOT_FOUND'</span>, <span class="tok-string">'…'</span>);
  res.<span class="tok-fn">status</span>(<span class="tok-number">204</span>).<span class="tok-fn">end</span>();
});</code></pre>
<p>Hãy để ý xem có bao nhiêu thứ trong đó. Không try/catch — một <code>AppError</code> được ném ra sẽ tự rơi vào error handler (bài 5.4 bắt đầu sinh lời). Không phân tích JSON — <code>express.json()</code> đã làm. Không trang 404 — <code>notFound</code> lo rồi. Thứ còn lại chính là phần chỉ bạn mới viết được: chọn mã trạng thái nào, kiểm tra dữ liệu ra sao, gọi service nào.</p>

<h3>Chạy thử toàn bộ</h3>
<p>Mọi phản hồi dưới đây là output thật của đúng đoạn code này, lấy bằng <code>curl</code>. Dòng log của server do middleware logger in ra.</p>
<pre><code>curl -i -X POST /api/v1/notes -H 'Content-Type: application/json' \\
     -d '{"title":"Học Express","body":"chương 5"}'</code></pre>
<div class="out">HTTP/1.1 201 Created
Location: /api/v1/notes/1
Content-Type: application/json; charset=utf-8

{"id":1,"title":"Học Express","body":"chương 5","createdAt":"2026-07-27T15:00:00.000Z"}

log server: POST /api/v1/notes 201 4.9ms</div>
<p>201 kèm header <code>Location</code> trỏ tới tài nguyên vừa tạo — đó mới là ý nghĩa của chữ "created" trong HTTP, và chương 6 sẽ biến việc này thành thói quen. Giờ vẫn endpoint đó nhưng body sai:</p>
<pre><code>curl -X POST /api/v1/notes -H 'Content-Type: application/json' -d '{"body":"không có tiêu đề"}'</code></pre>
<div class="out">{"error":{"code":"VALIDATION_FAILED","message":"title là bắt buộc"}}   [422]
log server: POST /api/v1/notes 422 0.9ms</div>
<pre><code>curl "/api/v1/notes?page=1&amp;limit=10"</code></pre>
<div class="out">{"items":[
   {"id":1,"title":"Học Express","body":"chương 5","createdAt":"…"},
   {"id":2,"title":"Ghi chú thứ hai","body":"","createdAt":"…"}
 ],"page":1,"limit":10,"total":2}</div>
<pre><code>curl "/api/v1/notes?q=express"</code></pre>
<div class="out">{"items":[{"id":1,"title":"Học Express",…}],"page":1,"limit":10,"total":1}</div>
<pre><code>curl /api/v1/notes/999</code></pre>
<div class="out">{"error":{"code":"NOTE_NOT_FOUND","message":"Note 999 does not exist"}}   [404]</div>
<pre><code>curl -X PATCH /api/v1/notes/1 -H 'Content-Type: application/json' -d '{"body":"đã sửa"}'
curl -X DELETE /api/v1/notes/2
curl /api/v1/khong-co</code></pre>
<div class="out">PATCH  → {"id":1,"title":"Học Express","body":"đã sửa",…}               [200]
DELETE → (body rỗng)                                                    [204]
404    → {"error":{"code":"NOT_FOUND","message":"Cannot GET /api/v1/khong-co"}}</div>
<div class="callout ok">Hãy đọc cả cột log cùng lúc: 201 · 422 · 200 · 200 · 404 · 200 · 204 · 404, cái nào cũng dưới 5ms, và mọi lỗi đều chung một hình dạng JSON. Sự nhất quán đó không phải để cho đẹp — nó chính là thứ cho phép frontend viết đúng một khối <code>catch</code> và một trạng thái tải cho cả API.</div>

<h3>Tắt server mà không đánh rơi request</h3>
<p>Mỗi lần deploy đều dừng tiến trình cũ. Nếu bạn dừng sai cách, những request đang dở ngay lúc đó sẽ chết theo — với người dùng đó là cái vòng xoay quay mãi không dứt, hoặc tệ hơn, một giao dịch thanh toán không bao giờ nhận được phản hồi.</p>
<pre><code><span class="tok-keyword">const</span> server = <span class="tok-fn">createApp</span>().<span class="tok-fn">listen</span>(PORT);

<span class="tok-keyword">function</span> <span class="tok-fn">shutdown</span>(signal) {
  console.log(\`\${signal}: ngừng nhận kết nối mới, đang xả nốt…\`);
  server.<span class="tok-fn">close</span>(() =&gt; {          <span class="tok-comment">// ngừng nhận, làm nốt việc đang dở</span>
    console.log(<span class="tok-string">'mọi request đang dở đã xong — thoát sạch'</span>);
    process.<span class="tok-fn">exit</span>(<span class="tok-number">0</span>);
  });
  setTimeout(() =&gt; process.<span class="tok-fn">exit</span>(<span class="tok-number">1</span>), <span class="tok-number">10_000</span>).<span class="tok-fn">unref</span>();   <span class="tok-comment">// trần cứng</span>
}
process.<span class="tok-fn">on</span>(<span class="tok-string">'SIGTERM'</span>, () =&gt; <span class="tok-fn">shutdown</span>(<span class="tok-string">'SIGTERM'</span>));
process.<span class="tok-fn">on</span>(<span class="tok-string">'SIGINT'</span>,  () =&gt; <span class="tok-fn">shutdown</span>(<span class="tok-string">'SIGINT'</span>));</code></pre>
<p>Thử thật: gọi một route mất 3 giây, rồi nửa giây sau bắn <code>SIGTERM</code>.</p>
<div class="out">server: /slow bắt đầu (mất 3s)
server: SIGTERM: ngừng nhận kết nối mới, đang xả nốt…
server: /slow trả về xong
server: mọi request đang dở đã xong — thoát sạch
client: {"done":true}   [200]      ← request chậm SỐNG SÓT
tiến trình: đã thoát</div>
<div class="callout warn"><code>server.close()</code> chặn kết nối <em>mới</em> và chờ những kết nối đang mở. Hãy để ý nó KHÔNG phải là <code>process.exit()</code> ngay tại chỗ — mà đó lại đúng là điều xảy ra khi <code>SIGTERM</code> không được xử lý: Docker gửi SIGTERM, chờ khoảng 10 giây, rồi gửi SIGKILL. Thiếu handler này thì mỗi lần deploy đều lặng lẽ giết mọi thứ đang dở. Cái timeout có <code>unref()</code> là lưới an toàn cho kiểu hỏng ngược lại: một kết nối keep-alive bị rò khiến tiến trình sống mãi không chịu thoát.</div>
<div class="pitfall">Với keep-alive, các kết nối trình duyệt đang rảnh vẫn giữ <code>server.close()</code> treo thêm vài giây dù không còn request nào chạy. Node 18.2 trở lên có <code>server.closeIdleConnections()</code> — gọi ngay sau <code>close()</code> để cắt các kết nối rảnh mà vẫn làm nốt các kết nối đang bận. Không có nó thì cú tắt "êm ái" của bạn thường vẫn kết thúc bằng việc chạm trần thời gian rồi bị giết cứng.</div>

<h3>Ứng dụng này còn thiếu gì — phần còn lại của khoá học</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dữ liệu bay sạch khi khởi động lại</span><span class="v">Đang là một <code>Map</code> trong RAM. Chương 7 thay ruột service bằng PostgreSQL + Prisma — router không đổi một dòng.</span></div>
  <div class="kv"><span class="k">Kiểm tra dữ liệu viết tay</span><span class="v">Chương 6 đưa vào bộ kiểm theo lược đồ để luật khai báo một lần và lỗi trả về nhất quán.</span></div>
  <div class="kv"><span class="k">Ai cũng thấy ghi chú của mọi người</span><span class="v">Chương 8 thêm người dùng, JWT và kiểm tra quyền sở hữu.</span></div>
  <div class="kv"><span class="k">Chưa có test nào</span><span class="v">Chương 14 test <code>createApp()</code> mà không mở cổng nào — chính là lý do nó được viết thành hàm.</span></div>
</div>
<div class="note-ct">Đúng bộ khung này — <code>index</code> / <code>app</code> / <code>routes</code> / <code>services</code> / <code>middleware</code> — là hình dạng của backend đang chạy cuongthai.com, và ranh giới cố ý cũng chính là ranh giới vẽ ở trên: route nói tiếng HTTP, service nói tiếng nghiệp vụ. Những lần ranh giới đó bị nhoè đi (một service với tay lấy <code>req.user</code>, một route chạy thẳng câu truy vấn) đúng là những file về sau trở nên khổ sở khi muốn test hoặc muốn dùng lại từ một tác vụ nền.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-320" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 320 — Kiến thức cốt lõi Express.js</span><span class="lc-sub">Dựng và tổ chức một ứng dụng Express đầy đủ.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.6 QUIZ ─────────────────────────── */
    {
      title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra chương 5',
      slug: 'nodejs-5-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về định tuyến, middleware, xử lý lỗi và cấu trúc ứng dụng Express.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Half of these questions are about ordering — route order, middleware order, handler order. That is not an accident: in Express, order is the program. The other half are the three bugs that cost real teams real days: a hanging request, an unparsed body, and an error handler that was never an error handler.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Một nửa số câu ở đây nói về thứ tự — thứ tự route, thứ tự middleware, thứ tự handler. Đó không phải ngẫu nhiên: trong Express, thứ tự chính là chương trình. Nửa còn lại là ba con bug từng ngốn của những đội thật những ngày làm việc thật: một request bị treo, một body không được phân tích, và một error handler chưa từng là error handler.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You declare app.get("/notes/:id") BEFORE app.get("/notes/new"). What does GET /notes/new return?|||Bạn khai báo app.get("/notes/:id") TRƯỚC app.get("/notes/new"). Vậy GET /notes/new trả về gì?',
            options: [
              'The "new" handler — Express prefers exact matches|||Handler "new" — Express ưu tiên khớp chính xác',
              'The ":id" handler, with params.id === "new"|||Handler ":id", với params.id === "new"',
              'A 404, because two routes conflict|||Lỗi 404, vì hai route xung đột nhau',
              'An error at startup about duplicate routes|||Một lỗi lúc khởi động báo route bị trùng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A middleware runs, logs a line, and neither responds nor calls next(). What does the client see?|||Một middleware chạy, in ra một dòng log, rồi không phản hồi cũng không gọi next(). Client nhận được gì?',
            options: [
              'A 500 error|||Một lỗi 500',
              'A 404 from the fallback handler|||Một lỗi 404 từ handler dự phòng',
              'Nothing — the request hangs until the client times out|||Không gì cả — request treo cho tới khi client hết giờ chờ',
              'The next matching route runs automatically|||Route khớp kế tiếp tự động chạy',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'req.body is undefined in your POST handler. Which is NOT one of the three usual causes?|||req.body bị undefined trong handler POST của bạn. Điều nào KHÔNG nằm trong ba nguyên nhân thường gặp?',
            options: [
              'express.json() was never registered|||Chưa hề đăng ký express.json()',
              'The route was registered above express.json()|||Route được đăng ký phía trên express.json()',
              'The client did not send Content-Type: application/json|||Client không gửi Content-Type: application/json',
              'The body is larger than 100kb|||Body lớn hơn 100kb',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'How does Express recognise a function as an error handler?|||Express nhận ra một hàm là error handler bằng cách nào?',
            options: [
              'It is registered with app.error()|||Nó được đăng ký bằng app.error()',
              'It declares exactly FOUR parameters (err, req, res, next)|||Nó khai báo đúng BỐN tham số (err, req, res, next)',
              'Its first parameter is named "err"|||Tham số đầu tiên của nó tên là "err"',
              'It is the last middleware in the file|||Nó là middleware cuối cùng trong file',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An async handler throws after an await. What happens on Express 4 vs Express 5?|||Một handler async ném lỗi sau lệnh await. Express 4 và Express 5 xử lý khác nhau thế nào?',
            options: [
              'Both send 500 through the error handler|||Cả hai đều trả 500 qua error handler',
              'Express 4 hangs the request (unhandledRejection); Express 5 forwards it to the error handler|||Express 4 làm treo request (unhandledRejection); Express 5 chuyển nó tới error handler',
              'Both crash the process immediately|||Cả hai đều làm sập tiến trình ngay lập tức',
              'Express 4 sends 500; Express 5 hangs|||Express 4 trả 500; Express 5 thì treo',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Where must the JSON 404 handler and the error handler be registered?|||Handler 404 dạng JSON và error handler phải được đăng ký ở đâu?',
            options: [
              'At the very top, before any route|||Trên cùng, trước mọi route',
              'Anywhere — Express sorts them by type|||Chỗ nào cũng được — Express tự sắp theo loại',
              'After every route: 404 first, error handler last|||Sau mọi route: 404 trước, error handler cuối cùng',
              'Inside each router file|||Bên trong từng file router',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Why should the error handler NOT return err.message to the client for a 500?|||Vì sao error handler KHÔNG nên trả err.message về cho client khi lỗi 500?',
            options: [
              'It would be too slow|||Vì như vậy sẽ chậm',
              'Internal messages leak file paths, table names and query fragments|||Message nội bộ để lộ đường dẫn file, tên bảng và mảnh câu truy vấn',
              'Express forbids it|||Express cấm điều đó',
              'The message is always empty for 500s|||Message của lỗi 500 luôn rỗng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does app.mjs export createApp() instead of calling app.listen() itself?|||Vì sao app.mjs xuất ra createApp() thay vì tự gọi app.listen()?',
            options: [
              'It makes the server start faster|||Vì như vậy server khởi động nhanh hơn',
              'So tests can build the app with no port, no socket and no cleanup|||Để bài test dựng được app mà không cần cổng, không cần socket, không phải dọn dẹp',
              'Express requires it in version 5|||Express 5 bắt buộc phải làm vậy',
              'It reduces the number of dependencies|||Vì nó giảm số phụ thuộc',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
