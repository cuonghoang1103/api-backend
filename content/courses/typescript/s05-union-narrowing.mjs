/**
 * TypeScript — Chương 5: Union, literal & thu hẹp kiểu (narrowing).
 * Mọi output tsc là THẬT (tsc 7.0.2, --strict). Song ngữ .ml-en/.ml-vi.
 * < > trong code → &lt; &gt;; KHÔNG backtick trần (dùng &#96;); ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 5 — Unions, literals & narrowing|||Chương 5 — Union, literal & thu hẹp kiểu',
  description: 'Kiểu "một trong nhiều", thu hẹp bằng typeof/in/equality, discriminated union, và exhaustiveness với never — nơi TypeScript thật sự toả sáng.',
  lessons: [
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — Union types & narrowing|||5.1 — Kiểu union & thu hẹp kiểu',
      slug: 'typescript-5-1-union-narrowing',
      type: 'LESSON',
      isFreePreview: true,
      description: 'A | B nghĩa là "một trong hai", bạn chỉ dùng được phần chung cho tới khi thu hẹp bằng typeof — và trình biên dịch theo dõi luồng điều khiển.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Union types &amp; narrowing</h2>
<p class="lead">A union type — <code>A | B</code> — says "this value is one of these types, but I don't yet know which". Unions are where TypeScript starts to feel genuinely smart: it tracks your <code>if</code> checks and figures out, branch by branch, exactly which type you're holding.</p>

<h3>A value that could be one of several types</h3>
<p>You write a union with the <code>|</code> ("or") operator. It's the tool for "an id might be a string or a number", "a result is data or an error":</p>
<pre><code><span class="tok-keyword">type</span> Id = <span class="tok-keyword">string</span> | <span class="tok-keyword">number</span>;</code></pre>
<p>Here's the rule that surprises people first: before you narrow, you can only use members that exist on <em>every</em> type in the union. A number has no <code>.toUpperCase()</code>, so:</p>
<pre><code><span class="tok-comment">// union1.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">format</span>(id: <span class="tok-keyword">string</span> | <span class="tok-keyword">number</span>) {
  <span class="tok-keyword">return</span> id.<span class="tok-function">toUpperCase</span>();
}</code></pre>
<div class="out">union1.ts(2,13): error TS2339: Property 'toUpperCase' does not exist on type 'string | number'.
  Property 'toUpperCase' does not exist on type 'number'.</div>
<p>TypeScript refuses because <em>if</em> <code>id</code> is a number, <code>toUpperCase</code> would crash at runtime. The union protects you from using a member that only some of the possibilities have.</p>

<h3>Narrowing with typeof</h3>
<p>To use a type-specific member, you first prove which type you have. A <code>typeof</code> check does exactly that, and TypeScript <em>narrows</em> the type inside each branch:</p>
<pre><code><span class="tok-comment">// union2.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">format</span>(id: <span class="tok-keyword">string</span> | <span class="tok-keyword">number</span>): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">if</span> (<span class="tok-keyword">typeof</span> id === <span class="tok-string">'string'</span>) <span class="tok-keyword">return</span> id.<span class="tok-function">toUpperCase</span>();  <span class="tok-comment">// id is string here</span>
  <span class="tok-keyword">return</span> id.<span class="tok-function">toFixed</span>(<span class="tok-number">0</span>);                                <span class="tok-comment">// id is number here</span>
}</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Inside the <code>if</code>, TypeScript knows <code>id</code> is a <code>string</code>, so <code>.toUpperCase()</code> is allowed. After the <code>return</code>, the only remaining possibility is <code>number</code>, so <code>.toFixed()</code> is allowed. <strong>Hover <code>id</code> in each branch and watch the type change</strong> — this is control-flow narrowing, and it's the single most important thing to internalise about unions.</p>

<h3>The ways to narrow</h3>
<p><code>typeof</code> is one of several checks TypeScript understands as narrowing. You'll use all of these:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">typeof x === 'string'</span><span class="v">For primitives: string, number, boolean, etc.</span></div>
  <div class="kv"><span class="k">if (x)</span><span class="v">Truthiness — narrows away null, undefined, '', 0.</span></div>
  <div class="kv"><span class="k">x === 'draft'</span><span class="v">Equality — narrows a literal union to one member (next lesson).</span></div>
  <div class="kv"><span class="k">'permissions' in x</span><span class="v">Property presence — for object unions (next lesson).</span></div>
  <div class="kv"><span class="k">x instanceof Error</span><span class="v">For class instances.</span></div>
</div>
<div class="callout ok">The mental shift: a union isn't a weaker type, it's an <em>honest</em> one. It says "the value is genuinely one of these, so handle each case." The compiler then makes sure you actually do — turning "I forgot the number case" into a compile error instead of a production <code>NaN</code>.</div>
<div class="note-ct">This site's code is full of unions like <code>User | null</code> (a lookup that might miss) and <code>string | undefined</code> (an optional field). Every one forces the calling code, via narrowing, to handle the "missing" branch — which is a large part of why null-dereference crashes are rare here.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: unions &amp; narrowing on Code Lab</span><span class="lc-sub">Drill typeof and truthiness narrowing after this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Kiểu union &amp; thu hẹp kiểu</h2>
<p class="lead">Một kiểu union — <code>A | B</code> — nói "giá trị này là một trong các kiểu này, nhưng tôi chưa biết cái nào". Union là nơi TypeScript bắt đầu thấy thật sự thông minh: nó theo dõi các phép kiểm <code>if</code> của bạn và suy ra, từng nhánh một, chính xác bạn đang giữ kiểu nào.</p>

<h3>Một giá trị có thể là một trong nhiều kiểu</h3>
<p>Bạn viết union với toán tử <code>|</code> ("hoặc"). Nó là công cụ cho "một id có thể là chuỗi hoặc số", "một kết quả là dữ liệu hoặc một lỗi":</p>
<pre><code><span class="tok-keyword">type</span> Id = <span class="tok-keyword">string</span> | <span class="tok-keyword">number</span>;</code></pre>
<p>Đây là quy tắc làm người ta bất ngờ đầu tiên: trước khi thu hẹp, bạn chỉ dùng được các thành viên tồn tại trên <em>mọi</em> kiểu trong union. Một số không có <code>.toUpperCase()</code>, nên:</p>
<pre><code><span class="tok-comment">// union1.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">format</span>(id: <span class="tok-keyword">string</span> | <span class="tok-keyword">number</span>) {
  <span class="tok-keyword">return</span> id.<span class="tok-function">toUpperCase</span>();
}</code></pre>
<div class="out">union1.ts(2,13): error TS2339: Property 'toUpperCase' does not exist on type 'string | number'.
  Property 'toUpperCase' does not exist on type 'number'.</div>
<p>TypeScript từ chối vì <em>nếu</em> <code>id</code> là số, <code>toUpperCase</code> sẽ sập lúc chạy. Union bảo vệ bạn khỏi dùng một thành viên mà chỉ vài khả năng mới có.</p>

<h3>Thu hẹp bằng typeof</h3>
<p>Để dùng một thành viên riêng của kiểu, trước hết bạn chứng minh mình đang có kiểu nào. Một phép kiểm <code>typeof</code> làm đúng điều đó, và TypeScript <em>thu hẹp</em> kiểu bên trong mỗi nhánh:</p>
<pre><code><span class="tok-comment">// union2.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">format</span>(id: <span class="tok-keyword">string</span> | <span class="tok-keyword">number</span>): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">if</span> (<span class="tok-keyword">typeof</span> id === <span class="tok-string">'string'</span>) <span class="tok-keyword">return</span> id.<span class="tok-function">toUpperCase</span>();  <span class="tok-comment">// id là string ở đây</span>
  <span class="tok-keyword">return</span> id.<span class="tok-function">toFixed</span>(<span class="tok-number">0</span>);                                <span class="tok-comment">// id là number ở đây</span>
}</code></pre>
<div class="out">(không có output — mã thoát 0)</div>
<p>Bên trong <code>if</code>, TypeScript biết <code>id</code> là <code>string</code>, nên <code>.toUpperCase()</code> được phép. Sau <code>return</code>, khả năng còn lại duy nhất là <code>number</code>, nên <code>.toFixed()</code> được phép. <strong>Rê chuột lên <code>id</code> trong mỗi nhánh và xem kiểu đổi</strong> — đây là thu hẹp theo luồng điều khiển, và là điều quan trọng nhất cần khắc cốt về union.</p>

<h3>Các cách thu hẹp</h3>
<p><code>typeof</code> là một trong vài phép kiểm mà TypeScript hiểu là thu hẹp. Bạn sẽ dùng hết những cách này:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">typeof x === 'string'</span><span class="v">Cho primitive: string, number, boolean…</span></div>
  <div class="kv"><span class="k">if (x)</span><span class="v">Tính đúng/sai — thu hẹp bỏ null, undefined, '', 0.</span></div>
  <div class="kv"><span class="k">x === 'draft'</span><span class="v">So bằng — thu hẹp một union literal xuống một thành viên (bài sau).</span></div>
  <div class="kv"><span class="k">'permissions' in x</span><span class="v">Sự hiện diện của thuộc tính — cho union object (bài sau).</span></div>
  <div class="kv"><span class="k">x instanceof Error</span><span class="v">Cho instance của class.</span></div>
</div>
<div class="callout ok">Cú xoay tư duy: một union không phải kiểu yếu hơn, mà là một kiểu <em>trung thực</em> hơn. Nó nói "giá trị thật sự là một trong những cái này, nên hãy xử lý từng trường hợp." Trình biên dịch rồi bảo đảm bạn thật sự làm vậy — biến "tôi quên trường hợp number" thành lỗi biên dịch thay vì một <code>NaN</code> trên production.</div>
<div class="note-ct">Code site này đầy union như <code>User | null</code> (một tra cứu có thể trượt) và <code>string | undefined</code> (một field optional). Mỗi cái ép code gọi, qua thu hẹp, phải xử lý nhánh "thiếu" — đó là phần lớn lý do vì sao các cú sập kiểu null-dereference hiếm gặp ở đây.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: union &amp; thu hẹp trên Code Lab</span><span class="lc-sub">Rèn thu hẹp typeof và tính đúng/sai sau chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Literal unions & narrowing by value|||5.2 — Union literal & thu hẹp theo giá trị',
      slug: 'typescript-5-2-literal-union',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Union của các literal mô hình hoá "một trong các giá trị cố định", thu hẹp bằng so bằng và toán tử in — và làm typo thành lỗi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Literal unions &amp; narrowing by value</h2>
<p class="lead">Combine the literal types from chapter 2 with the union operator and you get TypeScript's most practical modelling tool: a type that is "exactly one of these fixed values". Statuses, roles, sizes, directions — the finite sets that fill every real app.</p>

<h3>A union of literals</h3>
<pre><code><span class="tok-comment">// lit.ts</span>
<span class="tok-keyword">type</span> Status = <span class="tok-string">'draft'</span> | <span class="tok-string">'published'</span> | <span class="tok-string">'archived'</span>;
<span class="tok-keyword">let</span> s: Status = <span class="tok-string">'deleted'</span>;</code></pre>
<div class="out">lit.ts(2,5): error TS2322: Type '"deleted"' is not assignable to type 'Status'.</div>
<p>A <code>Status</code> can only ever be one of the three named strings. A typo like <code>'deleted'</code> — or the classic <code>'pubished'</code> — is a compile error, not a value that silently slips through and breaks a filter later. This one line replaces a comment and a runtime check with a guarantee.</p>

<h3>Narrowing by equality</h3>
<p>With a literal union, an equality check narrows to a single member. TypeScript follows along:</p>
<pre><code><span class="tok-keyword">function</span> <span class="tok-function">label</span>(s: Status): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">if</span> (s === <span class="tok-string">'draft'</span>) <span class="tok-keyword">return</span> <span class="tok-string">'Not published yet'</span>;   <span class="tok-comment">// s is 'draft' here</span>
  <span class="tok-comment">// here s is 'published' | 'archived'</span>
  <span class="tok-keyword">return</span> s === <span class="tok-string">'published'</span> ? <span class="tok-string">'Live'</span> : <span class="tok-string">'Archived'</span>;
}</code></pre>
<p>After the first <code>if</code>, TypeScript knows <code>s</code> can no longer be <code>'draft'</code> — hover it and you'll see the type shrink to <code>'published' | 'archived'</code>. Comparisons against the wrong literal are also caught: <code>s === 'delete'</code> would error, because that value isn't in the type.</p>

<h3>Narrowing object unions with in</h3>
<p>When the union is of object shapes, the <code>in</code> operator checks for a property and narrows accordingly:</p>
<pre><code><span class="tok-comment">// innar.ts</span>
<span class="tok-keyword">type</span> Admin = { role: <span class="tok-string">'admin'</span>; permissions: <span class="tok-keyword">string</span>[] };
<span class="tok-keyword">type</span> Guest = { role: <span class="tok-string">'guest'</span> };

<span class="tok-keyword">function</span> <span class="tok-function">canDelete</span>(u: Admin | Guest): <span class="tok-keyword">boolean</span> {
  <span class="tok-keyword">if</span> (<span class="tok-string">'permissions'</span> <span class="tok-keyword">in</span> u) <span class="tok-keyword">return</span> u.permissions.<span class="tok-function">includes</span>(<span class="tok-string">'delete'</span>);  <span class="tok-comment">// u is Admin</span>
  <span class="tok-keyword">return</span> <span class="tok-keyword">false</span>;
}</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Inside the <code>if</code>, TypeScript knows <code>u</code> must be the <code>Admin</code> (only it has <code>permissions</code>), so <code>u.permissions</code> is allowed. The <code>in</code> operator is handy — but there's a cleaner, more scalable pattern for object unions, coming next: the discriminated union.</p>
<div class="callout ok">Literal unions are the payoff of chapter 2's literal types. On their own a single literal was pointless; as a union they become the way you make illegal values <em>unrepresentable</em>. A function that takes a <code>Status</code> can never be handed <code>'whatever'</code> — the compiler simply won't allow the call.</div>
<div class="note-ct">This site models note status, user role and content type as exactly these string-literal unions. It also learned the sharp edge (chapter 9): a literal union is only safe if there is <em>one</em> definition of it. When a second file hand-copied the union's members, the two drifted on a rename and production broke — the fix was to derive every use from a single source.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Union literal &amp; thu hẹp theo giá trị</h2>
<p class="lead">Kết hợp kiểu literal ở chương 2 với toán tử union, bạn có công cụ mô hình hoá thực tế nhất của TypeScript: một kiểu "đúng một trong các giá trị cố định này". Status, vai trò, kích cỡ, hướng — những tập hữu hạn đầy rẫy trong mọi app thật.</p>

<h3>Một union của các literal</h3>
<pre><code><span class="tok-comment">// lit.ts</span>
<span class="tok-keyword">type</span> Status = <span class="tok-string">'draft'</span> | <span class="tok-string">'published'</span> | <span class="tok-string">'archived'</span>;
<span class="tok-keyword">let</span> s: Status = <span class="tok-string">'deleted'</span>;</code></pre>
<div class="out">lit.ts(2,5): error TS2322: Type '"deleted"' is not assignable to type 'Status'.</div>
<p>Một <code>Status</code> chỉ có thể là một trong ba chuỗi đã đặt tên. Một lỗi gõ như <code>'deleted'</code> — hoặc <code>'pubished'</code> kinh điển — là lỗi biên dịch, không phải một giá trị âm thầm lọt qua rồi làm hỏng một bộ lọc về sau. Một dòng này thay một câu chú thích và một phép kiểm lúc chạy bằng một bảo đảm.</p>

<h3>Thu hẹp bằng so bằng</h3>
<p>Với một union literal, một phép so bằng thu hẹp xuống một thành viên. TypeScript theo sát:</p>
<pre><code><span class="tok-keyword">function</span> <span class="tok-function">label</span>(s: Status): <span class="tok-keyword">string</span> {
  <span class="tok-keyword">if</span> (s === <span class="tok-string">'draft'</span>) <span class="tok-keyword">return</span> <span class="tok-string">'Chưa xuất bản'</span>;   <span class="tok-comment">// s là 'draft' ở đây</span>
  <span class="tok-comment">// ở đây s là 'published' | 'archived'</span>
  <span class="tok-keyword">return</span> s === <span class="tok-string">'published'</span> ? <span class="tok-string">'Đang hiển thị'</span> : <span class="tok-string">'Đã lưu trữ'</span>;
}</code></pre>
<p>Sau <code>if</code> đầu tiên, TypeScript biết <code>s</code> không còn là <code>'draft'</code> nữa — rê chuột lên và bạn sẽ thấy kiểu co lại thành <code>'published' | 'archived'</code>. So sánh với sai literal cũng bị bắt: <code>s === 'delete'</code> sẽ lỗi, vì giá trị đó không nằm trong kiểu.</p>

<h3>Thu hẹp union object bằng in</h3>
<p>Khi union là các dáng object, toán tử <code>in</code> kiểm tra một thuộc tính và thu hẹp tương ứng:</p>
<pre><code><span class="tok-comment">// innar.ts</span>
<span class="tok-keyword">type</span> Admin = { role: <span class="tok-string">'admin'</span>; permissions: <span class="tok-keyword">string</span>[] };
<span class="tok-keyword">type</span> Guest = { role: <span class="tok-string">'guest'</span> };

<span class="tok-keyword">function</span> <span class="tok-function">canDelete</span>(u: Admin | Guest): <span class="tok-keyword">boolean</span> {
  <span class="tok-keyword">if</span> (<span class="tok-string">'permissions'</span> <span class="tok-keyword">in</span> u) <span class="tok-keyword">return</span> u.permissions.<span class="tok-function">includes</span>(<span class="tok-string">'delete'</span>);  <span class="tok-comment">// u là Admin</span>
  <span class="tok-keyword">return</span> <span class="tok-keyword">false</span>;
}</code></pre>
<div class="out">(không có output — mã thoát 0)</div>
<p>Bên trong <code>if</code>, TypeScript biết <code>u</code> phải là <code>Admin</code> (chỉ nó có <code>permissions</code>), nên <code>u.permissions</code> được phép. Toán tử <code>in</code> tiện — nhưng có một mẫu gọn hơn, mở rộng tốt hơn cho union object, ngay sau đây: discriminated union.</p>
<div class="callout ok">Union literal là phần thưởng của kiểu literal ở chương 2. Đứng một mình một literal vô dụng; thành union chúng trở thành cách bạn khiến những giá trị phi pháp <em>không biểu diễn nổi</em>. Một hàm nhận một <code>Status</code> không bao giờ bị đưa <code>'whatever'</code> — trình biên dịch đơn giản không cho phép lời gọi.</div>
<div class="note-ct">Site này mô hình hoá status ghi chú, vai trò người dùng và kiểu nội dung đúng bằng các union literal-chuỗi này. Nó cũng học được cạnh sắc (chương 9): một union literal chỉ an toàn nếu có <em>một</em> định nghĩa của nó. Khi một file thứ hai chép tay các thành viên của union, hai bên trôi dạt khi đổi tên và production vỡ — cách sửa là rút mọi chỗ dùng từ một nguồn duy nhất.</div>
</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Discriminated unions|||5.3 — Discriminated union (union có nhãn)',
      slug: 'typescript-5-3-discriminated-union',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mẫu mạnh nhất để mô hình dữ liệu "nhiều dạng": một field nhãn chung (kind/type) cho phép switch thu hẹp gọn gàng từng biến thể.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Discriminated unions</h2>
<p class="lead">This is the single most useful pattern in TypeScript for modelling data that comes in variants — a shape that's a circle <em>or</em> a square, an API result that's a success <em>or</em> an error. The trick is a shared "tag" field that tells the variants apart, and it makes narrowing effortless.</p>

<h3>The problem: variants with different fields</h3>
<p>A circle has a radius; a square has a side. They're related but not the same. Model each as an object type, and give them all a common literal field — the <strong>discriminant</strong> (here, <code>kind</code>):</p>
<pre><code><span class="tok-keyword">type</span> Shape =
  | { kind: <span class="tok-string">'circle'</span>; r: <span class="tok-keyword">number</span> }
  | { kind: <span class="tok-string">'square'</span>; side: <span class="tok-keyword">number</span> };</code></pre>
<p>Because <code>kind</code> is a <em>literal</em> type on each member, TypeScript can use it to tell them apart. Try to read a variant-specific field without checking first, and it stops you:</p>
<pre><code><span class="tok-comment">// premature.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">area</span>(shape: Shape) {
  <span class="tok-keyword">return</span> shape.r ** <span class="tok-number">2</span>;   <span class="tok-comment">// r only exists on the circle</span>
}</code></pre>
<div class="out">premature.ts(5,16): error TS2339: Property 'r' does not exist on type 'Shape'.
  Property 'r' does not exist on type '{ kind: "square"; side: number; }'.</div>

<h3>The payoff: switch on the discriminant</h3>
<p>Check <code>shape.kind</code> and, inside each branch, TypeScript narrows to exactly that variant — so the right fields become available and the wrong ones stay hidden:</p>
<pre><code><span class="tok-comment">// disc.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">area</span>(shape: Shape): <span class="tok-keyword">number</span> {
  <span class="tok-keyword">switch</span> (shape.kind) {
    <span class="tok-keyword">case</span> <span class="tok-string">'circle'</span>: <span class="tok-keyword">return</span> Math.PI * shape.r ** <span class="tok-number">2</span>;   <span class="tok-comment">// shape is the circle → r available</span>
    <span class="tok-keyword">case</span> <span class="tok-string">'square'</span>: <span class="tok-keyword">return</span> shape.side ** <span class="tok-number">2</span>;        <span class="tok-comment">// shape is the square → side available</span>
  }
}</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>In the <code>'circle'</code> case, <code>shape.r</code> is valid and <code>shape.side</code> is an error; in the <code>'square'</code> case it's the reverse. You never cast, never guess — the discriminant does the narrowing. This scales to any number of variants, which is why it beats scattered <code>in</code> checks.</p>

<h3>Where you'll reach for it</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">API results</span><span class="v"><code>{ status: 'ok'; data: T } | { status: 'error'; message: string }</code> — force callers to handle errors.</span></div>
  <div class="kv"><span class="k">UI/loading state</span><span class="v"><code>{ state: 'loading' } | { state: 'ready'; items: T[] } | { state: 'error' }</code>.</span></div>
  <div class="kv"><span class="k">Events / messages</span><span class="v">A <code>type</code> field distinguishing each event's payload.</span></div>
</div>
<p>In every case the shared literal field (<code>status</code>, <code>state</code>, <code>type</code>, <code>kind</code>) is the key. Pick any name you like; the pattern is the same.</p>
<div class="note-ct">This site models loading and result states as discriminated unions, so a component literally cannot read <code>data</code> while still in the <code>loading</code> state — the field isn't on that variant. That eliminates a whole family of "cannot read property of undefined during load" bugs at the type level.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: discriminated unions on Code Lab</span><span class="lc-sub">Model variant data after this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Discriminated union (union có nhãn)</h2>
<p class="lead">Đây là mẫu hữu ích nhất trong TypeScript để mô hình hoá dữ liệu có nhiều biến thể — một hình là tròn <em>hoặc</em> vuông, một kết quả API là thành công <em>hoặc</em> lỗi. Mẹo là một field "nhãn" chung phân biệt các biến thể, và nó khiến việc thu hẹp trở nên dễ dàng.</p>

<h3>Vấn đề: các biến thể có field khác nhau</h3>
<p>Hình tròn có bán kính; hình vuông có cạnh. Chúng liên quan nhưng không giống nhau. Mô hình mỗi cái thành một kiểu object, và cho tất cả một field literal chung — <strong>discriminant</strong> (ở đây, <code>kind</code>):</p>
<pre><code><span class="tok-keyword">type</span> Shape =
  | { kind: <span class="tok-string">'circle'</span>; r: <span class="tok-keyword">number</span> }
  | { kind: <span class="tok-string">'square'</span>; side: <span class="tok-keyword">number</span> };</code></pre>
<p>Vì <code>kind</code> là một kiểu <em>literal</em> trên mỗi thành viên, TypeScript dùng nó để phân biệt chúng. Thử đọc một field riêng của biến thể mà không kiểm trước, nó chặn bạn:</p>
<pre><code><span class="tok-comment">// premature.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">area</span>(shape: Shape) {
  <span class="tok-keyword">return</span> shape.r ** <span class="tok-number">2</span>;   <span class="tok-comment">// r chỉ có trên hình tròn</span>
}</code></pre>
<div class="out">premature.ts(5,16): error TS2339: Property 'r' does not exist on type 'Shape'.
  Property 'r' does not exist on type '{ kind: "square"; side: number; }'.</div>

<h3>Phần thưởng: switch trên discriminant</h3>
<p>Kiểm <code>shape.kind</code> và, bên trong mỗi nhánh, TypeScript thu hẹp về đúng biến thể đó — nên các field đúng trở nên dùng được và các field sai vẫn ẩn:</p>
<pre><code><span class="tok-comment">// disc.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">area</span>(shape: Shape): <span class="tok-keyword">number</span> {
  <span class="tok-keyword">switch</span> (shape.kind) {
    <span class="tok-keyword">case</span> <span class="tok-string">'circle'</span>: <span class="tok-keyword">return</span> Math.PI * shape.r ** <span class="tok-number">2</span>;   <span class="tok-comment">// shape là hình tròn → r dùng được</span>
    <span class="tok-keyword">case</span> <span class="tok-string">'square'</span>: <span class="tok-keyword">return</span> shape.side ** <span class="tok-number">2</span>;        <span class="tok-comment">// shape là hình vuông → side dùng được</span>
  }
}</code></pre>
<div class="out">(không có output — mã thoát 0)</div>
<p>Trong nhánh <code>'circle'</code>, <code>shape.r</code> hợp lệ còn <code>shape.side</code> là lỗi; trong nhánh <code>'square'</code> thì ngược lại. Bạn không bao giờ ép kiểu, không bao giờ đoán — discriminant làm việc thu hẹp. Cái này mở rộng cho bất kỳ số biến thể nào, và đó là lý do nó hơn các phép kiểm <code>in</code> rải rác.</p>

<h3>Bạn sẽ với tay tới nó ở đâu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Kết quả API</span><span class="v"><code>{ status: 'ok'; data: T } | { status: 'error'; message: string }</code> — ép chỗ gọi xử lý lỗi.</span></div>
  <div class="kv"><span class="k">Trạng thái UI/tải</span><span class="v"><code>{ state: 'loading' } | { state: 'ready'; items: T[] } | { state: 'error' }</code>.</span></div>
  <div class="kv"><span class="k">Sự kiện / tin nhắn</span><span class="v">Một field <code>type</code> phân biệt payload của mỗi sự kiện.</span></div>
</div>
<p>Trong mọi trường hợp, field literal chung (<code>status</code>, <code>state</code>, <code>type</code>, <code>kind</code>) là chìa khoá. Đặt tên nào tuỳ bạn; mẫu vẫn thế.</p>
<div class="note-ct">Site này mô hình hoá các trạng thái tải và kết quả bằng discriminated union, nên một component theo đúng nghĩa đen không thể đọc <code>data</code> khi vẫn ở trạng thái <code>loading</code> — field đó không có trên biến thể ấy. Điều đó xoá cả một họ bug "cannot read property of undefined khi đang tải" ngay ở tầng kiểu.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: discriminated union trên Code Lab</span><span class="lc-sub">Mô hình dữ liệu nhiều biến thể sau chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — Exhaustiveness checking with never|||5.4 — Kiểm tra đầy đủ với never',
      slug: 'typescript-5-4-exhaustiveness',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ép trình biên dịch bắt bạn xử lý mọi trường hợp: thêm một biến thể mới mà quên xử lý, phép gán never sẽ sáng đỏ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Exhaustiveness checking with never</h2>
<p class="lead">Discriminated unions get even better with one trick: you can make the compiler <em>force</em> you to handle every variant. Add a new case to the union later and forget to handle it, and the build fails — pointing at the exact function you missed. This is the practical superpower of the <code>never</code> type from chapter 2.</p>

<h3>The default that can't happen</h3>
<p>Recall that <code>never</code> is the type no value can have. In a <code>switch</code> over a discriminated union, once you've handled every case, the <code>default</code> branch is unreachable — so the value there has type <code>never</code>. Assign it to a <code>never</code> variable as a guard:</p>
<pre><code><span class="tok-keyword">function</span> <span class="tok-function">area</span>(shape: Shape): <span class="tok-keyword">number</span> {
  <span class="tok-keyword">switch</span> (shape.kind) {
    <span class="tok-keyword">case</span> <span class="tok-string">'circle'</span>: <span class="tok-keyword">return</span> Math.PI * shape.r ** <span class="tok-number">2</span>;
    <span class="tok-keyword">case</span> <span class="tok-string">'square'</span>: <span class="tok-keyword">return</span> shape.side ** <span class="tok-number">2</span>;
    <span class="tok-keyword">default</span>:
      <span class="tok-keyword">const</span> _exhaustive: <span class="tok-keyword">never</span> = shape;   <span class="tok-comment">// only reachable if a case is unhandled</span>
      <span class="tok-keyword">return</span> _exhaustive;
  }
}</code></pre>
<p>With both cases handled, <code>shape</code> in the <code>default</code> is <code>never</code>, the assignment is fine, and it compiles. Nothing happens — until the union grows.</p>

<h3>Add a variant, feel the compiler catch it</h3>
<p>Now suppose someone adds a triangle to <code>Shape</code> but forgets to add a <code>case</code> for it:</p>
<pre><code><span class="tok-comment">// exhaust.ts</span>
<span class="tok-keyword">type</span> Shape =
  | { kind: <span class="tok-string">'circle'</span>; r: <span class="tok-keyword">number</span> }
  | { kind: <span class="tok-string">'square'</span>; side: <span class="tok-keyword">number</span> }
  | { kind: <span class="tok-string">'triangle'</span>; base: <span class="tok-keyword">number</span>; height: <span class="tok-keyword">number</span> };   <span class="tok-comment">// new!</span>
<span class="tok-comment">// ...same area() as above, still only handling circle + square</span></code></pre>
<div class="out">exhaust.ts(11,13): error TS2322: Type '{ kind: "triangle"; base: number; height: number; }' is not assignable to type 'never'.</div>
<p>Because a triangle now <em>can</em> reach the <code>default</code>, <code>shape</code> there is no longer <code>never</code> — it's the triangle type — and assigning it to a <code>never</code> variable fails. The error names the exact variant you forgot. You didn't have to remember to update this function; the compiler remembered for you.</p>
<div class="callout ok">This is the difference between "TypeScript checks what you wrote" and "TypeScript enforces what you must write". Exhaustiveness turns a union into a contract: <em>every</em> place that switches on it must handle <em>every</em> case, forever, including cases added years later by someone who never saw this function.</div>

<h3>The pattern, packaged</h3>
<p>A common tidy version uses a helper that both documents intent and can throw at runtime as a last resort:</p>
<pre><code><span class="tok-keyword">function</span> <span class="tok-function">assertNever</span>(x: <span class="tok-keyword">never</span>): <span class="tok-keyword">never</span> {
  <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> <span class="tok-function">Error</span>(<span class="tok-string">'Unhandled case: '</span> + <span class="tok-function">String</span>(x));
}
<span class="tok-comment">// default: return assertNever(shape);</span></code></pre>
<p>Same compile-time guarantee, plus a clear runtime error if some untyped data ever sneaks a bad value in. You'll see <code>assertNever</code> in many production codebases for exactly this.</p>
<div class="note-ct">This is the <code>never</code> check chapter 2 promised. On this site it guards the content-type union: when a new content type was added, the exhaustiveness check flagged every switch that hadn't been updated — a compile-time to-do list. It is precisely the safety net that the enum-rename incident (chapter 9) showed you need, wired directly into the type system.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: exhaustiveness on Code Lab</span><span class="lc-sub">Cement chapter 5 with the matching exercises.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Kiểm tra đầy đủ với never</h2>
<p class="lead">Discriminated union còn hay hơn với một mẹo: bạn có thể khiến trình biên dịch <em>ép</em> bạn xử lý mọi biến thể. Thêm một trường hợp mới vào union về sau mà quên xử lý, bản build sẽ hỏng — chỉ đúng hàm bạn bỏ sót. Đây là siêu năng lực thực tế của kiểu <code>never</code> từ chương 2.</p>

<h3>Cái default không thể xảy ra</h3>
<p>Nhớ lại <code>never</code> là kiểu không giá trị nào mang được. Trong một <code>switch</code> trên một discriminated union, một khi bạn đã xử lý mọi trường hợp, nhánh <code>default</code> không thể tới được — nên giá trị ở đó mang kiểu <code>never</code>. Gán nó cho một biến <code>never</code> làm chốt chặn:</p>
<pre><code><span class="tok-keyword">function</span> <span class="tok-function">area</span>(shape: Shape): <span class="tok-keyword">number</span> {
  <span class="tok-keyword">switch</span> (shape.kind) {
    <span class="tok-keyword">case</span> <span class="tok-string">'circle'</span>: <span class="tok-keyword">return</span> Math.PI * shape.r ** <span class="tok-number">2</span>;
    <span class="tok-keyword">case</span> <span class="tok-string">'square'</span>: <span class="tok-keyword">return</span> shape.side ** <span class="tok-number">2</span>;
    <span class="tok-keyword">default</span>:
      <span class="tok-keyword">const</span> _exhaustive: <span class="tok-keyword">never</span> = shape;   <span class="tok-comment">// chỉ tới được nếu một case chưa xử lý</span>
      <span class="tok-keyword">return</span> _exhaustive;
  }
}</code></pre>
<p>Với cả hai trường hợp đã xử lý, <code>shape</code> trong <code>default</code> là <code>never</code>, phép gán ổn, và nó biên dịch được. Không có gì xảy ra — cho tới khi union lớn lên.</p>

<h3>Thêm một biến thể, cảm nhận trình biên dịch bắt được</h3>
<p>Giờ giả sử ai đó thêm hình tam giác vào <code>Shape</code> nhưng quên thêm <code>case</code> cho nó:</p>
<pre><code><span class="tok-comment">// exhaust.ts</span>
<span class="tok-keyword">type</span> Shape =
  | { kind: <span class="tok-string">'circle'</span>; r: <span class="tok-keyword">number</span> }
  | { kind: <span class="tok-string">'square'</span>; side: <span class="tok-keyword">number</span> }
  | { kind: <span class="tok-string">'triangle'</span>; base: <span class="tok-keyword">number</span>; height: <span class="tok-keyword">number</span> };   <span class="tok-comment">// mới!</span>
<span class="tok-comment">// ...area() y như trên, vẫn chỉ xử lý circle + square</span></code></pre>
<div class="out">exhaust.ts(11,13): error TS2322: Type '{ kind: "triangle"; base: number; height: number; }' is not assignable to type 'never'.</div>
<p>Vì tam giác giờ <em>có thể</em> tới nhánh <code>default</code>, <code>shape</code> ở đó không còn là <code>never</code> nữa — nó là kiểu tam giác — và gán nó cho một biến <code>never</code> thất bại. Lỗi gọi tên chính xác biến thể bạn quên. Bạn không phải nhớ cập nhật hàm này; trình biên dịch nhớ hộ bạn.</p>
<div class="callout ok">Đây là khác biệt giữa "TypeScript kiểm thứ bạn đã viết" và "TypeScript ép thứ bạn phải viết". Exhaustiveness biến một union thành một hợp đồng: <em>mọi</em> chỗ switch trên nó đều phải xử lý <em>mọi</em> trường hợp, mãi mãi, kể cả những trường hợp thêm nhiều năm sau bởi một người chưa bao giờ thấy hàm này.</div>

<h3>Mẫu, đóng gói lại</h3>
<p>Một bản gọn thường gặp dùng một hàm phụ vừa tài liệu hoá ý định vừa có thể ném lỗi lúc chạy như phương án cuối:</p>
<pre><code><span class="tok-keyword">function</span> <span class="tok-function">assertNever</span>(x: <span class="tok-keyword">never</span>): <span class="tok-keyword">never</span> {
  <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> <span class="tok-function">Error</span>(<span class="tok-string">'Unhandled case: '</span> + <span class="tok-function">String</span>(x));
}
<span class="tok-comment">// default: return assertNever(shape);</span></code></pre>
<p>Cùng bảo đảm lúc biên dịch, cộng thêm một lỗi lúc chạy rõ ràng nếu có dữ liệu không kiểu nào lẻn một giá trị xấu vào. Bạn sẽ thấy <code>assertNever</code> trong nhiều codebase production đúng vì điều này.</p>
<div class="note-ct">Đây là phép kiểm <code>never</code> mà chương 2 đã hứa. Trên site này nó gác union kiểu-nội-dung: khi thêm một kiểu nội dung mới, phép kiểm đầy đủ tô đỏ mọi switch chưa được cập nhật — một danh sách việc-cần-làm lúc biên dịch. Đó đúng là tấm lưới an toàn mà sự cố enum-rename (chương 9) cho thấy bạn cần, ráp thẳng vào hệ thống kiểu.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: exhaustiveness trên Code Lab</span><span class="lc-sub">Củng cố chương 5 bằng các bài tập tương ứng.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.5 quiz ─────────────────────────── */
    {
      title: '5.5 — Chapter 5 quiz|||5.5 — Kiểm tra Chương 5',
      slug: 'typescript-5-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về union, thu hẹp typeof/in/equality, literal union, discriminated union, exhaustiveness với never.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on unions and narrowing — the heart of practical TypeScript. Answer from memory; questions follow lesson order.</p>
<div class="callout ok">Aim for 7/8. Discriminated unions and the never exhaustiveness check (5.3, 5.4) are the ones worth truly mastering — they reappear in almost every real codebase.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về union và thu hẹp kiểu — trái tim của TypeScript thực chiến. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Discriminated union và phép kiểm đầy đủ với never (5.3, 5.4) là những cái đáng làm chủ thật sự — chúng tái xuất trong gần như mọi codebase thật.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'On a value of type string | number, calling .toUpperCase() directly gives?|||Trên một giá trị kiểu string | number, gọi .toUpperCase() trực tiếp cho ra?',
            options: [
              'It works — both have it|||Chạy được — cả hai đều có',
              "TS2339: Property 'toUpperCase' does not exist on type 'string | number'|||TS2339: Property 'toUpperCase' does not exist on type 'string | number'",
              'It coerces number to string|||Nó ép number thành string',
              'A runtime error only|||Chỉ lỗi lúc chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Inside if (typeof id === "string") { ... }, what is id\'s type?|||Bên trong if (typeof id === "string") { ... }, kiểu của id là gì?',
            options: [
              'string | number still|||vẫn string | number',
              'string (narrowed)|||string (đã thu hẹp)',
              'any',
              'unknown',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'type Status = "draft" | "published"; let s: Status = "deleted" does?|||type Status = "draft" | "published"; let s: Status = "deleted" ra sao?',
            options: [
              'Compiles fine|||Biên dịch bình thường',
              "TS2322: Type '\"deleted\"' is not assignable to type 'Status'|||TS2322: Type '\"deleted\"' is not assignable to type 'Status'",
              'Adds deleted to the union|||Thêm deleted vào union',
              'Only warns|||Chỉ cảnh báo',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What makes a union a DISCRIMINATED union?|||Điều gì khiến một union thành union CÓ NHÃN (discriminated)?',
            options: [
              'All members share a common literal field (the discriminant)|||Mọi thành viên chia sẻ một field literal chung (discriminant)',
              'It has exactly two members|||Nó có đúng hai thành viên',
              'All members are primitives|||Mọi thành viên là primitive',
              'It uses the & operator|||Nó dùng toán tử &',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Reading shape.r on Shape = {kind:"circle";r} | {kind:"square";side} before narrowing gives?|||Đọc shape.r trên Shape = {kind:"circle";r} | {kind:"square";side} trước khi thu hẹp cho ra?',
            options: [
              'The radius|||Bán kính',
              "TS2339: Property 'r' does not exist on type 'Shape'|||TS2339: Property 'r' does not exist on type 'Shape'",
              'undefined|||undefined',
              'No error|||Không lỗi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'How does switch (shape.kind) help?|||switch (shape.kind) giúp thế nào?',
            options: [
              'It narrows shape to the matching variant inside each case|||Nó thu hẹp shape về đúng biến thể khớp trong mỗi case',
              'It converts shape to a string|||Nó biến shape thành chuỗi',
              'It has no type effect|||Nó không tác động gì tới kiểu',
              'It requires a cast in each case|||Nó đòi ép kiểu trong mỗi case',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You add a 3rd variant to a union but forget a case; const _e: never = shape does?|||Bạn thêm biến thể thứ 3 vào union nhưng quên một case; const _e: never = shape ra sao?',
            options: [
              'Nothing — never accepts anything|||Không gì — never nhận mọi thứ',
              'Errors: the new variant is not assignable to never — pointing at the missed case|||Lỗi: biến thể mới không gán được cho never — chỉ đúng case bị bỏ',
              'Silently ignores the new variant|||Âm thầm bỏ qua biến thể mới',
              'Only errors at runtime|||Chỉ lỗi lúc chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is exhaustiveness checking valuable?|||Vì sao kiểm tra đầy đủ (exhaustiveness) có giá trị?',
            options: [
              'It makes the code run faster|||Nó làm code chạy nhanh hơn',
              'It forces every switch on the union to handle every case, even ones added later|||Nó ép mọi switch trên union xử lý mọi case, kể cả case thêm về sau',
              'It removes the need for default branches|||Nó bỏ luôn nhu cầu có nhánh default',
              'It validates data at runtime|||Nó validate dữ liệu lúc chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
