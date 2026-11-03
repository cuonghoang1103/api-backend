/** auth-12-5 — Chapter 12 · 12.5 "Closing" (04/11/2026). Slug auth-12-5-loi-ket. Output = s12/_ma.mjs. */
import { lamDeck, sh, two, box, cards } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s12/_ma.mjs';
export const deck = { key: 'auth-12-5', code: 'AUTH 12.5', title: 'What to build first, and what actually changed', sub: 'Adopt, order with authz first; passkeys are what changed' };
export const slides = lamDeck({ chuong: 'Chapter 12 — Diagnosis', bai: '12.5' }, [
  { cover: true, t: 'What to build first,<br>and what actually changed', sub: 'Chapter 12 · Lesson 12.5 — the closing lesson of the course' },
  { t: 'Do not build it from scratch', giua: true, body: box('For most systems, do not hand-roll auth', 'use a vetted library or an identity provider.', 'do2') +
      box('This course taught you how it WORKS', 'so you can CHOOSE, CONFIGURE and DEBUG one correctly — not so you ship your own crypto.', 'xanh') +
      box('Hand-rolled crypto is where breaches live', 'the teams who get breached usually rolled their own without understanding the attacks.', 'do2') },
  { t: 'The order that matters', giua: true, body: cards([
      ['Hashing + sessions first', 'passwords hashed right, sessions (Ch2–3)'],
      ['Then tokens', 'access + refresh, if you need them (Ch4–5)'],
      ['Then lifecycle + MFA', 'verification, reset, TOTP, passkeys (Ch6–7)'],
      ['Authorization from DAY ONE', 'the one gate before the features (Ch9) — not bolted on'],
    ], 1) },
  { t: 'Authorization is not an afterthought', giua: true, body: box('The single most expensive mistake', 'is adding the authorization gate last, after the features are built.', 'do2') +
      box('Retrofitting deny-by-default is a REWRITE', 'onto a system that already fell open everywhere — not a patch. Every route has to be re-threaded through the gate.', 'do2') +
      box('Build the one gate before the features', 'so every route is forced through it from the start — day one, not later (Ch9).', 'xanh') },
  { t: 'What actually changed', giua: true, body: two(
      box('Passkeys', 'phishing-resistant by construction — they remove the password AND defeat the AiTM relay at once (Ch7/10). The biggest improvement to real-world auth in a decade.', 'xanh'),
      box('Automated attacks at scale', 'credential stuffing, AiTM relay kits and MFA-fatigue are sold as services and run at volume (Ch10).', 'do2')) +
      box('Defence is no longer "a strong password"', 'it is breached-password blocking, origin-bound factors, and rate limits that survive a fleet. Offer passkeys; the password is the legacy.', 'lam') },
  { t: 'What did NOT change', giua: true, body: box('The primitives of Chapter 1 still hold', 'hash passwords with a slow, salted function; never trust input, including a decoded token; deny by default.', 'lam') +
      box('And the rest of the foundations', 'keep secrets out of the repo; one message for every account; measure, do not guess.', 'xanh') +
      box('Better tools, faster attackers, same foundations', 'the ground you built on in the first week is the ground you still stand on — the primitives are constant.', 'lam') },
  { t: 'The capstone', body: sh(OUT['cuoi-tham-khao'].split('\n').slice(-2).join('\n'), { title: 'node scripts/cham-cuoi-khoa.mjs sub-cuoi/tham-khao', sm: true }) +
      two(box('LabFlow ID v1.0, graded by ~12 real attacks', 'one per chapter; a weak build scores low on what it misses, the reference scores 100.', 'lam'),
          box('A STAR story for your CV', 'you can explain each defence by the attack it stops — the course, run end to end as an adversary would.', 'xanh')) +
      box('Build it, break it, fix it', 'passing the capstone means all three — the point the whole course was driving at.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Do not hand-roll auth for production — understand it to choose, configure and debug one</li>
    <li>Build in order, with authorization from day one</li>
    <li>What changed: passkeys and automated attacks at scale</li>
    <li>What did not: the Chapter 1 primitives</li>
    <li>The capstone is the whole course under attack — you can build, break and fix it</li></ul>` },
]);
