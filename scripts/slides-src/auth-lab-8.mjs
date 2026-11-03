/** auth-lab-8 — Chapter 8 · Lab 8 "LabFlow API's ID-token check" (04/11/2026). Slug auth-8-7-lab-id-token. */
import { lamDeck, js, sh, two, box, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s08/_ma.mjs';
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const GR = CODE.grader8.split('\n');
const GR_T2 = clip(GR.slice(GR.findIndex((l) => l.includes('T2 a bad signature')), GR.findIndex((l) => l.includes('T3 the wrong issuer'))).join('\n').trim(), 56);
export const deck = { key: 'auth-lab-8', code: 'AUTH Lab 8', title: "LabFlow API's ID-token check", sub: 'Machine-graded: the seven checks, and the two bypasses' };
export const slides = lamDeck({ chuong: 'Chapter 8 — OAuth 2.1 and OpenID Connect', bai: 'Lab 8' }, [
  { cover: true, t: 'Lab 8 — LabFlow API’s<br>ID-token check', sub: 'Chapter 8 · 30–60 min — the seven checks, as a pure function' },
  { t: 'What you build', to: true, giua: true, body: `<ul>
    <li><b>verifyIdToken(payload, ctx)</b> ⇒ { ok, sub } or { error }</li>
    <li>ctx = { signatureValid, expectedIssuer, expectedAudience, nonce, now }</li>
    <li>Order: malformed → bad_signature → bad_iss → bad_aud → expired → bad_iat → bad_nonce</li>
    <li>aud may be a string OR an array containing your client id</li>
    <li>The signature is checked elsewhere; its result is passed in — do not skip it</li></ul>` },
  { t: 'Setup', giua: true, body: sh('cp -r lab8/starter lab8/my\nnode scripts/cham-lab-8.mjs lab8/my', { title: 'pure — no database, no network, no browser', sm: true }) +
      box('Grade the empty starter', body('lab-bat-dau').split('\n').slice(-1).join('\n'), 'lam') +
      box('The rules', 'work only in lab8/my/index.js; export verifyIdToken. Do NOT import ../../src/oidc/verify.js — that is the answer.', 'xanh') },
  { t: 'How it is graded: 6 checks, 10 pts, pass 7', giua: true, body: `<table class="t"><tr><th>Check</th><th>Pts</th></tr>
    <tr><td>T1 a valid token is accepted</td><td>1.5</td></tr>
    <tr><td>T2 a bad signature is rejected</td><td>2</td></tr>
    <tr><td>T3 the wrong issuer is rejected</td><td>1.5</td></tr>
    <tr><td>T4 the wrong audience (string or array)</td><td>2</td></tr>
    <tr><td>T5 expired and future-dated rejected</td><td>1.5</td></tr>
    <tr><td>T6 wrong nonce; malformed never crashes</td><td>1.5</td></tr></table>` +
      box('The signature is the highest-value check', 'skip it and every other check is meaningless — a forged token walks in.', 'do2') },
  { t: 'The critical check: T2', body: js(GR_T2, { sm: true }) +
      two(box('Why it is worth the most', 'without the signature, anyone can mint an ID token claiming any sub.', 'xanh'),
          box('signatureValid is passed in', 'the real signature check needs the provider’s JWKS; the lab hands you the result, and you must still gate on it.', 'lam')) +
      box('A client that trusts an unsigned "who is this"', 'is an open door — which is why T2 carries the most points of any check.', 'do2') },
  { t: 'A first attempt that "logs the user in"', body: sh(body('lab-yeu').split('\n').slice(-1).join('\n'), { title: 'node scripts/cham-lab-8.mjs lab8/yeu', sm: true }) +
      two(box('3/10 — runs, not safe', 'it checks iss and expiry — enough for a quick manual test.', 'do2'),
          box('Each miss is a bypass', 'no signature (forgery), no audience (another client’s token), no nonce (replay).', 'do2')) +
      box('"It logged me in" is not "it is correct"', 'the happy path passing says nothing about the forged, cross-client and replayed tokens the grader throws.', 'lam') },
  { t: 'The reference', body: sh(body('lab-tham-khao').split('\n').slice(-1).join('\n') + '\n' + body('lab-npm-test').split('\n').slice(-3).join('\n'), { title: 'src/oidc/verify.js + npm test', sm: true }) +
      two(box('10/10, 46 tests green', 'the reference is the real check, shown line by line in lesson 8.4.', 'xanh'),
          box('Pure and testable', 'only the signature is factored out, so the whole check is unit-tested against a valid token and each tampered one.', 'lam')) },
  { t: 'Done when', to: true, giua: true, body: `<ul>
    <li>≥ 7/10 twice in a row (aim for 10)</li>
    <li>every tampered token is rejected with the right error</li>
    <li>aud handles both a string and an array</li>
    <li>npm test still passes (46 green)</li>
    <li>you can explain T2 (signature) and T4 (audience) as full bypasses</li>
    <li>Next — 8.6: the chapter check</li></ul>` },
]);
