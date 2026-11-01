/**
 * ts-lab-2 — TypeScript · Chapter 2 · Lab 2 "Strict null on the lab schedule" (01/11/2026). Slug bài: typescript-2-6-lab-lich-phong.
 * Output = chạy thật Node 22.23.3 + tsc 7.0.2, máy chấm scripts/cham-lab-2.mjs: khởi đầu 1/10, "! và as" 4/10, "null thật, mảng thường" 7/10, tham khảo 10/10.
 * Mã/output đọc thẳng từ content/courses/typescript/s02/_ma-ts-lab-2.mjs.
 */
import { lamDeck, ts, tc, two, box, steps, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s02/_ma-ts-lab-2.mjs';

export const deck = { key: 'ts-lab-2', code: 'TS Lab 2', title: 'Lab 2 — strict null on the schedule', sub: 'make a loosely-typed module honest' };

const L = (s) => s.split('\n');
const ST = L(CODE.starter);
const bo = (lines) => lines.filter((l) => !/^\s*\/\//.test(l)).map((l) => l.replace(/\s+\/\/.*$/, ''));
const STARTER = bo(ST.slice(5, 16)).concat(['…', 'export function findEntry(', '  schedule: ScheduleEntry[], id: number,', '): ScheduleEntry {'], ST.slice(29, 31)).join('\n');
const STRICT = L(OUT['l4-strict']);
const STRICT_GON = [STRICT[0], STRICT[3], STRICT[4], STRICT[5], '… 10 errors in total'].join('\n');
const LOOSE = L(OUT['l3-loose']).join('\n');
const pickGrader = (k, keep) => L(OUT[k]).filter((l) => keep.test(l)).join('\n');
const STARTER_RUN = '$ npm run lab2\n' + pickGrader('l5-starter', /^[✓✗] [A-E] |^Score/);
const YEU_RUN = '$ node scripts/cham-lab-2.mjs --from lab2/yeu\n' + pickGrader('l7-yeu', /^[✓✗] [A-E] |found:|^Score/);
const VUA_RUN = '$ node scripts/cham-lab-2.mjs --from lab2/vua\n' + pickGrader('l8-vua', /^[✓✗] [A-E] |✗ S\d|^Score/);
const REF_RUN = '$ node scripts/cham-lab-2.mjs --from src/rules\n' + pickGrader('l9-ref', /^[✓✗] [A-E] |^Score/);
const RF = L(CODE.ref);
const REF_TYPES = bo(RF.slice(4, 18)).join('\n');
const SAI_RUN = L(OUT['l6-sai-chay']).slice(1).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 2 — The basic type system', bai: 'Lab 2' }, [
  { cover: true, t: 'Lab 2 — strict null<br>on the lab schedule', sub: 'Chapter 2 lab · 60–90 minutes · graded by tsc and Node, not by opinion' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `Start from ${c('lab2/src/schedule.ts')}: a teammate wrote it with ${c('"strict": false')} — 0 errors there`,
      `Make it compile under the course’s <b>strict</b> tsconfig — no ${c('any')}, no ${c('as')} cast, no ${c('!')}`,
      `Keep the behaviour: the 13 tests in ${c('lab2/test/schedule.test.ts')} must pass`,
      `Make tsc <b>refuse</b> each of the 8 wrong uses in ${c('lab2/kiem/sai.ts')}, with the right code`,
      `Grade yourself any time: ${c('npm run lab2')} → a score out of 10`,
    ]) + box('Why this way', 'Every team that turns strict on meets this file. The question is not “how do I make the errors go away” but “what is the truth about this data?”', 'lam') },
  { t: 'The starter: 0 errors loose, 10 errors strict', body: two(ts(STARTER, { sm: true, hl: [3, 10, 11, 15] }),
      `<div>${tc(LOOSE, { title: 'with strict: false', wrap: 44 })}${tc(STRICT_GON, { title: 'with the course tsconfig — real output', wrap: 44 })}</div>`, 'r64') +
    box('Two kinds of error', `A signature that promises too much (${c('ScheduleEntry')} when ${c('find')} can return ${c('undefined')}) · a list typed as ${c('number[]')} where position 0 might not exist.`, 'xanh') },
  { t: 'Eight wrong uses — what Node does today', body: tc(SAI_RUN, { title: 'node demo2/ts-lab-2/sai-chay.ts — the starter, run for real', wrap: 100 }) +
    zm(`<table class="t"><tr><th>S1 · S2 · S3</th><th>S4</th><th>S5 · S6</th><th>S7 · S8</th></tr>
    <tr><td>crash: Cannot read properties of undefined / null</td><td>${c('null + 30')} is ${c('30')}: “opens at 00:30”</td><td>a range loses its end, or is changed for everyone</td><td>a lab that does not exist; the list grows</td></tr>
    <tr><td>TS2532 · TS18047 · TS18048</td><td>TS2531</td><td>TS2322 · TS2540</td><td>TS2322 · TS2339</td></tr></table>`, 1.0) },
  { t: 'The starter, graded', body: two(tc(STARTER_RUN, { title: 'the untouched starter — real output', wrap: 48 }),
      `<div>${box('A, B — 0', 'Ten strict errors, and the correct uses (a NULL note, a read-only list, range[0]) do not fit the guessed types.', 'do2')}${box('D — three runtime bugs', `${c("''")} becomes “(no note)” because of ${c('||')} · the caller’s array is sorted in place · a third time is dropped. Strict mode cannot see any of them.`, 'do2')}</div>`, 'r64') },
  { t: 'Two typical first attempts', body: two(tc(YEU_RUN, { title: 'attempt A — tests fixed, errors silenced with ! and as', wrap: 54 }),
      tc(VUA_RUN, { title: 'attempt B — honest null, plain arrays', wrap: 54 })) +
    two(box('A: green tests, zero protection', `Compiles, 13/13 tests — and <b>0 of 8</b> wrong uses refused. Each ${c('!')} and ${c('as')} is the old ${c('strict: false')} promise, hidden in one more place.`, 'do2'),
      box('B: passes, shapes missing', `S1–S4 refused: every crash is gone. But ${c('number[]')} and ${c('string[]')} let S5–S8 through, and ${c('?? 0')} invents a start time.`, 'lam')) },
  { t: 'The reference solution: 10 of 10', body: two(ts(REF_TYPES, { sm: true, hl: [1, 2, 4, 11, 12] }), tc(REF_RUN, { title: 'src/rules — the reference, graded', wrap: 42 }), 'r64') +
    box('Three ideas, no tricks', `Missing values written in the type (${c('| null')}, ${c('?:')}, ${c('| undefined')}) · a <b>read-only tuple</b> for the range · ${c('as const')} + a <b>derived</b> ${c('LabCode')}.`, 'xanh') },
  { t: 'Rubric (10 points)', body: zm(`<table class="t"><tr><th>Part</th><th>Points</th><th>How it is checked</th><th>The habit it trains</th></tr>
    <tr><td>A · compiles (strict)</td><td>2</td><td>${c('tsc -p')} on your schedule.ts</td><td>“maybe missing” is in the type</td></tr>
    <tr><td>B · correct uses compile</td><td>1</td><td>tsc on ${c('kiem/phai-dung.ts')}</td><td>types that fit real rows</td></tr>
    <tr><td>C · honesty</td><td>1</td><td>no ${c('any')}, ${c('as')} (except ${c('as const')}), ${c('!')}, ${c('@ts-')}</td><td>handle it, don’t promise it away</td></tr>
    <tr><td>D · behaviour</td><td>2</td><td>${c('node --test')}: 13 tests</td><td>what strict cannot see</td></tr>
    <tr><td>E · wrong uses refused</td><td>4 (8 × 0.5)</td><td>each line of ${c('kiem/sai.ts')} has the expected code</td><td>types that stop crashes and silent bugs</td></tr></table>`, 1.05) +
    box('Pass mark', '7/10. Attempt B passes with exactly 7 — and still lets a booking of a lab called BE-999 through.', 'xanh') },
  { t: 'Hints, from gentle to strong', to: true, body: steps([
      `Return types first: ${c('find')} can give ${c('undefined')}, a free lab has no first start → ${c('| undefined')}, ${c('| null')}`,
      `NULL in the database is ${c('null')}; a field that is simply not there is ${c('?:')}. Then ${c('??')}, not ${c('||')}`,
      `Read-only parameters: ${c('readonly ScheduleEntry[]')}, and ${c('toSorted')} instead of ${c('sort')}`,
      `A range is exactly two numbers: ${c('readonly [start: number, end: number]')}`,
      `${c("LABS = [...] as const")} and ${c('(typeof LABS)[number]')}; check outside text with ${c('some')}`,
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('npm run lab2')} prints <b>Score: 10/10</b> (7 is a pass; 10 is the goal)</li>
    <li>${c('npx tsc -p lab2')} is clean — tests and correct uses included</li>
    <li>No ${c('!')}, no ${c('as')} except ${c('as const')}, no invented ${c('?? 0')} defaults</li>
    <li>You can say, for each of S1–S8, which type refuses it — and whether it used to crash or lie</li>
    <li>Commit: ${c('fix(schedule): strict-null schedule rules (lab 2: 10/10)')}</li></ul>` },
]);
