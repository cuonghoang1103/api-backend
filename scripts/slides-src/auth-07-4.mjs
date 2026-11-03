/**
 * auth-07-4 — Authentication · Chapter 7 · Lesson 7.4 "Passkeys, and the one line that kills phishing" (04/11/2026).
 * Slug bài: auth-7-4-passkey. Output = s07/_ma.mjs.
 */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s07/_ma.mjs';

const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const W = CODE.webauthn.split('\n');
const VERIFY = W.slice(W.findIndex((l) => l.includes('verifyAuthentication:')), W.findIndex((l) => l.includes('verifyAuthentication:')) + 5).join('\n').replace(/^\s+/gm, (m) => m.slice(0, 6)).trim();
export const deck = { key: 'auth-07-4', code: 'AUTH 7.4', title: 'Passkeys, and the one line that kills phishing', sub: 'A key pair bound to the origin — a relayed challenge is worthless' };

export const slides = lamDeck({ chuong: 'Chapter 7 — The second factor, and passkeys', bai: '7.4' }, [
  { cover: true, t: 'Passkeys, and the one line<br>that kills phishing', sub: 'Chapter 7 · Lesson 7.4 — the authenticator signs over the origin' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A passkey is a key pair; the private half never leaves the device</li>
    <li>The server stores only the public key — a database dump is harmless</li>
    <li>Two ceremonies: register (make a key pair) and authenticate (sign a challenge)</li>
    <li>One line — expectedOrigin / expectedRPID — binds the signature to your site</li>
    <li>Proven against a real Chromium: a phishing origin cannot verify</li></ul>` },
  { t: 'A wax seal, not a shared word', giua: true, body: cards([
      ['A password is a word you say', 'overhear it and you can repeat it anywhere — a shared secret.'],
      ['A passkey is a wax seal', 'a private stamp that never leaves your pocket, pressed onto THIS letter to THIS recipient.'],
      ['Copy the imprint', 'and you have proof of nothing — you cannot press the stamp onto your own letter.'],
    ], 3) + box('The recipient baked into the seal', 'is the website’s origin — and that is the whole of the phishing defence.', 'lam') },
  { t: 'A key pair, not a secret', giua: true, body: cards([
      ['Registration makes a key pair', 'the public key goes to the server; the private key stays on the device, in hardware, and only ever produces signatures.'],
      ['No shared secret', 'a database dump gives an attacker public keys — useless to impersonate anyone, because signing still needs the private key.'],
      ['The structural difference', 'from a password or a TOTP seed, both of which the server must hold in a form that is dangerous the moment it leaks.'],
    ], 3) + box('So a passkey breach is not a credential breach', 'the one thing that proves identity — the private key — was never in your system to steal.', 'xanh') },
  { t: 'Two ceremonies, and the one line', body: js(VERIFY, { sm: true }) +
      two(box('Registration', 'server sends a challenge; the authenticator makes a key pair, signs, returns the public key.', 'lam'),
          box('Authentication', 'server sends a challenge; the authenticator signs it with the private key.', 'lam')) +
      box('expectedOrigin / expectedRPID', 'in both, the authenticator signs over the challenge AND the requesting origin; the server verifies against its own. A signature made for evil.example cannot satisfy a check for your real origin — that is the whole defence.', 'xanh') },
  { t: 'Measured with a real Chromium', body: sh(body('74-passkey').split('\n').slice(0, 5).join('\n'), { title: 'node demo7/passkey-ceremony.mjs', sm: true }) +
      two(box('A virtual authenticator', 'a real headless Chromium (Playwright CDP) creates and uses a real passkey — not a mock or a fixture.', 'xanh'),
          box('Both ceremonies verify', 'register verified=true, then authenticate verified=true against LabFlow ID’s src/webauthn.', 'lam')) +
      box('The stored credential', 'the server kept a credential id, a public key and a counter — and nothing that could be replayed.', 'lam') },
  { t: 'The one line, proven', body: sh(body('74-passkey').split('\n').slice(5, 10).join('\n'), { title: 'the same assertion, two origins', sm: true }) +
      box('Real origin ⇒ verified=true', 'the assertion the browser produced verifies against the true origin.', 'xanh') +
      box('evil.example ⇒ verified=false', 'the SAME real assertion, re-verified with a phishing origin, fails — the authenticator signed the true origin and the signature cannot match a lie.', 'do2') +
      box('That is the whole phishing defence', 'not a heuristic, not a blocklist — a cryptographic signature over the origin that a fake site cannot forge.', 'lam') },
  { t: 'Why phishing dies', giua: true, body: `<table class="t"><tr><th>Attack</th><th>Password / TOTP</th><th>Passkey</th></tr>
    <tr><td>fake site collects the secret</td><td>relays it, logs in</td><td>no secret — only a signature</td></tr>
    <tr><td>fake site relays the challenge</td><td>code valid 30s</td><td>signed the FAKE origin ⇒ rejected</td></tr>
    <tr><td>database dumped</td><td>hashes / codes</td><td>public keys — useless</td></tr></table>` +
      box('The browser enforces it too', 'the browser will not use a credential whose RP ID does not match the page’s origin — you do not even rely only on the server.', 'xanh') +
      box('So the user cannot be tricked', 'into signing for your site from someone else’s — the phishing page simply cannot obtain a usable assertion.', 'lam') },
  { t: 'Not magic: the caveats', giua: true, body: two(
      box('Platform sync', 'passkeys ride iCloud / Google so a lost device is not a lockout — but your trust now includes that cloud account.', 'lam'),
      box('A resident passkey is the credential', 'on an unlocked, stolen device it is the whole thing — screen-lock and user verification (PIN/biometric) still matter.', 'do2')) +
      box('Passkeys remove phishing', 'they do not remove the need to protect the device.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A passkey is a key pair; the private half never leaves the device and only signs</li>
    <li>The server stores only the public key — a dump cannot impersonate anyone</li>
    <li>Two ceremonies; in both the authenticator signs over the requesting origin</li>
    <li>One line — expectedOrigin/expectedRPID — makes a phishing site’s relayed challenge unverifiable</li>
    <li>Next — 7.5: shipping passkeys — the tables, the routes, the migration</li></ul>` },
]);
