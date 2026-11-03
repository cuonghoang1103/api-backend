/** auth-12-3 — Chapter 12 · 12.3 "Toolbox" (04/11/2026). Slug auth-12-3-hop-do-nghe. Output = s12/_ma.mjs. */
import { lamDeck, js, sh, two, box, cards } from './_auth-chung.mjs';
import { CODE, OUT } from '../../content/courses/authentication/s12/_ma.mjs';
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const T = CODE.toolbox.split('\n');
const DECODE = clip(T.slice(T.findIndex((l) => l.includes('function decodeJwt')), T.findIndex((l) => l.includes('function cookieFlags'))).join('\n').trim(), 60);
export const deck = { key: 'auth-12-3', code: 'AUTH 12.3', title: 'The toolbox: answering the question yourself', sub: 'Decode a JWT, read a cookie, time a login — yourself' };
export const slides = lamDeck({ chuong: 'Chapter 12 — Diagnosis', bai: '12.3' }, [
  { cover: true, t: 'The toolbox: answering<br>the question yourself', sub: 'Chapter 12 · Lesson 12.3 — decode, inspect, time — no library, no backend team' },
  { t: 'Answer it yourself', giua: true, body: box('You do not need the backend team', 'to tell you what is inside a token or whether a cookie is set correctly — the answers are visible if you know where to look.', 'lam') +
      box('The toolbox turns "I think it is expired" into proof', 'a handful of tiny techniques, no libraries required — "it expired 50 seconds ago, here it is".', 'xanh') +
      box('Check, do not ask', 'the slow path is waiting for someone to tell you; the fast path is reading the token or the cookie yourself.', 'do2') },
  { t: 'Decode a JWT by hand', body: js(DECODE, { sm: true }) +
      box('base64url JSON in two readable parts', 'split on the dots, base64url-decode the header and payload, parse — the alg, kid, sub and exp are right there, no library.', 'xanh') +
      box('The token tells you what it claims', 'everything you need to diagnose a 401 is inside the two parts you just read.', 'lam') },
  { t: 'Read the expiry', body: sh(clip(OUT['123-toolbox'].split('\n').slice(2, 6).join('\n'), 64), { title: 'node demo12/toolbox.mjs', sm: true }) +
      box('The #1 "why 401?" is an expired token', 'decode the payload, compare exp to now: "EXPIRED 50s ago" is the whole answer, in two lines, without asking anyone.', 'lam') +
      box('The cookie inspector reads the four flags', 'straight from Set-Cookie — which answers most of the "works in Postman, fails in the browser" shape from 12.2.', 'xanh') },
  { t: 'Decode to diagnose, never to authorize', giua: true, body: box('Decoding is for READING, not deciding', 'anyone can base64url-decode a token and read its claims; the SIGNATURE is what makes a claim trustworthy (Ch4).', 'do2') +
      box('A tool that trusts a decoded sub', 'is the exact bug the "yeu" client had in Chapter 8 — reading a claim is not verifying it.', 'do2') +
      box('The server still checks the signature', 'before it believes anything. Decode to diagnose; verify to authorize. Keep the two apart.', 'lam') },
  { t: 'The rest of the kit', giua: true, body: cards([
      ['Inspect a cookie', 'read HttpOnly/Secure/__Host-/SameSite from Set-Cookie — answers "Postman works, browser fails"'],
      ['curl -i', 'the status and every header; -w "%{http_code}" for a script'],
      ['Time the login', 'real vs fake account — a consistent difference is an enumeration leak (Ch6)'],
      ['kid vs JWKS', 'a kid not in /.well-known/jwks.json is a botched rotation (11.2)'],
    ], 1) },
  { t: 'Reproduce small', giua: true, body: two(
      box('A curl, a two-line script, a test account', 'the best tool is a minimal reproduction in isolation — strip away everything that is not the fault.', 'xanh'),
      box('If you cannot reproduce it alone', 'you do not understand it yet. The toolbox exists to shrink a vague "login is broken" to a sentence you can check.', 'lam')) +
      box('A reproduced bug is a nearly-solved bug', 'once it is isolated, the fix is usually obvious; the work is in the isolation, not the patch.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A JWT is base64url JSON you can decode in two lines — read alg, kid, sub, exp</li>
    <li>The expiry answers most "why 401?" without asking anyone</li>
    <li>Decode to diagnose, never to authorize — only the verified signature is trust</li>
    <li>Inspect cookie flags, time logins, check kid against JWKS, reproduce small</li>
    <li>Next — 12.4: reviewing a codebase you did not write</li></ul>` },
]);
