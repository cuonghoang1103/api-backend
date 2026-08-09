/**
 * TypeScript — Chương 8: Utility types (kiểu tiện ích có sẵn).
 * Mọi output tsc là THẬT (tsc --strict, verified). Song ngữ .ml-en/.ml-vi.
 * < > → &lt; &gt;; KHÔNG backtick trần (&#96;); ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 8 — Utility types|||Chương 8 — Utility types (kiểu tiện ích)',
  description: 'Bộ kiểu có sẵn của TypeScript — Partial, Required, Readonly, Pick, Omit, Record, Exclude, NonNullable, ReturnType, Awaited — chính là các mapped/conditional type của chương 7, đóng gói sẵn để dùng ngay.',
  lessons: [
    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — Partial, Required & Readonly|||8.1 — Partial, Required & Readonly',
      slug: 'typescript-8-1-partial-required-readonly',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba mapped type của chương 7, giờ có sẵn: đổi tính tuỳ chọn và tính ghi-được của mọi field trong một kiểu, không phải viết lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Partial, Required &amp; Readonly</h2>
<p class="lead">Chapter 7 built these by hand; TypeScript ships them so you never have to. <code>Partial&lt;T&gt;</code>, <code>Required&lt;T&gt;</code> and <code>Readonly&lt;T&gt;</code> are the everyday mapped types — one word transforms every field of a type.</p>

<h3>Partial: everything optional</h3>
<p><code>Partial&lt;T&gt;</code> makes every field of <code>T</code> optional. Its home is the "update" or "patch" shape — a caller sends only the fields they want to change:</p>
<pre><code><span class="tok-comment">// partial.ts</span>
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; email: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">updateUser</span>(id: <span class="tok-keyword">number</span>, patch: Partial&lt;User&gt;) { <span class="tok-comment">/* ... */</span> }
<span class="tok-function">updateUser</span>(<span class="tok-number">1</span>, { name: <span class="tok-string">'Ada'</span> });               <span class="tok-comment">// ok — only some fields</span>
<span class="tok-function">updateUser</span>(<span class="tok-number">1</span>, { name: <span class="tok-string">'Ada'</span>, role: <span class="tok-string">'admin'</span> }); <span class="tok-comment">// role isn't a User field</span></code></pre>
<div class="out">partial.ts(5,30): error TS2353: Object literal may only specify known properties, and 'role' does not exist in type 'Partial&lt;User&gt;'.</div>
<p><code>{ name: 'Ada' }</code> is accepted — omitting <code>id</code> and <code>email</code> is fine under <code>Partial</code>. But <code>role</code> is still rejected: optional never means "any extra key allowed". <code>Partial&lt;User&gt;</code> has exactly <code>User</code>'s keys, each made optional.</p>

<h3>Required: everything mandatory</h3>
<p>The mirror image — <code>Required&lt;T&gt;</code> strips every <code>?</code>, so a type full of optionals becomes fully mandatory. Reach for it after validation, when you've confirmed the loose input is now complete.</p>

<h3>Readonly: everything frozen</h3>
<p><code>Readonly&lt;T&gt;</code> makes every field read-only — assignable at creation, immutable after:</p>
<pre><code><span class="tok-comment">// readonly.ts</span>
<span class="tok-keyword">interface</span> Point { x: <span class="tok-keyword">number</span>; y: <span class="tok-keyword">number</span>; }
<span class="tok-keyword">const</span> p: Readonly&lt;Point&gt; = { x: <span class="tok-number">1</span>, y: <span class="tok-number">2</span> };
p.x = <span class="tok-number">5</span>;   <span class="tok-comment">// Readonly froze every field</span></code></pre>
<div class="out">readonly.ts(4,3): error TS2540: Cannot assign to 'x' because it is a read-only property.</div>
<p>Useful for config objects, constants, and anything you want the compiler to guarantee nobody mutates after it's built. Note this is a compile-time guarantee only — it doesn't call <code>Object.freeze</code>, it just refuses the assignment in your code.</p>

<div class="callout ok">Three transformations you'll use constantly: <code>Partial</code> adds <code>?</code>, <code>Required</code> removes it, <code>Readonly</code> adds <code>readonly</code>. They're the built-in versions of the mapped types you wrote in 7.1–7.2 — same behaviour, zero boilerplate.</div>
<div class="note-ct">This site's update endpoints are typed exactly as <code>Partial&lt;SomethingDto&gt;</code>, so a PATCH can carry any subset of fields and a typo in a field name is still a compile error. That single utility is what lets one DTO serve both "create" (all fields) and "update" (any fields) without a second type.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: Partial, Required, Readonly on Code Lab</span><span class="lc-sub">Type an update function and a frozen config.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Partial, Required &amp; Readonly</h2>
<p class="lead">Chương 7 đã tự dựng những cái này; TypeScript kèm sẵn để bạn khỏi phải làm. <code>Partial&lt;T&gt;</code>, <code>Required&lt;T&gt;</code> và <code>Readonly&lt;T&gt;</code> là các mapped type đời thường — một từ biến đổi mọi field của một kiểu.</p>

