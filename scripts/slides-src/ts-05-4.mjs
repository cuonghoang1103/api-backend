/**
 * ts-05-4 — TypeScript · Chapter 5 · Lesson 5.4 "Exhaustiveness checking with never" (03/11/2026). Slug: typescript-5-4-exhaustiveness.
 * Mọi mã/output lấy từ content/courses/typescript/s05/_ma-ts-05-4.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s05/_ma-ts-05-4.mjs';

export const deck = { key: 'ts-05-4', code: 'TS 5.4', title: 'Exhaustiveness', sub: 'never, assertNever & the catch-all trap' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 5 — Unions, literals & narrowing', bai: '5.4' }, [
  { cover: true, t: 'Exhaustiveness checking<br>with never', sub: 'Chapter 5 · Lesson 5.4 — add a case, break the build' },
  { t: 'The exhaustive switch', body: ts(pick(CODE.v1Status, 6, 16), { sm: true, hl: [7] }) + tc(OUT['11-v1'], { title: 'node — compiles & runs' }) +
    box('The default sees never', `After every case returns, control-flow has removed every member of ${c('Status')}, so ${c('s')} is ${c('never')}. ${c('assertNever(x: never)')} accepts it — today, 0 errors.`, 'xanh') },
  { t: 'Add a case: tsc finds every switch', body: ts(pick(CODE.v2Status, 0, 1), { sm: true, hl: [1] }) + ts(pick(CODE.v2Status, 8, 14), { sm: true, hl: [5] }) + tc(OUT['12-v2'], { wrap: 64 }) +
    box('TS2345 at assertNever', `A product manager added ${c('EXPIRED')}. Now at the ${c('default')}, ${c('s')} is ${c("'EXPIRED'")} — not ${c('never')} — so one edit to the union turns every exhaustive switch red, each pointing at the case it forgot.`, 'lam') },
  { t: 'Why it works: never is the empty type', body: ts(pick(CODE.neverBasics, 1, 8), { sm: true, hl: [2, 3, 6, 7] }) + tc(OUT['14-never'], { wrap: 62 }) +
    two(box('Assignable TO everything', `A function returning ${c('never')} can stand in anywhere — it never actually returns.`, 'lam'),
      box('Only never → never', `Hand a real leftover value to a ${c('never')} slot and it is <b>TS2322</b>. That is the guard.`, 'xanh')) },
  { t: 'Trap: a catch-all default', body: ts(pick(CODE.catchallStatus, 3, 11), { sm: true, hl: [6] }) + tc(OUT['13-catchall'], { title: 'node — silent wrong value', wrap: 50 }) +
    box('0 errors, and EXPIRED shows as grey', `A catch-all (or a ${c('throw')}) is runtime only — nothing at compile time. The forgotten case ships looking cancelled, and no test warns anyone.`, 'do2') },
  { t: 'A real incident on this site', to: true, giua: true, body: two(
      box('2026-08-08 — a rename', `${c('ContentType.CODE')} → ${c('CODE_REVIEW')}. It passed the whole pre-push checklist and still broke the <b>seed on production</b>.`, 'do2'),
      box('Why', `${c('seed.ts')} carried its own hand-written copy of the union and checked against itself — nothing connected the rename to the stale consumer.`, 'lam')) +
    box('The defence', `One source of truth + exhaustive consumers = a change to the union turns every stale consumer red before it ships. (The seed fix is Chapter 9.)`, 'xanh') },
  { t: 'A second guard: a closed Record', body: ts(pick(CODE.recordLabel, 2, 8), { sm: true, hl: [2] }) + tc(OUT['16-record'], { wrap: 64 }) +
    box('TS2741 — a missing key', `A table typed ${c('Record<Status, string>')} needs one entry per member. Add ${c('EXPIRED')} and the key is missing. An open ${c('{ [k: string]: string }')} has no such check.`, 'lam') },
  { t: 'Assertion functions: narrow, or throw', body: ts(pick(CODE.assertFn, 5, 19), { sm: true, hl: [2, 7, 9] }) + tc(OUT['15-assert'], { title: 'node' }) +
    box('Narrows by not throwing', `${c('asserts cond')} narrows what cond tested; ${c('asserts s is ActiveState')} narrows ${c('s')} with no block. Like a predicate, it is trusted — the body must actually throw.`, 'xanh') },
  { t: 'Add a case: the five outcomes', body: cards([
      [c('default: assertNever(x)'), '✅ TS2345 — you must handle it.'],
      ['no default, all return', '✅ return-type error (can now fall through).'],
      [c('default: return \'x\''), '❌ silent wrong value at runtime.'],
      [c('Record<Union, V>'), '✅ TS2741 — a missing key.'],
      [c('{ [k: string]: V }'), '❌ a new case ships unlabelled.'],
      ['Next · Lab 5', 'Build the state machine; the grader adds a state.'],
    ], 3) },
  { t: 'Practice &amp; Lab 5', to: true, giua: true, body: two(
      box('🧪 Practice', `A pricing switch with a catch-all hides a new ${c('ENTERPRISE')} tier. Replace the default with ${c('assertNever')} so tsc points at the switch; then add the case.`, 'xanh'),
      box('Remember', `${c('assertNever')} in the default (or no default) makes a new case TS2345; a closed ${c('Record')} is a second guard; catch-alls hide bugs.`, 'lam')) +
    box('Next · Lab 5 — The booking state machine', `Build ${c('BookingState')}; the grader adds a state and your describe + closed Record must go red.`, '') },
]);
