import { groupBy } from '../../../src/rules/repo.ts';
import type { User } from '../../../src/rules/model.ts';

const users: User[] = [
  { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' },
  { id: 2, createdAt: '2026-11-03', email: 'binh@fpt.edu.vn', name: 'Binh', role: 'LECTURER' },
];

// No type arguments: tsc infers T = User from the array and K = Role from the key function.
const byRole = groupBy(users, (u) => u.role);     // Map<Role, User[]>
console.log([...byRole.keys()]);
console.log(byRole.get('STUDENT')?.map((u) => u.name));
