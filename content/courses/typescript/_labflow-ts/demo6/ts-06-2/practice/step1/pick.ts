import type { User } from '../../../../src/rules/model.ts';

export function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const an: User = { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' };
console.log(pick(an, 'eemail'));
