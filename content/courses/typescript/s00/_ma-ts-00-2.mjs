/**
 * _ma (bài 0.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "anatomy": `import { createBooking } from '../../../src/rules/booking.ts';

const booking = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
const seatsLeft: number = 40 - booking.seats;
console.log('Seats left:', seatsLeft);`,
  "chain": `import type { Booking } from '../../../src/rules/booking.ts';

type Room = { lab: string; owner: { name: string; email: string } };

// A nested field has the wrong type: email is a number here.
const room: Room = { lab: 'BE-201', owner: { name: 'Lan', email: 2024 } };

// A whole object of the wrong shape: minutes may be missing, status is any string.
function fromForm(minutes: number | undefined, status: string) {
  return { lab: 'BE-201', start: '08:00', end: '10:00', minutes, status };
}
const saved: Booking = fromForm(120, 'PENDING');
console.log(room, saved);`,
  "b1": `import { checkSlots, needsApproval } from '../../../../src/rules/booking.ts';

const role: string = 'STUDENT';
console.log(needsApproval({ seats: 31, role }));
console.log(needsApproval({ seats: 12, role }));
console.log(needsApproval({ seats: 45, role }));

const morning = checkSlots('08:00', '10:00');
console.log(morning.minutes);`,
  "b4": `import { checkSlot, needsApproval } from '../../../../src/rules/booking.ts';

const role = 'STUDENT';
console.log(needsApproval({ seats: 31, role }));
console.log(needsApproval({ seats: 12, role }));
console.log(needsApproval({ seats: 45, role }));

const morning = checkSlot('08:00', '10:00');
if (morning.ok) console.log(morning.minutes);`,
  "codes": `import { parseTime } from '../../../src/rules/time.ts';
import { checkSlot, needsApproval, createBooking, type Booking } from '../../../src/rules/booking.ts';
import { sendMail } from '../../../src/notify/mailer.ts';

const opening: string = parseTime('07:00');
const b1 = parseTime(420);
const b2 = createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '08:00', end: '09:00' });
console.log(b2.room);
console.log(b2.minute);
const b3 = checkSlot('08:00');
needsApproval({ seat: 31, role: 'STUDENT' });
needsApproval({ seats: 31, role: 'lecturer' });
function total(list) { return list.length; }
const first: Booking | undefined = [b2][0];
console.log(first.minutes, opening, b1, b3, sendMail, total);`,
  "expect": `import { parseTime } from '../../../src/rules/time.ts';

// I EXPECT tsc to refuse a number here. If it does, this line is silent.
// @ts-expect-error — parseTime only takes "HH:MM" strings
parseTime(420);

// A string is correct, so there is no error to expect: tsc complains about the directive itself.
// @ts-expect-error — wrong guess: this call is fine
parseTime('07:00');`,
  "practice": `import { formatTime } from '../../../src/rules/time.ts';
import { createBooking, usageRate } from '../../../src/rules/booking.ts';

const label = formatTime('07:30');
const b = createBooking({ lab: 'BE-201', seats: 20, role: 'Student', start: '08:00', end: '10:00' });
console.log(b.statuss);
const rate: string = usageRate([b]);
function percent(x) {
  return Math.round(x * 100) + '%';
}
console.log(label, rate, percent(0.25));`,
  "practiceFixed": `import { formatTime } from '../../../src/rules/time.ts';
import { createBooking, usageRate } from '../../../src/rules/booking.ts';

const label = formatTime(450);                    // 1. minutes, not "HH:MM"
const b = createBooking({ lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' }); // 2. upper-case role
console.log(b.status);                            // 3. status, not statuss
const rate: number = usageRate([b]);              // 4. usageRate returns a number
function percent(x: number): string {             // 5. say what x is
  return Math.round(x * 100) + '%';
}
console.log(label, rate, percent(0.25));`,
  "demoTsconfig": `{
  "extends": "../../../tsconfig.json",
  "include": ["."]
}`,
};
export const OUT = {
  '01-anatomy': `$ npx tsc -p demo0/ts-00-2/anatomy
demo0/ts-00-2/anatomy/report.ts(4,40): error TS2339: Property 'seats' does not exist on type 'Booking'.`,
  '02-anatomy-exit': `$ npx tsc -p demo0/ts-00-2/anatomy; echo exit code: $?
demo0/ts-00-2/anatomy/report.ts(4,40): error TS2339: Property 'seats' does not exist on type 'Booking'.
exit code: 1`,
  '03-anatomy-node': `$ node demo0/ts-00-2/anatomy/report.ts
Seats left: NaN`,
  '04-anatomy-pretty': `$ npx tsc -p demo0/ts-00-2/anatomy --pretty
demo0/ts-00-2/anatomy/report.ts:4:40 - error TS2339: Property 'seats' does not exist on type 'Booking'.

4 const seatsLeft: number = 40 - booking.seats;
                                         ~~~~~


Found 1 error in demo0/ts-00-2/anatomy/report.ts:4`,
  '05-chain': `$ npx tsc -p demo0/ts-00-2/chain
demo0/ts-00-2/chain/register.ts(6,59): error TS2322: Type 'number' is not assignable to type 'string'.
demo0/ts-00-2/chain/register.ts(12,7): error TS2322: Type '{ lab: string; start: string; end: string; minutes: number | undefined; status: string; }' is not assignable to type 'Booking'.
  Types of property 'minutes' are incompatible.
    Type 'number | undefined' is not assignable to type 'number'.
      Type 'undefined' is not assignable to type 'number'.`,
  '06-cascade-b1': `$ npx tsc -p demo0/ts-00-2/cascade/b1
demo0/ts-00-2/cascade/b1/plan.ts(1,10): error TS2724: '"../../../../src/rules/booking.ts"' has no exported member named 'checkSlots'. Did you mean 'checkSlot'?
demo0/ts-00-2/cascade/b1/plan.ts(4,40): error TS2322: Type 'string' is not assignable to type 'Role'.
demo0/ts-00-2/cascade/b1/plan.ts(5,40): error TS2322: Type 'string' is not assignable to type 'Role'.
demo0/ts-00-2/cascade/b1/plan.ts(6,40): error TS2322: Type 'string' is not assignable to type 'Role'.`,
  '06-cascade-b2': `$ npx tsc -p demo0/ts-00-2/cascade/b2
demo0/ts-00-2/cascade/b2/plan.ts(1,10): error TS2724: '"../../../../src/rules/booking.ts"' has no exported member named 'checkSlots'. Did you mean 'checkSlot'?`,
  '06-cascade-b3': `$ npx tsc -p demo0/ts-00-2/cascade/b3
demo0/ts-00-2/cascade/b3/plan.ts(9,21): error TS2339: Property 'minutes' does not exist on type 'SlotResult'.
  Property 'minutes' does not exist on type '{ ok: false; code: SlotCode; }'.`,
  '06-cascade-b4': `$ npx tsc -p demo0/ts-00-2/cascade/b4`,
  '07-cascade-pretty': `$ npx tsc -p demo0/ts-00-2/cascade/b1 --pretty
demo0/ts-00-2/cascade/b1/plan.ts:1:10 - error TS2724: '"../../../../src/rules/booking.ts"' has no exported member named 'checkSlots'. Did you mean 'checkSlot'?

1 import { checkSlots, needsApproval } from '../../../../src/rules/booking.ts';
           ~~~~~~~~~~

  src/rules/booking.ts:23:17 - 'checkSlot' is declared here.
    23 export function checkSlot(start: string, end: string): SlotResult {
                       ~~~~~~~~~

demo0/ts-00-2/cascade/b1/plan.ts:4:40 - error TS2322: Type 'string' is not assignable to type 'Role'.

4 console.log(needsApproval({ seats: 31, role }));
                                         ~~~~

  src/rules/booking.ts:37:65 - The expected type comes from property 'role' which is declared here on type '{ seats: number; role: Role; }'
    37 export function needsApproval({ seats, role }: { seats: number; role: Role }): boolean {
                                                                       ~~~~

demo0/ts-00-2/cascade/b1/plan.ts:5:40 - error TS2322: Type 'string' is not assignable to type 'Role'.

5 console.log(needsApproval({ seats: 12, role }));
                                         ~~~~

  src/rules/booking.ts:37:65 - The expected type comes from property 'role' which is declared here on type '{ seats: number; role: Role; }'
    37 export function needsApproval({ seats, role }: { seats: number; role: Role }): boolean {
                                                                       ~~~~

demo0/ts-00-2/cascade/b1/plan.ts:6:40 - error TS2322: Type 'string' is not assignable to type 'Role'.

6 console.log(needsApproval({ seats: 45, role }));
                                         ~~~~

  src/rules/booking.ts:37:65 - The expected type comes from property 'role' which is declared here on type '{ seats: number; role: Role; }'
    37 export function needsApproval({ seats, role }: { seats: number; role: Role }): boolean {
                                                                       ~~~~


Found 4 errors in the same file, starting at: demo0/ts-00-2/cascade/b1/plan.ts:1`,
  '08-codes': `$ npx tsc -p demo0/ts-00-2/codes
demo0/ts-00-2/codes/ten-codes.ts(3,26): error TS2307: Cannot find module '../../../src/notify/mailer.ts' or its corresponding type declarations.
demo0/ts-00-2/codes/ten-codes.ts(5,7): error TS2322: Type 'number' is not assignable to type 'string'.
demo0/ts-00-2/codes/ten-codes.ts(6,22): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
demo0/ts-00-2/codes/ten-codes.ts(8,16): error TS2339: Property 'room' does not exist on type 'Booking'.
demo0/ts-00-2/codes/ten-codes.ts(9,16): error TS2551: Property 'minute' does not exist on type 'Booking'. Did you mean 'minutes'?
demo0/ts-00-2/codes/ten-codes.ts(10,12): error TS2554: Expected 2 arguments, but got 1.
demo0/ts-00-2/codes/ten-codes.ts(11,17): error TS2561: Object literal may only specify known properties, but 'seat' does not exist in type '{ seats: number; role: Role; }'. Did you mean to write 'seats'?
demo0/ts-00-2/codes/ten-codes.ts(12,28): error TS2820: Type '"lecturer"' is not assignable to type 'Role'. Did you mean '"LECTURER"'?
demo0/ts-00-2/codes/ten-codes.ts(13,16): error TS7006: Parameter 'list' implicitly has an 'any' type.
demo0/ts-00-2/codes/ten-codes.ts(15,13): error TS18048: 'first' is possibly 'undefined'.`,
  '09-ts5112': `$ npx tsc demo0/ts-00-2/anatomy/report.ts
error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.`,
  '10-expect': `$ npx tsc -p demo0/ts-00-2/expect
demo0/ts-00-2/expect/expect.ts(8,1): error TS2578: Unused '@ts-expect-error' directive.`,
  '11-practice': `$ npx tsc -p demo0/ts-00-2/practice
demo0/ts-00-2/practice/mistakes.ts(4,26): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
demo0/ts-00-2/practice/mistakes.ts(5,53): error TS2820: Type '"Student"' is not assignable to type 'Role'. Did you mean '"STUDENT"'?
demo0/ts-00-2/practice/mistakes.ts(6,15): error TS2551: Property 'statuss' does not exist on type 'Booking'. Did you mean 'status'?
demo0/ts-00-2/practice/mistakes.ts(7,7): error TS2322: Type 'number' is not assignable to type 'string'.
demo0/ts-00-2/practice/mistakes.ts(8,18): error TS7006: Parameter 'x' implicitly has an 'any' type.`,
  '12-practice-fixed': `$ npx tsc -p demo0/ts-00-2/practice-fixed && node demo0/ts-00-2/practice-fixed/mistakes.ts
CONFIRMED
07:30 0.14285714285714285 25%`,
};
