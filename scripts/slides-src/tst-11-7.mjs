/**
 * tst-11-7 — Testing · Chapter 11 · Lesson 11.7 "Where to go next" (01/11/2026). Slug: tst-11-7-hoc-tiep.
 * Số liệu = chạy thật (s11/_ma.mjs): ngân sách kim tự tháp 111-ngan-sach (thực hành), ma trận 111-ma-tran.
 * Khoá tiếp theo: api-design, nodejs, github-actions, observability-monitoring, system-design (+ performance-load-testing).
 */
import { lamDeck, vt, two, box, steps, c, zm, flow, cards } from './_tst-chung.mjs';

export const deck = { key: 'tst-11-7', code: 'TST 11.7', title: 'Where to go next', sub: 'from a tested app to a production system' };

const BUDGET = `$ node scripts/ngan-sach.mjs 3
| Layer | Tests | Median of 3 runs | Per test |
| Unit + API (src/) | 299 | 1.6 s | 5 ms |
| UI components (web/) | 24 | 2.3 s | 95 ms |
| DB integration | 19 | 1.5 s | 80 ms |
| E2E, Chromium | 8 | 4.2 s | 521 ms |
| E2E, 5 browsers/devices | 40 | 24.1 s | 602 ms |
| Mutation (Stryker, src/rules) | 433 mutants | 28.7 s | 66 ms |`;

