// demo4/decode.mjs — lesson 4.1: a JWT is header.payload.signature, each base64url. Decoding is NOT verifying.
import { decodeJwt, unb64url } from '../src/jwt/index.js';
import { decodeJwt as joseDecode, decodeProtectedHeader } from 'jose';
import { makeIssuer, j } from './_util.mjs';

const { tokens } = makeIssuer();
const token = tokens.issue('usr_3', { role: 'LAB_MANAGER' }); // Co Lan, a LAB_MANAGER

const [h, p, s] = token.split('.');
console.log('three parts, separated by dots:');
console.log('  header   ', h.length, 'chars base64url');
console.log('  payload  ', p.length, 'chars base64url');
console.log('  signature', s.length, 'chars base64url');

console.log('\nanyone can base64url-decode the first two — no key needed:');
console.log('  header  =', unb64url(h).toString('utf8'));
console.log('  payload =', unb64url(p).toString('utf8'));

console.log('\nthe payload is NOT encrypted. A JWT hides nothing; it only proves it was not changed.');
console.log('  jose decodeJwt (no verify) sees the same sub:', joseDecode(token).sub);
console.log('  jose decodeProtectedHeader alg/kid         :', j(decodeProtectedHeader(token)));

console.log('\nour own decodeJwt returns the signing input the signature actually covers:');
const d = decodeJwt(token);
console.log('  signingInput =', d.signingInput.length, 'bytes =', `${h}.${p}`.length, '(header.payload)');
console.log('  signature is', unb64url(d.signature).length, 'raw bytes (Ed25519 is always 64)');
