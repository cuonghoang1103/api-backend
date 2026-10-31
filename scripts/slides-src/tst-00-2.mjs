/**
 * tst-00-2 — Testing · Section 0 · Lesson 0.3 "Setting up: Node 22 + Vitest 5" (31/10/2026). Slug bài: tst-0-2-cai-dat.
 * Output = chạy thật Node 22.23.3, npm 10.9.9, Vitest 5.0.5 (watch mode chụp qua pty, KHÔNG có biến AI_AGENT/CLAUDECODE).
 */
import { lamDeck, js, vt, two, box, steps, c, zm, sql } from './_tst-chung.mjs';

export const deck = { key: 'tst-00-2', code: 'TST 0.3', title: 'Setting up Vitest', sub: 'Node 22 + Vitest 5' };

const TIME = `// src/rules/time.js
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
}`;
const TEST = `// src/rules/time.test.js
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
});`;
const PASS = `$ npm test

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
      Tests  3 passed (3)`;
const FAIL = `$ npm test
 ❯ src/rules/time.test.js (3 tests | 1 failed) 5ms
   ❯ formatTime (1)
     × pads hours and minutes to two digits 3ms

 FAIL  src/rules/time.test.js > formatTime > pads hours…
AssertionError: expected '7:30' to be '07:30' // Object.is equality

Expected: "07:30"
Received: "7:30"

 ❯ src/rules/time.test.js:16:29
     16|     expect(formatTime(450)).toBe('07:30');
       |                             ^
      Tests  1 failed | 2 passed (3)`;
const WATCH = `$ npm run test:watch

 DEV  v5.0.5 …/labflow-lite

 ✓ src/rules/time.test.js (3 tests) 2ms
      Tests  3 passed (3)

 PASS  Waiting for file changes...
       press h to show help, press q to quit

  Watch Usage
  press a, return to rerun all tests
  press f to rerun only failed tests
  press t to filter by a test name regex pattern
  press q to quit`;
const NODEDIRECT = `$ node src/rules/time.test.js
file://…/node_modules/vitest/dist/chunks/run.BPv-BBRv.js:2745
		validateTags(runner.config, suiteTags);
		                    ^

TypeError: Cannot read properties of undefined (reading 'config')
    at initSuite (file://…/vitest/dist/chunks/run.BPv-BBRv.js:2745:23)
    …
    at file://…/labflow-lite/src/rules/time.test.js:4:1`;
const TS = `$ npx vitest run kieu

 ✓ src/rules/kieu.test.ts (1 test) 2ms
   ✓ TypeScript works with zero config 1ms

 Test Files  1 passed (1)
      Tests  1 passed (1)`;

