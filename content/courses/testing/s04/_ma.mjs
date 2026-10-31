/**
 * _ma.mjs (Chương 4) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  schema: `-- LabFlow Lite — PostgreSQL schema (Chapter 4). Applied fresh before every integration run.
CREATE EXTENSION IF NOT EXISTS btree_gist;   -- lets "lab WITH =" join a GiST exclusion constraint

CREATE TABLE bookings (
  id         serial PRIMARY KEY,
  lab        text    NOT NULL,
  date       date    NOT NULL,
  start_time time    NOT NULL,
  end_time   time    NOT NULL,
  seats      int     NOT NULL CHECK (seats > 0),
  role       text    NOT NULL,
  status     text    NOT NULL,
  minutes    int     NOT NULL,
  email      text,
  -- BR-04 in the database: no two bookings of one lab may overlap. Bounds [) = the end minute is free.
  CONSTRAINT no_overlap EXCLUDE USING gist (
    lab WITH =,
    tsrange(date + start_time, date + end_time, '[)') WITH &&
  )
);`,
  schemaKhong: `-- LabFlow Lite — PostgreSQL schema (Chapter 4). Applied fresh before every integration run.

CREATE TABLE bookings (
  id         serial PRIMARY KEY,
  lab        text    NOT NULL,
  date       date    NOT NULL,
  start_time time    NOT NULL,
  end_time   time    NOT NULL,
  seats      int     NOT NULL CHECK (seats > 0),
  role       text    NOT NULL,
  status     text    NOT NULL,
  minutes    int     NOT NULL,
  email      text
);`,
  pgRepo: `// The PostgreSQL adapter for the repository port (Chapter 4). Same two methods as createMemoryRepo.
import { BookingError } from './service.js';

export function createPgRepo(db) {   // db: a pg Pool or a single Client — anything with .query()
  return {
    async findOverlap(lab, date, start, end) {
      const { rows } = await db.query(
        'SELECT id FROM bookings WHERE lab = $1 AND date = $2 AND start_time < $4 AND $3 < end_time LIMIT 1',
        [lab, date, start, end]);
      return rows[0] ?? null;
    },
    async insert(b) {
      try {
        const { rows } = await db.query(
          'INSERT INTO bookings (lab, date, start_time, end_time, seats, role, status, minutes, email) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
          [b.lab, b.date, b.start, b.end, b.seats, b.role, b.status, b.minutes, b.email ?? null]);
        return { id: rows[0].id, ...b };
      } catch (err) {
        if (err.code === '23P01') throw new BookingError('OVERLAP', { cause: err }); // exclusion_violation
        throw err;
      }
    },
  };
}`,
  service: `import { checkSlot, needsApproval } from '../rules/booking.js';

export class BookingError extends Error {
  constructor(code, options) {
    super(code, options);
    this.name = 'BookingError';
    this.code = code;
  }
}

// An in-memory "database" whose methods are async, like a real one.
export function createMemoryRepo() {
  const rows = [];
  const latency = () => new Promise((resolve) => setTimeout(resolve, 5));
  return {
    async findOverlap(lab, date, start, end) {
      await latency();
      return rows.find((b) => b.lab === lab && b.date === date && b.start < end && start < b.end) ?? null;
    },
    async insert(booking) {
      await latency();
      const row = { id: rows.length + 1, ...booking };
      rows.push(row);
      return row;
    },
    count: () => rows.length,
  };
}

export async function bookLab(repo, input) {
  const slot = checkSlot(input.start, input.end);
  if (!slot.ok) throw new BookingError(slot.code);
  let clash;
  try {
    clash = await repo.findOverlap(input.lab, input.date, input.start, input.end);
  } catch (err) {
    throw new BookingError('STORAGE_DOWN', { cause: err });
  }
  if (clash) throw new BookingError('OVERLAP');
  const status = needsApproval(input) ? 'PENDING' : 'CONFIRMED';
  try {
    return await repo.insert({ ...input, minutes: slot.minutes, status });
  } catch (err) {
    if (err instanceof BookingError) throw err; // Chapter 4: the database itself can say OVERLAP
    throw new BookingError('STORAGE_DOWN', { cause: err });
  }
}`,
  globalSetup: `// Integration tests: one throwaway PostgreSQL per run, with a fresh schema.
//  - TEST_DATABASE_URL set (lesson 4.2: docker compose) → use that database
//  - otherwise (lesson 4.3) → start a container with Testcontainers and stop it afterwards
import { readFileSync } from 'node:fs';
import pg from 'pg';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

export default async function setup({ provide }) {
  let url = process.env.TEST_DATABASE_URL;
  let container;
  if (!url) {
    const t0 = Date.now();
    container = await new PostgreSqlContainer('postgres:17').start();
    url = container.getConnectionUri();
    console.log('[setup] PostgreSQL container ready in ' + (Date.now() - t0) + ' ms');
  }
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  await client.query('DROP TABLE IF EXISTS bookings');
  await client.query(readFileSync(process.env.TST_SCHEMA ?? 'db/schema.sql', 'utf8'));
  await client.end();
  provide('databaseUrl', url);
  return async () => { if (container) await container.stop(); };
}`,
  intConfig: `import { defineConfig } from 'vitest/config';

// Integration tests talk to a real PostgreSQL. Run with: npm run test:int
export default defineConfig({
  test: {
    include: ['test/integration/**/*.int.test.js', 'demo4/**/*.int.test.js'],
    globalSetup: ['test/integration/global-setup.js'],
    fileParallelism: false,               // one database, so test files take turns (lesson 4.4)
    reporters: ['tree'],
    expect: { requireAssertions: true },
    restoreMocks: true,
    testTimeout: 15000,
  },
});`,
  config: `import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['tree'],                 // print the describe → it tree
    expect: { requireAssertions: true }, // a test without any expect fails (lesson 1.1)
    restoreMocks: true,                  // undo every vi.spyOn before each test (lesson 2.4)
    exclude: [...configDefaults.exclude, 'test/integration/**', 'demo4/**'], // need a database: npm run test:int
  },
});`,
  dbHelpers: `// Helpers for integration tests.
import { inject } from 'vitest';
import pg from 'pg';

export function openPool() {
  return new pg.Pool({ connectionString: inject('databaseUrl'), max: 5 });
}

