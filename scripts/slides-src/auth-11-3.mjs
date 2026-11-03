/** auth-11-3 — Chapter 11 · 11.3 "Rate limiting" (04/11/2026). Slug auth-11-3-gioi-han-tan-suat. Output = s11/_ma.mjs. */
import { lamDeck, js, sh, two, box } from './_auth-chung.mjs';
import { CODE, OUT } from '../../content/courses/authentication/s11/_ma.mjs';
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const RL = clip(CODE.ratelimit.split('\n').filter((l) => !l.trim().startsWith('//') && !l.trim().startsWith('*')).join('\n').replace(/\n{2,}/g, '\n').trim(), 62);
const OUTL = clip(OUT['113-ratelimit'].split('\n').slice(2, 12).join('\n'), 62);
export const deck = { key: 'auth-11-3', code: 'AUTH 11.3', title: 'Rate limiting that survives real traffic', sub: 'Share the counter; fail open; tell the client' };
export const slides = lamDeck({ chuong: 'Chapter 11 — Running it', bai: '11.3' }, [
  { cover: true, t: 'Rate limiting that<br>survives real traffic', sub: 'Chapter 11 · Lesson 11.3 — the shared counter, the right key, and failing open' },
  { t: 'The limiter that only works on one node', giua: true, body: box('The classic mistake: an in-process counter', 'with N instances behind a load balancer, each instance sees only its own share of the traffic, so it counts low.', 'do2') +
      box('So a "100/min" limit really allows 100×N/min', 'across the fleet — the counter must live where EVERY instance sees it, which means Redis, not local memory.', 'xanh') +
      box('An in-memory Map is fine for one process', 'and for a demo on your laptop; the moment you scale to two instances, the shared counter is the only correct design.', 'lam') },
  { t: 'Fixed window', body: js(RL, { sm: true }) +
      box('A count per key per window', 'the key-and-window pair is the Redis key; the count resets automatically when the window rolls over.', 'xanh') },
  { t: 'The measured limiter', body: sh(OUTL, { title: 'node demo11/ratelimit.mjs', sm: true }) +
      box('Per key, shared across the counter', 'five from ip-A pass, the sixth is blocked; ip-B is independent; ip-A resets next window.', 'lam') },
  { t: 'Limit by the right key', giua: true, body: two(
      box('IP, account, route — often all three', 'per IP stops a single source; per account stops someone targeting one user; per route makes login far stricter than a public GET.', 'xanh'),
      box('The wrong key limits the wrong thing', 'per-IP alone fails against a botnet spread over thousands of IPs; per-account alone invites the account-lockout DoS of Chapter 10.', 'do2')) +
      box('What you key on IS the design', 'choosing the key is the real decision — the threshold is just a number once the key is right.', 'lam') },
  { t: 'Fail open, and tell the client', giua: true, body: box('Fail OPEN if Redis is down', 'allow the request — failing closed turns a cache blip into a TOTAL login outage (nobody can read the counter).', 'do2') +
      box('Return 429 + Retry-After', 'a limit the client cannot see is a limit it cannot back off from — it just retries harder and makes things worse.', 'xanh') +
      box('Never let the protection become the outage', 'that is the whole design constraint of a rate limiter.', 'lam') },
  { t: 'One layer, not the whole defence', giua: true, body: two(
      box('The limiter counts', 'it stops raw volume by key — the floor under everything else.', 'lam'),
      box('Chapter 10\'s decide() judges', 'it tells a spraying attacker from a mistyping user. The limiter is the floor; the decision is the judgement.', 'xanh')) +
      box('Fixed-window edge burst', 'five requests at 0.999s plus five at 1.001s is ten in two milliseconds, because they fall in two windows.', 'do2') +
      box('Reach for a smoother shape when it matters', 'a sliding window or a token bucket smooths the boundary; for most auth endpoints the fixed window is enough.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>The counter must be shared (Redis), or N nodes let the limit through N times</li>
    <li>Fixed window per key; the next window resets the count</li>
    <li>Limit by IP, account and route — the wrong key limits the wrong thing</li>
    <li>Fail open if the store is down; return 429 + Retry-After</li>
    <li>Next — 11.4: the audit log, what to write and what never to</li></ul>` },
]);
