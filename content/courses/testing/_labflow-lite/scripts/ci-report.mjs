// The "report" job of .github/workflows/test.yml (lesson 11.4): reads the reports every other job uploaded and writes
// ONE page — tests per layer, coverage, mutation score, traceability. Exit code 1 lists why the pull request must not merge.
//   node scripts/ci-report.mjs | tee -a "$GITHUB_STEP_SUMMARY"
import { readFileSync, existsSync } from 'node:fs';
import config from '../vitest.config.js';
import stryker from '../stryker.config.mjs';
import { testsFromVitest, testsFromPlaywright, buildMatrix, traceGaps } from '../src/ci/rtm.js';
import { mutationScore, qualityReport } from '../src/ci/quality.js';

const read = (file) => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null);
const vitest = (file) => { const r = read(file); return r ? testsFromVitest(r, process.cwd()) : null; };
const pw = (file) => { const r = read(file); return r ? testsFromPlaywright(r) : null; };

const suites = [
  { label: 'Unit + API (src/)', tests: vitest('reports/unit.json') },
  { label: 'UI components (web/)', tests: vitest('reports/web.json') },
  { label: 'DB integration (PostgreSQL 17)', tests: vitest('reports/int.json') },
  { label: 'End to end (Chromium)', tests: pw('reports/e2e.json') },
];
const { release, requirements } = JSON.parse(readFileSync('test-plan/requirements.json', 'utf8'));
const rows = buildMatrix(requirements, suites.flatMap((s) => s.tests ?? []));
const mutationReport = read('reports/mutation/mutation.json');
const { markdown, problems } = qualityReport({
  title: 'Quality report — ' + release,
  suites,
  coverage: read('coverage/coverage-summary.json'),
  thresholds: config.test.coverage.thresholds,
  mutation: mutationReport ? mutationScore(mutationReport) : null,
  mutationBreak: stryker.thresholds.break,
  rtm: { rows, gaps: traceGaps(rows) },
});
process.stdout.write(markdown);
for (const p of problems) console.log('::error title=report::' + p);
process.exitCode = problems.length ? 1 : 0;
