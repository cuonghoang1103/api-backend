/** auth-10-5 — Chapter 10 · 10.5 "Pre-hijacking & races" (04/11/2026). Slug auth-10-5-chiem-truoc-va-dua. Output = s10/_ma.mjs. */
import { lamDeck, js, sh, two, box, cards } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s10/_ma.mjs';
const clip = (s, n = 62) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const RACE = clip(OUT['105-prehijack-race'].split('\n').slice(1, 11).join('\n'), 64);
const ATOMIC = `UPDATE one_time_tokens
   SET used_at = now()
 WHERE id = $1 AND used_at IS NULL   -- only an UNUSED token flips
RETURNING id;                        -- a row ⇒ you won; none ⇒ someone else did`;
export const deck = { key: 'auth-10-5', code: 'AUTH 10.5', title: 'Pre-hijacking, and the races nobody tests for', sub: 'Never merge into unverified; make one-time actions atomic' };
export const slides = lamDeck({ chuong: 'Chapter 10 — The attacks, in order of frequency', bai: '10.5' }, [
  { cover: true, t: 'Pre-hijacking, and the races<br>nobody tests for', sub: 'Chapter 10 · Lesson 10.5 — two attacks hiding in the account lifecycle' },
  { t: 'Two quiet attacks', giua: true, body: box('The last two attacks hide in the account LIFECYCLE', 'where normal functional tests never look — sign-up, federation, one-time actions.', 'lam') +
      two(box('Pre-hijacking', 'the attacker is inside the account BEFORE the victim ever arrives to use it.', 'do2'),
          box('Race conditions (TOCTOU)', 'two requests at the same instant break a "once only" action — a token used twice.', 'do2')) +
      box('Both invisible to a functional test, both a one-idea fix', 'verify before merging; make the action atomic.', 'xanh') },
  { t: 'Pre-hijacking', giua: true, body: box('The attacker signs up with the VICTIM\'s email first', 'before the victim ever does, and sits on the account — unverified, waiting.', 'do2') +
      box('Months later the victim "Signs in with Google"', 'a naive server finds a local account already holding that email and attaches the federated login to it.', 'do2') +
      box('The merge handed the attacker a verified account', 'with a password they know or a session they kept — the victim logs in happily, and the attacker still holds a key.', 'lam') },
  { t: 'The fix: never merge into unverified', body: sh(clip(OUT['105-prehijack-race'].split('\n').slice(1, 4).join('\n'), 64), { title: 'node demo10/pre-hijack-race.mjs', sm: true }) +
      two(box('Discard the stale unverified record', 'create a fresh account the IdP has verified, or verify ownership first (Ch6).', 'xanh'),
          box('Link on the sub, not the email', 'the sub is the provider\'s stable, non-claimable id (Ch8).', 'lam')) },
  { t: 'Race conditions (TOCTOU)', body: sh(clip(OUT['105-prehijack-race'].split('\n').slice(6, 10).join('\n'), 64), { title: 'two concurrent redemptions of a one-time token', sm: true }) +
      box('Check-then-act: both pass the check', 'a one-time action reads "is it unused?" then acts; between the check and the act, a second request slips in. Both read "unused", both act.', 'do2') +
      box('Time-Of-Check to Time-Of-Use', 'in the demo, two concurrent redemptions of a one-time reset token BOTH succeed — the token was used twice.', 'lam') },
  { t: 'The fix: atomic at the database', body: js(ATOMIC, { sm: true, lang: 'sql' }) +
      box('The database decides the race', 'the row either flips and returns its id (you won) or returns nothing (someone else already consumed it). Exactly one caller wins.', 'xanh') +
      box('Not a lock in your application code', 'the check and the write are one statement the database serialises — in the demo, atomic consume yields one success where check-then-act yielded two.', 'lam') },
  { t: 'Where races hide', giua: true, body: box('Anywhere a limited thing is checked then granted', 'one-time tokens, "first N users" bonuses, unique-username sign-up, balance withdrawals, seat reservations.', 'do2') +
      box('If correctness depends on "only once"', 'the check and the write must be one atomic step — or enforced by a database constraint (a UNIQUE index, a CHECK).', 'xanh') +
      box('A one-request-at-a-time test never shows it', 'the race needs two concurrent requests, or a constraint that makes it impossible.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Pre-hijacking: never merge a federated login into an unverified account; link on the sub</li>
    <li>Races (TOCTOU): check-then-act lets two concurrent requests both succeed</li>
    <li>Fix with an atomic UPDATE ... WHERE used_at IS NULL RETURNING, or a unique constraint</li>
    <li>Functional tests miss the race; you need concurrency or a constraint</li>
    <li>That closes Chapter 10 — Chapter 11 is operating the defence</li></ul>` },
]);
