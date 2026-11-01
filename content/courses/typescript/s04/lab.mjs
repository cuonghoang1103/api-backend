/**
 * TypeScript · Chương 4 · Lab 4 — Mô hình dữ liệu LabFlow. BÀI MỚI 01/11/2026, slug typescript-4-6-lab-mo-hinh-du-lieu (đứng TRƯỚC quiz 4.5).
 * Máy chấm = scripts/cham-lab-4.mjs trong dự án LabFlow TS (tsc 7.0.2 + node 22.23.3 thật): A 2 · B 1 · C 1 · D 2 · E 8 × 0,5; đạt 7.
 * Số đo thật: khởi đầu biên dịch 0 lỗi mà chỉ 4.5/10 (E 3/8, S1 bị từ chối vì lý do sai) · lần thử "index signature any" 6.5/10 · lần thử
 * "interface + union, không readonly, bảng mở" 7.5/10 · tham khảo 10/10. Mọi code/output lấy từ ./_ma-ts-lab-4.mjs (SINH TỰ ĐỘNG).
 */
import G from '../giang/ts-lab-4.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-4.mjs';

const NPM_CI = OUT['l1-npm-ci'].split('\n').filter((l) => !/^npm notice/.test(l)).join('\n');
const GD = CODE.grader.split('\n');
const GRADER_GON = GD.slice(0, 7).concat(['// …'], GD.slice(53, 57)).join('\n');
const grab = (src, first, n) => { const L = src.split('\n'); const i = L.findIndex((l) => l.startsWith(first)); return L.slice(i, i + n).join('\n'); };
const ST = CODE.starter.split('\n');
const ST_LOGIC = [ST[36], '…', ST.slice(48, 54).join('\n'), '…', ST.slice(62, 65).join('\n')].join('\n');
const YEU_DONG = [grab(CODE.yeu, 'export interface Lab', 7), '…', grab(CODE.yeu, 'export const LAB_INFO', 1), '…', grab(CODE.yeu, 'export function seatsByLab', 2)].join('\n');
const VUA_DONG = [grab(CODE.vua, 'export interface Entity', 4), '…', grab(CODE.vua, 'export interface Lab', 6), '…', grab(CODE.vua, 'export const LAB_INFO', 1)].join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong use</th><th>tsc must say</th><th>The starter, run by Node</th><th>What it means</th></tr></thead>
<tbody>
<tr><td>S1</td><td>a lab without a capacity</td><td>TS2741</td><td>free seats <code>0</code></td><td>a real room looks full; nobody can book it</td></tr>
<tr><td>S2</td><td><code>capasity: 40</code></td><td>TS2561</td><td>free seats <code>0</code></td><td>the typo of 4.1, saved and shown as “full”</td></tr>
<tr><td>S3</td><td><code>role: 'TEACHER'</code></td><td>TS2322</td><td>needs approval <code>true</code></td><td>a lecturer’s 40-seat booking waits for an admin</td></tr>
<tr><td>S4</td><td><code>record.status = 'CONFIRMED'</code></td><td>TS2540</td><td>the pending list now shows <code>CONFIRMED</code></td><td>changed in place, so every screen sharing the object changes</td></tr>
<tr><td>S5</td><td><code>lab.equipment?.push('printer')</code></td><td>TS2339</td><td><code>LAB_INFO</code> now says BE-202 has a printer</td><td>the shared table was edited by one screen</td></tr>
<tr><td>S6</td><td><code>lab.equipment.length</code></td><td>TS18048</td><td><code>TypeError</code> on a lab from the database</td><td>“not recorded” crashes the page</td></tr>
<tr><td>S7</td><td><code>LAB_INFO['BE-999']</code></td><td>TS7053</td><td><code>undefined</code>, “unknown lab”</td><td>a ghost lab gets a page instead of a 404</td></tr>
<tr><td>S8</td><td>a <code>User</code> without <code>id</code> / <code>createdAt</code></td><td>TS2739</td><td>indexed under the key <code>"undefined"</code></td><td>the next user without an id overwrites it</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng sai</th><th>tsc phải báo</th><th>Bản khởi đầu, Node chạy thật</th><th>Nghĩa là gì</th></tr></thead>
<tbody>
<tr><td>S1</td><td>phòng không có sức chứa</td><td>TS2741</td><td>chỗ trống <code>0</code></td><td>phòng thật trông như đã kín; không ai đặt được</td></tr>
<tr><td>S2</td><td><code>capasity: 40</code></td><td>TS2561</td><td>chỗ trống <code>0</code></td><td>lỗi gõ của 4.1, được lưu và hiện thành “kín chỗ”</td></tr>
<tr><td>S3</td><td><code>role: 'TEACHER'</code></td><td>TS2322</td><td>cần duyệt <code>true</code></td><td>lượt đặt 40 chỗ của giảng viên phải chờ admin</td></tr>
<tr><td>S4</td><td><code>record.status = 'CONFIRMED'</code></td><td>TS2540</td><td>danh sách chờ duyệt giờ hiện <code>CONFIRMED</code></td><td>sửa tại chỗ, nên mọi màn hình dùng chung object đều đổi</td></tr>
<tr><td>S5</td><td><code>lab.equipment?.push('printer')</code></td><td>TS2339</td><td><code>LAB_INFO</code> giờ nói BE-202 có máy in</td><td>bảng dùng chung bị một màn hình sửa</td></tr>
<tr><td>S6</td><td><code>lab.equipment.length</code></td><td>TS18048</td><td><code>TypeError</code> với phòng lấy từ CSDL</td><td>“chưa ghi” làm sập trang</td></tr>
<tr><td>S7</td><td><code>LAB_INFO['BE-999']</code></td><td>TS7053</td><td><code>undefined</code>, “unknown lab”</td><td>phòng ma có trang riêng thay vì 404</td></tr>
<tr><td>S8</td><td><code>User</code> thiếu <code>id</code> / <code>createdAt</code></td><td>TS2739</td><td>được lưu dưới khoá <code>"undefined"</code></td><td>người dùng thiếu id kế tiếp ghi đè nó</td></tr>
</tbody>
</table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th><th>The habit it trains</th></tr></thead>
<tbody>
<tr><td>A — your file compiles</td><td>2</td><td><code>tsc -p</code>, course tsconfig (strict, <code>noUncheckedIndexedAccess</code>)</td><td>a model that type-checks on its own</td></tr>
<tr><td>B — correct uses compile</td><td>1</td><td>tsc on <code>kiem/phai-dung.ts</code>: <code>LAB_INFO[code].capacity</code> with no check, <code>equipment?.length</code>, <code>seatsByLab(…)['BE-202']</code> as a number, <code>byId[1]</code> as <code>User | undefined</code></td><td>a model that is pleasant to use, not just strict</td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, no <code>as</code> (except <code>as const</code>), no <code>!</code>, no <code>@ts-</code></td><td>the type says what the data is</td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: 10 tests in <code>test/model.test.ts</code></td><td>absent vs empty, counts with zeros, updates that copy</td></tr>
<tr><td>E — wrong uses refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has the expected code</td><td>required, excess, readonly, optional, closed keys, extends</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th><th>Thói quen nó rèn</th></tr></thead>
<tbody>
<tr><td>A — tệp của bạn biên dịch được</td><td>2</td><td><code>tsc -p</code>, tsconfig của khoá (strict, <code>noUncheckedIndexedAccess</code>)</td><td>một mô hình tự qua kiểm kiểu</td></tr>
<tr><td>B — cách dùng đúng biên dịch được</td><td>1</td><td>tsc trên <code>kiem/phai-dung.ts</code>: <code>LAB_INFO[code].capacity</code> không cần kiểm, <code>equipment?.length</code>, <code>seatsByLab(…)['BE-202']</code> là số, <code>byId[1]</code> là <code>User | undefined</code></td><td>mô hình dễ dùng, không chỉ chặt</td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, không <code>as</code> (trừ <code>as const</code>), không <code>!</code>, không <code>@ts-</code></td><td>kiểu nói đúng dữ liệu là gì</td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: 10 test trong <code>test/model.test.ts</code></td><td>vắng mặt khác rỗng, đếm giữ số không, cập nhật bằng bản sao</td></tr>
<tr><td>E — cách dùng sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có lỗi đúng mã</td><td>bắt buộc, khoá thừa, readonly, optional, khoá đóng, extends</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 4 — LabFlow’s data model|||Lab 4 — Mô hình dữ liệu LabFlow',
  slug: 'typescript-4-6-lab-mo-hinh-du-lieu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 4 có thang chấm 10 điểm và máy chấm chạy tsc + Node thật: model.ts của LabFlow (Lab, User, BookingRecord, BookingView, LAB_INFO, seatsByLab, withStatus). Bản khởi đầu biên dịch 0 lỗi dưới strict mà chỉ được 4.5/10 — capacity optional "cho seed chạy", role/status là string, index signature, mảng sửa tại chỗ, ba lỗi hành vi. Bạn viết interface extends Entity, readonly, optional đúng chỗ, Record<LabCode, Lab> — không any/as/!, 10 test xanh, 8 cách dùng sai bị từ chối đúng mã. Có output thật của 8 cách dùng sai chạy trên bản khởi đầu, lần thử "index signature any" (6.5/10), "interface + union, không readonly, bảng mở" (7.5/10) và lời giải 10/10.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lab 4</span>
