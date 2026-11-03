/**
 * auth-06-2 — Authentication · Chapter 6 · Lesson 6.2 "Email verification, and the scanner that clicks your links" (04/11/2026).
 * Slug bài: auth-6-2-xac-minh-email. Output = s06/_ma.mjs (LabFlow ID v0.6 + PostgreSQL 17.11, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s06/_ma.mjs';

export const deck = { key: 'auth-06-2', code: 'AUTH 6.2', title: 'Email verification, and the scanner that clicks your links', sub: 'A one-time token, and why a GET must not consume it' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const L = CODE.layer.split('\n');
const ISSUE_CONSUME = L.slice(L.findIndex((l) => l.includes('async function issueToken')), L.findIndex((l) => l.includes('Ask for a password reset'))).join('\n').replace(/ *\/\/.*$/gm, '').replace(/^\s*\n/gm, '').trim();
const VERIFY = `// GET is SAFE — a scanner can prefetch it, so it
// changes nothing: it only shows a confirm page.
app.get('/verify-email', (req, res) => {
  res.type('html').send(confirmForm(req.query.token))
})
// POST consumes — only the human's click gets here.
app.post('/verify-email', async (req, res) => {
  const r = await life.consumeToken('verify_email',
                                    req.body?.token)
  if (r.error) return res.status(400).json(r)
  await users.markEmailVerified(r.userId)
  res.json({ ok: true, verified: true })
})`;

export const slides = lamDeck({ chuong: 'Chapter 6 — The account lifecycle', bai: '6.2' }, [
  { cover: true, t: 'Email verification, and the scanner<br>that clicks your links', sub: 'Chapter 6 · Lesson 6.2 — a one-time token a mail gateway cannot burn' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Verification proves one thing: this person can read mail at this address</li>
    <li>The token is Chapter 1’s primitive: random, hashed, single-use, purpose-bound, short-lived</li>
    <li>A mail security gateway <b>GETs</b> your link before the user does</li>
    <li>So a GET must not consume: GET shows a page, POST consumes</li>
    <li>Or make verify idempotent — never password reset</li></ul>` },
  { t: 'A courier who needs a signature', giua: true, body: cards([
      ['Left on the doorstep', 'A parcel left at the door can be taken by anyone walking past — no proof of who received it.'],
      ['Needs a signature', 'One that needs a signature proves a specific person was there to take it.'],
      ['Verification is the signature', 'It proves someone can actually open that mailbox — the one fact reset depends on (6.3).'],
    ], 3) + box('What it proves, and what it does not', 'A verified address proves mailbox access at one moment in time. It does not prove a name, an employer, an age or a country — treating "verified" as identity is how the word ends up meaning nothing.', 'lam') },
  { t: 'The token is Chapter 1, unchanged', body: js(ISSUE_CONSUME, { sm: true }) +
      box('Purpose-bound', 'consumeToken rejects a reset token used to verify as INVALID. One table, two purposes, no cross-use.', 'xanh') },
  { t: 'Store the digest, not the token', giua: true, body: two(
      box('SHA-256, not Argon2', 'The row is a credential — a DB dump or a log line must not be a working link. SHA-256 is right because the input is already 256 bits of randomness, so there is nothing to brute-force (contrast 2.3).', 'xanh'),
      box('Not a JWT', 'A signed token cannot be marked used, cannot be revoked when the user asks to resend, and cannot be expired early. Verification needs all three — and one database row gives all three.', 'lam')) +
      box('Single-use and time-limited', c('usedAt') + ' makes the token work exactly once; ' + c('expiresAt') + ' (30 minutes for verify) kills a link left sitting in an archived mailbox.', 'lam') },
  { t: 'The scanner clicks first', giua: true, body: box('Safe Links, Proofpoint, Mimecast, Slack unfurl', 'fetch every URL in a mail seconds after delivery, follow redirects, run no JavaScript.', 'lam') +
      box('The log that proves it', '08:14 GET /verify?token=… UA "Office Existence Discovery" → 200. 08:31 the human clicks → "link expired".', 'do2') +
      box('They did nothing wrong', 'Their company’s gateway burned the one-time token seventeen minutes earlier.', 'do2') },
  { t: 'Fix the shape, not the guess', body: js(VERIFY, { sm: true }) +
      box('GET shows, POST consumes', 'The GET returns a form and changes nothing; only the human’s click (a POST) consumes the token.', 'xanh') },
  { t: 'The measured result', body: sh(body('62-scanner'), { title: 'bash demo6/scanner.sh', sm: true }) +
      box('One extra click', 'The scanner’s GET leaves the token unused; the first POST verifies; a second POST returns USED.', 'lam') },
  { t: 'The cheaper alternative, and its cost', giua: true, body: two(
      box('Keep the plain GET', 'but make the token idempotent — let it succeed repeatedly for its whole 30-minute life instead of dying on first use. The scanner verifies, the user verifies again, both see success.', 'lam'),
      box('The cost', 'you give up the single-use property. That is acceptable for verification, where re-confirming an address is harmless.', 'xanh')) +
      box('Never for password reset', 'A reset link that works twice is a link an attacker can replay after the user has used it (6.3). There, single-use is not negotiable.', 'do2') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Verification proves one thing: this person can read mail at this address, at one moment</li>
    <li>The token is random, stored as a digest, single-use, purpose-bound, short-lived</li>
    <li>A mail gateway will GET your link before the user — a GET must not consume the token</li>
    <li>GET shows a confirm page; POST consumes. Or make verify idempotent — never reset</li>
    <li>Next — 6.3: password reset, your most attacked flow</li></ul>` },
]);
