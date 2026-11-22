/**
 * 1.5 — Lab Chương 1: năm lỗi nhỏ, mỗi lỗi một nhật ký (soạn 22/11/2026).
 * Output chạy THẬT /tmp/dbg-lab/ch1/1-5 (đỏ 5/5) và /tmp/dbg-lab/ch1/1-5-sua (bản sửa tham chiếu, xanh 5/5) · Node v26.8.1.
 * Bài không đưa đáp án code — chỉ gợi ý 3 tầng; bản sửa tham chiếu chỉ dùng để kiểm đề làm được.
 */
import { nguon } from '../_chung.mjs';

const MA = `<pre><code class="language-js">// phan-trang.js — page 1 is the FIRST page (the UI shows "Page 1, 2, 3…")
function trang(ds, soTrang, kichThuoc) {
  return ds.slice(soTrang * kichThuoc, soTrang * kichThuoc + kichThuoc);
}
module.exports = { trang };</code></pre>
<pre><code class="language-js">// xep-hang.js — sort scores from high to low
function xepDiem(ds) {
  return [...ds].sort().reverse();
}
module.exports = { xepDiem };</code></pre>
<pre><code class="language-js">// thanh-toan.js — prices in USD (with cents). Enough money when paid &gt;= cart total.
function duTien(daTra, giaCacMon) {
  const tong = giaCacMon.reduce((t, g) =&gt; t + g, 0);
  return daTra &gt;= tong;
}
module.exports = { duTien };</code></pre>
<pre><code class="language-js">// the-tag.js — tag a post; with no list given, start from the default tags
const MAC_DINH = ['moi'];
function ganThe(the, ds = MAC_DINH) {
  ds.push(the);
  return ds;
}
module.exports = { ganThe };</code></pre>
<pre><code class="language-js">// han-nop.js — assignment deadline: year, month (1–12 as people write it), day
function hanNop(nam, thang, ngay) {
  return new Date(nam, thang, ngay, 23, 59);
}
module.exports = { hanNop };</code></pre>`;

const TEST = `<pre><code class="language-js">// nam-loi.test.js — the five symptoms, written as tests
const test = require('node:test');
const assert = require('node:assert');
const { trang } = require('./phan-trang.js');
const { xepDiem } = require('./xep-hang.js');
const { duTien } = require('./thanh-toan.js');
const { ganThe } = require('./the-tag.js');
const { hanNop } = require('./han-nop.js');

test('lỗi 1 — trang 1 bắt đầu từ phần tử đầu tiên', () =&gt; {
  assert.deepStrictEqual(trang([1, 2, 3, 4, 5], 1, 2), [1, 2]);
});
test('lỗi 2 — xếp điểm từ cao xuống thấp', () =&gt; {
  assert.deepStrictEqual(xepDiem([9, 10, 7, 25]), [25, 10, 9, 7]);
});
test('lỗi 3 — trả 0.3 USD cho hai món 0.1 + 0.2 là đủ tiền', () =&gt; {
  assert.strictEqual(duTien(0.3, [0.1, 0.2]), true);
});
test('lỗi 4 — hai bài đăng không dùng chung danh sách thẻ', () =&gt; {
  ganThe('java');
  assert.deepStrictEqual(ganThe('react'), ['moi', 'react']);
});
test('lỗi 5 — hạn nộp 30/11/2026 là tháng 11', () =&gt; {
  const h = hanNop(2026, 11, 30);
  assert.deepStrictEqual([h.getFullYear(), h.getMonth() + 1, h.getDate()], [2026, 11, 30]);
});</code></pre>`;

