/**
 * _ma (bài 0.8) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "endJs": `// Plain JavaScript: when does a booking end, in minutes since 00:00?
function endMinute(startMinute, length) {
  return startMinute + length;
}

console.log(endMinute(480, 120));   // 08:00 + 2 hours
console.log(endMinute('480', 120)); // the start came from a form field: a string`,
  "endTs": `// The same function in TypeScript: two type annotations added, nothing else changed.
function endMinute(startMinute: number, length: number): number {
  return startMinute + length;
}

console.log(endMinute(480, 120));   // 08:00 + 2 hours
console.log(endMinute('480', 120)); // the start came from a form field: a string`,
  "endCheck": `// @ts-check
// Still a .js file: the types live in JSDoc comments, and tsc checks them.
/**
 * @param {number} startMinute
 * @param {number} length
 * @returns {number}
 */
function endMinute(startMinute, length) {
  return startMinute + length;
}

console.log(endMinute('480', 120));`,
  "helloSai": `const lab: string = 'BE-201';
const seats: number = '31';
console.log(lab + ' needs ' + seats + ' seats');`,
  "helloDung": `const lab: string = 'BE-201';
const seats: number = 31;
console.log(lab + ' needs ' + seats + ' seats');`,
  "demTs": `#!/bin/bash
# Count the committed TypeScript in this website's repo (backend src/ and frontend/src/).
n() { git ls-files "$@" | wc -l | tr -d ' '; }
l() { git ls-files -z "$@" | xargs -0 cat | wc -l | tr -d ' '; }
echo "backend  src/            .ts files: $(n 'src/*.ts')  lines: $(l 'src/*.ts')  (of which tests: $(n 'src/*.test.ts'))"
echo "frontend frontend/src/   .ts/.tsx files: $(n 'frontend/src/*.ts' 'frontend/src/*.tsx')  lines: $(l 'frontend/src/*.ts' 'frontend/src/*.tsx')"
echo "backend  src/            .js files: $(n 'src/*.js')"`,
};
export const OUT = {
  '1-js': `$ node demo0/ts-00-8/end.js
600
480120`,
  '2-tsc': `$ npx tsc -p demo0/ts-00-8
demo0/ts-00-8/end.ts(7,23): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.`,
  '3-node-ts': `$ node demo0/ts-00-8/end.ts
600
480120`,
  '4-checkjs': `$ npx tsc -p demo0/ts-00-8/tsconfig.checkjs.json
demo0/ts-00-8/end-check.js(12,23): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.`,
  '5-time-a': `$ time npx tsc -p demo0/ts-00-8
demo0/ts-00-8/end.ts(7,23): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

real	0m0.399s
user	0m0.332s
sys	0m0.125s`,
  '5-time-b': `$ time npx tsc -p demo0/ts-00-8
demo0/ts-00-8/end.ts(7,23): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

real	0m0.375s
user	0m0.330s
sys	0m0.125s`,
  '6-website': `$ bash dem-ts.sh
backend  src/            .ts files: 1199  lines: 360306  (of which tests: 303)
frontend frontend/src/   .ts/.tsx files: 2601  lines: 739193
backend  src/            .js files: 0`,
  '7-p-dung': `$ npx tsc --noEmit hello.ts && node hello.ts
BE-201 needs 31 seats`,
  '7-p-install': `$ npm init -y > /dev/null && npm install -D -E typescript@7.0.2

added 2 packages, and audited 3 packages in 1s

found 0 vulnerabilities`,
  '7-p-loi': `$ npx tsc --noEmit hello.ts
hello.ts(2,7): error TS2322: Type 'string' is not assignable to type 'number'.`,
  '7-p-version': `$ npx tsc -v
Version 7.0.2`,
  '8-npm-time': `$ npm view typescript time --json | grep -E '"(0\\.8\\.0|1\\.0\\.0|2\\.0\\.3|5\\.0\\.2|6\\.0\\.2|7\\.0\\.2)"'
  "0.8.0": "2012-10-01T15:35:41.062Z",
  "1.0.0": "2014-04-02T22:49:06.284Z",
  "2.0.3": "2016-09-22T16:00:05.876Z",
  "5.0.2": "2023-03-16T16:41:18.461Z",
  "6.0.2": "2026-03-23T16:14:45.521Z",
  "7.0.2": "2026-07-08T15:55:18.431Z",`,
};
