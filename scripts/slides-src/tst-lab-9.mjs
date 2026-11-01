/**
 * tst-lab-9 — Testing · Chapter 9 · Lab 9 "Fix a broken pipeline until one required check blocks a real bug" (01/11/2026). Slug: tst-9-5-lab-ci.
 * Output = chạy thật (s09/_ma.mjs): lab9/ci.yml 0/8 + 1 lỗi actionlint; lần thử đầu 2/8, act: ci-ok không chạy; dọn container sót;
 * lời giải 8/8, --act: code thật ci-ok xanh, bug 30 chỗ ci-ok đỏ, 832 s.
 */
import { lamDeck, sql, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-lab-9', code: 'TST Lab 9', title: 'Fix a broken pipeline', sub: 'until one required check blocks a real bug' };

const yml = (src, o = {}) => sql(src, { lang: 'yaml', sm: true, ...o });

const CI = `unit:
  name: unit (Node \${{ matrix.node }})
  continue-on-error: true   # "Node 20 is sometimes red"
  strategy:
    matrix:
      node: [20, 22]
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.nodes }}
    - run: npm install
    - run: npm run test:unit
    - run: npm run test:quarantine
integration:   # TEST_DATABASE_URL …localhost:5432, no services:
e2e:           # npx playwright install chromium
all-green:
  name: tests passed (\${{ github.event_name }})
  needs: [unit, e2e]
  steps:
    - run: echo "all green"`;
const GOC = `$ node scripts/cham-lab-9.mjs
✘ actionlint: 1 problem(s)
    lab9/ci.yml:25:29: property "nodes" is not defined in object type …
✘ R1 npm ci, never npm install — npm install in: unit …
✘ R2 setup-node caches the npm downloads — no cache: npm in: unit
✘ R3 integration tests get a healthy PostgreSQL service — integration: no postgres:17 service
✘ R4 Playwright browsers come with their system libraries — … in: e2e
✘ R5 one gate job named exactly ci-ok — no job is named ci-ok …
✘ R6 the gate runs even when a job it needs failed — no ci-ok job
✘ R7 every blocking job is required; report-only jobs never block — no ci-ok job
✘ R8 a red matrix leg makes the job red — unit: continue-on-error: true hides every red leg …
0/8 rules`;
const YEU = `$ node scripts/cham-lab-9.mjs lab9/thu-lan-dau.yml
✔ actionlint: 0 problem(s)
✔ R1 npm ci, never npm install
✘ R2 setup-node caches the npm downloads — no cache: npm in: unit
✘ R3 integration tests get a healthy PostgreSQL service — …
✘ R4 Playwright browsers come with their system libraries — …
✔ R5 one gate job named exactly ci-ok
✘ R6 the gate runs even when … — ci-ok has no if: always() …
✘ R7 every blocking job is required; … — ci-ok does not need: integration
✘ R8 a red matrix leg makes the job red — unit: continue-on-error: true …
2/8 rules`;
const ACT_YEU = `$ act pull_request -W lab9/thu-lan-dau.yml -e demo9/pr-event.json …
[tests/integration     ]   |     Error: connect ECONNREFUSED 127.0.0.1:5432
[tests/integration     ] 🏁  Job failed
[tests/unit (Node 20)-1]   |       Tests  4 failed | 171 passed (175)
[tests/unit (Node 20)-1] 🏁  Job failed
[tests/e2e             ]   ❌  Failure - Main npm run test:e2e [3.104702875s]
[tests/e2e             ] 🏁  Job failed
act exit: 1`;
const RAC = `$ act push -W .act/b2.yml … ; docker ps … ; act pull_request -W lab9/thu-lan-dau.yml -j integration … ; …
b2 (failed run) act exit: 1
act-tests-integration-b27bc53dfbce4ce1320.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
[tests/integration]   |       Tests  11 passed (11)
[tests/integration] 🏁  Job succeeded
act exit: 0
[tests/integration]   |     Error: connect ECONNREFUSED 127.0.0.1:5432
[tests/integration] 🏁  Job failed
act exit: 1`;
const LOI_GIAI = `$ node scripts/cham-lab-9.mjs lab9/loi-giai.yml --act
✔ actionlint: 0 problem(s)
✔ R1 npm ci, never npm install
…
✔ R8 a red matrix leg makes the job red
8/8 rules
  real code: act exit 0 · … · ci-ok succeeded
✔ act, real code: ci-ok succeeded
  planted bug (30 seats need approval): act exit 1 · unit (Node 24) failed ·
  unit (Node 22) failed · integration succeeded · e2e succeeded · ci-ok failed
✔ act, planted bug: ci-ok failed — the pull request is blocked
Lab 9: PASS
wall time: 832 s`;

export const slides = lamDeck({ chuong: 'Chapter 9 — Tests in CI', bai: 'Lab 9' }, [
  { cover: true, t: 'Lab 9 — Fix a broken pipeline<br>until one check blocks a real bug', sub: 'Chapter 9 lab · 60–90 minutes · actionlint, 8 rules, two real runs with act' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `A teammate’s ${c('lab9/ci.yml')} is “usually green”. Make green mean something`,
      'Write the promises first: exact installs, real database and browser, ONE stable required check',
      'The check fails whenever a required job did not succeed; a flaky test reports, never blocks',
      `Prove it: ${c('node scripts/cham-lab-9.mjs --act')} — green on the real code, red on a planted bug`,
    ]) },
  { t: 'The file you inherit (excerpt)', body: two(yml(CI, { hl: [3, 6, 10, 11, 13, 17] }),
      box('It is valid YAML', 'It runs. Most jobs are often green. The required check is “tests passed (pull_request)”. Nothing in it is absurd — every line is a shortcut someone took on a busy day.', 'lam'), 'r64') },
  { t: 'The grader on the original: 0/8', body: vt(GOC, { title: 'terminal — actionlint + the 8 rules of src/ci/policy.js', fs: 12.5 }) +
    box('Valid ≠ safe', 'actionlint checks the file is a workflow; the rules check that a red test turns the required check red — and nothing else does.', 'xanh') },
  { t: 'The first attempt: loud fixes only', body: vt(YEU, { title: 'terminal — lint fixed, npm ci, gate renamed to ci-ok', fs: 13 }) + vt(ACT_YEU, { title: 'act — the same attempt, a real run', fs: 12.5 }) },
  { t: 'Clean up between act runs', body: vt(RAC, { title: 'terminal — a failed run leaves its PostgreSQL on 5432; a job WITHOUT a service passes; after docker rm -f it fails', fs: 13.5 }) +
    two(box('What happened', 'act keeps the containers of a failed job so you can inspect them — including its service. The next job without a service connected to it.', 'do2'),
      box('Habit', `${c('docker ps -a | grep act-')} before trusting a green act run; remove what is left.`, 'xanh')) },
  { t: 'The reference: 8/8, green — and red on a bug', body: vt(LOI_GIAI, { title: 'terminal — the grader with two real act runs', fs: 13.5 }) +
    box('The whole chapter in one line', 'The required check is red exactly when a required test is red.', 'xanh') },
  { t: 'Rubric (10 points, pass 7)', to: true, body: zm(`<table class="t"><tr><th>Criterion</th><th>Points</th></tr>
    <tr><td>actionlint: 0 problems</td><td>1</td></tr>
    <tr><td>The 8 rules (0.5 each)</td><td>4</td></tr>
    <tr><td>--act, real code: ci-ok succeeded</td><td>2</td></tr>
    <tr><td>--act, planted bug: ci-ok failed</td><td>2</td></tr>
    <tr><td>PR description: the ONE required check, and what happens to the quarantined test</td><td>1</td></tr></table>`, 1.1) },
  { t: 'Hints, from light to strong', to: true, giua: true, body: steps([
      'Read each ✘ line: it names the job and the problem',
      'Lesson 9.1: service, cache, browser install · 9.3: the gate · 9.4: the matrix decision',
      `The quarantined test gets its own job with ${c('continue-on-error: true')} — not in the gate’s needs`,
      `Still stuck? Read what each rule checks in ${c('src/ci/policy.js')}`,
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('actionlint lab9/ci.yml')} prints nothing</li>
    <li>${c('node scripts/cham-lab-9.mjs --act')} ends with <b>Lab 9: PASS</b></li>
    <li>Your PR description: branch protection requires <b>ci-ok</b> only; LAB-142 stays in quarantine until fixed</li>
    <li>${c('docker ps -a | grep act-')} is empty</li></ul>` },
]);
