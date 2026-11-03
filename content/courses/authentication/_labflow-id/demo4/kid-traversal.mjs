// demo4/kid-traversal.mjs — lesson 4.4: the kid is attacker-controlled input. A verifier that turns it into a FILE
// PATH hands the attacker the key. Our verifier reads kid from a fixed object, so there is nothing to traverse.
import { createHmac, randomBytes } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { b64urlJson, decodeJwt } from '../src/jwt/index.js';
import { JwtError } from '../src/jwt/verify.js';
import { makeIssuer } from './_util.mjs';

const { tokens, keyring } = makeIssuer();

// A plausible, WRONG design: HS256 keys live in a keys/ directory, one file per kid, and the verifier reads
// keys/<kid>. Set up one legitimate key so the happy path works.
mkdirSync('keys', { recursive: true });
writeFileSync('keys/hs-main', randomBytes(32));
const signHs = (claims, kid, keyBytes) => { const i = `${b64urlJson({ alg: 'HS256', typ: 'JWT', kid })}.${b64urlJson(claims)}`; return `${i}.${createHmac('sha256', keyBytes).update(i).digest('base64url')}`; };
function verifyByKidPath(token) {
  const { header, signingInput, signature, payload } = decodeJwt(token);
  const keyBytes = readFileSync(`keys/${header.kid}`);               // ← attacker controls header.kid
  if (createHmac('sha256', keyBytes).update(signingInput).digest('base64url') !== signature) throw new Error('bad signature');
  return payload;
}

const claims = { sub: 'usr_3', role: 'LAB_MANAGER', iss: 'https://id.labflow.example', aud: 'labflow-api' };
console.log('happy path — a real token with kid "hs-main":');
console.log('  verifyByKidPath →', verifyByKidPath(signHs({ sub: 'usr_1', role: 'STUDENT' }, 'hs-main', readFileSync('keys/hs-main'))).sub, '(accepted)\n');

// Attack: kid points OUT of keys/ at a file the attacker already knows (package.json is in the public repo),
// so they HMAC with its exact bytes and the naive verifier re-reads the same bytes.
const kidPath = '../package.json';
const forged = signHs(claims, kidPath, readFileSync('package.json'));
console.log('attack — kid =', JSON.stringify(kidPath), '(a file whose bytes the attacker can read):');
try { const p = verifyByKidPath(forged); console.log('  verifyByKidPath → ACCEPTED, forged', p.sub, 'as', p.role, '— the kid chose the key'); }
catch (e) { console.log('  rejected:', e.message); }

console.log('\nLabFlow ID — kid is a key in a plain object, never a path:');
try { tokens.verify(forged); console.log('  accepted (broken)'); }
catch (e) { console.log('  rejected →', e instanceof JwtError ? e.code : e.message); }
console.log('  keyring holds exactly:', Object.keys(keyring));
