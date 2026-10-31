/**
 * Testing · Chương 2 · Lab 2 — Bất đồng bộ, thời gian và lỗi: diệt 8 đột biến. BÀI MỚI 01/11/2026, slug tst-2-5-lab-bat-dong-bo.
 * Máy chấm = scripts/dot-bien-2.mjs (cài 8 bug từng con, chạy vitest run src/, trả code). Output chạy thật (_ma.mjs):
 * bộ yếu 5 test xanh → 0/8; lời giải 22 test (62 cùng Lab 1) → 8/8; xanh cả TZ=UTC lẫn TZ=Asia/Ho_Chi_Minh.
 */
import G from '../giang/tst-lab-2.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const MUTANTS_EN = `<table>
<thead><tr><th>#</th><th>File</th><th>Original</th><th>Planted bug</th><th>What it means for users</th></tr></thead>
<tbody>
<tr><td>1</td><td>rules/cancel.js</td><td><code>minutesLeft &gt;= CANCEL_LIMIT_MINUTES</code></td><td><code>&gt;</code></td><td>cancelling exactly 60 minutes before is refused</td></tr>
<tr><td>2</td><td>auth/login-guard.js</td><td><code>s.failures &gt;= MAX_FAILURES</code></td><td><code>&gt;</code></td><td>the account locks after 6 wrong passwords, not 5</td></tr>
<tr><td>3</td><td>auth/login-guard.js</td><td><code>s.lockedUntil &gt; now()</code></td><td><code>&gt;=</code></td><td>still locked at exactly 15:00</td></tr>
<tr><td>4</td><td>auth/login-guard.js</td><td><code>state.delete(email);</code></td><td><code>void email;</code></td><td>a correct password no longer resets the counter</td></tr>
<tr><td>5</td><td>lib/retry.js</td><td><code>delayMs * i</code></td><td><code>delayMs</code></td><td>no back-off: waits 1 s every time</td></tr>
<tr><td>6</td><td>lib/retry.js</td><td><code>i &lt;= attempts</code></td><td><code>i &lt; attempts</code></td><td>one attempt too few</td></tr>
<tr><td>7</td><td>booking/service.js</td><td><code>throw new BookingError('STORAGE_DOWN', { cause: err });</code> (the first one)</td><td><code>throw err;</code></td><td>a database outage leaks the raw driver error</td></tr>
<tr><td>8</td><td>rules/days.js</td><td><code>now.getTime() + VN_OFFSET_MS</code></td><td><code>now.getTime()</code></td><td>“days ahead” counted in UTC, not Viet Nam time</td></tr>
</tbody>
</table>`;
const MUTANTS_VI = `<table>
<thead><tr><th>#</th><th>File</th><th>Dòng gốc</th><th>Bug được cài</th><th>Với người dùng nghĩa là</th></tr></thead>
<tbody>
<tr><td>1</td><td>rules/cancel.js</td><td><code>minutesLeft &gt;= CANCEL_LIMIT_MINUTES</code></td><td><code>&gt;</code></td><td>huỷ đúng lúc còn 60 phút bị từ chối</td></tr>
<tr><td>2</td><td>auth/login-guard.js</td><td><code>s.failures &gt;= MAX_FAILURES</code></td><td><code>&gt;</code></td><td>tài khoản khoá sau 6 lần sai, không phải 5</td></tr>
<tr><td>3</td><td>auth/login-guard.js</td><td><code>s.lockedUntil &gt; now()</code></td><td><code>&gt;=</code></td><td>đúng 15:00 vẫn còn khoá</td></tr>
<tr><td>4</td><td>auth/login-guard.js</td><td><code>state.delete(email);</code></td><td><code>void email;</code></td><td>đăng nhập đúng không còn xoá bộ đếm</td></tr>
<tr><td>5</td><td>lib/retry.js</td><td><code>delayMs * i</code></td><td><code>delayMs</code></td><td>không giãn cách: lần nào cũng chờ 1 giây</td></tr>
<tr><td>6</td><td>lib/retry.js</td><td><code>i &lt;= attempts</code></td><td><code>i &lt; attempts</code></td><td>thiếu một lần thử</td></tr>
<tr><td>7</td><td>booking/service.js</td><td><code>throw new BookingError('STORAGE_DOWN', { cause: err });</code> (cái đầu tiên)</td><td><code>throw err;</code></td><td>sự cố cơ sở dữ liệu để lọt lỗi gốc của driver</td></tr>
<tr><td>8</td><td>rules/days.js</td><td><code>now.getTime() + VN_OFFSET_MS</code></td><td><code>now.getTime()</code></td><td>“còn mấy ngày” bị đếm theo UTC, không theo giờ Việt Nam</td></tr>
</tbody>
</table>`;
const RUBRIC_EN = `<table>
<thead><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Mutants killed</td><td>4 (0.5 each)</td><td><code>node scripts/dot-bien-2.mjs</code></td></tr>
<tr><td>Time controlled: injected clock or fake timers, fake timers always restored in <code>afterEach</code>; no real waiting anywhere</td><td>2</td><td>the whole suite runs in under 1 second</td></tr>
<tr><td>Async done right: every promise awaited, rejections asserted with <code>rejects</code> (no try/catch without a guard)</td><td>1.5</td><td><code>requireAssertions</code> on · read the code</td></tr>
<tr><td>Errors asserted by code and cause, not by message wording</td><td>1</td><td><code>toMatchObject({ code })</code>, <code>cause.message</code></td></tr>
<tr><td>Repeatable: green under <code>TZ=UTC</code> and <code>TZ=Asia/Ho_Chi_Minh</code>, and ten runs in a row</td><td>1</td><td>run it</td></tr>
<tr><td>Names state rule + moment + result (“unlocked at exactly 15:00”); no <code>.only</code>/<code>.skip</code></td><td>0.5</td><td>read the report tree</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>Số đột biến bị diệt</td><td>4 (0,5 mỗi con)</td><td><code>node scripts/dot-bien-2.mjs</code></td></tr>
<tr><td>Kiểm soát thời gian: tiêm đồng hồ hoặc fake timers, fake timers luôn được trả lại trong <code>afterEach</code>; không chỗ nào chờ thật</td><td>2</td><td>cả bộ test chạy dưới 1 giây</td></tr>
<tr><td>Làm bất đồng bộ đúng: mọi promise đều được await, lần từ chối khẳng định bằng <code>rejects</code> (không có try/catch thiếu chốt chặn)</td><td>1,5</td><td>bật <code>requireAssertions</code> · đọc code</td></tr>
<tr><td>Khẳng định lỗi bằng mã và nguyên nhân, không bằng câu chữ</td><td>1</td><td><code>toMatchObject({ code })</code>, <code>cause.message</code></td></tr>
<tr><td>Lặp lại được: xanh dưới <code>TZ=UTC</code> và <code>TZ=Asia/Ho_Chi_Minh</code>, và mười lần chạy liền</td><td>1</td><td>chạy thử</td></tr>
<tr><td>Tên test nói luật + thời điểm + kết quả (“unlocked at exactly 15:00”); không <code>.only</code>/<code>.skip</code></td><td>0,5</td><td>đọc cây báo cáo</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 2 — Async, time and errors: kill 8 mutants|||Lab 2 — Bất đồng bộ, thời gian và lỗi: diệt 8 đột biến',
  slug: 'tst-2-5-lab-bat-dong-bo',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 2 có thang chấm 10 điểm: viết test cho canCancel, daysAheadVN, bộ khoá đăng nhập, retry và các nhánh lỗi của bookLab — không đồng hồ thật, không chờ thật, không may rủi; script dot-bien-2.mjs cài 8 bug (biên thời gian, giãn cách, nhánh catch, múi giờ). Output thật: bộ yếu 5 test xanh diệt 0/8; lời giải 22 test (62 cùng Lab 1) diệt 8/8, xanh dưới cả hai múi giờ.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lab 2</span>
