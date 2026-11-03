import type { User } from '../../../../src/rules/model.ts';

export function lastOf<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

const users: User[] = [{ id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' }];
console.log(lastOf(users)?.name);
