import { needsApproval } from '../../../src/rules/booking.ts';

// needsApproval throws a RangeError for a bad seat count. In a catch, the error is `unknown`.
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
console.log(approvalLabel(0));
