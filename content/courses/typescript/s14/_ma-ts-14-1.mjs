/**
 * _ma (bài 14.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "service": `// A class groups data and the operations on it; private hides internals.
export class BookingService {
  private count = 0;
  readonly lab: string;
  constructor(lab: string) { this.lab = lab; }
  book(): number { this.count += 1; return this.count; }
}
const svc = new BookingService('BE-201');
console.log(svc.lab, svc.book(), svc.book());`,
  "private": `export class BookingService {
  private count = 0;
  book(): number { this.count += 1; return this.count; }
}
const svc = new BookingService();
// count is private — reading it from outside is refused.
export const n = svc.count;`,
  "readonly": `export class BookingService {
  readonly lab: string;
  constructor(lab: string) { this.lab = lab; }
}
const svc = new BookingService('BE-201');
// lab is readonly — reassigning it is refused.
svc.lab = 'CS-101';
export { svc };`,
  "prStart": `export class Lab {
  private seats = 40;
  free(): number { return this.seats; }
}
const lab = new Lab();
// seats is private; read it through the method.
export const n = lab.seats;`,
  "prSol": `export class Lab {
  private seats = 40;
  free(): number { return this.seats; }
}
const lab = new Lab();
console.log(lab.free());`,
};
export const OUT = {
  '11-service': `$ node demo14/ts-14-1/service/svc.ts
BE-201 1 2`,
  '12-private': `$ node_modules/.bin/tsc -p demo14/ts-14-1/priv-field
demo14/ts-14-1/priv-field/svc.ts(7,22): error TS2341: Property 'count' is private and only accessible within class 'BookingService'.`,
  '13-readonly': `$ node_modules/.bin/tsc -p demo14/ts-14-1/readonly
demo14/ts-14-1/readonly/svc.ts(7,5): error TS2540: Cannot assign to 'lab' because it is a read-only property.`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo14/ts-14-1/practice/start
demo14/ts-14-1/practice/start/svc.ts(7,22): error TS2341: Property 'seats' is private and only accessible within class 'Lab'.`,
  '15-pr-sol': `$ node demo14/ts-14-1/practice/solution/svc.ts
40`,
};
