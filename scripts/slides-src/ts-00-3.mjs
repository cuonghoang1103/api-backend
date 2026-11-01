/**
 * ts-00-3 — TypeScript · Section 0 · Lesson 0.3 "Setting up: Node 22, TypeScript 7, VS Code" (01/11/2026). Slug: typescript-0-3-cai-dat.
 * Output = chạy thật (scripts/ts/chay.sh, env sạch) Node 22.23.3 + npm 10.9.9 + tsc 7.0.2; đo tsc 6.0.3 vs 7.0.2 trên git archive backend (c572cf189).
 */
import { lamDeck, ts, tc, two, box, steps, cards, c, zm, sh, tbl } from './_ts-chung.mjs';

export const deck = { key: 'ts-00-3', code: 'TS 0.3', title: 'Setting up', sub: 'Node 22, TypeScript 7, VS Code' };

const NODE = `$ node -v && npm -v && node -p process.features.typescript
v22.23.3
10.9.9
strip
[exit 0]`;
const INSTALL = `$ npm init -y
Wrote to …/ts-00-3-hello/package.json: …
$ npm pkg set type=module
$ npm install --save-dev --save-exact typescript@7.0.2 @types/node@22.20.5
added 4 packages, and audited 5 packages in 2s
found 0 vulnerabilities
$ du -sh node_modules/typescript node_modules/@typescript/* node_modules/@types/node
3.5M	node_modules/typescript
 26M	node_modules/@typescript/typescript-darwin-arm64
2.5M	node_modules/@types/node`;
const TSCONFIG = `{
  "compilerOptions": {
    "target": "es2024",
    "module": "nodenext",
    "types": ["node"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`;
const HELLO = `// src/hello.ts — the first TypeScript file of LabFlow TS.
export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}

const lab: string = process.env.LAB ?? 'BE-201';
const opensAt: number = 7 * 60;
console.log('Lab ' + lab + ' opens at ' + formatTime(opensAt));`;
const HELLO_RUN = `$ npx tsc
[exit 0]
$ node src/hello.ts
Lab BE-201 opens at 07:00
[exit 0]
$ LAB=AI-305 node src/hello.ts
Lab AI-305 opens at 07:00
[exit 0]`;
const OOPS = `// src/oops.ts — a deliberate mistake: formatTime wants minutes, not "HH:MM".
import { formatTime } from './hello.ts';

console.log('LabFlow closes at ' + formatTime('21:00'));`;
const OOPS_RUN = `$ npx tsc
src/oops.ts(4,47): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
[exit 1]
$ node src/oops.ts
Lab BE-201 opens at 07:00
LabFlow closes at NaN:NaN
[exit 0]`;
const SCRIPTS = `"scripts": {
  "test": "node --test --test-reporter=spec \\"src/**/*.test.ts\\"",
  "typecheck": "tsc -p tsconfig.json",
  "check": "npm run typecheck && npm test"
}`;
const CHECK = `$ npm run check
> npm run typecheck && npm test
> tsc -p tsconfig.json
> node --test --test-reporter=spec "src/**/*.test.ts"
Lab BE-201 opens at 07:00
✔ 420 minutes is 07:00 (0.593125ms)
✔ 1290 minutes is 21:30 (0.084958ms)
ℹ pass 2
ℹ fail 0
[exit 0]`;
const TESTDIR = `$ node --test src/
# Error: Cannot find module '…/ts-00-3-hello/src'
not ok 1 - src
# pass 0
# fail 1
[exit 1]`;
const IGNORE = `$ npx tsc src/hello.ts
error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.
[exit 1]
$ npx tsc --ignoreConfig src/oops.ts
src/hello.ts(8,21): error TS2591: Cannot find name 'process'. Do you need to install type definitions for node? …
src/oops.ts(2,28): error TS5097: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.
src/oops.ts(4,47): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
[exit 2]
$ ls src
hello.js
hello.ts
oops.js
oops.ts`;
const JSIMP = `$ npx tsc
[exit 0]
$ node src/closing.ts
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/ts-00-3-hello/src/hello.js' imported from …/ts-00-3-hello/src/closing.ts
[exit 1]`;
const ENUM = `$ npx tsc
src/role.ts(2,6): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
[exit 1]
$ node src/role.ts
SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]: TypeScript enum is not supported in strip-only mode
[exit 1]`;
const SPEED = `$ find src -name '*.ts' | wc -l
    1199
$ time node ts6/bin/tsc --noEmit -p .
FATAL ERROR: … JavaScript heap out of memory
real	1m5.104s
$ time NODE_OPTIONS=--max-old-space-size=8192 node ts6/bin/tsc --noEmit -p .
real	0m55.024s
$ time node ts7/bin/tsc --noEmit -p .
real	0m6.289s`;

