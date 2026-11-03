import type { User } from '../../../src/rules/model.ts';
import type { Role } from '../../../src/rules/booking.ts';

// Pull a property's type out of a shape — no need to repeat the union by hand.
type UserRole = User['role'];        // = Role
type UserKey = keyof User;           // 'id' | 'createdAt' | 'email' | 'name' | 'role' | 'studentCode'

const r: UserRole = 'ADMIN';
const same: Role = r;                // UserRole IS Role
const k: UserKey = 'email';
console.log(r, same, k);
