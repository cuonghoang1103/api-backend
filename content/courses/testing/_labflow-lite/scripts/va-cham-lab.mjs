// Did two end-to-end tests book the same lab code? (lesson 11.3) Reads a Playwright JSON report in which
// freshLab() left a "lab" annotation on every test, and prints each code used by more than one test.
//   PLAYWRIGHT_JSON_OUTPUT_NAME=reports/e2e-all.json npx playwright test e2e/ --reporter=json ; node scripts/va-cham-lab.mjs reports/e2e-all.json
import { readFileSync } from 'node:fs';

const report = JSON.parse(readFileSync(process.argv[2] ?? 'reports/e2e-all.json', 'utf8'));
const users = new Map();
const walk = (suite, titles) => {
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests) {
      for (const a of t.annotations.filter((x) => x.type === 'lab')) {
        users.set(a.description, [...(users.get(a.description) ?? []), '[' + t.projectName + '] ' + [...titles, spec.title].join(' › ')]);
      }
    }
  }
  for (const child of suite.suites ?? []) walk(child, [...titles, child.title]);
};
for (const file of report.suites) walk(file, []);
const shared = [...users].filter(([, list]) => list.length > 1);
console.log(users.size + ' lab codes used by ' + [...users.values()].flat().length + ' tests');
for (const [lab, list] of shared) console.log('⚠️  ' + lab + ' is used by ' + list.length + ' tests:\n    ' + list.join('\n    '));
if (!shared.length) console.log('✔ no two tests share a lab code');
process.exitCode = shared.length ? 1 : 0;