export const slides = lamDeck({ chuong: 'Section 0 — Introduction', bai: '0.3' }, [
  { cover: true, t: 'Setting up:<br>Node 22, TypeScript 7, VS Code', sub: 'Section 0 · Lesson 0.3 — from an empty folder to check + run in 20 minutes' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Node <b>22.23.3</b> that runs ${c('.ts')} files by itself (type stripping)</li>
    <li>TypeScript <b>7.0.2</b> + ${c('@types/node')}, installed as dev dependencies and <b>pinned exactly</b></li>
    <li>The course ${c('tsconfig.json')} — every line in one sentence</li>
    <li>Two commands: ${c('npx tsc')} <b>checks</b>, ${c('node file.ts')} <b>runs</b> — and ${c('npm run check')}</li>
    <li>Three traps: ${c('tsc file.ts')}, ${c("import './x.js'")}, ${c('enum')}</li>
    <li>VS Code vs ${c('npx tsc')}, and TypeScript 6 vs 7 measured on a real backend</li></ul>` },
  { t: 'Step 0 — Node 22 that runs .ts', body: two(sh(`# macOS / Linux
nvm install 22.23.3
nvm use 22.23.3
nvm alias default 22.23.3

# Windows: nvm-windows or fnm
nvm install 22.23.3`, { title: 'install with a version manager' }), tc(NODE, { title: 'terminal — clean environment' })) +
    box('strip = type stripping', `Node deletes the type annotations and runs the JavaScript that is left. On by default since <b>Node 22.18.0</b> (31 Jul 2025) — older 22.x print ${c('undefined')}.`, 'lam') +
    box('Open a NEW terminal after installing nvm', 'An open terminal does not re-read your shell profile — “nvm: command not found” is almost always this.', '') },
  { t: 'Step 1 — install TypeScript, pinned', body: tc(INSTALL, { title: 'terminal — ts-00-3-hello' }) + two(
      box('-D = dev dependency', 'Needed to <b>check</b> code, not to run it. A server can skip it with ' + c('npm ci --omit=dev') + '.', 'lam'),
      box('-E = exact pin', c('"7.0.2"') + ' not ' + c('"^7.0.2"') + ': a teammate cannot silently get 7.1 with new errors. Upgrade on purpose.', 'xanh')) +
    box('A Go program per platform', `TypeScript 7 was rewritten in Go: ${c('typescript')} (3.5 MB) is a launcher, the 26 MB native compiler comes in ${c('typescript-darwin-arm64')} — npm picks your OS/CPU from 20 options.`, '') },
  { t: 'Step 2 — the course tsconfig.json', body: two(ts(TSCONFIG, { sm: true, hl: [6, 8, 9, 10] }), cards([
      ['types: ["node"]', 'know ' + c('process') + ', ' + c('node:test') + ' — TS 7 default is []'],
      ['strict', 'all safety checks on'],
      ['noEmit', 'tsc only <b>checks</b>, writes no .js'],
      ['allowImportingTsExtensions', 'write ' + c("'./hello.ts'") + ' like Node needs'],
      ['erasableSyntaxOnly', 'refuse what Node cannot strip (enum)'],
      ['include: ["src"]', 'the folder that is the project'],
    ], 2), 'r46') + box('Node ignores tsconfig.json', 'Only tsc and your editor read it. Generated by ' + c('npx tsc --init') + ', then trimmed to these lines.', 'lam') },
  { t: 'Step 3 — the first TypeScript file', body: ts(HELLO, { sm: true, hl: [2, 8] }) + two(tc(HELLO_RUN, { title: 'check, then run' }),
    box('Silence is success', `${c('npx tsc')} printed nothing and exited 0. ${c(': number')} and ${c(': string')} are <b>type annotations</b>; ${c('process')} is known only because of ${c('types: ["node"]')}.`, 'xanh')) },
  { t: 'Step 4 — red on purpose, and the trap', body: ts(OOPS, { sm: true, hl: [4] }) + tc(OOPS_RUN, { title: 'terminal — the same file, two commands', wrap: 104 }) +
    box('Node runs the broken file anyway', `Stripping deletes types, it does not check them: exit 0 and ${c('NaN:NaN')}. <b>Checking</b> (${c('npx tsc')}) and <b>running</b> (${c('node')}) are two separate steps.`, 'do2') },
  { t: 'Step 5 — npm scripts and the first test', body: two(`<div>${ts(SCRIPTS, { sm: true })}${tc(TESTDIR, { title: 'the obvious command fails on Node 22' })}</div>`,
    tc(CHECK, { title: 'npm run check', wrap: 42 })) +
    box('Why && matters', `Tests run <b>only</b> if the type check passed — the same order CI uses. Glob ${c('"src/**/*.test.ts"')}, because ${c('node --test src/')} treats the folder as one file.`, 'lam') },
  { t: 'Trap (a) — never “tsc file.ts”', body: tc(IGNORE, { title: 'terminal — a folder that has tsconfig.json', wrap: 118 }) +
    box('Your config is gone', `TS 7 refuses (TS5112). With ${c('--ignoreConfig')} it uses the <b>defaults</b>: ${c('types: []')} so ${c('process')} is unknown, no ${c('.ts')} imports, and no ${c('noEmit')} — two ${c('.js')} files land in ${c('src/')}, exit 2. Always ${c('npx tsc')} or ${c('npx tsc -p <folder>')}.`, 'do2') },
  { t: 'Traps (b) and (c) — green check, red run', body: two(`<div>${ts(`import { formatTime } from './hello.js';`, { sm: true })}${tc(JSIMP, { title: "(b) import './hello.js'", wrap: 50 })}</div>`,
    `<div>${ts(`enum Role {\n  STUDENT,\n  LECTURER,\n}`, { sm: true })}${tc(ENUM, { title: '(c) enum', wrap: 50 })}</div>`) +
    box('Fixes', `(b) import ${c("'./hello.ts'")} — there is no ${c('hello.js')} on disk. (c) use ${c("type Role = 'STUDENT' | 'LECTURER'")}; ${c('erasableSyntaxOnly')} warns first (TS1294) instead of Node crashing later.`, 'xanh') },
  { t: 'VS Code vs npx tsc — who is the judge?', body: zm(`<table class="t"><tr><th>Tool</th><th>Checks types?</th><th>Runs code?</th><th>Version here</th></tr>
<tr><td>${c('npx tsc')}</td><td>✅ yes</td><td>❌ no (noEmit)</td><td>7.0.2 — package.json, CI</td></tr>
<tr><td>${c('node file.ts')}</td><td>❌ strips only</td><td>✅ yes</td><td>Node 22.23.3</td></tr>
<tr><td>VS Code red lines</td><td>✅ while typing</td><td>❌ no</td><td>bundled TypeScript 6.0.3 (VS Code 1.124.2)</td></tr>
<tr><td>${c('tsx')}</td><td>❌ strips only</td><td>✅ yes</td><td>4.23.15 — only for Node &lt; 22.18</td></tr></table>`, 1.12) +
    box('When they disagree, npx tsc wins', 'The editor and the project can run different TypeScript versions. The gate is the version pinned in package.json — the one CI runs. Optional: the Error Lens extension prints errors at the end of the line.', 'lam') },
  { t: 'TypeScript 6 vs 7 on a real backend', body: tc(SPEED, { title: 'this website’s backend — git archive HEAD (c572cf189), same Mac' }) + cards([
      ['📁 1,199 files', 'our own .ts files (3,407 with type declarations)'],
      ['🐢 TS 6.0.3', 'out of memory at the default heap; 55.0 / 56.4 s with 8 GB'],
      ['⚡ TS 7.0.2', '6.3 / 6.9 s — about <b>8–9× faster</b>'],
      ['🧠 memory', 'peak 5.05 GB (TS 7, many cores) vs 4.05 GB'],
    ], 4) + box('Same verdict', 'Both found the same real issue (TS2869). TS 7 also printed 8 × TS2883 — caused by the symlinked node_modules of our copy.', 'lam') },
]);