<h3>Partial: mọi thứ tuỳ chọn</h3>
<p><code>Partial&lt;T&gt;</code> làm mọi field của <code>T</code> thành tuỳ chọn. Nhà của nó là hình dạng "cập nhật" hay "vá" — bên gọi chỉ gửi những field họ muốn đổi:</p>
<pre><code><span class="tok-comment">// partial.ts</span>
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; email: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">updateUser</span>(id: <span class="tok-keyword">number</span>, patch: Partial&lt;User&gt;) { <span class="tok-comment">/* ... */</span> }
<span class="tok-function">updateUser</span>(<span class="tok-number">1</span>, { name: <span class="tok-string">'Ada'</span> });               <span class="tok-comment">// ok — chỉ vài field</span>
<span class="tok-function">updateUser</span>(<span class="tok-number">1</span>, { name: <span class="tok-string">'Ada'</span>, role: <span class="tok-string">'admin'</span> }); <span class="tok-comment">// role không phải field của User</span></code></pre>
<div class="out">partial.ts(5,30): error TS2353: Object literal may only specify known properties, and 'role' does not exist in type 'Partial&lt;User&gt;'.</div>
<p><code>{ name: 'Ada' }</code> được nhận — bỏ <code>id</code> và <code>email</code> là ổn dưới <code>Partial</code>. Nhưng <code>role</code> vẫn bị từ chối: tuỳ chọn không bao giờ nghĩa là "cho phép mọi key thừa". <code>Partial&lt;User&gt;</code> có đúng các key của <code>User</code>, mỗi cái được làm tuỳ chọn.</p>

<h3>Required: mọi thứ bắt buộc</h3>
<p>Bản đối xứng — <code>Required&lt;T&gt;</code> gỡ mọi <code>?</code>, nên một kiểu đầy tuỳ chọn thành bắt buộc hoàn toàn. Dùng nó sau khi validate, khi bạn đã xác nhận input lỏng lẻo giờ đã đủ.</p>

<h3>Readonly: mọi thứ đóng băng</h3>
<p><code>Readonly&lt;T&gt;</code> làm mọi field thành chỉ-đọc — gán được lúc tạo, bất biến sau đó:</p>
<pre><code><span class="tok-comment">// readonly.ts</span>
<span class="tok-keyword">interface</span> Point { x: <span class="tok-keyword">number</span>; y: <span class="tok-keyword">number</span>; }
<span class="tok-keyword">const</span> p: Readonly&lt;Point&gt; = { x: <span class="tok-number">1</span>, y: <span class="tok-number">2</span> };
p.x = <span class="tok-number">5</span>;   <span class="tok-comment">// Readonly đã đóng băng mọi field</span></code></pre>
<div class="out">readonly.ts(4,3): error TS2540: Cannot assign to 'x' because it is a read-only property.</div>
<p>Hữu ích cho object cấu hình, hằng số, và bất cứ thứ gì bạn muốn trình biên dịch bảo đảm không ai đổi sau khi đã dựng. Lưu ý đây chỉ là bảo đảm lúc biên dịch — nó không gọi <code>Object.freeze</code>, nó chỉ từ chối phép gán trong code của bạn.</p>

<div class="callout ok">Ba phép biến đổi bạn dùng liên tục: <code>Partial</code> thêm <code>?</code>, <code>Required</code> gỡ nó, <code>Readonly</code> thêm <code>readonly</code>. Chúng là bản có sẵn của các mapped type bạn viết ở 7.1–7.2 — cùng hành vi, không một dòng thừa.</div>
<div class="note-ct">Các endpoint cập nhật của site này được gõ kiểu đúng là <code>Partial&lt;SomethingDto&gt;</code>, nên một PATCH có thể mang bất kỳ tập con field nào mà gõ sai tên field vẫn là lỗi biên dịch. Chỉ một utility đó cho một DTO phục vụ cả "tạo" (mọi field) lẫn "cập nhật" (field nào cũng được) mà không cần kiểu thứ hai.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: Partial, Required, Readonly trên Code Lab</span><span class="lc-sub">Gõ kiểu một hàm cập nhật và một config đóng băng.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Pick & Omit|||8.2 — Pick & Omit',
      slug: 'typescript-8-2-pick-omit',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Chọn ra một tập con key (Pick) hoặc loại bỏ vài key (Omit) từ một kiểu — cách dựng PublicUser không có passwordHash mà không lặp lại các field.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Pick &amp; Omit</h2>
<p class="lead"><code>Pick</code> keeps only the keys you name; <code>Omit</code> keeps everything <em>except</em> the keys you name. They're how you derive a smaller type from a bigger one — a public view of a user, a subset for a form — without re-listing fields and letting them drift.</p>

