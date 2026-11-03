/** auth-10-2 — Chapter 10 · 10.2 "AiTM phishing" (04/11/2026). Slug auth-10-2-lua-dao. Output = s10/_ma.mjs. */
import { lamDeck, sh, two, box, cards } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s10/_ma.mjs';
const clip = (s, n = 62) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const RELAY = clip(OUT['102-relay'].split('\n').slice(2, 6).join('\n'), 64);
export const deck = { key: 'auth-10-2', code: 'AUTH 10.2', title: 'Phishing, and the kit that relays your real login page', sub: 'OTP is relayed; an origin-bound passkey is not' };
export const slides = lamDeck({ chuong: 'Chapter 10 — The attacks, in order of frequency', bai: '10.2' }, [
  { cover: true, t: 'Phishing, and the kit that<br>relays your real login page', sub: 'Chapter 10 · Lesson 10.2 — Adversary-in-the-Middle, and the one factor it cannot relay' },
  { t: 'Phishing grew up', giua: true, body: two(
      box('Old phishing showed a FAKE page', 'and hoped you typed your password into it — a copy you might notice was off.', 'lam'),
      box('Modern phishing is an AiTM relay', 'it shows your REAL login page, forwarded live from the real server, and steals the session that results.', 'do2')) +
      box('It defeats the password AND most second factors at once', 'which is exactly why "we have MFA" is not the same claim as "we are safe from phishing".', 'do2') +
      box('And it is sold as a service', 'the relay, the look-alike domains and session-cookie capture come built in — not a rare feat any more.', 'lam') },
  { t: 'How the relay works', giua: true, body: box('A reverse proxy on a look-alike domain', 'login.labflovv.example — every keystroke forwarded to the real LabFlow ID, every real page forwarded back.', 'lam') +
      box('You are on real TLS — to the attacker', 'the padlock is green; the connection is secure, just secure to the wrong party.', 'do2') +
      box('"Check the URL" fails', 'against a convincing punycode twin at 3am.', 'do2') },
  { t: 'A password is a replayable secret', giua: true, body: two(
      box('Whatever you send that is just a VALUE', 'a password, a TOTP code — the relay captures it and replays it verbatim to the real server.', 'do2'),
      box('The second factor does not help', 'the OTP is as replayable as the password; the relay forwards it in real time and keeps the session cookie it gets back.', 'do2')) +
      box('This is why OTP MFA is not phishing-resistant', 'every AiTM kit sold today relays TOTP, SMS and push-to-approve — it is the standard way MFA is bypassed.', 'lam') },
  { t: 'The one factor it cannot relay', giua: true, body: box('A passkey is not a replayable secret', 'the browser signs over the ORIGIN it is on — the phishing domain.', 'xanh') +
      box('The real server checks expectedOrigin', 'the assertion is signed for login.labflovv.example; LabFlow ID wants id.labflow.example ⇒ REJECTED.', 'xanh') +
      box('That is "phishing-resistant", concretely', 'a cryptographic property — origin binding — not a warning to be careful.', 'lam') },
  { t: 'The measured relay', body: sh(RELAY, { title: 'node demo10/relay.mjs', sm: true }) +
      box('password + TOTP stolen; passkey yields nothing', 'because its signature is bound to the phishing origin and the real server demands its own.', 'lam') +
      box('That is "phishing-resistant", concretely', 'not a warning to be careful — a cryptographic property that makes the credential useless on the wrong domain.', 'xanh') },
  { t: 'What else helps', giua: true, body: box('Not everyone has a passkey yet', 'so limit the damage of a session that still gets relayed — none of these stop the relay, they shrink its reach.', 'do2') +
      two(box('Short, device-bound sessions', 'short TTL with re-auth for sensitive actions; a token tied to a device is useless if relayed elsewhere.', 'xanh'),
          box('Alert on new devices / show WHERE', 'show where a login came from and alert on a new device — catch the sessions that slip through (10.3).', 'lam')) },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>AiTM phishing relays your real login and steals the session; it does not fake the page</li>
    <li>TLS and URL-checking do not stop it — real TLS to a look-alike domain</li>
    <li>OTP second factors are replayed; "we have MFA" is not "phishing-resistant"</li>
    <li>Only an origin-bound passkey survives — its signature is for the wrong domain</li>
    <li>Next — 10.3: once a session is stolen, by which channel?</li></ul>` },
]);
