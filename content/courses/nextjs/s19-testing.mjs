/**
 * Next.js & React — Chương 19: Kiểm thử (testing).
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Viết cho người mới — định nghĩa "test", "unit/integration/e2e", "assertion",
 * "mock" khi gặp. Xem [[feedback_nextjs_course_beginner_first]]. Bài học thật
 * cuongthai: tsc qua sạch vẫn vỡ runtime (enum seed) → phải CHẠY mới biết (19.5),
 * nối [[feedback_tsc_does_not_check_prisma_seed]] + [[feedback_verify_by_running_not_reading]].
 */

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
<div class="ml-en">
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

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/testing" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Testing</span><span class="lc-sub">Setting up Vitest, Jest, React Testing Library, Playwright, and Cypress.</span></span>
</a>
</div>

<div class="ml-vi">
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
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Lesson 19.2</span>
<h2>The smallest test: call a function, check the result</h2>
<p class="lead">A unit test takes one piece of code — usually a function — gives it a known input, and checks the output is what you expect. That check is called an <strong>assertion</strong>. <strong>Vitest</strong> (a fast, modern test runner; <strong>Jest</strong> is the older equivalent) gives you the words to write it.</p>

<pre><code><span class="tok-comment">// money.ts — the code under test</span>
export function formatVND(n) {
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
  <div class="kv"><span class="k">Run it</span><span class="v"><code>npm test</code> (or <code>npx vitest</code>) runs every <code>*.test.ts</code> file and prints green (pass) or red (fail).</span></div>
</div>

<h3>Pure functions are the easiest thing to test</h3>
<p>Remember pure functions from Chapter 2 — same input, same output, no side effects? They are the ideal test target: no setup, no database, no mocking, just input → output. When you have tricky logic (a price calculator, a date formatter, a validation rule), pulling it into a small pure function makes it both cleaner <em>and</em> trivial to test. Testable code and good code tend to be the same code.</p>

<div class="callout ok">
<p><strong>A good first habit:</strong> when you write a function with any real logic, write two or three tests for it — the normal case, an edge case (zero, empty, negative), and anything that once broke. It takes a minute and pays back every time you touch that function later.</p>
</div>

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

<pre><code><span class="tok-comment">// money.ts — code cần test</span>
export function formatVND(n) {
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
  <div class="kv"><span class="k">Chạy nó</span><span class="v"><code>npm test</code> (hoặc <code>npx vitest</code>) chạy mọi file <code>*.test.ts</code> và in xanh (đạt) hoặc đỏ (rớt).</span></div>
</div>

<h3>Hàm thuần là thứ dễ test nhất</h3>
<p>Nhớ hàm thuần ở Chương 2 — cùng input, cùng output, không tác dụng phụ? Chúng là mục tiêu test lý tưởng: không setup, không database, không mock, chỉ input → output. Khi bạn có logic hóc búa (một máy tính giá, một bộ định dạng ngày, một luật validation), tách nó thành một hàm thuần nhỏ làm nó vừa sạch hơn <em>vừa</em> dễ test. Code test được và code tốt thường là cùng một code.</p>

<div class="callout ok">
<p><strong>Một thói quen đầu tiên tốt:</strong> khi bạn viết một hàm có logic thật, hãy viết hai ba test cho nó — ca thường, một ca biên (số 0, rỗng, âm), và bất cứ gì từng hỏng. Tốn một phút và trả lại mỗi lần bạn động vào hàm đó sau này.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Lesson 19.3</span>
<h2>Test what the user sees and does, not the internals</h2>
<p class="lead">Unit tests are great for pure functions, but components have UI and interaction. <strong>React Testing Library (RTL)</strong> renders a component in memory and lets you interact with it the way a real user would — find things by their visible text or role, click them, type into them, and assert on what appears.</p>

<pre><code>import { render, screen } from '@testing-library/react';
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

<pre><code>import { render, screen } from '@testing-library/react';
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
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Lesson 19.4</span>
<h2>Drive the real app, top to bottom</h2>
<p class="lead">Unit and component tests check pieces in isolation, in a fake DOM. An <strong>end-to-end (e2e)</strong> test opens a <em>real</em> browser, navigates your running app, and performs a full journey exactly as a user would — proving that all the pieces work together for real. <strong>Playwright</strong> is a popular tool for writing these.</p>

<pre><code>import { test, expect } from '@playwright/test';

test('a user can log in', async ({ page }) =&gt; {
  await page.goto('/login');
  await page.getByLabel('Email').fill('an@example.com');
  await page.getByLabel('Password').fill('secret123');
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

<pre><code>import { test, expect } from '@playwright/test';

test('người dùng đăng nhập được', async ({ page }) =&gt; {
  await page.goto('/login');
  await page.getByLabel('Email').fill('an@example.com');
  await page.getByLabel('Password').fill('secret123');
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
