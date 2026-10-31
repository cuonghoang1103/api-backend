/**
 * Testing · Chương 1 · 1.2 — Matcher nói đúng điều bạn muốn. Slug giữ từ khung: tst-1-2-matcher.
 * Code/output từ ./_ma.mjs (chạy thật). Snapshot "trước" = bản sau khi xoá phần Vitest tự điền (đúng cái người học gõ).
 */
import G from '../giang/tst-01-2.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const SNAP_TRUOC = CODE.strictAfter.replace(/toMatchInlineSnapshot\(`[^`]*`\)/, 'toMatchInlineSnapshot()');
const SNAP_GIUA = (CODE.strictAfter.match(/it\('inline snapshot'[^]*$/) || [''])[0];
const SNAP_SAU_U = (CODE.strictAfterU.match(/it\('inline snapshot'[^]*$/) || [''])[0];

const BANG_EN = `<table>
<thead><tr><th>Matcher</th><th>Compares</th><th>Ignores</th><th>Use it when</th></tr></thead>
<tbody>
<tr><td><code>toBe</code></td><td>Same primitive value, or the very same object (<code>Object.is</code>)</td><td>—</td><td>numbers, strings, booleans</td></tr>
<tr><td><code>toEqual</code></td><td>All values, recursively</td><td>properties that are <code>undefined</code>; class types</td><td>plain data, most of the time</td></tr>
<tr><td><code>toStrictEqual</code></td><td>All values, <code>undefined</code> keys, types, sparse arrays</td><td>nothing</td><td>data leaving your system (API responses)</td></tr>
<tr><td><code>toMatchObject</code></td><td>Only the fields you list</td><td>every other field</td><td>the test is about one or two fields</td></tr>
<tr><td><code>toBeCloseTo(n, digits)</code></td><td>Numbers within half a unit of the last digit (default 2 digits)</td><td>tiny binary rounding</td><td>anything computed with division</td></tr>
<tr><td><code>toContain</code> · <code>toHaveLength</code> · <code>toHaveProperty</code></td><td>An item in an array/string · a length · a key (and value)</td><td>the rest</td><td>lists of errors, optional fields</td></tr>
<tr><td><code>toThrow(Class | /regex/ | 'text')</code></td><td>The function throws a matching error</td><td>—</td><td>error paths</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Matcher</th><th>So sánh</th><th>Bỏ qua</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td><code>toBe</code></td><td>Cùng giá trị nguyên thuỷ, hoặc đúng cùng một object (<code>Object.is</code>)</td><td>—</td><td>số, chuỗi, boolean</td></tr>
<tr><td><code>toEqual</code></td><td>Mọi giá trị, theo chiều sâu</td><td>thuộc tính bằng <code>undefined</code>; kiểu class</td><td>dữ liệu thường, phần lớn trường hợp</td></tr>
<tr><td><code>toStrictEqual</code></td><td>Mọi giá trị, khoá <code>undefined</code>, kiểu, mảng thưa</td><td>không gì cả</td><td>dữ liệu đi ra khỏi hệ thống (response API)</td></tr>
<tr><td><code>toMatchObject</code></td><td>Chỉ các trường bạn liệt kê</td><td>mọi trường khác</td><td>test chỉ nói về một hai trường</td></tr>
<tr><td><code>toBeCloseTo(n, digits)</code></td><td>Số chênh không quá nửa đơn vị của chữ số cuối (mặc định 2 chữ số)</td><td>sai số làm tròn nhị phân</td><td>mọi thứ tính bằng phép chia</td></tr>
<tr><td><code>toContain</code> · <code>toHaveLength</code> · <code>toHaveProperty</code></td><td>Có phần tử trong mảng/chuỗi · độ dài · có khoá (và giá trị)</td><td>phần còn lại</td><td>danh sách lỗi, trường tuỳ chọn</td></tr>
<tr><td><code>toThrow(Class | /regex/ | 'text')</code></td><td>Hàm ném ra lỗi khớp</td><td>—</td><td>nhánh lỗi</td></tr>
</tbody>
</table>`;

export default {
  title: '1.2 — Matchers that say what you mean|||1.2 — Matcher nói đúng điều bạn muốn',
  slug: 'tst-1-2-matcher',
  type: 'LESSON',
  isFreePreview: true,
  description: 'toBe (Object.is) hỏng với object, toEqual vs toStrictEqual vs toMatchObject, vì sao 30+120+60 phút không đúng 25% và toBeCloseTo, bẫy toBeTruthy, test lỗi bằng hàm bọc và toThrow, snapshot và chuyện -u chấp nhận một con bug — mọi output đều chạy thật.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Matchers that say what you mean</h2>
<p class="lead">A test is only as precise as its matcher. Every example in this lesson ran against LabFlow Lite; three of them fail on purpose, and each failure teaches one matcher.</p>

<h3>The demo file</h3>
${ma('javascript', CODE.matcher)}
${ra(OUT['12-matcher'])}
<p>Seven tests, three red. We take them one by one.</p>

<h3>toBe asks “the very same thing?”</h3>
<p><code>toBe</code> compares with <code>Object.is</code>: for numbers, strings and booleans that means “same value”; for objects and arrays it means “the very same object in memory”. The booking returned by <code>createBooking</code> and the object literal in the test are two different objects with identical contents — so <code>toBe</code> fails, and Vitest even tells you: <em>serializes to the same string</em>, <em>replace "toBe" with "toStrictEqual"</em>. For objects use a <strong>deep-equality</strong> matcher.</p>

<h3>toEqual, toStrictEqual, toMatchObject</h3>
${ma('javascript', CODE.strictAfter)}
${ra(OUT['12-strict'])}
<p>The extra key <code>note: undefined</code> slips past <code>toEqual</code> but not <code>toStrictEqual</code> — the diff marks it with <code>+</code>. And <code>toMatchObject</code> passes because it only looks at <code>status</code> and <code>minutes</code>. (The fourth test is a snapshot — see below.)</p>
${BANG_EN}

<h3>Decimals: 210 minutes is not exactly a quarter of the day</h3>
<p><code>usageRate</code> adds, for each booking, its share of the 840-minute opening day. 30 + 120 + 60 = 210 = exactly ¼ of 840. Yet the real output is <code>0.24999999999999997</code>. Numbers like 30/840 have no exact binary form; each share is rounded when stored, and the sum of three rounded values ends one tiny step below 0.25 — the same reason <code>0.1 + 0.2</code> is <code>0.30000000000000004</code> in JavaScript. Two ways out:</p>
<ul>
<li><code>toBeCloseTo(0.25)</code> — accepts differences smaller than half of the last checked digit (2 decimal places by default; <code>toBeCloseTo(0.1786, 4)</code> checks four).</li>
<li>Better for money and durations: keep <strong>integers</strong> (cents, minutes) in your code and divide only when displaying. Then <code>toBe</code> is exact. A version of <code>usageRate</code> that sums minutes first and divides once would also return exactly 0.25.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>toBeTruthy</code> passes for the wrong reason.</strong> <code>expect(checkSlot('06:30', '08:00')).toBeTruthy()</code> is green although 06:30 is <em>invalid</em>. <code>checkSlot</code> always returns an object, and every object is truthy — <code>{ ok: false }</code> included. The test proves nothing about the rule. Say what you mean: <code>toEqual({ ok: false, code: 'OUTSIDE_HOURS' })</code>, or at least <code>toMatchObject({ ok: false })</code>. Use <code>toBeTruthy</code>/<code>toBeFalsy</code> only for values that really are booleans or can be null.</p>
</div>

<h3>Errors: give expect a function, not a result</h3>
<p>The third failure is not an assertion error at all — it is the <code>TypeError</code> from <code>parseTime</code> itself, escaping the test. In <code>expect(parseTime('7h')).toThrow()</code>, JavaScript evaluates <code>parseTime('7h')</code> <em>before</em> <code>expect</code> is called; the error is thrown on the spot and nothing catches it. Wrap the call in an arrow function: <code>expect(() =&gt; parseTime('7h'))</code>. Now <code>toThrow</code> calls it, catches the error and compares:</p>
<ul>
<li><code>toThrow(TypeError)</code> — the error is a <code>TypeError</code> (or a subclass);</li>
<li><code>toThrow(/expected HH:MM/)</code> — its message matches the regular expression;</li>
<li><code>toThrow('OUTSIDE_HOURS')</code> — its message contains this text;</li>
<li><code>toThrow()</code> alone — <em>any</em> error, including a typo in your own code. Too weak on its own.</li>
</ul>

<h3>Snapshots — and the -u trap</h3>
<p>A snapshot lets Vitest write the expected value for you. You type</p>
${ma('javascript', SNAP_TRUOC.slice(SNAP_TRUOC.indexOf("it('inline snapshot'")))}
<p>and the first run fills it in (the output above says <code>Snapshots 1 written</code>):</p>
${ma('javascript', SNAP_GIUA)}
<p>That is handy for large outputs you do not want to type by hand. Now we plant a bug — approval from 20 seats instead of more than 30 — by changing one line in <code>needsApproval</code> to <code>return seats &gt;= 20;</code>. The snapshot catches it:</p>
${ra(OUT['12-snap-fail'])}
<p>So far, so good. But a tired developer sees red, assumes “the snapshot is just outdated”, and runs with <code>-u</code> (update snapshots):</p>
${ra(OUT['12-snap-u'])}
${ma('javascript', SNAP_SAU_U)}
<p>Green — and the bug is now the expected value, protected by the test. A snapshot only records what the code does <em>now</em>; it never knew what the code <em>should</em> do. Rules: review snapshot diffs in pull requests like code, keep snapshots small, prefer explicit assertions for business rules, and before typing <code>-u</code> ask “did I mean to change this behaviour?”.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li><code>needsApproval</code> with 0 seats throws a <code>RangeError</code> whose message mentions “positive integer”.</li>
<li><code>usageRate</code> of 120 + 30 minutes is about 0.1786, checked to 4 decimal places.</li>
<li><code>checkSlot('08:10', '09:00')</code> is not ok and has no <code>minutes</code> property.</li>
<li>Rewrite the <code>toBeTruthy</code> test so it would fail if <code>checkSlot</code> accepted 06:30.</li>
<li>Mini mutation test: change <code>OPEN</code> to <code>6 * 60</code> in <code>booking.js</code>, run, then change it back.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th12)}
${ra(OUT['12-th'])}
<p>With <code>OPEN = 6 * 60</code>:</p>
${ra(OUT['12-th-bug'])}
<p><strong>Done when:</strong> the file shows <code>4 passed</code>; with the planted change your rewritten test is red (06:30 is now accepted, <code>ok: true, minutes: 90</code>) — and so is the usage test, because the day became 900 minutes long. That second red is a bonus lesson: a constant shared by two rules is caught by tests of both.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">matcher</span><span class="v">The comparison after <code>expect(…)</code>: <code>toBe</code>, <code>toEqual</code>, <code>toThrow</code>…</span></div>
  <div class="kv"><span class="k">deep equality</span><span class="v">Comparing contents recursively rather than identity in memory.</span></div>
  <div class="kv"><span class="k">floating point</span><span class="v">How computers store decimals in binary — many decimals (0.1, 30/840) are rounded.</span></div>
  <div class="kv"><span class="k">truthy / falsy</span><span class="v">Values JavaScript treats as true/false in a condition; every object is truthy.</span></div>
  <div class="kv"><span class="k">snapshot</span><span class="v">A stored copy of an output that later runs compare against; <code>-u</code> overwrites it.</span></div>
  <div class="kv"><span class="k">mutation (planted bug)</span><span class="v">A small deliberate change to the code to check that a test really fails — Lab 1 automates it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>toBe</code> checks identity (<code>Object.is</code>); compare objects with <code>toEqual</code>.</li>
<li><code>toStrictEqual</code> also catches <code>undefined</code> keys and types; <code>toMatchObject</code> checks only the fields you name.</li>
<li>Decimals need <code>toBeCloseTo</code> — or integers in the first place.</li>
<li><code>toBeTruthy</code> on an object proves nothing; assert the exact expected value.</li>
<li>Errors: <code>expect(() =&gt; call()).toThrow(Class or /message/)</code> — the arrow is mandatory.</li>
<li>Snapshots record what the code does, not what it should do; <code>-u</code> can bless a bug.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Matcher nói đúng điều bạn muốn</h2>
<p class="lead">Một test chỉ chính xác bằng matcher của nó. Mọi ví dụ trong bài đã chạy trên LabFlow Lite; ba ví dụ cố ý hỏng, và mỗi lần hỏng dạy một matcher.</p>

<h3>File thử nghiệm</h3>
${ma('javascript', CODE.matcher)}
${ra(OUT['12-matcher'])}
<p>Bảy test, ba đỏ. Ta xem từng cái.</p>

<h3>toBe hỏi "có phải đúng cùng một thứ không?"</h3>
<p><code>toBe</code> so bằng <code>Object.is</code>: với số, chuỗi, boolean thì nghĩa là "cùng giá trị"; với object và mảng thì nghĩa là "đúng cùng một object trong bộ nhớ". Object lượt đặt do <code>createBooking</code> trả về và object viết trong test là hai object khác nhau có nội dung y hệt — nên <code>toBe</code> hỏng, và Vitest còn nói rõ: <em>serializes to the same string</em> (chuyển thành chuỗi thì giống hệt), <em>replace "toBe" with "toStrictEqual"</em> (hãy đổi sang toStrictEqual). Với object hãy dùng matcher <strong>so sánh sâu (deep equality)</strong>.</p>

<h3>toEqual, toStrictEqual, toMatchObject</h3>
${ma('javascript', CODE.strictAfter)}
${ra(OUT['12-strict'])}
<p>Khoá thừa <code>note: undefined</code> lọt qua <code>toEqual</code> nhưng không qua được <code>toStrictEqual</code> — phần so sánh đánh dấu nó bằng <code>+</code>. Còn <code>toMatchObject</code> đạt vì nó chỉ nhìn <code>status</code> và <code>minutes</code>. (Test thứ tư là snapshot — xem bên dưới.)</p>
${BANG_VI}

<h3>Số thập phân: 210 phút không đúng bằng một phần tư ngày</h3>
<p><code>usageRate</code> cộng, với từng lượt đặt, phần của nó trong ngày mở cửa 840 phút. 30 + 120 + 60 = 210 = đúng ¼ của 840. Vậy mà output thật là <code>0.24999999999999997</code>. Những số như 30/840 không có dạng nhị phân chính xác; mỗi phần bị làm tròn khi lưu, và tổng của ba số đã làm tròn rơi xuống dưới 0.25 một bước rất nhỏ — cùng lý do khiến <code>0.1 + 0.2</code> ra <code>0.30000000000000004</code> trong JavaScript. Hai lối ra:</p>
<ul>
<li><code>toBeCloseTo(0.25)</code> — chấp nhận chênh lệch nhỏ hơn nửa đơn vị của chữ số cuối được kiểm (mặc định 2 chữ số thập phân; <code>toBeCloseTo(0.1786, 4)</code> kiểm bốn chữ số).</li>
<li>Tốt hơn với tiền và thời lượng: giữ <strong>số nguyên</strong> (xu, phút) trong code và chỉ chia khi hiển thị. Khi đó <code>toBe</code> chính xác. Một phiên bản <code>usageRate</code> cộng số phút trước rồi chia một lần cũng sẽ trả về đúng 0.25.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>toBeTruthy</code> xanh vì lý do sai.</strong> <code>expect(checkSlot('06:30', '08:00')).toBeTruthy()</code> xanh dù 06:30 <em>không hợp lệ</em>. <code>checkSlot</code> luôn trả về một object, và object nào cũng "truthy" — kể cả <code>{ ok: false }</code>. Test chẳng chứng minh gì về luật. Hãy nói đúng điều bạn muốn: <code>toEqual({ ok: false, code: 'OUTSIDE_HOURS' })</code>, hoặc ít nhất <code>toMatchObject({ ok: false })</code>. Chỉ dùng <code>toBeTruthy</code>/<code>toBeFalsy</code> cho giá trị thật sự là boolean hoặc có thể null.</p>
</div>

<h3>Lỗi: đưa cho expect một hàm, đừng đưa kết quả</h3>
<p>Lần hỏng thứ ba không phải lỗi khẳng định — mà là chính cái <code>TypeError</code> của <code>parseTime</code> thoát ra khỏi test. Trong <code>expect(parseTime('7h')).toThrow()</code>, JavaScript tính <code>parseTime('7h')</code> <em>trước</em> khi gọi <code>expect</code>; lỗi bị ném ngay tại chỗ và không ai bắt. Hãy bọc lời gọi trong hàm mũi tên: <code>expect(() =&gt; parseTime('7h'))</code>. Giờ <code>toThrow</code> tự gọi nó, bắt lỗi và so sánh:</p>
<ul>
<li><code>toThrow(TypeError)</code> — lỗi là <code>TypeError</code> (hoặc lớp con);</li>
<li><code>toThrow(/expected HH:MM/)</code> — thông báo khớp biểu thức chính quy;</li>
<li><code>toThrow('OUTSIDE_HOURS')</code> — thông báo có chứa đoạn chữ này;</li>
<li><code>toThrow()</code> trơn — <em>bất kỳ</em> lỗi nào, kể cả lỗi gõ nhầm trong chính code của bạn. Đứng một mình thì quá yếu.</li>
</ul>

<h3>Snapshot — và cái bẫy -u</h3>
<p>Snapshot (ảnh chụp) để Vitest tự viết giá trị mong đợi cho bạn. Bạn gõ</p>
${ma('javascript', SNAP_TRUOC.slice(SNAP_TRUOC.indexOf("it('inline snapshot'")))}
<p>và lần chạy đầu tự điền vào (output ở trên ghi <code>Snapshots 1 written</code>):</p>
${ma('javascript', SNAP_GIUA)}
<p>Rất tiện với output lớn mà bạn không muốn gõ tay. Giờ ta cài một con bug — cần duyệt từ 20 chỗ thay vì trên 30 — bằng cách đổi một dòng trong <code>needsApproval</code> thành <code>return seats &gt;= 20;</code>. Snapshot bắt được nó:</p>
${ra(OUT['12-snap-fail'])}
<p>Tới đây vẫn ổn. Nhưng một lập trình viên đang mệt thấy đỏ, cho rằng "chắc snapshot cũ rồi", và chạy với <code>-u</code> (cập nhật snapshot):</p>
${ra(OUT['12-snap-u'])}
${ma('javascript', SNAP_SAU_U)}
<p>Xanh — và con bug giờ là giá trị mong đợi, được chính test bảo vệ. Snapshot chỉ ghi lại thứ code đang làm <em>bây giờ</em>; nó chưa bao giờ biết code <em>nên</em> làm gì. Luật dùng: review phần thay đổi của snapshot trong pull request như review code, giữ snapshot nhỏ, dùng khẳng định tường minh cho luật nghiệp vụ, và trước khi gõ <code>-u</code> hãy hỏi "mình có định thay đổi hành vi này không?".</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li><code>needsApproval</code> với 0 chỗ ném <code>RangeError</code> có thông báo nhắc tới "positive integer".</li>
<li><code>usageRate</code> của 120 + 30 phút xấp xỉ 0.1786, kiểm tới 4 chữ số thập phân.</li>
<li><code>checkSlot('08:10', '09:00')</code> không ok và không có thuộc tính <code>minutes</code>.</li>
<li>Viết lại test <code>toBeTruthy</code> để nó sẽ đỏ nếu <code>checkSlot</code> chấp nhận 06:30.</li>
<li>Thử đột biến nhỏ: đổi <code>OPEN</code> thành <code>6 * 60</code> trong <code>booking.js</code>, chạy, rồi đổi lại.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th12)}
${ra(OUT['12-th'])}
<p>Với <code>OPEN = 6 * 60</code>:</p>
${ra(OUT['12-th-bug'])}
<p><strong>Đạt khi:</strong> file hiện <code>4 passed</code>; với thay đổi cài vào, test bạn viết lại chuyển đỏ (06:30 giờ được chấp nhận, <code>ok: true, minutes: 90</code>) — và test usage cũng đỏ, vì ngày làm việc thành 900 phút. Cái đỏ thứ hai là bài học tặng thêm: một hằng số dùng chung cho hai luật sẽ bị test của cả hai bắt được.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">matcher (bộ so khớp)</span><span class="v">Phép so sánh sau <code>expect(…)</code>: <code>toBe</code>, <code>toEqual</code>, <code>toThrow</code>…</span></div>
  <div class="kv"><span class="k">deep equality (so sánh sâu)</span><span class="v">So nội dung theo chiều sâu, không so danh tính trong bộ nhớ.</span></div>
  <div class="kv"><span class="k">floating point (số thực dấu phẩy động)</span><span class="v">Cách máy tính lưu số thập phân ở dạng nhị phân — nhiều số (0.1, 30/840) bị làm tròn.</span></div>
  <div class="kv"><span class="k">truthy / falsy</span><span class="v">Giá trị mà JavaScript coi là đúng/sai trong câu điều kiện; mọi object đều truthy.</span></div>
  <div class="kv"><span class="k">snapshot (ảnh chụp)</span><span class="v">Bản lưu của một output để các lần chạy sau so lại; <code>-u</code> ghi đè nó.</span></div>
  <div class="kv"><span class="k">mutation (đột biến, bug cài sẵn)</span><span class="v">Một thay đổi nhỏ cố ý trong code để kiểm test có thật sự đỏ không — Lab 1 tự động hoá việc này.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>toBe</code> kiểm danh tính (<code>Object.is</code>); so object thì dùng <code>toEqual</code>.</li>
<li><code>toStrictEqual</code> bắt thêm khoá <code>undefined</code> và kiểu; <code>toMatchObject</code> chỉ kiểm trường bạn nêu.</li>
<li>Số thập phân cần <code>toBeCloseTo</code> — hoặc dùng số nguyên ngay từ đầu.</li>
<li><code>toBeTruthy</code> với object chẳng chứng minh gì; hãy khẳng định đúng giá trị mong đợi.</li>
<li>Lỗi: <code>expect(() =&gt; call()).toThrow(Class hoặc /thông báo/)</code> — mũi tên là bắt buộc.</li>
<li>Snapshot ghi lại thứ code đang làm, không phải thứ code nên làm; <code>-u</code> có thể "hợp thức hoá" một con bug.</li>
</ul>
</div>
`,
};
