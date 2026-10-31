/**
 * Testing · Chương 7 · 7.1 — Playwright: test trình duyệt đầu tiên. Slug giữ từ khung: tst-7-1-playwright.
 * Chạy thật: @playwright/test 1.64.1 (Chromium 1248, Firefox 1555, WebKit 2370), Vite 8.3.5 build web/app; e2e/server.js = API Ch5 + login demo + trang đã build.
 * Đo: getByLabel('Lab') khớp 2 phần tử (form "Book a lab") ⇒ strict mode; API trễ 1,5 s ⇒ toHaveText xanh 2,2 s, isVisible() và waitForTimeout(1000) đỏ.
 */
import G from '../giang/tst-07-1.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|✘|passed|failed|Running/.test(l)).join('\n');
const LOI = (t) => t.split('\n').filter((l) => /^\$ |✓|✘|passed \(|failed$|Error:|Expected|Received|resolved to|^\s+[12]\) </.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const BUILD = OUT['71-build'].split('\n').filter((l) => /^\$ |dist-web|built in/.test(l)).join('\n');
const SCRIPTS = CODE.pkg.split('\n').filter((l) => /"scripts"|"test|"build/.test(l)).join('\n') + '\n  }';
const PW = CODE.pwConfig.split('\n');
const PW_CFG = [...PW.slice(0, PW.findIndex((l) => l.includes('projects: ['))), '  projects: [ /* setup + five browsers — lessons 7.2 and 7.4 */ ],', '});'].join('\n');
const AP = CODE.app.split('\n');
const APP = AP.slice(AP.findIndex((l) => l.startsWith('export function App'))).join('\n');
const CAI = 'npm install --save-dev --save-exact @playwright/test@1.64.1 vite@8.3.5\nnpx playwright install chromium firefox webkit     # browsers for this Playwright version, about 400 MB the first time';

const SO_EN = `<table>
<thead><tr><th>Chapter 6 (Testing Library)</th><th>Chapter 7 (Playwright)</th><th>Note</th></tr></thead>
<tbody>
<tr><td><code>screen.getByRole('button', { name: 'Book' })</code></td><td><code>page.getByRole('button', { name: 'Book' })</code></td><td>the same idea, a real browser</td></tr>
<tr><td><code>screen.getByLabelText('Date')</code></td><td><code>page.getByLabel('Date')</code></td><td>substring match by default — use <code>exact: true</code></td></tr>
<tr><td><code>await screen.findByRole('status')</code></td><td><code>await expect(page.getByRole('status')).toBeVisible()</code></td><td>Playwright assertions retry by themselves</td></tr>
<tr><td><code>await user.type(input, '20')</code></td><td><code>await locator.fill('20')</code></td><td>Playwright also has <code>pressSequentially</code> for key by key</td></tr>
</tbody></table>`;
const SO_VI = `<table>
<thead><tr><th>Chương 6 (Testing Library)</th><th>Chương 7 (Playwright)</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td><code>screen.getByRole('button', { name: 'Book' })</code></td><td><code>page.getByRole('button', { name: 'Book' })</code></td><td>cùng ý tưởng, trình duyệt thật</td></tr>
<tr><td><code>screen.getByLabelText('Date')</code></td><td><code>page.getByLabel('Date')</code></td><td>mặc định khớp một phần — dùng <code>exact: true</code></td></tr>
<tr><td><code>await screen.findByRole('status')</code></td><td><code>await expect(page.getByRole('status')).toBeVisible()</code></td><td>assertion của Playwright tự thử lại</td></tr>
<tr><td><code>await user.type(input, '20')</code></td><td><code>await locator.fill('20')</code></td><td>Playwright còn có <code>pressSequentially</code> để gõ từng phím</td></tr>
</tbody></table>`;

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Playwright test</div><div class="lz-d">e2e/*.spec.js — clicks, types, expects</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Real browser</div><div class="lz-d">Chromium, Firefox or WebKit, headless</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Built React app</div><div class="lz-d">dist-web, made by Vite from web/app</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">e2e server</div><div class="lz-d">the Chapter 5 API + a demo login</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Business rules</div><div class="lz-d">bookLab, checkSlot — Chapters 1–2</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Test Playwright</div><div class="lz-d">e2e/*.spec.js — bấm, gõ, khẳng định</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Trình duyệt thật</div><div class="lz-d">Chromium, Firefox hoặc WebKit, chạy ẩn</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">App React đã build</div><div class="lz-d">dist-web, do Vite dựng từ web/app</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Server e2e</div><div class="lz-d">API của Chương 5 + đăng nhập demo</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Luật nghiệp vụ</div><div class="lz-d">bookLab, checkSlot — Chương 1–2</div></div>
</div>`;

export default {
  title: '7.1 — Playwright: your first browser test|||7.1 — Playwright: test trình duyệt đầu tiên',
  slug: 'tst-7-1-playwright',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cài Playwright 1.64.1 + Vite 8.3.5, ghép LabFlow Lite thành một ứng dụng chạy được (trang đăng nhập + form đặt phòng + server e2e có đăng nhập demo); webServer trong playwright.config.js tự build và bật server; test đầu tiên đăng nhập rồi đặt phòng; locator giống Chương 6; đo thật: strict mode khi getByLabel("Lab") khớp 2 phần tử, API trễ 1,5 s ⇒ assertion web-first xanh còn isVisible() và waitForTimeout(1000) đỏ.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Playwright: your first browser test</h2>
<p class="lead">Chapters 1–6 tested LabFlow Lite one layer at a time. None of them proves that a student can actually open the site, sign in and book a lab — the pieces could each be right and still not fit together. An end-to-end test checks exactly that, in a real browser.</p>
<p><strong>After this lesson you can</strong> start the whole app and a browser with one command, write a test that signs in and books a lab, choose locators that do not break, and wait for the page the right way. <strong>Why it is useful:</strong> this is the only kind of test that sees what a user sees; it catches wiring bugs — a wrong token, a missing route, a role mix-up — that no unit test can.</p>

<h3>What an end-to-end test drives</h3>
${FLOW_EN}
<p>Every layer runs together. The price is speed and clarity: a browser per test, more moving parts, and a red test that can point anywhere. That is why the test pyramid of lesson 0.1 keeps these tests few and spends them on whole journeys.</p>

<h3>Setup</h3>
${ma('bash', CAI)}
${ma('json', SCRIPTS)}
<p>LabFlow Lite grows three pieces in this chapter:</p>
<ul>
<li><code>web/app/</code> — a page with a sign-in form (<code>LoginForm.jsx</code>) and an <code>App</code> that shows the booking form of Chapter 6 to students and lecturers, and the admin list to admins.</li>
<li><code>vite.config.js</code> — Vite builds <code>web/app</code> into <code>dist-web/</code>, a folder of plain HTML, CSS and JavaScript.</li>
<li><code>e2e/server.js</code> — the Chapter 5 API, a demo login and the built page, on one port.</li>
</ul>
${ma('javascript', CODE.server)}
${ma('javascript', APP)}
<p>The demo accounts are an and binh (students), thay (lecturer) and boss (admin), all with the password <code>labflow-demo</code>. This server only ever runs on a developer machine or in CI; a real login checks a password hash — the Node.js course builds one.</p>
${ra(BUILD)}

<h3>One config starts everything</h3>
${ma('javascript', PW_CFG)}
<ul>
<li><code>webServer</code> runs <code>npm run build:web &amp;&amp; node e2e/server.js</code>, waits until <code>/api/health</code> answers, runs the tests and stops the server. <code>reuseExistingServer: false</code> always builds fresh — the Lab 7 grader relies on it.</li>
<li><code>use.baseURL</code> lets tests write <code>page.goto('/')</code>.</li>
<li><code>testMatch</code> covers <code>e2e/</code> (reference tests) and <code>demo7/</code> (this chapter’s experiments); <code>npm run test:e2e</code> runs <code>e2e/</code> in Chromium only.</li>
<li>The <code>projects</code> list — a setup project and five browsers — is explained in lessons 7.2 and 7.4.</li>
</ul>

<h3>The first journey</h3>
${ma('javascript', CODE.dauTien)}
${ra(gon(OUT['71-dau-tien']))}
<p>Three journeys, built app and server included, in two and a half seconds. Each test gets a new <em>browser context</em> — its own cookies and storage — so tests never see each other’s sessions. The two <code>[setup]</code> lines come from lesson 7.2.</p>

<h3>Locators: the Chapter 6 queries, in a real browser</h3>
${SO_EN}
${ma('javascript', CODE.strict)}
${ra(LOI(OUT['71-strict']))}
<p>Playwright locators are <em>strict</em>: an action on a locator that matches two elements fails instead of guessing. Here the reason is subtle — <code>getByLabel('Lab')</code> matches part of a name, case-insensitively, and the form is named “Book a <strong>lab</strong>”. <code>exact: true</code>, or a role with a name, removes the ambiguity. The shared helpers in <code>e2e/helpers.js</code> use <code>exact: true</code> everywhere.</p>

<h3>Auto-wait: let the assertion retry</h3>
${ma('javascript', CODE.cho)}
${ra(LOI(OUT['71-cho']))}
<p><code>page.route</code> delays the booking request by 1.5 seconds. <code>await expect(locator).toHaveText(…)</code> is a <em>web-first assertion</em>: it re-checks the page until the text matches or 5 seconds pass — green after 2.2 s. <code>isVisible()</code> answers once, at once: false. A one-second sleep is still too short; a three-second sleep would pass today and fail the day the server is slower. Actions such as <code>click</code> and <code>fill</code> wait as well: until the element is attached, visible, stable and enabled.</p>
<div class="pitfall"><strong>One-shot checks and fixed sleeps.</strong> <code>expect(await locator.isVisible()).toBe(true)</code> and <code>waitForTimeout</code> are the two most common reasons end-to-end tests flicker. Both failed in this measurement while the retrying assertion passed. Write every wait as <code>await expect(locator)…</code>.</div>

<h3>Writing tests faster: codegen and UI mode</h3>
<p><code>npx playwright codegen http://localhost:4173</code> (with the server running) opens a browser and writes test code as you click; <code>npx playwright test --ui</code> shows every step with a timeline. Both are interactive tools to run on your own machine. Treat codegen output as a first draft: it picks reasonable locators, but naming the test, choosing what to assert and removing repetition is still your job.</p>

${lienKet({ khoa: 'nextjs', bai: 'nextjs-19-4-playwright-e2e', title: 'Also in the Next.js course — 19.4: Playwright e2e', sub: 'The same tool on a Next.js app; this chapter adds sessions, data isolation, traces, browsers and a mutation-graded lab.', cta: 'OPEN LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>The page title is “LabFlow Lite” and the Password field has <code>type="password"</code>.</li>
<li>Lecturer thay signs in: the header says “Signed in as thay (LECTURER)” and the “Book a lab” heading is shown.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th71)}
${ra(gon(OUT['71-th']))}
<p><strong>Done when</strong> <code>demo7/th71.spec.js</code> shows 4 passed (your 2 tests and the 2 setup sign-ins). <code>toHaveTitle</code> and <code>toHaveAttribute</code> are web-first assertions too: they retry like <code>toHaveText</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">end-to-end (e2e) test</span><span class="v">A test that drives the whole system the way a user does — here a real browser on the real app.</span></div>
  <div class="kv"><span class="k">locator</span><span class="v">A recipe for finding elements, evaluated each time it is used, so it always sees the current page.</span></div>
  <div class="kv"><span class="k">strict mode</span><span class="v">Actions fail when a locator matches more than one element.</span></div>
  <div class="kv"><span class="k">web-first assertion</span><span class="v"><code>await expect(locator)…</code> — retries until it passes or times out.</span></div>
  <div class="kv"><span class="k">browser context</span><span class="v">An isolated browser profile: its own cookies, storage and pages.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One config builds the app, starts the server and the browser.</li>
<li>Query by role and label; add <code>exact: true</code> when names overlap.</li>
<li>Wait with retrying assertions, never with sleeps or one-shot checks.</li>
<li>Keep e2e tests few and spend them on whole journeys.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Playwright: test trình duyệt đầu tiên</h2>
<p class="lead">Chương 1–6 test LabFlow Lite từng tầng một. Chưa test nào chứng minh một sinh viên thật sự mở được trang, đăng nhập và đặt được phòng — từng mảnh có thể đúng mà vẫn không khớp với nhau. Test đầu-cuối kiểm đúng điều đó, trong một trình duyệt thật.</p>
<p><strong>Sau bài này bạn có thể</strong> bật cả ứng dụng lẫn trình duyệt bằng một lệnh, viết test đăng nhập rồi đặt phòng, chọn locator không gãy, và chờ trang đúng cách. <strong>Vì sao hữu ích:</strong> đây là loại test duy nhất thấy đúng thứ người dùng thấy; nó bắt được bug ở chỗ nối — sai token, thiếu route, nhầm vai trò — mà không unit test nào bắt được.</p>

<h3>Test đầu-cuối điều khiển những gì</h3>
${FLOW_VI}
<p>Mọi tầng chạy cùng nhau. Cái giá là tốc độ và độ rõ: mỗi test một trình duyệt, nhiều bộ phận chuyển động, và một test đỏ có thể trỏ đi bất cứ đâu. Vì thế kim tự tháp test ở bài 0.1 giữ loại test này ít, và dành chúng cho các hành trình trọn vẹn.</p>

<h3>Chuẩn bị</h3>
${ma('bash', CAI)}
${ma('json', SCRIPTS)}
<p>Chương này LabFlow Lite có thêm ba phần:</p>
<ul>
<li><code>web/app/</code> — một trang có form đăng nhập (<code>LoginForm.jsx</code>) và một <code>App</code> hiện form đặt phòng của Chương 6 cho sinh viên và giảng viên, và danh sách admin cho admin.</li>
<li><code>vite.config.js</code> — Vite build <code>web/app</code> ra <code>dist-web/</code>, một thư mục HTML, CSS và JavaScript thường.</li>
<li><code>e2e/server.js</code> — API của Chương 5, một đăng nhập demo và trang đã build, trên cùng một cổng.</li>
</ul>
${ma('javascript', CODE.server)}
${ma('javascript', APP)}
<p>Tài khoản demo là an và binh (sinh viên), thay (giảng viên) và boss (admin), cùng mật khẩu <code>labflow-demo</code>. Server này chỉ chạy trên máy lập trình viên hoặc trong CI; đăng nhập thật kiểm mã băm mật khẩu — khoá Node.js có dựng một cái.</p>
${ra(BUILD)}

<h3>Một file cấu hình bật mọi thứ</h3>
${ma('javascript', PW_CFG)}
<ul>
<li><code>webServer</code> chạy <code>npm run build:web &amp;&amp; node e2e/server.js</code>, chờ tới khi <code>/api/health</code> trả lời, chạy test rồi tắt server. <code>reuseExistingServer: false</code> luôn build mới — máy chấm của Lab 7 dựa vào điều này.</li>
<li><code>use.baseURL</code> cho phép test viết <code>page.goto('/')</code>.</li>
<li><code>testMatch</code> gồm <code>e2e/</code> (test tham khảo) và <code>demo7/</code> (thí nghiệm của chương); <code>npm run test:e2e</code> chạy <code>e2e/</code> trên Chromium.</li>
<li>Danh sách <code>projects</code> — một setup project và năm trình duyệt — được giải thích ở bài 7.2 và 7.4.</li>
</ul>

<h3>Hành trình đầu tiên</h3>
${ma('javascript', CODE.dauTien)}
${ra(gon(OUT['71-dau-tien']))}
<p>Ba hành trình, tính cả build app và bật server, trong hai giây rưỡi. Mỗi test có một <em>browser context</em> mới — cookie và storage riêng — nên các test không bao giờ thấy phiên của nhau. Hai dòng <code>[setup]</code> đến từ bài 7.2.</p>

<h3>Locator: truy vấn của Chương 6, trong trình duyệt thật</h3>
${SO_VI}
${ma('javascript', CODE.strict)}
${ra(LOI(OUT['71-strict']))}
<p>Locator của Playwright là <em>nghiêm ngặt</em>: thao tác trên một locator khớp hai phần tử sẽ hỏng thay vì đoán. Lý do ở đây rất khó thấy — <code>getByLabel('Lab')</code> khớp một phần tên, không phân biệt hoa thường, mà form lại tên “Book a <strong>lab</strong>”. <code>exact: true</code>, hoặc role kèm tên, xoá sự mơ hồ. Các hàm dùng chung trong <code>e2e/helpers.js</code> dùng <code>exact: true</code> ở mọi chỗ.</p>

<h3>Tự chờ: để assertion tự thử lại</h3>
${ma('javascript', CODE.cho)}
${ra(LOI(OUT['71-cho']))}
<p><code>page.route</code> làm request đặt phòng trễ 1,5 giây. <code>await expect(locator).toHaveText(…)</code> là một <em>web-first assertion</em>: nó kiểm lại trang tới khi chữ khớp hoặc hết 5 giây — xanh sau 2,2 giây. <code>isVisible()</code> trả lời một lần, ngay lập tức: false. Sleep một giây vẫn quá ngắn; sleep ba giây hôm nay qua, và đỏ vào hôm server chậm hơn. Các thao tác như <code>click</code> và <code>fill</code> cũng tự chờ: tới khi phần tử đã gắn vào trang, hiển thị, đứng yên và bật.</p>
<div class="pitfall"><strong>Kiểm một lần và sleep cố định.</strong> <code>expect(await locator.isVisible()).toBe(true)</code> và <code>waitForTimeout</code> là hai lý do phổ biến nhất khiến test đầu-cuối chập chờn. Cả hai đều đỏ trong phép đo này trong khi assertion biết thử lại thì xanh. Hãy viết mọi lần chờ thành <code>await expect(locator)…</code>.</div>

<h3>Viết test nhanh hơn: codegen và UI mode</h3>
<p><code>npx playwright codegen http://localhost:4173</code> (khi server đang chạy) mở trình duyệt và viết code test theo từng cú bấm của bạn; <code>npx playwright test --ui</code> hiện từng bước kèm dòng thời gian. Cả hai là công cụ tương tác để chạy trên máy bạn. Hãy coi output của codegen là bản nháp: nó chọn locator khá hợp lý, nhưng đặt tên test, chọn điều cần khẳng định và bỏ phần lặp vẫn là việc của bạn.</p>

${lienKet({ khoa: 'nextjs', bai: 'nextjs-19-4-playwright-e2e', title: 'Gặp lại ở khoá Next.js — 19.4: Playwright e2e', sub: 'Cùng công cụ trên một app Next.js; chương này thêm phiên đăng nhập, cô lập dữ liệu, trace, nhiều trình duyệt và một lab chấm bằng đột biến.', cta: 'MỞ BÀI →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Tiêu đề trang là “LabFlow Lite” và ô Password có <code>type="password"</code>.</li>
<li>Giảng viên thay đăng nhập: header ghi “Signed in as thay (LECTURER)” và hiện tiêu đề “Book a lab”.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th71)}
${ra(gon(OUT['71-th']))}
<p><strong>Xong khi</strong> <code>demo7/th71.spec.js</code> báo 4 passed (2 test của bạn và 2 lần đăng nhập setup). <code>toHaveTitle</code> và <code>toHaveAttribute</code> cũng là assertion web-first: chúng tự thử lại như <code>toHaveText</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">end-to-end (e2e) test (test đầu-cuối)</span><span class="v">Test điều khiển cả hệ thống như người dùng — ở đây là trình duyệt thật trên ứng dụng thật.</span></div>
  <div class="kv"><span class="k">locator</span><span class="v">Công thức tìm phần tử, được tính lại mỗi lần dùng nên luôn thấy trang hiện tại.</span></div>
  <div class="kv"><span class="k">strict mode (chế độ nghiêm ngặt)</span><span class="v">Thao tác hỏng khi một locator khớp nhiều hơn một phần tử.</span></div>
  <div class="kv"><span class="k">web-first assertion</span><span class="v"><code>await expect(locator)…</code> — thử lại tới khi qua hoặc hết giờ.</span></div>
  <div class="kv"><span class="k">browser context</span><span class="v">Một hồ sơ trình duyệt cô lập: cookie, storage và các trang riêng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một file cấu hình build app, bật server và trình duyệt.</li>
<li>Truy vấn theo role và label; thêm <code>exact: true</code> khi tên trùng một phần.</li>
<li>Chờ bằng assertion biết thử lại, không bao giờ bằng sleep hay kiểm một lần.</li>
<li>Giữ test e2e ít, và dành chúng cho các hành trình trọn vẹn.</li>
</ul>
</div>
`,
};
