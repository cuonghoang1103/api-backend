/**
 * auth-06-5 — Authentication · Chapter 6 · Lesson 6.5 "Changing the address, and ending the account" (04/11/2026).
 * Slug bài: auth-6-5-doi-email-va-xoa. Output = s06/_ma.mjs (LabFlow ID v0.6 + PostgreSQL 17.11, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s06/_ma.mjs';

export const deck = { key: 'auth-06-5', code: 'AUTH 6.5', title: 'Changing the address, and ending the account', sub: 'Re-verify a new email; re-auth, soft-delete and revoke on close' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const DELETE = `app.post('/me/delete', needSession, async (req, res) => {
  const u = await users.findById(req.session.userId)
  // re-authenticate even inside a live session
  if (!(await verifyPassword(u.passwordHash,
        req.body?.password)).ok)
    return res.status(403).json({ error: 'REAUTH_FAILED' })
  await users.setStatus(u.id, 'deleted')   // soft-delete
  await sessions.endAll(u.id)              // revoke sessions
  await refresh.revokeAll(u.id)            // revoke families
  res.json({ ok: true, deleted: true })
})`;

export const slides = lamDeck({ chuong: 'Chapter 6 — The account lifecycle', bai: '6.5' }, [
  { cover: true, t: 'Changing the address,<br>and ending the account', sub: 'Chapter 6 · Lesson 6.5 — the two sensitive actions that close the lifecycle' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Changing the email returns it to an unverified claim + a fresh verify link</li>
    <li>Notify the old address too, so a hijacked session cannot move it silently</li>
    <li>Deleting an account re-authenticates with the password</li>
    <li>Soft-delete (a status) + a retention purge beats a hard DELETE</li>
    <li>Both are credential changes: revoke every session and refresh family</li></ul>` },
  { t: 'A forwarding address and a closed account', giua: true, body: cards([
      ['Change-of-address', 'Filing one with the post office reroutes everything — do it without proof and a stranger reads all your mail.'],
      ['Closing a bank account', 'Is not a single click; they check it really is you before the account is gone for good.'],
      ['Same here', 'Both actions are sensitive by default — one moves where every future reset link goes, the other erases the row every table points at.'],
    ], 3) + box('The chapter closes where it began', 'Both are credential changes, so both must leave no session alive — the same rule as password reset (6.3).', 'lam') },
  { t: 'Changing the email returns it to a claim', giua: true, body: two(
      box('updateEmail clears the verified flag', 'It writes the new address AND sets ' + c('email_verified_at = NULL') + ' in the same statement — a new email is a new claim (6.1).', 'xanh'),
      box('Until the user clicks the new link', 'reset and security mail do not treat the new address as real (6.2) — else a user could move to an address they do not own and start receiving reset links there.', 'lam')) +
      box('Re-authenticate for truly sensitive changes', 'A live session is not proof the human is still at the keyboard; for high-value changes, re-prompt for the password (as /me/delete does).', 'lam') },
  { t: 'Notify the old address too', giua: true, body: two(
      box('An attacker in a live session', 'could change the email to one they control and quietly take over the account, with the real owner none the wiser.', 'do2'),
      box('A notice to the previous address', 'is how the real owner finds out in time to react — it is the tripwire on a silent hijack.', 'xanh')) +
      box('The sandbox demo', 'omits the second mail for brevity; a real build sends it to the old address every time the email changes.', 'lam') },
  { t: 'Ending the account', body: js(DELETE, { sm: true }) +
      box('Re-auth · soft-delete · revoke', 'Verify the password, flip status to deleted, end every session and refresh family, clear the cookies.', 'xanh') },
  { t: 'The measured result', body: sh(body('65-change-delete'), { title: 'bash demo6/change-delete.sh', sm: true }) +
      box('The address frees up correctly', 'findByEmail filters status=’active’, so a later sign-in with that email fails like any unknown address.', 'lam') },
  { t: 'Trap: hard-deleting the row', giua: true, body: box('DELETE FROM users looks clean', 'until a foreign key from audit logs, orders or messages blocks it or cascades history you must keep.', 'do2') +
      box('Soft-delete + a retention job', 'survives a real schema — and lets a mistake, or a support ticket, be undone within the window.', 'xanh') +
      box('Re-authenticate even in a live session', 'a live session is not proof the human is present; a borrowed, unlocked laptop must not erase an account.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Changing the email returns the address to an unverified claim + a fresh link (6.1, 6.2)</li>
    <li>Notify the old address too, so a hijacked session cannot move the account silently</li>
    <li>Deleting re-authenticates with the password — a live session is not proof the human is present</li>
    <li>Soft-delete + a retention purge beats a hard DELETE: recovery, legal holds, referential integrity</li>
    <li>Both are credential changes: revoke every session and refresh family — the chapter closes where it began</li></ul>` },
]);
