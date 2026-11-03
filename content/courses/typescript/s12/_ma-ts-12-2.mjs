/**
 * _ma (bài 12.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "useStateDemo": `import { useState } from './react.ts';
// useState<number> infers the state and types the setter.
const [count, setCount] = useState(0);
setCount(count + 1);
console.log('next count:', count + 1);`,
  "wrongset": `import { useState } from './react.ts';
const [count, setCount] = useState(0);
// The setter takes a number — a string is refused.
setCount('three');
export { count };`,
  "nullstate": `import { useState } from './react.ts';
type User = { id: number; name: string };
// Explicit <User | null>: the state starts empty but can hold a User later.
const [user] = useState<User | null>(null);
// Reading .name without checking — the state might still be null.
export const label = user.name;`,
  "nullstateOk": `import { useState, useRef } from './react.ts';
type User = { id: number; name: string };
const [user, setUser] = useState<User | null>(null);
const inputRef = useRef<{ focus(): void }>(null);
// Narrow before reading; the ref's .current is also T | null.
export const label = user === null ? 'guest' : user.name;
export function focus(): void { inputRef.current?.focus(); }
setUser({ id: 1, name: 'Mai' });
console.log('label:', label);`,
  "prStart": `import { useState } from './react.ts';
const [seats, setSeats] = useState(40);
// seats is a number — assigning a string is refused.
setSeats('forty');
export { seats };`,
  "prSol": `import { useState } from './react.ts';
const [seats, setSeats] = useState(40);
setSeats(24);
console.log('seats set');
export { seats };`,
};
export const OUT = {
  '11-usestate': `$ node demo12/ts-12-2/usestate/count.ts
next count: 1`,
  '12-wrongset': `$ node_modules/.bin/tsc -p demo12/ts-12-2/wrongset
demo12/ts-12-2/wrongset/count.ts(4,10): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.`,
  '13-nullstate': `$ node_modules/.bin/tsc -p demo12/ts-12-2/nullstate
demo12/ts-12-2/nullstate/profile.ts(6,22): error TS18047: 'user' is possibly 'null'.`,
  '14-nullstate-ok': `$ node demo12/ts-12-2/nullstate-ok/profile.ts
label: guest`,
  '15-pr-start': `$ node_modules/.bin/tsc -p demo12/ts-12-2/practice/start
demo12/ts-12-2/practice/start/form.ts(4,10): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.`,
  '16-pr-sol': `$ node demo12/ts-12-2/practice/solution/form.ts
seats set`,
};
