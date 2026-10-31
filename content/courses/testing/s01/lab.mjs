/**
 * Testing · Chương 1 · Lab 1 — Test luật LabFlow Lite, diệt 8 đột biến. BÀI MỚI 01/11/2026, slug tst-1-5-lab-quy-tac.
 * Máy chấm = scripts/dot-bien.mjs (kiểm thử đột biến thủ công: cài 8 bug, chạy test, trả code). Output chạy thật (_ma.mjs).
 */
import G from '../giang/tst-lab-1.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const RUBRIC_EN = `<table>
<thead><tr><th>Criterion</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Mutants killed</td><td>4 (0.5 each)</td><td><code>node scripts/dot-bien.mjs</code></td></tr>
<tr><td>Boundary values for every limit: 14 days (−1 0 14 15), 30/31 seats, 07:00 and 21:00, 240/270 minutes, zero-length slot</td><td>2</td><td>Read the <code>it.each</code> tables</td></tr>
<tr><td>Invalid input with the right error class: seats 0 / −5 / 2.5 → <code>RangeError</code>; “7:00”, “abc” → <code>TypeError</code>; “24:00”, “07:60” → <code>RangeError</code>; non-integer days → <code>false</code></td><td>1</td><td><code>toThrow(Class)</code> in the tests</td></tr>
<tr><td>Names and structure: one <code>describe</code> per function, <code>it.each</code> for tables, every name states the rule and the expected result</td><td>2</td><td>Read the report tree</td></tr>
<tr><td>Hygiene: green on the real code, no <code>.only</code>/<code>.skip</code>, every test asserts (<code>requireAssertions</code> on), whole suite under 1 second</td><td>1</td><td><code>npm run test:unit</code></td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>Số đột biến bị diệt</td><td>4 (0,5 mỗi con)</td><td><code>node scripts/dot-bien.mjs</code></td></tr>
<tr><td>Giá trị biên cho mọi giới hạn: 14 ngày (−1 0 14 15), 30/31 chỗ, 07:00 và 21:00, 240/270 phút, khung dài 0 phút</td><td>2</td><td>Đọc các bảng <code>it.each</code></td></tr>
<tr><td>Đầu vào không hợp lệ với đúng lớp lỗi: số chỗ 0 / −5 / 2.5 → <code>RangeError</code>; "7:00", "abc" → <code>TypeError</code>; "24:00", "07:60" → <code>RangeError</code>; số ngày không nguyên → <code>false</code></td><td>1</td><td><code>toThrow(Class)</code> trong test</td></tr>
<tr><td>Tên và cấu trúc: mỗi hàm một <code>describe</code>, <code>it.each</code> cho bảng, tên nào cũng nói luật và kết quả mong đợi</td><td>2</td><td>Đọc cây báo cáo</td></tr>
<tr><td>Vệ sinh: xanh trên code thật, không <code>.only</code>/<code>.skip</code>, test nào cũng có khẳng định (bật <code>requireAssertions</code>), cả bộ chạy dưới 1 giây</td><td>1</td><td><code>npm run test:unit</code></td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 1 — Test the LabFlow Lite rules and kill 8 mutants|||Lab 1 — Test luật LabFlow Lite và diệt 8 đột biến',
  slug: 'tst-1-5-lab-quy-tac',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 1 có thang chấm 10 điểm: viết trọn bộ test cho luật LabFlow Lite (checkSlot, BR-05, BR-06, parseTime/formatTime), rồi script dot-bien.mjs cài 8 bug từng con một — bộ test tốt phải đỏ với cả 8. Có output thật của bộ test yếu (1/8) và lời giải tham khảo (40 test, 8/8).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lab 1</span>
<h2>Test the LabFlow Lite rules and kill 8 mutants</h2>
<p class="lead">60–90 minutes. You write the complete unit-test suite for LabFlow Lite’s rules. Then a script grades it objectively: it plants eight realistic bugs, one at a time, and checks whether your suite turns red for each. This is <strong>mutation testing</strong> done by hand — Chapter 8 shows the industrial tool (Stryker).</p>

