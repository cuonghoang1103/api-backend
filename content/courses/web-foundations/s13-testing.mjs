/**
 * Web Foundations — Chương 13: Kiểm thử (unit test, Vitest/Jest, Testing
 * Library, mocking, CI). Song ngữ EN/VI.
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong code escape thành \${.
 */

import { gallery } from './_slides.mjs';

export default {
  title: 'Chapter 13 — Testing|||Chương 13 — Kiểm thử',
  description: 'Chương duy nhất phân biệt người học nghề với người làm nghề. Viết phép kiểm tự động để biết mã còn chạy đúng sau mỗi lần sửa — unit test, kiểm thử giao diện, giả lập mạng, và chạy tất cả trong CI.',
  lessons: [
    /* ─────────────────── 13.0 slide bài giảng ─────────────────── */
    {
      title: '13.0 — Testing in 12 slides|||13.0 — Kiểm thử trong 12 slide',
      slug: 'wf-13-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Tháp ba tầng, Arrange/Act/Assert, Testing Library, giả lập và CI — 12 slide.',
      content: `
<div class="ml-en"><h2>📑 Testing in 12 slides</h2>
<p>Slide 12 is the rule that matters most: break the code on purpose and prove the test goes red.</p>
<p>Skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Kiểm thử trong 12 slide</h2>
<p>Slide 12 là luật quan trọng nhất: cố ý làm hỏng mã và chứng minh test biết chuyển đỏ.</p>
<p>Lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${gallery('wf-test', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Vì sao kiểm bằng tay thất bại"],
  [4, "Tháp ba tầng"],
  [5, "Arrange · Act · Assert"],
  [6, "Matcher chiếm 95% nhu cầu"],
  [7, "Tìm phần tử như một CON NGƯỜI ⭐⭐"],
  [8, "get · query · find"],
  [9, "Giả lập mạng — và nhánh HỎNG"],
  [10, "Điều khiển thời gian, chạy trong CI"],
  [11, "Kiểm BỘ KIỂM trước khi tin nó"],
  [12, "Tự luyện"],
])}
`,
    },

    {
      title: '13.1 — Why tests exist|||13.1 — Kiểm thử để làm gì',
      slug: 'wf-13-1-why-test',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Ba tầng kiểm thử, cái nào đáng viết trước, và vì sao "kiểm bằng tay" thất bại ở lần sửa thứ mười.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>A test is a sentence you write once and check forever</h2>
<p class="lead">Manual testing works fine for the first change. It fails at the tenth, because you stop re-checking the parts you "did not touch" — and those are exactly the parts that break. A test suite re-checks all of them in two seconds, every time.</p>

<h3>The three levels</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Unit</span><span class="v">One function, no network, no DOM. Milliseconds. Write the most of these.</span></div>
  <div class="kv"><span class="k">Integration</span><span class="v">A component with its children, or a route with its service. Seconds. Write a good number.</span></div>
  <div class="kv"><span class="k">End-to-end</span><span class="v">A real browser clicking through a real app (Playwright, Cypress). Minutes. Write a few, for the flows that must never break: log in, pay, submit.</span></div>
</div>
<p class="note-ct">The shape is a pyramid on purpose: many fast tests at the bottom, a handful of slow ones at the top. An inverted pyramid — mostly end-to-end — gives you a suite that takes twenty minutes and fails randomly, and a team that stops trusting it.</p>

<h3>What a good test actually gives you</h3>
<pre><code>1. Permission to change code.  You can refactor without fear, because
   the suite tells you within seconds if you broke something.
2. A description of intent.  A test name says what the code is FOR,
   which is often clearer than the code itself.
3. A bug that never comes back.  Fix a bug, write a test for it,
   and that exact bug can never ship again.</code></pre>

<h3>What to test, and what not to</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Worth testing</span><span class="v">Business rules, calculations, edge cases, anything that has broken before, anything you are afraid to touch.</span></div>
  <div class="kv"><span class="k">Not worth testing</span><span class="v">That React renders a div. That a library works. Exact pixel values, exact HTML structure — those change for good reasons and the test just becomes noise.</span></div>
</div>

<div class="pitfall"><strong>Chasing 100% coverage is a trap.</strong> Coverage measures which lines ran, not whether the assertions were meaningful. A test that calls a function and asserts nothing counts as covered. Aim instead for: every bug you fix gets a test, and every business rule has one.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Một phép kiểm là một câu bạn viết một lần và nó kiểm mãi mãi</h2>
<p class="lead">Kiểm bằng tay ổn ở lần sửa đầu tiên. Nó thất bại ở lần thứ mười, vì bạn thôi không kiểm lại những phần mình "không đụng tới" — mà đó đúng là những phần bị hỏng. Một bộ test kiểm lại tất cả trong hai giây, mỗi lần.</p>

<h3>Ba tầng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Unit</span><span class="v">Một hàm, không mạng, không DOM. Vài mili giây. Viết nhiều nhất loại này.</span></div>
  <div class="kv"><span class="k">Tích hợp</span><span class="v">Một component cùng các con của nó, hoặc một route cùng service. Vài giây. Viết một lượng vừa phải.</span></div>
  <div class="kv"><span class="k">Đầu-cuối (E2E)</span><span class="v">Trình duyệt thật bấm qua ứng dụng thật (Playwright, Cypress). Vài phút. Viết vài cái thôi, cho những luồng không được phép hỏng: đăng nhập, thanh toán, nộp bài.</span></div>
</div>
<p class="note-ct">Hình kim tự tháp là có chủ đích: nhiều test nhanh ở đáy, một nhúm test chậm ở đỉnh. Kim tự tháp ngược — chủ yếu là E2E — cho bạn một bộ test chạy hai mươi phút và thỉnh thoảng đỏ vô cớ, rồi cả nhóm thôi tin nó.</p>

<h3>Test tốt thật sự cho bạn cái gì</h3>
<pre><code>1. Quyền được sửa mã.  Bạn refactor mà không sợ, vì bộ test báo
   trong vài giây nếu bạn làm hỏng thứ gì.
2. Một bản mô tả ý định.  Tên của test nói mã này DÙNG ĐỂ LÀM GÌ,
   thường rõ hơn cả bản thân đoạn mã.
3. Một lỗi không bao giờ quay lại.  Sửa lỗi xong viết test cho nó,
   thì đúng cái lỗi đó không thể lên production lần nữa.</code></pre>

<h3>Kiểm cái gì, và không kiểm cái gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đáng kiểm</span><span class="v">Quy tắc nghiệp vụ, phép tính, trường hợp biên, thứ gì từng hỏng, và thứ gì bạn thấy sợ khi phải sửa.</span></div>
  <div class="kv"><span class="k">Không đáng kiểm</span><span class="v">Rằng React vẽ ra một thẻ div. Rằng thư viện chạy đúng. Giá trị pixel chính xác, cấu trúc HTML chính xác — những thứ đó đổi vì lý do chính đáng, và test chỉ thành tiếng ồn.</span></div>
</div>

<div class="pitfall"><strong>Chạy theo 100% độ phủ là một cái bẫy.</strong> Độ phủ đo dòng nào đã chạy, không đo phép khẳng định có ý nghĩa hay không. Một test gọi hàm rồi không khẳng định gì vẫn được tính là đã phủ. Thay vào đó hãy nhắm: mỗi lỗi bạn sửa đều có một test, và mỗi quy tắc nghiệp vụ đều có một cái.</div>
</div>
`,
    },

    {
      title: '13.2 — Your first unit tests|||13.2 — Những unit test đầu tiên',
      slug: 'wf-13-2-unit-tests',
      type: 'DOCUMENT',
      description: 'Cấu trúc AAA, cú pháp Vitest/Jest, kiểm trường hợp biên, và cách đặt tên test cho người sau đọc được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>Arrange, Act, Assert</h2>
<pre><code>// tinhTien.js
export function tongTien(gio) {
  return gio.reduce((s, m) => s + m.gia * m.soLuong, 0);
}</code></pre>
<pre><code>// tinhTien.test.js
import { describe, it, expect } from 'vitest';
import { tongTien } from './tinhTien';

describe('tongTien', () => {
  it('cộng giá nhân số lượng của mọi món', () => {
    const gio = [                       // Arrange — set up the inputs
      { gia: 100, soLuong: 2 },
      { gia: 50,  soLuong: 1 },
    ];
    const kq = tongTien(gio);           // Act — call the thing
    expect(kq).toBe(250);               // Assert — state the expectation
  });

  it('trả 0 cho giỏ rỗng', () => {
    expect(tongTien([])).toBe(0);
  });
});</code></pre>

<h3>The matchers you will use 95% of the time</h3>
<pre><code>expect(x).toBe(5);                  // ===, for numbers/strings/booleans
expect(obj).toEqual({ a: 1 });      // deep comparison, for objects/arrays
expect(arr).toHaveLength(3);
expect(s).toContain('pizza');
expect(fn).toThrow();               // pass a FUNCTION, not a call
expect(x).toBeNull();               // toBeUndefined, toBeTruthy, toBeFalsy
await expect(p).resolves.toBe(1);   // promises</code></pre>
<div class="pitfall"><strong><code>toBe</code> vs <code>toEqual</code>:</strong> <code>expect({a:1}).toBe({a:1})</code> fails, because two different objects are never <code>===</code>. Use <code>toEqual</code> for anything that is not a primitive. This is the first error almost everyone hits.</div>

<h3>Edge cases are where the value is</h3>
<pre><code>it('không nổ khi giỏ là null', () => {
  expect(() => tongTien(null)).toThrow();
});
it('làm tròn tiền lẻ đúng', () => {
  expect(tongTien([{ gia: 0.1, soLuong: 3 }])).toBeCloseTo(0.3);
});</code></pre>
<p class="note-ct"><strong>Name tests as sentences about behaviour.</strong> <code>it('trả 0 cho giỏ rỗng')</code> tells a future reader what the rule is. <code>it('test 2')</code> tells them nothing, and when it fails they have to read the body to find out what broke.</p>

<h3>Running them</h3>
<pre><code>npm test              # watch mode while you work
npx vitest run        # once, for CI
npx vitest run --coverage</code></pre>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Chuẩn bị · Hành động · Khẳng định</h2>
<pre><code>// tinhTien.js
export function tongTien(gio) {
  return gio.reduce((s, m) => s + m.gia * m.soLuong, 0);
}</code></pre>
<pre><code>// tinhTien.test.js
import { describe, it, expect } from 'vitest';
import { tongTien } from './tinhTien';

describe('tongTien', () => {
  it('cộng giá nhân số lượng của mọi món', () => {
    const gio = [                       // Chuẩn bị — dựng dữ liệu vào
      { gia: 100, soLuong: 2 },
      { gia: 50,  soLuong: 1 },
    ];
    const kq = tongTien(gio);           // Hành động — gọi cái cần kiểm
    expect(kq).toBe(250);               // Khẳng định — nêu kỳ vọng
  });

  it('trả 0 cho giỏ rỗng', () => {
    expect(tongTien([])).toBe(0);
  });
});</code></pre>

<h3>Những matcher chiếm 95% nhu cầu</h3>
<pre><code>expect(x).toBe(5);                  // ===, cho số/chuỗi/boolean
expect(obj).toEqual({ a: 1 });      // so sánh SÂU, cho object/mảng
expect(arr).toHaveLength(3);
expect(s).toContain('pizza');
expect(fn).toThrow();               // truyền một HÀM, không phải lời gọi
expect(x).toBeNull();               // toBeUndefined, toBeTruthy, toBeFalsy
await expect(p).resolves.toBe(1);   // cho promise</code></pre>
<div class="pitfall"><strong><code>toBe</code> khác <code>toEqual</code>:</strong> <code>expect({a:1}).toBe({a:1})</code> sẽ TRƯỢT, vì hai object khác nhau không bao giờ <code>===</code>. Dùng <code>toEqual</code> cho mọi thứ không phải kiểu nguyên thuỷ. Đây là lỗi đầu tiên gần như ai cũng gặp.</div>

<h3>Trường hợp biên mới là chỗ có giá trị</h3>
<pre><code>it('không nổ khi giỏ là null', () => {
  expect(() => tongTien(null)).toThrow();
});
it('làm tròn tiền lẻ đúng', () => {
  expect(tongTien([{ gia: 0.1, soLuong: 3 }])).toBeCloseTo(0.3);
});</code></pre>
<p class="note-ct"><strong>Đặt tên test thành câu mô tả hành vi.</strong> <code>it('trả 0 cho giỏ rỗng')</code> nói cho người đọc sau biết quy tắc là gì. <code>it('test 2')</code> không nói gì cả, và khi nó đỏ thì người ta phải đọc thân hàm mới biết hỏng cái gì.</p>

<h3>Chạy chúng</h3>
<pre><code>npm test              # chế độ theo dõi, dùng khi đang code
npx vitest run        # chạy một lượt, dùng cho CI
npx vitest run --coverage</code></pre>
</div>
`,
    },

    {
      title: '13.3 — Testing UI the way users see it|||13.3 — Kiểm thử giao diện theo cách người dùng thấy',
      slug: 'wf-13-3-testing-library',
      type: 'DOCUMENT',
      description: 'Testing Library, tìm phần tử theo vai trò và nhãn, mô phỏng thao tác người dùng, và vì sao đừng test theo class CSS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Test what the user experiences, not how you built it</h2>
<pre><code>import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

it('tăng số khi bấm nút +', () => {
  render(&lt;Counter /&gt;);

  // find it the way a person would: by its visible label
  const nut = screen.getByRole('button', { name: '+' });
  fireEvent.click(nut);
  fireEvent.click(nut);

  expect(screen.getByText('2')).toBeInTheDocument();
});</code></pre>

<h3>How to find elements, best first</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">getByRole</span><span class="v">Button, heading, textbox, link. Closest to how assistive technology sees the page — prefer this.</span></div>
  <div class="kv"><span class="k">getByLabelText</span><span class="v">Form fields, via their &lt;label&gt;. Doubles as an accessibility check.</span></div>
  <div class="kv"><span class="k">getByText</span><span class="v">Visible copy. Fine, but breaks when wording changes.</span></div>
  <div class="kv"><span class="k">getByTestId</span><span class="v">Last resort, when nothing else identifies the element.</span></div>
</div>
<div class="pitfall"><strong>Do not query by CSS class.</strong> A test that looks for <code>.btn-primary</code> breaks the day a designer renames a class — even though the button still works perfectly. The test is then reporting on your stylesheet, not your behaviour.</div>

<h3>get vs query vs find</h3>
<pre><code>getBy...     // must exist NOW — throws if missing
queryBy...   // may be missing — returns null (use for "should NOT exist")
findBy...    // will exist SOON — returns a Promise (use after async work)

expect(screen.queryByText('Lỗi')).not.toBeInTheDocument();
expect(await screen.findByText('Đã lưu')).toBeInTheDocument();</code></pre>

<h3>A form test that is actually useful</h3>
<pre><code>it('khoá nút Gửi cho tới khi email hợp lệ', () => {
  render(&lt;ContactForm /&gt;);
  const nut = screen.getByRole('button', { name: /gửi/i });

  expect(nut).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'sai-dinh-dang' },
  });
  expect(nut).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'a@b.com' },
  });
  expect(nut).toBeEnabled();
});</code></pre>
<p class="note-ct">This test says something a human cares about: the button unlocks when the email is valid. It will survive a redesign, a class rename, and a refactor from <code>useState</code> to a form library — because none of those change the behaviour it describes.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Kiểm cái người dùng trải nghiệm, không kiểm cách bạn dựng nó</h2>
<pre><code>import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

