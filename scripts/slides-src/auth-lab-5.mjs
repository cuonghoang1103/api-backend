/**
 * auth-lab-5 — Authentication · Chapter 5 · Lab 5 "LabFlow ID's refresh-token layer" (03/11/2026).
 * Slug bài: auth-5-7-lab-xoay-vong. Grader = scripts/cham-lab-5.mjs (8 checks, 10 pts, pass 7). Slide titles match giang/auth-lab-5.mjs.
 */
import { lamDeck, js, sh, two, box, cards, steps, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s05/_ma.mjs';

export const deck = { key: 'auth-lab-5', code: 'AUTH Lab 5', title: 'LabFlow ID’s refresh-token layer', sub: 'Rotation, reuse detection, the race, and devices' };
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const Y = CODE.yeu.split('\n');
const YEU_R = Y.slice(Y.findIndex((l) => l.includes('async function rotate')), Y.findIndex((l) => l.includes('async function rotate')) + 6).join('\n').replace(/ +\/\/.*$/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 5 — Refresh, rotation and revocation', bai: 'Lab 5' }, [
  { cover: true, t: 'LabFlow ID’s<br>refresh-token layer', sub: 'Lab 5 · 60–90 min — rotation, reuse detection, the race, devices' },
  { t: 'Your task — refreshLayer', giua: true, body: box('What you write', c('export function refreshLayer({ store, now, graceMs, familyTtlMs })') + ' returning ' + c('issue, rotate, revokeFamily, revokeAll, revokeDevice, listDevices') + '.', 'lam') +
      box('The rules', 'Store only the token’s <b>digest</b>; rotate on every use; a reused token (outside grace) revokes the family; the race within grace returns the same child.', 'xanh') +
      box('Allowed', c('node:crypto') + ' and ' + c('../../src/crypto') + ' (newToken, tokenDigest). Not ' + c('src/refresh/layer.js') + ' — the answer.', 'lam') },
  { t: 'The starter', body: sh(body('lab-bat-dau').split('\n').filter((l) => !l.trim().startsWith('↳')).join('\n'), { title: 'node scripts/cham-lab-5.mjs lab5/starter', sm: true }) +
      box('Zero, on purpose', 'The very first check needs issue and rotate to work, so a layer that throws fails from the start.', 'do2') },
  { t: 'Eight checks, ten points, pass is seven', giua: true, body: `<table class="t"><tr><th>Check</th><th>Pts</th><th>Check</th><th>Pts</th></tr>
    <tr><td>T1 issue + rotate</td><td>1.5</td><td>T5 reuse after grace = theft</td><td>1</td></tr>
    <tr><td>T2 store a digest</td><td>1</td><td>T6 invalid/expired/revoked</td><td>1</td></tr>
    <tr><td>T3 reuse revokes the family</td><td>2</td><td>T7 one device row per family</td><td>1</td></tr>
    <tr><td>T4 the race within grace</td><td>1.5</td><td>T8 revoke one and all</td><td>1</td></tr></table>` +
      box('Each check names its lesson', 'The grader drives every path of 5.1–5.5 with a fake clock and an in-memory store.', 'lam') },
  { t: 'A first attempt that scores 3.5', giua: true, body: js(YEU_R, { sm: true }) +
      box('It rotates and stops', 'The naive <code>rotate</code>: look up the token, mint a new one, return it. It never marks the old one <b>used</b>, checks <b>revoked</b>, or caches a child for the grace window.', 'do2') +
      box('So it cannot tell', 'a rotated token from a stolen one — no reuse detection (T3), no race handling (T4), and a revoked token still refreshes (T6, T8).', 'lam') },
  { t: 'Where it fails', body: sh(body('lab-yeu').split('\n').filter((l) => /^[✓✗]|TOTAL/.test(l.trim())).join('\n'), { title: 'node scripts/cham-lab-5.mjs lab5/yeu', sm: true }) +
      box('It passes only the plumbing', 'issue (T1), the digest (T2), the devices query (T7). No reuse detection (T3), no grace (T4), no expiry/revoke checks (T5, T6, T8).', 'lam') },
  { t: 'The reference — src/refresh/layer.js', body: sh(body('lab-tham-khao'), { title: 'node scripts/cham-lab-5.mjs lab5/tham-khao', sm: true }) +
      box('10 / 10', 'The reference is LabFlow ID’s real layer — rotation, reuse detection, the grace window, family revocation — shown line by line in 5.1, 5.2 and 5.5.', 'xanh') },
  { t: 'Hints, light to strong', giua: true, body: steps([
      'Each check names its lesson — rerun that demo (rotate-reuse, race, devices)',
      'On a rotation: ' + c('store.markUsed(rec.id, { usedAt, replacedBy })') + ', then cache the new child',
      'On a used token: within graceMs return the cached child; else ' + c('store.revokeFamily') + ' and ' + c('REUSE_DETECTED'),
      'Check ' + c('revokedAt') + ' / ' + c('expiresAt') + ' BEFORE the used-token branch, so a normal expiry is not theft',
    ]) },
  { t: 'Checklist before you submit', giua: true, body: cards([
      ['Score', 'TOTAL ≥ 7 (aim 10), twice in a row'],
      ['Behaviour', 'reuse revokes the family; the race returns one shared token'],
      ['Storage', 'tokens stored as digests; ' + c('npm test') + ' passes'],
    ], 3) + box('Done when', 'Your layer scores ≥ 7/10 twice in a row, and you can explain T3 (reuse ⇒ revoke the family) and T4 (the grace window) in your own words.', 'xanh') +
      box('Where it is reused', 'This layer returns in Chapter 6 (an account lifecycle that must end sessions) and Chapter 11 (moving the grace cache to Redis across processes).', 'lam') },
]);
