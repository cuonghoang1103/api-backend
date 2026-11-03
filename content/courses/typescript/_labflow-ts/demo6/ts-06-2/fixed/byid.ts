import type { User } from '../../../src/rules/model.ts';

// `extends { id: number }` is a CONSTRAINT: T may be any type that has a numeric id.
export function byId<T extends { id: number }>(items: readonly T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

const users: User[] = [
  { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' },
  { id: 2, createdAt: '2026-11-03', email: 'binh@fpt.edu.vn', name: 'Binh', role: 'LECTURER' },
];
console.log(byId(users, 2)?.name);   // still a User | undefined — the type is kept
console.log(byId(users, 9));
