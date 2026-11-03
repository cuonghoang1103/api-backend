/**
 * TypeScript · Chương 7 · Lab 7 — Hệ sự kiện có kiểu. BÀI MỚI 03/11/2026, slug typescript-7-6-lab-he-su-kien (đứng TRƯỚC quiz 7.5).
 * Máy chấm = scripts/cham-lab-7.mjs trong LabFlow TS (tsc 7.0.2 + node 22.23.3 thật): A2·B1·C1·D2·E 8×0,5; đạt 7.
 * Số đo thật: khởi đầu (any/string khắp nơi) 5/10 · "bus không generic + Frozen đồng nhất" 7.5/10 · "đủ kiểu nhưng Patch index signature" 9.5/10 · tham khảo 10/10.
 * Mọi code/output lấy từ ./_ma-ts-lab-7.mjs (SINH TỰ ĐỘNG). Lời giải = ./_labflow-ts/src/rules/events.ts.
 */
import G from '../giang/ts-lab-7.mjs';
import { ma, ra, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-lab-7.mjs';

const NPM_CI = OUT['l1-npm-ci'].split('\n').filter((l) => !/^npm (notice|warn)/.test(l)).join('\n');
const noc = (s) => s.split('\n').map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');
const L = (s) => s.split('\n');
const ST = CODE.starter.split('\n');
const STARTER_TOP = ST.slice(3, 10).join('\n');

const BANG_EN = `<table>
<thead><tr><th>#</th><th>Wrong use</th><th>tsc must say</th><th>Which advanced type catches it</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>emit('booking:creatd', …)</code></td><td>TS2345</td><td>template literal event names (7.4)</td></tr>
<tr><td>S2</td><td><code>emit('booking:created', { id })</code></td><td>TS2741</td><td>the payload map + conditional PayloadOf (7.1, 7.3)</td></tr>
<tr><td>S3</td><td>handler reads <code>p.reasn</code></td><td>TS2551</td><td>the typed handler payload</td></tr>
<tr><td>S4</td><td><code>const e: BookingEvent = 'booking:expired'</code></td><td>TS2322</td><td>template literal event names</td></tr>
<tr><td>S5</td><td><code>PayloadOf&lt;'booking:deleted'&gt;</code></td><td>TS2344</td><td>the conditional type’s constraint</td></tr>
<tr><td>S6</td><td><code>f.name = …</code> on a <code>Frozen</code></td><td>TS2540</td><td>the readonly mapped type (7.1)</td></tr>
<tr><td>S7</td><td><code>Patch</code> with a misspelled key</td><td>TS2353</td><td>the optional mapped type (7.2)</td></tr>
<tr><td>S8</td><td>a handler asking for a wider payload</td><td>TS2345</td><td>the per-event handler type</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>#</th><th>Cách dùng sai</th><th>tsc phải báo</th><th>Kiểu nâng cao nào bắt được</th></tr></thead>
<tbody>
<tr><td>S1</td><td><code>emit('booking:creatd', …)</code></td><td>TS2345</td><td>tên sự kiện template literal (7.4)</td></tr>
<tr><td>S2</td><td><code>emit('booking:created', { id })</code></td><td>TS2741</td><td>bản đồ payload + conditional PayloadOf (7.1, 7.3)</td></tr>
<tr><td>S3</td><td>handler đọc <code>p.reasn</code></td><td>TS2551</td><td>payload có kiểu của handler</td></tr>
<tr><td>S4</td><td><code>const e: BookingEvent = 'booking:expired'</code></td><td>TS2322</td><td>tên sự kiện template literal</td></tr>
<tr><td>S5</td><td><code>PayloadOf&lt;'booking:deleted'&gt;</code></td><td>TS2344</td><td>ràng buộc của conditional type</td></tr>
<tr><td>S6</td><td><code>f.name = …</code> trên một <code>Frozen</code></td><td>TS2540</td><td>mapped type readonly (7.1)</td></tr>
<tr><td>S7</td><td><code>Patch</code> với một khoá gõ sai</td><td>TS2353</td><td>mapped type optional (7.2)</td></tr>
<tr><td>S8</td><td>một handler đòi payload rộng hơn</td><td>TS2345</td><td>kiểu handler theo từng sự kiện</td></tr>
</tbody>
</table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>Points</th><th>How the grader checks it</th></tr></thead>
<tbody>
<tr><td>A — your file compiles</td><td>2</td><td><code>tsc -p</code>, course tsconfig (strict, nodenext)</td></tr>
<tr><td>B — correct uses compile</td><td>1</td><td><code>kiem/phai-dung.ts</code>: <code>on</code>/<code>emit</code> typed per event, <code>PayloadOf</code>, <code>Frozen</code>, <code>Patch</code></td></tr>
<tr><td>C — honesty</td><td>1</td><td>no <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code></td></tr>
<tr><td>D — behaviour</td><td>2</td><td><code>node --test</code>: the right payload reaches each handler; <code>count</code></td></tr>
<tr><td>E — wrong uses refused</td><td>4 (8 × 0.5)</td><td>each marked line of <code>kiem/sai.ts</code> has the expected code</td></tr>
</tbody>
</table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Máy chấm kiểm thế nào</th></tr></thead>
<tbody>
<tr><td>A — tệp của bạn biên dịch được</td><td>2</td><td><code>tsc -p</code>, tsconfig của khoá (strict, nodenext)</td></tr>
<tr><td>B — cách dùng đúng biên dịch được</td><td>1</td><td><code>kiem/phai-dung.ts</code>: <code>on</code>/<code>emit</code> có kiểu theo sự kiện, <code>PayloadOf</code>, <code>Frozen</code>, <code>Patch</code></td></tr>
<tr><td>C — trung thực</td><td>1</td><td>không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code></td></tr>
<tr><td>D — hành vi</td><td>2</td><td><code>node --test</code>: đúng payload tới mỗi handler; <code>count</code></td></tr>
<tr><td>E — cách dùng sai bị từ chối</td><td>4 (8 × 0,5)</td><td>mỗi dòng đánh dấu trong <code>kiem/sai.ts</code> có đúng mã</td></tr>
</tbody>
</table>`;

export default {
  title: 'Lab 7 — A typed event system|||Lab 7 — Hệ sự kiện có kiểu',
  slug: 'typescript-7-6-lab-he-su-kien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab Chương 7 có thang 10 điểm và máy chấm chạy tsc + Node thật: events.ts của LabFlow — một EventBus có kiểu nơi mọi kiểu nâng cao của chương gặp nhau. Tên sự kiện là template literal booking:${Action} (7.4), bản đồ payload + PayloadOf conditional (7.1, 7.3), on/emit generic theo từng sự kiện (payload của handler đúng theo tên), và hai mapped type Frozen/Patch (7.1, 7.2). Bản khởi đầu dùng string + any: biên dịch 0 lỗi mà chỉ 5/10 — tên sự kiện gõ sai lọt, payload sai lọt. Có output thật của "bus không generic + Frozen đồng nhất" (7.5/10), "đủ kiểu nhưng Patch index signature lỏng" (9.5/10) và lời giải 10/10.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lab 7</span>
<h2>A typed event system</h2>
<p class="lead">60–90 minutes. LabFlow emits events — a booking created, confirmed, cancelled — and every part of the app subscribes to them. The teammate’s version uses <code>string</code> names and <code>any</code> payloads: it compiles with <strong>zero errors</strong>, and a typo in an event name or a wrong payload ships silently. The grader gives it <strong>5 out of 10</strong>. You rebuild it with the chapter’s advanced types — template literal event names, a payload map, a conditional lookup, per-event <code>on</code>/<code>emit</code>, and two mapped types — until the grader says 10/10. This is the file every module will import to publish and listen.</p>

<h3>What this lab trains</h3>
<ul>
<li><strong>7.1</strong> — the payload map and the <code>Frozen</code> mapped type.</li>
<li><strong>7.2</strong> — the <code>Patch</code> mapped type (optional fields).</li>
<li><strong>7.3</strong> — <code>PayloadOf&lt;E&gt;</code>, a conditional type that looks a payload up by name.</li>
<li><strong>7.4</strong> — <code>BookingEvent</code>, template literal event names, so a typo is a compile error.</li>
</ul>

<h3>Setup</h3>
<ol>
<li>Use <code>labflow-ts</code> at the end of Chapter 7 and install the pinned versions:
${ra(NPM_CI)}</li>
<li>The lab’s tsconfig only extends the course one:
${ma('json', CODE.labTsconfig)}</li>
<li>Your starting point — the teammate’s <code>string</code> / <code>any</code> version:
${ma('typescript', STARTER_TOP)}</li>
</ol>
<p>You edit only <code>lab7/src/events.ts</code>. The course’s <code>schedule.ts</code> (for <code>LabCode</code>) and the other rules are given.</p>

<h3>Zero errors — and why that proves nothing</h3>
${ra(OUT['l2-starter-tsc'])}
<p>Strict mode, no errors — because <code>string</code> event names accept any string and <code>any</code> payloads accept any value. The bus “works for every event” by checking none. A model built on <code>string</code>/<code>any</code> refuses nothing.</p>

<h3>The grader — the starter scores 5</h3>
${ra(OUT['l3-starter'])}
<p><strong>5 out of 10.</strong> A, B and D pass (the loose types compile, and the runtime happens to work), but C fails (<code>any</code>) and E is 0/8 — every wrong use slips through. The point of the lab is E: make the event names and payloads a closed, checked set.</p>

<h3>Your task</h3>
<p>Edit <strong>only</strong> <code>lab7/src/events.ts</code> until <code>npm run lab7</code> prints <strong>Score: 10/10</strong>: <code>BookingEvent</code> as a template literal over <code>BookingAction</code>; an <code>EventPayloads</code> map and <code>EventName = keyof EventPayloads</code>; <code>PayloadOf&lt;E&gt;</code> with a conditional type; a generic <code>on</code>/<code>emit</code> whose handler payload is <code>EventPayloads[K]</code>; and the two mapped types <code>Frozen</code> and <code>Patch</code>. No <code>any</code>, <code>as</code> (except <code>as const</code>), <code>!</code> or <code>@ts-</code>.</p>

<h3>The eight wrong uses</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_EN}
<p>Every one compiles against the <code>string</code>/<code>any</code> starter; your advanced types must refuse each with the code shown.</p>

<h3>What first attempts usually look like</h3>
<p><strong>Attempt A — typed names and payloads, but a non-generic bus and <code>Frozen</code> that does nothing</strong> (<code>lab7/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Trap — if <code>on</code>/<code>emit</code> are not generic, the payload is <code>unknown</code> and nobody can read it.</strong> 7.5/10. The event names are typed (S1, S4, S5 refused), but <code>on(name: EventName, handler: (p: unknown) =&gt; void)</code> drops the correlation between the name and its payload: B fails (a handler cannot read <code>p.id</code>), S2 slips (any payload is accepted), and S3 gives the wrong code. And <code>Frozen&lt;T&gt; = T</code> does nothing, so S6 is not refused. The whole value is the per-event generic.</p>
</div>
<p><strong>Attempt B — everything typed, but <code>Patch</code> is a loose index signature</strong> (<code>lab7/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9.5/10 — the bus, the template literal names, <code>PayloadOf</code> and <code>Frozen</code> are all right, so seven of the eight wrong uses are refused. But <code>Patch&lt;T&gt; = { [key: string]: unknown }</code> is an open index signature, so a misspelled key (S7) is accepted. Make it a mapped type <code>{ [K in keyof T]?: T[K] }</code> (7.2) and the last point comes back.</p>

<h3>Rubric (10 points, pass mark 7)</h3>
${RUBRIC_EN}

<h3>Hints — open one at a time</h3>
<ol>
<li><code>type BookingAction = 'created' | 'confirmed' | 'cancelled'</code>; <code>type BookingEvent = &#96;booking:&#36;{BookingAction}&#96;</code>.</li>
<li><code>EventPayloads</code> maps each event name to its data; <code>EventName = keyof EventPayloads</code>.</li>
<li><code>PayloadOf&lt;E extends EventName&gt; = EventPayloads extends Record&lt;E, infer P&gt; ? P : never</code> (or simply <code>EventPayloads[E]</code>).</li>
<li>A mapped <code>HandlerMap = { [K in EventName]: Array&lt;(p: EventPayloads[K]) =&gt; void&gt; }</code>, initialised with <code>[]</code> for every event; <code>on&lt;K extends EventName&gt;(name: K, handler: (p: EventPayloads[K]) =&gt; void)</code>.</li>
<li><code>Frozen&lt;T&gt; = { readonly [K in keyof T]: T[K] }</code>; <code>Patch&lt;T&gt; = { [K in keyof T]?: T[K] }</code>.</li>
</ol>

<h3>Reference solution (read after trying)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Ten out of ten. Three things to notice:</p>
<ul>
<li><strong>The whole chapter in one file.</strong> Template literal names, a mapped payload map, a conditional <code>PayloadOf</code>, and two mapped types — each pulling its weight.</li>
<li><strong>The handler map is initialised for every event.</strong> That is what lets the generic <code>on</code> push into <code>handlers[name]</code> with no cast — add an event to <code>EventPayloads</code> and the initialiser forces you to add it here too.</li>
<li><strong>The names are a closed set.</strong> <code>emit('booking:…')</code> autocompletes, and a typo is TS2345 — the safety a <code>string</code> never gives.</li>
</ul>

<h3>Before you call it done</h3>
<ul>
<li><code>npm run lab7</code> prints <strong>Score: 10/10</strong>.</li>
<li>No <code>any</code>, no <code>as</code>, no <code>!</code>; event names are a template literal type.</li>
<li>You can say which advanced type refuses each of S1–S8.</li>
<li>Commit: <code>feat(events): a typed event system (lab 7: 10/10)</code>.</li>
</ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">typed event bus</span><span class="v"><code>on</code>/<code>emit</code> where the payload is typed by the event name.</span></div>
  <div class="kv"><span class="k">payload map</span><span class="v"><code>EventPayloads</code> — event name → its data (7.1).</span></div>
  <div class="kv"><span class="k">PayloadOf</span><span class="v">A conditional type that looks a payload up by name (7.3).</span></div>
  <div class="kv"><span class="k">template literal names</span><span class="v"><code>&#96;booking:&#36;{Action}&#96;</code> — a closed, checked set (7.4).</span></div>
  <div class="kv"><span class="k">Frozen / Patch</span><span class="v">The readonly and optional mapped types (7.1, 7.2).</span></div>
</div>

<h3>🗺 How the grader scores you</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Compile</div><div class="lz-d">strict tsc, then the correct uses (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Scan</div><div class="lz-d">no any, as, ! or @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Run</div><div class="lz-d">node --test, the right payload per event (D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Attack</div><div class="lz-d">8 wrong uses, each with its code (E)</div></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A <code>string</code>/<code>any</code> event system compiles with zero errors and refuses nothing (5/10).</li>
<li>Typed names but a non-generic bus loses the payload correlation — 7.5, failing B and letting a wrong payload through.</li>
<li>Everything typed but a loose <code>Patch</code> index signature scores 9.5 — a misspelled key still slips.</li>
<li>The reference: template literal names, a payload map, a conditional <code>PayloadOf</code>, a per-event generic bus, and two mapped types — no casts.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Template Literal, Mapped & Conditional Types', 'The three features this lab combines. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html')}
${nguon('📘', 'TypeScript Handbook — Utility Types', 'Readonly, Partial and the rest, the mapped types the lab writes out. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Lab 7</span>
<h2>Hệ sự kiện có kiểu</h2>
<p class="lead">60–90 phút. LabFlow phát sự kiện — một lượt đặt được tạo, xác nhận, huỷ — và mọi phần của ứng dụng đăng ký nghe. Bản của đồng đội dùng tên <code>string</code> và payload <code>any</code>: nó biên dịch với <strong>không lỗi nào</strong>, và một lỗi gõ tên sự kiện hay một payload sai lên sản phẩm âm thầm. Máy chấm cho <strong>5 trên 10</strong>. Bạn dựng lại bằng các kiểu nâng cao của chương — tên sự kiện template literal, một bản đồ payload, một phép tra conditional, <code>on</code>/<code>emit</code> theo từng sự kiện, và hai mapped type — tới khi máy chấm báo 10/10. Đây là tệp mọi module sẽ import để phát và nghe.</p>

<h3>Lab này rèn gì</h3>
<ul>
<li><strong>7.1</strong> — bản đồ payload và mapped type <code>Frozen</code>.</li>
<li><strong>7.2</strong> — mapped type <code>Patch</code> (trường optional).</li>
<li><strong>7.3</strong> — <code>PayloadOf&lt;E&gt;</code>, một conditional type tra payload theo tên.</li>
<li><strong>7.4</strong> — <code>BookingEvent</code>, tên sự kiện template literal, nên lỗi gõ là lỗi biên dịch.</li>
</ul>

<h3>Chuẩn bị</h3>
<ol>
<li>Dùng <code>labflow-ts</code> ở cuối Chương 7 và cài đúng các bản đã ghim:
${ra(NPM_CI)}</li>
<li>tsconfig của lab chỉ kế thừa tsconfig của khoá:
${ma('json', CODE.labTsconfig)}</li>
<li>Điểm xuất phát — bản <code>string</code> / <code>any</code> của đồng đội:
${ma('typescript', STARTER_TOP)}</li>
</ol>
<p>Bạn chỉ sửa <code>lab7/src/events.ts</code>. Tệp <code>schedule.ts</code> (cho <code>LabCode</code>) và các rule khác của khoá là cho sẵn.</p>

<h3>Không lỗi nào — và vì sao điều đó chẳng chứng minh gì</h3>
${ra(OUT['l2-starter-tsc'])}
<p>Strict, không lỗi — vì tên sự kiện <code>string</code> nhận chuỗi gì cũng được và payload <code>any</code> nhận giá trị gì cũng được. Bus “chạy cho mọi sự kiện” bằng cách không kiểm cái nào. Một mô hình dựng trên <code>string</code>/<code>any</code> chẳng từ chối gì.</p>

<h3>Máy chấm — bản khởi đầu được 5</h3>
${ra(OUT['l3-starter'])}
<p><strong>5 trên 10.</strong> A, B, D qua (kiểu lỏng biên dịch được, và lúc chạy tình cờ đúng), nhưng C trượt (<code>any</code>) và E là 0/8 — mọi cách dùng sai lọt. Mấu chốt của lab là E: làm tên sự kiện và payload thành một tập đóng, được kiểm.</p>

<h3>Nhiệm vụ</h3>
<p><strong>Chỉ</strong> sửa <code>lab7/src/events.ts</code> tới khi <code>npm run lab7</code> in <strong>Score: 10/10</strong>: <code>BookingEvent</code> là template literal trên <code>BookingAction</code>; một bản đồ <code>EventPayloads</code> và <code>EventName = keyof EventPayloads</code>; <code>PayloadOf&lt;E&gt;</code> với một conditional type; một <code>on</code>/<code>emit</code> generic mà payload của handler là <code>EventPayloads[K]</code>; và hai mapped type <code>Frozen</code> và <code>Patch</code>. Không <code>any</code>, <code>as</code> (trừ <code>as const</code>), <code>!</code> hay <code>@ts-</code>.</p>

<h3>Tám cách dùng sai</h3>
${ma('typescript', noc(CODE.sai))}
${BANG_VI}
<p>Mỗi cái đều biên dịch với bản khởi đầu <code>string</code>/<code>any</code>; kiểu nâng cao của bạn phải từ chối từng cái với mã đã ghi.</p>

<h3>Những lần thử đầu tiên thường trông thế nào</h3>
<p><strong>Lần thử A — tên và payload có kiểu, nhưng bus không generic và <code>Frozen</code> chẳng làm gì</strong> (<code>lab7/yeu/</code>):</p>
${ra(OUT['l4-yeu'])}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — nếu <code>on</code>/<code>emit</code> không generic, payload là <code>unknown</code> và không ai đọc được.</strong> 7.5/10. Tên sự kiện có kiểu (S1, S4, S5 bị từ chối), nhưng <code>on(name: EventName, handler: (p: unknown) =&gt; void)</code> đánh rơi mối liên hệ giữa tên và payload của nó: B trượt (một handler không đọc được <code>p.id</code>), S2 lọt (payload nào cũng nhận), và S3 báo sai mã. Và <code>Frozen&lt;T&gt; = T</code> chẳng làm gì, nên S6 không bị từ chối. Toàn bộ giá trị nằm ở generic theo từng sự kiện.</p>
</div>
<p><strong>Lần thử B — đủ kiểu, nhưng <code>Patch</code> là một index signature lỏng</strong> (<code>lab7/vua/</code>):</p>
${ra(OUT['l5-vua'])}
<p>9.5/10 — bus, tên template literal, <code>PayloadOf</code> và <code>Frozen</code> đều đúng, nên bảy trong tám cách dùng sai bị từ chối. Nhưng <code>Patch&lt;T&gt; = { [key: string]: unknown }</code> là một index signature mở, nên một khoá gõ sai (S7) được nhận. Làm nó một mapped type <code>{ [K in keyof T]?: T[K] }</code> (7.2) thì điểm cuối trở lại.</p>

<h3>Thang chấm (10 điểm, đạt 7)</h3>
${RUBRIC_VI}

<h3>Gợi ý — mở từng cái một</h3>
<ol>
<li><code>type BookingAction = 'created' | 'confirmed' | 'cancelled'</code>; <code>type BookingEvent = &#96;booking:&#36;{BookingAction}&#96;</code>.</li>
<li><code>EventPayloads</code> ánh xạ mỗi tên sự kiện sang dữ liệu của nó; <code>EventName = keyof EventPayloads</code>.</li>
<li><code>PayloadOf&lt;E extends EventName&gt; = EventPayloads extends Record&lt;E, infer P&gt; ? P : never</code> (hoặc đơn giản <code>EventPayloads[E]</code>).</li>
<li>Một mapped <code>HandlerMap = { [K in EventName]: Array&lt;(p: EventPayloads[K]) =&gt; void&gt; }</code>, khởi tạo <code>[]</code> cho mọi sự kiện; <code>on&lt;K extends EventName&gt;(name: K, handler: (p: EventPayloads[K]) =&gt; void)</code>.</li>
<li><code>Frozen&lt;T&gt; = { readonly [K in keyof T]: T[K] }</code>; <code>Patch&lt;T&gt; = { [K in keyof T]?: T[K] }</code>.</li>
</ol>

<h3>Lời giải tham khảo (đọc sau khi đã thử)</h3>
${ma('typescript', CODE.ref)}
${ra(OUT['l6-ref'])}
<p>Mười trên mười. Ba điều đáng để ý:</p>
<ul>
<li><strong>Cả chương trong một tệp.</strong> Tên template literal, bản đồ payload ánh xạ, một <code>PayloadOf</code> conditional, và hai mapped type — mỗi cái gánh phần của nó.</li>
<li><strong>Bản đồ handler được khởi tạo cho mọi sự kiện.</strong> Đó là thứ cho <code>on</code> generic push vào <code>handlers[name]</code> mà không cast — thêm một sự kiện vào <code>EventPayloads</code> thì bộ khởi tạo bắt bạn thêm vào đây.</li>
<li><strong>Tên là một tập đóng.</strong> <code>emit('booking:…')</code> tự gợi ý, và một lỗi gõ là TS2345 — sự an toàn mà một <code>string</code> không bao giờ cho.</li>
</ul>

<h3>Trước khi coi là xong</h3>
<ul>
<li><code>npm run lab7</code> in <strong>Score: 10/10</strong>.</li>
<li>Không <code>any</code>, không <code>as</code>, không <code>!</code>; tên sự kiện là một template literal type.</li>
<li>Bạn nói được kiểu nâng cao nào từ chối từng cái S1–S8.</li>
<li>Commit: <code>feat(events): a typed event system (lab 7: 10/10)</code>.</li>
</ul>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">typed event bus</span><span class="v"><code>on</code>/<code>emit</code> nơi payload có kiểu theo tên sự kiện.</span></div>
  <div class="kv"><span class="k">payload map</span><span class="v"><code>EventPayloads</code> — tên sự kiện → dữ liệu của nó (7.1).</span></div>
  <div class="kv"><span class="k">PayloadOf</span><span class="v">Một conditional type tra payload theo tên (7.3).</span></div>
  <div class="kv"><span class="k">tên template literal</span><span class="v"><code>&#96;booking:&#36;{Action}&#96;</code> — một tập đóng, được kiểm (7.4).</span></div>
  <div class="kv"><span class="k">Frozen / Patch</span><span class="v">Mapped type readonly và optional (7.1, 7.2).</span></div>
</div>

<h3>🗺 Máy chấm cho điểm thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Biên dịch</div><div class="lz-d">tsc strict, rồi các cách dùng đúng (A, B)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Quét</div><div class="lz-d">không any, as, ! hay @ts- (C)</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Chạy</div><div class="lz-d">node --test, đúng payload mỗi sự kiện (D)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Tấn công</div><div class="lz-d">8 cách dùng sai, mỗi cái một mã (E)</div></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một hệ sự kiện <code>string</code>/<code>any</code> biên dịch 0 lỗi mà chẳng từ chối gì (5/10).</li>
<li>Tên có kiểu nhưng bus không generic làm mất liên hệ payload — 7.5, trượt B và để một payload sai lọt.</li>
<li>Đủ kiểu nhưng một <code>Patch</code> index signature lỏng được 9.5 — một khoá gõ sai vẫn lọt.</li>
<li>Lời giải: tên template literal, bản đồ payload, một <code>PayloadOf</code> conditional, một bus generic theo sự kiện, và hai mapped type — không cast.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Template Literal, Mapped & Conditional Types', 'Ba tính năng lab này gộp lại. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html')}
${nguon('📘', 'TypeScript Handbook — Utility Types', 'Readonly, Partial và phần còn lại, các mapped type lab viết ra. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/utility-types.html')}
</div>
`,
};