<h3>Omit: a type minus some keys</h3>
<p>The classic use: strip a secret field before sending a user to the client. <code>Omit&lt;User, 'passwordHash'&gt;</code> is <code>User</code> with that one key removed:</p>
<pre><code><span class="tok-comment">// pickomit.ts</span>
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; email: <span class="tok-keyword">string</span>; passwordHash: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">type</span> PublicUser = Omit&lt;User, <span class="tok-string">'passwordHash'</span>&gt;;
<span class="tok-keyword">type</span> Credentials = Pick&lt;User, <span class="tok-string">'email'</span> | <span class="tok-string">'passwordHash'</span>&gt;;
<span class="tok-keyword">const</span> pub: PublicUser = { id: <span class="tok-number">1</span>, name: <span class="tok-string">'Ada'</span>, email: <span class="tok-string">'a@b.c'</span> };  <span class="tok-comment">// ok</span>
<span class="tok-keyword">const</span> leaked: PublicUser = { id: <span class="tok-number">1</span>, name: <span class="tok-string">'Ada'</span>, email: <span class="tok-string">'a@b.c'</span>, passwordHash: <span class="tok-string">'x'</span> };</code></pre>
<div class="out">pickomit.ts(6,66): error TS2353: Object literal may only specify known properties, and 'passwordHash' does not exist in type 'PublicUser'.</div>
<p><code>pub</code> is valid with exactly the three remaining fields; <code>leaked</code> is a compile error because <code>passwordHash</code> is no longer part of <code>PublicUser</code>. The win is that <code>PublicUser</code> stays in lockstep with <code>User</code> — add a field to <code>User</code> and it appears here automatically, minus the one you omitted.</p>

<h3>Pick: a type with only some keys</h3>
<p><code>Pick&lt;User, 'email' | 'passwordHash'&gt;</code> is the opposite direction — it keeps <em>only</em> those two keys, giving a <code>Credentials</code> type. Use <code>Pick</code> when the subset is small; use <code>Omit</code> when you're removing a few from many.</p>

<h3>They're conditional types underneath</h3>
<p><code>Omit</code> is built from <code>Pick</code> and <code>Exclude</code> (next lesson): <code>Omit&lt;T, K&gt;</code> is roughly <code>Pick&lt;T, Exclude&lt;keyof T, K&gt;&gt;</code>. You don't need to memorise that — just know these aren't primitives, they're compositions of chapter 7's tools, which is why they compose so cleanly with each other.</p>

<div class="callout ok"><code>Pick&lt;T, K&gt;</code> = "only these keys"; <code>Omit&lt;T, K&gt;</code> = "all keys but these". Both derive from one source type, so the derived type can never silently fall out of sync with the original.</div>
<div class="note-ct">The API returns <code>Omit&lt;User, 'passwordHash' | 'tokenVersion'&gt;</code> shapes so a secret can't be serialised to the client by accident — the type physically doesn't contain the field. When someone adds a sensitive column to the model, every public response type excludes it in one place instead of hoping each handler remembered to delete it.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: Pick &amp; Omit on Code Lab</span><span class="lc-sub">Derive a public view and a credentials subset from one model.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Pick &amp; Omit</h2>
<p class="lead"><code>Pick</code> chỉ giữ các key bạn nêu tên; <code>Omit</code> giữ mọi thứ <em>trừ</em> các key bạn nêu tên. Đó là cách bạn suy ra một kiểu nhỏ hơn từ một kiểu lớn hơn — một góc nhìn công khai của user, một tập con cho một form — mà không liệt kê lại field và để chúng trôi lệch.</p>

<h3>Omit: một kiểu trừ đi vài key</h3>
<p>Dùng kinh điển: bóc một field bí mật trước khi gửi user về client. <code>Omit&lt;User, 'passwordHash'&gt;</code> là <code>User</code> với một key đó bị gỡ:</p>
<pre><code><span class="tok-comment">// pickomit.ts</span>
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">number</span>; name: <span class="tok-keyword">string</span>; email: <span class="tok-keyword">string</span>; passwordHash: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">type</span> PublicUser = Omit&lt;User, <span class="tok-string">'passwordHash'</span>&gt;;
<span class="tok-keyword">type</span> Credentials = Pick&lt;User, <span class="tok-string">'email'</span> | <span class="tok-string">'passwordHash'</span>&gt;;
<span class="tok-keyword">const</span> pub: PublicUser = { id: <span class="tok-number">1</span>, name: <span class="tok-string">'Ada'</span>, email: <span class="tok-string">'a@b.c'</span> };  <span class="tok-comment">// ok</span>
<span class="tok-keyword">const</span> leaked: PublicUser = { id: <span class="tok-number">1</span>, name: <span class="tok-string">'Ada'</span>, email: <span class="tok-string">'a@b.c'</span>, passwordHash: <span class="tok-string">'x'</span> };</code></pre>
<div class="out">pickomit.ts(6,66): error TS2353: Object literal may only specify known properties, and 'passwordHash' does not exist in type 'PublicUser'.</div>
<p><code>pub</code> hợp lệ với đúng ba field còn lại; <code>leaked</code> là lỗi biên dịch vì <code>passwordHash</code> không còn là một phần của <code>PublicUser</code>. Cái lợi là <code>PublicUser</code> luôn bám sát <code>User</code> — thêm một field vào <code>User</code> thì nó tự hiện ở đây, trừ đúng cái bạn đã bỏ.</p>

