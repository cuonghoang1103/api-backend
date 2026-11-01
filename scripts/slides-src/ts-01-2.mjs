/**
 * ts-01-2 — TypeScript · Chapter 1 · Lesson 1.2 "What a type checker proves — and what it cannot" (01/11/2026).
 * Slug bài: typescript-1-2-chung-minh-gi. Mã + output lấy THẲNG từ content/courses/typescript/s01/_ma-ts-01-2.mjs
 * (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2, demo1/ts-01-2/).
 */
import { lamDeck, ts, tc, two, box, cards, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s01/_ma-ts-01-2.mjs';

export const deck = { key: 'ts-01-2', code: 'TS 1.2', title: 'What a type checker proves', sub: 'and what it cannot' };

const lines = (s, a, b) => s.split('\n').slice(a, b).join('\n');
const LOGIC = OUT['42-logic-test'].split('\n').filter((l) => /^\$|^✔|^✖ 09.*ms\)$|^ℹ fail|^  \+  |^  -  /.test(l)).filter((l, i, a) => a.indexOf(l) === i).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 1 — Why TypeScript exists', bai: '1.2' }, [
  { cover: true, t: 'What a type checker proves —<br>and what it cannot', sub: 'Chapter 1 · Lesson 1.2 — the boundary of the guarantee' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What ${c('tsc')} really <b>proves</b>: your files agree with each other</li>
    <li>What it <b>cannot see</b>: data that arrives from outside at runtime</li>
    <li>Why ${c('as')} is a promise, not a conversion</li>
    <li>Three holes you open yourself: ${c('arr[i]')}, ${c('!')}, ${c('any')}</li>
    <li>Wrong logic compiles — tests still matter</li>
    <li>A <b>type guard</b> at the boundary turns a claim into a fact</li></ul>` },
  { t: 'It proves: every caller matches every declaration', body: ts(lines(CODE.approval, 2, 8), { sm: true, hl: [2] }) + two(
      ts(lines(CODE.form, 2, 4), { sm: true, hl: [2] }),
      tc(OUT['11-hop-dong'], { title: 'terminal — one signature changed', wrap: 46 }), 'r64') +
    box('Consistency between YOUR files', `The signature changed in one file; ${c('tsc')} lists every old caller, in every file, before anything runs. That is a real proof — about code it can read.`, 'xanh') },
  { t: 'It cannot see: data from outside', body: ts(lines(CODE.handler, 2, 8), { sm: true, hl: [3] }) +
    tc(OUT['21-bien-tsc'] + '\n' + OUT['22-bien-run'], { title: 'terminal — tsc is happy, then three real bodies', wrap: 100 }) +
    box('Compiles. Crashes once, lies once.', `${c('JSON.parse')} returns ${c('any')}, so the annotation is accepted without a check. ${c('"31"')} is a string — and ${c('"lecturer"')} silently becomes a student: <b>PENDING</b> instead of CONFIRMED.`, 'do2') },
  { t: 'Trap: “as” is a promise, not a conversion', body: zm(two(ts(lines(CODE.handlerAs, 3, 7), { sm: true, hl: [2] }),
      box('What “as” does', `Nothing at runtime. It is erased like every type — the value is exactly what ${c('JSON.parse')} produced. It only tells the compiler what to <b>believe</b>.`, 'do2'), 'r64') +
    tc(OUT['23-bien-as-run'], { title: 'terminal — same three bodies, same result', wrap: 100 }) +
    box('When is “as” fine?', `When YOU know more than the compiler and nothing outside is involved — e.g. ${c('as const')} (Chapter 2). Never on a request body, a file or ${c('process.env')}.`, 'lam'), 1.08) },
  { t: 'Hole 1: reading past the end of an array', body: two(
      ts(CODE.labs, { sm: true, hl: [3] }) + tc(OUT['31-chi-so-on'] + '\n' + OUT['32-chi-so-off'], { title: 'flag ON: error · flag OFF: silent', wrap: 42 }),
      tc(lines(OUT['33-chi-so-run'], 0, 6), { title: 'node — the flag-off build runs', wrap: 42 })) +
    box('Why our tsconfig turns it on', `${c('noUncheckedIndexedAccess')} makes ${c('labs[5]')} a ${c('string | undefined')}; without it TypeScript assumes every index exists.`, 'lam') },
  { t: 'Holes 2 and 3: “!” and “any”', body: two(
      ts(CODE.nonNull, { sm: true, hl: [3] }) + tc(lines(OUT['35-non-null-run'], 0, 6), { title: 'node — compiles, then crashes', wrap: 42 }),
      ts(CODE.anyTs, { sm: true, hl: [3] }) + tc(OUT['36-any-run'], { title: 'node — compiles, wrong answer' })) +
    box('You opened these holes yourself', `${c('!')} says “not undefined, trust me”; ${c('any')} switches checking off. ${c('tsc -p lo-hong')} reports 0 errors for both files. Lesson 1.4 is all about ${c('any')}.`, 'do2') },
  { t: 'Wrong logic compiles — tests catch it', body: ts(lines(CODE.slot, 5, 10), { sm: true, hl: [4] }) + two(
      tc(OUT['41-logic-tsc'] + '\n' + LOGIC, { title: 'tsc green · node --test red', wrap: 54 }),
      box('One character', `${c('e < s')} instead of ${c('e <= s')}: both are booleans, so the types are fine. Only a test that asks “is 09:00–09:00 a slot?” sees it — the report shows ${c('ok: true, minutes: 0')}.`, 'lam')) },
  { t: 'Types vs tests: what each one catches', body: `<table class="t"><tr><th>Mistake</th><th>tsc</th><th>a test</th></tr>
    <tr><td>Old caller after a signature change</td><td>✅ every caller, at once</td><td>only callers that a test runs</td></tr>
    <tr><td>Wrong-typed request body</td><td>❌ believes the annotation</td><td>❌ unless the test sends it</td></tr>
    <tr><td>Index past the end</td><td>✅ with ${c('noUncheckedIndexedAccess')}</td><td>only if tested</td></tr>
    <tr><td>${c('!')} / ${c('as')} / ${c('any')} that lie</td><td>❌ trusts you</td><td>only if tested</td></tr>
    <tr><td>Off-by-one: ${c('<')} vs ${c('<=')}</td><td>❌ both are booleans</td><td>✅ boundary test</td></tr></table>` +
    box('So you need both — and a check at the boundary', 'Types prove the inside is consistent; tests prove the logic; runtime validation proves outside data.', 'xanh') },
  { t: 'The fix at the boundary: a type guard', body: ts(lines(CODE.guard, 4, 16), { sm: true, hl: [3] }) +
    box('Read it in plain words', `${c('x: unknown')} — “I do not know what this is yet”. ${c('x is BookingInput')} — “if I return true, treat x as a BookingInput afterwards”. The checks inside are ordinary JavaScript that <b>run</b>.`, 'lam') },
  { t: 'Using the guard before createBooking', body: ts(lines(CODE.handlerSafe, 3, 8), { hl: [2, 3] }) +
    tc(OUT['51-safe-run'], { title: 'node — the same three bodies', wrap: 100 }) +
    box('Claim → fact', `Without the ${c('if')}, ${c('createBooking(data)')} is refused: <i>Argument of type 'unknown' is not assignable to parameter of type 'BookingInput'</i> (TS2345). ${c('unknown')} forces the check that ${c('any')} lets you skip.`, 'xanh') },
  { t: 'Trap: the guard itself is trusted', body: ts(lines(CODE.guardThieu, 2, 4), { sm: true }) +
    tc(OUT['53-thieu-run'], { title: 'node — this guard forgot the role check', wrap: 100 }) +
    box('x is BookingInput is also a promise', `${c('tsc')} does not check that your guard checks everything. Forget ${c('role')} and ${c('"lecturer"')} walks in again. Chapter 13 replaces hand-written guards with one Zod schema.`, 'do2') },
  { t: 'The guarantee, in four lines', body: cards([
      ['✅ It proves', 'Every value flows into a place that expects its shape — <b>given</b> your annotations are true.'],
      ['🤝 It assumes', `Every ${c('as')}, ${c('!')}, ${c('any')} and every type you put on outside data.`],
      ['🙈 It cannot see', `Runtime data: request bodies, ${c('JSON.parse')}, ${c('process.env')}, database rows.`],
      ['🛡 So the rule is', 'Check the boundary at runtime (guard now, Zod in Chapter 13); then the inside is genuinely proven.'],
    ], 2) },
]);
