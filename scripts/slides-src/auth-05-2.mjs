/**
 * auth-05-2 — Authentication · Chapter 5 · Lesson 5.2 "Rotation, and the reuse that gives the thief away" (03/11/2026).
 * Slug bài: auth-5-2-xoay-vong. Output = s05/_ma.mjs. RFC 9700 (BCP 240) + OWASP.
 */
import { lamDeck, js, sh, two, box, cards, steps, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s05/_ma.mjs';

export const deck = { key: 'auth-05-2', code: 'AUTH 5.2', title: 'Rotation, and the reuse that gives the thief away', sub: 'Single-use refresh tokens; a reused one means theft ⇒ revoke the family' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const L = CODE.layer.split('\n');
const ROTATE = L.slice(L.findIndex((l) => l.includes('async function rotate')), L.findIndex((l) => l.includes('const revokeFamily ='))).join('\n').replace(/^\s*\/\/.*$/gm, '').replace(/ +\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 5 — Refresh, rotation and revocation', bai: '5.2' }, [
  { cover: true, t: 'Rotation, and the reuse<br>that gives the thief away', sub: 'Chapter 5 · Lesson 5.2 — single-use refresh tokens, and reuse detection' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Rotate a refresh token on every use, in a family keyed to one login</li>
    <li>Detect reuse of a rotated token and explain why it means theft</li>
    <li>Revoke the whole family on reuse — and why the real user is signed out too</li>
    <li>The RFC 9700 rule: a rotated token’s reuse must invalidate the chain</li>
    <li>Why rotation and detection only work together</li></ul>` },
  { t: 'A cheque book, one stub at a time', giua: true, body: cards([
      ['Each cheque', 'good once; writing one makes the next current and voids the last'],
      ['A void cheque clears', 'impossible on the honest path ⇒ someone copied your book'],
      ['The bank', 'does not just bounce it — it <b>freezes the account</b>'],
    ], 3) + box('The refresh family is the cheque book', 'Rotation voids each token as it is used; a voided token clearing is reuse, and the response is to freeze the family.', 'lam') +
      box('Why single-use', 'A long-lived token is the one worth stealing. Making it single-use means a copy betrays itself the moment it is used — there is no way to use it quietly.', 'xanh') },
  { t: 'Rotation: single-use, in a family', body: js(ROTATE, { sm: true, hl: [9, 10, 11, 12] }) },
  { t: 'The chain in the table', body: sh(body('52-rotate-reuse').split('\n').slice(0, 7).join('\n'), { title: 'node demo5/rotate-reuse.mjs — after two refreshes', sm: true }) +
      box('r0, r1 used · r2 live', 'The server accepts only the one token whose <b>used</b> flag is still empty. The chain is three rows, one family.', 'xanh') },
  { t: 'A thief replays an old token', body: sh(body('52-rotate-reuse').split('\n').slice(8, 16).join('\n'), { title: '… the attacker replays r0', sm: true }) +
      box('An impossible event', 'A token already marked <b>used</b> comes back — which never happens on the legitimate path. So it is treated as theft.', 'do2') },
  { t: 'Reuse ⇒ revoke the whole family', giua: true, body: steps([
      'The current token is used ⇒ mark it used, mint the next in the family',
      'An already-used token comes back (after grace) ⇒ a copy is loose',
      'Every token of the family is revoked — <b>including the live one</b>',
      'The real user re-authenticates; the thief cannot',
    ]) + box('REUSE_DETECTED', 'Not “that token is stale” but “revoke everything”. An’s next real refresh returns REVOKED.', 'do2') },
  { t: 'Why sign the real user out too', giua: true, body: two(
      box('Two copies exist', 'The user’s and a thief’s. You cannot tell which one just arrived.', 'lam'),
      box('Letting either continue', 'might keep the attacker signed in. Only ending both is safe.', 'do2')) +
      box('The cost, and why it is rare', 'A legitimate user is logged out of that device — but only when a rotated token is genuinely replayed. Rare, and the only safe call.', 'xanh') +
      box('Shorten the pain', 'The leftover access token lingers at most 15 minutes (5.3); after that the family is fully gone and only a real sign-in brings it back.', 'lam') },
  { t: 'What the standard says', giua: true, body: two(
      box('RFC 9700 (BCP 240) §2.2.2 / §4.14', 'A public client’s refresh token MUST be sender-constrained or rotated; a rotated token’s reuse must invalidate the chain.', 'lam'),
      box('OWASP — Session Cheat Sheet', 'Rotate, detect reuse, treat a replay as compromise, and revoke the related tokens.', 'lam')) +
      box('This is that path', 'LabFlow ID rotates every refresh and revokes the family on reuse — the reuse-detection half of the two options.', 'xanh') +
      box('The other option', 'Sender-constraining (binding the token to a key or mTLS) is Chapter 8 territory; detection is the simpler, common path.', 'lam') },
  { t: 'Trap: rotation without detection, or detection without rotation', giua: true, body: box('Rotate but accept an old token anyway', 'is theatre: a stolen token still works for 30 days.', 'do2') +
      box('Detect reuse without rotation', 'is impossible: there is no “already used” state to notice.', 'do2') +
      box('They only work together', 'single-use tokens, and a reused one meaning theft.', 'xanh') +
      box('The half-built system', 'Rotation without detection is the most common refresh bug — it looks secure and is not.', 'do2') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Rotation makes each refresh token single-use: mark used, record the successor, mint the next</li>
    <li>A token that comes back after it was rotated (outside grace) is reuse — a copy is loose</li>
    <li>Reuse revokes the <b>whole family</b>, including the live token</li>
    <li>You cannot tell the user’s copy from the thief’s, so ending the family is the only safe response</li>
    <li>Next — 5.3: five events that end a session</li></ul>` },
]);
