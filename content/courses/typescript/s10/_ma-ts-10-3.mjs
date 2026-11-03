/**
 * _ma (bài 10.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "globalaugEnv": `// Augment a global type from @types/node: declare that this env var always exists.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LABFLOW_PORT: string;
    }
  }
}
export {};`,
  "globalaugApp": `// With the augmentation, process.env.LABFLOW_PORT is string, not string | undefined.
const port: string = process.env.LABFLOW_PORT;
console.log('port set:', typeof port);`,
  "noaugApp": `// No augmentation, so process.env.X is string | undefined — assigning it to string is refused.
const port: string = process.env.LABFLOW_PORT;
export { port };`,
  "mergeLab": `export interface Lab { code: string; }
export interface Lab { seats: number; }   // merges with the one above
const be: Lab = { code: 'BE-201', seats: 40 };  // must have BOTH fields
console.log(be.code, be.seats);`,
  "prStart": `// No augmentation for DATABASE_URL, so it is string | undefined.
export function dbUrl(): string {
  return process.env.DATABASE_URL;
}`,
  "prSolEnv": `declare global {
  namespace NodeJS {
    interface ProcessEnv { DATABASE_URL: string; }
  }
}
export {};`,
  "prSol": `export function dbUrl(): string {
  return process.env.DATABASE_URL;  // now string, thanks to the augmentation
}
console.log(typeof dbUrl);`,
};
export const OUT = {
  '11-globalaug': `$ node_modules/.bin/tsc -p demo10/ts-10-3/globalaug && echo '✓ tsc: 0 errors — LABFLOW_PORT is string'
✓ tsc: 0 errors — LABFLOW_PORT is string`,
  '12-noaug': `$ node_modules/.bin/tsc -p demo10/ts-10-3/noaug
demo10/ts-10-3/noaug/app.ts(2,7): error TS2322: Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.`,
  '13-merge': `$ node demo10/ts-10-3/merge/lab.ts
BE-201 40`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo10/ts-10-3/practice/start
demo10/ts-10-3/practice/start/app.ts(3,3): error TS2322: Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.`,
  '15-pr-sol': `$ node_modules/.bin/tsc -p demo10/ts-10-3/practice/solution && echo '✓ tsc: 0 errors — DATABASE_URL is string'
✓ tsc: 0 errors — DATABASE_URL is string`,
};
