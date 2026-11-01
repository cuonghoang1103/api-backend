// lab2/yeu/index.js — a FIRST ATTEMPT that "works": An can sign up and sign in, wrong passwords are refused.
import argon2 from 'argon2';

export async function hashPassword(password) {
  return argon2.hash(password);                           // the package defaults
}

export async function verifyPassword(stored, password) {
  return { ok: await argon2.verify(stored, password), rehash: false };
}

export function checkNewPassword(password) {
  const problems = [];                                    // the rules every sign-up form used to have
  if (password.length < 8) problems.push('TOO_SHORT');
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) problems.push('NEEDS_MIXED_CASE');
  if (!/\d/.test(password)) problems.push('NEEDS_DIGIT');
  if (!/[^A-Za-z0-9]/.test(password)) problems.push('NEEDS_SYMBOL');
  return problems;
}

export async function signIn(store, email, password) {
  const user = await store.findByEmail(email);
  if (!user) return { error: 'NO_SUCH_ACCOUNT' };
  const { ok } = await verifyPassword(user.passwordHash, password);
  if (!ok) return { error: 'WRONG_PASSWORD' };
  return { user };
}