<h2>LabFlow’s data model</h2>
<p class="lead">60–90 minutes. A teammate wrote LabFlow’s data model — labs, users, stored bookings, the lab table, a seat counter. It compiles under strict with <strong>zero errors</strong>, and a script that runs tsc and Node gives it <strong>4.5 out of 10</strong>. You rewrite the types with everything from Chapter 4 — required, optional and read-only properties, <code>interface … extends</code>, an intersection, a closed <code>Record</code> — until the grader says 10/10. This is the file every other part of LabFlow will import: the API (Chapter 11), the React form (Chapter 12), the Prisma schema (Chapter 13).</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>Lesson 4.1</strong> — required vs optional (<code>capacity</code> vs <code>equipment?</code>), read-only identity and read-only arrays.</li>
<li><strong>Lesson 4.2</strong> — <code>interface</code> for named shapes, <code>type</code> for unions and compositions.</li>
<li><strong>Lesson 4.3</strong> — <code>Entity</code> written once; <code>User</code> and <code>BookingRecord</code> extend it; <code>BookingView</code> with <code>&amp;</code>.</li>
<li><strong>Lesson 4.4</strong> — <code>LAB_INFO: Record&lt;LabCode, Lab&gt;</code>, a per-lab count that keeps zeros, an id index that may miss.</li>
</ul>

