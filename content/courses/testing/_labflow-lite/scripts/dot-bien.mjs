// Plant one bug (a "mutant") at a time, run your tests, then restore the code.
// A good suite goes RED for every mutant ("killed"); a mutant that stays green ("survived") is a gap.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['src/rules/booking.js', 'daysAhead <= MAX_DAYS_AHEAD', 'daysAhead < MAX_DAYS_AHEAD', 'BR-05: 14 days ahead rejected'],
  ['src/rules/booking.js', 'return seats > APPROVAL_SEATS;', 'return seats >= APPROVAL_SEATS;', 'BR-06: 30 seats needs approval'],
  ['src/rules/booking.js', 'e > CLOSE', 'e >= CLOSE', 'slot ending at 21:00 rejected'],
  ['src/rules/booking.js', 'e - s > MAX_MINUTES', 'e - s >= MAX_MINUTES', 'exactly 4 hours rejected'],
  ['src/rules/booking.js', 'if (e <= s)', 'if (e < s)', 'zero-length slot accepted'],
  ["src/rules/booking.js", "role === 'LECTURER' || role === 'ADMIN'", "role === 'LECTURER'", 'ADMIN needs approval'],
  ['src/rules/time.js', 'h > 23', 'h > 24', '"24:00" accepted'],
  ['src/rules/time.js', 'Math.floor(minutes / 60)', 'Math.round(minutes / 60)', 'formatTime rounds the hour'],
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
