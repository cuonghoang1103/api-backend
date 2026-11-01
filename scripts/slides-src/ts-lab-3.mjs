/**
 * ts-lab-3 — TypeScript · Chapter 3 · Lab 3 "Booking rules as an array of functions" (01/11/2026). Slug bài: typescript-3-6-lab-luat-dat-phong.
 * Output = chạy thật Node 22.23.3 + tsc 7.0.2, máy chấm scripts/cham-lab-3.mjs: khởi đầu 1/10, "any vào any ra" 6/10, "kiểu hàm thật, không overload/this" 8/10, tham khảo 10/10.
 * Mã/output đọc thẳng từ content/courses/typescript/s03/_ma-ts-lab-3.mjs.
 */
import { lamDeck, ts, tc, two, box, steps, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s03/_ma-ts-lab-3.mjs';

export const deck = { key: 'ts-lab-3', code: 'TS Lab 3', title: 'Lab 3 — rules as functions', sub: 'type a list of functions, a callback, overloads and this' };

const L = (s) => s.split('\n');
const STARTER = `// lab3/src/validate.ts — signatures, bodies cut
export type Problem = { code: string; message: string };
export type Rule = Function;

export function toMinutes(value: string | string[]):
  number | number[] { … }

export function maxSeats(limit) { … }

export function validate(input: BookingInput,
  rules: Rule[], onProblem?: Function): Problem[] { … }

export function totalMinutes(...ranges) { … }`;
const STRICT = L(OUT['l4-strict']).join('\n');
const pickGrader = (k, keep) => L(OUT[k]).filter((l) => keep.test(l)).join('\n');
const STARTER_RUN = '$ npm run lab3\n' + pickGrader('l5-starter', /^[✓✗] [A-E] |^Score/);
const YEU_RUN = '$ node scripts/cham-lab-3.mjs --from lab3/yeu\n' + pickGrader('l7-yeu', /^[✓✗] [A-E] |✗ S\d|^Score/);
const VUA_RUN = '$ node scripts/cham-lab-3.mjs --from lab3/vua\n' + pickGrader('l8-vua', /^[✓✗] [A-E] |✗ S\d|^Score/);
const REF_RUN = '$ node scripts/cham-lab-3.mjs --from src/rules\n' + pickGrader('l9-ref', /^[✓✗] [A-E] |^Score/);
const REF_TYPES = `// src/rules/validate.ts — signatures, bodies cut
export type Rule = (input: BookingInput) => Problem | null;

export function toMinutes(text: string): number;
export function toMinutes(texts: readonly string[]): number[];

export function maxSeats(limit: number): Rule { … }

export function validate(input: BookingInput,
  rules: readonly Rule[],
  onProblem?: (problem: Problem) => void): Problem[]

export function totalMinutes(...ranges: TimeRange[]): number

export type Validator = { rules: readonly Rule[];
  run(this: Validator, input: BookingInput): Problem[] };`;
const SAI_RUN = L(OUT['l6-sai-chay']).slice(1).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 3 — Functions', bai: 'Lab 3' }, [
  { cover: true, t: 'Lab 3 — booking rules<br>as an array of functions', sub: 'Chapter 3 lab · 60–90 minutes · graded by tsc and Node, not by opinion' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `Start from ${c('lab3/src/validate.ts')}: a teammate typed every function as ${c('Function')}`,
      `Give each function a real type: ${c('Rule')}, a rest parameter, a ${c('void')} callback, overloads, ${c('this')}`,
      `No ${c('any')}, no ${c('Function')}, no ${c('as')} cast, no ${c('!')} — and the 10 tests must pass`,
      `Make tsc <b>refuse</b> the 8 wrong uses in ${c('lab3/kiem/sai.ts')}, each with the right code`,
      `Grade yourself any time: ${c('npm run lab3')} → a score out of 10`,
    ]) + box('Why this matters', 'Middleware, validators, event handlers, React callbacks: real code passes functions around all day. A function type is the contract between the code that calls and the code that is called.', 'lam') },
  { t: 'The starter: two errors, almost no protection', body: two(ts(STARTER, { sm: true, hl: [3, 5, 8, 11, 13] }),
      `<div>${tc(STRICT, { title: 'npx tsc -p lab3 — the only two errors', wrap: 36 })}${box('Why so few?', `${c('Function')} accepts any arguments and returns ${c('any')}. An array of ${c('Function')} accepts any function. Few errors means little checking.`, 'do2')}</div>`, 'r64') },
  { t: 'Eight wrong uses — what Node does today', body: tc(SAI_RUN, { title: 'node demo3/ts-lab-3/sai-chay.ts — the starter, run for real', wrap: 104 }) +
    zm(`<table class="t"><tr><th>Silent</th><th>Crash</th></tr>
    <tr><td>S1 a wrong rule approves 45 seats · S2 a string “problem” · S3 ${c('[480] + 30')} is ${c('"48030"')} · S5 works by coercion</td><td>S4 ${c('value.map is not a function')} · S6 ${c('.for is not iterable')} · S7 ${c('rules is not iterable')} · S8 ${c("reading 'rules'")}</td></tr></table>`, 1.0) },
  { t: 'The starter, graded', body: two(tc(STARTER_RUN, { title: 'the untouched starter — real output', wrap: 48 }),
      `<div>${box('B — a loose type upstream breaks correct code', `With ${c('onProblem?: Function')} there is no context, so ${c('(p) => log.push(p)')} becomes an implicit any (TS7006).`, 'do2')}${box('D — two logic bugs', `${c('seats >= limit')} rejects exactly 40 seats · ${c('return [problem]')} inside the loop stops at the first problem. No type can see either.`, 'do2')}</div>`, 'r64') },
  { t: 'Two typical first attempts', body: two(tc(YEU_RUN, { title: 'attempt A — (...args: any[]) => any', wrap: 54 }),
      tc(VUA_RUN, { title: 'attempt B — real Rule type, no overloads, no this', wrap: 54 })) +
    two(box('A: Function with extra steps', `6/10. A rule may take anything and return anything, so S1 and S2 slip through; ${c('[start = 0, end = 0]')} invents data again.`, 'do2'),
      box('B: passes, two holes', `8/10. ${c('toMinutes')} returns ${c('number | number[]')}, so every caller must narrow (B fails, S4 gets TS2345). Nothing stops ${c('run')} being torn off (S8).`, 'lam')) },
  { t: 'The reference solution: 10 of 10', body: two(ts(REF_TYPES, { sm: true, hl: [2, 4, 5, 10, 16] }), tc(REF_RUN, { title: 'src/rules — the reference, graded', wrap: 42 }), 'r64') +
    box('Three ideas', `One function type ${c('Rule')} used in five places · <b>overloads</b>: one shape per input · a <b>${c('this')} parameter</b> that moves the S8 crash to compile time.`, 'xanh') },
  { t: 'Rubric (10 points)', body: zm(`<table class="t"><tr><th>Part</th><th>Points</th><th>How it is checked</th><th>The habit it trains</th></tr>
    <tr><td>A · compiles (strict)</td><td>2</td><td>${c('tsc -p')} on your validate.ts</td><td>every parameter has a type</td></tr>
    <tr><td>B · correct uses compile</td><td>1</td><td>tsc on ${c('kiem/phai-dung.ts')}</td><td>signatures callers use without casts</td></tr>
    <tr><td>C · honesty</td><td>1</td><td>no ${c('any')}, ${c('Function')}, ${c('as')}, ${c('!')}, ${c('@ts-')}</td><td>say what goes in and out</td></tr>
    <tr><td>D · behaviour</td><td>2</td><td>${c('node --test')}: 10 tests</td><td>what no type can see</td></tr>
    <tr><td>E · wrong uses refused</td><td>4 (8 × 0.5)</td><td>each line of ${c('kiem/sai.ts')} has the expected code</td><td>wrong callbacks, wrong arguments, lost this</td></tr></table>`, 1.05) +
    box('Pass mark', '7/10. Attempt B passes with 8 — and still crashes the first time someone passes run as a callback.', 'xanh') },
  { t: 'Hints, from gentle to strong', to: true, body: steps([
      `${c('type Rule = (input: BookingInput) => Problem | null')}, then ${c(': Rule')} on every rule constant`,
      `${c('maxSeats(limit: number): Rule')} returns an arrow function — the closure remembers ${c('limit')}`,
      `${c('rules: readonly Rule[]')}, ${c('onProblem?: (problem: Problem) => void')}; fix the two logic bugs`,
      `${c('totalMinutes(...ranges: TimeRange[])')} — a rest parameter is always an array type`,
      `Two overload signatures for ${c('toMinutes')}, then ${c('run(this: Validator, input)')}`,
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('npm run lab3')} prints <b>Score: 10/10</b> (7 is a pass; 10 is the goal)</li>
    <li>${c('npx tsc -p lab3')} is clean — tests and correct uses included</li>
    <li>No ${c('any')}, no ${c('Function')}; every rule constant is annotated ${c(': Rule')}</li>
    <li>You can point at the line of your file that refuses each of S1–S8</li>
    <li>Commit: ${c('feat(validate): typed rule list, overloads and this (lab 3: 10/10)')}</li></ul>` },
]);
