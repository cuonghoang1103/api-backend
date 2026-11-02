/**
 * Bài 9.2 — Kiểu cơ bản (nâng cấp 02/11/2026). Output thật: _demo/_t9/chay.sh (tsc 5.9 --declaration in kiểu TypeScript TỰ SUY RA,
 * 5 lỗi kiểu cơ bản, any không báo gì mà vẫn sập khi chạy bằng Node 22.23, unknown buộc kiểm trước).
 * Deck: scripts/slides-src/wf-9-2.mjs (9 slide, WF/v1/wf-9-2). Code Lab: wf-9-2-basic-types.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-9-2', 'Basic types', 'Kiểu cơ bản', [
  [1, 'Basic types',
    '<p>Before interfaces and generics, you need the small pieces: string, number, boolean, arrays, null, unions of several types, and literal types. The good news is that you will write most of them rarely, because TypeScript works them out by itself. This lesson shows what it infers and where you must help.</p>',
    '<p>Trước interface và generic, bạn cần những mảnh nhỏ: string, number, boolean, mảng, null, union của nhiều kiểu, và kiểu literal. Tin vui là bạn hiếm khi phải viết chúng, vì TypeScript tự suy ra. Bài này cho thấy nó suy ra gì và chỗ nào bạn phải giúp nó.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to read and write the basic types, predict what TypeScript infers, use a union and narrow it with typeof, restrict a value to a few allowed strings, and explain why any is dangerous and unknown is the safe choice for data you do not trust.</p>',
    '<p>Bạn sẽ đọc và viết được các kiểu cơ bản, đoán được TypeScript suy ra gì, dùng một union và thu hẹp nó bằng typeof, giới hạn một giá trị vào vài chuỗi được phép, và giải thích vì sao any nguy hiểm còn unknown là lựa chọn an toàn cho dữ liệu bạn không tin.</p>'],
  [3, 'Inference',
    '<p>We asked the compiler to print the types it worked out. A let with a number became number. A const with a string became that exact string. Arrays, objects and the result of a function were all typed without a single annotation. Annotate parameters; let the rest be inferred.</p>',
    '<p>Ta nhờ trình biên dịch in ra các kiểu nó tự tính. Một let mang số thành number. Một const mang chuỗi thành đúng chuỗi đó. Mảng, object và kết quả của hàm đều có kiểu mà không cần chú thích nào. Hãy chú thích tham số; phần còn lại để nó suy ra.</p>'],
  [4, 'Five mistakes the basics catch',
    '<p>Assigning text to a number variable. Pushing a string into a number array. Calling a number method on something that might be text. Using a value outside a list of allowed strings. And doing arithmetic with undefined. All five are refused before the program runs.</p>',
    '<p>Gán chữ vào biến số. Đẩy chuỗi vào mảng số. Gọi hàm của số trên thứ có thể là chữ. Dùng giá trị ngoài danh sách chuỗi được phép. Và làm toán với undefined. Cả năm đều bị từ chối trước khi chương trình chạy.</p>'],
  [5, 'Unions and narrowing',
    '<p>A union says "one of these". Number or string means you may only use what both share. After you check with typeof inside an if, TypeScript knows which one you have and lets you use its methods. This is called narrowing.</p>',
    '<p>Union nghĩa là "một trong số này". Number hoặc string nghĩa là bạn chỉ dùng được thứ cả hai đều có. Sau khi bạn kiểm bằng typeof trong một if, TypeScript biết bạn đang cầm cái nào và cho dùng các hàm của nó. Việc này gọi là thu hẹp kiểu.</p>'],
  [6, 'Literal types',
    '<p>A type can be a list of exact values: ascending or descending. Any other string is an error, and the editor offers the allowed ones. Plain objects widen their strings to string; adding as const keeps the exact values and makes them read-only.</p>',
    '<p>Một kiểu có thể là danh sách giá trị chính xác: asc hoặc desc. Chuỗi nào khác là lỗi, và trình soạn thảo gợi ý những giá trị được phép. Object thường nới chuỗi thành string; thêm as const giữ đúng giá trị và biến chúng thành chỉ đọc.</p>'],
  [7, 'any switches checking off',
    '<p>With any, the compiler said nothing about reading a property that does not exist, and the program crashed when it ran. any spreads: everything you take from it is any too. Treat it as a hole in your type system.</p>',
    '<p>Với any, trình biên dịch không nói gì về việc đọc một thuộc tính không tồn tại, và chương trình sập khi chạy. any lây lan: mọi thứ lấy từ nó cũng là any. Hãy coi nó là một lỗ thủng trong hệ thống kiểu.</p>'],
  [8, 'unknown makes you check',
    '<p>unknown also accepts anything, but you cannot use it until you check what it is. The compiler refused to read a property, then accepted the same code once we tested that it was an object with a string title. Use unknown for JSON, errors and user input.</p>',
    '<p>unknown cũng nhận mọi thứ, nhưng bạn không dùng được nó cho tới khi kiểm nó là gì. Trình biên dịch từ chối đọc thuộc tính, rồi chấp nhận đúng đoạn mã đó khi ta đã kiểm nó là object có title kiểu chuỗi. Hãy dùng unknown cho JSON, lỗi và dữ liệu người dùng.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to predict the inferred type of ten declarations before checking them with the compiler, fix five type errors without any, and write a function that narrows a union. "Done when" checks your predictions and a clean tsc run.</p>',
    '<p>Bài luyện yêu cầu bạn đoán kiểu suy ra của mười khai báo trước khi kiểm bằng trình biên dịch, sửa năm lỗi kiểu mà không dùng any, và viết một hàm thu hẹp union. "Xong khi" kiểm các dự đoán và một lần chạy tsc sạch.</p>'],
]);

export default {
  title: '9.2 — Basic types, inference and unions|||9.2 — Kiểu cơ bản, suy luận kiểu và union',
  slug: 'wf-9-2-basic-types',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/d56mG7DezGs', durationSeconds: 0 },
  description: 'string/number/boolean/mảng/null; tsc --declaration in đúng các kiểu TypeScript tự suy ra (let vs const, mảng, object, hàm, as const); năm lỗi cơ bản tsc chặn; union và thu hẹp bằng typeof; kiểu literal \'asc\' | \'desc\'; any: tsc im lặng mà vẫn sập khi chạy (Node 22.23), unknown buộc kiểm trước.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Basic types — and why you will write fewer of them than you think</h2>
<p class="lead">After this lesson you can read and write TypeScript's basic types, predict what TypeScript infers without any annotation, use a union type and narrow it safely, restrict a value to a short list of allowed strings, and choose <code>unknown</code> over <code>any</code> for data you do not control. These are the building blocks of every interface in Lesson 9.3 and every function in Lesson 9.4.</p>

<h3>Step 1 — the basic types</h3>
<table>
<thead><tr><th>Type</th><th>Values</th><th>Example</th></tr></thead>
<tbody>
<tr><td><code>string</code></td><td>any text</td><td><code>let title: string = 'Hello'</code></td></tr>
<tr><td><code>number</code></td><td>integers and decimals (one type for both)</td><td><code>let price: number = 25000</code></td></tr>
<tr><td><code>boolean</code></td><td><code>true</code> / <code>false</code></td><td><code>let published: boolean = true</code></td></tr>
<tr><td><code>string[]</code> or <code>Array&lt;string&gt;</code></td><td>an array of strings</td><td><code>let tags: string[] = ['sql']</code></td></tr>
<tr><td><code>null</code>, <code>undefined</code></td><td>"nothing"</td><td>usually in a union: <code>string | null</code></td></tr>
<tr><td><code>A | B</code></td><td>a union: A or B</td><td><code>let id: number | string</code></td></tr>
<tr><td><code>'asc' | 'desc'</code></td><td>literal types: exactly these values</td><td><code>let dir: 'asc' | 'desc'</code></td></tr>
<tr><td><code>any</code> / <code>unknown</code></td><td>anything — unchecked / checked before use</td><td>Steps 5–6</td></tr>
</tbody>
</table>

<h3>Step 2 — inference: what TypeScript works out by itself</h3>
<p>Here is a file with almost no annotations. We asked the compiler to write a declaration file (<code>--declaration</code>), which prints the type it inferred for every export:</p>
${ma('typescript', CODE['_t9/9-2/infer.ts'])}
${ra(OUT['_t9/out/infer'])}
<div class="kv-grid">
  <div class="kv"><span class="k">let vs const</span><span class="v"><code>let count = 5</code> → <code>number</code> (it may change). <code>const title = 'Hello World'</code> → the literal type <code>"Hello World"</code> (it never changes).</span></div>
  <div class="kv"><span class="k">Arrays</span><span class="v"><code>['sql', 'beginner']</code> → <code>string[]</code>; mixed values → <code>(string | number | boolean)[]</code>.</span></div>
  <div class="kv"><span class="k">Objects</span><span class="v">Each property gets its own type: <code>{ id: number; title: string; … }</code>.</span></div>
  <div class="kv"><span class="k">Functions</span><span class="v">You annotated <code>n: number</code>; the return type <code>number</code> was inferred.</span></div>
  <div class="kv"><span class="k">Widening</span><span class="v"><code>sortDir</code> and <code>settings.dir</code> became plain <code>string</code>. <code>as const</code> kept <code>"asc"</code> and <code>10</code> and made them <code>readonly</code>.</span></div>
</div>
<p>The rule of thumb: <strong>annotate function parameters</strong> (TypeScript cannot guess what callers will pass) and public return types when you want them fixed; let inference handle local variables. Writing <code>let count: number = 5</code> is not wrong, just noise.</p>

<h3>Step 3 — five mistakes the basic types catch</h3>
${ma('typescript', CODE['_t9/9-2/basics.ts'])}
${ra(OUT['_t9/out/basics'])}
<p>Line 10 compiled although <code>id</code> is <code>number | string</code>: after the assignment on line 9, TypeScript tracks that <code>id</code> currently holds a string. That tracking — <strong>narrowing</strong> — is the next step.</p>

<h3>Step 4 — unions and narrowing</h3>
<p>A union <code>number | string</code> means "one of these, I do not know which". Line 13 failed because <code>toFixed</code> exists on numbers only. <code>formatOk</code> checks first, and inside each branch TypeScript knows the exact type:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">typeof</span><span class="lz-t">primitives</span><span class="lz-d"><code>typeof value === 'number'</code> → inside, <code>value</code> is <code>number</code>; after the <code>return</code>, it must be <code>string</code>.</span></div>
<div class="lz-step"><span class="lz-k">=== null</span><span class="lz-t">removing nothing</span><span class="lz-d"><code>if (email === null) return;</code> → afterwards <code>email</code> is <code>string</code> (Lesson 9.1, line 11).</span></div>
<div class="lz-step"><span class="lz-k">Array.isArray</span><span class="lz-t">arrays</span><span class="lz-d"><code>string | string[]</code> → check and handle both.</span></div>
<div class="lz-step"><span class="lz-k">'key' in obj</span><span class="lz-t">objects</span><span class="lz-d">Tells shapes apart; Lesson 9.3 shows a cleaner way with a <code>kind</code> field.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>if (count)</code> to check "is there a value".</strong> Truthiness narrows away <code>null</code> and <code>undefined</code>, but also <code>0</code> and <code>''</code>. <code>if (price)</code> treats a free product (price 0) as "no price"; <code>if (name)</code> treats an empty name like a missing one. When 0 or '' are valid values, compare explicitly: <code>price !== null</code>, <code>name !== undefined</code>.</p></div>

<h3>Step 5 — literal types: a short list of allowed values</h3>
<p><code>type SortDir = 'asc' | 'desc'</code> (line 20) is a union of two exact strings. Assigning <code>'descending'</code> is an error (line 22), and the editor offers only the two valid choices — the same idea as the <code>sort</code> allow-list in Lesson 6.5, now checked at compile time. Use them for statuses (<code>'draft' | 'published'</code>), HTTP methods, roles. The <code>as const</code> line in Step 2 shows the other side: a plain object widens <code>'asc'</code> to <code>string</code> because you might change it later; <code>as const</code> promises you will not.</p>

<h3>Step 6 — <code>any</code> versus <code>unknown</code></h3>
${ma('typescript', CODE['_t9/9-2/any-unknown.ts'])}
${ra(OUT['_t9/out/any-unknown'])}
<p>Both variables hold the same JSON. With <code>any</code> (line 3) the compiler said <em>nothing</em> — and the program crashed when it ran, exactly as plain JavaScript would. With <code>unknown</code> (line 6) it refused to read <code>.title</code> until line 8 proved, step by step, that the value is an object with a string <code>title</code>. Line 9 then compiled.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>any</code> spreads silently.</strong> <code>const data: any = await res.json()</code> makes <code>data.items</code>, <code>data.items[0].price</code> and everything computed from them <code>any</code> too — a whole region of your program is no longer checked, and nothing marks where it ends. Use <code>unknown</code> for anything from outside, check it once at the boundary (Lesson 9.5 shows zod), and the rest of the program stays typed. In <code>catch (err)</code>, TypeScript already makes <code>err</code> <code>unknown</code> under <code>strict</code>.</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — predict, then check</strong></p>
<ol>
<li>Copy <code>infer.ts</code>, cover the output above, and write down the type you expect for each export. Then run <code>npx tsc --declaration --emitDeclarationOnly --outDir out infer.ts</code> and compare with <code>out/infer.d.ts</code>.</li>
<li>Copy <code>basics.ts</code> and fix all five errors without <code>any</code>, <code>as</code> or <code>!</code> (change values or types, never silence).</li>
<li>Write <code>function describe(value: string | number | string[] | null): string</code> that returns "empty" for null, the text in upper case, the number with two decimals, or the list joined by commas.</li>
<li>Write <code>function readTitle(json: string): string</code> that uses <code>unknown</code> and returns <code>'(no title)'</code> when the parsed value has no string <code>title</code>.</li>
</ol>
<p>Hint: in VS Code, hover any variable to see the inferred type without running anything.</p>
<p><strong>Done when:</strong> at least 9 of your 11 predictions match the declaration file; <code>npx tsc --noEmit --strict</code> prints nothing for your files; <code>describe(['a', 'b'])</code> returns <code>'a, b'</code> and <code>describe(3)</code> returns <code>'3.00'</code>; <code>readTitle('{"name":"x"}')</code> returns <code>'(no title)'</code>. Then Code Lab module 9.2.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">primitive type</span><span class="v">kiểu nguyên thuỷ — string, number, boolean…</span></div>
  <div class="kv"><span class="k">type inference</span><span class="v">suy luận kiểu — TypeScript tự tính.</span></div>
  <div class="kv"><span class="k">union type</span><span class="v">kiểu hợp — A | B.</span></div>
  <div class="kv"><span class="k">narrowing</span><span class="v">thu hẹp kiểu — sau phép kiểm, kiểu cụ thể hơn.</span></div>
  <div class="kv"><span class="k">type guard</span><span class="v">phép kiểm thu hẹp — typeof, ===, in…</span></div>
  <div class="kv"><span class="k">literal type</span><span class="v">kiểu literal — đúng một giá trị, 'asc'.</span></div>
  <div class="kv"><span class="k">widening</span><span class="v">nới kiểu — 'asc' thành string.</span></div>
  <div class="kv"><span class="k">as const</span><span class="v">giữ giá trị chính xác, chỉ đọc.</span></div>
  <div class="kv"><span class="k">any</span><span class="v">tắt kiểm tra — lây lan.</span></div>
  <div class="kv"><span class="k">unknown</span><span class="v">kiểu an toàn — phải kiểm trước khi dùng.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Basic types: string, number, boolean, arrays, null/undefined, unions, literal types.</li>
  <li>Inference types most variables; annotate parameters, let the rest be inferred.</li>
  <li><code>let</code> widens, <code>const</code> keeps literals; <code>as const</code> keeps object values exact and read-only.</li>
  <li>A union only allows what all members share — narrow with typeof, === null, Array.isArray, in.</li>
  <li>Literal unions give compile-time allow-lists ('asc' | 'desc').</li>
  <li><code>any</code> turns checking off and spreads; <code>unknown</code> forces a check — use it for outside data.</li>
</ul>
${nguon('📗', 'TypeScript Handbook — Everyday Types', 'Primitives, arrays, unions, literal types, any', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')}
${nguon('📘', 'TypeScript Handbook — Narrowing', 'Every way to narrow a union, with examples', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-2-1-primitive', title: 'TypeScript 2.1 — Primitive types in depth', sub: 'The TypeScript course goes further: tuples, literal types, special types', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Kiểu cơ bản — và vì sao bạn sẽ viết chúng ít hơn bạn tưởng</h2>
<p class="lead">Học xong bài này bạn đọc và viết được các kiểu cơ bản của TypeScript, đoán được TypeScript suy ra gì khi không có chú thích, dùng kiểu union và thu hẹp nó an toàn, giới hạn một giá trị vào một danh sách ngắn các chuỗi được phép, và chọn <code>unknown</code> thay vì <code>any</code> cho dữ liệu bạn không kiểm soát. Đây là những viên gạch của mọi interface ở Bài 9.3 và mọi hàm ở Bài 9.4.</p>

<h3>Bước 1 — các kiểu cơ bản</h3>
<table>
<thead><tr><th>Kiểu</th><th>Giá trị</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td><code>string</code></td><td>chữ bất kỳ</td><td><code>let title: string = 'Hello'</code></td></tr>
<tr><td><code>number</code></td><td>số nguyên và số thập phân (một kiểu cho cả hai)</td><td><code>let price: number = 25000</code></td></tr>
<tr><td><code>boolean</code></td><td><code>true</code> / <code>false</code></td><td><code>let published: boolean = true</code></td></tr>
<tr><td><code>string[]</code> hoặc <code>Array&lt;string&gt;</code></td><td>mảng các chuỗi</td><td><code>let tags: string[] = ['sql']</code></td></tr>
<tr><td><code>null</code>, <code>undefined</code></td><td>"không có gì"</td><td>thường trong union: <code>string | null</code></td></tr>
<tr><td><code>A | B</code></td><td>union: A hoặc B</td><td><code>let id: number | string</code></td></tr>
<tr><td><code>'asc' | 'desc'</code></td><td>kiểu literal: đúng các giá trị này</td><td><code>let dir: 'asc' | 'desc'</code></td></tr>
<tr><td><code>any</code> / <code>unknown</code></td><td>mọi thứ — không kiểm / phải kiểm trước khi dùng</td><td>Bước 5–6</td></tr>
</tbody>
</table>

<h3>Bước 2 — suy luận kiểu: TypeScript tự tính ra những gì</h3>
<p>Đây là một tệp gần như không có chú thích. Ta nhờ trình biên dịch viết một tệp khai báo (<code>--declaration</code>), tệp này in ra kiểu nó suy ra cho mọi export:</p>
${ma('typescript', CODE['_t9/9-2/infer.ts'])}
${ra(OUT['_t9/out/infer'])}
<div class="kv-grid">
  <div class="kv"><span class="k">let và const</span><span class="v"><code>let count = 5</code> → <code>number</code> (có thể đổi). <code>const title = 'Hello World'</code> → kiểu literal <code>"Hello World"</code> (không bao giờ đổi).</span></div>
  <div class="kv"><span class="k">Mảng</span><span class="v"><code>['sql', 'beginner']</code> → <code>string[]</code>; giá trị lẫn lộn → <code>(string | number | boolean)[]</code>.</span></div>
  <div class="kv"><span class="k">Object</span><span class="v">Mỗi thuộc tính có kiểu riêng: <code>{ id: number; title: string; … }</code>.</span></div>
  <div class="kv"><span class="k">Hàm</span><span class="v">Bạn chú thích <code>n: number</code>; kiểu trả về <code>number</code> được suy ra.</span></div>
  <div class="kv"><span class="k">Nới kiểu</span><span class="v"><code>sortDir</code> và <code>settings.dir</code> thành <code>string</code> thường. <code>as const</code> giữ <code>"asc"</code> và <code>10</code> và biến chúng thành <code>readonly</code>.</span></div>
</div>
<p>Quy tắc nhanh: <strong>chú thích tham số của hàm</strong> (TypeScript không đoán được người gọi sẽ truyền gì) và kiểu trả về công khai khi bạn muốn cố định nó; để suy luận lo các biến cục bộ. Viết <code>let count: number = 5</code> không sai, chỉ là thừa.</p>

<h3>Bước 3 — năm lỗi mà kiểu cơ bản bắt được</h3>
${ma('typescript', CODE['_t9/9-2/basics.ts'])}
${ra(OUT['_t9/out/basics'])}
<p>Dòng 10 biên dịch được dù <code>id</code> là <code>number | string</code>: sau lệnh gán ở dòng 9, TypeScript theo dõi rằng <code>id</code> đang giữ một chuỗi. Việc theo dõi đó — <strong>thu hẹp kiểu</strong> — là bước tiếp theo.</p>

<h3>Bước 4 — union và thu hẹp kiểu</h3>
<p>Union <code>number | string</code> nghĩa là "một trong hai, tôi không biết cái nào". Dòng 13 hỏng vì <code>toFixed</code> chỉ có ở số. <code>formatOk</code> kiểm trước, và trong mỗi nhánh TypeScript biết đúng kiểu:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">typeof</span><span class="lz-t">kiểu nguyên thuỷ</span><span class="lz-d"><code>typeof value === 'number'</code> → bên trong, <code>value</code> là <code>number</code>; sau lệnh <code>return</code>, nó phải là <code>string</code>.</span></div>
<div class="lz-step"><span class="lz-k">=== null</span><span class="lz-t">loại bỏ "không có gì"</span><span class="lz-d"><code>if (email === null) return;</code> → sau đó <code>email</code> là <code>string</code> (Bài 9.1, dòng 11).</span></div>
<div class="lz-step"><span class="lz-k">Array.isArray</span><span class="lz-t">mảng</span><span class="lz-d"><code>string | string[]</code> → kiểm rồi xử lý cả hai.</span></div>
<div class="lz-step"><span class="lz-k">'key' in obj</span><span class="lz-t">object</span><span class="lz-d">Phân biệt các hình dạng; Bài 9.3 chỉ cách gọn hơn bằng trường <code>kind</code>.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>if (count)</code> để kiểm "có giá trị không".</strong> Kiểm truthy loại được <code>null</code> và <code>undefined</code>, nhưng loại luôn cả <code>0</code> và <code>''</code>. <code>if (price)</code> coi sản phẩm miễn phí (giá 0) là "không có giá"; <code>if (name)</code> coi tên rỗng như tên bị thiếu. Khi 0 hay '' là giá trị hợp lệ, hãy so rõ ràng: <code>price !== null</code>, <code>name !== undefined</code>.</p></div>

<h3>Bước 5 — kiểu literal: danh sách ngắn giá trị được phép</h3>
<p><code>type SortDir = 'asc' | 'desc'</code> (dòng 20) là union của hai chuỗi chính xác. Gán <code>'descending'</code> là lỗi (dòng 22), và trình soạn thảo chỉ gợi ý hai lựa chọn hợp lệ — cùng ý tưởng với danh sách cho phép <code>sort</code> ở Bài 6.5, giờ được kiểm lúc biên dịch. Dùng chúng cho trạng thái (<code>'draft' | 'published'</code>), method HTTP, vai trò. Dòng <code>as const</code> ở Bước 2 cho thấy mặt kia: object thường nới <code>'asc'</code> thành <code>string</code> vì bạn có thể đổi nó sau này; <code>as const</code> hứa rằng bạn sẽ không đổi.</p>

<h3>Bước 6 — <code>any</code> và <code>unknown</code></h3>
${ma('typescript', CODE['_t9/9-2/any-unknown.ts'])}
${ra(OUT['_t9/out/any-unknown'])}
<p>Cả hai biến giữ cùng một JSON. Với <code>any</code> (dòng 3) trình biên dịch <em>không nói gì</em> — và chương trình sập khi chạy, y như JavaScript thuần. Với <code>unknown</code> (dòng 6) nó từ chối đọc <code>.title</code> cho tới khi dòng 8 chứng minh, từng bước, rằng giá trị là object có <code>title</code> kiểu chuỗi. Khi đó dòng 9 biên dịch được.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>any</code> lây lan lặng lẽ.</strong> <code>const data: any = await res.json()</code> khiến <code>data.items</code>, <code>data.items[0].price</code> và mọi thứ tính từ chúng cũng thành <code>any</code> — cả một vùng chương trình không còn được kiểm, và không gì đánh dấu nó kết thúc ở đâu. Hãy dùng <code>unknown</code> cho mọi thứ từ bên ngoài, kiểm một lần ở ranh giới (Bài 9.5 dùng zod), và phần còn lại của chương trình vẫn có kiểu. Trong <code>catch (err)</code>, TypeScript đã tự cho <code>err</code> là <code>unknown</code> khi bật <code>strict</code>.</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — đoán trước, kiểm sau</strong></p>
<ol>
<li>Chép <code>infer.ts</code>, che output ở trên, và ghi ra kiểu bạn đoán cho từng export. Rồi chạy <code>npx tsc --declaration --emitDeclarationOnly --outDir out infer.ts</code> và so với <code>out/infer.d.ts</code>.</li>
<li>Chép <code>basics.ts</code> và sửa cả năm lỗi mà không dùng <code>any</code>, <code>as</code> hay <code>!</code> (đổi giá trị hoặc kiểu, không bịt miệng).</li>
<li>Viết <code>function describe(value: string | number | string[] | null): string</code> trả "empty" với null, chữ viết hoa với chuỗi, số có hai chữ số thập phân, hoặc danh sách nối bằng dấu phẩy.</li>
<li>Viết <code>function readTitle(json: string): string</code> dùng <code>unknown</code> và trả <code>'(no title)'</code> khi giá trị đã parse không có <code>title</code> kiểu chuỗi.</li>
</ol>
<p>Gợi ý: trong VS Code, rê chuột lên biến bất kỳ để xem kiểu suy ra mà không cần chạy gì.</p>
<p><strong>Xong khi:</strong> ít nhất 9 trên 11 dự đoán của bạn khớp tệp khai báo; <code>npx tsc --noEmit --strict</code> không in gì cho các tệp của bạn; <code>describe(['a', 'b'])</code> trả <code>'a, b'</code> và <code>describe(3)</code> trả <code>'3.00'</code>; <code>readTitle('{"name":"x"}')</code> trả <code>'(no title)'</code>. Sau đó làm module Code Lab 9.2.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">primitive type</span><span class="v">kiểu nguyên thuỷ — string, number, boolean…</span></div>
  <div class="kv"><span class="k">type inference</span><span class="v">suy luận kiểu — TypeScript tự tính.</span></div>
  <div class="kv"><span class="k">union type</span><span class="v">kiểu hợp — A | B.</span></div>
  <div class="kv"><span class="k">narrowing</span><span class="v">thu hẹp kiểu — sau phép kiểm, kiểu cụ thể hơn.</span></div>
  <div class="kv"><span class="k">type guard</span><span class="v">phép kiểm thu hẹp — typeof, ===, in…</span></div>
  <div class="kv"><span class="k">literal type</span><span class="v">kiểu literal — đúng một giá trị, 'asc'.</span></div>
  <div class="kv"><span class="k">widening</span><span class="v">nới kiểu — 'asc' thành string.</span></div>
  <div class="kv"><span class="k">as const</span><span class="v">giữ giá trị chính xác, chỉ đọc.</span></div>
  <div class="kv"><span class="k">any</span><span class="v">tắt kiểm tra — lây lan.</span></div>
  <div class="kv"><span class="k">unknown</span><span class="v">kiểu an toàn — phải kiểm trước khi dùng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Kiểu cơ bản: string, number, boolean, mảng, null/undefined, union, kiểu literal.</li>
  <li>Suy luận kiểu lo phần lớn biến; chú thích tham số, phần còn lại để suy ra.</li>
  <li><code>let</code> nới kiểu, <code>const</code> giữ literal; <code>as const</code> giữ giá trị object chính xác và chỉ đọc.</li>
  <li>Union chỉ cho dùng thứ mọi thành viên đều có — thu hẹp bằng typeof, === null, Array.isArray, in.</li>
  <li>Union literal là danh sách cho phép được kiểm lúc biên dịch ('asc' | 'desc').</li>
  <li><code>any</code> tắt kiểm và lây lan; <code>unknown</code> buộc kiểm — dùng nó cho dữ liệu từ bên ngoài.</li>
</ul>
${nguon('📗', 'TypeScript Handbook — Everyday Types', 'Kiểu nguyên thuỷ, mảng, union, literal, any', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html')}
${nguon('📘', 'TypeScript Handbook — Narrowing', 'Mọi cách thu hẹp một union, kèm ví dụ', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-2-1-primitive', title: 'TypeScript 2.1 — Kiểu nguyên thuỷ chuyên sâu', sub: 'Khoá TypeScript đi xa hơn: tuple, kiểu literal, kiểu đặc biệt', cta: 'Mở bài' })}
</div>
`,
};
