import type { User } from '../../../../src/rules/model.ts';

// pick should return the exact type of the chosen property. Right now it returns any — a typo slips.
export function pick<T>(obj: T, key: string): any {
  return (obj as any)[key];
}

const an: User = { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' };
console.log(pick(an, 'eemail'));
