/** Web Foundations · deck bài 7.3 — JWT. Output thật: _demo/_t7/jwt-tay.mjs (đồng hồ cố định). */
import { deckWf, js, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const dong = (key, a, b) => OUT[key].split('\n').slice(a - 1, b).join('\n');

export const deck = { key: 'wf-7-3', code: 'WF 7.3', title: 'JSON Web Tokens', sub: 'Web Foundations · Chapter 7' };

export const slides = deckWf({ chuong: 'Chapter 7 — Authentication & security', bai: '7.3' }, [
  { cover: true, t: 'JSON Web Tokens', sub: 'A token that carries its own proof' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Read the <b>three parts</b> of a JWT</li>
    <li>Say what the <b>signature</b> protects — and hides</li>
    <li>Verify a token <b>correctly</b></li>
    <li>Spot <b>forged</b> and <b>alg none</b> tokens</li>
    <li>Choose between <b>sessions</b> and <b>tokens</b></li></ul>` },

  { t: 'Three parts, two dots', giua: true, body: term(null, dong('_t7/out/jwt-tay', 1, 5), { title: 'node jwt-tay.mjs' }) + tbl(['Part', 'Holds'], [['header', '{"alg":"HS256","typ":"JWT"}'], ['payload', 'sub, name, role, iat, exp'], ['signature', 'HMAC(header.payload, secret)']]) },

  { t: 'Anyone can read it', giua: true, body: term(null, dong('_t7/out/jwt-tay', 7, 7), { title: 'no secret needed' }) + tbl(['Claim', 'Meaning'], [['sub', 'subject — the user id'], ['role', 'your own claim'], ['iat / exp', 'issued at / expires (seconds since 1970)']]) + two(box('Signed, not encrypted', 'Never put passwords, card numbers or private data in a payload.', 'bad'), box('Try it', 'In any console: <code class="i">JSON.parse(atob(t.split(\'.\')[1]))</code>', 'info')) },

  { t: 'The signature catches changes', giua: true, body: js('_t7/jwt-tay.mjs', null, { gon: true, chi: [21, 32] }) + term(null, dong('_t7/out/jwt-tay', 9, 12), { title: 'verify' }) },

  { t: 'The library does the same', giua: true, body: term(null, dong('_t7/out/jwt-tay', 14, 16), { title: 'jsonwebtoken' }) + box('Configure it safely', 'verify(…, { algorithms: [\'HS256\'] }) · sign(…, { expiresIn }) · a 32-byte random secret from an env variable', 'ok') + two(box('Weak secret', '<code class="i">secret123</code> can be brute-forced offline from one captured token.', 'bad'), box('Leaked secret', 'Anyone can mint admin tokens. Rotate it — everyone is logged out.', 'bad')) },

  { t: 'Bearer, and the logout problem', giua: true, body: term(null, dong('_t7/out/jwt-tay', 18, 21), { title: 'Authorization: Bearer …' }) + box('Nothing to delete', 'The server keeps no record: a copied token works until exp. Keep access tokens short; revoke a refresh token.', 'bad') },

  { t: 'Sessions or tokens?', to: true, giua: true, body: tbl(['', 'Session', 'JWT'], [
      ['truth lives', 'server', 'in the token'],
      ['per request', 'one lookup', 'verify signature'],
      ['log out now', 'instant', 'wait for exp'],
      ['size', '~43 chars', '150–1000 chars'],
      ['default for', 'websites', 'APIs, many services'],
    ]) + box('In a browser', 'JWT in localStorage = readable by XSS and not revocable. Prefer an HttpOnly session — or access token in memory + refresh token in an HttpOnly cookie.', 'bad') },

  { t: 'Summary & practice', to: true, giua: true, body: two(steps(['Fix the algorithm', 'Recompute the signature', 'Check exp', 'Then authorize']),
    box('Practice (30 min)', 'Decode a token in the console, break its signature, expire it, add requireRole.<br><br><b>Done when</b>: forged and expired → 401, An → 403 for admin.', 'ok')) },
]);
