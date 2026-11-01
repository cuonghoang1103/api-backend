/**
 * Testing · Chương 10 · 10.3 — Review test trong pull request. Slug giữ từ khung: tst-10-3-review.
 * Pull request #57 "Add tests for the waitlist" (demo10/review/pr57.test.js, nhánh pr/57-waitlist-tests trong repo git scratch;
 * ảnh chụp _labflow-lite giữ cả bản nộp lẫn bản sau review). Mọi số đo chạy thật (s10/_ma.mjs): CI xanh với "(retry x3)"; cài bug bằng
 * scripts/thu-loi.mjs ⇒ test mock vẫn xanh; snapshot rộng: -u ⇒ "1 updated" xanh với bug giao chỗ cho người cuối hàng; đỏ 10/30 khi bỏ
 * retry, 0/30 khi có; spy waitlists.set đỏ khi refactor vô hại; so-sanh.mjs: bản nộp đúng 2/5, bản review 5/5, xanh 0/30 lần đỏ khi xáo.
 * Thực hành: th103-truoc (1003 ms, toBeTruthy) vs th103-sau. Nhãn bình luận theo conventionalcomments.org; "nói về code, không nói về
 * người" theo Google eng-practices (đọc 01/11/2026).
 */
import G from '../giang/tst-10-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (k, re) => OUT[k].split('\n').filter((l) => re.test(l)).join('\n');
const PR_CODE = CODE.pr57.split('\n').slice(10).join('\n');
const PR_XANH = loc('103-pr-xanh', /^\$ |✓|Tests  /);
const MOCK = loc('103-mock', /planted|✓ should|Tests  /);
const SNAP_U = loc('103-snap-u', /planted|✓ should work|Snapshots|Tests  /);
const SNAP_DIFF = loc('103-snap-diff', /^\$ |^@@|^[-+] /);
const TEN = loc('103-snap-do', /FAIL /) + '\n' + loc('103-ten-tot', /FAIL |^[-+]\s+"offeredTo"/);
const IMPL = loc('103-impl', /planted|✓ demo10|× |AssertionError/);
const SAU_CODE = CODE.pr57Sau.split('\n').slice(13, 30).join('\n');
const TH_CODE = CODE.th103Truoc.split('\n').slice(4).join('\n');
const TH_TRUOC = loc('103-th-truoc', /✓ should|Duration/);
const TH_SAU_CODE = CODE.th103Sau.split('\n').slice(4).join('\n');
const TH_BUG = loc('103-th-bug', /planted|✓ demo|×|AssertionError|Tests  /);

