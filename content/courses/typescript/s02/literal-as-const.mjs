/**
 * TypeScript · Chương 2 · 2.4 — Kiểu literal & as const. Slug giữ: typescript-2-4-literal-as-const.
 * Soạn lại TRỌN 01/11/2026 (Chương 2, sau đợt mẫu e335e39fd): giữ ý của bản cũ (literal = một giá trị, as const khoá cả giá trị, suy union
 * từ một nguồn), bỏ ví dụ "mode/config", chạy thật trên LabFlow TS (Node 22.23.3, tsc 7.0.2) — danh sách phòng LABS dùng ở Lab 2.
 * Mọi mã/output lấy từ ./_ma-ts-02-4.mjs (SINH TỰ ĐỘNG từ demo2/ts-02-4 — đừng sửa tay).
 */
import G from '../giang/ts-02-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-02-4.mjs';

const L = (s) => s.split('\n');
const LABS_DTS = L(OUT['03-derive-dts']);
const DTS_STRICT = [LABS_DTS[0], LABS_DTS[1], LABS_DTS[2]].join('\n');
const DTS_LOOSE = [LABS_DTS[0], LABS_DTS[5], LABS_DTS[6]].join('\n');
const INCL_RED_1 = L(OUT['04-includes-red']).slice(0, 2).join('\n');
const INCL_RED_2 = [L(OUT['04-includes-red'])[0]].concat(L(OUT['04-includes-red']).slice(2, 4)).join('\n');
const INCL_RED_CODE = L(CODE.inclRed).slice(0, 6).join('\n');
const INCL_RED_QUERY = L(CODE.inclRed).slice(7, 9).join('\n');
const ENUM_TSC = L(OUT['08-enum-tsc']);
const ENUM_TSC_1 = [ENUM_TSC[0], ENUM_TSC[1]].join('\n');
const ENUM_TSC_2 = [ENUM_TSC[0], ENUM_TSC[2]].join('\n');

const BANG_EN = `<table>
<thead><tr><th>You need…</th><th>Write</th><th>Exists at runtime?</th><th>LabFlow example</th></tr></thead>
<tbody>
<tr><td>a small closed set that code only <em>compares</em> against</td><td>literal union by hand: <code>'PENDING' | 'CONFIRMED'</code></td><td>no — type only</td><td><code>Booking['status']</code></td></tr>
<tr><td>a closed set you must also <em>loop over or check at runtime</em> (a query string, a select box)</td><td><code>const LABS = [...] as const</code> + <code>(typeof LABS)[number]</code></td><td>yes — an array</td><td>lab codes, grid steps</td></tr>
<tr><td>one value (text, number) per member of a set</td><td>object <code>as const satisfies Record&lt;K, V&gt;</code> + <code>keyof typeof</code></td><td>yes — an object</td><td><code>SLOT_MESSAGES</code></td></tr>
<tr><td>names for values, C#/Java style</td><td><code>as const</code> object, not <code>enum</code></td><td>yes — an object</td><td><code>STATUS.Pending</code></td></tr>
<tr><td>an open set (any lab name a user may type)</td><td>plain <code>string</code>, then a guard</td><td>—</td><td>the raw <code>?lab=</code> text</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Bạn cần…</th><th>Viết</th><th>Có tồn tại lúc chạy?</th><th>Ví dụ LabFlow</th></tr></thead>
<tbody>
<tr><td>một tập đóng nhỏ mà code chỉ <em>so sánh</em> với nó</td><td>union literal viết tay: <code>'PENDING' | 'CONFIRMED'</code></td><td>không — chỉ là kiểu</td><td><code>Booking['status']</code></td></tr>
<tr><td>một tập đóng mà bạn còn phải <em>lặp qua hoặc kiểm lúc chạy</em> (query string, ô chọn)</td><td><code>const LABS = [...] as const</code> + <code>(typeof LABS)[number]</code></td><td>có — một mảng</td><td>mã phòng, bước lưới giờ</td></tr>
<tr><td>một giá trị (chữ, số) cho mỗi phần tử của tập</td><td>object <code>as const satisfies Record&lt;K, V&gt;</code> + <code>keyof typeof</code></td><td>có — một object</td><td><code>SLOT_MESSAGES</code></td></tr>
<tr><td>tên gọi cho các giá trị, kiểu C#/Java</td><td>object <code>as const</code>, không dùng <code>enum</code></td><td>có — một object</td><td><code>STATUS.Pending</code></td></tr>
<tr><td>một tập mở (tên phòng bất kỳ người dùng gõ)</td><td><code>string</code> thường, rồi một guard</td><td>—</td><td>chữ <code>?lab=</code> thô</td></tr>
</tbody>
</table>`;

