/**
 * Testing · Chương 1 · 1.4 — Test hàm thuần và các trường hợp biên (EP, BVA, bảng quyết định, property-based). Slug giữ từ khung: tst-1-4-ham-thuan.
 * Code/output từ ./_ma.mjs (chạy thật; bug cài tạm: < 14, Math.round, >= MAX_MINUTES, MAX_MINUTES + 30).
 */
import G from '../giang/tst-01-4.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const PROP_BUG_GON = OUT['14-th-prop-bug'].split('\n').filter((l) => /Property failed|Counterexample|×|FAIL/.test(l)).join('\n');

const BANG_SLOT_EN = `<table>
<thead><tr><th>Rule</th><th>Valid side of the boundary</th><th>Invalid side</th><th>Expected</th></tr></thead>
<tbody>
<tr><td>30-minute grid (BR-04)</td><td>08:00, 08:30</td><td>08:15 as start · 09:10 as end</td><td><code>OFF_GRID</code></td></tr>
<tr><td>End after start</td><td>08:00–08:30 (30 min)</td><td>09:00–09:00 (0 min) · 10:00–09:00</td><td><code>END_BEFORE_START</code></td></tr>
<tr><td>Opening hours (BR-04)</td><td>07:00–08:00 · 20:00–21:00</td><td>06:30–08:00 · 20:00–21:30</td><td><code>OUTSIDE_HOURS</code></td></tr>
<tr><td>At most 4 hours (Lite-1)</td><td>08:00–12:00 (240)</td><td>08:00–12:30 (270)</td><td><code>TOO_LONG</code></td></tr>
</tbody>
</table>`;
const BANG_SLOT_VI = `<table>
<thead><tr><th>Luật</th><th>Phía hợp lệ của biên</th><th>Phía không hợp lệ</th><th>Mong đợi</th></tr></thead>
<tbody>
<tr><td>Lưới 30 phút (BR-04)</td><td>08:00, 08:30</td><td>08:15 làm giờ bắt đầu · 09:10 làm giờ kết thúc</td><td><code>OFF_GRID</code></td></tr>
<tr><td>Kết thúc sau bắt đầu</td><td>08:00–08:30 (30 phút)</td><td>09:00–09:00 (0 phút) · 10:00–09:00</td><td><code>END_BEFORE_START</code></td></tr>
<tr><td>Giờ mở cửa (BR-04)</td><td>07:00–08:00 · 20:00–21:00</td><td>06:30–08:00 · 20:00–21:30</td><td><code>OUTSIDE_HOURS</code></td></tr>
<tr><td>Tối đa 4 giờ (Lite-1)</td><td>08:00–12:00 (240)</td><td>08:00–12:30 (270)</td><td><code>TOO_LONG</code></td></tr>
</tbody>
</table>`;
const BANG_DT = `<table>
<thead><tr><th>Rule #</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr></thead>
<tbody>
<tr><td><strong>C1</strong> role</td><td>STUDENT</td><td>STUDENT</td><td>LECTURER</td><td>LECTURER</td><td>ADMIN</td><td>ADMIN</td></tr>
<tr><td><strong>C2</strong> seats &gt; 30?</td><td>no (30)</td><td>yes (31)</td><td>no (30)</td><td>yes (31)</td><td>no (30)</td><td>yes (31)</td></tr>
<tr><td><strong>A</strong> needs approval</td><td>✗</td><td>✓</td><td>✗</td><td>✗</td><td>✗</td><td>✗</td></tr>
</tbody>
</table>`;

