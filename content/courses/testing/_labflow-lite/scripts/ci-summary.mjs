// Writes the Markdown of a test job to stdout (lesson 9.2). In the workflow:
//   node scripts/ci-summary.mjs "unit (Node 22)" reports/unit.json,reports/web.json coverage/coverage-summary.json | tee -a "$GITHUB_STEP_SUMMARY"
import { readFileSync, existsSync } from 'node:fs';
import { mergeReports, stepSummary } from '../src/ci/summary.js';
import config from '../vitest.config.js';

const [title = 'tests', reportList = 'reports/unit.json', coverageFile] = process.argv.slice(2);
const files = reportList.split(',');
const missing = files.filter((f) => !existsSync(f));
if (missing.length) {
  console.log('## ' + title + '\n\n### ⚠️ no test report (' + missing.join(', ') + ') — those tests did not run, see the log\n');
  process.exit(0);
}
const report = mergeReports(files.map((f) => JSON.parse(readFileSync(f, 'utf8'))));
const coverage = coverageFile && existsSync(coverageFile) ? JSON.parse(readFileSync(coverageFile, 'utf8')) : undefined;
process.stdout.write(stepSummary({ title, report, coverage, thresholds: config.test.coverage.thresholds, root: process.cwd() }));
