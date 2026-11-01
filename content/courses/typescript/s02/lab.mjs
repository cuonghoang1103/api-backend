/**
 * TypeScript · Chương 2 · Lab 2 — Bật strict cho lịch phòng lab. BÀI MỚI 01/11/2026, slug typescript-2-6-lab-lich-phong (đứng TRƯỚC quiz 2.5).
 * Máy chấm = scripts/cham-lab-2.mjs trong dự án LabFlow TS (tsc 7.0.2 + node 22.23.3 thật): A 2 · B 1 · C 1 · D 2 · E 8 × 0,5; đạt 7.
 * Số đo thật: strict:false 0 lỗi / strict 10 lỗi · khởi đầu 1/10 (0/8) · lần thử "! và as" 4/10 (0/8, test xanh) · lần thử "null thật, mảng thường" 7/10 (4/8)
 * · tham khảo 10/10. Mọi code/output lấy từ ./_ma-ts-lab-2.mjs (SINH TỰ ĐỘNG, đừng sửa tay).
 */
import G from '../giang/ts-lab-2.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-2.mjs';

const NPM_CI = OUT['l1-npm-ci'].split('\n').filter((l) => !/^npm notice/.test(l)).join('\n');
const GD = CODE.grader.split('\n');
const GRADER_GON = GD.slice(0, 7).concat(['// …'], GD.slice(28, 29), ['// …'], GD.slice(53, 56)).join('\n');
const YEU = CODE.yeu.split('\n');
const YEU_DONG = [YEU[23], YEU[24], '…', YEU[27], YEU[28], '…', YEU[35], YEU[36], '…', YEU[44], YEU[45]].join('\n');
const VUA = CODE.vua.split('\n');
const VUA_KIEU = VUA.slice(4, 16).join('\n');
const VUA_VA = VUA.slice(47, 55).join('\n');
const TEST_DAU = CODE.test.split('\n').slice(0, 26).join('\n') + '\n…';

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong use</th><th>tsc must say</th><th>The starter, run by Node</th><th>What it means for a user</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>findEntry(today, 7).bookedBy</code></td><td>TS2532</td><td>throws <code>TypeError: Cannot read properties of undefined</code></td><td>the booking page crashes on a deleted booking</td></tr>
<tr><td>S2</td><td><code>entry.note.toUpperCase()</code></td><td>TS18047</td><td>throws <code>… of null (reading 'toUpperCase')</code></td><td>crash on every booking without a note</td></tr>
<tr><td>S3</td><td><code>entry.cancelledAt.slice(0, 10)</code></td><td>TS18048</td><td>throws <code>… of undefined (reading 'slice')</code></td><td>crash on every booking that is NOT cancelled</td></tr>
<tr><td>S4</td><td><code>firstStart(today, 'AL-301') + 30</code></td><td>TS2531</td><td>returns <code>30</code>, no error</td><td>“AL-301 opens at 00:30” for a lab that is free all day</td></tr>
<tr><td>S5</td><td>a range of three numbers</td><td>TS2322</td><td><code>[480,600]</code> — the third time vanishes</td><td>a booking silently ends at 10:00 instead of 12:00</td></tr>
<tr><td>S6</td><td><code>entry.range[0] = 0</code></td><td>TS2540</td><td><code>[0,720]</code>, no error</td><td>a shared booking now “starts at midnight” on every screen</td></tr>
<tr><td>S7</td><td><code>lab: 'BE-999'</code></td><td>TS2322</td><td>accepted, no error</td><td>a booking for a room that does not exist</td></tr>
<tr><td>S8</td><td><code>LABS.push('BE-999')</code></td><td>TS2339</td><td>four labs now, no error</td><td>the room list grows at runtime</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng sai</th><th>tsc phải báo</th><th>Bản khởi đầu, Node chạy thật</th><th>Với người dùng nghĩa là gì</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>findEntry(today, 7).bookedBy</code></td><td>TS2532</td><td>ném <code>TypeError: Cannot read properties of undefined</code></td><td>trang đặt phòng sập khi gặp lượt đặt đã bị xoá</td></tr>
<tr><td>S2</td><td><code>entry.note.toUpperCase()</code></td><td>TS18047</td><td>ném <code>… of null (reading 'toUpperCase')</code></td><td>sập với mọi lượt đặt không có ghi chú</td></tr>
<tr><td>S3</td><td><code>entry.cancelledAt.slice(0, 10)</code></td><td>TS18048</td><td>ném <code>… of undefined (reading 'slice')</code></td><td>sập với mọi lượt đặt CHƯA bị huỷ</td></tr>
<tr><td>S4</td><td><code>firstStart(today, 'AL-301') + 30</code></td><td>TS2531</td><td>trả <code>30</code>, không lỗi</td><td>“AL-301 mở lúc 00:30” cho một phòng trống cả ngày</td></tr>
<tr><td>S5</td><td>khoảng giờ có ba số</td><td>TS2322</td><td><code>[480,600]</code> — giờ thứ ba biến mất</td><td>lượt đặt âm thầm kết thúc 10:00 thay vì 12:00</td></tr>
<tr><td>S6</td><td><code>entry.range[0] = 0</code></td><td>TS2540</td><td><code>[0,720]</code>, không lỗi</td><td>một lượt đặt dùng chung giờ “bắt đầu lúc nửa đêm” ở mọi màn hình</td></tr>
<tr><td>S7</td><td><code>lab: 'BE-999'</code></td><td>TS2322</td><td>được nhận, không lỗi</td><td>lượt đặt cho một phòng không tồn tại</td></tr>
<tr><td>S8</td><td><code>LABS.push('BE-999')</code></td><td>TS2339</td><td>thành bốn phòng, không lỗi</td><td>danh sách phòng tự dài ra lúc chạy</td></tr>
</tbody>
</table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th><th>The habit it trains</th></tr></thead>
<tbody>
<tr><td>A — your file compiles</td><td>2</td><td><code>tsc -p</code> with the course tsconfig (strict, <code>noUncheckedIndexedAccess</code>)</td><td>every “maybe missing” is written in the type</td></tr>
<tr><td>B — correct uses still compile</td><td>1</td><td>tsc on <code>kiem/phai-dung.ts</code>: NULL notes, no <code>cancelledAt</code>, a read-only list, <code>range[0]</code>, <code>LABS[0]</code></td><td>types that describe the real data, not just strict ones</td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, no <code>as</code> cast (<code>as const</code> is fine), no <code>!</code> assertion, no <code>@ts-</code> directive</td><td>handle the missing case, don’t promise it away</td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code> runs the 13 tests in <code>test/schedule.test.ts</code></td><td>the runtime bugs strict mode cannot see (<code>||</code>, a sort that mutates)</td></tr>
<tr><td>E — wrong uses refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has an error with the expected code</td><td>types that catch the crashes and the silent ones</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th><th>Thói quen nó rèn</th></tr></thead>
<tbody>
<tr><td>A — tệp của bạn biên dịch được</td><td>2</td><td><code>tsc -p</code> với tsconfig của khoá (strict, <code>noUncheckedIndexedAccess</code>)</td><td>mọi chỗ “có thể thiếu” đều được viết vào kiểu</td></tr>
<tr><td>B — cách dùng đúng vẫn biên dịch được</td><td>1</td><td>tsc trên <code>kiem/phai-dung.ts</code>: ghi chú NULL, không có <code>cancelledAt</code>, danh sách chỉ đọc, <code>range[0]</code>, <code>LABS[0]</code></td><td>kiểu mô tả đúng dữ liệu thật, không chỉ chặt</td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, không ép kiểu <code>as</code> (<code>as const</code> thì được), không khẳng định <code>!</code>, không chỉ thị <code>@ts-</code></td><td>xử lý trường hợp thiếu, đừng hứa cho qua</td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code> chạy 13 test trong <code>test/schedule.test.ts</code></td><td>những bug lúc chạy strict không thấy (<code>||</code>, sort làm đổi mảng)</td></tr>
<tr><td>E — cách dùng sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có lỗi đúng mã mong đợi</td><td>kiểu bắt được cả lỗi sập lẫn lỗi im lặng</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 2 — Strict null on the lab schedule|||Lab 2 — Bật strict cho lịch phòng lab',
  slug: 'typescript-2-6-lab-lich-phong',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 2 có thang chấm 10 điểm và máy chấm chạy tsc + Node thật: một tệp lịch phòng (schedule.ts) do bạn cùng nhóm viết khi dự án còn tắt strict (0 lỗi) bật strict lên ra 10 lỗi; bạn sửa để nó trung thực về null/undefined (string | null, cancelledAt?, | undefined, | null), dùng tuple chỉ đọc cho khoảng giờ và as const cho danh sách phòng, không any/as/!, 13 test vẫn xanh (bẫy || và sort làm đổi mảng), và 8 cách dùng sai bị tsc từ chối đúng mã. Có output thật của bản khởi đầu (1/10), lần thử "! và as" (4/10 — test xanh, 0/8), lần thử "null thật, mảng thường" (7/10) và lời giải (10/10).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lab 2</span>
