/** auth-11-4 — Chapter 11 · 11.4 "Audit log" (04/11/2026). Slug auth-11-4-nhat-ky-kiem-toan. Output = s11/_ma.mjs. */
import { lamDeck, js, sh, two, box, cards } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s11/_ma.mjs';
const clip = (s, n = 62) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const OUTA = clip(OUT['114-audit'].split('\n').slice(2, 9).join('\n'), 64);
export const deck = { key: 'auth-11-4', code: 'AUTH 11.4', title: 'The audit log: what to write, and what never to', sub: 'Allow-list; drop every secret; tag a severity' };
export const slides = lamDeck({ chuong: 'Chapter 11 — Running it', bai: '11.4' }, [
  { cover: true, t: 'The audit log: what to write,<br>and what never to', sub: 'Chapter 11 · Lesson 11.4 — write enough to investigate, leak nothing' },
  { t: 'The record you need after a breach', giua: true, body: box('Who did what, when, from where, with what outcome', 'the audit log is what you reach for after an incident.', 'lam') +
      box('Two rules pull against each other', 'write ENOUGH to reconstruct the event — and NOTHING that is itself a secret.', 'do2') +
      box('A logged secret is a second breach', 'sitting in your log store, read by everyone with log access, retained for months.', 'do2') },
  { t: 'What to write, what never to', giua: true, body: two(
      box('Write', 'timestamp, actor (the user id), action, outcome, ip, request id, user agent — enough to reconstruct "usr_1 reset their password from this IP at this time, and it succeeded".', 'xanh'),
      box('Never write', 'a password, token, session cookie, OTP, recovery code or API key — not even once, not even nested inside another field.', 'do2')) +
      box('These are read widely and kept for months', 'a secret among them is a standing breach — every person with log access can read it, long after the event.', 'do2') },
  { t: 'The naive "log everything"', body: sh(OUTA, { title: 'node demo11/audit.mjs', sm: true }) +
      box('safeAudit: zero secret substrings remain', 'the raw event holds a reset token, a plaintext password and a cookie; the safe entry keeps the fields and drops every secret, including the nested one.', 'xanh') },
  { t: 'Allow-list, not deny-list', giua: true, body: box('Keep only the fields you named safe', 'this is the Chapter 1 rule: log only what you decided is safe, never "everything minus a deny-list".', 'xanh') +
      box('A deny-list misses the new field', 'the sensitive field a teammate added last week; an allow-list only ever passes what you named — safe by construction.', 'lam') +
      box('Drop nested objects entirely', 'a secret can hide inside one under an innocent key; refuse them rather than try to recurse and redact perfectly.', 'do2') },
  { t: 'Severity drives the response', giua: true, body: cards([
      ['alert', 'refresh_reuse_detected, mfa_disabled — a takeover signal'],
      ['warn', 'password_reset, email_changed, admin_action'],
      ['info', 'a routine login or logout'],
    ], 1) + box('The audit log is a source of signals', 'the severity is what monitoring and the runbook (11.5) act on — not just a record.', 'lam') },
  { t: 'Tamper-evident, and private', giua: true, body: two(
      box('Ship it off the box', 'an attacker who gets in will try to erase their tracks — store entries append-only, on a separate account the app itself cannot edit or delete.', 'xanh'),
      box('IP and user id are PII', 'keep them because you need them to investigate, but retain for a bounded time, restrict who reads them, and log no more about a person than the incident needs.', 'lam')) +
      box('A log the attacker can delete is not an audit log', 'tamper-evidence is what makes the record trustworthy after the breach it documents.', 'do2') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Write who/what/when/where/outcome and a severity</li>
    <li>Never a token, password, cookie, OTP or recovery code — not even nested</li>
    <li>Allow-list, not deny-list; drop nested objects a secret could hide in</li>
    <li>Ship it somewhere tamper-evident; respect PII</li>
    <li>Next — 11.5: six signals and the runbook</li></ul>` },
]);