const DOC_EN = `<table>
<thead><tr><th>Piece</th><th>Read it as</th><th>Result here</th></tr></thead>
<tbody>
<tr><td><code>as const</code></td><td>“keep every element as its exact literal, and make the array read-only”</td><td><code>readonly ['BE-201', 'BE-202', 'AL-301']</code></td></tr>
<tr><td><code>typeof LABS</code></td><td>“the <em>type</em> of the <em>value</em> LABS” (a type query — this <code>typeof</code> lives in type positions)</td><td>that read-only tuple</td></tr>
<tr><td><code>[number]</code></td><td>“the type of an element at any number index” (indexed access)</td><td><code>"AL-301" | "BE-201" | "BE-202"</code></td></tr>
</tbody>
</table>`;
const DOC_VI = `<table>
<thead><tr><th>Mảnh</th><th>Đọc là</th><th>Kết quả ở đây</th></tr></thead>
<tbody>
<tr><td><code>as const</code></td><td>“giữ mỗi phần tử đúng kiểu literal của nó, và biến mảng thành chỉ đọc”</td><td><code>readonly ['BE-201', 'BE-202', 'AL-301']</code></td></tr>
<tr><td><code>typeof LABS</code></td><td>“<em>kiểu</em> của <em>giá trị</em> LABS” (type query — <code>typeof</code> này đứng ở vị trí kiểu)</td><td>tuple chỉ đọc kia</td></tr>
<tr><td><code>[number]</code></td><td>“kiểu của phần tử ở một chỉ số số bất kỳ” (indexed access — truy cập theo chỉ số)</td><td><code>"AL-301" | "BE-201" | "BE-202"</code></td></tr>
</tbody>
</table>`;

