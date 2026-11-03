/**
 * Bài 1.5 — Node & npm (nâng cấp 02/11/2026). Output thật: _demo/_t1/npm/chay.sh (Node 22.23 + npm 10.9 trong thư mục tạm,
 * cấu hình npm CÔ LẬP, cài thật từ registry: dayjs@1.11.13, nodemon@3.1.4): node -e, npm init -y, Cannot find module trước khi
 * cài, dependencies vs devDependencies (1 gói ⇒ 29 gói), package-lock (resolved + integrity), ^ và ~ theo semver, scripts,
 * npm run strat, npm ci sau khi xoá node_modules. Deck: scripts/slides-src/wf-1-5.mjs. Code Lab: wf-1-5-node-npm.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-1-5', 'Node and npm', 'Node và npm', [
  [1, 'Node and npm',
    '<p>Node runs JavaScript outside the browser, on your computer or a server. npm installs other people\'s code into your project and runs your project\'s commands. Every JavaScript project you will open, from React to an API, starts with these two. This lesson builds a tiny project with real installs and shows every file npm creates.</p>',
    '<p>Node chạy JavaScript bên ngoài trình duyệt, trên máy bạn hay trên máy chủ. npm cài mã của người khác vào dự án và chạy các lệnh của dự án. Mọi dự án JavaScript bạn sẽ mở, từ React tới API, đều bắt đầu bằng hai thứ này. Bài này dựng một dự án nhỏ với lượt cài thật và cho thấy mọi tệp npm tạo ra.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to run JavaScript with node, create package dot json, install a dependency and a dev dependency, explain node modules and the lock file, read version ranges like caret one point eleven, add and run scripts, and reinstall a project exactly with npm ci.</p>',
    '<p>Bạn sẽ chạy được JavaScript bằng node, tạo package chấm json, cài một dependency và một dev dependency, giải thích node modules và tệp lock, đọc khoảng phiên bản như mũ một chấm mười một, thêm và chạy script, và cài lại dự án chính xác bằng npm ci.</p>'],
  [3, 'Node runs JavaScript',
    '<p>node dash e ran one line: two plus three is five, window is undefined because there is no browser, and process is an object because Node gives you access to the computer instead. node index dot js runs a file, and words after the file name arrive in process dot argv.</p>',
    '<p>node gạch e chạy một dòng: hai cộng ba là năm, window là undefined vì không có trình duyệt, còn process là một object vì Node cho bạn truy cập máy tính thay vào đó. node index chấm js chạy một tệp, và các chữ sau tên tệp đến trong process chấm argv.</p>'],
  [4, 'package.json and the first install',
    '<p>npm init dash y wrote package dot json, the ID card of the project. Running the app first failed with Cannot find module dayjs. npm install dayjs downloaded it into node modules and recorded it under dependencies with the range caret one point eleven point thirteen. Then the app ran.</p>',
    '<p>npm init gạch y ghi ra package chấm json, chứng minh thư của dự án. Chạy app lúc đầu hỏng với Cannot find module dayjs. npm install dayjs tải nó vào node modules và ghi vào dependencies với khoảng mũ một chấm mười một chấm mười ba. Rồi app chạy được.</p>'],
  [5, 'Dev dependencies multiply',
    '<p>One development tool, nodemon, brought twenty nine packages, because it depends on other packages, which depend on others. node modules grew to three and a half megabytes. npm also reported two known vulnerabilities in that pinned old version.</p>',
    '<p>Một công cụ phát triển, nodemon, kéo theo hai mươi chín gói, vì nó phụ thuộc vào gói khác, gói đó lại phụ thuộc gói khác nữa. node modules lên tới ba phẩy rưỡi megabyte. npm còn báo hai lỗ hổng đã biết trong phiên bản cũ được ghim đó.</p>'],
  [6, 'The lock file and version ranges',
    '<p>package dash lock dot json records the exact version, the download address and a checksum. Caret allows newer minor and patch versions but not two point zero; tilde allows only patches. The lock file makes every install identical anyway.</p>',
    '<p>package gạch lock chấm json ghi phiên bản chính xác, địa chỉ tải về và một mã kiểm tra. Dấu mũ cho phép bản minor và patch mới hơn nhưng không cho hai chấm không; dấu ngã chỉ cho patch. Dù vậy tệp lock khiến mọi lần cài đều giống hệt nhau.</p>'],
  [7, 'Scripts',
    '<p>The scripts section gives names to commands: start, dev, test. npm run lists them, npm start runs the app, npm test runs the tests, and a typo prints Missing script. Teams agree on these names so anyone can start any project.</p>',
    '<p>Phần scripts đặt tên cho các lệnh: start, dev, test. npm run liệt kê chúng, npm start chạy app, npm test chạy kiểm thử, và gõ sai thì in Missing script. Các nhóm thống nhất những tên này để ai cũng khởi động được mọi dự án.</p>'],
  [8, 'Reinstall exactly: npm ci',
    '<p>After deleting node modules the app failed again. npm ci read the lock file and reinstalled exactly the same versions, and the app ran. That is why node modules is never committed and the lock file always is.</p>',
    '<p>Sau khi xoá node modules app lại hỏng. npm ci đọc tệp lock và cài lại đúng các phiên bản đó, và app chạy. Đó là lý do node modules không bao giờ được commit còn tệp lock thì luôn được commit.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to turn your portfolio folder into an npm project with one dependency, one dev dependency, start and test scripts, and a clean reinstall. Done when npm test passes and git status shows package dot json and the lock file but not node modules.</p>',
    '<p>Bài luyện yêu cầu bạn biến thư mục portfolio thành dự án npm với một dependency, một dev dependency, script start và test, và một lần cài lại sạch. Xong khi npm test đạt và git status hiện package chấm json cùng tệp lock nhưng không có node modules.</p>'],
]);

export default {
  title: '1.5 — Node & npm: running JS and installing libraries|||1.5 — Node & npm: chạy JS và cài thư viện',
  slug: 'wf-1-5-node-npm',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/TlB_eWDSMt4', durationSeconds: 0 },
  description: 'Node 22.23 + npm 10.9 chạy thật: node -e (window undefined, process có), npm init -y, "Cannot find module dayjs" trước khi cài, dependencies vs devDependencies (nodemon kéo 29 gói, 3,5 MB, 2 lỗ hổng), package-lock (resolved + integrity), ^ và ~ kiểm bằng semver, scripts start/dev/test, "Missing script", npm ci cài lại đúng phiên bản.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Node runs JavaScript; npm brings in other people's code</h2>
<p class="lead">After this lesson you can run JavaScript files with Node, start a project with <code>package.json</code>, install libraries as dependencies or dev dependencies, explain <code>node_modules</code> and <code>package-lock.json</code>, read version ranges like <code>^1.11.13</code>, give your project <code>start</code>/<code>dev</code>/<code>test</code> scripts, and reinstall any project exactly with <code>npm ci</code>. The first thing you do with any JavaScript project you clone — React, Next.js, an Express API, this website — is <code>npm install</code> then <code>npm run dev</code>; after this lesson you will know what both do.</p>

<h3>Step 0 — install Node</h3>
<p>Install the current <strong>LTS</strong> version from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a> (or with a version manager such as <code>nvm</code> / <code>fnm</code>, which lets you switch versions per project). npm comes with it. Everything below ran with Node 22.23 and npm 10.9, installing real packages from the npm registry, in an empty folder called <code>shop</code>.</p>

<h3>Step 1 — Node runs JavaScript outside the browser</h3>
${ra(OUT['_t1/npm/out/node'])}
<p><code>typeof window</code> is <code>"undefined"</code>: there is no page, no DOM, no <code>document</code>. Instead Node gives you <code>process</code> (arguments, environment variables, exit codes), files (<code>node:fs</code>), the network (<code>node:http</code>) — what a server needs. The language is the same JavaScript as Chapter 4.</p>
${ma('javascript', CODE['_t1/npm/index.js'])}

<h3>Step 2 — <code>package.json</code>: the project's ID card</h3>
${ra(OUT['_t1/npm/out/init'])}
<div class="kv-grid">
  <div class="kv"><span class="k">name / version</span><span class="v">Identify the project (and the package, if you publish it).</span></div>
  <div class="kv"><span class="k">main</span><span class="v">The entry file when someone <code>require</code>s the package.</span></div>
  <div class="kv"><span class="k">scripts</span><span class="v">Named commands — Step 6.</span></div>
  <div class="kv"><span class="k">dependencies / devDependencies</span><span class="v">Added by <code>npm install</code> — Steps 3–4.</span></div>
  <div class="kv"><span class="k">"type": "module"</span><span class="v">Add it to use <code>import</code>/<code>export</code> in <code>.js</code> files (Lesson 5.5); without it, Node uses <code>require</code>.</span></div>
</div>

<h3>Step 3 — the first dependency</h3>
${ra(OUT['_t1/npm/out/install'])}
<p>The first run failed exactly where it should: <code>Error: Cannot find module 'dayjs'</code>, with the line that asked for it (<code>index.js:2:15</code>). <code>npm install dayjs@1.11.13</code> downloaded the package from <code>registry.npmjs.org</code> into <code>node_modules/dayjs</code>, wrote it into <code>package.json</code> as <code>"dayjs": "^1.11.13"</code>, created <code>package-lock.json</code>, and checked known vulnerabilities ("audited … found 0"). Then the same command worked. In daily work you type <code>npm install dayjs</code> without a version and get the latest; the version is pinned here so the output stays the same.</p>

<h3>Step 4 — dev dependencies, and why <code>node_modules</code> is big</h3>
${ra(OUT['_t1/npm/out/devdeps'])}
<table>
<thead><tr><th></th><th>dependencies</th><th>devDependencies</th></tr></thead>
<tbody>
<tr><td>Install with</td><td><code>npm install pkg</code></td><td><code>npm install --save-dev pkg</code> (<code>-D</code>)</td></tr>
<tr><td>Needed when</td><td>the app <strong>runs</strong> (dayjs, express, react)</td><td>you <strong>develop</strong> (nodemon, typescript, eslint, test tools)</td></tr>
<tr><td>On a production server</td><td>installed</td><td>skipped with <code>npm ci --omit=dev</code></td></tr>
</tbody>
</table>
<p>One development tool brought <strong>29</strong> packages: nodemon depends on other packages, which depend on others (<em>transitive</em> dependencies). <code>npm ls</code> shows only the two you asked for; <code>node_modules</code> holds all 30 folders and 3.5 MB. A real React project easily reaches several hundred packages and hundreds of megabytes — which is why it never goes into Git.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — ignoring "vulnerabilities" or blindly running <code>npm audit fix --force</code>.</strong> npm reported 2 moderate vulnerabilities, because this lesson pinned an old nodemon. Read <code>npm audit</code>: it names the package and the issue. Often the fix is simply installing a newer version (<code>npm install -D nodemon@latest</code>). <code>--force</code> may jump major versions and break your project — use it only when you understand what it changes. And every package you add is code from a stranger that runs on your machine: prefer well-known packages, and do not install one for something you can write in five lines.</p></div>

<h3>Step 5 — the lock file and version ranges</h3>
${ra(OUT['_t1/npm/out/lock'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">1.11.13</span><span class="lz-t">MAJOR.MINOR.PATCH</span><span class="lz-d">Semantic versioning: PATCH = fixes, MINOR = new features (compatible), MAJOR = breaking changes.</span></div>
<div class="lz-layer"><span class="lz-k">^1.11.13</span><span class="lz-t">caret: same major</span><span class="lz-d">1.11.23 ✔, 1.12.0 ✔, 2.0.0 ✘ — npm's default.</span></div>
<div class="lz-layer"><span class="lz-k">~1.11.13</span><span class="lz-t">tilde: same minor</span><span class="lz-d">1.11.23 ✔, 1.12.0 ✘.</span></div>
<div class="lz-layer"><span class="lz-k">package-lock.json</span><span class="lz-t">the exact answer</span><span class="lz-d">Version 1.11.13, the exact <code>resolved</code> URL and an <code>integrity</code> checksum, for every package in the tree.</span></div>
</div>
<p><code>package.json</code> says what is <em>acceptable</em>; <code>package-lock.json</code> says what was <em>actually installed</em>. Commit both. Without the lock file, a teammate installing next month could get 1.12.0 — usually fine, occasionally the start of a "works on my machine" mystery.</p>

<h3>Step 6 — scripts: the project's commands</h3>
${ma('javascript', CODE['_t1/npm/index.test.js'])}
${ra(OUT['_t1/npm/out/scripts'])}
<table>
<thead><tr><th>Script</th><th>Run with</th><th>Convention</th></tr></thead>
<tbody>
<tr><td><code>start</code></td><td><code>npm start</code></td><td>run the app (production style)</td></tr>
<tr><td><code>dev</code></td><td><code>npm run dev</code></td><td>run with auto-restart / hot reload (nodemon, Vite, Next.js)</td></tr>
<tr><td><code>test</code></td><td><code>npm test</code></td><td>run the tests — exit code 0 = pass (Lesson 1.1)</td></tr>
<tr><td><code>build</code>, <code>lint</code>, <code>typecheck</code></td><td><code>npm run build</code>…</td><td>produce output / check code (Chapter 9)</td></tr>
</tbody>
</table>
<p><code>start</code> and <code>test</code> are special and run without <code>run</code>; every other name needs <code>npm run</code>. Everything after <code>--</code> is passed to your script (<code>npm start -- Minh</code> became <code>node index.js Minh</code>). Scripts can call tools in <code>node_modules/.bin</code> (like <code>nodemon</code>) without installing them globally. <code>npm test</code> printed TAP format here because the output went to a file; in your terminal Node prints the same result with ✔ marks.</p>

<h3>Step 7 — reinstall exactly: <code>npm ci</code></h3>
${ra(OUT['_t1/npm/out/ci'])}
<p>Delete <code>node_modules</code> and the app breaks; <code>npm ci</code> reads the lock file and recreates the identical tree (deleting any existing <code>node_modules</code> first). That is what CI servers, Docker builds and a teammate cloning your repository do. Use <code>npm install</code> when you <em>change</em> dependencies, <code>npm ci</code> when you want exactly what the lock file says.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — committing <code>node_modules</code>, or not committing the lock file.</strong> <code>node_modules</code> is generated, huge, and partly specific to your operating system — put <code>node_modules/</code> in <code>.gitignore</code> (Lesson 1.3) before your first <code>git add .</code>. The lock file is the opposite: small, and the only record of exact versions — always commit it. And when a project breaks after pulling, try <code>npm ci</code> (or delete <code>node_modules</code> and <code>npm install</code>) before anything else: someone probably added a dependency.</p></div>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">git clone</span><span class="lz-t">get the code</span><span class="lz-d">package.json + lock file, no node_modules</span></div>
<div class="lz-step"><span class="lz-k">npm ci</span><span class="lz-t">get the dependencies</span><span class="lz-d">exact versions from the lock file</span></div>
<div class="lz-step"><span class="lz-k">cp .env.example .env</span><span class="lz-t">configure</span><span class="lz-d">secrets are never in the repo (1.3)</span></div>
<div class="lz-step"><span class="lz-k">npm run dev</span><span class="lz-t">run it</span><span class="lz-d">read the README for the project's scripts</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (40 minutes) — your portfolio as an npm project</strong></p>
<ol>
<li>In <code>practice/portfolio</code>: <code>npm init -y</code>. Check that <code>node_modules/</code> is in your <code>.gitignore</code> from Lesson 1.3.</li>
<li><code>npm install dayjs</code> and write <code>js/today.js</code> that prints today's date as <code>dddd D MMMM YYYY</code>. Run it with <code>node js/today.js</code>.</li>
<li><code>npm install -D nodemon</code>. Add scripts: <code>"start": "node js/today.js"</code>, <code>"dev": "nodemon js/today.js"</code>, <code>"test": "node --test"</code>.</li>
<li>Write <code>today.test.js</code> with one test (like this lesson's) and run <code>npm test</code>.</li>
<li>Delete <code>node_modules</code>, run <code>npm start</code> (it fails), then <code>npm ci</code> and <code>npm start</code> again.</li>
<li><code>git add .</code> and <code>git status --short</code>, then commit.</li>
</ol>
<p>Hint: <code>npm run</code> with no name lists all your scripts — use it whenever you open someone else's project.</p>
<p><strong>Done when:</strong> <code>npm test</code> passes, <code>npm start</code> prints today's date after <code>npm ci</code>, and <code>git status --short</code> before the commit listed <code>package.json</code> and <code>package-lock.json</code> but nothing inside <code>node_modules</code>. Then Code Lab module 1.5.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">runtime</span><span class="v">môi trường chạy — Node chạy JS ngoài trình duyệt.</span></div>
  <div class="kv"><span class="k">package / registry</span><span class="v">gói / kho gói (npmjs.org).</span></div>
  <div class="kv"><span class="k">package.json</span><span class="v">tệp mô tả dự án.</span></div>
  <div class="kv"><span class="k">dependency / devDependency</span><span class="v">gói cần khi chạy / gói cần khi phát triển.</span></div>
  <div class="kv"><span class="k">transitive dependency</span><span class="v">phụ thuộc bắc cầu.</span></div>
  <div class="kv"><span class="k">node_modules</span><span class="v">thư mục chứa các gói đã cài.</span></div>
  <div class="kv"><span class="k">lock file</span><span class="v">tệp khoá phiên bản — package-lock.json.</span></div>
  <div class="kv"><span class="k">semver ^ ~</span><span class="v">đánh số phiên bản ngữ nghĩa; mũ / ngã.</span></div>
  <div class="kv"><span class="k">npm script</span><span class="v">lệnh đặt tên trong package.json.</span></div>
  <div class="kv"><span class="k">npm ci</span><span class="v">cài chính xác theo tệp lock.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Node runs JavaScript with <code>process</code>, files and network instead of <code>window</code> and the DOM.</li>
  <li><code>package.json</code> describes the project; <code>npm install</code> fills <code>node_modules</code> and the lock file.</li>
  <li>Dependencies run the app; devDependencies help you build it — and bring their own dependencies.</li>
  <li><code>^</code> = same major, <code>~</code> = same minor; the lock file records the exact versions.</li>
  <li>Scripts: <code>npm start</code>, <code>npm test</code>, <code>npm run dev</code>; <code>npm run</code> lists them.</li>
  <li>Commit <code>package.json</code> + lock file, never <code>node_modules</code>; <code>npm ci</code> recreates it exactly.</li>
</ul>
${nguon('📗', 'npm Docs — package.json', 'Every field, scripts, dependencies and version ranges', 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json')}
${nguon('📘', 'Node.js — Introduction to Node.js', 'What Node is and how it differs from the browser', 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-4-1-package-json', title: 'Node.js 4.1 — package.json', sub: 'Packages, versions and npm security in depth', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Node chạy JavaScript; npm mang mã của người khác về</h2>
<p class="lead">Học xong bài này bạn chạy được tệp JavaScript bằng Node, bắt đầu dự án với <code>package.json</code>, cài thư viện làm dependency hay dev dependency, giải thích <code>node_modules</code> và <code>package-lock.json</code>, đọc khoảng phiên bản như <code>^1.11.13</code>, cho dự án các script <code>start</code>/<code>dev</code>/<code>test</code>, và cài lại mọi dự án chính xác bằng <code>npm ci</code>. Việc đầu tiên bạn làm với bất kỳ dự án JavaScript nào vừa clone — React, Next.js, một API Express, chính website này — là <code>npm install</code> rồi <code>npm run dev</code>; sau bài này bạn sẽ biết cả hai làm gì.</p>

<h3>Bước 0 — cài Node</h3>
<p>Cài bản <strong>LTS</strong> hiện tại từ <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a> (hoặc bằng trình quản lý phiên bản như <code>nvm</code> / <code>fnm</code>, cho phép đổi phiên bản theo từng dự án). npm đi kèm. Mọi thứ dưới đây chạy bằng Node 22.23 và npm 10.9, cài gói thật từ registry của npm, trong một thư mục trống tên <code>shop</code>.</p>

<h3>Bước 1 — Node chạy JavaScript ngoài trình duyệt</h3>
${ra(OUT['_t1/npm/out/node'])}
<p><code>typeof window</code> là <code>"undefined"</code>: không có trang, không có DOM, không có <code>document</code>. Thay vào đó Node cho bạn <code>process</code> (đối số, biến môi trường, mã thoát), tệp (<code>node:fs</code>), mạng (<code>node:http</code>) — thứ một máy chủ cần. Ngôn ngữ vẫn là JavaScript như Chương 4.</p>
${ma('javascript', CODE['_t1/npm/index.js'])}

<h3>Bước 2 — <code>package.json</code>: chứng minh thư của dự án</h3>
${ra(OUT['_t1/npm/out/init'])}
<div class="kv-grid">
  <div class="kv"><span class="k">name / version</span><span class="v">Định danh dự án (và gói, nếu bạn đăng nó lên).</span></div>
  <div class="kv"><span class="k">main</span><span class="v">Tệp vào khi có người <code>require</code> gói.</span></div>
  <div class="kv"><span class="k">scripts</span><span class="v">Các lệnh có tên — Bước 6.</span></div>
  <div class="kv"><span class="k">dependencies / devDependencies</span><span class="v">Do <code>npm install</code> thêm vào — Bước 3–4.</span></div>
  <div class="kv"><span class="k">"type": "module"</span><span class="v">Thêm vào để dùng <code>import</code>/<code>export</code> trong tệp <code>.js</code> (Bài 5.5); không có thì Node dùng <code>require</code>.</span></div>
</div>

<h3>Bước 3 — dependency đầu tiên</h3>
${ra(OUT['_t1/npm/out/install'])}
<p>Lần chạy đầu hỏng đúng chỗ phải hỏng: <code>Error: Cannot find module 'dayjs'</code>, kèm dòng đã đòi nó (<code>index.js:2:15</code>). <code>npm install dayjs@1.11.13</code> tải gói từ <code>registry.npmjs.org</code> vào <code>node_modules/dayjs</code>, ghi vào <code>package.json</code> là <code>"dayjs": "^1.11.13"</code>, tạo <code>package-lock.json</code>, và kiểm lỗ hổng đã biết ("audited … found 0"). Rồi cùng lệnh đó chạy được. Thường ngày bạn gõ <code>npm install dayjs</code> không kèm phiên bản và nhận bản mới nhất; ở đây phiên bản được ghim để output không đổi.</p>

<h3>Bước 4 — dev dependency, và vì sao <code>node_modules</code> nặng</h3>
${ra(OUT['_t1/npm/out/devdeps'])}
<table>
<thead><tr><th></th><th>dependencies</th><th>devDependencies</th></tr></thead>
<tbody>
<tr><td>Cài bằng</td><td><code>npm install gói</code></td><td><code>npm install --save-dev gói</code> (<code>-D</code>)</td></tr>
<tr><td>Cần khi</td><td>app <strong>chạy</strong> (dayjs, express, react)</td><td>bạn <strong>phát triển</strong> (nodemon, typescript, eslint, công cụ kiểm thử)</td></tr>
<tr><td>Trên máy chủ production</td><td>được cài</td><td>bỏ qua bằng <code>npm ci --omit=dev</code></td></tr>
</tbody>
</table>
<p>Một công cụ phát triển kéo theo <strong>29</strong> gói: nodemon phụ thuộc các gói khác, các gói đó lại phụ thuộc gói khác nữa (phụ thuộc <em>bắc cầu</em>). <code>npm ls</code> chỉ hiện hai gói bạn yêu cầu; <code>node_modules</code> chứa cả 30 thư mục và 3,5 MB. Một dự án React thật dễ dàng lên tới vài trăm gói và hàng trăm megabyte — vì thế nó không bao giờ vào Git.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — lờ "vulnerabilities" hoặc chạy mù <code>npm audit fix --force</code>.</strong> npm báo 2 lỗ hổng mức trung bình, vì bài này ghim một bản nodemon cũ. Đọc <code>npm audit</code>: nó nêu tên gói và vấn đề. Thường cách sửa chỉ là cài bản mới hơn (<code>npm install -D nodemon@latest</code>). <code>--force</code> có thể nhảy phiên bản major và làm hỏng dự án — chỉ dùng khi bạn hiểu nó đổi gì. Và mỗi gói bạn thêm là mã của người lạ chạy trên máy bạn: ưu tiên gói nổi tiếng, và đừng cài một gói cho việc bạn viết được trong năm dòng.</p></div>

<h3>Bước 5 — tệp lock và khoảng phiên bản</h3>
${ra(OUT['_t1/npm/out/lock'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">1.11.13</span><span class="lz-t">MAJOR.MINOR.PATCH</span><span class="lz-d">Đánh số ngữ nghĩa: PATCH = sửa lỗi, MINOR = tính năng mới (tương thích), MAJOR = thay đổi phá vỡ.</span></div>
<div class="lz-layer"><span class="lz-k">^1.11.13</span><span class="lz-t">mũ: cùng major</span><span class="lz-d">1.11.23 ✔, 1.12.0 ✔, 2.0.0 ✘ — mặc định của npm.</span></div>
<div class="lz-layer"><span class="lz-k">~1.11.13</span><span class="lz-t">ngã: cùng minor</span><span class="lz-d">1.11.23 ✔, 1.12.0 ✘.</span></div>
<div class="lz-layer"><span class="lz-k">package-lock.json</span><span class="lz-t">câu trả lời chính xác</span><span class="lz-d">Phiên bản 1.11.13, đúng URL <code>resolved</code> và mã kiểm <code>integrity</code>, cho mọi gói trong cây.</span></div>
</div>
<p><code>package.json</code> nói cái gì <em>chấp nhận được</em>; <code>package-lock.json</code> nói cái gì <em>đã thật sự được cài</em>. Commit cả hai. Không có tệp lock, đồng đội cài vào tháng sau có thể nhận 1.12.0 — thường không sao, thỉnh thoảng là khởi đầu của bí ẩn "máy tôi chạy được mà".</p>

<h3>Bước 6 — scripts: các lệnh của dự án</h3>
${ma('javascript', CODE['_t1/npm/index.test.js'])}
${ra(OUT['_t1/npm/out/scripts'])}
<table>
<thead><tr><th>Script</th><th>Chạy bằng</th><th>Quy ước</th></tr></thead>
<tbody>
<tr><td><code>start</code></td><td><code>npm start</code></td><td>chạy app (kiểu production)</td></tr>
<tr><td><code>dev</code></td><td><code>npm run dev</code></td><td>chạy kèm tự khởi động lại / hot reload (nodemon, Vite, Next.js)</td></tr>
<tr><td><code>test</code></td><td><code>npm test</code></td><td>chạy kiểm thử — mã thoát 0 = đạt (Bài 1.1)</td></tr>
<tr><td><code>build</code>, <code>lint</code>, <code>typecheck</code></td><td><code>npm run build</code>…</td><td>sinh output / kiểm mã (Chương 9)</td></tr>
</tbody>
</table>
<p><code>start</code> và <code>test</code> đặc biệt, chạy không cần <code>run</code>; mọi tên khác cần <code>npm run</code>. Mọi thứ sau <code>--</code> được chuyển cho script (<code>npm start -- Minh</code> thành <code>node index.js Minh</code>). Script gọi được công cụ trong <code>node_modules/.bin</code> (như <code>nodemon</code>) mà không cần cài toàn cục. <code>npm test</code> in dạng TAP ở đây vì output được ghi ra tệp; trong terminal của bạn Node in cùng kết quả với dấu ✔.</p>

<h3>Bước 7 — cài lại chính xác: <code>npm ci</code></h3>
${ra(OUT['_t1/npm/out/ci'])}
<p>Xoá <code>node_modules</code> là app hỏng; <code>npm ci</code> đọc tệp lock và dựng lại đúng cây đó (xoá <code>node_modules</code> cũ trước nếu có). Đó là việc máy CI, bản build Docker và đồng đội clone kho của bạn làm. Dùng <code>npm install</code> khi bạn <em>thay đổi</em> dependency, <code>npm ci</code> khi bạn muốn đúng y những gì tệp lock ghi.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — commit <code>node_modules</code>, hoặc không commit tệp lock.</strong> <code>node_modules</code> được sinh ra, rất nặng, và một phần phụ thuộc hệ điều hành — đưa <code>node_modules/</code> vào <code>.gitignore</code> (Bài 1.3) trước lần <code>git add .</code> đầu tiên. Tệp lock thì ngược lại: nhỏ, và là bản ghi duy nhất của phiên bản chính xác — luôn commit nó. Và khi dự án hỏng sau khi pull, thử <code>npm ci</code> (hoặc xoá <code>node_modules</code> rồi <code>npm install</code>) trước mọi thứ khác: rất có thể ai đó vừa thêm một dependency.</p></div>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">git clone</span><span class="lz-t">lấy mã</span><span class="lz-d">package.json + tệp lock, không có node_modules</span></div>
<div class="lz-step"><span class="lz-k">npm ci</span><span class="lz-t">lấy các gói</span><span class="lz-d">đúng phiên bản trong tệp lock</span></div>
<div class="lz-step"><span class="lz-k">cp .env.example .env</span><span class="lz-t">cấu hình</span><span class="lz-d">bí mật không bao giờ nằm trong kho (1.3)</span></div>
<div class="lz-step"><span class="lz-k">npm run dev</span><span class="lz-t">chạy</span><span class="lz-d">đọc README để biết script của dự án</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (40 phút) — portfolio thành dự án npm</strong></p>
<ol>
<li>Trong <code>practice/portfolio</code>: <code>npm init -y</code>. Kiểm <code>node_modules/</code> đã có trong <code>.gitignore</code> của Bài 1.3.</li>
<li><code>npm install dayjs</code> và viết <code>js/today.js</code> in ngày hôm nay dạng <code>dddd D MMMM YYYY</code>. Chạy bằng <code>node js/today.js</code>.</li>
<li><code>npm install -D nodemon</code>. Thêm script: <code>"start": "node js/today.js"</code>, <code>"dev": "nodemon js/today.js"</code>, <code>"test": "node --test"</code>.</li>
<li>Viết <code>today.test.js</code> có một phép kiểm (như trong bài) và chạy <code>npm test</code>.</li>
<li>Xoá <code>node_modules</code>, chạy <code>npm start</code> (hỏng), rồi <code>npm ci</code> và <code>npm start</code> lần nữa.</li>
<li><code>git add .</code> và <code>git status --short</code>, rồi commit.</li>
</ol>
<p>Gợi ý: <code>npm run</code> không kèm tên liệt kê mọi script — dùng nó mỗi khi mở dự án của người khác.</p>
<p><strong>Xong khi:</strong> <code>npm test</code> đạt, <code>npm start</code> in ngày hôm nay sau <code>npm ci</code>, và <code>git status --short</code> trước khi commit liệt kê <code>package.json</code> và <code>package-lock.json</code> nhưng không có gì bên trong <code>node_modules</code>. Sau đó làm module Code Lab 1.5.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">runtime</span><span class="v">môi trường chạy — Node chạy JS ngoài trình duyệt.</span></div>
  <div class="kv"><span class="k">package / registry</span><span class="v">gói / kho gói (npmjs.org).</span></div>
  <div class="kv"><span class="k">package.json</span><span class="v">tệp mô tả dự án.</span></div>
  <div class="kv"><span class="k">dependency / devDependency</span><span class="v">gói cần khi chạy / gói cần khi phát triển.</span></div>
  <div class="kv"><span class="k">transitive dependency</span><span class="v">phụ thuộc bắc cầu.</span></div>
  <div class="kv"><span class="k">node_modules</span><span class="v">thư mục chứa các gói đã cài.</span></div>
  <div class="kv"><span class="k">lock file</span><span class="v">tệp khoá phiên bản — package-lock.json.</span></div>
  <div class="kv"><span class="k">semver ^ ~</span><span class="v">đánh số phiên bản ngữ nghĩa; mũ / ngã.</span></div>
  <div class="kv"><span class="k">npm script</span><span class="v">lệnh đặt tên trong package.json.</span></div>
  <div class="kv"><span class="k">npm ci</span><span class="v">cài chính xác theo tệp lock.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Node chạy JavaScript với <code>process</code>, tệp và mạng thay vì <code>window</code> và DOM.</li>
  <li><code>package.json</code> mô tả dự án; <code>npm install</code> lấp đầy <code>node_modules</code> và tệp lock.</li>
  <li>Dependency để chạy app; devDependency để dựng nó — và chúng kéo theo phụ thuộc riêng.</li>
  <li><code>^</code> = cùng major, <code>~</code> = cùng minor; tệp lock ghi phiên bản chính xác.</li>
  <li>Script: <code>npm start</code>, <code>npm test</code>, <code>npm run dev</code>; <code>npm run</code> liệt kê chúng.</li>
  <li>Commit <code>package.json</code> + tệp lock, không bao giờ <code>node_modules</code>; <code>npm ci</code> dựng lại chính xác.</li>
</ul>
${nguon('📗', 'npm Docs — package.json', 'Mọi trường, scripts, dependencies và khoảng phiên bản', 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json')}
${nguon('📘', 'Node.js — Introduction to Node.js', 'Node là gì và khác trình duyệt ra sao', 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-4-1-package-json', title: 'Node.js 4.1 — package.json', sub: 'Gói, phiên bản và bảo mật npm, chuyên sâu', cta: 'Mở bài' })}
</div>
`,
};