<h3>Setup</h3>
<ol>
<li>Use the <code>labflow-lite</code> project from lessons 0.3–1.4, with <code>src/rules/time.js</code> and <code>src/rules/booking.js</code> exactly as given in lessons 0.3 and 1.1. Do not change them — the script searches for exact lines.</li>
<li>Install fast-check if you have not: <code>npm install --save-dev fast-check@4</code>.</li>
<li>Add a script that runs only the real suite — <code>demo/</code> keeps tests that are red on purpose, so plain <code>npm test</code> (all folders) is not the one to judge: in <code>package.json</code>, <code>"test:unit": "vitest run src/"</code>. From now on “the suite is green” means <code>npm run test:unit</code> is green.</li>
<li>Switch on <code>requireAssertions</code> in <code>vitest.config.js</code> (part of the hygiene point):
${ma('javascript', CODE.config)}</li>
<li>Create <code>scripts/dot-bien.mjs</code> (“đột biến” = mutant):
${ma('javascript', CODE.dotBien)}</li>
</ol>
<p>How it works: for each mutant it replaces one exact piece of a line, runs <code>npx vitest run src/</code>, records <em>killed</em> if the run fails (exit code ≠ 0) or <em>survived</em> if it passes, and restores the original file in a <code>finally</code> block so the code is never left broken. <code>shell: process.platform === 'win32'</code> is needed because on Windows <code>npx</code> is a <code>.cmd</code> file. Note that it runs only <code>src/</code> — your deliberately broken experiments in <code>demo/</code> do not count.</p>

<h3>Your task</h3>
<p>Write <code>src/rules/booking.test.js</code> and extend <code>src/rules/time.test.js</code> so that:</p>
<ol>
<li><code>npm run test:unit</code> is green on the real code;</li>
<li><code>node scripts/dot-bien.mjs</code> prints <strong>8/8 mutants killed</strong>.</li>
</ol>
<p>Work rule-first: write the rules as sentences, turn each into test names, use the techniques of lesson 1.4 to pick values, and only then run the script. Reading the mutant list first and writing one test per mutant is “teaching to the test” — it gets 8/8 and still misses the next bug.</p>

<h3>What a first attempt usually looks like</h3>
<p>A real run with a weak suite — two happy-path tests for <code>checkSlot</code> plus the three time tests from lesson 0.3:</p>
${ma('javascript', CODE.weakTest)}
${ra(OUT['lab-weak-run'])}
${ra(OUT['lab-mut-weak'])}
<p>Five tests, all green — and seven of eight bugs would reach users. Read every <em>SURVIVED</em> line as “the test I forgot”: 14 days ahead, exactly 30 seats, a slot ending at 21:00, exactly 4 hours, a zero-length slot, the ADMIN role, “24:00”. The only mutant killed (#8) was caught by the <code>formatTime(450)</code> test from lesson 0.3.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — properties and <code>requireAssertions</code>.</strong> The round-trip property from lesson 1.4 returns <code>true</code>/<code>false</code> and never calls <code>expect</code>. With <code>requireAssertions</code> switched on it fails even though the property holds:</p>
${ra(OUT['lab-req-prop'])}
<p>Fix: put an <code>expect</code> inside the property, as the reference solution does. fast-check treats a thrown assertion as a failed property, so shrinking and seeds still work.</p>
</div>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li>Write the rules of lesson 1.1 as sentences (“a slot may end exactly at 21:00”). Each sentence is a test name.</li>
<li>For every number in a rule — 07:00, 21:00, 30 minutes, 240 minutes, 14 days, 30 seats — test the value on it and one step either side, in the rule’s own unit.</li>
<li>For <code>needsApproval</code>, draw the 3 roles × 2 seat answers table on paper first.</li>
<li>Don’t forget the zero-length slot (<code>09:00–09:00</code>) and impossible times (<code>24:00</code>, <code>07:60</code>).</li>
<li>Run the script early. Every survivor is a test you forgot — add it, run again.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('javascript', CODE.bookingTest)}
${ma('javascript', CODE.timeTest)}
${ra(OUT['lab-full'])}
${ra(OUT['lab-mut-strong'])}
<p>Forty tests in about a tenth of a second, eight of eight mutants killed. Notice the structure: one <code>describe</code> per function in source order, happy path before violations, tables for every boundary, a decision table with boundary seat values, invalid input with the exact error class, and one property.</p>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run test:unit</code> is green and contains no <code>.only</code> or <code>.skip</code>.</li>
<li><code>node scripts/dot-bien.mjs</code> prints <code>8/8 mutants killed</code>.</li>
<li><code>git diff src/rules/booking.js src/rules/time.js</code> is empty — the script restored everything.</li>
<li>The report tree reads like the rules list.</li>
<li>Commit with a clear message, e.g. <code>test: rules suite for LabFlow Lite (8/8 mutants)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mutation testing</span><span class="v">Evaluating a test suite by planting small bugs (mutants) and checking that the suite fails.</span></div>
  <div class="kv"><span class="k">mutant · killed · survived</span><span class="v">A planted change · the suite went red · the suite stayed green (a gap).</span></div>
  <div class="kv"><span class="k">exit code</span><span class="v">0 = all tests passed, 1 = something failed — how the script knows.</span></div>
  <div class="kv"><span class="k">teaching to the test</span><span class="v">Writing tests only to satisfy a known checker instead of the real rules.</span></div>
  <div class="kv"><span class="k">rubric</span><span class="v">A scoring table that says exactly what earns each point.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A green suite can still miss most bugs — the weak attempt was green and killed 1 of 8.</li>
