/**
 * ts-05-2 — TypeScript · Chapter 5 · Lesson 5.2 "Literal unions & narrowing by value" (03/11/2026). Slug: typescript-5-2-literal-union.
 * Mọi mã/output lấy từ content/courses/typescript/s05/_ma-ts-05-2.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s05/_ma-ts-05-2.mjs';

export const deck = { key: 'ts-05-2', code: 'TS 5.2', title: 'Narrowing by value', sub: 'literal unions, switch, in, instanceof' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 5 — Unions, literals & narrowing', bai: '5.2' }, [
  { cover: true, t: 'Narrowing by value', sub: 'Chapter 5 · Lesson 5.2 — ===, switch, in, instanceof' },
  { t: 'From type guards to value guards', to: true, giua: true, body: `<ul>
    <li>5.1 narrowed by <b>type</b> (${c('typeof')}, truthiness); most LabFlow unions narrow by <b>value</b></li>
    <li>${c('SlotResult')} — test the ${c('ok')} tag to narrow the whole object</li>
    <li>${c('switch')} over a literal union — no ${c('default')} needed</li>
    <li>${c('in')} for object unions; ${c('instanceof')} for the ${c('unknown')} of a ${c('catch')}</li>
    <li>A literal outside the union is ${c('TS2367')}</li></ul>` },
  { t: 'LabFlow’s own union: SlotResult', body: ts(pick(CODE.slotBad, 4, 7), { sm: true, hl: [2] }) + tc(OUT['11-slot-bad'], { wrap: 62 }) +
    two(box('minutes is on one member only', `Reading it blind is <b>TS2339</b> — "does not exist on type ${c('{ ok: false; code }')}".`, 'do2'),
      box('One test on the tag', `${c('if (r.ok)')} narrows the whole object: minutes on one side, code on the other — a discriminated union (5.3).`, 'xanh')) },
  { t: 'Narrow a literal union with switch', body: ts(pick(CODE.switchMsg, 3, 14), { sm: true }) + tc('$ npx tsc -p demo5/ts-05-2/switchcode\n[clean — 0 errors]', { title: 'four cases cover SlotCode' }) +
    box('No default, and tsc is happy', `The four cases cover ${c('SlotCode')} exactly. Add a fifth code and this stops compiling — the free check 5.4 makes explicit.`, 'lam') },
  { t: 'The in operator: different keys', body: ts(pick(CODE.inContact, 1, 7), { sm: true, hl: [4, 5] }) + tc(OUT['14-in'], { title: 'node' }) +
    box('Test for a key one member has', `${c("'email' in c")} narrows ${c('c')} to the member with ${c('email')}; the else is the other. A shared tag (5.3) survives refactors better.`, 'lam') },
  { t: 'instanceof: the catch variable is unknown', body: ts(pick(CODE.catchBad, 2, 8), { sm: true, hl: [5] }) + tc(OUT['15-catch-bad'], { wrap: 64 }) +
    two(box('A catch binding is unknown', `Under strict, anything can be thrown — reading ${c('e.message')} is <b>TS18046</b>.`, 'do2'),
      box('Narrow with instanceof', `${c('e instanceof RangeError')} narrows ${c('e')} to a RangeError — then ${c('e.message')} is safe. Only classes, not type aliases.`, 'xanh')) },
  { t: 'Compare with a literal outside the union', body: ts(pick(CODE.typoRole, 2, 6), { sm: true, hl: [3] }) + tc(OUT['17-typo'], { wrap: 70 }) +
    box('TS2367 — no overlap', `${c('Role')} has no ${c("'TEACHER'")} (it is ${c("'LECTURER'")}). In JS this is silently always false; tsc refuses a comparison that can never be true.`, 'do2') },
  { t: 'Equality narrows both sides', body: ts(pick(CODE.equalitySame, 0, 7), { sm: true, hl: [2, 4] }) + tc(OUT['18-equality'], { title: 'node' }) +
    box('If they are equal, they share a type', `${c('a')} is ${c('string | number')}, ${c('b')} is ${c('string')}. Inside ${c('if (a === b)')}, ${c('a')} must be the string branch, so ${c('a.length')} is allowed.`, 'lam') },
  { t: 'Which value guard, when', body: cards([
      [c('role === \'ADMIN\''), 'A member of a literal union. Outside the union → TS2367.'],
      [c('if (r.ok)'), 'A shared tag — a discriminated union (5.3).'],
      [c('\'email\' in c'), 'Object unions with different keys.'],
      [c('e instanceof RangeError'), 'Classes, and the unknown of a catch.'],
      [c('a === b'), 'Narrows both operands to their common type.'],
      ['Next · 5.3', 'Discriminated unions & type predicates — BookingState.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `Turn a ${c('SlotResult')} into a UI line. ${c('r.minutes')} blind is TS2339 — narrow on ${c('r.ok')} so the ok branch shows the minutes and the other the code.`, 'xanh'),
      box('Remember', `Tag → narrow the object; a complete literal ${c('switch')} needs no default; ${c('catch')} is ${c('unknown')}; a literal outside the union is TS2367.`, 'lam')) +
    box('Next · 5.3 — Discriminated unions & type predicates', `The tag pattern becomes LabFlow’s ${c('BookingState')}, plus ${c('x is T')} predicates.`, '') },
]);