let n = 0;
// A valid booking with sensible defaults; each call gets its own lab so tests do not collide by accident.
export function makeBooking(overrides = {}) {
  n += 1;
  return { lab: 'LAB-' + n, date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00', ...overrides };
}`,
  dua: `import { it, expect, beforeAll, afterAll } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { createPgRepo } from '../src/booking/pgRepo.js';
import { openPool } from '../test/support/db.js';

let pool;
beforeAll(async () => {
  pool = openPool();
  // open two connections now, so both bookings below really start at the same moment
  await Promise.all([pool.query('SELECT 1'), pool.query('SELECT 1')]);
  await pool.query('TRUNCATE bookings RESTART IDENTITY');
});
afterAll(() => pool.end());

it('two students book the same slot at the same moment: only one wins (real PostgreSQL)', async () => {
  const repo = createPgRepo(pool);
  const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
  const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
  expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);
  expect(results.find((r) => r.status === 'rejected').reason.code).toBe('OVERLAP');
});`,
  sqlite: `import { it, expect } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';
import { inject } from 'vitest';

it('SQLite stores the text "thirty" in an INTEGER column', () => {
  const db = new DatabaseSync(':memory:');
  db.exec('CREATE TABLE bookings (id INTEGER PRIMARY KEY, seats INTEGER NOT NULL)');
  db.prepare('INSERT INTO bookings (seats) VALUES (?)').run('thirty');
  expect(db.prepare('SELECT seats, typeof(seats) AS type FROM bookings').get()).toEqual({ seats: 'thirty', type: 'text' });
});

