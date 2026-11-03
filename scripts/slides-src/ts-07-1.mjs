/**
 * ts-07-1 — TypeScript · Chapter 7 · Lesson 7.1 "Mapped types" (03/11/2026). Slug: typescript-7-1-mapped-types.
 * Mọi mã/output lấy từ content/courses/typescript/s07/_ma-ts-07-1.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s07/_ma-ts-07-1.mjs';

export const deck = { key: 'ts-07-1', code: 'TS 7.1', title: 'Mapped types', sub: 'build a type from every key of another' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 7 — Advanced types', bai: '7.1' }, [
  { cover: true, t: 'Mapped types', sub: 'Chapter 7 · Lesson 7.1 — a type derived from every key of another' },
  { t: 'What you will take away from this chapter', to: true, giua: true, body: `<ul>
    <li>Types computed from other types — behind ${c('Partial')}, ${c('Readonly')}, ${c('Record')}, ${c('ReturnType')}</li>
    <li><b>Mapped types</b>: ${c('{ [K in keyof T]: … }')} — build a shape from a shape (this lesson)</li>
    <li>Add/remove ${c('?')} and ${c('readonly')} with modifiers (7.2)</li>
    <li><b>Conditional types</b> and ${c('infer')} (7.3); <b>template literal</b> string types (7.4)</li>
    <li>Pass <b>Lab 7</b>: a typed event system where all three meet</li></ul>` },
  { t: 'The problem: two types that must agree, by hand', body: ts(pick(CODE.driftForm, 0, 7), { sm: true, hl: [5] }) + tc('$ npx tsc -p demo7/ts-07-1/drift\n[clean — 0 errors]', { title: 'LabForm is already wrong' }) +
    box('0 errors, and it drifted', `${c('LabForm')} is a separate type with no link to ${c('Lab')} — it is missing ${c('floor')} and tsc cannot tell. The same drift that broke the seed in 5.4.`, 'do2') },
  { t: 'The fix: map every key', body: ts(pick(CODE.stringifyForm, 2, 7), { sm: true, hl: [2, 3] }) + tc(OUT['12-stringify'], { title: 'node' }) +
    two(box('Derived, never drifts', `${c('[K in keyof T]')} = "for every key K of T". ${c('Stringify<Lab>')} is computed from ${c('Lab')} — add a field and the form gains it automatically.`, 'xanh'),
      box('keyof + indexed access, reused', `The same ${c('keyof')} and ${c('T[K]')} of 6.2, now used to <b>build</b> a type instead of read one.`, 'lam')) },
  { t: 'Readonly<T>, written out', body: ts(pick(CODE.frozen, 2, 9), { sm: true, hl: [2] }) + tc(OUT['13-frozen'], { wrap: 72 }) +
    box('readonly on the mapped key', `Every field becomes read-only — reassigning is <b>TS2540</b>. This IS the built-in ${c('Readonly<T>')}; seeing it as a mapped type is how you understand the utility types.`, 'lam') },
  { t: 'Record is a mapped type too', body: ts(pick(CODE.recordSeats, 2, 7), { sm: true, hl: [2] }) + tc(OUT['14-record'], { title: 'node' }) +
    box('Map over a union of keys', `${c('{ [K in LabCode]: number }')} is one entry per lab — exactly ${c('Record<LabCode, number>')} from 4.4. Same tool, a union instead of ${c('keyof T')}.`, 'lam') },
  { t: 'Transforming the value, not just the key', body: ts(pick(CODE.valuemapGetters, 2, 9), { sm: true, hl: [2] }) + tc(OUT['15-valuemap'], { title: 'node' }) +
    box('The value side is a type expression', `${c('{ [K in keyof T]: () => T[K] }')} makes every field a function returning it — how a library turns a shape into getters or React props. 7.4 renames the keys too.`, 'xanh') },
  { t: 'Which mapped type, when', body: cards([
      [c('{ [K in keyof T]: T[K] }'), 'Copies T — the template to edit.'],
      [c('{ [K in keyof T]: string }'), 'Every field a string — a form.'],
      [c('{ readonly [K in keyof T]: T[K] }'), 'Readonly<T>.'],
      [c('{ [K in Union]: V }'), 'Record<Union, V> — one entry per key.'],
      [c('{ [K in keyof T]: () => T[K] }'), 'Transforms the value type.'],
      ['Next · 7.2', 'Add and remove ? and readonly.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A hand-written ${c('BookingView')} has drifted (missing ${c('seats')}). Replace it with ${c('Stringify<Booking>')} so it is derived and can never drift.`, 'xanh'),
      box('Remember', `A mapped type builds a shape from a shape and stays in sync; ${c('Readonly')} and ${c('Record')} are the same tool with a modifier or a union.`, 'lam')) +
    box('Next · 7.2 — Mapping modifiers', `Add and remove ${c('?')} and ${c('readonly')}: Partial, Required, Mutable.`, '') },
]);
