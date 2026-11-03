import type { User } from '../../../src/rules/model.ts';

// K must be a key of T; the return type T[K] is the type of THAT property (indexed access).
export function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const an: User = { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' };
const role = getProp(an, 'role');   // role: Role ('STUDENT' | 'LECTURER' | 'ADMIN')
const id = getProp(an, 'id');       // id: number
console.log(role, id.toFixed(0));
