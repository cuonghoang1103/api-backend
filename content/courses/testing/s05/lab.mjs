/**
 * Testing · Chương 5 · Lab 5 — Test API HTTP: diệt 8 đột biến. BÀI MỚI 01/11/2026, slug tst-5-5-lab-api.
 * Máy chấm scripts/dot-bien-5.mjs (8 bug ở route, xác thực, schema, đổi mã lỗi). Output thật: bộ yếu 4 test xanh 0/8; lời giải 12 test 8/8; npm run test:unit 85 xanh (cả TZ=UTC).
 */
import G from '../giang/tst-lab-5.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|×|Tests |Test Files|Duration|mutants|killed|SURVIVED/.test(l)).join('\n');
const UNIT = OUT['lab5-unit'].split('\n').filter((l) => /^\$ |^ [✓❯] |Tests |Test Files|Duration/.test(l)).join('\n');
const UTC = OUT['lab5-unit-utc'].split('\n').filter((l) => /^\$ |Tests |Test Files/.test(l)).join('\n');

const BUG_EN = `<table>
<thead><tr><th>#</th><th>File</th><th>Planted bug</th><th>What a user would notice</th></tr></thead>
<tbody>
<tr><td>1</td><td>server.js</td><td><code>role !== 'STUDENT'</code> may read any booking</td><td>lecturers see students’ bookings</td></tr>
<tr><td>2</td><td>server.js</td><td><code>if (!booking)</code> instead of <code>if (!mine)</code></td><td>anyone reads anyone’s booking (IDOR)</td></tr>
<tr><td>3</td><td>server.js</td><td>403 answered as 401</td><td>the app asks a logged-in user to log in again</td></tr>
<tr><td>4</td><td>schemas.js</td><td><code>z.object</code> instead of <code>z.strictObject</code></td><td>extra fields such as <code>role</code> silently dropped instead of refused</td></tr>
<tr><td>5</td><td>server.js</td><td>201 → 200</td><td>clients treat “created” as “read”</td></tr>
<tr><td>6</td><td>server.js</td><td>no Location header</td><td>the app cannot open the new booking</td></tr>
<tr><td>7</td><td>server.js</td><td>OVERLAP → 400</td><td>“your request is wrong” instead of “slot taken”</td></tr>
<tr><td>8</td><td>auth.js</td><td>expiry ignores the given clock</td><td>nothing today — but expiry can no longer be tested</td></tr>
</tbody></table>`;
const BUG_VI = `<table>
<thead><tr><th>#</th><th>File</th><th>Bug được cài</th><th>Người dùng sẽ thấy gì</th></tr></thead>
<tbody>
<tr><td>1</td><td>server.js</td><td><code>role !== 'STUDENT'</code> được đọc mọi lượt đặt</td><td>giảng viên xem được lượt đặt của sinh viên</td></tr>
<tr><td>2</td><td>server.js</td><td><code>if (!booking)</code> thay vì <code>if (!mine)</code></td><td>ai cũng đọc được lượt đặt của ai (IDOR)</td></tr>
<tr><td>3</td><td>server.js</td><td>403 trả thành 401</td><td>app bắt người đã đăng nhập đăng nhập lại</td></tr>
<tr><td>4</td><td>schemas.js</td><td><code>z.object</code> thay vì <code>z.strictObject</code></td><td>trường thừa như <code>role</code> bị lặng lẽ bỏ đi thay vì bị từ chối</td></tr>
<tr><td>5</td><td>server.js</td><td>201 → 200</td><td>client hiểu “đã tạo” thành “đã đọc”</td></tr>
<tr><td>6</td><td>server.js</td><td>thiếu header Location</td><td>app không mở được lượt đặt vừa tạo</td></tr>
<tr><td>7</td><td>server.js</td><td>OVERLAP → 400</td><td>“request của bạn sai” thay vì “khung giờ đã có người đặt”</td></tr>
<tr><td>8</td><td>auth.js</td><td>hết hạn bỏ qua đồng hồ được truyền vào</td><td>hôm nay chưa thấy gì — nhưng không còn test được chuyện hết hạn</td></tr>
</tbody></table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Mutants killed</td><td>4 (0.5 each)</td><td><code>node scripts/dot-bien-5.mjs</code></td></tr>
<tr><td>Access control as a table: every role × own / other people’s data; the admin route for every role</td><td>2</td><td>read the tests</td></tr>
<tr><td>Exact statuses, Location and full bodies — no “&lt; 300” or “≥ 400”</td><td>2</td><td>read the tests</td></tr>
<tr><td>Real tokens with a test secret; a fixed clock for expiry</td><td>1</td><td>no auth mocks</td></tr>
<tr><td>A fresh app per test, no <code>listen()</code> in tests, the file runs in under a second</td><td>1</td><td><code>npm run test:unit</code></td></tr>
</tbody></table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>Số đột biến bị diệt</td><td>4 (0,5 mỗi con)</td><td><code>node scripts/dot-bien-5.mjs</code></td></tr>
<tr><td>Phân quyền dạng bảng: mọi vai trò × dữ liệu của mình / của người khác; route admin với mọi vai trò</td><td>2</td><td>đọc test</td></tr>
<tr><td>Đúng mã trạng thái, Location và cả body — không dùng “&lt; 300” hay “≥ 400”</td><td>2</td><td>đọc test</td></tr>
<tr><td>Token thật với khoá cho test; đồng hồ cố định khi test hết hạn</td><td>1</td><td>không mock xác thực</td></tr>
<tr><td>Mỗi test một app mới, không gọi <code>listen()</code> trong test, cả file chạy dưới một giây</td><td>1</td><td><code>npm run test:unit</code></td></tr>
</tbody></table>`;

