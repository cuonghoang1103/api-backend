/**
 * tst-11-4 — Testing · Chapter 11 · Lesson 11.4 "Shipping it in CI, and the final checklist" (01/11/2026). Slug: tst-11-4-ci.
 * Output = chạy thật (s11/_ma.mjs, 114-*): actionlint 0 lỗi; workflow.test.js 15 xanh; ngưỡng nâng 97/91/96/97 + break 95 (bỏ test quality.js ⇒
 * 93,8/84,86/94,44/92,83, ngưỡng Ch8 vẫn cho qua); báo cáo một trang; RTM tự đếm test của chính nó (BR-06 8 thay vì 7); act xanh 11:00 lạnh,
 * act đỏ 8:47 (AC7 chưa có test ⇒ report đỏ ⇒ ci-ok đỏ); nightly giờ Việt Nam 30,85 s; thực hành Lite-1 lên High.
 */
import { lamDeck, js, sql, vt, two, box, steps, c, flow, tbl, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-11-4', code: 'TST 11.4', title: 'Shipping it in CI, and the final checklist', sub: 'one pull request, one page, one gate' };

const yml = (src, o = {}) => sql(src, { lang: 'yaml', sm: true, ...o });
const NEW_JOBS = `  mutation:
    steps: [ … npm ci … ]
      - run: npm run test:mutation   # fails below break (95)
  report:
    if: \${{ !cancelled() }}         # also after a red job
    needs: [unit, integration, e2e, mutation]
    steps: [ … download the 4 artifacts … ]
      - name: one page for the whole pull request
        shell: bash                  # -eo pipefail: tee keeps the exit code
        run: node scripts/ci-report.mjs | tee -a "$GITHUB_STEP_SUMMARY"
  ci-ok:
    if: always()
    needs: [unit, integration, e2e, mutation, report]`;
const T_WF = `$ npx vitest run src/ci/workflow.test.js
     ✓ the gate requires exactly unit, integration, e2e, mutation and report (lesson 11.4) 0ms
     ✓ the report job reads every report, runs even after a red job, and keeps the exit code through tee 0ms
      Tests  15 passed (15)
$ actionlint .github/workflows/test.yml .github/workflows/nightly.yml && echo "actionlint: …"
actionlint: no problems in 2 workflows`;
const RATCHET = `$ npx vitest run src/ --coverage --exclude src/ci/quality.test.js
      Tests  291 passed (291)
All files          |   92.83 |    84.86 |   94.44 |    93.8 |
  quality.js       |       0 |        0 |       0 |       0 | 8-46
ERROR: Coverage for lines (93.8%) does not meet global threshold (97%)
ERROR: Coverage for functions (94.44%) does not meet global threshold (96%)
ERROR: Coverage for statements (92.83%) does not meet global threshold (97%)
ERROR: Coverage for branches (84.86%) does not meet global threshold (91%)`;
const REPORT = `## Quality report — LabFlow Lite 1.1 — My bookings and cancel (US-11)
### ✅ Every check passed
| Unit + API (src/) | 298 | 0 | ✅ |
| UI components (web/) | 24 | 0 | ✅ |
| DB integration (PostgreSQL 17) | 19 | 0 | ✅ |
| End to end (Chromium) | 8 | 0 | ✅ |
| lines | 98.93% | 97% | ✅ |
| branches | 93.30% | 91% | ✅ |
**Mutation score:** 99.08% (minimum 95%)
| US-11 AC5 | High | 1 | 1 | 1 | · | 1 | ✅ |
Every in-scope requirement is traced to a passing test.`;
const SELF = `$ node scripts/rtm.mjs | grep -E "^\\| (BR-06|Lite-1|Lite-2) "
| BR-06 | High | 8 | · | · | · | 1 | ✅ |
| Lite-1 | Low | 3 | · | · | · | · | ✅ |
| Lite-2 | Medium | 3 | · | · | · | · | ✅ |`;
const LAYER = `export function layerOf(file) {
  // tests of the CI tooling: ids are DATA there
  if (/(^|\\/)src\\/ci\\//.test(file)) return null;
  if (/(^|\\/)src\\/api\\//.test(file)) return 'API';
  …
}`;
const ACT_G = `[tests/unit (Node 22)-1]   ✅  Success - Main npm ci [3m9.706972542s]
[tests/mutation (Stryker, src/rules)]   ✅  Success - Main npm run test:mutation [39.717377125s]
[tests/e2e (Chromium)]   ✅  Success - Main npx playwright install --with-deps chromium [6m11.462213167s]
[tests/e2e (Chromium)]   ✅  Success - Main npm run test:e2e [5.812796625s]
[tests/ci-ok]   | ci-ok: every required job passed
Error: Job 'quarantine (report only)' failed
(time: 11:00.60 total)`;
const ACT_R = `1011cec US-11: the product owner adds AC7 (no test yet)
[tests/quality report + traceability]   | ### ❌ Do not merge
[tests/quality report + traceability]   | - traceability — US-11 AC7: no passing test
[tests/quality report + traceability]   | | US-11 AC7 | High | · | · | · | · | · | ❌ |
[tests/ci-ok]   | ✔ mutation: success
[tests/ci-ok]   | ✘ report: failure
[tests/ci-ok] 🏁  Job failed
(time: 8:47.69 total)`;
const NIGHT = `$ act workflow_dispatch -W .github/workflows/nightly.yml -j unit-hanoi --cache-server-path .act/cache
[nightly/unit, in Viet Nam time (Asia/Ho_Chi_Minh)]   |       Tests  299 passed (299)
[nightly/unit, in Viet Nam time (Asia/Ho_Chi_Minh)] 🏁  Job succeeded
(time: 30.85 s total)`;
const TH_DO = `planted in test-plan/requirements.json:  "id": "Lite-1", "risk": "Low"  →  …
### ❌ Do not merge
- traceability — Lite-1: High risk, tested only at the Unit layer
| Lite-1 | High | 2 | · | · | · | · | ❌ |`;
const TH_XANH = `### ✅ Every check passed
| Lite-1 | High | 2 | 1 | · | · | · | ✅ |`;

export const slides = lamDeck({ chuong: 'Chapter 11 — Capstone: a fully tested booking app', bai: '11.4' }, [
  { cover: true, t: 'Shipping it in CI,<br>and the final checklist', sub: 'Chapter 11 · Lesson 11.4 — every layer, mutation testing and traceability behind one required check' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Put <b>every layer</b> of the pyramid into one pull-request pipeline</li>
    <li>Raise coverage and mutation thresholds with a <b>ratchet</b>, not a guess</li>
    <li>Turn all reports into <b>one page</b> that can block a merge</li>
    <li>Rehearse the whole pipeline with <b>act</b> — green, and red for the right reason</li>
    <li>Check yourself against the <b>course checklist</b>, chapter by chapter</li></ul>` },
  { t: 'The pipeline of a pull request', body: flow([{ t: 'unit ×2', s: 'Node 22 · 24' }, { t: 'integration', s: 'PostgreSQL 17' }, { t: 'e2e', s: 'Chromium' }, { t: 'mutation', s: 'Stryker ≥ 95%', mau: '#b85a2b' }, { t: 'report', s: 'one page', mau: '#2f7d4f' }, { t: 'ci-ok', s: 'the one check', mau: '#c0392b' }], { h: 150, fs: 19 }) +
    tbl(['Job', 'It proves', 'Test step in act'], [['unit (Node 22, 24)', 'rules, services, API, contract + UI components, coverage', '5.1 s + 7.5 s'], ['integration', 'SQL, constraints, races on PostgreSQL 17', '2.0 s'],
      ['e2e', 'the wiring: screen → API → storage', '5.8 s (+ 6 min 11 s install)'], ['mutation', 'that the tests would notice a bug', '39.7 s'], ['report', 'one page, traceability gaps', '0.27 s']]) +
    two(box('Required', `${c('ci-ok')} needs unit, integration, e2e, mutation <b>and</b> report. Branch protection requires only ${c('ci-ok')} (lesson 9.3).`, 'lam'),
      box('Not required', `${c('quarantine')}: known flaky tests, ${c('continue-on-error')}. Nightly: 5 browsers, shuffled order, Viet Nam time zone.`, '')) },
  { t: 'What changed since Chapter 9', body: yml(NEW_JOBS, { hl: [3, 9, 13] }) + vt(T_WF, { title: 'the pipeline has tests too', fs: 11.5 }) +
    box('', `The workflow changed, so ${c('src/ci/workflow.test.js')} changed in the same pull request.`, 'xanh') },
  { t: 'The ratchet: thresholds just under what you measured', body: tbl(['Bar', 'Chapter 8', 'Now (11.4)', 'Measured'], [
      ['lines / statements', '85 / 85', '97 / 97', '98.93 / 98.32'], ['branches / functions', '80 / 80', '91 / 96', '93.30 / 97.47'], ['mutation break (Stryker)', '80', '95', '99.08']], { hl: [2] }) +
    vt(RATCHET, { title: 'a pull request that deletes the tests of quality.js', fs: 14 }) +
    box('Why a ratchet', `92.83 / 84.86 / 94.44 / 93.8 would have passed Chapter 8’s bars. A ratchet only moves up, and only to just below a measured number.`, 'do2') },
  { t: 'One page for the whole pull request', body: two(vt(REPORT, { title: 'node scripts/ci-report.mjs (excerpt)', fs: 13 }),
      box('What it reads', `Vitest JSON (unit, web, int), Playwright JSON (e2e), coverage summary, Stryker JSON, ${c('test-plan/requirements.json')}.`, 'lam') +
      box('What makes it red', `a failed test · a missing report · coverage or mutation under the bar · a traceability gap.`, 'do2'), 'r64') },
  { t: 'When the report counted its own tests', body: vt(SELF, { title: 'before the fix: the tests of rtm.js quote ids as data', fs: 17 }) +
    two(js(LAYER, { hl: [3] }), box('Real counts', `BR-06 is proved by <b>7</b> unit tests, not 8; Lite-1 and Lite-2 by 2, not 3. Tests of the tooling prove nothing about the product.`, 'xanh'), 'r64') },
  { t: 'Rehearsed with act: green, then red for the right reason', body: vt(ACT_G, { title: 'act — the whole pipeline, cold cache', fs: 12 }) +
    vt(ACT_R, { title: 'act — branch pr/ac7-chua-test, warm cache', fs: 12 }) +
    box('Read it right', `Every test job is green and the merge is still blocked: the product owner added AC7 and nobody wrote its test. act exits 1 because of the report-only quarantine job — as in Chapter 9.`, 'lam') },
  { t: 'The nightly run', body: vt(NIGHT, { title: 'act — one nightly job', fs: 13 }) +
    two(box('Moved to pull requests', `Mutation testing: Stryker took 39.7 s in the act run — cheap enough for every pull request.`, 'xanh'),
      box('Why a Viet Nam time zone', `Pull requests run in UTC; the night run catches the opposite time-zone bugs (lessons 2.2, 11.2).`, 'lam')) +
    tbl(['Nightly job', 'Why it waits for the night'], [['unit-hanoi', 'unit tests with TZ=Asia/Ho_Chi_Minh'], ['shuffled', 'unit tests in random order, 5 runs: order-dependent tests (8.3)'], ['e2e-all', 'Chromium, Firefox, WebKit, Pixel 7, iPhone 15: browser installs take minutes']]) },
  { t: 'The course checklist', body: zm(tbl(['Chapters', 'You can…'], [
      ['0–1', 'write a test that can fail, name it after its rule, pick boundary values'],
      ['2–3', 'control time, randomness and errors; mock only at boundaries you do not own'],
      ['4–5', 'test SQL on a real PostgreSQL; test an API from outside, against its contract'],
      ['6–7', 'test screens by role and name; write stable browser journeys'],
      ['8–9', 'read coverage and mutation scores; hunt flaky tests; make CI turn red'],
      ['10', 'write tests first when it helps; pin legacy code; review tests'],
      ['11', 'plan from risks, trace every requirement, ship behind one gate']]), 1.1) },
  { t: 'Practice (15 minutes)', body: steps([
      `Re-rate ${c('Lite-1')} (at most 4 hours) from Low to <b>High</b> in ${c('requirements.json')} and run ${c('ci-report.mjs')}`,
      `Write ONE API test: 08:00–12:30 → ${c('422 TOO_LONG')}, named with ${c('(Lite-1)')}`,
    ]) + vt(TH_DO, { title: 'before', fs: 15 }) + vt(TH_XANH, { title: 'after the API test', fs: 15 }) +
    box('Done when', 'The report says “Every check passed” with Lite-1 at High — the risk changed, so the proof had to move up a layer.', 'xanh') },
]);
