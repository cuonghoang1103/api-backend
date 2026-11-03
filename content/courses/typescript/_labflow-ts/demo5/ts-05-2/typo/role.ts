import type { Role } from '../../../src/rules/booking.ts';

// Role is 'STUDENT' | 'LECTURER' | 'ADMIN' — there is no 'TEACHER'.
export function isStaff(role: Role): boolean {
  return role === 'TEACHER' || role === 'ADMIN';
}
