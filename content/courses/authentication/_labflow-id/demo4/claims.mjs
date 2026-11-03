// demo4/claims.mjs — lesson 4.3: the seven registered claims, and the attack for each one you skip.
// Every token below is SIGNED with the real key (a valid signature), so only the claim checks can stop them.
import { sign } from '../src/jwt/index.js';
import { verify, JwtError } from '../src/jwt/verify.js';
import { makeIssuer, ISSUER, AUDIENCE } from './_util.mjs';

const { keyring, kid } = makeIssuer();
const now = Date.UTC(2026, 10, 3, 9, 0, 0);
const nowSec = Math.floor(now / 1000);
const base = { iss: ISSUER, sub: 'usr_3', aud: AUDIENCE, iat: nowSec, nbf: nowSec, exp: nowSec + 900, jti: 'demo-jti-1', role: 'LAB_MANAGER' };
const tok = (over) => sign({ ...base, ...over }, { key: keyring[kid], kid });
const check = (label, token, opts = {}) => {
  try { verify(token, { keyring, issuer: ISSUER, audience: AUDIENCE, now, skewSec: 60, ...opts }); console.log(label.padEnd(44), '→ accepted'); }
  catch (e) { console.log(label.padEnd(44), '→ rejected', e instanceof JwtError ? e.code : e.message); }
};

console.log('a correct token first:');
check('all seven claims present', tok({}));

console.log('\nnow remove one claim at a time — each omission is a real attack:');
check('no iss (token from another issuer)', tok({ iss: undefined }));
check('no sub (who is it even about?)', tok({ sub: undefined }));
check('no aud (minted for labflow-chat, used here)', tok({ aud: 'labflow-chat' }));
check('no exp (a stolen token never dies)', tok({ exp: undefined }));
check('no iat (cannot reason about age)', tok({ iat: undefined }));
check('no jti (cannot revoke or detect replay)', tok({ jti: undefined }));

console.log('\nand the ones that are present but wrong:');
check('iss = https://evil.example', tok({ iss: 'https://evil.example' }));
check('aud = labflow-chat', tok({ aud: 'labflow-chat' }));
check('aud is an array incl. labflow-api', tok({ aud: ['labflow-chat', AUDIENCE] }));
