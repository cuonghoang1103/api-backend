// src/passwords/signin.js — lesson 2.3: one sign-in flow whose branches look the same from outside.
//   same answer for "no such email" and "wrong password" · same work (a dummy hash) · rehash on success (lesson 2.5)
import { randomBytes } from 'node:crypto';
import { hashPassword, verifyPassword } from './hash.js';
import { MAX_LENGTH } from './policy.js';

// Hashed once at startup with today's parameters, so "no such user" costs exactly one real verify.
const DUMMY = await hashPassword(randomBytes(16).toString('base64url'));

/** store = { findByEmail(email) ⇒ { id, passwordHash, … } | null, updateHash(id, hash) }. ⇒ { user } | { error } */
export async function signIn(store, email, password) {
  if (typeof email !== 'string' || typeof password !== 'string' || [...password].length > MAX_LENGTH) {
    return { error: 'INVALID_CREDENTIALS' };            // the length is the attacker's own input: no secret leaks here
  }
  const user = await store.findByEmail(email.trim().toLowerCase());
  const { ok, rehash } = await verifyPassword(user?.passwordHash ?? DUMMY, password);
  if (!user || !ok) return { error: 'INVALID_CREDENTIALS' };
  if (rehash) await store.updateHash(user.id, await hashPassword(password));
  return { user };
}