const C_MOCK = [
  'issue (blocking): this test calls mailer.send itself and checks that it was called;',
  'cancelBooking never runs. With "if (false)" planted before the e-mail it stays green.',
  'Could it run cancelBooking with the fake mailer and check the outbox?',
].join('\n');
const C_SNAP = [
  'issue (blocking): the snapshot keeps booking, result, waitlist and outbox (~30 lines).',
  'A new field on the booking breaks it, and "-u" accepted the slot going to the LAST',
  'student (I tried). suggestion: toEqual on who got the offer, the e-mail, who waits.',
].join('\n');
const C_RAND = 'issue (blocking): random ids collide; red 10/30 without retry, 0/30 with it. Fixed ids, no retry?';

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Read the names</div><div class="lz-d">they are the spec</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Run it</div><div class="lz-d">look for “(retry xN)”, slow tests, new snapshots</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Plant a bug</div><div class="lz-d">thu-loi.mjs: does it go red?</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Plant a refactor</div><div class="lz-d">invisible to users: does it stay green?</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Comment</div><div class="lz-d">a label + what you measured</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Đọc tên test</div><div class="lz-d">tên là đặc tả</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Chạy</div><div class="lz-d">để ý “(retry xN)”, test chậm, snapshot mới</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Cài một bug</div><div class="lz-d">thu-loi.mjs: có đỏ không?</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Cài một refactor</div><div class="lz-d">người dùng không thấy: có còn xanh?</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Bình luận</div><div class="lz-d">một nhãn + điều đã đo</div></div>
</div>`;

const CHECK_EN = `<table>
<thead><tr><th>Ask of every test</th><th>Measured in</th></tr></thead>
<tbody>
<tr><td>The name states a rule a user would recognise</td><td>1.3</td></tr>
<tr><td>An exact assertion — no lone <code>toBeTruthy</code> / <code>toBeDefined</code></td><td>1.2, 8.1</td></tr>
<tr><td>It runs the real code, not the mock it just built</td><td>3.3</td></tr>
<tr><td>Red under a planted bug</td><td>Labs 1–9, 8.2 (41.49% at 100% coverage)</td></tr>
<tr><td>Green under a planted refactor users cannot see</td><td>3.3</td></tr>
<tr><td>Doubles only at the boundary (e-mail, HTTP); fakes inside</td><td>3.1, 3.2</td></tr>
<tr><td>A small snapshot whose diff is read like code — never a blind <code>-u</code></td><td>1.2</td></tr>
<tr><td>No real clock, <code>Math.random</code> or network</td><td>2.2, 2.4, 8.3</td></tr>
<tr><td>Its own data; green in a shuffled order</td><td>4.4, 8.3, Lab 8</td></tr>
<tr><td>No <code>retry</code> for flakiness — quarantine with an owner</td><td>8.3 (17/50 → 0/50), 9.3</td></tr>
<tr><td>No real waiting, no <code>.only</code></td><td>8.4, 9.1</td></tr>
</tbody></table>`;
const CHECK_VI = `<table>
<thead><tr><th>Hỏi với từng test</th><th>Đã đo ở</th></tr></thead>
<tbody>
<tr><td>Tên nêu một luật mà người dùng nhận ra</td><td>1.3</td></tr>
<tr><td>Khẳng định chính xác — không chỉ <code>toBeTruthy</code> / <code>toBeDefined</code></td><td>1.2, 8.1</td></tr>
<tr><td>Chạy code thật, không chạy cái mock vừa dựng</td><td>3.3</td></tr>
<tr><td>Đỏ khi cài một bug</td><td>Lab 1–9, 8.2 (41,49% khi phủ 100%)</td></tr>
<tr><td>Xanh khi cài một refactor người dùng không thấy</td><td>3.3</td></tr>
<tr><td>Đồ đóng thế chỉ ở biên (thư, HTTP); bên trong dùng fake</td><td>3.1, 3.2</td></tr>
<tr><td>Snapshot nhỏ, diff được đọc như code — không bao giờ <code>-u</code> mù</td><td>1.2</td></tr>
<tr><td>Không đồng hồ thật, <code>Math.random</code> hay mạng</td><td>2.2, 2.4, 8.3</td></tr>
<tr><td>Tự dựng dữ liệu; xanh khi xáo thứ tự</td><td>4.4, 8.3, Lab 8</td></tr>
<tr><td>Không <code>retry</code> để bịt chập chờn — cách ly có người phụ trách</td><td>8.3 (17/50 → 0/50), 9.3</td></tr>
<tr><td>Không chờ thật, không <code>.only</code></td><td>8.4, 9.1</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🔎', 'Google Engineering Practices — What to look for in a code review', 'Tests: “Will the tests actually fail when the code is broken?” (read 01/11/2026).', 'https://google.github.io/eng-practices/review/reviewer/looking-for.html'),
  nguon('💬', 'Google Engineering Practices — How to write code review comments', 'Comments about the code, never about the developer.', 'https://google.github.io/eng-practices/review/reviewer/comments.html'),
  nguon('🏷️', 'Conventional Comments', 'Labels: issue, suggestion, question, nitpick, praise; (blocking) / (non-blocking).', 'https://conventionalcomments.org/'),
  nguon('📸', 'Vitest — Snapshot', 'Snapshots are “reviewed as part of your code review process”.', 'https://vitest.dev/guide/snapshot'),
].join('\n');