<h2>Async, time and errors: kill 8 mutants</h2>
<p class="lead">About 90 minutes. You write the tests for everything Chapter 2 added to LabFlow Lite. The grading works exactly like Lab 1: a script plants eight realistic bugs, one at a time, and checks whether your suite turns red for each. This time the bugs hide where this chapter taught you to look — time limits, back-off delays, catch branches and time zones.</p>

<h3>Setup</h3>
<ol>
<li>Use the <code>labflow-lite</code> project with the files from lessons 2.1–2.4 exactly as given: <code>src/booking/service.js</code>, <code>src/rules/cancel.js</code>, <code>src/rules/days.js</code>, <code>src/auth/login-guard.js</code>, <code>src/lib/retry.js</code>. Do not change them — the script searches for exact lines.</li>
<li>Keep <code>requireAssertions</code> on (Lab 1) and add <code>restoreMocks: true</code> (lesson 2.4) to <code>vitest.config.js</code>.</li>
<li>Create <code>scripts/dot-bien-2.mjs</code>:
${ma('javascript', CODE.dotBien2)}</li>
</ol>
<p>Like Lab 1’s script, it replaces one exact piece of one line, runs <code>npx vitest run src/</code>, records <em>killed</em> if the run fails and <em>survived</em> if it passes, and restores the file in <code>finally</code>. <code>String.replace</code> with a string changes only the <strong>first</strong> match, which is why mutant #7 hits the catch around <code>findOverlap</code> and not the one around <code>insert</code>. Only <code>src/</code> counts: the deliberately broken demos in <code>demo2/</code> are ignored.</p>

