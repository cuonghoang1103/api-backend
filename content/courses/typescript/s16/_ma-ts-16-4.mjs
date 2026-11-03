/**
 * _ma (bài 16.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "together": `// Every habit of the course, in one slice.
type LabCode = string & { readonly __brand: 'LabCode' };          // 16.1 branded
const labCode = (s: string): LabCode => s as LabCode;
type Booking = { readonly id: number; readonly lab: LabCode; readonly seats: number }; // 4 readonly
type Result<T> = { ok: true; data: T } | { ok: false; error: string };  // 5/6 discriminated + generic
function create(lab: LabCode, seats: number): Result<Booking> {
  if (seats <= 0) return { ok: false, error: 'seats must be positive' };
  return { ok: true, data: { id: 1, lab, seats } };
}
const r = create(labCode('BE-201'), 40);
console.log(r.ok ? r.data.lab : r.error);`,
  "wrongtogether": `type Result<T> = { ok: true; data: T } | { ok: false; error: string };
function describe<T>(r: Result<T>): T {
  // Reading data without narrowing on ok — the error branch has none.
  return r.data;
}
export { describe };`,
  "prStart": `type Result<T> = { ok: true; data: T } | { ok: false; error: string };
export function dataOr<T>(r: Result<T>, fallback: T): T {
  // Narrow on ok before reading data.
  return r.data;
}`,
  "prSol": `type Result<T> = { ok: true; data: T } | { ok: false; error: string };
export function dataOr<T>(r: Result<T>, fallback: T): T {
  return r.ok ? r.data : fallback;
}
console.log(dataOr({ ok: true, data: 42 }, 0));`,
};
export const OUT = {
  '11-together': `$ node demo16/ts-16-4/together/labflow.ts
BE-201`,
  '12-wrongtogether': `$ node_modules/.bin/tsc -p demo16/ts-16-4/wrongtogether
demo16/ts-16-4/wrongtogether/labflow.ts(4,12): error TS2339: Property 'data' does not exist on type 'Result<T>'.
  Property 'data' does not exist on type '{ ok: false; error: string; }'.`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo16/ts-16-4/practice/start
demo16/ts-16-4/practice/start/labflow.ts(4,12): error TS2339: Property 'data' does not exist on type 'Result<T>'.
  Property 'data' does not exist on type '{ ok: false; error: string; }'.`,
  '14-pr-sol': `$ node demo16/ts-16-4/practice/solution/labflow.ts
42`,
};
