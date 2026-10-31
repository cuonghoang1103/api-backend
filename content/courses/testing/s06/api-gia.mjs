/**
 * Testing · Chương 6 · 6.3 — Component có gọi API. Slug giữ từ khung: tst-6-3-api-gia.
 * Chạy thật: MSW 3.0.3 (onUnhandledFrame 'error') + client thật; 5 trạng thái xanh; URL tương đối trong Node ⇒ "Failed to parse URL".
 */
import G from '../giang/tst-06-3.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|×|Tests /.test(l)).join('\n');
const URL_OUT = OUT['63-url'].split('\n').filter((l) => /^\$ |✓|×|Unable to find|Could not load/.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');

const TT_EN = `<table>
<thead><tr><th>State</th><th>What the user sees</th><th>Role</th><th>How the test causes it</th></tr></thead>
<tbody>
<tr><td>loading</td><td>Loading bookings…</td><td><code>status</code></td><td>right after <code>render</code>, before the answer</td></tr>
<tr><td>data</td><td>a table, one row per booking</td><td><code>table</code>, <code>row</code></td><td>200 with a list</td></tr>
<tr><td>empty</td><td>No bookings yet.</td><td>—</td><td>200 with <code>[]</code></td></tr>
<tr><td>forbidden</td><td>Only admins can see all bookings.</td><td><code>alert</code></td><td>403</td></tr>
<tr><td>failed</td><td>Could not load the bookings. + Try again</td><td><code>alert</code>, <code>button</code></td><td>500, or the network is down</td></tr>
</tbody></table>`;
const TT_VI = `<table>
<thead><tr><th>Trạng thái</th><th>Người dùng thấy</th><th>Role</th><th>Test gây ra nó thế nào</th></tr></thead>
<tbody>
<tr><td>đang tải</td><td>Loading bookings…</td><td><code>status</code></td><td>ngay sau <code>render</code>, trước khi có câu trả lời</td></tr>
<tr><td>có dữ liệu</td><td>một bảng, mỗi lượt đặt một dòng</td><td><code>table</code>, <code>row</code></td><td>200 kèm danh sách</td></tr>
<tr><td>rỗng</td><td>No bookings yet.</td><td>—</td><td>200 kèm <code>[]</code></td></tr>
<tr><td>bị cấm</td><td>Only admins can see all bookings.</td><td><code>alert</code></td><td>403</td></tr>
<tr><td>lỗi</td><td>Could not load the bookings. + Try again</td><td><code>alert</code>, <code>button</code></td><td>500, hoặc mất mạng</td></tr>
</tbody></table>`;

export default {
  title: '6.3 — Components that fetch data: MSW and the states users see|||6.3 — Component có gọi API: MSW và các trạng thái người dùng thấy',
  slug: 'tst-6-3-api-gia',
  type: 'LESSON',
  isFreePreview: true,
  description: 'API client nhận fetch và base URL làm tham số; màn hình admin có năm trạng thái (đang tải, bảng, rỗng, 403, lỗi + thử lại); MSW 3 trả lời request của client thật, mỗi test đè handler bằng server.use, { once: true } cho thử lại, HttpResponse.error() cho mất mạng; đo thật: URL tương đối làm fetch của Node ném "Failed to parse URL".',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Components that fetch data</h2>
<p class="lead">The admin list loads every booking from <code>GET /api/admin/bookings</code> — the route Chapter 5 tested from the server side. Now we test the other side: what the screen shows for each answer the server can give, including the ones nobody plans for.</p>

<h3>A client that is easy to fake</h3>
${ma('javascript', CODE.api)}
<p>The client takes <code>fetch</code> and the base URL as parameters. That gives tests two choices: pass a tiny stub client (<code>{ listAll: async () =&gt; ({ status: 200, data: [ROW] }) }</code>, used in the Lab 6 reference solution), or keep this real client and fake the network with MSW, so URL building, the <code>Authorization</code> header and JSON parsing run too. This lesson takes the second path.</p>

<h3>One screen, several states</h3>
${ma('javascript', CODE.admin)}
${TT_EN}
<p>Each state is reachable through a role a screen reader announces: <code>status</code> is read politely when it changes, <code>alert</code> interrupts. That is why the error is an alert — and why Lab 6 plants a bug that turns a 403 into the generic failure.</p>

<h3>MSW in front of the real client</h3>
${ma('javascript', CODE.apiGia)}
${ra(gon(OUT['63-api-gia']))}
<ul>
<li><code>onUnhandledFrame: 'error'</code> — the MSW 3 name from lesson 3.2 — makes any request without a handler fail the test instead of reaching the real network.</li>
<li><code>server.use(...)</code> overrides the default answer for one test; <code>resetHandlers()</code> in <code>afterEach</code> restores it.</li>
<li><code>{ once: true }</code> answers a single request: the first load gets 500, the click on “Try again” gets the default 200.</li>
<li><code>HttpResponse.error()</code> makes <code>fetch</code> reject, as a lost connection does; the client’s caller catches it and shows the failed state.</li>
<li><code>within(table)</code> limits queries to one element; <code>getByRole('row', { name: /BE-201/ })</code> finds a row by its cell text.</li>
</ul>

<h3>Pitfall, measured: a relative URL in Node</h3>
${ma('javascript', CODE.url)}
${ra(URL_OUT)}
<p>In a browser <code>fetch('/api/admin/bookings')</code> is resolved against the page’s address. In a jsdom test the <code>fetch</code> is Node’s, which has no page, and it throws <code>TypeError: Failed to parse URL</code>. The screen did the right thing — it showed its failed state — but a test expecting the table waits one second and fails with a message about a missing table, far from the real cause. Give the client an absolute base URL in tests (<code>http://api.test</code>) and keep <code>''</code> in the browser.</p>

${lienKet({ khoa: 'react', bai: 'rx-6-1-fetch', title: 'Also in the React course — 6.1: fetching data', sub: 'How the loading, error and data states are built with useEffect; this lesson tests every one of them.', cta: 'OPEN LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Wire the booking form to the <em>real</em> client and let MSW answer 409: the alert reads “This slot is already taken. Choose another time.”</li>
<li>The network is down: the alert reads “Cannot reach the server. Check your connection.”</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th63)}
${ra(gon(OUT['63-th']))}
<p><code>onSubmit={client.createBooking}</code>: the form still knows nothing about HTTP, yet the request now goes through the real client, its headers and its JSON parsing. <code>setupServer()</code> starts with no handlers; each test adds exactly the answer it needs.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">MSW (Mock Service Worker)</span><span class="v">A library that intercepts HTTP requests and answers them from handlers you write.</span></div>
  <div class="kv"><span class="k">handler</span><span class="v">A rule such as <code>http.get(url, resolver)</code> that matches a request and returns a response.</span></div>
  <div class="kv"><span class="k">empty state</span><span class="v">What a screen shows when the request succeeded but there is nothing to list.</span></div>
  <div class="kv"><span class="k">base URL</span><span class="v">The scheme, host and port that relative API paths are joined to.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Pass <code>fetch</code> and the base URL into the client.</li>
<li>Test every state a user can see: loading, data, empty, forbidden, failed, retry.</li>
<li>MSW in front of the real client tests more real code than a stub.</li>
<li>Unknown requests must fail the test.</li>
<li>Use absolute URLs in tests — Node’s <code>fetch</code> has no page address.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Component có gọi API</h2>
<p class="lead">Danh sách admin tải mọi lượt đặt từ <code>GET /api/admin/bookings</code> — đúng route Chương 5 đã test từ phía máy chủ. Giờ ta test phía bên kia: màn hình hiện gì với từng câu trả lời máy chủ có thể đưa ra, kể cả những câu không ai lường trước.</p>

<h3>Một client dễ làm giả</h3>
${ma('javascript', CODE.api)}
<p>Client nhận <code>fetch</code> và base URL làm tham số. Nhờ vậy test có hai lựa chọn: truyền một client stub tí hon (<code>{ listAll: async () =&gt; ({ status: 200, data: [ROW] }) }</code>, dùng trong lời giải Lab 6), hoặc giữ client thật này và giả phần mạng bằng MSW, để phần dựng URL, header <code>Authorization</code> và phân tích JSON cũng chạy. Bài này đi đường thứ hai.</p>

<h3>Một màn hình, nhiều trạng thái</h3>
${ma('javascript', CODE.admin)}
${TT_VI}
<p>Mỗi trạng thái đều tìm được qua một role mà trình đọc màn hình đọc lên: <code>status</code> được đọc nhẹ nhàng khi thay đổi, <code>alert</code> thì ngắt ngang. Vì thế lỗi là một alert — và vì thế Lab 6 cài một con bug biến 403 thành lỗi chung.</p>

<h3>MSW đứng trước client thật</h3>
${ma('javascript', CODE.apiGia)}
${ra(gon(OUT['63-api-gia']))}
<ul>
<li><code>onUnhandledFrame: 'error'</code> — tên của MSW 3 từ bài 3.2 — khiến mọi request không có handler làm đỏ test thay vì chạm tới mạng thật.</li>
<li><code>server.use(...)</code> đè câu trả lời mặc định cho một test; <code>resetHandlers()</code> trong <code>afterEach</code> trả lại như cũ.</li>
<li><code>{ once: true }</code> chỉ trả lời một request: lần tải đầu nhận 500, cú bấm “Try again” nhận 200 mặc định.</li>
<li><code>HttpResponse.error()</code> làm <code>fetch</code> reject, giống như mất kết nối; nơi gọi client bắt lỗi và hiện trạng thái lỗi.</li>
<li><code>within(table)</code> giới hạn truy vấn trong một phần tử; <code>getByRole('row', { name: /BE-201/ })</code> tìm một dòng theo chữ trong ô.</li>
</ul>

<h3>Bẫy đo được: URL tương đối trong Node</h3>
${ma('javascript', CODE.url)}
${ra(URL_OUT)}
<p>Trên trình duyệt, <code>fetch('/api/admin/bookings')</code> được ghép với địa chỉ trang. Trong test jsdom, <code>fetch</code> là của Node, không có trang nào, và nó ném <code>TypeError: Failed to parse URL</code>. Màn hình làm đúng — hiện trạng thái lỗi — nhưng một test chờ bảng sẽ đợi một giây rồi đỏ với thông báo thiếu bảng, xa hẳn nguyên nhân thật. Trong test hãy cho client base URL tuyệt đối (<code>http://api.test</code>), còn trên trình duyệt giữ <code>''</code>.</p>

${lienKet({ khoa: 'react', bai: 'rx-6-1-fetch', title: 'Gặp lại ở khoá React — 6.1: tải dữ liệu', sub: 'Các trạng thái đang tải, lỗi và có dữ liệu được dựng bằng useEffect ra sao; bài này test từng trạng thái một.', cta: 'MỞ BÀI →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Nối form đặt phòng với client <em>thật</em> và để MSW trả 409: alert ghi “This slot is already taken. Choose another time.”</li>
<li>Mạng mất: alert ghi “Cannot reach the server. Check your connection.”</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th63)}
${ra(gon(OUT['63-th']))}
<p><code>onSubmit={client.createBooking}</code>: form vẫn không biết gì về HTTP, nhưng request giờ đi qua client thật, header và phần phân tích JSON của nó. <code>setupServer()</code> bắt đầu không có handler nào; mỗi test thêm đúng câu trả lời nó cần.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">MSW (Mock Service Worker)</span><span class="v">Thư viện chặn request HTTP và trả lời bằng các handler bạn viết.</span></div>
  <div class="kv"><span class="k">handler</span><span class="v">Một luật như <code>http.get(url, resolver)</code> khớp request và trả về response.</span></div>
  <div class="kv"><span class="k">empty state (trạng thái rỗng)</span><span class="v">Thứ màn hình hiện khi request thành công nhưng không có gì để liệt kê.</span></div>
  <div class="kv"><span class="k">base URL</span><span class="v">Phần scheme, host và port mà các đường dẫn API tương đối được ghép vào.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Truyền <code>fetch</code> và base URL vào client.</li>
<li>Test mọi trạng thái người dùng thấy được: đang tải, dữ liệu, rỗng, bị cấm, lỗi, thử lại.</li>
<li>MSW đứng trước client thật test được nhiều code thật hơn một stub.</li>
<li>Request lạ phải làm đỏ test.</li>
<li>Dùng URL tuyệt đối trong test — <code>fetch</code> của Node không có địa chỉ trang.</li>
</ul>
</div>
`,
};