<h3>Pick: một kiểu chỉ với vài key</h3>
<p><code>Pick&lt;User, 'email' | 'passwordHash'&gt;</code> là chiều ngược lại — nó chỉ giữ <em>đúng</em> hai key đó, cho một kiểu <code>Credentials</code>. Dùng <code>Pick</code> khi tập con nhỏ; dùng <code>Omit</code> khi bạn gỡ vài cái khỏi nhiều cái.</p>

<h3>Bên dưới chúng là conditional type</h3>
<p><code>Omit</code> được dựng từ <code>Pick</code> và <code>Exclude</code> (bài kế): <code>Omit&lt;T, K&gt;</code> đại khái là <code>Pick&lt;T, Exclude&lt;keyof T, K&gt;&gt;</code>. Bạn không cần thuộc lòng điều đó — chỉ cần biết chúng không phải kiểu nguyên thuỷ, chúng là các phép ghép từ công cụ của chương 7, đó là lý do chúng ghép với nhau sạch sẽ đến vậy.</p>

<div class="callout ok"><code>Pick&lt;T, K&gt;</code> = "chỉ các key này"; <code>Omit&lt;T, K&gt;</code> = "mọi key trừ các key này". Cả hai đều suy từ một kiểu nguồn, nên kiểu dẫn xuất không bao giờ âm thầm lệch khỏi kiểu gốc.</div>
<div class="note-ct">API trả về các hình dạng <code>Omit&lt;User, 'passwordHash' | 'tokenVersion'&gt;</code> để một bí mật không thể bị tuần tự hoá xuống client do vô ý — kiểu vật lý không chứa field đó. Khi ai đó thêm một cột nhạy cảm vào model, mọi kiểu phản hồi công khai loại nó ở một chỗ, thay vì hy vọng mỗi handler nhớ xoá nó.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: Pick &amp; Omit trên Code Lab</span><span class="lc-sub">Suy ra một góc nhìn công khai và một tập con credentials từ một model.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — Record|||8.3 — Record',
      slug: 'typescript-8-3-record',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Record<K, V> gõ kiểu một object-dạng-từ-điển: mọi key thuộc K, mọi giá trị thuộc V — và với K là union literal, nó ép bạn phủ đủ mọi trường hợp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Record</h2>
<p class="lead"><code>Record&lt;K, V&gt;</code> types an object used as a dictionary: every key is of type <code>K</code>, every value is of type <code>V</code>. When <code>K</code> is a union of string literals, it does something powerful — it forces you to provide <em>every</em> key.</p>

<h3>A lookup table that must be complete</h3>
<p>Map each role to its permissions. Because <code>K</code> is the literal union <code>Role</code>, leaving one out is a compile error — the exhaustiveness of chapter 5, applied to an object:</p>
<pre><code><span class="tok-comment">// record.ts</span>
<span class="tok-keyword">type</span> Role = <span class="tok-string">'admin'</span> | <span class="tok-string">'editor'</span> | <span class="tok-string">'viewer'</span>;
<span class="tok-keyword">const</span> permissions: Record&lt;Role, <span class="tok-keyword">string</span>[]&gt; = {
  admin: [<span class="tok-string">'read'</span>, <span class="tok-string">'write'</span>, <span class="tok-string">'delete'</span>],
  editor: [<span class="tok-string">'read'</span>, <span class="tok-string">'write'</span>],
};</code></pre>
<div class="out">record.ts(3,7): error TS2741: Property 'viewer' is missing in type '{ admin: string[]; editor: string[]; }' but required in type 'Record&lt;Role, string[]&gt;'.</div>
<p>You forgot <code>viewer</code>, and TypeScript caught it. This is the killer feature: add a fourth role to the union later and every <code>Record&lt;Role, …&gt;</code> in the codebase lights up red until you handle it. No silent gaps in a config map.</p>

<h3>An open dictionary with <code>string</code> keys</h3>
<p>When keys aren't known ahead of time, use <code>Record&lt;string, V&gt;</code> — an arbitrary set of string keys, all mapping to <code>V</code>:</p>
<pre><code><span class="tok-comment">// record2.ts</span>
<span class="tok-keyword">const</span> scores: Record&lt;<span class="tok-keyword">string</span>, <span class="tok-keyword">number</span>&gt; = {};
scores[<span class="tok-string">'ada'</span>] = <span class="tok-number">3</span>;
scores[<span class="tok-string">'bob'</span>] = <span class="tok-string">'x'</span>;   <span class="tok-comment">// values must be number</span></code></pre>
<div class="out">record2.ts(4,1): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>Any key is allowed, but every value is constrained to <code>number</code>, so <code>'x'</code> is rejected. This is the typed replacement for a bare object used as a map — you keep the flexibility of arbitrary keys and still get value-type safety.</p>