<h2>Strict null on the lab schedule</h2>
<p class="lead">60–90 minutes. A teammate wrote LabFlow’s schedule module while the project still had <code>"strict": false</code>. It compiles with zero errors. You switch the project to the course’s strict config and get ten. Your job is the one every team faces when it turns strict on: make the file <strong>honest</strong> — say in the types which values can be missing, which lists are fixed, what shape a time range has — without silencing the compiler, without changing behaviour, and with types that refuse the eight mistakes a teammate will make next. When you finish, you can take any loosely-typed module at work and tighten it step by step; a script grades you out of 10 by running tsc and Node, like a CI server.</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>Lesson 2.1</strong> — <code>note: string | null</code> for a database NULL, <code>cancelledAt?: string</code> for a field that is absent, <code>?? </code> instead of <code>||</code>.</li>
<li><strong>Lesson 2.2</strong> — <code>readonly ScheduleEntry[]</code> parameters, a copy instead of an in-place <code>sort</code>, and a <strong>tuple</strong> <code>readonly [start: number, end: number]</code> for a time range.</li>
<li><strong>Lesson 2.3</strong> — <code>| undefined</code> and <code>| null</code> in return types instead of a promise the code cannot keep.</li>
<li><strong>Lesson 2.4</strong> — one list of labs with <code>as const</code> and a type <em>derived</em> from it.</li>
</ul>

