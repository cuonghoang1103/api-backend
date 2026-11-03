/**
 * TypeScript · Chương 5 · Lab 5 — Máy trạng thái lượt đặt (discriminated union + never). BÀI MỚI 03/11/2026, slug typescript-5-6-lab-may-trang-thai (đứng TRƯỚC quiz 5.5).
 * Máy chấm = scripts/cham-lab-5.mjs trong LabFlow TS (tsc 7.0.2 + node 22.23.3 thật): A 2 · B 1 · C 1 · D 2 · E 8×0,25 · F 2 (thêm trạng thái mới ⇒ phải đỏ); đạt 7.
 * Số đo thật: khởi đầu (step: string, optional) 4/10 · lần thử "union + default bắt-hết + bảng mở" 8/10 (F 0/2) · "assertNever nhưng bảng mở" 9/10 (F 1/2) · tham khảo 10/10.
 * Mọi code/output lấy từ ./_ma-ts-lab-5.mjs (SINH TỰ ĐỘNG). Lời giải = ./_labflow-ts/src/rules/state.ts.
 */
import G from '../giang/ts-lab-5.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-5.mjs';

const NPM_CI = OUT['l1-npm-ci'].split('\n').filter((l) => !/^npm (notice|warn)/.test(l)).join('\n');
const GD = CODE.grader.split('\n');
const fIdx = GD.findIndex((l) => l.includes('Part F'));
const GRADER_F = GD.slice(fIdx, fIdx + 10).join('\n');
const ST = CODE.starter.split('\n');
const STARTER_TYPE = ST.slice(3, 13).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong use</th><th>tsc must say</th><th>What a loose model lets happen</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>describe({ step: 'pending' })</code></td><td>TS2345</td><td>a pending booking with no record — the UI reads <code>#undefined</code></td></tr>
<tr><td>S2</td><td><code>describe({ step: 'cancelled', record })</code></td><td>TS2345</td><td>a cancellation with no reason — the audit log is blank</td></tr>
<tr><td>S3</td><td><code>describe({ step: 'draft', record })</code></td><td>TS2353</td><td>a draft carrying a record that cannot exist yet</td></tr>
<tr><td>S4</td><td><code>if (s.step === 'draft') s.record.id</code></td><td>TS2339</td><td>reading a record off a draft — a crash in the one branch nobody tested</td></tr>
<tr><td>S5</td><td><code>if (s.step === 'xpired')</code></td><td>TS2367</td><td>a typo’d step that is always false — the real branch never runs</td></tr>
<tr><td>S6</td><td>a function returning <code>{ step: 'invalid' }</code></td><td>TS2322</td><td>an invalid state with no code — “invalid: undefined” on screen</td></tr>
<tr><td>S7</td><td><code>const a: ActiveState = { step: 'cancelled', … }</code></td><td>TS2322</td><td>a cancelled booking treated as live — it can be “cancelled” twice</td></tr>
<tr><td>S8</td><td><code>describe({ step: 'confimed', record })</code></td><td>TS2820</td><td>a misspelled step — silently never matches, shows nothing</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng sai</th><th>tsc phải báo</th><th>Mô hình lỏng để lọt điều gì</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>describe({ step: 'pending' })</code></td><td>TS2345</td><td>một lượt pending không có record — UI đọc ra <code>#undefined</code></td></tr>
<tr><td>S2</td><td><code>describe({ step: 'cancelled', record })</code></td><td>TS2345</td><td>một lần huỷ không có lý do — nhật ký kiểm toán trống</td></tr>
<tr><td>S3</td><td><code>describe({ step: 'draft', record })</code></td><td>TS2353</td><td>một draft mang record mà chưa thể tồn tại</td></tr>
<tr><td>S4</td><td><code>if (s.step === 'draft') s.record.id</code></td><td>TS2339</td><td>đọc record khỏi một draft — sập ở đúng nhánh không ai test</td></tr>
<tr><td>S5</td><td><code>if (s.step === 'xpired')</code></td><td>TS2367</td><td>một step gõ sai luôn false — nhánh thật không bao giờ chạy</td></tr>
<tr><td>S6</td><td>một hàm trả <code>{ step: 'invalid' }</code></td><td>TS2322</td><td>một trạng thái invalid không có code — “invalid: undefined” trên màn hình</td></tr>
<tr><td>S7</td><td><code>const a: ActiveState = { step: 'cancelled', … }</code></td><td>TS2322</td><td>một lượt đã huỷ bị coi là còn sống — có thể “huỷ” hai lần</td></tr>
<tr><td>S8</td><td><code>describe({ step: 'confimed', record })</code></td><td>TS2820</td><td>một step gõ sai — âm thầm không khớp, không hiện gì</td></tr>
</tbody>
</table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th></tr></thead>
<tbody>
<tr><td>A — your file compiles</td><td>2</td><td><code>tsc -p</code>, course tsconfig (strict, nodenext)</td></tr>
<tr><td>B — correct uses compile</td><td>1</td><td><code>kiem/phai-dung.ts</code>: narrowing by <code>step</code> gives <code>record</code> with no check; the predicate narrows to <code>ActiveState</code></td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code></td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: the behaviour tests (describe, recordOf, isActive, cancel copies)</td></tr>
<tr><td>E — wrong uses refused</td><td>2 (8 × 0.25)</td><td>each marked line of <code>kiem/sai.ts</code> has the expected code</td></tr>
<tr><td>F — exhaustiveness</td><td>2</td><td>the grader adds a new step at <code>// +F</code>: F1 your <code>describe</code> stops compiling; F2 your <code>STEP_LABEL</code> too</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th></tr></thead>
<tbody>
<tr><td>A — tệp của bạn biên dịch được</td><td>2</td><td><code>tsc -p</code>, tsconfig của khoá (strict, nodenext)</td></tr>
<tr><td>B — cách dùng đúng biên dịch được</td><td>1</td><td><code>kiem/phai-dung.ts</code>: thu hẹp theo <code>step</code> cho <code>record</code> không cần kiểm; predicate thu hẹp về <code>ActiveState</code></td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code></td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: các test hành vi (describe, recordOf, isActive, cancel tạo bản sao)</td></tr>
<tr><td>E — cách dùng sai bị từ chối</td><td>2 (8 × 0,25)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có đúng mã</td></tr>
<tr><td>F — kiểm tra đầy đủ</td><td>2</td><td>máy chấm thêm một step mới ở <code>// +F</code>: F1 <code>describe</code> của bạn ngừng biên dịch; F2 <code>STEP_LABEL</code> cũng vậy</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 5 — The booking state machine|||Lab 5 — Máy trạng thái lượt đặt',
  slug: 'typescript-5-6-lab-may-trang-thai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 5 có thang 10 điểm và máy chấm chạy tsc + Node thật: state.ts của LabFlow — BookingState là discriminated union trên BookingRecord (draft/invalid/pending/confirmed/cancelled), describe đầy đủ với assertNever, isActive (type predicate), recordOf, cancel bất biến, STEP_LABEL là Record đóng. Bản khởi đầu (step: string, trường optional) biên dịch 0 lỗi mà chỉ 4/10. Điểm độc đáo: máy chấm THÊM một trạng thái mới ở mốc // +F rồi dịch lại — describe đầy đủ và Record đóng phải hoá đỏ (TS2345 + TS2741), default bắt-hết thì không. Có output thật của lần thử "default bắt-hết" (8/10), "assertNever nhưng bảng mở" (9/10) và lời giải 10/10.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lab 5</span>
