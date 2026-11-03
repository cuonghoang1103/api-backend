import type { User } from '../../../src/rules/model.ts';

// T appears ONLY in the return type, nowhere in the parameters — so tsc cannot check it.
function parseJson<T>(text: string): T {
  return JSON.parse(text);
}

// This compiles, but nothing verified the shape: a lie the caller writes to itself.
const users = parseJson<User[]>('[{"id":"oops"}]');   // 0 errors — id should be a number
console.log(users[0]?.id);
