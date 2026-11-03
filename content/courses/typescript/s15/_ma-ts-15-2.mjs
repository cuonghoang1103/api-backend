/**
 * _ma (bài 15.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "coreSrc": `export type Booking = { id: number; lab: string };
export const make = (id: number, lab: string): Booking => ({ id, lab });`,
  "coreCfg": `{
  "extends": "../../../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "noEmit": false,
    "rootDir": "src",
    "outDir": "dist",
    "declaration": true,
    "allowImportingTsExtensions": false
  },
  "include": [
    "src"
  ]
}`,
  "appSrc": `import { make } from '../../core/dist/index.js';
export const b = make(1, 'BE-201');`,
  "appCfg": `{
  "extends": "../../../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "noEmit": false,
    "rootDir": "src",
    "outDir": "dist",
    "allowImportingTsExtensions": false
  },
  "references": [
    {
      "path": "../core"
    }
  ],
  "include": [
    "src"
  ]
}`,
};
export const OUT = {
  '11-build-first': `$ node_modules/.bin/tsc -b demo15/ts-15-2/refs/app --verbose | sed 's/^[0-9]*:[0-9]*:[0-9]* [AP]M - //'
Projects in this build: 
    * demo15/ts-15-2/refs/core/tsconfig.json
    * demo15/ts-15-2/refs/app/tsconfig.json

Project 'demo15/ts-15-2/refs/core/tsconfig.json' is out of date because output file 'demo15/ts-15-2/refs/core/tsconfig.tsbuildinfo' does not exist

Building project 'demo15/ts-15-2/refs/core/tsconfig.json'...

Project 'demo15/ts-15-2/refs/app/tsconfig.json' is out of date because output file 'demo15/ts-15-2/refs/app/tsconfig.tsbuildinfo' does not exist

Building project 'demo15/ts-15-2/refs/app/tsconfig.json'...`,
  '12-build-second': `$ node_modules/.bin/tsc -b demo15/ts-15-2/refs/app --verbose | sed 's/^[0-9]*:[0-9]*:[0-9]* [AP]M - //'
Projects in this build: 
    * demo15/ts-15-2/refs/core/tsconfig.json
    * demo15/ts-15-2/refs/app/tsconfig.json

Project 'demo15/ts-15-2/refs/core/tsconfig.json' is up to date because newest input 'demo15/ts-15-2/refs/core/src/index.ts' is older than output 'demo15/ts-15-2/refs/core/tsconfig.tsbuildinfo'

Project 'demo15/ts-15-2/refs/app/tsconfig.json' is up to date because newest input 'demo15/ts-15-2/refs/app/src/main.ts' is older than output 'demo15/ts-15-2/refs/app/tsconfig.tsbuildinfo'`,
};