<h2>The booking state machine</h2>
<p class="lead">60–90 minutes. A booking request has a lifecycle — drafting, invalid, pending, confirmed, cancelled — and a teammate modelled it as one wide object with optional fields. It compiles under strict with <strong>zero errors</strong>, and the grader gives it <strong>4 out of 10</strong>. You rewrite it as a discriminated union (5.3) with an exhaustive <code>describe</code> (5.4), a type predicate, and a closed label table — until the grader says 10/10. The last two points are the ones this chapter is really about: the grader <em>adds a brand-new state</em> and your code must refuse to compile.</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>5.1 / 5.2</strong> — narrowing by value; a <code>switch</code> over a literal union.</li>
<li><strong>5.3</strong> — the discriminated union <code>BookingState</code>, built on Chapter 4’s <code>BookingRecord</code>; a type predicate <code>isActive</code>.</li>
<li><strong>5.4</strong> — <code>assertNever</code> in the default, and a closed <code>Record&lt;Step, string&gt;</code> — so a new state is a compile error, not a silent bug.</li>
</ul>

<h3>Setup</h3>
<ol>
<li>Use <code>labflow-ts</code> at the end of Chapter 5 and install the pinned versions:
${ra(NPM_CI)}</li>
<li>The lab’s tsconfig only extends the course one:
${ma('json', CODE.labTsconfig)}</li>
<li>Your starting point — the teammate’s file. The type is the problem:
${ma('typescript', STARTER_TYPE)}</li>
</ol>
<p>You edit only <code>lab5/src/state.ts</code>. The course’s <code>model.ts</code>, <code>booking.ts</code>, <code>schedule.ts</code> and <code>time.ts</code> are given.</p>

