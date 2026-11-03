/**
 * TypeScript · Chương 6 · 6.4 — Generics thực chiến: suy kiểu & bẫy thường gặp. Slug giữ: typescript-6-4-generics-in-practice.
 * Soạn lại TRỌN 03/11/2026 theo ./_HOP-DONG.md. Code/output từ ./_ma-ts-06-4.mjs (demo6/ts-06-4, Node 22.23.3 + tsc 7.0.2).
 */
import G from '../giang/ts-06-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-06-4.mjs';

const BANG_EN = `<table>
<thead><tr><th>Smell</th><th>Why it is wrong</th><th>Do this instead</th></tr></thead>
<tbody>
<tr><td><code>parseJson&lt;T&gt;(s: string): T</code></td><td>T appears only in the return — tsc checks nothing, the caller lies to itself</td><td>return <code>unknown</code> and narrow with a guard (1.4, 5.x)</td></tr>
<tr><td><code>countGeneric&lt;T&gt;(items: T[]): number</code></td><td>T is never used in the result — a needless parameter</td><td><code>count(items: readonly unknown[]): number</code></td></tr>
<tr><td><code>firstOf(['a', 'b'])</code> widens to <code>string</code></td><td>a literal array widens — you lose <code>'a' | 'b'</code></td><td><code>as const</code> at the call, or <code>&lt;const T&gt;</code> on the parameter</td></tr>
<tr><td><code>function f&lt;T&gt;(x: T, y: T)</code> mixing types</td><td>tsc infers the common type, hiding a mismatch</td><td>two parameters <code>&lt;A, B&gt;</code>, or the exact type you mean</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Mùi code</th><th>Vì sao sai</th><th>Làm thế này</th></tr></thead>
<tbody>
<tr><td><code>parseJson&lt;T&gt;(s: string): T</code></td><td>T chỉ ở kiểu trả về — tsc không kiểm gì, người gọi tự nói dối</td><td>trả <code>unknown</code> và narrow bằng guard (1.4, 5.x)</td></tr>
<tr><td><code>countGeneric&lt;T&gt;(items: T[]): number</code></td><td>T không bao giờ dùng ở kết quả — tham số thừa</td><td><code>count(items: readonly unknown[]): number</code></td></tr>
<tr><td><code>firstOf(['a', 'b'])</code> nới thành <code>string</code></td><td>mảng literal bị nới — mất <code>'a' | 'b'</code></td><td><code>as const</code> ở lời gọi, hoặc <code>&lt;const T&gt;</code> trên tham số</td></tr>
<tr><td><code>function f&lt;T&gt;(x: T, y: T)</code> trộn kiểu</td><td>tsc suy kiểu chung, giấu một chỗ lệch</td><td>hai tham số <code>&lt;A, B&gt;</code>, hoặc đúng kiểu bạn muốn</td></tr>
</tbody>
</table>`;