const OUT_DO = `<div class="out">$ node --test nam-loi.test.js
✖ lỗi 1 — trang 1 bắt đầu từ phần tử đầu tiên (1.206625ms)
✖ lỗi 2 — xếp điểm từ cao xuống thấp (0.15875ms)
✖ lỗi 3 — trả 0.3 USD cho hai món 0.1 + 0.2 là đủ tiền (0.131333ms)
✖ lỗi 4 — hai bài đăng không dùng chung danh sách thẻ (0.139ms)
✖ lỗi 5 — hạn nộp 30/11/2026 là tháng 11 (0.746208ms)
ℹ tests 5
ℹ pass 0
ℹ fail 5
…
✖ lỗi 1 — trang 1 bắt đầu từ phần tử đầu tiên (1.206625ms)
    actual: [ 3, 4 ],
    expected: [ 1, 2 ],
…
✖ lỗi 2 — xếp điểm từ cao xuống thấp (0.15875ms)
    actual: [ 9, 7, 25, 10 ],
    expected: [ 25, 10, 9, 7 ],
…
✖ lỗi 3 — trả 0.3 USD cho hai món 0.1 + 0.2 là đủ tiền (0.131333ms)
  false !== true
…
✖ lỗi 4 — hai bài đăng không dùng chung danh sách thẻ (0.139ms)
    actual: [ 'moi', 'java', 'react' ],
    expected: [ 'moi', 'react' ],
…
✖ lỗi 5 — hạn nộp 30/11/2026 là tháng 11 (0.746208ms)
    actual: [ 2026, 12, 30 ],
    expected: [ 2026, 11, 30 ],</div>`;

const OUT_XANH = `<div class="out">$ node --test nam-loi.test.js        # after fixing all five (reference solution)
✔ lỗi 1 — trang 1 bắt đầu từ phần tử đầu tiên (0.681625ms)
✔ lỗi 2 — xếp điểm từ cao xuống thấp (0.086958ms)
✔ lỗi 3 — trả 0.3 USD cho hai món 0.1 + 0.2 là đủ tiền (0.088875ms)
✔ lỗi 4 — hai bài đăng không dùng chung danh sách thẻ (0.059208ms)
✔ lỗi 5 — hạn nộp 30/11/2026 là tháng 11 (0.671208ms)
ℹ tests 5
ℹ pass 5
ℹ fail 0</div>`;

