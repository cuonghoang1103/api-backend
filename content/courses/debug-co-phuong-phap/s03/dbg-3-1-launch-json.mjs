/**
 * 3.1 — Launch hay attach, launch.json, auto attach, JavaScript Debug Terminal (soạn 24/11/2026).
 * Output chạy THẬT trên Linux (Fedora) · Node v22.22.2 · VS Code 1.129.0 (js-debug 1.117.0) · Express 5.3.0 · Prisma 6.19.3 ·
 * TypeScript 7.0.2 · tsx 4.23.15 · nodemon 3.1.14. Ứng dụng mẫu /tmp/dbg-lab/app (LabFlow API), lưu ở scratchpad/dbg/lab/app.
 * Cổng inspector của lab là 49229 (mặc định của Node là 9229) để không đụng tiến trình khác trên máy soạn.
 */
import { nguon, lienKet } from '../_chung.mjs';

const CAY = `<div class="out">~/dbg-lab/app/            the LabFlow API used from Chapter 3 on
├── package.json         scripts: dev (tsx watch) · build (tsc) · start · seed
├── tsconfig.json        "sourceMap": true  → dist/*.js.map
├── prisma/schema.prisma Phong (room) · NguoiDung (user) · DatLich (booking)
├── src/app.ts           Express app, port 43000
├── src/routes/phong.ts  GET /api/phong/:id/lich?ngay=YYYY-MM-DD
├── src/routes/nguoiDung.ts  GET /api/nguoi-dung/:id/tong-gio
├── src/services/        lichPhong.ts · gioSuDung.ts (two real bugs live here)
└── .vscode/launch.json  this lesson</div>`;

const OUT_TRIEU_CHUNG = `<div class="out">$ npm run build &amp;&amp; node dist/app.js &amp;
LabFlow API: http://127.0.0.1:43000
$ curl -s 'http://127.0.0.1:43000/api/phong/1/lich?ngay=2026-11-25'
{"phongId":1,"ngay":"2026-11-25","soLuot":0,"ds":[]}
$ curl -s http://127.0.0.1:43000/api/nguoi-dung/42/tong-gio
…&lt;pre&gt;TypeError: Cannot read properties of null (reading 'getTime')
    at tongGio (/tmp/dbg-lab/app/dist/services/gioSuDung.js:10:32)
    at async /tmp/dbg-lab/app/dist/routes/nguoiDung.js:9:34&lt;/pre&gt;…</div>`;

const OUT_INSPECT = `<div class="out">$ node --inspect=127.0.0.1:49229 dist/app.js
Debugger listening on ws://127.0.0.1:49229/cefd7811-fa28-4532-a8a3-a2c67bd5645a
For help, see: https://nodejs.org/en/docs/inspector
LabFlow API: http://127.0.0.1:43000

$ curl -s http://127.0.0.1:49229/json/list
[ {
  "description": "node.js instance",
  "id": "cefd7811-fa28-4532-a8a3-a2c67bd5645a",
  "title": "dist/app.js",
  "type": "node",
  "url": "file:///tmp/dbg-lab/app/dist/app.js",
  "webSocketDebuggerUrl": "ws://127.0.0.1:49229/cefd7811-fa28-4532-a8a3-a2c67bd5645a"
} ]
$ curl -s http://127.0.0.1:49229/json/version
{ "Browser": "node.js/v22.22.2", "Protocol-Version": "1.1" }</div>`;

const OUT_BRK = `<div class="out">$ node --inspect-brk=127.0.0.1:49229 dist/app.js
Debugger listening on ws://127.0.0.1:49229/b13d8194-24ed-4907-b77c-6a8267e60ae3
For help, see: https://nodejs.org/en/docs/inspector
                       ← nothing else: line 1 has not run, "LabFlow API" never prints until a debugger attaches
$ node --help | grep -A2 -- --inspect-wait
  --inspect-wait[=[host:]port]
                              activate inspector on host:port and
                              wait for debugger to be attached</div>`;

const LAUNCH = `<pre><code class="language-json">// .vscode/launch.json — VS Code reads comments in this file (JSON with comments)
{
  "version": "0.2.0",
  "configurations": [
    {
      // 1. LAUNCH the compiled app; build first, map dist/*.js back to src/*.ts
      "name": "API: build + chạy dist",
      "type": "node",
      "request": "launch",
      "program": "\${workspaceFolder}/dist/app.js",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["\${workspaceFolder}/dist/**/*.js"],
      "skipFiles": ["&lt;node_internals&gt;/**"]
    },
    {
      // 2. LAUNCH through an npm script (the same command the team uses every day)
      "name": "API: npm run dev",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run-script", "dev"],
      "console": "integratedTerminal",
      "skipFiles": ["&lt;node_internals&gt;/**"]
    },
    {
      // 3. LAUNCH TypeScript directly, no build step (tsx transpiles in memory, with source maps)
      "name": "API: tsx src/app.ts",
      "type": "node",
      "request": "launch",
      "runtimeArgs": ["--import", "tsx"],
      "program": "\${workspaceFolder}/src/app.ts",
      "skipFiles": ["&lt;node_internals&gt;/**", "\${workspaceFolder}/node_modules/**"]
    },
    {
      // 4. ATTACH to a process you started yourself with --inspect (nodemon, docker, a test runner…)
      "name": "Attach :49229",
      "type": "node",
      "request": "attach",
      "address": "127.0.0.1",
      "port": 49229,
      "restart": true          // nodemon restarts the process → re-attach automatically
    }
  ]
}</code></pre>`;

