/**
 * tst-09-1 — Testing · Chapter 9 · Lesson 9.1 "Running tests in GitHub Actions" (01/11/2026). Slug: tst-9-1-github-actions.
 * Output = chạy thật bằng act 0.2.94 (s09/_ma.mjs): unit + web 116 + 16 passed; npm ci 34.8 s / 49.6 s lạnh / 15.0 s ấm (47/61/27 s cả lượt);
 * lockfile lệch ⇒ EUSAGE; service localhost 11 passed, tên "postgres" ⇒ ENOTFOUND; thiếu --with-deps ⇒ libnspr4.so; --with-deps 5m04s, 9 passed;
 * it.only xanh trên máy, đỏ khi CI=true.
 */
import { lamDeck, sql, vt, two, box, steps, c, zm, flow } from './_tst-chung.mjs';

export const deck = { key: 'tst-09-1', code: 'TST 9.1', title: 'Running tests in GitHub Actions', sub: 'a workflow, rehearsed on your machine with act' };

const yml = (src, o = {}) => sql(src, { lang: 'yaml', sm: true, ...o });

const WF = `name: tests
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
      - run: npm run test:web`;
const DAU = `$ act push -W demo9/wf/91-khong-cache.yml
[tests/unit + web]   ✅  Success - Main actions/checkout@v4 [271.106583ms]
[tests/unit + web]   ✅  Success - Main actions/setup-node@v4 [2.098421667s]
[tests/unit + web]   ✅  Success - Main npm ci [34.826572666s]
[tests/unit + web]   |       Tests  116 passed (116)
[tests/unit + web]   ✅  Success - Main npm run test:unit [1.217838791s]
[tests/unit + web]   |       Tests  16 passed (16)
[tests/unit + web]   ✅  Success - Main npm run test:web [2.48679s]
[tests/unit + web] 🏁  Job succeeded
wall time: 47 s`;
const LECH = `$ grep dayjs package.json; npm ci
    "dayjs": "^1.11.13"
npm error \`npm ci\` can only install packages when your package.json and
  package-lock.json or npm-shrinkwrap.json are in sync. …
npm error Missing: dayjs@1.11.23 from lock file
[exit 1]`;
const CACHE = `[1st run]  ⚙  ::set-output:: cache-hit=false
[1st run]  ✅  Success - Main npm ci [49.599284791s]
[1st run]  | Cache saved successfully
wall time: 61 s
[2nd run]  | Cache restored from key: node-cache-linux-arm64-npm-f0c1a9…
[2nd run]  ⚙  ::set-output:: cache-hit=true
[2nd run]  ✅  Success - Main npm ci [14.977650833s]
wall time: 27 s`;
const SVC = `services:
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
  TEST_DATABASE_URL: postgres://postgres:test@localhost:5432/labflow_test`;
const PG = `[tests/integration] container health of … (postgres:17) is healthy
[tests/integration]   |       Tests  11 passed (11)
[tests/integration] 🏁  Job succeeded`;
const PG_TEN = `[tests/integration]   | Error: getaddrinfo ENOTFOUND postgres
[tests/integration]   ❌  Failure - Main npm run test:int …
act exit: 1`;
const PW = `$ act push -W demo9/wf/91-e2e-thieu-deps.yml
✅  Success - Main npx playwright install chromium [3m2.749331792s]
[err] …/chrome-headless-shell: error while loading shared libraries:
      libnspr4.so: cannot open shared object file: No such file or directory
  2 failed
  7 did not run
act exit: 1
$ act push -W demo9/wf/91-e2e.yml
✅  Success - Main npx playwright install --with-deps chromium [5m3.960726083s]
  9 passed (3.0s)
✅  Success - Main npm run test:e2e [3.683010333s]`;
const ONLY = `$ npx vitest run demo9/chi-mot.test.js
   ✓ 31 seats need approval 1ms
   ↓ 30 seats do not
      Tests  1 passed | 1 skipped (2)
$ CI=true npx vitest run demo9/chi-mot.test.js
Error: [Vitest] Unexpected .only modifier. Remove it or pass --allowOnly argument to bypass this error
      Tests  1 failed | 1 skipped (2)`;

