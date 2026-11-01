/**
 * Bài 13.3 — Testing Library: kiểm giao diện như người dùng (nâng cấp 01/11/2026).
 * Output: Vitest 5.0.5 + jsdom 30.1.3 + @testing-library/dom 10.4.2 + user-event 14.6.8 / Node 22.23.3, chạy thật trong _demo/_t13.
 * Deck: scripts/slides-src/wf-13-3.mjs (12 slide).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const WQ = OUT['_t13/out/wrong-query'].split('\n');
const WQ_CUT = WQ.slice(0, WQ.findIndex((l) => l.trim() === 'paragraph:')).concat(['  …', ...WQ.slice(WQ.findIndex((l) => l.trim() === 'button:'), WQ.findIndex((l) => l.trim() === 'status:'))]).join('\n');

const G = walkWf('wf-13-3', 'Testing UI like a user', 'Kiểm giao diện như người dùng', [
  [1, 'Testing UI like a user',
    '<p>Unit tests check functions. Interfaces need something more: a page to render into, a way to find elements, and a way to type and click. Testing Library provides all three, with one rule — test what the user can see and do.</p>',
    '<p>Unit test kiểm các hàm. Giao diện cần nhiều hơn: một trang để render vào, một cách tìm phần tử, và một cách gõ và bấm. Testing Library cho cả ba, với một luật — kiểm thứ người dùng thấy và làm được.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five skills that carry straight into React, Vue or any framework, because Testing Library has the same API everywhere. The bonus: tests that find elements by role push your HTML towards accessibility without extra effort.</p>',
    '<p>Năm kỹ năng mang thẳng sang React, Vue hay framework nào cũng được, vì Testing Library có cùng API ở mọi nơi. Phần thưởng thêm: test tìm phần tử theo vai trò đẩy HTML của bạn về phía dễ tiếp cận mà không tốn thêm công.</p>'],
  [3, 'The component',
    '<p>A sign-up form written in plain DOM code, so you need no framework yet. Three behaviours to test: the button stays disabled until both fields are valid; submitting shows a welcome message; a server error shows an alert and re-enables the button.</p>',
    '<p>Một form đăng ký viết bằng DOM thuần, nên bạn chưa cần framework nào. Ba hành vi cần test: nút bị khoá tới khi cả hai ô hợp lệ; gửi thì hiện lời chào; máy chủ lỗi thì hiện cảnh báo và mở lại nút.</p>'],
  [4, 'Test setup',
    '<p>The comment on the first line switches this file to jsdom, a browser implemented in JavaScript that runs inside Node. <code>screen</code> searches the whole document. The jest-dom import adds readable matchers such as <code>toBeDisabled</code>. Each test starts from an empty page.</p>',
    '<p>Dòng chú thích đầu tiên chuyển file này sang jsdom, một trình duyệt viết bằng JavaScript chạy trong Node. <code>screen</code> tìm trong cả tài liệu. Dòng import jest-dom thêm các matcher dễ đọc như <code>toBeDisabled</code>. Mỗi test bắt đầu từ một trang trống.</p>'],
  [5, 'Test 1: type like a user',
    '<p>The button is found by its role and name, the inputs by their labels. <code>user.type</code> types character by character and fires the same events as a real keyboard, so the form’s own input handler decides when the button is enabled.</p>',
    '<p>Nút được tìm theo vai trò và tên, ô nhập theo nhãn. <code>user.type</code> gõ từng ký tự và bắn cùng các sự kiện như bàn phím thật, nên chính handler input của form quyết định khi nào nút được mở.</p>'],
  [6, 'Async UI and failures',
    '<p>The second test waits for the welcome text with <code>findByText</code>, because it appears after a promise resolves. The third makes the fake server reject and expects an alert. The fourth shows the difference between <code>queryBy</code>, which returns null, and <code>getBy</code>, which throws.</p>',
    '<p>Test thứ hai chờ dòng chào bằng <code>findByText</code>, vì nó xuất hiện sau khi một promise hoàn tất. Test thứ ba cho máy chủ giả từ chối và mong có cảnh báo. Test thứ tư cho thấy khác biệt giữa <code>queryBy</code> trả null và <code>getBy</code> ném lỗi.</p>'],
  [7, 'Four tests in jsdom',
    '<p>All four pass. Each takes between ten and about a hundred and fifty milliseconds: a DOM has to be built and events dispatched, so it is slower than a unit test, yet still far faster than starting a real browser.</p>',
    '<p>Cả bốn đều qua. Mỗi test mất từ mười tới khoảng một trăm năm mươi mili giây: phải dựng DOM và phát sự kiện, nên chậm hơn unit test, nhưng vẫn nhanh hơn nhiều so với khởi động một trình duyệt thật.</p>'],
  [8, 'Queries, best first',
    '<p>Prefer queries that match how people perceive the page: role and accessible name first, then label, then visible text. Test ids are a last resort and CSS classes should not appear in tests at all.</p>',
    '<p>Ưu tiên các truy vấn khớp với cách con người cảm nhận trang: vai trò và tên trước, rồi nhãn, rồi chữ hiển thị. Test id là đường cuối cùng, còn class CSS không nên xuất hiện trong test.</p>'],
  [9, 'get, query, find',
    '<p>Three prefixes, three intentions. <code>getBy</code> says it must be there now. <code>queryBy</code> says it might not be there, so you can assert absence. <code>findBy</code> says it will appear soon — it returns a promise and retries for about a second.</p>',
    '<p>Ba tiền tố, ba ý định. <code>getBy</code> nói nó phải có mặt ngay bây giờ. <code>queryBy</code> nói có thể nó không có, nên bạn khẳng định được sự vắng mặt. <code>findBy</code> nói nó sắp xuất hiện — trả về promise và thử lại khoảng một giây.</p>'],
  [10, 'Reading the roles error',
    '<p>When a query finds nothing, Testing Library prints every accessible role on the page with its name. Here it reveals that the button’s real name is "Sign up", and that the password field is missing from the list because password inputs have no role.</p>',
    '<p>Khi một truy vấn không tìm thấy gì, Testing Library in mọi vai trò truy cập được trên trang kèm tên. Ở đây nó lộ ra tên thật của nút là "Sign up", và ô mật khẩu vắng mặt trong danh sách vì ô mật khẩu không có vai trò.</p>'],
  [11, 'Details vs behaviour',
    '<p>Tests that reach into class names or internal state break whenever someone renames a class or restructures the code, even if the page still works. Tests that use roles, labels and visible text only break when the user’s experience changes.</p>',
    '<p>Test thò vào tên class hay trạng thái nội bộ sẽ vỡ mỗi khi ai đó đổi tên class hay cấu trúc lại code, dù trang vẫn chạy đúng. Test dùng vai trò, nhãn và chữ hiển thị chỉ vỡ khi trải nghiệm của người dùng thay đổi.</p>'],
  [12, 'Summary & practice',
    '<p>The counter exercise is small on purpose. Its real test is the last "Done when": rename a CSS class and run the tests again. If nothing turns red, you have written tests about behaviour.</p>',
    '<p>Bài bộ đếm cố ý nhỏ. Phép thử thật của nó là dòng "Xong khi" cuối: đổi tên một class CSS rồi chạy lại test. Nếu không có gì đỏ, bạn đã viết test về hành vi.</p>'],
]);

export default {
  title: '13.3 — Testing UI the way users see it|||13.3 — Kiểm thử giao diện theo cách người dùng thấy',
  slug: 'wf-13-3-testing-library',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'jsdom là gì, Testing Library + user-event trên một form đăng ký viết bằng DOM thuần, tìm phần tử theo role/label, get vs query vs find, chờ giao diện bất đồng bộ, đọc lỗi "accessible roles", vì sao không test chi tiết cài đặt — chạy thật bằng Vitest.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Test what the user experiences, not how you built it</h2>
<p class="lead">After this lesson you can test a piece of user interface without opening a browser: render it into a fake DOM, find the email box and the button the way a person would, type and click like a person, wait for a message that appears later, and read the very helpful error Testing Library prints when something cannot be found. Why it matters: interface code changes constantly — class names, layout, internal structure. Tests that only depend on what the user sees keep passing through all of that and fail only when the experience really breaks. The same API is used for React (<code>@testing-library/react</code>), so everything here carries straight into the React course.</p>

<h3>Step 1 — what jsdom is</h3>
<p>Your tests run in Node, which has no <code>document</code>, no buttons and no events. <strong>jsdom</strong> is a browser written in JavaScript: it parses HTML, builds a DOM, dispatches events and runs your DOM code — it just does not draw pixels. Vitest switches a test file to jsdom with one comment on the first line: <code>// @vitest-environment jsdom</code>. Because nothing is painted, layout (sizes, positions) is not available; for that you need a real browser (Playwright, lesson 13.1 and the Testing course).</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Your test</span><span class="lz-t">screen.getByRole(…), user.type(…)</span><span class="lz-d">Written from the user's point of view.</span></div>
<div class="lz-layer"><span class="lz-k">Testing Library + user-event</span><span class="lz-t">queries and realistic events</span><span class="lz-d">Finds elements by role/label/text; types key by key, clicks with focus and pointer events.</span></div>
<div class="lz-layer"><span class="lz-k">jsdom</span><span class="lz-t">a DOM inside Node</span><span class="lz-d">document, elements, events, forms — no pixels, no layout.</span></div>
<div class="lz-layer"><span class="lz-k">Vitest on Node</span><span class="lz-t">runs and reports</span><span class="lz-d">The same runner as lesson 13.2.</span></div>
</div>

<h3>Step 2 — the component under test</h3>
${ma('javascript', CODE['_t13/src/signup.js'])}
<p>A sign-up form built with plain DOM code (no framework). Three behaviours matter to a user: the "Sign up" button stays disabled until the email contains <code>@</code> and the password has at least 8 characters; submitting shows "Creating your account…" and then a welcome line; if the server fails, an alert explains why and the button can be pressed again. Note the semantic HTML: real <code>&lt;label for&gt;</code> elements, a real <code>&lt;button&gt;</code>, <code>role="status"</code> and <code>role="alert"</code> for messages. That is what makes the tests below possible.</p>

<h3>Step 3 — the tests</h3>
${ma('javascript', CODE['_t13/test/signup.test.js'])}
<ul>
<li><strong>Setup:</strong> the <code>setup()</code> helper renders a fresh form and creates a <code>user</code> with <code>userEvent.setup()</code>. <code>onSubmit</code> is a fake function (<code>vi.fn()</code>, lesson 13.4) that resolves, or rejects when a test needs a server error. <code>afterEach</code> empties the page so tests do not see each other's forms.</li>
<li><strong>Test 1</strong> finds the button by <em>role and name</em> and the inputs by their <em>labels</em>, types like a person, and checks <code>toBeDisabled()</code> / <code>toBeEnabled()</code> (matchers from jest-dom).</li>
<li><strong>Test 2</strong> submits and waits for the welcome text with <code>await screen.findByText(…)</code>, because it appears only after the promise from <code>onSubmit</code> resolves. It also checks that <code>onSubmit</code> received exactly <code>{ email: 'lan@example.com' }</code>.</li>
<li><strong>Test 3</strong> makes the fake server reject and expects an element with role <code>alert</code>, with the error text, and the button enabled again.</li>
<li><strong>Test 4</strong> contrasts <code>queryByRole</code> (returns <code>null</code> when nothing matches) with <code>getByRole</code> (throws).</li>
</ul>
${ra(OUT['_t13/out/signup'])}
<p>Four tests, 10 to 148&nbsp;ms each — a DOM has to be built and dozens of keyboard events dispatched, so these are slower than the 1&nbsp;ms unit tests, yet far faster than the 250+&nbsp;ms of a real browser.</p>

<h3>Choosing a query — best first</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">getByRole('button', { name: 'Sign up' })</span><span class="v">First choice. Role + accessible name is how screen readers navigate.</span></div>
  <div class="kv"><span class="k">getByLabelText('Email')</span><span class="v">Form fields, through their <code>&lt;label&gt;</code>.</span></div>
  <div class="kv"><span class="k">getByText('Welcome, …')</span><span class="v">Non-interactive text: messages, paragraphs.</span></div>
  <div class="kv"><span class="k">getByTestId('cart-total')</span><span class="v">Last resort, when nothing visible identifies the element.</span></div>
  <div class="kv"><span class="k">querySelector('.btn-primary')</span><span class="v">Avoid: users do not see classes, and classes change.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">getBy…</span><span class="v">Must be there <em>now</em>; throws if not.</span></div>
  <div class="kv"><span class="k">queryBy…</span><span class="v">Returns <code>null</code> if not found — use it to assert absence: <code>expect(screen.queryByRole('alert')).toBeNull()</code>.</span></div>
  <div class="kv"><span class="k">findBy…</span><span class="v">Returns a Promise and retries for about 1 second — use with <code>await</code> for things that appear after async work.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — forgetting <code>await</code>.</strong> <code>user.type</code>, <code>user.click</code> and every <code>findBy…</code> return Promises. Without <code>await</code> the test moves on before the typing happened and checks the old state — it may pass by luck today and fail tomorrow. Mark the test <code>async</code> and await every user action and every <code>findBy</code>.</p></div>

<h3>When a query fails, read the roles</h3>
${ma('javascript', CODE['_t13/demo/wrong-query.test.js'])}
${ra(WQ_CUT)}
<p>The error does not just say "not found": it lists every accessible role on the page with its name. You can read off that the button exists but is called "Sign up", not "Register". And notice what is <em>missing</em>: the password field. Password inputs have no ARIA role (to avoid leaking what is typed), so <code>getByRole('textbox', { name: 'Password' })</code> can never find it — use <code>getByLabelText('Password')</code>. (The output above is trimmed: the full message also prints the paragraphs, the status line and the whole DOM tree.)</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a test that cannot find your element is often an accessibility bug.</strong> If <code>getByLabelText('Email')</code> fails, the input probably has no associated <code>&lt;label&gt;</code> — which means a screen-reader user hears "edit text, blank" with no idea what to type. Fix the HTML (add the label), not the test (switching to a class selector).</p></div>

<h3>Implementation details versus behaviour</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Breaks on refactor</span><span class="v"><code>container.querySelector('.btn-primary')</code>, reading internal variables or component state, calling <code>button.click()</code> on a disabled button, snapshotting the whole HTML.</span></div>
  <div class="kv"><span class="k">Survives refactor</span><span class="v">Finding by role/label/text, interacting through user-event, asserting what is visible (text, enabled/disabled, present/absent).</span></div>
</div>
<p>A good check: imagine rewriting the form in React with completely different markup and class names. The four tests above would not change a single line — only the <code>render</code> call would. That is what "test the behaviour, not the implementation" means in practice.</p>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes)</strong></p>
<p>In the chapter project (or a new one with <code>vitest jsdom @testing-library/dom @testing-library/user-event @testing-library/jest-dom</code> installed), write <code>createCounter()</code>: it returns an element with a "+1" button, a "−1" button and a status line "Count: 0" (<code>role="status"</code>). "−1" is disabled when the count is 0. Then write three tests with Testing Library only.</p>
<p><strong>Done when:</strong> your test file contains no class name, id or <code>querySelector</code>; "−1" starts disabled; three clicks on "+1" show "Count: 3"; one click on "−1" after that shows "Count: 2"; and if you rename every CSS class in <code>createCounter</code>, all tests stay green. Code Lab module 13.3 has a graded version where you fix an inaccessible form so the queries can find it.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">jsdom</span><span class="v">trình duyệt viết bằng JavaScript chạy trong Node — có DOM, không vẽ.</span></div>
  <div class="kv"><span class="k">test environment</span><span class="v">môi trường test — node (mặc định) hay jsdom.</span></div>
  <div class="kv"><span class="k">query (getBy / queryBy / findBy)</span><span class="v">truy vấn — phải có ngay / có thể vắng / sẽ xuất hiện.</span></div>
  <div class="kv"><span class="k">accessible name</span><span class="v">tên truy cập — tên mà trình đọc màn hình đọc cho phần tử.</span></div>
  <div class="kv"><span class="k">ARIA role</span><span class="v">vai trò — button, textbox, alert, status…</span></div>
  <div class="kv"><span class="k">user-event</span><span class="v">thư viện mô phỏng gõ và bấm như người thật.</span></div>
  <div class="kv"><span class="k">implementation detail</span><span class="v">chi tiết cài đặt — thứ người dùng không thấy (class, biến nội bộ).</span></div>
  <div class="kv"><span class="k">jest-dom matchers</span><span class="v">matcher DOM — toBeDisabled, toBeInTheDocument, toHaveTextContent.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>jsdom gives Node a DOM; switch a file with <code>// @vitest-environment jsdom</code>. No pixels, no layout.</li>
  <li>Find elements like a user: role + name first, then label, then text; test ids last; never classes.</li>
  <li><code>getBy</code> = must exist now, <code>queryBy</code> = may be absent, <code>findBy</code> = will appear (await).</li>
  <li>user-event types and clicks realistically; await every action.</li>
  <li>The "accessible roles" error lists what exists — often revealing an accessibility bug to fix in the HTML.</li>
  <li>Test behaviour; your tests should survive a rewrite of the markup.</li>
</ul>
${nguon('📗', 'Testing Library — Which query should I use?', 'The official priority list of queries, with reasons', 'https://testing-library.com/docs/queries/about#priority')}
${nguon('📘', 'Testing Library — user-event', 'Why simulating real interaction beats firing single events', 'https://testing-library.com/docs/user-event/intro')}
${lienKet({ khoa: 'react', bai: 'rx-9-1-testing-library', title: 'React 9.1 — Testing Library basics: query by role, user-event, jest-dom', sub: 'The same queries and events with @testing-library/react', cta: 'Open lesson' })}
${lienKet({ khoa: 'testing', bai: 'tst-6-1-testing-library', title: 'Testing course 6.1 — Testing Library: find elements the way users see them', sub: 'Deeper: async UI, MSW for the network, and accessibility checks', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Kiểm cái người dùng trải nghiệm, không kiểm cách bạn dựng nó</h2>
<p class="lead">Học xong bài này bạn kiểm được một mảnh giao diện mà không cần mở trình duyệt: render nó vào một DOM giả, tìm ô email và nút bấm theo cách một người tìm, gõ và bấm như một người, chờ một thông báo xuất hiện sau, và đọc được thông báo lỗi rất hữu ích mà Testing Library in ra khi không tìm thấy gì. Vì sao cần: code giao diện thay đổi liên tục — tên class, bố cục, cấu trúc bên trong. Test chỉ dựa vào thứ người dùng thấy sẽ vẫn qua qua mọi thay đổi đó và chỉ đỏ khi trải nghiệm thật sự vỡ. API này dùng y hệt cho React (<code>@testing-library/react</code>), nên mọi thứ ở đây mang thẳng sang khoá React.</p>

<h3>Bước 1 — jsdom là gì</h3>
<p>Test của bạn chạy trong Node, nơi không có <code>document</code>, không có nút, không có sự kiện. <strong>jsdom</strong> là một trình duyệt viết bằng JavaScript: nó phân tích HTML, dựng DOM, phát sự kiện và chạy code DOM của bạn — chỉ là không vẽ điểm ảnh. Vitest chuyển một file test sang jsdom bằng một dòng chú thích ở dòng đầu: <code>// @vitest-environment jsdom</code>. Vì không có gì được vẽ, bố cục (kích thước, vị trí) không có sẵn; muốn vậy cần trình duyệt thật (Playwright, bài 13.1 và khoá Testing).</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Test của bạn</span><span class="lz-t">screen.getByRole(…), user.type(…)</span><span class="lz-d">Viết từ góc nhìn người dùng.</span></div>
<div class="lz-layer"><span class="lz-k">Testing Library + user-event</span><span class="lz-t">truy vấn và sự kiện giống thật</span><span class="lz-d">Tìm phần tử theo vai trò/nhãn/chữ; gõ từng phím, bấm có focus và sự kiện con trỏ.</span></div>
<div class="lz-layer"><span class="lz-k">jsdom</span><span class="lz-t">một DOM trong Node</span><span class="lz-d">document, phần tử, sự kiện, form — không điểm ảnh, không bố cục.</span></div>
<div class="lz-layer"><span class="lz-k">Vitest trên Node</span><span class="lz-t">chạy và báo cáo</span><span class="lz-d">Cùng trình chạy với bài 13.2.</span></div>
</div>

<h3>Bước 2 — component được kiểm</h3>
${ma('javascript', CODE['_t13/src/signup.js'])}
<p>Một form đăng ký dựng bằng code DOM thuần (không framework). Ba hành vi quan trọng với người dùng: nút "Sign up" bị khoá tới khi email có <code>@</code> và mật khẩu có ít nhất 8 ký tự; gửi đi thì hiện "Creating your account…" rồi một dòng chào; nếu máy chủ lỗi, một cảnh báo giải thích lý do và nút bấm lại được. Để ý HTML có ngữ nghĩa: phần tử <code>&lt;label for&gt;</code> thật, một <code>&lt;button&gt;</code> thật, <code>role="status"</code> và <code>role="alert"</code> cho thông báo. Chính những thứ đó làm các test bên dưới khả thi.</p>

<h3>Bước 3 — các test</h3>
${ma('javascript', CODE['_t13/test/signup.test.js'])}
<ul>
<li><strong>Chuẩn bị:</strong> hàm <code>setup()</code> render một form mới và tạo <code>user</code> bằng <code>userEvent.setup()</code>. <code>onSubmit</code> là hàm giả (<code>vi.fn()</code>, bài 13.4) tự hoàn tất, hoặc từ chối khi test cần máy chủ lỗi. <code>afterEach</code> làm trống trang để các test không thấy form của nhau.</li>
<li><strong>Test 1</strong> tìm nút theo <em>vai trò và tên</em>, ô nhập theo <em>nhãn</em>, gõ như người, và kiểm <code>toBeDisabled()</code> / <code>toBeEnabled()</code> (matcher của jest-dom).</li>
<li><strong>Test 2</strong> gửi form rồi chờ dòng chào bằng <code>await screen.findByText(…)</code>, vì nó chỉ xuất hiện sau khi promise của <code>onSubmit</code> hoàn tất. Nó còn kiểm <code>onSubmit</code> nhận đúng <code>{ email: 'lan@example.com' }</code>.</li>
<li><strong>Test 3</strong> cho máy chủ giả từ chối và mong một phần tử có vai trò <code>alert</code>, đúng chữ lỗi, và nút được mở lại.</li>
<li><strong>Test 4</strong> đối chiếu <code>queryByRole</code> (trả <code>null</code> khi không khớp gì) với <code>getByRole</code> (ném lỗi).</li>
</ul>
${ra(OUT['_t13/out/signup'])}
<p>Bốn test, mỗi cái 10 tới 148&nbsp;ms — phải dựng DOM và phát hàng chục sự kiện bàn phím, nên chậm hơn unit test 1&nbsp;ms, nhưng vẫn nhanh hơn nhiều so với 250+&nbsp;ms của một trình duyệt thật.</p>

<h3>Chọn truy vấn — tốt nhất xếp trước</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">getByRole('button', { name: 'Sign up' })</span><span class="v">Lựa chọn số một. Vai trò + tên là cách trình đọc màn hình điều hướng.</span></div>
  <div class="kv"><span class="k">getByLabelText('Email')</span><span class="v">Ô nhập trong form, qua <code>&lt;label&gt;</code> của nó.</span></div>
  <div class="kv"><span class="k">getByText('Welcome, …')</span><span class="v">Chữ không tương tác: thông báo, đoạn văn.</span></div>
  <div class="kv"><span class="k">getByTestId('cart-total')</span><span class="v">Đường cuối, khi không có gì nhìn thấy được để nhận ra phần tử.</span></div>
  <div class="kv"><span class="k">querySelector('.btn-primary')</span><span class="v">Tránh: người dùng không thấy class, và class thì thay đổi.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">getBy…</span><span class="v">Phải có <em>ngay bây giờ</em>; không có thì ném lỗi.</span></div>
  <div class="kv"><span class="k">queryBy…</span><span class="v">Không thấy thì trả <code>null</code> — dùng để khẳng định sự vắng mặt: <code>expect(screen.queryByRole('alert')).toBeNull()</code>.</span></div>
  <div class="kv"><span class="k">findBy…</span><span class="v">Trả Promise và thử lại khoảng 1 giây — dùng với <code>await</code> cho thứ xuất hiện sau việc bất đồng bộ.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — quên <code>await</code>.</strong> <code>user.type</code>, <code>user.click</code> và mọi <code>findBy…</code> đều trả Promise. Thiếu <code>await</code>, test chạy tiếp trước khi việc gõ xảy ra và kiểm trạng thái cũ — hôm nay có thể qua nhờ may, mai thì đỏ. Đánh dấu test là <code>async</code> và await mọi hành động người dùng và mọi <code>findBy</code>.</p></div>

<h3>Khi truy vấn thất bại, hãy đọc danh sách vai trò</h3>
${ma('javascript', CODE['_t13/demo/wrong-query.test.js'])}
${ra(WQ_CUT)}
<p>Thông báo lỗi không chỉ nói "không tìm thấy": nó liệt kê mọi vai trò truy cập được trên trang kèm tên. Bạn đọc ra được là nút có tồn tại nhưng tên là "Sign up", không phải "Register". Và để ý thứ <em>vắng mặt</em>: ô mật khẩu. Ô mật khẩu không có vai trò ARIA (để không làm lộ chữ đang gõ), nên <code>getByRole('textbox', { name: 'Password' })</code> không bao giờ tìm thấy nó — hãy dùng <code>getByLabelText('Password')</code>. (Output trên đã được cắt: thông báo đầy đủ còn in các đoạn văn, dòng trạng thái và cả cây DOM.)</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — test không tìm thấy phần tử thường là một lỗi tiếp cận.</strong> Nếu <code>getByLabelText('Email')</code> thất bại, ô nhập có lẽ không có <code>&lt;label&gt;</code> đi kèm — nghĩa là người dùng trình đọc màn hình nghe "ô nhập, trống" mà chẳng biết gõ gì. Hãy sửa HTML (thêm nhãn), đừng sửa test (đổi sang selector class).</p></div>

<h3>Chi tiết cài đặt hay hành vi</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Vỡ khi refactor</span><span class="v"><code>container.querySelector('.btn-primary')</code>, đọc biến nội bộ hay state của component, gọi <code>button.click()</code> lên nút đang khoá, chụp snapshot cả khối HTML.</span></div>
  <div class="kv"><span class="k">Sống qua refactor</span><span class="v">Tìm theo vai trò/nhãn/chữ, tương tác qua user-event, khẳng định thứ nhìn thấy được (chữ, khoá/mở, có/không).</span></div>
</div>
<p>Một phép thử hay: tưởng tượng viết lại form bằng React với markup và tên class hoàn toàn khác. Bốn test trên không phải đổi một dòng nào — chỉ lời gọi <code>render</code> đổi. Đó là ý nghĩa thực tế của "kiểm hành vi, không kiểm cách cài đặt".</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút)</strong></p>
<p>Trong dự án của chương (hoặc một dự án mới đã cài <code>vitest jsdom @testing-library/dom @testing-library/user-event @testing-library/jest-dom</code>), viết <code>createCounter()</code>: trả về một phần tử có nút "+1", nút "−1" và dòng trạng thái "Count: 0" (<code>role="status"</code>). "−1" bị khoá khi số đếm là 0. Rồi viết ba test chỉ bằng Testing Library.</p>
<p><strong>Xong khi:</strong> file test không chứa tên class, id hay <code>querySelector</code> nào; "−1" khởi đầu bị khoá; ba lần bấm "+1" hiện "Count: 3"; sau đó một lần bấm "−1" hiện "Count: 2"; và nếu bạn đổi tên mọi class CSS trong <code>createCounter</code>, mọi test vẫn xanh. Code Lab module 13.3 có phiên bản chấm tự động, trong đó bạn sửa một form khó tiếp cận để các truy vấn tìm được nó.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">jsdom</span><span class="v">trình duyệt viết bằng JavaScript chạy trong Node — có DOM, không vẽ.</span></div>
  <div class="kv"><span class="k">test environment</span><span class="v">môi trường test — node (mặc định) hay jsdom.</span></div>
  <div class="kv"><span class="k">query (getBy / queryBy / findBy)</span><span class="v">truy vấn — phải có ngay / có thể vắng / sẽ xuất hiện.</span></div>
  <div class="kv"><span class="k">accessible name</span><span class="v">tên truy cập — tên mà trình đọc màn hình đọc cho phần tử.</span></div>
  <div class="kv"><span class="k">ARIA role</span><span class="v">vai trò — button, textbox, alert, status…</span></div>
  <div class="kv"><span class="k">user-event</span><span class="v">thư viện mô phỏng gõ và bấm như người thật.</span></div>
  <div class="kv"><span class="k">implementation detail</span><span class="v">chi tiết cài đặt — thứ người dùng không thấy (class, biến nội bộ).</span></div>
  <div class="kv"><span class="k">jest-dom matchers</span><span class="v">matcher DOM — toBeDisabled, toBeInTheDocument, toHaveTextContent.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>jsdom cho Node một DOM; chuyển file bằng <code>// @vitest-environment jsdom</code>. Không điểm ảnh, không bố cục.</li>
  <li>Tìm phần tử như người dùng: vai trò + tên trước, rồi nhãn, rồi chữ; test id sau cùng; không bao giờ dùng class.</li>
  <li><code>getBy</code> = phải có ngay, <code>queryBy</code> = có thể vắng, <code>findBy</code> = sẽ xuất hiện (await).</li>
  <li>user-event gõ và bấm giống thật; await mọi hành động.</li>
  <li>Lỗi "accessible roles" liệt kê thứ đang có — thường lộ ra một lỗi tiếp cận cần sửa trong HTML.</li>
  <li>Kiểm hành vi; test của bạn phải sống được qua một lần viết lại markup.</li>
</ul>
${nguon('📗', 'Testing Library — Which query should I use?', 'Thứ tự ưu tiên chính thức của các truy vấn, kèm lý do', 'https://testing-library.com/docs/queries/about#priority')}
${nguon('📘', 'Testing Library — user-event', 'Vì sao mô phỏng tương tác thật tốt hơn bắn từng sự kiện lẻ', 'https://testing-library.com/docs/user-event/intro')}
${lienKet({ khoa: 'react', bai: 'rx-9-1-testing-library', title: 'React 9.1 — Testing Library căn bản: hỏi theo vai trò, user-event, jest-dom', sub: 'Cùng truy vấn và sự kiện với @testing-library/react', cta: 'Mở bài' })}
${lienKet({ khoa: 'testing', bai: 'tst-6-1-testing-library', title: 'Khoá Testing 6.1 — Testing Library: tìm phần tử theo thứ người dùng thấy', sub: 'Sâu hơn: giao diện bất đồng bộ, MSW cho mạng, và kiểm tiếp cận', cta: 'Mở bài' })}
</div>
`,
};