<h3>The eight planted bugs</h3>
${MUTANTS_EN}

<h3>Your task</h3>
<p>Write tests in <code>src/</code> — one file next to each module, e.g. <code>src/rules/cancel.test.js</code>, <code>src/auth/login-guard.test.js</code> — so that:</p>
<ol>
<li><code>npm run test:unit</code> is green on the real code, in under a second, under <code>TZ=UTC</code> as well;</li>
<li><code>node scripts/dot-bien-2.mjs</code> prints <strong>8/8 mutants killed</strong>;</li>
<li><code>node scripts/dot-bien.mjs</code> (Lab 1) still prints 8/8.</li>
</ol>
<p>As in Lab 1, start from the rules, not from the mutant table: write each rule as a sentence with its limit (“a correct password resets the counter”), pick the values with boundary analysis, and only then run the script. A suite written only to kill these eight will miss the ninth bug.</p>

<h3>What a first attempt usually looks like</h3>
${ma('javascript', CODE.weak2)}
${ra(OUT['lab2-weak-run'])}
${ra(OUT['lab2-mut-weak'])}
<p>Five green tests and <strong>zero</strong> bugs noticed. Each test is in the right area but far from the line where its bug lives:</p>
<ul>
<li>cancelling <strong>two hours</strong> before — mutant #1 changes what happens at exactly 60 minutes;</li>
<li><strong>midday</strong> on 2 November — mutant #8 only matters between 00:00 and 07:00 Viet Nam time;</li>
<li><strong>ten</strong> failures — locked with 5 or with 6, so mutant #2 is invisible; and nobody moves the clock, so #3 is too;</li>
<li>a retry that succeeds <strong>at once</strong> — no delay and no second attempt ever happen;</li>
<li>only the happy path of <code>bookLab</code> — the catch branch never runs.</li>
</ul>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}
<p>Mutants alone cannot pass you: a suite that kills all eight but uses real timers (3 seconds per retry test) loses the two time points.</p>

