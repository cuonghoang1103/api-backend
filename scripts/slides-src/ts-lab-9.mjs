/**
 * ts-lab-9 — TypeScript · Chapter 9 · Lab 9 "Tighten a loose project to strict" (04/11/2026). Slug: typescript-9-6-lab-siet-strict.
 * Mọi mã/output lấy từ content/courses/typescript/s09/_ma-ts-lab-9.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s09/_ma-ts-lab-9.mjs';

export const deck = { key: 'ts-lab-9', code: 'TS Lab 9', title: 'Tighten a loose project to strict', sub: 'strict + the flags + a CI gate' };

const L = (s) => s.split('\n');
const noc = (s) => L(s).map((l) => l.replace(/\s+\/\/ S\d.*$/, '')).join('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const score = (out) => L(out).filter((l) => /^(✓|✗).* — |^Score:/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 9 — tsconfig & the compiler', bai: 'Lab 9' }, [
  { cover: true, t: 'Lab 9 — Tighten a loose<br>project to strict', sub: 'turn on strict + the flags · close the seed gap · pass tsc --noEmit' },
  { t: 'The task', to: true, giua: true, body: `<ul>
    <li>You inherit a loose project — ${c('strict')} off, an untyped parameter, an unguarded access, a drifted seed</li>
    <li>Turn on ${c('strict')} + ${c('noUncheckedIndexedAccess')}, fix what appears, close the seed gap</li>
    <li>Make ${c('tsc --noEmit')} pass — the CI gate the grader runs under <b>your</b> tsconfig</li>
    <li>The loose starter scores <b>4.5</b>; you take it to 10</li>
    <li>${c('npm run lab9')} (tsc 7.0.2 + Node 22.23.3)</li></ul>` },
  { t: 'Loose compiles — and hides the bugs', body: ts(CODE.starterRules, { sm: true, hl: [4, 9] }) +
    box('4.5/10 — a green build on a loose config', `${c('strict:false')} compiles with 0 errors: the untyped parameter, the unguarded access, the drifted seed — all invisible. It passes the gate and fails everything that matters.`, 'do2') },
  { t: 'Flip strict and the bugs appear', body: tc(OUT['l2-flip'], { title: 'tsc --noEmit (strict on)', wrap: 80 }) +
    box('Reveal, not create', `The same ${c('rules.ts')} reports three at once: <b>TS7006</b> (untyped parameter), <b>TS7053</b> (indexing with an any key), <b>TS2532</b> (the access might be undefined). Tightening surfaces bugs that were always there.`, 'lam') },
  { t: 'The eight loose uses', body: ts(noc(pick(CODE.sai, 2, 10)), { sm: true }) +
    two(box('noImplicitAny / strictNullChecks', `S1, S2 an untyped parameter → TS7006 · S4 a possibly-undefined value → TS18048.`, 'lam'),
      box('noUncheckedIndexedAccess / the types', `S3, S8 an unchecked access → TS18048 · S5 the drifted ${c("'CODE'")} → TS2322 · S6, S7 not a ${c('ContentType')} → TS2345.`, 'lam')) },
  { t: 'Attempt A: strict but not the index flag (8/10)', body: tc(score(OUT['l4-yeu']), { title: 'npm run lab9 --from lab9/yeu', fs: 14 }) +
    box('strict alone is not tight', `You turned on ${c('strict')} and fixed the implicit any, but left ${c('noUncheckedIndexedAccess')} off: the config is not tight (B), and S3/S8 slip (E is 6/8). On a codebase that reads by key, the extra flag closes those holes.`, 'do2') },
  { t: 'Attempt B: tight, but the seed hand-copied (9/10)', body: tc(score(OUT['l5-vua']), { title: 'npm run lab9 --from lab9/vua', fs: 14 }) +
    box('The 08/08 bug, waiting', `The config is tight and the code is fixed — 7.5 points. But ${c('seed.ts')} still declares its own ${c('ContentType')} instead of importing it: self-consistent, so tsc passes, but it will drift again. Honesty (C) costs the last point.`, 'lam') },
  { t: 'The reference: 10/10', body: ts(pick(CODE.tsconfigTight, 1, 9), { sm: true, hl: [5, 6] }) +
    tc(L(OUT['l6-ref']).filter((l) => /Score:/.test(l)).join('\n'), { title: 'npm run lab9 — the reference', fs: 15 }) +
    box('Tight config, fixed code, imported seed', `${c('strict')} + ${c('noUncheckedIndexedAccess')} on; the parameter typed and the accesses guarded; ${c('seed.ts')} imports ${c('ContentType')} — so a renamed value is a compile error, not a run-time break. The gate now checks the file 08/08 left out.`, 'xanh') },
  { t: 'Before you call it done', body: cards([
      [c('npm run lab9'), 'Prints Score: 10/10.'],
      ['tight config', 'strict + noUncheckedIndexedAccess.'],
      ['No any / as / !', 'seed.ts imports ContentType.'],
      ['Explain it', 'Which flag refuses each S1–S8.'],
      ['4.5 → 10', 'A CI gate that actually catches drift.'],
      ['Next · Chapter 10', 'Declaration files & modules — types across packages.'],
    ], 3) },
]);
