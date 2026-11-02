/**
 * Bài 5.5 — ES modules (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/5-5; _demo/_t5/chay.mjs mở trang module bằng
 * file:// để chụp lỗi CORS thật). Deck: scripts/slides-src/wf-5-5.mjs (9 slide, WF/v1/wf-5-5). Code Lab: module 5.5 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-5-5', 'ES modules', 'ES module', [
  [1, 'ES modules',
    '<p>As soon as a program grows past a few hundred lines, one file becomes hard to work with. Modules let you split code into files that each expose a few things and keep the rest private. Every modern JavaScript project — React, Node.js, Vite — is built from modules.</p>',
    '<p>Khi chương trình vượt quá vài trăm dòng, một tệp duy nhất trở nên khó làm việc. Module cho phép tách mã thành nhiều tệp, mỗi tệp công khai vài thứ và giữ phần còn lại riêng tư. Mọi dự án JavaScript hiện đại — React, Node.js, Vite — đều được dựng từ module.</p>'],
  [2, 'After this lesson you can…',
    '<p>The traps here are about details that tools rarely explain well: a missing file extension, a name that does not match, and opening a module page by double-clicking it. Each one is reproduced with its real error message so you will recognise it.</p>',
    '<p>Các bẫy ở đây là những chi tiết công cụ hiếm khi giải thích rõ: thiếu đuôi tệp, một cái tên không khớp, và mở trang module bằng cách bấm đúp. Mỗi cái được tái hiện kèm thông báo lỗi thật để bạn nhận ra ngay.</p>'],
  [3, 'Named and default exports',
    '<p>A file chooses what to share with <code>export</code>. Named exports are imported by their exact names, in braces, and can be renamed with <code>as</code>. A default export is the one main thing of a file, imported without braces under any name you like.</p>',
    '<p>Một tệp chọn thứ để chia sẻ bằng <code>export</code>. Export có tên được import đúng tên, trong ngoặc nhọn, và có thể đổi tên bằng <code>as</code>. Export default là thứ chính duy nhất của tệp, import không cần ngoặc với tên bạn thích.</p>'],
  [4, 'Running modules in the browser',
    '<p>One attribute, <code>type="module"</code>, switches a script into module mode. The real output shows what changes: imports work, top-level variables stay private instead of becoming globals, <code>this</code> is undefined, strict mode is on, and the script is deferred automatically.</p>',
    '<p>Một thuộc tính, <code>type="module"</code>, chuyển script sang chế độ module. Output thật cho thấy những gì thay đổi: import chạy được, biến cấp ngoài cùng giữ riêng tư thay vì thành biến toàn cục, <code>this</code> là undefined, chế độ nghiêm ngặt được bật, và script tự động được defer.</p>'],
  [5, 'A module runs once',
    '<p>Two imports of the same counter, one shared state: the numbers continue 1, 2, 3, and the file’s log line printed only once. A module is evaluated the first time it is imported and cached afterwards. That is how a shared store or a single database connection works.</p>',
    '<p>Hai lần import cùng một bộ đếm, một trạng thái dùng chung: con số tiếp nối 1, 2, 3, và dòng log của tệp chỉ in một lần. Module được chạy lần đầu khi được import và được lưu đệm sau đó. Đó là cách một kho dùng chung hay một kết nối cơ sở dữ liệu duy nhất hoạt động.</p>'],
  [6, 'Errors you will meet',
    '<p>Importing a name the file does not export fails before any code runs, with a precise message. Forgetting the <code>.js</code> extension makes the browser request a file that does not exist. In the browser, paths are URLs: they must start with ./ or ../ and include the extension.</p>',
    '<p>Import một cái tên mà tệp không export sẽ hỏng trước khi mã nào chạy, với thông báo chính xác. Quên đuôi <code>.js</code> khiến trình duyệt xin một tệp không tồn tại. Trong trình duyệt, đường dẫn là URL: phải bắt đầu bằng ./ hoặc ../ và có đuôi tệp.</p>'],
  [7, 'Double-click does not work',
    '<p>Opening the same page from the disk with a file address blocks every module, with a CORS error for each file. Modules are fetched with the same rules as network requests, and a file address has no origin. Serve the folder over HTTP instead, with Live Server or <code>npx serve</code>.</p>',
    '<p>Mở cùng trang đó từ đĩa bằng địa chỉ file sẽ chặn mọi module, với một lỗi CORS cho mỗi tệp. Module được tải theo cùng luật với request mạng, và địa chỉ file không có origin. Hãy phục vụ thư mục qua HTTP, bằng Live Server hoặc <code>npx serve</code>.</p>'],
  [8, 'Modules in Node.js and with npm',
    '<p>Node.js understands the same syntax in <code>.mjs</code> files, or in <code>.js</code> files when <code>package.json</code> says <code>"type": "module"</code>. Older Node code uses <code>require</code>. Packages are imported by bare name, which works in Node and in bundlers like Vite, not in a plain browser.</p>',
    '<p>Node.js hiểu cùng cú pháp đó trong tệp <code>.mjs</code>, hoặc trong tệp <code>.js</code> khi <code>package.json</code> ghi <code>"type": "module"</code>. Mã Node cũ hơn dùng <code>require</code>. Gói được import bằng tên trần, chạy được trong Node và trong bundler như Vite, không chạy trong trình duyệt thường.</p>'],
  [9, 'Summary & practice',
    '<p>The practice splits the todo app from Lesson 4.5 into four modules: data, storage, view and the entry file. "Done when" checks that the app still works and that nothing leaked into the global scope.</p>',
    '<p>Bài luyện tách app todo ở Bài 4.5 thành bốn module: dữ liệu, lưu trữ, giao diện và tệp khởi đầu. "Xong khi" kiểm rằng app vẫn chạy và không có gì rò ra phạm vi toàn cục.</p>'],
]);

export default {
  title: '5.5 — ES modules: splitting code into files|||5.5 — ES module: tách mã thành nhiều tệp',
  slug: 'wf-5-5-es-modules',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/qgRUr-YUk1Q', durationSeconds: 0 },
  description: 'Export có tên và export default, import đổi tên và import *, type="module" thay đổi gì (biến riêng tư, this undefined, defer), module chạy một lần (trạng thái dùng chung), lỗi sai tên export và thiếu đuôi .js (thông báo thật), mở bằng file:// bị CORS chặn (đo thật), module trong Node.js và npm.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Splitting a program into files that share only what they choose</h2>
<p class="lead">After this lesson you can export functions, values and classes from a file, import them with the right syntax, load modules in the browser, explain why a module's variables are private and its code runs only once, fix the three classic module errors from their messages, and recognise the same system in Node.js and npm packages. You need this because every real project is many files: a React app has hundreds of components, a Node API has routes, services and helpers. Modules are how those files talk to each other without stepping on each other.</p>

<h3>Why modules?</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Before</span><span class="lz-t">many classic scripts</span><span class="lz-d">Every top-level variable is global; files must load in the right order; two files using <code>count</code> clash.</span></div>
<div class="lz-layer"><span class="lz-k">With modules</span><span class="lz-t">each file is its own world</span><span class="lz-d">Nothing is shared unless exported; dependencies are explicit imports; the browser works out the order.</span></div>
</div>

<h3>Step 1 — exporting</h3>
<p>Three small module files. A file with several helpers uses <strong>named exports</strong>:</p>
${ma('javascript', CODE['5-5/mod/math.js'])}
<p>A file whose purpose is one thing uses a <strong>default export</strong>:</p>
${ma('javascript', CODE['5-5/mod/user.js'])}
<p>And this one keeps state inside the module, exporting only a function:</p>
${ma('javascript', CODE['5-5/mod/counter.js'])}

<h3>Step 2 — importing, in the browser</h3>
${ma('html', CODE['5-5/app.html'], [5, 17])}
${ra(OUT['5-5/app'].split('\n').slice(0, 7).join('\n'))}
<table>
<thead><tr><th>Syntax</th><th>Imports</th></tr></thead>
<tbody>
<tr><td><code>import { add, PI } from './mod/math.js'</code></td><td>Named exports, by their exact names</td></tr>
<tr><td><code>import { PI as pi } from …</code></td><td>A named export under a new local name</td></tr>
<tr><td><code>import User from './mod/user.js'</code></td><td>The default export, any name you like, no braces</td></tr>
<tr><td><code>import * as math from …</code></td><td>Everything, as one object (<code>math.add</code>)</td></tr>
<tr><td><code>await import('./x.js')</code></td><td>Load later, on demand: returns a promise</td></tr>
</tbody>
</table>
<p>Look at the last two output lines. <code>this</code> at the top of a module is <code>undefined</code>, because modules run in strict mode. And <code>window.add</code> does not exist: a module's top-level variables are <strong>private</strong> to that file. A module script is also deferred automatically (Lesson 4.5), so it can use the page's elements.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Named</span><span class="v">For files that offer several things. Names must match exactly, which also helps your editor rename and find usages.</span></div>
  <div class="kv"><span class="k">Default</span><span class="v">For one main thing per file, such as a React component. The importer chooses the name, so names can drift between files.</span></div>
</div>

<h3>Step 3 — a module runs only once</h3>
<p>The first output line came from <code>counter.js</code>, although the page imported it twice. And <code>shared state: 1 2 3</code> shows that <code>next</code> and <code>nextAgain</code> use one <code>count</code>. A module is evaluated the first time anyone imports it; after that, every import gets the same, cached instance.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Find all imports</span><span class="lz-d">The browser reads the import lines first and downloads every file in the graph.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Link the names</span><span class="lz-d">Every imported name is checked against the exports. A mismatch stops everything here.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Run each module once</span><span class="lz-d">Dependencies first. The results are cached.</span></div>
</div>
<p>That is useful: a module that creates a database connection, a configuration object or a store creates it once, and everyone who imports it shares it.</p>

<h3>Step 4 — the errors you will meet</h3>
${ma('html', CODE['5-5/app.html'], [19, 28])}
${ra(OUT['5-5/app'].split('\n').slice(7).join('\n'))}
<p>The first error is about the file <code>sai-ten.js</code>, which imports <code>ad</code> from <code>math.js</code>. It is caught when the names are linked, before any line runs, with a precise message. The second is a missing extension: in the browser a path is a URL, and <code>./mod/math</code> is a different file from <code>./mod/math.js</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — writing paths the way bundlers allow.</strong> In Vite, React or Next.js projects you will see <code>import Button from './Button'</code> and <code>import React from 'react'</code>. That works because a build tool resolves the extension and the bare package name for you. A plain browser does not: it needs <code>./</code> or <code>../</code>, and the <code>.js</code> extension. If code copied from a tutorial fails in a simple HTML page, this is usually why.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — default versus named, mixed up.</strong> <code>import { User } from './user.js'</code> when the file has <code>export default</code> fails with "does not provide an export named 'User'". And <code>import add from './math.js'</code> when there is no default fails the same way. Read the error: it tells you exactly which name is missing.</p></div>

<h3>Step 5 — double-clicking a module page does not work</h3>
<p>We opened the very same <code>app.html</code> from the disk, as a <code>file://</code> address, instead of through a server:</p>
${ra(OUT['_t5/out/module-file'].split('\n').slice(0, 2).join('\n'))}
<p>The same error appeared for every module file, and the page did nothing. Modules are loaded with the same security rules as network requests, and a page opened from the disk has no origin (<code>'null'</code>). Serve the folder over HTTP: VS Code's Live Server extension, <code>npx serve</code>, or <code>npx vite</code>. This is the most common "my modules do not work" report from beginners.</p>

<h3>Step 6 — the same system in Node.js and npm</h3>
<table>
<thead><tr><th></th><th>ES modules (modern)</th><th>CommonJS (older Node)</th></tr></thead>
<tbody>
<tr><td>Export</td><td><code>export function f() {}</code></td><td><code>module.exports = { f }</code></td></tr>
<tr><td>Import</td><td><code>import { f } from './f.js'</code></td><td><code>const { f } = require('./f')</code></td></tr>
<tr><td>Files</td><td><code>.mjs</code>, or <code>.js</code> with <code>"type": "module"</code> in package.json</td><td><code>.cjs</code>, or <code>.js</code> by default</td></tr>
<tr><td>Loading</td><td>Static, checked before running; top-level <code>await</code></td><td>Synchronous, at run time</td></tr>
</tbody>
</table>
<p>Packages from npm (Lesson 1.5) are imported by name: <code>import { format } from 'date-fns'</code>. Node.js finds them in <code>node_modules</code>, and bundlers like Vite (Lesson 14.1) do the same for the browser and combine all your modules into a few optimised files.</p>

<div class="callout ok">
<p><strong>🧪 Practice (40 minutes) — split the todo app into modules</strong></p>
<p>Take your todo app from Lesson 4.5 and create:</p>
<pre><code>todo/
├─ index.html          &lt;script type="module" src="./js/main.js"&gt;
└─ js/
   ├─ tasks.js         pure functions: addTask, toggleTask, removeTask (named exports)
   ├─ storage.js       load() and save() with localStorage and try/catch
   ├─ view.js          export default function render(list, tasks)
   └─ main.js          imports the three, wires up the events</code></pre>
<ol>
<li>Move code into the files above; <code>tasks</code> lives only in <code>main.js</code>.</li>
<li>Make every function in <code>tasks.js</code> return a new array (Lesson 4.4).</li>
<li>Serve the folder over HTTP.</li>
</ol>
<p>Hint: when something fails, the Console names the file and the missing export. Fix them one by one.</p>
<p><strong>Done when:</strong> the app works exactly as before and survives a reload; <code>typeof render</code> and <code>typeof tasks</code> in the Console are both <code>"undefined"</code> (nothing leaked into the global scope); the Network tab shows four JavaScript files; and opening <code>index.html</code> by double-click shows the CORS error, so you know why you serve it. Then Code Lab module 5.5.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">module</span><span class="v">một tệp có phạm vi riêng, chia sẻ qua export.</span></div>
  <div class="kv"><span class="k">named export</span><span class="v">export có tên — import đúng tên, trong ngoặc nhọn.</span></div>
  <div class="kv"><span class="k">default export</span><span class="v">export mặc định — thứ chính của tệp.</span></div>
  <div class="kv"><span class="k">import specifier</span><span class="v">đường dẫn trong lệnh import.</span></div>
  <div class="kv"><span class="k">module scope</span><span class="v">phạm vi module — biến không thành toàn cục.</span></div>
  <div class="kv"><span class="k">dynamic import</span><span class="v">import() — tải module khi cần.</span></div>
  <div class="kv"><span class="k">module graph</span><span class="v">đồ thị các module import lẫn nhau.</span></div>
  <div class="kv"><span class="k">CommonJS</span><span class="v">hệ module cũ của Node: require / module.exports.</span></div>
  <div class="kv"><span class="k">bare specifier</span><span class="v">tên gói trần như 'react' — cần Node hoặc bundler.</span></div>
  <div class="kv"><span class="k">bundler</span><span class="v">công cụ gom module thành tệp tối ưu (Vite).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>export</code> what a file shares; everything else stays private to the file.</li>
  <li>Named exports: exact names in braces. Default: one main thing, no braces.</li>
  <li><code>type="module"</code>: imports, private scope, strict mode, <code>this</code> is undefined, deferred.</li>
  <li>A module runs once; every importer shares its state.</li>
  <li>Name mismatches fail before any code runs; read the message.</li>
  <li>In the browser: <code>./</code> and the <code>.js</code> extension; bare names need a bundler.</li>
  <li>Serve over HTTP: <code>file://</code> blocks modules.</li>
  <li>Node.js: <code>.mjs</code> or <code>"type": "module"</code>; older code uses <code>require</code>.</li>
</ul>
${nguon('📗', 'MDN — JavaScript modules', 'The complete guide, with examples', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules')}
${nguon('📘', 'javascript.info — Modules', 'Introduction, export and import, dynamic imports', 'https://javascript.info/modules-intro')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-5-module', title: 'Node.js 1.5 — modules on the server', sub: 'ESM and CommonJS side by side, and how Node resolves packages', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Tách chương trình thành nhiều tệp, mỗi tệp chỉ chia sẻ thứ nó chọn</h2>
<p class="lead">Học xong bài này bạn export được hàm, giá trị và lớp từ một tệp, import chúng đúng cú pháp, tải module trong trình duyệt, giải thích được vì sao biến của module là riêng tư và mã của nó chỉ chạy một lần, sửa được ba lỗi module kinh điển từ thông báo của chúng, và nhận ra cùng hệ thống đó trong Node.js và gói npm. Bạn cần điều này vì mọi dự án thật đều gồm nhiều tệp: app React có hàng trăm component, API Node có route, service và hàm trợ giúp. Module là cách các tệp đó nói chuyện với nhau mà không giẫm chân lên nhau.</p>

<h3>Vì sao cần module?</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Trước đây</span><span class="lz-t">nhiều script cổ điển</span><span class="lz-d">Mọi biến cấp ngoài cùng đều toàn cục; tệp phải tải đúng thứ tự; hai tệp cùng dùng <code>count</code> là đụng nhau.</span></div>
<div class="lz-layer"><span class="lz-k">Có module</span><span class="lz-t">mỗi tệp là một thế giới riêng</span><span class="lz-d">Không gì được chia sẻ nếu không export; phụ thuộc là import tường minh; trình duyệt tự tính thứ tự.</span></div>
</div>

<h3>Bước 1 — export</h3>
<p>Ba tệp module nhỏ. Tệp có nhiều hàm trợ giúp dùng <strong>export có tên</strong>:</p>
${ma('javascript', CODE['5-5/mod/math.js'])}
<p>Tệp có mục đích là một thứ duy nhất dùng <strong>export default</strong>:</p>
${ma('javascript', CODE['5-5/mod/user.js'])}
<p>Còn tệp này giữ trạng thái bên trong module, chỉ export một hàm:</p>
${ma('javascript', CODE['5-5/mod/counter.js'])}

<h3>Bước 2 — import, trong trình duyệt</h3>
${ma('html', CODE['5-5/app.html'], [5, 17])}
${ra(OUT['5-5/app'].split('\n').slice(0, 7).join('\n'))}
<table>
<thead><tr><th>Cú pháp</th><th>Import gì</th></tr></thead>
<tbody>
<tr><td><code>import { add, PI } from './mod/math.js'</code></td><td>Export có tên, đúng tên</td></tr>
<tr><td><code>import { PI as pi } from …</code></td><td>Một export có tên với tên cục bộ mới</td></tr>
<tr><td><code>import User from './mod/user.js'</code></td><td>Export default, tên tuỳ bạn, không ngoặc</td></tr>
<tr><td><code>import * as math from …</code></td><td>Tất cả, gói trong một object (<code>math.add</code>)</td></tr>
<tr><td><code>await import('./x.js')</code></td><td>Tải sau, khi cần: trả về promise</td></tr>
</tbody>
</table>
<p>Nhìn hai dòng output cuối. <code>this</code> ở cấp ngoài cùng của module là <code>undefined</code>, vì module chạy ở chế độ nghiêm ngặt. Và <code>window.add</code> không tồn tại: biến cấp ngoài cùng của module là <strong>riêng tư</strong> trong tệp đó. Script module còn tự động được defer (Bài 4.5), nên dùng được các phần tử của trang.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Có tên</span><span class="v">Cho tệp cung cấp nhiều thứ. Tên phải khớp chính xác, điều này cũng giúp trình soạn thảo đổi tên và tìm chỗ dùng.</span></div>
  <div class="kv"><span class="k">Default</span><span class="v">Cho một thứ chính mỗi tệp, như một component React. Bên import tự chọn tên, nên tên có thể lệch nhau giữa các tệp.</span></div>
</div>

<h3>Bước 3 — module chỉ chạy một lần</h3>
<p>Dòng output đầu tiên đến từ <code>counter.js</code>, dù trang import nó hai lần. Và <code>shared state: 1 2 3</code> cho thấy <code>next</code> và <code>nextAgain</code> dùng chung một <code>count</code>. Module được chạy lần đầu có ai đó import nó; sau đó mọi lần import đều nhận cùng một bản đã lưu đệm.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tìm mọi import</span><span class="lz-d">Trình duyệt đọc các dòng import trước và tải mọi tệp trong đồ thị.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nối các tên</span><span class="lz-d">Mỗi tên được import được đối chiếu với export. Không khớp là mọi thứ dừng ở đây.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chạy mỗi module một lần</span><span class="lz-d">Phụ thuộc chạy trước. Kết quả được lưu đệm.</span></div>
</div>
<p>Điều đó có ích: một module tạo kết nối cơ sở dữ liệu, một object cấu hình hay một kho dữ liệu sẽ tạo nó một lần, và ai import cũng dùng chung.</p>

<h3>Bước 4 — những lỗi bạn sẽ gặp</h3>
${ma('html', CODE['5-5/app.html'], [19, 28])}
${ra(OUT['5-5/app'].split('\n').slice(7).join('\n'))}
<p>Lỗi đầu nói về tệp <code>sai-ten.js</code>, nơi import <code>ad</code> từ <code>math.js</code>. Nó bị bắt lúc nối tên, trước khi dòng nào chạy, với thông báo chính xác. Lỗi thứ hai là thiếu đuôi tệp: trong trình duyệt đường dẫn là URL, và <code>./mod/math</code> là một tệp khác hẳn <code>./mod/math.js</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — viết đường dẫn kiểu bundler cho phép.</strong> Trong dự án Vite, React hay Next.js bạn sẽ thấy <code>import Button from './Button'</code> và <code>import React from 'react'</code>. Chạy được vì công cụ build tự tìm đuôi tệp và tên gói trần cho bạn. Trình duyệt thường thì không: nó cần <code>./</code> hoặc <code>../</code>, và đuôi <code>.js</code>. Nếu mã chép từ một hướng dẫn hỏng trong trang HTML đơn giản, thường là vì lý do này.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — lẫn default với có tên.</strong> <code>import { User } from './user.js'</code> khi tệp dùng <code>export default</code> sẽ hỏng với "does not provide an export named 'User'". Và <code>import add from './math.js'</code> khi không có default cũng hỏng như vậy. Hãy đọc lỗi: nó nói chính xác cái tên nào bị thiếu.</p></div>

<h3>Bước 5 — bấm đúp mở trang module thì không chạy</h3>
<p>Ta mở đúng <code>app.html</code> đó từ đĩa, bằng địa chỉ <code>file://</code>, thay vì qua máy chủ:</p>
${ra(OUT['_t5/out/module-file'].split('\n').slice(0, 2).join('\n'))}
<p>Lỗi y hệt xuất hiện cho mọi tệp module, và trang không làm gì cả. Module được tải theo cùng luật bảo mật với request mạng, và trang mở từ đĩa không có origin (<code>'null'</code>). Hãy phục vụ thư mục qua HTTP: extension Live Server của VS Code, <code>npx serve</code>, hoặc <code>npx vite</code>. Đây là lời than "module của mình không chạy" phổ biến nhất của người mới.</p>

<h3>Bước 6 — cùng hệ thống đó trong Node.js và npm</h3>
<table>
<thead><tr><th></th><th>ES module (hiện đại)</th><th>CommonJS (Node cũ)</th></tr></thead>
<tbody>
<tr><td>Export</td><td><code>export function f() {}</code></td><td><code>module.exports = { f }</code></td></tr>
<tr><td>Import</td><td><code>import { f } from './f.js'</code></td><td><code>const { f } = require('./f')</code></td></tr>
<tr><td>Tệp</td><td><code>.mjs</code>, hoặc <code>.js</code> khi package.json có <code>"type": "module"</code></td><td><code>.cjs</code>, hoặc <code>.js</code> theo mặc định</td></tr>
<tr><td>Cách tải</td><td>Tĩnh, kiểm trước khi chạy; có top-level <code>await</code></td><td>Đồng bộ, lúc chạy</td></tr>
</tbody>
</table>
<p>Gói từ npm (Bài 1.5) được import bằng tên: <code>import { format } from 'date-fns'</code>. Node.js tìm chúng trong <code>node_modules</code>, và bundler như Vite (Bài 14.1) làm điều tương tự cho trình duyệt, đồng thời gộp mọi module thành vài tệp tối ưu.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (40 phút) — tách app todo thành module</strong></p>
<p>Lấy app todo ở Bài 4.5 và tạo:</p>
<pre><code>todo/
├─ index.html          &lt;script type="module" src="./js/main.js"&gt;
└─ js/
   ├─ tasks.js         hàm thuần: addTask, toggleTask, removeTask (export có tên)
   ├─ storage.js       load() và save() với localStorage và try/catch
   ├─ view.js          export default function render(list, tasks)
   └─ main.js          import ba tệp kia, gắn các sự kiện</code></pre>
<ol>
<li>Chuyển mã vào các tệp ở trên; <code>tasks</code> chỉ sống trong <code>main.js</code>.</li>
<li>Cho mọi hàm trong <code>tasks.js</code> trả về mảng mới (Bài 4.4).</li>
<li>Phục vụ thư mục qua HTTP.</li>
</ol>
<p>Gợi ý: khi có gì hỏng, Console nêu tên tệp và export bị thiếu. Sửa từng cái một.</p>
<p><strong>Xong khi:</strong> app chạy y như trước và sống sót sau khi tải lại; <code>typeof render</code> và <code>typeof tasks</code> trong Console đều là <code>"undefined"</code> (không gì rò ra phạm vi toàn cục); thẻ Network hiện bốn tệp JavaScript; và mở <code>index.html</code> bằng bấm đúp thì thấy lỗi CORS, để bạn hiểu vì sao phải phục vụ nó. Sau đó làm module Code Lab 5.5.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">module</span><span class="v">một tệp có phạm vi riêng, chia sẻ qua export.</span></div>
  <div class="kv"><span class="k">named export</span><span class="v">export có tên — import đúng tên, trong ngoặc nhọn.</span></div>
  <div class="kv"><span class="k">default export</span><span class="v">export mặc định — thứ chính của tệp.</span></div>
  <div class="kv"><span class="k">import specifier</span><span class="v">đường dẫn trong lệnh import.</span></div>
  <div class="kv"><span class="k">module scope</span><span class="v">phạm vi module — biến không thành toàn cục.</span></div>
  <div class="kv"><span class="k">dynamic import</span><span class="v">import() — tải module khi cần.</span></div>
  <div class="kv"><span class="k">module graph</span><span class="v">đồ thị các module import lẫn nhau.</span></div>
  <div class="kv"><span class="k">CommonJS</span><span class="v">hệ module cũ của Node: require / module.exports.</span></div>
  <div class="kv"><span class="k">bare specifier</span><span class="v">tên gói trần như 'react' — cần Node hoặc bundler.</span></div>
  <div class="kv"><span class="k">bundler</span><span class="v">công cụ gom module thành tệp tối ưu (Vite).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>export</code> thứ một tệp chia sẻ; mọi thứ khác giữ riêng trong tệp.</li>
  <li>Export có tên: đúng tên trong ngoặc nhọn. Default: một thứ chính, không ngoặc.</li>
  <li><code>type="module"</code>: có import, phạm vi riêng, chế độ nghiêm ngặt, <code>this</code> là undefined, tự defer.</li>
  <li>Module chạy một lần; mọi bên import dùng chung trạng thái của nó.</li>
  <li>Sai tên sẽ hỏng trước khi mã nào chạy; hãy đọc thông báo.</li>
  <li>Trong trình duyệt: <code>./</code> và đuôi <code>.js</code>; tên gói trần cần bundler.</li>
  <li>Phục vụ qua HTTP: <code>file://</code> chặn module.</li>
  <li>Node.js: <code>.mjs</code> hoặc <code>"type": "module"</code>; mã cũ dùng <code>require</code>.</li>
</ul>
${nguon('📗', 'MDN — JavaScript modules', 'Hướng dẫn đầy đủ, kèm ví dụ', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules')}
${nguon('📘', 'javascript.info — Modules', 'Giới thiệu, export và import, import động', 'https://javascript.info/modules-intro')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-1-5-module', title: 'Node.js 1.5 — module ở máy chủ', sub: 'ESM và CommonJS đặt cạnh nhau, và cách Node tìm gói', cta: 'Mở bài' })}
</div>
`,
};
