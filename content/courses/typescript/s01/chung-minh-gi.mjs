/**
 * TypeScript · Chương 1 · 1.2 — Trình kiểm tra kiểu chứng minh được gì — và không được gì. Slug giữ từ bản cũ: typescript-1-2-chung-minh-gi.
 * Mọi code/output lấy từ ./_ma-ts-01-2.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2, demo1/ts-01-2/, 01/11/2026).
 */
import G from '../giang/ts-01-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-01-2.mjs';

const BOOKING_TYPES = CODE.booking.split('\n').slice(9, 21).join('\n');
const SLOT_BUG = CODE.slot.split('\n').slice(4, 13).join('\n');
const LOGIC = OUT['42-logic-test'].split('\n').filter((l) => !/^\s+at |^\s+(generatedMessage|code|actual|expected|operator|diff):|^ℹ (suites|cancelled|skipped|todo|duration_ms)/.test(l)).join('\n');
const LABS_RUN = OUT['33-chi-so-run'].split('\n').filter((l) => !/^\s+at /.test(l)).join('\n');
const NN_RUN = OUT['35-non-null-run'].split('\n').filter((l) => !/^\s+at /.test(l)).join('\n');

const GHEP_1 = OUT['21-bien-tsc'] + '\n' + OUT['22-bien-run'];
const GHEP_2 = OUT['34-lo-hong-tsc'] + '\n' + OUT['36-any-run'];
const GHEP_3 = OUT['41-logic-tsc'] + '\n' + LOGIC;
const GHEP_4 = OUT['62-th-tsc'] + '\n' + OUT['63-th-run'];

const BANG_EN = `<table>
<thead><tr><th>Mistake</th><th>tsc (types)</th><th>A test</th><th>A runtime check at the boundary</th></tr></thead>
<tbody>
<tr><td>An old caller after a signature change</td><td>✅ every caller, in every file, at once</td><td>only callers that some test executes</td><td>—</td></tr>
<tr><td>A request body with the wrong shape</td><td>❌ believes the annotation</td><td>❌ unless a test sends that body</td><td>✅ that is its job</td></tr>
<tr><td>Reading past the end of an array</td><td>✅ with <code>noUncheckedIndexedAccess</code></td><td>only if tested</td><td>—</td></tr>
<tr><td>An <code>as</code>, <code>!</code> or <code>any</code> that lies</td><td>❌ trusts you</td><td>only if tested</td><td>✅ if it checks the value instead</td></tr>
<tr><td>Off-by-one: <code>&lt;</code> instead of <code>&lt;=</code></td><td>❌ both are booleans</td><td>✅ a boundary-value test</td><td>—</td></tr>
</tbody></table>`;
const BANG_VI = `<table>
<thead><tr><th>Lỗi</th><th>tsc (kiểu)</th><th>Một test</th><th>Phép kiểm lúc chạy ở biên</th></tr></thead>
<tbody>
<tr><td>Chỗ gọi cũ sau khi đổi chữ ký hàm</td><td>✅ mọi chỗ gọi, mọi tệp, cùng lúc</td><td>chỉ chỗ gọi mà có test chạy qua</td><td>—</td></tr>
<tr><td>Thân request sai dạng</td><td>❌ tin chú thích kiểu</td><td>❌ trừ khi có test gửi đúng body đó</td><td>✅ đúng việc của nó</td></tr>
<tr><td>Đọc quá cuối mảng</td><td>✅ khi bật <code>noUncheckedIndexedAccess</code></td><td>chỉ khi có test</td><td>—</td></tr>
<tr><td><code>as</code>, <code>!</code> hay <code>any</code> nói dối</td><td>❌ tin bạn</td><td>chỉ khi có test</td><td>✅ nếu nó kiểm giá trị thật</td></tr>
<tr><td>Lệch một: <code>&lt;</code> thay vì <code>&lt;=</code></td><td>❌ cả hai đều là boolean</td><td>✅ test giá trị biên</td><td>—</td></tr>
</tbody></table>`;

