/**
 * _ma (bài 16.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "unknown": `// unknown is the safe top type — you must narrow before you use it.
export function size(raw: unknown): number {
  // Reading .length on unknown is refused until you narrow.
  return raw.length;
}`,
  "never": `type Slot = { kind: 'free' } | { kind: 'booked' } | { kind: 'held' };
function assertNever(x: never): never { throw new Error('unhandled: ' + JSON.stringify(x)); }
export function label(s: Slot): string {
  switch (s.kind) {
    case 'free': return 'open';
    case 'booked': return 'taken';
    // 'held' is not handled — s is not 'never' here, so assertNever refuses it.
    default: return assertNever(s);
  }
}`,
  "anyrun": `// any turns off checking — this compiles, and crashes at run time.
const data: any = { lab: 'BE-201' };
console.log(data.seats.toFixed(0));`,
  "prStart": `export function first(raw: unknown): string {
  // raw is unknown — reading [0] is refused until you narrow.
  return raw[0];
}`,
  "prSol": `export function first(raw: unknown): string {
  if (typeof raw === 'string') return raw[0] ?? '';
  return '';
}
console.log(first('BE-201'));`,
};
export const OUT = {
  '11-unknown': `$ node_modules/.bin/tsc -p demo16/ts-16-2/unknown
demo16/ts-16-2/unknown/parse.ts(4,10): error TS18046: 'raw' is of type 'unknown'.`,
  '12-never': `$ node_modules/.bin/tsc -p demo16/ts-16-2/never
demo16/ts-16-2/never/exhaust.ts(8,33): error TS2345: Argument of type '{ kind: "held"; }' is not assignable to parameter of type 'never'.`,
  '13-anyrun': `$ node demo16/ts-16-2/anyrun/data.ts
file://…/labflow-ts/demo16/ts-16-2/anyrun/data.ts:3
console.log(data.seats.toFixed(0));
                       ^

TypeError: Cannot read properties of undefined (reading 'toFixed')
    at file://…/labflow-ts/demo16/ts-16-2/anyrun/data.ts:3:24
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo16/ts-16-2/practice/start
demo16/ts-16-2/practice/start/parse.ts(3,10): error TS18046: 'raw' is of type 'unknown'.`,
  '15-pr-sol': `$ node demo16/ts-16-2/practice/solution/parse.ts
B`,
};
