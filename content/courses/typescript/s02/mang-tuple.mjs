/**
 * TypeScript · Chương 2 · 2.2 — Mảng, tuple & readonly. Slug giữ: typescript-2-2-mang-tuple (soạn lại TRỌN 01/11/2026 theo _HOP-DONG.md).
 * Mọi code/output lấy từ ./_ma-ts-02-2.mjs (SINH TỰ ĐỘNG từ labflow-ts demo2/ts-02-2 chạy thật: Node 22.23.3, tsc 7.0.2; Java 21.0.9).
 */
import G from '../giang/ts-02-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-02-2.mjs';

const IDX = OUT['25-index'].split('\n');
const INDEX_ERR = [IDX[0]].concat(IDX.filter((l, i) => i > 0 && (/index\.ts/.test(l) || (i > 1 && /index\.ts/.test(IDX[i - 1]))))).join('\n');
const WRONG = OUT['21-tuple-wrong'].split('\n');
const WRONG_LEN = WRONG.slice(0, 3).join('\n');
const WRONG_REST = [WRONG[0]].concat(WRONG.slice(3)).join('\n');

const BANG_EN = `<table>
<thead><tr><th>Changes the array (gone from <code>readonly T[]</code>)</th><th>Returns a new array instead</th><th>Since</th></tr></thead>
<tbody>
<tr><td><code>a.sort(cmp)</code></td><td><code>a.toSorted(cmp)</code></td><td>ES2023</td></tr>
<tr><td><code>a.reverse()</code></td><td><code>a.toReversed()</code></td><td>ES2023</td></tr>
<tr><td><code>a.splice(i, n)</code></td><td><code>a.toSpliced(i, n)</code> or <code>a.filter(…)</code></td><td>ES2023</td></tr>
<tr><td><code>a[i] = x</code></td><td><code>a.with(i, x)</code> or <code>a.map(…)</code></td><td>ES2023</td></tr>
<tr><td><code>a.push(x)</code>, <code>a.unshift(x)</code></td><td><code>[...a, x]</code>, <code>[x, ...a]</code></td><td>ES2015</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Sửa chính mảng (bị gỡ khỏi <code>readonly T[]</code>)</th><th>Trả về mảng mới thay vào đó</th><th>Có từ</th></tr></thead>
<tbody>
<tr><td><code>a.sort(cmp)</code></td><td><code>a.toSorted(cmp)</code></td><td>ES2023</td></tr>
<tr><td><code>a.reverse()</code></td><td><code>a.toReversed()</code></td><td>ES2023</td></tr>
<tr><td><code>a.splice(i, n)</code></td><td><code>a.toSpliced(i, n)</code> hoặc <code>a.filter(…)</code></td><td>ES2023</td></tr>
<tr><td><code>a[i] = x</code></td><td><code>a.with(i, x)</code> hoặc <code>a.map(…)</code></td><td>ES2023</td></tr>
<tr><td><code>a.push(x)</code>, <code>a.unshift(x)</code></td><td><code>[...a, x]</code>, <code>[x, ...a]</code></td><td>ES2015</td></tr>
</tbody>
</table>`;

const LOCK_EN = `<table>
<thead><tr><th>Lock</th><th>Checked when</th><th>What happens on <code>push</code></th></tr></thead>
<tbody>
<tr><td>TypeScript <code>readonly T[]</code></td><td>compile time, by tsc</td><td>TS2339 in the editor; at runtime nothing (the type is erased)</td></tr>
<tr><td><code>Object.freeze(arr)</code></td><td>runtime, by JavaScript</td><td><code>TypeError: Cannot add property 2, object is not extensible</code></td></tr>
<tr><td>Java <code>List.of(…)</code> (PRO192)</td><td>runtime, by the JVM</td><td>javac accepts <code>add</code>; <code>UnsupportedOperationException</code> when it runs</td></tr>
<tr><td><code>const</code></td><td>—</td><td>allowed: <code>const</code> only stops you re-pointing the variable, not changing the array</td></tr>
</tbody>
</table>`;
const LOCK_VI = `<table>
<thead><tr><th>Khoá</th><th>Kiểm lúc nào</th><th>Chuyện gì xảy ra khi <code>push</code></th></tr></thead>
<tbody>
<tr><td>TypeScript <code>readonly T[]</code></td><td>lúc biên dịch, do tsc</td><td>TS2339 ngay trong editor; lúc chạy thì không gì cả (kiểu đã bị xoá)</td></tr>
<tr><td><code>Object.freeze(arr)</code></td><td>lúc chạy, do JavaScript</td><td><code>TypeError: Cannot add property 2, object is not extensible</code></td></tr>
<tr><td>Java <code>List.of(…)</code> (PRO192)</td><td>lúc chạy, do JVM</td><td>javac nhận <code>add</code>; ném <code>UnsupportedOperationException</code> khi chạy</td></tr>
<tr><td><code>const</code></td><td>—</td><td>vẫn được: <code>const</code> chỉ cấm trỏ biến sang mảng khác, không cấm sửa mảng</td></tr>
</tbody>
</table>`;

