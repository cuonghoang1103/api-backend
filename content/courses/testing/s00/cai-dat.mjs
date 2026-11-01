/**
 * Testing · Mục 0 · 0.3 — Cài đặt: Node 22 + Vitest 5, tạo dự án LabFlow Lite. Slug giữ từ khung: tst-0-2-cai-dat.
 * Output: chạy thật Node 22.23.3 / npm 10.9.9 / Vitest 5.0.5, 31/10–01/11/2026. Watch mode chụp qua pty (không có biến agent).
 * Khối output có dòng chứa backtick/gạch chéo của npm (vd "run &#96;npm fund&#96;") được cắt bằng … — không sửa chữ.
 */
import G from '../giang/tst-00-2.mjs';
import { ma, ra, nguon, lienKet } from '../_slides.mjs';

const M = {
  check: `
$ node -v
v22.23.3
$ npm -v
10.9.9
`,
  tao: `
$ mkdir labflow-lite
$ cd labflow-lite
$ npm init -y
Wrote to …/labflow-lite/package.json:
…
$ npm pkg set type=module
$ npm pkg set scripts.test='vitest run' scripts.test:watch=vitest
$ npm install --save-dev vitest@5

added 35 packages, and audited 36 packages in 6s
…
found 0 vulnerabilities
`,
  pkg: `
{
  "name": "labflow-lite",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "devDependencies": {
    "vitest": "^5.0.5"
  }
}
`,
  config: `
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['tree'],   // print the describe → it tree
  },
});
`,
  cay: `
labflow-lite/
├─ node_modules/          ← do npm tạo, không sửa, không commit
├─ package.json
├─ package-lock.json      ← ghim phiên bản chính xác, CÓ commit
├─ vitest.config.js
└─ src/
   └─ rules/
      ├─ time.js          ← code
      └─ time.test.js     ← test của nó, nằm ngay cạnh
`,
  time: `
// src/rules/time.js — convert between "HH:MM" and minutes since 00:00
export function parseTime(text) {
  const m = /^([0-9]{2}):([0-9]{2})$/.exec(text);
  if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new RangeError('Time out of range: ' + text);
  return h * 60 + min;
}

export function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}
`,
  test: `
// src/rules/time.test.js
import { describe, it, expect } from 'vitest';
import { parseTime, formatTime } from './time.js';

describe('parseTime', () => {
  it('turns "07:00" into 420 minutes', () => {
    expect(parseTime('07:00')).toBe(420);
  });

  it('counts the minutes too: "21:30" is 1290', () => {
    expect(parseTime('21:30')).toBe(1290);
  });
});

describe('formatTime', () => {
  it('pads hours and minutes to two digits', () => {
    expect(formatTime(450)).toBe('07:30');
  });
});
`,
  pass: `
$ npm test

> labflow-lite@1.0.0 test
> vitest run


 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/time.test.js (3 tests) 2ms
   ✓ parseTime (2)
     ✓ turns "07:00" into 420 minutes 1ms
     ✓ counts the minutes too: "21:30" is 1290 0ms
   ✓ formatTime (1)
     ✓ pads hours and minutes to two digits 0ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  23:43:40
   Duration  103ms (transform 60%, import 24%, worker 9%, tests 7%)
`,
  hong: `
  return String(h) + ':' + String(m).padStart(2, '0');   // cố ý bỏ padStart ở phần giờ
`,
  fail: `
$ npm test

> labflow-lite@1.0.0 test
> vitest run


 RUN  v5.0.5 …/labflow-lite

 ❯ src/rules/time.test.js (3 tests | 1 failed) 5ms
   ✓ parseTime (2)
     ✓ turns "07:00" into 420 minutes 1ms
     ✓ counts the minutes too: "21:30" is 1290 0ms
   ❯ formatTime (1)
     × pads hours and minutes to two digits 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/rules/time.test.js > formatTime > pads hours and minutes to two digits
AssertionError: expected '7:30' to be '07:30' // Object.is equality

Expected: "07:30"
Received: "7:30"

 ❯ src/rules/time.test.js:16:29
     14| describe('formatTime', () => {
     15|   it('pads hours and minutes to two digits', () => {
     16|     expect(formatTime(450)).toBe('07:30');
       |                             ^
     17|   });
     18| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  23:43:30
   Duration  104ms (transform 44%, import 27%, tests 20%, worker 9%)
`,
  loc: `
$ npx vitest run -t formatTime

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/time.test.js (3 tests | 2 skipped) 2ms
   ↓ parseTime (2)
     ↓ turns "07:00" into 420 minutes
     ↓ counts the minutes too: "21:30" is 1290
   ✓ formatTime (1)
     ✓ pads hours and minutes to two digits 1ms

 Test Files  1 passed (1)
      Tests  1 passed | 2 skipped (3)
`,
  watch: `
$ npm run test:watch

 DEV  v5.0.5 …/labflow-lite

 ✓ src/rules/time.test.js (3 tests) 2ms
   ✓ parseTime (2)
     ✓ turns "07:00" into 420 minutes 1ms
     ✓ counts the minutes too: "21:30" is 1290 0ms
   ✓ formatTime (1)
     ✓ pads hours and minutes to two digits 0ms

 Test Files  1 passed (1)
      Tests  3 passed (3)

 PASS  Waiting for file changes...
       press h to show help, press q to quit

  Watch Usage
  press a, return to rerun all tests
  press r to rerun current pattern tests
  press f to rerun only failed tests
  press u to update snapshot
  press p to filter by a filename
  press t to filter by a test name regex pattern
  press w to filter by a project name
  press q to quit
`,
  node: `
$ node src/rules/time.test.js
file://…/labflow-lite/node_modules/vitest/dist/chunks/run.BPv-BBRv.js:2745
		validateTags(runner.config, suiteTags);
		                    ^

TypeError: Cannot read properties of undefined (reading 'config')
    at initSuite (file://…/labflow-lite/node_modules/vitest/dist/chunks/run.BPv-BBRv.js:2745:23)
    …
    at file://…/labflow-lite/src/rules/time.test.js:4:1
    …

Node.js v22.23.3
`,
  ts: `
// src/rules/kieu.test.ts
import { it, expect } from 'vitest';
import { parseTime } from './time.js';

const open: number = parseTime('07:00');

it('TypeScript works with zero config', () => {
  expect(open).toBe(420);
});
`,
  tsOut: `
$ npx vitest run kieu

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/kieu.test.ts (1 test) 2ms
   ✓ TypeScript works with zero config 1ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
`,
  nodeTest: `
// cùng một phép kiểm, viết cho node:test (không cần cài gì)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatTime } from './time.js';

test('pads hours and minutes to two digits', () => {
  assert.equal(formatTime(450), '07:30');
});
`,
};

