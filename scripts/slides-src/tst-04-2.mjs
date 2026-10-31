/**
 * tst-04-2 — Testing · Chapter 4 · Lesson 4.2 "Throwaway Postgres for tests (Docker, tmpfs)" (01/11/2026). Slug: tst-4-2-docker-db.
 * Output = chạy thật: compose up --wait 2.1 s; 2000 insert: tmpfs 660–686 ms vs ổ đĩa 792–885 ms.
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-04-2', code: 'TST 4.2', title: 'Throwaway Postgres for tests', sub: 'docker compose, tmpfs, healthcheck' };

const COMPOSE = `services:
  db-test:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: test
      POSTGRES_DB: labflow_test
    ports:
      - "54329:5432"
    tmpfs:
      - /var/lib/postgresql/data      # data lives in RAM
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d labflow_test"]
      interval: 1s
      retries: 30`;
const UP = `$ time docker compose -f compose.test.yml up -d --wait
 Container labflow-lite-db-test-1 Started
 Container labflow-lite-db-test-1 Waiting
 Container labflow-lite-db-test-1 Healthy

real	0m2.103s`;
const SETUP = `export default async function setup({ provide }) {
  let url = process.env.TEST_DATABASE_URL;   // set → use this database (lesson 4.2)
  …                                          // not set → start a container (lesson 4.3)
  await client.query('DROP TABLE IF EXISTS bookings');
  await client.query(readFileSync(process.env.TST_SCHEMA ?? 'db/schema.sql', 'utf8'));
  provide('databaseUrl', url);
}`;
const RUN = `$ TEST_DATABASE_URL=postgres://postgres:test@localhost:54329/labflow_test \\
    npm run test:int -- test/integration
 ✓ test/integration/pgRepo.int.test.js (11 tests)
 Test Files  1 passed (1)
      Tests  11 passed (11)`;
const GHI = `2000 inserts on port 54329: 669 ms     ← tmpfs (RAM)
2000 inserts on port 54339: 885 ms     ← Docker volume (disk)
2000 inserts on port 54329: 686 ms
2000 inserts on port 54339: 792 ms
2000 inserts on port 54329: 660 ms
2000 inserts on port 54339: 877 ms`;

export const slides = lamDeck({ chuong: 'Chapter 4 — Integration tests with a real database', bai: '4.2' }, [
  { cover: true, t: 'Throwaway Postgres for tests', sub: 'Chapter 4 · Lesson 4.2 — Docker Compose, tmpfs, healthcheck, a fresh schema every run' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A test database you can delete without fear</li>
    <li>${c('docker compose up --wait')} with a healthcheck: no “sleep 5”</li>
    <li>A fresh schema before every run</li>
    <li>tmpfs vs disk, measured on our machine</li>
    <li>Never point tests at a database with real data</li></ul>` },
  { t: 'compose.test.yml', body: js(COMPOSE, { sm: true, hl: [9, 10, 12] }) + two(box('tmpfs', 'The data directory is in memory: nothing survives a restart, which is exactly what tests want.', 'lam'), box('Port 54329', 'Not 5432 — so it never collides with a development database you care about.', 'lam')) },
  { t: 'Up and ready in 2 seconds', body: vt(UP, { title: 'terminal', sm: false }) + box('--wait + healthcheck', `Compose returns only when ${c('pg_isready')} says yes. Scripts that “sleep 5” are either slow or flaky; waiting for health is neither.`, 'xanh') },
  { t: 'A fresh schema before every run', body: js(SETUP, { hl: [2, 4, 5] }) + box('Why drop and recreate', `Every run starts from ${c('db/schema.sql')} — the same file production applies. A leftover table from yesterday cannot make today green.`, 'lam') },
  { t: 'Run the integration tests against it', body: vt(RUN, { title: 'terminal', sm: false }) +
    box('Two configs', `${c('npm run test:unit')} runs unit tests only (integration files are excluded). ${c('npm run test:int')} uses ${c('vitest.integration.config.js')} — slower, needs a database, runs fewer tests.`, 'lam') },
  { t: 'tmpfs vs disk, measured', body: vt(GHI, { title: 'terminal — node demo4/do-ghi.mjs (2000 inserts, each its own transaction)', fs: 16 }) +
    box('Our numbers: ≈ 0.67 s vs ≈ 0.85 s', 'About 20 % faster on this Mac (Docker Desktop). On slower disks the gap can be larger — measure on your own machine and CI before you trust anyone’s claim, including this one.', 'lam') },
  { t: 'Rules for a test database', body: zm(`<table class="t"><tr><th>Rule</th><th>Why</th></tr>
    <tr><td>Separate container, separate port, password “test”</td><td>tests may TRUNCATE everything</td></tr>
    <tr><td>Same major version as production (17)</td><td>SQL behaviour differs between versions</td></tr>
    <tr><td>Schema from the same file / migrations as production</td><td>no hand-made test tables</td></tr>
    <tr><td>${c('down')} after the run (tmpfs data is gone anyway)</td><td>no state leaks into the next run</td></tr>
    <tr><td><b>Never</b> a URL that points at real data</td><td>one TRUNCATE and it is gone</td></tr></table>`, 1.1) },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Start ${c('compose.test.yml')} and time ${c('up --wait')}`,
      `Run ${c('npm run test:int')} with ${c('TEST_DATABASE_URL')} pointing at it`,
      `Run ${c('demo4/do-ghi.mjs')} against tmpfs and the disk variant; write down your numbers`,
      `${c('down')} both`,
    ]) + box('Done when', '11 integration tests pass against the compose database, and you have your own tmpfs/disk numbers.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A throwaway PostgreSQL in Docker: separate port, tmpfs, healthcheck</li>
    <li>${c('up --wait')} instead of sleeping</li>
    <li>Recreate the schema from the production file every run</li>
    <li>tmpfs was ≈ 20 % faster here — measure yours</li>
    <li>Tests never touch a database with real data</li></ul>` },
]);
