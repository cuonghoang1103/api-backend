/**
 * Testing · Mục 0 · Bắt đầu tại đây (2/2) — tst-0-9-bat-dau-khi-khong-co (slug giữ từ khung).
 * Sự cố: SEC 2013-222; Wikipedia Therac-25 / Ariane flight V88 / Mars Climate Orbiter; CrowdStrike RCA 06/08/2024 (đọc bản PDF);
 * Microsoft 20/07/2024. Sự cố "nhà làm": CLAUDE.md mục sandbox R2 + email (10–11/10/2026). Minh hoạ A/B ghi rõ KHÔNG phải chuyện thật.
 * Output: chạy thật Node 22.23.3 (khop.test.js) 31/10/2026.
 */
import G from '../giang/tst-00-9.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';

const M = {
  khop: `
// Một "mẫu" so với dữ liệu đầu vào, từng trường một. '*' nghĩa là khớp mọi thứ.
export function matches(pattern, inputs) {
  return pattern.every((p, i) => {
    if (p === '*') return true; // không cần đọc dữ liệu
    if (i >= inputs.length) throw new RangeError('no input field ' + (i + 1));
    return p === inputs[i];
  });
}
`,
  khopTest: `
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matches } from './khop.js';

const inputs = Array.from({ length: 20 }, (_, i) => 'v' + (i + 1)); // 20 trường
const pattern = [...inputs, '*'];                                    // mẫu 21 trường

test('pattern with a wildcard in field 21 matches', () => {
  assert.equal(matches(pattern, inputs), true);
});

test('pattern with a real value in field 21', () => {
  const real = [...inputs, 'v21'];
  assert.equal(matches(real, inputs), false);
});
`,
  khopOut: `
$ node --test --test-reporter=spec khop.test.js
✔ pattern with a wildcard in field 21 matches (0.461167ms)
✖ pattern with a real value in field 21 (0.137459ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
…

✖ failing tests:

test at khop.test.js:12:1
✖ pattern with a real value in field 21 (0.137459ms)
  RangeError: no input field 21
      at file://…/thu-test/khop.js:5:35
      at Array.every (<anonymous>)
      at matches (file://…/thu-test/khop.js:3:18)
      at TestContext.<anonymous> (file://…/thu-test/khop.test.js:14:16)
      …
`,
  red: `
 FAIL  src/rules/time.test.js > formatTime > pads hours and minutes to two digits
AssertionError: expected '7:30' to be '07:30' // Object.is equality

Expected: "07:30"
Received: "7:30"

 ❯ src/rules/time.test.js:16:29
     14| describe('formatTime', () => {
     15|   it('pads hours and minutes to two digits', () => {
     16|     expect(formatTime(450)).toBe('07:30');
       |                             ^
     17|   });
     18| });

 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
`,
};

const NGUON = [
  nguon('📈', 'SEC press release 2013-222 — Knight Capital', '4 million orders for 212 customer orders, $460 million lost, $12 million penalty.', 'https://www.sec.gov/newsroom/press-releases/2013-222'),
  nguon('☢️', 'Wikipedia — Therac-25', 'Six overdoses 1985–87, race conditions, removed hardware interlocks; Leveson &amp; Turner (1993).', 'https://en.wikipedia.org/wiki/Therac-25'),
  nguon('🚀', 'Wikipedia — Ariane flight V88 (Ariane 5, 501)', '37 seconds, 64-bit to 16-bit overflow, tests without Ariane 5 trajectory data.', 'https://en.wikipedia.org/wiki/Ariane_flight_V88'),
  nguon('🛰️', 'Wikipedia — Mars Climate Orbiter', 'Pound-force seconds vs newton-seconds, factor 4.45, $327.6 million.', 'https://en.wikipedia.org/wiki/Mars_Climate_Orbiter'),
  nguon('🦅', 'CrowdStrike — Channel File 291 Root Cause Analysis (PDF, 6 Aug 2024)', '21 fields defined, 20 supplied, wildcard criteria in testing; mitigations.', 'https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf'),
  nguon('🪟', 'Microsoft — Helping our customers through the CrowdStrike outage (20 Jul 2024)', '“8.5 million Windows devices, or less than one percent of all Windows machines.”', 'https://blogs.microsoft.com/blog/2024/07/20/helping-our-customers-through-the-crowdstrike-outage/'),
].join('\n');

