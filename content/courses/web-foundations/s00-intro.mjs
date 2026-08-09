/**
 * Web Foundations — Mục 0: Giới thiệu · Nền tảng · Cài đặt · Cách học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi (số khối phải bằng nhau).
 * ⚠️ KHÔNG dùng backtick trần trong content (dùng &#96;); mọi `${` trong code mẫu
 * escape thành \${. Bài QUIZ (nếu có) phải có field content (string).
 */

export default {
  title: 'Section 0 — Introduction, Foundations & Setup|||Mục 0 — Giới thiệu, Nền tảng & Cài đặt',
  description: 'Đọc trước tiên: khoá này dành cho ai, vì sao cần nền tảng trước khi học Node.js/Next.js, một trang web hoạt động ra sao, cài đặt máy như thế nào, và cách học sao cho hiệu quả.',
  lessons: [
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Who this course is for & the full roadmap|||0.1 — Khoá này cho ai & lộ trình toàn khoá',
      slug: 'wf-0-1-gioi-thieu-lo-trinh',
      type: 'VIDEO',
      isFreePreview: true,
      // "100+ Web Development Things you Should Know" — Fireship (tổng quan nghề web).
      video: { url: 'https://youtu.be/erEgovG9WBs', durationSeconds: 0 },
      description: 'Vì sao người mới hay "học Node.js/Next.js mà chả hiểu gì", khoá nền tảng này lấp khoảng trống nào, và bản đồ 11 chương.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Start here — the foundation under every web course</h2>
<p class="lead">If you have ever opened a Node.js or Next.js course and felt lost within ten minutes, it is usually <strong>not because you are slow</strong>. It is because those courses quietly assume you already know a stack of things: HTML, CSS, JavaScript, how a browser talks to a server, what an API is, what a cookie does. This course fills exactly that gap, from zero.</p>

<h3>What "web development" actually means</h3>
<p>A website is two programs talking to each other. Your <strong>browser</strong> (Chrome, Safari…) is the <em>client</em>: it asks for things and shows them. Somewhere on the internet a <strong>server</strong> answers those requests. Everything you will learn falls into one of three buckets:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Frontend</span><span class="v">What runs in the browser — the pages, buttons, and interactions (HTML, CSS, JavaScript → React/Next.js).</span></div>
  <div class="kv"><span class="k">Backend</span><span class="v">What runs on the server — logic, saving data, checking passwords (Node.js, databases).</span></div>
  <div class="kv"><span class="k">The link between them</span><span class="v">How the two talk: HTTP requests, APIs, JSON, cookies. Miss this and nothing else clicks.</span></div>
</div>

<h3>Why a foundation first saves you months</h3>
<p>Jumping straight into a framework is like learning to drive on a Formula 1 car. You can copy what the instructor does, but the moment something breaks you have no idea why. Learn the road first — what an engine, a gear, and a brake are — and every advanced course afterwards feels like "oh, that is just X with a nicer name."</p>

<h3>The 11-chapter roadmap</h3>
<p>Each chapter ends with a line telling you what it unlocks:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ch 0</span><span class="v">How the web works — client/server, browser, DNS, HTTP/HTTPS.</span></div>
  <div class="kv"><span class="k">Ch 1</span><span class="v">Your tools — terminal, VS Code, Git &amp; GitHub, Node &amp; npm.</span></div>
  <div class="kv"><span class="k">Ch 2</span><span class="v">HTML — the structure of a page.</span></div>
  <div class="kv"><span class="k">Ch 3</span><span class="v">CSS — styling and responsive layout.</span></div>
  <div class="kv"><span class="k">Ch 4</span><span class="v">JavaScript — the language of the web.</span></div>
  <div class="kv"><span class="k">Ch 5</span><span class="v">Async JavaScript — Promises, async/await, the event loop, fetch.</span></div>
  <div class="kv"><span class="k">Ch 6</span><span class="v">HTTP &amp; APIs — methods, status codes, REST, JSON, query/params.</span></div>
  <div class="kv"><span class="k">Ch 7</span><span class="v">Cookies, sessions, auth/JWT, CORS, HTTPS &amp; basic security.</span></div>
  <div class="kv"><span class="k">Ch 8</span><span class="v">Data &amp; SQL — databases and CRUD.</span></div>
  <div class="kv"><span class="k">Ch 9</span><span class="v">TypeScript basics — JavaScript with types.</span></div>
  <div class="kv"><span class="k">Ch 10</span><span class="v">Thinking like a programmer — problem-solving, debugging, Git workflow.</span></div>
</div>
<p>Chapters 0–5 are the foundation for <strong>both</strong> Node.js and Next.js. Chapters 6–8 lean toward the <strong>backend</strong> (Node.js). All of it, plus JavaScript/TypeScript, is what makes <strong>Next.js/React</strong> readable.</p>

<div class="link-card"><a href="https://roadmap.sh/frontend" target="_blank" rel="noopener">roadmap.sh — the visual web developer roadmap</a></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Learn" target="_blank" rel="noopener">MDN — Learn web development (the reference we lean on)</a></div>

<p class="note-ct"><strong>How to use this course:</strong> read the lesson, then actually type the examples — do not just read them. Programming is a hands skill, like cooking. Watching someone cook does not teach your hands.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bắt đầu từ đây — nền móng bên dưới mọi khoá web</h2>
<p class="lead">Nếu bạn từng mở một khoá Node.js hay Next.js và thấy lạc lối chỉ sau mười phút, thường <strong>không phải vì bạn chậm</strong>. Mà vì các khoá đó âm thầm mặc định bạn đã biết một loạt thứ: HTML, CSS, JavaScript, cách trình duyệt nói chuyện với máy chủ, API là gì, cookie làm gì. Khoá này lấp đúng khoảng trống ấy, từ số 0.</p>

<h3>"Lập trình web" thực chất là gì</h3>
<p>Một trang web là hai chương trình nói chuyện với nhau. <strong>Trình duyệt</strong> của bạn (Chrome, Safari…) là <em>client</em>: nó hỏi và hiển thị. Đâu đó trên internet có một <strong>máy chủ (server)</strong> trả lời các yêu cầu đó. Mọi thứ bạn sắp học rơi vào một trong ba nhóm:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Frontend</span><span class="v">Thứ chạy trong trình duyệt — trang, nút bấm, tương tác (HTML, CSS, JavaScript → React/Next.js).</span></div>
  <div class="kv"><span class="k">Backend</span><span class="v">Thứ chạy trên máy chủ — logic, lưu dữ liệu, kiểm mật khẩu (Node.js, cơ sở dữ liệu).</span></div>
  <div class="kv"><span class="k">Cầu nối giữa hai bên</span><span class="v">Cách hai bên nói chuyện: request HTTP, API, JSON, cookie. Thiếu phần này thì mọi thứ khác không "khớp".</span></div>
</div>

<h3>Vì sao học nền tảng trước tiết kiệm cho bạn hàng tháng trời</h3>
<p>Nhảy thẳng vào một framework giống như tập lái trên xe đua F1. Bạn có thể bắt chước theo giảng viên, nhưng vừa có sự cố là chịu, không biết vì sao. Học con đường trước — động cơ, số, phanh là gì — thì mọi khoá nâng cao sau đó đều thành "à, cái này chỉ là X đổi tên cho oách."</p>

<h3>Lộ trình 11 chương</h3>
<p>Mỗi chương kết thúc bằng một dòng cho biết nó mở khoá được gì:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ch 0</span><span class="v">Web hoạt động thế nào — client/server, trình duyệt, DNS, HTTP/HTTPS.</span></div>
  <div class="kv"><span class="k">Ch 1</span><span class="v">Bộ công cụ — terminal, VS Code, Git &amp; GitHub, Node &amp; npm.</span></div>
  <div class="kv"><span class="k">Ch 2</span><span class="v">HTML — cấu trúc của một trang.</span></div>
  <div class="kv"><span class="k">Ch 3</span><span class="v">CSS — tạo kiểu và bố cục responsive.</span></div>
  <div class="kv"><span class="k">Ch 4</span><span class="v">JavaScript — ngôn ngữ của web.</span></div>
  <div class="kv"><span class="k">Ch 5</span><span class="v">JavaScript bất đồng bộ — Promise, async/await, event loop, fetch.</span></div>
  <div class="kv"><span class="k">Ch 6</span><span class="v">HTTP &amp; API — method, status code, REST, JSON, query/params.</span></div>
  <div class="kv"><span class="k">Ch 7</span><span class="v">Cookie, session, xác thực/JWT, CORS, HTTPS &amp; bảo mật cơ bản.</span></div>
  <div class="kv"><span class="k">Ch 8</span><span class="v">Dữ liệu &amp; SQL — cơ sở dữ liệu và CRUD.</span></div>
  <div class="kv"><span class="k">Ch 9</span><span class="v">TypeScript cơ bản — JavaScript có kiểu.</span></div>
  <div class="kv"><span class="k">Ch 10</span><span class="v">Tư duy như lập trình viên — giải quyết vấn đề, gỡ lỗi, Git workflow.</span></div>
</div>
<p>Chương 0–5 là nền tảng cho <strong>cả</strong> Node.js lẫn Next.js. Chương 6–8 nghiêng về <strong>backend</strong> (Node.js). Toàn bộ, cộng JavaScript/TypeScript, là thứ làm cho <strong>Next.js/React</strong> đọc được.</p>

<div class="link-card"><a href="https://roadmap.sh/frontend" target="_blank" rel="noopener">roadmap.sh — lộ trình lập trình web trực quan</a></div>
<div class="link-card"><a href="https://developer.mozilla.org/vi/docs/Learn" target="_blank" rel="noopener">MDN — Học phát triển web (tài liệu tham chiếu chính)</a></div>

<p class="note-ct"><strong>Cách dùng khoá này:</strong> đọc bài xong hãy TỰ GÕ lại ví dụ — đừng chỉ đọc. Lập trình là kỹ năng của đôi tay, như nấu ăn. Xem người khác nấu không dạy được tay bạn.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — How the web works, in one picture|||0.2 — Web hoạt động thế nào, trong một bức tranh',
      slug: 'wf-0-2-web-hoat-dong',
      type: 'VIDEO',
      // "How the Internet Works in 5 Minutes" — Aaron.
      video: { url: 'https://youtu.be/7_LPdttKXPc', durationSeconds: 0 },
      description: 'Hành trình của một request: gõ URL → DNS → server → HTML/CSS/JS về trình duyệt → trang hiện ra. Bức tranh tổng quan trước khi đào sâu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>What happens when you type an address and hit Enter</h2>
<p class="lead">This one mental model explains 80% of web development. We will go deep on each piece later (Chapter 0 and Chapter 6); for now, just get the shape.</p>

<h3>The journey of a single request</h3>
<p>Say you type <code>cuongthai.com</code> and press Enter:</p>
<ol>
  <li><strong>DNS lookup.</strong> Computers do not know names, only numbers (IP addresses). DNS is the internet's phone book: it turns <code>cuongthai.com</code> into something like <code>160.187.1.208</code>.</li>
  <li><strong>The request.</strong> Your browser opens a connection to that address and sends an <strong>HTTP request</strong>: roughly, "GET me the home page."</li>
  <li><strong>The server responds.</strong> A program on that machine (often a Node.js server) decides what to send back and returns an <strong>HTTP response</strong>: an HTML document, plus a status code like <code>200 OK</code>.</li>
  <li><strong>The browser renders.</strong> It reads the HTML, downloads the CSS and JavaScript it references, and paints the page. JavaScript then makes it interactive.</li>
  <li><strong>More requests.</strong> Clicking around, submitting a form, loading more posts — each is another request/response cycle, usually fetching <strong>JSON</strong> data behind the scenes.</li>
</ol>

<h3>A tiny simulation you can read</h3>
<p>An HTTP request and response are just text. Here is what the browser roughly sends and gets back (simplified):</p>
<pre><code>// ── The request the browser sends ──
GET /about HTTP/1.1
Host: cuongthai.com
Accept: text/html

// ── The response the server sends back ──
HTTP/1.1 200 OK
Content-Type: text/html

&lt;!doctype html&gt;
&lt;html&gt;&lt;body&gt;&lt;h1&gt;About&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>That <code>GET</code> is the <strong>method</strong> (what you want to do). <code>200</code> is the <strong>status code</strong> (how it went). <code>Content-Type</code> is a <strong>header</strong> (metadata). The HTML at the bottom is the <strong>body</strong>. You will meet all four constantly.</p>

<h3>Client vs server — who does what</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Client (browser)</span><span class="v">Runs HTML/CSS/JavaScript. Sees only what the server sends. Anything here is public — never hide secrets in it.</span></div>
  <div class="kv"><span class="k">Server</span><span class="v">Runs your backend code (Node.js). Holds the database, the passwords, the API keys. The browser never sees this code.</span></div>
</div>

<p class="note-ct"><strong>Why this matters for later:</strong> the whole "Server Component vs Client Component" idea in Next.js is just this line drawn inside your app — some code runs on the server, some in the browser. Once this picture is solid, that lesson is easy.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works" target="_blank" rel="noopener">MDN — How the Web works</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Chuyện gì xảy ra khi bạn gõ một địa chỉ và bấm Enter</h2>
<p class="lead">Một mô hình tư duy này giải thích 80% việc lập trình web. Ta sẽ đào sâu từng phần sau (Chương 0 và Chương 6); giờ chỉ cần nắm hình dạng tổng thể.</p>

<h3>Hành trình của một request</h3>
<p>Giả sử bạn gõ <code>cuongthai.com</code> và bấm Enter:</p>
<ol>
  <li><strong>Tra DNS.</strong> Máy tính không biết tên, chỉ biết số (địa chỉ IP). DNS là danh bạ của internet: nó đổi <code>cuongthai.com</code> thành thứ gì đó như <code>160.187.1.208</code>.</li>
  <li><strong>Gửi request.</strong> Trình duyệt mở một kết nối tới địa chỉ đó và gửi một <strong>request HTTP</strong>: đại khái là "GET cho tôi trang chủ."</li>
  <li><strong>Server trả lời.</strong> Một chương trình trên máy đó (thường là một server Node.js) quyết định gửi gì về và trả lại một <strong>response HTTP</strong>: một tài liệu HTML, kèm một mã trạng thái như <code>200 OK</code>.</li>
  <li><strong>Trình duyệt render.</strong> Nó đọc HTML, tải các file CSS và JavaScript được tham chiếu, rồi vẽ trang ra. Sau đó JavaScript làm cho trang tương tác được.</li>
  <li><strong>Thêm request.</strong> Bấm loanh quanh, gửi một form, tải thêm bài — mỗi thứ là một vòng request/response nữa, thường là lấy dữ liệu <strong>JSON</strong> ở hậu trường.</li>
</ol>

<h3>Một mô phỏng nhỏ bạn đọc được</h3>
<p>Một request và response HTTP chỉ là văn bản. Đây là thứ trình duyệt gửi đi và nhận về (rút gọn):</p>
<pre><code>// ── Request trình duyệt gửi đi ──
GET /about HTTP/1.1
Host: cuongthai.com
Accept: text/html

// ── Response server gửi về ──
HTTP/1.1 200 OK
Content-Type: text/html

&lt;!doctype html&gt;
&lt;html&gt;&lt;body&gt;&lt;h1&gt;About&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>Chữ <code>GET</code> là <strong>method</strong> (bạn muốn làm gì). <code>200</code> là <strong>mã trạng thái</strong> (kết quả ra sao). <code>Content-Type</code> là một <strong>header</strong> (dữ liệu mô tả). Phần HTML ở dưới là <strong>body</strong>. Bạn sẽ gặp cả bốn thứ này liên tục.</p>

<h3>Client và server — ai làm gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Client (trình duyệt)</span><span class="v">Chạy HTML/CSS/JavaScript. Chỉ thấy thứ server gửi. Mọi thứ ở đây là công khai — đừng bao giờ giấu bí mật trong đó.</span></div>
  <div class="kv"><span class="k">Server</span><span class="v">Chạy mã backend của bạn (Node.js). Giữ cơ sở dữ liệu, mật khẩu, API key. Trình duyệt không bao giờ thấy mã này.</span></div>
</div>

<p class="note-ct"><strong>Vì sao điều này quan trọng về sau:</strong> toàn bộ ý tưởng "Server Component vs Client Component" trong Next.js chỉ là ranh giới này vẽ vào trong ứng dụng của bạn — một phần mã chạy trên server, một phần chạy trong trình duyệt. Khi bức tranh này vững, bài đó trở nên dễ.</p>

<div class="link-card"><a href="https://developer.mozilla.org/vi/docs/Learn/Getting_started_with_the_web/How_the_Web_works" target="_blank" rel="noopener">MDN — Web hoạt động thế nào</a></div>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Set up your machine (free tools)|||0.3 — Cài đặt máy của bạn (công cụ miễn phí)',
      slug: 'wf-0-3-cai-dat-may',
      type: 'VIDEO',
      // "Git and GitHub for Beginners - Crash Course" — freeCodeCamp.
      video: { url: 'https://youtu.be/RGOj5yH7evk', durationSeconds: 0 },
      description: 'Cài đúng bốn thứ: trình duyệt + DevTools, VS Code, Node.js & npm, Git & GitHub. Kèm cách kiểm tra đã cài đúng bằng terminal.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The four tools you install once and use forever</h2>
<p class="lead">Everything here is free and cross-platform. Install them now; every later chapter assumes they exist. Do not skip — typing along is the whole point.</p>

<h3>1) A modern browser + its DevTools</h3>
<p>Install <strong>Google Chrome</strong> or <strong>Firefox</strong>. The superpower is <strong>DevTools</strong>: press <code>F12</code> (or right-click → Inspect). You will live in three tabs of it — <em>Elements</em> (the HTML/CSS on the page), <em>Console</em> (JavaScript messages and errors), and <em>Network</em> (every request/response, exactly like Lesson 0.2).</p>

<h3>2) VS Code — your code editor</h3>
<p>Download <strong>Visual Studio Code</strong> (code.visualstudio.com). It is where you write code. Two beginner-friendly extensions: <em>Prettier</em> (auto-formats your code) and <em>Live Server</em> (opens an HTML file in the browser and reloads on save).</p>

