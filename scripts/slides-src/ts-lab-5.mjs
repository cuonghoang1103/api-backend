/**
 * ts-lab-5 — TypeScript · Chapter 5 · Lab 5 "The booking state machine" (03/11/2026). Slug: typescript-5-6-lab-may-trang-thai.
 * Mọi mã/output lấy từ content/courses/typescript/s05/_ma-ts-lab-5.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s05/_ma-ts-lab-5.mjs';

export const deck = { key: 'ts-lab-5', code: 'TS Lab 5', title: 'The booking state machine', sub: 'discriminated union + never' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noc = (s) => L(s).map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n'); // drop the aligned "// Sn …" trailing comments
const grab = (src, first, n) => { const l = L(src); const i = l.findIndex((x) => x.startsWith(first)); return l.slice(i, i + n).join('\n'); };
const score = (out) => L(out).filter((l) => /^(✓|✗).* — |^Score:/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 5 — Unions, literals & narrowing', bai: 'Lab 5' }, [
  { cover: true, t: 'Lab 5 — The booking<br>state machine', sub: 'discriminated union + never · grader runs tsc & Node' },
  { t: 'The task', to: true, giua: true, body: `<ul>
    <li>A teammate modelled the booking lifecycle as one wide object — it compiles, scores <b>4/10</b></li>
    <li>Rewrite it as a <b>discriminated union</b> on Chapter 4’s ${c('BookingRecord')}</li>
    <li>Exhaustive ${c('describe')} with ${c('assertNever')}; a type predicate ${c('isActive')}; a closed ${c('Record<Step, string>')}</li>
    <li>Pass mark 7; grader = ${c('npm run lab5')} (tsc 7.0.2 + Node 22.23.3)</li>
    <li>The last 2 points: the grader <b>adds a new state</b> and your code must refuse to compile</li></ul>` },
  { t: 'Zero errors — and why that proves nothing', body: ts(pick(CODE.starter, 3, 10), { sm: true, hl: [2] }) + tc(OUT['l2-starter-tsc'], { title: 'tsc -p lab5/tsconfig.src.json' }) +
    box('Valid, but loose', `${c('step: string')} accepts any text; record/code/reason all optional → illegal states are legal. A loose union refuses nothing.`, 'do2') },
  { t: 'The grader, and part F', body: tc(score(OUT['l3-starter']), { title: 'npm run lab5 — the starter', fs: 15 }) +
    box('A new step breaks the build', `Parts A–E are compile / correct uses / honesty / behaviour / wrong uses. Part <b>F</b> inserts a 6th state at the ${c('// +F')} marker and recompiles — your ${c('describe')} and ${c('STEP_LABEL')} must go red.`, 'lam') },
  { t: 'The eight wrong uses', body: ts(noc(pick(CODE.sai, 9, 17)), { sm: true }) +
    two(box('Missing or wrong data', `S1/S2 a pending/cancelled with no record/reason → TS2345 · S3 a draft with a record → TS2353 · S6 an invalid with no code → TS2322`, 'do2'),
      box('Wrong value or shape', `S4 a record off a draft → TS2339 · S5 a typo’d step → TS2367 · S7 cancelled as active → TS2322 · S8 a misspelling → TS2820`, 'do2')) +
    box('All eight compile against the loose starter', `Your discriminated union makes tsc reject each with the code shown.`, 'lam') },
  { t: 'Attempt A: a catch-all default (8/10)', body: tc(score(OUT['l4-yeu']), { title: 'npm run lab5 --from lab5/yeu', fs: 15 }) +
    box('Passes, and misses the point', `The union is right, so A–E are green. But ${c("default: return 'Unknown'")} and an open table mean a new state ships silently — <b>F 0/2</b>. A passing grade is not the goal.`, 'do2') },
  { t: 'Attempt B: assertNever, open table (9/10)', body: tc(score(OUT['l5-vua']), { title: 'npm run lab5 --from lab5/vua', fs: 15 }) +
    box('One guard, not two', `${c('describe')} uses ${c('assertNever')}, so adding a state turns it red (F1 ✓). But ${c('STEP_LABEL')} is still open, so the new step has no entry and nothing complains (F2 ✗).`, 'lam') },
  { t: 'The reference: 10/10', body: ts(grab(CODE.ref, 'export type BookingState', 7), { sm: true }) +
    tc(L(OUT['l6-ref']).filter((l) => /srcF|Score:/.test(l)).join('\n'), { title: 'part F — two red lines', fs: 14, wrap: 74 }) +
    box('Two guards fire', `Adding ${c('expired')}: TS2345 at ${c('assertNever')} (describe) + TS2741 at the closed ${c('Record')} (STEP_LABEL). Both point at the code to update.`, 'xanh') },
  { t: 'Before you call it done', body: cards([
      [c('npm run lab5'), 'Prints Score: 10/10.'],
      ['No shortcuts', 'No any, as or ! ; the // +F marker stays.'],
      ['Explain it', 'Which line refuses each S1–S8, which two F turns red.'],
      ['Commit', 'feat(state): booking lifecycle as a discriminated union.'],
      ['Valid ≠ precise', 'The model compiled before and after — it just refuses more.'],
      ['Next · Chapter 6', 'Generics: Result<T, E>, a typed repository.'],
    ], 3) },
]);
