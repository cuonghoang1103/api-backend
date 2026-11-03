/**
 * auth-lab-4 — Authentication · Chapter 4 · Lab 4 "LabFlow ID's JWT verifier" (03/11/2026).
 * Slug bài: auth-4-7-lab-kiem-jwt. Grader = scripts/cham-lab-4.mjs (9 checks, 10 pts, pass 7). Output = s04/_ma.mjs.
 */
import { lamDeck, js, sh, two, box, cards, steps, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s04/_ma.mjs';

export const deck = { key: 'auth-lab-4', code: 'AUTH Lab 4', title: 'LabFlow ID’s JWT verifier', sub: 'Accept the one good token, reject 20+ hostile ones' };
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));

export const slides = lamDeck({ chuong: 'Chapter 4 — Tokens: JWT from the inside', bai: 'Lab 4' }, [
  { cover: true, t: 'LabFlow ID’s<br>JWT verifier', sub: 'Lab 4 · 60–90 min — write makeVerifier, defeat a battery of hostile tokens' },
  { t: 'Your task — makeVerifier', giua: true, body: box('What you write', c('export function makeVerifier({ keyring, issuer, audience, skewSec })') + ' returning ' + c('verify(token, { now, revoked })') + ' — returns the payload, or throws.', 'lam') +
      box('The rule from 4.2', 'Take the algorithm from the <b>key</b> you look up by kid, never from the header. Verify the signature before reading any claim.', 'xanh') +
      box('Allowed', c('node:crypto') + ' and ' + c('../../src/jwt/base64url.js') + ' (decodeJwt). Not ' + c('src/jwt/verify.js') + ' — that is the answer.', 'lam') },
  { t: 'The starter', body: sh(body('lab-bat-dau').split('\n').filter((l) => !l.trim().startsWith('↳')).join('\n'), { title: 'node scripts/cham-lab-4.mjs lab4/starter', sm: true }) +
      box('Zero, on purpose', 'A verifier that rejects everything also rejects the one valid token — the grader plants a valid control in every check to catch exactly that.', 'do2') },
  { t: 'Nine checks, ten points, pass is seven', giua: true, body: `<table class="t"><tr><th>Check</th><th>Pts</th><th>Lesson</th><th>Check</th><th>Pts</th><th>Lesson</th></tr>
    <tr><td>T1 valid token</td><td>1</td><td>4.1</td><td>T5 tampered/swapped sig</td><td>1</td><td>4.1</td></tr>
    <tr><td>T2 alg none</td><td>1.5</td><td>4.2</td><td>T6 exp + skew</td><td>1</td><td>4.3</td></tr>
    <tr><td>T3 HS/RS confusion</td><td>1.5</td><td>4.2</td><td>T7 nbf future</td><td>0.5</td><td>4.3</td></tr>
    <tr><td>T4 unknown/path kid</td><td>1</td><td>4.4</td><td>T8 wrong iss/aud/sub</td><td>1.5</td><td>4.3</td></tr>
    <tr><td colspan="3"></td><td>T9 revoked / no jti</td><td>1</td><td>4.3</td></tr></table>` +
      box('Each check names its lesson', 'The grader mints 20+ hostile tokens — the forgeries of 4.1–4.4, automated — and asks you to reject every one.', 'lam') },
  { t: 'A first attempt that scores 3.5', body: js(CODE.yeu.replace(/^\/\/.*\n/gm, '').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim(), { sm: true }) +
      box('It verifies the signature and stops', 'Signs people in, rejects a tampered token — and trusts alg none, ignores every claim. The most common first JWT integration.', 'do2') },
  { t: 'Where it fails', body: sh(body('lab-yeu').split('\n').filter((l) => /^[✓✗]|TOTAL/.test(l.trim())).join('\n'), { title: 'node scripts/cham-lab-4.mjs lab4/yeu', sm: true }) +
      box('Five holes, each a demo you ran', 'alg none (T2), unknown kid accepted (T4), expired (T6), wrong issuer (T8), revoked jti (T9). T3 and T5 pass because it does use the keyring’s verify for a real signature.', 'lam') },
  { t: 'The reference — src/jwt/verify.js', body: sh(body('lab-tham-khao'), { title: 'node scripts/cham-lab-4.mjs lab4/tham-khao', sm: true }) +
      box('10 / 10', 'The reference is LabFlow ID’s real verifier — algorithm from the key, signature, then the seven claims — shown line by line in 4.2 and 4.3.', 'xanh') },
  { t: 'Hints, light to strong', giua: true, body: steps([
      'Each check names its lesson — rerun that demo (alg-none, claims, rotate)',
      'Get the key with ' + c('keyring[header.kid]') + '; if missing, reject — never ' + c('if (key)'),
      'Reject unless ' + c('header.alg === key.alg') + '; only then call ' + c('key.verify(...)'),
      'exp: reject when ' + c('now - skew >= exp') + '; nbf: reject when ' + c('now + skew < nbf') + '; check jti last',
    ]) + box('If stuck on T3', 'You do not need to understand the confusion maths — just never choose the algorithm from the header. Using the keyring’s own verify is what blocks it.', 'lam') },
  { t: 'Checklist before you submit', giua: true, body: cards([
      ['Score', 'TOTAL ≥ 7 (aim 10), twice in a row'],
      ['Order', 'algorithm from the key; signature before any claim'],
      ['Tests', c('npm test') + ' still passes'],
    ], 3) + box('Done when', 'Your verifier scores ≥ 7/10 twice in a row, and you can name the forgery behind every failed check — especially T2 (none) and T3 (confusion).', 'xanh') +
      box('Where it is reused', 'This verifier returns in Chapter 5 (refresh), Chapter 8 (verifying LabFlow ID as an OIDC provider) and Chapter 9 (reading the role claim for authorization).', 'lam') },
]);
