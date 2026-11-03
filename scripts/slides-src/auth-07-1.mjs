/**
 * auth-07-1 — Authentication · Chapter 7 · Lesson 7.1 "What a second factor buys, and what it does not" (04/11/2026).
 * Slug bài: auth-7-1-yeu-to-thu-hai. Output = s07/_ma.mjs (LabFlow ID v0.7 + PostgreSQL 17.11, Node 22.23.3, env -i).
 */
import { lamDeck, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s07/_ma.mjs';

const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
export const deck = { key: 'auth-07-1', code: 'AUTH 7.1', title: 'What a second factor buys, and what it does not', sub: 'Two different families, failing differently — and the type is the security' };

export const slides = lamDeck({ chuong: 'Chapter 7 — The second factor, and passkeys', bai: '7.1' }, [
  { cover: true, t: 'What a second factor buys,<br>and what it does not', sub: 'Chapter 7 · Lesson 7.1 — the three families, step-up, and why "MFA" is not an answer' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>Chapter 7</b>: a second factor — TOTP you write yourself, recovery codes, and phishing-proof passkeys</li>
    <li>The three factor families: something you <b>know</b> / <b>have</b> / <b>are</b></li>
    <li>What a second factor defends against — and the three things it does not</li>
    <li>Step up at login and before sensitive actions, not on every request</li>
    <li>The <b>type</b> is the security: SMS weakest, passkeys the only phishing-proof one</li></ul>` },
  { t: 'A lock and a deadbolt', giua: true, body: cards([
      ['Same key', 'A second lock you open with the key you already lost adds nothing — two passwords, one failure.'],
      ['Its own key, kept elsewhere', 'A deadbolt with a separate key is real defence in depth — a second factor from another family.'],
      ['The rule', 'A second factor only helps to the extent that losing the password does not also lose it.'],
    ], 3) + box('So', 'Two factors means two DIFFERENT families, failing on different days. Two things you know is still one factor.', 'lam') },
  { t: 'The three families', giua: true, body: cards([
      ['Know', 'a password, a PIN, a security answer — all leak the same way, all phishable'],
      ['Have', 'a phone (TOTP/push), an SMS line, a security key, a passkey'],
      ['Are', 'a fingerprint, a face — usually unlocking a "have" factor, not sent over the wire'],
    ], 3) + two(box('Two factors', 'one from each of two different families.', 'xanh'), box('Not two factors', 'a password + a security question — both "know".', 'do2')) },
  { t: 'What it defends against', body: `<table class="t"><tr><th>Attack</th><th>Stopped?</th><th>Why</th></tr>
    <tr><td>reused / leaked password</td><td>yes</td><td>useless without the factor the attacker lacks</td></tr>
    <tr><td>guessed / sprayed password</td><td>yes</td><td>the second factor is still required</td></tr>
    <tr><td>phished password</td><td>mostly</td><td>unless the factor is relayed in real time (TOTP/push)</td></tr></table>` +
      box('The whole value', 'is in the second family failing on a different day from the first — a stolen password alone no longer logs in.', 'lam') },
  { t: 'What it does NOT defend against', giua: true, body: cards([
      ['Malware on the unlocked device', 'if the attacker is already inside the device, they have the factor too — the second lock is on the same side of the door.'],
      ['A stolen live session', 'a session token is not re-challenged; step up before sensitive actions to shrink the window an attacker can use it in.'],
      ['Real-time phishing of TOTP/push', 'a convincing fake relays the code (or triggers the push) to the real site within its window — only an origin-bound factor stops it (7.4).'],
    ], 3) + box('The pattern', 'a second factor defends the DOOR (login); it does not defend a device already compromised, or a session already inside.', 'do2') },
  { t: 'Step up — not on every request', body: sh(body('73-totp-enroll').split('\n').slice(-6).join('\n'), { title: 'the step-up after the password check' }) +
      cards([['When to ask', 'at login, and again before a few high-value actions — change password, add a passkey, delete the account.'],
        ['When NOT to', 'not on every click — the session carries the factor in between, so you are not re-prompting a user mid-task.'],
        ['Even with a live session', 'a stolen session token is not re-challenged; stepping up before a sensitive action makes the attacker prove the factor they lack.']], 3) },
  { t: 'The measured step-up', body: sh(body('73-totp-enroll').split('\n').slice(-4).join('\n'), { title: 'bash demo7/totp-enroll.sh', sm: true }) +
      two(box('A valid code', 'the step-up returns { ok: true, via: \'totp\' } — the factor is proven and the sensitive action proceeds.', 'xanh'),
          box('Phone gone', 'a single-use recovery code returns { via: \'recovery\', remaining: 9 }; a reused one returns BAD_CODE (7.3).', 'lam')) +
      box('One endpoint, two ways to satisfy it', 'both prove the second factor; neither is the password, which was already checked.', 'lam') },
  { t: 'Ranking the factors (the real question)', giua: true, body: `<table class="t"><tr><th>Factor</th><th>Family</th><th>Phishable?</th></tr>
    <tr><td>password</td><td>know</td><td>yes</td></tr>
    <tr><td>TOTP app</td><td>have</td><td>yes (relay in 30s)</td></tr>
    <tr><td>push</td><td>have</td><td>yes (+ fatigue)</td></tr>
    <tr><td>SMS</td><td>have</td><td>yes — SIM-swap / SS7</td></tr>
    <tr><td>passkey</td><td>have/are</td><td><b>no</b> — origin-bound (7.4)</td></tr></table>` +
      box('SMS is the weak one', 'A factor you have, delivered over a channel anyone can redirect. Offer it last, never as the only option (NIST restricts it).', 'do2') },
  { t: 'Trap: "we have MFA, so we are phishing-safe"', giua: true, body: box('MFA raises the bar', 'but TOTP and push are both phishable — a convincing fake site collects the password AND the code (or triggers the push) and relays them to the real site within the 30-second window.', 'do2') +
      box('Only origin binding removes phishing', 'a passkey signs over the origin (7.4), so a relayed challenge is worthless to a fake site. The label "MFA" does not tell you which you have; the TYPE does.', 'xanh') +
      box('So the first question', 'is never "do we have MFA?" but "which factor, and is it origin-bound?"', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A second factor answers one problem: an attacker who has the password</li>
    <li>Two factors = two different families; two things you know is one factor</li>
    <li>It does not stop device malware, a stolen live session, or real-time phishing of TOTP/push</li>
    <li>Step up at login and before sensitive actions; the session carries the factor in between</li>
    <li>Next — 7.2: TOTP from the inside, in thirty lines</li></ul>` },
]);
