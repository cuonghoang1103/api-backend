/**
 * TypeScript — Chương 4: Object, interface & type alias.
 * Mọi output tsc là THẬT (tsc 7.0.2, --strict). Song ngữ .ml-en/.ml-vi.
 * < > trong code → &lt; &gt;; KHÔNG backtick trần (dùng &#96;); ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 4 — Objects, interfaces & type aliases|||Chương 4 — Object, interface & type alias',
  description: 'Mô hình hoá dữ liệu: dáng object, thuộc tính optional/readonly, interface vs type, kế thừa & giao (intersection), index signature & Record.',
  lessons: [
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — Object shapes: optional & readonly properties|||4.1 — Dáng object: thuộc tính optional & readonly',
      slug: 'typescript-4-1-dang-object',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mô tả dáng một object, kiểm tra thuộc tính thừa/thiếu, và hai công cụ chính xác: optional (?) và readonly.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Object shapes: optional &amp; readonly properties</h2>
<p class="lead">Almost all real data is objects — a user, a note, a request body. TypeScript describes an object by its <strong>shape</strong>: which properties it has and what type each is. This is where types stop being decoration and start modelling your domain.</p>

<h3>Describing a shape</h3>
<p>You can write an object type inline with braces, listing <code>name: Type</code> for each property:</p>
<pre><code><span class="tok-keyword">const</span> user: { name: <span class="tok-keyword">string</span>; age: <span class="tok-keyword">number</span> } = { name: <span class="tok-string">'An'</span>, age: <span class="tok-number">30</span> };</code></pre>
<p>Inline types get noisy fast, so you'll almost always name them (next lesson: <code>interface</code> / <code>type</code>). But the shape rules are the same however you write them, and there are two the compiler is strict about.</p>

<h3>Missing property → error</h3>
<pre><code><span class="tok-comment">// missing.ts</span>
<span class="tok-keyword">interface</span> Note { title: <span class="tok-keyword">string</span>; body: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">const</span> n: Note = { title: <span class="tok-string">'Hi'</span> };</code></pre>
<div class="out">missing.ts(2,7): error TS2741: Property 'body' is missing in type '{ title: string; }' but required in type 'Note'.</div>
<p>Every required property must be present. This is what makes "I forgot a field" a compile error instead of an <code>undefined</code> discovered in production.</p>

<h3>Excess property → error (for object literals)</h3>
<pre><code><span class="tok-comment">// excess.ts</span>
<span class="tok-keyword">const</span> n: Note = { title: <span class="tok-string">'Hi'</span>, body: <span class="tok-string">'x'</span>, pinned: <span class="tok-keyword">true</span> };</code></pre>
<div class="out">excess.ts(2,43): error TS2353: Object literal may only specify known properties, and 'pinned' does not exist in type 'Note'.</div>
<p>When you assign an <em>object literal</em> directly, TypeScript also flags <em>extra</em> properties. This "excess property check" catches typos like <code>{ tittle: 'Hi' }</code> — otherwise the misspelled key would just be silently ignored. (The check only applies to fresh literals; a variable widened elsewhere can carry extras — a nuance you'll rarely hit.)</p>

<h3>Optional properties with ?</h3>
<p>A <code>?</code> makes a property optional — it may be absent, and if present must match the type. Inside code, an optional property is <code>T | undefined</code>, so you must check before use:</p>
<pre><code><span class="tok-comment">// optprop.ts</span>
<span class="tok-keyword">interface</span> Note { title: <span class="tok-keyword">string</span>; summary?: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">show</span>(n: Note) {
  <span class="tok-keyword">return</span> n.summary.length;
}</code></pre>
<div class="out">optprop.ts(3,10): error TS18048: 'n.summary' is possibly 'undefined'.</div>
<p>Same protection as optional function parameters (chapter 3): the type makes "might be missing" visible and forces a guard — <code>n.summary?.length</code> or <code>if (n.summary)</code>.</p>

<h3>readonly properties</h3>
<p>Prefix a property with <code>readonly</code> and it can be set when the object is created but never reassigned:</p>
<pre><code><span class="tok-comment">// ro.ts</span>
<span class="tok-keyword">interface</span> Note { <span class="tok-keyword">readonly</span> id: <span class="tok-keyword">string</span>; title: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">const</span> n: Note = { id: <span class="tok-string">'n1'</span>, title: <span class="tok-string">'Hi'</span> };
n.id = <span class="tok-string">'n2'</span>;</code></pre>
<div class="out">ro.ts(3,3): error TS2540: Cannot assign to 'id' because it is a read-only property.</div>
<p>Perfect for identifiers and other values that must never change after creation. Like <code>readonly</code> arrays, it's a compile-time guarantee — erased at runtime, but enforced everywhere the type is used.</p>
<div class="callout ok">These four rules — required, excess, optional, readonly — are the grammar of modelling data. Together they let a type say precisely "these fields must exist, these may, this one can't change, and nothing else belongs here".</div>
<div class="note-ct">This site's core entities model <code>id</code> as <code>readonly</code> and truly-optional fields (a note's summary, a user's bio) with <code>?</code>. The result: the compiler forbids reassigning an id, and forces every place that reads an optional field to consider the "not set" case — before it becomes a runtime crash.</div>
<h3>How the compiler reads an object literal</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Collect the required keys</span><span class="lz-d">Every property without <code>?</code> must be present. A missing one is TS2741 — the field you forgot, caught at build time instead of as an <code>undefined</code> in production.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Check each value against its type</span><span class="lz-d">Ordinary assignability. <code>title: 42</code> against <code>title: string</code> is TS2322, exactly as it would be for a standalone variable.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Excess property check — literals only</span><span class="lz-d">A <em>fresh</em> object literal may carry no unknown keys: TS2353. This is a typo-catcher, not a structural rule, and it is the one step that disappears the moment the literal passes through a variable.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Freeze what is readonly</span><span class="lz-d">Initialisation is allowed, reassignment is TS2540. Compile-time only — erased in the emitted JavaScript, so nothing at runtime enforces it.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — assigning the literal to a variable first switches the typo-catcher off.</strong> <code>const n: Note = { title: 'Hi', body: 'x', pinned: true }</code> is TS2353. But <code>const raw = { title: 'Hi', body: 'x', pinned: true }; const n: Note = raw;</code> compiles clean, because <code>raw</code> is no longer a fresh literal and structural typing only asks "does it have at least what Note needs?". The trap bites hardest with a typo: <code>{ tittle: 'Hi', body: 'x' }</code> assigned directly is an error, but routed through a variable it is a <em>missing required property</em> error instead — a different message pointing at a different line. Type the variable at its declaration (<code>const raw: Note = …</code>) so the check fires where the data is written.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: object types on Code Lab</span><span class="lc-sub">Drill shapes, optional &amp; readonly after this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Dáng object: thuộc tính optional &amp; readonly</h2>
<p class="lead">Gần như mọi dữ liệu thật đều là object — một người dùng, một ghi chú, một thân request. TypeScript mô tả một object bằng <strong>dáng</strong> của nó: có những thuộc tính nào và mỗi cái kiểu gì. Đây là chỗ kiểu thôi làm trang trí mà bắt đầu mô hình hoá lĩnh vực của bạn.</p>

<h3>Mô tả một dáng</h3>
<p>Bạn viết kiểu object ngay tại chỗ bằng ngoặc nhọn, liệt kê <code>tên: Kiểu</code> cho mỗi thuộc tính:</p>
<pre><code><span class="tok-keyword">const</span> user: { name: <span class="tok-keyword">string</span>; age: <span class="tok-keyword">number</span> } = { name: <span class="tok-string">'An'</span>, age: <span class="tok-number">30</span> };</code></pre>
<p>Kiểu viết ngay tại chỗ rối rắm rất nhanh, nên bạn gần như luôn đặt tên chúng (bài sau: <code>interface</code> / <code>type</code>). Nhưng các quy tắc về dáng thì giống nhau dù viết cách nào, và có hai quy tắc trình biên dịch rất nghiêm.</p>

<h3>Thiếu thuộc tính → lỗi</h3>
<pre><code><span class="tok-comment">// missing.ts</span>
<span class="tok-keyword">interface</span> Note { title: <span class="tok-keyword">string</span>; body: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">const</span> n: Note = { title: <span class="tok-string">'Hi'</span> };</code></pre>
<div class="out">missing.ts(2,7): error TS2741: Property 'body' is missing in type '{ title: string; }' but required in type 'Note'.</div>
<p>Mọi thuộc tính bắt buộc phải có mặt. Đây là thứ biến "tôi quên một field" thành lỗi biên dịch thay vì một <code>undefined</code> phát hiện trên production.</p>

<h3>Thuộc tính thừa → lỗi (với object literal)</h3>
<pre><code><span class="tok-comment">// excess.ts</span>
<span class="tok-keyword">const</span> n: Note = { title: <span class="tok-string">'Hi'</span>, body: <span class="tok-string">'x'</span>, pinned: <span class="tok-keyword">true</span> };</code></pre>
<div class="out">excess.ts(2,43): error TS2353: Object literal may only specify known properties, and 'pinned' does not exist in type 'Note'.</div>
<p>Khi bạn gán một <em>object literal</em> trực tiếp, TypeScript còn tô đỏ thuộc tính <em>thừa</em>. "Kiểm tra thuộc tính thừa" này bắt các lỗi gõ sai như <code>{ tittle: 'Hi' }</code> — nếu không thì khoá gõ sai sẽ bị âm thầm phớt lờ. (Phép kiểm chỉ áp cho literal tươi; một biến đã nới rộng ở chỗ khác có thể mang theo thứ thừa — một tinh tế bạn hiếm khi gặp.)</p>

<h3>Thuộc tính optional với ?</h3>
<p>Một dấu <code>?</code> khiến thuộc tính thành optional — nó có thể vắng mặt, và nếu có thì phải khớp kiểu. Trong code, một thuộc tính optional là <code>T | undefined</code>, nên bạn phải kiểm trước khi dùng:</p>
<pre><code><span class="tok-comment">// optprop.ts</span>
<span class="tok-keyword">interface</span> Note { title: <span class="tok-keyword">string</span>; summary?: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">function</span> <span class="tok-function">show</span>(n: Note) {
  <span class="tok-keyword">return</span> n.summary.length;
}</code></pre>
<div class="out">optprop.ts(3,10): error TS18048: 'n.summary' is possibly 'undefined'.</div>
<p>Cùng lớp bảo vệ như tham số hàm optional (chương 3): kiểu làm cho "có thể thiếu" hiện rõ và ép một chốt chặn — <code>n.summary?.length</code> hoặc <code>if (n.summary)</code>.</p>

<h3>Thuộc tính readonly</h3>
<p>Thêm tiền tố <code>readonly</code> cho một thuộc tính thì nó gán được lúc tạo object nhưng không bao giờ gán lại được:</p>
<pre><code><span class="tok-comment">// ro.ts</span>
<span class="tok-keyword">interface</span> Note { <span class="tok-keyword">readonly</span> id: <span class="tok-keyword">string</span>; title: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">const</span> n: Note = { id: <span class="tok-string">'n1'</span>, title: <span class="tok-string">'Hi'</span> };
n.id = <span class="tok-string">'n2'</span>;</code></pre>
<div class="out">ro.ts(3,3): error TS2540: Cannot assign to 'id' because it is a read-only property.</div>
<p>Hoàn hảo cho định danh và các giá trị khác không bao giờ được đổi sau khi tạo. Như mảng <code>readonly</code>, nó là bảo đảm lúc biên dịch — xoá lúc chạy, nhưng ép ở mọi nơi kiểu được dùng.</p>
<div class="callout ok">Bốn quy tắc này — bắt buộc, thừa, optional, readonly — là ngữ pháp của việc mô hình hoá dữ liệu. Cùng nhau chúng cho một kiểu nói chính xác "những field này phải có, những field này có thể, cái này không đổi được, và không gì khác thuộc về đây".</div>
<div class="note-ct">Các entity lõi của site này mô hình <code>id</code> là <code>readonly</code> và các field thật sự optional (summary của ghi chú, bio của người dùng) bằng <code>?</code>. Kết quả: trình biên dịch cấm gán lại id, và ép mọi chỗ đọc một field optional phải cân nhắc trường hợp "chưa đặt" — trước khi nó thành một cú sập lúc chạy.</div>
<h3>Trình biên dịch đọc một object literal thế nào</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Gom các khoá bắt buộc</span><span class="lz-d">Mọi thuộc tính không có <code>?</code> đều phải có mặt. Thiếu một cái là TS2741 — đúng cái field bạn quên, bắt lúc build thay vì thành một <code>undefined</code> trên production.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kiểm từng giá trị với kiểu của nó</span><span class="lz-d">Gán thông thường thôi. <code>title: 42</code> với <code>title: string</code> là TS2322, y hệt như với một biến đứng riêng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kiểm thuộc tính thừa — chỉ với literal</span><span class="lz-d">Một object literal <em>tươi</em> không được mang khoá lạ: TS2353. Đây là cái bẫy-bắt-gõ-nhầm, không phải luật cấu trúc, và nó là bước duy nhất biến mất ngay khi literal đi qua một biến.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đóng băng cái nào readonly</span><span class="lz-d">Khởi tạo thì được, gán lại là TS2540. Chỉ ở thời điểm biên dịch — bị xoá trong JavaScript sinh ra, nên lúc chạy không có gì cưỡng chế.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — gán literal vào một biến trước là tắt luôn cái bẫy-bắt-gõ-nhầm.</strong> <code>const n: Note = { title: 'Hi', body: 'x', pinned: true }</code> là TS2353. Nhưng <code>const raw = { title: 'Hi', body: 'x', pinned: true }; const n: Note = raw;</code> lại biên dịch sạch, vì <code>raw</code> không còn là literal tươi nữa và kiểu cấu trúc chỉ hỏi "nó có đủ những gì Note cần không?". Bẫy này cắn đau nhất khi gõ nhầm: <code>{ tittle: 'Hi', body: 'x' }</code> gán thẳng thì báo lỗi, còn đi vòng qua một biến thì thành lỗi <em>thiếu thuộc tính bắt buộc</em> — một thông báo khác, chỉ vào một dòng khác. Hãy gán kiểu cho biến ngay lúc khai báo (<code>const raw: Note = …</code>) để phép kiểm nổ đúng chỗ dữ liệu được viết ra.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: kiểu object trên Code Lab</span><span class="lc-sub">Rèn dáng, optional &amp; readonly sau chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — interface vs type alias|||4.2 — interface vs type alias',
      slug: 'typescript-4-2-interface-vs-type',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai cách đặt tên một kiểu, khác biệt thật (declaration merging), và quy tắc chọn cái nào cho gọn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>interface vs type alias</h2>
<p class="lead">TypeScript gives you two ways to name a type: <code>interface</code> and <code>type</code>. For describing an object they are 95% interchangeable, and the endless online debate is mostly overblown. But there are real differences worth knowing, and a simple rule to end the indecision.</p>

<h3>The two syntaxes</h3>
<pre><code><span class="tok-comment">// interface — no equals sign, braces</span>
<span class="tok-keyword">interface</span> Note {
  title: <span class="tok-keyword">string</span>;
  body: <span class="tok-keyword">string</span>;
}

<span class="tok-comment">// type alias — an equals sign</span>
<span class="tok-keyword">type</span> Note2 = {
  title: <span class="tok-keyword">string</span>;
  body: <span class="tok-keyword">string</span>;
};</code></pre>
<p>Both describe the same object shape and are used identically: <code>const n: Note = ...</code>. So what actually differs?</p>

<h3>Difference 1: interfaces merge, type aliases collide</h3>
<p>Declare the same interface name twice and TypeScript <em>merges</em> them into one:</p>
<pre><code><span class="tok-comment">// merge.ts — no error</span>
<span class="tok-keyword">interface</span> Box { width: <span class="tok-keyword">number</span>; }
<span class="tok-keyword">interface</span> Box { height: <span class="tok-keyword">number</span>; }
<span class="tok-keyword">const</span> b: Box = { width: <span class="tok-number">10</span>, height: <span class="tok-number">20</span> };   <span class="tok-comment">// Box has BOTH</span></code></pre>
<p>Do the same with a <code>type</code> and it's an error:</p>
<pre><code><span class="tok-comment">// dup.ts</span>
<span class="tok-keyword">type</span> Box = { width: <span class="tok-keyword">number</span> };
<span class="tok-keyword">type</span> Box = { height: <span class="tok-keyword">number</span> };</code></pre>
<div class="out">dup.ts(1,6): error TS2300: Duplicate identifier 'Box'.
dup.ts(2,6): error TS2300: Duplicate identifier 'Box'.</div>
<p>This "declaration merging" is mostly a feature for library authors — it's how you can add a property to an existing library's type (chapter 10's module augmentation). In your own app code it's more often a footgun: two files accidentally declaring the same interface silently combine instead of clashing.</p>

<h3>Difference 2: only type can express non-object types</h3>
<p><code>interface</code> only describes object/function shapes. <code>type</code> can name <em>anything</em> — a union, a primitive alias, a tuple, a conditional type (later chapters):</p>
<pre><code><span class="tok-keyword">type</span> ID = <span class="tok-keyword">string</span> | <span class="tok-keyword">number</span>;              <span class="tok-comment">// union — interface can't do this</span>
<span class="tok-keyword">type</span> Status = <span class="tok-string">'draft'</span> | <span class="tok-string">'published'</span>;      <span class="tok-comment">// literal union</span>
<span class="tok-keyword">type</span> Pair = [<span class="tok-keyword">number</span>, <span class="tok-keyword">number</span>];               <span class="tok-comment">// tuple</span></code></pre>
<p>The moment you need a union or a literal type — which is constantly, from chapter 5 on — you need <code>type</code>. This is the single most practical difference.</p>

<h3>The rule to stop deciding</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Use <code>interface</code></span><span class="v">For object shapes, especially public ones and anything meant to be extended. It gives cleaner error messages and supports <code>extends</code> naturally.</span></div>
  <div class="kv"><span class="k">Use <code>type</code></span><span class="v">For unions, literals, tuples, function types, and any composition (<code>&amp;</code>, mapped, conditional). Whenever it isn't a plain object shape.</span></div>
</div>
<div class="callout ok">A defensible one-liner: "interface for objects, type for everything else." You'll see codebases that use <code>type</code> for absolutely everything, and that's fine too — consistency matters more than the choice. What matters is knowing <em>why</em> the union case forces your hand.</div>
<div class="note-ct">This site leans on <code>interface</code> for its entity shapes and <code>type</code> for the string-literal unions that model status, role and content type — exactly the split above. The union types are also where the famous enum-rename bug lived (chapter 9): a union is only as safe as its single source of truth.</div>
<h3>interface vs type — what actually differs</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Describing an object</span><span class="lz-t">Both work, identically</span><span class="lz-d">Same assignability, same error messages, same performance in practice. This is the 90% case, and it is a coin flip.</span></div>
<div class="lz-node"><span class="lz-k">Declaration merging</span><span class="lz-t">interface only</span><span class="lz-d">Two <code>interface Note</code> in one scope merge into one. Two <code>type Note</code> collide with TS2300. Merging is what makes augmenting <code>Express.Request</code> possible.</span></div>
<div class="lz-node"><span class="lz-k">Unions, tuples, primitives</span><span class="lz-t">type only</span><span class="lz-d"><code>type Status = 'draft' | 'live'</code> has no interface spelling. Anything that is not an object shape needs <code>type</code>.</span></div>
<div class="lz-node"><span class="lz-k">Mapped &amp; conditional types</span><span class="lz-t">type only</span><span class="lz-d"><code>Partial&lt;T&gt;</code>, <code>Omit&lt;T, K&gt;</code> and every utility in chapter 8 are type aliases. An interface cannot compute its own members.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — accidental declaration merging silently widens a type.</strong> Because interfaces merge, a second <code>interface User { role: string }</code> anywhere in the same scope does not error — it quietly adds <code>role</code> to the first one. Copy a file, forget to rename, and now every <code>User</code> in the project demands a field one of them never sets, with the error landing at the <em>call sites</em> rather than at the duplicate declaration. Type aliases fail loudly instead: TS2300 <em>Duplicate identifier</em>, pointing at both declarations. If you are not deliberately augmenting something, that loud failure is the better default.</p></div>
<a class="link-card doc" href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Handbook: differences between type aliases and interfaces</span><span class="lc-sub">The official side-by-side table this lesson condenses.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: interface &amp; type on Code Lab</span><span class="lc-sub">Drill merging, collisions and non-object types.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>interface vs type alias</h2>
<p class="lead">TypeScript cho bạn hai cách đặt tên một kiểu: <code>interface</code> và <code>type</code>. Để mô tả một object chúng thay thế được nhau 95%, và cuộc tranh cãi bất tận trên mạng phần lớn bị thổi phồng. Nhưng có những khác biệt thật đáng biết, và một quy tắc đơn giản để hết do dự.</p>

<h3>Hai cú pháp</h3>
<pre><code><span class="tok-comment">// interface — không dấu bằng, ngoặc nhọn</span>
<span class="tok-keyword">interface</span> Note {
  title: <span class="tok-keyword">string</span>;
  body: <span class="tok-keyword">string</span>;
}

<span class="tok-comment">// type alias — có dấu bằng</span>
<span class="tok-keyword">type</span> Note2 = {
  title: <span class="tok-keyword">string</span>;
  body: <span class="tok-keyword">string</span>;
};</code></pre>
<p>Cả hai mô tả cùng một dáng object và dùng y hệt: <code>const n: Note = ...</code>. Vậy thật sự khác gì?</p>

<h3>Khác biệt 1: interface hợp nhất, type alias va chạm</h3>
<p>Khai cùng một tên interface hai lần thì TypeScript <em>hợp nhất</em> chúng thành một:</p>
<pre><code><span class="tok-comment">// merge.ts — không lỗi</span>
<span class="tok-keyword">interface</span> Box { width: <span class="tok-keyword">number</span>; }
<span class="tok-keyword">interface</span> Box { height: <span class="tok-keyword">number</span>; }
<span class="tok-keyword">const</span> b: Box = { width: <span class="tok-number">10</span>, height: <span class="tok-number">20</span> };   <span class="tok-comment">// Box có CẢ HAI</span></code></pre>
<p>Làm điều tương tự với <code>type</code> thì đó là lỗi:</p>
<pre><code><span class="tok-comment">// dup.ts</span>
<span class="tok-keyword">type</span> Box = { width: <span class="tok-keyword">number</span> };
<span class="tok-keyword">type</span> Box = { height: <span class="tok-keyword">number</span> };</code></pre>
<div class="out">dup.ts(1,6): error TS2300: Duplicate identifier 'Box'.
dup.ts(2,6): error TS2300: Duplicate identifier 'Box'.</div>
<p>"Declaration merging" này chủ yếu là tính năng cho tác giả thư viện — nó là cách bạn thêm một thuộc tính vào kiểu của một thư viện có sẵn (module augmentation ở chương 10). Trong code ứng dụng của bạn nó thường là một cạm bẫy hơn: hai file lỡ khai cùng một interface sẽ âm thầm gộp lại thay vì báo va chạm.</p>

<h3>Khác biệt 2: chỉ type diễn đạt được kiểu không-phải-object</h3>
<p><code>interface</code> chỉ mô tả dáng object/hàm. <code>type</code> đặt tên được cho <em>bất cứ gì</em> — một union, một alias primitive, một tuple, một conditional type (các chương sau):</p>
<pre><code><span class="tok-keyword">type</span> ID = <span class="tok-keyword">string</span> | <span class="tok-keyword">number</span>;              <span class="tok-comment">// union — interface không làm được</span>
<span class="tok-keyword">type</span> Status = <span class="tok-string">'draft'</span> | <span class="tok-string">'published'</span>;      <span class="tok-comment">// literal union</span>
<span class="tok-keyword">type</span> Pair = [<span class="tok-keyword">number</span>, <span class="tok-keyword">number</span>];               <span class="tok-comment">// tuple</span></code></pre>
<p>Khoảnh khắc bạn cần một union hay một kiểu literal — mà điều đó liên tục xảy ra, từ chương 5 trở đi — bạn cần <code>type</code>. Đây là khác biệt thực tế nhất.</p>

<h3>Quy tắc để hết phải quyết</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng <code>interface</code></span><span class="v">Cho dáng object, nhất là dáng công khai và bất cứ gì để được kế thừa. Nó cho thông báo lỗi sạch hơn và hỗ trợ <code>extends</code> tự nhiên.</span></div>
  <div class="kv"><span class="k">Dùng <code>type</code></span><span class="v">Cho union, literal, tuple, kiểu hàm, và mọi kết hợp (<code>&amp;</code>, mapped, conditional). Bất cứ khi nào không phải một dáng object thuần.</span></div>
</div>
<div class="callout ok">Một câu chốt bảo vệ được: "interface cho object, type cho mọi thứ khác." Bạn sẽ thấy những codebase dùng <code>type</code> cho tuyệt đối mọi thứ, và thế cũng ổn — nhất quán quan trọng hơn lựa chọn. Điều đáng nói là biết <em>vì sao</em> trường hợp union buộc tay bạn.</div>
<div class="note-ct">Site này dựa vào <code>interface</code> cho các dáng entity và <code>type</code> cho các union literal-chuỗi mô hình hoá status, role và kiểu nội dung — đúng cách chia ở trên. Các kiểu union cũng là nơi con bug enum-rename nổi tiếng cư ngụ (chương 9): một union chỉ an toàn ngang với nguồn sự thật duy nhất của nó.</div>
<h3>interface với type — thật ra khác nhau ở đâu</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Mô tả một object</span><span class="lz-t">Cả hai đều được, y hệt nhau</span><span class="lz-d">Cùng luật gán, cùng thông báo lỗi, trên thực tế cùng tốc độ. Đây là 90% trường hợp, và nó là chuyện tung đồng xu.</span></div>
<div class="lz-node"><span class="lz-k">Hợp nhất khai báo</span><span class="lz-t">Chỉ interface</span><span class="lz-d">Hai <code>interface Note</code> trong cùng một phạm vi hợp lại làm một. Hai <code>type Note</code> va nhau với TS2300. Chính hợp nhất là thứ cho phép mở rộng <code>Express.Request</code>.</span></div>
<div class="lz-node"><span class="lz-k">Union, tuple, primitive</span><span class="lz-t">Chỉ type</span><span class="lz-d"><code>type Status = 'draft' | 'live'</code> không có cách viết bằng interface. Bất cứ thứ gì không phải dáng object đều cần <code>type</code>.</span></div>
<div class="lz-node"><span class="lz-k">Mapped &amp; conditional type</span><span class="lz-t">Chỉ type</span><span class="lz-d"><code>Partial&lt;T&gt;</code>, <code>Omit&lt;T, K&gt;</code> và mọi utility ở chương 8 đều là type alias. Interface không tự tính ra thành viên của chính nó được.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — hợp nhất khai báo ngoài ý muốn âm thầm nới rộng một kiểu.</strong> Vì interface hợp nhất, một <code>interface User { role: string }</code> thứ hai ở bất cứ đâu trong cùng phạm vi sẽ không báo lỗi — nó lặng lẽ thêm <code>role</code> vào cái thứ nhất. Chép một file, quên đổi tên, thế là mọi <code>User</code> trong dự án đòi một field mà một trong hai chỗ chẳng bao giờ đặt, còn lỗi thì rơi xuống <em>chỗ gọi</em> chứ không phải chỗ khai báo trùng. Type alias thì hỏng to tiếng: TS2300 <em>Duplicate identifier</em>, chỉ vào cả hai khai báo. Nếu bạn không cố tình mở rộng thứ gì, cái hỏng-to-tiếng ấy mới là mặc định tốt hơn.</p></div>
<a class="link-card doc" href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Handbook: khác biệt giữa type alias và interface</span><span class="lc-sub">Bảng đối chiếu chính thức mà bài này cô lại.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: interface &amp; type trên Code Lab</span><span class="lc-sub">Luyện hợp nhất, va chạm và kiểu không-phải-object.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — Composing types: extends & intersection|||4.3 — Kết hợp kiểu: extends & giao (intersection)',
      slug: 'typescript-4-3-extends-intersection',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Kế thừa interface với extends, giao type với &, và lồng object — cách xây kiểu lớn từ mảnh nhỏ tái dùng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Composing types: extends &amp; intersection</h2>
<p class="lead">Real models share pieces: everything has an <code>id</code>, most things have timestamps. Rather than repeat those fields on every type, you compose — build big types out of small reusable ones. There are two tools, one per keyword family.</p>

<h3>interface extends — inherit a shape</h3>
<p>An interface can <code>extends</code> one (or several) others, gaining all their properties:</p>
<pre><code><span class="tok-comment">// ext.ts</span>
<span class="tok-keyword">interface</span> Entity { id: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">interface</span> Note <span class="tok-keyword">extends</span> Entity { title: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">const</span> n: Note = { title: <span class="tok-string">'Hi'</span> };</code></pre>
<div class="out">ext.ts(3,7): error TS2741: Property 'id' is missing in type '{ title: string; }' but required in type 'Note'.</div>
<p><code>Note</code> now requires <em>both</em> <code>id</code> (inherited from <code>Entity</code>) and <code>title</code> — so the object missing <code>id</code> fails. This is how you factor out a common base: define <code>Entity</code> once, and every entity <code>extends</code> it.</p>

<h3>type intersection with &amp; — combine shapes</h3>
<p>The <code>type</code> equivalent is the intersection operator <code>&amp;</code>: <code>A &amp; B</code> is a type that has everything from both:</p>
<pre><code><span class="tok-comment">// inter.ts</span>
<span class="tok-keyword">type</span> Entity = { id: <span class="tok-keyword">string</span> };
<span class="tok-keyword">type</span> Timestamps = { createdAt: <span class="tok-keyword">number</span> };
<span class="tok-keyword">type</span> Note = Entity &amp; Timestamps &amp; { title: <span class="tok-keyword">string</span> };
<span class="tok-keyword">const</span> n: Note = { id: <span class="tok-string">'n1'</span>, title: <span class="tok-string">'Hi'</span> };</code></pre>
<div class="out">inter.ts(4,7): error TS2322: Type '{ id: string; title: string; }' is not assignable to type 'Note'.
  Property 'createdAt' is missing in type '{ id: string; title: string; }' but required in type 'Timestamps'.</div>
<p><code>Note</code> is <code>Entity &amp; Timestamps &amp; {title}</code> — it needs <code>id</code>, <code>createdAt</code> <em>and</em> <code>title</code>. The object above forgot <code>createdAt</code>, and the error names exactly which piece of the intersection is unsatisfied. <code>&amp;</code> is "and": all parts must be present.</p>
<div class="callout warn">Watch the words: <code>&amp;</code> (intersection) means "has all of these" — it makes the type <em>bigger</em>. It's a common beginner trap to read <code>A &amp; B</code> as "A or B". That's <code>|</code> (union, chapter 5), which makes the type <em>smaller</em>. And/or in types is the opposite of the intuition from booleans.</div>

<h3>Nested shapes</h3>
<p>Properties can themselves be objects — you nest types as deeply as the data:</p>
<pre><code><span class="tok-keyword">interface</span> Note {
  id: <span class="tok-keyword">string</span>;
  author: {
    id: <span class="tok-keyword">string</span>;
    name: <span class="tok-keyword">string</span>;
  };
}</code></pre>
<p>Usually you'd name the nested shape (<code>interface Author { ... }</code>) and reference it — smaller, reusable, and each piece gets its own name in error messages. Composition over one giant nested blob.</p>
<div class="note-ct">This site's models are built exactly this way: a shared base carries <code>id</code> and timestamps, entities extend it, and relations reference other named types (a note references its author, not an inline blob). Prisma even generates these types for you (chapter 13) — composed, named, and kept in sync with the database schema.</div>
<h3>extends and &amp; are not the same tool</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">interface B extends A</span><span class="lz-t">Checked at the declaration</span><span class="lz-d">If B redeclares a member of A with an incompatible type, you get TS2430 <em>right there</em>, on the interface. The conflict is reported where you wrote it.</span></div>
<div class="lz-layer"><span class="lz-k">type B = A &amp; { … }</span><span class="lz-t">Computed lazily</span><span class="lz-d">The intersection is formed silently. A conflicting member becomes the intersection of both types — often <code>never</code> — and nothing complains until someone tries to assign a value.</span></div>
<div class="lz-layer"><span class="lz-k">Same conflict, two experiences</span><span class="lz-t">One points at the cause</span><span class="lz-d"><code>extends</code> names the offending interface; <code>&amp;</code> names the innocent call site with "Type 'string' is not assignable to type 'never'".</span></div>
</div>
<div class="pitfall"><p><strong>Trap — an intersection that quietly evaluates to <code>never</code>.</strong> <code>type A = { id: string }; type B = { id: number }; type C = A &amp; B;</code> compiles without a word. <code>C['id']</code> is <code>string &amp; number</code>, which is <code>never</code> — so <code>C</code> is a type no object can ever satisfy. You find out later at a construction site: <em>Type 'string' is not assignable to type 'never'</em>, pointing at perfectly correct code hundreds of lines from the mistake. When you are composing object shapes and want a conflict to be an error, use <code>interface … extends</code>: it reports TS2430 on the declaration itself.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: composing types on Code Lab</span><span class="lc-sub">Build types from reusable pieces after this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Kết hợp kiểu: extends &amp; giao (intersection)</h2>
<p class="lead">Mô hình thật chia sẻ các mảnh: mọi thứ đều có <code>id</code>, phần lớn có mốc thời gian. Thay vì lặp các field đó trên mọi kiểu, bạn kết hợp — dựng kiểu lớn từ những kiểu nhỏ tái dùng được. Có hai công cụ, mỗi họ từ khoá một cái.</p>

<h3>interface extends — kế thừa một dáng</h3>
<p>Một interface có thể <code>extends</code> một (hoặc nhiều) interface khác, nhận hết thuộc tính của chúng:</p>
<pre><code><span class="tok-comment">// ext.ts</span>
<span class="tok-keyword">interface</span> Entity { id: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">interface</span> Note <span class="tok-keyword">extends</span> Entity { title: <span class="tok-keyword">string</span>; }
<span class="tok-keyword">const</span> n: Note = { title: <span class="tok-string">'Hi'</span> };</code></pre>
<div class="out">ext.ts(3,7): error TS2741: Property 'id' is missing in type '{ title: string; }' but required in type 'Note'.</div>
<p><code>Note</code> giờ đòi <em>cả</em> <code>id</code> (kế thừa từ <code>Entity</code>) lẫn <code>title</code> — nên object thiếu <code>id</code> thất bại. Đây là cách bạn tách ra một base chung: định nghĩa <code>Entity</code> một lần, và mọi entity <code>extends</code> nó.</p>

<h3>type giao với &amp; — gộp các dáng</h3>
<p>Cái tương đương cho <code>type</code> là toán tử giao <code>&amp;</code>: <code>A &amp; B</code> là một kiểu có mọi thứ từ cả hai:</p>
<pre><code><span class="tok-comment">// inter.ts</span>
<span class="tok-keyword">type</span> Entity = { id: <span class="tok-keyword">string</span> };
<span class="tok-keyword">type</span> Timestamps = { createdAt: <span class="tok-keyword">number</span> };
<span class="tok-keyword">type</span> Note = Entity &amp; Timestamps &amp; { title: <span class="tok-keyword">string</span> };
<span class="tok-keyword">const</span> n: Note = { id: <span class="tok-string">'n1'</span>, title: <span class="tok-string">'Hi'</span> };</code></pre>
<div class="out">inter.ts(4,7): error TS2322: Type '{ id: string; title: string; }' is not assignable to type 'Note'.
  Property 'createdAt' is missing in type '{ id: string; title: string; }' but required in type 'Timestamps'.</div>
<p><code>Note</code> là <code>Entity &amp; Timestamps &amp; {title}</code> — nó cần <code>id</code>, <code>createdAt</code> <em>và</em> <code>title</code>. Object ở trên quên <code>createdAt</code>, và lỗi gọi tên chính xác mảnh nào của giao chưa được thoả. <code>&amp;</code> là "và": mọi phần phải có mặt.</p>
<div class="callout warn">Coi chừng chữ nghĩa: <code>&amp;</code> (giao) nghĩa là "có tất cả những cái này" — nó làm kiểu <em>to hơn</em>. Một cái bẫy thường gặp của người mới là đọc <code>A &amp; B</code> thành "A hoặc B". Đó là <code>|</code> (union, chương 5), thứ làm kiểu <em>nhỏ hơn</em>. Và/hoặc trong kiểu ngược với trực giác từ boolean.</div>

<h3>Dáng lồng nhau</h3>
<p>Thuộc tính bản thân cũng có thể là object — bạn lồng kiểu sâu như dữ liệu:</p>
<pre><code><span class="tok-keyword">interface</span> Note {
  id: <span class="tok-keyword">string</span>;
  author: {
    id: <span class="tok-keyword">string</span>;
    name: <span class="tok-keyword">string</span>;
  };
}</code></pre>
<p>Thường bạn sẽ đặt tên cho dáng lồng (<code>interface Author { ... }</code>) rồi tham chiếu — nhỏ hơn, tái dùng được, và mỗi mảnh có tên riêng trong thông báo lỗi. Kết hợp hơn là một cục lồng khổng lồ.</p>
<div class="note-ct">Các model của site này được dựng đúng kiểu này: một base chung mang <code>id</code> và mốc thời gian, các entity extends nó, và quan hệ tham chiếu tới các kiểu có tên khác (một ghi chú tham chiếu tác giả của nó, không phải một cục inline). Prisma thậm chí sinh các kiểu này hộ bạn (chương 13) — đã kết hợp, có tên, và giữ đồng bộ với schema cơ sở dữ liệu.</div>
<h3>extends và &amp; không phải cùng một công cụ</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">interface B extends A</span><span class="lz-t">Kiểm ngay tại khai báo</span><span class="lz-d">Nếu B khai lại một thành viên của A với kiểu không tương thích, bạn nhận TS2430 <em>ngay tại đó</em>, trên chính interface. Xung đột được báo đúng chỗ bạn viết ra nó.</span></div>
<div class="lz-layer"><span class="lz-k">type B = A &amp; { … }</span><span class="lz-t">Tính toán lười</span><span class="lz-d">Phép giao được tạo ra lặng lẽ. Một thành viên xung đột trở thành giao của cả hai kiểu — thường là <code>never</code> — và chẳng ai kêu ca cho tới khi có người thử gán một giá trị.</span></div>
<div class="lz-layer"><span class="lz-k">Cùng một xung đột, hai trải nghiệm</span><span class="lz-t">Một cái chỉ vào nguyên nhân</span><span class="lz-d"><code>extends</code> gọi tên interface có lỗi; <code>&amp;</code> gọi tên chỗ gọi vô tội với "Type 'string' is not assignable to type 'never'".</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một phép giao âm thầm rút gọn thành <code>never</code>.</strong> <code>type A = { id: string }; type B = { id: number }; type C = A &amp; B;</code> biên dịch không một lời. <code>C['id']</code> là <code>string &amp; number</code>, tức là <code>never</code> — nên <code>C</code> là kiểu mà không object nào thoả nổi. Bạn phát hiện ra sau đó ở một chỗ dựng object: <em>Type 'string' is not assignable to type 'never'</em>, chỉ vào đoạn mã hoàn toàn đúng cách chỗ sai hàng trăm dòng. Khi đang ghép các dáng object và muốn xung đột thành lỗi, hãy dùng <code>interface … extends</code>: nó báo TS2430 ngay trên khai báo.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: kết hợp kiểu trên Code Lab</span><span class="lc-sub">Dựng kiểu từ những mảnh tái dùng sau chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — Index signatures & Record|||4.4 — Index signature & Record',
      slug: 'typescript-4-4-index-record',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mô tả một "từ điển" khoá động với index signature, và cách gọn hơn Record<K, V> — cho object mà tên khoá chưa biết trước.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Index signatures &amp; Record</h2>
<p class="lead">So far every type had a fixed set of known property names. But sometimes the <em>keys</em> aren't known ahead of time — a dictionary of scores by subject, a cache keyed by id. For that you describe the key type and the value type, not each property.</p>

<h3>Index signatures</h3>
<p>An index signature says "any key of this type maps to a value of that type":</p>
<pre><code><span class="tok-comment">// idx.ts</span>
<span class="tok-keyword">interface</span> Scores { [subject: <span class="tok-keyword">string</span>]: <span class="tok-keyword">number</span>; }
<span class="tok-keyword">const</span> s: Scores = { math: <span class="tok-number">9</span>, lit: <span class="tok-number">8</span> };
s.chem = <span class="tok-string">'A'</span>;</code></pre>
<div class="out">idx.ts(3,1): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p><code>[subject: string]: number</code> means "any string key, number value". You can add <code>s.chem = 10</code> freely, but <code>s.chem = 'A'</code> violates the value type. The key name (<code>subject</code>) is just documentation — only its type (<code>string</code>) matters.</p>
<div class="pitfall">An index signature quietly makes <em>every</em> string key "valid" to read, so <code>s.spelledWrong</code> won't error — it's typed as <code>number</code>, and at runtime it's <code>undefined</code>. That's the trade: flexibility on keys costs you typo-protection. Turn on <code>noUncheckedIndexedAccess</code> (chapter 9) and reads become <code>number | undefined</code>, forcing a check — much safer for real dictionaries.</div>

<h3>Record — the cleaner spelling</h3>
<p>The built-in <code>Record&lt;Keys, Value&gt;</code> utility type does the same thing more legibly, and it's what you'll see in real code:</p>
<pre><code><span class="tok-keyword">type</span> Scores = <span class="tok-keyword">Record</span>&lt;<span class="tok-keyword">string</span>, <span class="tok-keyword">number</span>&gt;;        <span class="tok-comment">// same as { [k: string]: number }</span></code></pre>
<p>Where <code>Record</code> shines is with a <em>known set</em> of keys — combine it with the literal unions from chapter 2:</p>
<pre><code><span class="tok-keyword">type</span> Status = <span class="tok-string">'draft'</span> | <span class="tok-string">'published'</span> | <span class="tok-string">'archived'</span>;
<span class="tok-keyword">type</span> Counts = <span class="tok-keyword">Record</span>&lt;Status, <span class="tok-keyword">number</span>&gt;;
<span class="tok-keyword">const</span> c: Counts = { draft: <span class="tok-number">3</span>, published: <span class="tok-number">10</span>, archived: <span class="tok-number">1</span> };</code></pre>
<p>Now the keys are exactly the three statuses — miss one and it errors, add a fourth and it errors. This is <code>Record</code> at its best: a complete, exhaustive map from a fixed set of keys. (<code>Record</code> is your first utility type; chapter 8 builds the whole family, including how <code>Record</code> is defined.)</p>

<h3>When to use which</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Unknown keys</span><span class="v"><code>Record&lt;string, V&gt;</code> — a genuine dictionary/cache where keys arrive at runtime.</span></div>
  <div class="kv"><span class="k">Known keys</span><span class="v"><code>Record&lt;Union, V&gt;</code> — a complete map over a fixed set. The compiler enforces you cover them all.</span></div>
  <div class="kv"><span class="k">A fixed named shape</span><span class="v">A plain <code>interface</code> — when you know the exact property names and they differ in type.</span></div>
</div>
<div class="note-ct">This site uses <code>Record&lt;string, ...&gt;</code> style maps for genuine lookups (caches, counts by key) and reserves fixed interfaces for entities. The <code>Record&lt;Status, number&gt;</code> pattern — a count per known status — is exactly how a dashboard tallies content, and the compiler guarantees no status is silently forgotten.</div>
<h3>Index signature vs Record — same idea, different reach</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">[k: string]: T</span><span class="lz-t">Any key, unknown set</span><span class="lz-d">Reading <code>obj.anything</code> type-checks and returns <code>T</code>. Correct for genuinely open dictionaries — a header bag, a parsed query string.</span></div>
<div class="lz-node"><span class="lz-k">Record&lt;string, T&gt;</span><span class="lz-t">The same thing, spelled shorter</span><span class="lz-d">Desugars to an index signature. Preferred because it composes: it is a type alias, so it can be mapped and intersected.</span></div>
<div class="lz-node"><span class="lz-k">Record&lt;'a' | 'b', T&gt;</span><span class="lz-t">A closed set of keys</span><span class="lz-d">Now the compiler knows every key. Missing one is an error, and a typo'd key is an error — neither of which an open index signature can catch.</span></div>
<div class="lz-node"><span class="lz-k">noUncheckedIndexedAccess</span><span class="lz-t">Makes lookups honest</span><span class="lz-d">Turns <code>T</code> into <code>T | undefined</code> for index reads, forcing the check that reflects what the dictionary actually promises.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — an index signature promises every key exists.</strong> With <code>const counts: Record&lt;string, number&gt; = {}</code>, the expression <code>counts.missing</code> has type <code>number</code>, not <code>number | undefined</code>. So <code>counts.missing + 1</code> compiles clean and evaluates to <code>NaN</code> at runtime, and the <code>NaN</code> then propagates silently through every arithmetic step downstream. The type said "number" because an index signature describes what a key would hold <em>if</em> it were there, not whether it is. Two fixes: turn on <code>noUncheckedIndexedAccess</code> so the read is <code>number | undefined</code>, or close the key set with <code>Record&lt;'a' | 'b', number&gt;</code> so the compiler can prove every key is present.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: index signatures &amp; Record on Code Lab</span><span class="lc-sub">Cement chapter 4 with the matching exercises.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Index signature &amp; Record</h2>
<p class="lead">Tới giờ mọi kiểu đều có một tập tên thuộc tính cố định đã biết. Nhưng đôi khi các <em>khoá</em> chưa biết trước — một từ điển điểm theo môn, một cache khoá theo id. Cho việc đó bạn mô tả kiểu khoá và kiểu giá trị, không phải từng thuộc tính.</p>

<h3>Index signature</h3>
<p>Một index signature nói "bất kỳ khoá kiểu này ánh xạ tới một giá trị kiểu kia":</p>
<pre><code><span class="tok-comment">// idx.ts</span>
<span class="tok-keyword">interface</span> Scores { [subject: <span class="tok-keyword">string</span>]: <span class="tok-keyword">number</span>; }
<span class="tok-keyword">const</span> s: Scores = { math: <span class="tok-number">9</span>, lit: <span class="tok-number">8</span> };
s.chem = <span class="tok-string">'A'</span>;</code></pre>
<div class="out">idx.ts(3,1): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p><code>[subject: string]: number</code> nghĩa là "bất kỳ khoá chuỗi, giá trị số". Bạn thêm <code>s.chem = 10</code> thoải mái, nhưng <code>s.chem = 'A'</code> vi phạm kiểu giá trị. Tên khoá (<code>subject</code>) chỉ là tài liệu — chỉ kiểu của nó (<code>string</code>) mới quan trọng.</p>
<div class="pitfall">Một index signature âm thầm khiến <em>mọi</em> khoá chuỗi "hợp lệ" khi đọc, nên <code>s.spelledWrong</code> sẽ không lỗi — nó được gõ kiểu <code>number</code>, còn lúc chạy là <code>undefined</code>. Đó là cái đánh đổi: linh hoạt về khoá đổi lấy mất bảo vệ chống gõ sai. Bật <code>noUncheckedIndexedAccess</code> (chương 9) và phép đọc trở thành <code>number | undefined</code>, ép một phép kiểm — an toàn hơn nhiều cho từ điển thật.</div>

<h3>Record — cách viết gọn hơn</h3>
<p>Utility type sẵn có <code>Record&lt;Keys, Value&gt;</code> làm cùng việc đó dễ đọc hơn, và đó là thứ bạn sẽ thấy trong code thật:</p>
<pre><code><span class="tok-keyword">type</span> Scores = <span class="tok-keyword">Record</span>&lt;<span class="tok-keyword">string</span>, <span class="tok-keyword">number</span>&gt;;        <span class="tok-comment">// giống { [k: string]: number }</span></code></pre>
<p>Chỗ <code>Record</code> toả sáng là với một <em>tập khoá đã biết</em> — kết hợp nó với các union literal ở chương 2:</p>
<pre><code><span class="tok-keyword">type</span> Status = <span class="tok-string">'draft'</span> | <span class="tok-string">'published'</span> | <span class="tok-string">'archived'</span>;
<span class="tok-keyword">type</span> Counts = <span class="tok-keyword">Record</span>&lt;Status, <span class="tok-keyword">number</span>&gt;;
<span class="tok-keyword">const</span> c: Counts = { draft: <span class="tok-number">3</span>, published: <span class="tok-number">10</span>, archived: <span class="tok-number">1</span> };</code></pre>
<p>Giờ các khoá đúng là ba status — thiếu một cái là lỗi, thêm cái thứ tư là lỗi. Đây là <code>Record</code> ở phong độ đỉnh: một map đầy đủ, kín từ một tập khoá cố định. (<code>Record</code> là utility type đầu tiên của bạn; chương 8 dựng cả họ, gồm cả cách <code>Record</code> được định nghĩa.)</p>

<h3>Khi nào dùng cái nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Khoá chưa biết</span><span class="v"><code>Record&lt;string, V&gt;</code> — một từ điển/cache thật nơi khoá tới lúc chạy.</span></div>
  <div class="kv"><span class="k">Khoá đã biết</span><span class="v"><code>Record&lt;Union, V&gt;</code> — một map kín trên một tập cố định. Trình biên dịch ép bạn phủ hết.</span></div>
  <div class="kv"><span class="k">Một dáng cố định có tên</span><span class="v">Một <code>interface</code> thuần — khi bạn biết chính xác các tên thuộc tính và chúng khác kiểu nhau.</span></div>
</div>
<div class="note-ct">Site này dùng các map kiểu <code>Record&lt;string, ...&gt;</code> cho các tra cứu thật (cache, đếm theo khoá) và dành interface cố định cho entity. Mẫu <code>Record&lt;Status, number&gt;</code> — một số đếm cho mỗi status đã biết — đúng là cách một dashboard cộng dồn nội dung, và trình biên dịch bảo đảm không status nào bị âm thầm quên.</div>
<h3>Index signature với Record — cùng ý tưởng, tầm với khác nhau</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">[k: string]: T</span><span class="lz-t">Khoá nào cũng được, tập khoá không biết trước</span><span class="lz-d">Đọc <code>obj.batkycai</code> vẫn qua kiểm kiểu và trả về <code>T</code>. Đúng cho từ điển thật sự mở — một túi header, một query string đã phân tích.</span></div>
<div class="lz-node"><span class="lz-k">Record&lt;string, T&gt;</span><span class="lz-t">Cùng một thứ, viết gọn hơn</span><span class="lz-d">Rút gọn thành index signature. Được ưa hơn vì nó ghép được: nó là type alias, nên map và giao được.</span></div>
<div class="lz-node"><span class="lz-k">Record&lt;'a' | 'b', T&gt;</span><span class="lz-t">Một tập khoá đóng</span><span class="lz-d">Giờ trình biên dịch biết mọi khoá. Thiếu một cái là lỗi, gõ nhầm một khoá là lỗi — index signature mở không bắt được cái nào trong hai.</span></div>
<div class="lz-node"><span class="lz-k">noUncheckedIndexedAccess</span><span class="lz-t">Bắt phép tra khoá nói thật</span><span class="lz-d">Biến <code>T</code> thành <code>T | undefined</code> khi đọc theo chỉ mục, ép bạn kiểm đúng thứ mà từ điển thật sự hứa hẹn.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — index signature hứa rằng khoá nào cũng tồn tại.</strong> Với <code>const counts: Record&lt;string, number&gt; = {}</code>, biểu thức <code>counts.missing</code> có kiểu <code>number</code>, không phải <code>number | undefined</code>. Nên <code>counts.missing + 1</code> biên dịch sạch và cho ra <code>NaN</code> lúc chạy, rồi cái <code>NaN</code> đó lan âm thầm qua mọi phép tính phía sau. Kiểu nói "number" vì index signature mô tả một khoá sẽ chứa gì <em>nếu</em> nó có ở đó, chứ không phải nó có hay không. Hai cách chữa: bật <code>noUncheckedIndexedAccess</code> để phép đọc thành <code>number | undefined</code>, hoặc đóng tập khoá bằng <code>Record&lt;'a' | 'b', number&gt;</code> để trình biên dịch chứng minh được mọi khoá đều có.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: index signature &amp; Record trên Code Lab</span><span class="lc-sub">Củng cố chương 4 bằng các bài tập tương ứng.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 4.5 quiz ─────────────────────────── */
    {
      title: '4.5 — Chapter 4 quiz|||4.5 — Kiểm tra Chương 4',
      slug: 'typescript-4-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về dáng object, optional/readonly, interface vs type, extends/intersection, index signature & Record.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on modelling data with object types. Answer from memory; the questions follow lesson order so a miss points straight at what to revisit.</p>
<div class="callout ok">Aim for 7/8. This chapter ends Stage 1 — with it solid, you're ready for unions and narrowing, where the type system really starts to earn its reputation.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về mô hình hoá dữ liệu bằng kiểu object. Trả lời bằng trí nhớ; các câu xếp theo thứ tự bài nên câu sai chỉ thẳng chỗ cần xem lại.</p>
<div class="callout ok">Hãy nhắm 7/8. Chương này khép lại Giai đoạn 1 — vững nó rồi, bạn sẵn sàng cho union và thu hẹp kiểu, nơi hệ thống kiểu thật sự bắt đầu tạo dựng danh tiếng.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'const n: Note = { title: "Hi", body: "x", pinned: true } where Note lacks pinned gives?|||const n: Note = { title: "Hi", body: "x", pinned: true } khi Note không có pinned cho ra?',
            options: [
              'No error — extra properties are ignored|||Không lỗi — thuộc tính thừa bị bỏ qua',
              "TS2353: Object literal may only specify known properties ('pinned' does not exist)|||TS2353: Object literal may only specify known properties ('pinned' does not exist)",
              'pinned becomes optional|||pinned trở thành optional',
              'A runtime error|||Một lỗi lúc chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Inside code, an optional property summary?: string has what type?|||Trong code, một thuộc tính optional summary?: string mang kiểu gì?',
            options: [
              'string',
              'string | undefined — you must check before use|||string | undefined — phải kiểm trước khi dùng',
              'any',
              'never',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Assigning to a readonly id property gives?|||Gán vào một thuộc tính readonly id cho ra?',
            options: [
              'TS2540: Cannot assign to id because it is a read-only property|||TS2540: Cannot assign to id because it is a read-only property',
              'No error at compile time|||Không lỗi lúc biên dịch',
              'It freezes the object at runtime|||Nó đóng băng object lúc chạy',
              'It creates a new property|||Nó tạo một thuộc tính mới',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Declaring interface Box twice (with different props) does what?|||Khai interface Box hai lần (với thuộc tính khác nhau) ra sao?',
            options: [
              'Errors: Duplicate identifier|||Lỗi: Duplicate identifier',
              'Merges them — Box has all properties from both|||Hợp nhất — Box có mọi thuộc tính từ cả hai',
              'The second replaces the first|||Cái thứ hai thay cái thứ nhất',
              'Only the first is used|||Chỉ cái thứ nhất được dùng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which CANNOT be written with interface (only with type)?|||Cái nào KHÔNG viết được bằng interface (chỉ bằng type)?',
            options: [
              'An object shape with methods|||Một dáng object có method',
              'A union like "draft" | "published"|||Một union như "draft" | "published"',
              'A shape that extends another|||Một dáng extends cái khác',
              'A shape with readonly fields|||Một dáng có field readonly',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does A & B (intersection) mean?|||A & B (giao) nghĩa là gì?',
            options: [
              'A value that is A OR B|||Một giá trị là A HOẶC B',
              'A value that has everything from BOTH A and B|||Một giá trị có mọi thứ từ CẢ A và B',
              'A tuple of A and B|||Một tuple gồm A và B',
              'Neither A nor B|||Không A cũng không B',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'interface Scores { [k: string]: number } — what does s.chem = "A" do?|||interface Scores { [k: string]: number } — s.chem = "A" ra sao?',
            options: [
              'Allowed|||Được phép',
              "TS2322: Type 'string' is not assignable to type 'number'|||TS2322: Type 'string' is not assignable to type 'number'",
              'Adds chem as a string key|||Thêm chem như một khoá chuỗi',
              'Errors: unknown key|||Lỗi: khoá không xác định',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'For a complete map over a fixed set of keys, the best tool is?|||Cho một map kín trên một tập khoá cố định, công cụ tốt nhất là?',
            options: [
              'Record<Union, Value> — the compiler enforces every key is covered|||Record<Union, Value> — trình biên dịch ép phủ mọi khoá',
              'any',
              'A tuple|||Một tuple',
              '[key: string]: Value with no union|||[key: string]: Value không union',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
