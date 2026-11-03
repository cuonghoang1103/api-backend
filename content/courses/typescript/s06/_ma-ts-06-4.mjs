/**
 * _ma (bài 6.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "inferGroup": `import { groupBy } from '../../../src/rules/repo.ts';
import type { User } from '../../../src/rules/model.ts';

const users: User[] = [
  { id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' },
  { id: 2, createdAt: '2026-11-03', email: 'binh@fpt.edu.vn', name: 'Binh', role: 'LECTURER' },
];

// No type arguments: tsc infers T = User from the array and K = Role from the key function.
const byRole = groupBy(users, (u) => u.role);     // Map<Role, User[]>
console.log([...byRole.keys()]);
console.log(byRole.get('STUDENT')?.map((u) => u.name));`,
  "parseReturn": `import type { User } from '../../../src/rules/model.ts';

// T appears ONLY in the return type, nowhere in the parameters — so tsc cannot check it.
function parseJson<T>(text: string): T {
  return JSON.parse(text);
}

// This compiles, but nothing verified the shape: a lie the caller writes to itself.
const users = parseJson<User[]>('[{"id":"oops"}]');   // 0 errors — id should be a number
console.log(users[0]?.id);`,
  "needlessCount": `// A generic that does not connect its type parameter to the result is just noise.
function countGeneric<T>(items: T[]): number {
  return items.length;
}

// Exactly the same behaviour, honest about what it uses:
function count(items: readonly unknown[]): number {
  return items.length;
}

console.log(countGeneric([1, 2, 3]), count(['a', 'b']));`,
  "widenFirst": `function firstOf<T>(arr: readonly T[]): T | undefined {
  return arr[0];
}

// A plain array literal widens its elements to string, so T = string.
const a = firstOf(['BE-201', 'AL-301']);          // string | undefined

// \`as const\` keeps the exact literals, so T = 'BE-201' | 'AL-301'.
const b = firstOf(['BE-201', 'AL-301'] as const); // 'BE-201' | 'AL-301' | undefined
const check: 'BE-201' | 'AL-301' | undefined = b; // only allowed because the literals were kept
console.log(a, b, check);`,
  "constpFirst": `// A \`const\` type parameter (TypeScript 5.0+) infers the narrowest type, as if the caller wrote \`as const\`.
function firstOf<const T>(arr: readonly T[]): T | undefined {
  return arr[0];
}

const b = firstOf(['BE-201', 'AL-301']);           // 'BE-201' | 'AL-301' | undefined — no as const needed
const check: 'BE-201' | 'AL-301' | undefined = b;
console.log(b, check);`,
  "prStart": `import type { User } from '../../../../src/rules/model.ts';

// loadUsers returns T, which the caller can set to anything — the body does not check it.
export function loadUsers<T>(text: string): T {
  return JSON.parse(text);
}

const users = loadUsers<User[]>('[{"id":"oops","name":123}]'); // compiles, but nothing is checked
console.log(users);`,
  "prSol": `import type { User } from '../../../../src/rules/model.ts';

// A real guard makes the shape true at runtime; no generic promises a type nobody checked.
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && typeof (x as { id?: unknown }).id === 'number';
}

export function loadUsers(text: string): User[] {
  const data: unknown = JSON.parse(text);
  return Array.isArray(data) ? data.filter(isUser) : [];
}

console.log(loadUsers('[{"id":1,"createdAt":"","email":"a","name":"An","role":"STUDENT"},{"id":"x"}]').length);`,
};
export const OUT = {
  '11-infer': `$ npx tsc -p demo6/ts-06-4/infer && node demo6/ts-06-4/infer/group.ts
[ 'STUDENT', 'LECTURER' ]
[ 'An' ]`,
  '12-returnonly': `$ npx tsc -p demo6/ts-06-4/returnonly && node demo6/ts-06-4/returnonly/parse.ts
oops`,
  '13-needless': `$ npx tsc -p demo6/ts-06-4/needless && node demo6/ts-06-4/needless/count.ts
3 2`,
  '14-widen': `$ npx tsc -p demo6/ts-06-4/widen && node demo6/ts-06-4/widen/first.ts
BE-201 BE-201 BE-201`,
  '15-constp': `$ npx tsc -p demo6/ts-06-4/constp && node demo6/ts-06-4/constp/first.ts
BE-201 BE-201`,
  '16-pr-start': `$ npx tsc -p demo6/ts-06-4/practice/start`,
  '17-pr-sol': `$ npx tsc -p demo6/ts-06-4/practice/solution && node demo6/ts-06-4/practice/solution/load.ts
1`,
};
