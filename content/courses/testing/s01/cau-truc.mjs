/**
 * Testing · Chương 1 · 1.1 — Giải phẫu một test: chuẩn bị, hành động, khẳng định. Slug giữ từ khung: tst-1-1-cau-truc.
 * Mọi code/output lấy từ ./_ma.mjs (sinh từ dự án chạy thật).
 */
import G from '../giang/tst-01-1.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const BANG_EN = `<table>
<thead><tr><th>Call</th><th>Result</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>checkSlot('08:00', '10:00')</code></td><td><code>{ ok: true, minutes: 120 }</code></td><td>on the grid, inside hours, 2 h</td></tr>
<tr><td><code>checkSlot('08:15', '09:00')</code></td><td><code>{ ok: false, code: 'OFF_GRID' }</code></td><td>08:15 is not a multiple of 30 min</td></tr>
<tr><td><code>checkSlot('06:30', '08:00')</code></td><td><code>{ ok: false, code: 'OUTSIDE_HOURS' }</code></td><td>starts before 07:00</td></tr>
<tr><td><code>needsApproval({ seats: 31, role: 'STUDENT' })</code></td><td><code>true</code></td><td>BR-06: more than 30</td></tr>
<tr><td><code>needsApproval({ seats: 31, role: 'LECTURER' })</code></td><td><code>false</code></td><td>Lite-2: lecturers never need approval</td></tr>
<tr><td><code>needsApproval({ seats: 0, role: 'STUDENT' })</code></td><td>throws <code>RangeError</code></td><td>seats must be a positive integer</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Lời gọi</th><th>Kết quả</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td><code>checkSlot('08:00', '10:00')</code></td><td><code>{ ok: true, minutes: 120 }</code></td><td>đúng lưới, trong giờ, 2 tiếng</td></tr>
<tr><td><code>checkSlot('08:15', '09:00')</code></td><td><code>{ ok: false, code: 'OFF_GRID' }</code></td><td>08:15 không chia hết cho 30 phút</td></tr>
<tr><td><code>checkSlot('06:30', '08:00')</code></td><td><code>{ ok: false, code: 'OUTSIDE_HOURS' }</code></td><td>bắt đầu trước 07:00</td></tr>
<tr><td><code>needsApproval({ seats: 31, role: 'STUDENT' })</code></td><td><code>true</code></td><td>BR-06: trên 30 chỗ</td></tr>
<tr><td><code>needsApproval({ seats: 31, role: 'LECTURER' })</code></td><td><code>false</code></td><td>Lite-2: giảng viên không cần duyệt</td></tr>
<tr><td><code>needsApproval({ seats: 0, role: 'STUDENT' })</code></td><td>ném <code>RangeError</code></td><td>số chỗ phải là số nguyên dương</td></tr>
</tbody>
</table>`;

const JUNIT_EN = `<table>
<thead><tr><th>JUnit 5 (SWT301, Java)</th><th>Vitest (this course)</th><th>Note</th></tr></thead>
<tbody>
<tr><td><code>class BookingTest { … }</code></td><td><code>describe('Booking', () =&gt; { … })</code></td><td>a group of tests</td></tr>
<tr><td><code>@Test void needsApprovalAbove30()</code></td><td><code>it('needs approval above 30 seats', () =&gt; { … })</code></td><td>one test; the name is a sentence</td></tr>
<tr><td><code>@DisplayName("…")</code></td><td>the string passed to <code>it</code></td><td>what the report shows</td></tr>
<tr><td><code>assertEquals(expected, actual)</code></td><td><code>expect(actual).toBe(expected)</code></td><td><strong>order is reversed</strong></td></tr>
<tr><td><code>@BeforeEach</code></td><td><code>beforeEach(() =&gt; { … })</code></td><td>shared Arrange</td></tr>
<tr><td><code>assertThrows(X.class, () -&gt; …)</code></td><td><code>expect(() =&gt; …).toThrow(X)</code></td><td>lesson 1.2</td></tr>
</tbody>
</table>`;
const JUNIT_VI = `<table>
<thead><tr><th>JUnit 5 (SWT301, Java)</th><th>Vitest (khoá này)</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td><code>class BookingTest { … }</code></td><td><code>describe('Booking', () =&gt; { … })</code></td><td>một nhóm test</td></tr>
<tr><td><code>@Test void needsApprovalAbove30()</code></td><td><code>it('needs approval above 30 seats', () =&gt; { … })</code></td><td>một test; tên là một câu</td></tr>
<tr><td><code>@DisplayName("…")</code></td><td>chuỗi truyền vào <code>it</code></td><td>thứ hiện trong báo cáo</td></tr>
<tr><td><code>assertEquals(expected, actual)</code></td><td><code>expect(actual).toBe(expected)</code></td><td><strong>thứ tự bị đảo</strong></td></tr>
<tr><td><code>@BeforeEach</code></td><td><code>beforeEach(() =&gt; { … })</code></td><td>phần Arrange dùng chung</td></tr>
<tr><td><code>assertThrows(X.class, () -&gt; …)</code></td><td><code>expect(() =&gt; …).toThrow(X)</code></td><td>bài 1.2</td></tr>
</tbody>
</table>`;

export default {
  title: '1.1 — Anatomy of a test: arrange, act, assert|||1.1 — Giải phẫu một test: chuẩn bị, hành động, khẳng định',
  slug: 'tst-1-1-cau-truc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Code LabFlow Lite cần test cả chương (checkSlot, needsApproval, createBooking); describe/it/expect; mẫu Arrange–Act–Assert; test không có khẳng định luôn xanh và requireAssertions; mỗi test một lý do để đỏ, expect.soft; F.I.R.S.T.; ánh xạ JUnit ↔ Vitest và bẫy đảo tham số.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Anatomy of a test: arrange, act, assert</h2>
<p class="lead">You can already make Vitest print green ticks. This lesson is about what goes <em>inside</em> a test so that a green tick means something — and a red one tells you exactly what broke.</p>

<h3>The code you will test all chapter</h3>
<p>Add <code>src/rules/booking.js</code> next to the <code>time.js</code> from lesson 0.3. It holds LabFlow Lite’s booking rules:</p>
${ma('javascript', CODE.booking)}
<p>A few calls and their results, so you can read the rules as behaviour:</p>
${BANG_EN}
<p>Two folders from now on: <code>src/rules/*.test.js</code> is the <strong>real suite</strong> you keep; <code>demo/</code> holds experiments for each lesson, including deliberately bad tests. Vitest runs both with <code>npm test</code>; later chapters run only <code>src/</code> in CI.</p>

<h3>The parts of a test</h3>
<ul>
<li><code>describe('createBooking', …)</code> — a <strong>group</strong>, named after the unit under test. Groups can nest.</li>
<li><code>it('confirms a 20-seat student booking', …)</code> — <strong>one test</strong>. The name is a sentence that must be true; together with the describe names it forms the line in the report.</li>
<li><code>expect(actual)</code> — wraps the value the code produced.</li>
<li><code>.toBe(expected)</code> — the <strong>matcher</strong>: the comparison and the value it should equal.</li>
</ul>

<h3>Arrange · Act · Assert</h3>
${ma('javascript', CODE.aaa)}
<p>The first test has the three-paragraph shape that experienced developers expect:</p>
<ol>
<li><strong>Arrange</strong> — build exactly the input this test needs and nothing more. Here: one booking with 31 seats by a student.</li>
<li><strong>Act</strong> — call the one behaviour under test, once.</li>
<li><strong>Assert</strong> — check the result against the rule: BR-06 says more than 30 seats needs approval, so the status must be <code>PENDING</code>.</li>
</ol>
<p>Blank lines between the three are enough; the comments are there for teaching. When a test has no natural Arrange (a one-liner like <code>expect(parseTime('07:00')).toBe(420)</code>), it is fine to merge the three into one line — the shape is a reading aid, not a law.</p>
${ra(OUT['11-aaa'])}

<div class="pitfall co-tieu-de">
<p><strong>Trap — the second test is green and checks nothing.</strong> <code>checks nothing at all</code> calls <code>createBooking</code> and stops. It passes because there is no line in it that <em>can</em> fail; it only proves the call did not throw. In a report of 400 tests nobody notices. Make the runner notice instead:</p>
${ma('javascript', CODE.strictConfig)}
${ra(OUT['11-require'])}
<p>With <code>requireAssertions: true</code> every test must call <code>expect</code> at least once. Put it in your main <code>vitest.config.js</code> once you are comfortable — the mistake then cannot reach the main branch.</p>
</div>

<h3>One test, one reason to fail</h3>
${ma('javascript', CODE.nhieu)}
${ra(OUT['11-nhieu'])}
<p>Three problems in one red line. The first failing <code>expect</code> <em>throws</em>, so the next two lines never run — is <code>minutes</code> right? is <code>lab</code> right? You cannot know until you fix the first one and run again. And “booking works” describes nothing: when it is red on CI at night, the name gives the person on call no clue.</p>
<p>The usual fix is to <strong>split</strong> into tests that each state one fact (the solution to the practice task below). When several fields really describe <em>one</em> behaviour and you want all problems at once, use <code>expect.soft</code>, which records the failure and keeps going:</p>
${ma('javascript', CODE.soft)}
${ra(OUT['11-soft'])}
<p>Both failures are reported — the wrong status and the wrong minutes — and the test still fails as a whole. Use it sparingly; most of the time, separate tests with good names are clearer.</p>

<h3>F.I.R.S.T. — five properties of a good unit test</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fast</span><span class="v">Milliseconds. You will run the suite hundreds of times a day; slow tests get skipped.</span></div>
  <div class="kv"><span class="k">Isolated</span><span class="v">No test depends on another test, on order, or on shared state left behind.</span></div>
  <div class="kv"><span class="k">Repeatable</span><span class="v">Same result on every machine, every time: no real clock, network or randomness (Chapter 2 shows how to control them).</span></div>
  <div class="kv"><span class="k">Self-validating</span><span class="v">The test decides pass or fail itself — nobody reads a log to judge.</span></div>
  <div class="kv"><span class="k">Timely</span><span class="v">Written together with the code, not weeks later “if there is time”.</span></div>
</div>
<p>The acronym was popularised by Robert C. Martin’s <em>Clean Code</em> (2008). The tests in this lesson are all five: pure functions, no I/O, no shared state.</p>

<h3>From JUnit (SWT301) to Vitest</h3>
${JUNIT_EN}
<p>The order of arguments is the classic slip for anyone moving between the two. In JUnit you write the expected value first; in Vitest the <em>actual</em> value goes into <code>expect</code>. Swap them and the test still fails — but the message describes it backwards:</p>
${ma('javascript', CODE.dao)}
${ra(OUT['11-dao'])}
<p>Read it literally: “expected 420 to be 450” — Vitest believes 420 is what the code produced. Whenever a failure message seems to talk nonsense, check the argument order first.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>In <code>demo/th11.test.js</code>, write an Arrange–Act–Assert test: a <strong>lecturer</strong> books BE-201 for <strong>31</strong> seats from 13:00 to 15:30; the booking is <code>CONFIRMED</code>.</li>
<li>Add a second test for the same booking: it lasts <strong>150</strong> minutes. Run <code>npx vitest run demo/th11.test.js</code>.</li>
<li>Copy “booking works” into <code>demo/tach.test.js</code> and split it into three tests, one fact each, inside a <code>describe</code> that names the situation.</li>
<li>Run the AAA demo with the strict config and watch “checks nothing at all” turn red.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th11)}
${ra(OUT['11-th'])}
${ma('javascript', CODE.tach)}
${ra(OUT['11-tach'])}
<p><strong>Done when:</strong> <code>th11</code> shows <code>2 passed</code>; the split file reports three tests whose names alone tell you what broke; and the strict config turns the no-assertion test red with “expected any number of assertion, but got none”.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Arrange · Act · Assert (AAA)</span><span class="v">The three parts of a test: build the input, call the behaviour, check the result.</span></div>
  <div class="kv"><span class="k">assertion</span><span class="v">A check that can fail, e.g. <code>expect(x).toBe(y)</code>.</span></div>
  <div class="kv"><span class="k">requireAssertions</span><span class="v">Vitest option: a test without any assertion fails.</span></div>
  <div class="kv"><span class="k">expect.soft</span><span class="v">An assertion that records its failure and lets the test continue.</span></div>
  <div class="kv"><span class="k">F.I.R.S.T.</span><span class="v">Fast, Isolated, Repeatable, Self-validating, Timely.</span></div>
  <div class="kv"><span class="k">unit under test</span><span class="v">The function or module a test is about — what you name the <code>describe</code> after.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 Arrange · Act · Assert</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Arrange</div><div class="lz-d">prepare the input: a booking, a role, a time</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Act</div><div class="lz-d">call the one function under test</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Assert</div><div class="lz-d">compare the result with what the rule says</div></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li><code>describe</code> groups, <code>it</code> states one fact, <code>expect(actual).toBe(expected)</code> checks it.</li>
<li>Arrange · Act · Assert: build the input, call one behaviour, check the result.</li>
<li>A test without an assertion is always green; <code>requireAssertions</code> turns that mistake red.</li>
<li>One reason to fail per test; the first failing <code>expect</code> hides the rest — split, or use <code>expect.soft</code> for one behaviour.</li>
<li>Good unit tests are F.I.R.S.T.</li>
<li>JUnit puts the expected value first, Vitest puts the actual value in <code>expect</code> — swapped arguments produce a backwards message.</li>
</ul>
${lienKet({ bai: 'swt301-lab2-vi-du-login', title: 'Also in SWT301 — L2.13: a full worked example, AuthService.login', sub: 'Same: one test per case, Arrange builds the condition, Act calls exactly one function, Assert compares with the expected result. Different: SWT301 writes it in JUnit with mocks and maps each test to a UTCID column of Report 5.1; here it is Vitest on pure LabFlow Lite rules.', cta: 'OPEN SWT301 LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Giải phẫu một test: chuẩn bị, hành động, khẳng định</h2>
<p class="lead">Bạn đã làm Vitest in được dấu tích xanh. Bài này nói về thứ nằm <em>bên trong</em> một test, để một dấu xanh thật sự có ý nghĩa — và một dấu đỏ cho bạn biết chính xác cái gì hỏng.</p>

<h3>Code bạn sẽ test suốt chương</h3>
<p>Thêm <code>src/rules/booking.js</code> cạnh file <code>time.js</code> ở bài 0.3. File này chứa luật đặt phòng của LabFlow Lite:</p>
${ma('javascript', CODE.booking)}
<p>Vài lời gọi và kết quả của chúng, để bạn đọc luật như đọc hành vi:</p>
${BANG_VI}
<p>Từ giờ có hai thư mục: <code>src/rules/*.test.js</code> là <strong>bộ test thật</strong> bạn giữ lại; <code>demo/</code> chứa các thí nghiệm của từng bài, kể cả những test cố ý viết sai. <code>npm test</code> chạy cả hai; các chương sau chỉ chạy <code>src/</code> trong CI.</p>

<h3>Các phần của một test</h3>
<ul>
<li><code>describe('createBooking', …)</code> — một <strong>nhóm</strong>, đặt tên theo đơn vị đang được test. Nhóm có thể lồng nhau.</li>
<li><code>it('confirms a 20-seat student booking', …)</code> — <strong>một test</strong>. Tên là một câu phải đúng; ghép với tên describe thành một dòng trong báo cáo.</li>
<li><code>expect(actual)</code> — bọc giá trị mà code tạo ra.</li>
<li><code>.toBe(expected)</code> — <strong>matcher (bộ so khớp)</strong>: phép so sánh và giá trị đáng lẽ phải bằng.</li>
</ul>

<h3>Arrange · Act · Assert (chuẩn bị · hành động · khẳng định)</h3>
${ma('javascript', CODE.aaa)}
<p>Test thứ nhất có hình dạng ba đoạn mà lập trình viên có kinh nghiệm luôn mong thấy:</p>
<ol>
<li><strong>Arrange (chuẩn bị)</strong> — dựng đúng dữ liệu vào mà test này cần, không thừa. Ở đây: một lượt đặt 31 chỗ của sinh viên.</li>
<li><strong>Act (hành động)</strong> — gọi đúng một hành vi đang được test, một lần.</li>
<li><strong>Assert (khẳng định)</strong> — so kết quả với luật: BR-06 nói trên 30 chỗ thì cần duyệt, nên trạng thái phải là <code>PENDING</code>.</li>
</ol>
<p>Chỉ cần dòng trống ngăn ba phần; các dòng chú thích là để dạy. Khi test không có phần chuẩn bị tự nhiên (kiểu một dòng <code>expect(parseTime('07:00')).toBe(420)</code>), gộp ba phần vào một dòng là hoàn toàn ổn — hình dạng này giúp đọc, không phải luật cứng.</p>
${ra(OUT['11-aaa'])}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — test thứ hai xanh mà chẳng kiểm gì.</strong> <code>checks nothing at all</code> gọi <code>createBooking</code> rồi dừng. Nó đạt vì bên trong không có dòng nào <em>có thể</em> hỏng; nó chỉ chứng minh lời gọi không ném lỗi. Trong một báo cáo 400 test, không ai để ý. Hãy để bộ chạy để ý thay bạn:</p>
${ma('javascript', CODE.strictConfig)}
${ra(OUT['11-require'])}
<p>Với <code>requireAssertions: true</code>, test nào cũng phải gọi <code>expect</code> ít nhất một lần. Khi đã quen, hãy đưa nó vào <code>vitest.config.js</code> chính — lỗi này sẽ không lọt vào nhánh chính được nữa.</p>
</div>

<h3>Mỗi test một lý do để đỏ</h3>
${ma('javascript', CODE.nhieu)}
${ra(OUT['11-nhieu'])}
<p>Ba vấn đề trong một dòng đỏ. <code>expect</code> hỏng đầu tiên <em>ném lỗi</em>, nên hai dòng sau không bao giờ chạy — <code>minutes</code> có đúng không? <code>lab</code> có đúng không? Bạn không biết cho tới khi sửa xong cái đầu và chạy lại. Còn cái tên "booking works" chẳng mô tả gì: khi nó đỏ trên CI lúc nửa đêm, người trực nhìn tên mà chẳng có manh mối nào.</p>
<p>Cách sửa thường dùng là <strong>tách</strong> ra thành các test, mỗi test nói một sự thật (chính là lời giải bài thực hành bên dưới). Khi vài trường thật sự mô tả <em>một</em> hành vi và bạn muốn thấy mọi vấn đề cùng lúc, dùng <code>expect.soft</code> — nó ghi nhận lỗi rồi kiểm tiếp:</p>
${ma('javascript', CODE.soft)}
${ra(OUT['11-soft'])}
<p>Cả hai lỗi đều được báo — trạng thái sai và số phút sai — và cả test vẫn tính là hỏng. Dùng tiết kiệm thôi; phần lớn trường hợp, các test riêng có tên tốt dễ hiểu hơn.</p>

<h3>F.I.R.S.T. — năm tính chất của một unit test tốt</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fast (nhanh)</span><span class="v">Tính bằng mili-giây. Bạn sẽ chạy bộ test hàng trăm lần mỗi ngày; test chậm sẽ bị bỏ qua.</span></div>
  <div class="kv"><span class="k">Isolated (độc lập)</span><span class="v">Không test nào phụ thuộc test khác, thứ tự chạy, hay trạng thái bị bỏ lại.</span></div>
  <div class="kv"><span class="k">Repeatable (lặp lại được)</span><span class="v">Kết quả như nhau trên mọi máy, mọi lần: không đồng hồ thật, không mạng, không ngẫu nhiên (Chương 2 chỉ cách kiểm soát chúng).</span></div>
  <div class="kv"><span class="k">Self-validating (tự phán)</span><span class="v">Test tự quyết đạt hay hỏng — không ai phải đọc log để phán.</span></div>
  <div class="kv"><span class="k">Timely (đúng lúc)</span><span class="v">Viết cùng lúc với code, không phải vài tuần sau "nếu còn thời gian".</span></div>
</div>
<p>Chữ viết tắt này được phổ biến qua cuốn <em>Clean Code</em> (2008) của Robert C. Martin. Các test trong bài đều đạt cả năm: hàm thuần, không vào/ra dữ liệu, không trạng thái dùng chung.</p>

<h3>Từ JUnit (SWT301) sang Vitest</h3>
${JUNIT_VI}
<p>Thứ tự tham số là chỗ trượt kinh điển khi chuyển qua lại giữa hai bên. Trong JUnit bạn viết giá trị mong đợi trước; trong Vitest giá trị <em>thực tế</em> đi vào <code>expect</code>. Đảo ngược thì test vẫn hỏng — nhưng thông báo kể ngược câu chuyện:</p>
${ma('javascript', CODE.dao)}
${ra(OUT['11-dao'])}
<p>Đọc đúng từng chữ: "expected 420 to be 450" — Vitest tưởng 420 là thứ code tạo ra. Mỗi khi thông báo lỗi nghe vô lý, hãy kiểm thứ tự tham số trước tiên.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Trong <code>demo/th11.test.js</code>, viết một test dạng Arrange–Act–Assert: một <strong>giảng viên</strong> đặt BE-201 cho <strong>31</strong> chỗ từ 13:00 tới 15:30; lượt đặt phải là <code>CONFIRMED</code>.</li>
<li>Thêm test thứ hai cho cùng lượt đặt: nó dài <strong>150</strong> phút. Chạy <code>npx vitest run demo/th11.test.js</code>.</li>
<li>Chép "booking works" sang <code>demo/tach.test.js</code> và tách thành ba test, mỗi test một sự thật, nằm trong một <code>describe</code> gọi tên tình huống.</li>
<li>Chạy demo AAA với cấu hình strict và nhìn "checks nothing at all" chuyển đỏ.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th11)}
${ra(OUT['11-th'])}
${ma('javascript', CODE.tach)}
${ra(OUT['11-tach'])}
<p><strong>Đạt khi:</strong> <code>th11</code> hiện <code>2 passed</code>; file tách báo ba test mà chỉ nhìn tên là biết cái gì hỏng; và cấu hình strict làm test không khẳng định đỏ với "expected any number of assertion, but got none".</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Arrange · Act · Assert — AAA (chuẩn bị · hành động · khẳng định)</span><span class="v">Ba phần của một test: dựng dữ liệu vào, gọi hành vi, kiểm kết quả.</span></div>
  <div class="kv"><span class="k">assertion (khẳng định)</span><span class="v">Một phép kiểm có thể hỏng, vd <code>expect(x).toBe(y)</code>.</span></div>
  <div class="kv"><span class="k">requireAssertions</span><span class="v">Tuỳ chọn của Vitest: test không có khẳng định nào thì tính là hỏng.</span></div>
  <div class="kv"><span class="k">expect.soft (khẳng định mềm)</span><span class="v">Khẳng định ghi nhận lỗi rồi để test chạy tiếp.</span></div>
  <div class="kv"><span class="k">F.I.R.S.T.</span><span class="v">Fast, Isolated, Repeatable, Self-validating, Timely — nhanh, độc lập, lặp lại được, tự phán, đúng lúc.</span></div>
  <div class="kv"><span class="k">unit under test (đơn vị đang test)</span><span class="v">Hàm hay module mà test nói về — thứ bạn dùng để đặt tên <code>describe</code>.</span></div>
</div>

<h3>🗺 Arrange · Act · Assert</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Arrange</div><div class="lz-d">chuẩn bị đầu vào: lượt đặt, vai trò, giờ</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Act</div><div class="lz-d">gọi đúng một hàm đang được test</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Assert</div><div class="lz-d">so kết quả với điều luật nói</div></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li><code>describe</code> gom nhóm, <code>it</code> nói một sự thật, <code>expect(actual).toBe(expected)</code> kiểm nó.</li>
<li>Arrange · Act · Assert: dựng dữ liệu vào, gọi một hành vi, kiểm kết quả.</li>
<li>Test không có khẳng định thì luôn xanh; <code>requireAssertions</code> biến lỗi đó thành đỏ.</li>
<li>Mỗi test một lý do để đỏ; <code>expect</code> hỏng đầu tiên che mất phần còn lại — tách ra, hoặc dùng <code>expect.soft</code> cho một hành vi.</li>
<li>Unit test tốt thì F.I.R.S.T.</li>
<li>JUnit đặt giá trị mong đợi trước, Vitest đặt giá trị thực tế vào <code>expect</code> — đảo tham số là thông báo lỗi nói ngược.</li>
</ul>
${lienKet({ bai: 'swt301-lab2-vi-du-login', title: 'Đã gặp ở SWT301 — L2.13: ví dụ trọn vòng AuthService.login', sub: 'Giống: mỗi test một case, Arrange dựng Condition, Act gọi đúng một hàm, Assert so với kết quả mong đợi. Khác: SWT301 viết bằng JUnit có mock và gắn mỗi test với một cột UTCID của Report 5.1; ở đây là Vitest trên luật thuần của LabFlow Lite.', cta: 'MỞ BÀI SWT301 →' })}
</div>
`,
};