<h3>3) Node.js &amp; npm — run JavaScript outside the browser</h3>
<p>Install <strong>Node.js 22 LTS</strong> from nodejs.org. Node lets you run JavaScript on your machine (not just in a browser) — that is what a backend is. It comes with <strong>npm</strong>, the tool that installs libraries. Verify in a terminal:</p>
<pre><code>node -v    # should print something like v22.x.x
npm -v     # should print a version number too</code></pre>
<p>A first taste — create <code>hello.js</code>, put one line in it, and run it with Node:</p>
<pre><code>// hello.js
console.log("Hello from Node!");

// in the terminal:
node hello.js      // → Hello from Node!</code></pre>

<h3>4) Git &amp; GitHub — save and share your work</h3>
<p><strong>Git</strong> (git-scm.com) records snapshots of your code so you can undo mistakes and see history. <strong>GitHub</strong> is where those snapshots live online. Verify and set your name once:</p>
<pre><code>git --version
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"</code></pre>
<p>The everyday loop (Chapter 1 goes deep): <code>git add .</code> → <code>git commit -m "message"</code> → <code>git push</code>.</p>

<h3>The terminal, in one minute</h3>
<p>The terminal is a text way to tell your computer what to do. The three commands you need today:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">pwd</span><span class="v">"Where am I?" — prints the current folder.</span></div>
  <div class="kv"><span class="k">ls (dir on Windows)</span><span class="v">"What is here?" — lists files.</span></div>
  <div class="kv"><span class="k">cd folder</span><span class="v">"Go into this folder." Use cd .. to go up one.</span></div>