export default {
  title: '6.4 — Generics in practice: inference & pitfalls|||6.4 — Generics thực chiến: suy kiểu & bẫy thường gặp',
  slug: 'typescript-6-4-generics-in-practice',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Suy kiểu tốt và bốn bẫy. Inference từ đối số (groupBy(users, u => u.role) tự suy T=User, K=Role — không viết <...>). Bẫy 1: generic chỉ ở kiểu trả về (parseJson<T>(s): T) biên dịch 0 lỗi mà KHÔNG kiểm gì — một lời nói dối người gọi tự viết; trả unknown + guard. Bẫy 2: generic thừa (T không nối in→out) = chỉ unknown[]. Bẫy 3: literal nới rộng (firstOf(["a","b"]) ra string) — dùng as const hoặc tham số <const T> (TS 5.0+ giữ literal). Đo thật tsc 7.0.2 + Node 22.23.3.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Generics in practice: inference &amp; pitfalls</h2>
<p class="lead">Generics are easy to write and easy to misuse. The good news is that inference does most of the work — you call <code>groupBy(users, u =&gt; u.role)</code> and tsc fills in both type parameters. The bad news is that a generic can look safe while checking nothing. This lesson shows inference working on LabFlow’s <code>groupBy</code>, then the three traps that turn a generic into theatre: the return-only parameter, the needless parameter, and literal widening.</p>

<h3>Inference does the work</h3>
${ma('typescript', CODE.inferGroup)}
${ra(OUT['11-infer'])}
<p><code>groupBy(users, (u) =&gt; u.role)</code> — no type arguments. tsc infers <code>T = User</code> from the array and <code>K = Role</code> from the key function’s return, so <code>byRole</code> is <code>Map&lt;Role, User[]&gt;</code>: <code>byRole.get('STUDENT')</code> is <code>User[] | undefined</code> and <code>u.name</code> is checked. This is Lab 6’s <code>groupBy</code>, used exactly as you will use it — the generics are invisible because inference carried them.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap 1 — a type parameter only in the return checks nothing.</strong> If <code>T</code> appears in the return type but not in any parameter, tsc has nothing to check it against — the caller is really just asserting a type:</p>
${ma('typescript', CODE.parseReturn)}
${ra(OUT['12-returnonly'])}
<p><strong>0 errors</strong>, and the data is wrong: <code>id</code> is the string <code>"oops"</code> where the type promised a <code>number</code>. <code>parseJson&lt;User[]&gt;(…)</code> reads like a check, but it is a cast in disguise — the same unsafe move as <code>JSON.parse(…) as User[]</code> (1.4). When the shape comes from outside, return <code>unknown</code> and narrow it with a real guard; do not let a generic promise a type nobody verified.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap 2 — a type parameter used once is just noise.</strong> A generic only earns its keep when <code>T</code> <em>connects</em> parts of the signature — usually an input to the output. If it does not, it is a needless parameter:</p>
${ma('typescript', CODE.needlessCount)}
${ra(OUT['13-needless'])}
<p>Both functions do the same thing and compile the same way; <code>countGeneric&lt;T&gt;</code> never uses <code>T</code> in its result, so the type parameter buys nothing — <code>count(items: readonly unknown[])</code> is honest and shorter. Rule of thumb: if a type parameter appears exactly once, you do not need it.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap 3 — literals widen, so a generic may be looser than you think.</strong> A plain array literal widens its elements, so inference gives you the wide type:</p>
${ma('typescript', CODE.widenFirst)}
${ra(OUT['14-widen'])}
<p><code>firstOf(['BE-201', 'AL-301'])</code> infers <code>T = string</code> (the literals widened), so the result is <code>string | undefined</code> — the exact codes are gone. Add <code>as const</code> at the call and the literals are kept: <code>T = 'BE-201' | 'AL-301'</code>. Since TypeScript 5.0 you can put the preference on the parameter itself with a <code>const</code> type parameter, so callers need no <code>as const</code>:</p>
${ma('typescript', CODE.constpFirst)}
${ra(OUT['15-constp'])}
<p><code>firstOf&lt;const T&gt;(…)</code> infers the narrowest type, as if the caller wrote <code>as const</code> — so <code>firstOf(['BE-201', 'AL-301'])</code> is <code>'BE-201' | 'AL-301' | undefined</code> with nothing extra written. Reach for it when a helper should keep the exact literals it was given (a list of codes, a tuple).</p>
</div>

<h3>Generic smells &amp; fixes</h3>
${BANG_EN}

<h3>💼 Interview corner</h3>
<p><strong>“When does a generic check nothing?”</strong> When the type parameter is only in the return position (<code>f&lt;T&gt;(): T</code>) — there is nothing to infer it against, so the caller is asserting; return <code>unknown</code> and narrow. <strong>“How do you know a generic is needless?”</strong> If the type parameter appears once and does not link input to output, drop it (<code>unknown[]</code> instead). <strong>“Why did my literals become <code>string</code>?”</strong> Array literals widen; use <code>as const</code> at the call or a <code>const</code> type parameter to keep them.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p><code>demo6/ts-06-4/practice/start/load.ts</code> — <code>loadUsers&lt;T&gt;</code> returns <code>T</code>, so the caller names a type nobody checked; the data can be garbage:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<ol>
<li>tsc is clean (the problem). Remove the misleading type parameter: return <code>User[]</code> and verify the data with a real guard (5.3).</li>
<li>Only valid users survive.</li>
</ol>
<p><strong>Solution</strong> — a guard, not a promise:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['17-pr-sol'])}
<p><strong>Done when:</strong> the bad record is filtered out and Node prints <code>1</code>. Code Lab adds: a <code>groupBy</code> whose generics are all inferred, a return-only generic to fix, and a needless type parameter to remove.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">inference</span><span class="v">tsc choosing type parameters from the arguments — most generic calls need no <code>&lt;…&gt;</code>.</span></div>
  <div class="kv"><span class="k">return-only generic</span><span class="v"><code>f&lt;T&gt;(): T</code> — nothing checks T; a cast in disguise.</span></div>
  <div class="kv"><span class="k">needless generic</span><span class="v">A type parameter used once, not linking input to output.</span></div>
  <div class="kv"><span class="k">widening</span><span class="v">A literal array becomes <code>string[]</code>; <code>as const</code> keeps the literals.</span></div>
  <div class="kv"><span class="k"><code>const</code> type parameter</span><span class="v"><code>&lt;const T&gt;</code> (TS 5.0+) — infer the narrowest type, no <code>as const</code> at the call.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Inference fills in type parameters from the arguments: <code>groupBy(users, u =&gt; u.role)</code> needs no <code>&lt;…&gt;</code>.</li>
