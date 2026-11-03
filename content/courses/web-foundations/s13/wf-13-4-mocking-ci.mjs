/**
 * Bài 13.4 — Giả lập và chạy test trong CI (nâng cấp 01/11/2026). Output: Vitest 5.0.5 / Node 22.23.3 + actionlint 1.7.12, chạy thật
 * trong _demo/_t13. Deck: scripts/slides-src/wf-13-4.mjs (12 slide).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-13-4', 'Mocking & tests in CI', 'Giả lập & chạy test trong CI', [
  [1, 'Mocking & tests in CI',
    '<p>Two problems remain. Real code talks to the network and depends on the clock, which makes tests slow and unpredictable. And tests only help if they actually run. This lesson fixes both: fakes for the outside world, and a robot that runs the suite on every push.</p>',
    '<p>Còn hai vấn đề. Code thật nói chuyện với mạng và phụ thuộc đồng hồ, làm test chậm và khó đoán. Và test chỉ có ích nếu nó thật sự được chạy. Bài này sửa cả hai: đồ giả cho thế giới bên ngoài, và một con robot chạy bộ test ở mỗi lần push.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five skills that turn a pile of tests into a safety system: fakes for fetch, tests for failures, control over time, checks on how a function was called, and continuous integration that refuses broken code.</p>',
    '<p>Năm kỹ năng biến một đống test thành một hệ thống an toàn: đồ giả cho fetch, test cho các lần thất bại, điều khiển thời gian, kiểm một hàm được gọi thế nào, và tích hợp liên tục từ chối code hỏng.</p>'],
  [3, 'Why not the real API?',
    '<p>A test that calls a real server is slow, fails when the Wi-Fi drops, gives different answers at different times, and cannot make the server fail on purpose. The cure is simple: make the dependency a parameter and pass a fake in tests.</p>',
    '<p>Test gọi máy chủ thật thì chậm, đỏ khi Wi-Fi rớt, cho đáp án khác nhau ở thời điểm khác nhau, và không thể bắt máy chủ cố ý hỏng. Cách chữa đơn giản: biến phụ thuộc thành tham số và đưa đồ giả vào khi test.</p>'],
  [4, 'Code that can be tested',
    '<p><code>getTemperature</code> takes <code>fetchFn</code> as a parameter with the real <code>fetch</code> as its default. Production code never notices; a test passes its own function. This is dependency injection in its simplest form — no framework required.</p>',
    '<p><code>getTemperature</code> nhận <code>fetchFn</code> làm tham số với <code>fetch</code> thật là mặc định. Code chạy thật không hề nhận ra; test thì đưa hàm của riêng nó. Đây là tiêm phụ thuộc ở dạng đơn giản nhất — không cần framework nào.</p>'],
  [5, 'A fake fetch',
    '<p><code>vi.fn()</code> creates a function that records every call. <code>mockResolvedValue</code> makes it return a promise of a fake response; <code>mockRejectedValue</code> makes it fail. The <code>reply</code> helper builds only the parts of a response our code actually reads.</p>',
    '<p><code>vi.fn()</code> tạo một hàm ghi lại mọi lần được gọi. <code>mockResolvedValue</code> cho nó trả về promise của một phản hồi giả; <code>mockRejectedValue</code> cho nó thất bại. Hàm phụ <code>reply</code> chỉ dựng những phần của phản hồi mà code ta thật sự đọc.</p>'],
  [6, 'Three paths',
    '<p>The happy path returns 31 degrees, and the fake proves the city name was URL-encoded correctly. The server-error path checks our clear error message. The network-error path checks that a dropped connection surfaces as a TypeError, just like the real fetch.</p>',
    '<p>Đường vui trả 31 độ, và đồ giả chứng minh tên thành phố đã được mã hoá URL đúng. Đường máy chủ lỗi kiểm thông báo lỗi rõ ràng của ta. Đường mất mạng kiểm rằng kết nối rớt hiện ra thành TypeError, y như fetch thật.</p>'],
  [7, 'Fake timers',
    '<p>A debounced search waits 300 milliseconds after the last keystroke. With fake timers the test moves the clock forward by hand: at 299 nothing has happened, one more millisecond and exactly one search runs, for the last text. The same tool sets the date for the greeting test.</p>',
    '<p>Ô tìm kiếm có debounce chờ 300 mili giây sau phím cuối. Với đồng hồ giả, test tự đẩy thời gian đi: tới 299 chưa có gì, thêm một mili giây là đúng một lần tìm chạy, với chữ cuối cùng. Cùng công cụ đó đặt ngày giờ cho test lời chào.</p>'],
  [8, 'One command, one exit code',
    '<p>The whole suite — four files, twenty-two tests — ran in under a second and exited with code 0. When a test fails the same command exits with 1. That single number is all a CI system looks at.</p>',
    '<p>Cả bộ test — bốn file, hai mươi hai test — chạy chưa tới một giây và thoát với mã 0. Khi có test đỏ, cùng lệnh đó thoát với mã 1. Con số duy nhất ấy là tất cả những gì hệ thống CI nhìn vào.</p>'],
  [9, 'CI on every push',
    '<p>A GitHub Actions workflow: on every push and pull request, a fresh Linux machine checks out the code, installs Node 22, installs exact versions with <code>npm ci</code>, and runs the tests. If they fail, the pull request shows a red cross and can be blocked from merging.</p>',
    '<p>Một workflow GitHub Actions: ở mỗi lần push và pull request, một máy Linux mới tinh lấy code về, cài Node 22, cài đúng phiên bản bằng <code>npm ci</code>, và chạy test. Nếu đỏ, pull request hiện dấu X đỏ và có thể bị chặn không cho gộp.</p>'],
  [10, 'Check the workflow first',
    '<p><code>actionlint</code> checks workflow files on your machine. The correct file prints nothing and exits 0. A one-letter typo — <code>run-on</code> instead of <code>runs-on</code> — is caught with the exact line, before you waste a push finding out.</p>',
    '<p><code>actionlint</code> kiểm file workflow ngay trên máy bạn. File đúng không in gì và thoát 0. Một lỗi gõ một chữ — <code>run-on</code> thay vì <code>runs-on</code> — bị bắt kèm đúng dòng, trước khi bạn phí một lần push để phát hiện.</p>'],
  [11, 'Mocking traps',
    '<p>Mocks can make tests lie. Never mock the code you are testing, keep fakes faithful to the real responses, and always restore real timers and mocks after each test. Mock only at the boundary — the network and the clock.</p>',
    '<p>Mock có thể làm test nói dối. Đừng bao giờ mock chính code đang test, giữ đồ giả trung thành với phản hồi thật, và luôn trả lại đồng hồ thật và mock sau mỗi test. Chỉ mock ở đường biên — mạng và đồng hồ.</p>'],
  [12, 'Summary & practice',
    '<p>The practice repeats the whole lesson on a new function: inject fetch, cover success, not-found and server error, then add a workflow and lint it. When actionlint is silent and the tests pass without a network, you are ready for the Node.js course.</p>',
    '<p>Bài luyện lặp lại cả bài trên một hàm mới: tiêm fetch, phủ thành công, không tìm thấy và máy chủ lỗi, rồi thêm workflow và lint nó. Khi actionlint im lặng và test qua mà không cần mạng, bạn đã sẵn sàng cho khoá Node.js.</p>'],
]);

export default {
  title: '13.4 — Mocking and tests in CI|||13.4 — Giả lập và chạy test trong CI',
  slug: 'wf-13-4-mocking-ci',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Vì sao test không gọi API thật, tiêm phụ thuộc đơn giản (fetchFn = fetch), vi.fn + mockResolvedValue/mockRejectedValue, test nhánh lỗi 500 và mất mạng, đồng hồ giả cho debounce và ngày giờ, mã thoát, workflow GitHub Actions và kiểm bằng actionlint — chạy thật.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>A test must not depend on the internet — and must run without anyone remembering</h2>
<p class="lead">After this lesson you can test code that calls an API without touching the network, make the "server" fail on purpose to test your error handling, test code that waits (debounce, timeouts) without waiting, verify how a function was called, and set up GitHub Actions so the whole suite runs on every push and blocks broken code. Why it matters: most real bugs live in the unhappy paths — the 500 error, the dropped connection — and those are exactly the ones you can never reproduce by clicking. And a test suite that runs only when someone remembers will, sooner or later, not run on the day it matters.</p>

<h3>Step 1 — why not call the real API?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Slow</span><span class="v">Every test waits hundreds of milliseconds for the network.</span></div>
  <div class="kv"><span class="k">Flaky</span><span class="v">The Wi-Fi drops, the test is red, and the code is fine.</span></div>
  <div class="kv"><span class="k">Unrepeatable</span><span class="v">The real temperature changes every hour; the expected value cannot be written down.</span></div>
  <div class="kv"><span class="k">Sad paths untestable</span><span class="v">You cannot make the real server answer 500 when your test needs it.</span></div>
</div>
<p>The cure: make the outside world a <strong>parameter</strong> of your code, and in tests pass a <strong>fake</strong> (a "test double") that answers exactly what the test needs.</p>

<h3>Step 2 — write code that can be tested</h3>
${ma('javascript', CODE['_t13/src/weather.js'])}
<p><code>fetchFn = fetch</code> is <strong>dependency injection</strong> in its simplest form: real callers write <code>getTemperature('Huế')</code> and get the real <code>fetch</code>; a test writes <code>getTemperature('Huế', fakeFetch)</code>. No library, no global patching. The function also turns an HTTP error into a clear exception — <code>fetch</code> itself does <em>not</em> throw on 404 or 500 (Chapter 5).</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Production</span><span class="lz-t">getTemperature(city)</span><span class="lz-d">Default parameter ⇒ the real <code>fetch</code> ⇒ the real server.</span></div>
<div class="lz-step"><span class="lz-k">Test</span><span class="lz-t">getTemperature(city, fakeFetch)</span><span class="lz-d">A <code>vi.fn()</code> that resolves or rejects exactly as the test decides.</span></div>
<div class="lz-step"><span class="lz-k">Assert</span><span class="lz-t">result + calls</span><span class="lz-d">Check what came back AND how the fake was called (URL, count).</span></div>
</div>

<h3>Step 3 — a fake <code>fetch</code> with <code>vi.fn</code></h3>
${ma('javascript', CODE['_t13/test/weather.test.js'])}
<div class="kv-grid">
  <div class="kv"><span class="k">vi.fn()</span><span class="v">A function that records every call: arguments, count, results.</span></div>
  <div class="kv"><span class="k">.mockResolvedValue(x)</span><span class="v">Each call returns <code>Promise.resolve(x)</code> — a successful fetch.</span></div>
  <div class="kv"><span class="k">.mockRejectedValue(err)</span><span class="v">Each call returns a rejected promise — like a dropped connection.</span></div>
  <div class="kv"><span class="k">toHaveBeenCalledTimes / toHaveBeenCalledWith</span><span class="v">How many times, and with which arguments.</span></div>
  <div class="kv"><span class="k">await expect(p).resolves / .rejects</span><span class="v">Assertions on promises — note the <code>await</code>.</span></div>
</div>
${ra(OUT['_t13/out/mock-time'])}
<p>The first three lines are the weather tests: the happy path (and the proof that "Hà Nội" was encoded as <code>H%C3%A0%20N%E1%BB%99i</code>), a server 500 turned into a readable error, and a network failure that reaches the caller as a <code>TypeError</code>. All three run in milliseconds with no network at all.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a fake that the real API would never return.</strong> If your fake answers <code>{ temp: 31 }</code> but the real server sends <code>{ tempC: 31 }</code>, every test is green and production shows <code>undefined</code>. Copy fake responses from a real one (DevTools → Network → Response) and keep them next to the tests; when the API changes, update the fakes first and let the tests tell you what broke.</p></div>

<h3>Step 4 — controlling time with fake timers</h3>
${ma('javascript', CODE['_t13/src/search.js'])}
${ma('javascript', CODE['_t13/test/time.test.js'])}
<p>A <strong>debounced</strong> search waits until the user stops typing (300&nbsp;ms) and then searches once. Testing that with real time would mean sleeping in every test. <code>vi.useFakeTimers()</code> replaces <code>setTimeout</code> and the clock; <code>vi.advanceTimersByTime(299)</code> moves time forward instantly — nothing has fired yet; one more millisecond and exactly one search runs, with the last text "java". <code>vi.setSystemTime</code> sets "now" for code that reads the date, so the greeting test checks 08:00, 14:00 and 21:00 in a millisecond (last two lines of the output above).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — not restoring the real clock.</strong> Fake timers stay on until you turn them off. Forget <code>vi.useRealTimers()</code> (here in <code>afterEach</code>) and the next test that uses a real <code>setTimeout</code>, or a library that does, waits forever and times out — in a different file, which makes the cause very hard to find. Pair every "fake" with a "restore" in <code>afterEach</code>.</p></div>

<h3>Step 5 — one command, one exit code</h3>
${ra(OUT['_t13/out/all'])}
${ra(OUT['_t13/out/exit-red'])}
<p>Every program finishes with an <strong>exit code</strong>: 0 means success, anything else means failure. <code>npx vitest run</code> exits 0 when everything is green and 1 when any test fails (the second output runs the deliberately broken cart test from lesson 13.1). Continuous integration tools never read your test names — they look at this one number.</p>

<h3>Step 6 — continuous integration with GitHub Actions</h3>
${ma('yaml', CODE['_t13/.github/workflows/test.yml'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">on</span><span class="lz-t">push to main, every pull request</span><span class="lz-d">The events that start the workflow.</span></div>
<div class="lz-step"><span class="lz-k">runs-on</span><span class="lz-t">a fresh Ubuntu machine</span><span class="lz-d">Nothing from your laptop: if a test passes only because of a file you forgot to commit, CI fails.</span></div>
<div class="lz-step"><span class="lz-k">steps</span><span class="lz-t">checkout → Node 22 → npm ci → vitest run</span><span class="lz-d"><code>npm ci</code> installs exactly the versions in <code>package-lock.json</code>.</span></div>
<div class="lz-step"><span class="lz-k">result</span><span class="lz-t">✓ or ✗ on the commit and the PR</span><span class="lz-d">With branch protection, a red check blocks the merge button.</span></div>
</div>
<p>Before pushing, check the file locally with <strong>actionlint</strong>:</p>
${ra(OUT['_t13/out/actionlint-ok'])}
${ma('yaml', CODE['_t13/demo/wf/broken.yml'])}
${ra(OUT['_t13/out/actionlint-broken'])}
<p>The correct workflow prints nothing (silence is success) and exits 0. The broken one has a one-letter typo, <code>run-on</code>; actionlint reports both consequences — a missing <code>runs-on</code> and an unknown key — with the exact line and column, before you spend a push and five minutes waiting for GitHub to tell you the same.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — CI that is green because it ran nothing.</strong> A workflow that runs <code>npm test</code> (watch mode) hangs until it times out; one that runs a test command matching zero files exits 0 and shows a proud green tick. After setting up CI, break one test on purpose, push to a branch, and confirm the check turns red. A guard you have never seen fail is not yet a guard.</p></div>

<h3>Mocking: what to fake and what not</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fake</span><span class="v">The boundary with the outside world: network, clock, randomness, e-mail sending, payment providers.</span></div>
  <div class="kv"><span class="k">Do not fake</span><span class="v">The code under test, your own pure functions, simple data. If a test needs ten mocks, the code probably mixes too many jobs — split it.</span></div>
  <div class="kv"><span class="k">Always</span><span class="v">Restore mocks and timers after each test (<code>afterEach</code>, or <code>restoreMocks: true</code> in the config).</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes)</strong></p>
<p>Write <code>getUserName(id, fetchFn = fetch)</code>: it requests <code>/api/users/&lt;id&gt;</code>; on 200 it returns <code>data.name</code>; on 404 it returns <code>"Guest"</code>; on any other error status it throws <code>Error('users service failed: &lt;status&gt;')</code>. Write three tests with <code>vi.fn()</code>. Then add <code>.github/workflows/test.yml</code> (copy the one above) and run <code>actionlint</code> on it.</p>
<p><strong>Done when:</strong> <code>npx vitest run</code> passes with your Wi-Fi turned off; one test asserts <code>toHaveBeenCalledWith('/api/users/7')</code>; the 500 case uses <code>await expect(…).rejects.toThrow('users service failed: 500')</code>; and <code>actionlint</code> prints nothing. Bonus: push to a GitHub repository, break a test on a branch, and watch the pull request turn red. Code Lab module 13.4 grades the function and its fake-fetch tests.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test double / fake / mock</span><span class="v">đồ đóng thế / đồ giả / mock — thứ thay cho phụ thuộc thật khi test.</span></div>
  <div class="kv"><span class="k">dependency injection</span><span class="v">tiêm phụ thuộc — đưa phụ thuộc vào qua tham số thay vì gọi cứng bên trong.</span></div>
  <div class="kv"><span class="k">vi.fn()</span><span class="v">hàm giả của Vitest — ghi lại mọi lần gọi.</span></div>
  <div class="kv"><span class="k">happy path / sad path</span><span class="v">đường suôn sẻ / đường lỗi.</span></div>
  <div class="kv"><span class="k">fake timers</span><span class="v">đồng hồ giả — điều khiển setTimeout và ngày giờ trong test.</span></div>
  <div class="kv"><span class="k">debounce</span><span class="v">chờ ngừng gõ — chỉ chạy sau khi hết thay đổi một khoảng thời gian.</span></div>
  <div class="kv"><span class="k">exit code</span><span class="v">mã thoát — 0 thành công, khác 0 thất bại.</span></div>
  <div class="kv"><span class="k">CI (continuous integration)</span><span class="v">tích hợp liên tục — tự động chạy kiểm tra ở mỗi lần push.</span></div>
  <div class="kv"><span class="k">workflow / runner</span><span class="v">quy trình (file YAML) / máy chạy quy trình.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Tests must not call real networks: slow, flaky, unrepeatable, and the failures cannot be produced on demand.</li>
  <li>Inject dependencies (<code>fetchFn = fetch</code>) and pass <code>vi.fn()</code> fakes in tests.</li>
  <li><code>mockResolvedValue</code> / <code>mockRejectedValue</code> cover success, server errors and network errors; check calls with <code>toHaveBeenCalledWith</code>.</li>
  <li>Fake timers test waiting code instantly; always restore real timers.</li>
  <li>The suite's exit code (0/1) is what CI reads; GitHub Actions runs it on every push and pull request.</li>
  <li>Lint workflows with actionlint, and prove your CI can fail before trusting it.</li>
</ul>
${nguon('📗', 'Vitest — Mocking', 'vi.fn, vi.spyOn, vi.mock and fake timers, with examples', 'https://vitest.dev/guide/mocking.html')}
${nguon('📘', 'GitHub Docs — Building and testing Node.js', 'The official starter workflow and its options', 'https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs')}
${lienKet({ khoa: 'testing', bai: 'tst-3-1-phan-loai', title: 'Testing course 3.1 — stub, mock, spy, fake: what each one is', sub: 'The vocabulary of test doubles and when each one lies', cta: 'Open lesson' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-15-1-ci-cho-pr', title: 'GitHub Actions 15.1 — CI for pull requests', sub: 'Four jobs, a real Postgres and one required check — the grown-up version of this workflow', cta: 'Open lesson' })}
${lienKet({ khoa: 'git', bai: 'git-11-2-actions', title: 'Git & GitHub 11.2 — GitHub Actions: CI from zero', sub: 'Where workflows live in a repository and how checks block a merge', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Test không được phụ thuộc Internet — và phải tự chạy mà không cần ai nhớ</h2>
<p class="lead">Học xong bài này bạn test được code gọi API mà không chạm vào mạng, cố ý cho "máy chủ" hỏng để test phần xử lý lỗi, test code có chờ đợi (debounce, timeout) mà không phải chờ, kiểm một hàm đã được gọi ra sao, và cài GitHub Actions để cả bộ test chạy ở mỗi lần push và chặn code hỏng. Vì sao cần: phần lớn bug thật sống ở đường không suôn sẻ — lỗi 500, kết nối rớt — và đó chính là những thứ bạn không bao giờ tái hiện được bằng cách bấm. Còn một bộ test chỉ chạy khi có người nhớ thì sớm muộn sẽ không chạy vào đúng ngày quan trọng.</p>

<h3>Bước 1 — vì sao không gọi API thật?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chậm</span><span class="v">Mỗi test chờ mạng hàng trăm mili giây.</span></div>
  <div class="kv"><span class="k">Chập chờn</span><span class="v">Wi-Fi rớt, test đỏ, còn code thì không sao.</span></div>
  <div class="kv"><span class="k">Không lặp lại được</span><span class="v">Nhiệt độ thật đổi mỗi giờ; không viết được giá trị mong đợi.</span></div>
  <div class="kv"><span class="k">Không test được đường lỗi</span><span class="v">Bạn không bắt máy chủ thật trả 500 được đúng lúc test cần.</span></div>
</div>
<p>Cách chữa: biến thế giới bên ngoài thành một <strong>tham số</strong> của code, và trong test thì đưa vào một <strong>đồ giả</strong> ("test double") trả lời đúng điều test cần.</p>

<h3>Bước 2 — viết code test được</h3>
${ma('javascript', CODE['_t13/src/weather.js'])}
<p><code>fetchFn = fetch</code> là <strong>tiêm phụ thuộc (dependency injection)</strong> ở dạng đơn giản nhất: nơi gọi thật viết <code>getTemperature('Huế')</code> và nhận <code>fetch</code> thật; test viết <code>getTemperature('Huế', fakeFetch)</code>. Không thư viện, không vá biến toàn cục. Hàm còn biến lỗi HTTP thành một exception rõ ràng — chính <code>fetch</code> <em>không</em> ném lỗi với 404 hay 500 (Chương 5).</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">Chạy thật</span><span class="lz-t">getTemperature(city)</span><span class="lz-d">Tham số mặc định ⇒ <code>fetch</code> thật ⇒ máy chủ thật.</span></div>
<div class="lz-step"><span class="lz-k">Test</span><span class="lz-t">getTemperature(city, fakeFetch)</span><span class="lz-d">Một <code>vi.fn()</code> thành công hay thất bại đúng như test quyết định.</span></div>
<div class="lz-step"><span class="lz-k">Khẳng định</span><span class="lz-t">kết quả + lời gọi</span><span class="lz-d">Kiểm thứ trả về VÀ đồ giả đã được gọi thế nào (URL, số lần).</span></div>
</div>

<h3>Bước 3 — một <code>fetch</code> giả bằng <code>vi.fn</code></h3>
${ma('javascript', CODE['_t13/test/weather.test.js'])}
<div class="kv-grid">
  <div class="kv"><span class="k">vi.fn()</span><span class="v">Một hàm ghi lại mọi lần gọi: đối số, số lần, kết quả.</span></div>
  <div class="kv"><span class="k">.mockResolvedValue(x)</span><span class="v">Mỗi lần gọi trả <code>Promise.resolve(x)</code> — một lần fetch thành công.</span></div>
  <div class="kv"><span class="k">.mockRejectedValue(err)</span><span class="v">Mỗi lần gọi trả promise bị từ chối — như kết nối bị rớt.</span></div>
  <div class="kv"><span class="k">toHaveBeenCalledTimes / toHaveBeenCalledWith</span><span class="v">Bao nhiêu lần, với đối số nào.</span></div>
  <div class="kv"><span class="k">await expect(p).resolves / .rejects</span><span class="v">Khẳng định trên promise — để ý chữ <code>await</code>.</span></div>
</div>
${ra(OUT['_t13/out/mock-time'])}
<p>Ba dòng đầu là các test thời tiết: đường suôn sẻ (kèm bằng chứng "Hà Nội" được mã hoá thành <code>H%C3%A0%20N%E1%BB%99i</code>), lỗi máy chủ 500 được đổi thành thông báo dễ đọc, và lỗi mạng tới tay nơi gọi dưới dạng <code>TypeError</code>. Cả ba chạy trong vài mili giây mà không có mạng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đồ giả trả thứ API thật không bao giờ trả.</strong> Nếu đồ giả trả <code>{ temp: 31 }</code> mà máy chủ thật gửi <code>{ tempC: 31 }</code>, mọi test đều xanh còn production hiện <code>undefined</code>. Chép phản hồi giả từ một phản hồi thật (DevTools → Network → Response) và để cạnh test; khi API đổi, sửa đồ giả trước và để test cho bạn biết cái gì vỡ.</p></div>

<h3>Bước 4 — điều khiển thời gian bằng đồng hồ giả</h3>
${ma('javascript', CODE['_t13/src/search.js'])}
${ma('javascript', CODE['_t13/test/time.test.js'])}
<p>Ô tìm kiếm có <strong>debounce</strong> chờ người dùng ngừng gõ (300&nbsp;ms) rồi mới tìm một lần. Test việc đó bằng thời gian thật nghĩa là phải ngủ trong mọi test. <code>vi.useFakeTimers()</code> thay <code>setTimeout</code> và đồng hồ; <code>vi.advanceTimersByTime(299)</code> đẩy thời gian đi tức thì — chưa có gì bắn; thêm một mili giây là đúng một lần tìm chạy, với chữ cuối "java". <code>vi.setSystemTime</code> đặt "bây giờ" cho code đọc ngày giờ, nên test lời chào kiểm 08:00, 14:00 và 21:00 trong một mili giây (hai dòng cuối của output trên).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — không trả lại đồng hồ thật.</strong> Đồng hồ giả bật mãi tới khi bạn tắt. Quên <code>vi.useRealTimers()</code> (ở đây nằm trong <code>afterEach</code>) thì test tiếp theo dùng <code>setTimeout</code> thật, hay một thư viện có dùng, sẽ chờ mãi rồi hết giờ — ở một file khác, khiến nguyên nhân rất khó tìm. Mỗi lần "giả" phải đi đôi với một lần "trả lại" trong <code>afterEach</code>.</p></div>

<h3>Bước 5 — một lệnh, một mã thoát</h3>
${ra(OUT['_t13/out/all'])}
${ra(OUT['_t13/out/exit-red'])}
<p>Mọi chương trình kết thúc với một <strong>mã thoát (exit code)</strong>: 0 là thành công, khác 0 là thất bại. <code>npx vitest run</code> thoát 0 khi mọi thứ xanh và 1 khi có test đỏ (output thứ hai chạy test giỏ hàng cố ý hỏng ở bài 13.1). Công cụ tích hợp liên tục không bao giờ đọc tên test của bạn — chúng chỉ nhìn đúng con số này.</p>

<h3>Bước 6 — tích hợp liên tục với GitHub Actions</h3>
${ma('yaml', CODE['_t13/.github/workflows/test.yml'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">on</span><span class="lz-t">push lên main, mọi pull request</span><span class="lz-d">Các sự kiện khởi động workflow.</span></div>
<div class="lz-step"><span class="lz-k">runs-on</span><span class="lz-t">một máy Ubuntu mới tinh</span><span class="lz-d">Không có gì từ laptop của bạn: test chỉ qua nhờ một file bạn quên commit thì CI sẽ đỏ.</span></div>
<div class="lz-step"><span class="lz-k">steps</span><span class="lz-t">checkout → Node 22 → npm ci → vitest run</span><span class="lz-d"><code>npm ci</code> cài đúng các phiên bản trong <code>package-lock.json</code>.</span></div>
<div class="lz-step"><span class="lz-k">kết quả</span><span class="lz-t">✓ hoặc ✗ trên commit và PR</span><span class="lz-d">Có bảo vệ nhánh, dấu đỏ chặn luôn nút gộp.</span></div>
</div>
<p>Trước khi push, kiểm file ngay trên máy bằng <strong>actionlint</strong>:</p>
${ra(OUT['_t13/out/actionlint-ok'])}
${ma('yaml', CODE['_t13/demo/wf/broken.yml'])}
${ra(OUT['_t13/out/actionlint-broken'])}
<p>Workflow đúng không in gì (im lặng là thành công) và thoát 0. File hỏng có một lỗi gõ một chữ, <code>run-on</code>; actionlint báo cả hai hệ quả — thiếu <code>runs-on</code> và một khoá lạ — kèm đúng dòng và cột, trước khi bạn tốn một lần push và năm phút chờ GitHub báo điều y hệt.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — CI xanh vì chẳng chạy gì.</strong> Workflow chạy <code>npm test</code> (chế độ theo dõi) sẽ treo tới khi hết giờ; workflow chạy lệnh test khớp không file nào sẽ thoát 0 và khoe dấu tích xanh. Sau khi cài CI, hãy cố ý làm hỏng một test, push lên một nhánh, và xác nhận check chuyển đỏ. Người gác bạn chưa từng thấy nó báo động thì chưa phải người gác.</p></div>

<h3>Giả lập: giả cái gì và không giả cái gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nên giả</span><span class="v">Đường biên với thế giới bên ngoài: mạng, đồng hồ, số ngẫu nhiên, gửi e-mail, cổng thanh toán.</span></div>
  <div class="kv"><span class="k">Đừng giả</span><span class="v">Chính code đang test, các hàm thuần của bạn, dữ liệu đơn giản. Nếu một test cần mười mock, code có lẽ đang ôm quá nhiều việc — hãy tách ra.</span></div>
  <div class="kv"><span class="k">Luôn luôn</span><span class="v">Trả lại mock và đồng hồ sau mỗi test (<code>afterEach</code>, hoặc <code>restoreMocks: true</code> trong cấu hình).</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút)</strong></p>
<p>Viết <code>getUserName(id, fetchFn = fetch)</code>: gọi <code>/api/users/&lt;id&gt;</code>; 200 thì trả <code>data.name</code>; 404 thì trả <code>"Guest"</code>; mọi mã lỗi khác thì ném <code>Error('users service failed: &lt;status&gt;')</code>. Viết ba test bằng <code>vi.fn()</code>. Rồi thêm <code>.github/workflows/test.yml</code> (chép file ở trên) và chạy <code>actionlint</code> lên nó.</p>
<p><strong>Xong khi:</strong> <code>npx vitest run</code> qua khi đã tắt Wi-Fi; một test khẳng định <code>toHaveBeenCalledWith('/api/users/7')</code>; trường hợp 500 dùng <code>await expect(…).rejects.toThrow('users service failed: 500')</code>; và <code>actionlint</code> không in gì. Thêm điểm: push lên một kho GitHub, làm hỏng một test trên một nhánh, và xem pull request chuyển đỏ. Code Lab module 13.4 chấm hàm này và các test fetch giả của nó.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test double / fake / mock</span><span class="v">đồ đóng thế / đồ giả / mock — thứ thay cho phụ thuộc thật khi test.</span></div>
  <div class="kv"><span class="k">dependency injection</span><span class="v">tiêm phụ thuộc — đưa phụ thuộc vào qua tham số thay vì gọi cứng bên trong.</span></div>
  <div class="kv"><span class="k">vi.fn()</span><span class="v">hàm giả của Vitest — ghi lại mọi lần gọi.</span></div>
  <div class="kv"><span class="k">happy path / sad path</span><span class="v">đường suôn sẻ / đường lỗi.</span></div>
  <div class="kv"><span class="k">fake timers</span><span class="v">đồng hồ giả — điều khiển setTimeout và ngày giờ trong test.</span></div>
  <div class="kv"><span class="k">debounce</span><span class="v">chờ ngừng gõ — chỉ chạy sau khi hết thay đổi một khoảng thời gian.</span></div>
  <div class="kv"><span class="k">exit code</span><span class="v">mã thoát — 0 thành công, khác 0 thất bại.</span></div>
  <div class="kv"><span class="k">CI (continuous integration)</span><span class="v">tích hợp liên tục — tự động chạy kiểm tra ở mỗi lần push.</span></div>
  <div class="kv"><span class="k">workflow / runner</span><span class="v">quy trình (file YAML) / máy chạy quy trình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Test không được gọi mạng thật: chậm, chập chờn, không lặp lại được, và không tạo được lỗi theo ý.</li>
  <li>Tiêm phụ thuộc (<code>fetchFn = fetch</code>) và đưa đồ giả <code>vi.fn()</code> vào khi test.</li>
  <li><code>mockResolvedValue</code> / <code>mockRejectedValue</code> phủ thành công, lỗi máy chủ và lỗi mạng; kiểm lời gọi bằng <code>toHaveBeenCalledWith</code>.</li>
  <li>Đồng hồ giả test code có chờ đợi tức thì; luôn trả lại đồng hồ thật.</li>
  <li>Mã thoát (0/1) của bộ test là thứ CI đọc; GitHub Actions chạy nó ở mỗi lần push và pull request.</li>
  <li>Lint workflow bằng actionlint, và chứng minh CI biết đỏ trước khi tin nó.</li>
</ul>
${nguon('📗', 'Vitest — Mocking', 'vi.fn, vi.spyOn, vi.mock và đồng hồ giả, kèm ví dụ', 'https://vitest.dev/guide/mocking.html')}
${nguon('📘', 'GitHub Docs — Building and testing Node.js', 'Workflow khởi đầu chính thức và các tuỳ chọn', 'https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs')}
${lienKet({ khoa: 'testing', bai: 'tst-3-1-phan-loai', title: 'Khoá Testing 3.1 — stub, mock, spy, fake: mỗi loại là gì', sub: 'Bộ từ vựng của đồ đóng thế và lúc nào mỗi loại nói dối', cta: 'Mở bài' })}
${lienKet({ khoa: 'github-actions', bai: 'ga-15-1-ci-cho-pr', title: 'GitHub Actions 15.1 — CI cho pull request', sub: 'Bốn job, một Postgres thật và một check bắt buộc — phiên bản trưởng thành của workflow này', cta: 'Mở bài' })}
${lienKet({ khoa: 'git', bai: 'git-11-2-actions', title: 'Git & GitHub 11.2 — GitHub Actions: CI từ số 0', sub: 'Workflow nằm ở đâu trong kho và check chặn việc gộp thế nào', cta: 'Mở bài' })}
</div>
`,
};
