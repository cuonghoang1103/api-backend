/**
 * Bài 9.1 — Vì sao TypeScript (nâng cấp 02/11/2026). Output thật: _demo/_t9/chay.sh (TypeScript 5.9 — tsc của repo — và Node 22.23
 * --experimental-strip-types): giỏ hàng JS cộng chuỗi "250005000", cùng mã TS bị tsc chặn, bốn lỗi thường ngày (gõ sai tên, null,
 * querySelector, thiếu trường), kiểu bị xoá lúc chạy (dist/runtime.js) và JSON sai hình vẫn làm sập.
 * Deck: scripts/slides-src/wf-9-1.mjs (9 slide, WF/v1/wf-9-1). Code Lab: wf-9-1-why-typescript.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-9-1', 'Why TypeScript', 'Vì sao TypeScript', [
  [1, 'Why TypeScript',
    '<p>JavaScript lets you run code that is wrong. You find out when a user clicks the wrong button, or never. TypeScript is JavaScript with types written in, and a checker that reads your whole project before anything runs. This lesson shows what it catches, and the one thing it can never catch.</p>',
    '<p>JavaScript cho bạn chạy cả mã sai. Bạn chỉ biết khi người dùng bấm đúng cái nút đó, hoặc không bao giờ biết. TypeScript là JavaScript có viết thêm kiểu, cùng một bộ kiểm đọc cả dự án trước khi bất cứ gì chạy. Bài này cho thấy nó bắt được gì, và một thứ nó không bao giờ bắt được.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to explain what TypeScript adds to JavaScript, read a TypeScript error and find the line it points to, recognise the everyday bugs it prevents, explain why types disappear when the code runs, and say where in your workflow the checking happens.</p>',
    '<p>Bạn sẽ giải thích được TypeScript thêm gì cho JavaScript, đọc một lỗi TypeScript và tìm đúng dòng nó chỉ tới, nhận ra những lỗi thường ngày nó ngăn được, giải thích vì sao kiểu biến mất khi mã chạy, và nói được việc kiểm diễn ra ở đâu trong quy trình làm việc.</p>'],
  [3, 'A bug JavaScript runs happily',
    '<p>A price came from a form field as the text "5000". Multiplying turned it back into a number, so the total looked right. Adding concatenated it, so the label said two hundred fifty million and five thousand. No error, no warning — just a wrong number on the screen.</p>',
    '<p>Một giá đến từ ô nhập dưới dạng chữ "5000". Phép nhân biến nó lại thành số, nên tổng trông đúng. Phép cộng thì nối chuỗi, nên nhãn ghi hai trăm năm mươi triệu không trăm lẻ năm nghìn. Không lỗi, không cảnh báo — chỉ một con số sai trên màn hình.</p>'],
  [4, 'The same code with types',
    '<p>We described a cart item: name is text, price and quantity are numbers. The checker read the file and stopped at line sixteen: a string is not a number. The bug was found before the code ran even once, and the error says exactly where.</p>',
    '<p>Ta mô tả một món trong giỏ: tên là chữ, giá và số lượng là số. Bộ kiểm đọc tệp và dừng ở dòng mười sáu: chuỗi không phải số. Lỗi bị phát hiện trước khi mã chạy dù chỉ một lần, và thông báo nói chính xác ở đâu.</p>'],
  [5, 'Everyday bugs it catches',
    '<p>A typo in a property name, with a suggestion. An email that may be null. An element that may not exist on the page and may not be an input. A call that forgets a required field. Each of these is a real crash or a silent undefined in plain JavaScript.</p>',
    '<p>Một lỗi gõ tên thuộc tính, kèm gợi ý. Một email có thể là null. Một phần tử có thể không có trên trang và có thể không phải ô nhập. Một lời gọi quên trường bắt buộc. Mỗi cái trong JavaScript thường là một lần sập thật hoặc một undefined lặng lẽ.</p>'],
  [6, 'Types disappear at runtime',
    '<p>Compiling removes every type: the JavaScript that runs has no interface and no annotations. So a type can describe what you expect from a server, but cannot check what really arrives. JSON with the wrong shape went straight through and crashed.</p>',
    '<p>Biên dịch xoá mọi kiểu: JavaScript chạy thật không còn interface hay chú thích kiểu nào. Vì vậy kiểu mô tả được thứ bạn chờ từ máy chủ, nhưng không kiểm được thứ thật sự đến. JSON sai hình đi thẳng qua và làm sập chương trình.</p>'],
  [7, 'Where the checking happens',
    '<p>In the editor, as red underlines while you type. In the terminal, with tsc and the no-emit flag. And in continuous integration, where a non-zero exit code blocks the merge. Node and the bundler simply strip the types and run the JavaScript.</p>',
    '<p>Trong trình soạn thảo, thành gạch đỏ ngay khi bạn gõ. Trong terminal, với tsc và cờ no-emit. Và trong CI, nơi mã thoát khác không chặn việc gộp mã. Node và bundler chỉ việc bóc kiểu ra rồi chạy JavaScript.</p>'],
  [8, 'What it costs',
    '<p>You write a little more, learn a type system, and sometimes argue with the checker. In return, renaming a field shows every place that breaks, the editor completes property names, and whole classes of bugs never reach users. For projects that live longer than a weekend, it pays.</p>',
    '<p>Bạn viết thêm một chút, học một hệ thống kiểu, và đôi khi phải "cãi nhau" với bộ kiểm. Đổi lại, đổi tên một trường là thấy mọi chỗ hỏng, trình soạn thảo tự gợi ý tên thuộc tính, và cả lớp lỗi không bao giờ tới tay người dùng. Với dự án sống lâu hơn một cuối tuần, đáng giá.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to install TypeScript in an empty folder, run the cart example in both languages, and fix every error the checker reports in the mistakes file. "Done when" checks an exit code of zero and a correct total.</p>',
    '<p>Bài luyện yêu cầu bạn cài TypeScript trong một thư mục trống, chạy ví dụ giỏ hàng bằng cả hai ngôn ngữ, và sửa mọi lỗi bộ kiểm báo trong tệp lỗi. "Xong khi" kiểm mã thoát bằng không và tổng tiền đúng.</p>'],
]);

export default {
  title: '9.1 — Why TypeScript: catching bugs before they run|||9.1 — Vì sao TypeScript: bắt lỗi trước khi chạy',
  slug: 'wf-9-1-why-typescript',
  type: 'VIDEO',
  isFreePreview: true,
  video: { url: 'https://youtu.be/zQnBQ4tB3ZA', durationSeconds: 0 },
  description: 'Giỏ hàng JavaScript chạy "đúng" mà nhãn ghi 250005000 VND (giá là chuỗi); cùng mã TypeScript bị tsc 5.9 chặn ở dòng 16; bốn lỗi thường ngày tsc bắt (gõ sai tên có gợi ý, null, querySelector, thiếu trường); kiểu bị xoá khi biên dịch (dist/runtime.js thật) và JSON sai hình vẫn làm sập lúc chạy; kiểm ở editor, tsc --noEmit, CI; cái giá và cái lợi.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>TypeScript is JavaScript plus types that catch mistakes before anything runs</h2>
<p class="lead">After this lesson you can explain what TypeScript adds to JavaScript and what it does not, read a TypeScript error and go to the exact line, recognise the everyday bugs it prevents, explain why types vanish when your program runs (and what that means for data from servers), and place type-checking correctly in your workflow. React, Next.js, Node.js back-ends, Prisma (Lesson 8.5) and most job listings you will meet use TypeScript; this chapter gets you comfortable with it.</p>

<h3>Step 1 — a bug JavaScript runs happily</h3>
<p>A shopping cart. Every value came from a form — and <code>&lt;input&gt;.value</code> is always a string (Lesson 2.4), so one price is <code>'5000'</code>:</p>
${ma('javascript', CODE['_t9/9-1/cart.js'])}
${ra(OUT['_t9/out/cart-js'])}
<p>The total is right by luck: <code>*</code> converts <code>'5000'</code> to a number. The label is wrong: <code>+</code> with a string concatenates, so <code>25000 + '5000'</code> became <code>'250005000'</code> (Lesson 4.1). No error, no warning; the bug ships.</p>

<h3>Step 2 — the same code with types</h3>
${ma('typescript', CODE['_t9/9-1/cart.ts'])}
${ra(OUT['_t9/out/cart-ts'])}
<p>The only new things are an <code>interface</code> describing a cart item (Lesson 9.3) and <code>: CartItem[]</code> / <code>: number</code> annotations. <code>tsc</code>, the TypeScript compiler, read the file and reported <code>cart.ts(16,18)</code> — line 16, column 18: the Pen's <code>price</code>. <code>TS2322</code> is the error number (searchable). Exit code 2 means "errors found", which is how scripts and CI notice.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">You write .ts</span><span class="lz-d">JavaScript plus type annotations — any valid JavaScript is almost always valid TypeScript.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The checker reads everything</span><span class="lz-d">Every file, every call, without running anything: "can this ever go wrong?"</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Errors, or nothing</span><span class="lz-d"><code>file(line,col): error TSxxxx: …</code> — exit code 2. No output and exit code 0 = no problems found.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Types are removed</span><span class="lz-d">What runs is plain JavaScript (Step 4).</span></div>
</div>

<h3>Step 3 — the everyday bugs it catches</h3>
${ma('typescript', CODE['_t9/9-1/mistakes.ts'])}
${ra(OUT['_t9/out/mistakes'])}
<table>
<thead><tr><th>Line</th><th>Plain JavaScript would…</th><th>TypeScript says</th></tr></thead>
<tbody>
<tr><td>8</td><td>show "Hello, undefined"</td><td><code>'nmae' does not exist</code> — and the editor offers <code>name</code></td></tr>
<tr><td>11</td><td>crash with "Cannot read properties of null" for users without email</td><td><code>'user.email' is possibly 'null'</code></td></tr>
<tr><td>14</td><td>crash if the element is missing; <code>undefined</code> if it is not an input</td><td>possibly <code>null</code>, and <code>Element</code> has no <code>value</code> (Lesson 9.2 shows the fix)</td></tr>
<tr><td>15</td><td>create a user without an email field</td><td><code>Property 'email' is missing</code></td></tr>
</tbody>
</table>
<p>The type <code>string | null</code> on line 5 says "an email, or nothing". TypeScript then insists that every use handles the "nothing" case — the single most common crash in JavaScript ("Cannot read properties of undefined/null") becomes a compile error.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — silencing the error instead of fixing it.</strong> <code>user.email!.split('@')</code> (the <code>!</code> means "trust me, it is not null"), <code>as any</code>, or <code>// @ts-ignore</code> make the red line disappear and put the crash back. They have rare legitimate uses; as a habit they turn TypeScript into decoration. Fix the cause: <code>if (user.email === null) return null;</code> first.</p></div>

<h3>Step 4 — types disappear at runtime</h3>
${ma('typescript', CODE['_t9/9-1/runtime.ts'])}
${ra(OUT['_t9/out/runtime'])}
<p>Look at the compiled file: the <code>interface</code> and <code>as Product</code> are gone. Only JavaScript runs. The server sent <code>title</code> instead of <code>name</code> and a string price; TypeScript had no way to know, because <code>JSON.parse</code> happens while the program runs, long after checking. <code>typeof product.price</code> is <code>'string'</code> and <code>product.name.toUpperCase()</code> crashed — exactly the JavaScript behaviour.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>as Product</code> on data from outside.</strong> <code>await res.json() as Product</code> is a promise you make to the compiler, not a check. Everything that crosses into your program — API responses, <code>req.body</code>, <code>localStorage</code>, environment variables — must be validated at runtime (Lesson 6.5's checks, or a library such as zod in Lesson 9.5). Types then describe data you <em>know</em> is valid.</p></div>

<h3>Step 5 — where checking happens in your workflow</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Editor</span><span class="v">VS Code runs the same checker as you type: red underlines, hover for types, autocomplete of property names, rename across files.</span></div>
  <div class="kv"><span class="k">Terminal</span><span class="v"><code>npx tsc --noEmit</code> checks the whole project and writes nothing. This repository's own checklist runs exactly that before every push.</span></div>
  <div class="kv"><span class="k">CI</span><span class="v">A GitHub Actions step runs <code>tsc --noEmit</code>; exit code 2 fails the build, so type errors cannot be merged (Lesson 13.4).</span></div>
  <div class="kv"><span class="k">Running</span><span class="v">Node 22 (<code>--experimental-strip-types</code>), tsx, Vite and Next.js just remove types and run JavaScript — they do not check. Checking is a separate step.</span></div>
</div>
<table>
<thead><tr><th>You get</th><th>You pay</th></tr></thead>
<tbody>
<tr><td>Bugs found before users see them</td><td>A few more characters per function</td></tr>
<tr><td>Autocomplete and safe renames across the project</td><td>Learning the type system (this chapter)</td></tr>
<tr><td>Types document what a function expects and returns</td><td>Occasionally convincing the checker of something you know</td></tr>
<tr><td>Confidence when changing old code</td><td>A build or check step in the toolchain</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — see it for yourself</strong></p>
<ol>
<li>In an empty folder: <code>npm init -y</code> and <code>npm i -D typescript @types/node</code>. Check <code>npx tsc --version</code>.</li>
<li>Save <code>cart.js</code> and run it with <code>node cart.js</code>. Save <code>cart.ts</code> and run <code>npx tsc --noEmit --strict cart.ts</code>.</li>
<li>Fix the cart: convert the form value with <code>Number(…)</code> where the item is created. Run tsc again, then <code>node --experimental-strip-types cart.ts</code> (Node 22.6+).</li>
<li>Save <code>mistakes.ts</code> and fix all five errors without <code>!</code>, <code>any</code> or <code>@ts-ignore</code>. For line 14 use <code>document.querySelector&lt;HTMLInputElement&gt;('#search')</code> and an <code>if</code>.</li>
<li>Compile <code>runtime.ts</code> with <code>npx tsc --outDir dist runtime.ts</code> and open <code>dist/runtime.js</code>.</li>
</ol>
<p>Hint: <code>npx tsc --noEmit --strict --lib es2022,dom mistakes.ts</code> lets tsc know about <code>document</code>.</p>
<p><strong>Done when:</strong> tsc prints nothing and <code>echo $?</code> shows 0 for both <code>cart.ts</code> and <code>mistakes.ts</code>; your fixed cart prints <code>65000</code> and <code>Total: 30000 VND</code>; and you can point to the line in <code>dist/runtime.js</code> where the <code>as Product</code> used to be. Then Code Lab module 9.1.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">TypeScript</span><span class="v">JavaScript cộng thêm kiểu tĩnh.</span></div>
  <div class="kv"><span class="k">type annotation</span><span class="v">chú thích kiểu — <code>: number</code>.</span></div>
  <div class="kv"><span class="k">type checker</span><span class="v">bộ kiểm kiểu — đọc mã mà không chạy.</span></div>
  <div class="kv"><span class="k">compile time vs runtime</span><span class="v">lúc biên dịch / lúc chạy.</span></div>
  <div class="kv"><span class="k">tsc</span><span class="v">trình biên dịch TypeScript.</span></div>
  <div class="kv"><span class="k">type erasure</span><span class="v">xoá kiểu — JavaScript chạy không còn kiểu.</span></div>
  <div class="kv"><span class="k">type assertion (as)</span><span class="v">ép kiểu — lời hứa, không phải phép kiểm.</span></div>
  <div class="kv"><span class="k">null safety</span><span class="v">an toàn null — buộc xử lý trường hợp không có.</span></div>
  <div class="kv"><span class="k">exit code</span><span class="v">mã thoát — 0 ổn, 2 có lỗi kiểu.</span></div>
  <div class="kv"><span class="k">runtime validation</span><span class="v">kiểm dữ liệu lúc chạy.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>TypeScript = JavaScript + types + a checker that reads the whole program without running it.</li>
  <li>Errors read <code>file(line,col): error TSxxxx</code>; exit code 2 means errors were found.</li>
  <li>It catches typos, wrong types, possibly-null values and missing fields before users do.</li>
  <li>Types are erased: they cannot check data that arrives while the program runs — validate it.</li>
  <li><code>!</code>, <code>as</code>, <code>any</code> and <code>@ts-ignore</code> silence the checker; fix the cause instead.</li>
  <li>Checking happens in the editor, with <code>tsc --noEmit</code>, and in CI; runners just strip types.</li>
</ul>
${nguon('📗', 'TypeScript Handbook — The Basics', 'Static checking, errors and erased types, from the TypeScript team', 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html')}
${nguon('📘', 'TypeScript for JavaScript Programmers', 'A five-minute overview for people who know JavaScript', 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-1-1-ba-con-bug', title: 'TypeScript 1.1 — Three bugs TypeScript stops', sub: 'The full TypeScript course, starting from the bugs it prevents', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>TypeScript là JavaScript cộng kiểu, bắt lỗi trước khi bất cứ gì chạy</h2>
<p class="lead">Học xong bài này bạn giải thích được TypeScript thêm gì cho JavaScript và không thêm gì, đọc một lỗi TypeScript rồi đi tới đúng dòng, nhận ra những lỗi thường ngày nó ngăn được, giải thích vì sao kiểu biến mất khi chương trình chạy (và điều đó nghĩa là gì với dữ liệu từ máy chủ), và đặt việc kiểm kiểu đúng chỗ trong quy trình làm việc. React, Next.js, backend Node.js, Prisma (Bài 8.5) và phần lớn tin tuyển dụng bạn gặp đều dùng TypeScript; chương này giúp bạn quen với nó.</p>

<h3>Bước 1 — một lỗi JavaScript chạy vô tư</h3>
<p>Một giỏ hàng. Mọi giá trị đến từ form — và <code>&lt;input&gt;.value</code> luôn là chuỗi (Bài 2.4), nên một giá là <code>'5000'</code>:</p>
${ma('javascript', CODE['_t9/9-1/cart.js'])}
${ra(OUT['_t9/out/cart-js'])}
<p>Tổng đúng là nhờ may: <code>*</code> đổi <code>'5000'</code> thành số. Nhãn thì sai: <code>+</code> với chuỗi là nối chuỗi, nên <code>25000 + '5000'</code> thành <code>'250005000'</code> (Bài 4.1). Không lỗi, không cảnh báo; lỗi cứ thế lên production.</p>

<h3>Bước 2 — cùng đoạn mã có kiểu</h3>
${ma('typescript', CODE['_t9/9-1/cart.ts'])}
${ra(OUT['_t9/out/cart-ts'])}
<p>Thứ mới duy nhất là một <code>interface</code> mô tả món hàng trong giỏ (Bài 9.3) và các chú thích <code>: CartItem[]</code> / <code>: number</code>. <code>tsc</code>, trình biên dịch TypeScript, đọc tệp và báo <code>cart.ts(16,18)</code> — dòng 16, cột 18: chính <code>price</code> của cây bút. <code>TS2322</code> là số hiệu lỗi (tra cứu được). Mã thoát 2 nghĩa là "có lỗi", cách mà script và CI nhận ra.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bạn viết .ts</span><span class="lz-d">JavaScript cộng chú thích kiểu — JavaScript hợp lệ gần như luôn là TypeScript hợp lệ.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bộ kiểm đọc mọi thứ</span><span class="lz-d">Mọi tệp, mọi lời gọi, không chạy gì cả: "chỗ này có bao giờ hỏng không?"</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Có lỗi, hoặc im lặng</span><span class="lz-d"><code>tệp(dòng,cột): error TSxxxx: …</code> — mã thoát 2. Không in gì và mã thoát 0 = không thấy vấn đề.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Kiểu bị xoá</span><span class="lz-d">Thứ chạy là JavaScript thuần (Bước 4).</span></div>
</div>

<h3>Bước 3 — những lỗi thường ngày nó bắt được</h3>
${ma('typescript', CODE['_t9/9-1/mistakes.ts'])}
${ra(OUT['_t9/out/mistakes'])}
<table>
<thead><tr><th>Dòng</th><th>JavaScript thuần sẽ…</th><th>TypeScript nói</th></tr></thead>
<tbody>
<tr><td>8</td><td>hiện "Hello, undefined"</td><td><code>'nmae' does not exist</code> — và trình soạn thảo gợi ý <code>name</code></td></tr>
<tr><td>11</td><td>sập với "Cannot read properties of null" ở người dùng không có email</td><td><code>'user.email' is possibly 'null'</code></td></tr>
<tr><td>14</td><td>sập nếu không có phần tử; <code>undefined</code> nếu nó không phải ô nhập</td><td>có thể <code>null</code>, và <code>Element</code> không có <code>value</code> (Bài 9.2 chỉ cách sửa)</td></tr>
<tr><td>15</td><td>tạo người dùng thiếu trường email</td><td><code>Property 'email' is missing</code></td></tr>
</tbody>
</table>
<p>Kiểu <code>string | null</code> ở dòng 5 nghĩa là "một email, hoặc không có gì". Khi đó TypeScript đòi mọi chỗ dùng phải xử lý trường hợp "không có gì" — lần sập phổ biến nhất của JavaScript ("Cannot read properties of undefined/null") trở thành lỗi lúc biên dịch.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — dập lỗi thay vì sửa lỗi.</strong> <code>user.email!.split('@')</code> (dấu <code>!</code> nghĩa là "tin tôi đi, nó không null"), <code>as any</code>, hay <code>// @ts-ignore</code> làm gạch đỏ biến mất và đặt lần sập trở lại. Chúng hiếm khi có lý do chính đáng; thành thói quen thì TypeScript chỉ còn là đồ trang trí. Hãy sửa nguyên nhân: <code>if (user.email === null) return null;</code> trước.</p></div>

<h3>Bước 4 — kiểu biến mất khi chạy</h3>
${ma('typescript', CODE['_t9/9-1/runtime.ts'])}
${ra(OUT['_t9/out/runtime'])}
<p>Nhìn tệp đã biên dịch: <code>interface</code> và <code>as Product</code> đã biến mất. Chỉ JavaScript chạy. Máy chủ gửi <code>title</code> thay cho <code>name</code> và giá là chuỗi; TypeScript không có cách nào biết, vì <code>JSON.parse</code> xảy ra lúc chương trình chạy, rất lâu sau khi kiểm. <code>typeof product.price</code> là <code>'string'</code> và <code>product.name.toUpperCase()</code> sập — đúng y hành vi của JavaScript.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>as Product</code> trên dữ liệu từ bên ngoài.</strong> <code>await res.json() as Product</code> là lời hứa bạn đưa cho trình biên dịch, không phải phép kiểm. Mọi thứ đi vào chương trình — response API, <code>req.body</code>, <code>localStorage</code>, biến môi trường — đều phải được kiểm lúc chạy (các phép kiểm ở Bài 6.5, hoặc thư viện như zod ở Bài 9.5). Khi đó kiểu mô tả dữ liệu mà bạn <em>biết chắc</em> là hợp lệ.</p></div>

<h3>Bước 5 — việc kiểm diễn ra ở đâu trong quy trình</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trình soạn thảo</span><span class="v">VS Code chạy cùng bộ kiểm đó khi bạn gõ: gạch đỏ, rê chuột xem kiểu, tự gợi ý tên thuộc tính, đổi tên xuyên tệp.</span></div>
  <div class="kv"><span class="k">Terminal</span><span class="v"><code>npx tsc --noEmit</code> kiểm cả dự án và không ghi gì. Danh sách kiểm của chính repo này chạy đúng lệnh đó trước mỗi lần push.</span></div>
  <div class="kv"><span class="k">CI</span><span class="v">Một bước GitHub Actions chạy <code>tsc --noEmit</code>; mã thoát 2 làm build thất bại, nên lỗi kiểu không gộp vào được (Bài 13.4).</span></div>
  <div class="kv"><span class="k">Khi chạy</span><span class="v">Node 22 (<code>--experimental-strip-types</code>), tsx, Vite và Next.js chỉ bóc kiểu rồi chạy JavaScript — chúng không kiểm. Kiểm là một bước riêng.</span></div>
</div>
<table>
<thead><tr><th>Bạn được</th><th>Bạn trả</th></tr></thead>
<tbody>
<tr><td>Lỗi bị phát hiện trước khi người dùng thấy</td><td>Thêm vài ký tự mỗi hàm</td></tr>
<tr><td>Tự gợi ý và đổi tên an toàn khắp dự án</td><td>Học hệ thống kiểu (chương này)</td></tr>
<tr><td>Kiểu ghi lại hàm nhận gì, trả gì</td><td>Đôi khi phải thuyết phục bộ kiểm điều bạn đã biết</td></tr>
<tr><td>Tự tin khi sửa mã cũ</td><td>Thêm một bước build hoặc kiểm trong bộ công cụ</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — tự mình thấy</strong></p>
<ol>
<li>Trong một thư mục trống: <code>npm init -y</code> và <code>npm i -D typescript @types/node</code>. Kiểm <code>npx tsc --version</code>.</li>
<li>Lưu <code>cart.js</code> và chạy <code>node cart.js</code>. Lưu <code>cart.ts</code> và chạy <code>npx tsc --noEmit --strict cart.ts</code>.</li>
<li>Sửa giỏ hàng: đổi giá trị form bằng <code>Number(…)</code> ở chỗ tạo món hàng. Chạy lại tsc, rồi <code>node --experimental-strip-types cart.ts</code> (Node 22.6+).</li>
<li>Lưu <code>mistakes.ts</code> và sửa cả năm lỗi mà không dùng <code>!</code>, <code>any</code> hay <code>@ts-ignore</code>. Với dòng 14 dùng <code>document.querySelector&lt;HTMLInputElement&gt;('#search')</code> kèm một <code>if</code>.</li>
<li>Biên dịch <code>runtime.ts</code> bằng <code>npx tsc --outDir dist runtime.ts</code> rồi mở <code>dist/runtime.js</code>.</li>
</ol>
<p>Gợi ý: <code>npx tsc --noEmit --strict --lib es2022,dom mistakes.ts</code> cho tsc biết về <code>document</code>.</p>
<p><strong>Xong khi:</strong> tsc không in gì và <code>echo $?</code> ra 0 cho cả <code>cart.ts</code> lẫn <code>mistakes.ts</code>; giỏ hàng đã sửa in <code>65000</code> và <code>Total: 30000 VND</code>; và bạn chỉ được dòng trong <code>dist/runtime.js</code> nơi <code>as Product</code> từng nằm. Sau đó làm module Code Lab 9.1.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">TypeScript</span><span class="v">JavaScript cộng thêm kiểu tĩnh.</span></div>
  <div class="kv"><span class="k">type annotation</span><span class="v">chú thích kiểu — <code>: number</code>.</span></div>
  <div class="kv"><span class="k">type checker</span><span class="v">bộ kiểm kiểu — đọc mã mà không chạy.</span></div>
  <div class="kv"><span class="k">compile time vs runtime</span><span class="v">lúc biên dịch / lúc chạy.</span></div>
  <div class="kv"><span class="k">tsc</span><span class="v">trình biên dịch TypeScript.</span></div>
  <div class="kv"><span class="k">type erasure</span><span class="v">xoá kiểu — JavaScript chạy không còn kiểu.</span></div>
  <div class="kv"><span class="k">type assertion (as)</span><span class="v">ép kiểu — lời hứa, không phải phép kiểm.</span></div>
  <div class="kv"><span class="k">null safety</span><span class="v">an toàn null — buộc xử lý trường hợp không có.</span></div>
  <div class="kv"><span class="k">exit code</span><span class="v">mã thoát — 0 ổn, 2 có lỗi kiểu.</span></div>
  <div class="kv"><span class="k">runtime validation</span><span class="v">kiểm dữ liệu lúc chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>TypeScript = JavaScript + kiểu + một bộ kiểm đọc cả chương trình mà không chạy nó.</li>
  <li>Lỗi có dạng <code>tệp(dòng,cột): error TSxxxx</code>; mã thoát 2 nghĩa là có lỗi.</li>
  <li>Nó bắt lỗi gõ tên, sai kiểu, giá trị có thể null và thiếu trường trước người dùng.</li>
  <li>Kiểu bị xoá: chúng không kiểm được dữ liệu đến lúc chương trình chạy — hãy kiểm dữ liệu đó.</li>
  <li><code>!</code>, <code>as</code>, <code>any</code> và <code>@ts-ignore</code> bịt miệng bộ kiểm; hãy sửa nguyên nhân.</li>
  <li>Kiểm diễn ra ở trình soạn thảo, bằng <code>tsc --noEmit</code>, và trong CI; trình chạy chỉ bóc kiểu.</li>
</ul>
${nguon('📗', 'TypeScript Handbook — The Basics', 'Kiểm tĩnh, lỗi và kiểu bị xoá, từ đội TypeScript', 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html')}
${nguon('📘', 'TypeScript for JavaScript Programmers', 'Tổng quan năm phút cho người đã biết JavaScript', 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html')}
${lienKet({ khoa: 'typescript', bai: 'typescript-1-1-ba-con-bug', title: 'TypeScript 1.1 — Ba con bug TypeScript chặn được', sub: 'Khoá TypeScript đầy đủ, bắt đầu từ những lỗi nó ngăn được', cta: 'Mở bài' })}
</div>
`,
};