const LINKS_EN = [
  lienKet({ bai: 'swt301-blackbox-ep-bva', title: 'Also in SWT301 — lesson 4.2: Equivalence partitioning', sub: 'Same: valid and invalid partitions, one representative per partition, EP coverage. Different: SWT301 designs the partitions on paper and in exam tables; here each partition is a row of it.each that runs.', cta: 'OPEN SWT301 LESSON →' }),
  lienKet({ bai: 'swt301-blackbox-bva-template', title: 'Also in SWT301 — lesson 4.3: Boundary value analysis and the PE condition template', sub: 'Same: test on each boundary and next to it; BVA catches the off-by-one that EP misses (SWT301 shows it in Java). Different: here the planted &lt; 14 is caught by a Vitest table, and the grid unit (30 min) decides what “next to” means.', cta: 'OPEN SWT301 LESSON →' }),
  lienKet({ bai: 'swt301-blackbox-decision-state', title: 'Also in SWT301 — lesson 4.4: Decision table testing', sub: 'Same: conditions × actions, one rule per column, collapsing the table. Different: here each column is a row of it.each over needsApproval, with boundary seat values (30/31) in every column.', cta: 'OPEN SWT301 LESSON →' }),
].join('\n');
const LINKS_VI = [
  lienKet({ bai: 'swt301-blackbox-ep-bva', title: 'Đã gặp ở SWT301 — bài 4.2: Phân vùng tương đương (EP)', sub: 'Giống: phân vùng hợp lệ và không hợp lệ, mỗi vùng một đại diện, độ phủ EP. Khác: SWT301 thiết kế phân vùng trên giấy và trong bảng của đề thi; ở đây mỗi phân vùng là một dòng it.each chạy được.', cta: 'MỞ BÀI SWT301 →' }),
  lienKet({ bai: 'swt301-blackbox-bva-template', title: 'Đã gặp ở SWT301 — bài 4.3: Phân tích giá trị biên và bảng condition template của đề PE', sub: 'Giống: test trên biên và sát biên; BVA bắt được lỗi lệch một đơn vị mà EP bỏ lọt (SWT301 minh hoạ bằng Java). Khác: ở đây lỗi &lt; 14 cài sẵn bị một bảng Vitest bắt, và đơn vị lưới (30 phút) quyết định thế nào là "sát biên".', cta: 'MỞ BÀI SWT301 →' }),
  lienKet({ bai: 'swt301-blackbox-decision-state', title: 'Đã gặp ở SWT301 — bài 4.4: Kiểm thử bảng quyết định', sub: 'Giống: điều kiện × hành động, mỗi cột một luật, rút gọn bảng. Khác: ở đây mỗi cột là một dòng it.each cho needsApproval, và cột nào cũng dùng số chỗ ngay tại biên (30/31).', cta: 'MỞ BÀI SWT301 →' }),
].join('\n');