<h3>Hints — open one at a time</h3>
<ol>
<li>Write down every limit: 60 minutes, 5 failures, 15 minutes, 1 s and 2 s, 3 attempts, UTC+7. For each, test on it and one step either side.</li>
<li>The login guard takes a clock: <code>createLoginGuard(() =&gt; clock)</code>, then move <code>clock</code> yourself — no fake timers needed.</li>
<li>For <code>retry</code>, start it without <code>await</code>, then <code>await vi.advanceTimersByTimeAsync(999)</code> and count the calls; repeat around 1000 ms and 3000 ms.</li>
<li>For #7, a repository whose <code>findOverlap</code> throws; assert <code>code</code> <em>and</em> <code>cause.message</code>.</li>
<li>For #8, choose “now” between 00:00 and 07:00 Viet Nam time, e.g. <code>2026-11-02T06:30:00+07:00</code>.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('javascript', CODE.cancelTest)}
${ma('javascript', CODE.daysTest)}
${ma('javascript', CODE.guardTest)}
${ma('javascript', CODE.retryTest)}
${ma('javascript', CODE.serviceTest)}
${ra(OUT['lab2-ch2'])}
${ra(OUT['lab2-full'])}
${ra(OUT['lab2-mut-strong'])}
<p>Twenty-two new tests, 62 with Lab 1, the whole suite in about two tenths of a second. We also ran it with <code>TZ=UTC</code> and <code>TZ=Asia/Ho_Chi_Minh</code>: 62 passed both times, and Lab 1’s script still prints 8/8. What made the difference: the cancel table puts a row <em>on</em> 60 minutes; the days table uses 06:30 and 00:00 Viet Nam time; the guard test moves an injected clock to 14:59.999 and 15:00 and checks that a success resets the counter; the retry test steps through 999, 1000, 2999 and 3000 ms; the service test uses repositories that fail on purpose.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run test:unit</code> is green, under one second, with no <code>.only</code> or <code>.skip</code>.</li>
<li><code>TZ=UTC npm run test:unit</code> is green too.</li>
<li><code>node scripts/dot-bien-2.mjs</code> prints <code>8/8 mutants killed</code>, and <code>node scripts/dot-bien.mjs</code> still prints 8/8.</li>
<li><code>git diff src/</code> shows only new test files — the scripts restored every source file.</li>
<li>Commit with a clear message, e.g. <code>test: async, time and error paths (Lab 2, 8/8 mutants)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mutant · killed · survived</span><span class="v">A planted change · the suite went red · the suite stayed green (a gap in the tests).</span></div>
  <div class="kv"><span class="k">boundary in time</span><span class="v">A time limit tested on the limit and one step either side (59/60/61 minutes, 14:59.999/15:00).</span></div>
  <div class="kv"><span class="k">injected clock</span><span class="v">A “now” function passed to the code so the test can move time by hand.</span></div>
  <div class="kv"><span class="k">fake repository</span><span class="v">A hand-made object with the repository’s methods that fails on purpose.</span></div>
  <div class="kv"><span class="k">repeatable</span><span class="v">Same result on every run, machine and time zone.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A green suite can notice nothing: five tests near, but not on, the risky lines killed 0 of 8.</li>
<li>Time bugs live on limits and near midnight; async bugs live in waits and catch branches.</li>
<li>Injected clocks, fake timers and fake repositories make every one of them testable in milliseconds.</li>
<li>The reference reached 8/8 with 22 fast, repeatable tests — and Lab 1 stayed at 8/8.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Lab 2</span>
<h2>Bất đồng bộ, thời gian và lỗi: diệt 8 đột biến</h2>
<p class="lead">Khoảng 90 phút. Bạn viết test cho mọi thứ Chương 2 đã thêm vào LabFlow Lite. Cách chấm giống hệt Lab 1: một script cài tám con bug thực tế, từng con một, và kiểm xem bộ test của bạn có đỏ với từng con không. Lần này bug nấp đúng những chỗ chương này dạy bạn soi — giới hạn thời gian, khoảng chờ giãn cách, nhánh catch và múi giờ.</p>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-lite</code> với các file của bài 2.1–2.4 giữ nguyên như đã cho: <code>src/booking/service.js</code>, <code>src/rules/cancel.js</code>, <code>src/rules/days.js</code>, <code>src/auth/login-guard.js</code>, <code>src/lib/retry.js</code>. Đừng sửa chúng — script tìm đúng từng dòng.</li>
<li>Giữ <code>requireAssertions</code> đang bật (Lab 1) và thêm <code>restoreMocks: true</code> (bài 2.4) vào <code>vitest.config.js</code>.</li>
<li>Tạo <code>scripts/dot-bien-2.mjs</code>:
${ma('javascript', CODE.dotBien2)}</li>
</ol>
<p>Giống script của Lab 1, nó thay đúng một đoạn của một dòng, chạy <code>npx vitest run src/</code>, ghi <em>killed</em> (bị diệt) nếu lần chạy hỏng và <em>survived</em> (sống sót) nếu đạt, rồi trả file về trong <code>finally</code>. <code>String.replace</code> với chuỗi chỉ thay chỗ khớp <strong>đầu tiên</strong>, vì thế đột biến số 7 trúng khối catch quanh <code>findOverlap</code> chứ không trúng khối quanh <code>insert</code>. Chỉ <code>src/</code> được tính: các demo cố ý viết sai trong <code>demo2/</code> bị bỏ qua.</p>

