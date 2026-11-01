/**
 * auth-01-4 — Authentication · Chapter 1 · Lesson 1.4 "Hash, MAC, signature: three tools, one confusion" (01/11/2026).
 * Slug bài: auth-1-4-bam-mac-chu-ky. Output = _ma.mjs của s01 (LabFlow ID chạy thật, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, steps, cards, c, vsd, req } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s01/_ma.mjs';

export const deck = { key: 'auth-01-4', code: 'AUTH 1.4', title: 'Hash, MAC, signature', sub: 'Three tools, one confusion' };

const rows = (k, from, to) => OUT[k].split('\n').slice(from, to).join('\n');
const cut = (s) => s.replace(/([0-9a-f]{20})[0-9a-f]{20,}/g, '$1…');

export const slides = lamDeck({ chuong: 'Chapter 1 — Credentials and primitives', bai: '1.4' }, [
  { cover: true, t: 'Hash, MAC, signature:<br>three tools, one confusion', sub: 'Chapter 1 · Lesson 1.4 — and two forgeries that work for real' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What a <b>hash</b>, a <b>MAC</b> and a <b>signature</b> each prove — and do not</li>
    <li>A real forgery of ${c('sha256(secret + message)')} — and why HMAC stops it</li>
    <li>Why one <b>shared HMAC key</b> turns every verifier into an issuer</li>
    <li>Encryption without a tag lets an attacker <b>edit</b> what they cannot read</li>
    <li>LabFlow ID’s ${c('signValue')}: a value + expiry + key id + HMAC</li></ul>` },
  { t: 'Fingerprint, wax seal, notary seal', body: cards([
      ['Hash = fingerprint', 'Anyone can take one. Says “same bytes” — but a forger can fingerprint the forgery too.'],
      ['MAC = shared wax seal', 'Only stamp holders can make it — but any of them could have.'],
      ['Signature = notary seal', 'Only the notary holds the stamp; anyone compares it with the public specimen.'],
    ], 3) + `<table class="t"><tr><th>Tool</th><th>Who can MAKE it</th><th>Who can CHECK it</th></tr>
    <tr><td>SHA-256</td><td>anyone</td><td>anyone</td></tr>
    <tr><td>HMAC-SHA256</td><td>every key holder</td><td>every key holder</td></tr>
    <tr><td>Ed25519</td><td>only the private key</td><td>anyone with the public key</td></tr></table>` },
  { t: 'One message, three tools — real output', body: sh(cut(OUT['14-ba-cong-cu']), { title: 'node demo1/three-tools.mjs' }) +
      two(box('Hash', 'One character changed ⇒ a totally different digest — and the attacker can compute it too.', 'lam'),
        box('Signature', `The public key verifies but <b>cannot sign</b>: ${c('ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE')}.`, 'xanh')) },
  { t: 'Why sha256(secret + message) breaks', body: steps([
      'SHA-256 eats data in <b>64-byte blocks</b> and keeps an internal state',
      'The digest <b>is</b> that state after the last block (+ padding)',
      'Load a digest back as the state ⇒ keep hashing <b>extra</b> data',
      'Result: a valid tag for secret + message + padding + extra — <b>without the secret</b>',
    ]) + two(box('Vulnerable', 'MD5, SHA-1, SHA-256 (Merkle–Damgård) used as hash(key + message).', 'do2'),
      box('Not vulnerable', `HMAC (RFC 2104): ${c('H(K⊕opad, H(K⊕ipad, m))')} — the outer hash hides the inner state.`, 'xanh')) },
  { t: 'The forgery, for real', body: js(`const extra = Buffer.from('&role=LAB_MANAGER');
const forged = Buffer.concat([msg, padding(SECRET.length + msg.length), extra]);
// continue SHA-256 from the old tag — no secret needed
const forgedTag = sha256(extra, tag, SECRET.length + msg.length + padLen);`, { sm: true, hl: [4] }) +
      sh(rows('14-noi-dai', 0, 6), { title: 'node demo1/length-extension.mjs' }) +
      box('An is now a lab manager', `${c('URLSearchParams')} keeps the <b>last</b> ${c('role=')}. Key length unknown? Try 1…64 — the practice finds 18 bytes on try 18.`, 'do2') },
  { t: 'One shared key: whoever checks can forge', body: sh(OUT['14-khoa-chung'], { title: 'node demo1/shared-key.mjs' }) +
      vsd('<p>LabFlow ID and billing share one HMAC key. Billing minted <b>role: LAB_MANAGER</b> and it checks out like a real token.</p>',
        '<p>LabFlow ID keeps the Ed25519 <b>private</b> key; billing gets the public key: it verifies, cannot sign, cannot reuse a signature.</p>',
        '✗ A · shared HMAC key', '✓ B · Ed25519 key pair') },
  { t: 'Choosing keys when several services verify', to: true, body: `<table class="t"><tr><th>Situation</th><th>Choose</th></tr>
    <tr><td>One service issues <b>and</b> verifies (LabFlow ID’s own cookies)</td><td>HMAC — HS256</td></tr>
    <tr><td>Other services verify but must not issue</td><td>Signatures: Ed25519 → ES256 → RS256</td></tr>
    <tr><td>Third parties verify (OIDC clients, Chapter 8)</td><td>Signatures + public keys as a JWKS URL (Chapter 4)</td></tr></table>` +
      box('Rule of thumb', 'With a symmetric key, “verify only” does not exist. The day a second service verifies, switch to a key pair.', 'lam') },
  { t: 'Encryption is not a seal', body: sh(OUT['14-ma-hoa'], { title: 'node demo1/encrypt-not-protect.mjs' }) +
      two(box('AES-CTR: editable', `ciphertext = plaintext ⊕ keystream. XOR ${c('"false"⊕"true "')} into it ⇒ the server reads ${c('admin = true')} — key never known.`, 'do2'),
        box('AES-GCM: authenticated', `An auth tag: ${c('decipher.final()')} throws on any change. Never encrypt without authenticating.`, 'xanh')) },
  { t: 'LabFlow ID’s signValue: value · exp · kid · sig', body: req([
      ['dXNyXzF8U1RVREVOVA', 'the value, <b>base64url</b> (“usr_1|STUDENT”) — dots inside are safe'],
      ['1793513700', 'expiry, Unix seconds — <b>checked after</b> the signature'],
      ['k1', '<b>key id</b>: which key signed it ⇒ rotation (Chapter 11)'],
      ['txyDfib_FlLrl8xo…', 'HMAC-SHA256 of the first three parts'],
    ]) + sh(rows('14-ky-gia-tri', 2, 8), { title: 'node demo1/signed-demo.mjs' }) },
  { t: 'Which tool for which question', body: steps([
      'A random token on file? Store its <b>SHA-256</b>, look it up (1.3)',
      'Your own value, your own check? <b>HMAC</b> — ' + c('signValue'),
      'Others must check but not issue? <b>Signature</b>, public key published',
      'Client must not READ it? <b>AEAD</b> (AES-GCM) — after asking if they need it at all',
    ]) + box('None of them hides anything except AEAD', 'A signed JWT is readable by whoever holds it — never put secrets inside (Chapter 4).', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Hash = same bytes · MAC = a key holder made it · signature = this private key made it</li>
    <li>${c('sha256(secret + msg)')} was forged for real; HMAC refused</li>
    <li>Shared HMAC key ⇒ every verifier can issue; use key pairs</li>
    <li>Encrypt with a tag (GCM) or not at all</li>
    <li>Next — 1.5: where secrets leak without anyone attacking</li></ul>` },
]);