<li>Mutation testing measures whether tests <em>notice</em> wrong code, not just whether lines ran.</li>
<li>Survivors point exactly at missing boundaries, roles and invalid inputs.</li>
<li>Rule-first, boundary values, decision tables and one property reached 8/8 with 40 fast tests.</li>
<li>With <code>requireAssertions</code>, put an <code>expect</code> inside properties.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Lab 1</span>
<h2>Test luật LabFlow Lite và diệt 8 đột biến</h2>
<p class="lead">60–90 phút. Bạn viết trọn bộ unit test cho luật của LabFlow Lite. Rồi một script chấm nó một cách khách quan: nó cài tám con bug thực tế, từng con một, và kiểm xem bộ test của bạn có đỏ với từng con không. Đây là <strong>kiểm thử đột biến (mutation testing)</strong> làm bằng tay — Chương 8 sẽ giới thiệu công cụ chuyên nghiệp (Stryker).</p>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án <code>labflow-lite</code> từ bài 0.3–1.4, với <code>src/rules/time.js</code> và <code>src/rules/booking.js</code> đúng như ở bài 0.3 và 1.1. Đừng sửa chúng — script tìm đúng từng dòng.</li>
<li>Cài fast-check nếu chưa có: <code>npm install --save-dev fast-check@4</code>.</li>
<li>Thêm một script chỉ chạy bộ test thật — <code>demo/</code> giữ những test cố ý đỏ, nên <code>npm test</code> (chạy mọi thư mục) không phải lệnh để phán xanh/đỏ: trong <code>package.json</code>, <code>"test:unit": "vitest run src/"</code>. Từ giờ “bộ test xanh” nghĩa là <code>npm run test:unit</code> xanh.</li>
<li>Bật <code>requireAssertions</code> trong <code>vitest.config.js</code> (thuộc điểm vệ sinh):
${ma('javascript', CODE.config)}</li>
<li>Tạo <code>scripts/dot-bien.mjs</code> ("đột biến" = mutant):
${ma('javascript', CODE.dotBien)}</li>
</ol>
<p>Cách nó làm việc: với mỗi đột biến, nó thay đúng một đoạn của một dòng, chạy <code>npx vitest run src/</code>, ghi <em>killed</em> (bị diệt) nếu lần chạy hỏng (mã thoát ≠ 0) hoặc <em>survived</em> (sống sót) nếu đạt, rồi trả file gốc về trong khối <code>finally</code> để code không bao giờ bị bỏ lại trong trạng thái hỏng. <code>shell: process.platform === 'win32'</code> là cần thiết vì trên Windows <code>npx</code> là một file <code>.cmd</code>. Lưu ý nó chỉ chạy <code>src/</code> — các thí nghiệm cố ý viết sai trong <code>demo/</code> không bị tính.</p>

<h3>Nhiệm vụ</h3>
<p>Viết <code>src/rules/booking.test.js</code> và mở rộng <code>src/rules/time.test.js</code> sao cho:</p>
<ol>
<li><code>npm run test:unit</code> xanh trên code thật;</li>
<li><code>node scripts/dot-bien.mjs</code> in ra <strong>8/8 mutants killed</strong>.</li>
</ol>
<p>Làm theo luật trước: viết các luật thành câu, biến mỗi câu thành tên test, dùng kỹ thuật bài 1.4 để chọn giá trị, rồi mới chạy script. Đọc danh sách đột biến trước rồi viết mỗi con một test là "học tủ" — đạt 8/8 nhưng vẫn bỏ lọt con bug tiếp theo.</p>