const CHON_EN = `<table>
<thead><tr><th>You have…</th><th>Write</th><th>LabFlow example</th></tr></thead>
<tbody>
<tr><td>many values of the same kind, any count</td><td><code>T[]</code> (same as <code>Array&lt;T&gt;</code>)</td><td>the bookings you are building up: <code>ScheduleEntry[]</code></td></tr>
<tr><td>a list you only <em>read</em> (parameters, shared data)</td><td><code>readonly T[]</code></td><td><code>sortByStart(schedule: readonly ScheduleEntry[])</code></td></tr>
<tr><td>a fixed, small group where each position has one meaning</td><td><code>readonly [start: number, end: number]</code></td><td><code>TimeRange</code></td></tr>
<tr><td>more than 2–3 fields, or positions nobody would guess</td><td>an object type (Chapter 4)</td><td><code>{ id, lab, range, bookedBy, note }</code></td></tr>
</tbody>
</table>`;
const CHON_VI = `<table>
<thead><tr><th>Bạn có…</th><th>Viết</th><th>Ví dụ LabFlow</th></tr></thead>
<tbody>
<tr><td>nhiều giá trị cùng loại, số lượng bất kỳ</td><td><code>T[]</code> (giống hệt <code>Array&lt;T&gt;</code>)</td><td>danh sách lượt đặt bạn đang gom: <code>ScheduleEntry[]</code></td></tr>
<tr><td>một danh sách bạn chỉ <em>đọc</em> (tham số, dữ liệu dùng chung)</td><td><code>readonly T[]</code></td><td><code>sortByStart(schedule: readonly ScheduleEntry[])</code></td></tr>
<tr><td>một nhóm nhỏ, cố định, mỗi vị trí đúng một nghĩa</td><td><code>readonly [start: number, end: number]</code></td><td><code>TimeRange</code></td></tr>
<tr><td>hơn 2–3 trường, hoặc vị trí không ai đoán được</td><td>kiểu object (Chương 4)</td><td><code>{ id, lab, range, bookedBy, note }</code></td></tr>
</tbody>
</table>`;

