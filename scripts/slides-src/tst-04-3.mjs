/**
 * tst-04-3 — Testing · Chapter 4 · Lesson 4.3 "Testcontainers for Node" (01/11/2026). Slug: tst-4-3-testcontainers.
 * Output = chạy thật: @testcontainers/postgresql 12.2.1, postgres:17, container sẵn sàng ≈ 1.2–2.1 s.
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-04-3', code: 'TST 4.3', title: 'Testcontainers for Node', sub: 'a database per test run, from the test itself' };

const SETUP = `import { PostgreSqlContainer } from '@testcontainers/postgresql';

export default async function setup({ provide }) {
  let url = process.env.TEST_DATABASE_URL;
  let container;
  if (!url) {
    container = await new PostgreSqlContainer('postgres:17').start();
    url = container.getConnectionUri();
  }
  … apply db/schema.sql …
  provide('databaseUrl', url);
  return async () => { if (container) await container.stop(); };
}`;
const HELP = `// test/support/db.js
export function openPool() {
  return new pg.Pool({ connectionString: inject('databaseUrl'), max: 5 });
}`;
const CFG = `export default defineConfig({
  test: {
    include: ['test/integration/**/*.int.test.js', 'demo4/**/*.int.test.js'],
    globalSetup: ['test/integration/global-setup.js'],
    fileParallelism: false,       // one database: files take turns (lesson 4.4)
    testTimeout: 15000,
    …
  },
});`;
const OUT = `$ npm run test:int -- test/integration
[setup] PostgreSQL container ready in 1434 ms
 ✓ test/integration/pgRepo.int.test.js (11 tests) 76ms
 Test Files  1 passed (1)
      Tests  11 passed (11)
   Duration  1.85s`;

export const slides = lamDeck({ chuong: 'Chapter 4 — Integration tests with a real database', bai: '4.3' }, [
  { cover: true, t: 'Testcontainers for Node', sub: 'Chapter 4 · Lesson 4.3 — the test run starts its own database and removes it afterwards' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Starting PostgreSQL from Vitest’s global setup</li>
    <li>${c('provide')} / ${c('inject')}: handing the URL to every test file</li>
    <li>A separate config for integration tests</li>
    <li>Compose or Testcontainers — when to use which</li>
    <li>Running it in CI</li></ul>` },
  { t: 'One container per test run', body: js(SETUP, { sm: true, hl: [7, 8, 12] }) + box('Lifecycle', 'Global setup runs once before all test files; the function it returns runs once after them. Testcontainers also starts a small helper (Ryuk) that removes the container if the run crashes.', 'lam') },
  { t: 'provide in setup, inject in tests', body: js(HELP, { hl: [3] }) + two(box('Why not process.env?', `${c('provide')} is Vitest’s supported way to pass values from global setup to test files, which run in separate workers.`, 'lam'), box('A random port', 'Testcontainers maps PostgreSQL to a free port each run, so parallel CI jobs never collide.', 'xanh')) },
  { t: 'A separate config for integration tests', body: js(CFG, { hl: [3, 4, 5] }) + box('Two commands', `${c('npx vitest run src/')} (unit, no Docker, a quarter of a second) and ${c('npm run test:int')} (integration, needs Docker). Developers run the first constantly, the second before pushing; CI runs both.`, 'xanh') },
  { t: 'The real run', body: zm(vt(OUT, { title: 'terminal', sm: false }), 1.1) + box('Measured', 'PostgreSQL 17 ready in about 1.2–2.1 s across our runs (image already pulled). The first run on a new machine also downloads the image — tens of seconds.', 'lam') },
  { t: 'Compose or Testcontainers?', body: zm(`<table class="t"><tr><th></th><th>docker compose (4.2)</th><th>Testcontainers (4.3)</th></tr>
    <tr><td>Who starts the DB</td><td>you, before the tests</td><td>the test run itself</td></tr>
    <tr><td>Port</td><td>fixed (54329)</td><td>random free port</td></tr>
    <tr><td>Forgotten cleanup</td><td>container keeps running</td><td>stopped by setup / Ryuk</td></tr>
    <tr><td>Reuse between runs</td><td>yes — fast for local loops</td><td>new container each run</td></tr>
    <tr><td>Extra dependency</td><td>none</td><td>${c('@testcontainers/postgresql')}</td></tr></table>`, 1.1) +
    box('This course', `${c('TEST_DATABASE_URL')} set → use it (compose); not set → Testcontainers. One setup file, both workflows.`, 'xanh') },
  { t: 'In CI', body: two(box('GitHub Actions ubuntu runners', 'Docker is already installed, so Testcontainers works without extra steps. Chapter 9 adds the workflow.', 'lam'), box('Or a service container', `CI can start PostgreSQL itself and pass ${c('TEST_DATABASE_URL')} — the same setup file then skips Testcontainers.`, 'lam')) +
    box('Keep the version honest', `Pin the image (${c('postgres:17')}) to production’s major version and check it in a test — the practice below.`, 'xanh') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      `Write a test that reads ${c('SHOW server_version')} through ${c("inject('databaseUrl')")}`,
      'Assert the major version is 17 and that btree_gist is installed',
      `Run it with and without ${c('TEST_DATABASE_URL')}`,
    ]) + box('Done when', `${c('npm run test:int -- demo4/th43.int.test.js')}: 1 passed.`, 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Global setup starts PostgreSQL, applies the schema, provides the URL</li>
    <li>Tests ${c('inject')} the URL; the container stops after the run</li>
    <li>Separate configs: fast unit, slower integration</li>
    <li>Compose for quick local loops, Testcontainers for self-contained runs</li></ul>` },
]);