export default {
  title: '1.4 — Testing pure functions: partitions, boundaries, decision tables, properties|||1.4 — Test hàm thuần: phân vùng, giá trị biên, bảng quyết định, thuộc tính',
  slug: 'tst-1-4-ham-thuan',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chọn giá trị nào để test: hàm thuần, phân vùng tương đương (kể cả đầu vào không hợp lệ), giá trị biên bắt lỗi < 14 thật, biên trên lưới 30 phút, bảng quyết định BR-06 thành it.each, test theo thuộc tính với fast-check tìm và thu nhỏ phản ví dụ — đúng kỹ thuật SWT301 Chương 4, giờ chạy được.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Testing pure functions: partitions, boundaries, decision tables, properties</h2>
<p class="lead">You can write a test. The hard part is choosing <em>which</em> tests: an infinite number of inputs, a handful of tests. This lesson gives you four systematic techniques — the same black-box techniques as SWT301 Chapter 4 — and shows each one catching a planted bug in LabFlow Lite.</p>

<h3>Why pure functions first</h3>
<p>A <strong>pure function</strong> returns the same output for the same input and changes nothing outside itself: no clock, no random numbers, no database, no network. All of LabFlow Lite’s rules are pure, so a test is just “call with a value, compare”. That is a design choice: <code>isWithinBookingWindow</code> receives <em>days ahead</em> as a number instead of reading today’s date. Code that reads the clock or a database (impure) is tested in Chapters 2–4 with fake clocks, test doubles and throwaway databases. The more of your logic you keep pure, the more of it you can test this cheaply.</p>

<h3>Equivalence partitioning: one value per class</h3>
<p>BR-05 (“at most 14 days ahead”) divides every possible input into classes that the code should treat the same way:</p>
<ul>
<li>below 0 — invalid (a booking in the past);</li>
<li>0 to 14 — valid;</li>
<li>above 14 — invalid;</li>
<li>not an integer at all — invalid (1.5, <code>NaN</code>, the string <code>'3'</code>, <code>null</code>).</li>
</ul>
<p>Because every value in a partition behaves the same, one representative per partition is enough — four partitions, at least four tests. That alone is far better than “try a few numbers”, but it misses the most common bug of all.</p>

<h3>Boundary value analysis: where off-by-one bugs live</h3>
<p>Mistakes like <code>&lt;</code> instead of <code>&lt;=</code>, or counting from 1 instead of 0, change behaviour <em>only at the edge</em> of a partition. So for each boundary test the value on it and one step either side: <strong>−1, 0, 1</strong> around the lower boundary, <strong>13, 14, 15</strong> around the upper one. Written as a table, together with the invalid-input partition and the decision table of BR-06:</p>
${ma('javascript', CODE.bien)}
${ra(OUT['14-bien'])}
<p>Now plant the classic bug — <code>daysAhead &lt; MAX_DAYS_AHEAD</code> — and run only the BR-05 tests:</p>
${ra(OUT['14-bien-bug'])}
<p>Exactly one row is red: <em>14 days ahead → true</em>. Every other row, and any test with a “typical” value like 7, passes with both the right and the wrong code. That is the whole argument for boundary values in one output.</p>
<div class="callout"><p><strong>Why the non-integer rows matter.</strong> In JavaScript <code>'3' &lt;= 14</code> is <code>true</code>: the string is converted to a number. Without the <code>Number.isInteger</code> guard, a value straight from a form field would sail through the check. The four rows <code>1.5</code>, <code>NaN</code>, <code>'3'</code>, <code>null</code> prove the guard is there — and will notice if someone “simplifies” it away.</p></div>

<h3>Boundaries in the right unit: checkSlot</h3>
<p>Apply the same thinking rule by rule. One detail matters: LabFlow Lite works on a 30-minute grid, so “one step outside” a boundary is <em>30 minutes</em> away, not 1 minute. 240 minutes is allowed, the next possible length is 270; 21:00 is the last valid end, the next is 21:30.</p>
${BANG_SLOT_EN}

<h3>Decision tables: combinations of conditions</h3>
<p>BR-06 depends on two conditions at once — the role, and whether the booking has more than 30 seats. A decision table lists every combination and the expected action:</p>
${BANG_DT}
<p>Only column 2 — a student with more than 30 seats — needs approval. Two habits make the table stronger: use <strong>boundary values</strong> for each numeric condition (30 and 31, not 5 and 100), and turn every column into one row of an <code>it.each</code>, as in the <code>needsApproval</code> block above. When the business adds a role, the table grows by two rows and the pull request shows exactly which combinations are covered.</p>

<h3>Property-based testing: let the machine choose the inputs</h3>
<p>Examples test the values you thought of. A <strong>property</strong> states something that must be true for <em>every</em> valid input, and a library generates the inputs. With fast-check (<code>npm install --save-dev fast-check@4</code>):</p>
${ma('javascript', CODE.thuocTinh)}
${ra(OUT['14-prop'])}
<p>The property: for every minute from 0 to 1439, formatting it and parsing it back gives the same minute — a <em>round trip</em>. fast-check tries 100 random values by default. Now plant <code>Math.round</code> instead of <code>Math.floor</code> in <code>formatTime</code>:</p>
${ra(OUT['14-prop-bug'])}
<p>Read the three important lines: it failed after 8 random tests; the counterexample is <code>[390]</code> (390 / 60 = 6.5, rounded to 7, so it is formatted as <code>'07:30'</code> and parsed back as 450); and the <strong>seed</strong> lets you replay this exact run with <code>fc.assert(…, { seed: 981865028, path: "7:4" })</code>. Because the inputs are random, another run may report a different value — one of our runs reported <code>[30]</code> (<code>'01:30'</code>). After a failure fast-check <em>shrinks</em>: it retries simpler inputs that still fail, so what you see is small and easy to debug.</p>
<p>Properties do not replace examples; they guard the space between them. Good first properties: round trips (format/parse, encode/decode), invariants (“a valid slot never exceeds 240 minutes”), and “never throws for any valid input”.</p>

<h3>Which technique for which rule?</h3>
<table>
<thead><tr><th>Technique</th><th>Use it for</th><th>LabFlow Lite example</th></tr></thead>
<tbody>
<tr><td>Equivalence partitioning</td><td>ranges and categories</td><td>days ahead: &lt; 0 · 0–14 · &gt; 14 · not an integer</td></tr>
<tr><td>Boundary values</td><td>every <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code>, limit</td><td>−1 0 1 13 14 15 · 30/31 seats · 240/270 minutes</td></tr>
<tr><td>Decision table</td><td>combinations of conditions</td><td>role × seats &gt; 30</td></tr>
<tr><td>Property-based</td><td>rules true for all inputs</td><td>format ↔ parse for every minute; never more than 240 minutes</td></tr>
</tbody>
</table>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Design the boundary rows for Lite-1 (“at most 240 minutes”) on the 30-minute grid: the shortest valid slot, exactly 240, one grid step above, and a zero-length slot.</li>
<li>Write them as one <code>it.each</code> of objects <code>{ start, end, expected }</code> and run it.</li>
<li>Plant <code>e - s &gt;= MAX_MINUTES</code> in <code>checkSlot</code> and run again. How many rows turn red?</li>
<li>Extra: write a property “<code>checkSlot</code> never accepts a slot longer than <code>MAX_MINUTES</code>” over all grid times, then plant <code>e - s &gt; MAX_MINUTES + 30</code> and see what fast-check finds.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th14)}
${ra(OUT['14-th'])}
<p>With <code>&gt;=</code> planted:</p>
${ra(OUT['14-th-bug'])}
<p>The property:</p>
${ma('javascript', CODE.th14Prop)}
${ra(OUT['14-th-prop'])}
<p>With <code>MAX_MINUTES + 30</code> planted, fast-check found a 270-minute slot that was accepted (shortened):</p>
${ra(PROP_BUG_GON)}
<p><strong>Done when:</strong> your four rows pass on the real code, and the planted <code>&gt;=</code> turns <em>only</em> the <code>08:00–12:00</code> row red (the code now answers <code>TOO_LONG</code> for exactly 240 minutes). For the extra: the property passes on the real code and reports a counterexample like <code>["16:30","21:00"]</code> (270 minutes) on the planted one.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pure function</span><span class="v">Same input → same output, no side effects; the easiest code to test.</span></div>
  <div class="kv"><span class="k">equivalence partitioning (EP)</span><span class="v">Splitting inputs into classes the code treats alike; one value per class.</span></div>
  <div class="kv"><span class="k">boundary value analysis (BVA)</span><span class="v">Testing on each boundary and one step either side.</span></div>
  <div class="kv"><span class="k">off-by-one error</span><span class="v">A mistake of exactly one step at a boundary, e.g. <code>&lt;</code> instead of <code>&lt;=</code>.</span></div>
  <div class="kv"><span class="k">decision table</span><span class="v">All combinations of conditions with the expected action for each.</span></div>
  <div class="kv"><span class="k">property-based testing</span><span class="v">Stating what is true for all inputs and letting a library generate them.</span></div>
  <div class="kv"><span class="k">counterexample · shrinking · seed</span><span class="v">An input that breaks the property · simplifying it · the number that replays the run.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 From a rule to test values</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Rule</div><div class="lz-d">“at most 14 days in advance”</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Classes</div><div class="lz-d">past · 0–14 · more than 14 · not a whole number</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Boundaries</div><div class="lz-d">−1, 0, 14, 15</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Table</div><div class="lz-d">one it.each row per value</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Properties</div><div class="lz-d">fast-check tries hundreds more</div></div>
