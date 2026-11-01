/**
 * Testing · Chương 11 · 11.3 — Test frontend và luồng đầy đủ. Slug giữ từ khung: tst-11-3-frontend.
 * Màn hình MyBookings (web/MyBookings.jsx) + 8 test Testing Library; điểm mù của client giả (URL '/cancellation': 24 test web xanh, E2E đỏ);
 * test "chỉ kiểm mock" (demo11/ui/kiem-mock.test.jsx) xanh khi dòng không bao giờ đổi; một hành trình Playwright (e2e/huy-phong.spec.js);
 * hai bẫy (demo11/pw/nut-chung.spec.js strict mode, demo11/pw/qua-gio.spec.js bom giờ); test cũ chập chờn vì freshLab trùng QA-912
 * (900 mã, 25 test ≈ 28%) ⇒ 608.400 mã + annotation + scripts/va-cham-lab.mjs; thực hành riêng tư (demo11/pw/rieng-tu.spec.js).
 * Mọi output ở ./_ma.mjs (sinh tự động, 113-*).
 */
import G from '../giang/tst-11-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (k, re) => OUT[k].split('\n').filter((l) => re.test(l)).join('\n');
const dong = (src, a, b) => src.split('\n').slice(a - 1, b).join('\n');

const WEB_CANCEL = dong(CODE.web, 31, 49);
const API_LINES = dong(CODE.webApi, 13, 14);
const T_WEB = loc('113-web', /^\$ |✓ MyBookings|“Cancelling…”|409 ALREADY|Tests {2}|Duration/);
const STUB_WEB = loc('113-stub-web', /^planted|^ ✓ web|Tests {2}/);
const STUB_E2E = loc('113-stub-e2e', /^planted|✘|Expected:|Error: element|failed$|passed \(/);
const T_MOCK = loc('113-kiem-mock', /^planted|✓ demo11|×|Expected element|^ {2}CANCELLED|^Received|^ {2}BE-|Tests {2}/);
const E2E = dong(CODE.e2e, 18, 30);
const T_E2E = loc('113-e2e', /^\$ |✓ |passed \(/);
const T_STRICT = loc('113-nut-chung', /✘|strict mode|^ {8}[12]\)|failed$/);
const T_BOMB = loc('113-qua-gio', /✘|Expected substring|Error: element|failed$/);
const T_FLAKY = loc('113-flaky', /^\$ |✘|strict mode|^ {8}[12]\)|failed$|passed \(/);
const T_VC_TRUOC = OUT['113-va-cham-truoc'];
const T_VC_SAU = OUT['113-e2e-all'];
const TH = dong(CODE.th113, 15, 21);
const TH_XANH = loc('113-th-xanh', /^\$ |✓ |passed \(/);
const TH_DO = loc('113-th-do', /^planted|✘|Expected: 0|Received: 1|failed$/);

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Component tests</div><div class="lz-d">every state of one screen, stub client, about one second</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Planted bugs</div><div class="lz-d">find what those tests cannot see</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">One journey</div><div class="lz-d">real browser, real server: only what no lower layer can see</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Stable data</div><div class="lz-d">a lab code per test, dates relative to today</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Test component</div><div class="lz-d">mọi trạng thái của một màn hình, client giả, khoảng một giây</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Cài bug</div><div class="lz-d">tìm thứ các test đó không thấy</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Một hành trình</div><div class="lz-d">trình duyệt thật, server thật: chỉ cho thứ không tầng dưới nào thấy</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Dữ liệu ổn định</div><div class="lz-d">mỗi test một mã phòng, ngày tính từ hôm nay</div></div>
</div>`;

const KHI_EN = `<table>
<thead><tr><th>You want to know…</th><th>Layer</th><th>Measured here</th></tr></thead>
<tbody>
<tr><td>Every state of a screen: loading, failed, empty, 422, 409, no network, double click</td><td>Component test (Testing Library, stub client)</td><td>8 tests in 1.14 s</td></tr>
<tr><td>That the screen and the API agree on a URL, a status code, a JSON shape</td><td>One E2E journey (or an API contract test, 11.2)</td><td>the wrong URL: 24 component tests green, the journey red</td></tr>
</tbody></table>`;
const KHI_VI = `<table>
<thead><tr><th>Bạn muốn biết…</th><th>Tầng</th><th>Đo ở đây</th></tr></thead>
<tbody>
<tr><td>Mọi trạng thái của một màn hình: đang tải, lỗi, rỗng, 422, 409, mất mạng, bấm đúp</td><td>Test component (Testing Library, client giả)</td><td>8 test trong 1,14 giây</td></tr>
<tr><td>Màn hình và API khớp nhau về URL, mã trạng thái, dạng JSON</td><td>Một hành trình E2E (hoặc test hợp đồng API, 11.2)</td><td>URL sai: 24 test component xanh, hành trình đỏ</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🐙', 'Testing Library — Guiding Principles', '“The more your tests resemble the way your software is used, the more confidence they can give you.”', 'https://testing-library.com/docs/guiding-principles'),
  nguon('🎭', 'Playwright — Locators', 'getByRole, strictness, filtering a row before its button.', 'https://playwright.dev/docs/locators'),
].join('\n');

export default {
  title: '11.3 — Testing the frontend and the full flow|||11.3 — Test frontend và luồng đầy đủ',
  slug: 'tst-11-3-frontend',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Test màn hình My bookings của US-11 và một hành trình đầy đủ trên trình duyệt thật. Tám test Testing Library với client giả phủ bốn trạng thái, bấm đúp (deferred), 422, 409 và mất mạng; rồi đo điểm mù của client giả: URL sai "/cancellation" làm 24 test web vẫn xanh trong khi hành trình Playwright đỏ và người dùng thấy "Cannot reach the server"; một test chỉ kiểm mock vẫn xanh khi dòng không bao giờ đổi. Một hành trình Playwright: đặt → My bookings → huỷ đúng nút trong dòng → tải lại để thấy thứ server lưu → đặt lại khung đó. Hai bẫy đo thật: strict mode với "nút Cancel" khi có hai dòng, và quả bom giờ 07:00. Một test cũ trở nên chập chờn sau khi đổi tên để truy vết: freshLab cho hai test Firefox cùng QA-912 (900 mã, 25 test ≈ 28%, bài toán ngày sinh) — sửa bằng 608.400 mã, annotation và script tìm mã trùng.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Testing the frontend and the full flow</h2>
<p class="lead">A student never sees the rule or the database of 11.2. They see a page called My bookings with a Cancel button on each row. This lesson tests that page the way a user uses it, follows one journey through a real browser and server, and measures what each layer misses.</p>
<p><strong>After this lesson you can</strong> test a four-state screen by roles and accessible names, prove with a planted bug what a stub client cannot see, spot a test that only checks its mock, write one journey that checks what the server stored, and fix a flaky test caused by shared data. <strong>Why it is useful:</strong> bugs that reach users live at the seams — a URL, a status code, a row that never updates — where fast tests with stubs are blind.</p>
${FLOW_EN}

<h3>The screen and its component tests</h3>
<p><code>MyBookings</code> (page <code>/my-bookings</code>) shows one of four states — loading, failed with Try again, empty, or a table — and sends one request per cancel. The rule (who may cancel, until when) is not here; the screen only translates the server's answer:</p>
${ma('javascript', WEB_CANCEL)}
<p><code>replace(res.data)</code> puts the server's row in the table; on <code>409</code> the server knows better, so the row becomes CANCELLED; a thrown error becomes “Cannot reach the server”. Every Cancel button is disabled while a cancel runs, and is named after its own booking — <code>Cancel BE-201 on 2026-11-16 at 08:00</code> — which a screen reader reads and a test finds.</p>
<p>The client is a stub (<code>vi.fn</code> answers), as in Chapter 6. For the double click, <code>deferred()</code> keeps the request open, so the test can see “Cancelling…”, both buttons disabled, and — after <code>answer.resolve(…)</code> — exactly one call to <code>cancelBooking</code>:</p>
${ra(T_WEB)}
<p>Eight tests, about one second, every query by role and name — never by CSS class.</p>

<h3>The stub blind spot, measured</h3>
<p>The real client builds the URLs (<code>web/api.js</code>):</p>
${ma('javascript', API_LINES)}
<p>Plant one wrong word, <code>'/cancel'</code> → <code>'/cancellation'</code>, and run every component test, then the journey of this lesson:</p>
${ra(STUB_WEB)}
${ra(STUB_E2E)}
<p>24 of 24 green — the stub never builds a URL — and the journey red. The page snapshot Playwright saved with the failure (<code>error-context.md</code>) showed what the user would see: the alert <strong>“Cannot reach the server. Check your connection.”</strong> and the row still CONFIRMED. Express answered the unknown route with its own 404 HTML page, <code>res.json()</code> threw, and the <code>catch</code> turned a wrong URL into a fake network problem.</p>
<div class="pitfall co-tieu-de"><strong>Green component tests mean the screen works with the stub you wrote.</strong> Everything the stub decides on its own — URLs, headers, status codes, JSON shape — needs another layer: a contract test on the API (11.2) or one journey through the real app.</div>

<h3>A test that only checks the mock</h3>
<p>A common first attempt at “test the Cancel button” (<code>demo11/ui/kiem-mock.test.jsx</code>) clicks a button whose name matches <code>/Cancel/</code> and asserts only <code>expect(client.cancelBooking).toHaveBeenCalledWith(1)</code>. Plant a real bug — delete <code>replace(res.data);</code>, so the row never changes — and run it next to the real test:</p>
${ra(T_MOCK)}
<p>The mock test stays green; the test that looks at the row, as a user does, goes red. “Called with 1” describes how the code is written, not what the user needs (Chapter 3; a review smell in 10.3).</p>

<h3>One end-to-end journey</h3>
<p>Every layer below is already tested, so the journey checks only what none of them can: screen, API and storage together (<code>e2e/huy-phong.spec.js</code>):</p>
${ma('javascript', E2E)}
${ra(T_E2E)}
<p>Its own lab code (<code>freshLab</code>), a date three days after today in Viet Nam time (so Lite-3 always allows the cancel), a button found inside its row, and a <code>reload</code> that checks what the server stored — the screen could show CANCELLED from its own state. Booking the slot again proves it is free (AC5).</p>

<h3>Two traps</h3>
<p><strong>“The” Cancel button.</strong> <code>demo11/pw/nut-chung.spec.js</code> books two slots, opens My bookings and calls <code>page.getByRole('button', { name: 'Cancel' }).click()</code>:</p>
${ra(T_STRICT)}
<p>Strict mode refuses to guess. <code>.first()</code> would turn it green by clicking whichever row the server lists first. Find the row, then its button.</p>
<p><strong>A time of day.</strong> <code>demo11/pw/qua-gio.spec.js</code> books <em>today</em> (computed in Viet Nam time) at 07:00, then cancels:</p>
${ra(T_BOMB)}
<p>Run during the day, 07:00 is past, Lite-3 refuses the cancel and the screen shows “Too late” instead of a status. Before 06:00 the same test is green: a time bomb that usually goes off in CI, at night, for someone else.</p>
<div class="pitfall co-tieu-de"><strong>Fixed dates expire too.</strong> For anything that depends on “now”, compute the date from today, in Viet Nam time.</div>

<h3>An old test turns flaky</h3>
<p>Lesson 11.1 put requirement ids into two old E2E test names, for example “31 seats waits for approval (BR-06)”. The next five-browser run failed in Firefox — not every time:</p>
${ra(T_FLAKY)}
<p>Two bookings with lab QA-912. Chapter 7's <code>freshLab</code> hashed the <code>testId</code> into only 900 codes; a new name is a new testId, hence a new code — here the admin test's QA-912, and the admin test failed whenever the other booked first. <code>freshLab</code> now records its code as a report annotation, and <code>scripts/va-cham-lab.mjs</code> lists codes used twice:</p>
${ra(T_VC_TRUOC)}
<p>Bad luck? The birthday problem: with n tests and N codes, the chance that some two share one is about 1 − e<sup>−n(n−1)/(2N)</sup>; for 25 tests and 900 codes, 1 − e<sup>−600/1800</sup> ≈ <strong>28%</strong>, growing with every test. The fix in <code>e2e/helpers.js</code>: <code>const SPACE = 26 * 26 * 900</code> — two letters and three digits, 608,400 codes — hashed from 12 hex digits instead of 8, plus <code>testInfo.annotations.push({ type: 'lab', description: lab })</code>:</p>
${ra(T_VC_SAU)}
<div class="pitfall co-tieu-de"><strong>A retry would have hidden this.</strong> An order-dependent failure often passes on the second attempt and is filed as “flaky”. When a test fails only sometimes, look for what it shares with other tests — data, time, order — before reaching for retries (8.3).</div>

<h3>Which layer for which question</h3>
${KHI_EN}
<p><strong>In Java/Spring</strong>, <code>MockMvc</code> plays the stub's role for a server-rendered page and is blind in the same places; Playwright for Java runs the one journey.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>US-11 AC1: a student sees only their own bookings. Check it where the user sees it. As An, book a fresh lab four days from today; as Binh, sign in, open My bookings, wait until the list has loaded, and expect An's row to be absent. Then plant “My bookings shows everyone's bookings” (<code>repo.list()</code> in place of <code>listMyBookings(repo, req.user.id)</code>) and run again.</p>
<p><strong>Solution and real output</strong> (<code>demo11/pw/rieng-tu.spec.js</code>; An's booking is made first, in his own browser context, exactly as in the journey):</p>
${ma('javascript', TH)}
${ra(TH_XANH)}
${ra(TH_DO)}
<p><strong>Done when</strong> it is green on the real code, red with the planted bug, and you can say why it first waits for the loading status to disappear (otherwise “0 rows” could pass while the list is still loading).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">stub client (client giả)</span><span class="v">Same methods as the real API client, canned answers.</span></div>
  <div class="kv"><span class="k">deferred (lời hứa hoãn)</span><span class="v">A promise the test resolves later, to see the screen while it waits.</span></div>
  <div class="kv"><span class="k">strict mode (chế độ nghiêm)</span><span class="v">Playwright refuses an action when a locator matches several elements.</span></div>
  <div class="kv"><span class="k">annotation (chú thích trong báo cáo)</span><span class="v">Data a test writes into the report, such as the lab code it used.</span></div>
  <div class="kv"><span class="k">birthday problem (bài toán ngày sinh)</span><span class="v">Collisions in a small space come much sooner than intuition says.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Component tests cover every state in about a second — but a wrong URL kept 24/24 of them green; only the journey went red.</li>
<li>A mock-only test stays green when the row never updates; check what the user sees.</li>
<li>One journey, reloaded, with its own lab and a date relative to today; buttons found inside their row.</li>
<li>900 codes for 25 tests is a 28% collision chance: widen the space and make collisions visible.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'react', bai: 'rx-9-1-testing-library', title: 'React course — 9.1: Testing Library', sub: 'There: render, screen, queries by role, user-event. Here: the same tools on a four-state screen, plus what a stub client cannot see, measured.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Test frontend và luồng đầy đủ</h2>
<p class="lead">Sinh viên không bao giờ thấy luật hay CSDL của bài 11.2. Họ thấy một trang tên My bookings, mỗi dòng một nút Cancel. Bài này test trang đó theo cách người dùng dùng nó, đi theo một hành trình qua trình duyệt và server thật, và đo xem mỗi tầng bỏ lọt gì.</p>
<p><strong>Sau bài này bạn có thể</strong> test một màn hình bốn trạng thái bằng vai trò và tên truy cập (accessible name), chứng minh bằng bug cài vào điều client giả không thấy, nhận ra test chỉ kiểm mock, viết một hành trình kiểm thứ server đã lưu, và sửa một test chập chờn do dùng chung dữ liệu. <strong>Vì sao hữu ích:</strong> bug tới tay người dùng nằm ở chỗ nối — một URL, một mã trạng thái, một dòng không bao giờ cập nhật — đúng chỗ các test nhanh dùng đồ giả bị mù.</p>
${FLOW_VI}

<h3>Màn hình và test component của nó</h3>
<p><code>MyBookings</code> (trang <code>/my-bookings</code>) hiện một trong bốn trạng thái — đang tải, lỗi có Try again, rỗng, hoặc bảng — và mỗi lần huỷ gửi một request. Luật (ai được huỷ, tới khi nào) không nằm ở đây; màn hình chỉ dịch câu trả lời của server:</p>
${ma('javascript', WEB_CANCEL)}
<p><code>replace(res.data)</code> đưa dòng của server vào bảng; gặp <code>409</code> thì server biết rõ hơn, nên dòng thành CANCELLED; một lỗi bị ném thành “Cannot reach the server”. Mọi nút Cancel bị khoá khi đang có lượt huỷ chạy, và mang tên của chính lượt đặt — <code>Cancel BE-201 on 2026-11-16 at 08:00</code> — tên mà trình đọc màn hình đọc và test dùng để tìm.</p>
<p>Client là đồ giả (các câu trả lời <code>vi.fn</code>), như Chương 6. Với cú bấm đúp, <code>deferred()</code> (lời hứa hoãn) giữ request mở, để test thấy “Cancelling…”, cả hai nút bị khoá, và — sau <code>answer.resolve(…)</code> — đúng một lần gọi <code>cancelBooking</code>:</p>
${ra(T_WEB)}
<p>Tám test, khoảng một giây, mọi truy vấn theo vai trò và tên — không bao giờ theo class CSS.</p>

<h3>Điểm mù của client giả, đo thật</h3>
<p>Client thật tự dựng URL:</p>
${ma('javascript', API_LINES)}
<p>Cài một chữ sai, <code>'/cancel'</code> → <code>'/cancellation'</code>, rồi chạy mọi test component, sau đó là hành trình của bài này:</p>
${ra(STUB_WEB)}
${ra(STUB_E2E)}
<p>24/24 xanh — client giả không bao giờ dựng URL — còn hành trình đỏ. Ảnh chụp trang mà Playwright lưu kèm lỗi (<code>error-context.md</code>) cho thấy người dùng sẽ thấy: alert <strong>“Cannot reach the server. Check your connection.”</strong> và dòng vẫn CONFIRMED. Express trả lời route lạ bằng trang HTML 404 của nó, <code>res.json()</code> ném lỗi, và khối <code>catch</code> biến một URL sai thành một sự cố mạng giả.</p>
<div class="pitfall co-tieu-de"><strong>Test component xanh nghĩa là màn hình chạy được với client giả bạn viết.</strong> Mọi thứ client giả tự quyết — URL, header, mã trạng thái, dạng JSON — cần một tầng khác: test hợp đồng ở API (11.2) hoặc một hành trình qua app thật.</div>

<h3>Một test chỉ kiểm mock</h3>
<p>Lần thử đầu phổ biến cho “test nút Cancel” (<code>demo11/ui/kiem-mock.test.jsx</code>) bấm một nút có tên khớp <code>/Cancel/</code> và chỉ khẳng định <code>expect(client.cancelBooking).toHaveBeenCalledWith(1)</code>. Cài một bug thật — xoá <code>replace(res.data);</code>, để dòng không bao giờ đổi — rồi chạy cạnh test thật:</p>
${ra(T_MOCK)}
<p>Test mock vẫn xanh; test nhìn vào dòng, như người dùng nhìn, thì đỏ. “Được gọi với 1” mô tả code được viết thế nào, không phải người dùng cần gì (Chương 3; một mùi khi review ở 10.3).</p>

<h3>Một hành trình đầu-cuối</h3>
<p>Mọi tầng bên dưới đã có test, nên hành trình chỉ kiểm thứ không tầng nào kiểm được: màn hình, API và nơi lưu trữ chạy cùng nhau (<code>e2e/huy-phong.spec.js</code>):</p>
${ma('javascript', E2E)}
${ra(T_E2E)}
<p>Mã phòng riêng (<code>freshLab</code>), ngày ba ngày sau hôm nay theo giờ Việt Nam (để Lite-3 luôn cho huỷ), nút tìm bên trong dòng của nó, và <code>reload</code> để kiểm thứ server đã lưu — màn hình có thể hiện CANCELLED từ trạng thái của chính nó. Đặt lại khung đó chứng minh khung đã trống (AC5).</p>

<h3>Hai cái bẫy</h3>
<p><strong>“Cái” nút Cancel.</strong> <code>demo11/pw/nut-chung.spec.js</code> đặt hai khung, mở My bookings rồi gọi <code>page.getByRole('button', { name: 'Cancel' }).click()</code>:</p>
${ra(T_STRICT)}
<p>Strict mode (chế độ nghiêm) từ chối đoán. <code>.first()</code> sẽ làm nó xanh bằng cách bấm dòng nào server tình cờ liệt kê trước. Tìm dòng trước, rồi mới tới nút của nó.</p>
<p><strong>Một giờ cố định trong ngày.</strong> <code>demo11/pw/qua-gio.spec.js</code> đặt <em>hôm nay</em> (tính theo giờ Việt Nam) lúc 07:00 rồi huỷ:</p>
${ra(T_BOMB)}
<p>Chạy ban ngày thì 07:00 đã qua, Lite-3 từ chối huỷ và màn hình hiện “Too late” chứ không phải status. Trước 06:00 cùng test đó xanh: một quả bom hẹn giờ thường nổ trong CI, ban đêm, vào tay người khác.</p>
<div class="pitfall co-tieu-de"><strong>Ngày cố định cũng hết hạn.</strong> Với mọi thứ phụ thuộc “bây giờ”, hãy tính ngày từ hôm nay, theo giờ Việt Nam.</div>

<h3>Một test cũ trở nên chập chờn</h3>
<p>Bài 11.1 đưa mã yêu cầu vào tên hai test E2E cũ, ví dụ “31 seats waits for approval (BR-06)”. Lần chạy năm trình duyệt kế tiếp đỏ ở Firefox — nhưng không phải lần nào cũng đỏ:</p>
${ra(T_FLAKY)}
<p>Hai lượt đặt cùng phòng QA-912. <code>freshLab</code> của Chương 7 băm <code>testId</code> vào chỉ 900 mã; tên mới là testId mới, nên mã mới — ở đây trùng QA-912 của test admin, và test admin đỏ mỗi khi test kia đặt trước. <code>freshLab</code> giờ ghi mã của nó thành annotation (chú thích) trong báo cáo, và <code>scripts/va-cham-lab.mjs</code> liệt kê mã bị dùng hai lần:</p>
${ra(T_VC_TRUOC)}
<p>Xui thôi sao? Bài toán ngày sinh: với n test và N mã, xác suất có hai test trùng mã xấp xỉ 1 − e<sup>−n(n−1)/(2N)</sup>; với 25 test và 900 mã là 1 − e<sup>−600/1800</sup> ≈ <strong>28%</strong>, và tăng theo mỗi test mới. Cách sửa trong <code>e2e/helpers.js</code>: <code>const SPACE = 26 * 26 * 900</code> — hai chữ cái và ba chữ số, 608.400 mã — băm từ 12 chữ số hex thay vì 8, cộng <code>testInfo.annotations.push({ type: 'lab', description: lab })</code>:</p>
${ra(T_VC_SAU)}
<div class="pitfall co-tieu-de"><strong>Một lần retry sẽ giấu chuyện này.</strong> Lỗi phụ thuộc thứ tự thường qua ở lần thử thứ hai và bị ghi là “flaky”. Khi một test chỉ thỉnh thoảng đỏ, hãy tìm thứ nó dùng chung với test khác — dữ liệu, thời gian, thứ tự — trước khi nghĩ tới retry (8.3).</div>

<h3>Câu hỏi nào, tầng nào</h3>
${KHI_VI}
<p><strong>Với Java/Spring</strong>, <code>MockMvc</code> đóng vai client giả cho trang render ở server và mù đúng những chỗ đó; Playwright cho Java chạy một hành trình.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>US-11 AC1: sinh viên chỉ thấy lượt đặt của mình. Hãy kiểm nó ở chỗ người dùng nhìn thấy. Với tư cách An, đặt một phòng riêng bốn ngày sau hôm nay; với tư cách Bình, đăng nhập, mở My bookings, chờ danh sách tải xong, và khẳng định dòng của An không có. Rồi cài bug “My bookings hiện lượt đặt của mọi người” (<code>repo.list()</code> thay cho <code>listMyBookings(repo, req.user.id)</code>) và chạy lại.</p>
<p><strong>Lời giải và output thật</strong> (<code>demo11/pw/rieng-tu.spec.js</code>; lượt đặt của An làm trước, trong browser context riêng của An, y như hành trình):</p>
${ma('javascript', TH)}
${ra(TH_XANH)}
${ra(TH_DO)}
<p><strong>Xong khi</strong> test xanh trên code thật, đỏ với bug cài vào, và bạn nói được vì sao nó phải chờ trạng thái đang tải biến mất trước (không thì “0 dòng” có thể qua khi danh sách còn đang tải).</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">stub client (client giả)</span><span class="v">Cùng phương thức với client API thật, trả câu trả lời dựng sẵn.</span></div>
  <div class="kv"><span class="k">deferred (lời hứa hoãn)</span><span class="v">Promise test tự giải quyết sau, để thấy màn hình trong lúc chờ.</span></div>
  <div class="kv"><span class="k">strict mode (chế độ nghiêm)</span><span class="v">Playwright từ chối thao tác khi locator khớp nhiều phần tử.</span></div>
  <div class="kv"><span class="k">annotation (chú thích trong báo cáo)</span><span class="v">Dữ liệu test ghi vào báo cáo, như mã phòng nó đã dùng.</span></div>
  <div class="kv"><span class="k">birthday problem (bài toán ngày sinh)</span><span class="v">Va chạm trong không gian nhỏ tới sớm hơn trực giác rất nhiều.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Test component phủ mọi trạng thái trong khoảng một giây — nhưng một URL sai vẫn giữ 24/24 test đó xanh; chỉ hành trình đỏ.</li>
<li>Test chỉ kiểm mock vẫn xanh khi dòng không bao giờ cập nhật; hãy kiểm thứ người dùng thấy.</li>
<li>Một hành trình, có tải lại trang, phòng riêng, ngày tính từ hôm nay; nút tìm bên trong dòng của nó.</li>
<li>900 mã cho 25 test là 28% khả năng trùng: mở rộng không gian và làm va chạm hiện ra.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'react', bai: 'rx-9-1-testing-library', title: 'Khoá React — 9.1: Testing Library', sub: 'Ở đó: render, screen, truy vấn theo vai trò, user-event. Ở đây: cùng công cụ trên một màn hình bốn trạng thái, cộng điều client giả không thấy, đo thật.', cta: 'MỞ BÀI →' })}
</div>
`,
};
