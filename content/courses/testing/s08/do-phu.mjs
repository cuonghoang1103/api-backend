/**
 * Testing · Chương 8 · 8.1 — Độ phủ: đo được gì và không đo được gì. Slug giữ từ khung: tst-8-1-do-phu.
 * Chạy thật (Vitest 5.0.5 + @vitest/coverage-v8 / coverage-istanbul 5.0.5): unit suite 96.31% dòng nhưng chỉ đếm file đã import —
 * thêm coverage.include ⇒ 78.91% (app.js, main.js, pgRepo.js, reminder.js, code.js 0%); bộ test chỉ toBeDefined đạt 100% dòng,
 * 96.29% nhánh ('CONFIRMED' dòng 40 chưa chạy) rồi 100% cả bốn chỉ số — và hai bug cài sẵn (>= 30, bỏ ADMIN) vẫn xanh, trong khi
 * booking.test.js thật chỉ 87.5% dòng mà bắt được >= MAX_MINUTES; v8 vs istanbul trên JSX 86 vs 84 câu lệnh, trên src/ nhánh 109 vs 107/117
 * (sửa 01/11 theo số đo: tham số mặc định now = new Date() trong cancel.js/days.js — istanbul tính là nhánh, v8 không); ngưỡng trong cấu hình đỏ
 * ở lần đầu (83.9% dòng) ⇒ chuyển test từ demo2/demo3 vào src + loại app.js ⇒ xanh (95.78%); perFile bắt server.js và code.js.
 */
import G from '../giang/tst-08-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

