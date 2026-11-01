import { describe, it, expect } from 'vitest';
import { stringify } from 'yaml';
import { checkWorkflow } from './policy.js';

// A small workflow that follows every rule. Each test breaks ONE thing and expects exactly that rule to fail.
const node = { uses: 'actions/setup-node@v4', with: { 'node-version': 22, cache: 'npm' } };
const good = () => ({
  unit: { strategy: { matrix: { node: [22, 24] } }, steps: [node, { run: 'npm ci' }, { run: 'npm run test:unit' }] },
  integration: {
    services: { postgres: { image: 'postgres:17', ports: ['5432:5432'], options: '--health-cmd "pg_isready" --health-retries 30' } },
    env: { TEST_DATABASE_URL: 'postgres://postgres:test@localhost:5432/labflow_test' },
    steps: [node, { run: 'npm ci' }, { run: 'npm run test:int -- test/integration' }],
  },
  e2e: { steps: [node, { run: 'npm ci' }, { run: 'npx playwright install --with-deps chromium' }, { run: 'npm run test:e2e' }] },
  quarantine: { 'continue-on-error': true, steps: [node, { run: 'npm ci' }, { run: 'npm run test:quarantine' }] },
  'ci-ok': { name: 'ci-ok', if: 'always()', needs: ['unit', 'integration', 'e2e'], steps: [{ run: 'node scripts/ci-gate.mjs' }] },
});
const failing = (jobs) => checkWorkflow(stringify({ jobs })).filter((r) => !r.ok).map((r) => r.id + ' ' + r.why);

describe('checkWorkflow', () => {
  it('a workflow that follows every rule passes all 8', () => {
    expect(checkWorkflow(stringify({ jobs: good() })).map((r) => r.id + (r.ok ? ' ok' : ''))).toEqual(['R1 ok', 'R2 ok', 'R3 ok', 'R4 ok', 'R5 ok', 'R6 ok', 'R7 ok', 'R8 ok']);
  });

  it('R1: npm install instead of npm ci', () => {
    const jobs = good(); jobs.e2e.steps[1] = { run: 'npm install' };
    expect(failing(jobs)).toEqual(['R1 npm install in: e2e (it may change package-lock.json; CI must install exactly the lockfile)']);
  });

  it('R2: a setup-node step without cache: npm', () => {
    const jobs = good(); jobs.integration.steps[0] = { uses: 'actions/setup-node@v4', with: { 'node-version': 22 } };
    expect(failing(jobs)).toEqual(['R2 no cache: npm in: integration']);
  });

  it('R3: no PostgreSQL service', () => {
    const jobs = good(); delete jobs.integration.services;
    expect(failing(jobs)).toEqual(['R3 integration: no postgres:17 service']);
  });

  it('R3: a service without a health check', () => {
    const jobs = good(); jobs.integration.services.postgres.options = '--name db';
    expect(failing(jobs)).toEqual(['R3 integration: the service has no --health-cmd, tests may start before PostgreSQL is ready']);
  });

  it('R3: the URL points at a port nobody published', () => {
    const jobs = good(); jobs.integration.env.TEST_DATABASE_URL = 'postgres://postgres:test@localhost:5433/labflow_test';
    expect(failing(jobs)).toEqual(['R3 integration: TEST_DATABASE_URL must reach the service at localhost:<published port>, got "postgres://postgres:test@localhost:5433/labflow_test"']);
  });

  it('R4: browsers without their system libraries', () => {
    const jobs = good(); jobs.e2e.steps[2] = { run: 'npx playwright install chromium' };
    expect(failing(jobs)).toEqual(['R4 playwright install without --with-deps in: e2e']);
  });

  it('R5: the gate name changes with the event', () => {
    const jobs = good(); jobs['ci-ok'].name = 'ci-ok ${{ github.event_name }}';
    expect(failing(jobs)[0]).toBe('R5 no job is named ci-ok — branch protection needs one stable name to require');
  });

  it('R6: a gate without if: always() is skipped when a job fails', () => {
    const jobs = good(); delete jobs['ci-ok'].if;
    expect(failing(jobs)).toEqual(['R6 ci-ok has no if: always() — it is SKIPPED when a job fails, and a skipped required check counts as passed']);
  });

  it('R6: a gate that never reads the results', () => {
    const jobs = good(); jobs['ci-ok'].steps = [{ run: 'echo all green' }];
    expect(failing(jobs)).toEqual(['R6 ci-ok never looks at the results of the jobs it needs']);
  });

  it('R7: the gate forgot a blocking job', () => {
    const jobs = good(); jobs['ci-ok'].needs = ['unit', 'e2e'];
    expect(failing(jobs)).toEqual(['R7 ci-ok does not need: integration']);
  });

  it('R7: the gate needs the report-only quarantine job', () => {
    const jobs = good(); jobs['ci-ok'].needs.push('quarantine');
    expect(failing(jobs)).toEqual(['R7 ci-ok needs report-only jobs: quarantine']);
  });

  it('R7: quarantined tests inside a blocking job', () => {
    const jobs = good(); jobs.unit.steps.push({ run: 'npm run test:quarantine' });
    expect(failing(jobs)).toEqual(['R7 quarantined tests run in a blocking job: unit']);
  });

  it('R8: continue-on-error on a matrix job hides red legs', () => {
    const jobs = good(); jobs.unit['continue-on-error'] = true;
    expect(failing(jobs)).toContain('R8 unit: continue-on-error: true hides every red leg of the matrix');
  });

  it('R8: a Node version below engines', () => {
    const jobs = good(); jobs.unit.strategy.matrix.node = [20, 22];
    expect(failing(jobs)).toEqual(['R8 unit: Node 20 is below engines (>= 22)']);
  });
});