export default {
  title: 'Lab 5 — API tests: kill 8 mutants in routes, auth and errors|||Lab 5 — Test API: diệt 8 đột biến ở route, xác thực và lỗi',
  slug: 'tst-5-5-lab-api',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 5, thang chấm 10 điểm: viết src/api/server.test.js bằng Supertest cho API LabFlow Lite; script dot-bien-5.mjs cài 8 bug (hai kiểu lộ dữ liệu người khác, 403→401, schema bỏ qua khoá lạ, 201→200, thiếu Location, 409→400, hết hạn theo nhầm đồng hồ). Output thật: bộ yếu 4 test xanh diệt 0/8; lời giải 12 test diệt 8/8; cả bộ unit 85 test xanh.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lab 5</span>
<h2>API tests: kill 8 mutants</h2>
<p class="lead">About 75 minutes. Same grading as Labs 1–4: a script plants one bug at a time and runs your tests. New this time: half of the bugs are security bugs — the kind that leak data while every screen still looks fine.</p>

<h3>Setup</h3>
<ol>
<li>LabFlow Lite with <code>src/api/</code> (<code>server.js</code>, <code>auth.js</code>, <code>schemas.js</code>) and <code>test/support/api.js</code> from lessons 5.1–5.3.</li>
<li>Create <code>scripts/dot-bien-5.mjs</code>:
${ma('javascript', CODE.dotBien5)}</li>
</ol>
${BUG_EN}

<h3>Your task</h3>
<p>Write <code>src/api/server.test.js</code> so that <code>npm run test:unit</code> is green and <code>node scripts/dot-bien-5.mjs</code> prints <strong>8/8</strong>. Change no code in <code>src/api/</code> except your test file.</p>

<h3>What a first attempt usually looks like</h3>
${ma('javascript', CODE.weak5)}
${ra(gon(OUT['lab5-weak-run']))}
${ra(gon(OUT['lab5-mut-weak']))}
<p>Four green tests, zero bugs noticed. <code>toBeLessThan(300)</code> accepts 200 as well as 201; <code>toBeGreaterThanOrEqual(400)</code> accepts 401 as well as 403; only the owner ever reads, so nobody tries someone else’s data; no header is checked; no clock is moved. Each test answers “did something happen?”, not “did exactly the right thing happen?”.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li>Write <code>it.each</code> rows: who asks (owner, another student, lecturer, admin), for whose booking, and the exact status.</li>
<li>Never use a range for a status. Write 201, 401, 403.</li>
<li>Send <code>role: 'ADMIN'</code> in a body and expect 400 with an “Unrecognized key” detail.</li>
<li>Book the same slot twice: 409, not just “an error”.</li>
<li>Use <code>makeApi({ now: () =&gt; clock })</code> with a clock in 2030; move it past the expiry.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('javascript', CODE.serverTest)}
${ra(gon(OUT['lab5-ref']))}
${ra(gon(OUT['lab5-mut-strong']))}
${ra(UNIT)}
${ra(UTC)}
<p>Twelve tests, 8/8, and the whole unit suite — Labs 1–3 included — is 85 green tests in under half a second, with and without <code>TZ=UTC</code>. Why mutant #8 needs a clock in 2030: with the real clock a token signed “at 09:00 today” may still be valid or already expired depending on when you run the test; a far-future fixed clock makes the answer depend only on the code.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run test:unit</code> green, no <code>listen()</code> in any test.</li>
<li><code>node scripts/dot-bien-5.mjs</code> prints 8/8; Labs 1–3 still print 8/8.</li>
<li><code>git diff src/</code> shows only test files.</li>
<li>Commit: <code>test: LabFlow Lite HTTP API (Lab 5, 8/8)</code>.</li>
</ul>