<h3>Setup</h3>
<ol>
<li>Use <code>labflow-ts</code> at the end of Chapter 4 and install the pinned versions:
${ra(NPM_CI)}</li>
<li>The reference solution is <code>src/rules/model.ts</code> (with 10 tests). Don’t open it before you have tried; you work only in <code>lab4/src/model.ts</code>. The reference project is healthy:
${ra(OUT['l2-ref-check'])}</li>
<li>The lab’s tsconfig only extends the course one:
${ma('json', CODE.labTsconfig)}</li>
<li>Your starting point — the teammate’s file:
${ma('typescript', CODE.starter)}</li>
</ol>

<h3>Zero errors — and why that proves nothing</h3>
${ra(OUT['l4-strict'])}
<p>Strict mode, <code>noUncheckedIndexedAccess</code>, and not one error in <code>lab4/src</code>. Every type in the file is <em>valid</em>; the problem is that the types are <em>loose</em>: <code>code: string</code> accepts any text, <code>role: string</code> any role, <code>capacity?</code> makes a room without seats legal, <code>LabTable</code> is an open dictionary, nothing is read-only. A type can only refuse what it describes.</p>

<h3>The grader</h3>
<p><code>npm run lab4</code> runs <code>scripts/cham-lab-4.mjs</code>. It copies your <code>model.ts</code> plus the course’s <code>time.ts</code>, <code>booking.ts</code> and <code>schedule.ts</code> into a fresh folder beside its own tests:</p>
${ma('javascript', GRADER_GON)}
<p>Correct uses that must keep compiling (part B). Line 10 reads <code>LAB_INFO[code].capacity</code> with no check — only a closed table makes that safe:</p>
${ma('typescript', CODE.dung)}
<p>Run the grader on the starter:</p>
${ra(OUT['l5-starter'])}
<p><strong>4.5 out of 10.</strong> B fails because the open table gives <code>Lab | undefined</code> for every read (TS2532, TS2322). D fails four tests — three behaviour problems in plain sight:</p>
${ma('typescript', ST_LOGIC)}
<ul>
<li><code>equipment: []</code> for BE-202 says “recorded: nothing” — but nobody has recorded it yet (4.1: absent is not empty).</li>
<li><code>seatsByLab</code> starts from <code>{}</code>, so a lab with no bookings is missing instead of 0 (4.4).</li>
<li><code>withStatus</code> changes the record it was given and returns the same object, so the “pending” list changes too (4.1).</li>
</ul>
<p>E: only S1, S2 and S8 are refused — and S1 for the <em>wrong reason</em>: the starter’s message says <code>equipment</code> is missing, because <code>capacity</code> is optional. The grader only checks the code; you should check the reason.</p>

