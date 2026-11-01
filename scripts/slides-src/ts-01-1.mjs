/**
 * ts-01-1 — TypeScript · Chapter 1 · Lesson 1.1 "Three bugs JavaScript ships to production" (01/11/2026). Slug bài: typescript-1-1-ba-con-bug.
 * Output = chạy thật Node 22.23.3 + tsc 7.0.2 trên labflow-ts (demo1/ts-01-1: usage-typo.js, shape.js, role.js, ts/, ge/).
 */
import { lamDeck, ts, js, tc, two, box, steps, cards, c, zm } from './_ts-chung.mjs';

export const deck = { key: 'ts-01-1', code: 'TS 1.1', title: 'Three bugs JavaScript ships to production', sub: 'and the compiler that refuses them first' };

const APPROVAL = `export function needsApproval({ seats, role }) {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError('seats must be a positive integer, got ' + seats);
  }
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats > APPROVAL_SEATS;      // BR-06: more than 30
}

export function usageRate(bookings) {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}`;
const TYPO_JS = `export function usageRate(bookings) {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);   // typo
  return rate;
}

console.log('usage today:', usageRate([
  { lab: 'BE-201', minutes: 120 }, { lab: 'BE-201', minutes: 90 }]));`;
const TYPO_OUT = `$ node demo1/ts-01-1/usage-typo.js
usage today: NaN
[exit 0]`;
const TYPO_TS = `export function usageRate(bookings: readonly { minutes: number }[]): number {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);   // typo
  return rate;
}`;
const TYPO_TSC = `$ npx tsc -p demo1/ts-01-1/ts
demo1/ts-01-1/ts/usage-typo.ts(7,39): error TS2551: Property 'minute' does not exist on type '{ minutes: number; }'. Did you mean 'minutes'?
[exit 1]`;
const SHAPE_OUT = `$ node demo1/ts-01-1/shape.js
needsApproval({ seat: 31, role: 'STUDENT' }) → throws RangeError: seats must be a positive integer, got undefined
checkSlot(480, 600) → throws TypeError: Invalid time "480", expected HH:MM
checkSlot('08:00') → throws TypeError: Invalid time "undefined", expected HH:MM
[exit 0]`;
const CALLS = `import { checkSlot, needsApproval } from '../../../src/rules/booking.ts';

needsApproval({ seat: 31, role: 'STUDENT' });
checkSlot(480, 600);
checkSlot('08:00');
needsApproval({ seats: 31, role: 'lecturer' });`;
const CALLS_TSC = `$ npx tsc -p demo1/ts-01-1/ts
demo1/ts-01-1/ts/calls.ts(4,17): error TS2561: Object literal may only specify known properties, but 'seat' does not exist in type '{ seats: number; role: Role; }'. Did you mean to write 'seats'?
demo1/ts-01-1/ts/calls.ts(5,11): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
demo1/ts-01-1/ts/calls.ts(6,1): error TS2554: Expected 2 arguments, but got 1.
demo1/ts-01-1/ts/calls.ts(7,28): error TS2820: Type '"lecturer"' is not assignable to type 'Role'. Did you mean '"LECTURER"'?
…`;
const ROLE_OUT = `$ node demo1/ts-01-1/role.js
LECTURER, 31 seats → needs approval? false
lecturer, 31 seats → needs approval? true
[exit 0]`;
const ROLE_TS = `export type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';

export function needsApproval(
  { seats, role }: { seats: number; role: Role },
): boolean { … }`;
const GE = `return seats >= APPROVAL_SEATS;   // should be >`;
const GE_TSC = `$ npx tsc -p demo1/ts-01-1/ge
[exit 0]`;
const GE_TEST = `$ node --test --test-reporter=spec demo1/ts-01-1/ge/approval.test.ts
✔ 31 student seats need approval (BR-06) (1.3265ms)
✖ exactly 30 student seats do NOT need approval (BR-06) (0.484417ms)
ℹ pass 1
ℹ fail 1
…
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  true !== false`;

