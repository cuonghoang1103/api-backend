/**
 * auth-lab-7 — Authentication · Chapter 7 · Lab 7 "LabFlow ID's TOTP, from scratch" (04/11/2026).
 * Slug bài: auth-7-7-lab-totp. Output = s07/_ma.mjs.
 */
import { lamDeck, js, sh, two, box, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s07/_ma.mjs';

const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const GR = CODE.grader7.split('\n');
const GR_T3 = GR.slice(GR.findIndex((l) => l.includes("T3 totp matches the RFC 6238")), GR.findIndex((l) => l.includes("T4 totp default"))).join('\n').trim();
export const deck = { key: 'auth-lab-7', code: 'AUTH Lab 7', title: "LabFlow ID's TOTP, from scratch", sub: 'Machine-graded against the RFC 4226 and RFC 6238 vectors' };

export const slides = lamDeck({ chuong: 'Chapter 7 — The second factor, and passkeys', bai: 'Lab 7' }, [
  { cover: true, t: 'Lab 7 — LabFlow ID’s TOTP,<br>from scratch', sub: 'Chapter 7 · 45–75 min — base32, HOTP, TOTP, verify with skew; node:crypto only' },
  { t: 'What you build', to: true, giua: true, body: `<ul>
    <li><b>base32Encode / base32Decode</b> — RFC 4648, no padding</li>
    <li><b>hotp(key, counter, {digits})</b> — HMAC + dynamic truncation</li>
    <li><b>totp(secret, {time, step, digits})</b> — the clock as the counter</li>
    <li><b>verifyTotp(secret, code, {window})</b> — accept ±window, constant-time</li>
    <li>The grader checks you against the RFC 4226 and RFC 6238 vectors</li></ul>` },
  { t: 'Setup', giua: true, body: sh('cp -r lab7/starter lab7/my\nnode scripts/cham-lab-7.mjs lab7/my', { title: 'no database, no network — just the algorithm', sm: true }) +
      box('Grade the empty starter', body('lab-bat-dau').split('\n').slice(-1).join('\n'), 'lam') +
      box('The rules', 'work only in lab7/my/index.js; export the five functions; node:crypto only. Do NOT import ../../src/totp — that is the answer.', 'xanh') },
  { t: 'How it is graded: 6 checks, 10 pts, pass 7', giua: true, body: `<table class="t"><tr><th>Check</th><th>Pts</th></tr>
    <tr><td>T1 base32 round-trip</td><td>1</td></tr>
    <tr><td>T2 HOTP RFC 4226 (counter 0–9)</td><td>2</td></tr>
    <tr><td>T3 TOTP RFC 6238 (SHA-1, 8 digits)</td><td>2.5</td></tr>
    <tr><td>T4 6-digit over a 30s step</td><td>1.5</td></tr>
    <tr><td>T5 ±1 skew window</td><td>2</td></tr>
    <tr><td>T6 rejects a wrong/empty code, no crash</td><td>1</td></tr></table>` +
      box('The vectors are the point', 'you are not trusted to "look right" — your code must reproduce t=59 → 94287082 and the other five, exactly.', 'xanh') },
  { t: 'The heart of the lab: T3', body: js(GR_T3, { sm: true }) +
      box('Reproduce the standard', 'the grader feeds the published RFC 6238 vectors; passing them is what makes a from-scratch primitive trustworthy, not merely one that runs without error.', 'xanh') +
      box('8 digits here on purpose', 'the RFC vectors are 8-digit, so an implementation that hardcodes 6 (the "yeu" attempt) fails T3 — the digits option must be respected everywhere.', 'lam') +
      box('Why these exact numbers', 'secret "12345678901234567890", t=59 → 94287082 is published in RFC 6238 Appendix B; every conforming library (including otplib) reproduces it, so your from-scratch code is right only if it does too.', 'lam') },
  { t: 'A first attempt that "works"', body: sh(body('lab-yeu').split('\n').slice(-7).join('\n'), { title: 'node scripts/cham-lab-7.mjs lab7/yeu', sm: true }) +
      box('5.5/10 — runs, not right', 'it generates correct 6-digit codes but hardcodes 6 digits (T3 fails) and verifies only the exact current step (T5 fails — a drifting clock locks the user out).', 'do2') },
  { t: 'The reference', body: sh(body('lab-tham-khao').split('\n').slice(-1).join('\n') + '\n' + body('lab-npm-test').split('\n').slice(-3).join('\n'), { title: 'src/totp/index.js + npm test', sm: true }) +
      two(box('10/10, 43 tests green', 'the reference is the same ~30 lines shown in lesson 7.2; the project tests include the RFC 4226 and 6238 vectors.', 'xanh'),
          box('Why a grader, not a demo', 'each failing check is a concrete bug — wrong digits, no skew window — not a vague "looks off". Passing means you matched the standard.', 'lam')) },
  { t: 'Hints', to: true, giua: true, body: `<ol>
    <li>Dynamic truncation: the low 4 bits of the LAST HMAC byte pick a 4-byte offset; mask the top bit; modulo 10^digits</li>
    <li>Respect the digits option everywhere — do not hardcode 6</li>
    <li>The counter is Math.floor((time − t0) / step); write it big-endian with writeBigUInt64BE</li>
    <li>verifyTotp loops w from −window to +window, comparing in constant time</li></ol>` },
  { t: 'Done when', to: true, giua: true, body: `<ul>
    <li>≥ 7/10 twice in a row (aim for 10)</li>
    <li>your hotp() reproduces the RFC 4226 vectors (counter 0–9)</li>
    <li>your totp() reproduces all six RFC 6238 vectors, at 6 and 8 digits</li>
    <li>verifyTotp accepts ±1 step and rejects beyond, in constant time</li>
    <li>npm test still passes (43 green), and a wrong/empty code fails cleanly</li>
    <li>Next — 7.6: the chapter check</li></ul>` },
]);
