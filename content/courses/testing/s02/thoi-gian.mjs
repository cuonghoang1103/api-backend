/**
 * Testing · Chương 2 · 2.2 — Kiểm soát thời gian: fake timers, ngày giờ, múi giờ. Slug giữ từ khung: tst-2-2-thoi-gian.
 * Mọi code/output lấy từ ./_ma.mjs (chạy thật; demo múi giờ chạy dưới TZ=Asia/Ho_Chi_Minh và TZ=UTC).
 */
import G from '../giang/tst-02-2.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const TZ_EN = `<table>
<thead><tr><th>Moment</th><th>Date in Viet Nam (UTC+7)</th><th>Date on a UTC server</th><th>Naive “days to 16 Nov”</th></tr></thead>
<tbody>
<tr><td>06:30, 2 Nov (VN)</td><td>2 Nov</td><td>1 Nov, 23:30</td><td>14 on the laptop · <strong>15</strong> on the server</td></tr>
<tr><td>12:00, 2 Nov (VN)</td><td>2 Nov</td><td>2 Nov, 05:00</td><td>14 · 14 — the bug is invisible</td></tr>
<tr><td>00:00, 3 Nov (VN)</td><td>3 Nov</td><td>2 Nov, 17:00</td><td>13 on the laptop · <strong>14</strong> on the server</td></tr>
</tbody>
</table>`;
const TZ_VI = `<table>
<thead><tr><th>Thời điểm</th><th>Ngày ở Việt Nam (UTC+7)</th><th>Ngày trên máy chủ UTC</th><th>Bản ngây thơ: “còn mấy ngày tới 16/11”</th></tr></thead>
<tbody>
<tr><td>06:30, 2/11 (giờ VN)</td><td>2/11</td><td>1/11, 23:30</td><td>14 trên laptop · <strong>15</strong> trên máy chủ</td></tr>
<tr><td>12:00, 2/11 (giờ VN)</td><td>2/11</td><td>2/11, 05:00</td><td>14 · 14 — bug vô hình</td></tr>
<tr><td>00:00, 3/11 (giờ VN)</td><td>3/11</td><td>2/11, 17:00</td><td>13 trên laptop · <strong>14</strong> trên máy chủ</td></tr>
</tbody>
</table>`;
const HAI_CACH_EN = `<table>
<thead><tr><th></th><th>Inject a clock</th><th>Fake timers</th></tr></thead>
<tbody>
<tr><td><strong>Example</strong></td><td><code>createLoginGuard(() =&gt; clock)</code></td><td><code>vi.useFakeTimers()</code></td></tr>
<tr><td><strong>How</strong></td><td>the code takes “now” as a parameter with a real default</td><td>Vitest swaps <code>Date</code>, <code>setTimeout</code>, <code>setInterval</code> globally</td></tr>
<tr><td><strong>Code change needed?</strong></td><td>yes — design for it</td><td>no</td></tr>
<tr><td><strong>Controls waiting (setTimeout)?</strong></td><td>no</td><td>yes</td></tr>
<tr><td><strong>Risk</strong></td><td>none — pure, nothing global</td><td>forgetting <code>useRealTimers</code> leaks into later tests</td></tr>
<tr><td><strong>Use for</strong></td><td>rules that read the date: <code>canCancel</code>, lock-out, “days ahead”</td><td>code that really waits: retry, debounce, timeouts</td></tr>
</tbody>
</table>`;
const HAI_CACH_VI = `<table>
<thead><tr><th></th><th>Tiêm đồng hồ</th><th>Fake timers (bộ hẹn giờ giả)</th></tr></thead>
<tbody>
<tr><td><strong>Ví dụ</strong></td><td><code>createLoginGuard(() =&gt; clock)</code></td><td><code>vi.useFakeTimers()</code></td></tr>
<tr><td><strong>Cách làm</strong></td><td>code nhận “bây giờ” qua tham số, mặc định là đồng hồ thật</td><td>Vitest thay <code>Date</code>, <code>setTimeout</code>, <code>setInterval</code> trên toàn cục</td></tr>
<tr><td><strong>Phải sửa code?</strong></td><td>có — thiết kế sẵn cho việc đó</td><td>không</td></tr>
<tr><td><strong>Điều khiển việc chờ (setTimeout)?</strong></td><td>không</td><td>có</td></tr>
<tr><td><strong>Rủi ro</strong></td><td>không — thuần, không đụng gì toàn cục</td><td>quên <code>useRealTimers</code> là rò sang các test sau</td></tr>
<tr><td><strong>Dùng cho</strong></td><td>luật đọc ngày giờ: <code>canCancel</code>, khoá tài khoản, “còn mấy ngày”</td><td>code thật sự phải chờ: retry, debounce, timeout</td></tr>
</tbody>
</table>`;

export default {
  title: '2.2 — Controlling time: fake timers, frozen dates and the UTC+7 trap|||2.2 — Kiểm soát thời gian: fake timers, ngày giờ đóng băng và cái bẫy UTC+7',
  slug: 'tst-2-2-thoi-gian',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Thời gian là đầu vào: canCancel (Lite-3), daysAheadVN (BR-05), bộ khoá đăng nhập (BR-02), retry có giãn cách. Bug múi giờ đo thật dưới TZ=Asia/Ho_Chi_Minh và TZ=UTC; vi.useFakeTimers + setSystemTime, biên 59/60/61 phút, nhảy 15 phút bằng advanceTimersByTime; tiêm đồng hồ vs fake timers; retry 3 s thật so với 3 ms giả; đồng hồ giả bị rò sang test sau.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Controlling time</h2>
<p class="lead">“Cancel until an hour before.” “Locked for fifteen minutes.” “At most fourteen days ahead.” “Try again in a second.” Business rules are full of time, and a test that reads the real clock gives different answers at different moments and on different machines. This lesson makes time an ordinary input you control — without waiting for it.</p>

<h3>Four small modules that depend on time</h3>
<p>Add these files to LabFlow Lite. Each one is short; each one is a classic place for bugs.</p>
${ma('javascript', CODE.cancel)}
${ma('javascript', CODE.days)}
${ma('javascript', CODE.guard)}
${ma('javascript', CODE.retry)}
<ul>
<li><code>canCancel</code> (Lite-3) and <code>daysAheadVN</code> (BR-05) take <code>now</code> as a parameter that <strong>defaults</strong> to the real clock.</li>
<li><code>createLoginGuard</code> (BR-02) takes a function <code>now</code> that returns milliseconds, defaulting to <code>Date.now</code>. Five wrong passwords lock the account for fifteen minutes; a success clears the counter.</li>
<li><code>retry</code> calls a function up to three times and <em>really waits</em> between attempts — 1 s, then 2 s (“back-off”) — the usual way to survive a mail server that hiccups.</li>
</ul>

<h3>Time is an input</h3>
<p>Look at <code>canCancel(startsAt, now = new Date())</code>. If a test calls <code>canCancel(new Date('2026-11-16T09:00:00+07:00'))</code> without <code>now</code>, the answer depends on when you run it: true at 07:00, false at 08:30, and false forever after 16 November. Nothing in the code changed; the <em>input</em> did. Unit tests must be <strong>repeatable</strong> (the R in F.I.R.S.T.), so “now” has to be controlled — either passed in, or frozen.</p>

<h3>The time-zone bug, measured</h3>
<p>BR-05 says a booking may be made at most fourteen days ahead. Here is a first attempt that looks perfectly reasonable on a laptop in Viet Nam:</p>
${ma('javascript', CODE.daysSai)}
<p>And a test that pins “now” to 06:30 on 2 November, Viet Nam time — a student booking before the first class:</p>
${ma('javascript', CODE.muiGio)}
<p>Run it twice. The <code>TZ</code> environment variable sets the time zone of the Node process; most Docker images and CI runners use UTC.</p>
${ra(OUT['22-tz-vn'])}
${ra(OUT['22-tz-utc'])}
<p>Same code, same test, same “now” — and on the server the naive version says <strong>15</strong>, so a valid booking for 16 November would be refused. The reason is in the table:</p>
${TZ_EN}
<p><code>setHours(0, 0, 0, 0)</code> means “midnight <em>in this machine’s time zone</em>”. Between 00:00 and 07:00 Viet Nam time a UTC server still lives in yesterday. At lunchtime both agree — which is exactly when people write tests, and why this bug ships. (A second subtlety: <code>new Date('2026-11-16')</code> with a date only is parsed as UTC midnight, while <code>new Date('2026-11-16T00:00')</code> is local midnight. Mixing the two is another common source of off-by-one days.)</p>
<p><code>daysAheadVN</code> avoids both: it shifts “now” by seven hours, takes the date part of the ISO string — today’s date <em>in Viet Nam</em> — and compares two UTC midnights. It gives the same answer on any machine. Two habits from this:</p>
<ul>
<li>run your suite once with <code>TZ=UTC npm test</code> before pushing (Chapter 9 makes CI do it);</li>
<li>pick test times near midnight on purpose — that is where time-zone bugs live.</li>
</ul>

<h3>Fake timers: freeze “now”</h3>
${ma('javascript', CODE.dongHo)}
${ra(OUT['22-dong-ho'])}
<ul>
<li><code>vi.useFakeTimers()</code> replaces <code>Date</code>, <code>setTimeout</code>, <code>setInterval</code> and friends with fakes that Vitest controls. <code>vi.setSystemTime(...)</code> decides what “now” is. The first test proves it: <code>new Date()</code> returns exactly the moment we set (07:00 in Viet Nam is 00:00 UTC).</li>
<li>The <code>it.each</code> rows test Lite-3 at its boundary: 07:59 (61 minutes before a 09:00 booking), 08:00 (exactly 60) and 08:01 (59). “Until 60 minutes before” includes 60, so 08:00 is still <code>true</code>. A time limit is a boundary like any other — lesson 1.4’s technique applies unchanged.</li>
<li><code>vi.advanceTimersByTime(ms)</code> moves the fake clock forward instantly. The BR-02 test checks one millisecond before fifteen minutes (still locked) and exactly fifteen minutes (unlocked). Fifteen minutes of business time, under a millisecond of test time.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a frozen clock that is never restored.</strong> Fake timers are global for the test file. If one test freezes time and nobody calls <code>vi.useRealTimers()</code>, the following tests in the same file still live in that frozen time:</p>
${ma('javascript', CODE.dongHoRoRi)}
${ra(OUT['22-ro-ri'])}
${ra(OUT['22-ro-ri-B'])}
<p>B is correct and fails only when A runs before it — an order-dependent failure, the hardest kind to debug. Put <code>vi.useRealTimers()</code> in <code>afterEach</code> every time you use fake timers. (Vitest runs each test <em>file</em> in its own isolated environment by default, so the leak stays inside the file — which is exactly why it looks random: it depends on which tests are in the file and in what order.)</p>
</div>

<h3>The other way: inject a clock</h3>
<p>The login guard accepts its clock as a parameter, so the reference tests for Lab 2 do not need fake timers at all — they move a plain variable:</p>
${ma('javascript', CODE.guardTest)}
${HAI_CACH_EN}
<p>Rule of thumb for this course: <strong>rules take “now” as a parameter</strong> and are tested by passing it; <strong>fake timers only where code really waits</strong>. Injection is the “ports and adapters” idea of Chapter 3 in miniature: the code depends on “something that tells the time”, and the test provides a controllable one.</p>

<h3>Code that waits: retry with back-off</h3>
<p>First the honest test with real timers — it works, and costs three seconds:</p>
${ma('javascript', CODE.retryThat)}
<p>Then the same behaviour with fake timers, checking the exact schedule:</p>
${ma('javascript', CODE.retryGia)}
${ra(OUT['22-retry'])}
<ul>
<li>3006 ms against 4 ms — and the fast test checks <em>more</em>: that the second attempt happens at exactly 1000 ms and the third 2000 ms later, which the slow test never verified.</li>
<li><code>retry(mailer)</code> is started <strong>without</strong> <code>await</code>: if we awaited it, the test would wait for timers that only move when we move them — a deadlock.</li>
<li><code>advanceTimersByTimeAsync</code> (with <em>Async</em>) also lets pending promises settle between timers. <code>retry</code> uses <code>await</code> inside its loop, so the synchronous version would fire the timer but not let the next attempt start.</li>
<li><code>vi.fn().mockRejectedValueOnce(...).mockResolvedValue('sent')</code> is a tiny fake mail sender: fail, fail, then succeed. Chapter 3 covers <code>vi.fn</code> properly.</li>
<li>In the “gives up” test the expectation <code>check</code> is created <em>before</em> running the timers and awaited after, so the rejection always has a handler — otherwise Node would report an unhandled rejection in between.</li>
</ul>

${lienKet({ bai: 'swt301-blackbox-state-transition', title: 'Also in SWT301 — 4.5: state transition testing (the ATM PIN model)', sub: 'Same: behaviour depends on what happened before — the 3rd wrong PIN eats the card, the 5th wrong password here locks the account. Different: SWT301 draws the state diagram and table on paper; here the transitions are executable tests, including the timed transition back to “unlocked” after exactly 15 minutes.', cta: 'OPEN SWT301 LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Freeze the clock at 08:00 Viet Nam time and test bookings 59, 60 and 61 minutes away with <code>canCancel</code>.</li>
<li>After a lock expires, show that 4 new failures do <strong>not</strong> lock the account and the 5th does.</li>
<li>Run <code>demo2/mui-gio.test.js</code> with <code>TZ=UTC</code> and with <code>TZ=Asia/Ho_Chi_Minh</code>; explain the difference in one sentence.</li>
<li>Run <code>demo2/dong-ho-ro-ri.test.js</code>, then add an <code>afterEach</code> with <code>vi.useRealTimers()</code> and run it again.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th22)}
${ra(OUT['22-th'])}
<p><strong>Done when:</strong> <code>th22</code> shows <code>4 passed</code>; the naive time-zone test fails only under <code>TZ=UTC</code>; and test B fails only when A runs first (“expected 2020 to be greater than or equal to 2026”) and passes once A cleans up after itself.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">fake timers</span><span class="v">Vitest’s replacements for <code>Date</code> and timer functions, moved by the test instead of by real time.</span></div>
  <div class="kv"><span class="k">vi.setSystemTime</span><span class="v">Sets what <code>new Date()</code> and <code>Date.now()</code> return while fake timers are on.</span></div>
  <div class="kv"><span class="k">vi.advanceTimersByTime(Async)</span><span class="v">Moves the fake clock forward and fires due timers; the Async version lets promises settle in between.</span></div>
  <div class="kv"><span class="k">inject a clock</span><span class="v">Pass “now” (or a function returning it) as a parameter, with the real clock as default.</span></div>
  <div class="kv"><span class="k">TZ</span><span class="v">Environment variable that sets a process’s time zone; CI and Docker usually run in UTC.</span></div>
  <div class="kv"><span class="k">UTC / UTC+7</span><span class="v">Coordinated Universal Time, and Viet Nam’s offset from it (7 hours ahead, no daylight saving).</span></div>
  <div class="kv"><span class="k">back-off</span><span class="v">Waiting longer after each failed attempt (1 s, 2 s, …) so a struggling service can recover.</span></div>
  <div class="kv"><span class="k">order-dependent test</span><span class="v">A test whose result depends on which tests ran before it — a sign of leaked state.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Time is an input: a unit test must never depend on the real clock.</li>
<li>Count calendar days in the users’ time zone; run the suite with <code>TZ=UTC</code> too and test near midnight.</li>
<li><code>vi.useFakeTimers</code> + <code>vi.setSystemTime</code> freeze “now”; always <code>vi.useRealTimers()</code> in <code>afterEach</code>.</li>
<li><code>advanceTimersByTime(Async)</code> turns minutes into microseconds — and lets you check exact delays.</li>
<li>Inject a clock into rules; use fake timers for code that really waits.</li>
<li>Every time limit is a boundary: test on it and one step either side.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Kiểm soát thời gian</h2>
<p class="lead">“Được huỷ tới trước giờ học một tiếng.” “Khoá mười lăm phút.” “Đặt trước tối đa mười bốn ngày.” “Một giây nữa thử lại.” Luật nghiệp vụ đầy những mốc thời gian, và một test đọc đồng hồ thật sẽ cho kết quả khác nhau ở những thời điểm khác nhau, trên những máy khác nhau. Bài này biến thời gian thành một đầu vào bình thường do bạn điều khiển — mà không phải ngồi chờ nó.</p>

<h3>Bốn module nhỏ phụ thuộc thời gian</h3>
<p>Thêm các file này vào LabFlow Lite. File nào cũng ngắn; file nào cũng là chỗ bug hay nấp.</p>
${ma('javascript', CODE.cancel)}
${ma('javascript', CODE.days)}
${ma('javascript', CODE.guard)}
${ma('javascript', CODE.retry)}
<ul>
<li><code>canCancel</code> (Lite-3) và <code>daysAheadVN</code> (BR-05) nhận <code>now</code> qua tham số, <strong>mặc định</strong> là đồng hồ thật.</li>
<li><code>createLoginGuard</code> (BR-02) nhận một hàm <code>now</code> trả về số mili-giây, mặc định là <code>Date.now</code>. Năm lần sai mật khẩu khoá tài khoản mười lăm phút; một lần đúng xoá bộ đếm.</li>
<li><code>retry</code> gọi một hàm tối đa ba lần và <em>chờ thật</em> giữa các lần — 1 giây rồi 2 giây (“back-off”, giãn cách) — cách thường dùng để sống sót qua một máy chủ thư thỉnh thoảng trục trặc.</li>
</ul>

<h3>Thời gian là một đầu vào</h3>
<p>Nhìn <code>canCancel(startsAt, now = new Date())</code>. Nếu test gọi <code>canCancel(new Date('2026-11-16T09:00:00+07:00'))</code> mà không truyền <code>now</code>, đáp số tuỳ vào lúc bạn chạy: true lúc 07:00, false lúc 08:30, và false mãi mãi sau ngày 16/11. Code không đổi gì; <em>đầu vào</em> đổi. Unit test phải <strong>lặp lại được</strong> (chữ R trong F.I.R.S.T.), nên “bây giờ” phải được kiểm soát — hoặc truyền vào, hoặc đóng băng.</p>

<h3>Bug múi giờ, đo thật</h3>
<p>BR-05 nói chỉ được đặt trước tối đa mười bốn ngày. Đây là một lần thử đầu trông hoàn toàn hợp lý trên laptop ở Việt Nam:</p>
${ma('javascript', CODE.daysSai)}
<p>Và một test ghim “bây giờ” vào 06:30 sáng 2/11 giờ Việt Nam — một sinh viên đặt phòng trước tiết học đầu:</p>
${ma('javascript', CODE.muiGio)}
<p>Chạy hai lần. Biến môi trường <code>TZ</code> đặt múi giờ cho tiến trình Node; phần lớn image Docker và máy chạy CI dùng UTC (giờ quốc tế).</p>
${ra(OUT['22-tz-vn'])}
${ra(OUT['22-tz-utc'])}
<p>Cùng code, cùng test, cùng “bây giờ” — vậy mà trên máy chủ bản ngây thơ ra <strong>15</strong>, nên một lượt đặt hợp lệ cho ngày 16/11 sẽ bị từ chối. Lý do nằm trong bảng:</p>
${TZ_VI}
<p><code>setHours(0, 0, 0, 0)</code> nghĩa là “nửa đêm <em>theo múi giờ của máy này</em>”. Từ 00:00 tới 07:00 giờ Việt Nam, máy chủ UTC vẫn đang sống ở ngày hôm qua. Buổi trưa hai bên khớp nhau — mà đó đúng là lúc người ta viết test, nên bug này lọt ra ngoài. (Một điểm tinh tế nữa: <code>new Date('2026-11-16')</code> chỉ có ngày thì được hiểu là nửa đêm UTC, còn <code>new Date('2026-11-16T00:00')</code> là nửa đêm giờ máy. Trộn hai kiểu này là một nguồn lệch-một-ngày phổ biến khác.)</p>
<p><code>daysAheadVN</code> tránh được cả hai: nó dời “bây giờ” thêm bảy giờ, lấy phần ngày của chuỗi ISO — tức ngày hôm nay <em>ở Việt Nam</em> — rồi so hai mốc nửa đêm UTC. Máy nào cũng cho cùng đáp số. Rút ra hai thói quen:</p>
<ul>
<li>chạy bộ test một lần với <code>TZ=UTC npm test</code> trước khi đẩy code (Chương 9 bắt CI làm việc này);</li>
<li>cố ý chọn giờ test sát nửa đêm — đó là chỗ bug múi giờ sống.</li>
</ul>

<h3>Fake timers: đóng băng “bây giờ”</h3>
${ma('javascript', CODE.dongHo)}
${ra(OUT['22-dong-ho'])}
<ul>
<li><code>vi.useFakeTimers()</code> thay <code>Date</code>, <code>setTimeout</code>, <code>setInterval</code> và các bạn của chúng bằng bản giả do Vitest điều khiển. <code>vi.setSystemTime(...)</code> quyết định “bây giờ” là lúc nào. Test đầu chứng minh điều đó: <code>new Date()</code> trả về đúng thời điểm ta đặt (07:00 giờ Việt Nam là 00:00 UTC).</li>
<li>Các dòng <code>it.each</code> test Lite-3 ngay tại biên: 07:59 (trước lượt đặt 09:00 là 61 phút), 08:00 (đúng 60) và 08:01 (59). “Tới trước 60 phút” bao gồm cả 60, nên 08:00 vẫn là <code>true</code>. Một giới hạn thời gian là một biên như mọi biên khác — kỹ thuật của bài 1.4 áp dụng nguyên vẹn.</li>
<li><code>vi.advanceTimersByTime(ms)</code> đẩy đồng hồ giả tới trước ngay lập tức. Test BR-02 kiểm thời điểm thiếu một mili-giây là đủ mười lăm phút (vẫn khoá) và đúng mười lăm phút (mở khoá). Mười lăm phút nghiệp vụ, chưa tới một mili-giây thời gian test.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — đồng hồ đóng băng mà không bao giờ được trả lại.</strong> Fake timers có tác dụng toàn cục trong file test. Nếu một test đóng băng thời gian mà không ai gọi <code>vi.useRealTimers()</code>, các test phía sau trong cùng file vẫn sống trong thời gian bị đóng băng đó:</p>
${ma('javascript', CODE.dongHoRoRi)}
${ra(OUT['22-ro-ri'])}
${ra(OUT['22-ro-ri-B'])}
<p>B viết đúng và chỉ hỏng khi A chạy trước nó — một lỗi phụ thuộc thứ tự, loại khó gỡ nhất. Hãy đặt <code>vi.useRealTimers()</code> trong <code>afterEach</code> mỗi khi dùng fake timers. (Mặc định Vitest chạy mỗi <em>file</em> test trong một môi trường cách ly riêng, nên chỗ rò chỉ nằm trong file — chính vì thế nó trông như ngẫu nhiên: nó tuỳ vào file có những test nào và theo thứ tự nào.)</p>
</div>

<h3>Cách còn lại: tiêm đồng hồ</h3>
<p>Bộ chặn đăng nhập nhận đồng hồ qua tham số, nên bộ test tham khảo của Lab 2 không cần fake timers chút nào — nó chỉ dịch một biến bình thường:</p>
${ma('javascript', CODE.guardTest)}
${HAI_CACH_VI}
<p>Quy tắc của khoá này: <strong>luật nhận “bây giờ” qua tham số</strong> và được test bằng cách truyền nó vào; <strong>fake timers chỉ dùng ở chỗ code thật sự chờ</strong>. Tiêm đồng hồ là ý tưởng “ports and adapters” của Chương 3 thu nhỏ: code phụ thuộc vào “một thứ cho biết giờ”, và test cung cấp một thứ điều khiển được.</p>

<h3>Code phải chờ: retry có giãn cách</h3>
<p>Trước hết là test trung thực với đồng hồ thật — chạy được, và tốn ba giây:</p>
${ma('javascript', CODE.retryThat)}
<p>Rồi cùng hành vi đó với fake timers, kiểm từng mốc lịch chính xác:</p>
${ma('javascript', CODE.retryGia)}
${ra(OUT['22-retry'])}
<ul>
<li>3006 ms so với 4 ms — mà test nhanh còn kiểm <em>nhiều hơn</em>: lần thử thứ hai xảy ra đúng ở 1000 ms và lần thứ ba sau đó 2000 ms, điều test chậm chưa từng kiểm.</li>
<li><code>retry(mailer)</code> được khởi động <strong>không</strong> có <code>await</code>: nếu await, test sẽ chờ những bộ hẹn giờ chỉ nhích khi chính ta đẩy chúng — kẹt cứng (deadlock).</li>
<li><code>advanceTimersByTimeAsync</code> (có <em>Async</em>) còn cho các promise đang chờ kịp hoàn tất giữa các bộ hẹn giờ. <code>retry</code> dùng <code>await</code> trong vòng lặp, nên bản đồng bộ sẽ kích bộ hẹn giờ mà không cho lần thử tiếp theo kịp bắt đầu.</li>
<li><code>vi.fn().mockRejectedValueOnce(...).mockResolvedValue('sent')</code> là một bộ gửi thư giả bé xíu: hỏng, hỏng, rồi thành công. Chương 3 dạy <code>vi.fn</code> đầy đủ.</li>
<li>Trong test “bỏ cuộc”, kỳ vọng <code>check</code> được tạo <em>trước</em> khi chạy các bộ hẹn giờ và await sau đó, để lần từ chối luôn có người xử lý — nếu không, Node sẽ báo một unhandled rejection ở giữa.</li>
</ul>

${lienKet({ bai: 'swt301-blackbox-state-transition', title: 'Đã gặp ở SWT301 — 4.5: kiểm thử chuyển trạng thái (mô hình PIN ATM)', sub: 'Giống: hành vi phụ thuộc vào chuyện đã xảy ra trước đó — lần sai PIN thứ 3 thì máy nuốt thẻ, lần sai mật khẩu thứ 5 ở đây thì khoá tài khoản. Khác: SWT301 vẽ sơ đồ và bảng trạng thái trên giấy; ở đây các chuyển đổi là test chạy được, kể cả chuyển đổi theo thời gian về lại “mở khoá” sau đúng 15 phút.', cta: 'MỞ BÀI SWT301 →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Đóng băng đồng hồ lúc 08:00 giờ Việt Nam và test các lượt đặt cách 59, 60 và 61 phút bằng <code>canCancel</code>.</li>
<li>Sau khi một lần khoá hết hạn, chứng minh 4 lần sai mới <strong>không</strong> khoá tài khoản còn lần thứ 5 thì có.</li>
<li>Chạy <code>demo2/mui-gio.test.js</code> với <code>TZ=UTC</code> và với <code>TZ=Asia/Ho_Chi_Minh</code>; giải thích khác biệt trong một câu.</li>
<li>Chạy <code>demo2/dong-ho-ro-ri.test.js</code>, rồi thêm một <code>afterEach</code> có <code>vi.useRealTimers()</code> và chạy lại.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th22)}
${ra(OUT['22-th'])}
<p><strong>Đạt khi:</strong> <code>th22</code> hiện <code>4 passed</code>; test múi giờ ngây thơ chỉ hỏng dưới <code>TZ=UTC</code>; và test B chỉ hỏng khi A chạy trước (“expected 2020 to be greater than or equal to 2026”), rồi đạt khi A tự dọn dẹp sau khi chạy.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">fake timers (bộ hẹn giờ giả)</span><span class="v">Bản thay thế của Vitest cho <code>Date</code> và các hàm hẹn giờ, do test đẩy đi thay vì thời gian thật.</span></div>
  <div class="kv"><span class="k">vi.setSystemTime</span><span class="v">Đặt giá trị mà <code>new Date()</code> và <code>Date.now()</code> trả về khi đang bật fake timers.</span></div>
  <div class="kv"><span class="k">vi.advanceTimersByTime(Async)</span><span class="v">Đẩy đồng hồ giả tới trước và kích các bộ hẹn giờ tới hạn; bản Async cho promise kịp hoàn tất ở giữa.</span></div>
  <div class="kv"><span class="k">inject a clock (tiêm đồng hồ)</span><span class="v">Truyền “bây giờ” (hoặc một hàm trả về nó) qua tham số, mặc định là đồng hồ thật.</span></div>
  <div class="kv"><span class="k">TZ</span><span class="v">Biến môi trường đặt múi giờ cho tiến trình; CI và Docker thường chạy UTC.</span></div>
  <div class="kv"><span class="k">UTC / UTC+7</span><span class="v">Giờ phối hợp quốc tế, và độ lệch của Việt Nam so với nó (sớm hơn 7 tiếng, không đổi giờ mùa hè).</span></div>
  <div class="kv"><span class="k">back-off (giãn cách)</span><span class="v">Chờ lâu hơn sau mỗi lần thử hỏng (1 s, 2 s, …) để dịch vụ đang quá tải kịp hồi phục.</span></div>
  <div class="kv"><span class="k">order-dependent test (test phụ thuộc thứ tự)</span><span class="v">Test có kết quả tuỳ vào những test nào đã chạy trước nó — dấu hiệu trạng thái bị rò rỉ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thời gian là một đầu vào: unit test không bao giờ được phụ thuộc đồng hồ thật.</li>
<li>Đếm ngày theo múi giờ của người dùng; chạy thêm bộ test với <code>TZ=UTC</code> và test sát nửa đêm.</li>
<li><code>vi.useFakeTimers</code> + <code>vi.setSystemTime</code> đóng băng “bây giờ”; luôn <code>vi.useRealTimers()</code> trong <code>afterEach</code>.</li>
<li><code>advanceTimersByTime(Async)</code> biến vài phút thành vài micro-giây — và cho bạn kiểm chính xác từng khoảng chờ.</li>
<li>Tiêm đồng hồ cho luật; dùng fake timers cho code thật sự phải chờ.</li>
<li>Mọi giới hạn thời gian là một biên: test ngay trên nó và lệch một bước hai bên.</li>
</ul>
</div>
`,
};