<div class="callout ok"><code>Record&lt;K, V&gt;</code> = "an object whose keys are <code>K</code> and whose values are <code>V</code>". With a literal-union <code>K</code> it demands every key be present (exhaustive); with <code>string</code> it's an open, value-typed dictionary. Prefer it over an index signature — it's shorter and reads as intent.</div>
<div class="note-ct">Config maps on this site — feature flags by name, permission sets by role, i18n dictionaries by locale — are <code>Record</code> types precisely so that adding a new role or locale turns "you forgot to define it" into a compile error instead of a runtime <code>undefined</code>. That's the exhaustiveness net from chapter 5, now guarding a whole object.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: Record on Code Lab</span><span class="lc-sub">Build an exhaustive permission map and a typed dictionary.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Record</h2>
<p class="lead"><code>Record&lt;K, V&gt;</code> gõ kiểu một object dùng như từ điển: mọi key thuộc kiểu <code>K</code>, mọi giá trị thuộc kiểu <code>V</code>. Khi <code>K</code> là một union các string literal, nó làm một điều mạnh mẽ — nó ép bạn cung cấp <em>đủ mọi</em> key.</p>

<h3>Một bảng tra phải đầy đủ</h3>
<p>Ánh xạ mỗi vai trò tới quyền của nó. Vì <code>K</code> là union literal <code>Role</code>, bỏ sót một cái là lỗi biên dịch — tính đầy đủ (exhaustiveness) của chương 5, áp lên một object:</p>
<pre><code><span class="tok-comment">// record.ts</span>
<span class="tok-keyword">type</span> Role = <span class="tok-string">'admin'</span> | <span class="tok-string">'editor'</span> | <span class="tok-string">'viewer'</span>;
<span class="tok-keyword">const</span> permissions: Record&lt;Role, <span class="tok-keyword">string</span>[]&gt; = {
  admin: [<span class="tok-string">'read'</span>, <span class="tok-string">'write'</span>, <span class="tok-string">'delete'</span>],
  editor: [<span class="tok-string">'read'</span>, <span class="tok-string">'write'</span>],
};</code></pre>
<div class="out">record.ts(3,7): error TS2741: Property 'viewer' is missing in type '{ admin: string[]; editor: string[]; }' but required in type 'Record&lt;Role, string[]&gt;'.</div>
<p>Bạn quên <code>viewer</code>, và TypeScript bắt được. Đây là tính năng sát thủ: thêm một vai trò thứ tư vào union về sau và mọi <code>Record&lt;Role, …&gt;</code> trong codebase sáng đỏ tới khi bạn xử lý nó. Không có lỗ hổng âm thầm nào trong một bản đồ cấu hình.</p>

<h3>Một từ điển mở với key kiểu <code>string</code></h3>
<p>Khi các key chưa biết trước, dùng <code>Record&lt;string, V&gt;</code> — một tập tuỳ ý các key chuỗi, đều ánh xạ tới <code>V</code>:</p>
<pre><code><span class="tok-comment">// record2.ts</span>
<span class="tok-keyword">const</span> scores: Record&lt;<span class="tok-keyword">string</span>, <span class="tok-keyword">number</span>&gt; = {};
scores[<span class="tok-string">'ada'</span>] = <span class="tok-number">3</span>;
scores[<span class="tok-string">'bob'</span>] = <span class="tok-string">'x'</span>;   <span class="tok-comment">// giá trị phải là number</span></code></pre>
<div class="out">record2.ts(4,1): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>Key nào cũng được, nhưng mọi giá trị bị ràng buộc về <code>number</code>, nên <code>'x'</code> bị từ chối. Đây là bản có kiểu thay cho một object trần dùng làm map — bạn giữ được sự linh hoạt của key tuỳ ý mà vẫn có an toàn về kiểu giá trị.</p>