it('tăng số khi bấm nút +', () => {
  render(&lt;Counter /&gt;);

  // tìm theo cách một CON NGƯỜI sẽ tìm: theo nhãn nhìn thấy được
  const nut = screen.getByRole('button', { name: '+' });
  fireEvent.click(nut);
  fireEvent.click(nut);

  expect(screen.getByText('2')).toBeInTheDocument();
});</code></pre>

<h3>Cách tìm phần tử, tốt nhất xếp trước</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">getByRole</span><span class="v">button, heading, textbox, link. Gần nhất với cách công nghệ hỗ trợ đọc trang — nên ưu tiên.</span></div>
  <div class="kv"><span class="k">getByLabelText</span><span class="v">Ô nhập, qua thẻ &lt;label&gt;. Kiêm luôn một phép kiểm khả năng tiếp cận.</span></div>
  <div class="kv"><span class="k">getByText</span><span class="v">Chữ nhìn thấy được. Dùng được, nhưng đổi câu chữ là hỏng.</span></div>
  <div class="kv"><span class="k">getByTestId</span><span class="v">Phương án cuối, khi không còn gì khác nhận dạng được phần tử.</span></div>
</div>
<div class="pitfall"><strong>Đừng tìm theo class CSS.</strong> Một test đi tìm <code>.btn-primary</code> sẽ đỏ ngay hôm người thiết kế đổi tên class — dù cái nút vẫn chạy hoàn hảo. Lúc đó test đang báo cáo về FILE CSS của bạn, không phải về hành vi.</div>

