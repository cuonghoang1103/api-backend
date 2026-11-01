// Tests for the CI configuration itself (lesson 9.1): the real .github/workflows/test.yml must keep its promises.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { checkWorkflow } from './policy.js';

const TEXT = readFileSync(new URL('../../.github/workflows/test.yml', import.meta.url), 'utf8');
const { on, jobs } = parse(TEXT);
const PKG = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
const runs = (id) => jobs[id].steps.filter((s) => s.run).map((s) => s.run);

describe('.github/workflows/test.yml', () => {
  it.each(checkWorkflow(TEXT).map((r) => [r.id + ' ' + r.title, r]))('%s', (_, r) => {
    expect(r.why).toBe('');
  });

  it('runs on pull requests and on pushes to main', () => {
    expect(on.pull_request).toBeDefined();
    expect(on.push.branches).toEqual(['main']);
  });

  it('the unit job tests every Node version that package.json supports, and only those', () => {
    expect(PKG.engines.node).toBe('>=22.12');
    expect(jobs.unit.strategy.matrix.node).toEqual([22, 24]);
    expect(jobs.unit.strategy['fail-fast']).toBe(false);
  });

  it('the integration job uses the same PostgreSQL major version as production (17) and waits for it', () => {
    const pg = jobs.integration.services.postgres;
    expect(pg.image).toBe('postgres:17');
    expect(pg.options).toMatch(/--health-cmd "pg_isready -U postgres -d labflow_test"/);
    expect(jobs.integration.env.TEST_DATABASE_URL).toBe('postgres://postgres:test@localhost:5432/labflow_test');
  });

  it('e2e installs Chromium with its system libraries before running Playwright', () => {
    expect(runs('e2e')).toEqual(['npm ci', 'npx playwright install --with-deps chromium', 'npm run test:e2e']);
  });

  it('every test job uploads its reports, even when the tests are red', () => {
    const uploaders = Object.entries(jobs).filter(([, j]) => j.steps.some((s) => String(s.uses).startsWith('actions/upload-artifact@')));
    expect(uploaders.map(([id]) => id)).toEqual(['unit', 'integration', 'e2e', 'mutation']);
    const uploads = uploaders.flatMap(([, j]) => j.steps.filter((s) => String(s.uses).startsWith('actions/upload-artifact@')));
    expect(uploads.every((s) => s.if === '${{ !cancelled() }}')).toBe(true);
  });

  it('the gate requires exactly unit, integration, e2e, mutation and report (lesson 11.4)', () => {
    expect(jobs['ci-ok'].needs).toEqual(['unit', 'integration', 'e2e', 'mutation', 'report']);
    expect(jobs['ci-ok'].steps.at(-1).env.REQUIRED).toBe('unit,integration,e2e,mutation,report');
  });

  it('the report job reads every report, runs even after a red job, and keeps the exit code through tee', () => {
    const report = jobs.report;
    expect(report.if).toBe('${{ !cancelled() }}');
    expect(report.needs).toEqual(['unit', 'integration', 'e2e', 'mutation']);
    const names = report.steps.filter((s) => String(s.uses).startsWith('actions/download-artifact@')).map((s) => s.with.name);
    expect(names).toEqual(['unit-reports-node22', 'int-reports', 'e2e-reports', 'mutation-report']);
    const last = report.steps.at(-1);
    expect([last.shell, last.run]).toEqual(['bash', 'node scripts/ci-report.mjs | tee -a "$GITHUB_STEP_SUMMARY"']);
  });
});
