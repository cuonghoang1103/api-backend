// A one-character slip: >= instead of >. BR-06 says "MORE than 30 seats needs approval".
export const APPROVAL_SEATS = 30;

export function needsApproval({ seats, role }: { seats: number; role: 'STUDENT' | 'LECTURER' | 'ADMIN' }): boolean {
  if (!Number.isInteger(seats) || seats < 1) throw new RangeError('seats must be a positive integer, got ' + seats);
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats >= APPROVAL_SEATS;   // should be >
}
