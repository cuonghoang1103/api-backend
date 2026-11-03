import type { User } from '../../../src/rules/model.ts';

// A type parameter T links the input to the output: whatever array goes in, that element comes out.
function firstOf<T>(arr: T[]): T | undefined {
  return arr[0];
}

const users: User[] = [{ id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' }];
const u = firstOf(users);        // u: User | undefined
console.log(u?.emial);           // typo is now TS2339
