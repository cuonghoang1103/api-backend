// demo2/pepper.mjs — lesson 2.3: a pepper is a secret key, kept OUT of the database, mixed in before the slow hash.
// It helps exactly when the attacker has the table but not the key — and it locks everyone out if you lose the key.
import { createHmac } from 'node:crypto';
import argon2 from 'argon2';
import { PARAMS } from '../src/passwords/index.js';
import { WORDS } from './population.mjs';

const PEPPER = Buffer.from(process.env.PASSWORD_PEPPER ?? '', 'base64url');     // 32 bytes, from the environment
const peppered = (pw) => createHmac('sha256', PEPPER).update(pw.normalize('NFC')).digest('base64');
const binhRow = await argon2.hash(peppered('123456'), PARAMS);                  // what the users table holds

async function attack(label, prepare) {
  const t0 = performance.now();
  for (const w of WORDS.slice(0, 20)) if (await argon2.verify(binhRow, prepare(w))) {
    return console.log(`${label}: cracked "${w}" in ${(performance.now() - t0).toFixed(0)} ms`);
  }
  console.log(`${label}: 0 of the top 20 match — without the key every guess is wrong`);
}
await attack('table only (SQL injection, stolen backup)', (w) => w);
await attack('table + PASSWORD_PEPPER (whole server taken)', peppered);
const lost = Buffer.alloc(32, 7);                                              // the key after a bad redeploy
console.log('Binh signs in after the key is lost:', await argon2.verify(binhRow, createHmac('sha256', lost).update('123456').digest('base64')));
