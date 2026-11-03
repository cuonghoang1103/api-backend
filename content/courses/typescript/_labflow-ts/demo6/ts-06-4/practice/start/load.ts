import type { User } from '../../../../src/rules/model.ts';

// loadUsers returns T, which the caller can set to anything — the body does not check it.
export function loadUsers<T>(text: string): T {
  return JSON.parse(text);
}

const users = loadUsers<User[]>('[{"id":"oops","name":123}]'); // compiles, but nothing is checked
console.log(users);