<div class="callout ok"><code>Record&lt;K, V&gt;</code> = "một object có key là <code>K</code> và giá trị là <code>V</code>". Với <code>K</code> là union literal nó đòi mọi key phải có mặt (đầy đủ); với <code>string</code> nó là một từ điển mở, có kiểu giá trị. Hãy ưu tiên nó hơn một index signature — ngắn hơn và đọc ra ý định.</div>
<div class="note-ct">Các bản đồ cấu hình trên site này — feature flag theo tên, tập quyền theo vai trò, từ điển i18n theo locale — là các kiểu <code>Record</code> chính vì để thêm một vai trò hay locale mới biến "bạn quên định nghĩa nó" thành lỗi biên dịch thay vì một <code>undefined</code> lúc chạy. Đó là tấm lưới đầy đủ từ chương 5, giờ canh gác cả một object.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: Record trên Code Lab</span><span class="lc-sub">Dựng một bản đồ quyền đầy đủ và một từ điển có kiểu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — Exclude, NonNullable, ReturnType & Awaited|||8.4 — Exclude, NonNullable, ReturnType & Awaited',
      slug: 'typescript-8-4-exclude-returntype-awaited',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Các utility thao tác trên union và trên hàm: bớt thành viên union (Exclude), bỏ null/undefined (NonNullable), và rút kiểu ra khỏi hàm (ReturnType, Parameters, Awaited).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Exclude, NonNullable, ReturnType &amp; Awaited</h2>
<p class="lead">The rest of the toolbox: utilities that operate on unions and on functions. These are the conditional-plus-<code>infer</code> types of chapter 7, packaged. You'll use them to trim a union, drop nullability, and read a type straight out of your existing code.</p>

<h3>Exclude: remove members from a union</h3>
<p><code>Exclude&lt;U, M&gt;</code> removes from union <code>U</code> everything assignable to <code>M</code>:</p>
<pre><code><span class="tok-comment">// exclude.ts</span>
<span class="tok-keyword">type</span> Status = <span class="tok-string">'draft'</span> | <span class="tok-string">'published'</span> | <span class="tok-string">'archived'</span>;
<span class="tok-keyword">type</span> Active = Exclude&lt;Status, <span class="tok-string">'archived'</span>&gt;;   <span class="tok-comment">// 'draft' | 'published'</span>
<span class="tok-keyword">const</span> s: Active = <span class="tok-string">'archived'</span>;   <span class="tok-comment">// archived was excluded</span></code></pre>
<div class="out">exclude.ts(4,7): error TS2322: Type '"archived"' is not assignable to type 'Active'.</div>
<p><code>Active</code> is <code>Status</code> minus <code>'archived'</code>, so assigning <code>'archived'</code> fails. Its twin <code>Extract&lt;U, M&gt;</code> does the reverse — it keeps only the members that <em>do</em> match <code>M</code>.</p>

<h3>NonNullable: drop null and undefined</h3>
<p><code>NonNullable&lt;T&gt;</code> is <code>Exclude&lt;T, null | undefined&gt;</code> with a friendly name — it removes the two "empty" types from a union:</p>
<pre><code><span class="tok-comment">// nonnull.ts</span>
<span class="tok-keyword">type</span> MaybeName = <span class="tok-keyword">string</span> | <span class="tok-keyword">null</span> | <span class="tok-keyword">undefined</span>;
<span class="tok-keyword">type</span> Name = NonNullable&lt;MaybeName&gt;;   <span class="tok-comment">// string</span>
<span class="tok-keyword">const</span> n: Name = <span class="tok-keyword">null</span>;   <span class="tok-comment">// null was removed</span></code></pre>
<div class="out">nonnull.ts(4,7): error TS2322: Type 'null' is not assignable to type 'string'.</div>
<p>After <code>NonNullable</code>, <code>Name</code> is just <code>string</code>, so <code>null</code> is rejected. Handy right after a guard that has already ruled out the empty cases.</p>

<h3>ReturnType, Parameters &amp; Awaited: read types from code</h3>
<p>These reach into a function's signature so you never re-declare a type that already exists. <code>Awaited</code> unwraps a <code>Promise</code>; nest it on <code>ReturnType</code> to get what an async function resolves to:</p>
<pre><code><span class="tok-comment">// awaited.ts</span>
<span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">load</span>() { <span class="tok-keyword">return</span> <span class="tok-number">42</span>; }
<span class="tok-keyword">type</span> Loaded = Awaited&lt;ReturnType&lt;<span class="tok-keyword">typeof</span> load&gt;&gt;;   <span class="tok-comment">// number</span>
<span class="tok-keyword">const</span> x: Loaded = <span class="tok-string">'no'</span>;   <span class="tok-comment">// Loaded is number</span></code></pre>
<div class="out">awaited.ts(4,7): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p><code>ReturnType&lt;typeof load&gt;</code> is <code>Promise&lt;number&gt;</code>; <code>Awaited&lt;…&gt;</code> peels the promise to <code>number</code>. Alongside them, <code>Parameters&lt;typeof fn&gt;</code> gives a tuple of a function's argument types. The theme: derive the type from the source of truth (the function) instead of writing it twice and letting the copies drift apart.</p>