const NGUON_EN = [
  nguon('📘', 'TypeScript Handbook — Narrowing: using type predicates', 'The official explanation of “x is Type” return types and the in / typeof checks used in this lesson’s guard. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html'),
  nguon('⚙️', 'TSConfig reference — noUncheckedIndexedAccess', 'What the flag adds to index reads and why it is off unless you turn it on. Read 1 Nov 2026.', 'https://www.typescriptlang.org/tsconfig/noUncheckedIndexedAccess.html'),
  nguon('📗', 'MDN — JSON.parse()', 'What JSON.parse really returns: whatever the text describes, with no idea of your types. Read 1 Nov 2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse'),
].join('\n');
const NGUON_VI = [
  nguon('📘', 'TypeScript Handbook — Narrowing: dùng type predicate', 'Giải thích chính thức về kiểu trả về “x is Type” và các phép kiểm in / typeof mà guard trong bài dùng. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html'),
  nguon('⚙️', 'Tham chiếu TSConfig — noUncheckedIndexedAccess', 'Cờ này thêm gì vào phép đọc theo chỉ số, và vì sao mặc định nó tắt. Đọc ngày 01/11/2026.', 'https://www.typescriptlang.org/tsconfig/noUncheckedIndexedAccess.html'),
  nguon('📗', 'MDN — JSON.parse()', 'JSON.parse thật sự trả về gì: thứ mà đoạn chữ mô tả, hoàn toàn không biết kiểu của bạn. Đọc ngày 01/11/2026.', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse'),
].join('\n');

export default {
  title: '1.2 — What a type checker proves — and what it cannot|||1.2 — Trình kiểm tra kiểu chứng minh được gì — và không được gì',
  slug: 'typescript-1-2-chung-minh-gi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ranh giới của bảo đảm: tsc chứng minh mọi chỗ gọi khớp khai báo (đổi chữ ký ⇒ mọi tệp đỏ), nhưng tin JSON.parse/as với thân request ("31" ⇒ RangeError, "lecturer" ⇒ âm thầm PENDING); ba lỗ hổng tự mở (arr[i] với noUncheckedIndexedAccess, dấu !, any ⇒ 311); logic sai vẫn biên dịch (e < s, test bắt); bảng kiểu vs test; type guard x is BookingInput ở biên, và bẫy guard cũng chỉ là lời hứa.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>What a type checker proves — and what it cannot</h2>
<p class="lead">After this lesson you can say precisely what “it compiles” guarantees about LabFlow, point to the three places where you can switch that guarantee off without noticing, and put a small runtime check at the edge of your program so that data from outside cannot sneak past the types. This is the line between developers who trust TypeScript blindly and developers who use it well — and it is a favourite interview question: <em>“Does TypeScript make my app type-safe at runtime?”</em></p>

<h3>Why this matters before you write more types</h3>
<p>Lesson 1.1 showed <code>tsc</code> catching LabFlow bugs before anything ran. It is tempting to conclude “once it compiles, the types are true”. Half right: the compiler proves something real, but only about the code it can read. A request body, a file, an environment variable or a database row arrives while the program is <em>running</em>, after the types were erased (lesson 0.4). Miss that line and you will ship code that compiles cleanly and still crashes — or quietly computes the wrong answer.</p>

<h3>What tsc proves: every caller agrees with every declaration</h3>
<p>Imagine the team decides <code>needsApproval</code> should take one object instead of two separate arguments. One person edits the function. Two other files — the booking form and the monthly report (<code>countPending</code> calls <code>needsApproval(seats, 'STUDENT')</code>) — still call it the old way:</p>
${ma('typescript', CODE.approval)}
${ma('typescript', CODE.form)}
<p>Ask the compiler to check the folder (nothing is executed):</p>
${ra(OUT['11-hop-dong'])}
<p>Both stale callers, in two files, with line, column and <code>TS2554</code>. In plain JavaScript you would find the report bug the day someone opens the monthly report. This is the real guarantee: <strong>inside the code it can read, every use of a function, object and property agrees with its declaration</strong> — which is why large refactors are safe in TypeScript and frightening in JavaScript.</p>

<h3>What it cannot see: data that arrives from outside</h3>
<p>Here is the type LabFlow uses for a booking request, from <code>src/rules/booking.ts</code>:</p>
${ma('typescript', BOOKING_TYPES)}
<p>A web API receives the request body as <strong>text</strong>. The obvious first version of a handler parses it and annotates the result:</p>
${ma('typescript', CODE.handler)}
${ma('typescript', CODE.bodies)}
${ma('typescript', CODE.run)}
${ra(GHEP_1)}
<p>The first command is <code>tsc</code>: no output and exit code 0 — not a single error. The second runs three bodies a browser or Postman could really send:</p>
<ul>
<li><strong>correct</strong> — a lecturer booking 31 seats is <code>CONFIRMED</code>, as the rules say.</li>
<li><strong>seats="31"</strong> — the number arrives as a <em>string</em>; <code>Number.isInteger(seats)</code> fails at runtime. “got 31” looks fine because a string prints like a number — an afternoon-long bug.</li>
<li><strong>lecturer</strong> — the worst: no error. Lowercase role ⇒ <code>role === 'LECTURER'</code> is false ⇒ treated as a student ⇒ <code>PENDING</code>. A 200 response with a wrong business decision.</li>
</ul>
<p>Why did <code>tsc</code> accept it? Because <code>JSON.parse</code> is declared to return <code>any</code> — “I don’t know, don’t check”. An <code>any</code> may be assigned to anything, so the annotation <code>BookingInput</code> is accepted as a <em>claim</em>, never verified. And at runtime there is no <code>BookingInput</code> left to verify against: the type was erased.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — “as” is a promise, not a conversion.</strong> Many beginners rewrite the line with <code>as</code>, believing it converts or checks the value:</p>
${ma('typescript', CODE.handlerAs)}
${ra(OUT['23-bien-as-run'])}
<p>Exactly the same three results. A type assertion (<code>as</code>) is removed by the compiler and produces no runtime code; it only says what to <em>believe</em>. Use it when you know more than the compiler about a value <em>you created</em> (Chapter 2: <code>as const</code>), never to “turn” outside data into a type.</p>
</div>

<h3>Three holes you open yourself</h3>
<p>Outside data is a hole you cannot avoid; these three you open yourself — each compiles, then fails at runtime.</p>
<p><strong>Hole 1 — reading past the end of an array.</strong> LabFlow has three labs; this code reads the sixth:</p>
${ma('typescript', CODE.labs)}
${ra(OUT['31-chi-so-on'])}
<p>Our course tsconfig turns on <code>noUncheckedIndexedAccess</code>, so <code>labs[5]</code> has type <code>string | undefined</code> and the compiler refuses <code>.toUpperCase()</code> with <code>TS18048</code>. Now compile the same file with that one flag switched off:</p>
${ma('json', CODE.tatCo)}
${ra(OUT['32-chi-so-off'])}
${ra(LABS_RUN)}
<p>Silent compile, then a crash in Node: <em>Cannot read properties of undefined</em>. Without the flag TypeScript assumes every index exists. It costs a little typing (you must handle <code>undefined</code>) and removes one of JavaScript’s most common runtime errors; <code>tsc --init</code> in TypeScript 7 writes it into new projects, and this course keeps it on.</p>
<p><strong>Hole 2 — the non-null assertion “!”.</strong> One character after an expression tells the compiler “this is not undefined, trust me”:</p>
${ma('typescript', CODE.nonNull)}
${ra(NN_RUN)}
<p><strong>Hole 3 — any.</strong> A value typed <code>any</code> is not checked anywhere it flows:</p>
${ma('typescript', CODE.anyTs)}
${ra(GHEP_2)}
<p><code>tsc</code> reports zero errors for the whole folder. The <code>!</code> version crashes like the flag-off version; the <code>any</code> version is worse — no crash, the “number” is the string <code>"31"</code>, and <code>seats + 1</code> is <code>"311"</code>. Lesson 1.4 is entirely about <code>any</code> and its safe alternative <code>unknown</code>.</p>

<h3>Wrong logic compiles — that is what tests are for</h3>
<p>Types describe <em>shapes</em> (a string, a number, an object with these fields). They do not describe <em>meaning</em>. Here is <code>checkSlot</code> with one character changed — <code>e &lt; s</code> instead of <code>e &lt;= s</code>:</p>
${ma('typescript', SLOT_BUG)}
${ma('typescript', CODE.slotTest)}
${ra(GHEP_3)}
<p><code>tsc</code> is green: both comparisons produce a boolean, so every type is right. The boundary-value test (09:00 to 09:00, a zero-length slot) is red and shows exactly what happened: <code>{ ok: true, minutes: 0 }</code> instead of <code>END_BEFORE_START</code>. TypeScript removes the tests that would only say “this argument is a string”; it removes <strong>none</strong> of the tests that say “this function computes the right answer”.</p>

<h3>Types, tests, runtime checks: who catches what</h3>
${BANG_EN}
<p>Read it by rows. A real codebase needs all three layers: types for consistency, tests for logic, and a runtime check wherever data crosses into the program.</p>

<h3>The fix at the boundary: a type guard</h3>
<p>The honest type for data you have not checked yet is <code>unknown</code> — “I do not know what this is”. TypeScript will not let you use an <code>unknown</code> value until you prove what it is. Try passing it straight to <code>createBooking</code>:</p>
${ma('typescript', CODE.bienSai)}
${ra(OUT['24-bien-sai'])}
<p>Refused with <code>TS2345</code>. That refusal is the point: <code>unknown</code> forces the check that <code>any</code> lets you skip. The check itself is a <strong>type guard</strong> — an ordinary function, written in ordinary JavaScript that really runs, with a special return type:</p>
${ma('typescript', CODE.guard)}
<ul>
<li><code>x: unknown</code> — the input can be anything at all.</li>
<li><code>x is BookingInput</code> — a <em>type predicate</em>: “if this function returns true, treat <code>x</code> as a <code>BookingInput</code> afterwards”.</li>
<li>Inside, each <code>typeof</code> and <code>in</code> check runs at runtime and, at the same time, narrows the type for the next line (Chapter 5 explains narrowing in depth).</li>
</ul>
${ma('typescript', CODE.handlerSafe)}
${ma('typescript', CODE.runSafe)}
${ra(OUT['51-safe-run'])}
<p>The same three bodies now produce one booking and two clean <code>INVALID_BODY</code> answers — no crash, no silent lie. Inside the <code>if</code>, <code>data</code> really is a <code>BookingInput</code>, so from here on the compiler’s proof is true again. In Chapter 11 this answer becomes an HTTP 400, and in Chapter 13 a single Zod schema replaces the hand-written guard.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — the guard itself is trusted.</strong> The compiler checks that your guard returns a boolean. It does <em>not</em> check that the guard checks every field. This version forgot <code>role</code>:</p>
${ma('typescript', CODE.guardThieu)}
${ra(OUT['53-thieu-run'])}
<p><code>"lecturer"</code> walks straight back in. <code>x is BookingInput</code> is one more promise, just like <code>as</code>. Keep guards small, test them with bad bodies, and prefer one schema that is both the check and the type (Chapter 13).</p>
</div>

<h3>🗺 Where the guarantee starts</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Outside</div><div class="lz-d">request body, file, env, database row — just data</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">JSON.parse → unknown</div><div class="lz-d">honest type: “not checked yet”</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Guard (runtime)</div><div class="lz-d">real checks; bad data stops here</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Typed inside</div><div class="lz-d">tsc’s proof is now true</div></div>
</div>

<h3>💼 Interview corner</h3>
<p><strong>Q: “Does TypeScript make my application type-safe at runtime?”</strong> A weak answer: “Yes, that is what types are for.” A strong answer: “No. It proves consistency between the files it compiles, then erases the types. Runtime input is only as correct as my annotation, and <code>as</code>/<code>!</code>/<code>any</code> are places where I take responsibility. So I validate at the boundary (guard or Zod), keep <code>noUncheckedIndexedAccess</code> on, and keep tests for logic.”</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>LabFlow’s report endpoint receives a JSON list of bookings and passes it to <code>usageRate</code>. Today it does this:</p>
${ma('typescript', CODE.noGuard)}
${ra(OUT['61-th-no-guard'])}
<ol>
<li>Explain why <code>tsc</code> accepts this file and why the result is <code>NaN</code>.</li>
<li>In <code>demo1/ts-01-2/thuc-hanh/minutes-guard.ts</code>, write <code>isMinutesList(x: unknown): x is { minutes: number }[]</code> — an array whose every element is an object with a positive number <code>minutes</code>.</li>
<li>Write <code>rateFromBody(body: string)</code> that returns the rate, or <code>'INVALID_BODY'</code>.</li>
<li>Check four bodies: a good list, a list with <code>"60"</code> as a string, a list with the typo <code>minute</code>, and a single object instead of a list.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('typescript', CODE.thGuard)}
${ma('typescript', CODE.thRun)}
${ra(GHEP_4)}
<p><strong>Done when:</strong> <code>npx tsc -p demo1/ts-01-2/thuc-hanh</code> prints nothing (0 errors); the good list prints <code>0.21428571428571427</code> (180 of 840 opening minutes); the other three print <code>INVALID_BODY</code>; and you can say in one sentence why <code>JSON.parse(body)</code> passed straight into <code>usageRate</code> compiled.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">boundary</span><span class="v">The place where data enters your program from outside (HTTP, files, env, database). Types cannot see past it.</span></div>
  <div class="kv"><span class="k">type assertion (as)</span><span class="v">Tells the compiler what to believe. Erased at runtime; checks nothing.</span></div>
  <div class="kv"><span class="k">non-null assertion (!)</span><span class="v">“This is not null/undefined, trust me.” Erased; checks nothing.</span></div>
  <div class="kv"><span class="k">unknown</span><span class="v">The safe “not checked yet” type: you must prove what it is before using it.</span></div>
  <div class="kv"><span class="k">type guard / type predicate</span><span class="v">A function returning <code>x is T</code>: real runtime checks; when it returns true, x is treated as T.</span></div>
  <div class="kv"><span class="k">noUncheckedIndexedAccess</span><span class="v">tsconfig flag: <code>arr[i]</code> becomes <code>T | undefined</code>, so reading past the end is caught.</span></div>
  <div class="kv"><span class="k">TS2554 · TS2345 · TS18048</span><span class="v">Wrong number of arguments · argument of the wrong type · value possibly undefined.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>tsc</code> proves consistency between the files it reads: change a signature and every caller lights up at once.</li>
<li>It cannot see runtime data. <code>JSON.parse</code> returns <code>any</code>, so a wrong body compiles — then crashes (<code>"31"</code>) or silently lies (<code>"lecturer"</code>).</li>
<li><code>as</code>, <code>!</code> and <code>any</code> are promises you make; the compiler trusts them and the runtime does not check them.</li>
<li>Keep <code>noUncheckedIndexedAccess</code> on: it turns “index past the end” into a compile error.</li>
<li>Wrong logic has the right types; tests (boundary values) catch it.</li>
<li>Parse outside data into <code>unknown</code>, check it with a type guard, then the inside is genuinely proven — and remember the guard is trusted too.</li>
</ul>

<h3>📚 Sources</h3>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-2-2-validation', title: 'Also in API Design — 2.2: Validating input at the edge', sub: 'Same: never trust a request body — LabFlow is attacked with wrong types, unknown fields and impossible dates. Different: there you check the door at runtime with a Zod 4 schema and answer 400/415/422; here you see why the TypeScript type alone could never do that job.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Trình kiểm tra kiểu chứng minh được gì — và không được gì</h2>
<p class="lead">Học xong bài này bạn nói được chính xác câu “biên dịch qua rồi” bảo đảm điều gì cho LabFlow, chỉ ra ba chỗ bạn có thể tắt bảo đảm đó mà không hề hay biết, và đặt một phép kiểm nhỏ lúc chạy ở mép chương trình để dữ liệu từ ngoài không lách qua được lớp kiểu. Đây là ranh giới giữa người tin TypeScript mù quáng và người dùng nó giỏi — và cũng là câu phỏng vấn rất hay gặp: <em>“TypeScript có làm ứng dụng của tôi an toàn kiểu lúc chạy không?”</em></p>

<h3>Vì sao phải biết điều này trước khi viết thêm kiểu</h3>
<p>Bài 1.1 cho thấy <code>tsc</code> bắt bug của LabFlow trước khi chạy bất cứ thứ gì. Rất dễ kết luận “đã biên dịch qua thì kiểu là thật”. Đúng một nửa: trình biên dịch chứng minh một điều có thật, nhưng chỉ về phần code nó đọc được. Thân request, tệp, biến môi trường hay một dòng CSDL tới lúc chương trình <em>đang chạy</em>, khi kiểu đã bị xoá (bài 0.4). Không thấy ranh giới này, có ngày bạn đưa lên code biên dịch sạch mà vẫn sập — hoặc âm thầm tính sai.</p>

<h3>tsc chứng minh được gì: mọi chỗ gọi khớp với mọi khai báo</h3>
<p>Giả sử cả nhóm quyết định <code>needsApproval</code> nhận một object thay vì hai tham số riêng. Một người sửa hàm. Hai tệp khác — form đặt phòng và báo cáo tháng (<code>countPending</code> gọi <code>needsApproval(seats, 'STUDENT')</code>) — vẫn gọi kiểu cũ:</p>
${ma('typescript', CODE.approval)}
${ma('typescript', CODE.form)}
<p>Nhờ trình biên dịch kiểm cả thư mục (không chạy gì cả):</p>
${ra(OUT['11-hop-dong'])}
<p>Cả hai chỗ gọi lỗi thời, ở hai tệp, kèm dòng, cột và mã <code>TS2554</code> (cần 1 tham số mà nhận 2). Với JavaScript thuần, bạn chỉ thấy lỗi báo cáo vào ngày có người mở báo cáo tháng. Đây là bảo đảm thật: <strong>trong phần code nó đọc được, mọi chỗ dùng một hàm, object, thuộc tính đều khớp với khai báo</strong> — vì thế refactor lớn trong TypeScript thì an toàn, còn trong JavaScript thì đáng sợ.</p>

<h3>Nó không thấy được gì: dữ liệu đến từ bên ngoài</h3>
<p>Đây là kiểu LabFlow dùng cho một yêu cầu đặt phòng, trong <code>src/rules/booking.ts</code>:</p>
${ma('typescript', BOOKING_TYPES)}
<p>Một API web nhận thân request dưới dạng <strong>chữ</strong>. Bản handler đầu tiên ai cũng nghĩ ra là parse rồi gắn kiểu cho kết quả:</p>
${ma('typescript', CODE.handler)}
${ma('typescript', CODE.bodies)}
${ma('typescript', CODE.run)}
${ra(GHEP_1)}
<p>Lệnh thứ nhất là <code>tsc</code>: không in gì, mã thoát 0 — không một lỗi nào. Lệnh thứ hai chạy ba body mà trình duyệt hay Postman hoàn toàn có thể gửi:</p>
<ul>
<li><strong>correct</strong> — giảng viên đặt 31 chỗ được <code>CONFIRMED</code>, đúng luật.</li>
<li><strong>seats="31"</strong> — con số tới dưới dạng <em>chuỗi</em>; <code>Number.isInteger(seats)</code> sai lúc chạy. “got 31” trông bình thường vì chuỗi in ra giống số — loại bug tốn cả buổi chiều.</li>
<li><strong>lecturer</strong> — tệ nhất: không lỗi gì. Vai trò viết thường ⇒ <code>role === 'LECTURER'</code> sai ⇒ bị coi như sinh viên ⇒ <code>PENDING</code>. Trả 200 kèm một quyết định nghiệp vụ sai.</li>
</ul>
<p>Vì sao <code>tsc</code> chấp nhận? Vì <code>JSON.parse</code> được khai báo là trả về <code>any</code> — “không biết, đừng kiểm”. Giá trị <code>any</code> gán được vào mọi thứ, nên chú thích <code>BookingInput</code> được nhận như một <em>lời khai</em>, không bao giờ được kiểm. Và lúc chạy cũng chẳng còn <code>BookingInput</code> nào để mà so: kiểu đã bị xoá.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — “as” là một lời hứa, không phải phép chuyển đổi.</strong> Nhiều bạn mới viết lại dòng đó bằng <code>as</code>, tưởng nó sẽ đổi hoặc kiểm giá trị:</p>
${ma('typescript', CODE.handlerAs)}
${ra(OUT['23-bien-as-run'])}
<p>Y hệt ba kết quả cũ. Type assertion (<code>as</code> — ép kiểu khai báo) bị trình biên dịch xoá, không sinh dòng code nào lúc chạy; nó chỉ nói trình biên dịch nên <em>tin</em> gì. Dùng khi bạn biết rõ hơn trình biên dịch về giá trị <em>do chính bạn tạo</em> (Chương 2: <code>as const</code>), không bao giờ để “biến” dữ liệu từ ngoài thành một kiểu.</p>
</div>

<h3>Ba lỗ hổng do chính bạn mở</h3>
<p>Dữ liệu từ ngoài là lỗ không tránh được; ba lỗ dưới đây do bạn tự mở — cái nào cũng biên dịch qua rồi hỏng lúc chạy.</p>
<p><strong>Lỗ 1 — đọc quá cuối mảng.</strong> LabFlow có ba phòng; đoạn code này đọc phòng thứ sáu:</p>
${ma('typescript', CODE.labs)}
${ra(OUT['31-chi-so-on'])}
<p>tsconfig của khoá bật <code>noUncheckedIndexedAccess</code>, nên <code>labs[5]</code> có kiểu <code>string | undefined</code> và trình biên dịch từ chối <code>.toUpperCase()</code> với <code>TS18048</code>. Giờ biên dịch đúng tệp đó với riêng cờ này bị tắt:</p>
${ma('json', CODE.tatCo)}
${ra(OUT['32-chi-so-off'])}
${ra(LABS_RUN)}
<p>Biên dịch im lặng, rồi sập trong Node: <em>Cannot read properties of undefined</em> (không đọc được thuộc tính của undefined). Không có cờ này, TypeScript giả định mọi chỉ số đều tồn tại. Đổi lại một chút gõ thêm (phải xử lý <code>undefined</code>), bạn loại được một trong những lỗi lúc chạy phổ biến nhất của JavaScript; <code>tsc --init</code> của TypeScript 7 đã ghi cờ này vào dự án mới, và khoá này luôn bật nó.</p>
<p><strong>Lỗ 2 — non-null assertion “!”.</strong> Một ký tự sau biểu thức bảo trình biên dịch “cái này không phải undefined, tin tôi đi”:</p>
${ma('typescript', CODE.nonNull)}
${ra(NN_RUN)}
<p><strong>Lỗ 3 — any.</strong> Giá trị kiểu <code>any</code> không bị kiểm ở bất cứ đâu nó chảy tới:</p>
${ma('typescript', CODE.anyTs)}
${ra(GHEP_2)}
<p><code>tsc</code> báo 0 lỗi cho cả thư mục. Bản có <code>!</code> sập y như bản tắt cờ; bản <code>any</code> còn tệ hơn — không sập, “con số” là chuỗi <code>"31"</code>, và <code>seats + 1</code> ra <code>"311"</code>. Bài 1.4 dành trọn cho <code>any</code> và phương án an toàn <code>unknown</code>.</p>

<h3>Logic sai vẫn biên dịch — đó là việc của test</h3>
<p>Kiểu mô tả <em>hình dạng</em> (một chuỗi, một số, một object có các trường này). Nó không mô tả <em>ý nghĩa</em>. Đây là <code>checkSlot</code> bị đổi đúng một ký tự — <code>e &lt; s</code> thay cho <code>e &lt;= s</code>:</p>
${ma('typescript', SLOT_BUG)}
${ma('typescript', CODE.slotTest)}
${ra(GHEP_3)}
<p><code>tsc</code> xanh: cả hai phép so sánh đều cho ra boolean, nên kiểu nào cũng đúng. Test giá trị biên (09:00 tới 09:00, khung dài 0 phút) đỏ và chỉ đúng chuyện gì xảy ra: <code>{ ok: true, minutes: 0 }</code> thay vì <code>END_BEFORE_START</code>. TypeScript thay được những test chỉ nói “tham số này là chuỗi”; nó <strong>không</strong> thay được test nào nói “hàm này tính ra đúng kết quả”.</p>

<h3>Kiểu, test, phép kiểm lúc chạy: ai bắt cái gì</h3>
${BANG_VI}
<p>Đọc theo từng hàng. Một codebase thật cần đủ ba lớp: kiểu cho sự nhất quán, test cho logic, và phép kiểm lúc chạy ở mọi chỗ dữ liệu đi vào chương trình.</p>

<h3>Sửa ở biên: một type guard</h3>
<p>Kiểu trung thực cho dữ liệu chưa kiểm là <code>unknown</code> — “tôi chưa biết đây là gì”. TypeScript không cho bạn dùng giá trị <code>unknown</code> cho tới khi bạn chứng minh nó là gì. Thử đưa thẳng nó vào <code>createBooking</code>:</p>
${ma('typescript', CODE.bienSai)}
${ra(OUT['24-bien-sai'])}
<p>Bị từ chối với <code>TS2345</code>. Lời từ chối đó chính là mục đích: <code>unknown</code> buộc bạn làm phép kiểm mà <code>any</code> cho bạn bỏ qua. Bản thân phép kiểm là một <strong>type guard (hàm canh kiểu)</strong> — một hàm bình thường, viết bằng JavaScript bình thường và thật sự chạy, chỉ có kiểu trả về đặc biệt:</p>
${ma('typescript', CODE.guard)}
<ul>
<li><code>x: unknown</code> — đầu vào có thể là bất cứ thứ gì.</li>
<li><code>x is BookingInput</code> — một <em>type predicate (vị từ kiểu)</em>: “nếu hàm trả về true, từ đó trở đi hãy coi <code>x</code> là <code>BookingInput</code>”.</li>
<li>Bên trong, mỗi phép kiểm <code>typeof</code> và <code>in</code> chạy thật lúc chạy, đồng thời thu hẹp kiểu cho dòng kế tiếp (Chương 5 giải thích thu hẹp kiểu kỹ hơn).</li>
</ul>
${ma('typescript', CODE.handlerSafe)}
${ma('typescript', CODE.runSafe)}
${ra(OUT['51-safe-run'])}
<p>Cùng ba body đó giờ cho một lượt đặt và hai câu trả lời <code>INVALID_BODY</code> gọn gàng — không sập, không âm thầm nói dối. Bên dưới câu <code>if</code>, <code>data</code> đúng thật là một <code>BookingInput</code>, nên từ đây chứng minh của trình biên dịch lại đúng. Ở Chương 11 câu trả lời này thành HTTP 400, và ở Chương 13 một schema Zod duy nhất thay cho guard viết tay.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — chính guard cũng được tin.</strong> Trình biên dịch kiểm guard của bạn trả về boolean. Nó <em>không</em> kiểm guard đã kiểm đủ mọi trường chưa. Bản này quên <code>role</code>:</p>
${ma('typescript', CODE.guardThieu)}
${ra(OUT['53-thieu-run'])}
<p><code>"lecturer"</code> lại đi thẳng vào. <code>x is BookingInput</code> cũng chỉ là một lời hứa nữa, y như <code>as</code>. Giữ guard nhỏ, test nó bằng các body sai, và ưu tiên một schema vừa là phép kiểm vừa là kiểu (Chương 13).</p>
</div>

<h3>🗺 Bảo đảm bắt đầu từ đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Bên ngoài</div><div class="lz-d">thân request, tệp, env, dòng CSDL — chỉ là dữ liệu</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">JSON.parse → unknown</div><div class="lz-d">kiểu trung thực: “chưa kiểm”</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Guard (lúc chạy)</div><div class="lz-d">kiểm thật; dữ liệu sai dừng ở đây</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Bên trong có kiểu</div><div class="lz-d">chứng minh của tsc giờ là thật</div></div>
</div>

<h3>💼 Góc phỏng vấn</h3>
<p><strong>Hỏi: “TypeScript có làm ứng dụng của bạn an toàn kiểu lúc chạy không?”</strong> Trả lời yếu: “Có, kiểu sinh ra để làm việc đó.” Trả lời mạnh: “Không. Nó chứng minh sự nhất quán giữa các tệp nó biên dịch, rồi xoá kiểu. Dữ liệu lúc chạy chỉ đúng bằng chú thích kiểu tôi gắn, và <code>as</code>/<code>!</code>/<code>any</code> là chỗ tôi tự nhận trách nhiệm. Nên tôi kiểm ở biên (guard hoặc Zod), luôn bật <code>noUncheckedIndexedAccess</code>, và giữ test cho logic.”</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Endpoint báo cáo của LabFlow nhận một danh sách lượt đặt dạng JSON rồi đưa vào <code>usageRate</code>. Hiện nó viết thế này:</p>
${ma('typescript', CODE.noGuard)}
${ra(OUT['61-th-no-guard'])}
<ol>
<li>Giải thích vì sao <code>tsc</code> chấp nhận tệp này và vì sao kết quả là <code>NaN</code>.</li>
<li>Trong <code>demo1/ts-01-2/thuc-hanh/minutes-guard.ts</code>, viết <code>isMinutesList(x: unknown): x is { minutes: number }[]</code> — một mảng mà mọi phần tử là object có <code>minutes</code> là số dương.</li>
<li>Viết <code>rateFromBody(body: string)</code> trả về tỉ lệ, hoặc <code>'INVALID_BODY'</code>.</li>
<li>Kiểm bốn body: một danh sách đúng, một danh sách có <code>"60"</code> là chuỗi, một danh sách gõ nhầm <code>minute</code>, và một object đơn thay vì danh sách.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('typescript', CODE.thGuard)}
${ma('typescript', CODE.thRun)}
${ra(GHEP_4)}
<p><strong>Đạt khi:</strong> <code>npx tsc -p demo1/ts-01-2/thuc-hanh</code> không in gì (0 lỗi); danh sách đúng in <code>0.21428571428571427</code> (180 trên 840 phút mở cửa); ba body còn lại in <code>INVALID_BODY</code>; và bạn nói được bằng một câu vì sao <code>JSON.parse(body)</code> đưa thẳng vào <code>usageRate</code> vẫn biên dịch qua.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">boundary (biên)</span><span class="v">Chỗ dữ liệu từ ngoài đi vào chương trình (HTTP, tệp, env, CSDL). Kiểu không nhìn xuyên qua được.</span></div>
  <div class="kv"><span class="k">type assertion — as (ép kiểu khai báo)</span><span class="v">Bảo trình biên dịch tin điều gì. Bị xoá lúc chạy; không kiểm gì.</span></div>
  <div class="kv"><span class="k">non-null assertion — ! (khẳng định khác null)</span><span class="v">“Cái này không null/undefined, tin tôi đi.” Bị xoá; không kiểm gì.</span></div>
  <div class="kv"><span class="k">unknown (chưa biết)</span><span class="v">Kiểu an toàn cho “chưa kiểm”: phải chứng minh nó là gì rồi mới được dùng.</span></div>
  <div class="kv"><span class="k">type guard / type predicate (hàm canh kiểu / vị từ kiểu)</span><span class="v">Hàm trả về <code>x is T</code>: kiểm thật lúc chạy; khi trả true, x được coi là T.</span></div>
  <div class="kv"><span class="k">noUncheckedIndexedAccess</span><span class="v">Cờ tsconfig: <code>arr[i]</code> thành <code>T | undefined</code>, nên đọc quá cuối mảng bị bắt.</span></div>
  <div class="kv"><span class="k">TS2554 · TS2345 · TS18048</span><span class="v">Sai số tham số · tham số sai kiểu · giá trị có thể là undefined.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>tsc</code> chứng minh sự nhất quán giữa các tệp nó đọc: đổi chữ ký hàm là mọi chỗ gọi cùng đỏ.</li>