const OUT_NODEMON = `<div class="out">$ npx nodemon --inspect=127.0.0.1:49229 dist/app.js
[nodemon] 3.1.14
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting \`node --inspect=127.0.0.1:49229 dist/app.js\`
Debugger listening on ws://127.0.0.1:49229/acc46cbc-cec8-44d2-9540-4240f4ebd881
LabFlow API: http://127.0.0.1:43000
[nodemon] restarting due to changes...
[nodemon] starting \`node --inspect=127.0.0.1:49229 dist/app.js\`
Debugger listening on ws://127.0.0.1:49229/5d57c38a-6d35-4eff-9030-c155aec0dbc4
LabFlow API: http://127.0.0.1:43000</div>`;

const OUT_NODE_OPTIONS = `<div class="out">$ NODE_OPTIONS="--inspect=127.0.0.1:49229" npm run dev
Debugger listening on ws://127.0.0.1:49229/c02881be-1c36-4916-8883-df783f0d98fe   ← this is npm itself!

&gt; app@1.0.0 dev
&gt; tsx watch src/app.ts

Starting inspector on 127.0.0.1:49229 failed: address already in use     ← tsx watch
Starting inspector on 127.0.0.1:49229 failed: address already in use     ← your app
LabFlow API: http://127.0.0.1:43000</div>`;

const OUT_MAP = `<div class="out">$ cat dist/services/gioSuDung.js.map
{"version":3,"file":"gioSuDung.js","sourceRoot":"","sources":["../../src/services/gioSuDung.ts"],"names":[],"mappings":";;;AAAA,8BAA+B;…"}
$ node tra-map.js dist/services/gioSuDung.js.map 10 32
dist dòng 10:32  -&gt;  src/services/gioSuDung.ts dòng 8:29
$ node --enable-source-maps dist/app.js &amp;  curl -s …/api/nguoi-dung/42/tong-gio
TypeError: Cannot read properties of null (reading 'getTime')
    at tongGio (/tmp/dbg-lab/app/src/services/gioSuDung.ts:8:29)
    at async &lt;anonymous&gt; (/tmp/dbg-lab/app/src/routes/nguoiDung.ts:8:32)</div>`;

const TRA_MAP = `<pre><code class="language-js">// tra-map.js — ask a source map the same question VS Code asks for every breakpoint and every stack frame
const { SourceMap } = require('node:module');
const map = new SourceMap(JSON.parse(require('node:fs').readFileSync(process.argv[2], 'utf8')));
const [dong, cot] = process.argv.slice(3).map(Number);
const e = map.findEntry(dong - 1, cot - 1);   // 0-based inside the API
console.log(\`dist dòng \${dong}:\${cot}  -&gt;  \${e.originalSource.replace(/^.*\\/src\\//, 'src/')} dòng \${e.originalLine + 1}:\${e.originalColumn + 1}\`);</code></pre>`;

const OUT_CDP = `<div class="out">$ node --inspect=127.0.0.1:49229 dist/app.js &amp;
$ node cdp.mjs 49229 b.jsonl ~/dbg-lab/app        # a 100-line client that sends what VS Code sends
● breakpoint src/services/gioSuDung.ts:8  → dist/services/gioSuDung.js:10 (1 vị trí)
$ curl -s http://127.0.0.1:43000/api/nguoi-dung/42/tong-gio
⏸  dừng (other) tại src/services/gioSuDung.ts:8  — hàm tongGio
  › ds.map(x =&gt; x.ketThuc &amp;&amp; x.ketThuc.toISOString())
    ["2026-11-24T04:00:00.000Z",null]</div>`;

