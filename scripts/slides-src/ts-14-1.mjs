/** ts-14-1 — TypeScript · Chapter 14 · Lesson 14.1 "Classes & access modifiers". Slug: typescript-14-1-classes-access. _ma: s14/_ma-ts-14-1.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s14/_ma-ts-14-1.mjs';
export const deck = { key: 'ts-14-1', code: 'TS 14.1', title: 'Classes & access modifiers', sub: 'private, readonly, protected — the start of encapsulation' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 14 — Classes & decorators', bai: '14.1' }, [
  { cover: true, t: 'Classes &amp; access modifiers', sub: 'Chapter 14 · Lesson 14.1 — who may touch what' },
  { t: 'A class groups data and operations', body: ts(pick(CODE.service, 1, 7), { sm: true }) + tc(OUT['11-service'], { title: 'node' }) +
    box('Methods out, fields in', `A ${c('BookingService')} holds a ${c('private count')} and a ${c('readonly lab')} and exposes ${c('book()')}. From outside you call methods, not fields — the class decides what is visible.`, 'xanh') },
  { t: 'private hides internals', body: ts(CODE.private, { sm: true, hl: [7] }) + tc(OUT['12-private'], { wrap: 72 }) +
    box('TS2341 · compile-time', `The field exists at run time (TypeScript’s ${c('private')} is erased in the output), but the compiler refuses the access — callers depend on the method, not the state.`, 'lam') },
  { t: 'readonly fixes a field after construction', body: ts(CODE.readonly, { sm: true, hl: [7] }) + tc(OUT['13-readonly'], { wrap: 72 }) +
    box('TS2540', `A ${c('readonly')} field is set once, in the constructor, and never again — the Chapter 8 ${c('Readonly')}, on a single class field.`, 'lam') },
  { t: 'At a glance', body: cards([
      ['a class', 'Groups data with the operations on it.'],
      [c('private'), 'Hides a field — reading it outside is TS2341.'],
      [c('readonly'), 'Fixed after construction — reassigning is TS2540.'],
      [c('protected'), 'Shared with subclasses only.'],
      ['compile-time', 'These are erased at run time.'],
      ['Next · 14.3', '#private hides at run time too.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A ${c('Lab')} reads its ${c('private seats')} from outside — TS2341; read it through the method and it runs.`, 'xanh'),
      box('Remember', `Access modifiers are compile-time boundaries; a ${c('private')} read outside is TS2341, a ${c('readonly')} reassigned is TS2540.`, 'lam')) +
    box('Next · 14.2 — Abstract & implements', `An abstract class names a shape a subclass must fill in; implements checks a class against an interface.`, '') },
]);
