import type { User } from '../../../../src/rules/model.ts';

// lastOf loses the type with any[]. A typo on the result is not caught.
export function lastOf(arr: any[]): any {
  return arr[arr.length - 1];
}

const users: User[] = [{ id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' }];
console.log(lastOf(users).naem);
