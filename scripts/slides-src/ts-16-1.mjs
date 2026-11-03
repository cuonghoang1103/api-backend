/** ts-16-1 — TypeScript · Chapter 16 · Lesson 16.1 "Make illegal states unrepresentable". Slug: typescript-16-1-illegal-states. _ma: s16/_ma-ts-16-1.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s16/_ma-ts-16-1.mjs';
export const deck = { key: 'ts-16-1', code: 'TS 16.1', title: 'Make illegal states unrepresentable', sub: 'the best bug is one you cannot write' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 16 — Architecture & type-driven design', bai: '16.1' }, [
  { cover: true, t: 'Make illegal states<br>unrepresentable', sub: 'Chapter 16 · Lesson 16.1 — shape types so a wrong value cannot exist' },
  { t: 'A branded type: not just any string', body: ts(pick(CODE.brand, 1, 8), { sm: true, hl: [1] }) + tc(OUT['11-brand'], { title: 'node' }) +
    box('One door in', `A ${c('LabCode')} is a string the compiler tracks apart. Only the validator produces one — a function taking a ${c('LabCode')} can only be given a validated one.`, 'xanh') },
  { t: 'A plain string is refused', body: ts(CODE.wrongbrand, { sm: true, hl: [4] }) + tc(OUT['12-wrongbrand'], { wrap: 72 }) +
    box('TS2345', `A plain string never went through the validator, so it is not a ${c('LabCode')}. The brand turns “remember to validate” into a rule the compiler enforces.`, 'lam') },
  { t: 'A discriminated union: one state at a time', body: ts(CODE.illegalstate, { sm: true, hl: [5] }) + tc(OUT['13-illegalstate'], { wrap: 72 }) +
    box('TS2339', `A slot is free OR booked — never both. There is no way to build a free slot that also has a ${c('by')}; the illegal state is unrepresentable.`, 'lam') },
  { t: 'At a glance', to: true, body: cards([
      ['type-driven design', 'Shape the types so a wrong value cannot exist in the first place — then there is nothing to guard against.'],
      ['branded type', 'A string the compiler tracks apart; a plain one is TS2345 because it never went through the validator.'],
      ['one door in', 'Only the validator produces a LabCode — the “remember to validate” rule, now enforced at every call.'],
      ['discriminated union', 'One state at a time; a free slot cannot also carry a booker, and a wrong field is TS2339.'],
      ['no check needed', 'If the illegal state cannot be constructed, you never write a run-time check for it.'],
      ['the whole course', 'Unions (5), generics (6), DTOs (8), Zod at the boundary (13) — all make illegal states unrepresentable.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A function is called with a plain string where a ${c('LabCode')} is expected — TS2345; pass it through the validator and it runs.`, 'xanh'),
      box('Remember', `A branded type and a discriminated union both make an illegal value impossible to construct — no runtime check needed.`, 'lam')) +
    box('Next · 16.2 — any, unknown & never', `The three special types, and when each belongs.`, '') },
]);
