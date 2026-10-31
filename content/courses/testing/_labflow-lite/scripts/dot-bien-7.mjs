// Lab 7 mutants (Chapter 7: end-to-end). Plant one bug at a time in the web app or the server, run the browser tests, restore.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['web/app/App.jsx', "session.user.role === 'ADMIN'", "session.user.role === 'LECTURER'", 'admins get the booking form, not the list'],
  ['web/app/App.jsx', 'localStorage.removeItem(KEY);', '', 'Sign out does not end the session'],
  ['web/app/App.jsx', 'try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }', 'return null;', 'a reload signs the user out'],
  ['e2e/server.js', 'password !== PASSWORD', 'password === undefined', 'any password is accepted'],
  ['web/app/App.jsx', 'createClient({ token: session.token })', 'createClient({ token: session.user.id })', 'requests carry the wrong token'],
  ['web/app/LoginForm.jsx', '{error && <p role="alert">{error}</p>}', '{error && <p>{error}</p>}', 'a failed sign-in is not announced'],
  ['web/app/LoginForm.jsx', "password: form.get('password')", "password: form.get('username')", 'the username is sent as the password'],
  ['e2e/server.js', "boss: 'ADMIN'", "boss: 'LECTURER'", 'the admin account lost its role'],
];

let killed = 0;
for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
  const original = readFileSync(file, 'utf8');
  if (original.split(from).length !== 2) throw new Error('Mutant ' + (i + 1) + ': must appear exactly once in ' + file);
  writeFileSync(file, original.replace(from, to));
  try {
    const run = spawnSync('npx', ['playwright', 'test', 'e2e/', '--project=chromium'], { encoding: 'utf8', shell: process.platform === 'win32' });
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
