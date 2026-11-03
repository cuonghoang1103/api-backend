/**
 * auth-04-4 — Authentication · Chapter 4 · Lesson 4.4 "Keys, kid, JWKS, and rotating without downtime" (03/11/2026).
 * Slug bài: auth-4-4-khoa-va-jwks. Output = s04/_ma.mjs. RFC 7517 (JWK/JWKS) + RFC 8037 (EdDSA in JOSE).
 */
import { lamDeck, js, sh, two, box, cards, steps, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s04/_ma.mjs';

export const deck = { key: 'auth-04-4', code: 'AUTH 4.4', title: 'Keys, kid, JWKS, and rotating without downtime', sub: 'Private key signs, public JWKS verifies — EdDSA by default' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const K = CODE.keyring.split('\n');
const EDDSA = K.slice(K.findIndex((l) => l.includes('export function eddsa')), K.findIndex((l) => l.includes('export const newEd25519'))).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim();

export const slides = lamDeck({ chuong: 'Chapter 4 — Tokens: JWT from the inside', bai: '4.4' }, [
  { cover: true, t: 'Keys, kid, JWKS, and<br>rotating without downtime', sub: 'Chapter 4 · Lesson 4.4 — one issuer signs, a whole platform verifies' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Publish a JWKS of public keys and verify a token by its <b>kid</b></li>
    <li>Rotate a signing key with two keys live — signing no one out</li>
    <li>Recognise and block the <b>kid</b> path-traversal attack</li>
    <li>Choose an algorithm from real sign/verify numbers, and why EdDSA is the default</li>
    <li>Why a platform needs public-key signing, not a shared HMAC secret</li></ul>` },
  { t: 'A notary and a public specimen book', giua: true, body: cards([
      ['Private stamp', 'only the notary has it — only LabFlow ID can mint (the private key)'],
      ['Public register', 'a specimen of the mark, by key id — anyone can check (the JWKS)'],
      ['vs a shared stamp', 'a rubber stamp in an open drawer: anyone who checks can also forge (an HMAC secret)'],
    ], 3) + box('That is public-key signing', 'The register — listed by kid — is the JWKS. Verify with it; you cannot reproduce the stamp from the specimen.', 'lam') },
  { t: 'The public half, as a JWKS', giua: true, body: sh(body('44-jwks').split('\n').slice(0, 4).join('\n'), { title: 'GET /.well-known/jwks.json', sm: true }) +
      box('The key pair', 'The keyring entry holds an Ed25519 pair: the <b>private</b> key signs, the <b>public</b> key only verifies. We export just the public half.', 'lam') +
      box('No d field', 'kty OKP, crv Ed25519, a public x and the kid (RFC 8037). The private half never leaves LabFlow ID; the route sets Cache-Control so clients cache it.', 'xanh') },
  { t: 'Verify by kid, with jose', body: sh(body('44-jwks').split('\n').slice(4).join('\n'), { title: 'client verifies by kid', sm: true }) +
      box('kid picks the key', 'LabFlow API fetches the JWKS once and caches it, then matches each token’s kid to a JWK. A kid not in the set is rejected before any crypto runs.', 'xanh') },
  { t: 'Rotating a key without downtime', body: sh(body('44-rotate'), { title: 'node demo4/rotate.mjs', sm: true }) +
      box('Two keys live at once', 'Publish the new key, let clients refresh their JWKS cache, switch signing to it — and drop the old key only after every token it signed has expired.', 'lam') },
  { t: 'Drop the old key when its tokens are gone', giua: true, body: steps([
      'Day 1 — one key (ed-2026-10) signs and verifies',
      'Day 2 — publish ed-2026-11 in the JWKS, let clients refresh, then switch signing to it',
      'Both keys verify, so old-key tokens still work — <b>no one is signed out</b>',
      'Day 3 — 15 min later every old-key token has expired; remove ed-2026-10 ⇒ <b>UNKNOWN_KID</b>',
    ]) + box('This is why kid exists', 'A verifier can hold several keys and pick the right one per token.', 'lam') },
  { t: 'Trap: the kid is attacker input too', body: sh(body('44-kid'), { title: 'node demo4/kid-traversal.mjs', sm: true }) +
      box('kid as a path or a query', 'If kid selects a file (keys/&lt;kid&gt;) or a row, the attacker points it at content they know and HMAC-signs with those bytes. ' + c('kid') + ' is only a property on a fixed object ⇒ UNKNOWN_KID.', 'do2') },
  { t: 'Cross-check with jose', giua: true, body: sh(body('44-jose'), { title: 'node demo4/jose.mjs' }) +
      box('Interop is the point', 'A token we sign verifies in jose; a token jose signs verifies in ours. Both directions pass ⇒ LabFlow ID speaks the same JWS/JWT as any compliant client.', 'xanh') },
  { t: 'How fast, how big', body: `<table class="t"><tr><th>alg</th><th>sig bytes</th><th>sign/s</th><th>verify/s</th><th>note</th></tr>
    <tr><td>${c('HS256')}</td><td>32</td><td>~790,000</td><td>~780,000</td><td>fastest, but shared secret ⇒ every verifier can forge</td></tr>
    <tr><td>${c('EdDSA')}</td><td>64</td><td>~34,000</td><td>~11,900</td><td><b>the default</b>: small, no DER/curve traps</td></tr>
    <tr><td>${c('ES256')}</td><td>70</td><td>~48,500</td><td>~17,600</td><td>common; JOSE/DER gotchas</td></tr>
    <tr><td>${c('RS256')}</td><td>256</td><td>~1,760</td><td>~60,000</td><td>slow to sign, 256-byte signature</td></tr></table>` +
      box('Read verify, the hot path', 'Measured 3 rounds, macOS arm64, Node 22.23.3. Signing cost is tens of µs — nothing next to argon2 at login (~86 ms, Chapter 2).', 'lam') },
  { t: 'Why public-key for a platform', giua: true, body: two(
      box('Shared HMAC secret', 'Every service that verifies can also <b>forge</b>. Fine inside one service; fatal across a platform.', 'do2'),
      box('EdDSA key pair', 'Only LabFlow ID (the private key) can mint; every other service holds only the public key and can only check.', 'xanh')) +
      box('This is the groundwork for Chapter 8', 'LabFlow ID becomes an OpenID Connect provider and LabFlow API fetches exactly this JWKS.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Sign with a private key, verify with a public JWKS: only the issuer mints, everyone checks</li>
    <li>The JWKS is public keys by <b>kid</b> (OKP/Ed25519, no <b>d</b>); clients fetch and cache it</li>
    <li>Rotate with two keys live: publish, refresh, switch, drop after one token lifetime</li>
    <li>Never turn <b>kid</b> into a file path; it is a property on a fixed object, or UNKNOWN_KID</li>
    <li>Next — 4.5: where a browser should keep the token</li></ul>` },
]);
