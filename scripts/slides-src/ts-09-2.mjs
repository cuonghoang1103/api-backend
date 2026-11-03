/**
 * ts-09-2 — TypeScript · Chapter 9 · Lesson 9.2 "strict mode" (04/11/2026). Slug: typescript-9-2-strict-mode.
 * Mọi mã/output lấy từ content/courses/typescript/s09/_ma-ts-09-2.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s09/_ma-ts-09-2.mjs';

export const deck = { key: 'ts-09-2', code: 'TS 9.2', title: 'strict mode', sub: 'one flag, eight checks' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 9 — tsconfig & the compiler', bai: '9.2' }, [
  { cover: true, t: 'strict mode', sub: 'Chapter 9 · Lesson 9.2 — one flag, eight checks' },
  { t: 'noImplicitAny: no silent any', body: ts(CODE.implicitanyParse, { sm: true, hl: [2] }) + tc(OUT['11-implicitany'], { wrap: 74 }) +
    box('TS7006', `A parameter with no type would be ${c('any')} — which turns off every check inside the function. ${c('noImplicitAny')} forces you to say what ${c('raw')} is. A silent ${c('any')} is a hole; this closes it.`, 'lam') },
  { t: 'strictNullChecks: null is its own type', body: ts(pick(CODE.nullchecksFind, 4, 9), { sm: true, hl: [3] }) + tc(OUT['12-nullchecks'], { wrap: 74 }) +
    box('TS18048', `${c('find')} may return ${c('undefined')}, so reading ${c('.name')} is refused. ${c('undefined')} is a type you must handle — a guard, a default, ${c('?.')} — before you touch the value. The most common run-time error, prevented.`, 'lam') },
  { t: 'The same file, loose vs strict', body: ts(CODE.umbrellaCode, { sm: true, hl: [2, 4] }) +
    tc(OUT['13-umbrella-loose'], { title: 'strict: false' }) + tc(OUT['14-umbrella-strict'], { title: 'strict: true' }) +
    box('The code did not change', `${c('strict:false')} hides both bugs (0 errors); flip it on and the same file reports <b>TS7006</b> and <b>TS18048</b>. ${c('strict')} is the question “is this actually safe?”.`, 'do2') },
  { t: 'What the strict umbrella turns on', body: cards([
      [c('noImplicitAny'), 'An untyped value is an error (TS7006), not a silent any.'],
      [c('strictNullChecks'), 'null/undefined are their own types — a possibly-undefined read is TS18048.'],
      [c('strictFunctionTypes'), 'Function parameters are checked contravariantly — a stricter callback match.'],
      [c('strictPropertyInitialization'), 'A class field must be assigned in the constructor, or marked optional.'],
      [c('useUnknownInCatchVariables'), 'A caught error is unknown, not any — you must narrow it before use.'],
      ['+ three more', 'strictBindCallApply, noImplicitThis, alwaysStrict — the whole umbrella, on by default.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A ${c('label')} with an implicit-any parameter and an unguarded lookup fails under strict (TS7006 + TS18048). Type the parameter and guard the value, and it runs.`, 'xanh'),
      box('Remember', `${c('strict')} is one flag for eight checks, the default even with no config. Turning it off to pass a build fixes nothing — strict on, then fix what it finds.`, 'lam')) +
    box('Next · 9.3 — Beyond strict', `The safety flags outside the umbrella: noUncheckedIndexedAccess, noImplicitReturns, noUnusedLocals.`, '') },
]);
