/**
 * TypeScript · Mục 0 · 0.3 — Cài đặt: Node 22, TypeScript 7, VS Code. Slug giữ: typescript-0-3-cai-dat (giữ type VIDEO + video cũ).
 * Output: chạy thật Node 22.23.3 / npm 10.9.9 / tsc 7.0.2 (+ tsc 6.0.3 để đo) trong môi trường sạch (scripts/ts/chay.sh), 01/11/2026.
 * Dự án bước-từng-bước: <scratch>/ts/lab/ts-00-3-hello (bản sao tệp ở _labflow-ts/demo0/ts-00-3). Đo tốc độ trên bản `git archive` của
 * chính backend website (commit c572cf189, 1.199 tệp .ts) — xem _ma-ts-00-3.mjs OUT 50–54.
 */
import G from '../giang/ts-00-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma-ts-00-3.mjs';

// Lọc dòng (chỉ bỏ dòng, không sửa chữ): stack trace "    at …" của Node và khối TAP dài.
const boAt = (t) => t.split('\n').filter((l) => !/^\s+at /.test(l)).join('\n');
const NODE_JS = boAt(OUT['31-js-ext-node']);
const NODE_ENUM = boAt(OUT['33-enum-node']);
const TEST_DIR = OUT['40-test-dir'].split('\n').filter((l) => /^\$|Error: Cannot find|^not ok|^# (pass|fail)/.test(l)).join('\n');
const INIT = OUT['02-init'].split('\n').filter((l) => l.trim() !== '').join('\n');
const CHECK = OUT['42-check'].split('\n').filter((l) => l.trim() !== '' && !/^ℹ (cancelled|skipped|todo|suites)/.test(l)).join('\n');
const RED = OUT['61-practice-red'].split('\n').filter((l) => l.trim() !== '').join('\n');
const GREEN = OUT['60-practice-green'].split('\n').filter((l) => l.trim() !== '' && !/^ℹ (cancelled|skipped|todo|suites)/.test(l)).join('\n');
const TS6 = OUT['51-ts6-default'] + '\n\n' + OUT['52-ts6-8g'];
const TS7 = OUT['53-ts7'] + '\n\n' + OUT['54-ts7-lan2'];

const NVM = `# macOS / Linux — nvm (the version manager), then Node 22
nvm install 22.23.3
nvm use 22.23.3
nvm alias default 22.23.3

# Windows — nvm-windows (installer from GitHub) or fnm (winget install Schniz.fnm)
nvm install 22.23.3
nvm use 22.23.3`;
const TAO = `mkdir ts-00-3-hello
cd ts-00-3-hello
npm init -y
npm pkg set type=module
npm install --save-dev --save-exact typescript@7.0.2 @types/node@22.20.5`;

const OPT_EN = `<table>
<thead><tr><th>Option</th><th>In one plain sentence</th></tr></thead>
<tbody>
<tr><td><code>target: "es2024"</code></td><td>Which JavaScript features the code may use — Node 22 understands ES2024.</td></tr>
<tr><td><code>module: "nodenext"</code></td><td>Read <code>import</code>/<code>export</code> exactly the way Node does (ES modules because of <code>"type": "module"</code>).</td></tr>
<tr><td><code>types: ["node"]</code></td><td>Load the Node type package, so <code>process</code>, <code>Buffer</code>, <code>node:test</code> are known. TS 7 defaults to <code>[]</code> — nothing.</td></tr>
<tr><td><code>strict: true</code></td><td>Turn on the whole family of safety checks (TS 7 already does by default; we write it so nobody wonders).</td></tr>
<tr><td><code>noUncheckedIndexedAccess</code></td><td><code>arr[i]</code> may be <code>undefined</code> — tsc makes you handle it (Chapter 1.2 shows why).</td></tr>
<tr><td><code>noEmit: true</code></td><td>tsc only <strong>checks</strong>; it writes no <code>.js</code> files, because Node runs the <code>.ts</code> itself.</td></tr>
<tr><td><code>allowImportingTsExtensions</code></td><td>Allow <code>import … from './hello.ts'</code> — the spelling Node needs at runtime.</td></tr>
<tr><td><code>erasableSyntaxOnly</code></td><td>Refuse TypeScript syntax that Node's type stripping cannot run (<code>enum</code>, <code>namespace</code>, parameter properties).</td></tr>
<tr><td><code>verbatimModuleSyntax</code></td><td>Imports used only as types must say <code>import type</code>, so stripping them is safe.</td></tr>
<tr><td><code>skipLibCheck: true</code></td><td>Do not re-check the <code>.d.ts</code> files of installed packages — faster, and their bugs are not yours.</td></tr>
<tr><td><code>include: ["src"]</code></td><td>Which folder is the project. Files outside it are not checked by <code>npx tsc</code>.</td></tr>
</tbody>
</table>`;
const OPT_VI = `<table>
<thead><tr><th>Tuỳ chọn</th><th>Một câu dễ hiểu</th></tr></thead>
<tbody>
<tr><td><code>target: "es2024"</code></td><td>Code được dùng tính năng JavaScript tới đâu — Node 22 hiểu ES2024.</td></tr>
<tr><td><code>module: "nodenext"</code></td><td>Đọc <code>import</code>/<code>export</code> đúng y như Node đọc (ES module vì có <code>"type": "module"</code>).</td></tr>
<tr><td><code>types: ["node"]</code></td><td>Nạp gói kiểu của Node để <code>process</code>, <code>Buffer</code>, <code>node:test</code> được biết tới. TS 7 mặc định là <code>[]</code> — không nạp gì.</td></tr>
<tr><td><code>strict: true</code></td><td>Bật cả họ phép kiểm an toàn (TS 7 vốn mặc định bật; ta vẫn ghi ra để không ai phải đoán).</td></tr>
<tr><td><code>noUncheckedIndexedAccess</code></td><td><code>arr[i]</code> có thể là <code>undefined</code> — tsc bắt bạn xử lý (bài 1.2 cho thấy vì sao).</td></tr>
<tr><td><code>noEmit: true</code></td><td>tsc chỉ <strong>kiểm</strong>; không ghi ra tệp <code>.js</code> nào, vì Node tự chạy tệp <code>.ts</code>.</td></tr>
<tr><td><code>allowImportingTsExtensions</code></td><td>Cho phép <code>import … from './hello.ts'</code> — đúng cách viết mà Node cần lúc chạy.</td></tr>
<tr><td><code>erasableSyntaxOnly</code></td><td>Từ chối cú pháp TypeScript mà cơ chế bỏ kiểu của Node không chạy được (<code>enum</code>, <code>namespace</code>, parameter property).</td></tr>
<tr><td><code>verbatimModuleSyntax</code></td><td>Import chỉ dùng làm kiểu phải viết <code>import type</code>, để bỏ chúng đi là an toàn.</td></tr>
<tr><td><code>skipLibCheck: true</code></td><td>Không kiểm lại tệp <code>.d.ts</code> của các gói đã cài — nhanh hơn, và lỗi của chúng không phải của bạn.</td></tr>
<tr><td><code>include: ["src"]</code></td><td>Thư mục nào là dự án. Tệp nằm ngoài thì <code>npx tsc</code> không kiểm.</td></tr>
</tbody>
</table>`;



const NGUON = [
  nguon('🟢', 'Node.js 22.18.0 release notes (31 Jul 2025)', '“Type stripping is enabled by default” — read 1 Nov 2026.', 'https://nodejs.org/en/blog/release/v22.18.0'),
  nguon('📘', 'Node.js docs — Modules: TypeScript', '“Node.js ignores tsconfig.json files”; recommended erasableSyntaxOnly + verbatimModuleSyntax; extensions are mandatory — read 1 Nov 2026.', 'https://nodejs.org/api/typescript.html'),
  nguon('🔷', 'Announcing TypeScript 7.0 (8 Jul 2026)', 'Native Go compiler, 8–12× faster full builds, strict on by default, types defaults to [] — read 1 Nov 2026.', 'https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/'),
  nguon('🖥️', 'VS Code — TypeScript', 'How the editor’s built-in TypeScript support works — read 1 Nov 2026.', 'https://code.visualstudio.com/docs/languages/typescript'),
].join('\n');

export default {
  title: '0.3 — Setting up: Node 22, TypeScript 7, VS Code|||0.3 — Cài đặt: Node 22, TypeScript 7, VS Code',
  slug: 'typescript-0-3-cai-dat',
  type: 'VIDEO',
  isFreePreview: true,
  // Video: Programming with Mosh "TypeScript Tutorial for Beginners" — cài đặt + nền tảng.
  video: { url: 'https://youtu.be/d56mG7DezGs', durationSeconds: 0 },
  description: 'Từ thư mục trống tới dự án TypeScript chạy được trong 20 phút: Node 22.23.3, typescript 7.0.2 + @types/node ghim chính xác, tsconfig chuẩn của khoá giải thích từng dòng, npx tsc để KIỂM và node file.ts để CHẠY (hai việc tách rời — tệp lỗi kiểu vẫn chạy), npm run check, ba bẫy thật (TS5112, import .js, enum), VS Code dùng TS 6.0.3, và số đo tsc 6 vs 7 trên chính backend website.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Setting up: Node 22, TypeScript 7, VS Code</h2>
<p class="lead">Twenty minutes from an empty folder to a TypeScript project that checks and runs. You will use exactly this setup — the same versions, the same <code>tsconfig.json</code>, the same two commands — in every chapter of the course and in the LabFlow TS project. At the end you will know why there are <em>two</em> commands — <code>npx tsc</code> checks, <code>node</code> runs — why a file full of type errors can still run, and three traps that usually cost beginners an evening.</p>

<h3>Step 0 — Node 22</h3>
<p>Install Node with a version manager — <strong>nvm</strong> (macOS/Linux), <strong>nvm-windows</strong> or <strong>fnm</strong> (Windows) — then open a NEW terminal.</p>
${ma('bash', NVM)}
${ra(OUT['01-node'])}
<p>The third line: <code>process.features.typescript</code> is <code>'strip'</code> — this Node runs <code>.ts</code> files itself by <strong>type stripping (bỏ kiểu)</strong>: it deletes the annotations and runs the JavaScript left. Default since Node 22.18.0 (31 July 2025), hence the pin on 22.23.3.</p>

<h3>Step 1 — create the project and install TypeScript</h3>
${ma('bash', TAO)}
${ra(INIT)}
${ra(OUT['03-install'])}
${ma('json', CODE.pkg)}
<ul>
<li><strong><code>-D</code></strong> — a <em>dev dependency (phụ thuộc lúc phát triển)</em>: needed to check code, not to run it (<code>npm ci --omit=dev</code> skips it).</li>
<li><strong><code>-E</code></strong> — writes <code>"7.0.2"</code>, not <code>"^7.0.2"</code>, so nobody silently gets 7.1 with new errors. Upgrade the compiler on purpose.</li>
<li><strong><code>@types/node@22.20.5</code></strong> — the <em>type descriptions</em> of Node's API (<code>process</code>, <code>node:test</code>…), matched to Node 22. It contains no runnable code.</li>
<li><strong><code>npm pkg set type=module</code></strong> — <code>import</code>/<code>export</code> are ES modules, like the rest of the course.</li>
</ul>
<p>What actually got installed:</p>
${ra(OUT['05-size'])}
<p>TypeScript 7 is <strong>rewritten in Go</strong>: <code>typescript</code> (3.5 MB) is a launcher; the 26 MB native compiler comes in a package for your platform (<code>typescript-darwin-arm64</code> here). npm installs only the one of 20 that matches your OS and CPU.</p>

<h3>Step 2 — the compiler, and the config file</h3>
${ra(OUT['06-version'])}
${ra(OUT['07-init'])}
<p><code>tsc --init</code> writes a <code>tsconfig.json</code> with recommended settings. Read it once — every option has a comment:</p>
${ma('json', CODE.tsInit)}
<p>Key lines: <code>"module": "nodenext"</code>, <code>"types": []</code> (no global types, not even Node's), <code>"strict": true</code>; <code>jsx</code>/<code>declaration</code>/<code>sourceMap</code> are for libraries and React. The course uses a shorter file that matches how Node runs TypeScript:</p>
${ma('json', CODE.tsconfig)}
${OPT_EN}
<p><strong>Node ignores <code>tsconfig.json</code></strong> (Node docs) — only tsc and the editor read it — and tsc writes no JavaScript (<code>noEmit</code>): it only says “correct” or “wrong, here”.</p>

<h3>Step 3 — the first TypeScript file</h3>
${ma('typescript', CODE.hello)}
<p><code>minutes: number</code> and <code>: string</code> after the parentheses are <strong>type annotations (chú thích kiểu)</strong>: “this parameter is a number, this function returns a string”. <code>process.env.LAB ?? 'BE-201'</code> reads an environment variable with a default — tsc knows <code>process</code> only because of <code>types: ["node"]</code>.</p>
${ra(OUT['10-tsc-ok'])}
<p>No output and exit code 0: tsc found nothing wrong. Silence is success. Now run it:</p>
${ra(OUT['11-run'])}
${ra(OUT['12-run-env'])}

<h3>Step 4 — make it red on purpose</h3>
<p>Add a second file with the mistake every beginner makes once: passing <code>"21:00"</code> to a function that wants minutes.</p>
${ma('typescript', CODE.oops)}
${ra(OUT['13-tsc-red'])}
<p>File <code>src/oops.ts</code>, line 4, column 47, code <code>TS2345</code>, the reason; exit 1, so a script or CI stops here (0.2 teaches reading these).</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — Node runs the broken file anyway.</strong> Type stripping deletes types; it does not <em>check</em> them:</p>
${ra(OUT['14-node-runs-anyway'])}
<p>Exit code 0, and LabFlow announces that it closes at <code>NaN:NaN</code>. Nothing crashed, so nobody notices until a user sees it. <strong>Checking (<code>npx tsc</code>) and running (<code>node</code>) are two separate steps</strong>; if you only run, TypeScript protects you from nothing. This is the most important sentence of the setup — Lesson 0.4 builds the whole mental model on it.</p>
</div>
<p>The fix is to give the function what its type asks for:</p>
${ma('typescript', CODE.oopsFixed)}
${ra(OUT['15-fixed'])}

<h3>Step 5 — npm scripts and the first test</h3>
<p>Node also ships a test runner, <code>node:test</code>, so the first test needs no extra package:</p>
${ma('typescript', CODE.test)}
<p>The obvious command fails on Node 22 — it treats the folder name as a single file:</p>
${ra(TEST_DIR)}
<p>Give it a glob (a file pattern) instead, and put the commands into npm scripts so nobody has to remember them:</p>
${ra(OUT['41-scripts'])}
${ra(CHECK)}
<p><code>npm run check</code> runs the tests only if <code>typecheck</code> passed (<code>&amp;&amp;</code>). “Lab BE-201 opens at 07:00” appears because the test <em>imported</em> <code>hello.ts</code>, and importing runs top-level code.</p>

<h3>Three traps you will meet in the first week</h3>
<div class="pitfall co-tieu-de">
<p><strong>Trap (a) — <code>tsc file.ts</code> and the config file.</strong> Many tutorials write <code>tsc hello.ts</code>. In a folder that has <code>tsconfig.json</code>, TypeScript 7 refuses:</p>
${ra(OUT['20-file-arg'])}
<p>With <code>--ignoreConfig</code> it compiles — but with the <em>defaults</em>, not your config. Look what changes:</p>
${ra(OUT['21-ignore-config'])}
${ra(OUT['22-emitted'])}
<p>Three errors your config never shows (<code>process</code> unknown since <code>types</code> defaults to <code>[]</code>; <code>.ts</code> imports refused; the real TS2345), exit 2 (“errors, output written”), and two <code>.js</code> files in <code>src/</code> because <code>noEmit</code> is gone. Always type <code>npx tsc</code> or <code>npx tsc -p &lt;folder&gt;</code>.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap (b) — <code>import './hello.js'</code>.</strong> Older guides import <code>.js</code> even from <code>.ts</code> files, because they compile to <code>.js</code> first. tsc accepts it:</p>
${ma('typescript', CODE.closing)}
${ra(OUT['30-js-ext-tsc'])}
${ra(NODE_JS)}
<p>Green check, red run: there is no <code>hello.js</code> on disk, Node only finds what really exists. When Node runs your <code>.ts</code> directly, import <strong><code>./hello.ts</code></strong>.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Trap (c) — <code>enum</code>.</strong> A few TypeScript features generate JavaScript code instead of only describing types. Node's stripping cannot run them:</p>
${ma('typescript', CODE.role)}
${ra(OUT['32-enum-tsc'])}
${ra(NODE_ENUM)}
<p><code>erasableSyntaxOnly</code> makes tsc warn you first (TS1294) instead of letting Node crash later. Instead of an enum, the course uses a union of strings — <code>type Role = 'STUDENT' | 'LECTURER'</code> — which disappears completely when types are stripped. Lesson 0.4 explains why.</p>
</div>

<h3>The editor: VS Code</h3>
<p>VS Code has TypeScript built in — red underlines, hover and “Go to Definition” need no extension. But the editor uses <strong>its own bundled TypeScript</strong>: VS Code 1.124.2 ships <strong>6.0.3</strong> (<code>extensions/node_modules/typescript/package.json</code> inside the app), while the project pins <strong>7.0.2</strong>. They agree almost always; when they disagree, the judge is <code>npx tsc</code> — the version in <code>package.json</code> that CI runs. Optional: the <strong>Error Lens</strong> extension prints each error at the end of its line. You may also meet <strong>tsx</strong> (<code>npx tsx file.ts</code>): it strips types like Node and checks nothing either — needed only on Node older than 22.18.</p>

<h3>Is TypeScript 7 really faster? Measured on this website's backend</h3>
<p>The committed code of this website's TypeScript backend (<code>git archive HEAD</code>, commit c572cf189), checked by both compilers, twice each, on one Mac:</p>
${ra(OUT['50-backend-size'])}
${ra(TS6)}
${ra(TS7)}
<p>1,199 of our own <code>.ts</code> files (3,407 with type declarations). TypeScript 6, written in JavaScript, runs out of Node's default memory; with 8 GB it needs about 55 s. TypeScript 7 needs 6–7 s — <strong>about 8–9× faster</strong>, in line with Microsoft's 8–12×. Not free: peak memory was higher (5.05 GB vs 4.05 GB, measured with <code>/usr/bin/time -l</code>) because it checks on many cores. Both found the same real issue (TS2869, a <code>??</code> whose right side never runs); TS 7's extra 8 × TS2883 came from our copy's linked <code>node_modules</code>, not from the code.</p>

<!-- SODO-TS -->
<h3>🗺 One edit, two steps</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Write .ts</div><div class="lz-d">types are annotations: minutes: number</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">npx tsc</div><div class="lz-d">CHECK with tsconfig.json — exit 0 or TSxxxx</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">node file.ts</div><div class="lz-d">strip types, RUN — never checks</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">npm run check</div><div class="lz-d">typecheck &amp;&amp; test — what CI runs</div></div>
</div>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Build the project yourself from an empty folder: Step 1 commands, the course <code>tsconfig.json</code>, <code>src/hello.ts</code>, <code>src/hello.test.ts</code>, the three npm scripts.</li>
<li>Add <code>src/practice.test.ts</code> with two tests: <code>formatTime(0)</code> is <code>'00:00'</code>, and the last slot ends at <code>'21:00'</code> (21 × 60 minutes). Run <code>npm run check</code>.</li>
<li>Break the second test on purpose by passing <code>'21:00'</code> as a string. Run <code>npm run check</code> again and note which step stops.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('typescript', CODE.practice)}
${ra(GREEN)}
<p>Each test file runs in its own process, so “opens at 07:00” is printed once per file. Now the broken version:</p>
${ma('typescript', CODE.practiceRed)}
${ra(RED)}
<p><strong>Done when:</strong> <code>npx tsc -v</code> prints <code>Version 7.0.2</code>; <code>npm run check</code> shows <code>pass 4</code> and exit 0; with the string version it stops at <code>typecheck</code> with TS2345 and the tests never run.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">type stripping (bỏ kiểu)</span><span class="v">Node deletes type annotations and runs the rest. Fast; checks nothing.</span></div>
  <div class="kv"><span class="k">dev dependency (phụ thuộc lúc phát triển)</span><span class="v">A package needed to build/check, not to run: <code>npm i -D</code>.</span></div>
  <div class="kv"><span class="k">exact pin (ghim chính xác)</span><span class="v"><code>"7.0.2"</code> instead of <code>"^7.0.2"</code>, via <code>npm i -E</code>.</span></div>
  <div class="kv"><span class="k">tsconfig.json</span><span class="v">The compiler's settings; read by tsc and the editor, ignored by Node.</span></div>
  <div class="kv"><span class="k">@types/node</span><span class="v">Type descriptions of Node's API, so tsc knows <code>process</code> and <code>node:test</code>.</span></div>
  <div class="kv"><span class="k">exit code (mã thoát)</span><span class="v">0 = success; 1 = errors (no output); 2 = errors but files written.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Node 22.23.3 runs <code>.ts</code> directly (<code>process.features.typescript</code> is <code>'strip'</code>); install it with nvm / nvm-windows / fnm.</li>
<li><code>npm i -D -E typescript@7.0.2 @types/node@22.20.5</code>: a dev dependency, pinned exactly; TS 7 is a native Go binary per platform.</li>
<li>The course <code>tsconfig.json</code>: check only (<code>noEmit</code>), Node-style modules, <code>.ts</code> imports, refuse non-erasable syntax.</li>
<li><code>npx tsc</code> checks, <code>node file.ts</code> runs — a file with type errors still runs; <code>npm run check</code> = typecheck &amp;&amp; test.</li>
<li>Never <code>tsc file.ts</code> (TS5112, or defaults with <code>--ignoreConfig</code>); import <code>./x.ts</code>; no <code>enum</code> (TS1294).</li>
<li>VS Code 1.124.2 underlines with its own TypeScript 6.0.3; the judge is <code>npx tsc</code> 7.0.2 — measured about 8–9× faster than 6.0.3 on this website's backend.</li>
</ul>

<h3>📚 Sources</h3>
${NGUON}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-0-3-cai-dat', title: 'Also in the Node.js course — lesson 0.3: Installing Node', sub: 'Same: installing Node with nvm / nvm-windows / fnm, choosing an LTS version, checking node -v. Different: that lesson stops at your first JavaScript program; this one adds the TypeScript toolchain — tsc 7, @types/node, tsconfig.json and Node’s type stripping.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Cài đặt: Node 22, TypeScript 7, VS Code</h2>
<p class="lead">Hai mươi phút từ một thư mục trống tới một dự án TypeScript kiểm được và chạy được. Bạn sẽ dùng đúng bộ cài này — cùng phiên bản, cùng <code>tsconfig.json</code>, cùng hai lệnh — ở mọi chương của khoá và trong dự án LabFlow TS. Cuối bài bạn sẽ hiểu vì sao có <em>hai</em> lệnh — <code>npx tsc</code> kiểm, <code>node</code> chạy — vì sao một tệp đầy lỗi kiểu vẫn chạy được, và ba cái bẫy thường ngốn của người mới cả buổi tối.</p>

<h3>Bước 0 — Node 22</h3>
<p>Cài Node bằng trình quản lý phiên bản — <strong>nvm</strong> (macOS/Linux), <strong>nvm-windows</strong> hoặc <strong>fnm</strong> (Windows) — rồi mở cửa sổ terminal MỚI.</p>
${ma('bash', NVM)}
${ra(OUT['01-node'])}
<p>Dòng thứ ba: <code>process.features.typescript</code> bằng <code>'strip'</code> — Node này tự chạy tệp <code>.ts</code> bằng <strong>type stripping (bỏ kiểu)</strong>: xoá chú thích kiểu rồi chạy phần JavaScript còn lại. Mặc định từ Node 22.18.0 (31/07/2025), vì vậy khoá ghim 22.23.3.</p>

<h3>Bước 1 — tạo dự án và cài TypeScript</h3>
${ma('bash', TAO)}
${ra(INIT)}
${ra(OUT['03-install'])}
${ma('json', CODE.pkg)}
<ul>
<li><strong><code>-D</code></strong> — <em>dev dependency (phụ thuộc lúc phát triển)</em>: cần để kiểm code, không cần để chạy (<code>npm ci --omit=dev</code> bỏ qua nó).</li>
<li><strong><code>-E</code></strong> — ghi <code>"7.0.2"</code> chứ không phải <code>"^7.0.2"</code>, để không ai âm thầm nhận bản 7.1 kèm lỗi mới. Nâng trình biên dịch có chủ đích.</li>
<li><strong><code>@types/node@22.20.5</code></strong> — <em>mô tả kiểu</em> cho API của Node (<code>process</code>, <code>node:test</code>…), khớp Node 22. Bên trong không có code chạy.</li>
<li><strong><code>npm pkg set type=module</code></strong> — <code>import</code>/<code>export</code> là ES module, giống toàn bộ khoá.</li>
</ul>
<p>Thứ thật sự được cài:</p>
${ra(OUT['05-size'])}
<p>TypeScript 7 được <strong>viết lại bằng Go</strong>: <code>typescript</code> (3,5 MB) chỉ là bộ khởi chạy; trình biên dịch gốc 26 MB nằm trong gói cho nền tảng của bạn (ở đây <code>typescript-darwin-arm64</code>). npm chỉ cài đúng một trong 20 gói, khớp hệ điều hành và CPU.</p>

<h3>Bước 2 — trình biên dịch và tệp cấu hình</h3>
${ra(OUT['06-version'])}
${ra(OUT['07-init'])}
<p><code>tsc --init</code> ghi ra một <code>tsconfig.json</code> với các thiết lập được khuyên dùng. Đọc qua một lần — tuỳ chọn nào cũng có chú thích:</p>
${ma('json', CODE.tsInit)}
<p>Dòng chính: <code>"module": "nodenext"</code>, <code>"types": []</code> (không nạp kiểu toàn cục, kể cả của Node), <code>"strict": true</code>; <code>jsx</code>/<code>declaration</code>/<code>sourceMap</code> dành cho thư viện và React. Khoá dùng một tệp ngắn hơn, khớp cách Node chạy TypeScript:</p>
${ma('json', CODE.tsconfig)}
${OPT_VI}
<p><strong>Node bỏ qua <code>tsconfig.json</code></strong> (tài liệu Node) — chỉ tsc và trình soạn thảo đọc — và tsc không ghi JavaScript (<code>noEmit</code>): nó chỉ nói "đúng" hoặc "sai, ở đây".</p>

<h3>Bước 3 — tệp TypeScript đầu tiên</h3>
${ma('typescript', CODE.hello)}
<p><code>minutes: number</code> và <code>: string</code> sau dấu ngoặc là <strong>type annotation (chú thích kiểu)</strong>: "tham số này là số, hàm này trả về chuỗi". <code>process.env.LAB ?? 'BE-201'</code> đọc một biến môi trường kèm giá trị mặc định — tsc biết <code>process</code> chỉ nhờ <code>types: ["node"]</code>.</p>
${ra(OUT['10-tsc-ok'])}
<p>Không in gì và mã thoát 0: tsc không thấy lỗi nào. Im lặng là thành công. Giờ chạy thử:</p>
${ra(OUT['11-run'])}
${ra(OUT['12-run-env'])}

<h3>Bước 4 — cố ý làm đỏ</h3>
<p>Thêm tệp thứ hai với lỗi mà người mới nào cũng mắc một lần: đưa <code>"21:00"</code> cho một hàm muốn số phút.</p>
${ma('typescript', CODE.oops)}
${ra(OUT['13-tsc-red'])}
<p>Tệp <code>src/oops.ts</code>, dòng 4, cột 47, mã <code>TS2345</code>, lý do; mã thoát 1, nên script hay CI dừng ở đây (bài 0.2 dạy đọc kỹ).</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — Node vẫn chạy tệp hỏng.</strong> Bỏ kiểu là xoá kiểu, không phải <em>kiểm</em> kiểu:</p>
${ra(OUT['14-node-runs-anyway'])}
<p>Mã thoát 0, và LabFlow thông báo đóng cửa lúc <code>NaN:NaN</code>. Không có gì sập, nên không ai để ý cho tới khi người dùng nhìn thấy. <strong>Kiểm (<code>npx tsc</code>) và chạy (<code>node</code>) là hai bước tách rời</strong>; nếu chỉ chạy, TypeScript không bảo vệ bạn khỏi điều gì. Đây là câu quan trọng nhất của phần cài đặt — bài 0.4 dựng cả mô hình tư duy trên nó.</p>
</div>
<p>Cách sửa là đưa cho hàm đúng thứ mà kiểu của nó yêu cầu:</p>
${ma('typescript', CODE.oopsFixed)}
${ra(OUT['15-fixed'])}

<h3>Bước 5 — npm script và test đầu tiên</h3>
<p>Node có sẵn bộ chạy test <code>node:test</code>, nên test đầu tiên không cần cài thêm gói nào:</p>
${ma('typescript', CODE.test)}
<p>Lệnh "hiển nhiên" lại hỏng trên Node 22 — nó coi tên thư mục là một tệp duy nhất:</p>
${ra(TEST_DIR)}
<p>Hãy đưa cho nó một glob (mẫu tên tệp), và cất các lệnh vào npm script để không ai phải nhớ:</p>
${ra(OUT['41-scripts'])}
${ra(CHECK)}
<p><code>npm run check</code> chỉ chạy test khi <code>typecheck</code> qua (<code>&amp;&amp;</code>). Dòng "Lab BE-201 opens at 07:00" xuất hiện vì test đã <em>import</em> <code>hello.ts</code>, mà import là chạy code cấp ngoài cùng.</p>

<h3>Ba cái bẫy bạn sẽ gặp ngay tuần đầu</h3>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy (a) — <code>tsc file.ts</code> và tệp cấu hình.</strong> Rất nhiều hướng dẫn viết <code>tsc hello.ts</code>. Trong thư mục có <code>tsconfig.json</code>, TypeScript 7 từ chối:</p>
${ra(OUT['20-file-arg'])}
<p>Thêm <code>--ignoreConfig</code> thì nó biên dịch — nhưng bằng <em>mặc định</em>, không phải cấu hình của bạn. Xem điều gì thay đổi:</p>
${ra(OUT['21-ignore-config'])}
${ra(OUT['22-emitted'])}
<p>Ba lỗi cấu hình của bạn không hề có (<code>process</code> không ai biết vì <code>types</code> mặc định <code>[]</code>; import <code>.ts</code> bị từ chối; lỗi TS2345 thật), mã thoát 2 ("có lỗi, vẫn ghi tệp"), và hai tệp <code>.js</code> trong <code>src/</code> vì mất <code>noEmit</code>. Luôn gõ <code>npx tsc</code> hoặc <code>npx tsc -p &lt;thư-mục&gt;</code>.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy (b) — <code>import './hello.js'</code>.</strong> Các hướng dẫn cũ import đuôi <code>.js</code> ngay cả trong tệp <code>.ts</code>, vì họ biên dịch ra <code>.js</code> trước. tsc chấp nhận:</p>
${ma('typescript', CODE.closing)}
${ra(OUT['30-js-ext-tsc'])}
${ra(NODE_JS)}
<p>Kiểm xanh, chạy đỏ: trên đĩa không hề có <code>hello.js</code>, Node chỉ tìm được thứ có thật. Khi Node chạy thẳng tệp <code>.ts</code>, hãy import <strong><code>./hello.ts</code></strong>.</p>
</div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy (c) — <code>enum</code>.</strong> Vài tính năng TypeScript sinh ra code JavaScript thay vì chỉ mô tả kiểu. Cơ chế bỏ kiểu của Node không chạy được chúng:</p>
${ma('typescript', CODE.role)}
${ra(OUT['32-enum-tsc'])}
${ra(NODE_ENUM)}
<p><code>erasableSyntaxOnly</code> khiến tsc cảnh báo trước (TS1294) thay vì để Node sập sau. Thay cho enum, khoá dùng union các chuỗi — <code>type Role = 'STUDENT' | 'LECTURER'</code> — thứ biến mất hoàn toàn khi bỏ kiểu. Bài 0.4 giải thích vì sao.</p>
</div>

<h3>Trình soạn thảo: VS Code</h3>
<p>VS Code có sẵn TypeScript — gạch đỏ, hover và "Go to Definition" không cần extension. Nhưng trình soạn thảo dùng <strong>bản TypeScript đóng gói sẵn của chính nó</strong>: VS Code 1.124.2 mang theo <strong>6.0.3</strong> (<code>extensions/node_modules/typescript/package.json</code> trong ứng dụng), còn dự án ghim <strong>7.0.2</strong>. Hai bản gần như luôn đồng ý; khi khác nhau, trọng tài là <code>npx tsc</code> — đúng bản trong <code>package.json</code> mà CI chạy. Tuỳ chọn: extension <strong>Error Lens</strong> in lỗi ngay cuối dòng. Bạn cũng sẽ gặp <strong>tsx</strong> (<code>npx tsx file.ts</code>): nó bỏ kiểu như Node và cũng không kiểm gì — chỉ cần khi Node cũ hơn 22.18.</p>

<h3>TypeScript 7 có nhanh thật không? Đo trên chính backend website này</h3>
<p>Code đã commit của backend TypeScript website này (<code>git archive HEAD</code>, commit c572cf189), kiểm bằng cả hai trình biên dịch, mỗi bản hai lần, trên một máy Mac:</p>
${ra(OUT['50-backend-size'])}
${ra(TS6)}
${ra(TS7)}
<p>1.199 tệp <code>.ts</code> của chính chúng tôi (3.407 tệp tính cả khai báo kiểu). TypeScript 6, viết bằng JavaScript, hết bộ nhớ mặc định của Node; cho 8 GB thì cần khoảng 55 giây. TypeScript 7 cần 6–7 giây — <strong>nhanh hơn khoảng 8–9 lần</strong>, khớp con số 8–12 lần của Microsoft. Không miễn phí: bộ nhớ đỉnh cao hơn (5,05 GB so với 4,05 GB, đo bằng <code>/usr/bin/time -l</code>) vì nó kiểm trên nhiều nhân. Cả hai tìm ra cùng một vấn đề thật (TS2869, một <code>??</code> mà vế phải không bao giờ chạy); 8 lỗi TS2883 thêm của TS 7 là do <code>node_modules</code> được liên kết trong bản chép của chúng tôi, không phải do code.</p>

<h3>🗺 Một lần sửa, hai bước</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Viết .ts</div><div class="lz-d">kiểu là chú thích: minutes: number</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">npx tsc</div><div class="lz-d">KIỂM theo tsconfig.json — thoát 0 hoặc TSxxxx</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">node file.ts</div><div class="lz-d">bỏ kiểu rồi CHẠY — không bao giờ kiểm</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">npm run check</div><div class="lz-d">typecheck &amp;&amp; test — thứ CI chạy</div></div>
</div>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Tự dựng dự án từ thư mục trống: các lệnh của Bước 1, <code>tsconfig.json</code> chuẩn của khoá, <code>src/hello.ts</code>, <code>src/hello.test.ts</code>, ba npm script.</li>
<li>Thêm <code>src/practice.test.ts</code> với hai test: <code>formatTime(0)</code> là <code>'00:00'</code>, và khung cuối kết thúc lúc <code>'21:00'</code> (21 × 60 phút). Chạy <code>npm run check</code>.</li>
<li>Cố ý làm hỏng test thứ hai bằng cách truyền <code>'21:00'</code> dạng chuỗi. Chạy lại <code>npm run check</code> và ghi lại bước nào dừng.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('typescript', CODE.practice)}
${ra(GREEN)}
<p>Mỗi tệp test chạy trong một tiến trình riêng, nên "opens at 07:00" được in một lần cho mỗi tệp. Giờ là bản bị hỏng:</p>
${ma('typescript', CODE.practiceRed)}
${ra(RED)}
<p><strong>Đạt khi:</strong> <code>npx tsc -v</code> in <code>Version 7.0.2</code>; <code>npm run check</code> hiện <code>pass 4</code> và mã thoát 0; với bản truyền chuỗi, nó dừng ở <code>typecheck</code> với TS2345 và test không hề chạy.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">type stripping (bỏ kiểu)</span><span class="v">Node xoá chú thích kiểu rồi chạy phần còn lại. Nhanh; không kiểm gì.</span></div>
  <div class="kv"><span class="k">dev dependency (phụ thuộc lúc phát triển)</span><span class="v">Gói cần để dựng/kiểm, không cần để chạy: <code>npm i -D</code>.</span></div>
  <div class="kv"><span class="k">exact pin (ghim chính xác)</span><span class="v"><code>"7.0.2"</code> thay vì <code>"^7.0.2"</code>, bằng <code>npm i -E</code>.</span></div>
  <div class="kv"><span class="k">tsconfig.json</span><span class="v">Thiết lập của trình biên dịch; tsc và trình soạn thảo đọc, Node bỏ qua.</span></div>
  <div class="kv"><span class="k">@types/node</span><span class="v">Mô tả kiểu của API Node, để tsc biết <code>process</code> và <code>node:test</code>.</span></div>
  <div class="kv"><span class="k">exit code (mã thoát)</span><span class="v">0 = thành công; 1 = có lỗi (không ghi tệp); 2 = có lỗi nhưng đã ghi tệp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Node 22.23.3 tự chạy <code>.ts</code> (<code>process.features.typescript</code> là <code>'strip'</code>); cài bằng nvm / nvm-windows / fnm.</li>
<li><code>npm i -D -E typescript@7.0.2 @types/node@22.20.5</code>: phụ thuộc lúc phát triển, ghim chính xác; TS 7 là binary Go riêng cho từng nền tảng.</li>
<li><code>tsconfig.json</code> của khoá: chỉ kiểm (<code>noEmit</code>), module kiểu Node, import đuôi <code>.ts</code>, từ chối cú pháp không bỏ được.</li>
<li><code>npx tsc</code> kiểm, <code>node file.ts</code> chạy — tệp có lỗi kiểu vẫn chạy; <code>npm run check</code> = typecheck &amp;&amp; test.</li>
<li>Đừng <code>tsc file.ts</code> (TS5112, hoặc dùng mặc định nếu thêm <code>--ignoreConfig</code>); import <code>./x.ts</code>; không <code>enum</code> (TS1294).</li>
<li>VS Code 1.124.2 gạch đỏ bằng TypeScript 6.0.3 của riêng nó; trọng tài là <code>npx tsc</code> 7.0.2 — đo trên backend website này nhanh hơn 6.0.3 khoảng 8–9 lần.</li>
</ul>

<h3>📚 Nguồn</h3>
${NGUON}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-0-3-cai-dat', title: 'Đã có ở khoá Node.js — bài 0.3: Cài Node', sub: 'Giống: cài Node bằng nvm / nvm-windows / fnm, chọn bản LTS, kiểm node -v. Khác: bài đó dừng ở chương trình JavaScript đầu tiên; bài này thêm bộ công cụ TypeScript — tsc 7, @types/node, tsconfig.json và cơ chế bỏ kiểu của Node.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
