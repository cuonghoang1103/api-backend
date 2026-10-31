/**
 * Testing · Chương 2 · 2.1 — Test code bất đồng bộ. Slug giữ từ khung: tst-2-1-async.
 * Mọi code/output lấy từ ./_ma.mjs (sinh từ dự án labflow-lite chạy thật, Node 22.23.3 + Vitest 5.0.5).
 */
import G from '../giang/tst-02-1.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const TIMELINE_EN = `<table>
<thead><tr><th>Time</th><th>Booking A</th><th>Booking B</th></tr></thead>
<tbody>
<tr><td>0 ms</td><td><code>checkSlot</code> → ok</td><td><code>checkSlot</code> → ok</td></tr>
<tr><td>0–5 ms</td><td><code>findOverlap</code> waits for the “database”</td><td><code>findOverlap</code> waits for the “database”</td></tr>
<tr><td>5 ms</td><td>no clash — the table is still empty</td><td>no clash — the table is still empty</td></tr>
<tr><td>5–10 ms</td><td><code>insert</code> → id 1</td><td><code>insert</code> → id 2</td></tr>
</tbody>
</table>`;
const TIMELINE_VI = `<table>
<thead><tr><th>Thời điểm</th><th>Lượt đặt A</th><th>Lượt đặt B</th></tr></thead>
<tbody>
<tr><td>0 ms</td><td><code>checkSlot</code> → ok</td><td><code>checkSlot</code> → ok</td></tr>
<tr><td>0–5 ms</td><td><code>findOverlap</code> chờ “cơ sở dữ liệu”</td><td><code>findOverlap</code> chờ “cơ sở dữ liệu”</td></tr>
<tr><td>5 ms</td><td>không trùng — bảng vẫn còn trống</td><td>không trùng — bảng vẫn còn trống</td></tr>
<tr><td>5–10 ms</td><td><code>insert</code> → id 1</td><td><code>insert</code> → id 2</td></tr>
</tbody>
</table>`;

export default {
  title: '2.1 — Testing async code: await, resolves/rejects, races and timeouts|||2.1 — Test code bất đồng bộ: await, resolves/rejects, tranh chấp và quá giờ',
  slug: 'tst-2-1-async',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hàm dịch vụ bookLab bất đồng bộ của LabFlow Lite; hai bẫy quên await (.then xanh mà sai, rejects không await) và cách requireAssertions + Vitest 5 bắt chúng; async test với resolves/rejects; một lỗi tranh chấp thật (hai sinh viên đặt cùng khung) tìm bằng Promise.allSettled và ghi nhận bằng it.fails; quá giờ 5000 ms nghĩa là gì; đối chiếu JUnit.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Testing async code</h2>
<p class="lead">Chapter 1 tested pure functions: same input, same output, instantly. Real backend code <em>waits</em> — for a database, a mail server, another API. In JavaScript every wait is a <strong>promise</strong>, and a test that does not wait for the promise finishes before the work is done. This lesson shows how that silently turns wrong tests green, and how to write async tests that cannot lie.</p>

<h3>The code: a booking service that talks to a “database”</h3>
<p>Add <code>src/booking/service.js</code> to LabFlow Lite. It uses last chapter’s rules and a <strong>repository</strong> — the object that talks to storage:</p>
${ma('javascript', CODE.service)}
<p>Three things to notice before testing it:</p>
<ul>
<li><code>createMemoryRepo()</code> is an in-memory stand-in for a database. Its methods are <code>async</code> and wait 5 ms each, like a real round trip. Chapter 4 replaces it with real PostgreSQL; the tests you write now will keep working.</li>
<li><code>bookLab</code> is <code>async</code>: calling it returns a promise <em>immediately</em>; the booking or the error arrives later.</li>
<li>Errors are <code>BookingError</code>s with a <code>code</code> (<code>OUTSIDE_HOURS</code>, <code>OVERLAP</code>, <code>STORAGE_DOWN</code>…). The two try/catch blocks are lesson 2.3’s topic; ignore them for now.</li>
</ul>
<p>The shared test input for this lesson is one student booking BE-201 on 16 November from 08:00 to 10:00 for 20 seats:</p>
${ma('javascript', "const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };")}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', title: 'Need a refresher? Node.js course — 1.4 Async: callbacks, Promises, async/await', sub: 'How the event loop waits, what a promise is, and the four async mistakes that crash an API. This lesson assumes you can read async/await.', cta: 'OPEN LESSON →' })}

<h3>Trap 1 — .then without await: green and wrong</h3>
${ma('javascript', CODE.quen)}
<p>Both tests are deliberately broken. Run them first <em>without</em> the assertion guard from Lab 1, using a loose config:</p>
${ma('javascript', CODE.looseConfig)}
${ra(OUT['21-quen-loose'])}
<p>Read the tree at the top: <strong>“✓ forgot to await: the assertion runs after the test has ended”</strong>. The test function called <code>bookLab</code>, attached a <code>.then</code> and returned. Vitest saw a function that returned without throwing — a pass. About 5 ms later the promise resolved and the wrong <code>expect</code> threw, but the test was already finished, so the failure surfaced only as an <em>Unhandled Rejection</em> at the bottom of the report. If the file had ended a moment earlier, you would not have seen even that.</p>

<h3>Trap 2 — rejects without await</h3>
<p>The second test hands the promise to <code>expect(...).rejects</code> but does not <code>await</code> it. Here Vitest 5 helps: it fails the test with <em>“Promise returned by expect(actual).rejects.toThrow(expected) was not awaited”</em> and prints the fix. Do not count on that everywhere: Jest’s own documentation warns that without <code>await</code> or <code>return</code> the test completes before the promise, and leaves it to you. And trap 1 shows a variant that Vitest still cannot detect on its own.</p>

<h3>One config line catches both</h3>
<p>Now run the same file with the real config, which has had <code>expect: { requireAssertions: true }</code> since Lab 1:</p>
${ra(OUT['21-quen-strict'])}
<p>Trap 1 is now red: <em>“expected any number of assertion, but got none”</em>. When the test function returned, no <code>expect</code> had run yet — it was still waiting inside the <code>.then</code>. Keep this option on in every project.</p>

<h3>The right way: async test + await</h3>
${ma('javascript', CODE.dung)}
${ra(OUT['21-dung'])}
<ul>
<li>Mark the test <code>async</code> and <code>await</code> every promise. Vitest then waits for the whole function.</li>
<li><strong>Style 1</strong> — await the value, then assert: <code>const booking = await bookLab(...); expect(booking)...</code>. Best when you check several things.</li>
<li><strong>Style 2</strong> — assert on the promise: <code>await expect(bookLab(...)).resolves.toMatchObject(...)</code>, or <code>.rejects.toThrow(BookingError)</code> / <code>.rejects.toMatchObject({ code: 'OVERLAP' })</code> for errors.</li>
<li>The fourth test is a boundary in disguise: 10:00–12:00 starts exactly when 08:00–10:00 ends, and must be allowed. The repository uses <code>b.start &lt; end &amp;&amp; start &lt; b.end</code> — strict <code>&lt;</code> on both sides.</li>
<li>Look at the times: 12–39 ms per test, because every repository call waits 5 ms. Async tests are slower than pure ones, which is one more reason to keep business rules in pure functions and test them there.</li>
</ul>

<h3>An async test finds a real bug: two students, one slot</h3>
<p>Two students press “Book” for the same lab and slot at the same moment. One should win, the other should get <code>OVERLAP</code>:</p>
${ma('javascript', CODE.duaBefore)}
${ra(OUT['21-dua'])}
<p><code>Promise.allSettled</code> starts both bookings at once and waits for both, recording each as <code>fulfilled</code> or <code>rejected</code> instead of stopping at the first error (that is what <code>Promise.all</code> would do). The result: <strong>two fulfilled</strong> — BE-201 is double-booked. Why:</p>
${TIMELINE_EN}
<p>Each request <em>checks</em>, then <em>writes</em>. Both checks happen before either write, so both see a free slot. This is the classic <strong>check-then-act race</strong>. It cannot be fixed reliably in JavaScript once you run several server processes; the database has to refuse the second row in one atomic step. Chapter 4 adds a PostgreSQL exclusion constraint and this exact test turns green.</p>

<h3>it.fails: keep the known bug visible without a red build</h3>
${ma('javascript', CODE.dua)}
${ra(OUT['21-dua-fails'])}
<p><code>it.fails</code> inverts the result: the test passes while the assertion fails, and the summary says <strong>“1 expected fail”</strong>. On the day someone fixes the race, the assertion passes, <code>it.fails</code> reports red, and they change it back to <code>it</code>. Always add a comment saying why and where the fix will come. Compare <code>it.skip</code>, which simply stops running the test — the bug is forgotten.</p>

<h3>Timeouts: what “Test timed out in 5000ms” really means</h3>
${ma('javascript', CODE.treo)}
${ra(OUT['21-treo'])}
<p>A promise that never resolves or rejects keeps the test waiting until Vitest’s default <code>testTimeout</code> of 5000 ms runs out. The message does not tell you <em>what</em> never answered. Typical causes in a backend:</p>
<ul>
<li>a real network call (SMTP, payment gateway) that should have been replaced in the test — Chapter 3;</li>
<li>a mock that was set up for <code>resolve</code> but the code waits for an event that never fires;</li>
<li>a timer the code waits for (a retry after 30 s) — lesson 2.2 shows how to fast-forward it;</li>
<li>a missing <code>await</code> or <code>return</code> somewhere deeper, so a promise is created but never chained.</li>
</ul>
<p>Raising the timeout (<code>it(name, fn, 30000)</code>) is right only for tests that are slow by nature, such as integration tests against a real database. For unit tests, find the cause.</p>

<h3>Coming from JUnit (SWT301 / Spring Boot)</h3>
<p>A JUnit 5 test method is synchronous: when it returns, the test is over. So the same trap exists in Java when the code under test returns a <code>CompletableFuture</code> — if you never call <code>.join()</code> or <code>.get(timeout, unit)</code>, assertions inside a callback may never run. The fix is the same idea: block until the result is there, then assert. For “eventually true” checks Java teams often use the Awaitility library. JavaScript just makes the problem far more common, because almost everything is async.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>In <code>demo2/th21.test.js</code>, rewrite both broken tests from <code>async-quen.test.js</code> correctly (await the booking; await <code>rejects</code> with the real code <code>OUTSIDE_HOURS</code>).</li>
<li>Test that a <strong>31-seat</strong> student booking is stored as <code>PENDING</code> (BR-06), using <code>resolves</code>.</li>
<li>Test that the same slot in <strong>another lab</strong> (BE-305) is accepted after BE-201 was booked.</li>
<li>Mark the race test with <code>it.fails</code> and a comment pointing to Chapter 4.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th21)}
${ra(OUT['21-th'])}
<p><strong>Done when:</strong> <code>th21</code> shows <code>4 passed</code>, and <code>demo2/dua.test.js</code> reports <code>1 expected fail</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">promise</span><span class="v">An object standing for a result that arrives later: it ends up <em>fulfilled</em> with a value or <em>rejected</em> with an error.</span></div>
  <div class="kv"><span class="k">async / await</span><span class="v"><code>async</code> makes a function return a promise; <code>await</code> pauses until a promise settles.</span></div>
  <div class="kv"><span class="k">resolves / rejects</span><span class="v">Vitest modifiers that assert on the value or the error of a promise; always <code>await</code> them.</span></div>
  <div class="kv"><span class="k">Unhandled Rejection</span><span class="v">A rejected promise nobody handled — in tests, often an assertion that ran after its test ended.</span></div>
  <div class="kv"><span class="k">repository</span><span class="v">The object that reads and writes storage; here an in-memory one, later PostgreSQL.</span></div>
  <div class="kv"><span class="k">race condition</span><span class="v">A bug that depends on the timing of two concurrent operations, like check-then-act.</span></div>
  <div class="kv"><span class="k">Promise.allSettled</span><span class="v">Waits for all promises and reports each as fulfilled or rejected.</span></div>
  <div class="kv"><span class="k">it.fails</span><span class="v">A test that is expected to fail; it turns red when the bug it documents is fixed.</span></div>
  <div class="kv"><span class="k">testTimeout</span><span class="v">How long Vitest waits for one test (default 5000 ms).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Async code returns promises; the test must <code>await</code> them or it ends too early.</li>
<li><code>.then</code> without await can be green while wrong; un-awaited <code>rejects</code> fails in Vitest 5; <code>requireAssertions</code> catches the rest.</li>
<li>Use <code>async</code> tests with <code>await expect(p).resolves</code> / <code>.rejects</code>.</li>
<li><code>Promise.allSettled</code> lets a test start concurrent operations — and reveal races such as check-then-act.</li>
<li><code>it.fails</code> documents a known bug honestly; <code>it.skip</code> hides it.</li>
<li>A 5000 ms timeout means something never settled: find it instead of raising the limit.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Test code bất đồng bộ</h2>
<p class="lead">Chương 1 test các hàm thuần: cùng đầu vào, cùng đầu ra, có ngay lập tức. Code backend thật thì phải <em>chờ</em> — chờ cơ sở dữ liệu, chờ máy chủ thư, chờ một API khác. Trong JavaScript, mỗi lần chờ là một <strong>promise</strong> (lời hứa sẽ trả kết quả sau), và test nào không chờ promise sẽ kết thúc trước khi công việc xong. Bài này cho thấy điều đó âm thầm biến test sai thành xanh ra sao, và cách viết test bất đồng bộ không thể nói dối.</p>

<h3>Code: một dịch vụ đặt phòng nói chuyện với “cơ sở dữ liệu”</h3>
<p>Thêm <code>src/booking/service.js</code> vào LabFlow Lite. File này dùng luật của chương trước và một <strong>repository</strong> (kho dữ liệu) — object chuyên đọc ghi nơi lưu trữ:</p>
${ma('javascript', CODE.service)}
<p>Ba điều cần để ý trước khi test:</p>
<ul>
<li><code>createMemoryRepo()</code> là một “cơ sở dữ liệu” giả nằm trong bộ nhớ. Các phương thức của nó là <code>async</code> và mỗi lần chờ 5 ms, giống một chuyến đi về cơ sở dữ liệu thật. Chương 4 thay nó bằng PostgreSQL thật; test bạn viết bây giờ vẫn dùng tiếp được.</li>
<li><code>bookLab</code> là <code>async</code>: gọi nó thì nhận về một promise <em>ngay lập tức</em>; lượt đặt hay lỗi tới sau.</li>
<li>Lỗi là <code>BookingError</code> mang một <code>code</code> (<code>OUTSIDE_HOURS</code>, <code>OVERLAP</code>, <code>STORAGE_DOWN</code>…). Hai khối try/catch là chủ đề của bài 2.3; tạm bỏ qua.</li>
</ul>
<p>Dữ liệu vào dùng chung cho cả bài: một sinh viên đặt BE-201 ngày 16/11 từ 08:00 tới 10:00 cho 20 chỗ:</p>
${ma('javascript', "const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };")}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', title: 'Cần ôn lại? Khoá Node.js — 1.4 Bất đồng bộ: callback, Promise, async/await', sub: 'Vòng lặp sự kiện chờ thế nào, promise là gì, và bốn lỗi bất đồng bộ làm sập API. Bài này giả định bạn đã đọc được async/await.', cta: 'MỞ BÀI →' })}

<h3>Bẫy 1 — .then không await: xanh mà sai</h3>
${ma('javascript', CODE.quen)}
<p>Cả hai test đều cố ý viết sai. Chạy chúng trước <em>không có</em> chốt chặn khẳng định của Lab 1, bằng một cấu hình “lỏng”:</p>
${ma('javascript', CODE.looseConfig)}
${ra(OUT['21-quen-loose'])}
<p>Đọc cây kết quả ở đầu: <strong>“✓ forgot to await: the assertion runs after the test has ended”</strong>. Hàm test gọi <code>bookLab</code>, gắn một <code>.then</code> rồi trả về. Vitest thấy một hàm trả về mà không ném lỗi — tính là đạt. Khoảng 5 ms sau promise mới hoàn tất và dòng <code>expect</code> sai mới ném lỗi, nhưng test đã xong từ trước, nên lỗi chỉ hiện thành một <em>Unhandled Rejection</em> (lỗi từ chối không ai xử lý) ở cuối báo cáo. Nếu file kết thúc sớm hơn một chút, bạn còn chẳng thấy cả dòng đó.</p>

<h3>Bẫy 2 — rejects không await</h3>
<p>Test thứ hai đưa promise vào <code>expect(...).rejects</code> nhưng không <code>await</code>. Lần này Vitest 5 giúp bạn: nó đánh hỏng test với <em>“Promise returned by expect(actual).rejects.toThrow(expected) was not awaited”</em> (promise trả về chưa được await) và in luôn cách sửa. Đừng trông vào điều đó ở mọi nơi: chính tài liệu của Jest cảnh báo rằng thiếu <code>await</code> hay <code>return</code> thì test kết thúc trước promise, và để bạn tự lo. Còn bẫy 1 là một biến thể mà bản thân Vitest vẫn chưa tự phát hiện được.</p>

<h3>Một dòng cấu hình bắt cả hai</h3>
<p>Giờ chạy lại đúng file đó với cấu hình thật, cấu hình đã có <code>expect: { requireAssertions: true }</code> từ Lab 1:</p>
${ra(OUT['21-quen-strict'])}
<p>Bẫy 1 giờ đã đỏ: <em>“expected any number of assertion, but got none”</em> (mong có khẳng định nhưng không có cái nào). Lúc hàm test trả về, chưa có <code>expect</code> nào chạy — nó còn đang chờ trong <code>.then</code>. Hãy luôn bật tuỳ chọn này ở mọi dự án.</p>

<h3>Cách đúng: test async + await</h3>
${ma('javascript', CODE.dung)}
${ra(OUT['21-dung'])}
<ul>
<li>Đánh dấu test là <code>async</code> và <code>await</code> mọi promise. Khi đó Vitest chờ trọn cả hàm.</li>
<li><strong>Kiểu 1</strong> — await lấy giá trị rồi khẳng định: <code>const booking = await bookLab(...); expect(booking)...</code>. Hợp nhất khi cần kiểm nhiều thứ.</li>
<li><strong>Kiểu 2</strong> — khẳng định trên chính promise: <code>await expect(bookLab(...)).resolves.toMatchObject(...)</code>, hoặc <code>.rejects.toThrow(BookingError)</code> / <code>.rejects.toMatchObject({ code: 'OVERLAP' })</code> cho lỗi.</li>
<li>Test thứ tư là một giá trị biên trá hình: 10:00–12:00 bắt đầu đúng lúc 08:00–10:00 kết thúc, và phải được chấp nhận. Repository dùng <code>b.start &lt; end &amp;&amp; start &lt; b.end</code> — dấu <code>&lt;</code> nghiêm ngặt ở cả hai vế.</li>
<li>Nhìn thời gian: 12–39 ms mỗi test, vì lời gọi repository nào cũng chờ 5 ms. Test bất đồng bộ chậm hơn test hàm thuần — thêm một lý do để giữ luật nghiệp vụ trong hàm thuần và test chúng ở đó.</li>
</ul>

<h3>Một test bất đồng bộ tìm ra bug thật: hai sinh viên, một khung giờ</h3>
<p>Hai sinh viên cùng bấm “Đặt” cùng phòng, cùng khung, cùng một lúc. Một người phải thắng, người kia phải nhận <code>OVERLAP</code>:</p>
${ma('javascript', CODE.duaBefore)}
${ra(OUT['21-dua'])}
<p><code>Promise.allSettled</code> khởi động cả hai lượt đặt cùng lúc và chờ cả hai, ghi nhận mỗi bên là <code>fulfilled</code> (thành công) hay <code>rejected</code> (bị từ chối) thay vì dừng ở lỗi đầu tiên (như <code>Promise.all</code> sẽ làm). Kết quả: <strong>cả hai đều fulfilled</strong> — BE-201 bị đặt trùng. Vì sao:</p>
${TIMELINE_VI}
<p>Mỗi yêu cầu <em>kiểm</em> trước, rồi mới <em>ghi</em>. Cả hai lần kiểm đều xảy ra trước khi bên nào kịp ghi, nên cả hai đều thấy khung còn trống. Đây là lỗi <strong>tranh chấp kiểm-rồi-làm</strong> (check-then-act race) kinh điển. Không thể sửa nó chắc chắn bằng JavaScript khi bạn chạy nhiều tiến trình máy chủ; cơ sở dữ liệu phải từ chối dòng thứ hai trong một bước nguyên tử (atomic). Chương 4 thêm một ràng buộc loại trừ (exclusion constraint) của PostgreSQL và chính test này sẽ chuyển xanh.</p>

<h3>it.fails: giữ bug đã biết trong tầm mắt mà không làm đỏ cả bản dựng</h3>
${ma('javascript', CODE.dua)}
${ra(OUT['21-dua-fails'])}
<p><code>it.fails</code> đảo ngược kết quả: test đạt khi khẳng định hỏng, và phần tổng kết ghi <strong>“1 expected fail”</strong> (một lần hỏng như dự kiến). Ngày có người sửa xong lỗi tranh chấp, khẳng định sẽ đạt, <code>it.fails</code> báo đỏ, và họ đổi lại thành <code>it</code>. Luôn thêm một dòng chú thích nói vì sao và bao giờ sửa. So với <code>it.skip</code> — thứ chỉ đơn giản là thôi chạy test — thì bug bị quên luôn.</p>

<h3>Quá giờ: “Test timed out in 5000ms” thật ra nghĩa là gì</h3>
${ma('javascript', CODE.treo)}
${ra(OUT['21-treo'])}
<p>Một promise không bao giờ hoàn tất cũng không bao giờ từ chối sẽ giữ test chờ cho tới khi hết <code>testTimeout</code> mặc định 5000 ms của Vitest. Thông báo không nói <em>thứ gì</em> không trả lời. Nguyên nhân hay gặp ở backend:</p>
<ul>
<li>một lời gọi mạng thật (SMTP, cổng thanh toán) lẽ ra phải được thay trong test — Chương 3;</li>
<li>một mock được dựng để <code>resolve</code> nhưng code lại chờ một sự kiện không bao giờ xảy ra;</li>
<li>một bộ hẹn giờ mà code đang chờ (thử lại sau 30 giây) — bài 2.2 chỉ cách tua nhanh nó;</li>
<li>thiếu một <code>await</code> hay <code>return</code> ở tầng sâu hơn, nên promise được tạo ra mà không được nối tiếp.</li>
</ul>
<p>Tăng thời gian chờ (<code>it(name, fn, 30000)</code>) chỉ đúng với test vốn dĩ chậm, như test tích hợp với cơ sở dữ liệu thật. Với unit test, hãy tìm ra nguyên nhân.</p>

<h3>Đến từ JUnit (SWT301 / Spring Boot)</h3>
<p>Một phương thức test JUnit 5 là đồng bộ: nó trả về là test kết thúc. Nên cùng cái bẫy đó vẫn có trong Java khi code được test trả về một <code>CompletableFuture</code> — nếu bạn không gọi <code>.join()</code> hay <code>.get(timeout, unit)</code>, khẳng định nằm trong callback có thể không bao giờ chạy. Cách sửa cùng một ý: chặn lại tới khi có kết quả, rồi mới khẳng định. Với kiểu kiểm “rồi sẽ đúng” (eventually), các nhóm Java hay dùng thư viện Awaitility. JavaScript chỉ làm vấn đề này phổ biến hơn nhiều, vì gần như mọi thứ đều bất đồng bộ.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Trong <code>demo2/th21.test.js</code>, viết lại đúng cả hai test hỏng của <code>async-quen.test.js</code> (await lượt đặt; await <code>rejects</code> với mã thật <code>OUTSIDE_HOURS</code>).</li>
<li>Test rằng lượt đặt <strong>31 chỗ</strong> của sinh viên được lưu ở trạng thái <code>PENDING</code> (BR-06), dùng <code>resolves</code>.</li>
<li>Test rằng cùng khung giờ đó ở <strong>phòng khác</strong> (BE-305) vẫn được chấp nhận sau khi BE-201 đã có người đặt.</li>
<li>Đánh dấu test tranh chấp bằng <code>it.fails</code> kèm dòng chú thích trỏ tới Chương 4.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th21)}
${ra(OUT['21-th'])}
<p><strong>Đạt khi:</strong> <code>th21</code> hiện <code>4 passed</code>, và <code>demo2/dua.test.js</code> báo <code>1 expected fail</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">promise (lời hứa)</span><span class="v">Object đại diện cho một kết quả tới sau: cuối cùng nó <em>fulfilled</em> (thành công, có giá trị) hoặc <em>rejected</em> (bị từ chối, có lỗi).</span></div>
  <div class="kv"><span class="k">async / await</span><span class="v"><code>async</code> làm hàm trả về promise; <code>await</code> tạm dừng cho tới khi promise ngã ngũ.</span></div>
  <div class="kv"><span class="k">resolves / rejects</span><span class="v">Bổ ngữ của Vitest để khẳng định giá trị hoặc lỗi của một promise; luôn phải <code>await</code>.</span></div>
  <div class="kv"><span class="k">Unhandled Rejection</span><span class="v">Promise bị từ chối mà không ai xử lý — trong test, thường là một khẳng định chạy sau khi test của nó đã kết thúc.</span></div>
  <div class="kv"><span class="k">repository (kho dữ liệu)</span><span class="v">Object đọc ghi nơi lưu trữ; ở đây nằm trong bộ nhớ, về sau là PostgreSQL.</span></div>
  <div class="kv"><span class="k">race condition (lỗi tranh chấp)</span><span class="v">Bug phụ thuộc vào thời điểm của hai thao tác chạy đồng thời, như kiểm-rồi-làm.</span></div>
  <div class="kv"><span class="k">Promise.allSettled</span><span class="v">Chờ tất cả promise và báo mỗi cái là fulfilled hay rejected.</span></div>
  <div class="kv"><span class="k">it.fails</span><span class="v">Test được dự kiến là hỏng; nó chuyển đỏ khi bug mà nó ghi nhận được sửa.</span></div>
  <div class="kv"><span class="k">testTimeout</span><span class="v">Thời gian Vitest chờ một test (mặc định 5000 ms).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Code bất đồng bộ trả về promise; test phải <code>await</code> chúng, nếu không sẽ kết thúc quá sớm.</li>
<li><code>.then</code> không await có thể xanh mà sai; <code>rejects</code> không await bị Vitest 5 đánh hỏng; <code>requireAssertions</code> bắt phần còn lại.</li>
<li>Dùng test <code>async</code> với <code>await expect(p).resolves</code> / <code>.rejects</code>.</li>
<li><code>Promise.allSettled</code> cho test khởi động các thao tác đồng thời — và lộ ra lỗi tranh chấp như kiểm-rồi-làm.</li>
<li><code>it.fails</code> ghi nhận bug đã biết một cách trung thực; <code>it.skip</code> giấu nó đi.</li>
<li>Quá giờ 5000 ms nghĩa là có thứ không bao giờ ngã ngũ: hãy tìm ra nó thay vì nâng giới hạn.</li>
</ul>
</div>
`,
};
