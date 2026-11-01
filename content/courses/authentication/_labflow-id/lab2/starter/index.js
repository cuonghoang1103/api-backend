// lab2/starter/index.js — Lab 2: LabFlow ID's password module. Replace every TODO; keep the four exported names.
// Allowed: node:crypto (md5 for the legacy branch only), the argon2 and bcrypt packages. Grade: node scripts/cham-lab-2.mjs lab2/my
import argon2 from 'argon2';
import bcrypt from 'bcrypt';

/** ⇒ a self-describing argon2id string ("$argon2id$v=19$m=…,t=…,p=…$salt$hash"), parameters you MEASURED (lesson 2.2). */
export async function hashPassword(password) {
  throw new Error('TODO hashPassword');
}

/** ⇒ { ok, rehash }. Today's argon2id, older argon2id parameters, bcrypt "$2b$…", and "$md5-argon2id$…" (lesson 2.5). Never throws. */
export async function verifyPassword(stored, password) {
  throw new Error('TODO verifyPassword');
}

/** ⇒ [] or a list of problems: TOO_SHORT (< 15), TOO_LONG (> 128), COMMON (whole password in blocklist), CONTEXT_WORD (lesson 2.4). */
export function checkNewPassword(password, { email = '', blocklist = new Set() } = {}) {
  throw new Error('TODO checkNewPassword');
}

/** store = { findByEmail(email), updateHash(id, hash) } ⇒ { user } or { error: 'INVALID_CREDENTIALS' } (lesson 2.3). */
export async function signIn(store, email, password) {
  throw new Error('TODO signIn');
}