const NGUON = [
  nguon('🟩', 'Node.js — Download', 'The LTS installer for Windows and macOS, and package-manager instructions.', 'https://nodejs.org/en/download'),
  nguon('🔁', 'nvm (macOS / Linux) and nvm-windows', 'Install and switch Node versions per project.', 'https://github.com/nvm-sh/nvm'),
  nguon('⚡', 'Vitest — Command line interface', 'run, watch, filters, every flag.', 'https://vitest.dev/guide/cli.html'),
  nguon('🧩', 'Vitest extension for VS Code (publisher: Vitest)', 'Run and debug single tests from the editor gutter.', 'https://marketplace.visualstudio.com/items?itemName=vitest.explorer'),
].join('\n');

export default {
  title: '0.3 — Setting up: Node 22, Vitest 5 and the LabFlow Lite project|||0.3 — Cài đặt: Node 22, Vitest 5 và dự án LabFlow Lite',
  slug: 'tst-0-2-cai-dat',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Kiểm Node (Vitest 5 cần Node ≥ 22.12), tạo dự án LabFlow Lite bằng bốn lệnh, file luật time.js và file test Vitest đầu tiên, chạy cả bộ/một file/một tên test/watch, cố ý làm đỏ để tập đọc lỗi, bẫy chạy file test bằng node, Vitest vs Jest vs node:test, TypeScript không cần cấu hình.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Setting up: Node 22, Vitest 5 and the LabFlow Lite project</h2>
<p class="lead">Twenty minutes from an empty folder to a running test suite. You will create the project the whole course grows from, write its first rule file and test file, and practise the four ways of running tests and the five-step way of reading a failure.</p>

<h3>Step 0 — check Node and npm</h3>
${ra(M.check)}
<p>Vitest 5 declares <code>"engines": { "node": "^22.12.0 || ^24.0.0 || &gt;=26.0.0" }</code>, so Node 22.12 or later is required; Node 20 is too old. If <code>node -v</code> fails or shows an older version, install the LTS from nodejs.org (Windows and macOS installers), or use a version manager — <strong>nvm</strong> on macOS/Linux, <strong>nvm-windows</strong> on Windows — and open a <em>new</em> terminal before checking again.</p>

<h3>Step 1 — create the project</h3>
${ra(M.tao)}
<table>
<thead><tr><th>Command</th><th>What it does</th></tr></thead>
<tbody>
<tr><td><code>npm init -y</code></td><td>Creates <code>package.json</code> with default answers (<code>-y</code> = “yes to everything”).</td></tr>
<tr><td><code>npm pkg set type=module</code></td><td>Every <code>.js</code> file becomes an ES module, so <code>import</code>/<code>export</code> work.</td></tr>
<tr><td><code>npm pkg set scripts.test=… scripts.test:watch=…</code></td><td>Adds two shortcuts: <code>npm test</code> and <code>npm run test:watch</code>.</td></tr>
<tr><td><code>npm install --save-dev vitest@5</code></td><td>Installs Vitest 5.x as a <em>dev dependency</em> — a tool for developers, never shipped to users.</td></tr>
</tbody>
</table>
<div class="callout"><p><strong>On Windows cmd.exe</strong> single quotes do not group words; write <code>npm pkg set scripts.test="vitest run"</code>. PowerShell, Git Bash, macOS and Linux accept the single quotes shown above.</p></div>
<p>The resulting <code>package.json</code>:</p>
${ma('json', M.pkg)}
<p>The caret in <code>^5.0.5</code> means “any 5.x from 5.0.5 upwards”; the exact version that was installed is pinned in <code>package-lock.json</code>, which you commit so the whole team gets the same one.</p>

<h3>Step 2 — one config line for readable output</h3>
${ma('javascript', M.config)}
<p>Vitest works without any config. The <code>tree</code> reporter only changes how results are printed — file, then describe block, then test — so your terminal matches every output in this course. Vitest finds tests by file name: <code>*.test.js</code>, <code>*.spec.js</code> and the same with <code>.mjs</code>, <code>.ts</code> and friends, anywhere except <code>node_modules</code>.</p>
<p>Project layout after this lesson:</p>
${ma('text', M.cay)}

<h3>Step 3 — the code under test</h3>
${ma('javascript', M.time)}
<p>Line by line: the regular expression accepts exactly two digits, a colon, two digits; anything else throws a <code>TypeError</code>. A well-formed but impossible time such as <code>24:00</code> or <code>07:60</code> throws a <code>RangeError</code>. Otherwise the result is hours × 60 + minutes. <code>formatTime</code> reverses it: <code>Math.floor</code> keeps whole hours, <code>%</code> keeps the remaining minutes, <code>padStart(2, '0')</code> adds the leading zero.</p>

<h3>Step 4 — the first test file</h3>
${ma('javascript', M.test)}
<ul>
<li><code>import { describe, it, expect } from 'vitest'</code> — the three functions you use most.</li>
<li><code>describe('parseTime', …)</code> groups the tests about one function; it is only for organisation and naming.</li>
<li><code>it('turns "07:00" into 420 minutes', () =&gt; { … })</code> is one test: a sentence that says what must be true, and a function that checks it. (<code>test</code> is an alias of <code>it</code>.)</li>
<li><code>expect(actual).toBe(expected)</code> is the assertion. <code>toBe</code> is a <em>matcher</em>; lesson 1.2 covers the others.</li>
</ul>

<h3>Step 5 — run it</h3>
${ra(M.pass)}
<p>Five parts, top to bottom: the command npm actually ran (<code>vitest run</code>); the Vitest version and project folder; one line per file with the number of tests and the time; the tree; the totals. Behind the scenes the process exits with code <strong>0</strong> — that number, not the colour, is what scripts and CI servers read.</p>

<h3>Step 6 — make it red on purpose</h3>
<p>Change the last line of <code>formatTime</code> to</p>
${ma('javascript', M.hong)}
${ra(M.fail)}
<p>Read it in the five steps from the previous lesson: <em>where</em> (<code>time.test.js › formatTime › pads hours…</code>), <em>what</em> (expected <code>'7:30'</code> to be <code>'07:30'</code>), <em>expected vs received</em>, <em>which line</em> (16, under the caret), <em>how many</em> (1 failed, 2 passed). The exit code is now <strong>1</strong>. Put <code>padStart</code> back and the suite is green again.</p>

<h3>Step 7 — run only what you need</h3>
<table>
<thead><tr><th>Command</th><th>Runs</th></tr></thead>
<tbody>
<tr><td><code>npm test</code></td><td>Every test file, once.</td></tr>
<tr><td><code>npx vitest run time</code></td><td>Files whose path contains “time”.</td></tr>
<tr><td><code>npx vitest run src/rules/time.test.js</code></td><td>Exactly that file.</td></tr>
<tr><td><code>npx vitest run -t formatTime</code></td><td>Only tests whose name matches; the rest are reported as skipped (↓).</td></tr>
<tr><td><code>npm run test:watch</code></td><td>Keeps running and re-runs affected tests on every save.</td></tr>
</tbody>
</table>
${ra(M.loc)}
<p>Watch mode is the everyday rhythm — editor on one side, this on the other:</p>
${ra(M.watch)}
<div class="callout"><p><strong>Watch mode did not start?</strong> Vitest only watches when the terminal is interactive and it is <em>not</em> running in CI (<code>CI=true</code>) or under an AI coding agent. In Vitest 5 the decision is <code>watch: !isCI &amp;&amp; process.stdin.isTTY &amp;&amp; !isAgent</code>, and the agent check looks at variables such as <code>AI_AGENT</code> or <code>CLAUDECODE</code>. If you run Vitest from inside such a tool it runs once and exits — on purpose. Run <code>npm run test:watch</code> in your own terminal instead.</p></div>

<div class="pitfall co-tieu-de">
<p><strong>Trap — running a Vitest file with plain <code>node</code>.</strong></p>
${ra(M.node)}
<p><code>describe</code> and <code>it</code> only work after the Vitest runner has prepared them; called directly, Vitest’s internals have nothing to read and crash with a confusing <code>TypeError</code>. Always use <code>npm test</code> or <code>npx vitest run …</code>. (A <code>node:test</code> file, like the one in “Start here 1/2”, is the opposite: you run it with <code>node --test</code>.)</p>
</div>

<h3>Vitest, Jest and node:test side by side</h3>
<p>The same check, written for <code>node:test</code>:</p>
${ma('javascript', M.nodeTest)}
<table>
<thead><tr><th></th><th>Vitest 5</th><th>Jest 30</th><th>node:test (Node 22)</th></tr></thead>
<tbody>
<tr><td>Install</td><td>One dev dependency</td><td>One dev dependency, plus setup for ES modules</td><td>Nothing — built in</td></tr>
<tr><td>Style</td><td><code>describe / it / expect</code>, <code>vi.fn()</code></td><td><code>describe / it / expect</code>, <code>jest.fn()</code></td><td><code>test</code> + <code>assert.equal</code></td></tr>
<tr><td>ES modules, TypeScript</td><td>Out of the box</td><td>Needs extra configuration</td><td>ES modules yes; TypeScript with a flag or <code>tsx</code></td></tr>
<tr><td>Where you meet it</td><td>New JS/TS projects, anything built with Vite</td><td>Many existing codebases</td><td>Libraries, scripts, projects avoiding dependencies</td></tr>
</tbody>
</table>
<p>This course writes everything in Vitest. Because the <code>expect</code> matchers have the same names as Jest’s, moving to a Jest codebase is mostly renaming <code>vi</code> to <code>jest</code>. The Node.js course (Chapter 14) measured all three runners on the same suite if you want numbers.</p>

<h3>TypeScript with zero configuration</h3>
${ma('typescript', M.ts)}
${ra(M.tsOut)}
<p>Vitest strips the type annotations and runs the code. It does <strong>not</strong> check the types — <code>const open: string = parseTime('07:00')</code> would also pass. Type checking is a separate command, <code>npx tsc --noEmit</code>, which Chapter 9 adds to CI. This course writes JavaScript so you focus on testing; everything works the same in TypeScript.</p>

<h3>Editor support</h3>
<p>In VS Code, the <strong>Vitest</strong> extension (publisher: Vitest) shows a ▶ next to each <code>it</code>, so you can run or debug one test with a click. It is optional — everything in this course is done in the terminal.</p>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Create <code>labflow-lite</code> exactly as in Steps 1–4 and run <code>npm test</code>: 3 passed.</li>
<li>Add a fourth test inside <code>describe('parseTime')</code>: <code>"23:59"</code> is the last minute of the day. Work out the expected number yourself first, then run.</li>
<li>Run only your new test with <code>-t</code>. The other three must show as skipped.</li>
<li>Start <code>npm run test:watch</code>, change <code>"23:59"</code> to <code>"23:58"</code> in the test without changing the expected number, save, and watch it go red. Press <code>q</code> to quit.</li>
<li>Run <code>npm test</code> and then <code>echo $?</code> (PowerShell: <code>echo $LASTEXITCODE</code>) once while green and once while red.</li>
</ol>
<p><strong>Done when:</strong> the suite reports <code>4 passed (4)</code> with your test expecting <code>1439</code> (23 × 60 + 59); the filtered run shows <code>1 passed | 3 skipped (4)</code>; watch mode turned red within a second of saving (<code>1438</code> received); and you saw exit code <code>0</code> when green and <code>1</code> when red.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">dev dependency</span><span class="v">A package needed only while developing (test runner, linter), listed in <code>devDependencies</code>.</span></div>
  <div class="kv"><span class="k">ES module</span><span class="v">A JavaScript file that uses <code>import</code>/<code>export</code>; enabled by <code>"type": "module"</code>.</span></div>
  <div class="kv"><span class="k">describe / it</span><span class="v">Group of tests / one test. <code>test</code> is another name for <code>it</code>.</span></div>
  <div class="kv"><span class="k">matcher</span><span class="v">The comparison after <code>expect(…)</code>, e.g. <code>toBe</code>, <code>toEqual</code>, <code>toThrow</code>.</span></div>
  <div class="kv"><span class="k">reporter</span><span class="v">The part of the runner that prints results (default, tree, dot, JUnit XML for CI…).</span></div>
  <div class="kv"><span class="k">watch mode</span><span class="v">The runner stays open and re-runs affected tests on every save.</span></div>
  <div class="kv"><span class="k">exit code</span><span class="v">The number a program returns when it ends: 0 = success, non-zero = failure. CI reads it.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 What happens when you run a test</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">npm script</div><div class="lz-d">runs vitest</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Collect</div><div class="lz-d">finds *.test.js files</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Run</div><div class="lz-d">each it() with its expect()</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Report</div><div class="lz-d">green ✓ or red × with expected/actual</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Exit code</div><div class="lz-d">0 if all pass, 1 otherwise — what CI reads</div></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Vitest 5 needs Node 22.12 or newer; install it once as a dev dependency.</li>
<li><code>npm test</code> (<code>vitest run</code>) runs everything once and exits with 0 or 1; <code>npm run test:watch</code> re-runs on save.</li>
<li>Test files are named <code>*.test.js</code> and live next to the code they test.</li>
<li>Filter by path or with <code>-t</code> by name; never run a Vitest file with plain <code>node</code>.</li>
<li>Vitest, Jest and <code>node:test</code> share one idea; Vitest and Jest even share matcher names.</li>
<li>TypeScript test files run with no config, but types are not checked by Vitest.</li>
</ul>

<h3>📚 Sources</h3>
${NGUON}
${lienKet({ bai: 'swt301-junit-hands-on', title: 'Also in SWT301 — lesson 8.5: JUnit hands-on (JUnit 4.13.2 → JUnit 5 with Maven)', sub: 'Same: a runner discovers test methods, runs them, prints failures with expected vs actual, and returns exit code 1 when anything fails — which is what CI reads. Different: SWT301 does it in Java with Ant/Maven and @Test; here it is Vitest, npm scripts and it(). Seeing both makes the idea language-independent.', cta: 'OPEN SWT301 LESSON →' })}
${lienKet({ khoa: 'typescript', bai: 'typescript-0-4-mo-hinh', title: 'Go deeper in the TypeScript course — 0.4: compile time vs runtime', sub: 'Same: Vitest, like Node 22, strips the type annotations and runs the code. Different: that lesson shows, with real output, why nobody is checking the types at that moment, what cannot be stripped (enum), and how a separate tsc --noEmit step closes the gap.', cta: 'OPEN TYPESCRIPT LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Cài đặt: Node 22, Vitest 5 và dự án LabFlow Lite</h2>
<p class="lead">Hai mươi phút từ một thư mục trống tới một bộ test chạy được. Bạn sẽ tạo dự án mà cả khoá lớn dần từ đó, viết file luật đầu tiên và file test đầu tiên, tập bốn cách chạy test và năm bước đọc một lỗi.</p>

<h3>Bước 0 — kiểm Node và npm</h3>
${ra(M.check)}
<p>Vitest 5 khai báo <code>"engines": { "node": "^22.12.0 || ^24.0.0 || &gt;=26.0.0" }</code>, tức là cần Node 22.12 trở lên; Node 20 là quá cũ. Nếu <code>node -v</code> báo lỗi hoặc ra bản cũ, hãy cài bản LTS từ nodejs.org (có bộ cài cho Windows và macOS), hoặc dùng trình quản lý phiên bản — <strong>nvm</strong> trên macOS/Linux, <strong>nvm-windows</strong> trên Windows — rồi mở một cửa sổ terminal <em>mới</em> trước khi kiểm lại.</p>

<h3>Bước 1 — tạo dự án</h3>
${ra(M.tao)}
<table>
<thead><tr><th>Lệnh</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td><code>npm init -y</code></td><td>Tạo <code>package.json</code> với câu trả lời mặc định (<code>-y</code> = "đồng ý hết").</td></tr>
<tr><td><code>npm pkg set type=module</code></td><td>Mọi file <code>.js</code> thành ES module, nên dùng được <code>import</code>/<code>export</code>.</td></tr>
<tr><td><code>npm pkg set scripts.test=… scripts.test:watch=…</code></td><td>Thêm hai lối tắt: <code>npm test</code> và <code>npm run test:watch</code>.</td></tr>
<tr><td><code>npm install --save-dev vitest@5</code></td><td>Cài Vitest 5.x làm <em>dev dependency (phụ thuộc lúc phát triển)</em> — công cụ cho lập trình viên, không đi theo sản phẩm tới người dùng.</td></tr>
</tbody>
</table>
<div class="callout"><p><strong>Trên cmd.exe của Windows</strong>, dấu nháy đơn không gom chữ lại; hãy viết <code>npm pkg set scripts.test="vitest run"</code>. PowerShell, Git Bash, macOS và Linux nhận được dấu nháy đơn như trên.</p></div>
<p><code>package.json</code> thu được:</p>
${ma('json', M.pkg)}
<p>Dấu mũ trong <code>^5.0.5</code> nghĩa là "mọi bản 5.x từ 5.0.5 trở lên"; phiên bản chính xác đã cài được ghim trong <code>package-lock.json</code> — file này bạn commit để cả nhóm cài đúng một bản.</p>

<h3>Bước 2 — một dòng cấu hình cho output dễ đọc</h3>
${ma('javascript', M.config)}
<p>Vitest chạy được mà không cần cấu hình gì. Reporter <code>tree</code> chỉ đổi cách in kết quả — file, rồi khối describe, rồi test — để terminal của bạn giống hệt mọi output trong khoá. Vitest tìm test theo tên file: <code>*.test.js</code>, <code>*.spec.js</code> và các đuôi tương tự <code>.mjs</code>, <code>.ts</code>…, ở mọi nơi trừ <code>node_modules</code>.</p>
<p>Cấu trúc dự án sau bài này:</p>
${ma('text', M.cay)}

<h3>Bước 3 — code cần test</h3>
${ma('javascript', M.time)}
<p>Từng dòng: biểu thức chính quy (regular expression) chỉ nhận đúng hai chữ số, dấu hai chấm, hai chữ số; mọi thứ khác ném <code>TypeError</code>. Một giờ đúng định dạng nhưng vô lý như <code>24:00</code> hay <code>07:60</code> ném <code>RangeError</code>. Còn lại thì kết quả là giờ × 60 + phút. <code>formatTime</code> làm ngược lại: <code>Math.floor</code> lấy phần giờ nguyên, <code>%</code> lấy số phút còn dư, <code>padStart(2, '0')</code> thêm số 0 đứng đầu.</p>

<h3>Bước 4 — file test đầu tiên</h3>
${ma('javascript', M.test)}
<ul>
<li><code>import { describe, it, expect } from 'vitest'</code> — ba hàm bạn dùng nhiều nhất.</li>
<li><code>describe('parseTime', …)</code> gom các test về một hàm; nó chỉ để sắp xếp và đặt tên.</li>
<li><code>it('turns "07:00" into 420 minutes', () =&gt; { … })</code> là một test: một câu nói điều gì phải đúng, và một hàm kiểm điều đó. (<code>test</code> là tên gọi khác của <code>it</code>.)</li>
<li><code>expect(actual).toBe(expected)</code> là lệnh khẳng định. <code>toBe</code> là một <em>matcher (bộ so khớp)</em>; bài 1.2 dạy các matcher khác.</li>
</ul>

<h3>Bước 5 — chạy thử</h3>
${ra(M.pass)}
<p>Năm phần, từ trên xuống: lệnh mà npm thật sự chạy (<code>vitest run</code>); phiên bản Vitest và thư mục dự án; mỗi file một dòng kèm số test và thời gian; cái cây; dòng tổng. Phía sau, tiến trình thoát với mã <strong>0</strong> — chính con số đó, chứ không phải màu sắc, là thứ script và máy chủ CI đọc.</p>

<h3>Bước 6 — cố ý làm đỏ</h3>
<p>Đổi dòng cuối của <code>formatTime</code> thành</p>
${ma('javascript', M.hong)}
${ra(M.fail)}
<p>Đọc theo năm bước ở bài trước: <em>ở đâu</em> (<code>time.test.js › formatTime › pads hours…</code>), <em>chuyện gì</em> (mong đợi <code>'7:30'</code> phải là <code>'07:30'</code>), <em>mong đợi và nhận được</em>, <em>dòng nào</em> (16, dưới dấu mũ), <em>bao nhiêu</em> (1 hỏng, 2 đạt). Mã thoát giờ là <strong>1</strong>. Trả lại <code>padStart</code> thì bộ test xanh trở lại.</p>

<h3>Bước 7 — chỉ chạy thứ bạn cần</h3>
<table>
<thead><tr><th>Lệnh</th><th>Chạy gì</th></tr></thead>
<tbody>
<tr><td><code>npm test</code></td><td>Mọi file test, một lượt.</td></tr>
<tr><td><code>npx vitest run time</code></td><td>Các file có đường dẫn chứa "time".</td></tr>
<tr><td><code>npx vitest run src/rules/time.test.js</code></td><td>Đúng file đó.</td></tr>
<tr><td><code>npx vitest run -t formatTime</code></td><td>Chỉ test có tên khớp; phần còn lại báo là bỏ qua (↓).</td></tr>
<tr><td><code>npm run test:watch</code></td><td>Chạy liên tục, mỗi lần lưu thì chạy lại các test bị ảnh hưởng.</td></tr>
</tbody>
</table>
${ra(M.loc)}
<p>Chế độ watch là nhịp làm việc hằng ngày — editor một bên, cửa sổ này một bên:</p>
${ra(M.watch)}
<div class="callout"><p><strong>Watch không chạy?</strong> Vitest chỉ vào chế độ watch khi terminal là tương tác và nó <em>không</em> chạy trong CI (<code>CI=true</code>) hay dưới một agent lập trình AI. Trong Vitest 5 điều kiện là <code>watch: !isCI &amp;&amp; process.stdin.isTTY &amp;&amp; !isAgent</code>, và phép kiểm agent nhìn các biến môi trường như <code>AI_AGENT</code> hay <code>CLAUDECODE</code>. Nếu bạn chạy Vitest từ bên trong một công cụ như vậy, nó cố ý chạy một lượt rồi thoát. Hãy chạy <code>npm run test:watch</code> trong terminal của chính bạn.</p></div>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — chạy file test Vitest bằng <code>node</code> trơn.</strong></p>
${ra(M.node)}
<p><code>describe</code> và <code>it</code> chỉ hoạt động sau khi bộ chạy Vitest đã chuẩn bị chúng; gọi thẳng thì phần bên trong Vitest chẳng có gì để đọc và chết với một <code>TypeError</code> khó hiểu. Luôn dùng <code>npm test</code> hoặc <code>npx vitest run …</code>. (File <code>node:test</code>, như ở bài "Bắt đầu tại đây 1/2", thì ngược lại: chạy bằng <code>node --test</code>.)</p>
</div>

<h3>Vitest, Jest và node:test đặt cạnh nhau</h3>
<p>Cùng một phép kiểm, viết cho <code>node:test</code>:</p>
${ma('javascript', M.nodeTest)}
<table>
<thead><tr><th></th><th>Vitest 5</th><th>Jest 30</th><th>node:test (Node 22)</th></tr></thead>
<tbody>
<tr><td>Cài đặt</td><td>Một dev dependency</td><td>Một dev dependency, cộng cấu hình cho ES module</td><td>Không cần — có sẵn</td></tr>
<tr><td>Kiểu viết</td><td><code>describe / it / expect</code>, <code>vi.fn()</code></td><td><code>describe / it / expect</code>, <code>jest.fn()</code></td><td><code>test</code> + <code>assert.equal</code></td></tr>
<tr><td>ES module, TypeScript</td><td>Dùng ngay</td><td>Cần cấu hình thêm</td><td>ES module có; TypeScript cần cờ hoặc <code>tsx</code></td></tr>
<tr><td>Gặp ở đâu</td><td>Dự án JS/TS mới, mọi thứ dựng bằng Vite</td><td>Rất nhiều codebase có sẵn</td><td>Thư viện, script, dự án muốn ít phụ thuộc</td></tr>
</tbody>
</table>
<p>Khoá này viết mọi thứ bằng Vitest. Vì các matcher của <code>expect</code> trùng tên với Jest, sang một codebase Jest chủ yếu chỉ là đổi <code>vi</code> thành <code>jest</code>. Khoá Node.js (Chương 14) đã đo cả ba bộ chạy trên cùng một bộ test nếu bạn muốn xem số.</p>

<h3>TypeScript không cần cấu hình</h3>
${ma('typescript', M.ts)}
${ra(M.tsOut)}
<p>Vitest bỏ phần chú thích kiểu rồi chạy code. Nó <strong>không</strong> kiểm kiểu — <code>const open: string = parseTime('07:00')</code> cũng vẫn qua. Kiểm kiểu là một lệnh riêng, <code>npx tsc --noEmit</code>, Chương 9 sẽ đưa vào CI. Khoá này viết JavaScript để bạn tập trung vào testing; mọi thứ chạy y hệt với TypeScript.</p>

<h3>Hỗ trợ trong editor</h3>
<p>Trên VS Code, extension <strong>Vitest</strong> (nhà phát hành: Vitest) hiện nút ▶ cạnh mỗi <code>it</code>, bấm là chạy hoặc debug đúng một test. Không bắt buộc — mọi thứ trong khoá làm được bằng terminal.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Tạo <code>labflow-lite</code> đúng như Bước 1–4 và chạy <code>npm test</code>: 3 passed.</li>
<li>Thêm test thứ tư trong <code>describe('parseTime')</code>: <code>"23:59"</code> là phút cuối cùng của ngày. Tự tính con số mong đợi trước, rồi chạy.</li>
<li>Chỉ chạy test mới bằng <code>-t</code>. Ba test kia phải hiện là bị bỏ qua.</li>
<li>Bật <code>npm run test:watch</code>, đổi <code>"23:59"</code> thành <code>"23:58"</code> trong test mà giữ nguyên con số mong đợi, lưu lại, và nhìn nó đỏ. Bấm <code>q</code> để thoát.</li>
<li>Chạy <code>npm test</code> rồi <code>echo $?</code> (PowerShell: <code>echo $LASTEXITCODE</code>) một lần lúc xanh và một lần lúc đỏ.</li>
</ol>
<p><strong>Đạt khi:</strong> bộ test báo <code>4 passed (4)</code> với test của bạn mong đợi <code>1439</code> (23 × 60 + 59); lượt chạy có lọc hiện <code>1 passed | 3 skipped (4)</code>; watch đỏ lên trong vòng một giây sau khi lưu (nhận được <code>1438</code>); và bạn đã thấy mã thoát <code>0</code> khi xanh, <code>1</code> khi đỏ.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">dev dependency (phụ thuộc lúc phát triển)</span><span class="v">Gói chỉ cần khi phát triển (bộ chạy test, linter), nằm trong <code>devDependencies</code>.</span></div>
  <div class="kv"><span class="k">ES module</span><span class="v">File JavaScript dùng <code>import</code>/<code>export</code>; bật bằng <code>"type": "module"</code>.</span></div>
  <div class="kv"><span class="k">describe / it</span><span class="v">Một nhóm test / một test. <code>test</code> là tên khác của <code>it</code>.</span></div>
  <div class="kv"><span class="k">matcher (bộ so khớp)</span><span class="v">Phép so sánh sau <code>expect(…)</code>, vd <code>toBe</code>, <code>toEqual</code>, <code>toThrow</code>.</span></div>
  <div class="kv"><span class="k">reporter (bộ in kết quả)</span><span class="v">Phần của bộ chạy test lo việc in kết quả (default, tree, dot, JUnit XML cho CI…).</span></div>
  <div class="kv"><span class="k">watch mode (chế độ theo dõi)</span><span class="v">Bộ chạy mở liên tục và chạy lại test bị ảnh hưởng mỗi lần lưu file.</span></div>
  <div class="kv"><span class="k">exit code (mã thoát)</span><span class="v">Con số chương trình trả về khi kết thúc: 0 = thành công, khác 0 = thất bại. CI đọc con số này.</span></div>
</div>

<h3>🗺 Chuyện gì xảy ra khi chạy test</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">npm script</div><div class="lz-d">gọi vitest</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Thu thập</div><div class="lz-d">tìm các file *.test.js</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Chạy</div><div class="lz-d">từng it() với expect() của nó</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Báo cáo</div><div class="lz-d">✓ xanh hoặc × đỏ kèm expected/actual</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Exit code</div><div class="lz-d">0 nếu tất cả qua, 1 nếu không — thứ CI đọc</div></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Vitest 5 cần Node 22.12 trở lên; cài một lần làm dev dependency.</li>
<li><code>npm test</code> (<code>vitest run</code>) chạy mọi thứ một lượt và thoát với 0 hoặc 1; <code>npm run test:watch</code> chạy lại mỗi lần lưu.</li>
<li>File test đặt tên <code>*.test.js</code> và nằm cạnh code mà nó test.</li>
<li>Lọc theo đường dẫn hoặc theo tên bằng <code>-t</code>; đừng bao giờ chạy file Vitest bằng <code>node</code> trơn.</li>
<li>Vitest, Jest và <code>node:test</code> cùng một ý tưởng; Vitest và Jest còn trùng tên matcher.</li>
<li>File test TypeScript chạy không cần cấu hình, nhưng Vitest không kiểm kiểu.</li>
</ul>

<h3>📚 Nguồn</h3>
${NGUON}
${lienKet({ bai: 'swt301-junit-hands-on', title: 'Đã gặp ở SWT301 — bài 8.5: Thực hành JUnit (JUnit 4.13.2 → JUnit 5 với Maven)', sub: 'Giống: bộ chạy tìm các phương thức test, chạy chúng, in lỗi kèm expected và actual, và trả mã thoát 1 khi có gì hỏng — đúng thứ CI đọc. Khác: SWT301 làm bằng Java với Ant/Maven và @Test; ở đây là Vitest, npm script và it(). Thấy cả hai thì ý tưởng không còn phụ thuộc ngôn ngữ.', cta: 'MỞ BÀI SWT301 →' })}
${lienKet({ khoa: 'typescript', bai: 'typescript-0-4-mo-hinh', title: 'Học sâu ở khoá TypeScript — 0.4: lúc biên dịch vs lúc chạy', sub: 'Giống: Vitest, cũng như Node 22, xoá chú thích kiểu rồi chạy code. Khác: bài đó cho thấy bằng output thật vì sao lúc ấy không ai kiểm kiểu, thứ gì không xoá được (enum), và một bước tsc --noEmit riêng lấp khoảng trống ra sao.', cta: 'MỞ BÀI TYPESCRIPT →' })}
</div>
`,
};