</div>

<p class="pitfall"><strong>Common first stumble:</strong> "command not found" after installing Node/Git usually means you must <strong>close and reopen the terminal</strong> (or restart) so it picks up the new program. Try that before assuming the install failed.</p>

<div class="link-card"><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code — download</a></div>
<div class="link-card"><a href="https://nodejs.org/en/download" target="_blank" rel="noopener">Node.js — download the LTS version</a></div>
<div class="link-card"><a href="https://git-scm.com/downloads" target="_blank" rel="noopener">Git — download</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Bốn công cụ cài một lần, dùng mãi mãi</h2>
<p class="lead">Tất cả ở đây đều miễn phí và chạy trên mọi hệ điều hành. Cài ngay bây giờ; mọi chương sau đều mặc định chúng đã có. Đừng bỏ qua — gõ theo mới là điều cốt lõi.</p>

<h3>1) Một trình duyệt hiện đại + DevTools của nó</h3>
<p>Cài <strong>Google Chrome</strong> hoặc <strong>Firefox</strong>. Siêu năng lực nằm ở <strong>DevTools</strong>: bấm <code>F12</code> (hoặc chuột phải → Inspect). Bạn sẽ sống trong ba tab của nó — <em>Elements</em> (HTML/CSS của trang), <em>Console</em> (thông báo và lỗi JavaScript), và <em>Network</em> (mọi request/response, đúng như Bài 0.2).</p>

