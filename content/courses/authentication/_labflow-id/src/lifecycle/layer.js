// src/lifecycle/layer.js — Chapter 6 = Lab 6 reference: one-time tokens for email verification and password reset,
// and a password-reset request that does not reveal whether an email exists (lessons 6.2, 6.3, 6.4).
// store = { insert(row), getByDigest(d), markUsed(id, t) }. A token is random; only its digest is stored (lesson 1.3).
import { newToken, tokenDigest } from '../crypto/index.js';

export function lifecycle({ store, now = () => Date.now(), verifyTtlMs = 30 * 60e3, resetTtlMs = 15 * 60e3 }) {
  /** Make a one-time token for a purpose; the plaintext is emailed, the digest is stored. */
  async function issueToken(userId, purpose) {
    const token = newToken(purpose === 'reset_password' ? 'lfid_reset' : 'lfid_verify');
    const t = now();
    const row = { id: newToken('ott'), userId, purpose, digest: tokenDigest(token), createdAt: t,
      expiresAt: t + (purpose === 'reset_password' ? resetTtlMs : verifyTtlMs), usedAt: null };
    await store.insert(row);
    return { token, row };
  }

  /** Consume a token for a purpose. ⇒ { userId } or { error }. Single-use, purpose-bound, time-limited. */
  async function consumeToken(purpose, token, { at = now() } = {}) {
    const rec = await store.getByDigest(tokenDigest(String(token)));
    if (!rec || rec.purpose !== purpose) return { error: 'INVALID' };   // wrong token, or a reset token used to verify email
    if (rec.usedAt) return { error: 'USED' };                           // single-use (a reset link works exactly once)
    if (at >= rec.expiresAt) return { error: 'EXPIRED' };
    await store.markUsed(rec.id, at);
    return { userId: rec.userId };
  }

  /** Ask for a password reset WITHOUT revealing whether the email exists (lesson 6.4). The response is identical either
   *  way — AND so is its timing, because the token insert and the email send are done OFF the response path (not awaited).
   *  Awaiting them (the `sync` option, a teaching foil) makes a real account measurably slower, which is itself the leak. */
  async function requestPasswordReset(users, email, { send, sync = false }) {
    const user = await users.findByEmail(String(email ?? '').trim().toLowerCase());
    const work = async () => {
      if (user && user.status === 'active') {
        const { token } = await issueToken(user.id, 'reset_password');
        send({ to: user.email, subject: 'Reset your LabFlow password',
          text: `Someone asked to reset your password. If it was you, use this one-time link within 15 minutes: ` +
            `https://id.labflow.example/reset?token=${token}  — if not, ignore this email.` });
      }
    };
    if (sync) await work();          // the naive version: the response waits for the insert + send ⇒ a timing leak
    else work().catch(() => {});     // the safe version: fire-and-forget, so the response time does not depend on the account
    return { ok: true };             // one fixed response in every case
  }

  return { issueToken, consumeToken, requestPasswordReset };
}
