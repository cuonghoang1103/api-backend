/**
 * TypeScript · Mục 0 · Bắt đầu tại đây (1/2) — typescript-0-8-bat-dau-tai-day (BÀI MỚI 01/11/2026). Output chạy thật (Node 22.23.3, tsc 7.0.2)
 * sinh vào ./_ma-ts-00-8.mjs; mốc lịch sử kiểm nguồn (cuối bài); số đo website = git ls-files trên c572cf189.
 */
import G from '../giang/ts-00-8.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-00-8.mjs';

const NGUON = [
  nguon('📦', 'npm registry — typescript (version history)', 'Publish time of every release (= npm view typescript time). Read 1 Nov 2026.', 'https://registry.npmjs.org/typescript'),
  nguon('📖', 'Wikipedia — TypeScript', '0.8 public in October 2012; Anders Hejlsberg. Read 1 Nov 2026.', 'https://en.wikipedia.org/wiki/TypeScript'),
  nguon('2️⃣', 'TypeScript blog — Announcing TypeScript 2.0 (22 Sep 2016)', 'Introduces strictNullChecks. Read 1 Nov 2026.', 'https://devblogs.microsoft.com/typescript/announcing-typescript-2-0/'),
  nguon('⚡', 'TypeScript blog — A 10x Faster TypeScript (11 Mar 2025)', 'The Go port: VS Code checked in 7.5 s instead of 77.8 s. Read 1 Nov 2026.', 'https://devblogs.microsoft.com/typescript/typescript-native-port/'),
  nguon('7️⃣', 'TypeScript blog — Announcing TypeScript 7.0 (8 Jul 2026)', 'The native compiler; 8–12× faster full builds; strict on by default. Read 1 Nov 2026.', 'https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/'),
  nguon('🟩', 'Node.js v22.18.0 release notes (31 Jul 2025)', '“Type stripping is enabled by default.” Read 1 Nov 2026.', 'https://nodejs.org/en/blog/release/v22.18.0'),
  nguon('📊', 'GitHub Octoverse 2025 (28 Oct 2025)', 'TypeScript #1 on GitHub, August 2025. Read 1 Nov 2026.', 'https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/'),
  nguon('🧾', 'TypeScript Handbook — JS Projects Utilizing TypeScript', 'JSDoc types and // @ts-check in plain .js files. Read 1 Nov 2026.', 'https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html'),
].join('\n');

