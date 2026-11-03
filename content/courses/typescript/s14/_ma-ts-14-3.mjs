/**
 * _ma (bài 14.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "hashprivate": `// #private is enforced by the language at run time, not just by types.
export class BookingService {
  #count = 0;
  static readonly MAX = 100;
  book(): number { this.#count += 1; return this.#count; }
  get booked(): number { return this.#count; }
}
const svc = new BookingService();
svc.book(); svc.book();
console.log(svc.booked, 'of', BookingService.MAX);`,
  "access": `export class BookingService {
  #count = 0;
  book(): number { this.#count += 1; return this.#count; }
}
const svc = new BookingService();
// #count is private to the class — it cannot be read from outside.
export const n = svc.#count;`,
  "prStart": `export class Counter {
  #n = 0;
  tick(): void { this.#n += 1; }
  get value(): number { return this.#n; }
}
const c = new Counter();
c.tick();
// #n is private; read it through the getter.
export const v = c.#n;`,
  "prSol": `export class Counter {
  #n = 0;
  tick(): void { this.#n += 1; }
  get value(): number { return this.#n; }
}
const c = new Counter();
c.tick();
console.log(c.value);`,
};
export const OUT = {
  '11-hashprivate': `$ node demo14/ts-14-3/hashprivate/svc.ts
2 of 100`,
  '12-access': `$ node_modules/.bin/tsc -p demo14/ts-14-3/access
demo14/ts-14-3/access/svc.ts(7,22): error TS18013: Property '#count' is not accessible outside class 'BookingService' because it has a private identifier.`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo14/ts-14-3/practice/start
demo14/ts-14-3/practice/start/svc.ts(9,20): error TS18013: Property '#n' is not accessible outside class 'Counter' because it has a private identifier.`,
  '14-pr-sol': `$ node demo14/ts-14-3/practice/solution/svc.ts
1`,
};
