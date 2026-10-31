// Lab 4 mutants (Chapter 4: integration with PostgreSQL). Each run starts a fresh database (Testcontainers),
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
process.exitCode = killed === MUTANTS.length ? 0 : 1;
