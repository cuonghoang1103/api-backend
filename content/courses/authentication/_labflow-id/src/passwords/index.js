// src/passwords/index.js — LabFlow ID's password module (Chapter 2 = Lab 2 reference solution).
export { PARAMS, normalize, hashPassword, verifyPassword, needsRehash, describe, wrapLegacyMd5 } from './hash.js';
export { MIN_LENGTH, MAX_LENGTH, loadBlocklist, checkNewPassword } from './policy.js';
export { pwnedCount } from './pwned.js';
export { signIn } from './signin.js';