export default {
  title: '2.2 — Arrays, tuples & readonly|||2.2 — Mảng, tuple & readonly',
  slug: 'typescript-2-2-mang-tuple',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mảng có kiểu (T[] và Array<T>), bug thật "hàm sắp xếp xáo luôn mảng của người gọi" trên lịch phòng LabFlow và readonly chặn nó (TS2339, TS4104), toSorted/with/spread thay cho sort/push; readonly chỉ là lời hứa lúc biên dịch (so với Object.freeze và List.of của Java, đo thật); tuple TimeRange [start, end] có nhãn, các lỗi TS2322/TS2493, lỗ push của tuple thường và readonly tuple (TS2540); tuple và mảng dưới noUncheckedIndexedAccess; Object.entries.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Arrays, tuples &amp; readonly</h2>
<p class="lead">Lists are everywhere in LabFlow: the bookings of a day, the labs, the start and end of a time slot. This lesson gives each of them the right type. You will watch a real bug — a function that quietly reorders an array it was only supposed to read — and stop it with one word, <code>readonly</code>. Then you model a time range as a <strong>tuple</strong>, “exactly two numbers: start, then end”, the type Lab 2 is built on.</p>

<h3>What you will be able to do, and why it matters</h3>
<ul>
<li>Type lists with <code>T[]</code> and mark the ones you only read <code>readonly T[]</code>, so tsc refuses <code>sort</code>/<code>push</code> on someone else’s array (TS2339, TS4104).</li>
<li>Explain why <code>readonly</code> protects nothing at runtime, and when <code>Object.freeze</code> is the tool.</li>
<li>Model fixed-size data as a labelled, read-only tuple and read TS2322, TS2493, TS2540 — then choose between array, tuple and object.</li>
</ul>
<p>Why it matters: “who changed my array?” is one of the most common bugs in React code (state that was mutated instead of replaced) and in Express services (a helper that sorts the list the controller still uses). In your SWP391 team the person who writes the helper is rarely the person who calls it. A <code>readonly</code> in the signature turns that unwritten agreement into one the compiler enforces. Lab 2 uses both ideas: the schedule is <code>readonly ScheduleEntry[]</code> and every booking time is a <code>TimeRange</code> tuple.</p>

<h3>The data of this lesson</h3>
<p>One day of lab BE-201, in the order the bookings were <em>made</em>. A time is a number of minutes since midnight (480 is 08:00, the same convention as <code>parseTime</code> in Chapter 1):</p>
${ma('typescript', CODE.data)}
<p>Notice <code>range: [number, number]</code>: that is already a tuple. We come back to it in the second half; for now, focus on the array of entries.</p>

<h3>Typed arrays: two spellings, one meaning</h3>
${ma('typescript', CODE.basics)}
${ra(OUT['10-basics'])}
<ul>
<li><code>string[]</code> and <code>Array&lt;number&gt;</code> are the same kind of type, written two ways. The second is the <em>generic</em> spelling you will fully understand in Chapter 6.</li>
<li>An array type is a promise about <em>every</em> element, so <code>push</code> of the wrong kind is TS2345 (wrong argument), in both directions.</li>
<li><code>['BE-201', 480]</code> has no annotation, so tsc infers the <strong>best common type</strong> <code>(string | number)[]</code> (lesson 1.3). Reading <code>mixed[0]</code> gives <code>string | number | undefined</code>: <code>number</code> because the list allows it, <code>undefined</code> because the course tsconfig has <code>noUncheckedIndexedAccess</code> and the list might be empty (lesson 1.2).</li>
</ul>

<h3>The bug: a helper that reorders someone else’s array</h3>
<p>The schedule page shows a timeline sorted by start time, and a “latest booking” label — the last booking that was made, which is simply the last element of the list. A teammate writes the sort helper:</p>
${ma('typescript', CODE.mutate)}
${ra(OUT['11-mutate-tsc'])}
${ra(OUT['12-mutate-run'])}
<p>tsc is silent and the code runs, but the label is now wrong: it says #1 (An, booked first) instead of #3 (Chi, booked last). The last line explains it: <code>sort</code> does not make a sorted copy; it <strong>reorders the array in place and returns that same array</strong>. The page and the timeline share one array, so sorting “the timeline” sorted the page’s data too. Nothing crashed — this is the silent kind of bug from lesson 1.1, and in a real app it surfaces far away from the helper that caused it.</p>

<h3>readonly arrays: the promise goes into the type</h3>
<p>Put <code>readonly</code> in front of the array type of the parameter. The function body is unchanged:</p>
${ma('typescript', CODE.readonly)}
${ra(OUT['13-readonly'])}
<p><code>readonly ScheduleEntry[]</code> is the same array type with every method that would change it <strong>removed</strong>. <code>sort</code> and <code>push</code> no longer exist on it (TS2339 “Property does not exist”), nor do <code>splice</code>, <code>reverse</code> or <code>list[0] = …</code>. Reading methods (<code>map</code>, <code>filter</code>, <code>at</code>…) stay. The fix is to return a <strong>new</strong> array:</p>
${ma('typescript', CODE.fixed)}
${ra(OUT['14-fixed-tsc'])}
${ra(OUT['14-fixed-run'])}
<p>The timeline is sorted (#2 #3 #1) and the original keeps its booking order (#1 #2 #3); adding a booking gives a list of 4 while the original still has 3. Every mutating method has a copying partner:</p>
${BANG_EN}

<h3>Which way assignment goes</h3>
${ma('typescript', CODE.direction)}
${ra(OUT['15-direction'])}
<p>Passing my <em>mutable</em> array to a function that only reads is fine — line 10 has no error. Passing a <em>read-only</em> array to a function that may change it is refused with TS4104, because <code>shuffle</code> would break the promise someone else made. That gives you a practical rule: <strong>a parameter you only read should be <code>readonly</code></strong>. It costs nothing, it accepts strictly more callers (both kinds of array), and it documents your intention where the caller can see it.</p>

<h3>readonly is a compile-time promise, not a lock</h3>
<p>Remember lesson 0.4: Node strips the types before running. A <code>readonly</code> array is an ordinary array at runtime:</p>
${ma('typescript', CODE.erased)}
${ra(OUT['17-runtime-tsc'])}
${ra(OUT['16-runtime'])}
<p>With an <code>as</code> cast (the lie from lesson 1.2) the “read-only” array happily grew to <code>[480, 600, 720]</code>. <code>Object.freeze</code> is different: it locks the object <em>at runtime</em>, so the push threw a <code>TypeError</code> — and tsc already types the result of <code>Object.freeze([480, 600])</code> as <code>readonly number[]</code>, so without the cast you would get the compile error too. Java programmers from PRO192 know a third kind of lock:</p>
${ma('java', CODE.java)}
${ra(OUT['40-java'])}
${LOCK_EN}
<p>So the TypeScript habit is: <code>readonly</code> in types everywhere (free, catches mistakes in the editor), and <code>Object.freeze</code> only for values that untrusted or untyped code can reach — for example a shared constants module used from plain JavaScript.</p>

<h3>Tuples: a fixed length and a meaning for each position</h3>
<p>A booking time is not “some numbers”; it is exactly two: start, then end. A <strong>tuple</strong> type says exactly that. The labels <code>start:</code> and <code>end:</code> are optional; they change nothing for tsc but show up in the editor when you hover or call, so use them:</p>
${ma('typescript', CODE.range)}
${ra(OUT['20-range-run'])}
<p><code>toRange</code> reuses <code>parseTime</code> from Chapter 1; <code>?? ''</code> is needed because a piece of <code>split('-')</code> may be <code>undefined</code> (lesson 2.1). Destructuring a tuple by position — <code>const [start, end] = …</code> — reads naturally because the positions have names.</p>

<h3>What tsc refuses for a tuple</h3>
${ma('typescript', CODE.wrong)}
${ra(WRONG_LEN)}
<p>First, the length: three numbers do not fit a pair, and tsc says so precisely, “Source has 3 element(s) but target allows only 2”. Then the rest:</p>
${ra(WRONG_REST)}
<ul>
<li><strong>Line 4</strong> — each position has its own type; <code>'08:00'</code> is a string, not minutes. Two errors, one per element.</li>
<li><strong>Line 5</strong> — TS2493: position 2 does not exist on a tuple of length 2. For an ordinary array tsc cannot know the length, so this check only exists for tuples.</li>
<li><strong>Line 8</strong> — <code>const guess = [480, 600]</code> was inferred as <code>number[]</code>, <em>not</em> as a tuple: an array literal widens to an array (the widening of lesson 1.3). A <code>number[]</code> “may have fewer” than two elements, so it cannot become a <code>TimeRange</code>. Fix: annotate where the value is created (<code>const guess: TimeRange = …</code>), or return it from a function whose return type is <code>TimeRange</code>, as <code>toRange</code> does.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a mutable tuple is still an array, <code>push</code> included.</strong></p>
${ma('typescript', CODE.hole)}
${ra(OUT['22-hole-tsc'])}
${ra(OUT['23-hole-run'])}
<p>tsc accepted <code>push</code> and the “pair” now has three elements. TypeScript checks the length of a tuple when you <em>create</em> or <em>assign</em> one, but a plain tuple type keeps every array method, so it can grow afterwards. The course’s <code>TimeRange</code> is therefore <strong>readonly</strong>:</p>
${ma('typescript', CODE.holeFixed)}
${ra(OUT['24-hole-fixed'])}
<p><code>push</code> is gone (TS2339) and a position cannot be reassigned (TS2540 “Cannot assign to '0' because it is a read-only property”). To move a booking, build a new range: <code>[r[0] + 30, r[1] + 30]</code>.</p>
</div>

<h3>Tuples and arrays under <code>noUncheckedIndexedAccess</code></h3>
${ma('typescript', CODE.index)}
${ra(INDEX_ERR)}
<p>Line 7 is fine: a tuple of length 2 <em>knows</em> that position 0 exists, so <code>range[0]</code> is a plain <code>number</code>. Line 8 is refused: <code>starts</code> is an array, it might be empty, so <code>starts[0]</code> is <code>number | undefined</code>. This is a second, very practical reason to use tuples for fixed-size data — no <code>?? 0</code> or extra checks when you read a position you know is there.</p>
<p>You meet tuples even when you never write one. <code>Object.entries</code> turns an object into a list of <code>[key, value]</code> pairs:</p>
${ma('typescript', CODE.entries)}
${ra(OUT['26-entries-run'])}
<p>Its type is <code>[string, number][]</code> — an array of tuples, the key always a <code>string</code> (the last line of the file is refused with exactly that type in the message). React’s <code>useState</code> returns a tuple as well, <code>[value, setValue]</code>, which is why <code>const [count, setCount] = useState(0)</code> works so neatly.</p>

<h3>Array, tuple or object?</h3>
${CHON_EN}
<p>The test for a tuple: would a teammate reading <code>r[1]</code> know what it is without looking anything up? For <code>[start, end]</code> yes — a time range is a well-known pair, and the labels say it anyway. For <code>['BE-201', 480, 'An', true]</code> no — that should be an object with named fields.</p>

<!-- SODO-TS -->
<h3>🗺 Who is allowed to change this list?</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Creator</div><div class="lz-d">builds it as <code>T[]</code> — push while collecting</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Hands it out</div><div class="lz-d">as <code>readonly T[]</code> — mutable → readonly is always allowed</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Helpers read</div><div class="lz-d"><code>sort</code>/<code>push</code> are TS2339; they return new arrays</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Runtime</div><div class="lz-d">types erased; <code>Object.freeze</code> if untyped code can reach it</div></div>
</div>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo2/ts-02-2/practice/start/range.ts</code> types a range as <code>number[]</code>:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['30-pr-start-tsc'])}
${ra(OUT['31-pr-start-run'])}
<ol>
<li>Read the two TS2532 errors. Why does tsc think <code>range[1]</code> might be <code>undefined</code>?</li>
<li>Node prints <code>-120</code> for the nonsense call. Which type would have refused <code>[600, 480, 30]</code> before running?</li>
<li>Introduce <code>TimeRange</code> as a readonly labelled tuple, use it in both functions, and delete the nonsense call.</li>
</ol>
<p><strong>Solution and real output.</strong> 1: <code>number[]</code> has no fixed length, so under <code>noUncheckedIndexedAccess</code> every index read may be <code>undefined</code>. 2 and 3:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['32-pr-sol-tsc'])}
${ra(OUT['33-pr-sol-run'])}
<p>And the nonsense call, kept in a separate file, is now refused:</p>
${ma('typescript', CODE.prBad)}
${ra(OUT['34-pr-refused'])}
<p><strong>Done when:</strong> tsc is clean on your solution, Node prints <code>120</code>, and a three-number range is TS2345. Code Lab has four more exercises for this lesson: a non-mutating sort, the <code>TimeRange</code> tuple, closing the push hole, and the free gaps of a day.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">array type <code>T[]</code> / <code>Array&lt;T&gt;</code></span><span class="v">Any number of elements, all of type T. Two spellings, same type.</span></div>
  <div class="kv"><span class="k">readonly array</span><span class="v"><code>readonly T[]</code>: the same array with every mutating method removed from the type.</span></div>
  <div class="kv"><span class="k">mutate in place</span><span class="v">Change the existing array (<code>sort</code>, <code>push</code>) instead of returning a new one.</span></div>
  <div class="kv"><span class="k">tuple</span><span class="v">An array type with a fixed length and a type for each position: <code>[number, string]</code>.</span></div>
  <div class="kv"><span class="k">labelled tuple</span><span class="v"><code>[start: number, end: number]</code>: names for positions, shown in the editor.</span></div>
  <div class="kv"><span class="k"><code>Object.freeze</code></span><span class="v">A runtime lock: writes to the frozen object throw in strict mode (ES modules are strict).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>T[]</code> = <code>Array&lt;T&gt;</code>. <code>sort</code> reorders in place and returns the same array (measured: “latest booking” #3 became #1). A parameter you only read is <code>readonly T[]</code>: tsc refuses <code>sort</code>/<code>push</code> (TS2339); use <code>toSorted</code>, <code>with</code>, spread.</li>
<li>Mutable → readonly is allowed, readonly → mutable is TS4104. <code>readonly</code> is erased at runtime; <code>Object.freeze</code> (and Java’s <code>List.of</code>) fail only when the code runs.</li>
<li>A tuple fixes length and per-position types (TS2322, TS2493); an array literal is inferred as an array, not a tuple. Make tuples <code>readonly</code> — a plain tuple still has <code>push</code>.</li>
<li>Under <code>noUncheckedIndexedAccess</code> a tuple position is a plain type; an array index is <code>T | undefined</code>.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Object Types: tuple types, readonly tuple types, the ReadonlyArray type', 'Labelled and optional tuple elements, readonly arrays and why readonly → mutable is refused. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types')}
${nguon('📗', 'MDN — Array.prototype.toSorted()', 'The copying version of sort() (ES2023, Node.js 20+). Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted')}
${lienKet({ khoa: 'react', bai: 'rx-2-3-object-array', title: 'Same bug in the React course — 2.3: Updating objects and arrays immutably', sub: 'Same: sort() reorders the array it was given and toSorted() returns a copy; never mutate state or props. Different: there you learn the rule and measure what breaks on screen; here readonly makes tsc refuse sort/push on a list you do not own, before anything renders.', cta: 'OPEN REACT LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Mảng, tuple &amp; readonly</h2>
<p class="lead">Danh sách có ở khắp nơi trong LabFlow: các lượt đặt của một ngày, các phòng lab, giờ bắt đầu và giờ kết thúc của một ca. Bài này cho mỗi thứ đúng kiểu của nó. Bạn sẽ xem một bug thật — một hàm lặng lẽ xếp lại mảng mà lẽ ra nó chỉ được đọc — và chặn nó bằng đúng một từ, <code>readonly</code>. Rồi bạn mô hình khoảng giờ bằng <strong>tuple</strong>, “đúng hai con số: bắt đầu, rồi kết thúc” — kiểu mà Lab 2 dựng trên đó.</p>

<h3>Học xong bạn làm được gì, và vì sao có ích</h3>
<ul>
<li>Gõ kiểu danh sách bằng <code>T[]</code> và đánh dấu danh sách chỉ đọc là <code>readonly T[]</code>, để tsc từ chối <code>sort</code>/<code>push</code> trên mảng của người khác (TS2339, TS4104).</li>
<li>Giải thích vì sao <code>readonly</code> không bảo vệ gì lúc chạy, và khi nào cần <code>Object.freeze</code>.</li>
<li>Mô hình dữ liệu kích thước cố định bằng tuple có nhãn, chỉ đọc, đọc được TS2322, TS2493, TS2540 — rồi chọn giữa mảng, tuple và object.</li>
</ul>
<p>Vì sao quan trọng: “ai đã sửa mảng của tôi?” là một trong những bug hay gặp nhất trong code React (state bị sửa thẳng thay vì thay mới) và trong service Express (một hàm phụ sắp xếp đúng danh sách mà controller vẫn đang dùng). Trong nhóm SWP391, người viết hàm phụ hiếm khi là người gọi nó. Một chữ <code>readonly</code> trong chữ ký hàm biến thoả thuận ngầm ấy thành thoả thuận mà trình biên dịch giữ hộ. Lab 2 dùng cả hai ý: lịch phòng là <code>readonly ScheduleEntry[]</code> và mọi giờ đặt là tuple <code>TimeRange</code>.</p>

<h3>Dữ liệu của bài</h3>
<p>Một ngày của phòng BE-201, theo thứ tự các lượt được <em>đặt</em>. Giờ là số phút tính từ nửa đêm (480 là 08:00, cùng quy ước với <code>parseTime</code> ở Chương 1):</p>
${ma('typescript', CODE.data)}
<p>Để ý <code>range: [number, number]</code>: đó đã là một tuple. Nửa sau của bài sẽ quay lại; lúc này hãy tập trung vào mảng các lượt đặt.</p>

<h3>Mảng có kiểu: hai cách viết, một ý nghĩa</h3>
${ma('typescript', CODE.basics)}
${ra(OUT['10-basics'])}
<ul>
<li><code>string[]</code> và <code>Array&lt;number&gt;</code> là cùng một loại kiểu, viết theo hai cách. Cách thứ hai là cách viết <em>generic</em> mà bạn sẽ hiểu trọn ở Chương 6.</li>
<li>Kiểu mảng là lời hứa về <em>mọi</em> phần tử, nên <code>push</code> sai loại là TS2345 (đối số sai kiểu), theo cả hai chiều.</li>
<li><code>['BE-201', 480]</code> không có chú thích, nên tsc suy ra <strong>kiểu chung tốt nhất (best common type)</strong> <code>(string | number)[]</code> (bài 1.3). Đọc <code>mixed[0]</code> ra <code>string | number | undefined</code>: có <code>number</code> vì danh sách cho phép, có <code>undefined</code> vì tsconfig của khoá bật <code>noUncheckedIndexedAccess</code> và danh sách có thể rỗng (bài 1.2).</li>
</ul>

<h3>Con bug: hàm phụ xếp lại mảng của người khác</h3>
<p>Trang lịch hiện một dòng thời gian sắp theo giờ bắt đầu, và nhãn “lượt đặt mới nhất” — lượt được đặt sau cùng, tức đơn giản là phần tử cuối của danh sách. Một bạn cùng nhóm viết hàm sắp xếp:</p>
${ma('typescript', CODE.mutate)}
${ra(OUT['11-mutate-tsc'])}
${ra(OUT['12-mutate-run'])}
<p>tsc im lặng và code chạy được, nhưng nhãn giờ đã sai: nó ghi #1 (An, đặt đầu tiên) thay vì #3 (Chi, đặt sau cùng). Dòng cuối giải thích vì sao: <code>sort</code> không tạo bản sao đã sắp; nó <strong>xếp lại chính mảng đó tại chỗ và trả về đúng mảng ấy</strong>. Trang và dòng thời gian dùng chung một mảng, nên sắp “dòng thời gian” là sắp luôn dữ liệu của trang. Không gì sập — đây là loại bug im lặng ở bài 1.1, và trong ứng dụng thật nó lộ ra ở chỗ rất xa cái hàm gây ra nó.</p>

<h3>Mảng readonly: lời hứa nằm trong kiểu</h3>
<p>Đặt <code>readonly</code> trước kiểu mảng của tham số. Thân hàm giữ nguyên:</p>
${ma('typescript', CODE.readonly)}
${ra(OUT['13-readonly'])}
<p><code>readonly ScheduleEntry[]</code> là đúng kiểu mảng đó nhưng mọi phương thức làm thay đổi nó đều bị <strong>gỡ bỏ</strong>. <code>sort</code> và <code>push</code> không còn tồn tại (TS2339 “Property does not exist”), <code>splice</code>, <code>reverse</code> hay <code>list[0] = …</code> cũng vậy. Các phương thức chỉ đọc (<code>map</code>, <code>filter</code>, <code>at</code>…) vẫn còn. Cách sửa là trả về một mảng <strong>mới</strong>:</p>
${ma('typescript', CODE.fixed)}
${ra(OUT['14-fixed-tsc'])}
${ra(OUT['14-fixed-run'])}
<p>Dòng thời gian đã được sắp (#2 #3 #1) còn bản gốc giữ thứ tự đặt (#1 #2 #3); thêm một lượt đặt cho ra danh sách 4 phần tử trong khi bản gốc vẫn có 3. Phương thức sửa mảng nào cũng có một “người anh em” trả bản sao:</p>
${BANG_VI}

<h3>Phép gán đi theo chiều nào</h3>
${ma('typescript', CODE.direction)}
${ra(OUT['15-direction'])}
<p>Đưa mảng <em>thường</em> của tôi cho một hàm chỉ đọc thì được — dòng 10 không lỗi. Đưa mảng <em>chỉ đọc</em> cho một hàm có thể sửa nó thì bị từ chối với TS4104, vì <code>shuffle</code> sẽ phá lời hứa mà người khác đã đưa ra. Từ đó có một luật thực dụng: <strong>tham số nào bạn chỉ đọc thì nên là <code>readonly</code></strong>. Nó không tốn gì, nhận được nhiều người gọi hơn (cả hai loại mảng), và ghi rõ ý định của bạn ở đúng chỗ người gọi nhìn thấy.</p>

<h3>readonly là lời hứa lúc biên dịch, không phải ổ khoá</h3>
<p>Nhớ bài 0.4: Node xoá kiểu trước khi chạy. Mảng <code>readonly</code> lúc chạy chỉ là một mảng bình thường:</p>
${ma('typescript', CODE.erased)}
${ra(OUT['17-runtime-tsc'])}
${ra(OUT['16-runtime'])}
<p>Với một phép ép kiểu <code>as</code> (lời nói dối ở bài 1.2), mảng “chỉ đọc” vui vẻ dài ra thành <code>[480, 600, 720]</code>. <code>Object.freeze</code> thì khác: nó khoá object <em>lúc chạy</em>, nên lần push ném <code>TypeError</code> — và tsc vốn đã gõ kiểu kết quả của <code>Object.freeze([480, 600])</code> là <code>readonly number[]</code>, nên nếu không ép kiểu bạn cũng nhận lỗi biên dịch. Bạn nào đã học PRO192 biết thêm một loại khoá thứ ba:</p>
${ma('java', CODE.java)}
${ra(OUT['40-java'])}
${LOCK_VI}
<p>Vậy thói quen TypeScript là: <code>readonly</code> trong kiểu ở mọi nơi (miễn phí, bắt lỗi ngay trong editor), còn <code>Object.freeze</code> chỉ dành cho giá trị mà code không có kiểu hoặc không đáng tin có thể chạm tới — ví dụ một module hằng số dùng chung với JavaScript thuần.</p>

<h3>Tuple: độ dài cố định và mỗi vị trí một nghĩa</h3>
<p>Giờ của một lượt đặt không phải “vài con số”; nó là đúng hai số: bắt đầu, rồi kết thúc. Kiểu <strong>tuple</strong> nói đúng điều đó. Nhãn <code>start:</code> và <code>end:</code> là tuỳ chọn; chúng không đổi gì với tsc nhưng hiện ra trong editor khi bạn rê chuột hay gọi hàm, nên hãy dùng:</p>
${ma('typescript', CODE.range)}
${ra(OUT['20-range-run'])}
<p><code>toRange</code> dùng lại <code>parseTime</code> của Chương 1; cần <code>?? ''</code> vì một mảnh của <code>split('-')</code> có thể là <code>undefined</code> (bài 2.1). Tách tuple theo vị trí — <code>const [start, end] = …</code> — đọc rất tự nhiên vì các vị trí đã có tên.</p>

<h3>tsc từ chối gì với một tuple</h3>
${ma('typescript', CODE.wrong)}
${ra(WRONG_LEN)}
<p>Trước hết là độ dài: ba số không vừa một cặp, và tsc nói chính xác: “Source has 3 element(s) but target allows only 2” (nguồn có 3 phần tử nhưng đích chỉ cho 2). Rồi phần còn lại:</p>
${ra(WRONG_REST)}
<ul>
<li><strong>Dòng 4</strong> — mỗi vị trí có kiểu riêng; <code>'08:00'</code> là chuỗi, không phải số phút. Hai lỗi, mỗi phần tử một lỗi.</li>
<li><strong>Dòng 5</strong> — TS2493: vị trí 2 không tồn tại trên tuple dài 2. Với mảng thường tsc không biết độ dài, nên phép kiểm này chỉ có ở tuple.</li>
<li><strong>Dòng 8</strong> — <code>const guess = [480, 600]</code> được suy ra là <code>number[]</code>, <em>không</em> phải tuple: một mảng literal bị nới thành mảng (phép nới kiểu ở bài 1.3). Một <code>number[]</code> “có thể có ít hơn” hai phần tử, nên không thể thành <code>TimeRange</code>. Cách sửa: chú thích ngay chỗ tạo giá trị (<code>const guess: TimeRange = …</code>), hoặc trả nó về từ một hàm có kiểu trả về <code>TimeRange</code>, như <code>toRange</code>.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tuple thường vẫn là mảng, có cả <code>push</code>.</strong></p>
${ma('typescript', CODE.hole)}
${ra(OUT['22-hole-tsc'])}
${ra(OUT['23-hole-run'])}
<p>tsc chấp nhận <code>push</code> và “cặp số” giờ có ba phần tử. TypeScript kiểm độ dài tuple khi bạn <em>tạo</em> hoặc <em>gán</em> nó, nhưng kiểu tuple thường vẫn giữ mọi phương thức của mảng, nên sau đó nó vẫn dài ra được. Vì thế <code>TimeRange</code> của khoá là <strong>readonly</strong>:</p>
${ma('typescript', CODE.holeFixed)}
${ra(OUT['24-hole-fixed'])}
<p><code>push</code> biến mất (TS2339) và không gán lại được một vị trí (TS2540 “Cannot assign to '0' because it is a read-only property”). Muốn dời lượt đặt thì tạo khoảng mới: <code>[r[0] + 30, r[1] + 30]</code>.</p>
</div>

<h3>Tuple và mảng dưới <code>noUncheckedIndexedAccess</code></h3>
${ma('typescript', CODE.index)}
${ra(INDEX_ERR)}
<p>Dòng 7 ổn: tuple dài 2 <em>biết</em> vị trí 0 tồn tại, nên <code>range[0]</code> là <code>number</code> trơn. Dòng 8 bị từ chối: <code>starts</code> là mảng, có thể rỗng, nên <code>starts[0]</code> là <code>number | undefined</code>. Đây là lý do thứ hai, rất thực tế, để dùng tuple cho dữ liệu kích thước cố định — không cần <code>?? 0</code> hay kiểm thêm khi đọc một vị trí bạn biết chắc là có.</p>
<p>Bạn gặp tuple kể cả khi chưa bao giờ tự viết. <code>Object.entries</code> biến một object thành danh sách các cặp <code>[khoá, giá trị]</code>:</p>
${ma('typescript', CODE.entries)}
${ra(OUT['26-entries-run'])}
<p>Kiểu của nó là <code>[string, number][]</code> — một mảng các tuple, khoá luôn là <code>string</code> (dòng cuối của tệp bị từ chối với đúng kiểu đó trong thông báo). <code>useState</code> của React cũng trả về một tuple, <code>[giá trị, hàm đổi giá trị]</code>, nên <code>const [count, setCount] = useState(0)</code> mới gọn như vậy.</p>

<h3>Mảng, tuple hay object?</h3>
${CHON_VI}
<p>Phép thử cho tuple: một bạn cùng nhóm đọc <code>r[1]</code> có biết nó là gì mà không phải tra không? Với <code>[start, end]</code> thì có — khoảng giờ là một cặp ai cũng hiểu, và nhãn đã nói luôn. Với <code>['BE-201', 480, 'An', true]</code> thì không — thứ đó nên là object có tên trường.</p>

<h3>🗺 Ai được phép sửa danh sách này?</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Người tạo</div><div class="lz-d">dựng nó là <code>T[]</code> — push trong lúc gom</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Đưa ra ngoài</div><div class="lz-d">dưới dạng <code>readonly T[]</code> — thường → chỉ đọc luôn được phép</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Hàm phụ đọc</div><div class="lz-d"><code>sort</code>/<code>push</code> là TS2339; chúng trả mảng mới</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Lúc chạy</div><div class="lz-d">kiểu bị xoá; <code>Object.freeze</code> nếu code không kiểu chạm tới được</div></div>
</div>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p><code>demo2/ts-02-2/practice/start/range.ts</code> gõ kiểu khoảng giờ là <code>number[]</code>:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['30-pr-start-tsc'])}
${ra(OUT['31-pr-start-run'])}
<ol>
<li>Đọc hai lỗi TS2532. Vì sao tsc cho rằng <code>range[1]</code> có thể là <code>undefined</code>?</li>
<li>Node in <code>-120</code> cho lời gọi vô nghĩa. Kiểu nào lẽ ra đã từ chối <code>[600, 480, 30]</code> trước khi chạy?</li>
<li>Thêm <code>TimeRange</code> là tuple có nhãn và readonly, dùng nó cho cả hai hàm, và xoá lời gọi vô nghĩa.</li>
</ol>
<p><strong>Lời giải và output thật.</strong> 1: <code>number[]</code> không có độ dài cố định, nên dưới <code>noUncheckedIndexedAccess</code> mọi lần đọc theo chỉ số đều có thể là <code>undefined</code>. 2 và 3:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['32-pr-sol-tsc'])}
${ra(OUT['33-pr-sol-run'])}
<p>Còn lời gọi vô nghĩa, để riêng ở một tệp, giờ bị từ chối:</p>
${ma('typescript', CODE.prBad)}
${ra(OUT['34-pr-refused'])}
<p><strong>Đạt khi:</strong> tsc sạch trên lời giải của bạn, Node in <code>120</code>, và khoảng giờ ba số là TS2345. Code Lab có thêm bốn bài cho bài học này: sắp xếp không sửa mảng gốc, tuple <code>TimeRange</code>, bịt lỗ push, và các khoảng trống trong ngày.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">array type (kiểu mảng) <code>T[]</code> / <code>Array&lt;T&gt;</code></span><span class="v">Số phần tử bất kỳ, tất cả kiểu T. Hai cách viết, cùng một kiểu.</span></div>
  <div class="kv"><span class="k">readonly array (mảng chỉ đọc)</span><span class="v"><code>readonly T[]</code>: đúng mảng đó nhưng mọi phương thức sửa mảng bị gỡ khỏi kiểu.</span></div>
  <div class="kv"><span class="k">mutate in place (sửa tại chỗ)</span><span class="v">Thay đổi chính mảng đang có (<code>sort</code>, <code>push</code>) thay vì trả về mảng mới.</span></div>
  <div class="kv"><span class="k">tuple (bộ có thứ tự)</span><span class="v">Kiểu mảng có độ dài cố định và kiểu riêng cho từng vị trí: <code>[number, string]</code>.</span></div>
  <div class="kv"><span class="k">labelled tuple (tuple có nhãn)</span><span class="v"><code>[start: number, end: number]</code>: tên cho các vị trí, hiện trong editor.</span></div>
  <div class="kv"><span class="k"><code>Object.freeze</code> (đóng băng)</span><span class="v">Khoá lúc chạy: ghi vào object đã đóng băng sẽ ném lỗi ở strict mode (ES module luôn strict).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>T[]</code> = <code>Array&lt;T&gt;</code>. <code>sort</code> xếp lại tại chỗ và trả về chính mảng đó (đo thật: “lượt đặt mới nhất” #3 thành #1). Tham số chỉ đọc thì là <code>readonly T[]</code>: tsc từ chối <code>sort</code>/<code>push</code> (TS2339); dùng <code>toSorted</code>, <code>with</code>, spread.</li>
<li>Thường → chỉ đọc thì được, chỉ đọc → thường là TS4104. <code>readonly</code> bị xoá lúc chạy; <code>Object.freeze</code> (và <code>List.of</code> của Java) chỉ hỏng khi code chạy.</li>
<li>Tuple cố định độ dài và kiểu từng vị trí (TS2322, TS2493); mảng literal được suy ra là mảng, không phải tuple. Để tuple <code>readonly</code> — tuple thường vẫn có <code>push</code>.</li>
<li>Dưới <code>noUncheckedIndexedAccess</code>, vị trí của tuple là kiểu trơn; đọc mảng theo chỉ số là <code>T | undefined</code>.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Object Types: tuple types, readonly tuple types, kiểu ReadonlyArray', 'Phần tử tuple có nhãn và tuỳ chọn, mảng chỉ đọc và vì sao chỉ đọc → thường bị từ chối. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types')}
${nguon('📗', 'MDN — Array.prototype.toSorted()', 'Phiên bản sao chép của sort() (ES2023, Node.js 20+). Đọc ngày 1/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted')}
${lienKet({ khoa: 'react', bai: 'rx-2-3-object-array', title: 'Cùng con bug ở khoá React — 2.3: Cập nhật object và mảng bất biến', sub: 'Giống: sort() xếp lại chính mảng được đưa vào còn toSorted() trả bản sao; không bao giờ sửa thẳng state hay props. Khác: bên đó bạn học luật và đo thứ hỏng trên màn hình; ở đây readonly khiến tsc từ chối sort/push trên danh sách không phải của bạn, trước khi có gì được render.', cta: 'MỞ BÀI REACT →' })}
</div>
`,
};
