/**
 * TypeScript — Chương 1: Vì sao TypeScript tồn tại.
 * Mọi output tsc trong bài là THẬT (tsc 7.0.2, --strict). Song ngữ .ml-en/.ml-vi.
 * Quy tắc: < > trong code → &lt; &gt;; backtick trần → &#96;; ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Ftypescript%2Flearn&reflabel=TypeScript';

export default {
  title: 'Chapter 1 — Why TypeScript exists|||Chương 1 — Vì sao TypeScript tồn tại',
  description: 'Ba con bug JavaScript âm thầm cho qua, trình kiểm tra kiểu chứng minh được gì (và không được gì), suy luận kiểu, và câu chuyện dùng dần từ JS sang TS.',
  lessons: [
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — Three bugs JavaScript ships to production|||1.1 — Ba con bug JavaScript đẩy thẳng lên production',
      slug: 'typescript-1-1-ba-con-bug',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Gõ sai tên thuộc tính, sai số đối số, sai kiểu — ba lỗi JS chỉ lộ lúc chạy, và đúng thông báo tsc bắt được chúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Three bugs JavaScript ships to production</h2>
<p class="lead">The argument for TypeScript is not abstract. It is three concrete bugs that JavaScript happily runs, that reach real users, and that TypeScript catches while you type. Every error message below is real output from the compiler — file, line, code, reason.</p>

<h3>Bug 1 — the typo</h3>
<p>You meant <code>email</code>, your fingers wrote <code>emial</code>. In JavaScript this is not an error; reading a property that doesn't exist just returns <code>undefined</code>, and your code limps on until something downstream chokes on <code>undefined</code>.</p>
<pre><code><span class="tok-comment">// typo.ts</span>
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">string</span>; email: <span class="tok-keyword">string</span>; }

<span class="tok-keyword">function</span> <span class="tok-function">sendTo</span>(u: User) {
  <span class="tok-keyword">return</span> u.emial;   <span class="tok-comment">// typo</span>
}</code></pre>
<pre><code>npx tsc --noEmit --strict typo.ts</code></pre>
<div class="out">typo.ts(3,12): error TS2551: Property 'emial' does not exist on type 'User'. Did you mean 'email'?</div>
<p>Line, column, error code, and — because TypeScript knows the shape of <code>User</code> — the exact fix: <em>"Did you mean 'email'?"</em>. In plain JavaScript you would find this bug when an email fails to send, in production, with no clue where it started.</p>

<h3>Bug 2 — the missing argument</h3>
<p>A function needs a title <em>and</em> a body; you call it with only a title. JavaScript sets the missing parameter to <code>undefined</code> and runs on.</p>
<pre><code><span class="tok-comment">// args.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">createNote</span>(title: <span class="tok-keyword">string</span>, body: <span class="tok-keyword">string</span>) {
  <span class="tok-keyword">return</span> { title, body };
}
<span class="tok-function">createNote</span>(<span class="tok-string">'Hello'</span>);   <span class="tok-comment">// forgot the body</span></code></pre>
<div class="out">args.ts(4,1): error TS2554: Expected 2 arguments, but got 1.</div>
<p>In JavaScript you'd create a note whose body is silently <code>undefined</code> and only discover it when the note renders blank — maybe days later, maybe after a user complains.</p>

<h3>Bug 3 — the wrong type flowing through</h3>
<p>This is the subtle, expensive one. You sum an array, accidentally concatenate a string, and now a "number" is really a string — three lines away from where the mistake was made.</p>
<pre><code><span class="tok-comment">// undef.ts</span>
<span class="tok-keyword">const</span> prices = [<span class="tok-number">10</span>, <span class="tok-number">20</span>, <span class="tok-number">30</span>];
<span class="tok-keyword">const</span> total = prices.<span class="tok-function">reduce</span>((a, b) => a + b) + <span class="tok-string">'5'</span>;  <span class="tok-comment">// oops: "605"</span>
<span class="tok-keyword">const</span> n: <span class="tok-keyword">number</span> = total;</code></pre>
<div class="out">undef.ts(3,7): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>JavaScript would compute <code>'605'</code> — a string — and pass it happily into anything expecting a number, producing <code>NaN</code> in some calculation far away. TypeScript stops it at the exact line where the string was forced into a number slot.</p>

<h3>The one idea behind all three</h3>
<div class="callout ok"><strong>TypeScript moves errors left</strong> — from runtime (late, in production, in front of users, far from the cause) to compile time (early, in your editor, on the exact line). That's the whole product. Everything else in this course is detail on top of this one move.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">TS2551</span><span class="v">A property that doesn't exist on the type (usually a typo).</span></div>
  <div class="kv"><span class="k">TS2554</span><span class="v">Wrong number of arguments to a function.</span></div>
  <div class="kv"><span class="k">TS2322</span><span class="v">A value of one type assigned where another is required.</span></div>
</div>
<p>You will meet these three codes constantly. Learning to read <code>TSxxxx</code> at a glance — problem on the message line, location on the file line — is a skill this course drills into you by always showing the real output.</p>
<div class="note-ct">On this site, exactly this class of bug is why a <code>tsc --noEmit</code> check is a required gate in CI before every deploy. The code runs through <code>tsx</code> (which doesn't check types), so without that gate, a <code>TS2551</code> typo would sail straight to production — which is precisely how one enum rename broke it. Chapter 9 tells that story in full.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice: TypeScript track on Code Lab</span><span class="lc-sub">Do the first module's exercises after this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Ba con bug JavaScript đẩy thẳng lên production</h2>
<p class="lead">Lý lẽ cho TypeScript không hề trừu tượng. Nó là ba con bug cụ thể mà JavaScript vui vẻ chạy, chúng tới tận tay người dùng thật, và TypeScript bắt được ngay khi bạn đang gõ. Mọi thông báo lỗi bên dưới đều là output thật của trình biên dịch — file, dòng, mã, lý do.</p>

<h3>Bug 1 — gõ sai tên</h3>
<p>Bạn định viết <code>email</code>, ngón tay gõ thành <code>emial</code>. Trong JavaScript đây không phải lỗi; đọc một thuộc tính không tồn tại chỉ trả về <code>undefined</code>, và code của bạn khập khiễng đi tiếp cho tới khi một chỗ nào đó phía dưới nghẹn với <code>undefined</code>.</p>
<pre><code><span class="tok-comment">// typo.ts</span>
<span class="tok-keyword">interface</span> User { id: <span class="tok-keyword">string</span>; email: <span class="tok-keyword">string</span>; }

<span class="tok-keyword">function</span> <span class="tok-function">sendTo</span>(u: User) {
  <span class="tok-keyword">return</span> u.emial;   <span class="tok-comment">// gõ sai</span>
}</code></pre>
<pre><code>npx tsc --noEmit --strict typo.ts</code></pre>
<div class="out">typo.ts(3,12): error TS2551: Property 'emial' does not exist on type 'User'. Did you mean 'email'?</div>
<p>Dòng, cột, mã lỗi, và — vì TypeScript biết dáng của <code>User</code> — đúng cách sửa: <em>"Did you mean 'email'?"</em> (Ý bạn là 'email'?). Trong JavaScript thuần, bạn sẽ tìm ra con bug này khi một email gửi thất bại, trên production, không manh mối nó bắt đầu từ đâu.</p>

<h3>Bug 2 — thiếu đối số</h3>
<p>Một hàm cần tiêu đề <em>và</em> thân bài; bạn gọi nó chỉ với tiêu đề. JavaScript đặt tham số thiếu thành <code>undefined</code> rồi chạy tiếp.</p>
<pre><code><span class="tok-comment">// args.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">createNote</span>(title: <span class="tok-keyword">string</span>, body: <span class="tok-keyword">string</span>) {
  <span class="tok-keyword">return</span> { title, body };
}
<span class="tok-function">createNote</span>(<span class="tok-string">'Hello'</span>);   <span class="tok-comment">// quên thân bài</span></code></pre>
<div class="out">args.ts(4,1): error TS2554: Expected 2 arguments, but got 1.</div>
<p>Trong JavaScript bạn sẽ tạo ra một ghi chú có thân bài âm thầm là <code>undefined</code> và chỉ phát hiện khi ghi chú hiện ra trống trơn — có thể vài ngày sau, có thể sau khi người dùng phàn nàn.</p>

<h3>Bug 3 — sai kiểu trôi xuyên qua</h3>
<p>Đây là con tinh vi và đắt đỏ. Bạn cộng một mảng, lỡ tay nối thêm một chuỗi, và giờ một "số" thực ra là chuỗi — cách chỗ gây lỗi ba dòng.</p>
<pre><code><span class="tok-comment">// undef.ts</span>
<span class="tok-keyword">const</span> prices = [<span class="tok-number">10</span>, <span class="tok-number">20</span>, <span class="tok-number">30</span>];
<span class="tok-keyword">const</span> total = prices.<span class="tok-function">reduce</span>((a, b) => a + b) + <span class="tok-string">'5'</span>;  <span class="tok-comment">// hỏng: "605"</span>
<span class="tok-keyword">const</span> n: <span class="tok-keyword">number</span> = total;</code></pre>
<div class="out">undef.ts(3,7): error TS2322: Type 'string' is not assignable to type 'number'.</div>
<p>JavaScript sẽ tính ra <code>'605'</code> — một chuỗi — và truyền tỉnh bơ vào bất cứ chỗ nào đang chờ một số, đẻ ra <code>NaN</code> ở một phép tính nào đó xa lắc. TypeScript chặn nó ngay đúng dòng mà chuỗi bị nhét vào một ô dành cho số.</p>

<h3>Một ý duy nhất đằng sau cả ba</h3>
<div class="callout ok"><strong>TypeScript dời lỗi sang trái</strong> — từ lúc chạy (muộn, trên production, trước mặt người dùng, xa nguyên nhân) sang lúc biên dịch (sớm, trong editor, đúng dòng). Đó là toàn bộ sản phẩm. Mọi thứ còn lại trong khoá này chỉ là chi tiết đắp lên trên một nước đi đó.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">TS2551</span><span class="v">Một thuộc tính không tồn tại trên kiểu (thường là gõ sai).</span></div>
  <div class="kv"><span class="k">TS2554</span><span class="v">Sai số lượng đối số truyền vào hàm.</span></div>
  <div class="kv"><span class="k">TS2322</span><span class="v">Một giá trị kiểu này bị gán vào chỗ đòi kiểu khác.</span></div>
</div>
<p>Bạn sẽ gặp ba mã này liên tục. Học đọc lướt <code>TSxxxx</code> — vấn đề ở dòng thông báo, vị trí ở dòng file — là kỹ năng khoá này rèn cho bạn bằng cách luôn cho xem output thật.</p>
<div class="note-ct">Trên site này, đúng loại bug đó là lý do có một bước kiểm <code>tsc --noEmit</code> bắt buộc trong CI trước mỗi lần deploy. Code chạy qua <code>tsx</code> (vốn không kiểm kiểu), nên nếu thiếu cửa gác đó, một lỗi gõ sai <code>TS2551</code> sẽ lướt thẳng lên production — chính là cách một lần đổi tên enum làm vỡ nó. Chương 9 kể trọn câu chuyện.</div>
<a class="link-card codelab" href="/code-lab/typescript${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: track TypeScript trên Code Lab</span><span class="lc-sub">Làm bài tập module đầu tiên sau chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — What a type checker proves — and what it cannot|||1.2 — Trình kiểm tra kiểu chứng minh được gì — và không được gì',
      slug: 'typescript-1-2-chung-minh-gi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Kiểu là hợp đồng giữa các file của bạn, không phải bảo vệ chặn dữ liệu ở cửa. Một câu as sai làm tsc tin bạn còn lúc chạy thì sập.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>What a type checker proves — and what it cannot</h2>
<p class="lead">TypeScript is powerful, but it is powerful at a very specific job. Misunderstanding the boundary of that job is the source of most "TypeScript let me down" stories. The boundary is exactly the compile-time / runtime split from lesson 0.4.</p>

<h3>What it proves: consistency between your own code</h3>
<p>The checker reads every file and proves that the pieces <em>fit each other</em>. If <code>createNote</code> declares it needs two strings, every call is checked against that. If <code>User</code> has an <code>email</code>, every access is checked against that. This is a real mathematical guarantee — under strict mode, if it compiles, those specific mistakes are impossible.</p>
<p>Crucially, this guarantee is about the relationships <em>inside</em> your program. It is a contract enforced between your functions, your types and their call sites.</p>

<h3>What it cannot prove: that reality matches your claims</h3>
<p>The moment data enters your program from outside — an HTTP request, a JSON file, a database row, <code>localStorage</code> — TypeScript has no way to check it, because checking happens at compile time and that data doesn't exist yet. You <em>tell</em> TypeScript what shape the data has, and it believes you. If you lie, it cannot know.</p>
<pre><code><span class="tok-comment">// lie.ts</span>
<span class="tok-keyword">interface</span> User { email: <span class="tok-keyword">string</span>; }

<span class="tok-keyword">const</span> raw: <span class="tok-keyword">unknown</span> = <span class="tok-keyword">null</span>;        <span class="tok-comment">// pretend this came from JSON.parse</span>
<span class="tok-keyword">const</span> u = raw <span class="tok-keyword">as</span> User;             <span class="tok-comment">// "trust me, it's a User"</span>
<span class="tok-function">console.log</span>(u.email.<span class="tok-function">toUpperCase</span>());</code></pre>
<pre><code>npx tsc --noEmit --strict lie.ts</code></pre>
<div class="out">(no output — exit code 0, TypeScript is happy)</div>
<p>TypeScript accepts it. The <code>as User</code> is a promise you made, and it trusts promises. Now run the same file:</p>
<pre><code>npx tsx lie.ts</code></pre>
<div class="out">TypeError: Cannot read properties of null (reading 'email')</div>
<p>It crashes at runtime — because at runtime the value really is <code>null</code>, the type was a fiction, and there was no type left to protect anything. The type system was <em>none the wiser</em>.</p>
<div class="pitfall"><code>as</code> is not a conversion and not a check — it is you overriding the compiler and taking responsibility. Every <code>as</code> is a place TypeScript stopped protecting you. Use it rarely, and never on untrusted external data. To actually verify incoming data you need a <em>runtime</em> check written in real JavaScript, or a validation library — that is chapter 13 (Zod).</div>

<h3>The mental model, stated once more</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Types are a contract</span><span class="v">Checked between your files, at compile time. If it compiles, your files agree with each other.</span></div>
  <div class="kv"><span class="k">Types are not a guard</span><span class="v">They do not stand at the door checking real data at runtime. They're gone by then.</span></div>
  <div class="kv"><span class="k">Validation ≠ typing</span><span class="v">"Is this really a User?" at runtime is a different job (Zod, chapter 13) from "do my files agree?" at compile time.</span></div>
</div>
<p>Hold this and you will never be surprised by TypeScript again. When something feels wrong, ask: <em>am I expecting a compile-time tool to do a runtime job?</em> Usually, yes — and that's the bug.</p>
<div class="note-ct">This is not academic. This site's backend validates every incoming request body with a schema at runtime <em>and</em> types it at compile time — two separate layers, because the type alone would let a malformed request through and crash a route three functions deep.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Trình kiểm tra kiểu chứng minh được gì — và không được gì</h2>
<p class="lead">TypeScript mạnh, nhưng mạnh ở đúng một công việc rất cụ thể. Hiểu sai ranh giới của công việc đó là nguồn gốc của hầu hết những câu chuyện "TypeScript làm tôi thất vọng". Ranh giới đó chính là lằn biên-dịch / lúc-chạy ở bài 0.4.</p>

<h3>Nó chứng minh được: sự nhất quán giữa code của chính bạn</h3>
<p>Trình kiểm tra đọc mọi file và chứng minh rằng các mảnh <em>khớp với nhau</em>. Nếu <code>createNote</code> khai báo cần hai chuỗi, mọi lời gọi đều bị đối chiếu với điều đó. Nếu <code>User</code> có <code>email</code>, mọi truy cập đều bị đối chiếu với điều đó. Đây là một bảo đảm toán học thật sự — dưới chế độ strict, nếu nó biên dịch được thì những lỗi cụ thể đó là bất khả.</p>
<p>Điểm mấu chốt: bảo đảm này nói về các quan hệ <em>bên trong</em> chương trình của bạn. Nó là một hợp đồng được thực thi giữa các hàm, các kiểu và các chỗ gọi chúng.</p>

<h3>Nó không chứng minh được: rằng thực tế khớp với lời bạn khai</h3>
<p>Ngay khi dữ liệu đi vào chương trình từ bên ngoài — một request HTTP, một file JSON, một dòng cơ sở dữ liệu, <code>localStorage</code> — TypeScript không có cách nào kiểm tra nó, vì việc kiểm diễn ra lúc biên dịch còn dữ liệu đó thì chưa tồn tại. Bạn <em>bảo</em> TypeScript dữ liệu có dáng gì, và nó tin bạn. Nếu bạn nói dối, nó không thể biết.</p>
<pre><code><span class="tok-comment">// lie.ts</span>
<span class="tok-keyword">interface</span> User { email: <span class="tok-keyword">string</span>; }

<span class="tok-keyword">const</span> raw: <span class="tok-keyword">unknown</span> = <span class="tok-keyword">null</span>;        <span class="tok-comment">// giả bộ nó đến từ JSON.parse</span>
<span class="tok-keyword">const</span> u = raw <span class="tok-keyword">as</span> User;             <span class="tok-comment">// "tin tôi đi, nó là User"</span>
<span class="tok-function">console.log</span>(u.email.<span class="tok-function">toUpperCase</span>());</code></pre>
<pre><code>npx tsc --noEmit --strict lie.ts</code></pre>
<div class="out">(không có output — mã thoát 0, TypeScript hài lòng)</div>
<p>TypeScript chấp nhận. Cái <code>as User</code> là một lời hứa bạn đưa ra, và nó tin lời hứa. Giờ chạy chính file đó:</p>
<pre><code>npx tsx lie.ts</code></pre>
<div class="out">TypeError: Cannot read properties of null (reading 'email')</div>
<p>Nó sập lúc chạy — vì lúc chạy giá trị thật sự là <code>null</code>, cái kiểu chỉ là chuyện bịa, và chẳng còn kiểu nào để bảo vệ gì cả. Hệ thống kiểu <em>hoàn toàn không hay biết</em>.</p>
<div class="pitfall"><code>as</code> không phải phép chuyển đổi và không phải phép kiểm tra — nó là bạn ghi đè trình biên dịch và tự chịu trách nhiệm. Mỗi <code>as</code> là một chỗ TypeScript ngừng bảo vệ bạn. Hãy dùng nó thật hiếm, và tuyệt đối không dùng lên dữ liệu ngoài không đáng tin. Để thật sự kiểm chứng dữ liệu đi vào bạn cần một phép kiểm <em>lúc chạy</em> viết bằng JavaScript thật, hoặc một thư viện validate — đó là chương 13 (Zod).</div>

<h3>Mô hình tư duy, nói lại một lần nữa</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểu là hợp đồng</span><span class="v">Kiểm giữa các file của bạn, lúc biên dịch. Nếu biên dịch được, các file của bạn đồng thuận với nhau.</span></div>
  <div class="kv"><span class="k">Kiểu không phải bảo vệ</span><span class="v">Chúng không đứng ở cửa kiểm dữ liệu thật lúc chạy. Tới lúc đó chúng đã biến mất.</span></div>
  <div class="kv"><span class="k">Validate ≠ gõ kiểu</span><span class="v">"Cái này có thật là User không?" lúc chạy là một việc khác (Zod, chương 13) với "các file của tôi có đồng thuận không?" lúc biên dịch.</span></div>
</div>
<p>Nắm được điều này thì bạn sẽ không bao giờ bị TypeScript làm cho bất ngờ nữa. Khi có gì đó thấy sai sai, hãy hỏi: <em>mình có đang mong một công cụ lúc-biên-dịch làm một việc lúc-chạy không?</em> Thường là có — và đó chính là con bug.</p>
<div class="note-ct">Điều này không hàn lâm chút nào. Backend site này validate mọi thân request đi vào bằng một schema lúc chạy <em>và</em> gõ kiểu cho nó lúc biên dịch — hai tầng tách biệt, vì chỉ mỗi cái kiểu thôi sẽ để một request dị dạng lọt qua và làm sập một route sâu ba hàm.</div>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — Type inference: you write less than you think|||1.3 — Suy luận kiểu: bạn viết ít hơn bạn tưởng',
      slug: 'typescript-1-3-suy-luan-kieu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'TypeScript tự suy ra phần lớn kiểu. const cho kiểu literal, let cho kiểu rộng, và vì sao strict/noImplicitAny quan trọng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Type inference: you write less than you think</h2>
<p class="lead">A common fear before learning TypeScript is "I'll have to annotate everything, it'll be twice the code." You won't. TypeScript <strong>infers</strong> most types from the values you already wrote. Good TypeScript often looks almost like JavaScript, with types appearing only where they add real information.</p>

<h3>The compiler already knows</h3>
<p>You do not write <code>const n: number = 5</code>. You write <code>const n = 5</code> and TypeScript infers <code>number</code>. To <em>see</em> what it inferred, we can ask the compiler to emit a declaration file — a pure listing of the types it worked out:</p>
<pre><code><span class="tok-comment">// infer.ts</span>
<span class="tok-keyword">let</span> a = <span class="tok-string">'CuongThai'</span>;
<span class="tok-keyword">const</span> b = <span class="tok-string">'CuongThai'</span>;
<span class="tok-keyword">const</span> arr = [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>];
<span class="tok-keyword">const</span> mixed = [<span class="tok-number">1</span>, <span class="tok-string">'two'</span>, <span class="tok-keyword">true</span>];</code></pre>
<pre><code>npx tsc --declaration --emitDeclarationOnly infer.ts
cat infer.d.ts</code></pre>
<div class="out">declare let a: string;
declare const b = "CuongThai";
declare const arr: number[];
declare const mixed: (string | number | boolean)[];</div>
<p>Four values, four different inferred types, zero annotations from you. In your editor you get the same information instantly by hovering the variable — that is why lesson 0.2 called hovering "the whole game".</p>

<h3>let vs const: widening</h3>
<p>Look carefully at the first two lines above. Same string, different type:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>let a = 'CuongThai'</code></span><span class="v">Inferred as <code>string</code>. Because <code>let</code> can be reassigned, TypeScript <em>widens</em> to the general type — you might later set <code>a = 'anything'</code>.</span></div>
  <div class="kv"><span class="k"><code>const b = 'CuongThai'</code></span><span class="v">Inferred as the <em>literal</em> type <code>"CuongThai"</code>. A <code>const</code> can never change, so its type is exactly that one string, forever.</span></div>
</div>
<p>This "literal type" idea looks like a curiosity now, but it is the engine behind one of TypeScript's best features — unions of literals like <code>'draft' | 'published'</code> — which you'll meet in chapter 5 and which make whole categories of bug impossible.</p>

<h3>Where inference stops — and strict mode matters</h3>
<p>Inference works from values. A <strong>function parameter has no value yet</strong> at the point it's declared, so TypeScript can't infer it — and under strict mode it refuses to guess:</p>
<pre><code><span class="tok-comment">// implicit.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">greet</span>(name) {   <span class="tok-comment">// no type — from where?</span>
  <span class="tok-keyword">return</span> <span class="tok-string">'Hi '</span> + name;
}</code></pre>
<div class="out">implicit.ts(1,16): error TS7006: Parameter 'name' implicitly has an 'any' type.</div>
<p>This error — <code>TS7006</code>, "implicitly has an 'any' type" — is TypeScript refusing to silently give up. Without strict mode it would quietly type <code>name</code> as <code>any</code> and switch off all checking for it (next lesson shows why that's dangerous). The fix is to say what you mean: <code>function greet(name: string)</code>. So the rule of thumb:</p>
<div class="callout ok"><strong>Annotate function parameters and return types; let inference handle the rest.</strong> Parameters are the boundaries where a value enters — the one place the compiler genuinely can't guess. Local variables, return values you can often leave to inference.</div>
<div class="pitfall">Always turn on <code>strict</code> in <code>tsconfig.json</code> (chapter 9). Without it, TypeScript falls back to <code>any</code> in exactly the situations where you most need it not to — silently, giving you a false sense of safety. Every example in this course runs with <code>--strict</code>. A non-strict TypeScript project is a JavaScript project wearing a costume.</div>
<div class="note-ct">This site runs full strict mode. When you clone it and hover any variable, the editor shows a precise type the author never had to write — inferred from Prisma's generated types all the way out to the route handler. That is inference doing the heavy lifting across 80,000 lines.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Suy luận kiểu: bạn viết ít hơn bạn tưởng</h2>
<p class="lead">Một nỗi sợ thường gặp trước khi học TypeScript là "chắc phải chú thích mọi thứ, code gấp đôi". Không đâu. TypeScript <strong>suy luận</strong> phần lớn kiểu từ chính những giá trị bạn đã viết. TypeScript tốt thường trông gần như JavaScript, kiểu chỉ xuất hiện ở nơi nó thêm được thông tin thật sự.</p>

<h3>Trình biên dịch đã biết sẵn</h3>
<p>Bạn không viết <code>const n: number = 5</code>. Bạn viết <code>const n = 5</code> và TypeScript suy ra <code>number</code>. Để <em>nhìn thấy</em> nó suy ra gì, ta có thể bảo trình biên dịch xuất một file khai báo — một bản liệt kê thuần các kiểu nó tính ra:</p>
<pre><code><span class="tok-comment">// infer.ts</span>
<span class="tok-keyword">let</span> a = <span class="tok-string">'CuongThai'</span>;
<span class="tok-keyword">const</span> b = <span class="tok-string">'CuongThai'</span>;
<span class="tok-keyword">const</span> arr = [<span class="tok-number">1</span>, <span class="tok-number">2</span>, <span class="tok-number">3</span>];
<span class="tok-keyword">const</span> mixed = [<span class="tok-number">1</span>, <span class="tok-string">'two'</span>, <span class="tok-keyword">true</span>];</code></pre>
<pre><code>npx tsc --declaration --emitDeclarationOnly infer.ts
cat infer.d.ts</code></pre>
<div class="out">declare let a: string;
declare const b = "CuongThai";
declare const arr: number[];
declare const mixed: (string | number | boolean)[];</div>
<p>Bốn giá trị, bốn kiểu suy ra khác nhau, không một chú thích nào từ bạn. Trong editor bạn có ngay thông tin đó bằng cách rê chuột lên biến — đó là lý do bài 0.2 gọi việc rê chuột là "toàn bộ trò chơi".</p>

<h3>let vs const: sự nới rộng (widening)</h3>
<p>Nhìn kỹ hai dòng đầu ở trên. Cùng một chuỗi, khác kiểu:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>let a = 'CuongThai'</code></span><span class="v">Suy ra là <code>string</code>. Vì <code>let</code> gán lại được, TypeScript <em>nới rộng</em> ra kiểu chung — sau này bạn có thể đặt <code>a = 'bất kỳ chuỗi nào'</code>.</span></div>
  <div class="kv"><span class="k"><code>const b = 'CuongThai'</code></span><span class="v">Suy ra là kiểu <em>literal</em> <code>"CuongThai"</code>. Một <code>const</code> không bao giờ đổi được, nên kiểu của nó đúng là mỗi chuỗi đó, mãi mãi.</span></div>
</div>
<p>Ý tưởng "kiểu literal" này bây giờ trông như chuyện lạ, nhưng nó là động cơ đằng sau một trong những tính năng hay nhất của TypeScript — union của các literal như <code>'draft' | 'published'</code> — thứ bạn sẽ gặp ở chương 5 và nó làm cả loạt lỗi trở thành bất khả.</p>

<h3>Nơi suy luận dừng lại — và vì sao chế độ strict quan trọng</h3>
<p>Suy luận hoạt động từ giá trị. Một <strong>tham số hàm chưa có giá trị</strong> tại điểm nó được khai báo, nên TypeScript không suy ra được — và dưới chế độ strict nó từ chối đoán mò:</p>
<pre><code><span class="tok-comment">// implicit.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">greet</span>(name) {   <span class="tok-comment">// không có kiểu — lấy từ đâu?</span>
  <span class="tok-keyword">return</span> <span class="tok-string">'Hi '</span> + name;
}</code></pre>
<div class="out">implicit.ts(1,16): error TS7006: Parameter 'name' implicitly has an 'any' type.</div>
<p>Lỗi này — <code>TS7006</code>, "ngầm mang kiểu 'any'" — là TypeScript từ chối âm thầm bỏ cuộc. Không có chế độ strict, nó sẽ lặng lẽ gán <code>name</code> kiểu <code>any</code> và tắt hết kiểm tra cho nó (bài sau cho thấy vì sao thế là nguy hiểm). Cách sửa là nói rõ ý bạn: <code>function greet(name: string)</code>. Vậy quy tắc bỏ túi:</p>
<div class="callout ok"><strong>Chú thích tham số hàm và kiểu trả về; để suy luận lo phần còn lại.</strong> Tham số là những ranh giới nơi một giá trị đi vào — đúng một chỗ mà trình biên dịch thật sự không đoán được. Biến cục bộ, giá trị trả về thì thường có thể để cho suy luận.</div>
<div class="pitfall">Luôn bật <code>strict</code> trong <code>tsconfig.json</code> (chương 9). Không bật, TypeScript quay về <code>any</code> đúng những tình huống mà bạn cần nó đừng làm vậy nhất — một cách âm thầm, cho bạn một cảm giác an toàn giả. Mọi ví dụ trong khoá này chạy với <code>--strict</code>. Một dự án TypeScript không strict là một dự án JavaScript đang mặc đồ hoá trang.</div>
<div class="note-ct">Site này chạy chế độ strict đầy đủ. Khi bạn clone nó về và rê chuột lên bất kỳ biến nào, editor hiện một kiểu chính xác mà tác giả chẳng phải viết ra — suy ra từ các kiểu Prisma sinh ra kéo dài tận tới handler của route. Đó là suy luận gánh phần nặng xuyên suốt 80.000 dòng.</div>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: "1.4 — any, unknown & adopting TypeScript gradually|||1.4 — any, unknown & dùng TypeScript dần dần",
      slug: 'typescript-1-4-any-unknown',
      type: 'LESSON',
      isFreePreview: true,
      description: 'any tắt hết kiểm tra (demo thật), unknown là cánh cửa an toàn, và vì sao mọi file JS đã là file TS hợp lệ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>any, unknown &amp; adopting TypeScript gradually</h2>
<p class="lead">TypeScript was designed to be adopted one file at a time, not in a big rewrite. The two escape hatches that make that possible — <code>any</code> and <code>unknown</code> — look similar and behave like opposites. Confusing them is one of the most consequential mistakes a beginner makes.</p>

<h3>Every JavaScript file is already valid TypeScript</h3>
<p>Because TypeScript is a superset, you can rename <code>server.js</code> to <code>server.ts</code> and it still compiles. You then add types gradually, file by file, function by function. This is exactly how large codebases migrate — no flag day, no full rewrite. The cost of adopting TypeScript is not "rewrite everything"; it's "start typing the next thing you touch".</p>

<h3>any — the off switch</h3>
<p><code>any</code> means "stop checking this value entirely". It is the one type that is assignable to and from everything. Watch what it permits:</p>
<pre><code><span class="tok-comment">// anyoff.ts</span>
<span class="tok-keyword">const</span> x: <span class="tok-keyword">any</span> = <span class="tok-string">'hello'</span>;
x.foo.bar.<span class="tok-function">baz</span>();       <span class="tok-comment">// calling methods that don't exist</span>
<span class="tok-keyword">const</span> n: <span class="tok-keyword">number</span> = x;      <span class="tok-comment">// assigning a string to a number</span></code></pre>
<pre><code>npx tsc --noEmit --strict anyoff.ts</code></pre>
<div class="out">(no output — exit code 0. Every line above is a bug, and TypeScript reported none of them.)</div>
<p>That is the danger. <code>any</code> doesn't just skip one check — it poisons everything downstream. A single <code>any</code> can silently disable type safety across a whole chain of code, and it's invisible: nothing is red, so you feel safe while having no protection at all.</p>
<div class="pitfall">Reaching for <code>any</code> to make an error go away is like disconnecting a smoke alarm because it's beeping. The beep was the point. If you don't know a value's type, that is information — not a reason to blind the compiler.</div>

<h3>unknown — the safe door</h3>
<p><code>unknown</code> also means "I don't know the type yet", but it is the <em>safe</em> version. You can assign anything <em>to</em> it, but you can't <em>do</em> anything with it until you prove what it is:</p>
<pre><code><span class="tok-comment">// unknown.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">handle</span>(input: <span class="tok-keyword">unknown</span>) {
  <span class="tok-comment">// input.toUpperCase()  → error: 'input' is of type 'unknown'</span>
  <span class="tok-keyword">if</span> (<span class="tok-keyword">typeof</span> input === <span class="tok-string">'string'</span>) {
    <span class="tok-keyword">return</span> input.<span class="tok-function">toUpperCase</span>();   <span class="tok-comment">// OK — proven to be a string here</span>
  }
  <span class="tok-keyword">return</span> <span class="tok-string">'not a string'</span>;
}</code></pre>
<p>This is the correct type for anything from the outside world — <code>JSON.parse</code> returns something you should treat as <code>unknown</code>, then <em>narrow</em> (chapter 5) before use. It forces the check that <code>any</code> lets you skip.</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>any</code></span><span class="v">"Trust me, stop checking." Turns off safety. Contagious. Almost never the right answer.</span></div>
  <div class="kv"><span class="k"><code>unknown</code></span><span class="v">"I don't know yet — force me to check." Keeps safety. The right tool for external data.</span></div>
</div>

<h3>Turning JavaScript into TypeScript, in order</h3>
<p>The realistic path — the one this site took — is roughly:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Rename</div><div class="lz-d">.js → .ts. It still compiles.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Fix reds</div><div class="lz-d">Add types where the checker complains.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Type the edges</div><div class="lz-d">Function parameters and return types first.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Strict</div><div class="lz-d">Turn on strict, fix the new reds, never go back.</div></div>
</div>
<div class="note-ct">A live-fire lesson from this site (chapter 9 tells it in full): an enum value was renamed, the whole build passed, and production still broke — because one file, the database seed script, held a <em>hand-written copy</em> of the type instead of importing the real one, so it happily checked itself against its own stale definition. The fix was a second compiler pass over that file. The moral fits here: types only protect you where they connect. A hand-typed duplicate — or an <code>any</code> — is a gap in the net.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>any, unknown &amp; dùng TypeScript dần dần</h2>
<p class="lead">TypeScript được thiết kế để đưa vào từng file một, không phải viết lại một cục lớn. Hai lối thoát hiểm giúp điều đó khả thi — <code>any</code> và <code>unknown</code> — trông giống nhau mà hành xử như hai thái cực. Nhầm chúng là một trong những sai lầm hệ trọng nhất của người mới.</p>

<h3>Mọi file JavaScript vốn đã là TypeScript hợp lệ</h3>
<p>Vì TypeScript là superset, bạn có thể đổi tên <code>server.js</code> thành <code>server.ts</code> và nó vẫn biên dịch được. Rồi bạn thêm kiểu dần dần, từng file, từng hàm. Đây đúng là cách các codebase lớn di cư — không có "ngày cờ", không viết lại toàn bộ. Cái giá để dùng TypeScript không phải "viết lại tất cả"; nó là "bắt đầu gõ kiểu cho thứ tiếp theo bạn đụng tới".</p>

<h3>any — cái công tắc tắt</h3>
<p><code>any</code> nghĩa là "ngừng kiểm tra giá trị này hoàn toàn". Nó là kiểu duy nhất gán được vào và gán ra từ mọi thứ. Xem nó cho phép những gì:</p>
<pre><code><span class="tok-comment">// anyoff.ts</span>
<span class="tok-keyword">const</span> x: <span class="tok-keyword">any</span> = <span class="tok-string">'hello'</span>;
x.foo.bar.<span class="tok-function">baz</span>();       <span class="tok-comment">// gọi method không tồn tại</span>
<span class="tok-keyword">const</span> n: <span class="tok-keyword">number</span> = x;      <span class="tok-comment">// gán một chuỗi cho một số</span></code></pre>
<pre><code>npx tsc --noEmit --strict anyoff.ts</code></pre>
<div class="out">(không có output — mã thoát 0. Mọi dòng ở trên đều là bug, và TypeScript không báo dòng nào.)</div>
<p>Đó là mối nguy. <code>any</code> không chỉ bỏ qua một phép kiểm — nó đầu độc mọi thứ phía dưới. Chỉ một <code>any</code> có thể âm thầm tắt an toàn kiểu suốt cả một chuỗi code, và nó vô hình: không có gì đỏ, nên bạn thấy an toàn trong khi chẳng có bảo vệ nào cả.</p>
<div class="pitfall">Với tay tới <code>any</code> để cho hết lỗi cũng như tháo dây cái báo khói vì nó đang kêu. Tiếng kêu đó mới là điều quan trọng. Nếu bạn không biết kiểu của một giá trị, đó là một thông tin — không phải một cái cớ để bịt mắt trình biên dịch.</div>

<h3>unknown — cánh cửa an toàn</h3>
<p><code>unknown</code> cũng nghĩa là "tôi chưa biết kiểu", nhưng nó là phiên bản <em>an toàn</em>. Bạn gán được bất cứ thứ gì <em>vào</em> nó, nhưng không <em>làm</em> được gì với nó cho tới khi chứng minh nó là gì:</p>
<pre><code><span class="tok-comment">// unknown.ts</span>
<span class="tok-keyword">function</span> <span class="tok-function">handle</span>(input: <span class="tok-keyword">unknown</span>) {
  <span class="tok-comment">// input.toUpperCase()  → lỗi: 'input' có kiểu 'unknown'</span>
  <span class="tok-keyword">if</span> (<span class="tok-keyword">typeof</span> input === <span class="tok-string">'string'</span>) {
    <span class="tok-keyword">return</span> input.<span class="tok-function">toUpperCase</span>();   <span class="tok-comment">// OK — ở đây đã chứng minh là chuỗi</span>
  }
  <span class="tok-keyword">return</span> <span class="tok-string">'không phải chuỗi'</span>;
}</code></pre>
<p>Đây là kiểu đúng cho bất cứ thứ gì từ thế giới bên ngoài — <code>JSON.parse</code> trả về một thứ mà bạn nên coi là <code>unknown</code>, rồi <em>thu hẹp</em> (chương 5) trước khi dùng. Nó ép ra đúng phép kiểm mà <code>any</code> cho bạn bỏ qua.</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>any</code></span><span class="v">"Tin tôi đi, ngừng kiểm." Tắt an toàn. Lây lan. Gần như không bao giờ là đáp án đúng.</span></div>
  <div class="kv"><span class="k"><code>unknown</code></span><span class="v">"Tôi chưa biết — bắt tôi phải kiểm." Giữ an toàn. Công cụ đúng cho dữ liệu ngoài.</span></div>
</div>

<h3>Biến JavaScript thành TypeScript, theo thứ tự</h3>
<p>Con đường thực tế — con đường chính site này đã đi — đại khái là:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Đổi tên</div><div class="lz-d">.js → .ts. Nó vẫn biên dịch.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Sửa chỗ đỏ</div><div class="lz-d">Thêm kiểu ở nơi trình kiểm than phiền.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Gõ kiểu ở rìa</div><div class="lz-d">Tham số hàm và kiểu trả về trước.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Strict</div><div class="lz-d">Bật strict, sửa chỗ đỏ mới, không quay lại.</div></div>
</div>
<div class="note-ct">Một bài học đạn thật từ site này (chương 9 kể trọn): một giá trị enum bị đổi tên, cả bản build qua sạch, mà production vẫn vỡ — vì một file, script seed cơ sở dữ liệu, giữ một <em>bản chép tay</em> của kiểu thay vì import bản thật, nên nó vui vẻ tự kiểm với chính định nghĩa cũ mèm của mình. Cách sửa là một lượt biên dịch thứ hai lên file đó. Bài học khớp ở đây: kiểu chỉ bảo vệ bạn ở nơi chúng nối liền. Một bản sao gõ tay — hoặc một <code>any</code> — là một lỗ thủng trong tấm lưới.</div>
</div>
`,
    },

    /* ─────────────────────────── 1.5 quiz ─────────────────────────── */
    {
      title: '1.5 — Chapter 1 quiz|||1.5 — Kiểm tra Chương 1',
      slug: 'typescript-1-5-quiz',
      type: 'QUIZ',
      description: 'Tám câu về vì sao TypeScript tồn tại, compile-time vs runtime, suy luận kiểu, any vs unknown.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the whole chapter. Answer from memory first — if you have to look something up, that is exactly the lesson worth re-reading. Retake it as often as you like; the score is not stored.</p>
<div class="callout ok">Aim for 7/8. Below 6 means one of the four lessons didn't land — the questions follow lesson order, so a miss points straight at what to revisit.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu cho toàn chương. Hãy trả lời bằng trí nhớ trước — nếu phải mở tra cứu thì đó đúng là bài đáng đọc lại. Làm lại bao nhiêu lần cũng được; điểm không được lưu.</p>
<div class="callout ok">Hãy nhắm 7/8. Dưới 6 nghĩa là một trong bốn bài chưa thấm — các câu xếp theo thứ tự bài, nên câu sai chỉ thẳng vào chỗ cần xem lại.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'In one phrase, what does TypeScript fundamentally do?|||Nói gọn một câu, TypeScript về căn bản làm gì?',
            options: [
              'It makes JavaScript run faster at runtime|||Nó làm JavaScript chạy nhanh hơn lúc chạy',
              'It moves errors from runtime to compile time|||Nó dời lỗi từ lúc chạy sang lúc biên dịch',
              'It replaces JavaScript with a new language|||Nó thay JavaScript bằng một ngôn ngữ mới',
              'It validates data coming from the network|||Nó validate dữ liệu đến từ mạng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You access u.emial instead of u.email. What does tsc report?|||Bạn truy cập u.emial thay vì u.email. tsc báo gì?',
            options: [
              'Nothing — it returns undefined at runtime|||Không gì cả — trả về undefined lúc chạy',
              "TS2551: Property 'emial' does not exist... Did you mean 'email'?|||TS2551: Property 'emial' does not exist... Did you mean 'email'?",
              'TS2554: Expected 2 arguments, but got 1|||TS2554: Expected 2 arguments, but got 1',
              'A runtime TypeError|||Một TypeError lúc chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'After const u = raw as User (where raw is null), what happens?|||Sau const u = raw as User (với raw là null), điều gì xảy ra?',
            options: [
              'tsc errors immediately|||tsc báo lỗi ngay',
              'tsc is happy (exit 0); it crashes later at runtime|||tsc hài lòng (thoát 0); nó sập muộn hơn lúc chạy',
              'as converts null into a valid User|||as chuyển null thành một User hợp lệ',
              'The browser refuses to run the file|||Trình duyệt từ chối chạy file',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why can a type not be checked at runtime (e.g. x instanceof User)?|||Vì sao một kiểu không thể kiểm tra lúc chạy (vd x instanceof User)?',
            options: [
              'Because instanceof is deprecated|||Vì instanceof đã lỗi thời',
              'Because types are erased during compilation and do not exist at runtime|||Vì kiểu bị xoá khi biên dịch và không tồn tại lúc chạy',
              'Because User must be a class|||Vì User phải là một class',
              'Because strict mode forbids it|||Vì chế độ strict cấm điều đó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What type is inferred for const b = "CuongThai"?|||Kiểu nào được suy ra cho const b = "CuongThai"?',
            options: [
              'string',
              'The literal type "CuongThai"|||Kiểu literal "CuongThai"',
              'any',
              'unknown',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Under strict mode, function greet(name) { ... } gives which error?|||Dưới chế độ strict, function greet(name) { ... } báo lỗi nào?',
            options: [
              "TS7006: Parameter 'name' implicitly has an 'any' type|||TS7006: Parameter 'name' implicitly has an 'any' type",
              'TS2322: Type string is not assignable to number|||TS2322: Type string is not assignable to number',
              'No error — name is inferred as string|||Không lỗi — name được suy ra là string',
              'TS2551: Did you mean something else?|||TS2551: Did you mean something else?',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the key difference between any and unknown?|||Khác biệt then chốt giữa any và unknown là gì?',
            options: [
              'They are identical aliases|||Chúng là hai tên gọi giống hệt nhau',
              'any turns off checking; unknown forces you to check before use|||any tắt kiểm tra; unknown ép bạn kiểm trước khi dùng',
              'unknown is faster at runtime|||unknown nhanh hơn lúc chạy',
              'any is only for numbers|||any chỉ dùng cho số',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which is the safest first step to adopt TypeScript in a JavaScript project?|||Bước đầu an toàn nhất để đưa TypeScript vào một dự án JavaScript là gì?',
            options: [
              'Rewrite the whole codebase at once|||Viết lại toàn bộ codebase cùng lúc',
              'Rename a .js file to .ts — it still compiles — then add types gradually|||Đổi tên một file .js thành .ts — nó vẫn biên dịch — rồi thêm kiểu dần dần',
              'Add any to every variable to silence errors|||Thêm any cho mọi biến để dập lỗi',
              'Disable strict mode permanently|||Tắt vĩnh viễn chế độ strict',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
