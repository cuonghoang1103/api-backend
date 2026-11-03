/** auth-lab-12 — Chapter 12 · Final project "LabFlow ID v1.0 under attack" (04/11/2026). Slug auth-12-7-lab-du-an-cuoi-khoa. */
import { lamDeck, sh, two, box } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s12/_ma.mjs';
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
export const deck = { key: 'auth-lab-12', code: 'AUTH Lab 12', title: 'Final project: LabFlow ID v1.0 under attack', sub: 'Twelve attack scenarios, 100 points, pass 70' };
export const slides = lamDeck({ chuong: 'Chapter 12 — Diagnosis', bai: 'Final project' }, [
  { cover: true, t: 'Final project: LabFlow ID<br>v1.0 under attack', sub: 'Chapter 12 · the capstone — the whole course, graded by ~12 real attacks' },
  { t: 'The whole course, graded by attack', to: true, giua: true, body: `<ul>
    <li>LabFlow ID v1.0 — every decision of the course wired together</li>
    <li>Graded by ~12 real attack scenarios, one per chapter</li>
    <li>100 points, pass 70; the reference scores 100</li>
    <li>Fill each export with the hardened choice (wire it or re-implement)</li>
    <li>Passing it means you can build it, break it, and fix it</li></ul>` },
  { t: 'The twelve scenarios', giua: true, body: `<table class="t"><tr><th>Scenario</th><th>Ch · pts</th></tr>
    <tr><td>DB dump — weak hash flagged, argon2id</td><td>2 · 8</td></tr>
    <tr><td>Email enumeration + homograph</td><td>6 · 16</td></tr>
    <tr><td>Session guessing (entropy)</td><td>1/3 · 8</td></tr>
    <tr><td>alg:none rejected</td><td>4 · 9</td></tr>
    <tr><td>Refresh reuse ⇒ revoke family</td><td>5 · 8</td></tr>
    <tr><td>Cookie posture · forged ID token</td><td>3/8 · 18</td></tr>
    <tr><td>Phishing · IDOR · stuffing · audit leak</td><td>7-11 · 33</td></tr></table>` +
      box('Each scenario is a lesson, run as an attack', 'resisting it is worth its points.', 'lam') },
  { t: 'Setup', giua: true, body: sh('cp -r sub-cuoi/starter sub-cuoi/my\nnode scripts/cham-cuoi-khoa.mjs sub-cuoi/my', { title: '12 scenarios, 100 points, pass 70', sm: true }) +
      box('Grade the empty starter', OUT['cuoi-starter'].split('\n').slice(-2, -1).join('\n'), 'lam') +
      box('Wire each export to the hardened module', 'needsRehash, normalizeEmail, verifyIdToken, can, decide, safeAudit — plus the posture declarations.', 'xanh') },
  { t: 'A weak build: runs, but insecure', body: sh(clip(OUT['cuoi-yeu'].split('\n').slice(1, 9).join('\n'), 62), { title: 'node scripts/cham-cuoi-khoa.mjs sub-cuoi/yeu', sm: true }) +
      box('25/100 — basics right, hardening missed', 'argon2id, cookie flags, refresh reuse ✓; but allows any authz, never blocks a spray, logs secrets, enumerates. "Runs" is not "secure".', 'do2') },
  { t: 'The reference: 100/100', body: sh(OUT['cuoi-tham-khao'].split('\n').slice(-2).join('\n'), { title: 'node scripts/cham-cuoi-khoa.mjs sub-cuoi/tham-khao', sm: true }) +
      two(box('Every decision wired to the hardened module', 'needsRehash, normalizeEmail, verifyIdToken, can, decide, safeAudit — every attack resisted, 100/100, 54 tests green.', 'xanh'),
          box('Each ✗ in a weak build is a chapter', 'the scorecard is a map of the whole course — a ✓ for the basics, a ✗ for each hardening skipped.', 'lam')) +
      box('The reference IS the course', 'wired together — twelve chapters of defences, each proven by the attack it stops.', 'lam') },
  { t: 'Tell it as a STAR story', giua: true, body: box('For your CV or interview', 'built an identity service defending database dumps, credential stuffing, phishing relays, token forgery and IDOR; graded 100/100 against an automated attack suite.', 'xanh') +
      box('Situation · Task · Action · Result', 'the capstone hands you the whole story — exposed service, a dozen attacks to defend, the specific hardening you wired, the score it earned.', 'lam') +
      box('And the understanding behind it', 'you can explain each defence by the attack it stops — which is what an interviewer is actually checking.', 'do2') },
  { t: 'Done when', to: true, giua: true, body: `<ul>
    <li>≥ 70/100 (target 100)</li>
    <li>for every scenario you pass, you can explain the attack it defends</li>
    <li>for every ✗ in a weaker build, you can name the chapter it skipped</li>
    <li>you can present it as building, breaking and fixing an identity service</li>
    <li>— the end of the course —</li></ul>` },
]);
