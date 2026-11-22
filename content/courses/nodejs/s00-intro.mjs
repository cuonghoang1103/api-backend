/**
 * Node.js — Mục 0: Giới thiệu khoá học & Hướng dẫn học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi. KHÔNG dùng backtick trần trong content
 * (dùng &#96;), và mọi `${` trong code mẫu phải escape thành \${.
 */
import G001 from './giang/node-00-1.mjs';
// Mở đầu 6 ý (22/11/2026) — chuỗi HTML chèn vào hai bài Bắt đầu tại đây.
import { BAI1_EN, BAI1_VI, BAI2_EN, BAI2_VI } from './_mo-dau.mjs';

import G002 from './giang/node-00-2.mjs';
import G003 from './giang/node-00-3.mjs';
import G004 from './giang/node-00-4.mjs';
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Section 0 — Introduction & How to Study|||Mục 0 — Giới thiệu khoá học & Hướng dẫn học',
  description: 'Đọc trước tiên: khoá học này dạy gì, học theo cách nào, cài đặt ra sao và dự án xuyên suốt là gì.',
  lessons: [
    /* ─────────────────────── Bắt đầu tại đây 1/2 ─────────────────────── */
    {
      title: 'Start here (1/2) — What a backend is, and what Node.js does on it|||Bắt đầu tại đây (1/2) — Backend là gì, và Node.js làm gì trên đó',
      slug: 'nodejs-0-0-start-here-1',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Bài mở cửa cho người chưa từng viết backend: client và server ai làm gì, vòng request–response, vì sao chạy JavaScript trên server, và những gì bạn CHƯA cần biết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>What a backend is, and what Node.js does on it</h2>
<p class="lead">If you have only ever written code that runs in a browser, this is the on-ramp. A <strong>backend</strong> is a program that runs on a computer you control — a server — that holds the data and answers requests. The browser (the <strong>client</strong>) asks; the server answers. Node.js is simply what lets you write that server in JavaScript, the same language you may already use in the browser.</p>
<h3>Client and server: who does what</h3>
<p>The client is the part the user touches: a web page, a phone app. It <em>asks</em> — "give me this user's notes", "save this new note". The server is the part the user never sees: it checks who is asking, reads or writes the database, and sends back an answer. This back-and-forth is the <strong>request–response</strong> cycle, and almost everything in this course is one variation of it. The database and the real data live on the server because the client cannot be trusted — anyone can open the browser dev tools and change what the page sends.</p>
<h3>Why JavaScript on the server</h3>
<p>Before 2009 the server was written in PHP, Java, Ruby or Python, while the browser ran JavaScript — two languages, two mindsets. Node.js put JavaScript on the server too, so <strong>one language runs the whole stack</strong>. That is why learning Node pairs so well with a frontend you may already know: the skills carry across, and you stop translating ideas between two languages.</p>
<h3>What you are NOT expected to know yet</h3>
<p>You do not need prior JavaScript — Chapter 1 rebuilds exactly the parts a backend uses. You do not need prior backend experience, database knowledge, or any server to deploy to. You need only to be comfortable writing basic code in some language (variables, loops, functions) and willing to type every example by hand.</p>
${BAI1_EN}
<h3>🧪 Practice (10–15 min)</h3>
<div class="callout ok"><ol>
<li>Pick one app you use daily and name one thing its <strong>server</strong> must be doing that the browser alone could not (checking your password, storing other people's data, charging money).</li>
<li>Describe one request–response pair in plain words: what the client asks, and what the server must do before it answers.</li>
<li>Explain in one sentence why a check done only in the browser is a suggestion, not a guarantee.</li>
</ol>
<p><strong>Done when:</strong> you can state, for a real app, one job that belongs only to the server and why the client cannot be trusted with it.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Backend / server</span><span class="v">The program that holds the data and answers requests; the user never sees it.</span></div>
  <div class="kv"><span class="k">Client</span><span class="v">The part the user touches — a web page or app — that asks the server for things.</span></div>
  <div class="kv"><span class="k">Request–response</span><span class="v">The ask-and-answer cycle that almost every feature is built from.</span></div>
  <div class="kv"><span class="k">Node.js</span><span class="v">What lets you write the server in JavaScript instead of PHP, Java or Python.</span></div>
  <div class="kv"><span class="k">Whole-stack one language</span><span class="v">With Node, browser and server share one language, so skills carry across.</span></div>
  <div class="kv"><span class="k">Untrusted client</span><span class="v">Anyone can change what the browser sends — so real checks live on the server.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>A backend is a server program that holds the data and answers requests the user never sees.</li><li>The client asks and the server answers — the request–response cycle underlies the whole course.</li><li>Node.js lets you write that server in JavaScript, so one language runs the whole stack.</li><li>Real checks live on the server because the client can never be trusted.</li><li>You need basic coding in any language — not prior JavaScript or backend experience.</li></ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Backend là gì, và Node.js làm gì trên đó</h2>
<p class="lead">Nếu bạn mới chỉ viết code chạy trong trình duyệt, đây là đường dẫn vào. Một <strong>backend</strong> là chương trình chạy trên một máy bạn kiểm soát — một server — giữ dữ liệu và trả lời yêu cầu. Trình duyệt (phía <strong>client</strong>) hỏi; server trả lời. Node.js đơn giản là thứ cho bạn viết cái server đó bằng JavaScript, cùng ngôn ngữ bạn có thể đã dùng trong trình duyệt.</p>
<h3>Client và server: ai làm gì</h3>
<p>Client là phần người dùng chạm vào: một trang web, một app điện thoại. Nó <em>hỏi</em> — "cho tôi các note của người dùng này", "lưu note mới này". Server là phần người dùng không bao giờ thấy: nó kiểm ai đang hỏi, đọc hoặc ghi cơ sở dữ liệu, rồi gửi lại câu trả lời. Vòng qua lại này là chu trình <strong>request–response</strong>, và gần như mọi thứ trong khoá là một biến thể của nó. Dữ liệu thật và cơ sở dữ liệu nằm trên server vì client không tin được — ai cũng mở được dev tools của trình duyệt và sửa những gì trang gửi đi.</p>
<h3>Vì sao chạy JavaScript trên server</h3>
<p>Trước 2009, server viết bằng PHP, Java, Ruby hay Python, còn trình duyệt chạy JavaScript — hai ngôn ngữ, hai lối nghĩ. Node.js đưa JavaScript lên cả server, nên <strong>một ngôn ngữ chạy cả stack</strong>. Đó là lý do học Node ghép rất hợp với một frontend bạn có thể đã biết: kỹ năng mang qua được, và bạn thôi phải dịch ý tưởng giữa hai ngôn ngữ.</p>
<h3>Những gì bạn CHƯA cần biết</h3>
<p>Bạn không cần biết JavaScript trước — Chương 1 dựng lại đúng những phần một backend dùng. Bạn không cần kinh nghiệm backend, kiến thức cơ sở dữ liệu, hay bất kỳ server nào để deploy. Bạn chỉ cần viết được code cơ bản ở một ngôn ngữ nào đó (biến, vòng lặp, hàm) và sẵn lòng gõ lại mọi ví dụ bằng tay.</p>
${BAI1_VI}
<h3>🧪 Thực hành (10–15 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một app bạn dùng hằng ngày và nêu một việc mà <strong>server</strong> của nó phải làm còn trình duyệt một mình không làm được (kiểm mật khẩu, lưu dữ liệu của người khác, thu tiền).</li>
<li>Mô tả một cặp request–response bằng lời thường: client hỏi gì, và server phải làm gì trước khi trả lời.</li>
<li>Giải thích trong một câu vì sao một phép kiểm chỉ làm ở trình duyệt là một gợi ý, không phải một bảo đảm.</li>
</ol>
<p><strong>Đạt khi:</strong> với một app thật, bạn nêu được một việc chỉ thuộc về server và vì sao không thể giao nó cho client.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Backend / server</span><span class="v">Chương trình giữ dữ liệu và trả lời request; người dùng không thấy nó.</span></div>
  <div class="kv"><span class="k">Client</span><span class="v">Phần người dùng chạm vào — trang web hay app — hỏi server các thứ.</span></div>
  <div class="kv"><span class="k">Request–response</span><span class="v">Chu trình hỏi-và-đáp mà gần như mọi tính năng dựng từ đó.</span></div>
  <div class="kv"><span class="k">Node.js</span><span class="v">Thứ cho bạn viết server bằng JavaScript thay vì PHP, Java hay Python.</span></div>
  <div class="kv"><span class="k">Một ngôn ngữ cả stack</span><span class="v">Với Node, trình duyệt và server chung một ngôn ngữ, kỹ năng mang qua được.</span></div>
  <div class="kv"><span class="k">Client không tin được</span><span class="v">Ai cũng sửa được thứ trình duyệt gửi — nên phép kiểm thật nằm ở server.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Backend là chương trình server giữ dữ liệu và trả lời request mà người dùng không thấy.</li><li>Client hỏi và server đáp — chu trình request–response nằm dưới cả khoá học.</li><li>Node.js cho bạn viết server đó bằng JavaScript, nên một ngôn ngữ chạy cả stack.</li><li>Phép kiểm thật nằm ở server vì client không bao giờ tin được.</li><li>Bạn cần biết code cơ bản ở ngôn ngữ bất kỳ — không cần JavaScript hay kinh nghiệm backend trước.</li></ul>
</div>
`,
    },

    /* ─────────────────────── Bắt đầu tại đây 2/2 ─────────────────────── */
    {
      title: 'Start here (2/2) — How this course is built, and how to get the most from it|||Bắt đầu tại đây (2/2) — Khoá này được dựng thế nào, và học sao cho hiệu quả',
      slug: 'nodejs-0-0-start-here-2',
      // Dự án xuyên suốt khoá: frontend vẽ khối "🎯 Đăng ký đề tài" dưới bài có cờ này (docs/du-an-hop-dong.md §2).
      dangKyDuAn: true,
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Bài thứ hai của cặp mở đầu: triết lý "ví dụ từ production, đo chứ không đoán", bản đồ 6 giai đoạn nhìn một lượt, và một luật học duy nhất — chạy code, đừng chỉ đọc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>How this course is built, and how to get the most from it</h2>
<p class="lead">Lesson 1 said what a backend is. This one is the shape every chapter plugs into: where the examples come from, the one rule that separates this course from a tutorial, and the single study habit that decides whether you can build anything at the end. The next lessons (0.1–0.4) then go deep on the roadmap, the study loop, setup, and the project.</p>
<h3>The examples are from a system that is actually running</h3>
<p>Most tutorials stop at three routes. The examples here are taken from a production Node.js backend — this website — including its outages, its bad decisions, and the fixes. Every chapter ends with the same question: <em>what does this look like in a system that is actually running?</em> That is why so many chapters finish with a measurement instead of a screenshot.</p>
<h3>Measure, do not guess</h3>
<p>A frontend mistake is visible on the next reload. A backend mistake is usually invisible until it is expensive — a leaked socket, a transaction that was not one, a query that is fine on fifty rows and dies on fifty thousand. "It works" is a weak signal on the server, so the course leans on numbers you run yourself rather than on things that merely look right.</p>
<h3>The map at a glance</h3>
<p>Six stages, eighteen chapters: Foundations (1–4), Building an API (5–7), Making it safe (8–10), Real systems (11–13), Trust and operations (14–16), Shipping (17–18). Each stage assumes the one before it — the fastest way to get stuck is to skip ahead.</p>
${BAI2_EN}
<h3>🧪 Practice (10–15 min)</h3>
<div class="callout ok"><ol>
<li>Commit to the one rule now: for the next example you meet, type it by hand and run it, instead of reading it. Note whether running it taught you something reading did not.</li>
<li>From the map, write the six stage names in order from memory, then check.</li>
<li>Pick one backend bug you have heard of (a site going down, data lost) and guess whether it would have been visible on screen or only in a measurement.</li>
</ol>
<p><strong>Done when:</strong> you have run one example by hand and can recite the six stages in order.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Production example</span><span class="v">Code taken from a real running system, not a toy snippet.</span></div>
  <div class="kv"><span class="k">Measure, do not guess</span><span class="v">Trust a number you ran over code that merely looks right.</span></div>
  <div class="kv"><span class="k">Invisible failure</span><span class="v">A backend bug that shows nothing on screen until it is expensive.</span></div>
  <div class="kv"><span class="k">Six stages</span><span class="v">Foundations, API, safety, real systems, operations, shipping.</span></div>
  <div class="kv"><span class="k">Run, do not read</span><span class="v">The single study habit — typing and running beats reading.</span></div>
  <div class="kv"><span class="k">Depends-on-previous</span><span class="v">Each stage assumes the one before it; skipping ahead gets you stuck.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>Examples come from a real production backend — this site — outages and fixes included.</li><li>The guiding rule is measure, do not guess: a number you ran beats code that looks right.</li><li>Backend failures are often invisible until expensive, so "it works" is a weak signal.</li><li>Six stages, eighteen chapters, each assuming the previous — do not skip ahead.</li><li>The one study habit that matters: run the code, do not just read it.</li></ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Khoá này được dựng thế nào, và học sao cho hiệu quả</h2>
<p class="lead">Bài 1 nói backend là gì. Bài này là cái khung mà mọi chương cắm vào: ví dụ đến từ đâu, một luật tách khoá này khỏi một tutorial, và thói quen học duy nhất quyết định cuối khoá bạn có xây được gì không. Các bài tiếp theo (0.1–0.4) sẽ đi sâu vào bản đồ, vòng lặp học, cài đặt, và dự án.</p>
<h3>Ví dụ lấy từ một hệ thống đang chạy thật</h3>
<p>Phần lớn tutorial dừng ở ba route. Ví dụ ở đây lấy từ một backend Node.js production — chính website này — kể cả những lần sập, những quyết định sai, và cách sửa. Chương nào cũng kết bằng đúng một câu hỏi: <em>thứ này trông ra sao trong một hệ thống đang chạy thật?</em> Đó là lý do nhiều chương kết thúc bằng một phép đo chứ không phải một ảnh chụp màn hình.</p>
<h3>Đo, đừng đoán</h3>
<p>Một lỗi frontend nhìn thấy ngay ở lần tải lại kế tiếp. Một lỗi backend thường vô hình cho tới lúc nó đắt — một socket bị rò, một giao dịch mà thật ra không phải giao dịch, một truy vấn chạy ngon với năm mươi dòng và chết với năm mươi nghìn. "Nó chạy được" là tín hiệu yếu trên server, nên khoá học dựa vào những con số bạn tự chạy hơn là những thứ chỉ trông có vẻ đúng.</p>
<h3>Bản đồ nhìn một lượt</h3>
<p>Sáu giai đoạn, mười tám chương: Nền tảng (1–4), Dựng API (5–7), Làm cho an toàn (8–10), Hệ thống thật (11–13), Tin cậy và vận hành (14–16), Đưa lên production (17–18). Mỗi giai đoạn dựa trên giai đoạn trước — cách nhanh nhất để mắc kẹt là nhảy cóc.</p>
${BAI2_VI}
<h3>🧪 Thực hành (10–15 phút)</h3>
<div class="callout ok"><ol>
<li>Cam kết luật đó ngay bây giờ: với ví dụ tiếp theo bạn gặp, gõ bằng tay và chạy nó, thay vì chỉ đọc. Ghi lại xem việc chạy nó có dạy bạn điều gì mà đọc không dạy được.</li>
<li>Từ bản đồ, viết tên sáu giai đoạn theo thứ tự từ trí nhớ, rồi kiểm lại.</li>
<li>Chọn một lỗi backend bạn từng nghe (một site sập, mất dữ liệu) và đoán xem nó sẽ hiện trên màn hình hay chỉ hiện trong một phép đo.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã chạy một ví dụ bằng tay và đọc lại được sáu giai đoạn theo thứ tự.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ví dụ production</span><span class="v">Code lấy từ một hệ thống đang chạy thật, không phải đoạn đồ chơi.</span></div>
  <div class="kv"><span class="k">Đo, đừng đoán</span><span class="v">Tin con số bạn chạy hơn đoạn code chỉ trông có vẻ đúng.</span></div>
  <div class="kv"><span class="k">Lỗi vô hình</span><span class="v">Một bug backend không hiện gì trên màn hình cho tới khi nó đắt.</span></div>
  <div class="kv"><span class="k">Sáu giai đoạn</span><span class="v">Nền tảng, API, an toàn, hệ thống thật, vận hành, đưa lên production.</span></div>
  <div class="kv"><span class="k">Chạy, đừng chỉ đọc</span><span class="v">Thói quen học duy nhất — gõ và chạy thắng đọc.</span></div>
  <div class="kv"><span class="k">Dựa-trên-chương-trước</span><span class="v">Mỗi giai đoạn dựa trên giai đoạn trước; nhảy cóc là mắc kẹt.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ví dụ đến từ một backend production thật — chính site này — gồm cả những lần sập và cách sửa.</li><li>Luật dẫn đường là đo đừng đoán: một con số bạn chạy thắng đoạn code trông có vẻ đúng.</li><li>Lỗi backend thường vô hình cho tới khi đắt, nên "nó chạy được" là tín hiệu yếu.</li><li>Sáu giai đoạn, mười tám chương, mỗi cái dựa trên cái trước — đừng nhảy cóc.</li><li>Thói quen học quan trọng nhất: chạy code, đừng chỉ đọc.</li></ul>
</div>
`,
    },

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — About this course & the full roadmap|||0.1 — Về khoá học này & bản đồ toàn khoá',
      slug: 'nodejs-0-1-gioi-thieu',
      type: 'VIDEO',
      isFreePreview: true,
      // Video lịch sử: "Ryan Dahl: Original Node.js presentation" (JSConf 2009) —
      // chính buổi ra mắt Node.js của người sáng lập.
      video: { url: 'https://youtu.be/ztspvPYybIY', durationSeconds: 0 },
      description: 'Node.js là gì, ai tạo ra và vì sao, nó thay thế cái gì, dùng ở đâu trong công việc — và bản đồ 18 chương.',
      content: `${G001}

<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Node.js — from zero to production</h2>
<p class="lead">This course teaches you to build a <strong>real backend</strong>: an API that serves a live website, holds real users, real data, real money — and stays up. Not a toy "hello world" server that dies the moment two people use it at once.</p>

<h3>What makes this course different</h3>
<p>Most Node.js tutorials stop at <code>app.get('/', ...)</code>. That is roughly 5% of the job. The other 95% — the part that decides whether your API survives contact with real users — is what we spend most of our time on:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Typical tutorial</span><span class="v">Install Express, write 3 routes, done.</span></div>
  <div class="kv"><span class="k">This course</span><span class="v">Why the event loop makes Node fast, what happens when it blocks, how requests die under load, and how to prove it with numbers.</span></div>
  <div class="kv"><span class="k">Typical tutorial</span><span class="v">"Use JWT for auth."</span></div>
  <div class="kv"><span class="k">This course</span><span class="v">Why an access token must be short-lived, what refresh-token rotation prevents, and the exact bug that silently logged every user out of this website after 24 hours.</span></div>
  <div class="kv"><span class="k">Typical tutorial</span><span class="v">"Deploy to a host, click deploy."</span></div>
  <div class="kv"><span class="k">This course</span><span class="v">Build the Docker image, ship it to a VPS with zero downtime, and read the logs when the container exits with code 137.</span></div>
</div>
<p>Every chapter ends with the same question: <em>what does this look like in a system that is actually running?</em> The examples are taken from a production Node.js backend — this site — including the outages, the bad decisions and the fixes.</p>

<h3>What you will be able to build</h3>
<ul>
  <li>A REST API with authentication, roles, validation, pagination and file uploads.</li>
  <li>A database layer with migrations, relations and transactions that don't corrupt data.</li>
  <li>Realtime features (chat, notifications) over WebSockets.</li>
  <li>Background jobs, caching, scheduled tasks.</li>
  <li>A tested, containerised service you can deploy to a server you own.</li>
</ul>

<h3>What is Node.js, who made it, and what did it replace?</h3>
<p>Before 2009, JavaScript ran in <em>one</em> place: the browser. If you wanted to write the server — the program that holds the database and answers requests — you used PHP, Java, Ruby or Python. In 2009 an engineer named <strong>Ryan Dahl</strong> took Google Chrome's JavaScript engine (V8) and wrapped it so JavaScript could run <em>outside</em> the browser, on a server. That is <strong>Node.js</strong>, and he presented it at JSConf EU 2009 — the talk is on the YouTube tab of this lesson, the actual birth of the thing you're learning.</p>
<p>The second idea was the important one. Older servers handled each request on its own thread, which is heavy; Node instead uses a single-threaded, <strong>non-blocking event loop</strong> (Chapter 2), so one Node process can juggle thousands of connections cheaply — perfect for the I/O-heavy work of a web API. What it replaced, for many teams: the "one thread per request" model, and — huge in practice — the split brain of writing the frontend in JavaScript and the backend in a totally different language. With Node, <strong>one language runs the whole stack.</strong></p>
<div class="kv-grid">
  <div class="kv"><span class="k">Who &amp; when</span><span class="v">Ryan Dahl, 2009. Now stewarded by the OpenJS Foundation and a large community.</span></div>
  <div class="kv"><span class="k">Built on</span><span class="v">V8 (Chrome's JS engine) + libuv (the event loop &amp; async I/O) — Chapter 2 pulls this apart.</span></div>
  <div class="kv"><span class="k">Where it's used</span><span class="v">APIs, realtime apps, CLIs, build tools. Netflix, PayPal, LinkedIn, Uber and this site run Node backends.</span></div>
  <div class="kv"><span class="k">Why learn it</span><span class="v">"Node.js" and "Express" are among the most-requested backend skills; and it pairs with the React/Next frontend course so you own the whole stack.</span></div>
</div>

<h3>The roadmap — 6 stages, 18 chapters</h3>
<p>Each stage assumes the one before it. Do not skip ahead: chapter 8 (auth) is unreadable if chapter 2 (async) never clicked.</p>
<div class="lz-map">
  <div class="lz-stage">Stage 1 · Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">JavaScript you actually need for the backend</div><div class="lz-nsub">Scope, closures, this, objects, async from the ground up</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Inside the Node.js runtime</div><div class="lz-nsub">V8, libuv, the event loop, why blocking is fatal</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Core modules</div><div class="lz-nsub">fs, path, streams, buffers, events, http without a framework</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">npm &amp; project hygiene</div><div class="lz-nsub">package.json, semver, lockfiles, supply-chain safety</div></div></div>
  <div class="lz-stage">Stage 2 · Building an API</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Express core</div><div class="lz-nsub">Routing, middleware, error handling — the request pipeline</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">REST API design</div><div class="lz-nsub">Resources, status codes, validation, pagination, versioning</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Database with Prisma &amp; PostgreSQL</div><div class="lz-nsub">Schema, migrations, relations, transactions, the N+1 trap</div></div></div>
  <div class="lz-stage">Stage 3 · Making it safe</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Authentication &amp; authorization</div><div class="lz-nsub">Password hashing, JWT, refresh rotation, sessions, roles</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Web security for APIs</div><div class="lz-nsub">CORS, CSRF, headers, rate limiting, input sanitisation</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">File uploads &amp; object storage</div><div class="lz-nsub">Multipart, presigned URLs, S3 / Cloudflare R2, CDN delivery</div></div></div>
  <div class="lz-stage">Stage 4 · Real systems</div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Realtime with WebSockets</div><div class="lz-nsub">Socket.IO, rooms, presence, scaling across processes</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Caching with Redis</div><div class="lz-nsub">Cache patterns, invalidation, rate-limit counters</div></div></div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Background jobs &amp; scheduling</div><div class="lz-nsub">Queues, workers, retries, cron, idempotency</div></div></div>
  <div class="lz-stage">Stage 5 · Trust &amp; operations</div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">Unit, integration, HTTP tests, fixtures, what not to test</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Logging &amp; observability</div><div class="lz-nsub">Structured logs, request ids, error tracking, health checks</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Performance &amp; scaling</div><div class="lz-nsub">Profiling, clustering, memory leaks, load testing</div></div></div>
  <div class="lz-stage">Stage 6 · Shipping</div>
  <div class="lz-node"><div class="lz-badge">17</div><div class="lz-nbody"><div class="lz-ntitle">Docker &amp; deployment</div><div class="lz-nsub">Images, compose, environment config, zero-downtime deploys</div></div></div>
  <div class="lz-node"><div class="lz-badge">18</div><div class="lz-nbody"><div class="lz-ntitle">Architecture &amp; advanced patterns</div><div class="lz-nsub">Layering, monolith vs services, events, and what this course deliberately leaves out</div></div></div>
</div>

<h3>Who this is for</h3>
<p>You should be comfortable writing basic code in <em>some</em> language — variables, loops, functions. You do <strong>not</strong> need prior JavaScript: chapter 1 rebuilds exactly the parts of the language a backend developer uses. You do not need prior backend experience at all.</p>
<div class="callout ok">Time budget: roughly <strong>3–4 hours per chapter</strong> if you type out every example. 18 chapters ≈ 60–70 hours to genuinely absorb, not to skim. Speed is not the goal — being able to rebuild it from memory is.</div>
<div class="note-ct">This site (cuongthai.com) runs on exactly the stack this course teaches: Node.js + Express + TypeScript, PostgreSQL through Prisma, Redis, Socket.IO, Cloudflare R2 for media, Docker on a VPS. When a chapter says "here's how it's done in production", it means <em>here</em>.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice track: Node.js (Express) on Code Lab</span><span class="lc-sub">16 modules · 160 hands-on exercises with solutions — the companion practice for this course.</span></span>
</a>
<div class="pitfall">
<p><strong>Trap — reading a backend course the way you would read a frontend one.</strong> A frontend mistake is visible: the layout is wrong, the button does nothing, and you see it on the next reload. A backend mistake is usually invisible until it is expensive — a connection pool that leaks one socket per request, a transaction that is not one, a query that is fine on fifty rows. Nothing on screen changes, so &quot;it works&quot; is a much weaker signal here than you are used to. That is why almost every chapter in this course ends with a measurement rather than a screenshot: on the server, the only way to know something works is to make it prove it under conditions like production&#39;s.</p>
</div>
<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nodejs.org/en/docs" target="_blank" rel="noopener">
  <span class="lc-ico">🟢</span>
  <span class="lc-body"><span class="lc-title">nodejs.org — the official Node.js docs</span><span class="lc-sub">The API reference and guides. The "Learn" section is a solid beginner path.</span></span>
</a>
<a class="link-card dl" href="https://expressjs.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🚂</span>
  <span class="lc-body"><span class="lc-title">expressjs.com — the Express framework</span><span class="lc-sub">The web framework this course builds on, from Chapter 5 onward.</span></span>
</a>

<h3>🧪 Practice (10–15 min)</h3>
<div class="callout ok"><ol>
<li>Scroll the 18-chapter roadmap and mark where you are: which stage (1–6) can you already do a little of, and which chapter is the first that feels unfamiliar?</li>
<li>Write one sentence answering the course question for a backend you have used: <em>what happens on the server when I click submit?</em></li>
<li>Name the two things Node.js is built on (the JS engine and the async library) without scrolling back up.</li>
</ol>
<p><strong>Done when:</strong> you can place yourself on the roadmap and say, in one line, what Node.js is and the two pieces it is built from.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Node.js</span><span class="v">A runtime that runs JavaScript outside the browser, on a server — created by Ryan Dahl in 2009.</span></div>
  <div class="kv"><span class="k">V8</span><span class="v">Chrome's JavaScript engine, the part that actually executes your code.</span></div>
  <div class="kv"><span class="k">libuv</span><span class="v">The C library that gives Node its non-blocking event loop and async I/O.</span></div>
  <div class="kv"><span class="k">Event loop</span><span class="v">The single-threaded scheduler that lets one process juggle thousands of connections.</span></div>
  <div class="kv"><span class="k">LTS</span><span class="v">A long-term-support Node release (even majors) — what production should run.</span></div>
  <div class="kv"><span class="k">Backend / API</span><span class="v">The server program that holds the data and answers requests from clients.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>This course builds a real backend — the 95% beyond "write three routes" — using examples from a production system.</li><li>Node.js (Ryan Dahl, 2009) runs JavaScript on the server, built on V8 plus libuv.</li><li>Its non-blocking event loop lets one process handle thousands of connections cheaply.</li><li>The path is 6 stages, 18 chapters, each assuming the one before it — do not skip ahead.</li></ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Node.js — từ số 0 tới production</h2>
<p class="lead">Khoá này dạy bạn xây một <strong>backend thật</strong>: một API phục vụ website đang chạy, có người dùng thật, dữ liệu thật, tiền thật — và phải sống được. Không phải server "hello world" đồ chơi, hai người vào cùng lúc là chết.</p>

<h3>Khoá này khác gì các tutorial ngoài kia</h3>
<p>Phần lớn tutorial Node.js dừng ở <code>app.get('/', ...)</code>. Đó mới khoảng 5% công việc. 95% còn lại — phần quyết định API của bạn có sống nổi khi gặp người dùng thật hay không — mới là chỗ ta dành nhiều thời gian nhất:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tutorial thường</span><span class="v">Cài Express, viết 3 route, xong.</span></div>
  <div class="kv"><span class="k">Khoá này</span><span class="v">Vì sao event loop làm Node nhanh, chuyện gì xảy ra khi nó bị chặn, request chết thế nào khi tải cao, và chứng minh bằng số đo thật.</span></div>
  <div class="kv"><span class="k">Tutorial thường</span><span class="v">"Dùng JWT để xác thực."</span></div>
  <div class="kv"><span class="k">Khoá này</span><span class="v">Vì sao access token phải sống ngắn, refresh-token rotation ngăn được chuyện gì, và đúng con bug đã âm thầm đá văng toàn bộ người dùng của website này ra sau 24 giờ.</span></div>
  <div class="kv"><span class="k">Tutorial thường</span><span class="v">"Deploy lên host, bấm nút deploy."</span></div>
  <div class="kv"><span class="k">Khoá này</span><span class="v">Tự build image Docker, đẩy lên VPS không downtime, và đọc log khi container thoát với mã 137.</span></div>
</div>
<p>Chương nào cũng kết bằng đúng một câu hỏi: <em>thứ này trông ra sao trong một hệ thống đang chạy thật?</em> Ví dụ trong khoá lấy từ một backend Node.js production — chính website này — kể cả những lần sập, những quyết định sai và cách sửa.</p>

<h3>Học xong bạn xây được gì</h3>
<ul>
  <li>Một REST API có xác thực, phân quyền, kiểm tra dữ liệu đầu vào, phân trang và upload file.</li>
  <li>Tầng cơ sở dữ liệu có migration, quan hệ và transaction không làm hỏng dữ liệu.</li>
  <li>Tính năng realtime (chat, thông báo) qua WebSocket.</li>
  <li>Tác vụ nền, cache, công việc chạy theo lịch.</li>
  <li>Một dịch vụ đã có test, đóng gói Docker, deploy được lên server của chính bạn.</li>
</ul>

<h3>Node.js là gì, ai tạo ra, và nó thay thế cái gì?</h3>
<p>Trước 2009, JavaScript chạy ở <em>một</em> nơi: trình duyệt. Muốn viết server — chương trình giữ database và trả lời request — bạn dùng PHP, Java, Ruby hay Python. Năm 2009 một kỹ sư tên <strong>Ryan Dahl</strong> lấy engine JavaScript của Google Chrome (V8) và bọc nó lại để JavaScript chạy được <em>bên ngoài</em> trình duyệt, trên một server. Đó là <strong>Node.js</strong>, và ông trình bày nó tại JSConf EU 2009 — bài talk nằm ở tab YouTube của bài này, chính là khoảnh khắc khai sinh thứ bạn đang học.</p>
<p>Ý tưởng thứ hai mới là ý quan trọng. Server đời cũ xử lý mỗi request trên một luồng riêng, rất nặng; Node thay vào đó dùng một <strong>vòng lặp sự kiện đơn luồng, không chặn</strong> (Chương 2), nên một tiến trình Node có thể tung hứng hàng nghìn kết nối một cách rẻ tiền — hoàn hảo cho công việc nặng I/O của một web API. Nó thay thế, với nhiều nhóm: mô hình "mỗi request một luồng", và — cực lớn trên thực tế — cảnh "đầu óc bị chẻ đôi" khi viết frontend bằng JavaScript còn backend bằng một ngôn ngữ hoàn toàn khác. Với Node, <strong>một ngôn ngữ chạy cả stack.</strong></p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ai &amp; khi nào</span><span class="v">Ryan Dahl, 2009. Nay do OpenJS Foundation và một cộng đồng lớn dẫn dắt.</span></div>
  <div class="kv"><span class="k">Dựng trên</span><span class="v">V8 (engine JS của Chrome) + libuv (vòng lặp sự kiện &amp; I/O bất đồng bộ) — Chương 2 mổ xẻ.</span></div>
  <div class="kv"><span class="k">Dùng ở đâu</span><span class="v">API, app realtime, CLI, công cụ build. Netflix, PayPal, LinkedIn, Uber và chính site này chạy backend Node.</span></div>
  <div class="kv"><span class="k">Vì sao học</span><span class="v">"Node.js" và "Express" thuộc nhóm kỹ năng backend được tuyển nhiều nhất; và nó ghép với khoá frontend React/Next để bạn làm chủ cả stack.</span></div>
</div>

<h3>Bản đồ khoá học — 6 giai đoạn, 18 chương</h3>
<p>Mỗi giai đoạn dựa trên giai đoạn trước. Đừng nhảy cóc: chương 8 (xác thực) sẽ không đọc nổi nếu chương 2 (bất đồng bộ) chưa thông.</p>
<div class="lz-map">
  <div class="lz-stage">Giai đoạn 1 · Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">JavaScript thực sự cần cho backend</div><div class="lz-nsub">Phạm vi biến, closure, this, object, bất đồng bộ từ gốc</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Bên trong Node.js runtime</div><div class="lz-nsub">V8, libuv, event loop, vì sao chặn luồng là chết</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Các module lõi</div><div class="lz-nsub">fs, path, stream, buffer, event, http không cần framework</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">npm &amp; giữ dự án sạch</div><div class="lz-nsub">package.json, semver, lockfile, an toàn chuỗi cung ứng</div></div></div>
  <div class="lz-stage">Giai đoạn 2 · Dựng API</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Express phần lõi</div><div class="lz-nsub">Routing, middleware, xử lý lỗi — đường ống của một request</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế REST API</div><div class="lz-nsub">Tài nguyên, mã trạng thái, validation, phân trang, đánh phiên bản</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Cơ sở dữ liệu với Prisma &amp; PostgreSQL</div><div class="lz-nsub">Schema, migration, quan hệ, transaction, cái bẫy N+1</div></div></div>
  <div class="lz-stage">Giai đoạn 3 · Làm cho an toàn</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực &amp; phân quyền</div><div class="lz-nsub">Băm mật khẩu, JWT, xoay refresh token, session, vai trò</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Bảo mật web cho API</div><div class="lz-nsub">CORS, CSRF, header bảo mật, giới hạn tần suất, làm sạch đầu vào</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Upload file &amp; lưu trữ đối tượng</div><div class="lz-nsub">Multipart, presigned URL, S3 / Cloudflare R2, phân phối qua CDN</div></div></div>
  <div class="lz-stage">Giai đoạn 4 · Hệ thống thật</div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Realtime với WebSocket</div><div class="lz-nsub">Socket.IO, room, trạng thái online, mở rộng nhiều tiến trình</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Cache với Redis</div><div class="lz-nsub">Các mẫu cache, vô hiệu hoá cache, bộ đếm rate-limit</div></div></div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Tác vụ nền &amp; hẹn giờ</div><div class="lz-nsub">Hàng đợi, worker, thử lại, cron, tính bất biến khi lặp</div></div></div>
  <div class="lz-stage">Giai đoạn 5 · Tin cậy &amp; vận hành</div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">Unit, tích hợp, test HTTP, dữ liệu mẫu, cái gì KHÔNG nên test</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">Log &amp; quan sát hệ thống</div><div class="lz-nsub">Log có cấu trúc, mã request, theo dõi lỗi, health check</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Hiệu năng &amp; mở rộng</div><div class="lz-nsub">Đo hiệu năng, chạy nhiều tiến trình, rò rỉ bộ nhớ, test tải</div></div></div>
  <div class="lz-stage">Giai đoạn 6 · Đưa lên production</div>
  <div class="lz-node"><div class="lz-badge">17</div><div class="lz-nbody"><div class="lz-ntitle">Docker &amp; triển khai</div><div class="lz-nsub">Image, compose, cấu hình môi trường, deploy không downtime</div></div></div>
  <div class="lz-node"><div class="lz-badge">18</div><div class="lz-nbody"><div class="lz-ntitle">Kiến trúc &amp; mẫu nâng cao</div><div class="lz-nsub">Phân tầng, monolith vs services, hướng sự kiện, và những gì khoá học cố ý không dạy</div></div></div>
</div>

<h3>Khoá này dành cho ai</h3>
<p>Bạn cần biết viết code cơ bản bằng <em>một ngôn ngữ nào đó</em> — biến, vòng lặp, hàm. Bạn <strong>không</strong> cần biết JavaScript trước: chương 1 dựng lại đúng những phần ngôn ngữ mà một backend developer dùng. Bạn cũng không cần kinh nghiệm backend nào cả.</p>
<div class="callout ok">Ngân sách thời gian: khoảng <strong>3–4 giờ cho mỗi chương</strong> nếu bạn gõ lại mọi ví dụ. 18 chương ≈ 60–70 giờ để thấm thật sự, không phải để đọc lướt. Mục tiêu không phải nhanh — mà là tự dựng lại được từ trí nhớ.</div>
<div class="note-ct">Website này (cuongthai.com) chạy đúng bộ công nghệ mà khoá học dạy: Node.js + Express + TypeScript, PostgreSQL qua Prisma, Redis, Socket.IO, Cloudflare R2 cho media, Docker trên VPS. Khi một chương nói "trong production người ta làm thế này", nghĩa là <em>ở đây</em>.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Track luyện tập: Node.js (Express) trên Code Lab</span><span class="lc-sub">16 module · 160 bài tập có lời giải — phần thực hành đi kèm khoá học này.</span></span>
</a>
<div class="pitfall">
<p><strong>Bẫy — đọc một khoá học backend theo cách bạn đọc một khoá frontend.</strong> Một sai sót ở frontend thì nhìn thấy được: bố cục lệch, cái nút không làm gì, và bạn thấy nó ngay ở lần tải lại kế tiếp. Một sai sót ở backend thì thường vô hình cho tới lúc nó đắt đỏ — một pool kết nối rò một socket mỗi request, một giao dịch mà thật ra không phải giao dịch, một truy vấn chạy ngon với năm mươi dòng. Chẳng có gì trên màn hình đổi cả, nên &quot;nó chạy được&quot; ở đây là một tín hiệu yếu hơn nhiều so với bạn quen. Đó là lý do gần như mọi chương trong khoá này kết thúc bằng một phép đo chứ không phải một tấm ảnh chụp màn hình: trên máy chủ, cách duy nhất để biết một thứ chạy được là bắt nó tự chứng minh dưới điều kiện giống production.</p>
</div>
<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nodejs.org/en/docs" target="_blank" rel="noopener">
  <span class="lc-ico">🟢</span>
  <span class="lc-body"><span class="lc-title">nodejs.org — tài liệu Node.js chính thức</span><span class="lc-sub">Tham chiếu API và hướng dẫn. Mục "Learn" là lộ trình nhập môn chắc chắn.</span></span>
</a>
<a class="link-card dl" href="https://expressjs.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🚂</span>
  <span class="lc-body"><span class="lc-title">expressjs.com — framework Express</span><span class="lc-sub">Web framework khoá này dựng lên từ Chương 5 trở đi.</span></span>
</a>

<h3>🧪 Thực hành (10–15 phút)</h3>
<div class="callout ok"><ol>
<li>Lướt bản đồ 18 chương và đánh dấu bạn đang ở đâu: giai đoạn nào (1–6) bạn đã làm được chút ít, và chương nào là chương đầu tiên thấy lạ?</li>
<li>Viết một câu trả lời cho câu hỏi của khoá với một backend bạn từng dùng: <em>chuyện gì xảy ra trên server khi tôi bấm gửi?</em></li>
<li>Gọi tên hai thứ Node.js được dựng trên (engine JS và thư viện bất đồng bộ) mà không cần kéo lên xem lại.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tự xếp được mình trên bản đồ và nói được, trong một dòng, Node.js là gì và hai mảnh nó được dựng từ đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Node.js</span><span class="v">Runtime chạy JavaScript bên ngoài trình duyệt, trên server — Ryan Dahl tạo năm 2009.</span></div>
  <div class="kv"><span class="k">V8</span><span class="v">Engine JavaScript của Chrome, phần thật sự thực thi code của bạn.</span></div>
  <div class="kv"><span class="k">libuv</span><span class="v">Thư viện C cho Node vòng lặp sự kiện không chặn và I/O bất đồng bộ.</span></div>
  <div class="kv"><span class="k">Event loop</span><span class="v">Bộ lập lịch đơn luồng giúp một tiến trình tung hứng hàng nghìn kết nối.</span></div>
  <div class="kv"><span class="k">LTS</span><span class="v">Bản Node hỗ trợ dài hạn (major số chẵn) — thứ production nên chạy.</span></div>
  <div class="kv"><span class="k">Backend / API</span><span class="v">Chương trình server giữ dữ liệu và trả lời request từ client.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Khoá này xây một backend thật — phần 95% vượt qua "viết ba route" — với ví dụ từ một hệ thống production.</li><li>Node.js (Ryan Dahl, 2009) chạy JavaScript trên server, dựng trên V8 cộng libuv.</li><li>Vòng lặp sự kiện không chặn giúp một tiến trình xử lý hàng nghìn kết nối rẻ tiền.</li><li>Lộ trình gồm 6 giai đoạn, 18 chương, mỗi chương dựa trên chương trước — đừng nhảy cóc.</li></ul>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-0-1-gioi-thieu-lo-trinh" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 0.1 — not ready yet? Start here</span><span class="lc-sub">HTML, CSS, JavaScript, HTTP and SQL from zero: the layers this course assumes</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-0-1-gioi-thieu-lo-trinh" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 0.1 — chưa vững? Bắt đầu từ đây</span><span class="lc-sub">HTML, CSS, JavaScript, HTTP và SQL từ số 0: những tầng khoá này mặc định bạn đã có</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — How to study this course|||0.2 — Cách học khoá này cho hiệu quả',
      slug: 'nodejs-0-2-cach-hoc',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Vòng lặp học 5 bước, cách dùng Code Lab kèm theo, và quy tắc chống ảo tưởng "đã hiểu".',
      content: `${G002}

<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>How to study this course</h2>
<p class="lead">Reading code feels like learning. It is not. The single biggest reason people "finish" a backend course and still can't build anything is that they <strong>read</strong> 60 hours instead of <strong>typing</strong> 60 hours.</p>

<h3>The loop: five steps per lesson</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Read once</div><div class="lz-d">Whole lesson, no typing. Just build the map.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Retype</div><div class="lz-d">Every example, by hand. Never copy-paste.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Break it</div><div class="lz-d">Change a value, delete an await, see the error.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Explain it</div><div class="lz-d">Out loud, no notes, as if teaching.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Practise</div><div class="lz-d">Solve the matching Code Lab exercises.</div></div>
</div>

<h3>Step 2 — why retyping matters</h3>
<p>Copy-paste moves text. Typing moves the code through your fingers and your reading of it through your head. You will make typos, and fixing typos is how you learn to <em>read error messages</em> — which is, honestly, 40% of backend work.</p>

<h3>Step 3 — deliberately break things</h3>
<p>The fastest way to understand what a line does is to remove it and watch what dies. For every example, try at least one of these:</p>
<ul>
  <li>Delete an <code>await</code> — what does the function return now?</li>
  <li>Return the wrong status code — what does the client see?</li>
  <li>Throw an error inside an async handler with no try/catch — does the server crash?</li>
  <li>Pass a string where a number is expected — where does it blow up, and how far from the real cause?</li>
</ul>
<div class="callout warn">Do this in a scratch project, never in the code you care about. Chapter 4 shows you how to spin up a throwaway project in ten seconds.</div>

<h3>Step 4 — the explain test</h3>
<p>Close the page and say out loud: <em>"middleware is …, it runs when …, and if I forget next() then …"</em>. If you stall, you didn't learn it — you recognised it. Recognition disappears within a week; explanation doesn't.</p>
<p>This is also exactly the skill you need if you plan to <strong>teach or record</strong> this material later. If you can't explain it to an empty room, you can't explain it to a camera.</p>

<h3>Step 5 — the practice track</h3>
<p>Code Lab has a Node.js track that mirrors this course: 16 modules, 160 exercises, each with a worked solution. Use it as the drill ground after each chapter — theory here, reps there.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">After chapter 1–2</span><span class="v">Module 318 — JavaScript foundations for Node.js</span></div>
  <div class="kv"><span class="k">After chapter 3–4</span><span class="v">Module 319 — Core modules &amp; the npm ecosystem</span></div>
  <div class="kv"><span class="k">After chapter 5</span><span class="v">Module 320 — Express core concepts</span></div>
  <div class="kv"><span class="k">After chapter 6</span><span class="v">Module 321 — RESTful API design</span></div>
  <div class="kv"><span class="k">After chapter 7</span><span class="v">Module 322 — Database integration &amp; data modelling</span></div>
  <div class="kv"><span class="k">After chapter 8–9</span><span class="v">Module 323 — Authentication, authorization, security</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — skipping step 3, because breaking working code feels like a waste of time.</strong> Retyping an example teaches you the shape; breaking it is what teaches you the error. If you have never seen <code>EADDRINUSE</code>, <code>ECONNREFUSED</code>, or &quot;Cannot read properties of undefined&quot; on purpose, then the first time you meet one it will be at 11pm with production down — and you will be learning the message and debugging the incident at the same time. Deliberately delete a required field, point at the wrong port, close the database mid-query. Each takes twenty seconds and turns a future outage into a message you already recognise.</p>
</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-318" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Start at Module 318 — JavaScript Foundations for Node.js</span><span class="lc-sub">10 exercises. Do them after chapter 1.</span></span>
</a>

<h3>Rules that save months</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Read the error, all of it</span><span class="v">The answer is usually on line 1 and the location on line 3. Most beginners read neither.</span></div>
  <div class="kv"><span class="k">One change at a time</span><span class="v">Change two things, break one, and you no longer know which.</span></div>
  <div class="kv"><span class="k">Reproduce before you fix</span><span class="v">If you can't make the bug happen on demand, you can't know you fixed it.</span></div>
  <div class="kv"><span class="k">Official docs first</span><span class="v">nodejs.org and expressjs.com are more accurate and more current than any blog post — including this one.</span></div>
  <div class="kv"><span class="k">Commit small and often</span><span class="v">A working state you can return to is worth more than clever code you can't undo.</span></div>
</div>
<div class="note-ct">If you are recording lessons while you learn: record <em>after</em> step 4, never before. Explaining on camera something you only recognise produces confident-sounding wrong statements — and those are very hard to walk back once published.</div>

<h3>🧪 Practice (10–15 min)</h3>
<div class="callout ok"><ol>
<li>Take the very next code example you meet and run the full five-step loop on it: read, retype by hand, break it, explain it out loud, then do the matching Code Lab reps.</li>
<li>In a scratch project, break one thing on purpose — delete an <code>await</code>, or return the wrong status — and write down the exact error message you got.</li>
<li>Do the "explain test": close the page and say out loud what the lesson was about in three sentences. If you stall, you only recognised it.</li>
</ol>
<p><strong>Done when:</strong> you have run all five steps on one example and produced one real error message plus a spoken explanation with no notes.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Five-step loop</span><span class="v">Read, retype, break, explain, practise — the cycle for every lesson.</span></div>
  <div class="kv"><span class="k">Retype (no copy-paste)</span><span class="v">Typing code by hand is what teaches you to read error messages.</span></div>
  <div class="kv"><span class="k">Break it deliberately</span><span class="v">Remove a line and watch what dies, in a scratch project only.</span></div>
  <div class="kv"><span class="k">The explain test</span><span class="v">If you cannot explain it out loud with no notes, you only recognised it.</span></div>
  <div class="kv"><span class="k">Code Lab track</span><span class="v">The companion Node.js track: 16 modules, 160 exercises with solutions.</span></div>
  <div class="kv"><span class="k">Scratch project</span><span class="v">A throwaway project where breaking things is safe.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Reading feels like learning but is not — you must type, not just read.</li><li>Every lesson gets the same five-step loop: read, retype, break, explain, practise.</li><li>Breaking code on purpose (in a scratch project) is how you learn to read errors.</li><li>The explain test separates real understanding from mere recognition.</li><li>Drill each chapter on the matching Code Lab module.</li></ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cách học khoá này cho hiệu quả</h2>
<p class="lead">Đọc code tạo cảm giác đang học. Thực ra không phải. Lý do lớn nhất khiến người ta "học xong" một khoá backend mà vẫn không xây nổi thứ gì là vì họ đã <strong>đọc</strong> 60 giờ thay vì <strong>gõ</strong> 60 giờ.</p>

<h3>Vòng lặp: năm bước cho mỗi bài</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Đọc một lượt</div><div class="lz-d">Hết bài, chưa gõ. Chỉ để dựng bản đồ trong đầu.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Gõ lại</div><div class="lz-d">Mọi ví dụ, bằng tay. Tuyệt đối không copy-paste.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Phá nó</div><div class="lz-d">Đổi một giá trị, xoá một await, xem lỗi hiện ra.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Giải thích</div><div class="lz-d">Nói thành tiếng, không nhìn tài liệu, như đang dạy.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Luyện tập</div><div class="lz-d">Làm các bài Code Lab tương ứng.</div></div>
</div>

<h3>Bước 2 — vì sao phải gõ lại</h3>
<p>Copy-paste chỉ di chuyển chữ. Gõ tay đưa code qua ngón tay bạn, và đưa việc đọc code qua đầu bạn. Bạn sẽ gõ sai, và sửa lỗi gõ sai chính là cách bạn học <em>đọc thông báo lỗi</em> — thật lòng mà nói, đó là 40% công việc backend.</p>

<h3>Bước 3 — cố ý làm hỏng</h3>
<p>Cách nhanh nhất để hiểu một dòng làm gì là xoá nó đi và xem cái gì chết. Với mỗi ví dụ, hãy thử ít nhất một trong các việc sau:</p>
<ul>
  <li>Xoá một chữ <code>await</code> — hàm giờ trả về cái gì?</li>
  <li>Trả về sai mã trạng thái — phía client nhìn thấy gì?</li>
  <li>Ném lỗi trong một handler async mà không try/catch — server có sập không?</li>
  <li>Truyền chuỗi vào chỗ cần số — nó nổ ở đâu, và cách nguyên nhân thật bao xa?</li>
</ul>
<div class="callout warn">Làm việc này trong một dự án nháp, đừng bao giờ làm trên code bạn quý. Chương 4 sẽ chỉ cách dựng một dự án vứt đi trong mười giây.</div>

<h3>Bước 4 — bài kiểm tra "giải thích"</h3>
<p>Đóng trang lại và nói to: <em>"middleware là…, nó chạy khi…, và nếu tôi quên next() thì…"</em>. Nếu bạn khựng lại, bạn chưa học được — bạn chỉ đang <em>nhận ra</em> nó. Sự nhận ra biến mất trong vòng một tuần; khả năng giải thích thì không.</p>
<p>Đây cũng đúng là kỹ năng bạn cần nếu định <strong>dạy lại hoặc quay video</strong> phần này về sau. Nếu bạn không giải thích nổi cho một căn phòng trống, bạn cũng không giải thích nổi trước ống kính.</p>

<h3>Bước 5 — track luyện tập</h3>
<p>Code Lab có track Node.js phản chiếu đúng khoá này: 16 module, 160 bài tập, mỗi bài có lời giải chi tiết. Dùng nó làm thao trường sau mỗi chương — lý thuyết ở đây, số lần lặp ở đó.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Sau chương 1–2</span><span class="v">Module 318 — Nền tảng JavaScript cho Node.js</span></div>
  <div class="kv"><span class="k">Sau chương 3–4</span><span class="v">Module 319 — Module lõi &amp; hệ sinh thái npm</span></div>
  <div class="kv"><span class="k">Sau chương 5</span><span class="v">Module 320 — Các khái niệm lõi của Express</span></div>
  <div class="kv"><span class="k">Sau chương 6</span><span class="v">Module 321 — Thiết kế RESTful API</span></div>
  <div class="kv"><span class="k">Sau chương 7</span><span class="v">Module 322 — Tích hợp CSDL &amp; mô hình hoá dữ liệu</span></div>
  <div class="kv"><span class="k">Sau chương 8–9</span><span class="v">Module 323 — Xác thực, phân quyền, bảo mật</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — bỏ qua bước 3, vì phá hỏng đoạn mã đang chạy có cảm giác như phí thời gian.</strong> Gõ lại một ví dụ dạy bạn cái hình dạng; phá nó mới là thứ dạy bạn cái lỗi. Nếu bạn chưa từng cố tình nhìn thấy <code>EADDRINUSE</code>, <code>ECONNREFUSED</code>, hay &quot;Cannot read properties of undefined&quot;, thì lần đầu bạn gặp một trong số đó sẽ là lúc 11 giờ đêm với production đang chết — và bạn sẽ vừa học cái thông điệp vừa xử lý sự cố cùng một lúc. Hãy cố ý xoá một trường bắt buộc, trỏ vào sai cổng, đóng cơ sở dữ liệu giữa lúc đang truy vấn. Mỗi thứ mất hai mươi giây và biến một sự cố tương lai thành một thông điệp bạn đã nhận ra sẵn.</p>
</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-318" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Bắt đầu ở Module 318 — Nền tảng JavaScript cho Node.js</span><span class="lc-sub">10 bài tập. Làm sau chương 1.</span></span>
</a>

<h3>Vài nguyên tắc tiết kiệm cho bạn hàng tháng trời</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đọc lỗi, đọc hết</span><span class="v">Câu trả lời thường nằm ở dòng 1 và vị trí ở dòng 3. Đa số người mới không đọc dòng nào.</span></div>
  <div class="kv"><span class="k">Mỗi lần đổi một thứ</span><span class="v">Đổi hai thứ, hỏng một cái, bạn không còn biết cái nào gây ra.</span></div>
  <div class="kv"><span class="k">Tái hiện được rồi hãy sửa</span><span class="v">Nếu chưa làm cho bug xuất hiện theo ý muốn được, bạn không thể biết mình đã sửa xong.</span></div>
  <div class="kv"><span class="k">Tài liệu chính chủ trước</span><span class="v">nodejs.org và expressjs.com chính xác và mới hơn mọi bài blog — kể cả bài này.</span></div>
  <div class="kv"><span class="k">Commit nhỏ và thường xuyên</span><span class="v">Một trạng thái chạy được để quay về đáng giá hơn đoạn code thông minh mà bạn không undo nổi.</span></div>
</div>
<div class="note-ct">Nếu bạn vừa học vừa quay bài giảng: hãy quay <em>sau</em> bước 4, đừng bao giờ quay trước. Giảng trước ống kính một thứ mình mới chỉ "thấy quen" sẽ đẻ ra những câu nói sai nhưng nghe rất tự tin — và loại đó cực khó rút lại sau khi đã đăng.</div>

<h3>🧪 Thực hành (10–15 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy ngay ví dụ code tiếp theo bạn gặp và chạy đủ vòng lặp năm bước trên nó: đọc, gõ lại bằng tay, phá nó, giải thích thành tiếng, rồi làm các bài Code Lab tương ứng.</li>
<li>Trong một dự án nháp, cố ý phá một thứ — xoá một <code>await</code>, hoặc trả sai mã trạng thái — và ghi lại đúng thông báo lỗi bạn nhận được.</li>
<li>Làm "bài kiểm tra giải thích": đóng trang lại và nói to bài vừa học nói về gì trong ba câu. Nếu khựng, bạn mới chỉ nhận ra nó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã chạy đủ năm bước trên một ví dụ và tạo ra một thông báo lỗi thật cùng một lời giải thích nói miệng không cần tài liệu.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Vòng lặp năm bước</span><span class="v">Đọc, gõ lại, phá, giải thích, luyện tập — chu trình cho mọi bài.</span></div>
  <div class="kv"><span class="k">Gõ lại (không copy-paste)</span><span class="v">Gõ code bằng tay mới dạy bạn đọc thông báo lỗi.</span></div>
  <div class="kv"><span class="k">Cố ý phá</span><span class="v">Xoá một dòng và xem cái gì chết, chỉ trong dự án nháp.</span></div>
  <div class="kv"><span class="k">Bài kiểm tra giải thích</span><span class="v">Không giải thích nổi miệng, không nhìn tài liệu, nghĩa là mới chỉ nhận ra.</span></div>
  <div class="kv"><span class="k">Track Code Lab</span><span class="v">Track Node.js đi kèm: 16 module, 160 bài tập có lời giải.</span></div>
  <div class="kv"><span class="k">Dự án nháp</span><span class="v">Dự án vứt đi, nơi phá hỏng là an toàn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Đọc tạo cảm giác đang học nhưng không phải — phải gõ, không chỉ đọc.</li><li>Mọi bài đi theo cùng vòng lặp năm bước: đọc, gõ lại, phá, giải thích, luyện tập.</li><li>Cố ý phá code (trong dự án nháp) là cách bạn học đọc lỗi.</li><li>Bài kiểm tra giải thích tách hiểu thật khỏi chỉ nhận ra.</li><li>Luyện mỗi chương trên module Code Lab tương ứng.</li></ul>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-0-4-cach-hoc" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 0.4 — seven study habits on real code</span><span class="lc-sub">Predict, read errors, shrink bugs, ask good questions, spaced review</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-0-4-cach-hoc" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 0.4 — bảy thói quen học trên mã thật</span><span class="lc-sub">Đoán trước, đọc lỗi, thu nhỏ lỗi, hỏi đúng cách, ôn giãn cách</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Setting up your environment|||0.3 — Cài đặt môi trường làm việc',
      slug: 'nodejs-0-3-cai-dat',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: Fireship "Node.js Ultimate Beginner's Guide" — tổng quan Node cho người mới.
      video: { url: 'https://youtu.be/ENrzD9HAZK4', durationSeconds: 0 },
      description: 'Cài Node bằng trình quản lý phiên bản, kiểm tra máy đã sẵn sàng, và chạy chương trình Node đầu tiên.',
      content: `${G003}

<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Setting up your environment</h2>
<p class="lead">Install Node <strong>through a version manager</strong>, never from the plain installer. Every real project pins a Node version, and sooner or later you will work on two projects that disagree. A version manager makes that a one-command switch instead of a reinstall.</p>

<h3>Which version?</h3>
<p>Node ships a new major every 6 months. Even-numbered majors (20, 22, 24…) become <strong>LTS</strong> — long-term support, patched for about 30 months (12 months of active support plus 18 of maintenance). Odd majors are experimental and must never run in production.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Use</span><span class="v">The current LTS. This course is written and verified on Node 22.x.</span></div>
  <div class="kv"><span class="k">Avoid</span><span class="v">Odd majors (21, 23) and anything past end-of-life (16, 18 and, as of October 2026, 20 are done).</span></div>
  <div class="kv"><span class="k">Rule</span><span class="v">Your laptop, your CI and your server should run the same major. Version drift causes bugs that only appear after deploy.</span></div>
</div>

<h3>macOS / Linux — nvm</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1. install nvm (the version manager itself)</span>
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

<span class="tok-comment"># 2. reopen the terminal, then install + activate Node 22 LTS</span>
nvm install 22
nvm use 22
nvm alias default 22   <span class="tok-comment"># make it the default for new shells</span></code></pre>
<div class="pitfall">If <code>nvm: command not found</code> after installing: the installer appended its setup lines to your shell profile, and <strong>an already-open terminal never re-reads that file</strong>. Close the window and open a new one. On zsh the file is <code>~/.zshrc</code>, on bash it's <code>~/.bashrc</code>.</div>

<h3>Windows — nvm-windows or fnm</h3>
<p>The Linux nvm does not work on Windows. Use <a href="https://github.com/coreybutler/nvm-windows/releases" target="_blank" rel="noopener">nvm-windows</a> (download the installer) or <code>winget install Schniz.fnm</code>. Then:</p>
<pre><code>nvm install 22.21.0
nvm use 22.21.0</code></pre>
<div class="callout warn">On Windows, run the install from a terminal opened <strong>as Administrator</strong>, and if you previously installed Node from nodejs.org, uninstall that first — two Nodes on the PATH is a debugging nightmare.</div>

<h3>Verify the install</h3>
<p>Three commands. All three must answer, and the Node major must be the one you expect:</p>
<pre><code class="language-bash">node -v
npm -v
node -p "process.versions.v8"</code></pre>
<div class="out">v22.21.0
10.9.4
12.4.254.21-node.33</div>
<p>Your exact numbers will differ (a newer patch such as 22.23.x is normal): only the major, <strong>22</strong>, has to match.</p>
<p>That third line is worth a pause: it proves Node is really a wrapper around <strong>V8</strong>, Chrome's JavaScript engine. Chapter 2 goes into what else is bundled in there — the answer is mostly <em>libuv</em>, the library that gives Node its event loop:</p>
<pre><code class="language-bash">node -p "process.versions.uv"</code></pre>
<div class="out">1.51.0</div>

<h3>The editor</h3>
<p>Use <strong>VS Code</strong> unless you already have a strong preference. Install these four extensions — they pay for themselves in the first week:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">ESLint</span><span class="v">Catches real bugs (unused variable, unreachable code, missing await) as you type.</span></div>
  <div class="kv"><span class="k">Prettier</span><span class="v">Formats on save so you stop arguing with yourself about commas.</span></div>
  <div class="kv"><span class="k">REST Client / Thunder Client</span><span class="v">Send HTTP requests from inside the editor — no need to alt-tab to Postman.</span></div>
  <div class="kv"><span class="k">Error Lens</span><span class="v">Shows the error inline on the line, instead of hiding it in a panel you never open.</span></div>
</div>

<h3>Your first Node program</h3>
<p>Create a folder, put one file in it, run it. That is the whole ceremony:</p>
<pre><code class="language-javascript"><span class="tok-comment">// hello.js</span>
<span class="tok-keyword">const</span> os = <span class="tok-function">require</span>(<span class="tok-string">'node:os'</span>);

<span class="tok-function">console.log</span>(<span class="tok-string">'Node version:'</span>, process.version);
<span class="tok-function">console.log</span>(<span class="tok-string">'Platform:'</span>, process.platform, process.arch);
<span class="tok-function">console.log</span>(<span class="tok-string">'CPU cores:'</span>, os.<span class="tok-function">cpus</span>().length);
<span class="tok-function">console.log</span>(<span class="tok-string">'Free memory (MB):'</span>, Math.<span class="tok-function">round</span>(os.<span class="tok-function">freemem</span>() / 1024 / 1024));</code></pre>
<pre><code class="language-bash">node hello.js</code></pre>
<div class="out">Node version: v22.21.0
Platform: darwin arm64
CPU cores: 10
Free memory (MB): 1873</div>
<p>Your numbers will differ — that's the point. <code>process</code> and <code>os</code> are built into the runtime; there is nothing to install. Chapter 3 covers them properly.</p>
<div class="pitfall">Notice <code>require('node:os')</code>, not <code>require('os')</code>. Both work, but the <code>node:</code> prefix says "this is a built-in, not a package from npm". It removes any ambiguity if someone ever publishes a package literally named <code>os</code> — and that class of attack is real. Chapter 4 covers it.</div>

<h3>One more thing: the REPL</h3>
<p>Type <code>node</code> with no filename and you get an interactive prompt. It is the fastest way to answer "what does this expression actually return?":</p>
<pre><code>node</code></pre>
<div class="out">Welcome to Node.js v22.21.0.
Type ".help" for more information.
&gt; [1,2,3].map(n =&gt; n * 2)
[ 2, 4, 6 ]
&gt; typeof null
'object'
&gt; .exit</div>
<div class="note-ct">This site pins Node 22 in three places at once: <code>package.json</code> engines, the Dockerfile base image, and the CI workflow. When they disagree, the code passes on a laptop and fails on the server — which is exactly the kind of bug that only shows up in front of users.</div>
<h3>Getting a Node version you can change later</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Install a version manager, not Node</span><span class="lz-d"><code>nvm</code>, <code>fnm</code> or <code>volta</code>. A system-wide Node from a package manager is the one you cannot change when a project needs another.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Pin the version per project</span><span class="lz-d">An <code>.nvmrc</code> or the <code>engines</code> field. Then &quot;works on my machine&quot; has one fewer meaning.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Use an LTS release</span><span class="lz-d">Even-numbered majors get 30 months of support. An odd-numbered one is fine to try and wrong to deploy.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Then confirm what is actually running</span><span class="lz-d"><code>node --version</code> in a <em>new</em> terminal — the old one read its PATH when it started, which is half of all &quot;it did not install&quot; reports.</span></div>
</div>
<a class="link-card exphub" href="/exp-hub/nodejs-cai-dat-moi-truong${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Environment setup guide — downloads &amp; troubleshooting</span><span class="lc-sub">Step-by-step nvm / fnm / VS Code setup for Windows, macOS and Linux, with official download links — on Exp Hub.</span></span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-0-3-cai-dat" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Next in the TypeScript course — 0.3: Node 22, TypeScript 7 and VS Code</span><span class="lc-sub">Same: Node 22 installed with nvm, npm init, a project folder. Different: on top of it you pin typescript 7.0.2 and @types/node, write the course tsconfig, and let Node 22 run .ts files directly while tsc does the checking.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>

<h3>🧪 Practice (10–15 min)</h3>
<div class="callout ok"><ol>
<li>Install Node through a version manager (nvm on macOS/Linux, nvm-windows or fnm on Windows), then run <code>nvm install 22</code> and <code>nvm use 22</code>.</li>
<li>Verify with the three commands <code>node -v</code>, <code>npm -v</code>, <code>node -p "process.versions.v8"</code> — confirm the major is 22.</li>
<li>Write and run a one-file <code>hello.js</code> that prints <code>process.version</code> and your CPU core count, then open the REPL by typing <code>node</code> and evaluate <code>typeof null</code>.</li>
</ol>
<p><strong>Done when:</strong> a new terminal reports Node major 22, your hello.js runs, and you have evaluated one expression in the REPL.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Version manager</span><span class="v">nvm / fnm / volta — installs and switches Node versions per project.</span></div>
  <div class="kv"><span class="k">LTS vs odd major</span><span class="v">Even majors (22, 24) are supported; odd ones are experimental, never in production.</span></div>
  <div class="kv"><span class="k">node -v / npm -v</span><span class="v">The quickest check that Node and npm are installed and which version.</span></div>
  <div class="kv"><span class="k">REPL</span><span class="v">The interactive <code>node</code> prompt for trying expressions instantly.</span></div>
  <div class="kv"><span class="k">.nvmrc / engines</span><span class="v">Where a project pins its Node version so everyone matches.</span></div>
  <div class="kv"><span class="k">node: prefix</span><span class="v">Writing <code>require('node:os')</code> marks a module as a built-in, not an npm package.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Install Node through a version manager, never the plain installer, so switching versions is one command.</li><li>Use the current LTS (Node 22 here); odd majors and end-of-life versions are off limits.</li><li>Verify with node -v, npm -v and process.versions.v8, checking the major matches.</li><li>Laptop, CI and server should run the same major to avoid deploy-only bugs.</li><li>The REPL is the fastest way to answer "what does this expression return?".</li></ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Cài đặt môi trường làm việc</h2>
<p class="lead">Hãy cài Node <strong>qua trình quản lý phiên bản</strong>, đừng cài bằng bộ cài thường. Dự án thật nào cũng ghim một phiên bản Node, và sớm muộn bạn sẽ làm hai dự án đòi hai phiên bản khác nhau. Có trình quản lý phiên bản thì đó là một câu lệnh đổi qua lại, thay vì cài lại từ đầu.</p>

<h3>Dùng phiên bản nào?</h3>
<p>Node ra một bản major mới mỗi 6 tháng. Các major số chẵn (20, 22, 24…) trở thành <strong>LTS</strong> — hỗ trợ dài hạn, được vá lỗi khoảng 30 tháng (12 tháng hỗ trợ chủ động cộng 18 tháng bảo trì). Major số lẻ mang tính thử nghiệm, tuyệt đối không chạy production.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Nên dùng</span><span class="v">Bản LTS hiện hành. Khoá này viết và kiểm chứng trên Node 22.x.</span></div>
  <div class="kv"><span class="k">Tránh</span><span class="v">Major số lẻ (21, 23) và những bản đã hết hạn hỗ trợ (16, 18 và tính tới tháng 10/2026 cả 20 đã hết).</span></div>
  <div class="kv"><span class="k">Nguyên tắc</span><span class="v">Máy bạn, CI và server nên chạy cùng một major. Lệch phiên bản đẻ ra bug chỉ xuất hiện sau khi deploy.</span></div>
</div>

<h3>macOS / Linux — nvm</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1. cài nvm (bản thân trình quản lý phiên bản)</span>
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

<span class="tok-comment"># 2. mở lại terminal, rồi cài + kích hoạt Node 22 LTS</span>
nvm install 22
nvm use 22
nvm alias default 22   <span class="tok-comment"># đặt làm mặc định cho các phiên terminal mới</span></code></pre>
<div class="pitfall">Nếu sau khi cài mà báo <code>nvm: command not found</code>: bộ cài đã ghi thêm mấy dòng thiết lập vào file cấu hình shell, nhưng <strong>terminal đang mở sẵn không bao giờ đọc lại file đó</strong>. Hãy đóng cửa sổ và mở cửa sổ mới. Với zsh file đó là <code>~/.zshrc</code>, với bash là <code>~/.bashrc</code>.</div>

<h3>Windows — nvm-windows hoặc fnm</h3>
<p>Bản nvm cho Linux không chạy trên Windows. Dùng <a href="https://github.com/coreybutler/nvm-windows/releases" target="_blank" rel="noopener">nvm-windows</a> (tải bộ cài) hoặc <code>winget install Schniz.fnm</code>. Sau đó:</p>
<pre><code>nvm install 22.21.0
nvm use 22.21.0</code></pre>
<div class="callout warn">Trên Windows, hãy chạy lệnh cài từ terminal mở <strong>bằng quyền Administrator</strong>; và nếu trước đó bạn đã cài Node từ nodejs.org thì gỡ bản đó trước — hai bản Node cùng nằm trong PATH là một cơn ác mộng khi gỡ lỗi.</div>

<h3>Kiểm tra sau khi cài</h3>
<p>Ba câu lệnh. Cả ba phải trả lời được, và major của Node phải đúng bản bạn muốn:</p>
<pre><code class="language-bash">node -v
npm -v
node -p "process.versions.v8"</code></pre>
<div class="out">v22.21.0
10.9.4
12.4.254.21-node.33</div>
<p>Số cụ thể của bạn sẽ khác (bản vá mới hơn như 22.23.x là bình thường): chỉ cần phần major, <strong>22</strong>, khớp.</p>
<p>Dòng thứ ba đáng để dừng lại một nhịp: nó chứng minh Node thực chất là lớp vỏ bọc quanh <strong>V8</strong> — engine JavaScript của Chrome. Chương 2 sẽ đi vào những gì còn được đóng gói kèm trong đó — chủ yếu là <em>libuv</em>, thư viện tạo nên event loop của Node:</p>
<pre><code class="language-bash">node -p "process.versions.uv"</code></pre>
<div class="out">1.51.0</div>

<h3>Trình soạn thảo</h3>
<p>Dùng <strong>VS Code</strong> trừ khi bạn đã quen công cụ khác. Cài bốn extension sau — chúng hoàn vốn ngay trong tuần đầu:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">ESLint</span><span class="v">Bắt bug thật (biến thừa, code không bao giờ chạy tới, quên await) ngay lúc bạn gõ.</span></div>
  <div class="kv"><span class="k">Prettier</span><span class="v">Tự định dạng khi lưu, để bạn thôi tranh cãi với chính mình về dấu phẩy.</span></div>
  <div class="kv"><span class="k">REST Client / Thunder Client</span><span class="v">Gửi request HTTP ngay trong editor — khỏi phải nhảy qua Postman.</span></div>
  <div class="kv"><span class="k">Error Lens</span><span class="v">Hiện lỗi ngay trên dòng code, thay vì giấu trong một panel bạn chẳng bao giờ mở.</span></div>
</div>

<h3>Chương trình Node đầu tiên</h3>
<p>Tạo một thư mục, bỏ vào một file, chạy nó. Toàn bộ nghi thức chỉ có vậy:</p>
<pre><code class="language-javascript"><span class="tok-comment">// hello.js</span>
<span class="tok-keyword">const</span> os = <span class="tok-function">require</span>(<span class="tok-string">'node:os'</span>);

<span class="tok-function">console.log</span>(<span class="tok-string">'Phiên bản Node:'</span>, process.version);
<span class="tok-function">console.log</span>(<span class="tok-string">'Nền tảng:'</span>, process.platform, process.arch);
<span class="tok-function">console.log</span>(<span class="tok-string">'Số nhân CPU:'</span>, os.<span class="tok-function">cpus</span>().length);
<span class="tok-function">console.log</span>(<span class="tok-string">'RAM trống (MB):'</span>, Math.<span class="tok-function">round</span>(os.<span class="tok-function">freemem</span>() / 1024 / 1024));</code></pre>
<pre><code class="language-bash">node hello.js</code></pre>
<div class="out">Phiên bản Node: v22.21.0
Nền tảng: darwin arm64
Số nhân CPU: 10
RAM trống (MB): 1873</div>
<p>Số của bạn sẽ khác — đó mới là điều đáng nói. <code>process</code> và <code>os</code> nằm sẵn trong runtime; không phải cài gì cả. Chương 3 sẽ mổ xẻ chúng tử tế.</p>
<div class="pitfall">Để ý <code>require('node:os')</code> chứ không phải <code>require('os')</code>. Cả hai đều chạy, nhưng tiền tố <code>node:</code> nói rõ "đây là module dựng sẵn, không phải gói tải từ npm". Nó xoá mọi mơ hồ nếu một ngày có người đăng lên npm một gói tên đúng là <code>os</code> — và kiểu tấn công đó có thật. Chương 4 sẽ nói tới.</div>

<h3>Một thứ nữa: REPL</h3>
<p>Gõ <code>node</code> mà không kèm tên file, bạn được một dấu nhắc tương tác. Đây là cách nhanh nhất để trả lời câu hỏi "biểu thức này thật ra trả về cái gì?":</p>
<pre><code>node</code></pre>
<div class="out">Welcome to Node.js v22.21.0.
Type ".help" for more information.
&gt; [1,2,3].map(n =&gt; n * 2)
[ 2, 4, 6 ]
&gt; typeof null
'object'
&gt; .exit</div>
<div class="note-ct">Website này ghim Node 22 ở ba nơi cùng lúc: mục engines trong <code>package.json</code>, image nền trong Dockerfile, và workflow CI. Khi ba chỗ đó lệch nhau, code chạy ngon trên laptop nhưng chết trên server — đúng loại bug chỉ lộ ra trước mặt người dùng.</div>
<h3>Có được một phiên bản Node mà sau này đổi được</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Hãy cài một trình quản lý phiên bản, đừng cài Node</span><span class="lz-d"><code>nvm</code>, <code>fnm</code> hoặc <code>volta</code>. Một bản Node cài toàn hệ thống từ trình quản lý gói là cái bạn KHÔNG đổi được khi một dự án cần bản khác.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Ghim phiên bản theo từng dự án</span><span class="lz-d">Một file <code>.nvmrc</code> hoặc trường <code>engines</code>. Khi đó câu &quot;máy tôi chạy được&quot; bớt đi một tầng nghĩa.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hãy dùng một bản LTS</span><span class="lz-d">Các bản major số chẵn được hỗ trợ 30 tháng. Một bản số lẻ thì thử thì được mà đem đi triển khai là sai.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Rồi xác nhận thứ đang thật sự chạy</span><span class="lz-d"><code>node --version</code> trong một terminal MỚI — cái cũ đã đọc PATH từ lúc nó khởi động, và đó là một nửa số báo cáo &quot;cài không được&quot;.</span></div>
</div>
<a class="link-card exphub" href="/exp-hub/nodejs-cai-dat-moi-truong${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn cài môi trường — link tải &amp; xử lý lỗi</span><span class="lc-sub">Các bước cài nvm / fnm / VS Code cho Windows, macOS, Linux kèm link tải chính chủ — trên Exp Hub.</span></span>
</a>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-0-3-cai-dat" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Học tiếp ở khoá TypeScript — 0.3: Node 22, TypeScript 7 và VS Code</span><span class="lc-sub">Giống: Node 22 cài bằng nvm, npm init, một thư mục dự án. Khác: trên nền đó bạn ghim typescript 7.0.2 và @types/node, viết tsconfig của khoá, và để Node 22 chạy thẳng tệp .ts còn tsc lo phần kiểm kiểu.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>

<h3>🧪 Thực hành (10–15 phút)</h3>
<div class="callout ok"><ol>
<li>Cài Node qua trình quản lý phiên bản (nvm trên macOS/Linux, nvm-windows hoặc fnm trên Windows), rồi chạy <code>nvm install 22</code> và <code>nvm use 22</code>.</li>
<li>Kiểm bằng ba lệnh <code>node -v</code>, <code>npm -v</code>, <code>node -p "process.versions.v8"</code> — xác nhận major là 22.</li>
<li>Viết và chạy một file <code>hello.js</code> in <code>process.version</code> và số nhân CPU, rồi mở REPL bằng cách gõ <code>node</code> và tính <code>typeof null</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> một terminal mới báo Node major 22, hello.js chạy, và bạn đã tính một biểu thức trong REPL.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trình quản lý phiên bản</span><span class="v">nvm / fnm / volta — cài và đổi phiên bản Node theo từng dự án.</span></div>
  <div class="kv"><span class="k">LTS vs major lẻ</span><span class="v">Major chẵn (22, 24) được hỗ trợ; major lẻ là thử nghiệm, không chạy production.</span></div>
  <div class="kv"><span class="k">node -v / npm -v</span><span class="v">Cách nhanh nhất kiểm Node và npm đã cài và phiên bản nào.</span></div>
  <div class="kv"><span class="k">REPL</span><span class="v">Dấu nhắc tương tác <code>node</code> để thử biểu thức tức thì.</span></div>
  <div class="kv"><span class="k">.nvmrc / engines</span><span class="v">Nơi dự án ghim phiên bản Node để mọi người khớp nhau.</span></div>
  <div class="kv"><span class="k">tiền tố node:</span><span class="v">Viết <code>require('node:os')</code> đánh dấu module là built-in, không phải gói npm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Cài Node qua trình quản lý phiên bản, đừng dùng bộ cài thường, để đổi phiên bản chỉ còn một câu lệnh.</li><li>Dùng LTS hiện hành (Node 22 ở đây); major lẻ và bản hết hạn thì tránh.</li><li>Kiểm bằng node -v, npm -v và process.versions.v8, soát major cho khớp.</li><li>Máy, CI và server nên chạy cùng một major để tránh bug chỉ hiện sau deploy.</li><li>REPL là cách nhanh nhất trả lời "biểu thức này trả về gì?".</li></ul>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-0-3-cai-dat-may" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 0.3 — PATH and command not found</span><span class="lc-sub">If node or npm is not found: how the shell finds programs, and a script that checks the machine</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-0-3-cai-dat-may" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 0.3 — PATH và command not found</span><span class="lc-sub">Nếu không tìm thấy node hay npm: shell tìm chương trình thế nào, và script tự kiểm máy</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — The project we build together|||0.4 — Dự án xuyên suốt cả khoá',
      slug: 'nodejs-0-4-du-an',
      type: 'VIDEO',
      description: 'Một API duy nhất được xây dần qua 18 chương — từ 20 dòng đầu tiên tới bản chạy production.',
      content: `${G004}

<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>The project we build together</h2>
<p class="lead">Chapters are not disconnected demos. Every chapter adds one layer to <strong>one API</strong> — a notes service — until it becomes something you could genuinely put on the internet. Learning a backend piecemeal is why most people can follow a tutorial but not start a project from an empty folder.</p>

<h3>What we are building: Notes API</h3>
<p>A service where a user can write notes, organise them, attach files and share them with other users in real time. Small enough to hold in your head, big enough to force every real problem to appear: authentication, permissions, relations, uploads, caching, background work.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">HTTP layer</span><span class="lz-lnote">routes · validation · auth middleware · error handling</span></div>
  <div class="lz-layer"><span class="lz-lname">Service layer</span><span class="lz-lnote">business rules — "can this user share this note?"</span></div>
  <div class="lz-layer"><span class="lz-lname">Data layer</span><span class="lz-lnote">Prisma models · migrations · transactions</span></div>
  <div class="lz-layer"><span class="lz-lname">Infrastructure</span><span class="lz-lnote">PostgreSQL · Redis · object storage · queue</span></div>
</div>

<h3>How it grows, chapter by chapter</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ch 3–5</span><span class="v">A server that returns notes from an in-memory array. No database yet — on purpose.</span></div>
  <div class="kv"><span class="k">Ch 6</span><span class="v">Proper REST: correct status codes, validated input, pagination, consistent error shape.</span></div>
  <div class="kv"><span class="k">Ch 7</span><span class="v">PostgreSQL through Prisma. The array dies; migrations and relations arrive.</span></div>
  <div class="kv"><span class="k">Ch 8–9</span><span class="v">Registration, login, refresh tokens, roles. Now a note belongs to <em>someone</em>.</span></div>
  <div class="kv"><span class="k">Ch 10</span><span class="v">File attachments uploaded straight to object storage, served over a CDN.</span></div>
  <div class="kv"><span class="k">Ch 11</span><span class="v">Live collaboration: someone shares a note, your screen updates without refresh.</span></div>
  <div class="kv"><span class="k">Ch 12–13</span><span class="v">Redis caching for hot reads; a queue for slow work (thumbnails, email).</span></div>
  <div class="kv"><span class="k">Ch 14–16</span><span class="v">Tests, structured logs, health checks, and a load test that finds the bottleneck.</span></div>
  <div class="kv"><span class="k">Ch 17–18</span><span class="v">Dockerised, deployed, and refactored into a shape that survives a second developer.</span></div>
</div>

<h3>The folder we grow into</h3>
<p>We do <em>not</em> start with this structure — starting with folders you don't need yet is how projects become confusing. We arrive here around chapter 6, when the pain of a single file becomes real:</p>
<pre><code>notes-api/
├─ src/
│  ├─ routes/          <span class="tok-comment"># HTTP endpoints only — thin</span>
│  ├─ services/        <span class="tok-comment"># business logic — the valuable part</span>
│  ├─ middleware/      <span class="tok-comment"># auth, validation, error handler</span>
│  ├─ lib/             <span class="tok-comment"># shared helpers (db client, logger)</span>
│  └─ index.js         <span class="tok-comment"># wiring: create app, start listening</span>
├─ prisma/
│  └─ schema.prisma    <span class="tok-comment"># data model + migrations</span>
├─ tests/
├─ .env                <span class="tok-comment"># secrets — NEVER committed</span>
├─ .env.example        <span class="tok-comment"># the same keys, no values — committed</span>
└─ package.json</code></pre>
<div class="callout ok">One rule worth adopting now: <strong>routes stay thin, services stay testable</strong>. A route reads the request, calls one service function, and formats the response. If business rules leak into routes, you cannot test them without faking HTTP.</div>

<h3>Track it in Git from lesson one</h3>
<p>Not because the course requires it, but because you will want to look back at "how did it look before I added auth?". Start now:</p>
<pre><code class="language-bash">mkdir notes-api &amp;&amp; cd notes-api
git init
printf 'node_modules/\\n.env\\n' &gt; .gitignore
git add . &amp;&amp; git commit -m "chore: empty project"</code></pre>
<div class="pitfall">Put <code>.env</code> in <code>.gitignore</code> <strong>before</strong> the first commit that contains it. Git remembers history: once a password is committed, deleting it later does not remove it from the repository — it has to be treated as leaked and rotated. This mistake is extremely common and extremely expensive.</div>
<div class="note-ct">The layering above is the same one this site uses: <code>src/routes/</code> for endpoints, <code>src/services/</code> for the rules, <code>prisma/schema.prisma</code> for the model. It is not academic — it is what lets a feature like "share a note with another user" be written once and reused by both the REST API and the realtime socket handler.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-321" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 321 — RESTful API Design and Implementation</span><span class="lc-sub">10 exercises that drill the exact API shape we build from chapter 6 onward.</span></span>
</a>

<h3>🧪 Practice (10–15 min)</h3>
<div class="callout ok"><ol>
<li>Create the project folder, run <code>git init</code>, and make your first commit with just a README and a .gitignore (ignore <code>node_modules</code>).</li>
<li>Write down, in one line each, the Notes API endpoints you expect by the end of the course (create a note, list notes, update, delete).</li>
<li>Sketch on paper the folder layout the course grows into (routes, services, config) so you recognise each piece when it appears.</li>
</ol>
<p><strong>Done when:</strong> you have a git-tracked project folder with a first commit and a one-line plan of the Notes API you will build.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Notes API</span><span class="v">The single project built incrementally across all 18 chapters.</span></div>
  <div class="kv"><span class="k">Incremental build</span><span class="v">Each chapter adds one layer instead of starting a new toy app.</span></div>
  <div class="kv"><span class="k">Folder structure</span><span class="v">routes / services / config — the shape the project grows into.</span></div>
  <div class="kv"><span class="k">Git from lesson one</span><span class="v">Version control from the first commit, so you always have a state to return to.</span></div>
  <div class="kv"><span class="k">.gitignore</span><span class="v">Lists files Git must not track, such as <code>node_modules</code> and <code>.env</code>.</span></div>
  <div class="kv"><span class="k">Endpoint</span><span class="v">One URL + method the API answers, e.g. <code>POST /notes</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>One project — a Notes API — is built across all 18 chapters, from 20 lines to a production build.</li><li>Each chapter adds a layer rather than starting over, so the whole thing stays coherent.</li><li>The folder grows into routes, services and config as features arrive.</li><li>Track it in Git from the first lesson so there is always a working state to return to.</li></ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Dự án xuyên suốt cả khoá</h2>
<p class="lead">Các chương không phải những bản demo rời rạc. Mỗi chương thêm một tầng vào <strong>một API duy nhất</strong> — một dịch vụ ghi chú — cho tới khi nó thành thứ bạn thực sự đưa lên internet được. Học backend theo kiểu chắp vá chính là lý do đa số người làm theo tutorial được nhưng không tự khởi động nổi một dự án từ thư mục trống.</p>

<h3>Thứ ta sẽ xây: Notes API</h3>
<p>Một dịch vụ cho phép người dùng viết ghi chú, sắp xếp, đính kèm file và chia sẻ cho người khác theo thời gian thực. Đủ nhỏ để giữ trọn trong đầu, đủ lớn để buộc mọi vấn đề thật lộ ra: xác thực, phân quyền, quan hệ dữ liệu, upload, cache, xử lý nền.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tầng HTTP</span><span class="lz-lnote">route · kiểm tra đầu vào · middleware xác thực · xử lý lỗi</span></div>
  <div class="lz-layer"><span class="lz-lname">Tầng nghiệp vụ</span><span class="lz-lnote">luật nghiệp vụ — "người này có được chia sẻ ghi chú này không?"</span></div>
  <div class="lz-layer"><span class="lz-lname">Tầng dữ liệu</span><span class="lz-lnote">model Prisma · migration · transaction</span></div>
  <div class="lz-layer"><span class="lz-lname">Hạ tầng</span><span class="lz-lnote">PostgreSQL · Redis · lưu trữ đối tượng · hàng đợi</span></div>
</div>

<h3>Nó lớn lên thế nào qua từng chương</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ch 3–5</span><span class="v">Một server trả về ghi chú từ mảng trong bộ nhớ. Chưa có database — cố ý như vậy.</span></div>
  <div class="kv"><span class="k">Ch 6</span><span class="v">REST đàng hoàng: mã trạng thái đúng, dữ liệu vào được kiểm tra, phân trang, hình dạng lỗi nhất quán.</span></div>
  <div class="kv"><span class="k">Ch 7</span><span class="v">PostgreSQL qua Prisma. Mảng bị khai tử; migration và quan hệ xuất hiện.</span></div>
  <div class="kv"><span class="k">Ch 8–9</span><span class="v">Đăng ký, đăng nhập, refresh token, vai trò. Giờ mỗi ghi chú thuộc về <em>một ai đó</em>.</span></div>
  <div class="kv"><span class="k">Ch 10</span><span class="v">File đính kèm upload thẳng lên lưu trữ đối tượng, phục vụ qua CDN.</span></div>
  <div class="kv"><span class="k">Ch 11</span><span class="v">Cộng tác trực tiếp: ai đó chia sẻ ghi chú, màn hình bạn tự cập nhật không cần tải lại.</span></div>
  <div class="kv"><span class="k">Ch 12–13</span><span class="v">Cache bằng Redis cho các lượt đọc nóng; hàng đợi cho việc chậm (ảnh thu nhỏ, email).</span></div>
  <div class="kv"><span class="k">Ch 14–16</span><span class="v">Test, log có cấu trúc, health check, và một bài test tải tìm ra nút thắt cổ chai.</span></div>
  <div class="kv"><span class="k">Ch 17–18</span><span class="v">Đóng gói Docker, deploy, và tái cấu trúc thành hình hài chịu được người thứ hai vào làm cùng.</span></div>
</div>

<h3>Cấu trúc thư mục ta sẽ tiến tới</h3>
<p>Ta <em>không</em> bắt đầu bằng cấu trúc này — dựng sẵn những thư mục chưa cần chính là cách làm dự án trở nên rối. Ta sẽ tới đây vào khoảng chương 6, khi nỗi khổ của việc nhét tất cả vào một file trở nên có thật:</p>
<pre><code>notes-api/
├─ src/
│  ├─ routes/          <span class="tok-comment"># chỉ chứa điểm cuối HTTP — mỏng thôi</span>
│  ├─ services/        <span class="tok-comment"># logic nghiệp vụ — phần giá trị nhất</span>
│  ├─ middleware/      <span class="tok-comment"># xác thực, kiểm tra đầu vào, bắt lỗi</span>
│  ├─ lib/             <span class="tok-comment"># tiện ích dùng chung (client DB, logger)</span>
│  └─ index.js         <span class="tok-comment"># lắp ráp: tạo app, mở cổng lắng nghe</span>
├─ prisma/
│  └─ schema.prisma    <span class="tok-comment"># mô hình dữ liệu + migration</span>
├─ tests/
├─ .env                <span class="tok-comment"># bí mật — TUYỆT ĐỐI không commit</span>
├─ .env.example        <span class="tok-comment"># y hệt các khoá, bỏ trống giá trị — có commit</span>
└─ package.json</code></pre>
<div class="callout ok">Một nguyên tắc nên nhận ngay từ bây giờ: <strong>route giữ mỏng, service giữ test được</strong>. Route đọc request, gọi một hàm service, rồi định dạng phản hồi. Nếu luật nghiệp vụ rò rỉ vào route, bạn không thể test chúng mà không giả lập cả HTTP.</div>

<h3>Đưa vào Git ngay từ bài đầu</h3>
<p>Không phải vì khoá học bắt buộc, mà vì rồi bạn sẽ muốn ngoái lại xem "trước khi thêm xác thực thì nó trông thế nào?". Bắt đầu luôn:</p>
<pre><code class="language-bash">mkdir notes-api &amp;&amp; cd notes-api
git init
printf 'node_modules/\\n.env\\n' &gt; .gitignore
git add . &amp;&amp; git commit -m "chore: empty project"</code></pre>
<div class="pitfall">Hãy đưa <code>.env</code> vào <code>.gitignore</code> <strong>trước</strong> lần commit đầu tiên có chứa nó. Git nhớ toàn bộ lịch sử: một khi mật khẩu đã được commit, xoá đi sau đó KHÔNG gỡ được nó khỏi kho — phải coi như đã lộ và đi đổi khoá. Lỗi này cực kỳ phổ biến và cực kỳ đắt.</div>
<div class="note-ct">Cách phân tầng ở trên chính là cách website này đang dùng: <code>src/routes/</code> cho điểm cuối, <code>src/services/</code> cho luật nghiệp vụ, <code>prisma/schema.prisma</code> cho mô hình dữ liệu. Nó không phải lý thuyết suông — đó là thứ cho phép một tính năng như "chia sẻ ghi chú cho người khác" được viết một lần rồi dùng lại cho cả REST API lẫn phần xử lý socket realtime.</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-321" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 321 — Thiết kế &amp; hiện thực RESTful API</span><span class="lc-sub">10 bài tập luyện đúng hình dạng API mà ta xây từ chương 6 trở đi.</span></span>
</a>

<h3>🧪 Thực hành (10–15 phút)</h3>
<div class="callout ok"><ol>
<li>Tạo thư mục dự án, chạy <code>git init</code>, và tạo commit đầu tiên chỉ với một README và một .gitignore (bỏ qua <code>node_modules</code>).</li>
<li>Ghi lại, mỗi dòng một ý, các endpoint Notes API bạn kỳ vọng có vào cuối khoá (tạo note, liệt kê note, sửa, xoá).</li>
<li>Phác trên giấy bố cục thư mục mà khoá lớn dần tới (routes, services, config) để nhận ra từng mảnh khi nó xuất hiện.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một thư mục dự án được Git theo dõi với commit đầu tiên và một kế hoạch một dòng về Notes API sẽ xây.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Notes API</span><span class="v">Dự án duy nhất được xây dần qua cả 18 chương.</span></div>
  <div class="kv"><span class="k">Xây dần</span><span class="v">Mỗi chương thêm một tầng thay vì mở một app đồ chơi mới.</span></div>
  <div class="kv"><span class="k">Bố cục thư mục</span><span class="v">routes / services / config — hình dạng dự án lớn dần tới.</span></div>
  <div class="kv"><span class="k">Git từ bài một</span><span class="v">Quản lý phiên bản từ commit đầu tiên, để luôn có trạng thái để quay về.</span></div>
  <div class="kv"><span class="k">.gitignore</span><span class="v">Liệt kê file Git không được theo dõi, như <code>node_modules</code> và <code>.env</code>.</span></div>
  <div class="kv"><span class="k">Endpoint</span><span class="v">Một URL + method mà API trả lời, ví dụ <code>POST /notes</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một dự án — Notes API — được xây qua cả 18 chương, từ 20 dòng tới bản chạy production.</li><li>Mỗi chương thêm một tầng thay vì làm lại từ đầu, nên tổng thể luôn mạch lạc.</li><li>Thư mục lớn dần thành routes, services và config khi tính năng xuất hiện.</li><li>Theo dõi bằng Git từ bài đầu để luôn có một trạng thái chạy được để quay về.</li></ul>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-10-5-full-stack-picture" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 10.5 — The full-stack picture</span><span class="lc-sub">One click traced through every layer of a 130-line notes app with no framework — the starting point for this course</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-10-5-full-stack-picture" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 10.5 — Bức tranh full-stack</span><span class="lc-sub">Một cú bấm đi qua mọi tầng của app ghi chú 130 dòng không framework — điểm xuất phát của khoá này</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>
`,
    },
  ],
};