<!-- SODO-TST -->
<h3>🗺 The Lab 5 access table</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Owner reads booking 1</span><span class="lz-lnote">200</span></div>
  <div class="lz-layer"><span class="lz-lname">Another student</span><span class="lz-lnote">404</span></div>
  <div class="lz-layer"><span class="lz-lname">Lecturer</span><span class="lz-lnote">404</span></div>
  <div class="lz-layer"><span class="lz-lname">Admin</span><span class="lz-lnote">200</span></div>
  <div class="lz-layer"><span class="lz-lname">Student / lecturer on the admin list</span><span class="lz-lnote">403</span></div>
  <div class="lz-layer"><span class="lz-lname">Expired token (fixed clock)</span><span class="lz-lnote">401</span></div>
</div>
<div class="pitfall"><strong>Status ranges.</strong> <code>toBeLessThan(300)</code> accepts 200 for a create and <code>toBeGreaterThanOrEqual(400)</code> accepts 401 for a 403. The first attempt in this lab killed 0 of 8 mutants with exactly these checks.</div>
<h3>📌 Summary</h3>
<ul>
<li>Status ranges hide bugs: the first attempt killed 0 of 8.</li>
<li>Access control is a table of roles × whose data; test every cell.</li>
<li>Check the exact status, the headers and the full body.</li>
<li>A fixed clock makes expiry testable.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Lab 5</span>
<h2>Test API: diệt 8 đột biến</h2>
<p class="lead">Khoảng 75 phút. Cách chấm như Lab 1–4: một script cài từng con bug một rồi chạy test của bạn. Điểm mới: một nửa số bug là bug bảo mật — loại làm lộ dữ liệu trong khi mọi màn hình trông vẫn bình thường.</p>

<h3>Chuẩn bị</h3>
<ol>
<li>LabFlow Lite có <code>src/api/</code> (<code>server.js</code>, <code>auth.js</code>, <code>schemas.js</code>) và <code>test/support/api.js</code> từ bài 5.1–5.3.</li>
<li>Tạo <code>scripts/dot-bien-5.mjs</code>:
${ma('javascript', CODE.dotBien5)}</li>
</ol>
${BUG_VI}

<h3>Nhiệm vụ</h3>
<p>Viết <code>src/api/server.test.js</code> sao cho <code>npm run test:unit</code> xanh và <code>node scripts/dot-bien-5.mjs</code> in <strong>8/8</strong>. Không sửa code nào trong <code>src/api/</code> ngoài file test của bạn.</p>

