/**
 * Testing · Chương 5 · 5.1 — Supertest: gửi request mà không cần bật server. Slug giữ từ khung: tst-5-1-supertest.
 * Chạy thật: Express 5 + Supertest 7; server thật + curl; bỏ trường status ⇒ test chỉ-kiểm-status vẫn xanh.
 */
import G from '../giang/tst-05-1.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |^planted|✓|×|❯ demo|Tests /.test(l)).join('\n');
const REPO = CODE.service.split('\n').filter((l, i, a) => {
  const k = a.findIndex((x) => x.includes('async findById'));
  return i >= k && i <= k + 7;
}).join('\n');

const MAIN_OUT = OUT['51-main'].split('\n').slice(0, 7).join('\n');

const ROUTES_EN = `<table>
<thead><tr><th>Route</th><th>Who</th><th>Success</th><th>Errors</th></tr></thead>
<tbody>
<tr><td><code>GET /api/health</code></td><td>anyone</td><td>200 <code>{ status: 'ok' }</code></td><td>—</td></tr>
<tr><td><code>POST /api/bookings</code></td><td>logged in</td><td>201 + <code>Location</code> + booking</td><td>400, 401, 409, 422</td></tr>
<tr><td><code>GET /api/bookings/:id</code></td><td>owner or ADMIN</td><td>200 booking</td><td>401, 404</td></tr>
<tr><td><code>GET /api/admin/bookings</code></td><td>ADMIN</td><td>200 list</td><td>401, 403</td></tr>
</tbody></table>`;
const ROUTES_VI = `<table>
<thead><tr><th>Route</th><th>Ai được gọi</th><th>Thành công</th><th>Lỗi</th></tr></thead>
<tbody>
<tr><td><code>GET /api/health</code></td><td>bất kỳ ai</td><td>200 <code>{ status: 'ok' }</code></td><td>—</td></tr>
<tr><td><code>POST /api/bookings</code></td><td>đã đăng nhập</td><td>201 + <code>Location</code> + lượt đặt</td><td>400, 401, 409, 422</td></tr>
<tr><td><code>GET /api/bookings/:id</code></td><td>chủ lượt đặt hoặc ADMIN</td><td>200 lượt đặt</td><td>401, 404</td></tr>
<tr><td><code>GET /api/admin/bookings</code></td><td>ADMIN</td><td>200 danh sách</td><td>401, 403</td></tr>
</tbody></table>`;

