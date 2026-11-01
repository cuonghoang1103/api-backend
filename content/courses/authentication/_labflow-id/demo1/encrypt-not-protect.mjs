// demo1/encrypt-not-protect.mjs — lesson 1.4: encryption hides a value; without a tag it does NOT stop changes.
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const key = randomBytes(32);
const plain = Buffer.from('{"uid":"usr_1","admin":false}');

// AES-256-CTR: encrypted, unreadable … and editable. The attacker never learns the key.
const iv = randomBytes(16);
const c = createCipheriv('aes-256-ctr', key, iv);
const ct = Buffer.concat([c.update(plain), c.final()]);
console.log('ciphertext (CTR) :', ct.toString('base64url'));
// She guesses the plaintext layout (it is the app's own format) and XORs "false" into "true ".
const at = plain.indexOf('false');
const evil = Buffer.from(ct);
for (let i = 0; i < 5; i++) evil[at + i] ^= 'false'.charCodeAt(i) ^ 'true '.charCodeAt(i);
const d = createDecipheriv('aes-256-ctr', key, iv);
const out = Buffer.concat([d.update(evil), d.final()]).toString();
console.log('server decrypts  :', out, '→ admin =', JSON.parse(out).admin);

// AES-256-GCM: same edit, but GCM carries an authentication tag — decryption refuses.
const iv2 = randomBytes(12);
const g = createCipheriv('aes-256-gcm', key, iv2);
const ct2 = Buffer.concat([g.update(plain), g.final()]);
const tag = g.getAuthTag();
for (let i = 0; i < 5; i++) ct2[at + i] ^= 'false'.charCodeAt(i) ^ 'true '.charCodeAt(i);
try {
  const dg = createDecipheriv('aes-256-gcm', key, iv2);
  dg.setAuthTag(tag);
  console.log(Buffer.concat([dg.update(ct2), dg.final()]).toString());
} catch (e) {
  console.log('GCM decrypt      :', e.message);
}
