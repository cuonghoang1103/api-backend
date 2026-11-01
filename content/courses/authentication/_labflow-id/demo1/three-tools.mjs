// demo1/three-tools.mjs — lesson 1.4: hash, MAC and signature on the same message. Who can make each one? Who can check it?
import { createHash, createHmac, generateKeyPairSync, sign, verify } from 'node:crypto';

const msg = Buffer.from('user=usr_1&role=STUDENT');
const KEY = Buffer.from(process.env.DEMO_HMAC_KEY); // a FAKE shared key for the demo

// 1. Hash — no key. Anyone, the attacker included, can compute it for ANY message.
console.log('sha256      ', createHash('sha256').update(msg).digest('hex'));
console.log('sha256 (1 char changed)', createHash('sha256').update('user=usr_1&role=STUDENS').digest('hex'));
// 2. MAC — one shared key makes AND checks the tag.
console.log('hmac-sha256 ', createHmac('sha256', KEY).update(msg).digest('hex'));
// 3. Signature — the private key makes it, the public key only checks it.
const { privateKey, publicKey } = generateKeyPairSync('ed25519');
const sig = sign(null, msg, privateKey);
console.log('ed25519 sig ', sig.length, 'bytes:', sig.toString('base64url').slice(0, 24) + '…');
console.log('verify with the public key            →', verify(null, msg, publicKey, sig));
console.log('verify a changed message              →', verify(null, Buffer.from('user=usr_1&role=LAB_MANAGER'), publicKey, sig));
try {
  sign(null, Buffer.from('user=usr_1&role=LAB_MANAGER'), publicKey);
  console.log('signed with the PUBLIC key?!');
} catch (e) {
  console.log('try to SIGN with the public key       →', e.code ?? e.message);
}
