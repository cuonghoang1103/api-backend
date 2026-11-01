/**
 * auth-02-4 — Authentication · Chapter 2 · Lesson 2.4 "A password policy from NIST, not from habit" (01/11/2026).
 * Slug bài: auth-2-4-chinh-sach. Output = s02/_ma.mjs (HIBP Pwned Passwords gọi thật 01/11/2026, LabFlow ID v0.2, env -i).
 */
import { lamDeck, js, sh, two, box, cards, steps, flow, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s02/_ma.mjs';

export const deck = { key: 'auth-02-4', code: 'AUTH 2.4', title: 'A password policy from NIST, not from habit', sub: 'Length, a blocklist, a breach check — no symbol rules' };
const body = (k) => OUT[k].split('\n').slice(1).join('\n');
const POL = CODE.policy.split('\n');
const CHECK = POL.slice(POL.findIndex((l) => l.startsWith('export function checkNewPassword')), POL.length).join('\n').replace(/ *\/\/.*$/gm, '');
const PW = CODE.pwned.split('\n');
const PWNED = PW.slice(PW.findIndex((l) => l.startsWith('  const sha1')), PW.findIndex((l) => l.startsWith('  } catch'))).join('\n').replace(/ *\/\/.*$/gm, '');

export const slides = lamDeck({ chuong: 'Chapter 2 — Passwords', bai: '2.4' }, [
  { cover: true, t: 'A password policy<br>from NIST, not from habit', sub: 'Chapter 2 · Lesson 2.4 — length, a blocklist, a breach check' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What NIST SP 800-63B-4 actually requires — and forbids</li>
    <li>Why “upper + lower + digit + symbol” lets <b>Password1!</b> in</li>
    <li>A breach check that sends only <b>5 hex characters</b> (k-anonymity)</li>
    <li>What to do when that service is down</li>
    <li>LabFlow ID v0.2’s ${c('checkNewPassword')}, and Bình’s ${c('123456')}</li></ul>` },
  { t: 'The lock on a shared gate', body: cards([
      ['Rule-based', '“the code must contain a 0 and a 9” — residents pick <b>0009</b> and <b>9000</b>; burglars try those first'],
      ['List-based', '“not 1234, not 0000, not the house number” — kills the guesses burglars actually make'],
      ['Length', 'a 6-digit code has 100× the space of a 4-digit one, whatever the digits'],
    ], 3) + box('Same for passwords', 'Rules change <b>how</b> people write a common password, not whether it is common. Lists and length change what an attacker’s list can reach.', 'lam') },
  { t: 'NIST SP 800-63B-4 (§3.1.1.2), in one table', body: `<table class="t"><tr><th>SHALL / SHOULD</th><th>SHALL NOT</th></tr>
    <tr><td>≥ <b>15</b> characters when the password is the only factor (≥ 8 with MFA)</td><td>composition rules (“a symbol, a digit…”)</td></tr>
    <tr><td>allow ≥ <b>64</b> characters, spaces, all Unicode; NFC; 1 code point = 1 character</td><td>periodic forced changes (but force one on evidence of compromise)</td></tr>
    <tr><td>compare the <b>whole</b> password with a blocklist; say why it was rejected</td><td>hints readable before login; security questions</td></tr>
    <tr><td>allow password managers, autofill and paste</td><td>truncate the password</td></tr></table>` +
    box('LabFlow ID today', 'Passwords are the only factor until Chapter 7 ⇒ minimum <b>15</b>; maximum 128; blocklist = SecLists top 10,001; breach check = HIBP.', 'xanh') },
  { t: 'Do composition rules keep common passwords out?', body: sh(body('24-composition'), { title: 'node demo2/composition.mjs' }) +
      cards([
        ['0 of 10,001', 'common passwords pass the classic rules — the list is mostly lower-case'],
        ['756 of the top 1,000', 'pass after the change people really make: <b>Capital + “1!”</b>'],
        ['1 of 10,001', 'has 15+ characters — <b>length</b> is what removes the list'],
      ], 3) + box('Why NIST dropped the rules', 'They push people to predictable variations of the same words, and to writing passwords down; they never test whether the result is common.', 'lam') },
  { t: 'Rules say yes, breach data says no', body: sh(body('24-hibp'), { title: 'node demo2/hibp.mjs <password> — real HIBP API, 01/11/2026', sm: true }) +
      two(box('Password1! and P@ssw0rd!', 'pass every classic rule — and appear <b>584,516</b> and <b>119,515</b> times in breaches.', 'do2'),
        box('A Vietnamese sentence', '33 characters, lower-case, no digit — fails the classic rules, <b>0</b> breaches, accepted by NIST’s.', 'xanh')) },
  { t: 'k-anonymity: send 5 characters, not the password', body: flow([
      { t: 'SHA-1', s: 'of the password' },
      { t: 'send 7C4A8', s: 'first 5 hex = 20 bits' },
      { t: '~2,100 suffixes', s: 'every hash with that prefix' },
      { t: 'match locally', s: 'D09CA37…:210461208', mau: '#2e7d32' },
    ], { h: 110, fs: 18 }) + js(PWNED.replace(/\n\s*signal: AbortSignal.timeout\(timeoutMs\),/, ' signal: AbortSignal.timeout(timeoutMs),'), { sm: true }) +
    box('Padding', `${c('Add-Padding: true')}: docs: 800–1,000 records; we got 2,094–2,202 (1 padding line). The server never learns which suffix you meant.`, 'lam') },
  { t: 'When the breach service hangs', body: sh(body('24-down'), { title: 'node demo2/hibp-down.mjs  (a server on :4801 that never answers)' }) +
      two(box('Fail open (LabFlow ID)', 'Timeout 1.5 s ⇒ ' + c('null') + ' ⇒ accept, using the local blocklist only, and <b>log a warning</b>. Sign-ups keep working.', 'xanh'),
        box('Fail closed', 'Reject until HIBP answers ⇒ an outage elsewhere stops <b>your</b> sign-ups. Choose consciously; write it down.', 'do2')) +
      cards([
        ['Always a timeout', c('AbortSignal.timeout(1500)') + ' — without it a hung API hangs your sign-up'],
        ['Always a log line', 'a silent fail-open is a policy nobody knows is off'],
        ['Optional mirror', 'HIBP publishes the full hash set for offline use'],
      ], 3) },
  { t: 'checkNewPassword — the whole policy', body: js(CHECK.replace("const context = ['labflow', 'labflowid', email", "const context = ['labflow', 'labflowid',\n    email").replace("''), ].filter", "'')].filter"), { sm: true, hl: [5, 6] }) +
      box('Code points, not .length', c('[...pw].length') + ' after NFC: “ờ” typed decomposed is 2 UTF-16 units of the same letter; NIST counts it once.', 'lam') },
  { t: 'v0.2 sign-up: four new passwords', body: sh(body('24-signup'), { title: 'bash demo2/sign-up-tries.sh' }) +
      cards([
        ['123456', 'TOO_SHORT + COMMON — two reasons, both shown'],
        ['LabFlow2026!!!!!', 'passes every classic rule; the letters spell the service ⇒ CONTEXT_WORD'],
        ['iloveyouiloveyou', '16 characters, not in our list — but HIBP has it <b>4,707</b> times'],
      ], 3) },
  { t: 'Existing accounts: Bình’s 123456', body: steps([
      'The policy applies to <b>new</b> passwords (sign-up, change, reset) — old rows are not rejected retroactively',
      'At sign-in, a password found on the blocklist ⇒ ' + c('must_change_password = true'),
      'Bình still signs in (lesson 2.3: ' + c('"mustChangePassword":true') + ') and is sent to “choose a new password”',
      'NIST: no periodic expiry — change only on <b>evidence of compromise</b>',
    ]) + box('What to tell the user', '“This password has appeared in data breaches — choose another.” Not “must contain a symbol”. Show every reason, keep their typing, allow paste.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>NIST 800-63B-4: ≥ 15 chars (single factor), ≥ 64 allowed, no composition rules, no expiry</li>
    <li>Classic rules: 756 of the top 1,000 pass after “Capital + 1!”</li>
    <li>Blocklist the <b>whole</b> password + context words; HIBP with 5 hex characters</li>
    <li>Fail open with a log line, or fail closed — decide on purpose</li>
    <li>Next — 2.5: move old MD5/bcrypt rows to argon2id without a reset</li></ul>` },
]);