export default {
  title: '2.4 — Literal types & as const|||2.4 — Kiểu literal & as const',
  slug: 'typescript-2-4-literal-as-const',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Kiểu literal (một giá trị, hay một danh sách giá trị đóng) và as const để có MỘT nguồn sự thật: danh sách phòng LABS vừa là dữ liệu lúc chạy vừa sinh ra kiểu LabCode = (typeof LABS)[number]. Đo thật: danh sách chép tay lệch kiểu mà tsc im lặng (AL-301 bị từ chối), bẫy LABS.includes(text) TS2345 và cách sửa không dùng as, guard kiểm ?lab= lúc chạy, object map SLOT_MESSAGES (keyof typeof, TS2741, TS2540), vì sao khoá dùng object as const thay enum (TS1294), bẫy readonly gặp string[] (TS4104).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Literal types &amp; as const</h2>
<p class="lead">A literal type is a type with exactly one value: not “a string”, but the string <code>'BE-201'</code>. A union of them lists the only values allowed. This lesson shows how to keep such a list in <strong>one place</strong> — a real array that Node can loop over at runtime, from which TypeScript derives the type — so the list and the type can never drift apart. Every result below is a real run on LabFlow TS.</p>

<h3>What you will be able to do, and why it matters</h3>
<ul>
<li>Write literal types by hand (<code>15 | 30 | 60</code>, <code>ok: true</code>) and read the errors they produce.</li>
<li>Turn a list of allowed values into <strong>both</strong> runtime data and a type with <code>as const</code> and <code>(typeof LABS)[number]</code>.</li>
<li>Check a value from outside (a query string <code>?lab=BE-999</code>) against that list — and get past the <code>includes</code> error everybody hits once.</li>
<li>Build a lookup table (<code>SLOT_MESSAGES</code>) that tsc forces to stay complete.</li>
<li>Explain why this course uses <code>as const</code> objects instead of <code>enum</code>.</li>
</ul>
<p>Why it matters: every real app is full of closed sets — roles, statuses, lab codes, payment states. When the list exists twice (a type in one file, an array in a validator, a copy in the seed script), one of them goes stale. This website lost a production seed that way on 08/08/2026 (lesson 0.9). In Lab 2 you will use exactly the <code>LABS</code> list of this lesson, and “enum or union?” is a favourite interview question for TypeScript jobs.</p>

<h3>A type that is exactly one value</h3>
<p>Lesson 1.3 showed that <code>const b = 'CuongThai'</code> gets the literal type <code>"CuongThai"</code>. You can also write literal types yourself, for strings, numbers and booleans:</p>
${ma('typescript', CODE.step)}
${ra(OUT['01-literal'])}
<p>Line 5: 45 is a perfectly good <code>number</code>, but <code>Step</code> allows only 15, 30 or 60. Line 9: <code>false</code> is not the literal <code>true</code>. You already rely on this second kind: in Lab 1, <code>SlotResult</code> says <code>{ ok: true; minutes: number } | { ok: false; code: SlotCode }</code>, and it is the literal <code>true</code> that lets tsc know <code>minutes</code> exists after <code>if (!slot.ok) throw …</code>. Chapter 5 is built on that idea.</p>

<h3>The bug: a list copied by hand</h3>
<p>Writing <code>type LabCode = 'BE-201' | 'BE-202' | 'AL-301'</code> is fine — until the same list is also needed <em>at runtime</em>. Types are erased (lesson 0.4), so a validator cannot loop over a type; somebody writes the list again as an array. Here is LabFlow one semester later: AL-301 opened, the type was updated, the validator was not:</p>
${ma('typescript', CODE.copyTypes)}
${ma('typescript', CODE.copyCheck)}
${ma('typescript', CODE.copyRun)}
${ra(OUT['02-copy'])}
<p>tsc is silent (exit 0) and a real lab is refused. Nothing is <em>inconsistent</em> from the compiler’s point of view: the array is typed <code>readonly string[]</code>, any string may be in it, so it cannot know that the array is meant to mirror <code>LabCode</code>. A copy is only ever checked against itself — the same reason the 08/08 seed broke while every check was green.</p>

<h3>One source of truth: as const + (typeof LABS)[number]</h3>
<p>Turn it around: write the list once, as data, and <em>derive</em> the type from it.</p>
${ma('typescript', CODE.labs)}
${DOC_EN}
<p>Ask tsc what it inferred (emit only the declaration file, the trick from lesson 1.3):</p>
${ra(DTS_STRICT)}
<p>With <code>as const</code> the array keeps its three exact strings. Without it, the same array is just <code>string[]</code>:</p>
${ra(DTS_LOOSE)}
<p>A <code>.d.ts</code> prints the alias, not what it expands to. To see the expansion, assign a wrong value — the error message names the real type:</p>
${ma('typescript', CODE.show)}
${ra(OUT['03b-derive-show'])}
<p>With <code>as const</code>, the derived type is the three codes. Without it, it is <code>string</code> — no protection at all. (tsc 7 prints the members of a union in its own order; <code>"AL-301"</code> first is not a mistake.)</p>
<p>Now adding a lab is a one-line change, and the type and the runtime check both follow it:</p>
${ma('typescript', CODE.grow)}
${ra(OUT['12-grow'])}

<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>LABS.includes(text)</code> does not compile.</strong> The natural way to check a query string:</p>
${ma('typescript', INCL_RED_CODE)}
${ra(INCL_RED_1)}
<p>It looks like tsc is being silly — checking whether a string is in the list is exactly the point. But <code>LABS</code> is now <code>readonly ['BE-201', 'BE-202', 'AL-301']</code>, so its <code>includes</code> method takes a <code>LabCode</code>, and <code>text</code> is any <code>string</code>. Do not fix it with <code>any</code> or by removing <code>as const</code> (that throws the type away). Two honest fixes, both measured:</p>
${ma('typescript', CODE.incl)}
${ma('typescript', CODE.inclAs)}
<p>The first one needs no <code>as</code> at all: a list of <code>LabCode</code> <em>is</em> a list of strings, so assigning it to a <code>readonly string[]</code> is a safe widening that tsc checks. The second writes the same widening with <code>as</code>; it compiles, but <code>as</code> can also lie (lesson 1.2), so prefer the assignment — Lab 2 forbids <code>as</code> for that reason.</p>
</div>

<h3>Checking a value from outside: a guard</h3>
<p>The second error of the red file is the other half of the story. A query string is text, and <code>get</code> may return <code>null</code> (lesson 2.1):</p>
${ma('typescript', INCL_RED_QUERY)}
${ra(INCL_RED_2)}
<p>You cannot just declare that the user typed a valid code. You check it. <code>isLab</code> above has the return type <code>text is LabCode</code> — a <strong>type guard</strong> (you met one in lesson 1.2; Chapter 5 explains them fully). When it returns <code>true</code>, tsc treats <code>text</code> as a <code>LabCode</code> inside that branch:</p>
${ma('typescript', CODE.inclRun)}
${ra(OUT['05-includes'])}
<p>Lower-case <code>be-201</code>, an unknown <code>BE-999</code> and an empty query are refused at runtime; a valid code passes and becomes a <code>LabCode</code> without any <code>as</code>.</p>
<p>Why is the guard needed at all, if <code>LABS</code> is “constant”? Because <code>as const</code> exists only for tsc:</p>
${ma('typescript', CODE.frozen)}
${ra(OUT['15-frozen'])}
<p>At runtime it is an ordinary, not even frozen, array. The protection comes from two layers: tsc stops <em>your code</em> from pushing to it or using an unknown code; the guard stops <em>outside data</em>. (Freezing at runtime with <code>Object.freeze</code> is lesson 2.2.)</p>

<h3>Object maps: one value per code</h3>
<p>The same trick works for objects. LabFlow needs one message per <code>SlotCode</code>:</p>
${ma('typescript', CODE.messages)}
<p><code>as const</code> keeps each text as a literal and makes every property <code>readonly</code>; <code>satisfies Record&lt;SlotCode, string&gt;</code> (lesson 1.3; <code>Record</code> = “an object with exactly these keys”, Chapter 8) checks that every code has a message. <code>keyof typeof SLOT_MESSAGES</code> reads as “the keys of the type of the value” — a union of the four codes. The declaration tsc emits:</p>
${ra(OUT['06b-map-dts'])}
${ma('typescript', CODE.mapRun)}
${ra(OUT['06-map'])}
<p>Note <code>as const</code> on <code>CASES</code> too: each pair stays a two-element tuple, so <code>start</code> and <code>end</code> are strings, not <code>string | undefined</code> (tuples are lesson 2.2). Now forget a message, or try to change one:</p>
${ma('typescript', CODE.mapRed)}
${ra(OUT['07-map-red'])}
<p>TS2741 names the missing key, TS2540 refuses the assignment. When Chapter 5 adds a new slot code, this table turns red until someone writes its message — the exact opposite of the hand-copied list.</p>

<h3>Why not enum?</h3>
<p>Coming from Java or C#, you would write an <code>enum</code>. Lesson 0.4 showed why this course does not: an enum is not just a type, it generates JavaScript, so Node’s type stripping cannot run it, and the course tsconfig turns on <code>erasableSyntaxOnly</code>:</p>
${ma('typescript', CODE.enumTs)}
${ra(ENUM_TSC_1)}
<p>An <code>as const</code> object gives you the same things — names (<code>STATUS.Pending</code>), a list of values at runtime, a type — with plain JavaScript:</p>
${ma('typescript', CODE.status)}
${ra(OUT['09-enum-run'])}
${ma('typescript', CODE.enumRed)}
${ra(ENUM_TSC_2)}
<p>And unlike a string enum, a <code>Status</code> parameter accepts the plain string <code>'CONFIRMED'</code> — which is what arrives from JSON and from the database.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>as const</code> meets an old <code>string[]</code> parameter.</strong> <code>as const</code> also means <em>read-only</em>. A helper that only reads its list but declares <code>string[]</code> refuses it:</p>
${ma('typescript', CODE.print)}
${ra(OUT['10-readonly'])}
<p>tsc is right: a <code>string[]</code> parameter is allowed to <code>push</code>, and <code>LABS</code> promised nobody would. Do not remove <code>as const</code>; fix the helper’s promise. A <code>readonly string[]</code> parameter accepts both kinds of array:</p>
${ma('typescript', CODE.printFixed)}
${ra(OUT['11-readonly-fixed'])}
</div>

<h3>When to use what</h3>
${BANG_EN}

<h3>🗺 One list, two worlds</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Write once</div><div class="lz-d">const LABS = [...] as const</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Derive the type</div><div class="lz-d">type LabCode = (typeof LABS)[number]</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">tsc checks your code</div><div class="lz-d">'BE-999' in code ⇒ TS2322</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">The guard checks outside data</div><div class="lz-d">?lab=BE-999 ⇒ 400 at runtime</div></div>
</div>

<h3>💼 Interview corner</h3>
<p><strong>“Enum or union of string literals?”</strong> A good answer in three sentences: a union of literals is erased, costs nothing at runtime and accepts the plain strings that arrive from JSON; an <code>enum</code> generates code (Node’s type stripping and <code>erasableSyntaxOnly</code> refuse it) and a string enum does not accept the plain string. When I also need the list at runtime, I write it once <code>as const</code> and derive the union with <code>(typeof X)[number]</code>, so the data and the type cannot drift. Bonus: mention a real drift you have seen — such as a hand-copied union that broke a seed script.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>The booking form sends <code>?step=30</code> — the minutes per grid cell. LabFlow supports 15, 30 and 60. A teammate wrote this (<code>demo2/ts-02-4/practice/start/step.ts</code>):</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<ol>
<li>Read the error: why is <code>n</code> still a <code>number</code> after <code>STEPS.includes(n)</code>?</li>
<li>Make <code>STEPS</code> the single source of truth and derive <code>Step</code> from it.</li>
<li>Write a guard <code>isStep(n: number): n is Step</code> without <code>as</code> or <code>any</code>, and use it.</li>
<li>Check <code>?step=30</code>, <code>?step=45</code>, <code>?step=abc</code>.</li>
</ol>
<p><strong>Solution and real output.</strong> Step 1: <code>includes</code> returns a plain <code>boolean</code>; it says nothing about the <em>type</em> of <code>n</code>, and the hand-copied <code>number[]</code> is not even connected to <code>Step</code>. Steps 2–4:</p>
${ma('typescript', CODE.prSol)}
${ma('typescript', CODE.prRun)}
${ra(OUT['14-pr-sol'])}
<p><strong>Done when:</strong> tsc prints nothing, <code>Step</code> appears in exactly one place as a list (<code>STEPS</code>), there is no <code>as</code> except <code>as const</code>, and only 30 is accepted. Code Lab has four more exercises for this lesson (derive <code>LabCode</code>, the <code>isLab</code> guard, a complete message map, replacing an <code>enum</code>).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">literal type</span><span class="v">A type with exactly one value: <code>'BE-201'</code>, <code>30</code>, <code>true</code>.</span></div>
  <div class="kv"><span class="k">as const</span><span class="v">“Keep every value literal and make it read-only.” Compile-time only — the array is ordinary at runtime.</span></div>
  <div class="kv"><span class="k">typeof (in a type)</span><span class="v">A type query: the type of a value. <code>typeof LABS</code>.</span></div>
  <div class="kv"><span class="k">indexed access type</span><span class="v"><code>T[K]</code>: the type found at key or index K. <code>[number]</code> = any element.</span></div>
  <div class="kv"><span class="k">keyof</span><span class="v">The union of the keys of an object type.</span></div>
  <div class="kv"><span class="k">single source of truth</span><span class="v">A fact written in one place; everything else is derived from it, so it cannot drift.</span></div>
  <div class="kv"><span class="k">type guard</span><span class="v">A function returning <code>x is T</code>: a runtime check tsc trusts to narrow the type.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Literal types allow exactly the listed values: <code>45</code> is refused by <code>15 | 30 | 60</code> (TS2322).</li>
<li>A list copied by hand compiles and goes stale: tsc was silent while AL-301 was refused at runtime.</li>
<li>Write the list once with <code>as const</code>, derive the type with <code>(typeof LABS)[number]</code>; without <code>as const</code> the derived type is just <code>string</code>.</li>
<li><code>LABS.includes(text)</code> with <code>text: string</code> is TS2345; widen by assignment to <code>readonly string[]</code> inside a guard <code>text is LabCode</code>.</li>
<li><code>as const</code> objects + <code>satisfies Record&lt;…&gt;</code> give complete, read-only lookup tables (TS2741, TS2540) and replace <code>enum</code> (TS1294 under this course’s tsconfig).</li>
<li>Parameters that only read should be <code>readonly T[]</code>, or <code>as const</code> data is refused (TS4104).</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Indexed Access Types', 'T[K] and typeof MyArray[number]: the type of an element of an array value. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html')}
${nguon('📗', 'TypeScript Handbook — Typeof Type Operator', 'typeof in a type position refers to the type of a value. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/typeof-types.html')}
${nguon('📙', 'TypeScript Handbook — Enums (section “Objects vs Enums”)', 'An object with as const can replace an enum. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/enums.html')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-8-3-su-co-enum', title: 'The incident in the Prisma course — 8.3: The type that broke production', sub: 'Same: a list of allowed values copied by hand, checked only against itself, broke the seed on 08/08 while every check was green. Different: there the source of truth is the Prisma schema and the fix is importing the generated enum; here you build the same discipline in plain TypeScript with as const and (typeof X)[number].', cta: 'OPEN PRISMA LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Kiểu literal &amp; as const</h2>
<p class="lead">Kiểu literal là kiểu chỉ có đúng một giá trị: không phải “một chuỗi”, mà là chuỗi <code>'BE-201'</code>. Một union các kiểu literal liệt kê những giá trị duy nhất được phép. Bài này chỉ cách giữ danh sách đó ở <strong>một chỗ</strong> — một mảng thật mà Node lặp qua được lúc chạy, và TypeScript suy ra kiểu từ chính nó — để danh sách và kiểu không bao giờ lệch nhau. Mọi kết quả bên dưới là lần chạy thật trên LabFlow TS.</p>

<h3>Học xong bạn làm được gì, và vì sao có ích</h3>
<ul>
<li>Tự viết kiểu literal (<code>15 | 30 | 60</code>, <code>ok: true</code>) và đọc được lỗi chúng sinh ra.</li>
<li>Biến một danh sách giá trị được phép thành <strong>cả</strong> dữ liệu lúc chạy lẫn một kiểu, bằng <code>as const</code> và <code>(typeof LABS)[number]</code>.</li>
<li>Kiểm một giá trị từ bên ngoài (query string <code>?lab=BE-999</code>) với danh sách đó — và vượt qua lỗi <code>includes</code> mà ai cũng vấp một lần.</li>
<li>Dựng một bảng tra (<code>SLOT_MESSAGES</code>) mà tsc buộc phải luôn đầy đủ.</li>
<li>Giải thích vì sao khoá này dùng object <code>as const</code> thay cho <code>enum</code>.</li>
</ul>
<p>Vì sao quan trọng: app thật nào cũng đầy các tập đóng — vai trò, trạng thái, mã phòng, trạng thái thanh toán. Khi danh sách tồn tại hai lần (kiểu ở tệp này, mảng trong validator, một bản chép trong script seed), sẽ có một bản bị cũ. Chính website này đã vỡ seed production theo đúng cách đó ngày 08/08/2026 (bài 0.9). Ở Lab 2 bạn sẽ dùng đúng danh sách <code>LABS</code> của bài này, và “enum hay union?” là câu phỏng vấn rất hay gặp cho vị trí TypeScript.</p>

<h3>Một kiểu chỉ đúng một giá trị</h3>
<p>Bài 1.3 cho thấy <code>const b = 'CuongThai'</code> có kiểu literal <code>"CuongThai"</code>. Bạn cũng có thể tự viết kiểu literal, cho chuỗi, số và boolean:</p>
${ma('typescript', CODE.step)}
${ra(OUT['01-literal'])}
<p>Dòng 5: 45 là một <code>number</code> hoàn toàn hợp lệ, nhưng <code>Step</code> chỉ cho 15, 30 hoặc 60. Dòng 9: <code>false</code> không phải literal <code>true</code>. Loại thứ hai này bạn đã dựa vào rồi: ở Lab 1, <code>SlotResult</code> ghi <code>{ ok: true; minutes: number } | { ok: false; code: SlotCode }</code>, và chính literal <code>true</code> cho tsc biết <code>minutes</code> tồn tại sau <code>if (!slot.ok) throw …</code>. Chương 5 xây trên ý đó.</p>

<h3>Con bug: một danh sách chép tay</h3>
<p>Viết <code>type LabCode = 'BE-201' | 'BE-202' | 'AL-301'</code> thì ổn — cho tới khi danh sách đó còn cần <em>lúc chạy</em>. Kiểu bị xoá (bài 0.4), nên validator không lặp qua một kiểu được; thế là ai đó viết lại danh sách thành một mảng. Đây là LabFlow một học kỳ sau: phòng AL-301 mở, kiểu được cập nhật, validator thì không:</p>
${ma('typescript', CODE.copyTypes)}
${ma('typescript', CODE.copyCheck)}
${ma('typescript', CODE.copyRun)}
${ra(OUT['02-copy'])}
<p>tsc im lặng (exit 0) và một phòng có thật bị từ chối. Với trình biên dịch thì chẳng có gì <em>mâu thuẫn</em>: mảng có kiểu <code>readonly string[]</code>, chuỗi nào cũng có thể nằm trong đó, nên nó không thể biết mảng này được định làm bản sao của <code>LabCode</code>. Một bản chép tay chỉ bao giờ được kiểm với chính nó — đúng lý do seed ngày 08/08 vỡ trong khi mọi bước kiểm đều xanh.</p>

<h3>Một nguồn sự thật: as const + (typeof LABS)[number]</h3>
<p>Đảo ngược lại: viết danh sách một lần, dưới dạng dữ liệu, rồi <em>suy</em> kiểu từ nó.</p>
${ma('typescript', CODE.labs)}
${DOC_VI}
<p>Hỏi tsc nó suy ra gì (chỉ xuất tệp khai báo, mẹo của bài 1.3):</p>
${ra(DTS_STRICT)}
<p>Có <code>as const</code>, mảng giữ đúng ba chuỗi. Không có, cùng mảng đó chỉ là <code>string[]</code>:</p>
${ra(DTS_LOOSE)}
<p>Tệp <code>.d.ts</code> in tên bí danh, không in nó khai triển ra gì. Muốn thấy, hãy gán một giá trị sai — thông báo lỗi sẽ gọi tên kiểu thật:</p>
${ma('typescript', CODE.show)}
${ra(OUT['03b-derive-show'])}
<p>Có <code>as const</code>, kiểu suy ra là ba mã phòng. Không có, nó là <code>string</code> — chẳng bảo vệ gì. (tsc 7 in các phần tử của union theo thứ tự riêng của nó; <code>"AL-301"</code> đứng đầu không phải lỗi.)</p>
<p>Giờ thêm một phòng chỉ là sửa một dòng, và cả kiểu lẫn phép kiểm lúc chạy đều đi theo:</p>
${ma('typescript', CODE.grow)}
${ra(OUT['12-grow'])}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>LABS.includes(text)</code> không biên dịch.</strong> Cách tự nhiên để kiểm một query string:</p>
${ma('typescript', INCL_RED_CODE)}
${ra(INCL_RED_1)}
<p>Trông như tsc vô lý — kiểm xem một chuỗi có nằm trong danh sách hay không chính là mục đích. Nhưng giờ <code>LABS</code> là <code>readonly ['BE-201', 'BE-202', 'AL-301']</code>, nên phương thức <code>includes</code> của nó nhận một <code>LabCode</code>, còn <code>text</code> là <code>string</code> bất kỳ. Đừng sửa bằng <code>any</code> hay bằng cách bỏ <code>as const</code> (thế là vứt luôn kiểu). Hai cách sửa trung thực, đều đã đo:</p>
${ma('typescript', CODE.incl)}
${ma('typescript', CODE.inclAs)}
<p>Cách đầu không cần <code>as</code>: một danh sách <code>LabCode</code> <em>là</em> một danh sách chuỗi, nên gán nó vào <code>readonly string[]</code> là phép nới kiểu an toàn mà tsc có kiểm. Cách thứ hai viết cùng phép nới đó bằng <code>as</code>; biên dịch được, nhưng <code>as</code> cũng có thể nói dối (bài 1.2), nên hãy chọn phép gán — Lab 2 cấm <code>as</code> vì lý do đó.</p>
</div>

<h3>Kiểm một giá trị từ bên ngoài: guard</h3>
<p>Lỗi thứ hai của tệp đỏ là nửa còn lại của câu chuyện. Query string là chữ, và <code>get</code> có thể trả <code>null</code> (bài 2.1):</p>
${ma('typescript', INCL_RED_QUERY)}
${ra(INCL_RED_2)}
<p>Bạn không thể tuyên bố rằng người dùng đã gõ đúng mã. Bạn phải kiểm. <code>isLab</code> ở trên có kiểu trả về <code>text is LabCode</code> — một <strong>type guard (hàm canh kiểu)</strong> (bạn đã gặp một cái ở bài 1.2; Chương 5 giảng đầy đủ). Khi nó trả <code>true</code>, tsc coi <code>text</code> là <code>LabCode</code> bên trong nhánh đó:</p>
${ma('typescript', CODE.inclRun)}
${ra(OUT['05-includes'])}
<p><code>be-201</code> viết thường, <code>BE-999</code> không tồn tại và query rỗng đều bị từ chối lúc chạy; mã hợp lệ thì qua và trở thành <code>LabCode</code> mà không cần <code>as</code> nào.</p>
<p>Vì sao vẫn cần guard, nếu <code>LABS</code> là “hằng”? Vì <code>as const</code> chỉ tồn tại cho tsc:</p>
${ma('typescript', CODE.frozen)}
${ra(OUT['15-frozen'])}
<p>Lúc chạy nó là một mảng bình thường, thậm chí không bị đóng băng. Bảo vệ đến từ hai lớp: tsc chặn <em>code của bạn</em> push vào nó hay dùng một mã lạ; guard chặn <em>dữ liệu từ ngoài</em>. (Đóng băng thật lúc chạy bằng <code>Object.freeze</code> là bài 2.2.)</p>

<h3>Object map: mỗi mã một giá trị</h3>
<p>Mẹo đó cũng dùng được cho object. LabFlow cần một thông báo cho mỗi <code>SlotCode</code>:</p>
${ma('typescript', CODE.messages)}
<p><code>as const</code> giữ mỗi câu là literal và biến mọi thuộc tính thành <code>readonly</code>; <code>satisfies Record&lt;SlotCode, string&gt;</code> (bài 1.3; <code>Record</code> = “object có đúng các khoá này”, Chương 8) kiểm rằng mã nào cũng có thông báo. <code>keyof typeof SLOT_MESSAGES</code> đọc là “các khoá của kiểu của giá trị” — một union bốn mã. Tệp khai báo tsc xuất ra:</p>
${ra(OUT['06b-map-dts'])}
${ma('typescript', CODE.mapRun)}
${ra(OUT['06-map'])}
<p>Để ý <code>as const</code> trên <code>CASES</code> nữa: mỗi cặp giữ nguyên là tuple hai phần tử, nên <code>start</code> và <code>end</code> là chuỗi, không phải <code>string | undefined</code> (tuple là bài 2.2). Giờ thử quên một thông báo, hoặc sửa một câu:</p>
${ma('typescript', CODE.mapRed)}
${ra(OUT['07-map-red'])}
<p>TS2741 gọi tên khoá bị thiếu, TS2540 từ chối phép gán. Khi Chương 5 thêm một mã slot mới, bảng này đỏ lên cho tới khi có người viết thông báo cho nó — ngược hẳn với danh sách chép tay.</p>

<h3>Sao không dùng enum?</h3>
<p>Từ Java hay C# sang, bạn sẽ viết <code>enum</code>. Bài 0.4 đã cho thấy vì sao khoá này không dùng: enum không chỉ là kiểu, nó sinh ra JavaScript, nên type stripping của Node không chạy được, và tsconfig của khoá bật <code>erasableSyntaxOnly</code>:</p>
${ma('typescript', CODE.enumTs)}
${ra(ENUM_TSC_1)}
<p>Một object <code>as const</code> cho bạn đúng những thứ đó — tên gọi (<code>STATUS.Pending</code>), danh sách giá trị lúc chạy, một kiểu — bằng JavaScript thường:</p>
${ma('typescript', CODE.status)}
${ra(OUT['09-enum-run'])}
${ma('typescript', CODE.enumRed)}
${ra(ENUM_TSC_2)}
<p>Và khác string enum, tham số kiểu <code>Status</code> nhận được chuỗi thường <code>'CONFIRMED'</code> — đúng thứ đến từ JSON và từ cơ sở dữ liệu.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>as const</code> gặp một tham số <code>string[]</code> cũ.</strong> <code>as const</code> còn nghĩa là <em>chỉ đọc</em>. Một hàm phụ chỉ đọc danh sách nhưng khai báo <code>string[]</code> sẽ từ chối nó:</p>
${ma('typescript', CODE.print)}
${ra(OUT['10-readonly'])}
<p>tsc đúng: tham số <code>string[]</code> được phép <code>push</code>, còn <code>LABS</code> đã hứa không ai làm thế. Đừng bỏ <code>as const</code>; hãy sửa lời hứa của hàm phụ. Tham số <code>readonly string[]</code> nhận cả hai loại mảng:</p>
${ma('typescript', CODE.printFixed)}
${ra(OUT['11-readonly-fixed'])}
</div>

<h3>Khi nào dùng gì</h3>
${BANG_VI}

<h3>🗺 Một danh sách, hai thế giới</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Viết một lần</div><div class="lz-d">const LABS = [...] as const</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Suy ra kiểu</div><div class="lz-d">type LabCode = (typeof LABS)[number]</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">tsc kiểm code của bạn</div><div class="lz-d">'BE-999' trong code ⇒ TS2322</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Guard kiểm dữ liệu từ ngoài</div><div class="lz-d">?lab=BE-999 ⇒ 400 lúc chạy</div></div>
</div>

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Enum hay union các chuỗi literal?”</strong> Một câu trả lời tốt gói trong ba câu: union literal bị xoá, không tốn gì lúc chạy và nhận được chuỗi thường đến từ JSON; <code>enum</code> sinh ra code (type stripping của Node và <code>erasableSyntaxOnly</code> từ chối nó) và string enum không nhận chuỗi thường. Khi tôi còn cần danh sách lúc chạy, tôi viết nó một lần <code>as const</code> rồi suy union bằng <code>(typeof X)[number]</code>, để dữ liệu và kiểu không thể lệch nhau. Điểm cộng: kể một lần lệch thật bạn từng thấy — vd một union chép tay làm vỡ script seed.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Form đặt phòng gửi <code>?step=30</code> — số phút mỗi ô lưới. LabFlow hỗ trợ 15, 30 và 60. Một bạn cùng nhóm viết thế này (<code>demo2/ts-02-4/practice/start/step.ts</code>):</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['13-pr-start'])}
<ol>
<li>Đọc lỗi: vì sao sau <code>STEPS.includes(n)</code> thì <code>n</code> vẫn là <code>number</code>?</li>
<li>Biến <code>STEPS</code> thành nguồn sự thật duy nhất và suy <code>Step</code> từ nó.</li>
<li>Viết guard <code>isStep(n: number): n is Step</code> không dùng <code>as</code> hay <code>any</code>, rồi dùng nó.</li>
<li>Thử <code>?step=30</code>, <code>?step=45</code>, <code>?step=abc</code>.</li>
</ol>
<p><strong>Lời giải và output thật.</strong> Bước 1: <code>includes</code> trả về <code>boolean</code> trơn; nó không nói gì về <em>kiểu</em> của <code>n</code>, và mảng <code>number[]</code> chép tay thậm chí chẳng dính gì tới <code>Step</code>. Bước 2–4:</p>
${ma('typescript', CODE.prSol)}
${ma('typescript', CODE.prRun)}
${ra(OUT['14-pr-sol'])}
<p><strong>Đạt khi:</strong> tsc không in gì, <code>Step</code> chỉ xuất hiện ở đúng một chỗ dưới dạng danh sách (<code>STEPS</code>), không có <code>as</code> nào ngoài <code>as const</code>, và chỉ 30 được nhận. Code Lab có thêm bốn bài cho bài học này (suy <code>LabCode</code>, guard <code>isLab</code>, bảng thông báo đầy đủ, thay một <code>enum</code>).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">literal type (kiểu literal)</span><span class="v">Kiểu chỉ có đúng một giá trị: <code>'BE-201'</code>, <code>30</code>, <code>true</code>.</span></div>
  <div class="kv"><span class="k">as const</span><span class="v">“Giữ mọi giá trị ở dạng literal và biến thành chỉ đọc.” Chỉ có lúc biên dịch — lúc chạy mảng vẫn bình thường.</span></div>
  <div class="kv"><span class="k">typeof (trong kiểu)</span><span class="v">Type query (truy vấn kiểu): kiểu của một giá trị. <code>typeof LABS</code>.</span></div>
  <div class="kv"><span class="k">indexed access type (kiểu truy cập theo chỉ số)</span><span class="v"><code>T[K]</code>: kiểu nằm ở khoá hoặc chỉ số K. <code>[number]</code> = phần tử bất kỳ.</span></div>
  <div class="kv"><span class="k">keyof</span><span class="v">Union các khoá của một kiểu object.</span></div>
  <div class="kv"><span class="k">single source of truth (một nguồn sự thật)</span><span class="v">Một sự thật chỉ viết ở một chỗ; mọi thứ khác suy ra từ nó, nên không thể lệch.</span></div>
  <div class="kv"><span class="k">type guard (hàm canh kiểu)</span><span class="v">Hàm trả về <code>x is T</code>: phép kiểm lúc chạy mà tsc tin để thu hẹp kiểu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Kiểu literal chỉ cho đúng các giá trị đã liệt kê: <code>45</code> bị <code>15 | 30 | 60</code> từ chối (TS2322).</li>
