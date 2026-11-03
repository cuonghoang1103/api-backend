/**
 * auth-04-5 — Authentication · Chapter 4 · Lesson 4.5 "Where to keep a token in the browser" (03/11/2026).
 * Slug bài: auth-4-5-cat-token-o-dau. Output = s04/_ma.mjs (Chromium 156). OWASP JWT / HTML5 storage.
 */
import { lamDeck, js, sh, two, box, cards, steps, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s04/_ma.mjs';

export const deck = { key: 'auth-04-5', code: 'AUTH 4.5', title: 'Where to keep a token in the browser', sub: 'localStorage vs memory vs HttpOnly — XSS or CSRF' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));

export const slides = lamDeck({ chuong: 'Chapter 4 — Tokens: JWT from the inside', bai: '4.5' }, [
  { cover: true, t: 'Where to keep a token<br>in the browser', sub: 'Chapter 4 · Lesson 4.5 — every place trades one attack for another' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Name the three places a browser can keep a token and the risk of each</li>
    <li>See, in real Chromium, what an injected script can and cannot read</li>
    <li>Why HttpOnly stops XSS theft but reintroduces CSRF</li>
    <li>A safe plan: short access token in memory, refresh token in an HttpOnly cookie</li>
    <li>Why a token must never go in a URL</li></ul>` },
  { t: 'Wallet, safe, or valet?', giua: true, body: cards([
      ['Wallet', 'easy to spend, a pickpocket lifts it — <b>localStorage</b>: any script reads it'],
      ['Safe', 'hard to steal, hard to spend on the move — <b>memory</b>: gone on refresh'],
      ['Valet who pays for you', 'convenient, but a con tricks the valet — <b>cookie</b>: the browser pays (CSRF)'],
    ], 3) + box('No pocket is simply safe', 'You do not pick a safe place; you pick which attack you can control.', 'lam') },
  { t: 'The injected script', giua: true, body: cards([
      ['An XSS bug', 'unescaped user content runs as script on your page'],
      ['A bad dependency', 'one compromised npm package in your bundle'],
      ['A rogue extension', 'the user installed something that reads every page'],
    ], 3) + box('It runs with the page’s full privileges', 'Any of these runs one line of someone else’s JavaScript on your page and reads whatever a script can reach. Plan your storage as if a script WILL run.', 'do2') +
      box('The question', 'LabFlow’s page keeps the same token in three places. Which of the three can the injected script touch?', 'lam') },
  { t: 'What it can and cannot read', body: sh(body('45-storage'), { title: 'node demo4/storage-xss.mjs (Chromium 156)', sm: true }) +
      box('HttpOnly is the one it cannot see', 'localStorage and the plain cookie are stolen; the HttpOnly cookie never appears in document.cookie. That is the whole security value of HttpOnly (3.2).', 'xanh') },
  { t: 'But HttpOnly brings CSRF back', giua: true, body: two(
      box('Put every token in a cookie?', 'Then the browser attaches it to <b>every</b> request to the origin by itself.', 'lam'),
      box('That is CSRF (Chapter 3)', 'Another site makes the user’s browser fire a request that carries the cookie.', 'do2')) +
      box('You are choosing the attack', 'A script reading the token, or another site spending it. Neither storage is free.', 'xanh') +
      box('The honest summary', 'localStorage: XSS. Plain cookie: XSS + CSRF. HttpOnly cookie: CSRF. Memory: safest from reading, but lost on refresh.', 'lam') },
  { t: 'The three places, side by side', body: `<table class="t"><tr><th>Where</th><th>Survives refresh?</th><th>Script can read?</th><th>Sent automatically?</th><th>Main risk</th></tr>
    <tr><td>${c('localStorage')}</td><td>yes</td><td><b>yes — any script</b></td><td>no</td><td>XSS reads and exfiltrates</td></tr>
    <tr><td>memory (a variable)</td><td>no</td><td>only the running page</td><td>no</td><td>gone on refresh; a later script can’t read the old one</td></tr>
    <tr><td>plain cookie</td><td>yes</td><td><b>yes</b></td><td>yes</td><td>XSS reads it AND CSRF spends it</td></tr>
    <tr><td>${c('HttpOnly')} cookie</td><td>yes</td><td><b>no</b></td><td>yes</td><td>CSRF — Chapter 3</td></tr></table>` },
  { t: 'A common safe pattern', giua: true, body: steps([
      '<b>Access token → memory</b>: a short (15-min) token in a JS variable, sent as Authorization: Bearer',
      '<b>Refresh token → HttpOnly cookie</b>, scoped to the refresh route only',
      'A later injected script can’t read a variable from a past load; it expires fast',
      'CSRF can reach only the one refresh endpoint, which gets the Chapter 3 defences',
    ]) + box('Short lifetimes do the rest', 'A JWT can’t be revoked instantly (4.3), so 15 min caps a stolen access token; the refresh token — which you CAN revoke — is the real control (Chapter 5).', 'lam') },
  { t: 'How LabFlow ID issues it', body: js(CODE.server04.split('\n').filter((l, i, a) => { const s = a.findIndex((x) => x.includes("app.post('/token'")); const e = a.findIndex((x) => x.includes("app.post('/me/email'")); return i >= s && i < e; }).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim(), { sm: true }) +
      box('Returned in the body, held in memory', 'The client keeps the access_token in a variable and attaches it as a bearer header — not localStorage. The refresh token (Chapter 5) is the part for an HttpOnly cookie.', 'xanh') },
  { t: 'Never in the URL', giua: true, body: box('A token in a URL leaks three ways', 'Browser history, server access logs, and the <b>Referer</b> sent to third parties (lesson 1.1, measured in Chromium 156). It is also trivially shareable by copy-paste.', 'do2') +
      box('Where it belongs', 'In the <b>Authorization</b> header or an HttpOnly cookie — never a query string, never a path segment.', 'xanh') +
      box('Scrub your own logs too', 'Even your access logs should not record tokens — strip Authorization headers, and never log full URLs that carry one.', 'lam') },
  { t: 'What LabFlow ID does', giua: true, body: cards([
      ['LabFlow ID session', 'a __Host- cookie (Chapter 3) — its own login'],
      ['Access token', 'in memory in the client, sent as a bearer header to LabFlow API'],
      ['Refresh token', 'an HttpOnly cookie (Chapter 5), with CSRF defence'],
    ], 3) + box('Each token where its attack is cheapest to defend', 'The session the browser manages; the access token short and in memory; the refresh token locked away but CSRF-guarded.', 'lam') +
      box('Why split them', 'The access token is low-value and short, so memory is fine; the refresh token is high-value and long, so it is locked in an HttpOnly cookie.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>No browser storage is simply safe: each trades a script reading the token for the browser sending it</li>
    <li>In real Chromium, an injected script steals a localStorage token and a plain cookie, not an HttpOnly one</li>
    <li>HttpOnly stops XSS theft but reintroduces CSRF — the token is sent automatically</li>
    <li>Pattern: short access token in memory, refresh token in an HttpOnly, path-scoped cookie; nothing in a URL</li>
    <li>Next — Chapter 5: refresh tokens, rotation and revocation</li></ul>` },
]);
