// Lab 6 mutants (Chapter 6: React components). Plant one bug at a time, run the web tests, then restore the code.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['web/BookingForm.jsx', "role={result.ok ? 'status' : 'alert'}", 'role="status"', 'errors are not announced as alerts'],
  ['web/BookingForm.jsx', '<label htmlFor={id}>', '<label htmlFor={name}>', 'labels no longer point at their inputs'],
  ['web/BookingForm.jsx', 'disabled={busy}', 'disabled={false}', 'a double click books twice'],
  ['web/BookingForm.jsx', 'input.seats > 200', 'input.seats > 201', '201 seats allowed in the browser'],
  ['web/BookingForm.jsx', 'setErrors(Object.fromEntries(res.data.error.details.map((d) => [d.path, d.message])));', 'setErrors({});', 'server field errors are dropped'],
  ['web/BookingForm.jsx', "res.data.status === 'PENDING' ?", "res.data.status !== 'PENDING' ?", 'pending and confirmed messages swapped'],
  ['web/AdminBookings.jsx', 'if (res.status === 403)', 'if (res.status === 401)', '403 shown as a generic failure'],
  ['web/AdminBookings.jsx', 'onClick={load}', 'onClick={undefined}', 'Try again does nothing'],
];

let killed = 0;
for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
  const original = readFileSync(file, 'utf8');
  if (!original.includes(from)) throw new Error('Mutant ' + (i + 1) + ': not found in ' + file);
  writeFileSync(file, original.replace(from, to));
  try {
    const run = spawnSync('npx', ['vitest', 'run', '--config', 'vitest.web.config.js', 'web/'], { encoding: 'utf8', shell: process.platform === 'win32' });
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