<h3>2) VS Code — trình soạn thảo mã của bạn</h3>
<p>Tải <strong>Visual Studio Code</strong> (code.visualstudio.com). Đây là nơi bạn viết mã. Hai tiện ích thân thiện cho người mới: <em>Prettier</em> (tự định dạng mã) và <em>Live Server</em> (mở file HTML trong trình duyệt và tự tải lại khi lưu).</p>

<h3>3) Node.js &amp; npm — chạy JavaScript ngoài trình duyệt</h3>
<p>Cài <strong>Node.js 22 LTS</strong> từ nodejs.org. Node cho phép bạn chạy JavaScript trên máy (không chỉ trong trình duyệt) — đó chính là backend. Nó đi kèm <strong>npm</strong>, công cụ cài các thư viện. Kiểm tra trong terminal:</p>
<pre><code>node -v    # in ra kiểu v22.x.x
npm -v     # cũng in ra một số phiên bản</code></pre>
<p>Nếm thử lần đầu — tạo file <code>hello.js</code>, viết một dòng, rồi chạy bằng Node:</p>
<pre><code>// hello.js
console.log("Hello from Node!");

// trong terminal:
node hello.js      // → Hello from Node!</code></pre>

<h3>4) Git &amp; GitHub — lưu và chia sẻ công việc</h3>
<p><strong>Git</strong> (git-scm.com) ghi lại các ảnh chụp mã để bạn hoàn tác lỗi và xem lịch sử. <strong>GitHub</strong> là nơi các ảnh chụp đó sống trên mạng. Kiểm tra và đặt tên một lần:</p>
<pre><code>git --version
git config --global user.name  "Tên của bạn"
git config --global user.email "ban@example.com"</code></pre>
<p>Vòng lặp hằng ngày (Chương 1 sẽ đào sâu): <code>git add .</code> → <code>git commit -m "thông điệp"</code> → <code>git push</code>.</p>