<h3>Zero errors — and why that proves nothing</h3>
${ra(OUT['l2-starter-tsc'])}
<p>Strict mode, and not one error. Every type is <em>valid</em>; the problem is that they are <em>loose</em>: <code>step: string</code> accepts any text, the record/code/reason are all optional so impossible combinations are legal (a <code>draft</code> with a <code>record</code>, a <code>cancelled</code> with no <code>reason</code>), the <code>switch</code> ends in a catch-all, <code>cancel</code> mutates its input, and <code>STEP_LABEL</code> is an open table. A loose union refuses nothing.</p>

<h3>The grader</h3>
<p><code>npm run lab5</code> runs <code>scripts/cham-lab-5.mjs</code>. A, B, C, D and E are the familiar checks (compile, correct uses, honesty, behaviour, wrong uses). Part F is new — it adds a sixth state and recompiles:</p>
${ma('javascript', GRADER_F)}
<p>Run it on the starter:</p>
${ra(OUT['l3-starter'])}
<p><strong>4 out of 10.</strong> B fails (<code>step: string</code> never narrows, so <code>s.record</code> stays <code>undefined</code> — TS18048). D fails (<code>cancel</code> mutates the input, so the “leaves the list alone” test fails). E is 0/8 — a loose model refuses none of the wrong uses. F scores 1/2 by accident (the in-place <code>cancel</code> happens to break when a state is added) but not for the right reason.</p>

<h3>Your task</h3>
<p>Edit <strong>only</strong> <code>lab5/src/state.ts</code> until <code>npm run lab5</code> prints <strong>Score: 10/10</strong>: a discriminated union with a <code>step</code> discriminant; each member carrying only its data; <code>describe</code> exhaustive with <code>assertNever</code>; <code>isActive</code> a type predicate; <code>cancel</code> returning a new object; <code>STEP_LABEL</code> a <code>Record&lt;Step, string&gt;</code>. Keep the <code>// +F</code> marker at the end of the union — the grader adds a state there.</p>

