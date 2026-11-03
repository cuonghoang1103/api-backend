/** auth-10-3 — Chapter 10 · 10.3 "Session theft" (04/11/2026). Slug auth-10-3-cap-phien. Output = s10/_ma.mjs. */
import { lamDeck, sh, two, box, cards } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s10/_ma.mjs';
const clip = (s, n = 64) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const MATRIX = clip(OUT['103-channels'].split('\n').slice(2, 8).join('\n'), 66);
export const deck = { key: 'auth-10-3', code: 'AUTH 10.3', title: 'Session theft: four channels, and what each one can reach', sub: 'A __Host- HttpOnly Secure cookie beats all four' };
export const slides = lamDeck({ chuong: 'Chapter 10 — The attacks, in order of frequency', bai: '10.3' }, [
  { cover: true, t: 'Session theft: four channels,<br>and what each one can reach', sub: 'Chapter 10 · Lesson 10.3 — a stolen session is you, with no login' },
  { t: 'The session is the prize', giua: true, body: box('After a relay or an XSS, the attacker wants your SESSION', 'not your password — a stolen session cookie IS you (Chapter 3), with no login to repeat.', 'do2') +
      box('No password, no second factor needed', 'the cookie is already an authenticated pass; the attacker just presents it.', 'lam') +
      box('So the practical question is placement', 'through which channels does a session token leak, and where can you keep it so none of them reach it?', 'xanh') },
  { t: 'The four channels', giua: true, body: cards([
      ['1 · XSS', 'injected JS reads localStorage or a non-HttpOnly cookie — HttpOnly closes it'],
      ['2 · The network', 'a token over plain HTTP is read on the wire — Secure + TLS closes it'],
      ['3 · The device', 'malware/shared machine reads tokens on disk — short TTL + binding shrink it'],
      ['4 · Logs & URLs', 'a token in a URL leaks to logs, history, Referer — cookies not URLs, redact'],
    ], 1) },
  { t: 'The matrix: where × what steals it', body: sh(MATRIX, { title: 'node demo10/session-channels.mjs', sm: true }) +
      box('The __Host- HttpOnly Secure cookie falls to NONE', 'a JS-readable cookie and localStorage fall to XSS; localStorage also sits on disk; a URL token leaks to logs.', 'lam') },
  { t: 'Why not localStorage', giua: true, body: box('The worst home for a session token', 'it is JavaScript-readable by design, so a SINGLE XSS anywhere on your origin exfiltrates it, and it persists on disk.', 'do2') +
      box('"Store the JWT in localStorage" is common advice', 'and a standing liability — one injected script reads it and sends it away.', 'do2') +
      box('The HttpOnly cookie is the opposite choice', 'unreadable by JavaScript precisely so an XSS cannot hand it over — that is the entire point of the flag.', 'xanh') },
  { t: 'Detect what you cannot prevent', giua: true, body: box('A compromised device WILL leak a token', 'you cannot block every theft — so detect the USE of a stolen session instead.', 'do2') +
      two(box('Bind + alert', 'tie the session to a device or IP range; alert when it suddenly appears from a new country.', 'xanh'),
          box('Let users revoke', 'the device list (Chapter 5) ends a stolen session — a token that only works on its own device is far less useful to a thief.', 'lam')) +
      box('Defence in depth for the session', 'you will not stop every theft, so make a stolen token short-lived, bound, visible and revocable — shrink the window, do not assume it is zero.', 'xanh') },
  { t: 'None of them needed the login', giua: true, body: box('Every one of these four channels bypasses the login entirely', 'none of them needed the password or the second factor — they take the cookie, not the credential.', 'do2') +
      box('Strong authentication guards the door', 'all the password hashing, MFA and OIDC in the world protect the front door; the session cookie is a window.', 'lam') +
      box('So storage and detection matter independently', 'of how strong your authentication is — where you keep the token is its own security decision.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A stolen session is full access with no login — none of the channels need the password</li>
    <li>Four channels: XSS (HttpOnly), network (Secure+TLS), device (TTL, binding), logs/URLs</li>
    <li>Keep the token in a __Host- HttpOnly Secure cookie — never localStorage</li>
    <li>Detect stolen-session use: binding, new-device alerts, a revoke list</li>
    <li>Next — 10.4: attacking the human</li></ul>` },
]);