<h3>Terminal, trong một phút</h3>
<p>Terminal là cách dùng chữ để bảo máy tính làm việc. Ba lệnh bạn cần hôm nay:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">pwd</span><span class="v">"Tôi đang ở đâu?" — in ra thư mục hiện tại.</span></div>
  <div class="kv"><span class="k">ls (dir trên Windows)</span><span class="v">"Ở đây có gì?" — liệt kê file.</span></div>
  <div class="kv"><span class="k">cd thư-mục</span><span class="v">"Đi vào thư mục này." Dùng cd .. để lùi một cấp.</span></div>
</div>

<p class="pitfall"><strong>Vấp phổ biến đầu tiên:</strong> báo "command not found" sau khi cài Node/Git thường nghĩa là bạn phải <strong>đóng và mở lại terminal</strong> (hoặc khởi động lại máy) để nó nhận chương trình mới. Hãy thử điều đó trước khi kết luận là cài hỏng.</p>

<div class="link-card"><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code — tải về</a></div>
<div class="link-card"><a href="https://nodejs.org/en/download" target="_blank" rel="noopener">Node.js — tải bản LTS</a></div>
<div class="link-card"><a href="https://git-scm.com/downloads" target="_blank" rel="noopener">Git — tải về</a></div>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — How to study this course (and not give up)|||0.4 — Cách học khoá này (và không bỏ cuộc)',
      slug: 'wf-0-4-cach-hoc',
      type: 'VIDEO',
      // "Harvard CS50 – Full Computer Science University Course" — freeCodeCamp/CS50.
      video: { url: 'https://youtu.be/8mAITcNt710', durationSeconds: 0 },
      description: 'Tư duy học đúng: học bằng cách xây, đọc lỗi thay vì sợ lỗi, dùng DevTools và tài liệu, và vòng lặp học lặp lại mỗi bài.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>The habits that separate people who finish from people who quit</h2>
