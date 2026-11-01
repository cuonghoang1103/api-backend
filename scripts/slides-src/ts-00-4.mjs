/**
 * ts-00-4 — TypeScript · Section 0 · Lesson 0.4 "The one mental model: compile time vs runtime" (01/11/2026). Slug: typescript-0-4-mo-hinh.
 * Code/output = content/courses/typescript/s00/_ma-ts-00-4.mjs (Node 22.23.3 + tsc 7.0.2, chạy thật trên labflow-ts/demo0/ts-00-4).
 */
import { lamDeck, ts, tc, two, box, steps, cards, c, zm, flow } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s00/_ma-ts-00-4.mjs';

export const deck = { key: 'ts-00-4', code: 'TS 0.4', title: 'Compile time vs runtime', sub: 'The one mental model' };

// Cắt output: giữ các dòng đầu, bỏ khung stack của Node nội bộ (chỉ bỏ dòng, không sửa chữ).
const gon = (t, n = 99) => t.split('\n').filter((l) => !/node:internal|^\s+at async|^\s+at ModuleJob|^\(Use |^Node\.js v|^$/.test(l)).slice(0, n).join('\n');
const pick = (t, re) => t.split('\n').filter((l) => re.test(l)).join('\n');
const L = (s, a, b) => s.split('\n').slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Section 0 — Introduction', bai: '0.4' }, [
  { cover: true, t: 'The one mental model:<br>compile time vs runtime', sub: 'Section 0 · Lesson 0.4 — where types live, and where they do not' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The <b>two worlds</b>: tsc reads code, Node runs code — they never meet</li>
    <li><b>Type erasure</b>, seen for real: the emitted JS and what Node 22 strips</li>
    <li>Why a file with a type error <b>still runs</b></li>
    <li>Why ${c('instanceof SomeType')} and ${c('as Booking')} cannot check data</li>
    <li>Why this course uses <b>unions instead of enums</b></li>
    <li>Which tool checks, which tool runs — and the CI gate</li></ul>` },
  { t: 'Two worlds that never meet', body: flow([
      { t: 'label.ts', s: 'you write types', mau: '#336791' },
      { t: 'tsc', s: 'checks · types exist', mau: '#b85a2b' },
      { t: 'JavaScript', s: 'types erased', mau: '#555555' },
      { t: 'node', s: 'runs · real data', mau: '#1f7a45' },
    ], { h: 150, fs: 22 }) + two(box('Compile time', 'tsc <b>reads</b> your files. Types exist. Errors are found here. <b>Nothing runs.</b>', 'lam'),
      box('Runtime', 'Node <b>runs</b> JavaScript. Types are already gone. Real data — requests, JSON, user input — exists only here.', 'xanh')) +
    box('An everyday picture', 'A building inspector checks the <b>drawings</b> before construction. Once people live in the house, the inspector is gone — nobody checks who walks through the door.', '') },
  { t: 'Erasure, for real: what tsc emits', body: ts(L(CODE.label, 1, 15), { sm: true, hl: [1, 3, 10, 11] }) +
    tc(gon(OUT['01-emit']), { title: 'tsc 7.0.2 with noEmit: false — the emitted label.js' }) +
    box('', `Every type is gone: ${c('type Role')}, ${c('interface Booking')}, ${c(': Booking')}, ${c(': string')}. What is left is plain JavaScript.`, 'lam') },
  { t: 'What Node 22 runs: types become spaces', body: tc(L(OUT['04-strip'], 1, 16), { title: 'node:module stripTypeScriptTypes(throw.ts) — what Node actually executes', hl: [10, 11] }) +
    two(tc(pick(OUT['03-throw'], /^\$|^RangeError|at checkSeats/), { title: 'node throw.ts (stack lines kept: ours only)', wrap: 50 }), box('Same line, same column', `Node replaces each type with whitespace, so the stack trace says ${c('throw.ts:11:26')} — exactly line 11 of the file you wrote. No source map needed.`, 'xanh')) },
  { t: 'Trap 1: a type error does not stop node', body: ts(CODE.wrong, { sm: true, hl: [2] }) +
    two(tc(OUT['05-runs-tsc'], { title: 'npx tsc — the checker', wrap: 46 }), tc(OUT['06-runs-node'], { title: 'node — the runner' })) +
    box('Checking and running are two separate steps', `tsc says ${c('TS2322')}, exit 1. Node never asks tsc: it strips ${c(': number')}, runs, and prints ${c('311')} — exit 0. If nobody runs tsc, the bug ships.`, 'do2') },
  { t: 'Trap 2: a type is not a value', body: two(`<div>${ts(L(CODE.inst, 0, 8), { sm: true, hl: [4] })}${tc(OUT['07-typeval-tsc'], { title: 'npx tsc', wrap: 50 })}</div>`,
      `<div>${tc(gon(OUT['08-typeval-node'], 6), { title: 'node instanceof.ts', wrap: 44 })}${box('Fix: check values, not types', `Write a real JavaScript test — ${c('typeof x.lab === "string"')} — inside ${c('isBooking(x): x is Booking')}. That code survives erasure.`, 'xanh')}</div>`) },
  { t: 'Trap 3: as is a promise, not a check', body: ts(L(CODE.lie, 0, 8), { sm: true, hl: [6] }) +
    two(tc(OUT['10-json-tsc'], { title: 'npx tsc — no output, exit 0' }), tc(pick(OUT['11-json-lie'], /^\$|^role|^RangeError|at (needsApproval|createBooking|file)/), { title: 'node lie.ts', wrap: 56 }), 'r37') +
    box('', `<b>tsc believed you.</b> ${c('JSON.parse')} returns ${c('any')}, ${c('as')} says “trust me”. At runtime seats is "31" — the crash happens two files away.`, 'do2') },
  { t: 'Trap 4: syntax that cannot be erased', body: two(`<div>${ts(L(CODE.status, 0, 12), { sm: true, hl: [1, 7] })}${tc(OUT['13-enum-tsc'], { title: 'npx tsc (erasableSyntaxOnly)', wrap: 50 })}</div>`,
      `<div>${tc(L(OUT['14-enum-node'], 0, 12).split('\n').filter((l) => !/^node:internal|triggerUncaught|^\s+\^$/.test(l)).join('\n'), { title: 'node status.ts', wrap: 46 })}${box('So this course writes', `${c("type Status = 'PENDING' | 'CONFIRMED'")} and a normal field instead of ${c('constructor(private rows)')} — pure type information, nothing to generate.`, 'xanh')}</div>`) },
  { t: 'Which tool checks, which tool runs', body: zm(`<table class="t"><tr><th>Tool</th><th>Checks types?</th><th>Runs code?</th><th>Note</th></tr>
    <tr><td><b>tsc</b> 7.0.2</td><td class="xanh">yes</td><td>no (may emit JS)</td><td>the only gate you can put in CI</td></tr>
    <tr><td><b>node</b> 22.23.3</td><td class="do">no</td><td class="xanh">yes</td><td>strips types, then runs</td></tr>
    <tr><td><b>VS Code</b> 1.124.2</td><td class="xanh">yes, as you type</td><td>no</td><td>uses its own TypeScript 6.0.3</td></tr>
    <tr><td><b>Vitest · tsx · esbuild</b></td><td class="do">no</td><td class="xanh">yes / builds</td><td>strip types for speed</td></tr></table>`, 1.15) +
    box('The CI gate', `Run ${c('npx tsc --noEmit')} as its <b>own step</b> before tests and deploy. Every other tool in the table happily runs code that tsc would reject.`, 'lam') },
  { t: 'When surprised, ask: compile time or runtime?', body: cards([
      ['“tsc is green but it crashed”', 'Runtime. The data was not what the type promised — an <b>as</b>, a <b>JSON.parse</b>, a request body. Add a runtime check at the boundary.'],
      ['“node ran it, so it is fine”', 'Compile time was skipped. Node never checks types. Run <b>npx tsc</b>.'],
      ['“I want to check the type with if”', 'Types do not exist at runtime. Check <b>values</b>: typeof, Array.isArray, a property — or a schema (Zod, Chapter 13).'],
    ], 3) + box('One question solves most surprises', 'Nine times out of ten, “is this a compile-time thing or a runtime thing?” is already the answer.', 'xanh') },
  { t: 'Practice: predict, then run both', body: ts(CODE.predict, { sm: true, hl: [3, 5, 8] }) +
    two(tc(OUT['16-practice-tsc'], { title: 'npx tsc', wrap: 50 }), tc(pick(OUT['17-practice-node'], /^\$|^half|^TypeError|at file/), { title: 'node predict.ts', wrap: 50 })) +
    box('Answer', 'Line 3: tsc only (node prints “student”). Line 5: neither — but minutes is the string "90" at runtime. Line 8: node only — the double <b>as</b> silenced tsc.', 'lam') },
]);
