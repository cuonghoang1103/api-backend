/**
 * Testing · Chương 7 · 7.4 — Nhiều trình duyệt, thiết bị và kiểm tra hình ảnh. Slug giữ từ khung: tst-7-4-da-trinh-duyet.
 * Chạy thật (Playwright 1.64.1; Chromium, Firefox, WebKit; Pixel 7 + iPhone 15 giả lập): 37 xanh 16,9 s; dau-tien.spec.js (phòng cố định BE-201) trên
 * firefox + webkit ⇒ Firefox đỏ 3/3 lần vì WebKit đặt khung đó trước (alert "already taken") — lỗi dữ liệu dùng chung, không phải lỗi Firefox;
 * toHaveCSS 20px/17px theo bề rộng; toHaveScreenshot: lần đầu ghi ảnh gốc -darwin.png, cam đậm hơn (#d35400) vẫn xanh, xanh dương ⇒ 2423 pixel khác.
 */
import G from '../giang/tst-07-4.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |✓|✘|passed|failed$|Running/.test(l)).join('\n');
const PW = CODE.pwConfig.split('\n');
const PROJ = PW.slice(PW.findIndex((l) => l.includes('projects: [')), PW.findIndex((l) => l.trim() === '],') + 1).join('\n');
const TONG = OUT['74-all'].split('\n').filter((l) => /^\$ |Running|passed \(|\[setup\]|dat-phong\.spec\.js:8:3/.test(l)).join('\n');
const FFWK = OUT['74-ff-wk'].split('\n').filter((l) => /^\$ |✓|✘|Expected:|element\(s\) not found|failed$|passed \(|alert:/.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const HINH1 = OUT['74-hinh-1'].split('\n').filter((l) => /^\$ |✘|snapshot doesn't exist|failed$|passed \(/.test(l)).join('\n');
const HINH_DAM = OUT['74-hinh-dam'].split('\n').filter((l) => /^\$ |^planted|✘|pixels \(ratio|Expected: demo7|Received: test|Diff:|^sign-in|^error-context|failed$|passed \(/.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const STYLE = CODE.style.split('\n').filter((l) => /^header h1|^@media/.test(l)).join('\n');

const MAY_EN = `<table>
<thead><tr><th>Engine</th><th>Playwright project</th><th>Who uses it</th></tr></thead>
<tbody>
<tr><td>Chromium (Blink)</td><td><code>chromium</code>, <code>mobile-chrome</code></td><td>Chrome, Edge, Opera, Brave, Chrome on Android</td></tr>
<tr><td>Gecko</td><td><code>firefox</code></td><td>Firefox on desktops</td></tr>
<tr><td>WebKit</td><td><code>webkit</code>, <code>mobile-safari</code></td><td>Safari on Mac and iPhone — and, outside the EU, every browser on an iPhone, Chrome included</td></tr>
</tbody></table>`;
const MAY_VI = `<table>
<thead><tr><th>Engine</th><th>Project Playwright</th><th>Ai dùng</th></tr></thead>
<tbody>
<tr><td>Chromium (Blink)</td><td><code>chromium</code>, <code>mobile-chrome</code></td><td>Chrome, Edge, Opera, Brave, Chrome trên Android</td></tr>
<tr><td>Gecko</td><td><code>firefox</code></td><td>Firefox trên máy tính</td></tr>
<tr><td>WebKit</td><td><code>webkit</code>, <code>mobile-safari</code></td><td>Safari trên Mac và iPhone — và, ngoài EU, mọi trình duyệt trên iPhone, kể cả Chrome</td></tr>
</tbody></table>`;

const GIA_EN = `<table>
<thead><tr><th>Suite (LabFlow Lite, end of Chapter 7)</th><th>Tests</th><th>Time measured</th><th>A red test points to</th></tr></thead>
<tbody>
<tr><td><code>npm run test:unit</code> — rules, service, API (Ch1–5)</td><td>85</td><td>430 ms</td><td>one function, one line</td></tr>
<tr><td><code>npm run test:web</code> — React components in jsdom (Ch6)</td><td>16</td><td>2.26 s</td><td>one component, one state</td></tr>
<tr><td><code>npm run test:e2e</code> — journeys, Chromium (Ch7)</td><td>7 + 2 setup</td><td>3.1 s</td><td>a journey: anywhere from the form to the server</td></tr>
<tr><td><code>npm run test:e2e:all</code> — five projects</td><td>35 + 2 setup</td><td>16.9 s</td><td>a journey in one browser or device</td></tr>
</tbody></table>`;
const GIA_VI = `<table>
<thead><tr><th>Bộ test (LabFlow Lite, cuối Chương 7)</th><th>Số test</th><th>Thời gian đo</th><th>Một test đỏ chỉ về</th></tr></thead>
<tbody>
<tr><td><code>npm run test:unit</code> — luật, service, API (Ch1–5)</td><td>85</td><td>430 ms</td><td>một hàm, một dòng</td></tr>
<tr><td><code>npm run test:web</code> — component React trong jsdom (Ch6)</td><td>16</td><td>2,26 s</td><td>một component, một trạng thái</td></tr>
<tr><td><code>npm run test:e2e</code> — hành trình, Chromium (Ch7)</td><td>7 + 2 setup</td><td>3,1 s</td><td>một hành trình: từ form tới server, đâu cũng có thể</td></tr>
<tr><td><code>npm run test:e2e:all</code> — năm project</td><td>35 + 2 setup</td><td>16,9 s</td><td>một hành trình trên một trình duyệt hay thiết bị</td></tr>
</tbody></table>`;

const CHON_EN = `<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Does it cross the browser, the client and the server?</span><span class="lz-lnote">yes → a journey candidate</span></div>
  <div class="lz-layer"><span class="lz-lname">Would a failure stop people working, or cost money?</span><span class="lz-lnote">sign-in, booking, payment → e2e</span></div>
  <div class="lz-layer"><span class="lz-lname">Is it a rule with boundaries?</span><span class="lz-lnote">30/31 seats, 07:00/06:30 → unit test (Ch1)</span></div>
  <div class="lz-layer"><span class="lz-lname">Is it a status code or a JSON shape?</span><span class="lz-lnote">→ API test (Ch5)</span></div>
  <div class="lz-layer"><span class="lz-lname">Is it a state of one screen?</span><span class="lz-lnote">loading, empty, 403 → component test (Ch6)</span></div>
  <div class="lz-layer"><span class="lz-lname">Does it depend on the browser or the screen size?</span><span class="lz-lnote">layout, input types → several projects</span></div>
</div>`;
const CHON_VI = `<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó có đi qua trình duyệt, client và server không?</span><span class="lz-lnote">có → ứng viên cho một hành trình</span></div>
  <div class="lz-layer"><span class="lz-lname">Nếu hỏng thì người dùng có bị chặn việc, hay mất tiền?</span><span class="lz-lnote">đăng nhập, đặt phòng, thanh toán → e2e</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó là một luật có biên?</span><span class="lz-lnote">30/31 chỗ, 07:00/06:30 → unit test (Ch1)</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó là mã trạng thái hay hình dạng JSON?</span><span class="lz-lnote">→ test API (Ch5)</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó là một trạng thái của một màn hình?</span><span class="lz-lnote">đang tải, rỗng, 403 → test component (Ch6)</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó phụ thuộc trình duyệt hay kích thước màn hình?</span><span class="lz-lnote">bố cục, kiểu ô nhập → nhiều project</span></div>
</div>`;

export default {
  title: '7.4 — Browsers, devices and visual checks|||7.4 — Nhiều trình duyệt, thiết bị và kiểm tra hình ảnh',
  slug: 'tst-7-4-da-trinh-duyet',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba engine (Chromium, Gecko, WebKit) và vì sao WebKit đại diện người dùng iPhone; năm project trong một file cấu hình, preset thiết bị chứa gì (viewport, tỉ lệ điểm ảnh, cảm ứng, user agent) và giới hạn của giả lập; đo thật: 37 test xanh 16,9 s, nhưng test dùng phòng cố định chạy trên hai trình duyệt thì Firefox đỏ — Firefox vô tội, hai project dùng chung một server; luật bố cục theo bề rộng màn hình bằng toHaveCSS; so sánh ảnh chụp: ảnh gốc theo trình duyệt và hệ điều hành, ngưỡng 0.2 để lọt nút cam đậm hơn, bắt nút xanh dương 2423 pixel; khi nào test e2e đáng tiền.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Browsers, devices and visual checks</h2>
<p class="lead">So far every journey ran in Chromium on a desktop-sized window. LabFlow’s students open it on iPhones between classes and on Firefox in the library. This lesson runs the same journeys in three browser engines and two emulated phones, checks a layout rule that changes with the screen, adds a test that compares pixels — and ends with the question every team must answer: how many of these tests is the right number?</p>
<p><strong>After this lesson you can</strong> configure projects for browsers and devices, explain what device emulation does and does not do, write a test that expects different values per device, use screenshot comparison while knowing its blind spots, and decide which checks belong in an end-to-end test at all. <strong>Why it is useful:</strong> “it works on my Chrome” is how Safari-only bugs reach production, and a suite that runs everything in five browsers is how CI becomes too slow to wait for. Knowing both sides is what makes an e2e suite worth its cost.</p>

<h3>Three engines, not five browsers</h3>
${MAY_EN}
<p>Browsers differ less in their name than in their <em>engine</em> — the part that parses HTML, applies CSS and runs JavaScript. Playwright downloads one build of each engine (lesson 7.1 installed them). Testing three engines covers almost every user; testing Chrome and Edge separately would test Blink twice.</p>

<h3>One test file, five projects</h3>
${ma('javascript', PROJ)}
<p>A project is a named set of options. Every test runs once per project, with that project’s browser and settings; <code>--project=chromium</code> picks one. What does a device preset actually set?</p>
${ra(OUT['74-devices'])}
<p>A window size (<code>viewport</code>), the pixel density (<code>deviceScaleFactor</code>), <code>isMobile</code> (the page’s viewport meta tag is honoured, as on a phone), <code>hasTouch</code> (touch events exist) and a <code>userAgent</code> string — plus the engine to run it in: the Pixel 7 runs in Chromium, the iPhone 15 in WebKit. That is <em>emulation</em>: the real phone’s CPU, memory, network, keyboard, browser toolbar and iOS itself are not there. It catches layout and touch-target problems quickly; it does not replace one test pass on a real device before an important release (services such as BrowserStack rent real phones for that).</p>
${ra(TONG)}
<p>The whole suite, in all five projects: 37 tests (7 journeys × 5 + 2 setup) in 16.9 seconds — the line shown for each project is the same journey. Run Chromium while you work (<code>npm run test:e2e</code>) and everything before merging (<code>npm run test:e2e:all</code>), on CI in Chapter 9.</p>

<h3>The failure is in Firefox, but Firefox is innocent</h3>
<p>Lesson 7.1’s first test file was written for one browser. Run it in two:</p>
${ra(FFWK)}
<p>Firefox red, WebKit green — measured three times in a row, the same each time. A Firefox bug? The last line (searched from <code>error-context.md</code>) says otherwise: the Firefox page showed <em>“This slot is already taken.”</em> <code>dau-tien.spec.js</code> books lab BE-201 on 16 November at 08:00 in every browser, and both projects talk to the same e2e server. WebKit finished first, so Firefox found the slot taken.</p>
<div class="pitfall co-tieu-de"><strong>More projects multiply data collisions.</strong> A test that is “fine” in one browser shares its data with itself as soon as it runs in two. Before blaming a browser, read the error context. The suite in <code>e2e/</code> does not have this problem: <code>freshLab</code> hashes <code>testInfo.testId</code>, which is different for each project — that is why all 37 passed.</div>

<h3>A rule that depends on the screen</h3>
<p>The stylesheet makes the header title smaller on narrow screens:</p>
${ma('css', STYLE)}
${ma('javascript', CODE.th74)}
${ra(gon(OUT['74-th']))}
<p><code>toHaveCSS</code> reads the <em>computed</em> style — the value after every rule and media query has been applied — and retries like every web-first assertion. <code>testInfo.project.name</code> tells the test which project it is running in, so one test expects 20px on desktops and 17px on phones. This is a cheap, precise check for a layout rule: if the media query breaks, the phones turn red and the message names the value.</p>
<p>Use per-project expectations sparingly. When a test needs many <code>if (mobile)</code> branches, it is really two tests; write two, and skip each where it does not apply (<code>test.skip(!mobile, 'phones only')</code>).</p>

<h3>Screenshot comparison</h3>
${ma('javascript', CODE.hinhAnh)}
${ra(HINH1)}
${ra(gon(OUT['74-hinh-2']))}
<p>The first run has nothing to compare with: it writes the current screenshot as the <em>baseline</em> and fails, so nobody accepts a baseline without looking at it. The second run compares and passes. Look at the file names: <code>sign-in-chromium-darwin.png</code> — the browser <strong>and the operating system</strong> are part of the name, because the same page renders fonts differently on macOS, Windows and Linux.</p>
<p>Now two changes to the button colour, planted with <code>thu-loi-pw.mjs</code> (one change, one run, file restored):</p>
${ra(gon(OUT['74-hinh-nhe']))}
${ra(HINH_DAM)}
<ul>
<li><strong>Orange <code>#e06a1b</code> → darker orange <code>#d35400</code>: passed.</strong> By default each pixel may differ by a colour distance of up to 0.2 (on a 0–1 scale) before it counts as different. Close colours are “the same”.</li>
<li><strong>Orange → blue <code>#1f6feb</code>: failed</strong> with “2423 pixels (ratio 0.01 of all image pixels) are different” and three images saved: expected, actual and a diff that paints the changed pixels. Slide 7 above shows the baseline and that diff.</li>
</ul>
<p>Options you will meet: <code>maxDiffPixels</code> or <code>maxDiffPixelRatio</code> (how many pixels may differ), <code>threshold</code> (the per-pixel colour distance), <code>mask</code> (cover a clock or an avatar that changes every run), and <code>npx playwright test --update-snapshots</code> to accept a new baseline <em>after</em> you have looked at the diff and decided the change is wanted.</p>
<div class="pitfall co-tieu-de"><strong>A baseline made on your Mac fails on Linux CI.</strong> Same page, different fonts, thousands of pixels — and an update you did not mean. Generate the baselines on the same OS as CI (usually Linux, often inside Playwright’s Docker image — Chapter 9), commit them on purpose, and keep visual tests few: one stable screen each, not every page. A pixel test sees colour and position; it does not know whether a text is correct or a button works — the journeys do that.</div>

<h3>When is an end-to-end test worth it?</h3>
<p>Every number below was measured in this course on LabFlow Lite:</p>
${GIA_EN}
<p>An e2e test is roughly a hundred times slower than a unit test and, when red, points to a whole journey instead of a line. In exchange it is the only test that sees the wiring. A practical way to decide, question by question:</p>
${CHON_EN}
<p>LabFlow Lite ends this chapter with 85 unit and API tests, 16 component tests, 11 integration tests on PostgreSQL (Chapter 4), and 7 journeys — the pyramid of lesson 0.1, measured. Teams that invert it (hundreds of e2e tests, few unit tests) get the slow, flaky “ice-cream cone” that SWT301 warns about.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>demo7/dau-tien.spec.js</code> in <code>firefox</code> and <code>webkit</code>. One test turns red. Before reading the answer above, open its <code>error-context.md</code> and explain why.</li>
<li>Write one test that expects the header title to be 20px on the three desktop projects and 17px on the two phones.</li>
</ol>
<p><strong>Solution and real output:</strong> (1) is explained in “The failure is in Firefox” — the cure is a lab per test, as in <code>e2e/</code>. (2):</p>
${ma('javascript', CODE.th74)}
${ra(gon(OUT['74-th']))}
<p><strong>Done when</strong> 7 tests pass (5 projects + 2 setup) and you can name the real cause of the red Firefox test.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">browser engine</span><span class="v">The part of a browser that renders HTML/CSS and runs JavaScript: Blink (Chromium), Gecko (Firefox), WebKit (Safari).</span></div>
  <div class="kv"><span class="k">project</span><span class="v">A named set of options in <code>playwright.config.js</code>; every test runs once per project.</span></div>
  <div class="kv"><span class="k">device emulation (giả lập thiết bị)</span><span class="v">Viewport, pixel density, touch and user agent of a phone, in a desktop browser engine.</span></div>
  <div class="kv"><span class="k">computed style</span><span class="v">The final CSS value of an element after all rules and media queries.</span></div>
  <div class="kv"><span class="k">visual regression test (test hồi quy hình ảnh)</span><span class="v">Compares a screenshot with a stored baseline, pixel by pixel within a threshold.</span></div>
  <div class="kv"><span class="k">baseline (ảnh gốc)</span><span class="v">The approved screenshot, one per test, browser and operating system.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Three engines cover nearly every user; WebKit stands for every iPhone.</li>
<li>Device presets emulate size, density, touch and user agent — not the phone itself.</li>
<li>More projects share one server: give every test its own data, and read the error context before blaming a browser.</li>
<li><code>toHaveCSS</code> + <code>testInfo.project.name</code> checks layout rules per device.</li>
<li>Screenshots catch visible changes beyond a threshold; baselines are per browser and OS.</li>
<li>Keep e2e tests few: journeys and wiring, not rules.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Nhiều trình duyệt, thiết bị và kiểm tra hình ảnh</h2>
<p class="lead">Tới giờ mọi hành trình đều chạy trên Chromium với cửa sổ cỡ máy tính. Sinh viên dùng LabFlow mở nó trên iPhone giữa giờ học và bằng Firefox ở thư viện. Bài này chạy cùng các hành trình trên ba engine trình duyệt và hai điện thoại giả lập, kiểm một luật bố cục thay đổi theo màn hình, thêm một test so từng điểm ảnh — và kết thúc bằng câu hỏi mọi nhóm đều phải trả lời: bao nhiêu test loại này là vừa?</p>
<p><strong>Sau bài này bạn có thể</strong> cấu hình project cho trình duyệt và thiết bị, giải thích giả lập thiết bị làm được gì và không làm được gì, viết test mong giá trị khác nhau theo từng thiết bị, dùng so sánh ảnh chụp khi biết rõ điểm mù của nó, và quyết định kiểm tra nào thật sự nên nằm trong test đầu-cuối. <strong>Vì sao hữu ích:</strong> “trên Chrome của em chạy mà” là con đường bug riêng của Safari lên tới production, còn bộ test chạy mọi thứ trên năm trình duyệt là con đường khiến CI chậm tới mức không ai muốn chờ. Hiểu cả hai phía mới làm bộ e2e đáng với cái giá của nó.</p>

<h3>Ba engine, không phải năm trình duyệt</h3>
${MAY_VI}
<p>Trình duyệt khác nhau ít ở cái tên mà nhiều ở <em>engine</em> — phần phân tích HTML, áp CSS và chạy JavaScript. Playwright tải một bản dựng của mỗi engine (bài 7.1 đã cài). Test ba engine là phủ gần như mọi người dùng; test riêng Chrome và Edge là test Blink hai lần.</p>

<h3>Một file test, năm project</h3>
${ma('javascript', PROJ)}
<p>Project là một bộ tuỳ chọn có tên. Mỗi test chạy một lần cho mỗi project, với trình duyệt và thiết lập của project đó; <code>--project=chromium</code> chọn một project. Một preset thiết bị thật ra đặt những gì?</p>
${ra(OUT['74-devices'])}
<p>Kích thước cửa sổ (<code>viewport</code>), mật độ điểm ảnh (<code>deviceScaleFactor</code>), <code>isMobile</code> (thẻ meta viewport của trang được tôn trọng, như trên điện thoại), <code>hasTouch</code> (có sự kiện chạm) và chuỗi <code>userAgent</code> — cộng engine để chạy: Pixel 7 chạy trên Chromium, iPhone 15 trên WebKit. Đó là <em>giả lập</em>: CPU, bộ nhớ, mạng, bàn phím, thanh công cụ trình duyệt và chính iOS của điện thoại thật đều không có. Nó bắt nhanh lỗi bố cục và vùng chạm; nó không thay được một lượt test trên thiết bị thật trước một lần phát hành quan trọng (các dịch vụ như BrowserStack cho thuê điện thoại thật để làm việc đó).</p>
${ra(TONG)}
<p>Cả bộ test, trên cả năm project: 37 test (7 hành trình × 5 + 2 setup) trong 16,9 giây — dòng được giữ lại cho mỗi project là cùng một hành trình. Khi làm việc chạy Chromium (<code>npm run test:e2e</code>), trước khi merge chạy tất cả (<code>npm run test:e2e:all</code>), trên CI ở Chương 9.</p>

<h3>Đỏ ở Firefox, nhưng Firefox vô tội</h3>
<p>File test đầu tiên của bài 7.1 được viết cho một trình duyệt. Chạy nó trên hai:</p>
${ra(FFWK)}
<p>Firefox đỏ, WebKit xanh — đo ba lần liền, lần nào cũng vậy. Bug của Firefox? Dòng cuối (lọc từ <code>error-context.md</code>) nói khác: trang trên Firefox hiện <em>“This slot is already taken.”</em> <code>dau-tien.spec.js</code> đặt phòng BE-201 ngày 16 tháng 11 lúc 08:00 trên mọi trình duyệt, và cả hai project nói chuyện với cùng một server e2e. WebKit xong trước, nên Firefox gặp khung đã có người đặt.</p>
<div class="pitfall co-tieu-de"><strong>Thêm project là nhân thêm va chạm dữ liệu.</strong> Một test “ổn” trên một trình duyệt sẽ dùng chung dữ liệu với chính nó ngay khi chạy trên hai. Trước khi đổ lỗi cho một trình duyệt, hãy đọc error context. Bộ test trong <code>e2e/</code> không gặp chuyện này: <code>freshLab</code> băm <code>testInfo.testId</code>, thứ khác nhau ở mỗi project — vì vậy cả 37 test đều qua.</div>

<h3>Một luật phụ thuộc màn hình</h3>
<p>Stylesheet làm tiêu đề header nhỏ lại trên màn hình hẹp:</p>
${ma('css', STYLE)}
${ma('javascript', CODE.th74)}
${ra(gon(OUT['74-th']))}
<p><code>toHaveCSS</code> đọc style <em>đã tính</em> — giá trị sau khi mọi luật và media query đã được áp — và thử lại như mọi assertion web-first. <code>testInfo.project.name</code> cho test biết nó đang chạy trong project nào, nên một test mong 20px trên máy tính và 17px trên điện thoại. Đây là phép kiểm rẻ và chính xác cho một luật bố cục: nếu media query hỏng, các điện thoại đỏ và thông báo ghi rõ giá trị.</p>
<p>Dùng kỳ vọng theo project một cách tiết kiệm. Khi một test cần nhiều nhánh <code>if (mobile)</code>, thật ra đó là hai test; hãy viết hai test, và bỏ qua mỗi test ở nơi nó không áp dụng (<code>test.skip(!mobile, 'phones only')</code>).</p>

<h3>So sánh ảnh chụp</h3>
${ma('javascript', CODE.hinhAnh)}
${ra(HINH1)}
${ra(gon(OUT['74-hinh-2']))}
<p>Lần chạy đầu chưa có gì để so: nó ghi ảnh chụp hiện tại làm <em>baseline</em> (ảnh gốc) và đỏ, để không ai nhận một ảnh gốc mà chưa nhìn qua. Lần chạy thứ hai so và qua. Nhìn tên file: <code>sign-in-chromium-darwin.png</code> — trình duyệt <strong>và hệ điều hành</strong> nằm trong tên, vì cùng một trang hiển thị font khác nhau trên macOS, Windows và Linux.</p>
<p>Giờ hai thay đổi màu nút, cài bằng <code>thu-loi-pw.mjs</code> (một thay đổi, một lần chạy, trả file về):</p>
${ra(gon(OUT['74-hinh-nhe']))}
${ra(HINH_DAM)}
<ul>
<li><strong>Cam <code>#e06a1b</code> → cam đậm hơn <code>#d35400</code>: qua.</strong> Mặc định mỗi điểm ảnh được lệch khoảng cách màu tới 0.2 (trên thang 0–1) mới bị tính là khác. Màu gần nhau là “như nhau”.</li>
<li><strong>Cam → xanh dương <code>#1f6feb</code>: đỏ</strong> với “2423 pixels (ratio 0.01 of all image pixels) are different” và ba ảnh được lưu: expected, actual và một ảnh diff tô các điểm ảnh đã đổi. Slide 7 phía trên cho thấy ảnh gốc và ảnh diff đó.</li>
</ul>
<p>Các tuỳ chọn bạn sẽ gặp: <code>maxDiffPixels</code> hoặc <code>maxDiffPixelRatio</code> (được khác bao nhiêu điểm ảnh), <code>threshold</code> (khoảng cách màu cho từng điểm), <code>mask</code> (che đồng hồ hay ảnh đại diện thay đổi mỗi lần chạy), và <code>npx playwright test --update-snapshots</code> để nhận ảnh gốc mới <em>sau khi</em> đã xem ảnh diff và quyết định thay đổi đó là mong muốn.</p>
<div class="pitfall co-tieu-de"><strong>Ảnh gốc làm trên Mac của bạn sẽ đỏ trên CI Linux.</strong> Cùng trang, khác font, hàng nghìn điểm ảnh — và một lần cập nhật bạn không hề muốn. Tạo ảnh gốc trên cùng hệ điều hành với CI (thường là Linux, hay dùng image Docker của Playwright — Chương 9), commit chúng có chủ đích, và giữ test hình ảnh ít: mỗi test một màn hình ổn định, không phải mọi trang. Test điểm ảnh thấy màu và vị trí; nó không biết chữ có đúng không hay nút có bấm được không — đó là việc của các hành trình.</div>

<h3>Khi nào một test đầu-cuối đáng tiền?</h3>
<p>Mọi con số dưới đây đều đo trong khoá này trên LabFlow Lite:</p>
${GIA_VI}
<p>Một test e2e chậm cỡ trăm lần một unit test và khi đỏ thì chỉ về cả một hành trình thay vì một dòng. Đổi lại nó là test duy nhất thấy phần nối. Một cách quyết định thực tế, từng câu hỏi một:</p>
${CHON_VI}
<p>LabFlow Lite kết thúc chương này với 85 unit test và test API, 16 test component, 11 test tích hợp trên PostgreSQL (Chương 4), và 7 hành trình — kim tự tháp của bài 0.1, có số đo. Nhóm nào lộn ngược nó (hàng trăm test e2e, ít unit test) sẽ có “cây kem” chậm và chập chờn mà SWT301 cảnh báo.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>demo7/dau-tien.spec.js</code> trên <code>firefox</code> và <code>webkit</code>. Một test đỏ. Trước khi đọc đáp án phía trên, mở <code>error-context.md</code> của nó và giải thích vì sao.</li>
<li>Viết một test mong tiêu đề header là 20px trên ba project máy tính và 17px trên hai điện thoại.</li>
</ol>
<p><strong>Lời giải và output thật:</strong> (1) được giải thích ở mục “Đỏ ở Firefox” — cách chữa là mỗi test một phòng, như trong <code>e2e/</code>. (2):</p>
${ma('javascript', CODE.th74)}
${ra(gon(OUT['74-th']))}
<p><strong>Xong khi</strong> 7 test qua (5 project + 2 setup) và bạn gọi đúng tên nguyên nhân thật của test Firefox đỏ.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">browser engine (engine trình duyệt)</span><span class="v">Phần của trình duyệt hiển thị HTML/CSS và chạy JavaScript: Blink (Chromium), Gecko (Firefox), WebKit (Safari).</span></div>
  <div class="kv"><span class="k">project</span><span class="v">Một bộ tuỳ chọn có tên trong <code>playwright.config.js</code>; mỗi test chạy một lần cho mỗi project.</span></div>
  <div class="kv"><span class="k">device emulation (giả lập thiết bị)</span><span class="v">Viewport, mật độ điểm ảnh, cảm ứng và user agent của điện thoại, trong engine trình duyệt của máy tính.</span></div>
  <div class="kv"><span class="k">computed style (style đã tính)</span><span class="v">Giá trị CSS cuối cùng của phần tử sau mọi luật và media query.</span></div>
  <div class="kv"><span class="k">visual regression test (test hồi quy hình ảnh)</span><span class="v">So ảnh chụp với ảnh gốc đã lưu, từng điểm ảnh trong một ngưỡng.</span></div>
  <div class="kv"><span class="k">baseline (ảnh gốc)</span><span class="v">Ảnh chụp đã được duyệt, mỗi test, trình duyệt và hệ điều hành một ảnh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ba engine phủ gần như mọi người dùng; WebKit đại diện cho mọi iPhone.</li>
<li>Preset thiết bị giả lập kích thước, mật độ, cảm ứng và user agent — không phải chính chiếc điện thoại.</li>
<li>Nhiều project dùng chung một server: cho mỗi test dữ liệu riêng, và đọc error context trước khi đổ lỗi cho trình duyệt.</li>
<li><code>toHaveCSS</code> + <code>testInfo.project.name</code> kiểm luật bố cục theo từng thiết bị.</li>
<li>Ảnh chụp bắt thay đổi nhìn thấy được vượt ngưỡng; ảnh gốc riêng cho từng trình duyệt và hệ điều hành.</li>
<li>Giữ test e2e ít: hành trình và phần nối, không phải luật.</li>
</ul>
</div>
`,
};
