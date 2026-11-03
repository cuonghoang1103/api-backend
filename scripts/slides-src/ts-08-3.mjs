/**
 * ts-08-3 — TypeScript · Chapter 8 · Lesson 8.3 "Record" (04/11/2026). Slug: typescript-8-3-record.
 * Mọi mã/output lấy từ content/courses/typescript/s08/_ma-ts-08-3.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s08/_ma-ts-08-3.mjs';

export const deck = { key: 'ts-08-3', code: 'TS 8.3', title: 'Record', sub: 'a table with an entry per key' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 8 — Utility types', bai: '8.3' }, [
  { cover: true, t: 'Record', sub: 'Chapter 8 · Lesson 8.3 — a table with an entry for every key' },
  { t: 'A table that must be complete', body: ts(pick(CODE.recordSeats, 0, 5), { sm: true, hl: [3] }) + tc(OUT['11-record'], { title: 'node' }) +
    box('Closed mode: a union of keys', `${c('Record<LabCode, number>')} demands an entry for every lab, and reading a known code is a plain ${c('number')}. The closed table of 4.4/5.4, named.`, 'xanh') },
  { t: 'Leave one out and it is an error', body: ts(pick(CODE.recordmissSeats, 0, 5), { sm: true, hl: [3] }) + tc(OUT['12-record-miss'], { wrap: 74 }) +
    box('TS2741', `The table must cover every key in the union — the same safety as the exhaustive ${c('switch')} in 5.4, from the data side. A label or translation table cannot forget a case.`, 'lam') },
  { t: 'The open mode: string keys', body: ts(pick(CODE.openCache, 0, 5), { sm: true, hl: [4] }) + tc(OUT['13-open'], { title: 'node' }) +
    box('A lookup may be missing', `${c('Record<string, number>')} has open keys, so under ${c('noUncheckedIndexedAccess')} a lookup is ${c('number | undefined')} — honest. Guard with ${c('??')}.`, 'lam') },
  { t: 'The open mode refuses an unchecked read', body: ts(pick(CODE.openbadCache, 0, 6), { sm: true, hl: [4] }) + tc(OUT['14-open-bad'], { wrap: 72 }) +
    box('TS2322', `${c('number | undefined')} is not a ${c('number')}. The completeness a closed ${c('Record')} gives for free, you earn with a guard here.`, 'do2') },
  { t: 'Closed or open, choose on purpose', body: cards([
      [c('Record<Union, V>'), 'A complete table the compiler checks — one entry per key.'],
      [c('Record<string, V>'), 'An open dictionary; any key, so every read may miss.'],
      ['missing key (union)', 'TS2741 — you forgot a case, caught at compile time.'],
      ['unchecked read (string)', 'TS2322 — the value is V | undefined, guard it.'],
      ['a mapped type', 'Record<K, V> is { [P in K]: V } from 7.1, named.'],
      ['Next · 8.4', 'Exclude & NonNullable filter a union; ReturnType, Parameters & Awaited read types from code.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A plain-object label map forgot ${c('CANCELLED')} and prints the raw code at run time. Make it ${c('Record<Status, string>')} so the missing label is a compile error.`, 'xanh'),
      box('Remember', `Over a union the table must be complete (TS2741); over ${c('string')} a read is ${c('V | undefined')} (TS2322). Reach for the union form when keys are known.`, 'lam')) +
    box('Next · 8.4 — Exclude, NonNullable, ReturnType & Awaited', `Filter a union; read types out of functions.`, '') },
]);
