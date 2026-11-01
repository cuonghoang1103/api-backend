/**
 * auth-03-2 — Authentication · Chapter 3 · Lesson 3.2 "Every cookie attribute, and what it actually stops" (01/11/2026).
 * Slug bài: auth-3-2-thuoc-tinh-cookie. Output = s03/_ma.mjs (Chromium 156.0.8078.4 qua Playwright 1.64.1, env -i).
 */
import { lamDeck, sh, two, box, cards, steps, c, req } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s03/_ma.mjs';

export const deck = { key: 'auth-03-2', code: 'AUTH 3.2', title: 'Every cookie attribute, and what it actually stops', sub: 'Measured in real Chromium 156' };
const body = (k) => OUT[k].split('\n').slice(1).join('\n');
const SS = OUT['32-samesite'].split('\n').slice(1);

export const slides = lamDeck({ chuong: 'Chapter 3 — Sessions and cookies', bai: '3.2' }, [
  { cover: true, t: 'Every cookie attribute,<br>and what it actually stops', sub: 'Chapter 3 · Lesson 3.2 — measured in real Chromium 156' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Read a ${c('Set-Cookie')} line attribute by attribute</li>
    <li>What Chromium 156 accepts, hides from scripts, and sends back</li>
    <li>The ${c('__Host-')} prefix: three rules the browser enforces for you</li>
    <li>SameSite, re-measured: who sends the cookie on a cross-site request</li>
    <li>What HttpOnly does <b>not</b> stop</li></ul>` },
  { t: 'A wristband at a festival', body: cards([
      ['Who sees it', 'staff check it at every gate — but you cannot peel it off and hand it over (<b>HttpOnly</b>: scripts cannot read it)'],
      ['Where it works', 'only at <b>this</b> festival, not at the one next door (<b>no Domain</b>, <b>SameSite</b>)'],
      ['How it travels', 'only through the guarded entrance (<b>Secure</b>: HTTPS only)'],
    ], 3) + box('Each attribute stops one thing', 'and none of them stops everything. This lesson measures which is which in a real browser instead of trusting a blog table.', 'lam') },
  { t: 'LabFlow ID’s session cookie, line by line', body: req([
      ['Set-Cookie: __Host-lfid_ses=lfid_ses_…', 'the prefix makes the browser enforce Secure + Path=/ + no Domain'],
      ['; Path=/', 'sent to every path of this host'],
      ['; HttpOnly', '<code>document.cookie</code> cannot see it'],
      ['; Secure', 'HTTPS only (Chromium treats <code>http://localhost</code> as secure for development)'],
      ['; SameSite=Lax', 'not sent on cross-site POST, fetch or images'],
      ['; Max-Age=43200', 'the browser forgets it after 12 h — the server checks on its own (3.1)'],
    ]) },
  { t: 'What Chromium 156 does with each Set-Cookie', body: sh(body('32-cookies'), { title: 'node demo3/cookie-matrix.mjs  (origin http://localhost:4802)', sm: true }) +
      cards([
        ['HttpOnly', 'stored and sent, <b>invisible</b> to scripts'],
        ['__Host- broken', 'no Secure, a Domain, or Path ≠ / ⇒ <b>silently dropped</b>'],
        ['Delete trap', 'Max-Age=0 without the original Path deletes <b>nothing</b>'],
      ], 3) },
  { t: '__Host-: the browser enforces three rules', body: two(steps([
      'must have <b>Secure</b>',
      'must have <b>Path=/</b>',
      'must <b>not</b> have Domain ⇒ only this exact host',
    ]), box('Why it matters', 'A compromised or user-content subdomain (<code>blog.labflow.example</code>) cannot set or overwrite <code>__Host-lfid_ses</code> for the main site — cookie tossing, the usual way to plant a session (3.3), is closed by the browser.', 'xanh')) +
      box('No error anywhere', 'A broken __Host- cookie is not an error in the console or the response — it is just not there. Always check the browser’s cookie jar, as the matrix did.', 'do2') },
  { t: 'SameSite, re-measured on Chromium 156', body: sh(SS.join('\n'), { title: 'node demo3/samesite.mjs  (site localhost:4802, attacker 127.0.0.1:4801)', sm: true }) },
  { t: 'Reading the SameSite run', body: `<table class="t"><tr><th>Cookie</th><th>cross-site link</th><th>cross-site form POST</th><th>img / fetch</th></tr>
    <tr><td>Strict</td><td>no</td><td>no</td><td>no</td></tr>
    <tr><td>Lax</td><td><b>yes</b></td><td>no</td><td>no</td></tr>
    <tr><td>None; Secure</td><td>yes</td><td><b>yes</b></td><td><b>yes</b></td></tr>
    <tr><td>(not set)</td><td>yes</td><td><b>yes for 2 min</b>, then no</td><td>no</td></tr></table>` +
      box('Node.js 8.4 saw the same POST rows on Chromium 149', 'Re-measured here on 156: Lax blocks the cross-site POST; a cookie without SameSite still rides along for its first 2 minutes. Set SameSite explicitly — and still add a CSRF check (3.4).', 'lam') },
  { t: 'HttpOnly stops reading, not using', body: sh(body('32-xss'), { title: 'node demo3/httponly-xss.mjs  (script injected into a LabFlow ID page)' }) +
      two(box('What HttpOnly bought', c('document.cookie') + ' is <b>""</b>: the token cannot be copied out and used later from another machine.', 'xanh'),
        box('What it did not', 'The same script changed An’s email with a same-origin fetch — the browser attached the cookie. An XSS is game over while it runs; fix the XSS.', 'do2')) },
  { t: 'Trap: Domain= “so the cookie works on subdomains”', body: two(steps([
      c('Domain=labflow.example') + ' sends the session to <b>every</b> subdomain',
      'One forgotten ' + c('test.labflow.example') + ' (or a takeover) reads every session',
      'Without Domain the cookie is host-only — the default is the safe one',
    ]), box('Need SSO across subdomains?', 'That is a real requirement — solve it with a proper sign-in flow (Chapter 8, OIDC), not by widening a session cookie.', 'lam')) },
  { t: 'What each attribute stops — and does not', body: `<table class="t"><tr><th>Attribute</th><th>Stops</th><th>Does not stop</th></tr>
    <tr><td>HttpOnly</td><td>a script copying the token out</td><td>a script <b>using</b> it in place (XSS)</td></tr>
    <tr><td>Secure</td><td>the cookie on plain HTTP (sniffing)</td><td>anything once the page is HTTPS</td></tr>
    <tr><td>SameSite=Lax</td><td>cross-site POST / fetch / images</td><td>top-level GET; same-site subdomains</td></tr>
    <tr><td>__Host- (no Domain)</td><td>subdomains setting or reading it</td><td>XSS on the host itself</td></tr>
    <tr><td>Max-Age</td><td>the browser keeping it forever</td><td>a copied cookie (server must check)</td></tr></table>` },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>${c('__Host-lfid_ses=…; Path=/; HttpOnly; Secure; SameSite=Lax')} — every part justified</li>
    <li>Broken ${c('__Host-')} cookies are dropped <b>silently</b>; deleting needs the same Path</li>
    <li>SameSite on Chromium 156 = 149: Lax blocks cross-site POST; unset ⇒ 2-minute window</li>
    <li>HttpOnly stops theft, not use — XSS still wins</li>
    <li>Next — 3.3: a new session at every privilege change</li></ul>` },
]);
