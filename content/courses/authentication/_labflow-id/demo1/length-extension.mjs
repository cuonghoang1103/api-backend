// demo1/length-extension.mjs — lesson 1.4: sha256(secret + message) is NOT a MAC. HMAC is.
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { sha256, padding } from './sha256.mjs';

const SECRET = randomBytes(24); // the server's key: 24 bytes; the attacker never sees it
const same = (a, b) => a.length === b.length && timingSafeEqual(a, b);
const tagNaive = (m) => createHash('sha256').update(Buffer.concat([SECRET, m])).digest();
const tagHmac = (m) => createHmac('sha256', SECRET).update(m).digest();
const roleOf = (m) => Object.fromEntries(new URLSearchParams(m.toString('latin1'))).role; // the LAST role= wins
const show = (m) => m.toString('latin1') // bytes you cannot type, shown as \xNN; a run of zero bytes as \x00×N
  .replace(/[^\x20-\x7e]/g, (c) => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0'))
  .replace(/(\\x00){3,}/g, (run) => `\\x00×${run.length / 4}`);

// 0. Our own SHA-256 agrees with Node's (so the attack below is not a trick of a broken implementation).
console.log('own sha256 = node sha256:', sha256(Buffer.from('LabFlow')).equals(createHash('sha256').update('LabFlow').digest()));

// 1. The server issues a "signed" string to An (think: a cookie value or a link).
const msg = Buffer.from('user=usr_1&role=STUDENT');
const tag = tagNaive(msg);
console.log('issued  :', msg.toString(), '· tag', tag.toString('hex').slice(0, 16) + '…');

// 2. An knows the message, the tag and the key LENGTH (or simply tries 1…64). She appends her own text.
const extra = Buffer.from('&role=LAB_MANAGER');
const forged = Buffer.concat([msg, padding(SECRET.length + msg.length), extra]);
const forgedTag = sha256(extra, tag, SECRET.length + msg.length + padding(SECRET.length + msg.length).length);
console.log('forged  :', show(forged), `(${forged.length} bytes)`);
console.log('sha256(secret+msg) accepts the forgery:', same(tagNaive(forged), forgedTag), '→ role =', roleOf(forged));

// 3. The same attack against HMAC-SHA256.
const hTag = tagHmac(msg);
const hForgedTag = sha256(extra, hTag, SECRET.length + msg.length + padding(SECRET.length + msg.length).length);
console.log('HMAC accepts the forgery:', same(tagHmac(forged), hForgedTag));