</div>
<div class="pitfall"><strong>Testing only the middle.</strong> A test with 7 days passes whether the code says <code>&lt;= 14</code> or <code>&lt; 14</code>. Off-by-one bugs live on the edges: always test the last valid value and the first invalid one.</div>
<h3>📌 Summary</h3>
<ul>
<li>Keep rules pure: a value in, a value out — testable in milliseconds.</li>
<li>Equivalence partitioning finds the classes of inputs, invalid ones included; one value per class.</li>
<li>Boundary values find the off-by-one bugs; on the boundary and one step either side, in the unit the rule uses.</li>
<li>Decision tables cover combinations; each column becomes an <code>it.each</code> row with boundary values.</li>
<li>Properties state what is always true; fast-check finds, shrinks and lets you replay counterexamples.</li>
<li>These are SWT301’s black-box techniques — here they run on every save.</li>
</ul>
${LINKS_EN}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Test hàm thuần: phân vùng, giá trị biên, bảng quyết định, thuộc tính</h2>
<p class="lead">Bạn đã biết viết một test. Phần khó là chọn <em>test nào</em>: đầu vào thì vô hạn, test thì chỉ một nhúm. Bài này cho bạn bốn kỹ thuật có hệ thống — đúng các kỹ thuật hộp đen của SWT301 Chương 4 — và cho thấy từng kỹ thuật bắt một con bug cài sẵn trong LabFlow Lite.</p>

