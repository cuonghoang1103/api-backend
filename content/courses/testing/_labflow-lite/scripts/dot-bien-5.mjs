// Lab 5 mutants (Chapter 5: HTTP API). Plant one bug at a time, run your tests, then restore the code.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['src/api/server.js', "booking.userId === req.user.id || req.user.role === 'ADMIN'", "booking.userId === req.user.id || req.user.role !== 'STUDENT'", "lecturers can read anyone's booking"],
  ['src/api/server.js', "if (!mine) return fail(res, 404, 'NOT_FOUND');", "if (!booking) return fail(res, 404, 'NOT_FOUND');", "anyone can read anyone's booking (IDOR)"],
  ['src/api/server.js', "next() : fail(res, 403, 'FORBIDDEN')", "next() : fail(res, 401, 'FORBIDDEN')", 'forbidden answered as 401'],
  ['src/api/schemas.js', 'z.strictObject({', 'z.object({', 'unknown fields (role) silently accepted'],
  ['src/api/server.js', 'res.status(201).location(', 'res.status(200).location(', 'created answered as 200'],
  ['src/api/server.js', ".location('/api/bookings/' + booking.id)", '', 'no Location header'],
  ['src/api/server.js', "return fail(res, 409, 'OVERLAP');", "return fail(res, 400, 'OVERLAP');", 'taken slot answered as 400'],
  ['src/api/auth.js', "{ algorithms: ['HS256'], currentDate: now() }", "{ algorithms: ['HS256'] }", 'expiry checked against the real clock, not the given one'],
];

let killed = 0;
for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
  const original = readFileSync(file, 'utf8');
  if (!original.includes(from)) throw new Error('Mutant ' + (i + 1) + ': not found in ' + file);
  writeFileSync(file, original.replace(from, to));
  try {
    const run = spawnSync('npx', ['vitest', 'run', 'src/'], { encoding: 'utf8', shell: process.platform === 'win32' });
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
