/**
 * TypeScript · Chương 2 · 2.1 — Kiểu primitive, chú thích & strict null checks. Slug giữ: typescript-2-1-primitive.
 * BÀI MỞ CHƯƠNG 2 (soạn lại TRỌN 01/11/2026 theo ./_HOP-DONG.md). Mọi code/output lấy từ ./_ma-ts-02-1.mjs
 * (sinh từ labflow-ts chạy thật: Node 22.23.3, tsc 7.0.2 — demo2/ts-02-1/).
 */
import G from '../giang/ts-02-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-02-1.mjs';

const FIX_BODY = CODE.fix.split('\n').slice(21).join('\n');
const SCHEDULE_TYPE = CODE.schedule.split('\n').slice(0, 10).join('\n');
const OR_TEST = OUT['20-or-test'].split('\n').filter((l) => /^\$|^✔|^✖ (a|an) |^ℹ (pass|fail)|!==/.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const FIXED_TEST = OUT['21-fixed-test'].split('\n').filter((l) => /^\$|^✔|^ℹ (pass|fail)/.test(l)).join('\n');
const PR_START_RUN = OUT['22-pr-start-run'].split('\n').filter((l) => !/^\s+at (?!labelOf)|^Node\.js|^$/.test(l)).join('\n');
const OR_DIFF = CODE.orFixed.split('\n').filter((l) => /\?\?/.test(l)).join('\n');

const BANG_EN = `<table>
<thead><tr><th>Line in schedule.ts</th><th>strict OFF</th><th>strict ON (tsc)</th><th>What Node does with real data</th></tr></thead>
<tbody>
<tr><td><code>e.note.toUpperCase()</code></td><td>silent</td><td>TS18047 <code>'e.note' is possibly 'null'</code></td><td>entry 2: <code>TypeError: Cannot read properties of null</code></td></tr>
<tr><td><code>e.cancelledAt.slice(0, 10)</code></td><td>silent</td><td>TS18048 <code>… possibly 'undefined'</code></td><td>entry 1: <code>TypeError: … of undefined (reading 'slice')</code></td></tr>
<tr><td><code>findEntry(schedule, id).bookedBy</code></td><td>silent</td><td>TS2532 <code>Object is possibly 'undefined'</code></td><td>id 9: <code>TypeError: … (reading 'bookedBy')</code></td></tr>
<tr><td><code>return e.note</code> (declared <code>: string</code>)</td><td>silent</td><td>TS2322 <code>'string | null' … 'string'</code></td><td>returns <code>null</code> — <strong>no error at all</strong>, the caller breaks later</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Dòng trong schedule.ts</th><th>strict TẮT</th><th>strict BẬT (tsc)</th><th>Node làm gì với dữ liệu thật</th></tr></thead>
<tbody>
<tr><td><code>e.note.toUpperCase()</code></td><td>im lặng</td><td>TS18047 <code>'e.note' is possibly 'null'</code></td><td>lượt 2: <code>TypeError: Cannot read properties of null</code></td></tr>
<tr><td><code>e.cancelledAt.slice(0, 10)</code></td><td>im lặng</td><td>TS18048 <code>… possibly 'undefined'</code></td><td>lượt 1: <code>TypeError: … of undefined (reading 'slice')</code></td></tr>
<tr><td><code>findEntry(schedule, id).bookedBy</code></td><td>im lặng</td><td>TS2532 <code>Object is possibly 'undefined'</code></td><td>id 9: <code>TypeError: … (reading 'bookedBy')</code></td></tr>
<tr><td><code>return e.note</code> (khai <code>: string</code>)</td><td>im lặng</td><td>TS2322 <code>'string | null' … 'string'</code></td><td>trả về <code>null</code> — <strong>không lỗi gì</strong>, chỗ gọi hỏng sau</td></tr>
</tbody>
</table>`;

const DUNG_EN = `<table>
<thead><tr><th>Situation in your data</th><th>Write the type as</th><th>Read it as</th></tr></thead>
<tbody>
<tr><td>always there, never empty</td><td><code>bookedBy: string</code></td><td>no check needed</td></tr>
<tr><td>key always there, value may be NULL (a nullable database column)</td><td><code>note: string | null</code></td><td>check <code>=== null</code> or use <code>??</code></td></tr>
<tr><td>key may be absent (filled in later)</td><td><code>cancelledAt?: string</code></td><td>check <code>=== undefined</code>, <code>?.</code> or <code>??</code></td></tr>
<tr><td>a lookup that may find nothing</td><td>return <code>T | undefined</code> (like <code>Array.find</code>)</td><td>the CALLER decides what "not found" means</td></tr>
<tr><td>a default for a missing value</td><td><code>value ?? fallback</code></td><td>never <code>||</code> when 0, <code>''</code> or <code>false</code> are real values</td></tr>
</tbody>
</table>`;
const DUNG_VI = `<table>
<thead><tr><th>Tình huống trong dữ liệu</th><th>Viết kiểu là</th><th>Đọc nó thế nào</th></tr></thead>
<tbody>
<tr><td>luôn có, không bao giờ trống</td><td><code>bookedBy: string</code></td><td>không cần kiểm</td></tr>
<tr><td>khoá luôn có, giá trị có thể NULL (cột cho phép NULL)</td><td><code>note: string | null</code></td><td>kiểm <code>=== null</code> hoặc dùng <code>??</code></td></tr>
<tr><td>khoá có thể vắng mặt (điền sau)</td><td><code>cancelledAt?: string</code></td><td>kiểm <code>=== undefined</code>, <code>?.</code> hoặc <code>??</code></td></tr>
<tr><td>tra cứu có thể không thấy gì</td><td>trả về <code>T | undefined</code> (như <code>Array.find</code>)</td><td>NGƯỜI GỌI quyết định "không thấy" nghĩa là gì</td></tr>
<tr><td>giá trị mặc định khi thiếu</td><td><code>value ?? fallback</code></td><td>đừng dùng <code>||</code> khi 0, <code>''</code> hay <code>false</code> là giá trị thật</td></tr>
</tbody>
</table>`;

export default {
  title: '2.1 — Primitives, annotations & strict null checks|||2.1 — Kiểu primitive, chú thích & strict null checks',
  slug: 'typescript-2-1-primitive',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 2: bảy kiểu primitive và typeof lúc chạy (typeof null là "object"), string thường vs String bọc ngoài (TS2322), ba sự thật về number mà kiểu không đổi được (0.1 + 0.2, id bigint bị Number() làm tròn, JSON.stringify ném lỗi với bigint), null vs undefined trong lịch phòng LabFlow (note: string | null, cancelledAt?: string), cùng một tệp với strictNullChecks tắt (0 lỗi) và bật (4 lỗi TS18047/TS18048/TS2532/TS2322) rồi chạy thật ra 3 lần sập; ba cách sửa (if, ?., ??) và bẫy || vs ?? mà chỉ test bắt được.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Primitives, annotations &amp; strict null checks</h2>
<p class="lead">The most common JavaScript crash is <code>TypeError: Cannot read properties of null</code>. This lesson takes one day of LabFlow’s lab schedule — a note that may be NULL, a cancellation date that may be missing — and shows, with real output, the same file compiling cleanly with <code>strictNullChecks</code> off, four precise errors with it on, and three crashes when Node runs it. On the way: the seven primitive types and the number facts no type can fix.</p>

<h3>After Chapter 2 you can…</h3>
<ul>
<li><strong>Name every basic type</strong> and annotate a value with it (this lesson), including when a value may be <code>null</code> or missing — and make tsc force every caller to handle that.</li>
<li><strong>Use arrays, tuples and <code>readonly</code></strong> so a function cannot reorder the caller’s schedule and a time range is always exactly <code>[start, end]</code> (lesson 2.2).</li>
<li><strong>Know the four special types</strong> — <code>unknown</code> at the top, <code>never</code> at the bottom, <code>void</code>, <code>any</code> — and make tsc tell you when a new status code is not handled (2.3).</li>
<li><strong>Keep one source of truth</strong> for a list of allowed values with <code>as const</code> (2.4).</li>
<li><strong>Pass Lab 2</strong>: take a teammate’s schedule module written with strict mode OFF and make it compile under strict, without <code>any</code>, <code>as</code> or <code>!</code>, so that eight wrong calls are refused.</li>
</ul>
<p>Why it matters: real database rows have empty columns, and in SWP391 or your graduation project the screen that crashes in front of the lecturer is often the one that met an unexpected NULL. “null vs undefined?” and “what does <code>strictNullChecks</code> do?” are standard junior interview questions — you will answer both with an example you ran.</p>

<h3>The seven primitives — and what <code>typeof</code> says at runtime</h3>
<p>A <strong>primitive</strong> (giá trị nguyên thuỷ) is a simple value that is not an object. JavaScript has seven kinds, and TypeScript has a type for each, always written in <strong>lower case</strong>. The demo annotates one of each and asks JavaScript’s own <code>typeof</code> operator what it sees:</p>
${ma('typescript', CODE.typeofTs)}
${ra(OUT['11-typeof'])}
<p>Two surprises. <code>typeof null</code> is <code>"object"</code> — a bug from the first JavaScript, kept for compatibility, so <code>typeof x === 'object'</code> does not prove “x is an object”. And arrays and objects are all <code>"object"</code>: at runtime <code>typeof</code> is all you have, and it knows far less than tsc, whose types are erased before Node runs (lesson 0.4).</p>

<h3>Annotation syntax, and why <code>string</code> is lower case</h3>
<p>An <strong>annotation</strong> (chú thích kiểu) is a colon after a name, then a type: <code>const seats: number = 31</code>. Lesson 1.3 showed that inference fills in most local variables for you; you write annotations on parameters, exported return types, and data that is built far from where it is used. One spelling mistake is worth seeing once:</p>
${ma('typescript', CODE.wrapper)}
${ra(OUT['13-wrapper-tsc'])}
${ra(OUT['13-wrapper-run'])}
<p><code>String</code> (capital S) is the type of a <em>wrapper object</em> from <code>new String(…)</code>. tsc refuses it where a <code>string</code> is required and suggests the fix; at runtime two wrappers with the same text are not even equal. Always write <code>string</code>, <code>number</code>, <code>boolean</code>.</p>

<h3>Three number facts that no type can change</h3>
<p><code>: number</code> says what kind of value it is — nothing about precision. Every line compiles:</p>
${ma('typescript', CODE.facts)}
${ra(OUT['14-facts-tsc'])}
${ra(OUT['14-facts-run'])}
<ul>
<li><strong>Decimals are approximate</strong> (64-bit floating point): never sum money as decimals and compare with <code>===</code> — store whole units (đồng, cents).</li>
<li><strong>Integers above 2^53 are rounded</strong>: a PostgreSQL <code>bigint</code> id …993 read through <code>Number()</code> silently becomes …992 — a <em>different booking</em>.</li>
<li><strong>JSON has no bigint</strong>: a <code>bigint</code> id stays exact, but <code>JSON.stringify</code> throws. APIs send such ids as strings (Code Lab ts-cl-2-1-d).</li>
</ul>
<p>Where types <em>do</em> help is mixing the two number kinds:</p>
${ma('typescript', CODE.mix)}
${ra(OUT['15-mix'])}
<p>TS2365, TS2322: <code>bigint</code> and <code>number</code> do not mix (at runtime: <code>TypeError: Cannot mix BigInt and other types, use explicit conversions</code>). Lines 5–6 show the fix.</p>

<h3><code>null</code> and <code>undefined</code>: two kinds of “nothing” in LabFlow</h3>
<p>JavaScript has two empty values, and LabFlow uses both on purpose. Here is one row of a lab’s schedule — the type every lesson of this chapter builds on:</p>
${ma('typescript', SCHEDULE_TYPE)}
<ul>
<li><code>note: string | null</code> — the key is <em>always</em> there, but the value may be <code>null</code>: the <code>note</code> column in the database allows NULL, meaning “nobody wrote a note”. Read <code>string | null</code> as “a string or null” — the <code>|</code> (“or”) is the union you met in lesson 1.1.</li>
<li><code>cancelledAt?: string</code> — the question mark makes the <strong>key optional</strong>: a booking that was never cancelled simply has no such key, so reading it gives <code>undefined</code>.</li>
</ul>
<p>The difference is not academic. Send a row through JSON — every API call does — and the two behave differently:</p>
${ma('typescript', CODE.jsonTs)}
${ra(OUT['12-json'])}
<p><code>null</code> travels; a key holding <code>undefined</code> vanishes. And “optional key” is not the same as “a key whose value may be undefined”:</p>
${ma('typescript', CODE.optional)}
${ra(OUT['19-optional'])}
${ra(OUT['19-optional-run'])}
<p>TS2741: with <code>| undefined</code> the key is <em>required</em> (write it, even as <code>undefined</code>); TS2322: <code>null</code> is not <code>undefined</code>; and <code>in</code> sees the difference at runtime. Rule: <strong><code>?:</code> for “may be absent”, <code>| null</code> for “present but empty”</strong> — mirror what the database and API really send.</p>

<h3>The same file, with <code>strictNullChecks</code> off and on</h3>
<p>A teammate wrote the schedule helpers with strict mode off. The type above is honest — yet four functions ignore what it says:</p>
${ma('typescript', CODE.schedule)}
<p>Their tsconfig switched one option off. With <code>strictNullChecks: false</code>, <code>null</code> and <code>undefined</code> are silently allowed in <em>every</em> type, so <code>string | null</code> is just <code>string</code>:</p>
${ma('json', CODE.loose)}
${ra(OUT['16-loose'])}
<p>Zero errors. Now the course tsconfig (strict, lesson 0.3) on the same file:</p>
${ra(OUT['16-strict'])}
<p>Four errors, four lines, before anything runs. Is tsc being fussy? Run the helpers on the three real rows of <code>TODAY</code> and look:</p>
${ma('typescript', CODE.runAll)}
${ra(OUT['17-run-all'])}
${BANG_EN}
<p>Three crashes, each only when that row reaches that line, and one silent <code>null</code> that breaks someone else later — all four were red lines in tsc. <code>strictNullChecks</code> is part of <code>strict: true</code> (on by default in TypeScript 7): the best single reason never to switch strict off.</p>

<h3>Three fixes: check first, <code>?.</code>, <code>??</code></h3>
${ma('typescript', FIX_BODY)}
${ra(OUT['18-fix-tsc'])}
${ra(OUT['18-fix-run'])}
<ul>
<li><strong>Check first.</strong> After <code>if (e.note === null) return '';</code> tsc knows that on the next line <code>e.note</code> can only be a <code>string</code>. This is called <strong>narrowing</strong> (thu hẹp kiểu) — Chapter 5 is all about it.</li>
<li><strong><code>?.</code> optional chaining</strong> (chuỗi tuỳ chọn): <code>a?.b</code> stops and gives <code>undefined</code> if <code>a</code> is null/undefined — so <code>cancelledOn</code> now returns <code>string | undefined</code>, and its callers are checked in turn.</li>
<li><strong><code>??</code> nullish coalescing</strong> (gộp giá trị rỗng): <code>a ?? b</code> gives <code>b</code> only when <code>a</code> is <code>null</code> or <code>undefined</code>. <code>bookerOf</code> decides that a missing booking reads as <code>'(unknown)'</code>.</li>
</ul>
<p>And <code>findEntry(…)!.bookedBy</code>? The <code>!</code> just tells tsc “trust me” — lesson 1.2 showed it ends in the same crash, unwarned. Lab 2 bans it.</p>

<h3>🗺 Where a NULL comes from, and where tsc stops it</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Database</div><div class="lz-d">the note column allows NULL</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">JSON / API</div><div class="lz-d">"note": null travels; undefined keys vanish</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Your type</div><div class="lz-d">note: string | null — say it honestly</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">tsc (strict)</div><div class="lz-d">TS18047 until every use checks first</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">The screen</div><div class="lz-d">shows "(no note)" instead of crashing</div></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>||</code> instead of <code>??</code>: it compiles, and it is wrong.</strong> A lab’s <code>capacity</code> is <code>null</code> when nobody has recorded it yet (use the default 40) and <code>0</code> when the lab is closed for maintenance. A note may be <code>null</code> (no note) or <code>''</code> (an empty note someone saved):</p>
${ma('typescript', CODE.orLab)}
${ra(OUT['20-or-tsc'])}
<p>tsc is silent: <code>||</code> is perfectly legal on these types. The tests are not:</p>
${ra(OR_TEST)}
<p><code>a || b</code> replaces every <strong>falsy</strong> value — <code>0</code>, <code>''</code>, <code>false</code>, <code>NaN</code>, <code>null</code>, <code>undefined</code>. So a closed lab gets 40 seats and students book a room that is being repaired. <code>??</code> replaces only <code>null</code> and <code>undefined</code>:</p>
${ma('typescript', OR_DIFF)}
${ra(FIXED_TEST)}
<p>Types tell you a value <em>may be</em> null; they do not tell you which default is right. That is business logic, and only a test with the boundary values <code>0</code> and <code>''</code> notices.</p>
</div>

<h3>When to use what</h3>
${DUNG_EN}

<h3>💼 Interview corner</h3>
<p><strong>“null or undefined in an API?”</strong> <code>undefined</code> = “not there”, vanishes from JSON; <code>null</code> = “there, deliberately empty”, survives JSON. A nullable column becomes <code>T | null</code>, an optional field <code>key?: T</code>. <strong>“What does strictNullChecks do?”</strong> It removes null and undefined from every type unless you write them, so tsc forces each use to check first — show TS18047 and the crash it prevents.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo2/ts-02-1/practice/start/label.ts</code> builds a one-line label for a schedule row. It is red under strict, and Node crashes on the very first row:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['22-pr-start'])}
${ra(PR_START_RUN)}
<ol>
<li>Read the two errors: which line, which value, null or undefined?</li>
<li>Fix <code>labelOf</code> so it compiles under strict <strong>without</strong> <code>!</code>, <code>as</code> or <code>any</code>: a missing note reads “(no note)”, a booking that was never cancelled shows nothing after the note.</li>
<li>Run tsc and Node again.</li>
</ol>
<p><strong>Solution and real output.</strong> Check each maybe-missing value where you use it; the <code>? :</code> operator narrows just like <code>if</code>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['23-pr-sol'])}
<p><strong>Done when:</strong> tsc prints nothing and Node prints the two labels above. Code Lab has four more exercises: missing fields, an honest <code>findEntry</code>, <code>||</code> vs <code>??</code>, a bigint id in JSON.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">primitive</span><span class="v">A simple, non-object value: string, number, boolean, bigint, symbol, null, undefined.</span></div>
  <div class="kv"><span class="k">strictNullChecks</span><span class="v">Part of strict: null and undefined belong to a type only if you write them.</span></div>
  <div class="kv"><span class="k">optional property</span><span class="v"><code>key?: T</code> — the key may be absent; reading it can give undefined.</span></div>
  <div class="kv"><span class="k">narrowing</span><span class="v">After a check such as <code>=== null</code>, tsc uses a smaller type on the next lines.</span></div>
  <div class="kv"><span class="k">optional chaining <code>?.</code></span><span class="v">Stop and give undefined if the left side is null or undefined.</span></div>
  <div class="kv"><span class="k">nullish coalescing <code>??</code></span><span class="v">A default only for null/undefined — unlike <code>||</code>, which also replaces 0, '' and false.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Seven primitives, always lower case: <code>string</code>, <code>number</code>, <code>boolean</code>, <code>bigint</code>, <code>symbol</code>, <code>null</code>, <code>undefined</code>. <code>String</code> is a wrapper object (TS2322 tells you).</li>
