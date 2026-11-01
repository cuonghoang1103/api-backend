// If null really can arrive, say so in the type — and use ?? (null AND undefined) instead of a default (undefined only).
import { needsApproval } from '../../../src/rules/booking.ts';
import type { Role } from '../../../src/rules/booking.ts';

function approvalFor(body: { seats?: number | null; role?: Role }): boolean {
  const seats = body.seats ?? 1;
  const role = body.role ?? 'STUDENT';
  return needsApproval({ seats, role });
}

console.log(approvalFor({ role: 'LECTURER' }), approvalFor({ seats: null, role: 'STUDENT' }));
