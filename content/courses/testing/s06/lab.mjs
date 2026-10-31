/**
 * Testing · Chương 6 · Lab 6 — Test component React: diệt 8 đột biến. BÀI MỚI 01/11/2026, slug tst-6-5-lab-react.
 * Máy chấm scripts/dot-bien-6.mjs (8 bug ở BookingForm + AdminBookings, chạy vitest --config vitest.web.config.js web/).
 * Output thật: bộ yếu 4 test xanh diệt 1/8; lời giải 16 test diệt 8/8; npm run test:unit vẫn 85 xanh.
 */
import G from '../giang/tst-lab-6.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|×|Tests |Test Files|Duration|mutants|killed|SURVIVED/.test(l)).join('\n');
const UNIT = OUT['lab6-unit'].split('\n').filter((l) => /^\$ |Tests |Test Files/.test(l)).join('\n');

const BUG_EN = `<table>
<thead><tr><th>#</th><th>File</th><th>Planted bug</th><th>What a user would notice</th></tr></thead>
<tbody>
<tr><td>1</td><td>BookingForm</td><td><code>role="status"</code> for errors too</td><td>a screen reader does not interrupt with the error</td></tr>
<tr><td>2</td><td>BookingForm</td><td><code>htmlFor={name}</code> instead of the input’s id</td><td>clicking a label does nothing; fields have no accessible name</td></tr>
<tr><td>3</td><td>BookingForm</td><td>the button is never disabled</td><td>a double click books twice</td></tr>
<tr><td>4</td><td>BookingForm</td><td><code>seats &gt; 201</code></td><td>201 seats reach the server</td></tr>
<tr><td>5</td><td>BookingForm</td><td>server field errors dropped</td><td>after a 400 the form says nothing</td></tr>
<tr><td>6</td><td>BookingForm</td><td>PENDING / CONFIRMED messages swapped</td><td>“Booked” for a booking that still waits for approval</td></tr>
<tr><td>7</td><td>AdminBookings</td><td>403 treated as a generic failure</td><td>“Try again” for someone who is simply not an admin</td></tr>
<tr><td>8</td><td>AdminBookings</td><td>Try again does nothing</td><td>the user is stuck on the error</td></tr>
</tbody></table>`;
const BUG_VI = `<table>
<thead><tr><th>#</th><th>File</th><th>Bug được cài</th><th>Người dùng sẽ thấy gì</th></tr></thead>
<tbody>
<tr><td>1</td><td>BookingForm</td><td><code>role="status"</code> cho cả lỗi</td><td>trình đọc màn hình không ngắt ngang để báo lỗi</td></tr>
<tr><td>2</td><td>BookingForm</td><td><code>htmlFor={name}</code> thay vì id của input</td><td>bấm label không làm gì; các trường không có tên truy cập được</td></tr>
<tr><td>3</td><td>BookingForm</td><td>nút không bao giờ bị khoá</td><td>bấm đúp là đặt hai lần</td></tr>
<tr><td>4</td><td>BookingForm</td><td><code>seats &gt; 201</code></td><td>201 chỗ lọt tới máy chủ</td></tr>
<tr><td>5</td><td>BookingForm</td><td>bỏ mất lỗi theo trường từ máy chủ</td><td>sau một lỗi 400 form im lặng</td></tr>
<tr><td>6</td><td>BookingForm</td><td>đảo thông báo PENDING / CONFIRMED</td><td>báo “Booked” cho lượt đặt còn chờ duyệt</td></tr>
<tr><td>7</td><td>AdminBookings</td><td>403 bị coi như lỗi chung</td><td>hiện “Try again” cho người đơn giản là không phải admin</td></tr>
<tr><td>8</td><td>AdminBookings</td><td>Try again không làm gì</td><td>người dùng mắc kẹt ở màn hình lỗi</td></tr>
</tbody></table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Mutants killed</td><td>4 (0.5 each)</td><td><code>node scripts/dot-bien-6.mjs</code></td></tr>
<tr><td>Queries by role and label only — no <code>querySelector</code>, no <code>getByTestId</code></td><td>2</td><td>read the tests</td></tr>
<tr><td>Every state: busy, 400 on a field, 409/422/500 alerts, 403, empty, retry</td><td>2</td><td>read the tests</td></tr>
<tr><td>user-event with <code>await</code>; <code>findBy</code> for anything that appears later</td><td>1</td><td>read the tests</td></tr>
<tr><td>Fast and isolated: cleanup, no real network, under 2 seconds</td><td>1</td><td><code>npm run test:web</code></td></tr>
</tbody></table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>Số đột biến bị diệt</td><td>4 (0,5 mỗi con)</td><td><code>node scripts/dot-bien-6.mjs</code></td></tr>
<tr><td>Chỉ truy vấn theo role và label — không <code>querySelector</code>, không <code>getByTestId</code></td><td>2</td><td>đọc test</td></tr>
<tr><td>Mọi trạng thái: bận, lỗi 400 ở trường, alert 409/422/500, 403, rỗng, thử lại</td><td>2</td><td>đọc test</td></tr>
<tr><td>user-event có <code>await</code>; <code>findBy</code> cho mọi thứ xuất hiện muộn</td><td>1</td><td>đọc test</td></tr>
<tr><td>Nhanh và cô lập: có dọn dẹp, không mạng thật, dưới 2 giây</td><td>1</td><td><code>npm run test:web</code></td></tr>
</tbody></table>`;