export default {
  title: '5.1 — Supertest: requests without a running server|||5.1 — Supertest: gửi request mà không cần bật server',
  slug: 'tst-5-1-supertest',
  type: 'LESSON',
  isFreePreview: true,
  description: 'API HTTP của LabFlow Lite (Express 5, bốn route, một định dạng lỗi); tách createApp khỏi listen; Supertest khẳng định mã trạng thái, header, body và đi theo Location; so với server thật + curl; đo thật: bỏ trường status thì test chỉ-kiểm-status vẫn xanh.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Supertest: requests without a running server</h2>
<p class="lead">So far we called LabFlow Lite’s functions directly. Its users never do that: a phone app or a browser sends HTTP requests. Chapter 5 tests the API from that side — through real HTTP, but without starting the server yourself, choosing a port or waiting.</p>

<h3>The API</h3>
<p>Install the two new dependencies — <code>npm install --save-exact zod@4.6.7 jose@6.2.12</code> (validation in 5.3, tokens in 5.2) — then add <code>src/api/server.js</code>:</p>
${ma('javascript', CODE.server)}
${ROUTES_EN}
<p>The repository gained two methods for reading back (the PostgreSQL adapter of Chapter 4 would need the same two):</p>
${ma('javascript', REPO)}

<h3>Build the app, do not start it</h3>
<p><code>createApp</code> returns an Express app and never calls <code>listen</code>. Only the real entry point does:</p>
${ma('javascript', CODE.main)}
${ra(MAIN_OUT)}
<p>That split is the whole trick. Tests import <code>createApp</code>, give it a fresh in-memory repository and a test secret, and get an app that exists only for that test:</p>
${ma('javascript', CODE.apiSupport)}

<h3>Supertest: status, headers and body</h3>
${ma('javascript', CODE.supertest)}
${ra(gon(OUT['51-supertest']))}
<ul>
<li><code>request(app)</code> starts the app on a temporary port for that request and closes it afterwards — no port to choose, nothing left running.</li>
<li><code>.set(header, value)</code> and <code>.send(body)</code> build the request; the response has <code>status</code>, <code>headers</code> and the parsed JSON <code>body</code>.</li>
<li>201 Created must tell the client where the new booking lives. The second test follows that <code>Location</code> exactly as an app would.</li>
<li>Rules run for real: 06:00 is 422 <code>OUTSIDE_HOURS</code>, the same slot twice is 409 <code>OVERLAP</code> — lesson 5.3 explains the codes.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Measured — a status-only test does not see a broken body.</strong></p>
${ma('javascript', CODE.chiStatus)}
<p>We removed <code>status</code> from the public booking with <code>scripts/thu-loi.mjs</code> (lesson 3.3):</p>
${ra(gon(OUT['51-bo-status']))}
<p>The status-only test stays green; the test that compares the body turns red. Clients read bodies — tests must assert them too, along with the headers that matter.</p>
</div>

${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-3-supertest', title: 'Also in the Node.js course — 14.3: Supertest', sub: 'The same split between app and listen, with status codes as a contract and a regression test for a real IDOR fixed on this site.', cta: 'OPEN LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>A 31-seat student booking: 201, status <code>PENDING</code>, and a GET on its Location returns the same body.</li>
<li>A second student books 10:00–12:00: id 2 and Location <code>/api/bookings/2</code>.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th51)}
${ra(gon(OUT['51-th']))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Supertest</span><span class="v">A library that sends HTTP requests to an app object and lets you assert on the response.</span></div>
  <div class="kv"><span class="k">201 Created + Location</span><span class="v">The resource was created; the header says where it lives.</span></div>
  <div class="kv"><span class="k">entry point</span><span class="v">The file that starts the real server (<code>main.js</code>); tests never import it.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 One Supertest request</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">makeApi()</div><div class="lz-d">a fresh app, memory repo, test secret</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">request(app)</div><div class="lz-d">Supertest opens a temporary port</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Express</div><div class="lz-d">routing, JSON, middleware, error mapping</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">bookLab</div><div class="lz-d">the real business rules</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Assert</div><div class="lz-d">status, Location, the whole body</div></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Export the app; only one file calls <code>listen</code>.</li>
<li><code>request(app)</code> sends real HTTP through Express on a temporary port it opens and closes itself.</li>
<li>Assert status, the headers that matter, and the whole body.</li>
<li>A status-only test misses broken bodies — measured.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Supertest: gửi request mà không cần bật server</h2>
<p class="lead">Tới giờ ta gọi thẳng các hàm của LabFlow Lite. Người dùng thì không bao giờ làm vậy: ứng dụng điện thoại hay trình duyệt gửi request HTTP. Chương 5 test API từ phía đó — qua HTTP thật, nhưng không phải tự bật server, không phải chọn cổng, không phải chờ.</p>

<h3>API</h3>
<p>Cài hai phụ thuộc mới — <code>npm install --save-exact zod@4.6.7 jose@6.2.12</code> (kiểm dữ liệu ở 5.3, token ở 5.2) — rồi thêm <code>src/api/server.js</code>:</p>
${ma('javascript', CODE.server)}
${ROUTES_VI}
<p>Repository có thêm hai phương thức để đọc lại (adapter PostgreSQL của Chương 4 cũng sẽ cần đúng hai phương thức này):</p>
${ma('javascript', REPO)}

<h3>Dựng app, đừng bật nó</h3>
<p><code>createApp</code> trả về một app Express và không bao giờ gọi <code>listen</code>. Chỉ điểm khởi chạy thật mới gọi:</p>
${ma('javascript', CODE.main)}
${ra(MAIN_OUT)}
<p>Toàn bộ mẹo nằm ở cách tách đó. Test import <code>createApp</code>, đưa cho nó một repository bộ nhớ mới và một khoá bí mật dành cho test, và nhận về một app chỉ tồn tại cho riêng test đó:</p>
${ma('javascript', CODE.apiSupport)}

<h3>Supertest: mã trạng thái, header và body</h3>
${ma('javascript', CODE.supertest)}
${ra(gon(OUT['51-supertest']))}
<ul>
<li><code>request(app)</code> bật app trên một cổng tạm cho đúng request đó rồi đóng lại — không phải chọn cổng, không có gì chạy sót.</li>
<li><code>.set(header, value)</code> và <code>.send(body)</code> dựng request; phản hồi có <code>status</code>, <code>headers</code> và <code>body</code> JSON đã được phân tích.</li>
<li>201 Created phải nói cho client biết lượt đặt mới nằm ở đâu. Test thứ hai đi theo <code>Location</code> đúng như một ứng dụng sẽ làm.</li>
<li>Luật chạy thật: 06:00 là 422 <code>OUTSIDE_HOURS</code>, cùng khung giờ hai lần là 409 <code>OVERLAP</code> — bài 5.3 giải thích các mã này.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Đo thật — test chỉ kiểm mã trạng thái không thấy body hỏng.</strong></p>
${ma('javascript', CODE.chiStatus)}
<p>Ta bỏ <code>status</code> khỏi lượt đặt công khai bằng <code>scripts/thu-loi.mjs</code> (bài 3.3):</p>
${ra(gon(OUT['51-bo-status']))}
<p>Test chỉ kiểm mã trạng thái vẫn xanh; test so body chuyển đỏ. Client đọc body — test cũng phải khẳng định body, cùng những header quan trọng.</p>
</div>

${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-3-supertest', title: 'Gặp lại ở khoá Node.js — 14.3: Supertest', sub: 'Cùng cách tách app khỏi listen, mã trạng thái như một hợp đồng, và test hồi quy cho một lỗ IDOR thật đã sửa trên chính trang này.', cta: 'MỞ BÀI →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Lượt đặt 31 chỗ của sinh viên: 201, trạng thái <code>PENDING</code>, và GET theo Location của nó trả về đúng body đó.</li>
<li>Sinh viên thứ hai đặt 10:00–12:00: id 2 và Location <code>/api/bookings/2</code>.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th51)}
${ra(gon(OUT['51-th']))}
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Supertest</span><span class="v">Thư viện gửi request HTTP tới một object app và cho bạn khẳng định trên phản hồi.</span></div>
  <div class="kv"><span class="k">201 Created + Location</span><span class="v">Tài nguyên đã được tạo; header cho biết nó nằm ở đâu.</span></div>
  <div class="kv"><span class="k">entry point (điểm khởi chạy)</span><span class="v">File bật server thật (<code>main.js</code>); test không bao giờ import nó.</span></div>
</div>

<h3>🗺 Một request Supertest</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">makeApi()</div><div class="lz-d">một app mới, repo trong bộ nhớ, khoá cho test</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">request(app)</div><div class="lz-d">Supertest mở một cổng tạm</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Express</div><div class="lz-d">định tuyến, JSON, middleware, đổi mã lỗi</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">bookLab</div><div class="lz-d">luật nghiệp vụ thật</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Khẳng định</div><div class="lz-d">mã trạng thái, Location, cả body</div></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Xuất app ra; chỉ một file gọi <code>listen</code>.</li>
<li><code>request(app)</code> gửi HTTP thật qua Express trên một cổng tạm do nó tự mở và tự đóng.</li>
<li>Khẳng định mã trạng thái, các header quan trọng, và toàn bộ body.</li>
<li>Test chỉ kiểm mã trạng thái bỏ lọt body hỏng — đo được.</li>
</ul>
</div>
`,
};