<h3>Your task</h3>
<p>Edit <strong>only</strong> <code>lab4/src/model.ts</code> until <code>npm run lab4</code> prints <strong>Score: 10/10</strong>: compiles under strict; no <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code>; the 10 tests pass; the 8 wrong uses below are refused with the expected codes. For each field ask the 4.1 questions — must it be there? may it be absent? may it change? — and for each table the 4.4 question: are the keys known?</p>

<h3>The eight wrong uses</h3>
${ma('typescript', CODE.sai)}
<p>What the same mistakes do at runtime with the starter model:</p>
${ma('typescript', CODE.saiChay)}
${ra(OUT['l6-sai-chay'])}
${BANG_EN}
<p>One crash (S6), seven quietly wrong answers. The worst are the “0 free seats” rooms (S1, S2) and the edited shared objects (S4, S5): nothing fails, the data is just wrong on every screen.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — “a flexible model”</strong> (<code>lab4/yeu/</code>). The behaviour bugs are fixed; the types got looser:</p>
${ma('typescript', YEU_DONG)}
${ra(OUT['l7-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>[extra: string]: any</code> switches off the excess check.</strong> 6.5/10, not a pass. With an index signature of <code>any</code>, <code>capasity: 40</code> is just another allowed key — S2 now fails with TS2741 (“capacity is missing”) instead of TS2561, the typo is never named. <code>LAB_INFO: any</code> makes B pass for the wrong reason (no checks at all) and lets S7 through. “Flexible” models are how the bugs of 4.1 come back.</p>
</div>
<p><strong>Attempt B — interfaces and unions, no <code>readonly</code>, an open table</strong> (<code>lab4/vua/</code>):</p>
${ma('typescript', VUA_DONG)}
${ra(OUT['l8-vua'])}
<p>7.5/10 — a pass, with three holes. <code>Role</code>, <code>LabCode</code>, a required <code>capacity</code> and <code>User extends Entity</code> refuse S1–S3, S6 and S8. But without <code>readonly</code> S4 (changing a stored record) and S5 (pushing into the shared list) compile, and the open <code>LAB_INFO</code> lets S7 through and fails B: every caller has to check a lab that always exists.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li><code>interface Entity { readonly id: number; readonly createdAt: string }</code>, then <code>interface User extends Entity { … role: Role; studentCode?: string }</code>.</li>
<li><code>Lab</code>: <code>readonly code: LabCode</code>, a required <code>capacity</code>, <code>equipment?: readonly string[]</code> — and delete <code>equipment: []</code> from BE-202.</li>
<li><code>type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'</code>; every field of <code>BookingRecord</code> is <code>readonly</code>; <code>range: TimeRange</code>.</li>
<li><code>withStatus</code> returns <code>{ ...b, status }</code>; <code>BookingView</code> stays <code>BookingRecord &amp; { labName: string; userName: string }</code>.</li>
<li><code>LAB_INFO: Record&lt;LabCode, Lab&gt;</code>; <code>labName(code: LabCode)</code> needs no fallback any more.</li>
<li><code>seatsByLab</code> returns <code>Record&lt;LabCode, number&gt;</code> starting from three zeros; <code>indexById</code> keeps an open <code>Record&lt;number, User&gt;</code> — ids really arrive at runtime.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l9-ref'])}
<p>Ten out of ten. Three things to notice:</p>
<ul>
<li><strong>Open where the data is open, closed where it is known.</strong> <code>LAB_INFO</code> is closed (three labs, known in code), <code>indexById</code> is open (ids come from the database) — and B checks that both are typed that way.</li>
<li><strong><code>readonly</code> on the record, <code>withStatus</code> for change.</strong> S4 is refused, and the only way to “change” a booking is the function that copies it.</li>
<li><strong>The model compiled with zero errors before and after.</strong> What changed is how much each type <em>refuses</em>: from 3 of 8 wrong uses to 8 of 8.</li>
</ul>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab4</code> prints <strong>Score: 10/10</strong>.</li>
<li><code>npx tsc -p lab4</code> is clean — tests and correct uses included.</li>
<li>No <code>any</code>, no <code>as</code>, no <code>!</code>; BE-202 has no <code>equipment</code> key.</li>
<li>You can say which line of your file refuses each of S1–S8.</li>
<li>Commit: <code>feat(model): readonly entities, closed lab table (lab 4: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">data model</span><span class="v">The types of the things a system stores: <code>Lab</code>, <code>User</code>, <code>BookingRecord</code>.</span></div>
  <div class="kv"><span class="k">loose vs strict type</span><span class="v">Both compile; a loose type (<code>string</code>, <code>?</code>, index signature) refuses less.</span></div>
  <div class="kv"><span class="k">base entity</span><span class="v"><code>Entity { readonly id; readonly createdAt }</code>, extended by every stored type.</span></div>
  <div class="kv"><span class="k">closed table</span><span class="v"><code>Record&lt;LabCode, Lab&gt;</code> — every key known, reads need no check.</span></div>
  <div class="kv"><span class="k">immutable update</span><span class="v">Change = a new object (<code>{ ...b, status }</code>), the old one untouched.</span></div>
</div>

<h3>🗺 How the grader scores you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Copy</div><div class="lz-d">your model.ts + the course time/booking/schedule</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Compile</div><div class="lz-d">strict tsc, then the correct uses (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Scan</div><div class="lz-d">no any, as, ! or @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Run</div><div class="lz-d">node --test, 10 behaviour tests (D)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Attack</div><div class="lz-d">8 wrong uses, each with its expected code (E)</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A model can compile with zero errors and still refuse only 3 of 8 wrong uses: valid is not the same as precise.</li>
<li><code>[extra: string]: any</code> and <code>LAB_INFO: any</code> made things “work” and refused less (6.5/10).</li>
<li>Interfaces and unions without <code>readonly</code> or a closed table passed with 7.5 — and still let shared objects be edited in place.</li>
<li>The reference: <code>Entity</code> + <code>extends</code>, <code>readonly</code> records changed by copying, optional only where “not recorded” is real, <code>Record&lt;LabCode, Lab&gt;</code> for the known table.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Object Types', 'Everything this lab uses: property modifiers, extending, intersections, index signatures. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/objects.html')}
${nguon('📘', 'TypeScript Handbook — Utility Types: Record', 'Record&lt;Keys, Type&gt;, used for LAB_INFO and the seat counter. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Lab 4</span>
<h2>Mô hình dữ liệu LabFlow</h2>
<p class="lead">60–90 phút. Một đồng đội viết mô hình dữ liệu của LabFlow — phòng lab, người dùng, lượt đặt đã lưu, bảng phòng, bộ đếm chỗ. Nó biên dịch dưới strict với <strong>không lỗi nào</strong>, vậy mà một script chạy tsc và Node chỉ cho <strong>4.5 trên 10</strong>. Bạn viết lại các kiểu bằng mọi thứ của Chương 4 — thuộc tính bắt buộc, optional, chỉ đọc, <code>interface … extends</code>, intersection, <code>Record</code> đóng — tới khi máy chấm báo 10/10. Đây là tệp mọi phần khác của LabFlow sẽ import: API (Chương 11), form React (Chương 12), schema Prisma (Chương 13).</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>Bài 4.1</strong> — bắt buộc hay optional (<code>capacity</code> so với <code>equipment?</code>), danh tính chỉ đọc và mảng chỉ đọc.</li>
<li><strong>Bài 4.2</strong> — <code>interface</code> cho dáng có tên, <code>type</code> cho union và phép ghép.</li>
<li><strong>Bài 4.3</strong> — <code>Entity</code> viết một lần; <code>User</code> và <code>BookingRecord</code> extends nó; <code>BookingView</code> bằng <code>&amp;</code>.</li>
<li><strong>Bài 4.4</strong> — <code>LAB_INFO: Record&lt;LabCode, Lab&gt;</code>, phép đếm theo phòng giữ số không, chỉ mục id có thể trượt.</li>
</ul>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng <code>labflow-ts</code> ở cuối Chương 4 và cài đúng các bản đã ghim:
${ra(NPM_CI)}</li>
<li>Lời giải tham khảo là <code>src/rules/model.ts</code> (kèm 10 test). Đừng mở trước khi tự làm; bạn chỉ làm trong <code>lab4/src/model.ts</code>. Dự án tham khảo đang khoẻ:
${ra(OUT['l2-ref-check'])}</li>
<li>tsconfig của lab chỉ kế thừa tsconfig của khoá:
${ma('json', CODE.labTsconfig)}</li>
<li>Điểm xuất phát — tệp của đồng đội:
${ma('typescript', CODE.starter)}</li>
</ol>

<h3>Không lỗi nào — và vì sao điều đó chẳng chứng minh gì</h3>
${ra(OUT['l4-strict'])}
<p>Strict, <code>noUncheckedIndexedAccess</code>, và không một lỗi nào trong <code>lab4/src</code>. Kiểu nào trong tệp cũng <em>hợp lệ</em>; vấn đề là chúng <em>lỏng</em>: <code>code: string</code> nhận chữ gì cũng được, <code>role: string</code> vai trò gì cũng được, <code>capacity?</code> cho một phòng không có chỗ ngồi là hợp lệ, <code>LabTable</code> là từ điển mở, không gì chỉ đọc. Một kiểu chỉ từ chối được thứ nó mô tả.</p>

<h3>Máy chấm</h3>
<p><code>npm run lab4</code> chạy <code>scripts/cham-lab-4.mjs</code>. Nó chép <code>model.ts</code> của bạn cùng <code>time.ts</code>, <code>booking.ts</code> và <code>schedule.ts</code> của khoá vào một thư mục mới cạnh bộ test của nó:</p>
${ma('javascript', GRADER_GON)}
<p>Các cách dùng đúng phải tiếp tục biên dịch được (phần B). Dòng 10 đọc <code>LAB_INFO[code].capacity</code> không kiểm — chỉ một bảng đóng mới làm điều đó an toàn:</p>
${ma('typescript', CODE.dung)}
<p>Chạy máy chấm trên bản khởi đầu:</p>
${ra(OUT['l5-starter'])}
<p><strong>4.5 trên 10.</strong> B trượt vì bảng mở cho <code>Lab | undefined</code> ở mọi phép đọc (TS2532, TS2322). D trượt bốn test — ba vấn đề hành vi nằm ngay trước mắt:</p>
${ma('typescript', ST_LOGIC)}
<ul>
<li><code>equipment: []</code> của BE-202 nói “đã ghi: không có gì” — nhưng thật ra chưa ai ghi (4.1: vắng mặt khác rỗng).</li>
<li><code>seatsByLab</code> bắt đầu từ <code>{}</code>, nên phòng chưa có lượt đặt bị thiếu thay vì bằng 0 (4.4).</li>
<li><code>withStatus</code> sửa chính bản ghi nó nhận và trả lại cùng object đó, nên danh sách “chờ duyệt” cũng đổi theo (4.1).</li>
</ul>
<p>E: chỉ S1, S2 và S8 bị từ chối — và S1 vì <em>lý do sai</em>: thông báo của bản khởi đầu nói thiếu <code>equipment</code>, vì <code>capacity</code> là optional. Máy chấm chỉ kiểm mã lỗi; bạn nên kiểm cả lý do.</p>

<h3>Nhiệm vụ</h3>
<p><strong>Chỉ</strong> sửa <code>lab4/src/model.ts</code> tới khi <code>npm run lab4</code> in <strong>Score: 10/10</strong>: biên dịch được dưới strict; không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code>; 10 test qua; 8 cách dùng sai dưới đây bị từ chối đúng mã. Với mỗi trường hãy hỏi ba câu của 4.1 — có bắt buộc không? có thể vắng không? có được đổi không? — và với mỗi bảng câu hỏi của 4.4: khoá đã biết trước chưa?</p>

<h3>Tám cách dùng sai</h3>
${ma('typescript', CODE.sai)}
<p>Những lỗi đó làm gì lúc chạy với mô hình khởi đầu:</p>
${ma('typescript', CODE.saiChay)}
${ra(OUT['l6-sai-chay'])}
${BANG_VI}
<p>Một lần sập (S6), bảy câu trả lời sai lặng lẽ. Tệ nhất là các phòng “0 chỗ trống” (S1, S2) và các object dùng chung bị sửa (S4, S5): không gì hỏng, chỉ là dữ liệu sai trên mọi màn hình.</p>

<h3>Những lần thử đầu tiên thường trông thế nào</h3>
<p><strong>Lần thử A — “mô hình linh hoạt”</strong> (<code>lab4/yeu/</code>). Lỗi hành vi đã sửa; kiểu thì lỏng hơn:</p>
${ma('typescript', YEU_DONG)}
${ra(OUT['l7-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>[extra: string]: any</code> tắt phép kiểm khoá thừa.</strong> 6.5/10, không đạt. Có index signature kiểu <code>any</code> thì <code>capasity: 40</code> chỉ là một khoá được phép nữa — S2 giờ trượt với TS2741 (“thiếu capacity”) thay vì TS2561, lỗi gõ không bao giờ được gọi tên. <code>LAB_INFO: any</code> làm B qua vì lý do sai (không kiểm gì cả) và để S7 lọt. Mô hình “linh hoạt” là cách các bug của 4.1 quay lại.</p>
</div>
<p><strong>Lần thử B — interface và union, không <code>readonly</code>, bảng mở</strong> (<code>lab4/vua/</code>):</p>
${ma('typescript', VUA_DONG)}
${ra(OUT['l8-vua'])}
<p>7.5/10 — đạt, với ba lỗ hổng. <code>Role</code>, <code>LabCode</code>, <code>capacity</code> bắt buộc và <code>User extends Entity</code> từ chối được S1–S3, S6 và S8. Nhưng không có <code>readonly</code> nên S4 (sửa bản ghi đã lưu) và S5 (push vào danh sách dùng chung) biên dịch được, còn <code>LAB_INFO</code> mở để S7 lọt và làm B trượt: người gọi nào cũng phải kiểm một phòng luôn tồn tại.</p>

<h3>Thang chấm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li><code>interface Entity { readonly id: number; readonly createdAt: string }</code>, rồi <code>interface User extends Entity { … role: Role; studentCode?: string }</code>.</li>
<li><code>Lab</code>: <code>readonly code: LabCode</code>, <code>capacity</code> bắt buộc, <code>equipment?: readonly string[]</code> — và xoá <code>equipment: []</code> khỏi BE-202.</li>
<li><code>type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'</code>; mọi trường của <code>BookingRecord</code> là <code>readonly</code>; <code>range: TimeRange</code>.</li>
<li><code>withStatus</code> trả <code>{ ...b, status }</code>; <code>BookingView</code> vẫn là <code>BookingRecord &amp; { labName: string; userName: string }</code>.</li>
<li><code>LAB_INFO: Record&lt;LabCode, Lab&gt;</code>; <code>labName(code: LabCode)</code> không cần giá trị dự phòng nữa.</li>
<li><code>seatsByLab</code> trả <code>Record&lt;LabCode, number&gt;</code> bắt đầu từ ba số không; <code>indexById</code> giữ <code>Record&lt;number, User&gt;</code> mở — id thật sự tới lúc chạy.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l9-ref'])}
<p>Mười trên mười. Ba điều đáng để ý:</p>
<ul>
<li><strong>Mở ở chỗ dữ liệu mở, đóng ở chỗ đã biết.</strong> <code>LAB_INFO</code> đóng (ba phòng, biết trong code), <code>indexById</code> mở (id đến từ CSDL) — và B kiểm cả hai được gõ kiểu đúng như vậy.</li>
<li><strong><code>readonly</code> trên bản ghi, <code>withStatus</code> để thay đổi.</strong> S4 bị từ chối, và cách duy nhất để “đổi” một lượt đặt là hàm tạo bản sao.</li>
<li><strong>Mô hình biên dịch không lỗi cả trước lẫn sau.</strong> Thứ thay đổi là mỗi kiểu <em>từ chối</em> được bao nhiêu: từ 3 trên 8 cách dùng sai lên 8 trên 8.</li>
</ul>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab4</code> in <strong>Score: 10/10</strong>.</li>
<li><code>npx tsc -p lab4</code> sạch — kể cả test và các cách dùng đúng.</li>
<li>Không <code>any</code>, không <code>as</code>, không <code>!</code>; BE-202 không có khoá <code>equipment</code>.</li>
<li>Bạn nói được dòng nào trong tệp của mình từ chối từng cái S1–S8.</li>
<li>Commit: <code>feat(model): readonly entities, closed lab table (lab 4: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">data model (mô hình dữ liệu)</span><span class="v">Kiểu của những thứ hệ thống lưu: <code>Lab</code>, <code>User</code>, <code>BookingRecord</code>.</span></div>
  <div class="kv"><span class="k">kiểu lỏng và kiểu chặt</span><span class="v">Cả hai đều biên dịch; kiểu lỏng (<code>string</code>, <code>?</code>, index signature) từ chối ít hơn.</span></div>
  <div class="kv"><span class="k">base entity (thực thể nền)</span><span class="v"><code>Entity { readonly id; readonly createdAt }</code>, được mọi kiểu lưu trữ extends.</span></div>
  <div class="kv"><span class="k">closed table (bảng đóng)</span><span class="v"><code>Record&lt;LabCode, Lab&gt;</code> — khoá nào cũng đã biết, đọc không cần kiểm.</span></div>
  <div class="kv"><span class="k">immutable update (cập nhật bất biến)</span><span class="v">Thay đổi = một object mới (<code>{ ...b, status }</code>), object cũ giữ nguyên.</span></div>
</div>

<h3>🗺 Máy chấm cho điểm thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Chép</div><div class="lz-d">model.ts của bạn + time/booking/schedule của khoá</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Biên dịch</div><div class="lz-d">tsc strict, rồi các cách dùng đúng (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Quét</div><div class="lz-d">không any, as, ! hay @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Chạy</div><div class="lz-d">node --test, 10 test hành vi (D)</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Tấn công</div><div class="lz-d">8 cách dùng sai, mỗi cái một mã lỗi mong đợi (E)</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một mô hình có thể biên dịch không lỗi mà chỉ từ chối được 3 trên 8 cách dùng sai: hợp lệ không có nghĩa là chính xác.</li>
<li><code>[extra: string]: any</code> và <code>LAB_INFO: any</code> làm mọi thứ “chạy được” và từ chối ít hơn (6.5/10).</li>
<li>Interface và union mà thiếu <code>readonly</code> hay bảng đóng thì đạt với 7.5 — và vẫn để object dùng chung bị sửa tại chỗ.</li>
<li>Lời giải: <code>Entity</code> + <code>extends</code>, bản ghi <code>readonly</code> thay đổi bằng bản sao, optional chỉ ở chỗ “chưa ghi” là thật, <code>Record&lt;LabCode, Lab&gt;</code> cho bảng đã biết.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Object Types', 'Mọi thứ lab này dùng: bổ ngữ thuộc tính, mở rộng, intersection, index signature. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/objects.html')}
${nguon('📘', 'TypeScript Handbook — Utility Types: Record', 'Record&lt;Keys, Type&gt;, dùng cho LAB_INFO và bộ đếm chỗ. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
</div>
`,
};
