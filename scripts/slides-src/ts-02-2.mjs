/**
 * ts-02-2 — TypeScript · Chapter 2 · Lesson 2.2 "Arrays, tuples & readonly" (01/11/2026). Slug: typescript-2-2-mang-tuple.
 * Mọi mã/output lấy từ content/courses/typescript/s02/_ma-ts-02-2.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2, demo2/ts-02-2).
 */
import { lamDeck, ts, tc, two, box, cards, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s02/_ma-ts-02-2.mjs';

export const deck = { key: 'ts-02-2', code: 'TS 2.2', title: 'Arrays, tuples & readonly', sub: 'Who may change this list — and how long is a pair?' };

const L = (s) => s.split('\n');
const drop = (s, re) => L(s).filter((l) => !re.test(l)).join('\n').replace(/^\n+|\n+$/g, '');
const MUTATE = drop(CODE.mutate, /^\/\/|^import/);
const READONLY = drop(CODE.readonly, /^\/\/|^import|console\.log/);
const FIXED = L(CODE.fixed).slice(3, 10).join('\n');
const DIRECTION = drop(CODE.direction, /^\/\/|^import/);
const ERASED = drop(CODE.erased, /^\/\/ readonly lives|^\/\/ Object\.freeze/);
const noCmt = (s) => L(s).map((l) => l.replace(/\s{2,}\/\/.*$/, '')).join('\n');
const IDX = L(OUT['25-index']);
const INDEX_ERR = [IDX[0], IDX[5], IDX[6]].join('\n');
const WRONG = L(OUT['21-tuple-wrong']);
const JAVA = L(OUT['40-java']).slice(0, 3).join('\n') + '\n…';

export const slides = lamDeck({ chuong: 'Chapter 2 — The basic type system', bai: '2.2' }, [
  { cover: true, t: 'Arrays, tuples<br>&amp; readonly', sub: 'Chapter 2 · Lesson 2.2 — the LabFlow schedule: who may change it, and what a time range is' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>${c('T[]')} and ${c('Array<T>')}: the same type, two spellings</li>
    <li>A real bug: a helper that <b>reorders the caller’s array</b></li>
    <li>${c('readonly T[]')}: tsc refuses ${c('sort')} / ${c('push')} — use ${c('toSorted')}, spread</li>
    <li>readonly is erased at runtime — vs ${c('Object.freeze')} and Java’s ${c('List.of')}</li>
    <li>Tuples: ${c('readonly [start: number, end: number]')} — the ${c('TimeRange')} of Lab 2</li>
    <li>Array, tuple or object: how to choose</li></ul>` },
  { t: 'The bug: a helper reorders someone else’s array', body: ts(MUTATE, { sm: true, hl: [2] }) +
    two(tc(OUT['12-mutate-run'], { title: 'terminal — Node 22.23.3 (tsc: 0 errors)' }),
      box('sort() works in place', `It reorders the array it was given and returns <b>the same array</b>. The page and the timeline share it, so “latest booking” is now wrong — silently.`, 'do2')) },
  { t: 'readonly: the promise goes into the type', body: ts(READONLY, { hl: [2, 6] }) + tc(OUT['13-readonly'], { wrap: 96 }) +
    box('readonly T[] = the array minus every method that changes it', `${c('sort')}, ${c('push')}, ${c('splice')}, ${c('reverse')}, ${c('list[0] = …')} are gone (TS2339). ${c('map')}, ${c('filter')}, ${c('at')} stay.`, 'lam') },
  { t: 'Return a new array instead', body: ts(FIXED, { sm: true, hl: [2, 6] }) + tc(OUT['14-fixed-run']) +
    zm(`<table class="t"><tr><th>Changes the array</th><th>Returns a new one</th></tr>
    <tr><td>${c('a.sort(cmp)')} · ${c('a.reverse()')}</td><td>${c('a.toSorted(cmp)')} · ${c('a.toReversed()')} <i>(ES2023)</i></td></tr>
    <tr><td>${c('a[i] = x')} · ${c('a.push(x)')}</td><td>${c('a.with(i, x)')} · ${c('[...a, x]')}</td></tr></table>`, 1.0) },
  { t: 'Which way assignment goes', body: ts(DIRECTION, { hl: [7, 8] }) + tc(OUT['15-direction'], { wrap: 96 }) +
    two(box('Mutable → readonly: always fine', 'A function that only reads can take any array — mine included.', 'xanh'),
      box('Readonly → mutable: TS4104', `${c('shuffle')} might change it, which would break someone else’s promise. Rule: <b>a parameter you only read is readonly</b>.`, 'do2')) },
  { t: 'readonly is erased at runtime', body: ts(noCmt(ERASED), { sm: true, hl: [3, 8] }) + tc(OUT['16-runtime']) +
    two(tc(JAVA, { title: 'terminal — java 21 (PRO192)', wrap: 50 }), zm(`<table class="t"><tr><th>Lock</th><th>Checked</th></tr>
    <tr><td>${c('readonly T[]')}</td><td>compile time (tsc)</td></tr>
    <tr><td>${c('Object.freeze')}</td><td>runtime: TypeError</td></tr>
    <tr><td>Java ${c('List.of')}</td><td>runtime: exception</td></tr></table>`, 0.95)) },
  { t: 'Tuples: a fixed length, a meaning per position', body: ts(drop(CODE.range, /^\/\/ A time/), { hl: [3, 10] }) + tc(OUT['20-range-run']) +
    two(box('Labelled tuple', `${c('[start: number, end: number]')} — exactly two numbers; the labels show up in the editor.`, 'lam'),
      box('Destructure by position', `${c('const [start, end] = toRange(…)')} reads naturally because the positions have names.`, 'xanh')) },
  { t: 'What tsc refuses for a tuple', body: ts(drop(CODE.wrong, /^import/), { sm: true, hl: [1, 2, 3, 6] }) +
    tc(WRONG.join('\n'), { wrap: 100 }) + box('Line 8: an array literal is NOT a tuple', `${c('[480, 600]')} is inferred as ${c('number[]')} (widening, lesson 1.3). Annotate where you create it, or return it from a function typed ${c('TimeRange')}.`, 'do2') },
  { t: 'Trap: a plain tuple still has push', body: two(`<div>${ts(noCmt(drop(CODE.hole, /^\/\//)), { sm: true, hl: [4] })}${tc(OUT['22-hole-tsc'] + '\n' + OUT['23-hole-run'])}</div>`,
    `<div>${ts(noCmt(drop(CODE.holeFixed, /^\/\//)), { sm: true, hl: [1] })}${tc(OUT['24-hole-fixed'], { wrap: 56 })}</div>`) +
    box('Make tuples readonly', `tsc checks the length when you create or assign a tuple — but ${c('push')} afterwards is allowed unless the tuple is ${c('readonly')} (then TS2339, and TS2540 for ${c('r[0] = …')}).`, 'do2') },
  { t: 'Tuple vs array under noUncheckedIndexedAccess', body: ts(drop(CODE.index, /^\/\//), { hl: [7] }) + tc(INDEX_ERR, { wrap: 96 }) +
    two(box('Tuple: the position is known', `${c('range[0]')} is a plain ${c('number')} — no ${c('?? 0')} needed.`, 'xanh'),
      box('Array: it might be empty', `${c('starts[0]')} is ${c('number | undefined')}. ${c('Object.entries')} gives ${c('[string, number][]')} — tuples again.`, 'lam')) },
  { t: 'Array, tuple or object?', body: cards([
      [c('T[]'), 'Many values of one kind, any count — the bookings you collect'],
      [c('readonly T[]'), 'A list you only read: parameters, shared data'],
      [c('readonly [a, b]'), 'A small fixed group, each position one meaning: TimeRange'],
      ['object', 'More fields, or positions nobody would guess (Chapter 4)'],
      ['Test for a tuple', `Would a teammate know what ${c('r[1]')} is without looking it up?`],
      ['Next', 'Lesson 2.3: unknown, never, void — and Lab 2 uses TimeRange'],
    ], 3) },
]);