<li><code>typeof null</code> is <code>"object"</code>; at runtime <code>typeof</code> is all you have, and it knows far less than tsc.</li>
<li><code>: number</code> does not fix precision: <code>0.1 + 0.2</code>, ids above 2^53, bigint in JSON. Keep big ids as <code>bigint</code>/<code>string</code>.</li>
<li><code>| null</code> = present but empty, <code>?:</code> = may be absent. With strict off the same file had 0 errors and crashed 3 times; with strict on it had 4 errors (TS18047, TS18048, TS2532, TS2322).</li>
<li>Fix with a check, <code>?.</code> or <code>??</code> — not with <code>!</code>. And prefer <code>??</code> to <code>||</code>: <code>||</code> turned a closed lab’s 0 seats into 40, and only a test saw it.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Everyday Types', 'Primitives, the lower-case rule (string vs String), null and undefined, optional properties, the non-null assertion. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')}
${nguon('⚙️', 'TSConfig reference — strictNullChecks', 'What changes when the option is on or off, with the find() example. Read 1 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/strictNullChecks.html')}
${nguon('📗', 'MDN — Nullish coalescing operator (??)', 'Why ?? differs from || on 0, empty string and false. Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing')}
${nguon('📗', 'MDN — BigInt', 'Whole numbers beyond 2^53, no mixing with number, no JSON serialisation by default. Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-4-2-select-where', title: 'NULL on the database side — PostgreSQL 4.2: SELECT &amp; WHERE', sub: 'Same: NULL means “no value”, and you must handle it explicitly or rows (or screens) silently go wrong. Different: SQL deals with it at query time with IS NULL and three-valued logic; here the column arrives as string | null and tsc refuses every use that does not check first.', cta: 'OPEN POSTGRESQL LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Kiểu primitive, chú thích &amp; strict null checks</h2>
<p class="lead">Lỗi sập hay gặp nhất của JavaScript là <code>TypeError: Cannot read properties of null</code>. Bài này lấy một ngày trong lịch phòng LabFlow — ghi chú có thể NULL, ngày huỷ có thể vắng — và cho thấy bằng output thật: cùng một tệp biên dịch sạch khi <code>strictNullChecks</code> tắt, ra bốn lỗi chính xác khi bật, và sập ba lần khi Node chạy. Trên đường đi: bảy kiểu primitive và những sự thật về số mà không kiểu nào sửa được.</p>

<h3>Học xong Chương 2 bạn làm được…</h3>
<ul>
<li><strong>Gọi tên mọi kiểu cơ bản</strong> và chú thích kiểu cho một giá trị (bài này), kể cả khi giá trị có thể là <code>null</code> hay vắng mặt — và bắt tsc ép mọi chỗ gọi phải xử lý chuyện đó.</li>
<li><strong>Dùng mảng, tuple và <code>readonly</code></strong> để một hàm không thể đảo thứ tự lịch của người gọi, và một khoảng giờ luôn đúng là <code>[start, end]</code> (bài 2.2).</li>
<li><strong>Hiểu bốn kiểu đặc biệt</strong> — <code>unknown</code> ở đỉnh, <code>never</code> ở đáy, <code>void</code>, <code>any</code> — và để tsc báo khi một mã trạng thái mới chưa được xử lý (2.3).</li>
<li><strong>Giữ một nguồn sự thật duy nhất</strong> cho danh sách giá trị được phép bằng <code>as const</code> (2.4).</li>
<li><strong>Qua Lab 2</strong>: nhận module lịch phòng của một bạn cùng nhóm viết khi strict TẮT, sửa cho biên dịch được dưới strict, không <code>any</code>, <code>as</code> hay <code>!</code>, sao cho tám lời gọi sai bị từ chối.</li>
</ul>
<p>Vì sao quan trọng: dòng thật trong CSDL có cột trống, và trong SWP391 hay đồ án tốt nghiệp, màn hình sập trước mặt thầy thường là màn hình gặp một NULL không ai ngờ. “null khác undefined thế nào?” và “<code>strictNullChecks</code> làm gì?” là câu phỏng vấn junior chuẩn — bạn sẽ trả lời cả hai bằng ví dụ chính tay đã chạy.</p>

<h3>Bảy primitive — và <code>typeof</code> nói gì lúc chạy</h3>
<p><strong>Primitive (giá trị nguyên thuỷ)</strong> là giá trị đơn giản, không phải object. JavaScript có bảy loại, TypeScript có một kiểu cho mỗi loại, luôn viết <strong>chữ thường</strong>. Demo chú thích kiểu cho mỗi loại một giá trị và hỏi chính toán tử <code>typeof</code> của JavaScript xem nó thấy gì:</p>
${ma('typescript', CODE.typeofTs)}
${ra(OUT['11-typeof'])}
<p>Hai điều bất ngờ. <code>typeof null</code> là <code>"object"</code> — lỗi từ JavaScript đầu tiên, giữ lại để không vỡ web cũ, nên <code>typeof x === 'object'</code> không chứng minh “x là object”. Và mảng lẫn object đều là <code>"object"</code>: lúc chạy bạn chỉ có <code>typeof</code>, và nó biết ít hơn tsc rất nhiều — kiểu của tsc bị xoá trước khi Node chạy (bài 0.4).</p>

<h3>Cú pháp chú thích kiểu, và vì sao <code>string</code> viết thường</h3>
<p><strong>Chú thích kiểu (type annotation)</strong> là dấu hai chấm sau một cái tên, rồi một kiểu: <code>const seats: number = 31</code>. Bài 1.3 đã cho thấy suy luận kiểu lo hộ phần lớn biến cục bộ; bạn viết chú thích cho tham số, kiểu trả về của hàm export, và dữ liệu được dựng ở xa chỗ dùng. Có một lỗi chính tả đáng thấy tận mắt một lần:</p>
${ma('typescript', CODE.wrapper)}
${ra(OUT['13-wrapper-tsc'])}
${ra(OUT['13-wrapper-run'])}
<p><code>String</code> (S hoa) là kiểu của <em>object bọc ngoài</em> tạo bằng <code>new String(…)</code>. tsc không cho nó vào chỗ cần <code>string</code> và gợi ý luôn cách sửa; lúc chạy hai object bọc cùng nội dung còn không bằng nhau. Luôn viết <code>string</code>, <code>number</code>, <code>boolean</code>.</p>

<h3>Ba sự thật về số mà không kiểu nào đổi được</h3>
<p><code>: number</code> nói giá trị thuộc loại gì — không nói gì về độ chính xác. Mọi dòng đều biên dịch được:</p>
${ma('typescript', CODE.facts)}
${ra(OUT['14-facts-tsc'])}
${ra(OUT['14-facts-run'])}
<ul>
<li><strong>Số thập phân là xấp xỉ</strong> (dấu phẩy động 64 bit): đừng cộng tiền dạng thập phân rồi so bằng <code>===</code> — lưu theo đơn vị nguyên (đồng, cent).</li>
<li><strong>Số nguyên trên 2^53 bị làm tròn</strong>: id <code>bigint</code> …993 của PostgreSQL đi qua <code>Number()</code> lặng lẽ thành …992 — một <em>lượt đặt khác</em>.</li>
<li><strong>JSON không có bigint</strong>: id <code>bigint</code> giữ chính xác, nhưng <code>JSON.stringify</code> ném lỗi. API gửi những id như vậy dạng chuỗi (Code Lab ts-cl-2-1-d).</li>
</ul>
<p>Chỗ kiểu <em>có</em> giúp là khi trộn hai loại số:</p>
${ma('typescript', CODE.mix)}
${ra(OUT['15-mix'])}
<p>TS2365, TS2322: <code>bigint</code> và <code>number</code> không trộn được (lúc chạy: <code>TypeError: Cannot mix BigInt and other types, use explicit conversions</code>). Dòng 5–6 là cách sửa.</p>

<h3><code>null</code> và <code>undefined</code>: hai kiểu “không có gì” trong LabFlow</h3>
<p>JavaScript có hai giá trị rỗng, và LabFlow cố ý dùng cả hai. Đây là một dòng trong lịch của một phòng — kiểu mà mọi bài trong chương này xây tiếp:</p>
${ma('typescript', SCHEDULE_TYPE)}
<ul>
<li><code>note: string | null</code> — khoá <em>luôn</em> có, nhưng giá trị có thể là <code>null</code>: cột <code>note</code> trong CSDL cho phép NULL, nghĩa là “không ai viết ghi chú”. Đọc <code>string | null</code> là “một chuỗi hoặc null” — dấu <code>|</code> (“hoặc”) là union bạn đã gặp ở bài 1.1.</li>
<li><code>cancelledAt?: string</code> — dấu hỏi biến <strong>khoá thành tuỳ chọn</strong>: lượt đặt chưa từng bị huỷ đơn giản là không có khoá này, nên đọc nó ra <code>undefined</code>.</li>
</ul>
<p>Khác biệt này không phải chuyện lý thuyết. Gửi một dòng qua JSON — lời gọi API nào cũng làm vậy — và hai giá trị cư xử khác nhau:</p>
${ma('typescript', CODE.jsonTs)}
${ra(OUT['12-json'])}
<p><code>null</code> đi qua được; khoá mang <code>undefined</code> biến mất. Và “khoá tuỳ chọn” không giống “khoá có giá trị có thể undefined”:</p>
${ma('typescript', CODE.optional)}
${ra(OUT['19-optional'])}
${ra(OUT['19-optional-run'])}
<p>TS2741: với <code>| undefined</code> khoá là <em>bắt buộc</em> (phải viết ra, dù là <code>undefined</code>); TS2322: <code>null</code> không phải <code>undefined</code>; và lúc chạy <code>in</code> cũng thấy khác biệt. Quy tắc: <strong><code>?:</code> cho “có thể vắng mặt”, <code>| null</code> cho “có mặt nhưng trống”</strong> — phản chiếu đúng thứ CSDL và API thật sự gửi.</p>

<h3>Cùng một tệp, <code>strictNullChecks</code> tắt và bật</h3>
<p>Một bạn cùng nhóm viết các hàm lịch khi strict đang tắt. Kiểu ở trên là trung thực — vậy mà bốn hàm lờ đi điều nó nói:</p>
${ma('typescript', CODE.schedule)}
<p>tsconfig của bạn ấy tắt đúng một tuỳ chọn. Với <code>strictNullChecks: false</code>, <code>null</code> và <code>undefined</code> được ngầm cho vào <em>mọi</em> kiểu, nên <code>string | null</code> chỉ còn là <code>string</code>:</p>
${ma('json', CODE.loose)}
${ra(OUT['16-loose'])}
<p>Không lỗi nào. Giờ là tsconfig của khoá (strict, bài 0.3) trên cùng tệp đó:</p>
${ra(OUT['16-strict'])}
<p>Bốn lỗi, bốn dòng, trước khi bất cứ thứ gì chạy. tsc có khó tính quá không? Chạy các hàm trên ba dòng thật của <code>TODAY</code> rồi nhìn:</p>
${ma('typescript', CODE.runAll)}
${ra(OUT['17-run-all'])}
${BANG_VI}
<p>Ba lần sập, lần nào cũng chỉ khi đúng dòng dữ liệu đó chạm đúng dòng code đó, và một <code>null</code> im lặng làm hỏng code người khác về sau — cả bốn đều đã là dòng đỏ trong tsc. <code>strictNullChecks</code> nằm trong <code>strict: true</code> (TypeScript 7 bật sẵn): lý do tốt nhất để không bao giờ tắt strict.</p>

<h3>Ba cách sửa: kiểm trước, <code>?.</code>, <code>??</code></h3>
${ma('typescript', FIX_BODY)}
${ra(OUT['18-fix-tsc'])}
${ra(OUT['18-fix-run'])}
<ul>
<li><strong>Kiểm trước.</strong> Sau <code>if (e.note === null) return '';</code> tsc biết ở dòng kế tiếp <code>e.note</code> chỉ có thể là <code>string</code>. Việc này gọi là <strong>narrowing (thu hẹp kiểu)</strong> — Chương 5 dành trọn cho nó.</li>
<li><strong><code>?.</code> optional chaining (chuỗi tuỳ chọn)</strong>: <code>a?.b</code> dừng và trả <code>undefined</code> nếu <code>a</code> là null/undefined — nên <code>cancelledOn</code> giờ trả <code>string | undefined</code>, và đến lượt chỗ gọi nó bị kiểm.</li>
<li><strong><code>??</code> nullish coalescing (gộp giá trị rỗng)</strong>: <code>a ?? b</code> chỉ cho ra <code>b</code> khi <code>a</code> là <code>null</code> hoặc <code>undefined</code>. <code>bookerOf</code> quyết định lượt đặt không tồn tại thì hiện <code>'(unknown)'</code>.</li>
</ul>
<p>Còn <code>findEntry(…)!.bookedBy</code>? Dấu <code>!</code> chỉ bảo tsc “tin tôi đi” — bài 1.2 đã cho thấy nó dẫn tới đúng lần sập đó, không cảnh báo. Lab 2 cấm nó.</p>

<h3>🗺 NULL đến từ đâu, và tsc chặn nó ở đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">CSDL</div><div class="lz-d">cột note cho phép NULL</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">JSON / API</div><div class="lz-d">"note": null đi qua; khoá undefined biến mất</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Kiểu của bạn</div><div class="lz-d">note: string | null — nói thật</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">tsc (strict)</div><div class="lz-d">TS18047 cho tới khi mọi chỗ dùng đều kiểm trước</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Màn hình</div><div class="lz-d">hiện "(no note)" thay vì sập</div></div>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — dùng <code>||</code> thay cho <code>??</code>: biên dịch được, và sai.</strong> <code>capacity</code> của một phòng là <code>null</code> khi chưa ai ghi nhận (dùng mặc định 40) và là <code>0</code> khi phòng đang bảo trì. Ghi chú có thể là <code>null</code> (không có ghi chú) hoặc <code>''</code> (một ghi chú rỗng ai đó đã lưu):</p>
${ma('typescript', CODE.orLab)}
${ra(OUT['20-or-tsc'])}
<p>tsc im lặng: <code>||</code> hoàn toàn hợp lệ với các kiểu này. Bộ test thì không:</p>
${ra(OR_TEST)}
<p><code>a || b</code> thay mọi giá trị <strong>falsy (coi như false)</strong> — <code>0</code>, <code>''</code>, <code>false</code>, <code>NaN</code>, <code>null</code>, <code>undefined</code>. Thế là phòng đang bảo trì có 40 chỗ và sinh viên đặt trúng phòng đang sửa. <code>??</code> chỉ thay <code>null</code> và <code>undefined</code>:</p>
${ma('typescript', OR_DIFF)}
${ra(FIXED_TEST)}
<p>Kiểu cho bạn biết một giá trị <em>có thể</em> null; nó không cho biết giá trị mặc định nào là đúng. Đó là logic nghiệp vụ, và chỉ một test với giá trị biên <code>0</code> và <code>''</code> mới nhận ra.</p>
</div>

<h3>Khi nào dùng cái nào</h3>
${DUNG_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“API dùng null hay undefined?”</strong> <code>undefined</code> = “không có”, biến mất khỏi JSON; <code>null</code> = “có, cố ý để trống”, đi qua JSON được. Cột cho phép NULL thành <code>T | null</code>, trường tuỳ chọn thành <code>key?: T</code>. <strong>“strictNullChecks làm gì?”</strong> Nó gỡ null và undefined khỏi mọi kiểu trừ khi bạn viết ra, nhờ đó tsc ép mỗi chỗ dùng phải kiểm trước — đưa ra TS18047 và lần sập nó ngăn được.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p><code>demo2/ts-02-1/practice/start/label.ts</code> dựng nhãn một dòng cho một dòng lịch. Nó đỏ dưới strict, và Node sập ngay dòng dữ liệu đầu tiên:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['22-pr-start'])}
${ra(PR_START_RUN)}
<ol>
<li>Đọc hai lỗi: dòng nào, giá trị nào, null hay undefined?</li>
<li>Sửa <code>labelOf</code> cho biên dịch được dưới strict mà <strong>không</strong> dùng <code>!</code>, <code>as</code> hay <code>any</code>: không có ghi chú thì hiện “(no note)”, lượt đặt chưa từng bị huỷ thì không hiện gì sau ghi chú.</li>
<li>Chạy lại tsc và Node.</li>
</ol>
<p><strong>Lời giải và output thật.</strong> Kiểm từng giá trị có-thể-thiếu ngay chỗ dùng nó; toán tử <code>? :</code> thu hẹp kiểu y như <code>if</code>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['23-pr-sol'])}
<p><strong>Đạt khi:</strong> tsc không in gì và Node in hai nhãn như trên. Code Lab có thêm bốn bài: trường có thể thiếu, <code>findEntry</code> trung thực, <code>||</code> hay <code>??</code>, id bigint trong JSON.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">primitive (giá trị nguyên thuỷ)</span><span class="v">Giá trị đơn giản, không phải object: string, number, boolean, bigint, symbol, null, undefined.</span></div>
  <div class="kv"><span class="k">strictNullChecks</span><span class="v">Một phần của strict: null và undefined chỉ thuộc một kiểu khi bạn viết chúng ra.</span></div>
  <div class="kv"><span class="k">optional property (thuộc tính tuỳ chọn)</span><span class="v"><code>key?: T</code> — khoá có thể vắng mặt; đọc nó có thể ra undefined.</span></div>
  <div class="kv"><span class="k">narrowing (thu hẹp kiểu)</span><span class="v">Sau một phép kiểm như <code>=== null</code>, tsc dùng kiểu hẹp hơn ở các dòng sau.</span></div>
  <div class="kv"><span class="k">optional chaining <code>?.</code> (chuỗi tuỳ chọn)</span><span class="v">Dừng lại và trả undefined nếu vế trái là null hoặc undefined.</span></div>
  <div class="kv"><span class="k">nullish coalescing <code>??</code> (gộp giá trị rỗng)</span><span class="v">Giá trị mặc định chỉ cho null/undefined — khác <code>||</code>, thứ còn thay cả 0, '' và false.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bảy primitive, luôn viết thường: <code>string</code>, <code>number</code>, <code>boolean</code>, <code>bigint</code>, <code>symbol</code>, <code>null</code>, <code>undefined</code>. <code>String</code> là object bọc ngoài (TS2322 báo cho bạn).</li>
