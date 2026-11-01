/**
 * _ma.mjs (Chương 9) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  wf91: `# Lesson 9.1 — first workflow: unit + web tests, no cache yet
name: tests
on:
  push:
    branches: [main]
  pull_request:

jobs:
  unit:
    name: unit + web
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:web`,
  wf91Int: `# Lesson 9.1 — integration tests against a PostgreSQL service container (GitHub docs pattern: localhost + ports)
name: tests
on: [push, pull_request]

jobs:
  integration:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: labflow_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres -d labflow_test"
          --health-interval 2s --health-timeout 3s --health-retries 30
    env:
      TEST_DATABASE_URL: postgres://postgres:test@localhost:5432/labflow_test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:int -- test/integration`,
  actrc: `-P ubuntu-latest=catthehacker/ubuntu:act-24.04`,
  testYml: `# LabFlow Lite — tests on every pull request and on main (Chapter 9).
# Branch protection requires ONE status check: ci-ok (lesson 9.3). Run it on your machine with act (lesson 9.1).
name: tests

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

permissions:
  contents: read

concurrency:                                  # a new push to the same pull request cancels the old run (lesson 9.4)
  group: tests-\${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: \${{ github.event_name == 'pull_request' }}

jobs:
  unit:
    name: unit (Node \${{ matrix.node }})
    runs-on: ubuntu-latest
    timeout-minutes: 10
    strategy:
      fail-fast: false                        # see every version's result, not only the first red one
      matrix:
        node: [22, 24]                        # package.json engines: >=22.12 (Node 20 fails 4 tests, lesson 9.4)
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
          cache: npm                          # ~/.npm, keyed by package-lock.json
      - run: npm ci
      - name: unit tests + coverage
        run: >-
          npx vitest run src/ --coverage
          --reporter=tree --reporter=github-actions
          --reporter=junit --outputFile.junit=reports/junit-unit.xml
          --reporter=json --outputFile.json=reports/unit.json
      - name: web tests
        run: npm run test:web -- --reporter=tree --reporter=github-actions --reporter=json --outputFile.json=reports/web.json
      - name: summary
        if: \${{ !cancelled() }}
        run: node scripts/ci-summary.mjs "unit (Node \${{ matrix.node }})" reports/unit.json,reports/web.json coverage/coverage-summary.json | tee -a "$GITHUB_STEP_SUMMARY"
      - name: upload reports
        if: \${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: unit-reports-node\${{ matrix.node }}   # artifact names must be unique in a run
          path: |
            reports/
            coverage/
          retention-days: 7

  integration:
    name: integration (PostgreSQL 17)
    runs-on: ubuntu-latest
    timeout-minutes: 10
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: labflow_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres -d labflow_test"
          --health-interval 2s --health-timeout 3s --health-retries 30
    env:
      TEST_DATABASE_URL: postgres://postgres:test@localhost:5432/labflow_test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:int -- test/integration --reporter=tree --reporter=github-actions

  e2e:
    name: e2e (Chromium)
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - name: upload Playwright report
        if: \${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

  quarantine:
    name: quarantine (report only)
    runs-on: ubuntu-latest
    timeout-minutes: 10
    continue-on-error: true                   # known flaky tests: reported, never block (lesson 9.3)
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:quarantine -- --repeats=9

  ci-ok:
    name: ci-ok
    if: always()                              # must run (and fail) when a job it needs failed or was skipped
    needs: [unit, integration, e2e]
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - name: every required job passed?
        env:
          NEEDS: \${{ toJSON(needs) }}
          REQUIRED: unit,integration,e2e
        run: node scripts/ci-gate.mjs`,
  nightly: `# LabFlow Lite — the slow checks, once a night (lesson 9.3). Not a required check: it opens no pull request,
# it tells the team in the morning. Cron is in UTC: 20:00 UTC = 03:00 in Viet Nam (before 07:00 — lesson 8.3's clock bug hour).
name: nightly

on:
  schedule:
    - cron: '0 20 * * *'
  workflow_dispatch:

permissions:
  contents: read

jobs:
  mutation:
    name: mutation (Stryker)
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:mutation
      - name: upload mutation report
        if: \${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: mutation-report
          path: reports/mutation/
          retention-days: 14

  shuffled:
    name: unit, shuffled ×5 (flaky hunt)
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx vitest run src/ --sequence.shuffle --repeats=4 --reporter=dot

  e2e-all:
    name: e2e (5 browsers and devices)
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium firefox webkit
      - run: npm run test:e2e:all
      - name: upload Playwright report
        if: \${{ !cancelled() }}
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-nightly
          path: playwright-report/
          retention-days: 14`,
  gate: `// The one required check (lesson 9.3): decides from the results of the jobs it needs whether a pull request may merge.
// needs = the toJSON(needs) context of the gate job: { unit: { result: 'success', outputs: {} }, … }
// required = the jobs that must have passed. Anything but 'success' blocks: failure, cancelled — and skipped,
// because on GitHub a skipped required check counts as passed.
export function decideMerge(needs, required) {
  const problems = [];
  for (const job of required) {
    const result = needs[job]?.result;
    if (result === undefined) problems.push(job + ': not in needs');
    else if (result !== 'success') problems.push(job + ': ' + result);
  }
  return { ok: problems.length === 0, problems };
}`,
  th93: `# Practice 9.3 — a gate without a script: expressions only
name: gate
on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:unit

  ci-ok:
    name: ci-ok
    if: always()
    needs: [unit]
    runs-on: ubuntu-latest
    steps:
      - name: any required job not successful?
        if: contains(needs.*.result, 'failure') || contains(needs.*.result, 'cancelled') || contains(needs.*.result, 'skipped')
        run: |
          echo "unit: \${{ needs.unit.result }}"
          exit 1
      - run: echo "ci-ok — every required job passed"`,
  shard: `// Splits test files into shards that take about the same time (lesson 9.4).
// Vitest's own --shard=i/n splits by file, not by time; with timings from an earlier run we can do better:
// longest file first, each into the shard that has the least work so far.
export const UNKNOWN_MS = 1000; // a file with no timing yet (a new test) counts as one second

export function splitIntoShards(files, total, durations = {}) {
  if (!Number.isInteger(total) || total < 1) throw new RangeError('total must be a whole number ≥ 1, got ' + total);
  const shards = Array.from({ length: total }, () => ({ files: [], ms: 0 }));
  const cost = (f) => durations[f] ?? UNKNOWN_MS;
  const order = [...files].sort((a, b) => cost(b) - cost(a) || a.localeCompare(b));
  for (const file of order) {
    const lightest = shards.reduce((min, s) => (s.ms < min.ms ? s : min));
    lightest.files.push(file);
    lightest.ms += cost(file);
  }
  return shards;
}

// spec = "2/3" like --shard: the second of three shards (1-based).
export function pickShard(files, spec, durations) {
  const m = /^(\\d+)\\/(\\d+)$/.exec(spec);
  if (!m) throw new SyntaxError('shard must look like 2/3, got ' + spec);
  const [index, total] = [Number(m[1]), Number(m[2])];
  if (index < 1 || index > total) throw new RangeError('shard ' + spec + ' does not exist');
  return splitIntoShards(files, total, durations)[index - 1].files;
}

// Timings per file (ms) from a Vitest JSON report: { '<relative file>': ms }.
export function durationsFromReport(report, root = '') {
  const out = {};
  for (const r of report.testResults) {
    const file = r.name.startsWith(root) ? r.name.slice(root.length).replace(/^\\//, '') : r.name;
    out[file] = Math.round(r.endTime - r.startTime);
  }
  return out;
}`,
  wf94Shard: `# Lesson 9.4 — a slow suite split into 3 shards by timing, then ONE merged report
name: shards
on: [push, pull_request]

jobs:
  slow:
    name: slow suite (shard \${{ matrix.shard }}/3)
    runs-on: ubuntu-latest
    timeout-minutes: 10
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: tests of this shard
        run: >-
          node scripts/shard.mjs \${{ matrix.shard }}/3 demo9/cham/timings.json |
          xargs npx vitest run --no-file-parallelism --reporter=tree
          --reporter=blob --outputFile.blob=.vitest/blob/blob-\${{ matrix.shard }}.json
      - uses: actions/upload-artifact@v4
        if: \${{ !cancelled() }}
        with:
          name: blob-\${{ matrix.shard }}
          path: .vitest/blob/
          retention-days: 1

  report:
    name: slow suite (merged report)
    needs: slow
    if: \${{ !cancelled() }}
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - uses: actions/download-artifact@v4
        with:
          pattern: blob-*
          merge-multiple: true
          path: .vitest/blob/
      - run: npx vitest --merge-reports .vitest/blob --reporter=tree`,
  lab: `# Lab 9 — the CI workflow a teammate wrote in a hurry. It is mostly valid and "usually green". Fix it:
#   actionlint lab9/ci.yml          → 0 problems
#   node scripts/cham-lab-9.mjs     → 8/8 rules
#   node scripts/cham-lab-9.mjs --act   → green on the real code, red (gate) on a planted bug
# Branch protection today requires: "tests passed (pull_request)".
name: tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  unit:
    name: unit (Node \${{ matrix.node }})
    runs-on: ubuntu-latest
    continue-on-error: true            # "Node 20 is sometimes red, don't let it block us"
    strategy:
      matrix:
        node: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.nodes }}
      - run: npm install
      - run: npm run test:unit
      - run: npm run test:web
      - run: npm run test:quarantine

  integration:
    runs-on: ubuntu-latest
    env:
      TEST_DATABASE_URL: postgres://postgres:test@localhost:5432/labflow_test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:int -- test/integration

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install chromium
      - run: npm run test:e2e

  all-green:
    name: tests passed (\${{ github.event_name }})
    needs: [unit, e2e]
    runs-on: ubuntu-latest
    steps:
      - run: echo "all green"`,
  loiGiai: `# Lab 9 — reference solution for lab9/ci.yml. Branch protection must now require ONE check: ci-ok.
name: tests

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  unit:
    name: unit (Node \${{ matrix.node }})
    runs-on: ubuntu-latest
    timeout-minutes: 10
    strategy:
      fail-fast: false
      matrix:
        node: [22, 24]                     # engines >=22.12 — Node 20 fails 4 tests (lesson 9.4)
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
          cache: npm
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:web

  integration:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: labflow_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres -d labflow_test"
          --health-interval 2s --health-timeout 3s --health-retries 30
    env:
      TEST_DATABASE_URL: postgres://postgres:test@localhost:5432/labflow_test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:int -- test/integration

  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e

  quarantine:
    name: quarantine (report only)
    runs-on: ubuntu-latest
    timeout-minutes: 10
    continue-on-error: true
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:quarantine

  ci-ok:
    name: ci-ok
    if: always()
    needs: [unit, integration, e2e]
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - name: every required job passed?
        env:
          NEEDS: \${{ toJSON(needs) }}
          REQUIRED: unit,integration,e2e
        run: node scripts/ci-gate.mjs`,
  policy: `// Rules every LabFlow Lite workflow must follow (lessons 9.1–9.4, graded in Lab 9 by scripts/cham-lab-9.mjs).
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
    const bad = Object.entries(jobs).filter(([, j]) => runs(j).some((r) => /\\bnpm (install|i)\\b/.test(r))).map(([id]) => id);
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
      const pg = Object.values(job.services ?? {}).find((s) => /^postgres:17\\b/.test(String(s.image)));
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
    return /\\$\\{\\{/.test(String(gate[1].name ?? '')) ? 'the gate name contains an expression' : '';
  }],
  ['R6', 'the gate runs even when a job it needs failed', (jobs) => {
    const gate = gateOf(jobs);
    if (!gate) return 'no ci-ok job';
    if (!/always\\(\\)|!\\s*cancelled\\(\\)/.test(String(gate[1].if ?? ''))) return 'ci-ok has no if: always() — it is SKIPPED when a job fails, and a skipped required check counts as passed';
    const text = JSON.stringify(gate[1]);
    return text.includes('ci-gate.mjs') || /needs\\.[\\w*-]+\\.result|contains\\(needs/.test(text) ? '' : 'ci-ok never looks at the results of the jobs it needs';
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
}`,
};
export const OUT = {
  '91-cache-lan1': `$ T0=$(date +%s); act push -W demo9/wf/91-cache.yml --cache-server-path .act/cache; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T07:36:54+07:00" level=warning msg="Ignoring \\"--artifact-server-path=.act/artifacts\\" from …/labflow-lite/.actrc: this flag is not allowed in a project .actrc. Set it in your user config or on the command line, or pass --trust-project-actrc."
time="2026-11-01T07:36:54+07:00" level=warning msg="…/labflow-lite/.actrc is a project file. It may only set flags that do not reach host resources."
time="2026-11-01T07:36:54+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

[tests/unit + web] ⭐ Run Set up job
[tests/unit + web] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit + web]   ✅  Success - Set up job
[tests/unit + web] ⭐ Run Main actions/checkout@v4
[tests/unit + web]   ✅  Success - Main actions/checkout@v4 [196.446583ms]
[tests/unit + web] ⭐ Run Main actions/setup-node@v4
[tests/unit + web]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/unit + web]   ❓  ::group::Environment details
[tests/unit + web]   | node: v22.23.4
[tests/unit + web]   | npm: 10.9.9
[tests/unit + web]   | yarn: 
[tests/unit + web]   ❓  ::endgroup::
[tests/unit + web]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/unit + web]   | /root/.npm
[tests/unit + web]   | npm cache is not found
[tests/unit + web]   ✅  Success - Main actions/setup-node@v4 [1.867336541s]
[tests/unit + web]   ⚙  ::set-output:: node-version=v22.23.4
[tests/unit + web]   ⚙  ::set-output:: cache-hit=false
[tests/unit + web]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/unit + web] ⭐ Run Main npm ci
[tests/unit + web]   | 
[tests/unit + web]   | added 568 packages, and audited 569 packages in 49s
[tests/unit + web]   | 
[tests/unit + web]   | 123 packages are looking for funding
[tests/unit + web]   |   run \`npm fund\` for details
[tests/unit + web]   | 
[tests/unit + web]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit + web]   | 
[tests/unit + web]   | To address issues that do not require attention, run:
[tests/unit + web]   |   npm audit fix
[tests/unit + web]   | 
[tests/unit + web]   | To address all issues possible, run:
[tests/unit + web]   |   npm audit fix --force
[tests/unit + web]   | 
[tests/unit + web]   | Some issues need review, and may require choosing
[tests/unit + web]   | a different dependency.
[tests/unit + web]   | 
[tests/unit + web]   | Run \`npm audit\` for details.
[tests/unit + web]   ✅  Success - Main npm ci [49.599284791s]
[tests/unit + web] ⭐ Run Main npm run test:unit
[tests/unit + web]   | 
[tests/unit + web]   | > labflow-lite@1.0.0 test:unit
[tests/unit + web]   | > vitest run src/
[tests/unit + web]   | 
[tests/unit + web]   | 
[tests/unit + web]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit + web]   | 
[tests/unit + web]   | 
[tests/unit + web]   |  Test Files  15 passed (15)
[tests/unit + web]   |       Tests  116 passed (116)
[tests/unit + web]   |    Start at  00:37:51
[tests/unit + web]   |    Duration  613ms (transform 44%, import 27%, tests 26%, worker 3%)
[tests/unit + web]   | 
[tests/unit + web]   ✅  Success - Main npm run test:unit [1.030588959s]
[tests/unit + web] ⭐ Run Main npm run test:web
[tests/unit + web]   | 
[tests/unit + web]   | > labflow-lite@1.0.0 test:web
[tests/unit + web]   | > vitest run --config vitest.web.config.js web/
[tests/unit + web]   | 
[tests/unit + web]   | 
[tests/unit + web]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit + web]   | 
[tests/unit + web]   | 
[tests/unit + web]   |  Test Files  2 passed (2)
[tests/unit + web]   |       Tests  16 passed (16)
[tests/unit + web]   |    Start at  00:37:52
[tests/unit + web]   |    Duration  1.94s (tests 50%, environment 33%, setup 8%, transform 5%, import 3%)
[tests/unit + web]   | 
[tests/unit + web]   ✅  Success - Main npm run test:web [2.405676958s]
[tests/unit + web] ⭐ Run Post actions/setup-node@v4
[tests/unit + web]   | Cache Size: ~55 MB (57765639 B)
[tests/unit + web]   | Cache saved successfully
[tests/unit + web]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit + web]   ✅  Success - Post actions/setup-node@v4 [616.09975ms]
[tests/unit + web] ⭐ Run Complete job
[tests/unit + web] Cleaning up container for job unit + web
[tests/unit + web]   ✅  Success - Complete job
[tests/unit + web] 🏁  Job succeeded
wall time: 61 s`,
  '91-cache-lan2': `$ T0=$(date +%s); act push -W demo9/wf/91-cache.yml --cache-server-path .act/cache; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T07:37:55+07:00" level=warning msg="Ignoring \\"--artifact-server-path=.act/artifacts\\" from …/labflow-lite/.actrc: this flag is not allowed in a project .actrc. Set it in your user config or on the command line, or pass --trust-project-actrc."
time="2026-11-01T07:37:55+07:00" level=warning msg="…/labflow-lite/.actrc is a project file. It may only set flags that do not reach host resources."
time="2026-11-01T07:37:55+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

[tests/unit + web] ⭐ Run Set up job
[tests/unit + web] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit + web]   ✅  Success - Set up job
[tests/unit + web] ⭐ Run Main actions/checkout@v4
[tests/unit + web]   ✅  Success - Main actions/checkout@v4 [208.809292ms]
[tests/unit + web] ⭐ Run Main actions/setup-node@v4
[tests/unit + web]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/unit + web]   ❓  ::group::Environment details
[tests/unit + web]   | node: v22.23.4
[tests/unit + web]   | npm: 10.9.9
[tests/unit + web]   | yarn: 
[tests/unit + web]   ❓  ::endgroup::
[tests/unit + web]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/unit + web]   | /root/.npm
[tests/unit + web]   ⚙  ***
[tests/unit + web]   | Cache Size: ~55 MB (57765639 B)
[tests/unit + web]   | Cache restored successfully
[tests/unit + web]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit + web]   ✅  Success - Main actions/setup-node@v4 [2.434160459s]
[tests/unit + web]   ⚙  ::set-output:: node-version=v22.23.4
[tests/unit + web]   ⚙  ::set-output:: cache-hit=true
[tests/unit + web]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/unit + web] ⭐ Run Main npm ci
[tests/unit + web]   | 
[tests/unit + web]   | added 568 packages, and audited 569 packages in 15s
[tests/unit + web]   | 
[tests/unit + web]   | 123 packages are looking for funding
[tests/unit + web]   |   run \`npm fund\` for details
[tests/unit + web]   | 
[tests/unit + web]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit + web]   | 
[tests/unit + web]   | To address issues that do not require attention, run:
[tests/unit + web]   |   npm audit fix
[tests/unit + web]   | 
[tests/unit + web]   | To address all issues possible, run:
[tests/unit + web]   |   npm audit fix --force
[tests/unit + web]   | 
[tests/unit + web]   | Some issues need review, and may require choosing
[tests/unit + web]   | a different dependency.
[tests/unit + web]   | 
[tests/unit + web]   | Run \`npm audit\` for details.
[tests/unit + web]   ✅  Success - Main npm ci [14.977650833s]
[tests/unit + web] ⭐ Run Main npm run test:unit
[tests/unit + web]   | 
[tests/unit + web]   | > labflow-lite@1.0.0 test:unit
[tests/unit + web]   | > vitest run src/
[tests/unit + web]   | 
[tests/unit + web]   | 
[tests/unit + web]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit + web]   | 
[tests/unit + web]   | 
[tests/unit + web]   |  Test Files  15 passed (15)
[tests/unit + web]   |       Tests  116 passed (116)
[tests/unit + web]   |    Start at  00:38:17
[tests/unit + web]   |    Duration  759ms (transform 56%, import 25%, tests 17%, worker 2%)
[tests/unit + web]   | 
[tests/unit + web]   ✅  Success - Main npm run test:unit [1.200437875s]
[tests/unit + web] ⭐ Run Main npm run test:web
[tests/unit + web]   | 
[tests/unit + web]   | > labflow-lite@1.0.0 test:web
[tests/unit + web]   | > vitest run --config vitest.web.config.js web/
[tests/unit + web]   | 
[tests/unit + web]   | 
[tests/unit + web]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit + web]   | 
[tests/unit + web]   | 
[tests/unit + web]   |  Test Files  2 passed (2)
[tests/unit + web]   |       Tests  16 passed (16)
[tests/unit + web]   |    Start at  00:38:18
[tests/unit + web]   |    Duration  1.93s (tests 51%, environment 32%, transform 8%, setup 7%, import 2%)
[tests/unit + web]   | 
[tests/unit + web]   ✅  Success - Main npm run test:web [2.361239916s]
[tests/unit + web] ⭐ Run Post actions/setup-node@v4
[tests/unit + web]   | Cache Size: ~55 MB (57759093 B)
[tests/unit + web]   | Cache saved successfully
[tests/unit + web]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit + web]   ✅  Success - Post actions/setup-node@v4 [816.771667ms]
[tests/unit + web] ⭐ Run Complete job
[tests/unit + web] Cleaning up container for job unit + web
[tests/unit + web]   ✅  Success - Complete job
[tests/unit + web] 🏁  Job succeeded
wall time: 27 s`,
  '91-e2e-thieu-deps': `$ T0=$(date +%s); act push -W demo9/wf/91-e2e-thieu-deps.yml --cache-server-path .act/cache; echo "act exit: $?"; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T07:41:13+07:00" level=warning msg="Ignoring \\"--artifact-server-path=.act/artifacts\\" from …/labflow-lite/.actrc: this flag is not allowed in a project .actrc. Set it in your user config or on the command line, or pass --trust-project-actrc."
time="2026-11-01T07:41:13+07:00" level=warning msg="…/labflow-lite/.actrc is a project file. It may only set flags that do not reach host resources."
time="2026-11-01T07:41:13+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

[tests/e2e] ⭐ Run Set up job
[tests/e2e] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/e2e]   ✅  Success - Set up job
[tests/e2e] ⭐ Run Main actions/checkout@v4
[tests/e2e]   ✅  Success - Main actions/checkout@v4 [261.132875ms]
[tests/e2e] ⭐ Run Main actions/setup-node@v4
[tests/e2e]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/e2e]   ❓  ::group::Environment details
[tests/e2e]   | node: v22.23.4
[tests/e2e]   | npm: 10.9.9
[tests/e2e]   | yarn: 
[tests/e2e]   ❓  ::endgroup::
[tests/e2e]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/e2e]   | /root/.npm
[tests/e2e]   ⚙  ***
[tests/e2e]   | Cache Size: ~55 MB (57781292 B)
[tests/e2e]   | Cache restored successfully
[tests/e2e]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/e2e]   ✅  Success - Main actions/setup-node@v4 [2.587395958s]
[tests/e2e]   ⚙  ::set-output:: node-version=v22.23.4
[tests/e2e]   ⚙  ::set-output:: cache-hit=true
[tests/e2e]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/e2e] ⭐ Run Main npm ci
[tests/e2e]   | 
[tests/e2e]   | added 568 packages, and audited 569 packages in 15s
[tests/e2e]   | 
[tests/e2e]   | 123 packages are looking for funding
[tests/e2e]   |   run \`npm fund\` for details
[tests/e2e]   | 
[tests/e2e]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/e2e]   | 
[tests/e2e]   | To address issues that do not require attention, run:
[tests/e2e]   |   npm audit fix
[tests/e2e]   | 
[tests/e2e]   | To address all issues possible, run:
[tests/e2e]   |   npm audit fix --force
[tests/e2e]   | 
[tests/e2e]   | Some issues need review, and may require choosing
[tests/e2e]   | a different dependency.
[tests/e2e]   | 
[tests/e2e]   | Run \`npm audit\` for details.
[tests/e2e]   ✅  Success - Main npm ci [14.744132458s]
[tests/e2e] ⭐ Run Main npx playwright install chromium
[tests/e2e]   | |                                                                                |   0% of 190.5 MiB
[tests/e2e]   | Chrome for Testing 156.0.8078.4 (playwright chromium v1248) downloaded to /root/.cache/ms-playwright/chromium-1248
[tests/e2e]   | |                                                                                |   0% of 1.9 MiB
[tests/e2e]   | FFmpeg (playwright ffmpeg v1013) downloaded to /root/.cache/ms-playwright/ffmpeg-1013
[tests/e2e]   | |                                                                                |   0% of 119.9 MiB
[tests/e2e]   | Chrome Headless Shell 156.0.8078.4 (playwright chromium-headless-shell v1248) downloaded to /root/.cache/ms-playwright/chromium_headless_shell-1248
[tests/e2e]   ✅  Success - Main npx playwright install chromium [3m2.749331792s]
[tests/e2e] ⭐ Run Main npm run test:e2e
[tests/e2e]   | 
[tests/e2e]   | > labflow-lite@1.0.0 test:e2e
[tests/e2e]   | > playwright test e2e/ --project=chromium
[tests/e2e]   | 
[tests/e2e]   | 
[tests/e2e]   | Running 9 tests using 5 workers
[tests/e2e]   | 
[tests/e2e]   |   ✘  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (3ms)
[tests/e2e]   |   ✘  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (3ms)
[tests/e2e]   |   ✘  3 [setup] › e2e/auth.setup.js:6:3 › sign in as an (retry #1) (3ms)
[tests/e2e]   |   ✘  4 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (retry #1) (3ms)
[tests/e2e]   |   ✘  5 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (retry #2) (2ms)
[tests/e2e]   |   ✘  6 [setup] › e2e/auth.setup.js:6:3 › sign in as an (retry #2) (2ms)
[tests/e2e]   | 
[tests/e2e]   | 
[tests/e2e]   |   1) [setup] › e2e/auth.setup.js:6:3 › sign in as an ───────────────────────────────────────────────
[tests/e2e]   | 
[tests/e2e]   |     Error: browserType.launch: Target page, context or browser has been closed
[tests/e2e]   |     Browser logs:
[tests/e2e]   | 
[tests/e2e]   |     <launched> pid=756
[tests/e2e]   |     [pid=756][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e]   |     Call log:
[tests/e2e]   |       - <launched> pid=756
[tests/e2e]   |       - [pid=756][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e]   |       - [pid=756] <gracefully close start>
[tests/e2e]   |       - [pid=756] <kill>
[tests/e2e]   |       - [pid=756] <will force kill>
[tests/e2e]   |       - [pid=756] exception while trying to kill process: Error: kill ESRCH
[tests/e2e]   |       - [pid=756] <process did exit: exitCode=127, signal=null>
[tests/e2e]   |       - [pid=756] starting temporary directories cleanup
[tests/e2e]   |       - [pid=756] finished temporary directories cleanup
[tests/e2e]   |       - [pid=756] <gracefully close end>
[tests/e2e]   | 
[tests/e2e]   | 
[tests/e2e]   |     Error Context: test-results/e2e-auth.setup.js-sign-in-as-an-setup/error-context.md
[tests/e2e]   | 
[tests/e2e]   |     Retry #1 ───────────────────────────────────────────────────────────────────────────────────────
[tests/e2e]   | 
[tests/e2e]   |     Error: browserType.launch: Target page, context or browser has been closed
[tests/e2e]   |     Browser logs:
[tests/e2e]   | 
[tests/e2e]   |     <launched> pid=781
[tests/e2e]   |     [pid=781][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e]   |     Call log:
[tests/e2e]   |       - <launched> pid=781
[tests/e2e]   |       - [pid=781][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e]   |       - [pid=781] <gracefully close start>
[tests/e2e]   |       - [pid=781] <kill>
[tests/e2e]   |       - [pid=781] <will force kill>
[tests/e2e]   |       - [pid=781] exception while trying to kill process: Error: kill ESRCH
[tests/e2e]   |       - [pid=781] <process did exit: exitCode=127, signal=null>
[tests/e2e]   |       - [pid=781] starting temporary directories cleanup
[tests/e2e]   |       - [pid=781] finished temporary directories cleanup
[tests/e2e]   |       - [pid=781] <gracefully close end>
[tests/e2e]   | 
[tests/e2e]   | 
[tests/e2e]   |     Error Context: test-results/e2e-auth.setup.js-sign-in-as-an-setup-retry1/error-context.md
[tests/e2e]   | 
[tests/e2e]   |     attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
[tests/e2e]   |     test-results/e2e-auth.setup.js-sign-in-as-an-setup-retry1/trace.zip
[tests/e2e]   |     Usage:
[tests/e2e]   | 
[tests/e2e]   |         npx playwright show-trace test-results/e2e-auth.setup.js-sign-in-as-an-setup-retry1/trace.zip
[tests/e2e]   | 
[tests/e2e]   |     ────────────────────────────────────────────────────────────────────────────────────────────────
[tests/e2e]   | 
[tests/e2e]   |     Retry #2 ───────────────────────────────────────────────────────────────────────────────────────
[tests/e2e]   | 
[tests/e2e]   |     Error: browserType.launch: Target page, context or browser has been closed
[tests/e2e]   |     Browser logs:
[tests/e2e]   | 
[tests/e2e]   |     <launched> pid=808
[tests/e2e]   |     [pid=808][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e]   |     Call log:
[tests/e2e]   |       - <launched> pid=808
[tests/e2e]   |       - [pid=808][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e]   |       - [pid=808] <gracefully close start>
[tests/e2e]   |       - [pid=808] <kill>
[tests/e2e]   |       - [pid=808] <will force kill>
[tests/e2e]   |       - [pid=808] exception while trying to kill process: Error: kill ESRCH
[tests/e2e]   |       - [pid=808] <process did exit: exitCode=127, signal=null>
[tests/e2e]   |       - [pid=808] starting temporary directories cleanup
[tests/e2e]   |       - [pid=808] finished temporary directories cleanup
[tests/e2e]   |       - [pid=808] <gracefully close end>
[tests/e2e]   | 
[tests/e2e]   | 
[tests/e2e]   |     Error Context: test-results/e2e-auth.setup.js-sign-in-as-an-setup-retry2/error-context.md
[tests/e2e]   | 
[tests/e2e]   |   2) [setup] › e2e/auth.setup.js:6:3 › sign in as boss ─────────────────────────────────────────────
[tests/e2e]   | 
[tests/e2e]   |     Error: browserType.launch: Target page, context or browser has been closed
[tests/e2e]   |     Browser logs:
[tests/e2e]   | 
[tests/e2e]   |     <launched> pid=755
[tests/e2e]   |     [pid=755][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e]   |     Call log:
[tests/e2e]   |       - <launched> pid=755
[tests/e2e]   |       - [pid=755][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e]   |       - [pid=755] <gracefully close start>
[tests/e2e]   |       - [pid=755] <kill>
[tests/e2e]   |       - [pid=755] <will force kill>
[tests/e2e]   |       - [pid=755] exception while trying to kill process: Error: kill ESRCH
[tests/e2e]   |       - [pid=755] <process did exit: exitCode=127, signal=null>
[tests/e2e]   |       - [pid=755] starting temporary directories cleanup
[tests/e2e]   |       - [pid=755] finished temporary directories cleanup
[tests/e2e]   |       - [pid=755] <gracefully close end>
[tests/e2e]   | 
[tests/e2e]   | 
[tests/e2e]   |     Error Context: test-results/e2e-auth.setup.js-sign-in-as-boss-setup/error-context.md
[tests/e2e]   | 
[tests/e2e]   |     Retry #1 ───────────────────────────────────────────────────────────────────────────────────────
[tests/e2e]   | 
[tests/e2e]   |     Error: browserType.launch: Target page, context or browser has been closed
[tests/e2e]   |     Browser logs:
[tests/e2e]   | 
[tests/e2e]   |     <launched> pid=782
[tests/e2e]   |     [pid=782][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e]   |     Call log:
[tests/e2e]   |       - <launched> pid=782
[tests/e2e]   |       - [pid=782][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e]   |       - [pid=782] <gracefully close start>
[tests/e2e]   |       - [pid=782] <kill>
[tests/e2e]   |       - [pid=782] <will force kill>
[tests/e2e]   |       - [pid=782] exception while trying to kill process: Error: kill ESRCH
[tests/e2e]   |       - [pid=782] <process did exit: exitCode=127, signal=null>
[tests/e2e]   |       - [pid=782] starting temporary directories cleanup
[tests/e2e]   |       - [pid=782] finished temporary directories cleanup
[tests/e2e]   |       - [pid=782] <gracefully close end>
[tests/e2e]   | 
[tests/e2e]   | 
[tests/e2e]   |     Error Context: test-results/e2e-auth.setup.js-sign-in-as-boss-setup-retry1/error-context.md
[tests/e2e]   | 
[tests/e2e]   |     attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
[tests/e2e]   |     test-results/e2e-auth.setup.js-sign-in-as-boss-setup-retry1/trace.zip
[tests/e2e]   |     Usage:
[tests/e2e]   | 
[tests/e2e]   |         npx playwright show-trace test-results/e2e-auth.setup.js-sign-in-as-boss-setup-retry1/trace.zip
[tests/e2e]   | 
[tests/e2e]   |     ────────────────────────────────────────────────────────────────────────────────────────────────
[tests/e2e]   | 
[tests/e2e]   |     Retry #2 ───────────────────────────────────────────────────────────────────────────────────────
[tests/e2e]   | 
[tests/e2e]   |     Error: browserType.launch: Target page, context or browser has been closed
[tests/e2e]   |     Browser logs:
[tests/e2e]   | 
[tests/e2e]   |     <launched> pid=807
[tests/e2e]   |     [pid=807][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e]   |     Call log:
[tests/e2e]   |       - <launched> pid=807
[tests/e2e]   |       - [pid=807][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e]   |       - [pid=807] <gracefully close start>
[tests/e2e]   |       - [pid=807] <kill>
[tests/e2e]   |       - [pid=807] <will force kill>
[tests/e2e]   |       - [pid=807] exception while trying to kill process: Error: kill ESRCH
[tests/e2e]   |       - [pid=807] <process did exit: exitCode=127, signal=null>
[tests/e2e]   |       - [pid=807] starting temporary directories cleanup
[tests/e2e]   |       - [pid=807] finished temporary directories cleanup
[tests/e2e]   |       - [pid=807] <gracefully close end>
[tests/e2e]   | 
[tests/e2e]   | 
[tests/e2e]   |     Error Context: test-results/e2e-auth.setup.js-sign-in-as-boss-setup-retry2/error-context.md
[tests/e2e]   | 
[tests/e2e]   |   2 failed
[tests/e2e]   |     [setup] › e2e/auth.setup.js:6:3 › sign in as an ────────────────────────────────────────────────
[tests/e2e]   |     [setup] › e2e/auth.setup.js:6:3 › sign in as boss ──────────────────────────────────────────────
[tests/e2e]   |   7 did not run
[tests/e2e]   ❌  Failure - Main npm run test:e2e [2.7658135s]
[tests/e2e] exitcode '1': failure
[tests/e2e] ⭐ Run Complete job
[tests/e2e]   ✅  Success - Complete job
[tests/e2e] 🏁  Job failed
Error: Job 'e2e' failed
act exit: 1
wall time: 208 s`,
  '91-e2e': `$ T0=$(date +%s); act push -W demo9/wf/91-e2e.yml --cache-server-path .act/cache; echo "act exit: $?"; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T07:44:47+07:00" level=warning msg="Ignoring \\"--artifact-server-path=.act/artifacts\\" from …/labflow-lite/.actrc: this flag is not allowed in a project .actrc. Set it in your user config or on the command line, or pass --trust-project-actrc."
time="2026-11-01T07:44:47+07:00" level=warning msg="…/labflow-lite/.actrc is a project file. It may only set flags that do not reach host resources."
time="2026-11-01T07:44:47+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

[tests/e2e] ⭐ Run Set up job
[tests/e2e] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/e2e]   ✅  Success - Set up job
[tests/e2e] ⭐ Run Main actions/checkout@v4
[tests/e2e]   ✅  Success - Main actions/checkout@v4 [247.672ms]
[tests/e2e] ⭐ Run Main actions/setup-node@v4
[tests/e2e]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/e2e]   ❓  ::group::Environment details
[tests/e2e]   | node: v22.23.4
[tests/e2e]   | npm: 10.9.9
[tests/e2e]   | yarn: 
[tests/e2e]   ❓  ::endgroup::
[tests/e2e]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/e2e]   | /root/.npm
[tests/e2e]   ⚙  ***
[tests/e2e]   | Cache Size: ~55 MB (57781292 B)
[tests/e2e]   | Cache restored successfully
[tests/e2e]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/e2e]   ✅  Success - Main actions/setup-node@v4 [2.700972416s]
[tests/e2e]   ⚙  ::set-output:: node-version=v22.23.4
[tests/e2e]   ⚙  ::set-output:: cache-hit=true
[tests/e2e]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/e2e] ⭐ Run Main npm ci
[tests/e2e]   | 
[tests/e2e]   | added 568 packages, and audited 569 packages in 14s
[tests/e2e]   | 
[tests/e2e]   | 123 packages are looking for funding
[tests/e2e]   |   run \`npm fund\` for details
[tests/e2e]   | 
[tests/e2e]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/e2e]   | 
[tests/e2e]   | To address issues that do not require attention, run:
[tests/e2e]   |   npm audit fix
[tests/e2e]   | 
[tests/e2e]   | To address all issues possible, run:
[tests/e2e]   |   npm audit fix --force
[tests/e2e]   | 
[tests/e2e]   | Some issues need review, and may require choosing
[tests/e2e]   | a different dependency.
[tests/e2e]   | 
[tests/e2e]   | Run \`npm audit\` for details.
[tests/e2e]   ✅  Success - Main npm ci [14.231040167s]
[tests/e2e] ⭐ Run Main npx playwright install --with-deps chromium
[tests/e2e]   | Installing dependencies...
[tests/e2e]   | libcairo2 is already the newest version (1.18.0-3build1).
[tests/e2e]   | libcairo2 set to manually installed.
[tests/e2e]   | libdbus-1-3 is already the newest version (1.14.10-4ubuntu4.1).
[tests/e2e]   | libdbus-1-3 set to manually installed.
[tests/e2e]   | libpango-1.0-0 is already the newest version (1.52.1+ds-1build1).
[tests/e2e]   | libpango-1.0-0 set to manually installed.
[tests/e2e]   | libxcb1 is already the newest version (1.15-1ubuntu2).
[tests/e2e]   | libxcb1 set to manually installed.
[tests/e2e]   | libxext6 is already the newest version (2:1.3.4-1build2).
[tests/e2e]   | libxext6 set to manually installed.
[tests/e2e]   | libfontconfig1 is already the newest version (2.15.0-1.1ubuntu2).
[tests/e2e]   | libfontconfig1 set to manually installed.
[tests/e2e]   | The following additional packages will be installed:
[tests/e2e]   |   at-spi2-common gir1.2-glib-2.0 gir1.2-glib-2.0-dev libasound2-data
[tests/e2e]   |   libavahi-client3 libavahi-common-data libavahi-common3 libdrm-amdgpu1
[tests/e2e]   |   libdrm-common libfontenc1 libfreetype-dev libgirepository-2.0-0 libgl1
[tests/e2e]   |   libgl1-mesa-dri libglib2.0-bin libglib2.0-data libglib2.0-dev
[tests/e2e]   |   libglib2.0-dev-bin libglvnd0 libglx-mesa0 libglx0 libllvm20
[tests/e2e]   |   libsensors-config libsensors5 libvulkan1 libx11-data libx11-dev libx11-xcb1
[tests/e2e]   |   libxaw7 libxcb-dri3-0 libxcb-glx0 libxcb-present0 libxcb-randr0 libxcb-sync1
[tests/e2e]   |   libxcb-xfixes0 libxfont2 libxi6 libxkbfile1 libxmu6 libxmuu1 libxpm4
[tests/e2e]   |   libxshmfence1 libxxf86vm1 mesa-libgallium x11-xkb-utils xauth
[tests/e2e]   |   xfonts-encodings xfonts-utils xkb-data xserver-common
[tests/e2e]   | Suggested packages:
[tests/e2e]   |   alsa-utils libasound2-plugins cups-common freetype2-doc low-memory-monitor
[tests/e2e]   |   libglib2.0-doc libxml2-utils lm-sensors libx11-doc
[tests/e2e]   | Recommended packages:
[tests/e2e]   |   fonts-ipafont-mincho fonts-liberation-sans-narrow fonts-tlwg-loma
[tests/e2e]   |   alsa-ucm-conf alsa-topology-conf at-spi2-core xdg-user-dirs
[tests/e2e]   |   mesa-vulkan-drivers | vulkan-icd xfonts-base
[tests/e2e]   | The following NEW packages will be installed:
[tests/e2e]   |   at-spi2-common fonts-freefont-ttf fonts-ipafont-gothic fonts-liberation
[tests/e2e]   |   fonts-noto-color-emoji fonts-tlwg-loma-otf fonts-unifont fonts-wqy-zenhei
[tests/e2e]   |   libasound2-data libasound2t64 libatk-bridge2.0-0t64 libatk1.0-0t64
[tests/e2e]   |   libatspi2.0-0t64 libavahi-client3 libavahi-common-data libavahi-common3
[tests/e2e]   |   libcups2t64 libdrm-amdgpu1 libdrm-common libdrm2 libfontenc1 libgbm1 libgl1
[tests/e2e]   |   libgl1-mesa-dri libglvnd0 libglx-mesa0 libglx0 libllvm20 libnspr4 libnss3
[tests/e2e]   |   libsensors-config libsensors5 libvulkan1 libx11-xcb1 libxaw7 libxcb-dri3-0
[tests/e2e]   |   libxcb-glx0 libxcb-present0 libxcb-randr0 libxcb-sync1 libxcb-xfixes0
[tests/e2e]   |   libxcomposite1 libxdamage1 libxfixes3 libxfont2 libxi6 libxkbcommon0
[tests/e2e]   |   libxkbfile1 libxmu6 libxmuu1 libxpm4 libxrandr2 libxshmfence1 libxxf86vm1
[tests/e2e]   |   mesa-libgallium x11-xkb-utils xauth xfonts-cyrillic xfonts-encodings
[tests/e2e]   |   xfonts-scalable xfonts-utils xkb-data xserver-common xvfb
[tests/e2e]   | The following packages will be upgraded:
[tests/e2e]   |   gir1.2-glib-2.0 gir1.2-glib-2.0-dev libfreetype-dev libfreetype6
[tests/e2e]   |   libgirepository-2.0-0 libglib2.0-0t64 libglib2.0-bin libglib2.0-data
[tests/e2e]   |   libglib2.0-dev libglib2.0-dev-bin libx11-6 libx11-data libx11-dev
[tests/e2e]   | 13 upgraded, 64 newly installed, 0 to remove and 141 not upgraded.
[tests/e2e]   | debconf: delaying package configuration, since apt-utils is not installed
(Reading database ... 5%
(Reading database ... 10%
(Reading database ... 15%
(Reading database ... 20%
(Reading database ... 25%
(Reading database ... 30%
(Reading database ... 35%
(Reading database ... 40%
(Reading database ... 45%
(Reading database ... 50%
(Reading database ... 55%
(Reading database ... 60%
(Reading database ... 65%
(Reading database ... 70%
(Reading database ... 75%
(Reading database ... 80%
(Reading database ... 85%
(Reading database ... 90%
(Reading database ... 95%
(Reading database ... 100%
(Reading database ... 26166 files and directories currently installed.)
[tests/e2e]   | No schema files found: doing nothing.
[tests/e2e]   | update-alternatives: using /usr/share/fonts/opentype/ipafont-gothic/ipag.ttf to provide /usr/share/fonts/truetype/fonts-japanese-gothic.ttf (fonts-japanese-gothic.ttf) in auto mode
[tests/e2e]   | |                                                                                |   0% of 190.5 MiB
[tests/e2e]   | Chrome for Testing 156.0.8078.4 (playwright chromium v1248) downloaded to /root/.cache/ms-playwright/chromium-1248
[tests/e2e]   | |                                                                                |   0% of 1.9 MiB
[tests/e2e]   | FFmpeg (playwright ffmpeg v1013) downloaded to /root/.cache/ms-playwright/ffmpeg-1013
[tests/e2e]   | |                                                                                |   0% of 119.9 MiB
[tests/e2e]   | Chrome Headless Shell 156.0.8078.4 (playwright chromium-headless-shell v1248) downloaded to /root/.cache/ms-playwright/chromium_headless_shell-1248
[tests/e2e]   ✅  Success - Main npx playwright install --with-deps chromium [5m3.960726083s]
[tests/e2e] ⭐ Run Main npm run test:e2e
[tests/e2e]   | 
[tests/e2e]   | > labflow-lite@1.0.0 test:e2e
[tests/e2e]   | > playwright test e2e/ --project=chromium
[tests/e2e]   | 
[tests/e2e]   | 
[tests/e2e]   | Running 9 tests using 5 workers
[tests/e2e]   | 
[tests/e2e]   | 
[tests/e2e]   |   9 passed (3.0s)
[tests/e2e]   ✅  Success - Main npm run test:e2e [3.683010333s]
[tests/e2e] ⭐ Run Post actions/setup-node@v4
[tests/e2e]   | Cache Size: ~55 MB (57764523 B)
[tests/e2e]   | Cache saved successfully
[tests/e2e]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/e2e]   ✅  Success - Post actions/setup-node@v4 [871.836583ms]
[tests/e2e] ⭐ Run Complete job
[tests/e2e] Cleaning up container for job e2e
[tests/e2e]   ✅  Success - Complete job
[tests/e2e] 🏁  Job succeeded
act exit: 0
wall time: 334 s`,
  '91-int-localhost': `$ T0=$(date +%s); act push -W demo9/wf/91-int-localhost.yml --cache-server-path .act/cache; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T07:38:47+07:00" level=warning msg="Ignoring \\"--artifact-server-path=.act/artifacts\\" from …/labflow-lite/.actrc: this flag is not allowed in a project .actrc. Set it in your user config or on the command line, or pass --trust-project-actrc."
time="2026-11-01T07:38:47+07:00" level=warning msg="…/labflow-lite/.actrc is a project file. It may only set flags that do not reach host resources."
time="2026-11-01T07:38:47+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

[tests/integration] ⭐ Run Set up job
[tests/integration] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/integration] Cleaning up services for job integration
[tests/integration] Cleaning up network for job integration, and network name is: act-tests-integration-b27bc53dfbce4ce132a8c560899137eb64b74fd4251997d0d6e61d812514bed6-integration-network
[tests/integration] container health of ca4622d0413ba6dbf44d62b14f60cf6ad832b3e1ec8f333cf831daa3ab4d2e3a (postgres:17) is starting
[tests/integration] container health of ca4622d0413ba6dbf44d62b14f60cf6ad832b3e1ec8f333cf831daa3ab4d2e3a (postgres:17) is starting
[tests/integration] container health of ca4622d0413ba6dbf44d62b14f60cf6ad832b3e1ec8f333cf831daa3ab4d2e3a (postgres:17) is healthy
[tests/integration]   ✅  Success - Set up job
[tests/integration] ⭐ Run Main actions/checkout@v4
[tests/integration]   ✅  Success - Main actions/checkout@v4 [194.727ms]
[tests/integration] ⭐ Run Main actions/setup-node@v4
[tests/integration]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/integration]   ❓  ::group::Environment details
[tests/integration]   | node: v22.23.4
[tests/integration]   | npm: 10.9.9
[tests/integration]   | yarn: 
[tests/integration]   ❓  ::endgroup::
[tests/integration]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/integration]   | /root/.npm
[tests/integration]   ⚙  ***
[tests/integration]   | Cache Size: ~55 MB (57759093 B)
[tests/integration]   | Cache restored successfully
[tests/integration]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration]   ✅  Success - Main actions/setup-node@v4 [2.704158334s]
[tests/integration]   ⚙  ::set-output:: node-version=v22.23.4
[tests/integration]   ⚙  ::set-output:: cache-hit=true
[tests/integration]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/integration] ⭐ Run Main npm ci
[tests/integration]   | 
[tests/integration]   | added 568 packages, and audited 569 packages in 17s
[tests/integration]   | 
[tests/integration]   | 123 packages are looking for funding
[tests/integration]   |   run \`npm fund\` for details
[tests/integration]   | 
[tests/integration]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/integration]   | 
[tests/integration]   | To address issues that do not require attention, run:
[tests/integration]   |   npm audit fix
[tests/integration]   | 
[tests/integration]   | To address all issues possible, run:
[tests/integration]   |   npm audit fix --force
[tests/integration]   | 
[tests/integration]   | Some issues need review, and may require choosing
[tests/integration]   | a different dependency.
[tests/integration]   | 
[tests/integration]   | Run \`npm audit\` for details.
[tests/integration]   ✅  Success - Main npm ci [16.971897125s]
[tests/integration] ⭐ Run Main npm run test:int -- test/integration
[tests/integration]   | 
[tests/integration]   | > labflow-lite@1.0.0 test:int
[tests/integration]   | > vitest run --config vitest.integration.config.js test/integration
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   |  RUN  v5.0.5 …/labflow-lite
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   |  Test Files  1 passed (1)
[tests/integration]   |       Tests  11 passed (11)
[tests/integration]   |    Start at  00:40:15
[tests/integration]   |    Duration  544ms (tests 57%, transform 25%, import 16%, worker 2%)
[tests/integration]   | 
[tests/integration]   ✅  Success - Main npm run test:int -- test/integration [1.019428667s]
[tests/integration] ⭐ Run Post actions/setup-node@v4
[tests/integration]   | Cache Size: ~55 MB (57781292 B)
[tests/integration]   | Cache saved successfully
[tests/integration]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration]   ✅  Success - Post actions/setup-node@v4 [745.773042ms]
[tests/integration] ⭐ Run Complete job
[tests/integration] Cleaning up container for job integration
[tests/integration] Cleaning up services for job integration
[tests/integration] Cleaning up network for job integration, and network name is: act-tests-integration-b27bc53dfbce4ce132a8c560899137eb64b74fd4251997d0d6e61d812514bed6-integration-network
[tests/integration]   ✅  Success - Complete job
[tests/integration] 🏁  Job succeeded
wall time: 90 s`,
  '91-int-ten-dich-vu': `$ T0=$(date +%s); act push -W demo9/wf/91-int-ten-dich-vu.yml --cache-server-path .act/cache; echo "act exit: $?"; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T07:40:33+07:00" level=warning msg="Ignoring \\"--artifact-server-path=.act/artifacts\\" from …/labflow-lite/.actrc: this flag is not allowed in a project .actrc. Set it in your user config or on the command line, or pass --trust-project-actrc."
time="2026-11-01T07:40:33+07:00" level=warning msg="…/labflow-lite/.actrc is a project file. It may only set flags that do not reach host resources."
time="2026-11-01T07:40:33+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

[tests/integration] ⭐ Run Set up job
[tests/integration] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/integration] Cleaning up services for job integration
[tests/integration] Cleaning up network for job integration, and network name is: act-tests-integration-b27bc53dfbce4ce132a8c560899137eb64b74fd4251997d0d6e61d812514bed6-integration-network
[tests/integration] container health of a861c32f9e26233ad868f426a78d11cd3c035558adf55b15ca9600783bb6d908 (postgres:17) is starting
[tests/integration] container health of a861c32f9e26233ad868f426a78d11cd3c035558adf55b15ca9600783bb6d908 (postgres:17) is starting
[tests/integration] container health of a861c32f9e26233ad868f426a78d11cd3c035558adf55b15ca9600783bb6d908 (postgres:17) is healthy
[tests/integration]   ✅  Success - Set up job
[tests/integration] ⭐ Run Main actions/checkout@v4
[tests/integration]   ✅  Success - Main actions/checkout@v4 [208.690542ms]
[tests/integration] ⭐ Run Main actions/setup-node@v4
[tests/integration]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/integration]   ❓  ::group::Environment details
[tests/integration]   | node: v22.23.4
[tests/integration]   | npm: 10.9.9
[tests/integration]   | yarn: 
[tests/integration]   ❓  ::endgroup::
[tests/integration]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/integration]   | /root/.npm
[tests/integration]   ⚙  ***
[tests/integration]   | Cache Size: ~55 MB (57781292 B)
[tests/integration]   | Cache restored successfully
[tests/integration]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration]   ✅  Success - Main actions/setup-node@v4 [2.445392542s]
[tests/integration]   ⚙  ::set-output:: node-version=v22.23.4
[tests/integration]   ⚙  ::set-output:: cache-hit=true
[tests/integration]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/integration] ⭐ Run Main npm ci
[tests/integration]   | 
[tests/integration]   | added 568 packages, and audited 569 packages in 15s
[tests/integration]   | 
[tests/integration]   | 123 packages are looking for funding
[tests/integration]   |   run \`npm fund\` for details
[tests/integration]   | 
[tests/integration]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/integration]   | 
[tests/integration]   | To address issues that do not require attention, run:
[tests/integration]   |   npm audit fix
[tests/integration]   | 
[tests/integration]   | To address all issues possible, run:
[tests/integration]   |   npm audit fix --force
[tests/integration]   | 
[tests/integration]   | Some issues need review, and may require choosing
[tests/integration]   | a different dependency.
[tests/integration]   | 
[tests/integration]   | Run \`npm audit\` for details.
[tests/integration]   ✅  Success - Main npm ci [14.671458375s]
[tests/integration] ⭐ Run Main npm run test:int -- test/integration
[tests/integration]   | 
[tests/integration]   | > labflow-lite@1.0.0 test:int
[tests/integration]   | > vitest run --config vitest.integration.config.js test/integration
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   |  RUN  v5.0.5 …/labflow-lite
[tests/integration]   | 
[tests/integration]   | No test files found, exiting with code 1
[tests/integration]   | 
[tests/integration]   | filter: test/integration
[tests/integration]   | include: test/integration/**/*.int.test.js, demo4/**/*.int.test.js
[tests/integration]   | exclude:  **/node_modules/**, **/.git/**
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   | ⎯⎯⎯⎯⎯⎯ Unhandled Error ⎯⎯⎯⎯⎯⎯⎯
[tests/integration]   | Error: getaddrinfo ENOTFOUND postgres
[tests/integration]   |  ❯ GetAddrInfoReqWrap.onlookupall [as oncomplete] node:dns:122:26
[tests/integration]   | 
[tests/integration]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
[tests/integration]   | Serialized Error: { errno: -3008, code: 'ENOTFOUND', syscall: 'getaddrinfo', hostname: 'postgres' }
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   ❌  Failure - Main npm run test:int -- test/integration [875.694875ms]
[tests/integration] exitcode '1': failure
[tests/integration] ⭐ Run Complete job
[tests/integration]   ✅  Success - Complete job
[tests/integration] 🏁  Job failed
Error: Job 'integration' failed
act exit: 1
wall time: 28 s`,
  '91-khong-cache': `$ T0=$(date +%s); act push -W demo9/wf/91-khong-cache.yml; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T07:32:01+07:00" level=warning msg="Ignoring \\"--artifact-server-path=.act/artifacts\\" from …/labflow-lite/.actrc: this flag is not allowed in a project .actrc. Set it in your user config or on the command line, or pass --trust-project-actrc."
time="2026-11-01T07:32:01+07:00" level=warning msg="Ignoring \\"--cache-server-path=.act/cache\\" from …/labflow-lite/.actrc: this flag is not allowed in a project .actrc. Set it in your user config or on the command line, or pass --trust-project-actrc."
time="2026-11-01T07:32:01+07:00" level=warning msg="…/labflow-lite/.actrc is a project file. It may only set flags that do not reach host resources."
time="2026-11-01T07:32:01+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

[tests/unit + web] ⭐ Run Set up job
[tests/unit + web] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit + web]   ✅  Success - Set up job
[tests/unit + web] ⭐ Run Main actions/checkout@v4
[tests/unit + web]   ✅  Success - Main actions/checkout@v4 [271.106583ms]
[tests/unit + web] ⭐ Run Main actions/setup-node@v4
[tests/unit + web]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/unit + web]   ❓  ::group::Environment details
[tests/unit + web]   | node: v22.23.4
[tests/unit + web]   | npm: 10.9.9
[tests/unit + web]   | yarn: 
[tests/unit + web]   ❓  ::endgroup::
[tests/unit + web]   ✅  Success - Main actions/setup-node@v4 [2.098421667s]
[tests/unit + web]   ⚙  ::set-output:: node-version=v22.23.4
[tests/unit + web]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/unit + web] ⭐ Run Main npm ci
[tests/unit + web]   | 
[tests/unit + web]   | added 568 packages, and audited 569 packages in 35s
[tests/unit + web]   | 
[tests/unit + web]   | 123 packages are looking for funding
[tests/unit + web]   |   run \`npm fund\` for details
[tests/unit + web]   | 
[tests/unit + web]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit + web]   | 
[tests/unit + web]   | To address issues that do not require attention, run:
[tests/unit + web]   |   npm audit fix
[tests/unit + web]   | 
[tests/unit + web]   | To address all issues possible, run:
[tests/unit + web]   |   npm audit fix --force
[tests/unit + web]   | 
[tests/unit + web]   | Some issues need review, and may require choosing
[tests/unit + web]   | a different dependency.
[tests/unit + web]   | 
[tests/unit + web]   | Run \`npm audit\` for details.
[tests/unit + web]   ✅  Success - Main npm ci [34.826572666s]
[tests/unit + web] ⭐ Run Main npm run test:unit
[tests/unit + web]   | 
[tests/unit + web]   | > labflow-lite@1.0.0 test:unit
[tests/unit + web]   | > vitest run src/
[tests/unit + web]   | 
[tests/unit + web]   | 
[tests/unit + web]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit + web]   | 
[tests/unit + web]   | 
[tests/unit + web]   |  Test Files  15 passed (15)
[tests/unit + web]   |       Tests  116 passed (116)
[tests/unit + web]   |    Start at  00:32:43
[tests/unit + web]   |    Duration  748ms (transform 49%, tests 24%, import 24%, worker 3%)
[tests/unit + web]   | 
[tests/unit + web]   ✅  Success - Main npm run test:unit [1.217838791s]
[tests/unit + web] ⭐ Run Main npm run test:web
[tests/unit + web]   | 
[tests/unit + web]   | > labflow-lite@1.0.0 test:web
[tests/unit + web]   | > vitest run --config vitest.web.config.js web/
[tests/unit + web]   | 
[tests/unit + web]   | 
[tests/unit + web]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit + web]   | 
[tests/unit + web]   | 
[tests/unit + web]   |  Test Files  2 passed (2)
[tests/unit + web]   |       Tests  16 passed (16)
[tests/unit + web]   |    Start at  00:32:45
[tests/unit + web]   |    Duration  2.06s (tests 53%, environment 32%, setup 7%, transform 5%, import 3%)
[tests/unit + web]   | 
[tests/unit + web]   ✅  Success - Main npm run test:web [2.48679s]
[tests/unit + web] ⭐ Run Post actions/setup-node@v4
[tests/unit + web]   ✅  Success - Post actions/setup-node@v4 [153.397125ms]
[tests/unit + web] ⭐ Run Complete job
[tests/unit + web] Cleaning up container for job unit + web
[tests/unit + web]   ✅  Success - Complete job
[tests/unit + web] 🏁  Job succeeded
wall time: 47 s`,
  '91-npm-ci-lech': `$ grep dayjs package.json; npm ci
    "dayjs": "^1.11.13"
npm error code EUSAGE
npm error
npm error \`npm ci\` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with \`npm install\` before continuing.
npm error
npm error Missing: dayjs@1.11.23 from lock file
npm error
npm error Clean install a project
npm error
npm error Usage:
npm error npm ci
npm error
npm error Options:
npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]
npm error [--no-bin-links] [--no-fund] [--dry-run]
npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]
npm error
npm error aliases: clean-install, ic, install-clean, isntall-clean
npm error
npm error Run "npm help ci" for more info
npm error A complete log of this run can be found in: /Users/admin/.npm/_logs/2026-11-01T01_04_01_400Z-debug-0.log`,
  '91-only-ci': `$ CI=true npx vitest run demo9/chi-mot.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo9/chi-mot.test.js (2 tests | 1 failed | 1 skipped) 1ms
   × 31 seats need approval
   ↓ 30 seats do not

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo9/chi-mot.test.js > 31 seats need approval
Error: [Vitest] Unexpected .only modifier. Remove it or pass --allowOnly argument to bypass this error
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 skipped (2)
   Start at  08:04:10
   Duration  102ms (import 47%, transform 35%, worker 13%, tests 4%)`,
  '91-only-may': `$ npx vitest run demo9/chi-mot.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo9/chi-mot.test.js (2 tests | 1 skipped) 2ms
   ✓ 31 seats need approval 1ms
   ↓ 30 seats do not

 Test Files  1 passed (1)
      Tests  1 passed | 1 skipped (2)
   Start at  08:04:18
   Duration  100ms (import 43%, transform 32%, worker 15%, tests 9%)`,
  '91-th-act-0': `$ act push -W demo9/wf/th91-de.yml --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"
time="2026-11-01T08:16:23+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:16:23+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[tests/integration] 🚧  Skipping unsupported platform -- Try running with \`-P ubuntu-lastest=...\`
act exit: 0`,
  '91-th-act-1': `$ sed 's/ubuntu-lastest/ubuntu-latest/' demo9/wf/th91-de.yml > .act/b2.yml; act push -W .act/b2.yml --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"
time="2026-11-01T08:28:01+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:28:01+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[tests/integration] ⭐ Run Set up job
[tests/integration] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/integration] Cleaning up services for job integration
[tests/integration] Cleaning up network for job integration, and network name is: act-tests-integration-b27bc53dfbce4ce132a8c560899137eb64b74fd4251997d0d6e61d812514bed6-integration-network
[tests/integration] container health of 2233a3844dbdeebb5078d870d11e99f2d9739394b9aebce077ba56039f4649cc (postgres:17) is starting
[tests/integration] container health of 2233a3844dbdeebb5078d870d11e99f2d9739394b9aebce077ba56039f4649cc (postgres:17) is starting
[tests/integration] container health of 2233a3844dbdeebb5078d870d11e99f2d9739394b9aebce077ba56039f4649cc (postgres:17) is healthy
[tests/integration]   ✅  Success - Set up job
[tests/integration] ⭐ Run Main actions/checkout@v4
[tests/integration]   ✅  Success - Main actions/checkout@v4 [325.063291ms]
[tests/integration] ⭐ Run Main actions/setup-node@v4
[tests/integration]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/integration]   ❓  ::group::Environment details
[tests/integration]   | node: v22.23.4
[tests/integration]   | npm: 10.9.9
[tests/integration]   | yarn: 
[tests/integration]   ❓  ::endgroup::
[tests/integration]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/integration]   | /root/.npm
[tests/integration]   ⚙  ***
[tests/integration]   | Cache Size: ~55 MB (57741772 B)
[tests/integration]   | Cache restored successfully
[tests/integration]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration]   ✅  Success - Main actions/setup-node@v4 [3.037589333s]
[tests/integration]   ⚙  ::set-output:: node-version=v22.23.4
[tests/integration]   ⚙  ::set-output:: cache-hit=true
[tests/integration]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/integration] ⭐ Run Main npm ci
[tests/integration]   | 
[tests/integration]   | added 568 packages, and audited 569 packages in 15s
[tests/integration]   | 
[tests/integration]   | 123 packages are looking for funding
[tests/integration]   |   run \`npm fund\` for details
[tests/integration]   | 
[tests/integration]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/integration]   | 
[tests/integration]   | To address issues that do not require attention, run:
[tests/integration]   |   npm audit fix
[tests/integration]   | 
[tests/integration]   | To address all issues possible, run:
[tests/integration]   |   npm audit fix --force
[tests/integration]   | 
[tests/integration]   | Some issues need review, and may require choosing
[tests/integration]   | a different dependency.
[tests/integration]   | 
[tests/integration]   | Run \`npm audit\` for details.
[tests/integration]   ✅  Success - Main npm ci [15.240655583s]
[tests/integration] ⭐ Run Main npm run test:int -- test/integration
[tests/integration]   | 
[tests/integration]   | > labflow-lite@1.0.0 test:int
[tests/integration]   | > vitest run --config vitest.integration.config.js test/integration
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   |  RUN  v5.0.5 …/labflow-lite
[tests/integration]   | 
[tests/integration]   | No test files found, exiting with code 1
[tests/integration]   | 
[tests/integration]   | filter: test/integration
[tests/integration]   | include: test/integration/**/*.int.test.js, demo4/**/*.int.test.js
[tests/integration]   | exclude:  **/node_modules/**, **/.git/**
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   | ⎯⎯⎯⎯⎯⎯ Unhandled Error ⎯⎯⎯⎯⎯⎯⎯
[tests/integration]   | error: database "labflow" does not exist
[tests/integration]   |  ❯ parseErrorMessage node_modules/pg-protocol/dist/parser.js:306:11
[tests/integration]   |  ❯ Parser.handlePacket node_modules/pg-protocol/dist/parser.js:143:27
[tests/integration]   |  ❯ Parser.parse node_modules/pg-protocol/dist/parser.js:37:38
[tests/integration]   |  ❯ Socket.<anonymous> node_modules/pg-protocol/dist/index.js:12:42
[tests/integration]   |  ❯ Socket.emit node:events:519:28
[tests/integration]   |  ❯ addChunk node:internal/streams/readable:561:12
[tests/integration]   |  ❯ readableAddChunkPushByteMode node:internal/streams/readable:512:3
[tests/integration]   |  ❯ Readable.push node:internal/streams/readable:392:5
[tests/integration]   |  ❯ TCP.onStreamRead node:internal/stream_base_commons:189:23
[tests/integration]   | 
[tests/integration]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
[tests/integration]   | Serialized Error: { length: 93, severity: 'FATAL', code: '3D000', detail: undefined, hint: undefined, position: undefined, internalPosition: undefined, internalQuery: undefined, where: undefined, schema: undefined, table: undefined, dataType: undefined, constraint: undefined, file: 'postinit.c', routine: 'InitPostgres' }
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   ❌  Failure - Main npm run test:int -- test/integration [979.908833ms]
[tests/integration] exitcode '1': failure
[tests/integration] ⭐ Run Complete job
[tests/integration]   ✅  Success - Complete job
[tests/integration] 🏁  Job failed
Error: Job 'integration' failed
act exit: 1`,
  '91-th-act-2': `$ act push -W demo9/wf/th91.yml --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"
time="2026-11-01T08:16:53+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:16:53+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[tests/integration] ⭐ Run Set up job
[tests/integration] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/integration] Cleaning up services for job integration
[tests/integration] Cleaning up network for job integration, and network name is: act-tests-integration-b27bc53dfbce4ce132a8c560899137eb64b74fd4251997d0d6e61d812514bed6-integration-network
[tests/integration] container health of b944e6af5741aee7f74503f8a84bf3afbc574dc90558fc7870d3542feeb61fff (postgres:17) is starting
[tests/integration] container health of b944e6af5741aee7f74503f8a84bf3afbc574dc90558fc7870d3542feeb61fff (postgres:17) is starting
[tests/integration] container health of b944e6af5741aee7f74503f8a84bf3afbc574dc90558fc7870d3542feeb61fff (postgres:17) is healthy
[tests/integration]   ✅  Success - Set up job
[tests/integration] ⭐ Run Main actions/checkout@v4
[tests/integration]   ✅  Success - Main actions/checkout@v4 [283.896625ms]
[tests/integration] ⭐ Run Main actions/setup-node@v4
[tests/integration]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/integration]   ❓  ::group::Environment details
[tests/integration]   | node: v22.23.4
[tests/integration]   | npm: 10.9.9
[tests/integration]   | yarn: 
[tests/integration]   ❓  ::endgroup::
[tests/integration]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/integration]   | /root/.npm
[tests/integration]   ⚙  ***
[tests/integration]   | Cache Size: ~55 MB (57763490 B)
[tests/integration]   | Cache restored successfully
[tests/integration]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration]   ✅  Success - Main actions/setup-node@v4 [2.695519s]
[tests/integration]   ⚙  ::set-output:: node-version=v22.23.4
[tests/integration]   ⚙  ::set-output:: cache-hit=true
[tests/integration]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/integration] ⭐ Run Main npm ci
[tests/integration]   | 
[tests/integration]   | added 568 packages, and audited 569 packages in 14s
[tests/integration]   | 
[tests/integration]   | 123 packages are looking for funding
[tests/integration]   |   run \`npm fund\` for details
[tests/integration]   | 
[tests/integration]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/integration]   | 
[tests/integration]   | To address issues that do not require attention, run:
[tests/integration]   |   npm audit fix
[tests/integration]   | 
[tests/integration]   | To address all issues possible, run:
[tests/integration]   |   npm audit fix --force
[tests/integration]   | 
[tests/integration]   | Some issues need review, and may require choosing
[tests/integration]   | a different dependency.
[tests/integration]   | 
[tests/integration]   | Run \`npm audit\` for details.
[tests/integration]   ✅  Success - Main npm ci [14.532853542s]
[tests/integration] ⭐ Run Main npm run test:int -- test/integration
[tests/integration]   | 
[tests/integration]   | > labflow-lite@1.0.0 test:int
[tests/integration]   | > vitest run --config vitest.integration.config.js test/integration
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   |  RUN  v5.0.5 …/labflow-lite
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   |  Test Files  1 passed (1)
[tests/integration]   |       Tests  11 passed (11)
[tests/integration]   |    Start at  01:17:21
[tests/integration]   |    Duration  496ms (tests 62%, transform 21%, import 15%, worker 2%)
[tests/integration]   | 
[tests/integration]   ✅  Success - Main npm run test:int -- test/integration [938.079417ms]
[tests/integration] ⭐ Run Post actions/setup-node@v4
[tests/integration]   | Cache Size: ~55 MB (57757280 B)
[tests/integration]   | Cache saved successfully
[tests/integration]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration]   ✅  Success - Post actions/setup-node@v4 [598.696625ms]
[tests/integration] ⭐ Run Complete job
[tests/integration] Cleaning up container for job integration
[tests/integration] Cleaning up services for job integration
[tests/integration] Cleaning up network for job integration, and network name is: act-tests-integration-b27bc53dfbce4ce132a8c560899137eb64b74fd4251997d0d6e61d812514bed6-integration-network
[tests/integration]   ✅  Success - Complete job
[tests/integration] 🏁  Job succeeded
act exit: 0`,
  '91-th-cong-lan': `$ sed 's/ubuntu-lastest/ubuntu-latest/' demo9/wf/th91-de.yml > .act/b2.yml; act push -W .act/b2.yml --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"
time="2026-11-01T08:16:24+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:16:24+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[tests/integration] ⭐ Run Set up job
[tests/integration] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/integration] Cleaning up services for job integration
[tests/integration] Cleaning up network for job integration, and network name is: act-tests-integration-b27bc53dfbce4ce132a8c560899137eb64b74fd4251997d0d6e61d812514bed6-integration-network
[tests/integration] container health of c4da2d9f47d738a8ec9ff8b97b886ef548683328a67cfe0e65d24c28a1e33222 (postgres:17) is starting
[tests/integration] container health of c4da2d9f47d738a8ec9ff8b97b886ef548683328a67cfe0e65d24c28a1e33222 (postgres:17) is starting
[tests/integration] container health of c4da2d9f47d738a8ec9ff8b97b886ef548683328a67cfe0e65d24c28a1e33222 (postgres:17) is healthy
[tests/integration]   ✅  Success - Set up job
[tests/integration] ⭐ Run Main actions/checkout@v4
[tests/integration]   ✅  Success - Main actions/checkout@v4 [283.797458ms]
[tests/integration] ⭐ Run Main actions/setup-node@v4
[tests/integration]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/integration]   ❓  ::group::Environment details
[tests/integration]   | node: v22.23.4
[tests/integration]   | npm: 10.9.9
[tests/integration]   | yarn: 
[tests/integration]   ❓  ::endgroup::
[tests/integration]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/integration]   | /root/.npm
[tests/integration]   ⚙  ***
[tests/integration]   | Cache Size: ~55 MB (57763490 B)
[tests/integration]   | Cache restored successfully
[tests/integration]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration]   ✅  Success - Main actions/setup-node@v4 [2.597468667s]
[tests/integration]   ⚙  ::set-output:: node-version=v22.23.4
[tests/integration]   ⚙  ::set-output:: cache-hit=true
[tests/integration]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/integration] ⭐ Run Main npm ci
[tests/integration]   | 
[tests/integration]   | added 568 packages, and audited 569 packages in 16s
[tests/integration]   | 
[tests/integration]   | 123 packages are looking for funding
[tests/integration]   |   run \`npm fund\` for details
[tests/integration]   | 
[tests/integration]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/integration]   | 
[tests/integration]   | To address issues that do not require attention, run:
[tests/integration]   |   npm audit fix
[tests/integration]   | 
[tests/integration]   | To address all issues possible, run:
[tests/integration]   |   npm audit fix --force
[tests/integration]   | 
[tests/integration]   | Some issues need review, and may require choosing
[tests/integration]   | a different dependency.
[tests/integration]   | 
[tests/integration]   | Run \`npm audit\` for details.
[tests/integration]   ✅  Success - Main npm ci [15.90654575s]
[tests/integration] ⭐ Run Main npm run test:int -- test/integration
[tests/integration]   | 
[tests/integration]   | > labflow-lite@1.0.0 test:int
[tests/integration]   | > vitest run --config vitest.integration.config.js test/integration
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   |  RUN  v5.0.5 …/labflow-lite
[tests/integration]   | 
[tests/integration]   | No test files found, exiting with code 1
[tests/integration]   | 
[tests/integration]   | filter: test/integration
[tests/integration]   | include: test/integration/**/*.int.test.js, demo4/**/*.int.test.js
[tests/integration]   | exclude:  **/node_modules/**, **/.git/**
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   | ⎯⎯⎯⎯⎯⎯ Unhandled Error ⎯⎯⎯⎯⎯⎯⎯
[tests/integration]   | error: password authentication failed for user "postgres"
[tests/integration]   |  ❯ parseErrorMessage node_modules/pg-protocol/dist/parser.js:306:11
[tests/integration]   |  ❯ Parser.handlePacket node_modules/pg-protocol/dist/parser.js:143:27
[tests/integration]   |  ❯ Parser.parse node_modules/pg-protocol/dist/parser.js:37:38
[tests/integration]   |  ❯ Socket.<anonymous> node_modules/pg-protocol/dist/index.js:12:42
[tests/integration]   |  ❯ Socket.emit node:events:519:28
[tests/integration]   |  ❯ addChunk node:internal/streams/readable:561:12
[tests/integration]   |  ❯ readableAddChunkPushByteMode node:internal/streams/readable:512:3
[tests/integration]   |  ❯ Readable.push node:internal/streams/readable:392:5
[tests/integration]   |  ❯ TCP.onStreamRead node:internal/stream_base_commons:189:23
[tests/integration]   | 
[tests/integration]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
[tests/integration]   | Serialized Error: { length: 104, severity: 'FATAL', code: '28P01', detail: undefined, hint: undefined, position: undefined, internalPosition: undefined, internalQuery: undefined, where: undefined, schema: undefined, table: undefined, dataType: undefined, constraint: undefined, file: 'auth.c', routine: 'auth_failed' }
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   ❌  Failure - Main npm run test:int -- test/integration [701.515333ms]
[tests/integration] exitcode '1': failure
[tests/integration] ⭐ Run Complete job
[tests/integration]   ✅  Success - Complete job
[tests/integration] 🏁  Job failed
Error: Job 'integration' failed
act exit: 1`,
  '91-th-lint': `$ actionlint demo9/wf/th91-de.yml | cut -c1-110
demo9/wf/th91-de.yml:7:14: label "ubuntu-lastest" is unknown. available labels are "windows-latest", "windows-
  |
7 |     runs-on: ubuntu-lastest
  |              ^~~~~~~~~~~~~~`,
  '92-artifact-khong-server': `$ act push -W demo9/wf/92-artifact-trung.yml -j report; echo "act exit: $?"
time="2026-11-01T08:17:30+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

[artifacts/report (Node 22)-1] ⭐ Run Set up job
[artifacts/report (Node 24)-2] ⭐ Run Set up job
[artifacts/report (Node 22)-1] 🚀  Start image=catthehacker/ubuntu:act-24.04
[artifacts/report (Node 24)-2] 🚀  Start image=catthehacker/ubuntu:act-24.04
[artifacts/report (Node 24)-2]   ✅  Success - Set up job
[artifacts/report (Node 22)-1]   ✅  Success - Set up job
[artifacts/report (Node 24)-2] 🧪  Matrix: map[node:24]
[artifacts/report (Node 24)-2] ⭐ Run Main mkdir -p reports && echo "tests on Node 24" > reports/result.txt
[artifacts/report (Node 24)-2]   ✅  Success - Main mkdir -p reports && echo "tests on Node 24" > reports/result.txt [61.794625ms]
[artifacts/report (Node 24)-2] ⭐ Run Main actions/upload-artifact@v4
[artifacts/report (Node 22)-1] 🧪  Matrix: map[node:22]
[artifacts/report (Node 22)-1] ⭐ Run Main mkdir -p reports && echo "tests on Node 22" > reports/result.txt
[artifacts/report (Node 22)-1]   ✅  Success - Main mkdir -p reports && echo "tests on Node 22" > reports/result.txt [93.3135ms]
[artifacts/report (Node 22)-1] ⭐ Run Main actions/upload-artifact@v4
[artifacts/report (Node 24)-2]   | With the provided path, there will be 1 file uploaded
[artifacts/report (Node 24)-2]   | Artifact name is valid!
[artifacts/report (Node 24)-2]   | Root directory input is valid!
[artifacts/report (Node 24)-2]   ❗  ::error::Unable to get the ACTIONS_RUNTIME_TOKEN env variable
[artifacts/report (Node 24)-2]   ❌  Failure - Main actions/upload-artifact@v4 [969.56475ms]
[artifacts/report (Node 24)-2] exitcode '1': failure
[artifacts/report (Node 24)-2] ⭐ Run Complete job
[artifacts/report (Node 24)-2]   ✅  Success - Complete job
[artifacts/report (Node 24)-2] 🏁  Job failed
[artifacts/report (Node 22)-1]   | With the provided path, there will be 1 file uploaded
[artifacts/report (Node 22)-1]   | Artifact name is valid!
[artifacts/report (Node 22)-1]   | Root directory input is valid!
[artifacts/report (Node 22)-1]   ❗  ::error::Unable to get the ACTIONS_RUNTIME_TOKEN env variable
[artifacts/report (Node 22)-1]   ❌  Failure - Main actions/upload-artifact@v4 [927.649583ms]
[artifacts/report (Node 22)-1] exitcode '1': failure
[artifacts/report (Node 22)-1] ⭐ Run Complete job
[artifacts/report (Node 22)-1]   ✅  Success - Complete job
[artifacts/report (Node 22)-1] 🏁  Job failed
Error: Job 'report (Node \${{ matrix.node }})' failed
act exit: 1`,
  '92-artifact-list': `$ unzip -l .act/artifacts/1/playwright-report/playwright-report.zip
Archive:  .act/artifacts/1/playwright-report/playwright-report.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
   131437  11-01-2026 01:25   data/4e3e8ea0de29f774c01a3adc069ffb1d1d53d4fb.zip
     3236  11-01-2026 01:25   data/7b92e3650159fb602663235272fdc5814de6aca3.md
     3236  11-01-2026 01:25   data/bc74ace8a1cfeccb737f0ff2ef39149036bf73e8.md
     3236  11-01-2026 01:25   data/d0ce91418c88581d4c699fb65ad7a89d59432ccd.md
   531320  11-01-2026 01:25   index.html
   307393  11-01-2026 01:25   trace/assets/codeMirrorModule-BEB2e8M3.js
     2510  11-01-2026 01:25   trace/assets/urlMatch-L3liM589.js
   667649  11-01-2026 01:25   trace/assets/defaultSettingsView-D-g2vrvf.js
     6251  11-01-2026 01:25   trace/codeMirrorModule.-QdMvsKi.css
    80340  11-01-2026 01:25   trace/codicon.DCmgc-ay.ttf
   107270  11-01-2026 01:25   trace/defaultSettingsView.C8BeHuxd.css
     2055  11-01-2026 01:25   trace/index.B_TqY17P.css
     2363  11-01-2026 01:25   trace/index.html
     6628  11-01-2026 01:25   trace/index.oNry3Hjv.js
      429  11-01-2026 01:25   trace/manifest.webmanifest
      650  11-01-2026 01:25   trace/snapshot.B_Jk1wbt.js
     5033  11-01-2026 01:25   trace/playwright-logo.svg
      389  11-01-2026 01:25   trace/snapshot.html
    96737  11-01-2026 01:25   trace/sw.bundle.js
    38121  11-01-2026 01:25   trace/uiMode.CYwC_gH1.js
    54590  11-01-2026 01:25   trace/uiMode.CyMfwkXJ.css
      727  11-01-2026 01:25   trace/uiMode.html
     2853  11-01-2026 01:25   trace/xtermModule.kHJ-D0s7.css
---------                     -------
  2054453                     23 files`,
  '92-artifact-trung-noi-dung': `$ ls .act/artifacts/1/; unzip -p .act/artifacts/1/reports/reports.zip result.txt
playwright-report
reports
unit-reports-node22
unit-reports-node24
tests on Node 24`,
  '92-artifact-trung': `$ act push -W demo9/wf/92-artifact-trung.yml --artifact-server-path .act/artifacts; echo "act exit: $?"
time="2026-11-01T08:17:24+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:17:24+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[artifacts/report (Node 22)-1] ⭐ Run Set up job
[artifacts/report (Node 24)-2] ⭐ Run Set up job
[artifacts/report (Node 24)-2] 🚀  Start image=catthehacker/ubuntu:act-24.04
[artifacts/report (Node 22)-1] 🚀  Start image=catthehacker/ubuntu:act-24.04
[artifacts/report (Node 22)-1]   ✅  Success - Set up job
[artifacts/report (Node 24)-2]   ✅  Success - Set up job
[artifacts/report (Node 22)-1] 🧪  Matrix: map[node:22]
[artifacts/report (Node 22)-1] ⭐ Run Main mkdir -p reports && echo "tests on Node 22" > reports/result.txt
[artifacts/report (Node 22)-1]   ✅  Success - Main mkdir -p reports && echo "tests on Node 22" > reports/result.txt [55.272292ms]
[artifacts/report (Node 22)-1] ⭐ Run Main actions/upload-artifact@v4
[artifacts/report (Node 24)-2] 🧪  Matrix: map[node:24]
[artifacts/report (Node 24)-2] ⭐ Run Main mkdir -p reports && echo "tests on Node 24" > reports/result.txt
[artifacts/report (Node 24)-2]   ✅  Success - Main mkdir -p reports && echo "tests on Node 24" > reports/result.txt [64.706542ms]
[artifacts/report (Node 24)-2] ⭐ Run Main actions/upload-artifact@v4
[artifacts/report (Node 22)-1]   | With the provided path, there will be 1 file uploaded
[artifacts/report (Node 22)-1]   | Artifact name is valid!
[artifacts/report (Node 22)-1]   | Root directory input is valid!
[artifacts/report (Node 22)-1]   | Beginning upload of artifact content to blob storage
[artifacts/report (Node 22)-1]   | Uploaded bytes 153
[artifacts/report (Node 22)-1]   | Finished uploading artifact content to blob storage!
[artifacts/report (Node 22)-1]   | SHA256 digest of uploaded artifact zip is 906496b4609f4164d031f94b4c744a3f82495dc6edcf49701fe8f60909586ea1
[artifacts/report (Node 22)-1]   | Finalizing artifact upload
[artifacts/report (Node 22)-1]   | Artifact reports.zip successfully finalized. Artifact ID 431213384
[artifacts/report (Node 22)-1]   | Artifact reports has been successfully uploaded! Final size is 153 bytes. Artifact ID is 431213384
[artifacts/report (Node 22)-1]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/431213384
[artifacts/report (Node 22)-1]   ✅  Success - Main actions/upload-artifact@v4 [928.632042ms]
[artifacts/report (Node 22)-1]   ⚙  ::set-output:: artifact-id=431213384
[artifacts/report (Node 22)-1]   ⚙  ::set-output:: artifact-digest=906496b4609f4164d031f94b4c744a3f82495dc6edcf49701fe8f60909586ea1
[artifacts/report (Node 22)-1]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/431213384
[artifacts/report (Node 22)-1] ⭐ Run Complete job
[artifacts/report (Node 22)-1] Cleaning up container for job report (Node 22)
[artifacts/report (Node 22)-1]   ✅  Success - Complete job
[artifacts/report (Node 22)-1] 🏁  Job succeeded
[artifacts/report (Node 24)-2]   | With the provided path, there will be 1 file uploaded
[artifacts/report (Node 24)-2]   | Artifact name is valid!
[artifacts/report (Node 24)-2]   | Root directory input is valid!
[artifacts/report (Node 24)-2]   | Beginning upload of artifact content to blob storage
[artifacts/report (Node 24)-2]   | Uploaded bytes 153
[artifacts/report (Node 24)-2]   | Finished uploading artifact content to blob storage!
[artifacts/report (Node 24)-2]   | SHA256 digest of uploaded artifact zip is 77328d6f22b79308411122322f14ee5a64ac63ee4b98e59b1cbe895db2cf4f5b
[artifacts/report (Node 24)-2]   | Finalizing artifact upload
[artifacts/report (Node 24)-2]   | Artifact reports.zip successfully finalized. Artifact ID 431213384
[artifacts/report (Node 24)-2]   | Artifact reports has been successfully uploaded! Final size is 153 bytes. Artifact ID is 431213384
[artifacts/report (Node 24)-2]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/431213384
[artifacts/report (Node 24)-2]   ✅  Success - Main actions/upload-artifact@v4 [1.152510417s]
[artifacts/report (Node 24)-2]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/431213384
[artifacts/report (Node 24)-2]   ⚙  ::set-output:: artifact-id=431213384
[artifacts/report (Node 24)-2]   ⚙  ::set-output:: artifact-digest=77328d6f22b79308411122322f14ee5a64ac63ee4b98e59b1cbe895db2cf4f5b
[artifacts/report (Node 24)-2] ⭐ Run Complete job
[artifacts/report (Node 24)-2] Cleaning up container for job report (Node 24)
[artifacts/report (Node 24)-2]   ✅  Success - Complete job
[artifacts/report (Node 24)-2] 🏁  Job succeeded
act exit: 0`,
  '92-do': `$ git switch -q pr/tin-ngan && T0=$(date +%s); act pull_request -e demo9/pr-event.json --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"; echo "wall time: $(( $(date +%s) - T0 )) s"; git switch -q main
time="2026-11-01T08:18:55+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:18:55+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[tests/unit (Node 22)-1           ] ⭐ Run Set up job
[tests/unit (Node 22)-1           ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit (Node 24)-2           ] ⭐ Run Set up job
[tests/e2e (Chromium)             ] ⭐ Run Set up job
[tests/unit (Node 24)-2           ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/quarantine (report only)   ] ⭐ Run Set up job
[tests/e2e (Chromium)             ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/quarantine (report only)   ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/integration (PostgreSQL 17)] ⭐ Run Set up job
[tests/integration (PostgreSQL 17)] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit (Node 24)-2           ]   ✅  Success - Set up job
[tests/quarantine (report only)   ]   ✅  Success - Set up job
[tests/e2e (Chromium)             ]   ✅  Success - Set up job
[tests/unit (Node 22)-1           ]   ✅  Success - Set up job
[tests/integration (PostgreSQL 17)] Cleaning up services for job integration (PostgreSQL 17)
[tests/integration (PostgreSQL 17)] Cleaning up network for job integration (PostgreSQL 17), and network name is: act-tests-integration-PostgreSQL-17-5e0f6b3fadeed8a74b9e4958450e417f2d3a94712d4e7353ec7b62f47652e247-integration-network
[tests/quarantine (report only)   ] ⭐ Run Main actions/checkout@v4
[tests/quarantine (report only)   ]   ✅  Success - Main actions/checkout@v4 [327.409667ms]
[tests/quarantine (report only)   ] ⭐ Run Main actions/setup-node@v4
[tests/integration (PostgreSQL 17)] container health of c6cfdab8f0c0069d2da784984b00a7eae2856e2f5eef55e5468553cfc5d6c989 (postgres:17) is starting
[tests/integration (PostgreSQL 17)] container health of c6cfdab8f0c0069d2da784984b00a7eae2856e2f5eef55e5468553cfc5d6c989 (postgres:17) is starting
[tests/quarantine (report only)   ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/quarantine (report only)   ]   ❓  ::group::Environment details
[tests/quarantine (report only)   ]   | node: v22.23.4
[tests/quarantine (report only)   ]   | npm: 10.9.9
[tests/quarantine (report only)   ]   | yarn: 
[tests/quarantine (report only)   ]   ❓  ::endgroup::
[tests/quarantine (report only)   ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/quarantine (report only)   ]   | /root/.npm
[tests/quarantine (report only)   ]   ⚙  ***
[tests/quarantine (report only)   ]   | Cache Size: ~55 MB (57741284 B)
[tests/integration (PostgreSQL 17)] container health of c6cfdab8f0c0069d2da784984b00a7eae2856e2f5eef55e5468553cfc5d6c989 (postgres:17) is healthy
[tests/integration (PostgreSQL 17)]   ✅  Success - Set up job
[tests/quarantine (report only)   ]   | Cache restored successfully
[tests/quarantine (report only)   ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/quarantine (report only)   ]   ✅  Success - Main actions/setup-node@v4 [3.769842208s]
[tests/quarantine (report only)   ]   ⚙  ::set-output:: node-version=v22.23.4
[tests/quarantine (report only)   ]   ⚙  ::set-output:: cache-hit=true
[tests/quarantine (report only)   ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/quarantine (report only)   ] ⭐ Run Main npm ci
[tests/e2e (Chromium)             ] ⭐ Run Main actions/checkout@v4
[tests/e2e (Chromium)             ]   ✅  Success - Main actions/checkout@v4 [374.900834ms]
[tests/e2e (Chromium)             ] ⭐ Run Main actions/setup-node@v4
[tests/unit (Node 24)-2           ] 🧪  Matrix: map[node:24]
[tests/unit (Node 24)-2           ] ⭐ Run Main actions/checkout@v4
[tests/unit (Node 24)-2           ]   ✅  Success - Main actions/checkout@v4 [375.547709ms]
[tests/unit (Node 24)-2           ] ⭐ Run Main actions/setup-node@v4
[tests/unit (Node 22)-1           ] 🧪  Matrix: map[node:22]
[tests/unit (Node 22)-1           ] ⭐ Run Main actions/checkout@v4
[tests/unit (Node 22)-1           ]   ✅  Success - Main actions/checkout@v4 [453.92175ms]
[tests/unit (Node 22)-1           ] ⭐ Run Main actions/setup-node@v4
[tests/integration (PostgreSQL 17)] ⭐ Run Main actions/checkout@v4
[tests/integration (PostgreSQL 17)]   ✅  Success - Main actions/checkout@v4 [666.135875ms]
[tests/integration (PostgreSQL 17)] ⭐ Run Main actions/setup-node@v4
[tests/e2e (Chromium)             ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/e2e (Chromium)             ]   ❓  ::group::Environment details
[tests/e2e (Chromium)             ]   | node: v22.23.4
[tests/e2e (Chromium)             ]   | npm: 10.9.9
[tests/e2e (Chromium)             ]   | yarn: 
[tests/e2e (Chromium)             ]   ❓  ::endgroup::
[tests/e2e (Chromium)             ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/e2e (Chromium)             ]   | /root/.npm
[tests/e2e (Chromium)             ]   ⚙  ***
[tests/e2e (Chromium)             ]   | Cache Size: ~55 MB (57741284 B)
[tests/unit (Node 24)-2           ]   | Found in cache @ /opt/hostedtoolcache/node/24.22.2/arm64
[tests/unit (Node 24)-2           ]   ❓  ::group::Environment details
[tests/unit (Node 22)-1           ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/unit (Node 22)-1           ]   ❓  ::group::Environment details
[tests/unit (Node 24)-2           ]   | node: v24.22.2
[tests/unit (Node 24)-2           ]   | npm: 11.19.1
[tests/unit (Node 24)-2           ]   | yarn: 
[tests/unit (Node 24)-2           ]   ❓  ::endgroup::
[tests/unit (Node 24)-2           ]   | [command]/opt/hostedtoolcache/node/24.22.2/arm64/bin/npm config get cache
[tests/unit (Node 22)-1           ]   | node: v22.23.4
[tests/unit (Node 22)-1           ]   | npm: 10.9.9
[tests/unit (Node 22)-1           ]   | yarn: 
[tests/unit (Node 22)-1           ]   ❓  ::endgroup::
[tests/unit (Node 22)-1           ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/e2e (Chromium)             ]   | Cache restored successfully
[tests/e2e (Chromium)             ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/e2e (Chromium)             ]   ✅  Success - Main actions/setup-node@v4 [6.959302042s]
[tests/e2e (Chromium)             ]   ⚙  ::set-output:: node-version=v22.23.4
[tests/e2e (Chromium)             ]   ⚙  ::set-output:: cache-hit=true
[tests/e2e (Chromium)             ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/unit (Node 24)-2           ]   | /root/.npm
[tests/unit (Node 22)-1           ]   | /root/.npm
[tests/unit (Node 24)-2           ]   ⚙  ***
[tests/e2e (Chromium)             ] ⭐ Run Main npm ci
[tests/unit (Node 22)-1           ]   ⚙  ***
[tests/unit (Node 22)-1           ]   | Cache Size: ~55 MB (57741284 B)
[tests/unit (Node 24)-2           ]   | Cache Size: ~55 MB (57741284 B)
[tests/integration (PostgreSQL 17)]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/integration (PostgreSQL 17)]   ❓  ::group::Environment details
[tests/integration (PostgreSQL 17)]   | node: v22.23.4
[tests/integration (PostgreSQL 17)]   | npm: 10.9.9
[tests/integration (PostgreSQL 17)]   | yarn: 
[tests/integration (PostgreSQL 17)]   ❓  ::endgroup::
[tests/integration (PostgreSQL 17)]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/integration (PostgreSQL 17)]   | /root/.npm
[tests/unit (Node 22)-1           ]   | Cache restored successfully
[tests/unit (Node 22)-1           ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration (PostgreSQL 17)]   ⚙  ***
[tests/unit (Node 22)-1           ]   ✅  Success - Main actions/setup-node@v4 [6.159020417s]
[tests/unit (Node 22)-1           ]   ⚙  ::set-output:: node-version=v22.23.4
[tests/unit (Node 22)-1           ]   ⚙  ::set-output:: cache-hit=true
[tests/unit (Node 22)-1           ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/unit (Node 24)-2           ]   | Cache restored successfully
[tests/unit (Node 24)-2           ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit (Node 22)-1           ] ⭐ Run Main npm ci
[tests/unit (Node 24)-2           ]   ✅  Success - Main actions/setup-node@v4 [7.733053667s]
[tests/unit (Node 24)-2           ]   ⚙  ::set-output:: cache-hit=true
[tests/unit (Node 24)-2           ]   ⚙  ::set-output:: node-version=v24.22.2
[tests/unit (Node 24)-2           ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/24.22.2/arm64/bin
[tests/unit (Node 24)-2           ] ⭐ Run Main npm ci
[tests/integration (PostgreSQL 17)]   | Cache Size: ~55 MB (57741284 B)
[tests/integration (PostgreSQL 17)]   | Cache restored successfully
[tests/integration (PostgreSQL 17)]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration (PostgreSQL 17)]   ✅  Success - Main actions/setup-node@v4 [5.797824416s]
[tests/integration (PostgreSQL 17)]   ⚙  ::set-output:: node-version=v22.23.4
[tests/integration (PostgreSQL 17)]   ⚙  ::set-output:: cache-hit=true
[tests/integration (PostgreSQL 17)]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/integration (PostgreSQL 17)] ⭐ Run Main npm ci
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | added 568 packages, and audited 569 packages in 33s
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | 123 packages are looking for funding
[tests/quarantine (report only)   ]   |   run \`npm fund\` for details
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | To address issues that do not require attention, run:
[tests/quarantine (report only)   ]   |   npm audit fix
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | To address all issues possible, run:
[tests/quarantine (report only)   ]   |   npm audit fix --force
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | Some issues need review, and may require choosing
[tests/quarantine (report only)   ]   | a different dependency.
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | Run \`npm audit\` for details.
[tests/quarantine (report only)   ]   ✅  Success - Main npm ci [33.048039s]
[tests/quarantine (report only)   ] ⭐ Run Main npm run test:quarantine -- --repeats=9
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | > labflow-lite@1.0.0 test:quarantine
[tests/quarantine (report only)   ]   | > vitest run test/quarantine --tagsFilter=quarantine --repeats=9
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   |  RUN  v5.0.5 …/labflow-lite
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   |  ❯ test/quarantine/double-booking.test.js (1 test | 1 failed) 362ms
[tests/quarantine (report only)   ]   |    × two students book the same slot at once: exactly one wins 360ms (repeat x9)
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   |  FAIL  test/quarantine/double-booking.test.js > two students book the same slot at once: exactly one wins
[tests/quarantine (report only)   ]   |  FAIL  test/quarantine/double-booking.test.js > two students book the same slot at once: exactly one wins
[tests/quarantine (report only)   ]   |  FAIL  test/quarantine/double-booking.test.js > two students book the same slot at once: exactly one wins
[tests/quarantine (report only)   ]   | AssertionError: expected [ 'fulfilled', 'fulfilled' ] to deeply equal [ 'fulfilled', 'rejected' ]
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | - Expected
[tests/quarantine (report only)   ]   | + Received
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   |   [
[tests/quarantine (report only)   ]   |     "fulfilled",
[tests/quarantine (report only)   ]   | -   "rejected",
[tests/quarantine (report only)   ]   | +   "fulfilled",
[tests/quarantine (report only)   ]   |   ]
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   |  ❯ test/quarantine/double-booking.test.js:17:47
[tests/quarantine (report only)   ]   |      15|   const repo = slowRepo();
[tests/quarantine (report only)   ]   |      16|   const results = await Promise.allSettled([bookLab(repo, input), book…
[tests/quarantine (report only)   ]   |      17|   expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'r…
[tests/quarantine (report only)   ]   |        |                                               ^
[tests/quarantine (report only)   ]   |      18| });
[tests/quarantine (report only)   ]   |      19|
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   |  Test Files  1 failed (1)
[tests/quarantine (report only)   ]   |       Tests  1 failed (1)
[tests/quarantine (report only)   ]   |    Start at  01:19:38
[tests/quarantine (report only)   ]   |    Duration  919ms (tests 77%, transform 19%, import 4%, worker 1%)
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   ❌  Failure - Main npm run test:quarantine -- --repeats=9 [1.623143125s]
[tests/quarantine (report only)   ] exitcode '1': failure
[tests/quarantine (report only)   ] ⭐ Run Complete job
[tests/quarantine (report only)   ]   ✅  Success - Complete job
[tests/quarantine (report only)   ] 🏁  Job failed
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | added 568 packages, and audited 569 packages in 32s
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | 123 packages are looking for funding
[tests/e2e (Chromium)             ]   |   run \`npm fund\` for details
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | To address issues that do not require attention, run:
[tests/e2e (Chromium)             ]   |   npm audit fix
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | To address all issues possible, run:
[tests/e2e (Chromium)             ]   |   npm audit fix --force
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | Some issues need review, and may require choosing
[tests/e2e (Chromium)             ]   | a different dependency.
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | Run \`npm audit\` for details.
[tests/e2e (Chromium)             ]   ✅  Success - Main npm ci [32.604677375s]
[tests/e2e (Chromium)             ] ⭐ Run Main npx playwright install --with-deps chromium
[tests/e2e (Chromium)             ]   | Installing dependencies...
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | added 568 packages, and audited 569 packages in 39s
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | 123 packages are looking for funding
[tests/integration (PostgreSQL 17)]   |   run \`npm fund\` for details
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | To address issues that do not require attention, run:
[tests/integration (PostgreSQL 17)]   |   npm audit fix
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | To address all issues possible, run:
[tests/integration (PostgreSQL 17)]   |   npm audit fix --force
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | Some issues need review, and may require choosing
[tests/integration (PostgreSQL 17)]   | a different dependency.
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | Run \`npm audit\` for details.
[tests/integration (PostgreSQL 17)]   ✅  Success - Main npm ci [39.462821084s]
[tests/integration (PostgreSQL 17)] ⭐ Run Main npm run test:int -- test/integration --reporter=tree --reporter=github-actions
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | > labflow-lite@1.0.0 test:int
[tests/integration (PostgreSQL 17)]   | > vitest run --config vitest.integration.config.js test/integration --reporter=tree --reporter=github-actions
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   |  RUN  v5.0.5 …/labflow-lite
[tests/integration (PostgreSQL 17)]   | 
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | added 568 packages, and audited 569 packages in 41s
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | 123 packages are looking for funding
[tests/unit (Node 22)-1           ]   |   run \`npm fund\` for details
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | To address issues that do not require attention, run:
[tests/unit (Node 22)-1           ]   |   npm audit fix
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | To address all issues possible, run:
[tests/unit (Node 22)-1           ]   |   npm audit fix --force
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | Some issues need review, and may require choosing
[tests/unit (Node 22)-1           ]   | a different dependency.
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | Run \`npm audit\` for details.
[tests/unit (Node 22)-1           ]   ✅  Success - Main npm ci [41.886244708s]
[tests/unit (Node 22)-1           ] ⭐ Run Main unit tests + coverage
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | added 568 packages, and audited 569 packages in 42s
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | 123 packages are looking for funding
[tests/unit (Node 24)-2           ]   |   run \`npm fund\` for details
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | To address issues that do not require attention, run:
[tests/unit (Node 24)-2           ]   |   npm audit fix
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | To address all issues possible, run:
[tests/unit (Node 24)-2           ]   |   npm audit fix --force
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | Some issues need review, and may require choosing
[tests/unit (Node 24)-2           ]   | a different dependency.
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | Run \`npm audit\` for details.
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   |  Test Files  1 passed (1)
[tests/integration (PostgreSQL 17)]   |       Tests  11 passed (11)
[tests/integration (PostgreSQL 17)]   |    Start at  01:19:56
[tests/integration (PostgreSQL 17)]   |    Duration  1.31s (tests 61%, transform 24%, import 13%, worker 2%)
[tests/integration (PostgreSQL 17)]   | 
[tests/unit (Node 24)-2           ]   ✅  Success - Main npm ci [42.947230959s]
[tests/integration (PostgreSQL 17)]   ✅  Success - Main npm run test:int -- test/integration --reporter=tree --reporter=github-actions [2.031594625s]
[tests/integration (PostgreSQL 17)]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ✅ **1 pass** · 1 total
- **Test Results**: ✅ **11 passes** · 11 total
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 22)-1           ]   |       Coverage enabled with v8
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 24)-2           ] ⭐ Run Main unit tests + coverage
[tests/integration (PostgreSQL 17)] ⭐ Run Post actions/setup-node@v4
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   |  Test Files  20 passed (20)
[tests/unit (Node 22)-1           ]   |       Tests  174 passed (174)
[tests/unit (Node 22)-1           ]   |    Start at  01:19:57
[tests/unit (Node 22)-1           ]   |    Duration  1.73s (import 37%, transform 36%, tests 14%, worker 13%)
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | JSON report written to …/labflow-lite/reports/unit.json
[tests/unit (Node 22)-1           ]   | JUNIT report written to …/labflow-lite/reports/junit-unit.xml
[tests/unit (Node 22)-1           ]   |  % Coverage report from v8
[tests/integration (PostgreSQL 17)]   | Cache Size: ~55 MB (57741772 B)
[tests/unit (Node 22)-1           ]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 22)-1           ]   | File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   
[tests/unit (Node 22)-1           ]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 22)-1           ]   | All files        |   97.71 |    90.21 |   97.52 |   98.96 |                     
[tests/unit (Node 22)-1           ]   |  api             |   91.22 |    80.76 |   93.75 |   95.55 |                     
[tests/unit (Node 22)-1           ]   |   auth.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   schemas.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   server.js      |   89.58 |    79.16 |   91.66 |   94.44 | 54-56               
[tests/unit (Node 22)-1           ]   |  auth            |   92.85 |    85.71 |      80 |   92.85 |                     
[tests/unit (Node 22)-1           ]   |   login-guard.js |   92.85 |    85.71 |      80 |   92.85 | 5                   
[tests/unit (Node 22)-1           ]   |  booking         |   97.14 |     87.5 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   service.js     |   97.14 |     87.5 |     100 |     100 | 28,52               
[tests/unit (Node 22)-1           ]   |  ci              |   98.75 |    87.28 |   98.24 |     100 |                     
[tests/unit (Node 22)-1           ]   |   gate.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   policy.js      |      98 |    85.33 |   97.72 |     100 | ...5,29-31,43,69,77 
[tests/unit (Node 22)-1           ]   |   shard.js       |     100 |       95 |     100 |     100 | 32                  
[tests/unit (Node 22)-1           ]   |   summary.js     |     100 |    84.21 |     100 |     100 | 17-29               
[tests/unit (Node 22)-1           ]   |  lib             |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   mailer.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   retry.js       |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |  notify          |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   notify.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   reminder.js    |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |  rules           |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   booking.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   cancel.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   checkin.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   code.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   days.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   time.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 22)-1           ]   ✅  Success - Main unit tests + coverage [3.324339958s]
[tests/unit (Node 22)-1           ]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ✅ **20 passes** · 20 total
- **Test Results**: ✅ **174 passes** · 174 total
[tests/integration (PostgreSQL 17)]   | Cache saved successfully
[tests/integration (PostgreSQL 17)]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration (PostgreSQL 17)]   ✅  Success - Post actions/setup-node@v4 [2.156556833s]
[tests/unit (Node 22)-1           ] ⭐ Run Main web tests
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 24)-2           ]   |       Coverage enabled with v8
[tests/unit (Node 24)-2           ]   | 
[tests/integration (PostgreSQL 17)] ⭐ Run Complete job
[tests/integration (PostgreSQL 17)] Cleaning up container for job integration (PostgreSQL 17)
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | > labflow-lite@1.0.0 test:web
[tests/unit (Node 22)-1           ]   | > vitest run --config vitest.web.config.js web/ --reporter=tree --reporter=github-actions
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   |  Test Files  20 passed (20)
[tests/unit (Node 24)-2           ]   |       Tests  174 passed (174)
[tests/unit (Node 24)-2           ]   |    Start at  01:19:59
[tests/unit (Node 24)-2           ]   |    Duration  1.95s (transform 33%, import 33%, tests 19%, worker 15%)
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   |     Isolate  20 workers spawned · ~211ms startup each (spawn + environment, per file)
[tests/unit (Node 24)-2           ]   |              at least ~258ms faster with isolate: false — reuses workers across files instead of one per file
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | JSON report written to …/labflow-lite/reports/unit.json
[tests/unit (Node 24)-2           ]   | JUNIT report written to …/labflow-lite/reports/junit-unit.xml
[tests/unit (Node 24)-2           ]   |  % Coverage report from v8
[tests/unit (Node 24)-2           ]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 24)-2           ]   | File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   
[tests/unit (Node 24)-2           ]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 24)-2           ]   | All files        |   97.71 |    90.21 |   97.52 |   98.96 |                     
[tests/unit (Node 24)-2           ]   |  api             |   91.22 |    80.76 |   93.75 |   95.55 |                     
[tests/unit (Node 24)-2           ]   |   auth.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   schemas.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   server.js      |   89.58 |    79.16 |   91.66 |   94.44 | 54-56               
[tests/unit (Node 24)-2           ]   |  auth            |   92.85 |    85.71 |      80 |   92.85 |                     
[tests/unit (Node 24)-2           ]   |   login-guard.js |   92.85 |    85.71 |      80 |   92.85 | 5                   
[tests/unit (Node 24)-2           ]   |  booking         |   97.14 |     87.5 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   service.js     |   97.14 |     87.5 |     100 |     100 | 28,52               
[tests/unit (Node 24)-2           ]   |  ci              |   98.75 |    87.28 |   98.24 |     100 |                     
[tests/unit (Node 24)-2           ]   |   gate.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   policy.js      |      98 |    85.33 |   97.72 |     100 | ...5,29-31,43,69,77 
[tests/unit (Node 24)-2           ]   |   shard.js       |     100 |       95 |     100 |     100 | 32                  
[tests/unit (Node 24)-2           ]   |   summary.js     |     100 |    84.21 |     100 |     100 | 17-29               
[tests/unit (Node 24)-2           ]   |  lib             |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   mailer.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   retry.js       |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |  notify          |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   notify.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   reminder.js    |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |  rules           |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   booking.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   cancel.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   checkin.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   code.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   days.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   time.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 24)-2           ]   ✅  Success - Main unit tests + coverage [4.362350541s]
[tests/integration (PostgreSQL 17)] Cleaning up services for job integration (PostgreSQL 17)
[tests/unit (Node 24)-2           ]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ✅ **20 passes** · 20 total
- **Test Results**: ✅ **174 passes** · 174 total
[tests/unit (Node 24)-2           ] ⭐ Run Main web tests
[tests/integration (PostgreSQL 17)] Cleaning up network for job integration (PostgreSQL 17), and network name is: act-tests-integration-PostgreSQL-17-5e0f6b3fadeed8a74b9e4958450e417f2d3a94712d4e7353ec7b62f47652e247-integration-network
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | > labflow-lite@1.0.0 test:web
[tests/unit (Node 24)-2           ]   | > vitest run --config vitest.web.config.js web/ --reporter=tree --reporter=github-actions
[tests/unit (Node 24)-2           ]   | 
[tests/integration (PostgreSQL 17)]   ✅  Success - Complete job
[tests/integration (PostgreSQL 17)] 🏁  Job succeeded
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 22)-1           ]   |  ❯ web/BookingForm.test.jsx (12 tests | 1 failed) 1954ms
[tests/unit (Node 22)-1           ]   |    ❯ BookingForm (12)
[tests/unit (Node 22)-1           ]   |      × sends what the user typed, once, and says it is booked 546ms
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   |  FAIL  web/BookingForm.test.jsx > BookingForm > sends what the user typed, once, and says it is booked
[tests/unit (Node 22)-1           ]   | Error: expect(element).toHaveTextContent()
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | Expected element to have text content:
[tests/unit (Node 22)-1           ]   |   Booked. See you in BE-201.
[tests/unit (Node 22)-1           ]   | Received:
[tests/unit (Node 22)-1           ]   |   Booked.
[tests/unit (Node 22)-1           ]   |  ❯ web/BookingForm.test.jsx:28:47
[tests/unit (Node 22)-1           ]   |      26|     await book();
[tests/unit (Node 22)-1           ]   |      27|     expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ lab: 'BE-201', …
[tests/unit (Node 22)-1           ]   |      28|     expect(await screen.findByRole('status')).toHaveTextContent('Booke…
[tests/unit (Node 22)-1           ]   |        |                                               ^
[tests/unit (Node 22)-1           ]   |      29|   });
[tests/unit (Node 22)-1           ]   |      30|
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   |  Test Files  1 failed | 1 passed (2)
[tests/unit (Node 22)-1           ]   |       Tests  1 failed | 15 passed (16)
[tests/unit (Node 22)-1           ]   |    Start at  01:20:00
[tests/unit (Node 22)-1           ]   |    Duration  4.00s (environment 40%, tests 39%, setup 13%, transform 5%, import 2%)
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   ❗  ::error file=…/labflow-lite/web/BookingForm.test.jsx,title=web/BookingForm.test.jsx > BookingForm > sends what the user typed%2C once%2C and says it is booked,line=28,column=47::Error: expect(element).toHaveTextContent()%0A%0AExpected element to have text content:%0A  Booked. See you in BE-201.%0AReceived:%0A  Booked.%0A ❯ web/BookingForm.test.jsx:28:47%0A%0A
[tests/unit (Node 22)-1           ]   ❌  Failure - Main web tests [4.883659333s]
[tests/unit (Node 22)-1           ]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ❌ **1 failure** · ✅ **1 pass** · 2 total
- **Test Results**: ❌ **1 failure** · ✅ **15 passes** · 16 total
[tests/unit (Node 22)-1           ] exitcode '1': failure
[tests/unit (Node 22)-1           ] ⭐ Run Main summary
[tests/unit (Node 22)-1           ]   | ## unit (Node 22)
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | ### ✅ 174 of 174 tests passed
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | | Coverage | Now | Minimum | |
[tests/unit (Node 22)-1           ]   | |---|---:|---:|---|
[tests/unit (Node 22)-1           ]   | | lines | 98.96% | 85% | ✅ |
[tests/unit (Node 22)-1           ]   | | branches | 90.21% | 80% | ✅ |
[tests/unit (Node 22)-1           ]   | | functions | 97.52% | 80% | ✅ |
[tests/unit (Node 22)-1           ]   | | statements | 97.71% | 85% | ✅ |
[tests/unit (Node 22)-1           ]   ✅  Success - Main summary [205.430541ms]
[tests/unit (Node 22)-1           ]   ⚙  Summary - ## unit (Node 22)

### ✅ 174 of 174 tests passed

| Coverage | Now | Minimum | |
|---|---:|---:|---|
| lines | 98.96% | 85% | ✅ |
| branches | 90.21% | 80% | ✅ |
| functions | 97.52% | 80% | ✅ |
| statements | 97.71% | 85% | ✅ |
[tests/unit (Node 22)-1           ] ⭐ Run Main upload reports
[tests/unit (Node 24)-2           ]   |  ❯ web/BookingForm.test.jsx (12 tests | 1 failed) 1458ms
[tests/unit (Node 24)-2           ]   |    ❯ BookingForm (12)
[tests/unit (Node 24)-2           ]   |      × sends what the user typed, once, and says it is booked 232ms
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   |  FAIL  web/BookingForm.test.jsx > BookingForm > sends what the user typed, once, and says it is booked
[tests/unit (Node 24)-2           ]   | Error: expect(element).toHaveTextContent()
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | Expected element to have text content:
[tests/unit (Node 24)-2           ]   |   Booked. See you in BE-201.
[tests/unit (Node 24)-2           ]   | Received:
[tests/unit (Node 24)-2           ]   |   Booked.
[tests/unit (Node 24)-2           ]   |  ❯ web/BookingForm.test.jsx:28:47
[tests/unit (Node 24)-2           ]   |      26|     await book();
[tests/unit (Node 24)-2           ]   |      27|     expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ lab: 'BE-201', …
[tests/unit (Node 24)-2           ]   |      28|     expect(await screen.findByRole('status')).toHaveTextContent('Booke…
[tests/unit (Node 24)-2           ]   |        |                                               ^
[tests/unit (Node 24)-2           ]   |      29|   });
[tests/unit (Node 24)-2           ]   |      30|
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   |  Test Files  1 failed | 1 passed (2)
[tests/unit (Node 24)-2           ]   |       Tests  1 failed | 15 passed (16)
[tests/unit (Node 24)-2           ]   |    Start at  01:20:02
[tests/unit (Node 24)-2           ]   |    Duration  2.70s (environment 47%, tests 43%, setup 5%, transform 4%, import 2%)
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   ❗  ::error file=…/labflow-lite/web/BookingForm.test.jsx,title=web/BookingForm.test.jsx > BookingForm > sends what the user typed%2C once%2C and says it is booked,line=28,column=47::Error: expect(element).toHaveTextContent()%0A%0AExpected element to have text content:%0A  Booked. See you in BE-201.%0AReceived:%0A  Booked.%0A ❯ web/BookingForm.test.jsx:28:47%0A%0A
[tests/unit (Node 24)-2           ]   ❌  Failure - Main web tests [3.760946958s]
[tests/unit (Node 24)-2           ]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ❌ **1 failure** · ✅ **1 pass** · 2 total
- **Test Results**: ❌ **1 failure** · ✅ **15 passes** · 16 total
[tests/unit (Node 24)-2           ] exitcode '1': failure
[tests/unit (Node 24)-2           ] ⭐ Run Main summary
[tests/unit (Node 24)-2           ]   | ## unit (Node 24)
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | ### ✅ 174 of 174 tests passed
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | | Coverage | Now | Minimum | |
[tests/unit (Node 24)-2           ]   | |---|---:|---:|---|
[tests/unit (Node 24)-2           ]   | | lines | 98.96% | 85% | ✅ |
[tests/unit (Node 24)-2           ]   | | branches | 90.21% | 80% | ✅ |
[tests/unit (Node 24)-2           ]   | | functions | 97.52% | 80% | ✅ |
[tests/unit (Node 24)-2           ]   | | statements | 97.71% | 85% | ✅ |
[tests/unit (Node 24)-2           ]   ✅  Success - Main summary [303.811375ms]
[tests/unit (Node 24)-2           ]   ⚙  Summary - ## unit (Node 24)

### ✅ 174 of 174 tests passed

| Coverage | Now | Minimum | |
|---|---:|---:|---|
| lines | 98.96% | 85% | ✅ |
| branches | 90.21% | 80% | ✅ |
| functions | 97.52% | 80% | ✅ |
| statements | 97.71% | 85% | ✅ |
[tests/unit (Node 24)-2           ] ⭐ Run Main upload reports
[tests/unit (Node 22)-1           ]   | Multiple search paths detected. Calculating the least common ancestor of all paths
[tests/unit (Node 22)-1           ]   | The least common ancestor is …/labflow-lite. This will be the root directory of the artifact
[tests/unit (Node 22)-1           ]   | With the provided path, there will be 37 files uploaded
[tests/unit (Node 22)-1           ]   | Artifact name is valid!
[tests/unit (Node 22)-1           ]   | Root directory input is valid!
[tests/unit (Node 22)-1           ]   | Beginning upload of artifact content to blob storage
[tests/unit (Node 22)-1           ]   | Uploaded bytes 97139
[tests/unit (Node 22)-1           ]   | Finished uploading artifact content to blob storage!
[tests/unit (Node 22)-1           ]   | SHA256 digest of uploaded artifact zip is 1303df5590aeb36824e1a662509512565cb481ecd9e9f950d0b748d4024ba02d
[tests/unit (Node 22)-1           ]   | Finalizing artifact upload
[tests/unit (Node 22)-1           ]   | Artifact unit-reports-node22.zip successfully finalized. Artifact ID 3787520504
[tests/unit (Node 22)-1           ]   | Artifact unit-reports-node22 has been successfully uploaded! Final size is 97139 bytes. Artifact ID is 3787520504
[tests/unit (Node 22)-1           ]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/3787520504
[tests/unit (Node 22)-1           ]   ✅  Success - Main upload reports [1.795412167s]
[tests/unit (Node 22)-1           ]   ⚙  ::set-output:: artifact-digest=1303df5590aeb36824e1a662509512565cb481ecd9e9f950d0b748d4024ba02d
[tests/unit (Node 22)-1           ]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/3787520504
[tests/unit (Node 22)-1           ]   ⚙  ::set-output:: artifact-id=3787520504
[tests/unit (Node 22)-1           ] ⭐ Run Complete job
[tests/unit (Node 22)-1           ]   ✅  Success - Complete job
[tests/unit (Node 22)-1           ] 🏁  Job failed
[tests/unit (Node 24)-2           ]   | Multiple search paths detected. Calculating the least common ancestor of all paths
[tests/unit (Node 24)-2           ]   | The least common ancestor is …/labflow-lite. This will be the root directory of the artifact
[tests/unit (Node 24)-2           ]   | With the provided path, there will be 37 files uploaded
[tests/unit (Node 24)-2           ]   | Artifact name is valid!
[tests/unit (Node 24)-2           ]   | Root directory input is valid!
[tests/unit (Node 24)-2           ]   | Beginning upload of artifact content to blob storage
[tests/unit (Node 24)-2           ]   | Uploaded bytes 97196
[tests/unit (Node 24)-2           ]   | Finished uploading artifact content to blob storage!
[tests/unit (Node 24)-2           ]   | SHA256 digest of uploaded artifact zip is 08e226d771083c43fc0d836c460c3f010755f1f916e398741905485f583779da
[tests/unit (Node 24)-2           ]   | Finalizing artifact upload
[tests/unit (Node 24)-2           ]   | Artifact unit-reports-node24.zip successfully finalized. Artifact ID 3888186218
[tests/unit (Node 24)-2           ]   | Artifact unit-reports-node24 has been successfully uploaded! Final size is 97196 bytes. Artifact ID is 3888186218
[tests/unit (Node 24)-2           ]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/3888186218
[tests/unit (Node 24)-2           ]   ✅  Success - Main upload reports [1.032956083s]
[tests/unit (Node 24)-2           ]   ⚙  ::set-output:: artifact-id=3888186218
[tests/unit (Node 24)-2           ]   ⚙  ::set-output:: artifact-digest=08e226d771083c43fc0d836c460c3f010755f1f916e398741905485f583779da
[tests/unit (Node 24)-2           ]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/3888186218
[tests/unit (Node 24)-2           ] ⭐ Run Complete job
[tests/unit (Node 24)-2           ]   ✅  Success - Complete job
[tests/unit (Node 24)-2           ] 🏁  Job failed
[tests/e2e (Chromium)             ]   | libcairo2 is already the newest version (1.18.0-3build1).
[tests/e2e (Chromium)             ]   | libcairo2 set to manually installed.
[tests/e2e (Chromium)             ]   | libdbus-1-3 is already the newest version (1.14.10-4ubuntu4.1).
[tests/e2e (Chromium)             ]   | libdbus-1-3 set to manually installed.
[tests/e2e (Chromium)             ]   | libpango-1.0-0 is already the newest version (1.52.1+ds-1build1).
[tests/e2e (Chromium)             ]   | libpango-1.0-0 set to manually installed.
[tests/e2e (Chromium)             ]   | libxcb1 is already the newest version (1.15-1ubuntu2).
[tests/e2e (Chromium)             ]   | libxcb1 set to manually installed.
[tests/e2e (Chromium)             ]   | libxext6 is already the newest version (2:1.3.4-1build2).
[tests/e2e (Chromium)             ]   | libxext6 set to manually installed.
[tests/e2e (Chromium)             ]   | libfontconfig1 is already the newest version (2.15.0-1.1ubuntu2).
[tests/e2e (Chromium)             ]   | libfontconfig1 set to manually installed.
[tests/e2e (Chromium)             ]   | The following additional packages will be installed:
[tests/e2e (Chromium)             ]   |   at-spi2-common gir1.2-glib-2.0 gir1.2-glib-2.0-dev libasound2-data
[tests/e2e (Chromium)             ]   |   libavahi-client3 libavahi-common-data libavahi-common3 libdrm-amdgpu1
[tests/e2e (Chromium)             ]   |   libdrm-common libfontenc1 libfreetype-dev libgirepository-2.0-0 libgl1
[tests/e2e (Chromium)             ]   |   libgl1-mesa-dri libglib2.0-bin libglib2.0-data libglib2.0-dev
[tests/e2e (Chromium)             ]   |   libglib2.0-dev-bin libglvnd0 libglx-mesa0 libglx0 libllvm20
[tests/e2e (Chromium)             ]   |   libsensors-config libsensors5 libvulkan1 libx11-data libx11-dev libx11-xcb1
[tests/e2e (Chromium)             ]   |   libxaw7 libxcb-dri3-0 libxcb-glx0 libxcb-present0 libxcb-randr0 libxcb-sync1
[tests/e2e (Chromium)             ]   |   libxcb-xfixes0 libxfont2 libxi6 libxkbfile1 libxmu6 libxmuu1 libxpm4
[tests/e2e (Chromium)             ]   |   libxshmfence1 libxxf86vm1 mesa-libgallium x11-xkb-utils xauth
[tests/e2e (Chromium)             ]   |   xfonts-encodings xfonts-utils xkb-data xserver-common
[tests/e2e (Chromium)             ]   | Suggested packages:
[tests/e2e (Chromium)             ]   |   alsa-utils libasound2-plugins cups-common freetype2-doc low-memory-monitor
[tests/e2e (Chromium)             ]   |   libglib2.0-doc libxml2-utils lm-sensors libx11-doc
[tests/e2e (Chromium)             ]   | Recommended packages:
[tests/e2e (Chromium)             ]   |   fonts-ipafont-mincho fonts-liberation-sans-narrow fonts-tlwg-loma
[tests/e2e (Chromium)             ]   |   alsa-ucm-conf alsa-topology-conf at-spi2-core xdg-user-dirs
[tests/e2e (Chromium)             ]   |   mesa-vulkan-drivers | vulkan-icd xfonts-base
[tests/e2e (Chromium)             ]   | The following NEW packages will be installed:
[tests/e2e (Chromium)             ]   |   at-spi2-common fonts-freefont-ttf fonts-ipafont-gothic fonts-liberation
[tests/e2e (Chromium)             ]   |   fonts-noto-color-emoji fonts-tlwg-loma-otf fonts-unifont fonts-wqy-zenhei
[tests/e2e (Chromium)             ]   |   libasound2-data libasound2t64 libatk-bridge2.0-0t64 libatk1.0-0t64
[tests/e2e (Chromium)             ]   |   libatspi2.0-0t64 libavahi-client3 libavahi-common-data libavahi-common3
[tests/e2e (Chromium)             ]   |   libcups2t64 libdrm-amdgpu1 libdrm-common libdrm2 libfontenc1 libgbm1 libgl1
[tests/e2e (Chromium)             ]   |   libgl1-mesa-dri libglvnd0 libglx-mesa0 libglx0 libllvm20 libnspr4 libnss3
[tests/e2e (Chromium)             ]   |   libsensors-config libsensors5 libvulkan1 libx11-xcb1 libxaw7 libxcb-dri3-0
[tests/e2e (Chromium)             ]   |   libxcb-glx0 libxcb-present0 libxcb-randr0 libxcb-sync1 libxcb-xfixes0
[tests/e2e (Chromium)             ]   |   libxcomposite1 libxdamage1 libxfixes3 libxfont2 libxi6 libxkbcommon0
[tests/e2e (Chromium)             ]   |   libxkbfile1 libxmu6 libxmuu1 libxpm4 libxrandr2 libxshmfence1 libxxf86vm1
[tests/e2e (Chromium)             ]   |   mesa-libgallium x11-xkb-utils xauth xfonts-cyrillic xfonts-encodings
[tests/e2e (Chromium)             ]   |   xfonts-scalable xfonts-utils xkb-data xserver-common xvfb
[tests/e2e (Chromium)             ]   | The following packages will be upgraded:
[tests/e2e (Chromium)             ]   |   gir1.2-glib-2.0 gir1.2-glib-2.0-dev libfreetype-dev libfreetype6
[tests/e2e (Chromium)             ]   |   libgirepository-2.0-0 libglib2.0-0t64 libglib2.0-bin libglib2.0-data
[tests/e2e (Chromium)             ]   |   libglib2.0-dev libglib2.0-dev-bin libx11-6 libx11-data libx11-dev
[tests/e2e (Chromium)             ]   | 13 upgraded, 64 newly installed, 0 to remove and 141 not upgraded.
[tests/e2e (Chromium)             ]   | debconf: delaying package configuration, since apt-utils is not installed
(Reading database ... 5%
(Reading database ... 10%
(Reading database ... 15%
(Reading database ... 20%
(Reading database ... 25%
(Reading database ... 30%
(Reading database ... 35%
(Reading database ... 40%
(Reading database ... 45%
(Reading database ... 50%
(Reading database ... 55%
(Reading database ... 60%
(Reading database ... 65%
(Reading database ... 70%
(Reading database ... 75%
(Reading database ... 80%
(Reading database ... 85%
(Reading database ... 90%
(Reading database ... 95%
(Reading database ... 100%
(Reading database ... 26166 files and directories currently installed.)
[tests/e2e (Chromium)             ]   | No schema files found: doing nothing.
[tests/e2e (Chromium)             ]   | update-alternatives: using /usr/share/fonts/opentype/ipafont-gothic/ipag.ttf to provide /usr/share/fonts/truetype/fonts-japanese-gothic.ttf (fonts-japanese-gothic.ttf) in auto mode
[tests/e2e (Chromium)             ]   | |                                                                                |   0% of 190.5 MiB
[tests/e2e (Chromium)             ]   | Chrome for Testing 156.0.8078.4 (playwright chromium v1248) downloaded to /root/.cache/ms-playwright/chromium-1248
[tests/e2e (Chromium)             ]   | |                                                                                |   0% of 1.9 MiB
[tests/e2e (Chromium)             ]   | FFmpeg (playwright ffmpeg v1013) downloaded to /root/.cache/ms-playwright/ffmpeg-1013
[tests/e2e (Chromium)             ]   | |                                                                                |   0% of 119.9 MiB
[tests/e2e (Chromium)             ]   | Chrome Headless Shell 156.0.8078.4 (playwright chromium-headless-shell v1248) downloaded to /root/.cache/ms-playwright/chromium_headless_shell-1248
[tests/e2e (Chromium)             ]   ✅  Success - Main npx playwright install --with-deps chromium [5m37.10429025s]
[tests/e2e (Chromium)             ] ⭐ Run Main npm run test:e2e
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | > labflow-lite@1.0.0 test:e2e
[tests/e2e (Chromium)             ]   | > playwright test e2e/ --project=chromium
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | Running 9 tests using 5 workers
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |   ✘  7 [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (6.1s)
[tests/e2e (Chromium)             ]   |   ✘  10 [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (retry #1) (5.4s)
[tests/e2e (Chromium)             ]   |   ✘  11 [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed (retry #2) (5.2s)
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   ❗  ::error file=e2e/dat-phong.spec.js,title=[chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed,line=12,col=44::  1) [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed ────%0A    Error: expect(locator).toHaveText(expected) failed%0A%0A    Locator:  getByRole('status')%0A    Expected: "Booked. See you in QA-156."%0A    Received: "Booked."%0A    Timeout:  5000ms%0A%0A    Call log:%0A      - Expect "toHaveText" getByRole('status') with timeout 5000ms%0A      - waiting for getByRole('status')%0A        14 × locator resolved to <p role="status">Booked.</p>%0A           - unexpected value "Booked."%0A%0A%0A      10 |     await page.goto('/');%0A      11 |     await book(page, { lab });%0A    > 12 |     await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');%0A         |                                            ^%0A      13 |   });%0A      14 |%0A      15 |   test('31 seats waits for approval', async ({ page }, testInfo) => {%0A        at …/labflow-lite/e2e/dat-phong.spec.js:12:44
[tests/e2e (Chromium)             ]   ❗  ::error file=e2e/dat-phong.spec.js,title=[chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed,line=12,col=44::  1) [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed ────%0A%0A    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────%0A    Error: expect(locator).toHaveText(expected) failed%0A%0A    Locator:  getByRole('status')%0A    Expected: "Booked. See you in QA-635."%0A    Received: "Booked."%0A    Timeout:  5000ms%0A%0A    Call log:%0A      - Expect "toHaveText" getByRole('status') with timeout 5000ms%0A      - waiting for getByRole('status')%0A        14 × locator resolved to <p role="status">Booked.</p>%0A           - unexpected value "Booked."%0A%0A%0A      10 |     await page.goto('/');%0A      11 |     await book(page, { lab });%0A    > 12 |     await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');%0A         |                                            ^%0A      13 |   });%0A      14 |%0A      15 |   test('31 seats waits for approval', async ({ page }, testInfo) => {%0A        at …/labflow-lite/e2e/dat-phong.spec.js:12:44
[tests/e2e (Chromium)             ]   ❗  ::error file=e2e/dat-phong.spec.js,title=[chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed,line=12,col=44::  1) [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed ────%0A%0A    Retry #2 ───────────────────────────────────────────────────────────────────────────────────────%0A    Error: expect(locator).toHaveText(expected) failed%0A%0A    Locator:  getByRole('status')%0A    Expected: "Booked. See you in QA-136."%0A    Received: "Booked."%0A    Timeout:  5000ms%0A%0A    Call log:%0A      - Expect "toHaveText" getByRole('status') with timeout 5000ms%0A      - waiting for getByRole('status')%0A        14 × locator resolved to <p role="status">Booked.</p>%0A           - unexpected value "Booked."%0A%0A%0A      10 |     await page.goto('/');%0A      11 |     await book(page, { lab });%0A    > 12 |     await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');%0A         |                                            ^%0A      13 |   });%0A      14 |%0A      15 |   test('31 seats waits for approval', async ({ page }, testInfo) => {%0A        at …/labflow-lite/e2e/dat-phong.spec.js:12:44
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |   1) [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed ────
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Error: expect(locator).toHaveText(expected) failed
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Locator:  getByRole('status')
[tests/e2e (Chromium)             ]   |     Expected: "Booked. See you in QA-156."
[tests/e2e (Chromium)             ]   |     Received: "Booked."
[tests/e2e (Chromium)             ]   |     Timeout:  5000ms
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Call log:
[tests/e2e (Chromium)             ]   |       - Expect "toHaveText" getByRole('status') with timeout 5000ms
[tests/e2e (Chromium)             ]   |       - waiting for getByRole('status')
[tests/e2e (Chromium)             ]   |         14 × locator resolved to <p role="status">Booked.</p>
[tests/e2e (Chromium)             ]   |            - unexpected value "Booked."
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |       10 |     await page.goto('/');
[tests/e2e (Chromium)             ]   |       11 |     await book(page, { lab });
[tests/e2e (Chromium)             ]   |     > 12 |     await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');
[tests/e2e (Chromium)             ]   |          |                                            ^
[tests/e2e (Chromium)             ]   |       13 |   });
[tests/e2e (Chromium)             ]   |       14 |
[tests/e2e (Chromium)             ]   |       15 |   test('31 seats waits for approval', async ({ page }, testInfo) => {
[tests/e2e (Chromium)             ]   |         at …/labflow-lite/e2e/dat-phong.spec.js:12:44
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Error Context: test-results/e2e-dat-phong-as-student-a-45040-a-lab-and-sees-it-confirmed-chromium/error-context.md
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Retry #1 ───────────────────────────────────────────────────────────────────────────────────────
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Error: expect(locator).toHaveText(expected) failed
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Locator:  getByRole('status')
[tests/e2e (Chromium)             ]   |     Expected: "Booked. See you in QA-635."
[tests/e2e (Chromium)             ]   |     Received: "Booked."
[tests/e2e (Chromium)             ]   |     Timeout:  5000ms
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Call log:
[tests/e2e (Chromium)             ]   |       - Expect "toHaveText" getByRole('status') with timeout 5000ms
[tests/e2e (Chromium)             ]   |       - waiting for getByRole('status')
[tests/e2e (Chromium)             ]   |         14 × locator resolved to <p role="status">Booked.</p>
[tests/e2e (Chromium)             ]   |            - unexpected value "Booked."
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |       10 |     await page.goto('/');
[tests/e2e (Chromium)             ]   |       11 |     await book(page, { lab });
[tests/e2e (Chromium)             ]   |     > 12 |     await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');
[tests/e2e (Chromium)             ]   |          |                                            ^
[tests/e2e (Chromium)             ]   |       13 |   });
[tests/e2e (Chromium)             ]   |       14 |
[tests/e2e (Chromium)             ]   |       15 |   test('31 seats waits for approval', async ({ page }, testInfo) => {
[tests/e2e (Chromium)             ]   |         at …/labflow-lite/e2e/dat-phong.spec.js:12:44
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Error Context: test-results/e2e-dat-phong-as-student-a-45040-a-lab-and-sees-it-confirmed-chromium-retry1/error-context.md
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
[tests/e2e (Chromium)             ]   |     test-results/e2e-dat-phong-as-student-a-45040-a-lab-and-sees-it-confirmed-chromium-retry1/trace.zip
[tests/e2e (Chromium)             ]   |     Usage:
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |         npx playwright show-trace test-results/e2e-dat-phong-as-student-a-45040-a-lab-and-sees-it-confirmed-chromium-retry1/trace.zip
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     ────────────────────────────────────────────────────────────────────────────────────────────────
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Retry #2 ───────────────────────────────────────────────────────────────────────────────────────
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Error: expect(locator).toHaveText(expected) failed
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Locator:  getByRole('status')
[tests/e2e (Chromium)             ]   |     Expected: "Booked. See you in QA-136."
[tests/e2e (Chromium)             ]   |     Received: "Booked."
[tests/e2e (Chromium)             ]   |     Timeout:  5000ms
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Call log:
[tests/e2e (Chromium)             ]   |       - Expect "toHaveText" getByRole('status') with timeout 5000ms
[tests/e2e (Chromium)             ]   |       - waiting for getByRole('status')
[tests/e2e (Chromium)             ]   |         14 × locator resolved to <p role="status">Booked.</p>
[tests/e2e (Chromium)             ]   |            - unexpected value "Booked."
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |       10 |     await page.goto('/');
[tests/e2e (Chromium)             ]   |       11 |     await book(page, { lab });
[tests/e2e (Chromium)             ]   |     > 12 |     await expect(page.getByRole('status')).toHaveText('Booked. See you in ' + lab + '.');
[tests/e2e (Chromium)             ]   |          |                                            ^
[tests/e2e (Chromium)             ]   |       13 |   });
[tests/e2e (Chromium)             ]   |       14 |
[tests/e2e (Chromium)             ]   |       15 |   test('31 seats waits for approval', async ({ page }, testInfo) => {
[tests/e2e (Chromium)             ]   |         at …/labflow-lite/e2e/dat-phong.spec.js:12:44
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |     Error Context: test-results/e2e-dat-phong-as-student-a-45040-a-lab-and-sees-it-confirmed-chromium-retry2/error-context.md
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |   1 failed
[tests/e2e (Chromium)             ]   |     [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed ─────
[tests/e2e (Chromium)             ]   |   8 passed (21.5s)
[tests/e2e (Chromium)             ]   ❓  ::notice title=🎭 Playwright Run Summary::  1 failed%0A    [chromium] › e2e/dat-phong.spec.js:8:3 › as student an › books a lab and sees it confirmed ─────%0A  8 passed (21.5s)
[tests/e2e (Chromium)             ]   ❌  Failure - Main npm run test:e2e [22.31516425s]
[tests/e2e (Chromium)             ] exitcode '1': failure
[tests/e2e (Chromium)             ] ⭐ Run Main upload Playwright report
[tests/e2e (Chromium)             ]   | With the provided path, there will be 23 files uploaded
[tests/e2e (Chromium)             ]   | Artifact name is valid!
[tests/e2e (Chromium)             ]   | Root directory input is valid!
[tests/e2e (Chromium)             ]   | Beginning upload of artifact content to blob storage
[tests/e2e (Chromium)             ]   | Uploaded bytes 762121
[tests/e2e (Chromium)             ]   | Finished uploading artifact content to blob storage!
[tests/e2e (Chromium)             ]   | SHA256 digest of uploaded artifact zip is ffcb26679f383eb1e052a95e8cff91e93984e82eb699de828801442f0264dbe6
[tests/e2e (Chromium)             ]   | Finalizing artifact upload
[tests/e2e (Chromium)             ]   | Artifact playwright-report.zip successfully finalized. Artifact ID 61284767
[tests/e2e (Chromium)             ]   | Artifact playwright-report has been successfully uploaded! Final size is 762121 bytes. Artifact ID is 61284767
[tests/e2e (Chromium)             ]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/61284767
[tests/e2e (Chromium)             ]   ✅  Success - Main upload Playwright report [1.475632458s]
[tests/e2e (Chromium)             ]   ⚙  ::set-output:: artifact-id=61284767
[tests/e2e (Chromium)             ]   ⚙  ::set-output:: artifact-digest=ffcb26679f383eb1e052a95e8cff91e93984e82eb699de828801442f0264dbe6
[tests/e2e (Chromium)             ]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/61284767
[tests/e2e (Chromium)             ] ⭐ Run Complete job
[tests/e2e (Chromium)             ]   ✅  Success - Complete job
[tests/e2e (Chromium)             ] 🏁  Job failed
[tests/ci-ok                      ] ⭐ Run Set up job
[tests/ci-ok                      ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/ci-ok                      ]   ✅  Success - Set up job
[tests/ci-ok                      ] ⭐ Run Main actions/checkout@v4
[tests/ci-ok                      ]   ✅  Success - Main actions/checkout@v4 [404.071959ms]
[tests/ci-ok                      ] ⭐ Run Main every required job passed?
[tests/ci-ok                      ]   | ✘ unit: failure
[tests/ci-ok                      ]   | ✔ integration: success
[tests/ci-ok                      ]   | ✘ e2e: failure
[tests/ci-ok                      ]   ❗  ::error title=ci-ok::Do not merge — unit: failure, e2e: failure
[tests/ci-ok                      ]   ❌  Failure - Main every required job passed? [88.047417ms]
[tests/ci-ok                      ] exitcode '1': failure
[tests/ci-ok                      ] ⭐ Run Complete job
[tests/ci-ok                      ]   ✅  Success - Complete job
[tests/ci-ok                      ] 🏁  Job failed
Error: Job 'quarantine (report only)' failed
act exit: 1
wall time: 414 s`,
  '92-junit': `$ git switch -q pr/tin-ngan && npx vitest run --config vitest.web.config.js web/ --reporter=dot --reporter=junit --outputFile.junit=reports/junit-web.xml; grep -c '<testcase' reports/junit-web.xml; grep -A4 '<failure' reports/junit-web.xml; git switch -q main

 RUN  v5.0.5 …/labflow-lite

·····x··········

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  web/BookingForm.test.jsx > BookingForm > sends what the user typed, once, and says it is booked
Error: expect(element).toHaveTextContent()

Expected element to have text content:
  Booked. See you in BE-201.
Received:
  Booked.
 ❯ web/BookingForm.test.jsx:28:47
     26|     await book();
     27|     expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ lab: 'BE-201', …
     28|     expect(await screen.findByRole('status')).toHaveTextContent('Booke…
       |                                               ^
     29|   });
     30|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 15 passed (16)
   Start at  08:29:30
   Duration  2.09s (environment 44%, tests 41%, setup 9%, import 3%, transform 3%)

JUNIT report written to …/labflow-lite/reports/junit-web.xml
16
            <failure message="expect(element).toHaveTextContent()

Expected element to have text content:
  Booked. See you in BE-201.
Received:`,
  '92-th': `$ unzip -q -o .act/saved/playwright-report.zip -d .act/report && ls .act/report/data; grep -h -E "^- Location|^Expected|^Received|status:" .act/report/data/*.md
4e3e8ea0de29f774c01a3adc069ffb1d1d53d4fb.zip
7b92e3650159fb602663235272fdc5814de6aca3.md
bc74ace8a1cfeccb737f0ff2ef39149036bf73e8.md
d0ce91418c88581d4c699fb65ad7a89d59432ccd.md
- Location: e2e/dat-phong.spec.js:8:3
Expected: "Booked. See you in QA-635."
Received: "Booked."
- status: Booked.
- Location: e2e/dat-phong.spec.js:8:3
Expected: "Booked. See you in QA-156."
Received: "Booked."
- status: Booked.
- Location: e2e/dat-phong.spec.js:8:3
Expected: "Booked. See you in QA-136."
Received: "Booked."
- status: Booked.`,
  '92-tom-tat': `$ git switch -q pr/tin-ngan && act pull_request -j unit -e demo9/pr-event.json --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"; git switch -q main
time="2026-11-01T08:28:33+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:28:33+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[tests/unit (Node 22)-1] ⭐ Run Set up job
[tests/unit (Node 22)-1] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit (Node 24)-2] ⭐ Run Set up job
[tests/unit (Node 24)-2] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit (Node 22)-1]   ✅  Success - Set up job
[tests/unit (Node 24)-2]   ✅  Success - Set up job
[tests/unit (Node 22)-1] 🧪  Matrix: map[node:22]
[tests/unit (Node 22)-1] ⭐ Run Main actions/checkout@v4
[tests/unit (Node 22)-1]   ✅  Success - Main actions/checkout@v4 [309.215584ms]
[tests/unit (Node 22)-1] ⭐ Run Main actions/setup-node@v4
[tests/unit (Node 24)-2] 🧪  Matrix: map[node:24]
[tests/unit (Node 24)-2] ⭐ Run Main actions/checkout@v4
[tests/unit (Node 24)-2]   ✅  Success - Main actions/checkout@v4 [359.056208ms]
[tests/unit (Node 24)-2] ⭐ Run Main actions/setup-node@v4
[tests/unit (Node 22)-1]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/unit (Node 22)-1]   ❓  ::group::Environment details
[tests/unit (Node 22)-1]   | node: v22.23.4
[tests/unit (Node 22)-1]   | npm: 10.9.9
[tests/unit (Node 22)-1]   | yarn: 
[tests/unit (Node 22)-1]   ❓  ::endgroup::
[tests/unit (Node 22)-1]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/unit (Node 22)-1]   | /root/.npm
[tests/unit (Node 22)-1]   ⚙  ***
[tests/unit (Node 22)-1]   | Cache Size: ~55 MB (57741772 B)
[tests/unit (Node 24)-2]   | Found in cache @ /opt/hostedtoolcache/node/24.22.2/arm64
[tests/unit (Node 24)-2]   ❓  ::group::Environment details
[tests/unit (Node 24)-2]   | node: v24.22.2
[tests/unit (Node 24)-2]   | npm: 11.19.1
[tests/unit (Node 24)-2]   | yarn: 
[tests/unit (Node 24)-2]   ❓  ::endgroup::
[tests/unit (Node 24)-2]   | [command]/opt/hostedtoolcache/node/24.22.2/arm64/bin/npm config get cache
[tests/unit (Node 22)-1]   | Cache restored successfully
[tests/unit (Node 22)-1]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit (Node 22)-1]   ✅  Success - Main actions/setup-node@v4 [4.140355167s]
[tests/unit (Node 22)-1]   ⚙  ::set-output:: node-version=v22.23.4
[tests/unit (Node 22)-1]   ⚙  ::set-output:: cache-hit=true
[tests/unit (Node 22)-1]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/unit (Node 24)-2]   | /root/.npm
[tests/unit (Node 22)-1] ⭐ Run Main npm ci
[tests/unit (Node 24)-2]   ⚙  ***
[tests/unit (Node 24)-2]   | Cache Size: ~55 MB (57741772 B)
[tests/unit (Node 24)-2]   | Cache restored successfully
[tests/unit (Node 24)-2]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit (Node 24)-2]   ✅  Success - Main actions/setup-node@v4 [3.799262166s]
[tests/unit (Node 24)-2]   ⚙  ::set-output:: node-version=v24.22.2
[tests/unit (Node 24)-2]   ⚙  ::set-output:: cache-hit=true
[tests/unit (Node 24)-2]   ⚙  ::add-path:: /opt/hostedtoolcache/node/24.22.2/arm64/bin
[tests/unit (Node 24)-2] ⭐ Run Main npm ci
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | added 568 packages, and audited 569 packages in 19s
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | 123 packages are looking for funding
[tests/unit (Node 22)-1]   |   run \`npm fund\` for details
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | To address issues that do not require attention, run:
[tests/unit (Node 22)-1]   |   npm audit fix
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | To address all issues possible, run:
[tests/unit (Node 22)-1]   |   npm audit fix --force
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | Some issues need review, and may require choosing
[tests/unit (Node 22)-1]   | a different dependency.
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | Run \`npm audit\` for details.
[tests/unit (Node 22)-1]   ✅  Success - Main npm ci [19.552306792s]
[tests/unit (Node 22)-1] ⭐ Run Main unit tests + coverage
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 22)-1]   |       Coverage enabled with v8
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   |  Test Files  20 passed (20)
[tests/unit (Node 22)-1]   |       Tests  175 passed (175)
[tests/unit (Node 22)-1]   |    Start at  01:29:15
[tests/unit (Node 22)-1]   |    Duration  1.17s (transform 42%, import 30%, tests 17%, worker 11%)
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | JSON report written to …/labflow-lite/reports/unit.json
[tests/unit (Node 22)-1]   | JUNIT report written to …/labflow-lite/reports/junit-unit.xml
[tests/unit (Node 22)-1]   |  % Coverage report from v8
[tests/unit (Node 22)-1]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 22)-1]   | File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   
[tests/unit (Node 22)-1]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 22)-1]   | All files        |   97.74 |    90.21 |    97.6 |   98.97 |                     
[tests/unit (Node 22)-1]   |  api             |   91.22 |    80.76 |   93.75 |   95.55 |                     
[tests/unit (Node 22)-1]   |   auth.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   schemas.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   server.js      |   89.58 |    79.16 |   91.66 |   94.44 | 54-56               
[tests/unit (Node 22)-1]   |  auth            |   92.85 |    85.71 |      80 |   92.85 |                     
[tests/unit (Node 22)-1]   |   login-guard.js |   92.85 |    85.71 |      80 |   92.85 | 5                   
[tests/unit (Node 22)-1]   |  booking         |   97.14 |     87.5 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   service.js     |   97.14 |     87.5 |     100 |     100 | 28,52               
[tests/unit (Node 22)-1]   |  ci              |   98.79 |    87.28 |   98.36 |     100 |                     
[tests/unit (Node 22)-1]   |   gate.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   policy.js      |      98 |    85.33 |   97.72 |     100 | ...5,29-31,43,69,77 
[tests/unit (Node 22)-1]   |   shard.js       |     100 |       95 |     100 |     100 | 32                  
[tests/unit (Node 22)-1]   |   summary.js     |     100 |    84.21 |     100 |     100 | 17-29               
[tests/unit (Node 22)-1]   |  lib             |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   mailer.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   retry.js       |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |  notify          |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   notify.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   reminder.js    |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |  rules           |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   booking.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   cancel.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   checkin.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   code.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   days.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   |   time.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 22)-1]   ✅  Success - Main unit tests + coverage [3.201715458s]
[tests/unit (Node 22)-1]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ✅ **20 passes** · 20 total
- **Test Results**: ✅ **175 passes** · 175 total
[tests/unit (Node 22)-1] ⭐ Run Main web tests
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | > labflow-lite@1.0.0 test:web
[tests/unit (Node 22)-1]   | > vitest run --config vitest.web.config.js web/ --reporter=tree --reporter=github-actions --reporter=json --outputFile.json=reports/web.json
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | added 568 packages, and audited 569 packages in 24s
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | 123 packages are looking for funding
[tests/unit (Node 24)-2]   |   run \`npm fund\` for details
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | To address issues that do not require attention, run:
[tests/unit (Node 24)-2]   |   npm audit fix
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | To address all issues possible, run:
[tests/unit (Node 24)-2]   |   npm audit fix --force
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | Some issues need review, and may require choosing
[tests/unit (Node 24)-2]   | a different dependency.
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | Run \`npm audit\` for details.
[tests/unit (Node 24)-2]   ✅  Success - Main npm ci [24.081980375s]
[tests/unit (Node 24)-2] ⭐ Run Main unit tests + coverage
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 24)-2]   |       Coverage enabled with v8
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 22)-1]   |  ❯ web/BookingForm.test.jsx (12 tests | 1 failed) 1983ms
[tests/unit (Node 22)-1]   |    ❯ BookingForm (12)
[tests/unit (Node 22)-1]   |      × sends what the user typed, once, and says it is booked 380ms
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   |  FAIL  web/BookingForm.test.jsx > BookingForm > sends what the user typed, once, and says it is booked
[tests/unit (Node 22)-1]   | Error: expect(element).toHaveTextContent()
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | Expected element to have text content:
[tests/unit (Node 22)-1]   |   Booked. See you in BE-201.
[tests/unit (Node 22)-1]   | Received:
[tests/unit (Node 22)-1]   |   Booked.
[tests/unit (Node 22)-1]   |  ❯ web/BookingForm.test.jsx:28:47
[tests/unit (Node 22)-1]   |      26|     await book();
[tests/unit (Node 22)-1]   |      27|     expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ lab: 'BE-201', …
[tests/unit (Node 22)-1]   |      28|     expect(await screen.findByRole('status')).toHaveTextContent('Booke…
[tests/unit (Node 22)-1]   |        |                                               ^
[tests/unit (Node 22)-1]   |      29|   });
[tests/unit (Node 22)-1]   |      30|
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   |  Test Files  1 failed | 1 passed (2)
[tests/unit (Node 22)-1]   |       Tests  1 failed | 15 passed (16)
[tests/unit (Node 22)-1]   |    Start at  01:29:18
[tests/unit (Node 22)-1]   |    Duration  3.50s (tests 46%, environment 43%, setup 5%, transform 3%, import 2%)
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   ❗  ::error file=…/labflow-lite/web/BookingForm.test.jsx,title=web/BookingForm.test.jsx > BookingForm > sends what the user typed%2C once%2C and says it is booked,line=28,column=47::Error: expect(element).toHaveTextContent()%0A%0AExpected element to have text content:%0A  Booked. See you in BE-201.%0AReceived:%0A  Booked.%0A ❯ web/BookingForm.test.jsx:28:47%0A%0A
[tests/unit (Node 22)-1]   | JSON report written to …/labflow-lite/reports/web.json
[tests/unit (Node 22)-1]   ❌  Failure - Main web tests [4.423500167s]
[tests/unit (Node 22)-1]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ❌ **1 failure** · ✅ **1 pass** · 2 total
- **Test Results**: ❌ **1 failure** · ✅ **15 passes** · 16 total
[tests/unit (Node 22)-1] exitcode '1': failure
[tests/unit (Node 22)-1] ⭐ Run Main summary
[tests/unit (Node 22)-1]   | ## unit (Node 22)
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | ### ❌ 1 of 191 tests failed
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | - \`web/BookingForm.test.jsx\` › BookingForm sends what the user typed, once, and says it is booked — Error: expect(element).toHaveTextContent()
[tests/unit (Node 22)-1]   | 
[tests/unit (Node 22)-1]   | | Coverage | Now | Minimum | |
[tests/unit (Node 22)-1]   | |---|---:|---:|---|
[tests/unit (Node 22)-1]   | | lines | 98.97% | 85% | ✅ |
[tests/unit (Node 22)-1]   | | branches | 90.21% | 80% | ✅ |
[tests/unit (Node 22)-1]   | | functions | 97.60% | 80% | ✅ |
[tests/unit (Node 22)-1]   | | statements | 97.74% | 85% | ✅ |
[tests/unit (Node 22)-1]   ✅  Success - Main summary [356.403125ms]
[tests/unit (Node 22)-1]   ⚙  Summary - ## unit (Node 22)

### ❌ 1 of 191 tests failed

- \`web/BookingForm.test.jsx\` › BookingForm sends what the user typed, once, and says it is booked — Error: expect(element).toHaveTextContent()

| Coverage | Now | Minimum | |
|---|---:|---:|---|
| lines | 98.97% | 85% | ✅ |
| branches | 90.21% | 80% | ✅ |
| functions | 97.60% | 80% | ✅ |
| statements | 97.74% | 85% | ✅ |
[tests/unit (Node 22)-1] ⭐ Run Main upload reports
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   |  Test Files  20 passed (20)
[tests/unit (Node 24)-2]   |       Tests  175 passed (175)
[tests/unit (Node 24)-2]   |    Start at  01:29:21
[tests/unit (Node 24)-2]   |    Duration  1.39s (transform 37%, import 31%, tests 18%, worker 14%)
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | JSON report written to …/labflow-lite/reports/unit.json
[tests/unit (Node 24)-2]   | JUNIT report written to …/labflow-lite/reports/junit-unit.xml
[tests/unit (Node 24)-2]   |  % Coverage report from v8
[tests/unit (Node 24)-2]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 24)-2]   | File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   
[tests/unit (Node 24)-2]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 24)-2]   | All files        |   97.74 |    90.21 |    97.6 |   98.97 |                     
[tests/unit (Node 24)-2]   |  api             |   91.22 |    80.76 |   93.75 |   95.55 |                     
[tests/unit (Node 24)-2]   |   auth.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   schemas.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   server.js      |   89.58 |    79.16 |   91.66 |   94.44 | 54-56               
[tests/unit (Node 24)-2]   |  auth            |   92.85 |    85.71 |      80 |   92.85 |                     
[tests/unit (Node 24)-2]   |   login-guard.js |   92.85 |    85.71 |      80 |   92.85 | 5                   
[tests/unit (Node 24)-2]   |  booking         |   97.14 |     87.5 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   service.js     |   97.14 |     87.5 |     100 |     100 | 28,52               
[tests/unit (Node 24)-2]   |  ci              |   98.79 |    87.28 |   98.36 |     100 |                     
[tests/unit (Node 24)-2]   |   gate.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   policy.js      |      98 |    85.33 |   97.72 |     100 | ...5,29-31,43,69,77 
[tests/unit (Node 24)-2]   |   shard.js       |     100 |       95 |     100 |     100 | 32                  
[tests/unit (Node 24)-2]   |   summary.js     |     100 |    84.21 |     100 |     100 | 17-29               
[tests/unit (Node 24)-2]   |  lib             |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   mailer.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   retry.js       |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |  notify          |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   notify.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   reminder.js    |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |  rules           |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   booking.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   cancel.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   checkin.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   code.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   days.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   |   time.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 24)-2]   ✅  Success - Main unit tests + coverage [2.980426959s]
[tests/unit (Node 24)-2]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ✅ **20 passes** · 20 total
- **Test Results**: ✅ **175 passes** · 175 total
[tests/unit (Node 24)-2] ⭐ Run Main web tests
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | > labflow-lite@1.0.0 test:web
[tests/unit (Node 24)-2]   | > vitest run --config vitest.web.config.js web/ --reporter=tree --reporter=github-actions --reporter=json --outputFile.json=reports/web.json
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 22)-1]   | Multiple search paths detected. Calculating the least common ancestor of all paths
[tests/unit (Node 22)-1]   | The least common ancestor is …/labflow-lite. This will be the root directory of the artifact
[tests/unit (Node 22)-1]   | With the provided path, there will be 38 files uploaded
[tests/unit (Node 22)-1]   | Artifact name is valid!
[tests/unit (Node 22)-1]   | Root directory input is valid!
[tests/unit (Node 22)-1]   | Beginning upload of artifact content to blob storage
[tests/unit (Node 22)-1]   | Uploaded bytes 99315
[tests/unit (Node 22)-1]   | Finished uploading artifact content to blob storage!
[tests/unit (Node 22)-1]   | SHA256 digest of uploaded artifact zip is aa088751441b5eacacf8ed9056e115da44ca62520cba885ecf6e032f00e6cb77
[tests/unit (Node 22)-1]   | Finalizing artifact upload
[tests/unit (Node 22)-1]   | Artifact unit-reports-node22.zip successfully finalized. Artifact ID 3787520504
[tests/unit (Node 22)-1]   | Artifact unit-reports-node22 has been successfully uploaded! Final size is 99315 bytes. Artifact ID is 3787520504
[tests/unit (Node 22)-1]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/3787520504
[tests/unit (Node 22)-1]   ✅  Success - Main upload reports [1.59378875s]
[tests/unit (Node 22)-1]   ⚙  ::set-output:: artifact-id=3787520504
[tests/unit (Node 22)-1]   ⚙  ::set-output:: artifact-digest=aa088751441b5eacacf8ed9056e115da44ca62520cba885ecf6e032f00e6cb77
[tests/unit (Node 22)-1]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/3787520504
[tests/unit (Node 22)-1] ⭐ Run Complete job
[tests/unit (Node 22)-1]   ✅  Success - Complete job
[tests/unit (Node 22)-1] 🏁  Job failed
[tests/unit (Node 24)-2]   |  ❯ web/BookingForm.test.jsx (12 tests | 1 failed) 1598ms
[tests/unit (Node 24)-2]   |    ❯ BookingForm (12)
[tests/unit (Node 24)-2]   |      × sends what the user typed, once, and says it is booked 232ms
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   |  FAIL  web/BookingForm.test.jsx > BookingForm > sends what the user typed, once, and says it is booked
[tests/unit (Node 24)-2]   | Error: expect(element).toHaveTextContent()
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | Expected element to have text content:
[tests/unit (Node 24)-2]   |   Booked. See you in BE-201.
[tests/unit (Node 24)-2]   | Received:
[tests/unit (Node 24)-2]   |   Booked.
[tests/unit (Node 24)-2]   |  ❯ web/BookingForm.test.jsx:28:47
[tests/unit (Node 24)-2]   |      26|     await book();
[tests/unit (Node 24)-2]   |      27|     expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ lab: 'BE-201', …
[tests/unit (Node 24)-2]   |      28|     expect(await screen.findByRole('status')).toHaveTextContent('Booke…
[tests/unit (Node 24)-2]   |        |                                               ^
[tests/unit (Node 24)-2]   |      29|   });
[tests/unit (Node 24)-2]   |      30|
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   |  Test Files  1 failed | 1 passed (2)
[tests/unit (Node 24)-2]   |       Tests  1 failed | 15 passed (16)
[tests/unit (Node 24)-2]   |    Start at  01:29:23
[tests/unit (Node 24)-2]   |    Duration  2.77s (tests 45%, environment 44%, setup 7%, transform 3%, import 2%)
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   ❗  ::error file=…/labflow-lite/web/BookingForm.test.jsx,title=web/BookingForm.test.jsx > BookingForm > sends what the user typed%2C once%2C and says it is booked,line=28,column=47::Error: expect(element).toHaveTextContent()%0A%0AExpected element to have text content:%0A  Booked. See you in BE-201.%0AReceived:%0A  Booked.%0A ❯ web/BookingForm.test.jsx:28:47%0A%0A
[tests/unit (Node 24)-2]   | JSON report written to …/labflow-lite/reports/web.json
[tests/unit (Node 24)-2]   ❌  Failure - Main web tests [3.346207292s]
[tests/unit (Node 24)-2]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ❌ **1 failure** · ✅ **1 pass** · 2 total
- **Test Results**: ❌ **1 failure** · ✅ **15 passes** · 16 total
[tests/unit (Node 24)-2] exitcode '1': failure
[tests/unit (Node 24)-2] ⭐ Run Main summary
[tests/unit (Node 24)-2]   | ## unit (Node 24)
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | ### ❌ 1 of 191 tests failed
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | - \`web/BookingForm.test.jsx\` › BookingForm sends what the user typed, once, and says it is booked — Error: expect(element).toHaveTextContent()
[tests/unit (Node 24)-2]   | 
[tests/unit (Node 24)-2]   | | Coverage | Now | Minimum | |
[tests/unit (Node 24)-2]   | |---|---:|---:|---|
[tests/unit (Node 24)-2]   | | lines | 98.97% | 85% | ✅ |
[tests/unit (Node 24)-2]   | | branches | 90.21% | 80% | ✅ |
[tests/unit (Node 24)-2]   | | functions | 97.60% | 80% | ✅ |
[tests/unit (Node 24)-2]   | | statements | 97.74% | 85% | ✅ |
[tests/unit (Node 24)-2]   ✅  Success - Main summary [253.538583ms]
[tests/unit (Node 24)-2]   ⚙  Summary - ## unit (Node 24)

### ❌ 1 of 191 tests failed

- \`web/BookingForm.test.jsx\` › BookingForm sends what the user typed, once, and says it is booked — Error: expect(element).toHaveTextContent()

| Coverage | Now | Minimum | |
|---|---:|---:|---|
| lines | 98.97% | 85% | ✅ |
| branches | 90.21% | 80% | ✅ |
| functions | 97.60% | 80% | ✅ |
| statements | 97.74% | 85% | ✅ |
[tests/unit (Node 24)-2] ⭐ Run Main upload reports
[tests/unit (Node 24)-2]   | Multiple search paths detected. Calculating the least common ancestor of all paths
[tests/unit (Node 24)-2]   | The least common ancestor is …/labflow-lite. This will be the root directory of the artifact
[tests/unit (Node 24)-2]   | With the provided path, there will be 38 files uploaded
[tests/unit (Node 24)-2]   | Artifact name is valid!
[tests/unit (Node 24)-2]   | Root directory input is valid!
[tests/unit (Node 24)-2]   | Beginning upload of artifact content to blob storage
[tests/unit (Node 24)-2]   | Uploaded bytes 99321
[tests/unit (Node 24)-2]   | Finished uploading artifact content to blob storage!
[tests/unit (Node 24)-2]   | SHA256 digest of uploaded artifact zip is 705873656b6674e4e5e7b340bd4d327ccde885563e1e822a27adf5fd194dcdcb
[tests/unit (Node 24)-2]   | Finalizing artifact upload
[tests/unit (Node 24)-2]   | Artifact unit-reports-node24.zip successfully finalized. Artifact ID 3888186218
[tests/unit (Node 24)-2]   | Artifact unit-reports-node24 has been successfully uploaded! Final size is 99321 bytes. Artifact ID is 3888186218
[tests/unit (Node 24)-2]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/3888186218
[tests/unit (Node 24)-2]   ✅  Success - Main upload reports [2.15570725s]
[tests/unit (Node 24)-2]   ⚙  ::set-output:: artifact-digest=705873656b6674e4e5e7b340bd4d327ccde885563e1e822a27adf5fd194dcdcb
[tests/unit (Node 24)-2]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/3888186218
[tests/unit (Node 24)-2]   ⚙  ::set-output:: artifact-id=3888186218
[tests/unit (Node 24)-2] ⭐ Run Complete job
[tests/unit (Node 24)-2]   ✅  Success - Complete job
[tests/unit (Node 24)-2] 🏁  Job failed
Error: Job 'unit (Node \${{ matrix.node }})' failed
act exit: 1`,
  '92-vitest-flaky': `$ for i in 1 2 3 4 5 6; do GITHUB_ACTIONS=true GITHUB_STEP_SUMMARY=.act/flaky-$i.md npx vitest run demo8/dua-lech.test.js --retry=2 --reporter=github-actions > /dev/null; echo "run $i: exit $?, $(grep -c 'passed on retry' .act/flaky-$i.md) test(s) passed on retry"; done; cat $(grep -l 'passed on retry' .act/flaky-*.md | head -1)
run 1: exit 0, 0 test(s) passed on retry
run 2: exit 0, 0 test(s) passed on retry
run 3: exit 0, 0 test(s) passed on retry
run 4: exit 0, 1 test(s) passed on retry
run 5: exit 0, 0 test(s) passed on retry
run 6: exit 0, 1 test(s) passed on retry
## Vitest Test Report

### Summary

- **Test Files**: ✅ **1 pass** · 1 total
- **Test Results**: ✅ **1 pass** · 1 total

### Flaky Tests

These tests passed only after one or more retries, indicating potential instability.

##### \`demo8/dua-lech.test.js\` (1 flaky tests)

- \`two students book the same slot at once: exactly one wins\` (passed on retry 1 out of 2)`,
  '92-vitest-gh': `$ git switch -q pr/tin-ngan && GITHUB_ACTIONS=true GITHUB_STEP_SUMMARY=.act/tom-tat.md npx vitest run --config vitest.web.config.js web/ --reporter=github-actions; echo; cat .act/tom-tat.md; git switch -q main

::error file=…/labflow-lite/web/BookingForm.test.jsx,title=web/BookingForm.test.jsx > BookingForm > sends what the user typed%2C once%2C and says it is booked,line=28,column=47::Error: expect(element).toHaveTextContent()%0A%0AExpected element to have text content:%0A  Booked. See you in BE-201.%0AReceived:%0A  Booked.%0A ❯ web/BookingForm.test.jsx:28:47%0A%0A

## Vitest Test Report

### Summary

- **Test Files**: ❌ **1 failure** · ✅ **1 pass** · 2 total
- **Test Results**: ❌ **1 failure** · ✅ **15 passes** · 16 total`,
  '92-xanh': `$ T0=$(date +%s); act pull_request -e demo9/pr-event.json --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T08:07:35+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:07:35+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[tests/unit (Node 22)-1           ] ⭐ Run Set up job
[tests/integration (PostgreSQL 17)] ⭐ Run Set up job
[tests/unit (Node 22)-1           ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/quarantine (report only)   ] ⭐ Run Set up job
[tests/e2e (Chromium)             ] ⭐ Run Set up job
[tests/integration (PostgreSQL 17)] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/e2e (Chromium)             ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/quarantine (report only)   ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit (Node 24)-2           ] ⭐ Run Set up job
[tests/unit (Node 24)-2           ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/quarantine (report only)   ]   ✅  Success - Set up job
[tests/e2e (Chromium)             ]   ✅  Success - Set up job
[tests/unit (Node 24)-2           ]   ✅  Success - Set up job
[tests/unit (Node 22)-1           ]   ✅  Success - Set up job
[tests/integration (PostgreSQL 17)] Cleaning up services for job integration (PostgreSQL 17)
[tests/integration (PostgreSQL 17)] Cleaning up network for job integration (PostgreSQL 17), and network name is: act-tests-integration-PostgreSQL-17-5e0f6b3fadeed8a74b9e4958450e417f2d3a94712d4e7353ec7b62f47652e247-integration-network
[tests/quarantine (report only)   ] ⭐ Run Main actions/checkout@v4
[tests/quarantine (report only)   ]   ✅  Success - Main actions/checkout@v4 [314.524209ms]
[tests/quarantine (report only)   ] ⭐ Run Main actions/setup-node@v4
[tests/integration (PostgreSQL 17)] container health of 3b5c4bf8f0b009c4f30ece183e57479ac3632c216609a90f170f4476f178b7e9 (postgres:17) is starting
[tests/integration (PostgreSQL 17)] container health of 3b5c4bf8f0b009c4f30ece183e57479ac3632c216609a90f170f4476f178b7e9 (postgres:17) is healthy
[tests/integration (PostgreSQL 17)]   ✅  Success - Set up job
[tests/quarantine (report only)   ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/quarantine (report only)   ]   ❓  ::group::Environment details
[tests/quarantine (report only)   ]   | node: v22.23.4
[tests/quarantine (report only)   ]   | npm: 10.9.9
[tests/quarantine (report only)   ]   | yarn: 
[tests/quarantine (report only)   ]   ❓  ::endgroup::
[tests/quarantine (report only)   ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/quarantine (report only)   ]   | /root/.npm
[tests/quarantine (report only)   ]   ⚙  ***
[tests/quarantine (report only)   ]   | Cache Size: ~55 MB (57763544 B)
[tests/quarantine (report only)   ]   | Cache restored successfully
[tests/quarantine (report only)   ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/quarantine (report only)   ]   ✅  Success - Main actions/setup-node@v4 [3.488241s]
[tests/quarantine (report only)   ]   ⚙  ::set-output:: node-version=v22.23.4
[tests/quarantine (report only)   ]   ⚙  ::set-output:: cache-hit=true
[tests/quarantine (report only)   ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/quarantine (report only)   ] ⭐ Run Main npm ci
[tests/e2e (Chromium)             ] ⭐ Run Main actions/checkout@v4
[tests/e2e (Chromium)             ]   ✅  Success - Main actions/checkout@v4 [309.030833ms]
[tests/e2e (Chromium)             ] ⭐ Run Main actions/setup-node@v4
[tests/integration (PostgreSQL 17)] ⭐ Run Main actions/checkout@v4
[tests/integration (PostgreSQL 17)]   ✅  Success - Main actions/checkout@v4 [317.008708ms]
[tests/integration (PostgreSQL 17)] ⭐ Run Main actions/setup-node@v4
[tests/unit (Node 24)-2           ] 🧪  Matrix: map[node:24]
[tests/unit (Node 24)-2           ] ⭐ Run Main actions/checkout@v4
[tests/unit (Node 24)-2           ]   ✅  Success - Main actions/checkout@v4 [500.13675ms]
[tests/unit (Node 24)-2           ] ⭐ Run Main actions/setup-node@v4
[tests/unit (Node 22)-1           ] 🧪  Matrix: map[node:22]
[tests/unit (Node 22)-1           ] ⭐ Run Main actions/checkout@v4
[tests/e2e (Chromium)             ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/e2e (Chromium)             ]   ❓  ::group::Environment details
[tests/e2e (Chromium)             ]   | node: v22.23.4
[tests/e2e (Chromium)             ]   | npm: 10.9.9
[tests/e2e (Chromium)             ]   | yarn: 
[tests/e2e (Chromium)             ]   ❓  ::endgroup::
[tests/e2e (Chromium)             ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/unit (Node 22)-1           ]   ✅  Success - Main actions/checkout@v4 [389.294542ms]
[tests/e2e (Chromium)             ]   | /root/.npm
[tests/unit (Node 22)-1           ] ⭐ Run Main actions/setup-node@v4
[tests/e2e (Chromium)             ]   ⚙  ***
[tests/e2e (Chromium)             ]   | Cache Size: ~55 MB (57763544 B)
[tests/integration (PostgreSQL 17)]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/integration (PostgreSQL 17)]   ❓  ::group::Environment details
[tests/integration (PostgreSQL 17)]   | node: v22.23.4
[tests/integration (PostgreSQL 17)]   | npm: 10.9.9
[tests/integration (PostgreSQL 17)]   | yarn: 
[tests/integration (PostgreSQL 17)]   ❓  ::endgroup::
[tests/integration (PostgreSQL 17)]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/integration (PostgreSQL 17)]   | /root/.npm
[tests/integration (PostgreSQL 17)]   ⚙  ***
[tests/e2e (Chromium)             ]   | Cache restored successfully
[tests/e2e (Chromium)             ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/e2e (Chromium)             ]   ✅  Success - Main actions/setup-node@v4 [5.975884666s]
[tests/e2e (Chromium)             ]   ⚙  ::set-output:: node-version=v22.23.4
[tests/e2e (Chromium)             ]   ⚙  ::set-output:: cache-hit=true
[tests/integration (PostgreSQL 17)]   | Cache Size: ~55 MB (57763544 B)
[tests/e2e (Chromium)             ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/e2e (Chromium)             ] ⭐ Run Main npm ci
[tests/unit (Node 22)-1           ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/unit (Node 22)-1           ]   ❓  ::group::Environment details
[tests/unit (Node 24)-2           ]   | Found in cache @ /opt/hostedtoolcache/node/24.22.2/arm64
[tests/unit (Node 24)-2           ]   ❓  ::group::Environment details
[tests/unit (Node 22)-1           ]   | node: v22.23.4
[tests/unit (Node 22)-1           ]   | npm: 10.9.9
[tests/unit (Node 22)-1           ]   | yarn: 
[tests/unit (Node 22)-1           ]   ❓  ::endgroup::
[tests/unit (Node 22)-1           ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/integration (PostgreSQL 17)]   | Cache restored successfully
[tests/integration (PostgreSQL 17)]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration (PostgreSQL 17)]   ✅  Success - Main actions/setup-node@v4 [5.661433333s]
[tests/unit (Node 22)-1           ]   | /root/.npm
[tests/unit (Node 24)-2           ]   | node: v24.22.2
[tests/unit (Node 24)-2           ]   | npm: 11.19.1
[tests/unit (Node 24)-2           ]   | yarn: 
[tests/unit (Node 24)-2           ]   ❓  ::endgroup::
[tests/unit (Node 24)-2           ]   | [command]/opt/hostedtoolcache/node/24.22.2/arm64/bin/npm config get cache
[tests/integration (PostgreSQL 17)]   ⚙  ::set-output:: node-version=v22.23.4
[tests/integration (PostgreSQL 17)]   ⚙  ::set-output:: cache-hit=true
[tests/integration (PostgreSQL 17)]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/unit (Node 22)-1           ]   ⚙  ***
[tests/integration (PostgreSQL 17)] ⭐ Run Main npm ci
[tests/unit (Node 24)-2           ]   | /root/.npm
[tests/unit (Node 24)-2           ]   ⚙  ***
[tests/unit (Node 22)-1           ]   | Cache Size: ~55 MB (57763544 B)
[tests/unit (Node 24)-2           ]   | Cache Size: ~55 MB (57763544 B)
[tests/unit (Node 22)-1           ]   | Cache restored successfully
[tests/unit (Node 22)-1           ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit (Node 22)-1           ]   ✅  Success - Main actions/setup-node@v4 [5.116289583s]
[tests/unit (Node 22)-1           ]   ⚙  ::set-output:: node-version=v22.23.4
[tests/unit (Node 22)-1           ]   ⚙  ::set-output:: cache-hit=true
[tests/unit (Node 22)-1           ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/unit (Node 24)-2           ]   | Cache restored successfully
[tests/unit (Node 24)-2           ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit (Node 22)-1           ] ⭐ Run Main npm ci
[tests/unit (Node 24)-2           ]   ✅  Success - Main actions/setup-node@v4 [6.508069s]
[tests/unit (Node 24)-2           ]   ⚙  ::set-output:: cache-hit=true
[tests/unit (Node 24)-2           ]   ⚙  ::set-output:: node-version=v24.22.2
[tests/unit (Node 24)-2           ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/24.22.2/arm64/bin
[tests/unit (Node 24)-2           ] ⭐ Run Main npm ci
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | added 568 packages, and audited 569 packages in 34s
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | 123 packages are looking for funding
[tests/quarantine (report only)   ]   |   run \`npm fund\` for details
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | To address issues that do not require attention, run:
[tests/quarantine (report only)   ]   |   npm audit fix
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | To address all issues possible, run:
[tests/quarantine (report only)   ]   |   npm audit fix --force
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | Some issues need review, and may require choosing
[tests/quarantine (report only)   ]   | a different dependency.
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | Run \`npm audit\` for details.
[tests/quarantine (report only)   ]   ✅  Success - Main npm ci [34.051940291s]
[tests/quarantine (report only)   ] ⭐ Run Main npm run test:quarantine -- --repeats=9
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | > labflow-lite@1.0.0 test:quarantine
[tests/quarantine (report only)   ]   | > vitest run test/quarantine --tagsFilter=quarantine --repeats=9
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   |  RUN  v5.0.5 …/labflow-lite
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   |  ❯ test/quarantine/double-booking.test.js (1 test | 1 failed) 318ms
[tests/quarantine (report only)   ]   |    × two students book the same slot at once: exactly one wins 317ms (repeat x9)
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   |  FAIL  test/quarantine/double-booking.test.js > two students book the same slot at once: exactly one wins
[tests/quarantine (report only)   ]   |  FAIL  test/quarantine/double-booking.test.js > two students book the same slot at once: exactly one wins
[tests/quarantine (report only)   ]   |  FAIL  test/quarantine/double-booking.test.js > two students book the same slot at once: exactly one wins
[tests/quarantine (report only)   ]   | AssertionError: expected [ 'fulfilled', 'fulfilled' ] to deeply equal [ 'fulfilled', 'rejected' ]
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | - Expected
[tests/quarantine (report only)   ]   | + Received
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   |   [
[tests/quarantine (report only)   ]   |     "fulfilled",
[tests/quarantine (report only)   ]   | -   "rejected",
[tests/quarantine (report only)   ]   | +   "fulfilled",
[tests/quarantine (report only)   ]   |   ]
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   |  ❯ test/quarantine/double-booking.test.js:17:47
[tests/quarantine (report only)   ]   |      15|   const repo = slowRepo();
[tests/quarantine (report only)   ]   |      16|   const results = await Promise.allSettled([bookLab(repo, input), book…
[tests/quarantine (report only)   ]   |      17|   expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'r…
[tests/quarantine (report only)   ]   |        |                                               ^
[tests/quarantine (report only)   ]   |      18| });
[tests/quarantine (report only)   ]   |      19|
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   |  Test Files  1 failed (1)
[tests/quarantine (report only)   ]   |       Tests  1 failed (1)
[tests/quarantine (report only)   ]   |    Start at  01:08:18
[tests/quarantine (report only)   ]   |    Duration  620ms (tests 63%, transform 34%, import 2%, worker 1%)
[tests/quarantine (report only)   ]   | 
[tests/quarantine (report only)   ]   ❌  Failure - Main npm run test:quarantine -- --repeats=9 [1.306204709s]
[tests/quarantine (report only)   ] exitcode '1': failure
[tests/quarantine (report only)   ] ⭐ Run Complete job
[tests/quarantine (report only)   ]   ✅  Success - Complete job
[tests/quarantine (report only)   ] 🏁  Job failed
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | added 568 packages, and audited 569 packages in 38s
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | 123 packages are looking for funding
[tests/integration (PostgreSQL 17)]   |   run \`npm fund\` for details
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | To address issues that do not require attention, run:
[tests/integration (PostgreSQL 17)]   |   npm audit fix
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | To address all issues possible, run:
[tests/integration (PostgreSQL 17)]   |   npm audit fix --force
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | Some issues need review, and may require choosing
[tests/integration (PostgreSQL 17)]   | a different dependency.
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | Run \`npm audit\` for details.
[tests/integration (PostgreSQL 17)]   ✅  Success - Main npm ci [38.159708583s]
[tests/integration (PostgreSQL 17)] ⭐ Run Main npm run test:int -- test/integration --reporter=tree --reporter=github-actions
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | > labflow-lite@1.0.0 test:int
[tests/integration (PostgreSQL 17)]   | > vitest run --config vitest.integration.config.js test/integration --reporter=tree --reporter=github-actions
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   |  RUN  v5.0.5 …/labflow-lite
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   |  Test Files  1 passed (1)
[tests/integration (PostgreSQL 17)]   |       Tests  11 passed (11)
[tests/integration (PostgreSQL 17)]   |    Start at  01:08:33
[tests/integration (PostgreSQL 17)]   |    Duration  1.25s (transform 46%, tests 43%, import 10%, worker 1%)
[tests/integration (PostgreSQL 17)]   | 
[tests/integration (PostgreSQL 17)]   ✅  Success - Main npm run test:int -- test/integration --reporter=tree --reporter=github-actions [1.962559708s]
[tests/integration (PostgreSQL 17)]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ✅ **1 pass** · 1 total
- **Test Results**: ✅ **11 passes** · 11 total
[tests/integration (PostgreSQL 17)] ⭐ Run Post actions/setup-node@v4
[tests/integration (PostgreSQL 17)]   | Cache Size: ~55 MB (57770940 B)
[tests/integration (PostgreSQL 17)]   | Cache saved successfully
[tests/integration (PostgreSQL 17)]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration (PostgreSQL 17)]   ✅  Success - Post actions/setup-node@v4 [1.782683708s]
[tests/integration (PostgreSQL 17)] ⭐ Run Complete job
[tests/integration (PostgreSQL 17)] Cleaning up container for job integration (PostgreSQL 17)
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | added 568 packages, and audited 569 packages in 43s
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | 123 packages are looking for funding
[tests/e2e (Chromium)             ]   |   run \`npm fund\` for details
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | To address issues that do not require attention, run:
[tests/e2e (Chromium)             ]   |   npm audit fix
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | To address all issues possible, run:
[tests/e2e (Chromium)             ]   |   npm audit fix --force
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | Some issues need review, and may require choosing
[tests/e2e (Chromium)             ]   | a different dependency.
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | Run \`npm audit\` for details.
[tests/e2e (Chromium)             ]   ✅  Success - Main npm ci [43.938008583s]
[tests/e2e (Chromium)             ] ⭐ Run Main npx playwright install --with-deps chromium
[tests/e2e (Chromium)             ]   | Installing dependencies...
[tests/integration (PostgreSQL 17)] Cleaning up services for job integration (PostgreSQL 17)
[tests/integration (PostgreSQL 17)] Cleaning up network for job integration (PostgreSQL 17), and network name is: act-tests-integration-PostgreSQL-17-5e0f6b3fadeed8a74b9e4958450e417f2d3a94712d4e7353ec7b62f47652e247-integration-network
[tests/integration (PostgreSQL 17)]   ✅  Success - Complete job
[tests/integration (PostgreSQL 17)] 🏁  Job succeeded
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | added 568 packages, and audited 569 packages in 47s
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | 123 packages are looking for funding
[tests/unit (Node 22)-1           ]   |   run \`npm fund\` for details
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | To address issues that do not require attention, run:
[tests/unit (Node 22)-1           ]   |   npm audit fix
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | To address all issues possible, run:
[tests/unit (Node 22)-1           ]   |   npm audit fix --force
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | Some issues need review, and may require choosing
[tests/unit (Node 22)-1           ]   | a different dependency.
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | Run \`npm audit\` for details.
[tests/unit (Node 22)-1           ]   ✅  Success - Main npm ci [47.060829625s]
[tests/unit (Node 22)-1           ] ⭐ Run Main unit tests + coverage
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | added 568 packages, and audited 569 packages in 48s
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | 123 packages are looking for funding
[tests/unit (Node 24)-2           ]   |   run \`npm fund\` for details
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | To address issues that do not require attention, run:
[tests/unit (Node 24)-2           ]   |   npm audit fix
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | To address all issues possible, run:
[tests/unit (Node 24)-2           ]   |   npm audit fix --force
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | Some issues need review, and may require choosing
[tests/unit (Node 24)-2           ]   | a different dependency.
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | Run \`npm audit\` for details.
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 22)-1           ]   |       Coverage enabled with v8
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 24)-2           ]   ✅  Success - Main npm ci [48.016133333s]
[tests/unit (Node 24)-2           ] ⭐ Run Main unit tests + coverage
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   |  Test Files  20 passed (20)
[tests/unit (Node 22)-1           ]   |       Tests  174 passed (174)
[tests/unit (Node 22)-1           ]   |    Start at  01:08:44
[tests/unit (Node 22)-1           ]   |    Duration  2.14s (transform 46%, import 37%, tests 11%, worker 6%)
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   |     Isolate  20 workers spawned · ~212ms startup each (spawn + environment, per file)
[tests/unit (Node 22)-1           ]   |              at least ~259ms faster with isolate: false — reuses workers across files instead of one per file
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | JSON report written to …/labflow-lite/reports/unit.json
[tests/unit (Node 22)-1           ]   | JUNIT report written to …/labflow-lite/reports/junit-unit.xml
[tests/unit (Node 22)-1           ]   |  % Coverage report from v8
[tests/unit (Node 22)-1           ]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 22)-1           ]   | File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   
[tests/unit (Node 22)-1           ]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 22)-1           ]   | All files        |   97.71 |    90.21 |   97.52 |   98.96 |                     
[tests/unit (Node 22)-1           ]   |  api             |   91.22 |    80.76 |   93.75 |   95.55 |                     
[tests/unit (Node 22)-1           ]   |   auth.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   schemas.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   server.js      |   89.58 |    79.16 |   91.66 |   94.44 | 54-56               
[tests/unit (Node 22)-1           ]   |  auth            |   92.85 |    85.71 |      80 |   92.85 |                     
[tests/unit (Node 22)-1           ]   |   login-guard.js |   92.85 |    85.71 |      80 |   92.85 | 5                   
[tests/unit (Node 22)-1           ]   |  booking         |   97.14 |     87.5 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   service.js     |   97.14 |     87.5 |     100 |     100 | 28,52               
[tests/unit (Node 22)-1           ]   |  ci              |   98.75 |    87.28 |   98.24 |     100 |                     
[tests/unit (Node 22)-1           ]   |   gate.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   policy.js      |      98 |    85.33 |   97.72 |     100 | ...5,29-31,43,69,77 
[tests/unit (Node 22)-1           ]   |   shard.js       |     100 |       95 |     100 |     100 | 32                  
[tests/unit (Node 22)-1           ]   |   summary.js     |     100 |    84.21 |     100 |     100 | 17-29               
[tests/unit (Node 22)-1           ]   |  lib             |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   mailer.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   retry.js       |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |  notify          |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   notify.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   reminder.js    |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |  rules           |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   booking.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   cancel.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   checkin.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   code.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   days.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   |   time.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 22)-1           ]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 24)-2           ]   |       Coverage enabled with v8
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 22)-1           ]   ✅  Success - Main unit tests + coverage [3.343643167s]
[tests/unit (Node 22)-1           ]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ✅ **20 passes** · 20 total
- **Test Results**: ✅ **174 passes** · 174 total
[tests/unit (Node 22)-1           ] ⭐ Run Main web tests
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | > labflow-lite@1.0.0 test:web
[tests/unit (Node 22)-1           ]   | > vitest run --config vitest.web.config.js web/ --reporter=tree --reporter=github-actions
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   |  Test Files  20 passed (20)
[tests/unit (Node 24)-2           ]   |       Tests  174 passed (174)
[tests/unit (Node 24)-2           ]   |    Start at  01:08:46
[tests/unit (Node 24)-2           ]   |    Duration  1.54s (transform 39%, import 35%, tests 16%, worker 10%)
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | JSON report written to …/labflow-lite/reports/unit.json
[tests/unit (Node 24)-2           ]   | JUNIT report written to …/labflow-lite/reports/junit-unit.xml
[tests/unit (Node 24)-2           ]   |  % Coverage report from v8
[tests/unit (Node 24)-2           ]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 24)-2           ]   | File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   
[tests/unit (Node 24)-2           ]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 24)-2           ]   | All files        |   97.71 |    90.21 |   97.52 |   98.96 |                     
[tests/unit (Node 24)-2           ]   |  api             |   91.22 |    80.76 |   93.75 |   95.55 |                     
[tests/unit (Node 24)-2           ]   |   auth.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   schemas.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   server.js      |   89.58 |    79.16 |   91.66 |   94.44 | 54-56               
[tests/unit (Node 24)-2           ]   |  auth            |   92.85 |    85.71 |      80 |   92.85 |                     
[tests/unit (Node 24)-2           ]   |   login-guard.js |   92.85 |    85.71 |      80 |   92.85 | 5                   
[tests/unit (Node 24)-2           ]   |  booking         |   97.14 |     87.5 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   service.js     |   97.14 |     87.5 |     100 |     100 | 28,52               
[tests/unit (Node 24)-2           ]   |  ci              |   98.75 |    87.28 |   98.24 |     100 |                     
[tests/unit (Node 24)-2           ]   |   gate.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   policy.js      |      98 |    85.33 |   97.72 |     100 | ...5,29-31,43,69,77 
[tests/unit (Node 24)-2           ]   |   shard.js       |     100 |       95 |     100 |     100 | 32                  
[tests/unit (Node 24)-2           ]   |   summary.js     |     100 |    84.21 |     100 |     100 | 17-29               
[tests/unit (Node 24)-2           ]   |  lib             |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   mailer.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   retry.js       |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |  notify          |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   notify.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   reminder.js    |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |  rules           |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   booking.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   cancel.js      |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   checkin.js     |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   code.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   days.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   |   time.js        |     100 |      100 |     100 |     100 |                     
[tests/unit (Node 24)-2           ]   | -----------------|---------|----------|---------|---------|---------------------
[tests/unit (Node 24)-2           ]   ✅  Success - Main unit tests + coverage [3.588694584s]
[tests/unit (Node 24)-2           ]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ✅ **20 passes** · 20 total
- **Test Results**: ✅ **174 passes** · 174 total
[tests/unit (Node 24)-2           ] ⭐ Run Main web tests
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | > labflow-lite@1.0.0 test:web
[tests/unit (Node 24)-2           ]   | > vitest run --config vitest.web.config.js web/ --reporter=tree --reporter=github-actions
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   |  Test Files  2 passed (2)
[tests/unit (Node 22)-1           ]   |       Tests  16 passed (16)
[tests/unit (Node 22)-1           ]   |    Start at  01:08:47
[tests/unit (Node 22)-1           ]   |    Duration  3.18s (tests 49%, environment 35%, setup 9%, transform 4%, import 2%)
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   ✅  Success - Main web tests [3.975964709s]
[tests/unit (Node 22)-1           ]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ✅ **2 passes** · 2 total
- **Test Results**: ✅ **16 passes** · 16 total
[tests/unit (Node 22)-1           ] ⭐ Run Main summary
[tests/unit (Node 22)-1           ]   | ## unit (Node 22)
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | ### ✅ 174 of 174 tests passed
[tests/unit (Node 22)-1           ]   | 
[tests/unit (Node 22)-1           ]   | | Coverage | Now | Minimum | |
[tests/unit (Node 22)-1           ]   | |---|---:|---:|---|
[tests/unit (Node 22)-1           ]   | | lines | 98.96% | 85% | ✅ |
[tests/unit (Node 22)-1           ]   | | branches | 90.21% | 80% | ✅ |
[tests/unit (Node 22)-1           ]   | | functions | 97.52% | 80% | ✅ |
[tests/unit (Node 22)-1           ]   | | statements | 97.71% | 85% | ✅ |
[tests/unit (Node 22)-1           ]   ✅  Success - Main summary [243.656125ms]
[tests/unit (Node 22)-1           ]   ⚙  Summary - ## unit (Node 22)

### ✅ 174 of 174 tests passed

| Coverage | Now | Minimum | |
|---|---:|---:|---|
| lines | 98.96% | 85% | ✅ |
| branches | 90.21% | 80% | ✅ |
| functions | 97.52% | 80% | ✅ |
| statements | 97.71% | 85% | ✅ |
[tests/unit (Node 22)-1           ] ⭐ Run Main upload reports
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   |  Test Files  2 passed (2)
[tests/unit (Node 24)-2           ]   |       Tests  16 passed (16)
[tests/unit (Node 24)-2           ]   |    Start at  01:08:49
[tests/unit (Node 24)-2           ]   |    Duration  2.74s (environment 49%, tests 40%, setup 5%, transform 3%, import 2%)
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   ✅  Success - Main web tests [3.315103708s]
[tests/unit (Node 24)-2           ]   ⚙  Summary - ## Vitest Test Report

### Summary

- **Test Files**: ✅ **2 passes** · 2 total
- **Test Results**: ✅ **16 passes** · 16 total
[tests/unit (Node 24)-2           ] ⭐ Run Main summary
[tests/unit (Node 24)-2           ]   | ## unit (Node 24)
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | ### ✅ 174 of 174 tests passed
[tests/unit (Node 24)-2           ]   | 
[tests/unit (Node 24)-2           ]   | | Coverage | Now | Minimum | |
[tests/unit (Node 24)-2           ]   | |---|---:|---:|---|
[tests/unit (Node 24)-2           ]   | | lines | 98.96% | 85% | ✅ |
[tests/unit (Node 24)-2           ]   | | branches | 90.21% | 80% | ✅ |
[tests/unit (Node 24)-2           ]   | | functions | 97.52% | 80% | ✅ |
[tests/unit (Node 24)-2           ]   | | statements | 97.71% | 85% | ✅ |
[tests/unit (Node 24)-2           ]   ✅  Success - Main summary [241.4915ms]
[tests/unit (Node 24)-2           ]   ⚙  Summary - ## unit (Node 24)

### ✅ 174 of 174 tests passed

| Coverage | Now | Minimum | |
|---|---:|---:|---|
| lines | 98.96% | 85% | ✅ |
| branches | 90.21% | 80% | ✅ |
| functions | 97.52% | 80% | ✅ |
| statements | 97.71% | 85% | ✅ |
[tests/unit (Node 24)-2           ] ⭐ Run Main upload reports
[tests/unit (Node 22)-1           ]   | Multiple search paths detected. Calculating the least common ancestor of all paths
[tests/unit (Node 22)-1           ]   | The least common ancestor is …/labflow-lite. This will be the root directory of the artifact
[tests/unit (Node 22)-1           ]   | With the provided path, there will be 37 files uploaded
[tests/unit (Node 22)-1           ]   | Artifact name is valid!
[tests/unit (Node 22)-1           ]   | Root directory input is valid!
[tests/unit (Node 22)-1           ]   | Beginning upload of artifact content to blob storage
[tests/unit (Node 22)-1           ]   | Uploaded bytes 97168
[tests/unit (Node 22)-1           ]   | Finished uploading artifact content to blob storage!
[tests/unit (Node 22)-1           ]   | SHA256 digest of uploaded artifact zip is 18abd34d7d588e499a72930378e70bcd0b78e07f087211f76b026c20fc787b27
[tests/unit (Node 22)-1           ]   | Finalizing artifact upload
[tests/unit (Node 22)-1           ]   | Artifact unit-reports-node22.zip successfully finalized. Artifact ID 3787520504
[tests/unit (Node 22)-1           ]   | Artifact unit-reports-node22 has been successfully uploaded! Final size is 97168 bytes. Artifact ID is 3787520504
[tests/unit (Node 22)-1           ]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/3787520504
[tests/unit (Node 22)-1           ]   ✅  Success - Main upload reports [1.351797292s]
[tests/unit (Node 22)-1           ]   ⚙  ::set-output:: artifact-digest=18abd34d7d588e499a72930378e70bcd0b78e07f087211f76b026c20fc787b27
[tests/unit (Node 22)-1           ]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/3787520504
[tests/unit (Node 22)-1           ]   ⚙  ::set-output:: artifact-id=3787520504
[tests/unit (Node 22)-1           ] ⭐ Run Post actions/setup-node@v4
[tests/unit (Node 24)-2           ]   | Multiple search paths detected. Calculating the least common ancestor of all paths
[tests/unit (Node 24)-2           ]   | The least common ancestor is …/labflow-lite. This will be the root directory of the artifact
[tests/unit (Node 24)-2           ]   | With the provided path, there will be 37 files uploaded
[tests/unit (Node 24)-2           ]   | Artifact name is valid!
[tests/unit (Node 24)-2           ]   | Root directory input is valid!
[tests/unit (Node 24)-2           ]   | Beginning upload of artifact content to blob storage
[tests/unit (Node 24)-2           ]   | Uploaded bytes 97075
[tests/unit (Node 24)-2           ]   | Finished uploading artifact content to blob storage!
[tests/unit (Node 24)-2           ]   | SHA256 digest of uploaded artifact zip is 12995ae3d14e91cc02b755b4e0ea57decb2d54f9392332bd63ffc3644330c6ed
[tests/unit (Node 24)-2           ]   | Finalizing artifact upload
[tests/unit (Node 24)-2           ]   | Artifact unit-reports-node24.zip successfully finalized. Artifact ID 3888186218
[tests/unit (Node 24)-2           ]   | Artifact unit-reports-node24 has been successfully uploaded! Final size is 97075 bytes. Artifact ID is 3888186218
[tests/unit (Node 24)-2           ]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/3888186218
[tests/unit (Node 24)-2           ]   ✅  Success - Main upload reports [1.307749834s]
[tests/unit (Node 24)-2           ]   ⚙  ::set-output:: artifact-id=3888186218
[tests/unit (Node 24)-2           ]   ⚙  ::set-output:: artifact-digest=12995ae3d14e91cc02b755b4e0ea57decb2d54f9392332bd63ffc3644330c6ed
[tests/unit (Node 24)-2           ]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/3888186218
[tests/unit (Node 24)-2           ] ⭐ Run Post actions/setup-node@v4
[tests/unit (Node 22)-1           ]   | Cache Size: ~55 MB (57761897 B)
[tests/unit (Node 22)-1           ]   | Cache saved successfully
[tests/unit (Node 22)-1           ]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit (Node 22)-1           ]   ✅  Success - Post actions/setup-node@v4 [1.357874375s]
[tests/unit (Node 22)-1           ] ⭐ Run Complete job
[tests/unit (Node 22)-1           ] Cleaning up container for job unit (Node 22)
[tests/unit (Node 22)-1           ]   ✅  Success - Complete job
[tests/unit (Node 22)-1           ] 🏁  Job succeeded
[tests/unit (Node 24)-2           ]   | Cache Size: ~55 MB (57757253 B)
[tests/unit (Node 24)-2           ]   | Cache saved successfully
[tests/unit (Node 24)-2           ]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit (Node 24)-2           ]   ✅  Success - Post actions/setup-node@v4 [2.144819625s]
[tests/unit (Node 24)-2           ] ⭐ Run Complete job
[tests/unit (Node 24)-2           ] Cleaning up container for job unit (Node 24)
[tests/unit (Node 24)-2           ]   ✅  Success - Complete job
[tests/unit (Node 24)-2           ] 🏁  Job succeeded
[tests/e2e (Chromium)             ]   | libcairo2 is already the newest version (1.18.0-3build1).
[tests/e2e (Chromium)             ]   | libcairo2 set to manually installed.
[tests/e2e (Chromium)             ]   | libdbus-1-3 is already the newest version (1.14.10-4ubuntu4.1).
[tests/e2e (Chromium)             ]   | libdbus-1-3 set to manually installed.
[tests/e2e (Chromium)             ]   | libpango-1.0-0 is already the newest version (1.52.1+ds-1build1).
[tests/e2e (Chromium)             ]   | libpango-1.0-0 set to manually installed.
[tests/e2e (Chromium)             ]   | libxcb1 is already the newest version (1.15-1ubuntu2).
[tests/e2e (Chromium)             ]   | libxcb1 set to manually installed.
[tests/e2e (Chromium)             ]   | libxext6 is already the newest version (2:1.3.4-1build2).
[tests/e2e (Chromium)             ]   | libxext6 set to manually installed.
[tests/e2e (Chromium)             ]   | libfontconfig1 is already the newest version (2.15.0-1.1ubuntu2).
[tests/e2e (Chromium)             ]   | libfontconfig1 set to manually installed.
[tests/e2e (Chromium)             ]   | The following additional packages will be installed:
[tests/e2e (Chromium)             ]   |   at-spi2-common gir1.2-glib-2.0 gir1.2-glib-2.0-dev libasound2-data
[tests/e2e (Chromium)             ]   |   libavahi-client3 libavahi-common-data libavahi-common3 libdrm-amdgpu1
[tests/e2e (Chromium)             ]   |   libdrm-common libfontenc1 libfreetype-dev libgirepository-2.0-0 libgl1
[tests/e2e (Chromium)             ]   |   libgl1-mesa-dri libglib2.0-bin libglib2.0-data libglib2.0-dev
[tests/e2e (Chromium)             ]   |   libglib2.0-dev-bin libglvnd0 libglx-mesa0 libglx0 libllvm20
[tests/e2e (Chromium)             ]   |   libsensors-config libsensors5 libvulkan1 libx11-data libx11-dev libx11-xcb1
[tests/e2e (Chromium)             ]   |   libxaw7 libxcb-dri3-0 libxcb-glx0 libxcb-present0 libxcb-randr0 libxcb-sync1
[tests/e2e (Chromium)             ]   |   libxcb-xfixes0 libxfont2 libxi6 libxkbfile1 libxmu6 libxmuu1 libxpm4
[tests/e2e (Chromium)             ]   |   libxshmfence1 libxxf86vm1 mesa-libgallium x11-xkb-utils xauth
[tests/e2e (Chromium)             ]   |   xfonts-encodings xfonts-utils xkb-data xserver-common
[tests/e2e (Chromium)             ]   | Suggested packages:
[tests/e2e (Chromium)             ]   |   alsa-utils libasound2-plugins cups-common freetype2-doc low-memory-monitor
[tests/e2e (Chromium)             ]   |   libglib2.0-doc libxml2-utils lm-sensors libx11-doc
[tests/e2e (Chromium)             ]   | Recommended packages:
[tests/e2e (Chromium)             ]   |   fonts-ipafont-mincho fonts-liberation-sans-narrow fonts-tlwg-loma
[tests/e2e (Chromium)             ]   |   alsa-ucm-conf alsa-topology-conf at-spi2-core xdg-user-dirs
[tests/e2e (Chromium)             ]   |   mesa-vulkan-drivers | vulkan-icd xfonts-base
[tests/e2e (Chromium)             ]   | The following NEW packages will be installed:
[tests/e2e (Chromium)             ]   |   at-spi2-common fonts-freefont-ttf fonts-ipafont-gothic fonts-liberation
[tests/e2e (Chromium)             ]   |   fonts-noto-color-emoji fonts-tlwg-loma-otf fonts-unifont fonts-wqy-zenhei
[tests/e2e (Chromium)             ]   |   libasound2-data libasound2t64 libatk-bridge2.0-0t64 libatk1.0-0t64
[tests/e2e (Chromium)             ]   |   libatspi2.0-0t64 libavahi-client3 libavahi-common-data libavahi-common3
[tests/e2e (Chromium)             ]   |   libcups2t64 libdrm-amdgpu1 libdrm-common libdrm2 libfontenc1 libgbm1 libgl1
[tests/e2e (Chromium)             ]   |   libgl1-mesa-dri libglvnd0 libglx-mesa0 libglx0 libllvm20 libnspr4 libnss3
[tests/e2e (Chromium)             ]   |   libsensors-config libsensors5 libvulkan1 libx11-xcb1 libxaw7 libxcb-dri3-0
[tests/e2e (Chromium)             ]   |   libxcb-glx0 libxcb-present0 libxcb-randr0 libxcb-sync1 libxcb-xfixes0
[tests/e2e (Chromium)             ]   |   libxcomposite1 libxdamage1 libxfixes3 libxfont2 libxi6 libxkbcommon0
[tests/e2e (Chromium)             ]   |   libxkbfile1 libxmu6 libxmuu1 libxpm4 libxrandr2 libxshmfence1 libxxf86vm1
[tests/e2e (Chromium)             ]   |   mesa-libgallium x11-xkb-utils xauth xfonts-cyrillic xfonts-encodings
[tests/e2e (Chromium)             ]   |   xfonts-scalable xfonts-utils xkb-data xserver-common xvfb
[tests/e2e (Chromium)             ]   | The following packages will be upgraded:
[tests/e2e (Chromium)             ]   |   gir1.2-glib-2.0 gir1.2-glib-2.0-dev libfreetype-dev libfreetype6
[tests/e2e (Chromium)             ]   |   libgirepository-2.0-0 libglib2.0-0t64 libglib2.0-bin libglib2.0-data
[tests/e2e (Chromium)             ]   |   libglib2.0-dev libglib2.0-dev-bin libx11-6 libx11-data libx11-dev
[tests/e2e (Chromium)             ]   | 13 upgraded, 64 newly installed, 0 to remove and 141 not upgraded.
[tests/e2e (Chromium)             ]   | debconf: delaying package configuration, since apt-utils is not installed
(Reading database ... 5%
(Reading database ... 10%
(Reading database ... 15%
(Reading database ... 20%
(Reading database ... 25%
(Reading database ... 30%
(Reading database ... 35%
(Reading database ... 40%
(Reading database ... 45%
(Reading database ... 50%
(Reading database ... 55%
(Reading database ... 60%
(Reading database ... 65%
(Reading database ... 70%
(Reading database ... 75%
(Reading database ... 80%
(Reading database ... 85%
(Reading database ... 90%
(Reading database ... 95%
(Reading database ... 100%
(Reading database ... 26166 files and directories currently installed.)
[tests/e2e (Chromium)             ]   | No schema files found: doing nothing.
[tests/e2e (Chromium)             ]   | update-alternatives: using /usr/share/fonts/opentype/ipafont-gothic/ipag.ttf to provide /usr/share/fonts/truetype/fonts-japanese-gothic.ttf (fonts-japanese-gothic.ttf) in auto mode
[tests/e2e (Chromium)             ]   | |                                                                                |   0% of 190.5 MiB
[tests/e2e (Chromium)             ]   | Chrome for Testing 156.0.8078.4 (playwright chromium v1248) downloaded to /root/.cache/ms-playwright/chromium-1248
[tests/e2e (Chromium)             ]   | |                                                                                |   0% of 1.9 MiB
[tests/e2e (Chromium)             ]   | FFmpeg (playwright ffmpeg v1013) downloaded to /root/.cache/ms-playwright/ffmpeg-1013
[tests/e2e (Chromium)             ]   | |                                                                                |   0% of 119.9 MiB
[tests/e2e (Chromium)             ]   | Chrome Headless Shell 156.0.8078.4 (playwright chromium-headless-shell v1248) downloaded to /root/.cache/ms-playwright/chromium_headless_shell-1248
[tests/e2e (Chromium)             ]   ✅  Success - Main npx playwright install --with-deps chromium [5m23.531272208s]
[tests/e2e (Chromium)             ] ⭐ Run Main npm run test:e2e
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | > labflow-lite@1.0.0 test:e2e
[tests/e2e (Chromium)             ]   | > playwright test e2e/ --project=chromium
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | Running 9 tests using 5 workers
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   | 
[tests/e2e (Chromium)             ]   |   9 passed (3.0s)
[tests/e2e (Chromium)             ]   ❓  ::notice title=🎭 Playwright Run Summary::  9 passed (3.0s)
[tests/e2e (Chromium)             ]   ✅  Success - Main npm run test:e2e [3.635169542s]
[tests/e2e (Chromium)             ] ⭐ Run Main upload Playwright report
[tests/e2e (Chromium)             ]   | With the provided path, there will be 1 file uploaded
[tests/e2e (Chromium)             ]   | Artifact name is valid!
[tests/e2e (Chromium)             ]   | Root directory input is valid!
[tests/e2e (Chromium)             ]   | Beginning upload of artifact content to blob storage
[tests/e2e (Chromium)             ]   | Uploaded bytes 201154
[tests/e2e (Chromium)             ]   | Finished uploading artifact content to blob storage!
[tests/e2e (Chromium)             ]   | SHA256 digest of uploaded artifact zip is 137676c26a392ac7c58013c46f21494d2fd13b791d184a84438f442921ae2a71
[tests/e2e (Chromium)             ]   | Finalizing artifact upload
[tests/e2e (Chromium)             ]   | Artifact playwright-report.zip successfully finalized. Artifact ID 61284767
[tests/e2e (Chromium)             ]   | Artifact playwright-report has been successfully uploaded! Final size is 201154 bytes. Artifact ID is 61284767
[tests/e2e (Chromium)             ]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/61284767
[tests/e2e (Chromium)             ]   ✅  Success - Main upload Playwright report [1.121635916s]
[tests/e2e (Chromium)             ]   ⚙  ::set-output:: artifact-id=61284767
[tests/e2e (Chromium)             ]   ⚙  ::set-output:: artifact-digest=137676c26a392ac7c58013c46f21494d2fd13b791d184a84438f442921ae2a71
[tests/e2e (Chromium)             ]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/61284767
[tests/e2e (Chromium)             ] ⭐ Run Post actions/setup-node@v4
[tests/e2e (Chromium)             ]   | Cache Size: ~55 MB (57763490 B)
[tests/e2e (Chromium)             ]   | Cache saved successfully
[tests/e2e (Chromium)             ]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/e2e (Chromium)             ]   ✅  Success - Post actions/setup-node@v4 [801.529458ms]
[tests/e2e (Chromium)             ] ⭐ Run Complete job
[tests/e2e (Chromium)             ] Cleaning up container for job e2e (Chromium)
[tests/e2e (Chromium)             ]   ✅  Success - Complete job
[tests/e2e (Chromium)             ] 🏁  Job succeeded
[tests/ci-ok                      ] ⭐ Run Set up job
[tests/ci-ok                      ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/ci-ok                      ]   ✅  Success - Set up job
[tests/ci-ok                      ] ⭐ Run Main actions/checkout@v4
[tests/ci-ok                      ]   ✅  Success - Main actions/checkout@v4 [317.872ms]
[tests/ci-ok                      ] ⭐ Run Main every required job passed?
[tests/ci-ok                      ]   | ✔ unit: success
[tests/ci-ok                      ]   | ✔ integration: success
[tests/ci-ok                      ]   | ✔ e2e: success
[tests/ci-ok                      ]   | ci-ok: every required job passed
[tests/ci-ok                      ]   ✅  Success - Main every required job passed? [104.241625ms]
[tests/ci-ok                      ] ⭐ Run Complete job
[tests/ci-ok                      ] Cleaning up container for job ci-ok
[tests/ci-ok                      ]   ✅  Success - Complete job
[tests/ci-ok                      ] 🏁  Job succeeded
Error: Job 'quarantine (report only)' failed
act exit: 1
wall time: 396 s`,
  '93-act-l': `$ act -l -W .github/workflows/test.yml 2>/dev/null
Stage  Job ID       Job name                        Workflow name  Workflow file  Events                             
0      integration  integration (PostgreSQL 17)     tests          test.yml       push,pull_request,workflow_dispatch
0      e2e          e2e (Chromium)                  tests          test.yml       pull_request,workflow_dispatch,push
0      quarantine   quarantine (report only)        tests          test.yml       push,pull_request,workflow_dispatch
0      unit         unit (Node \${{ matrix.node }})  tests          test.yml       pull_request,workflow_dispatch,push
1      ci-ok        ci-ok                           tests          test.yml       push,pull_request,workflow_dispatch`,
  '93-cong-do': `$ git switch -q pr/30-cho && act pull_request -W demo9/wf/93-cong.yml -e demo9/pr-event.json --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"; git switch -q main
time="2026-11-01T08:18:18+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:18:18+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[gate/unit    ] ⭐ Run Set up job
[gate/unit    ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[gate/unit-tee] ⭐ Run Set up job
[gate/unit-tee] 🚀  Start image=catthehacker/ubuntu:act-24.04
[gate/unit-tee]   ✅  Success - Set up job
[gate/unit    ]   ✅  Success - Set up job
[gate/unit-tee] ⭐ Run Main actions/checkout@v4
[gate/unit-tee]   ✅  Success - Main actions/checkout@v4 [230.135833ms]
[gate/unit-tee] ⭐ Run Main actions/setup-node@v4
[gate/unit    ] ⭐ Run Main actions/checkout@v4
[gate/unit    ]   ✅  Success - Main actions/checkout@v4 [285.985875ms]
[gate/unit    ] ⭐ Run Main actions/setup-node@v4
[gate/unit-tee]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[gate/unit-tee]   ❓  ::group::Environment details
[gate/unit-tee]   | node: v22.23.4
[gate/unit-tee]   | npm: 10.9.9
[gate/unit-tee]   | yarn: 
[gate/unit-tee]   ❓  ::endgroup::
[gate/unit-tee]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[gate/unit-tee]   | /root/.npm
[gate/unit-tee]   ⚙  ***
[gate/unit-tee]   | Cache Size: ~55 MB (57741284 B)
[gate/unit    ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[gate/unit    ]   ❓  ::group::Environment details
[gate/unit    ]   | node: v22.23.4
[gate/unit    ]   | npm: 10.9.9
[gate/unit    ]   | yarn: 
[gate/unit    ]   ❓  ::endgroup::
[gate/unit    ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[gate/unit    ]   | /root/.npm
[gate/unit    ]   ⚙  ***
[gate/unit-tee]   | Cache restored successfully
[gate/unit-tee]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[gate/unit-tee]   ✅  Success - Main actions/setup-node@v4 [3.438530458s]
[gate/unit-tee]   ⚙  ::set-output:: node-version=v22.23.4
[gate/unit-tee]   ⚙  ::set-output:: cache-hit=true
[gate/unit-tee]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[gate/unit-tee] ⭐ Run Main npm ci
[gate/unit    ]   | Cache Size: ~55 MB (57741284 B)
[gate/unit    ]   | Cache restored successfully
[gate/unit    ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[gate/unit    ]   ✅  Success - Main actions/setup-node@v4 [2.947284542s]
[gate/unit    ]   ⚙  ::set-output:: node-version=v22.23.4
[gate/unit    ]   ⚙  ::set-output:: cache-hit=true
[gate/unit    ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[gate/unit    ] ⭐ Run Main npm ci
[gate/unit-tee]   | 
[gate/unit-tee]   | added 568 packages, and audited 569 packages in 22s
[gate/unit-tee]   | 
[gate/unit-tee]   | 123 packages are looking for funding
[gate/unit-tee]   |   run \`npm fund\` for details
[gate/unit-tee]   | 
[gate/unit-tee]   | 13 vulnerabilities (12 moderate, 1 high)
[gate/unit-tee]   | 
[gate/unit-tee]   | To address issues that do not require attention, run:
[gate/unit-tee]   |   npm audit fix
[gate/unit-tee]   | 
[gate/unit-tee]   | To address all issues possible, run:
[gate/unit-tee]   |   npm audit fix --force
[gate/unit-tee]   | 
[gate/unit-tee]   | Some issues need review, and may require choosing
[gate/unit-tee]   | a different dependency.
[gate/unit-tee]   | 
[gate/unit-tee]   | Run \`npm audit\` for details.
[gate/unit-tee]   ✅  Success - Main npm ci [22.4872135s]
[gate/unit-tee] ⭐ Run Main npx vitest run src/ --reporter=dot | tee unit.log
[gate/unit-tee]   | 
[gate/unit-tee]   |  RUN  v5.0.5 …/labflow-lite
[gate/unit-tee]   | 
[gate/unit    ]   | 
[gate/unit    ]   | added 568 packages, and audited 569 packages in 23s
[gate/unit    ]   | 
[gate/unit    ]   | 123 packages are looking for funding
[gate/unit    ]   |   run \`npm fund\` for details
[gate/unit    ]   | 
[gate/unit    ]   | 13 vulnerabilities (12 moderate, 1 high)
[gate/unit    ]   | 
[gate/unit    ]   | To address issues that do not require attention, run:
[gate/unit    ]   |   npm audit fix
[gate/unit    ]   | 
[gate/unit    ]   | To address all issues possible, run:
[gate/unit    ]   |   npm audit fix --force
[gate/unit    ]   | 
[gate/unit    ]   | Some issues need review, and may require choosing
[gate/unit    ]   | a different dependency.
[gate/unit    ]   | 
[gate/unit    ]   | Run \`npm audit\` for details.
[gate/unit    ]   ✅  Success - Main npm ci [22.883501083s]
[gate/unit    ] ⭐ Run Main npm run test:unit
[gate/unit-tee]   | ·······································································x······································································································
[gate/unit-tee]   | 
[gate/unit-tee]   | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
[gate/unit-tee]   | 
[gate/unit-tee]   |  FAIL  src/rules/booking.test.js > needsApproval (BR-06 decision table) > STUDENT, 30 seats → false
[gate/unit-tee]   | AssertionError: expected true to be false // Object.is equality
[gate/unit-tee]   | 
[gate/unit-tee]   | - Expected
[gate/unit-tee]   | + Received
[gate/unit-tee]   | 
[gate/unit-tee]   | - false
[gate/unit-tee]   | + true
[gate/unit-tee]   | 
[gate/unit-tee]   |  ❯ src/rules/booking.test.js:47:44
[gate/unit-tee]   |      45|     { role: 'ADMIN', seats: 31, expected: false },
[gate/unit-tee]   |      46|   ])('$role, $seats seats → $expected', ({ role, seats, expected }) =>…
[gate/unit-tee]   |      47|     expect(needsApproval({ role, seats })).toBe(expected);
[gate/unit-tee]   |        |                                            ^
[gate/unit-tee]   |      48|   });
[gate/unit-tee]   |      49|   it.each([0, -5, 2.5])('throws RangeError for %s seats', (seats) => {
[gate/unit-tee]   | 
[gate/unit-tee]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
[gate/unit-tee]   | 
[gate/unit-tee]   | 
[gate/unit-tee]   |  Test Files  1 failed | 19 passed (20)
[gate/unit-tee]   |       Tests  1 failed | 173 passed (174)
[gate/unit-tee]   |    Start at  01:18:49
[gate/unit-tee]   |    Duration  1.03s (transform 48%, import 28%, tests 23%, worker 2%)
[gate/unit-tee]   | 
[gate/unit-tee]   ✅  Success - Main npx vitest run src/ --reporter=dot | tee unit.log [1.628949083s]
[gate/unit    ]   | 
[gate/unit    ]   | > labflow-lite@1.0.0 test:unit
[gate/unit    ]   | > vitest run src/
[gate/unit    ]   | 
[gate/unit-tee] ⭐ Run Main same command, shell bash (adds -o pipefail)
[gate/unit    ]   | 
[gate/unit    ]   |  RUN  v5.0.5 …/labflow-lite
[gate/unit    ]   | 
[gate/unit    ]   |  ❯ src/rules/booking.test.js (28 tests | 1 failed) 35ms
[gate/unit    ]   |    ❯ needsApproval (BR-06 decision table) (7)
[gate/unit    ]   |      × STUDENT, 30 seats → false 24ms
[gate/unit-tee]   | 
[gate/unit-tee]   |  RUN  v5.0.5 …/labflow-lite
[gate/unit-tee]   | 
[gate/unit    ]   | 
[gate/unit    ]   | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
[gate/unit    ]   | 
[gate/unit    ]   |  FAIL  src/rules/booking.test.js > needsApproval (BR-06 decision table) > STUDENT, 30 seats → false
[gate/unit    ]   | AssertionError: expected true to be false // Object.is equality
[gate/unit    ]   | 
[gate/unit    ]   | - Expected
[gate/unit    ]   | + Received
[gate/unit    ]   | 
[gate/unit    ]   | - false
[gate/unit    ]   | + true
[gate/unit    ]   | 
[gate/unit    ]   |  ❯ src/rules/booking.test.js:47:44
[gate/unit    ]   |      45|     { role: 'ADMIN', seats: 31, expected: false },
[gate/unit    ]   |      46|   ])('$role, $seats seats → $expected', ({ role, seats, expected }) =>…
[gate/unit    ]   |      47|     expect(needsApproval({ role, seats })).toBe(expected);
[gate/unit    ]   |        |                                            ^
[gate/unit    ]   |      48|   });
[gate/unit    ]   |      49|   it.each([0, -5, 2.5])('throws RangeError for %s seats', (seats) => {
[gate/unit    ]   | 
[gate/unit    ]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
[gate/unit    ]   | 
[gate/unit    ]   | 
[gate/unit    ]   |  Test Files  1 failed | 19 passed (20)
[gate/unit    ]   |       Tests  1 failed | 173 passed (174)
[gate/unit    ]   |    Start at  01:18:50
[gate/unit    ]   |    Duration  1.30s (transform 46%, import 27%, tests 25%, worker 2%)
[gate/unit    ]   | 
[gate/unit    ]   ❌  Failure - Main npm run test:unit [1.861160666s]
[gate/unit    ] exitcode '1': failure
[gate/unit    ] ⭐ Run Complete job
[gate/unit    ]   ✅  Success - Complete job
[gate/unit    ] 🏁  Job failed
[gate/unit-tee]   | ························x·····················································································································································
[gate/unit-tee]   | 
[gate/unit-tee]   | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
[gate/unit-tee]   | 
[gate/unit-tee]   |  FAIL  src/rules/booking.test.js > needsApproval (BR-06 decision table) > STUDENT, 30 seats → false
[gate/unit-tee]   | AssertionError: expected true to be false // Object.is equality
[gate/unit-tee]   | 
[gate/unit-tee]   | - Expected
[gate/unit-tee]   | + Received
[gate/unit-tee]   | 
[gate/unit-tee]   | - false
[gate/unit-tee]   | + true
[gate/unit-tee]   | 
[gate/unit-tee]   |  ❯ src/rules/booking.test.js:47:44
[gate/unit-tee]   |      45|     { role: 'ADMIN', seats: 31, expected: false },
[gate/unit-tee]   |      46|   ])('$role, $seats seats → $expected', ({ role, seats, expected }) =>…
[gate/unit-tee]   |      47|     expect(needsApproval({ role, seats })).toBe(expected);
[gate/unit-tee]   |        |                                            ^
[gate/unit-tee]   |      48|   });
[gate/unit-tee]   |      49|   it.each([0, -5, 2.5])('throws RangeError for %s seats', (seats) => {
[gate/unit-tee]   | 
[gate/unit-tee]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
[gate/unit-tee]   | 
[gate/unit-tee]   | 
[gate/unit-tee]   |  Test Files  1 failed | 19 passed (20)
[gate/unit-tee]   |       Tests  1 failed | 173 passed (174)
[gate/unit-tee]   |    Start at  01:18:51
[gate/unit-tee]   |    Duration  1.15s (import 43%, transform 28%, tests 24%, worker 5%)
[gate/unit-tee]   | 
[gate/unit-tee]   ❌  Failure - Main same command, shell bash (adds -o pipefail) [1.957588125s]
[gate/unit-tee] exitcode '1': failure
[gate/unit-tee] ⭐ Run Complete job
[gate/unit-tee]   ✅  Success - Complete job
[gate/unit-tee] 🏁  Job failed
[gate/ci-ok     ] ⭐ Run Set up job
[gate/ci-ok     ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[gate/ci-ok     ]   ✅  Success - Set up job
[gate/ci-ok     ] ⭐ Run Main actions/checkout@v4
[gate/ci-ok     ]   ✅  Success - Main actions/checkout@v4 [303.453542ms]
[gate/ci-ok     ] ⭐ Run Main every required job passed?
[gate/ci-ok     ]   | ✘ unit: failure
[gate/ci-ok     ]   ❗  ::error title=ci-ok::Do not merge — unit: failure
[gate/ci-ok     ]   ❌  Failure - Main every required job passed? [116.212417ms]
[gate/ci-ok     ] exitcode '1': failure
[gate/ci-ok     ] ⭐ Run Complete job
[gate/ci-ok     ]   ✅  Success - Complete job
[gate/ci-ok     ] 🏁  Job failed
Error: Job 'unit' failed
act exit: 1`,
  '93-cong-xanh': `$ act push -W demo9/wf/93-cong.yml --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"
time="2026-11-01T08:17:35+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:17:35+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[gate/unit    ] ⭐ Run Set up job
[gate/unit    ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[gate/unit-tee] ⭐ Run Set up job
[gate/unit-tee] 🚀  Start image=catthehacker/ubuntu:act-24.04
[gate/unit    ]   ✅  Success - Set up job
[gate/unit-tee]   ✅  Success - Set up job
[gate/unit-tee] ⭐ Run Main actions/checkout@v4
[gate/unit-tee]   ✅  Success - Main actions/checkout@v4 [263.727917ms]
[gate/unit-tee] ⭐ Run Main actions/setup-node@v4
[gate/unit    ] ⭐ Run Main actions/checkout@v4
[gate/unit    ]   ✅  Success - Main actions/checkout@v4 [300.701042ms]
[gate/unit    ] ⭐ Run Main actions/setup-node@v4
[gate/unit-tee]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[gate/unit-tee]   ❓  ::group::Environment details
[gate/unit-tee]   | node: v22.23.4
[gate/unit-tee]   | npm: 10.9.9
[gate/unit-tee]   | yarn: 
[gate/unit-tee]   ❓  ::endgroup::
[gate/unit-tee]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[gate/unit-tee]   | /root/.npm
[gate/unit-tee]   ⚙  ***
[gate/unit-tee]   | Cache Size: ~55 MB (57757280 B)
[gate/unit    ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[gate/unit    ]   ❓  ::group::Environment details
[gate/unit    ]   | node: v22.23.4
[gate/unit    ]   | npm: 10.9.9
[gate/unit    ]   | yarn: 
[gate/unit    ]   ❓  ::endgroup::
[gate/unit    ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[gate/unit    ]   | /root/.npm
[gate/unit    ]   ⚙  ***
[gate/unit    ]   | Cache Size: ~55 MB (57757280 B)
[gate/unit-tee]   | Cache restored successfully
[gate/unit-tee]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[gate/unit-tee]   ✅  Success - Main actions/setup-node@v4 [3.672356958s]
[gate/unit-tee]   ⚙  ::set-output:: node-version=v22.23.4
[gate/unit-tee]   ⚙  ::set-output:: cache-hit=true
[gate/unit-tee]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[gate/unit-tee] ⭐ Run Main npm ci
[gate/unit    ]   | Cache restored successfully
[gate/unit    ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[gate/unit    ]   ✅  Success - Main actions/setup-node@v4 [2.900302666s]
[gate/unit    ]   ⚙  ::set-output:: node-version=v22.23.4
[gate/unit    ]   ⚙  ::set-output:: cache-hit=true
[gate/unit    ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[gate/unit    ] ⭐ Run Main npm ci
[gate/unit-tee]   | 
[gate/unit-tee]   | added 568 packages, and audited 569 packages in 21s
[gate/unit-tee]   | 
[gate/unit-tee]   | 123 packages are looking for funding
[gate/unit-tee]   |   run \`npm fund\` for details
[gate/unit-tee]   | 
[gate/unit-tee]   | 13 vulnerabilities (12 moderate, 1 high)
[gate/unit-tee]   | 
[gate/unit-tee]   | To address issues that do not require attention, run:
[gate/unit-tee]   |   npm audit fix
[gate/unit-tee]   | 
[gate/unit-tee]   | To address all issues possible, run:
[gate/unit-tee]   |   npm audit fix --force
[gate/unit-tee]   | 
[gate/unit-tee]   | Some issues need review, and may require choosing
[gate/unit-tee]   | a different dependency.
[gate/unit-tee]   | 
[gate/unit-tee]   | Run \`npm audit\` for details.
[gate/unit-tee]   ✅  Success - Main npm ci [20.756868625s]
[gate/unit-tee] ⭐ Run Main npx vitest run src/ --reporter=dot | tee unit.log
[gate/unit-tee]   | 
[gate/unit-tee]   |  RUN  v5.0.5 …/labflow-lite
[gate/unit-tee]   | 
[gate/unit-tee]   | ··············································································································································································
[gate/unit-tee]   | 
[gate/unit-tee]   |  Test Files  20 passed (20)
[gate/unit-tee]   |       Tests  174 passed (174)
[gate/unit-tee]   |    Start at  01:18:05
[gate/unit-tee]   |    Duration  951ms (transform 51%, import 27%, tests 19%, worker 2%)
[gate/unit-tee]   | 
[gate/unit-tee]   ✅  Success - Main npx vitest run src/ --reporter=dot | tee unit.log [1.519613833s]
[gate/unit-tee] ⭐ Run Main same command, shell bash (adds -o pipefail)
[gate/unit-tee]   | 
[gate/unit-tee]   |  RUN  v5.0.5 …/labflow-lite
[gate/unit-tee]   | 
[gate/unit-tee]   | ··············································································································································································
[gate/unit-tee]   | 
[gate/unit-tee]   |  Test Files  20 passed (20)
[gate/unit-tee]   |       Tests  174 passed (174)
[gate/unit-tee]   |    Start at  01:18:06
[gate/unit-tee]   |    Duration  763ms (tests 34%, import 34%, transform 28%, worker 4%)
[gate/unit-tee]   | 
[gate/unit-tee]   ✅  Success - Main same command, shell bash (adds -o pipefail) [1.2944825s]
[gate/unit-tee] ⭐ Run Post actions/setup-node@v4
[gate/unit-tee]   | Cache Size: ~55 MB (57742340 B)
[gate/unit-tee]   | Cache saved successfully
[gate/unit-tee]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[gate/unit-tee]   ✅  Success - Post actions/setup-node@v4 [728.247583ms]
[gate/unit-tee] ⭐ Run Complete job
[gate/unit-tee] Cleaning up container for job unit-tee
[gate/unit-tee]   ✅  Success - Complete job
[gate/unit-tee] 🏁  Job succeeded
[gate/unit    ]   | 
[gate/unit    ]   | added 568 packages, and audited 569 packages in 27s
[gate/unit    ]   | 
[gate/unit    ]   | 123 packages are looking for funding
[gate/unit    ]   |   run \`npm fund\` for details
[gate/unit    ]   | 
[gate/unit    ]   | 13 vulnerabilities (12 moderate, 1 high)
[gate/unit    ]   | 
[gate/unit    ]   | To address issues that do not require attention, run:
[gate/unit    ]   |   npm audit fix
[gate/unit    ]   | 
[gate/unit    ]   | To address all issues possible, run:
[gate/unit    ]   |   npm audit fix --force
[gate/unit    ]   | 
[gate/unit    ]   | Some issues need review, and may require choosing
[gate/unit    ]   | a different dependency.
[gate/unit    ]   | 
[gate/unit    ]   | Run \`npm audit\` for details.
[gate/unit    ]   ✅  Success - Main npm ci [27.353069875s]
[gate/unit    ] ⭐ Run Main npm run test:unit
[gate/unit    ]   | 
[gate/unit    ]   | > labflow-lite@1.0.0 test:unit
[gate/unit    ]   | > vitest run src/
[gate/unit    ]   | 
[gate/unit    ]   | 
[gate/unit    ]   |  RUN  v5.0.5 …/labflow-lite
[gate/unit    ]   | 
[gate/unit    ]   | 
[gate/unit    ]   |  Test Files  20 passed (20)
[gate/unit    ]   |       Tests  174 passed (174)
[gate/unit    ]   |    Start at  01:18:12
[gate/unit    ]   |    Duration  693ms (transform 47%, import 26%, tests 25%, worker 3%)
[gate/unit    ]   | 
[gate/unit    ]   ✅  Success - Main npm run test:unit [1.136512541s]
[gate/unit    ] ⭐ Run Post actions/setup-node@v4
[gate/unit    ]   | Cache Size: ~55 MB (57741284 B)
[gate/unit    ]   | Cache saved successfully
[gate/unit    ]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[gate/unit    ]   ✅  Success - Post actions/setup-node@v4 [651.698542ms]
[gate/unit    ] ⭐ Run Complete job
[gate/unit    ] Cleaning up container for job unit
[gate/unit    ]   ✅  Success - Complete job
[gate/unit    ] 🏁  Job succeeded
[gate/naive-gate] ⭐ Run Set up job
[gate/naive-gate] 🚀  Start image=catthehacker/ubuntu:act-24.04
[gate/ci-ok     ] ⭐ Run Set up job
[gate/ci-ok     ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[gate/naive-gate]   ✅  Success - Set up job
[gate/naive-gate] ⭐ Run Main echo "all green"
[gate/naive-gate]   | all green
[gate/naive-gate]   ✅  Success - Main echo "all green" [73.534459ms]
[gate/naive-gate] ⭐ Run Complete job
[gate/naive-gate] Cleaning up container for job naive-gate
[gate/naive-gate]   ✅  Success - Complete job
[gate/naive-gate] 🏁  Job succeeded
[gate/ci-ok     ]   ✅  Success - Set up job
[gate/ci-ok     ] ⭐ Run Main actions/checkout@v4
[gate/ci-ok     ]   ✅  Success - Main actions/checkout@v4 [297.734ms]
[gate/ci-ok     ] ⭐ Run Main every required job passed?
[gate/ci-ok     ]   | ✔ unit: success
[gate/ci-ok     ]   | ci-ok: every required job passed
[gate/ci-ok     ]   ✅  Success - Main every required job passed? [84.87825ms]
[gate/ci-ok     ] ⭐ Run Complete job
[gate/ci-ok     ] Cleaning up container for job ci-ok
[gate/ci-ok     ]   ✅  Success - Complete job
[gate/ci-ok     ] 🏁  Job succeeded
act exit: 0`,
  '93-gate-local': `$ NEEDS='{"unit":{"result":"success"},"integration":{"result":"skipped"},"e2e":{"result":"cancelled"}}' REQUIRED=unit,integration,e2e node scripts/ci-gate.mjs
✔ unit: success
✘ integration: skipped
✘ e2e: cancelled
::error title=ci-ok::Do not merge — integration: skipped, e2e: cancelled`,
  '93-nightly': `$ T0=$(date +%s); act schedule -W .github/workflows/nightly.yml --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T08:55:17+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:55:18+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[nightly/mutation (Stryker)             ] ⭐ Run Set up job
[nightly/mutation (Stryker)             ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[nightly/unit, shuffled ×5 (flaky hunt) ] ⭐ Run Set up job
[nightly/unit, shuffled ×5 (flaky hunt) ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[nightly/e2e (5 browsers and devices)   ] ⭐ Run Set up job
[nightly/e2e (5 browsers and devices)   ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[nightly/mutation (Stryker)             ]   ✅  Success - Set up job
[nightly/unit, shuffled ×5 (flaky hunt) ]   ✅  Success - Set up job
[nightly/e2e (5 browsers and devices)   ]   ✅  Success - Set up job
[nightly/unit, shuffled ×5 (flaky hunt) ] ⭐ Run Main actions/checkout@v4
[nightly/unit, shuffled ×5 (flaky hunt) ]   ✅  Success - Main actions/checkout@v4 [302.15625ms]
[nightly/unit, shuffled ×5 (flaky hunt) ] ⭐ Run Main actions/setup-node@v4
[nightly/mutation (Stryker)             ] ⭐ Run Main actions/checkout@v4
[nightly/mutation (Stryker)             ]   ✅  Success - Main actions/checkout@v4 [346.2755ms]
[nightly/mutation (Stryker)             ] ⭐ Run Main actions/setup-node@v4
[nightly/unit, shuffled ×5 (flaky hunt) ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[nightly/unit, shuffled ×5 (flaky hunt) ]   ❓  ::group::Environment details
[nightly/unit, shuffled ×5 (flaky hunt) ]   | node: v22.23.4
[nightly/unit, shuffled ×5 (flaky hunt) ]   | npm: 10.9.9
[nightly/unit, shuffled ×5 (flaky hunt) ]   | yarn: 
[nightly/unit, shuffled ×5 (flaky hunt) ]   ❓  ::endgroup::
[nightly/unit, shuffled ×5 (flaky hunt) ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[nightly/unit, shuffled ×5 (flaky hunt) ]   | /root/.npm
[nightly/e2e (5 browsers and devices)   ] ⭐ Run Main actions/checkout@v4
[nightly/unit, shuffled ×5 (flaky hunt) ]   ⚙  ***
[nightly/e2e (5 browsers and devices)   ]   ✅  Success - Main actions/checkout@v4 [597.754958ms]
[nightly/e2e (5 browsers and devices)   ] ⭐ Run Main actions/setup-node@v4
[nightly/unit, shuffled ×5 (flaky hunt) ]   | Cache Size: ~55 MB (57757424 B)
[nightly/unit, shuffled ×5 (flaky hunt) ]   | Cache restored successfully
[nightly/unit, shuffled ×5 (flaky hunt) ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[nightly/unit, shuffled ×5 (flaky hunt) ]   ✅  Success - Main actions/setup-node@v4 [5.645752416s]
[nightly/unit, shuffled ×5 (flaky hunt) ]   ⚙  ::set-output:: node-version=v22.23.4
[nightly/unit, shuffled ×5 (flaky hunt) ]   ⚙  ::set-output:: cache-hit=true
[nightly/unit, shuffled ×5 (flaky hunt) ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[nightly/unit, shuffled ×5 (flaky hunt) ] ⭐ Run Main npm ci
[nightly/mutation (Stryker)             ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[nightly/mutation (Stryker)             ]   ❓  ::group::Environment details
[nightly/mutation (Stryker)             ]   | node: v22.23.4
[nightly/mutation (Stryker)             ]   | npm: 10.9.9
[nightly/mutation (Stryker)             ]   | yarn: 
[nightly/mutation (Stryker)             ]   ❓  ::endgroup::
[nightly/mutation (Stryker)             ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[nightly/mutation (Stryker)             ]   | /root/.npm
[nightly/mutation (Stryker)             ]   ⚙  ***
[nightly/e2e (5 browsers and devices)   ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[nightly/e2e (5 browsers and devices)   ]   ❓  ::group::Environment details
[nightly/mutation (Stryker)             ]   | Cache Size: ~55 MB (57757424 B)
[nightly/e2e (5 browsers and devices)   ]   | node: v22.23.4
[nightly/e2e (5 browsers and devices)   ]   | npm: 10.9.9
[nightly/e2e (5 browsers and devices)   ]   | yarn: 
[nightly/e2e (5 browsers and devices)   ]   ❓  ::endgroup::
[nightly/e2e (5 browsers and devices)   ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[nightly/e2e (5 browsers and devices)   ]   | /root/.npm
[nightly/e2e (5 browsers and devices)   ]   ⚙  ***
[nightly/e2e (5 browsers and devices)   ]   | Cache Size: ~55 MB (57757424 B)
[nightly/mutation (Stryker)             ]   | Cache restored successfully
[nightly/mutation (Stryker)             ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[nightly/mutation (Stryker)             ]   ✅  Success - Main actions/setup-node@v4 [6.87892275s]
[nightly/mutation (Stryker)             ]   ⚙  ::set-output:: cache-hit=true
[nightly/mutation (Stryker)             ]   ⚙  ::set-output:: node-version=v22.23.4
[nightly/mutation (Stryker)             ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[nightly/mutation (Stryker)             ] ⭐ Run Main npm ci
[nightly/e2e (5 browsers and devices)   ]   | Cache restored successfully
[nightly/e2e (5 browsers and devices)   ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[nightly/e2e (5 browsers and devices)   ]   ✅  Success - Main actions/setup-node@v4 [6.004342333s]
[nightly/e2e (5 browsers and devices)   ]   ⚙  ::set-output:: cache-hit=true
[nightly/e2e (5 browsers and devices)   ]   ⚙  ::set-output:: node-version=v22.23.4
[nightly/e2e (5 browsers and devices)   ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[nightly/e2e (5 browsers and devices)   ] ⭐ Run Main npm ci
[nightly/e2e (5 browsers and devices)   ]   | 
[nightly/e2e (5 browsers and devices)   ]   | added 568 packages, and audited 569 packages in 36s
[nightly/e2e (5 browsers and devices)   ]   | 
[nightly/e2e (5 browsers and devices)   ]   | 123 packages are looking for funding
[nightly/e2e (5 browsers and devices)   ]   |   run \`npm fund\` for details
[nightly/e2e (5 browsers and devices)   ]   | 
[nightly/e2e (5 browsers and devices)   ]   | 13 vulnerabilities (12 moderate, 1 high)
[nightly/e2e (5 browsers and devices)   ]   | 
[nightly/e2e (5 browsers and devices)   ]   | To address issues that do not require attention, run:
[nightly/e2e (5 browsers and devices)   ]   |   npm audit fix
[nightly/e2e (5 browsers and devices)   ]   | 
[nightly/e2e (5 browsers and devices)   ]   | To address all issues possible, run:
[nightly/e2e (5 browsers and devices)   ]   |   npm audit fix --force
[nightly/e2e (5 browsers and devices)   ]   | 
[nightly/e2e (5 browsers and devices)   ]   | Some issues need review, and may require choosing
[nightly/e2e (5 browsers and devices)   ]   | a different dependency.
[nightly/e2e (5 browsers and devices)   ]   | 
[nightly/e2e (5 browsers and devices)   ]   | Run \`npm audit\` for details.
[nightly/e2e (5 browsers and devices)   ]   ✅  Success - Main npm ci [36.727749167s]
[nightly/e2e (5 browsers and devices)   ] ⭐ Run Main npx playwright install --with-deps chromium firefox webkit
[nightly/e2e (5 browsers and devices)   ]   | Installing dependencies...
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 
[nightly/unit, shuffled ×5 (flaky hunt) ]   | added 568 packages, and audited 569 packages in 49s
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 123 packages are looking for funding
[nightly/unit, shuffled ×5 (flaky hunt) ]   |   run \`npm fund\` for details
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 13 vulnerabilities (12 moderate, 1 high)
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 
[nightly/unit, shuffled ×5 (flaky hunt) ]   | To address issues that do not require attention, run:
[nightly/unit, shuffled ×5 (flaky hunt) ]   |   npm audit fix
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 
[nightly/unit, shuffled ×5 (flaky hunt) ]   | To address all issues possible, run:
[nightly/unit, shuffled ×5 (flaky hunt) ]   |   npm audit fix --force
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 
[nightly/unit, shuffled ×5 (flaky hunt) ]   | Some issues need review, and may require choosing
[nightly/unit, shuffled ×5 (flaky hunt) ]   | a different dependency.
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 
[nightly/unit, shuffled ×5 (flaky hunt) ]   | Run \`npm audit\` for details.
[nightly/unit, shuffled ×5 (flaky hunt) ]   ✅  Success - Main npm ci [49.566721208s]
[nightly/unit, shuffled ×5 (flaky hunt) ] ⭐ Run Main npx vitest run src/ --sequence.shuffle --repeats=4 --reporter=dot
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 
[nightly/unit, shuffled ×5 (flaky hunt) ]   |  RUN  v5.0.5 …/labflow-lite
[nightly/unit, shuffled ×5 (flaky hunt) ]   |       Running tests with seed "1793498180821"
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 
[nightly/unit, shuffled ×5 (flaky hunt) ]   | ···············································································································································································
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 
[nightly/unit, shuffled ×5 (flaky hunt) ]   |  Test Files  20 passed (20)
[nightly/unit, shuffled ×5 (flaky hunt) ]   |       Tests  175 passed (175)
[nightly/unit, shuffled ×5 (flaky hunt) ]   |    Start at  01:56:20
[nightly/unit, shuffled ×5 (flaky hunt) ]   |    Duration  2.03s (transform 56%, tests 28%, import 15%, worker 1%)
[nightly/unit, shuffled ×5 (flaky hunt) ]   | 
[nightly/unit, shuffled ×5 (flaky hunt) ]   ✅  Success - Main npx vitest run src/ --sequence.shuffle --repeats=4 --reporter=dot [2.83564125s]
[nightly/unit, shuffled ×5 (flaky hunt) ] ⭐ Run Post actions/setup-node@v4
[nightly/unit, shuffled ×5 (flaky hunt) ]   | Cache Size: ~55 MB (57759758 B)
[nightly/unit, shuffled ×5 (flaky hunt) ]   | Cache saved successfully
[nightly/unit, shuffled ×5 (flaky hunt) ]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[nightly/unit, shuffled ×5 (flaky hunt) ]   ✅  Success - Post actions/setup-node@v4 [1.20172425s]
[nightly/unit, shuffled ×5 (flaky hunt) ] ⭐ Run Complete job
[nightly/unit, shuffled ×5 (flaky hunt) ] Cleaning up container for job unit, shuffled ×5 (flaky hunt)
[nightly/unit, shuffled ×5 (flaky hunt) ]   ✅  Success - Complete job
[nightly/unit, shuffled ×5 (flaky hunt) ] 🏁  Job succeeded
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | added 568 packages, and audited 569 packages in 53s
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | 123 packages are looking for funding
[nightly/mutation (Stryker)             ]   |   run \`npm fund\` for details
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | 13 vulnerabilities (12 moderate, 1 high)
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | To address issues that do not require attention, run:
[nightly/mutation (Stryker)             ]   |   npm audit fix
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | To address all issues possible, run:
[nightly/mutation (Stryker)             ]   |   npm audit fix --force
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | Some issues need review, and may require choosing
[nightly/mutation (Stryker)             ]   | a different dependency.
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | Run \`npm audit\` for details.
[nightly/mutation (Stryker)             ]   ✅  Success - Main npm ci [53.48105125s]
[nightly/mutation (Stryker)             ] ⭐ Run Main npm run test:mutation
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | > labflow-lite@1.0.0 test:mutation
[nightly/mutation (Stryker)             ]   | > stryker run
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | 01:56:28 (585) INFO ProjectReader Found 6 of 260 file(s) to be mutated.
[nightly/mutation (Stryker)             ]   | 01:56:28 (585) INFO Instrumenter Instrumented 6 source file(s) with 237 mutant(s)
[nightly/mutation (Stryker)             ]   | 01:56:28 (585) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
[nightly/mutation (Stryker)             ]   | 01:56:29 (585) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
[nightly/mutation (Stryker)             ]   | 01:56:29 (585) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
[nightly/mutation (Stryker)             ]   | 01:56:31 (585) INFO DryRunExecutor Initial test run succeeded. Ran 102 tests in 2 seconds (net 371.7418309999995 ms, overhead 1678.2581690000006 ms).
[nightly/mutation (Stryker)             ]   | Mutation testing 77% (elapsed: <1m, remaining: <1m) 220/237 tested (3 survived, 1 timed out)
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | All tests
[nightly/mutation (Stryker)             ]   |   api/server.test.js
[nightly/mutation (Stryker)             ]   |     ✘ POST /api/bookings > 401 without a token [line 16] (covered 0)
[nightly/mutation (Stryker)             ]   |     ✘ POST /api/bookings > 400 VALIDATION for seats 0, and for a role in the body [line 21] (covered 0)
[nightly/mutation (Stryker)             ]   |     ~ who may read what > the owner reading booking 1 → 200 [line 47] (covered 73)
[nightly/mutation (Stryker)             ]   |     ~ who may read what > another student reading booking 1 → 404 [line 47] (covered 73)
[nightly/mutation (Stryker)             ]   |     ~ who may read what > a lecturer reading booking 1 → 404 [line 47] (covered 73)
[nightly/mutation (Stryker)             ]   |     ~ who may read what > an admin reading booking 1 → 200 [line 47] (covered 73)
[nightly/mutation (Stryker)             ]   |     ✘ who may read what > STUDENT on the admin list → 403 [line 53] (covered 0)
[nightly/mutation (Stryker)             ]   |     ✘ who may read what > LECTURER on the admin list → 403 [line 53] (covered 0)
[nightly/mutation (Stryker)             ]   |     ✘ who may read what > ADMIN on the admin list → 200 [line 53] (covered 0)
[nightly/mutation (Stryker)             ]   |     ✘ who may read what > an expired token → 401 (clock fixed in 2030) [line 58] (covered 0)
[nightly/mutation (Stryker)             ]   |   booking/service.test.js
[nightly/mutation (Stryker)             ]   |     ~ bookLab > stores a confirmed booking [line 7] (covered 73)
[nightly/mutation (Stryker)             ]   |     ~ bookLab > rejects a rule violation with its code before touching the database [line 11] (covered 44)
[nightly/mutation (Stryker)             ]   |     ~ bookLab > rejects an overlapping booking with OVERLAP [line 16] (covered 73)
[nightly/mutation (Stryker)             ]   |     ~ bookLab > accepts the slot that starts when the previous one ends [line 22] (covered 73)
[nightly/mutation (Stryker)             ]   |     ~ bookLab > turns a failing lookup into STORAGE_DOWN and keeps the cause [line 28] (covered 52)
[nightly/mutation (Stryker)             ]   |     ~ bookLab > turns a failing insert into STORAGE_DOWN [line 36] (covered 73)
[nightly/mutation (Stryker)             ]   |   notify/notify.test.js
[nightly/mutation (Stryker)             ]   |     ✘ buildMail (pure) > CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn [line 13] (covered 0)
[nightly/mutation (Stryker)             ]   |     ✘ buildMail (pure) > PENDING booking with 31 seats → mail to approvals@labflow.example [line 13] (covered 0)
[nightly/mutation (Stryker)             ]   |     ~ bookAndNotify > a confirmed booking e-mails the student once [line 19] (covered 73)
[nightly/mutation (Stryker)             ]   |     ~ bookAndNotify > a 31-seat student booking e-mails only the approver [line 26] (covered 73)
[nightly/mutation (Stryker)             ]   |     ~ bookAndNotify > a failed e-mail keeps the booking and reports notified: false [line 32] (covered 73)
[nightly/mutation (Stryker)             ]   |     ~ bookAndNotify > a failed e-mail is logged with the booking id and the reason [line 39] (covered 73)
[nightly/mutation (Stryker)             ]   |     ~ bookAndNotify > a rejected booking sends no e-mail [line 45] (covered 44)
[nightly/mutation (Stryker)             ]   |   rules
[nightly/mutation (Stryker)             ]   |     booking.test.js
[nightly/mutation (Stryker)             ]   |       ~ checkSlot > rejects > 06:30–08:00 with OUTSIDE_HOURS [line 25] (covered 44)
[nightly/mutation (Stryker)             ]   |       ~ isWithinBookingWindow (BR-05) > rejects 1.5 [line 35] (covered 6)
[nightly/mutation (Stryker)             ]   |       ~ isWithinBookingWindow (BR-05) > rejects NaN [line 35] (covered 6)
[nightly/mutation (Stryker)             ]   |       ~ isWithinBookingWindow (BR-05) > rejects 3 [line 35] (covered 6)
[nightly/mutation (Stryker)             ]   |       ~ isWithinBookingWindow (BR-05) > rejects null [line 35] (covered 6)
[nightly/mutation (Stryker)             ]   |       ~ needsApproval (BR-06 decision table) > throws RangeError for -5 seats [line 49] (covered 10)
[nightly/mutation (Stryker)             ]   |       ~ needsApproval (BR-06 decision table) > throws RangeError for 2.5 seats [line 49] (covered 7)
[nightly/mutation (Stryker)             ]   |     cancel.test.js
[nightly/mutation (Stryker)             ]   |       ~ canCancel (Lite-3: until 60 minutes before the start) > at 09:30, a 09:00 booking can be cancelled → false [line 12] (covered 7)
[nightly/mutation (Stryker)             ]   |     checkin.test.js
[nightly/mutation (Stryker)             ]   |       ~ checkIn (BR-07) > refuses a CANCELLED booking [line 19] (covered 8)
[nightly/mutation (Stryker)             ]   |       ~ bannedUntil (BR-08) > counts from the latest no-show, whatever the order [line 28] (covered 30)
[nightly/mutation (Stryker)             ]   |     code.test.js
[nightly/mutation (Stryker)             ]   |       ~ makeBookingCode > can produce the first and the last character of the alphabet [line 14] (covered 9)
[nightly/mutation (Stryker)             ]   |       ~ newBookingRecord > takes its id and clock from the caller [line 21] (covered 11)
[nightly/mutation (Stryker)             ]   |     days.test.js
[nightly/mutation (Stryker)             ]   |       ~ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead [line 10] (covered 7)
[nightly/mutation (Stryker)             ]   |       ~ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead [line 10] (covered 7)
[nightly/mutation (Stryker)             ]   |       ~ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead [line 10] (covered 7)
[nightly/mutation (Stryker)             ]   |     mutation-gaps.test.js
[nightly/mutation (Stryker)             ]   |       ~ parseTime: only exactly HH:MM > the TypeError is ours, not a crash on null [line 26] (covered 12)
[nightly/mutation (Stryker)             ]   |     time.test.js
[nightly/mutation (Stryker)             ]   |       ~ parseTime > 00:00 → 0 [line 6] (covered 21)
[nightly/mutation (Stryker)             ]   |       ~ parseTime > 07:00 → 420 [line 6] (covered 21)
[nightly/mutation (Stryker)             ]   |       ~ parseTime > 21:30 → 1290 [line 6] (covered 21)
[nightly/mutation (Stryker)             ]   |       ~ parseTime > throws TypeError for "7:00" [line 9] (covered 12)
[nightly/mutation (Stryker)             ]   |       ~ parseTime > throws TypeError for "07-00" [line 9] (covered 12)
[nightly/mutation (Stryker)             ]   |       ~ parseTime > throws TypeError for "" [line 9] (covered 12)
[nightly/mutation (Stryker)             ]   |       ~ parseTime > throws TypeError for "abc" [line 9] (covered 12)
[nightly/mutation (Stryker)             ]   |       ~ parseTime > throws RangeError for 24:00 [line 12] (covered 17)
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | [Survived] ArithmeticOperator
[nightly/mutation (Stryker)             ]   | src/rules/code.js:16:10
[nightly/mutation (Stryker)             ]   | -       t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
[nightly/mutation (Stryker)             ]   | +       t ^= t - Math.imul(t ^ t >>> 7, t | 61);
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | [Survived] StringLiteral
[nightly/mutation (Stryker)             ]   | src/rules/days.js:7:44
[nightly/mutation (Stryker)             ]   | -     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
[nightly/mutation (Stryker)             ]   | +     return Math.round((Date.parse(dateText + "") - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | [Survived] StringLiteral
[nightly/mutation (Stryker)             ]   | src/rules/days.js:7:81
[nightly/mutation (Stryker)             ]   | -     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
[nightly/mutation (Stryker)             ]   | +     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + "")) / DAY_MS);
[nightly/mutation (Stryker)             ]   | 
[nightly/mutation (Stryker)             ]   | Ran 3.49 tests per mutant on average.
[nightly/mutation (Stryker)             ]   | ------------|------------------|----------|-----------|------------|----------|----------|
[nightly/mutation (Stryker)             ]   |             | % Mutation score |          |           |            |          |          |
[nightly/mutation (Stryker)             ]   | File        |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
[nightly/mutation (Stryker)             ]   | ------------|--------|---------|----------|-----------|------------|----------|----------|
[nightly/mutation (Stryker)             ]   | All files   |  98.73 |   98.73 |      233 |         1 |          3 |        0 |        0 |
[nightly/mutation (Stryker)             ]   |  booking.js | 100.00 |  100.00 |       94 |         0 |          0 |        0 |        0 |
[nightly/mutation (Stryker)             ]   |  cancel.js  | 100.00 |  100.00 |        7 |         0 |          0 |        0 |        0 |
[nightly/mutation (Stryker)             ]   |  checkin.js | 100.00 |  100.00 |       74 |         0 |          0 |        0 |        0 |
[nightly/mutation (Stryker)             ]   |  code.js    |  94.74 |   94.74 |       17 |         1 |          1 |        0 |        0 |
[nightly/mutation (Stryker)             ]   |  days.js    |  84.62 |   84.62 |       11 |         0 |          2 |        0 |        0 |
[nightly/mutation (Stryker)             ]   |  time.js    | 100.00 |  100.00 |       30 |         0 |          0 |        0 |        0 |
[nightly/mutation (Stryker)             ]   | ------------|--------|---------|----------|-----------|------------|----------|----------|
[nightly/mutation (Stryker)             ]   | 01:56:42 (585) INFO MutationTestReportHelper Final mutation score of 98.73 is greater than or equal to break threshold 80
[nightly/mutation (Stryker)             ]   | 01:56:42 (585) INFO HtmlReporter Your report can be found at: file://…/labflow-lite/reports/mutation/index.html
[nightly/mutation (Stryker)             ]   | 01:56:42 (585) INFO MutationTestExecutor Done in 14 seconds.
[nightly/mutation (Stryker)             ]   ✅  Success - Main npm run test:mutation [14.862567792s]
[nightly/mutation (Stryker)             ] ⭐ Run Main upload mutation report
[nightly/e2e (5 browsers and devices)   ]   | libcairo2 is already the newest version (1.18.0-3build1).
[nightly/e2e (5 browsers and devices)   ]   | libcairo2 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libdbus-1-3 is already the newest version (1.14.10-4ubuntu4.1).
[nightly/e2e (5 browsers and devices)   ]   | libdbus-1-3 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libpango-1.0-0 is already the newest version (1.52.1+ds-1build1).
[nightly/e2e (5 browsers and devices)   ]   | libpango-1.0-0 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libxcb1 is already the newest version (1.15-1ubuntu2).
[nightly/e2e (5 browsers and devices)   ]   | libxcb1 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libxext6 is already the newest version (2:1.3.4-1build2).
[nightly/e2e (5 browsers and devices)   ]   | libxext6 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libfontconfig1 is already the newest version (2.15.0-1.1ubuntu2).
[nightly/e2e (5 browsers and devices)   ]   | libfontconfig1 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libcairo-gobject2 is already the newest version (1.18.0-3build1).
[nightly/e2e (5 browsers and devices)   ]   | libcairo-gobject2 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libgdk-pixbuf-2.0-0 is already the newest version (2.42.10+dfsg-3ubuntu3.3).
[nightly/e2e (5 browsers and devices)   ]   | libgdk-pixbuf-2.0-0 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libpangocairo-1.0-0 is already the newest version (1.52.1+ds-1build1).
[nightly/e2e (5 browsers and devices)   ]   | libpangocairo-1.0-0 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libxcb-shm0 is already the newest version (1.15-1ubuntu2).
[nightly/e2e (5 browsers and devices)   ]   | libxcb-shm0 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libxrender1 is already the newest version (1:0.9.10-1.1build1).
[nightly/e2e (5 browsers and devices)   ]   | libxrender1 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libicu74 is already the newest version (74.2-1ubuntu3.1).
[nightly/e2e (5 browsers and devices)   ]   | libicu74 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libatomic1 is already the newest version (14.2.0-4ubuntu2~24.04.1).
[nightly/e2e (5 browsers and devices)   ]   | libatomic1 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libgstreamer1.0-0 is already the newest version (1.24.2-1ubuntu0.1).
[nightly/e2e (5 browsers and devices)   ]   | libgstreamer1.0-0 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libharfbuzz0b is already the newest version (8.3.0-2build2).
[nightly/e2e (5 browsers and devices)   ]   | libharfbuzz0b set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libjpeg-turbo8 is already the newest version (2.1.5-2ubuntu2).
[nightly/e2e (5 browsers and devices)   ]   | libjpeg-turbo8 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | liblcms2-2 is already the newest version (2.14-2ubuntu0.1).
[nightly/e2e (5 browsers and devices)   ]   | liblcms2-2 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libwebp7 is already the newest version (1.3.2-0.4build3).
[nightly/e2e (5 browsers and devices)   ]   | libwebp7 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libwebpdemux2 is already the newest version (1.3.2-0.4build3).
[nightly/e2e (5 browsers and devices)   ]   | libwebpdemux2 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | libxslt1.1 is already the newest version (1.1.39-0exp1ubuntu0.24.04.3).
[nightly/e2e (5 browsers and devices)   ]   | libxslt1.1 set to manually installed.
[nightly/e2e (5 browsers and devices)   ]   | The following additional packages will be installed:
[nightly/e2e (5 browsers and devices)   ]   |   adwaita-icon-theme at-spi2-common dbus-user-session dconf-gsettings-backend
[nightly/e2e (5 browsers and devices)   ]   |   dconf-service dictionaries-common emacsen-common gir1.2-glib-2.0
[nightly/e2e (5 browsers and devices)   ]   |   gir1.2-glib-2.0-dev glib-networking glib-networking-common
[nightly/e2e (5 browsers and devices)   ]   |   glib-networking-services gsettings-desktop-schemas gtk-update-icon-cache
[nightly/e2e (5 browsers and devices)   ]   |   humanity-icon-theme hunspell-en-us libaa1 libabsl20220623t64 libasound2-data
[nightly/e2e (5 browsers and devices)   ]   |   libaspell15 libass9 libasyncns0 libavahi-client3 libavahi-common-data
[nightly/e2e (5 browsers and devices)   ]   |   libavahi-common3 libavc1394-0 libavfilter9 libavformat60 libavtp0
[nightly/e2e (5 browsers and devices)   ]   |   libavutil58 libblas3 libbluray2 libbs2b0 libcaca0 libcdparanoia0
[nightly/e2e (5 browsers and devices)   ]   |   libchromaprint1 libcjson1 libcodec2-1.2 libcolord2 libdav1d7 libdc1394-25
[nightly/e2e (5 browsers and devices)   ]   |   libdca0 libdconf1 libde265-0 libdecor-0-0 libdirectfb-1.7-7t64
[nightly/e2e (5 browsers and devices)   ]   |   libdrm-amdgpu1 libdrm-common libdv4t64 libdvdnav4 libdvdread8t64
[nightly/e2e (5 browsers and devices)   ]   |   libegl-mesa0 libegl1 libevdev2 libevent-core-2.1-7t64 libevent-dev
[nightly/e2e (5 browsers and devices)   ]   |   libevent-extra-2.1-7t64 libevent-openssl-2.1-7t64 libevent-pthreads-2.1-7t64
[nightly/e2e (5 browsers and devices)   ]   |   libfaad2 libflac12t64 libfluidsynth3 libfontenc1 libfreeaptx0
[nightly/e2e (5 browsers and devices)   ]   |   libfreetype-dev libgav1-1 libgfortran5 libgirepository-2.0-0 libgl1
[nightly/e2e (5 browsers and devices)   ]   |   libgl1-mesa-dri libglib2.0-bin libglib2.0-data libglib2.0-dev
[nightly/e2e (5 browsers and devices)   ]   |   libglib2.0-dev-bin libglvnd0 libglx-mesa0 libglx0 libgme0 libgpm2
[nightly/e2e (5 browsers and devices)   ]   |   libgraphene-1.0-0 libgsm1 libgssdp-1.6-0 libgstreamer-plugins-good1.0-0
[nightly/e2e (5 browsers and devices)   ]   |   libgtk-3-common libgtk-4-common libgudev-1.0-0 libgupnp-1.6-0
[nightly/e2e (5 browsers and devices)   ]   |   libgupnp-igd-1.6-0 libhunspell-1.7-0 libhwy1t64 libiec61883-0
[nightly/e2e (5 browsers and devices)   ]   |   libinstpatch-1.0-2 libjack-jackd2-0 libjson-glib-1.0-0
[nightly/e2e (5 browsers and devices)   ]   |   libjson-glib-1.0-common libjxl0.7 liblapack3 liblc3-1 libldacbt-enc2
[nightly/e2e (5 browsers and devices)   ]   |   liblilv-0-0 libllvm20 liblrdf0 libltc11 libmbedcrypto7t64
[nightly/e2e (5 browsers and devices)   ]   |   libmjpegutils-2.1-0t64 libmodplug1 libmp3lame0 libmpcdec6
[nightly/e2e (5 browsers and devices)   ]   |   libmpeg2encpp-2.1-0t64 libmpg123-0t64 libmplex2-2.1-0t64 libmysofa1
[nightly/e2e (5 browsers and devices)   ]   |   libneon27t64 libnice10 libnorm1t64 libnuma1 libogg0 libopenal-data
[nightly/e2e (5 browsers and devices)   ]   |   libopenal1 libopenh264-7 libopenmpt0t64 libopenni2-0 liborc-0.4-0t64
[nightly/e2e (5 browsers and devices)   ]   |   libpgm-5.3-0t64 libpipewire-0.3-0t64 libplacebo338 libpng-dev
[nightly/e2e (5 browsers and devices)   ]   |   libpocketsphinx3 libpostproc57 libproxy1v5 libpulse0 libqrencode4
[nightly/e2e (5 browsers and devices)   ]   |   librabbitmq4 libraptor2-0 librav1e0 libraw1394-11 librist4 librubberband2
[nightly/e2e (5 browsers and devices)   ]   |   libsamplerate0 libsbc1 libsdl2-2.0-0 libsecret-common libsensors-config
[nightly/e2e (5 browsers and devices)   ]   |   libsensors5 libserd-0-0 libshine3 libshout3 libslang2 libsnappy1v5
[nightly/e2e (5 browsers and devices)   ]   |   libsndfile1 libsndio7.0 libsodium23 libsord-0-0 libsoundtouch1 libsoup-3.0-0
[nightly/e2e (5 browsers and devices)   ]   |   libsoup-3.0-common libsoxr0 libspa-0.2-modules libspandsp2t64 libspeex1
[nightly/e2e (5 browsers and devices)   ]   |   libsphinxbase3t64 libsratom-0-0 libsrt1.5-gnutls libsrtp2-1 libssh-4
[nightly/e2e (5 browsers and devices)   ]   |   libssh-gcrypt-4 libsvtav1enc1d1 libswresample4 libswscale7 libtag1v5
[nightly/e2e (5 browsers and devices)   ]   |   libtag1v5-vanilla libtext-iconv-perl libtheora0 libtwolame0 libudfread0
[nightly/e2e (5 browsers and devices)   ]   |   libunibreak5 libusb-1.0-0 libv4l-0t64 libv4lconvert0t64 libva-drm2
[nightly/e2e (5 browsers and devices)   ]   |   libva-x11-2 libva2 libvdpau1 libvidstab1.1 libvisual-0.4-0 libvo-aacenc0
[nightly/e2e (5 browsers and devices)   ]   |   libvo-amrwbenc0 libvorbis0a libvorbisenc2 libvorbisfile3 libvulkan1
[nightly/e2e (5 browsers and devices)   ]   |   libwavpack1 libwayland-cursor0 libwebrtc-audio-processing1 libwildmidi2
[nightly/e2e (5 browsers and devices)   ]   |   libx11-data libx11-dev libx265-199 libxaw7 libxcb-dri3-0 libxcb-glx0
[nightly/e2e (5 browsers and devices)   ]   |   libxcb-present0 libxcb-randr0 libxcb-sync1 libxcb-xfixes0 libxcb-xkb1
[nightly/e2e (5 browsers and devices)   ]   |   libxfont2 libxinerama1 libxkbcommon-x11-0 libxkbfile1 libxml2-dev libxmu6
[nightly/e2e (5 browsers and devices)   ]   |   libxmuu1 libxpm4 libxshmfence1 libxss1 libxtst6 libxvidcore4 libxxf86vm1
[nightly/e2e (5 browsers and devices)   ]   |   libyajl2 libyuv0 libzbar0t64 libzimg2 libzix-0-0 libzmq5 libzvbi-common
[nightly/e2e (5 browsers and devices)   ]   |   libzvbi0t64 libzxing3 mesa-libgallium ocl-icd-libopencl1 session-migration
[nightly/e2e (5 browsers and devices)   ]   |   timgm6mb-soundfont ubuntu-mono x11-xkb-utils xauth xfonts-encodings
[nightly/e2e (5 browsers and devices)   ]   |   xfonts-utils xkb-data xserver-common
[nightly/e2e (5 browsers and devices)   ]   | Suggested packages:
[nightly/e2e (5 browsers and devices)   ]   |   ispell | aspell | hunspell wordlist frei0r-plugins gvfs hunspell
[nightly/e2e (5 browsers and devices)   ]   |   openoffice.org-hunspell | openoffice.org-core alsa-utils libasound2-plugins
[nightly/e2e (5 browsers and devices)   ]   |   aspell libcuda1 libnvcuvid1 libnvidia-encode1 libbluray-bdj colord
[nightly/e2e (5 browsers and devices)   ]   |   cups-common libdirectfb-extra libdv-bin oss-compat libdvdcss2
[nightly/e2e (5 browsers and devices)   ]   |   libenchant-2-voikko freetype2-doc low-memory-monitor libglib2.0-doc
[nightly/e2e (5 browsers and devices)   ]   |   libxml2-utils gpm libvisual-0.4-plugins jackd2 liblrdf0-dev libportaudio2
[nightly/e2e (5 browsers and devices)   ]   |   opus-tools pipewire pulseaudio raptor2-utils libraw1394-doc xdg-utils
[nightly/e2e (5 browsers and devices)   ]   |   lm-sensors serdi sndiod sordi speex libwildmidi-config libx11-doc opencl-icd
[nightly/e2e (5 browsers and devices)   ]   |   fluid-soundfont-gm
[nightly/e2e (5 browsers and devices)   ]   | Recommended packages:
[nightly/e2e (5 browsers and devices)   ]   |   fonts-ipafont-mincho fonts-liberation-sans-narrow fonts-tlwg-loma
[nightly/e2e (5 browsers and devices)   ]   |   gstreamer1.0-x alsa-ucm-conf alsa-topology-conf aspell-en
[nightly/e2e (5 browsers and devices)   ]   |   | aspell-dictionary | aspell6a-dictionary at-spi2-core libaacs0
[nightly/e2e (5 browsers and devices)   ]   |   default-libdecor-0-plugin-1 | libdecor-0-plugin-1 enchant-2 xdg-user-dirs
[nightly/e2e (5 browsers and devices)   ]   |   gstreamer1.0-gl libgtk-3-bin libgtk-4-bin libgtk-4-media-gstreamer
[nightly/e2e (5 browsers and devices)   ]   |   libpipewire-0.3-common libpng-tools pocketsphinx-en-us va-driver-all
[nightly/e2e (5 browsers and devices)   ]   |   | va-driver vdpau-driver-all | vdpau-driver mesa-vulkan-drivers | vulkan-icd
[nightly/e2e (5 browsers and devices)   ]   |   xfonts-base
[nightly/mutation (Stryker)             ]   | With the provided path, there will be 1 file uploaded
[nightly/mutation (Stryker)             ]   | Artifact name is valid!
[nightly/mutation (Stryker)             ]   | Root directory input is valid!
[nightly/mutation (Stryker)             ]   | Beginning upload of artifact content to blob storage
[nightly/e2e (5 browsers and devices)   ]   | The following NEW packages will be installed:
[nightly/e2e (5 browsers and devices)   ]   |   adwaita-icon-theme at-spi2-common dbus-user-session dconf-gsettings-backend
[nightly/e2e (5 browsers and devices)   ]   |   dconf-service dictionaries-common emacsen-common fonts-freefont-ttf
[nightly/e2e (5 browsers and devices)   ]   |   fonts-ipafont-gothic fonts-liberation fonts-noto-color-emoji
[nightly/e2e (5 browsers and devices)   ]   |   fonts-tlwg-loma-otf fonts-unifont fonts-wqy-zenhei glib-networking
[nightly/e2e (5 browsers and devices)   ]   |   glib-networking-common glib-networking-services gsettings-desktop-schemas
[nightly/e2e (5 browsers and devices)   ]   |   gstreamer1.0-libav gstreamer1.0-plugins-bad gstreamer1.0-plugins-base
[nightly/e2e (5 browsers and devices)   ]   |   gstreamer1.0-plugins-good gtk-update-icon-cache humanity-icon-theme
[nightly/e2e (5 browsers and devices)   ]   |   hunspell-en-us libaa1 libabsl20220623t64 libasound2-data libasound2t64
[nightly/e2e (5 browsers and devices)   ]   |   libaspell15 libass9 libasyncns0 libatk-bridge2.0-0t64 libatk1.0-0t64
[nightly/e2e (5 browsers and devices)   ]   |   libatspi2.0-0t64 libavahi-client3 libavahi-common-data libavahi-common3
[nightly/e2e (5 browsers and devices)   ]   |   libavc1394-0 libavcodec60 libavfilter9 libavformat60 libavif16 libavtp0
[nightly/e2e (5 browsers and devices)   ]   |   libavutil58 libblas3 libbluray2 libbs2b0 libcaca0 libcdparanoia0
[nightly/e2e (5 browsers and devices)   ]   |   libchromaprint1 libcjson1 libcodec2-1.2 libcolord2 libcups2t64 libdav1d7
[nightly/e2e (5 browsers and devices)   ]   |   libdc1394-25 libdca0 libdconf1 libde265-0 libdecor-0-0 libdirectfb-1.7-7t64
[nightly/e2e (5 browsers and devices)   ]   |   libdrm-amdgpu1 libdrm-common libdrm2 libdv4t64 libdvdnav4 libdvdread8t64
[nightly/e2e (5 browsers and devices)   ]   |   libegl-mesa0 libegl1 libenchant-2-2 libepoxy0 libevdev2 libfaad2
[nightly/e2e (5 browsers and devices)   ]   |   libflac12t64 libflite1 libfluidsynth3 libfontenc1 libfreeaptx0 libgav1-1
[nightly/e2e (5 browsers and devices)   ]   |   libgbm1 libgfortran5 libgl1 libgl1-mesa-dri libgles2 libglvnd0 libglx-mesa0
[nightly/e2e (5 browsers and devices)   ]   |   libglx0 libgme0 libgpm2 libgraphene-1.0-0 libgsm1 libgssdp-1.6-0
[nightly/e2e (5 browsers and devices)   ]   |   libgstreamer-gl1.0-0 libgstreamer-plugins-bad1.0-0
[nightly/e2e (5 browsers and devices)   ]   |   libgstreamer-plugins-base1.0-0 libgstreamer-plugins-good1.0-0 libgtk-3-0t64
[nightly/e2e (5 browsers and devices)   ]   |   libgtk-3-common libgtk-4-1 libgtk-4-common libgudev-1.0-0 libgupnp-1.6-0
[nightly/e2e (5 browsers and devices)   ]   |   libgupnp-igd-1.6-0 libharfbuzz-icu0 libhunspell-1.7-0 libhwy1t64 libhyphen0
[nightly/e2e (5 browsers and devices)   ]   |   libiec61883-0 libinstpatch-1.0-2 libjack-jackd2-0 libjson-glib-1.0-0
[nightly/e2e (5 browsers and devices)   ]   |   libjson-glib-1.0-common libjxl0.7 liblapack3 liblc3-1 libldacbt-enc2
[nightly/e2e (5 browsers and devices)   ]   |   liblilv-0-0 libllvm20 liblrdf0 libltc11 libmanette-0.2-0 libmbedcrypto7t64
[nightly/e2e (5 browsers and devices)   ]   |   libmjpegutils-2.1-0t64 libmodplug1 libmp3lame0 libmpcdec6
[nightly/e2e (5 browsers and devices)   ]   |   libmpeg2encpp-2.1-0t64 libmpg123-0t64 libmplex2-2.1-0t64 libmysofa1
[nightly/e2e (5 browsers and devices)   ]   |   libneon27t64 libnice10 libnorm1t64 libnspr4 libnss3 libnuma1 libogg0
[nightly/e2e (5 browsers and devices)   ]   |   libopenal-data libopenal1 libopenh264-7 libopenmpt0t64 libopenni2-0 libopus0
[nightly/e2e (5 browsers and devices)   ]   |   liborc-0.4-0t64 libpgm-5.3-0t64 libpipewire-0.3-0t64 libplacebo338
[nightly/e2e (5 browsers and devices)   ]   |   libpocketsphinx3 libpostproc57 libproxy1v5 libpulse0 libqrencode4
[nightly/e2e (5 browsers and devices)   ]   |   librabbitmq4 libraptor2-0 librav1e0 libraw1394-11 librist4 librubberband2
[nightly/e2e (5 browsers and devices)   ]   |   libsamplerate0 libsbc1 libsdl2-2.0-0 libsecret-1-0 libsecret-common
[nightly/e2e (5 browsers and devices)   ]   |   libsensors-config libsensors5 libserd-0-0 libshine3 libshout3 libslang2
[nightly/e2e (5 browsers and devices)   ]   |   libsnappy1v5 libsndfile1 libsndio7.0 libsodium23 libsord-0-0 libsoundtouch1
[nightly/e2e (5 browsers and devices)   ]   |   libsoup-3.0-0 libsoup-3.0-common libsoxr0 libspa-0.2-modules libspandsp2t64
[nightly/e2e (5 browsers and devices)   ]   |   libspeex1 libsphinxbase3t64 libsratom-0-0 libsrt1.5-gnutls libsrtp2-1
[nightly/e2e (5 browsers and devices)   ]   |   libssh-gcrypt-4 libsvtav1enc1d1 libswresample4 libswscale7 libtag1v5
[nightly/e2e (5 browsers and devices)   ]   |   libtag1v5-vanilla libtext-iconv-perl libtheora0 libtwolame0 libudfread0
[nightly/e2e (5 browsers and devices)   ]   |   libunibreak5 libusb-1.0-0 libv4l-0t64 libv4lconvert0t64 libva-drm2
[nightly/e2e (5 browsers and devices)   ]   |   libva-x11-2 libva2 libvdpau1 libvidstab1.1 libvisual-0.4-0 libvo-aacenc0
[nightly/e2e (5 browsers and devices)   ]   |   libvo-amrwbenc0 libvorbis0a libvorbisenc2 libvorbisfile3 libvpx9 libvulkan1
[nightly/e2e (5 browsers and devices)   ]   |   libwavpack1 libwayland-client0 libwayland-cursor0 libwayland-egl1
[nightly/e2e (5 browsers and devices)   ]   |   libwayland-server0 libwebrtc-audio-processing1 libwildmidi2 libwoff1
[nightly/e2e (5 browsers and devices)   ]   |   libx11-xcb1 libx264-164 libx265-199 libxaw7 libxcb-dri3-0 libxcb-glx0
[nightly/e2e (5 browsers and devices)   ]   |   libxcb-present0 libxcb-randr0 libxcb-sync1 libxcb-xfixes0 libxcb-xkb1
[nightly/e2e (5 browsers and devices)   ]   |   libxcomposite1 libxcursor1 libxdamage1 libxfixes3 libxfont2 libxi6
[nightly/e2e (5 browsers and devices)   ]   |   libxinerama1 libxkbcommon-x11-0 libxkbcommon0 libxkbfile1 libxmu6 libxmuu1
[nightly/e2e (5 browsers and devices)   ]   |   libxpm4 libxrandr2 libxshmfence1 libxss1 libxtst6 libxvidcore4 libxxf86vm1
[nightly/e2e (5 browsers and devices)   ]   |   libyajl2 libyuv0 libzbar0t64 libzimg2 libzix-0-0 libzmq5 libzvbi-common
[nightly/e2e (5 browsers and devices)   ]   |   libzvbi0t64 libzxing3 mesa-libgallium ocl-icd-libopencl1 session-migration
[nightly/e2e (5 browsers and devices)   ]   |   timgm6mb-soundfont ubuntu-mono x11-xkb-utils xauth xfonts-cyrillic
[nightly/e2e (5 browsers and devices)   ]   |   xfonts-encodings xfonts-scalable xfonts-utils xkb-data xserver-common xvfb
[nightly/e2e (5 browsers and devices)   ]   | The following packages will be upgraded:
[nightly/e2e (5 browsers and devices)   ]   |   gir1.2-glib-2.0 gir1.2-glib-2.0-dev libevent-2.1-7t64 libevent-core-2.1-7t64
[nightly/e2e (5 browsers and devices)   ]   |   libevent-dev libevent-extra-2.1-7t64 libevent-openssl-2.1-7t64
[nightly/e2e (5 browsers and devices)   ]   |   libevent-pthreads-2.1-7t64 libfreetype-dev libfreetype6
[nightly/e2e (5 browsers and devices)   ]   |   libgirepository-2.0-0 libglib2.0-0t64 libglib2.0-bin libglib2.0-data
[nightly/e2e (5 browsers and devices)   ]   |   libglib2.0-dev libglib2.0-dev-bin libpng-dev libpng16-16t64 libssh-4
[nightly/e2e (5 browsers and devices)   ]   |   libx11-6 libx11-data libx11-dev libxml2 libxml2-dev
[nightly/mutation (Stryker)             ]   | Uploaded bytes 94655
[nightly/mutation (Stryker)             ]   | Finished uploading artifact content to blob storage!
[nightly/mutation (Stryker)             ]   | SHA256 digest of uploaded artifact zip is dbf83a9a84bb3850d94f2f3e6625b7835572f856264ec96df8595f6c8206959b
[nightly/mutation (Stryker)             ]   | Finalizing artifact upload
[nightly/mutation (Stryker)             ]   | Artifact mutation-report.zip successfully finalized. Artifact ID 2666008595
[nightly/mutation (Stryker)             ]   | Artifact mutation-report has been successfully uploaded! Final size is 94655 bytes. Artifact ID is 2666008595
[nightly/mutation (Stryker)             ]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/2666008595
[nightly/mutation (Stryker)             ]   ✅  Success - Main upload mutation report [1.982294167s]
[nightly/mutation (Stryker)             ]   ⚙  ::set-output:: artifact-digest=dbf83a9a84bb3850d94f2f3e6625b7835572f856264ec96df8595f6c8206959b
[nightly/mutation (Stryker)             ]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/2666008595
[nightly/mutation (Stryker)             ]   ⚙  ::set-output:: artifact-id=2666008595
[nightly/mutation (Stryker)             ] ⭐ Run Post actions/setup-node@v4
[nightly/e2e (5 browsers and devices)   ]   | 24 upgraded, 274 newly installed, 0 to remove and 130 not upgraded.
[nightly/mutation (Stryker)             ]   | Cache Size: ~55 MB (57755967 B)
[nightly/mutation (Stryker)             ]   | Cache saved successfully
[nightly/mutation (Stryker)             ]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[nightly/mutation (Stryker)             ]   ✅  Success - Post actions/setup-node@v4 [1.287363958s]
[nightly/mutation (Stryker)             ] ⭐ Run Complete job
[nightly/mutation (Stryker)             ] Cleaning up container for job mutation (Stryker)
[nightly/mutation (Stryker)             ]   ✅  Success - Complete job
[nightly/mutation (Stryker)             ] 🏁  Job succeeded
[nightly/e2e (5 browsers and devices)   ]   | debconf: delaying package configuration, since apt-utils is not installed
(Reading database ... 5%
(Reading database ... 10%
(Reading database ... 15%
(Reading database ... 20%
(Reading database ... 25%
(Reading database ... 30%
(Reading database ... 35%
(Reading database ... 40%
(Reading database ... 45%
(Reading database ... 50%
(Reading database ... 55%
(Reading database ... 60%
(Reading database ... 65%
(Reading database ... 70%
(Reading database ... 75%
(Reading database ... 80%
(Reading database ... 85%
(Reading database ... 90%
(Reading database ... 95%
(Reading database ... 100%
(Reading database ... 26166 files and directories currently installed.)
[nightly/e2e (5 browsers and devices)   ]   | Adding 'diversion of /usr/share/dict/words to /usr/share/dict/words.pre-dictionaries-common by dictionaries-common'
[nightly/e2e (5 browsers and devices)   ]   | update-alternatives: using /usr/lib/aarch64-linux-gnu/blas/libblas.so.3 to provide /usr/lib/aarch64-linux-gnu/libblas.so.3 (libblas.so.3-aarch64-linux-gnu) in auto mode
[nightly/e2e (5 browsers and devices)   ]   | update-alternatives: using /usr/share/fonts/opentype/ipafont-gothic/ipag.ttf to provide /usr/share/fonts/truetype/fonts-japanese-gothic.ttf (fonts-japanese-gothic.ttf) in auto mode
[nightly/e2e (5 browsers and devices)   ]   | update-alternatives: using /usr/share/sounds/sf2/TimGM6mb.sf2 to provide /usr/share/sounds/sf2/default-GM.sf2 (default-GM.sf2) in auto mode
[nightly/e2e (5 browsers and devices)   ]   | update-alternatives: using /usr/share/sounds/sf2/TimGM6mb.sf2 to provide /usr/share/sounds/sf3/default-GM.sf3 (default-GM.sf3) in auto mode
[nightly/e2e (5 browsers and devices)   ]   | Created symlink /etc/systemd/user/graphical-session-pre.target.wants/session-migration.service → /usr/lib/systemd/user/session-migration.service.

[nightly/e2e (5 browsers and devices)   ]   | update-alternatives: using /usr/lib/aarch64-linux-gnu/lapack/liblapack.so.3 to provide /usr/lib/aarch64-linux-gnu/liblapack.so.3 (liblapack.so.3-aarch64-linux-gnu) in auto mode
[nightly/e2e (5 browsers and devices)   ]   | update-alternatives: using /usr/share/icons/Adwaita/cursor.theme to provide /usr/share/icons/default/index.theme (x-cursor-theme) in auto mode
[nightly/e2e (5 browsers and devices)   ]   | |                                                                                |   0% of 190.5 MiB
[nightly/e2e (5 browsers and devices)   ]   | Chrome for Testing 156.0.8078.4 (playwright chromium v1248) downloaded to /root/.cache/ms-playwright/chromium-1248
[nightly/e2e (5 browsers and devices)   ]   | |                                                                                |   0% of 1.9 MiB
[nightly/e2e (5 browsers and devices)   ]   | FFmpeg (playwright ffmpeg v1013) downloaded to /root/.cache/ms-playwright/ffmpeg-1013
[nightly/e2e (5 browsers and devices)   ]   | |                                                                                |   0% of 119.9 MiB
[nightly/e2e (5 browsers and devices)   ]   | Chrome Headless Shell 156.0.8078.4 (playwright chromium-headless-shell v1248) downloaded to /root/.cache/ms-playwright/chromium_headless_shell-1248
[nightly/e2e (5 browsers and devices)   ]   | |                                                                                |   0% of 102.7 MiB
[nightly/e2e (5 browsers and devices)   ]   | Firefox 157.0 (playwright firefox v1555) downloaded to /root/.cache/ms-playwright/firefox-1555
[nightly/e2e (5 browsers and devices)   ]   | |                                                                                |   0% of 97.1 MiB
[nightly/e2e (5 browsers and devices)   ]   | WebKit 27.2 (playwright webkit v2370) downloaded to /root/.cache/ms-playwright/webkit-2370
[nightly/e2e (5 browsers and devices)   ]   ✅  Success - Main npx playwright install --with-deps chromium firefox webkit [12m13.294186917s]
[nightly/e2e (5 browsers and devices)   ] ⭐ Run Main npm run test:e2e:all
[nightly/e2e (5 browsers and devices)   ]   | 
[nightly/e2e (5 browsers and devices)   ]   | > labflow-lite@1.0.0 test:e2e:all
[nightly/e2e (5 browsers and devices)   ]   | > playwright test e2e/
[nightly/e2e (5 browsers and devices)   ]   | 
[nightly/e2e (5 browsers and devices)   ]   | 
[nightly/e2e (5 browsers and devices)   ]   | Running 37 tests using 5 workers
[nightly/e2e (5 browsers and devices)   ]   | 
[nightly/e2e (5 browsers and devices)   ]   | 
[nightly/e2e (5 browsers and devices)   ]   |   37 passed (12.6s)
[nightly/e2e (5 browsers and devices)   ]   ❓  ::notice title=🎭 Playwright Run Summary::  37 passed (12.6s)
[nightly/e2e (5 browsers and devices)   ]   ✅  Success - Main npm run test:e2e:all [13.420469417s]
[nightly/e2e (5 browsers and devices)   ] ⭐ Run Main upload Playwright report
[nightly/e2e (5 browsers and devices)   ]   | With the provided path, there will be 1 file uploaded
[nightly/e2e (5 browsers and devices)   ]   | Artifact name is valid!
[nightly/e2e (5 browsers and devices)   ]   | Root directory input is valid!
[nightly/e2e (5 browsers and devices)   ]   | Beginning upload of artifact content to blob storage
[nightly/e2e (5 browsers and devices)   ]   | Uploaded bytes 214778
[nightly/e2e (5 browsers and devices)   ]   | Finished uploading artifact content to blob storage!
[nightly/e2e (5 browsers and devices)   ]   | SHA256 digest of uploaded artifact zip is 59798ac0502abf1481aeeada5e335426b8ed48ab1a2d3bacc3b0efef9f94012b
[nightly/e2e (5 browsers and devices)   ]   | Finalizing artifact upload
[nightly/e2e (5 browsers and devices)   ]   | Artifact playwright-report-nightly.zip successfully finalized. Artifact ID 2632251583
[nightly/e2e (5 browsers and devices)   ]   | Artifact playwright-report-nightly has been successfully uploaded! Final size is 214778 bytes. Artifact ID is 2632251583
[nightly/e2e (5 browsers and devices)   ]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/2632251583
[nightly/e2e (5 browsers and devices)   ]   ✅  Success - Main upload Playwright report [1.206074917s]
[nightly/e2e (5 browsers and devices)   ]   ⚙  ::set-output:: artifact-id=2632251583
[nightly/e2e (5 browsers and devices)   ]   ⚙  ::set-output:: artifact-digest=59798ac0502abf1481aeeada5e335426b8ed48ab1a2d3bacc3b0efef9f94012b
[nightly/e2e (5 browsers and devices)   ]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/2632251583
[nightly/e2e (5 browsers and devices)   ] ⭐ Run Post actions/setup-node@v4
[nightly/e2e (5 browsers and devices)   ]   | Cache Size: ~55 MB (57758154 B)
[nightly/e2e (5 browsers and devices)   ]   | Cache saved successfully
[nightly/e2e (5 browsers and devices)   ]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[nightly/e2e (5 browsers and devices)   ]   ✅  Success - Post actions/setup-node@v4 [973.946958ms]
[nightly/e2e (5 browsers and devices)   ] ⭐ Run Complete job
[nightly/e2e (5 browsers and devices)   ] Cleaning up container for job e2e (5 browsers and devices)
[nightly/e2e (5 browsers and devices)   ]   ✅  Success - Complete job
[nightly/e2e (5 browsers and devices)   ] 🏁  Job succeeded
act exit: 0
wall time: 806 s`,
  '93-quarantine-lap': `$ node scripts/lap-lai.mjs 30 test/quarantine --tagsFilter=quarantine
red in 13/30 runs (17.2 s)`,
  '93-th-do': `$ git switch -q pr/30-cho && act pull_request -W demo9/wf/th93.yml -e demo9/pr-event.json --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"; git switch -q main
time="2026-11-01T08:35:50+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:35:50+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[gate/unit] ⭐ Run Set up job
[gate/unit] 🚀  Start image=catthehacker/ubuntu:act-24.04
[gate/unit]   ✅  Success - Set up job
[gate/unit] ⭐ Run Main actions/checkout@v4
[gate/unit]   ✅  Success - Main actions/checkout@v4 [260.492583ms]
[gate/unit] ⭐ Run Main actions/setup-node@v4
[gate/unit]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[gate/unit]   ❓  ::group::Environment details
[gate/unit]   | node: v22.23.4
[gate/unit]   | npm: 10.9.9
[gate/unit]   | yarn: 
[gate/unit]   ❓  ::endgroup::
[gate/unit]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[gate/unit]   | /root/.npm
[gate/unit]   ⚙  ***
[gate/unit]   | Cache Size: ~55 MB (57755507 B)
[gate/unit]   | Cache restored successfully
[gate/unit]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[gate/unit]   ✅  Success - Main actions/setup-node@v4 [2.515904333s]
[gate/unit]   ⚙  ::set-output:: node-version=v22.23.4
[gate/unit]   ⚙  ::set-output:: cache-hit=true
[gate/unit]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[gate/unit] ⭐ Run Main npm ci
[gate/unit]   | 
[gate/unit]   | added 568 packages, and audited 569 packages in 17s
[gate/unit]   | 
[gate/unit]   | 123 packages are looking for funding
[gate/unit]   |   run \`npm fund\` for details
[gate/unit]   | 
[gate/unit]   | 13 vulnerabilities (12 moderate, 1 high)
[gate/unit]   | 
[gate/unit]   | To address issues that do not require attention, run:
[gate/unit]   |   npm audit fix
[gate/unit]   | 
[gate/unit]   | To address all issues possible, run:
[gate/unit]   |   npm audit fix --force
[gate/unit]   | 
[gate/unit]   | Some issues need review, and may require choosing
[gate/unit]   | a different dependency.
[gate/unit]   | 
[gate/unit]   | Run \`npm audit\` for details.
[gate/unit]   ✅  Success - Main npm ci [17.377939083s]
[gate/unit] ⭐ Run Main npm run test:unit
[gate/unit]   | 
[gate/unit]   | > labflow-lite@1.0.0 test:unit
[gate/unit]   | > vitest run src/
[gate/unit]   | 
[gate/unit]   | 
[gate/unit]   |  RUN  v5.0.5 …/labflow-lite
[gate/unit]   | 
[gate/unit]   |  ❯ src/rules/booking.test.js (28 tests | 1 failed) 15ms
[gate/unit]   |    ❯ needsApproval (BR-06 decision table) (7)
[gate/unit]   |      × STUDENT, 30 seats → false 6ms
[gate/unit]   | 
[gate/unit]   | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
[gate/unit]   | 
[gate/unit]   |  FAIL  src/rules/booking.test.js > needsApproval (BR-06 decision table) > STUDENT, 30 seats → false
[gate/unit]   | AssertionError: expected true to be false // Object.is equality
[gate/unit]   | 
[gate/unit]   | - Expected
[gate/unit]   | + Received
[gate/unit]   | 
[gate/unit]   | - false
[gate/unit]   | + true
[gate/unit]   | 
[gate/unit]   |  ❯ src/rules/booking.test.js:47:44
[gate/unit]   |      45|     { role: 'ADMIN', seats: 31, expected: false },
[gate/unit]   |      46|   ])('$role, $seats seats → $expected', ({ role, seats, expected }) =>…
[gate/unit]   |      47|     expect(needsApproval({ role, seats })).toBe(expected);
[gate/unit]   |        |                                            ^
[gate/unit]   |      48|   });
[gate/unit]   |      49|   it.each([0, -5, 2.5])('throws RangeError for %s seats', (seats) => {
[gate/unit]   | 
[gate/unit]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
[gate/unit]   | 
[gate/unit]   | 
[gate/unit]   |  Test Files  1 failed | 19 passed (20)
[gate/unit]   |       Tests  1 failed | 174 passed (175)
[gate/unit]   |    Start at  01:36:14
[gate/unit]   |    Duration  863ms (transform 45%, import 27%, tests 26%, worker 2%)
[gate/unit]   | 
[gate/unit]   ❌  Failure - Main npm run test:unit [1.265020125s]
[gate/unit] exitcode '1': failure
[gate/unit] ⭐ Run Complete job
[gate/unit]   ✅  Success - Complete job
[gate/unit] 🏁  Job failed
[gate/ci-ok] ⭐ Run Set up job
[gate/ci-ok] 🚀  Start image=catthehacker/ubuntu:act-24.04
[gate/ci-ok]   ✅  Success - Set up job
[gate/ci-ok] ⭐ Run Main any required job not successful?
[gate/ci-ok]   | unit: failure
[gate/ci-ok]   ❌  Failure - Main any required job not successful? [61.715167ms]
[gate/ci-ok] exitcode '1': failure
[gate/ci-ok] ⭐ Run Complete job
[gate/ci-ok]   ✅  Success - Complete job
[gate/ci-ok] 🏁  Job failed
Error: Job 'unit' failed
act exit: 1`,
  '93-th-xanh': `$ act push -W demo9/wf/th93.yml --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"
time="2026-11-01T08:35:24+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:35:24+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[gate/unit] ⭐ Run Set up job
[gate/unit] 🚀  Start image=catthehacker/ubuntu:act-24.04
[gate/unit]   ✅  Success - Set up job
[gate/unit] ⭐ Run Main actions/checkout@v4
[gate/unit]   ✅  Success - Main actions/checkout@v4 [255.716583ms]
[gate/unit] ⭐ Run Main actions/setup-node@v4
[gate/unit]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[gate/unit]   ❓  ::group::Environment details
[gate/unit]   | node: v22.23.4
[gate/unit]   | npm: 10.9.9
[gate/unit]   | yarn: 
[gate/unit]   ❓  ::endgroup::
[gate/unit]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[gate/unit]   | /root/.npm
[gate/unit]   ⚙  ***
[gate/unit]   | Cache Size: ~55 MB (57745365 B)
[gate/unit]   | Cache restored successfully
[gate/unit]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[gate/unit]   ✅  Success - Main actions/setup-node@v4 [2.538164041s]
[gate/unit]   ⚙  ::set-output:: node-version=v22.23.4
[gate/unit]   ⚙  ::set-output:: cache-hit=true
[gate/unit]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[gate/unit] ⭐ Run Main npm ci
[gate/unit]   | 
[gate/unit]   | added 568 packages, and audited 569 packages in 13s
[gate/unit]   | 
[gate/unit]   | 123 packages are looking for funding
[gate/unit]   |   run \`npm fund\` for details
[gate/unit]   | 
[gate/unit]   | 13 vulnerabilities (12 moderate, 1 high)
[gate/unit]   | 
[gate/unit]   | To address issues that do not require attention, run:
[gate/unit]   |   npm audit fix
[gate/unit]   | 
[gate/unit]   | To address all issues possible, run:
[gate/unit]   |   npm audit fix --force
[gate/unit]   | 
[gate/unit]   | Some issues need review, and may require choosing
[gate/unit]   | a different dependency.
[gate/unit]   | 
[gate/unit]   | Run \`npm audit\` for details.
[gate/unit]   ✅  Success - Main npm ci [12.861175792s]
[gate/unit] ⭐ Run Main npm run test:unit
[gate/unit]   | 
[gate/unit]   | > labflow-lite@1.0.0 test:unit
[gate/unit]   | > vitest run src/
[gate/unit]   | 
[gate/unit]   | 
[gate/unit]   |  RUN  v5.0.5 …/labflow-lite
[gate/unit]   | 
[gate/unit]   | 
[gate/unit]   |  Test Files  20 passed (20)
[gate/unit]   |       Tests  175 passed (175)
[gate/unit]   |    Start at  01:35:44
[gate/unit]   |    Duration  746ms (transform 47%, tests 25%, import 24%, worker 3%)
[gate/unit]   | 
[gate/unit]   ✅  Success - Main npm run test:unit [1.143392s]
[gate/unit] ⭐ Run Post actions/setup-node@v4
[gate/unit]   | Cache Size: ~55 MB (57755507 B)
[gate/unit]   | Cache saved successfully
[gate/unit]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[gate/unit]   ✅  Success - Post actions/setup-node@v4 [631.706709ms]
[gate/unit] ⭐ Run Complete job
[gate/unit] Cleaning up container for job unit
[gate/unit]   ✅  Success - Complete job
[gate/unit] 🏁  Job succeeded
[gate/ci-ok] ⭐ Run Set up job
[gate/ci-ok] 🚀  Start image=catthehacker/ubuntu:act-24.04
[gate/ci-ok]   ✅  Success - Set up job
[gate/ci-ok] ⭐ Run Main echo "ci-ok — every required job passed"
[gate/ci-ok]   | ci-ok — every required job passed
[gate/ci-ok]   ✅  Success - Main echo "ci-ok — every required job passed" [59.540084ms]
[gate/ci-ok] ⭐ Run Complete job
[gate/ci-ok] Cleaning up container for job ci-ok
[gate/ci-ok]   ✅  Success - Complete job
[gate/ci-ok] 🏁  Job succeeded
act exit: 0`,
  '94-ma-tran': `$ T0=$(date +%s); act push -W demo9/wf/94-ma-tran.yml --cache-server-path .act/cache; echo "act exit: $?"; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T07:51:32+07:00" level=warning msg="Ignoring \\"--artifact-server-path=.act/artifacts\\" from …/labflow-lite/.actrc: this flag is not allowed in a project .actrc. Set it in your user config or on the command line, or pass --trust-project-actrc."
time="2026-11-01T07:51:32+07:00" level=warning msg="…/labflow-lite/.actrc is a project file. It may only set flags that do not reach host resources."
time="2026-11-01T07:51:32+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

[tests/unit (Node 20)-1] ⭐ Run Set up job
[tests/unit (Node 24)-3] ⭐ Run Set up job
[tests/unit (Node 22)-2] ⭐ Run Set up job
[tests/unit (Node 20)-1] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit (Node 24)-3] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit (Node 22)-2] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit (Node 22)-2]   ✅  Success - Set up job
[tests/unit (Node 20)-1]   ✅  Success - Set up job
[tests/unit (Node 24)-3]   ✅  Success - Set up job
[tests/unit (Node 22)-2] 🧪  Matrix: map[node:22]
[tests/unit (Node 22)-2] ⭐ Run Main actions/checkout@v4
[tests/unit (Node 22)-2]   ✅  Success - Main actions/checkout@v4 [248.50725ms]
[tests/unit (Node 22)-2] ⭐ Run Main actions/setup-node@v4
[tests/unit (Node 24)-3] 🧪  Matrix: map[node:24]
[tests/unit (Node 24)-3] ⭐ Run Main actions/checkout@v4
[tests/unit (Node 24)-3]   ✅  Success - Main actions/checkout@v4 [289.753667ms]
[tests/unit (Node 24)-3] ⭐ Run Main actions/setup-node@v4
[tests/unit (Node 20)-1] 🧪  Matrix: map[node:20]
[tests/unit (Node 20)-1] ⭐ Run Main actions/checkout@v4
[tests/unit (Node 20)-1]   ✅  Success - Main actions/checkout@v4 [278.288334ms]
[tests/unit (Node 20)-1] ⭐ Run Main actions/setup-node@v4
[tests/unit (Node 22)-2]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/unit (Node 22)-2]   ❓  ::group::Environment details
[tests/unit (Node 22)-2]   | node: v22.23.4
[tests/unit (Node 22)-2]   | npm: 10.9.9
[tests/unit (Node 22)-2]   | yarn: 
[tests/unit (Node 22)-2]   ❓  ::endgroup::
[tests/unit (Node 22)-2]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/unit (Node 22)-2]   | /root/.npm
[tests/unit (Node 22)-2]   ⚙  ***
[tests/unit (Node 22)-2]   | Cache Size: ~55 MB (57764523 B)
[tests/unit (Node 22)-2]   | Cache restored successfully
[tests/unit (Node 22)-2]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit (Node 22)-2]   ✅  Success - Main actions/setup-node@v4 [3.865849042s]
[tests/unit (Node 22)-2]   ⚙  ::set-output:: node-version=v22.23.4
[tests/unit (Node 22)-2]   ⚙  ::set-output:: cache-hit=true
[tests/unit (Node 22)-2]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/unit (Node 22)-2] ⭐ Run Main node --version
[tests/unit (Node 24)-3]   | Attempting to download 24...
[tests/unit (Node 22)-2]   | v22.23.4
[tests/unit (Node 22)-2]   ✅  Success - Main node --version [168.974292ms]
[tests/unit (Node 22)-2] ⭐ Run Main npm ci
[tests/unit (Node 20)-1]   | Attempting to download 20...
[tests/unit (Node 24)-3]   | Acquiring 24.22.2 - arm64 from https://github.com/actions/node-versions/releases/download/24.22.2-40806817314/node-24.22.2-linux-arm64.tar.gz
[tests/unit (Node 20)-1]   | Acquiring 20.20.2 - arm64 from https://github.com/actions/node-versions/releases/download/20.20.2-23521894959/node-20.20.2-linux-arm64.tar.gz
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | added 568 packages, and audited 569 packages in 14s
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | 123 packages are looking for funding
[tests/unit (Node 22)-2]   |   run \`npm fund\` for details
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | To address issues that do not require attention, run:
[tests/unit (Node 22)-2]   |   npm audit fix
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | To address all issues possible, run:
[tests/unit (Node 22)-2]   |   npm audit fix --force
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | Some issues need review, and may require choosing
[tests/unit (Node 22)-2]   | a different dependency.
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | Run \`npm audit\` for details.
[tests/unit (Node 22)-2]   ✅  Success - Main npm ci [14.577826042s]
[tests/unit (Node 22)-2] ⭐ Run Main npm run test:unit
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | > labflow-lite@1.0.0 test:unit
[tests/unit (Node 22)-2]   | > vitest run src/
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   |  Test Files  15 passed (15)
[tests/unit (Node 22)-2]   |       Tests  116 passed (116)
[tests/unit (Node 22)-2]   |    Start at  00:51:57
[tests/unit (Node 22)-2]   |    Duration  646ms (transform 44%, import 27%, tests 26%, worker 3%)
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   ✅  Success - Main npm run test:unit [1.076033209s]
[tests/unit (Node 22)-2] ⭐ Run Post actions/setup-node@v4
[tests/unit (Node 22)-2]   | Cache Size: ~55 MB (57774074 B)
[tests/unit (Node 22)-2]   | Cache saved successfully
[tests/unit (Node 22)-2]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit (Node 22)-2]   ✅  Success - Post actions/setup-node@v4 [719.49875ms]
[tests/unit (Node 22)-2] ⭐ Run Complete job
[tests/unit (Node 22)-2] Cleaning up container for job unit (Node 22)
[tests/unit (Node 22)-2]   ✅  Success - Complete job
[tests/unit (Node 22)-2] 🏁  Job succeeded
[tests/unit (Node 20)-1]   | Extracting ...
[tests/unit (Node 20)-1]   | Adding to the cache ...
[tests/unit (Node 20)-1]   ❓  ::group::Environment details
[tests/unit (Node 20)-1]   | node: v20.20.2
[tests/unit (Node 20)-1]   | npm: 10.8.2
[tests/unit (Node 20)-1]   | yarn: 
[tests/unit (Node 20)-1]   ❓  ::endgroup::
[tests/unit (Node 20)-1]   | [command]/opt/hostedtoolcache/node/20.20.2/arm64/bin/npm config get cache
[tests/unit (Node 20)-1]   | /root/.npm
[tests/unit (Node 20)-1]   ⚙  ***
[tests/unit (Node 20)-1]   | Cache Size: ~55 MB (57774074 B)
[tests/unit (Node 20)-1]   | Cache restored successfully
[tests/unit (Node 20)-1]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit (Node 20)-1]   ✅  Success - Main actions/setup-node@v4 [1m52.527816167s]
[tests/unit (Node 20)-1]   ⚙  ::set-output:: node-version=v20.20.2
[tests/unit (Node 20)-1]   ⚙  ::set-output:: cache-hit=true
[tests/unit (Node 20)-1]   ⚙  ::add-path:: /opt/hostedtoolcache/node/20.20.2/arm64/bin
[tests/unit (Node 20)-1] ⭐ Run Main node --version
[tests/unit (Node 20)-1]   | v20.20.2
[tests/unit (Node 20)-1]   ✅  Success - Main node --version [89.777459ms]
[tests/unit (Node 20)-1] ⭐ Run Main npm ci
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@asamuzakjp/css-color@7.1.9',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.22.2 || ^24.15.0 || >=26.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@asamuzakjp/dom-selector@10.0.5',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.22.2 || ^24.15.0 || >=26.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/compat-data@8.0.5',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/core@8.0.10',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/code-frame@8.0.6',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-validator-identifier@8.0.6',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/generator@8.0.10',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-annotate-as-pure@8.0.0',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-compilation-targets@8.0.7',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-create-class-features-plugin@8.0.10',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-globals@8.0.6',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-member-expression-to-functions@8.0.5',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-module-imports@8.0.0',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-module-transforms@8.0.6',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-validator-identifier@8.0.6',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-optimise-call-expression@8.0.0',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-plugin-utils@8.0.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-replace-supers@8.0.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-skip-transparent-expression-wrappers@8.0.0',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-string-parser@8.0.8',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-validator-option@8.0.0',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helpers@8.0.10',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/parser@8.0.10',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/plugin-proposal-decorators@8.0.2',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/plugin-syntax-decorators@8.0.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/plugin-syntax-jsx@8.0.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/plugin-syntax-typescript@8.0.3',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/plugin-transform-destructuring@8.0.5',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/plugin-transform-explicit-resource-management@8.0.5',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/plugin-transform-modules-commonjs@8.0.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/plugin-transform-react-display-name@8.0.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/plugin-transform-react-jsx@8.0.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/plugin-transform-react-jsx-development@8.0.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/plugin-transform-react-pure-annotations@8.0.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/plugin-transform-typescript@8.0.6',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/preset-react@8.0.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/preset-typescript@8.0.7',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/template@8.0.0',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/code-frame@8.0.6',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-validator-identifier@8.0.6',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/traverse@8.0.10',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/code-frame@8.0.6',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-validator-identifier@8.0.6',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/types@8.0.10',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@babel/helper-validator-identifier@8.0.6',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.11.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@mswjs/interceptors@0.45.10',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@stryker-mutator/api@10.1.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@stryker-mutator/core@10.1.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@stryker-mutator/instrumenter@10.1.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@stryker-mutator/vitest-runner@10.1.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@testing-library/jest-dom@7.0.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22', npm: '>=6', yarn: '>=1' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@vitest/istanbul-lib-coverage@1.0.2',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@vitest/istanbul-lib-instrument@1.0.2',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@vitest/istanbul-lib-report@1.0.2',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: '@vitest/istanbul-lib-source-maps@1.0.2',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: 'data-urls@8.0.0',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.14.0 || >=24.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: 'html-encoding-sniffer@7.0.0',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.13.0 || >=24.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: 'jsdom@30.1.3',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.22.2 || ^24.15.0 || >=26.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: 'msw@3.0.3',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22.12.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: 'cookie@2.0.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: 'testcontainers@12.2.1',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>= 22.22' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: 'tr46@7.0.0',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.14.0 || >=24.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: 'undici@8.12.3',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '>=22.19.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: 'vitest@5.0.5',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.12.0 || ^24.0.0 || >=26.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: 'w3c-xmlserializer@6.0.0',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.22.2 || ^24.15.0 || >=26.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE Unsupported engine {
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   package: 'whatwg-url@17.3.0',
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   required: { node: '^22.14.0 || >=24.0.0' },
[tests/unit (Node 20)-1]   | npm warn EBADENGINE   current: { node: 'v20.20.2', npm: '10.8.2' }
[tests/unit (Node 20)-1]   | npm warn EBADENGINE }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | added 568 packages, and audited 569 packages in 13s
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | 123 packages are looking for funding
[tests/unit (Node 20)-1]   |   run \`npm fund\` for details
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | To address issues that do not require attention, run:
[tests/unit (Node 20)-1]   |   npm audit fix
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | To address all issues possible, run:
[tests/unit (Node 20)-1]   |   npm audit fix --force
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | Some issues need review, and may require choosing
[tests/unit (Node 20)-1]   | a different dependency.
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | Run \`npm audit\` for details.
[tests/unit (Node 20)-1]   ✅  Success - Main npm ci [13.610046708s]
[tests/unit (Node 20)-1] ⭐ Run Main npm run test:unit
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | > labflow-lite@1.0.0 test:unit
[tests/unit (Node 20)-1]   | > vitest run src/
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js (4 tests | 4 failed) 72ms
[tests/unit (Node 20)-1]   |    ❯ createHttpMailer (4)
[tests/unit (Node 20)-1]   |      × posts { to, subject } with a Bearer key and returns the id 50ms
[tests/unit (Node 20)-1]   |      × 429 → RATE_LIMITED 8ms
[tests/unit (Node 20)-1]   |      × 400 → MAIL_FAILED with the status as the cause 4ms
[tests/unit (Node 20)-1]   |      × 503 → MAIL_FAILED with the status as the cause 3ms
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > posts { to, subject } with a Bearer key and returns the id
[tests/unit (Node 20)-1]   | AssertionError: promise rejected "TypeError: fetch failed" instead of resolving
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js:21:70
[tests/unit (Node 20)-1]   |      19| describe('createHttpMailer', () => {
[tests/unit (Node 20)-1]   |      20|   it('posts { to, subject } with a Bearer key and returns the id', asy…
[tests/unit (Node 20)-1]   |      21|     await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).…
[tests/unit (Node 20)-1]   |        |                                                                      ^
[tests/unit (Node 20)-1]   |      22|     expect(requests).toEqual([{ auth: 'Bearer test-key', body: { to: '…
[tests/unit (Node 20)-1]   |      23|   });
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | Caused by: TypeError: fetch failed
[tests/unit (Node 20)-1]   |  ❯ Object.send src/lib/mailer.js:13:19
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js:21:5
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | Caused by: TypeError: Promise.withResolvers is not a function
[tests/unit (Node 20)-1]   |  ❯ new TcpSocketController node_modules/@mswjs/interceptors/lib/node/net-B8GL5tms.js:435:36
[tests/unit (Node 20)-1]   |  ❯ new TlsSocketController node_modules/@mswjs/interceptors/lib/node/net-B8GL5tms.js:1166:3
[tests/unit (Node 20)-1]   |  ❯ TLSSocket.connect node_modules/@mswjs/interceptors/lib/node/net-B8GL5tms.js:1559:20
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/8]⎯
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > posts { to, subject } with a Bearer key and returns the id
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > 429 → RATE_LIMITED
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > 400 → MAIL_FAILED with the status as the cause
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > 503 → MAIL_FAILED with the status as the cause
[tests/unit (Node 20)-1]   | TypeError: currentHandlers.intersection is not a function or its return value is not iterable
[tests/unit (Node 20)-1]   |  ❯ AsyncHandlersController.reset node_modules/msw/src/core/experimental/handlers-controller.ts:181:43
[tests/unit (Node 20)-1]   |  ❯ Object.resetHandlers node_modules/msw/src/core/experimental/define-network.ts:254:26
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js:14:26
[tests/unit (Node 20)-1]   |      12| const server = setupServer(ok);
[tests/unit (Node 20)-1]   |      13| beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
[tests/unit (Node 20)-1]   |      14| afterEach(() => { server.resetHandlers(); requests.length = 0; });
[tests/unit (Node 20)-1]   |        |                          ^
[tests/unit (Node 20)-1]   |      15| afterAll(() => server.close());
[tests/unit (Node 20)-1]   |      16| const mailer = createHttpMailer({ baseUrl: API, apiKey: 'test-key' });
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/8]⎯
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > 429 → RATE_LIMITED
[tests/unit (Node 20)-1]   | AssertionError: expected TypeError: fetch failed to match object { code: 'RATE_LIMITED' }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | - Expected
[tests/unit (Node 20)-1]   | + Received
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | - {
[tests/unit (Node 20)-1]   | -   "code": "RATE_LIMITED",
[tests/unit (Node 20)-1]   | + TypeError {
[tests/unit (Node 20)-1]   | +   "message": "fetch failed",
[tests/unit (Node 20)-1]   | +   "cause": TypeError {
[tests/unit (Node 20)-1]   | +     "message": "Promise.withResolvers is not a function",
[tests/unit (Node 20)-1]   | +   },
[tests/unit (Node 20)-1]   |   }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js:27:62
[tests/unit (Node 20)-1]   |      25|   it('429 → RATE_LIMITED', async () => {
[tests/unit (Node 20)-1]   |      26|     reply(429);
[tests/unit (Node 20)-1]   |      27|     await expect(mailer.send({ to: 'a@b.c', subject: 'Hi' })).rejects.…
[tests/unit (Node 20)-1]   |        |                                                              ^
[tests/unit (Node 20)-1]   |      28|   });
[tests/unit (Node 20)-1]   |      29|
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/8]⎯
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > 400 → MAIL_FAILED with the status as the cause
[tests/unit (Node 20)-1]   | AssertionError: expected TypeError: fetch failed to match object { code: 'MAIL_FAILED', …(1) }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | - Expected
[tests/unit (Node 20)-1]   | + Received
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | - {
[tests/unit (Node 20)-1]   | -   "cause": {
[tests/unit (Node 20)-1]   | -     "message": "HTTP 400",
[tests/unit (Node 20)-1]   | + TypeError {
[tests/unit (Node 20)-1]   | +   "message": "fetch failed",
[tests/unit (Node 20)-1]   | +   "cause": TypeError {
[tests/unit (Node 20)-1]   | +     "message": "Promise.withResolvers is not a function",
[tests/unit (Node 20)-1]   |     },
[tests/unit (Node 20)-1]   | -   "code": "MAIL_FAILED",
[tests/unit (Node 20)-1]   |   }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js:33:7
[tests/unit (Node 20)-1]   |      31|     reply(status);
[tests/unit (Node 20)-1]   |      32|     await expect(mailer.send({ to: 'a@b.c', subject: 'Hi' }))
[tests/unit (Node 20)-1]   |      33|       .rejects.toMatchObject({ code: 'MAIL_FAILED', cause: { message: …
[tests/unit (Node 20)-1]   |        |       ^
[tests/unit (Node 20)-1]   |      34|   });
[tests/unit (Node 20)-1]   |      35| });
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/8]⎯
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > 503 → MAIL_FAILED with the status as the cause
[tests/unit (Node 20)-1]   | AssertionError: expected TypeError: fetch failed to match object { code: 'MAIL_FAILED', …(1) }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | - Expected
[tests/unit (Node 20)-1]   | + Received
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | - {
[tests/unit (Node 20)-1]   | -   "cause": {
[tests/unit (Node 20)-1]   | -     "message": "HTTP 503",
[tests/unit (Node 20)-1]   | + TypeError {
[tests/unit (Node 20)-1]   | +   "message": "fetch failed",
[tests/unit (Node 20)-1]   | +   "cause": TypeError {
[tests/unit (Node 20)-1]   | +     "message": "Promise.withResolvers is not a function",
[tests/unit (Node 20)-1]   |     },
[tests/unit (Node 20)-1]   | -   "code": "MAIL_FAILED",
[tests/unit (Node 20)-1]   |   }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js:33:7
[tests/unit (Node 20)-1]   |      31|     reply(status);
[tests/unit (Node 20)-1]   |      32|     await expect(mailer.send({ to: 'a@b.c', subject: 'Hi' }))
[tests/unit (Node 20)-1]   |      33|       .rejects.toMatchObject({ code: 'MAIL_FAILED', cause: { message: …
[tests/unit (Node 20)-1]   |        |       ^
[tests/unit (Node 20)-1]   |      34|   });
[tests/unit (Node 20)-1]   |      35| });
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/8]⎯
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  Test Files  1 failed | 14 passed (15)
[tests/unit (Node 20)-1]   |       Tests  4 failed | 112 passed (116)
[tests/unit (Node 20)-1]   |    Start at  00:53:47
[tests/unit (Node 20)-1]   |    Duration  939ms (transform 46%, import 29%, tests 22%, worker 3%)
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   ❌  Failure - Main npm run test:unit [1.399499667s]
[tests/unit (Node 20)-1] exitcode '1': failure
[tests/unit (Node 20)-1] ⭐ Run Complete job
[tests/unit (Node 20)-1]   ✅  Success - Complete job
[tests/unit (Node 20)-1] 🏁  Job failed
[tests/unit (Node 24)-3]   | Extracting ...
[tests/unit (Node 24)-3]   | Adding to the cache ...
[tests/unit (Node 24)-3]   ❓  ::group::Environment details
[tests/unit (Node 24)-3]   | node: v24.22.2
[tests/unit (Node 24)-3]   | npm: 11.19.1
[tests/unit (Node 24)-3]   | yarn: 
[tests/unit (Node 24)-3]   ❓  ::endgroup::
[tests/unit (Node 24)-3]   | [command]/opt/hostedtoolcache/node/24.22.2/arm64/bin/npm config get cache
[tests/unit (Node 24)-3]   | /root/.npm
[tests/unit (Node 24)-3]   ⚙  ***
[tests/unit (Node 24)-3]   | Cache Size: ~55 MB (57774074 B)
[tests/unit (Node 24)-3]   | Cache restored successfully
[tests/unit (Node 24)-3]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit (Node 24)-3]   ✅  Success - Main actions/setup-node@v4 [2m25.975465917s]
[tests/unit (Node 24)-3]   ⚙  ::set-output:: node-version=v24.22.2
[tests/unit (Node 24)-3]   ⚙  ::set-output:: cache-hit=true
[tests/unit (Node 24)-3]   ⚙  ::add-path:: /opt/hostedtoolcache/node/24.22.2/arm64/bin
[tests/unit (Node 24)-3] ⭐ Run Main node --version
[tests/unit (Node 24)-3]   | v24.22.2
[tests/unit (Node 24)-3]   ✅  Success - Main node --version [82.852917ms]
[tests/unit (Node 24)-3] ⭐ Run Main npm ci
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   | added 568 packages, and audited 569 packages in 17s
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   | 123 packages are looking for funding
[tests/unit (Node 24)-3]   |   run \`npm fund\` for details
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   | To address issues that do not require attention, run:
[tests/unit (Node 24)-3]   |   npm audit fix
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   | To address all issues possible, run:
[tests/unit (Node 24)-3]   |   npm audit fix --force
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   | Some issues need review, and may require choosing
[tests/unit (Node 24)-3]   | a different dependency.
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   | Run \`npm audit\` for details.
[tests/unit (Node 24)-3]   ✅  Success - Main npm ci [16.905360791s]
[tests/unit (Node 24)-3] ⭐ Run Main npm run test:unit
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   | > labflow-lite@1.0.0 test:unit
[tests/unit (Node 24)-3]   | > vitest run src/
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   |  Test Files  15 passed (15)
[tests/unit (Node 24)-3]   |       Tests  116 passed (116)
[tests/unit (Node 24)-3]   |    Start at  00:54:23
[tests/unit (Node 24)-3]   |    Duration  700ms (transform 54%, import 22%, tests 20%, worker 3%)
[tests/unit (Node 24)-3]   | 
[tests/unit (Node 24)-3]   ✅  Success - Main npm run test:unit [1.113110083s]
[tests/unit (Node 24)-3] ⭐ Run Post actions/setup-node@v4
[tests/unit (Node 24)-3]   | Cache Size: ~55 MB (57761464 B)
[tests/unit (Node 24)-3]   | Cache saved successfully
[tests/unit (Node 24)-3]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/unit (Node 24)-3]   ✅  Success - Post actions/setup-node@v4 [627.433709ms]
[tests/unit (Node 24)-3] ⭐ Run Complete job
[tests/unit (Node 24)-3] Cleaning up container for job unit (Node 24)
[tests/unit (Node 24)-3]   ✅  Success - Complete job
[tests/unit (Node 24)-3] 🏁  Job failed
Error: Job 'unit (Node \${{ matrix.node }})' failed
act exit: 1
wall time: 174 s`,
  '94-mot-job': `$ T0=$(date +%s); act push -W demo9/wf/94-mot-job.yml --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T08:36:18+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:36:18+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[shards/slow suite (one job)] ⭐ Run Set up job
[shards/slow suite (one job)] 🚀  Start image=catthehacker/ubuntu:act-24.04
[shards/slow suite (one job)]   ✅  Success - Set up job
[shards/slow suite (one job)] ⭐ Run Main actions/checkout@v4
[shards/slow suite (one job)]   ✅  Success - Main actions/checkout@v4 [268.53475ms]
[shards/slow suite (one job)] ⭐ Run Main actions/setup-node@v4
[shards/slow suite (one job)]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[shards/slow suite (one job)]   ❓  ::group::Environment details
[shards/slow suite (one job)]   | node: v22.23.4
[shards/slow suite (one job)]   | npm: 10.9.9
[shards/slow suite (one job)]   | yarn: 
[shards/slow suite (one job)]   ❓  ::endgroup::
[shards/slow suite (one job)]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[shards/slow suite (one job)]   | /root/.npm
[shards/slow suite (one job)]   ⚙  ***
[shards/slow suite (one job)]   | Cache Size: ~55 MB (57755507 B)
[shards/slow suite (one job)]   | Cache restored successfully
[shards/slow suite (one job)]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[shards/slow suite (one job)]   ✅  Success - Main actions/setup-node@v4 [2.581324667s]
[shards/slow suite (one job)]   ⚙  ::set-output:: node-version=v22.23.4
[shards/slow suite (one job)]   ⚙  ::set-output:: cache-hit=true
[shards/slow suite (one job)]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[shards/slow suite (one job)] ⭐ Run Main npm ci
[shards/slow suite (one job)]   | 
[shards/slow suite (one job)]   | added 568 packages, and audited 569 packages in 17s
[shards/slow suite (one job)]   | 
[shards/slow suite (one job)]   | 123 packages are looking for funding
[shards/slow suite (one job)]   |   run \`npm fund\` for details
[shards/slow suite (one job)]   | 
[shards/slow suite (one job)]   | 13 vulnerabilities (12 moderate, 1 high)
[shards/slow suite (one job)]   | 
[shards/slow suite (one job)]   | To address issues that do not require attention, run:
[shards/slow suite (one job)]   |   npm audit fix
[shards/slow suite (one job)]   | 
[shards/slow suite (one job)]   | To address all issues possible, run:
[shards/slow suite (one job)]   |   npm audit fix --force
[shards/slow suite (one job)]   | 
[shards/slow suite (one job)]   | Some issues need review, and may require choosing
[shards/slow suite (one job)]   | a different dependency.
[shards/slow suite (one job)]   | 
[shards/slow suite (one job)]   | Run \`npm audit\` for details.
[shards/slow suite (one job)]   ✅  Success - Main npm ci [17.023959958s]
[shards/slow suite (one job)] ⭐ Run Main npx vitest run demo9/cham --no-file-parallelism --reporter=tree
[shards/slow suite (one job)]   | 
[shards/slow suite (one job)]   |  RUN  v5.0.5 …/labflow-lite
[shards/slow suite (one job)]   | 
[shards/slow suite (one job)]   | 
[shards/slow suite (one job)]   |  Test Files  6 passed (6)
[shards/slow suite (one job)]   |       Tests  6 passed (6)
[shards/slow suite (one job)]   |    Start at  01:36:42
[shards/slow suite (one job)]   |    Duration  10.61s (tests 99%)
[shards/slow suite (one job)]   | 
[shards/slow suite (one job)]   ✅  Success - Main npx vitest run demo9/cham --no-file-parallelism --reporter=tree [11.115720875s]
[shards/slow suite (one job)] ⭐ Run Post actions/setup-node@v4
[shards/slow suite (one job)]   | Cache Size: ~55 MB (57760485 B)
[shards/slow suite (one job)]   | Cache saved successfully
[shards/slow suite (one job)]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[shards/slow suite (one job)]   ✅  Success - Post actions/setup-node@v4 [567.332708ms]
[shards/slow suite (one job)] ⭐ Run Complete job
[shards/slow suite (one job)] Cleaning up container for job slow suite (one job)
[shards/slow suite (one job)]   ✅  Success - Complete job
[shards/slow suite (one job)] 🏁  Job succeeded
act exit: 0
wall time: 36 s`,
  '94-shard-ci': `$ T0=$(date +%s); act push -W demo9/wf/94-shard.yml --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T08:30:33+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T08:30:33+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[shards/slow suite (shard 1/3)-1] ⭐ Run Set up job
[shards/slow suite (shard 1/3)-1] 🚀  Start image=catthehacker/ubuntu:act-24.04
[shards/slow suite (shard 2/3)-2] ⭐ Run Set up job
[shards/slow suite (shard 3/3)-3] ⭐ Run Set up job
[shards/slow suite (shard 2/3)-2] 🚀  Start image=catthehacker/ubuntu:act-24.04
[shards/slow suite (shard 3/3)-3] 🚀  Start image=catthehacker/ubuntu:act-24.04
[shards/slow suite (shard 2/3)-2]   ✅  Success - Set up job
[shards/slow suite (shard 3/3)-3]   ✅  Success - Set up job
[shards/slow suite (shard 1/3)-1]   ✅  Success - Set up job
[shards/slow suite (shard 2/3)-2] 🧪  Matrix: map[shard:2]
[shards/slow suite (shard 2/3)-2] ⭐ Run Main actions/checkout@v4
[shards/slow suite (shard 2/3)-2]   ✅  Success - Main actions/checkout@v4 [384.115708ms]
[shards/slow suite (shard 2/3)-2] ⭐ Run Main actions/setup-node@v4
[shards/slow suite (shard 3/3)-3] 🧪  Matrix: map[shard:3]
[shards/slow suite (shard 3/3)-3] ⭐ Run Main actions/checkout@v4
[shards/slow suite (shard 3/3)-3]   ✅  Success - Main actions/checkout@v4 [390.204875ms]
[shards/slow suite (shard 3/3)-3] ⭐ Run Main actions/setup-node@v4
[shards/slow suite (shard 1/3)-1] 🧪  Matrix: map[shard:1]
[shards/slow suite (shard 1/3)-1] ⭐ Run Main actions/checkout@v4
[shards/slow suite (shard 1/3)-1]   ✅  Success - Main actions/checkout@v4 [928.929084ms]
[shards/slow suite (shard 1/3)-1] ⭐ Run Main actions/setup-node@v4
[shards/slow suite (shard 2/3)-2]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[shards/slow suite (shard 2/3)-2]   ❓  ::group::Environment details
[shards/slow suite (shard 2/3)-2]   | node: v22.23.4
[shards/slow suite (shard 2/3)-2]   | npm: 10.9.9
[shards/slow suite (shard 2/3)-2]   | yarn: 
[shards/slow suite (shard 2/3)-2]   ❓  ::endgroup::
[shards/slow suite (shard 2/3)-2]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[shards/slow suite (shard 2/3)-2]   | /root/.npm
[shards/slow suite (shard 2/3)-2]   ⚙  ***
[shards/slow suite (shard 3/3)-3]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[shards/slow suite (shard 3/3)-3]   ❓  ::group::Environment details
[shards/slow suite (shard 3/3)-3]   | node: v22.23.4
[shards/slow suite (shard 3/3)-3]   | npm: 10.9.9
[shards/slow suite (shard 3/3)-3]   | yarn: 
[shards/slow suite (shard 3/3)-3]   ❓  ::endgroup::
[shards/slow suite (shard 3/3)-3]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[shards/slow suite (shard 3/3)-3]   | /root/.npm
[shards/slow suite (shard 3/3)-3]   ⚙  ***
[shards/slow suite (shard 2/3)-2]   | Cache Size: ~55 MB (57741772 B)
[shards/slow suite (shard 1/3)-1]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[shards/slow suite (shard 1/3)-1]   ❓  ::group::Environment details
[shards/slow suite (shard 1/3)-1]   | node: v22.23.4
[shards/slow suite (shard 1/3)-1]   | npm: 10.9.9
[shards/slow suite (shard 1/3)-1]   | yarn: 
[shards/slow suite (shard 1/3)-1]   ❓  ::endgroup::
[shards/slow suite (shard 1/3)-1]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[shards/slow suite (shard 1/3)-1]   | /root/.npm
[shards/slow suite (shard 1/3)-1]   ⚙  ***
[shards/slow suite (shard 3/3)-3]   | Cache Size: ~55 MB (57741772 B)
[shards/slow suite (shard 1/3)-1]   | Cache Size: ~55 MB (57741772 B)
[shards/slow suite (shard 2/3)-2]   | Cache restored successfully
[shards/slow suite (shard 2/3)-2]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[shards/slow suite (shard 2/3)-2]   ✅  Success - Main actions/setup-node@v4 [8.04514275s]
[shards/slow suite (shard 2/3)-2]   ⚙  ::set-output:: node-version=v22.23.4
[shards/slow suite (shard 2/3)-2]   ⚙  ::set-output:: cache-hit=true
[shards/slow suite (shard 2/3)-2]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[shards/slow suite (shard 2/3)-2] ⭐ Run Main npm ci
[shards/slow suite (shard 3/3)-3]   | Cache restored successfully
[shards/slow suite (shard 3/3)-3]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[shards/slow suite (shard 3/3)-3]   ✅  Success - Main actions/setup-node@v4 [7.235101709s]
[shards/slow suite (shard 3/3)-3]   ⚙  ::set-output:: node-version=v22.23.4
[shards/slow suite (shard 3/3)-3]   ⚙  ::set-output:: cache-hit=true
[shards/slow suite (shard 3/3)-3]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[shards/slow suite (shard 1/3)-1]   | Cache restored successfully
[shards/slow suite (shard 1/3)-1]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[shards/slow suite (shard 3/3)-3] ⭐ Run Main npm ci
[shards/slow suite (shard 1/3)-1]   ✅  Success - Main actions/setup-node@v4 [5.279657875s]
[shards/slow suite (shard 1/3)-1]   ⚙  ::set-output:: cache-hit=true
[shards/slow suite (shard 1/3)-1]   ⚙  ::set-output:: node-version=v22.23.4
[shards/slow suite (shard 1/3)-1]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[shards/slow suite (shard 1/3)-1] ⭐ Run Main npm ci
[shards/slow suite (shard 1/3)-1]   | 
[shards/slow suite (shard 1/3)-1]   | added 568 packages, and audited 569 packages in 33s
[shards/slow suite (shard 1/3)-1]   | 
[shards/slow suite (shard 1/3)-1]   | 123 packages are looking for funding
[shards/slow suite (shard 1/3)-1]   |   run \`npm fund\` for details
[shards/slow suite (shard 1/3)-1]   | 
[shards/slow suite (shard 1/3)-1]   | 13 vulnerabilities (12 moderate, 1 high)
[shards/slow suite (shard 1/3)-1]   | 
[shards/slow suite (shard 1/3)-1]   | To address issues that do not require attention, run:
[shards/slow suite (shard 1/3)-1]   |   npm audit fix
[shards/slow suite (shard 1/3)-1]   | 
[shards/slow suite (shard 1/3)-1]   | To address all issues possible, run:
[shards/slow suite (shard 1/3)-1]   |   npm audit fix --force
[shards/slow suite (shard 1/3)-1]   | 
[shards/slow suite (shard 1/3)-1]   | Some issues need review, and may require choosing
[shards/slow suite (shard 1/3)-1]   | a different dependency.
[shards/slow suite (shard 1/3)-1]   | 
[shards/slow suite (shard 1/3)-1]   | Run \`npm audit\` for details.
[shards/slow suite (shard 1/3)-1]   ✅  Success - Main npm ci [33.720546375s]
[shards/slow suite (shard 1/3)-1] ⭐ Run Main tests of this shard
[shards/slow suite (shard 1/3)-1]   | 
[shards/slow suite (shard 1/3)-1]   |  RUN  v5.0.5 …/labflow-lite
[shards/slow suite (shard 1/3)-1]   | 
[shards/slow suite (shard 3/3)-3]   | 
[shards/slow suite (shard 3/3)-3]   | added 568 packages, and audited 569 packages in 38s
[shards/slow suite (shard 3/3)-3]   | 
[shards/slow suite (shard 3/3)-3]   | 123 packages are looking for funding
[shards/slow suite (shard 3/3)-3]   |   run \`npm fund\` for details
[shards/slow suite (shard 3/3)-3]   | 
[shards/slow suite (shard 3/3)-3]   | 13 vulnerabilities (12 moderate, 1 high)
[shards/slow suite (shard 3/3)-3]   | 
[shards/slow suite (shard 3/3)-3]   | To address issues that do not require attention, run:
[shards/slow suite (shard 3/3)-3]   |   npm audit fix
[shards/slow suite (shard 3/3)-3]   | 
[shards/slow suite (shard 3/3)-3]   | To address all issues possible, run:
[shards/slow suite (shard 3/3)-3]   |   npm audit fix --force
[shards/slow suite (shard 3/3)-3]   | 
[shards/slow suite (shard 3/3)-3]   | Some issues need review, and may require choosing
[shards/slow suite (shard 3/3)-3]   | a different dependency.
[shards/slow suite (shard 3/3)-3]   | 
[shards/slow suite (shard 3/3)-3]   | Run \`npm audit\` for details.
[shards/slow suite (shard 3/3)-3]   ✅  Success - Main npm ci [38.212863875s]
[shards/slow suite (shard 3/3)-3] ⭐ Run Main tests of this shard
[shards/slow suite (shard 3/3)-3]   | 
[shards/slow suite (shard 3/3)-3]   |  RUN  v5.0.5 …/labflow-lite
[shards/slow suite (shard 3/3)-3]   | 
[shards/slow suite (shard 2/3)-2]   | 
[shards/slow suite (shard 2/3)-2]   | added 568 packages, and audited 569 packages in 40s
[shards/slow suite (shard 2/3)-2]   | 
[shards/slow suite (shard 2/3)-2]   | 123 packages are looking for funding
[shards/slow suite (shard 2/3)-2]   |   run \`npm fund\` for details
[shards/slow suite (shard 2/3)-2]   | 
[shards/slow suite (shard 2/3)-2]   | 13 vulnerabilities (12 moderate, 1 high)
[shards/slow suite (shard 2/3)-2]   | 
[shards/slow suite (shard 2/3)-2]   | To address issues that do not require attention, run:
[shards/slow suite (shard 2/3)-2]   |   npm audit fix
[shards/slow suite (shard 2/3)-2]   | 
[shards/slow suite (shard 2/3)-2]   | To address all issues possible, run:
[shards/slow suite (shard 2/3)-2]   |   npm audit fix --force
[shards/slow suite (shard 2/3)-2]   | 
[shards/slow suite (shard 2/3)-2]   | Some issues need review, and may require choosing
[shards/slow suite (shard 2/3)-2]   | a different dependency.
[shards/slow suite (shard 2/3)-2]   | 
[shards/slow suite (shard 2/3)-2]   | Run \`npm audit\` for details.
[shards/slow suite (shard 2/3)-2]   ✅  Success - Main npm ci [40.565853333s]
[shards/slow suite (shard 2/3)-2] ⭐ Run Main tests of this shard
[shards/slow suite (shard 1/3)-1]   | 
[shards/slow suite (shard 1/3)-1]   |  Test Files  2 passed (2)
[shards/slow suite (shard 1/3)-1]   |       Tests  2 passed (2)
[shards/slow suite (shard 1/3)-1]   |    Start at  01:31:30
[shards/slow suite (shard 1/3)-1]   |    Duration  4.01s (tests 97%, transform 1%, import 1%)
[shards/slow suite (shard 1/3)-1]   | 
[shards/slow suite (shard 1/3)-1]   | blob report written to …/labflow-lite/.vitest/blob/blob-1.json
[shards/slow suite (shard 1/3)-1]   ✅  Success - Main tests of this shard [6.232182208s]
[shards/slow suite (shard 1/3)-1] ⭐ Run Main actions/upload-artifact@v4
[shards/slow suite (shard 2/3)-2]   | 
[shards/slow suite (shard 2/3)-2]   |  RUN  v5.0.5 …/labflow-lite
[shards/slow suite (shard 2/3)-2]   | 
[shards/slow suite (shard 1/3)-1]   | With the provided path, there will be 1 file uploaded
[shards/slow suite (shard 1/3)-1]   | Artifact name is valid!
[shards/slow suite (shard 1/3)-1]   | Root directory input is valid!
[shards/slow suite (shard 1/3)-1]   | Beginning upload of artifact content to blob storage
[shards/slow suite (shard 1/3)-1]   | Uploaded bytes 1125
[shards/slow suite (shard 1/3)-1]   | Finished uploading artifact content to blob storage!
[shards/slow suite (shard 1/3)-1]   | SHA256 digest of uploaded artifact zip is e9fb8c555d5d34ddb273ae37997c13941f3a41e2261686812dcf6318108eaf2c
[shards/slow suite (shard 1/3)-1]   | Finalizing artifact upload
[shards/slow suite (shard 1/3)-1]   | Artifact blob-1.zip successfully finalized. Artifact ID 1855129436
[shards/slow suite (shard 1/3)-1]   | Artifact blob-1 has been successfully uploaded! Final size is 1125 bytes. Artifact ID is 1855129436
[shards/slow suite (shard 1/3)-1]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/1855129436
[shards/slow suite (shard 1/3)-1]   ✅  Success - Main actions/upload-artifact@v4 [2.20347475s]
[shards/slow suite (shard 1/3)-1]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/1855129436
[shards/slow suite (shard 1/3)-1]   ⚙  ::set-output:: artifact-id=1855129436
[shards/slow suite (shard 1/3)-1]   ⚙  ::set-output:: artifact-digest=e9fb8c555d5d34ddb273ae37997c13941f3a41e2261686812dcf6318108eaf2c
[shards/slow suite (shard 1/3)-1] ⭐ Run Post actions/setup-node@v4
[shards/slow suite (shard 3/3)-3]   | 
[shards/slow suite (shard 3/3)-3]   |  Test Files  2 passed (2)
[shards/slow suite (shard 3/3)-3]   |       Tests  2 passed (2)
[shards/slow suite (shard 3/3)-3]   |    Start at  01:31:33
[shards/slow suite (shard 3/3)-3]   |    Duration  3.47s (tests 96%, transform 2%, import 1%)
[shards/slow suite (shard 3/3)-3]   | 
[shards/slow suite (shard 3/3)-3]   | blob report written to …/labflow-lite/.vitest/blob/blob-3.json
[shards/slow suite (shard 3/3)-3]   ✅  Success - Main tests of this shard [5.046913917s]
[shards/slow suite (shard 3/3)-3] ⭐ Run Main actions/upload-artifact@v4
[shards/slow suite (shard 1/3)-1]   | Cache Size: ~55 MB (57763450 B)
[shards/slow suite (shard 1/3)-1]   | Cache saved successfully
[shards/slow suite (shard 1/3)-1]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[shards/slow suite (shard 1/3)-1]   ✅  Success - Post actions/setup-node@v4 [1.465107083s]
[shards/slow suite (shard 1/3)-1] ⭐ Run Complete job
[shards/slow suite (shard 1/3)-1] Cleaning up container for job slow suite (shard 1/3)
[shards/slow suite (shard 2/3)-2]   | 
[shards/slow suite (shard 2/3)-2]   |  Test Files  2 passed (2)
[shards/slow suite (shard 2/3)-2]   |       Tests  2 passed (2)
[shards/slow suite (shard 2/3)-2]   |    Start at  01:31:35
[shards/slow suite (shard 2/3)-2]   |    Duration  3.88s (tests 98%, transform 1%, import 1%)
[shards/slow suite (shard 2/3)-2]   | 
[shards/slow suite (shard 2/3)-2]   | blob report written to …/labflow-lite/.vitest/blob/blob-2.json
[shards/slow suite (shard 2/3)-2]   ✅  Success - Main tests of this shard [5.197539792s]
[shards/slow suite (shard 3/3)-3]   | With the provided path, there will be 1 file uploaded
[shards/slow suite (shard 3/3)-3]   | Artifact name is valid!
[shards/slow suite (shard 3/3)-3]   | Root directory input is valid!
[shards/slow suite (shard 3/3)-3]   | Beginning upload of artifact content to blob storage
[shards/slow suite (shard 3/3)-3]   | Uploaded bytes 1129
[shards/slow suite (shard 3/3)-3]   | Finished uploading artifact content to blob storage!
[shards/slow suite (shard 3/3)-3]   | SHA256 digest of uploaded artifact zip is b550acadf3358a11c30921bba0db29dd5505de6d27f3f300cc681b32ffe42f3c
[shards/slow suite (shard 3/3)-3]   | Finalizing artifact upload
[shards/slow suite (shard 3/3)-3]   | Artifact blob-3.zip successfully finalized. Artifact ID 1888684674
[shards/slow suite (shard 3/3)-3]   | Artifact blob-3 has been successfully uploaded! Final size is 1129 bytes. Artifact ID is 1888684674
[shards/slow suite (shard 3/3)-3]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/1888684674
[shards/slow suite (shard 3/3)-3]   ✅  Success - Main actions/upload-artifact@v4 [2.020094166s]
[shards/slow suite (shard 2/3)-2] ⭐ Run Main actions/upload-artifact@v4
[shards/slow suite (shard 3/3)-3]   ⚙  ::set-output:: artifact-digest=b550acadf3358a11c30921bba0db29dd5505de6d27f3f300cc681b32ffe42f3c
[shards/slow suite (shard 3/3)-3]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/1888684674
[shards/slow suite (shard 3/3)-3]   ⚙  ::set-output:: artifact-id=1888684674
[shards/slow suite (shard 3/3)-3] ⭐ Run Post actions/setup-node@v4
[shards/slow suite (shard 1/3)-1]   ✅  Success - Complete job
[shards/slow suite (shard 1/3)-1] 🏁  Job succeeded
[shards/slow suite (shard 2/3)-2]   | With the provided path, there will be 1 file uploaded
[shards/slow suite (shard 2/3)-2]   | Artifact name is valid!
[shards/slow suite (shard 2/3)-2]   | Root directory input is valid!
[shards/slow suite (shard 2/3)-2]   | Beginning upload of artifact content to blob storage
[shards/slow suite (shard 2/3)-2]   | Uploaded bytes 1130
[shards/slow suite (shard 2/3)-2]   | Finished uploading artifact content to blob storage!
[shards/slow suite (shard 2/3)-2]   | SHA256 digest of uploaded artifact zip is 98cca622e04de64d61d236b556f30b71f57ba092a6d053463336e6f694204bf4
[shards/slow suite (shard 2/3)-2]   | Finalizing artifact upload
[shards/slow suite (shard 2/3)-2]   | Artifact blob-2.zip successfully finalized. Artifact ID 1905462293
[shards/slow suite (shard 2/3)-2]   | Artifact blob-2 has been successfully uploaded! Final size is 1130 bytes. Artifact ID is 1905462293
[shards/slow suite (shard 2/3)-2]   | Artifact download URL: https://github.com/nektos/act/actions/runs/1/artifacts/1905462293
[shards/slow suite (shard 2/3)-2]   ✅  Success - Main actions/upload-artifact@v4 [2.593482292s]
[shards/slow suite (shard 2/3)-2]   ⚙  ::set-output:: artifact-id=1905462293
[shards/slow suite (shard 2/3)-2]   ⚙  ::set-output:: artifact-digest=98cca622e04de64d61d236b556f30b71f57ba092a6d053463336e6f694204bf4
[shards/slow suite (shard 2/3)-2]   ⚙  ::set-output:: artifact-url=https://github.com/nektos/act/actions/runs/1/artifacts/1905462293
[shards/slow suite (shard 2/3)-2] ⭐ Run Post actions/setup-node@v4
[shards/slow suite (shard 3/3)-3]   | Cache Size: ~55 MB (57762270 B)
[shards/slow suite (shard 3/3)-3]   | Cache saved successfully
[shards/slow suite (shard 3/3)-3]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[shards/slow suite (shard 3/3)-3]   ✅  Success - Post actions/setup-node@v4 [2.762258833s]
[shards/slow suite (shard 3/3)-3] ⭐ Run Complete job
[shards/slow suite (shard 3/3)-3] Cleaning up container for job slow suite (shard 3/3)
[shards/slow suite (shard 3/3)-3]   ✅  Success - Complete job
[shards/slow suite (shard 3/3)-3] 🏁  Job succeeded
[shards/slow suite (shard 2/3)-2]   | Cache Size: ~55 MB (57762231 B)
[shards/slow suite (shard 2/3)-2]   | Cache saved successfully
[shards/slow suite (shard 2/3)-2]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[shards/slow suite (shard 2/3)-2]   ✅  Success - Post actions/setup-node@v4 [1.57762925s]
[shards/slow suite (shard 2/3)-2] ⭐ Run Complete job
[shards/slow suite (shard 2/3)-2] Cleaning up container for job slow suite (shard 2/3)
[shards/slow suite (shard 2/3)-2]   ✅  Success - Complete job
[shards/slow suite (shard 2/3)-2] 🏁  Job succeeded
[shards/slow suite (merged report)] ⭐ Run Set up job
[shards/slow suite (merged report)] 🚀  Start image=catthehacker/ubuntu:act-24.04
[shards/slow suite (merged report)]   ✅  Success - Set up job
[shards/slow suite (merged report)] ⭐ Run Main actions/checkout@v4
[shards/slow suite (merged report)]   ✅  Success - Main actions/checkout@v4 [377.282ms]
[shards/slow suite (merged report)] ⭐ Run Main actions/setup-node@v4
[shards/slow suite (merged report)]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[shards/slow suite (merged report)]   ❓  ::group::Environment details
[shards/slow suite (merged report)]   | node: v22.23.4
[shards/slow suite (merged report)]   | npm: 10.9.9
[shards/slow suite (merged report)]   | yarn: 
[shards/slow suite (merged report)]   ❓  ::endgroup::
[shards/slow suite (merged report)]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[shards/slow suite (merged report)]   | /root/.npm
[shards/slow suite (merged report)]   ⚙  ***
[shards/slow suite (merged report)]   | Cache Size: ~55 MB (57762231 B)
[shards/slow suite (merged report)]   | Cache restored successfully
[shards/slow suite (merged report)]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[shards/slow suite (merged report)]   ✅  Success - Main actions/setup-node@v4 [3.441020958s]
[shards/slow suite (merged report)]   ⚙  ::set-output:: node-version=v22.23.4
[shards/slow suite (merged report)]   ⚙  ::set-output:: cache-hit=true
[shards/slow suite (merged report)]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[shards/slow suite (merged report)] ⭐ Run Main npm ci
[shards/slow suite (merged report)]   | 
[shards/slow suite (merged report)]   | added 568 packages, and audited 569 packages in 16s
[shards/slow suite (merged report)]   | 
[shards/slow suite (merged report)]   | 123 packages are looking for funding
[shards/slow suite (merged report)]   |   run \`npm fund\` for details
[shards/slow suite (merged report)]   | 
[shards/slow suite (merged report)]   | 13 vulnerabilities (12 moderate, 1 high)
[shards/slow suite (merged report)]   | 
[shards/slow suite (merged report)]   | To address issues that do not require attention, run:
[shards/slow suite (merged report)]   |   npm audit fix
[shards/slow suite (merged report)]   | 
[shards/slow suite (merged report)]   | To address all issues possible, run:
[shards/slow suite (merged report)]   |   npm audit fix --force
[shards/slow suite (merged report)]   | 
[shards/slow suite (merged report)]   | Some issues need review, and may require choosing
[shards/slow suite (merged report)]   | a different dependency.
[shards/slow suite (merged report)]   | 
[shards/slow suite (merged report)]   | Run \`npm audit\` for details.
[shards/slow suite (merged report)]   ✅  Success - Main npm ci [15.770202791s]
[shards/slow suite (merged report)] ⭐ Run Main actions/download-artifact@v4
[shards/slow suite (merged report)]   | Found 7 artifact(s)
[shards/slow suite (merged report)]   | Filtering artifacts by pattern 'blob-*'
[shards/slow suite (merged report)]   | Preparing to download the following artifacts:
[shards/slow suite (merged report)]   | - blob-2 (ID: 1905462293, Size: 96, Expected Digest: undefined)
[shards/slow suite (merged report)]   | - blob-3 (ID: 1888684674, Size: 96, Expected Digest: undefined)
[shards/slow suite (merged report)]   | - blob-1 (ID: 1855129436, Size: 96, Expected Digest: undefined)
[shards/slow suite (merged report)]   | Redirecting to blob download url: http://192.168.1.100:34567/twirp/github.actions.results.api.v1.ArtifactService/DownloadArtifact
[shards/slow suite (merged report)]   | Starting download of artifact to: …/labflow-lite/.vitest/blob
[shards/slow suite (merged report)]   | Redirecting to blob download url: http://192.168.1.100:34567/twirp/github.actions.results.api.v1.ArtifactService/DownloadArtifact
[shards/slow suite (merged report)]   | Starting download of artifact to: …/labflow-lite/.vitest/blob
[shards/slow suite (merged report)]   | Redirecting to blob download url: http://192.168.1.100:34567/twirp/github.actions.results.api.v1.ArtifactService/DownloadArtifact
[shards/slow suite (merged report)]   | Starting download of artifact to: …/labflow-lite/.vitest/blob
[shards/slow suite (merged report)]   | SHA256 digest of downloaded artifact is 98cca622e04de64d61d236b556f30b71f57ba092a6d053463336e6f694204bf4
[shards/slow suite (merged report)]   | Artifact download completed successfully.
[shards/slow suite (merged report)]   | SHA256 digest of downloaded artifact is b550acadf3358a11c30921bba0db29dd5505de6d27f3f300cc681b32ffe42f3c
[shards/slow suite (merged report)]   | Artifact download completed successfully.
[shards/slow suite (merged report)]   | SHA256 digest of downloaded artifact is e9fb8c555d5d34ddb273ae37997c13941f3a41e2261686812dcf6318108eaf2c
[shards/slow suite (merged report)]   | Artifact download completed successfully.
[shards/slow suite (merged report)]   | Total of 3 artifact(s) downloaded
[shards/slow suite (merged report)]   | Download artifact has finished successfully
[shards/slow suite (merged report)]   ✅  Success - Main actions/download-artifact@v4 [847.6025ms]
[shards/slow suite (merged report)]   ⚙  ::set-output:: download-path=…/labflow-lite/.vitest/blob
[shards/slow suite (merged report)] ⭐ Run Main npx vitest --merge-reports .vitest/blob --reporter=tree
[shards/slow suite (merged report)]   | 
[shards/slow suite (merged report)]   |  RUN  v5.0.5 …/labflow-lite
[shards/slow suite (merged report)]   | 
[shards/slow suite (merged report)]   | 
[shards/slow suite (merged report)]   |  Test Files  6 passed (6)
[shards/slow suite (merged report)]   |       Tests  6 passed (6)
[shards/slow suite (merged report)]   |    Start at  01:32:58
[shards/slow suite (merged report)]   |    Duration  11.43s (tests 97%, transform 2%, import 1%)
[shards/slow suite (merged report)]   |    Per blob  4.02s 3.91s 3.50s
[shards/slow suite (merged report)]   | 
[shards/slow suite (merged report)]   ✅  Success - Main npx vitest --merge-reports .vitest/blob --reporter=tree [603.471542ms]
[shards/slow suite (merged report)] ⭐ Run Post actions/setup-node@v4
[shards/slow suite (merged report)]   | Cache Size: ~55 MB (57746618 B)
[shards/slow suite (merged report)]   | Cache saved successfully
[shards/slow suite (merged report)]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[shards/slow suite (merged report)]   ✅  Success - Post actions/setup-node@v4 [620.703458ms]
[shards/slow suite (merged report)] ⭐ Run Complete job
[shards/slow suite (merged report)] Cleaning up container for job slow suite (merged report)
[shards/slow suite (merged report)]   ✅  Success - Complete job
[shards/slow suite (merged report)] 🏁  Job succeeded
act exit: 0
wall time: 147 s`,
  '94-shard-ta': `$ for i in 1 2 3; do node scripts/shard.mjs $i/3 demo9/cham/timings.json | xargs npx vitest run --no-file-parallelism --reporter=tree | grep -E "✓ demo9|Duration"; done
 ✓ demo9/cham/a.test.js (1 test) 3003ms
 ✓ demo9/cham/e.test.js (1 test) 503ms
   Duration  3.69s (tests 99%)
 ✓ demo9/cham/f.test.js (1 test) 3003ms
 ✓ demo9/cham/b.test.js (1 test) 502ms
   Duration  3.70s (tests 99%)
 ✓ demo9/cham/d.test.js (1 test) 2503ms
 ✓ demo9/cham/c.test.js (1 test) 503ms
   Duration  3.19s (tests 99%)`,
  '94-shard-vitest': `$ for i in 1 2 3; do npx vitest run demo9/cham --shard=$i/3 --no-file-parallelism --reporter=tree | grep -E "✓ demo9|Duration"; done
 ✓ demo9/cham/a.test.js (1 test) 3004ms
 ✓ demo9/cham/d.test.js (1 test) 2503ms
   Duration  5.71s (tests 100%)
 ✓ demo9/cham/b.test.js (1 test) 503ms
 ✓ demo9/cham/c.test.js (1 test) 503ms
   Duration  1.18s (tests 98%, import 1%)
 ✓ demo9/cham/f.test.js (1 test) 3003ms
 ✓ demo9/cham/e.test.js (1 test) 503ms
   Duration  3.72s (tests 99%, import 1%)`,
  '94-th-ta': `$ for i in 1 2; do node scripts/shard.mjs $i/2 demo9/cham/timings.json | xargs npx vitest run --no-file-parallelism --reporter=tree | grep -E "✓ demo9|Duration"; done
 ✓ demo9/cham/a.test.js (1 test) 3004ms
 ✓ demo9/cham/d.test.js (1 test) 2505ms
   Duration  5.67s (tests 100%)
 ✓ demo9/cham/f.test.js (1 test) 3004ms
 ✓ demo9/cham/c.test.js (1 test) 504ms
 ✓ demo9/cham/b.test.js (1 test) 504ms
 ✓ demo9/cham/e.test.js (1 test) 504ms
   Duration  4.85s (tests 99%)`,
  '94-th-vitest': `$ for i in 1 2; do npx vitest run demo9/cham --shard=$i/2 --no-file-parallelism --reporter=tree | grep -E "✓ demo9|Duration"; done
 ✓ demo9/cham/a.test.js (1 test) 3005ms
 ✓ demo9/cham/d.test.js (1 test) 2505ms
 ✓ demo9/cham/b.test.js (1 test) 504ms
   Duration  6.28s (tests 99%)
 ✓ demo9/cham/f.test.js (1 test) 3005ms
 ✓ demo9/cham/e.test.js (1 test) 504ms
 ✓ demo9/cham/c.test.js (1 test) 505ms
   Duration  4.26s (tests 99%)`,
  'lab9-act-yeu': `$ T0=$(date +%s); act pull_request -W lab9/thu-lan-dau.yml -e demo9/pr-event.json --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"; echo "wall time: $(( $(date +%s) - T0 )) s"
time="2026-11-01T09:08:54+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T09:08:54+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[tests/e2e             ] ⭐ Run Set up job
[tests/unit (Node 20)-1] ⭐ Run Set up job
[tests/e2e             ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit (Node 20)-1] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/integration     ] ⭐ Run Set up job
[tests/integration     ] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/unit (Node 22)-2] ⭐ Run Set up job
[tests/unit (Node 22)-2] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/integration     ]   ✅  Success - Set up job
[tests/unit (Node 22)-2]   ✅  Success - Set up job
[tests/e2e             ]   ✅  Success - Set up job
[tests/unit (Node 20)-1]   ✅  Success - Set up job
[tests/unit (Node 22)-2] 🧪  Matrix: map[node:22]
[tests/unit (Node 22)-2] ⭐ Run Main actions/checkout@v4
[tests/unit (Node 22)-2]   ✅  Success - Main actions/checkout@v4 [376.6025ms]
[tests/unit (Node 22)-2] ⭐ Run Main actions/setup-node@v4
[tests/integration     ] ⭐ Run Main actions/checkout@v4
[tests/integration     ]   ✅  Success - Main actions/checkout@v4 [438.70875ms]
[tests/integration     ] ⭐ Run Main actions/setup-node@v4
[tests/e2e             ] ⭐ Run Main actions/checkout@v4
[tests/e2e             ]   ✅  Success - Main actions/checkout@v4 [589.64175ms]
[tests/e2e             ] ⭐ Run Main actions/setup-node@v4
[tests/unit (Node 20)-1] 🧪  Matrix: map[node:20]
[tests/unit (Node 20)-1] ⭐ Run Main actions/checkout@v4
[tests/unit (Node 20)-1]   ✅  Success - Main actions/checkout@v4 [962.556125ms]
[tests/unit (Node 20)-1] ⭐ Run Main actions/setup-node@v4
[tests/unit (Node 22)-2]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/unit (Node 22)-2]   ❓  ::group::Environment details
[tests/unit (Node 22)-2]   | node: v22.23.4
[tests/unit (Node 22)-2]   | npm: 10.9.9
[tests/unit (Node 22)-2]   | yarn: 
[tests/unit (Node 22)-2]   ❓  ::endgroup::
[tests/unit (Node 22)-2]   ✅  Success - Main actions/setup-node@v4 [6.871547542s]
[tests/unit (Node 22)-2]   ⚙  ::set-output:: node-version=v22.23.4
[tests/unit (Node 22)-2]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/unit (Node 22)-2] ⭐ Run Main npm ci
[tests/e2e             ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/e2e             ]   ❓  ::group::Environment details
[tests/integration     ]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/integration     ]   ❓  ::group::Environment details
[tests/integration     ]   | node: v22.23.4
[tests/integration     ]   | npm: 10.9.9
[tests/integration     ]   | yarn: 
[tests/integration     ]   ❓  ::endgroup::
[tests/integration     ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/e2e             ]   | node: v22.23.4
[tests/e2e             ]   | npm: 10.9.9
[tests/e2e             ]   | yarn: 
[tests/e2e             ]   ❓  ::endgroup::
[tests/e2e             ]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/integration     ]   | /root/.npm
[tests/e2e             ]   | /root/.npm
[tests/integration     ]   ⚙  ***
[tests/e2e             ]   ⚙  ***
[tests/unit (Node 20)-1]   | Found in cache @ /opt/hostedtoolcache/node/20.20.2/arm64
[tests/unit (Node 20)-1]   ❓  ::group::Environment details
[tests/integration     ]   | Cache Size: ~55 MB (57758154 B)
[tests/unit (Node 20)-1]   | node: v20.20.2
[tests/unit (Node 20)-1]   | npm: 10.8.2
[tests/unit (Node 20)-1]   | yarn: 
[tests/unit (Node 20)-1]   ❓  ::endgroup::
[tests/unit (Node 20)-1]   ✅  Success - Main actions/setup-node@v4 [4.526607583s]
[tests/unit (Node 20)-1]   ⚙  ::set-output:: node-version=v20.20.2
[tests/unit (Node 20)-1]   ⚙  ::add-path:: /opt/hostedtoolcache/node/20.20.2/arm64/bin
[tests/unit (Node 20)-1] ⭐ Run Main npm ci
[tests/e2e             ]   | Cache Size: ~55 MB (57758154 B)
[tests/integration     ]   | Cache restored successfully
[tests/integration     ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration     ]   ✅  Success - Main actions/setup-node@v4 [9.556989458s]
[tests/integration     ]   ⚙  ::set-output:: node-version=v22.23.4
[tests/integration     ]   ⚙  ::set-output:: cache-hit=true
[tests/integration     ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/integration     ] ⭐ Run Main npm ci
[tests/e2e             ]   | Cache restored successfully
[tests/e2e             ]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/e2e             ]   ✅  Success - Main actions/setup-node@v4 [7.85822575s]
[tests/e2e             ]   ⚙  ::set-output:: node-version=v22.23.4
[tests/e2e             ]   ⚙  ::set-output:: cache-hit=true
[tests/e2e             ]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/e2e             ] ⭐ Run Main npm ci
[tests/e2e             ]   | 
[tests/e2e             ]   | added 568 packages, and audited 569 packages in 35s
[tests/e2e             ]   | 
[tests/e2e             ]   | 123 packages are looking for funding
[tests/e2e             ]   |   run \`npm fund\` for details
[tests/e2e             ]   | 
[tests/e2e             ]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/e2e             ]   | 
[tests/e2e             ]   | To address issues that do not require attention, run:
[tests/e2e             ]   |   npm audit fix
[tests/e2e             ]   | 
[tests/e2e             ]   | To address all issues possible, run:
[tests/e2e             ]   |   npm audit fix --force
[tests/e2e             ]   | 
[tests/e2e             ]   | Some issues need review, and may require choosing
[tests/e2e             ]   | a different dependency.
[tests/e2e             ]   | 
[tests/e2e             ]   | Run \`npm audit\` for details.
[tests/e2e             ]   ✅  Success - Main npm ci [34.938286792s]
[tests/e2e             ] ⭐ Run Main npx playwright install chromium
[tests/integration     ]   | 
[tests/integration     ]   | added 568 packages, and audited 569 packages in 36s
[tests/integration     ]   | 
[tests/integration     ]   | 123 packages are looking for funding
[tests/integration     ]   |   run \`npm fund\` for details
[tests/integration     ]   | 
[tests/integration     ]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/integration     ]   | 
[tests/integration     ]   | To address issues that do not require attention, run:
[tests/integration     ]   |   npm audit fix
[tests/integration     ]   | 
[tests/integration     ]   | To address all issues possible, run:
[tests/integration     ]   |   npm audit fix --force
[tests/integration     ]   | 
[tests/integration     ]   | Some issues need review, and may require choosing
[tests/integration     ]   | a different dependency.
[tests/integration     ]   | 
[tests/integration     ]   | Run \`npm audit\` for details.
[tests/integration     ]   ✅  Success - Main npm ci [36.443570459s]
[tests/integration     ] ⭐ Run Main npm run test:int -- test/integration
[tests/integration     ]   | 
[tests/integration     ]   | > labflow-lite@1.0.0 test:int
[tests/integration     ]   | > vitest run --config vitest.integration.config.js test/integration
[tests/integration     ]   | 
[tests/integration     ]   | 
[tests/integration     ]   |  RUN  v5.0.5 …/labflow-lite
[tests/integration     ]   | 
[tests/integration     ]   | No test files found, exiting with code 1
[tests/integration     ]   | 
[tests/integration     ]   | filter: test/integration
[tests/integration     ]   | include: test/integration/**/*.int.test.js, demo4/**/*.int.test.js
[tests/integration     ]   | exclude:  **/node_modules/**, **/.git/**
[tests/integration     ]   | 
[tests/integration     ]   | 
[tests/integration     ]   | ⎯⎯⎯⎯⎯⎯ Unhandled Error ⎯⎯⎯⎯⎯⎯⎯
[tests/integration     ]   | AggregateError: 
[tests/integration     ]   |     at internalConnectMultiple (node:net:1135:18)
[tests/integration     ]   |     at afterConnectMultiple (node:net:1716:7) {
[tests/integration     ]   |   code: 'ECONNREFUSED',
[tests/integration     ]   |   stacks: [
[tests/integration     ]   |     {
[tests/integration     ]   |       method: 'internalConnectMultiple',
[tests/integration     ]   |       file: 'node:net',
[tests/integration     ]   |       line: 1135,
[tests/integration     ]   |       column: 18
[tests/integration     ]   |     },
[tests/integration     ]   |     {
[tests/integration     ]   |       method: 'afterConnectMultiple',
[tests/integration     ]   |       file: 'node:net',
[tests/integration     ]   |       line: 1716,
[tests/integration     ]   |       column: 7
[tests/integration     ]   |     }
[tests/integration     ]   |   ],
[tests/integration     ]   |   [errors]: [
[tests/integration     ]   |     Error: connect ECONNREFUSED ::1:5432
[tests/integration     ]   |         at createConnectionError (node:net:1679:14)
[tests/integration     ]   |         at afterConnectMultiple (node:net:1709:16) {
[tests/integration     ]   |       errno: -111,
[tests/integration     ]   |       code: 'ECONNREFUSED',
[tests/integration     ]   |       syscall: 'connect',
[tests/integration     ]   |       address: '::1',
[tests/integration     ]   |       port: 5432
[tests/integration     ]   |     },
[tests/integration     ]   |     Error: connect ECONNREFUSED 127.0.0.1:5432
[tests/integration     ]   |         at createConnectionError (node:net:1679:14)
[tests/integration     ]   |         at afterConnectMultiple (node:net:1709:16) {
[tests/integration     ]   |       errno: -111,
[tests/integration     ]   |       code: 'ECONNREFUSED',
[tests/integration     ]   |       syscall: 'connect',
[tests/integration     ]   |       address: '127.0.0.1',
[tests/integration     ]   |       port: 5432
[tests/integration     ]   |     }
[tests/integration     ]   |   ]
[tests/integration     ]   | }
[tests/integration     ]   |  ❯ internalConnectMultiple node:net:1135:18
[tests/integration     ]   |  ❯ afterConnectMultiple node:net:1716:7
[tests/integration     ]   | 
[tests/integration     ]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
[tests/integration     ]   | Serialized Error: { errors: [ [Error: connect ECONNREFUSED ::1:5432], [Error: connect ECONNREFUSED 127.0.0.1:5432] ], code: 'ECONNREFUSED' }
[tests/integration     ]   | 
[tests/integration     ]   | 
[tests/integration     ]   | 
[tests/integration     ]   ❌  Failure - Main npm run test:int -- test/integration [972.846958ms]
[tests/integration     ] exitcode '1': failure
[tests/integration     ] ⭐ Run Complete job
[tests/integration     ]   ✅  Success - Complete job
[tests/integration     ] 🏁  Job failed
[tests/e2e             ]   | |                                                                                |   0% of 190.5 MiB
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | added 568 packages, and audited 569 packages in 55s
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | 123 packages are looking for funding
[tests/unit (Node 22)-2]   |   run \`npm fund\` for details
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | To address issues that do not require attention, run:
[tests/unit (Node 22)-2]   |   npm audit fix
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | To address all issues possible, run:
[tests/unit (Node 22)-2]   |   npm audit fix --force
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | Some issues need review, and may require choosing
[tests/unit (Node 22)-2]   | a different dependency.
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | Run \`npm audit\` for details.
[tests/unit (Node 22)-2]   ✅  Success - Main npm ci [55.65854375s]
[tests/unit (Node 22)-2] ⭐ Run Main npm run test:unit
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | > labflow-lite@1.0.0 test:unit
[tests/unit (Node 22)-2]   | > vitest run src/
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | added 568 packages, and audited 569 packages in 54s
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | 123 packages are looking for funding
[tests/unit (Node 20)-1]   |   run \`npm fund\` for details
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | To address issues that do not require attention, run:
[tests/unit (Node 20)-1]   |   npm audit fix
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | To address all issues possible, run:
[tests/unit (Node 20)-1]   |   npm audit fix --force
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | Some issues need review, and may require choosing
[tests/unit (Node 20)-1]   | a different dependency.
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | Run \`npm audit\` for details.
[tests/unit (Node 20)-1]   ✅  Success - Main npm ci [53.988998334s]
[tests/unit (Node 20)-1] ⭐ Run Main npm run test:unit
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   |  Test Files  20 passed (20)
[tests/unit (Node 22)-2]   |       Tests  175 passed (175)
[tests/unit (Node 22)-2]   |    Start at  02:10:03
[tests/unit (Node 22)-2]   |    Duration  1.09s (transform 42%, import 34%, tests 21%, worker 3%)
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | > labflow-lite@1.0.0 test:unit
[tests/unit (Node 20)-1]   | > vitest run src/
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 22)-2]   ✅  Success - Main npm run test:unit [1.687299s]
[tests/unit (Node 22)-2] ⭐ Run Main npm run test:web
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | > labflow-lite@1.0.0 test:web
[tests/unit (Node 22)-2]   | > vitest run --config vitest.web.config.js web/
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js (4 tests | 4 failed) 84ms
[tests/unit (Node 20)-1]   |    ❯ createHttpMailer (4)
[tests/unit (Node 20)-1]   |      × posts { to, subject } with a Bearer key and returns the id 54ms
[tests/unit (Node 20)-1]   |      × 429 → RATE_LIMITED 13ms
[tests/unit (Node 20)-1]   |      × 400 → MAIL_FAILED with the status as the cause 5ms
[tests/unit (Node 20)-1]   |      × 503 → MAIL_FAILED with the status as the cause 6ms
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > posts { to, subject } with a Bearer key and returns the id
[tests/unit (Node 20)-1]   | AssertionError: promise rejected "TypeError: fetch failed" instead of resolving
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js:21:70
[tests/unit (Node 20)-1]   |      19| describe('createHttpMailer', () => {
[tests/unit (Node 20)-1]   |      20|   it('posts { to, subject } with a Bearer key and returns the id', asy…
[tests/unit (Node 20)-1]   |      21|     await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).…
[tests/unit (Node 20)-1]   |        |                                                                      ^
[tests/unit (Node 20)-1]   |      22|     expect(requests).toEqual([{ auth: 'Bearer test-key', body: { to: '…
[tests/unit (Node 20)-1]   |      23|   });
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | Caused by: TypeError: fetch failed
[tests/unit (Node 20)-1]   |  ❯ Object.send src/lib/mailer.js:13:19
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js:21:5
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | Caused by: TypeError: Promise.withResolvers is not a function
[tests/unit (Node 20)-1]   |  ❯ new TcpSocketController node_modules/@mswjs/interceptors/lib/node/net-B8GL5tms.js:435:36
[tests/unit (Node 20)-1]   |  ❯ new TlsSocketController node_modules/@mswjs/interceptors/lib/node/net-B8GL5tms.js:1166:3
[tests/unit (Node 20)-1]   |  ❯ TLSSocket.connect node_modules/@mswjs/interceptors/lib/node/net-B8GL5tms.js:1559:20
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/8]⎯
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > posts { to, subject } with a Bearer key and returns the id
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > 429 → RATE_LIMITED
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > 400 → MAIL_FAILED with the status as the cause
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > 503 → MAIL_FAILED with the status as the cause
[tests/unit (Node 20)-1]   | TypeError: currentHandlers.intersection is not a function or its return value is not iterable
[tests/unit (Node 20)-1]   |  ❯ AsyncHandlersController.reset node_modules/msw/src/core/experimental/handlers-controller.ts:181:43
[tests/unit (Node 20)-1]   |  ❯ Object.resetHandlers node_modules/msw/src/core/experimental/define-network.ts:254:26
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js:14:26
[tests/unit (Node 20)-1]   |      12| const server = setupServer(ok);
[tests/unit (Node 20)-1]   |      13| beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
[tests/unit (Node 20)-1]   |      14| afterEach(() => { server.resetHandlers(); requests.length = 0; });
[tests/unit (Node 20)-1]   |        |                          ^
[tests/unit (Node 20)-1]   |      15| afterAll(() => server.close());
[tests/unit (Node 20)-1]   |      16| const mailer = createHttpMailer({ baseUrl: API, apiKey: 'test-key' });
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/8]⎯
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > 429 → RATE_LIMITED
[tests/unit (Node 20)-1]   | AssertionError: expected TypeError: fetch failed to match object { code: 'RATE_LIMITED' }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | - Expected
[tests/unit (Node 20)-1]   | + Received
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | - {
[tests/unit (Node 20)-1]   | -   "code": "RATE_LIMITED",
[tests/unit (Node 20)-1]   | + TypeError {
[tests/unit (Node 20)-1]   | +   "message": "fetch failed",
[tests/unit (Node 20)-1]   | +   "cause": TypeError {
[tests/unit (Node 20)-1]   | +     "message": "Promise.withResolvers is not a function",
[tests/unit (Node 20)-1]   | +   },
[tests/unit (Node 20)-1]   |   }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js:27:62
[tests/unit (Node 20)-1]   |      25|   it('429 → RATE_LIMITED', async () => {
[tests/unit (Node 20)-1]   |      26|     reply(429);
[tests/unit (Node 20)-1]   |      27|     await expect(mailer.send({ to: 'a@b.c', subject: 'Hi' })).rejects.…
[tests/unit (Node 20)-1]   |        |                                                              ^
[tests/unit (Node 20)-1]   |      28|   });
[tests/unit (Node 20)-1]   |      29|
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/8]⎯
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > 400 → MAIL_FAILED with the status as the cause
[tests/unit (Node 20)-1]   | AssertionError: expected TypeError: fetch failed to match object { code: 'MAIL_FAILED', …(1) }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | - Expected
[tests/unit (Node 20)-1]   | + Received
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | - {
[tests/unit (Node 20)-1]   | -   "cause": {
[tests/unit (Node 20)-1]   | -     "message": "HTTP 400",
[tests/unit (Node 20)-1]   | + TypeError {
[tests/unit (Node 20)-1]   | +   "message": "fetch failed",
[tests/unit (Node 20)-1]   | +   "cause": TypeError {
[tests/unit (Node 20)-1]   | +     "message": "Promise.withResolvers is not a function",
[tests/unit (Node 20)-1]   |     },
[tests/unit (Node 20)-1]   | -   "code": "MAIL_FAILED",
[tests/unit (Node 20)-1]   |   }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js:33:7
[tests/unit (Node 20)-1]   |      31|     reply(status);
[tests/unit (Node 20)-1]   |      32|     await expect(mailer.send({ to: 'a@b.c', subject: 'Hi' }))
[tests/unit (Node 20)-1]   |      33|       .rejects.toMatchObject({ code: 'MAIL_FAILED', cause: { message: …
[tests/unit (Node 20)-1]   |        |       ^
[tests/unit (Node 20)-1]   |      34|   });
[tests/unit (Node 20)-1]   |      35| });
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/8]⎯
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  FAIL  src/lib/mailer.test.js > createHttpMailer > 503 → MAIL_FAILED with the status as the cause
[tests/unit (Node 20)-1]   | AssertionError: expected TypeError: fetch failed to match object { code: 'MAIL_FAILED', …(1) }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | - Expected
[tests/unit (Node 20)-1]   | + Received
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | - {
[tests/unit (Node 20)-1]   | -   "cause": {
[tests/unit (Node 20)-1]   | -     "message": "HTTP 503",
[tests/unit (Node 20)-1]   | + TypeError {
[tests/unit (Node 20)-1]   | +   "message": "fetch failed",
[tests/unit (Node 20)-1]   | +   "cause": TypeError {
[tests/unit (Node 20)-1]   | +     "message": "Promise.withResolvers is not a function",
[tests/unit (Node 20)-1]   |     },
[tests/unit (Node 20)-1]   | -   "code": "MAIL_FAILED",
[tests/unit (Node 20)-1]   |   }
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  ❯ src/lib/mailer.test.js:33:7
[tests/unit (Node 20)-1]   |      31|     reply(status);
[tests/unit (Node 20)-1]   |      32|     await expect(mailer.send({ to: 'a@b.c', subject: 'Hi' }))
[tests/unit (Node 20)-1]   |      33|       .rejects.toMatchObject({ code: 'MAIL_FAILED', cause: { message: …
[tests/unit (Node 20)-1]   |        |       ^
[tests/unit (Node 20)-1]   |      34|   });
[tests/unit (Node 20)-1]   |      35| });
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/8]⎯
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   |  Test Files  1 failed | 19 passed (20)
[tests/unit (Node 20)-1]   |       Tests  4 failed | 171 passed (175)
[tests/unit (Node 20)-1]   |    Start at  02:10:05
[tests/unit (Node 20)-1]   |    Duration  1.27s (transform 50%, import 27%, tests 20%, worker 3%)
[tests/unit (Node 20)-1]   | 
[tests/unit (Node 20)-1]   ❌  Failure - Main npm run test:unit [1.9527225s]
[tests/unit (Node 20)-1] exitcode '1': failure
[tests/unit (Node 20)-1] ⭐ Run Complete job
[tests/unit (Node 20)-1]   ✅  Success - Complete job
[tests/unit (Node 20)-1] 🏁  Job failed
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   |  Test Files  2 passed (2)
[tests/unit (Node 22)-2]   |       Tests  16 passed (16)
[tests/unit (Node 22)-2]   |    Start at  02:10:05
[tests/unit (Node 22)-2]   |    Duration  2.75s (tests 48%, environment 34%, setup 8%, transform 7%, import 2%)
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   ✅  Success - Main npm run test:web [3.402706291s]
[tests/unit (Node 22)-2] ⭐ Run Main npm run test:quarantine
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | > labflow-lite@1.0.0 test:quarantine
[tests/unit (Node 22)-2]   | > vitest run test/quarantine --tagsFilter=quarantine
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   |  RUN  v5.0.5 …/labflow-lite
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   |  Test Files  1 passed (1)
[tests/unit (Node 22)-2]   |       Tests  1 passed (1)
[tests/unit (Node 22)-2]   |    Start at  02:10:09
[tests/unit (Node 22)-2]   |    Duration  209ms (transform 45%, tests 34%, import 17%, worker 3%)
[tests/unit (Node 22)-2]   | 
[tests/unit (Node 22)-2]   ✅  Success - Main npm run test:quarantine [855.38775ms]
[tests/unit (Node 22)-2] ⭐ Run Post actions/setup-node@v4
[tests/unit (Node 22)-2]   ✅  Success - Post actions/setup-node@v4 [363.371458ms]
[tests/unit (Node 22)-2] ⭐ Run Complete job
[tests/unit (Node 22)-2] Cleaning up container for job unit (Node 22)
[tests/unit (Node 22)-2]   ✅  Success - Complete job
[tests/unit (Node 22)-2] 🏁  Job failed
[tests/e2e             ]   | Chrome for Testing 156.0.8078.4 (playwright chromium v1248) downloaded to /root/.cache/ms-playwright/chromium-1248
[tests/e2e             ]   | |                                                                                |   0% of 1.9 MiB
[tests/e2e             ]   | FFmpeg (playwright ffmpeg v1013) downloaded to /root/.cache/ms-playwright/ffmpeg-1013
[tests/e2e             ]   | |                                                                                |   0% of 119.9 MiB
[tests/e2e             ]   | Chrome Headless Shell 156.0.8078.4 (playwright chromium-headless-shell v1248) downloaded to /root/.cache/ms-playwright/chromium_headless_shell-1248
[tests/e2e             ]   ✅  Success - Main npx playwright install chromium [4m29.747603042s]
[tests/e2e             ] ⭐ Run Main npm run test:e2e
[tests/e2e             ]   | 
[tests/e2e             ]   | > labflow-lite@1.0.0 test:e2e
[tests/e2e             ]   | > playwright test e2e/ --project=chromium
[tests/e2e             ]   | 
[tests/e2e             ]   | 
[tests/e2e             ]   | Running 9 tests using 5 workers
[tests/e2e             ]   | 
[tests/e2e             ]   |   ✘  2 [setup] › e2e/auth.setup.js:6:3 › sign in as an (3ms)
[tests/e2e             ]   |   ✘  1 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (3ms)
[tests/e2e             ]   |   ✘  3 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (retry #1) (3ms)
[tests/e2e             ]   |   ✘  4 [setup] › e2e/auth.setup.js:6:3 › sign in as an (retry #1) (2ms)
[tests/e2e             ]   |   ✘  5 [setup] › e2e/auth.setup.js:6:3 › sign in as an (retry #2) (4ms)
[tests/e2e             ]   | 
[tests/e2e             ]   |   ✘  6 [setup] › e2e/auth.setup.js:6:3 › sign in as boss (retry #2) (4ms)
[tests/e2e             ]   | 
[tests/e2e             ]   | 
[tests/e2e             ]   | 
[tests/e2e             ]   |   1) [setup] › e2e/auth.setup.js:6:3 › sign in as an ───────────────────────────────────────────────
[tests/e2e             ]   | 
[tests/e2e             ]   |     Error: browserType.launch: Target page, context or browser has been closed
[tests/e2e             ]   |     Browser logs:
[tests/e2e             ]   | 
[tests/e2e             ]   |     <launched> pid=753
[tests/e2e             ]   |     [pid=753][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e             ]   |     Call log:
[tests/e2e             ]   |       - <launched> pid=753
[tests/e2e             ]   |       - [pid=753][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e             ]   |       - [pid=753] <gracefully close start>
[tests/e2e             ]   |       - [pid=753] <kill>
[tests/e2e             ]   |       - [pid=753] <will force kill>
[tests/e2e             ]   |       - [pid=753] exception while trying to kill process: Error: kill ESRCH
[tests/e2e             ]   |       - [pid=753] <process did exit: exitCode=127, signal=null>
[tests/e2e             ]   |       - [pid=753] starting temporary directories cleanup
[tests/e2e             ]   |       - [pid=753] finished temporary directories cleanup
[tests/e2e             ]   |       - [pid=753] <gracefully close end>
[tests/e2e             ]   | 
[tests/e2e             ]   | 
[tests/e2e             ]   |     Error Context: test-results/e2e-auth.setup.js-sign-in-as-an-setup/error-context.md
[tests/e2e             ]   | 
[tests/e2e             ]   |     Retry #1 ───────────────────────────────────────────────────────────────────────────────────────
[tests/e2e             ]   | 
[tests/e2e             ]   |     Error: browserType.launch: Target page, context or browser has been closed
[tests/e2e             ]   |     Browser logs:
[tests/e2e             ]   | 
[tests/e2e             ]   |     <launched> pid=780
[tests/e2e             ]   |     [pid=780][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e             ]   |     Call log:
[tests/e2e             ]   |       - <launched> pid=780
[tests/e2e             ]   |       - [pid=780][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e             ]   |       - [pid=780] <gracefully close start>
[tests/e2e             ]   |       - [pid=780] <kill>
[tests/e2e             ]   |       - [pid=780] <will force kill>
[tests/e2e             ]   |       - [pid=780] exception while trying to kill process: Error: kill ESRCH
[tests/e2e             ]   |       - [pid=780] <process did exit: exitCode=127, signal=null>
[tests/e2e             ]   |       - [pid=780] starting temporary directories cleanup
[tests/e2e             ]   |       - [pid=780] finished temporary directories cleanup
[tests/e2e             ]   |       - [pid=780] <gracefully close end>
[tests/e2e             ]   | 
[tests/e2e             ]   | 
[tests/e2e             ]   |     Error Context: test-results/e2e-auth.setup.js-sign-in-as-an-setup-retry1/error-context.md
[tests/e2e             ]   | 
[tests/e2e             ]   |     attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
[tests/e2e             ]   |     test-results/e2e-auth.setup.js-sign-in-as-an-setup-retry1/trace.zip
[tests/e2e             ]   |     Usage:
[tests/e2e             ]   | 
[tests/e2e             ]   |         npx playwright show-trace test-results/e2e-auth.setup.js-sign-in-as-an-setup-retry1/trace.zip
[tests/e2e             ]   | 
[tests/e2e             ]   |     ────────────────────────────────────────────────────────────────────────────────────────────────
[tests/e2e             ]   | 
[tests/e2e             ]   |     Retry #2 ───────────────────────────────────────────────────────────────────────────────────────
[tests/e2e             ]   | 
[tests/e2e             ]   |     Error: browserType.launch: Target page, context or browser has been closed
[tests/e2e             ]   |     Browser logs:
[tests/e2e             ]   | 
[tests/e2e             ]   |     <launched> pid=805
[tests/e2e             ]   |     [pid=805][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e             ]   |     Call log:
[tests/e2e             ]   |       - <launched> pid=805
[tests/e2e             ]   |       - [pid=805][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e             ]   |       - [pid=805] <gracefully close start>
[tests/e2e             ]   |       - [pid=805] <kill>
[tests/e2e             ]   |       - [pid=805] <will force kill>
[tests/e2e             ]   |       - [pid=805] exception while trying to kill process: Error: kill ESRCH
[tests/e2e             ]   |       - [pid=805] <process did exit: exitCode=127, signal=null>
[tests/e2e             ]   |       - [pid=805] starting temporary directories cleanup
[tests/e2e             ]   |       - [pid=805] finished temporary directories cleanup
[tests/e2e             ]   |       - [pid=805] <gracefully close end>
[tests/e2e             ]   | 
[tests/e2e             ]   | 
[tests/e2e             ]   |     Error Context: test-results/e2e-auth.setup.js-sign-in-as-an-setup-retry2/error-context.md
[tests/e2e             ]   | 
[tests/e2e             ]   |   2) [setup] › e2e/auth.setup.js:6:3 › sign in as boss ─────────────────────────────────────────────
[tests/e2e             ]   | 
[tests/e2e             ]   |     Error: browserType.launch: Target page, context or browser has been closed
[tests/e2e             ]   |     Browser logs:
[tests/e2e             ]   | 
[tests/e2e             ]   |     <launched> pid=754
[tests/e2e             ]   |     [pid=754][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e             ]   |     Call log:
[tests/e2e             ]   |       - <launched> pid=754
[tests/e2e             ]   |       - [pid=754][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e             ]   |       - [pid=754] <gracefully close start>
[tests/e2e             ]   |       - [pid=754] <kill>
[tests/e2e             ]   |       - [pid=754] <will force kill>
[tests/e2e             ]   |       - [pid=754] exception while trying to kill process: Error: kill ESRCH
[tests/e2e             ]   |       - [pid=754] <process did exit: exitCode=127, signal=null>
[tests/e2e             ]   |       - [pid=754] starting temporary directories cleanup
[tests/e2e             ]   |       - [pid=754] finished temporary directories cleanup
[tests/e2e             ]   |       - [pid=754] <gracefully close end>
[tests/e2e             ]   | 
[tests/e2e             ]   | 
[tests/e2e             ]   |     Error Context: test-results/e2e-auth.setup.js-sign-in-as-boss-setup/error-context.md
[tests/e2e             ]   | 
[tests/e2e             ]   |     Retry #1 ───────────────────────────────────────────────────────────────────────────────────────
[tests/e2e             ]   | 
[tests/e2e             ]   |     Error: browserType.launch: Target page, context or browser has been closed
[tests/e2e             ]   |     Browser logs:
[tests/e2e             ]   | 
[tests/e2e             ]   |     <launched> pid=779
[tests/e2e             ]   |     [pid=779][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e             ]   |     Call log:
[tests/e2e             ]   |       - <launched> pid=779
[tests/e2e             ]   |       - [pid=779][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e             ]   |       - [pid=779] <gracefully close start>
[tests/e2e             ]   |       - [pid=779] <kill>
[tests/e2e             ]   |       - [pid=779] <will force kill>
[tests/e2e             ]   |       - [pid=779] exception while trying to kill process: Error: kill ESRCH
[tests/e2e             ]   |       - [pid=779] <process did exit: exitCode=127, signal=null>
[tests/e2e             ]   |       - [pid=779] starting temporary directories cleanup
[tests/e2e             ]   |       - [pid=779] finished temporary directories cleanup
[tests/e2e             ]   |       - [pid=779] <gracefully close end>
[tests/e2e             ]   | 
[tests/e2e             ]   | 
[tests/e2e             ]   |     Error Context: test-results/e2e-auth.setup.js-sign-in-as-boss-setup-retry1/error-context.md
[tests/e2e             ]   | 
[tests/e2e             ]   |     attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
[tests/e2e             ]   |     test-results/e2e-auth.setup.js-sign-in-as-boss-setup-retry1/trace.zip
[tests/e2e             ]   |     Usage:
[tests/e2e             ]   | 
[tests/e2e             ]   |         npx playwright show-trace test-results/e2e-auth.setup.js-sign-in-as-boss-setup-retry1/trace.zip
[tests/e2e             ]   | 
[tests/e2e             ]   |     ────────────────────────────────────────────────────────────────────────────────────────────────
[tests/e2e             ]   | 
[tests/e2e             ]   |     Retry #2 ───────────────────────────────────────────────────────────────────────────────────────
[tests/e2e             ]   | 
[tests/e2e             ]   |     Error: browserType.launch: Target page, context or browser has been closed
[tests/e2e             ]   |     Browser logs:
[tests/e2e             ]   | 
[tests/e2e             ]   |     <launched> pid=806
[tests/e2e             ]   |     [pid=806][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e             ]   |     Call log:
[tests/e2e             ]   |       - <launched> pid=806
[tests/e2e             ]   |       - [pid=806][err] /root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux-arm64/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory
[tests/e2e             ]   |       - [pid=806] <gracefully close start>
[tests/e2e             ]   |       - [pid=806] <kill>
[tests/e2e             ]   |       - [pid=806] <will force kill>
[tests/e2e             ]   |       - [pid=806] exception while trying to kill process: Error: kill ESRCH
[tests/e2e             ]   |       - [pid=806] <process did exit: exitCode=127, signal=null>
[tests/e2e             ]   |       - [pid=806] starting temporary directories cleanup
[tests/e2e             ]   |       - [pid=806] finished temporary directories cleanup
[tests/e2e             ]   |       - [pid=806] <gracefully close end>
[tests/e2e             ]   | 
[tests/e2e             ]   | 
[tests/e2e             ]   |     Error Context: test-results/e2e-auth.setup.js-sign-in-as-boss-setup-retry2/error-context.md
[tests/e2e             ]   | 
[tests/e2e             ]   |   2 failed
[tests/e2e             ]   |     [setup] › e2e/auth.setup.js:6:3 › sign in as an ────────────────────────────────────────────────
[tests/e2e             ]   |     [setup] › e2e/auth.setup.js:6:3 › sign in as boss ──────────────────────────────────────────────
[tests/e2e             ]   |   7 did not run
[tests/e2e             ]   ❓  ::notice title=🎭 Playwright Run Summary::  2 failed%0A    [setup] › e2e/auth.setup.js:6:3 › sign in as an ────────────────────────────────────────────────%0A    [setup] › e2e/auth.setup.js:6:3 › sign in as boss ──────────────────────────────────────────────%0A  7 did not run
[tests/e2e             ]   ❌  Failure - Main npm run test:e2e [3.104702875s]
[tests/e2e             ] exitcode '1': failure
[tests/e2e             ] ⭐ Run Complete job
[tests/e2e             ]   ✅  Success - Complete job
[tests/e2e             ] 🏁  Job failed
Error: Job 'integration' failed
act exit: 1
wall time: 325 s`,
  'lab9-cham-goc': `$ node scripts/cham-lab-9.mjs
✘ actionlint: 1 problem(s)
    lab9/ci.yml:25:29: property "nodes" is not defined in object type {node: number} [expression]
✘ R1 npm ci, never npm install — npm install in: unit (it may change package-lock.json; CI must install exactly the lockfile)
✘ R2 setup-node caches the npm downloads — no cache: npm in: unit
✘ R3 integration tests get a healthy PostgreSQL service — integration: no postgres:17 service
✘ R4 Playwright browsers come with their system libraries — playwright install without --with-deps in: e2e
✘ R5 one gate job named exactly ci-ok — no job is named ci-ok — branch protection needs one stable name to require
✘ R6 the gate runs even when a job it needs failed — no ci-ok job
✘ R7 every blocking job is required; report-only jobs never block — no ci-ok job
✘ R8 a red matrix leg makes the job red — unit: continue-on-error: true hides every red leg of the matrix
0/8 rules

Lab 9: not yet`,
  'lab9-cham-loi-giai': `$ T0=$(date +%s); node scripts/cham-lab-9.mjs lab9/loi-giai.yml --act; echo "wall time: $(( $(date +%s) - T0 )) s"
✔ actionlint: 0 problem(s)
✔ R1 npm ci, never npm install
✔ R2 setup-node caches the npm downloads
✔ R3 integration tests get a healthy PostgreSQL service
✔ R4 Playwright browsers come with their system libraries
✔ R5 one gate job named exactly ci-ok
✔ R6 the gate runs even when a job it needs failed
✔ R7 every blocking job is required; report-only jobs never block
✔ R8 a red matrix leg makes the job red
8/8 rules
  real code: act exit 0 · quarantine (report only) succeeded · unit (Node 24) succeeded · integration succeeded · unit (Node 22) succeeded · e2e succeeded · ci-ok succeeded
✔ act, real code: ci-ok succeeded
  planted bug (30 seats need approval): act exit 1 · quarantine (report only) succeeded · unit (Node 24) failed · unit (Node 22) failed · integration succeeded · e2e succeeded · ci-ok failed
✔ act, planted bug: ci-ok failed — the pull request is blocked

Lab 9: PASS
wall time: 832 s`,
  'lab9-cham-yeu': `$ node scripts/cham-lab-9.mjs lab9/thu-lan-dau.yml
✔ actionlint: 0 problem(s)
✔ R1 npm ci, never npm install
✘ R2 setup-node caches the npm downloads — no cache: npm in: unit
✘ R3 integration tests get a healthy PostgreSQL service — integration: no postgres:17 service
✘ R4 Playwright browsers come with their system libraries — playwright install without --with-deps in: e2e
✔ R5 one gate job named exactly ci-ok
✘ R6 the gate runs even when a job it needs failed — ci-ok has no if: always() — it is SKIPPED when a job fails, and a skipped required check counts as passed
✘ R7 every blocking job is required; report-only jobs never block — ci-ok does not need: integration
✘ R8 a red matrix leg makes the job red — unit: continue-on-error: true hides every red leg of the matrix
2/8 rules

Lab 9: not yet`,
  'lab9-lint': `$ actionlint lab9/ci.yml | cut -c1-120
lab9/ci.yml:25:29: property "nodes" is not defined in object type {node: number} [expression]
   |
25 |           node-version: \${{ matrix.nodes }}
   |                             ^~~~~~~~~~~~`,
  'lab9-rac': `$ act push -W .act/b2.yml --cache-server-path .act/cache --artifact-server-path .act/artifacts > /dev/null; echo "b2 (failed run) act exit: $?"; docker ps --format '{{.Names}} {{.Ports}}' | grep 'act-tests-integration.*5432' | cut -c1-40,130-; act pull_request -W lab9/thu-lan-dau.yml -j integration -e demo9/pr-event.json --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"; docker ps -a --format '{{.Names}}' | grep '^act-' | xargs docker rm -f > /dev/null; act pull_request -W lab9/thu-lan-dau.yml -j integration -e demo9/pr-event.json --cache-server-path .act/cache --artifact-server-path .act/artifacts; echo "act exit: $?"
time="2026-11-01T09:14:21+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T09:14:21+07:00" level=info msg="Start server on http://192.168.1.100:34567"
Error: Job 'integration' failed
b2 (failed run) act exit: 1
act-tests-integration-b27bc53dfbce4ce1320.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
time="2026-11-01T09:14:50+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T09:14:50+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[tests/integration] ⭐ Run Set up job
[tests/integration] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/integration]   ✅  Success - Set up job
[tests/integration] ⭐ Run Main actions/checkout@v4
[tests/integration]   ✅  Success - Main actions/checkout@v4 [358.136833ms]
[tests/integration] ⭐ Run Main actions/setup-node@v4
[tests/integration]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/integration]   ❓  ::group::Environment details
[tests/integration]   | node: v22.23.4
[tests/integration]   | npm: 10.9.9
[tests/integration]   | yarn: 
[tests/integration]   ❓  ::endgroup::
[tests/integration]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/integration]   | /root/.npm
[tests/integration]   ⚙  ***
[tests/integration]   | Cache Size: ~55 MB (57758154 B)
[tests/integration]   | Cache restored successfully
[tests/integration]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration]   ✅  Success - Main actions/setup-node@v4 [3.21107625s]
[tests/integration]   ⚙  ::set-output:: node-version=v22.23.4
[tests/integration]   ⚙  ::set-output:: cache-hit=true
[tests/integration]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/integration] ⭐ Run Main npm ci
[tests/integration]   | 
[tests/integration]   | added 568 packages, and audited 569 packages in 47s
[tests/integration]   | 
[tests/integration]   | 123 packages are looking for funding
[tests/integration]   |   run \`npm fund\` for details
[tests/integration]   | 
[tests/integration]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/integration]   | 
[tests/integration]   | To address issues that do not require attention, run:
[tests/integration]   |   npm audit fix
[tests/integration]   | 
[tests/integration]   | To address all issues possible, run:
[tests/integration]   |   npm audit fix --force
[tests/integration]   | 
[tests/integration]   | Some issues need review, and may require choosing
[tests/integration]   | a different dependency.
[tests/integration]   | 
[tests/integration]   | Run \`npm audit\` for details.
[tests/integration]   ✅  Success - Main npm ci [47.612342583s]
[tests/integration] ⭐ Run Main npm run test:int -- test/integration
[tests/integration]   | 
[tests/integration]   | > labflow-lite@1.0.0 test:int
[tests/integration]   | > vitest run --config vitest.integration.config.js test/integration
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   |  RUN  v5.0.5 …/labflow-lite
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   |  Test Files  1 passed (1)
[tests/integration]   |       Tests  11 passed (11)
[tests/integration]   |    Start at  02:15:47
[tests/integration]   |    Duration  533ms (tests 57%, transform 24%, import 17%, worker 2%)
[tests/integration]   | 
[tests/integration]   ✅  Success - Main npm run test:int -- test/integration [934.019333ms]
[tests/integration] ⭐ Run Post actions/setup-node@v4
[tests/integration]   | Cache Size: ~55 MB (57756131 B)
[tests/integration]   | Cache saved successfully
[tests/integration]   | Cache saved with the key: node-cache-Linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration]   ✅  Success - Post actions/setup-node@v4 [691.583959ms]
[tests/integration] ⭐ Run Complete job
[tests/integration] Cleaning up container for job integration
[tests/integration]   ✅  Success - Complete job
[tests/integration] 🏁  Job succeeded
act exit: 0
time="2026-11-01T09:15:49+07:00" level=info msg="Using docker host 'unix:///var/run/docker.sock', and daemon socket 'unix:///var/run/docker.sock'"
level=warning msg= ⚠ You are using Apple M-series chip and you have not specified container architecture, you might encounter issues while running act. If so, try running it with '--container-architecture linux/amd64'. ⚠ 

time="2026-11-01T09:15:49+07:00" level=info msg="Start server on http://192.168.1.100:34567"
[tests/integration] ⭐ Run Set up job
[tests/integration] 🚀  Start image=catthehacker/ubuntu:act-24.04
[tests/integration]   ✅  Success - Set up job
[tests/integration] ⭐ Run Main actions/checkout@v4
[tests/integration]   ✅  Success - Main actions/checkout@v4 [266.187458ms]
[tests/integration] ⭐ Run Main actions/setup-node@v4
[tests/integration]   | Found in cache @ /opt/hostedtoolcache/node/22.23.4/arm64
[tests/integration]   ❓  ::group::Environment details
[tests/integration]   | node: v22.23.4
[tests/integration]   | npm: 10.9.9
[tests/integration]   | yarn: 
[tests/integration]   ❓  ::endgroup::
[tests/integration]   | [command]/opt/hostedtoolcache/node/22.23.4/arm64/bin/npm config get cache
[tests/integration]   | /root/.npm
[tests/integration]   ⚙  ***
[tests/integration]   | Cache Size: ~55 MB (57756131 B)
[tests/integration]   | Cache restored successfully
[tests/integration]   | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9c9d82af8f7c07fdd133ca44e61585939d450922813bf06b7e293136a31
[tests/integration]   ✅  Success - Main actions/setup-node@v4 [2.517184833s]
[tests/integration]   ⚙  ::set-output:: node-version=v22.23.4
[tests/integration]   ⚙  ::set-output:: cache-hit=true
[tests/integration]   ⚙  ::add-path:: /opt/hostedtoolcache/node/22.23.4/arm64/bin
[tests/integration] ⭐ Run Main npm ci
[tests/integration]   | 
[tests/integration]   | added 568 packages, and audited 569 packages in 26s
[tests/integration]   | 
[tests/integration]   | 123 packages are looking for funding
[tests/integration]   |   run \`npm fund\` for details
[tests/integration]   | 
[tests/integration]   | 13 vulnerabilities (12 moderate, 1 high)
[tests/integration]   | 
[tests/integration]   | To address issues that do not require attention, run:
[tests/integration]   |   npm audit fix
[tests/integration]   | 
[tests/integration]   | To address all issues possible, run:
[tests/integration]   |   npm audit fix --force
[tests/integration]   | 
[tests/integration]   | Some issues need review, and may require choosing
[tests/integration]   | a different dependency.
[tests/integration]   | 
[tests/integration]   | Run \`npm audit\` for details.
[tests/integration]   ✅  Success - Main npm ci [25.752984625s]
[tests/integration] ⭐ Run Main npm run test:int -- test/integration
[tests/integration]   | 
[tests/integration]   | > labflow-lite@1.0.0 test:int
[tests/integration]   | > vitest run --config vitest.integration.config.js test/integration
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   |  RUN  v5.0.5 …/labflow-lite
[tests/integration]   | 
[tests/integration]   | No test files found, exiting with code 1
[tests/integration]   | 
[tests/integration]   | filter: test/integration
[tests/integration]   | include: test/integration/**/*.int.test.js, demo4/**/*.int.test.js
[tests/integration]   | exclude:  **/node_modules/**, **/.git/**
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   | ⎯⎯⎯⎯⎯⎯ Unhandled Error ⎯⎯⎯⎯⎯⎯⎯
[tests/integration]   | AggregateError: 
[tests/integration]   |     at internalConnectMultiple (node:net:1135:18)
[tests/integration]   |     at afterConnectMultiple (node:net:1716:7) {
[tests/integration]   |   code: 'ECONNREFUSED',
[tests/integration]   |   stacks: [
[tests/integration]   |     {
[tests/integration]   |       method: 'internalConnectMultiple',
[tests/integration]   |       file: 'node:net',
[tests/integration]   |       line: 1135,
[tests/integration]   |       column: 18
[tests/integration]   |     },
[tests/integration]   |     {
[tests/integration]   |       method: 'afterConnectMultiple',
[tests/integration]   |       file: 'node:net',
[tests/integration]   |       line: 1716,
[tests/integration]   |       column: 7
[tests/integration]   |     }
[tests/integration]   |   ],
[tests/integration]   |   [errors]: [
[tests/integration]   |     Error: connect ECONNREFUSED ::1:5432
[tests/integration]   |         at createConnectionError (node:net:1679:14)
[tests/integration]   |         at afterConnectMultiple (node:net:1709:16) {
[tests/integration]   |       errno: -111,
[tests/integration]   |       code: 'ECONNREFUSED',
[tests/integration]   |       syscall: 'connect',
[tests/integration]   |       address: '::1',
[tests/integration]   |       port: 5432
[tests/integration]   |     },
[tests/integration]   |     Error: connect ECONNREFUSED 127.0.0.1:5432
[tests/integration]   |         at createConnectionError (node:net:1679:14)
[tests/integration]   |         at afterConnectMultiple (node:net:1709:16) {
[tests/integration]   |       errno: -111,
[tests/integration]   |       code: 'ECONNREFUSED',
[tests/integration]   |       syscall: 'connect',
[tests/integration]   |       address: '127.0.0.1',
[tests/integration]   |       port: 5432
[tests/integration]   |     }
[tests/integration]   |   ]
[tests/integration]   | }
[tests/integration]   |  ❯ internalConnectMultiple node:net:1135:18
[tests/integration]   |  ❯ afterConnectMultiple node:net:1716:7
[tests/integration]   | 
[tests/integration]   | ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
[tests/integration]   | Serialized Error: { errors: [ [Error: connect ECONNREFUSED ::1:5432], [Error: connect ECONNREFUSED 127.0.0.1:5432] ], code: 'ECONNREFUSED' }
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   | 
[tests/integration]   ❌  Failure - Main npm run test:int -- test/integration [674.521333ms]
[tests/integration] exitcode '1': failure
[tests/integration] ⭐ Run Complete job
[tests/integration]   ✅  Success - Complete job
[tests/integration] 🏁  Job failed
Error: Job 'integration' failed
act exit: 1`,
};
