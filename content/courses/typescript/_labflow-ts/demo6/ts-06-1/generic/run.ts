import type { User } from '../../../src/rules/model.ts';

function firstOf<T>(arr: T[]): T | undefined {
  return arr[0];
}

const users: User[] = [{ id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' }];
const names: string[] = ['BE-201', 'AL-301'];
console.log(firstOf(users)?.email);   // u is User | undefined
console.log(firstOf(names)?.toUpperCase());
console.log(firstOf([]));             // undefined
