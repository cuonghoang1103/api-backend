import { describe, it, expect } from 'vitest';
import { testHeadline, failedTests, coverageTable, mergeReports, stepSummary } from './summary.js';

const ROOT = '/work/labflow-lite';
const test = (fullName, status, message) => ({ fullName, status, failureMessages: message ? [message] : [] });
const report = (files) => {
  const all = files.flatMap((f) => f.assertionResults);
  const count = (s) => all.filter((t) => t.status === s).length;
  return { numTotalTests: all.length, numPassedTests: count('passed'), numFailedTests: count('failed'), numPendingTests: count('skipped'), testResults: files };
};
const GREEN = report([{ name: ROOT + '/src/rules/booking.test.js', assertionResults: [test('31 seats need approval', 'passed'), test('30 seats do not', 'passed')] }]);
const RED = report([
  { name: ROOT + '/src/rules/booking.test.js', assertionResults: [test('31 seats need approval', 'passed'), test('30 seats do not', 'failed', 'AssertionError: expected true to be false\n    at booking.test.js:12:5')] },
  { name: ROOT + '/src/rules/cancel.test.js', assertionResults: [test('at 08:01 → false', 'failed', 'AssertionError: expected true to be false'), test('todo later', 'skipped')] },
]);
const cov = (lines, branches, functions, statements) => ({ total: { lines: { pct: lines }, branches: { pct: branches }, functions: { pct: functions }, statements: { pct: statements } } });
const MIN = { lines: 85, branches: 80, functions: 80, statements: 85 };

describe('testHeadline', () => {
  it('green: how many passed out of how many', () => {
    expect(testHeadline(GREEN)).toBe('### ✅ 2 of 2 tests passed');
  });
  it('red: the number of failures comes first', () => {
    expect(testHeadline(RED)).toBe('### ❌ 2 of 4 tests failed');
  });
  it('a single failure is enough to be red', () => {
    const one = report([{ name: ROOT + '/a.test.js', assertionResults: [test('a', 'passed'), test('b', 'failed', 'Error: boom')] }]);
    expect(testHeadline(one)).toBe('### ❌ 1 of 2 tests failed');
  });
  it('skipped tests are said out loud, not hidden in the total', () => {
    const r = report([{ name: ROOT + '/a.test.js', assertionResults: [test('a', 'passed'), test('b', 'skipped')] }]);
    expect(testHeadline(r)).toBe('### ✅ 1 of 2 tests passed (1 skipped)');
  });
});

describe('failedTests', () => {
  it('one line per failed test: relative file, full name, first line of the error', () => {
    expect(failedTests(RED, ROOT)).toBe([
      '- `src/rules/booking.test.js` › 30 seats do not — AssertionError: expected true to be false',
      '- `src/rules/cancel.test.js` › at 08:01 → false — AssertionError: expected true to be false',
    ].join('\n'));
  });
  it('nothing failed → empty', () => {
    expect(failedTests(GREEN, ROOT)).toBe('');
  });
});

describe('coverageTable', () => {
  it('two decimals, the minimum, and a mark per metric', () => {
    expect(coverageTable(cov(98.41, 93.16, 96.87, 96.99), MIN).split('\n')).toEqual([
      '| Coverage | Now | Minimum | |', '|---|---:|---:|---|',
      '| lines | 98.41% | 85% | ✅ |', '| branches | 93.16% | 80% | ✅ |', '| functions | 96.87% | 80% | ✅ |', '| statements | 96.99% | 85% | ✅ |',
    ]);
  });
  it('exactly at the minimum passes; just under fails', () => {
    const rows = coverageTable(cov(85, 79.99, 80, 85), MIN).split('\n');
    expect(rows[2]).toBe('| lines | 85.00% | 85% | ✅ |');
    expect(rows[3]).toBe('| branches | 79.99% | 80% | ❌ below the minimum |');
  });
});

describe('mergeReports', () => {
  it('unit + web: the counts add up and every file is kept', () => {
    const merged = mergeReports([GREEN, RED]);
    expect(testHeadline(merged)).toBe('### ❌ 2 of 6 tests failed');
    expect(merged.numPassedTests).toBe(3);
    expect(merged.numPendingTests).toBe(1);
    expect(merged.testResults.map((f) => f.name.slice(ROOT.length))).toEqual(['/src/rules/booking.test.js', '/src/rules/booking.test.js', '/src/rules/cancel.test.js']);
  });
});

describe('stepSummary', () => {
  it('title, headline, failures, then coverage — separated by blank lines', () => {
    const md = stepSummary({ title: 'unit (Node 22)', report: RED, coverage: cov(98.41, 93.16, 96.87, 96.99), thresholds: MIN, root: ROOT });
    expect(md.split('\n\n').map((p) => p.split('\n')[0])).toEqual(['## unit (Node 22)', '### ❌ 2 of 4 tests failed', '- `src/rules/booking.test.js` › 30 seats do not — AssertionError: expected true to be false', '| Coverage | Now | Minimum | |']);
  });
  it('without coverage there is no table', () => {
    expect(stepSummary({ title: 'web', report: GREEN, root: ROOT })).toBe('## web\n\n### ✅ 2 of 2 tests passed\n');
  });
});
