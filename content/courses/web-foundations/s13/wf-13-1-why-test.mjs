/**
 * Bài 13.1 — Kiểm thử để làm gì (nâng cấp 01/11/2026). Output: Vitest 5.0.5 trên Node 22.23.3 + Playwright Chromium, chạy thật
 * trong dự án _demo/_t13 (xem _HOP-DONG.md). Deck: scripts/slides-src/wf-13-1.mjs (11 slide).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const RED = OUT['_t13/out/cart-buggy'];

const G = walkWf('wf-13-1', 'Why tests exist', 'Kiểm thử để làm gì', [
  [1, 'Why tests exist',
    '<p>Up to now you checked your code by running it and looking. This chapter teaches a habit every professional team has: writing small programs that check your program — automatically, every time anything changes.</p>',
    '<p>Tới giờ bạn kiểm code bằng cách chạy rồi nhìn. Chương này dạy một thói quen mọi nhóm chuyên nghiệp đều có: viết những chương trình nhỏ để kiểm chương trình của bạn — tự động, mỗi khi có bất cứ thay đổi nào.</p>'],
  [2, 'After this lesson you can…',
    '<p>This first lesson is about the "why" and the "what". You will see a real regression being caught, real timings for the three kinds of tests, and a short rule for deciding what deserves a test. The next three lessons are the "how".</p>',
    '<p>Bài đầu tiên nói về "vì sao" và "kiểm cái gì". Bạn sẽ thấy một lỗi hồi quy thật bị bắt, thời gian đo thật của ba loại test, và một luật ngắn để quyết định cái gì đáng có test. Ba bài sau là phần "làm thế nào".</p>'],
  [3, 'Testing by hand does not scale',
    '<p>After a change you click through the pages you remember. The bug hides in the page you did not click. The problem is not laziness: no person can re-check hundreds of rules after every edit. A computer can, in milliseconds.</p>',
    '<p>Sau một thay đổi bạn bấm qua những trang mình nhớ. Bug trốn ở trang bạn không bấm. Vấn đề không phải lười: không ai kiểm lại nổi hàng trăm luật sau mỗi lần sửa. Máy tính thì làm được, trong vài mili giây.</p>'],
  [4, 'A shopping cart with rules',
    '<p>Our example is a small cart with four business rules: price times quantity, a shipping fee with a free-shipping threshold, a coupon between one and fifty percent, and a subtle one — free shipping is decided after the coupon. Rules like these are exactly what tests protect.</p>',
    '<p>Ví dụ của ta là một giỏ hàng nhỏ có bốn luật nghiệp vụ: giá nhân số lượng, phí ship có ngưỡng miễn phí, mã giảm giá từ một tới năm mươi phần trăm, và một luật tinh tế — miễn phí ship được xét SAU khi trừ mã. Những luật như vậy chính là thứ test bảo vệ.</p>'],
  [5, 'Thirteen tests in 88 ms',
    '<p>Vitest ran thirteen checks of those rules in under a tenth of a second. Each line is one sentence about the cart, written once. From now on, every change can be checked against all of them for free.</p>',
    '<p>Vitest chạy mười ba phép kiểm các luật đó trong chưa tới một phần mười giây. Mỗi dòng là một câu về giỏ hàng, viết một lần. Từ nay, mọi thay đổi đều được đối chiếu với tất cả chúng, miễn phí.</p>'],
  [6, 'A regression caught',
    '<p>A teammate tidies the shipping function and types greater-than instead of greater-or-equal. Nothing looks wrong. The boundary test fails: an order of exactly 500,000 would now pay 30,000 shipping. That is a regression — old behaviour broken by new code.</p>',
    '<p>Một đồng đội dọn dẹp hàm tính ship và gõ dấu lớn hơn thay vì lớn hơn hoặc bằng. Nhìn chẳng thấy gì sai. Test biên đỏ: đơn đúng 500.000 giờ phải trả 30.000 tiền ship. Đó là hồi quy — hành vi cũ bị code mới làm hỏng.</p>'],
  [7, 'The test pyramid',
    '<p>Three kinds of tests, with speeds measured in this chapter. Unit tests take about a millisecond. A component test in a fake browser takes tens to a hundred milliseconds. One tiny end-to-end check in a real browser took a quarter of a second. Hence the shape: many fast tests, few slow ones.</p>',
    '<p>Ba loại test, với tốc độ đo trong chương này. Unit test mất khoảng một mili giây. Test component trong trình duyệt giả mất vài chục tới một trăm mili giây. Một phép kiểm end-to-end nhỏ trong trình duyệt thật mất một phần tư giây. Vì vậy có hình dạng: nhiều test nhanh, ít test chậm.</p>'],
  [8, 'What a good test gives you',
    '<p>A safety net against regressions, the courage to restructure code, documentation that cannot go out of date, and faster debugging. What tests do not give you is proof that bugs do not exist — they check only the cases someone thought of.</p>',
    '<p>Một lưới an toàn chống hồi quy, can đảm để cấu trúc lại code, tài liệu không bao giờ lỗi thời, và gỡ lỗi nhanh hơn. Thứ test không cho bạn là bằng chứng không có bug — chúng chỉ kiểm những trường hợp ai đó đã nghĩ tới.</p>'],
  [9, 'What to test',
    '<p>Spend tests on business rules, boundaries, error paths and bugs you have fixed. Skip testing the framework itself, private helpers one by one, exact pixels and trivial code. The goal is confidence per minute of effort, not a number.</p>',
    '<p>Dành test cho luật nghiệp vụ, giá trị biên, nhánh lỗi và các bug đã sửa. Bỏ qua việc kiểm chính framework, từng hàm phụ riêng lẻ, điểm ảnh chính xác và code tầm thường. Mục tiêu là độ tin cậy trên mỗi phút công sức, không phải một con số.</p>'],
  [10, 'Reading a red report',
    '<p>Three places to read, in order: the FAIL line tells you which rule broke; Expected and Received show what the test wanted and what the code returned; the arrow with a file and line number points at the exact assertion. Read those before touching any code.</p>',
    '<p>Ba chỗ cần đọc, theo thứ tự: dòng FAIL cho biết luật nào vỡ; Expected và Received cho thấy test muốn gì và code trả gì; mũi tên kèm tên file và số dòng chỉ đúng phép khẳng định. Đọc xong ba chỗ đó rồi mới đụng vào code.</p>'],
  [11, 'Summary & practice',
    '<p>The practice is done on paper on purpose: deciding which cases matter is the real skill, and it comes before any syntax. In the next lesson you turn those cases into Vitest code.</p>',
    '<p>Bài luyện làm trên giấy là có chủ đích: quyết định trường hợp nào quan trọng mới là kỹ năng thật, và nó có trước mọi cú pháp. Ở bài sau bạn sẽ biến những trường hợp đó thành code Vitest.</p>'],
]);

export default {
  title: '13.1 — Why tests exist|||13.1 — Kiểm thử để làm gì',
  slug: 'wf-13-1-why-test',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Test tự động là gì, vì sao kiểm bằng tay không đủ, một lỗi hồi quy thật bị bắt (Vitest 5 chạy thật), kim tự tháp test với thời gian đo thật (unit, component, end-to-end), test cho bạn gì và không cho gì, nên kiểm cái gì, đọc báo cáo đỏ.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>A test is a sentence you write once and the computer checks forever</h2>
<p class="lead">After this lesson you can explain what an automated test is, why teams refuse to work without them, what the unit / integration / end-to-end "pyramid" means — with real timings — and how to decide which behaviour deserves a test. You will also read your first red test report. Why it matters: every course after this one (Node.js, React, Next.js) runs tests, every job interview asks about them, and the bug that reaches your users is almost always one that nobody re-checked after a "small" change.</p>

<h3>The problem: you can only re-check what you remember</h3>
<p>Until now you tested by running the page and clicking around. That works for one feature on day one. On day ninety the project has two hundred rules — prices, discounts, permissions, form checks — and after every edit you re-check the three you remember. The bug lands in the fourth.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Change some code</span><span class="lz-d">A "small" refactor of one function.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Click around</span><span class="lz-d">The pages you remember. They look fine.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ship</span><span class="lz-d">Deploy on Friday afternoon.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">A customer finds the bug</span><span class="lz-d">In a case you did not click. Now it costs money, trust and a weekend.</span></div>
</div>
<p>An <strong>automated test</strong> is a small piece of code that runs your code with a known input and checks that the output is what you expect. You write it once; a test runner re-runs every test you have ever written, in milliseconds, whenever you ask — or automatically on every push (lesson 13.4).</p>

<h3>Our example: a cart with four rules</h3>
${ma('javascript', CODE['_t13/src/cart.js'])}
<p>Four business rules hide in twenty lines: price × quantity summed; shipping 30,000đ but free from 500,000đ inclusive; a coupon must be a whole percentage from 1 to 50; and the subtle one — free shipping is decided <em>after</em> the coupon, so a 520,000đ order with 10% off (468,000đ) pays shipping again. Money is stored as whole đồng (integers) to avoid the floating-point surprises you will see in lesson 13.2.</p>
<p>Here are thirteen tests of those rules running in <strong>Vitest</strong>, the test runner used by Vite, React and Next.js projects (the test code itself is the topic of lesson 13.2):</p>
${ra(OUT['_t13/out/cart'])}
<p>Thirteen sentences about the cart, checked in 88 milliseconds. Each one is now a permanent guard: if any future change breaks one of these rules, you will know before your users do.</p>

<h3>A regression, caught</h3>
<p>A teammate "tidies up" the shipping function and types <code>&gt;</code> instead of <code>&gt;=</code>:</p>
${ma('javascript', CODE['_t13/src/cart-buggy.js'], [5, 7])}
<p>It still looks correct; reviewers rarely notice one character. The boundary test runs against the new code:</p>
${ra(RED)}
<p>This is a <strong>regression</strong>: behaviour that used to work, broken by new code. Customers ordering exactly 500,000đ would suddenly pay 30,000đ shipping. The test failed with exit code 1 — in a team setup (lesson 13.4) that blocks the merge, and the bug never reaches production.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — testing only the "normal" value.</strong> A test with an order of 800,000đ would have stayed green: both <code>&gt;</code> and <code>&gt;=</code> agree there. Bugs live at <strong>boundaries</strong> — exactly the limit, one below it, zero, empty, the maximum. That is why the test file checks 499,999 and 500,000 side by side.</p></div>

<h3>Reading a red report</h3>
<p>Read three places, in this order, before you touch any code:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">FAIL line</span><span class="v"><code>demo/cart-buggy.test.js &gt; an order of exactly 500 000đ ships free</code> — the file and the <em>name</em> of the rule that broke. Good test names read like requirements.</span></div>
  <div class="kv"><span class="k">Expected / Received</span><span class="v">What the test wanted (<code>0</code>) and what the code returned (<code>30000</code>). The difference usually tells you the bug.</span></div>
  <div class="kv"><span class="k">❯ file:line</span><span class="v">The exact assertion, with the source lines around it.</span></div>
</div>

<h3>The test pyramid — with real timings</h3>
<p>Tests come in three sizes. The numbers below were measured in this chapter's project on the same laptop.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">End-to-end (few)</span><span class="lz-t">a real browser, real clicks</span><span class="lz-d">One tiny sign-up check took 250–440&nbsp;ms (output below), and real apps with a server and a database take seconds per test. Most realistic, slowest, most fragile.</span></div>
<div class="lz-layer"><span class="lz-k">Integration / component (some)</span><span class="lz-t">a piece of UI in a fake DOM</span><span class="lz-d">The four sign-up form tests of lesson 13.3 took 10–148&nbsp;ms each in jsdom.</span></div>
<div class="lz-layer"><span class="lz-k">Unit (many)</span><span class="lz-t">one function, no browser, no network</span><span class="lz-d">The thirteen cart tests took 0–1&nbsp;ms each, 88&nbsp;ms in total.</span></div>
</div>
${ma('javascript', CODE['_t13/demo/e2e-timing.mjs'])}
${ra(OUT['_t13/out/e2e-timing'])}
<p>The end-to-end check above does exactly what a user does — real Chromium, type, click, wait for the welcome text. It is the most convincing kind of test and also hundreds of times slower than a unit test (the first run includes starting the browser). Hence the shape of the pyramid: a broad base of fast unit tests, a middle layer of component tests, and a few end-to-end tests for the journeys that must never break (sign-up, checkout, payment).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — the "ice-cream cone".</strong> Teams that only write end-to-end tests end up with a suite that takes forty minutes, fails randomly when the network is slow, and tells you <em>that</em> something broke but not <em>where</em>. When a unit test can check a rule, let it; keep the browser for whole journeys.</p></div>

<h3>What a good test gives you — and what it does not</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A regression net</span><span class="v">Old behaviour cannot break silently, as you just saw.</span></div>
  <div class="kv"><span class="k">Courage to refactor</span><span class="v">Rewrite the inside of <code>total</code>; if the tests stay green, the outside still behaves the same.</span></div>
  <div class="kv"><span class="k">Living documentation</span><span class="v">"free shipping applies AFTER the coupon" is written as a test that fails if it stops being true — unlike a comment.</span></div>
  <div class="kv"><span class="k">Faster debugging</span><span class="v">A red test names the rule and the line.</span></div>
  <div class="kv"><span class="k">Not: proof of no bugs</span><span class="v">Tests check the cases someone thought of. That is why boundaries, error paths and past bugs get priority.</span></div>
</div>

<h3>What to test, and what to skip</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Test</span><span class="v">Business rules (prices, permissions, validation) · boundaries (0, empty, exactly the limit) · error paths (bad input, server 500, network down) · every bug you fix, so it can never return.</span></div>
  <div class="kv"><span class="k">Usually skip</span><span class="v">The framework itself (React renders) · private helpers one by one (test them through the public function) · exact CSS pixels · trivial getters.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — chasing 100% coverage.</strong> Coverage tools tell you which lines ran during the tests, not whether anything was <em>checked</em>. A test that calls <code>total()</code> and asserts nothing gives full coverage and zero safety. Use coverage to find untested areas, then write tests that assert real rules. (The Testing course goes deeper with mutation testing, which checks the tests themselves.)</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (15 minutes, on paper)</strong></p>
<p>Write eight test cases for <code>total(items, couponPercent)</code> as a table "input ⇒ expected". Include at least three boundaries (around 500,000đ before and after a coupon, an empty cart) and two error cases (coupon 0 and coupon 51). Then compare your table with the thirteen tests listed in the output above.</p>
<p><strong>Done when:</strong> every one of the four rules has at least one case in your table; you have computed every expected value by hand (no guessing); and you can name one situation that the existing thirteen tests do <em>not</em> cover (hint: what happens to a coupon when the cart is empty?). Code Lab module 13.1 asks you to turn such a table into running checks.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">automated test</span><span class="v">kiểm thử tự động — code chạy code của bạn và kiểm kết quả.</span></div>
  <div class="kv"><span class="k">test runner</span><span class="v">trình chạy test — công cụ tìm và chạy các test (Vitest, Jest).</span></div>
  <div class="kv"><span class="k">assertion</span><span class="v">phép khẳng định — dòng nói "kết quả phải là…".</span></div>
  <div class="kv"><span class="k">regression</span><span class="v">hồi quy — hành vi cũ bị code mới làm hỏng.</span></div>
  <div class="kv"><span class="k">boundary / edge case</span><span class="v">giá trị biên — ngay tại, ngay dưới, ngay trên giới hạn.</span></div>
  <div class="kv"><span class="k">unit / integration / end-to-end</span><span class="v">đơn vị / tích hợp / đầu-cuối — ba cỡ test của kim tự tháp.</span></div>
  <div class="kv"><span class="k">refactor</span><span class="v">tái cấu trúc — đổi bên trong mà giữ nguyên hành vi bên ngoài.</span></div>
  <div class="kv"><span class="k">coverage</span><span class="v">độ phủ — tỉ lệ dòng code đã chạy khi test (không phải đã được kiểm).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A test runs your code with a known input and checks the output — written once, re-run forever.</li>
  <li>Testing by hand only re-checks what you remember; tests re-check everything in milliseconds.</li>
  <li>The boundary test caught a one-character regression (<code>&gt;</code> vs <code>&gt;=</code>) before it shipped.</li>
  <li>Pyramid: many unit tests (~1&nbsp;ms), some component tests (~10–150&nbsp;ms), few end-to-end tests (hundreds of ms and up).</li>
  <li>Test rules, boundaries, errors and fixed bugs; skip frameworks, pixels and trivia; coverage is not safety.</li>
  <li>Read a red report: FAIL line → Expected/Received → file:line.</li>
</ul>
${nguon('📗', 'Vitest — Getting Started', 'The official guide of the runner used in this chapter', 'https://vitest.dev/guide/')}
${nguon('📘', 'Martin Fowler — The Practical Test Pyramid', 'The classic long-form explanation of the pyramid and its trade-offs', 'https://martinfowler.com/articles/practical-test-pyramid.html')}
${lienKet({ khoa: 'testing', bai: 'tst-0-1-kim-tu-thap', title: 'Testing course 0.2 — the test pyramid, measured on LabFlow Lite', sub: 'The same pyramid on a bigger project, plus the "trophy" alternative', cta: 'Open lesson' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-1-vi-sao-test', title: 'Node.js 14.1 — what a test costs and what it buys', sub: 'The same question for server code', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Một test là một câu bạn viết một lần và máy kiểm mãi mãi</h2>
<p class="lead">Học xong bài này bạn giải thích được test tự động là gì, vì sao các nhóm không chịu làm việc thiếu nó, "kim tự tháp" unit / tích hợp / end-to-end nghĩa là gì — kèm thời gian đo thật — và cách quyết định hành vi nào đáng có test. Bạn cũng sẽ đọc báo cáo test đỏ đầu tiên. Vì sao cần: mọi khoá sau khoá này (Node.js, React, Next.js) đều chạy test, mọi buổi phỏng vấn đều hỏi về nó, và con bug tới được tay người dùng gần như luôn là cái không ai kiểm lại sau một thay đổi "nhỏ".</p>

<h3>Vấn đề: bạn chỉ kiểm lại được những gì mình nhớ</h3>
<p>Tới giờ bạn kiểm bằng cách chạy trang rồi bấm loanh quanh. Cách đó ổn cho một tính năng ở ngày đầu. Tới ngày thứ chín mươi dự án có hai trăm luật — giá, giảm giá, phân quyền, kiểm tra form — và sau mỗi lần sửa bạn kiểm lại ba cái mình nhớ. Bug rơi vào cái thứ tư.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sửa một ít code</span><span class="lz-d">Một lần refactor "nhỏ" một hàm.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bấm loanh quanh</span><span class="lz-d">Những trang bạn nhớ. Trông vẫn ổn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đưa lên</span><span class="lz-d">Deploy chiều thứ Sáu.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Khách hàng tìm ra bug</span><span class="lz-d">Ở trường hợp bạn không bấm. Giờ nó tốn tiền, niềm tin và một ngày cuối tuần.</span></div>
</div>
<p><strong>Test tự động (automated test)</strong> là một đoạn code nhỏ chạy code của bạn với đầu vào biết trước và kiểm đầu ra có đúng như mong đợi. Bạn viết nó một lần; trình chạy test chạy lại mọi test bạn từng viết, trong vài mili giây, mỗi khi bạn muốn — hoặc tự động ở mỗi lần push (bài 13.4).</p>

<h3>Ví dụ của ta: giỏ hàng có bốn luật</h3>
${ma('javascript', CODE['_t13/src/cart.js'])}
<p>Bốn luật nghiệp vụ nằm trong hai mươi dòng: giá × số lượng cộng lại; ship 30.000đ nhưng miễn phí từ 500.000đ (tính cả mốc); mã giảm giá phải là số nguyên phần trăm từ 1 tới 50; và luật tinh tế — miễn phí ship được xét <em>sau</em> khi trừ mã, nên đơn 520.000đ giảm 10% (468.000đ) lại phải trả ship. Tiền được lưu bằng số nguyên đồng để tránh những bất ngờ của số thực mà bạn sẽ thấy ở bài 13.2.</p>
<p>Đây là mười ba test của các luật đó chạy trong <strong>Vitest</strong>, trình chạy test dùng trong dự án Vite, React và Next.js (code của chính các test là chủ đề bài 13.2):</p>
${ra(OUT['_t13/out/cart'])}
<p>Mười ba câu về giỏ hàng, được kiểm trong 88 mili giây. Mỗi câu giờ là một người gác vĩnh viễn: nếu thay đổi nào sau này làm vỡ một trong các luật, bạn sẽ biết trước người dùng.</p>

<h3>Một lỗi hồi quy, bị bắt</h3>
<p>Một đồng đội "dọn dẹp" hàm tính ship và gõ <code>&gt;</code> thay vì <code>&gt;=</code>:</p>
${ma('javascript', CODE['_t13/src/cart-buggy.js'], [5, 7])}
<p>Trông vẫn đúng; người review hiếm khi để ý một ký tự. Test biên chạy trên code mới:</p>
${ra(RED)}
<p>Đây là <strong>hồi quy (regression)</strong>: hành vi từng chạy đúng bị code mới làm hỏng. Khách đặt đúng 500.000đ bỗng phải trả 30.000đ tiền ship. Test thất bại với mã thoát 1 — trong quy trình nhóm (bài 13.4) điều đó chặn việc gộp code, và bug không bao giờ tới production.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ kiểm giá trị "bình thường".</strong> Một test với đơn 800.000đ vẫn xanh: cả <code>&gt;</code> lẫn <code>&gt;=</code> đều đồng ý ở đó. Bug sống ở <strong>giá trị biên</strong> — đúng mốc, ngay dưới mốc, số không, rỗng, giá trị lớn nhất. Vì vậy file test kiểm 499.999 và 500.000 cạnh nhau.</p></div>

<h3>Đọc một báo cáo đỏ</h3>
<p>Đọc ba chỗ, theo thứ tự này, trước khi đụng vào code:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Dòng FAIL</span><span class="v"><code>demo/cart-buggy.test.js &gt; an order of exactly 500 000đ ships free</code> — file và <em>tên</em> luật bị vỡ. Tên test tốt đọc như yêu cầu.</span></div>
  <div class="kv"><span class="k">Expected / Received</span><span class="v">Test muốn gì (<code>0</code>) và code trả gì (<code>30000</code>). Khoảng cách giữa hai cái thường đã nói lên bug.</span></div>
  <div class="kv"><span class="k">❯ file:dòng</span><span class="v">Đúng phép khẳng định, kèm các dòng code xung quanh.</span></div>
</div>

<h3>Kim tự tháp test — với thời gian đo thật</h3>
<p>Test có ba cỡ. Các con số dưới đây đo trong dự án của chương này trên cùng một máy.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">End-to-end (ít)</span><span class="lz-t">trình duyệt thật, cú bấm thật</span><span class="lz-d">Một phép kiểm đăng ký nhỏ mất 250–440&nbsp;ms (output bên dưới), còn app thật có máy chủ và cơ sở dữ liệu mất vài giây mỗi test. Giống thật nhất, chậm nhất, dễ vỡ nhất.</span></div>
<div class="lz-layer"><span class="lz-k">Tích hợp / component (vừa)</span><span class="lz-t">một mảnh giao diện trong DOM giả</span><span class="lz-d">Bốn test form đăng ký ở bài 13.3 mất 10–148&nbsp;ms mỗi cái trong jsdom.</span></div>
<div class="lz-layer"><span class="lz-k">Unit (nhiều)</span><span class="lz-t">một hàm, không trình duyệt, không mạng</span><span class="lz-d">Mười ba test giỏ hàng mất 0–1&nbsp;ms mỗi cái, tổng 88&nbsp;ms.</span></div>
</div>
${ma('javascript', CODE['_t13/demo/e2e-timing.mjs'])}
${ra(OUT['_t13/out/e2e-timing'])}
<p>Phép kiểm end-to-end trên làm đúng việc người dùng làm — Chromium thật, gõ, bấm, chờ dòng chào. Đó là loại test thuyết phục nhất và cũng chậm hơn unit test hàng trăm lần (lần chạy đầu gồm cả khởi động trình duyệt). Vì thế kim tự tháp có hình dạng của nó: một đáy rộng các unit test nhanh, một tầng giữa các test component, và vài test end-to-end cho những hành trình không bao giờ được vỡ (đăng ký, thanh toán).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "cây kem ốc quế".</strong> Nhóm chỉ viết test end-to-end sẽ có bộ test chạy bốn mươi phút, đỏ ngẫu nhiên khi mạng chậm, và chỉ cho biết <em>có</em> gì đó vỡ chứ không cho biết <em>ở đâu</em>. Luật nào unit test kiểm được thì để unit test kiểm; giữ trình duyệt cho cả hành trình.</p></div>

<h3>Test tốt cho bạn gì — và không cho gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lưới chống hồi quy</span><span class="v">Hành vi cũ không thể vỡ trong im lặng, như bạn vừa thấy.</span></div>
  <div class="kv"><span class="k">Can đảm refactor</span><span class="v">Viết lại ruột của <code>total</code>; test vẫn xanh nghĩa là bên ngoài vẫn cư xử như cũ.</span></div>
  <div class="kv"><span class="k">Tài liệu sống</span><span class="v">"miễn phí ship xét SAU mã giảm" được viết thành một test sẽ đỏ nếu nó thôi đúng — khác một dòng chú thích.</span></div>
  <div class="kv"><span class="k">Gỡ lỗi nhanh hơn</span><span class="v">Test đỏ gọi tên luật và dòng code.</span></div>
  <div class="kv"><span class="k">Không phải: bằng chứng hết bug</span><span class="v">Test kiểm những trường hợp ai đó đã nghĩ tới. Vì vậy giá trị biên, nhánh lỗi và bug cũ được ưu tiên.</span></div>
</div>

<h3>Nên kiểm gì, và bỏ qua gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nên kiểm</span><span class="v">Luật nghiệp vụ (giá, phân quyền, kiểm tra dữ liệu) · giá trị biên (0, rỗng, đúng mốc) · nhánh lỗi (đầu vào sai, máy chủ 500, mất mạng) · mọi bug bạn đã sửa, để nó không bao giờ quay lại.</span></div>
  <div class="kv"><span class="k">Thường bỏ qua</span><span class="v">Chính framework (React có render) · từng hàm phụ riêng lẻ (kiểm chúng qua hàm công khai) · điểm ảnh CSS chính xác · getter tầm thường.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chạy theo độ phủ 100%.</strong> Công cụ đo độ phủ cho biết dòng nào đã chạy trong lúc test, không cho biết có gì đã được <em>kiểm</em>. Một test gọi <code>total()</code> mà không khẳng định gì cho độ phủ đầy đủ và độ an toàn bằng không. Dùng độ phủ để tìm vùng chưa test, rồi viết test khẳng định luật thật. (Khoá Testing đi sâu hơn với mutation testing — kiểm tra chính các test.)</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (15 phút, làm trên giấy)</strong></p>
<p>Viết tám trường hợp test cho <code>total(items, couponPercent)</code> thành bảng "đầu vào ⇒ mong đợi". Có ít nhất ba giá trị biên (quanh 500.000đ trước và sau khi giảm giá, giỏ rỗng) và hai trường hợp lỗi (mã 0 và mã 51). Rồi so bảng của bạn với mười ba test liệt kê trong output ở trên.</p>
<p><strong>Xong khi:</strong> mỗi luật trong bốn luật có ít nhất một dòng trong bảng; bạn tự tính tay mọi giá trị mong đợi (không đoán); và bạn gọi tên được một tình huống mà mười ba test hiện có <em>không</em> phủ (gợi ý: mã giảm giá áp lên giỏ rỗng thì sao?). Code Lab module 13.1 yêu cầu bạn biến một bảng như vậy thành các phép kiểm chạy được.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">automated test</span><span class="v">kiểm thử tự động — code chạy code của bạn và kiểm kết quả.</span></div>
  <div class="kv"><span class="k">test runner</span><span class="v">trình chạy test — công cụ tìm và chạy các test (Vitest, Jest).</span></div>
  <div class="kv"><span class="k">assertion</span><span class="v">phép khẳng định — dòng nói "kết quả phải là…".</span></div>
  <div class="kv"><span class="k">regression</span><span class="v">hồi quy — hành vi cũ bị code mới làm hỏng.</span></div>
  <div class="kv"><span class="k">boundary / edge case</span><span class="v">giá trị biên — ngay tại, ngay dưới, ngay trên giới hạn.</span></div>
  <div class="kv"><span class="k">unit / integration / end-to-end</span><span class="v">đơn vị / tích hợp / đầu-cuối — ba cỡ test của kim tự tháp.</span></div>
  <div class="kv"><span class="k">refactor</span><span class="v">tái cấu trúc — đổi bên trong mà giữ nguyên hành vi bên ngoài.</span></div>
  <div class="kv"><span class="k">coverage</span><span class="v">độ phủ — tỉ lệ dòng code đã chạy khi test (không phải đã được kiểm).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một test chạy code của bạn với đầu vào biết trước và kiểm đầu ra — viết một lần, chạy lại mãi.</li>
  <li>Kiểm bằng tay chỉ kiểm lại những gì bạn nhớ; test kiểm lại mọi thứ trong vài mili giây.</li>
  <li>Test biên đã bắt một lỗi hồi quy một ký tự (<code>&gt;</code> thay <code>&gt;=</code>) trước khi nó lên production.</li>
  <li>Kim tự tháp: nhiều unit test (~1&nbsp;ms), vừa phải test component (~10–150&nbsp;ms), ít test end-to-end (hàng trăm ms trở lên).</li>
  <li>Kiểm luật, giá trị biên, lỗi và bug đã sửa; bỏ qua framework, điểm ảnh và chuyện vặt; độ phủ không phải độ an toàn.</li>
  <li>Đọc báo cáo đỏ: dòng FAIL → Expected/Received → file:dòng.</li>
</ul>
${nguon('📗', 'Vitest — Getting Started', 'Hướng dẫn chính thức của trình chạy test dùng trong chương này', 'https://vitest.dev/guide/')}
${nguon('📘', 'Martin Fowler — The Practical Test Pyramid', 'Bài viết kinh điển giải thích kim tự tháp và các đánh đổi', 'https://martinfowler.com/articles/practical-test-pyramid.html')}
${lienKet({ khoa: 'testing', bai: 'tst-0-1-kim-tu-thap', title: 'Khoá Testing 0.2 — kim tự tháp test, đo thật trên LabFlow Lite', sub: 'Cùng kim tự tháp trên một dự án lớn hơn, kèm mô hình "chiếc cúp"', cta: 'Mở bài' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-1-vi-sao-test', title: 'Node.js 14.1 — một bài test giá bao nhiêu và mua được gì', sub: 'Cùng câu hỏi đó cho code máy chủ', cta: 'Mở bài' })}
</div>
`,
};
