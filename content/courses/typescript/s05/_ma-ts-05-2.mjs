/**
 * _ma (bài 5.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "slotBad": `import { checkSlot } from '../../../src/rules/booking.ts';
import type { SlotResult } from '../../../src/rules/booking.ts';

// A SlotResult is { ok: true; minutes } OR { ok: false; code }. minutes lives on only one member.
export function minutesOf(r: SlotResult): number {
  return r.minutes;
}
void checkSlot;`,
  "slotUse": `import { checkSlot } from '../../../src/rules/booking.ts';

// Test the ok flag and tsc narrows the whole object: minutes on one side, code on the other.
const r = checkSlot('08:00', '10:00');
if (r.ok) {
  console.log('booked', r.minutes, 'minutes'); // r: { ok: true; minutes: number }
} else {
  console.log('refused:', r.code);              // r: { ok: false; code: SlotCode }
}

const bad = checkSlot('08:15', '10:00');
console.log(bad.ok ? bad.minutes + ' min' : 'refused ' + bad.code);`,
  "switchMsg": `import type { SlotCode } from '../../../src/rules/booking.ts';

// Each case narrows code to one literal; the message is chosen by value.
export function slotMessage(code: SlotCode): string {
  switch (code) {
    case 'OFF_GRID':
      return 'Start and end must be on the 30-minute grid.';
    case 'END_BEFORE_START':
      return 'The end time is before the start time.';
    case 'OUTSIDE_HOURS':
      return 'The lab is only open 07:00–21:00.';
    case 'TOO_LONG':
      return 'A booking is at most 4 hours.';
  }
}

console.log(slotMessage('OFF_GRID'));
console.log(slotMessage('TOO_LONG'));`,
  "inContact": `// Two shapes with no shared label: narrow with the \`in\` operator.
type Contact = { email: string } | { phone: string };

export function reach(c: Contact): string {
  if ('email' in c) return 'mail ' + c.email; // c: { email: string }
  return 'call ' + c.phone;                    // c: { phone: string }
}

console.log(reach({ email: 'an.nv@fpt.edu.vn' }));
console.log(reach({ phone: '0905-123-456' }));`,
  "catchApprove": `import { needsApproval } from '../../../src/rules/booking.ts';

// needsApproval throws a RangeError for a bad seat count. In a catch, the error is \`unknown\`.
export function approvalLabel(seats: number): string {
  try {
    return needsApproval({ seats, role: 'STUDENT' }) ? 'needs approval' : 'auto-confirmed';
  } catch (e) {
    // e.message here would be TS18046 — e is unknown. Narrow first.
    if (e instanceof RangeError) return 'bad input: ' + e.message;
    throw e;
  }
}

console.log(approvalLabel(40));
console.log(approvalLabel(0));`,
  "catchBad": `import { needsApproval } from '../../../src/rules/booking.ts';

export function label(seats: number): string {
  try {
    return String(needsApproval({ seats, role: 'STUDENT' }));
  } catch (e) {
    return e.message; // e is unknown
  }
}
void label;`,
  "typoRole": `import type { Role } from '../../../src/rules/booking.ts';

// Role is 'STUDENT' | 'LECTURER' | 'ADMIN' — there is no 'TEACHER'.
export function isStaff(role: Role): boolean {
  return role === 'TEACHER' || role === 'ADMIN';
}`,
  "equalitySame": `export function sameText(a: string | number, b: string): boolean {
  if (a === b) {
    // a must be the string branch here — it just equalled a string.
    return a.length === b.length;
  }
  return false;
}

console.log(sameText('BE-201', 'BE-201'));
console.log(sameText(201, 'BE-201'));`,
  "prStart": `import { checkSlot } from '../../../../src/rules/booking.ts';
import type { SlotResult } from '../../../../src/rules/booking.ts';

// Turn a SlotResult into a line for the UI. tsc refuses this — minutes is not on every member.
export function line(r: SlotResult): string {
  return 'OK, ' + r.minutes + ' minutes';
}

console.log(line(checkSlot('08:00', '10:00')));
console.log(line(checkSlot('08:15', '10:00')));`,
  "prSol": `import { checkSlot } from '../../../../src/rules/booking.ts';
import type { SlotResult } from '../../../../src/rules/booking.ts';

export function line(r: SlotResult): string {
  if (r.ok) return 'OK, ' + r.minutes + ' minutes';
  return 'REFUSED: ' + r.code;
}

console.log(line(checkSlot('08:00', '10:00')));
console.log(line(checkSlot('08:15', '10:00')));`,
};
export const OUT = {
  '11-slot-bad': `$ npx tsc -p demo5/ts-05-2/slot
demo5/ts-05-2/slot/bad.ts(6,12): error TS2339: Property 'minutes' does not exist on type 'SlotResult'.
  Property 'minutes' does not exist on type '{ ok: false; code: SlotCode; }'.`,
  '12-slot-use': `$ node demo5/ts-05-2/slot/use.ts
booked 120 minutes
refused OFF_GRID`,
  '13-switch': `$ npx tsc -p demo5/ts-05-2/switchcode && node demo5/ts-05-2/switchcode/msg.ts
Start and end must be on the 30-minute grid.
A booking is at most 4 hours.`,
  '14-in': `$ npx tsc -p demo5/ts-05-2/inop && node demo5/ts-05-2/inop/contact.ts
mail an.nv@fpt.edu.vn
call 0905-123-456`,
  '15-catch-bad': `$ npx tsc -p demo5/ts-05-2/catch
demo5/ts-05-2/catch/bad.ts(7,12): error TS18046: 'e' is of type 'unknown'.`,
  '16-catch-run': `$ node demo5/ts-05-2/catch/approve.ts
needs approval
bad input: seats must be a positive integer, got 0`,
  '17-typo': `$ npx tsc -p demo5/ts-05-2/typo
demo5/ts-05-2/typo/role.ts(5,10): error TS2367: This comparison appears to be unintentional because the types 'Role' and '"TEACHER"' have no overlap.`,
  '18-equality': `$ npx tsc -p demo5/ts-05-2/equality && node demo5/ts-05-2/equality/same.ts
true
false`,
  '19-pr-start': `$ npx tsc -p demo5/ts-05-2/practice/start
demo5/ts-05-2/practice/start/report.ts(6,21): error TS2339: Property 'minutes' does not exist on type 'SlotResult'.
  Property 'minutes' does not exist on type '{ ok: false; code: SlotCode; }'.`,
  '20-pr-sol': `$ npx tsc -p demo5/ts-05-2/practice/solution && node demo5/ts-05-2/practice/solution/report.ts
OK, 120 minutes
REFUSED: OFF_GRID`,
};
