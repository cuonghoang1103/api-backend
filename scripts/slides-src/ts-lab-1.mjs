/**
 * ts-lab-1 — TypeScript · Chapter 1 · Lab 1 "Convert LabFlow's rules to TypeScript" (01/11/2026). Slug bài: typescript-1-6-lab-chuyen-doi.
 * Output = chạy thật Node 22.23.3 + tsc 7.0.2, máy chấm scripts/cham-lab-1.mjs: khởi đầu 2.5/10, "any" 5.5/10, string/number 8/10, tham khảo 10/10.
 */
import { lamDeck, ts, tc, two, box, steps, c, zm } from './_ts-chung.mjs';

export const deck = { key: 'ts-lab-1', code: 'TS Lab 1', title: 'Lab 1 — convert the rules', sub: 'LabFlow’s rules, from JavaScript to TypeScript' };

const STARTER = `export function checkSlot(start, end) {
  const s = parseTime(start);
  const e = parseTime(end);
  …
}

export function needsApproval({ seats, role }) {
  …
  if (role === 'LECTURER' || role === 'ADMIN')
    return false;
  return seats > APPROVAL_SEATS;
}`;
const STARTER_RUN = `$ npm run lab1
✗ A  your src/ compiles (strict) — 0/2
    src/booking.ts(10,27): error TS7006: Parameter 'start' implicitly has an 'any' type.
    …
✗ B  correct calls still compile — 0/1
✓ C  no any / no @ts- directives — 1/1
✗ D  behaviour tests pass (0/15) — 0/2
    # Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/src/time.js' imported from …/src/booking.ts
✗ E  wrong calls refused (3/8) — 1.5/4

Score: 2.5/10 — NOT YET (pass mark 7)`;
const YEU = `$ node scripts/cham-lab-1.mjs --from lab1/yeu
✓ A  your src/ compiles (strict) — 2/2
✓ B  correct calls still compile — 1/1
✗ C  no any / no @ts- directives — 0/1
✓ D  behaviour tests pass (15/15) — 2/2
✗ E  wrong calls refused (1/8) — 0.5/4

Score: 5.5/10 — NOT YET (pass mark 7)`;
const VUA = `$ node scripts/cham-lab-1.mjs --from lab1/vua
…
✗ B  correct calls still compile — 0/1
    kiem/phai-dung.ts(9,9): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
    kiem/phai-dung.ts(14,7): error TS2322: Type 'string' is not assignable to type '"CONFIRMED" | "PENDING"'.
    …
    ✗ S5 roles are upper-case — expected TS2820, got no error
    ✗ S7 there is no APPROVED status — expected TS2367, got no error
✗ E  wrong calls refused (6/8) — 3/4

Score: 8/10 — PASS (pass mark 7)`;
const REF_TYPES = `// src/rules/booking.ts — types + 2 signatures, condensed
export type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';
export type SlotCode = 'OFF_GRID' | 'END_BEFORE_START'
  | 'OUTSIDE_HOURS' | 'TOO_LONG';
export type SlotResult = { ok: true; minutes: number }
  | { ok: false; code: SlotCode };
export type Booking = { lab: string; start: string; end: string;
  minutes: number; status: 'PENDING' | 'CONFIRMED' };

export function checkSlot(start: string, end: string): SlotResult
export function usageRate(
  bookings: readonly { minutes: number }[]): number`;
const REF_RUN = `$ node scripts/cham-lab-1.mjs --from src/rules
✓ A  your src/ compiles (strict) — 2/2
✓ B  correct calls still compile — 1/1
✓ C  no any / no @ts- directives — 1/1
✓ D  behaviour tests pass (15/15) — 2/2
    …
    ✓ S5 roles are upper-case — expected TS2820, got TS2820
    ✓ S7 there is no APPROVED status — expected TS2367, got TS2367
✓ E  wrong calls refused (8/8) — 4/4

Score: 10/10 — PASS (pass mark 7)`;