<h3>get · query · find khác nhau</h3>
<pre><code>getBy...     // phải có NGAY BÂY GIỜ — không có thì ném lỗi
queryBy...   // có thể không có — trả null (dùng cho "KHÔNG được xuất hiện")
findBy...    // SẮP có — trả về Promise (dùng sau việc bất đồng bộ)

expect(screen.queryByText('Lỗi')).not.toBeInTheDocument();
expect(await screen.findByText('Đã lưu')).toBeInTheDocument();</code></pre>

<h3>Một test form thật sự có ích</h3>
<pre><code>it('khoá nút Gửi cho tới khi email hợp lệ', () => {
  render(&lt;ContactForm /&gt;);
  const nut = screen.getByRole('button', { name: /gửi/i });

  expect(nut).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'sai-dinh-dang' },
  });
  expect(nut).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'a@b.com' },
  });
  expect(nut).toBeEnabled();
});</code></pre>
<p class="note-ct">Test này nói một điều con người quan tâm: nút mở khoá khi email hợp lệ. Nó sống sót qua một lần thiết kế lại, một lần đổi tên class, và một lần chuyển từ <code>useState</code> sang thư viện form — vì không cái nào trong đó đổi cái hành vi mà nó mô tả.</p>
</div>
`,
    },

    {
      title: '13.4 — Mocking and tests in CI|||13.4 — Giả lập và chạy test trong CI',
      slug: 'wf-13-4-mocking-ci',
      type: 'DOCUMENT',
      description: 'Giả lập lời gọi mạng, giả lập thời gian, và cấu hình để test chạy tự động ở mỗi lần push.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>A test must not depend on the internet</h2>
<p class="lead">A test that calls a real API is slow, fails when the network hiccups, and breaks when someone else changes the data. Replace the boundary — the network, the clock, the random number — with something you control. That replacement is a <strong>mock</strong>.</p>

<h3>Mocking fetch</h3>
<pre><code>import { vi, it, expect } from 'vitest';

it('hiện danh sách pizza khi API trả về', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{ id: 1, ten: 'Margherita' }],
  });

  render(&lt;MenuPage /&gt;);

  expect(await screen.findByText('Margherita')).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('/api/pizzas');
});</code></pre>

<h3>Test the sad path too — that is where bugs live</h3>
<pre><code>it('hiện thông báo lỗi khi API trả 500', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

  render(&lt;MenuPage /&gt;);

  expect(await screen.findByText(/không tải được/i)).toBeInTheDocument();
});</code></pre>
<p class="note-ct">Most teams test only the happy path, then ship a spinner that spins forever when the server returns 500. The error branch is the one nobody exercises by hand, which is exactly why it deserves a test.</p>

<h3>Controlling time</h3>
<pre><code>vi.useFakeTimers();
render(&lt;Toast /&gt;);
vi.advanceTimersByTime(3000);     // jump forward instantly
expect(screen.queryByRole('alert')).not.toBeInTheDocument();
vi.useRealTimers();</code></pre>
<p>Without fake timers this test would really wait three seconds. With a hundred such tests, your suite takes five minutes instead of five seconds.</p>

<h3>Running tests on every push</h3>
<pre><code># .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci
      - run: npm test -- --run
      - run: npm run build</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">npm ci, not npm install</span><span class="v">Installs exactly what the lock file says. Reproducible, and faster.</span></div>
  <div class="kv"><span class="k">Also run the build</span><span class="v">Tests can pass while the build fails — TypeScript errors, missing imports, bad env. Green tests are not a shipping signal on their own.</span></div>
</div>

<div class="pitfall"><strong>Verify the checker before you trust it.</strong> Break the code on purpose and confirm the test goes red. A test that passes on both the correct and the broken version is worse than no test — it gives you confidence you have not earned.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Một phép kiểm không được phụ thuộc vào Internet</h2>
<p class="lead">Test gọi API thật thì chậm, đỏ mỗi khi mạng hắt hơi, và hỏng khi người khác đổi dữ liệu. Hãy thay cái ranh giới — mạng, đồng hồ, số ngẫu nhiên — bằng thứ bạn kiểm soát được. Cái thay thế đó gọi là <strong>mock</strong> (giả lập).</p>

<h3>Giả lập fetch</h3>
<pre><code>import { vi, it, expect } from 'vitest';

it('hiện danh sách pizza khi API trả về', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{ id: 1, ten: 'Margherita' }],
  });

  render(&lt;MenuPage /&gt;);

  expect(await screen.findByText('Margherita')).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith('/api/pizzas');
});</code></pre>

<h3>Kiểm cả nhánh HỎNG — đó mới là chỗ lỗi ở</h3>
<pre><code>it('hiện thông báo lỗi khi API trả 500', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

  render(&lt;MenuPage /&gt;);

  expect(await screen.findByText(/không tải được/i)).toBeInTheDocument();
});</code></pre>
<p class="note-ct">Phần lớn nhóm chỉ kiểm nhánh thuận, rồi ship một cái spinner quay mãi khi máy chủ trả 500. Nhánh lỗi là nhánh không ai thử bằng tay — chính vì thế nó xứng đáng có một test.</p>

<h3>Điều khiển thời gian</h3>
<pre><code>vi.useFakeTimers();
render(&lt;Toast /&gt;);
vi.advanceTimersByTime(3000);     // nhảy tới tương lai ngay lập tức
expect(screen.queryByRole('alert')).not.toBeInTheDocument();
vi.useRealTimers();</code></pre>
<p>Không có đồng hồ giả thì test này chờ thật ba giây. Có một trăm test như vậy là bộ kiểm chạy năm phút thay vì năm giây.</p>

<h3>Chạy test ở mỗi lần push</h3>
<pre><code># .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci
      - run: npm test -- --run
      - run: npm run build</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">npm ci chứ không npm install</span><span class="v">Cài đúng những gì file lock nói. Tái lập được, và nhanh hơn.</span></div>
  <div class="kv"><span class="k">Chạy cả bản dựng</span><span class="v">Test có thể xanh trong khi build đỏ — lỗi TypeScript, thiếu import, sai biến môi trường. Test xanh một mình KHÔNG phải tín hiệu để ship.</span></div>
</div>

<div class="pitfall"><strong>Kiểm bộ kiểm trước khi tin nó.</strong> Cố ý làm hỏng mã và xác nhận test chuyển sang đỏ. Một test xanh ở cả bản đúng lẫn bản hỏng còn tệ hơn không có test — nó cho bạn một sự yên tâm không có thật.</div>
</div>
`,
    },

    {
      title: '13.5 — Chapter 13 quiz|||13.5 — Kiểm tra chương 13',
      slug: 'wf-13-5-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về tháp kiểm thử, matcher, Testing Library, mocking và CI.',
      content: `
<div class="ml-en"><p class="lead">Six questions on the test pyramid, matchers, queries, mocking and CI.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Many unit, few end-to-end</span><span class="lz-t">the pyramid, not the ice cream cone</span><span class="lz-d">Fast tests get run; slow flaky ones get ignored, then deleted.</span></div>
<div class="lz-node"><span class="lz-k">toEqual for objects</span><span class="lz-t">toBe is ===</span><span class="lz-d">Two separate objects are never ===, no matter how identical their contents.</span></div>
<div class="lz-node"><span class="lz-k">Query by role and label</span><span class="lz-t">never by CSS class</span><span class="lz-d">A renamed class should not turn a working button into a failing test.</span></div>
<div class="lz-node"><span class="lz-k">Break it on purpose</span><span class="lz-t">to prove the test can fail</span><span class="lz-d">A test that passes on broken code is worse than none — it sells you confidence you did not earn.</span></div>
</div></div>
<div class="ml-vi"><p class="lead">Sáu câu về tháp kiểm thử, matcher, cách tìm phần tử, giả lập và CI.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Nhiều unit, ít E2E</span><span class="lz-t">kim tự tháp, không phải cây kem ốc quế</span><span class="lz-d">Test nhanh thì người ta chạy; test chậm và chập chờn thì bị bỏ qua, rồi bị xoá.</span></div>
<div class="lz-node"><span class="lz-k">toEqual cho object</span><span class="lz-t">toBe là ===</span><span class="lz-d">Hai object riêng biệt không bao giờ ===, dù ruột giống hệt nhau.</span></div>
<div class="lz-node"><span class="lz-k">Tìm theo role và label</span><span class="lz-t">đừng bao giờ theo class CSS</span><span class="lz-d">Đổi tên một class không nên biến cái nút đang chạy tốt thành một test đỏ.</span></div>
<div class="lz-node"><span class="lz-k">Cố ý làm hỏng</span><span class="lz-t">để chứng minh test BIẾT đỏ</span><span class="lz-d">Test xanh trên mã hỏng còn tệ hơn không có — nó bán cho bạn sự yên tâm bạn chưa xứng đáng có.</span></div>
</div></div>
`,
      quiz: {
        timeLimitSeconds: 480,
        questions: [
          {
            question: 'Which level should you have the MOST of?|||Tầng nào nên có NHIỀU NHẤT?',
            options: ['Unit|||Unit', 'Integration|||Tích hợp', 'End-to-end|||Đầu-cuối (E2E)', 'Manual|||Kiểm bằng tay'],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'expect({ a: 1 }).toBe({ a: 1 }) — what happens?|||expect({ a: 1 }).toBe({ a: 1 }) — chuyện gì xảy ra?',
            options: [
              'It fails — two objects are never ===, use toEqual|||Trượt — hai object không bao giờ ===, phải dùng toEqual',
              'It passes — the contents match|||Đạt — ruột giống nhau',
              'It throws a syntax error|||Ném lỗi cú pháp',
              'It passes only in Vitest|||Chỉ đạt trong Vitest',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which query should you prefer in Testing Library?|||Trong Testing Library nên ưu tiên cách tìm nào?',
            options: [
              'getByRole|||getByRole',
              'querySelector with a CSS class|||querySelector theo class CSS',
              'getByTestId|||getByTestId',
              'Searching the HTML string|||Tìm trong chuỗi HTML',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You need to assert something is NOT on the page. Which query?|||Bạn cần khẳng định một thứ KHÔNG có trên trang. Dùng cách nào?',
            options: ['queryBy...|||queryBy...', 'getBy...|||getBy...', 'findBy...|||findBy...', 'renderBy...|||renderBy...'],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why mock fetch in a test?|||Vì sao phải giả lập fetch trong test?',
            options: [
              'So the test is fast and does not depend on the network or someone else data|||Để test nhanh và không phụ thuộc mạng hay dữ liệu của người khác',
              'Because fetch does not exist in Node|||Vì Node không có fetch',
              'To increase the coverage number|||Để tăng con số độ phủ',
              'Mocking is only needed for POST requests|||Chỉ cần giả lập cho request POST',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your whole suite is green. What still needs checking before you ship?|||Cả bộ test đều xanh. Trước khi ship còn phải kiểm gì nữa?',
            options: [
              'That the build passes, and that the tests actually fail on broken code|||Bản dựng có xanh không, và test có THẬT SỰ đỏ khi mã hỏng không',
              'Nothing — green tests mean it is ready|||Không gì cả — test xanh là xong',
              'Only the coverage percentage|||Chỉ cần xem phần trăm độ phủ',
              'That every file has at least one test|||Mọi file đều có ít nhất một test',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
