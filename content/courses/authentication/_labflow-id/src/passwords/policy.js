// src/passwords/policy.js — lesson 2.4: the password rules NIST SP 800-63B-4 asks for, and nothing else.
import fs from 'node:fs';

export const MIN_LENGTH = 15;   // passwords are LabFlow ID's only factor (until Chapter 7) ⇒ NIST: at least 15
export const MAX_LENGTH = 128;  // NIST: allow at least 64; the cap keeps hashing cost bounded (lesson 2.3)

/** The blocklist: the 10,001 most common passwords (SecLists), compared as WHOLE passwords, case-insensitive. */
export function loadBlocklist(file = 'wordlists/10k-most-common.txt') {
  return new Set(fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((w) => w.toLowerCase()) : []);
}

/** Problems with a NEW password (sign-up, change, reset). Empty array = accepted. Length counts code points (NFC). */
export function checkNewPassword(password, { email = '', blocklist = new Set() } = {}) {
  if (typeof password !== 'string') return ['NOT_A_STRING'];
  const pw = password.normalize('NFC');
  const length = [...pw].length;
  const problems = [];
  if (length < MIN_LENGTH) problems.push('TOO_SHORT');
  if (length > MAX_LENGTH) problems.push('TOO_LONG');
  if (blocklist.has(pw.toLowerCase())) problems.push('COMMON');
  // context words and their obvious derivatives: the service name, the email's local part
  const core = pw.toLowerCase().replace(/[^\p{L}]/gu, '');
  const context = ['labflow', 'labflowid', email.split('@')[0].toLowerCase().replace(/[^\p{L}]/gu, '')].filter((w) => w.length >= 3);
  if (context.includes(core)) problems.push('CONTEXT_WORD');
  return problems;
}
