/**
 * Testing · Chương 2 · 2.3 — Test lỗi và các nhánh thất bại. Slug giữ từ khung: tst-2-3-loi.
 * Mọi code/output lấy từ ./_ma.mjs (chạy thật; thí nghiệm xoá try/catch = OUT['23-no-catch']).
 */
import G from '../giang/tst-02-3.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const DONG = CODE.service.split('\n');
const LOP_LOI = DONG.slice(2, 9).join('\n');      // class BookingError
const NHANH_CATCH = DONG.slice(32, 39).join('\n'); // try/catch quanh findOverlap

const DOAN_EN = `<table>
<thead><tr><th>Failure path</th><th>How to provoke it in a test</th><th>What the test asserts</th></tr></thead>
<tbody>
<tr><td>Invalid input</td><td>06:00, 08:15, 08:00–12:30, seats 0</td><td>the rule code; the repository is never called</td></tr>
<tr><td>Conflict</td><td>book the same slot twice</td><td><code>OVERLAP</code></td></tr>
<tr><td>Dependency down on read</td><td>a repository whose <code>findOverlap</code> throws</td><td><code>STORAGE_DOWN</code> + the original <code>cause</code></td></tr>
<tr><td>Dependency fails on write</td><td>a repository whose <code>insert</code> throws</td><td><code>STORAGE_DOWN</code></td></tr>
<tr><td>Dependency never answers</td><td>a promise that never settles + fake timers</td><td>a timeout error (Chapter 3 adds the timeout)</td></tr>
<tr><td>Partial success</td><td>the first of two writes succeeds, the second throws</td><td>nothing half-saved (Chapter 4, transactions)</td></tr>
</tbody>
</table>`;
const DOAN_VI = `<table>
<thead><tr><th>Nhánh thất bại</th><th>Cách gây ra trong test</th><th>Test khẳng định gì</th></tr></thead>
<tbody>
<tr><td>Đầu vào không hợp lệ</td><td>06:00, 08:15, 08:00–12:30, 0 chỗ</td><td>mã luật; repository không bao giờ bị gọi</td></tr>
<tr><td>Xung đột</td><td>đặt cùng khung giờ hai lần</td><td><code>OVERLAP</code></td></tr>
<tr><td>Phụ thuộc chết lúc đọc</td><td>repository có <code>findOverlap</code> ném lỗi</td><td><code>STORAGE_DOWN</code> + <code>cause</code> gốc</td></tr>
<tr><td>Phụ thuộc hỏng lúc ghi</td><td>repository có <code>insert</code> ném lỗi</td><td><code>STORAGE_DOWN</code></td></tr>
<tr><td>Phụ thuộc không bao giờ trả lời</td><td>promise không bao giờ ngã ngũ + fake timers</td><td>lỗi quá giờ (Chương 3 thêm cơ chế timeout)</td></tr>
<tr><td>Thành công một nửa</td><td>lần ghi đầu thành công, lần thứ hai ném lỗi</td><td>không có gì bị lưu dở dang (Chương 4, transaction)</td></tr>
</tbody>
</table>`;
const TRA_EN = `<table>
<thead><tr><th>Code under test</th><th>Assertion</th></tr></thead>
<tbody>
<tr><td>a synchronous function throws</td><td><code>expect(() =&gt; fn()).toThrow(RangeError)</code> — wrap the call in a function</td></tr>
<tr><td>an async function rejects</td><td><code>await expect(fn()).rejects.toThrow(BookingError)</code></td></tr>
<tr><td>you need the code or the cause</td><td><code>await expect(p).rejects.toMatchObject({ code: 'X' })</code></td></tr>
<tr><td>several checks on one error</td><td><code>const e = await p.catch((e) =&gt; e);</code> then <code>expect(e)…</code></td></tr>
<tr><td>avoid</td><td>try/catch without an assertion guard · <code>toThrow()</code> with no argument (accepts <em>any</em> error, even a typo’s <code>TypeError</code>)</td></tr>
</tbody>
</table>`;
const TRA_VI = `<table>
<thead><tr><th>Code được test</th><th>Cách khẳng định</th></tr></thead>
<tbody>
<tr><td>hàm đồng bộ ném lỗi</td><td><code>expect(() =&gt; fn()).toThrow(RangeError)</code> — bọc lời gọi trong một hàm</td></tr>
<tr><td>hàm bất đồng bộ từ chối</td><td><code>await expect(fn()).rejects.toThrow(BookingError)</code></td></tr>
<tr><td>cần mã lỗi hoặc nguyên nhân</td><td><code>await expect(p).rejects.toMatchObject({ code: 'X' })</code></td></tr>
<tr><td>kiểm nhiều điều trên một lỗi</td><td><code>const e = await p.catch((e) =&gt; e);</code> rồi <code>expect(e)…</code></td></tr>
<tr><td>nên tránh</td><td>try/catch không có chốt chặn khẳng định · <code>toThrow()</code> không tham số (chấp nhận <em>mọi</em> lỗi, kể cả <code>TypeError</code> do gõ nhầm)</td></tr>
</tbody>
</table>`;

