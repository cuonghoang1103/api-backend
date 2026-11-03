// lab6/yeu/index.js — a first attempt that "works": it issues and consumes tokens and emails a reset link. But it never
// marks a token used, it does not bind a token to its purpose, and — trying to be helpful — it emails "no account found"
// to a stranger, which is exactly how an attacker enumerates who is registered.
import { newToken, tokenDigest } from '../../src/crypto/index.js';

export function lifecycle({ store, now = () => Date.now(), verifyTtlMs = 30 * 60e3, resetTtlMs = 15 * 60e3 }) {
  async function issueToken(userId, purpose) {
    const token = newToken(purpose === 'reset_password' ? 'lfid_reset' : 'lfid_verify');
    const t = now();
    const row = { id: newToken('ott'), userId, purpose, digest: tokenDigest(token), createdAt: t,
      expiresAt: t + (purpose === 'reset_password' ? resetTtlMs : verifyTtlMs), usedAt: null };
    await store.insert(row);
    return { token, row };
  }
  async function consumeToken(purpose, token, { at = now() } = {}) {
    const rec = await store.getByDigest(tokenDigest(String(token)));
    if (!rec) return { error: 'INVALID' };
    if (at >= rec.expiresAt) return { error: 'EXPIRED' };
    return { userId: rec.userId };          // no single-use, no purpose check — looks fine, until it isn't
  }
  async function requestPasswordReset(users, email, { send }) {
    const user = await users.findByEmail(String(email ?? '').trim().toLowerCase());
    if (user) {
      const { token } = await issueToken(user.id, 'reset_password');
      send({ to: user.email, subject: 'Reset your password', text: `Reset: https://id.labflow.example/reset?token=${token}` });
    } else {
      send({ to: email, subject: 'No account found', text: 'There is no LabFlow account for this email. Would you like to register?' });
    }
    return { ok: true };
  }
  return { issueToken, consumeToken, requestPasswordReset };
}