export const slides = lamDeck({ chuong: 'Chapter 1 — Why TypeScript exists', bai: 'Lab 1' }, [
  { cover: true, t: 'Lab 1 — convert LabFlow’s<br>rules to TypeScript', sub: 'Chapter 1 lab · 60–90 minutes · graded by tsc and Node, not by opinion' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `Start from ${c('lab1/src/time.ts')} and ${c('booking.ts')}: LabFlow’s JavaScript rules, only renamed to ${c('.ts')}`,
      `Make them compile under the course’s <b>strict</b> tsconfig — with no ${c('any')} and no ${c('@ts-ignore')}`,
      `Keep the behaviour: the 15 tests in ${c('lab1/test/rules.test.ts')} must pass under Node 22`,
      `Make tsc <b>refuse</b> each of the 8 wrong calls in ${c('lab1/kiem/sai.ts')}, with the right error code`,
      `Grade yourself any time: ${c('npm run lab1')} → a score out of 10`,
    ]) + box('Why this way', 'Compiling is easy — one word, <b>any</b>, makes every error vanish. The lab measures what types are for: <b>wrong calls rejected before anything runs</b>.', 'lam') },
  { t: 'The code under test — and the untouched starter', body: two(ts(STARTER, { sm: true, hl: [1, 7, 9] }),
      tc(STARTER_RUN, { title: 'the starter, graded — real output', wrap: 50 })) +
    box('Already 3 of 8 for free', `Renaming alone made tsc check the argument count (S3), the destructured property names (S4) and the returned object (S6). The 13 errors are all “implicitly has an ‘any’ type” — and ${c("'./time.js'")} does not exist at runtime.`, 'xanh') },
  { t: 'Eight wrong calls tsc must refuse', body: zm(`<table class="t"><tr><th>#</th><th>Wrong call</th><th>Code</th><th>What a user would see without it</th></tr>
    <tr><td>S1</td><td>${c('parseTime(420)')}</td><td>TS2345</td><td>“Invalid time 420” crash at runtime</td></tr>
    <tr><td>S2</td><td>${c("formatTime('07:30')")}</td><td>TS2345</td><td>“NaN:NaN” printed on the schedule</td></tr>
    <tr><td>S3</td><td>${c("checkSlot('08:00')")}</td><td>TS2554</td><td>crash: Invalid time "undefined"</td></tr>
    <tr><td>S4</td><td>${c("needsApproval({ seat: 31, … })")}</td><td>TS2561</td><td>RangeError “got undefined”</td></tr>
    <tr><td>S5</td><td>${c("role: 'lecturer'")}</td><td>TS2820</td><td>a lecturer silently waits for approval</td></tr>
    <tr><td>S6</td><td>${c('createBooking(input).minute')}</td><td>TS2551</td><td>undefined minutes on the receipt</td></tr>
    <tr><td>S7</td><td>${c("status === 'APPROVED'")}</td><td>TS2367</td><td>a branch that can never run</td></tr>
    <tr><td>S8</td><td>${c('usageRate([{ minute: 60 }])')}</td><td>TS2561</td><td>usage rate NaN on the dashboard</td></tr></table>`, 1.02) },
  { t: 'Two typical first attempts', body: two(tc(YEU, { title: 'attempt A — every red line silenced with any', wrap: 56 }),
      tc(VUA, { title: 'attempt B — string and number only', wrap: 56 })) +
    two(box('A: worse than doing nothing', `Compiles, tests pass — and only <b>1 of 8</b> wrong calls refused. The untouched starter refused 3. ${c('any')} switched off the checks renaming had given for free.`, 'do2'),
      box('B: passes, not finished', `${c('role: string')} accepts “lecturer”; inferred ${c('status: string')} accepts “APPROVED”; inferred ${c('minutes: number | undefined')} breaks correct callers.`, 'lam')) },
  { t: 'The reference solution: 10 of 10', body: two(ts(REF_TYPES, { sm: true, hl: [2, 5, 7] }), tc(REF_RUN, { title: 'src/rules — the reference, graded', wrap: 42 }), 'r64') +
    box('What made the difference', `Literal unions for <b>closed sets</b> (roles, codes, statuses) · an <b>explicit return type</b> on ${c('checkSlot')} and ${c('createBooking')} · ${c("import … from './time.ts'")}.`, 'xanh') },
  { t: 'Rubric (10 points)', body: zm(`<table class="t"><tr><th>Part</th><th>Points</th><th>How it is checked</th><th>The habit it trains</th></tr>
    <tr><td>A · your src/ compiles (strict)</td><td>2</td><td>${c('tsc -p')} on your two files</td><td>no implicit any</td></tr>
    <tr><td>B · correct calls still compile</td><td>1</td><td>tsc on ${c('kiem/phai-dung.ts')}</td><td>types precise, not just strict</td></tr>
    <tr><td>C · honesty</td><td>1</td><td>no ${c('any')}, ${c('@ts-ignore')}, ${c('@ts-nocheck')}, ${c('@ts-expect-error')}</td><td>fix, don’t silence</td></tr>
    <tr><td>D · behaviour unchanged</td><td>2</td><td>${c('node --test')}: 15 tests</td><td>types change nothing at runtime</td></tr>
    <tr><td>E · wrong calls refused</td><td>4 (8 × 0.5)</td><td>each line of ${c('kiem/sai.ts')} has the expected code</td><td>types that catch real bugs</td></tr></table>`, 1.05) +
    box('Pass mark', '7/10. Aim for 10 — attempt B passes with 8 and still lets a lecturer wait for approval.', 'xanh') },
  { t: 'Hints, from gentle to strong', to: true, body: steps([
      `Fix the import first: Node runs ${c('.ts')} files, so write ${c("'./time.ts'")}`,
      `Annotate every parameter; read each TS7006/TS7031 as “tell me what comes in”`,
      `Which values are a <b>closed list</b>? Roles, slot codes, statuses → literal unions`,
      `Write the return type of ${c('checkSlot')} yourself: “ok with minutes, or not ok with a code”`,
      `${c('usageRate')} only reads ${c('minutes')}: take ${c('readonly { minutes: number }[]')}`,
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('npm run lab1')} prints <b>Score: 10/10</b> (7 is a pass; 10 is the goal)</li>
    <li>${c('grep -n any lab1/src/*.ts')} finds nothing</li>
    <li>${c('lab1/test')}, ${c('lab1/kiem')} and the grader are unchanged — you edited only ${c('lab1/src')}</li>
    <li>You can say, for each of S1–S8, which type refuses it</li>
    <li>Commit: ${c('feat(rules): LabFlow rules in strict TypeScript (lab 1: 10/10)')}</li></ul>` },
]);
