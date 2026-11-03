/**
 * _ma (bài 6.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "result": `// A generic type alias. E defaults to string, so Result<number> means Result<number, string>.
export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function parseSeats(text: string): Result<number> {
  const n = Number(text);
  return Number.isInteger(n) && n > 0 ? ok(n) : { ok: false, error: 'bad seats: ' + text };
}

const a = parseSeats('30');
console.log(a.ok ? 'seats ' + a.value : a.error);
const b = parseSeats('x');
console.log(b.ok ? 'seats ' + b.value : b.error);`,
  "override": `import type { SlotResult } from '../../../src/rules/booking.ts';
type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

type Code = 'OFF_GRID' | 'TOO_LONG';
const refused: Result<number, Code> = { ok: false, error: 'TOO_LONG' }; // E = Code, not string
const wrong: Result<number, Code> = { ok: false, error: 'typo' };       // 'typo' is not a Code
void refused; void wrong;
const _s: SlotResult = { ok: true, minutes: 120 }; void _s;`,
  "iface": `// A generic interface: the contract is the same for any element type.
interface Stack<T> {
  push(item: T): void;
  pop(): T | undefined;
  readonly size: number;
}

class ArrayStack<T> implements Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  get size(): number { return this.items.length; }
}

const labs = new ArrayStack<string>();
labs.push('BE-201');
labs.push('AL-301');
console.log(labs.pop(), labs.size);`,
  "klass": `import type { User } from '../../../src/rules/model.ts';

// A generic class: T is fixed when you write new Repo<User>(), and every method speaks that type.
class Repo<T extends { id: number }> {
  private items = new Map<number, T>();
  add(item: T): void { this.items.set(item.id, item); }
  get(id: number): T | undefined { return this.items.get(id); }
  get size(): number { return this.items.size; }
}

const users = new Repo<User>();
users.add({ id: 1, createdAt: '2026-11-03', email: 'an@fpt.edu.vn', name: 'An', role: 'STUDENT' });
console.log(users.get(1)?.name, users.size);   // get(1) is User | undefined`,
  "method": `class Box<T> {
  readonly value: T;
  constructor(value: T) {
    this.value = value;
  }
  // A method may add its OWN type parameter U, independent of the class's T.
  map<U>(f: (value: T) => U): Box<U> {
    return new Box(f(this.value));
  }
}

const n = new Box(10);
const text = n.map((x) => 'seats: ' + x);   // Box<string>
console.log(text.value);`,
  "paramprop": `// A parameter property (readonly value) is the short way to a constructor — but it EMITS code,
// so it is refused under erasableSyntaxOnly (the course config, so Node can strip types — 0.4).
class Box<T> {
  constructor(readonly value: T) {}
}
export const b = new Box(10);`,
  "prStart": `// A queue that should work for any element type — but it is hard-coded to string.
export class Queue {
  private items: string[] = [];
  enqueue(item: string): void { this.items.push(item); }
  dequeue(): string | undefined { return this.items.shift(); }
  get size(): number { return this.items.length; }
}

const nums = new Queue();
nums.enqueue(42);   // should be allowed if Queue were generic over number`,
  "prSol": `export class Queue<T> {
  private items: T[] = [];
  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
  get size(): number { return this.items.length; }
}

const nums = new Queue<number>();
nums.enqueue(42);
const next: number | undefined = nums.dequeue();
console.log(next, nums.size);`,
};
export const OUT = {
  '11-result': `$ npx tsc -p demo6/ts-06-3/result && node demo6/ts-06-3/result/result.ts
seats 30
bad seats: x`,
  '12-override': `$ npx tsc -p demo6/ts-06-3/override
demo6/ts-06-3/override/codes.ts(6,50): error TS2322: Type '"typo"' is not assignable to type 'Code'.`,
  '13-iface': `$ npx tsc -p demo6/ts-06-3/iface && node demo6/ts-06-3/iface/stack.ts
AL-301 1`,
  '14-class': `$ npx tsc -p demo6/ts-06-3/klass && node demo6/ts-06-3/klass/repo.ts
An 1`,
  '15-method': `$ npx tsc -p demo6/ts-06-3/method && node demo6/ts-06-3/method/map.ts
seats: 10`,
  '16-paramprop': `$ npx tsc -p demo6/ts-06-3/paramprop
demo6/ts-06-3/paramprop/box.ts(4,15): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.`,
  '17-pr-start': `$ npx tsc -p demo6/ts-06-3/practice/start
demo6/ts-06-3/practice/start/queue.ts(10,14): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.`,
  '18-pr-sol': `$ npx tsc -p demo6/ts-06-3/practice/solution && node demo6/ts-06-3/practice/solution/queue.ts
42 0`,
};