<h3>Vì sao bắt đầu từ hàm thuần</h3>
<p><strong>Hàm thuần (pure function)</strong> trả về cùng đầu ra cho cùng đầu vào và không thay đổi gì bên ngoài: không đồng hồ, không số ngẫu nhiên, không cơ sở dữ liệu, không mạng. Mọi luật của LabFlow Lite đều thuần, nên một test chỉ là "gọi với một giá trị, rồi so". Đó là một lựa chọn thiết kế: <code>isWithinBookingWindow</code> nhận <em>số ngày tới</em> là một con số thay vì tự đọc ngày hôm nay. Code đọc đồng hồ hay cơ sở dữ liệu (không thuần) sẽ được test ở Chương 2–4 bằng đồng hồ giả, test double và cơ sở dữ liệu dùng một lần. Giữ được càng nhiều logic thuần, bạn càng test được nhiều phần với chi phí rẻ như thế này.</p>

<h3>Phân vùng tương đương: mỗi lớp một giá trị</h3>
<p>BR-05 ("đặt trước tối đa 14 ngày") chia mọi đầu vào có thể thành các lớp mà code phải đối xử như nhau:</p>
<ul>
<li>dưới 0 — không hợp lệ (đặt cho ngày đã qua);</li>
<li>từ 0 tới 14 — hợp lệ;</li>
<li>trên 14 — không hợp lệ;</li>
<li>hoàn toàn không phải số nguyên — không hợp lệ (1.5, <code>NaN</code>, chuỗi <code>'3'</code>, <code>null</code>).</li>
</ul>
<p>Vì mọi giá trị trong một phân vùng cư xử như nhau, mỗi phân vùng một đại diện là đủ — bốn phân vùng, ít nhất bốn test. Thế đã tốt hơn rất nhiều so với "thử vài con số", nhưng vẫn bỏ lọt loại bug phổ biến nhất.</p>

