/**
 * Bài 6.2 — HTTP method (nâng cấp 02/11/2026). Output thật: _demo/_t6/chay.sh (curl → API Node _t6/server.mjs) và
 * _demo/_t6/chay.mjs (Chromium: prefetch tự gọi GET-xoá, form method="put" thành GET). Deck: scripts/slides-src/wf-6-2.mjs
 * (9 slide, WF/v1/wf-6-2). Code Lab: wf-6-2-http-methods.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

/** Lấy vài lệnh (theo thứ tự 0-based) trong một output nhiều lệnh `$ curl …`. */
const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=\$ )/); return n.map((i) => p[i].trim()).join('\n\n'); };

const G = walkWf('wf-6-2', 'HTTP methods', 'HTTP method', [
  [1, 'HTTP methods',
    '<p>The first word of every request is its method. It tells the server what you intend to do with the address that follows: read it, create something under it, replace it, change part of it, or delete it. Choosing the wrong one has real consequences, and this lesson shows them.</p>',
    '<p>Từ đầu tiên của mọi request là method. Nó nói với máy chủ bạn định làm gì với địa chỉ theo sau: đọc, tạo thứ mới bên dưới, thay thế, sửa một phần, hay xoá. Chọn sai có hậu quả thật, và bài này cho bạn thấy chúng.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to pick the right method for any action, predict what happens when a request is sent twice, explain the difference between PUT and PATCH with real output, and avoid two classic bugs: a GET that changes data, and an HTML form with a method it does not support.</p>',
    '<p>Bạn sẽ chọn đúng method cho mọi hành động, đoán được chuyện gì xảy ra khi một request bị gửi hai lần, giải thích khác biệt giữa PUT và PATCH bằng output thật, và tránh hai lỗi kinh điển: một GET làm đổi dữ liệu, và một form HTML dùng method nó không hỗ trợ.</p>'],
  [3, 'One address, many actions',
    '<p>The path names the thing; the method names the action. Our product API has only two addresses: the collection and one item. Six combinations of method and path cover listing, creating, reading, replacing, updating and deleting.</p>',
    '<p>Đường dẫn gọi tên đồ vật; method gọi tên hành động. API sản phẩm của ta chỉ có hai địa chỉ: tập hợp và một món. Sáu tổ hợp method với đường dẫn phủ hết việc liệt kê, tạo, đọc, thay thế, cập nhật và xoá.</p>'],
  [4, 'POST twice, two products',
    '<p>We sent exactly the same POST twice and the server created two rulers, number six and number seven. That is what "not idempotent" means. A double click on a checkout button, or an automatic retry after a slow network, can create a second order.</p>',
    '<p>Ta gửi đúng một POST hai lần và máy chủ tạo hai cây thước, số sáu và số bảy. Đó là nghĩa của "không idempotent". Một cú bấm đúp vào nút thanh toán, hay một lần tự thử lại sau mạng chậm, có thể tạo đơn hàng thứ hai.</p>'],
  [5, 'PUT replaces, PATCH changes',
    '<p>PATCH with only a price kept the category "home". PUT with a name and a price replaced the whole product, so the category fell back to "other". PUT means "here is the complete new version". Sending it again gives the same result, which makes it safe to retry.</p>',
    '<p>PATCH chỉ với giá đã giữ nguyên danh mục "home". PUT với tên và giá đã thay cả sản phẩm, nên danh mục rơi về "other". PUT nghĩa là "đây là phiên bản mới đầy đủ". Gửi lại cho cùng kết quả, nên thử lại an toàn.</p>'],
  [6, 'Safe and idempotent',
    '<p>Safe methods change nothing: GET and HEAD. Idempotent methods leave the same state no matter how many times you repeat them: the safe ones, plus PUT and DELETE. Deleting twice returned 204 then 404, but the product is gone either way. POST and PATCH promise neither.</p>',
    '<p>Method an toàn không đổi gì: GET và HEAD. Method idempotent để lại cùng trạng thái dù lặp bao nhiêu lần: các method an toàn, cộng PUT và DELETE. Xoá hai lần trả 204 rồi 404, nhưng sản phẩm đằng nào cũng mất. POST và PATCH không hứa điều nào.</p>'],
  [7, 'A GET that deletes',
    '<p>This page had a delete link and a prefetch hint. Nobody clicked anything, yet the server received a GET to the delete address and a note disappeared. Browsers, crawlers and link previews send GETs freely because GET is promised to be safe.</p>',
    '<p>Trang này có một link xoá và một gợi ý prefetch. Không ai bấm gì, vậy mà máy chủ nhận một GET tới địa chỉ xoá và một ghi chú biến mất. Trình duyệt, bot thu thập và bản xem trước link gửi GET thoải mái vì GET được hứa là an toàn.</p>'],
  [8, 'Forms speak only GET and POST',
    '<p>An HTML form with method put is not an error. The browser silently uses GET instead and puts the fields in the address bar. To send PUT, PATCH or DELETE from a page, use fetch, or a server-side convention such as a hidden field.</p>',
    '<p>Một form HTML với method put không báo lỗi. Trình duyệt lặng lẽ dùng GET thay vào và đặt các ô lên thanh địa chỉ. Muốn gửi PUT, PATCH hay DELETE từ một trang, hãy dùng fetch, hoặc một quy ước phía máy chủ như ô ẩn.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to call each method against the local API, predict the result before you press Enter, and fix a page that deletes data on GET. "Done when" checks the status codes and the final state of the data.</p>',
    '<p>Bài luyện yêu cầu bạn gọi từng method tới API cục bộ, đoán kết quả trước khi nhấn Enter, và sửa một trang xoá dữ liệu bằng GET. "Xong khi" kiểm mã trạng thái và trạng thái cuối của dữ liệu.</p>'],
]);

