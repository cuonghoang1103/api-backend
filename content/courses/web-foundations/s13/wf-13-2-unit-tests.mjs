/**
 * Bài 13.2 — Unit test đầu tiên (nâng cấp 01/11/2026). Output: Vitest 5.0.5 / Node 22.23.3, chạy thật trong _demo/_t13.
 * Deck: scripts/slides-src/wf-13-2.mjs (12 slide).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-13-2', 'Your first unit tests', 'Những unit test đầu tiên', [
  [1, 'Your first unit tests',
    '<p>A unit test checks one small piece of code — usually one function — with no browser, no network and no database. This lesson teaches you to write them with Vitest, from installing the tool to reading a failure.</p>',
    '<p>Unit test kiểm một mẩu code nhỏ — thường là một hàm — không trình duyệt, không mạng, không cơ sở dữ liệu. Bài này dạy bạn viết chúng bằng Vitest, từ cài công cụ tới đọc một lần thất bại.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five practical skills. If you remember only one, remember Arrange, Act, Assert: prepare the input, call the code once, check the result. Every test you will ever read follows that shape.</p>',
    '<p>Năm kỹ năng thực tế. Nếu chỉ nhớ một, hãy nhớ Arrange, Act, Assert — chuẩn bị, hành động, khẳng định: chuẩn bị đầu vào, gọi code một lần, kiểm kết quả. Mọi test bạn từng đọc đều theo hình dạng đó.</p>'],
  [3, 'Setting up',
    '<p>Vitest is a development dependency: it is needed while you build, not when users run the app. <code>npm test</code> starts watch mode, which re-runs the affected tests every time you save a file. <code>npx vitest run</code> runs everything once and exits — that is what CI uses.</p>',
    '<p>Vitest là phụ thuộc lúc phát triển: cần khi bạn xây dựng, không cần khi người dùng chạy app. <code>npm test</code> bật chế độ theo dõi, chạy lại các test liên quan mỗi khi bạn lưu file. <code>npx vitest run</code> chạy hết một lần rồi thoát — CI dùng lệnh đó.</p>'],
  [4, 'Anatomy',
    '<p><code>describe</code> groups the tests about one function. Each <code>it</code> is one behaviour, named as a sentence. Inside, three steps: arrange the input, act by calling the code once, and assert with <code>expect</code>. Comments are not required — the blank lines between steps usually say enough.</p>',
    '<p><code>describe</code> gom các test về một hàm. Mỗi <code>it</code> là một hành vi, đặt tên như một câu. Bên trong có ba bước: chuẩn bị đầu vào, gọi code một lần, rồi khẳng định bằng <code>expect</code>. Không bắt buộc có chú thích — dòng trống giữa các bước thường đã đủ rõ.</p>'],
  [5, 'it.each',
    '<p>When the same check runs on many inputs, write a table. Each row is a case; the test body is written once. The four rows here are exactly the boundaries of the shipping rule, and each row appears separately in the report.</p>',
    '<p>Khi cùng một phép kiểm chạy trên nhiều đầu vào, hãy viết một bảng. Mỗi dòng là một trường hợp; thân test viết một lần. Bốn dòng ở đây chính là các giá trị biên của luật tính ship, và mỗi dòng hiện riêng trong báo cáo.</p>'],
  [6, 'Errors are behaviour',
    '<p>Rejecting a bad coupon is part of the contract, so test it. Pass a function to <code>expect</code>, not the result of a call — otherwise the error is thrown before <code>expect</code> even runs, and the test crashes instead of passing.</p>',
    '<p>Từ chối một mã giảm giá sai là một phần của hợp đồng, nên phải test. Đưa một HÀM cho <code>expect</code>, không đưa kết quả của lời gọi — nếu không lỗi bị ném trước cả khi <code>expect</code> chạy, và test sập thay vì qua.</p>'],
  [7, 'The verbose report',
    '<p>With the verbose reporter each test prints on its own line, with the describe name, the it name and the time. The <code>it.each</code> rows show their values. Good names turn this list into a readable specification of the cart.</p>',
    '<p>Với reporter verbose mỗi test in một dòng riêng, gồm tên describe, tên it và thời gian. Các dòng <code>it.each</code> hiện giá trị của chúng. Tên tốt biến danh sách này thành một bản đặc tả đọc được của giỏ hàng.</p>'],
  [8, 'toBe vs toEqual',
    '<p>Two deliberate failures. <code>toBe</code> compares two objects by reference, so two look-alike objects fail. And <code>0.1 + 0.2</code> is not exactly <code>0.3</code> in binary floating point. Vitest even suggests the right matcher in its message.</p>',
    '<p>Hai lần thất bại có chủ đích. <code>toBe</code> so hai object theo tham chiếu, nên hai object trông giống nhau vẫn trượt. Và <code>0.1 + 0.2</code> không đúng bằng <code>0.3</code> trong số thực nhị phân. Vitest còn gợi ý matcher đúng ngay trong thông báo.</p>'],
  [9, 'Reading the failures',
    '<p>Left: "serializes to the same string — no visual difference" means the contents are equal but the objects are not the same object; use <code>toEqual</code>. Right: the diff shows the tiny floating-point error; use <code>toBeCloseTo</code>, or store money as whole numbers.</p>',
    '<p>Trái: "serializes to the same string — no visual difference" nghĩa là nội dung bằng nhau nhưng không phải cùng một object; dùng <code>toEqual</code>. Phải: phần chênh cho thấy sai số số thực rất nhỏ; dùng <code>toBeCloseTo</code>, hoặc lưu tiền bằng số nguyên.</p>'],
  [10, 'Matchers',
    '<p>Seven matchers cover almost everything in this course. The two that cause the most confusion for beginners are already on the previous slides: same reference versus same contents, and exact versus close decimals.</p>',
    '<p>Bảy matcher phủ gần hết những gì khoá này cần. Hai cái gây rối nhất cho người mới đã có ở các slide trước: cùng tham chiếu hay cùng nội dung, và số thực đúng tuyệt đối hay gần đúng.</p>'],
  [11, 'Good test names',
    '<p>When a test turns red, its name is the first thing anyone reads. "works" tells nothing. "free shipping applies AFTER the coupon" tells the reader exactly which requirement is broken, without opening the file.</p>',
    '<p>Khi một test đỏ, tên của nó là thứ đầu tiên mọi người đọc. "works" chẳng nói gì. "free shipping applies AFTER the coupon" cho người đọc biết chính xác yêu cầu nào bị vỡ, không cần mở file.</p>'],
  [12, 'Summary & practice',
    '<p>The grade function is a perfect first exercise: many boundaries, two error cases, and one table. The "Done when" includes breaking your own code on purpose to see the right row turn red — the quickest way to trust a test.</p>',
    '<p>Hàm xếp loại là bài tập đầu tiên hoàn hảo: nhiều giá trị biên, hai trường hợp lỗi, và một bảng. Phần "Xong khi" gồm cả việc cố ý làm hỏng code của chính bạn để thấy đúng dòng chuyển đỏ — cách nhanh nhất để tin một test.</p>'],
]);

export default {
  title: '13.2 — Your first unit tests|||13.2 — Những unit test đầu tiên',
  slug: 'wf-13-2-unit-tests',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Cài Vitest, chạy theo dõi và chạy một lần, describe/it/expect, Arrange-Act-Assert, it.each cho bảng giá trị biên, test lỗi bằng toThrow, toBe vs toEqual, 0.1 + 0.2 và toBeCloseTo, đặt tên test — output Vitest 5.0.5 chạy thật.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>Arrange, Act, Assert — with a real test runner</h2>
<p class="lead">After this lesson you can install Vitest, write tests for plain JavaScript functions, cover a whole table of boundary values in one test, check that errors are thrown, choose the right matcher for numbers, objects and decimals, and read the failure report when something is wrong. Why it matters: unit tests are the cheapest, fastest tests you will ever write — about one millisecond each — and every later chapter of your learning (Node.js services, React components, Next.js routes) builds on exactly these four words: <code>describe</code>, <code>it</code>, <code>expect</code>, <code>toBe</code>.</p>

<h3>Step 1 — install and run</h3>
<pre><code class="language-bash">npm init -y
npm install --save-dev vitest        # this chapter: Vitest 5.0.5 on Node 22
npm test                             # with "test": "vitest" in package.json ⇒ watch mode
npx vitest run                       # run everything once and exit (what CI runs)</code></pre>
<p><code>--save-dev</code> records Vitest as a <strong>development dependency</strong>: needed while you build, never shipped to users. <strong>Watch mode</strong> keeps running and re-runs the affected tests every time you save — leave it open in a terminal next to your editor. Our project's configuration only tells Vitest where tests live:</p>
${ma('javascript', CODE['_t13/vitest.config.js'])}

<h3>Step 2 — the anatomy of a test</h3>
${ma('javascript', CODE['_t13/test/cart.test.js'], [1, 19])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">describe</span><span class="lz-t">a group</span><span class="lz-d">All tests about <code>subtotal</code>. Groups appear in the report as <code>subtotal &gt; …</code>.</span></div>
<div class="lz-step"><span class="lz-k">it</span><span class="lz-t">one behaviour</span><span class="lz-d">Named as a sentence: "adds price × qty for every item".</span></div>
<div class="lz-step"><span class="lz-k">Arrange</span><span class="lz-t">prepare</span><span class="lz-d">The input data — here, two items.</span></div>
<div class="lz-step"><span class="lz-k">Act</span><span class="lz-t">call once</span><span class="lz-d">Exactly one call of the code under test.</span></div>
<div class="lz-step"><span class="lz-k">Assert</span><span class="lz-t">check</span><span class="lz-d"><code>expect(result).toBe(150_000)</code>. If it is false, the test fails.</span></div>
</div>
<p>The underscore in <code>150_000</code> is a numeric separator: JavaScript ignores it, humans read it as 150 000. Test the empty case too — <code>subtotal([])</code> must be 0, not <code>undefined</code> or an error.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — several behaviours in one test.</strong> A test that checks subtotal, then shipping, then the coupon stops at the first failure, so you never learn whether the other two still work, and its name cannot describe everything. One behaviour per <code>it</code>; many small tests run just as fast as one big one.</p></div>

<h3>Step 3 — a table of cases with <code>it.each</code></h3>
${ma('javascript', CODE['_t13/test/cart.test.js'], [21, 30])}
<p>Each row is <code>[input, expected]</code>; Vitest runs the body once per row and fills <code>%i</code> in the name with the row's values. The four rows are chosen deliberately: zero, one đồng below the threshold, exactly the threshold, far above. That is the boundary rule from lesson 13.1 written as code.</p>

<h3>Step 4 — errors are part of the contract</h3>
${ma('javascript', CODE['_t13/test/cart.test.js'], [32, 40])}
<p><code>expect(() =&gt; applyCoupon(100_000, bad)).toThrow(RangeError)</code> passes a <em>function</em>. Vitest calls it inside a try/catch and checks that a <code>RangeError</code> was thrown. The rows cover three different ways to be wrong: too small, too large, not a whole number, and negative.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — calling the function inside <code>expect</code>.</strong> <code>expect(applyCoupon(100_000, 0)).toThrow()</code> runs <code>applyCoupon</code> first, so the error is thrown before <code>expect</code> exists; the test crashes with "RangeError: coupon must be…" instead of passing. Always wrap the call: <code>() =&gt; applyCoupon(…)</code>.</p></div>

<h3>Running it: the verbose report</h3>
${ra(OUT['_t13/out/cart'])}
<p>Every line is one passing test: file › describe › it, then the time. Read the list without the code — it is a specification of the cart. That is what good names buy you.</p>

<h3>Step 5 — choosing the matcher: <code>toBe</code>, <code>toEqual</code>, <code>toBeCloseTo</code></h3>
${ma('javascript', CODE['_t13/demo/matchers.test.js'])}
${ra(OUT['_t13/out/matchers'])}
<p>Two of the five tests fail on purpose, and the messages explain why:</p>
<ul>
<li><strong><code>toBe</code> on objects:</strong> <code>toBe</code> uses <code>Object.is</code> — "the same value", which for objects means <em>the same object</em> (lesson 11.4: reference vs value). Two separately created <code>{ id: 1 }</code> are different objects, so it fails, and Vitest says "serializes to the same string… replace toBe with toStrictEqual". For contents use <code>toEqual</code> (or the stricter <code>toStrictEqual</code>, which also checks <code>undefined</code> properties and classes).</li>
<li><strong>Decimals:</strong> <code>0.1 + 0.2</code> is <code>0.30000000000000004</code> because binary floating point cannot store 0.1 exactly. Use <code>toBeCloseTo(0.3)</code> for real decimals — and for money, store whole units (đồng, cents) as integers, as our cart does.</li>
</ul>
<div class="kv-grid">
  <div class="kv"><span class="k">toBe(x)</span><span class="v">Numbers, strings, booleans; or "exactly this object".</span></div>
  <div class="kv"><span class="k">toEqual(obj)</span><span class="v">Objects and arrays compared by contents.</span></div>
  <div class="kv"><span class="k">toBeCloseTo(n)</span><span class="v">Decimals, to 2 places by default.</span></div>
  <div class="kv"><span class="k">toThrow(Type | 'text')</span><span class="v">The wrapped call throws that error.</span></div>
  <div class="kv"><span class="k">toContain(x) · toHaveLength(n)</span><span class="v">Arrays and strings.</span></div>
  <div class="kv"><span class="k">toBeNull · toBeUndefined · toBeTruthy</span><span class="v">Empty or "truthy" values — prefer the precise one.</span></div>
  <div class="kv"><span class="k">resolves / rejects</span><span class="v">Promises — lesson 13.4.</span></div>
</div>

<h3>Naming tests</h3>
<p>The name is what a teammate reads at 11 p.m. when CI is red. Compare <code>it('works')</code> with <code>it('free shipping applies AFTER the coupon')</code>. A good name states the behaviour and the condition; it never mentions variable names or "test 2". In Vietnamese teams it is common to write names in Vietnamese — that is fine, as long as they read like requirements.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — copying the implementation into the test.</strong> <code>expect(total(items)).toBe(subtotal(items) + shipping(subtotal(items)))</code> re-computes the answer with the same code; if the code is wrong, the test is wrong in the same way and stays green. Write expected values as <strong>plain numbers you computed by hand</strong> (498_000), which is exactly what makes a test independent.</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (20 minutes)</strong></p>
<p>In a new folder run <code>npm init -y</code> and <code>npm install --save-dev vitest</code>. Write <code>grade(score)</code> in <code>grade.js</code>: score 0–10 returns <code>"A"</code> from 8.5, <code>"B"</code> from 7, <code>"C"</code> from 5.5, <code>"D"</code> from 4, otherwise <code>"F"</code>; a score below 0 or above 10 throws a <code>RangeError</code>. In <code>grade.test.js</code>, write one <code>it.each</code> table and one test for the errors.</p>
<p><strong>Done when:</strong> <code>npx vitest run</code> is green; every boundary has a row on both sides (10, 8.5, 8.4, 7, 6.9, 5.5, 5.4, 4, 3.9, 0); both errors (−1 and 10.5) are tested; and if you change <code>&gt;= 7</code> to <code>&gt; 7</code> in your code, exactly the row for 7 turns red. The same exercise, graded, is in Code Lab module 13.2.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">unit test</span><span class="v">kiểm thử đơn vị — kiểm một hàm/mẩu code nhỏ, không I/O.</span></div>
  <div class="kv"><span class="k">devDependency</span><span class="v">phụ thuộc lúc phát triển — cài cho dev, không gửi cho người dùng.</span></div>
  <div class="kv"><span class="k">watch mode</span><span class="v">chế độ theo dõi — tự chạy lại test khi lưu file.</span></div>
  <div class="kv"><span class="k">Arrange · Act · Assert</span><span class="v">chuẩn bị · hành động · khẳng định.</span></div>
  <div class="kv"><span class="k">matcher</span><span class="v">hàm so khớp — toBe, toEqual, toThrow…</span></div>
  <div class="kv"><span class="k">parameterized test (it.each)</span><span class="v">test tham số hoá — một thân test chạy cho nhiều dòng dữ liệu.</span></div>
  <div class="kv"><span class="k">floating point</span><span class="v">số thực dấu phẩy động — không lưu chính xác 0,1.</span></div>
  <div class="kv"><span class="k">reporter</span><span class="v">bộ báo cáo — cách test runner in kết quả (default, verbose…).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Install with <code>npm install --save-dev vitest</code>; <code>npm test</code> watches, <code>npx vitest run</code> runs once.</li>
  <li>One behaviour per <code>it</code>: Arrange the input, Act once, Assert with <code>expect</code>.</li>
  <li><code>it.each</code> turns a table of boundary cases into one readable test.</li>
  <li>Test errors with <code>expect(() =&gt; call()).toThrow(Type)</code> — always wrap the call.</li>
  <li><code>toBe</code> for primitives and identity, <code>toEqual</code> for contents, <code>toBeCloseTo</code> for decimals.</li>
  <li>Expected values are numbers you computed by hand; names read like requirements.</li>
</ul>
${nguon('📗', 'Vitest — expect API', 'Every matcher with examples', 'https://vitest.dev/api/expect.html')}
${nguon('📘', 'Vitest — test.each', 'Tables of cases, name formatting (%i, %s, $name)', 'https://vitest.dev/api/#test-each')}
${lienKet({ khoa: 'testing', bai: 'tst-1-1-cau-truc', title: 'Testing course 1.1 — anatomy of a test: arrange, act, assert', sub: 'The same structure on a larger project, with mutation testing to prove the tests bite', cta: 'Open lesson' })}
${lienKet({ khoa: 'testing', bai: 'tst-1-4-ham-thuan', title: 'Testing course 1.4 — testing pure functions: partitions, boundaries, decision tables', sub: 'How professionals choose the rows of an it.each table', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Chuẩn bị, Hành động, Khẳng định — với một trình chạy test thật</h2>
<p class="lead">Học xong bài này bạn cài được Vitest, viết test cho các hàm JavaScript thuần, phủ cả một bảng giá trị biên trong một test, kiểm rằng lỗi được ném ra, chọn đúng matcher cho số, object và số thập phân, và đọc được báo cáo khi có gì sai. Vì sao cần: unit test là loại test rẻ nhất, nhanh nhất bạn sẽ viết — khoảng một mili giây mỗi cái — và mọi chặng học sau (service Node.js, component React, route Next.js) đều dựng trên đúng bốn từ: <code>describe</code>, <code>it</code>, <code>expect</code>, <code>toBe</code>.</p>

<h3>Bước 1 — cài và chạy</h3>
<pre><code class="language-bash">npm init -y
npm install --save-dev vitest        # chương này: Vitest 5.0.5 trên Node 22
npm test                             # với "test": "vitest" trong package.json ⇒ chế độ theo dõi
npx vitest run                       # chạy hết một lần rồi thoát (CI chạy lệnh này)</code></pre>
<p><code>--save-dev</code> ghi Vitest là <strong>phụ thuộc lúc phát triển (devDependency)</strong>: cần khi bạn xây dựng, không bao giờ gửi tới người dùng. <strong>Chế độ theo dõi (watch mode)</strong> chạy liên tục và chạy lại các test liên quan mỗi lần bạn lưu — để nó mở trong một terminal cạnh trình soạn thảo. Cấu hình của dự án chỉ cho Vitest biết test nằm ở đâu:</p>
${ma('javascript', CODE['_t13/vitest.config.js'])}

<h3>Bước 2 — giải phẫu một test</h3>
${ma('javascript', CODE['_t13/test/cart.test.js'], [1, 19])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">describe</span><span class="lz-t">một nhóm</span><span class="lz-d">Mọi test về <code>subtotal</code>. Nhóm hiện trong báo cáo dạng <code>subtotal &gt; …</code>.</span></div>
<div class="lz-step"><span class="lz-k">it</span><span class="lz-t">một hành vi</span><span class="lz-d">Đặt tên như một câu: "adds price × qty for every item".</span></div>
<div class="lz-step"><span class="lz-k">Arrange</span><span class="lz-t">chuẩn bị</span><span class="lz-d">Dữ liệu đầu vào — ở đây là hai món hàng.</span></div>
<div class="lz-step"><span class="lz-k">Act</span><span class="lz-t">gọi một lần</span><span class="lz-d">Đúng một lời gọi tới code đang được kiểm.</span></div>
<div class="lz-step"><span class="lz-k">Assert</span><span class="lz-t">khẳng định</span><span class="lz-d"><code>expect(result).toBe(150_000)</code>. Nếu sai, test thất bại.</span></div>
</div>
<p>Dấu gạch dưới trong <code>150_000</code> là dấu ngăn số: JavaScript bỏ qua nó, người đọc thấy 150 000. Hãy kiểm cả trường hợp rỗng — <code>subtotal([])</code> phải là 0, không phải <code>undefined</code> hay lỗi.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — nhiều hành vi trong một test.</strong> Một test kiểm subtotal, rồi ship, rồi mã giảm giá sẽ dừng ở lỗi đầu tiên, nên bạn không bao giờ biết hai cái kia còn chạy không, và tên của nó không thể mô tả hết. Mỗi <code>it</code> một hành vi; nhiều test nhỏ chạy cũng nhanh y như một test lớn.</p></div>

<h3>Bước 3 — bảng trường hợp với <code>it.each</code></h3>
${ma('javascript', CODE['_t13/test/cart.test.js'], [21, 30])}
<p>Mỗi dòng là <code>[đầu vào, mong đợi]</code>; Vitest chạy thân test một lần cho mỗi dòng và điền giá trị vào <code>%i</code> trong tên. Bốn dòng được chọn có chủ đích: số không, dưới mốc một đồng, đúng mốc, vượt xa mốc. Đó là luật giá trị biên ở bài 13.1 viết thành code.</p>

<h3>Bước 4 — lỗi cũng là một phần của hợp đồng</h3>
${ma('javascript', CODE['_t13/test/cart.test.js'], [32, 40])}
<p><code>expect(() =&gt; applyCoupon(100_000, bad)).toThrow(RangeError)</code> đưa vào một <em>hàm</em>. Vitest gọi nó trong try/catch và kiểm rằng một <code>RangeError</code> được ném ra. Các dòng phủ những cách sai khác nhau: quá nhỏ, quá lớn, không phải số nguyên, và số âm.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — gọi hàm ngay trong <code>expect</code>.</strong> <code>expect(applyCoupon(100_000, 0)).toThrow()</code> chạy <code>applyCoupon</code> trước, nên lỗi bị ném trước khi <code>expect</code> tồn tại; test sập với "RangeError: coupon must be…" thay vì qua. Luôn bọc lời gọi: <code>() =&gt; applyCoupon(…)</code>.</p></div>

<h3>Chạy: báo cáo verbose</h3>
${ra(OUT['_t13/out/cart'])}
<p>Mỗi dòng là một test qua: file › describe › it, rồi thời gian. Đọc danh sách mà không nhìn code — nó là bản đặc tả của giỏ hàng. Đó là thứ tên tốt mua cho bạn.</p>

<h3>Bước 5 — chọn matcher: <code>toBe</code>, <code>toEqual</code>, <code>toBeCloseTo</code></h3>
${ma('javascript', CODE['_t13/demo/matchers.test.js'])}
${ra(OUT['_t13/out/matchers'])}
<p>Hai trong năm test cố ý thất bại, và thông báo giải thích lý do:</p>
<ul>
<li><strong><code>toBe</code> với object:</strong> <code>toBe</code> dùng <code>Object.is</code> — "cùng một giá trị", với object nghĩa là <em>cùng một object</em> (bài 11.4: tham chiếu và giá trị). Hai <code>{ id: 1 }</code> tạo riêng là hai object khác nhau, nên trượt, và Vitest nói "serializes to the same string… replace toBe with toStrictEqual". So nội dung thì dùng <code>toEqual</code> (hoặc <code>toStrictEqual</code> chặt hơn, kiểm cả thuộc tính <code>undefined</code> và class).</li>
<li><strong>Số thập phân:</strong> <code>0.1 + 0.2</code> là <code>0.30000000000000004</code> vì số thực nhị phân không lưu chính xác được 0,1. Dùng <code>toBeCloseTo(0.3)</code> cho số thập phân thật — còn với tiền, lưu đơn vị nguyên (đồng, cent) bằng số nguyên, như giỏ hàng của ta.</li>
</ul>
<div class="kv-grid">
  <div class="kv"><span class="k">toBe(x)</span><span class="v">Số, chuỗi, boolean; hoặc "đúng object này".</span></div>
  <div class="kv"><span class="k">toEqual(obj)</span><span class="v">Object và mảng so theo nội dung.</span></div>
  <div class="kv"><span class="k">toBeCloseTo(n)</span><span class="v">Số thập phân, mặc định chính xác 2 chữ số.</span></div>
  <div class="kv"><span class="k">toThrow(Type | 'text')</span><span class="v">Lời gọi được bọc ném đúng lỗi đó.</span></div>
  <div class="kv"><span class="k">toContain(x) · toHaveLength(n)</span><span class="v">Mảng và chuỗi.</span></div>
  <div class="kv"><span class="k">toBeNull · toBeUndefined · toBeTruthy</span><span class="v">Giá trị rỗng hoặc "truthy" — ưu tiên cái chính xác.</span></div>
  <div class="kv"><span class="k">resolves / rejects</span><span class="v">Promise — bài 13.4.</span></div>
</div>

<h3>Đặt tên test</h3>
<p>Tên là thứ đồng đội đọc lúc 11 giờ đêm khi CI đỏ. So <code>it('works')</code> với <code>it('free shipping applies AFTER the coupon')</code>. Một tên tốt nêu hành vi và điều kiện; không bao giờ nhắc tên biến hay "test 2". Nhiều nhóm Việt Nam viết tên test bằng tiếng Việt — hoàn toàn ổn, miễn là đọc như yêu cầu.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chép cách cài đặt vào test.</strong> <code>expect(total(items)).toBe(subtotal(items) + shipping(subtotal(items)))</code> tính lại đáp án bằng chính code đó; nếu code sai, test sai y hệt và vẫn xanh. Hãy viết giá trị mong đợi là <strong>con số bạn tự tính tay</strong> (498_000) — chính điều đó làm test độc lập.</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút)</strong></p>
<p>Trong một thư mục mới chạy <code>npm init -y</code> và <code>npm install --save-dev vitest</code>. Viết <code>grade(score)</code> trong <code>grade.js</code>: điểm 0–10 trả <code>"A"</code> từ 8.5, <code>"B"</code> từ 7, <code>"C"</code> từ 5.5, <code>"D"</code> từ 4, còn lại <code>"F"</code>; điểm dưới 0 hoặc trên 10 ném <code>RangeError</code>. Trong <code>grade.test.js</code>, viết một bảng <code>it.each</code> và một test cho các lỗi.</p>
<p><strong>Xong khi:</strong> <code>npx vitest run</code> xanh; mỗi giá trị biên có dòng ở cả hai phía (10, 8.5, 8.4, 7, 6.9, 5.5, 5.4, 4, 3.9, 0); cả hai lỗi (−1 và 10.5) đều được test; và nếu bạn đổi <code>&gt;= 7</code> thành <code>&gt; 7</code> trong code, đúng dòng của số 7 chuyển đỏ. Bài y hệt, có máy chấm, nằm trong Code Lab module 13.2.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">unit test</span><span class="v">kiểm thử đơn vị — kiểm một hàm/mẩu code nhỏ, không I/O.</span></div>
  <div class="kv"><span class="k">devDependency</span><span class="v">phụ thuộc lúc phát triển — cài cho dev, không gửi cho người dùng.</span></div>
  <div class="kv"><span class="k">watch mode</span><span class="v">chế độ theo dõi — tự chạy lại test khi lưu file.</span></div>
  <div class="kv"><span class="k">Arrange · Act · Assert</span><span class="v">chuẩn bị · hành động · khẳng định.</span></div>
  <div class="kv"><span class="k">matcher</span><span class="v">hàm so khớp — toBe, toEqual, toThrow…</span></div>
  <div class="kv"><span class="k">parameterized test (it.each)</span><span class="v">test tham số hoá — một thân test chạy cho nhiều dòng dữ liệu.</span></div>
  <div class="kv"><span class="k">floating point</span><span class="v">số thực dấu phẩy động — không lưu chính xác 0,1.</span></div>
  <div class="kv"><span class="k">reporter</span><span class="v">bộ báo cáo — cách test runner in kết quả (default, verbose…).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cài bằng <code>npm install --save-dev vitest</code>; <code>npm test</code> theo dõi, <code>npx vitest run</code> chạy một lần.</li>
  <li>Mỗi <code>it</code> một hành vi: chuẩn bị đầu vào, gọi một lần, khẳng định bằng <code>expect</code>.</li>
  <li><code>it.each</code> biến một bảng giá trị biên thành một test dễ đọc.</li>
  <li>Kiểm lỗi bằng <code>expect(() =&gt; call()).toThrow(Type)</code> — luôn bọc lời gọi.</li>
  <li><code>toBe</code> cho giá trị nguyên thuỷ và danh tính, <code>toEqual</code> cho nội dung, <code>toBeCloseTo</code> cho số thập phân.</li>
  <li>Giá trị mong đợi là con số bạn tự tính; tên test đọc như yêu cầu.</li>
</ul>
${nguon('📗', 'Vitest — expect API', 'Mọi matcher kèm ví dụ', 'https://vitest.dev/api/expect.html')}
${nguon('📘', 'Vitest — test.each', 'Bảng trường hợp, định dạng tên (%i, %s, $name)', 'https://vitest.dev/api/#test-each')}
${lienKet({ khoa: 'testing', bai: 'tst-1-1-cau-truc', title: 'Khoá Testing 1.1 — giải phẫu một test: chuẩn bị, hành động, khẳng định', sub: 'Cùng cấu trúc trên dự án lớn hơn, có mutation testing để chứng minh test biết cắn', cta: 'Mở bài' })}
${lienKet({ khoa: 'testing', bai: 'tst-1-4-ham-thuan', title: 'Khoá Testing 1.4 — test hàm thuần: phân vùng, giá trị biên, bảng quyết định', sub: 'Dân chuyên nghiệp chọn các dòng cho bảng it.each thế nào', cta: 'Mở bài' })}
</div>
`,
};