export const slides = lamDeck({ chuong: 'Chapter 9 — Tests in CI', bai: '9.1' }, [
  { cover: true, t: 'Running tests in<br>GitHub Actions', sub: 'Chapter 9 · Lesson 9.1 — one workflow, rehearsed on your own machine with act' },
  { t: 'What you will be able to do after this lesson', to: true, giua: true, body: `<ul>
    <li>Write a workflow that tests LabFlow Lite on every push and pull request</li>
    <li>Install exactly the lockfile, and cache the downloads</li>
    <li>Give integration tests a real PostgreSQL, e2e tests a real browser</li>
    <li>Run the workflow locally with <b>act</b>, check it with <b>actionlint</b></li>
    <li>Say where act differs from GitHub — before it surprises you</li></ul>` },
  { t: 'CI in one picture', to: true, body: flow([{ t: 'Event', s: 'push · pull request' }, { t: 'Fresh machine', s: 'one per job' }, { t: 'Steps', s: 'checkout · npm ci · tests' }, { t: 'Exit code', s: '0 = ✓ · else ✗', mau: '#2f7d4f' }, { t: 'Check on PR', s: 'next to Merge', mau: '#b85a2b' }], { h: 170, fs: 21 }) +
    two(box('Words', `<b>workflow</b> = a YAML file in ${c('.github/workflows/')} · <b>job</b> = runs on its own <b>runner</b> · <b>step</b> = ${c('run:')} a command or ${c('uses:')} an <b>action</b>`, 'lam'),
      box('Why a machine', 'A command someone must remember is skipped on exactly the day it matters. A neutral machine runs it every time, on code that is not on your laptop.', 'xanh')) },
  { t: 'The first workflow', body: two(yml(WF, { hl: [16, 17, 18] }),
      box('Line by line', `${c('on:')} pushes to main + every PR<br>${c('runs-on')} a fresh Ubuntu machine<br>${c('timeout-minutes')} a hung test cannot burn 6 hours<br>${c('checkout')} the code · ${c('setup-node')} Node 22<br>three ${c('run:')} steps = the commands you type<br><br><b>A step fails when its command exits ≠ 0.</b>`, 'lam'), 'r64') },
  { t: 'Rehearse it locally with act', body: vt(DAU, { title: 'terminal — act 0.2.94, image catthehacker/ubuntu:act-24.04 (arm64)', fs: 14 }) +
    two(box('act is not GitHub', `A Docker container per job, <b>your working folder</b> (uncommitted files too). ${c('--cache-server-path')} and ${c('--artifact-server-path')} only on the command line.`, 'do2'),
      box('Read the numbers', `${c('npm ci')}: 34.8 of 47 seconds. Installing, not testing, is the cost of CI.`, 'xanh')) },
  { t: 'npm ci, never npm install', body: vt(LECH, { title: 'terminal — a teammate added dayjs by hand, not the lockfile', fs: 15 }) +
    zm(`<table class="t"><tr><th></th><th>npm install</th><th>npm ci</th></tr>
    <tr><td>Lockfile out of date</td><td>quietly rewrites it</td><td><b>refuses</b> (exit 1)</td></tr>
    <tr><td>node_modules</td><td>updates what is there</td><td>deletes, installs exactly the lockfile</td></tr>
    <tr><td>In CI</td><td>tests code nobody has</td><td>tests the versions you committed</td></tr></table>`, 0.95) },
  { t: 'Cache the downloads, not node_modules', body: vt(CACHE, { title: 'act — cache: npm, two runs in a row', fs: 15 }) +
    two(zm(`<table class="t"><tr><th>Run</th><th>npm ci</th><th>Whole run</th></tr>
      <tr><td>no cache</td><td>34.8 s</td><td>47 s</td></tr>
      <tr><td>cache, 1st (miss)</td><td>49.6 s</td><td>61 s</td></tr>
      <tr><td>cache, 2nd (hit)</td><td>15.0 s</td><td>27 s</td></tr></table>`, 1.05),
    box('What it does', `${c('cache: npm')} saves ${c('~/.npm')} (55 MB) under a key from the hash of ${c('package-lock.json')}. The two cold runs differ by 15 s — only the network changed. Measure twice.`, 'lam')) },
  { t: 'A real PostgreSQL: a service container', body: two(zm(yml(SVC, { hl: [7, 8, 10, 13] }), 0.9),
      box('localhost or the label? (GitHub Docs, 01/11/2026)', `Job on the runner ⇒ ${c('localhost:<mapped port>')}. Job in a ${c('container:')} ⇒ the label ${c('postgres')} is the hostname. The health check keeps tests from starting before the database is ready.`, 'do2'), 'r64') +
    two(vt(PG, { title: 'act — localhost:5432', fs: 12.5 }), vt(PG_TEN, { title: 'act — host “postgres”, no ports', fs: 12.5 })) },
  { t: 'Playwright needs --with-deps', body: vt(PW, { title: 'act — the e2e job, without and with the system libraries', fs: 13.5 }) +
    two(box('Read the error', 'The 2 sign-in setup tests failed, 7 never ran, in 2.8 s. The test code was fine — Chromium could not start without libnspr4.', 'do2'),
      box('5 minutes vs 3.7 seconds', 'On this network. Playwright docs: “Caching browser binaries is not recommended”. Alternative: Playwright’s Docker image.', 'lam')) },
  { t: 'One more trap: it.only', body: vt(ONLY, { title: 'terminal — the same file, on your machine and with CI=true', fs: 14 }) +
    two(box('Green that lies', 'On the laptop the wrong test never ran. One forgotten .only hides the whole file.', 'do2'),
      box('CI refuses', `GitHub and act set ${c('CI=true')}; Vitest then forbids .only. Playwright: ${c('forbidOnly: !!process.env.CI')}.`, 'xanh')) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `${c('demo9/wf/th91-de.yml')} never went green. Run ${c('actionlint')} on it first`,
      `Fix what it reports, then run the job with ${c('act')}`,
      `Fix what act shows, run again until the integration tests pass`,
    ]) + box('Measured', `actionlint: ${c('label "ubuntu-lastest" is unknown')} (act alone: “Skipping unsupported platform”, exit 0!) · then act: ${c('database "labflow" does not exist')} — the service creates labflow_test.`, 'lam') +
    box('Done when', `actionlint prints nothing, ${c('act exit: 0')}, 11 integration tests passed — and you can say which mistake only a real run could find.`, 'xanh') },
]);