<h3>Phân tích giá trị biên: nơi lỗi lệch một đơn vị trú ngụ</h3>
<p>Những sai lầm như <code>&lt;</code> thay vì <code>&lt;=</code>, hay đếm từ 1 thay vì từ 0, chỉ thay đổi hành vi <em>ngay tại mép</em> của một phân vùng. Vì vậy với mỗi biên, hãy test giá trị nằm trên biên và một bước ở hai bên: <strong>−1, 0, 1</strong> quanh biên dưới, <strong>13, 14, 15</strong> quanh biên trên. Viết thành bảng, cùng với phân vùng đầu vào không hợp lệ và bảng quyết định của BR-06:</p>
${ma('javascript', CODE.bien)}
${ra(OUT['14-bien'])}
<p>Giờ cài con bug kinh điển — <code>daysAhead &lt; MAX_DAYS_AHEAD</code> — và chỉ chạy các test của BR-05:</p>
${ra(OUT['14-bien-bug'])}
<p>Đúng một dòng đỏ: <em>14 days ahead → true</em>. Mọi dòng khác, và mọi test dùng giá trị "bình thường" như 7, đều đạt với cả code đúng lẫn code sai. Toàn bộ lý lẽ cho giá trị biên nằm gọn trong một output.</p>
<div class="callout"><p><strong>Vì sao các dòng không phải số nguyên quan trọng.</strong> Trong JavaScript <code>'3' &lt;= 14</code> là <code>true</code>: chuỗi bị chuyển thành số. Thiếu lớp kiểm <code>Number.isInteger</code>, một giá trị lấy thẳng từ ô nhập liệu sẽ lọt qua dễ dàng. Bốn dòng <code>1.5</code>, <code>NaN</code>, <code>'3'</code>, <code>null</code> chứng minh lớp kiểm đó có mặt — và sẽ phát hiện nếu ai đó "đơn giản hoá" bỏ nó đi.</p></div>

<h3>Biên theo đúng đơn vị: checkSlot</h3>
<p>Áp cùng cách nghĩ cho từng luật. Một chi tiết quan trọng: LabFlow Lite làm việc trên lưới 30 phút, nên "một bước ra ngoài" biên là cách <em>30 phút</em>, không phải 1 phút. 240 phút được phép, độ dài kế tiếp có thể có là 270; 21:00 là giờ kết thúc hợp lệ cuối cùng, kế tiếp là 21:30.</p>
${BANG_SLOT_VI}

<h3>Bảng quyết định: tổ hợp điều kiện</h3>
<p>BR-06 phụ thuộc hai điều kiện cùng lúc — vai trò, và lượt đặt có trên 30 chỗ không. Bảng quyết định liệt kê mọi tổ hợp cùng hành động mong đợi:</p>
${BANG_DT}
<p>Chỉ cột 2 — sinh viên trên 30 chỗ — cần duyệt. Hai thói quen làm bảng mạnh hơn: dùng <strong>giá trị biên</strong> cho mỗi điều kiện dạng số (30 và 31, đừng dùng 5 và 100), và biến mỗi cột thành một dòng của <code>it.each</code>, như khối <code>needsApproval</code> ở trên. Khi nghiệp vụ thêm một vai trò, bảng dài thêm hai dòng và pull request cho thấy rõ tổ hợp nào đã được phủ.</p>

