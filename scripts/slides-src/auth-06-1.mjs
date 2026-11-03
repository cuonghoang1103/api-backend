/**
 * auth-06-1 — Authentication · Chapter 6 · Lesson 6.1 "Registration, and the identifier you cannot take back" (04/11/2026).
 * Slug bài: auth-6-1-dang-ky. Output = s06/_ma.mjs (LabFlow ID v0.6 + PostgreSQL 17.11, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s06/_ma.mjs';

export const deck = { key: 'auth-06-1', code: 'AUTH 6.1', title: 'Registration, and the identifier you cannot take back', sub: 'An account starts unverified; sign-up must not reveal who is registered' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const SIGNUP = `const hash = await hashPassword(password) // BOTH outcomes
const email = normalizeEmail(raw)         // trim+NFKC+lower
let user = null
try {                                     // no check-then-insert:
  user = await users.create({ email, passwordHash: hash })
} catch (e) {                             // the UNIQUE index decides
  if (e.code !== '23505') throw e         // 23505 = already exists
}
if (user) sendVerifyLink(user)            // new row ⇒ verify email
else      sendAlreadyHaveAccount(email)   // duplicate ⇒ a notice
res.status(202).json({ message: 'Check your email.' })`;
const NORM = `export function normalizeEmail(raw) {
  const t = String(raw).trim()
  const at = t.lastIndexOf('@')           // local part may hold @
  if (at <= 0 || /\\s/.test(t)) return null
  const domain = t.slice(at + 1).toLowerCase()
  return (t.slice(0, at) + '@' + domain)
           .normalize('NFKC').toLowerCase()
}`;

export const slides = lamDeck({ chuong: 'Chapter 6 — The account lifecycle', bai: '6.1' }, [
  { cover: true, t: 'Registration, and the identifier<br>you cannot take back', sub: 'Chapter 6 · Lesson 6.1 — an unverified account, and a sign-up that leaks nothing' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>Chapter 6</b>: the account lifecycle — create, verify, recover, change, end</li>
    <li>Why a new account starts <b>unverified</b>: the email is a claim, not a fact</li>
    <li>Why "email already taken" is a free account-list for an attacker</li>
    <li>Sign-up hashes in <b>both</b> branches, so timing never reveals who is registered</li>
    <li>Both branches send an email; the response is the same 202 either way</li></ul>` },
  { t: 'A library card with your name on it', giua: true, body: cards([
      ['Wrong address', 'Get it wrong and your overdue notices — and every reset link — go to a stranger.'],
      ['Someone else’s card', 'Register with an address you do not own and, to the system, you simply are them.'],
      ['The email is that card', 'Chosen once and expensive to undo: every notification and recovery goes there.'],
    ], 3) + box('So two things matter from the first second', 'The address must really be the user’s (verification, 6.2) — and the mere act of registering must not tell the world who already has a card.', 'lam') },
  { t: 'A new account starts unverified', giua: true, body: two(
      box('A typed email is a claim', 'When a user types an email you have a claim, not a proven address — you do not yet know the mailbox is theirs.', 'lam'),
      box('email_verified_at is NULL', 'It stays null until a link is clicked there (6.2); until then the flows that lean on the inbox — reset, security mail — know not to trust it.', 'xanh')) +
      box('Measured', 'Right after sign-up the row exists with ' + c('email_verified_at = null') + '. The account is real; the address is unproven, so the risky flows stay gated on verification.', 'lam') },
  { t: 'The sign-up that leaks who is registered', giua: true, body: two(
      box('The wording leak', '409 "email already taken" is an oracle: an attacker pastes a list and the form sorts it into has-account and does-not.', 'do2'),
      box('The timing leak', 'Even with the wording fixed, hashing only when the email is new answers a taken email in ~1 ms and a free one in ~80 ms.', 'do2')) +
      box('The fix: same response, same work', 'Hash the password in both branches (so argon2 is the cost either way), send an email either way, and never say "taken" — the clock and the words both stay silent.', 'xanh') },
  { t: 'Hash first, then branch', body: js(SIGNUP, { sm: true }) +
      box('Why hash in both branches', 'argon2 (~190 ms) becomes the cost of both, so a taken and a free email answer in the same time.', 'xanh') },
  { t: 'Same response, a different email', body: sh(body('61-register'), { title: 'bash demo6/register.sh', sm: true }) +
      box('Either way: 202', 'New email ⇒ create unverified + email a verify link. Duplicate ⇒ email "you already have an account". The caller sees one 202.', 'lam') },
  { t: 'Normalise the address, and the race at the door', body: js(NORM, { sm: true }) +
      two(box('NFKC folds duplicates, NOT confusables', 'Full-width ＣＵＯＮＧ@… → cuong@…; but Cyrillic а (U+0430) ≠ Latin a — "аdmin@" and "admin@" stay two rows. Flag mixed-script separately.', 'lam'),
          box('Check-then-insert is a race', 'SELECT-then-INSERT lets two concurrent sign-ups both create a row. Just INSERT and catch 23505 — the UNIQUE index is the only arbiter.', 'do2')) +
      box('Measured', clip(body('67-signup-race').split('\n').filter((l) => l.includes('request') || l.includes('Subject')).join('\n')), 'xanh') },
  { t: 'When it goes wrong', giua: true, body: `<table class="t"><tr><th>Naive sign-up</th><th>What it leaks</th><th>LabFlow ID</th></tr>
    <tr><td>409 "email already taken"</td><td>which emails have an account</td><td>same 202, emails the owner</td></tr>
    <tr><td>hash only when the email is new</td><td>timing: taken ≈ 1 ms, free ≈ 80 ms</td><td>hashes in both branches</td></tr>
    <tr><td>account usable immediately</td><td>an unproven address is trusted</td><td>starts unverified (6.2)</td></tr>
    <tr><td>"check your email" only when new</td><td>the inbox presence leaks it too</td><td>always sends an email</td></tr></table>` +
      box('The rule under all four rows', 'Do the same work, give the same answer, and produce the same observable effect whether or not the address exists. Anything that differs by account existence is an enumeration oracle (6.4).', 'lam') },
  { t: 'Trap: trusting an unverified email', giua: true, body: box('Before email_verified_at is set, the address is only a claim', 'The user typed it; nobody has proved they can read mail there.', 'lam') +
      box('So do not', 'send anything sensitive to it, let it receive a password reset, or let "you can sign in" imply the address is real — a typo’d or someone-else’s address would then receive the victim’s mail.', 'do2') +
      box('Prove it first, then open the doors', 'Verify the address (6.2) and gate the risky flows — reset, notifications, anything public — on verification, not on registration.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Chapter 6 is the account lifecycle — where most real attacks live; it starts at sign-up</li>
    <li>A new account starts <b>unverified</b>: the email is a claim until proven (6.2)</li>
    <li>Never answer a duplicate email with "taken" — same success, email the real owner</li>
    <li>Hash in <b>both</b> branches so timing does not reveal which emails exist (6.4)</li>
    <li>Next — 6.2: verification, and the scanner that clicks your links</li></ul>` },
]);