<li>Danh sách chép tay vẫn biên dịch và âm thầm cũ đi: tsc im lặng trong khi AL-301 bị từ chối lúc chạy.</li>
<li>Viết danh sách một lần với <code>as const</code>, suy kiểu bằng <code>(typeof LABS)[number]</code>; thiếu <code>as const</code> thì kiểu suy ra chỉ là <code>string</code>.</li>
<li><code>LABS.includes(text)</code> với <code>text: string</code> là TS2345; nới kiểu bằng phép gán sang <code>readonly string[]</code> bên trong guard <code>text is LabCode</code>.</li>
<li>Object <code>as const</code> + <code>satisfies Record&lt;…&gt;</code> cho bảng tra đầy đủ, chỉ đọc (TS2741, TS2540) và thay được <code>enum</code> (TS1294 dưới tsconfig của khoá).</li>
<li>Tham số chỉ đọc nên là <code>readonly T[]</code>, nếu không dữ liệu <code>as const</code> bị từ chối (TS4104).</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Indexed Access Types', 'T[K] và typeof MyArray[number]: kiểu của một phần tử của một mảng giá trị. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html')}
${nguon('📗', 'TypeScript Handbook — Typeof Type Operator', 'typeof ở vị trí kiểu chỉ kiểu của một giá trị. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/typeof-types.html')}
${nguon('📙', 'TypeScript Handbook — Enums (mục “Objects vs Enums”)', 'Object với as const thay được enum. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/enums.html')}
${lienKet({ khoa: 'prisma-orm', bai: 'pr-8-3-su-co-enum', title: 'Sự cố trong khoá Prisma — 8.3: Cái kiểu làm vỡ production', sub: 'Giống: một danh sách giá trị được phép chép tay, chỉ được kiểm với chính nó, làm vỡ seed ngày 08/08 trong khi mọi bước kiểm đều xanh. Khác: bên đó nguồn sự thật là lược đồ Prisma và cách sửa là import enum được sinh ra; ở đây bạn rèn đúng kỷ luật đó bằng TypeScript thuần với as const và (typeof X)[number].', cta: 'MỞ BÀI PRISMA →' })}
</div>
`,
};