export default {
  title: '2.3 — Testing errors and failure paths: codes, causes and the catch branch nobody tests|||2.3 — Test lỗi và các nhánh thất bại: mã lỗi, nguyên nhân và nhánh catch không ai test',
  slug: 'tst-2-3-loi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lỗi là một phần hợp đồng: BookingError có code ổn định và cause; khẳng định lớp, mã, thông điệp, nguyên nhân; repository hỏng tự dựng để đi vào nhánh catch (ECONNREFUSED → STORAGE_DOWN); thí nghiệm xoá try/catch chỉ một test nhận ra; bẫy try/catch xanh khi không có gì ném và hai cách sửa; bảng đoán lỗi (error guessing của SWT301) viết thành test.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Testing errors and failure paths</h2>
<p class="lead">On your laptop the database is always up, the disk is never full and the network never drops. So the code that handles those situations is the code that has <em>never run</em> before it meets its first real outage. This lesson makes errors part of the contract and gives you a simple tool to reach every <code>catch</code> branch on purpose.</p>

<h3>Errors are part of the contract</h3>
<p>The error class from <code>src/booking/service.js</code>:</p>
${ma('javascript', LOP_LOI)}
<p>A good application error carries three things:</p>
<ul>
<li>a <strong>class</strong> (<code>BookingError</code>), so callers can tell “our” errors from bugs such as a <code>TypeError</code>;</li>
<li>a stable <strong>code</strong> (<code>OVERLAP</code>, <code>STORAGE_DOWN</code>…). The API maps codes to HTTP statuses (Chapter 5: <code>OVERLAP</code> → 409 Conflict, <code>STORAGE_DOWN</code> → 503), the UI maps them to friendly sentences, and <strong>tests assert the code</strong> — not the wording, which someone will improve next month;</li>
<li>a <strong>cause</strong>: <code>new Error(message, { cause })</code> is standard JavaScript (ES2022). The low-level error — the real driver message — is kept for the logs while the user sees a clean code.</li>
</ul>

<h3>Asserting an error: class, code, message</h3>
${ma('javascript', CODE.loi)}
${ra(OUT['23-loi'])}
<ul>
<li><code>.catch((e) =&gt; e)</code> turns the rejection into an ordinary value, so one error can be checked several ways. If the promise <em>resolves</em> instead, <code>error</code> is the booking, and <code>toBeInstanceOf(BookingError)</code> fails — the pattern is safe.</li>
<li><code>toMatchObject</code> checks only the listed properties, ignoring the stack trace and everything else.</li>
<li>The third test uses the one-line form, <code>await expect(p).rejects.toMatchObject({ code })</code>, when one check is enough.</li>
</ul>

<h3>The catch branch nobody tests — and a fake that reaches it</h3>
<p>The service wraps each repository call in try/catch:</p>
${ma('javascript', NHANH_CATCH)}
<p>To run that <code>catch</code>, the second test above builds a <strong>broken repository</strong> by hand: a plain object with the same two async methods, where <code>findOverlap</code> throws a realistic driver error — <code>connect ECONNREFUSED 127.0.0.1:5432</code> is exactly what the PostgreSQL driver says when nothing listens on port 5432. <code>bookLab</code> cannot tell it apart from the real repository, takes the catch branch, and the test checks both the code and the preserved cause. Its <code>insert</code> throws “should not be called” — a cheap way to notice if the code ever went past the failed read. Chapter 3 calls this kind of hand-made replacement a <strong>stub</strong> and shows the tools for it.</p>

<h3>Experiment: delete the try/catch — who notices?</h3>
<p>Remove the first try/catch from <code>bookLab</code>, leaving just <code>const clash = await repo.findOverlap(...)</code>, and run the error tests together with the practice file:</p>
${ra(OUT['23-no-catch'])}
<p>Exactly <strong>one</strong> test notices: the one with the broken read. Without it, the raw <code>Error</code> escapes, <code>error.code</code> is <code>undefined</code>, and in production the API would answer 500 with a driver message instead of a clean 503. This is what “the catch branch nobody tests” means — and it is mutant #7 in Lab 2. Put the try/catch back afterwards.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a try/catch test that passes when nothing is thrown.</strong></p>
${ma('javascript', CODE.tryBay)}
${ra(OUT['23-try-loose'])}
<p>The test meant to send 06:00 but sent the valid 08:00 input. Nothing is thrown, the catch block never runs, no <code>expect</code> runs — and a test without a failing <code>expect</code> passes. It would stay green even if the opening-hours rule were deleted. Two fixes:</p>
<ol>
<li><strong>Assertion guard.</strong> With <code>requireAssertions</code> in the config (ours since Lab 1), or <code>expect.assertions(1)</code> at the top of this one test, it fails:
${ra(OUT['23-try-strict'])}</li>
<li><strong>Better: no try/catch at all.</strong> <code>rejects</code> fails loudly when the promise resolves — the second test below repeats the trap’s mistake on purpose:
${ma('javascript', CODE.trySua)}
${ra(OUT['23-try-sua'])}</li>
</ol>
<p>“promise resolved … instead of rejecting”, followed by the booking that was actually created — the message tells you exactly what went wrong.</p>
</div>

<h3>Guess the failures before they happen</h3>
<p>For every function that talks to the outside world, walk through the same list and write one test per row that applies:</p>
${DOAN_EN}
<p>This is <strong>error guessing</strong>, the experience-based technique from SWT301 — a list of likely failures drawn from experience — except that each guess becomes a test that runs on every commit instead of a note on paper.</p>

<h3>Which assertion for which error?</h3>
${TRA_EN}
<p>Coming from JUnit: <code>assertThrows(BookingException.class, () -&gt; service.book(input))</code> returns the exception, and you then assert on <code>getMessage()</code> or a custom code field — the same as the <code>.catch((e) =&gt; e)</code> pattern here.</p>

${lienKet({ bai: 'swt301-experience-based', title: 'Also in SWT301 — 6.1: experience-based techniques (error guessing)', sub: 'Same: guess where software fails from experience — invalid input, conflicts, a dependency that is down. Different: SWT301 writes the guesses as a fault-attack list on paper; here each guess is a runnable test with a fake repository, asserting the error code and its cause.', cta: 'OPEN SWT301 LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>A failing <code>insert</code> (“disk full”) becomes <code>STORAGE_DOWN</code> and keeps “disk full” as the cause.</li>
<li>An invalid slot (08:00–12:30, longer than 4 hours) is rejected with <code>TOO_LONG</code> and <strong>never reaches the database</strong> — prove the repository was not called.</li>
<li>Rewrite the try/catch trap with <code>rejects</code> (shown above).</li>
<li>Delete the first try/catch in <code>bookLab</code> and see which test turns red; then restore it.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th23)}
${ra(OUT['23-th'])}
<p>The second test uses a flag, <code>called</code>, to prove the repository was never reached — Chapter 3 replaces it with <code>vi.fn()</code> and <code>expect(fn).not.toHaveBeenCalled()</code>. <strong>Done when:</strong> <code>th23</code> shows <code>2 passed</code>, and without the try/catch only “a database failure becomes STORAGE_DOWN…” turns red with <em>expected undefined to be 'STORAGE_DOWN'</em>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">failure path</span><span class="v">What the code does when something goes wrong — the opposite of the happy path.</span></div>
  <div class="kv"><span class="k">error code</span><span class="v">A stable identifier such as <code>OVERLAP</code> that APIs, UIs and tests rely on.</span></div>
  <div class="kv"><span class="k">cause</span><span class="v">The original error kept inside a higher-level one: <code>new Error(msg, { cause })</code>.</span></div>
  <div class="kv"><span class="k">ECONNREFUSED</span><span class="v">“Connection refused”: nothing is listening at that address and port.</span></div>
  <div class="kv"><span class="k">stub</span><span class="v">A hand-made replacement that returns or throws whatever the test needs (Chapter 3).</span></div>
  <div class="kv"><span class="k">expect.assertions(n)</span><span class="v">Fails the test unless exactly n assertions ran.</span></div>
  <div class="kv"><span class="k">error guessing</span><span class="v">Designing tests from a list of likely failures, based on experience.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Give errors a class, a stable code and a cause; assert the code (and cause), not the wording.</li>
<li><code>.catch((e) =&gt; e)</code> for several checks on one error; <code>rejects.toMatchObject</code> for one.</li>
<li>Reach catch branches with a repository that fails on purpose; without it, deleting the try/catch goes unnoticed.</li>
<li>A try/catch test can pass when nothing throws — use an assertion guard, or better, <code>rejects</code>.</li>
<li>List failure paths up front: invalid, conflict, down on read, down on write, never answers.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Test lỗi và các nhánh thất bại</h2>
<p class="lead">Trên laptop của bạn, cơ sở dữ liệu luôn chạy, đĩa không bao giờ đầy, mạng không bao giờ rớt. Vì vậy phần code xử lý những tình huống đó chính là phần code <em>chưa từng chạy</em> cho tới lần sự cố thật đầu tiên. Bài này đưa lỗi vào hợp đồng (contract) của code và cho bạn một công cụ đơn giản để cố ý đi vào mọi nhánh <code>catch</code>.</p>

<h3>Lỗi là một phần của hợp đồng</h3>
<p>Lớp lỗi trong <code>src/booking/service.js</code>:</p>
${ma('javascript', LOP_LOI)}
<p>Một lỗi ứng dụng tốt mang ba thứ:</p>
<ul>
<li>một <strong>lớp</strong> (<code>BookingError</code>), để nơi gọi phân biệt lỗi “của mình” với bug như <code>TypeError</code>;</li>
<li>một <strong>mã</strong> ổn định (<code>OVERLAP</code>, <code>STORAGE_DOWN</code>…). API đổi mã sang mã trạng thái HTTP (Chương 5: <code>OVERLAP</code> → 409 Conflict, <code>STORAGE_DOWN</code> → 503), giao diện đổi mã sang câu dễ hiểu, và <strong>test khẳng định mã</strong> — không khẳng định câu chữ, thứ tháng sau sẽ có người sửa cho hay hơn;</li>
<li>một <strong>nguyên nhân</strong> (cause): <code>new Error(message, { cause })</code> là JavaScript chuẩn (ES2022). Lỗi tầng thấp — thông điệp thật của driver — được giữ lại cho log, còn người dùng thấy một mã gọn gàng.</li>
</ul>

<h3>Khẳng định một lỗi: lớp, mã, thông điệp</h3>
${ma('javascript', CODE.loi)}
${ra(OUT['23-loi'])}
<ul>
<li><code>.catch((e) =&gt; e)</code> biến lần từ chối thành một giá trị bình thường, nhờ đó một lỗi được kiểm theo nhiều cách. Nếu promise lại <em>thành công</em>, <code>error</code> sẽ là lượt đặt, và <code>toBeInstanceOf(BookingError)</code> hỏng — mẫu này an toàn.</li>
<li><code>toMatchObject</code> chỉ kiểm những thuộc tính được liệt kê, bỏ qua stack trace và mọi thứ khác.</li>
<li>Test thứ ba dùng dạng một dòng, <code>await expect(p).rejects.toMatchObject({ code })</code>, khi chỉ cần kiểm một điều.</li>
</ul>

<h3>Nhánh catch không ai test — và một đồ giả đi tới được nó</h3>
<p>Hàm dịch vụ bọc mỗi lời gọi repository trong try/catch:</p>
${ma('javascript', NHANH_CATCH)}
<p>Để chạy nhánh <code>catch</code> đó, test thứ hai ở trên tự dựng một <strong>repository hỏng</strong>: một object thường có đúng hai phương thức async như thật, trong đó <code>findOverlap</code> ném ra một lỗi driver như thật — <code>connect ECONNREFUSED 127.0.0.1:5432</code> đúng là câu driver PostgreSQL nói khi không có gì lắng nghe ở cổng 5432. <code>bookLab</code> không phân biệt được nó với repository thật, đi vào nhánh catch, và test kiểm cả mã lẫn nguyên nhân được giữ lại. <code>insert</code> của nó ném “should not be called” — một cách rẻ để phát hiện nếu code lỡ đi tiếp sau lần đọc hỏng. Chương 3 gọi loại đồ thay thế tự làm này là <strong>stub</strong> và chỉ các công cụ cho nó.</p>

<h3>Thí nghiệm: xoá try/catch — ai nhận ra?</h3>
<p>Bỏ khối try/catch đầu tiên khỏi <code>bookLab</code>, chỉ để lại <code>const clash = await repo.findOverlap(...)</code>, rồi chạy các test lỗi cùng file thực hành:</p>
${ra(OUT['23-no-catch'])}
<p>Đúng <strong>một</strong> test nhận ra: test có lần đọc hỏng. Thiếu try/catch, <code>Error</code> gốc lọt ra ngoài, <code>error.code</code> là <code>undefined</code>, và trên production API sẽ trả 500 kèm thông điệp của driver thay vì một mã 503 gọn gàng. Đó là ý nghĩa của “nhánh catch không ai test” — và là đột biến số 7 trong Lab 2. Nhớ trả try/catch về sau khi thử.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — test try/catch vẫn đạt khi không có gì bị ném.</strong></p>
${ma('javascript', CODE.tryBay)}
${ra(OUT['23-try-loose'])}
<p>Test định gửi 06:00 nhưng lại gửi đầu vào hợp lệ 08:00. Không có gì bị ném, khối catch không chạy, không <code>expect</code> nào chạy — và test không có <code>expect</code> hỏng thì đạt. Nó vẫn sẽ xanh kể cả khi luật giờ mở cửa bị xoá mất. Hai cách sửa:</p>
<ol>
<li><strong>Chốt chặn khẳng định.</strong> Có <code>requireAssertions</code> trong cấu hình (của ta từ Lab 1), hoặc <code>expect.assertions(1)</code> ở đầu riêng test này, thì nó hỏng:
${ra(OUT['23-try-strict'])}</li>
<li><strong>Tốt hơn: bỏ hẳn try/catch.</strong> <code>rejects</code> hỏng rõ ràng khi promise lại thành công — test thứ hai bên dưới cố ý lặp lại đúng sai lầm của cái bẫy:
${ma('javascript', CODE.trySua)}
${ra(OUT['23-try-sua'])}</li>
</ol>
<p>“promise resolved … instead of rejecting” (promise đã thành công thay vì bị từ chối), kèm luôn lượt đặt đã thật sự được tạo — thông báo nói chính xác chuyện gì sai.</p>
</div>

<h3>Đoán lỗi trước khi chúng xảy ra</h3>
<p>Với mọi hàm có nói chuyện với thế giới bên ngoài, đi qua cùng một danh sách và viết một test cho mỗi dòng áp dụng được:</p>
${DOAN_VI}
<p>Đây là <strong>error guessing</strong> (đoán lỗi), kỹ thuật dựa kinh nghiệm của SWT301 — một danh sách những chỗ hay hỏng rút ra từ kinh nghiệm — chỉ khác là mỗi phỏng đoán thành một test chạy ở mọi commit, thay vì một ghi chú trên giấy.</p>

<h3>Lỗi nào thì khẳng định thế nào?</h3>
${TRA_VI}
<p>Đến từ JUnit: <code>assertThrows(BookingException.class, () -&gt; service.book(input))</code> trả về chính exception, rồi bạn khẳng định trên <code>getMessage()</code> hay một trường mã tự định nghĩa — giống hệt mẫu <code>.catch((e) =&gt; e)</code> ở đây.</p>

${lienKet({ bai: 'swt301-experience-based', title: 'Đã gặp ở SWT301 — 6.1: kỹ thuật dựa kinh nghiệm (error guessing)', sub: 'Giống: dựa kinh nghiệm đoán phần mềm hỏng ở đâu — đầu vào sai, xung đột, phụ thuộc bị chết. Khác: SWT301 viết phỏng đoán thành danh sách tấn công lỗi trên giấy; ở đây mỗi phỏng đoán là một test chạy được với repository giả, khẳng định mã lỗi và nguyên nhân của nó.', cta: 'MỞ BÀI SWT301 →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Một lần <code>insert</code> hỏng (“disk full”) trở thành <code>STORAGE_DOWN</code> và giữ “disk full” làm nguyên nhân.</li>
<li>Một khung giờ không hợp lệ (08:00–12:30, dài hơn 4 tiếng) bị từ chối với <code>TOO_LONG</code> và <strong>không bao giờ chạm tới cơ sở dữ liệu</strong> — chứng minh repository không bị gọi.</li>
<li>Viết lại cái bẫy try/catch bằng <code>rejects</code> (đã có ở trên).</li>
<li>Xoá try/catch đầu tiên trong <code>bookLab</code> và xem test nào chuyển đỏ; rồi trả nó về.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th23)}
${ra(OUT['23-th'])}
<p>Test thứ hai dùng một cờ, <code>called</code>, để chứng minh repository chưa bao giờ được chạm tới — Chương 3 thay nó bằng <code>vi.fn()</code> và <code>expect(fn).not.toHaveBeenCalled()</code>. <strong>Đạt khi:</strong> <code>th23</code> hiện <code>2 passed</code>, và khi không có try/catch thì chỉ “a database failure becomes STORAGE_DOWN…” chuyển đỏ với <em>expected undefined to be 'STORAGE_DOWN'</em>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">failure path (nhánh thất bại)</span><span class="v">Thứ code làm khi có chuyện hỏng — ngược với nhánh suôn (happy path).</span></div>
  <div class="kv"><span class="k">error code (mã lỗi)</span><span class="v">Định danh ổn định như <code>OVERLAP</code> mà API, giao diện và test đều dựa vào.</span></div>
  <div class="kv"><span class="k">cause (nguyên nhân)</span><span class="v">Lỗi gốc được giữ bên trong một lỗi tầng cao hơn: <code>new Error(msg, { cause })</code>.</span></div>
  <div class="kv"><span class="k">ECONNREFUSED</span><span class="v">“Kết nối bị từ chối”: không có gì lắng nghe ở địa chỉ và cổng đó.</span></div>
  <div class="kv"><span class="k">stub</span><span class="v">Đồ thay thế tự làm, trả về hay ném ra đúng thứ test cần (Chương 3).</span></div>
  <div class="kv"><span class="k">expect.assertions(n)</span><span class="v">Đánh hỏng test trừ khi có đúng n khẳng định đã chạy.</span></div>
  <div class="kv"><span class="k">error guessing (đoán lỗi)</span><span class="v">Thiết kế test từ danh sách những chỗ hay hỏng, dựa trên kinh nghiệm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cho lỗi một lớp, một mã ổn định và một nguyên nhân; khẳng định mã (và nguyên nhân), không khẳng định câu chữ.</li>
<li><code>.catch((e) =&gt; e)</code> khi cần kiểm nhiều điều trên một lỗi; <code>rejects.toMatchObject</code> khi chỉ cần một.</li>
<li>Đi vào nhánh catch bằng một repository cố ý hỏng; thiếu nó, xoá try/catch cũng không ai hay.</li>
<li>Test try/catch có thể đạt khi không có gì bị ném — dùng chốt chặn khẳng định, hoặc tốt hơn, <code>rejects</code>.</li>
<li>Liệt kê trước các nhánh thất bại: không hợp lệ, xung đột, chết lúc đọc, hỏng lúc ghi, không bao giờ trả lời.</li>
</ul>
</div>
`,
};
