// The traceability matrix of LabFlow Lite (lesson 11.1), from the reports of the tests that really ran.
//   node scripts/rtm.mjs          → reads reports/{unit,web,int,e2e}.json (written by CI, or by --run)
//   node scripts/rtm.mjs --run    → runs the four suites first (integration: TEST_DATABASE_URL, or Docker for Testcontainers)
// Exit code 1 when an in-scope requirement has no passing test, or a High-risk one has none above the Unit layer.
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { testsFromVitest, testsFromPlaywright, buildMatrix, traceGaps, rtmMarkdown } from '../src/ci/rtm.js';

const SUITES = [
  ['unit', 'reports/unit.json', ['vitest', 'run', 'src/', '--reporter=json', '--outputFile=reports/unit.json']],
  ['web', 'reports/web.json', ['vitest', 'run', '--config', 'vitest.web.config.js', 'web/', '--reporter=json', '--outputFile=reports/web.json']],
  ['int', 'reports/int.json', ['vitest', 'run', '--config', 'vitest.integration.config.js', 'test/integration', '--reporter=json', '--outputFile=reports/int.json']],
  ['e2e', 'reports/e2e.json', ['playwright', 'test', 'e2e/', '--project=chromium', '--reporter=json']],
];

if (process.argv.includes('--run')) {
  mkdirSync('reports', { recursive: true });
  for (const [name, , args] of SUITES) {
    const env = { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: 'reports/e2e.json' };
    const run = spawnSync('npx', args, { encoding: 'utf8', env, shell: process.platform === 'win32' });
    console.log((run.status === 0 ? '✔ ' : '✘ ') + name + ' suite ran (exit ' + run.status + ')');
  }
  console.log();
}

const { release, requirements } = JSON.parse(readFileSync('test-plan/requirements.json', 'utf8'));
const tests = [];
for (const [name, file] of SUITES) {
  if (!existsSync(file)) { console.log('⚠️  ' + file + ' missing — the ' + name + ' layer counts as empty'); continue; }
  const report = JSON.parse(readFileSync(file, 'utf8'));
  tests.push(...(name === 'e2e' ? testsFromPlaywright(report) : testsFromVitest(report, process.cwd())));
}
const rows = buildMatrix(requirements, tests);
const gaps = traceGaps(rows);
console.log('## Traceability — ' + release + '\n\n' + tests.length + ' tests read, ' + tests.filter((t) => t.passed).length + ' passed.\n');
process.stdout.write(rtmMarkdown(rows, gaps));
process.exitCode = gaps.length ? 1 : 0;
