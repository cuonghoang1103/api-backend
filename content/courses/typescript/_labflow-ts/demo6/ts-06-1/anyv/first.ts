import type { User } from '../../../src/rules/model.ts';

// "Works for any array" — and loses the type on the way out.
function firstOf(arr: any[]): any {
  return arr[0];
}

const users: User[] = [{ id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' }];
const u = firstOf(users);
console.log(u.emial);            // typo: no error, prints undefined
console.log(u.name.toFixed(2));  // name is a string — no error, crashes at runtime