<li>Nó không thấy dữ liệu lúc chạy. <code>JSON.parse</code> trả về <code>any</code>, nên body sai vẫn biên dịch — rồi sập (<code>"31"</code>) hoặc âm thầm nói dối (<code>"lecturer"</code>).</li>
<li><code>as</code>, <code>!</code> và <code>any</code> là lời hứa của bạn; trình biên dịch tin chúng, còn lúc chạy không ai kiểm.</li>
<li>Luôn bật <code>noUncheckedIndexedAccess</code>: nó biến “đọc quá cuối mảng” thành lỗi biên dịch.</li>
<li>Logic sai vẫn đúng kiểu; test (giá trị biên) mới bắt được.</li>
<li>Parse dữ liệu ngoài ra <code>unknown</code>, kiểm bằng type guard, khi đó bên trong mới thật sự được chứng minh — và nhớ rằng chính guard cũng được tin.</li>
</ul>

<h3>📚 Nguồn</h3>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-2-2-validation', title: 'Đã có ở API Design — 2.2: Kiểm dữ liệu ngay ở cửa', sub: 'Giống: không bao giờ tin thân request — LabFlow bị tấn công bằng sai kiểu, trường lạ, ngày không tồn tại. Khác: bên đó kiểm ở cửa lúc chạy bằng schema Zod 4 và trả 400/415/422; ở đây bạn thấy vì sao riêng kiểu TypeScript không bao giờ làm được việc đó.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
