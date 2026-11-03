/**
 * Bài 10.4 — Cách tiếp tục học (nâng cấp 02/11/2026). Output thật: _demo/_t10/10-4/chay.sh (Node 22.23): app ghi chú sắp sai
 * với 5 ghi chú nhưng "đúng" với 2, rút gọn còn 1 dòng tái hiện ([3,1,2].sort((a,b)=>a>b) giữ nguyên), đọc tài liệu (sort mặc
 * định so CHUỖI), thông tin môi trường cho câu hỏi, đọc mã nguồn thư viện ms 2.0.0 trong node_modules (chỉ đọc).
 * Deck: scripts/slides-src/wf-10-4.mjs. Code Lab: wf-10-4-keep-learning.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-10-4', 'How to keep learning', 'Cách tiếp tục học', [
  [1, 'How to keep learning',
    '<p>This course ends, and the tools will keep changing. What lasts are a few habits: build things instead of only watching tutorials, read the official documentation, shrink a bug until it is tiny before asking for help, ask questions others can answer, and read other people\'s code. This lesson practises each one on real code.</p>',
    '<p>Khoá học này kết thúc, và công cụ sẽ còn thay đổi. Thứ tồn tại lâu là vài thói quen: dựng sản phẩm thay vì chỉ xem hướng dẫn, đọc tài liệu chính thức, thu nhỏ một lỗi cho tới khi thật bé trước khi nhờ giúp, đặt câu hỏi người khác trả lời được, và đọc mã của người khác. Bài này luyện từng thói quen trên mã thật.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to plan small projects that make you learn, find the answer in documentation like MDN, reduce a bug in a fifty line program to a one line reproduction, write a question with the facts others need, and find how a library really works by reading its source.</p>',
    '<p>Bạn sẽ lên kế hoạch được những dự án nhỏ buộc bạn phải học, tìm câu trả lời trong tài liệu như MDN, thu một lỗi trong chương trình năm mươi dòng thành một dòng tái hiện, viết câu hỏi có đủ dữ kiện người khác cần, và tìm hiểu một thư viện thật sự hoạt động thế nào bằng cách đọc mã nguồn của nó.</p>'],
  [3, 'Build, do not only watch',
    '<p>Watching a tutorial feels like progress because everything works. Building something yourself is where you get stuck, and getting stuck is where you learn. Pick projects slightly beyond what you know, and finish them, even if small.</p>',
    '<p>Xem hướng dẫn tạo cảm giác tiến bộ vì mọi thứ đều chạy. Tự dựng một thứ mới là lúc bạn bị kẹt, và bị kẹt chính là lúc bạn học. Chọn dự án vượt một chút so với những gì bạn biết, và làm cho xong, dù nhỏ.</p>'],
  [4, 'A bug that hides in a big program',
    '<p>A notes app lists notes oldest first. With five notes the order is wrong; filtered to two notes it looks right. Pasting the whole program into a question would hide the problem from everyone, including you.</p>',
    '<p>Một app ghi chú liệt kê ghi chú cũ nhất trước. Với năm ghi chú thứ tự sai; lọc còn hai ghi chú thì trông đúng. Dán cả chương trình vào câu hỏi sẽ che vấn đề khỏi mọi người, kể cả bạn.</p>'],
  [5, 'Shrink it to one line',
    '<p>Remove filtering, rendering and the summary: still wrong. Replace dates with three numbers: still wrong. The bug is a comparator that returns true or false. The documentation says a comparator must return a negative number, zero or a positive number.</p>',
    '<p>Bỏ lọc, bỏ hiển thị, bỏ tóm tắt: vẫn sai. Thay ngày bằng ba con số: vẫn sai. Lỗi nằm ở hàm so sánh trả về true hoặc false. Tài liệu nói hàm so sánh phải trả về số âm, số không hoặc số dương.</p>'],
  [6, 'Read the docs first',
    '<p>Ten, nine, one sorted without a comparator gives one, ten, nine, because the default sort compares strings. MDN says so in the first paragraph. Two minutes of reading would have saved an hour of guessing.</p>',
    '<p>Mười, chín, một sắp xếp không có hàm so sánh cho ra một, mười, chín, vì sort mặc định so sánh chuỗi. MDN nói rõ điều này ngay đoạn đầu. Hai phút đọc tài liệu đã tiết kiệm một giờ đoán mò.</p>'],
  [7, 'Ask a good question',
    '<p>A good question has a title that names the problem, the smallest code that shows it, what you expected, what happened, what you tried, and your versions. Most of the time, writing that question answers it before you send it.</p>',
    '<p>Một câu hỏi tốt có tiêu đề gọi tên vấn đề, đoạn mã nhỏ nhất làm lộ nó, điều bạn mong đợi, điều đã xảy ra, những gì bạn đã thử, và phiên bản bạn dùng. Phần lớn trường hợp, viết xong câu hỏi đó là đã tự trả lời được trước khi gửi.</p>'],
  [8, 'Read other people\'s code',
    '<p>The ms library turns two days into milliseconds. Its parse function is one regular expression and a switch. Reading it showed why two days works and the words two days returns undefined. Libraries are just code.</p>',
    '<p>Thư viện ms đổi hai ngày thành mili giây. Hàm parse của nó là một biểu thức chính quy và một switch. Đọc nó cho thấy vì sao hai ngày chạy được còn chữ two days trả về undefined. Thư viện cũng chỉ là mã.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to take a real bug of your own, reduce it to the smallest reproduction, write the full question without sending it, and read the source of one small package you use. Done when the reproduction is under ten lines.</p>',
    '<p>Bài luyện yêu cầu bạn lấy một lỗi thật của chính mình, thu nó về bản tái hiện nhỏ nhất, viết đầy đủ câu hỏi mà không gửi, và đọc mã nguồn của một gói nhỏ bạn đang dùng. Xong khi bản tái hiện dưới mười dòng.</p>'],
]);

export default {
  title: '10.4 — How to keep learning|||10.4 — Cách tiếp tục học',
  slug: 'wf-10-4-keep-learning',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/3PHXvlpOkf4', durationSeconds: 0 },
  description: 'Dựng dự án thay vì "tutorial hell"; thu một lỗi thật (app ghi chú sắp sai với 5 ghi chú, "đúng" với 2) về một dòng tái hiện bằng Node 22.23; đọc MDN trước khi đoán ([10, 9, 1].sort() ra [1, 10, 9]); câu hỏi tốt có mã tối thiểu + mong đợi + thực tế + phiên bản; đọc mã nguồn thư viện ms trong node_modules; nơi tìm câu trả lời.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>The course ends; your learning does not</h2>
<p class="lead">After this lesson you can keep improving without a course: choose projects that make you learn, find answers in official documentation, shrink a bug to a tiny reproduction, write questions that get answered, and read the source code of the libraries you use. These habits outlast every framework in this course — they are how working developers learn new tools every year.</p>

<h3>Step 1 — build things, do not only watch them</h3>
<p>"Tutorial hell" is watching one tutorial after another, following along, and then being unable to start anything alone. Everything works in a tutorial because someone already removed every problem. You learn at the moment you are stuck — so you need projects that get you stuck.</p>
<table>
<thead><tr><th>After this course, build…</th><th>It makes you practise</th></tr></thead>
<tbody>
<tr><td>A personal page with a contact form that really sends</td><td>HTML/CSS, a form, a small API route, validation (Ch2–6)</td></tr>
<tr><td>A notes or habit tracker with login</td><td>sessions, a database, CRUD (Ch6–8)</td></tr>
<tr><td>The same tracker, rewritten in TypeScript with tests</td><td>types at the boundary, <code>node --test</code> (Ch9–10)</td></tr>
<tr><td>A small tool for your class or club, used by real people</td><td>bug reports, deploying, Git with others (Ch10)</td></tr>
</tbody>
</table>
<p>Rule of thumb: about 20% of the project should be things you do not know yet. Less is boring; much more is paralysing.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — copying code you do not understand.</strong> A snippet from a forum or an AI assistant that "works" is a loan, not knowledge: when it breaks, you cannot fix it. Before you keep any copied line, be able to say what each part does — or try deleting it and see what breaks. Retype short snippets instead of pasting; it forces you to read them.</p></div>

<h3>Step 2 — a bug that hides inside a big program</h3>
<p>A notes app should list notes oldest first:</p>
${ma('javascript', CODE['_t10/10-4/big-app.mjs'])}
${ra(OUT['_t10/out/big-app'])}
<p>With all five notes, the order is clearly wrong. Filtered to <code>study</code>, it looks right — two notes happened to be in order already. "It works on my test data" is exactly how this bug would reach users. Posting all 30 lines and asking "why is my order wrong?" makes everyone read filtering, rendering and counting code that has nothing to do with it.</p>

<h3>Step 3 — shrink it to a minimal reproduction</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Copy, then delete</span><span class="lz-d">Work on a copy. Remove one part (filter, render, summary)…</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Still broken?</span><span class="lz-d">Yes ⇒ that part was innocent; keep it deleted. No ⇒ put it back: the bug is there.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Replace with simpler data</span><span class="lz-d">Objects → strings → small numbers.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Stop at the smallest</span><span class="lz-d">The fewest lines that still show the bug.</span></div>
</div>
${ma('javascript', CODE['_t10/10-4/repro-1.mjs'])}
${ma('javascript', CODE['_t10/10-4/repro-2.mjs'])}
${ra(OUT['_t10/out/repro'])}
<p>Step 1 (dates only, no app) — still wrong. Step 2 (three numbers) — still wrong: <code>[3, 1, 2]</code> comes back unchanged. The bug is not in the data, the dates, or the app: it is the comparator <code>(a, b) => a > b</code>, which returns <code>true</code>/<code>false</code>. A comparator must return a <em>negative</em> number, <code>0</code>, or a <em>positive</em> number; <code>false</code> becomes <code>0</code> ("equal, don't move"), so the sort never puts anything earlier. With <code>a - b</code> for numbers and <code>localeCompare</code> for strings, it works. Very often, by the time the reproduction is small, you have found the bug yourself.</p>

<h3>Step 4 — read the documentation before guessing</h3>
${ma('javascript', CODE['_t10/10-4/docs.mjs'])}
${ra(OUT['_t10/out/docs'])}
<p><code>[10, 9, 1].sort()</code> gives <code>[1, 10, 9]</code>: without a comparator, <code>sort</code> converts values to strings and compares them character by character, so "10" comes before "9", and capital "C" before "a". This is written in the first paragraphs of MDN's page for <code>Array.prototype.sort</code>, together with the comparator rule from Step 3.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">MDN Web Docs</span><span class="v">HTML, CSS, JavaScript and Web APIs — the reference for everything in the browser.</span></div>
  <div class="kv"><span class="k">Official docs</span><span class="v">nodejs.org/api, typescriptlang.org/docs, react.dev, prisma.io/docs — written by the people who build the tool.</span></div>
  <div class="kv"><span class="k">How to read them</span><span class="v">Look for: parameters, return value, exceptions, the examples, and "browser compatibility" or "added in version".</span></div>
  <div class="kv"><span class="k">Check the version</span><span class="v">A blog post from 2019 may describe an API that changed. The docs for <em>your</em> version win.</span></div>
</div>

<h3>Step 5 — ask a question people can answer</h3>
<p>Every good question includes the environment. A script that prints it:</p>
${ma('javascript', CODE['_t10/10-4/env-info.mjs'])}
${ra(OUT['_t10/out/env-info'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Title</span><span class="lz-t">names the problem</span><span class="lz-d">"Array.sort with (a, b) => a > b leaves [3, 1, 2] unsorted" — not "sort not working pls help".</span></div>
<div class="lz-layer"><span class="lz-k">Code</span><span class="lz-t">the minimal reproduction</span><span class="lz-d">As text, not a screenshot, so others can run it.</span></div>
<div class="lz-layer"><span class="lz-k">Expected vs actual</span><span class="lz-t">both, exactly</span><span class="lz-d">"Expected [1, 2, 3], got [3, 1, 2]". Full error messages, copied.</span></div>
<div class="lz-layer"><span class="lz-k">Tried</span><span class="lz-t">what you already ruled out</span><span class="lz-d">"Same with dates and with numbers; works with 2 elements."</span></div>
<div class="lz-layer"><span class="lz-k">Environment</span><span class="lz-t">versions</span><span class="lz-d">Node, browser, OS, library versions (<code>npm ls &lt;package&gt;</code>).</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — pasting secrets into a question.</strong> Error logs and config files often contain API keys, database URLs with passwords, or tokens. Forums, issue trackers and chat assistants keep what you paste. Before you share any output, search it for <code>key</code>, <code>token</code>, <code>password</code>, <code>postgres://</code> and replace the values — the minimal reproduction should not need them anyway.</p></div>
<p>And try the "rubber duck" first: explain the problem out loud, line by line, as if to someone who knows nothing. Writing the question in the format above has the same effect — a large share of questions answer themselves before they are sent.</p>

<h3>Step 6 — read other people's code</h3>
<p>Libraries are not magic; they are code like yours, and it is already on your disk in <code>node_modules</code>. The <code>ms</code> package (a dependency of <code>debug</code>, which Express uses) turns text like "2 days" into milliseconds:</p>
${ra(OUT['_t10/out/read-source'])}
<p>Line 52 answers every question about which inputs work: a number (optionally with a decimal point), optional spaces, and one of the listed unit words. "two days" does not match the pattern, so <code>parse</code> returns <code>undefined</code>. You learned the library's real contract in two minutes, from the one source that cannot be out of date. Good places to read code: the libraries you already use, the examples folder of a framework, and well-known small projects on GitHub.</p>
<table>
<thead><tr><th>Stuck? Try, in this order</th><th>Typical time</th></tr></thead>
<tbody>
<tr><td>Read the full error message and the line (Lesson 10.2)</td><td>1 minute</td></tr>
<tr><td>Print the values / set a breakpoint</td><td>5 minutes</td></tr>
<tr><td>Read the official docs for the function involved</td><td>5–10 minutes</td></tr>
<tr><td>Shrink to a minimal reproduction</td><td>15–30 minutes</td></tr>
<tr><td>Search the exact error message; read the library source or its issues</td><td>15 minutes</td></tr>
<tr><td>Ask a person (or a forum) with the full question</td><td>—</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Practice (45 minutes) — one bug, all the habits</strong></p>
<ol>
<li>Copy <code>big-app.mjs</code>. Reduce it step by step, saving each step as <code>repro-N.mjs</code>, until the bug shows in as few lines as possible. Then fix the app.</li>
<li>Open MDN's page for <code>Array.prototype.sort</code> and find the sentence that explains <code>[1, 10, 9]</code>. Copy it into a comment.</li>
<li>Write — but do not send — a full question about the bug using the five parts above, with the output of <code>env-info.mjs</code>.</li>
<li>In any project with <code>node_modules</code>, open one small package you depend on, find its main function, and write three sentences on how it works.</li>
<li>Write down one small project you will build next, and the 20% of it you do not know yet.</li>
</ol>
<p>Hint: <code>npm ls --depth=0</code> lists your direct dependencies; <code>cat node_modules/&lt;name&gt;/package.json</code> shows its <code>main</code> file.</p>
<p><strong>Done when:</strong> your smallest reproduction is under 10 lines and still shows the bug, the app prints the notes oldest first with 5 notes, and your question contains expected vs actual output and versions. Then Code Lab module 10.4.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tutorial hell</span><span class="v">vòng lặp chỉ xem hướng dẫn mà không tự làm được.</span></div>
  <div class="kv"><span class="k">minimal reproducible example</span><span class="v">ví dụ tái hiện tối thiểu.</span></div>
  <div class="kv"><span class="k">comparator</span><span class="v">hàm so sánh của sort.</span></div>
  <div class="kv"><span class="k">documentation / reference</span><span class="v">tài liệu / tài liệu tra cứu.</span></div>
  <div class="kv"><span class="k">expected vs actual</span><span class="v">mong đợi và thực tế.</span></div>
  <div class="kv"><span class="k">environment</span><span class="v">môi trường — phiên bản, hệ điều hành.</span></div>
  <div class="kv"><span class="k">source code</span><span class="v">mã nguồn.</span></div>
  <div class="kv"><span class="k">dependency</span><span class="v">gói phụ thuộc.</span></div>
  <div class="kv"><span class="k">issue tracker</span><span class="v">nơi báo lỗi của dự án.</span></div>
  <div class="kv"><span class="k">rubber duck</span><span class="v">giải thích thành tiếng để tự thấy lỗi.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Learn by building projects slightly beyond what you know — and finishing them.</li>
  <li>A bug that "works with my data" needs more varied data; shrink it to a minimal reproduction.</li>
  <li>Read the official docs first: MDN explains <code>[1, 10, 9]</code> and the comparator rule.</li>
  <li>A good question: clear title, minimal code, expected vs actual, what you tried, versions — no secrets.</li>
  <li>Libraries are code on your disk; reading the source gives the real contract.</li>
</ul>
${nguon('📗', 'MDN — Array.prototype.sort()', 'Default string comparison and the comparator contract', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort')}
${nguon('📘', 'Stack Overflow — How to create a Minimal, Reproducible Example', 'Minimal, complete and reproducible — with examples', 'https://stackoverflow.com/help/minimal-reproducible-example')}
${lienKet({ khoa: 'git', bai: 'git-15-4-dong-gop-ma-nguon-mo', title: 'Git 15.4 — Contributing to open source', sub: 'Reading a real project, issues, and your first pull request', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Khoá học kết thúc; việc học của bạn thì không</h2>
<p class="lead">Học xong bài này bạn tự tiến bộ được mà không cần khoá học: chọn dự án buộc bạn phải học, tìm câu trả lời trong tài liệu chính thức, thu một lỗi về bản tái hiện bé xíu, viết câu hỏi được trả lời, và đọc mã nguồn các thư viện bạn dùng. Những thói quen này sống lâu hơn mọi framework trong khoá — chúng là cách lập trình viên đi làm học công cụ mới mỗi năm.</p>

<h3>Bước 1 — dựng sản phẩm, đừng chỉ xem</h3>
<p>"Tutorial hell" là xem hết hướng dẫn này tới hướng dẫn khác, làm theo, rồi không tự bắt đầu được gì. Trong hướng dẫn mọi thứ đều chạy vì người ta đã gỡ sẵn mọi vấn đề. Bạn học vào đúng lúc bị kẹt — nên bạn cần dự án khiến mình bị kẹt.</p>
<table>
<thead><tr><th>Sau khoá này, hãy dựng…</th><th>Nó buộc bạn luyện</th></tr></thead>
<tbody>
<tr><td>Một trang cá nhân có form liên hệ gửi được thật</td><td>HTML/CSS, form, một route API nhỏ, kiểm dữ liệu (Ch2–6)</td></tr>
<tr><td>Một app ghi chú hoặc theo dõi thói quen có đăng nhập</td><td>phiên đăng nhập, CSDL, CRUD (Ch6–8)</td></tr>
<tr><td>Chính app đó, viết lại bằng TypeScript có kiểm thử</td><td>kiểu ở ranh giới, <code>node --test</code> (Ch9–10)</td></tr>
<tr><td>Một công cụ nhỏ cho lớp hay câu lạc bộ, có người dùng thật</td><td>báo lỗi, deploy, Git với người khác (Ch10)</td></tr>
</tbody>
</table>
<p>Quy tắc chung: khoảng 20% dự án nên là thứ bạn chưa biết. Ít hơn thì chán; nhiều hơn hẳn thì tê liệt.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chép mã mình không hiểu.</strong> Một đoạn mã từ diễn đàn hay trợ lý AI mà "chạy được" là khoản vay, không phải kiến thức: khi nó hỏng, bạn không sửa được. Trước khi giữ bất kỳ dòng chép nào, hãy nói được từng phần làm gì — hoặc thử xoá nó xem cái gì hỏng. Gõ lại các đoạn ngắn thay vì dán; nó buộc bạn phải đọc.</p></div>

<h3>Bước 2 — một lỗi trốn trong chương trình lớn</h3>
<p>Một app ghi chú cần liệt kê ghi chú cũ nhất trước:</p>
${ma('javascript', CODE['_t10/10-4/big-app.mjs'])}
${ra(OUT['_t10/out/big-app'])}
<p>Với đủ năm ghi chú, thứ tự rõ ràng sai. Lọc theo <code>study</code> thì trông đúng — hai ghi chú tình cờ đã đúng thứ tự sẵn. "Với dữ liệu thử của tôi thì chạy" chính là cách lỗi này tới tay người dùng. Dán cả 30 dòng và hỏi "sao thứ tự sai?" bắt mọi người đọc cả phần lọc, hiển thị và đếm — chẳng liên quan gì.</p>

<h3>Bước 3 — thu về bản tái hiện tối thiểu</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Sao chép, rồi xoá</span><span class="lz-d">Làm trên bản sao. Bỏ một phần (lọc, hiển thị, tóm tắt)…</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Vẫn hỏng?</span><span class="lz-d">Có ⇒ phần đó vô can; cứ để xoá. Không ⇒ đưa lại: lỗi nằm ở đó.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thay bằng dữ liệu đơn giản hơn</span><span class="lz-d">Object → chuỗi → số nhỏ.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Dừng ở bản nhỏ nhất</span><span class="lz-d">Ít dòng nhất mà vẫn làm lộ lỗi.</span></div>
</div>
${ma('javascript', CODE['_t10/10-4/repro-1.mjs'])}
${ma('javascript', CODE['_t10/10-4/repro-2.mjs'])}
${ra(OUT['_t10/out/repro'])}
<p>Bước 1 (chỉ còn ngày, không app) — vẫn sai. Bước 2 (ba con số) — vẫn sai: <code>[3, 1, 2]</code> trả về y nguyên. Lỗi không ở dữ liệu, ở ngày, hay ở app: nó là hàm so sánh <code>(a, b) => a > b</code>, trả về <code>true</code>/<code>false</code>. Hàm so sánh phải trả về số <em>âm</em>, <code>0</code>, hoặc số <em>dương</em>; <code>false</code> thành <code>0</code> ("bằng nhau, đừng di chuyển"), nên sort không bao giờ đưa thứ gì lên trước. Với <code>a - b</code> cho số và <code>localeCompare</code> cho chuỗi, nó chạy đúng. Rất thường xuyên, khi bản tái hiện đã nhỏ, bạn đã tự tìm ra lỗi.</p>

<h3>Bước 4 — đọc tài liệu trước khi đoán</h3>
${ma('javascript', CODE['_t10/10-4/docs.mjs'])}
${ra(OUT['_t10/out/docs'])}
<p><code>[10, 9, 1].sort()</code> cho <code>[1, 10, 9]</code>: không có hàm so sánh, <code>sort</code> đổi giá trị thành chuỗi và so từng ký tự, nên "10" đứng trước "9", và chữ hoa "C" trước "a". Điều này viết ngay những đoạn đầu trang <code>Array.prototype.sort</code> của MDN, cùng với luật hàm so sánh ở Bước 3.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">MDN Web Docs</span><span class="v">HTML, CSS, JavaScript và Web API — tài liệu tra cứu cho mọi thứ trong trình duyệt.</span></div>
  <div class="kv"><span class="k">Tài liệu chính thức</span><span class="v">nodejs.org/api, typescriptlang.org/docs, react.dev, prisma.io/docs — viết bởi chính người làm ra công cụ.</span></div>
  <div class="kv"><span class="k">Cách đọc</span><span class="v">Tìm: tham số, giá trị trả về, lỗi có thể ném, ví dụ, và "browser compatibility" hay "added in version".</span></div>
  <div class="kv"><span class="k">Kiểm phiên bản</span><span class="v">Một bài blog năm 2019 có thể mô tả API đã đổi. Tài liệu cho phiên bản <em>của bạn</em> mới đúng.</span></div>
</div>

<h3>Bước 5 — đặt câu hỏi người khác trả lời được</h3>
<p>Câu hỏi tốt nào cũng kèm môi trường. Một script in ra nó:</p>
${ma('javascript', CODE['_t10/10-4/env-info.mjs'])}
${ra(OUT['_t10/out/env-info'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Tiêu đề</span><span class="lz-t">gọi tên vấn đề</span><span class="lz-d">"Array.sort với (a, b) => a > b để nguyên [3, 1, 2]" — không phải "sort không chạy giúp với".</span></div>
<div class="lz-layer"><span class="lz-k">Mã</span><span class="lz-t">bản tái hiện tối thiểu</span><span class="lz-d">Dạng chữ, không phải ảnh chụp, để người khác chạy được.</span></div>
<div class="lz-layer"><span class="lz-k">Mong đợi và thực tế</span><span class="lz-t">cả hai, chính xác</span><span class="lz-d">"Mong [1, 2, 3], nhận [3, 1, 2]". Thông điệp lỗi đầy đủ, chép nguyên.</span></div>
<div class="lz-layer"><span class="lz-k">Đã thử</span><span class="lz-t">những gì đã loại trừ</span><span class="lz-d">"Với ngày và với số đều vậy; 2 phần tử thì đúng."</span></div>
<div class="lz-layer"><span class="lz-k">Môi trường</span><span class="lz-t">phiên bản</span><span class="lz-d">Node, trình duyệt, hệ điều hành, phiên bản thư viện (<code>npm ls &lt;gói&gt;</code>).</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — dán bí mật vào câu hỏi.</strong> Log lỗi và tệp cấu hình thường chứa khoá API, URL CSDL kèm mật khẩu, hoặc token. Diễn đàn, nơi báo lỗi và trợ lý chat đều lưu thứ bạn dán. Trước khi chia sẻ output nào, tìm trong đó <code>key</code>, <code>token</code>, <code>password</code>, <code>postgres://</code> và thay giá trị — bản tái hiện tối thiểu vốn cũng không cần chúng.</p></div>
<p>Và thử "chú vịt cao su" trước: giải thích vấn đề thành tiếng, từng dòng, như cho người không biết gì. Viết câu hỏi theo khuôn trên có cùng tác dụng — một phần lớn câu hỏi tự có lời giải trước khi được gửi.</p>

<h3>Bước 6 — đọc mã của người khác</h3>
<p>Thư viện không phải phép màu; chúng là mã như của bạn, và đã nằm sẵn trên đĩa trong <code>node_modules</code>. Gói <code>ms</code> (phụ thuộc của <code>debug</code>, gói mà Express dùng) đổi chữ như "2 days" thành mili giây:</p>
${ra(OUT['_t10/out/read-source'])}
<p>Dòng 52 trả lời mọi câu hỏi về đầu vào nào dùng được: một con số (có thể có dấu thập phân), khoảng trắng tuỳ ý, và một trong các từ đơn vị được liệt kê. "two days" không khớp mẫu, nên <code>parse</code> trả về <code>undefined</code>. Bạn học được hợp đồng thật của thư viện trong hai phút, từ nguồn duy nhất không thể lỗi thời. Chỗ tốt để đọc mã: các thư viện bạn đang dùng, thư mục examples của một framework, và các dự án nhỏ nổi tiếng trên GitHub.</p>
<table>
<thead><tr><th>Bị kẹt? Thử theo thứ tự này</th><th>Thời gian thường</th></tr></thead>
<tbody>
<tr><td>Đọc hết thông điệp lỗi và dòng (Bài 10.2)</td><td>1 phút</td></tr>
<tr><td>In giá trị / đặt breakpoint</td><td>5 phút</td></tr>
<tr><td>Đọc tài liệu chính thức của hàm liên quan</td><td>5–10 phút</td></tr>
<tr><td>Thu về bản tái hiện tối thiểu</td><td>15–30 phút</td></tr>
<tr><td>Tìm đúng thông điệp lỗi; đọc mã nguồn hoặc issue của thư viện</td><td>15 phút</td></tr>
<tr><td>Hỏi một người (hoặc diễn đàn) với câu hỏi đầy đủ</td><td>—</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Luyện tập (45 phút) — một lỗi, mọi thói quen</strong></p>
<ol>
<li>Chép <code>big-app.mjs</code>. Rút gọn từng bước, lưu mỗi bước thành <code>repro-N.mjs</code>, tới khi lỗi lộ ra trong ít dòng nhất có thể. Rồi sửa app.</li>
<li>Mở trang MDN của <code>Array.prototype.sort</code> và tìm câu giải thích <code>[1, 10, 9]</code>. Chép nó vào một chú thích.</li>
<li>Viết — nhưng không gửi — một câu hỏi đầy đủ về lỗi theo năm phần ở trên, kèm output của <code>env-info.mjs</code>.</li>
<li>Trong một dự án bất kỳ có <code>node_modules</code>, mở một gói nhỏ bạn phụ thuộc, tìm hàm chính của nó, và viết ba câu về cách nó hoạt động.</li>
<li>Ghi ra một dự án nhỏ bạn sẽ dựng tiếp theo, và 20% trong đó bạn chưa biết.</li>
</ol>
<p>Gợi ý: <code>npm ls --depth=0</code> liệt kê các gói phụ thuộc trực tiếp; <code>cat node_modules/&lt;tên&gt;/package.json</code> cho thấy tệp <code>main</code>.</p>
<p><strong>Xong khi:</strong> bản tái hiện nhỏ nhất dưới 10 dòng mà vẫn làm lộ lỗi, app in ghi chú cũ nhất trước với 5 ghi chú, và câu hỏi của bạn có output mong đợi và thực tế cùng các phiên bản. Sau đó làm module Code Lab 10.4.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tutorial hell</span><span class="v">vòng lặp chỉ xem hướng dẫn mà không tự làm được.</span></div>
  <div class="kv"><span class="k">minimal reproducible example</span><span class="v">ví dụ tái hiện tối thiểu.</span></div>
  <div class="kv"><span class="k">comparator</span><span class="v">hàm so sánh của sort.</span></div>
  <div class="kv"><span class="k">documentation / reference</span><span class="v">tài liệu / tài liệu tra cứu.</span></div>
  <div class="kv"><span class="k">expected vs actual</span><span class="v">mong đợi và thực tế.</span></div>
  <div class="kv"><span class="k">environment</span><span class="v">môi trường — phiên bản, hệ điều hành.</span></div>
  <div class="kv"><span class="k">source code</span><span class="v">mã nguồn.</span></div>
  <div class="kv"><span class="k">dependency</span><span class="v">gói phụ thuộc.</span></div>
  <div class="kv"><span class="k">issue tracker</span><span class="v">nơi báo lỗi của dự án.</span></div>
  <div class="kv"><span class="k">rubber duck</span><span class="v">giải thích thành tiếng để tự thấy lỗi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Học bằng cách dựng dự án vượt một chút những gì bạn biết — và làm cho xong.</li>
  <li>Lỗi "chạy với dữ liệu của tôi" cần dữ liệu đa dạng hơn; thu nó về bản tái hiện tối thiểu.</li>
  <li>Đọc tài liệu chính thức trước: MDN giải thích <code>[1, 10, 9]</code> và luật hàm so sánh.</li>
  <li>Câu hỏi tốt: tiêu đề rõ, mã tối thiểu, mong đợi và thực tế, những gì đã thử, phiên bản — không có bí mật.</li>
  <li>Thư viện là mã nằm trên đĩa bạn; đọc mã nguồn cho ra hợp đồng thật.</li>
</ul>
${nguon('📗', 'MDN — Array.prototype.sort()', 'So sánh chuỗi mặc định và hợp đồng của hàm so sánh', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort')}
${nguon('📘', 'Stack Overflow — How to create a Minimal, Reproducible Example', 'Tối thiểu, đầy đủ và tái hiện được — kèm ví dụ', 'https://stackoverflow.com/help/minimal-reproducible-example')}
${lienKet({ khoa: 'git', bai: 'git-15-4-dong-gop-ma-nguon-mo', title: 'Git 15.4 — Đóng góp mã nguồn mở', sub: 'Đọc một dự án thật, issue, và pull request đầu tiên của bạn', cta: 'Mở bài' })}
</div>
`,
};