<h3>Tám con bug được cài</h3>
${MUTANTS_VI}

<h3>Nhiệm vụ</h3>
<p>Viết test trong <code>src/</code> — mỗi module một file nằm cạnh, ví dụ <code>src/rules/cancel.test.js</code>, <code>src/auth/login-guard.test.js</code> — sao cho:</p>
<ol>
<li><code>npm run test:unit</code> xanh trên code thật, dưới một giây, và cả dưới <code>TZ=UTC</code>;</li>
<li><code>node scripts/dot-bien-2.mjs</code> in <strong>8/8 mutants killed</strong>;</li>
<li><code>node scripts/dot-bien.mjs</code> (Lab 1) vẫn in 8/8.</li>
</ol>
<p>Như Lab 1, bắt đầu từ luật chứ không từ bảng đột biến: viết mỗi luật thành một câu kèm giới hạn của nó (“đăng nhập đúng thì xoá bộ đếm”), chọn giá trị bằng phân tích giá trị biên, rồi mới chạy script. Bộ test viết ra chỉ để diệt tám con này sẽ bỏ lọt con bug thứ chín.</p>

<h3>Lần thử đầu thường trông thế nào</h3>
${ma('javascript', CODE.weak2)}
${ra(OUT['lab2-weak-run'])}
${ra(OUT['lab2-mut-weak'])}
<p>Năm test xanh và <strong>không</strong> nhận ra con bug nào. Test nào cũng đúng khu vực nhưng đứng xa dòng có bug:</p>
<ul>
<li>huỷ trước <strong>hai tiếng</strong> — đột biến 1 chỉ đổi chuyện xảy ra ở đúng 60 phút;</li>
<li><strong>buổi trưa</strong> ngày 2/11 — đột biến 8 chỉ có tác dụng từ 00:00 tới 07:00 giờ Việt Nam;</li>
<li><strong>mười</strong> lần sai — khoá ở 5 hay ở 6 cũng đều khoá, nên đột biến 2 vô hình; và không ai dịch đồng hồ, nên đột biến 3 cũng vậy;</li>
<li>retry thành công <strong>ngay lập tức</strong> — không bao giờ có khoảng chờ hay lần thử thứ hai;</li>
<li>chỉ nhánh suôn của <code>bookLab</code> — nhánh catch không bao giờ chạy.</li>
</ul>

