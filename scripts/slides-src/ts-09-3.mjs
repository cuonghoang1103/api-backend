/**
 * ts-09-3 — TypeScript · Chapter 9 · Lesson 9.3 "Beyond strict: extra safety flags" (04/11/2026). Slug: typescript-9-3-extra-safety-flags.
 * Mọi mã/output lấy từ content/courses/typescript/s09/_ma-ts-09-3.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s09/_ma-ts-09-3.mjs';

export const deck = { key: 'ts-09-3', code: 'TS 9.3', title: 'Beyond strict: extra safety flags', sub: 'three flags worth the noise' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 9 — tsconfig & the compiler', bai: '9.3' }, [
  { cover: true, t: 'Beyond strict:<br>extra safety flags', sub: 'Chapter 9 · Lesson 9.3 — three flags worth the noise' },
  { t: 'noUncheckedIndexedAccess: an access might miss', body: ts(pick(CODE.indexedFirst, 3, 8), { sm: true, hl: [3] }) + tc(OUT['11-indexed'], { wrap: 74 }) +
    box('TS18048', `The array could be empty, so ${c('labs[0]')} is ${c('Lab | undefined')}. The flag adds ${c('undefined')} to every index and key access — a little friction for never reading past the end. On in this course.`, 'lam') },
  { t: 'noImplicitReturns: every path must return', body: ts(pick(CODE.returnsGrade, 1, 9), { sm: true, hl: [1] }) + tc(OUT['12-returns'], { wrap: 74 }) +
    box('TS7030', `${c('grade')} returns on two branches and falls off the end on a third. The flag catches the forgotten ${c('else')} — the case you thought was impossible but the compiler can reach.`, 'lam') },
  { t: 'noUnusedLocals: dead code is an error', body: ts(pick(CODE.unusedCalc, 1, 5), { sm: true, hl: [2] }) + tc(OUT['13-unused'], { wrap: 74 }) +
    box('TS6133', `${c('count')} is declared and never read — usually a half-finished edit. Turning the warning into an error keeps the signal from piling up. ${c('noUnusedParameters')} does the same for arguments.`, 'lam') },
  { t: 'Beyond strict — when to add each', body: cards([
      [c('noUncheckedIndexedAccess'), 'Reading arrays/maps by key — biggest payoff.'],
      [c('noImplicitReturns'), 'Any function with branches that compute a value.'],
      [c('noUnusedLocals'), 'Keep edits clean; dead code is an error.'],
      ['not in strict', 'Each adds friction most code skips.'],
      ['how', 'Turn on in tsconfig, fix what appears — Lab 9.'],
      ['Next · 9.4', 'target, lib, module & noEmit.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A function reading ${c('names[0]')} without a guard fails under ${c('noUncheckedIndexedAccess')} (TS18048). Guard it with ${c('??')} and it runs.`, 'xanh'),
      box('Remember', `These are configuration, not syntax — the compiler only protects you against the questions you let it ask, and these are three more worth asking.`, 'lam')) +
    box('Next · 9.4 — target, lib, module & noEmit', `The flags that describe the world your code runs in, and the CI gate.`, '') },
]);
