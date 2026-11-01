/**
 * auth-03-5 — Authentication · Chapter 3 · Lesson 3.5 "Three places to keep a session" (01/11/2026).
 * Slug bài: auth-3-5-phien-song-o-dau. Output = s03/_ma.mjs (PostgreSQL 17.11 + Redis 7.4.9 trong Docker, redis 6.3.0, env -i).
 */
import { lamDeck, js, sh, two, box, cards, steps, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s03/_ma.mjs';

export const deck = { key: 'auth-03-5', code: 'AUTH 3.5', title: 'Three places to keep a session', sub: 'PostgreSQL, Redis, or the cookie itself' };
const body = (k) => OUT[k].split('\n').slice(1).join('\n');
const R = CODE.redisStore.split('\n');
const REDIS = R.slice(R.findIndex((l) => l.includes('async insert')), R.findIndex((l) => l.includes('async update'))).concat(R.slice(R.findIndex((l) => l.includes('async deleteByUser')), R.findIndex((l) => l.includes('async deleteByUser')) + 6)).join('\n').replace(/ *\/\/.*$/gm, '');

export const slides = lamDeck({ chuong: 'Chapter 3 — Sessions and cookies', bai: '3.5' }, [
  { cover: true, t: 'Three places to keep<br>a session', sub: 'Chapter 3 · Lesson 3.5 — PostgreSQL, Redis, or the cookie itself' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three designs: a table, a key-value store, a signed cookie</li>
    <li>Measured: lookup time, cookie size, and <b>can we revoke now?</b></li>
    <li>Redis: the idle timeout for free, “sign out everywhere” not for free</li>
    <li>Why an in-memory Map breaks the day you run two instances</li>
    <li>A decision table you can defend</li></ul>` },
  { t: 'A cloakroom, or a sealed envelope', body: cards([
      ['Cloakroom (PostgreSQL)', 'the coat stays with us; the ticket is meaningless; we can void it'],
      ['Express counter (Redis)', 'same ticket, a faster counter that forgets coats on its own after 30 min'],
      ['Sealed envelope (signed cookie)', 'you carry your own coat in a sealed envelope; we check the seal — but cannot take it back before its date'],
    ], 3) + box('The real trade-off', '<b>Revocation versus a lookup per request.</b> Everything else is detail.', 'lam') },
  { t: 'Measured: 5,000 lookups each, then revoke An', body: sh(body('35-where').split('\n').map((l) => (l.length > 104 ? l.slice(0, 103) + '…' : l)).join('\n'), { title: 'node demo3/where.mjs', sm: true }) +
      box('The last line is the point', 'After “sign out everywhere”, PostgreSQL and Redis say <b>null</b>; the signed cookie still verifies: <b>{"userId":"usr_1",…}</b> — valid until its own expiry, 12 h later.', 'do2') },
  { t: 'Reading the numbers', body: cards([
      ['PostgreSQL ~470 µs', 'an indexed SELECT through Docker Desktop’s port forwarding — the hop dominates on this Mac'],
      ['Redis ~360 µs', 'one GET through the same hop; the work itself is tiny'],
      ['Signed cookie 5 µs', 'one HMAC in-process — and <b>still valid</b> after “sign out everywhere”'],
    ], 3) + box('Per request, all three are small', 'An authenticated request already spends ~1.7 ms (3.1). The decision is about <b>revocation and operations</b>, not microseconds.', 'xanh') },
  { t: 'Redis: TTL for idle, a set for “everywhere”', body: js(REDIS, { sm: true, hl: [2, 3] }) +
      two(box('Free', 'the idle timeout: every touch resets ' + c('EX 1800') + '; Redis deletes the key by itself (TTL 1796 s measured)', 'xanh'),
        box('Not free', 'Redis cannot search values — “all sessions of usr_1” needs a second structure, kept in sync', 'do2')) +
      box('Also decide', 'Persistence (RDB/AOF) on or off: off means a Redis restart signs everyone out — sometimes acceptable, never by accident.', 'lam') },
  { t: 'The signed cookie: fast, and not revocable', body: two(steps([
      'The data <b>is</b> the cookie: ' + c('base64url(json).exp.kid.sig') + ' (lesson 1.4)',
      '129 bytes vs 68 for a random id — and sent on every request',
      'Revoking needs a denylist checked on every request ⇒ a lookup again',
    ]), box('When it fits', 'Short-lived, low-value state (a 15-minute access token — Chapter 4/5), or when the server truly cannot keep state. Not the main session of LabFlow ID.', 'lam')) },
  { t: 'Trap: the in-memory Map', body: two(steps([
      'Process A stores the session in its Map',
      'The load balancer sends the next request to process B ⇒ 401',
      'A deploy or a crash restarts both ⇒ everyone signed out',
    ]), box('Fine for', 'tests, the Lab 3 grader, one-process demos — that is why ' + c('memoryStore()') + ' exists. Never for production.', 'do2')) +
      box('Sticky sessions?', 'They hide the problem until an instance dies. Put the session where every instance can see it.', 'lam') },
  { t: 'Decision table', body: `<table class="t"><tr><th></th><th>PostgreSQL</th><th>Redis</th><th>Signed cookie</th></tr>
    <tr><td>Revoke one / all now</td><td>✓ / ✓ (index)</td><td>✓ / needs a set</td><td>✗ (denylist ⇒ lookup)</td></tr>
    <tr><td>Idle timeout</td><td>last_seen_at</td><td>TTL, built in</td><td>✗ (only exp)</td></tr>
    <tr><td>Survives restart</td><td>✓</td><td>with persistence on</td><td>✓ (client-side)</td></tr>
    <tr><td>Extra service to run</td><td>no (already there)</td><td>yes</td><td>no — but a signing key to rotate</td></tr>
    <tr><td>Devices page / audit</td><td>✓ SQL</td><td>harder</td><td>✗</td></tr></table>` },
  { t: 'LabFlow ID’s choice', body: cards([
      ['Now: PostgreSQL', 'already running, revocable, queryable — the devices page of Chapter 5 is one SELECT'],
      ['Later: Redis', 'when lookups are a measured bottleneck or several services share sessions (Ch 11 rate limits already need Redis)'],
      ['Signed tokens', 'for short-lived access tokens between services (Chapters 4–5), not the browser session'],
    ], 3) + box('Same interface, swappable', c('insert / get / update / delete / deleteByUser') + ' — pgStore, redisStore and memoryStore all fit the layer of Lab 3.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Table, key-value store, or signed cookie — the trade-off is <b>revocation vs a lookup</b></li>
    <li>Measured here: PG ~470 µs, Redis ~360 µs (Docker hop), signed 5 µs</li>
    <li>After “sign out everywhere”: PG null, Redis null, signed cookie <b>still valid</b></li>
    <li>Never an in-memory Map in production</li>
    <li>Next — Lab 3: build the session layer, graded by HTTP and a real browser</li></ul>` },
]);
