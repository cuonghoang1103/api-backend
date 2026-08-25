/**
 * TypeScript — Chương 14: Class & decorator.
 * Mọi output tsc là THẬT (tsc --strict --target ES2022, verified). Song ngữ.
 * < > → &lt; &gt;; & → &amp;; KHÔNG backtick trần (&#96;); ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 14 — Classes & decorators|||Chương 14 — Class & decorator',
  description: 'Class trong TypeScript: modifier truy cập, parameter property, abstract & implements, field #private thật, và decorator (stage-3) — thứ đứng sau NestJS, TypeORM, Angular.',
  lessons: [
    /* ─────────────────────────── 14.1 ─────────────────────────── */
    {
      title: '14.1 — Classes & access modifiers|||14.1 — Class & modifier truy cập',
      slug: 'typescript-14-1-classes-access',
      type: 'LESSON',
      isFreePreview: true,
      description: 'public/private/protected/readonly kiểm soát ai đọc được field; parameter property (public readonly owner) khai và gán field ngay trong constructor.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>Classes &amp; access modifiers</h2>
<p class="lead">TypeScript adds compile-time access control to JavaScript classes. <code>private</code>, <code>protected</code>, <code>public</code> and <code>readonly</code> say who may touch a field — and a <em>parameter property</em> lets the constructor declare and assign a field in one stroke.</p>

<h3>private: only inside the class</h3>
<p>A <code>private</code> field is invisible outside its class. The constructor parameter <code>public readonly owner</code> is a parameter property — the modifier turns the argument into a class field automatically:</p>
<pre><code><span class="tok-comment">// access.ts</span>
<span class="tok-keyword">class</span> BankAccount {
  <span class="tok-keyword">private</span> balance = <span class="tok-number">0</span>;
  <span class="tok-keyword">constructor</span>(<span class="tok-keyword">public</span> <span class="tok-keyword">readonly</span> owner: <span class="tok-keyword">string</span>) {}
  <span class="tok-function">deposit</span>(n: <span class="tok-keyword">number</span>) { <span class="tok-keyword">this</span>.balance += n; }
}
<span class="tok-keyword">const</span> acc = <span class="tok-keyword">new</span> <span class="tok-function">BankAccount</span>(<span class="tok-string">'Ada'</span>);
acc.<span class="tok-function">deposit</span>(<span class="tok-number">100</span>);
console.<span class="tok-function">log</span>(acc.balance);   <span class="tok-comment">// balance is private</span></code></pre>
<div class="out">access.ts(9,17): error TS2341: Property 'balance' is private and only accessible within class 'BankAccount'.</div>
<p>You can call <code>deposit</code> (it's public) but not read <code>balance</code> from outside — the class controls its own invariants. Note <code>balance</code> never needed a separate field declaration and assignment: the parameter property <code>public readonly owner</code> did both for <code>owner</code> in the constructor signature, which is why you'll see that pattern everywhere in TypeScript classes.</p>

<h3>readonly: assignable once</h3>
<p>A <code>readonly</code> field can be set at construction but never reassigned:</p>
<pre><code><span class="tok-comment">// readonly.ts</span>
<span class="tok-keyword">class</span> BankAccount {
  <span class="tok-keyword">constructor</span>(<span class="tok-keyword">public</span> <span class="tok-keyword">readonly</span> owner: <span class="tok-keyword">string</span>) {}
}
<span class="tok-keyword">const</span> acc = <span class="tok-keyword">new</span> <span class="tok-function">BankAccount</span>(<span class="tok-string">'Ada'</span>);
acc.owner = <span class="tok-string">'Bob'</span>;   <span class="tok-comment">// owner is a readonly parameter property</span></code></pre>
<div class="out">readonly.ts(6,5): error TS2540: Cannot assign to 'owner' because it is a read-only property.</div>
<p>The owner is fixed for the life of the account — reassigning it is a compile error, the same <code>readonly</code> guarantee you saw on object types in chapter 4, now on a class field. Combine the modifiers freely: <code>private readonly</code>, <code>protected readonly</code>, and so on.</p>

<div class="callout ok">Access modifiers are compile-time: <code>private</code> (this class only), <code>protected</code> (this class + subclasses), <code>public</code> (default, anywhere), plus <code>readonly</code> (set once). A parameter property — a modifier on a constructor parameter — declares and assigns the field in one line.</div>
<div class="note-ct">The <code>AppError</code> class from chapter 11 used exactly a parameter property (<code>constructor(public statusCode: number, …)</code>) — that one keyword is why <code>err.statusCode</code> exists and is typed without a separate field declaration. Service classes here use <code>private</code> for internal state so callers can only go through the public methods.</div>
<h3>Two kinds of private, two kinds of guarantee</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">private field</span><span class="lz-t">Compile-time only</span><span class="lz-d">Erased in the emitted JavaScript. <code>obj['secret']</code> reads it at runtime, and any JS caller sees it plainly.</span></div>
<div class="lz-node"><span class="lz-k">#field</span><span class="lz-t">Enforced by the runtime</span><span class="lz-d">A real JavaScript feature. Access from outside is a <code>SyntaxError</code>, and it does not appear in <code>Object.keys</code> or <code>JSON.stringify</code>.</span></div>
<div class="lz-node"><span class="lz-k">protected</span><span class="lz-t">Subclasses too</span><span class="lz-d">Same erasure as <code>private</code>. Useful for a base class's shared state, with the same runtime caveat.</span></div>
<div class="lz-node"><span class="lz-k">readonly</span><span class="lz-t">Assignable once</span><span class="lz-d">In the constructor or at declaration, never again. Also compile-time — <code>Object.freeze</code> is the runtime equivalent.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>private</code> does not keep a field out of your API responses.</strong> A class with <code>private passwordHash: string</code> passed to <code>res.json(user)</code> serialises the hash: <code>JSON.stringify</code> walks the object's own enumerable properties, and <code>private</code> left no trace in the emitted code to walk past. The same goes for <code>console.log</code>, structured logging, and anything that spreads the object. Only <code>#passwordHash</code> is genuinely hidden from serialisation. Better still, do not rely on the class shape at all for what leaves the process: build the response with an explicit <code>Pick</code>-based DTO, so a new field on the model cannot become a new field in the response.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: classes on Code Lab</span><span class="lc-sub">Use access modifiers and a parameter property.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Class &amp; modifier truy cập</h2>
<p class="lead">TypeScript thêm kiểm soát truy cập lúc-biên-dịch vào class JavaScript. <code>private</code>, <code>protected</code>, <code>public</code> và <code>readonly</code> nói ai được chạm vào một field — và một <em>parameter property</em> cho constructor khai và gán một field trong một nét.</p>

<h3>private: chỉ trong class</h3>
<p>Một field <code>private</code> vô hình bên ngoài class của nó. Tham số constructor <code>public readonly owner</code> là một parameter property — modifier biến đối số thành một field của class tự động:</p>
<pre><code><span class="tok-comment">// access.ts</span>
<span class="tok-keyword">class</span> BankAccount {
  <span class="tok-keyword">private</span> balance = <span class="tok-number">0</span>;
  <span class="tok-keyword">constructor</span>(<span class="tok-keyword">public</span> <span class="tok-keyword">readonly</span> owner: <span class="tok-keyword">string</span>) {}
  <span class="tok-function">deposit</span>(n: <span class="tok-keyword">number</span>) { <span class="tok-keyword">this</span>.balance += n; }
}
<span class="tok-keyword">const</span> acc = <span class="tok-keyword">new</span> <span class="tok-function">BankAccount</span>(<span class="tok-string">'Ada'</span>);
acc.<span class="tok-function">deposit</span>(<span class="tok-number">100</span>);
console.<span class="tok-function">log</span>(acc.balance);   <span class="tok-comment">// balance là private</span></code></pre>
<div class="out">access.ts(9,17): error TS2341: Property 'balance' is private and only accessible within class 'BankAccount'.</div>
<p>Bạn gọi được <code>deposit</code> (nó public) nhưng không đọc được <code>balance</code> từ bên ngoài — class kiểm soát các bất biến của chính nó. Để ý <code>balance</code> chưa bao giờ cần một khai báo và gán field riêng: parameter property <code>public readonly owner</code> làm cả hai cho <code>owner</code> ngay trong chữ ký constructor, đó là lý do bạn sẽ thấy pattern đó khắp nơi trong class TypeScript.</p>

<h3>readonly: gán được một lần</h3>
<p>Một field <code>readonly</code> đặt được lúc dựng nhưng không bao giờ gán lại:</p>
<pre><code><span class="tok-comment">// readonly.ts</span>
<span class="tok-keyword">class</span> BankAccount {
  <span class="tok-keyword">constructor</span>(<span class="tok-keyword">public</span> <span class="tok-keyword">readonly</span> owner: <span class="tok-keyword">string</span>) {}
}
<span class="tok-keyword">const</span> acc = <span class="tok-keyword">new</span> <span class="tok-function">BankAccount</span>(<span class="tok-string">'Ada'</span>);
acc.owner = <span class="tok-string">'Bob'</span>;   <span class="tok-comment">// owner là parameter property readonly</span></code></pre>
<div class="out">readonly.ts(6,5): error TS2540: Cannot assign to 'owner' because it is a read-only property.</div>
<p>Chủ tài khoản cố định suốt đời tài khoản — gán lại nó là lỗi biên dịch, cùng bảo đảm <code>readonly</code> bạn thấy trên kiểu object ở chương 4, giờ trên một field class. Kết hợp các modifier tự do: <code>private readonly</code>, <code>protected readonly</code>, v.v.</p>

<div class="callout ok">Modifier truy cập là lúc-biên-dịch: <code>private</code> (chỉ class này), <code>protected</code> (class này + lớp con), <code>public</code> (mặc định, ở đâu cũng được), cộng <code>readonly</code> (đặt một lần). Một parameter property — một modifier trên tham số constructor — khai và gán field trong một dòng.</div>
<div class="note-ct">Lớp <code>AppError</code> ở chương 11 dùng đúng một parameter property (<code>constructor(public statusCode: number, …)</code>) — chính từ khoá đó là lý do <code>err.statusCode</code> tồn tại và có kiểu mà không cần một khai báo field riêng. Các lớp service ở đây dùng <code>private</code> cho trạng thái nội bộ để bên gọi chỉ đi qua các phương thức public.</div>
<h3>Hai loại private, hai loại bảo đảm</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">field private</span><span class="lz-t">Chỉ lúc biên dịch</span><span class="lz-d">Bị xoá trong JavaScript sinh ra. <code>obj['secret']</code> đọc được nó lúc chạy, và mọi chỗ gọi bằng JS đều thấy nó rành rành.</span></div>
<div class="lz-node"><span class="lz-k">#field</span><span class="lz-t">Runtime cưỡng chế</span><span class="lz-d">Một tính năng thật của JavaScript. Truy cập từ ngoài là <code>SyntaxError</code>, và nó không hiện trong <code>Object.keys</code> hay <code>JSON.stringify</code>.</span></div>
<div class="lz-node"><span class="lz-k">protected</span><span class="lz-t">Lớp con cũng thấy</span><span class="lz-d">Bị xoá y như <code>private</code>. Có ích cho trạng thái dùng chung của lớp nền, với cùng cái cảnh báo về runtime.</span></div>
<div class="lz-node"><span class="lz-k">readonly</span><span class="lz-t">Gán được một lần</span><span class="lz-d">Trong constructor hoặc ngay lúc khai, không bao giờ nữa. Cũng là lúc biên dịch — <code>Object.freeze</code> mới là thứ tương đương lúc chạy.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>private</code> không giữ một field khỏi lọt vào phản hồi API của bạn.</strong> Một class có <code>private passwordHash: string</code> truyền vào <code>res.json(user)</code> sẽ tuần tự hoá luôn cái hash: <code>JSON.stringify</code> duyệt các thuộc tính riêng liệt kê được của object, và <code>private</code> chẳng để lại dấu vết nào trong mã sinh ra để mà bỏ qua. Chuyện tương tự với <code>console.log</code>, log có cấu trúc, và bất cứ thứ gì trải object ra. Chỉ <code>#passwordHash</code> mới thật sự giấu được khỏi phép tuần tự hoá. Tốt hơn nữa, đừng dựa vào dáng của class cho những gì rời khỏi tiến trình: hãy dựng phản hồi bằng một DTO tường minh dựa trên <code>Pick</code>, để một field mới trên model không thể thành một field mới trong phản hồi.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: class trên Code Lab</span><span class="lc-sub">Dùng modifier truy cập và một parameter property.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.2 ─────────────────────────── */
    {
      title: '14.2 — Inheritance, abstract & implements|||14.2 — Kế thừa, abstract & implements',
      slug: 'typescript-14-2-abstract-implements',
      type: 'LESSON',
      isFreePreview: true,
      description: 'abstract class định nghĩa khung chung nhưng không tạo được thực thể; implements bắt một class phải khớp một interface — thiếu phương thức là lỗi biên dịch.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Inheritance, abstract &amp; implements</h2>
<p class="lead">Two ways a class relates to a contract. <code>extends</code> inherits from a base class (and <code>abstract</code> makes a base that can't be instantiated on its own); <code>implements</code> promises a class matches an interface's shape, checked at compile time.</p>

<h3>abstract: a base you can't instantiate</h3>
<p>An <code>abstract</code> class defines shared behaviour and declares <code>abstract</code> methods that subclasses must fill in. You can't create one directly — only its concrete subclasses:</p>
<pre><code><span class="tok-comment">// abstract.ts</span>
<span class="tok-keyword">interface</span> Shape { <span class="tok-function">area</span>(): <span class="tok-keyword">number</span>; }
<span class="tok-keyword">abstract</span> <span class="tok-keyword">class</span> Base <span class="tok-keyword">implements</span> Shape {
  <span class="tok-keyword">abstract</span> <span class="tok-function">area</span>(): <span class="tok-keyword">number</span>;
  <span class="tok-function">describe</span>(): <span class="tok-keyword">string</span> { <span class="tok-keyword">return</span> <span class="tok-string">'area='</span> + <span class="tok-keyword">this</span>.<span class="tok-function">area</span>(); }
}
<span class="tok-keyword">class</span> Circle <span class="tok-keyword">extends</span> Base {
  <span class="tok-keyword">constructor</span>(<span class="tok-keyword">private</span> r: <span class="tok-keyword">number</span>) { <span class="tok-function">super</span>(); }
  <span class="tok-function">area</span>(): <span class="tok-keyword">number</span> { <span class="tok-keyword">return</span> Math.PI * <span class="tok-keyword">this</span>.r ** <span class="tok-number">2</span>; }
}
<span class="tok-keyword">const</span> b = <span class="tok-keyword">new</span> <span class="tok-function">Base</span>();   <span class="tok-comment">// cannot instantiate an abstract class</span></code></pre>
<div class="out">abstract.ts(12,11): error TS2511: Cannot create an instance of an abstract class.</div>
<p><code>Base</code> provides <code>describe()</code> for everyone but leaves <code>area()</code> abstract, so it makes no sense on its own — <code>new Base()</code> is rejected. <code>Circle extends Base</code> supplies the real <code>area()</code> and can be instantiated. This is the "template with holes subclasses fill" pattern, enforced by the compiler.</p>

<h3>implements: match an interface</h3>
<p><code>implements Shape</code> is a promise checked at compile time — the class must have everything the interface declares. Forget a method and you hear about it immediately:</p>
<pre><code><span class="tok-comment">// implements.ts</span>
<span class="tok-keyword">interface</span> Shape { <span class="tok-function">area</span>(): <span class="tok-keyword">number</span>; }
<span class="tok-keyword">class</span> Square <span class="tok-keyword">implements</span> Shape {
  <span class="tok-keyword">constructor</span>(<span class="tok-keyword">private</span> side: <span class="tok-keyword">number</span>) {}
  <span class="tok-comment">// forgot area()</span>
}</code></pre>
<div class="out">implements.ts(3,7): error TS2420: Class 'Square' incorrectly implements interface 'Shape'.
  Property 'area' is missing in type 'Square' but required in type 'Shape'.</div>
<p><code>Square</code> claimed to be a <code>Shape</code> but never provided <code>area()</code> — caught. Note <code>implements</code> only <em>checks</em> the shape; it doesn't inherit any code (interfaces have none). Use <code>extends</code> to share implementation, <code>implements</code> to enforce a contract; a class can do both, and implement several interfaces at once.</p>

<div class="callout ok"><code>abstract class</code> = a base with holes (<code>abstract</code> methods) that can't be instantiated directly. <code>implements Interface</code> = a compile-time promise the class matches the interface — miss a member and it's TS2420. <code>extends</code> shares code; <code>implements</code> enforces shape.</div>
<div class="note-ct">Where this codebase reaches for classes — error types, a few service abstractions — it leans on <code>implements</code> to pin a class to an interface so a refactor can't silently drop a method the rest of the app calls. Plain functions cover most of the app, but the class contract is the right tool when several implementations must share one shape.</div>
<h3>abstract vs implements — where the check lands</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">abstract class</span><span class="lz-t">Shared code plus required holes</span><span class="lz-d">Cannot be instantiated. A subclass that leaves an abstract member unimplemented is TS2515, reported on the subclass.</span></div>
<div class="lz-layer"><span class="lz-k">implements Interface</span><span class="lz-t">A check, not an inheritance</span><span class="lz-d">Nothing is inherited; the compiler just verifies the class has the members. Purely compile-time — the emitted JavaScript has no trace of it.</span></div>
<div class="lz-layer"><span class="lz-k">Use abstract for shared behaviour</span><span class="lz-t">When variants really are variants of one thing</span><span class="lz-d">A base that holds the common algorithm and defers the differing step. If there is no shared code, an interface is lighter.</span></div>
<div class="lz-layer"><span class="lz-k">Use implements for a contract</span><span class="lz-t">When several unrelated classes fill one role</span><span class="lz-d">A storage adapter, a mailer, a cache. Consumers depend on the interface, so swapping the class is a one-line change.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>implements</code> does not give the class's members their types.</strong> <code>class R2Storage implements Storage { async put(key, body) { … } }</code> looks checked, and under <code>noImplicitAny</code> it is TS7006 on both parameters: the <code>implements</code> clause verifies the class against the interface, it does not <em>infer</em> from it (unlike a contextual annotation, which does). Without <code>noImplicitAny</code> it is worse — the parameters are silently <code>any</code>, so the method both satisfies the interface and accepts anything. Annotate the members, or drop <code>implements</code> and annotate the variable instead (<code>const storage: Storage = new R2Storage()</code>), where the contextual type does flow inward.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: abstract &amp; implements on Code Lab</span><span class="lc-sub">Build an abstract base and implement an interface.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Kế thừa, abstract &amp; implements</h2>
<p class="lead">Hai cách một class liên hệ với một khế ước. <code>extends</code> kế thừa từ một lớp nền (và <code>abstract</code> tạo một nền không tự tạo thực thể được); <code>implements</code> hứa một class khớp hình dạng của một interface, kiểm lúc biên dịch.</p>

<h3>abstract: một nền không tạo thực thể được</h3>
<p>Một class <code>abstract</code> định nghĩa hành vi chung và khai các phương thức <code>abstract</code> mà lớp con phải điền. Bạn không tạo trực tiếp được — chỉ các lớp con cụ thể của nó:</p>
<pre><code><span class="tok-comment">// abstract.ts</span>
<span class="tok-keyword">interface</span> Shape { <span class="tok-function">area</span>(): <span class="tok-keyword">number</span>; }
<span class="tok-keyword">abstract</span> <span class="tok-keyword">class</span> Base <span class="tok-keyword">implements</span> Shape {
  <span class="tok-keyword">abstract</span> <span class="tok-function">area</span>(): <span class="tok-keyword">number</span>;
  <span class="tok-function">describe</span>(): <span class="tok-keyword">string</span> { <span class="tok-keyword">return</span> <span class="tok-string">'area='</span> + <span class="tok-keyword">this</span>.<span class="tok-function">area</span>(); }
}
<span class="tok-keyword">class</span> Circle <span class="tok-keyword">extends</span> Base {
  <span class="tok-keyword">constructor</span>(<span class="tok-keyword">private</span> r: <span class="tok-keyword">number</span>) { <span class="tok-function">super</span>(); }
  <span class="tok-function">area</span>(): <span class="tok-keyword">number</span> { <span class="tok-keyword">return</span> Math.PI * <span class="tok-keyword">this</span>.r ** <span class="tok-number">2</span>; }
}
<span class="tok-keyword">const</span> b = <span class="tok-keyword">new</span> <span class="tok-function">Base</span>();   <span class="tok-comment">// không tạo thực thể lớp abstract được</span></code></pre>
<div class="out">abstract.ts(12,11): error TS2511: Cannot create an instance of an abstract class.</div>
<p><code>Base</code> cung cấp <code>describe()</code> cho mọi lớp con nhưng để <code>area()</code> abstract, nên nó vô nghĩa nếu đứng một mình — <code>new Base()</code> bị từ chối. <code>Circle extends Base</code> cung cấp <code>area()</code> thật và tạo thực thể được. Đây là pattern "khuôn có lỗ để lớp con điền", được trình biên dịch ép.</p>

<h3>implements: khớp một interface</h3>
<p><code>implements Shape</code> là một lời hứa kiểm lúc biên dịch — class phải có mọi thứ interface khai. Quên một phương thức là bạn nghe ngay:</p>
<pre><code><span class="tok-comment">// implements.ts</span>
<span class="tok-keyword">interface</span> Shape { <span class="tok-function">area</span>(): <span class="tok-keyword">number</span>; }
<span class="tok-keyword">class</span> Square <span class="tok-keyword">implements</span> Shape {
  <span class="tok-keyword">constructor</span>(<span class="tok-keyword">private</span> side: <span class="tok-keyword">number</span>) {}
  <span class="tok-comment">// quên area()</span>
}</code></pre>
<div class="out">implements.ts(3,7): error TS2420: Class 'Square' incorrectly implements interface 'Shape'.
  Property 'area' is missing in type 'Square' but required in type 'Shape'.</div>
<p><code>Square</code> tuyên bố là một <code>Shape</code> nhưng chưa bao giờ cung cấp <code>area()</code> — bị bắt. Để ý <code>implements</code> chỉ <em>kiểm</em> hình dạng; nó không kế thừa code nào (interface không có code). Dùng <code>extends</code> để chia sẻ cài đặt, <code>implements</code> để ép một khế ước; một class làm được cả hai, và implements nhiều interface một lúc.</p>

<div class="callout ok"><code>abstract class</code> = một nền có lỗ (phương thức <code>abstract</code>) không tạo trực tiếp được. <code>implements Interface</code> = một lời hứa lúc-biên-dịch class khớp interface — thiếu một thành viên là TS2420. <code>extends</code> chia sẻ code; <code>implements</code> ép hình dạng.</div>
<div class="note-ct">Nơi codebase này dùng tới class — kiểu lỗi, vài trừu tượng service — nó dựa vào <code>implements</code> để ghim một class vào một interface, để một lần đại tu không âm thầm bỏ một phương thức phần còn lại của app gọi. Hàm thuần bao phủ đa số app, nhưng khế ước class là công cụ đúng khi nhiều cài đặt phải chia sẻ một hình dạng.</div>
<h3>abstract với implements — phép kiểm rơi ở đâu</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">abstract class</span><span class="lz-t">Mã dùng chung cộng những chỗ trống bắt buộc</span><span class="lz-d">Không tạo thực thể được. Một lớp con bỏ trống một thành viên abstract là TS2515, báo ngay trên lớp con.</span></div>
<div class="lz-layer"><span class="lz-k">implements Interface</span><span class="lz-t">Một phép kiểm, không phải kế thừa</span><span class="lz-d">Chẳng có gì được kế thừa; trình biên dịch chỉ xác minh class có đủ thành viên. Thuần tuý lúc biên dịch — JavaScript sinh ra không còn dấu vết nào.</span></div>
<div class="lz-layer"><span class="lz-k">Dùng abstract cho hành vi chung</span><span class="lz-t">Khi các biến thể thật sự là biến thể của một thứ</span><span class="lz-d">Một lớp nền giữ thuật toán chung và hoãn lại bước khác biệt. Nếu không có mã chung thì một interface nhẹ hơn.</span></div>
<div class="lz-layer"><span class="lz-k">Dùng implements cho một hợp đồng</span><span class="lz-t">Khi vài class chẳng họ hàng cùng đóng một vai</span><span class="lz-d">Một adapter lưu trữ, một bộ gửi thư, một bộ nhớ đệm. Chỗ tiêu thụ phụ thuộc vào interface, nên đổi class chỉ là sửa một dòng.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>implements</code> KHÔNG gán kiểu cho các thành viên của class.</strong> <code>class R2Storage implements Storage { async put(key, body) { … } }</code> nhìn có vẻ đã được kiểm, và dưới <code>noImplicitAny</code> nó là TS7006 trên cả hai tham số: mệnh đề <code>implements</code> xác minh class với interface, chứ nó không <em>suy ra</em> từ interface (khác với chú thích theo ngữ cảnh, vốn có suy ra). Không có <code>noImplicitAny</code> thì còn tệ hơn — các tham số âm thầm thành <code>any</code>, nên phương thức vừa thoả interface vừa nhận bất cứ gì. Hãy chú thích cho các thành viên, hoặc bỏ <code>implements</code> mà chú thích cho biến (<code>const storage: Storage = new R2Storage()</code>), nơi kiểu ngữ cảnh có chảy vào bên trong.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: abstract &amp; implements trên Code Lab</span><span class="lc-sub">Dựng một nền abstract và implements một interface.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.3 ─────────────────────────── */
    {
      title: '14.3 — Native #private, getters & static|||14.3 — #private thật, getter & static',
      slug: 'typescript-14-3-hash-private-static',
      type: 'LESSON',
      isFreePreview: true,
      description: 'private của TypeScript chỉ chặn lúc biên dịch; field #private của JavaScript chặn cả lúc chạy. Cộng getter/setter và thành viên static.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Native #private, getters &amp; static</h2>
<p class="lead">There are two kinds of "private" in a TypeScript class, and the difference matters. <code>private</code> is a TypeScript-only, compile-time rule; <code>#field</code> is real JavaScript privacy enforced at runtime. Plus the class members you'll reach for constantly: getters, setters, and <code>static</code>.</p>

<h3>#private: enforced at runtime, not just by the compiler</h3>
<p>A field named with <code>#</code> is genuinely inaccessible from outside the class — the compiler rejects it, and so does the JavaScript engine at runtime (a TypeScript <code>private</code>, by contrast, disappears after compilation and can be reached with a cast):</p>
<pre><code><span class="tok-comment">// hashprivate.ts</span>
<span class="tok-keyword">class</span> Counter {
  #count = <span class="tok-number">0</span>;   <span class="tok-comment">// truly private (enforced at runtime)</span>
  <span class="tok-function">inc</span>(): <span class="tok-keyword">void</span> { <span class="tok-keyword">this</span>.#count++; }
  <span class="tok-keyword">get</span> <span class="tok-function">value</span>(): <span class="tok-keyword">number</span> { <span class="tok-keyword">return</span> <span class="tok-keyword">this</span>.#count; }
}
<span class="tok-keyword">const</span> c = <span class="tok-keyword">new</span> <span class="tok-function">Counter</span>();
c.<span class="tok-function">inc</span>();
console.<span class="tok-function">log</span>(c.#count);   <span class="tok-comment">// # fields aren't accessible outside the class</span></code></pre>
<div class="out">hashprivate.ts(9,15): error TS18013: Property '#count' is not accessible outside class 'Counter' because it has a private identifier.</div>
<p>Reaching <code>c.#count</code> is a hard error, and unlike <code>private</code> it can't be bypassed with <code>(c as any)</code> at runtime — the privacy is real. Use <code>#</code> when you want true encapsulation; <code>private</code> is fine when you only need the compile-time discipline.</p>

<h3>Getters, setters &amp; static</h3>
<p>The example already shows a getter: <code>get value()</code> exposes <code>#count</code> read-only, so callers read <code>c.value</code> (no parentheses) but can't set it. A <code>set</code> accessor would let them assign with validation. And <code>static</code> members belong to the class itself, not an instance:</p>
<pre><code><span class="tok-keyword">class</span> User {
  <span class="tok-keyword">static</span> <span class="tok-function">fromRow</span>(row: { name: <span class="tok-keyword">string</span> }): User { <span class="tok-keyword">return</span> <span class="tok-keyword">new</span> <span class="tok-function">User</span>(row.name); }
  <span class="tok-keyword">constructor</span>(<span class="tok-keyword">public</span> name: <span class="tok-keyword">string</span>) {}
}
<span class="tok-keyword">const</span> u = User.<span class="tok-function">fromRow</span>({ name: <span class="tok-string">'Ada'</span> });   <span class="tok-comment">// called on the class, not an instance</span></code></pre>
<p>A <code>static</code> factory like <code>User.fromRow(...)</code> is called on the class, not on an object — handy for named constructors and utilities that logically belong to the type.</p>

<div class="callout ok">Two privacies: <code>private</code> is compile-time only (erased, bypassable with a cast); <code>#field</code> is runtime-enforced JavaScript privacy. <code>get</code>/<code>set</code> accessors expose controlled read/write; <code>static</code> members live on the class itself, not on instances.</div>
<div class="note-ct">For state that must never leak, <code>#</code> fields give a guarantee <code>private</code> can't; for everyday internal state where the compile-time check is enough, <code>private</code> reads more familiarly. Getters are how a class exposes derived values read-only, and <code>static</code> factories show up as the "build one of these from a raw row" helpers around typed data access.</div>
<h3>What survives compilation, and what does not</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">#field: a runtime feature</span><span class="lz-d">Emitted as-is. The privacy is the engine's, not the compiler's — which is why it is the only one that holds against plain JavaScript.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">get / set: real accessors</span><span class="lz-d">They emit as accessors on the prototype, so a getter can validate on read and a setter can guard on write.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">static: on the class, not the instance</span><span class="lz-d">Shared by every instance. A static factory is the idiomatic way to keep a constructor simple and still validate inputs.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">private / protected / readonly: gone</span><span class="lz-d">Erased entirely. They are promises to your team and to the compiler, not to the runtime.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — a <code>get</code>/<code>set</code> pair whose types disagree is an error you will hit sooner than you expect.</strong> TypeScript requires the setter's parameter type to be assignable from the getter's return type; writing <code>get value(): number</code> beside <code>set value(v: string)</code> is TS2380. The tempting workaround — make both <code>string | number</code> — spreads the ambiguity to every consumer, who now must narrow after every read. If reading and writing genuinely have different shapes (a date read as a <code>Date</code> but written as an ISO string), that is a sign they are two operations, not one property: give them explicit names (<code>getDate()</code> / <code>setDateFromISO()</code>) so the difference is visible at the call site.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: #private &amp; static on Code Lab</span><span class="lc-sub">Encapsulate with # and add a static factory.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>#private thật, getter &amp; static</h2>
<p class="lead">Có hai loại "private" trong một class TypeScript, và khác biệt rất quan trọng. <code>private</code> là quy tắc chỉ-TypeScript, lúc-biên-dịch; <code>#field</code> là quyền riêng tư JavaScript thật, ép lúc chạy. Cộng các thành viên class bạn dùng liên tục: getter, setter, và <code>static</code>.</p>

<h3>#private: ép lúc chạy, không chỉ bởi trình biên dịch</h3>
<p>Một field đặt tên với <code>#</code> thật sự không truy cập được từ ngoài class — trình biên dịch từ chối, và engine JavaScript cũng vậy lúc chạy (một <code>private</code> của TypeScript, ngược lại, biến mất sau khi biên dịch và chạm được qua một phép ép):</p>
<pre><code><span class="tok-comment">// hashprivate.ts</span>
<span class="tok-keyword">class</span> Counter {
  #count = <span class="tok-number">0</span>;   <span class="tok-comment">// thật sự private (ép lúc chạy)</span>
  <span class="tok-function">inc</span>(): <span class="tok-keyword">void</span> { <span class="tok-keyword">this</span>.#count++; }
  <span class="tok-keyword">get</span> <span class="tok-function">value</span>(): <span class="tok-keyword">number</span> { <span class="tok-keyword">return</span> <span class="tok-keyword">this</span>.#count; }
}
<span class="tok-keyword">const</span> c = <span class="tok-keyword">new</span> <span class="tok-function">Counter</span>();
c.<span class="tok-function">inc</span>();
console.<span class="tok-function">log</span>(c.#count);   <span class="tok-comment">// field # không truy cập được ngoài class</span></code></pre>
<div class="out">hashprivate.ts(9,15): error TS18013: Property '#count' is not accessible outside class 'Counter' because it has a private identifier.</div>
<p>Chạm <code>c.#count</code> là một lỗi cứng, và khác <code>private</code> nó không bị lách bằng <code>(c as any)</code> lúc chạy — quyền riêng tư là thật. Dùng <code>#</code> khi bạn muốn đóng gói thật; <code>private</code> ổn khi bạn chỉ cần kỷ luật lúc-biên-dịch.</p>

<h3>Getter, setter &amp; static</h3>
<p>Ví dụ đã cho thấy một getter: <code>get value()</code> phơi <code>#count</code> chỉ-đọc, nên bên gọi đọc <code>c.value</code> (không ngoặc) nhưng không đặt được. Một accessor <code>set</code> sẽ cho họ gán kèm validate. Và thành viên <code>static</code> thuộc về chính class, không phải một thực thể:</p>
<pre><code><span class="tok-keyword">class</span> User {
  <span class="tok-keyword">static</span> <span class="tok-function">fromRow</span>(row: { name: <span class="tok-keyword">string</span> }): User { <span class="tok-keyword">return</span> <span class="tok-keyword">new</span> <span class="tok-function">User</span>(row.name); }
  <span class="tok-keyword">constructor</span>(<span class="tok-keyword">public</span> name: <span class="tok-keyword">string</span>) {}
}
<span class="tok-keyword">const</span> u = User.<span class="tok-function">fromRow</span>({ name: <span class="tok-string">'Ada'</span> });   <span class="tok-comment">// gọi trên class, không phải thực thể</span></code></pre>
<p>Một factory <code>static</code> như <code>User.fromRow(...)</code> được gọi trên class, không phải trên một object — tiện cho constructor có tên và tiện ích thuộc về kiểu về mặt logic.</p>

<div class="callout ok">Hai quyền riêng tư: <code>private</code> chỉ lúc-biên-dịch (bị xoá, lách được bằng ép kiểu); <code>#field</code> là riêng tư JavaScript ép lúc chạy. Accessor <code>get</code>/<code>set</code> phơi đọc/ghi có kiểm soát; thành viên <code>static</code> sống trên chính class, không trên thực thể.</div>
<div class="note-ct">Với trạng thái không được rò rỉ, field <code>#</code> cho một bảo đảm <code>private</code> không có; với trạng thái nội bộ đời thường nơi phép kiểm lúc-biên-dịch là đủ, <code>private</code> đọc quen mắt hơn. Getter là cách một class phơi giá trị dẫn xuất chỉ-đọc, và factory <code>static</code> xuất hiện dưới dạng các helper "dựng một cái từ một hàng thô" quanh việc truy cập dữ liệu có kiểu.</div>
<h3>Thứ gì sống sót qua biên dịch, thứ gì không</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">#field: tính năng của runtime</span><span class="lz-d">Sinh ra nguyên vẹn. Tính riêng tư là của máy chạy, không phải của trình biên dịch — và đó là lý do nó là thứ duy nhất trụ được trước JavaScript thuần.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">get / set: accessor thật</span><span class="lz-d">Chúng sinh ra thành accessor trên prototype, nên một getter kiểm được lúc đọc và một setter chặn được lúc ghi.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">static: trên class, không trên thực thể</span><span class="lz-d">Mọi thực thể dùng chung. Một factory static là cách đúng điệu để giữ constructor đơn giản mà vẫn kiểm được đầu vào.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">private / protected / readonly: biến mất</span><span class="lz-d">Bị xoá sạch. Chúng là lời hứa với đồng đội và với trình biên dịch, không phải với runtime.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một cặp <code>get</code>/<code>set</code> có kiểu bất đồng là lỗi bạn sẽ gặp sớm hơn tưởng.</strong> TypeScript đòi kiểu tham số của setter phải nhận được kiểu trả về của getter; viết <code>get value(): number</code> cạnh <code>set value(v: string)</code> là TS2380. Cách lách hấp dẫn — cho cả hai thành <code>string | number</code> — lại rải sự mập mờ đó tới mọi chỗ tiêu thụ, và giờ họ phải thu hẹp sau mỗi lần đọc. Nếu đọc và ghi thật sự có dáng khác nhau (một ngày đọc ra thành <code>Date</code> nhưng ghi vào bằng chuỗi ISO), đó là dấu hiệu chúng là hai thao tác chứ không phải một thuộc tính: hãy đặt tên tường minh (<code>getDate()</code> / <code>setDateFromISO()</code>) để sự khác biệt hiện rõ ngay tại chỗ gọi.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: #private &amp; static trên Code Lab</span><span class="lc-sub">Đóng gói bằng # và thêm một factory static.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.4 ─────────────────────────── */
    {
      title: '14.4 — Decorators|||14.4 — Decorator',
      slug: 'typescript-14-4-decorators',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Decorator (@name) bọc/thay đổi một class hay phương thức. Cú pháp stage-3 hiện đại chạy sẵn trong tsc 5; đây là thứ đứng sau NestJS, TypeORM, Angular.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>Decorators</h2>
<p class="lead">A decorator is a function you attach with <code>@name</code> above a class or its members to observe or replace them. They power the annotation-heavy frameworks — NestJS routes, TypeORM entities, Angular components — and modern TypeScript 5 supports the standardised (stage-3) form with no special flag.</p>

<h3>A method decorator</h3>
<p>A method decorator receives the original method and a <em>context</em> object (its name, kind, etc.), and may return a replacement. This <code>@logged</code> wraps a method to log each call, then delegates to the original:</p>
<pre><code><span class="tok-comment">// decorator.ts  (stage-3 decorators — no experimentalDecorators needed)</span>
<span class="tok-keyword">function</span> <span class="tok-function">logged</span>&lt;T, A <span class="tok-keyword">extends</span> <span class="tok-keyword">any</span>[], R&gt;(
  target: (<span class="tok-keyword">this</span>: T, ...args: A) =&gt; R,
  context: ClassMethodDecoratorContext,
) {
  <span class="tok-keyword">return</span> <span class="tok-keyword">function</span> (<span class="tok-keyword">this</span>: T, ...args: A): R {
    console.<span class="tok-function">log</span>(<span class="tok-string">'calling '</span> + <span class="tok-function">String</span>(context.name));
    <span class="tok-keyword">return</span> target.<span class="tok-function">call</span>(<span class="tok-keyword">this</span>, ...args);
  };
}
<span class="tok-keyword">class</span> Calc {
  @logged
  <span class="tok-function">add</span>(a: <span class="tok-keyword">number</span>, b: <span class="tok-keyword">number</span>): <span class="tok-keyword">number</span> { <span class="tok-keyword">return</span> a + b; }
}
<span class="tok-keyword">const</span> total: <span class="tok-keyword">number</span> = <span class="tok-keyword">new</span> <span class="tok-function">Calc</span>().<span class="tok-function">add</span>(<span class="tok-number">2</span>, <span class="tok-number">3</span>);</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>It type-checks cleanly, and at runtime every call to <code>add</code> logs first. The generics <code>&lt;T, A extends any[], R&gt;</code> keep the wrapper fully typed — it accepts and returns exactly what the original method does, so <code>total</code> is still a <code>number</code>. The <code>context</code> parameter is typed <code>ClassMethodDecoratorContext</code>, one of the built-in decorator context types.</p>

<h3>Two decorator systems — know which you have</h3>
<p>There are <em>two</em> decorator implementations. The modern <strong>stage-3</strong> form above is the TC39 standard, on by default in TypeScript 5 — no config. The older <strong>legacy</strong> form needs <code>"experimentalDecorators": true</code> in tsconfig and has a completely different signature. NestJS, TypeORM and Angular were built on the legacy form, so those projects still set that flag; new code should prefer stage-3. The signatures aren't interchangeable — check which your project uses before writing one.</p>

<div class="callout ok">A decorator (<code>@name</code>) is a function that wraps or replaces a class or member. TypeScript 5 supports the standard stage-3 form with no flag; the legacy form (NestJS/TypeORM/Angular) needs <code>experimentalDecorators: true</code> and a different signature. Identify which system a project uses first.</div>
<div class="note-ct">This backend is plain Express, so it doesn't use class decorators — its routing is functions, not annotated classes. Decorators are worth understanding mainly because the moment you touch NestJS, TypeORM, or Angular, they're everywhere; recognising a legacy vs stage-3 signature saves an afternoon of confusion when a decorator "won't compile".</div>
<h3>Two decorator systems, one syntax</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Legacy (experimental)</span><span class="lz-t">experimentalDecorators: true</span><span class="lz-d">The TS 1.5-era design, still what NestJS and TypeORM use. Different signatures, and it needs <code>emitDecoratorMetadata</code> for DI to work.</span></div>
<div class="lz-node"><span class="lz-k">Standard (TS 5+)</span><span class="lz-t">On by default, no flag</span><span class="lz-d">The TC39 stage-3 design. Decorators receive a context object; the shape of a decorator function is not compatible with the legacy one.</span></div>
<div class="lz-node"><span class="lz-k">They run at definition time</span><span class="lz-t">Once, when the class is evaluated</span><span class="lz-d">Not per call and not per instance. A decorator that logs runs when the module loads, which surprises people expecting per-invocation behaviour.</span></div>
<div class="lz-node"><span class="lz-k">They are real emitted code</span><span class="lz-t">Unlike almost everything else here</span><span class="lz-d">Decorators are one of the few TypeScript-adjacent features that produce runtime behaviour rather than being erased.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — mixing the two decorator systems in one project produces errors that read as nonsense.</strong> Turn on <code>experimentalDecorators</code> for a NestJS dependency and every standard-style decorator in your own code is now compiled under the legacy rules: the error is a signature mismatch ("Unable to resolve signature of method decorator"), pointing at a decorator that was correct the day before someone edited <code>tsconfig.json</code>. The flag is per-project, not per-file, so the two cannot coexist. Decide once, based on what your framework requires, and write it in the config with a comment saying which library forced the choice — otherwise the next person will flip it back.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: decorators on Code Lab</span><span class="lc-sub">Write a stage-3 method decorator that wraps a call.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Decorator</h2>
<p class="lead">Một decorator là một hàm bạn gắn bằng <code>@name</code> phía trên một class hay thành viên của nó để quan sát hoặc thay thế chúng. Chúng đứng sau các framework nặng-chú-thích — route NestJS, entity TypeORM, component Angular — và TypeScript 5 hiện đại hỗ trợ dạng chuẩn hoá (stage-3) không cần cờ đặc biệt.</p>

<h3>Một method decorator</h3>
<p>Một method decorator nhận phương thức gốc và một object <em>context</em> (tên, loại, v.v. của nó), và có thể trả về một bản thay thế. <code>@logged</code> này bọc một phương thức để log mỗi lần gọi, rồi uỷ thác cho bản gốc:</p>
<pre><code><span class="tok-comment">// decorator.ts  (decorator stage-3 — không cần experimentalDecorators)</span>
<span class="tok-keyword">function</span> <span class="tok-function">logged</span>&lt;T, A <span class="tok-keyword">extends</span> <span class="tok-keyword">any</span>[], R&gt;(
  target: (<span class="tok-keyword">this</span>: T, ...args: A) =&gt; R,
  context: ClassMethodDecoratorContext,
) {
  <span class="tok-keyword">return</span> <span class="tok-keyword">function</span> (<span class="tok-keyword">this</span>: T, ...args: A): R {
    console.<span class="tok-function">log</span>(<span class="tok-string">'calling '</span> + <span class="tok-function">String</span>(context.name));
    <span class="tok-keyword">return</span> target.<span class="tok-function">call</span>(<span class="tok-keyword">this</span>, ...args);
  };
}
<span class="tok-keyword">class</span> Calc {
  @logged
  <span class="tok-function">add</span>(a: <span class="tok-keyword">number</span>, b: <span class="tok-keyword">number</span>): <span class="tok-keyword">number</span> { <span class="tok-keyword">return</span> a + b; }
}
<span class="tok-keyword">const</span> total: <span class="tok-keyword">number</span> = <span class="tok-keyword">new</span> <span class="tok-function">Calc</span>().<span class="tok-function">add</span>(<span class="tok-number">2</span>, <span class="tok-number">3</span>);</code></pre>
<div class="out">(no output — exit code 0)</div>
<p>Nó kiểm kiểu sạch, và lúc chạy mỗi lời gọi tới <code>add</code> log trước. Các generic <code>&lt;T, A extends any[], R&gt;</code> giữ bộ bọc có kiểu đầy đủ — nó nhận và trả đúng thứ phương thức gốc làm, nên <code>total</code> vẫn là một <code>number</code>. Tham số <code>context</code> có kiểu <code>ClassMethodDecoratorContext</code>, một trong các kiểu context decorator có sẵn.</p>

<h3>Hai hệ decorator — biết mình đang có cái nào</h3>
<p>Có <em>hai</em> cài đặt decorator. Dạng <strong>stage-3</strong> hiện đại ở trên là chuẩn TC39, bật mặc định trong TypeScript 5 — không cần cấu hình. Dạng <strong>legacy</strong> cũ hơn cần <code>"experimentalDecorators": true</code> trong tsconfig và có một chữ ký hoàn toàn khác. NestJS, TypeORM và Angular được dựng trên dạng legacy, nên các dự án đó vẫn đặt cờ đó; code mới nên ưu tiên stage-3. Các chữ ký không thay thế được nhau — kiểm dự án của bạn dùng cái nào trước khi viết một cái.</p>

<div class="callout ok">Một decorator (<code>@name</code>) là một hàm bọc hoặc thay thế một class hay thành viên. TypeScript 5 hỗ trợ dạng stage-3 chuẩn không cần cờ; dạng legacy (NestJS/TypeORM/Angular) cần <code>experimentalDecorators: true</code> và một chữ ký khác. Xác định dự án dùng hệ nào trước.</div>
<div class="note-ct">Backend này là Express thuần, nên nó không dùng class decorator — routing của nó là hàm, không phải class có chú thích. Decorator đáng hiểu chủ yếu vì khoảnh khắc bạn chạm vào NestJS, TypeORM, hay Angular, chúng ở khắp nơi; nhận ra một chữ ký legacy so với stage-3 tiết kiệm cả buổi chiều bối rối khi một decorator "không chịu biên dịch".</div>
<h3>Hai hệ decorator, một cú pháp</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Bản cũ (thử nghiệm)</span><span class="lz-t">experimentalDecorators: true</span><span class="lz-d">Thiết kế thời TS 1.5, vẫn là thứ NestJS và TypeORM dùng. Chữ ký khác, và nó cần <code>emitDecoratorMetadata</code> thì DI mới chạy.</span></div>
<div class="lz-node"><span class="lz-k">Bản chuẩn (TS 5+)</span><span class="lz-t">Bật sẵn, không cần cờ</span><span class="lz-d">Thiết kế stage-3 của TC39. Decorator nhận một object ngữ cảnh; dáng của một hàm decorator không tương thích với bản cũ.</span></div>
<div class="lz-node"><span class="lz-k">Chúng chạy lúc định nghĩa</span><span class="lz-t">Một lần, khi class được tính</span><span class="lz-d">Không phải mỗi lời gọi, không phải mỗi thực thể. Một decorator ghi log sẽ chạy khi module được nạp, làm ngạc nhiên người mong hành vi theo từng lời gọi.</span></div>
<div class="lz-node"><span class="lz-k">Chúng là mã sinh ra thật</span><span class="lz-t">Khác gần như mọi thứ khác ở đây</span><span class="lz-d">Decorator là một trong số ít tính năng gần-TypeScript sinh ra hành vi lúc chạy chứ không bị xoá.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — trộn hai hệ decorator trong một dự án sinh ra những lỗi đọc lên như vô nghĩa.</strong> Bật <code>experimentalDecorators</code> vì một phụ thuộc NestJS là mọi decorator viết theo lối chuẩn trong mã của bạn giờ được biên dịch dưới luật cũ: lỗi là bất khớp chữ ký ("Unable to resolve signature of method decorator"), chỉ vào một decorator hôm qua còn đúng, trước khi ai đó sửa <code>tsconfig.json</code>. Cờ này áp cho cả dự án chứ không theo từng file, nên hai hệ không sống chung được. Hãy quyết một lần, dựa trên thứ framework của bạn đòi hỏi, và ghi nó vào cấu hình kèm một comment nói thư viện nào ép ra lựa chọn đó — không thì người sau sẽ lật nó lại.</p></div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: decorator trên Code Lab</span><span class="lc-sub">Viết một method decorator stage-3 bọc một lời gọi.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 14.5 quiz ─────────────────────────── */
    {
      title: '14.5 — Chapter 14 quiz|||14.5 — Kiểm tra Chương 14',
      slug: 'typescript-14-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về modifier truy cập, parameter property, abstract & implements, #private so với private, static, và decorator.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on classes and decorators. Most day-to-day TypeScript uses functions, but classes shine for stateful abstractions and are everywhere in framework code. Questions follow lesson order.</p>
<div class="callout ok">Aim for 7/8. The distinction most people miss: <code>private</code> is compile-time only, while <code>#field</code> is real runtime privacy (14.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về class và decorator. Đa số TypeScript hằng ngày dùng hàm, nhưng class toả sáng cho các trừu tượng có trạng thái và ở khắp code framework. Các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Phân biệt nhiều người bỏ lỡ: <code>private</code> chỉ lúc-biên-dịch, còn <code>#field</code> là riêng tư thật lúc chạy (14.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does constructor(public readonly owner: string) {} do?|||constructor(public readonly owner: string) {} làm gì?',
            options: [
              'Nothing special|||Không gì đặc biệt',
              'A parameter property: declares and assigns a readonly field owner in one line|||Một parameter property: khai và gán một field readonly owner trong một dòng',
              'Only validates the argument|||Chỉ validate đối số',
              'Makes owner private|||Làm owner private',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Accessing acc.balance from outside, where balance is private, gives?|||Truy cập acc.balance từ ngoài, với balance là private, cho ra?',
            options: [
              'undefined',
              "TS2341: Property 'balance' is private and only accessible within the class|||TS2341: Property 'balance' is private and only accessible within the class",
              'No error|||Không lỗi',
              'A runtime error only|||Chỉ lỗi lúc chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What happens with new Base() when Base is an abstract class?|||Điều gì xảy ra với new Base() khi Base là một class abstract?',
            options: [
              'It works|||Chạy được',
              'TS2511: Cannot create an instance of an abstract class|||TS2511: Cannot create an instance of an abstract class',
              'It returns null|||Nó trả null',
              'It calls the subclass|||Nó gọi lớp con',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A class says implements Shape but has no area() method (Shape requires it). Result?|||Một class nói implements Shape nhưng không có phương thức area() (Shape đòi nó). Kết quả?',
            options: [
              'No error until runtime|||Không lỗi tới lúc chạy',
              'TS2420: Class incorrectly implements interface — area is missing|||TS2420: Class incorrectly implements interface — thiếu area',
              'area is auto-generated|||area được tự sinh',
              'Shape is ignored|||Shape bị bỏ qua',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the key difference between private and #field?|||Khác biệt then chốt giữa private và #field là gì?',
            options: [
              'None|||Không có',
              'private is compile-time only (erased); #field is real runtime privacy the JS engine enforces|||private chỉ lúc-biên-dịch (bị xoá); #field là riêng tư thật lúc chạy do engine JS ép',
              '#field is slower|||#field chậm hơn',
              'private works at runtime, #field does not|||private hoạt động lúc chạy, #field thì không',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does a static method belong to?|||Một phương thức static thuộc về cái gì?',
            options: [
              'Each instance|||Mỗi thực thể',
              'The class itself — called as ClassName.method(), not on an instance|||Chính class — gọi là ClassName.method(), không trên một thực thể',
              'The parent class only|||Chỉ lớp cha',
              'The global scope|||Phạm vi toàn cục',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Do stage-3 decorators require experimentalDecorators in TypeScript 5?|||Decorator stage-3 có cần experimentalDecorators trong TypeScript 5 không?',
            options: [
              'Yes, always|||Có, luôn luôn',
              'No — stage-3 decorators work by default; only the legacy form needs that flag|||Không — decorator stage-3 chạy mặc định; chỉ dạng legacy cần cờ đó',
              'They never work|||Chúng không bao giờ chạy',
              'Only with strict mode|||Chỉ với chế độ strict',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'NestJS, TypeORM and Angular decorators use which system?|||Decorator của NestJS, TypeORM và Angular dùng hệ nào?',
            options: [
              'stage-3 (standard)|||stage-3 (chuẩn)',
              'the legacy form (experimentalDecorators: true), with a different signature|||dạng legacy (experimentalDecorators: true), với chữ ký khác',
              'No decorators|||Không decorator',
              'Both are identical|||Cả hai giống hệt',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
