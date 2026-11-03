/** ts-11-2 — TypeScript · Chapter 11 · Lesson 11.2 "Typed responses". Slug: typescript-11-2-typed-responses. _ma: s11/_ma-ts-11-2.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s11/_ma-ts-11-2.mjs';
export const deck = { key: 'ts-11-2', code: 'TS 11.2', title: 'Typed responses', sub: 'res.json checks the shape' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 11 — Typing a Node/Express backend', bai: '11.2' }, [
  { cover: true, t: 'Typed responses', sub: 'Chapter 11 · Lesson 11.2 — res.json checks the shape' },
  { t: 'res.json checks the shape', body: ts(pick(CODE.responseSend, 0, 10), { sm: true, hl: [7] }) + tc(OUT['11-response'], { title: 'node' }) +
    box('A checked contract', `Give the handler a response type of ${c('Booking')} and ${c('res.json')} takes a ${c('Booking')} — nothing else. The response is a value the compiler verifies, not whatever object you build.`, 'xanh') },
  { t: 'A wrong field is refused', body: ts(CODE.wrongbodySend, { sm: true, hl: [5] }) + tc(OUT['12-wrongbody'], { wrap: 72 }) +
    box('TS2322', `Send ${c('seats')} as a string and the typed response refuses it — the handler cannot send a shape the route did not declare, so response and client never drift apart.`, 'lam') },
  { t: 'A missing field is refused too', body: ts(CODE.prStart, { sm: true, hl: [5] }) + tc(OUT['13-pr-start'], { wrap: 74 }) +
    box('TS2741 · completeness', `Leave out a required field — a ${c('Lab')} without ${c('seats')} — and it is refused. Correctness (TS2322) and completeness (TS2741) together.`, 'lam') },
  { t: 'The response, at a glance', body: cards([
      [c('Res<T>'), 'The body type flows through status() into json().'],
      ['wrong type', 'seats as a string → TS2322.'],
      ['missing field', 'a Lab without seats → TS2741.'],
      ['the contract', 'No shape the route did not declare.'],
      ['no drift', 'The response and its client stay in step.'],
      ['Next · 11.3', 'The API envelope and typed errors.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A handler sends a ${c('Lab')} without its ${c('seats')} (TS2741) — add the field and it compiles and runs.`, 'xanh'),
      box('Remember', `The typed response guarantees every field the route promises is present and correctly typed — the server-side mirror of a typed API client.`, 'lam')) +
    box('Next · 11.3 — The API result envelope', `Success with data, or a failure with a typed error.`, '') },
]);
