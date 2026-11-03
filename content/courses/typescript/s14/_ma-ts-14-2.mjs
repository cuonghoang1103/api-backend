/**
 * _ma (bài 14.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "concrete": `// An abstract class names the shape a subclass must fill in.
abstract class BookingRepo {
  abstract find(id: number): string | undefined;
  describe(id: number): string { return this.find(id) ?? 'not found'; }
}
class MemoryRepo extends BookingRepo {
  private rows = new Map<number, string>([[1, 'BE-201']]);
  find(id: number): string | undefined { return this.rows.get(id); }
}
const repo: BookingRepo = new MemoryRepo();
console.log(repo.describe(1), '/', repo.describe(2));`,
  "instantiate": `abstract class BookingRepo {
  abstract find(id: number): string | undefined;
}
// An abstract class cannot be instantiated directly.
const repo = new BookingRepo();
export { repo };`,
  "implements": `interface Repo {
  find(id: number): string | undefined;
  save(row: string): void;
}
// The class says it implements Repo but is missing save.
class MemoryRepo implements Repo {
  find(id: number): string | undefined { return undefined; }
}
export { MemoryRepo };`,
  "prStart": `abstract class Store {
  abstract get(id: number): number | undefined;
  getOr(id: number, fallback: number): number { return this.get(id) ?? fallback; }
}
// A concrete subclass must implement get — this one forgot.
class SeatStore extends Store {}
export { SeatStore };`,
  "prSol": `abstract class Store {
  abstract get(id: number): number | undefined;
  getOr(id: number, fallback: number): number { return this.get(id) ?? fallback; }
}
class SeatStore extends Store {
  get(id: number): number | undefined { return id === 1 ? 40 : undefined; }
}
console.log(new SeatStore().getOr(1, 0), new SeatStore().getOr(9, 0));`,
};
export const OUT = {
  '11-concrete': `$ node demo14/ts-14-2/concrete/repo.ts
BE-201 / not found`,
  '12-instantiate': `$ node_modules/.bin/tsc -p demo14/ts-14-2/instantiate
demo14/ts-14-2/instantiate/repo.ts(5,14): error TS2511: Cannot create an instance of an abstract class.`,
  '13-implements': `$ node_modules/.bin/tsc -p demo14/ts-14-2/implements
demo14/ts-14-2/implements/repo.ts(6,7): error TS2420: Class 'MemoryRepo' incorrectly implements interface 'Repo'.
  Property 'save' is missing in type 'MemoryRepo' but required in type 'Repo'.`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo14/ts-14-2/practice/start
demo14/ts-14-2/practice/start/repo.ts(6,7): error TS2515: Non-abstract class 'SeatStore' does not implement inherited abstract member get from class 'Store'.`,
  '15-pr-sol': `$ node demo14/ts-14-2/practice/solution/repo.ts
40 0`,
};