const NGUON = [
  nguon('🟦', 'VS Code — Node.js debugging', 'launch/attach, cấu hình npm script, nodemon, source map, auto attach, JavaScript Debug Terminal.', 'https://code.visualstudio.com/docs/nodejs/nodejs-debugging'),
  nguon('🟦', 'VS Code — Debugging (chung)', 'Thanh công cụ debug, launch.json, biến \${workspaceFolder}, preLaunchTask.', 'https://code.visualstudio.com/docs/debugtest/debugging'),
  nguon('🟢', 'Node.js — Debugging guide', '--inspect, --inspect-brk, /json/list và cảnh báo bảo mật cổng inspector.', 'https://nodejs.org/en/learn/getting-started/debugging'),
  nguon('📜', 'Chrome DevTools Protocol — Debugger domain', 'Các lệnh setBreakpointByUrl, stepInto, evaluateOnCallFrame mà mọi debugger JS dùng.', 'https://chromedevtools.github.io/devtools-protocol/v8/Debugger/'),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-2-3-javascript', title: 'Bài 2.3 — source map trong stack trace', sub: 'Bật --enable-source-maps để trace trỏ về .ts; bài này dùng cùng source map đó cho breakpoint.', cta: 'Ôn lại →' }),
].join('\n');

export default {
  title: '3.1 — Launch vs attach, launch.json, auto attach and the JavaScript Debug Terminal|||3.1 — Launch hay attach, launch.json, auto attach và JavaScript Debug Terminal',
  slug: 'dbg-3-1-launch-json',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Debugger là một chương trình điều khiển chương trình khác qua cổng inspector (WebSocket, giao thức CDP). Hai cách gắn: launch (VS Code tự chạy node) và attach (gắn vào tiến trình đã chạy với --inspect). launch.json cho dist + source map, npm script, tsx, nodemon (restart: true); vì sao NODE_OPTIONS=--inspect với npm run dev báo "address already in use"; auto attach và JavaScript Debug Terminal làm gì bên trong. Dựng ứng dụng mẫu LabFlow (Express 5 + Prisma + PostgreSQL) có hai lỗi thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Stop printing, start pausing: how a debugger gets hold of your Node process</h2>
<p class="lead">In Chapters 1–2 you found bugs by running, printing and reading traces. That works, but every question costs one edit, one restart and one more <code>console.log</code>. A debugger lets you freeze the program on any line and ask it <em>anything</em> — every variable, every caller — without changing the code. This lesson explains what actually happens when you press F5, sets up the sample app the rest of the course uses, and gives you a <code>launch.json</code> for every way a Node project is started at work.</p>

<h3>An everyday picture: the remote-control car</h3>
<p>Your program is a toy car; the debugger is the remote. To steer it, the car needs a receiver and the remote needs to be paired with it. <code>node --inspect</code> switches the receiver on (a WebSocket port, 9229 by default). VS Code, Chrome DevTools or the terminal tool <code>node inspect</code> are three different remotes for the same receiver. <strong>Launch</strong> = you hand VS Code the car switched off and it turns it on already paired. <strong>Attach</strong> = the car is already driving around (started by nodemon, Docker, a test runner) and you pair the remote to it.</p>

<h3>The sample app from now on: LabFlow API</h3>
<p>From this chapter, the course uses one small but real project: an Express 5 + TypeScript API on PostgreSQL 16 (via Prisma 6) for booking lab rooms. It has two bugs on purpose; this chapter catches both with the debugger.</p>
${CAY}
<p>Set it up (the PostgreSQL container listens only on 127.0.0.1): <code>docker run -d --name dbg-pg -e POSTGRES_PASSWORD=dbg -e POSTGRES_DB=labflow -p 127.0.0.1:45432:5432 postgres:16</code>, put <code>DATABASE_URL="postgresql://postgres:dbg@127.0.0.1:45432/labflow"</code> into <code>.env</code>, then <code>npm install</code>, <code>npx prisma db push</code>, <code>npm run seed</code> (it prints <code>seed xong: 5 lượt đặt</code>). The two symptoms, reproduced:</p>
${OUT_TRIEU_CHUNG}
<p>Room 1 has two bookings on 25/11 in the seed data, yet the API says zero. User 42 gets a 500, and the trace points at <code>dist/…js</code> — compiled code you never wrote. Both are typical first-week OJT tickets. Keep them; lessons 3.2 and 3.3 solve them.</p>

<h3>What --inspect really opens</h3>
${OUT_INSPECT}
<p>Three facts hide in that output. (1) The inspector is an HTTP + WebSocket server <em>inside</em> your process. (2) <code>/json/list</code> is how any debugger discovers what it can attach to — VS Code's "attach to port" does exactly this request. (3) The protocol is the <strong>Chrome DevTools Protocol</strong> (CDP), the same one Chrome uses; that is why Chrome DevTools can debug Node too (<code>chrome://inspect</code>). Every button you press in VS Code becomes a CDP message: a breakpoint is <code>Debugger.setBreakpointByUrl</code>, F10 is <code>Debugger.stepOver</code>, hovering a variable is <code>Debugger.evaluateOnCallFrame</code>.</p>
<p><code>--inspect</code> lets the program run immediately. When the bug is in start-up code (reading config, connecting to the database), it is over before you can attach. Two flags make Node wait:</p>
${OUT_BRK}
<p><code>--inspect-brk</code> waits and then pauses on the first line; <code>--inspect-wait</code> (Node 22.2+) waits but does not pause, so your breakpoints decide where to stop.</p>

<h3>Launch vs attach — when to use which</h3>
<table>
<thead><tr><th></th><th>Launch</th><th>Attach</th></tr></thead>
<tbody>
<tr><td>Who starts Node</td><td>VS Code</td><td>You, a script, nodemon, Docker, a test runner</td></tr>
<tr><td>Typical case</td><td>Local API, a script, a failing test</td><td>App in a container, already-running process, a remote test machine (through SSH tunnel)</td></tr>
<tr><td>Start-up code</td><td>Caught automatically</td><td>Only with <code>--inspect-brk</code> / <code>--inspect-wait</code></td></tr>
<tr><td>When it ends</td><td>Stop = process killed</td><td>Disconnect = process keeps running</td></tr>
</tbody>
</table>

<h3>launch.json for the four ways a project is started</h3>
<p>Open <em>Run and Debug</em> (Ctrl+Shift+D) → "create a launch.json file" → Node.js, then replace it with this. Pick a configuration in the drop-down, press F5.</p>
${LAUNCH}
<ul>
<li><strong>outFiles + source maps.</strong> With <code>"sourceMap": true</code> in <code>tsconfig.json</code>, <code>tsc</code> writes a <code>.js.map</code> next to every <code>.js</code>. VS Code reads them to put your breakpoint from <code>.ts</code> onto the right <code>.js</code> line, and to show <code>.ts</code> lines in the call stack. Without a map, breakpoints in <code>.ts</code> stay grey ("unbound").</li>
<li><strong>runtimeExecutable: npm</strong> runs the exact script the team runs. VS Code still reaches your app, which is two processes below npm (npm → tsx watch → node app) — see the trap below for why that is not trivial.</li>
<li><strong>"--import", "tsx"</strong> loads the tsx loader into Node so <code>.ts</code> runs directly; tsx produces in-memory source maps, so no build is needed.</li>
<li><strong>restart: true</strong> makes an attach configuration reconnect every time nodemon restarts the process (each restart opens a <em>new</em> WebSocket id):</li>
</ul>
${OUT_NODEMON}

<h3>Trap: NODE_OPTIONS=--inspect on an npm script</h3>
<p>A common shortcut: "just put --inspect in NODE_OPTIONS". Here is what really happens:</p>
${OUT_NODE_OPTIONS}
<p><code>NODE_OPTIONS</code> applies to <em>every</em> Node process. npm is a Node program, so npm grabs port 49229 first; tsx watch and your app both fail to open it. You attach, nothing ever pauses, and you conclude "breakpoints don't work". Fixes: pass the flag only to the last process (<code>tsx --inspect src/app.ts</code>), or use port 0 (random), or — the reason it exists — the JavaScript Debug Terminal.</p>

<h3>Auto Attach and the JavaScript Debug Terminal</h3>
<p>Both solve "I start things from the terminal and want them debugged". Under the hood (VS Code 1.129, js-debug 1.117), the debugger adds a <code>--require …/bootloader.js</code> to <code>NODE_OPTIONS</code> plus a <code>VSCODE_INSPECTOR_OPTIONS</code> variable. Each Node process that starts loads the bootloader, which decides whether to attach and opens its own inspector on a free port — so npm, tsx and your app no longer fight over one port, and child processes are followed.</p>
<ul>
<li><strong>JavaScript Debug Terminal</strong>: Command Palette → "JavaScript Debug Terminal". Anything you run inside it (<code>npm run dev</code>, <code>npx jest</code>, <code>node script.js</code>) is debugged. The simplest option for an intern: no launch.json at all.</li>
<li><strong>Auto Attach</strong> (setting <code>debug.javascript.autoAttachFilter</code>): <code>disabled</code> (the default in this version), <code>smart</code> (attach only to scripts in your workspace, not to tools inside <code>node_modules</code>), <code>onlyWithFlag</code> (only processes started with <code>--inspect</code>), <code>always</code>.</li>
</ul>

<h3>Debugging TypeScript: the source map is the bridge</h3>
<p>V8 only runs JavaScript. A breakpoint on <code>gioSuDung.ts:8</code> must become a breakpoint on <code>gioSuDung.js:10</code>; a pause at <code>.js:10</code> must be shown as <code>.ts:8</code>. The <code>.map</code> file is a lookup table for exactly that, and you can query it yourself:</p>
${TRA_MAP}
${OUT_MAP}
<p>Same table, three users: <code>--enable-source-maps</code> uses it for stack traces (lesson 2.3), VS Code uses it for breakpoints, and the small CDP client used in this chapter's outputs uses it to place a breakpoint by <code>.ts</code> line — the same requests VS Code sends:</p>
${OUT_CDP}
<p>The breakpoint landed on the <code>.ts</code> line, the debugger paused <em>before</em> the crash, and one expression shows the second booking of user 42 has <code>ketThuc</code> (end time) <code>null</code> — the person is still checked in. Lesson 3.2 finishes this bug.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "my breakpoint is grey / never hits".</strong> Check in this order: (1) is the process really started with a debugger (look for "Debugger attached" in the terminal)? (2) for TypeScript: does <code>dist</code> have <code>.map</code> files and does <code>outFiles</code> match them? (3) is <code>dist</code> stale — you edited <code>.ts</code> but did not rebuild? (4) did you set the breakpoint on a line that never runs (a comment, a type-only line)?</p></div>

<h3>On the job</h3>
<p>Day 3 of OJT, the mentor says "run the API in debug and check why the schedule is empty". The project has <code>npm run dev</code> with nodemon, and a <code>.env</code> you were given. Fastest route: open a JavaScript Debug Terminal, run <code>npm run dev</code>, set the breakpoint, call the API with the curl from the ticket. Commit a <code>.vscode/launch.json</code> only if the team agrees — many teams keep <code>.vscode/</code> out of git; ask before you push it.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<ol>
<li>Set up LabFlow as above, run <code>npm run build</code> and reproduce the two symptoms with curl.</li>
<li>Run <code>node --inspect=127.0.0.1:9229 dist/app.js</code>, open <code>http://127.0.0.1:9229/json/list</code> in the browser and find <code>webSocketDebuggerUrl</code>. Then open <code>chrome://inspect</code> and attach Chrome DevTools to the same process.</li>
<li>Create the four configurations. With "API: build + chạy dist", set a breakpoint in <code>src/services/lichPhong.ts</code> on the <code>return prisma…</code> line, call the schedule URL, and hover <code>tuLuc</code> and <code>denLuc</code>. Write what you see in your log.</li>
<li>Delete <code>dist/*.map</code> (or set <code>"sourceMap": false</code>) and rebuild: what happens to the breakpoint? Restore it.</li>
<li>Reproduce the <code>NODE_OPTIONS</code> trap, then run the same <code>npm run dev</code> in a JavaScript Debug Terminal and confirm the breakpoint now hits.</li>
</ol>
<p><strong>Done when:</strong> you paused inside <code>lichTrongNgay</code> from the <code>.ts</code> file, you can explain in one sentence why the NODE_OPTIONS version did not pause, and you know which configuration you would use for nodemon.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">inspector</span><span class="v">Debug server inside the Node process, opened by --inspect (port 9229 by default).</span></div>
  <div class="kv"><span class="k">CDP</span><span class="v">Chrome DevTools Protocol — the JSON-over-WebSocket messages every JS debugger speaks.</span></div>
  <div class="kv"><span class="k">launch / attach</span><span class="v">Debugger starts the process / debugger connects to a process already running.</span></div>
  <div class="kv"><span class="k">--inspect-brk / --inspect-wait</span><span class="v">Wait for a debugger before running (pause on line 1 / no pause).</span></div>
  <div class="kv"><span class="k">source map</span><span class="v">.map file linking compiled .js positions to original .ts positions.</span></div>
  <div class="kv"><span class="k">outFiles</span><span class="v">Where VS Code looks for compiled files and their maps.</span></div>
  <div class="kv"><span class="k">JavaScript Debug Terminal</span><span class="v">A terminal where every Node process you start is debugged automatically.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A debugger is a remote control: --inspect opens the receiver, VS Code / DevTools / node inspect are remotes speaking CDP.</li>
<li>Launch when VS Code can start the program; attach when something else already started it.</li>
<li>Start-up bugs need --inspect-brk or --inspect-wait.</li>
<li>TypeScript breakpoints work only through source maps (sourceMap: true + outFiles, or tsx).</li>
<li>NODE_OPTIONS=--inspect on npm scripts makes npm take the port; use the JavaScript Debug Terminal instead.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Thôi in ra, bắt đầu cho dừng lại: debugger "nắm" tiến trình Node của bạn thế nào</h2>
<p class="lead">Ở Chương 1–2 bạn bắt lỗi bằng cách chạy, in ra và đọc trace. Cách đó được, nhưng mỗi câu hỏi tốn một lần sửa code, một lần khởi động lại và thêm một dòng <code>console.log</code>. Debugger cho bạn đóng băng chương trình ở bất kỳ dòng nào và hỏi nó <em>bất cứ điều gì</em> — mọi biến, mọi nơi đã gọi tới — mà không sửa một dòng code. Bài này giải thích chuyện gì thật sự xảy ra khi bạn bấm F5, dựng ứng dụng mẫu mà phần còn lại của khoá dùng, và đưa bạn một <code>launch.json</code> cho mọi kiểu khởi động một dự án Node ở công ty.</p>

<h3>Liên tưởng đời thường: xe điều khiển từ xa</h3>
<p>Chương trình của bạn là chiếc xe đồ chơi; debugger là cái điều khiển. Muốn lái, xe phải có bộ thu và điều khiển phải được ghép đôi với nó. <code>node --inspect</code> bật bộ thu (một cổng WebSocket, mặc định 9229). VS Code, Chrome DevTools hay công cụ dòng lệnh <code>node inspect</code> là ba cái điều khiển khác nhau cho cùng một bộ thu. <strong>Launch</strong> = bạn đưa VS Code chiếc xe đang tắt, nó bật lên và ghép đôi sẵn. <strong>Attach</strong> = xe đang chạy rồi (do nodemon, Docker, bộ chạy test khởi động) và bạn ghép điều khiển vào nó.</p>

<h3>Ứng dụng mẫu từ nay: LabFlow API</h3>
<p>Từ chương này, khoá dùng một dự án nhỏ nhưng thật: API Express 5 + TypeScript trên PostgreSQL 16 (qua Prisma 6) để đặt phòng lab. Nó có sẵn hai lỗi; chương này bắt cả hai bằng debugger.</p>
${CAY}
<p>Dựng nó (container PostgreSQL chỉ nghe trên 127.0.0.1): <code>docker run -d --name dbg-pg -e POSTGRES_PASSWORD=dbg -e POSTGRES_DB=labflow -p 127.0.0.1:45432:5432 postgres:16</code>, ghi <code>DATABASE_URL="postgresql://postgres:dbg@127.0.0.1:45432/labflow"</code> vào <code>.env</code>, rồi <code>npm install</code>, <code>npx prisma db push</code>, <code>npm run seed</code> (in ra <code>seed xong: 5 lượt đặt</code>). Hai triệu chứng, tái hiện được:</p>
${OUT_TRIEU_CHUNG}
<p>Dữ liệu mẫu có hai lượt đặt phòng 1 ngày 25/11, vậy mà API nói không có lượt nào. Người dùng 42 nhận lỗi 500, và trace trỏ vào <code>dist/…js</code> — code đã biên dịch mà bạn không hề viết. Cả hai là ticket điển hình của tuần đầu OJT. Giữ lại; bài 3.2 và 3.3 giải chúng.</p>

<h3>--inspect thật sự mở ra cái gì</h3>
${OUT_INSPECT}
<p>Ba điều nằm trong output đó. (1) Inspector là một server HTTP + WebSocket chạy <em>bên trong</em> tiến trình của bạn. (2) <code>/json/list</code> là cách mọi debugger tìm xem có gì để gắn vào — "attach vào cổng" của VS Code gửi đúng request này. (3) Giao thức là <strong>Chrome DevTools Protocol</strong> (CDP), cũng là giao thức Chrome dùng; vì vậy Chrome DevTools debug được cả Node (<code>chrome://inspect</code>). Mỗi nút bạn bấm trong VS Code thành một thông điệp CDP: breakpoint là <code>Debugger.setBreakpointByUrl</code>, F10 là <code>Debugger.stepOver</code>, rê chuột lên biến là <code>Debugger.evaluateOnCallFrame</code>.</p>
<p><code>--inspect</code> cho chương trình chạy ngay. Khi lỗi nằm ở code khởi động (đọc cấu hình, nối cơ sở dữ liệu), nó xong trước khi bạn kịp gắn vào. Hai cờ bắt Node chờ:</p>
${OUT_BRK}
<p><code>--inspect-brk</code> chờ rồi dừng ở dòng đầu; <code>--inspect-wait</code> (Node 22.2 trở lên) chờ nhưng không dừng, để breakpoint của bạn quyết định chỗ dừng.</p>

<h3>Launch hay attach — khi nào dùng cái nào</h3>
<table>
<thead><tr><th></th><th>Launch</th><th>Attach</th></tr></thead>
<tbody>
<tr><td>Ai khởi động Node</td><td>VS Code</td><td>Bạn, một script, nodemon, Docker, bộ chạy test</td></tr>
<tr><td>Trường hợp hay gặp</td><td>API ở máy mình, một script, một test đang đỏ</td><td>Ứng dụng trong container, tiến trình đang chạy, máy test từ xa (qua đường hầm SSH)</td></tr>
<tr><td>Code khởi động</td><td>Bắt được tự nhiên</td><td>Chỉ khi có <code>--inspect-brk</code> / <code>--inspect-wait</code></td></tr>
<tr><td>Khi kết thúc</td><td>Stop = tiến trình bị tắt</td><td>Disconnect = tiến trình vẫn chạy tiếp</td></tr>
</tbody>
</table>

<h3>launch.json cho bốn kiểu khởi động dự án</h3>
<p>Mở <em>Run and Debug</em> (Ctrl+Shift+D) → "create a launch.json file" → Node.js, rồi thay bằng nội dung này. Chọn cấu hình trong danh sách thả xuống, bấm F5.</p>
${LAUNCH}
<ul>
<li><strong>outFiles + source map.</strong> Có <code>"sourceMap": true</code> trong <code>tsconfig.json</code>, <code>tsc</code> ghi một tệp <code>.js.map</code> cạnh mỗi <code>.js</code>. VS Code đọc chúng để đặt breakpoint từ <code>.ts</code> vào đúng dòng <code>.js</code>, và để call stack hiện dòng <code>.ts</code>. Không có map, breakpoint trong <code>.ts</code> xám mãi ("unbound").</li>
<li><strong>runtimeExecutable: npm</strong> chạy đúng script cả nhóm vẫn chạy. VS Code vẫn với tới được ứng dụng của bạn nằm dưới npm hai tầng tiến trình (npm → tsx watch → node app) — xem bẫy bên dưới để thấy vì sao việc đó không đơn giản.</li>
<li><strong>"--import", "tsx"</strong> nạp bộ tải tsx vào Node để chạy thẳng <code>.ts</code>; tsx sinh source map trong bộ nhớ nên không cần build.</li>
<li><strong>restart: true</strong> giúp cấu hình attach tự nối lại mỗi lần nodemon khởi động lại tiến trình (mỗi lần như vậy mở một mã WebSocket <em>mới</em>):</li>
</ul>
${OUT_NODEMON}

<h3>Bẫy: NODE_OPTIONS=--inspect cho một npm script</h3>
<p>Một lối tắt hay gặp: "cứ nhét --inspect vào NODE_OPTIONS". Đây là chuyện thật sự xảy ra:</p>
${OUT_NODE_OPTIONS}
<p><code>NODE_OPTIONS</code> áp cho <em>mọi</em> tiến trình Node. npm cũng là một chương trình Node, nên npm chiếm cổng 49229 trước; tsx watch và ứng dụng của bạn đều không mở được. Bạn gắn vào, chẳng bao giờ dừng, và kết luận "breakpoint hỏng". Cách sửa: chỉ truyền cờ cho tiến trình cuối (<code>tsx --inspect src/app.ts</code>), hoặc dùng cổng 0 (ngẫu nhiên), hoặc — lý do nó tồn tại — JavaScript Debug Terminal.</p>

<h3>Auto Attach và JavaScript Debug Terminal</h3>
<p>Cả hai giải bài toán "tôi chạy mọi thứ từ terminal và muốn chúng được debug". Bên trong (VS Code 1.129, js-debug 1.117), debugger thêm <code>--require …/bootloader.js</code> vào <code>NODE_OPTIONS</code> cùng biến <code>VSCODE_INSPECTOR_OPTIONS</code>. Mỗi tiến trình Node khởi động sẽ nạp bootloader, nó tự quyết có gắn không và mở inspector riêng trên một cổng trống — nên npm, tsx và ứng dụng không còn tranh một cổng, và tiến trình con cũng được theo dõi.</p>
<ul>
<li><strong>JavaScript Debug Terminal</strong>: Command Palette → "JavaScript Debug Terminal". Mọi thứ bạn chạy trong đó (<code>npm run dev</code>, <code>npx jest</code>, <code>node script.js</code>) đều được debug. Cách đơn giản nhất cho thực tập sinh: không cần launch.json.</li>
<li><strong>Auto Attach</strong> (cài đặt <code>debug.javascript.autoAttachFilter</code>): <code>disabled</code> (mặc định ở phiên bản này), <code>smart</code> (chỉ gắn vào script trong workspace của bạn, không gắn vào công cụ trong <code>node_modules</code>), <code>onlyWithFlag</code> (chỉ tiến trình chạy với <code>--inspect</code>), <code>always</code>.</li>
</ul>

<h3>Debug TypeScript: source map là cây cầu</h3>
<p>V8 chỉ chạy JavaScript. Breakpoint ở <code>gioSuDung.ts:8</code> phải biến thành breakpoint ở <code>gioSuDung.js:10</code>; chỗ dừng ở <code>.js:10</code> phải hiện thành <code>.ts:8</code>. Tệp <code>.map</code> là bảng tra cho đúng việc đó, và bạn tự tra được:</p>
${TRA_MAP}
${OUT_MAP}
<p>Cùng một bảng, ba nơi dùng: <code>--enable-source-maps</code> dùng cho stack trace (bài 2.3), VS Code dùng cho breakpoint, và client CDP nhỏ dùng để chạy output trong chương này dùng nó để đặt breakpoint theo dòng <code>.ts</code> — đúng những request VS Code gửi:</p>
${OUT_CDP}
<p>Breakpoint rơi đúng dòng <code>.ts</code>, debugger dừng <em>trước</em> khi sập, và một biểu thức cho thấy lượt đặt thứ hai của người 42 có <code>ketThuc</code> (giờ kết thúc) là <code>null</code> — người đó còn đang trong phòng. Bài 3.2 làm nốt lỗi này.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "breakpoint của em xám / không bao giờ dừng".</strong> Kiểm theo thứ tự: (1) tiến trình có thật sự chạy cùng debugger không (tìm "Debugger attached" trong terminal)? (2) với TypeScript: <code>dist</code> có tệp <code>.map</code> không, <code>outFiles</code> có khớp không? (3) <code>dist</code> có cũ không — sửa <code>.ts</code> mà chưa build lại? (4) bạn có đặt breakpoint vào dòng không bao giờ chạy (chú thích, dòng chỉ có kiểu)?</p></div>

<h3>Tình huống đi làm</h3>
<p>Ngày thứ 3 OJT, mentor bảo "chạy API ở chế độ debug xem vì sao lịch trống". Dự án có <code>npm run dev</code> dùng nodemon, và một <code>.env</code> được cấp. Đường nhanh nhất: mở JavaScript Debug Terminal, chạy <code>npm run dev</code>, đặt breakpoint, gọi API bằng lệnh curl trong ticket. Chỉ commit <code>.vscode/launch.json</code> khi nhóm đồng ý — nhiều nhóm để <code>.vscode/</code> ngoài git; hỏi trước khi push.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<ol>
<li>Dựng LabFlow như trên, chạy <code>npm run build</code> và tái hiện hai triệu chứng bằng curl.</li>
<li>Chạy <code>node --inspect=127.0.0.1:9229 dist/app.js</code>, mở <code>http://127.0.0.1:9229/json/list</code> trong trình duyệt, tìm <code>webSocketDebuggerUrl</code>. Rồi mở <code>chrome://inspect</code> và gắn Chrome DevTools vào cùng tiến trình đó.</li>
<li>Tạo bốn cấu hình. Với "API: build + chạy dist", đặt breakpoint trong <code>src/services/lichPhong.ts</code> ở dòng <code>return prisma…</code>, gọi URL lịch, rê chuột lên <code>tuLuc</code> và <code>denLuc</code>. Ghi điều bạn thấy vào nhật ký.</li>
<li>Xoá <code>dist/*.map</code> (hoặc đặt <code>"sourceMap": false</code>) rồi build lại: breakpoint ra sao? Trả lại như cũ.</li>
<li>Tái hiện bẫy <code>NODE_OPTIONS</code>, rồi chạy cùng <code>npm run dev</code> trong JavaScript Debug Terminal và xác nhận breakpoint giờ đã dừng.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã dừng được bên trong <code>lichTrongNgay</code> từ tệp <code>.ts</code>, giải thích được trong một câu vì sao bản NODE_OPTIONS không dừng, và biết sẽ dùng cấu hình nào cho nodemon.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">inspector</span><span class="v">Server debug bên trong tiến trình Node, mở bằng --inspect (mặc định cổng 9229).</span></div>
  <div class="kv"><span class="k">CDP</span><span class="v">Chrome DevTools Protocol — các thông điệp JSON qua WebSocket mà mọi debugger JS dùng.</span></div>
  <div class="kv"><span class="k">launch / attach</span><span class="v">Debugger tự chạy tiến trình / debugger gắn vào tiến trình đang chạy.</span></div>
  <div class="kv"><span class="k">--inspect-brk / --inspect-wait</span><span class="v">Chờ debugger trước khi chạy (dừng ở dòng 1 / không dừng).</span></div>
  <div class="kv"><span class="k">source map</span><span class="v">Tệp .map nối vị trí trong .js đã biên dịch với vị trí trong .ts gốc.</span></div>
  <div class="kv"><span class="k">outFiles</span><span class="v">Nơi VS Code tìm tệp đã biên dịch và map của chúng.</span></div>
  <div class="kv"><span class="k">JavaScript Debug Terminal</span><span class="v">Terminal mà mọi tiến trình Node chạy trong đó đều tự được debug.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Debugger là cái điều khiển từ xa: --inspect bật bộ thu, VS Code / DevTools / node inspect là các điều khiển nói chung giao thức CDP.</li>
<li>Launch khi VS Code tự chạy được chương trình; attach khi thứ khác đã chạy nó rồi.</li>
<li>Lỗi lúc khởi động cần --inspect-brk hoặc --inspect-wait.</li>
<li>Breakpoint TypeScript chỉ chạy qua source map (sourceMap: true + outFiles, hoặc tsx).</li>
<li>NODE_OPTIONS=--inspect với npm script làm npm chiếm cổng; dùng JavaScript Debug Terminal thay vào.</li>
</ul>
${NGUON}
</div>
`,
};
