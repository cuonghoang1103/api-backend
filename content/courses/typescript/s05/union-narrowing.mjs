/**
 * TypeScript · Chương 5 · 5.1 — Kiểu union & thu hẹp kiểu. Slug giữ: typescript-5-1-union-narrowing.
 * BÀI MỞ CHƯƠNG 5 (soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md). Mọi code/output lấy từ ./_ma-ts-05-1.mjs
 * (sinh từ labflow-ts chạy thật: Node 22.23.3, tsc 7.0.2 — demo5/ts-05-1/).
 */
import G from '../giang/ts-05-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-05-1.mjs';

const BANG_EN = `<table>
<thead><tr><th>Guard</th><th>Narrows</th><th>Use it for</th><th>Watch out</th></tr></thead>
<tbody>
<tr><td><code>typeof x === 'string'</code></td><td>primitives: string, number, boolean, symbol, bigint, function, object, undefined</td><td>a union of primitives (<code>string | number</code>)</td><td><code>typeof null === 'object'</code> — null hides among objects</td></tr>
<tr><td><code>if (x)</code> (truthiness)</td><td>removes <code>null</code>, <code>undefined</code>, <code>0</code>, <code>''</code>, <code>NaN</code>, <code>false</code></td><td>drop <code>null</code>/<code>undefined</code> quickly</td><td>also drops <code>0</code> and <code>''</code> — a real zero falls through</td></tr>
<tr><td><code>x === 'LITERAL'</code></td><td>one member of a literal union</td><td>literal unions (5.2), the discriminant (5.3)</td><td>a literal outside the union is TS2367</td></tr>
<tr><td><code>'key' in x</code></td><td>object members that have that key</td><td>object unions (5.2, 5.3)</td><td>an optional key is a weak test</td></tr>
<tr><td><code>x instanceof C</code></td><td>to the class <code>C</code></td><td>errors in <code>catch</code>, DOM nodes (5.2)</td><td>only classes, not type aliases</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Guard</th><th>Thu hẹp về</th><th>Dùng cho</th><th>Cẩn thận</th></tr></thead>
<tbody>
<tr><td><code>typeof x === 'string'</code></td><td>primitive: string, number, boolean, symbol, bigint, function, object, undefined</td><td>union của primitive (<code>string | number</code>)</td><td><code>typeof null === 'object'</code> — null lẩn trong object</td></tr>
<tr><td><code>if (x)</code> (tính đúng/sai)</td><td>bỏ <code>null</code>, <code>undefined</code>, <code>0</code>, <code>''</code>, <code>NaN</code>, <code>false</code></td><td>bỏ nhanh <code>null</code>/<code>undefined</code></td><td>bỏ luôn <code>0</code> và <code>''</code> — số 0 thật bị lọt</td></tr>
<tr><td><code>x === 'LITERAL'</code></td><td>một thành viên của union literal</td><td>union literal (5.2), discriminant (5.3)</td><td>literal ngoài union là TS2367</td></tr>
<tr><td><code>'key' in x</code></td><td>thành viên object có khoá đó</td><td>union của object (5.2, 5.3)</td><td>khoá optional là phép thử yếu</td></tr>
<tr><td><code>x instanceof C</code></td><td>về lớp <code>C</code></td><td>lỗi trong <code>catch</code>, nút DOM (5.2)</td><td>chỉ với lớp (class), không với type alias</td></tr>
</tbody>
</table>`;

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Union</div><div class="lz-d"><code>A | B</code> — a value is one of these; only what A <em>and</em> B share is usable directly</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Test</div><div class="lz-d">a guard (<code>typeof</code>, truthiness, <code>===</code>, <code>in</code>, <code>instanceof</code>) that tsc understands</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Narrow</div><div class="lz-d">inside the branch the type is smaller — the member methods are now available</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">never</div><div class="lz-d">once every member is removed, what is left has type <code>never</code> (5.4)</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Union</div><div class="lz-d"><code>A | B</code> — giá trị là một trong hai; chỉ thứ A <em>và</em> B cùng có mới dùng được ngay</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Phép thử</div><div class="lz-d">một guard (<code>typeof</code>, đúng/sai, <code>===</code>, <code>in</code>, <code>instanceof</code>) mà tsc hiểu</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Thu hẹp</div><div class="lz-d">trong nhánh, kiểu nhỏ lại — các method của thành viên giờ dùng được</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">never</div><div class="lz-d">khi mọi thành viên đã bị loại, phần còn lại có kiểu <code>never</code> (5.4)</div></div>
</div>`;

export default {
  title: '5.1 — Union types & narrowing|||5.1 — Kiểu union & thu hẹp kiểu',
  slug: 'typescript-5-1-union-narrowing',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 5: một union (A | B) là "một trong các kiểu này" — chỉ dùng được thứ mọi thành viên cùng có (id.padStart ⇒ TS2339 vì number không có). Thu hẹp kiểu (narrowing) bằng guard mà tsc hiểu: typeof cho primitive, tính đúng/sai cho null/undefined (nhưng bẫy: cũng bỏ 0 và "" — một phòng 0 chỗ bị gán nhãn sai), control-flow analysis (gán lại thì tsc đổi kiểu theo), và khi mọi thành viên bị loại thì còn lại never. Đo thật bằng tsc 7.0.2 và Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Union types &amp; narrowing</h2>
<p class="lead">Real data is rarely one exact type. A lab id arrives as a <code>string</code> from the URL and as a <code>number</code> from an old table; a note is a <code>string</code> or <code>null</code>; a slot check is “ok with minutes” or “failed with a code”. A <strong>union type</strong> (kiểu union) says “one of these”, and <strong>narrowing</strong> (thu hẹp kiểu) is how you work with it safely: a small test that tsc reads, after which the type is smaller. This chapter is the heart of day-to-day TypeScript; this first lesson is the mechanism every later lesson builds on.</p>

<h3>After Chapter 5 you can…</h3>
<ul>
<li><strong>Write a union and narrow it</strong> with <code>typeof</code>, truthiness and control flow — and know the traps (this lesson).</li>
<li><strong>Narrow literal unions by value</strong> with <code>===</code>, <code>switch</code>, <code>in</code> and <code>instanceof</code>, starting from LabFlow’s <code>SlotResult</code> (5.2).</li>
<li><strong>Design a discriminated union</strong> (union có nhãn) and a <strong>type predicate</strong>, and build LabFlow’s booking state machine (5.3).</li>
<li><strong>Prove a switch is complete</strong> with <code>never</code> and <code>assertNever</code>, so a new case is a compile error — not a silent bug (5.4).</li>
<li><strong>Pass Lab 5</strong>: the booking state machine, where the grader adds a brand-new state and your code must refuse to compile.</li>
</ul>
<p>Why it matters: a union is how TypeScript describes the two things every program is full of — “this or that” values and “success or failure” results. Narrowing is the payoff of 2.1’s strict null checks: once <code>string | null</code> is honest, tsc makes you handle the <code>null</code>, and then lets you forget it. Interviewers ask “how does narrowing work?” and “what is a discriminated union?” — after this chapter you answer with output you ran.</p>

<h3>JavaScript: one function, two kinds of value</h3>
<p>A lab id is text in the URL (<code>'42'</code>) and a number in an older table (<code>42</code>). One helper has to badge both:</p>
${ma('javascript', CODE.idJs)}
${ra(OUT['11-js'])}
<p>The first call works; the second throws <code>id.padStart is not a function</code> — numbers have no <code>padStart</code>. JavaScript only finds out when that line runs, in production, for the one code path nobody clicked in testing.</p>

<h3>A union type says “one of these”</h3>
${ma('typescript', CODE.unionShow)}
${ra(OUT['12-union'])}
<p><code>string | number</code> is a union: the value is a <code>string</code> <em>or</em> a <code>number</code>. tsc lets you use only what <strong>both</strong> members have in common. <code>padStart</code> is a string method, so <code>id.padStart(…)</code> is <strong>TS2339</strong>, and the second line of the message names exactly the member that fails: <code>Property 'padStart' does not exist on type 'number'</code>. The bug from the last section is now a compile error.</p>

<h3>Narrowing with <code>typeof</code></h3>
<p>To use a string method you must first prove the value is a string. <code>typeof id === 'string'</code> is a test tsc understands, so inside that branch the type <em>narrows</em> to <code>string</code>:</p>
${ma('typescript', CODE.typeofShow)}
${ra(OUT['13-typeof'])}
<p>Both calls now work. Inside the <code>if</code>, <code>id</code> has type <code>string</code> (hover and you see it); after it, <code>id</code> is <code>number</code>. <code>typeof</code> narrowing covers the primitives — <code>'string'</code>, <code>'number'</code>, <code>'boolean'</code>, <code>'bigint'</code>, <code>'symbol'</code>, <code>'undefined'</code>, <code>'function'</code>, <code>'object'</code>. The one that bites: <code>typeof null</code> is <code>'object'</code>, so a <code>typeof x === 'object'</code> test still includes <code>null</code> — a reason to prefer an explicit <code>x === null</code> check, next.</p>

<h3>Narrowing by truthiness — and the <code>0</code> trap</h3>
<p>The quickest way to drop <code>null</code> is <code>if (x)</code>. It works, but it removes more than you may want:</p>
${ma('typescript', CODE.truthyNote)}
${ra(OUT['14-truthy'])}
<p><code>preview</code> is correct: <code>if (note)</code> narrows <code>string | null</code> to <code>string</code>, so <code>.slice</code> is safe. But <code>seatsLabel</code> has a bug you can read in the output: <code>seatsLabel(0)</code> prints <strong>“seats unknown”</strong>. Truthiness removes every falsy value — <code>0</code>, <code>''</code>, <code>NaN</code>, <code>false</code> — not only <code>null</code> and <code>undefined</code>. A real zero-seat room falls into the wrong branch. When <code>0</code> or <code>''</code> is a valid value, test for what you actually mean: <code>if (seats !== undefined)</code>. This is the same lesson as <code>||</code> versus <code>??</code> from 2.1, now in a narrowing guard.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — truthiness narrowing silently eats <code>0</code> and <code>''</code>.</strong> <code>if (count)</code>, <code>count || fallback</code> and <code>count ? a : b</code> all treat a real <code>0</code> as “missing”. Use <code>if (count !== undefined)</code> / <code>count ?? fallback</code> whenever the empty value is legal — a seat count, a price, a note that may be the empty string. The compiler cannot catch this one: both branches type-check; only the output is wrong.</p>
</div>

<h3>Control-flow analysis: tsc follows your code</h3>
<p>Narrowing is not just inside an <code>if</code>. tsc tracks the type along every path — an assignment changes it from that line on:</p>
${ma('typescript', CODE.cfaReassign)}
${ra(OUT['15-cfa'])}
<p>After <code>id = 42</code>, tsc knows <code>id</code> is <code>number</code>, so <code>id.toFixed(0)</code> needs no guard. This is <strong>control-flow analysis</strong> (phân tích luồng điều khiển): the type of a variable depends on where you are in the function, not only on how it was declared. A <code>return</code>, a <code>throw</code>, a reassignment — each one updates what tsc knows next.</p>

<h3>When nothing is left: <code>never</code></h3>
${ma('typescript', CODE.exhaustNever)}
${ra(OUT['16-exhaust'])}
<p>After the <code>string</code> and <code>number</code> branches both <code>return</code>, no member of <code>Id</code> is left — so on the last line <code>id</code> has type <code>never</code>, the empty type. Passing it to a function that wants <code>never</code> compiles (0 errors above); passing anything real there would not. That is the whole trick behind exhaustiveness checking in 5.4 — here it just means the function has handled every case.</p>

<h3>When to reach for a union</h3>
${BANG_EN}

<h3>🗺 How narrowing works</h3>
${FLOW_EN}

<h3>💼 Interview corner</h3>
<p><strong>“What is a union type?”</strong> A type that is one of several — <code>A | B</code>; a value of it may be used only as the members have in common, until you narrow. <strong>“How does narrowing work?”</strong> A runtime test the compiler also understands (<code>typeof</code>, truthiness, <code>===</code>, <code>in</code>, <code>instanceof</code>) shrinks the type inside the branch; tsc does control-flow analysis, so the type depends on where you are. <strong>“A gotcha with <code>if (x)</code>?”</strong> It removes <code>0</code> and <code>''</code> too, not just <code>null</code>/<code>undefined</code> — use an explicit check when the empty value is real.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo5/ts-05-1/practice/start/level.ts</code> — a sensor reading is a temperature (<code>number</code>) or the word <code>'offline'</code> (<code>string</code>). The label helper does not compile:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['17-pr-start'])}
<ol>
<li>Why is this TS2339, and on which member? Narrow with <code>typeof</code> so the number branch formats the temperature and the string branch returns the word.</li>
<li>Run it: a reading of <code>21.5</code> and one of <code>'offline'</code> must each print a sensible line.</li>
</ol>
<p><strong>Solution</strong> — narrow by type, keep the two answers apart:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['19-pr-sol'])}
<p><strong>Done when:</strong> tsc is clean and Node prints <code>21.5°C</code> then <code>sensor offline</code>. Code Lab has four more: the <code>string | number</code> badge, the truthiness <code>0</code> trap on a seat count, a <code>string | null</code> note, and a union whose <code>never</code> branch proves it is complete.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">union type</span><span class="v"><code>A | B</code> — a value that is one of several types.</span></div>
  <div class="kv"><span class="k">narrowing</span><span class="v">Shrinking a union to a smaller type inside a branch, via a test tsc understands.</span></div>
  <div class="kv"><span class="k">type guard</span><span class="v">The test itself: <code>typeof</code>, truthiness, <code>===</code>, <code>in</code>, <code>instanceof</code>.</span></div>
  <div class="kv"><span class="k">control-flow analysis</span><span class="v">tsc tracks a variable’s type along each path; an assignment or a return changes it.</span></div>
  <div class="kv"><span class="k">never</span><span class="v">The empty type — what is left when every member of a union has been removed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A union <code>A | B</code> allows only what every member shares; <code>id.padStart</code> on <code>string | number</code> is TS2339 (“not on number”).</li>
<li><code>typeof</code> narrows primitives; inside the branch the type is smaller. Remember <code>typeof null === 'object'</code>.</li>
<li>Truthiness (<code>if (x)</code>) drops <code>null</code>/<code>undefined</code> — and also <code>0</code>, <code>''</code>, <code>NaN</code>, <code>false</code>: a real <code>0</code> fell through to “seats unknown”.</li>
<li>Control-flow analysis means a variable’s type depends on where you are — an assignment narrows from that line on.</li>
<li>When every member is removed, the value has type <code>never</code> — the basis of exhaustiveness (5.4).</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Narrowing', 'typeof guards, truthiness, equality, control-flow analysis, the never type. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html')}
${nguon('📘', 'TypeScript Handbook — Everyday Types: Union Types', 'Declaring unions and working with their members. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-4-2-select-where', title: 'The same NULL, one layer down — PostgreSQL 4.2: SELECT … WHERE and NULL', sub: 'Same idea: a value that may be absent must be handled on purpose, not by accident. Different: there NULL is a database value three-valued logic treats specially; here <code>string | null</code> is a type tsc forces you to narrow before use — and the <code>0</code>/empty-string truthiness trap is unique to the narrowing guard.', cta: 'OPEN POSTGRESQL LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Kiểu union &amp; thu hẹp kiểu</h2>
<p class="lead">Dữ liệu thật hiếm khi đúng một kiểu. Mã phòng lab đến từ URL là <code>string</code> còn từ bảng cũ là <code>number</code>; một ghi chú là <code>string</code> hoặc <code>null</code>; một lần kiểm slot là “ổn, kèm số phút” hoặc “hỏng, kèm một mã”. <strong>Kiểu union</strong> (union type) nói “một trong các kiểu này”, và <strong>thu hẹp kiểu</strong> (narrowing) là cách dùng nó an toàn: một phép thử nhỏ mà tsc đọc được, sau đó kiểu nhỏ lại. Chương này là trái tim của TypeScript hằng ngày; bài đầu tiên này là cơ chế mà mọi bài sau dựa vào.</p>

<h3>Học xong Chương 5 bạn làm được…</h3>
<ul>
<li><strong>Viết một union và thu hẹp nó</strong> bằng <code>typeof</code>, tính đúng/sai và luồng điều khiển — và biết các bẫy (bài này).</li>
<li><strong>Thu hẹp union literal theo giá trị</strong> bằng <code>===</code>, <code>switch</code>, <code>in</code> và <code>instanceof</code>, bắt đầu từ <code>SlotResult</code> của LabFlow (5.2).</li>
<li><strong>Thiết kế một discriminated union</strong> (union có nhãn) và một <strong>type predicate</strong> (vị từ kiểu), dựng máy trạng thái lượt đặt của LabFlow (5.3).</li>
<li><strong>Chứng minh một switch là đầy đủ</strong> bằng <code>never</code> và <code>assertNever</code>, để một case mới là lỗi biên dịch — không phải bug âm thầm (5.4).</li>
<li><strong>Qua Lab 5</strong>: máy trạng thái lượt đặt, nơi máy chấm thêm một trạng thái hoàn toàn mới và code của bạn phải từ chối biên dịch.</li>
</ul>
<p>Vì sao quan trọng: union là cách TypeScript mô tả hai thứ mọi chương trình đầy rẫy — giá trị “cái này hoặc cái kia” và kết quả “thành công hoặc thất bại”. Thu hẹp kiểu là phần thưởng của strict null checks ở 2.1: khi <code>string | null</code> đã trung thực, tsc bắt bạn xử lý <code>null</code>, rồi cho phép bạn quên nó đi. Nhà tuyển dụng hay hỏi “narrowing hoạt động thế nào?” và “discriminated union là gì?” — sau chương này bạn trả lời bằng output tự chạy.</p>

<h3>JavaScript: một hàm, hai loại giá trị</h3>
<p>Mã phòng là chữ trong URL (<code>'42'</code>) và là số trong bảng cũ (<code>42</code>). Một hàm phải gắn nhãn cho cả hai:</p>
${ma('javascript', CODE.idJs)}
${ra(OUT['11-js'])}
<p>Lần gọi đầu chạy được; lần thứ hai ném <code>id.padStart is not a function</code> — số không có <code>padStart</code>. JavaScript chỉ biết khi dòng đó chạy, trên production, cho đúng nhánh mà không ai bấm lúc kiểm thử.</p>

<h3>Kiểu union nói “một trong các kiểu này”</h3>
${ma('typescript', CODE.unionShow)}
${ra(OUT['12-union'])}
<p><code>string | number</code> là một union: giá trị là <code>string</code> <em>hoặc</em> <code>number</code>. tsc chỉ cho dùng thứ mà <strong>cả hai</strong> thành viên cùng có. <code>padStart</code> là method của chuỗi, nên <code>id.padStart(…)</code> là <strong>TS2339</strong>, và dòng thứ hai của thông báo gọi đúng tên thành viên bị lỗi: <code>Property 'padStart' does not exist on type 'number'</code>. Bug của phần trước giờ là lỗi biên dịch.</p>

<h3>Thu hẹp bằng <code>typeof</code></h3>
<p>Muốn dùng method của chuỗi, trước hết phải chứng minh giá trị là chuỗi. <code>typeof id === 'string'</code> là phép thử tsc hiểu, nên trong nhánh đó kiểu <em>thu hẹp</em> về <code>string</code>:</p>
${ma('typescript', CODE.typeofShow)}
${ra(OUT['13-typeof'])}
<p>Cả hai lần gọi giờ đều chạy. Trong <code>if</code>, <code>id</code> có kiểu <code>string</code> (rê chuột sẽ thấy); sau nó, <code>id</code> là <code>number</code>. <code>typeof</code> phủ các primitive — <code>'string'</code>, <code>'number'</code>, <code>'boolean'</code>, <code>'bigint'</code>, <code>'symbol'</code>, <code>'undefined'</code>, <code>'function'</code>, <code>'object'</code>. Cái hay cắn: <code>typeof null</code> là <code>'object'</code>, nên phép thử <code>typeof x === 'object'</code> vẫn bao gồm <code>null</code> — một lý do nên dùng thẳng <code>x === null</code>, ngay dưới.</p>

<h3>Thu hẹp theo tính đúng/sai — và bẫy <code>0</code></h3>
<p>Cách nhanh nhất để bỏ <code>null</code> là <code>if (x)</code>. Nó chạy được, nhưng bỏ nhiều hơn bạn muốn:</p>
${ma('typescript', CODE.truthyNote)}
${ra(OUT['14-truthy'])}
<p><code>preview</code> đúng: <code>if (note)</code> thu hẹp <code>string | null</code> về <code>string</code>, nên <code>.slice</code> an toàn. Nhưng <code>seatsLabel</code> có một bug đọc được ngay trong output: <code>seatsLabel(0)</code> in <strong>“seats unknown”</strong>. Tính đúng/sai loại bỏ mọi giá trị falsy — <code>0</code>, <code>''</code>, <code>NaN</code>, <code>false</code> — không chỉ <code>null</code> và <code>undefined</code>. Một phòng 0 chỗ thật rơi vào nhánh sai. Khi <code>0</code> hay <code>''</code> là giá trị hợp lệ, hãy thử đúng điều bạn muốn nói: <code>if (seats !== undefined)</code>. Đây cùng bài học <code>||</code> so với <code>??</code> của 2.1, lần này trong một guard thu hẹp.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — thu hẹp theo tính đúng/sai âm thầm nuốt <code>0</code> và <code>''</code>.</strong> <code>if (count)</code>, <code>count || fallback</code> và <code>count ? a : b</code> đều coi một <code>0</code> thật là “thiếu”. Dùng <code>if (count !== undefined)</code> / <code>count ?? fallback</code> mỗi khi giá trị rỗng là hợp lệ — số chỗ, giá tiền, ghi chú có thể là chuỗi rỗng. Trình biên dịch không bắt được cái này: cả hai nhánh đều qua kiểm kiểu; chỉ output là sai.</p>
</div>

<h3>Phân tích luồng điều khiển: tsc đi theo code của bạn</h3>
<p>Thu hẹp không chỉ nằm trong <code>if</code>. tsc theo dõi kiểu dọc mọi đường đi — một phép gán đổi kiểu từ dòng đó trở đi:</p>
${ma('typescript', CODE.cfaReassign)}
${ra(OUT['15-cfa'])}
<p>Sau <code>id = 42</code>, tsc biết <code>id</code> là <code>number</code>, nên <code>id.toFixed(0)</code> không cần guard. Đó là <strong>control-flow analysis</strong> (phân tích luồng điều khiển): kiểu của một biến phụ thuộc bạn đang ở đâu trong hàm, không chỉ phụ thuộc cách nó được khai báo. Một <code>return</code>, một <code>throw</code>, một phép gán lại — mỗi cái cập nhật điều tsc biết tiếp theo.</p>

<h3>Khi không còn gì: <code>never</code></h3>
${ma('typescript', CODE.exhaustNever)}
${ra(OUT['16-exhaust'])}
<p>Sau khi hai nhánh <code>string</code> và <code>number</code> đều <code>return</code>, không còn thành viên nào của <code>Id</code> — nên ở dòng cuối <code>id</code> có kiểu <code>never</code>, kiểu rỗng. Truyền nó vào một hàm cần <code>never</code> thì biên dịch được (0 lỗi ở trên); truyền thứ gì có thật vào đó thì không. Đó chính là mẹo đằng sau kiểm tra đầy đủ ở 5.4 — ở đây nó chỉ có nghĩa là hàm đã xử lý mọi trường hợp.</p>

<h3>Khi nào dùng union</h3>
${BANG_VI}

<h3>🗺 Thu hẹp kiểu hoạt động thế nào</h3>
${FLOW_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Kiểu union là gì?”</strong> Một kiểu là một trong nhiều kiểu — <code>A | B</code>; một giá trị của nó chỉ dùng được theo thứ các thành viên cùng có, cho tới khi bạn thu hẹp. <strong>“Narrowing hoạt động thế nào?”</strong> Một phép thử lúc chạy mà trình biên dịch cũng hiểu (<code>typeof</code>, đúng/sai, <code>===</code>, <code>in</code>, <code>instanceof</code>) làm kiểu nhỏ lại trong nhánh; tsc phân tích luồng, nên kiểu phụ thuộc bạn đang ở đâu. <strong>“Một cái bẫy với <code>if (x)</code>?”</strong> Nó bỏ cả <code>0</code> và <code>''</code>, không chỉ <code>null</code>/<code>undefined</code> — dùng phép thử tường minh khi giá trị rỗng là thật.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo5/ts-05-1/practice/start/level.ts</code> — một số đo cảm biến là nhiệt độ (<code>number</code>) hoặc chữ <code>'offline'</code> (<code>string</code>). Hàm gắn nhãn không biên dịch được:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['17-pr-start'])}
<ol>
<li>Vì sao là TS2339, và ở thành viên nào? Thu hẹp bằng <code>typeof</code> để nhánh số định dạng nhiệt độ còn nhánh chuỗi trả về chữ.</li>
<li>Chạy thử: số đo <code>21.5</code> và một số đo <code>'offline'</code> mỗi cái phải in một dòng hợp lý.</li>
</ol>
<p><strong>Lời giải</strong> — thu hẹp theo kiểu, giữ tách hai câu trả lời:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['19-pr-sol'])}
<p><strong>Đạt khi:</strong> tsc sạch và Node in <code>21.5°C</code> rồi <code>sensor offline</code>. Code Lab có thêm bốn bài: badge <code>string | number</code>, bẫy tính đúng/sai với <code>0</code> trên số chỗ, một ghi chú <code>string | null</code>, và một union có nhánh <code>never</code> chứng minh nó đầy đủ.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">union type (kiểu union)</span><span class="v"><code>A | B</code> — một giá trị là một trong vài kiểu.</span></div>
  <div class="kv"><span class="k">narrowing (thu hẹp kiểu)</span><span class="v">Làm một union nhỏ lại trong một nhánh, bằng phép thử tsc hiểu.</span></div>
  <div class="kv"><span class="k">type guard</span><span class="v">Chính phép thử: <code>typeof</code>, đúng/sai, <code>===</code>, <code>in</code>, <code>instanceof</code>.</span></div>
  <div class="kv"><span class="k">control-flow analysis</span><span class="v">tsc theo kiểu của biến dọc mỗi đường; một phép gán hay return đổi nó.</span></div>
  <div class="kv"><span class="k">never</span><span class="v">Kiểu rỗng — thứ còn lại khi mọi thành viên của union đã bị loại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Union <code>A | B</code> chỉ cho dùng thứ mọi thành viên cùng có; <code>id.padStart</code> trên <code>string | number</code> là TS2339 (“không có ở number”).</li>
<li><code>typeof</code> thu hẹp primitive; trong nhánh kiểu nhỏ lại. Nhớ <code>typeof null === 'object'</code>.</li>
<li>Tính đúng/sai (<code>if (x)</code>) bỏ <code>null</code>/<code>undefined</code> — và cả <code>0</code>, <code>''</code>, <code>NaN</code>, <code>false</code>: một <code>0</code> thật lọt xuống “seats unknown”.</li>
<li>Phân tích luồng điều khiển nghĩa là kiểu của một biến phụ thuộc bạn đang ở đâu — một phép gán thu hẹp từ dòng đó.</li>
<li>Khi mọi thành viên bị loại, giá trị có kiểu <code>never</code> — nền tảng của kiểm tra đầy đủ (5.4).</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Narrowing', 'typeof guard, tính đúng/sai, so sánh, phân tích luồng, kiểu never. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html')}
${nguon('📘', 'TypeScript Handbook — Everyday Types: Union Types', 'Khai báo union và làm việc với các thành viên của nó. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-4-2-select-where', title: 'Cùng một NULL, ở tầng dưới — PostgreSQL 4.2: SELECT … WHERE và NULL', sub: 'Giống: một giá trị có thể vắng phải được xử lý có chủ ý, không phải tình cờ. Khác: ở đó NULL là giá trị của CSDL mà logic ba trị xử lý riêng; ở đây <code>string | null</code> là một kiểu tsc bắt bạn thu hẹp trước khi dùng — và bẫy <code>0</code>/chuỗi-rỗng của tính đúng/sai là riêng của guard thu hẹp.', cta: 'MỞ BÀI POSTGRESQL →' })}
</div>
`,
};