export default {
  title: 'Start here (1/2) — What TypeScript is, and why it exists|||Bắt đầu tại đây (1/2) — TypeScript là gì, và vì sao nó ra đời',
  slug: 'typescript-0-8-bat-dau-tai-day',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài mở cửa cho người mới: TypeScript là gì bằng hình ảnh đời thường; cùng một hàm LabFlow viết bằng JavaScript (in ra 480120, không báo lỗi) và TypeScript (tsc báo TS2345 trong 0,4 giây); vì sao Node chạy .ts mà không kiểm; những từ hay nhầm (TypeScript, tsc, type stripping, tsx, JSDoc, Flow); lịch sử 2012 → 2026 có mốc kiểm được; vì sao nó ra đời; nó giúp gì cho bạn (Octoverse 2025, đồ án FPT, chính website này) — và lỗi kiểu đầu tiên của bạn trong 10 phút.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>Hello. Before the first type annotation, know what you are learning — and why</h2>
<p class="lead">Welcome. You already write JavaScript — for FER202, for SDN302, maybe for a team project. This lesson shows you, in twenty minutes and with real output, what TypeScript adds to that JavaScript, where it came from, and why almost every Node.js team you will apply to expects it. After it you will be able to say in one sentence what TypeScript is, tell <code>tsc</code> from Node from <code>tsx</code>, and you will have produced and fixed your first real type error.</p>
<p>This lesson and the next are the front door of the course; the next one tells real stories of bugs that types catch and gives you a study plan. Lesson 0.1 then shows the project of the whole course, LabFlow TS.</p>

<h3>What TypeScript is — an everyday picture first</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">📝 The spell-checker</span><span class="v">It underlines a typo <strong>while you type</strong>, long before the teacher reads your essay. TypeScript underlines a wrong value long before a user clicks the button.</span></div>
  <div class="kv"><span class="k">🔌 The shaped plug</span><span class="v">A three-pin plug does not go into a two-pin socket. You find out at the wall, not when the laptop is already burning. A <strong>type</strong> is the shape of a value: “a number”, “a text”, “one of STUDENT, LECTURER, ADMIN”.</span></div>
  <div class="kv"><span class="k">🏷️ The label on a box</span><span class="v">“Fragile — 31 glasses.” Whoever carries the box knows what is inside without opening it. A <strong>type annotation (chú thích kiểu)</strong> is that label, written next to a variable or a parameter.</span></div>
</div>
<p>Now the definition will feel obvious: <strong>TypeScript is JavaScript plus type labels.</strong> A program called <code>tsc</code> — the TypeScript compiler — reads the labels and reports every value that does not fit its label, <strong>without running your program</strong>. After that the labels are removed and plain JavaScript runs, exactly as before. Nothing about how your code executes changes; what changes is <em>when</em> you hear about a mistake.</p>

<h3>What it looks like as code — one LabFlow function, two languages</h3>
<p>LabFlow is the lab-booking app used across the CuongThai backend courses. Times are stored as minutes since midnight: 08:00 is minute 480. Here is a tiny helper in plain JavaScript that computes when a booking ends:</p>
${ma('javascript', CODE.endJs)}
${ra(OUT['1-js'])}
<p>The first call is right: 480 + 120 = 600, that is 10:00. The second call receives the start time as the <em>text</em> <code>'480'</code> — exactly what you get from an HTML form field or a query string. JavaScript does not complain. The <code>+</code> sign sees a text and <strong>glues</strong> instead of adding: <code>'480' + 120</code> becomes <code>'480120'</code>. No crash, no red line, no log — just a wrong number travelling on into the booking. Somebody finds it days later, far from this line.</p>
<p>Now the same file in TypeScript. Only two things were added: <code>: number</code> after each parameter (and one after the parentheses for the result).</p>
${ma('typescript', CODE.endTs)}
${ra(OUT['2-tsc'])}
<p>Read the message from left to right — this is the shape of every TypeScript error you will meet:</p>
<ul>
<li><code>demo0/ts-00-8/end.ts(7,23)</code> — the file, <strong>line 7, column 23</strong>: exactly where the wrong argument <code>'480'</code> starts.</li>
<li><code>error TS2345</code> — the error <strong>code</strong>. TS2345 always means “this argument does not fit that parameter”. You will see it hundreds of times.</li>
<li>The sentence — <em>Argument of type 'string' is not assignable to parameter of type 'number'</em> — the reason in plain English.</li>
</ul>
<p>How long did that take? We timed the full command twice on this machine:</p>
${ra(OUT['5-time-a'])}
<p>0.399 s, and 0.375 s on the second run — under half a second, including starting npx, and nobody had to open a browser, fill in a form, or wait for a user to complain. That is the whole value of TypeScript in one picture: <strong>the same mistake, found earlier, at the exact line, for almost free.</strong></p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — “my .ts file ran, so it is correct”.</strong> Since Node 22.18 (31 July 2025) Node can run a <code>.ts</code> file directly. Watch what happens with the very file tsc just refused:</p>
${ra(OUT['3-node-ts'])}
<p>It runs, exit 0, and prints the same wrong <code>480120</code>. Node does <strong>type stripping</strong>: it deletes the labels and runs the JavaScript underneath. It never checks them. Running and checking are two separate steps, done by two separate programs. A real project therefore always has a gate — <code>npx tsc --noEmit</code> before merging — because the runner will happily run wrong code. Lesson 0.4 is entirely about this split.</p>
</div>

<h3>The words people mix up</h3>
<table>
<thead><tr><th>Word</th><th>What it really is</th><th>Checks types?</th></tr></thead>
<tbody>
<tr><td><strong>JavaScript</strong></td><td>The language that browsers and Node actually execute. It has no type labels.</td><td>—</td></tr>
<tr><td><strong>TypeScript</strong></td><td>A language: JavaScript + types. Every JavaScript program is already valid TypeScript syntax, so you never start from scratch.</td><td>—</td></tr>
<tr><td><strong><code>tsc</code></strong></td><td>The TypeScript compiler. It checks types and can also write out <code>.js</code> files. Version 7 (July 2026) is rewritten in Go and installs as a native program.</td><td><strong>Yes</strong> — the only one in this table</td></tr>
<tr><td><strong>Type stripping</strong></td><td>What Node 22.18+ does with <code>node file.ts</code>: remove the labels, run the rest.</td><td>No</td></tr>
<tr><td><strong><code>tsx</code> (the tool)</strong></td><td>A popular npm package that runs <code>.ts</code> files on older Node versions. Not to be confused with <code>.tsx</code> files, which are TypeScript + JSX for React.</td><td>No</td></tr>
<tr><td><strong>JSDoc + <code>// @ts-check</code></strong></td><td>Types written inside comments of an ordinary <code>.js</code> file. <code>tsc</code> can read and check them.</td><td>Yes, through <code>tsc</code></td></tr>
<tr><td><strong>Flow</strong></td><td>Facebook’s competing type checker for JavaScript (2014). Same idea; far fewer users today.</td><td>Yes, its own checker</td></tr>
</tbody>
</table>
<p>The JSDoc row surprises people, so here it is running. The file stays <code>.js</code>; the types live in comments:</p>
${ma('javascript', CODE.endCheck)}
${ra(OUT['4-checkjs'])}
<p>Same checker, same TS2345, while Node still runs this file unchanged. This is how teams move a large old JavaScript project to TypeScript <strong>one file at a time</strong> — lesson 1.4 does it on LabFlow.</p>

<h3>Where TypeScript came from — dates you can check</h3>
<table>
<thead><tr><th>When</th><th>What happened</th></tr></thead>
<tbody>
<tr><td>1 Oct 2012</td><td>Microsoft releases <strong>TypeScript 0.8</strong> to the public after two years of internal work. The lead architect is <strong>Anders Hejlsberg</strong>, who earlier created Turbo Pascal and Delphi and led the design of C#.</td></tr>
<tr><td>22 Sep 2016</td><td>TypeScript <strong>2.0</strong> brings <code>strictNullChecks</code>: forgetting that a value can be <code>null</code> or <code>undefined</code> becomes a compile error. This one flag catches a whole family of crashes such as “Cannot read properties of undefined” before they happen.</td></tr>
<tr><td>11 Mar 2025</td><td>“A 10x Faster TypeScript”: the team announces a port of the compiler to Go. Checking VS Code’s 1,505,000 lines drops from 77.8 s to 7.5 s.</td></tr>
<tr><td>31 Jul 2025</td><td>Node <strong>22.18.0</strong>: type stripping on by default — <code>node file.ts</code> just works.</td></tr>
<tr><td>23 Mar 2026</td><td>TypeScript <strong>6.0</strong> — the last major version whose compiler is written in TypeScript itself (7.0 is the Go rewrite). VS Code 1.124.2 still ships 6.0.3 inside its editor.</td></tr>
<tr><td>8 Jul 2026</td><td>TypeScript <strong>7.0</strong>, the native compiler: 8–12× faster full builds, and <code>strict</code> mode on by default. This course pins <strong>7.0.2</strong>.</td></tr>
</tbody>
</table>
<p>Do not trust a table in a course — check it. The npm registry keeps the exact publish time of every version:</p>
${ra(OUT['8-npm-time'])}

<h3>Why it was born</h3>
<p>Around 2010, large teams — Microsoft’s own among them — were writing applications of hundreds of thousands of lines in a language designed in 1995 for small scripts on web pages. Three pains kept coming back: <strong>nobody knew what a value could be</strong> (is <code>start</code> a number or a text? can <code>user</code> be <code>null</code> here?), <strong>refactoring was a gamble</strong> (rename a field used in two hundred places and JavaScript says nothing until a user reaches the place you forgot), and <strong>editors were blind</strong> (autocomplete and safe rename need to know the shape of values).</p>
<p>TypeScript’s answer was a deliberate design choice: be a <strong>superset</strong> of JavaScript. You do not rewrite anything; you add labels gradually, file by file, and the labels disappear before the code runs. That is why it won where many “better JavaScript” languages failed: you could start on Monday without asking anyone’s permission.</p>

<h3>What it gives you, personally</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">📊 The job market</span><span class="v">GitHub’s Octoverse 2025 report: in <strong>August 2025 TypeScript became the #1 language on GitHub</strong>, with 2,636,006 monthly contributors — up 66% in one year, ahead of Python and JavaScript.</span></div>
  <div class="kv"><span class="k">🎓 Your FPT projects</span><span class="v">SWP391, SEP490 and the Node.js narrow major (SDN302, WDP301) are team projects. When your teammate changes a field from <code>roomId</code> to <code>labId</code>, TypeScript shows every place that breaks — before the demo, not during it.</span></div>
  <div class="kv"><span class="k">💼 Interviews</span><span class="v">“<code>any</code> or <code>unknown</code>?”, “interface or type?” are standard intern questions — answered here with code you ran.</span></div>
  <div class="kv"><span class="k">🏢 Real code</span><span class="v">The website you are reading right now is written in TypeScript end to end. Counted on 1 November 2026:</span></div>
</div>
${ra(OUT['6-website'])}
<p>1,199 backend files and 360,306 lines of TypeScript, 2,601 frontend <code>.ts</code>/<code>.tsx</code> files, and <strong>zero</strong> <code>.js</code> files in the backend source. One honest detail: this site’s <code>package.json</code> asks for TypeScript <code>^5.6.3</code>, not 7. Real companies upgrade compilers carefully; the ideas you learn here are the same in 5, 6 and 7, and this course pins 7.0.2 so every output you see is reproducible.</p>

<h3>🗺 From your file to running code</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Write</div><div class="lz-d">a .ts file: JavaScript + type labels</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Check</div><div class="lz-d">tsc reads the labels, reports TSxxxx errors, runs nothing</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Strip</div><div class="lz-d">the labels are removed (by Node, tsc or a bundler)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Run</div><div class="lz-d">plain JavaScript runs in Node or the browser</div></div>
</div>

<h3>🧪 Practice (10 minutes — you will succeed)</h3>
<div class="callout ok">
<ol>
<li>Check Node: <code>node -v</code> must print <code>v22.18</code> or newer (this course uses <code>v22.23.3</code>; lesson 0.3 explains installing it).</li>
<li>Make an empty folder <code>hello-ts</code>, open a terminal in it and install TypeScript, pinned to the exact version of the course:
${ra(OUT['7-p-install'])}
${ra(OUT['7-p-version'])}</li>
<li>Create <code>hello.ts</code> with three lines — the second one is wrong on purpose (a text where a number belongs):
${ma('typescript', CODE.helloSai)}</li>
<li>Ask the compiler to check it, without writing any output file:
${ra(OUT['7-p-loi'])}
Read it: line 2, column 7, code TS2322 (“this value does not fit the type of this variable”).</li>
<li>Fix the value — remove the quotes so <code>31</code> is a number — check again and run the file with Node:
${ma('typescript', CODE.helloDung)}
${ra(OUT['7-p-dung'])}</li>
</ol>
<p><strong>Done when:</strong> you saw TS2322 pointing at line 2, then — after the fix — tsc printed nothing (no news is good news), and Node printed <code>BE-201 needs 31 seats</code>. Bonus: put the quotes back and run <code>node hello.ts</code> without tsc. It prints the same sentence. Explain in one line why (hint: the trap box above).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">type</span><span class="v">The shape of a value: number, string, an object with certain fields, one of a few words.</span></div>
  <div class="kv"><span class="k">type annotation</span><span class="v">A label you write: <code>seats: number</code>.</span></div>
  <div class="kv"><span class="k">compiler (tsc)</span><span class="v">The program that reads TypeScript, checks the types and can emit JavaScript.</span></div>
  <div class="kv"><span class="k">compile time · runtime</span><span class="v">When tsc reads your code · when Node or the browser executes it.</span></div>
  <div class="kv"><span class="k">type error · TSxxxx</span><span class="v">A value that does not fit its label, reported with a code such as TS2345.</span></div>
  <div class="kv"><span class="k">type stripping</span><span class="v">Removing the labels to run the code — no checking.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>TypeScript = JavaScript + type labels. <code>tsc</code> checks the labels without running anything; then plain JavaScript runs.</li>
<li>The same LabFlow mistake: JavaScript silently prints <code>480120</code>; tsc reports TS2345 at line 7, column 23 in about 0.4 s.</li>
<li>Node 22.18+ runs <code>.ts</code> files by stripping types — it never checks them. Checking is a separate gate.</li>
<li>Don’t mix up TypeScript (language), tsc (checker), type stripping and tsx (runners), JSDoc (types in comments), Flow (a rival).</li>
<li>Born at Microsoft in 2012 (Hejlsberg) for big JavaScript apps; native compiler TypeScript 7 since July 2026.</li>
<li>For you: GitHub’s #1 language in 2025, safer team projects, standard interview topic — and this website is 100% TypeScript in its backend source.</li>
</ul>

<h3>📚 Sources</h3>
${NGUON}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-a3-1-typescript-nextjs', title: 'Also in FER202 — A3.1: TypeScript with React &amp; an intro to Next.js', sub: 'Same: TypeScript as static types on top of JavaScript, catching a wrong prop type at compile time instead of in production. Different: FER202 shows one typed React component in a single screen next to Next.js; this course starts from zero, explains the compiler, the history and why it exists, and goes all the way to a typed backend and frontend. Not studying FER202? No problem — this course stands on its own.', cta: 'OPEN FER202 LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Chào bạn. Trước chú thích kiểu đầu tiên, hãy biết mình đang học cái gì — và vì sao</h2>
<p class="lead">Chào mừng bạn. Bạn đã viết JavaScript rồi — cho FER202, cho SDN302, có thể cho một đồ án nhóm. Trong hai mươi phút, với output chạy thật, bài này cho bạn thấy TypeScript thêm gì vào chính thứ JavaScript đó, nó từ đâu ra, và vì sao gần như mọi đội Node.js bạn nộp CV đều mong bạn biết nó. Học xong, bạn nói được trong một câu TypeScript là gì, phân biệt được <code>tsc</code> với Node với <code>tsx</code>, và tự tay tạo ra rồi sửa được lỗi kiểu đầu tiên của mình.</p>
<p>Bài này và bài kế là "cửa chính" của khoá; bài kế kể những chuyện có thật về các con bug mà kiểu bắt được và đưa bạn một lộ trình học. Bài 0.1 sau đó giới thiệu dự án của cả khoá: LabFlow TS.</p>

<h3>TypeScript là gì — nói bằng hình ảnh đời thường trước</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">📝 Trình kiểm chính tả</span><span class="v">Nó gạch chân lỗi gõ <strong>ngay lúc bạn gõ</strong>, lâu trước khi thầy đọc bài luận. TypeScript gạch chân một giá trị sai lâu trước khi người dùng bấm nút.</span></div>
  <div class="kv"><span class="k">🔌 Phích cắm đúng chân</span><span class="v">Phích ba chân không cắm được vào ổ hai lỗ. Bạn biết ngay ở bức tường, chứ không phải lúc laptop đã cháy. Một <strong>kiểu (type)</strong> là hình dạng của một giá trị: "một con số", "một đoạn chữ", "một trong STUDENT, LECTURER, ADMIN".</span></div>
  <div class="kv"><span class="k">🏷️ Nhãn trên thùng hàng</span><span class="v">"Dễ vỡ — 31 cái ly." Người khuân thùng biết bên trong có gì mà không cần mở. <strong>Chú thích kiểu (type annotation)</strong> chính là cái nhãn đó, viết cạnh một biến hay một tham số.</span></div>
</div>
<p>Giờ định nghĩa sẽ nghe hiển nhiên: <strong>TypeScript là JavaScript cộng thêm nhãn kiểu.</strong> Một chương trình tên <code>tsc</code> — trình biên dịch (compiler) TypeScript — đọc các nhãn và báo mọi giá trị không khớp nhãn của nó, <strong>mà không chạy chương trình của bạn</strong>. Sau đó nhãn bị gỡ đi và JavaScript thường chạy y như trước. Cách code chạy không đổi gì cả; thứ thay đổi là <em>lúc nào</em> bạn biết mình sai.</p>

<h3>Viết thành code thì trông thế nào — một hàm LabFlow, hai ngôn ngữ</h3>
<p>LabFlow là ứng dụng đặt phòng lab dùng xuyên suốt các khoá backend của CuongThai. Giờ được lưu bằng số phút tính từ nửa đêm: 08:00 là phút 480. Đây là một hàm nhỏ bằng JavaScript thường, tính lượt đặt kết thúc lúc nào:</p>
${ma('javascript', CODE.endJs)}
${ra(OUT['1-js'])}
<p>Lời gọi thứ nhất đúng: 480 + 120 = 600, tức 10:00. Lời gọi thứ hai nhận giờ bắt đầu dưới dạng <em>chữ</em> <code>'480'</code> — đúng thứ bạn nhận được từ một ô nhập HTML hay một query string. JavaScript không kêu ca gì. Dấu <code>+</code> thấy chữ thì <strong>nối</strong> thay vì cộng: <code>'480' + 120</code> thành <code>'480120'</code>. Không sập, không dòng đỏ, không log — chỉ một con số sai đi tiếp vào lượt đặt. Vài ngày sau mới có người phát hiện, ở một chỗ cách dòng này rất xa.</p>
<p>Giờ cùng file đó bằng TypeScript. Chỉ thêm hai thứ: <code>: number</code> sau mỗi tham số (và một cái sau dấu ngoặc cho kết quả).</p>
${ma('typescript', CODE.endTs)}
${ra(OUT['2-tsc'])}
<p>Đọc thông báo từ trái sang phải — đây là hình dạng của mọi lỗi TypeScript bạn sẽ gặp:</p>
<ul>
<li><code>demo0/ts-00-8/end.ts(7,23)</code> — tên file, <strong>dòng 7, cột 23</strong>: đúng chỗ đối số sai <code>'480'</code> bắt đầu.</li>
<li><code>error TS2345</code> — <strong>mã lỗi</strong>. TS2345 luôn nghĩa là "đối số này không khớp tham số kia". Bạn sẽ gặp nó hàng trăm lần.</li>
<li>Câu chữ — <em>Argument of type 'string' is not assignable to parameter of type 'number'</em> (đối số kiểu chuỗi không gán được cho tham số kiểu số) — lý do bằng tiếng Anh dễ đọc.</li>
</ul>
<p>Mất bao lâu? Đo cả lệnh hai lần trên máy soạn bài:</p>
${ra(OUT['5-time-a'])}
<p>0,399 giây, lần hai 0,375 giây — dưới nửa giây, tính cả thời gian khởi động npx, và không ai phải mở trình duyệt, điền form hay chờ người dùng phàn nàn. Đó là toàn bộ giá trị của TypeScript gói trong một hình: <strong>cùng một lỗi, phát hiện sớm hơn, đúng dòng, gần như miễn phí.</strong></p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "file .ts của tôi chạy được, vậy là đúng".</strong> Từ Node 22.18 (31/07/2025), Node chạy thẳng được file <code>.ts</code>. Xem chuyện gì xảy ra với chính file mà tsc vừa từ chối:</p>
${ra(OUT['3-node-ts'])}
<p>Nó chạy, exit 0, và in đúng con số sai <code>480120</code>. Node làm việc <strong>type stripping (gỡ kiểu)</strong>: xoá các nhãn rồi chạy phần JavaScript bên dưới. Nó không bao giờ kiểm nhãn. Chạy và kiểm là hai bước riêng, do hai chương trình riêng làm. Vì thế dự án thật luôn có một cổng chặn — <code>npx tsc --noEmit</code> trước khi gộp code — vì bộ chạy sẽ vui vẻ chạy cả code sai. Bài 0.4 dành trọn cho chuyện tách đôi này.</p>
</div>

<h3>Những từ hay bị nhầm</h3>
<table>
<thead><tr><th>Từ</th><th>Thật ra là gì</th><th>Có kiểm kiểu?</th></tr></thead>
<tbody>
<tr><td><strong>JavaScript</strong></td><td>Ngôn ngữ mà trình duyệt và Node thật sự thực thi. Không có nhãn kiểu.</td><td>—</td></tr>
<tr><td><strong>TypeScript</strong></td><td>Một ngôn ngữ: JavaScript + kiểu. Mọi chương trình JavaScript đã là cú pháp TypeScript hợp lệ, nên bạn không bao giờ phải bắt đầu lại từ đầu.</td><td>—</td></tr>
<tr><td><strong><code>tsc</code></strong></td><td>Trình biên dịch TypeScript. Kiểm kiểu và có thể xuất ra file <code>.js</code>. Bản 7 (07/2026) được viết lại bằng Go, cài vào máy như một chương trình gốc (native).</td><td><strong>Có</strong> — duy nhất trong bảng</td></tr>
<tr><td><strong>Type stripping (gỡ kiểu)</strong></td><td>Việc Node 22.18+ làm với <code>node file.ts</code>: gỡ nhãn, chạy phần còn lại.</td><td>Không</td></tr>
<tr><td><strong><code>tsx</code> (công cụ)</strong></td><td>Một gói npm phổ biến để chạy file <code>.ts</code> trên Node đời cũ. Đừng nhầm với file <code>.tsx</code> — là TypeScript + JSX cho React.</td><td>Không</td></tr>
<tr><td><strong>JSDoc + <code>// @ts-check</code></strong></td><td>Kiểu viết trong chú thích của một file <code>.js</code> bình thường. <code>tsc</code> đọc và kiểm được.</td><td>Có, qua <code>tsc</code></td></tr>
<tr><td><strong>Flow</strong></td><td>Bộ kiểm kiểu cạnh tranh của Facebook cho JavaScript (2014). Cùng ý tưởng; ngày nay ít người dùng hơn nhiều.</td><td>Có, bằng bộ kiểm riêng</td></tr>
</tbody>
</table>
<p>Dòng JSDoc làm nhiều người bất ngờ, nên đây là nó chạy thật. File vẫn là <code>.js</code>; kiểu nằm trong chú thích:</p>
${ma('javascript', CODE.endCheck)}
${ra(OUT['4-checkjs'])}
<p>Cùng bộ kiểm, cùng TS2345, trong khi Node vẫn chạy file này y nguyên. Đây là cách các đội chuyển một dự án JavaScript cũ, lớn sang TypeScript <strong>từng file một</strong> — bài 1.4 làm đúng việc đó trên LabFlow.</p>

<h3>TypeScript từ đâu ra — các mốc tự kiểm được</h3>
<table>
<thead><tr><th>Khi nào</th><th>Chuyện gì xảy ra</th></tr></thead>
<tbody>
<tr><td>01/10/2012</td><td>Microsoft công bố <strong>TypeScript 0.8</strong> sau hai năm phát triển nội bộ. Kiến trúc sư trưởng là <strong>Anders Hejlsberg</strong> — người trước đó tạo ra Turbo Pascal, Delphi và dẫn dắt thiết kế C#.</td></tr>
<tr><td>22/09/2016</td><td>TypeScript <strong>2.0</strong> mang tới <code>strictNullChecks</code>: quên rằng một giá trị có thể là <code>null</code> hay <code>undefined</code> trở thành lỗi biên dịch. Riêng cờ này chặn trước cả một họ lỗi sập kiểu "Cannot read properties of undefined".</td></tr>
<tr><td>11/03/2025</td><td>"A 10x Faster TypeScript": nhóm công bố chuyển trình biên dịch sang Go. Kiểm 1.505.000 dòng của VS Code giảm từ 77,8 giây xuống 7,5 giây.</td></tr>
<tr><td>31/07/2025</td><td>Node <strong>22.18.0</strong>: bật type stripping mặc định — <code>node file.ts</code> chạy luôn.</td></tr>
<tr><td>23/03/2026</td><td>TypeScript <strong>6.0</strong> — bản lớn cuối cùng có trình biên dịch viết bằng chính TypeScript (7.0 là bản viết lại bằng Go). VS Code 1.124.2 vẫn đóng gói 6.0.3 bên trong editor.</td></tr>
<tr><td>08/07/2026</td><td>TypeScript <strong>7.0</strong>, trình biên dịch gốc (native): build đầy đủ nhanh 8–12 lần, và bật chế độ <code>strict</code> mặc định. Khoá này ghim bản <strong>7.0.2</strong>.</td></tr>
</tbody>
</table>
<p>Đừng tin một cái bảng trong khoá học — hãy tự kiểm. Kho npm giữ thời điểm phát hành chính xác của từng phiên bản:</p>
${ra(OUT['8-npm-time'])}

<h3>Vì sao nó ra đời</h3>
<p>Khoảng năm 2010, nhiều đội lớn — trong đó có chính Microsoft — đang viết những ứng dụng hàng trăm nghìn dòng bằng một ngôn ngữ sinh ra năm 1995 cho mấy đoạn script nhỏ trên trang web. Ba nỗi đau cứ lặp lại: <strong>không ai biết một giá trị có thể là gì</strong> (<code>start</code> là số hay chữ? ở đây <code>user</code> có thể là <code>null</code> không?), <strong>refactor (sửa cấu trúc code) là đánh bạc</strong> (đổi tên một trường dùng ở hai trăm chỗ thì JavaScript im lặng cho tới khi người dùng chạm đúng chỗ bạn quên), và <strong>trình soạn thảo bị mù</strong> (gợi ý code, đổi tên an toàn đều cần biết hình dạng giá trị).</p>
<p>Câu trả lời của TypeScript là một lựa chọn thiết kế có chủ đích: làm <strong>ngôn ngữ cha (superset)</strong> của JavaScript. Bạn không viết lại gì cả; bạn thêm nhãn dần dần, từng file, và nhãn biến mất trước khi code chạy. Đó là lý do nó thắng ở chỗ nhiều ngôn ngữ "JavaScript tốt hơn" khác thất bại: bạn bắt đầu được ngay thứ Hai mà không cần xin phép ai.</p>

<h3>Nó giúp gì cho chính BẠN</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">📊 Thị trường việc làm</span><span class="v">Báo cáo Octoverse 2025 của GitHub: <strong>tháng 8/2025 TypeScript trở thành ngôn ngữ số 1 trên GitHub</strong>, với 2.636.006 người đóng góp mỗi tháng — tăng 66% trong một năm, vượt cả Python và JavaScript.</span></div>
  <div class="kv"><span class="k">🎓 Đồ án ở FPT</span><span class="v">SWP391, SEP490 và chuyên ngành hẹp Node.js (SDN302, WDP301) đều là dự án nhóm. Khi bạn cùng nhóm đổi một trường từ <code>roomId</code> thành <code>labId</code>, TypeScript chỉ ra mọi chỗ bị vỡ — trước buổi demo, chứ không phải giữa buổi demo.</span></div>
  <div class="kv"><span class="k">💼 Phỏng vấn</span><span class="v">"<code>any</code> hay <code>unknown</code>?", "interface hay type?" là câu hỏi quen thuộc khi phỏng vấn thực tập — ở đây trả lời bằng code bạn tự chạy.</span></div>
  <div class="kv"><span class="k">🏢 Code thật</span><span class="v">Chính website bạn đang đọc được viết bằng TypeScript từ đầu đến cuối. Đếm ngày 01/11/2026:</span></div>
</div>
${ra(OUT['6-website'])}
<p>1.199 file và 360.306 dòng TypeScript ở backend, 2.601 file <code>.ts</code>/<code>.tsx</code> ở frontend, và <strong>không một</strong> file <code>.js</code> nào trong mã nguồn backend. Một chi tiết thật thà: <code>package.json</code> của website này khai TypeScript <code>^5.6.3</code>, chưa phải bản 7. Công ty thật nâng trình biên dịch rất cẩn thận; những gì bạn học ở đây giống nhau ở bản 5, 6 và 7, còn khoá này ghim 7.0.2 để mọi output bạn thấy đều tự chạy lại được.</p>

<h3>🗺 Từ file của bạn tới code đang chạy</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Viết</div><div class="lz-d">file .ts: JavaScript + nhãn kiểu</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Kiểm</div><div class="lz-d">tsc đọc nhãn, báo lỗi TSxxxx, không chạy gì</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Gỡ</div><div class="lz-d">nhãn bị xoá (bởi Node, tsc hoặc bundler)</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Chạy</div><div class="lz-d">JavaScript thường chạy trong Node hay trình duyệt</div></div>
</div>

<h3>🧪 Thực hành (10 phút — chắc chắn làm được)</h3>
<div class="callout ok">
<ol>
<li>Kiểm Node: <code>node -v</code> phải in <code>v22.18</code> trở lên (khoá dùng <code>v22.23.3</code>; bài 0.3 hướng dẫn cài).</li>
<li>Tạo thư mục trống <code>hello-ts</code>, mở terminal trong đó và cài TypeScript, ghim đúng bản của khoá:
${ra(OUT['7-p-install'])}
${ra(OUT['7-p-version'])}</li>
<li>Tạo <code>hello.ts</code> gồm ba dòng — dòng hai cố ý sai (một đoạn chữ ở chỗ cần con số):
${ma('typescript', CODE.helloSai)}</li>
<li>Nhờ trình biên dịch kiểm, không xuất file nào:
${ra(OUT['7-p-loi'])}
Đọc nó: dòng 2, cột 7, mã TS2322 ("giá trị này không khớp kiểu của biến").</li>
<li>Sửa giá trị — bỏ dấu nháy để <code>31</code> là con số — kiểm lại rồi chạy file bằng Node:
${ma('typescript', CODE.helloDung)}
${ra(OUT['7-p-dung'])}</li>
</ol>
<p><strong>Đạt khi:</strong> bạn thấy TS2322 chỉ vào dòng 2, rồi — sau khi sửa — tsc không in gì (không có tin là tin tốt), và Node in <code>BE-201 needs 31 seats</code>. Thêm: đặt lại dấu nháy rồi chạy <code>node hello.ts</code> mà không qua tsc. Nó in đúng câu đó. Giải thích trong một dòng vì sao (gợi ý: hộp bẫy ở trên).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">type (kiểu)</span><span class="v">Hình dạng của một giá trị: số, chuỗi, object có những trường nhất định, một trong vài từ cho trước.</span></div>
  <div class="kv"><span class="k">type annotation (chú thích kiểu)</span><span class="v">Cái nhãn bạn tự viết: <code>seats: number</code>.</span></div>
  <div class="kv"><span class="k">compiler — tsc (trình biên dịch)</span><span class="v">Chương trình đọc TypeScript, kiểm kiểu và có thể xuất ra JavaScript.</span></div>
  <div class="kv"><span class="k">compile time · runtime (lúc biên dịch · lúc chạy)</span><span class="v">Lúc tsc đọc code · lúc Node hay trình duyệt thực thi nó.</span></div>
  <div class="kv"><span class="k">type error · TSxxxx (lỗi kiểu)</span><span class="v">Một giá trị không khớp nhãn, được báo kèm mã như TS2345.</span></div>
  <div class="kv"><span class="k">type stripping (gỡ kiểu)</span><span class="v">Xoá nhãn để chạy code — không kiểm gì.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>TypeScript = JavaScript + nhãn kiểu. <code>tsc</code> kiểm nhãn mà không chạy gì; sau đó JavaScript thường mới chạy.</li>
<li>Cùng một lỗi LabFlow: JavaScript lặng lẽ in <code>480120</code>; tsc báo TS2345 ở dòng 7, cột 23 trong khoảng 0,4 giây.</li>
<li>Node 22.18+ chạy file <code>.ts</code> bằng cách gỡ kiểu — không bao giờ kiểm. Kiểm là một cổng riêng.</li>
<li>Đừng nhầm TypeScript (ngôn ngữ), tsc (bộ kiểm), type stripping và tsx (bộ chạy), JSDoc (kiểu trong chú thích), Flow (đối thủ).</li>
<li>Ra đời ở Microsoft năm 2012 (Hejlsberg) cho các ứng dụng JavaScript lớn; trình biên dịch gốc TypeScript 7 từ tháng 7/2026.</li>
<li>Cho bạn: ngôn ngữ số 1 trên GitHub năm 2025, đồ án nhóm an toàn hơn, chủ đề phỏng vấn quen thuộc — và mã nguồn backend của chính website này là TypeScript 100%.</li>
</ul>

<h3>📚 Nguồn</h3>
${NGUON}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-a3-1-typescript-nextjs', title: 'Đã gặp ở FER202 — A3.1: TypeScript với React &amp; giới thiệu Next.js', sub: 'Giống: TypeScript là kiểu tĩnh phủ lên JavaScript, bắt prop sai kiểu lúc biên dịch thay vì trên production. Khác: FER202 chỉ một component React có kiểu trong một màn hình, đặt cạnh Next.js; khoá này đi từ số 0, giải thích trình biên dịch, lịch sử và lý do nó tồn tại, rồi đi tới tận backend và frontend có kiểu. Không học FER202? Không sao — khoá này tự đủ.', cta: 'MỞ BÀI FER202 →' })}
</div>
`,
};