<p class="lead">Talent is overrated; method is everything. These five habits will carry you through this course and every course after it.</p>

<h3>1) Learn by building, not by watching</h3>
<p>Retype every example. Then change one thing and predict what happens before you run it. That tiny loop — predict, run, compare — is where real understanding forms. Passive watching feels productive and teaches almost nothing.</p>

<h3>2) Errors are directions, not failures</h3>
<p>Beginners see a red error and panic. Professionals read it. An error message tells you <em>what</em> went wrong and usually <em>where</em>. Read the first line, find the file and line number, and look right there. Copying the error into a search engine is a completely legitimate skill.</p>
<pre><code>// Example error — read it, do not fear it:
ReferenceError: total is not defined
    at calculate (app.js:12:5)
// Translation: on line 12 of app.js you used "total" before creating it.</code></pre>

<h3>3) Use DevTools and console.log constantly</h3>
<p>When you are not sure what a value is, print it: <code>console.log("here", value)</code>. When a page looks wrong, open DevTools → Elements. When a request fails, open DevTools → Network. You debug by <strong>looking</strong>, not by guessing.</p>

<h3>4) The docs are your friend (MDN first)</h3>
<p>You are not expected to memorize everything. Nobody does. Learn to look things up fast — MDN for web APIs, the official docs for each tool. Searching "MDN array map" is what real developers do all day.</p>