it('PostgreSQL refuses it: 22P02 invalid input syntax for type integer', async () => {
  const client = new pg.Client({ connectionString: inject('databaseUrl') });
  await client.connect();
  try {
    await expect(client.query('INSERT INTO bookings (lab, date, start_time, end_time, seats, role, status, minutes) ' +
      "VALUES ('BE-201', '2026-11-16', '08:00', '10:00', $1, 'STUDENT', 'CONFIRMED', 120)", ['thirty']))
      .rejects.toMatchObject({ code: '22P02', message: 'invalid input syntax for type integer: "thirty"' });
  } finally {
    await client.end();
  }
});`,
  th41: `import { it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { createPgRepo } from '../src/booking/pgRepo.js';
import { openPool } from '../test/support/db.js';

let pool;
beforeAll(() => { pool = openPool(); });
beforeEach(() => pool.query('TRUNCATE bookings RESTART IDENTITY'));
afterAll(() => pool.end());
const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('the Chapter 2 race, now without it.fails: one row in the table', async () => {
  const repo = createPgRepo(pool);
  await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
  const { rows } = await pool.query('SELECT count(*)::int AS n FROM bookings');
  expect(rows[0].n).toBe(1);
});

it('PostgreSQL refuses a time that does not exist: 25:00', async () => {
  await expect(createPgRepo(pool).insert({ ...input, end: '25:00', status: 'CONFIRMED', minutes: 120 }))
    .rejects.toMatchObject({ code: '22008' });
});`,
  compose: `# Throwaway PostgreSQL for tests. Data lives in RAM (tmpfs): fast, and gone when the container stops.
services:
  db-test:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: test
      POSTGRES_DB: labflow_test
    ports:
      - "54329:5432"
    tmpfs:
      - /var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d labflow_test"]
      interval: 1s
      timeout: 3s
      retries: 30`,
  composeDisk: `# The same database on a normal Docker volume (disk) — only to measure the difference with tmpfs.
services:
  db-disk:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: test
      POSTGRES_DB: labflow_test
    ports:
      - "54339:5432"
    volumes:
      - db-disk-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d labflow_test"]
      interval: 1s
      timeout: 3s
      retries: 30
volumes:
  db-disk-data:`,
  doGhi: `// Measure: 2000 bookings inserted one by one (each its own transaction, like a test suite does).
// node demo4/do-ghi.mjs <database url>
import { readFileSync } from 'node:fs';
import pg from 'pg';
import { createPgRepo } from '../src/booking/pgRepo.js';

const client = new pg.Client({ connectionString: process.argv[2] });
await client.connect();
await client.query('DROP TABLE IF EXISTS bookings');
await client.query(readFileSync('db/schema.sql', 'utf8'));
const repo = createPgRepo(client);
const t0 = performance.now();
for (let i = 0; i < 2000; i++) {
  await repo.insert({ lab: 'LAB-' + i, date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, role: 'STUDENT', status: 'CONFIRMED', minutes: 120 });
}
console.log('2000 inserts on port ' + new URL(process.argv[2]).port + ': ' + Math.round(performance.now() - t0) + ' ms');
await client.end();`,
  th43: `import { it, expect, inject } from 'vitest';
import pg from 'pg';

it('tests run on the same major version as production (PostgreSQL 17) with btree_gist', async () => {
  const client = new pg.Client({ connectionString: inject('databaseUrl') });
  await client.connect();
  try {
    const version = (await client.query('SHOW server_version')).rows[0].server_version;
    const ext = (await client.query("SELECT extname FROM pg_extension WHERE extname = 'btree_gist'")).rows;
    expect(version).toMatch(/^17\\./);
    expect(ext).toEqual([{ extname: 'btree_gist' }]);
  } finally {
    await client.end();
  }
});`,
  roRi: `// No cleanup between tests: the second test inherits the first test's row.
import { it, expect, beforeAll, afterAll } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { createPgRepo } from '../src/booking/pgRepo.js';
import { openPool } from '../test/support/db.js';

let pool;
beforeAll(() => { pool = openPool(); });
afterAll(() => pool.end());
const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('A: a student books BE-201 at 08:00', async () => {
  await expect(bookLab(createPgRepo(pool), input)).resolves.toMatchObject({ status: 'CONFIRMED' });
});

it('B: a lecturer books BE-201 at 08:00 for 40 seats', async () => {
  await expect(bookLab(createPgRepo(pool), { ...input, role: 'LECTURER', seats: 40 })).resolves.toMatchObject({ status: 'CONFIRMED' });
});`,
  truncate: `// Isolation 1: empty the table before every test.
import { it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { createPgRepo } from '../src/booking/pgRepo.js';
import { openPool } from '../test/support/db.js';

let pool;
beforeAll(() => { pool = openPool(); });
beforeEach(() => pool.query('TRUNCATE bookings RESTART IDENTITY'));
afterAll(() => pool.end());
const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it.each(Array.from({ length: 20 }, (_, i) => i + 1))('booking %i of the same slot starts from an empty table', async () => {
  await expect(bookLab(createPgRepo(pool), input)).resolves.toMatchObject({ id: 1, status: 'CONFIRMED' });
});`,
  giaoDich: `// Isolation 2: run each test inside a transaction and roll it back.
import { it, expect, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { createPgRepo } from '../src/booking/pgRepo.js';
import { openPool } from '../test/support/db.js';

let pool;
let client;
beforeAll(async () => {
  pool = openPool();
  await pool.query('TRUNCATE bookings RESTART IDENTITY'); // rows committed by other files are NOT undone by our rollbacks
});
beforeEach(async () => {
  client = await pool.connect();          // one connection for the whole test…
  await client.query('BEGIN');
});
afterEach(async () => {
  await client.query('ROLLBACK');         // …and nothing it wrote survives
  client.release();
});
afterAll(() => pool.end());
const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it.each(Array.from({ length: 20 }, (_, i) => i + 1))('booking %i of the same slot sees no earlier rows', async () => {
  await expect(bookLab(createPgRepo(client), input)).resolves.toMatchObject({ status: 'CONFIRMED' });
});`,
  th44: `import { it, expect, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import { bookLab } from '../src/booking/service.js';
import { createPgRepo } from '../src/booking/pgRepo.js';
import { openPool, makeBooking } from '../test/support/db.js';

let pool;
let client;
beforeAll(async () => { pool = openPool(); await pool.query('TRUNCATE bookings RESTART IDENTITY'); });
beforeEach(async () => { client = await pool.connect(); await client.query('BEGIN'); });
afterEach(async () => { await client.query('ROLLBACK'); client.release(); });
afterAll(() => pool.end());

it('a 31-seat student booking is stored as PENDING (checked with SQL)', async () => {
  const booking = await bookLab(createPgRepo(client), makeBooking({ seats: 31 }));
  const { rows } = await client.query('SELECT status, minutes FROM bookings WHERE id = $1', [booking.id]);
  expect(rows).toEqual([{ status: 'PENDING', minutes: 120 }]);
});

it('the next test starts with an empty table — the previous one was rolled back', async () => {
  const { rows } = await client.query('SELECT count(*)::int AS n FROM bookings');
  expect(rows[0].n).toBe(0);
});`,
  pgRepoTest: `import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { bookLab } from '../../src/booking/service.js';
import { createPgRepo } from '../../src/booking/pgRepo.js';
import { openPool, makeBooking } from '../support/db.js';

let pool;
let repo;
beforeAll(() => { pool = openPool(); repo = createPgRepo(pool); });
beforeEach(() => pool.query('TRUNCATE bookings RESTART IDENTITY'));
afterAll(() => pool.end());
const row = (b) => ({ ...b, status: 'CONFIRMED', minutes: 120 });

describe('findOverlap — the SQL', () => {
  it.each([
    ['09:00', '11:00', 'BE-201', '2026-11-16', true],   // overlaps 08:00–10:00
    ['07:00', '08:30', 'BE-201', '2026-11-16', true],   // overlaps the start
    ['10:00', '12:00', 'BE-201', '2026-11-16', false],  // starts when the other ends
    ['07:00', '08:00', 'BE-201', '2026-11-16', false],  // ends when the other starts
    ['08:00', '10:00', 'BE-305', '2026-11-16', false],  // another lab
    ['08:00', '10:00', 'BE-201', '2026-11-17', false],  // another day
  ])('%s–%s in %s on %s overlaps 08:00–10:00 BE-201: %s', async (start, end, lab, date, expected) => {
    await repo.insert(row({ lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, role: 'STUDENT' }));
    const found = await repo.findOverlap(lab, date, start, end);
    expect(found !== null).toBe(expected);
  });
});

describe('the database constraints', () => {
  it('accepts a back-to-back booking (the end minute is free)', async () => {
    const first = makeBooking({ lab: 'BE-201' });
    await repo.insert(row(first));
    await expect(repo.insert(row({ ...first, start: '10:00', end: '12:00' }))).resolves.toMatchObject({ id: 2 });
  });

  it('refuses an overlapping row even when findOverlap is skipped: OVERLAP caused by 23P01', async () => {
    const first = makeBooking({ lab: 'BE-201' });
    await repo.insert(row(first));
    await expect(repo.insert(row({ ...first, start: '09:00', end: '11:00' })))
      .rejects.toMatchObject({ code: 'OVERLAP', cause: { code: '23P01' } });
  });

  it('refuses 0 seats: 23514 check_violation', async () => {
    await expect(repo.insert(row(makeBooking({ seats: 0 })))).rejects.toMatchObject({ code: '23514' });
  });
});

describe('bookLab with PostgreSQL', () => {
  it('a clash found only by the database is still OVERLAP, not STORAGE_DOWN', async () => {
    const first = makeBooking({ lab: 'BE-201' });
    await bookLab(repo, first);
    const blindRepo = { ...repo, findOverlap: async () => null };   // pretend the check missed it
    await expect(bookLab(blindRepo, { ...first, start: '09:00', end: '11:00' })).rejects.toMatchObject({ code: 'OVERLAP' });
  });

  it('two students, one slot, same moment: one booking, one OVERLAP', async () => {
    const input = makeBooking({ lab: 'BE-201' });
    const results = await Promise.allSettled([bookLab(repo, input), bookLab(repo, input)]);
    expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);
    const { rows } = await pool.query('SELECT count(*)::int AS n FROM bookings');
    expect(rows[0].n).toBe(1);
  });
});`,
  weak4: `import { it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { bookLab } from '../../src/booking/service.js';
import { createPgRepo } from '../../src/booking/pgRepo.js';
import { openPool } from '../support/db.js';

let pool;
let repo;
beforeAll(() => { pool = openPool(); repo = createPgRepo(pool); });
beforeEach(() => pool.query('TRUNCATE bookings RESTART IDENTITY'));
afterAll(() => pool.end());
const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('stores a booking in PostgreSQL', async () => {
  await expect(bookLab(repo, input)).resolves.toMatchObject({ id: 1, status: 'CONFIRMED' });
});

it('finds an overlapping booking', async () => {
  await bookLab(repo, input);
  expect(await repo.findOverlap('BE-201', '2026-11-16', '09:00', '11:00')).not.toBeNull();
});

it('rejects the same booking twice', async () => {
  await bookLab(repo, input);
  await expect(bookLab(repo, input)).rejects.toMatchObject({ code: 'OVERLAP' });
});`,
  dotBien4: `// Lab 4 mutants (Chapter 4: integration with PostgreSQL). Each run starts a fresh database (Testcontainers),
// applies db/schema.sql — so a planted change in the schema counts too — and runs the integration tests.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['src/booking/pgRepo.js', 'start_time < $4', 'start_time <= $4', 'a booking ending at 10:00 blocks one starting at 10:00'],
  ['src/booking/pgRepo.js', '$3 < end_time', '$3 <= end_time', 'a booking starting at 10:00 blocks one ending at 10:00'],
  ['src/booking/pgRepo.js', 'lab = $1 AND', '$1::text IS NOT NULL AND', 'a booking in any lab blocks the slot'],
  ['src/booking/pgRepo.js', 'date = $2 AND', '$2::date IS NOT NULL AND', 'a booking on any day blocks the slot'],
  ['src/booking/pgRepo.js', "err.code === '23P01'", "err.code === '23505'", 'constraint violation not recognised'],
  ['db/schema.sql', "'[)'", "'[]'", 'constraint treats back-to-back bookings as overlapping'],
  ['db/schema.sql', 'NOT NULL CHECK (seats > 0)', 'NOT NULL', 'database accepts 0 seats'],
  ['src/booking/service.js', 'if (err instanceof BookingError) throw err;', '', 'OVERLAP from the database becomes STORAGE_DOWN'],
];

let killed = 0;
for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
  const original = readFileSync(file, 'utf8');
  if (!original.includes(from)) throw new Error('Mutant ' + (i + 1) + ': not found in ' + file);
  writeFileSync(file, original.replace(from, to));
  try {
    const run = spawnSync('npx', ['vitest', 'run', '--config', 'vitest.integration.config.js', 'test/integration'],
      { encoding: 'utf8', shell: process.platform === 'win32' });
    const dead = run.status !== 0;
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + (i + 1) + ' ' + label);
  } finally {
    writeFileSync(file, original);
  }
}
console.log();
console.log(killed + '/' + MUTANTS.length + ' mutants killed');
process.exitCode = killed === MUTANTS.length ? 0 : 1;`,
};
export const OUT = {
  '41-dua-khong': `$ TST_SCHEMA=demo4/schema-khong-rang-buoc.sql npm run test:int -- demo4/dua.int.test.js

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js demo4/dua.int.test.js


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1816 ms
 ❯ demo4/dua.int.test.js (1 test | 1 failed) 29ms
   × two students book the same slot at the same moment: only one wins (real PostgreSQL) 8ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo4/dua.int.test.js > two students book the same slot at the same moment: only one wins (real PostgreSQL)
AssertionError: expected [ 'fulfilled', 'fulfilled' ] to deeply equal [ 'fulfilled', 'rejected' ]

- Expected
+ Received

  [
    "fulfilled",
-   "rejected",
+   "fulfilled",
  ]

 ❯ demo4/dua.int.test.js:19:47
     17|   const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: …
     18|   const results = await Promise.allSettled([bookLab(repo, input), book…
     19|   expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'r…
       |                                               ^
     20|   expect(results.find((r) => r.status === 'rejected').reason.code).toB…
     21| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  02:33:25
   Duration  2.18s (tests 50%, import 34%, transform 11%, worker 5%)`,
  '41-dua': `$ npm run test:int -- demo4/dua.int.test.js demo4/sqlite-vs-pg.int.test.js

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js demo4/dua.int.test.js demo4/sqlite-vs-pg.int.test.js


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1207 ms
 ✓ demo4/dua.int.test.js (1 test) 25ms
   ✓ two students book the same slot at the same moment: only one wins (real PostgreSQL) 5ms
(node:9442) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use \`node --trace-warnings ...\` to show where the warning was created)
 ✓ demo4/sqlite-vs-pg.int.test.js (2 tests) 21ms
   ✓ SQLite stores the text "thirty" in an INTEGER column 2ms
   ✓ PostgreSQL refuses it: 22P02 invalid input syntax for type integer 19ms

 Test Files  2 passed (2)
      Tests  3 passed (3)
   Start at  02:33:28
   Duration  1.70s (tests 47%, import 39%, transform 8%, worker 5%)`,
  '41-th': `$ npm run test:int -- demo4/th41.int.test.js

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js demo4/th41.int.test.js


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1447 ms
 ✓ demo4/th41.int.test.js (2 tests) 31ms
   ✓ the Chapter 2 race, now without it.fails: one row in the table 26ms
   ✓ PostgreSQL refuses a time that does not exist: 25:00 3ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  02:15:06
   Duration  1.81s (tests 52%, import 34%, transform 11%, worker 4%)`,
  '42-do-ghi': `$ for i in 1 2 3; do node demo4/do-ghi.mjs postgres://postgres:test@localhost:54329/labflow_test; node demo4/do-ghi.mjs postgres://postgres:test@localhost:54339/labflow_test; done
2000 inserts on port 54329: 669 ms
2000 inserts on port 54339: 885 ms
2000 inserts on port 54329: 686 ms
2000 inserts on port 54339: 792 ms
2000 inserts on port 54329: 660 ms
2000 inserts on port 54339: 877 ms`,
  '42-down': `$ docker compose -f compose.test.yml down && docker compose -f demo4/compose.disk.yml down -v
 Container labflow-lite-db-test-1 Stopping 
 Container labflow-lite-db-test-1 Stopped 
 Container labflow-lite-db-test-1 Removing 
 Container labflow-lite-db-test-1 Removed 
 Network labflow-lite_default Removing 
 Network labflow-lite_default Removed 
 Container demo4-db-disk-1 Stopping 
 Container demo4-db-disk-1 Stopped 
 Container demo4-db-disk-1 Removing 
 Container demo4-db-disk-1 Removed 
 Network demo4_default Removing 
 Volume demo4_db-disk-data Removing 
 Volume demo4_db-disk-data Removed 
 Network demo4_default Removed `,
  '42-int-compose': `$ TEST_DATABASE_URL=postgres://postgres:test@localhost:54329/labflow_test npm run test:int -- test/integration

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js test/integration


 RUN  v5.0.5 …/labflow-lite

 ✓ test/integration/pgRepo.int.test.js (11 tests) 69ms
   ✓ findOverlap — the SQL (6)
     ✓ 09:00–11:00 in BE-201 on 2026-11-16 overlaps 08:00–10:00 BE-201: true 20ms
     ✓ 07:00–08:30 in BE-201 on 2026-11-16 overlaps 08:00–10:00 BE-201: true 3ms
     ✓ 10:00–12:00 in BE-201 on 2026-11-16 overlaps 08:00–10:00 BE-201: false 3ms
     ✓ 07:00–08:00 in BE-201 on 2026-11-16 overlaps 08:00–10:00 BE-201: false 2ms
     ✓ 08:00–10:00 in BE-305 on 2026-11-16 overlaps 08:00–10:00 BE-201: false 2ms
     ✓ 08:00–10:00 in BE-201 on 2026-11-17 overlaps 08:00–10:00 BE-201: false 2ms
   ✓ the database constraints (3)
     ✓ accepts a back-to-back booking (the end minute is free) 3ms
     ✓ refuses an overlapping row even when findOverlap is skipped: OVERLAP caused by 23P01 3ms
     ✓ refuses 0 seats: 23514 check_violation 9ms
   ✓ bookLab with PostgreSQL (2)
     ✓ a clash found only by the database is still OVERLAP, not STORAGE_DOWN 8ms
     ✓ two students, one slot, same moment: one booking, one OVERLAP 14ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  02:15:10
   Duration  407ms (tests 70%, import 21%, transform 6%, worker 2%)`,
  '42-up-disk': `$ docker compose -f demo4/compose.disk.yml up -d --wait
 Network demo4_default Creating 
 Network demo4_default Creating 
 Volume demo4_db-disk-data Creating 
 Volume demo4_db-disk-data Creating 
 Volume demo4_db-disk-data Created 
 Volume demo4_db-disk-data Created 
 Network demo4_default Created 
 Network demo4_default Created 
 Container demo4-db-disk-1 Creating 
 Container demo4-db-disk-1 Created 
 Container demo4-db-disk-1 Starting 
 Container demo4-db-disk-1 Started 
 Container demo4-db-disk-1 Waiting 
 Container demo4-db-disk-1 Healthy `,
  '42-up': `$ time docker compose -f compose.test.yml up -d --wait
 Network labflow-lite_default Creating 
 Network labflow-lite_default Creating 
 Network labflow-lite_default Created 
 Network labflow-lite_default Created 
 Container labflow-lite-db-test-1 Creating 
 Container labflow-lite-db-test-1 Created 
 Container labflow-lite-db-test-1 Starting 
 Container labflow-lite-db-test-1 Started 
 Container labflow-lite-db-test-1 Waiting 
 Container labflow-lite-db-test-1 Healthy 

real	0m2.103s
user	0m0.060s
sys	0m0.037s`,
  '43-tc': `$ npm run test:int -- test/integration

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js test/integration


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1434 ms
 ✓ test/integration/pgRepo.int.test.js (11 tests) 76ms
   ✓ findOverlap — the SQL (6)
     ✓ 09:00–11:00 in BE-201 on 2026-11-16 overlaps 08:00–10:00 BE-201: true 20ms
     ✓ 07:00–08:30 in BE-201 on 2026-11-16 overlaps 08:00–10:00 BE-201: true 3ms
     ✓ 10:00–12:00 in BE-201 on 2026-11-16 overlaps 08:00–10:00 BE-201: false 2ms
     ✓ 07:00–08:00 in BE-201 on 2026-11-16 overlaps 08:00–10:00 BE-201: false 3ms
     ✓ 08:00–10:00 in BE-305 on 2026-11-16 overlaps 08:00–10:00 BE-201: false 2ms
     ✓ 08:00–10:00 in BE-201 on 2026-11-17 overlaps 08:00–10:00 BE-201: false 2ms
   ✓ the database constraints (3)
     ✓ accepts a back-to-back booking (the end minute is free) 3ms
     ✓ refuses an overlapping row even when findOverlap is skipped: OVERLAP caused by 23P01 3ms
     ✓ refuses 0 seats: 23514 check_violation 9ms
   ✓ bookLab with PostgreSQL (2)
     ✓ a clash found only by the database is still OVERLAP, not STORAGE_DOWN 10ms
     ✓ two students, one slot, same moment: one booking, one OVERLAP 18ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  02:15:19
   Duration  1.85s (tests 71%, import 21%, transform 6%, worker 2%)`,
  '43-th': `$ npm run test:int -- demo4/th43.int.test.js

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js demo4/th43.int.test.js


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1194 ms
 ✓ demo4/th43.int.test.js (1 test) 24ms
   ✓ tests run on the same major version as production (PostgreSQL 17) with btree_gist 23ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  02:15:21
   Duration  1.56s (tests 55%, import 34%, worker 6%, transform 5%)`,
  '44-cheo-sua': `$ npm run test:int -- demo4/ro-ri.int.test.js demo4/giao-dich.int.test.js

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js demo4/ro-ri.int.test.js demo4/giao-dich.int.test.js


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1201 ms
 ❯ demo4/ro-ri.int.test.js (2 tests | 1 failed) 29ms
   ✓ A: a student books BE-201 at 08:00 23ms
   × B: a lecturer books BE-201 at 08:00 for 40 seats 4ms
 ✓ demo4/giao-dich.int.test.js (20 tests) 64ms
   ✓ booking 1 of the same slot sees no earlier rows 6ms
   ✓ booking 2 of the same slot sees no earlier rows 2ms
   ✓ booking 3 of the same slot sees no earlier rows 2ms
   ✓ booking 4 of the same slot sees no earlier rows 2ms
   ✓ booking 5 of the same slot sees no earlier rows 2ms
   ✓ booking 6 of the same slot sees no earlier rows 2ms
   ✓ booking 7 of the same slot sees no earlier rows 2ms
   ✓ booking 8 of the same slot sees no earlier rows 2ms
   ✓ booking 9 of the same slot sees no earlier rows 2ms
   ✓ booking 10 of the same slot sees no earlier rows 2ms
   ✓ booking 11 of the same slot sees no earlier rows 2ms
   ✓ booking 12 of the same slot sees no earlier rows 2ms
   ✓ booking 13 of the same slot sees no earlier rows 2ms
   ✓ booking 14 of the same slot sees no earlier rows 2ms
   ✓ booking 15 of the same slot sees no earlier rows 2ms
   ✓ booking 16 of the same slot sees no earlier rows 2ms
   ✓ booking 17 of the same slot sees no earlier rows 2ms
   ✓ booking 18 of the same slot sees no earlier rows 2ms
   ✓ booking 19 of the same slot sees no earlier rows 2ms
   ✓ booking 20 of the same slot sees no earlier rows 2ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo4/ro-ri.int.test.js > B: a lecturer books BE-201 at 08:00 for 40 seats
AssertionError: promise rejected "BookingError: OVERLAP { code: 'OVERL…' }" instead of resolving
 ❯ demo4/ro-ri.int.test.js:17:87
     15|
     16| it('B: a lecturer books BE-201 at 08:00 for 40 seats', async () => {
     17|   await expect(bookLab(createPgRepo(pool), { ...input, role: 'LECTURER…
       |                                                                                       ^
     18| });
     19|

Caused by: BookingError: OVERLAP
 ❯ bookLab src/booking/service.js:39:20
 ❯ demo4/ro-ri.int.test.js:17:3

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'OVERLAP' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 21 passed (22)
   Start at  02:33:33
   Duration  1.78s (tests 62%, import 29%, transform 6%, worker 3%)`,
  '44-cheo': `$ npm run test:int -- demo4/ro-ri.int.test.js demo4/giao-dich.int.test.js

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js demo4/ro-ri.int.test.js demo4/giao-dich.int.test.js


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1675 ms
 ❯ demo4/ro-ri.int.test.js (2 tests | 1 failed) 31ms
   ✓ A: a student books BE-201 at 08:00 25ms
   × B: a lecturer books BE-201 at 08:00 for 40 seats 5ms
 ❯ demo4/giao-dich.int.test.js (20 tests | 20 failed) 74ms
   × booking 1 of the same slot sees no earlier rows 31ms
   × booking 2 of the same slot sees no earlier rows 3ms
   × booking 3 of the same slot sees no earlier rows 4ms
   × booking 4 of the same slot sees no earlier rows 3ms
   × booking 5 of the same slot sees no earlier rows 2ms
   × booking 6 of the same slot sees no earlier rows 2ms
   × booking 7 of the same slot sees no earlier rows 2ms
   × booking 8 of the same slot sees no earlier rows 2ms
   × booking 9 of the same slot sees no earlier rows 4ms
   × booking 10 of the same slot sees no earlier rows 2ms
   × booking 11 of the same slot sees no earlier rows 2ms
   × booking 12 of the same slot sees no earlier rows 2ms
   × booking 13 of the same slot sees no earlier rows 2ms
   × booking 14 of the same slot sees no earlier rows 1ms
   × booking 15 of the same slot sees no earlier rows 2ms
   × booking 16 of the same slot sees no earlier rows 1ms
   × booking 17 of the same slot sees no earlier rows 2ms
   × booking 18 of the same slot sees no earlier rows 1ms
   × booking 19 of the same slot sees no earlier rows 1ms
   × booking 20 of the same slot sees no earlier rows 1ms

⎯⎯⎯⎯⎯⎯ Failed Tests 21 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo4/giao-dich.int.test.js > booking 1 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 2 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 3 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 4 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 5 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 6 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 7 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 8 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 9 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 10 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 11 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 12 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 13 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 14 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 15 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 16 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 17 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 18 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 19 of the same slot sees no earlier rows
 FAIL  demo4/giao-dich.int.test.js > booking 20 of the same slot sees no earlier rows
AssertionError: promise rejected "BookingError: OVERLAP { code: 'OVERL…' }" instead of resolving
 ❯ demo4/giao-dich.int.test.js:22:53
     20|
     21| it.each(Array.from({ length: 20 }, (_, i) => i + 1))('booking %i of th…
     22|   await expect(bookLab(createPgRepo(client), input)).resolves.toMatchO…
       |                                                     ^
     23| });
     24|

Caused by: BookingError: OVERLAP
 ❯ bookLab src/booking/service.js:39:20
 ❯ demo4/giao-dich.int.test.js:22:3

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'OVERLAP' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/21]⎯

 FAIL  demo4/ro-ri.int.test.js > B: a lecturer books BE-201 at 08:00 for 40 seats
AssertionError: promise rejected "BookingError: OVERLAP { code: 'OVERL…' }" instead of resolving
 ❯ demo4/ro-ri.int.test.js:17:87
     15|
     16| it('B: a lecturer books BE-201 at 08:00 for 40 seats', async () => {
     17|   await expect(bookLab(createPgRepo(pool), { ...input, role: 'LECTURER…
       |                                                                                       ^
     18| });
     19|

Caused by: BookingError: OVERLAP
 ❯ bookLab src/booking/service.js:39:20
 ❯ demo4/ro-ri.int.test.js:17:3

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'OVERLAP' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/21]⎯


 Test Files  2 failed (2)
      Tests  21 failed | 1 passed (22)
   Start at  02:31:54
   Duration  2.49s (tests 66%, import 25%, transform 6%, worker 3%)`,
  '44-co-lap': `$ npm run test:int -- demo4/truncate.int.test.js demo4/giao-dich.int.test.js

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js demo4/truncate.int.test.js demo4/giao-dich.int.test.js


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1193 ms
 ✓ demo4/truncate.int.test.js (20 tests) 77ms
   ✓ booking 1 of the same slot starts from an empty table 26ms
   ✓ booking 2 of the same slot starts from an empty table 4ms
   ✓ booking 3 of the same slot starts from an empty table 4ms
   ✓ booking 4 of the same slot starts from an empty table 3ms
   ✓ booking 5 of the same slot starts from an empty table 3ms
   ✓ booking 6 of the same slot starts from an empty table 3ms
   ✓ booking 7 of the same slot starts from an empty table 2ms
   ✓ booking 8 of the same slot starts from an empty table 3ms
   ✓ booking 9 of the same slot starts from an empty table 3ms
   ✓ booking 10 of the same slot starts from an empty table 3ms
   ✓ booking 11 of the same slot starts from an empty table 3ms
   ✓ booking 12 of the same slot starts from an empty table 2ms
   ✓ booking 13 of the same slot starts from an empty table 2ms
   ✓ booking 14 of the same slot starts from an empty table 2ms
   ✓ booking 15 of the same slot starts from an empty table 2ms
   ✓ booking 16 of the same slot starts from an empty table 2ms
   ✓ booking 17 of the same slot starts from an empty table 2ms
   ✓ booking 18 of the same slot starts from an empty table 2ms
   ✓ booking 19 of the same slot starts from an empty table 2ms
   ✓ booking 20 of the same slot starts from an empty table 2ms
 ✓ demo4/giao-dich.int.test.js (20 tests) 56ms
   ✓ booking 1 of the same slot sees no earlier rows 5ms
   ✓ booking 2 of the same slot sees no earlier rows 2ms
   ✓ booking 3 of the same slot sees no earlier rows 2ms
   ✓ booking 4 of the same slot sees no earlier rows 2ms
   ✓ booking 5 of the same slot sees no earlier rows 2ms
   ✓ booking 6 of the same slot sees no earlier rows 1ms
   ✓ booking 7 of the same slot sees no earlier rows 2ms
   ✓ booking 8 of the same slot sees no earlier rows 2ms
   ✓ booking 9 of the same slot sees no earlier rows 2ms
   ✓ booking 10 of the same slot sees no earlier rows 2ms
   ✓ booking 11 of the same slot sees no earlier rows 2ms
   ✓ booking 12 of the same slot sees no earlier rows 2ms
   ✓ booking 13 of the same slot sees no earlier rows 2ms
   ✓ booking 14 of the same slot sees no earlier rows 1ms
   ✓ booking 15 of the same slot sees no earlier rows 2ms
   ✓ booking 16 of the same slot sees no earlier rows 2ms
   ✓ booking 17 of the same slot sees no earlier rows 1ms
   ✓ booking 18 of the same slot sees no earlier rows 1ms
   ✓ booking 19 of the same slot sees no earlier rows 1ms
   ✓ booking 20 of the same slot sees no earlier rows 1ms

 Test Files  2 passed (2)
      Tests  40 passed (40)
   Start at  02:33:30
   Duration  1.76s (tests 71%, import 22%, transform 4%, worker 2%)`,
  '44-ro-ri-B': `$ npm run test:int -- demo4/ro-ri.int.test.js -t lecturer

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js demo4/ro-ri.int.test.js -t lecturer


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1813 ms
 ✓ demo4/ro-ri.int.test.js (2 tests | 1 skipped) 25ms
   ↓ A: a student books BE-201 at 08:00
   ✓ B: a lecturer books BE-201 at 08:00 for 40 seats 24ms

 Test Files  1 passed (1)
      Tests  1 passed | 1 skipped (2)
   Start at  02:19:47
   Duration  2.17s (tests 47%, import 35%, transform 13%, worker 5%)`,
  '44-ro-ri': `$ npm run test:int -- demo4/ro-ri.int.test.js

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js demo4/ro-ri.int.test.js


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1164 ms
 ❯ demo4/ro-ri.int.test.js (2 tests | 1 failed) 25ms
   ✓ A: a student books BE-201 at 08:00 19ms
   × B: a lecturer books BE-201 at 08:00 for 40 seats 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo4/ro-ri.int.test.js > B: a lecturer books BE-201 at 08:00 for 40 seats
AssertionError: promise rejected "BookingError: OVERLAP { code: 'OVERL…' }" instead of resolving
 ❯ demo4/ro-ri.int.test.js:17:87
     15|
     16| it('B: a lecturer books BE-201 at 08:00 for 40 seats', async () => {
     17|   await expect(bookLab(createPgRepo(pool), { ...input, role: 'LECTURER…
       |                                                                                       ^
     18| });
     19|

Caused by: BookingError: OVERLAP
 ❯ bookLab src/booking/service.js:39:20
 ❯ demo4/ro-ri.int.test.js:17:3

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'OVERLAP' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  02:15:24
   Duration  1.53s (tests 48%, import 36%, transform 11%, worker 5%)`,
  '44-th': `$ npm run test:int -- demo4/th44.int.test.js

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js demo4/th44.int.test.js


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1387 ms
 ✓ demo4/th44.int.test.js (2 tests) 24ms
   ✓ a 31-seat student booking is stored as PENDING (checked with SQL) 5ms
   ✓ the next test starts with an empty table — the previous one was rolled back 2ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  02:15:28
   Duration  1.74s (tests 46%, import 38%, transform 11%, worker 5%)`,
  'lab4-mut-strong': `$ node scripts/dot-bien-4.mjs
✔ killed    #1 a booking ending at 10:00 blocks one starting at 10:00
✔ killed    #2 a booking starting at 10:00 blocks one ending at 10:00
✔ killed    #3 a booking in any lab blocks the slot
✔ killed    #4 a booking on any day blocks the slot
✔ killed    #5 constraint violation not recognised
✔ killed    #6 constraint treats back-to-back bookings as overlapping
✔ killed    #7 database accepts 0 seats
✔ killed    #8 OVERLAP from the database becomes STORAGE_DOWN

8/8 mutants killed`,
  'lab4-mut-weak': `$ node scripts/dot-bien-4.mjs
✘ SURVIVED  #1 a booking ending at 10:00 blocks one starting at 10:00
✘ SURVIVED  #2 a booking starting at 10:00 blocks one ending at 10:00
✘ SURVIVED  #3 a booking in any lab blocks the slot
✘ SURVIVED  #4 a booking on any day blocks the slot
✘ SURVIVED  #5 constraint violation not recognised
✘ SURVIVED  #6 constraint treats back-to-back bookings as overlapping
✘ SURVIVED  #7 database accepts 0 seats
✘ SURVIVED  #8 OVERLAP from the database becomes STORAGE_DOWN

0/8 mutants killed`,
  'lab4-ref': `$ npm run test:int -- test/integration

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js test/integration


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1179 ms
 ✓ test/integration/pgRepo.int.test.js (11 tests) 79ms
   ✓ findOverlap — the SQL (6)
     ✓ 09:00–11:00 in BE-201 on 2026-11-16 overlaps 08:00–10:00 BE-201: true 22ms
     ✓ 07:00–08:30 in BE-201 on 2026-11-16 overlaps 08:00–10:00 BE-201: true 4ms
     ✓ 10:00–12:00 in BE-201 on 2026-11-16 overlaps 08:00–10:00 BE-201: false 3ms
     ✓ 07:00–08:00 in BE-201 on 2026-11-16 overlaps 08:00–10:00 BE-201: false 3ms
     ✓ 08:00–10:00 in BE-305 on 2026-11-16 overlaps 08:00–10:00 BE-201: false 2ms
     ✓ 08:00–10:00 in BE-201 on 2026-11-17 overlaps 08:00–10:00 BE-201: false 3ms
   ✓ the database constraints (3)
     ✓ accepts a back-to-back booking (the end minute is free) 3ms
     ✓ refuses an overlapping row even when findOverlap is skipped: OVERLAP caused by 23P01 5ms
     ✓ refuses 0 seats: 23514 check_violation 9ms
   ✓ bookLab with PostgreSQL (2)
     ✓ a clash found only by the database is still OVERLAP, not STORAGE_DOWN 10ms
     ✓ two students, one slot, same moment: one booking, one OVERLAP 13ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  02:15:52
   Duration  1.61s (tests 72%, import 19%, transform 6%, worker 2%)`,
  'lab4-unit': `$ npx vitest run src/

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/booking.test.js (28 tests) 5ms
   ✓ checkSlot (11)
     ✓ accepts (4)
       ✓ 07:00–08:00 (60 min) 1ms
       ✓ 20:00–21:00 (60 min) 0ms
       ✓ 08:00–08:30 (30 min) 0ms
       ✓ 08:00–12:00 (240 min) 0ms
     ✓ rejects (7)
       ✓ 06:30–08:00 with OUTSIDE_HOURS 0ms
       ✓ 20:00–21:30 with OUTSIDE_HOURS 0ms
       ✓ 08:15–09:00 with OFF_GRID 0ms
       ✓ 08:00–09:10 with OFF_GRID 0ms
       ✓ 10:00–09:00 with END_BEFORE_START 0ms
       ✓ 09:00–09:00 with END_BEFORE_START 0ms
       ✓ 08:00–12:30 with TOO_LONG 0ms
   ✓ isWithinBookingWindow (BR-05) (8)
     ✓ -1 days → false 0ms
     ✓ 0 days → true 0ms
     ✓ 14 days → true 0ms
     ✓ 15 days → false 0ms
     ✓ rejects 1.5 0ms
     ✓ rejects NaN 0ms
     ✓ rejects 3 0ms
     ✓ rejects null 0ms
   ✓ needsApproval (BR-06 decision table) (7)
     ✓ STUDENT, 30 seats → false 0ms
     ✓ STUDENT, 31 seats → true 0ms
     ✓ LECTURER, 31 seats → false 0ms
     ✓ ADMIN, 31 seats → false 0ms
     ✓ throws RangeError for 0 seats 0ms
     ✓ throws RangeError for -5 seats 0ms
     ✓ throws RangeError for 2.5 seats 0ms
   ✓ createBooking (2)
     ✓ builds a PENDING booking for 31 seats 0ms
     ✓ throws the rule code for a bad slot 0ms
 ✓ src/rules/time.test.js (12 tests) 7ms
   ✓ parseTime (10)
     ✓ 00:00 → 0 1ms
     ✓ 07:00 → 420 0ms
     ✓ 21:30 → 1290 0ms
     ✓ 23:59 → 1439 0ms
     ✓ throws TypeError for "7:00" 0ms
     ✓ throws TypeError for "07-00" 0ms
     ✓ throws TypeError for "" 0ms
     ✓ throws TypeError for "abc" 0ms
     ✓ throws RangeError for 24:00 0ms
     ✓ throws RangeError for 07:60 0ms
   ✓ formatTime (2)
     ✓ pads to HH:MM 0ms
     ✓ round-trips with parseTime for every minute of the day 4ms
 ✓ src/rules/days.test.js (4 tests) 5ms
   ✓ daysAheadVN (BR-05 counted in Viet Nam time) (4)
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead 2ms
     ✓ now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead 0ms
     ✓ now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead 0ms
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead 0ms
 ✓ src/auth/login-guard.test.js (5 tests) 3ms
   ✓ createLoginGuard (BR-02: 5 failures → locked 15 minutes) (5)
     ✓ 4 failures do not lock 1ms
     ✓ the 5th failure locks 0ms
     ✓ still locked at 14:59.999, unlocked at exactly 15:00 0ms
     ✓ a successful login resets the counter 0ms
     ✓ locks only the account that failed 0ms
 ✓ src/lib/retry.test.js (3 tests) 8ms
   ✓ retry (3)
     ✓ returns at once when the first attempt works 3ms
     ✓ waits 1 s then 2 s between attempts 2ms
     ✓ gives up after 3 attempts and rethrows the last error 2ms
 ✓ src/rules/cancel.test.js (4 tests) 3ms
   ✓ canCancel (Lite-3: until 60 minutes before the start) (4)
     ✓ at 07:00, a 09:00 booking can be cancelled → true 1ms
     ✓ at 08:00, a 09:00 booking can be cancelled → true 0ms
     ✓ at 08:01, a 09:00 booking can be cancelled → false 0ms
     ✓ at 09:30, a 09:00 booking can be cancelled → false 0ms
 ✓ src/booking/service.test.js (6 tests) 60ms
   ✓ bookLab (6)
     ✓ stores a confirmed booking 13ms
     ✓ rejects a rule violation with its code before touching the database 0ms
     ✓ rejects an overlapping booking with OVERLAP 21ms
     ✓ accepts the slot that starts when the previous one ends 24ms
     ✓ turns a failing lookup into STORAGE_DOWN and keeps the cause 0ms
     ✓ turns a failing insert into STORAGE_DOWN 0ms
 ✓ src/notify/notify.test.js (7 tests) 56ms
   ✓ buildMail (pure) (2)
     ✓ CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn 1ms
     ✓ PENDING booking with 31 seats → mail to approvals@labflow.example 0ms
   ✓ bookAndNotify (5)
     ✓ a confirmed booking e-mails the student once 13ms
     ✓ a 31-seat student booking e-mails only the approver 12ms
     ✓ a failed e-mail keeps the booking and reports notified: false 14ms
     ✓ a failed e-mail is logged with the booking id and the reason 13ms
     ✓ a rejected booking sends no e-mail 1ms
 ✓ src/lib/mailer.test.js (4 tests) 46ms
   ✓ createHttpMailer (4)
     ✓ posts { to, subject } with a Bearer key and returns the id 29ms
     ✓ 429 → RATE_LIMITED 4ms
     ✓ 400 → MAIL_FAILED with the status as the cause 5ms
     ✓ 503 → MAIL_FAILED with the status as the cause 3ms

 Test Files  9 passed (9)
      Tests  73 passed (73)
   Start at  02:16:27
   Duration  236ms (tests 37%, import 33%, transform 25%, worker 5%)`,
  'lab4-weak-run': `$ npm run test:int -- test/integration

> labflow-lite@1.0.0 test:int
> vitest run --config vitest.integration.config.js test/integration


 RUN  v5.0.5 …/labflow-lite

[setup] PostgreSQL container ready in 1183 ms
 ✓ test/integration/weak4.int.test.js (3 tests) 34ms
   ✓ stores a booking in PostgreSQL 24ms
   ✓ finds an overlapping booking 4ms
   ✓ rejects the same booking twice 4ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  02:15:30
   Duration  1.56s (tests 56%, import 31%, transform 9%, worker 4%)`,
};
