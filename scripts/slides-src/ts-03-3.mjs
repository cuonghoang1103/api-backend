/**
 * ts-03-3 — TypeScript · Chapter 3 · Lesson 3.3 "Overloads & the void-return subtlety" (01/11/2026). Slug: typescript-3-3-overload-void.
 * Mọi mã/output lấy từ content/courses/typescript/s03/_ma-ts-03-3.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s03/_ma-ts-03-3.mjs';

export const deck = { key: 'ts-03-3', code: 'TS 3.3', title: 'Overloads & the void-return subtlety', sub: 'one function, several shapes — and a slot that ignores you' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const strip = (s) => L(s).filter((l) => !/^\s*\/\/|^$/.test(l)).join('\n');
const noTail = (s) => L(s).map((l) => l.replace(/\s+\/\/.*$/, '')).join('\n');
const bo = (s) => L(s).filter((l) => !/^\s+at (ModuleJob|async onImport|async asyncRunEntryPoint)/.test(l)).join('\n');

const OV = noTail(strip(CODE.ovMinutes));
const ASYNC = [pick(CODE.asyncSave, 7, 11), noTail(pick(CODE.asyncSave, 12, 15))].join('\n');
const ASYNC_RUN = L(bo(OUT['22-async-run'])).filter((l) => !/^\s+\^|^\s+throw |^\s+at |^file:/.test(l) && l.trim() !== '').join('\n');
const LOOSE_RUN = L(bo(OUT['18-loose-run'])).filter((l) => /^\$|^TypeError|^exit code/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 3 — Functions', bai: '3.3' }, [
  { cover: true, t: 'Overloads &amp; the<br>void-return subtlety', sub: 'Chapter 3 · Lesson 3.3 — one function, several typed shapes; a callback slot that ignores your result' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why a <b>union return</b> (${c('number | number[]')}) pushes work onto every caller</li>
    <li><b>Overload signatures</b> vs the hidden <b>implementation signature</b></li>
    <li>Read <b>TS2769</b> “No overload matches this call” — and why order matters</li>
    <li>The trap: an overload that <b>promises more</b> than the body keeps</li>
    <li>Union, overloads or generic — one question decides</li>
    <li>${c('=> void')}: “I ignore your result” — and the <b>async</b> function that crashes Node</li></ul>` },
  { t: 'One helper, two call shapes', body: ts(noTail(strip(CODE.unionMinutes)), { sm: true, hl: [2] }) + ts(strip(CODE.unionUse), { sm: true, hl: [2, 3] }) +
    tc(OUT['11-union-tsc'], { title: 'terminal — tsc 7.0.2', wrap: 100 }) +
    box('Correct code, vague type', `The caller who passed ${c("'08:00'")} knows the answer is a number — the type says “maybe a list”. Every caller now needs a check or a cast.`, 'do2') },
  { t: 'Overloads: two signatures, one implementation', body: ts(OV, { sm: true, hl: [2, 3] }) + ts(noTail(strip(CODE.ovUse)), { sm: true, hl: [2, 3] }) + two(tc(OUT['12-overload'], { title: 'terminal — tsc + node', wrap: 60 }),
      box('How a call is matched', `Overloads are tried <b>top to bottom</b>; the first that fits decides the return type. The signature with the body must cover all of them.`, 'lam')) },
  { t: 'Callers see only the overloads', body: tc(OUT['15-dts'], { title: 'the .d.ts tsc writes for minutes.ts — what other modules see', wrap: 100 }) +
    two(box('The implementation signature is gone', `${c('(x: string | readonly string[])')} is not in the declaration file — it is not callable from outside.`, 'lam'),
      box('So a union argument fits nothing', `${c('toMinutes(fromCsv)')} with ${c('string | string[]')} matches neither overload: narrow first, or add a third overload.`, 'do2')) +
    box('Try it on any library', `${c('declaration')} + ${c('emitDeclarationOnly')} show exactly what callers get — the same view your editor uses for ${c('document.querySelector')} or Express’s ${c('app.get')}, which are overloaded too.`, 'xanh') },
  { t: 'Reading TS2769', body: ts(strip(CODE.ovWrong), { sm: true, hl: [2, 3, 5] }) + tc(OUT['14-wrong-tsc'], { title: 'terminal — tsc 7.0.2', wrap: 100 }) +
    box('“The last overload gave the following error”', 'tsc tried every overload and shows only why the <b>last</b> one failed. The fix may concern any of them.', 'lam') },
  { t: 'Order matters: the first match wins', body: ts(noTail(strip(CODE.order)), { sm: true, hl: [2] }) + tc(OUT['16-order-tsc'], { title: 'terminal — tsc 7.0.2', wrap: 100 }) +
    box('Rule', `Most specific overload first, broadest last. Here ${c("'08:00'")} matched the broad line and never reached ${c('(text: string): number')}.`, 'xanh') },
  { t: 'Trap: an overload that promises too much', body: ts(noTail(strip(CODE.loose)), { sm: true, hl: [2, 4, 5] }) +
    two(tc(OUT['17-loose-tsc'] + '\n' + LOOSE_RUN, { title: 'terminal — tsc, then node', wrap: 56 }),
      box('Loosely checked', `Each overload only has to be <b>compatible</b> with the implementation signature. Overload 1 says ${c('number')}; the body returns ${c('undefined')}. Write ${c('number | undefined')} — the overload is a promise you review by hand.`, 'do2')) },
  { t: 'Overload, union or generic?', body: zm(`<table class="t"><tr><th>Does the return type depend on the argument?</th><th>Write</th></tr>
    <tr><td>No — always ${c('string')}</td><td>a <b>union parameter</b>: ${c('rangeLabel(r: TimeRange | string): string')}</td></tr>
    <tr><td>Yes — a few fixed cases</td><td><b>overloads</b>: ${c('toMinutes')} (string ⇒ number, list ⇒ number[])</td></tr>
    <tr><td>Yes — “give back what you got”</td><td>a <b>generic</b> (Chapter 6): ${c('first<T>(list: readonly T[])')}</td></tr></table>`, 1.08) +
    tc(OUT['19-alt'], { title: 'terminal — the union version, no overloads', wrap: 100 }) },
  { t: 'void: “I will ignore what you return”', body: ts(pick(CODE.voidUse, 6, 16), { sm: true, hl: [2, 4, 7] }) + tc(OUT['20-void-tsc'], { title: 'terminal — tsc 7.0.2', wrap: 100 }) +
    two(box('Function TYPE … => void', `A promise by the <b>caller</b>: “I won’t use your result”. ${c('log.push')} returns a number — accepted.`, 'xanh'),
      box('Function DECLARED : void', `A promise by the <b>function</b>: “I return nothing”. ${c('return p.code')} there is TS2322.`, 'lam')) },
  { t: 'Trap: an async function in a void slot', body: ts(ASYNC, { sm: true, hl: [5, 6] }) +
    two(tc(OUT['21-async-tsc'] + '\n' + ASYNC_RUN, { title: 'terminal — tsc, then node', wrap: 56 }), tc(OUT['23-foreach-run'], { title: 'forEach(async …) waits for nothing', wrap: 52 }), 'r64') +
    box('', '<b>tsc 0 errors, Node exit code 1:</b> nobody awaits the promise, and since Node 15 an unhandled rejection ends the process.', 'do2') },
  { t: 'The fix — and how to type the slot', body: tc(OUT['24-fix'], { title: 'terminal — for…of + await, inside try/catch', wrap: 100 }) +
    cards([
      ['=> void', '“tell me, I don’t need an answer”: log, notify, events'],
      ['=> Problem | null', '“I need the answer”: a rule, a mapper'],
      ['=> Promise&lt;void&gt; + await', '“I will wait for you”: save, send — failures reach catch'],
    ], 3) + box('Lint it', `${c('@typescript-eslint/no-misused-promises')} flags a promise-returning function passed where void is expected.`, 'lam') },
]);
