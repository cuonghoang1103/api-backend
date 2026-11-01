// Tests for the pull-request quality report (lesson 11.4).
import { describe, it, expect } from 'vitest';
import { mutationScore, qualityReport } from './quality.js';

const stryker = (...statuses) => ({ files: { 'a.js': { mutants: statuses.map((status) => ({ status })) } } });

describe('mutationScore', () => {
  it('counts killed and timed-out mutants as detected, the way Stryker does', () => {
    expect(mutationScore(stryker('Killed', 'Killed', 'Timeout', 'Survived'))).toBe(75);
    expect(mutationScore(stryker('Killed', 'NoCoverage'))).toBe(50);
  });
  it('leaves out mutants that could not run; nothing to run → 0', () => {
    expect(mutationScore(stryker('Killed', 'CompileError', 'RuntimeError', 'Ignored'))).toBe(100);
    expect(mutationScore(stryker())).toBe(0);
  });
  it('rounds to two decimals: 427 + 2 of 433 → 99.08', () => {
    expect(mutationScore(stryker(...Array(427).fill('Killed'), 'Timeout', 'Timeout', 'Survived', 'Survived', 'Survived', 'Survived'))).toBe(99.08);
  });
});

describe('qualityReport', () => {
  const pass = { passed: true };
  const coverage = { total: { lines: { pct: 98.87 }, branches: { pct: 92.62 }, functions: { pct: 97.39 }, statements: { pct: 98.22 } } };
  const thresholds = { lines: 97, branches: 91, functions: 96, statements: 97 };
  const ok = { title: 'Q', suites: [{ label: 'Unit', tests: [pass, pass] }, { label: 'E2E', tests: [pass] }], coverage, thresholds, mutation: 99.08, mutationBreak: 95, rtm: { rows: [], gaps: [] } };

  it('all good → no problems, a green headline and every section', () => {
    const { markdown, problems } = qualityReport(ok);
    expect(problems).toEqual([]);
    expect(markdown).toContain('### ✅ Every check passed');
    expect(markdown).toContain('| Unit | 2 | 0 | ✅ |');
    expect(markdown).toContain('**Mutation score:** 99.08% (minimum 95%)');
    expect(markdown).toContain('| lines | 98.87% | 97% | ✅ |');
  });

  it('lists every reason not to merge', () => {
    const { markdown, problems } = qualityReport({
      ...ok,
      suites: [{ label: 'Unit', tests: [pass, { passed: false }] }, { label: 'DB', tests: null }, { label: 'UI', tests: [] }],
      coverage: { total: { ...coverage.total, branches: { pct: 90.5 } } },
      mutation: 94.99,
      rtm: { rows: [], gaps: ['Lite-3: High risk, tested only at the Unit layer'] },
    });
    expect(problems).toEqual(['Unit: 1 failed', 'DB: no report', 'UI: 0 tests', 'coverage branches 90.5% < 91%',
      'mutation score 94.99% < 95%', 'traceability — Lite-3: High risk, tested only at the Unit layer']);
    expect(markdown).toContain('### ❌ Do not merge');
    expect(markdown).toContain('| DB | — | — | ⚠️ no report |');
  });

  it('a missing coverage or mutation report is a problem, not a pass', () => {
    const { problems, markdown } = qualityReport({ ...ok, coverage: null, mutation: null });
    expect(problems).toEqual(['coverage: no report', 'mutation: no report']);
    expect(markdown).toContain('**Mutation score:** — (minimum 95%)');
  });

  it('exactly at a minimum is enough', () => {
    const edge = { total: { lines: { pct: 97 }, branches: { pct: 91 }, functions: { pct: 96 }, statements: { pct: 97 } } };
    expect(qualityReport({ ...ok, coverage: edge, mutation: 95 }).problems).toEqual([]);
  });
});