<h3>5) Consistency beats intensity</h3>
<p>One focused hour a day beats a ten-hour weekend cram. The brain consolidates skills between sessions. Small and daily wins.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">The study loop per lesson</span><span class="v">Read → type the examples → break one on purpose and fix it → answer the quiz → move on.</span></div>
  <div class="kv"><span class="k">When stuck &gt; 20 min</span><span class="v">Re-read the error, console.log the values, search MDN, then ask — with the exact error text.</span></div>
</div>

<p class="note-ct"><strong>Where this leads:</strong> finish these 11 chapters and you will open the CuongThai <strong>Node.js</strong> and <strong>Next.js &amp; React</strong> courses and actually understand them — that is the whole point of building this foundation first.</p>

<div class="link-card"><a href="https://developer.mozilla.org/en-US/" target="_blank" rel="noopener">MDN Web Docs — the reference to bookmark</a></div>
<div class="link-card"><a href="https://javascript.info/" target="_blank" rel="noopener">javascript.info — JavaScript from basics to deep</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Những thói quen tách người học xong khỏi người bỏ cuộc</h2>
<p class="lead">Năng khiếu bị thổi phồng; phương pháp mới là tất cả. Năm thói quen này sẽ đưa bạn qua khoá này và mọi khoá sau nó.</p>

