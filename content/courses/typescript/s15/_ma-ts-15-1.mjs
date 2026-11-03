/**
 * _ma (bài 15.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "brokenDts": `export declare const config: { max: MissingType };`,
  "use": `import type { config } from './broken.d.ts';
export type Config = typeof config;`,
  "nolibCfg": `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "skipLibCheck": false
  },
  "include": [
    "use.ts"
  ]
}`,
  "libCfg": `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "skipLibCheck": true
  },
  "include": [
    "use.ts"
  ]
}`,
};
export const OUT = {
  '11-nolib': `$ node_modules/.bin/tsc -p demo15/ts-15-1/tsconfig.nolib.json
demo15/ts-15-1/broken.d.ts(1,37): error TS2304: Cannot find name 'MissingType'.`,
  '12-lib': `$ node_modules/.bin/tsc -p demo15/ts-15-1/tsconfig.lib.json`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo15/ts-15-1/practice/tsconfig.start.json
demo15/ts-15-1/practice/vendor.d.ts(1,33): error TS2304: Cannot find name 'Shape'.`,
  '14-pr-sol': `$ node_modules/.bin/tsc -p demo15/ts-15-1/practice/tsconfig.sol.json`,
};
