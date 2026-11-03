import type { User } from '../../../src/rules/model.ts';

export function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

declare const an: User;
const ghost = getProp(an, 'ghost');   // 'ghost' is not a key of User
void ghost;
