/**
 * Testing · Chương 7 · 7.2 — Test luồng người dùng thật. Slug giữ từ khung: tst-7-2-luong.
 * Chạy thật (Playwright 1.64.1): e2e/auth.setup.js lưu storageState an/boss; npm run test:e2e 9 xanh 3,1 s; đăng nhập hỏng ⇒ setup đỏ 2, "7 did not run";
 * dựng dữ liệu qua API (request fixture) rồi kiểm trên trang admin; 6 lượt đặt 1 worker: đăng nhập qua form 247–314 ms/test (3,7 s)
 * so với phiên lưu sẵn 289–324 ms/test (4,0 s) — KHÔNG nhanh hơn ở dự án này (đo lại 3 lần trên máy đang tải nặng: tổng 4,0–13,3 s, do build + bật server).
 */
import G from '../giang/tst-07-2.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|✘|passed|failed$|Running|did not run/.test(l)).join('\n');
const HONG = OUT['72-setup-hong'].split('\n').filter((l) => /^\$ |^planted|✘|Error: expect|Locator:|failed$|did not run/.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const PW = CODE.pwConfig.split('\n');
const PI = PW.findIndex((l) => l.includes('projects: ['));
const PROJ = [PW[PI], PW[PI + 1], PW[PI + 2], '    // … firefox, webkit and two phones, each with dependencies: [\'setup\'] — lesson 7.4', '  ],'].join('\n');
const DP = CODE.datPhong.split('\n');
const DI = DP.findIndex((l) => l.startsWith("test('a booking by an"));
const DP_AN = DP.slice(0, DI).join('\n').replace(/\n+$/, '');
const DP_HAI = DP.slice(DI).join('\n');

const CHON_EN = `<table>
<thead><tr><th>Journey in LabFlow Lite</th><th>Why it deserves a browser</th><th>Where its details are tested</th></tr></thead>
<tbody>
<tr><td>sign in, wrong password, sign out, reload</td><td>sessions live in the browser (localStorage); no server test sees them</td><td>token rules — 5.2</td></tr>
<tr><td>a student books a lab and sees “Booked”</td><td>form → client → API → rules → answer on screen, all wired together</td><td>slot rules — Ch1–2; the form — 6.2</td></tr>
<tr><td>31 seats waits for approval</td><td>the status chosen on the server must reach the right message</td><td>BR-06 decision table — 1.4</td></tr>
<tr><td>a taken slot is refused</td><td>409 must become an alert a person hears</td><td>OVERLAP — 2.1, 4.1</td></tr>
<tr><td>the admin sees what a student booked</td><td>crosses two users and two screens</td><td>admin route — 5.2; the list — 6.3</td></tr>
</tbody></table>`;
const CHON_VI = `<table>
<thead><tr><th>Hành trình trong LabFlow Lite</th><th>Vì sao đáng một trình duyệt</th><th>Chi tiết được test ở đâu</th></tr></thead>
<tbody>
<tr><td>đăng nhập, sai mật khẩu, đăng xuất, tải lại</td><td>phiên nằm trong trình duyệt (localStorage); không test server nào thấy nó</td><td>luật token — 5.2</td></tr>
<tr><td>sinh viên đặt phòng và thấy “Booked”</td><td>form → client → API → luật → câu trả lời trên màn hình, tất cả nối với nhau</td><td>luật khung giờ — Ch1–2; form — 6.2</td></tr>
<tr><td>31 chỗ phải chờ duyệt</td><td>trạng thái server chọn phải tới đúng câu thông báo</td><td>bảng quyết định BR-06 — 1.4</td></tr>
<tr><td>khung đã có người đặt bị từ chối</td><td>409 phải thành một alert người dùng nghe được</td><td>OVERLAP — 2.1, 4.1</td></tr>
<tr><td>admin thấy lượt sinh viên vừa đặt</td><td>đi qua hai người dùng và hai màn hình</td><td>route admin — 5.2; danh sách — 6.3</td></tr>
</tbody></table>`;

const DO_EN = `<table>
<thead><tr><th>Six bookings, one worker</th><th>Each test</th><th>Whole run (with build and server start)</th></tr></thead>
<tbody>
<tr><td><code>moi-lan.spec.js</code> — sign in through the form in every test</td><td>247–314 ms</td><td>3.7 s</td></tr>
<tr><td><code>dung-lai.spec.js</code> — reuse the saved session</td><td>289–324 ms</td><td>4.0 s</td></tr>
</tbody></table>`;
const DO_VI = `<table>
<thead><tr><th>Sáu lượt đặt, một worker</th><th>Mỗi test</th><th>Cả lần chạy (gồm build và bật server)</th></tr></thead>
<tbody>
<tr><td><code>moi-lan.spec.js</code> — đăng nhập qua form trong mọi test</td><td>247–314 ms</td><td>3,7 s</td></tr>
<tr><td><code>dung-lai.spec.js</code> — dùng lại phiên đã lưu</td><td>289–324 ms</td><td>4,0 s</td></tr>
</tbody></table>`;

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">setup project</div><div class="lz-d">auth.setup.js signs in as an and boss through the real page</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">storage files</div><div class="lz-d">playwright/.auth/an.json, boss.json — cookies + localStorage</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">chromium project</div><div class="lz-d">starts only if setup passed (dependencies)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">journeys</div><div class="lz-d">test.use({ storageState }) — already signed in</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">login tests</div><div class="lz-d">no saved session: signing in is the subject</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">setup project</div><div class="lz-d">auth.setup.js đăng nhập an và boss qua trang thật</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">file phiên</div><div class="lz-d">playwright/.auth/an.json, boss.json — cookie + localStorage</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">project chromium</div><div class="lz-d">chỉ chạy khi setup qua (dependencies)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">hành trình</div><div class="lz-d">test.use({ storageState }) — đã đăng nhập sẵn</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">test đăng nhập</div><div class="lz-d">không dùng phiên lưu: đăng nhập chính là thứ được test</div></div>
</div>`;

const JAVA = `// Playwright for Java — the same idea in a Spring Boot team
context.storageState(new BrowserContext.StorageStateOptions().setPath(Paths.get("playwright/.auth/an.json")));
BrowserContext signedIn = browser.newContext(new Browser.NewContextOptions().setStorageStatePath(Paths.get("playwright/.auth/an.json")));`;

export default {
  title: '7.2 — Testing real user flows|||7.2 — Test luồng người dùng thật',
  slug: 'tst-7-2-luong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chọn hành trình nào đáng một test trình duyệt; setup project đăng nhập một lần và lưu storageState (xem tận mắt file phiên: token JWT trong localStorage, vì sao không được vào git); dependencies làm đăng nhập hỏng chỉ đỏ một chỗ ("7 did not run"); hành trình bắt đầu khi đã đăng nhập; một hành trình đi qua hai người dùng bằng hai browser context; dựng dữ liệu qua API rồi kiểm trên trang; đo thật: dùng lại phiên KHÔNG nhanh hơn ở dự án này — và khi nào nó thật sự đáng.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Testing real user flows</h2>
<p class="lead">Lesson 7.1 proved that a browser can sign in and book. Real users do more: they come back the next day still signed in, they hand work to someone else — a student books, an admin checks. This lesson turns those journeys into tests that stay short, run in seconds and fail for one clear reason.</p>
<p><strong>After this lesson you can</strong> pick the journeys worth a browser test, sign in once and reuse the session in every test, follow one booking across two users at the same time, prepare test data through the API, and judge a “this is faster” claim by measuring it. <strong>Why it is useful:</strong> these are the tests that answer the question a team lead asks before a release — <em>can people still do their job?</em> — and the patterns here (setup project, storageState, one context per user) are what you will find in almost every Playwright suite at work.</p>

<h3>Which journeys deserve a browser</h3>
<p>Chapters 1–6 already test every rule of LabFlow Lite in milliseconds. An end-to-end test should not repeat them; it should check what only the whole app can show — that the pieces are connected. A useful question per journey: <em>if this broke, would any faster test notice?</em></p>
${CHON_EN}
<p>Five journeys, seven tests. Boundaries such as 30 versus 31 seats, or 07:00 versus 06:30, stay in unit tests: one end-to-end test per <em>outcome</em> (confirmed, pending, refused) is enough to prove the wiring.</p>

<h3>The shape of the suite</h3>
${FLOW_EN}

<h3>Sign in once: a setup project</h3>
${ma('javascript', CODE.authSetup)}
<p>A normal test that runs first: it signs in through the real page, waits until the header says who is signed in, then writes the context’s <code>storageState</code> — every cookie and <code>localStorage</code> entry — to a JSON file. The project list wires it in:</p>
${ma('javascript', PROJ)}
<p><code>dependencies: ['setup']</code> means: run the setup project first, and start <code>chromium</code> only if it passed. Here is what the saved file really contains:</p>
${ra(OUT['72-auth-file'])}
<p>No cookies — LabFlow keeps its session in <code>localStorage</code> under <code>labflow.session</code>. The value holds the JWT from Chapter 5: its middle part decodes to <code>{"role":"STUDENT","sub":"an","iat":1793485622,"exp":1793489222}</code>, a token valid for exactly one hour (3600 seconds). Because setup runs at the start of every test run, the file is always fresh; a session file saved yesterday and reused today would hold an expired token.</p>
<div class="pitfall co-tieu-de"><strong>A session file is a password.</strong> Anyone holding <code>an.json</code> is signed in as an until the token expires. On a real project that may be a staging account with real data. Keep the folder out of git — LabFlow’s <code>.gitignore</code> lists it next to the build and the test results:
${ma('text', CODE.gitignore)}</div>

<h3>When the login itself breaks</h3>
<p>Does the dependency really help? Plant a bug that refuses every login (the <code>thu-loi-pw.mjs</code> script plants one change, runs Playwright, and always restores the file):</p>
${ra(HONG)}
<p>Two red tests — both in setup, both pointing at the line that waits for “Signed in as” — and <strong>7 did not run</strong>. Without the setup project every journey would sign in by itself and fail in its own way: seven red tests, seven stack traces, one cause. A clear red with the right location is worth more than many reds.</p>

<h3>Journeys that start signed in</h3>
${ma('javascript', DP_AN)}
<p><code>test.use({ storageState })</code> inside a <code>describe</code> gives every test there a context created from the file: the page opens already signed in as an. Each test still gets its <em>own</em> copy, so one test signing out cannot affect another. <code>book()</code> (in <code>e2e/helpers.js</code>) fills the form by label with <code>exact: true</code>; <code>freshLab(testInfo)</code> gives every test a lab code of its own — lesson 7.3 shows why. The assertions check the exact text a user reads, not a URL or a CSS class.</p>

<h3>One journey, two people</h3>
${ma('javascript', DP_HAI)}
<p>The <code>browser</code> fixture lets one test open several contexts. Each <code>browser.newContext()</code> is a separate person with separate storage, so the student and the admin are signed in <em>at the same time</em>, in one test, without signing anyone out. The journey crosses from one to the other exactly as it does in real life: the student books, the admin’s list must show that row with the right date and time. Contexts you create yourself are yours to close.</p>
${ra(gon(OUT['72-e2e']))}
<p>Nine tests (seven journeys and two setup sign-ins) in 3.1 seconds, including building the app and starting the server.</p>

<h3>Test data: arrange through the API, check through the page</h3>
<p>The admin-list journey above books through the form first. That is fine once — it <em>is</em> the journey — but when a test only needs some data to exist before the real check starts, clicking through screens to create it is slow and adds reasons to fail that have nothing to do with the test. Playwright’s <code>request</code> fixture sends HTTP straight to the same server (it uses <code>baseURL</code> too):</p>
${ma('javascript', CODE.quaApi)}
${ra(gon(OUT['72-qua-api']))}
<p>Arrange with the API, act and assert with the page — the same Arrange-Act-Assert of lesson 1.1, with each step done by the cheapest tool that is still honest. The booking form is covered by its own journey, so this test does not need to cover it again. The same idea gives you sign-in without a page (POST <code>/api/login</code>, then put the token into storage) and clean-up after a test (DELETE through the API).</p>

<h3>Does reusing the session save time? Measured</h3>
<p>The usual reason given for storageState is speed. Two files, six bookings each, run with <code>--workers=1</code> so the tests do not overlap; the per-test times below are copied from the two runs:</p>
${ma('javascript', CODE.moiLan)}
<p><code>dung-lai.spec.js</code> is the same loop with <code>test.use({ storageState: 'playwright/.auth/an.json' })</code> and <code>page.goto('/')</code> instead of <code>signIn</code>.</p>
${DO_EN}
<p><strong>Not faster here.</strong> Signing in to LabFlow’s demo server is a lookup in a JavaScript object plus one request on localhost, so the form costs almost nothing, and the saved session was even a little slower in this run. Running both files three more times on the same (busy) machine gave whole-run times between 4.0 and 13.3 seconds for <em>both</em> files — the build and server start-up dominate, and the difference between the two approaches disappears in that noise. Do not write “storageState makes tests faster” in a report without a measurement like this one.</p>
<p>The reasons to use it anyway are real, just different:</p>
<ul>
<li><strong>Real logins are slow or external.</strong> Password hashing (bcrypt, scrypt — the Node.js course builds one), single sign-on redirects through Google or Microsoft, a second factor by e-mail or app: seconds per login, sometimes impossible to automate in every test.</li>
<li><strong>Logins are rate-limited.</strong> LabFlow’s own rule BR-02 (lesson 2.2) locks an account after 5 failures for 15 minutes. A hundred tests signing in through one account can trip such guards on real systems.</li>
<li><strong>One reason to fail.</strong> A booking test that signs in first also fails when the login page changes. With a setup project, a login change turns one test red, in the right place.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Do not use a saved session for tests about signing in.</strong> <code>e2e/dang-nhap.spec.js</code> (Lab 7) deliberately starts signed out: wrong password, reload, sign-out and roles are exactly what it tests. A suite where every test reuses one saved session never notices that the login form, or signing out, is broken.</div>

<h3>The same pattern in Java</h3>
${ma('java', JAVA)}
<p>Playwright ships for Java, Python and .NET with the same concepts; a Spring Boot team starts the app with <code>@SpringBootTest(webEnvironment = RANDOM_PORT)</code> and reuses the session the same way. Older Selenium suites save and restore cookies by hand.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Lecturer thay has no saved session: open a fresh context, sign in through the form, and book 40 seats in a lab of the test’s own. Lecturers never need approval, so the status says “Booked”.</li>
<li>In a second context, signed in as boss from the saved file, the admin list shows that row with status <code>CONFIRMED</code>.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th72)}
${ra(gon(OUT['72-th']))}
<p><strong>Done when</strong> <code>demo7/th72.spec.js</code> passes. Check yourself: why does this test call <code>browser.newContext()</code> with no options for the lecturer? (Answer: there is no saved session for thay — a context without storageState is a brand-new, signed-out visitor.)</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">user journey (hành trình người dùng)</span><span class="v">A task a person completes across screens, from start to finish — sign in, book, see it confirmed.</span></div>
  <div class="kv"><span class="k">storageState</span><span class="v">A JSON snapshot of a context’s cookies and localStorage; a new context can start from it, already signed in.</span></div>
  <div class="kv"><span class="k">setup project</span><span class="v">A project whose tests prepare something (a session) for other projects.</span></div>
  <div class="kv"><span class="k">dependencies</span><span class="v">Project setting: run these projects first; if they fail, the dependent tests do not run.</span></div>
  <div class="kv"><span class="k">request fixture</span><span class="v">An HTTP client bound to the test’s <code>baseURL</code> — for arranging data or checking the API directly.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Give a browser test only to journeys no faster test can see; one test per outcome.</li>
<li>A setup project signs in once; <code>dependencies</code> turn a broken login into one clear red.</li>
<li>The saved session is a password: keep <code>playwright/.auth/</code> out of git.</li>
<li>Two browser contexts are two people, signed in at the same time.</li>
<li>Arrange through the API, act and assert through the page.</li>
<li>Measured here, storageState saved no time; use it for slow, external or rate-limited logins and for clear failures.</li>
</ul>

${lienKet({ bai: 'swt301-system-acceptance', title: 'Theory in SWT301 — 2.3: system and acceptance testing', sub: 'Same: system testing checks whole end-to-end tasks of the finished product, black-box, in a production-like environment. Deeper here: those tasks become Playwright journeys that run in seconds — a saved session, two users in one test, data arranged through the API, and a measurement instead of a claim.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Test luồng người dùng thật</h2>
<p class="lead">Bài 7.1 chứng minh trình duyệt đăng nhập và đặt phòng được. Người dùng thật làm nhiều hơn thế: hôm sau quay lại vẫn còn đăng nhập, họ chuyển việc cho người khác — sinh viên đặt, admin kiểm tra. Bài này biến các hành trình đó thành test ngắn, chạy trong vài giây và đỏ vì đúng một lý do rõ ràng.</p>
<p><strong>Sau bài này bạn có thể</strong> chọn hành trình nào đáng một test trình duyệt, đăng nhập một lần và dùng lại phiên ở mọi test, theo một lượt đặt qua hai người dùng cùng lúc, chuẩn bị dữ liệu test qua API, và đánh giá một lời hứa “cách này nhanh hơn” bằng cách đo. <strong>Vì sao hữu ích:</strong> đây là loại test trả lời câu hỏi trưởng nhóm hay hỏi trước mỗi lần phát hành — <em>người dùng còn làm được việc của họ không?</em> — và các mẫu ở đây (setup project, storageState, mỗi người dùng một context) là thứ bạn sẽ gặp trong gần như mọi bộ test Playwright khi đi làm.</p>

<h3>Hành trình nào đáng một trình duyệt</h3>
<p>Chương 1–6 đã test mọi luật của LabFlow Lite trong vài mili giây. Test đầu-cuối không nên lặp lại chúng; nó nên kiểm thứ chỉ cả ứng dụng mới cho thấy — các mảnh đã được nối với nhau. Một câu hỏi hữu ích cho từng hành trình: <em>nếu chỗ này hỏng, có test nào nhanh hơn phát hiện ra không?</em></p>
${CHON_VI}
<p>Năm hành trình, bảy test. Các biên như 30 so với 31 chỗ, hay 07:00 so với 06:30, ở lại trong unit test: mỗi <em>kết cục</em> (xác nhận, chờ duyệt, bị từ chối) một test đầu-cuối là đủ chứng minh phần nối.</p>

<h3>Hình dạng của bộ test</h3>
${FLOW_VI}

<h3>Đăng nhập một lần: setup project</h3>
${ma('javascript', CODE.authSetup)}
<p>Một test bình thường chạy đầu tiên: đăng nhập qua trang thật, chờ tới khi header ghi ai đang đăng nhập, rồi ghi <code>storageState</code> của context — mọi cookie và mục <code>localStorage</code> — ra một file JSON. Danh sách project nối nó vào:</p>
${ma('javascript', PROJ)}
<p><code>dependencies: ['setup']</code> nghĩa là: chạy project setup trước, và chỉ bắt đầu <code>chromium</code> khi setup đã qua. Đây là thứ file đã lưu thật sự chứa:</p>
${ra(OUT['72-auth-file'])}
<p>Không có cookie nào — LabFlow giữ phiên trong <code>localStorage</code> dưới khoá <code>labflow.session</code>. Giá trị chứa JWT của Chương 5: phần giữa giải mã ra <code>{"role":"STUDENT","sub":"an","iat":1793485622,"exp":1793489222}</code>, một token sống đúng một giờ (3600 giây). Vì setup chạy ở đầu mỗi lần chạy test, file luôn mới; một file phiên lưu hôm qua mà hôm nay dùng lại sẽ mang token đã hết hạn.</p>
<div class="pitfall co-tieu-de"><strong>File phiên là một mật khẩu.</strong> Ai cầm <code>an.json</code> là đăng nhập được bằng tài khoản an tới khi token hết hạn. Ở dự án thật đó có thể là tài khoản staging với dữ liệu thật. Giữ thư mục này ngoài git — <code>.gitignore</code> của LabFlow liệt kê nó cạnh bản build và kết quả test:
${ma('text', CODE.gitignore)}</div>

<h3>Khi chính phần đăng nhập hỏng</h3>
<p>Dependency có giúp thật không? Cài một bug từ chối mọi lần đăng nhập (script <code>thu-loi-pw.mjs</code> cài một thay đổi, chạy Playwright, và luôn trả file về như cũ):</p>
${ra(HONG)}
<p>Hai test đỏ — cả hai ở setup, cả hai trỏ vào dòng chờ “Signed in as” — và <strong>7 did not run</strong> (7 test không chạy). Không có setup project thì mỗi hành trình tự đăng nhập và đỏ theo cách riêng: bảy test đỏ, bảy stack trace, một nguyên nhân. Một chỗ đỏ rõ ràng, đúng vị trí, đáng giá hơn nhiều chỗ đỏ.</p>

<h3>Hành trình bắt đầu khi đã đăng nhập</h3>
${ma('javascript', DP_AN)}
<p><code>test.use({ storageState })</code> trong một <code>describe</code> cho mọi test trong đó một context dựng từ file: trang mở ra đã đăng nhập bằng an. Mỗi test vẫn có bản sao <em>riêng</em>, nên một test đăng xuất không ảnh hưởng test khác. <code>book()</code> (trong <code>e2e/helpers.js</code>) điền form theo label với <code>exact: true</code>; <code>freshLab(testInfo)</code> cho mỗi test một mã phòng riêng — bài 7.3 cho thấy vì sao. Các assertion kiểm đúng câu chữ người dùng đọc, không phải URL hay class CSS.</p>

<h3>Một hành trình, hai người</h3>
${ma('javascript', DP_HAI)}
<p>Fixture <code>browser</code> cho một test mở nhiều context. Mỗi <code>browser.newContext()</code> là một người riêng với storage riêng, nên sinh viên và admin cùng đăng nhập <em>một lúc</em>, trong một test, không phải đăng xuất ai. Hành trình đi từ người này sang người kia đúng như ngoài đời: sinh viên đặt, danh sách của admin phải hiện dòng đó với đúng ngày và giờ. Context bạn tự tạo thì bạn tự đóng.</p>
${ra(gon(OUT['72-e2e']))}
<p>Chín test (bảy hành trình và hai lần đăng nhập setup) trong 3,1 giây, tính cả build app và bật server.</p>

<h3>Dữ liệu test: dựng qua API, kiểm trên trang</h3>
<p>Hành trình danh sách admin ở trên đặt phòng qua form trước. Một lần như vậy là đúng — nó <em>chính là</em> hành trình — nhưng khi một test chỉ cần có sẵn dữ liệu trước khi phép kiểm thật bắt đầu, bấm qua các màn hình để tạo dữ liệu vừa chậm vừa thêm lý do để đỏ chẳng liên quan gì tới test. Fixture <code>request</code> của Playwright gửi HTTP thẳng tới cùng server (nó cũng dùng <code>baseURL</code>):</p>
${ma('javascript', CODE.quaApi)}
${ra(gon(OUT['72-qua-api']))}
<p>Chuẩn bị bằng API, hành động và khẳng định bằng trang — đúng Arrange-Act-Assert của bài 1.1, mỗi bước làm bằng công cụ rẻ nhất mà vẫn trung thực. Form đặt phòng đã có hành trình riêng phủ, nên test này không cần phủ lại. Cùng ý tưởng đó cho bạn đăng nhập không cần trang (POST <code>/api/login</code>, rồi đặt token vào storage) và dọn dữ liệu sau test (DELETE qua API).</p>

<h3>Dùng lại phiên có tiết kiệm thời gian không? Đo thật</h3>
<p>Lý do hay được nêu cho storageState là tốc độ. Hai file, mỗi file sáu lượt đặt, chạy với <code>--workers=1</code> để các test không chạy chồng; thời gian từng test dưới đây chép từ hai lần chạy đó:</p>
${ma('javascript', CODE.moiLan)}
<p><code>dung-lai.spec.js</code> là cùng vòng lặp đó với <code>test.use({ storageState: 'playwright/.auth/an.json' })</code> và <code>page.goto('/')</code> thay cho <code>signIn</code>.</p>
${DO_VI}
<p><strong>Ở đây không nhanh hơn.</strong> Đăng nhập vào server demo của LabFlow chỉ là tra một object JavaScript cộng một request trên localhost, nên đi qua form gần như không tốn gì, và phiên lưu sẵn còn chậm hơn chút trong lần chạy này. Chạy lại cả hai file ba lần nữa trên cùng máy (đang bận) cho tổng thời gian từ 4,0 tới 13,3 giây cho <em>cả hai</em> file — build và khởi động server chiếm phần lớn, và chênh lệch giữa hai cách biến mất trong độ nhiễu đó. Đừng viết “storageState làm test nhanh hơn” vào báo cáo khi chưa có một phép đo như thế này.</p>
<p>Lý do vẫn nên dùng thì có thật, chỉ là khác:</p>
<ul>
<li><strong>Đăng nhập thật chậm hoặc đi qua bên ngoài.</strong> Băm mật khẩu (bcrypt, scrypt — khoá Node.js có dựng một cái), đăng nhập một lần (SSO) chuyển hướng qua Google hay Microsoft, yếu tố thứ hai qua email hoặc app: vài giây mỗi lần, có khi không thể tự động hoá trong mọi test.</li>
<li><strong>Đăng nhập bị giới hạn tần suất.</strong> Chính luật BR-02 của LabFlow (bài 2.2) khoá tài khoản 15 phút sau 5 lần sai. Một trăm test đăng nhập qua cùng một tài khoản có thể kích hoạt những chốt chặn như vậy trên hệ thống thật.</li>
<li><strong>Một lý do để đỏ.</strong> Test đặt phòng mà phải đăng nhập trước thì cũng đỏ khi trang đăng nhập thay đổi. Có setup project, thay đổi ở đăng nhập làm đỏ một test, ở đúng chỗ.</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Đừng dùng phiên lưu sẵn cho test về đăng nhập.</strong> <code>e2e/dang-nhap.spec.js</code> (Lab 7) cố ý bắt đầu ở trạng thái chưa đăng nhập: sai mật khẩu, tải lại, đăng xuất và vai trò chính là thứ nó test. Một bộ test mà mọi test đều dùng lại một phiên lưu sẵn sẽ không bao giờ nhận ra form đăng nhập, hay nút đăng xuất, đã hỏng.</div>

<h3>Cùng mẫu đó trong Java</h3>
${ma('java', JAVA)}
<p>Playwright có bản cho Java, Python và .NET với cùng các khái niệm; nhóm Spring Boot bật app bằng <code>@SpringBootTest(webEnvironment = RANDOM_PORT)</code> và dùng lại phiên y như vậy. Các bộ Selenium cũ thì tự lưu và nạp lại cookie bằng tay.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Giảng viên thay không có phiên lưu sẵn: mở một context mới, đăng nhập qua form, đặt 40 chỗ ở một phòng riêng của test. Giảng viên không bao giờ cần duyệt, nên thông báo ghi “Booked”.</li>
<li>Trong context thứ hai, đăng nhập bằng boss từ file đã lưu, danh sách admin hiện dòng đó với trạng thái <code>CONFIRMED</code>.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th72)}
${ra(gon(OUT['72-th']))}
<p><strong>Xong khi</strong> <code>demo7/th72.spec.js</code> qua. Tự kiểm: vì sao test gọi <code>browser.newContext()</code> không kèm tuỳ chọn nào cho giảng viên? (Đáp: không có phiên lưu sẵn cho thay — một context không có storageState là một người khách mới tinh, chưa đăng nhập.)</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">user journey (hành trình người dùng)</span><span class="v">Một việc người dùng làm trọn qua nhiều màn hình, từ đầu tới cuối — đăng nhập, đặt phòng, thấy được xác nhận.</span></div>
  <div class="kv"><span class="k">storageState (trạng thái lưu trữ)</span><span class="v">Ảnh chụp JSON cookie và localStorage của một context; context mới có thể bắt đầu từ đó, đã đăng nhập sẵn.</span></div>
  <div class="kv"><span class="k">setup project</span><span class="v">Project có các test chuẩn bị thứ gì đó (một phiên đăng nhập) cho project khác.</span></div>
  <div class="kv"><span class="k">dependencies (phụ thuộc)</span><span class="v">Thiết lập của project: chạy các project này trước; nếu chúng đỏ, test phụ thuộc không chạy.</span></div>
  <div class="kv"><span class="k">request fixture</span><span class="v">Một HTTP client gắn với <code>baseURL</code> của test — để dựng dữ liệu hoặc kiểm thẳng API.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chỉ dành test trình duyệt cho hành trình mà không test nhanh hơn nào thấy được; mỗi kết cục một test.</li>
<li>Setup project đăng nhập một lần; <code>dependencies</code> biến đăng nhập hỏng thành một chỗ đỏ rõ ràng.</li>
<li>Phiên đã lưu là mật khẩu: giữ <code>playwright/.auth/</code> ngoài git.</li>
<li>Hai browser context là hai người, cùng đăng nhập một lúc.</li>
<li>Dựng dữ liệu qua API, hành động và khẳng định qua trang.</li>
<li>Đo ở đây, storageState không tiết kiệm thời gian; dùng nó cho đăng nhập chậm, qua bên ngoài hoặc bị giới hạn tần suất, và để lỗi rõ ràng.</li>
</ul>

${lienKet({ bai: 'swt301-system-acceptance', title: 'Lý thuyết ở SWT301 — 2.3: system testing và acceptance testing', sub: 'Giống: system testing kiểm các tác vụ đầu-cuối của cả sản phẩm, kiểu hộp đen, trong môi trường giống thật. Sâu thêm ở đây: các tác vụ đó thành hành trình Playwright chạy trong vài giây — phiên lưu sẵn, hai người dùng trong một test, dữ liệu dựng qua API, và số đo thay cho lời hứa.', cta: 'MỞ BÀI →' })}
</div>
`,
};
