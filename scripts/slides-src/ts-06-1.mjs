/**
 * ts-06-1 — TypeScript · Chapter 6 · Lesson 6.1 "Why generics: keep the type" (03/11/2026). Slug: typescript-6-1-why-generics.
 * Mọi mã/output lấy từ content/courses/typescript/s06/_ma-ts-06-1.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s06/_ma-ts-06-1.mjs';

export const deck = { key: 'ts-06-1', code: 'TS 6.1', title: 'Why generics', sub: 'keep the type, do not throw it away' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 6 — Generics', bai: '6.1' }, [
  { cover: true, t: 'Why generics:<br>keep the type', sub: 'Chapter 6 · Lesson 6.1 — reusable AND type-safe' },
  { t: 'What you will take away from this chapter', to: true, giua: true, body: `<ul>
    <li>A <b>type parameter</b> ${c('<T>')} links input to output — reusable code that keeps the type</li>
    <li>Constrain it: ${c('T extends { id: number }')}, with ${c('keyof')} and ${c('T[K]')} (6.2)</li>
    <li>Generic interfaces, classes and defaults — ${c('Result<T, E>')}, ${c('Repo<T>')} (6.3)</li>
    <li>Inference, and the traps: return-only, needless, widening (6.4)</li>
    <li>Pass <b>Lab 6</b>: a generic repository + ${c('groupBy')} — ${c('any')} scores 4.5</li></ul>` },
  { t: 'The sloppy way: any throws the type away', body: ts(pick(CODE.anyFirst, 2, 10), { sm: true, hl: [2, 10, 11] }) + tc(L(OUT['12-any-run']).slice(0, 4).join('\n'), { title: 'node — crashes', wrap: 56 }) +
    box('0 errors, then a TypeError', `${c('firstOf')} returns ${c('any')}, so a typo (${c('u.emial')}) and a wrong method (${c('u.name.toFixed')}) both compile. ${c('any')} works for every type by checking none.`, 'do2') },
  { t: 'The right way: a type parameter', body: ts(pick(CODE.genericFirst, 2, 7), { sm: true, hl: [2, 3] }) + tc(OUT['13-generic'], { wrap: 72 }) +
    box('T links input to output', `${c('firstOf(users)')} is ${c('User | undefined')} — the exact type is kept, so the typo is <b>TS2551</b> ("Did you mean ‘email’?").`, 'xanh') },
  { t: 'You rarely write <T>: inference', body: ts(pick(CODE.inferCalls, 0, 9), { sm: true, hl: [5, 6] }) + tc(OUT['15-infer'], { title: 'node' }) +
    box('tsc fills T from the argument', `${c('identity(42)')} infers ${c('number')}, ${c("identity('BE-201')")} infers ${c('string')}. Write ${c('<T>')} only when there is nothing to infer from.`, 'lam') },
  { t: 'When there is nothing to infer', body: ts(pick(CODE.explicit, 0, 11), { sm: true, hl: [7, 8, 11] }) + tc(OUT['17-explicit'], { wrap: 62 }) +
    box('An empty literal gives T = never', `${c('firstOf([])')} has nothing to infer from, so the result is ${c('undefined')} and ${c('.length')} is TS2532. Give ${c('<string>')} explicitly.`, 'do2') },
  { t: 'Two type parameters', body: ts(pick(CODE.pair, 1, 7), { sm: true, hl: [2] }) + tc(OUT['16-pair'], { title: 'node' }) +
    box('Each one independent, both kept', `${c("pair('BE-201', 40)")} is ${c('[string, number]')}; destructuring keeps both. This is how ${c('Map<K, V>')} and ${c('Promise<T>')} are declared.`, 'lam') },
  { t: 'Which form, when', body: cards([
      [c('firstOf(arr: any[]): any'), 'Never: the type is lost, typos and wrong calls crash (1.4).'],
      [c('firstOf(arr: unknown[]): unknown'), 'Honest, but you must narrow every use.'],
      [c('firstOf<T>(arr: T[]): T | undefined'), 'The result type follows the argument — the default.'],
      [c('identity<T>(x: T): T'), 'Pass-through; T is inferred.'],
      [c('pair<A, B>(a, b): [A, B]'), 'Combine values of different types.'],
      ['Next · 6.2', 'Constrain T; keyof and indexed access.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `${c('lastOf')} is typed ${c('any')}, so a typo on its result is not caught. Make it generic — ${c('lastOf<T>(arr: T[]): T | undefined')} — and the typo becomes TS2551.`, 'xanh'),
      box('Remember', `${c('any')} drops the type (no checks); a generic keeps it. tsc usually infers ${c('<T>')}; write it only when nothing supplies it.`, 'lam')) +
    box('Next · 6.2 — Constraints, keyof & indexed access', `Let T do more: ${c('T extends { id: number }')}, ${c('keyof T')}, ${c('T[K]')}.`, '') },
]);