export default {
  title: '6.2 — HTTP methods: what the request intends|||6.2 — HTTP method: request định làm gì',
  slug: 'wf-6-2-http-methods',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/7YcW25PHnAA', durationSeconds: 0 },
  description: 'GET/POST/PUT/PATCH/DELETE/HEAD trên API Node thật: POST hai lần tạo hai sản phẩm, PATCH giữ trường còn PUT thay cả bản ghi (output curl), DELETE lần hai 404 mà trạng thái như nhau, 405 + Allow; an toàn và idempotent; Chromium thật: prefetch gọi GET-xoá khi không ai bấm, form method="put" thành GET.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>The method is a promise about what the request will do</h2>
<p class="lead">After this lesson you can choose the right method for any action in an API, predict what happens when the same request is sent twice, explain PUT versus PATCH from real output, read a 405 response, and avoid two bugs that reach production surprisingly often: a GET that changes data, and an HTML form using a method it does not support. Every route you write in Node.js and every <code>fetch</code> call you make in React starts with this choice.</p>

<h3>Step 1 — one address, several actions</h3>
<p>The path names <em>the thing</em>; the method names <em>the action</em>. The product API from Lesson 6.1 has just two kinds of address, and six method–path pairs:</p>
<table>
<thead><tr><th>Method + path</th><th>Action</th><th>Success</th></tr></thead>
<tbody>
<tr><td><code>GET /api/products</code></td><td>List products (with filters, Lesson 6.5)</td><td>200 + list</td></tr>
<tr><td><code>POST /api/products</code></td><td>Create a new product from the JSON body</td><td>201 + the new product</td></tr>
<tr><td><code>GET /api/products/2</code></td><td>Read product 2</td><td>200 + product</td></tr>
<tr><td><code>PUT /api/products/2</code></td><td>Replace product 2 with the body</td><td>200 + product</td></tr>
<tr><td><code>PATCH /api/products/2</code></td><td>Change only the fields in the body</td><td>200 + product</td></tr>
<tr><td><code>DELETE /api/products/2</code></td><td>Delete product 2</td><td>204, no body</td></tr>
</tbody>
</table>
<p>Two more you will see: <code>HEAD</code> is a GET that returns only the headers (useful to check whether something exists or changed, without downloading it), and <code>OPTIONS</code> asks which methods are allowed — browsers send it automatically before some cross-origin requests (CORS, Lesson 7.5).</p>
${ra(doan('_t6/out/methods', 0, 9))}

<h3>Step 2 — POST creates, every time</h3>
<p>We sent exactly the same POST twice:</p>
${ra(doan('_t6/out/methods', 1, 2))}
<p>Two rulers, id 6 and id 7. The server cannot know that the second request was a mistake — maybe you really wanted two. This is why a payment button disables itself after the first click, and why the browser asks "Confirm form resubmission?" when you reload a page that was the result of a POST.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — retrying a POST automatically.</strong> A fetch wrapper that retries every failed request "for reliability" will, on a slow network, send a POST again after the server already processed the first one: two orders, two charges. Retry only idempotent requests (GET, PUT, DELETE) automatically. For POST, real payment APIs use an <em>idempotency key</em>: the client sends a unique id in a header, and the server refuses to process the same id twice.</p></div>

<h3>Step 3 — PUT replaces, PATCH changes part</h3>
<p>Product 2 started as <code>{"name":"Desk lamp","price":320000,"category":"home"}</code>. First a PATCH with only a new price, then a PUT with name and price, then the same PUT again:</p>
${ra(doan('_t6/out/methods', 3, 4, 5))}
<p>PATCH kept <code>category: "home"</code>. PUT lost it: PUT means "here is the complete new version of this resource", so a field you leave out is gone (our server falls back to <code>"other"</code>). Here is exactly where the server makes that difference:</p>
${ma('javascript', CODE['_t6/server.mjs'], [100, 109])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">PATCH</span><span class="lz-t">{ ...old, ...body }</span><span class="lz-d">Start from what is stored, overwrite only the fields you sent.</span></div>
<div class="lz-step"><span class="lz-k">PUT</span><span class="lz-t">body becomes the product</span><span class="lz-d">Anything not in the body is reset. The client must send the whole object.</span></div>
<div class="lz-step"><span class="lz-k">Both</span><span class="lz-t">id comes from the path</span><span class="lz-d">Never let the body change the id — <code>id</code> is set last on purpose.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — using PUT for an edit form that shows only some fields.</strong> A profile page lets the user change the display name, and the code sends <code>PUT /api/users/12</code> with <code>{ name }</code>. The email, avatar and role are wiped, because the server did what PUT means. Either send PATCH with the changed fields, or load the whole object, change it, and PUT the whole object back.</p></div>

<h3>Step 4 — DELETE twice, and the 405</h3>
${ra(doan('_t6/out/methods', 6, 7, 8))}
<p>The first DELETE returns <strong>204 No Content</strong>: success, nothing to send back. The second returns 404 — but the state of the server is the same after one DELETE or two: product 7 does not exist. That is what idempotent means: <em>the effect</em> is the same, not necessarily the response. The last request used a method the address does not support, and the server answered <strong>405 Method Not Allowed</strong> with an <code>Allow</code> header listing what it does support.</p>

<h3>Step 5 — safe and idempotent, in one table</h3>
<table>
<thead><tr><th>Method</th><th>Safe (changes nothing)</th><th>Idempotent (repeat = same state)</th><th>Has a body</th></tr></thead>
<tbody>
<tr><td>GET</td><td>✅</td><td>✅</td><td>No</td></tr>
<tr><td>HEAD</td><td>✅</td><td>✅</td><td>No</td></tr>
<tr><td>OPTIONS</td><td>✅</td><td>✅</td><td>Rarely</td></tr>
<tr><td>PUT</td><td>❌</td><td>✅</td><td>Yes — the full resource</td></tr>
<tr><td>DELETE</td><td>❌</td><td>✅</td><td>Usually no</td></tr>
<tr><td>POST</td><td>❌</td><td>❌</td><td>Yes</td></tr>
<tr><td>PATCH</td><td>❌</td><td>❌ (not guaranteed)</td><td>Yes — the changes</td></tr>
</tbody>
</table>
<p>PATCH is not guaranteed idempotent because a patch can be relative: "add 1 to stock" applied twice adds 2. Our PATCH sets absolute values, so it happens to be idempotent — but clients cannot assume that about every API.</p>

<h3>Step 6 — why a GET must never change data (real browser)</h3>
<p>This small notes page puts a delete link next to each note, implemented as <code>GET /notes/1/delete</code>. It also contains <code>&lt;link rel="prefetch"&gt;</code> for that link — something a framework or a "speed up navigation" library adds for you. We opened it in Chromium and touched nothing:</p>
${ra(OUT['_t6/out/prefetch'])}
<p>A note was deleted without anyone clicking. Prefetching is only one of many things that send GETs on their own: search engine crawlers follow every link, chat apps fetch a link to show a preview, email security scanners open links "to check them", and the browser may reload a GET when you come back to a tab. They all rely on the promise that GET is safe.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>&lt;a href="/notes/1/delete"&gt;</code>.</strong> It works perfectly when you test it by clicking, which is why it survives code review. The fix: make deleting a <code>DELETE</code> (via fetch) or at least a <code>POST</code> from a form with a button. Then nothing but a deliberate action can trigger it. Chapter 7 adds the second reason: GET requests can be triggered from other websites by a simple image tag.</p></div>

<h3>Step 7 — HTML forms only speak GET and POST</h3>
<p>The same page had a form written as <code>&lt;form method="put" action="/save"&gt;</code>. We clicked Save:</p>
${ra(OUT['_t6/out/form-put'])}
<p>No error, no warning. The HTML standard allows only <code>get</code>, <code>post</code> (and <code>dialog</code>); anything else falls back to GET, so the field went into the address bar instead of a body. Ways to send other methods from a page:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">fetch</span><span class="v"><code>fetch('/api/products/2', { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ price: 7000 }) })</code> — the normal way in React apps.</span></div>
  <div class="kv"><span class="k">Server convention</span><span class="v">A POST form with a hidden field such as <code>_method=DELETE</code> that the server translates (Laravel, Rails, some Express middleware).</span></div>
  <div class="kv"><span class="k">Framework actions</span><span class="v">Next.js Server Actions and Remix actions submit as POST and run the right code on the server (later courses).</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — every method, predicted before sent</strong></p>
<ol>
<li>Run the Chapter 6 server (<code>node server.mjs</code>). For each command below, <strong>write your predicted status and body first</strong>, then run it.</li>
<li><code>POST /api/products</code> with <code>{"name":"Glue","price":12000,"category":"office"}</code> — twice.</li>
<li><code>PATCH</code> the first Glue to price 11000; then <code>PUT</code> it with only name and price. Read the category after each.</li>
<li><code>DELETE</code> the second Glue twice. Then <code>GET /api/products?category=office</code>.</li>
<li>Send <code>PATCH /api/products</code> (no id). Read the <code>Allow</code> header.</li>
<li>Write a tiny HTML page with a delete <em>button</em> that calls <code>fetch(url, { method: 'DELETE' })</code> instead of a link.</li>
</ol>
<p>Hint: <code>curl -s -i -X PATCH … -H 'Content-Type: application/json' -d '{…}'</code>. The <code>-i</code> shows status and headers.</p>
<p><strong>Done when:</strong> your predictions matched at least 6 of the 8 responses; you can explain why the category changed after PUT; the second DELETE returned 404 and the office list contains exactly one Glue; the 405 response listed <code>GET, HEAD, POST</code>; and your page deletes only when the button is clicked. Then Code Lab module 6.2.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">method / verb</span><span class="v">phương thức — request định làm gì.</span></div>
  <div class="kv"><span class="k">resource</span><span class="v">tài nguyên — thứ mà đường dẫn gọi tên.</span></div>
  <div class="kv"><span class="k">collection / item</span><span class="v">tập hợp / một phần tử — <code>/products</code> và <code>/products/2</code>.</span></div>
  <div class="kv"><span class="k">safe</span><span class="v">an toàn — không đổi trạng thái máy chủ.</span></div>
  <div class="kv"><span class="k">idempotent</span><span class="v">lặp lại vẫn cùng trạng thái.</span></div>
  <div class="kv"><span class="k">replace vs partial update</span><span class="v">thay toàn bộ (PUT) và sửa một phần (PATCH).</span></div>
  <div class="kv"><span class="k">405 Method Not Allowed</span><span class="v">địa chỉ không nhận method này; header Allow kể các method được.</span></div>
  <div class="kv"><span class="k">prefetch</span><span class="v">tải trước — trình duyệt tự gửi GET cho link có thể sắp bấm.</span></div>
  <div class="kv"><span class="k">idempotency key</span><span class="v">khoá chống lặp — mã duy nhất để máy chủ không xử lý một POST hai lần.</span></div>
  <div class="kv"><span class="k">form resubmission</span><span class="v">gửi lại form — tải lại trang kết quả của POST.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Path = the thing, method = the action. Two addresses + six methods cover a whole resource.</li>
  <li>POST creates every time: two identical POSTs make two records. Never auto-retry a POST.</li>
  <li>PUT replaces the whole resource (missing fields are lost); PATCH changes only what you send.</li>
  <li>Idempotent = same <em>state</em> after repeats, not the same response (DELETE: 204 then 404).</li>
  <li>GET and HEAD must be safe: prefetchers, crawlers and previews send them without asking.</li>
  <li>HTML forms support only GET and POST; other values silently become GET. Use fetch for PUT/PATCH/DELETE.</li>
  <li>405 + <code>Allow</code> tells you which methods an address supports.</li>
</ul>
${nguon('📗', 'MDN — HTTP request methods', 'Each method with its safe / idempotent / cacheable flags', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods')}
${nguon('📘', 'RFC 9110 §9 — Methods', 'The specification text for GET, POST, PUT, DELETE and friends', 'https://www.rfc-editor.org/rfc/rfc9110#name-methods')}
${lienKet({ khoa: 'api-design', bai: 'api-1-2-phuong-thuc', title: 'API Design 1.2 — Methods and their guarantees', sub: 'Safe, idempotent, PUT vs PATCH from the API designer’s side, with idempotency keys', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Method là lời hứa về việc request sẽ làm</h2>
<p class="lead">Học xong bài này bạn chọn đúng method cho mọi hành động trong một API, đoán được chuyện gì xảy ra khi cùng một request bị gửi hai lần, giải thích PUT so với PATCH bằng output thật, đọc được response 405, và tránh hai lỗi lọt lên production nhiều đến bất ngờ: một GET làm đổi dữ liệu, và một form HTML dùng method nó không hỗ trợ. Mọi route bạn viết trong Node.js và mọi lời gọi <code>fetch</code> trong React đều bắt đầu từ lựa chọn này.</p>

<h3>Bước 1 — một địa chỉ, nhiều hành động</h3>
<p>Đường dẫn gọi tên <em>đồ vật</em>; method gọi tên <em>hành động</em>. API sản phẩm ở Bài 6.1 chỉ có hai loại địa chỉ, và sáu cặp method–đường dẫn:</p>
<table>
<thead><tr><th>Method + đường dẫn</th><th>Hành động</th><th>Thành công</th></tr></thead>
<tbody>
<tr><td><code>GET /api/products</code></td><td>Liệt kê sản phẩm (có lọc, Bài 6.5)</td><td>200 + danh sách</td></tr>
<tr><td><code>POST /api/products</code></td><td>Tạo sản phẩm mới từ phần thân JSON</td><td>201 + sản phẩm mới</td></tr>
<tr><td><code>GET /api/products/2</code></td><td>Đọc sản phẩm 2</td><td>200 + sản phẩm</td></tr>
<tr><td><code>PUT /api/products/2</code></td><td>Thay sản phẩm 2 bằng phần thân</td><td>200 + sản phẩm</td></tr>
<tr><td><code>PATCH /api/products/2</code></td><td>Chỉ đổi các trường có trong phần thân</td><td>200 + sản phẩm</td></tr>
<tr><td><code>DELETE /api/products/2</code></td><td>Xoá sản phẩm 2</td><td>204, không phần thân</td></tr>
</tbody>
</table>
<p>Hai method nữa bạn sẽ gặp: <code>HEAD</code> là một GET chỉ trả header (hữu ích để kiểm thứ gì đó có tồn tại hay đã đổi chưa, mà không phải tải về), và <code>OPTIONS</code> hỏi method nào được phép — trình duyệt tự gửi nó trước một số request khác origin (CORS, Bài 7.5).</p>
${ra(doan('_t6/out/methods', 0, 9))}

<h3>Bước 2 — POST lần nào cũng tạo</h3>
<p>Ta gửi đúng một POST y hệt hai lần:</p>
${ra(doan('_t6/out/methods', 1, 2))}
<p>Hai cây thước, id 6 và id 7. Máy chủ không thể biết request thứ hai là nhầm — có khi bạn thật sự muốn hai cây. Vì vậy nút thanh toán tự khoá sau cú bấm đầu, và trình duyệt hỏi "Xác nhận gửi lại biểu mẫu?" khi bạn tải lại một trang là kết quả của POST.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tự động thử lại một POST.</strong> Một lớp bọc fetch thử lại mọi request lỗi "cho chắc" sẽ, trên mạng chậm, gửi lại POST khi máy chủ đã xử lý xong cái đầu: hai đơn hàng, trừ tiền hai lần. Chỉ tự động thử lại request idempotent (GET, PUT, DELETE). Với POST, các API thanh toán thật dùng <em>idempotency key</em>: client gửi một mã duy nhất trong header, và máy chủ từ chối xử lý cùng mã hai lần.</p></div>

<h3>Bước 3 — PUT thay thế, PATCH sửa một phần</h3>
<p>Sản phẩm 2 ban đầu là <code>{"name":"Desk lamp","price":320000,"category":"home"}</code>. Đầu tiên một PATCH chỉ có giá mới, rồi một PUT có tên và giá, rồi chính PUT đó lần nữa:</p>
${ra(doan('_t6/out/methods', 3, 4, 5))}
<p>PATCH giữ <code>category: "home"</code>. PUT làm mất nó: PUT nghĩa là "đây là phiên bản mới đầy đủ của tài nguyên này", nên trường bạn bỏ sót sẽ mất (máy chủ của ta rơi về <code>"other"</code>). Đây chính là chỗ máy chủ tạo ra khác biệt đó:</p>
${ma('javascript', CODE['_t6/server.mjs'], [100, 109])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">PATCH</span><span class="lz-t">{ ...cũ, ...thân }</span><span class="lz-d">Bắt đầu từ thứ đang lưu, chỉ ghi đè các trường bạn gửi.</span></div>
<div class="lz-step"><span class="lz-k">PUT</span><span class="lz-t">phần thân thành sản phẩm</span><span class="lz-d">Thứ gì không có trong phần thân bị đặt lại. Client phải gửi cả object.</span></div>
<div class="lz-step"><span class="lz-k">Cả hai</span><span class="lz-t">id lấy từ đường dẫn</span><span class="lz-d">Đừng bao giờ để phần thân đổi id — <code>id</code> được gán sau cùng có chủ ý.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — dùng PUT cho form sửa chỉ hiện vài trường.</strong> Trang hồ sơ cho đổi tên hiển thị, và mã gửi <code>PUT /api/users/12</code> với <code>{ name }</code>. Email, ảnh đại diện và vai trò bị xoá sạch, vì máy chủ làm đúng nghĩa của PUT. Hoặc gửi PATCH với các trường đã đổi, hoặc tải cả object, sửa, rồi PUT trả cả object.</p></div>

<h3>Bước 4 — DELETE hai lần, và 405</h3>
${ra(doan('_t6/out/methods', 6, 7, 8))}
<p>DELETE đầu trả <strong>204 No Content</strong>: thành công, không có gì gửi lại. Lần hai trả 404 — nhưng trạng thái máy chủ sau một hay hai DELETE là như nhau: sản phẩm 7 không còn. Đó là nghĩa của idempotent: <em>tác dụng</em> như nhau, không nhất thiết response như nhau. Request cuối dùng một method mà địa chỉ không hỗ trợ, và máy chủ trả <strong>405 Method Not Allowed</strong> kèm header <code>Allow</code> liệt kê những gì nó hỗ trợ.</p>

<h3>Bước 5 — an toàn và idempotent, trong một bảng</h3>
<table>
<thead><tr><th>Method</th><th>An toàn (không đổi gì)</th><th>Idempotent (lặp = cùng trạng thái)</th><th>Có phần thân</th></tr></thead>
<tbody>
<tr><td>GET</td><td>✅</td><td>✅</td><td>Không</td></tr>
<tr><td>HEAD</td><td>✅</td><td>✅</td><td>Không</td></tr>
<tr><td>OPTIONS</td><td>✅</td><td>✅</td><td>Hiếm</td></tr>
<tr><td>PUT</td><td>❌</td><td>✅</td><td>Có — cả tài nguyên</td></tr>
<tr><td>DELETE</td><td>❌</td><td>✅</td><td>Thường không</td></tr>
<tr><td>POST</td><td>❌</td><td>❌</td><td>Có</td></tr>
<tr><td>PATCH</td><td>❌</td><td>❌ (không đảm bảo)</td><td>Có — phần thay đổi</td></tr>
</tbody>
</table>
<p>PATCH không được đảm bảo idempotent vì một bản vá có thể là tương đối: "cộng 1 vào tồn kho" áp hai lần là cộng 2. PATCH của ta đặt giá trị tuyệt đối nên tình cờ idempotent — nhưng client không được giả định vậy với mọi API.</p>

<h3>Bước 6 — vì sao GET không bao giờ được đổi dữ liệu (trình duyệt thật)</h3>
<p>Trang ghi chú nhỏ này đặt một link xoá cạnh mỗi ghi chú, làm bằng <code>GET /notes/1/delete</code>. Nó còn chứa <code>&lt;link rel="prefetch"&gt;</code> cho link đó — thứ mà một framework hay thư viện "tăng tốc điều hướng" tự thêm giúp bạn. Ta mở nó trong Chromium và không đụng vào gì:</p>
${ra(OUT['_t6/out/prefetch'])}
<p>Một ghi chú bị xoá mà không ai bấm. Prefetch chỉ là một trong nhiều thứ tự gửi GET: bot của công cụ tìm kiếm đi theo mọi link, ứng dụng chat tải link để hiện bản xem trước, máy quét bảo mật email mở link "để kiểm tra", và trình duyệt có thể tải lại một GET khi bạn quay lại thẻ. Tất cả đều dựa vào lời hứa GET là an toàn.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>&lt;a href="/notes/1/delete"&gt;</code>.</strong> Nó chạy hoàn hảo khi bạn thử bằng cách bấm, nên nó lọt qua review. Cách sửa: biến việc xoá thành <code>DELETE</code> (qua fetch) hoặc ít nhất <code>POST</code> từ một form có nút. Khi đó chỉ một hành động có chủ ý mới kích hoạt được. Chương 7 thêm lý do thứ hai: request GET có thể bị kích hoạt từ trang web khác chỉ bằng một thẻ ảnh.</p></div>

<h3>Bước 7 — form HTML chỉ nói GET và POST</h3>
<p>Cũng trang đó có một form viết là <code>&lt;form method="put" action="/save"&gt;</code>. Ta bấm Save:</p>
${ra(OUT['_t6/out/form-put'])}
<p>Không lỗi, không cảnh báo. Chuẩn HTML chỉ cho <code>get</code>, <code>post</code> (và <code>dialog</code>); giá trị khác rơi về GET, nên ô nhập đi lên thanh địa chỉ thay vì vào phần thân. Các cách gửi method khác từ một trang:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">fetch</span><span class="v"><code>fetch('/api/products/2', { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ price: 7000 }) })</code> — cách thông thường trong app React.</span></div>
  <div class="kv"><span class="k">Quy ước máy chủ</span><span class="v">Một form POST với ô ẩn như <code>_method=DELETE</code> mà máy chủ dịch lại (Laravel, Rails, vài middleware Express).</span></div>
  <div class="kv"><span class="k">Action của framework</span><span class="v">Server Action của Next.js và action của Remix gửi bằng POST rồi chạy đúng mã trên máy chủ (các khoá sau).</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — mọi method, đoán trước khi gửi</strong></p>
<ol>
<li>Chạy máy chủ Chương 6 (<code>node server.mjs</code>). Với mỗi lệnh dưới đây, <strong>viết mã trạng thái và phần thân bạn đoán trước</strong>, rồi mới chạy.</li>
<li><code>POST /api/products</code> với <code>{"name":"Glue","price":12000,"category":"office"}</code> — hai lần.</li>
<li><code>PATCH</code> cây Glue đầu thành giá 11000; rồi <code>PUT</code> nó chỉ với tên và giá. Đọc danh mục sau mỗi lần.</li>
<li><code>DELETE</code> cây Glue thứ hai hai lần. Rồi <code>GET /api/products?category=office</code>.</li>
<li>Gửi <code>PATCH /api/products</code> (không id). Đọc header <code>Allow</code>.</li>
<li>Viết một trang HTML nhỏ có <em>nút</em> xoá gọi <code>fetch(url, { method: 'DELETE' })</code> thay cho link.</li>
</ol>
<p>Gợi ý: <code>curl -s -i -X PATCH … -H 'Content-Type: application/json' -d '{…}'</code>. Cờ <code>-i</code> cho thấy mã trạng thái và header.</p>
<p><strong>Xong khi:</strong> bạn đoán đúng ít nhất 6 trên 8 response; giải thích được vì sao danh mục đổi sau PUT; DELETE lần hai trả 404 và danh sách office có đúng một Glue; response 405 liệt kê <code>GET, HEAD, POST</code>; và trang của bạn chỉ xoá khi bấm nút. Sau đó làm module Code Lab 6.2.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">method / verb</span><span class="v">phương thức — request định làm gì.</span></div>
  <div class="kv"><span class="k">resource</span><span class="v">tài nguyên — thứ mà đường dẫn gọi tên.</span></div>
  <div class="kv"><span class="k">collection / item</span><span class="v">tập hợp / một phần tử — <code>/products</code> và <code>/products/2</code>.</span></div>
  <div class="kv"><span class="k">safe</span><span class="v">an toàn — không đổi trạng thái máy chủ.</span></div>
  <div class="kv"><span class="k">idempotent</span><span class="v">lặp lại vẫn cùng trạng thái.</span></div>
  <div class="kv"><span class="k">replace vs partial update</span><span class="v">thay toàn bộ (PUT) và sửa một phần (PATCH).</span></div>
  <div class="kv"><span class="k">405 Method Not Allowed</span><span class="v">địa chỉ không nhận method này; header Allow kể các method được.</span></div>
  <div class="kv"><span class="k">prefetch</span><span class="v">tải trước — trình duyệt tự gửi GET cho link có thể sắp bấm.</span></div>
  <div class="kv"><span class="k">idempotency key</span><span class="v">khoá chống lặp — mã duy nhất để máy chủ không xử lý một POST hai lần.</span></div>
  <div class="kv"><span class="k">form resubmission</span><span class="v">gửi lại form — tải lại trang kết quả của POST.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Đường dẫn = đồ vật, method = hành động. Hai địa chỉ + sáu method phủ cả một tài nguyên.</li>
  <li>POST lần nào cũng tạo: hai POST y hệt thành hai bản ghi. Đừng bao giờ tự thử lại POST.</li>
  <li>PUT thay cả tài nguyên (trường thiếu bị mất); PATCH chỉ đổi thứ bạn gửi.</li>
  <li>Idempotent = cùng <em>trạng thái</em> sau khi lặp, không phải cùng response (DELETE: 204 rồi 404).</li>
  <li>GET và HEAD phải an toàn: prefetch, bot, bản xem trước gửi chúng mà không hỏi.</li>
  <li>Form HTML chỉ hỗ trợ GET và POST; giá trị khác lặng lẽ thành GET. Dùng fetch cho PUT/PATCH/DELETE.</li>
  <li>405 + <code>Allow</code> cho biết địa chỉ hỗ trợ method nào.</li>
</ul>
${nguon('📗', 'MDN — HTTP request methods', 'Từng method với cờ an toàn / idempotent / lưu đệm được', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods')}
${nguon('📘', 'RFC 9110 §9 — Methods', 'Văn bản đặc tả cho GET, POST, PUT, DELETE và các method khác', 'https://www.rfc-editor.org/rfc/rfc9110#name-methods')}
${lienKet({ khoa: 'api-design', bai: 'api-1-2-phuong-thuc', title: 'Thiết kế API 1.2 — Method và cam kết của chúng', sub: 'An toàn, idempotent, PUT và PATCH từ phía người thiết kế API, kèm idempotency key', cta: 'Mở bài' })}
</div>
`,
};
