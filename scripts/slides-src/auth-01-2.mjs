/**
 * auth-01-2 — Authentication · Chapter 1 · Lesson 1.2 "Randomness, and how many bits is enough" (01/11/2026). Slug: auth-1-2-ngau-nhien.
 * Output = _ma.mjs của s01 (LabFlow ID chạy thật, Node 22.23.3, env -i). Token dài cắt bằng …
 */
import { lamDeck, js, sh, two, box, cards, c, steps } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s01/_ma.mjs';

export const deck = { key: 'auth-01-2', code: 'AUTH 1.2', title: 'Randomness, and how many bits is enough', sub: 'Predictable generators, entropy, bias' };

const rows = (k, from, to) => OUT[k].split('\n').slice(from, to).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 1 — Credentials and primitives', bai: '1.2' }, [
  { cover: true, t: 'Randomness, and<br>how many bits is enough', sub: 'Chapter 1 · Lesson 1.2 — predict Math.random(), then never use it for secrets' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Proof that ${c('Math.random()')} is predictable — by predicting it</li>
    <li>Tokens from ${c('node:crypto')}, and how many bits each format carries</li>
    <li>Choosing a length by calculation: guess time and collisions</li>
    <li>Digits from bytes without <b>modulo bias</b></li>
    <li>LabFlow ID: hole 3 closed, the guess attack now fails</li></ul>` },
  { t: 'A lottery draw vs. a printed list', body: cards([
      ['Lottery balls', 'yesterday’s numbers tell you <b>nothing</b> about today’s — unpredictable'],
      ['A printed “random” list', 'find the page and <b>every next number is known</b> — that is a PRNG'],
      ['CSPRNG', 'built so that seeing outputs does <b>not</b> reveal the next ones: ' + c('crypto.randomBytes')],
    ], 3) + sh(OUT['12-hat-giong'].replace(/^\$ .*/, '$ node --random-seed=42 -p … — four runs: Math.random() ×2, randomBytes(8) ×2'), { title: 'same seed, same “random” number — the CSPRNG ignores it' }) },
  { t: 'How Math.random() can be predicted', body: steps([
      'V8 keeps <b>128 bits of state</b> (xorshift128+, since 2015) and hands out a cache of 64 numbers last-first',
      'Each number reveals the <b>top 52 bits</b> of one state word',
      'Each step is XOR and shifts — <b>linear</b> over bits ⇒ 52 linear equations per number',
      'Solve with Gaussian elimination (XOR instead of +), then run the generator forward',
    ]) + box('The spec never promised more', 'ECMA-262 §21.3.2.28: “approximately uniform distribution … implementation-defined algorithm”. V8 blog (2015): “still not cryptographically secure”.', 'lam') },
  { t: 'Three numbers are not enough, four are', body: sh(OUT['12-doan-3'].split('\n').filter((l) => !/^seen/.test(l)).join('\n'), { title: '3 numbers seen (lines “seen #1–3” omitted)' }) +
      sh(OUT['12-doan-4'].split('\n').filter((l) => !/^seen/.test(l)).join('\n'), { title: '4 numbers seen (lines “seen #1–4” omitted)' }) +
      box('Read it', '3 numbers ⇒ 116/128 bits, all wrong. 4 numbers ⇒ 128/128, the next five <b>exact</b>.', 'do2') },
  { t: 'The right source, and what length means', body: js(`import { randomBytes } from 'node:crypto';

export function newToken(prefix, bytes = 32) {
  // … checks the prefix and that bytes ≥ 16 …
  return \`\${prefix}_\${randomBytes(bytes).toString('base64url')}\`;
}`, { sm: true, hl: [5] }) + sh(rows('12-dinh-dang', 1, 7), { title: 'node demo1/token-formats.mjs' }) +
      box('Count bits, not characters', 'hex = 4 bits/char · base64url = 6 · UUIDv4 = 122 bits (RFC 9562) · ' + c('Math.random().toString(36)') + ' = 11 chars, 0 secret bits', 'xanh') },
  { t: 'How many bits is enough — computed', body: two(sh(rows('12-bit', 1, 10), { title: 'node demo1/bits.mjs — at 10^12 guesses/s' }),
      `<div>${box('Floors and defaults', '64 bits = OWASP’s floor for session ids · <b>128</b> = default · <b>256</b> = free for long-lived secrets · above 256 buys nothing', 'xanh')}${box('6-digit codes', '≈ 20 bits: guessable in microseconds offline — usable only with attempt limits and minutes-long expiry (Ch6–7)', 'do2')}</div>`, 'r64') },
  { t: 'Collisions: the birthday paradox', body: sh(rows('12-sinh-nhat', 1, 5), { title: 'node demo1/birthday.mjs', sm: false }) +
      two(box('Rule of thumb', 'Two random tokens collide after about 2<sup>bits/2</sup> tokens — far sooner than 2<sup>bits</sup>. 32 bits: minutes at 1,000 tokens/s.', 'lam'),
        box('128 bits', 'hundreds of millions of years. Keep the unique constraint for correctness — not because you expect a collision.', 'xanh')) +
      box('Where it bites', 'Short public codes (a URL shortener, a booking code) collide early and need a uniqueness check — API Design 11.2 measured it on a million codes. Secret tokens are long enough that guessing, not colliding, is the risk.', '') },
  { t: 'From bytes to digits: modulo bias', body: two(sh(rows('12-modulo', 2, 12), { title: 'modulo-bias.mjs', sm: false }),
      `<div>${js(`bytes[i] % 10      // 256 = 25×10 + 6
randomInt(10)      // rejects the extra values`, { sm: true })}${box('Biased', 'digits 0–5 get one extra byte value each: 26/256 = 10.16% vs 25/256 = 9.77% for 6–9', 'do2')}${box('Fair', c('crypto.randomInt') + ' “avoids modulo bias” (Node docs) — use it for every one-time code', 'xanh')}</div>`, 'r46') },
  { t: 'Close hole 3 in LabFlow ID', body: js(`// before — v0 (lesson 0.3): found after 36,839 guesses in 4.37 s
const session = { id: String(Date.now()), userId: user.id };

// after — v0.1
const token = newToken('lfid_ses');             // 256 bits from the CSPRNG
db.sessions.push({ digest: tokenDigest(token), userId: user.id });`, { sm: true, hl: [5] }) +
      sh(OUT['12-v01-doan'], { title: 'the same minute-long guess attack, against v0.1' }) +
      box('Still visible', '60,000 requests from one address in 7 seconds, and nothing stopped them — hole 6, Chapter 10.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>${c('Math.random()')} is a formula: 4 outputs predicted the next 5 exactly</li>
    <li>Secrets come from ${c('node:crypto')}, behind one helper (${c('newToken')})</li>
    <li>Count bits, not characters: 64 floor, 128 default, 256 for long-lived</li>
    <li>Digits from bytes: ${c('randomInt')}, never ${c('% 10')}</li>
    <li>Next — 1.3: comparing two secrets with === is a bug</li></ul>` },
]);
