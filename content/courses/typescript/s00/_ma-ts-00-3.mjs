/**
 * _ma (bài 0.3) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "pkg": `{
  "name": "ts-00-3-hello",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "node --test --test-reporter=spec \\"src/**/*.test.ts\\"",
    "typecheck": "tsc -p tsconfig.json",
    "check": "npm run typecheck && npm test"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "devDependencies": {
    "@types/node": "22.20.5",
    "typescript": "7.0.2"
  }
}`,
  "tsInit": `{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    // "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "target": "esnext",
    "types": [],
    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}`,
  "tsconfig": `{
  // LabFlow TS — the course's standard config (Section 0.3). Node 22 runs .ts files itself (type stripping),
  // so tsc only CHECKS (noEmit) and imports keep their .ts extension.
  "compilerOptions": {
    "target": "es2024",
    "module": "nodenext",
    "types": ["node"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`,
  "hello": `// src/hello.ts — the first TypeScript file of LabFlow TS.
export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}

const lab: string = process.env.LAB ?? 'BE-201';
const opensAt: number = 7 * 60;
console.log('Lab ' + lab + ' opens at ' + formatTime(opensAt));`,
  "oops": `// src/oops.ts — a deliberate mistake: formatTime wants minutes, not "HH:MM".
import { formatTime } from './hello.ts';

console.log('LabFlow closes at ' + formatTime('21:00'));`,
  "oopsFixed": `// src/oops.ts — fixed: 21:00 is 21 * 60 minutes after midnight.
import { formatTime } from './hello.ts';

console.log('LabFlow closes at ' + formatTime(21 * 60));`,
  "closing": `// src/closing.ts — the import ends in .js, as many older tutorials write it.
import { formatTime } from './hello.js';

console.log('Last slot ends at ' + formatTime(21 * 60));`,
  "role": `// src/role.ts — an enum: TypeScript syntax that produces runtime code.
enum Role {
  STUDENT,
  LECTURER,
}
console.log(Role.LECTURER);`,
  "test": `// src/hello.test.ts — node:test is built into Node, nothing to install.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatTime } from './hello.ts';

test('420 minutes is 07:00', () => {
  assert.equal(formatTime(420), '07:00');
});

test('1290 minutes is 21:30', () => {
  assert.equal(formatTime(1290), '21:30');
});`,
  "practice": `// src/practice.test.ts — the practice task of lesson 0.3.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatTime } from './hello.ts';

test('midnight is 00:00', () => {
  assert.equal(formatTime(0), '00:00');
});

test('the last slot ends at 21:00', () => {
  assert.equal(formatTime(21 * 60), '21:00');
});`,
  "practiceRed": `// src/practice.test.ts — the practice task of lesson 0.3, with a mistake on purpose.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatTime } from './hello.ts';

test('midnight is 00:00', () => {
  assert.equal(formatTime(0), '00:00');
});

test('the last slot ends at 21:00', () => {
  assert.equal(formatTime('21:00'), '21:00');
});`,
};
export const OUT = {
  '01-node': `$ node -v && npm -v && node -p process.features.typescript
v22.23.3
10.9.9
strip`,
  '02-init': `$ npm init -y
Wrote to …/ts-00-3-hello/package.json:

{
  "name": "ts-00-3-hello",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}`,
  '03-install': `$ npm pkg set type=module && npm install --save-dev --save-exact typescript@7.0.2 @types/node@22.20.5

added 4 packages, and audited 5 packages in 2s

found 0 vulnerabilities`,
  '04-pkg': `$ cat package.json
{
  "name": "ts-00-3-hello",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "devDependencies": {
    "@types/node": "22.20.5",
    "typescript": "7.0.2"
  }
}`,
  '05-size': `$ ls node_modules node_modules/@typescript node_modules/@types && du -sh node_modules/typescript node_modules/@typescript/* node_modules/@types/node node_modules
node_modules:
@types
@typescript
typescript
undici-types

node_modules/@types:
node

node_modules/@typescript:
typescript-darwin-arm64
3.5M	node_modules/typescript
 26M	node_modules/@typescript/typescript-darwin-arm64
2.5M	node_modules/@types/node
 33M	node_modules`,
  '06-version': `$ npx tsc -v
Version 7.0.2`,
  '07-init': `$ npx tsc --init

Created a new tsconfig.json

You can learn more at https://aka.ms/tsconfig`,
  '10-tsc-ok': `$ npx tsc`,
  '11-run': `$ node src/hello.ts
Lab BE-201 opens at 07:00`,
  '12-run-env': `$ LAB=AI-305 node src/hello.ts
Lab AI-305 opens at 07:00`,
  '13-tsc-red': `$ npx tsc
src/oops.ts(4,47): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.`,
  '14-node-runs-anyway': `$ node src/oops.ts
Lab BE-201 opens at 07:00
LabFlow closes at NaN:NaN`,
  '15-fixed': `$ npx tsc && node src/oops.ts
Lab BE-201 opens at 07:00
LabFlow closes at 21:00`,
  '20-file-arg': `$ npx tsc src/hello.ts
error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.`,
  '21-ignore-config': `$ npx tsc --ignoreConfig src/oops.ts
src/hello.ts(8,21): error TS2591: Cannot find name 'process'. Do you need to install type definitions for node? Try \`npm i --save-dev @types/node\` and then add 'node' to the types field in your tsconfig.
src/oops.ts(2,28): error TS5097: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.
src/oops.ts(4,47): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.`,
  '22-emitted': `$ ls src && head -5 src/hello.js
hello.js
hello.ts
oops.js
oops.ts
// src/hello.ts — the first TypeScript file of LabFlow TS.
export function formatTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');`,
  '30-js-ext-tsc': `$ npx tsc`,
  '31-js-ext-node': `$ node src/closing.ts
node:internal/modules/esm/resolve:275
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/ts-00-3-hello/src/hello.js' imported from …/ts-00-3-hello/src/closing.ts
    at finalizeResolution (node:internal/modules/esm/resolve:275:11)
    at moduleResolve (node:internal/modules/esm/resolve:865:10)
    at defaultResolve (node:internal/modules/esm/resolve:989:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:747:20)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:724:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:320:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:182:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file://…/ts-00-3-hello/src/hello.js'
}

Node.js v22.23.3`,
  '32-enum-tsc': `$ npx tsc
src/role.ts(2,6): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.`,
  '33-enum-node': `$ node src/role.ts
node:internal/modules/run_main:123
    triggerUncaughtException(
    ^

file://…/ts-00-3-hello/src/role.ts:2
    // src/role.ts — an enum: TypeScript syntax that produces runtime code.
  > enum Role {
      STUDENT,
      LECTURER,
  > }
    console.log(Role.LECTURER);

SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]: TypeScript enum is not supported in strip-only mode
    at parseTypeScript (node:internal/modules/typescript:63:40)
    at processTypeScriptCode (node:internal/modules/typescript:133:42)
    at stripTypeScriptModuleTypes (node:internal/modules/typescript:163:10)
    at ModuleLoader.<anonymous> (node:internal/modules/esm/translators:660:29)
    at #translate (node:internal/modules/esm/loader:559:20)
    at afterLoad (node:internal/modules/esm/loader:612:29)
    at ModuleLoader.loadAndTranslate (node:internal/modules/esm/loader:617:12)
    at #createModuleJob (node:internal/modules/esm/loader:640:36)
    at #getJobFromResolveResult (node:internal/modules/esm/loader:353:34)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:321:41) {
  code: 'ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX'
}

Node.js v22.23.3`,
  '40-test-dir': `$ node --test src/
TAP version 13
# node:internal/modules/cjs/loader:1433
#   throw err;
#   ^
# Error: Cannot find module '…/ts-00-3-hello/src'
#     at Function._resolveFilename (node:internal/modules/cjs/loader:1430:15)
#     at defaultResolveImpl (node:internal/modules/cjs/loader:1040:19)
#     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1045:22)
#     at Function._load (node:internal/modules/cjs/loader:1216:25)
#     at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
#     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
#     at node:internal/main/run_main_module:36:49 {
#   code: 'MODULE_NOT_FOUND',
#   requireStack: []
# }
# Node.js v22.23.3
# Subtest: src
not ok 1 - src
  ---
  duration_ms: 39.107666
  type: 'test'
  location: '…/ts-00-3-hello/src:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
1..1
# tests 1
# suites 0
# pass 0
# fail 1
# cancelled 0
# skipped 0
# todo 0
# duration_ms 44.00275`,
  '41-scripts': `$ npm pkg set scripts.typecheck='tsc -p tsconfig.json' scripts.test='node --test --test-reporter=spec "src/**/*.test.ts"' scripts.check='npm run typecheck && npm test' && npm pkg get scripts
{
  "test": "node --test --test-reporter=spec \\"src/**/*.test.ts\\"",
  "typecheck": "tsc -p tsconfig.json",
  "check": "npm run typecheck && npm test"
}`,
  '42-check': `$ npm run check

> ts-00-3-hello@1.0.0 check
> npm run typecheck && npm test


> ts-00-3-hello@1.0.0 typecheck
> tsc -p tsconfig.json


> ts-00-3-hello@1.0.0 test
> node --test --test-reporter=spec "src/**/*.test.ts"

Lab BE-201 opens at 07:00
✔ 420 minutes is 07:00 (0.593125ms)
✔ 1290 minutes is 21:30 (0.084958ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 75.151333`,
  '50-backend-size': `$ node ts7/bin/tsc -v && node ts6/bin/tsc -v && find src -name '*.ts' | wc -l && node ts7/bin/tsc --listFilesOnly -p . | wc -l
Version 7.0.2
Version 6.0.3
    1199
    3407`,
  '51-ts6-default': `$ time node ts6/bin/tsc --noEmit -p . 2>&1 | grep -E 'FATAL|heap limit'
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory

real	1m5.104s
user	2m2.505s
sys	0m6.649s`,
  '52-ts6-8g': `$ time NODE_OPTIONS=--max-old-space-size=8192 node ts6/bin/tsc --noEmit -p . | grep -c 'error TS'
1

real	0m55.024s
user	1m5.978s
sys	0m3.407s`,
  '53-ts7': `$ time node ts7/bin/tsc --noEmit -p . | grep -c 'error TS'
9

real	0m6.524s
user	0m24.577s
sys	0m1.541s`,
  '54-ts7-lan2': `$ time node ts7/bin/tsc --noEmit -p . | grep -c 'error TS'
9

real	0m6.289s
user	0m24.279s
sys	0m1.485s`,
  '60-practice-green': `$ npm run check

> ts-00-3-hello@1.0.0 check
> npm run typecheck && npm test


> ts-00-3-hello@1.0.0 typecheck
> tsc -p tsconfig.json


> ts-00-3-hello@1.0.0 test
> node --test --test-reporter=spec "src/**/*.test.ts"

Lab BE-201 opens at 07:00
✔ 420 minutes is 07:00 (0.513916ms)
✔ 1290 minutes is 21:30 (0.070625ms)
Lab BE-201 opens at 07:00
✔ midnight is 00:00 (0.434541ms)
✔ the last slot ends at 21:00 (0.065666ms)
ℹ tests 4
ℹ suites 0
ℹ pass 4
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 70.529208`,
  '61-practice-red': `$ npm run check

> ts-00-3-hello@1.0.0 check
> npm run typecheck && npm test


> ts-00-3-hello@1.0.0 typecheck
> tsc -p tsconfig.json

src/practice.test.ts(11,27): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.`,
};
