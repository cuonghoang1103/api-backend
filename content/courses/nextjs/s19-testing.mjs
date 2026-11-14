/**
 * Next.js & React — Chương 19: Kiểm thử (testing).
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Viết cho người mới — định nghĩa "test", "unit/integration/e2e", "assertion",
 * "mock" khi gặp. Xem [[feedback_nextjs_course_beginner_first]]. Bài học thật
 * cuongthai: tsc qua sạch vẫn vỡ runtime (enum seed) → phải CHẠY mới biết (19.5),
 * nối [[feedback_tsc_does_not_check_prisma_seed]] + [[feedback_verify_by_running_not_reading]].
 */

import G19_1 from './giang/nxj-19-1.mjs';
import G19_2 from './giang/nxj-19-2.mjs';
import G19_3 from './giang/nxj-19-3.mjs';
import G19_4 from './giang/nxj-19-4.mjs';
import G19_5 from './giang/nxj-19-5.mjs';
export default {
  title: 'Chapter 19 — Testing: catching bugs before your users do|||Chương 19 — Kiểm thử: bắt lỗi trước khi người dùng gặp',
  description: 'Test là gì và vì sao đáng công, tháp kiểm thử (unit/integration/e2e), viết unit test với Vitest, test component với React Testing Library (test như người dùng), e2e với Playwright, và nên test cái gì — kèm bài học thật khi type-check qua sạch mà vẫn vỡ lúc chạy.',
  lessons: [
    /* ─────────────────────────── 19.1 ─────────────────────────── */
    {
      title: '19.1 — Why test, and the three kinds of test|||19.1 — Vì sao test, và ba loại test',
      slug: 'nextjs-19-1-vi-sao-test',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "React Testing for Beginners: Start Here!" — Programming with Mosh (oEmbed verified).
      video: { url: 'https://youtu.be/8Xwq35cPwYg', durationSeconds: 0 },
      description: 'Một "test" chỉ là code kiểm tra code khác chạy đúng — tự động, lặp lại được. Bài này giải thích test mua cho bạn điều gì (sự tự tin khi sửa), và ba tầng test: unit, integration, e2e.',
      content: `
${G19_1}
<div class="ml-en">
<div class="callout ok"><strong>Already took the React course?</strong> The React part of this chapter is taught in depth in the <a href="/courses/react">React</a> course (Chapter 9 for Vitest and Testing Library). What is specific to Next.js here: testing Server Components and Route Handlers, and end-to-end tests with Playwright.</div>
<span class="eyebrow">Chapter 19 · Lesson 19.1</span>
<h2>What a test is, and what it buys you</h2>
<p class="lead">A <strong>test</strong> is just a small piece of code that runs your real code and checks it behaves as expected. Instead of clicking through the app by hand every time you change something, you write the check once and a computer runs it in seconds, forever. That is the whole idea.</p>

<h3>What testing actually buys</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Confidence to change code</span><span class="v">The real value. With tests, you can refactor or add a feature and instantly know if you broke something — without re-testing the whole app by hand.</span></div>
  <div class="kv"><span class="k">Bugs caught early</span><span class="v">A test catches a mistake on your machine, in seconds — far cheaper than a user hitting it in production.</span></div>
  <div class="kv"><span class="k">Living documentation</span><span class="v">A good test describes what the code is supposed to do. New developers read tests to understand behaviour.</span></div>
</div>

<h3>The testing pyramid: three levels</h3>
<p>Tests come in layers, usually drawn as a pyramid — many cheap fast tests at the bottom, few slow expensive ones at the top:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Unit tests</b> (bottom, most) — test one small piece in isolation: a function, a calculation. Tiny and fast (milliseconds). Lesson 19.2.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Integration / component tests</b> (middle) — test a few pieces working together: a component with its buttons and state. Lesson 19.3.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>End-to-end (e2e) tests</b> (top, few) — drive a real browser through a whole flow: log in, fill a form, submit. Realistic but slow. Lesson 19.4.</div></div>
</div>
<p>Why a pyramid? Unit tests are cheap and pinpoint exactly what broke, so you write lots. E2e tests are slow and flaky but prove the real thing works, so you write a few for the critical journeys. Most projects want many unit tests, some component tests, and a handful of e2e tests for the money paths (login, checkout).</p>

<div class="callout ok">
<p><strong>Beginner reassurance:</strong> you do not need to test everything, and you do not start with 100% coverage. Start by unit-testing the tricky logic and writing one e2e test for your most important flow. Even a little testing turns "I hope I didn't break anything" into "the tests are green, ship it."</p>
</div>

<h3>What a test actually buys you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It documents the intended behaviour</b> — A test name is a sentence about what the code should do, checked by a machine. Comments go stale; tests fail.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>It makes refactoring safe</b> — You can restructure freely when something proves the behaviour did not change. Without that, every refactor is a gamble.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It catches the regression you cannot foresee</b> — The bug is rarely in the code you just wrote — it is in the thing three modules away that depended on it.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>It only helps if it runs</b> — A test suite that is red on main teaches everyone to ignore red. Keep it green or delete the failing test.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — testing the implementation instead of the behaviour.</strong> A test that asserts &#96;setState&#96; was called with a particular object, or that a component rendered a specific internal class name, breaks the moment you refactor — even though the app still works exactly as before. Now the suite is a cost with no benefit: every change requires updating tests that were never checking anything a user cares about. Assert what someone using the app would notice: the text on screen, the request that was sent, the value returned. A good test survives a rewrite of the code it tests.</p></div>
<a class="link-card dl" href="https://testing-library.com/docs/guiding-principles" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Testing Library — Guiding principles</span><span class="lc-sub">&quot;The more your tests resemble the way your software is used…&quot; — the sentence this lesson rests on.</span></span>
</a>
<a class="link-card dl" href="https://kentcdodds.com/blog/write-tests" target="_blank" rel="noopener">
  <span class="lc-ico">🏆</span>
  <span class="lc-body"><span class="lc-title">Write tests. Not too many. Mostly integration.</span><span class="lc-sub">The trade-off argument for where to spend testing effort.</span></span>
</a>


<h3>🔬 Measured: one bug, three kinds of test (Next.js 16.4.6 · Vitest 5.1 · Testing Library 16.3 · Playwright 1.61)</h3>
<p>A cart: two notebooks at 100.000₫, a “10% off” button. The total function had one wrong line — it compiles, <code>next build</code> is green, and the page shows <b>199.990₫</b> instead of <b>180.000₫</b>:</p>
<pre><code class="language-typescript"><span class="tok-comment">// lib/cart.ts — the cart total, with a percentage discount (BUG: subtracts 10₫, not 10%)</span>
export type Item = { name: string; price: number; qty: number };
export function total(items: Item[], discountPct = 0) {
  const sum = items.reduce((s, x) =&gt; s + x.price * x.qty, 0);
  return sum - discountPct;
}</code></pre>
<p>The same intent (“10% off leaves 180.000₫”) written three ways — a unit test (call <code>total()</code>), a component test (render the cart, click), an end-to-end test (built app, real Chromium). All three, red:</p>
<div class="out">$ npx vitest run src/lib/cart.test.ts 2&gt;&amp;1 | grep -E '✓|×|FAIL|^ *[-+] [0-9]|Tests |Duration' | head -8
     × applies a percentage discount 6ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  src/lib/cart.test.ts &gt; total &gt; applies a percentage discount
- 180000
+ 199990
      Tests  1 failed (1)
   Duration  927ms (environment 68%, setup 27%, transform 3%, tests 1%)
$ npx vitest run src/app/gio/Cart.test.tsx 2&gt;&amp;1 | grep -E '✓|×|Unable to find|Tests |Duration' | cut -c1-110 | head -6
   × shows the discounted total after Apply 74ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
TestingLibraryElementError: Unable to find an element with the text: Total: 180.000₫. This could be because th
        2 × Notebook · 100.000₫
      Tests  1 failed (1)
   Duration  674ms (environment 57%, setup 19%, tests 13%, import 8%, transform 3%)
$ npx playwright test 2&gt;&amp;1 | grep -E '✘|✓|passed|failed|Timeout:|Error: element' | head -8
  ✘  1 [chromium] › e2e/gio.spec.ts:3:5 › a shopper sees the discounted total (5.2s)
    Error: expect(locator).toBeVisible() failed
    Timeout: 5000ms
    Error: element(s) not found
  1 failed</div>
<p>Read the three messages: the unit test names the function and the exact numbers (6 ms); the component test says the text is missing (74 ms); the end-to-end test only says “not found” — after waiting its full 5 seconds. Fix the one line and all three pass:</p>
<div class="out">$ npx vitest run src/lib/cart.test.ts 2&gt;&amp;1 | grep -E '✓|×|Tests |Duration' | head -4
      Tests  1 passed (1)
   Duration  617ms (environment 68%, setup 26%, transform 4%, worker 1%)
$ npx vitest run src/app/gio/Cart.test.tsx 2&gt;&amp;1 | grep -E '✓|×|Tests |Duration' | head -4
      Tests  1 passed (1)
   Duration  634ms (environment 60%, setup 18%, tests 13%, import 6%, transform 2%, worker 1%)
$ npx playwright test 2&gt;&amp;1 | grep -E '✘|✓|passed|failed' | head -4
  ✓  1 [chromium] › e2e/gio.spec.ts:3:5 › a shopper sees the discounted total (216ms)
  1 passed (1.6s)</div>
<p><strong>The trap, measured</strong> — a test that checks the class <code>text-emerald-700</code>; a refactor renames it to <code>text-green-700</code> (same colour, same total):</p>
<div class="out">$ npx vitest run src/app/gio 2&gt;&amp;1 | grep -E '✓|×|Tests ' | head -4
      Tests  2 passed (2)
$ sed -i '' 's/text-emerald-700/text-green-700/' src/app/gio/Cart.tsx   # a refactor: same green, different class name
14:      &lt;p className="text-green-700"&gt;Total: {formatVND(total(ITEMS, pct))}&lt;/p&gt;
$ npx vitest run src/app/gio 2&gt;&amp;1 | grep -E '✓|×|Tests ' | head -4
   × renders the total in green (implementation detail) 31ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
      Tests  1 failed | 1 passed (2)</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ echo "backend src/**/*.test.ts: $(find src -name '*.test.ts' | wc -l | tr -d ' ') tệp (trong đó *.db.test.ts cần CSDL: $(find src -name '*.db.test.ts' | wc -l | tr -d ' '))"; echo "frontend/src *.test.ts: $(find frontend/src -name '*.test.ts' | wc -l | tr -d ' ') · *.test.tsx (render component): $(find frontend/src -name '*.test.tsx' | wc -l | tr -d ' ')"; echo "frontend/e2e *.spec.ts: $(find frontend/e2e -name '*.spec.ts' | wc -l | tr -d ' ') · @testing-library trong frontend/package.json: $(grep -c '@testing-library' frontend/package.json)"
backend src/**/*.test.ts: 329 tệp (trong đó *.db.test.ts cần CSDL: 102)
frontend/src *.test.ts: 62 · *.test.tsx (render component): 0
frontend/e2e *.spec.ts: 13 · @testing-library trong frontend/package.json: 0
$ npx tsx --test src/services/finance/money.test.ts 2&gt;&amp;1 | grep -E '^# (tests|pass|fail|duration_ms)'
# tests 4
# pass 4
# fail 0
# duration_ms 271.326291</div>The backend runs hundreds of unit tests with Node&#39;s built-in runner (<code>tsx --test</code>), some against a real database. The frontend has logic tests and end-to-end specs but no component tests — the middle of the pyramid is empty.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm i -D @types/node@^22 vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom @playwright/test
npx vitest run src/lib/cart.test.ts      <span class="tok-comment">  # unit</span>
npx vitest run src/app/gio/Cart.test.tsx <span class="tok-comment">  # component (jsdom)</span>
npm run build &amp;&amp; npx playwright test      <span class="tok-comment">  # end-to-end, against the build</span>
<span class="tok-comment"># break total() on purpose: all three must turn red</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">Bills are rarely re-checked: one wrong sign in a coupon or tax rule ships to every customer, and nobody notices for weeks.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">…the tests run only when someone remembers? A red test that everyone ignores teaches the team that red means nothing.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Attackers test your edges for you: a coupon of 100%, of −5, applied twice, on an order of 0₫. Untested price logic is a gift.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Unit-test every price rule and its edges; keep one end-to-end test for checkout running on every pull request; validate coupons on the server.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-9-1-testing-library" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 9.1 — Testing Library basics</span><span class="lc-sub">Queries by role, user-event, from the ground up</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-14-1-vi-sao-test" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 14.1 — What a test costs and buys</span><span class="lc-sub">The same question on the backend</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-5-do-trung-thuc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.5 — Measuring, honestly</span><span class="lc-sub">Measure speed; now measure correctness</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>List the three kinds of test (unit, component/integration, end-to-end) and give one example of each for your app.</li>
<li>For one recent bug, decide which kind of test would have caught it.</li>
<li>Sketch the testing pyramid and where you should spend most effort.</li>
</ol>
<p><strong>Done when:</strong> you can name the three kinds of test and match a bug to the right one.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Unit test</span><span class="v">Tests one function/module in isolation.</span></div>
  <div class="kv"><span class="k">Component test</span><span class="v">Renders a component and asserts behaviour like a user.</span></div>
  <div class="kv"><span class="k">End-to-end (E2E)</span><span class="v">Drives the whole app in a real browser.</span></div>
  <div class="kv"><span class="k">Testing pyramid</span><span class="v">Many fast unit tests, fewer E2E tests.</span></div>
  <div class="kv"><span class="k">Regression</span><span class="v">A test that stops a fixed bug from returning.</span></div>
  <div class="kv"><span class="k">Confidence</span><span class="v">Tests let you change code without fear.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Three kinds of test: unit (one function), component (render + assert like a user), end-to-end (whole app in a browser).</li><li>The testing pyramid says: many fast unit tests, fewer slow E2E tests.</li><li>Tests give you confidence to change code and stop fixed bugs from returning.</li><li>Match each bug to the cheapest test that would have caught it.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/testing" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Testing</span><span class="lc-sub">Setting up Vitest, Jest, React Testing Library, Playwright, and Cypress.</span></span>
</a>
</div>

<div class="ml-vi">
<div class="callout ok"><strong>Đã học khoá React?</strong> Phần React của chương này được dạy kỹ ở khoá <a href="/courses/react">React</a> (Chương 9 phần Vitest và Testing Library). Phần riêng của Next.js ở đây: test Server Component và Route Handler, và test end-to-end bằng Playwright.</div>
<span class="eyebrow">Chương 19 · Bài 19.1</span>
<h2>Test là gì, và nó mua cho bạn điều gì</h2>
<p class="lead">Một <strong>test</strong> chỉ là một mẩu code nhỏ chạy code thật của bạn và kiểm nó hành xử đúng như mong đợi. Thay vì bấm qua app bằng tay mỗi lần bạn đổi gì đó, bạn viết phép kiểm một lần và máy chạy nó trong vài giây, mãi mãi. Đó là toàn bộ ý tưởng.</p>

<h3>Test thật sự mua gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tự tin khi đổi code</span><span class="v">Giá trị thật. Có test, bạn refactor hay thêm tính năng và biết ngay mình có làm hỏng gì không — mà không phải test lại cả app bằng tay.</span></div>
  <div class="kv"><span class="k">Bắt lỗi sớm</span><span class="v">Một test bắt lỗi trên máy bạn, trong vài giây — rẻ hơn nhiều so với một người dùng gặp nó trên production.</span></div>
  <div class="kv"><span class="k">Tài liệu sống</span><span class="v">Một test tốt mô tả code định làm gì. Lập trình viên mới đọc test để hiểu hành vi.</span></div>
</div>

<h3>Tháp kiểm thử: ba tầng</h3>
<p>Test có nhiều tầng, thường vẽ thành một kim tự tháp — nhiều test rẻ và nhanh ở đáy, ít test chậm và đắt ở đỉnh:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Unit test</b> (đáy, nhiều nhất) — test một mảnh nhỏ cô lập: một hàm, một phép tính. Bé xíu và nhanh (mili-giây). Bài 19.2.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Integration / component test</b> (giữa) — test vài mảnh làm việc cùng nhau: một component với nút và state của nó. Bài 19.3.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>End-to-end (e2e)</b> (đỉnh, ít) — lái một trình duyệt thật qua cả một luồng: đăng nhập, điền form, submit. Thực tế nhưng chậm. Bài 19.4.</div></div>
</div>
<p>Vì sao là kim tự tháp? Unit test rẻ và chỉ đúng cái gì hỏng, nên bạn viết nhiều. E2e test chậm và dễ chập chờn nhưng chứng minh thứ thật chạy, nên bạn viết vài cái cho các hành trình then chốt. Đa số dự án muốn nhiều unit test, một số component test, và vài e2e test cho các đường tiền (đăng nhập, thanh toán).</p>

<div class="callout ok">
<p><strong>Trấn an người mới:</strong> bạn không cần test mọi thứ, và không bắt đầu với 100% coverage. Hãy bắt đầu bằng unit-test cho logic hóc búa và viết một e2e test cho luồng quan trọng nhất. Chỉ một chút test cũng biến "mong là mình không làm hỏng gì" thành "test xanh rồi, ship thôi".</p>
</div>

<h3>Một bài kiểm thử thật sự mua cho bạn cái gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó ghi lại hành vi dự định</b> — Tên một bài kiểm thử là một câu nói về việc mã nên làm gì, và được máy kiểm chứng. Comment thì cũ đi; bài kiểm thử thì hỏng.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Nó làm việc tái cấu trúc trở nên an toàn</b> — Bạn sắp xếp lại thoải mái khi có thứ chứng minh hành vi không đổi. Không có nó thì mỗi lần tái cấu trúc là một canh bạc.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó bắt được cái lỗi hồi quy bạn không lường trước</b> — Lỗi hiếm khi nằm trong đoạn mã bạn vừa viết — nó nằm ở cái thứ cách đó ba module vốn phụ thuộc vào nó.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Nó chỉ có ích nếu nó được chạy</b> — Một bộ kiểm thử đỏ trên nhánh chính dạy tất cả mọi người phớt lờ màu đỏ. Hãy giữ nó xanh hoặc xoá bài kiểm thử đang hỏng đi.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — kiểm thử phần hiện thực thay vì kiểm thử hành vi.</strong> Một bài kiểm thử khẳng định rằng &#96;setState&#96; đã được gọi với một object cụ thể, hay rằng một component đã vẽ ra một tên class nội bộ nào đó, sẽ vỡ ngay khi bạn tái cấu trúc — dù ứng dụng vẫn chạy y hệt như trước. Giờ bộ kiểm thử là một chi phí không đem lại lợi ích gì: mọi thay đổi đều đòi cập nhật những bài kiểm thử vốn chưa từng kiểm thứ gì người dùng quan tâm. Hãy khẳng định thứ mà một người dùng ứng dụng sẽ nhận ra: đoạn chữ trên màn hình, cái request đã gửi đi, giá trị đã trả về. Một bài kiểm thử tốt sống sót qua một lần viết lại đoạn mã mà nó kiểm.</p></div>
<a class="link-card dl" href="https://testing-library.com/docs/guiding-principles" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Testing Library — Nguyên tắc dẫn đường</span><span class="lc-sub">&quot;Bài kiểm thử của bạn càng giống cách phần mềm được dùng…&quot; — câu nói mà bài này dựa vào.</span></span>
</a>
<a class="link-card dl" href="https://kentcdodds.com/blog/write-tests" target="_blank" rel="noopener">
  <span class="lc-ico">🏆</span>
  <span class="lc-body"><span class="lc-title">Viết kiểm thử. Đừng quá nhiều. Chủ yếu là tích hợp.</span><span class="lc-sub">Luận điểm đánh đổi về việc nên dồn công sức kiểm thử vào đâu.</span></span>
</a>


<h3>🔬 Đo thật: một con bọ, ba loại test (Next.js 16.4.6 · Vitest 5.1 · Testing Library 16.3 · Playwright 1.61)</h3>
<p>Một giỏ hàng: hai cuốn vở 100.000₫, một nút “giảm 10%”. Hàm tính tổng sai đúng một dòng — biên dịch được, <code>next build</code> xanh, và trang hiện <b>199.990₫</b> thay vì <b>180.000₫</b>:</p>
<pre><code class="language-typescript"><span class="tok-comment">// lib/cart.ts — the cart total, with a percentage discount (BUG: subtracts 10₫, not 10%)</span>
export type Item = { name: string; price: number; qty: number };
export function total(items: Item[], discountPct = 0) {
  const sum = items.reduce((s, x) =&gt; s + x.price * x.qty, 0);
  return sum - discountPct;
}</code></pre>
<p>Cùng một ý (“giảm 10% còn 180.000₫”) viết ba cách — unit test (gọi <code>total()</code>), component test (dựng giỏ hàng, bấm), end-to-end (app đã build, Chromium thật). Cả ba đều đỏ:</p>
<div class="out">$ npx vitest run src/lib/cart.test.ts 2&gt;&amp;1 | grep -E '✓|×|FAIL|^ *[-+] [0-9]|Tests |Duration' | head -8
     × applies a percentage discount 6ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  src/lib/cart.test.ts &gt; total &gt; applies a percentage discount
- 180000
+ 199990
      Tests  1 failed (1)
   Duration  927ms (environment 68%, setup 27%, transform 3%, tests 1%)
$ npx vitest run src/app/gio/Cart.test.tsx 2&gt;&amp;1 | grep -E '✓|×|Unable to find|Tests |Duration' | cut -c1-110 | head -6
   × shows the discounted total after Apply 74ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
TestingLibraryElementError: Unable to find an element with the text: Total: 180.000₫. This could be because th
        2 × Notebook · 100.000₫
      Tests  1 failed (1)
   Duration  674ms (environment 57%, setup 19%, tests 13%, import 8%, transform 3%)
$ npx playwright test 2&gt;&amp;1 | grep -E '✘|✓|passed|failed|Timeout:|Error: element' | head -8
  ✘  1 [chromium] › e2e/gio.spec.ts:3:5 › a shopper sees the discounted total (5.2s)
    Error: expect(locator).toBeVisible() failed
    Timeout: 5000ms
    Error: element(s) not found
  1 failed</div>
<p>Đọc ba thông báo: unit test chỉ đúng hàm và con số (6 ms); component test nói thiếu dòng chữ (74 ms); end-to-end chỉ nói “không tìm thấy” — sau khi chờ đủ 5 giây. Sửa một dòng, cả ba qua:</p>
<div class="out">$ npx vitest run src/lib/cart.test.ts 2&gt;&amp;1 | grep -E '✓|×|Tests |Duration' | head -4
      Tests  1 passed (1)
   Duration  617ms (environment 68%, setup 26%, transform 4%, worker 1%)
$ npx vitest run src/app/gio/Cart.test.tsx 2&gt;&amp;1 | grep -E '✓|×|Tests |Duration' | head -4
      Tests  1 passed (1)
   Duration  634ms (environment 60%, setup 18%, tests 13%, import 6%, transform 2%, worker 1%)
$ npx playwright test 2&gt;&amp;1 | grep -E '✘|✓|passed|failed' | head -4
  ✓  1 [chromium] › e2e/gio.spec.ts:3:5 › a shopper sees the discounted total (216ms)
  1 passed (1.6s)</div>
<p><strong>Cái bẫy, đo thật</strong> — một bài test kiểm lớp <code>text-emerald-700</code>; tái cấu trúc đổi thành <code>text-green-700</code> (cùng màu, cùng tổng):</p>
<div class="out">$ npx vitest run src/app/gio 2&gt;&amp;1 | grep -E '✓|×|Tests ' | head -4
      Tests  2 passed (2)
$ sed -i '' 's/text-emerald-700/text-green-700/' src/app/gio/Cart.tsx   # a refactor: same green, different class name
14:      &lt;p className="text-green-700"&gt;Total: {formatVND(total(ITEMS, pct))}&lt;/p&gt;
$ npx vitest run src/app/gio 2&gt;&amp;1 | grep -E '✓|×|Tests ' | head -4
   × renders the total in green (implementation detail) 31ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
      Tests  1 failed | 1 passed (2)</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ echo "backend src/**/*.test.ts: $(find src -name '*.test.ts' | wc -l | tr -d ' ') tệp (trong đó *.db.test.ts cần CSDL: $(find src -name '*.db.test.ts' | wc -l | tr -d ' '))"; echo "frontend/src *.test.ts: $(find frontend/src -name '*.test.ts' | wc -l | tr -d ' ') · *.test.tsx (render component): $(find frontend/src -name '*.test.tsx' | wc -l | tr -d ' ')"; echo "frontend/e2e *.spec.ts: $(find frontend/e2e -name '*.spec.ts' | wc -l | tr -d ' ') · @testing-library trong frontend/package.json: $(grep -c '@testing-library' frontend/package.json)"
backend src/**/*.test.ts: 329 tệp (trong đó *.db.test.ts cần CSDL: 102)
frontend/src *.test.ts: 62 · *.test.tsx (render component): 0
frontend/e2e *.spec.ts: 13 · @testing-library trong frontend/package.json: 0
$ npx tsx --test src/services/finance/money.test.ts 2&gt;&amp;1 | grep -E '^# (tests|pass|fail|duration_ms)'
# tests 4
# pass 4
# fail 0
# duration_ms 271.326291</div>Phía máy chủ chạy hàng trăm unit test bằng bộ chạy có sẵn của Node (<code>tsx --test</code>), một phần chạy trên CSDL thật. Phía giao diện có test logic và test end-to-end nhưng chưa có component test nào — giữa tháp còn trống.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm i -D @types/node@^22 vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom @playwright/test
npx vitest run src/lib/cart.test.ts      <span class="tok-comment">  # unit</span>
npx vitest run src/app/gio/Cart.test.tsx <span class="tok-comment">  # component (jsdom)</span>
npm run build &amp;&amp; npx playwright test      <span class="tok-comment">  # end-to-end, trên bản build</span>
<span class="tok-comment"># cố tình làm hỏng total(): cả ba phải đỏ</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Hoá đơn ít ai dò lại: một dấu sai trong mã giảm giá hay luật thuế đi tới mọi khách hàng, và vài tuần không ai hay.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">…test chỉ chạy khi có ai nhớ ra? Một bài đỏ mà ai cũng lờ đi dạy cả nhóm rằng màu đỏ chẳng nghĩa lý gì.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Kẻ xấu thử các mép thay bạn: mã giảm 100%, âm 5, dùng hai lần, trên đơn 0₫. Luật giá không có test là một món quà.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Unit test cho từng luật giá và các mép; giữ một test end-to-end cho thanh toán chạy ở mọi pull request; kiểm mã giảm giá ở máy chủ.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-9-1-testing-library" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 9.1 — Testing Library căn bản</span><span class="lc-sub">Hỏi theo vai trò, user-event, từ gốc</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-14-1-vi-sao-test" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 14.1 — Một bài test giá bao nhiêu và mua được gì</span><span class="lc-sub">Cùng câu hỏi, phía máy chủ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-18-5-do-trung-thuc" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 18.5 — Đo, một cách trung thực</span><span class="lc-sub">Đo tốc độ; giờ đo độ đúng</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Liệt kê ba loại test (unit, component/integration, end-to-end) và cho một ví dụ mỗi loại cho app của bạn.</li>
<li>Với một bug gần đây, quyết định loại test nào sẽ bắt được nó.</li>
<li>Phác kim tự tháp test và nơi bạn nên dồn phần lớn công sức.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gọi tên được ba loại test và khớp một bug với đúng loại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Unit test</span><span class="v">Test một hàm/module cô lập.</span></div>
  <div class="kv"><span class="k">Component test</span><span class="v">Render một component và khẳng định hành vi như người dùng.</span></div>
  <div class="kv"><span class="k">End-to-end (E2E)</span><span class="v">Điều khiển cả app trong một trình duyệt thật.</span></div>
  <div class="kv"><span class="k">Kim tự tháp test</span><span class="v">Nhiều unit test nhanh, ít E2E test hơn.</span></div>
  <div class="kv"><span class="k">Regression</span><span class="v">Một test ngăn một bug đã sửa quay lại.</span></div>
  <div class="kv"><span class="k">Sự tự tin</span><span class="v">Test cho bạn đổi code mà không sợ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ba loại test: unit (một hàm), component (render + khẳng định như người dùng), end-to-end (cả app trong trình duyệt).</li><li>Kim tự tháp test nói: nhiều unit test nhanh, ít E2E test chậm hơn.</li><li>Test cho bạn tự tin đổi code và ngăn bug đã sửa quay lại.</li><li>Khớp mỗi bug với loại test rẻ nhất mà sẽ bắt được nó.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/testing" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Testing</span><span class="lc-sub">Cài Vitest, Jest, React Testing Library, Playwright, và Cypress.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 19.2 ─────────────────────────── */
    {
      title: '19.2 — Unit tests with Vitest|||19.2 — Unit test với Vitest',
      slug: 'nextjs-19-2-unit-test-vitest',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Một unit test: gọi một hàm với input đã biết, rồi khẳng định (assert) kết quả đúng như mong đợi. Cú pháp test/expect với Vitest, chạy npm test, và vì sao hàm thuần dễ test nhất.',
      content: `
${G19_2}
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Lesson 19.2</span>
<h2>The smallest test: call a function, check the result</h2>
<p class="lead">A unit test takes one piece of code — usually a function — gives it a known input, and checks the output is what you expect. That check is called an <strong>assertion</strong>. <strong>Vitest</strong> (a fast, modern test runner; <strong>Jest</strong> is the older equivalent) gives you the words to write it.</p>

<pre><code class="language-javascript"><span class="tok-comment">// money.ts — the code under test</span>
export function formatVND(n: number) {
  return n.toLocaleString('vi-VN') + '&#8363;';
}

<span class="tok-comment">// money.test.ts — the test</span>
import { describe, it, expect } from 'vitest';
import { formatVND } from './money';

describe('formatVND', () =&gt; {
  it('formats a number as Vietnamese dong', () =&gt; {
    expect(formatVND(1000)).toBe('1.000&#8363;');   <span class="tok-comment">// input → expected output</span>
  });
});</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">describe(...)</span><span class="v">Groups related tests under a name. Optional, but keeps output readable.</span></div>
  <div class="kv"><span class="k">it(...) / test(...)</span><span class="v">One test case. The string says what it should do — read it as a sentence: "it formats a number as VND."</span></div>
  <div class="kv"><span class="k">expect(x).toBe(y)</span><span class="v">The assertion: "I expect x to equal y." If it does not, the test fails and tells you exactly how.</span></div>
  <div class="kv"><span class="k">Run it</span><span class="v"><code>npx vitest</code> runs every <code>*.test.ts</code> file and prints green (pass) or red (fail). <code>npm test</code> works only after you add <code>"test": "vitest"</code> to <code>package.json</code> — a fresh <code>create-next-app</code> has no test script (measured: <code>Missing script: "test"</code>).</span></div>
</div>

<h3>Pure functions are the easiest thing to test</h3>
<p>Remember pure functions from Chapter 2 — same input, same output, no side effects? They are the ideal test target: no setup, no database, no mocking, just input → output. When you have tricky logic (a price calculator, a date formatter, a validation rule), pulling it into a small pure function makes it both cleaner <em>and</em> trivial to test. Testable code and good code tend to be the same code.</p>

<div class="callout ok">
<p><strong>A good first habit:</strong> when you write a function with any real logic, write two or three tests for it — the normal case, an edge case (zero, empty, negative), and anything that once broke. It takes a minute and pays back every time you touch that function later.</p>
</div>

<h3>A unit test, and what belongs in one</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Pure functions first</b> — A formatter, a validator, a price calculation. No React, no network, no database — fast and deterministic.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>One behaviour per test</b> — The name says what, the body shows how. A test asserting five things tells you nothing when it fails.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Arrange, act, assert</b> — Set up the input, call the thing, check the output. Any test that does not fit this shape is usually doing too much.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Run them on every commit</b> — Fast unit tests are worth having only if nobody has to remember to run them.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a test that passes because the assertion never ran.</strong> &#96;test(&#39;saves&#39;, async () =&gt; { save().then(r =&gt; expect(r.ok).toBe(true)) })&#96; passes instantly and checks nothing: the test function returned before the promise resolved, so the assertion executed after the test was already recorded as green. The same shape appears with a missing &#96;await&#96;, or an assertion inside a callback that never fires. It is worse than no test, because it reports confidence you do not have. Two habits: always &#96;await&#96; or return the promise, and make a new test fail once on purpose before you trust it.</p></div>
<a class="link-card dl" href="https://vitest.dev/guide/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Vitest — Guide</span><span class="lc-sub">Setup, the API, and the Next.js configuration notes.</span></span>
</a>
<a class="link-card dl" href="https://vitest.dev/api/expect.html" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">Vitest — expect</span><span class="lc-sub">Every matcher, including the async ones this trap is about.</span></span>
</a>


<div class="callout warn"><p><strong>Measured on Next.js 16.4.6: the lesson&#39;s code passes its test and fails the type-check.</strong> With <code>formatVND(n)</code> untyped, <code>npx vitest run</code> prints <code>1 passed</code> while <code>npx tsc --noEmit</code> prints <code>TS7006: Parameter &#39;n&#39; implicitly has an &#39;any&#39; type</code>. Vitest only transforms TypeScript — it never type-checks. The code above now says <code>n: number</code>; run <code>tsc</code> next to your tests.</p></div>
<h3>🔬 Measured: installing, edges, the lying test, a Route Handler (Next.js 16.4.6 · Vitest 5.1.0 · Vite 8)</h3>
<p><strong>1 · Installing on a fresh create-next-app</strong> — the install line from nextjs.org fails, because the project pins <code>@types/node ^20</code> and Vitest 5 wants <code>^22</code>. Upgrade it in the same command (no <code>--force</code>):</p>
<div class="out">$ npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths   # the line from nextjs.org/docs (fresh create-next-app)
npm error code ERESOLVE
npm error Found: @types/node@20.19.43
npm error peerOptional @types/node@"^22.0.0 || &gt;=24.0.0" from vitest@5.1.0
$ npm install -D @types/node@^22 vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom @playwright/test
@playwright/test@1.61.0
@testing-library/react@16.3.3
@types/node@22.20.5
jsdom@31.0.1
vitest@5.1.0
$ npm test 2&gt;&amp;1 | grep -E 'Missing script'
npm error Missing script: "test"</div>
<p><strong>2 · The docs&#39; config still works, with a notice</strong> — Vite 8 resolves tsconfig <code>paths</code> itself: drop <code>vite-tsconfig-paths</code> and write <code>resolve: {{ tsconfigPaths: true }}</code>:</p>
<div class="out">$ npx vitest run 2&gt;&amp;1 | grep -E 'tsconfig paths|Test Files|Tests |Duration' | cut -c1-150
The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remov
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Duration  726ms (environment 92%, transform 3%, tests 2%, import 1%)</div>
<p><strong>3 · An edge case found a real bug in the lesson&#39;s function</strong> — <code>toLocaleString(&#39;vi-VN&#39;)</code> keeps decimals, and dong has no cents:</p>
<div class="out">$ npx vitest run src/lib/money.test.ts 2&gt;&amp;1 | grep -E '✓|×|Expected:|Received:|Tests |Duration' | head -8
     × never shows decimals (dong has no cents) 3ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
Expected: "1.235₫"
Received: "1.234,5₫"
      Tests  1 failed | 2 passed (3)
   Duration  687ms (environment 94%, tests 3%, import 1%, transform 1%, worker 1%)</div>
<p>Fix: <code>n.toLocaleString(&#39;vi-VN&#39;, {{ maximumFractionDigits: 0 }})</code>. In watch mode, saving the file re-ran only the affected test:</p>
<div class="out">$ npx vitest   # watch mode: save a file ⇒ only the affected tests re-run
$ grep -aE 'RERUN|×|Tests |Duration' ~/.rtq-nxj/nen-c19w.log | tr -d '\\033' | sed -E 's/^c(\\[3J)? RERUN/ RERUN/' | cut -c1-90 | head -8
     × never shows decimals (dong has no cents) 4ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
      Tests  1 failed | 2 passed (3)
   Duration  506ms (environment 91%, tests 5%, import 2%, transform 1%, worker 1%)
 FAIL  Tests failed. Watching for file changes...
 RERUN  src/lib/money.ts x1 
      Tests  3 passed (3)
   Duration  40ms</div>
<p><strong>4 · The trap, measured</strong> — <code>save()</code> resolves <code>{{ ok: false }}</code> after 50 ms; the lesson&#39;s test (no <code>await</code>) is green; the awaited and the <code>expect.assertions(1)</code> versions fail as they should:</p>
<div class="out">$ npx vitest run src/lib/save.test.ts 2&gt;&amp;1 | grep -E '✓|×|Tests |Duration' | head -4
      Tests  1 passed (1)
   Duration  426ms (environment 93%, transform 4%, import 2%, worker 1%)
$ npx vitest run src/lib/save.test.ts 2&gt;&amp;1 | grep -E '×|expected|Tests ' | head -6
   × saves (awaited) 56ms
   × saves (guarded) 3ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected false to be true // Object.is equality
Error: expected number of assertions to be 1, but got 0
      Tests  2 failed (2)</div>
<p><strong>5 · Next.js: a Route Handler is a function</strong> — no server, no browser: build a <code>Request</code>, call <code>GET()</code>, read the <code>Response</code> (add <code>// @vitest-environment node</code> at the top of the file):</p>
<pre><code class="language-typescript"><span class="tok-comment">// @vitest-environment node</span>
<span class="tok-comment">// app/api/price/route.test.ts — call GET() directly: no server, no browser</span>
import { it, expect } from 'vitest';
import { GET } from './route';
it('returns the discounted total', async () =&gt; {
  const res = await GET(new Request('http://test/api/price?pct=10'));
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ total: 180000 });
});
it('rejects a 90% coupon', async () =&gt; {
  const res = await GET(new Request('http://test/api/price?pct=90'));
  expect(res.status).toBe(400);
});</code></pre>
<div class="out">$ npx vitest run src/app/api/price 2&gt;&amp;1 | grep -E '✓|×|Tests |Duration' | head -4
      Tests  2 passed (2)
   Duration  139ms (transform 45%, tests 32%, import 18%, worker 5%)</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ sed -n '1,12p' src/services/finance/money.test.ts
/**
 * Money-math unit tests (P1-13). Run with the built-in node:test runner
 * via tsx (&#96;npm test&#96;). Pure functions — no DB, no network — so they run
 * fast and deterministically in CI.
 *
 * Guards the invariants that matter for correctness of every balance:
 * decimal-safe arithmetic (never JS floats) and HALF_UP rounding, plus a
 * worked debt-schedule example whose numbers are hand-verifiable.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { round2, sum, pct } from './money.js';
$ npx tsx --test src/services/finance/money.test.ts 2&gt;&amp;1 | grep -E '^ok|^not ok|^# (pass|fail|duration_ms)' | head -7
ok 1 - sum is decimal-safe — 0.1 + 0.2 === 0.3 (no float drift)
ok 2 - round2 rounds to 2 decimal places, HALF_UP
ok 3 - pct converts a percentage to a fraction
ok 4 - computeDebt FLAT_MONTHLY: 12,000,000 @ 1%/mo × 12 matches the worked example
# pass 4
# fail 0
# duration_ms 325.714</div>The backend uses Node&#39;s built-in <code>node:test</code> + <code>node:assert</code> through <code>tsx --test</code> — no framework, the same arrange-act-assert, on exactly the risky money logic.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm i -D @types/node@^22 vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
npm pkg set scripts.test="vitest"
npx vitest run &amp;&amp; npx tsc --noEmit      <span class="tok-comment">  # both, every time</span>
npx vitest                               <span class="tok-comment">  # watch mode: save a file, the related tests re-run</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">Money is full of edges: “1.234,5₫” on an invoice looks broken, and rounding decides who loses one dong a million times.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">…CI only runs <code>tsc</code>? Behaviour is never checked — and a test that never awaited stays green for years.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Sends the inputs you did not imagine: <code>pct=-10</code>, <code>1e9</code>, <code>abc</code>, <code>NaN</code> — to a route that trusts its query string.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Test the 400 path of every handler; await every promise (or <code>expect.assertions</code>); watch each new test fail once.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-14-2-unit-test" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 14.2 — Unit tests, fakes, and tests that check nothing</span><span class="lc-sub">The same discipline on the backend</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-16-3-zod" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 16.3 — Validation with Zod</span><span class="lc-sub">Validate the inputs your handler tests send</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-19-3-react-testing-library" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 19.3 — Component tests</span><span class="lc-sub">The middle of the pyramid</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Vitest</span><span class="v">A fast Vite-native test runner for unit tests.</span></div>
  <div class="kv"><span class="k">test / it</span><span class="v">Define a test case.</span></div>
  <div class="kv"><span class="k">expect</span><span class="v">Make an assertion about a value.</span></div>
  <div class="kv"><span class="k">Matcher</span><span class="v"><code>toBe</code>, <code>toEqual</code> etc. that check the assertion.</span></div>
  <div class="kv"><span class="k">Watch mode</span><span class="v">Re-run tests on file changes during development.</span></div>
  <div class="kv"><span class="k">Pure function</span><span class="v">Easiest thing to unit test — input in, output out.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Vitest is a fast test runner: write cases with <code>test</code>/<code>it</code> and assert with <code>expect(...)</code> and matchers.</li><li>Pure functions are the easiest to unit test — same input, same output.</li><li>Watch mode re-runs affected tests as you edit.</li><li>Unit tests are the broad base of the testing pyramid.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://vitest.dev/guide/" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">vitest.dev — Guide</span><span class="lc-sub">describe/it/expect, matchers, and running tests.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 19 · Bài 19.2</span>
<h2>Test nhỏ nhất: gọi một hàm, kiểm kết quả</h2>
<p class="lead">Một unit test lấy một mảnh code — thường là một hàm — cho nó một input đã biết, và kiểm output đúng như bạn mong. Phép kiểm đó gọi là <strong>assertion</strong> (khẳng định). <strong>Vitest</strong> (một trình chạy test nhanh, hiện đại; <strong>Jest</strong> là bản cũ tương đương) cho bạn từ ngữ để viết nó.</p>

<pre><code class="language-javascript"><span class="tok-comment">// money.ts — code cần test</span>
export function formatVND(n: number) {
  return n.toLocaleString('vi-VN') + '&#8363;';
}

<span class="tok-comment">// money.test.ts — bài test</span>
import { describe, it, expect } from 'vitest';
import { formatVND } from './money';

describe('formatVND', () =&gt; {
  it('định dạng một số thành đồng Việt Nam', () =&gt; {
    expect(formatVND(1000)).toBe('1.000&#8363;');   <span class="tok-comment">// input → output mong đợi</span>
  });
});</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">describe(...)</span><span class="v">Gom các test liên quan dưới một tên. Tuỳ chọn, nhưng giữ output dễ đọc.</span></div>
  <div class="kv"><span class="k">it(...) / test(...)</span><span class="v">Một ca test. Chuỗi nói nó nên làm gì — đọc như một câu: "nó định dạng một số thành VND."</span></div>
  <div class="kv"><span class="k">expect(x).toBe(y)</span><span class="v">Assertion: "tôi mong x bằng y." Nếu không, test thất bại và nói chính xác thế nào.</span></div>
  <div class="kv"><span class="k">Chạy nó</span><span class="v"><code>npx vitest</code> chạy mọi tệp <code>*.test.ts</code> và in xanh (đạt) hoặc đỏ (rớt). <code>npm test</code> chỉ chạy được sau khi bạn thêm <code>"test": "vitest"</code> vào <code>package.json</code> — dự án <code>create-next-app</code> mới chưa có lệnh test (đo: <code>Missing script: "test"</code>).</span></div>
</div>

<h3>Hàm thuần là thứ dễ test nhất</h3>
<p>Nhớ hàm thuần ở Chương 2 — cùng input, cùng output, không tác dụng phụ? Chúng là mục tiêu test lý tưởng: không setup, không database, không mock, chỉ input → output. Khi bạn có logic hóc búa (một máy tính giá, một bộ định dạng ngày, một luật validation), tách nó thành một hàm thuần nhỏ làm nó vừa sạch hơn <em>vừa</em> dễ test. Code test được và code tốt thường là cùng một code.</p>

<div class="callout ok">
<p><strong>Một thói quen đầu tiên tốt:</strong> khi bạn viết một hàm có logic thật, hãy viết hai ba test cho nó — ca thường, một ca biên (số 0, rỗng, âm), và bất cứ gì từng hỏng. Tốn một phút và trả lại mỗi lần bạn động vào hàm đó sau này.</p>
</div>

<h3>Một bài kiểm thử đơn vị, và cái gì thuộc về nó</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Các hàm thuần trước</b> — Một bộ định dạng, một bộ kiểm dữ liệu, một phép tính giá. Không React, không mạng, không cơ sở dữ liệu — nhanh và tất định.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Một hành vi mỗi bài kiểm thử</b> — Cái tên nói CÁI GÌ, phần thân cho thấy NHƯ THẾ NÀO. Một bài kiểm thử khẳng định năm thứ chẳng nói gì với bạn khi nó hỏng.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Sắp xếp, hành động, khẳng định</b> — Dựng đầu vào, gọi cái thứ đó, kiểm đầu ra. Bài kiểm thử nào không vừa hình dạng này thì thường là đang làm quá nhiều việc.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Chạy chúng ở mọi commit</b> — Kiểm thử đơn vị nhanh chỉ đáng có nếu chẳng ai phải nhớ chạy chúng.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một bài kiểm thử qua được vì phép khẳng định chưa hề chạy.</strong> &#96;test(&#39;saves&#39;, async () =&gt; { save().then(r =&gt; expect(r.ok).toBe(true)) })&#96; qua ngay tức thì và chẳng kiểm gì cả: hàm kiểm thử đã trả về trước khi promise xong, nên phép khẳng định chạy sau khi bài kiểm thử đã được ghi nhận là xanh. Cùng hình dạng ấy hiện ra khi thiếu một &#96;await&#96;, hoặc khi phép khẳng định nằm trong một callback chẳng bao giờ nổ. Nó tệ hơn cả không có bài kiểm thử nào, vì nó báo cáo một sự tự tin mà bạn không có. Hai thói quen: luôn &#96;await&#96; hoặc return cái promise, và hãy cố tình làm cho một bài kiểm thử mới hỏng một lần trước khi tin nó.</p></div>
<a class="link-card dl" href="https://vitest.dev/guide/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Vitest — Hướng dẫn</span><span class="lc-sub">Cài đặt, API, và các ghi chú cấu hình cho Next.js.</span></span>
</a>
<a class="link-card dl" href="https://vitest.dev/api/expect.html" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">Vitest — expect</span><span class="lc-sub">Mọi matcher, gồm cả những cái bất đồng bộ mà bẫy này nói tới.</span></span>
</a>


<div class="callout warn"><p><strong>Đo trên Next.js 16.4.6: mã của bài qua bài test mà rớt kiểm kiểu.</strong> Với <code>formatVND(n)</code> không khai kiểu, <code>npx vitest run</code> in <code>1 passed</code> còn <code>npx tsc --noEmit</code> in <code>TS7006: Parameter &#39;n&#39; implicitly has an &#39;any&#39; type</code>. Vitest chỉ biến đổi TypeScript — không bao giờ kiểm kiểu. Mã ở trên giờ ghi <code>n: number</code>; hãy chạy <code>tsc</code> cạnh bài test.</p></div>
<h3>🔬 Đo thật: cài đặt, ca mép, bài test nói dối, Route Handler (Next.js 16.4.6 · Vitest 5.1.0 · Vite 8)</h3>
<p><strong>1 · Cài trên dự án create-next-app mới</strong> — dòng cài trên nextjs.org báo lỗi, vì dự án ghi <code>@types/node ^20</code> còn Vitest 5 cần <code>^22</code>. Nâng nó trong cùng lệnh (không <code>--force</code>):</p>
<div class="out">$ npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths   # the line from nextjs.org/docs (fresh create-next-app)
npm error code ERESOLVE
npm error Found: @types/node@20.19.43
npm error peerOptional @types/node@"^22.0.0 || &gt;=24.0.0" from vitest@5.1.0
$ npm install -D @types/node@^22 vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom @playwright/test
@playwright/test@1.61.0
@testing-library/react@16.3.3
@types/node@22.20.5
jsdom@31.0.1
vitest@5.1.0
$ npm test 2&gt;&amp;1 | grep -E 'Missing script'
npm error Missing script: "test"</div>
<p><strong>2 · Cấu hình của docs vẫn chạy, kèm một lời nhắc</strong> — Vite 8 tự hiểu <code>paths</code> trong tsconfig: bỏ <code>vite-tsconfig-paths</code> và ghi <code>resolve: {{ tsconfigPaths: true }}</code>:</p>
<div class="out">$ npx vitest run 2&gt;&amp;1 | grep -E 'tsconfig paths|Test Files|Tests |Duration' | cut -c1-150
The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remov
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Duration  726ms (environment 92%, transform 3%, tests 2%, import 1%)</div>
<p><strong>3 · Một ca mép tìm ra lỗi thật trong hàm của bài</strong> — <code>toLocaleString(&#39;vi-VN&#39;)</code> giữ phần thập phân, mà tiền đồng không có xu:</p>
<div class="out">$ npx vitest run src/lib/money.test.ts 2&gt;&amp;1 | grep -E '✓|×|Expected:|Received:|Tests |Duration' | head -8
     × never shows decimals (dong has no cents) 3ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
Expected: "1.235₫"
Received: "1.234,5₫"
      Tests  1 failed | 2 passed (3)
   Duration  687ms (environment 94%, tests 3%, import 1%, transform 1%, worker 1%)</div>
<p>Sửa: <code>n.toLocaleString(&#39;vi-VN&#39;, {{ maximumFractionDigits: 0 }})</code>. Ở chế độ theo dõi, lưu tệp chỉ chạy lại bài liên quan:</p>
<div class="out">$ npx vitest   # watch mode: save a file ⇒ only the affected tests re-run
$ grep -aE 'RERUN|×|Tests |Duration' ~/.rtq-nxj/nen-c19w.log | tr -d '\\033' | sed -E 's/^c(\\[3J)? RERUN/ RERUN/' | cut -c1-90 | head -8
     × never shows decimals (dong has no cents) 4ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
      Tests  1 failed | 2 passed (3)
   Duration  506ms (environment 91%, tests 5%, import 2%, transform 1%, worker 1%)
 FAIL  Tests failed. Watching for file changes...
 RERUN  src/lib/money.ts x1 
      Tests  3 passed (3)
   Duration  40ms</div>
<p><strong>4 · Cái bẫy, đo thật</strong> — <code>save()</code> trả <code>{{ ok: false }}</code> sau 50 ms; bài test của bài (thiếu <code>await</code>) xanh; bản có <code>await</code> và bản <code>expect.assertions(1)</code> đỏ đúng như phải đỏ:</p>
<div class="out">$ npx vitest run src/lib/save.test.ts 2&gt;&amp;1 | grep -E '✓|×|Tests |Duration' | head -4
      Tests  1 passed (1)
   Duration  426ms (environment 93%, transform 4%, import 2%, worker 1%)
$ npx vitest run src/lib/save.test.ts 2&gt;&amp;1 | grep -E '×|expected|Tests ' | head -6
   × saves (awaited) 56ms
   × saves (guarded) 3ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected false to be true // Object.is equality
Error: expected number of assertions to be 1, but got 0
      Tests  2 failed (2)</div>
<p><strong>5 · Next.js: Route Handler là một hàm</strong> — không máy chủ, không trình duyệt: tạo <code>Request</code>, gọi <code>GET()</code>, đọc <code>Response</code> (thêm <code>// @vitest-environment node</code> đầu tệp):</p>
<pre><code class="language-typescript"><span class="tok-comment">// @vitest-environment node</span>
<span class="tok-comment">// app/api/price/route.test.ts — call GET() directly: no server, no browser</span>
import { it, expect } from 'vitest';
import { GET } from './route';
it('returns the discounted total', async () =&gt; {
  const res = await GET(new Request('http://test/api/price?pct=10'));
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ total: 180000 });
});
it('rejects a 90% coupon', async () =&gt; {
  const res = await GET(new Request('http://test/api/price?pct=90'));
  expect(res.status).toBe(400);
});</code></pre>
<div class="out">$ npx vitest run src/app/api/price 2&gt;&amp;1 | grep -E '✓|×|Tests |Duration' | head -4
      Tests  2 passed (2)
   Duration  139ms (transform 45%, tests 32%, import 18%, worker 5%)</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ sed -n '1,12p' src/services/finance/money.test.ts
/**
 * Money-math unit tests (P1-13). Run with the built-in node:test runner
 * via tsx (&#96;npm test&#96;). Pure functions — no DB, no network — so they run
 * fast and deterministically in CI.
 *
 * Guards the invariants that matter for correctness of every balance:
 * decimal-safe arithmetic (never JS floats) and HALF_UP rounding, plus a
 * worked debt-schedule example whose numbers are hand-verifiable.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { round2, sum, pct } from './money.js';
$ npx tsx --test src/services/finance/money.test.ts 2&gt;&amp;1 | grep -E '^ok|^not ok|^# (pass|fail|duration_ms)' | head -7
ok 1 - sum is decimal-safe — 0.1 + 0.2 === 0.3 (no float drift)
ok 2 - round2 rounds to 2 decimal places, HALF_UP
ok 3 - pct converts a percentage to a fraction
ok 4 - computeDebt FLAT_MONTHLY: 12,000,000 @ 1%/mo × 12 matches the worked example
# pass 4
# fail 0
# duration_ms 325.714</div>Phía máy chủ dùng <code>node:test</code> + <code>node:assert</code> có sẵn của Node qua <code>tsx --test</code> — không thư viện nào, cùng sắp xếp–hành động–khẳng định, đúng vào logic tiền bạc rủi ro.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm i -D @types/node@^22 vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
npm pkg set scripts.test="vitest"
npx vitest run &amp;&amp; npx tsc --noEmit      <span class="tok-comment">  # cả hai, mọi lần</span>
npx vitest                               <span class="tok-comment">  # chế độ theo dõi: lưu tệp, bài liên quan chạy lại</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Tiền đầy những ca mép: “1.234,5₫” trên hoá đơn trông như hỏng, và cách làm tròn quyết định ai mất một đồng hàng triệu lần.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">…CI chỉ chạy <code>tsc</code>? Hành vi không bao giờ được kiểm — và bài test thiếu await xanh suốt nhiều năm.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Gửi những đầu vào bạn không ngờ: <code>pct=-10</code>, <code>1e9</code>, <code>abc</code>, <code>NaN</code> — vào một route tin chuỗi truy vấn.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Test đường 400 của mọi handler; await mọi promise (hoặc <code>expect.assertions</code>); thấy mỗi bài test mới đỏ một lần.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-14-2-unit-test" target="_blank" rel="noopener"><span class="lc-ico">🟢</span><span class="lc-body"><span class="lc-title">Node.js · 14.2 — Test đơn vị, hàng giả, và những bài test không kiểm gì</span><span class="lc-sub">Cùng kỷ luật ở phía máy chủ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-16-3-zod" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 16.3 — Validation với Zod</span><span class="lc-sub">Kiểm những đầu vào mà bài test handler gửi</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-19-3-react-testing-library" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 19.3 — Test component</span><span class="lc-sub">Giữa tháp</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Vitest</span><span class="v">Một test runner nhanh, hợp Vite, cho unit test.</span></div>
  <div class="kv"><span class="k">test / it</span><span class="v">Định nghĩa một ca test.</span></div>
  <div class="kv"><span class="k">expect</span><span class="v">Đưa ra một khẳng định về một giá trị.</span></div>
  <div class="kv"><span class="k">Matcher</span><span class="v"><code>toBe</code>, <code>toEqual</code>... kiểm khẳng định.</span></div>
  <div class="kv"><span class="k">Watch mode</span><span class="v">Chạy lại test khi file đổi trong lúc phát triển.</span></div>
  <div class="kv"><span class="k">Hàm thuần</span><span class="v">Thứ dễ unit test nhất — vào input, ra output.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Vitest là một test runner nhanh: viết ca bằng <code>test</code>/<code>it</code> và khẳng định bằng <code>expect(...)</code> và matcher.</li><li>Hàm thuần dễ unit test nhất — cùng input, cùng output.</li><li>Watch mode chạy lại các test bị ảnh hưởng khi bạn sửa.</li><li>Unit test là đáy rộng của kim tự tháp test.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://vitest.dev/guide/" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">vitest.dev — Guide</span><span class="lc-sub">describe/it/expect, matcher, và chạy test.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 19.3 ─────────────────────────── */
    {
      title: '19.3 — Component tests: test like a user|||19.3 — Test component: test như người dùng',
      slug: 'nextjs-19-3-react-testing-library',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'React Testing Library render component trong bộ nhớ rồi cho bạn tìm phần tử theo cách người dùng thấy (nhãn, chữ, vai trò) và giả lập click/gõ. Nguyên tắc vàng: test HÀNH VI người dùng thấy, không test chi tiết bên trong.',
      content: `
${G19_3}
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Lesson 19.3</span>
<h2>Test what the user sees and does, not the internals</h2>
<p class="lead">Unit tests are great for pure functions, but components have UI and interaction. <strong>React Testing Library (RTL)</strong> renders a component in memory and lets you interact with it the way a real user would — find things by their visible text or role, click them, type into them, and assert on what appears.</p>

<pre><code class="language-javascript">import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

it('increments when the button is clicked', async () =&gt; {
  render(&lt;Counter /&gt;);

  <span class="tok-comment">// find the button the way a user would — by its visible label</span>
  const button = screen.getByRole('button', { name: /count/i });
  await userEvent.click(button);

  <span class="tok-comment">// assert on what the user now sees</span>
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">render(...)</span><span class="v">Mounts the component in a fake DOM in memory — no real browser needed.</span></div>
  <div class="kv"><span class="k">screen.getByRole / getByText</span><span class="v">Finds elements the way a person or screen reader does: by role ("button"), label, or visible text. Not by internal class names or ids.</span></div>
  <div class="kv"><span class="k">userEvent</span><span class="v">Simulates real interactions — click, type, tab — closer to a human than firing raw events.</span></div>
  <div class="kv"><span class="k">toBeInTheDocument()</span><span class="v">Asserts the element is actually on screen.</span></div>
</div>

<h3>The golden rule: test behaviour, not implementation</h3>
<p>RTL is opinionated on purpose: query by what the user perceives (text, roles, labels), not by internal details (a component's state variable, a CSS class). Why? If you test "the button says Count: 1 after a click," you can rewrite the component's internals freely and the test still passes — it only fails if the <em>behaviour</em> breaks. Test the internals and every refactor breaks your tests even when nothing is actually wrong. As the RTL motto goes: <em>the more your tests resemble the way your software is used, the more confidence they give you.</em></p>

<div class="callout warn">
<p><strong>A bonus: querying by role makes you check accessibility.</strong> If <code>getByRole('button', { name: ... })</code> cannot find your button, often it is because the markup is not accessible (a clickable <code>div</code> instead of a real <code>&lt;button&gt;</code>). Writing tests this way nudges you toward markup that screen readers can use too.</p>
</div>

<h3>Testing a component the way a user meets it</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Render it, then query like a person</b> — &#96;getByRole(&#39;button&#39;, { name: &#39;Save&#39; })&#96; — by what it is and what it says, not by a class name or a test id.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Interact with userEvent</b> — It fires the full sequence a real interaction produces: focus, keydown, input, change. &#96;fireEvent&#96; skips most of it.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Assert what changed on screen</b> — The new text, the disabled button, the error message. Not internal state, which the user never sees.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Await what is asynchronous</b> — &#96;findBy&#96; queries and &#96;waitFor&#96; retry until the DOM settles, instead of guessing with a timeout.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — reaching for &#96;getByTestId&#96; when a query by role fails.</strong> It makes the test pass and quietly removes the thing the test was proving. &#96;getByRole(&#39;button&#39;)&#96; failing usually means the element is not a button — a clickable &#96;div&#96;, or a button with no accessible name — which is a real accessibility bug the query just found for you. Swapping in a test id hides it, and the component ships unreachable by keyboard and unreadable by a screen reader. Fix the markup instead; the test then passes for the right reason. Keep test ids for the rare element that genuinely has no accessible identity.</p></div>
<a class="link-card dl" href="https://testing-library.com/docs/queries/about#priority" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">Testing Library — Query priority</span><span class="lc-sub">The recommended order, with the reasoning for why role comes first.</span></span>
</a>
<a class="link-card dl" href="https://testing-library.com/docs/user-event/intro" target="_blank" rel="noopener">
  <span class="lc-ico">🖱️</span>
  <span class="lc-body"><span class="lc-title">user-event</span><span class="lc-sub">Why it is preferred over fireEvent, with the event sequences it produces.</span></span>
</a>


<div class="callout warn"><p><strong>Measured: the test above, run as written, is red.</strong> <code>toBeInTheDocument</code> is not part of Vitest — it comes from <code>@testing-library/jest-dom</code>, which must be loaded by a setup file (and RTL needs <code>cleanup()</code> after each test when Vitest globals are off):</p>
<div class="out">$ npx vitest run src/app/dem 2&gt;&amp;1 | grep -E '×|✓|Invalid|Tests ' | head -4
   × increments when the button is clicked 447ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
Error: Invalid Chai property: toBeInTheDocument
      Tests  1 failed (1)
$ npx next typegen &gt;/dev/null 2&gt;&amp;1; npx tsc --noEmit 2&gt;&amp;1 | grep -E 'Counter' | cut -c1-120 | head -2
src/app/dem/Counter.test.tsx(12,40): error TS2339: Property 'toBeInTheDocument' does not exist on type 'Assertion&lt;void, </div>
<pre><code class="language-typescript"><span class="tok-comment">// vitest.setup.ts — adds toBeInTheDocument &amp; co., and unmounts between tests</span>
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
afterEach(() =&gt; cleanup());</code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// vitest.config.mts</span>
test: { environment: 'jsdom', setupFiles: ['./vitest.setup.ts'] }</code></pre>
<div class="out">$ npx vitest run src/app/dem/Counter.test.tsx 2&gt;&amp;1 | grep -E '×|✓|Tests |Duration' | head -4
      Tests  1 passed (1)
   Duration  2.59s (environment 70%, setup 16%, import 6%, transform 4%, tests 4%)
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi</div></div>
<h3>🔬 Measured: role queries, real events, waiting, async Server Components (React 19.3 · Testing Library 16.3 · Chromium)</h3>
<p><strong>1 · A role query found an accessibility bug</strong> — two elements styled identically: “Save” is a <code>&lt;div onClick&gt;</code>, “Save draft” a <code>&lt;button&gt;</code>. <code>getByRole</code> cannot find the div; in jsdom <em>and</em> in a real Chromium, Tab skips it and Enter only works on the button:</p>
<div class="out">$ npx vitest run src/app/dem/Save.test.tsx --silent=false 2&gt;&amp;1 | grep -E '×|✓|Unable to find|^ *(button|paragraph|Name)|Tab lands|Tests ' | cut -c1-120 | head -10
Tab lands on: &lt;button&gt; "Save draft" · Enter ⇒ div saved 0 · button saved 1
   × finds Save by role 138ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name "Save"
  button:
  Name "Save draft":
  paragraph:
  Name "":
      Tests  1 failed | 2 passed (3)</div>
<p>Switching to <code>getByTestId</code> made that test pass (2 passed) and left keyboard users locked out. Fix the markup instead.</p>
<p><strong>2 · userEvent vs fireEvent</strong> — a name field that blocks digits in <code>onKeyDown</code>; events counted on the input:</p>
<div class="out">$ npx vitest run src/app/dem/Name.test.tsx --silent=false 2&gt;&amp;1 | grep -E '×|✓|→ value|Tests ' | head -6
fireEvent.change → value "An123" events {"change":1}
userEvent.type   → value "An" events {"focus":1,"keydown":5,"input":2,"keyup":5}
   × fireEvent.change 40ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
     11|   console.log('fireEvent.change → value', JSON.stringify((box as HTMLI…
      Tests  1 failed | 1 passed (2)</div>
<p><strong>3 · Waiting, and an async Server Component</strong> — <code>Hello</code> shows its text after 300 ms; <code>Profile</code> is <code>async function Profile()</code>:</p>
<div class="out">$ npx vitest run src/app/dem/Async.test.tsx 2&gt;&amp;1 | grep -E '^ *×|is an async Client|Unable to find|Tests ' | sed -E 's/(Only Server Components can be async at the moment\\.).*/\\1/; s/(Hello, An\\.).*/\\1/' | head -8
&lt;Profile&gt; is an async Client Component. Only Server Components can be async at the moment.
   × getByText right away 34ms
   × render(&lt;Profile /&gt;) — an async Server Component 1005ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
TestingLibraryElementError: Unable to find an element with the text: Hello, An.
TestingLibraryElementError: Unable to find role="heading"
      Tests  2 failed | 2 passed (4)</div>
<p><code>findByText</code> passed; <code>render(await Profile())</code> passed. In jsdom every component is a Client Component, and React refuses async ones — call the Server Component, await it, render the JSX it returned (or cover it end to end, 19.4).</p>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -rlE "onClick=\\{" src --include=*.tsx | xargs grep -lE "&lt;div[^&gt;]*onClick=" | wc -l | sed 's/^ */tệp .tsx có &lt;div … onClick=: /'
tệp .tsx có &lt;div … onClick=: 60
$ grep -rhoE "&lt;div[^&gt;]*onClick=[^&gt;]*&gt;" src --include=*.tsx | grep -vcE 'role=|tabIndex' | sed 's/^/thẻ &lt;div onClick&gt; KHÔNG role, KHÔNG tabIndex: /'
thẻ &lt;div onClick&gt; KHÔNG role, KHÔNG tabIndex: 74
$ grep -rhoE "data-testid=" src --include=*.tsx | wc -l | sed 's/^ */data-testid trong src: /'
data-testid trong src: 787</div>Dozens of clickable divs with no role and no <code>tabIndex</code> — exactly what the first role-based component tests would list.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm i -D @testing-library/user-event @testing-library/jest-dom
<span class="tok-comment"># vitest.setup.ts: import "@testing-library/jest-dom/vitest" + afterEach(cleanup); add it to setupFiles</span>
npx vitest run src/app --silent=false <span class="tok-comment">  # see console.log of passing tests too</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">Not everyone uses a mouse: keyboard users, screen readers, a broken trackpad. A clickable div locks them out of the one button that matters.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">…the test fakes input with <code>fireEvent</code>? It puts “An123” into a digits-blocked box — a green test about behaviour no user can produce.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Client-side checks are suggestions: the digit filter lives in the browser, and a script or <code>curl</code> sends anything.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Real elements (button, label); <code>getByRole</code> first; <code>userEvent</code> in tests; validate again on the server (16.3).</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-9-1-testing-library" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 9.1 — Testing Library basics</span><span class="lc-sub">Queries by role and user-event, in depth</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-16-3-zod" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 16.3 — Validation with Zod</span><span class="lc-sub">The server-side check behind every client filter</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-19-4-playwright-e2e" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 19.4 — End-to-end with Playwright</span><span class="lc-sub">Server Components in a real browser</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Render a component and query it by role/text (<code>getByRole</code>, <code>getByText</code>) instead of by test id or class.</li>
<li>Simulate a user with <code>user-event</code> (type, click) and assert the resulting UI.</li>
<li>Write a test that fails if a button's accessible name is missing.</li>
</ol>
<p><strong>Done when:</strong> you can test a component the way a user interacts with it.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">React Testing Library</span><span class="v">Tests components through their rendered output.</span></div>
  <div class="kv"><span class="k">getByRole/getByText</span><span class="v">Query the DOM the way a user/assistive tech would.</span></div>
  <div class="kv"><span class="k">user-event</span><span class="v">Simulates realistic user interactions.</span></div>
  <div class="kv"><span class="k">Test behaviour</span><span class="v">Assert what the user sees, not internal state.</span></div>
  <div class="kv"><span class="k">Accessible queries</span><span class="v">Role/label queries double as accessibility checks.</span></div>
  <div class="kv"><span class="k">Avoid test ids</span><span class="v">Prefer semantic queries over brittle selectors.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>React Testing Library tests components through their output, the way a user experiences them.</li><li>Query by role and text (<code>getByRole</code>, <code>getByText</code>), not by test ids or classes.</li><li>Drive interactions with <code>user-event</code> and assert the resulting UI.</li><li>Accessible queries double as accessibility checks.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://testing-library.com/docs/react-testing-library/intro/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">React Testing Library</span><span class="lc-sub">Queries, userEvent, and testing behaviour over implementation.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 19 · Bài 19.3</span>
<h2>Test cái người dùng thấy và làm, không phải bên trong</h2>
<p class="lead">Unit test tuyệt cho hàm thuần, nhưng component có UI và tương tác. <strong>React Testing Library (RTL)</strong> render một component trong bộ nhớ và cho bạn tương tác với nó như một người dùng thật — tìm thứ theo chữ hoặc vai trò hiện thấy, bấm chúng, gõ vào chúng, và khẳng định về cái hiện ra.</p>

<pre><code class="language-javascript">import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

it('tăng khi nút được bấm', async () =&gt; {
  render(&lt;Counter /&gt;);

  <span class="tok-comment">// tìm nút theo cách người dùng — bằng nhãn hiện thấy</span>
  const button = screen.getByRole('button', { name: /count/i });
  await userEvent.click(button);

  <span class="tok-comment">// khẳng định về cái người dùng giờ thấy</span>
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">render(...)</span><span class="v">Gắn component vào một DOM giả trong bộ nhớ — không cần trình duyệt thật.</span></div>
  <div class="kv"><span class="k">screen.getByRole / getByText</span><span class="v">Tìm phần tử theo cách một người hay trình đọc màn hình làm: theo vai trò ("button"), nhãn, hoặc chữ hiện thấy. Không theo tên class hay id nội bộ.</span></div>
  <div class="kv"><span class="k">userEvent</span><span class="v">Giả lập tương tác thật — bấm, gõ, tab — gần với con người hơn là bắn sự kiện thô.</span></div>
  <div class="kv"><span class="k">toBeInTheDocument()</span><span class="v">Khẳng định phần tử thật sự có trên màn hình.</span></div>
</div>

<h3>Nguyên tắc vàng: test hành vi, không test bên trong</h3>
<p>RTL có chủ kiến có chủ đích: truy theo cái người dùng cảm nhận (chữ, vai trò, nhãn), không theo chi tiết nội bộ (một biến state của component, một class CSS). Vì sao? Nếu bạn test "nút hiện Count: 1 sau một cú bấm", bạn có thể viết lại bên trong component thoải mái và test vẫn đạt — nó chỉ rớt nếu <em>hành vi</em> hỏng. Test bên trong thì mỗi lần refactor lại làm rớt test dù không có gì thật sự sai. Như phương châm RTL: <em>test càng giống cách phần mềm được dùng, chúng càng cho bạn nhiều tự tin.</em></p>

<div class="callout warn">
<p><strong>Một điểm cộng: truy theo vai trò buộc bạn kiểm trợ năng.</strong> Nếu <code>getByRole('button', { name: ... })</code> không tìm thấy nút của bạn, thường là vì markup không có trợ năng (một <code>div</code> bấm được thay vì một <code>&lt;button&gt;</code> thật). Viết test kiểu này đẩy bạn tới markup mà trình đọc màn hình cũng dùng được.</p>
</div>

<h3>Kiểm thử một component theo cách người dùng gặp nó</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Vẽ nó ra, rồi truy vấn như một con người</b> — &#96;getByRole(&#39;button&#39;, { name: &#39;Lưu&#39; })&#96; — theo cái nó LÀ và cái nó NÓI, không theo tên class hay một test id.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Tương tác bằng userEvent</b> — Nó bắn ra đầy đủ chuỗi sự kiện mà một tương tác thật sinh ra: focus, keydown, input, change. &#96;fireEvent&#96; bỏ qua phần lớn trong số đó.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Khẳng định thứ đã đổi TRÊN MÀN HÌNH</b> — Đoạn chữ mới, cái nút bị khoá, thông điệp lỗi. Đừng khẳng định state nội bộ, thứ người dùng chẳng bao giờ thấy.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Hãy await những thứ bất đồng bộ</b> — Các truy vấn &#96;findBy&#96; và &#96;waitFor&#96; sẽ thử lại cho tới khi DOM ổn định, thay vì đoán mò bằng một khoảng chờ.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — với tay lấy &#96;getByTestId&#96; khi một truy vấn theo vai trò bị hỏng.</strong> Nó làm bài kiểm thử qua được và lặng lẽ gỡ đi đúng cái thứ mà bài kiểm thử đang chứng minh. &#96;getByRole(&#39;button&#39;)&#96; hỏng thường có nghĩa là phần tử đó KHÔNG phải một cái nút — một &#96;div&#96; bấm được, hoặc một nút không có tên tiếp cận được — và đó là một lỗi khả năng tiếp cận thật mà truy vấn vừa tìm ra giùm bạn. Thay bằng một test id là giấu nó đi, và component lên production ở dạng không với tới được bằng bàn phím và không đọc được bằng trình đọc màn hình. Hãy sửa cái markup; khi đó bài kiểm thử qua vì đúng lý do. Hãy để dành test id cho những phần tử hiếm hoi thật sự không có danh tính tiếp cận được.</p></div>
<a class="link-card dl" href="https://testing-library.com/docs/queries/about#priority" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">Testing Library — Thứ tự ưu tiên truy vấn</span><span class="lc-sub">Thứ tự được khuyến nghị, kèm lý do vì sao vai trò đứng đầu.</span></span>
</a>
<a class="link-card dl" href="https://testing-library.com/docs/user-event/intro" target="_blank" rel="noopener">
  <span class="lc-ico">🖱️</span>
  <span class="lc-body"><span class="lc-title">user-event</span><span class="lc-sub">Vì sao nó được ưa hơn fireEvent, kèm các chuỗi sự kiện nó sinh ra.</span></span>
</a>


<div class="callout warn"><p><strong>Đo thật: bài test ở trên, chạy nguyên văn, là đỏ.</strong> <code>toBeInTheDocument</code> không thuộc Vitest — nó đến từ <code>@testing-library/jest-dom</code>, phải được nạp bằng một tệp setup (và RTL cần <code>cleanup()</code> sau mỗi bài khi Vitest không bật globals):</p>
<div class="out">$ npx vitest run src/app/dem 2&gt;&amp;1 | grep -E '×|✓|Invalid|Tests ' | head -4
   × increments when the button is clicked 447ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
Error: Invalid Chai property: toBeInTheDocument
      Tests  1 failed (1)
$ npx next typegen &gt;/dev/null 2&gt;&amp;1; npx tsc --noEmit 2&gt;&amp;1 | grep -E 'Counter' | cut -c1-120 | head -2
src/app/dem/Counter.test.tsx(12,40): error TS2339: Property 'toBeInTheDocument' does not exist on type 'Assertion&lt;void, </div>
<pre><code class="language-typescript"><span class="tok-comment">// vitest.setup.ts — adds toBeInTheDocument &amp; co., and unmounts between tests</span>
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
afterEach(() =&gt; cleanup());</code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// vitest.config.mts</span>
test: { environment: 'jsdom', setupFiles: ['./vitest.setup.ts'] }</code></pre>
<div class="out">$ npx vitest run src/app/dem/Counter.test.tsx 2&gt;&amp;1 | grep -E '×|✓|Tests |Duration' | head -4
      Tests  1 passed (1)
   Duration  2.59s (environment 70%, setup 16%, import 6%, transform 4%, tests 4%)
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi</div></div>
<h3>🔬 Đo thật: truy vấn vai trò, sự kiện thật, chờ, Server Component bất đồng bộ (React 19.3 · Testing Library 16.3 · Chromium)</h3>
<p><strong>1 · Truy vấn vai trò tìm ra một lỗi trợ năng</strong> — hai phần tử trông y hệt: “Save” là <code>&lt;div onClick&gt;</code>, “Save draft” là <code>&lt;button&gt;</code>. <code>getByRole</code> không tìm thấy thẻ div; trong jsdom <em>và</em> trên Chromium thật, Tab bỏ qua nó và Enter chỉ ăn ở button:</p>
<div class="out">$ npx vitest run src/app/dem/Save.test.tsx --silent=false 2&gt;&amp;1 | grep -E '×|✓|Unable to find|^ *(button|paragraph|Name)|Tab lands|Tests ' | cut -c1-120 | head -10
Tab lands on: &lt;button&gt; "Save draft" · Enter ⇒ div saved 0 · button saved 1
   × finds Save by role 138ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name "Save"
  button:
  Name "Save draft":
  paragraph:
  Name "":
      Tests  1 failed | 2 passed (3)</div>
<p>Đổi sang <code>getByTestId</code> làm bài test qua (2 passed) và để người dùng bàn phím bị khoá ngoài. Hãy sửa mã giao diện.</p>
<p><strong>2 · userEvent và fireEvent</strong> — một ô tên chặn chữ số trong <code>onKeyDown</code>; đếm sự kiện trên ô nhập:</p>
<div class="out">$ npx vitest run src/app/dem/Name.test.tsx --silent=false 2&gt;&amp;1 | grep -E '×|✓|→ value|Tests ' | head -6
fireEvent.change → value "An123" events {"change":1}
userEvent.type   → value "An" events {"focus":1,"keydown":5,"input":2,"keyup":5}
   × fireEvent.change 40ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
     11|   console.log('fireEvent.change → value', JSON.stringify((box as HTMLI…
      Tests  1 failed | 1 passed (2)</div>
<p><strong>3 · Chờ, và một Server Component bất đồng bộ</strong> — <code>Hello</code> hiện chữ sau 300 ms; <code>Profile</code> là <code>async function Profile()</code>:</p>
<div class="out">$ npx vitest run src/app/dem/Async.test.tsx 2&gt;&amp;1 | grep -E '^ *×|is an async Client|Unable to find|Tests ' | sed -E 's/(Only Server Components can be async at the moment\\.).*/\\1/; s/(Hello, An\\.).*/\\1/' | head -8
&lt;Profile&gt; is an async Client Component. Only Server Components can be async at the moment.
   × getByText right away 34ms
   × render(&lt;Profile /&gt;) — an async Server Component 1005ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
TestingLibraryElementError: Unable to find an element with the text: Hello, An.
TestingLibraryElementError: Unable to find role="heading"
      Tests  2 failed | 2 passed (4)</div>
<p><code>findByText</code> qua; <code>render(await Profile())</code> qua. Trong jsdom mọi component là Client Component, và React không nhận component bất đồng bộ — hãy gọi Server Component, chờ nó, rồi dựng JSX nó trả về (hoặc kiểm end-to-end, 19.4).</p>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -rlE "onClick=\\{" src --include=*.tsx | xargs grep -lE "&lt;div[^&gt;]*onClick=" | wc -l | sed 's/^ */tệp .tsx có &lt;div … onClick=: /'
tệp .tsx có &lt;div … onClick=: 60
$ grep -rhoE "&lt;div[^&gt;]*onClick=[^&gt;]*&gt;" src --include=*.tsx | grep -vcE 'role=|tabIndex' | sed 's/^/thẻ &lt;div onClick&gt; KHÔNG role, KHÔNG tabIndex: /'
thẻ &lt;div onClick&gt; KHÔNG role, KHÔNG tabIndex: 74
$ grep -rhoE "data-testid=" src --include=*.tsx | wc -l | sed 's/^ */data-testid trong src: /'
data-testid trong src: 787</div>Hàng chục thẻ div bấm được không có role, không có <code>tabIndex</code> — đúng thứ mà những component test đầu tiên viết bằng truy vấn vai trò sẽ liệt kê ra.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm i -D @testing-library/user-event @testing-library/jest-dom
<span class="tok-comment"># vitest.setup.ts: import "@testing-library/jest-dom/vitest" + afterEach(cleanup); khai vào setupFiles</span>
npx vitest run src/app --silent=false <span class="tok-comment">  # thấy cả console.log của bài qua</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Không phải ai cũng dùng chuột: người dùng bàn phím, trình đọc màn hình, bàn rê hỏng. Một thẻ div bấm được khoá họ khỏi đúng cái nút quan trọng.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">…bài test giả lập nhập bằng <code>fireEvent</code>? Nó nhét “An123” vào ô chặn chữ số — một bài test xanh về hành vi không người dùng nào tạo ra được.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Kiểm ở trình duyệt chỉ là gợi ý: bộ chặn chữ số nằm trong trình duyệt, và một script hay <code>curl</code> gửi gì cũng được.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Phần tử thật (button, label); <code>getByRole</code> trước; <code>userEvent</code> trong test; kiểm lại ở máy chủ (16.3).</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-9-1-testing-library" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 9.1 — Testing Library căn bản</span><span class="lc-sub">Truy vấn vai trò và user-event, đi sâu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-16-3-zod" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 16.3 — Validation với Zod</span><span class="lc-sub">Phép kiểm phía máy chủ phía sau mọi bộ lọc ở trình duyệt</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-19-4-playwright-e2e" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 19.4 — End-to-end với Playwright</span><span class="lc-sub">Server Component trên trình duyệt thật</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Render một component và query nó theo role/text (<code>getByRole</code>, <code>getByText</code>) thay vì theo test id hay class.</li>
<li>Mô phỏng một người dùng bằng <code>user-event</code> (gõ, click) và khẳng định UI kết quả.</li>
<li>Viết một test thất bại nếu tên truy cập của một nút bị thiếu.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn test được một component theo cách một người dùng tương tác với nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">React Testing Library</span><span class="v">Test component qua output đã render của nó.</span></div>
  <div class="kv"><span class="k">getByRole/getByText</span><span class="v">Query DOM theo cách một người dùng/công nghệ hỗ trợ làm.</span></div>
  <div class="kv"><span class="k">user-event</span><span class="v">Mô phỏng tương tác người dùng thực tế.</span></div>
  <div class="kv"><span class="k">Test hành vi</span><span class="v">Khẳng định cái người dùng thấy, không phải state nội bộ.</span></div>
  <div class="kv"><span class="k">Query truy cập được</span><span class="v">Query role/label kiêm luôn kiểm khả năng truy cập.</span></div>
  <div class="kv"><span class="k">Tránh test id</span><span class="v">Ưu tiên query ngữ nghĩa hơn selector mong manh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>React Testing Library test component qua output của chúng, theo cách một người dùng trải nghiệm.</li><li>Query theo role và text (<code>getByRole</code>, <code>getByText</code>), không theo test id hay class.</li><li>Điều khiển tương tác bằng <code>user-event</code> và khẳng định UI kết quả.</li><li>Query truy cập được kiêm luôn kiểm khả năng truy cập.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://testing-library.com/docs/react-testing-library/intro/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">React Testing Library</span><span class="lc-sub">Query, userEvent, và test hành vi thay vì bên trong.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 19.4 ─────────────────────────── */
    {
      title: '19.4 — End-to-end tests with Playwright|||19.4 — Test end-to-end với Playwright',
      slug: 'nextjs-19-4-playwright-e2e',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'E2e lái một trình duyệt THẬT qua cả một luồng như người dùng: mở trang, gõ, bấm, kiểm kết quả. Playwright viết những kịch bản đó. Chậm nhưng chứng minh thứ thật chạy — dành cho các luồng then chốt.',
      content: `
${G19_4}
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Lesson 19.4</span>
<h2>Drive the real app, top to bottom</h2>
<p class="lead">Unit and component tests check pieces in isolation, in a fake DOM. An <strong>end-to-end (e2e)</strong> test opens a <em>real</em> browser, navigates your running app, and performs a full journey exactly as a user would — proving that all the pieces work together for real. <strong>Playwright</strong> is a popular tool for writing these.</p>

<pre><code class="language-javascript">import { test, expect } from '@playwright/test';

test('a user can log in', async ({ page }) =&gt; {
  await page.goto('/login');
  await page.getByLabel('Email').fill('an@example.com');
  await page.getByLabel('Password').fill(process.env.E2E_PASSWORD!);   <span class="tok-comment">// never a real password in the file</span>
  await page.getByRole('button', { name: 'Log in' }).click();

  <span class="tok-comment">// after login we should land on the dashboard</span>
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome, An')).toBeVisible();
});</code></pre>
<p>Notice it reads like a user's steps: go to the page, type into fields, click the button, check where you ended up. Playwright launches an actual browser (Chromium, Firefox, WebKit), so this catches things unit tests never could — routing, real network, the server and client working together.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Most realistic</span><span class="v">It tests the whole stack the way a user experiences it — the highest confidence a test can give.</span></div>
  <div class="kv"><span class="k">Slowest &amp; flakiest</span><span class="v">Real browsers are slow, and timing/network can make e2e tests occasionally fail for non-bug reasons. So you write few of them.</span></div>
  <div class="kv"><span class="k">Use for critical paths</span><span class="v">Login, signup, checkout, the one flow that must never break. Not for every button.</span></div>
</div>

<div class="callout ok">
<p><strong>How the pyramid pays off:</strong> unit tests tell you <em>which</em> function broke; e2e tests tell you <em>the login flow is broken</em> without saying where. You want both — many precise unit tests to localise bugs, plus a few e2e tests that guarantee the journeys users actually pay you for still work end to end.</p>
</div>

<h3>An end-to-end test, and what it is for</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>It drives a real browser</b> — Real rendering, real navigation, real network. It is the only kind of test that proves the pieces fit together.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Cover the paths that must not break</b> — Sign up, log in, checkout, publish. Five of these are worth more than five hundred component tests.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>It is slow and it is honest</b> — A minute per run instead of a millisecond. Budget for that: E2E on pull requests, unit tests on every save.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Run it against a build</b> — &#96;next build &amp;&amp; next start&#96;. The dev server behaves differently enough that a dev-only pass proves less than it seems.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a flaky test that everyone learns to re-run.</strong> A test that passes four times out of five teaches the team that red means &quot;try again&quot;, and from then on a real failure gets re-run too. The usual cause is a fixed wait — &#96;waitForTimeout(1000)&#96; — which is a bet on how fast the machine is, and CI machines are slower and more variable than yours. Playwright&#39;s assertions auto-wait for a condition, so &#96;expect(locator).toBeVisible()&#96; retries until it is true or the timeout expires. Replace every fixed sleep with a condition, and treat a flake as a bug to fix rather than a nuisance to tolerate.</p></div>
<a class="link-card dl" href="https://playwright.dev/docs/intro" target="_blank" rel="noopener">
  <span class="lc-ico">🎭</span>
  <span class="lc-body"><span class="lc-title">Playwright — Getting started</span><span class="lc-sub">Setup, the test runner, and the trace viewer that shows why a run failed.</span></span>
</a>
<a class="link-card dl" href="https://playwright.dev/docs/best-practices" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">Playwright — Best practices</span><span class="lc-sub">Locators, auto-waiting, and the specific anti-patterns that cause flakes.</span></span>
</a>


<div class="callout warn"><p><strong>Measured on Next.js 16.4.6: a role query for “alert” finds two elements.</strong> Every App Router page contains <code>&lt;div role="alert" id="__next-route-announcer__"&gt;</code> — Next.js announces navigations to screen readers. A test of your own error message with <code>getByRole(&#39;alert&#39;)</code> fails with a strict mode violation:</p>
<div class="out">$ E2E_PASSWORD=… npx playwright test e2e/login.spec.ts
  ✓  1 [chromium] › e2e/login.spec.ts:3:5 › a user can log in (1.2s)
  ✘  2 [chromium] › e2e/login.spec.ts:12:5 › a wrong password shows an error (828ms)
    Error: expect(locator).toHaveText(expected) failed
    Error: strict mode violation: getByRole('alert') resolved to 2 elements:
        1) &lt;p role="alert" class="text-red-600"&gt;Wrong email or password&lt;/p&gt; aka getByText('Wrong email or password')
        2) &lt;div role="alert" aria-live="assertive" id="__next-route-announcer__"&gt;Log in&lt;/div&gt; aka locator('[id="__next-r
  1 failed
  1 passed (3.6s)</div>
<p>Narrow it down and keep the role: <code>page.getByRole(&#39;alert&#39;).filter({{ hasText: &#39;Wrong&#39; }})</code>:</p>
<div class="out">$ E2E_PASSWORD=… npx playwright test e2e/login.spec.ts
  ✓  1 [chromium] › e2e/login.spec.ts:3:5 › a user can log in (556ms)
  ✓  2 [chromium] › e2e/login.spec.ts:12:5 › a wrong password shows an error (1.0s)
  2 passed (3.1s)</div></div>
<h3>🔬 Measured: config, a flaky wait ×10, dev vs build (Playwright 1.61 · Chromium · Next.js 16.4.6)</h3>
<p><strong>1 · The config the lesson&#39;s test needs</strong> — <code>page.goto(&#39;/login&#39;)</code> and <code>toHaveURL(&#39;/dashboard&#39;)</code> resolve against <code>baseURL</code>; <code>webServer</code> starts the built app:</p>
<pre><code class="language-typescript"><span class="tok-comment">// playwright.config.ts — build first, then test the BUILT app (next start)</span>
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:19336', trace: 'retain-on-failure' },
  webServer: { command: 'npx next start -p 19336 -H 127.0.0.1', url: 'http://127.0.0.1:19336/login', reuseExistingServer: false },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});</code></pre>
<p><strong>2 · A fixed wait, ten times</strong> — the login Server Action takes 150–550 ms (like a real server). <code>waitForTimeout(300)</code> then look, versus <code>expect(…).toBeVisible()</code>:</p>
<div class="out">$ E2E_PASSWORD=… npx playwright test e2e/flaky.spec.ts --repeat-each=10
fixed wait: 3 ✓ · 7 ✘ / 10
auto-wait: 10 ✓ · 0 ✘ / 10
  7 failed
  13 passed (7.8s)</div>
<p><strong>3 · Dev server vs build</strong> — the same two tests:</p>
<div class="out">$ E2E_PASSWORD=… npx playwright test e2e/login.spec.ts -c playwright.dev.config.ts   # cold dev server
  ✓  1 [chromium] › e2e/login.spec.ts:3:5 › a user can log in (1.5s)
  ✓  2 [chromium] › e2e/login.spec.ts:12:5 › a wrong password shows an error (1.1s)
  2 passed (6.0s)
$ E2E_PASSWORD=… npx playwright test e2e/login.spec.ts   # built app (next start)
  ✓  1 [chromium] › e2e/login.spec.ts:3:5 › a user can log in (607ms)
  ✓  2 [chromium] › e2e/login.spec.ts:12:5 › a wrong password shows an error (1.1s)
  2 passed (3.1s)</div>
<p><strong>4 · Vitest runs Playwright&#39;s files</strong> — with a Vitest config that has no <code>exclude</code> (as in the docs), its default pattern picks up <code>e2e/*.spec.ts</code>. Add <code>exclude: [&#39;e2e/**&#39;, &#39;node_modules/**&#39;]</code>:</p>
<div class="out">$ npx vitest run 2&gt;&amp;1 | grep -E 'FAIL|did not expect|Test Files' | cut -c1-110 | head -5
 FAIL  e2e/flaky.spec.ts [ e2e/flaky.spec.ts ]
Error: Playwright Test did not expect test.beforeEach() to be called here.
 FAIL  e2e/login.spec.ts [ e2e/login.spec.ts ]
Error: Playwright Test did not expect test() to be called here.
 Test Files  2 failed (2)</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ sed -n '2,3p' e2e/work/00-warmup.spec.ts
 * E2E — làm nóng: &#96;next dev&#96; biên dịch mỗi trang ở lần mở ĐẦU TIÊN (30–90 s/trang trên máy lạnh), làm các spec sau
 * hết giờ chờ một cách ngẫu nhiên. Tệp này chạy trước (tên bắt đầu bằng 00-, chạy tuần tự) và mở sẵn các trang
$ grep -E '"(playwright|@playwright/test)"' package.json ../package.json | sed 's/^ *//'; grep -h "test:e2e" ../package.json | sed 's/^ *//'
../package.json:    "playwright": "^1.61.0",
"test:e2e:work": "tsx --test --test-concurrency=1 frontend/e2e/work/*.spec.ts",
$ grep -rhoE "waitForTimeout\\([0-9_]+\\)" e2e | wc -l | sed 's/^ */waitForTimeout(…) trong frontend\\/e2e: /'
waitForTimeout(…) trong frontend/e2e: 23</div>The end-to-end specs run with the Playwright library under <code>node:test</code>; a warm-up spec exists only because <code>next dev</code> compiles each page on first visit — and fixed sleeps are already there.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm i -D @playwright/test &amp;&amp; npx playwright install chromium
npm run build
E2E_PASSWORD=… npx playwright test               <span class="tok-comment">  # webServer starts next start</span>
npx playwright test --repeat-each=10             <span class="tok-comment">  # measure flakiness before trusting a test</span>
npx playwright show-report</code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">The journeys that pay — sign up, log in, pay — can break while every unit test is green.</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">…red means “re-run”? A test green 3 times out of 10 teaches everyone to retry, until a real failure is retried too.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">A real password in <code>e2e/login.spec.ts</code> lives in Git history forever — and test accounts with real privileges are a classic way in.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Few honest tests against the build; auto-wait, no sleeps; a dedicated test account; secrets from the environment or CI secrets.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/github-actions/learn?lessonSlug=ga-15-1-ci-cho-pr" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">GitHub Actions · 15.1 — CI for pull requests</span><span class="lc-sub">Run these tests on every PR</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-12-1-server-action-la-gi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 12.1 — What a Server Action is</span><span class="lc-sub">The login form this test drives</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-19-5-test-cai-gi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 19.5 — What to test</span><span class="lc-sub">Where end-to-end tests are worth it</span></span></a>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write a Playwright test that opens the app, logs in, and asserts a page element — all in a real browser.</li>
<li>Run it headed once to watch it, then headless in CI mode.</li>
<li>Add one assertion that would catch a broken critical flow (e.g. checkout or submit).</li>
</ol>
<p><strong>Done when:</strong> you can write and run an end-to-end test of a critical user flow.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Playwright</span><span class="v">A tool that drives a real browser for E2E tests.</span></div>
  <div class="kv"><span class="k">End-to-end</span><span class="v">Tests the whole app as a user would use it.</span></div>
  <div class="kv"><span class="k">Headed/headless</span><span class="v">Run with a visible browser or invisibly (CI).</span></div>
  <div class="kv"><span class="k">Selector/locator</span><span class="v">How Playwright finds elements to act on.</span></div>
  <div class="kv"><span class="k">Critical flow</span><span class="v">A path that must never break (login, checkout).</span></div>
  <div class="kv"><span class="k">Flaky test</span><span class="v">An unreliable test — usually timing; wait for conditions, not sleeps.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Playwright drives a real browser to test whole user flows end to end.</li><li>Run tests headed to watch, headless in CI.</li><li>Cover the critical flows that must never break (login, checkout, submit).</li><li>Avoid flakiness by waiting for conditions, not fixed sleeps.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://playwright.dev/docs/intro" target="_blank" rel="noopener">
  <span class="lc-ico">🎬</span>
  <span class="lc-body"><span class="lc-title">playwright.dev — Getting Started</span><span class="lc-sub">Writing browser flows, locators, and assertions.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 19 · Bài 19.4</span>
<h2>Lái app thật, từ đầu tới cuối</h2>
<p class="lead">Unit và component test kiểm các mảnh cô lập, trong một DOM giả. Một test <strong>end-to-end (e2e)</strong> mở một trình duyệt <em>thật</em>, điều hướng app đang chạy của bạn, và thực hiện cả một hành trình đúng như người dùng — chứng minh mọi mảnh làm việc cùng nhau thật sự. <strong>Playwright</strong> là một công cụ phổ biến để viết chúng.</p>

<pre><code class="language-javascript">import { test, expect } from '@playwright/test';

test('người dùng đăng nhập được', async ({ page }) =&gt; {
  await page.goto('/login');
  await page.getByLabel('Email').fill('an@example.com');
  await page.getByLabel('Password').fill(process.env.E2E_PASSWORD!);   <span class="tok-comment">// never a real password in the file</span>
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  <span class="tok-comment">// sau đăng nhập nên tới dashboard</span>
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Chào, An')).toBeVisible();
});</code></pre>
<p>Để ý nó đọc như các bước của người dùng: vào trang, gõ vào trường, bấm nút, kiểm bạn tới đâu. Playwright khởi động một trình duyệt thật (Chromium, Firefox, WebKit), nên nó bắt được những thứ unit test không bao giờ — định tuyến, mạng thật, server và client làm việc cùng nhau.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Thực tế nhất</span><span class="v">Nó test cả stack theo cách người dùng trải nghiệm — sự tự tin cao nhất một test có thể cho.</span></div>
  <div class="kv"><span class="k">Chậm &amp; chập chờn nhất</span><span class="v">Trình duyệt thật thì chậm, và timing/mạng có thể làm e2e test thi thoảng rớt vì lý do không-phải-bug. Nên bạn viết ít.</span></div>
  <div class="kv"><span class="k">Dùng cho đường then chốt</span><span class="v">Đăng nhập, đăng ký, thanh toán, cái luồng không bao giờ được hỏng. Không phải cho mọi nút.</span></div>
</div>

<div class="callout ok">
<p><strong>Kim tự tháp trả công thế nào:</strong> unit test cho bạn biết <em>hàm nào</em> hỏng; e2e test cho biết <em>luồng đăng nhập hỏng</em> mà không nói ở đâu. Bạn muốn cả hai — nhiều unit test chính xác để khoanh vùng bug, cộng vài e2e test bảo đảm các hành trình người dùng thật sự trả tiền cho bạn vẫn chạy từ đầu tới cuối.</p>
</div>

<h3>Một bài kiểm thử đầu-cuối, và nó dùng để làm gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Nó điều khiển một trình duyệt thật</b> — Vẽ thật, điều hướng thật, mạng thật. Đây là loại kiểm thử duy nhất chứng minh được các mảnh ghép khớp với nhau.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Hãy phủ những đường KHÔNG ĐƯỢC PHÉP vỡ</b> — Đăng ký, đăng nhập, thanh toán, xuất bản. Năm cái này đáng giá hơn năm trăm bài kiểm thử component.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Nó chậm và nó thành thật</b> — Một phút mỗi lần chạy thay vì một mili giây. Hãy dự trù cho điều đó: E2E chạy ở pull request, kiểm thử đơn vị chạy ở mỗi lần lưu.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Chạy nó với một bản đã build</b> — &#96;next build &amp;&amp; next start&#96;. Dev server cư xử khác đủ nhiều để một lượt chạy chỉ-ở-dev chứng minh được ít hơn vẻ ngoài của nó.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một bài kiểm thử chập chờn mà cả đội học được cách chạy lại.</strong> Một bài kiểm thử qua bốn trên năm lần sẽ dạy cả đội rằng màu đỏ nghĩa là &quot;thử lại đi&quot;, và từ đó một cú hỏng thật cũng bị chạy lại. Nguyên nhân thường gặp là một khoảng chờ cố định — &#96;waitForTimeout(1000)&#96; — vốn là một canh bạc về tốc độ của máy, mà máy CI thì chậm hơn và thất thường hơn máy bạn. Các phép khẳng định của Playwright tự chờ một điều kiện, nên &#96;expect(locator).toBeVisible()&#96; sẽ thử lại cho tới khi đúng hoặc hết giờ. Hãy thay mọi lệnh ngủ cố định bằng một điều kiện, và coi một lần chập chờn là một lỗi cần sửa chứ không phải một phiền toái phải chịu.</p></div>
<a class="link-card dl" href="https://playwright.dev/docs/intro" target="_blank" rel="noopener">
  <span class="lc-ico">🎭</span>
  <span class="lc-body"><span class="lc-title">Playwright — Bắt đầu</span><span class="lc-sub">Cài đặt, bộ chạy kiểm thử, và trình xem vết cho thấy vì sao một lượt chạy hỏng.</span></span>
</a>
<a class="link-card dl" href="https://playwright.dev/docs/best-practices" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">Playwright — Thực hành tốt</span><span class="lc-sub">Locator, tự chờ, và những mẫu-phản-diện cụ thể gây ra chập chờn.</span></span>
</a>


<div class="callout warn"><p><strong>Đo trên Next.js 16.4.6: truy vấn vai trò “alert” thấy hai phần tử.</strong> Mọi trang App Router đều có <code>&lt;div role="alert" id="__next-route-announcer__"&gt;</code> — Next.js đọc mỗi lần chuyển trang cho trình đọc màn hình. Bài test thông báo lỗi của bạn bằng <code>getByRole(&#39;alert&#39;)</code> rớt với lỗi strict mode:</p>
<div class="out">$ E2E_PASSWORD=… npx playwright test e2e/login.spec.ts
  ✓  1 [chromium] › e2e/login.spec.ts:3:5 › a user can log in (1.2s)
  ✘  2 [chromium] › e2e/login.spec.ts:12:5 › a wrong password shows an error (828ms)
    Error: expect(locator).toHaveText(expected) failed
    Error: strict mode violation: getByRole('alert') resolved to 2 elements:
        1) &lt;p role="alert" class="text-red-600"&gt;Wrong email or password&lt;/p&gt; aka getByText('Wrong email or password')
        2) &lt;div role="alert" aria-live="assertive" id="__next-route-announcer__"&gt;Log in&lt;/div&gt; aka locator('[id="__next-r
  1 failed
  1 passed (3.6s)</div>
<p>Thu hẹp mà vẫn giữ vai trò: <code>page.getByRole(&#39;alert&#39;).filter({{ hasText: &#39;Wrong&#39; }})</code>:</p>
<div class="out">$ E2E_PASSWORD=… npx playwright test e2e/login.spec.ts
  ✓  1 [chromium] › e2e/login.spec.ts:3:5 › a user can log in (556ms)
  ✓  2 [chromium] › e2e/login.spec.ts:12:5 › a wrong password shows an error (1.0s)
  2 passed (3.1s)</div></div>
<h3>🔬 Đo thật: cấu hình, chờ cố định ×10, dev và build (Playwright 1.61 · Chromium · Next.js 16.4.6)</h3>
<p><strong>1 · Cấu hình mà bài test của bài cần</strong> — <code>page.goto(&#39;/login&#39;)</code> và <code>toHaveURL(&#39;/dashboard&#39;)</code> giải theo <code>baseURL</code>; <code>webServer</code> bật app đã build:</p>
<pre><code class="language-typescript"><span class="tok-comment">// playwright.config.ts — build first, then test the BUILT app (next start)</span>
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:19336', trace: 'retain-on-failure' },
  webServer: { command: 'npx next start -p 19336 -H 127.0.0.1', url: 'http://127.0.0.1:19336/login', reuseExistingServer: false },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});</code></pre>
<p><strong>2 · Chờ cố định, mười lần</strong> — Server Action đăng nhập mất 150–550 ms (như máy chủ thật). <code>waitForTimeout(300)</code> rồi nhìn, so với <code>expect(…).toBeVisible()</code>:</p>
<div class="out">$ E2E_PASSWORD=… npx playwright test e2e/flaky.spec.ts --repeat-each=10
fixed wait: 3 ✓ · 7 ✘ / 10
auto-wait: 10 ✓ · 0 ✘ / 10
  7 failed
  13 passed (7.8s)</div>
<p><strong>3 · Máy chủ dev và bản build</strong> — cùng hai bài test:</p>
<div class="out">$ E2E_PASSWORD=… npx playwright test e2e/login.spec.ts -c playwright.dev.config.ts   # cold dev server
  ✓  1 [chromium] › e2e/login.spec.ts:3:5 › a user can log in (1.5s)
  ✓  2 [chromium] › e2e/login.spec.ts:12:5 › a wrong password shows an error (1.1s)
  2 passed (6.0s)
$ E2E_PASSWORD=… npx playwright test e2e/login.spec.ts   # built app (next start)
  ✓  1 [chromium] › e2e/login.spec.ts:3:5 › a user can log in (607ms)
  ✓  2 [chromium] › e2e/login.spec.ts:12:5 › a wrong password shows an error (1.1s)
  2 passed (3.1s)</div>
<p><strong>4 · Vitest chạy nhầm tệp của Playwright</strong> — với cấu hình Vitest không có <code>exclude</code> (như trong docs), mẫu mặc định nhặt cả <code>e2e/*.spec.ts</code>. Thêm <code>exclude: [&#39;e2e/**&#39;, &#39;node_modules/**&#39;]</code>:</p>
<div class="out">$ npx vitest run 2&gt;&amp;1 | grep -E 'FAIL|did not expect|Test Files' | cut -c1-110 | head -5
 FAIL  e2e/flaky.spec.ts [ e2e/flaky.spec.ts ]
Error: Playwright Test did not expect test.beforeEach() to be called here.
 FAIL  e2e/login.spec.ts [ e2e/login.spec.ts ]
Error: Playwright Test did not expect test() to be called here.
 Test Files  2 failed (2)</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ sed -n '2,3p' e2e/work/00-warmup.spec.ts
 * E2E — làm nóng: &#96;next dev&#96; biên dịch mỗi trang ở lần mở ĐẦU TIÊN (30–90 s/trang trên máy lạnh), làm các spec sau
 * hết giờ chờ một cách ngẫu nhiên. Tệp này chạy trước (tên bắt đầu bằng 00-, chạy tuần tự) và mở sẵn các trang
$ grep -E '"(playwright|@playwright/test)"' package.json ../package.json | sed 's/^ *//'; grep -h "test:e2e" ../package.json | sed 's/^ *//'
../package.json:    "playwright": "^1.61.0",
"test:e2e:work": "tsx --test --test-concurrency=1 frontend/e2e/work/*.spec.ts",
$ grep -rhoE "waitForTimeout\\([0-9_]+\\)" e2e | wc -l | sed 's/^ */waitForTimeout(…) trong frontend\\/e2e: /'
waitForTimeout(…) trong frontend/e2e: 23</div>Các spec end-to-end chạy bằng thư viện Playwright dưới <code>node:test</code>; một spec làm nóng tồn tại chỉ vì <code>next dev</code> biên dịch mỗi trang ở lần mở đầu — và đã có sẵn những chỗ ngủ cố định.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm i -D @playwright/test &amp;&amp; npx playwright install chromium
npm run build
E2E_PASSWORD=… npx playwright test               <span class="tok-comment">  # webServer tự bật next start</span>
npx playwright test --repeat-each=10             <span class="tok-comment">  # đo độ chập chờn trước khi tin một bài</span>
npx playwright show-report</code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Những hành trình mang tiền về — đăng ký, đăng nhập, thanh toán — có thể hỏng trong khi mọi unit test vẫn xanh.</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">…đỏ nghĩa là “chạy lại”? Một bài xanh 3 trên 10 lần dạy cả nhóm bấm chạy lại, tới khi lỗi thật cũng bị chạy lại.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Một mật khẩu thật trong <code>e2e/login.spec.ts</code> nằm trong lịch sử Git mãi mãi — và tài khoản test có quyền thật là cửa vào kinh điển.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Ít bài test trung thực trên bản build; tự chờ, không ngủ; tài khoản test riêng; bí mật lấy từ môi trường hoặc secret của CI.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/github-actions/learn?lessonSlug=ga-15-1-ci-cho-pr" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">GitHub Actions · 15.1 — CI cho pull request</span><span class="lc-sub">Chạy các bài test này ở mọi PR</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-12-1-server-action-la-gi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 12.1 — Server Action là gì</span><span class="lc-sub">Form đăng nhập mà bài test này điều khiển</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-19-5-test-cai-gi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 19.5 — Test cái gì</span><span class="lc-sub">End-to-end đáng đặt ở đâu</span></span></a>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết một test Playwright mở app, đăng nhập, và khẳng định một element trên trang — tất cả trong một trình duyệt thật.</li>
<li>Chạy nó dạng headed một lần để xem, rồi headless kiểu CI.</li>
<li>Thêm một khẳng định sẽ bắt một luồng quan trọng bị hỏng (vd thanh toán hoặc submit).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn viết và chạy được một test end-to-end của một luồng người dùng quan trọng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Playwright</span><span class="v">Một công cụ điều khiển một trình duyệt thật cho test E2E.</span></div>
  <div class="kv"><span class="k">End-to-end</span><span class="v">Test cả app như một người dùng sẽ dùng.</span></div>
  <div class="kv"><span class="k">Headed/headless</span><span class="v">Chạy với trình duyệt thấy được hoặc ẩn (CI).</span></div>
  <div class="kv"><span class="k">Selector/locator</span><span class="v">Cách Playwright tìm element để thao tác.</span></div>
  <div class="kv"><span class="k">Luồng quan trọng</span><span class="v">Một đường không bao giờ được hỏng (đăng nhập, thanh toán).</span></div>
  <div class="kv"><span class="k">Test flaky</span><span class="v">Một test không đáng tin — thường do timing; chờ điều kiện, không sleep.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Playwright điều khiển một trình duyệt thật để test cả luồng người dùng end-to-end.</li><li>Chạy test dạng headed để xem, headless trong CI.</li><li>Phủ các luồng quan trọng không bao giờ được hỏng (đăng nhập, thanh toán, submit).</li><li>Tránh flaky bằng cách chờ điều kiện, không dùng sleep cố định.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://playwright.dev/docs/intro" target="_blank" rel="noopener">
  <span class="lc-ico">🎬</span>
  <span class="lc-body"><span class="lc-title">playwright.dev — Getting Started</span><span class="lc-sub">Viết luồng trình duyệt, locator, và assertion.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 19.5 ─────────────────────────── */
    {
      title: '19.5 — What to test — and why type-checking is not enough|||19.5 — Test cái gì — và vì sao type-check là chưa đủ',
      slug: 'nextjs-19-5-test-cai-gi',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Đừng đuổi theo 100% coverage. Test logic rủi ro, đường then chốt, và mọi bug từng gặp. Và bài học thật đắt của cuongthai: TypeScript qua sạch toàn bộ nhưng code vẫn VỠ lúc chạy — chỉ chạy thật mới biết.',
      content: `
${G19_5}
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Lesson 19.5</span>
<h2>Test the things that would actually hurt if they broke</h2>
<p class="lead">You cannot and should not test everything. Chasing 100% coverage wastes time on trivial code and gives false comfort. Spend your testing budget where a bug would cost the most.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Test: risky logic</span><span class="v">Anything with real computation or branching — pricing, permissions, date math, validation. These are where subtle bugs hide.</span></div>
  <div class="kv"><span class="k">Test: critical user paths</span><span class="v">Login, signup, payment, the core flow of your app. One e2e test each.</span></div>
  <div class="kv"><span class="k">Test: every bug you fix</span><span class="v">When you fix a bug, add a test that fails on the old behaviour. That is how a bug never comes back (a "regression test").</span></div>
  <div class="kv"><span class="k">Don't obsess over: trivial code</span><span class="v">A component that only renders static text, a one-line getter. A test there is mostly noise.</span></div>
</div>

<h3>Why tests matter even with TypeScript</h3>
<p>You might think TypeScript's type-checking already catches your bugs. It catches a whole <em>class</em> of them — wrong shapes, misspelled fields — but it only checks types, at compile time. It does not run your code, so it cannot catch a wrong <em>value</em>, a bad calculation, or a runtime failure. Types and tests catch different things; you want both.</p>

<div class="note-ct">
<p><strong>A real, expensive cuongthai.com lesson.</strong> A developer renamed an enum value (<code>CODE</code> → <code>CODE_REVIEW</code>). The change passed the entire pre-push checklist — including <code>tsc</code> type-checking — with zero errors, and still <strong>broke on production</strong>. Why: a database seed script carried its own hand-written copy of the type and type-checked against itself, and the main type-check config excluded that file entirely, so nothing verified it against reality. The only thing that would have caught it was <em>running</em> the seed. The takeaways, now baked into the project's process: a green type-check does not mean the code runs; some breakage is only visible by actually executing the code (a test, or running the script) with real data, not by reading or type-checking it. When code has real behaviour, run it — do not trust that "it compiles" means "it works."</p>
</div>

<div class="callout ok">
<p><strong>Practical starting point:</strong> add unit tests for your trickiest functions, one e2e test for your most important flow, and a regression test each time you fix a bug. That modest set catches most of what hurts, and it grows naturally with the app instead of as a giant upfront chore.</p>
</div>

<h3>Where to spend the testing budget</h3>
<div class="lz-map">
  <div class="lz-stage">Cost rises down the list; so does confidence</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Pure logic — many tests</div><div class="lz-nsub">Validators, formatters, reducers, price calculations. Milliseconds each, and they catch the errors that are easiest to make.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Components — a moderate number</div><div class="lz-nsub">The ones with branching behaviour: an empty state, an error state, a disabled submit. Not every presentational card.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Critical journeys — a few</div><div class="lz-nsub">Sign up, log in, pay. End-to-end, against a build, on every pull request.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Everything else — none, deliberately</div><div class="lz-nsub">A test that never fails and never documents anything is a maintenance cost. Deleting one is a legitimate improvement.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — chasing a coverage percentage instead of covering risk.</strong> A 90% target is met most cheaply by testing the easy 90% — getters, prop pass-through, components with one branch — while the error handling, the race condition and the permission check stay untested because they are hard to set up. The number goes up, the risk does not move, and now every refactor drags a hundred low-value tests behind it. Ask instead which failures would be worst: money, data loss, a security check. Test those first, and let coverage be a symptom rather than a target.</p></div>
<a class="link-card dl" href="https://martinfowler.com/bliki/TestPyramid.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Martin Fowler — Test pyramid</span><span class="lc-sub">The shape this lesson describes, and the argument for it.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/testing" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Testing</span><span class="lc-sub">Setting up Vitest, Jest, Playwright and Cypress with the App Router.</span></span>
</a>


<h3>🔬 Measured: the story replayed, a regression test, coverage that lies (TypeScript 5 · Vitest 5.1 · zustand 5.1)</h3>
<p><strong>1 · Rename an enum; tsc says 0 errors</strong> — the schema now says <code>CODE_REVIEW</code>; the seed keeps its own union with <code>CODE</code>, and <code>tsconfig.json</code> excludes it (as the course&#39;s own backend did). A stand-in database rejects unknown values like a Postgres enum:</p>
<pre><code class="language-typescript"><span class="tok-comment">// lib/content.ts — the schema AFTER the rename: CODE → CODE_REVIEW</span>
export const CONTENT_TYPES = ['VLOG', 'CODE_REVIEW', 'QUIZ'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];
<span class="tok-comment">// a stand-in for the database: like a Postgres enum, it rejects unknown values AT RUNTIME</span>
export function insertPost(p: { title: string; type: ContentType }) {
  if (!CONTENT_TYPES.includes(p.type)) throw new Error(&#96;invalid input value for enum "ContentType": "\${p.type}"&#96;);
  return { id: 1, ...p };
}</code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// prisma/seed.ts — written months ago; it carries its OWN copy of the union</span>
import { insertPost } from '../src/lib/content';
type Kind = 'VLOG' | 'CODE' | 'QUIZ';
const posts: { title: string; type: Kind }[] = [{ title: 'Hello', type: 'VLOG' }, { title: 'Review my PR', type: 'CODE' }];
for (const p of posts) console.log('seeded', insertPost(p as never).id, p.title);</code></pre>
<div class="out">$ grep '"exclude"' tsconfig.json   # like the course's own backend tsconfig
"exclude": ["node_modules","prisma/seed.ts"]
$ npx next typegen &gt;/dev/null 2&gt;&amp;1; npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx tsx prisma/seed.ts 2&gt;&amp;1 | grep -E '^seeded|^Error' | head -3
seeded 1 Hello
Error: invalid input value for enum "ContentType": "CODE"
$ npx tsc --noEmit -p tsconfig.seed.json 2&gt;&amp;1 | cut -c1-120 | head -2
prisma/seed.ts(3,115): error TS2322: Type '"CODE"' is not assignable to type '"VLOG" | "CODE_REVIEW" | "QUIZ"'.</div>
<p>The last command is the fix the repository adopted: import the real type and type-check the excluded file with its own config (<code>npm run typecheck:seed</code>) — and actually run the seed.</p>
<p><strong>2 · A regression test for a real bug</strong> — cuongthai&#39;s auth store flipped <code>isHydrated</code> inside <code>onRehydrateStorage</code>, which runs <em>inside</em> <code>create()</code> before the store variable exists; the error was swallowed and pages showed “Loading…” forever. tsc never complained. The test, red on the old shape, green on the fix:</p>
<pre><code class="language-typescript"><span class="tok-comment">// lib/authStore.test.ts — a REGRESSION test: written for the bug, kept forever</span>
import { it, expect, vi, beforeEach } from 'vitest';
beforeEach(() =&gt; { localStorage.clear(); vi.resetModules(); });
it('isHydrated flips after loading a saved user', async () =&gt; {
  localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { name: 'An' } }, version: 0 }));
  const { useAuthStore } = await import('./authStore');
  await vi.waitFor(() =&gt; expect(useAuthStore.getState().isHydrated).toBe(true), { timeout: 500 });
  expect(useAuthStore.getState().user).toEqual({ name: 'An' });
});
it('isHydrated flips with nothing saved', async () =&gt; {
  const { useAuthStore } = await import('./authStore');
  await vi.waitFor(() =&gt; expect(useAuthStore.getState().isHydrated).toBe(true), { timeout: 500 });
});</code></pre>
<div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx vitest run src/lib/authStore.test.ts 2&gt;&amp;1 | grep -E '✓|×|AssertionError|Tests ' | head -5
   × isHydrated flips after loading a saved user 516ms
   × isHydrated flips with nothing saved 502ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected false to be true // Object.is equality
AssertionError: expected false to be true // Object.is equality
$ npx vitest run src/lib/authStore.test.ts 2&gt;&amp;1 | grep -E '✓|×|AssertionError|Tests ' | head -5
      Tests  2 passed (2)</div>
<p><strong>3 · 100% coverage, and the bug is still there</strong> — the rule is “500.000₫ or more ships free”; the code says <code>total &gt; 500000</code>:</p>
<div class="out">$ npx vitest run src/lib/ship.test.ts --coverage --coverage.include=src/lib/ship.ts 2&gt;&amp;1 | grep -E 'Tests |fully covered|^(Statements|Branches|Lines) ' | head -5
      Tests  1 passed (1)
1 file fully covered.
Statements   : 100% ( 1/1 )
Branches     : 100% ( 2/2 )
Lines        : 100% ( 1/1 )
$ npx vitest run src/lib/ship.test.ts 2&gt;&amp;1 | grep -E '✓|×|^[-+] [0-9]|Tests ' | head -6
   × ships free at exactly 500.000₫ 3ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
- 0
+ 30000
      Tests  1 failed | 1 passed (2)</div>
<div class="note-ct"><strong>In this course&#39;s repository</strong><div class="out">$ grep -n '"exclude"' tsconfig.json; grep -n '"typecheck:seed"' package.json
27:  "exclude": ["node_modules", "dist", "prisma/seed.ts"]
11:    "typecheck:seed": "tsc -p tsconfig.seed.json",
$ git show --stat --format='%h %ad %s' --date=short c9df1705f | cut -c1-100 | grep -vE '^$' | head -5
c9df1705f 2026-11-14 fix(web): isHydrated của authStore không bao giờ lật (setState trong onRehydrat
 docs/so-loi.md                  |  7 +++++++
 frontend/src/app/saved/page.tsx |  8 +++++--
 frontend/src/store/authStore.ts | 46 +++++++++++++++++++++--------------------
 3 files changed, 37 insertions(+), 24 deletions(-)
$ node -e "const s=require('./package.json').scripts.test;const L=new Set(s.split(' ').filter(x=&gt;/\\.test\\.(ts|mjs)$/.test(x)));const all=require('child_process').execSync(\\"find src -name '*.test.ts'\\").toString().trim().split('\\n').filter(f=&gt;!f.endsWith('.db.test.ts'));const miss=all.filter(f=&gt;!L.has(f));console.log('src/ unit test (không cần CSDL):',all.length,'· có trong npm test:',all.length-miss.length,'· KHÔNG có (không bao giờ tự chạy):',miss.length);console.log('ví dụ:',miss.slice(0,3).join(', '))"
src/ unit test (không cần CSDL): 229 · có trong npm test: 137 · KHÔNG có (không bao giờ tự chạy): 92
ví dụ: src/config/dnsDuPhong.test.ts, src/utils/khachDong.test.ts, src/utils/crypto.test.ts</div>The seed fix is in place (<code>typecheck:seed</code>); the <code>isHydrated</code> fix shipped without a test; and the backend&#39;s <code>npm test</code> lists files by hand, so dozens of unit-test files are written and never executed.</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">grep -A3 '"exclude"' tsconfig.json        <span class="tok-comment">  # what does tsc never see?</span>
npx tsc --noEmit -p tsconfig.seed.json       <span class="tok-comment">  # type-check it anyway</span>
npm i -D @vitest/coverage-v8 &amp;&amp; npx vitest run --coverage
<span class="tok-comment"># then write the test at the edge of the rule (exactly 500.000)</span></code></pre>
<h3>🌏 Not learning in a vacuum: real life, what if, the attacker</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Real life</span><span class="v">A green checklist and a broken production — because of a file nobody type-checked (08/08/2026, replayed above).</span></div>
  <div class="kv"><span class="k">❓ What if…</span><span class="v">…the goal is “90% coverage”? It is met with getters and pass-through props while the permission check stays untested.</span></div>
  <div class="kv"><span class="k">🕵️ The attacker</span><span class="v">Attackers live at the edges: exactly the free-shipping threshold, exactly the rate limit, one past the last page. Off-by-one in a rule means free stuff.</span></div>
  <div class="kv"><span class="k">🛡️ Detect &amp; prevent</span><span class="v">Test by risk and at the edges; one regression test per fixed bug; type-check excluded files; run the real thing (seed, build, start); fail CI when a test file is not wired in.</span></div>
</div>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/postgresql/learn?lessonSlug=postgresql-16-1-prisma-migration" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL · 16.1 — Prisma and migrations</span><span class="lc-sub">Enums and migrations, from the database side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-14-2-zustand" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 14.2 — Zustand</span><span class="lc-sub">The store behind the isHydrated bug</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-20-1-build-vs-start" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 20.1 — Build vs start</span><span class="lc-sub">Running the real thing</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">What to test</span><span class="v">Behaviour and critical paths, not implementation details.</span></div>
  <div class="kv"><span class="k">Type-checking</span><span class="v">Catches type mismatches, not logic or runtime bugs.</span></div>
  <div class="kv"><span class="k">Coverage</span><span class="v">A rough guide, not a goal in itself.</span></div>
  <div class="kv"><span class="k">Regression test</span><span class="v">Lock a fixed bug so it cannot return.</span></div>
  <div class="kv"><span class="k">Implementation detail</span><span class="v">Internal state/structure that tests should not depend on.</span></div>
  <div class="kv"><span class="k">Runtime behaviour</span><span class="v">What <code>tsc</code> cannot see — only a running test can.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Test behaviour and critical paths, not implementation details that will change.</li><li>Type-checking is not testing: <code>tsc</code> catches type mismatches, not logic or runtime bugs.</li><li>Every fixed bug deserves a regression test so it cannot come back.</li><li>Coverage is a rough guide, not the goal — a test that asserts nothing useful is worthless.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://kentcdodds.com/blog/write-tests" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Kent C. Dodds — Write tests. Not too many. Mostly integration.</span><span class="lc-sub">A pragmatic take on what to test and how much.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 19 · Bài 19.5</span>
<h2>Test những thứ mà nếu hỏng sẽ thật sự đau</h2>
<p class="lead">Bạn không thể và không nên test mọi thứ. Đuổi theo 100% coverage phí thời gian vào code tầm thường và cho cảm giác an toàn giả. Hãy tiêu ngân sách test vào nơi một bug sẽ tốn nhất.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Test: logic rủi ro</span><span class="v">Bất cứ gì có tính toán hay rẽ nhánh thật — giá, quyền, toán ngày tháng, validation. Đây là nơi bug tinh vi ẩn náu.</span></div>
  <div class="kv"><span class="k">Test: đường người dùng then chốt</span><span class="v">Đăng nhập, đăng ký, thanh toán, luồng cốt lõi của app. Mỗi cái một e2e test.</span></div>
  <div class="kv"><span class="k">Test: mọi bug bạn sửa</span><span class="v">Khi sửa một bug, thêm một test rớt với hành vi cũ. Đó là cách một bug không bao giờ quay lại (một "regression test").</span></div>
  <div class="kv"><span class="k">Đừng ám ảnh: code tầm thường</span><span class="v">Một component chỉ render chữ tĩnh, một getter một dòng. Test ở đó phần lớn là nhiễu.</span></div>
</div>

<h3>Vì sao test vẫn quan trọng dù có TypeScript</h3>
<p>Bạn có thể nghĩ type-check của TypeScript đã bắt bug giúp mình. Nó bắt cả một <em>loại</em> bug — sai hình dạng, gõ sai tên trường — nhưng nó chỉ kiểm kiểu, lúc biên dịch. Nó không chạy code, nên không bắt được một <em>giá trị</em> sai, một phép tính lỗi, hay một sự cố lúc chạy. Kiểu và test bắt những thứ khác nhau; bạn cần cả hai.</p>

<div class="note-ct">
<p><strong>Một bài học thật, đắt của cuongthai.com.</strong> Một lập trình viên đổi tên một giá trị enum (<code>CODE</code> → <code>CODE_REVIEW</code>). Thay đổi qua sạch toàn bộ checklist trước-push — kể cả type-check <code>tsc</code> — với zero lỗi, và vẫn <strong>vỡ trên production</strong>. Vì sao: một script seed database mang bản chép tay riêng của kiểu và tự kiểm với chính nó, còn config type-check chính lại loại trừ hẳn file đó, nên không gì kiểm nó với thực tế. Thứ duy nhất bắt được nó là <em>chạy</em> seed. Điều rút ra, nay đã ghim vào quy trình dự án: một type-check xanh không có nghĩa code chạy; một số lỗi chỉ hiện khi thật sự thực thi code (một test, hoặc chạy script) với dữ liệu thật, không phải bằng đọc hay type-check. Khi code có hành vi thật, hãy chạy nó — đừng tin "nó biên dịch được" nghĩa là "nó chạy đúng".</p>
</div>

<div class="callout ok">
<p><strong>Điểm khởi đầu thực dụng:</strong> thêm unit test cho các hàm hóc búa nhất, một e2e test cho luồng quan trọng nhất, và một regression test mỗi lần bạn sửa một bug. Bộ khiêm tốn đó bắt phần lớn cái gây đau, và nó lớn tự nhiên theo app thay vì như một việc vặt khổng lồ làm trước.</p>
</div>

<h3>Nên dồn ngân sách kiểm thử vào đâu</h3>
<div class="lz-map">
  <div class="lz-stage">Chi phí tăng dần khi đi xuống; niềm tin cũng vậy</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Logic thuần — nhiều bài kiểm thử</div><div class="lz-nsub">Bộ kiểm dữ liệu, bộ định dạng, reducer, phép tính giá. Mỗi cái vài mili giây, và chúng bắt được những lỗi dễ phạm nhất.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Component — số lượng vừa phải</div><div class="lz-nsub">Những cái có hành vi rẽ nhánh: một trạng thái rỗng, một trạng thái lỗi, một nút gửi bị khoá. Không phải mọi cái thẻ thuần trang trí.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Hành trình tới hạn — vài cái</div><div class="lz-nsub">Đăng ký, đăng nhập, thanh toán. Đầu-cuối, chạy với một bản đã build, ở mọi pull request.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Mọi thứ khác — không, một cách có chủ đích</div><div class="lz-nsub">Một bài kiểm thử chẳng bao giờ hỏng và chẳng ghi lại điều gì là một chi phí bảo trì. Xoá một cái đi là một cải thiện chính đáng.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — đuổi theo một tỷ lệ phủ thay vì phủ lấy rủi ro.</strong> Mục tiêu 90% được đạt rẻ nhất bằng cách kiểm thử đúng 90% dễ nhất — các getter, các phép truyền prop, những component chỉ có một nhánh — trong khi phần xử lý lỗi, cái điều kiện tranh chấp và phép kiểm quyền vẫn không được kiểm vì chúng khó dựng. Con số đi lên, rủi ro đứng yên, và giờ mỗi lần tái cấu trúc lại kéo theo một trăm bài kiểm thử ít giá trị. Thay vào đó hãy hỏi cú hỏng nào là tệ nhất: tiền bạc, mất dữ liệu, một phép kiểm an toàn. Hãy kiểm thử những cái đó trước, và để tỷ lệ phủ là một triệu chứng chứ không phải một mục tiêu.</p></div>
<a class="link-card dl" href="https://martinfowler.com/bliki/TestPyramid.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔺</span>
  <span class="lc-body"><span class="lc-title">Martin Fowler — Kim tự tháp kiểm thử</span><span class="lc-sub">Hình dạng mà bài này mô tả, và lập luận cho nó.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/testing" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Kiểm thử</span><span class="lc-sub">Cài Vitest, Jest, Playwright và Cypress với App Router.</span></span>
</a>


<h3>🔬 Đo thật: tái hiện câu chuyện, một test hồi quy, độ phủ nói dối (TypeScript 5 · Vitest 5.1 · zustand 5.1)</h3>
<p><strong>1 · Đổi tên enum; tsc báo 0 lỗi</strong> — schema giờ ghi <code>CODE_REVIEW</code>; tệp seed giữ union riêng có <code>CODE</code>, và <code>tsconfig.json</code> loại nó ra (như backend của chính khoá này). Một CSDL thay thế từ chối giá trị lạ như enum của Postgres:</p>
<pre><code class="language-typescript"><span class="tok-comment">// lib/content.ts — the schema AFTER the rename: CODE → CODE_REVIEW</span>
export const CONTENT_TYPES = ['VLOG', 'CODE_REVIEW', 'QUIZ'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];
<span class="tok-comment">// a stand-in for the database: like a Postgres enum, it rejects unknown values AT RUNTIME</span>
export function insertPost(p: { title: string; type: ContentType }) {
  if (!CONTENT_TYPES.includes(p.type)) throw new Error(&#96;invalid input value for enum "ContentType": "\${p.type}"&#96;);
  return { id: 1, ...p };
}</code></pre>
<pre><code class="language-typescript"><span class="tok-comment">// prisma/seed.ts — written months ago; it carries its OWN copy of the union</span>
import { insertPost } from '../src/lib/content';
type Kind = 'VLOG' | 'CODE' | 'QUIZ';
const posts: { title: string; type: Kind }[] = [{ title: 'Hello', type: 'VLOG' }, { title: 'Review my PR', type: 'CODE' }];
for (const p of posts) console.log('seeded', insertPost(p as never).id, p.title);</code></pre>
<div class="out">$ grep '"exclude"' tsconfig.json   # like the course's own backend tsconfig
"exclude": ["node_modules","prisma/seed.ts"]
$ npx next typegen &gt;/dev/null 2&gt;&amp;1; npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx tsx prisma/seed.ts 2&gt;&amp;1 | grep -E '^seeded|^Error' | head -3
seeded 1 Hello
Error: invalid input value for enum "ContentType": "CODE"
$ npx tsc --noEmit -p tsconfig.seed.json 2&gt;&amp;1 | cut -c1-120 | head -2
prisma/seed.ts(3,115): error TS2322: Type '"CODE"' is not assignable to type '"VLOG" | "CODE_REVIEW" | "QUIZ"'.</div>
<p>Lệnh cuối là cách kho đã chọn: import kiểu thật và kiểm kiểu tệp bị loại bằng cấu hình riêng (<code>npm run typecheck:seed</code>) — và chạy seed thật.</p>
<p><strong>2 · Một test hồi quy cho lỗi thật</strong> — store đăng nhập của cuongthai lật <code>isHydrated</code> trong <code>onRehydrateStorage</code>, hàm chạy <em>bên trong</em> <code>create()</code> khi biến store chưa tồn tại; lỗi bị nuốt và trang hiện “Đang tải…” mãi. tsc chưa từng kêu. Bài test, đỏ trên khuôn cũ, xanh trên bản sửa:</p>
<pre><code class="language-typescript"><span class="tok-comment">// lib/authStore.test.ts — a REGRESSION test: written for the bug, kept forever</span>
import { it, expect, vi, beforeEach } from 'vitest';
beforeEach(() =&gt; { localStorage.clear(); vi.resetModules(); });
it('isHydrated flips after loading a saved user', async () =&gt; {
  localStorage.setItem('auth-storage', JSON.stringify({ state: { user: { name: 'An' } }, version: 0 }));
  const { useAuthStore } = await import('./authStore');
  await vi.waitFor(() =&gt; expect(useAuthStore.getState().isHydrated).toBe(true), { timeout: 500 });
  expect(useAuthStore.getState().user).toEqual({ name: 'An' });
});
it('isHydrated flips with nothing saved', async () =&gt; {
  const { useAuthStore } = await import('./authStore');
  await vi.waitFor(() =&gt; expect(useAuthStore.getState().isHydrated).toBe(true), { timeout: 500 });
});</code></pre>
<div class="out">$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ npx vitest run src/lib/authStore.test.ts 2&gt;&amp;1 | grep -E '✓|×|AssertionError|Tests ' | head -5
   × isHydrated flips after loading a saved user 516ms
   × isHydrated flips with nothing saved 502ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected false to be true // Object.is equality
AssertionError: expected false to be true // Object.is equality
$ npx vitest run src/lib/authStore.test.ts 2&gt;&amp;1 | grep -E '✓|×|AssertionError|Tests ' | head -5
      Tests  2 passed (2)</div>
<p><strong>3 · Độ phủ 100%, và con bọ vẫn còn</strong> — luật là “từ 500.000₫ trở lên miễn phí ship”; mã ghi <code>total &gt; 500000</code>:</p>
<div class="out">$ npx vitest run src/lib/ship.test.ts --coverage --coverage.include=src/lib/ship.ts 2&gt;&amp;1 | grep -E 'Tests |fully covered|^(Statements|Branches|Lines) ' | head -5
      Tests  1 passed (1)
1 file fully covered.
Statements   : 100% ( 1/1 )
Branches     : 100% ( 2/2 )
Lines        : 100% ( 1/1 )
$ npx vitest run src/lib/ship.test.ts 2&gt;&amp;1 | grep -E '✓|×|^[-+] [0-9]|Tests ' | head -6
   × ships free at exactly 500.000₫ 3ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
- 0
+ 30000
      Tests  1 failed | 1 passed (2)</div>
<div class="note-ct"><strong>Trong kho của chính khoá này</strong><div class="out">$ grep -n '"exclude"' tsconfig.json; grep -n '"typecheck:seed"' package.json
27:  "exclude": ["node_modules", "dist", "prisma/seed.ts"]
11:    "typecheck:seed": "tsc -p tsconfig.seed.json",
$ git show --stat --format='%h %ad %s' --date=short c9df1705f | cut -c1-100 | grep -vE '^$' | head -5
c9df1705f 2026-11-14 fix(web): isHydrated của authStore không bao giờ lật (setState trong onRehydrat
 docs/so-loi.md                  |  7 +++++++
 frontend/src/app/saved/page.tsx |  8 +++++--
 frontend/src/store/authStore.ts | 46 +++++++++++++++++++++--------------------
 3 files changed, 37 insertions(+), 24 deletions(-)
$ node -e "const s=require('./package.json').scripts.test;const L=new Set(s.split(' ').filter(x=&gt;/\\.test\\.(ts|mjs)$/.test(x)));const all=require('child_process').execSync(\\"find src -name '*.test.ts'\\").toString().trim().split('\\n').filter(f=&gt;!f.endsWith('.db.test.ts'));const miss=all.filter(f=&gt;!L.has(f));console.log('src/ unit test (không cần CSDL):',all.length,'· có trong npm test:',all.length-miss.length,'· KHÔNG có (không bao giờ tự chạy):',miss.length);console.log('ví dụ:',miss.slice(0,3).join(', '))"
src/ unit test (không cần CSDL): 229 · có trong npm test: 137 · KHÔNG có (không bao giờ tự chạy): 92
ví dụ: src/config/dnsDuPhong.test.ts, src/utils/khachDong.test.ts, src/utils/crypto.test.ts</div>Bản vá seed đã có (<code>typecheck:seed</code>); bản sửa <code>isHydrated</code> lên mà không kèm test; và <code>npm test</code> phía máy chủ liệt kê tệp bằng tay, nên hàng chục tệp unit test được viết ra mà không bao giờ chạy.</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">grep -A3 '"exclude"' tsconfig.json        <span class="tok-comment">  # tsc không bao giờ nhìn thấy gì?</span>
npx tsc --noEmit -p tsconfig.seed.json       <span class="tok-comment">  # vẫn kiểm kiểu nó</span>
npm i -D @vitest/coverage-v8 &amp;&amp; npx vitest run --coverage
<span class="tok-comment"># rồi viết bài test ở mép luật (đúng 500.000)</span></code></pre>
<h3>🌏 Không học suông: đời thật, giả định, kẻ xấu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🏠 Đời thật</span><span class="v">Checklist xanh mà production hỏng — vì một tệp không ai kiểm kiểu (08/08/2026, tái hiện ở trên).</span></div>
  <div class="kv"><span class="k">❓ Nếu… thì sao</span><span class="v">…mục tiêu là “90% độ phủ”? Người ta đạt bằng getter và props truyền thẳng, còn phép kiểm quyền thì bỏ trống.</span></div>
  <div class="kv"><span class="k">🕵️ Góc kẻ xấu</span><span class="v">Kẻ xấu sống ở các mép: đúng ngưỡng miễn phí ship, đúng giới hạn tốc độ, quá trang cuối một trang. Lệch một đơn vị trong luật là có đồ miễn phí.</span></div>
  <div class="kv"><span class="k">🛡️ Nhận ra &amp; phòng</span><span class="v">Test theo rủi ro và ở mép; mỗi lỗi đã sửa một test hồi quy; kiểm kiểu tệp bị loại; chạy thứ thật (seed, build, start); cho CI đỏ khi có tệp test không được gắn vào.</span></div>
</div>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/postgresql/learn?lessonSlug=postgresql-16-1-prisma-migration" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL · 16.1 — Prisma và migration</span><span class="lc-sub">Enum và migration, nhìn từ phía CSDL</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-14-2-zustand" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 14.2 — Zustand</span><span class="lc-sub">Cái store đứng sau lỗi isHydrated</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-20-1-build-vs-start" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 20.1 — Build vs start</span><span class="lc-sub">Chạy thứ thật</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Test cái gì</span><span class="v">Hành vi và đường quan trọng, không phải chi tiết hiện thực.</span></div>
  <div class="kv"><span class="k">Kiểm kiểu</span><span class="v">Bắt lệch kiểu, không bắt logic hay bug lúc chạy.</span></div>
  <div class="kv"><span class="k">Coverage</span><span class="v">Một chỉ dẫn thô, không phải mục tiêu tự thân.</span></div>
  <div class="kv"><span class="k">Test regression</span><span class="v">Khoá một bug đã sửa để nó không quay lại.</span></div>
  <div class="kv"><span class="k">Chi tiết hiện thực</span><span class="v">State/cấu trúc nội bộ mà test không nên phụ thuộc.</span></div>
  <div class="kv"><span class="k">Hành vi lúc chạy</span><span class="v">Cái <code>tsc</code> không thấy — chỉ một test đang chạy mới thấy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Test hành vi và đường quan trọng, không phải chi tiết hiện thực sẽ đổi.</li><li>Kiểm kiểu không phải test: <code>tsc</code> bắt lệch kiểu, không bắt logic hay bug lúc chạy.</li><li>Mỗi bug đã sửa đáng có một test regression để nó không quay lại.</li><li>Coverage là chỉ dẫn thô, không phải mục tiêu — một test không khẳng định gì hữu ích thì vô giá trị.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://kentcdodds.com/blog/write-tests" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Kent C. Dodds — Write tests. Not too many. Mostly integration.</span><span class="lc-sub">Góc nhìn thực dụng về test cái gì và bao nhiêu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 19.6 QUIZ ─────────────────────────── */
    {
      title: '19.6 — Chapter 19 quiz|||19.6 — Kiểm tra chương 19',
      slug: 'nextjs-19-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về testing: test là gì + lợi ích, tháp kiểm thử, unit test với Vitest (assertion, hàm thuần), RTL test-như-người-dùng, Playwright e2e, test cái gì, và vì sao type-check chưa đủ (bài học enum seed).',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 19: what a test is and its benefits, the testing pyramid, unit tests with Vitest, React Testing Library, Playwright e2e, what to test, and why type-checking is not enough.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 19: test là gì và lợi ích, tháp kiểm thử, unit test với Vitest, React Testing Library, Playwright e2e, test cái gì, và vì sao type-check chưa đủ.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is the main value of having automated tests?|||Giá trị chính của việc có test tự động là gì?',
            options: [
              'they make the app run faster|||chúng làm app chạy nhanh hơn',
              'confidence to change code — you instantly know if you broke something|||tự tin đổi code — biết ngay có làm hỏng gì không',
              'they replace TypeScript|||chúng thay TypeScript',
              'they are required to deploy|||bắt buộc để deploy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In the testing pyramid, which are most numerous and fastest?|||Trong tháp kiểm thử, cái nào nhiều nhất và nhanh nhất?',
            options: [
              'end-to-end tests|||test end-to-end',
              'unit tests|||unit test',
              'manual tests|||test thủ công',
              'there is no difference|||không khác gì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In a unit test, what is an "assertion"?|||Trong một unit test, "assertion" là gì?',
            options: [
              'the name of the file|||tên của file',
              'the check that a value equals what you expect, e.g. expect(x).toBe(y)|||phép kiểm một giá trị bằng cái bạn mong, ví dụ expect(x).toBe(y)',
              'a comment|||một chú thích',
              'the import statement|||câu lệnh import',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why are pure functions the easiest thing to unit test?|||Vì sao hàm thuần là thứ dễ unit test nhất?',
            options: [
              'they are shorter|||chúng ngắn hơn',
              'same input → same output, no side effects — just input to output, no setup/mocking|||cùng input → cùng output, không tác dụng phụ — chỉ input tới output, không setup/mock',
              'they run on the server|||chúng chạy trên server',
              'they never have bugs|||chúng không bao giờ có bug',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'React Testing Library encourages you to find elements by…|||React Testing Library khuyến khích bạn tìm phần tử theo…',
            options: [
              'internal CSS class names and ids|||tên class CSS và id nội bộ',
              'what the user perceives: role, label, visible text|||cái người dùng cảm nhận: vai trò, nhãn, chữ hiện thấy',
              'the component\'s state variables|||các biến state của component',
              'line numbers|||số dòng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why test behaviour instead of implementation?|||Vì sao test hành vi thay vì bên trong?',
            options: [
              'it is easier to type|||dễ gõ hơn',
              'you can refactor internals freely and tests only fail if behaviour actually breaks|||bạn refactor bên trong thoải mái và test chỉ rớt nếu hành vi thật sự hỏng',
              'implementation cannot be tested|||bên trong không test được',
              'it runs faster|||nó chạy nhanh hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does an end-to-end (Playwright) test do that unit tests cannot?|||Một test end-to-end (Playwright) làm gì mà unit test không?',
            options: [
              'nothing different|||không gì khác',
              'drives a real browser through a full flow, testing the whole stack together|||lái một trình duyệt thật qua cả một luồng, test cả stack cùng nhau',
              'checks types|||kiểm kiểu',
              'runs faster than unit tests|||chạy nhanh hơn unit test',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'When you fix a bug, a good practice is to…|||Khi bạn sửa một bug, một thực hành tốt là…',
            options: [
              'delete the old tests|||xoá các test cũ',
              'add a test that fails on the old (buggy) behaviour — a regression test|||thêm một test rớt với hành vi cũ (có bug) — một regression test',
              'skip testing that area|||bỏ qua test vùng đó',
              'aim for 100% coverage immediately|||nhắm 100% coverage ngay',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is passing TypeScript type-checking not the same as the code working?|||Vì sao qua type-check TypeScript không đồng nghĩa code chạy đúng?',
            options: [
              'type-checking is unreliable|||type-check không đáng tin',
              'types are checked at compile time and do not run the code — a wrong value or runtime failure slips through|||kiểu được kiểm lúc biên dịch và không chạy code — một giá trị sai hay lỗi runtime lọt qua',
              'TypeScript only checks CSS|||TypeScript chỉ kiểm CSS',
              'they are exactly the same|||chúng y hệt nhau',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The cuongthai.com enum-rename incident (passed tsc, broke on prod) teaches that…|||Sự cố đổi tên enum của cuongthai.com (qua tsc, vỡ prod) dạy rằng…',
            options: [
              'never rename enums|||đừng bao giờ đổi tên enum',
              'a green type-check does not mean it runs; some breakage is only caught by actually running the code with real data|||type-check xanh không nghĩa nó chạy; một số lỗi chỉ bắt được khi thật sự chạy code với dữ liệu thật',
              'TypeScript should be removed|||nên bỏ TypeScript',
              'production testing is pointless|||test trên production là vô nghĩa',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
