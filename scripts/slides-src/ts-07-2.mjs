/**
 * ts-07-2 — TypeScript · Chapter 7 · Lesson 7.2 "Mapping modifiers" (03/11/2026). Slug: typescript-7-2-mapping-modifiers.
 * Mọi mã/output lấy từ content/courses/typescript/s07/_ma-ts-07-2.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s07/_ma-ts-07-2.mjs';

export const deck = { key: 'ts-07-2', code: 'TS 7.2', title: 'Mapping modifiers', sub: 'add & remove ? and readonly' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 7 — Advanced types', bai: '7.2' }, [
  { cover: true, t: 'Mapping modifiers:<br>add &amp; remove ? and readonly', sub: 'Chapter 7 · Lesson 7.2 — Partial, Required, Mutable' },
  { t: 'Add ?: Partial<T> — a PATCH body', body: ts(pick(CODE.partialPatch, 2, 9), { sm: true, hl: [2] }) + tc(OUT['11-partial'], { title: 'node' }) +
    box('Every field optional', `${c('{ [K in keyof T]?: T[K] }')} adds the optional modifier, so a ${c('Patch<Booking>')} may carry any subset — exactly an HTTP PATCH. This is ${c('Partial<T>')}.`, 'xanh') },
  { t: 'Remove ?: Required<T>', body: ts(pick(CODE.requiredComplete, 2, 7), { sm: true, hl: [2, 5] }) + tc(OUT['12-required'], { wrap: 80 }) +
    box('-? makes every field required', `${c('Complete<Draft>')} makes ${c('body')} and ${c('tags')} required, so a value with only ${c('title')} is <b>TS2739</b>. The plain ${c('Draft')} accepted it.`, 'lam') },
  { t: 'Remove readonly: a mutable copy', body: ts(pick(CODE.mutableThaw, 2, 11), { sm: true, hl: [2, 8] }) + tc(OUT['13-mutable'], { title: 'node' }) +
    box('-readonly strips read-only', `A ${c('Mutable<Lab>')} can be reassigned where the original could not. No built-in ${c('Mutable')}, but it is one line — handy for a builder.`, 'lam') },
  { t: 'Both at once', body: ts(pick(CODE.bothSnap, 2, 8), { sm: true, hl: [2] }) + tc(OUT['14-both'], { title: 'node' }) +
    box('Modifiers combine', `${c('{ readonly [K in keyof T]?: T[K] }')} is read-only AND optional. ${c('+?')} / ${c('+readonly')} mean "add" (the default) — you write ${c('+')} only to be explicit.`, 'xanh') },
  { t: 'Which modifier, when', body: cards([
      [c('[K in keyof T]?'), 'Add optional — Partial<T>, a PATCH body.'],
      [c('[K in keyof T]-?'), 'Remove optional — Required<T>; missing is TS2739.'],
      [c('readonly [K in keyof T]'), 'Add read-only — Readonly<T>.'],
      [c('-readonly [K in keyof T]'), 'Remove read-only — Mutable (no built-in).'],
      ['In LabFlow', 'Patch<BookingRecord> = update; Readonly = snapshot.'],
      ['Next · 7.3', 'Conditional types & infer.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `${c('updateUser')} demands all three fields (TS2739). Change the ${c('changes')} parameter to a mapped ${c('Patch<User>')} so any subset is accepted.`, 'xanh'),
      box('Remember', `${c('?')} is optional (${c('+?')} add, ${c('-?')} remove); ${c('readonly')} with ${c('-readonly')} to remove. Modifiers combine.`, 'lam')) +
    box('Next · 7.3 — Conditional types & infer', `${c('T extends U ? X : Y')} and pulling a type out with ${c('infer')}.`, '') },
]);
