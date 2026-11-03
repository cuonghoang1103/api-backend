/**
 * auth-07-5 — Authentication · Chapter 7 · Lesson 7.5 "Shipping passkeys: the tables, the two ceremonies, the migration" (04/11/2026).
 * Slug bài: auth-7-5-trien-khai-passkey. Output = s07/_ma.mjs.
 */
import { lamDeck, js, sql, two, box, cards, c } from './_auth-chung.mjs';
import { CODE } from '../../content/courses/authentication/s07/_ma.mjs';

const S = CODE.sql005.split('\n');
const TBL = S.slice(S.findIndex((l) => l.includes('CREATE TABLE passkeys')), S.findIndex((l) => l.includes('created_at   timestamptz')) + 1).join('\n') + '\n  …\n);';
export const deck = { key: 'auth-07-5', code: 'AUTH 7.5', title: 'Shipping passkeys: the tables, the two ceremonies, the migration', sub: 'One row per authenticator · four routes · a counter · a gradual migration' };

export const slides = lamDeck({ chuong: 'Chapter 7 — The second factor, and passkeys', bai: '7.5' }, [
  { cover: true, t: 'Shipping passkeys:<br>tables, ceremonies, migration', sub: 'Chapter 7 · Lesson 7.5 — how passkeys live in a real system' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The passkeys table: credential id, public key, counter, transports</li>
    <li>The four routes for the two ceremonies</li>
    <li>A server-made, one-shot challenge — freshness is half the security</li>
    <li>The signature counter as clone detection</li>
    <li>A password → passkey migration that always keeps a recovery path</li></ul>` },
  { t: 'One row per authenticator', body: sql(TBL, { sm: true }) +
      two(box('Many passkeys per user', 'a phone, a laptop, a hardware key in a drawer — each is one row, keyed by the credential id (the primary key) you look up at login.', 'xanh'),
          box('What you store', 'the public key, a signature counter, and the transports — nothing that can be replayed. The private key is never in your database.', 'lam')) +
      box('ON DELETE CASCADE', 'the row references users(id) with a cascade — deleting an account (6.5) takes its passkeys with it, so no orphaned credentials survive.', 'lam') },
  { t: 'Two ceremonies, four routes', giua: true, body: cards([
      ['register/options', 'server mints a challenge; the authenticator will make a key pair'],
      ['register/verify', 'verify + store the public key, counter, transports'],
      ['auth/options', 'a fresh challenge + the user’s allowed credentials'],
      ['auth/verify', 'check the signature against the stored public key; return who it was'],
    ], 2) + box('Library parses, you decide policy', 'the library handles CBOR/COSE/attestation; LabFlow ID owns the two things it must not — the challenge store and the origin policy.', 'lam') },
  { t: 'The challenge: server-made and one-shot', giua: true, body: two(
      box('Minted per options call', 'each options call generates a fresh random challenge, stored server-side; the matching verify checks exactly that one, then discards it.', 'xanh'),
      box('Never client-chosen or reused', 'either lets an attacker prepare a signature in advance — freshness is half the security of the whole ceremony.', 'do2')) +
      box('Do not leak at the door', 'auth/options returns the same shape whether or not the email has passkeys — the Chapter 6 enumeration rule, applied at the login door (6.4).', 'lam') },
  { t: 'The signature counter: clone detection', giua: true, body: two(
      box('Incremented per signature', 'each authenticator bumps a counter; the server stores the last value and expects the next to be higher.', 'xanh'),
      box('A counter that goes backwards', 'means a cloned credential — bumpCounter stores the new value and the library flags a regression.', 'do2')) +
      box('The private key is never yours', 'you store a public key and a counter; even a full dump leaves an attacker unable to produce one valid signature.', 'lam') },
  { t: 'Trap: the device-loss cliff', giua: true, body: box('A single passkey on a single device', 'is one dropped phone from a lockout — delete the password, enroll one passkey, lose the phone, and the account is gone.', 'do2') +
      box('So migrate gradually', 'offer passkeys ALONGSIDE the password; prompt enrollment after a successful login; encourage a second authenticator; drop the password only once a user has TWO working passkeys.', 'xanh') +
      box('Keep recovery alive throughout', 'the recovery codes from 7.3 stay valid the whole way. "Passwordless" is a destination you walk to, not a switch you flip.', 'lam') },
  { t: 'At work', to: true, giua: true, body: `<ul>
    <li><b>Store:</b> credential id, public key, counter, transports — never the private key</li>
    <li><b>Challenge:</b> server-made, one-shot; a client-chosen one can be pre-signed</li>
    <li><b>Clone detection:</b> a counter that goes backwards is a cloned authenticator</li>
    <li><b>Enumeration:</b> auth/options must not reveal who has passkeys (6.4)</li>
    <li><b>Passwordless:</b> gradual, with a recovery path at every step</li></ul>` },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>One row per authenticator: credential id, public key, counter, transports — never the private key</li>
    <li>Two ceremonies become four routes; the library parses CBOR, you own challenge + origin</li>
    <li>The challenge must be server-made and one-shot; the counter catches clones</li>
    <li>auth/options must not reveal who has passkeys — the Chapter 6 rule at the door</li>
    <li>Migrate gradually and always keep a recovery path — next, Lab 7</li></ul>` },
]);