<h3>Lần thử đầu thường trông thế nào</h3>
<p>Một lần chạy thật với bộ test yếu — hai test đường suôn sẻ cho <code>checkSlot</code> cộng ba test thời gian ở bài 0.3:</p>
${ma('javascript', CODE.weakTest)}
${ra(OUT['lab-weak-run'])}
${ra(OUT['lab-mut-weak'])}
<p>Năm test, đều xanh — vậy mà bảy trên tám con bug sẽ tới tay người dùng. Đọc mỗi dòng <em>SURVIVED</em> như "cái test mình quên": đặt trước 14 ngày, đúng 30 chỗ, khung kết thúc lúc 21:00, đúng 4 giờ, khung dài 0 phút, vai trò ADMIN, "24:00". Con đột biến duy nhất bị diệt (#8) là nhờ test <code>formatTime(450)</code> ở bài 0.3.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — thuộc tính và <code>requireAssertions</code>.</strong> Thuộc tính khứ hồi ở bài 1.4 trả về <code>true</code>/<code>false</code> và không gọi <code>expect</code> lần nào. Khi bật <code>requireAssertions</code>, nó hỏng dù thuộc tính vẫn đúng:</p>
${ra(OUT['lab-req-prop'])}
<p>Cách sửa: đặt một <code>expect</code> bên trong thuộc tính, như lời giải tham khảo. fast-check coi một khẳng định bị ném lỗi là thuộc tính hỏng, nên thu nhỏ và seed vẫn hoạt động.</p>
</div>

<h3>Thang chấm (10 điểm, đạt từ 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Viết các luật của bài 1.1 thành câu ("một khung được phép kết thúc đúng lúc 21:00"). Mỗi câu là một tên test.</li>
<li>Với mỗi con số trong luật — 07:00, 21:00, 30 phút, 240 phút, 14 ngày, 30 chỗ — test chính giá trị đó và một bước hai bên, theo đúng đơn vị của luật.</li>
<li>Với <code>needsApproval</code>, vẽ bảng 3 vai trò × 2 câu trả lời về số chỗ ra giấy trước.</li>
<li>Đừng quên khung dài 0 phút (<code>09:00–09:00</code>) và giờ vô lý (<code>24:00</code>, <code>07:60</code>).</li>
<li>Chạy script sớm. Mỗi con sống sót là một test bạn quên — thêm vào, chạy lại.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã tự làm)</h3>
${ma('javascript', CODE.bookingTest)}
${ma('javascript', CODE.timeTest)}
${ra(OUT['lab-full'])}
${ra(OUT['lab-mut-strong'])}
<p>Bốn mươi test trong khoảng một phần mười giây, diệt tám trên tám đột biến. Để ý cấu trúc: mỗi hàm một <code>describe</code> theo thứ tự file nguồn, đường suôn sẻ trước các trường hợp phạm luật, bảng cho mọi giá trị biên, bảng quyết định với số chỗ tại biên, đầu vào không hợp lệ kèm đúng lớp lỗi, và một thuộc tính.</p>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run test:unit</code> xanh và không còn <code>.only</code> hay <code>.skip</code>.</li>
<li><code>node scripts/dot-bien.mjs</code> in ra <code>8/8 mutants killed</code>.</li>
<li><code>git diff src/rules/booking.js src/rules/time.js</code> trống — script đã trả mọi thứ về như cũ.</li>
<li>Cây báo cáo đọc lên như danh sách luật.</li>
<li>Commit với message rõ ràng, vd <code>test: rules suite for LabFlow Lite (8/8 mutants)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mutation testing (kiểm thử đột biến)</span><span class="v">Đánh giá bộ test bằng cách cài những bug nhỏ (đột biến) và kiểm bộ test có hỏng không.</span></div>
  <div class="kv"><span class="k">mutant · killed · survived (đột biến · bị diệt · sống sót)</span><span class="v">Một thay đổi được cài · bộ test đỏ · bộ test vẫn xanh (một lỗ hổng).</span></div>
  <div class="kv"><span class="k">exit code (mã thoát)</span><span class="v">0 = mọi test đạt, 1 = có gì đó hỏng — cách script biết kết quả.</span></div>
  <div class="kv"><span class="k">teaching to the test (học tủ)</span><span class="v">Viết test chỉ để làm vừa lòng một bộ chấm đã biết trước thay vì theo luật thật.</span></div>
  <div class="kv"><span class="k">rubric (thang chấm)</span><span class="v">Bảng chấm điểm nói rõ làm gì thì được mỗi điểm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một bộ test xanh vẫn có thể bỏ lọt phần lớn bug — lần thử yếu xanh mà chỉ diệt 1/8.</li>
<li>Kiểm thử đột biến đo xem test có <em>nhận ra</em> code sai không, không chỉ xem dòng nào đã chạy.</li>
<li>Con đột biến sống sót chỉ thẳng vào giá trị biên, vai trò và đầu vào không hợp lệ còn thiếu.</li>
<li>Theo luật trước, giá trị biên, bảng quyết định và một thuộc tính đạt 8/8 với 40 test nhanh.</li>
<li>Khi bật <code>requireAssertions</code>, hãy đặt <code>expect</code> bên trong thuộc tính.</li>
</ul>
</div>
`,
};
