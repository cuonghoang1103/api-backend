// Rules every LabFlow Lite workflow must follow (lessons 9.1–9.4, graded in Lab 9 by scripts/cham-lab-9.mjs).
// Each rule reads the parsed YAML and says ok or why not. actionlint checks that a workflow is VALID;
// these rules check that it is SAFE: a red test must turn the required check red, and only a real bug may do that.
import { parse } from 'yaml';

const steps = (job) => job.steps ?? [];
const runs = (job) => steps(job).filter((s) => typeof s.run === 'string').map((s) => s.run);
const setupNode = (job) => steps(job).filter((s) => typeof s.uses === 'string' && s.uses.startsWith('actions/setup-node@'));
const nameOf = (id, job) => String(job.name ?? id);
const reportOnly = (job) => job['continue-on-error'] === true;
const needsOf = (job) => [job.needs ?? []].flat();
const gateOf = (jobs) => Object.entries(jobs).find(([id, job]) => nameOf(id, job) === 'ci-ok');

const RULES = [
  ['R1', 'npm ci, never npm install', (jobs) => {
    const bad = Object.entries(jobs).filter(([, j]) => runs(j).some((r) => /\bnpm (install|i)\b/.test(r))).map(([id]) => id);
    return bad.length ? 'npm install in: ' + bad.join(', ') + ' (it may change package-lock.json; CI must install exactly the lockfile)' : '';
  }],
  ['R2', 'setup-node caches the npm downloads', (jobs) => {
    const bad = Object.entries(jobs).filter(([, j]) => setupNode(j).some((s) => s.with?.cache !== 'npm')).map(([id]) => id);
    return bad.length ? 'no cache: npm in: ' + bad.join(', ') : '';
  }],
  ['R3', 'integration tests get a healthy PostgreSQL service', (jobs) => {
    const found = Object.entries(jobs).filter(([, j]) => runs(j).some((r) => r.includes('test:int')));
    if (!found.length) return 'no job runs npm run test:int';
    for (const [id, job] of found) {
      const pg = Object.values(job.services ?? {}).find((s) => /^postgres:17\b/.test(String(s.image)));
      if (!pg) return id + ': no postgres:17 service';
      if (!String(pg.options ?? '').includes('--health-cmd')) return id + ': the service has no --health-cmd, tests may start before PostgreSQL is ready';
      const url = String(job.env?.TEST_DATABASE_URL ?? steps(job).map((s) => s.env?.TEST_DATABASE_URL).find(Boolean) ?? '');
      const hostPorts = (pg.ports ?? []).map((p) => String(p).split(':')[0]);
      if (!hostPorts.some((p) => url.includes('@localhost:' + p + '/'))) return id + ': TEST_DATABASE_URL must reach the service at localhost:<published port>, got "' + url + '"';
    }
    return '';
  }],
  ['R4', 'Playwright browsers come with their system libraries', (jobs) => {
    const bad = Object.entries(jobs).filter(([, j]) => runs(j).some((r) => r.includes('playwright install') && !r.includes('--with-deps'))).map(([id]) => id);
    return bad.length ? 'playwright install without --with-deps in: ' + bad.join(', ') : '';
  }],
  ['R5', 'one gate job named exactly ci-ok', (jobs) => {
    const gate = gateOf(jobs);
    if (!gate) return 'no job is named ci-ok — branch protection needs one stable name to require';
    return /\$\{\{/.test(String(gate[1].name ?? '')) ? 'the gate name contains an expression' : '';
  }],
  ['R6', 'the gate runs even when a job it needs failed', (jobs) => {
    const gate = gateOf(jobs);
    if (!gate) return 'no ci-ok job';
    if (!/always\(\)|!\s*cancelled\(\)/.test(String(gate[1].if ?? ''))) return 'ci-ok has no if: always() — it is SKIPPED when a job fails, and a skipped required check counts as passed';
    const text = JSON.stringify(gate[1]);
    return text.includes('ci-gate.mjs') || /needs\.[\w*-]+\.result|contains\(needs/.test(text) ? '' : 'ci-ok never looks at the results of the jobs it needs';
  }],
  ['R7', 'every blocking job is required; report-only jobs never block', (jobs) => {
    const gate = gateOf(jobs);
    if (!gate) return 'no ci-ok job';
    const needs = needsOf(gate[1]);
    const others = Object.entries(jobs).filter(([id]) => id !== gate[0]);
    const missing = others.filter(([id, j]) => !reportOnly(j) && !needs.includes(id)).map(([id]) => id);
    if (missing.length) return 'ci-ok does not need: ' + missing.join(', ');
    const blocking = needs.filter((id) => jobs[id] && reportOnly(jobs[id]));
    if (blocking.length) return 'ci-ok needs report-only jobs: ' + blocking.join(', ');
    const flaky = others.filter(([, j]) => !reportOnly(j) && runs(j).some((r) => r.includes('test:quarantine'))).map(([id]) => id);
    return flaky.length ? 'quarantined tests run in a blocking job: ' + flaky.join(', ') : '';
  }],
  ['R8', 'a red matrix leg makes the job red', (jobs, { minNode }) => {
    for (const [id, job] of Object.entries(jobs)) {
      const matrix = job.strategy?.matrix;
      if (!matrix) continue;
      if (reportOnly(job)) return id + ': continue-on-error: true hides every red leg of the matrix';
      const old = [matrix.node ?? []].flat().filter((v) => Number.parseInt(v, 10) < minNode);
      if (old.length) return id + ': Node ' + old.join(', ') + ' is below engines (>= ' + minNode + ')';
    }
    return '';
  }],
];

export function checkWorkflow(text, { minNode = 22 } = {}) {
  const jobs = parse(text)?.jobs ?? {};
  return RULES.map(([id, title, rule]) => {
    const why = rule(jobs, { minNode });
    return { id, title, ok: why === '', why };
  });
}