<h3>Test theo thuộc tính: để máy chọn đầu vào</h3>
<p>Ví dụ chỉ test những giá trị bạn nghĩ ra. Một <strong>thuộc tính (property)</strong> phát biểu điều phải đúng với <em>mọi</em> đầu vào hợp lệ, và một thư viện sinh đầu vào giúp bạn. Với fast-check (<code>npm install --save-dev fast-check@4</code>):</p>
${ma('javascript', CODE.thuocTinh)}
${ra(OUT['14-prop'])}
<p>Thuộc tính: với mọi phút từ 0 tới 1439, định dạng rồi đọc ngược lại thì ra đúng phút đó — một <em>phép khứ hồi (round trip)</em>. Mặc định fast-check thử 100 giá trị ngẫu nhiên. Giờ cài <code>Math.round</code> thay cho <code>Math.floor</code> trong <code>formatTime</code>:</p>
${ra(OUT['14-prop-bug'])}
<p>Đọc ba dòng quan trọng: nó hỏng sau 8 lần thử ngẫu nhiên; phản ví dụ là <code>[390]</code> (390 / 60 = 6,5, làm tròn thành 7, nên được định dạng thành <code>'07:30'</code> và đọc ngược lại thành 450); và <strong>seed</strong> giúp chạy lại đúng lần này bằng <code>fc.assert(…, { seed: 981865028, path: "7:4" })</code>. Vì đầu vào là ngẫu nhiên, lần chạy khác có thể báo giá trị khác — một lần chạy của chúng tôi báo <code>[30]</code> (<code>'01:30'</code>). Sau khi gặp lỗi, fast-check <em>thu nhỏ (shrink)</em>: nó thử lại các đầu vào đơn giản hơn mà vẫn hỏng, nên thứ bạn thấy nhỏ gọn, dễ gỡ lỗi.</p>
<p>Thuộc tính không thay thế ví dụ; chúng canh khoảng trống giữa các ví dụ. Những thuộc tính đầu tiên nên thử: phép khứ hồi (format/parse, encode/decode), bất biến ("khung hợp lệ không bao giờ quá 240 phút"), và "không bao giờ ném lỗi với đầu vào hợp lệ".</p>

<h3>Kỹ thuật nào cho luật nào?</h3>
<table>
<thead><tr><th>Kỹ thuật</th><th>Dùng cho</th><th>Ví dụ LabFlow Lite</th></tr></thead>
<tbody>
<tr><td>Phân vùng tương đương</td><td>khoảng giá trị và loại</td><td>số ngày tới: &lt; 0 · 0–14 · &gt; 14 · không nguyên</td></tr>
<tr><td>Giá trị biên</td><td>mọi <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code>, giới hạn</td><td>−1 0 1 13 14 15 · 30/31 chỗ · 240/270 phút</td></tr>
<tr><td>Bảng quyết định</td><td>tổ hợp điều kiện</td><td>vai trò × trên 30 chỗ</td></tr>
<tr><td>Theo thuộc tính</td><td>luật đúng với mọi đầu vào</td><td>format ↔ parse cho mọi phút; không bao giờ quá 240 phút</td></tr>
</tbody>
</table>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Thiết kế các dòng biên cho Lite-1 ("tối đa 240 phút") trên lưới 30 phút: khung hợp lệ ngắn nhất, đúng 240, trên một bước lưới, và khung dài 0 phút.</li>
<li>Viết thành một <code>it.each</code> gồm các object <code>{ start, end, expected }</code> rồi chạy.</li>
<li>Cài <code>e - s &gt;= MAX_MINUTES</code> vào <code>checkSlot</code> rồi chạy lại. Bao nhiêu dòng chuyển đỏ?</li>
<li>Làm thêm: viết thuộc tính "<code>checkSlot</code> không bao giờ chấp nhận khung dài hơn <code>MAX_MINUTES</code>" trên mọi mốc giờ của lưới, rồi cài <code>e - s &gt; MAX_MINUTES + 30</code> và xem fast-check tìm ra gì.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th14)}
${ra(OUT['14-th'])}
<p>Khi cài <code>&gt;=</code>:</p>
${ra(OUT['14-th-bug'])}
<p>Thuộc tính:</p>
${ma('javascript', CODE.th14Prop)}
${ra(OUT['14-th-prop'])}
<p>Khi cài <code>MAX_MINUTES + 30</code>, fast-check tìm ra một khung 270 phút bị chấp nhận (đã rút gọn):</p>
${ra(PROP_BUG_GON)}
<p><strong>Đạt khi:</strong> bốn dòng của bạn đạt với code thật, và con bug <code>&gt;=</code> chỉ làm đỏ <em>đúng</em> dòng <code>08:00–12:00</code> (code giờ trả <code>TOO_LONG</code> cho đúng 240 phút). Phần làm thêm: thuộc tính đạt với code thật và báo một phản ví dụ kiểu <code>["16:30","21:00"]</code> (270 phút) với code bị cài lỗi.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pure function (hàm thuần)</span><span class="v">Cùng đầu vào → cùng đầu ra, không tác dụng phụ; loại code dễ test nhất.</span></div>
  <div class="kv"><span class="k">equivalence partitioning — EP (phân vùng tương đương)</span><span class="v">Chia đầu vào thành các lớp được code đối xử như nhau; mỗi lớp một giá trị.</span></div>
  <div class="kv"><span class="k">boundary value analysis — BVA (phân tích giá trị biên)</span><span class="v">Test trên mỗi biên và một bước ở hai bên.</span></div>
  <div class="kv"><span class="k">off-by-one error (lỗi lệch một đơn vị)</span><span class="v">Sai đúng một bước tại biên, vd <code>&lt;</code> thay vì <code>&lt;=</code>.</span></div>
  <div class="kv"><span class="k">decision table (bảng quyết định)</span><span class="v">Mọi tổ hợp điều kiện cùng hành động mong đợi cho từng tổ hợp.</span></div>
  <div class="kv"><span class="k">property-based testing (test theo thuộc tính)</span><span class="v">Phát biểu điều đúng với mọi đầu vào và để thư viện sinh đầu vào.</span></div>
  <div class="kv"><span class="k">counterexample · shrinking · seed (phản ví dụ · thu nhỏ · hạt giống)</span><span class="v">Đầu vào làm hỏng thuộc tính · làm nó đơn giản lại · con số giúp chạy lại đúng lần đó.</span></div>
