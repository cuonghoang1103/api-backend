/**
 * ts-06-2 — TypeScript · Chapter 6 · Lesson 6.2 "Constraints, keyof & indexed access" (03/11/2026). Slug: typescript-6-2-constraints-keyof.
 * Mọi mã/output lấy từ content/courses/typescript/s06/_ma-ts-06-2.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s06/_ma-ts-06-2.mjs';

export const deck = { key: 'ts-06-2', code: 'TS 6.2', title: 'Constraints & keyof', sub: 'extends, keyof, indexed access' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 6 — Generics', bai: '6.2' }, [
  { cover: true, t: 'Constraints, keyof<br>&amp; indexed access', sub: 'Chapter 6 · Lesson 6.2 — let T do more' },
  { t: 'An unconstrained T cannot read a property', body: ts(pick(CODE.whyByid, 1, 4), { sm: true, hl: [2] }) + tc(OUT['11-why'], { wrap: 64 }) +
    box('T could be anything', `Most types have no ${c('id')}, so ${c('item.id')} is <b>TS2339</b>. Without a constraint you can pass the value around, not look inside it.`, 'do2') },
  { t: 'A constraint: "any type that has an id"', body: ts(pick(CODE.fixedByid, 2, 6), { sm: true, hl: [2] }) + tc(OUT['12-fixed'], { title: 'tsc clean, then node' }) +
    box('extends = "is assignable to"', `${c('<T extends { id: number }>')} lets you use ${c('item.id')} inside, and keeps the type outside — ${c('byId(users, 2)')} is ${c('User | undefined')}. Not class inheritance.`, 'xanh') },
  { t: 'keyof and a key parameter', body: ts(pick(CODE.getProp, 2, 6), { sm: true, hl: [1] }) + tc(OUT['13-getprop'], { title: 'getProp(an, …) → runs' }) +
    two(box('K extends keyof T', `A key argument is checked against the shape: ${c("getProp(an, 'ghost')")} is <b>TS2345</b>.`, 'do2'),
      box('T[K] is the return', `That property’s exact type: ${c("getProp(an, 'role')")} is a ${c('Role')}, ${c("getProp(an, 'id')")} a ${c('number')}.`, 'lam')) },
  { t: 'Indexed access as a type', body: ts(pick(CODE.indexedTypes, 2, 12), { sm: true, hl: [2, 3] }) + tc(OUT['14-indexed'], { title: 'node' }) +
    box('T[K] pulls a property’s type', `${c("User['role']")} <b>is</b> ${c('Role')} — read a type out of the shape instead of repeating the union, and it stays in sync when the model changes.`, 'lam') },
  { t: 'The constraint is checked at the call', body: ts(pick(CODE.rejectCall, 4, 8), { sm: true, hl: [3] }) + tc(OUT['15-reject'], { wrap: 72 }) +
    box('A lab has a code, not an id', `Passing ${c('{ code, name }[]')} to a ${c('{ id: number }')} generic is <b>TS2345</b>. The constraint is a promise both sides keep — this is Lab 6’s ${c('Repo<T extends { id: number }>')}.`, 'do2') },
  { t: 'Which tool, when', body: cards([
      [c('<T>'), 'Any type — you may not touch any property.'],
      [c('<T extends { id: number }>'), 'A constraint — now item.id is allowed.'],
      [c('keyof T'), 'The union of T’s property names.'],
      [c('K extends keyof T'), 'A key argument checked — a typo is refused.'],
      [c('T[K]'), 'Indexed access — the type of that property.'],
      ['Next · 6.3', 'Generic interfaces, classes & defaults.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `${c('pick')} is ${c('any')} and casts, so a typo slips. Make it ${c('<T, K extends keyof T>(obj: T, key: K): T[K]')} and ${c("'eemail'")} becomes TS2345.`, 'xanh'),
      box('Remember', `A constraint lets you use the shape and keeps the type; ${c('keyof')} + ${c('T[K]')} take a key and return exactly that property’s type.`, 'lam')) +
    box('Next · 6.3 — Generic interfaces, classes & defaults', `${c('Result<T, E = string>')} and ${c('Repo<T>')} — the two generics of Lab 6.`, '') },
]);
