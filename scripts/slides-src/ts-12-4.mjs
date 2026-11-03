/** ts-12-4 — TypeScript · Chapter 12 · Lesson 12.4 "Typed context & generic components". Slug: typescript-12-4-context-generics. _ma: s12/_ma-ts-12-4.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s12/_ma-ts-12-4.mjs';
export const deck = { key: 'ts-12-4', code: 'TS 12.4', title: 'Typed context & generic components', sub: 'generics and unions from Chapter 6, in a UI' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 12 — Typing React', bai: '12.4' }, [
  { cover: true, t: 'Typed context &amp;<br>generic components', sub: 'Chapter 12 · Lesson 12.4 — Chapter 6’s generics, in a UI' },
  { t: 'A typed context forces the null check', body: ts(CODE.contextDemo, { sm: true, hl: [8] }) + tc(OUT['11-context'], { wrap: 74 }) +
    box('TS18047 · "possibly null"', `Type the context with the value union — including the ${c('null')} for "outside any provider" — and ${c('useContext')} returns ${c('Theme | null')}. Reading it unchecked is a real bug, caught now.`, 'lam') },
  { t: 'The guard hook returns a non-null value', body: ts(pick(CODE.contextOk, 0, 9), { sm: true, hl: [6] }) + tc(OUT['12-context-ok'], { title: 'node' }) +
    box('Throw, then the type is non-null', `After ${c('if (theme === null) throw …')}, control-flow analysis gives every caller a plain ${c('Theme')}. Export the hook, not the context — no one can bypass the guard.`, 'xanh') },
  { t: 'A generic component adapts to its data', body: ts(pick(CODE.generic, 0, 9), { sm: true, hl: [2, 7] }) + tc(OUT['13-generic'], { title: 'node' }) +
    box('T is inferred from the props', `${c('List<T>')} renders any array; from ${c('items: [1, 2, 3]')} TypeScript infers ${c('T = number')}, so ${c('n')} is a number. One component for every element type.`, 'xanh') },
  { t: 'At a glance — and the plausible-default trap', body: cards([
      [c('createContext<T | null>(null)'), 'useContext returns T | null.'],
      ['read it unchecked', 'TS18047 — handle no-provider.'],
      ['a guard hook', 'Throw if null, return a non-null value.'],
      ['generic component', 'List<T> infers T from props.'],
      ['Chapter 6, in a UI', 'One component, typed for every element.'],
      ['plausible-default trap', 'A fake default hides a missing provider — a dead button, no error.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A consumer reads ${c('user.fullName')} when ${c('User')} has only ${c('name')} — TS2339; read ${c('user.name')} and it runs.`, 'xanh'),
      box('Chapter 12 done', `props, hooks, events, context — each a generic or a union from earlier chapters, now on the frontend.`, 'lam')) +
    box('Next · Lab 12', `A typed BookingForm — a component and a hook — graded by tsc and Node.`, '') },
]);