export const slides = lamDeck({ chuong: 'Section 0 — Introduction', bai: '0.3' }, [
  { cover: true, t: 'Setting up:<br>Node 22 + Vitest 5', sub: 'Create LabFlow Lite, run your first Vitest suite, read red and green' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Check Node and npm — and why Vitest 5 needs Node ≥ 22.12</li>
    <li>Create the LabFlow Lite project in four commands</li>
    <li>Write the first rule file and its first Vitest test file</li>
    <li>Run all tests, one file, one test name, and in watch mode</li>
    <li>Read a failure on purpose; avoid the “node file.test.js” trap</li>
    <li>Vitest vs Jest vs node:test, and TypeScript with zero config</li></ul>` },
  { t: 'Step 0: check Node and npm', body: two(vt(`$ node -v\nv22.23.3\n$ npm -v\n10.9.9`, { title: 'terminal', sm: false }), `<div>${box('Vitest 5 requires', `Node ${c('^22.12.0')} or ${c('^24.0.0')} or ${c('>=26.0.0')} (its ${c('engines')} field). Node 20 is too old.`, 'do2')}${box('No Node, or too old?', `Install the LTS from <b>nodejs.org</b>, or use a version manager: <b>nvm</b> (macOS/Linux) · <b>nvm-windows</b>. Then open a <b>new</b> terminal and run ${c('node -v')} again.`, 'lam')}</div>`, 'r46') },
  { t: 'Step 1: create the project (four commands)', body: vt(`$ mkdir labflow-lite && cd labflow-lite
$ npm init -y
Wrote to …/labflow-lite/package.json:
$ npm pkg set type=module
$ npm pkg set scripts.test='vitest run' scripts.test:watch=vitest
$ npm install --save-dev vitest@5

added 35 packages, and audited 36 packages in 6s

found 0 vulnerabilities`, { title: 'terminal — npm 10.9.9', sm: false }) +
    box('Why each one', `${c('type=module')}: use ${c('import')}/${c('export')} · ${c('vitest run')}: run once and exit · ${c('--save-dev')}: a tool for developers, not shipped to users`, 'lam') },
  { t: 'package.json after the four commands', body: two(sql(`{
  "name": "labflow-lite",
  "version": "1.0.0",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "type": "module",
  "devDependencies": {
    "vitest": "^5.0.5"
  }
}`, { lang: 'json', hl: [4, 5, 7, 9] }), `<div style="font-size:21px">${steps([
      `${c('npm test')} → ${c('vitest run')}: one pass, exit code 0 or 1`,
      `${c('npm run test:watch')} → re-runs on every save`,
      `${c('"type": "module"')} → ${c('.js')} files are ES modules`,
      `${c('^5.0.5')} → any 5.x ≥ 5.0.5; the exact one is in ${c('package-lock.json')}`,
    ])}</div>`, 'r46') },
  { t: 'vitest.config.js: one setting for readable output', body: js(`// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['tree'], // print the describe → it tree
  },
});`) + two(box('Optional, but nicer', `Vitest works with <b>no config at all</b>. We add one line so every output in this course shows the full tree: file → describe → test.`, 'xanh'), box('How tests are found', `By name: ${c('*.test.js')}, ${c('*.spec.js')} (also ${c('.ts')}, ${c('.mjs')}…) anywhere in the project except ${c('node_modules')}.`, 'lam')) },
  { t: 'The code under test: src/rules/time.js', body: js(TIME, { sm: true }) + box('Two tiny functions, real rules', `${c("parseTime('07:30')")} → ${c('450')} · ${c('formatTime(450)')} → ${c("'07:30'")}. Bad input throws: wrong format ⇒ ${c('TypeError')}, impossible time ⇒ ${c('RangeError')}.`, 'lam') },
  { t: 'Your first Vitest test file', body: two(js(TEST, { sm: true }), `<div style="font-size:20px">${steps([
      `${c('import')} the test functions from ${c("'vitest'")}`,
      `${c('describe')} groups tests about one thing`,
      `${c('it')} is one test: a name + a function`,
      `${c('expect(actual).toBe(expected)')} is the assertion`,
      `Put it next to the code: ${c('time.test.js')} beside ${c('time.js')}`,
    ])}</div>`, 'r64') },
  { t: 'npm test: three green ticks', body: two(vt(PASS, { title: 'terminal — Vitest 5.0.5', sm: false }), box('Read it top to bottom', `<ol style="font-size:19px"><li>${c('RUN v5.0.5')} + the project folder</li><li>one line per file: 3 tests, 2 ms</li><li>the tree: describe → it</li><li>totals: files and tests</li><li>exit code 0 ⇒ CI would be green</li></ol>`, 'xanh'), 'r64') },
  { t: 'Make it red on purpose — and read it', body: two(vt(FAIL, { title: 'after removing padStart from the hour' }), box('What happened', `Removing ${c(".padStart(2, '0')")} from the hour made ${c('formatTime(450)')} return ${c("'7:30'")}. Expected (your test) vs Received (the code) say it in one glance; the caret points at line 16.`, 'do2'), 'r64') },
  { t: 'Run only what you need', body: `<table class="t"><tr><th>Command</th><th>Runs</th></tr>
    <tr><td>${c('npm test')}</td><td>every test file once (${c('vitest run')})</td></tr>
    <tr><td>${c('npx vitest run time')}</td><td>only files whose path contains “time”</td></tr>
    <tr><td>${c('npx vitest run src/rules/time.test.js')}</td><td>exactly that file</td></tr>
    <tr><td>${c('npx vitest run -t formatTime')}</td><td>only tests whose name matches; others show as skipped ↓</td></tr>
    <tr><td>${c('npm run test:watch')}</td><td>keep running; re-run affected tests on every save</td></tr></table>` +
    box('Exit codes', `${c('0')} = all passed, ${c('1')} = something failed. Scripts and CI read this number, not the colours.`, 'lam') },
  { t: 'Watch mode: tests re-run while you type', body: two(vt(WATCH, { title: 'terminal — Vitest 5.0.5 (shortened)', sm: false }), `<div>${box('Daily rhythm', `Editor on the left, watch mode on the right. Save ⇒ result in under a second.`, 'xanh')}${box('Watch did not start?', `Vitest runs once instead of watching when it detects <b>CI</b> (${c('CI=true')}) or an <b>AI coding agent</b> (e.g. ${c('AI_AGENT')}, ${c('CLAUDECODE')}), or when the terminal is not interactive. That is a feature, not a bug.`, 'lam')}</div>`, 'r64') },
  { t: 'Trap: running a test file with plain node', body: zm(vt(NODEDIRECT, { title: 'terminal', sm: false }), 1.05) +
    box('Why', `A Vitest file only works inside the Vitest runner, which prepares ${c('describe')}/${c('it')} first. Run it with ${c('npx vitest run …')} or ${c('npm test')}. (A ${c('node:test')} file is the opposite: ${c('node --test')} runs it.)`, 'do2') },
  { t: 'Vitest, Jest or node:test?', body: `<table class="t"><tr><th></th><th>Vitest 5</th><th>Jest 30</th><th>node:test (Node 22)</th></tr>
    <tr><td>Install</td><td>one dev dependency</td><td>one dev dependency (+ setup for ESM)</td><td>nothing — built in</td></tr>
    <tr><td>Syntax</td><td>${c('describe/it/expect')}, ${c('vi.fn')}</td><td>${c('describe/it/expect')}, ${c('jest.fn')}</td><td>${c('test')} + ${c('assert.equal')}</td></tr>
    <tr><td>ESM / TypeScript</td><td>out of the box</td><td>needs extra config</td><td>ESM yes; TS with a flag or tsx</td></tr>
    <tr><td>You meet it in</td><td>new JS/TS projects, Vite/React</td><td>many existing codebases</td><td>small libraries, scripts</td></tr></table>` +
    box('This course', 'Vitest for everything; the matcher names are the same as Jest, so moving between them is mostly renaming vi ↔ jest.', 'xanh') },
  { t: 'TypeScript: rename the file, nothing else', body: two(vt(TS, { title: 'terminal — src/rules/kieu.test.ts', sm: false }), `<div>${box('Zero config', `Vitest strips the types and runs the file — no ${c('tsconfig')} needed for this.`, 'xanh')}${box('But it does not type-check', `A wrong type still runs. To check types, run ${c('npx tsc --noEmit')} separately (Chapter 9 adds it to CI).`, 'do2')}</div>`, 'r64') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Node ≥ 22.12 + ${c('npm install --save-dev vitest@5')} — that is the whole setup</li>
    <li>${c('npm test')} = ${c('vitest run')}: once, exit code 0/1 · ${c('test:watch')} while coding</li>
    <li>Test files: ${c('*.test.js')} next to the code they test</li>
    <li>Filter by path or by ${c('-t')} name; never run a Vitest file with plain ${c('node')}</li>
    <li>Same API as Jest; TypeScript runs as-is but is not type-checked</li></ul>` },
]);
