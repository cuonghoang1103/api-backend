/**
 * auth-04-2 — Authentication · Chapter 4 · Lesson 4.2 "The token tells the server how to check it" (03/11/2026).
 * Slug bài: auth-4-2-truong-alg. Output = s04/_ma.mjs. RFC 8725 (BCP 225) + OWASP JWT Cheat Sheet.
 */
import { lamDeck, js, sh, two, box, cards, steps, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s04/_ma.mjs';

export const deck = { key: 'auth-04-2', code: 'AUTH 4.2', title: 'The token tells the server how to check it', sub: 'alg: none, HS/RS confusion — take the algorithm from the key' };
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const V = CODE.verify.split('\n');
const ALG = V.slice(V.findIndex((l) => l.includes('1) ALGORITHM')) + 1, V.findIndex((l) => l.includes('2) SIGNATURE'))).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 4 — Tokens: JWT from the inside', bai: '4.2' }, [
  { cover: true, t: 'The token tells the server<br>how to check it', sub: 'Chapter 4 · Lesson 4.2 — alg: none and algorithm confusion, and the one rule that stops both' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Carry out the <b>alg: none</b> forgery and the <b>HS/RS confusion</b> forgery</li>
    <li>See both take over Cô Lan’s account against a naive verifier</li>
    <li>The one rule: take the algorithm from the <b>key</b> you look up by kid, never the header</li>
    <li>The order of checks: kid → alg → signature → claims</li>
    <li>What RFC 8725 and OWASP say about header-chosen algorithms</li></ul>` },
  { t: 'Who decides the lock on the door?', giua: true, body: cards([
      ['The visitor’s note', '“use the paper lock,” or “use the lock whose key is on this public poster”'],
      ['A careless guard', 'obeys the note — the token chooses how it is verified'],
      ['The fix', 'the <b>building</b> decides the lock, not the visitor — the key decides the algorithm'],
    ], 3) + box('alg is that note', 'A JWT’s <b>alg</b> header is attacker-writable. A safe verifier ignores it and uses the lock the building chose for that door (the key under that kid).', 'lam') +
      box('Why it matters', 'Two of the most-exploited JWT bugs — still found in audits years later — are nothing but a verifier obeying the note.', 'do2') },
  { t: 'The naive verifier — the habit both attacks exploit', body: js(CODE.naive.replace(/^\/\/.*\n/gm, '').replace(/ *\/\/ .*$/gm, '').replace(/^\s*\n/gm, '').trim(), { sm: true, hl: [6] }) },
  { t: 'Attack 1 — alg: none', body: sh(body('42-none'), { title: 'node demo4/alg-none.mjs', sm: true }) +
      box('No key at all', 'Set alg to none, drop the signature. The naive verifier returns the claims ⇒ account takeover. LabFlow ID: the kid is an EdDSA key, none ≠ EdDSA ⇒ <b>ALG_MISMATCH</b>.', 'xanh') },
  { t: 'Attack 2 — algorithm confusion', body: sh(body('42-confusion'), { title: 'node demo4/confusion.mjs', sm: true }) +
      box('The public key becomes a secret', 'LabFlow ID verifies EdDSA with a public key published in the JWKS. HMAC-sign HS256 with that public key and a header-trusting verifier matches it (CVE-2015-9235). Ours: <b>ALG_MISMATCH</b>.', 'xanh') },
  { t: 'One rule kills both', giua: true, body: js(ALG, { sm: true }) +
      box('Algorithm from the key, not the token', 'No kid ⇒ NO_KID; unknown kid ⇒ UNKNOWN_KID; header alg ≠ key alg ⇒ ALG_MISMATCH. Only a key we hold, used with its own algorithm, reaches the signature check.', 'xanh') },
  { t: 'The order of the checks', giua: true, body: steps([
      'Look the <b>kid</b> up in the keyring — missing/unknown ⇒ reject (never a file path, 4.4)',
      '<b>alg</b> from the key: header.alg must equal key.alg ⇒ else ALG_MISMATCH',
      '<b>signature</b>: verify with that key, before any claim is read',
      '<b>claims</b>: only now is the payload trustworthy (4.3)',
    ]) + box('Case tricks die here too', c('None') + ', ' + c('nOnE') + ' — none of them equals ' + c('EdDSA') + '.', 'lam') },
  { t: 'What the standard says', giua: true, body: two(
      box('RFC 8725 — JWT BCP (BCP 225)', '§3.1 the caller MUST specify a supported set of algorithms; bind each key to exactly one. §2.1 names both attacks.', 'lam'),
      box('OWASP — JWT Cheat Sheet', 'A relying party “must not rely on the information of the JWT header to select the verification algorithm.” Hardcode the algorithms; never mix MAC and public-key.', 'lam')) +
      box('In one line', 'Pass an <b>allow-list you decided in advance</b> (algorithms: [‘EdDSA’]); one key, one algorithm.', 'xanh') },
  { t: 'Trap: accept a list, not whatever arrives', giua: true, body: box('A good library is not enough', 'Even a correct, modern JWT library is unsafe if you call verify(token, key) and let it read alg from the header.', 'do2') +
      box('Do this instead', 'Always pass an explicit <b>algorithms</b> allow-list, and never register one key for both a public-key algorithm and HMAC. That is exactly what LabFlow ID’s keyring enforces: one entry, one alg.', 'xanh') +
      box('The call site is the control', 'The library is not what makes you safe — how you call it is. A safe library called unsafely still falls to both forgeries.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>The header’s <b>alg</b> is attacker input; never pick the verification algorithm from it</li>
    <li><b>alg: none</b> drops the signature; a header-trusting verifier accepts an unsigned forgery</li>
    <li><b>HS/RS confusion</b> HMAC-signs with the server’s public key; a header-trusting verifier matches it</li>
    <li>One rule: look up the kid, take the algorithm from the key, reject on <b>ALG_MISMATCH</b></li>
    <li>Next — 4.3: the seven claims, and the attack for each you skip</li></ul>` },
]);