</div>

<h3>🗺 Từ một luật tới các giá trị test</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Luật</div><div class="lz-d">“đặt trước tối đa 14 ngày”</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Lớp tương đương</div><div class="lz-d">quá khứ · 0–14 · hơn 14 · không phải số nguyên</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Biên</div><div class="lz-d">−1, 0, 14, 15</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Bảng</div><div class="lz-d">mỗi giá trị một dòng it.each</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Thuộc tính</div><div class="lz-d">fast-check thử thêm hàng trăm giá trị</div></div>
</div>
<div class="pitfall"><strong>Chỉ test ở giữa.</strong> Test với 7 ngày qua dù code viết <code>&lt;= 14</code> hay <code>&lt; 14</code>. Bug lệch một nằm ở biên: luôn test giá trị hợp lệ cuối cùng và giá trị không hợp lệ đầu tiên.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Giữ luật nghiệp vụ thuần: giá trị vào, giá trị ra — test được trong vài mili-giây.</li>
<li>Phân vùng tương đương tìm ra các lớp đầu vào, kể cả lớp không hợp lệ; mỗi lớp một giá trị.</li>
<li>Giá trị biên bắt lỗi lệch một đơn vị; test trên biên và một bước hai bên, theo đúng đơn vị của luật.</li>
<li>Bảng quyết định phủ các tổ hợp; mỗi cột thành một dòng <code>it.each</code> dùng giá trị biên.</li>
<li>Thuộc tính nói điều luôn đúng; fast-check tìm, thu nhỏ và cho chạy lại phản ví dụ.</li>
<li>Đây là các kỹ thuật hộp đen của SWT301 — ở đây chúng chạy mỗi lần bạn lưu file.</li>
</ul>
${LINKS_VI}
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-13-2-unit-tests" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 13.2 — Your first unit tests</span><span class="lc-sub">Vitest from zero: Arrange–Act–Assert, matchers, edge cases</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-13-2-unit-tests" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 13.2 — Unit test đầu tiên</span><span class="lc-sub">Vitest từ số 0: Arrange–Act–Assert, matcher, trường hợp biên</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
};