const NGUON = [
  nguon('📗', 'MDN — Array.prototype.sort()', 'Vì sao sort() mặc định so sánh dạng chuỗi, và cách truyền hàm so sánh.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort'),
  nguon('📗', 'MDN — Date() constructor', 'monthIndex bắt đầu từ 0 (0 = tháng Một).', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date'),
  nguon('📗', 'MDN — Default parameters', 'Giá trị mặc định được tính mỗi lần gọi — nhưng một biến bên ngoài thì vẫn là cùng một đối tượng.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters'),
].join('\n');

export default {
  title: '1.5 — Lab: Five small bugs with a written debugging log|||1.5 — Lab: Năm lỗi nhỏ, mỗi lỗi một nhật ký gỡ lỗi',
  slug: 'dbg-1-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Năm lỗi JavaScript cài sẵn (phân trang lệch một, sort theo chuỗi, tiền số thực, mảng mặc định dùng chung, tháng đếm từ 0) với bộ test node:test đỏ 5/5 chạy thật; chỉ dùng phương pháp, không debugger; mỗi lỗi một nhật ký năm dòng và một test chặn; gợi ý ba tầng và rubric tự chấm.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lab</span>
<h2>Five bugs, five logs, five green tests — using only the method</h2>
<p class="lead">This lab puts the whole of Chapter 1 to work. You get five small JavaScript functions, each with a planted bug of a kind you will meet in real projects, and a test file where all five fail. No debugger allowed (that is Chapter 3) — only reproduce, isolate, hypothesise, test, fix, prevent, and a written log for each. Plan 60–90 minutes.</p>

<h3>Rules</h3>
<ul>
<li>Work in <code>~/dbg-lab/ch1/1-5</code>. Type the files; do not copy them.</li>
<li>For each bug, write the five-line debugging log <em>before</em> you change the function. The "Tried | Result" section must contain at least one experiment that is not the fix (a temporary print, a <code>node -e</code> one-liner, a smaller input).</li>
<li>One change per experiment; undo experiments that did not help.</li>
<li>Do not change the tests. If you think a test is wrong, write why in your log — that is a legitimate finding.</li>
</ul>

<h3>The code</h3>
${MA}

<h3>The tests — your five symptoms</h3>
${TEST}
<p>Run them: all five are red. The output has been trimmed to the key lines (<code>…</code> marks removed lines).</p>
${OUT_DO}
<p>Read the <code>actual</code> lines as evidence, not as noise. Each one already contains a strong clue: page 1 returned the <em>second</em> page; the sorted list has 25 and 10 in the middle; 0.3 was judged smaller than 0.1 + 0.2; the second post carries the first post's tag; November became December.</p>

<h3>Hints in three levels (open only when stuck 15 minutes)</h3>
<table>
<thead><tr><th>Bug</th><th>Level 1 — where to look</th><th>Level 2 — the experiment</th><th>Level 3 — the concept</th></tr></thead>
<tbody>
<tr><td>1</td><td>What index does page 1 start at?</td><td>Compute <code>1 * 2</code> by hand and compare with the first element's index</td><td>1-based pages vs 0-based arrays: off-by-one</td></tr>
<tr><td>2</td><td>What does <code>sort()</code> compare?</td><td><code>node -e "console.log(['9','10','7','25'].sort())"</code></td><td>Default sort compares as strings; pass a compare function</td></tr>
<tr><td>3</td><td>What is the total exactly?</td><td><code>node -e "console.log(0.1 + 0.2)"</code></td><td>Binary floating point cannot store 0.1 exactly; count money in integer cents</td></tr>
<tr><td>4</td><td>How many arrays exist?</td><td>Call <code>ganThe</code> twice and print <code>MAC_DINH</code></td><td>The default refers to one shared array; <code>push</code> mutates it</td></tr>
<tr><td>5</td><td>What does <code>new Date(2026, 11, 30)</code> mean?</td><td>Print <code>new Date(2026, 0, 1).getMonth()</code></td><td>JavaScript months are 0–11</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — fixing bug 3 with a tolerance you cannot explain.</strong> <code>Math.abs(a - b) &lt; 0.0001</code> makes this test green, but for money the professional fix is to store and compare <strong>integer cents</strong> (or a decimal type such as <code>BigDecimal</code> in Java, <code>NUMERIC</code> in PostgreSQL). Say which one you chose and why in the log.</p></div>

<h3>When you are done</h3>
<p>The reference solution changes one or two lines per bug. After it, the same test file is green:</p>
${OUT_XANH}

<h3>Self-assessment rubric</h3>
<table>
<thead><tr><th>Criterion</th><th>0</th><th>1</th><th>2</th></tr></thead>
<tbody>
<tr><td>Reproduce line</td><td>missing</td><td>"run the tests"</td><td>the exact command and the actual vs expected value</td></tr>
<tr><td>Experiments</td><td>only the fix</td><td>one experiment</td><td>≥1 experiment per bug, each with a result</td></tr>
<tr><td>Cause</td><td>"it was wrong"</td><td>describes the line</td><td>one sentence naming the concept (off-by-one, string sort, float, shared mutable default, 0-based month)</td></tr>
<tr><td>Fix</td><td>symptom fix (special case, tolerance with no reason)</td><td>works, not explained</td><td>smallest change to the cause, explained</td></tr>
<tr><td>Prevent</td><td>tests still red</td><td>green</td><td>green + one extra test of your own per bug (e.g. last page, negative scores, three items)</td></tr>
</tbody>
</table>

<h3>🧪 Practice — this lesson is the practice</h3>
<div class="callout ok">
<ol>
<li>Type the five functions and the test file; run <code>node --test nam-loi.test.js</code> and confirm 5 failures.</li>
<li>For each bug, in order: write the log's first two lines, run one experiment, write its result, then fix.</li>
<li>After each fix, run the whole test file — make sure the fix did not turn another test red.</li>
<li>Add one test of your own per bug that would catch a variant of it.</li>
</ol>
<p><strong>Done when:</strong> five logs with all five lines filled in, the test file prints <code>pass 5</code> / <code>fail 0</code>, five extra tests of your own are green, and your rubric score is at least 8/10.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">off-by-one</span><span class="v">A boundary that is one step too early or too late.</span></div>
  <div class="kv"><span class="k">compare function</span><span class="v">The function passed to <code>sort()</code> that decides order.</span></div>
  <div class="kv"><span class="k">floating point</span><span class="v">The binary number format that stores 0.1 only approximately.</span></div>
  <div class="kv"><span class="k">mutate</span><span class="v">Change an object or array in place, affecting everyone who holds it.</span></div>
  <div class="kv"><span class="k">monthIndex</span><span class="v">The 0–11 month number used by JavaScript's <code>Date</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The <code>actual</code> value in a failing test is evidence; read it before guessing.</li>
<li>One experiment that is not the fix, per bug, is what turns a guess into a diagnosis.</li>
<li>Five common causes: off-by-one, string sort, float money, shared mutable default, 0-based months.</li>
<li>Run the whole suite after every fix.</li>
<li>Your extra tests are what stop the variant of the bug next month.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Lab</span>
<h2>Năm lỗi, năm nhật ký, năm test xanh — chỉ bằng phương pháp</h2>
<p class="lead">Lab này đưa cả Chương 1 vào việc. Bạn có năm hàm JavaScript nhỏ, mỗi hàm cài sẵn một loại lỗi bạn sẽ gặp ở dự án thật, cùng một tệp test mà cả năm đều đỏ. Cấm dùng debugger (đó là Chương 3) — chỉ có tái hiện, khoanh vùng, giả thuyết, kiểm, sửa, chặn tái phát, và một nhật ký viết tay cho từng lỗi. Dự kiến 60–90 phút.</p>

<h3>Luật chơi</h3>
<ul>
<li>Làm trong <code>~/dbg-lab/ch1/1-5</code>. Tự gõ các tệp, không chép.</li>
<li>Mỗi lỗi, viết nhật ký năm dòng <em>trước khi</em> sửa hàm. Phần "Đã thử | Kết quả" phải có ít nhất một thí nghiệm không phải là bản sửa (một dòng in tạm, một lệnh <code>node -e</code>, một đầu vào nhỏ hơn).</li>
<li>Mỗi thí nghiệm một thay đổi; hoàn tác những lần thử không giúp được.</li>
<li>Không sửa test. Nếu bạn cho rằng một test sai, ghi lý do vào nhật ký — đó cũng là một phát hiện hợp lệ.</li>
</ul>

<h3>Code</h3>
${MA}

<h3>Test — năm triệu chứng của bạn</h3>
${TEST}
<p>Chạy: cả năm đều đỏ. Output đã cắt còn các dòng chính (<code>…</code> đánh dấu chỗ bỏ bớt).</p>
${OUT_DO}
<p>Đọc các dòng <code>actual</code> (thực tế) như bằng chứng, không phải như nhiễu. Mỗi dòng đã chứa một manh mối mạnh: trang 1 trả về trang <em>thứ hai</em>; danh sách đã xếp có 25 và 10 nằm giữa; 0,3 bị coi là nhỏ hơn 0,1 + 0,2; bài đăng thứ hai mang thẻ của bài thứ nhất; tháng Mười Một thành tháng Mười Hai.</p>

<h3>Gợi ý ba tầng (chỉ mở khi đã bí 15 phút)</h3>
<table>
<thead><tr><th>Lỗi</th><th>Tầng 1 — nhìn vào đâu</th><th>Tầng 2 — thí nghiệm</th><th>Tầng 3 — khái niệm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Trang 1 bắt đầu ở chỉ số nào?</td><td>Tính tay <code>1 * 2</code> và so với chỉ số của phần tử đầu</td><td>Trang đếm từ 1, mảng đếm từ 0: lệch một (off-by-one)</td></tr>
<tr><td>2</td><td><code>sort()</code> so sánh cái gì?</td><td><code>node -e "console.log(['9','10','7','25'].sort())"</code></td><td>sort mặc định so như chuỗi; phải truyền hàm so sánh</td></tr>
<tr><td>3</td><td>Tổng chính xác là bao nhiêu?</td><td><code>node -e "console.log(0.1 + 0.2)"</code></td><td>Số thực nhị phân không lưu đúng được 0,1; tính tiền bằng số nguyên (cent)</td></tr>
<tr><td>4</td><td>Có bao nhiêu mảng tồn tại?</td><td>Gọi <code>ganThe</code> hai lần rồi in <code>MAC_DINH</code></td><td>Giá trị mặc định trỏ vào MỘT mảng dùng chung; <code>push</code> sửa thẳng vào nó</td></tr>
<tr><td>5</td><td><code>new Date(2026, 11, 30)</code> nghĩa là gì?</td><td>In <code>new Date(2026, 0, 1).getMonth()</code></td><td>Tháng trong JavaScript đếm 0–11</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — sửa lỗi 3 bằng một sai số cho phép mà không giải thích được.</strong> <code>Math.abs(a - b) &lt; 0.0001</code> làm test này xanh, nhưng với tiền, cách làm chuyên nghiệp là lưu và so sánh bằng <strong>số nguyên cent</strong> (hoặc kiểu thập phân như <code>BigDecimal</code> trong Java, <code>NUMERIC</code> trong PostgreSQL). Ghi vào nhật ký bạn chọn cách nào và vì sao.</p></div>

<h3>Khi làm xong</h3>
<p>Bản sửa tham chiếu đổi một hai dòng mỗi lỗi. Sau đó, đúng tệp test đó xanh:</p>
${OUT_XANH}

<h3>Rubric tự chấm</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>0</th><th>1</th><th>2</th></tr></thead>
<tbody>
<tr><td>Dòng tái hiện</td><td>không có</td><td>"chạy test"</td><td>đúng lệnh và giá trị thực tế so với mong đợi</td></tr>
<tr><td>Thí nghiệm</td><td>chỉ có bản sửa</td><td>một thí nghiệm</td><td>≥1 thí nghiệm mỗi lỗi, mỗi cái có kết quả</td></tr>
<tr><td>Nguyên nhân</td><td>"nó sai"</td><td>mô tả dòng code</td><td>một câu gọi đúng khái niệm (lệch một, sort chuỗi, số thực, mặc định dùng chung bị sửa, tháng đếm từ 0)</td></tr>
<tr><td>Bản sửa</td><td>sửa triệu chứng (trường hợp đặc biệt, sai số không lý do)</td><td>chạy nhưng không giải thích</td><td>thay đổi nhỏ nhất vào nguyên nhân, có giải thích</td></tr>
<tr><td>Chặn tái phát</td><td>test còn đỏ</td><td>xanh</td><td>xanh + mỗi lỗi một test tự viết thêm (vd trang cuối, điểm âm, ba món)</td></tr>
</tbody>
</table>

<h3>🧪 Thực hành — chính bài này là phần thực hành</h3>
<div class="callout ok">
<ol>
<li>Gõ năm hàm và tệp test; chạy <code>node --test nam-loi.test.js</code>, xác nhận 5 test đỏ.</li>
<li>Lần lượt từng lỗi: viết hai dòng đầu của nhật ký, chạy một thí nghiệm, ghi kết quả, rồi mới sửa.</li>
<li>Sau mỗi bản sửa, chạy cả tệp test — chắc chắn bản sửa không làm test khác đỏ.</li>
<li>Mỗi lỗi thêm một test tự viết để bắt được một biến thể của nó.</li>
</ol>
<p><strong>Đạt khi:</strong> năm nhật ký đủ cả năm dòng, tệp test in <code>pass 5</code> / <code>fail 0</code>, năm test tự viết đều xanh, và điểm rubric ít nhất 8/10.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">off-by-one (lệch một)</span><span class="v">Biên sớm hoặc muộn đúng một bước.</span></div>
  <div class="kv"><span class="k">compare function (hàm so sánh)</span><span class="v">Hàm truyền vào <code>sort()</code> để quyết định thứ tự.</span></div>
  <div class="kv"><span class="k">floating point (số thực dấu phẩy động)</span><span class="v">Định dạng số nhị phân chỉ lưu được 0,1 gần đúng.</span></div>
  <div class="kv"><span class="k">mutate (sửa tại chỗ)</span><span class="v">Đổi trực tiếp một đối tượng/mảng, ảnh hưởng mọi nơi đang giữ nó.</span></div>
  <div class="kv"><span class="k">monthIndex (chỉ số tháng)</span><span class="v">Số tháng 0–11 mà <code>Date</code> của JavaScript dùng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Giá trị <code>actual</code> trong test đỏ là bằng chứng; đọc nó trước khi đoán.</li>
<li>Mỗi lỗi một thí nghiệm không phải bản sửa — đó là thứ biến đoán mò thành chẩn đoán.</li>
<li>Năm nguyên nhân hay gặp: lệch một, sort theo chuỗi, tiền bằng số thực, mặc định dùng chung bị sửa, tháng đếm từ 0.</li>
<li>Chạy cả bộ test sau mỗi bản sửa.</li>
<li>Test tự viết thêm là thứ chặn biến thể của lỗi vào tháng sau.</li>
</ul>
${NGUON}
</div>
`,
};
