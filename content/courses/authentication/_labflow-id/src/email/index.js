// src/email/index.js — Chapter 6: a fake mailbox. In production this calls a provider (Resend, SES, Postmark); here it
// captures every message in an in-process outbox so the demos, tests and the Lab grader can read a verification link or
// a reset code without a real inbox. A real inbox is the only place these codes should ever appear.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outbox = [];

/** "Send" a message: capture it. Never throws; a real sender would be fire-and-forget so timing does not leak (6.4).
 *  If LFID_MAIL_DIR is set (demos), also drop the message as a .txt file — the dev's "inbox". */
export function sendEmail({ to, subject, text }) {
  outbox.push({ to, subject, text, at: Date.now() });
  const dir = process.env.LFID_MAIL_DIR;
  if (dir) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${Date.now()}-${String(to).replace(/[^a-z0-9]/gi, '_')}.txt`), `To: ${to}\nSubject: ${subject}\n\n${text}\n`);
  }
  return { queued: true };
}

export const mailbox = {
  outbox,
  /** The most recent message, optionally to one address. */
  last: (to) => [...outbox].reverse().find((m) => !to || m.to === to) ?? null,
  count: (to) => outbox.filter((m) => !to || m.to === to).length,
  clear: () => { outbox.length = 0; },
};