<h3>1) Học bằng cách xây, không phải bằng cách xem</h3>
<p>Gõ lại mọi ví dụ. Rồi đổi một chỗ và ĐOÁN kết quả trước khi chạy. Vòng lặp nhỏ đó — đoán, chạy, so sánh — là nơi hiểu biết thật hình thành. Xem thụ động tạo cảm giác năng suất nhưng dạy được rất ít.</p>

<h3>2) Lỗi là chỉ dẫn, không phải thất bại</h3>
<p>Người mới thấy chữ đỏ là hoảng. Người chuyên nghiệp thì đọc nó. Một thông báo lỗi cho bạn biết <em>cái gì</em> sai và thường là <em>ở đâu</em>. Đọc dòng đầu, tìm tên file và số dòng, rồi nhìn đúng chỗ đó. Dán lỗi vào ô tìm kiếm là một kỹ năng hoàn toàn chính đáng.</p>
<pre><code>// Ví dụ một lỗi — hãy đọc, đừng sợ:
ReferenceError: total is not defined
    at calculate (app.js:12:5)
// Dịch: ở dòng 12 của app.js bạn dùng "total" trước khi tạo ra nó.</code></pre>

<h3>3) Dùng DevTools và console.log liên tục</h3>
<p>Khi không chắc một giá trị là gì, hãy in nó ra: <code>console.log("ở đây", value)</code>. Khi trang trông sai, mở DevTools → Elements. Khi một request thất bại, mở DevTools → Network. Bạn gỡ lỗi bằng cách <strong>nhìn</strong>, không phải bằng cách đoán.</p>

<h3>4) Tài liệu là bạn của bạn (MDN trước tiên)</h3>
<p>Bạn không cần thuộc lòng mọi thứ. Không ai thuộc cả. Hãy học cách tra cứu nhanh — MDN cho các API web, tài liệu chính thức cho từng công cụ. Gõ "MDN array map" chính là việc lập trình viên thật làm cả ngày.</p>

<h3>5) Đều đặn thắng dồn dập</h3>
<p>Một giờ tập trung mỗi ngày thắng một buổi cuối tuần cày mười tiếng. Não củng cố kỹ năng giữa các buổi học. Nhỏ và đều là thắng.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Vòng lặp học mỗi bài</span><span class="v">Đọc → gõ ví dụ → cố tình làm hỏng một chỗ rồi sửa → làm quiz → đi tiếp.</span></div>
  <div class="kv"><span class="k">Khi kẹt &gt; 20 phút</span><span class="v">Đọc lại lỗi, console.log các giá trị, tra MDN, rồi mới hỏi — kèm nguyên văn lỗi.</span></div>
</div>

<p class="note-ct"><strong>Điều này dẫn tới đâu:</strong> học xong 11 chương, bạn sẽ mở khoá <strong>Node.js</strong> và <strong>Next.js &amp; React</strong> của CuongThai và thật sự hiểu chúng — đó chính là lý do ta xây nền tảng này trước.</p>

<div class="link-card"><a href="https://developer.mozilla.org/vi/" target="_blank" rel="noopener">MDN Web Docs — tài liệu nên đánh dấu</a></div>
<div class="link-card"><a href="https://javascript.info/" target="_blank" rel="noopener">javascript.info — JavaScript từ cơ bản tới sâu</a></div>
</div>
`,
    },
  ],
};
