// Tests for the traceability matrix (lesson 11.1).
import { describe, it, expect } from 'vitest';
import { layerOf, tagsOf, testsFromVitest, testsFromPlaywright, buildMatrix, traceGaps, rtmMarkdown } from './rtm.js';

describe('tagsOf', () => {
  it.each([
    ['checkSlot accepts 08:00–12:00 (240 min) Lite-1', ['Lite-1']],
    ['needsApproval (BR-06 decision table) LECTURER, 31 seats → false Lite-2', ['BR-06', 'Lite-2']],
    ['cancelMyBooking (US-11) twice (AC4)', ['US-11 AC4']],
    ['the API on PostgreSQL (US-11) book → cancel (AC1, AC2)', ['US-11 AC1', 'US-11 AC2']],
    ['old style (US-11 AC2–AC4)', ['US-11 AC2', 'US-11 AC3', 'US-11 AC4']],
    ['AC2 without the story id', []],
    ['BR-4 is not an id, BR-045 neither', []],
  ])('%s → %j', (name, tags) => {
    expect(tagsOf(name)).toEqual(tags);
  });
});

describe('layerOf', () => {
  it.each([
    ['src/rules/cancel.test.js', 'Unit'], ['src/api/myBookings.test.js', 'API'], ['test/integration/myBookings.int.test.js', 'DB'],
    ['web/MyBookings.test.jsx', 'UI'], ['e2e/huy-phong.spec.js', 'E2E'], ['/home/runner/work/x/src/api/server.test.js', 'API'],
    ['src/ci/rtm.test.js', null],   // the tooling's own tests prove nothing about the product
  ])('%s → %s', (file, layer) => {
    expect(layerOf(file)).toBe(layer);
  });
});

describe('reading the reports', () => {
  it('Vitest: one entry per test, path relative to the project', () => {
    const report = { testResults: [{ name: '/w/p/src/a.test.js', assertionResults: [
      { fullName: 'a (BR-04) ok', status: 'passed' }, { fullName: 'a (BR-04) red', status: 'failed' }] }] };
    expect(testsFromVitest(report, '/w/p')).toEqual([
      { file: 'src/a.test.js', name: 'a (BR-04) ok', passed: true },
      { file: 'src/a.test.js', name: 'a (BR-04) red', passed: false },
    ]);
  });

  it('Playwright: describe titles join the name, the setup project is ignored, flaky counts as passed', () => {
    const report = { suites: [{ title: 'dat-phong.spec.js', file: 'dat-phong.spec.js', specs: [], suites: [{ title: 'as student an', file: 'dat-phong.spec.js',
      specs: [{ title: 'books (BR-04)', file: 'dat-phong.spec.js', tests: [{ projectName: 'chromium', status: 'flaky' }, { projectName: 'setup', status: 'expected' }] }] }] },
    { title: 'x.spec.js', file: 'x.spec.js', specs: [{ title: 'top (BR-06)', file: 'x.spec.js', tests: [{ projectName: 'chromium', status: 'unexpected' }] }] }] };
    expect(testsFromPlaywright(report)).toEqual([
      { file: 'dat-phong.spec.js', name: 'as student an books (BR-04)', passed: true },
      { file: 'x.spec.js', name: 'top (BR-06)', passed: false },
    ]);
  });
});

describe('buildMatrix and traceGaps', () => {
  const REQ = [
    { id: 'BR-04', risk: 'High', inScope: true }, { id: 'BR-05', risk: 'Medium', inScope: true },
    { id: 'Lite-3', risk: 'High', inScope: true }, { id: 'BR-09', risk: 'Medium', inScope: false },
  ];
  const tests = [
    { file: 'src/rules/booking.test.js', name: 'x BR-04', passed: true },
    { file: 'e2e/dat-phong.spec.js', name: 'y (BR-04)', passed: true },
    { file: 'src/rules/booking.test.js', name: 'z (BR-05)', passed: true },
    { file: 'src/rules/cancel.test.js', name: 'c (Lite-3)', passed: true },
    { file: 'src/api/myBookings.test.js', name: 'red (Lite-3)', passed: false },
    { file: 'src/ci/rtm.test.js', name: 'tagsOf x (BR-05)', passed: true },
  ];

  it('counts passing tests only, per layer', () => {
    const rows = buildMatrix(REQ, tests);
    expect(rows[0].counts).toEqual({ Unit: 1, API: 0, DB: 0, UI: 0, E2E: 1 });
    expect(rows.map((r) => r.total)).toEqual([2, 1, 1, 0]);
  });

  it('a High-risk requirement needs a test above Unit; an untested in-scope one is a gap; out of scope never is', () => {
    expect(traceGaps(buildMatrix(REQ, tests))).toEqual(['Lite-3: High risk, tested only at the Unit layer']);
    expect(traceGaps(buildMatrix(REQ, []))).toEqual(['BR-04: no passing test', 'BR-05: no passing test', 'Lite-3: no passing test']);
  });

  it('renders a Markdown table with the verdict per row', () => {
    const rows = buildMatrix(REQ, tests);
    const md = rtmMarkdown(rows, traceGaps(rows));
    expect(md).toContain('| BR-04 | High | 1 | · | · | · | 1 | ✅ |');
    expect(md).toContain('| Lite-3 | High | 1 | · | · | · | · | ❌ |');
    expect(md).toContain('| BR-09 (out of scope) | Medium | · | · | · | · | · | — |');
    expect(md).toContain('- Lite-3: High risk, tested only at the Unit layer');
    expect(rtmMarkdown([], [])).toContain('Every in-scope requirement is traced to a passing test.');
  });
});
