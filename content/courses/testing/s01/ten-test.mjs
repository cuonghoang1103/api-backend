/**
 * Testing · Chương 1 · 1.3 — Đặt tên và sắp xếp test. Slug giữ từ khung: tst-1-3-ten-test.
 * Code/output từ ./_ma.mjs (chạy thật; bug BR-05 cài tạm khi chụp ten-xau và bien-bug).
 */
import G from '../giang/tst-01-3.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

/** Lấy đúng khối FAIL đầu tiên của output bien-bug (cắt bớt phần còn lại). */
const TOT = (() => {
  const t = OUT['14-bien-bug'];
  const a = t.indexOf(' FAIL ');
  const b = t.indexOf('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯');
  return '…\n' + t.slice(a, b).replace(/\s+$/, '') + '\n…';
})();

export default {
  title: '1.3 — Naming and organising tests|||1.3 — Đặt tên và sắp xếp test',
  slug: 'tst-1-3-ten-test',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tên test là tài liệu: cùng một bug, "test 2" vs tên theo luật; mẫu đơn vị › tình huống › kết quả; describe lồng nhau; it.each với %s/%i/%j/%#/$thuộcTính; todo/skip/only và .only bị CI từ chối; đặt file test ở đâu và sắp xếp một file.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Naming and organising tests</h2>
<p class="lead">Tests are read far more often than they are written — usually by someone in a hurry, looking at a red line in CI. This lesson makes that line useful and keeps your test files short.</p>

<h3>The same bug, two names</h3>
<p>We planted one bug in <code>isWithinBookingWindow</code> — <code>daysAhead &lt; MAX_DAYS_AHEAD</code> instead of <code>&lt;=</code>, so booking exactly 14 days ahead is refused — and ran two tests that both catch it. The first is named “test 2”:</p>
${ma('javascript', CODE.tenXau)}
${ra(OUT['13-ten-xau'])}
<p>“expected false to be true” — about what? You must open the file, find line 5, look up <code>isWithinBookingWindow</code>, remember BR-05. The second test (from lesson 1.4) carries the rule and the boundary in its name:</p>
${ra(TOT)}
<p>“isWithinBookingWindow (BR-05: at most 14 days ahead) › 14 days ahead → true”. Before opening any file you know the unit, the rule, the boundary value and what was expected. On a CI dashboard with forty other tests, that is the difference between a two-minute fix and a twenty-minute hunt.</p>

<h3>A naming pattern that works</h3>
<table>
<thead><tr><th>Part</th><th>Where it goes</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Unit under test</td><td>outer <code>describe</code></td><td><code>describe('checkSlot', …)</code></td></tr>
<tr><td>Situation / input</td><td>inner <code>describe</code>, or the start of the sentence</td><td><code>describe('when the slot breaks a rule', …)</code></td></tr>
<tr><td>Expected result</td><td><code>it</code>, as a full sentence</td><td><code>it('rejects 06:30–08:00 with OUTSIDE_HOURS', …)</code></td></tr>
</tbody>
</table>
<ul>
<li><strong>Avoid:</strong> “test 1”, “works”, “should work”, the bare function name, or names that describe <em>how</em> (“calls parseTime twice”) instead of <em>what is guaranteed</em>.</li>
<li><strong>Prefer:</strong> the rule in plain words, the boundary value in the name, the expected code/status/number. Many teams write names as “should …” or “given … when … then …”; any style works if it states the expected behaviour.</li>
<li>Names are for humans: English is usual in companies (and what this course uses on slides), but a clear Vietnamese name is better than an unclear English one in your own project.</li>
</ul>

<h3>Nested describe: the report reads like a specification</h3>
${ma('javascript', CODE.ten)}
${ra(OUT['13-ten'])}
<p>Read only the tree and you have the spec of <code>checkSlot</code>. Two levels — unit, then situation — are usually enough; if you need three or four, the file is probably testing several things that deserve their own files.</p>

<h3>it.each: tables instead of copy-paste</h3>
<p>The five rejection tests above came from one table. <code>it.each(rows)(nameTemplate, fn)</code> creates <em>one separate test per row</em>, each with its own name and its own red line. Rows can be:</p>
<ul>
<li><strong>arrays</strong> — the elements become the function’s arguments; the name uses <code>%s</code> (string), <code>%i</code> (integer), <code>%j</code> (JSON), <code>%#</code> (row index);</li>
<li><strong>objects</strong> — the function receives the object; the name uses <code>$property</code>, e.g. <code>'rejects $start–$end with $code'</code>. Objects read better once there are three or more columns.</li>
</ul>
<p>The practice task below shows the effect on a real file — five copy-pasted tests before, one table after:</p>
${ma('javascript', CODE.th13Truoc)}
${ma('javascript', CODE.th13Sau)}
${ra(OUT['13-th'])}

<h3>todo, skip and only</h3>
<table>
<thead><tr><th>Modifier</th><th>Meaning</th><th>Report</th><th>Commit it?</th></tr></thead>
<tbody>
<tr><td><code>it.todo('…')</code></td><td>A test you still have to write — no function body</td><td>□</td><td>Yes: a visible reminder</td></tr>
<tr><td><code>it.skip(…)</code></td><td>Temporarily not run</td><td>↓ skipped</td><td>Only with a comment and a ticket (“skipped until #123 is fixed”)</td></tr>
<tr><td><code>it.only(…)</code> / <code>describe.only</code></td><td>Run only the marked tests in this file</td><td>everything else ↓</td><td><strong>Never</strong> — a debugging tool</td></tr>
</tbody>
</table>
<p>Why <code>.only</code> is dangerous: locally it makes the run green while silently skipping the rest.</p>
${ra(OUT['13-only-local'])}
<p>On a CI server Vitest refuses it — the <code>allowOnly</code> option is off when the <code>CI</code> environment variable is set:</p>
${ra(OUT['13-only-ci'])}
<p>That protects the main branch, but your own machine has no such guard: look at <code>git diff</code> before every commit.</p>

<h3>Where test files live</h3>
<ul>
<li><strong>Next to the code</strong> (this course): <code>src/rules/booking.js</code> + <code>src/rules/booking.test.js</code>. Easy to find, moved and deleted together, short imports.</li>
<li><strong>A separate <code>test/</code> folder</strong>: common for integration and end-to-end tests that touch several modules (Chapters 4–7 use <code>test/api</code>, <code>e2e/</code>).</li>
</ul>
<p>Vitest’s default <code>include</code> finds every <code>*.test.*</code> and <code>*.spec.*</code> file with a JS/TS extension outside <code>node_modules</code>, so both layouts work with zero config.</p>

<h3>Inside one test file</h3>
<ol>
<li>Imports: <code>vitest</code> first, then the code under test.</li>
<li>One <code>describe</code> per exported function, in the same order as the source file.</li>
<li>Shared test data as a <code>const</code> at the top of the describe — or <code>beforeEach</code> when each test must get a fresh copy it can modify.</li>
<li>Happy path first, then each rule violation, then invalid input.</li>
<li>A small helper (e.g. <code>makeBooking({ seats: 31 })</code>) once the same Arrange appears three times.</li>
</ol>
<p>The Lab 1 solution file is organised exactly like this; read it as an example after doing the lab.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Create <code>demo/ten-xau.test.js</code> as above. Plant the bug (<code>&lt;</code> instead of <code>&lt;=</code> in <code>isWithinBookingWindow</code>), run it, and write down what the red line tells you. Restore the code.</li>
<li>Create <code>demo/th13-truoc.test.js</code> with the five copy-pasted tests, then rewrite them as one <code>it.each</code> in <code>demo/th13-sau.test.js</code> with the name template <code>'converts %s to %i minutes'</code>.</li>
<li>Add <code>it.todo('rejects a slot on a day the lab is closed')</code> to a describe of your choice.</li>
<li>Add <code>.only</code> to one test in <code>demo/ten.test.js</code>, run once normally and once with <code>CI=true</code> (PowerShell: <code>$env:CI="true"; npx vitest run …</code>), read the error, remove the <code>.only</code>.</li>
</ol>
<p><strong>Done when:</strong> your report shows ten passing tests for the two <code>th13</code> files with names like <em>converts 07:00 to 420 minutes</em>; a □ todo line appears; the <code>CI=true</code> run failed with “Unexpected .only modifier”; and <code>git diff</code> contains no <code>.only</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test name</span><span class="v">The sentence in <code>it('…')</code>; together with the describe names it is the line in the report.</span></div>
  <div class="kv"><span class="k">it.each / describe.each</span><span class="v">Create one test (or group) per row of a table.</span></div>
  <div class="kv"><span class="k">name template</span><span class="v">A name with placeholders (<code>%s</code>, <code>%i</code>, <code>$start</code>) filled from each row.</span></div>
  <div class="kv"><span class="k">it.todo / it.skip / it.only</span><span class="v">Reminder / temporarily off / run only this — never commit <code>only</code>.</span></div>
  <div class="kv"><span class="k">co-located tests</span><span class="v">Test files placed next to the code they test.</span></div>
  <div class="kv"><span class="k">CI environment variable</span><span class="v"><code>CI=true</code> — tools use it to behave strictly (no watch, no <code>.only</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A test name is the first thing read when CI is red — make it the diagnosis.</li>
<li>Unit › situation › expected result; put the boundary value and the expected code in the name.</li>
<li>Two levels of <code>describe</code> are usually enough.</li>
<li><code>it.each</code> turns copy-paste into a table; each row is its own test with its own name.</li>
<li><code>todo</code> is fine, <code>skip</code> needs a reason, <code>only</code> never gets committed (CI rejects it, your laptop does not).</li>
<li>Keep test files next to the code; one describe per function, happy path first.</li>
</ul>
${lienKet({ bai: 'swt301-junit-hands-on', title: 'Also in SWT301 — lesson 8.5: JUnit 5 with @DisplayName and @ParameterizedTest', sub: 'Same: a readable display name per test, and one test method fed by a table of rows (@CsvSource in JUnit, it.each in Vitest). Different: JUnit needs annotations and a separate params dependency; Vitest builds the names from the row with %s or $property.', cta: 'OPEN SWT301 LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Đặt tên và sắp xếp test</h2>
<p class="lead">Test được đọc nhiều hơn được viết rất nhiều — thường là bởi một người đang vội, nhìn một dòng đỏ trên CI. Bài này làm cho dòng đó có ích, và giữ cho file test của bạn gọn.</p>

<h3>Cùng một bug, hai cái tên</h3>
<p>Ta cài một con bug vào <code>isWithinBookingWindow</code> — <code>daysAhead &lt; MAX_DAYS_AHEAD</code> thay vì <code>&lt;=</code>, nên đặt đúng 14 ngày bị từ chối — rồi chạy hai test đều bắt được nó. Test thứ nhất tên là "test 2":</p>
${ma('javascript', CODE.tenXau)}
${ra(OUT['13-ten-xau'])}
<p>"expected false to be true" — về cái gì? Bạn phải mở file, tìm dòng 5, tra <code>isWithinBookingWindow</code>, nhớ lại BR-05. Test thứ hai (ở bài 1.4) mang luật và giá trị biên ngay trong tên:</p>
${ra(TOT)}
<p>"isWithinBookingWindow (BR-05: at most 14 days ahead) › 14 days ahead → true". Chưa mở file nào bạn đã biết đơn vị, luật, giá trị biên và điều được mong đợi. Trên một bảng CI có thêm bốn mươi test khác, đó là khác biệt giữa sửa trong hai phút và lần mò hai mươi phút.</p>

<h3>Một mẫu đặt tên dùng được</h3>
<table>
<thead><tr><th>Phần</th><th>Đặt ở đâu</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Đơn vị đang test</td><td><code>describe</code> ngoài cùng</td><td><code>describe('checkSlot', …)</code></td></tr>
<tr><td>Tình huống / đầu vào</td><td><code>describe</code> bên trong, hoặc đầu câu</td><td><code>describe('when the slot breaks a rule', …)</code></td></tr>
<tr><td>Kết quả mong đợi</td><td><code>it</code>, viết thành câu đầy đủ</td><td><code>it('rejects 06:30–08:00 with OUTSIDE_HOURS', …)</code></td></tr>
</tbody>
</table>
<ul>
<li><strong>Tránh:</strong> "test 1", "works", "should work", chỉ ghi tên hàm, hoặc tên mô tả <em>code làm thế nào</em> ("calls parseTime twice") thay vì <em>điều gì được bảo đảm</em>.</li>
<li><strong>Nên:</strong> ghi luật bằng lời thường, đưa giá trị biên vào tên, ghi mã/trạng thái/con số mong đợi. Nhiều đội viết tên kiểu "should …" hay "given … when … then …"; kiểu nào cũng được miễn nó nói ra hành vi mong đợi.</li>
<li>Tên là để người đọc: ở công ty thường viết tiếng Anh (và slide của khoá cũng vậy), nhưng trong dự án của riêng bạn, một tên tiếng Việt rõ ràng tốt hơn một tên tiếng Anh mơ hồ.</li>
</ul>

<h3>describe lồng nhau: báo cáo đọc như một bản đặc tả</h3>
${ma('javascript', CODE.ten)}
${ra(OUT['13-ten'])}
<p>Chỉ đọc cái cây là bạn có đặc tả của <code>checkSlot</code>. Hai tầng — đơn vị, rồi tình huống — thường là đủ; nếu cần ba bốn tầng, nhiều khả năng file đang test vài thứ đáng được tách ra file riêng.</p>

<h3>it.each: bảng thay cho copy-paste</h3>
<p>Năm test từ chối ở trên sinh ra từ một bảng. <code>it.each(rows)(mauTen, fn)</code> tạo <em>một test riêng cho mỗi dòng</em>, mỗi test có tên riêng và dòng đỏ riêng. Mỗi dòng có thể là:</p>
<ul>
<li><strong>mảng</strong> — các phần tử thành tham số của hàm; tên dùng <code>%s</code> (chuỗi), <code>%i</code> (số nguyên), <code>%j</code> (JSON), <code>%#</code> (số thứ tự dòng);</li>
<li><strong>object</strong> — hàm nhận nguyên object; tên dùng <code>$thuộcTính</code>, vd <code>'rejects $start–$end with $code'</code>. Object dễ đọc hơn khi có từ ba cột trở lên.</li>
</ul>
<p>Bài thực hành bên dưới cho thấy hiệu quả trên một file thật — trước là năm test copy-paste, sau là một bảng:</p>
${ma('javascript', CODE.th13Truoc)}
${ma('javascript', CODE.th13Sau)}
${ra(OUT['13-th'])}

<h3>todo, skip và only</h3>
<table>
<thead><tr><th>Bổ từ</th><th>Nghĩa</th><th>Báo cáo</th><th>Có commit không?</th></tr></thead>
<tbody>
<tr><td><code>it.todo('…')</code></td><td>Một test còn phải viết — không có thân hàm</td><td>□</td><td>Có: một lời nhắc ai cũng thấy</td></tr>
<tr><td><code>it.skip(…)</code></td><td>Tạm thời không chạy</td><td>↓ skipped</td><td>Chỉ khi kèm chú thích và ticket ("tắt tới khi sửa #123")</td></tr>
<tr><td><code>it.only(…)</code> / <code>describe.only</code></td><td>Chỉ chạy những test được đánh dấu trong file</td><td>mọi thứ khác ↓</td><td><strong>Không bao giờ</strong> — công cụ để gỡ lỗi</td></tr>
</tbody>
</table>
<p>Vì sao <code>.only</code> nguy hiểm: ở máy bạn, nó làm lần chạy xanh trong khi lặng lẽ bỏ qua phần còn lại.</p>
${ra(OUT['13-only-local'])}
<p>Trên máy chủ CI, Vitest từ chối nó — tuỳ chọn <code>allowOnly</code> bị tắt khi có biến môi trường <code>CI</code>:</p>
${ra(OUT['13-only-ci'])}
<p>Điều đó bảo vệ nhánh chính, nhưng máy bạn thì không có lớp bảo vệ ấy: hãy xem <code>git diff</code> trước mỗi lần commit.</p>

<h3>File test nằm ở đâu</h3>
<ul>
<li><strong>Cạnh code</strong> (khoá này): <code>src/rules/booking.js</code> + <code>src/rules/booking.test.js</code>. Dễ tìm, di chuyển và xoá cùng nhau, import ngắn.</li>
<li><strong>Thư mục <code>test/</code> riêng</strong>: hay gặp với test tích hợp và test đầu-cuối chạm vào nhiều module (Chương 4–7 dùng <code>test/api</code>, <code>e2e/</code>).</li>
</ul>
<p>Mặc định <code>include</code> của Vitest tìm mọi file <code>*.test.*</code> và <code>*.spec.*</code> có đuôi JS/TS nằm ngoài <code>node_modules</code>, nên cả hai cách bố trí đều chạy không cần cấu hình.</p>

<h3>Bên trong một file test</h3>
<ol>
<li>Import: <code>vitest</code> trước, rồi tới code cần test.</li>
<li>Mỗi hàm được export một <code>describe</code>, theo đúng thứ tự trong file nguồn.</li>
<li>Dữ liệu test dùng chung là một <code>const</code> ở đầu describe — hoặc <code>beforeEach</code> khi mỗi test cần một bản mới để tự sửa.</li>
<li>Đường đi suôn sẻ trước, rồi từng trường hợp phạm luật, rồi đầu vào không hợp lệ.</li>
<li>Một hàm phụ nhỏ (vd <code>makeBooking({ seats: 31 })</code>) khi cùng một phần Arrange xuất hiện tới lần thứ ba.</li>
</ol>
<p>File lời giải của Lab 1 được sắp xếp đúng như vậy; đọc nó làm ví dụ sau khi làm lab.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Tạo <code>demo/ten-xau.test.js</code> như trên. Cài con bug (<code>&lt;</code> thay vì <code>&lt;=</code> trong <code>isWithinBookingWindow</code>), chạy, và ghi lại dòng đỏ cho bạn biết gì. Trả code về như cũ.</li>
<li>Tạo <code>demo/th13-truoc.test.js</code> với năm test copy-paste, rồi viết lại thành một <code>it.each</code> trong <code>demo/th13-sau.test.js</code> với mẫu tên <code>'converts %s to %i minutes'</code>.</li>
<li>Thêm <code>it.todo('rejects a slot on a day the lab is closed')</code> vào một describe tuỳ bạn.</li>
<li>Thêm <code>.only</code> vào một test trong <code>demo/ten.test.js</code>, chạy một lần bình thường và một lần với <code>CI=true</code> (PowerShell: <code>$env:CI="true"; npx vitest run …</code>), đọc lỗi, rồi bỏ <code>.only</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> báo cáo hiện mười test đạt cho hai file <code>th13</code> với tên kiểu <em>converts 07:00 to 420 minutes</em>; có một dòng □ todo; lần chạy <code>CI=true</code> hỏng với "Unexpected .only modifier"; và <code>git diff</code> không còn <code>.only</code> nào.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test name (tên test)</span><span class="v">Câu trong <code>it('…')</code>; ghép với tên describe thành một dòng trong báo cáo.</span></div>
  <div class="kv"><span class="k">it.each / describe.each</span><span class="v">Tạo một test (hay một nhóm) cho mỗi dòng của một bảng.</span></div>
  <div class="kv"><span class="k">name template (mẫu tên)</span><span class="v">Tên có chỗ trống (<code>%s</code>, <code>%i</code>, <code>$start</code>) được điền từ mỗi dòng.</span></div>
  <div class="kv"><span class="k">it.todo / it.skip / it.only</span><span class="v">Lời nhắc / tạm tắt / chỉ chạy cái này — đừng bao giờ commit <code>only</code>.</span></div>
  <div class="kv"><span class="k">co-located tests (test đặt cạnh code)</span><span class="v">File test nằm ngay cạnh code mà nó test.</span></div>
  <div class="kv"><span class="k">biến môi trường CI</span><span class="v"><code>CI=true</code> — công cụ dựa vào đó để chạy chặt chẽ (không watch, không <code>.only</code>).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tên test là thứ đầu tiên được đọc khi CI đỏ — hãy biến nó thành bản chẩn đoán.</li>
<li>Đơn vị › tình huống › kết quả mong đợi; đưa giá trị biên và mã mong đợi vào tên.</li>
<li>Hai tầng <code>describe</code> thường là đủ.</li>
<li><code>it.each</code> biến copy-paste thành bảng; mỗi dòng là một test riêng có tên riêng.</li>
<li><code>todo</code> thì được, <code>skip</code> cần lý do, <code>only</code> không bao giờ commit (CI từ chối, máy bạn thì không).</li>
<li>File test nằm cạnh code; mỗi hàm một describe, đường suôn sẻ trước.</li>
</ul>
${lienKet({ bai: 'swt301-junit-hands-on', title: 'Đã gặp ở SWT301 — bài 8.5: JUnit 5 với @DisplayName và @ParameterizedTest', sub: 'Giống: mỗi test một tên hiển thị dễ đọc, và một phương thức test được nuôi bằng một bảng dữ liệu (@CsvSource trong JUnit, it.each trong Vitest). Khác: JUnit cần annotation và gói params riêng; Vitest dựng tên từ chính dòng dữ liệu bằng %s hay $thuộcTính.', cta: 'MỞ BÀI SWT301 →' })}
</div>
`,
};