<li><code>typeof null</code> là <code>"object"</code>; lúc chạy bạn chỉ có <code>typeof</code>, và nó biết ít hơn tsc rất nhiều.</li>
<li><code>: number</code> không sửa được độ chính xác: <code>0.1 + 0.2</code>, id trên 2^53, bigint trong JSON. Giữ id lớn ở dạng <code>bigint</code>/<code>string</code>.</li>
<li><code>| null</code> = có mặt nhưng trống, <code>?:</code> = có thể vắng mặt. Strict tắt, cùng tệp đó 0 lỗi và sập 3 lần; strict bật, nó có 4 lỗi (TS18047, TS18048, TS2532, TS2322).</li>
<li>Sửa bằng phép kiểm, <code>?.</code> hoặc <code>??</code> — không bằng <code>!</code>. Và ưu tiên <code>??</code> hơn <code>||</code>: <code>||</code> biến 0 chỗ của phòng đang bảo trì thành 40, và chỉ test nhìn thấy.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Everyday Types', 'Primitive, quy tắc viết thường (string vs String), null và undefined, thuộc tính tuỳ chọn, khẳng định non-null. Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')}
${nguon('⚙️', 'Tra cứu TSConfig — strictNullChecks', 'Điều gì thay đổi khi bật hay tắt tuỳ chọn này, kèm ví dụ find(). Đọc ngày 1/11/2026.', 'https://www.typescriptlang.org/tsconfig/strictNullChecks.html')}
${nguon('📗', 'MDN — Toán tử nullish coalescing (??)', 'Vì sao ?? khác || với 0, chuỗi rỗng và false. Đọc ngày 1/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing')}
${nguon('📗', 'MDN — BigInt', 'Số nguyên vượt 2^53, không trộn với number, mặc định không chuyển được sang JSON. Đọc ngày 1/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-4-2-select-where', title: 'NULL ở phía CSDL — PostgreSQL 4.2: SELECT &amp; WHERE', sub: 'Giống: NULL nghĩa là “không có giá trị”, và phải xử lý tường minh, không thì dòng (hay màn hình) lặng lẽ sai. Khác: SQL xử lý nó lúc truy vấn bằng IS NULL và logic ba giá trị; ở đây cột đó đến dưới dạng string | null và tsc từ chối mọi chỗ dùng không kiểm trước.', cta: 'MỞ BÀI POSTGRESQL →' })}
</div>
`,
};