export const slides = lamDeck({ chuong: 'Chapter 1 — Why TypeScript exists', bai: '1.1' }, [
  { cover: true, t: 'Three bugs JavaScript<br>ships to production', sub: 'Chapter 1 · Lesson 1.1 — the same LabFlow rules, run by Node and checked by tsc' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Chapter 1 goal: turn a JavaScript module into <b>strict TypeScript</b> and pass Lab 1</li>
    <li>The LabFlow rules you will convert: ${c('checkSlot')}, ${c('needsApproval')}, ${c('usageRate')}</li>
    <li>Three kinds of bug: the <b>typo</b>, the <b>wrong shape</b>, the <b>wrong value</b></li>
    <li>What Node does with each — crash, or worse, a silent wrong answer</li>
    <li>What ${c('tsc')} says — five error codes you will see every day</li>
    <li>Why compiling is <b>not</b> the same as being correct</li></ul>` },
  { t: 'The code under test: LabFlow rules in JavaScript', body: js(APPROVAL, { sm: true, hl: [6, 11] }) + two(box('Two rules from js/booking.js', `${c('needsApproval')} implements <b>BR-06</b>: a student needs approval above 30 seats. ${c('usageRate')} adds up how much of the day (07:00–21:00 = 840 minutes) is booked.`, 'lam'), box('Same code as the Testing course', 'LabFlow Lite, copied unchanged. Chapter 1 converts it to TypeScript; Lab 1 grades your version.', 'xanh')) },
  { t: 'Bug 1 — the typo: JavaScript says NaN', body: js(TYPO_JS, { sm: true, hl: [3] }) + tc(TYPO_OUT, { title: 'terminal — Node 22.23.3' }) +
    box('No error, exit code 0', `${c('b.minute')} does not exist, so it is ${c('undefined')}; ${c('undefined / 840')} is ${c('NaN')}. The dashboard shows “NaN%” and nobody knows where it came from.`, 'do2') },
  { t: 'Bug 1 in TypeScript: TS2551', body: ts(TYPO_TS, { sm: true, hl: [1, 3] }) + tc(TYPO_TSC, { wrap: 92 }) +
    box('One annotation does it', `The parameter now says every booking has ${c('minutes: number')}. tsc knows ${c('minute')} is not there — and even suggests the fix.`, 'xanh') },
  { t: 'Bug 2 — the wrong shape: it fails only when it runs', body: tc(SHAPE_OUT, { title: 'terminal — Node 22.23.3', wrap: 88 }) +
    two(box('Wrong key, wrong type, missing argument', `${c('seat')} instead of ${c('seats')} · numbers instead of ${c('"HH:MM"')} · no end time. All three throw — but only when that line actually runs.`, 'do2'),
      box('In production', 'If the call sits in a rarely-used path (an admin screen, a month-end report), the first person to run it is a user.', 'lam')) },
  { t: 'Bug 2 in TypeScript: three error codes', body: ts(CALLS, { sm: true, hl: [3, 4, 5] }) + tc(CALLS_TSC, { wrap: 92 }) },
  { t: 'Bug 3 — the wrong value: no crash at all', body: js(`needsApproval({ seats: 31, role: 'LECTURER' });   // false
needsApproval({ seats: 31, role: 'lecturer' });   // true  ← lower-case`, { sm: true, hl: [2] }) + tc(ROLE_OUT, { title: 'terminal — Node 22.23.3' }) +
    box('The worst kind of bug', `${c("'lecturer' === 'LECTURER'")} is false, so the code treats a lecturer as a student: 31 seats ⇒ “wait for approval”. Exit 0, no stack trace, a wrong business decision.`, 'do2') },
  { t: 'A role is one of three strings — say so', body: ts(ROLE_TS, { hl: [1] }) + tc(`$ npx tsc -p demo1/ts-01-1/ts
demo1/ts-01-1/ts/calls.ts(7,28): error TS2820: Type '"lecturer"' is not assignable to type 'Role'. Did you mean '"LECTURER"'?`, { wrap: 92 }) +
    box('Read the first line as a sentence', `A ${c('Role')} is ${c("'STUDENT'")} <b>or</b> ${c("'LECTURER'")} <b>or</b> ${c("'ADMIN'")} — nothing else. These literal unions get a whole chapter (Chapter 5); one line is enough to stop Bug 3.`, 'lam') },
  { t: 'Moving errors left', body: zm(`<table class="t"><tr><th>Bug</th><th>Node (runtime)</th><th>tsc (before running)</th><th>Who finds it</th></tr>
    <tr><td>typo ${c('b.minute')}</td><td>NaN, exit 0</td><td>TS2551, line 7</td><td>user ⇒ you, in the editor</td></tr>
    <tr><td>${c('{ seat: 31 }')}</td><td>RangeError — when that path runs</td><td>TS2561, line 4</td><td>user ⇒ you</td></tr>
    <tr><td>${c('checkSlot(480, 600)')}</td><td>TypeError — when it runs</td><td>TS2345, line 5</td><td>user ⇒ you</td></tr>
    <tr><td>${c("checkSlot('08:00')")}</td><td>TypeError “undefined”</td><td>TS2554, line 6</td><td>user ⇒ you</td></tr>
    <tr><td>role ${c("'lecturer'")}</td><td><b>true</b>, no error at all</td><td>TS2820, line 7</td><td>maybe nobody ⇒ you</td></tr></table>`, 1.1) +
    box('Measured', `All five found by one ${c('npx tsc -p demo1/ts-01-1/ts')} in 0.329 s and 0.304 s (two runs) — without executing a single line.`, 'xanh') },
  { t: 'Trap: compiling is not the same as correct', body: two(`<div>${ts(GE, { sm: true })}${tc(GE_TSC)}${box('tsc is happy', `${c('>=')} and ${c('>')} are both valid on numbers. Types check <b>shapes</b>, not business rules.`, 'do2')}</div>`,
    tc(GE_TEST, { title: 'terminal — node --test', wrap: 60 }), 'r46') + box('Types and tests do different jobs', 'BR-06 says <b>more than</b> 30. Only a test that checks the boundary (30 seats) catches the slip.', 'lam') },
  { t: 'Five codes you will read every day', body: cards([
      ['TS2551', 'Property does not exist — <b>did you mean…?</b> (typo)'],
      ['TS2561', 'Unknown key in an object literal — did you mean…?'],
      ['TS2345', 'Argument of the wrong type'],
      ['TS2554', 'Wrong number of arguments'],
      ['TS2820', 'Value not allowed by a literal type — did you mean…?'],
      ['Next', 'Lesson 1.2: what tsc can <b>not</b> prove — data from outside'],
    ], 3) },
]);
