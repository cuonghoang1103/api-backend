/**
 * TypeScript · Chương 6 · 6.1 — Vì sao cần generics: giữ lại kiểu. Slug giữ: typescript-6-1-why-generics.
 * BÀI MỞ CHƯƠNG 6 (soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md). Code/output từ ./_ma-ts-06-1.mjs (demo6/ts-06-1, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-06-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-06-1.mjs';

const BANG_EN = `<table>
<thead><tr><th>You write</th><th>What tsc knows</th><th>Use it when</th></tr></thead>
<tbody>
<tr><td><code>firstOf(arr: any[]): any</code></td><td>nothing — the type is lost on the way out</td><td>never, if you can help it (1.4)</td></tr>
<tr><td><code>firstOf(arr: unknown[]): unknown</code></td><td>the result is <code>unknown</code> — honest, but you must narrow every use</td><td>when the element type truly does not matter and you re-check it</td></tr>
<tr><td><code>firstOf&lt;T&gt;(arr: T[]): T | undefined</code></td><td>the output has the SAME type as the input’s elements</td><td>a function whose result type follows its argument</td></tr>
<tr><td><code>identity&lt;T&gt;(x: T): T</code></td><td>T is inferred from the argument — you rarely write <code>&lt;T&gt;</code></td><td>pass-through helpers, wrappers</td></tr>
<tr><td><code>pair&lt;A, B&gt;(a: A, b: B): [A, B]</code></td><td>two independent type parameters, both remembered</td><td>combine values of different types</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Bạn viết</th><th>tsc biết gì</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td><code>firstOf(arr: any[]): any</code></td><td>không gì — kiểu mất trên đường ra</td><td>đừng, nếu tránh được (1.4)</td></tr>
<tr><td><code>firstOf(arr: unknown[]): unknown</code></td><td>kết quả là <code>unknown</code> — trung thực, nhưng mỗi lần dùng phải narrow</td><td>khi kiểu phần tử thật sự không quan trọng và bạn kiểm lại</td></tr>
<tr><td><code>firstOf&lt;T&gt;(arr: T[]): T | undefined</code></td><td>đầu ra cùng kiểu với phần tử đầu vào</td><td>một hàm có kiểu kết quả đi theo đối số</td></tr>
<tr><td><code>identity&lt;T&gt;(x: T): T</code></td><td>T suy ra từ đối số — hiếm khi phải viết <code>&lt;T&gt;</code></td><td>hàm truyền thẳng, wrapper</td></tr>
<tr><td><code>pair&lt;A, B&gt;(a: A, b: B): [A, B]</code></td><td>hai tham số kiểu độc lập, cùng được nhớ</td><td>ghép giá trị khác kiểu nhau</td></tr>
</tbody>
</table>`;

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Declare T</div><div class="lz-d"><code>function firstOf&lt;T&gt;(…)</code> — a placeholder for a type, chosen per call</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Use T</div><div class="lz-d">in parameters and the return, so the output is linked to the input</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Infer</div><div class="lz-d"><code>firstOf(users)</code> → tsc sets T = User from the argument</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Keep the type</div><div class="lz-d">the result is <code>User | undefined</code> — a typo on it is a compile error</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Khai T</div><div class="lz-d"><code>function firstOf&lt;T&gt;(…)</code> — chỗ giữ cho một kiểu, chọn theo từng lần gọi</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Dùng T</div><div class="lz-d">trong tham số và kiểu trả về, để đầu ra gắn với đầu vào</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Suy ra</div><div class="lz-d"><code>firstOf(users)</code> → tsc đặt T = User từ đối số</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Giữ kiểu</div><div class="lz-d">kết quả là <code>User | undefined</code> — gõ sai nó là lỗi biên dịch</div></div>
</div>`;

export default {
  title: '6.1 — Why generics: keep the type|||6.1 — Vì sao cần generics: giữ lại kiểu',
  slug: 'typescript-6-1-why-generics',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở Chương 6: một hàm dùng cho "mọi kiểu" mà viết any[] thì VỨT kiểu trên đường ra — firstOf(users) thành any, gõ sai .emial không ai bắt, .name.toFixed() sập runtime. Một tham số kiểu T (generic) nối đầu vào với đầu ra: firstOf<T>(arr: T[]): T | undefined ⇒ firstOf(users) là User | undefined (typo thành TS2551, giữ kiểu). tsc TỰ suy T từ đối số (identity(42) ⇒ number); khi không có gì để suy (firstOf([]) ⇒ T=never) thì ghi <T> tường minh. Hai tham số kiểu (pair<A,B>). Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Why generics: keep the type</h2>
<p class="lead">You keep writing the same helper — the first item of an array, a repository, a success-or-failure result — and each one should work for <em>any</em> type while keeping that type. The sloppy way is <code>any</code>, which makes it compile and throws the type away. The right way is a <strong>generic</strong> (kiểu tổng quát): a type parameter that links the input to the output, so <code>firstOf(users)</code> gives you a <code>User</code>, not an <code>any</code>. This chapter is how you write reusable, type-safe code — and it ends with LabFlow’s generic <code>Repo</code> and <code>Result</code>.</p>

<h3>After Chapter 6 you can…</h3>
<ul>
<li><strong>Write a generic function</strong> that keeps the type, and let tsc infer the type parameter (this lesson).</li>
<li><strong>Constrain a type parameter</strong> with <code>extends</code>, and read a property’s type with <code>keyof</code> and indexed access (6.2).</li>
<li><strong>Write generic interfaces, classes and type aliases</strong>, with default type parameters — LabFlow’s <code>Result&lt;T, E&gt;</code> and <code>Repo&lt;T&gt;</code> (6.3).</li>
<li><strong>Use inference well and avoid the traps</strong>: the return-only generic that proves nothing, the needless generic, literal widening (6.4).</li>
<li><strong>Pass Lab 6</strong>: a generic repository and <code>groupBy</code>, where <code>any</code> scores low and the constraint catches wrong types.</li>
</ul>
<p>Why it matters: generics are how every library you use — arrays, <code>Map</code>, <code>Promise</code>, React’s <code>useState</code>, Zod, Prisma — stays type-safe without one copy per type. Interviewers ask “what is a generic?”, “what does the constraint <code>T extends …</code> do?”, “why not just use <code>any</code>?” — you will answer with output you ran.</p>

<h3>The sloppy way: <code>any</code> throws the type away</h3>
${ma('typescript', CODE.anyFirst)}
${ra(OUT['11-any-tsc'])}
${ra(OUT['12-any-run'])}
<p>tsc reports <strong>0 errors</strong>, and the program crashes. Because <code>firstOf</code> returns <code>any</code>, the typo <code>u.emial</code> is accepted (prints <code>undefined</code>), and <code>u.name.toFixed(2)</code> — calling a number method on a string — is accepted too, then throws at runtime. <code>any</code> made the function reusable by making it useless: it works for every type by checking none.</p>

<h3>The right way: a type parameter</h3>
<p>A <strong>type parameter</strong> <code>T</code> is a placeholder for a type, chosen fresh at each call. Put it in the parameter <em>and</em> the return, and the output is linked to the input:</p>
${ma('typescript', CODE.genericFirst)}
${ra(OUT['13-generic'])}
<p>Now <code>firstOf(users)</code> has type <code>User | undefined</code> (the <code>| undefined</code> because an array may be empty, 2.1). The typo is <strong>TS2551: Property 'emial' does not exist on type 'User'. Did you mean 'email'?</strong> — the exact type is kept, so tsc can check it. Run the fixed version and the type follows every call:</p>
${ma('typescript', CODE.genericRun)}
${ra(OUT['14-generic-run'])}
<p><code>firstOf(users)</code> is a <code>User</code>, <code>firstOf(names)</code> is a <code>string</code>, <code>firstOf([])</code> is <code>undefined</code> — one function, every type, each one kept. Read <code>&lt;T&gt;</code> as “for any type T”.</p>

<h3>You rarely write <code>&lt;T&gt;</code>: inference</h3>
${ma('typescript', CODE.inferCalls)}
${ra(OUT['15-infer'])}
<p>tsc fills in <code>T</code> from the argument: <code>identity(42)</code> infers <code>T = number</code>, <code>identity('BE-201')</code> infers <code>string</code>. You write the type argument explicitly only when there is nothing to infer from — <code>identity&lt;boolean&gt;(true)</code> here is for clarity; the real need is next.</p>

<h3>When there is nothing to infer: write it</h3>
${ma('typescript', CODE.explicit)}
${ra(OUT['17-explicit'])}
<p>An empty array literal has no element to infer <code>T</code> from, so <code>T</code> becomes <code>never</code> and the result is <code>undefined</code>. Reading <code>.length</code> off it is <strong>TS2532</strong>. Give the type argument explicitly — <code>firstOf&lt;string&gt;([])</code> — when the call cannot supply it.</p>

<h3>Two type parameters</h3>
${ma('typescript', CODE.pair)}
${ra(OUT['16-pair'])}
<p>A function can take as many type parameters as it needs, each independent. <code>pair('BE-201', 40)</code> infers <code>A = string</code>, <code>B = number</code>, so the tuple is <code>[string, number]</code> and destructuring keeps both — <code>code.toUpperCase()</code> and <code>seats.toFixed(0)</code> are each type-checked. This is exactly how <code>Map&lt;K, V&gt;</code> and <code>Promise&lt;T&gt;</code> are declared.</p>

<h3>Which form, when</h3>
${BANG_EN}

<h3>🗺 How a generic keeps the type</h3>
${FLOW_EN}

<h3>💼 Interview corner</h3>
<p><strong>“What is a generic?”</strong> A type parameter — a placeholder for a type chosen per call — that links parts of a signature so the type flows through. <strong>“Why not just <code>any</code>?”</strong> <code>any</code> turns checking off: the function compiles for every type by verifying none, so typos and wrong calls pass and crash at runtime. A generic keeps the exact type. <strong>“Do you have to write the type argument?”</strong> Usually no — tsc infers it from the arguments; you write it only when there is nothing to infer from (an empty array, a return-only position).</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo6/ts-06-1/practice/start/last.ts</code> — <code>lastOf</code> returns the last element but is typed <code>any</code>, so a typo on the result is not caught:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['18-pr-start'])}
<ol>
<li>tsc is clean (that is the problem). Make <code>lastOf</code> generic so it keeps the element type.</li>
<li>After <code>lastOf&lt;T&gt;(arr: T[]): T | undefined</code>, the typo becomes a compile error; then fix it to <code>?.name</code>.</li>
</ol>
<p><strong>Solution</strong>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['19-pr-sol'])}
<p><strong>Done when:</strong> the typo is TS2551 before the fix, and Node prints <code>An</code> after. Code Lab has more: a generic <code>firstOf</code>, <code>pair</code>, and spotting a needless type parameter.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">generic</span><span class="v">A function/type with a type parameter, reusable across types while keeping them.</span></div>
  <div class="kv"><span class="k">type parameter (<code>&lt;T&gt;</code>)</span><span class="v">A placeholder for a type, chosen per call: <code>firstOf&lt;T&gt;</code>.</span></div>
  <div class="kv"><span class="k">type argument</span><span class="v">The concrete type a call uses: <code>firstOf&lt;string&gt;([])</code>; usually inferred.</span></div>
  <div class="kv"><span class="k">inference</span><span class="v">tsc choosing the type parameter from the arguments — no <code>&lt;T&gt;</code> needed.</span></div>
  <div class="kv"><span class="k">any vs generic</span><span class="v"><code>any</code> drops the type (no checks); a generic keeps it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>any[]</code> → <code>any</code> loses the type: a typo and a wrong method both compiled, then crashed.</li>
<li>A type parameter <code>&lt;T&gt;</code> used in the parameter and return links them: <code>firstOf(users)</code> is <code>User | undefined</code>, and a typo is TS2551.</li>
<li>tsc infers the type argument from the arguments; write it explicitly only when there is nothing to infer (<code>firstOf([])</code> makes <code>T = never</code>).</li>
<li>Multiple type parameters (<code>pair&lt;A, B&gt;</code>) are independent and all kept.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Generics', 'Type parameters, generic functions, inference, multiple parameters. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/generics.html')}
${nguon('📘', 'TypeScript Handbook — More on Functions', 'Generic functions and when to specify type arguments. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html#generic-functions')}
${lienKet({ khoa: 'react', bai: 'rx-2-1-use-state', title: 'The generic you use every day — React 2.1: useState', sub: 'Same: <code>useState&lt;T&gt;</code> is a generic — the type parameter keeps the type, so <code>useState(0)</code> gives a <code>number</code> setter and <code>useState&lt;User | null&gt;(null)</code> keeps the shape. Different: here you write the generic function (<code>firstOf&lt;T&gt;</code>) and let tsc infer T; 6.2–6.4 add constraints, generic classes, and the inference pitfalls behind a hook like useState.', cta: 'OPEN REACT LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Vì sao cần generics: giữ lại kiểu</h2>
<p class="lead">Bạn cứ viết đi viết lại cùng một hàm tiện ích — phần tử đầu của mảng, một repository, một kết quả thành-công-hoặc-thất-bại — và mỗi cái nên chạy cho <em>mọi</em> kiểu mà vẫn giữ kiểu đó. Cách cẩu thả là <code>any</code>, làm nó biên dịch và vứt kiểu đi. Cách đúng là <strong>generic</strong> (kiểu tổng quát): một tham số kiểu nối đầu vào với đầu ra, nên <code>firstOf(users)</code> cho bạn một <code>User</code>, không phải <code>any</code>. Chương này là cách viết code dùng lại được và an toàn kiểu — và kết thúc bằng <code>Repo</code> và <code>Result</code> generic của LabFlow.</p>

<h3>Học xong Chương 6 bạn làm được…</h3>
<ul>
<li><strong>Viết một hàm generic</strong> giữ lại kiểu, và để tsc tự suy tham số kiểu (bài này).</li>
<li><strong>Ràng buộc một tham số kiểu</strong> bằng <code>extends</code>, và đọc kiểu của một thuộc tính bằng <code>keyof</code> và truy cập theo chỉ mục (6.2).</li>
<li><strong>Viết interface, class và type alias generic</strong>, có tham số kiểu mặc định — <code>Result&lt;T, E&gt;</code> và <code>Repo&lt;T&gt;</code> của LabFlow (6.3).</li>
<li><strong>Dùng suy kiểu tốt và tránh bẫy</strong>: generic chỉ ở kiểu trả về (không chứng minh gì), generic thừa, nới rộng literal (6.4).</li>
<li><strong>Qua Lab 6</strong>: một repository generic và <code>groupBy</code>, nơi <code>any</code> điểm thấp và ràng buộc bắt được kiểu sai.</li>
</ul>
<p>Vì sao quan trọng: generics là cách mọi thư viện bạn dùng — mảng, <code>Map</code>, <code>Promise</code>, <code>useState</code> của React, Zod, Prisma — giữ an toàn kiểu mà không cần một bản sao cho mỗi kiểu. Nhà tuyển dụng hay hỏi “generic là gì?”, “ràng buộc <code>T extends …</code> làm gì?”, “sao không dùng luôn <code>any</code>?” — bạn sẽ trả lời bằng output tự chạy.</p>

<h3>Cách cẩu thả: <code>any</code> vứt kiểu đi</h3>
${ma('typescript', CODE.anyFirst)}
${ra(OUT['11-any-tsc'])}
${ra(OUT['12-any-run'])}
<p>tsc báo <strong>0 lỗi</strong>, và chương trình sập. Vì <code>firstOf</code> trả về <code>any</code>, lỗi gõ <code>u.emial</code> được nhận (in <code>undefined</code>), và <code>u.name.toFixed(2)</code> — gọi method của số trên một chuỗi — cũng được nhận, rồi ném lỗi lúc chạy. <code>any</code> làm hàm dùng lại được bằng cách làm nó vô dụng: chạy cho mọi kiểu bằng cách không kiểm cái nào.</p>

<h3>Cách đúng: một tham số kiểu</h3>
<p>Một <strong>tham số kiểu</strong> <code>T</code> là chỗ giữ cho một kiểu, chọn mới ở mỗi lần gọi. Đặt nó vào tham số <em>và</em> kiểu trả về, thế là đầu ra gắn với đầu vào:</p>
${ma('typescript', CODE.genericFirst)}
${ra(OUT['13-generic'])}
<p>Giờ <code>firstOf(users)</code> có kiểu <code>User | undefined</code> (<code>| undefined</code> vì mảng có thể rỗng, 2.1). Lỗi gõ là <strong>TS2551: Property 'emial' does not exist on type 'User'. Did you mean 'email'?</strong> — kiểu chính xác được giữ, nên tsc kiểm được. Chạy bản đã sửa và kiểu đi theo mọi lần gọi:</p>
${ma('typescript', CODE.genericRun)}
${ra(OUT['14-generic-run'])}
<p><code>firstOf(users)</code> là một <code>User</code>, <code>firstOf(names)</code> là một <code>string</code>, <code>firstOf([])</code> là <code>undefined</code> — một hàm, mọi kiểu, cái nào cũng được giữ. Đọc <code>&lt;T&gt;</code> là “với một kiểu T bất kỳ”.</p>

<h3>Hiếm khi phải viết <code>&lt;T&gt;</code>: suy kiểu</h3>
${ma('typescript', CODE.inferCalls)}
${ra(OUT['15-infer'])}
<p>tsc điền <code>T</code> từ đối số: <code>identity(42)</code> suy <code>T = number</code>, <code>identity('BE-201')</code> suy <code>string</code>. Bạn chỉ viết đối số kiểu tường minh khi không có gì để suy — <code>identity&lt;boolean&gt;(true)</code> ở đây là cho rõ; nhu cầu thật nằm ngay dưới.</p>

<h3>Khi không có gì để suy: hãy viết ra</h3>
${ma('typescript', CODE.explicit)}
${ra(OUT['17-explicit'])}
<p>Một mảng rỗng không có phần tử để suy <code>T</code>, nên <code>T</code> thành <code>never</code> và kết quả là <code>undefined</code>. Đọc <code>.length</code> của nó là <strong>TS2532</strong>. Hãy ghi đối số kiểu tường minh — <code>firstOf&lt;string&gt;([])</code> — khi lời gọi không cung cấp được.</p>

<h3>Hai tham số kiểu</h3>
${ma('typescript', CODE.pair)}
${ra(OUT['16-pair'])}
<p>Một hàm nhận bao nhiêu tham số kiểu tuỳ nhu cầu, mỗi cái độc lập. <code>pair('BE-201', 40)</code> suy <code>A = string</code>, <code>B = number</code>, nên tuple là <code>[string, number]</code> và destructuring giữ cả hai — <code>code.toUpperCase()</code> và <code>seats.toFixed(0)</code> mỗi cái được kiểm kiểu. Đây chính là cách <code>Map&lt;K, V&gt;</code> và <code>Promise&lt;T&gt;</code> được khai báo.</p>

<h3>Dạng nào, khi nào</h3>
${BANG_VI}

<h3>🗺 Generic giữ kiểu thế nào</h3>
${FLOW_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Generic là gì?”</strong> Một tham số kiểu — chỗ giữ cho một kiểu chọn theo lần gọi — nối các phần của chữ ký để kiểu chảy qua. <strong>“Sao không dùng luôn <code>any</code>?”</strong> <code>any</code> tắt kiểm: hàm biên dịch cho mọi kiểu bằng cách không kiểm cái nào, nên lỗi gõ và lời gọi sai lọt qua rồi sập lúc chạy. Generic giữ kiểu chính xác. <strong>“Có phải viết đối số kiểu không?”</strong> Thường không — tsc suy từ đối số; chỉ viết khi không có gì để suy (mảng rỗng, vị trí chỉ-trả-về).</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo6/ts-06-1/practice/start/last.ts</code> — <code>lastOf</code> trả phần tử cuối nhưng có kiểu <code>any</code>, nên lỗi gõ trên kết quả không bị bắt:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['18-pr-start'])}
<ol>
<li>tsc sạch (đó là vấn đề). Làm <code>lastOf</code> generic để nó giữ kiểu phần tử.</li>
<li>Sau <code>lastOf&lt;T&gt;(arr: T[]): T | undefined</code>, lỗi gõ thành lỗi biên dịch; rồi sửa thành <code>?.name</code>.</li>
</ol>
<p><strong>Lời giải</strong>:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['19-pr-sol'])}
<p><strong>Đạt khi:</strong> lỗi gõ là TS2551 trước khi sửa, và Node in <code>An</code> sau khi sửa. Code Lab có thêm: một <code>firstOf</code> generic, <code>pair</code>, và nhận ra một tham số kiểu thừa.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">generic (kiểu tổng quát)</span><span class="v">Một hàm/kiểu có tham số kiểu, dùng lại cho nhiều kiểu mà vẫn giữ chúng.</span></div>
  <div class="kv"><span class="k">type parameter (<code>&lt;T&gt;</code>)</span><span class="v">Chỗ giữ cho một kiểu, chọn theo lần gọi: <code>firstOf&lt;T&gt;</code>.</span></div>
  <div class="kv"><span class="k">type argument (đối số kiểu)</span><span class="v">Kiểu cụ thể một lời gọi dùng: <code>firstOf&lt;string&gt;([])</code>; thường được suy.</span></div>
  <div class="kv"><span class="k">inference (suy kiểu)</span><span class="v">tsc chọn tham số kiểu từ đối số — không cần <code>&lt;T&gt;</code>.</span></div>
  <div class="kv"><span class="k">any so với generic</span><span class="v"><code>any</code> vứt kiểu (không kiểm); generic giữ kiểu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>any[]</code> → <code>any</code> làm mất kiểu: một lỗi gõ và một method sai đều biên dịch, rồi sập.</li>
<li>Một tham số kiểu <code>&lt;T&gt;</code> dùng trong tham số và kiểu trả về nối chúng lại: <code>firstOf(users)</code> là <code>User | undefined</code>, và lỗi gõ là TS2551.</li>
<li>tsc suy đối số kiểu từ đối số; chỉ viết tường minh khi không có gì để suy (<code>firstOf([])</code> làm <code>T = never</code>).</li>
<li>Nhiều tham số kiểu (<code>pair&lt;A, B&gt;</code>) độc lập và đều được giữ.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Generics', 'Tham số kiểu, hàm generic, suy kiểu, nhiều tham số. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/generics.html')}
${nguon('📘', 'TypeScript Handbook — More on Functions', 'Hàm generic và khi nào ghi đối số kiểu. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/functions.html#generic-functions')}
${lienKet({ khoa: 'react', bai: 'rx-2-1-use-state', title: 'Generic bạn dùng mỗi ngày — React 2.1: useState', sub: 'Giống: <code>useState&lt;T&gt;</code> là một generic — tham số kiểu giữ lại kiểu, nên <code>useState(0)</code> cho một setter <code>number</code> còn <code>useState&lt;User | null&gt;(null)</code> giữ dáng. Khác: ở đây bạn viết hàm generic (<code>firstOf&lt;T&gt;</code>) và để tsc suy T; 6.2–6.4 thêm ràng buộc, class generic, và các bẫy suy kiểu đằng sau một hook như useState.', cta: 'MỞ BÀI REACT →' })}
</div>
`,
};
