/**
 * ts-08-2 — TypeScript · Chapter 8 · Lesson 8.2 "Pick & Omit" (04/11/2026). Slug: typescript-8-2-pick-omit.
 * Mọi mã/output lấy từ content/courses/typescript/s08/_ma-ts-08-2.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s08/_ma-ts-08-2.mjs';

export const deck = { key: 'ts-08-2', code: 'TS 8.2', title: 'Pick & Omit', sub: 'shape one type into a DTO' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 8 — Utility types', bai: '8.2' }, [
  { cover: true, t: 'Pick &amp; Omit', sub: 'Chapter 8 · Lesson 8.2 — shape one type into a DTO' },
  { t: 'Omit: a type minus some keys', body: ts(pick(CODE.omitCreate, 0, 7), { sm: true, hl: [6] }) + tc(OUT['11-omit'], { title: 'node' }) +
    box('A create DTO', `${c("Omit<Booking, 'id' | 'status' | 'createdAt'>")} is the resource minus the fields the server sets. Add a field to ${c('Booking')} and it gains it — it cannot drift.`, 'xanh') },
  { t: 'Omit refuses the fields it removed', body: ts(pick(CODE.omitbadCreate, 0, 9), { sm: true, hl: [7] }) + tc(OUT['12-omit-bad'], { wrap: 74 }) +
    box('A boundary, not a doc', `Because ${c('Omit')} removed ${c('id')}, a client literal carrying ${c('id')} is <b>TS2353</b>. The server owns that field, and the type enforces it.`, 'lam') },
  { t: 'Pick: a type with only some keys', body: ts(pick(CODE.pickPublic, 0, 9), { sm: true, hl: [3] }) + tc(OUT['13-pick'], { title: 'node' }) +
    box('The positive form', `${c("Pick<User, 'id' | 'name'>")} keeps only the safe keys — email, hash and role are not in the type at all. ${c('Pick')} lists what stays; ${c('Omit')} lists what goes.`, 'xanh') },
  { t: 'Omit stops a leak at compile time', body: ts(pick(CODE.leakPublic, 0, 9), { sm: true, hl: [6] }) + tc(OUT['14-leak'], { wrap: 72 }) +
    box('TS2339 · the strongest place', `${c("Omit<User, 'passwordHash'>")} removes the field, so reading ${c('u.passwordHash')} cannot compile. A leak stops being a review note and becomes a compile error.`, 'do2') },
  { t: 'Pick and Omit only accept real keys', body: ts(pick(CODE.pickkeyK, 0, 5), { sm: true, hl: [3] }) + tc(OUT['15-pickkey'], { wrap: 72 }) +
    box('TS2344 · Did you mean?', `Both check their key list against ${c('keyof')} the source. ${c('Omit')} is ${c('Pick<T, Exclude<keyof T, K>>')} — why Lab 8 rebuilds it in one line.`, 'lam') },
  { t: 'Pick or Omit, when', body: cards([
      [c('Omit<T, K>'), 'Most fields stay, remove a few — a create body.'],
      [c('Pick<T, K>'), 'A few stay, remove many — a small summary.'],
      [c("Omit<User, 'passwordHash'>"), 'A leak becomes TS2339.'],
      ['real keys only', 'A typo is TS2344, with a suggestion.'],
      ['derive from the model', 'Both track it — no drift.'],
      ['Next · 8.3', 'Record — a complete table.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A hand-written ${c('CreateNote')} still carries ${c('createdAt')} (TS2739). Derive it with ${c("Omit<Note, 'id' | 'createdAt'>")}.`, 'xanh'),
      box('Remember', `${c('Omit')} keeps everything except ${c('K')}; ${c('Pick')} keeps only ${c('K')}. Both accept real keys only and derive from the model.`, 'lam')) +
    box('Next · 8.3 — Record', `A table with an entry for every key.`, '') },
]);