export default {
  title: '10.3 — Reviewing tests in pull requests|||10.3 — Review test trong pull request',
  slug: 'tst-10-3-review',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Review một pull request chỉ có test (PR #57, CI xanh) như người đi làm: đọc tên như đặc tả, chạy, cài một bug và một refactor vô hại bằng thu-loi.mjs, đọc diff snapshot như code. Sáu mùi test, mùi nào cũng đo thật: test kiểm chính cái mock (bug "không ai được gửi thư" vẫn xanh), snapshot quá rộng (đỏ khi thêm một trường vô hại, -u chấp nhận bug giao chỗ cho người cuối hàng), tên "should work", dữ liệu ngẫu nhiên (đỏ 10/30 lần), khẳng định cách cài đặt (spy waitlists.set đỏ khi refactor), retry che test chập chờn (0/30, dấu vết duy nhất là "(retry x3)"). Bình luận gắn nhãn kiểu Conventional Comments; bản sau review đúng 5/5 so với 2/5, xanh 30/30 lần xáo thứ tự; checklist 12 câu nối về Chương 1–9.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Reviewing tests in pull requests</h2>
<p class="lead">Most tests you read at work arrive in someone else’s pull request with green CI. This lesson reviews one — four tests for the waitlist of lesson 10.1 — and measures every problem instead of guessing.</p>
<p><strong>After this lesson you can</strong> review a test pull request in a fixed order, prove a weak test with a planted bug or refactor, name six test smells, and write labelled, kind comments. <strong>Why it is useful:</strong> interns review before they design, and a reviewer who only checks for green CI approves every smell below.</p>

<h3>The pull request: four tests, CI green</h3>
<p>Your teammate Dũng opens #57, “Add tests for the waitlist”: one test file and its snapshot, 82 lines. The tests (the constants <code>input</code> and <code>KEY</code> are the booking BE-201, 2026-11-16, 08:00–10:00):</p>
${ma('javascript', PR_CODE)}
${ra(PR_XANH)}
<p>Four green ticks; only <code>(retry x3)</code> is unusual — the visible trace of a problem measured below.</p>
<div class="pitfall co-tieu-de"><strong>“CI is green” is not a review.</strong> CI proves the tests pass on today’s code. A review asks whether they would <em>fail</em> if the code were wrong, and stay green if it changed in a way users cannot see. Google’s guide: “Will the tests actually fail when the code is broken?”</div>

<h3>How to review a test pull request</h3>
${FLOW_EN}
<p>Steps 3 and 4 use <code>scripts/thu-loi.mjs</code> (lesson 3.3): a bug that stays green is a test that cannot fail; a refactor that turns red is a test that breaks for nothing.</p>

<h3>Smell 1 — the test checks its own mock</h3>
<p>“should send mail” builds a mock, calls it, and checks it was called; <code>cancelBooking</code> never runs. Plant “nobody is e-mailed” (<code>if (offer) {</code> → <code>if (false) {</code>) and run only this test:</p>
${ra(MOCK)}
<p>Green with the bug in place — lesson 3.3 in its purest form.</p>
${ma('text', C_MOCK)}

<h3>Smell 2 — a snapshot that approves anything</h3>
<p>“should work” stores booking, result, waitlist and outbox in a 30-line snapshot. Plant a real bug — the freed slot goes to the <em>last</em> student in line. The snapshot goes red, correctly; a developer in a hurry reads “mismatched” as “out of date” and runs <code>-u</code>:</p>
${ra(SNAP_U)}
<p>Green, and the bug is now approved. The only place it still shows is the <code>.snap</code> diff in the pull request:</p>
${ra(SNAP_DIFF)}
<p>Vitest’s guide: snapshots are “reviewed as part of your code review process”. The same snapshot is also red for nothing — one more field on the booking (<code>source: 'web'</code>) breaks it — which is how a team learns to press <code>-u</code>.</p>
${ma('text', C_SNAP)}
<div class="pitfall co-tieu-de"><strong>Read <code>.snap</code> diffs like code.</strong> A changed snapshot is a change of expected behaviour. If nobody can say why each changed line is now correct, it was rubber-stamped, not reviewed (lesson 1.2 measured <code>-u</code> accepting a bug).</div>

<h3>Smell 3 — names that say nothing</h3>
<p>“should send mail”, “should work”, “should return correct value”, “should handle edge case”. With the same planted bug, this is what CI shows for the submitted file, then for the reviewed one:</p>
${ra(TEN)}
<p>The second is a bug report on its own: who should have been offered the slot, and who was. Drop “should”, state the rule (lesson 1.3) — <code>suggestion (non-blocking)</code>.</p>

<h3>Smell 4 — random data</h3>
<p>“should return correct value” draws three ids from ten. All three differ only 10 × 9 × 8 / 1000 = 72% of the time; otherwise <code>joinWaitlist</code> rightly answers <code>ALREADY_WAITING</code>, the queue becomes <code>undefined</code>, and the test throws a TypeError. Remove only the retry and repeat it 30 times:</p>
${ra(OUT['103-retry-khong'])}
<p>Red in 10 of 30 runs on correct code — the test is broken, not the waitlist (lesson 2.4 measured 14/100 and fixed it the same way: control the data).</p>

<h3>Smell 5 — asserting the implementation</h3>
<p>“should handle edge case” spies on <code>waitlists.set</code> and demands exactly one call. Plant a refactor invisible from outside — write the Map only when something changed — and run both files:</p>
${ra(IMPL)}
<p>Submitted: red. Reviewed, which checks <code>waitlists.get(KEY) ?? []</code> like any caller: green. Call checks break on refactors users never notice (lesson 3.3) — <code>question:</code> why spy on <code>set</code>?</p>

<h3>Smell 6 — a flaky test quieted with retry</h3>
<p>Dũng saw smell 4 fail in CI now and then and added <code>{ retry: 3 }</code>:</p>
${ra(OUT['103-retry-co'])}
<p>0 of 30 red; the only trace is a <code>(retry x3)</code> suffix like the one in the pull request’s green run. In lesson 8.3 retry turned a real double booking from 17/50 red into 0/50 — a green tick cannot tell a test bug from a product bug. Flaky tests get an owner and quarantine (lesson 9.3), not a retry.</p>
${ma('text', C_RAND)}

<h3>After review: right 5 times out of 5</h3>
<p>Dũng rewrote the file: rule names, fixed data, a fake mailer (lesson 3.1), assertions on what a caller sees. Its first test:</p>
${ma('javascript', SAU_CODE)}
<p>Two more tests cover the empty line (no e-mail, nobody waiting) and the fourth student (<code>WAITLIST_FULL</code>). <code>demo10/review/so-sanh.mjs</code> plants three bugs and two harmless refactors and runs both files against each — a bug should turn a file red, a refactor should leave it green:</p>
${ra(OUT['103-so-sanh'])}
${ra(OUT['103-sau-lap'])}
<p>The submitted file caught two bugs only through its catch-all snapshot and was red for both harmless changes; the reviewed one is 5/5 with fewer tests.</p>

<h3>The checklist</h3>
${CHECK_EN}

<h3>How to say it</h3>
<p>Each comment above is a label (Conventional Comments: <code>issue (blocking)</code>, <code>suggestion</code>, <code>question</code>, <code>nit</code>), what the code does, what you measured, and a way out. Google asks for comments “about the code and never … about the developer”: “this test calls the mock”, not “you tested the mock”. Block only on evidence; style is a <code>nit</code>; add one sincere <code>praise:</code> (the empty line was tested).</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>Another pull request adds this test for <code>acceptOffer</code> (an offer is valid for 30 minutes). Find at least three smells, write a labelled comment for each, rewrite the test, and prove it with <code>scripts/thu-loi.mjs</code> and the bug “every offer is refused” (<code>now &lt; offer.expiresAt ?</code> → <code>false ?</code>).</p>
${ma('javascript', TH_CODE)}
${ra(TH_TRUOC)}
<p><strong>Smells:</strong> a vague name; the real clock; a real one-second wait (1003 ms for one test, lesson 8.4); <code>toBeTruthy</code>, which even <code>{ ok: false }</code> passes; the 30-minute boundary is never tried.</p>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', TH_SAU_CODE)}
${ra(TH_BUG)}
<p><strong>Done when</strong> your rewrite is red under the planted bug while the submitted test stays green, it runs in milliseconds, and each comment says what you measured.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test smell (mùi test)</span><span class="v">A pattern that makes a test unable to fail, fail for nothing, or fail at random.</span></div>
  <div class="kv"><span class="k">rubber-stamping (duyệt cho có)</span><span class="v">Approving, or running <code>-u</code>, without reading the change.</span></div>
  <div class="kv"><span class="k">blocking / non-blocking (chặn / không chặn)</span><span class="v">Whether a comment must be resolved before merging.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Green CI says tests pass, not that they can fail: plant a bug and a harmless refactor before approving.</li>
<li>Six measured smells: testing the mock, broad snapshots, vague names, random data, implementation checks, retry over flakiness.</li>
<li>A <code>.snap</code> diff is a change of expected behaviour — read it like code.</li>
<li>Label each comment, give the evidence, talk about the code, block only on evidence.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-review-types-techniques', title: 'Theory in SWT301 — 3.3: review types and techniques', sub: 'Same: a review is static testing, made systematic by a checklist (checklist-based review). Deeper here: the work product is a test, and each checklist line is checked by running it with a planted bug.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'git', bai: 'git-6-2-review', title: 'Git course — 6.2: giving and receiving review feedback', sub: 'There: verdicts, reading order, blocking/nit labels and tone for any pull request. Here: what to look for when the change is a test, with measured evidence in every comment.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Review test trong pull request</h2>
<p class="lead">Phần lớn test bạn đọc khi đi làm tới trong pull request của người khác với CI xanh. Bài này review một pull request như vậy — bốn test cho danh sách chờ của bài 10.1 — và đo từng vấn đề thay vì đoán.</p>
<p><strong>Sau bài này bạn có thể</strong> review một pull request test theo thứ tự cố định, chứng minh test yếu bằng một bug hoặc refactor cài vào, gọi tên sáu mùi test, và viết bình luận có nhãn, tử tế. <strong>Vì sao hữu ích:</strong> thực tập sinh được review trước khi được thiết kế, và người review chỉ nhìn CI xanh sẽ duyệt mọi mùi dưới đây.</p>

<h3>Pull request: bốn test, CI xanh</h3>
<p>Dũng, bạn cùng nhóm, mở #57, “Add tests for the waitlist”: một file test và snapshot của nó, 82 dòng. Các test (hằng <code>input</code> và <code>KEY</code> là lượt đặt BE-201, 2026-11-16, 08:00–10:00):</p>
${ma('javascript', PR_CODE)}
${ra(PR_XANH)}
<p>Bốn dấu tích xanh; chỉ <code>(retry x3)</code> là lạ — dấu vết nhìn thấy được của một vấn đề đo ở dưới.</p>
<div class="pitfall co-tieu-de"><strong>“CI xanh” không phải là review.</strong> CI chứng minh test đạt với code hôm nay. Review hỏi test có <em>đỏ</em> nếu code sai không, và có còn xanh nếu code đổi theo cách người dùng không thấy. Hướng dẫn của Google: “Will the tests actually fail when the code is broken?”</div>

<h3>Review một pull request test thế nào</h3>
${FLOW_VI}
<p>Bước 3 và 4 dùng <code>scripts/thu-loi.mjs</code> (bài 3.3): bug cài vào mà vẫn xanh là test không thể đỏ; refactor mà làm đỏ là test hỏng vô cớ.</p>

<h3>Mùi 1 — test kiểm chính cái mock của nó</h3>
<p>“should send mail” dựng một mock, gọi nó, rồi kiểm nó đã được gọi; <code>cancelBooking</code> không hề chạy. Cài bug “không ai được gửi thư” (<code>if (offer) {</code> → <code>if (false) {</code>) và chỉ chạy test này:</p>
${ra(MOCK)}
<p>Xanh dù bug nằm đó — bài 3.3 ở dạng thuần nhất.</p>
${ma('text', C_MOCK)}

<h3>Mùi 2 — snapshot duyệt mọi thứ</h3>
<p>“should work” cất lượt đặt, kết quả, danh sách chờ và hộp thư đi vào một snapshot 30 dòng. Cài một bug thật — chỗ trống được giao cho sinh viên <em>cuối</em> hàng. Snapshot đỏ, đúng; người đang vội đọc “mismatched” thành “cũ rồi” và chạy <code>-u</code>:</p>
${ra(SNAP_U)}
<p>Xanh, và con bug giờ đã được duyệt. Chỗ duy nhất còn thấy nó là diff <code>.snap</code> trong pull request:</p>
${ra(SNAP_DIFF)}
<p>Hướng dẫn của Vitest: snapshot được “reviewed as part of your code review process”. Cũng snapshot đó lại đỏ vô cớ — thêm một trường cho lượt đặt (<code>source: 'web'</code>) là hỏng — và đó là cách cả nhóm học bấm <code>-u</code>.</p>
${ma('text', C_SNAP)}
<div class="pitfall co-tieu-de"><strong>Đọc diff <code>.snap</code> như đọc code.</strong> Snapshot đổi là hành vi mong đợi đổi. Nếu không ai nói được vì sao mỗi dòng đổi giờ là đúng, nó chỉ được đóng dấu cho có, chưa được review (bài 1.2 đã đo <code>-u</code> chấp nhận một con bug).</div>

<h3>Mùi 3 — tên không nói gì</h3>
<p>“should send mail”, “should work”, “should return correct value”, “should handle edge case”. Cùng một bug cài vào, đây là thứ CI hiện cho file đã nộp, rồi cho file sau review:</p>
${ra(TEN)}
<p>Dòng sau tự nó là một báo cáo lỗi: ai lẽ ra được mời vào chỗ trống, và ai đã được mời. Bỏ “should”, nêu luật (bài 1.3) — <code>suggestion (non-blocking)</code>.</p>

<h3>Mùi 4 — dữ liệu ngẫu nhiên</h3>
<p>“should return correct value” rút ba id trong mười. Cả ba khác nhau chỉ 10 × 9 × 8 / 1000 = 72% số lần; còn lại <code>joinWaitlist</code> trả lời đúng <code>ALREADY_WAITING</code>, hàng đợi thành <code>undefined</code>, và test ném TypeError. Chỉ bỏ retry rồi lặp 30 lần:</p>
${ra(OUT['103-retry-khong'])}
<p>Đỏ 10 trên 30 lần trên code đúng — hỏng là cái test, không phải danh sách chờ (bài 2.4 đo 14/100 và sửa đúng cách này: kiểm soát dữ liệu).</p>

<h3>Mùi 5 — khẳng định cách cài đặt</h3>
<p>“should handle edge case” theo dõi <code>waitlists.set</code> và đòi đúng một lần gọi. Cài một refactor mà từ ngoài không ai thấy — chỉ ghi Map khi có gì đổi — và chạy cả hai file:</p>
${ra(IMPL)}
<p>Bản nộp: đỏ. Bản review, kiểm <code>waitlists.get(KEY) ?? []</code> như mọi bên gọi: xanh. Kiểm lời gọi thì hỏng khi refactor mà người dùng chẳng hề thấy (bài 3.3) — <code>question:</code> vì sao phải theo dõi <code>set</code>?</p>

<h3>Mùi 6 — test chập chờn được bịt bằng retry</h3>
<p>Dũng thấy mùi 4 thỉnh thoảng đỏ trong CI và thêm <code>{ retry: 3 }</code>:</p>
${ra(OUT['103-retry-co'])}
<p>0 trên 30 lần đỏ; dấu vết duy nhất là cái đuôi <code>(retry x3)</code> như trong lần CI xanh của pull request. Ở bài 8.3 retry biến một lượt đặt trùng thật từ 17/50 lần đỏ thành 0/50 — dấu tích xanh không phân biệt được bug của test với bug của sản phẩm. Test chập chờn cần người phụ trách và cách ly (bài 9.3), không cần retry.</p>
${ma('text', C_RAND)}

<h3>Sau review: đúng 5 trên 5 lần</h3>
<p>Dũng viết lại file: tên theo luật, dữ liệu cố định, bộ gửi thư là fake (bài 3.1), khẳng định thứ bên gọi nhìn thấy. Test đầu tiên của nó:</p>
${ma('javascript', SAU_CODE)}
<p>Hai test nữa phủ hàng đợi rỗng (không thư, không ai chờ) và sinh viên thứ tư (<code>WAITLIST_FULL</code>). <code>demo10/review/so-sanh.mjs</code> cài ba bug và hai refactor vô hại, chạy cả hai file với từng thay đổi — bug thì file phải đỏ, refactor thì phải còn xanh:</p>
${ra(OUT['103-so-sanh'])}
${ra(OUT['103-sau-lap'])}
<p>File đã nộp bắt được hai bug chỉ nhờ snapshot bắt mọi thứ và đỏ với cả hai thay đổi vô hại; file sau review đúng 5/5 với ít test hơn.</p>

<h3>Checklist</h3>
${CHECK_VI}

<h3>Nói thế nào</h3>
<p>Mỗi bình luận ở trên là một nhãn (Conventional Comments: <code>issue (blocking)</code>, <code>suggestion</code>, <code>question</code>, <code>nit</code>), code đang làm gì, bạn đã đo được gì, và một hướng ra. Google yêu cầu bình luận “about the code and never … about the developer”: “test này gọi cái mock”, không phải “bạn test cái mock”. Chỉ chặn khi có bằng chứng; phong cách là <code>nit</code>; thêm một lời <code>praise:</code> thật lòng (hàng đợi rỗng có được test).</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Một pull request khác thêm test này cho <code>acceptOffer</code> (lời mời có hiệu lực 30 phút). Tìm ít nhất ba mùi, viết một bình luận có nhãn cho mỗi mùi, viết lại test, và chứng minh bằng <code>scripts/thu-loi.mjs</code> với bug “lời mời nào cũng bị từ chối” (<code>now &lt; offer.expiresAt ?</code> → <code>false ?</code>).</p>
${ma('javascript', TH_CODE)}
${ra(TH_TRUOC)}
<p><strong>Các mùi:</strong> tên mơ hồ; đồng hồ thật; chờ thật một giây (1003 ms cho một test, bài 8.4); <code>toBeTruthy</code>, mà cả <code>{ ok: false }</code> cũng qua; biên 30 phút không bao giờ được thử.</p>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', TH_SAU_CODE)}
${ra(TH_BUG)}
<p><strong>Xong khi</strong> bản viết lại đỏ với bug cài vào trong khi test đã nộp vẫn xanh, chạy trong vài mili giây, và mỗi bình luận nói rõ bạn đã đo gì.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test smell (mùi test)</span><span class="v">Mẫu khiến test không thể đỏ, đỏ vô cớ, hoặc đỏ ngẫu nhiên.</span></div>
  <div class="kv"><span class="k">rubber-stamping (duyệt cho có)</span><span class="v">Duyệt, hoặc chạy <code>-u</code>, mà không đọc thay đổi.</span></div>
  <div class="kv"><span class="k">blocking / non-blocking (chặn / không chặn)</span><span class="v">Bình luận có phải được giải quyết trước khi merge không.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>CI xanh nói test đạt, không nói test có thể đỏ: cài một bug và một refactor vô hại trước khi duyệt.</li>
<li>Sáu mùi đã đo: test cái mock, snapshot rộng, tên mơ hồ, dữ liệu ngẫu nhiên, kiểm cách cài đặt, retry che chập chờn.</li>
<li>Diff <code>.snap</code> là thay đổi về hành vi mong đợi — đọc như đọc code.</li>
<li>Gắn nhãn mỗi bình luận, đưa bằng chứng, nói về code, chỉ chặn khi có bằng chứng.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-review-types-techniques', title: 'Lý thuyết ở SWT301 — 3.3: các loại review và kỹ thuật review', sub: 'Giống: review là kiểm thử tĩnh, có hệ thống nhờ checklist (checklist-based review). Sâu thêm ở đây: sản phẩm được review là test, và mỗi dòng checklist được kiểm bằng cách chạy với một bug cài vào.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'git', bai: 'git-6-2-review', title: 'Khoá Git — 6.2: cho và nhận phản hồi review', sub: 'Ở đó: verdict, thứ tự đọc, nhãn blocking/nit và giọng văn cho mọi pull request. Ở đây: nhìn vào đâu khi thay đổi là test, với bằng chứng đo được trong mỗi bình luận.', cta: 'MỞ BÀI →' })}
</div>
`,
};
