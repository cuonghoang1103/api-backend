/**
 * ts-02-1 — TypeScript · Chapter 2 · Lesson 2.1 "Primitives, annotations & strict null checks" (01/11/2026). Slug: typescript-2-1-primitive.
 * Mọi mã/output lấy từ content/courses/typescript/s02/_ma-ts-02-1.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s02/_ma-ts-02-1.mjs';

export const deck = { key: 'ts-02-1', code: 'TS 2.1', title: 'Primitives, annotations & strict null checks', sub: 'null, undefined and the crash everyone knows' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const OR_TEST = L(OUT['20-or-test']).filter((l) => /^\$|^✔|^✖ (a|an) |^ℹ (pass|fail)|!==/.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');
const FIX = L(CODE.fix).slice(21).filter((l) => !/^\/\/ /.test(l)).join('\n').replace(/\n\n+/g, '\n');
const LOOSE_STRICT = OUT['16-loose'] + '\n[exit 0]\n' + OUT['16-strict'].split('\n').filter((l) => !/^\s+Type 'null'/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 2 — The basic type system', bai: '2.1' }, [
  { cover: true, t: 'Primitives, annotations<br>&amp; strict null checks', sub: 'Chapter 2 · Lesson 2.1 — one day of LabFlow’s schedule, with NULLs in it' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Chapter 2 goal: model LabFlow’s lab schedule with exact types and pass <b>Lab 2</b> under strict</li>
    <li>The <b>seven primitives</b> — and what ${c('typeof')} really says at runtime</li>
    <li>${c('string')} vs ${c('String')}, and three number facts no type can change</li>
    <li>${c('null')} vs ${c('undefined')}: ${c('note: string | null')} and ${c('cancelledAt?: string')}</li>
    <li>The same file with ${c('strictNullChecks')} off (0 errors) and on (4 errors)</li>
    <li>Three fixes — check, ${c('?.')}, ${c('??')} — and the ${c('||')} trap only tests catch</li></ul>` },
  { t: 'The seven primitives, and typeof', body: two(ts(pick(CODE.typeofTs, 1, 8), { sm: true }), tc(OUT['11-typeof'], { title: 'terminal — Node 22.23.3' }), 'r64') +
    box('typeof knows only a few words', `${c('typeof null')} is ${c('"object"')} — a bug kept since the first JavaScript. Arrays and objects are all ${c('"object"')}. tsc’s types are far richer, but they are erased before Node runs.`, 'do2') },
  { t: 'Annotations, and why string is lower case', body: ts(pick(CODE.wrapper, 1, 7), { hl: [2, 3] }) + tc(L(OUT['13-wrapper-tsc']).slice(0, 3).join('\n') + '\n…', { wrap: 80 }) +
    two(tc(OUT['13-wrapper-run'], { title: 'node wrapper.ts' }), box('Always lower case', `${c('String')} is a wrapper <b>object</b>; two of them are never ${c('===')}. Write ${c('string')}, ${c('number')}, ${c('boolean')}.`, 'lam')) },
  { t: 'Three number facts no type can change', body: ts(pick(CODE.facts, 1, 9), { sm: true }) + tc(OUT['14-facts-run'], { title: 'tsc: 0 errors · node facts.ts', wrap: 90 }) +
    box('Types say what, not how precise', `Money in whole units (đồng, cents). Big ids as ${c('bigint')} or ${c('string')} — never through ${c('Number()')}; send them as strings in JSON.`, 'lam') },
  { t: 'null vs undefined in LabFlow', body: ts(pick(CODE.schedule, 1, 10), { hl: [7, 8] }) +
    two(tc(OUT['12-json'], { title: 'node json.ts' }), box('Two kinds of “nothing”', `${c('| null')}: the key is there, the value is empty (a NULL column). ${c('?:')}: the key may be absent. ${c('null')} survives JSON; an ${c('undefined')} key vanishes.`, 'lam')) },
  { t: 'An optional key is not “| undefined”', body: ts(pick(CODE.optional, 1, 9), { sm: true, hl: [5, 7] }) + tc(OUT['19-optional'], { wrap: 92 }) +
    box('Rule of thumb', `${c('?:')} for “may be absent”, ${c('| null')} for “present but empty” — mirror what the database and the API really send.`, 'xanh') },
  { t: 'Same file: strict off, then strict on', body: ts(pick(CODE.schedule, 21, 36).replace(/\n\n/g, '\n'), { sm: true }) + tc(LOOSE_STRICT, { title: 'loose.json (strictNullChecks: false) · then the course tsconfig', wrap: 96 }) },
  { t: 'What Node does with the real rows', body: tc(OUT['17-run-all'], { title: 'node run-all.ts — the unchecked version', wrap: 100 }) +
    zm(`<table class="t"><tr><th>Line</th><th>tsc (strict)</th><th>Node</th></tr>
    <tr><td>${c('e.note.toUpperCase()')}</td><td>TS18047</td><td>crash on entry 2</td></tr>
    <tr><td>${c('e.cancelledAt.slice(0, 10)')}</td><td>TS18048</td><td>crash on entry 1</td></tr>
    <tr><td>${c('findEntry(…).bookedBy')}</td><td>TS2532</td><td>crash on id 9</td></tr>
    <tr><td>${c('return e.note')}</td><td>TS2322</td><td><b>null</b>, no error</td></tr></table>`, 0.95) },
  { t: 'Three fixes: check first, ?. and ??', body: ts(FIX, { sm: true }) +
    two(tc(OUT['18-fix-run'], { title: 'tsc: 0 errors · node run-all.ts' }), box('No ! needed', `After ${c('=== null')} tsc <b>narrows</b> the type. ${c('?.')} stops at null/undefined. ${c('??')} supplies a default only for null/undefined.`, 'xanh')) },
  { t: 'Trap: || instead of ?? compiles — and is wrong', body: two(`<div>${ts(pick(CODE.orLab, 4, 11), { sm: true, hl: [2, 6] })}${tc(OUT['20-or-tsc'] + '\n[exit 0]', { title: 'tsc: no errors' })}</div>`,
      tc(OR_TEST, { title: 'node --test', wrap: 56 })) +
    box('|| replaces every falsy value', `${c('0')}, ${c("''")}, ${c('false')}, ${c('NaN')}, ${c('null')}, ${c('undefined')}. A closed lab (0 seats) got 40. ${c('??')} replaces only null/undefined — and only a boundary test noticed.`, 'do2') },
  { t: 'Five codes for “maybe missing”', body: cards([
      ['TS18047', `${c("'x' is possibly 'null'")}`],
      ['TS18048', `${c("'x' is possibly 'undefined'")}`],
      ['TS2532', `${c("Object is possibly 'undefined'")} — e.g. a call result`],
      ['TS2322', `${c("'string | null'")} where ${c('string')} is required`],
      ['TS2741', 'a required key is missing (it is not optional)'],
      ['Next', 'Lesson 2.2: arrays, tuples and <b>readonly</b> for the schedule'],
    ], 3) },
]);