// Lọc output (chỉ bỏ dòng, không sửa chữ): giữ lệnh, "Coverage enabled", tổng số test, các dòng bảng/tóm tắt được chọn, ERROR.
const loc = (t, re) => t.split('\n').filter((l) => re.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const LAN_DAU = loc(OUT['81-lan-dau'], /^\$ |Coverage enabled|Tests {2}|^ *\w.*\|/);
const INCLUDE = loc(OUT['81-include'], /^\$ |Tests {2}|File {2}|All files|app\.js|main\.js|pgRepo|reminder|code\.js|Lines {4}/);
const KHONG = loc(OUT['81-khong-assert'], /^\$ |×|Error:|Tests {2}/);
const BOOK = (k) => loc(OUT[k], /^\$ |Tests {2}|File {2}| booking\.js/);
const GAN = BOOK('81-gan-nhu-khong');
const DU = BOOK('81-du-nhanh');
const THAT = BOOK('81-that-cov');
const LOI = (k) => loc(OUT[k], /^\$ |planted|Tests {2}/);
const LOI1 = LOI('81-du-nhanh-loi1');
const LOI2 = LOI('81-du-nhanh-loi2');
const LOI3 = loc(OUT['81-du-nhanh-loi3'], /^\$ |planted|×|AssertionError|Tests {2}/);
const HTML = loc(OUT['81-html'], /^\$ |title=/);
const WEB = (k) => loc(OUT[k], /^\$ |Coverage report|Statements|Lines/);
const V8 = WEB('81-v8-web');
const IST = WEB('81-istanbul-web');
const SRC = (k) => loc(OUT[k], /^\$ |Tests {2}|Coverage report|Statements|Branches|Functions|Lines/);
const V8_SRC = SRC('81-v8-src');
const IST_SRC = SRC('81-istanbul-src');
const COV_DO = loc(OUT['81-cov-do'], /^> vitest|Tests {2}|All files|app\.js|reminder|code\.js|ERROR/);
const COV_XANH = loc(OUT['81-cov-xanh'], /^> vitest|Tests {2}|All files|reminder|code\.js|Lines {8}/);
const PER_FILE = loc(OUT['81-per-file'], /^\$ |ERROR/);
const TH = loc(OUT['81-th'], /^\$ |Tests {2}|File {2}|server\.js|login-guard\.js|Lines {8}/);
const CFG = CODE.vitestConfig.split('\n').filter((l) => /coverage|provider|include:|exclude: \['src|reporter:|thresholds| {4}\},/.test(l)).join('\n');
const BK = CODE.booking.split('\n').slice(31, 42).join('\n');
const GNK = CODE.ganNhuKhong.split('\n').slice(12, 21).join('\n');

const STACK_EN = `<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">% Lines / % Stmts — did it RUN?</span><span class="lz-lnote">0% = no test reaches it · 100% says nothing about checks</span></div>
  <div class="lz-layer"><span class="lz-lname">% Branch — did EACH WAY run?</span><span class="lz-lnote">both sides of every if, ? :, ||, ?? and default parameter</span></div>
  <div class="lz-layer"><span class="lz-lname">% Funcs — was each function CALLED?</span><span class="lz-lnote">default-parameter arrow functions count too</span></div>
  <div class="lz-layer"><span class="lz-lname">Each condition true AND false? (not measured)</span><span class="lz-lnote">role === 'ADMIN' ran but was never true</span></div>
  <div class="lz-layer"><span class="lz-lname">Did a test CHECK the result? (not measured)</span><span class="lz-lnote">toBeDefined() everywhere still gives 100% — lesson 8.2 measures this</span></div>
</div>`;
const STACK_VI = `<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">% Lines / % Stmts — có CHẠY không?</span><span class="lz-lnote">0% = không test nào tới · 100% không nói gì về việc kiểm</span></div>
  <div class="lz-layer"><span class="lz-lname">% Branch — MỖI NGẢ có chạy không?</span><span class="lz-lnote">cả hai phía của mọi if, ? :, ||, ?? và tham số mặc định</span></div>
  <div class="lz-layer"><span class="lz-lname">% Funcs — mỗi hàm có được GỌI không?</span><span class="lz-lnote">arrow function trong tham số mặc định cũng tính</span></div>
  <div class="lz-layer"><span class="lz-lname">Mỗi điều kiện vừa đúng vừa sai? (không đo)</span><span class="lz-lnote">role === 'ADMIN' đã chạy nhưng chưa bao giờ đúng</span></div>
  <div class="lz-layer"><span class="lz-lname">Có test nào KIỂM kết quả? (không đo)</span><span class="lz-lnote">toBeDefined() khắp nơi vẫn 100% — bài 8.2 đo điều này</span></div>
</div>`;

const BANG_EN = `<table>
<thead><tr><th>Situation</th><th>Use</th></tr></thead>
<tbody>
<tr><td>Normal Node/Vitest project</td><td><code>provider: 'v8'</code> (default)</td></tr>
<tr><td>Tests that run outside V8 (Firefox/WebKit), or you need <code>ignoreClassMethods</code></td><td><code>provider: 'istanbul'</code></td></tr>
<tr><td>Find code no test touches</td><td><code>include: ['src/**/*.js']</code></td></tr>
<tr><td>Stop coverage sliding back</td><td><code>thresholds</code> just under today’s level</td></tr>
<tr><td>One weak file hidden by a good average</td><td><code>thresholds.perFile</code></td></tr>
</tbody></table>`;
const BANG_VI = `<table>
<thead><tr><th>Tình huống</th><th>Dùng</th></tr></thead>
<tbody>
<tr><td>Dự án Node/Vitest bình thường</td><td><code>provider: 'v8'</code> (mặc định)</td></tr>
<tr><td>Test chạy ngoài V8 (Firefox/WebKit), hoặc cần <code>ignoreClassMethods</code></td><td><code>provider: 'istanbul'</code></td></tr>
<tr><td>Tìm code chưa test nào chạm tới</td><td><code>include: ['src/**/*.js']</code></td></tr>
<tr><td>Giữ độ phủ không tụt</td><td><code>thresholds</code> ngay dưới mức hôm nay</td></tr>
<tr><td>Một file yếu bị trung bình đẹp che</td><td><code>thresholds.perFile</code></td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📏', 'Vitest — Coverage guide', 'Providers v8 and istanbul, include/exclude, reporters, thresholds and perFile.', 'https://vitest.dev/guide/coverage'),
  nguon('🧭', 'Martin Fowler — TestCoverage', '“High coverage numbers are too easy to reach with low quality testing.”', 'https://martinfowler.com/bliki/TestCoverage.html'),
].join('\n');

export default {
  title: '8.1 — Coverage: what it measures and what it cannot|||8.1 — Độ phủ: đo được gì và không đo được gì',
  slug: 'tst-8-1-do-phu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đo độ phủ thật trên LabFlow Lite bằng Vitest (v8 và istanbul): đọc bảng Stmts/Branch/Funcs/Lines; file không ai import thì vô hình (96,31% ⇒ 78,91% khi bật coverage.include); bộ test chỉ toBeDefined đạt 100% cả bốn chỉ số mà hai bug cài sẵn vẫn xanh, còn booking.test.js thật chỉ 87,5% dòng lại bắt được bug; nhánh chưa chạy trong báo cáo HTML; điều kiện ADMIN chưa bao giờ đúng; ngưỡng trong cấu hình đỏ ở lần đầu và cách sửa đúng (chuyển test từ demo vào src, loại file có lý do), perFile; vì sao đuổi theo 100% là sai.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Coverage: what it measures and what it cannot</h2>
<p class="lead">Every team is eventually asked “what is our coverage?”. The number is easy to produce and easy to misread. This lesson measures it on LabFlow Lite, pushes it to 100% with tests that check almost nothing — and shows two bugs walking through the 100%.</p>
<p><strong>After this lesson you can</strong> turn on coverage in Vitest, read its columns, find files no test loads, tell lines from branches, choose a provider, and set thresholds so coverage cannot quietly slide back. <strong>Why it is useful:</strong> coverage is in almost every CI pipeline and many interviews (“what coverage do you aim for, and why?”). The valuable skill is reading the report to find untested code — and knowing what a high number does <em>not</em> prove.</p>

<h3>What coverage is</h3>
<p><em>Code coverage</em> (độ phủ mã) records which parts of your code ran while the tests ran — nothing more; it never knows whether a test looked at the result. Vitest has two <em>providers</em> (bộ thu thập): <strong>v8</strong> asks the V8 engine inside Node to count the blocks it executes (your code runs unchanged); <strong>istanbul</strong> rewrites each file with a counter before every statement and branch, then runs the rewritten file. Each is a package matching your Vitest version exactly (<code>@vitest/coverage-v8@5.0.5</code>, <code>@vitest/coverage-istanbul@5.0.5</code>).</p>
${ra(LAN_DAU)}
<p><strong>% Stmts</strong>/<strong>% Lines</strong>: statements/lines that ran. <strong>% Branch</strong>: both ways of every <code>if</code>, <code>? :</code>, <code>||</code>, <code>??</code>, default parameter. <strong>% Funcs</strong>: functions called. <strong>Uncovered Line #s</strong>: where to look — <code>54-56</code> in server.js are error paths.</p>
<p>Missing: files at 100% (hidden by the text reporter’s default) and files no test imported (not counted at all).</p>

<h3>Files nobody imports are invisible</h3>
${ra(INCLUDE)}
<p>Same 85 tests, same code: with <code>coverage.include</code>, 96.31% of lines becomes <strong>78.91%</strong>. <code>app.js</code> (lesson 0.2’s tiny app, tested from <code>test/</code>), <code>main.js</code> (only calls <code>listen</code>) and <code>pgRepo.js</code> (the Chapter 4 integration suite covers it) are expected; <code>reminder.js</code> and <code>code.js</code> are real gaps — their tests exist only in <code>demo3/</code> and <code>demo2/</code>, which the unit suite never runs.</p>
<div class="pitfall co-tieu-de"><strong>A high number can come from leaving files out.</strong> Always set <code>include</code> to your source folder, then decide file by file: write tests, or exclude it <em>with a comment saying who covers it</em>.</div>

<h3>100% coverage, checking nothing</h3>
<p>A test without any <code>expect</code> is already red here, thanks to <code>requireAssertions</code> (lesson 1.1):</p>
${ra(KHONG)}
<p>But it is easy to fool: give every call an <code>expect</code> that cannot really fail (<code>demo8/gan-nhu-khong.test.js</code>, excerpt):</p>
${ma('javascript', GNK)}
${ra(GAN)}
<p>100% lines, 96.29% branches. Line 40 ran, but the <code>'CONFIRMED'</code> side of its <code>? :</code> never did — every <code>createBooking</code> call used 31 seats or a bad slot:</p>
${ma('javascript', BK)}
<p>The HTML report (<code>coverage/index.html</code>) highlights that exact spot:</p>
${ra(HTML)}
<p>One more call with 5 seats (<code>demo8/du-nhanh.test.js</code>) and the weak suite tops every column. Then plant two bugs, one at a time, with <code>thu-loi.mjs</code> (lesson 2.1: change one piece of text, run the tests, always restore):</p>
${ra(DU)}
${ra(LOI1)}
${ra(LOI2)}
<p>Both survive at 100/100/100/100: 30 seats sent to approval; an admin with 31 seats made to wait. The Chapter 1 reference suite covers <em>less</em> of the same file, yet catches a boundary bug at once because it checks <code>{ ok: true, minutes: 240 }</code> exactly at the boundary:</p>
${ra(THAT)}
${ra(LOI3)}
${STACK_EN}
<p>Look at the ADMIN bug again: in <code>role === 'LECTURER' || role === 'ADMIN'</code> the right side <em>ran</em> (false for STUDENT), so branch coverage is satisfied, but no check ever saw it true. Measuring that is <em>condition coverage</em>; its strict form MC/DC is required for avionics. Vitest measures neither — the defence is a decision table with one row per role (lesson 1.4).</p>
<div class="pitfall co-tieu-de"><strong>100% coverage + green ≠ tested.</strong> When a pull request “raises coverage”, read the assertions, not the percentage. Lesson 8.2 gives this its own number: how many planted bugs the tests actually notice.</div>

<h3>v8 or istanbul?</h3>
<p>The 16 web tests of Chapter 6, measured on the JSX components by each provider:</p>
${ra(V8)}
${ra(IST)}
<p>Statements (86 vs 84) and lines (67 vs 65) differ: JSX is compiled first and each tool maps it back its own way. Plain JavaScript in <code>src/</code>, the 116 unit tests:</p>
${ra(V8_SRC)}
${ra(IST_SRC)}
<p>Statements, functions and lines match exactly (226/233, 62/64, 186/189); branches do not — 109 vs 107 of 117. The two extra misses are the default parameter <code>now = new Date()</code> in <code>cancel.js</code> and <code>days.js</code>: every test passes its own clock, so the default never runs. istanbul counts that unused default as an uncovered branch; v8 did not count it here (the arrow-function defaults of <code>code.js</code> are branches for both: 5 of 5 each). Use v8; never compare numbers across providers.</p>
${BANG_EN}
<p><strong>Coming from Java?</strong> Spring Boot teams use JaCoCo: same counters (instruction, line, branch, method) and a <code>check</code> goal that fails the build below a minimum — like <code>thresholds</code>.</p>

<h3>Thresholds in the config</h3>
<p>LabFlow Lite now runs <code>npm run test:cov</code> (= <code>vitest run src/ --coverage</code>) with this block in <code>vitest.config.js</code>:</p>
${ma('javascript', CFG)}
<p>The first run (before <code>src/app.js</code> joined <code>exclude</code>) was red:</p>
${ra(COV_DO)}
<p>Two cheap fixes are both wrong: lowering the thresholds, or excluding <code>reminder.js</code> and <code>code.js</code>, which are real code. Their tests lived in demo folders, and a test CI never runs protects nothing. So they moved next to the code as <code>src/rules/code.test.js</code> and <code>src/notify/reminder.test.js</code>, and <code>src/app.js</code> was excluded with its reason. Now:</p>
${ra(COV_XANH)}
<p><code>code.js</code> still shows 60% branches: the defaults <code>newId = () =&gt; crypto.randomUUID()</code> and <code>now = () =&gt; new Date()</code> on line 22 never run because every test injects them (lesson 2.4) — default parameters count as branches <em>and</em> functions:</p>
${ra(PER_FILE)}
<p><code>perFile</code> finds what the average hides. Keep thresholds as a <strong>ratchet</strong>: just under today’s level, raised when tests are added, never lowered to get a merge through.</p>

<h3>Why chasing 100% is the wrong goal</h3>
<p>The last percent is the most expensive and least useful (a unit test for <code>main.js</code> only proves Express can <code>listen</code>); a target becomes a game (Goodhart’s law) and produces exactly the <code>toBeDefined()</code> suite above; and one test at the 30/31-seat boundary is worth more than ten percent on trivial code.</p>
<p>Martin Fowler expects coverage “in the upper 80s or 90s” from thoughtful testing and would be suspicious of anything like 100%. Read a report in order: <code>include</code> set, every 0% file explained? Which uncovered lines are error paths users meet? Which branch sides never ran? Then read the assertions around your riskiest code.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>In <code>demo8/th81.test.js</code>, cover lines 54–56 with tests that check the answer: the database unreachable while booking ⇒ <strong>503</strong> <code>{ error: { code: 'STORAGE_DOWN' } }</code>; any other error ⇒ <strong>500</strong> <code>{ error: { code: 'INTERNAL' } }</code> and nothing else in the body.</li>
<li>Decide whether line 5 of <code>login-guard.js</code> (the default real clock) deserves a test.</li>
<li>Run the unit suite plus your file with coverage on those two files.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th81)}
${ra(TH)}
<p>Lines are 100% on both files; the partial branches on 50 and 54 are the <em>false</em> sides of those checks — chasing them adds tests, not protection.</p>
<p><strong>Done when</strong> 93 tests pass, both files show 100% lines, and each of your tests would fail if the status or the body were wrong.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">code coverage (độ phủ mã)</span><span class="v">The share of code that ran during the tests.</span></div>
  <div class="kv"><span class="k">branch coverage (độ phủ nhánh)</span><span class="v">Both outcomes of every decision.</span></div>
  <div class="kv"><span class="k">condition coverage / MC/DC (độ phủ điều kiện)</span><span class="v">Each single condition true and false; not measured by Vitest.</span></div>
  <div class="kv"><span class="k">provider (bộ thu thập)</span><span class="v">v8: the engine counts; istanbul: counters inserted into the code.</span></div>
  <div class="kv"><span class="k">threshold (ngưỡng)</span><span class="v">Minimum percentage; below it the run fails.</span></div>
  <div class="kv"><span class="k">ratchet (bánh cóc)</span><span class="v">Thresholds that only ever move up.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Coverage records what ran — never whether it was checked.</li>
<li>Set <code>include</code>: 96.31% was really 78.91%.</li>
<li>Branches find what lines miss; conditions are not measured.</li>
<li>100% with <code>toBeDefined()</code> let two bugs through; a suite with less coverage caught its bug.</li>
<li>v8 by default; thresholds as a ratchet, fixed with tests, not by lowering them.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-whitebox-coverage', title: 'Theory in SWT301 — 5.1: statement and decision coverage', sub: 'Same: statement vs decision coverage, and 100% statement ≠ 100% decision. Deeper here: a real tool (Vitest v8/istanbul) — 100% on all counters with toBeDefined() while two planted bugs survive, an ADMIN condition never true (the condition coverage / MC/DC gap), thresholds that fail the build.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-5-do-phu-flaky-ci', title: 'Node.js course — 14.5: coverage, flaky tests and CI', sub: 'There: a privilege escalation surviving 100% coverage. Here: the measuring tool itself — providers, missing files, branches, thresholds.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Độ phủ: đo được gì và không đo được gì</h2>
<p class="lead">Nhóm nào rồi cũng bị hỏi “độ phủ của mình bao nhiêu?”. Con số này dễ tạo ra và dễ đọc sai. Bài này đo nó trên LabFlow Lite, đẩy nó lên 100% bằng những test gần như không kiểm gì — và cho thấy hai con bug đi xuyên qua con số 100% đó.</p>
<p><strong>Sau bài này bạn có thể</strong> bật độ phủ trong Vitest, đọc các cột, tìm file không test nào nạp tới, phân biệt dòng với nhánh, chọn provider, và đặt ngưỡng để độ phủ không âm thầm tụt. <strong>Vì sao hữu ích:</strong> độ phủ có trong hầu hết pipeline CI và nhiều buổi phỏng vấn (“bạn nhắm độ phủ bao nhiêu, vì sao?”). Kỹ năng đáng giá là đọc báo cáo để tìm code chưa được test — và biết con số cao <em>không</em> chứng minh được điều gì.</p>

<h3>Độ phủ là gì</h3>
<p><em>Code coverage</em> (độ phủ mã) ghi lại phần nào của code đã chạy trong lúc test chạy — chỉ vậy; nó không bao giờ biết test có nhìn vào kết quả hay không. Vitest có hai <em>provider</em> (bộ thu thập): <strong>v8</strong> nhờ engine V8 bên trong Node đếm các khối nó thực thi (code chạy nguyên như cũ); <strong>istanbul</strong> viết lại từng file, chèn bộ đếm trước mỗi câu lệnh và mỗi nhánh, rồi chạy file đã viết lại. Mỗi cái là một gói phải khớp đúng phiên bản Vitest (<code>@vitest/coverage-v8@5.0.5</code>, <code>@vitest/coverage-istanbul@5.0.5</code>).</p>
${ra(LAN_DAU)}
<p><strong>% Stmts</strong>/<strong>% Lines</strong>: câu lệnh/dòng đã chạy. <strong>% Branch</strong>: cả hai ngả của mọi <code>if</code>, <code>? :</code>, <code>||</code>, <code>??</code>, tham số mặc định. <strong>% Funcs</strong>: hàm đã được gọi. <strong>Uncovered Line #s</strong>: chỗ cần nhìn — <code>54-56</code> ở server.js là nhánh lỗi.</p>
<p>Bảng thiếu: file 100% (bị bộ báo cáo chữ ẩn theo mặc định) và file không test nào import (hoàn toàn không được đếm).</p>

<h3>File không ai import thì vô hình</h3>
${ra(INCLUDE)}
<p>Cùng 85 test, cùng code: bật <code>coverage.include</code>, 96,31% số dòng thành <strong>78,91%</strong>. <code>app.js</code> (app nhỏ của bài 0.2, được test từ <code>test/</code>), <code>main.js</code> (chỉ gọi <code>listen</code>) và <code>pgRepo.js</code> (bộ tích hợp Chương 4 lo) là dự kiến; <code>reminder.js</code> và <code>code.js</code> là lỗ hổng thật — test của chúng chỉ nằm trong <code>demo3/</code> và <code>demo2/</code>, nơi bộ unit không bao giờ chạy.</p>
<div class="pitfall co-tieu-de"><strong>Con số cao có thể đến từ việc bỏ sót file.</strong> Luôn đặt <code>include</code> là thư mục mã nguồn, rồi quyết định từng file: viết test, hoặc loại ra <em>kèm chú thích ai phủ nó</em>.</div>

<h3>100% độ phủ mà không kiểm gì</h3>
<p>Test không có <code>expect</code> nào đã đỏ sẵn ở đây, nhờ <code>requireAssertions</code> (bài 1.1):</p>
${ra(KHONG)}
<p>Nhưng rất dễ lừa: gắn cho mỗi lời gọi một <code>expect</code> gần như không thể hỏng (<code>demo8/gan-nhu-khong.test.js</code>, trích):</p>
${ma('javascript', GNK)}
${ra(GAN)}
<p>100% dòng, 96,29% nhánh. Dòng 40 đã chạy, nhưng phía <code>'CONFIRMED'</code> của toán tử <code>? :</code> thì chưa — mọi lời gọi <code>createBooking</code> đều dùng 31 chỗ hoặc khung giờ sai:</p>
${ma('javascript', BK)}
<p>Báo cáo HTML (<code>coverage/index.html</code>) tô đúng chỗ đó:</p>
${ra(HTML)}
<p>Thêm một lời gọi với 5 chỗ (<code>demo8/du-nhanh.test.js</code>) là bộ test yếu lên đỉnh mọi cột. Rồi cài hai con bug, mỗi lần một con, bằng <code>thu-loi.mjs</code> (bài 2.1: đổi đúng một đoạn chữ, chạy test, luôn trả file về):</p>
${ra(DU)}
${ra(LOI1)}
${ra(LOI2)}
<p>Cả hai sống sót ở 100/100/100/100: 30 chỗ bị đẩy sang chờ duyệt; admin đặt 31 chỗ phải chờ duyệt. Bộ test tham khảo Chương 1 phủ <em>ít hơn</em> trên cùng file, vậy mà bắt ngay bug ở biên vì nó kiểm đúng <code>{ ok: true, minutes: 240 }</code> tại biên:</p>
${ra(THAT)}
${ra(LOI3)}
${STACK_VI}
<p>Nhìn lại bug ADMIN: trong <code>role === 'LECTURER' || role === 'ADMIN'</code> vế phải <em>đã chạy</em> (ra false với STUDENT), nên độ phủ nhánh hài lòng, nhưng chưa phép kiểm nào thấy nó đúng. Đo điều đó gọi là <em>condition coverage</em> (độ phủ điều kiện); dạng chặt MC/DC bắt buộc với phần mềm hàng không. Vitest không đo cả hai — cách phòng là bảng quyết định mỗi vai trò một dòng (bài 1.4).</p>
<div class="pitfall co-tieu-de"><strong>100% độ phủ + xanh ≠ đã được test.</strong> Khi một pull request “nâng độ phủ”, hãy đọc assertion, đừng đọc phần trăm. Bài 8.2 cho điều này một con số riêng: test thật sự nhận ra bao nhiêu con bug được cài.</div>

<h3>v8 hay istanbul?</h3>
<p>16 test web của Chương 6, đo trên các component JSX bằng từng provider:</p>
${ra(V8)}
${ra(IST)}
<p>Câu lệnh (86 so với 84) và dòng (67 so với 65) lệch: JSX được biên dịch trước và mỗi công cụ ánh xạ ngược theo cách riêng. JavaScript thường trong <code>src/</code>, 116 unit test:</p>
${ra(V8_SRC)}
${ra(IST_SRC)}
<p>Câu lệnh, hàm và dòng khớp đúng từng số (226/233, 62/64, 186/189); nhánh thì không — 109 so với 107 trên 117. Hai chỗ thiếu thêm là tham số mặc định <code>now = new Date()</code> trong <code>cancel.js</code> và <code>days.js</code>: test nào cũng truyền đồng hồ riêng, nên giá trị mặc định không bao giờ chạy. istanbul tính giá trị mặc định chưa dùng đó là một nhánh chưa phủ; v8 ở đây thì không (giá trị mặc định dạng arrow function của <code>code.js</code> thì cả hai đều tính là nhánh: mỗi bên 5 trên 5). Dùng v8; đừng so số giữa hai provider.</p>
${BANG_VI}
<p><strong>Bạn từ Java sang?</strong> Nhóm Spring Boot dùng JaCoCo: cùng các bộ đếm (instruction, line, branch, method) và goal <code>check</code> làm build thất bại dưới mức tối thiểu — như <code>thresholds</code>.</p>

<h3>Ngưỡng trong file cấu hình</h3>
<p>LabFlow Lite giờ chạy <code>npm run test:cov</code> (= <code>vitest run src/ --coverage</code>) với khối này trong <code>vitest.config.js</code>:</p>
${ma('javascript', CFG)}
<p>Lần chạy đầu (trước khi <code>src/app.js</code> vào <code>exclude</code>) đỏ:</p>
${ra(COV_DO)}
<p>Hai cách sửa rẻ đều sai: hạ ngưỡng, hoặc loại <code>reminder.js</code> và <code>code.js</code> — vốn là code thật. Test của chúng nằm trong thư mục demo, và test mà CI không chạy thì không bảo vệ được gì. Nên chúng được chuyển vào cạnh code thành <code>src/rules/code.test.js</code> và <code>src/notify/reminder.test.js</code>, còn <code>src/app.js</code> được loại ra kèm lý do. Giờ thì:</p>
${ra(COV_XANH)}
<p><code>code.js</code> vẫn 60% nhánh: hai giá trị mặc định <code>newId = () =&gt; crypto.randomUUID()</code> và <code>now = () =&gt; new Date()</code> ở dòng 22 không bao giờ chạy vì mọi test đều tiêm chúng vào (bài 2.4) — tham số mặc định được tính là nhánh <em>và</em> là hàm:</p>
${ra(PER_FILE)}
<p><code>perFile</code> tìm ra cái con số trung bình che. Giữ ngưỡng kiểu <strong>bánh cóc</strong> (ratchet): ngay dưới mức hôm nay, nâng khi thêm test, không bao giờ hạ để cho một lần merge đi qua.</p>

<h3>Vì sao đuổi theo 100% là mục tiêu sai</h3>
<p>Phần trăm cuối đắt nhất và ít ích nhất (unit test cho <code>main.js</code> chỉ chứng minh Express biết <code>listen</code>); chỉ tiêu biến thành trò chơi (định luật Goodhart) và sinh ra đúng bộ <code>toBeDefined()</code> ở trên; còn một test ở biên 30/31 chỗ đáng giá hơn mười phần trăm trên code tầm thường.</p>
<p>Martin Fowler kỳ vọng độ phủ “in the upper 80s or 90s” (khoảng cuối 80 tới 90 phần trăm) khi test chu đáo, và sẽ nghi ngờ mọi thứ kiểu 100%. Đọc báo cáo theo thứ tự: đã đặt <code>include</code>, mọi file 0% có lý do? Dòng chưa phủ nào là nhánh lỗi người dùng gặp? Ngả nào chưa chạy? Rồi đọc assertion quanh phần code rủi ro nhất.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Trong <code>demo8/th81.test.js</code>, phủ dòng 54–56 bằng test kiểm câu trả lời: CSDL không với tới được khi đặt phòng ⇒ <strong>503</strong> <code>{ error: { code: 'STORAGE_DOWN' } }</code>; mọi lỗi khác ⇒ <strong>500</strong> <code>{ error: { code: 'INTERNAL' } }</code> và body không có gì thêm.</li>
<li>Quyết định dòng 5 của <code>login-guard.js</code> (đồng hồ thật mặc định) có đáng một test không.</li>
<li>Chạy bộ unit cùng file của bạn, độ phủ giới hạn vào hai file đó.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th81)}
${ra(TH)}
<p>Hai file 100% dòng; nhánh thiếu ở dòng 50 và 54 là ngả <em>false</em> của các phép kiểm đó — đuổi theo chúng là thêm test chứ không thêm bảo vệ.</p>
<p><strong>Xong khi</strong> 93 test qua, hai file hiện 100% dòng, và mỗi test của bạn sẽ đỏ nếu status hoặc body sai.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">code coverage (độ phủ mã)</span><span class="v">Tỉ lệ code đã chạy trong lúc test chạy.</span></div>
  <div class="kv"><span class="k">branch coverage (độ phủ nhánh)</span><span class="v">Cả hai kết quả của mọi quyết định.</span></div>
  <div class="kv"><span class="k">condition coverage / MC/DC (độ phủ điều kiện)</span><span class="v">Mỗi điều kiện đơn vừa đúng vừa sai; Vitest không đo.</span></div>
  <div class="kv"><span class="k">provider (bộ thu thập)</span><span class="v">v8: engine tự đếm; istanbul: chèn bộ đếm vào code.</span></div>
  <div class="kv"><span class="k">threshold (ngưỡng)</span><span class="v">Phần trăm tối thiểu; dưới mức đó lượt chạy thất bại.</span></div>
  <div class="kv"><span class="k">ratchet (bánh cóc)</span><span class="v">Ngưỡng chỉ được đi lên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Độ phủ ghi cái gì đã chạy — không bao giờ ghi nó có được kiểm không.</li>
<li>Đặt <code>include</code>: 96,31% thật ra là 78,91%.</li>
<li>Nhánh tìm ra cái dòng bỏ sót; điều kiện thì không được đo.</li>
<li>100% với <code>toBeDefined()</code> để lọt hai bug; một bộ test phủ ít hơn lại bắt được bug.</li>
<li>Mặc định v8; ngưỡng kiểu bánh cóc, sửa bằng test chứ không bằng cách hạ ngưỡng.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-whitebox-coverage', title: 'Lý thuyết ở SWT301 — 5.1: statement coverage và decision coverage', sub: 'Giống: statement và decision coverage, 100% statement ≠ 100% decision. Sâu thêm ở đây: công cụ thật (Vitest v8/istanbul) — 100% mọi bộ đếm với toBeDefined() mà hai bug cài sẵn vẫn sống, điều kiện ADMIN chưa từng đúng (lỗ hổng condition coverage / MC/DC), ngưỡng làm build thất bại.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-5-do-phu-flaky-ci', title: 'Khoá Node.js — 14.5: độ phủ, test chập chờn và CI', sub: 'Ở đó: lỗ leo thang quyền sống sót qua độ phủ 100%. Ở đây: chính công cụ đo — provider, file bị bỏ sót, nhánh, ngưỡng.', cta: 'MỞ BÀI →' })}
</div>
`,
};