export const slides = lamDeck({ chuong: 'Chapter 11 — Capstone: a fully tested booking app', bai: '11.7' }, [
  { cover: true, t: 'Where to go next', sub: 'Chapter 11 · Lesson 11.7 — what you can do now, the five courses that build on it, and how to keep a suite healthy for years' },
  { t: 'What you can do now', body: cards([
      ['Section 0–2 · foundations', 'tests that can fail; boundaries; time, randomness and errors under control'],
      ['3–5 · real dependencies', 'mocks only at boundaries; PostgreSQL in a container; APIs against their contract'],
      ['6–7 · the user’s side', 'Testing Library by role and name; Playwright journeys that do not flake'],
      ['8 · trust', 'coverage read honestly; mutation score; flaky tests hunted down'],
      ['9–10 · teams', 'CI that turns red; one required check; TDD; legacy code; review'],
      ['11 · capstone', 'risk plan, five layers, traceability gate — 100/100 on one feature'],
    ], 3) + box('The one habit', `Before you trust a test, name the bug that turns it red. Everything in this course is that habit at a different layer.`, 'xanh') },
  { t: 'The path from here', body: flow([{ t: 'Testing', s: 'this course', mau: '#2f7d4f' }, { t: 'API design', s: 'contracts' }, { t: 'Node.js', s: 'logs, metrics' }, { t: 'GitHub Actions', s: 'deploy safely' }, { t: 'Observability', s: 'after release', mau: '#b85a2b' }, { t: 'System design', s: 'at scale', mau: '#b85a2b' }], { h: 170, fs: 18 }) +
    two(box('Before release', `Tests prove the behaviour you <b>thought of</b>: 12 planted bugs, 12 caught.`, 'lam'),
      box('After release', `Observability shows the behaviour you <b>did not</b> think of: real users, real load, real clocks.`, 'do2')) +
    box('First lesson to open in each course', `<b>API design</b> 12.1 · <b>Node.js</b> 15.1 · <b>GitHub Actions</b> 15.1 · <b>Observability</b> 0.1 · <b>System design</b> “Start here” and 9.2 · extra: <b>Performance</b> “Start here”. The written lesson has a link card for each.`, 'xanh') },
  { t: 'API design and Node.js: what to add to LabFlow', body: two(box('API design → 12.1, 7.1', `Design the next LabFlow endpoints contract-first (OpenAPI), then let the contract check of Chapter 5 and the PostgreSQL contract test of 11.2 guard them. Error shapes, pagination and idempotency all become tests.`, 'lam'),
      box('Node.js → 15.1', `Add structured logs and a request id to the API. Then a test can assert that a failed cancel logs ${c('TOO_LATE_TO_CANCEL')} with the same id the client saw — logging becomes testable behaviour.`, 'lam')) +
    box('Why these two first', `They extend code you already have tests for, so every change lands on a safety net you built.`, 'xanh') },
  { t: 'GitHub Actions and observability', body: two(box('GitHub Actions → 15.1, 15.3', `Your ${c('ci-ok')} gate is the front half of a pipeline. Add build, deploy to staging, a smoke test against the deployed URL, and a rollback that is tested too.`, 'lam'),
      box('Observability → 0.1', `Metrics and traces answer “is it slow for real users?”. Turn the act timings (Chromium install 6½ of 8¾ minutes) and the test-run medians into dashboards, not guesses.`, 'lam')) +
    box('A test is not a monitor', `A green suite says the code did the right thing once, on a laptop. It says nothing about tonight’s traffic.`, 'do2') },
  { t: 'System design, and an extra: performance', body: two(box('System design → 0.8, 9.2', `9.2 is LabFlow’s problem at scale: preventing double booking with constraints, locks and conditional updates — exactly what the EXCLUDE constraint and the atomic ${c('UPDATE')} of 11.2 did for one database.`, 'lam'),
      box('Performance and load → 0.8', `Our race test sends two cancels. A load test sends two thousand. Same question — does exactly one win? — measured under pressure.`, 'lam')) +
    box('How to choose', `Backend job next? API design + Node.js. DevOps or platform? GitHub Actions + observability. Interviews at product companies? System design.`, 'xanh') },
  { t: 'A 30/60/90-day plan', to: true, body: zm(`<table class="t"><tr><th>Days</th><th>Do</th><th>Proof it is done</th></tr>
    <tr><td style="white-space:nowrap">1–30</td><td>Apply the capstone to your own SWP391/SEP490 feature</td><td>a plan with ids; one test above Unit per High risk; ci-ok green</td></tr>
    <tr><td style="white-space:nowrap">31–60</td><td>API design 12 + Node.js 15 on LabFlow</td><td>contract-first endpoint; logs asserted in a test</td></tr>
    <tr><td style="white-space:nowrap">61–90</td><td>GitHub Actions 15 + observability</td><td>deploy with a smoke test; one dashboard you read weekly</td></tr></table>`, 1.12) +
    box('Keep the portfolio honest', `Every number in your README re-runs from the repository with one command.`, 'xanh') },
  { t: 'Keeping a suite healthy for months', body: two(steps([
      `<b>Ratchet</b> thresholds up, never down (85 → 97 lines)`,
      `<b>Quarantine</b> a flaky test with an issue and an owner`,
      `<b>Delete</b> tests that only check their own mocks`,
      `<b>Review</b> tests with the checklist of 10.3`,
      `<b>Upgrade</b> Vitest, Playwright, Node on a schedule`,
    ]), box('Measure it monthly', `Re-run ${c('node scripts/ngan-sach.mjs')}: a layer that doubled in time is a smell. Re-run Stryker: a score that drops means new code with weak tests.`, 'lam') +
      box('The trap', `“Just add a retry” turned 17/50 red runs into 0/50 in lesson 8.3 — with the bug still there.`, 'do2')) },
  { t: 'Moving to Spring Boot: the same ideas', to: true, body: zm(`<table class="t"><tr><th>In this course</th><th>In Java / Spring Boot</th></tr>
    <tr><td>Vitest, it.each</td><td>JUnit 5, @ParameterizedTest</td></tr>
    <tr><td>vi.fn, fakes</td><td>Mockito — still only at boundaries</td></tr>
    <tr><td>Testcontainers (Node)</td><td>Testcontainers for Java, @ServiceConnection</td></tr>
    <tr><td>Supertest + OpenAPI check</td><td>MockMvc / RestAssured + an OpenAPI validator</td></tr>
    <tr><td>Playwright</td><td>Playwright for Java</td></tr>
    <tr><td>Stryker</td><td>PIT (pitest)</td></tr>
    <tr><td>(BR-04) in test names</td><td>@DisplayName / @Tag("BR-04")</td></tr></table>`, 1.08) },
  { t: 'Practice: plan your own budget (15 minutes)', body: vt(BUDGET, { title: 'LabFlow Lite, measured in lesson 11.1 — the model for your own project', fs: 14.5 }) +
    two(box('Read it', `Before pushing: Unit + UI + DB = 1.6 + 2.3 + 1.5 = 5.4 s. Add E2E Chromium: 9.6 s — still under 15 s. Five browsers (24.1 s) go to the nightly run; mutation (28.7 s) fits in a pull request.`, 'lam'),
      box('Done when', `You have the same table for your own project, a 15-second pre-push budget, and a sentence for each layer saying which bug only it can catch.`, 'xanh')) },
]);