<h3>Setup</h3>
<ol>
<li>Use the course project <code>labflow-ts</code> at the end of Chapter 2 and install exactly the pinned versions — <code>npm ci</code> uses the lock file:
${ra(NPM_CI)}</li>
<li>The <strong>reference solution</strong> lives in <code>src/rules/schedule.ts</code> (with its tests). Don’t open it before you have tried — you work only in <code>lab2/src/schedule.ts</code>. The reference is healthy:
${ra(OUT['l2-ref-check'])}</li>
<li>The teammate’s config was the course config with strict switched off. Under it the file is clean:
${ma('json', CODE.looseTsconfig)}
${ra(OUT['l3-loose'])}</li>
<li>The lab folder’s own tsconfig only extends the course one (strict + <code>noUncheckedIndexedAccess</code>, lesson 0.3):
${ma('json', CODE.labTsconfig)}</li>
<li>Your starting point — read it as a code review. Every comment is the teammate’s, every type is a guess:
${ma('typescript', CODE.starter)}</li>
</ol>

<h3>Turn strict on: ten errors</h3>
${ra(OUT['l4-strict'])}
<p>Read them by kind, not one by one — that is how you plan the work:</p>
<ul>
<li><strong>Line 30, line 39</strong> (TS2322) — the code returns <code>undefined</code> (when <code>find</code> finds nothing) and stores <code>null</code>, but the declared types say “always a <code>ScheduleEntry</code>”, “always a <code>number</code>”. Under strict, <code>null</code> and <code>undefined</code> are their own types (lesson 2.1). The signature lies; fix the signature.</li>
<li><strong>Lines 26, 42, 48, 55</strong> (TS2345, TS2532, TS2322) — all come from <code>number[]</code> and <code>string[]</code>. With <code>noUncheckedIndexedAccess</code>, element <code>[0]</code> of an array of unknown length may not exist, so it is <code>number | undefined</code>. A time range is not “some numbers”; it is exactly two. Lesson 2.2’s tuple says so — and then <code>range[0]</code> is a plain <code>number</code>.</li>
</ul>
<p>Strict mode found ten places where the types were wishful. It did <em>not</em> find the two runtime bugs in this file — the tests will.</p>

<h3>The grader</h3>
<p><code>npm run lab2</code> runs <code>scripts/cham-lab-2.mjs</code>. Like Lab 1’s grader, it copies your file (plus the course’s <code>time.ts</code>) into a fresh folder beside its own tests, so editing the tests cannot raise your score. Part C is new: besides <code>any</code> and <code>@ts-</code> it refuses <code>as</code> casts and <code>!</code> assertions — it strips comments and strings first, so the word “as” in a comment is fine:</p>
${ma('javascript', GRADER_GON)}
<p>Correct uses that must keep compiling (part B) — notice they are what real rows look like: a NULL note, no <code>cancelledAt</code> on an active booking, a read-only list from a cache:</p>
${ma('typescript', CODE.dung)}
<p>The start of the 13 behaviour tests (part D):</p>
${ma('typescript', TEST_DAU)}
<p>Run the grader on the untouched starter:</p>
${ra(OUT['l5-starter'])}
<p><strong>1 out of 10.</strong> A: the ten errors. B: the correct uses do not fit the guessed types (a NULL note, a read-only list, <code>range[0]</code>). C: the only point — there is nothing to cheat with yet. D: three tests fail at runtime, and they are three different bugs: <code>toRange('08:00-10:00-12:00')</code> drops the third time instead of throwing; <code>noteOf</code> turns an empty note <code>''</code> into “(no note)” because <code>||</code> treats <code>''</code> like <code>null</code> (lesson 2.1); <code>sortByStart</code> sorts the caller’s array in place (lesson 2.2). E: zero of eight.</p>

<h3>Your task</h3>
<p>Edit <strong>only</strong> <code>lab2/src/schedule.ts</code> until <code>npm run lab2</code> prints <strong>Score: 10/10</strong>:</p>
<ol>
<li>it compiles under the course’s strict tsconfig;</li>
<li>no <code>any</code>, no <code>as</code> cast except <code>as const</code>, no <code>!</code>, no <code>@ts-</code> directive;</li>
<li>the 13 behaviour tests pass;</li>
<li>each of the 8 wrong uses below is refused with the expected code.</li>
</ol>
<p>Start from the <strong>data</strong>, not from the errors. For every field and every return value, ask the database question: “can this be missing — and if so, is it NULL (<code>null</code>) or simply not there (<code>undefined</code>)?” Then the list question: “is this list fixed, and does position mean something?” Write the answer as a type. Most errors disappear by themselves.</p>