<li>A type parameter only in the return (<code>parseJson&lt;T&gt;</code>) checks nothing — 0 errors, wrong data; return <code>unknown</code> and narrow.</li>
<li>A type parameter used once is needless — <code>unknown[]</code> is honest.</li>
<li>Literals widen; keep them with <code>as const</code> or a <code>const</code> type parameter.</li>
</ul>

<h3>📚 Sources</h3>
${nguon('📘', 'TypeScript Handbook — Generics: when to use type parameters', 'Guidance on pushing type parameters and when not to add one. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-parameter-defaults')}
${nguon('📘', 'TypeScript 5.0 — const type parameters', 'const on a type parameter keeps the narrowest inferred type. Read 3 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters')}
${lienKet({ khoa: 'api-design', bai: 'api-2-2-validation', title: 'Why a type is not a check — API Design 2.2: Validating input at the edge', sub: 'Same: a type on incoming data (<code>parseJson&lt;User[]&gt;</code>) proves nothing — the data can still be garbage, exactly like trusting a request body because it is typed. Different: there the fix is a runtime schema (Zod) that validates and returns a 400; here the TypeScript lesson is that a return-only generic is a cast in disguise, and the honest fix is to return <code>unknown</code> and narrow with a guard.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Generics thực chiến: suy kiểu &amp; bẫy thường gặp</h2>
<p class="lead">Generics dễ viết và dễ dùng sai. Tin tốt là suy kiểu làm phần lớn việc — bạn gọi <code>groupBy(users, u =&gt; u.role)</code> và tsc điền cả hai tham số kiểu. Tin xấu là một generic có thể trông an toàn mà không kiểm gì. Bài này cho thấy suy kiểu hoạt động trên <code>groupBy</code> của LabFlow, rồi ba cái bẫy biến một generic thành diễn trò: tham số chỉ-trả-về, tham số thừa, và nới rộng literal.</p>

<h3>Suy kiểu làm việc</h3>
${ma('typescript', CODE.inferGroup)}
${ra(OUT['11-infer'])}
<p><code>groupBy(users, (u) =&gt; u.role)</code> — không đối số kiểu. tsc suy <code>T = User</code> từ mảng và <code>K = Role</code> từ kiểu trả về của hàm khoá, nên <code>byRole</code> là <code>Map&lt;Role, User[]&gt;</code>: <code>byRole.get('STUDENT')</code> là <code>User[] | undefined</code> và <code>u.name</code> được kiểm. Đây là <code>groupBy</code> của Lab 6, dùng đúng như bạn sẽ dùng — generic vô hình vì suy kiểu gánh hết.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy 1 — một tham số kiểu chỉ ở kiểu trả về thì không kiểm gì.</strong> Nếu <code>T</code> xuất hiện ở kiểu trả về mà không ở tham số nào, tsc chẳng có gì để kiểm nó — người gọi thật ra chỉ đang khẳng định một kiểu:</p>
${ma('typescript', CODE.parseReturn)}
${ra(OUT['12-returnonly'])}
<p><strong>0 lỗi</strong>, và dữ liệu sai: <code>id</code> là chuỗi <code>"oops"</code> ở chỗ kiểu hứa một <code>number</code>. <code>parseJson&lt;User[]&gt;(…)</code> đọc như một phép kiểm, nhưng là một phép ép kiểu trá hình — cùng nước đi không an toàn như <code>JSON.parse(…) as User[]</code> (1.4). Khi dáng đến từ bên ngoài, hãy trả <code>unknown</code> và narrow bằng một guard thật; đừng để một generic hứa một kiểu không ai kiểm.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy 2 — một tham số kiểu dùng một lần chỉ là nhiễu.</strong> Một generic chỉ đáng khi <code>T</code> <em>nối</em> các phần của chữ ký — thường là đầu vào với đầu ra. Nếu không, nó là một tham số thừa:</p>
${ma('typescript', CODE.needlessCount)}
${ra(OUT['13-needless'])}
<p>Hai hàm làm cùng một việc và biên dịch như nhau; <code>countGeneric&lt;T&gt;</code> không bao giờ dùng <code>T</code> ở kết quả, nên tham số kiểu chẳng mua được gì — <code>count(items: readonly unknown[])</code> trung thực và ngắn hơn. Quy tắc nhớ: nếu một tham số kiểu xuất hiện đúng một lần, bạn không cần nó.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy 3 — literal bị nới, nên một generic có thể lỏng hơn bạn tưởng.</strong> Một mảng literal thường nới rộng phần tử, nên suy kiểu cho bạn kiểu rộng:</p>
${ma('typescript', CODE.widenFirst)}
${ra(OUT['14-widen'])}
<p><code>firstOf(['BE-201', 'AL-301'])</code> suy <code>T = string</code> (literal bị nới), nên kết quả là <code>string | undefined</code> — các mã chính xác mất đi. Thêm <code>as const</code> ở lời gọi thì literal được giữ: <code>T = 'BE-201' | 'AL-301'</code>. Từ TypeScript 5.0 bạn đặt được ý muốn ngay trên tham số bằng một <code>const</code> type parameter, nên người gọi không cần <code>as const</code>:</p>
${ma('typescript', CODE.constpFirst)}
${ra(OUT['15-constp'])}
<p><code>firstOf&lt;const T&gt;(…)</code> suy kiểu hẹp nhất, như thể người gọi viết <code>as const</code> — nên <code>firstOf(['BE-201', 'AL-301'])</code> là <code>'BE-201' | 'AL-301' | undefined</code> mà không viết thêm gì. Dùng nó khi một hàm nên giữ đúng literal nó được cho (một danh sách mã, một tuple).</p>
</div>

<h3>Mùi generic &amp; cách sửa</h3>
${BANG_VI}

<h3>💼 Góc phỏng vấn</h3>
<p><strong>“Khi nào một generic không kiểm gì?”</strong> Khi tham số kiểu chỉ ở vị trí trả về (<code>f&lt;T&gt;(): T</code>) — không có gì để suy nó, nên người gọi đang khẳng định; trả <code>unknown</code> và narrow. <strong>“Làm sao biết một generic thừa?”</strong> Nếu tham số kiểu xuất hiện một lần và không nối in→out, bỏ nó (<code>unknown[]</code>). <strong>“Sao literal của tôi thành <code>string</code>?”</strong> Mảng literal nới rộng; dùng <code>as const</code> ở lời gọi hoặc một <code>const</code> type parameter để giữ.</p>

<h3>🧪 Luyện tập (15 phút)</h3>
<div class="callout ok">
<p><code>demo6/ts-06-4/practice/start/load.ts</code> — <code>loadUsers&lt;T&gt;</code> trả <code>T</code>, nên người gọi đặt tên một kiểu không ai kiểm; dữ liệu có thể là rác:</p>
${ma('typescript', CODE.prStart)}
${ra(OUT['16-pr-start'])}
<ol>
<li>tsc sạch (vấn đề). Bỏ tham số kiểu gây hiểu lầm: trả <code>User[]</code> và kiểm dữ liệu bằng một guard thật (5.3).</li>
<li>Chỉ user hợp lệ sống sót.</li>
</ol>
<p><strong>Lời giải</strong> — một guard, không phải một lời hứa:</p>
${ma('typescript', CODE.prSol)}
${ra(OUT['17-pr-sol'])}
<p><strong>Đạt khi:</strong> bản ghi xấu bị lọc và Node in <code>1</code>. Code Lab thêm: một <code>groupBy</code> generic đều được suy, một generic chỉ-trả-về cần sửa, và một tham số kiểu thừa cần bỏ.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">inference (suy kiểu)</span><span class="v">tsc chọn tham số kiểu từ đối số — phần lớn lời gọi generic không cần <code>&lt;…&gt;</code>.</span></div>
  <div class="kv"><span class="k">return-only generic</span><span class="v"><code>f&lt;T&gt;(): T</code> — không gì kiểm T; một phép ép kiểu trá hình.</span></div>
  <div class="kv"><span class="k">needless generic (generic thừa)</span><span class="v">Tham số kiểu dùng một lần, không nối in→out.</span></div>
  <div class="kv"><span class="k">widening (nới rộng)</span><span class="v">Mảng literal thành <code>string[]</code>; <code>as const</code> giữ literal.</span></div>
  <div class="kv"><span class="k"><code>const</code> type parameter</span><span class="v"><code>&lt;const T&gt;</code> (TS 5.0+) — suy kiểu hẹp nhất, không cần <code>as const</code> ở lời gọi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Suy kiểu điền tham số kiểu từ đối số: <code>groupBy(users, u =&gt; u.role)</code> không cần <code>&lt;…&gt;</code>.</li>
<li>Tham số kiểu chỉ ở kiểu trả về (<code>parseJson&lt;T&gt;</code>) không kiểm gì — 0 lỗi, dữ liệu sai; trả <code>unknown</code> và narrow.</li>
<li>Tham số kiểu dùng một lần là thừa — <code>unknown[]</code> trung thực.</li>
<li>Literal bị nới; giữ bằng <code>as const</code> hoặc một <code>const</code> type parameter.</li>
</ul>

<h3>📚 Nguồn</h3>
${nguon('📘', 'TypeScript Handbook — Generics: khi nào dùng tham số kiểu', 'Hướng dẫn đẩy tham số kiểu và khi nào không nên thêm. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-parameter-defaults')}
${nguon('📘', 'TypeScript 5.0 — const type parameters', 'const trên tham số kiểu giữ kiểu suy hẹp nhất. Đọc ngày 3/11/2026.', 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters')}
${lienKet({ khoa: 'api-design', bai: 'api-2-2-validation', title: 'Vì sao một cái kiểu không phải một phép kiểm — API Design 2.2: Kiểm dữ liệu vào ngay cửa', sub: 'Giống: một cái kiểu dán lên dữ liệu đến (<code>parseJson&lt;User[]&gt;</code>) không chứng minh gì — dữ liệu vẫn có thể là rác, y như tin một body request vì nó có kiểu. Khác: ở đó cách sửa là một schema lúc chạy (Zod) kiểm lệ và trả 400; ở đây bài học TypeScript là một generic chỉ-trả-về là một phép ép kiểu trá hình, và cách sửa trung thực là trả <code>unknown</code> rồi narrow bằng một guard.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
