/**
 * Bài 0.1 — Khoá này cho ai & lộ trình toàn khoá (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs
 * (Chromium thật: _demo/0-1 — ba trang HTML/CSS/JS có ảnh chụp, trang lộ "khoá bí mật").
 * Deck: scripts/slides-src/wf-0-1.mjs (10 slide, WF/v1/wf-0-1). Giữ video YouTube cũ.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-0-1', 'Start here: the map of the course', 'Bắt đầu: bản đồ toàn khoá', [
  [1, 'Start here',
    '<p>This first lesson answers three questions before you write any real code: what web development actually is, what you will be able to build at the end of each chapter, and how to study so that the knowledge stays. Everything on these slides was run in a real browser.</p>',
    '<p>Bài đầu tiên trả lời ba câu hỏi trước khi bạn viết dòng mã thật nào: lập trình web thực ra là gì, học xong mỗi chương bạn làm được gì, và học thế nào để kiến thức ở lại. Mọi thứ trên các slide này đều đã chạy thật trong trình duyệt.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five concrete outcomes. The most important is the fourth: knowing that anything in the browser is public changes how you design every feature later — where data lives, where passwords are checked, where secret keys are kept.</p>',
    '<p>Năm kết quả cụ thể. Quan trọng nhất là điều thứ tư: biết rằng mọi thứ trong trình duyệt đều công khai sẽ thay đổi cách bạn thiết kế mọi tính năng về sau — dữ liệu nằm ở đâu, mật khẩu được kiểm ở đâu, khoá bí mật được giữ ở đâu.</p>'],
  [3, 'Why framework courses feel impossible',
    '<p>A Node.js or Next.js course silently assumes a stack of knowledge: HTML, CSS, JavaScript, HTTP, cookies, APIs, SQL. When one layer is missing, the course looks like magic. This course fills exactly those layers, from zero, in the order they depend on each other.</p>',
    '<p>Một khoá Node.js hay Next.js ngầm mặc định cả một chồng kiến thức: HTML, CSS, JavaScript, HTTP, cookie, API, SQL. Thiếu một tầng là khoá học trông như phép thuật. Khoá này lấp đúng những tầng đó, từ số 0, theo đúng thứ tự chúng phụ thuộc nhau.</p>'],
  [4, 'One page, three languages',
    '<p>The same page three times, screenshotted in Chromium. HTML alone gives structure: a heading, a paragraph, a button. CSS adds colours, spacing and fonts. JavaScript makes the button do something — it counted three clicks. Every web page you will ever build is these three layers.</p>',
    '<p>Cùng một trang ba lần, chụp trong Chromium. Chỉ HTML cho ra cấu trúc: tiêu đề, đoạn văn, nút bấm. CSS thêm màu, khoảng cách, phông chữ. JavaScript làm cái nút có tác dụng — nó đếm được ba lần bấm. Mọi trang web bạn sẽ làm đều gồm ba lớp này.</p>'],
  [5, 'What JavaScript adds',
    '<p>Six lines of JavaScript: find the button, listen for a click, add one, update the text. The console lines are the real output. Notice what happens when you reload: the count goes back to zero, because the browser forgets everything. Remembering needs a server and a database.</p>',
    '<p>Sáu dòng JavaScript: tìm cái nút, nghe sự kiện bấm, cộng một, cập nhật chữ. Các dòng console là output thật. Để ý chuyện xảy ra khi bạn tải lại trang: số đếm về 0, vì trình duyệt quên sạch. Muốn nhớ thì cần máy chủ và cơ sở dữ liệu.</p>'],
  [6, 'The four layers of every web app',
    '<p>Browser, network, server, database. The browser shows things, the network carries requests and responses, the server makes decisions and keeps secrets, the database remembers. Every chapter of this course lives in one of these layers — the roadmap slide labels each one.</p>',
    '<p>Trình duyệt, mạng, máy chủ, cơ sở dữ liệu. Trình duyệt hiển thị, mạng chở request và response, máy chủ ra quyết định và giữ bí mật, cơ sở dữ liệu ghi nhớ. Mỗi chương của khoá nằm ở một trong bốn tầng này — slide lộ trình ghi rõ chương nào thuộc tầng nào.</p>'],
  [7, 'The browser is public',
    '<p>A "secret" key written into front-end code, and a second script that finds it in one line — exactly what any visitor can do with View Source. This is why passwords are checked on the server and why API keys never go into a page. You will meet this rule again in Chapters 7 and 14.</p>',
    '<p>Một "khoá bí mật" viết thẳng vào mã front-end, và một script thứ hai tìm ra nó chỉ bằng một dòng — đúng việc bất kỳ người xem nào cũng làm được bằng View Source. Đó là lý do mật khẩu được kiểm ở máy chủ và khoá API không bao giờ nằm trong trang. Bạn sẽ gặp lại luật này ở Chương 7 và 14.</p>'],
  [8, 'The roadmap: 15 chapters',
    '<p>Chapters 0 to 5 are the foundation shared by Node.js and Next.js. Chapters 6 to 8 connect the browser to a server and a database. Chapters 9 and 10 make you work like a professional. Chapters 11 to 14 go deeper: advanced JavaScript and CSS, testing and shipping.</p>',
    '<p>Chương 0 tới 5 là nền tảng chung cho cả Node.js lẫn Next.js. Chương 6 tới 8 nối trình duyệt với máy chủ và cơ sở dữ liệu. Chương 9 và 10 giúp bạn làm việc như người chuyên nghiệp. Chương 11 tới 14 đi sâu hơn: JavaScript và CSS nâng cao, kiểm thử và đưa lên mạng.</p>'],
  [9, 'How each lesson works',
    '<p>Every lesson has the same shape: slides with a short explanation, a written lesson where every output is real, traps that beginners fall into, a practice task with a clear "Done when", Code Lab exercises graded in your browser, and a chapter quiz with a review sheet.</p>',
    '<p>Mọi bài có cùng một khuôn: slide kèm lời giảng ngắn, bài đọc mà mọi output đều chạy thật, các bẫy người mới hay mắc, một bài luyện có "Xong khi" rõ ràng, bài tập Code Lab chấm ngay trong trình duyệt, và bài kiểm tra cuối chương kèm tờ ôn.</p>'],
  [10, 'Summary & practice',
    '<p>Your first practice is small on purpose: build the three-layer page yourself, put your own name in it, click the button, and read the console. The "Done when" is measurable — three clicks, three console lines — so you know for certain that your setup works.</p>',
    '<p>Bài luyện đầu tiên cố ý nhỏ: tự dựng trang ba lớp, ghi tên của bạn vào, bấm nút và đọc console. Phần "Xong khi" đo được — ba lần bấm, ba dòng console — để bạn biết chắc máy của mình đã chạy được.</p>'],
]);

export default {
  title: '0.1 — Who this course is for & the full roadmap|||0.1 — Khoá này cho ai & lộ trình toàn khoá',
  slug: 'wf-0-1-gioi-thieu-lo-trinh',
  type: 'VIDEO',
  isFreePreview: true,
  // "100+ Web Development Things you Should Know" — Fireship (tổng quan nghề web).
  video: { url: 'https://youtu.be/erEgovG9WBs', durationSeconds: 0 },
  description: 'Vì sao người mới hay "học Node.js/Next.js mà chả hiểu gì"; một trang = HTML + CSS + JavaScript (ba trang chạy thật, có ảnh chụp); bốn tầng của mọi ứng dụng web; trình duyệt là nơi công khai (tìm ra khoá bí mật trong một dòng); bản đồ 15 chương và chương nào mở khoá học nào; khuôn một bài; kế hoạch học thực tế.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Start here — what web development is, and the map of the whole course</h2>
<p class="lead">After this lesson you can say in one sentence what HTML, CSS and JavaScript each do — and you will have seen all three on a real page; you can draw the four layers that every web application is made of; you know why nothing in the browser can be kept secret; and you know what each of the 15 chapters lets you build and which course it leads to next. You need this map because the most common reason beginners quit is not difficulty — it is not knowing where they are, what the current lesson is for, and how far is left.</p>

<h3>Why Node.js and Next.js courses feel impossible at first</h3>
<p>If you have ever opened a Node.js or Next.js course and felt lost within ten minutes, it is usually <strong>not because you are slow</strong>. Those courses quietly assume you already know a whole stack of things: how to write HTML, how CSS lays out a page, how JavaScript reacts to a click, what happens when a browser talks to a server, what an API, a status code and a cookie are, how data is stored in tables. When one of those layers is missing, the lesson looks like magic, and you end up copying code you cannot change.</p>
<p>Learning a framework first is like learning to drive in a Formula 1 car. You can copy what the instructor does, but the moment something breaks you have no idea why. This course teaches the road first — the engine, the gears, the brakes — in the order they depend on each other. After it, most of what a framework does feels like "oh, that is just X with a nicer name".</p>

<h3>Step 1 — a web page is three languages working together</h3>
<p>Every page you have ever visited is built from three languages, each with one job. Here is the same small page three times. First, <strong>HTML only</strong>:</p>
${ma('html', CODE['0-1/lop-1-html.html'], [8, 13])}
<p>HTML (HyperText Markup Language) describes <em>what each piece is</em>: this is a heading (<code>h1</code>), this is a paragraph (<code>p</code>), this is a button. Opened in Chromium, it shows plain black text and a grey default button — structure, no style (screenshot on slide 4). Next, the same HTML <strong>plus CSS</strong>:</p>
${ma('html', CODE['0-1/lop-2-css.html'], [7, 13])}
<p>CSS (Cascading Style Sheets) says <em>how things look</em>: the background colour, the blue heading, the rounded button. Nothing new is on the page — the same four elements are just dressed differently. Finally, <strong>plus JavaScript</strong>:</p>
${ma('html', CODE['0-1/lop-3-js.html'], [20, 33])}
${ra(OUT['0-1/lop-3-js'])}
<p>JavaScript makes the page <em>do</em> things. These lines find the button, wait for a click, add one to a counter and rewrite the text. The demo clicks three times by itself, so the screenshot shows "3 likes" and the console printed three lines — that output above is exactly what Chromium printed.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">HTML</span><span class="v">The structure — like the walls and rooms of a house. Chapter 2.</span></div>
  <div class="kv"><span class="k">CSS</span><span class="v">The appearance — the paint, furniture, lighting. Chapter 3 (and 12).</span></div>
  <div class="kv"><span class="k">JavaScript</span><span class="v">The behaviour — the electricity: switches that make things happen. Chapters 4, 5 and 11.</span></div>
</div>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The browser reads the HTML</span><span class="lz-d">It builds a tree of elements: heading, paragraph, button, paragraph.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It applies the CSS</span><span class="lz-d">Every element gets its colours, sizes and positions, then the page is painted.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">It runs the JavaScript</span><span class="lz-d">The script attaches a click listener and waits.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">You click</span><span class="lz-d">The listener runs, changes the text, and the browser repaints only what changed.</span></div>
</div>

<h3>Step 2 — the four layers of every web application</h3>
<p>Try this in your head: you click "Like" three times, then press reload. What does the counter show? <strong>Zero.</strong> The variable <code>likes</code> lived inside one browser tab, and reloading threw it away. A real "Like" button has to send the click somewhere that remembers it, for everyone, forever. That is why real applications have more than one layer:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Browser (client)</span><span class="lz-t">HTML, CSS, JavaScript</span><span class="lz-d">What the user sees and clicks. It runs on <em>their</em> machine, which you do not control — so it can never be trusted with secrets or final decisions. Chapters 2–5, 11–12.</span></div>
<div class="lz-layer"><span class="lz-k">Network</span><span class="lz-t">HTTP requests and responses</span><span class="lz-d">Every interaction is a request going out and a response coming back. Lesson 0.2 shows one, Chapter 6 takes it apart. Many bugs you will chase live here.</span></div>
<div class="lz-layer"><span class="lz-k">Server (backend)</span><span class="lz-t">Node.js — your own code</span><span class="lz-d">Runs on a machine you control. It checks passwords, decides who may do what, and is the only place secrets may live. Chapters 6–7.</span></div>
<div class="lz-layer"><span class="lz-k">Database</span><span class="lz-t">SQL, tables, rows</span><span class="lz-d">The only layer that remembers after the request ends — the like count, the users, the orders. Chapter 8.</span></div>
</div>
<p>The words you will hear for these: the browser side is the <strong>frontend</strong> (or <em>client</em>); the server plus database is the <strong>backend</strong>; a developer who can do both is <strong>full-stack</strong>. Chapter 10 closes the course's first part by drawing one feature through all four layers.</p>

<h3>Step 3 — anything in the browser is public</h3>
<p>Because the browser runs on the visitor's machine, every line of HTML, CSS and JavaScript you send is <em>downloaded</em> to them. They can read it. Here is a shop page whose author put a payment key into the front-end code, and a second script doing what any visitor can do:</p>
${ma('html', CODE['0-1/bi-mat.html'], [6, 16])}
${ra(OUT['0-1/bi-mat'])}
<p>One line of JavaScript found the key. A visitor would not even need that: right-click → <strong>View Page Source</strong>, or DevTools → <strong>Sources</strong>, shows the same text. Minified or "hidden" code changes nothing; it is still delivered to the visitor.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "nobody will look at my JavaScript".</strong> Automated scripts scan public websites and code repositories for keys all day; a leaked payment or AI key is usually abused within hours, and the bill goes to the owner. The rule is simple and has no exceptions: <strong>secrets and final decisions live on the server</strong>. The browser may hide a button from non-admins for convenience, but the server must still refuse the action. Chapter 7 (auth) and Lesson 14.2 (environment variables and secrets) build exactly this.</p></div>

<h3>The roadmap — 15 chapters and what each one unlocks</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">0–5</span><span class="lz-t">Foundation</span><span class="lz-d">How the web works, your tools, HTML, CSS, JavaScript, asynchronous JavaScript. Needed by every later course.</span></div>
<div class="lz-step"><span class="lz-k">6–8</span><span class="lz-t">Browser ↔ server ↔ data</span><span class="lz-d">HTTP and APIs, login and security, SQL databases. The bridge to backend work.</span></div>
<div class="lz-step"><span class="lz-k">9–10</span><span class="lz-t">Working like a professional</span><span class="lz-d">TypeScript, thinking and debugging, the Git workflow of a team.</span></div>
<div class="lz-step"><span class="lz-k">11–14</span><span class="lz-t">Going deeper</span><span class="lz-d">Advanced JavaScript and CSS, automated tests, building and deploying a real site.</span></div>
</div>
<table>
<thead><tr><th>Chapter</th><th>You learn</th><th>After it you can</th><th>Layer</th></tr></thead>
<tbody>
<tr><td>0</td><td>How the web works, setup, how to study</td><td>Explain what happens when you type an address; have a working machine</td><td>all</td></tr>
<tr><td>1</td><td>Terminal, VS Code, Git, GitHub, Node &amp; npm</td><td>Create a project, save its history, publish it on GitHub</td><td>tools</td></tr>
<tr><td>2</td><td>HTML</td><td>Write a correct, accessible page with links, images, forms and tables</td><td>browser</td></tr>
<tr><td>3</td><td>CSS and responsive design</td><td>Lay out a page with Flexbox and Grid that works on a phone</td><td>browser</td></tr>
<tr><td>4</td><td>JavaScript fundamentals</td><td>Write logic and make a page react to clicks and typing</td><td>browser</td></tr>
<tr><td>5</td><td>Asynchronous JavaScript, fetch, modules</td><td>Load real data from an API without freezing the page</td><td>browser ↔ network</td></tr>
<tr><td>6</td><td>HTTP and REST APIs</td><td>Read and design requests: methods, status codes, headers, JSON</td><td>network</td></tr>
<tr><td>7</td><td>Auth and security</td><td>Explain sessions, cookies, JWT, password hashing, HTTPS and CORS</td><td>server</td></tr>
<tr><td>8</td><td>Data and SQL</td><td>Query and change data, join tables, use an ORM</td><td>database</td></tr>
<tr><td>9</td><td>TypeScript basics</td><td>Read and write typed code that catches mistakes before running</td><td>all</td></tr>
<tr><td>10</td><td>Thinking, debugging, Git workflow</td><td>Break down problems, read errors, work on a branch with pull requests</td><td>all</td></tr>
<tr><td>11–12</td><td>Advanced JavaScript and CSS</td><td>Understand closures, <code>this</code>, prototypes; stacking, animation, CSS architecture</td><td>browser</td></tr>
<tr><td>13</td><td>Testing</td><td>Write unit and component tests, run them on every push</td><td>all</td></tr>
<tr><td>14</td><td>Shipping it</td><td>Build, configure secrets, deploy, measure performance</td><td>all</td></tr>
</tbody>
</table>
<p>After Chapter 8 you are ready for the <strong>Node.js</strong> course (backend). After Chapters 4–5 and 9 the <strong>React</strong> and <strong>Next.js</strong> courses become readable. Chapters 11–14 are worth finishing before your first job interview.</p>

<h3>How every lesson is built — and how to use each part</h3>
<ol>
<li><strong>📑 Slides</strong> with a short explanation under each one. Skim them first to see the shape of the lesson; come back to them to revise.</li>
<li><strong>📖 The written lesson.</strong> Every code block is a real file and every grey output block is what a real browser or tool printed — nothing is invented. Type the examples yourself.</li>
<li><strong>Traps</strong> (the red boxes) are the mistakes beginners actually make. Read them twice; they save the most time.</li>
<li><strong>🧪 Practice</strong> with a "Done when" line. "Done when" is a check you can measure, so you know you are finished instead of hoping.</li>
<li><strong>Code Lab</strong> exercises (from Chapter 1) are graded right in your browser.</li>
<li><strong>The chapter quiz</strong> comes with a review sheet; do the sheet first, then the quiz.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Trap — learning by watching instead of by typing.</strong> A tutorial video feels productive precisely because it removes the part that teaches: getting stuck. You watch someone build a to-do app in forty minutes, feel that you understood it, and cannot write a single line the next day — because you practised <em>recognising</em> code, not <em>producing</em> it. The cure is uncomfortable and cheap: after every lesson, close the page and rebuild the example from memory. You will fail, look something up, and that lookup is what sticks.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — skipping a chapter because "I already know HTML".</strong> Maybe you do. Prove it in five minutes: open the chapter's quiz and its review sheet first. If you score well, move on with a clear conscience. If not, the gaps are exactly where the next chapters will hurt — a page that "does not apply my CSS" is usually an HTML structure problem from Chapter 2.</p></div>

<h3>A realistic plan</h3>
<p>The course has about a hundred lessons. A content lesson with its practice takes most people 45–90 minutes; a quiz takes 15–20. That adds up to roughly <strong>90–110 hours</strong>. These are estimates — your pace will vary, and that is fine.</p>
<table>
<thead><tr><th>Time per day</th><th>Chapters 0–10 (the foundation)</th><th>The whole course</th></tr></thead>
<tbody>
<tr><td>30 minutes</td><td>about 4 months</td><td>about 6–7 months</td></tr>
<tr><td>1 hour</td><td>about 2 months</td><td>about 3–4 months</td></tr>
<tr><td>2 hours</td><td>about 5 weeks</td><td>about 7–8 weeks</td></tr>
</tbody>
</table>
<p>One hour every day beats seven hours on Sunday: your brain consolidates a skill <em>between</em> sessions, which is why Lesson 0.4 builds the habit around short, regular practice and spaced review.</p>

<div class="callout ok">
<p><strong>🧪 Practice (15 minutes) — your first three-layer page</strong></p>
<ol>
<li>Create a folder <code>my-first-page</code> on your computer and inside it a file <code>index.html</code>.</li>
<li>Type (do not paste) the three-layer page from Step 1: the HTML, the <code>style</code> block, the <code>script</code> block. Replace "Linh" with your name. Delete the line that clicks three times by itself.</li>
<li>Double-click the file to open it in Chrome or Firefox. Press <strong>F12</strong> (or right-click → Inspect) and open the <strong>Console</strong> tab.</li>
<li>Write in a note: which day and time you will study each week, and the date you plan to finish Chapter 0.</li>
</ol>
<p>Hint: if the button does nothing, check that the <code>script</code> block comes <em>after</em> the button in the file — Lesson 4.5 explains why order matters.</p>
<p><strong>Done when:</strong> the page shows your name; clicking the button three times shows "3 likes"; the Console shows three lines <code>clicked, likes = 1</code>, <code>2</code>, <code>3</code>; and after a reload the count is back to 0 (you can now say why). Your study slot is written down.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">web page</span><span class="v">trang web — một tài liệu HTML trình duyệt hiển thị.</span></div>
  <div class="kv"><span class="k">browser / client</span><span class="v">trình duyệt / máy khách — bên hỏi và hiển thị.</span></div>
  <div class="kv"><span class="k">server</span><span class="v">máy chủ — bên trả lời request, giữ bí mật.</span></div>
  <div class="kv"><span class="k">HTML</span><span class="v">ngôn ngữ đánh dấu — cấu trúc của trang.</span></div>
  <div class="kv"><span class="k">CSS</span><span class="v">bảng định kiểu — giao diện của trang.</span></div>
  <div class="kv"><span class="k">JavaScript</span><span class="v">ngôn ngữ lập trình của trình duyệt — hành vi của trang.</span></div>
  <div class="kv"><span class="k">frontend / backend</span><span class="v">phần chạy ở trình duyệt / phần chạy ở máy chủ (+ cơ sở dữ liệu).</span></div>
  <div class="kv"><span class="k">full-stack</span><span class="v">làm được cả frontend lẫn backend.</span></div>
  <div class="kv"><span class="k">database</span><span class="v">cơ sở dữ liệu — tầng duy nhất ghi nhớ lâu dài.</span></div>
  <div class="kv"><span class="k">DevTools / Console</span><span class="v">công cụ nhà phát triển của trình duyệt / thẻ hiện thông điệp và lỗi JavaScript.</span></div>
  <div class="kv"><span class="k">framework</span><span class="v">khung làm việc — thư viện lớn quy định cách viết app (React, Next.js).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Framework courses assume a stack of basics; this course builds that stack from zero, in dependency order.</li>
  <li>A page is three languages: HTML = structure, CSS = appearance, JavaScript = behaviour.</li>
  <li>A web app has four layers: browser, network, server, database. The browser forgets on reload; the database remembers.</li>
  <li>Everything sent to the browser is public — secrets and final decisions belong on the server.</li>
  <li>Chapters 0–5 foundation, 6–8 server and data, 9–10 professional habits, 11–14 deeper skills.</li>
  <li>Type every example, do the practice until "Done when" is true, study a little every day.</li>
</ul>
${nguon('📗', 'MDN — Learn web development', 'The free, official-quality curriculum this course uses as its reference', 'https://developer.mozilla.org/en-US/docs/Learn_web_development')}
${nguon('🗺️', 'roadmap.sh — Frontend and Backend roadmaps', 'A visual map of what comes after the foundation', 'https://roadmap.sh/frontend')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-0-1-gioi-thieu', title: 'Node.js 0.1 — where this course leads', sub: 'The backend course that assumes Chapters 0–8 of this one', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bắt đầu tại đây — lập trình web là gì, và bản đồ của cả khoá</h2>
<p class="lead">Học xong bài này bạn nói được trong một câu HTML, CSS và JavaScript mỗi thứ làm gì — và đã tận mắt thấy cả ba trên một trang thật; bạn vẽ được bốn tầng mà mọi ứng dụng web đều có; bạn hiểu vì sao không gì trong trình duyệt giữ bí mật được; và bạn biết mỗi chương trong 15 chương giúp bạn làm được gì, dẫn sang khoá nào tiếp theo. Bạn cần tấm bản đồ này vì lý do phổ biến nhất khiến người mới bỏ cuộc không phải là khó — mà là không biết mình đang ở đâu, bài hiện tại để làm gì, và còn bao xa nữa.</p>

<h3>Vì sao khoá Node.js và Next.js thoạt đầu có vẻ bất khả</h3>
<p>Nếu bạn từng mở một khoá Node.js hay Next.js và thấy lạc lối sau mười phút, thường <strong>không phải vì bạn chậm</strong>. Những khoá đó ngầm mặc định bạn đã biết cả một chồng thứ: viết HTML thế nào, CSS bố trí trang ra sao, JavaScript phản ứng với một cú bấm thế nào, chuyện gì xảy ra khi trình duyệt nói chuyện với máy chủ, API, mã trạng thái và cookie là gì, dữ liệu được lưu trong bảng ra sao. Thiếu một tầng là bài học trông như phép thuật, và bạn kết thúc bằng việc chép mã mà không sửa nổi.</p>
<p>Học framework trước giống như tập lái trên một chiếc xe đua F1. Bạn bắt chước được thầy, nhưng hễ có gì hỏng là không biết vì sao. Khoá này dạy con đường trước — động cơ, hộp số, phanh — theo đúng thứ tự chúng phụ thuộc nhau. Học xong, phần lớn những gì framework làm sẽ khiến bạn thấy "à, hoá ra chỉ là X với cái tên đẹp hơn".</p>

<h3>Bước 1 — một trang web là ba ngôn ngữ cùng làm việc</h3>
<p>Mọi trang bạn từng xem đều dựng từ ba ngôn ngữ, mỗi thứ một việc. Đây là cùng một trang nhỏ ba lần. Đầu tiên, <strong>chỉ HTML</strong>:</p>
${ma('html', CODE['0-1/lop-1-html.html'], [8, 13])}
<p>HTML (HyperText Markup Language — ngôn ngữ đánh dấu siêu văn bản) mô tả <em>mỗi mẩu là gì</em>: đây là tiêu đề (<code>h1</code>), đây là đoạn văn (<code>p</code>), đây là nút bấm. Mở trong Chromium, nó hiện chữ đen trơn và một nút xám mặc định — có cấu trúc, chưa có kiểu (ảnh chụp ở slide 4). Tiếp theo, cùng HTML đó <strong>thêm CSS</strong>:</p>
${ma('html', CODE['0-1/lop-2-css.html'], [7, 13])}
<p>CSS (Cascading Style Sheets — bảng định kiểu xếp tầng) nói <em>mọi thứ trông ra sao</em>: màu nền, tiêu đề xanh, nút bo góc. Trên trang không có gì mới — vẫn bốn phần tử đó, chỉ là được "mặc áo" khác. Cuối cùng, <strong>thêm JavaScript</strong>:</p>
${ma('html', CODE['0-1/lop-3-js.html'], [20, 33])}
${ra(OUT['0-1/lop-3-js'])}
<p>JavaScript làm trang <em>làm được việc</em>. Mấy dòng này tìm cái nút, chờ một cú bấm, cộng một vào bộ đếm rồi viết lại dòng chữ. Bản demo tự bấm ba lần, nên ảnh chụp hiện "3 likes" và console in ba dòng — output ở trên đúng là thứ Chromium đã in.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">HTML</span><span class="v">Cấu trúc — như tường và các phòng của ngôi nhà. Chương 2.</span></div>
  <div class="kv"><span class="k">CSS</span><span class="v">Giao diện — sơn, đồ đạc, ánh sáng. Chương 3 (và 12).</span></div>
  <div class="kv"><span class="k">JavaScript</span><span class="v">Hành vi — hệ thống điện: công tắc làm mọi thứ hoạt động. Chương 4, 5 và 11.</span></div>
</div>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Trình duyệt đọc HTML</span><span class="lz-d">Nó dựng một cây phần tử: tiêu đề, đoạn văn, nút, đoạn văn.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó áp CSS</span><span class="lz-d">Mỗi phần tử nhận màu, kích thước, vị trí, rồi trang được vẽ ra.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nó chạy JavaScript</span><span class="lz-d">Script gắn một bộ nghe sự kiện bấm rồi chờ.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Bạn bấm</span><span class="lz-d">Bộ nghe chạy, đổi dòng chữ, và trình duyệt chỉ vẽ lại phần thay đổi.</span></div>
</div>

<h3>Bước 2 — bốn tầng của mọi ứng dụng web</h3>
<p>Thử nghĩ: bạn bấm "Like" ba lần rồi tải lại trang. Bộ đếm hiện gì? <strong>Số 0.</strong> Biến <code>likes</code> chỉ sống trong một thẻ trình duyệt, và tải lại là vứt nó đi. Một nút "Like" thật phải gửi cú bấm tới một nơi biết nhớ, cho mọi người, mãi mãi. Vì vậy ứng dụng thật có nhiều hơn một tầng:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Trình duyệt (client)</span><span class="lz-t">HTML, CSS, JavaScript</span><span class="lz-d">Thứ người dùng thấy và bấm. Nó chạy trên máy <em>của họ</em>, thứ bạn không kiểm soát — nên không bao giờ được giao bí mật hay quyết định cuối cùng. Chương 2–5, 11–12.</span></div>
<div class="lz-layer"><span class="lz-k">Mạng</span><span class="lz-t">Request và response HTTP</span><span class="lz-d">Mọi tương tác là một request đi ra và một response trở về. Bài 0.2 cho xem một cái, Chương 6 mổ xẻ nó. Nhiều lỗi bạn sẽ truy đuổi nằm ở đây.</span></div>
<div class="lz-layer"><span class="lz-k">Máy chủ (backend)</span><span class="lz-t">Node.js — mã của chính bạn</span><span class="lz-d">Chạy trên máy bạn kiểm soát. Nó kiểm mật khẩu, quyết định ai được làm gì, và là nơi duy nhất bí mật được phép sống. Chương 6–7.</span></div>
<div class="lz-layer"><span class="lz-k">Cơ sở dữ liệu</span><span class="lz-t">SQL, bảng, dòng</span><span class="lz-d">Tầng duy nhất còn nhớ sau khi request kết thúc — số like, người dùng, đơn hàng. Chương 8.</span></div>
</div>
<p>Những từ bạn sẽ nghe cho các tầng này: phía trình duyệt là <strong>frontend</strong> (hay <em>client</em>); máy chủ cộng cơ sở dữ liệu là <strong>backend</strong>; người làm được cả hai là <strong>full-stack</strong>. Chương 10 khép lại phần đầu của khoá bằng cách kéo một tính năng đi xuyên qua cả bốn tầng.</p>

<h3>Bước 3 — mọi thứ trong trình duyệt đều công khai</h3>
<p>Vì trình duyệt chạy trên máy người xem, từng dòng HTML, CSS, JavaScript bạn gửi đi đều được <em>tải về</em> máy họ. Họ đọc được. Đây là một trang bán hàng mà tác giả đã đặt khoá thanh toán vào mã front-end, cùng một script thứ hai làm đúng việc bất kỳ người xem nào cũng làm được:</p>
${ma('html', CODE['0-1/bi-mat.html'], [6, 16])}
${ra(OUT['0-1/bi-mat'])}
<p>Một dòng JavaScript đã tìm ra khoá. Người xem thậm chí không cần đến nó: chuột phải → <strong>View Page Source</strong>, hoặc DevTools → <strong>Sources</strong>, hiện y nguyên đoạn chữ đó. Mã đã nén hay "giấu" cũng không thay đổi gì; nó vẫn được giao tận tay người xem.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "chẳng ai đọc JavaScript của mình đâu".</strong> Các script tự động quét website và kho mã công khai suốt ngày để tìm khoá; một khoá thanh toán hay khoá AI bị lộ thường bị lạm dụng trong vài giờ, và hoá đơn gửi về chủ của nó. Luật rất đơn giản và không có ngoại lệ: <strong>bí mật và quyết định cuối cùng nằm ở máy chủ</strong>. Trình duyệt có thể ẩn một nút với người không phải admin cho tiện, nhưng máy chủ vẫn phải từ chối hành động đó. Chương 7 (xác thực) và Bài 14.2 (biến môi trường và bí mật) dựng đúng điều này.</p></div>

<h3>Lộ trình — 15 chương và mỗi chương mở khoá điều gì</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">0–5</span><span class="lz-t">Nền móng</span><span class="lz-d">Web hoạt động thế nào, công cụ, HTML, CSS, JavaScript, JavaScript bất đồng bộ. Khoá nào về sau cũng cần.</span></div>
<div class="lz-step"><span class="lz-k">6–8</span><span class="lz-t">Trình duyệt ↔ máy chủ ↔ dữ liệu</span><span class="lz-d">HTTP và API, đăng nhập và bảo mật, cơ sở dữ liệu SQL. Cây cầu sang backend.</span></div>
<div class="lz-step"><span class="lz-k">9–10</span><span class="lz-t">Làm việc như người chuyên nghiệp</span><span class="lz-d">TypeScript, tư duy và gỡ lỗi, quy trình Git của một nhóm.</span></div>
<div class="lz-step"><span class="lz-k">11–14</span><span class="lz-t">Đi sâu hơn</span><span class="lz-d">JavaScript và CSS nâng cao, kiểm thử tự động, dựng và đưa một trang thật lên mạng.</span></div>
</div>
<table>
<thead><tr><th>Chương</th><th>Bạn học</th><th>Học xong bạn làm được</th><th>Tầng</th></tr></thead>
<tbody>
<tr><td>0</td><td>Web hoạt động thế nào, cài máy, cách học</td><td>Giải thích chuyện gì xảy ra khi gõ một địa chỉ; có một máy chạy được</td><td>cả bốn</td></tr>
<tr><td>1</td><td>Terminal, VS Code, Git, GitHub, Node &amp; npm</td><td>Tạo dự án, lưu lịch sử, đưa nó lên GitHub</td><td>công cụ</td></tr>
<tr><td>2</td><td>HTML</td><td>Viết trang đúng chuẩn, dễ tiếp cận, có liên kết, ảnh, biểu mẫu, bảng</td><td>trình duyệt</td></tr>
<tr><td>3</td><td>CSS và responsive</td><td>Bố trí trang bằng Flexbox và Grid, chạy tốt trên điện thoại</td><td>trình duyệt</td></tr>
<tr><td>4</td><td>JavaScript nền tảng</td><td>Viết logic và làm trang phản ứng với cú bấm, phím gõ</td><td>trình duyệt</td></tr>
<tr><td>5</td><td>JavaScript bất đồng bộ, fetch, module</td><td>Tải dữ liệu thật từ API mà không làm treo trang</td><td>trình duyệt ↔ mạng</td></tr>
<tr><td>6</td><td>HTTP và REST API</td><td>Đọc và thiết kế request: method, mã trạng thái, header, JSON</td><td>mạng</td></tr>
<tr><td>7</td><td>Xác thực và bảo mật</td><td>Giải thích session, cookie, JWT, băm mật khẩu, HTTPS và CORS</td><td>máy chủ</td></tr>
<tr><td>8</td><td>Dữ liệu và SQL</td><td>Truy vấn và thay đổi dữ liệu, nối bảng, dùng ORM</td><td>cơ sở dữ liệu</td></tr>
<tr><td>9</td><td>TypeScript cơ bản</td><td>Đọc và viết mã có kiểu, bắt lỗi trước khi chạy</td><td>cả bốn</td></tr>
<tr><td>10</td><td>Tư duy, gỡ lỗi, quy trình Git</td><td>Chia nhỏ vấn đề, đọc lỗi, làm việc trên nhánh với pull request</td><td>cả bốn</td></tr>
<tr><td>11–12</td><td>JavaScript và CSS nâng cao</td><td>Hiểu closure, <code>this</code>, prototype; xếp chồng, chuyển động, kiến trúc CSS</td><td>trình duyệt</td></tr>
<tr><td>13</td><td>Kiểm thử</td><td>Viết test đơn vị và test component, chạy chúng mỗi lần push</td><td>cả bốn</td></tr>
<tr><td>14</td><td>Đưa lên mạng</td><td>Build, cấu hình bí mật, deploy, đo hiệu năng</td><td>cả bốn</td></tr>
</tbody>
</table>
<p>Học xong Chương 8 là bạn sẵn sàng cho khoá <strong>Node.js</strong> (backend). Sau Chương 4–5 và 9, các khoá <strong>React</strong> và <strong>Next.js</strong> trở nên đọc được. Chương 11–14 đáng học xong trước buổi phỏng vấn việc làm đầu tiên.</p>

<h3>Khuôn của mỗi bài — và cách dùng từng phần</h3>
<ol>
<li><strong>📑 Slide</strong> kèm lời giảng ngắn dưới mỗi slide. Lướt qua trước để thấy hình hài bài học; quay lại để ôn.</li>
<li><strong>📖 Bài đọc chi tiết.</strong> Mọi khối mã là một tệp thật và mọi khối output xám là thứ trình duyệt hay công cụ thật đã in ra — không có gì bịa. Hãy tự gõ lại ví dụ.</li>
<li><strong>Bẫy</strong> (các khung đỏ) là những lỗi người mới thật sự mắc. Đọc hai lần; chúng tiết kiệm nhiều thời gian nhất.</li>
<li><strong>🧪 Luyện tập</strong> có dòng "Xong khi". "Xong khi" là một phép kiểm đo được, để bạn biết chắc mình đã xong chứ không phải hy vọng.</li>
<li>Bài tập <strong>Code Lab</strong> (từ Chương 1) được chấm ngay trong trình duyệt của bạn.</li>
<li><strong>Bài kiểm tra chương</strong> có kèm tờ ôn; làm tờ ôn trước, rồi mới làm bài kiểm tra.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — học bằng cách xem thay vì bằng cách gõ.</strong> Một video hướng dẫn dễ chịu chính vì nó gỡ bỏ phần dạy được: lúc bị kẹt. Bạn xem người ta dựng app to-do trong bốn mươi phút, thấy mình đã hiểu, rồi hôm sau không viết nổi một dòng — vì bạn đã luyện <em>nhận ra</em> mã, không luyện <em>viết ra</em> mã. Thuốc chữa khó chịu mà rẻ: sau mỗi bài, đóng trang lại và dựng lại ví dụ theo trí nhớ. Bạn sẽ hỏng, phải tra một chỗ, và chính lần tra đó mới ở lại.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — bỏ qua một chương vì "mình biết HTML rồi".</strong> Có thể bạn biết thật. Chứng minh trong năm phút: mở bài kiểm tra và tờ ôn của chương đó trước. Điểm tốt thì cứ đi tiếp, lương tâm thanh thản. Nếu không, những lỗ hổng chính là chỗ các chương sau sẽ làm bạn đau — một trang "không ăn CSS" thường là lỗi cấu trúc HTML của Chương 2.</p></div>

<h3>Một kế hoạch thực tế</h3>
<p>Khoá có khoảng một trăm bài. Một bài nội dung kèm bài luyện tốn của đa số người 45–90 phút; một bài kiểm tra 15–20 phút. Cộng lại khoảng <strong>90–110 giờ</strong>. Đây là ước lượng — nhịp của bạn sẽ khác, và điều đó hoàn toàn ổn.</p>
<table>
<thead><tr><th>Thời gian mỗi ngày</th><th>Chương 0–10 (phần nền)</th><th>Cả khoá</th></tr></thead>
<tbody>
<tr><td>30 phút</td><td>khoảng 4 tháng</td><td>khoảng 6–7 tháng</td></tr>
<tr><td>1 giờ</td><td>khoảng 2 tháng</td><td>khoảng 3–4 tháng</td></tr>
<tr><td>2 giờ</td><td>khoảng 5 tuần</td><td>khoảng 7–8 tuần</td></tr>
</tbody>
</table>
<p>Một giờ mỗi ngày hơn bảy giờ ngày Chủ nhật: não củng cố kỹ năng <em>giữa</em> các buổi học, vì vậy Bài 0.4 xây thói quen quanh việc luyện ngắn, đều đặn và ôn giãn cách.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (15 phút) — trang ba lớp đầu tiên của bạn</strong></p>
<ol>
<li>Tạo thư mục <code>my-first-page</code> trên máy và trong đó một tệp <code>index.html</code>.</li>
<li>Gõ (đừng dán) trang ba lớp ở Bước 1: phần HTML, khối <code>style</code>, khối <code>script</code>. Thay "Linh" bằng tên bạn. Xoá dòng tự bấm ba lần.</li>
<li>Bấm đúp tệp để mở trong Chrome hoặc Firefox. Nhấn <strong>F12</strong> (hoặc chuột phải → Inspect) và mở thẻ <strong>Console</strong>.</li>
<li>Ghi vào sổ: mỗi tuần bạn học vào ngày nào, giờ nào, và ngày bạn dự định học xong Mục 0.</li>
</ol>
<p>Gợi ý: nếu nút bấm không làm gì, kiểm xem khối <code>script</code> có nằm <em>sau</em> cái nút trong tệp không — Bài 4.5 giải thích vì sao thứ tự quan trọng.</p>
<p><strong>Xong khi:</strong> trang hiện tên bạn; bấm nút ba lần thì hiện "3 likes"; Console hiện ba dòng <code>clicked, likes = 1</code>, <code>2</code>, <code>3</code>; và sau khi tải lại thì số đếm về 0 (giờ bạn giải thích được vì sao). Lịch học của bạn đã được ghi ra.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">web page</span><span class="v">trang web — một tài liệu HTML trình duyệt hiển thị.</span></div>
  <div class="kv"><span class="k">browser / client</span><span class="v">trình duyệt / máy khách — bên hỏi và hiển thị.</span></div>
  <div class="kv"><span class="k">server</span><span class="v">máy chủ — bên trả lời request, giữ bí mật.</span></div>
  <div class="kv"><span class="k">HTML</span><span class="v">ngôn ngữ đánh dấu — cấu trúc của trang.</span></div>
  <div class="kv"><span class="k">CSS</span><span class="v">bảng định kiểu — giao diện của trang.</span></div>
  <div class="kv"><span class="k">JavaScript</span><span class="v">ngôn ngữ lập trình của trình duyệt — hành vi của trang.</span></div>
  <div class="kv"><span class="k">frontend / backend</span><span class="v">phần chạy ở trình duyệt / phần chạy ở máy chủ (+ cơ sở dữ liệu).</span></div>
  <div class="kv"><span class="k">full-stack</span><span class="v">làm được cả frontend lẫn backend.</span></div>
  <div class="kv"><span class="k">database</span><span class="v">cơ sở dữ liệu — tầng duy nhất ghi nhớ lâu dài.</span></div>
  <div class="kv"><span class="k">DevTools / Console</span><span class="v">công cụ nhà phát triển của trình duyệt / thẻ hiện thông điệp và lỗi JavaScript.</span></div>
  <div class="kv"><span class="k">framework</span><span class="v">khung làm việc — thư viện lớn quy định cách viết app (React, Next.js).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Khoá framework mặc định một chồng kiến thức nền; khoá này dựng chồng đó từ số 0, theo thứ tự phụ thuộc.</li>
  <li>Một trang là ba ngôn ngữ: HTML = cấu trúc, CSS = giao diện, JavaScript = hành vi.</li>
  <li>Một ứng dụng web có bốn tầng: trình duyệt, mạng, máy chủ, cơ sở dữ liệu. Trình duyệt quên khi tải lại; cơ sở dữ liệu thì nhớ.</li>
  <li>Mọi thứ gửi tới trình duyệt đều công khai — bí mật và quyết định cuối cùng thuộc về máy chủ.</li>
  <li>Chương 0–5 nền móng, 6–8 máy chủ và dữ liệu, 9–10 thói quen chuyên nghiệp, 11–14 kỹ năng sâu hơn.</li>
  <li>Gõ lại mọi ví dụ, làm bài luyện tới khi "Xong khi" đúng, học một chút mỗi ngày.</li>
</ul>
${nguon('📗', 'MDN — Learn web development', 'Giáo trình miễn phí, chất lượng chuẩn mà khoá này dùng làm tài liệu tham chiếu', 'https://developer.mozilla.org/en-US/docs/Learn_web_development')}
${nguon('🗺️', 'roadmap.sh — lộ trình Frontend và Backend', 'Bản đồ trực quan những gì đến sau phần nền', 'https://roadmap.sh/frontend')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-0-1-gioi-thieu', title: 'Node.js 0.1 — khoá này dẫn tới đâu', sub: 'Khoá backend mặc định bạn đã học Chương 0–8 của khoá này', cta: 'Mở bài' })}
</div>
`,
};
