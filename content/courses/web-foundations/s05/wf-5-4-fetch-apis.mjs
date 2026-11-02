/**
 * Bài 5.4 — fetch và API (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/5-4; _demo/_t5/chay.mjs: API Node thật
 * cho POST/400/timeout). Deck: scripts/slides-src/wf-5-4.mjs (10 slide, WF/v1/wf-5-4). Code Lab: module 5.4 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-5-4', 'fetch and APIs', 'fetch và API', [
  [1, 'fetch and APIs',
    '<p>Until now our data lived inside the page. Real pages get their data from a server: products, posts, the logged-in user. <code>fetch</code> is the browser’s built-in way to send an HTTP request from JavaScript and read the response, without reloading the page.</p>',
    '<p>Tới giờ dữ liệu của ta nằm sẵn trong trang. Trang thật lấy dữ liệu từ máy chủ: sản phẩm, bài viết, người dùng đang đăng nhập. <code>fetch</code> là cách có sẵn của trình duyệt để gửi request HTTP từ JavaScript và đọc response, mà không tải lại trang.</p>'],
  [2, 'After this lesson you can…',
    '<p>The most important outcome is the third. <code>fetch</code> does not treat a 404 or a 500 as an error, so code that only has a <code>catch</code> happily shows nothing, or crashes later. Checking <code>res.ok</code> is the habit that prevents it.</p>',
    '<p>Kết quả quan trọng nhất là điều thứ ba. <code>fetch</code> không coi 404 hay 500 là lỗi, nên mã chỉ có <code>catch</code> sẽ vui vẻ hiện ra chẳng gì cả, hoặc sập về sau. Kiểm <code>res.ok</code> là thói quen ngăn được điều đó.</p>'],
  [3, 'Two awaits',
    '<p>A fetch arrives in two stages. The first <code>await</code> gives you the response as soon as the status and headers arrive. The body is read separately, with a second <code>await</code>, here as JSON. The output shows the status, the content type and the parsed data.</p>',
    '<p>Một lần fetch tới theo hai đợt. <code>await</code> đầu cho bạn response ngay khi mã trạng thái và header tới. Phần thân được đọc riêng, bằng <code>await</code> thứ hai, ở đây là JSON. Output cho thấy mã trạng thái, kiểu nội dung và dữ liệu đã phân tích.</p>'],
  [4, 'fetch does not throw on 404',
    '<p>Three failures, three behaviours. A 404 resolves normally, with <code>ok</code> false. Reading its HTML error page as JSON throws a SyntaxError. Only a real network failure, such as no server at all, rejects the promise. So the error check has to be written by you.</p>',
    '<p>Ba lỗi, ba cách cư xử. Một 404 vẫn resolve bình thường, với <code>ok</code> là false. Đọc trang lỗi HTML của nó như JSON thì ném SyntaxError. Chỉ có lỗi mạng thật, như hoàn toàn không có máy chủ, mới làm promise thất bại. Vì vậy phép kiểm lỗi phải do bạn tự viết.</p>'],
  [5, 'The four states of loading',
    '<p>Every piece of UI that fetches data has four states: loading, success, empty and error. Here all four are handled: a loading message, a check of <code>res.ok</code>, an empty-list message and a visible error. User text goes in with <code>textContent</code>.</p>',
    '<p>Mọi phần giao diện có tải dữ liệu đều có bốn trạng thái: đang tải, thành công, rỗng và lỗi. Ở đây cả bốn đều được xử lý: thông báo đang tải, kiểm <code>res.ok</code>, thông báo danh sách rỗng và một lỗi nhìn thấy được. Chữ người dùng được chèn bằng <code>textContent</code>.</p>'],
  [6, 'Sending data with POST',
    '<p>A real Node server received three requests. With a JSON string and the right header it answered 201 Created. Forgetting <code>JSON.stringify</code> sent the text "object Object", and the server rejected it with 400. So did a body without the required title.</p>',
    '<p>Một máy chủ Node thật nhận ba request. Với chuỗi JSON và header đúng, nó trả 201 Created. Quên <code>JSON.stringify</code> thì gửi đi chữ "object Object", và máy chủ từ chối với 400. Một phần thân thiếu tiêu đề bắt buộc cũng vậy.</p>'],
  [7, 'Timeouts',
    '<p>By default, fetch waits as long as the network allows, which can be minutes. <code>AbortSignal.timeout</code> gives up after the time you choose: here a two-second endpoint was abandoned after half a second with a TimeoutError, so the page can show a message instead of spinning for ever.</p>',
    '<p>Mặc định, fetch chờ lâu bao nhiêu mạng cho phép, có khi vài phút. <code>AbortSignal.timeout</code> bỏ cuộc sau khoảng thời gian bạn chọn: ở đây một endpoint hai giây bị bỏ sau nửa giây với TimeoutError, để trang hiện được thông báo thay vì quay mãi.</p>'],
  [8, 'A small API helper',
    '<p>Rather than repeating the same checks in every call, write one helper: it sends JSON, checks <code>res.ok</code>, reads the server’s error message, and applies a timeout. Every request in your app goes through it. Libraries like axios do the same thing.</p>',
    '<p>Thay vì lặp lại cùng các phép kiểm ở mọi lời gọi, hãy viết một hàm trợ giúp: nó gửi JSON, kiểm <code>res.ok</code>, đọc thông báo lỗi của máy chủ, và áp dụng giới hạn thời gian. Mọi request trong ứng dụng đều đi qua nó. Thư viện như axios làm đúng việc này.</p>'],
  [9, 'Watch it in the Network tab',
    '<p>DevTools shows every fetch: method, status, timing, request headers and payload, and the response body. When something does not work, look there first: you will see whether the request left, what was sent, and what the server answered.</p>',
    '<p>DevTools hiện mọi lần fetch: method, mã trạng thái, thời gian, header và payload của request, cùng phần thân response. Khi có gì không chạy, hãy nhìn ở đó trước: bạn sẽ thấy request có đi không, đã gửi gì, và máy chủ trả lời gì.</p>'],
  [10, 'Summary & practice',
    '<p>The practice builds a small page against a free public API with all four states and a timeout. "Done when" includes forcing an error in DevTools to prove that the error state really appears.</p>',
    '<p>Bài luyện dựng một trang nhỏ dùng một API công khai miễn phí, có đủ bốn trạng thái và giới hạn thời gian. "Xong khi" gồm việc ép lỗi trong DevTools để chứng minh trạng thái lỗi thật sự hiện ra.</p>'],
]);

export default {
  title: '5.4 — fetch: getting data from an API|||5.4 — fetch: lấy dữ liệu từ API',
  slug: 'wf-5-4-fetch-apis',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/cuEtnrL9-H0', durationSeconds: 0 },
  description: 'fetch hai lần await (response rồi body), fetch không ném lỗi khi 404 (đo thật: ok=false, SyntaxError khi đọc JSON, chỉ lỗi mạng mới reject), bốn trạng thái tải, POST JSON tới máy chủ Node thật (201, 400 khi quên stringify), AbortSignal.timeout, hàm trợ giúp API, thẻ Network.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Asking a server for data, and handling every answer</h2>
<p class="lead">After this lesson you can load JSON from an API with <code>fetch</code>, read the status and the body, treat HTTP errors as errors, show loading, empty and error states, send data with POST, stop a request that takes too long, and debug requests in the Network tab. You need this because almost every page you will build gets its data from a server, and the most common front-end bugs — a blank page, a spinner that never stops, an "undefined" in the UI — come from handling only the happy case.</p>

<h3>Step 1 — a GET request, in two awaits</h3>
${ma('html', CODE['5-4/fetch-co-ban.html'], [6, 16])}
${ra(OUT['5-4/fetch-co-ban'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">fetch(url)</span><span class="lz-d">Sends a GET request (Lesson 0.2). Returns a promise immediately.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">await → Response</span><span class="lz-d">Arrives when the status and headers arrive: <code>res.status</code>, <code>res.ok</code>, <code>res.headers</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">await res.json()</span><span class="lz-d">Reads the whole body and parses it as JSON (Lesson 4.4). Also <code>res.text()</code>, <code>res.blob()</code>.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Use the data</span><span class="lz-d">Normal arrays and objects: sort, filter, render.</span></div>
</div>
<p>The body can be large and arrives in pieces, which is why reading it is a separate, asynchronous step. You can read the body only once: calling <code>res.json()</code> twice throws.</p>
<p>The URL here is relative, so it is requested from the same server as the page. For another server you write the full address, and that server must allow it (CORS, Lesson 7.5).</p>

<h3>Step 2 — <code>fetch</code> does not throw on 404</h3>
${ma('html', CODE['5-4/fetch-loi.html'], [6, 25])}
${ra(OUT['5-4/fetch-loi'])}
<table>
<thead><tr><th>What went wrong</th><th>fetch promise</th><th>What you see</th></tr></thead>
<tbody>
<tr><td>404, 500, 401… (the server answered)</td><td><strong>Resolves</strong></td><td><code>res.ok === false</code>, <code>res.status</code></td></tr>
<tr><td>Error page parsed as JSON</td><td>—</td><td><code>res.json()</code> throws <code>SyntaxError</code></td></tr>
<tr><td>No connection, DNS failure, CORS blocked</td><td><strong>Rejects</strong></td><td><code>TypeError: Failed to fetch</code></td></tr>
<tr><td>Timeout you set (Step 5)</td><td>Rejects</td><td><code>TimeoutError</code></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — trusting <code>catch</code> to catch HTTP errors.</strong> <code>fetch(url).then(r =&gt; r.json()).catch(showError)</code> looks complete. On a 404, the promise resolves, <code>r.json()</code> fails with a confusing "Unexpected token" error about the HTML error page, and the real cause, a 404, is lost. Always check first: <code>if (!res.ok) throw new Error('HTTP ' + res.status);</code>. That single line turns every HTTP failure into a clear error your <code>catch</code> can handle.</p></div>

<h3>Step 3 — four states, not one</h3>
${ma('html', CODE['5-4/tai-du-lieu.html'], [10, 30])}
${ra(OUT['5-4/tai-du-lieu'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Loading</span><span class="lz-t">before the answer</span><span class="lz-d">Show something at once, so the user knows the page is working.</span></div>
<div class="lz-layer"><span class="lz-k">Success</span><span class="lz-t">data arrived</span><span class="lz-d">Render it, with <code>textContent</code> for anything from the server.</span></div>
<div class="lz-layer"><span class="lz-k">Empty</span><span class="lz-t">success, but nothing</span><span class="lz-d">"No posts yet" is better than a blank area.</span></div>
<div class="lz-layer"><span class="lz-k">Error</span><span class="lz-t">anything failed</span><span class="lz-d">A visible message, and ideally a "Try again" button.</span></div>
</div>
<p>The screenshot on slide 5 is the success state. Design the other three as deliberately: users meet them on slow trains and bad Wi-Fi. React data libraries give you these four states as variables, because every component that fetches needs them.</p>

<h3>Step 4 — sending data with POST</h3>
<p>To create something on the server, send a POST with a JSON body. This code ran in a real browser against a real Node.js API:</p>
<pre><code class="language-javascript">const res = await fetch('/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },   // "the body is JSON"
  body: JSON.stringify({ title: 'Write the report' }), // the body must be a string
});
const created = await res.json();</code></pre>
<p>This is the server it talked to, about 30 lines of Node.js with no libraries:</p>
${ma('javascript', CODE['_t5/api.mjs'])}
<p>Three requests were sent. The browser's view:</p>
${ra(OUT['_t5/out/fetch-post'].split('\n').slice(0, 4).join('\n'))}
<p>And what the server actually received:</p>
${ra(OUT['_t5/out/fetch-post-server'])}
<p>The second request is the classic mistake: the object was passed directly as the body, without <code>JSON.stringify</code>. fetch turned it into the text <code>[object Object]</code>, the server could not parse it, and answered 400. Good APIs answer errors with a status code <em>and</em> a JSON message, as here; read that message and show it.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — the missing <code>Content-Type</code>.</strong> Without <code>'Content-Type': 'application/json'</code>, many servers (Express with <code>express.json()</code>, for example) do not parse the body at all and see it as empty, so you get "title is required" although you sent a title. When a server says a field is missing, open the Network tab and look at the request headers and payload before anything else.</p></div>

<h3>Step 5 — do not wait for ever</h3>
<pre><code class="language-javascript">try {
  const res = await fetch('/api/slow', { signal: AbortSignal.timeout(500) });
} catch (err) {
  if (err.name === 'TimeoutError') showMessage('The server is slow, please try again.');
}</code></pre>
${ra(OUT['_t5/out/fetch-post'].split('\n').slice(4).join('\n'))}
<p>The endpoint took two seconds; the browser gave up after half a second. Without a signal, fetch waits as long as the network allows. <code>AbortController</code> also lets you cancel a request yourself, for example when the user types a new search before the previous one returned.</p>

<h3>Step 6 — one helper for every request</h3>
<pre><code class="language-javascript">async function api(path, { method = 'GET', body, timeout = 8000 } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeout),
  });
  const data = res.status === 204 ? null : await res.json().catch(() =&gt; null);
  if (!res.ok) throw new Error(data?.error ?? 'HTTP ' + res.status);
  return data;
}

const todos = await api('/api/todos');
await api('/api/todos', { method: 'POST', body: { title: 'Ship it' } });</code></pre>
<p>All the rules of this lesson live in one place: JSON in, <code>ok</code> checked, the server's message used, a timeout. Every page of your app calls <code>api()</code>, and fixing a rule fixes it everywhere. Libraries such as axios and the data layers of React and Next.js are this idea, grown up.</p>

<h3>Step 7 — debug in the Network tab</h3>
<ol>
<li>DevTools → <strong>Network</strong> → filter <strong>Fetch/XHR</strong> to see only API calls.</li>
<li>Click a request: <strong>Headers</strong> (URL, method, status, request headers), <strong>Payload</strong> (what you sent), <strong>Response</strong> (what came back), <strong>Timing</strong>.</li>
<li>Right-click → <strong>Copy as fetch</strong> or <strong>Copy as cURL</strong> to replay it.</li>
<li>Use <strong>Throttling</strong> (e.g. "Slow 4G") or <strong>Offline</strong> to test your loading and error states.</li>
</ol>

<div class="callout ok">
<p><strong>🧪 Practice (40 minutes) — a page on a real public API</strong></p>
<p>Use the free test API <code>https://jsonplaceholder.typicode.com</code> (it allows requests from any site).</p>
<ol>
<li>Load <code>/posts?_limit=5</code> and show the titles, with loading, empty and error states.</li>
<li>Add a form that POSTs a new post (<code>title</code>, <code>body</code>, <code>userId: 1</code>) and shows the id the server returns.</li>
<li>Put all requests through your own <code>api()</code> helper with a 5-second timeout.</li>
<li>Request <code>/posts/999999</code> and show a sensible message.</li>
</ol>
<p>Hint: that API fakes the POST, so the new post will not appear in the list afterwards. That is expected.</p>
<p><strong>Done when:</strong> the list shows five titles; with DevTools set to <strong>Offline</strong>, a reload shows your error message instead of a blank list; the POST shows <code>201</code> and an id in the Network tab; the 999999 request shows "not found" (status 404) rather than "undefined"; and the Payload tab shows real JSON, not <code>[object Object]</code>. Then Code Lab module 5.4.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">API</span><span class="v">giao diện lập trình — các URL máy chủ trả dữ liệu.</span></div>
  <div class="kv"><span class="k">endpoint</span><span class="v">một địa chỉ cụ thể của API.</span></div>
  <div class="kv"><span class="k">fetch / Response</span><span class="v">gửi request / đối tượng phản hồi.</span></div>
  <div class="kv"><span class="k">res.ok</span><span class="v">true khi mã trạng thái 200–299.</span></div>
  <div class="kv"><span class="k">body / payload</span><span class="v">phần thân — dữ liệu gửi hoặc nhận.</span></div>
  <div class="kv"><span class="k">Content-Type</span><span class="v">header cho biết phần thân là gì.</span></div>
  <div class="kv"><span class="k">201 / 400 / 404</span><span class="v">đã tạo / request sai / không thấy.</span></div>
  <div class="kv"><span class="k">loading state</span><span class="v">trạng thái đang tải.</span></div>
  <div class="kv"><span class="k">timeout / AbortSignal</span><span class="v">giới hạn thời gian / tín hiệu huỷ.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">luật cho phép trang gọi máy chủ khác (Bài 7.5).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>fetch</code> takes two awaits: the response, then the body (<code>res.json()</code>).</li>
  <li>HTTP errors do not reject: check <code>res.ok</code> and throw yourself.</li>
  <li>Only network failures (and timeouts) reject the promise.</li>
  <li>Design four states: loading, success, empty, error.</li>
  <li>POST JSON: method, <code>Content-Type</code> header, <code>JSON.stringify</code> body.</li>
  <li>Set a timeout with <code>AbortSignal.timeout</code>.</li>
  <li>Put the rules in one <code>api()</code> helper; debug in the Network tab.</li>
</ul>
${nguon('📗', 'MDN — Using the Fetch API', 'Requests, responses, bodies and errors', 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch')}
${nguon('🧪', 'JSONPlaceholder', 'A free fake REST API for practice', 'https://jsonplaceholder.typicode.com/')}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-11-1-fetch-async', title: 'FER202 (Academy) — fetch in React', sub: 'The same requests and states inside React components', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Xin dữ liệu từ máy chủ, và xử lý mọi câu trả lời</h2>
<p class="lead">Học xong bài này bạn tải được JSON từ API bằng <code>fetch</code>, đọc mã trạng thái và phần thân, coi lỗi HTTP là lỗi, hiện trạng thái đang tải, rỗng và lỗi, gửi dữ liệu bằng POST, dừng request kéo dài quá lâu, và gỡ lỗi request trong thẻ Network. Bạn cần điều này vì gần như mọi trang bạn dựng đều lấy dữ liệu từ máy chủ, và các lỗi front-end phổ biến nhất — trang trắng, vòng quay không bao giờ dừng, chữ "undefined" trên giao diện — đều do chỉ xử lý trường hợp suôn sẻ.</p>

<h3>Bước 1 — một request GET, hai lần await</h3>
${ma('html', CODE['5-4/fetch-co-ban.html'], [6, 16])}
${ra(OUT['5-4/fetch-co-ban'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">fetch(url)</span><span class="lz-d">Gửi request GET (Bài 0.2). Trả về promise ngay lập tức.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">await → Response</span><span class="lz-d">Tới khi mã trạng thái và header tới: <code>res.status</code>, <code>res.ok</code>, <code>res.headers</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">await res.json()</span><span class="lz-d">Đọc toàn bộ phần thân và phân tích thành JSON (Bài 4.4). Còn có <code>res.text()</code>, <code>res.blob()</code>.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Dùng dữ liệu</span><span class="lz-d">Mảng và object bình thường: sắp xếp, lọc, hiển thị.</span></div>
</div>
<p>Phần thân có thể lớn và tới từng mẩu, vì vậy đọc nó là một bước riêng, bất đồng bộ. Bạn chỉ đọc được phần thân một lần: gọi <code>res.json()</code> hai lần sẽ ném lỗi.</p>
<p>URL ở đây là tương đối, nên request đi tới cùng máy chủ với trang. Với máy chủ khác bạn viết địa chỉ đầy đủ, và máy chủ đó phải cho phép (CORS, Bài 7.5).</p>

<h3>Bước 2 — <code>fetch</code> không ném lỗi khi 404</h3>
${ma('html', CODE['5-4/fetch-loi.html'], [6, 25])}
${ra(OUT['5-4/fetch-loi'])}
<table>
<thead><tr><th>Cái gì hỏng</th><th>Promise của fetch</th><th>Bạn thấy gì</th></tr></thead>
<tbody>
<tr><td>404, 500, 401… (máy chủ đã trả lời)</td><td><strong>Resolve</strong></td><td><code>res.ok === false</code>, <code>res.status</code></td></tr>
<tr><td>Trang lỗi bị đọc như JSON</td><td>—</td><td><code>res.json()</code> ném <code>SyntaxError</code></td></tr>
<tr><td>Mất kết nối, lỗi DNS, bị CORS chặn</td><td><strong>Reject</strong></td><td><code>TypeError: Failed to fetch</code></td></tr>
<tr><td>Hết thời gian bạn đặt (Bước 5)</td><td>Reject</td><td><code>TimeoutError</code></td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin rằng <code>catch</code> bắt được lỗi HTTP.</strong> <code>fetch(url).then(r =&gt; r.json()).catch(showError)</code> trông đầy đủ. Khi gặp 404, promise resolve, <code>r.json()</code> hỏng với lỗi "Unexpected token" khó hiểu về trang lỗi HTML, và nguyên nhân thật, một 404, bị mất. Luôn kiểm trước: <code>if (!res.ok) throw new Error('HTTP ' + res.status);</code>. Một dòng đó biến mọi thất bại HTTP thành một lỗi rõ ràng mà <code>catch</code> xử lý được.</p></div>

<h3>Bước 3 — bốn trạng thái, không phải một</h3>
${ma('html', CODE['5-4/tai-du-lieu.html'], [10, 30])}
${ra(OUT['5-4/tai-du-lieu'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Đang tải</span><span class="lz-t">trước khi có trả lời</span><span class="lz-d">Hiện gì đó ngay, để người dùng biết trang đang làm việc.</span></div>
<div class="lz-layer"><span class="lz-k">Thành công</span><span class="lz-t">có dữ liệu</span><span class="lz-d">Hiển thị nó, dùng <code>textContent</code> cho mọi thứ từ máy chủ.</span></div>
<div class="lz-layer"><span class="lz-k">Rỗng</span><span class="lz-t">thành công, nhưng không có gì</span><span class="lz-d">"Chưa có bài nào" tốt hơn một vùng trống.</span></div>
<div class="lz-layer"><span class="lz-k">Lỗi</span><span class="lz-t">có gì đó hỏng</span><span class="lz-d">Một thông báo nhìn thấy được, tốt nhất có nút "Thử lại".</span></div>
</div>
<p>Ảnh chụp ở slide 5 là trạng thái thành công. Hãy thiết kế ba trạng thái kia chu đáo như vậy: người dùng gặp chúng trên tàu chậm và Wi-Fi kém. Thư viện dữ liệu của React cho bạn bốn trạng thái này dưới dạng biến, vì component nào tải dữ liệu cũng cần chúng.</p>

<h3>Bước 4 — gửi dữ liệu bằng POST</h3>
<p>Để tạo gì đó trên máy chủ, gửi POST kèm phần thân JSON. Đoạn mã này chạy trong một trình duyệt thật, tới một API Node.js thật:</p>
<pre><code class="language-javascript">const res = await fetch('/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },   // "phần thân là JSON"
  body: JSON.stringify({ title: 'Write the report' }), // phần thân phải là chuỗi
});
const created = await res.json();</code></pre>
<p>Đây là máy chủ nó nói chuyện cùng, khoảng 30 dòng Node.js không thư viện:</p>
${ma('javascript', CODE['_t5/api.mjs'])}
<p>Ba request được gửi. Góc nhìn của trình duyệt:</p>
${ra(OUT['_t5/out/fetch-post'].split('\n').slice(0, 4).join('\n'))}
<p>Và thứ máy chủ thật sự nhận được:</p>
${ra(OUT['_t5/out/fetch-post-server'])}
<p>Request thứ hai là lỗi kinh điển: object được đưa thẳng làm phần thân, thiếu <code>JSON.stringify</code>. fetch biến nó thành chữ <code>[object Object]</code>, máy chủ không phân tích được, và trả 400. API tốt trả lỗi bằng mã trạng thái <em>và</em> một thông điệp JSON, như ở đây; hãy đọc thông điệp đó và hiện ra.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — thiếu <code>Content-Type</code>.</strong> Thiếu <code>'Content-Type': 'application/json'</code>, nhiều máy chủ (ví dụ Express với <code>express.json()</code>) không phân tích phần thân và coi nó là rỗng, nên bạn nhận "title is required" dù đã gửi tiêu đề. Khi máy chủ báo thiếu trường, hãy mở thẻ Network và xem header cùng payload của request trước mọi thứ khác.</p></div>

<h3>Bước 5 — đừng chờ mãi</h3>
<pre><code class="language-javascript">try {
  const res = await fetch('/api/slow', { signal: AbortSignal.timeout(500) });
} catch (err) {
  if (err.name === 'TimeoutError') showMessage('Máy chủ chậm, vui lòng thử lại.');
}</code></pre>
${ra(OUT['_t5/out/fetch-post'].split('\n').slice(4).join('\n'))}
<p>Endpoint tốn hai giây; trình duyệt bỏ cuộc sau nửa giây. Không có signal, fetch chờ lâu bao nhiêu mạng cho phép. <code>AbortController</code> còn cho bạn tự huỷ request, ví dụ khi người dùng gõ từ khoá tìm kiếm mới trước khi lần trước trả về.</p>

<h3>Bước 6 — một hàm trợ giúp cho mọi request</h3>
<pre><code class="language-javascript">async function api(path, { method = 'GET', body, timeout = 8000 } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeout),
  });
  const data = res.status === 204 ? null : await res.json().catch(() =&gt; null);
  if (!res.ok) throw new Error(data?.error ?? 'HTTP ' + res.status);
  return data;
}

const todos = await api('/api/todos');
await api('/api/todos', { method: 'POST', body: { title: 'Ship it' } });</code></pre>
<p>Mọi luật của bài nằm ở một chỗ: JSON vào, kiểm <code>ok</code>, dùng thông điệp của máy chủ, có giới hạn thời gian. Mọi trang của ứng dụng gọi <code>api()</code>, và sửa một luật là sửa ở mọi nơi. Thư viện như axios và tầng dữ liệu của React, Next.js chính là ý tưởng này, đã trưởng thành.</p>

<h3>Bước 7 — gỡ lỗi trong thẻ Network</h3>
<ol>
<li>DevTools → <strong>Network</strong> → lọc <strong>Fetch/XHR</strong> để chỉ thấy lời gọi API.</li>
<li>Bấm vào một request: <strong>Headers</strong> (URL, method, mã trạng thái, header request), <strong>Payload</strong> (thứ bạn gửi), <strong>Response</strong> (thứ trả về), <strong>Timing</strong>.</li>
<li>Chuột phải → <strong>Copy as fetch</strong> hoặc <strong>Copy as cURL</strong> để gửi lại.</li>
<li>Dùng <strong>Throttling</strong> (vd "Slow 4G") hoặc <strong>Offline</strong> để thử trạng thái đang tải và lỗi.</li>
</ol>

<div class="callout ok">
<p><strong>🧪 Luyện tập (40 phút) — một trang dùng API công khai thật</strong></p>
<p>Dùng API thử miễn phí <code>https://jsonplaceholder.typicode.com</code> (nó cho phép request từ mọi trang).</p>
<ol>
<li>Tải <code>/posts?_limit=5</code> và hiện các tiêu đề, có trạng thái đang tải, rỗng và lỗi.</li>
<li>Thêm form POST một bài mới (<code>title</code>, <code>body</code>, <code>userId: 1</code>) và hiện id máy chủ trả về.</li>
<li>Cho mọi request đi qua hàm <code>api()</code> của bạn với giới hạn 5 giây.</li>
<li>Gọi <code>/posts/999999</code> và hiện một thông báo hợp lý.</li>
</ol>
<p>Gợi ý: API đó giả lập POST, nên bài mới sẽ không xuất hiện trong danh sách sau đó. Điều này là bình thường.</p>
<p><strong>Xong khi:</strong> danh sách hiện năm tiêu đề; đặt DevTools ở <strong>Offline</strong> rồi tải lại thì thấy thông báo lỗi của bạn thay vì danh sách trống; POST hiện <code>201</code> và một id trong thẻ Network; request 999999 hiện "không tìm thấy" (mã 404) chứ không phải "undefined"; và thẻ Payload hiện JSON thật, không phải <code>[object Object]</code>. Sau đó làm module Code Lab 5.4.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">API</span><span class="v">giao diện lập trình — các URL máy chủ trả dữ liệu.</span></div>
  <div class="kv"><span class="k">endpoint</span><span class="v">một địa chỉ cụ thể của API.</span></div>
  <div class="kv"><span class="k">fetch / Response</span><span class="v">gửi request / đối tượng phản hồi.</span></div>
  <div class="kv"><span class="k">res.ok</span><span class="v">true khi mã trạng thái 200–299.</span></div>
  <div class="kv"><span class="k">body / payload</span><span class="v">phần thân — dữ liệu gửi hoặc nhận.</span></div>
  <div class="kv"><span class="k">Content-Type</span><span class="v">header cho biết phần thân là gì.</span></div>
  <div class="kv"><span class="k">201 / 400 / 404</span><span class="v">đã tạo / request sai / không thấy.</span></div>
  <div class="kv"><span class="k">loading state</span><span class="v">trạng thái đang tải.</span></div>
  <div class="kv"><span class="k">timeout / AbortSignal</span><span class="v">giới hạn thời gian / tín hiệu huỷ.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">luật cho phép trang gọi máy chủ khác (Bài 7.5).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>fetch</code> cần hai lần await: response, rồi phần thân (<code>res.json()</code>).</li>
  <li>Lỗi HTTP không reject: kiểm <code>res.ok</code> rồi tự ném lỗi.</li>
  <li>Chỉ lỗi mạng (và hết giờ) mới làm promise thất bại.</li>
  <li>Thiết kế bốn trạng thái: đang tải, thành công, rỗng, lỗi.</li>
  <li>POST JSON: method, header <code>Content-Type</code>, phần thân <code>JSON.stringify</code>.</li>
  <li>Đặt giới hạn thời gian bằng <code>AbortSignal.timeout</code>.</li>
  <li>Gom các luật vào một hàm <code>api()</code>; gỡ lỗi trong thẻ Network.</li>
</ul>
${nguon('📗', 'MDN — Using the Fetch API', 'Request, response, phần thân và lỗi', 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch')}
${nguon('🧪', 'JSONPlaceholder', 'API REST giả miễn phí để luyện tập', 'https://jsonplaceholder.typicode.com/')}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-11-1-fetch-async', title: 'FER202 (Academy) — fetch trong React', sub: 'Cùng các request và trạng thái đó bên trong component React', cta: 'Mở bài' })}
</div>
`,
};
