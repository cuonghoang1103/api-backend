/**
 * _ma (bài 9.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "implicitanyParse": `// Under strict, a parameter with no type is an error, not a silent any.
export function parse(raw) {
  return raw.trim().toUpperCase();
}`,
  "nullchecksFind": `type User = { id: number; name: string };
const users: User[] = [{ id: 1, name: 'An' }];

// Under strictNullChecks, find may return undefined — reading .name is refused.
export function nameOf(id: number): string {
  const u = users.find((x) => x.id === id);
  return u.name;
}`,
  "umbrellaCode": `// An implicit any and an unguarded possibly-undefined value.
export function greet(user) {
  const name: string | undefined = user.name;
  return 'Hi ' + name.toUpperCase();
}`,
  "umbrellaLoose": `{"extends":"../../../tsconfig.json","compilerOptions":{"strict":false,"noImplicitAny":false,"strictNullChecks":false,"noUncheckedIndexedAccess":false},"include":["code.ts"]}`,
  "prStart": `export function label(status) {
  const map: Record<string, string> = { PENDING: 'Chờ' };
  const text: string | undefined = map[status];
  return text.toUpperCase();
}`,
  "prSol": `export function label(status: string): string {
  const map: Record<string, string> = { PENDING: 'Chờ' };
  const text: string | undefined = map[status];
  return (text ?? status).toUpperCase();
}
console.log(label('PENDING'), label('DONE'));`,
};
export const OUT = {
  '11-implicitany': `$ node_modules/.bin/tsc -p demo9/ts-09-2/implicitany
demo9/ts-09-2/implicitany/parse.ts(2,23): error TS7006: Parameter 'raw' implicitly has an 'any' type.`,
  '12-nullchecks': `$ node_modules/.bin/tsc -p demo9/ts-09-2/nullchecks
demo9/ts-09-2/nullchecks/find.ts(7,10): error TS18048: 'u' is possibly 'undefined'.`,
  '13-umbrella-loose': `$ node_modules/.bin/tsc -p demo9/ts-09-2/umbrella/tsconfig.loose.json && echo '✓ strict:false — 0 errors (both bugs hidden)'
✓ strict:false — 0 errors (both bugs hidden)`,
  '14-umbrella-strict': `$ node_modules/.bin/tsc -p demo9/ts-09-2/umbrella
demo9/ts-09-2/umbrella/code.ts(2,23): error TS7006: Parameter 'user' implicitly has an 'any' type.
demo9/ts-09-2/umbrella/code.ts(4,18): error TS18048: 'name' is possibly 'undefined'.`,
  '15-pr-start': `$ node_modules/.bin/tsc -p demo9/ts-09-2/practice/start
demo9/ts-09-2/practice/start/rules.ts(1,23): error TS7006: Parameter 'status' implicitly has an 'any' type.
demo9/ts-09-2/practice/start/rules.ts(4,10): error TS18048: 'text' is possibly 'undefined'.`,
  '16-pr-sol': `$ node demo9/ts-09-2/practice/solution/rules.ts
CHỜ DONE`,
};
