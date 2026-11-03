// lab6/starter/index.js — Lab 6 starter. Write LabFlow ID's account-lifecycle layer.
//
// lifecycle(config) returns { issueToken, consumeToken, requestPasswordReset }. config = { store, now, verifyTtlMs, resetTtlMs }.
//   store = { insert(row), getByDigest(d), markUsed(id, t) }.
//   issueToken(userId, purpose)      ⇒ { token, row }; store ONLY tokenDigest(token). purpose: 'verify_email' | 'reset_password'.
//   consumeToken(purpose, token, {at}) ⇒ { userId } or { error } ('INVALID' | 'USED' | 'EXPIRED'); single-use, purpose-bound, time-limited.
//   requestPasswordReset(users, email, { send, sync }) ⇒ email a reset link ONLY to a real, active account; NOTHING to a
//     stranger (no "no account" message — that leaks which emails exist). Do the send off the response path unless `sync`.
// You may import ../../src/crypto (newToken, tokenDigest). Do NOT import ../../src/lifecycle/layer.js — that is the answer.
import { newToken, tokenDigest } from '../../src/crypto/index.js';

export function lifecycle({ store, now = () => Date.now(), verifyTtlMs = 30 * 60e3, resetTtlMs = 15 * 60e3 }) {
  async function issueToken(userId, purpose) {
    // TODO: make a token, store a row with its digest, purpose and expiry; return { token, row }.
    throw new Error('not implemented');
  }
  async function consumeToken(purpose, token, { at = now() } = {}) {
    // TODO: look up by digest; reject wrong purpose (INVALID), already used (USED), expired (EXPIRED); else mark used, return { userId }.
    throw new Error('not implemented');
  }
  async function requestPasswordReset(users, email, { send, sync = false }) {
    // TODO: find the account; if active, issue a reset token and email it (off the response path unless `sync`).
    //       If there is no account, do NOTHING — never send a "no account" email. Always return { ok: true }.
    throw new Error('not implemented');
  }
  return { issueToken, consumeToken, requestPasswordReset };
}