<h3>The eight wrong uses</h3>
${ma('typescript', CODE.sai)}
<p>Before types: the same eight uses, <strong>run by Node</strong> against the starter (Node strips types and checks nothing):</p>
${ma('typescript', CODE.saiChay)}
${ra(OUT['l6-sai-chay'])}
${BANG_EN}
<p>Three crash with the most common message in JavaScript — “Cannot read properties of undefined/null”. Five do something worse: they return a believable wrong value. <code>null + 30</code> is <code>30</code> in JavaScript, so a free lab “opens at 00:30”. A range silently loses its end. A shared array is changed for everyone who holds it.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — fix what the tests show, silence what tsc shows.</strong> The <code>||</code> and the in-place sort are fixed, so the tests are green; every compile error got a <code>!</code> or an <code>as</code> (<code>lab2/yeu/</code>):</p>
${ma('typescript', YEU_DONG)}
${ra(OUT['l7-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — green tests, quiet compiler, zero protection.</strong> 4/10, and part E is <strong>0 of 8</strong>: exactly as unprotected as the starter. <code>as ScheduleEntry</code> and <code>null as unknown as number</code> do not make a value exist; they tell tsc to stop asking. Each <code>!</code> says “trust me, it is there” — the same promise the starter made with <code>strict: false</code>, now hidden in ten places instead of one config line. The grader counts them (part C), and so should your code reviewer.</p>
</div>
<p><strong>Attempt B — honest about null and undefined, but lists stay plain arrays</strong> (<code>lab2/vua/</code>). No <code>!</code>, no <code>as</code>; the missing cases are in the types:</p>
${ma('typescript', VUA_KIEU)}
<p>But a range is still <code>number[]</code>, so under <code>noUncheckedIndexedAccess</code> every <code>range[0]</code> may be <code>undefined</code>, and the code fills the gap with invented defaults:</p>
${ma('typescript', VUA_VA)}
${ra(OUT['l8-vua'])}
<p>7/10 — a pass, and S1–S4 are refused: the four crashes and the <code>null + 30</code> are now impossible. What still slips through is the <em>shape</em> of the data: a three-number range (S5), writing into a range (S6), an unknown lab (S7), a growing lab list (S8). And B fails because a correct caller cannot read <code>toRange(…)[0]</code> or <code>LABS[0]</code> as a definite value. Look at <code>?? 0</code> and <code>= 0</code> above: a range with no start is not “starts at midnight”. Those defaults are invented data — a sign that the type is too loose, not that the code needs a fallback.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li>Return types first: what does <code>Array.prototype.find</code> return when nothing matches? What does <code>firstStart</code> return for a free lab? Put that in the signature: <code>ScheduleEntry | undefined</code>, <code>number | null</code>.</li>
<li>A note can be NULL in the database; a cancellation date is simply absent on an active booking. Those are two different words in TypeScript: <code>note: string | null</code>, <code>cancelledAt?: string</code>. Then replace <code>||</code> with <code>??</code>.</li>
<li>A function that only reads a list should say so: <code>schedule: readonly ScheduleEntry[]</code>. A read-only array has no <code>sort</code> — use <code>toSorted</code> (Node 20+, <code>es2023</code> lib), which returns a new array.</li>
<li>A time range is exactly two numbers, never edited in place: <code>type TimeRange = readonly [start: number, end: number]</code>. Watch how many errors disappear at once. In <code>toRange</code>, check that the split gave exactly two parts before you build the tuple.</li>
<li>The labs: <code>export const LABS = ['BE-201', 'BE-202', 'AL-301'] as const;</code> and <code>export type LabCode = (typeof LABS)[number];</code>. For <code>isLab</code>, <code>LABS.includes(text)</code> is refused (a <code>string</code> is not a <code>LabCode</code> — lesson 2.4); <code>LABS.some((lab) =&gt; lab === text)</code> compiles without a cast. Make it a type guard: <code>(text: string): text is LabCode</code>.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l9-ref'])}
<p>Ten out of ten, with no <code>!</code>, no <code>as</code> and no invented default. Compare it with the starter: the logic changed in only three places — <code>??</code>, <code>toSorted</code>, and the two-part check in <code>toRange</code> — and each of those was found by a <em>test</em>, not by the compiler. Everything else that changed is a type that tells the truth about the data:</p>
<ul>
<li><strong>Missing values in the types</strong> — <code>string | null</code>, <code>?:</code>, <code>| undefined</code>, <code>| null</code> — refuse the three crashes and <code>null + 30</code> (S1–S4).</li>
<li><strong>A read-only tuple for the range</strong> refuses three numbers (S5) and writing in place (S6), and makes <code>range[0]</code> a definite <code>number</code> — which by itself removed six of the ten strict errors.</li>
<li><strong><code>as const</code> plus a derived type</strong> refuses unknown labs and a growing list (S7, S8) from one line of data.</li>
</ul>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab2</code> prints <strong>Score: 10/10</strong> (7 passes; 10 is the goal).</li>
<li><code>grep -nE "any|as |!" lab2/src/schedule.ts</code> shows only <code>as const</code>, <code>!==</code> and text inside comments.</li>
<li><code>npx tsc -p lab2</code> is clean — the tests and <code>kiem/phai-dung.ts</code> included.</li>
<li>For each of S1–S8 you can name the type that refuses it, and say whether the original was a crash or a silent wrong value.</li>
<li>Commit: <code>fix(schedule): strict-null schedule rules (lab 2: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">strictNullChecks</span><span class="v">Part of <code>strict</code>: <code>null</code> and <code>undefined</code> are separate types, not members of every type.</span></div>
  <div class="kv"><span class="k">TS2532 / TS2531</span><span class="v">“Object is possibly 'undefined' / 'null'” — tsc’s wording when the maybe-missing value is an expression, not a named variable.</span></div>
  <div class="kv"><span class="k">TS18047 / TS18048</span><span class="v">“'x' is possibly 'null' / 'undefined'” — the same idea for a named variable or property.</span></div>
  <div class="kv"><span class="k">non-null assertion (!)</span><span class="v">A promise to tsc that a value is there. Not checked at runtime.</span></div>
  <div class="kv"><span class="k">read-only tuple</span><span class="v"><code>readonly [start: number, end: number]</code>: fixed length, typed positions, no writing.</span></div>
  <div class="kv"><span class="k">derived type</span><span class="v">A type computed from a value (<code>(typeof LABS)[number]</code>), so the two cannot drift apart.</span></div>
</div>

<h3>🗺 How the grader scores you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Copy</div><div class="lz-d">your schedule.ts + the course time.ts into a fresh folder</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Compile</div><div class="lz-d">strict tsc on your file, then on the correct uses (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Scan</div><div class="lz-d">no any, as, ! or @ts- in the code (C)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Run</div><div class="lz-d">node --test, 13 behaviour tests (D)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Attack</div><div class="lz-d">8 wrong uses, each must get the expected code (E)</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The same file: 0 errors with <code>strict: false</code>, 10 with the course config. The errors were not new bugs; they were old guesses made visible.</li>
<li>Silencing with <code>!</code> and <code>as</code> gave green tests, a quiet compiler and <strong>0 of 8</strong> wrong uses refused (4/10).</li>
<li>Honest <code>null</code>/<code>undefined</code> alone reached 7/10 and stopped every crash; the shapes (tuple, <code>as const</code>) took it to 10/10.</li>
<li>Invented defaults (<code>?? 0</code>) are a smell: the type is too loose, so the code makes up data.</li>
<li>Strict mode does not find <code>||</code> vs <code>??</code> or an in-place sort — the tests did. Types and tests, again, do different jobs.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('⚙️', 'TSConfig reference — strictNullChecks', 'What changes when null and undefined become their own types. Read 1 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#strictNullChecks')}
${nguon('⚙️', 'TSConfig reference — noUncheckedIndexedAccess', 'Why element [0] of a plain array is T | undefined, and why a tuple escapes it. Read 1 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess')}
${nguon('📘', 'TypeScript Handbook — Object Types (tuple types, readonly)', 'Labelled, optional and readonly tuple elements. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/objects.html')}
${nguon('🟦', 'MDN — Array.prototype.toSorted()', 'The copying counterpart of sort(), available on read-only arrays. Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Lab 2</span>
<h2>Bật strict cho lịch phòng lab</h2>
<p class="lead">60–90 phút. Một bạn cùng nhóm viết module lịch phòng của LabFlow khi dự án còn để <code>"strict": false</code>. Nó biên dịch với không lỗi nào. Bạn chuyển dự án sang tsconfig strict của khoá và nhận mười lỗi. Việc của bạn là việc nhóm nào cũng gặp khi bật strict: làm cho tệp <strong>trung thực</strong> — nói rõ trong kiểu giá trị nào có thể thiếu, danh sách nào cố định, khoảng giờ có hình dạng gì — mà không bịt miệng trình biên dịch, không đổi hành vi, và có kiểu từ chối tám lỗi mà bạn cùng nhóm sẽ viết tiếp theo. Làm xong, bạn siết được bất kỳ module kiểu lỏng nào ở chỗ làm theo từng bước; một script chấm bạn trên thang 10 bằng cách chạy tsc và Node, như máy CI.</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>Bài 2.1</strong> — <code>note: string | null</code> cho giá trị NULL của CSDL, <code>cancelledAt?: string</code> cho trường không có mặt, <code>??</code> thay cho <code>||</code>.</li>
<li><strong>Bài 2.2</strong> — tham số <code>readonly ScheduleEntry[]</code>, sắp xếp trên bản sao thay vì <code>sort</code> tại chỗ, và <strong>tuple</strong> <code>readonly [start: number, end: number]</code> cho khoảng giờ.</li>
<li><strong>Bài 2.3</strong> — <code>| undefined</code> và <code>| null</code> trong kiểu trả về thay vì một lời hứa mà code không giữ được.</li>
<li><strong>Bài 2.4</strong> — một danh sách phòng duy nhất với <code>as const</code> và một kiểu <em>suy ra</em> từ nó.</li>
</ul>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng dự án của khoá <code>labflow-ts</code> ở cuối Chương 2 và cài đúng các bản đã ghim — <code>npm ci</code> dùng tệp lock:
${ra(NPM_CI)}</li>
<li><strong>Lời giải tham khảo</strong> nằm ở <code>src/rules/schedule.ts</code> (kèm test). Đừng mở trước khi tự làm — bạn chỉ làm trong <code>lab2/src/schedule.ts</code>. Bản tham khảo đang khoẻ:
${ra(OUT['l2-ref-check'])}</li>
<li>Cấu hình của bạn cùng nhóm là tsconfig của khoá nhưng tắt strict. Với nó tệp sạch lỗi:
${ma('json', CODE.looseTsconfig)}
${ra(OUT['l3-loose'])}</li>
<li>tsconfig riêng của thư mục lab chỉ kế thừa tsconfig của khoá (strict + <code>noUncheckedIndexedAccess</code>, bài 0.3):
${ma('json', CODE.labTsconfig)}</li>
<li>Điểm xuất phát — đọc như đang review code. Mọi chú thích là của bạn cùng nhóm, mọi kiểu là phỏng đoán:
${ma('typescript', CODE.starter)}</li>
</ol>

<h3>Bật strict: mười lỗi</h3>
${ra(OUT['l4-strict'])}
<p>Đọc theo nhóm, đừng đọc từng dòng — đó là cách lên kế hoạch sửa:</p>
<ul>
<li><strong>Dòng 30, dòng 39</strong> (TS2322) — code trả <code>undefined</code> (khi <code>find</code> không thấy gì) và cất <code>null</code>, nhưng kiểu khai báo nói “luôn là <code>ScheduleEntry</code>”, “luôn là <code>number</code>”. Dưới strict, <code>null</code> và <code>undefined</code> là kiểu riêng (bài 2.1). Chữ ký hàm đang nói dối; sửa chữ ký.</li>
<li><strong>Dòng 26, 42, 48, 55</strong> (TS2345, TS2532, TS2322) — đều sinh ra từ <code>number[]</code> và <code>string[]</code>. Với <code>noUncheckedIndexedAccess</code>, phần tử <code>[0]</code> của một mảng không biết độ dài có thể không tồn tại, nên nó là <code>number | undefined</code>. Khoảng giờ không phải “mấy con số”; nó là đúng hai số. Tuple của bài 2.2 nói đúng điều đó — và khi ấy <code>range[0]</code> là <code>number</code> chắc chắn.</li>
</ul>
<p>Chế độ strict tìm ra mười chỗ kiểu chỉ là mong ước. Nó <em>không</em> tìm ra hai bug lúc chạy trong tệp này — bộ test sẽ tìm.</p>

<h3>Máy chấm</h3>
<p><code>npm run lab2</code> chạy <code>scripts/cham-lab-2.mjs</code>. Giống máy chấm Lab 1, nó chép tệp của bạn (kèm <code>time.ts</code> của khoá) vào một thư mục mới cạnh bộ test của nó, nên sửa test không thể tăng điểm. Phần C có điểm mới: ngoài <code>any</code> và <code>@ts-</code>, nó từ chối ép kiểu <code>as</code> và khẳng định <code>!</code> — nó bóc chú thích và chuỗi trước, nên chữ “as” trong chú thích không sao:</p>
${ma('javascript', GRADER_GON)}
<p>Những cách dùng đúng phải tiếp tục biên dịch được (phần B) — để ý đó chính là hình dạng các dòng dữ liệu thật: ghi chú NULL, lượt đặt đang hoạt động không có <code>cancelledAt</code>, danh sách chỉ đọc lấy từ cache:</p>
${ma('typescript', CODE.dung)}
<p>Phần đầu của 13 test hành vi (phần D):</p>
${ma('typescript', TEST_DAU)}
<p>Chạy máy chấm trên bản khởi đầu chưa sửa:</p>
${ra(OUT['l5-starter'])}
<p><strong>1 trên 10.</strong> A: mười lỗi. B: các cách dùng đúng không khớp với kiểu phỏng đoán (ghi chú NULL, danh sách chỉ đọc, <code>range[0]</code>). C: điểm duy nhất — chưa có gì để gian lận. D: ba test hỏng lúc chạy, và là ba bug khác nhau: <code>toRange('08:00-10:00-12:00')</code> bỏ mất giờ thứ ba thay vì ném lỗi; <code>noteOf</code> biến ghi chú rỗng <code>''</code> thành “(no note)” vì <code>||</code> coi <code>''</code> như <code>null</code> (bài 2.1); <code>sortByStart</code> sắp xếp ngay trên mảng của người gọi (bài 2.2). E: không trên tám.</p>

<h3>Nhiệm vụ</h3>
<p>Chỉ sửa <code>lab2/src/schedule.ts</code> cho tới khi <code>npm run lab2</code> in <strong>Score: 10/10</strong>:</p>
<ol>
<li>biên dịch được với tsconfig strict của khoá;</li>
<li>không <code>any</code>, không ép kiểu <code>as</code> trừ <code>as const</code>, không <code>!</code>, không chỉ thị <code>@ts-</code>;</li>
<li>13 test hành vi đều qua;</li>
<li>mỗi cách dùng sai trong 8 dòng dưới đây bị từ chối đúng mã mong đợi.</li>
</ol>
<p>Bắt đầu từ <strong>dữ liệu</strong>, đừng bắt đầu từ lỗi. Với mỗi trường và mỗi giá trị trả về, hỏi câu hỏi của CSDL: “giá trị này có thể thiếu không — nếu có thì là NULL (<code>null</code>) hay đơn giản là không có mặt (<code>undefined</code>)?” Rồi câu hỏi về danh sách: “danh sách này có cố định không, vị trí có mang nghĩa không?” Viết câu trả lời thành kiểu. Phần lớn lỗi tự biến mất.</p>

<h3>Tám cách dùng sai</h3>
${ma('typescript', CODE.sai)}
<p>Trước khi có kiểu: cũng tám cách dùng đó, <strong>Node chạy thật</strong> trên bản khởi đầu (Node bóc kiểu và không kiểm gì):</p>
${ma('typescript', CODE.saiChay)}
${ra(OUT['l6-sai-chay'])}
${BANG_VI}
<p>Ba cái sập với thông báo phổ biến nhất của JavaScript — “Cannot read properties of undefined/null”. Năm cái làm điều tệ hơn: trả về một giá trị sai mà trông rất hợp lý. Trong JavaScript <code>null + 30</code> là <code>30</code>, nên một phòng trống “mở lúc 00:30”. Một khoảng giờ âm thầm mất giờ kết thúc. Một mảng dùng chung bị đổi với tất cả những ai đang giữ nó.</p>

<h3>Những lần thử đầu tiên thường trông thế nào</h3>
<p><strong>Lần thử A — sửa những gì test chỉ ra, bịt những gì tsc chỉ ra.</strong> <code>||</code> và sort tại chỗ đã được sửa nên test xanh; lỗi biên dịch nào cũng được dán một <code>!</code> hoặc một <code>as</code> (<code>lab2/yeu/</code>):</p>
${ma('typescript', YEU_DONG)}
${ra(OUT['l7-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — test xanh, trình biên dịch im, bảo vệ bằng không.</strong> 4/10, và phần E là <strong>0 trên 8</strong>: không được bảo vệ hơn bản khởi đầu chút nào. <code>as ScheduleEntry</code> và <code>null as unknown as number</code> không làm giá trị tồn tại; chúng chỉ bảo tsc thôi hỏi. Mỗi dấu <code>!</code> nói “tin tôi đi, nó có đó” — đúng lời hứa bản khởi đầu đã hứa bằng <code>strict: false</code>, giờ giấu ở mười chỗ thay vì một dòng cấu hình. Máy chấm đếm chúng (phần C), và người review code của bạn cũng nên đếm.</p>
</div>
<p><strong>Lần thử B — trung thực về null và undefined, nhưng danh sách vẫn là mảng thường</strong> (<code>lab2/vua/</code>). Không <code>!</code>, không <code>as</code>; trường hợp thiếu đã nằm trong kiểu:</p>
${ma('typescript', VUA_KIEU)}
<p>Nhưng khoảng giờ vẫn là <code>number[]</code>, nên dưới <code>noUncheckedIndexedAccess</code> mọi <code>range[0]</code> đều có thể là <code>undefined</code>, và code lấp chỗ trống bằng giá trị mặc định tự bịa:</p>
${ma('typescript', VUA_VA)}
${ra(OUT['l8-vua'])}
<p>7/10 — đạt, và S1–S4 đã bị từ chối: bốn lỗi sập và cái <code>null + 30</code> giờ là không thể. Thứ còn lọt là <em>hình dạng</em> dữ liệu: khoảng giờ ba số (S5), ghi đè vào khoảng giờ (S6), phòng không tồn tại (S7), danh sách phòng dài ra (S8). Và B trượt vì người gọi đúng không đọc được <code>toRange(…)[0]</code> hay <code>LABS[0]</code> như một giá trị chắc chắn. Nhìn <code>?? 0</code> và <code>= 0</code> ở trên: một khoảng giờ không có giờ bắt đầu không phải là “bắt đầu lúc nửa đêm”. Các giá trị mặc định đó là dữ liệu bịa — dấu hiệu kiểu đang quá lỏng, không phải dấu hiệu code cần đường lùi.</p>

<h3>Thang chấm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Kiểu trả về trước: <code>Array.prototype.find</code> trả gì khi không khớp phần tử nào? <code>firstStart</code> trả gì với một phòng trống? Đưa điều đó vào chữ ký: <code>ScheduleEntry | undefined</code>, <code>number | null</code>.</li>
<li>Ghi chú có thể NULL trong CSDL; ngày huỷ thì đơn giản là không có mặt ở lượt đặt đang hoạt động. Đó là hai từ khác nhau trong TypeScript: <code>note: string | null</code>, <code>cancelledAt?: string</code>. Rồi thay <code>||</code> bằng <code>??</code>.</li>
<li>Hàm chỉ đọc danh sách thì nên nói ra: <code>schedule: readonly ScheduleEntry[]</code>. Mảng chỉ đọc không có <code>sort</code> — dùng <code>toSorted</code> (Node 20+, lib <code>es2023</code>), nó trả về một mảng mới.</li>
<li>Khoảng giờ là đúng hai số, không bao giờ sửa tại chỗ: <code>type TimeRange = readonly [start: number, end: number]</code>. Xem bao nhiêu lỗi biến mất cùng lúc. Trong <code>toRange</code>, kiểm phép tách cho ra đúng hai phần rồi mới dựng tuple.</li>
<li>Danh sách phòng: <code>export const LABS = ['BE-201', 'BE-202', 'AL-301'] as const;</code> và <code>export type LabCode = (typeof LABS)[number];</code>. Với <code>isLab</code>, <code>LABS.includes(text)</code> bị từ chối (<code>string</code> không phải <code>LabCode</code> — bài 2.4); <code>LABS.some((lab) =&gt; lab === text)</code> biên dịch được mà không cần ép kiểu. Biến nó thành type guard: <code>(text: string): text is LabCode</code>.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l9-ref'])}
<p>Mười trên mười, không <code>!</code>, không <code>as</code>, không giá trị mặc định tự bịa. So với bản khởi đầu: logic chỉ đổi ở ba chỗ — <code>??</code>, <code>toSorted</code>, và phép kiểm hai phần trong <code>toRange</code> — và cả ba đều do <em>test</em> tìm ra, không phải trình biên dịch. Mọi thay đổi còn lại là kiểu nói thật về dữ liệu:</p>
<ul>
<li><strong>Giá trị có thể thiếu nằm trong kiểu</strong> — <code>string | null</code>, <code>?:</code>, <code>| undefined</code>, <code>| null</code> — từ chối ba lỗi sập và <code>null + 30</code> (S1–S4).</li>
<li><strong>Tuple chỉ đọc cho khoảng giờ</strong> từ chối ba số (S5) và ghi tại chỗ (S6), và làm <code>range[0]</code> thành <code>number</code> chắc chắn — một mình nó xoá sáu trong mười lỗi strict.</li>
<li><strong><code>as const</code> cộng kiểu suy ra</strong> từ chối phòng lạ và danh sách dài ra (S7, S8) từ đúng một dòng dữ liệu.</li>
</ul>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab2</code> in <strong>Score: 10/10</strong> (7 là đạt; 10 là mục tiêu).</li>
<li><code>grep -nE "any|as |!" lab2/src/schedule.ts</code> chỉ còn <code>as const</code>, <code>!==</code> và chữ trong chú thích.</li>
<li><code>npx tsc -p lab2</code> sạch — kể cả test và <code>kiem/phai-dung.ts</code>.</li>
<li>Với từng S1–S8 bạn gọi tên được kiểu nào từ chối nó, và nói được bản gốc là lỗi sập hay giá trị sai im lặng.</li>
<li>Commit: <code>fix(schedule): strict-null schedule rules (lab 2: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">strictNullChecks (kiểm null chặt)</span><span class="v">Một phần của <code>strict</code>: <code>null</code> và <code>undefined</code> là kiểu riêng, không thuộc mọi kiểu.</span></div>
  <div class="kv"><span class="k">TS2532 / TS2531</span><span class="v">“Object is possibly 'undefined' / 'null'” — cách tsc nói khi giá trị có thể thiếu là một biểu thức, không phải một biến có tên.</span></div>
  <div class="kv"><span class="k">TS18047 / TS18048</span><span class="v">“'x' is possibly 'null' / 'undefined'” — cùng ý cho một biến hay thuộc tính có tên.</span></div>
  <div class="kv"><span class="k">non-null assertion (khẳng định khác null, dấu !)</span><span class="v">Một lời hứa với tsc rằng giá trị có đó. Không được kiểm lúc chạy.</span></div>
  <div class="kv"><span class="k">read-only tuple (tuple chỉ đọc)</span><span class="v"><code>readonly [start: number, end: number]</code>: độ dài cố định, kiểu theo vị trí, không được ghi.</span></div>
  <div class="kv"><span class="k">derived type (kiểu suy ra)</span><span class="v">Kiểu tính ra từ một giá trị (<code>(typeof LABS)[number]</code>), nên hai thứ không thể lệch nhau.</span></div>
</div>

<h3>🗺 Máy chấm cho điểm thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Chép</div><div class="lz-d">schedule.ts của bạn + time.ts của khoá vào thư mục mới</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Biên dịch</div><div class="lz-d">tsc strict trên tệp của bạn, rồi trên các cách dùng đúng (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Quét</div><div class="lz-d">không any, as, ! hay @ts- trong code (C)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Chạy</div><div class="lz-d">node --test, 13 test hành vi (D)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Tấn công</div><div class="lz-d">8 cách dùng sai, mỗi cái phải đúng mã lỗi (E)</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cùng một tệp: 0 lỗi với <code>strict: false</code>, 10 lỗi với tsconfig của khoá. Các lỗi không phải bug mới; chúng là những phỏng đoán cũ bị lộ ra.</li>
<li>Bịt bằng <code>!</code> và <code>as</code> cho test xanh, trình biên dịch im lặng, và <strong>0 trên 8</strong> cách dùng sai bị từ chối (4/10).</li>
<li>Chỉ trung thực về <code>null</code>/<code>undefined</code> đã đạt 7/10 và chặn mọi lỗi sập; hình dạng (tuple, <code>as const</code>) đưa lên 10/10.</li>
<li>Giá trị mặc định tự bịa (<code>?? 0</code>) là mùi code: kiểu quá lỏng nên code phải bịa dữ liệu.</li>
<li>Strict không tìm ra <code>||</code> với <code>??</code> hay sort tại chỗ — bộ test tìm ra. Kiểu và test, một lần nữa, làm hai việc khác nhau.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('⚙️', 'TSConfig reference — strictNullChecks', 'Điều gì thay đổi khi null và undefined thành kiểu riêng. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/tsconfig/#strictNullChecks')}
${nguon('⚙️', 'TSConfig reference — noUncheckedIndexedAccess', 'Vì sao phần tử [0] của mảng thường là T | undefined, và vì sao tuple thoát khỏi điều đó. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess')}
${nguon('📘', 'TypeScript Handbook — Object Types (tuple, readonly)', 'Phần tử tuple có nhãn, tuỳ chọn và chỉ đọc. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/objects.html')}
${nguon('🟦', 'MDN — Array.prototype.toSorted()', 'Bản sao chép của sort(), dùng được trên mảng chỉ đọc. Đọc ngày 01/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted')}
</div>
`,
};
