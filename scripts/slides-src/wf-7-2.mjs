/** Web Foundations · deck bài 7.2 — Cookie và phiên. Output thật: _demo/_t7 (curl + app Node; Chromium: HttpOnly, CSRF Lax vs None). */
import { deckWf, js, con, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=\$ )/); return n.map((i) => p[i].trim()).join('\n\n'); };

export const deck = { key: 'wf-7-2', code: 'WF 7.2', title: 'Cookies and sessions', sub: 'Web Foundations · Chapter 7' };

export const slides = deckWf({ chuong: 'Chapter 7 — Authentication & security', bai: '7.2' }, [
  { cover: true, t: 'Cookies and sessions', sub: 'The server remembers you; a cookie reminds it who you are' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Follow a <b>session</b> from login to logout</li>
    <li>Read every attribute of <b>Set-Cookie</b></li>
    <li>Show why <b>HttpOnly</b> matters</li>
    <li>Log out so a copied cookie <b>stops working</b></li>
    <li>Explain how <b>SameSite</b> stops CSRF</li></ul>` },

  { t: 'The session flow', to: true, giua: true, body: steps([
      'POST /login — password checked',
      'Server saves <code class="i">{ userId, expires }</code> under a random id',
      '<code class="i">Set-Cookie: sid=…</code> — only the id leaves',
      'Browser sends <code class="i">Cookie: sid=…</code> on every request',
      'Server looks it up; logout deletes it',
    ]) + js('_t7/app.mjs', null, { gon: true, chi: [54, 59] }) },

  { t: 'Reading Set-Cookie', to: true, giua: true, body: tbl(['Attribute', 'Does'], [
      ['HttpOnly', 'JavaScript cannot read it'],
      ['SameSite=Lax', 'not sent on cross-site POST / fetch'],
      ['Path=/ · Max-Age=3600', 'where, and for how long'],
      ['Secure', 'HTTPS only (always in production)'],
      ['value', '32 random bytes — never Math.random()'],
    ]) + two(box('Production default', '<code class="i">HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=…</code>', 'ok'), box('Guessable id', '<code class="i">sid=1</code>, a timestamp, Math.random() — whoever guesses it IS the user.', 'bad')) },

  { t: 'The server log', giua: true, body: two(term(null, doan('_t7/out/session', 2, 3), { title: 'curl -c / -b' }), term('_t7/out/app-log', null, { title: 'node app.mjs' }), 'r55') },

  { t: 'HttpOnly in Chromium', giua: true, body: con('_t7/out/httponly', null, { title: 'a script on the page (XSS)' }) + two(box('HttpOnly cookie', 'used by the browser, invisible to scripts', 'ok'), box('localStorage', 'readable by every script on the page', 'bad')) },

  { t: 'Logging out for real', giua: true, body: term('_t7/out/logout', null, { title: 'curl' }) + box('The server holds the truth', 'Delete the record ⇒ even a copied cookie gets 401.', 'ok') },

  { t: 'CSRF, measured', giua: true, body: term('_t7/out/csrf', null, { title: 'Chromium · a page on another site posts a form' }) },

  { t: 'Cookie, localStorage, sessionStorage', to: true, giua: true, body: tbl(['', 'Cookie', 'localStorage', 'sessionStorage'], [
      ['sent to server', 'automatically', 'never', 'never'],
      ['readable by JS', 'not if HttpOnly', 'always', 'always'],
      ['lifetime', 'Max-Age', 'until deleted', 'until tab closes'],
      ['good for', 'session id', 'theme, drafts', 'one-tab state'],
    ]) + box('Login session', 'An HttpOnly cookie is the safer default: an XSS script can use the page, but cannot carry the session away.', 'ok') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Record on server + random id in a cookie</li>
    <li>HttpOnly; Secure; SameSite=Lax</li>
    <li>Logout deletes the record</li>
    <li>SameSite=None re-opens CSRF</li></ul>`,
    box('Practice (35 min)', 'Inspect sid in DevTools, reuse a cookie after logout, run the "prize" page with Lax and None.<br><br><b>Done when</b>: 401 after logout, no cookie on the cross-site POST with Lax.', 'ok')) },
]);
