// Lab 2 mutants (Chapter 2: async, time, errors). Plant one bug at a time, run your tests, then restore the code.
// A good suite goes RED for every mutant ("killed"); a mutant that stays green ("survived") is a gap.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['src/rules/cancel.js', 'minutesLeft >= CANCEL_LIMIT_MINUTES', 'minutesLeft > CANCEL_LIMIT_MINUTES', 'Lite-3: cancel exactly 60 min before refused'],
  ['src/auth/login-guard.js', 's.failures >= MAX_FAILURES', 's.failures > MAX_FAILURES', 'BR-02: locks after 6 failures, not 5'],
  ['src/auth/login-guard.js', 's.lockedUntil > now()', 's.lockedUntil >= now()', 'BR-02: still locked at exactly 15:00'],
  ['src/auth/login-guard.js', 'state.delete(email);', 'void email;', 'success does not reset the counter'],
  ['src/lib/retry.js', 'delayMs * i', 'delayMs', 'retry waits 1 s every time (no back-off)'],
  ['src/lib/retry.js', 'i <= attempts', 'i < attempts', 'retry makes one attempt too few'],
  ['src/booking/service.js', "throw new BookingError('STORAGE_DOWN', { cause: err });", 'throw err;', 'lookup failure leaks the raw error'],
  ['src/rules/days.js', 'now.getTime() + VN_OFFSET_MS', 'now.getTime()', 'days counted in UTC, not Viet Nam time'],
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
