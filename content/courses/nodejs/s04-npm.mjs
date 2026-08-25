/**
 * Node.js — Chương 4: npm, semver, lockfile và an toàn chuỗi cung ứng.
 * Số liệu đo thật bằng npm 10.9.4 / Node v22.21.0 trong sandbox.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 4 — npm and project hygiene|||Chương 4 — npm & giữ dự án sạch',
  description: 'package.json, semver, lockfile và an toàn chuỗi cung ứng — những thứ quyết định dự án của bạn có tái lập được hay không.',
  lessons: [
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — package.json and npm scripts|||4.1 — package.json và npm scripts',
      slug: 'nodejs-4-1-package-json',
      type: 'VIDEO',
      description: 'Tấm căn cước của dự án: khai báo phụ thuộc, phân biệt dependencies và devDependencies, và dùng scripts cho đúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2><code>package.json</code> and npm scripts</h2>
<p class="lead">Every Node project is defined by one file. <code>package.json</code> says what the project is, what it depends on, and how to run it. Get it right and anyone can clone your repo and be running in two commands.</p>

<h3>Starting a project</h3>
<pre><code>npm init -y</code></pre>
<div class="out">{
  "name": "npmdemo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" &amp;&amp; exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}</div>
<p>That is the skeleton. For a real backend you immediately add two things — the module system and the Node version:</p>
<pre><code>{
  <span class="tok-string">"name"</span>: <span class="tok-string">"notes-api"</span>,
  <span class="tok-string">"version"</span>: <span class="tok-string">"1.0.0"</span>,
  <span class="tok-string">"type"</span>: <span class="tok-string">"module"</span>,                  <span class="tok-comment">// ESM — see lesson 1.5</span>
  <span class="tok-string">"engines"</span>: { <span class="tok-string">"node"</span>: <span class="tok-string">"&gt;=22"</span> },      <span class="tok-comment">// declare the Node version</span>
  <span class="tok-string">"scripts"</span>: {
    <span class="tok-string">"dev"</span>: <span class="tok-string">"node --watch src/index.js"</span>,
    <span class="tok-string">"start"</span>: <span class="tok-string">"node src/index.js"</span>,
    <span class="tok-string">"test"</span>: <span class="tok-string">"node --test"</span>,
    <span class="tok-string">"lint"</span>: <span class="tok-string">"eslint src"</span>
  }
}</code></pre>
<div class="callout ok"><code>node --watch</code> restarts the server when a file changes — built into Node since v18. You no longer need <code>nodemon</code> for that. One dependency less is one dependency less.</div>

<h3>dependencies vs devDependencies</h3>
<pre><code>npm i express          <span class="tok-comment"># → dependencies: needed to RUN</span>
npm i -D eslint        <span class="tok-comment"># → devDependencies: only to DEVELOP</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">dependencies</span><span class="v">Anything imported by code that runs in production: express, prisma client, bcrypt.</span></div>
  <div class="kv"><span class="k">devDependencies</span><span class="v">Tools that never run in production: eslint, prettier, test runners, TypeScript, build tools.</span></div>
  <div class="kv"><span class="k">Why it matters</span><span class="v"><code>npm ci --omit=dev</code> in your Docker image skips them — a smaller, faster image with less to attack.</span></div>
</div>
<div class="pitfall">A very common production crash: putting something in <code>devDependencies</code> that production actually imports. It works locally (where everything is installed) and dies on the server with <code>Cannot find module</code> — but only after deploy. Rule of thumb: if <code>src/</code> imports it, it belongs in <code>dependencies</code>.</div>

<h3>npm scripts — your project's command list</h3>
<pre><code>npm run dev             <span class="tok-comment"># run any script by name</span>
npm start               <span class="tok-comment"># "start" and "test" don't need "run"</span>
npm test</code></pre>
<p>Scripts are how a project documents itself. A newcomer should never need to ask "how do I run this?" — the answer is in <code>scripts</code>. Two conventions worth adopting:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Always have dev / start / test</span><span class="v">Even if <code>test</code> only runs one file for now.</span></div>
  <div class="kv"><span class="k">Node binaries are on the PATH</span><span class="v">Inside a script you can call <code>eslint</code> directly — npm adds <code>node_modules/.bin</code> to PATH. Outside a script you need <code>npx eslint</code>.</span></div>
</div>

<h3>Useful npm commands</h3>
<pre><code>npm i &lt;pkg&gt;                  <span class="tok-comment"># install and save to package.json</span>
npm i -D &lt;pkg&gt;               <span class="tok-comment"># install as a dev dependency</span>
npm un &lt;pkg&gt;                 <span class="tok-comment"># uninstall</span>
npm ls &lt;pkg&gt;                 <span class="tok-comment"># why is this package here? show the tree</span>
npm outdated                 <span class="tok-comment"># what has newer versions available</span>
npm view &lt;pkg&gt; versions       <span class="tok-comment"># every published version</span>
npx &lt;tool&gt;                   <span class="tok-comment"># run a tool without installing it globally</span></code></pre>
<div class="note-ct">This site pins the Node version in three places that must agree: <code>engines</code> in package.json, the Docker base image, and the CI workflow. When they drift apart, code passes locally and fails after deploy — which is the most expensive kind of failure, because you only find out in front of users.</div>
<h3>The fields that actually change behaviour</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">name and version</span><span class="lz-d">Identity. <code>version</code> is what other packages resolve against, and what <code>npm publish</code> refuses to reuse.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">type</span><span class="lz-d"><code>"module"</code> or absent. It decides whether every <code>.js</code> in the package is ESM or CommonJS — see lesson 1.5.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">dependencies vs devDependencies</span><span class="lz-d">Both install locally; only <code>dependencies</code> install with <code>--omit=dev</code>. Putting a runtime package in the wrong one breaks the production image, not the build.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">scripts and engines</span><span class="lz-d"><code>scripts</code> is the project's command line; <code>engines</code> states the Node version, which some hosts enforce and others only warn about.</span></div>
</div>
<a class="link-card dl" href="https://docs.npmjs.com/cli/v10/configuring-npm/package-json" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">npm — package.json</span><span class="lc-sub">Every field, with the ones that affect installation marked.</span></span>
</a>
<a class="link-card dl" href="https://docs.npmjs.com/cli/v10/using-npm/scripts" target="_blank" rel="noopener">
  <span class="lc-ico">▶️</span>
  <span class="lc-body"><span class="lc-title">npm — scripts</span><span class="lc-sub">Lifecycle hooks, pre/post, and why an install script is a supply-chain concern.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2><code>package.json</code> và npm scripts</h2>
<p class="lead">Mỗi dự án Node được định nghĩa bằng một file duy nhất. <code>package.json</code> nói dự án là gì, phụ thuộc vào những gì, và chạy bằng cách nào. Làm đúng file này thì ai clone repo về cũng chạy được chỉ bằng hai câu lệnh.</p>

<h3>Khởi tạo dự án</h3>
<pre><code>npm init -y</code></pre>
<div class="out">{
  "name": "npmdemo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" &amp;&amp; exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}</div>
<p>Đó là bộ khung. Với một backend thật, bạn thêm ngay hai thứ — hệ module và phiên bản Node:</p>
<pre><code>{
  <span class="tok-string">"name"</span>: <span class="tok-string">"notes-api"</span>,
  <span class="tok-string">"version"</span>: <span class="tok-string">"1.0.0"</span>,
  <span class="tok-string">"type"</span>: <span class="tok-string">"module"</span>,                  <span class="tok-comment">// ESM — xem bài 1.5</span>
  <span class="tok-string">"engines"</span>: { <span class="tok-string">"node"</span>: <span class="tok-string">"&gt;=22"</span> },      <span class="tok-comment">// khai báo phiên bản Node</span>
  <span class="tok-string">"scripts"</span>: {
    <span class="tok-string">"dev"</span>: <span class="tok-string">"node --watch src/index.js"</span>,
    <span class="tok-string">"start"</span>: <span class="tok-string">"node src/index.js"</span>,
    <span class="tok-string">"test"</span>: <span class="tok-string">"node --test"</span>,
    <span class="tok-string">"lint"</span>: <span class="tok-string">"eslint src"</span>
  }
}</code></pre>
<div class="callout ok"><code>node --watch</code> tự khởi động lại server khi file thay đổi — có sẵn trong Node từ v18. Bạn không còn cần <code>nodemon</code> cho việc đó nữa. Bớt được một phụ thuộc là bớt được một phụ thuộc.</div>

<h3>dependencies và devDependencies</h3>
<pre><code>npm i express          <span class="tok-comment"># → dependencies: cần để CHẠY</span>
npm i -D eslint        <span class="tok-comment"># → devDependencies: chỉ cần khi PHÁT TRIỂN</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">dependencies</span><span class="v">Mọi thứ được import bởi code chạy trên production: express, prisma client, bcrypt.</span></div>
  <div class="kv"><span class="k">devDependencies</span><span class="v">Công cụ không bao giờ chạy trên production: eslint, prettier, bộ chạy test, TypeScript, công cụ build.</span></div>
  <div class="kv"><span class="k">Vì sao quan trọng</span><span class="v">Lệnh <code>npm ci --omit=dev</code> trong image Docker sẽ bỏ qua chúng — image nhỏ hơn, nhanh hơn, và ít bề mặt bị tấn công hơn.</span></div>
</div>
<div class="pitfall">Một kiểu sập production rất hay gặp: bỏ nhầm vào <code>devDependencies</code> một gói mà production thật sự có import. Ở máy bạn thì chạy ngon (vì cài hết), nhưng lên server thì chết với lỗi <code>Cannot find module</code> — và chỉ lộ ra SAU khi deploy. Nguyên tắc bỏ túi: nếu <code>src/</code> có import nó, chỗ của nó là <code>dependencies</code>.</div>

<h3>npm scripts — danh sách lệnh của dự án</h3>
<pre><code>npm run dev             <span class="tok-comment"># chạy script bất kỳ theo tên</span>
npm start               <span class="tok-comment"># "start" và "test" không cần chữ "run"</span>
npm test</code></pre>
<p>Scripts là cách một dự án tự viết tài liệu cho mình. Người mới vào không bao giờ phải hỏi "chạy cái này kiểu gì?" — câu trả lời nằm trong <code>scripts</code>. Hai quy ước đáng theo:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Luôn có dev / start / test</span><span class="v">Kể cả khi <code>test</code> hiện mới chạy đúng một file.</span></div>
  <div class="kv"><span class="k">Lệnh của gói nằm sẵn trong PATH</span><span class="v">Bên trong một script bạn gọi thẳng <code>eslint</code> được — npm tự thêm <code>node_modules/.bin</code> vào PATH. Còn ở ngoài thì phải <code>npx eslint</code>.</span></div>
</div>

<h3>Vài lệnh npm hay dùng</h3>
<pre><code>npm i &lt;gói&gt;                  <span class="tok-comment"># cài và ghi vào package.json</span>
npm i -D &lt;gói&gt;               <span class="tok-comment"># cài như phụ thuộc phát triển</span>
npm un &lt;gói&gt;                 <span class="tok-comment"># gỡ cài đặt</span>
npm ls &lt;gói&gt;                 <span class="tok-comment"># vì sao gói này có mặt? in ra cây phụ thuộc</span>
npm outdated                 <span class="tok-comment"># gói nào đã có bản mới hơn</span>
npm view &lt;gói&gt; versions       <span class="tok-comment"># mọi phiên bản đã phát hành</span>
npx &lt;công cụ&gt;                <span class="tok-comment"># chạy công cụ mà không cần cài toàn cục</span></code></pre>
<div class="note-ct">Website này ghim phiên bản Node ở ba nơi bắt buộc phải khớp nhau: mục <code>engines</code> trong package.json, image nền Docker, và workflow CI. Khi ba chỗ đó lệch nhau, code chạy ngon ở máy nhưng gãy sau khi deploy — loại hỏng hóc đắt đỏ nhất, vì bạn chỉ phát hiện ra khi đã ở trước mặt người dùng.</div>
<h3>Những trường thật sự làm đổi hành vi</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">name và version</span><span class="lz-d">Danh tính. <code>version</code> là thứ các package khác giải theo, và là thứ <code>npm publish</code> từ chối cho dùng lại.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">type</span><span class="lz-d"><code>"module"</code> hoặc không có. Nó quyết định mọi file <code>.js</code> trong package là ESM hay CommonJS — xem bài 1.5.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">dependencies với devDependencies</span><span class="lz-d">Cả hai đều cài ở máy; chỉ <code>dependencies</code> mới được cài khi có <code>--omit=dev</code>. Đặt một package cần lúc chạy vào nhầm chỗ sẽ làm vỡ ảnh production, chứ không làm vỡ bản build.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">scripts và engines</span><span class="lz-d"><code>scripts</code> là dòng lệnh của dự án; <code>engines</code> khai phiên bản Node, thứ mà một số nhà cung cấp cưỡng chế còn số khác chỉ cảnh báo.</span></div>
</div>
<a class="link-card dl" href="https://docs.npmjs.com/cli/v10/configuring-npm/package-json" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">npm — package.json</span><span class="lc-sub">Mọi trường, có đánh dấu những cái ảnh hưởng tới việc cài đặt.</span></span>
</a>
<a class="link-card dl" href="https://docs.npmjs.com/cli/v10/using-npm/scripts" target="_blank" rel="noopener">
  <span class="lc-ico">▶️</span>
  <span class="lc-body"><span class="lc-title">npm — scripts</span><span class="lc-sub">Các hook vòng đời, pre/post, và vì sao một script cài đặt là mối lo về chuỗi cung ứng.</span></span>
</a>

</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — Semver and the lockfile|||4.2 — Semver và lockfile',
      slug: 'nodejs-4-2-semver-lockfile',
      simulation: {
        url: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-4-2-semver-lockfile.mp4',
        poster: 'https://media.cuongthai.com/videos/courses/nodejs/nodejs-4-2-semver-lockfile.jpg',
        scenario: 'nodejs-semver',
        durationSeconds: 21,
        caption: { en: "Semver and the lockfile", vi: "Semver và lockfile" },
      },
      type: 'VIDEO',
      description: 'Dấu ^ thật sự cho phép những gì, và vì sao "máy tôi chạy được mà" hầu hết bắt nguồn từ đây.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Semver and the lockfile</h2>
<p class="lead">This lesson explains the single most common source of "but it works on my machine". It is not magic and it is not bad luck — it is a range symbol in <code>package.json</code> that most people never read carefully.</p>

<h3>Reading a version number</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">MAJOR</div><div class="lz-d">breaking changes — your code may stop working</div></div>
  <div class="lz-step"><div class="lz-k">18</div><div class="lz-t">MINOR</div><div class="lz-d">new features, backward compatible</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">PATCH</div><div class="lz-d">bug fixes only</div></div>
</div>

<h3>What the range symbols really allow</h3>
<p>Same package, three ways of writing the requirement. Here is what each one actually resolves to today:</p>
<pre><code>npm view <span class="tok-string">"express@^4.18.0"</span> version
npm view <span class="tok-string">"express@~4.18.0"</span> version
npm view <span class="tok-string">"express@4.18.0"</span>  version</code></pre>
<div class="out">^4.18.0    → 4.22.2      (minor may move: 4.18 → 4.22)
~4.18.0    → 4.18.3      (patch only)
4.18.0     → 4.18.0      (exact)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">^4.18.0 (caret)</span><span class="v">"Any 4.x.x from 4.18.0 up". npm's default. Allows minor AND patch to move — four minor versions in this example.</span></div>
  <div class="kv"><span class="k">~4.18.0 (tilde)</span><span class="v">"Any 4.18.x". Patch only — much tighter.</span></div>
  <div class="kv"><span class="k">4.18.0 (exact)</span><span class="v">Only that version, ever.</span></div>
</div>

<h3>The experiment: how teams end up on different versions</h3>
<p>A project created a while ago, when 4.18.0 was current. Its <code>package.json</code> says <code>^4.18.0</code> and its lockfile pins 4.18.0:</p>
<pre><code><span class="tok-comment"># Colleague clones the repo and runs npm ci — respects the lockfile</span>
npm ci</code></pre>
<div class="out">received: 4.18.0   ✅ identical to everyone else</div>
<pre><code><span class="tok-comment"># Someone else deletes the lockfile and runs npm install</span>
rm package-lock.json &amp;&amp; npm install</code></pre>
<div class="out">received: 4.22.2   ⚠️ four minor versions ahead of the team</div>
<p>Nobody edited <code>package.json</code>. Both obeyed it perfectly. Yet two machines now run different code — and any bug that appears only on one of them will be baffling until someone compares versions.</p>

<h3>npm install vs npm ci</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">npm install</span><span class="v">Resolves ranges, may UPDATE the lockfile, installs what fits. Use when adding or upgrading a package.</span></div>
  <div class="kv"><span class="k">npm ci</span><span class="v">Installs EXACTLY the lockfile, deletes node_modules first, never writes the lockfile. Fails if package.json and the lockfile disagree. Use in CI, in Docker, and whenever you just want the project running.</span></div>
</div>
<div class="callout ok">Rule: <strong><code>npm ci</code> everywhere except when you deliberately change dependencies.</strong> It is also faster, because it skips resolution entirely.</div>

<h3>Commit the lockfile. Always.</h3>
<p><code>package-lock.json</code> records the exact version <em>and</em> integrity hash of every package in the tree — including the dependencies of your dependencies, which <code>package.json</code> says nothing about. Without it, "install the same thing" is unenforceable.</p>
<div class="pitfall">Never add <code>package-lock.json</code> to <code>.gitignore</code>. You will see advice to do it — it is wrong for applications. (Libraries are a different case: they don't ship a lockfile because the consuming app decides the tree.) Also never hand-edit the lockfile; change <code>package.json</code> and let npm regenerate it.</div>

<h3>Upgrading on purpose</h3>
<pre><code>npm outdated                 <span class="tok-comment"># what is behind, and by how much</span>
npm update                   <span class="tok-comment"># move within the allowed ranges</span>
npm i express@latest         <span class="tok-comment"># jump a major deliberately — read the changelog first</span></code></pre>
<div class="note-ct">Deploys on this site install with <code>npm ci</code>, precisely so the container runs the exact tree that was tested in CI. The alternative — <code>npm install</code> at deploy time — means the image you tested and the image you shipped can quietly differ, and you would have no record of what changed.</div>
<a class="link-card dl" href="https://semver.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">semver.org — the specification</span><span class="lc-sub">Two pages, and it settles most arguments about what a version number promises.</span></span>
</a>
<a class="link-card dl" href="https://docs.npmjs.com/cli/v10/commands/npm-ci" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">npm ci</span><span class="lc-sub">The command that installs strictly from the lockfile — the difference this lesson measures.</span></span>
</a>

</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Semver và lockfile</h2>
<p class="lead">Bài này giải thích nguồn gốc phổ biến nhất của câu "nhưng máy tôi chạy được mà". Nó không phải phép thuật, cũng chẳng phải xui — nó là một ký hiệu dải phiên bản trong <code>package.json</code> mà đa số không bao giờ đọc kỹ.</p>

<h3>Đọc một số phiên bản</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">MAJOR</div><div class="lz-d">thay đổi phá vỡ — code của bạn có thể ngừng chạy</div></div>
  <div class="lz-step"><div class="lz-k">18</div><div class="lz-t">MINOR</div><div class="lz-d">thêm tính năng, vẫn tương thích ngược</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">PATCH</div><div class="lz-d">chỉ sửa lỗi</div></div>
</div>

<h3>Các ký hiệu dải thật sự cho phép điều gì</h3>
<p>Cùng một gói, ba cách viết yêu cầu. Đây là kết quả thật mà mỗi cách phân giải ra ở thời điểm này:</p>
<pre><code>npm view <span class="tok-string">"express@^4.18.0"</span> version
npm view <span class="tok-string">"express@~4.18.0"</span> version
npm view <span class="tok-string">"express@4.18.0"</span>  version</code></pre>
<div class="out">^4.18.0    → 4.22.2      (minor được phép nhảy: 4.18 → 4.22)
~4.18.0    → 4.18.3      (chỉ patch)
4.18.0     → 4.18.0      (đúng y bản đó)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">^4.18.0 (dấu mũ)</span><span class="v">"Bất kỳ bản 4.x.x nào từ 4.18.0 trở lên". Đây là mặc định của npm. Cho phép cả minor LẪN patch nhảy — trong ví dụ này là nhảy bốn bản minor.</span></div>
  <div class="kv"><span class="k">~4.18.0 (dấu ngã)</span><span class="v">"Bất kỳ bản 4.18.x nào". Chỉ patch — chặt hơn nhiều.</span></div>
  <div class="kv"><span class="k">4.18.0 (ghim cứng)</span><span class="v">Chỉ đúng bản đó, mãi mãi.</span></div>
</div>

<h3>Thí nghiệm: vì sao cả nhóm lại chạy các bản khác nhau</h3>
<p>Một dự án tạo từ lâu, hồi đó 4.18.0 còn là bản mới. File <code>package.json</code> ghi <code>^4.18.0</code> và lockfile ghim 4.18.0:</p>
<pre><code><span class="tok-comment"># Đồng nghiệp clone repo về rồi chạy npm ci — tôn trọng lockfile</span>
npm ci</code></pre>
<div class="out">nhận được: 4.18.0   ✅ giống hệt mọi người</div>
<pre><code><span class="tok-comment"># Người khác lỡ xoá lockfile rồi chạy npm install</span>
rm package-lock.json &amp;&amp; npm install</code></pre>
<div class="out">nhận được: 4.22.2   ⚠️ đi trước cả nhóm bốn bản minor</div>
<p>Không ai sửa <code>package.json</code> cả. Cả hai đều tuân thủ nó hoàn hảo. Vậy mà hai máy giờ chạy hai bản code khác nhau — và bất kỳ con bug nào chỉ xuất hiện ở một bên sẽ khiến cả nhóm bối rối cho tới khi có người nghĩ tới việc so phiên bản.</p>

<h3>npm install và npm ci</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">npm install</span><span class="v">Phân giải các dải, có thể CẬP NHẬT lockfile, cài thứ nào vừa khớp. Dùng khi bạn thêm hoặc nâng cấp một gói.</span></div>
  <div class="kv"><span class="k">npm ci</span><span class="v">Cài ĐÚNG Y lockfile, xoá sạch node_modules trước, không bao giờ ghi lại lockfile. Sẽ báo lỗi nếu package.json và lockfile mâu thuẫn. Dùng trong CI, trong Docker, và mỗi khi bạn chỉ muốn chạy dự án.</span></div>
</div>
<div class="callout ok">Nguyên tắc: <strong>dùng <code>npm ci</code> ở mọi nơi, trừ lúc bạn chủ động thay đổi phụ thuộc.</strong> Nó còn nhanh hơn, vì bỏ qua hẳn bước phân giải.</div>

<h3>Hãy commit lockfile. Luôn luôn.</h3>
<p><code>package-lock.json</code> ghi lại phiên bản chính xác <em>và</em> mã băm toàn vẹn của mọi gói trong cây — bao gồm cả phụ thuộc của phụ thuộc, thứ mà <code>package.json</code> chẳng nói gì về chúng. Không có nó thì yêu cầu "cài giống hệt nhau" là điều không thể bắt buộc được.</p>
<div class="pitfall">Đừng bao giờ đưa <code>package-lock.json</code> vào <code>.gitignore</code>. Bạn sẽ gặp lời khuyên làm vậy — nó sai với ứng dụng. (Thư viện là chuyện khác: thư viện không phát hành kèm lockfile vì ứng dụng dùng nó mới là bên quyết định cây phụ thuộc.) Cũng đừng bao giờ sửa tay lockfile; hãy sửa <code>package.json</code> rồi để npm tự sinh lại.</div>

<h3>Nâng cấp một cách có chủ đích</h3>
<pre><code>npm outdated                 <span class="tok-comment"># gói nào đang lạc hậu, và lạc hậu bao nhiêu</span>
npm update                   <span class="tok-comment"># nhích lên trong phạm vi dải cho phép</span>
npm i express@latest         <span class="tok-comment"># nhảy hẳn một major — đọc changelog trước đã</span></code></pre>
<div class="note-ct">Việc deploy của website này cài bằng <code>npm ci</code>, chính là để container chạy đúng cái cây phụ thuộc đã được kiểm thử trong CI. Cách còn lại — chạy <code>npm install</code> lúc deploy — nghĩa là image bạn test và image bạn ship có thể âm thầm khác nhau, mà bạn lại chẳng có bằng chứng nào về việc gì đã đổi.</div>
<a class="link-card dl" href="https://semver.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">semver.org — bản đặc tả</span><span class="lc-sub">Hai trang, và nó dập tắt phần lớn tranh cãi về việc một số phiên bản hứa hẹn điều gì.</span></span>
</a>
<a class="link-card dl" href="https://docs.npmjs.com/cli/v10/commands/npm-ci" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">npm ci</span><span class="lc-sub">Lệnh cài đặt nghiêm ngặt theo file lock — đúng cái khác biệt mà bài này đo.</span></span>
</a>

</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — Supply chain safety|||4.3 — An toàn chuỗi cung ứng',
      slug: 'nodejs-4-3-bao-mat-npm',
      type: 'VIDEO',
      description: 'Một dòng npm install kéo về 67 gói của người lạ — và vì sao chúng chạy được code trên máy bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Supply chain safety</h2>
<p class="lead">You audit your own code. But how much of what runs in production did you actually write? Let's count.</p>

<h3>One dependency, sixty-seven packages</h3>
<pre><code>npm init -y
npm i express@4
ls node_modules | wc -l</code></pre>
<div class="out">packages in node_modules : 67
declared dependencies    : 1
size of node_modules     : 3.9M</div>
<p>You approved <strong>one</strong> package. You installed sixty-seven, written by dozens of people you have never met, any of whom can publish an update that lands in your next build. That is the supply chain, and it is why the rest of this lesson exists.</p>

<h3>Installing runs code — before you import anything</h3>
<p>A package can declare lifecycle scripts that npm executes automatically at install time. Here is a harmless package whose only job is to prove the point:</p>
<pre><code>{
  <span class="tok-string">"name"</span>: <span class="tok-string">"harmless-package"</span>,
  <span class="tok-string">"scripts"</span>: {
    <span class="tok-string">"postinstall"</span>: <span class="tok-string">"node -e \\"require('fs').writeFileSync(os.homedir()+'/.i-was-here.txt', ...)\\""</span>
  }
}</code></pre>
<pre><code>npm install ./harmless-package     <span class="tok-comment"># we never imported it</span>
ls ~/.i-was-here.txt</code></pre>
<div class="out">⚠️  file created in HOME: "this script ran during npm install"</div>
<p>Read that again: <strong>no import, no require, no code of ours ran</strong> — and the package already wrote a file outside the project. A real attacker would read your environment variables, your SSH keys or your cloud credentials instead.</p>
<pre><code>npm install --ignore-scripts ./harmless-package</code></pre>
<div class="out">✅ no file — the script was blocked</div>
<div class="callout warn"><code>--ignore-scripts</code> is a strong default for CI. Be aware some legitimate packages need install scripts to compile native code (sharp, bcrypt, better-sqlite3) — so test before enforcing it globally. You can set it permanently with <code>npm config set ignore-scripts true</code> and opt in per package.</div>

<h3>Pinned versions are not automatically safe either</h3>
<p>Lesson 4.2 argued for the lockfile. Here is the counterweight — the same express 4.18.0 we pinned:</p>
<pre><code>npm audit</code></pre>
<div class="out">send  &lt;0.19.0
send vulnerable to template injection that can lead to XSS
node_modules/send
  serve-static  &lt;=1.16.0
  Depends on vulnerable versions of send

7 vulnerabilities (3 low, 1 moderate, 3 high)</div>
<p>Three <strong>high</strong> severity issues — none of them in code we wrote, all of them in dependencies of dependencies. Pinning gives you reproducibility, not immunity. The two must be balanced:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Pin for reproducibility</span><span class="v">Lockfile committed, npm ci everywhere.</span></div>
  <div class="kv"><span class="k">Update on a schedule</span><span class="v">Run <code>npm audit</code> and <code>npm outdated</code> regularly — a pinned tree left alone for two years is a museum of known vulnerabilities.</span></div>
  <div class="kv"><span class="k">Read before you fix</span><span class="v"><code>npm audit fix --force</code> can install a major version and break your app. Check what it wants to change.</span></div>
</div>

<h3>Before you add a dependency</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Do you need it?</span><span class="v">Modern Node has fetch, test runner, watch mode, structuredClone and argument parsing built in. Many small packages are now redundant.</span></div>
  <div class="kv"><span class="k">Check the name character by character</span><span class="v">Typosquatting is real: <code>expres</code>, <code>lodahs</code>, <code>crossenv</code>. Copy the name from the official docs, never type it from memory.</span></div>
  <div class="kv"><span class="k">Look at its own dependency count</span><span class="v"><code>npm ls</code> after installing. A "tiny helper" pulling 40 packages is not tiny.</span></div>
  <div class="kv"><span class="k">Check maintenance</span><span class="v">Last publish date, open issues, whether one person maintains something a million projects depend on.</span></div>
</div>
<div class="pitfall">The riskiest moment is not choosing a package — it is the <em>update</em> months later. Historically the damaging npm incidents were popular, trusted packages whose maintainer account was compromised, shipping a malicious patch release. A caret range plus no lockfile means that release reaches you automatically.</div>
<div class="note-ct">This is also why secrets on this site live in the server's runtime environment and never in the repository. If a build-time script ever exfiltrated the environment it could read them — so the blast radius is deliberately kept small: no long-lived credentials in CI, and the deploy user cannot read the production database directly.</div>
<h3>Reducing what a dependency can do to you</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Read the tree, not the list</span><span class="lz-d">One direct dependency is often sixty-seven packages. <code>npm ls --all</code> is the number that matters, and it is the surface you actually installed.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Install scripts run before you import anything</span><span class="lz-d"><code>--ignore-scripts</code> in CI, and audit the few packages that genuinely need one. This is the step where a compromised package acts.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Pin with a lockfile, install with npm ci</span><span class="lz-d">A range lets a patch release in without review. <code>npm ci</code> installs exactly what was committed.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Then check what changed, not just what broke</span><span class="lz-d"><code>npm audit</code> for known issues, and a diff of the lockfile in code review — an unexplained new transitive dependency is worth a question.</span></div>
</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-319" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 319 — Core Modules and the npm Ecosystem</span><span class="lc-sub">10 exercises covering npm, packaging and module resolution.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>An toàn chuỗi cung ứng</h2>
<p class="lead">Bạn rà soát kỹ code của mình. Nhưng trong những thứ đang chạy trên production, bao nhiêu phần thật sự do bạn viết? Ta đếm thử.</p>

<h3>Một phụ thuộc, sáu mươi bảy gói</h3>
<pre><code>npm init -y
npm i express@4
ls node_modules | wc -l</code></pre>
<div class="out">số gói trong node_modules : 67
số phụ thuộc bạn khai báo : 1
kích thước node_modules   : 3.9M</div>
<p>Bạn phê duyệt <strong>một</strong> gói. Bạn cài về sáu mươi bảy gói, viết bởi hàng chục người bạn chưa từng gặp, mà bất kỳ ai trong số đó cũng có thể phát hành một bản cập nhật rơi thẳng vào lần build kế tiếp của bạn. Đó chính là chuỗi cung ứng, và là lý do phần còn lại của bài này tồn tại.</p>

<h3>Việc cài đặt có chạy code — trước cả khi bạn import gì</h3>
<p>Một gói có thể khai báo các script vòng đời để npm tự động chạy lúc cài. Đây là một gói vô hại mà nhiệm vụ duy nhất là chứng minh điều đó:</p>
<pre><code>{
  <span class="tok-string">"name"</span>: <span class="tok-string">"goi-vo-hai"</span>,
  <span class="tok-string">"scripts"</span>: {
    <span class="tok-string">"postinstall"</span>: <span class="tok-string">"node -e \\"require('fs').writeFileSync(os.homedir()+'/.no-la-toi-day.txt', ...)\\""</span>
  }
}</code></pre>
<pre><code>npm install ./goi-vo-hai     <span class="tok-comment"># ta chưa hề import nó</span>
ls ~/.no-la-toi-day.txt</code></pre>
<div class="out">⚠️  File đã bị tạo ở thư mục HOME: "script nay da chay luc npm install"</div>
<p>Hãy đọc lại: <strong>không import, không require, không một dòng code nào của ta chạy</strong> — vậy mà gói đó đã ghi được một file ra ngoài phạm vi dự án. Kẻ tấn công thật sẽ đọc biến môi trường, khoá SSH hoặc thông tin đăng nhập đám mây của bạn thay vì ghi một file vô hại.</p>
<pre><code>npm install --ignore-scripts ./goi-vo-hai</code></pre>
<div class="out">✅ KHÔNG có file — script đã bị chặn</div>
<div class="callout warn"><code>--ignore-scripts</code> là một mặc định tốt cho CI. Nhưng lưu ý vài gói chính đáng cần script cài đặt để biên dịch mã native (sharp, bcrypt, better-sqlite3) — nên hãy thử kỹ trước khi áp dụng toàn cục. Bạn có thể bật vĩnh viễn bằng <code>npm config set ignore-scripts true</code> rồi mở ngoại lệ cho từng gói.</div>

<h3>Ghim phiên bản cũng KHÔNG tự động an toàn</h3>
<p>Bài 4.2 đã bênh vực lockfile. Đây là mặt đối trọng — vẫn đúng bản express 4.18.0 mà ta vừa ghim:</p>
<pre><code>npm audit</code></pre>
<div class="out">send  &lt;0.19.0
send vulnerable to template injection that can lead to XSS
node_modules/send
  serve-static  &lt;=1.16.0
  Depends on vulnerable versions of send

7 vulnerabilities (3 low, 1 moderate, 3 high)</div>
<p>Ba lỗ hổng mức <strong>cao</strong> — không cái nào nằm trong code ta viết, tất cả đều nằm ở phụ thuộc của phụ thuộc. Ghim phiên bản cho bạn tính tái lập, chứ không cho bạn miễn nhiễm. Hai điều đó phải được cân bằng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ghim để tái lập được</span><span class="v">Commit lockfile, dùng npm ci ở mọi nơi.</span></div>
  <div class="kv"><span class="k">Cập nhật theo lịch</span><span class="v">Chạy <code>npm audit</code> và <code>npm outdated</code> đều đặn — một cây phụ thuộc ghim cứng bỏ đó hai năm là một bảo tàng các lỗ hổng đã công bố.</span></div>
  <div class="kv"><span class="k">Đọc trước khi sửa</span><span class="v"><code>npm audit fix --force</code> có thể cài lên một bản major và làm hỏng ứng dụng. Hãy xem nó định đổi những gì.</span></div>
</div>

<h3>Trước khi thêm một phụ thuộc</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Có thật sự cần không?</span><span class="v">Node hiện đại đã có sẵn fetch, bộ chạy test, chế độ watch, structuredClone và phân tích tham số dòng lệnh. Nhiều gói nhỏ giờ đã thừa.</span></div>
  <div class="kv"><span class="k">Soi tên từng chữ cái</span><span class="v">Typosquatting là có thật: <code>expres</code>, <code>lodahs</code>, <code>crossenv</code>. Hãy copy tên từ tài liệu chính chủ, đừng bao giờ gõ theo trí nhớ.</span></div>
  <div class="kv"><span class="k">Xem chính nó kéo theo bao nhiêu gói</span><span class="v">Chạy <code>npm ls</code> sau khi cài. Một "gói tiện ích tí hon" mà lôi về 40 gói thì không tí hon chút nào.</span></div>
  <div class="kv"><span class="k">Kiểm tra mức độ được chăm sóc</span><span class="v">Ngày phát hành gần nhất, số issue đang mở, và liệu có phải chỉ một người đang gánh thứ mà cả triệu dự án phụ thuộc vào hay không.</span></div>
</div>
<div class="pitfall">Khoảnh khắc rủi ro nhất không phải lúc chọn gói — mà là lúc <em>cập nhật</em> vài tháng sau đó. Trong lịch sử, những sự cố npm gây thiệt hại đều rơi vào các gói phổ biến và đáng tin, nhưng tài khoản người bảo trì bị chiếm rồi phát hành một bản vá độc hại. Dải dấu mũ cộng với việc không có lockfile nghĩa là bản phát hành đó tới tay bạn một cách tự động.</div>
<div class="note-ct">Đây cũng là lý do các bí mật của website này nằm trong môi trường chạy của server chứ không bao giờ nằm trong kho mã nguồn. Nếu một script lúc build có thể tuồn biến môi trường ra ngoài thì nó sẽ đọc được chúng — nên bán kính thiệt hại được cố tình giữ nhỏ: không để thông tin đăng nhập sống lâu trong CI, và tài khoản deploy không đọc thẳng được cơ sở dữ liệu production.</div>
<h3>Thu hẹp thứ mà một phụ thuộc làm được với bạn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Hãy đọc cái CÂY, đừng đọc cái danh sách</span><span class="lz-d">Một phụ thuộc trực tiếp thường là sáu mươi bảy package. <code>npm ls --all</code> mới là con số đáng kể, và đó mới là bề mặt bạn thật sự đã cài.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Script cài đặt chạy TRƯỚC khi bạn import bất cứ thứ gì</span><span class="lz-d">Hãy dùng <code>--ignore-scripts</code> trong CI, và soi kỹ vài package thật sự cần một cái. Đây là bước mà một package bị chiếm sẽ ra tay.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ghim bằng file lock, cài bằng npm ci</span><span class="lz-d">Một khoảng phiên bản cho phép một bản vá lọt vào mà chẳng ai duyệt. <code>npm ci</code> cài đúng thứ đã được commit.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Rồi kiểm cái gì đã ĐỔI, đừng chỉ kiểm cái gì hỏng</span><span class="lz-d"><code>npm audit</code> cho các vấn đề đã biết, và một bản diff của file lock trong lúc review mã — một phụ thuộc gián tiếp mới xuất hiện không rõ lý do là đáng để hỏi một câu.</span></div>
</div>
<a class="link-card codelab" href="/code-lab/nodejs-express${REF}#module-319" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Module 319 — Module lõi &amp; hệ sinh thái npm</span><span class="lc-sub">10 bài tập về npm, đóng gói và cách phân giải module.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 4.4 QUIZ ─────────────────────────── */
    {
      title: '4.4 — Chapter 4 quiz|||4.4 — Kiểm tra chương 4',
      slug: 'nodejs-4-4-quiz',
      type: 'QUIZ',
      description: 'Bảy câu về package.json, semver, lockfile và an toàn chuỗi cung ứng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">This chapter has no clever algorithms, but it prevents more wasted hours than any other. Most "works on my machine" incidents are answered by two of these questions.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Chương này không có thuật toán cao siêu nào, nhưng nó cứu bạn khỏi nhiều giờ lãng phí hơn mọi chương khác. Phần lớn sự cố "máy tôi chạy được mà" được trả lời bởi hai trong số các câu hỏi dưới đây.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'What does "^4.18.0" allow npm to install?|||"^4.18.0" cho phép npm cài những bản nào?',
            options: [
              'Only exactly 4.18.0|||Chỉ đúng bản 4.18.0',
              'Any 4.18.x (patch only)|||Bất kỳ bản 4.18.x nào (chỉ patch)',
              'Any 4.x.x from 4.18.0 up — minor and patch may move|||Bất kỳ bản 4.x.x nào từ 4.18.0 trở lên — minor và patch đều được nhảy',
              'Any version including 5.x|||Bất kỳ phiên bản nào, kể cả 5.x',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Which command installs EXACTLY what the lockfile says and never rewrites it?|||Lệnh nào cài ĐÚNG Y những gì lockfile ghi và không bao giờ ghi đè nó?',
            options: ['npm install', 'npm ci', 'npm update', 'npm audit fix'],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Should package-lock.json be committed to git for an application?|||Với một ứng dụng, có nên commit package-lock.json vào git không?',
            options: [
              'Yes, always — it is what makes installs reproducible|||Có, luôn luôn — chính nó làm cho việc cài đặt tái lập được',
              'No, add it to .gitignore|||Không, hãy cho vào .gitignore',
              'Only for libraries|||Chỉ với thư viện',
              'Only if the team is larger than five people|||Chỉ khi nhóm đông hơn năm người',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You run "npm i express@4" with one dependency declared. How many packages land in node_modules?|||Bạn chạy "npm i express@4" với đúng một phụ thuộc khai báo. Có bao nhiêu gói vào node_modules?',
            options: ['1', '67', '5', '200+'],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Can an npm package run code on your machine WITHOUT you importing it?|||Một gói npm có thể chạy code trên máy bạn mà KHÔNG cần bạn import nó không?',
            options: [
              'No — code only runs when imported|||Không — code chỉ chạy khi được import',
              'Yes — lifecycle scripts like postinstall run during npm install|||Có — các script vòng đời như postinstall chạy ngay lúc npm install',
              'Only if you install it globally|||Chỉ khi bạn cài nó toàn cục',
              'Only on Windows|||Chỉ trên Windows',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A package belongs in dependencies (not devDependencies) when…|||Một gói thuộc về dependencies (chứ không phải devDependencies) khi…',
            options: [
              'it is large|||nó có dung lượng lớn',
              'code in src/ imports it and runs in production|||code trong src/ có import nó và chạy trên production',
              'you installed it first|||bạn cài nó trước tiên',
              'it has no sub-dependencies|||nó không có phụ thuộc con nào',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'npm audit reports 3 high-severity issues in a PINNED dependency tree. What does this prove?|||npm audit báo 3 lỗ hổng mức cao trong một cây phụ thuộc ĐÃ GHIM. Điều đó chứng minh gì?',
            options: [
              'The lockfile is broken and should be deleted|||Lockfile bị hỏng và nên xoá đi',
              'Pinning gives reproducibility, not immunity — you must still update on a schedule|||Ghim cho tính tái lập chứ không cho miễn nhiễm — vẫn phải cập nhật theo lịch',
              'Vulnerabilities only affect devDependencies|||Lỗ hổng chỉ ảnh hưởng tới devDependencies',
              'You should always run npm audit fix --force immediately|||Nên chạy ngay npm audit fix --force mọi lúc',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
