/**
 * Web Foundations — Chương 9: TypeScript cơ bản (types, interface, function/generic,
 * tsconfig/tsc, TS trong Node.js/Next.js). Dựa trên JavaScript của CHƯƠNG 4/5.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

export default {
  title: 'Chapter 9 — TypeScript basics|||Chương 9 — TypeScript cơ bản',
  description: 'JavaScript chạy được, nhưng không nói cho bạn biết một hàm mong đợi gì cho tới khi nó nổ lúc chạy. TypeScript thêm một lớp "types" lên trên JavaScript bạn đã học ở Chương 4-5 — cùng cú pháp, cùng cách suy nghĩ, chỉ thêm annotation để trình biên dịch bắt lỗi TRƯỚC khi bạn bấm chạy. Học interface, function/generic cơ bản, và cách dự án api-backend này (và Node.js/Next.js nói chung) dùng TypeScript thật.',
  lessons: [
    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — Why TypeScript|||9.1 — Vì sao dùng TypeScript',
      slug: 'wf-9-1-why-typescript',
      type: 'VIDEO',
      isFreePreview: true,
      video: { url: 'https://youtu.be/zQnBQ4tB3ZA', durationSeconds: 0 },
      description: 'TypeScript là JavaScript cộng thêm types: bắt lỗi trước khi chạy, biên dịch ra JS, gợi ý tự động trong editor. So sánh cùng một hàm có và không có types.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>TypeScript is JavaScript, plus types that catch mistakes before you run anything</h2>
<p class="lead">Everything you learned about JavaScript in Chapters 4 and 5 — variables, functions, arrays, objects, <code>fetch</code> — still applies exactly as-is. <strong>TypeScript</strong> adds optional <strong>type annotations</strong> on top: labels that say "this is a string," "this function returns a number." A separate step called <strong>compiling</strong> checks those labels and then strips them away, leaving plain JavaScript for the browser or Node.js to run.</p>

<h3>The same function, two ways</h3>
<pre><code>// JavaScript — no types, runs "however"
function add(a, b) {
  return a + b;
}

add(2, 3);      // 5 — fine
add("2", 3);    // "23" — silently wrong, nobody warns you</code></pre>
<pre><code>// TypeScript — the same function, annotated
function add(a: number, b: number): number {
  return a + b;
}

add(2, 3);      // 5 — fine
add("2", 3);    // ❌ compiler error, BEFORE the code ever runs:
                // Argument of type 'string' is not assignable to parameter of type 'number'.</code></pre>
<p>Same logic, same runtime behaviour when it works — but the typed version tells you about the mistake while you are still writing the code, not after a user hits it in production.</p>

<h3>What TypeScript actually gives you</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Catches bugs early</span><span class="v">Type mismatches are flagged as you type, not discovered later when a value turns out to be the wrong shape.</span></div>
  <div class="kv"><span class="k">Compiles to plain JS</span><span class="v">Browsers and Node.js cannot run .ts files directly. A compiler (tsc, Lesson 9.5) strips the types and outputs ordinary JavaScript.</span></div>
  <div class="kv"><span class="k">Editor autocomplete</span><span class="v">Because your editor knows the exact shape of a value, it suggests the right property names as you type — no more guessing what an API response looks like.</span></div>
  <div class="kv"><span class="k">Self-documenting code</span><span class="v">A typed function signature tells the next reader exactly what it expects and returns, without reading the implementation.</span></div>
</div>

<h3>Types disappear at runtime</h3>
<p>Keep one mental model in mind for this whole chapter: types exist only while you write and compile code. Once compiled, every annotation is erased — the program that actually runs is plain JavaScript, identical to what you would type by hand.</p>
<p class="pitfall"><strong>TypeScript does not make your code faster, and it adds no runtime checks.</strong> It is a tool that runs before your code, not while it runs. If bad data sneaks in from outside your program (a malformed API response, for instance), TypeScript's compile-time promise does not protect you at runtime — you still validate untrusted data the same way you always would.</p>
<p class="note-ct"><strong>Nothing here is new syntax to fear.</strong> Every concept from Chapters 4-5 — variables, functions, arrays, objects, <code>fetch</code> — works completely unchanged in TypeScript. This chapter only adds a thin layer of annotations on top of what you already know.</p>
<h3>Where TypeScript sits in your workflow</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">You write .ts</span><span class="lz-d">Every valid JavaScript file is already valid TypeScript. Renaming <code>.js</code> to <code>.ts</code> is a legitimate first step.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The compiler checks it</span><span class="lz-d">This is the entire value: mistakes are reported before the program runs, in the editor, as you type them.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The types are erased</span><span class="lz-d">The emitted JavaScript has no annotations, no interfaces, nothing. There is no runtime cost and no runtime protection.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Node or the browser runs the JavaScript</span><span class="lz-d">Which is why a wrong type at the boundary — JSON from an API, a form field — is still a runtime bug. The compiler never saw that data.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — believing a type annotation checks data that came from outside.</strong> <code>const user = await res.json() as User</code> compiles perfectly and checks nothing: <code>res.json()</code> returns whatever the server sent, and <code>as</code> simply tells the compiler to stop asking. The server renames a field, the type still says <code>User</code>, and you get <code>undefined</code> at a property TypeScript swore was there. Types describe what your code <em>expects</em>; only a runtime check can confirm what actually arrived. Validate at the boundary — a few <code>if</code>s at first, a schema library when the app grows — and let everything inside be typed because something verified it.</p></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html" target="_blank" rel="noopener">TypeScript in 5 minutes — the official starting point</a></div>
<div class="link-card"><a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TypeScript Playground — see the JavaScript your types compile to</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>TypeScript là JavaScript, cộng thêm types bắt lỗi trước khi bạn chạy bất cứ gì</h2>
<p class="lead">Mọi thứ bạn học về JavaScript ở Chương 4 và 5 — biến, hàm, mảng, đối tượng, <code>fetch</code> — vẫn áp dụng y hệt. <strong>TypeScript</strong> thêm <strong>type annotation</strong> (chú thích kiểu) tuỳ chọn lên trên: nhãn nói "cái này là string," "hàm này trả về number." Một bước riêng gọi là <strong>biên dịch (compile)</strong> kiểm các nhãn đó rồi bóc chúng đi, để lại JavaScript thuần cho trình duyệt hay Node.js chạy.</p>

<h3>Cùng một hàm, hai cách</h3>
<pre><code>// JavaScript — không có type, chạy "sao cũng được"
function add(a, b) {
  return a + b;
}

add(2, 3);      // 5 — ổn
add("2", 3);    // "23" — sai âm thầm, không ai cảnh báo</code></pre>
<pre><code>// TypeScript — cùng hàm đó, có annotation
function add(a: number, b: number): number {
  return a + b;
}

add(2, 3);      // 5 — ổn
add("2", 3);    // ❌ lỗi biên dịch, TRƯỚC KHI code chạy:
                // Argument of type 'string' is not assignable to parameter of type 'number'.</code></pre>
<p>Cùng logic, cùng hành vi lúc chạy khi nó đúng — nhưng bản có type báo bạn về lỗi ngay khi bạn còn đang viết code, không phải sau khi một người dùng dính lỗi trên production.</p>

<h3>TypeScript thật ra cho bạn gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bắt lỗi sớm</span><span class="v">Sai kiểu bị gắn cờ ngay lúc bạn gõ, không phải phát hiện sau khi một giá trị hoá ra sai hình dạng.</span></div>
  <div class="kv"><span class="k">Biên dịch ra JS thuần</span><span class="v">Trình duyệt và Node.js không chạy trực tiếp file .ts. Một trình biên dịch (tsc, Bài 9.5) bóc type đi và xuất JavaScript thường.</span></div>
  <div class="kv"><span class="k">Gợi ý tự động trong editor</span><span class="v">Vì editor biết chính xác hình dạng một giá trị, nó gợi ý đúng tên thuộc tính khi bạn gõ — không còn đoán mò một phản hồi API trông ra sao.</span></div>
  <div class="kv"><span class="k">Code tự giải thích</span><span class="v">Một chữ ký hàm có type nói cho người đọc kế tiếp chính xác nó cần gì và trả về gì, không cần đọc phần thân.</span></div>
</div>

<h3>Type biến mất lúc chạy</h3>
<p>Giữ một mô hình tư duy cho cả chương này: type chỉ tồn tại khi bạn viết và biên dịch code. Sau khi biên dịch, mọi annotation bị xoá — chương trình thật sự chạy là JavaScript thuần, giống hệt bạn tự gõ tay.</p>
<p class="pitfall"><strong>TypeScript không làm code chạy nhanh hơn, và không thêm kiểm tra lúc chạy.</strong> Nó là công cụ chạy TRƯỚC code của bạn, không phải trong lúc code chạy. Nếu dữ liệu xấu lẻn vào từ bên ngoài chương trình (vd một phản hồi API sai định dạng), lời hứa lúc-biên-dịch của TypeScript không bảo vệ bạn lúc chạy — bạn vẫn phải validate dữ liệu không tin cậy như mọi khi.</p>
<p class="note-ct"><strong>Không có cú pháp mới nào đáng sợ ở đây.</strong> Mọi khái niệm từ Chương 4-5 — biến, hàm, mảng, đối tượng, <code>fetch</code> — hoạt động y hệt trong TypeScript. Chương này chỉ thêm một lớp annotation mỏng lên trên những gì bạn đã biết.</p>
<h3>TypeScript nằm ở đâu trong quy trình của bạn</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bạn viết file .ts</span><span class="lz-d">Mọi file JavaScript hợp lệ đều đã là TypeScript hợp lệ. Đổi tên <code>.js</code> thành <code>.ts</code> là một bước đầu chính đáng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Trình biên dịch kiểm nó</span><span class="lz-d">Đây là toàn bộ giá trị: sai sót được báo trước khi chương trình chạy, ngay trong trình soạn thảo, ngay lúc bạn gõ ra chúng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kiểu bị xoá đi</span><span class="lz-d">JavaScript sinh ra không còn chú thích, không interface, không gì cả. Không tốn gì lúc chạy và cũng không bảo vệ gì lúc chạy.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Node hoặc trình duyệt chạy JavaScript đó</span><span class="lz-d">Đó là lý do một kiểu sai ở biên — JSON từ một API, một ô nhập của form — vẫn là lỗi lúc chạy. Trình biên dịch chưa hề nhìn thấy dữ liệu ấy.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tin rằng một dòng chú thích kiểu có kiểm dữ liệu đến từ bên ngoài.</strong> <code>const user = await res.json() as User</code> biên dịch hoàn hảo và chẳng kiểm gì: <code>res.json()</code> trả về đúng thứ máy chủ gửi, còn <code>as</code> chỉ đơn giản bảo trình biên dịch thôi hỏi. Máy chủ đổi tên một field, kiểu vẫn nói <code>User</code>, và bạn nhận <code>undefined</code> ở một thuộc tính mà TypeScript đã thề là có. Kiểu mô tả thứ mã của bạn <em>mong đợi</em>; chỉ một phép kiểm lúc chạy mới xác nhận được thứ thật sự đã tới. Hãy kiểm ở biên — vài câu <code>if</code> lúc đầu, một thư viện schema khi ứng dụng lớn lên — rồi để mọi thứ bên trong được gán kiểu VÌ đã có thứ xác minh nó.</p></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html" target="_blank" rel="noopener">TypeScript trong 5 phút — điểm khởi đầu chính thức</a></div>
<div class="link-card"><a href="https://www.typescriptlang.org/play" target="_blank" rel="noopener">TypeScript Playground — xem đoạn JavaScript mà kiểu của bạn biên dịch ra</a></div>
</div>
`,
    },

    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — Basic types & annotations|||9.2 — Kiểu cơ bản & annotation',
      slug: 'wf-9-2-basic-types',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/d56mG7DezGs', durationSeconds: 0 },
      description: 'string, number, boolean, mảng (number[]), union (string | number), any (và vì sao nên tránh), và type inference.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Annotating variables: string, number, boolean, arrays and unions</h2>
<p class="lead">A type annotation is a colon followed by a type name, written right after a variable or parameter. It tells TypeScript (and every reader) exactly what kind of value belongs there.</p>

<h3>The basic types</h3>
<pre><code>let name: string = "Lan";
let age: number = 25;
let isAdmin: boolean = false;
let tags: string[] = ["editor", "author"];
let scores: number[] = [95, 88, 76];</code></pre>
<p>The <code>[]</code> after a type means "an array of that type." <code>string[]</code> is an array of strings; <code>number[]</code> is an array of numbers.</p>

<h3>Type inference — you often don't need to write the type</h3>
<p>When a variable is declared with an initial value, TypeScript infers (guesses) its type from that value — no annotation required.</p>
<pre><code>let city = "Hanoi";       // inferred as string, no annotation written
city = "Da Nang";         // ok — still a string
city = 42;                 // ❌ error: Type 'number' is not assignable to type 'string'</code></pre>
<p class="note-ct"><strong>Rule of thumb:</strong> write the annotation when TypeScript cannot guess on its own — function parameters (Lesson 9.4), an empty array, a value that starts as <code>null</code>. Let inference handle the rest; typing every single variable by hand is noisy and rarely helps.</p>

<h3>Union types — a value can be one of several types</h3>
<pre><code>let id: string | number;
id = 42;          // ok — it is a number
id = "abc-123";    // ok — it is a string
id = true;          // ❌ error: Type 'boolean' is not assignable to type 'string | number'</code></pre>
<p>The <code>|</code> (pipe) reads as "or." This matches real-world data: a database ID might come back as a number from one endpoint and a string from another, and a union type says so honestly instead of pretending it is always one or the other.</p>

<h3>any — the type that turns TypeScript off</h3>
<pre><code>let data: any = fetchSomething();
data.whatever.you.want();  // no error, ever — TypeScript stops checking this value entirely</code></pre>
<p class="pitfall"><strong>Avoid <code>any</code>.</strong> It is an escape hatch that disables type checking for that value and everything derived from it — you lose autocomplete, you lose the "catch bugs early" benefit from Lesson 9.1, and the compiler will not warn you about anything involving it. It exists for genuinely untyped edge cases (rare), not as a shortcut to silence an error you do not understand yet.</p>
<h3>Let inference do the work</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">const n = 3</span><span class="lz-t">Already typed</span><span class="lz-d">TypeScript infers <code>3</code>. Writing <code>const n: number = 3</code> adds nothing and makes the code noisier.</span></div>
<div class="lz-node"><span class="lz-k">Function parameters</span><span class="lz-t">Always annotate</span><span class="lz-d">There is nothing to infer from — a parameter's type is a decision only you can make. This is where annotations earn their keep.</span></div>
<div class="lz-node"><span class="lz-k">Return types</span><span class="lz-t">Usually inferred</span><span class="lz-d">Annotate them on exported functions, where an accidental change to the return shape should be an error at the function, not at its callers.</span></div>
<div class="lz-node"><span class="lz-k">any</span><span class="lz-t">Turns checking off</span><span class="lz-d">And it spreads: everything derived from an <code>any</code> is unchecked too. Use <code>unknown</code> when you genuinely do not know — it forces a check instead of removing one.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — <code>strictNullChecks</code> turned off, so the compiler cannot see a single null.</strong> Without it, <code>null</code> and <code>undefined</code> are assignable to every type, which means <code>user.name.trim()</code> type-checks even when <code>user</code> is <code>null</code> — and the entire class of "cannot read properties of undefined" crashes, the most common runtime error in JavaScript, stays invisible. It is off in old <code>tsconfig.json</code> files and in a lot of tutorials. Turn on <code>"strict": true</code> on day one of a new project: you get a lot of errors, and every one of them is a crash the compiler just found for you.</p></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" target="_blank" rel="noopener">Handbook — everyday types, and where inference is enough</a></div>
<div class="link-card"><a href="https://www.typescriptlang.org/tsconfig#strict" target="_blank" rel="noopener">tsconfig reference — what strict actually turns on</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Gắn annotation cho biến: string, number, boolean, mảng và union</h2>
<p class="lead">Một type annotation là dấu hai chấm theo sau bởi tên kiểu, viết ngay sau một biến hoặc tham số. Nó nói cho TypeScript (và mọi người đọc) chính xác loại giá trị nào thuộc về chỗ đó.</p>

<h3>Các kiểu cơ bản</h3>
<pre><code>let name: string = "Lan";
let age: number = 25;
let isAdmin: boolean = false;
let tags: string[] = ["editor", "author"];
let scores: number[] = [95, 88, 76];</code></pre>
<p><code>[]</code> sau một kiểu nghĩa là "một mảng của kiểu đó." <code>string[]</code> là mảng string; <code>number[]</code> là mảng number.</p>

<h3>Type inference — thường bạn không cần viết kiểu</h3>
<p>Khi một biến được khai báo với giá trị khởi tạo, TypeScript suy luận (đoán) kiểu của nó từ giá trị đó — không cần annotation.</p>
<pre><code>let city = "Hanoi";       // suy luận là string, không viết annotation
city = "Da Nang";         // ổn — vẫn là string
city = 42;                 // ❌ lỗi: Type 'number' is not assignable to type 'string'</code></pre>
<p class="note-ct"><strong>Quy tắc bỏ túi:</strong> viết annotation khi TypeScript không tự đoán được — tham số hàm (Bài 9.4), một mảng rỗng, một giá trị bắt đầu là <code>null</code>. Để suy luận lo phần còn lại; gõ kiểu cho từng biến một là ồn ào và hiếm khi giúp ích.</p>

<h3>Union type — một giá trị có thể là một trong nhiều kiểu</h3>
<pre><code>let id: string | number;
id = 42;          // ổn — nó là number
id = "abc-123";    // ổn — nó là string
id = true;          // ❌ lỗi: Type 'boolean' is not assignable to type 'string | number'</code></pre>
<p>Dấu <code>|</code> (pipe) đọc là "hoặc." Điều này khớp dữ liệu thực tế: một ID cơ sở dữ liệu có thể trả về là number từ endpoint này và string từ endpoint khác, và union type nói thật điều đó thay vì giả vờ nó luôn là một kiểu duy nhất.</p>

<h3>any — kiểu tắt TypeScript đi</h3>
<pre><code>let data: any = fetchSomething();
data.whatever.you.want();  // không bao giờ lỗi — TypeScript ngừng kiểm giá trị này hoàn toàn</code></pre>
<p class="pitfall"><strong>Tránh <code>any</code>.</strong> Nó là lối thoát tắt hết kiểm kiểu cho giá trị đó và mọi thứ suy ra từ nó — bạn mất autocomplete, mất lợi ích "bắt lỗi sớm" ở Bài 9.1, và trình biên dịch sẽ không cảnh báo gì liên quan tới nó nữa. Nó tồn tại cho những ca thật sự không có kiểu (hiếm), không phải để tắt tiếng một lỗi bạn chưa hiểu.</p>
<h3>Hãy để phép suy kiểu làm việc</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">const n = 3</span><span class="lz-t">Đã có kiểu rồi</span><span class="lz-d">TypeScript suy ra <code>3</code>. Viết <code>const n: number = 3</code> chẳng thêm được gì mà chỉ làm mã ồn hơn.</span></div>
<div class="lz-node"><span class="lz-k">Tham số hàm</span><span class="lz-t">Luôn luôn chú thích</span><span class="lz-d">Chẳng có gì để suy ra cả — kiểu của một tham số là quyết định chỉ bạn mới đưa ra được. Đây là chỗ chú thích kiểu xứng đáng với công sức.</span></div>
<div class="lz-node"><span class="lz-k">Kiểu trả về</span><span class="lz-t">Thường được suy ra</span><span class="lz-d">Hãy chú thích cho các hàm xuất ra ngoài, nơi một thay đổi vô ý ở dáng trả về nên là lỗi tại chính hàm đó, chứ không phải tại các chỗ gọi nó.</span></div>
<div class="lz-node"><span class="lz-k">any</span><span class="lz-t">Tắt việc kiểm</span><span class="lz-d">Và nó lan: mọi thứ dẫn xuất từ một <code>any</code> cũng không được kiểm. Hãy dùng <code>unknown</code> khi bạn thật sự không biết — nó ép phải kiểm thay vì gỡ bỏ phép kiểm.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — <code>strictNullChecks</code> bị tắt, nên trình biên dịch chẳng thấy nổi một cái null nào.</strong> Không có nó, <code>null</code> và <code>undefined</code> gán được vào mọi kiểu, tức là <code>user.name.trim()</code> qua kiểm kiểu ngay cả khi <code>user</code> là <code>null</code> — và cả một họ lỗi "cannot read properties of undefined", lỗi lúc chạy phổ biến nhất trong JavaScript, ở lại vô hình. Nó bị tắt trong các file <code>tsconfig.json</code> cũ và trong khối bài hướng dẫn. Hãy bật <code>"strict": true</code> ngay ngày đầu của một dự án mới: bạn nhận về cả đống lỗi, và mỗi cái trong số đó là một cú sập mà trình biên dịch vừa tìm giùm bạn.</p></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" target="_blank" rel="noopener">Handbook — các kiểu hằng ngày, và chỗ nào suy kiểu là đủ</a></div>
<div class="link-card"><a href="https://www.typescriptlang.org/tsconfig#strict" target="_blank" rel="noopener">Tra cứu tsconfig — strict thật ra bật những gì</a></div>
</div>
`,
    },

    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — Object types & interfaces|||9.3 — Kiểu đối tượng & interface',
      slug: 'wf-9-3-interfaces',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/BCg4U1FzODs', durationSeconds: 0 },
      description: 'Mô tả hình dạng một đối tượng bằng interface/type, thuộc tính tuỳ chọn (?), và vì sao điều này khớp với hình dạng JSON của API ở Chương 6.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>interface: describing the shape of an object</h2>
<p class="lead">Chapter 6 showed API responses as JSON: fixed sets of keys with specific value types. An <strong>interface</strong> writes that shape down as a reusable, named type — so every object that claims to be a <code>User</code> is checked against it.</p>

<h3>Defining and using an interface</h3>
<pre><code>interface User {
  id: number;
  name: string;
  isAdmin: boolean;
  email?: string;   // the ? marks this property as OPTIONAL
}

const user: User = {
  id: 42,
  name: "Lan",
  isAdmin: false,
  // email left out entirely — that is fine, it is optional
};

user.naem;   // ❌ error: Property 'naem' does not exist on type 'User'.
             //    (Did you mean 'name'?) — caught before you ever run this.</code></pre>
<p>Without <code>?</code>, a property is required — leaving it out is a compile error. With <code>?</code>, TypeScript allows the property to be missing, and reading it gives you <code>string | undefined</code> rather than a plain <code>string</code>.</p>

<h3>interface vs type — both describe shapes</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">interface</span><span class="v">The conventional choice for object shapes. Can be "reopened" and extended, which libraries rely on.</span></div>
  <div class="kv"><span class="k">type</span><span class="v">More general — can name unions (Lesson 9.2's string | number) too, not just object shapes.</span></div>
</div>
<p>For a beginner: reach for <code>interface</code> when describing an object (a <code>User</code>, a <code>Post</code>), and <code>type</code> when naming a union. Both are checked the same way; the distinction matters more in larger codebases than in this chapter.</p>

<h3>Why this matches Chapter 6's JSON exactly</h3>
<pre><code>// The API response shape from Chapter 6:
// { "id": 42, "name": "Lan", "isAdmin": false }

interface User {
  id: number;
  name: string;
  isAdmin: boolean;
}

async function getUser(id: number): Promise&lt;User&gt; {
  const response = await fetch(&#96;/api/users/\${id}&#96;);
  return response.json();
}</code></pre>
<p class="note-ct"><strong>An interface is a promise about JSON shape, written once and checked everywhere.</strong> Instead of hoping every place that reads <code>user.name</code> spelled it correctly, the interface catches a typo the moment you type it — exactly the discipline your future Express routes and React components will lean on for every request and response body.</p>
<h3>Describing the shape of your data</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">interface User { … }</span><span class="lz-t">A named shape</span><span class="lz-d">Lists the properties and their types. Any object with at least those properties fits — TypeScript matches on structure, not on names.</span></div>
<div class="lz-layer"><span class="lz-k">bio?: string</span><span class="lz-t">Optional</span><span class="lz-d">May be absent. Inside your code it is <code>string | undefined</code>, so the compiler makes you check before using it.</span></div>
<div class="lz-layer"><span class="lz-k">readonly id: string</span><span class="lz-t">Set once</span><span class="lz-d">Assignable at creation, never again. Perfect for identifiers — the compiler catches the accidental reassignment.</span></div>
<div class="lz-layer"><span class="lz-k">Reuse it everywhere</span><span class="lz-t">One definition, many functions</span><span class="lz-d">The point of naming a shape is that adding a field updates every function that handles it — and breaks the ones that need updating.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — an optional property silenced with <code>!</code> instead of a check.</strong> When <code>user.bio</code> is <code>string | undefined</code>, the compiler refuses <code>user.bio.length</code> — and <code>user.bio!.length</code> makes the error disappear without changing anything about the data. The non-null assertion is a promise to the compiler that you cannot back up; on the first user who never filled in a bio, it throws. It is one keystroke and it undoes the whole reason you added the type. Write the check (<code>if (user.bio)</code>) or use optional chaining with a fallback (<code>user.bio?.length ?? 0</code>) — both take a second and both are still true next month.</p></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/handbook/2/objects.html" target="_blank" rel="noopener">Handbook — object types, optional and readonly properties</a></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noopener">Handbook — narrowing: checking instead of asserting</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>interface: mô tả hình dạng một đối tượng</h2>
<p class="lead">Chương 6 cho thấy phản hồi API dưới dạng JSON: tập khoá cố định với kiểu giá trị cụ thể. Một <strong>interface</strong> viết hình dạng đó thành một kiểu có tên, tái dùng được — để mọi đối tượng tự nhận là <code>User</code> đều bị kiểm theo nó.</p>

<h3>Định nghĩa và dùng một interface</h3>
<pre><code>interface User {
  id: number;
  name: string;
  isAdmin: boolean;
  email?: string;   // dấu ? đánh dấu thuộc tính này là TUỲ CHỌN
}

const user: User = {
  id: 42,
  name: "Lan",
  isAdmin: false,
  // email bỏ hẳn ra — ổn thôi, nó tuỳ chọn mà
};

user.naem;   // ❌ lỗi: Property 'naem' does not exist on type 'User'.
             //    (Did you mean 'name'?) — bắt được trước khi bạn chạy code này.</code></pre>
<p>Không có <code>?</code>, một thuộc tính là bắt buộc — bỏ nó ra là lỗi biên dịch. Có <code>?</code>, TypeScript cho phép thuộc tính vắng mặt, và đọc nó cho bạn <code>string | undefined</code> thay vì <code>string</code> thuần.</p>

<h3>interface vs type — cả hai đều mô tả hình dạng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">interface</span><span class="v">Lựa chọn quy ước cho hình dạng đối tượng. Có thể "mở lại" và mở rộng, thứ mà các thư viện dựa vào.</span></div>
  <div class="kv"><span class="k">type</span><span class="v">Tổng quát hơn — có thể đặt tên cho union (string | number ở Bài 9.2) chứ không chỉ hình dạng đối tượng.</span></div>
</div>
<p>Với người mới: dùng <code>interface</code> khi mô tả một đối tượng (một <code>User</code>, một <code>Post</code>), và <code>type</code> khi đặt tên một union. Cả hai được kiểm như nhau; sự khác biệt quan trọng hơn ở codebase lớn hơn là trong chương này.</p>

<h3>Vì sao điều này khớp đúng với JSON ở Chương 6</h3>
<pre><code>// Hình dạng phản hồi API từ Chương 6:
// { "id": 42, "name": "Lan", "isAdmin": false }

interface User {
  id: number;
  name: string;
  isAdmin: boolean;
}

async function getUser(id: number): Promise&lt;User&gt; {
  const response = await fetch(&#96;/api/users/\${id}&#96;);
  return response.json();
}</code></pre>
<p class="note-ct"><strong>Một interface là một lời hứa về hình dạng JSON, viết một lần và kiểm ở khắp nơi.</strong> Thay vì hy vọng mọi chỗ đọc <code>user.name</code> đều gõ đúng, interface bắt một lỗi gõ ngay lúc bạn gõ nó — đúng kỷ luật mà các route Express và component React tương lai của bạn sẽ dựa vào cho mọi body yêu cầu và phản hồi.</p>
<h3>Mô tả dáng của dữ liệu</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">interface User { … }</span><span class="lz-t">Một cái dáng có tên</span><span class="lz-d">Liệt kê các thuộc tính và kiểu của chúng. Mọi object có ít nhất chừng ấy thuộc tính đều vừa — TypeScript khớp theo cấu trúc, không theo tên.</span></div>
<div class="lz-layer"><span class="lz-k">bio?: string</span><span class="lz-t">Tuỳ chọn</span><span class="lz-d">Có thể vắng mặt. Bên trong mã của bạn nó là <code>string | undefined</code>, nên trình biên dịch bắt bạn kiểm trước khi dùng.</span></div>
<div class="lz-layer"><span class="lz-k">readonly id: string</span><span class="lz-t">Đặt một lần</span><span class="lz-d">Gán được lúc tạo, không bao giờ nữa. Hoàn hảo cho các định danh — trình biên dịch bắt được phép gán lại vô ý.</span></div>
<div class="lz-layer"><span class="lz-k">Dùng lại nó ở mọi nơi</span><span class="lz-t">Một định nghĩa, nhiều hàm</span><span class="lz-d">Mục đích của việc đặt tên cho một cái dáng là: thêm một field sẽ cập nhật mọi hàm xử lý nó — và làm hỏng đúng những hàm cần được sửa.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một thuộc tính tuỳ chọn bị dập bằng dấu <code>!</code> thay vì bằng một phép kiểm.</strong> Khi <code>user.bio</code> là <code>string | undefined</code>, trình biên dịch từ chối <code>user.bio.length</code> — và <code>user.bio!.length</code> làm cái lỗi biến mất mà chẳng đổi gì về dữ liệu cả. Phép khẳng định không-null là một lời hứa với trình biên dịch mà bạn không chống lưng nổi; tới người dùng đầu tiên chưa từng điền tiểu sử, nó ném lỗi. Nó chỉ là một cú gõ phím và nó xoá sạch lý do bạn thêm cái kiểu vào. Hãy viết phép kiểm (<code>if (user.bio)</code>) hoặc dùng optional chaining kèm giá trị dự phòng (<code>user.bio?.length ?? 0</code>) — cả hai tốn một giây và cả hai tháng sau vẫn đúng.</p></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/handbook/2/objects.html" target="_blank" rel="noopener">Handbook — kiểu object, thuộc tính optional và readonly</a></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noopener">Handbook — thu hẹp kiểu: kiểm thay vì khẳng định</a></div>
</div>
`,
    },

    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — Typing functions & a gentle intro to generics|||9.4 — Gắn kiểu cho hàm & làm quen nhẹ với generic',
      slug: 'wf-9-4-functions-generics',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/gp5H0Vw39yw', durationSeconds: 0 },
      description: 'Gắn kiểu tham số và giá trị trả về của hàm, và làm quen nhẹ nhàng với generic (Array<T>, ví dụ identity/first<T>).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Typing function parameters and return values</h2>
<p class="lead">A function's type annotations are its contract: what it needs, and what it promises back. Every parameter can be annotated, and so can the return value, right after the closing parenthesis.</p>

<h3>Parameters and return type</h3>
<pre><code>function greet(name: string): string {
  return &#96;Hello, \${name}!&#96;;
}

function logMessage(message: string): void {
  console.log(message);   // void = this function returns nothing
}

greet(42);   // ❌ error: Argument of type 'number' is not assignable to parameter of type 'string'.</code></pre>
<p>TypeScript can usually infer the return type from what you <code>return</code> — writing it explicitly (as above) is mostly for clarity, and becomes genuinely useful once a function has several possible return paths.</p>

<h3>A gentle first look at generics</h3>
<p>You already used one generic without knowing it: <code>Promise&lt;User&gt;</code> in Lesson 9.3 means "a promise that resolves to a <code>User</code>." The <code>&lt;T&gt;</code> is a placeholder for "whatever type this is used with" — a variable, but for types instead of values. Arrays work the same way:</p>
<pre><code>let scores: Array&lt;number&gt; = [95, 88, 76];   // identical meaning to number[]</code></pre>

<h3>Writing your own generic function</h3>
<pre><code>function identity&lt;T&gt;(value: T): T {
  return value;
}

identity&lt;number&gt;(42);      // T becomes number, return type is number
identity&lt;string&gt;("hi");    // T becomes string, return type is string
identity(true);              // TypeScript infers T = boolean — no need to write it</code></pre>
<pre><code>function first&lt;T&gt;(items: T[]): T {
  return items[0];
}

first([1, 2, 3]);           // T = number, returns a number
first(["a", "b", "c"]);     // T = string, returns a string</code></pre>
<p><code>identity</code> and <code>first</code> work for any type, yet TypeScript still checks the result precisely — call <code>first</code> on <code>number[]</code> and you get a <code>number</code> back, not <code>any</code>. That is the whole point of generics: reusable code that does not give up type safety.</p>
<p class="note-ct"><strong><code>T</code> is just a name.</strong> It could be called anything — it is convention, the same way loop counters are often called <code>i</code>. What matters is that the same letter appears in the parameter and the return type, linking them together.</p>
<h3>Typing a function, from the outside in</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Annotate every parameter</span><span class="lz-d">This is the contract. Callers are checked against it, and the body gets real types to work with instead of <code>any</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Give optional parameters a default</span><span class="lz-d"><code>function page(n = 1)</code> types <code>n</code> as <code>number</code> and removes the <code>undefined</code> case from the body entirely.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Let the return type be inferred</span><span class="lz-d">Except on exported functions, where writing it makes an accidental change fail at the function rather than at its callers.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Reach for &lt;T&gt; only to relate two things</span><span class="lz-d"><code>first&lt;T&gt;(a: T[]): T</code> ties the output to the input. If the parameter appears only once, a plain type would have done the same job.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — a generic that is really a cast in disguise.</strong> <code>async function getJson&lt;T&gt;(url: string): Promise&lt;T&gt;</code> is a pattern you will see in every tutorial, and <code>T</code> appears only in the return type — so there is nothing to infer it from, and the caller simply declares the answer. <code>getJson&lt;User&gt;('/api/notes')</code> compiles happily and hands you a note typed as a user. The type parameter did no work; it just moved an unchecked assumption into a nicer syntax. If a type parameter does not appear in a parameter, it is not checking anything — return <code>unknown</code> and make the caller prove what came back.</p></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/handbook/2/functions.html" target="_blank" rel="noopener">Handbook — functions, including when a generic is worth it</a></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/handbook/2/generics.html" target="_blank" rel="noopener">Handbook — generics from the beginning</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Gắn kiểu cho tham số và giá trị trả về của hàm</h2>
<p class="lead">Annotation của một hàm là hợp đồng của nó: nó cần gì, và nó hứa trả lại gì. Mọi tham số có thể được annotate, và giá trị trả về cũng vậy, ngay sau dấu ngoặc đóng.</p>

<h3>Tham số và kiểu trả về</h3>
<pre><code>function greet(name: string): string {
  return &#96;Hello, \${name}!&#96;;
}

function logMessage(message: string): void {
  console.log(message);   // void = hàm này không trả về gì
}

greet(42);   // ❌ lỗi: Argument of type 'number' is not assignable to parameter of type 'string'.</code></pre>
<p>TypeScript thường suy luận được kiểu trả về từ những gì bạn <code>return</code> — viết tường minh (như trên) chủ yếu để rõ ràng, và trở nên thật sự hữu ích khi một hàm có nhiều nhánh trả về khác nhau.</p>

<h3>Làm quen nhẹ nhàng với generic</h3>
<p>Bạn đã dùng một generic mà không biết: <code>Promise&lt;User&gt;</code> ở Bài 9.3 nghĩa là "một promise sẽ resolve ra một <code>User</code>." <code>&lt;T&gt;</code> là chỗ trống cho "bất kể kiểu nào được dùng ở đây" — một biến, nhưng cho kiểu chứ không phải giá trị. Mảng cũng hoạt động y vậy:</p>
<pre><code>let scores: Array&lt;number&gt; = [95, 88, 76];   // ý nghĩa giống hệt number[]</code></pre>

<h3>Tự viết một hàm generic</h3>
<pre><code>function identity&lt;T&gt;(value: T): T {
  return value;
}

identity&lt;number&gt;(42);      // T trở thành number, kiểu trả về là number
identity&lt;string&gt;("hi");    // T trở thành string, kiểu trả về là string
identity(true);              // TypeScript suy luận T = boolean — không cần viết ra</code></pre>
<pre><code>function first&lt;T&gt;(items: T[]): T {
  return items[0];
}

first([1, 2, 3]);           // T = number, trả về number
first(["a", "b", "c"]);     // T = string, trả về string</code></pre>
<p><code>identity</code> và <code>first</code> hoạt động cho mọi kiểu, nhưng TypeScript vẫn kiểm kết quả chính xác — gọi <code>first</code> trên <code>number[]</code> và bạn nhận lại một <code>number</code>, không phải <code>any</code>. Đó chính là mục đích của generic: code tái dùng được mà không đánh mất an toàn kiểu.</p>
<p class="note-ct"><strong><code>T</code> chỉ là một cái tên.</strong> Nó có thể gọi bất cứ gì — đó là quy ước, giống cách bộ đếm vòng lặp thường gọi là <code>i</code>. Điều quan trọng là cùng một chữ cái xuất hiện ở tham số và kiểu trả về, liên kết chúng lại.</p>
<h3>Gán kiểu cho một hàm, từ ngoài vào trong</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chú thích cho mọi tham số</span><span class="lz-d">Đây là bản hợp đồng. Các chỗ gọi được kiểm với nó, và phần thân có kiểu thật để làm việc thay vì <code>any</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cho tham số tuỳ chọn một giá trị mặc định</span><span class="lz-d"><code>function page(n = 1)</code> gán <code>n</code> kiểu <code>number</code> và xoá sạch trường hợp <code>undefined</code> khỏi phần thân.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hãy để kiểu trả về được suy ra</span><span class="lz-d">Trừ với các hàm xuất ra ngoài, nơi viết ra nó làm một thay đổi vô ý hỏng ngay tại hàm chứ không phải tại các chỗ gọi.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chỉ với tay tới &lt;T&gt; để nối hai thứ lại</span><span class="lz-d"><code>first&lt;T&gt;(a: T[]): T</code> buộc đầu ra vào đầu vào. Nếu tham số kiểu chỉ xuất hiện một lần thì một kiểu thường đã làm đúng việc đó.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một generic thật ra là một phép ép kiểu trá hình.</strong> <code>async function getJson&lt;T&gt;(url: string): Promise&lt;T&gt;</code> là mẫu bạn sẽ gặp trong mọi bài hướng dẫn, và <code>T</code> chỉ xuất hiện ở kiểu trả về — nên chẳng có gì để suy ra nó, và chỗ gọi đơn giản là tự khai đáp án. <code>getJson&lt;User&gt;('/api/notes')</code> biên dịch vui vẻ rồi đưa cho bạn một ghi chú mang kiểu người dùng. Tham số kiểu ấy chẳng làm việc gì; nó chỉ dời một giả định không kiểm vào một cú pháp đẹp hơn. Nếu một tham số kiểu không xuất hiện ở tham số hàm thì nó chẳng kiểm gì cả — hãy trả về <code>unknown</code> và bắt chỗ gọi chứng minh thứ vừa nhận về.</p></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/handbook/2/functions.html" target="_blank" rel="noopener">Handbook — hàm, gồm cả khi nào một generic là đáng dùng</a></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/handbook/2/generics.html" target="_blank" rel="noopener">Handbook — generic từ đầu</a></div>
</div>
`,
    },

    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — TypeScript in practice|||9.5 — TypeScript trong thực tế',
      slug: 'wf-9-5-ts-in-practice',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/30LWjhZzg50', durationSeconds: 0 },
      description: 'tsconfig.json, tsc biên dịch ra JS, cách Node.js và React/Next.js dùng TypeScript, và chính dự án api-backend này là TypeScript.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>How TypeScript fits into a real project</h2>
<p class="lead">Everything so far has been the language itself. Here is how it actually runs inside a project: a settings file, a compiler command, and the two places you will meet TypeScript again very soon — Node.js and React/Next.js.</p>

<h3>tsconfig.json — the compiler's settings</h3>
<p>A project's <strong>tsconfig.json</strong> file tells the TypeScript compiler how strict to be, which JavaScript version to target, and which files to include — things like requiring every variable to have a known type ("strict mode"), or which folder the compiled <code>.js</code> output should land in. You will not write one from scratch as a beginner; every starter template (Node.js, React, Next.js) ships with a sensible default, and you mostly just read it to understand a project's rules.</p>

<h3>tsc — the compiler, at the command line</h3>
<pre><code>npx tsc --noEmit    // check types only — reports errors, writes no files
npx tsc              // compile every .ts file to .js, following tsconfig.json</code></pre>
<p><code>--noEmit</code> is what you will run constantly during development: it is purely a type-checker, fast feedback with zero risk of overwriting anything.</p>

<h3>Where you meet TypeScript next</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Node.js / Express</span><span class="v">Backend route handlers, request/response bodies and Prisma database models are all typed — the interfaces from Lesson 9.3 describe exactly this kind of code.</span></div>
  <div class="kv"><span class="k">React / Next.js</span><span class="v">Components live in .tsx files; each component's props are typed with an interface, so passing the wrong prop is a compile error, not a blank screen at runtime.</span></div>
</div>
<p class="note-ct"><strong>This very project is TypeScript.</strong> The <code>api-backend</code> repository these lessons live in is a Node.js + Express + TypeScript backend, with a Next.js + TypeScript frontend — every route, every React component you would open in it is typed exactly the way this chapter described. Running <code>npx tsc --noEmit</code> before shipping a change is a real, everyday habit here, not a classroom exercise.</p>

<h3>Adding TypeScript to a project that exists</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">tsc --init, then turn on strict</span><span class="lz-d">Start strict from the beginning even if you convert slowly. Loosening later is easy; tightening a large codebase is not.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Convert leaf files first</span><span class="lz-d">Utilities that import nothing. Their types then flow outward into everything that uses them, doing half the next file's work for you.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Install @types for your libraries</span><span class="lz-d"><code>@types/node</code>, <code>@types/express</code> if the package does not ship its own. Without them every import is silently <code>any</code>.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Put tsc --noEmit in CI</span><span class="lz-d">A check that only runs in your editor is a check that stops running the day someone is in a hurry.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — assuming a green build means the types were checked.</strong> Modern bundlers (esbuild, swc, Vite) strip types without checking a single one — that is precisely why they are fast. So the dev server keeps serving a build with type errors in it, and a deploy pipeline that only runs the bundler ships them to production, with nothing in the output to say so. The checking is a separate command: <code>tsc --noEmit</code>. Put it in the same npm script as the build (<code>tsc --noEmit &amp;&amp; vite build</code>) so it cannot be skipped by accident, and run it in CI on every push — this repo's own rules require exactly that before a push.</p></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener">TypeScript — official docs</a></div>

<p>Next up is the final chapter: how to think like a developer — reading errors, debugging systematically, and using Git like a pro instead of just typing commands you memorised.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>TypeScript vận hành trong một dự án thật thế nào</h2>
<p class="lead">Mọi thứ tới giờ là bản thân ngôn ngữ. Đây là cách nó thật sự chạy trong một dự án: một file cấu hình, một lệnh biên dịch, và hai nơi bạn sẽ gặp lại TypeScript rất sớm — Node.js và React/Next.js.</p>

<h3>tsconfig.json — cấu hình của trình biên dịch</h3>
<p>File <strong>tsconfig.json</strong> của một dự án nói cho trình biên dịch TypeScript biết nên nghiêm khắc tới đâu, nhắm phiên bản JavaScript nào, và gồm những file nào — những thứ như bắt mọi biến phải có kiểu đã biết ("strict mode"), hay thư mục nào output <code>.js</code> đã biên dịch sẽ nằm vào. Là người mới, bạn sẽ không viết nó từ đầu; mọi template khởi động (Node.js, React, Next.js) đều có sẵn cấu hình mặc định hợp lý, và bạn phần lớn chỉ đọc nó để hiểu luật của một dự án.</p>

<h3>tsc — trình biên dịch, ở dòng lệnh</h3>
<pre><code>npx tsc --noEmit    // chỉ kiểm kiểu — báo lỗi, không ghi file nào
npx tsc              // biên dịch mọi file .ts sang .js, theo tsconfig.json</code></pre>
<p><code>--noEmit</code> là thứ bạn sẽ chạy liên tục trong lúc phát triển: nó thuần là một trình kiểm kiểu, phản hồi nhanh và không rủi ro ghi đè gì cả.</p>

<h3>Bạn gặp lại TypeScript ở đâu tiếp theo</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Node.js / Express</span><span class="v">Các route handler backend, body request/response và model cơ sở dữ liệu Prisma đều có kiểu — interface ở Bài 9.3 mô tả đúng loại code này.</span></div>
  <div class="kv"><span class="k">React / Next.js</span><span class="v">Component sống trong file .tsx; props của mỗi component có kiểu bằng một interface, nên truyền sai prop là lỗi biên dịch, không phải màn hình trắng lúc chạy.</span></div>
</div>
<p class="note-ct"><strong>Chính dự án này là TypeScript.</strong> Kho mã <code>api-backend</code> mà các bài học này nằm trong đó là một backend Node.js + Express + TypeScript, cùng một frontend Next.js + TypeScript — mọi route, mọi component React bạn mở trong đó đều có kiểu đúng như chương này mô tả. Chạy <code>npx tsc --noEmit</code> trước khi đẩy một thay đổi là thói quen hằng ngày thật sự ở đây, không phải bài tập trên lớp.</p>

<h3>Thêm TypeScript vào một dự án đã có sẵn</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">tsc --init, rồi bật strict</span><span class="lz-d">Hãy strict ngay từ đầu kể cả khi bạn chuyển đổi chậm. Nới lỏng về sau thì dễ; siết chặt một kho mã lớn thì không.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chuyển các file lá trước</span><span class="lz-d">Những hàm tiện ích chẳng import gì. Kiểu của chúng khi đó chảy ra ngoài tới mọi thứ dùng chúng, làm sẵn giùm bạn nửa phần việc của file kế tiếp.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cài @types cho các thư viện</span><span class="lz-d"><code>@types/node</code>, <code>@types/express</code> nếu package không tự ship kiểu. Thiếu chúng thì mọi import âm thầm thành <code>any</code>.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đặt tsc --noEmit vào CI</span><span class="lz-d">Một phép kiểm chỉ chạy trong trình soạn thảo của bạn là một phép kiểm sẽ ngừng chạy vào cái ngày có người đang vội.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tưởng một bản build xanh nghĩa là kiểu đã được kiểm.</strong> Các bundler hiện đại (esbuild, swc, Vite) tước kiểu đi mà không kiểm lấy một cái — đó chính xác là lý do chúng nhanh. Nên dev server cứ phục vụ một bản dựng có lỗi kiểu bên trong, và một đường ống deploy chỉ chạy bundler sẽ ship chúng lên production, mà đầu ra chẳng có gì nói cho bạn biết. Việc kiểm là một lệnh riêng: <code>tsc --noEmit</code>. Hãy đặt nó cùng một npm script với lệnh build (<code>tsc --noEmit &amp;&amp; vite build</code>) để không thể lỡ tay bỏ qua, và chạy nó trong CI ở mọi lần push — luật của chính kho này đòi đúng điều đó trước khi push.</p></div>
<div class="link-card"><a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener">TypeScript — tài liệu chính thức</a></div>

<p>Tiếp theo là chương cuối cùng: cách tư duy như một lập trình viên — đọc lỗi, gỡ lỗi có hệ thống, và dùng Git như dân chuyên nghiệp thay vì chỉ gõ những lệnh học thuộc lòng.</p>
</div>
`,
    },

    /* ─────────────────────────── 9.6 quiz ─────────────────────────── */
    {
      title: '9.6 — Chapter 9 quiz|||9.6 — Kiểm tra chương 9',
      slug: 'wf-9-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về vì sao dùng TypeScript, kiểu cơ bản, union/any, interface, gắn kiểu hàm và generic cơ bản, và tsc/tsconfig.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 9: why TypeScript, basic types and annotations, union types and any, interfaces, typing functions, a gentle intro to generics, and how tsc/tsconfig fit into a real project.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> Reading about types only gets you so far. On Code Lab, annotate real variables and functions, define interfaces, and watch the compiler catch mistakes on the TypeScript track.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Checked, then erased</span><span class="lz-t">No runtime protection</span><span class="lz-d">The compiler checks your code against itself. Data from an API or a form was never seen by it — validate at the boundary.</span></div>
<div class="lz-node"><span class="lz-k">Annotate parameters</span><span class="lz-t">Let the rest infer</span><span class="lz-d">A parameter's type is a decision only you can make. <code>const n = 3</code> is already typed; writing <code>: number</code> adds nothing.</span></div>
<div class="lz-node"><span class="lz-k">strict on, day one</span><span class="lz-t">Especially strictNullChecks</span><span class="lz-d">Without it the compiler cannot see a single null dereference — the most common runtime error in JavaScript stays invisible.</span></div>
<div class="lz-node"><span class="lz-k">! and as are promises</span><span class="lz-t">Not checks</span><span class="lz-d">Both silence the compiler without changing the data. If you cannot back the promise up, write the check instead.</span></div>
</div>
<p class="note-ct"><strong>The errors are the product.</strong> When TypeScript refuses something, the useful reflex is "what does it know that I do not?" — not "how do I make this message go away". Nearly every red squiggle you silence with <code>!</code> or <code>any</code> is a crash you have agreed to meet later.</p>
<div class="link-card"><a href="/code-lab/typescript">Practice on Code Lab → TypeScript track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 9: vì sao dùng TypeScript, kiểu cơ bản và annotation, union type và any, interface, gắn kiểu cho hàm, làm quen nhẹ với generic, và tsc/tsconfig vận hành trong một dự án thật thế nào.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Chỉ đọc về type thì không đủ. Trên Code Lab, hãy gắn annotation cho biến và hàm thật, định nghĩa interface, và xem trình biên dịch bắt lỗi ở track TypeScript.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Kiểm rồi xoá</span><span class="lz-t">Không bảo vệ gì lúc chạy</span><span class="lz-d">Trình biên dịch kiểm mã của bạn với chính nó. Dữ liệu từ một API hay một form thì nó chưa từng thấy — hãy kiểm ở biên.</span></div>
<div class="lz-node"><span class="lz-k">Chú thích cho tham số</span><span class="lz-t">Còn lại để nó tự suy</span><span class="lz-d">Kiểu của một tham số là quyết định chỉ bạn mới đưa ra được. <code>const n = 3</code> đã có kiểu rồi; viết thêm <code>: number</code> chẳng thêm được gì.</span></div>
<div class="lz-node"><span class="lz-k">Bật strict ngay ngày đầu</span><span class="lz-t">Nhất là strictNullChecks</span><span class="lz-d">Không có nó, trình biên dịch chẳng thấy nổi một phép tham chiếu null nào — lỗi lúc chạy phổ biến nhất của JavaScript ở lại vô hình.</span></div>
<div class="lz-node"><span class="lz-k">! và as là lời hứa</span><span class="lz-t">Không phải phép kiểm</span><span class="lz-d">Cả hai đều dập trình biên dịch mà chẳng đổi gì về dữ liệu. Nếu bạn không chống lưng nổi lời hứa đó thì hãy viết phép kiểm.</span></div>
</div>
<p class="note-ct"><strong>Chính những cái lỗi mới là sản phẩm.</strong> Khi TypeScript từ chối một thứ, phản xạ hữu ích là "nó biết gì mà mình không biết?" — chứ không phải "làm sao cho cái thông báo này biến mất". Gần như mọi vệt gạch đỏ bạn dập bằng <code>!</code> hay <code>any</code> đều là một cú sập bạn đã đồng ý gặp lại sau này.</p>
<div class="link-card"><a href="/code-lab/typescript">Luyện tập ở Code Lab → track TypeScript</a></div></div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does TypeScript add on top of JavaScript?|||TypeScript thêm gì lên trên JavaScript?',
            options: [
              'Optional type annotations, checked at compile time|||Type annotation tuỳ chọn, được kiểm lúc biên dịch',
              'A completely different runtime, unrelated to JavaScript|||Một runtime hoàn toàn khác, không liên quan JavaScript',
              'Faster execution speed at runtime|||Tốc độ thực thi nhanh hơn lúc chạy',
              'A replacement for HTML and CSS|||Một thứ thay thế HTML và CSS',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What must happen before TypeScript code can run in a browser or Node.js?|||Điều gì phải xảy ra trước khi code TypeScript chạy được trên trình duyệt hay Node.js?',
            options: [
              'It must be compiled to plain JavaScript|||Nó phải được biên dịch thành JavaScript thuần',
              'Nothing — .ts files run directly everywhere|||Không gì cả — file .ts chạy trực tiếp mọi nơi',
              'It must be converted to Python first|||Nó phải được chuyển sang Python trước',
              'The browser installs a TypeScript plugin|||Trình duyệt cài một plugin TypeScript',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which annotation correctly types an array of numbers?|||Annotation nào gắn kiểu đúng cho một mảng số?',
            options: [
              'let scores: number[] = [1, 2, 3];|||let scores: number[] = [1, 2, 3];',
              'let scores: number = [1, 2, 3];|||let scores: number = [1, 2, 3];',
              'let scores: array<number> only;|||let scores: array<number> only;',
              'let scores: []number = [1, 2, 3];|||let scores: []number = [1, 2, 3];',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does the union type string | number mean?|||Union type string | number nghĩa là gì?',
            options: [
              'The value can be either a string or a number|||Giá trị có thể là string hoặc là number',
              'The value must be both a string and a number at once|||Giá trị phải vừa là string vừa là number cùng lúc',
              'It converts numbers to strings automatically|||Nó tự động chuyển number thành string',
              'It is invalid TypeScript syntax|||Đây là cú pháp TypeScript không hợp lệ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why should the any type generally be avoided?|||Vì sao nên tránh dùng kiểu any nói chung?',
            options: [
              'It disables type checking for that value, losing autocomplete and early bug-catching|||Nó tắt kiểm kiểu cho giá trị đó, mất autocomplete và mất khả năng bắt lỗi sớm',
              'It makes the compiler run out of memory|||Nó khiến trình biên dịch hết bộ nhớ',
              'It is not valid TypeScript syntax|||Đây không phải cú pháp TypeScript hợp lệ',
              'It only works with numbers|||Nó chỉ hoạt động với number',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In an interface, what does a question mark after a property name (email?: string) mean?|||Trong một interface, dấu hỏi sau tên thuộc tính (email?: string) nghĩa là gì?',
            options: [
              'The property is optional — it may be missing|||Thuộc tính đó là tuỳ chọn — có thể vắng mặt',
              'The property is required and must never be empty|||Thuộc tính đó bắt buộc và không bao giờ được rỗng',
              'The property is a boolean|||Thuộc tính đó là một boolean',
              'The property must contain a question mark character|||Thuộc tính đó phải chứa ký tự dấu hỏi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is an interface useful for describing API JSON responses (from Chapter 6)?|||Vì sao interface hữu ích để mô tả phản hồi JSON của API (từ Chương 6)?',
            options: [
              'It writes the expected shape once and TypeScript checks every place that uses it, catching typos like user.naem|||Nó viết hình dạng mong đợi một lần và TypeScript kiểm mọi nơi dùng nó, bắt được lỗi gõ như user.naem',
              'It automatically sends the HTTP request for you|||Nó tự động gửi yêu cầu HTTP giúp bạn',
              'It converts JSON into HTML|||Nó chuyển JSON thành HTML',
              'It replaces the need for a database entirely|||Nó thay thế hoàn toàn nhu cầu có cơ sở dữ liệu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In function greet(name: string): string { ... }, what does the second string specify?|||Trong function greet(name: string): string { ... }, string thứ hai chỉ định gì?',
            options: [
              'The return type of the function|||Kiểu trả về của hàm',
              'The type of a second parameter|||Kiểu của một tham số thứ hai',
              'The name of the function|||Tên của hàm',
              'A comment, ignored by the compiler|||Một chú thích, bị trình biên dịch bỏ qua',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In function first<T>(items: T[]): T { return items[0]; }, what is T?|||Trong function first<T>(items: T[]): T { return items[0]; }, T là gì?',
            options: [
              'A generic placeholder for whichever type the function is used with|||Một chỗ trống generic cho bất kể kiểu nào hàm được dùng cùng',
              'A fixed type that always means number|||Một kiểu cố định luôn có nghĩa là number',
              'A built-in TypeScript keyword with no other meaning|||Một từ khoá dựng sẵn của TypeScript không có ý nghĩa khác',
              'A runtime variable that changes while the program runs|||Một biến lúc chạy thay đổi trong khi chương trình chạy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does running npx tsc --noEmit do?|||Chạy npx tsc --noEmit làm gì?',
            options: [
              'Checks types and reports errors, without writing any compiled files|||Kiểm kiểu và báo lỗi, không ghi file biên dịch nào',
              'Deletes all .ts files in the project|||Xoá mọi file .ts trong dự án',
              'Starts the development server|||Khởi động server phát triển',
              'Deploys the project to production|||Deploy dự án lên production',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