<div class="callout ok">Union tools: <code>Exclude</code> / <code>Extract</code> trim or keep members; <code>NonNullable</code> drops null &amp; undefined. Function tools: <code>ReturnType</code>, <code>Parameters</code>, <code>Awaited</code> pull types out of existing signatures. All are conditional + <code>infer</code> under the hood — chapter 7 is why they exist.</div>
<div class="note-ct">The pattern <code>Awaited&lt;ReturnType&lt;typeof someService&gt;&gt;</code> shows up across this codebase to type a controller's response from the service it calls — change the service's return shape and the controller's type follows automatically, no manual sync. That single line is worth more than any hand-written interface that would have quietly gone stale.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: union &amp; function utilities on Code Lab</span><span class="lc-sub">Trim a status union and derive a type from an async function.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Exclude, NonNullable, ReturnType &amp; Awaited</h2>
<p class="lead">Phần còn lại của hộp công cụ: các utility thao tác trên union và trên hàm. Chúng là các kiểu conditional-cộng-<code>infer</code> của chương 7, đóng gói sẵn. Bạn sẽ dùng chúng để cắt bớt một union, bỏ tính null, và đọc một kiểu thẳng từ code có sẵn của bạn.</p>

<h3>Exclude: bỏ thành viên khỏi một union</h3>
<p><code>Exclude&lt;U, M&gt;</code> bỏ khỏi union <code>U</code> mọi thứ gán được cho <code>M</code>:</p>
<pre><code><span class="tok-comment">// exclude.ts</span>
<span class="tok-keyword">type</span> Status = <span class="tok-string">'draft'</span> | <span class="tok-string">'published'</span> | <span class="tok-string">'archived'</span>;
<span class="tok-keyword">type</span> Active = Exclude&lt;Status, <span class="tok-string">'archived'</span>&gt;;   <span class="tok-comment">// 'draft' | 'published'</span>
<span class="tok-keyword">const</span> s: Active = <span class="tok-string">'archived'</span>;   <span class="tok-comment">// archived đã bị loại</span></code></pre>
<div class="out">exclude.ts(4,7): error TS2322: Type '"archived"' is not assignable to type 'Active'.</div>
<p><code>Active</code> là <code>Status</code> trừ <code>'archived'</code>, nên gán <code>'archived'</code> hỏng. Người anh em <code>Extract&lt;U, M&gt;</code> làm ngược lại — nó chỉ giữ các thành viên <em>có</em> khớp <code>M</code>.</p>

<h3>NonNullable: bỏ null và undefined</h3>
<p><code>NonNullable&lt;T&gt;</code> là <code>Exclude&lt;T, null | undefined&gt;</code> với một cái tên thân thiện — nó bỏ hai kiểu "rỗng" khỏi một union:</p>
<pre><code><span class="tok-comment">// nonnull.ts</span>
<span class="tok-keyword">type</span> MaybeName = <span class="tok-keyword">string</span> | <span class="tok-keyword">null</span> | <span class="tok-keyword">undefined</span>;
<span class="tok-keyword">type</span> Name = NonNullable&lt;MaybeName&gt;;   <span class="tok-comment">// string</span>
<span class="tok-keyword">const</span> n: Name = <span class="tok-keyword">null</span>;   <span class="tok-comment">// null đã bị bỏ</span></code></pre>
<div class="out">nonnull.ts(4,7): error TS2322: Type 'null' is not assignable to type 'string'.</div>
<p>Sau <code>NonNullable</code>, <code>Name</code> chỉ còn là <code>string</code>, nên <code>null</code> bị từ chối. Tiện ngay sau một phép guard đã loại các trường hợp rỗng.</p>

<h3>ReturnType, Parameters &amp; Awaited: đọc kiểu từ code</h3>
<p>Những cái này thò vào chữ ký của một hàm để bạn không bao giờ khai lại một kiểu đã có sẵn. <code>Awaited</code> bóc một <code>Promise</code>; lồng nó lên <code>ReturnType</code> để lấy thứ một hàm async giải ra:</p>
<pre><code><span class="tok-comment">// awaited.ts</span>
<span class="tok-keyword">async</span> <span class="tok-keyword">function</span> <span class="tok-function">load</span>() { <span class="tok-keyword">return</span> <span class="tok-number">42</span>; }
<span class="tok-keyword">type</span> Loaded = Awaited&lt;ReturnType&lt;<span class="tok-keyword">typeof</span> load&gt;&gt;;   <span class="tok-comment">// number</span>
<span class="tok-keyword">const</span> x: Loaded = <span class="tok-string">'no'</span>;   <span class="tok-comment">// Loaded là number</span></code></pre>
<div class="out">awaited.ts(4,7): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p><code>ReturnType&lt;typeof load&gt;</code> là <code>Promise&lt;number&gt;</code>; <code>Awaited&lt;…&gt;</code> lột promise ra <code>number</code>. Bên cạnh chúng, <code>Parameters&lt;typeof fn&gt;</code> cho một tuple các kiểu đối số của một hàm. Chủ đề chung: suy kiểu từ nguồn sự thật (hàm) thay vì viết nó hai lần rồi để các bản sao trôi lệch nhau.</p>

