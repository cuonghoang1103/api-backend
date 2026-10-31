// Lab 3 mutants (Chapter 3: test doubles). Plant one bug at a time, run your tests, then restore the code.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['src/notify/notify.js', 'return { to: studentEmail,', 'return { to: APPROVER,', 'confirmation goes to the approver'],
  ['src/notify/notify.js', "booking.lab + ' on ' + booking.date + ' at '", "booking.lab + ' at '", 'e-mail subject without the date'],
  ['src/notify/notify.js', "booking.seats + ' seats, ' + ", '', 'approver mail without the seat count'],
  ['src/notify/notify.js', 'return { ...booking, notified: false };', 'throw err;', 'a failed e-mail fails the booking request'],
  ['src/notify/notify.js', "log.warn('mail failed", "void ('mail failed", 'a failed e-mail is not logged'],
  ['src/lib/mailer.js', 'res.status === 429', 'res.status === 503', 'rate limit not recognised'],
  ['src/lib/mailer.js', "'Bearer ' + apiKey", 'apiKey', 'API key sent without "Bearer "'],
  ['src/lib/mailer.js', 'if (!res.ok)', 'if (res.status >= 500)', '4xx answers treated as success'],
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