<h3>Thang chấm (10 điểm, đạt từ 7)</h3>
${RUBRIC_VI}
<p>Chỉ diệt đột biến thì chưa đủ đạt: bộ test diệt đủ tám con nhưng dùng đồng hồ thật (3 giây mỗi test retry) mất hai điểm phần thời gian.</p>

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Ghi ra mọi giới hạn: 60 phút, 5 lần sai, 15 phút, 1 giây và 2 giây, 3 lần thử, UTC+7. Với mỗi cái, test ngay trên nó và lệch một bước hai bên.</li>
<li>Bộ chặn đăng nhập nhận đồng hồ: <code>createLoginGuard(() =&gt; clock)</code>, rồi tự dịch <code>clock</code> — không cần fake timers.</li>
<li>Với <code>retry</code>, khởi động mà không <code>await</code>, rồi <code>await vi.advanceTimersByTimeAsync(999)</code> và đếm số lần gọi; lặp lại quanh 1000 ms và 3000 ms.</li>
<li>Với đột biến 7, một repository có <code>findOverlap</code> ném lỗi; khẳng định <code>code</code> <em>và</em> <code>cause.message</code>.</li>
<li>Với đột biến 8, chọn “bây giờ” trong khoảng 00:00–07:00 giờ Việt Nam, ví dụ <code>2026-11-02T06:30:00+07:00</code>.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã tự làm)</h3>
${ma('javascript', CODE.cancelTest)}
${ma('javascript', CODE.daysTest)}
${ma('javascript', CODE.guardTest)}
${ma('javascript', CODE.retryTest)}
${ma('javascript', CODE.serviceTest)}
${ra(OUT['lab2-ch2'])}
${ra(OUT['lab2-full'])}
${ra(OUT['lab2-mut-strong'])}
<p>Hai mươi hai test mới, 62 test cùng Lab 1, cả bộ chạy chừng hai phần mười giây. Chúng tôi cũng chạy với <code>TZ=UTC</code> và <code>TZ=Asia/Ho_Chi_Minh</code>: cả hai lần đều 62 passed, và script của Lab 1 vẫn in 8/8. Thứ tạo ra khác biệt: bảng huỷ có một dòng <em>đúng</em> 60 phút; bảng ngày dùng 06:30 và 00:00 giờ Việt Nam; test bộ chặn dịch đồng hồ được tiêm tới 14:59.999 và 15:00, và kiểm rằng một lần đúng xoá bộ đếm; test retry đi qua từng mốc 999, 1000, 2999 và 3000 ms; test dịch vụ dùng các repository cố ý hỏng.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run test:unit</code> xanh, dưới một giây, không có <code>.only</code> hay <code>.skip</code>.</li>
<li><code>TZ=UTC npm run test:unit</code> cũng xanh.</li>
<li><code>node scripts/dot-bien-2.mjs</code> in <code>8/8 mutants killed</code>, và <code>node scripts/dot-bien.mjs</code> vẫn in 8/8.</li>
<li><code>git diff src/</code> chỉ có các file test mới — script đã trả mọi file nguồn về như cũ.</li>
<li>Commit với lời nhắn rõ ràng, ví dụ <code>test: async, time and error paths (Lab 2, 8/8 mutants)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mutant · killed · survived (đột biến · bị diệt · sống sót)</span><span class="v">Một thay đổi được cài · bộ test đỏ · bộ test vẫn xanh (một lỗ hổng trong test).</span></div>
  <div class="kv"><span class="k">biên thời gian</span><span class="v">Giới hạn thời gian được test ngay trên nó và lệch một bước hai bên (59/60/61 phút, 14:59.999/15:00).</span></div>
  <div class="kv"><span class="k">injected clock (đồng hồ được tiêm)</span><span class="v">Một hàm “bây giờ” truyền vào code để test tự tay dịch thời gian.</span></div>
  <div class="kv"><span class="k">repository giả</span><span class="v">Object tự dựng có các phương thức của repository và cố ý hỏng.</span></div>
  <div class="kv"><span class="k">repeatable (lặp lại được)</span><span class="v">Cùng kết quả ở mọi lần chạy, mọi máy, mọi múi giờ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bộ test xanh vẫn có thể không nhận ra gì: năm test ở gần, nhưng không trúng, những dòng rủi ro đã diệt 0/8.</li>
<li>Bug thời gian sống ở các giới hạn và quanh nửa đêm; bug bất đồng bộ sống ở các khoảng chờ và nhánh catch.</li>
<li>Đồng hồ được tiêm, fake timers và repository giả làm mọi chỗ đó test được trong vài mili-giây.</li>
<li>Lời giải đạt 8/8 với 22 test nhanh, lặp lại được — và Lab 1 vẫn giữ 8/8.</li>
</ul>
</div>
`,
};
