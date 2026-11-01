// Turns the Vitest JSON report and the coverage summary into the Markdown GitHub shows on the run page
// (lesson 9.2: written to $GITHUB_STEP_SUMMARY by scripts/ci-summary.mjs).
const METRICS = ['lines', 'branches', 'functions', 'statements'];

// report = Vitest --reporter=json output; root = the project folder, removed from file paths.
export function testHeadline(report) {
  const { numTotalTests: total, numPassedTests: passed, numFailedTests: failed, numPendingTests: skipped } = report;
  if (failed > 0) return '### ❌ ' + failed + ' of ' + total + ' tests failed';
  return '### ✅ ' + passed + ' of ' + total + ' tests passed' + (skipped ? ' (' + skipped + ' skipped)' : '');
}

export function failedTests(report, root = '') {
  const lines = [];
  for (const file of report.testResults) {
    for (const t of file.assertionResults) {
      if (t.status !== 'failed') continue;
      const where = file.name.startsWith(root) ? file.name.slice(root.length).replace(/^\//, '') : file.name;
      const why = (t.failureMessages[0] ?? '').split('\n')[0];
      lines.push('- `' + where + '` › ' + t.fullName + ' — ' + why);
    }
  }
  return lines.join('\n');
}

// summary = coverage/coverage-summary.json; thresholds = the same numbers as vitest.config.js.
export function coverageTable(summary, thresholds) {
  const rows = METRICS.map((m) => {
    const pct = summary.total[m].pct;
    const min = thresholds[m] ?? 0;
    return '| ' + m + ' | ' + pct.toFixed(2) + '% | ' + min + '% | ' + (pct >= min ? '✅' : '❌ below the minimum') + ' |';
  });
  return ['| Coverage | Now | Minimum | |', '|---|---:|---:|---|', ...rows].join('\n');
}

// Several reports (unit + web) → one: counts add up, test files are listed together.
export function mergeReports(reports) {
  const sum = (key) => reports.reduce((n, r) => n + r[key], 0);
  return {
    numTotalTests: sum('numTotalTests'), numPassedTests: sum('numPassedTests'),
    numFailedTests: sum('numFailedTests'), numPendingTests: sum('numPendingTests'),
    testResults: reports.flatMap((r) => r.testResults),
  };
}

export function stepSummary({ title, report, coverage, thresholds, root }) {
  const parts = ['## ' + title, testHeadline(report)];
  const failed = failedTests(report, root);
  if (failed) parts.push(failed);
  if (coverage) parts.push(coverageTable(coverage, thresholds));
  return parts.join('\n\n') + '\n';
}