<div class="callout ok">Công cụ cho union: <code>Exclude</code> / <code>Extract</code> cắt bớt hoặc giữ lại thành viên; <code>NonNullable</code> bỏ null &amp; undefined. Công cụ cho hàm: <code>ReturnType</code>, <code>Parameters</code>, <code>Awaited</code> rút kiểu ra khỏi chữ ký có sẵn. Tất cả đều là conditional + <code>infer</code> bên dưới — chương 7 là lý do chúng tồn tại.</div>
<div class="note-ct">Pattern <code>Awaited&lt;ReturnType&lt;typeof someService&gt;&gt;</code> xuất hiện khắp codebase này để gõ kiểu phản hồi của một controller từ chính service nó gọi — đổi hình dạng trả về của service thì kiểu của controller theo sau tự động, không đồng bộ thủ công. Chỉ một dòng đó đáng giá hơn bất kỳ interface viết tay nào lẽ ra đã âm thầm cũ đi.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: utility cho union &amp; hàm trên Code Lab</span><span class="lc-sub">Cắt một union trạng thái và suy một kiểu từ một hàm async.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 8.5 quiz ─────────────────────────── */
    {
      title: '8.5 — Chapter 8 quiz|||8.5 — Kiểm tra Chương 8',
      slug: 'typescript-8-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về Partial/Required/Readonly, Pick/Omit, Record, Exclude/NonNullable và ReturnType/Awaited — chọn đúng utility cho từng tình huống.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the standard utility types — the ones you'll actually reach for daily. The skill is picking the right one for the shape you need. Questions follow lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that pay off most: <code>Omit</code> for public/safe views (8.2) and <code>Record</code> with a literal union for exhaustive maps (8.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về các utility type chuẩn — những cái bạn thật sự dùng hằng ngày. Kỹ năng là chọn đúng cái cho hình dạng bạn cần. Các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu có lời nhất: <code>Omit</code> cho các góc nhìn công khai/an toàn (8.2) và <code>Record</code> với union literal cho bản đồ đầy đủ (8.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does Partial<User> produce?|||Partial<User> tạo ra gì?',
            options: [
              'User with all fields removed|||User với mọi field bị bỏ',
              'User with every field made optional|||User với mọi field thành tuỳ chọn',
              'User with every field made readonly|||User với mọi field thành readonly',
              'Half of User\'s fields|||Một nửa số field của User',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Under Partial<User>, is { name: "Ada", role: "admin" } valid when role is not a User field?|||Dưới Partial<User>, { name: "Ada", role: "admin" } có hợp lệ khi role không phải field của User?',
            options: [
              'Yes — Partial allows extra keys|||Có — Partial cho phép key thừa',
              'No — Partial only makes existing keys optional; unknown keys are still rejected|||Không — Partial chỉ làm các key có sẵn thành tuỳ chọn; key lạ vẫn bị từ chối',
              'Yes, if role is a string|||Có, nếu role là chuỗi',
              'Only in non-strict mode|||Chỉ trong chế độ không strict',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You want a User type without its passwordHash field. Which utility?|||Bạn muốn một kiểu User bỏ đi field passwordHash. Utility nào?',
            options: [
              "Pick<User, 'passwordHash'>",
              "Omit<User, 'passwordHash'>",
              'Partial<User>',
              'Exclude<User, "passwordHash">',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You want a type with ONLY the email and passwordHash fields of User. Which utility?|||Bạn muốn một kiểu CHỈ có email và passwordHash của User. Utility nào?',
            options: [
              "Omit<User, 'email' | 'passwordHash'>",
              "Pick<User, 'email' | 'passwordHash'>",
              "Record<'email' | 'passwordHash', User>",
              'Required<User>',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does const permissions: Record<Role, string[]> error if Role = "admin"|"editor"|"viewer" and you only define admin and editor?|||Vì sao const permissions: Record<Role, string[]> báo lỗi khi Role = "admin"|"editor"|"viewer" mà bạn chỉ định nghĩa admin và editor?',
            options: [
              'Record allows only two keys|||Record chỉ cho hai key',
              'A literal-union Record requires every key be present — viewer is missing|||Một Record với union literal đòi mọi key phải có mặt — thiếu viewer',
              'string[] is invalid as a value|||string[] không hợp lệ làm giá trị',
              'Roles must be numbers|||Role phải là số',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is Exclude<"draft" | "published" | "archived", "archived">?|||Exclude<"draft" | "published" | "archived", "archived"> là gì?',
            options: [
              '"archived"',
              '"draft" | "published"',
              '"draft" | "published" | "archived"',
              'never',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is NonNullable<string | null | undefined>?|||NonNullable<string | null | undefined> là gì?',
            options: [
              'string | null',
              'string',
              'null | undefined',
              'never',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'For async function load() { return 42 }, what is Awaited<ReturnType<typeof load>>?|||Với async function load() { return 42 }, Awaited<ReturnType<typeof load>> là gì?',
            options: [
              'Promise<number>',
              'number',
              'string',
              'void',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
