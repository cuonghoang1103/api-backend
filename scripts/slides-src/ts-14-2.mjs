/** ts-14-2 — TypeScript · Chapter 14 · Lesson 14.2 "Inheritance, abstract & implements". Slug: typescript-14-2-abstract-implements. _ma: s14/_ma-ts-14-2.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s14/_ma-ts-14-2.mjs';
export const deck = { key: 'ts-14-2', code: 'TS 14.2', title: 'Inheritance, abstract & implements', sub: '“must be provided” as a compile error' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 14 — Classes & decorators', bai: '14.2' }, [
  { cover: true, t: 'Inheritance, abstract<br>&amp; implements', sub: 'Chapter 14 · Lesson 14.2 — a base that names the shape' },
  { t: 'An abstract class names the shape', body: ts(pick(CODE.concrete, 1, 11), { sm: true }) + tc(OUT['11-concrete'], { title: 'node' }) +
    box('Base contract, subclass fills it', `${c('BookingRepo')} writes ${c('describe()')} in terms of an abstract ${c('find()')}; a ${c('MemoryRepo')} fills it in. You use it through the ${c('BookingRepo')} type.`, 'xanh') },
  { t: 'An abstract class cannot be instantiated', body: ts(CODE.instantiate, { sm: true, hl: [5] }) + tc(OUT['12-instantiate'], { wrap: 72 }) +
    box('TS2511', `An abstract class has holes (the abstract methods), so it cannot be built directly. You instantiate a concrete subclass; the type still works as a parameter or field.`, 'lam') },
  { t: 'implements checks a class against an interface', body: ts(CODE.implements, { sm: true, hl: [6] }) + tc(OUT['13-implements'], { wrap: 72 }) +
    box('TS2420', `The class claimed to satisfy ${c('Repo')} and does not. Add a method to the interface and every implementer that has not caught up lights up.`, 'lam') },
  { t: 'At a glance', body: cards([
      ['abstract class', 'Written methods + abstract ones a subclass must supply.'],
      ['cannot instantiate', 'new BookingRepo() is TS2511.'],
      [c('implements'), 'Checks a class against an interface structurally.'],
      ['missing method', 'TS2420 (implements) / TS2654 (abstract member).'],
      ['a contract', '“Must be provided” becomes a compile error.'],
      ['Next · 14.3', '#private: real run-time hiding.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A concrete ${c('SeatStore extends Store')} forgot the abstract ${c('get')} — TS2515; implement it and it runs.`, 'xanh'),
      box('Remember', `Instantiating an abstract class is TS2511; an ${c('implements')} class missing a method is TS2420.`, 'lam')) +
    box('Next · 14.3 — #private, getters & static', `#private is a field the language itself hides at run time, stronger than compile-time private.`, '') },
]);
