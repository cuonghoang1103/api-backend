/** ts-16-2 — TypeScript · Chapter 16 · Lesson 16.2 "any, unknown & never". Slug: typescript-16-2-any-unknown-never. _ma: s16/_ma-ts-16-2.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s16/_ma-ts-16-2.mjs';
export const deck = { key: 'ts-16-2', code: 'TS 16.2', title: 'any, unknown & never', sub: 'the three special types' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const run = (out) => L(out).filter((l) => /^\$ |TypeError|console\.log/.test(l)).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 16 — Architecture & type-driven design', bai: '16.2' }, [
  { cover: true, t: 'any, unknown &amp; never', sub: 'Chapter 16 · Lesson 16.2 — the edges of the type system' },
  { t: 'unknown: accept anything, then narrow', body: ts(CODE.unknown, { sm: true, hl: [4] }) + tc(OUT['11-unknown'], { wrap: 72 }) +
    box('TS18046 · the honest top type', `Data from outside is ${c('unknown')}, not ${c('any')}. You must prove what it is (${c('typeof raw === "string"')}) before you touch it.`, 'xanh') },
  { t: 'never: the exhaustiveness check', body: ts(pick(CODE.never, 0, 10), { sm: true, hl: [8] }) + tc(OUT['12-never'], { wrap: 72 }) +
    box('TS2345', `${c("'held'")} is not handled, so the value reaching ${c('assertNever')} is not ${c('never')}. Add a union member later and the check lights up where you must handle it.`, 'lam') },
  { t: 'any: the switch you turn off, rarely', body: ts(CODE.anyrun, { sm: true, hl: [3] }) + tc(run(OUT['13-anyrun']), { title: 'node', fs: 14 }) +
    box('any lets a crash through', `${c('data.seats.toFixed()')} passes tsc and throws at run time. Every error the course taught you to catch, ${c('any')} lets through — reach for ${c('unknown')}.`, 'do2') },
  { t: 'At a glance', body: cards([
      [c('any'), 'Checking off — a wrong call compiles and crashes at run time.'],
      [c('unknown'), 'The safe top type — narrow before use (else TS18046).'],
      [c('never'), 'The empty type — an unhandled case fails assertNever (TS2345).'],
      ['at a boundary', 'Prefer unknown, then narrow.'],
      ['in a switch', 'Use never to prove exhaustiveness.'],
      ['Next · 16.3', 'Organizing types.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A function reads ${c('raw[0]')} on an ${c('unknown')} — TS18046; narrow with ${c('typeof raw === "string"')} and it runs.`, 'xanh'),
      box('Remember', `${c('unknown')} at every boundary; ${c('never')} to make a switch prove it is exhaustive; ${c('any')} almost never.`, 'lam')) +
    box('Next · 16.3 — Organizing types', `type vs interface, and where types live.`, '') },
]);
