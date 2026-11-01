// The one quality report of a pull request (lesson 11.4): every layer's tests, coverage, mutation score and traceability
// on one page — and the list of problems that make the "report" job (and so ci-ok) red.
import { coverageTable } from './summary.js';
import { rtmMarkdown } from './rtm.js';

// Stryker's JSON report → score in %, the way Stryker counts it: (killed + timeout) / every mutant that could run.
export function mutationScore(report) {
  let detected = 0;
  let valid = 0;
  for (const file of Object.values(report.files)) {
    for (const m of file.mutants) {
      if (['CompileError', 'RuntimeError', 'Ignored'].includes(m.status)) continue;
      valid++;
      if (m.status === 'Killed' || m.status === 'Timeout') detected++;
    }
  }
  return valid === 0 ? 0 : Math.round((detected / valid) * 10000) / 100;
}

// suites: [{ label, tests: [{ passed }] | null }] — null means the report is missing (the job did not run or crashed).
export function qualityReport({ title, suites, coverage, thresholds, mutation, mutationBreak, rtm }) {
  const problems = [];
  const rows = suites.map(({ label, tests }) => {
    if (!tests) { problems.push(label + ': no report'); return '| ' + label + ' | — | — | ⚠️ no report |'; }
    const failed = tests.filter((t) => !t.passed).length;
    if (failed) problems.push(label + ': ' + failed + ' failed');
    if (tests.length === 0) problems.push(label + ': 0 tests');
    return '| ' + label + ' | ' + tests.length + ' | ' + failed + ' | ' + (failed || tests.length === 0 ? '❌' : '✅') + ' |';
  });
  for (const m of Object.keys(thresholds)) {
    if (coverage && coverage.total[m].pct < thresholds[m]) problems.push('coverage ' + m + ' ' + coverage.total[m].pct + '% < ' + thresholds[m] + '%');
  }
  if (!coverage) problems.push('coverage: no report');
  if (mutation === null) problems.push('mutation: no report');
  else if (mutation < mutationBreak) problems.push('mutation score ' + mutation + '% < ' + mutationBreak + '%');
  problems.push(...rtm.gaps.map((g) => 'traceability — ' + g));

  const parts = [
    '## ' + title,
    problems.length ? '### ❌ Do not merge\n\n' + problems.map((p) => '- ' + p).join('\n') : '### ✅ Every check passed',
    ['| Layer | Tests | Failed | |', '|---|---:|---:|---|', ...rows].join('\n'),
    coverage ? coverageTable(coverage, thresholds) : '',
    '**Mutation score:** ' + (mutation === null ? '—' : mutation + '%') + ' (minimum ' + mutationBreak + '%)',
    '### Traceability\n\n' + rtmMarkdown(rtm.rows, rtm.gaps).trim(),
  ];
  return { markdown: parts.filter(Boolean).join('\n\n') + '\n', problems };
}