export default {
  title: 'Start here (2/2) — Life without tests: real incidents, and how to learn without giving up|||Bắt đầu tại đây (2/2) — Khi không có test: sự cố thật, và cách học để không bỏ cuộc',
  slug: 'tst-0-9-bat-dau-khi-khong-co',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Năm sự cố có thật và đã kiểm nguồn (Knight Capital, Therac-25, Ariane 5, Mars Climate Orbiter, CrowdStrike 2024) — mỗi vụ thiếu đúng một loại test; một sự cố của chính trang này; hai tình huống minh hoạ của nhóm sinh viên; vì sao người mới bỏ testing và cách chữa; nhịp học, hai lộ trình, và cách đọc test đỏ không hoảng.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>Life without tests — and how to learn this without giving up</h2>
<p class="lead">Stories stick better than rules. This lesson tells five real incidents — each checked against an official report or a well-sourced article — plus one from this very website, and for each one names the exact test that was missing. Then it gives you a plan to learn testing at a pace you can keep.</p>

<h3>The chain behind every story</h3>
<p>In SWT301 you learn the ISTQB chain: a person makes an <strong>error</strong>, which leaves a <strong>defect</strong> in a work product, which can cause a <strong>failure</strong> when executed, which has an <strong>effect</strong> on people. Read every story below with one question: <em>which test, run before release, would have turned the failure into a red line on a developer’s screen?</em></p>

<h3>Five real incidents</h3>
<p><strong>1 · Knight Capital — 1 August 2012.</strong> In the first 45 minutes after the market opened, the firm’s order router sent more than four million orders while trying to fill 212 customer orders, traded more than 397 million shares and lost more than 460 million dollars. The SEC later fined it 12 million. The SEC’s summary names two causes: a code change in 2005 left an old function defective but still in the router, and new code was deployed incorrectly to the same router in late July 2012. <em>Missing test:</em> a deployment check that every server runs the same tested build, and a test proving the retired path cannot be reached. Dead code is code nobody tests.</p>
<p><strong>2 · Therac-25 — 1985 to 1987.</strong> A radiation therapy machine caused at least six massive overdoses, about a hundred times the intended dose; three patients died of them. Its software came from older models whose hardware interlocks had masked software defects — and the Therac-25 removed those interlocks. A quick operator, editing within about eight seconds, triggered a race condition; a counter that occasionally overflowed to zero skipped a safety check. <em>Missing tests:</em> timing tests of fast edits, boundary tests of the counter, and the humility not to assume reused code is safe in a new machine.</p>
<p><strong>3 · Ariane 5, flight 501 — 4 June 1996.</strong> Thirty-seven seconds after launch the rocket veered off course and was destroyed; the loss exceeded 370 million dollars. Code reused from Ariane 4 converted a 64-bit floating-point value to a 16-bit signed integer; Ariane 5’s higher horizontal velocity made the value too large, the conversion overflowed, both inertial reference computers stopped. The inquiry noted that the equipment’s tests did not include Ariane 5 trajectory data; a post-flight simulation with that data reproduced the failure. <em>Missing test:</em> boundary and real-data tests for the new range of inputs.</p>
<p><strong>4 · Mars Climate Orbiter — 23 September 1999.</strong> One team’s ground software reported thruster impulse in pound-force seconds; the navigation software expected newton-seconds, as the interface specification required. Every correction was off by a factor of 4.45 and the spacecraft came within about 57 km of Mars — too low to survive. Mission cost: 327.6 million dollars. <em>Missing test:</em> an integration or contract test across the two programs. Each side could be correct alone; the join was wrong.</p>
<p><strong>5 · CrowdStrike — 19 July 2024.</strong> A content update for a security sensor crashed about 8.5 million Windows devices (Microsoft’s estimate, under one percent of all Windows machines). CrowdStrike’s root-cause report reads like a testing textbook: a new template type defined <strong>21</strong> input fields, but the integration code supplied only <strong>20</strong>. The mismatch “evaded multiple layers of build validation and testing”, partly because the 21st field was matched with a <strong>wildcard</strong> during testing and in the first deployments — so it was never actually read. On 19 July an update used a non-wildcard value in field 21, the sensor read past the end of its input array, and Windows crashed. The report commits to, among other things, tests with non-wildcard criteria for every field, runtime bounds checks and staged deployment.</p>
<table>
<thead><tr><th>Incident</th><th>Root cause in one line</th><th>Kind of test that catches it</th><th>Chapter</th></tr></thead>
<tbody>
<tr><td>Knight Capital</td><td>Dead code + inconsistent deployment</td><td>Deployment checks in CI, tests for retired paths</td><td>9, 10</td></tr>
<tr><td>Therac-25</td><td>Race condition, counter overflow</td><td>Timing tests, boundary tests</td><td>1, 2</td></tr>
<tr><td>Ariane 5</td><td>Value too large for 16 bits</td><td>Boundary and real-data tests</td><td>1</td></tr>
<tr><td>Mars Climate Orbiter</td><td>Different units across two programs</td><td>Integration / contract tests</td><td>4, 5</td></tr>
<tr><td>CrowdStrike</td><td>Field 21 only ever tested with “match anything”</td><td>Vary every input; mutation testing</td><td>1, 8</td></tr>
</tbody>
</table>
<div class="callout">
<p><strong>Not “they were careless”.</strong> All five organisations had tests and reviews. The tests simply never executed the risky line with the risky value. Choosing those values is a learnable skill — it is what Chapter 1 starts teaching.</p>
</div>

<h3>Reproduce the CrowdStrike lesson in five minutes</h3>
<p>You can feel the “field 21” trap with a toy. In the <code>thu-test</code> folder from the previous lesson, create <code>khop.js</code> — a pattern is compared with the input, field by field, and <code>'*'</code> means “match anything”:</p>
${ma('javascript', M.khop)}
<p>And <code>khop.test.js</code>: the data has 20 fields, the pattern 21.</p>
${ma('javascript', M.khopTest)}
${ra(M.khopOut)}
<p>The first test is green and proves nothing about field 21 — the wildcard returns before the data is read. Only the test with a <em>real</em> value in field 21 runs the dangerous line, and it explodes with <code>RangeError: no input field 21</code>. In a JavaScript program the read would quietly give <code>undefined</code>; in the C++ sensor it read past the array and crashed the machine. Same lesson either way: <strong>a test that never makes the code read a value cannot tell you whether that value is handled</strong>.</p>

<h3>Closer to home: this website, October 2026</h3>
<p>The developer’s local configuration of cuongthai.com held <em>real</em> keys for cloud storage and e-mail. Test runs and local experiments uploaded junk into the production storage bucket — 98 files were cleaned by hand on 10 October 2026 — and sent real e-mails to real people. Nothing was “broken” in the code; the tests were simply not <strong>isolated</strong> from production. The fix: during tests, storage and e-mail are replaced by in-memory fakes, and a tripwire fails the whole suite if any test opens a connection to the real storage endpoint. You will build the same habits in Chapter 3 (test doubles) and Chapter 4 (throwaway databases).</p>

<h3>Two situations every student team knows (illustrations, not real reports)</h3>
<p><strong>A · Fix one, break three.</strong> The night before the LabFlow demo a teammate makes <code>parseTime</code> accept <code>"7:00"</code> as well as <code>"07:00"</code>. It works on his screen; he pushes; nobody re-checks booking, cancelling or the weekly report. At the demo a booking ending at 21:00 is rejected and the usage report shows zero hours. A suite of forty small tests would have shown all three breaks in one second, the night before.</p>
<p><strong>B · The merge that killed login.</strong> Two branches each work on their owners’ laptops. Merged an hour before the progress review, login answers HTTP 500: one branch renamed a field the other still reads. An API test for login (Chapter 5) and CI on every pull request (Chapter 9) would have blocked the merge an hour earlier, red, while there was time to fix it calmly.</p>

<h3>Why beginners give up on testing — and the antidote</h3>
<table>
<thead><tr><th>Reason</th><th>What this course does about it</th></tr></thead>
<tbody>
<tr><td>“It feels like writing the code twice.”</td><td>One project, LabFlow Lite, all course long. From Chapter 1 you watch tests catch bugs you planted yourself.</td></tr>
<tr><td>Red output looks scary.</td><td>You read failures on purpose, line by line, from this lesson on.</td></tr>
<tr><td>Too many English terms: mock, stub, fixture, assertion…</td><td>A 🗂 Key terms box in every lesson, Vietnamese meaning first.</td></tr>
<tr><td>Toy examples like <code>add(1, 2)</code>.</td><td>Real business rules from LabFlow: the 30-minute grid, 14 days ahead, approval above 30 seats.</td></tr>
<tr><td>No idea whether your tests are any good.</td><td>Lab 1 ships a script that plants 8 bugs; a good suite turns red for all 8.</td></tr>
</tbody>
</table>

<h3>The rhythm of one lesson</h3>
<ol>
<li><strong>Slides (≈10 min).</strong> Read each slide and the notes under it.</li>
<li><strong>Written lesson (≈30 min).</strong> Type every example yourself, run it, compare with the real output printed in the lesson.</li>
<li><strong>🧪 Practice (15–20 min).</strong> Each has a “done when” you can check without a teacher.</li>
<li><strong>🗂 Key terms and 📌 Summary (5 min).</strong> Say each summary line out loud in your own words.</li>
<li><strong>Quiz</strong> at the end of each chapter: ten scenario questions, each with an explanation.</li>
</ol>

<h3>Two paths</h3>
<table>
<thead><tr><th></th><th>Minimum (≈ 2 weeks, 1 hour a day)</th><th>Full (≈ 8–10 weeks)</th></tr></thead>
<tbody>
<tr><td>Goal</td><td>Write useful tests for a Node/Express API</td><td>A complete, trusted suite with CI and a capstone</td></tr>
<tr><td>Chapters</td><td>0 · 1 · 3 · 4 · 5 · 9</td><td>0 to 11 in order</td></tr>
<tr><td>Labs</td><td>Lab 1 (rules), Lab 5 (API)</td><td>Every chapter lab</td></tr>
<tr><td>Good for</td><td>SWT301 Lab 2 right now, the LabFlow backend</td><td>Internship interviews, working in a team</td></tr>
</tbody>
</table>

<h3>Reading a red test without panic</h3>
<p>Here is a real Vitest failure you will produce yourself in lesson 0.3:</p>
${ra(M.red)}
<ol>
<li><strong>Where</strong> — after <code>FAIL</code>: file › describe block › test name.</li>
<li><strong>What</strong> — the <code>AssertionError</code> sentence: expected <code>'7:30'</code> to be <code>'07:30'</code>.</li>
<li><strong>Expected vs Received</strong> — Expected is what <em>you</em> wrote in the test; Received is what the code actually returned.</li>
<li><strong>Which line</strong> — the caret <code>^</code> points at the assertion on line 16.</li>
<li><strong>How many</strong> — the summary: 1 failed, 2 passed. One problem, not three.</li>
</ol>
<p>Then the only question that matters: is the <em>code</em> wrong, or is the <em>test</em> wrong? Here the code is wrong — a clock time needs its leading zero.</p>

<h3>When you are stuck</h3>
<p>Send four things and anyone can help you in a minute: the command you ran; what you expected; the output, pasted as text; what you already tried. And celebrate milestones: 🟢 first green test, 🔴 first red one read calmly, 🎯 first boundary bug caught, 🧬 8/8 mutants killed in Lab 1, 🤖 first green CI run.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>In <code>thu-test</code>, create <code>khop.js</code> and <code>khop.test.js</code> exactly as above and run <code>node --test --test-reporter=spec khop.test.js</code>. You must see one ✔ and one ✖ with <code>RangeError: no input field 21</code>.</li>
<li>Fix the <em>test</em>, not the code: the second test should state the truth — <code>assert.throws(() =&gt; matches(real, inputs), RangeError)</code>. Run again: two ✔.</li>
<li>Add a third test: a pattern with a wrong value in field 5 (for example <code>'x'</code>) and wildcards nowhere. What should <code>matches</code> return? Write the assertion, run it.</li>
<li>Pick one of the five incidents and write four lines in your notebook: error · defect · failure · the test that was missing.</li>
</ol>
<p><strong>Done when:</strong> <code>node --test</code> shows <code>pass 3</code>, <code>fail 0</code>, and your four lines name a concrete test (“a test with a real value in field 21”), not a slogan (“test more”).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">effect</span><span class="v">The consequence of a failure for people: money, trust, safety.</span></div>
  <div class="kv"><span class="k">race condition</span><span class="v">A defect that appears only when two things happen in a particular order or timing.</span></div>
  <div class="kv"><span class="k">overflow</span><span class="v">A number too large for the space reserved for it (16 bits, a counter), so it wraps or errors.</span></div>
  <div class="kv"><span class="k">integration / contract test</span><span class="v">A test of the join between two parts: one side’s output really is what the other side expects.</span></div>
  <div class="kv"><span class="k">wildcard</span><span class="v">A pattern value that matches anything — handy, and dangerous in tests because nothing gets checked.</span></div>
  <div class="kv"><span class="k">isolation</span><span class="v">Tests never touch production systems; they use fakes or throwaway copies.</span></div>
  <div class="kv"><span class="k">staged rollout</span><span class="v">Releasing to a small group first, then everyone, so a bad change hurts few people.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The famous disasters came from missing <em>tests</em>, not missing testers: the risky line never ran with the risky value.</li>
<li>Boundaries (Ariane 5, Therac-25), real data, every field (CrowdStrike) and the joins between programs (Mars Climate Orbiter) are where defects hide.</li>
<li>A test that matches “anything” checks nothing — vary every input.</li>
<li>Tests must be isolated from production systems (this website, October 2026).</li>
<li>Learn in a rhythm — slides, type and run, practice, terms, quiz — on the minimum or the full path.</li>
<li>A red output has five parts: where, what, expected vs received, which line, how many.</li>
</ul>

<h3>📚 Sources</h3>
${NGUON}
${lienKet({ bai: 'swt301-why-testing-necessary', title: 'Also in SWT301 — lesson 1.2: Why is testing necessary? Error, defect, failure', sub: 'Same: the error → defect → failure → effect chain and why defects found late cost more. Different: SWT301 drills the ISTQB definitions and root-cause analysis for the exam; here every link of the chain is a real incident and a test you can run. Not taking SWT301? This lesson stands on its own.', cta: 'OPEN SWT301 LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Khi không có test — và cách học để không bỏ cuộc</h2>
<p class="lead">Câu chuyện đọng lại lâu hơn luật lệ. Bài này kể năm sự cố có thật — mỗi vụ đều đối chiếu với báo cáo chính thức hoặc bài viết có nguồn rõ — cộng một sự cố của chính trang web này, và với mỗi vụ chỉ ra đúng cái test đã thiếu. Sau đó là một kế hoạch để bạn học testing với nhịp độ giữ được lâu dài.</p>

<h3>Chuỗi nằm sau mọi câu chuyện</h3>
<p>Ở SWT301 bạn học chuỗi của ISTQB: con người mắc <strong>error (sai sót)</strong>, để lại <strong>defect (khiếm khuyết)</strong> trong sản phẩm, khiếm khuyết khi được thực thi có thể gây <strong>failure (thất bại)</strong>, và thất bại gây <strong>effect (hậu quả)</strong> cho con người. Đọc từng câu chuyện dưới đây với đúng một câu hỏi: <em>cái test nào, nếu chạy trước khi phát hành, đã biến thất bại thành một dòng đỏ trên màn hình lập trình viên?</em></p>

<h3>Năm sự cố có thật</h3>
<p><strong>1 · Knight Capital — 1/8/2012.</strong> Trong 45 phút đầu phiên giao dịch, bộ định tuyến lệnh của công ty gửi hơn bốn triệu lệnh trong khi chỉ cần khớp 212 lệnh của khách, giao dịch hơn 397 triệu cổ phiếu và lỗ hơn 460 triệu đô. Uỷ ban Chứng khoán Mỹ (SEC) sau đó phạt 12 triệu đô. Bản tóm tắt của SEC nêu hai nguyên nhân: một thay đổi code năm 2005 làm một hàm cũ bị hỏng nhưng vẫn nằm lại trong bộ định tuyến, và code mới được triển khai sai lên chính bộ định tuyến đó cuối tháng 7/2012. <em>Test còn thiếu:</em> một bước kiểm khi triển khai rằng mọi máy chủ chạy cùng một bản build đã test, và một test chứng minh đường code đã "nghỉ hưu" không thể chạy tới. Code chết là code không ai test.</p>
<p><strong>2 · Therac-25 — 1985 tới 1987.</strong> Một máy xạ trị gây ít nhất sáu ca quá liều nghiêm trọng, khoảng một trăm lần liều cần dùng; ba bệnh nhân tử vong vì quá liều. Phần mềm của nó lấy từ các đời máy trước, nơi khoá an toàn phần cứng đã che lấp lỗi phần mềm — và Therac-25 bỏ các khoá đó. Một người vận hành thao tác nhanh, sửa thông số trong khoảng tám giây, là chạm phải race condition (điều kiện tranh chấp — lỗi chỉ hiện khi các việc xảy ra theo một thứ tự/thời điểm nhất định); còn một bộ đếm thỉnh thoảng tràn về 0 khiến máy bỏ qua một bước kiểm an toàn. <em>Test còn thiếu:</em> test thời gian với thao tác sửa nhanh, test giá trị biên của bộ đếm, và sự khiêm tốn để không mặc định code dùng lại thì an toàn ở máy mới.</p>
<p><strong>3 · Ariane 5, chuyến bay 501 — 4/6/1996.</strong> Ba mươi bảy giây sau khi phóng, tên lửa lệch hướng và bị phá huỷ; thiệt hại hơn 370 triệu đô. Code dùng lại từ Ariane 4 đổi một số thực 64-bit sang số nguyên có dấu 16-bit; vận tốc ngang của Ariane 5 lớn hơn làm giá trị quá to, phép đổi bị tràn (overflow), cả hai máy tính dẫn đường quán tính ngừng chạy. Hội đồng điều tra ghi nhận test của thiết bị không dùng dữ liệu quỹ đạo của Ariane 5; một mô phỏng sau chuyến bay với dữ liệu đó tái hiện đúng lỗi. <em>Test còn thiếu:</em> test biên và test với dữ liệu thật cho dải đầu vào mới.</p>
<p><strong>4 · Mars Climate Orbiter — 23/9/1999.</strong> Phần mềm mặt đất của một đội báo xung lực động cơ theo pound-force giây; phần mềm dẫn đường mong đợi newton-giây, đúng như đặc tả giao tiếp quy định. Mọi lần hiệu chỉnh đều lệch 4,45 lần và con tàu xuống cách sao Hoả chỉ khoảng 57 km — quá thấp để sống sót. Chi phí nhiệm vụ: 327,6 triệu đô. <em>Test còn thiếu:</em> test tích hợp hay test hợp đồng giữa hai chương trình. Mỗi bên có thể đúng khi đứng một mình; chỗ nối thì sai.</p>
<p><strong>5 · CrowdStrike — 19/7/2024.</strong> Một bản cập nhật nội dung cho phần mềm bảo mật làm sập khoảng 8,5 triệu máy Windows (ước tính của Microsoft, dưới 1% tổng số máy Windows). Báo cáo nguyên nhân gốc của CrowdStrike đọc như giáo trình testing: một kiểu mẫu (template type) mới khai báo <strong>21</strong> trường đầu vào, nhưng code tích hợp chỉ cung cấp <strong>20</strong>. Sự lệch nhau đó "lọt qua nhiều lớp kiểm tra build và kiểm thử", một phần vì trong lúc test và những lần triển khai đầu, trường thứ 21 luôn được so bằng <strong>wildcard (ký tự đại diện, "khớp mọi thứ")</strong> — nên nó chưa bao giờ thật sự được đọc. Ngày 19/7, một bản cập nhật dùng giá trị không-wildcard ở trường 21, phần mềm đọc vượt quá cuối mảng đầu vào, và Windows sập. Báo cáo cam kết, trong số nhiều việc, thêm test dùng giá trị không-wildcard cho mọi trường, kiểm giới hạn mảng khi chạy, và triển khai theo từng đợt.</p>
<table>
<thead><tr><th>Sự cố</th><th>Gốc rễ trong một dòng</th><th>Loại test bắt được nó</th><th>Chương</th></tr></thead>
<tbody>
<tr><td>Knight Capital</td><td>Code chết + triển khai không đồng nhất</td><td>Kiểm triển khai trong CI, test cho đường code đã nghỉ hưu</td><td>9, 10</td></tr>
<tr><td>Therac-25</td><td>Race condition, bộ đếm tràn</td><td>Test thời gian, test giá trị biên</td><td>1, 2</td></tr>
<tr><td>Ariane 5</td><td>Giá trị quá lớn cho 16 bit</td><td>Test biên và test với dữ liệu thật</td><td>1</td></tr>
<tr><td>Mars Climate Orbiter</td><td>Hai chương trình dùng hai đơn vị</td><td>Test tích hợp / test hợp đồng</td><td>4, 5</td></tr>
<tr><td>CrowdStrike</td><td>Trường 21 chỉ được test bằng "khớp mọi thứ"</td><td>Thay đổi mọi đầu vào; mutation testing</td><td>1, 8</td></tr>
</tbody>
</table>
<div class="callout">
<p><strong>Không phải "họ cẩu thả".</strong> Cả năm tổ chức đều có test và có review. Chỉ là test chưa bao giờ chạy dòng nguy hiểm với giá trị nguy hiểm. Chọn được những giá trị đó là kỹ năng học được — và Chương 1 bắt đầu dạy chính điều đó.</p>
</div>

<h3>Tự tay tái hiện bài học CrowdStrike trong năm phút</h3>
<p>Bạn có thể "cảm" được cái bẫy trường số 21 bằng một ví dụ đồ chơi. Trong thư mục <code>thu-test</code> của bài trước, tạo <code>khop.js</code> — một mẫu được so với dữ liệu đầu vào, từng trường một, và <code>'*'</code> nghĩa là "khớp mọi thứ":</p>
${ma('javascript', M.khop)}
<p>Và <code>khop.test.js</code>: dữ liệu có 20 trường, mẫu có 21.</p>
${ma('javascript', M.khopTest)}
${ra(M.khopOut)}
<p>Test thứ nhất xanh nhưng chẳng chứng minh gì về trường 21 — wildcard trả về <code>true</code> trước khi dữ liệu được đọc. Chỉ test có giá trị <em>thật</em> ở trường 21 mới chạy tới dòng nguy hiểm, và nó nổ ngay với <code>RangeError: no input field 21</code>. Trong một chương trình JavaScript, phép đọc đó lặng lẽ trả về <code>undefined</code>; trong phần mềm C++ của CrowdStrike, nó đọc vượt mảng và làm sập máy. Bài học thì như nhau: <strong>một test không bao giờ buộc code đọc một giá trị thì không thể cho bạn biết giá trị đó có được xử lý đúng không</strong>.</p>

<h3>Gần nhà hơn: chính trang web này, tháng 10/2026</h3>
<p>Cấu hình máy cá nhân của lập trình viên cuongthai.com chứa khoá <em>thật</em> của kho lưu trữ đám mây và dịch vụ e-mail. Các lượt chạy test và thử nghiệm ở máy đã đẩy tệp rác lên kho lưu trữ production — ngày 10/10/2026 phải dọn tay 98 tệp — và gửi e-mail thật tới người thật. Code không hề "hỏng"; chỉ là test không được <strong>cô lập (isolated)</strong> khỏi hệ thống thật. Cách sửa: trong lúc test, kho lưu trữ và e-mail được thay bằng bản giả trong bộ nhớ, và một "dây bẫy" (tripwire) làm đỏ cả bộ test nếu có test nào mở kết nối tới địa chỉ kho thật. Bạn sẽ tập đúng các thói quen đó ở Chương 3 (test double — đồ thế thân) và Chương 4 (cơ sở dữ liệu dùng một lần).</p>

<h3>Hai tình huống nhóm sinh viên nào cũng gặp (minh hoạ, không phải chuyện có thật)</h3>
<p><strong>A · Sửa một chỗ, hỏng ba chỗ.</strong> Đêm trước buổi demo LabFlow, một bạn sửa <code>parseTime</code> để nhận cả <code>"7:00"</code> lẫn <code>"07:00"</code>. Trên máy bạn ấy thì chạy; bạn ấy push; không ai kiểm lại đặt phòng, huỷ phòng hay báo cáo tuần. Lúc demo, lượt đặt kết thúc lúc 21:00 bị từ chối và báo cáo sử dụng hiện 0 giờ. Một bộ bốn mươi test nhỏ đã cho thấy cả ba chỗ hỏng trong một giây, từ đêm hôm trước.</p>
<p><strong>B · Merge xong thì đăng nhập chết.</strong> Hai nhánh đều chạy được trên máy của người viết. Merge một giờ trước buổi review tiến độ, đăng nhập trả HTTP 500: một nhánh đổi tên một trường mà nhánh kia vẫn đọc. Một test API cho đăng nhập (Chương 5) và CI chạy trên mỗi pull request (Chương 9) đã chặn lần merge đó sớm một giờ, bằng dấu đỏ, lúc còn đủ thời gian để sửa bình tĩnh.</p>

<h3>Vì sao người mới hay bỏ testing — và cách chữa</h3>
<table>
<thead><tr><th>Lý do</th><th>Khoá này làm gì</th></tr></thead>
<tbody>
<tr><td>"Cảm giác như viết code hai lần."</td><td>Một dự án xuyên suốt, LabFlow Lite. Ngay Chương 1 bạn tận mắt thấy test bắt được lỗi do chính bạn cài vào.</td></tr>
<tr><td>Kết quả đỏ trông đáng sợ.</td><td>Từ bài này trở đi, bạn cố ý tập đọc kết quả đỏ, từng dòng một.</td></tr>
<tr><td>Quá nhiều thuật ngữ tiếng Anh: mock, stub, fixture, assertion…</td><td>Mỗi bài có ô 🗂 Thuật ngữ, nghĩa tiếng Việt đứng trước.</td></tr>
<tr><td>Ví dụ đồ chơi kiểu <code>add(1, 2)</code>.</td><td>Luật nghiệp vụ thật từ LabFlow: lưới 30 phút, đặt trước tối đa 14 ngày, trên 30 chỗ thì cần duyệt.</td></tr>
<tr><td>Không biết bộ test của mình tốt hay chưa.</td><td>Lab 1 có sẵn một script cài 8 lỗi vào code; bộ test tốt phải đỏ với cả 8.</td></tr>
</tbody>
</table>

<h3>Nhịp học một bài</h3>
<ol>
<li><strong>Slide (≈10 phút).</strong> Đọc từng slide và lời giảng ngay dưới.</li>
<li><strong>Bài đọc chi tiết (≈30 phút).</strong> Tự gõ mọi ví dụ, chạy, so với output thật in trong bài.</li>
<li><strong>🧪 Thực hành (15–20 phút).</strong> Bài nào cũng có tiêu chí "Đạt khi" tự kiểm được, không cần thầy.</li>
<li><strong>🗂 Thuật ngữ và 📌 Tóm tắt (5 phút).</strong> Đọc to từng câu tóm tắt bằng lời của bạn.</li>
<li><strong>Quiz</strong> cuối mỗi chương: mười câu tình huống, câu nào cũng có giải thích.</li>
</ol>
<p>Gõ tay tốt hơn copy-paste: chính những lỗi gõ nhỏ dạy bạn đọc thông báo lỗi.</p>

<h3>Hai lộ trình</h3>
<table>
<thead><tr><th></th><th>Tối thiểu (≈ 2 tuần, mỗi ngày 1 giờ)</th><th>Đầy đủ (≈ 8–10 tuần)</th></tr></thead>
<tbody>
<tr><td>Mục tiêu</td><td>Viết được test có ích cho một API Node/Express</td><td>Một bộ test hoàn chỉnh, đáng tin, có CI và dự án cuối khoá</td></tr>
<tr><td>Chương</td><td>0 · 1 · 3 · 4 · 5 · 9</td><td>0 tới 11 theo thứ tự</td></tr>
<tr><td>Lab</td><td>Lab 1 (luật nghiệp vụ), Lab 5 (API)</td><td>Lab của mọi chương</td></tr>
<tr><td>Hợp với</td><td>SWT301 Lab 2 ngay bây giờ, backend LabFlow</td><td>Phỏng vấn thực tập, làm việc trong đội</td></tr>
</tbody>
</table>

<h3>Đọc một test đỏ mà không hoảng</h3>
<p>Đây là một lỗi Vitest thật mà chính bạn sẽ tạo ra ở bài 0.3:</p>
${ra(M.red)}
<ol>
<li><strong>Ở đâu</strong> — sau chữ <code>FAIL</code>: file › khối describe › tên test.</li>
<li><strong>Chuyện gì</strong> — câu <code>AssertionError</code>: mong đợi <code>'7:30'</code> phải là <code>'07:30'</code>.</li>
<li><strong>Expected và Received</strong> — Expected là thứ <em>bạn</em> viết trong test; Received là thứ code thật sự trả về.</li>
<li><strong>Dòng nào</strong> — dấu mũ <code>^</code> chỉ vào lệnh khẳng định ở dòng 16.</li>
<li><strong>Bao nhiêu</strong> — dòng tổng kết: 1 hỏng, 2 đạt. Một vấn đề, không phải ba.</li>
</ol>
<p>Rồi chỉ còn một câu hỏi quan trọng: <em>code</em> sai hay <em>test</em> sai? Ở đây code sai — giờ phải có số 0 đứng đầu.</p>

<h3>Khi bí</h3>
<p>Gửi bốn thứ thì ai cũng giúp bạn được trong một phút: lệnh bạn đã chạy; bạn mong đợi gì; output, dán dạng chữ (đừng chụp ảnh); bạn đã thử những gì. Và hãy tự thưởng ở các cột mốc: 🟢 test xanh đầu tiên, 🔴 lần đầu đọc test đỏ mà bình tĩnh, 🎯 lỗi biên đầu tiên bắt được, 🧬 diệt 8/8 đột biến ở Lab 1, 🤖 lần CI xanh đầu tiên.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Trong <code>thu-test</code>, tạo <code>khop.js</code> và <code>khop.test.js</code> đúng như trên rồi chạy <code>node --test --test-reporter=spec khop.test.js</code>. Bạn phải thấy một ✔ và một ✖ kèm <code>RangeError: no input field 21</code>.</li>
<li>Sửa <em>test</em>, không sửa code: test thứ hai nên nói đúng sự thật — <code>assert.throws(() =&gt; matches(real, inputs), RangeError)</code>. Chạy lại: hai ✔.</li>
<li>Thêm test thứ ba: một mẫu sai giá trị ở trường 5 (ví dụ <code>'x'</code>) và không có wildcard nào. <code>matches</code> nên trả về gì? Viết lệnh khẳng định, chạy thử.</li>
<li>Chọn một trong năm sự cố, viết bốn dòng vào vở: error · defect · failure · cái test đã thiếu.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>node --test</code> hiện <code>pass 3</code>, <code>fail 0</code>, và bốn dòng của bạn gọi tên một test cụ thể ("một test có giá trị thật ở trường 21"), không phải khẩu hiệu ("test nhiều hơn").</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">effect (hậu quả)</span><span class="v">Ảnh hưởng của thất bại lên con người: tiền, niềm tin, an toàn.</span></div>
  <div class="kv"><span class="k">race condition (điều kiện tranh chấp)</span><span class="v">Lỗi chỉ hiện ra khi hai việc xảy ra theo một thứ tự hay thời điểm nhất định.</span></div>
  <div class="kv"><span class="k">overflow (tràn số)</span><span class="v">Con số quá lớn so với chỗ chứa dành cho nó (16 bit, một bộ đếm), nên bị quay vòng hoặc báo lỗi.</span></div>
  <div class="kv"><span class="k">integration / contract test (test tích hợp / hợp đồng)</span><span class="v">Test chỗ nối giữa hai phần: đầu ra của bên này đúng là thứ bên kia mong đợi.</span></div>
  <div class="kv"><span class="k">wildcard (ký tự đại diện)</span><span class="v">Giá trị mẫu khớp với mọi thứ — tiện, và nguy hiểm trong test vì chẳng có gì được kiểm.</span></div>
  <div class="kv"><span class="k">isolation (cô lập)</span><span class="v">Test không bao giờ chạm hệ thống production; nó dùng bản giả hoặc bản sao dùng một lần.</span></div>
  <div class="kv"><span class="k">staged rollout (triển khai từng đợt)</span><span class="v">Phát hành cho một nhóm nhỏ trước rồi mới tới mọi người, để thay đổi xấu chỉ ảnh hưởng ít người.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Các thảm hoạ nổi tiếng đến từ việc thiếu <em>test</em>, không phải thiếu tester: dòng nguy hiểm chưa từng chạy với giá trị nguy hiểm.</li>
<li>Giá trị biên (Ariane 5, Therac-25), dữ liệu thật, mọi trường (CrowdStrike) và chỗ nối giữa các chương trình (Mars Climate Orbiter) là nơi lỗi ẩn nấp.</li>
<li>Một test "khớp mọi thứ" thì chẳng kiểm gì — hãy thay đổi mọi đầu vào.</li>
<li>Test phải cô lập khỏi hệ thống production (chính trang này, tháng 10/2026).</li>
<li>Học theo nhịp — slide, tự gõ và chạy, thực hành, thuật ngữ, quiz — trên lộ trình tối thiểu hoặc đầy đủ.</li>
<li>Kết quả đỏ có năm phần: ở đâu, chuyện gì, mong đợi và nhận được, dòng nào, bao nhiêu.</li>
</ul>

<h3>📚 Nguồn</h3>
${NGUON}
${lienKet({ bai: 'swt301-why-testing-necessary', title: 'Đã gặp ở SWT301 — bài 1.2: Vì sao cần kiểm thử? Error, defect, failure', sub: 'Giống: chuỗi error → defect → failure → effect và vì sao lỗi phát hiện muộn thì đắt. Khác: SWT301 luyện định nghĩa ISTQB và phân tích nguyên nhân gốc để thi; ở đây mỗi mắt xích là một sự cố thật và một test bạn chạy được. Không học SWT301? Bài này vẫn tự đủ.', cta: 'MỞ BÀI SWT301 →' })}
</div>
`,
};