<h3>The eight wrong uses</h3>
${ma('typescript', CODE.sai)}
${BANG_EN}
<p>Every one of these compiles against the loose starter; the union must make tsc refuse each with the code shown.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — a real union, but a catch-all default and an open table</strong> (<code>lab5/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — a catch-all <code>default</code> passes A–E and still fails F.</strong> 8/10 — a pass. The union is right, so B, D and all eight of E are green. But <code>describe</code> ends in <code>default: return 'Unknown'</code> and <code>STEP_LABEL</code> is an open <code>{ [k: string]: string }</code>, so when the grader adds <code>expired</code>, nothing breaks (F 0/2). A passing grade is not the point of this lab: the new state would ship showing “Unknown”, and no test would catch it. This is exactly the <code>colour('EXPIRED') === 'grey'</code> bug of 5.4.</p>
</div>
<p><strong>Attempt B — exhaustive <code>describe</code>, but still an open table</strong> (<code>lab5/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9/10. <code>describe</code> uses <code>assertNever</code>, so adding <code>expired</code> turns it red (F1 ✓). But <code>STEP_LABEL</code> is still an open table, so the new step has no entry and nothing complains (F2 ✗). Close the table with <code>Record&lt;Step, string&gt;</code> and both guards fire.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li>Replace the wide object with a union: <code>{ step: 'draft' } | { step: 'invalid'; code: SlotCode } | { step: 'pending'; record: BookingRecord } | { step: 'confirmed'; record: BookingRecord } | { step: 'cancelled'; record: BookingRecord; reason: string }</code> — keep the <code>// +F</code> marker on the last line.</li>
<li><code>describe</code>: a <code>switch (state.step)</code> where every case returns and <code>default: return assertNever(state)</code>; <code>assertNever(x: never): never</code>.</li>
<li><code>type ActiveState = { step: 'pending'; record } | { step: 'confirmed'; record }</code>; <code>isActive(state): state is ActiveState</code>.</li>
<li><code>recordOf</code>: <code>'record' in state ? state.record : null</code>; <code>cancel</code> returns <code>{ step: 'cancelled', record: state.record, reason }</code> only when active.</li>
<li><code>type Step = BookingState['step']</code>; <code>STEP_LABEL: Record&lt;Step, string&gt;</code> with one entry per step.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Ten out of ten — and two things to notice in part F:</p>
<ul>
<li><strong>The new state breaks in two places.</strong> <code>srcF/state.ts(…): TS2345 … not assignable to … 'never'</code> is <code>describe</code>’s <code>assertNever</code>; <code>TS2741 … 'expired' is missing … Record&lt;…&gt;</code> is <code>STEP_LABEL</code>. Two guards, two red lines, both pointing at the code to update.</li>
<li><strong>The model compiled before and after.</strong> What changed is how much it refuses: from the loose starter (0 of 8 wrong uses, a new state silent) to the union (8 of 8, a new state a compile error in two places).</li>
</ul>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab5</code> prints <strong>Score: 10/10</strong>.</li>
<li>No <code>any</code>, no <code>as</code>, no <code>!</code>; the <code>// +F</code> marker is still at the end of the union.</li>
<li>You can say which line refuses each of S1–S8, and which two lines part F turns red.</li>
<li>Commit: <code>feat(state): booking lifecycle as a discriminated union (lab 5: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">state machine</span><span class="v">The lifecycle of one thing as a set of states and transitions.</span></div>
  <div class="kv"><span class="k">discriminated union</span><span class="v">The states as a union sharing a <code>step</code> discriminant (5.3).</span></div>
  <div class="kv"><span class="k">exhaustive switch</span><span class="v"><code>describe</code> with <code>assertNever</code> — a new state is a compile error (5.4).</span></div>
  <div class="kv"><span class="k">closed label table</span><span class="v"><code>Record&lt;Step, string&gt;</code> — a second exhaustiveness guard.</span></div>
  <div class="kv"><span class="k">immutable transition</span><span class="v"><code>cancel</code> returns a new state; the old one is untouched.</span></div>
</div>

<h3>🗺 How the grader scores you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Compile</div><div class="lz-d">strict tsc, then the correct uses (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Scan</div><div class="lz-d">no any, as, ! or @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Run</div><div class="lz-d">node --test, behaviour (D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Attack</div><div class="lz-d">8 wrong uses, each with its code (E)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Add a state</div><div class="lz-d">insert <code>expired</code>; describe + STEP_LABEL must go red (F)</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A loose model (<code>step: string</code>, optional fields) compiles with zero errors and refuses 0 of 8 wrong uses: valid is not precise.</li>
<li>A real union with a catch-all default passes with 8/10 — and still ships a new state silently (F 0/2).</li>
<li><code>assertNever</code> earns F1; a closed <code>Record&lt;Step, string&gt;</code> earns F2 — two guards, two red lines when a state is added.</li>
<li>The reference: a discriminated union, exhaustive <code>describe</code>, a type predicate, an immutable <code>cancel</code>, a closed table.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Discriminated Unions & Exhaustiveness', 'The pattern this lab builds, end to end. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
${nguon('📘', 'TypeScript Handbook — Utility Types: Record', 'Record&lt;Keys, Type&gt;, the closed label table. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Lab 5</span>
<h2>Máy trạng thái lượt đặt</h2>
<p class="lead">60–90 phút. Một lượt đặt có vòng đời — nháp, không hợp lệ, chờ duyệt, đã xác nhận, bị huỷ — và một đồng đội mô hình hoá nó thành một object rộng với các trường optional. Nó biên dịch dưới strict với <strong>không lỗi nào</strong>, vậy mà máy chấm cho <strong>4 trên 10</strong>. Bạn viết lại thành một discriminated union (5.3) với <code>describe</code> đầy đủ (5.4), một type predicate, và một bảng nhãn đóng — tới khi máy chấm báo 10/10. Hai điểm cuối mới là thứ chương này thật sự nói tới: máy chấm <em>thêm một trạng thái hoàn toàn mới</em> và code của bạn phải từ chối biên dịch.</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>5.1 / 5.2</strong> — thu hẹp theo giá trị; một <code>switch</code> trên union literal.</li>
<li><strong>5.3</strong> — discriminated union <code>BookingState</code>, dựng trên <code>BookingRecord</code> của Chương 4; một type predicate <code>isActive</code>.</li>
<li><strong>5.4</strong> — <code>assertNever</code> trong default, và một <code>Record&lt;Step, string&gt;</code> đóng — để một trạng thái mới là lỗi biên dịch, không phải bug âm thầm.</li>
</ul>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng <code>labflow-ts</code> ở cuối Chương 5 và cài đúng các bản đã ghim:
${ra(NPM_CI)}</li>
<li>tsconfig của lab chỉ kế thừa tsconfig của khoá:
${ma('json', CODE.labTsconfig)}</li>
<li>Điểm xuất phát — tệp của đồng đội. Kiểu mới là vấn đề:
${ma('typescript', STARTER_TYPE)}</li>
</ol>
<p>Bạn chỉ sửa <code>lab5/src/state.ts</code>. Các tệp <code>model.ts</code>, <code>booking.ts</code>, <code>schedule.ts</code>, <code>time.ts</code> của khoá là cho sẵn.</p>

<h3>Không lỗi nào — và vì sao điều đó chẳng chứng minh gì</h3>
${ra(OUT['l2-starter-tsc'])}
<p>Strict, và không một lỗi. Kiểu nào cũng <em>hợp lệ</em>; vấn đề là chúng <em>lỏng</em>: <code>step: string</code> nhận chữ gì cũng được, record/code/reason đều optional nên các tổ hợp bất khả là hợp lệ (một <code>draft</code> có <code>record</code>, một <code>cancelled</code> không <code>reason</code>), <code>switch</code> kết thúc bằng bắt-hết, <code>cancel</code> sửa chính đầu vào, và <code>STEP_LABEL</code> là bảng mở. Một union lỏng chẳng từ chối gì.</p>

<h3>Máy chấm</h3>
<p><code>npm run lab5</code> chạy <code>scripts/cham-lab-5.mjs</code>. A, B, C, D, E là các phép kiểm quen thuộc (biên dịch, cách dùng đúng, trung thực, hành vi, cách dùng sai). Phần F là mới — nó thêm một trạng thái thứ sáu và dịch lại:</p>
${ma('javascript', GRADER_F)}
<p>Chạy trên bản khởi đầu:</p>
${ra(OUT['l3-starter'])}
<p><strong>4 trên 10.</strong> B trượt (<code>step: string</code> không bao giờ thu hẹp, nên <code>s.record</code> vẫn <code>undefined</code> — TS18048). D trượt (<code>cancel</code> sửa đầu vào, nên test “không đụng danh sách” trượt). E là 0/8 — mô hình lỏng không từ chối cách dùng sai nào. F được 1/2 một cách tình cờ (<code>cancel</code> sửa tại chỗ vô tình vỡ khi thêm trạng thái) nhưng không vì lý do đúng.</p>

<h3>Nhiệm vụ</h3>
<p><strong>Chỉ</strong> sửa <code>lab5/src/state.ts</code> tới khi <code>npm run lab5</code> in <strong>Score: 10/10</strong>: một discriminated union với discriminant <code>step</code>; mỗi thành viên chỉ mang dữ liệu của nó; <code>describe</code> đầy đủ với <code>assertNever</code>; <code>isActive</code> là type predicate; <code>cancel</code> trả về object mới; <code>STEP_LABEL</code> là <code>Record&lt;Step, string&gt;</code>. Giữ mốc <code>// +F</code> ở cuối union — máy chấm thêm một trạng thái ở đó.</p>

<h3>Tám cách dùng sai</h3>
${ma('typescript', CODE.sai)}
${BANG_VI}
<p>Mỗi cái trong số này đều biên dịch được với bản khởi đầu lỏng; union phải làm tsc từ chối từng cái với mã đã ghi.</p>

<h3>Những lần thử đầu tiên thường trông thế nào</h3>
<p><strong>Lần thử A — một union thật, nhưng default bắt-hết và bảng mở</strong> (<code>lab5/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một <code>default</code> bắt-hết qua A–E mà vẫn trượt F.</strong> 8/10 — đạt. Union đúng, nên B, D và cả tám E đều xanh. Nhưng <code>describe</code> kết thúc bằng <code>default: return 'Unknown'</code> và <code>STEP_LABEL</code> là <code>{ [k: string]: string }</code> mở, nên khi máy chấm thêm <code>expired</code>, không gì vỡ (F 0/2). Điểm đạt không phải mục tiêu của lab này: trạng thái mới sẽ lên sản phẩm hiện “Unknown”, và không test nào bắt được. Đây đúng là bug <code>colour('EXPIRED') === 'grey'</code> của 5.4.</p>
</div>
<p><strong>Lần thử B — <code>describe</code> đầy đủ, nhưng bảng vẫn mở</strong> (<code>lab5/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9/10. <code>describe</code> dùng <code>assertNever</code>, nên thêm <code>expired</code> làm nó đỏ (F1 ✓). Nhưng <code>STEP_LABEL</code> vẫn là bảng mở, nên step mới không có mục và không gì phàn nàn (F2 ✗). Đóng bảng bằng <code>Record&lt;Step, string&gt;</code> thì cả hai chốt cùng kích hoạt.</p>

<h3>Thang chấm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li>Thay object rộng bằng một union: <code>{ step: 'draft' } | { step: 'invalid'; code: SlotCode } | { step: 'pending'; record: BookingRecord } | { step: 'confirmed'; record: BookingRecord } | { step: 'cancelled'; record: BookingRecord; reason: string }</code> — giữ mốc <code>// +F</code> ở dòng cuối.</li>
<li><code>describe</code>: một <code>switch (state.step)</code> mà mọi case return và <code>default: return assertNever(state)</code>; <code>assertNever(x: never): never</code>.</li>
<li><code>type ActiveState = { step: 'pending'; record } | { step: 'confirmed'; record }</code>; <code>isActive(state): state is ActiveState</code>.</li>
<li><code>recordOf</code>: <code>'record' in state ? state.record : null</code>; <code>cancel</code> trả <code>{ step: 'cancelled', record: state.record, reason }</code> chỉ khi còn active.</li>
<li><code>type Step = BookingState['step']</code>; <code>STEP_LABEL: Record&lt;Step, string&gt;</code> với một mục mỗi step.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Mười trên mười — và hai điều đáng để ý ở phần F:</p>
<ul>
<li><strong>Trạng thái mới vỡ ở hai chỗ.</strong> <code>srcF/state.ts(…): TS2345 … not assignable to … 'never'</code> là <code>assertNever</code> của <code>describe</code>; <code>TS2741 … 'expired' is missing … Record&lt;…&gt;</code> là <code>STEP_LABEL</code>. Hai chốt, hai dòng đỏ, cả hai chỉ đúng code cần cập nhật.</li>
<li><strong>Mô hình biên dịch cả trước lẫn sau.</strong> Thứ thay đổi là nó từ chối bao nhiêu: từ bản khởi đầu lỏng (0 trên 8 cách dùng sai, một trạng thái mới âm thầm) lên union (8 trên 8, một trạng thái mới là lỗi biên dịch ở hai chỗ).</li>
</ul>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab5</code> in <strong>Score: 10/10</strong>.</li>
<li>Không <code>any</code>, không <code>as</code>, không <code>!</code>; mốc <code>// +F</code> vẫn ở cuối union.</li>
<li>Bạn nói được dòng nào từ chối từng cái S1–S8, và phần F làm đỏ hai dòng nào.</li>
<li>Commit: <code>feat(state): booking lifecycle as a discriminated union (lab 5: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">state machine (máy trạng thái)</span><span class="v">Vòng đời của một thứ dưới dạng một tập trạng thái và chuyển tiếp.</span></div>
  <div class="kv"><span class="k">discriminated union</span><span class="v">Các trạng thái thành một union dùng chung discriminant <code>step</code> (5.3).</span></div>
  <div class="kv"><span class="k">switch đầy đủ</span><span class="v"><code>describe</code> với <code>assertNever</code> — một trạng thái mới là lỗi biên dịch (5.4).</span></div>
  <div class="kv"><span class="k">bảng nhãn đóng</span><span class="v"><code>Record&lt;Step, string&gt;</code> — chốt kiểm-tra-đầy-đủ thứ hai.</span></div>
  <div class="kv"><span class="k">chuyển tiếp bất biến</span><span class="v"><code>cancel</code> trả về trạng thái mới; cái cũ giữ nguyên.</span></div>
</div>

<h3>🗺 Máy chấm cho điểm thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Biên dịch</div><div class="lz-d">tsc strict, rồi các cách dùng đúng (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Quét</div><div class="lz-d">không any, as, ! hay @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Chạy</div><div class="lz-d">node --test, hành vi (D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Tấn công</div><div class="lz-d">8 cách dùng sai, mỗi cái một mã (E)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Thêm trạng thái</div><div class="lz-d">chèn <code>expired</code>; describe + STEP_LABEL phải đỏ (F)</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một mô hình lỏng (<code>step: string</code>, trường optional) biên dịch 0 lỗi mà từ chối 0 trên 8 cách dùng sai: hợp lệ không phải chính xác.</li>
<li>Một union thật với default bắt-hết đạt 8/10 — và vẫn ship một trạng thái mới âm thầm (F 0/2).</li>
<li><code>assertNever</code> được F1; một <code>Record&lt;Step, string&gt;</code> đóng được F2 — hai chốt, hai dòng đỏ khi thêm một trạng thái.</li>
<li>Lời giải: một discriminated union, <code>describe</code> đầy đủ, một type predicate, một <code>cancel</code> bất biến, một bảng đóng.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Discriminated Unions & Exhaustiveness', 'Khuôn mẫu lab này dựng, từ đầu đến cuối. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions')}
${nguon('📘', 'TypeScript Handbook — Utility Types: Record', 'Record&lt;Keys, Type&gt;, bảng nhãn đóng. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
</div>
`,
};
