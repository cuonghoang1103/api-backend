// demo1/signed-demo.mjs — lesson 1.4: a signed value with an expiry and a key id (src/crypto/signed.js).
import { signValue, verifyValue } from '../src/crypto/index.js';

const keys = { k1: process.env.DEMO_KEY_1, k2: process.env.DEMO_KEY_2 }; // FAKE demo keys
const NOW = Date.UTC(2026, 10, 1, 6, 0, 0); // 13:00 in Hanoi — a fixed clock, so the output is repeatable
const card = signValue('usr_1|STUDENT', { keys, kid: 'k1', ttlSec: 900, now: NOW });
console.log('signed      :', card);
console.log('verify now  :', verifyValue(card, { keys, now: NOW }));
const [v, exp, kid, sig] = card.split('.');
const other = Buffer.from('usr_1|LAB_MANAGER').toString('base64url');
console.log('new value   :', verifyValue([other, exp, kid, sig].join('.'), { keys, now: NOW }));
console.log('later exp   :', verifyValue([v, Number(exp) + 86400, kid, sig].join('.'), { keys, now: NOW }));
console.log('+899 s      :', verifyValue(card, { keys, now: NOW + 899_000 }));
console.log('+900 s      :', verifyValue(card, { keys, now: NOW + 900_000 }));
console.log('k1 retired  :', verifyValue(card, { keys: { k2: keys.k2 }, now: NOW }));
