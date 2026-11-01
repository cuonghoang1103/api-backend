// The test pyramid of LabFlow Lite, measured (lesson 11.1): how many tests each layer has and what one run costs.
//   node scripts/ngan-sach.mjs [runs=3]      (integration: TEST_DATABASE_URL, or Docker for Testcontainers)
// Each command runs `runs` times in a fresh process; the table shows the median wall-clock time.
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';

const RUNS = Number(process.argv[2] ?? 3);
const LAYERS = [
  ['Unit + API (src/)', ['vitest', 'run', 'src/', '--reporter=json', '--outputFile=reports/b-unit.json'], 'reports/b-unit.json'],
  ['UI components (web/)', ['vitest', 'run', '--config', 'vitest.web.config.js', 'web/', '--reporter=json', '--outputFile=reports/b-web.json'], 'reports/b-web.json'],
  ['DB integration', ['vitest', 'run', '--config', 'vitest.integration.config.js', 'test/integration', '--reporter=json', '--outputFile=reports/b-int.json'], 'reports/b-int.json'],
  ['E2E, Chromium', ['playwright', 'test', 'e2e/', '--project=chromium', '--reporter=json'], 'reports/b-e2e.json'],
  ['E2E, 5 browsers/devices', ['playwright', 'test', 'e2e/', '--reporter=json'], 'reports/b-e2e-all.json'],
  ['Mutation (Stryker, src/rules)', ['stryker', 'run'], null],
];

const count = (file) => {
  const r = JSON.parse(readFileSync(file, 'utf8'));
  if (r.numTotalTests !== undefined) return r.numTotalTests;
  return (r.stats.expected ?? 0) + (r.stats.unexpected ?? 0) + (r.stats.flaky ?? 0) - 2;   // minus the 2 sign-in setup tests
};
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

mkdirSync('reports', { recursive: true });
console.log('| Layer | Tests | Median of ' + RUNS + ' runs | Per test |');
console.log('|---|---:|---:|---:|');
for (const [name, args, report] of LAYERS) {
  const times = [];
  let ok = true;
  for (let i = 0; i < RUNS; i++) {
    const t0 = performance.now();
    const run = spawnSync('npx', args, { encoding: 'utf8', env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: report ?? '' }, shell: process.platform === 'win32' });
    times.push((performance.now() - t0) / 1000);
    ok &&= run.status === 0;
  }
  const n = report ? count(report) : Object.values(JSON.parse(readFileSync('reports/mutation/mutation.json', 'utf8')).files).reduce((k, f) => k + f.mutants.length, 0);
  const m = median(times);
  const unit = report ? '' : ' mutants';
  console.log('| ' + name + (ok ? '' : ' ❌') + ' | ' + n + unit + ' | ' + m.toFixed(1) + ' s | ' + (m * 1000 / n).toFixed(0) + ' ms |');
}
