// A booking request arrives as JSON from a form. The seats field was cleared, so the browser sent null.
import { needsApproval } from '../../../src/rules/booking.ts';
import type { Role } from '../../../src/rules/booking.ts';

function approvalFor({ seats = 1, role = 'STUDENT' }: { seats?: number; role?: Role }): boolean {
  return needsApproval({ seats, role });       // seats "is" a number here, says the type
}

const bodies = ['{"role":"LECTURER"}', '{"seats":null,"role":"STUDENT"}'];
for (const text of bodies) {
  const body = JSON.parse(text);               // any — tsc checks nothing below
  try {
    console.log(text, '→ needs approval?', approvalFor(body));
  } catch (e) {
    console.log(text, '→ throws', String(e));
  }
}
