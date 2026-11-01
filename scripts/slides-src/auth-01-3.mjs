/**
 * auth-01-3 — Authentication · Chapter 1 · Lesson 1.3 "Comparing two secrets with === is a bug" (01/11/2026).
 * Slug bài: auth-1-3-so-sanh-hang-thoi-gian. Output = _ma.mjs của s01 (LabFlow ID chạy thật, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, steps, cards, c, zm, vsd } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s01/_ma.mjs';

export const deck = { key: 'auth-01-3', code: 'AUTH 1.3', title: 'Comparing two secrets with === is a bug', sub: 'Timing, digests and webhook signatures' };

const rows = (k, from, to) => OUT[k].split('\n').slice(from, to).join('\n');
const SV = CODE.server01.split('\n');

export const slides = lamDeck({ chuong: 'Chapter 1 — Credentials and primitives', bai: '1.3' }, [
  { cover: true, t: 'Comparing two secrets<br>with === is a bug', sub: 'Chapter 1 · Lesson 1.3 — measure the leak, then remove it for free' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A <b>timing side channel</b>, measured on your own machine</li>
    <li>The benchmark that lies — and how to write one that does not</li>
    <li>${c('timingSafeEqual')}, its length trap, and ${c('safeEqual')} (double HMAC)</li>
    <li><b>Do not compare at all:</b> store a digest, look it up (LabFlow ID v0.1)</li>
    <li>Webhook signatures: raw bytes, a time limit, a constant-time check</li></ul>` },
  { t: 'A lock that clicks on every right digit', body: cards([
      ['The lock', 'An old combination lock clicks when <b>one wheel</b> is right. Try 0–9 on wheel 1 until it clicks, then wheel 2…'],
      ['The cost', '10 tries per wheel instead of every combination. The lock always said “wrong” — <b>how</b> it said it gave the code away.'],
      [c('a === b'), 'Compares from the left and <b>stops at the first difference</b>. More right characters ⇒ slightly longer.'],
    ], 3) + steps([
      'Guess position 0: the slowest answer is probably the right character',
      'Keep it, guess position 1 — one position at a time: 64 × 64 tries, not 64<sup>64</sup>',
      'The catch: the signal is nanoseconds, the noise is microseconds — so measure',
    ]) },
  { t: 'Trap: the benchmark that lies', body: two(`<div>${js(`const g = inputs[k];      // ONE object
const t = process.hrtime.bigint();
for (let i = 0; i < N; i++)
  if (compare(g)) hits++; // same g
// compare = (g) => g === secret`, { hl: [4] })}${box('Why it is flat', `${c('g')} and ${c('secret')} never change inside the loop ⇒ V8 may compute the comparison <b>once</b>. 0.99 ns is the cost of an empty loop.`, 'do2')}</div>`,
      sh(rows('13-do-naive', 2, 10), { title: 'node demo1/timing-naive.mjs strict' })) },
  { t: 'Measured properly: === on a 64-char token', body: two(`<div>${js(`const inputs = positions.map((m) =>
  Array.from({ length: 8 }, () => guess(m)));
…
for (let i = 0; i < N; i++)
  if (compare(gs[i & 7])) hits++; // use it`, { hl: [2, 5] })}${box('Two fixes', 'Rotate 8 copies of every guess, and <b>use</b> every result.', 'xanh')}</div>`,
      `<div>${sh(rows('13-do-strict', 2, 10), { title: 'node demo1/timing-equal.mjs strict' })}${box('Small, and in steps', '≈ 2 ns across the whole token; V8 compares a block of bytes at a time.', 'lam')}</div>`, 'r46') },
  { t: 'Longer secret, longer leak · timingSafeEqual is flat', body: two(sh(rows('13-do-1024', 2, 9), { title: '=== · 1,024 chars' }),
      sh(rows('13-do-safe', 2, 10), { title: 'timingSafeEqual · 64 chars' })) +
      box('Read it', `${c('===')}: 4.61 → 38.05 ns over 1,024 chars, a straight line (≈ 0.03 ns per char). ${c('timingSafeEqual')}: 64–67 ns in every row — noise, no pattern.`, 'lam') },
  { t: 'Can anyone see 2 ns through HTTP?', body: sh([OUT['13-tu-xa-1'], rows('13-tu-xa-2', 4, 5), rows('13-tu-xa-3', 4, 5)].join('\n'), { title: '127.0.0.1 · 20,000 requests per guess · three runs' }) +
      two(box('Not here', 'The sign flips: +125, −126, −42 ns. ±100 ns of noise hides a 2 ns signal — ~(100/2)² ≈ 2,500× more samples needed.', 'xanh'),
        box('But the fix is free', 'Longer secrets, slower comparisons and attackers in the same data centre leak more. Research: 100 ns resolvable on a LAN (Crosby et al., 2009).', 'do2')) },
  { t: 'timingSafeEqual, and its length trap', body: sh(rows('13-do-dai', 1, 3), { title: "node -e \"timingSafeEqual(Buffer.from('abc'), Buffer.from('abcd'))\"" }) +
      vsd(`${js(`if (a.length !== b.length)
  return false;          // leaks the length
timingSafeEqual(a, b);   // or throws ⇒ 500`, { sm: true })}`,
        `${js(`// the length is public: every
// LabFlow ID session token is 52 chars
// ⇒ checking it first is fine`, { sm: true })}`, '✗ When the length is secret', '✓ When the length is public') +
      cards([
        ['Throws on different lengths', `${c('ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH')} — an uncaught throw turns a wrong guess into a 500`],
        ['Safe pattern 1', 'lengths are public ⇒ check the length, then compare'],
        ['Safe pattern 2', `lengths may differ ⇒ ${c('safeEqual')}: hash both sides first (next slide)`],
      ], 3) },
  { t: 'safeEqual: hash both sides first', body: two(js(`const KEY = randomBytes(32); // per process

export function safeEqual(a, b) {
  if (typeof a !== 'string' ||
      typeof b !== 'string') return false;
  const ma = createHmac('sha256', KEY)
    .update(a).digest();      // 32 bytes
  const mb = createHmac('sha256', KEY)
    .update(b).digest();      // 32 bytes
  return timingSafeEqual(ma, mb);
}`, { sm: true, hl: [6, 8, 10] }),
      `<div>${sh(OUT['13-safe-equal'], { title: 'node demo1/safe-equal.mjs' })}${box('Why a random key', 'Plain SHA-256 is computable offline. A per-process key makes both MACs unpredictable: the comparison reveals only “equal or not”.', 'lam')}${box('Never throws', 'Different lengths, empty string, undefined — always a clean true/false.', 'xanh')}</div>`, 'r64') },
  { t: 'Better: do not compare — look up a digest', body: two(js(`// POST /sign-in
const token = newToken('lfid_ses');
db.sessions.push({
  digest: tokenDigest(token), userId });
res.json({ session: token });
// GET /me
const d = tokenDigest(req.get('x-session'));
db.sessions.find((s) => s.digest === d);`, { hl: [4, 8] }),
      sh(OUT['13-v01-db'].split('\n').slice(1).join('\n').replace(/("digest": "[0-9a-f]{16})[0-9a-f]+"/, '$1…"'), { title: 'data/db.json — sessions (token: lfid_ses_Dfcgu3iL…)' }), 'r64') +
      cards([
        ['A leaked file', 'holds digests — a digest cannot be presented as a session'],
        ['No branch on secrets', 'nothing for a later refactor to make leaky'],
        ['SHA-256 is right here', '256 random bits: nothing to brute-force. Passwords: Chapter 2'],
      ], 3) },
  { t: 'Where the bug really lives: webhook signatures', body: two(js(`// header: t=<unix seconds>,v1=<hex HMAC>
const { t, v1 } = parse(header);
if (Math.abs(now - t) > 300)
  return 'TOO_OLD';
const good = hmac(SECRET, t + '.' + rawBody);
return timingSafeEqual(good, hex(v1))
  ? 'OK' : 'BAD_SIGNATURE';`, { sm: true, hl: [3, 5, 6] }),
      `<div>${sh(OUT['13-webhook'], { title: 'node demo1/webhook.mjs' })}${box('Three rules', 'HMAC over <b>timestamp + raw body</b> · reject old timestamps · compare in constant time. GitHub: “Never use a plain == operator.”', 'xanh')}</div>`, 'r46') +
      cards([
        ['Parsed ⇒ BAD', `${c('express.json()')} + ${c('JSON.stringify')} changed the bytes: nothing was tampered with`],
        ['Changed ⇒ BAD', 'the HMAC covers the body: usr_2 → usr_3 is caught'],
        ['Replayed ⇒ TOO_OLD', 'the signed timestamp is 600 s old; tolerance 300 s'],
      ], 3) },
  { t: 'When to use which', body: `<table class="t"><tr><th>You are checking…</th><th>Do this</th></tr>
    <tr><td>session / reset token, API key</td><td><b>Don’t compare</b>: store ${c('tokenDigest(token)')}, look up by digest</td></tr>
    <tr><td>HMAC tag, signature you recomputed</td><td>${c('timingSafeEqual')} (same length) or ${c('safeEqual')}</td></tr>
    <tr><td>a password</td><td>never compare: ${c('argon2.verify')} on a slow hash (Chapter 2)</td></tr>
    <tr><td>6-digit one-time code</td><td>${c('safeEqual')} <b>and</b> an attempt limit (Chapters 7, 10)</td></tr>
    <tr><td>role, status, email</td><td>${c('===')} is fine — not a secret</td></tr></table>` },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>${c('===')} stops early: 4.61 → 6.56 ns (64 chars), → 38.05 ns (1,024)</li>
    <li>Unchanging input + unused result = a benchmark of nothing</li>
    <li>Over HTTP the leak hides in noise — the fix is still free</li>
    <li>Best: <b>store a digest and look it up</b>; webhooks: raw body + timestamp + constant time</li>
    <li>Next — 1.4: hash, MAC and signature are three different tools</li></ul>` },
]);