export default {
  title: 'Lab 6 — React components: kill 8 mutants in a form and a list|||Lab 6 — Component React: diệt 8 đột biến trong form và danh sách',
  slug: 'tst-6-5-lab-react',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 6, thang chấm 10 điểm: viết web/BookingForm.test.jsx và web/AdminBookings.test.jsx; script dot-bien-6.mjs cài 8 bug (hai bug trợ năng: lỗi không phải alert, label tách khỏi input; đặt hai lần; giới hạn 201 chỗ; mất lỗi 400; đảo thông báo; 403 thành lỗi chung; nút thử lại chết). Output thật: bộ yếu 4 test xanh diệt 1/8; lời giải 16 test diệt 8/8.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lab 6</span>
<h2>React components: kill 8 mutants</h2>
<p class="lead">About 75 minutes. Same grading as Labs 1–5, now for the screen. Two of the eight bugs are accessibility bugs: nothing changes for a sighted user, but a screen-reader user loses the error or the label. A test that queries like a user catches them; a test that queries like a developer does not.</p>

<h3>Setup</h3>
<ol>
<li>LabFlow Lite with <code>web/</code> (<code>api.js</code>, <code>BookingForm.jsx</code>, <code>AdminBookings.jsx</code>, <code>support.jsx</code>, <code>test-setup.js</code>) and <code>vitest.web.config.js</code> from lessons 6.1–6.3.</li>
<li>Create <code>scripts/dot-bien-6.mjs</code>:
${ma('javascript', CODE.dotBien6)}</li>
</ol>
${BUG_EN}

<h3>Your task</h3>
<p>Write <code>web/BookingForm.test.jsx</code> and <code>web/AdminBookings.test.jsx</code> so that <code>npm run test:web</code> is green and <code>node scripts/dot-bien-6.mjs</code> prints <strong>8/8</strong>. Change no component code.</p>

<h3>What a first attempt usually looks like</h3>
${ma('javascript', CODE.weak6)}
${ra(gon(OUT['lab6-weak-run']))}
${ra(gon(OUT['lab6-mut-weak']))}
<p>Four green tests, one bug noticed — and only by luck: the first test happens to wait for the word “Booked”. <code>querySelector('input[name=…]')</code> never touches a label (#2 survives); <code>findByText</code> ignores roles (#1); the mock answers at once, so no one clicks a busy button (#3); seats is always 20 (#4); there is no 400, no 403 and no retry (#5, #7, #8).</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li>Find every field with <code>getByLabelText</code> in one small test — a detached label then fails it.</li>
<li>Errors are <code>findByRole('alert')</code>, successes <code>findByRole('status')</code>; check the exact text.</li>
<li>Hold the answer with <code>deferred()</code>, click the busy button again, expect one call.</li>
<li>Seats on both sides of both limits: 0, 1, 200, 201 — one <code>it.each</code>.</li>
<li>A stub client whose <code>listAll</code> answers 500 then 200 tests “Try again”.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('javascript', CODE.formTest)}
${ma('javascript', CODE.adminTest)}
${ra(gon(OUT['lab6-ref']))}
${ra(gon(OUT['lab6-mut-strong']))}
${ra(UNIT)}
<p>Sixteen tests in under two seconds, 8/8, and the 85 unit tests untouched. Note the stub client <code>clientAnswering(...answers)</code>: each call returns the next answer — the smallest double that can express “fail, then succeed”.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run test:web</code> green; <code>npm run test:unit</code> still 85 green.</li>
<li><code>node scripts/dot-bien-6.mjs</code> prints 8/8.</li>
<li>No <code>querySelector</code> and no <code>getByTestId</code> in your tests.</li>
<li><code>git diff web/</code> shows only test files. Commit: <code>test: LabFlow Lite React screens (Lab 6, 8/8)</code>.</li>
</ul>

<!-- SODO-TST -->
<h3>🗺 Which query catches which Lab 6 bug</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">getByLabelText on every field</span><span class="lz-lnote">#2 detached labels</span></div>
  <div class="lz-layer"><span class="lz-lname">findByRole('alert') vs 'status'</span><span class="lz-lnote">#1 errors not announced</span></div>
  <div class="lz-layer"><span class="lz-lname">deferred() + second click</span><span class="lz-lnote">#3 double booking</span></div>
  <div class="lz-layer"><span class="lz-lname">seats 0 · 1 · 200 · 201</span><span class="lz-lnote">#4 off-by-one limit</span></div>
  <div class="lz-layer"><span class="lz-lname">400 · 403 · retry stubs</span><span class="lz-lnote">#5, #7, #8</span></div>
</div>
<div class="pitfall"><strong>Querying like a developer.</strong> <code>querySelector('input[name=…]')</code> and <code>fireEvent</code> never touch a label or a role, so accessibility bugs pass unnoticed: the first attempt in this lab let 7 of 8 bugs through.</div>
<h3>📌 Summary</h3>
<ul>
<li>Querying like a developer let 7 of 8 bugs through.</li>
<li>Role-and-label queries catch accessibility bugs for free.</li>
<li>Test every state, including busy, 403 and retry.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Lab 6</span>
<h2>Component React: diệt 8 đột biến</h2>
<p class="lead">Khoảng 75 phút. Cách chấm như Lab 1–5, giờ cho màn hình. Hai trong tám bug là bug trợ năng: người nhìn màn hình không thấy gì khác, nhưng người dùng trình đọc màn hình mất thông báo lỗi hoặc mất label. Test truy vấn như người dùng bắt được chúng; test truy vấn như lập trình viên thì không.</p>

<h3>Chuẩn bị</h3>
<ol>
<li>LabFlow Lite có <code>web/</code> (<code>api.js</code>, <code>BookingForm.jsx</code>, <code>AdminBookings.jsx</code>, <code>support.jsx</code>, <code>test-setup.js</code>) và <code>vitest.web.config.js</code> từ bài 6.1–6.3.</li>
<li>Tạo <code>scripts/dot-bien-6.mjs</code>:
${ma('javascript', CODE.dotBien6)}</li>
</ol>
${BUG_VI}

<h3>Nhiệm vụ</h3>
<p>Viết <code>web/BookingForm.test.jsx</code> và <code>web/AdminBookings.test.jsx</code> sao cho <code>npm run test:web</code> xanh và <code>node scripts/dot-bien-6.mjs</code> in <strong>8/8</strong>. Không sửa code component.</p>

<h3>Lần thử đầu thường trông thế nào</h3>
${ma('javascript', CODE.weak6)}
${ra(gon(OUT['lab6-weak-run']))}
${ra(gon(OUT['lab6-mut-weak']))}
<p>Bốn test xanh, bắt được một bug — mà là do may: test đầu tình cờ chờ chữ “Booked”. <code>querySelector('input[name=…]')</code> không bao giờ chạm vào label (con 2 sống); <code>findByText</code> bỏ qua role (con 1); mock trả lời ngay nên không ai bấm nút đang bận (con 3); số chỗ luôn là 20 (con 4); không có 400, không 403 và không thử lại (con 5, 7, 8).</p>

<h3>Thang chấm (10 điểm, đạt từ 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Tìm mọi trường bằng <code>getByLabelText</code> trong một test nhỏ — label bị tách là test đỏ.</li>
<li>Lỗi là <code>findByRole('alert')</code>, thành công là <code>findByRole('status')</code>; kiểm đúng câu chữ.</li>
<li>Giữ câu trả lời bằng <code>deferred()</code>, bấm lại nút đang bận, mong đúng một lần gọi.</li>
<li>Số chỗ ở hai phía của cả hai giới hạn: 0, 1, 200, 201 — một <code>it.each</code>.</li>
<li>Một client stub có <code>listAll</code> trả 500 rồi 200 để test “Try again”.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('javascript', CODE.formTest)}
${ma('javascript', CODE.adminTest)}
${ra(gon(OUT['lab6-ref']))}
${ra(gon(OUT['lab6-mut-strong']))}
${ra(UNIT)}
<p>Mười sáu test trong chưa tới hai giây, 8/8, và 85 unit test không bị đụng tới. Để ý client stub <code>clientAnswering(...answers)</code>: mỗi lần gọi trả câu trả lời kế tiếp — test double nhỏ nhất diễn đạt được “lỗi, rồi thành công”.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run test:web</code> xanh; <code>npm run test:unit</code> vẫn 85 xanh.</li>
<li><code>node scripts/dot-bien-6.mjs</code> in 8/8.</li>
<li>Không có <code>querySelector</code> hay <code>getByTestId</code> trong test của bạn.</li>
<li><code>git diff web/</code> chỉ có file test. Commit: <code>test: LabFlow Lite React screens (Lab 6, 8/8)</code>.</li>
</ul>

<h3>🗺 Truy vấn nào bắt bug nào của Lab 6</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">getByLabelText cho mọi trường</span><span class="lz-lnote">con 2 label bị tách</span></div>
  <div class="lz-layer"><span class="lz-lname">findByRole('alert') so với 'status'</span><span class="lz-lnote">con 1 lỗi không được đọc</span></div>
  <div class="lz-layer"><span class="lz-lname">deferred() + bấm lần hai</span><span class="lz-lnote">con 3 đặt hai lần</span></div>
  <div class="lz-layer"><span class="lz-lname">số chỗ 0 · 1 · 200 · 201</span><span class="lz-lnote">con 4 lệch một</span></div>
  <div class="lz-layer"><span class="lz-lname">stub 400 · 403 · thử lại</span><span class="lz-lnote">con 5, 7, 8</span></div>
</div>
<div class="pitfall"><strong>Truy vấn như lập trình viên.</strong> <code>querySelector('input[name=…]')</code> và <code>fireEvent</code> không bao giờ chạm tới label hay role, nên bug trợ năng lọt qua: lần thử đầu của lab này để lọt 7/8 bug.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Truy vấn như lập trình viên để lọt 7/8 bug.</li>
<li>Truy vấn theo role và label bắt bug trợ năng mà không tốn thêm gì.</li>
<li>Test mọi trạng thái, kể cả bận, 403 và thử lại.</li>
</ul>
</div>
`,
};
