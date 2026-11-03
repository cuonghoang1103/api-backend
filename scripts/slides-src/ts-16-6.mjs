/** ts-16-6 — TypeScript · Chapter 16 · Final Project — LabFlow TS full-stack. Slug: typescript-16-6-du-an-cuoi-khoa. _ma: s16/_ma-ts-du-an.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s16/_ma-ts-du-an.mjs';
export const deck = { key: 'ts-16-6', code: 'TS 16.6', title: 'Final Project — LabFlow TS full-stack', sub: 'assemble, grade out of 100, tell as STAR' };
const L = (s) => s.split('\n');
const score = (out) => L(out).filter((l) => /^(✓|✗)|^\s+(✓|✗)|^Project score|^\$ /.test(l)).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 16 — Architecture & type-driven design', bai: 'Final Project' }, [
  { cover: true, t: 'Final Project —<br>LabFlow TS full-stack', sub: 'assemble everything · score it out of 100 · tell it as STAR' },
  { t: 'What each chapter contributed', to: true, giua: true, body: `<ul>
    <li>Rules → TypeScript (1) · domain model (4) · booking state machine (5) · generic Repo &amp; Result&lt;T&gt; (6)</li>
    <li>DTO layer (8) · strict tsconfig + CI gate (9) · typed Express API + error envelope (11)</li>
    <li>Typed React form &amp; hook (12) · Zod + Prisma at the boundaries (13)</li>
    <li>Service over an abstract repo, #private (14) · transpile-ready build (15) · branded LabCode, illegal states (16)</li>
    <li>Each left code in the project; the capstone verifies it still holds together</li></ul>` },
  { t: 'The 100-point grader', to: true, body: cards([
      ['A · type-check (20)', 'tsc --noEmit is clean under the strict config — the whole project, including the early chapters’ rules and model.'],
      ['B · tests (20)', 'node --test runs every src/**/*.test.ts — all 60 project tests pass.'],
      ['C · chapter labs (60)', 'six representative labs (9, 11, 12, 13, 14, 15) each score 10/10 on their own grader.'],
      ['pass / distinction', '70 of 100 to pass, 90 for distinction — the reference project scores 100.'],
      ['one command', 'npm run du-an runs all three and tallies them to a single number.'],
      ['early chapters', 'rules, model, unions, generics are proven by the type-check (A) and the 60 tests (B).'],
    ], 3) },
  { t: 'A distinction run', body: tc(score(OUT['du-an']), { title: 'npm run du-an', fs: 14 }) +
    box('Your proof of work', `${c('100/100 — DISTINCTION')}: typecheck clean, 60/60 tests, and Labs 9, 11, 12, 13, 14, 15 each 10/10. One reproducible number that says the whole system holds.`, 'xanh') },
  { t: 'Tell it as a STAR story', body: cards([
      ['Situation', 'A lab-booking system in loose JavaScript — invalid states reaching production.'],
      ['Task', 'Make invalid states impossible; catch errors before they ship.'],
      ['Action', 'Strict TS, branded types, discriminated unions, Zod validation, a CI gate.'],
      ['Result', 'A full-stack system scoring 100/100 — illegal states unrepresentable.'],
      ['For your CV', 'Link each claim to a file.'],
      ['In an interview', 'You can point to the line and explain it.'],
    ], 3) },
  { t: 'What a reviewer will look for', to: true, giua: true, body: `<ul>
    <li>No <b>any</b> at the boundaries · validation where data enters</li>
    <li>Discriminated unions instead of boolean flags</li>
    <li><b>readonly</b> where things must not change · honest returns (<b>T | undefined</b>)</li>
    <li>Types derived from one source, never copied</li>
    <li>Each is a line you can point to and explain — that is what a reviewer wants to see</li></ul>` },
  { t: 'Ship it', to: true, giua: true, body: two(
      box('On GitHub', `Push LabFlow TS with ${c('npm run du-an')} in CI and the ${c('100/100')} badge in the README.`, 'xanh'),
      box('The README', `Tell the STAR story; link each claim to a file — branded types, Zod validation, the CI gate.`, 'lam')) +
    box('The one thing that shows you can do it', `A complete, type-driven, full-stack project — not just that you have read about it.`, '') },
  { t: 'You finished the course', to: true, giua: true, body: two(
      box('What you built', `Sixteen chapters, fifteen graded labs, one full-stack capstone — rules, a domain model, a validated API, a React form, a database layer, a transpile-ready build.`, 'xanh'),
      box('What you can now do', `Move a whole class of bugs from run time to compile time; make illegal states unrepresentable; validate at every boundary and trust the types inside.`, 'lam')) +
    box('🎓 The compiler is now your pair', `Let it hold the invariants, and go build. You have the portfolio piece to prove you can do this — not just that you have read about it.`, '') },
]);