<h3>Lần thử đầu thường trông thế nào</h3>
${ma('javascript', CODE.weak5)}
${ra(gon(OUT['lab5-weak-run']))}
${ra(gon(OUT['lab5-mut-weak']))}
<p>Bốn test xanh, không phát hiện con bug nào. <code>toBeLessThan(300)</code> chấp nhận 200 lẫn 201; <code>toBeGreaterThanOrEqual(400)</code> chấp nhận 401 lẫn 403; chỉ chủ sở hữu từng đọc, nên không ai thử dữ liệu của người khác; không header nào được kiểm; đồng hồ không hề dịch. Mỗi test trả lời “có chuyện gì xảy ra không?”, chứ không phải “có đúng chuyện cần xảy ra không?”.</p>

<h3>Thang chấm (10 điểm, đạt từ 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Viết các dòng <code>it.each</code>: ai hỏi (chủ, sinh viên khác, giảng viên, admin), hỏi lượt đặt của ai, và mã trạng thái chính xác.</li>
<li>Không bao giờ dùng khoảng cho mã trạng thái. Viết 201, 401, 403.</li>
<li>Gửi <code>role: 'ADMIN'</code> trong body và mong 400 kèm chi tiết “Unrecognized key”.</li>
<li>Đặt cùng một khung giờ hai lần: 409, không chỉ là “một lỗi nào đó”.</li>
<li>Dùng <code>makeApi({ now: () =&gt; clock })</code> với đồng hồ ở năm 2030; dịch nó qua mốc hết hạn.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('javascript', CODE.serverTest)}
${ra(gon(OUT['lab5-ref']))}
${ra(gon(OUT['lab5-mut-strong']))}
${ra(UNIT)}
${ra(UTC)}
<p>Mười hai test, 8/8, và cả bộ unit — gồm cả Lab 1–3 — là 85 test xanh trong chưa tới nửa giây, có và không có <code>TZ=UTC</code>. Vì sao đột biến 8 cần đồng hồ ở năm 2030: với đồng hồ thật, một token ký “lúc 09:00 hôm nay” có thể còn hạn hoặc đã hết hạn tuỳ lúc bạn chạy test; một đồng hồ cố định ở tương lai xa làm kết quả chỉ phụ thuộc vào code.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run test:unit</code> xanh, không test nào gọi <code>listen()</code>.</li>
<li><code>node scripts/dot-bien-5.mjs</code> in 8/8; Lab 1–3 vẫn in 8/8.</li>
<li><code>git diff src/</code> chỉ có file test.</li>
<li>Commit: <code>test: LabFlow Lite HTTP API (Lab 5, 8/8)</code>.</li>
</ul>

<h3>🗺 Bảng phân quyền của Lab 5</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chủ sở hữu đọc lượt 1</span><span class="lz-lnote">200</span></div>
  <div class="lz-layer"><span class="lz-lname">Sinh viên khác</span><span class="lz-lnote">404</span></div>
  <div class="lz-layer"><span class="lz-lname">Giảng viên</span><span class="lz-lnote">404</span></div>
  <div class="lz-layer"><span class="lz-lname">Admin</span><span class="lz-lnote">200</span></div>
  <div class="lz-layer"><span class="lz-lname">Sinh viên / giảng viên ở danh sách admin</span><span class="lz-lnote">403</span></div>
  <div class="lz-layer"><span class="lz-lname">Token hết hạn (đồng hồ cố định)</span><span class="lz-lnote">401</span></div>
</div>
<div class="pitfall"><strong>Khoảng mã trạng thái.</strong> <code>toBeLessThan(300)</code> chấp nhận 200 cho thao tác tạo và <code>toBeGreaterThanOrEqual(400)</code> chấp nhận 401 thay cho 403. Lần thử đầu của lab này diệt 0/8 đột biến với đúng những phép kiểm đó.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Khoảng mã trạng thái che giấu bug: lần thử đầu diệt 0/8.</li>
<li>Phân quyền là một bảng vai trò × dữ liệu của ai; test từng ô.</li>
<li>Kiểm đúng mã trạng thái, header và cả body.</li>
<li>Đồng hồ cố định làm hết hạn trở nên test được.</li>
</ul>
</div>
`,
};
