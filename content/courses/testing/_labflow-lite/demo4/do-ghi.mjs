// Measure: 2000 bookings inserted one by one (each its own transaction, like a test suite does).
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
await client.end();
