// chay: tay — Lesson 7.4: why passwords are hashed, salted and SLOW. Run from the repo root (needs bcryptjs):
// node content/courses/web-foundations/_demo/_t7/mat-khau.mjs > content/courses/web-foundations/_demo/_t7/out/mat-khau.out.txt
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

// 1. a fast hash, no salt: the same password always gives the same hash
console.log('--- 1. sha256, no salt ---');
const leaked = [
  { email: 'an@example.com', hash: sha256('123456') },
  { email: 'binh@example.com', hash: sha256('123456') },
  { email: 'lan@example.com', hash: sha256('sunflower2009') },
];
for (const u of leaked) console.log(u.email.padEnd(18), u.hash.slice(0, 24) + '…');

// an attacker hashes a list of common passwords ONCE, then looks every leaked hash up
const common = ['123456', 'password', '123456789', 'qwerty', 'abc123', 'iloveyou', '111111', 'sunflower2009'];
const table = new Map(common.map((p) => [sha256(p), p]));
for (const u of leaked) console.log('cracked:', u.email.padEnd(18), '→', table.get(u.hash) ?? '(not in the list)');

// 2. a random salt per user: same password, different hashes; the table is useless
console.log('\n--- 2. sha256 with a salt per user ---');
for (const email of ['an@example.com', 'binh@example.com']) {
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = sha256(salt + '123456');
  console.log(email.padEnd(18), 'salt', salt, 'hash', hash.slice(0, 24) + '…', '| in table?', table.has(hash));
}

// 3. speed: fast hashes help the attacker
console.log('\n--- 3. how many guesses per second? (this laptop, one CPU core) ---');
let n = 0;
const t0 = performance.now();
while (performance.now() - t0 < 1000) { sha256('guess' + n); n++; }
console.log('sha256          :', n.toLocaleString('en-US'), 'hashes in 1 second');
for (const cost of [10, 12]) {
  const t = performance.now();
  bcrypt.hashSync('correct horse battery', cost);
  const ms = performance.now() - t;
  console.log(`bcrypt cost ${cost}  :`, Math.round(ms), 'ms per hash →', (1000 / ms).toFixed(1), 'hashes per second');
}
const ts = performance.now();
crypto.scryptSync('correct horse battery', 'salt1234salt1234', 64);
console.log('scrypt (Node)   :', Math.round(performance.now() - ts), 'ms per hash');

// 4. what a bcrypt hash looks like, and how checking works
console.log('\n--- 4. bcrypt: salt and cost are stored inside the hash ---');
const h1 = bcrypt.hashSync('correct horse battery', 10);
const h2 = bcrypt.hashSync('correct horse battery', 10);
console.log('hash #1:', h1);
console.log('hash #2:', h2, '(same password, new salt)');
console.log('parts  : $2a$ = algorithm, 10$ = cost (2^10 rounds), next 22 chars = salt, last 31 = hash');
console.log('compare("correct horse battery", hash #1):', bcrypt.compareSync('correct horse battery', h1));
console.log('compare("Correct horse battery", hash #1):', bcrypt.compareSync('Correct horse battery', h1));
