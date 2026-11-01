/**
 * api-09-1 — API Design · Chapter 9 · Lesson 9.1 "HTTP caching" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s09-du-lieu.mjs › api-9-1-cache. Output = chạy thật curl + autocannon + perf/cache-proxy.mjs.
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 9 — Data at scale', bai: '9.1' };

export const deck = { key: 'api-09-1', code: 'API 9.1', title: 'HTTP caching', sub: 'Cache-Control, ETag and 304' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'HTTP caching for APIs:<br>Cache-Control, ETag, 304', sub: 'Who may keep an answer,<br>and what a 304 really saves.' },

  { t: 'After Chapter 9 you can…', to: true, giua: true, body: `
<ul>
<li><b>9.1</b> write Cache-Control and ETag; answer <b>304</b> without doing the work</li>
<li><b>9.2</b> cache a slow query in Redis and stop a <b>stampede</b> (50 → 1 queries)</li>
<li><b>9.3</b> fix “I saved it and it vanished” on a <b>read replica</b> with a consistency token</li>
<li><b>9.4</b> choose IDs and pagination that survive <b>sharding</b></li>
<li><b>9.5</b> decide document vs tables from <b>access patterns</b> — then Lab 9</li>
</ul>
${box('Why it is worth it', 'Caching, replicas and IDs are where real outages and data leaks come from — and every decision shows in the API contract.', 'lam')}` },

  { t: 'Who may keep a response, and for how long', to: true, giua: true, body: flow([
    { t: 'app / browser', s: 'private cache' },
    { t: 'CDN / proxy', s: 'shared cache: many users', mau: '#b85a2b' },
    { t: 'LabFlow', s: 'decides by headers', mau: '#7a5195' },
  ]) + `<table class="t" style="font-size:19px">
<tr><th>Cache-Control</th><th>Meaning</th><th>LabFlow</th></tr>
<tr><td>public, max-age=60</td><td>anyone may reuse for 60 s</td><td>lab list</td></tr>
<tr><td>private, no-cache</td><td>only the user’s client, revalidate first</td><td>my bookings</td></tr>
<tr><td>no-store</td><td>nobody stores it</td><td>login token</td></tr>
</table>` },

  { t: 'A version ETag, checked before the query', body: sql(`export const bump = (name) => { versions[name]++; };   // after every write
export const listEtag = (name, req) => \`"\${name}-v\${versions[name]}-\${short(who + version + language + url)}"\`;
export function notModifiedEarly(name, cacheControl) {
  return (req, res, next) => {
    const tag = listEtag(name, req);
    res.set('Cache-Control', cacheControl()).set('ETag', tag);
    const inm = req.get('If-None-Match');
    if (inm && inm.split(',').map((s) => s.trim()).includes(tag)) return res.status(304).end();   // BEFORE the query
    next();
  };
}`, { lang: 'javascript', sm: true, hl: [8] }) + two(http(`# Express's own weak ETag (LABFLOW_HTTP_CACHE=express)
HTTP/1.1 304 Not Modified
Server-Timing: auth;dur=0.07, validate;dur=0.16, db;dur=0.29, sort;dur=0.86, total;dur=2.21`, { sm: true, wrap: 'any' }), http(`# LabFlow's version ETag "bookings-v0-GIYXoq2-h6kTmHuH"
HTTP/1.1 304 Not Modified
Server-Timing: auth;dur=0.10, validate;dur=0.15, total;dur=0.65`, { sm: true, wrap: 'any' })) + box('Read it', 'Express can only compare after building the body to hash it. The version ETag skips db and sort.', 'lam') },

  { t: 'What a 304 really saves — under load', giua: true, body: two(http(`# every request sends If-None-Match (10 connections, 10 s)
# full 200 answers
│ Req/Sec │ … │ 1,197.37 │ …     487 MB read
# 304 from Express
│ Req/Sec │ … │ 1,032.82 │ …     5.15 MB read
# 304 checked before the query
│ Req/Sec │ … │ 9,111.64 │ …     28.5 MB read

# a write bumps the version
201
HTTP/1.1 200 OK
ETag: "bookings-v1-GIYXoq2-h6kTmHuH"`, { sm: true, wrap: 'any' }), box('Bytes vs work', 'Express’s 304 saves <b>bandwidth</b>; the early 304 saves <b>bandwidth and work</b>: 8.8× more requests.', 'xanh') + box('“non 2xx” here is fine', 'Every answer is a 304. Read the status codes (8.2).', 'lam') + box('✗ An ETag that ignores who asks', 'Lan’s and An’s lists must never share a tag — user id, version, language are in it.', 'do2')) },

  { t: 'The header that leaks data', giua: true, body: two(http(`# LABFLOW_CACHE_BUG=1 ⇒ per-user list marked public
# An, then Bình, same URL, through perf/cache-proxy.mjs
cache-control: public, max-age=60
x-cache: MISS          "userId": "usr_1"
cache-control: public, max-age=60
age: 0
x-cache: HIT           "userId": "usr_1"   ← Bình got An's data

# fixed: private, no-cache
x-cache: MISS          "userId": "usr_1"
x-cache: MISS          "userId": "usr_2"

# public lab list, three calls
x-cache: MISS · HIT · HIT`, { sm: true, wrap: 'any' }), box('Why', 'With <b>public</b>, a shared cache may store answers to requests with Authorization (RFC 9111 §3.5). LabFlow never saw Bình’s request — no permission check ran (BOLA, 6.2).', 'do2') + box('Rules', 'Every GET states Cache-Control · per-user data is never public · Vary lists headers that change the body · writes bump versions.', 'xanh')) },

  { t: 'Interview answers', to: true, giua: true, body: cards([
    ['“How would you cache this endpoint?”', 'Who may store (public/private), how long (max-age), how to revalidate (ETag) — then check 304 skips the work.'],
    ['“Can a CDN leak user data?”', 'Yes, if a per-user answer is marked public. Measured: Bình received An’s list.'],
    ['“Weak or strong ETag?”', 'Weak (W/) = equivalent content. LabFlow’s version tag is strong: it changes exactly when the data does.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Lab list <b>public, max-age=60</b>; per-user lists <b>private, no-cache</b>; secrets <b>no-store</b></li>
<li>Express 304 saved bytes, not work (1,033 req/s); version ETag before the query: <b>9,112 req/s</b></li>
<li>A write bumps the collection version ⇒ old ETags stop matching</li>
<li>One wrong <b>public</b> made a shared cache hand An’s bookings to Bình</li>
</ul>
${box('Next', 'Lesson 9.2 — a Redis cache in front of a slow query, and the stampede.', 'xanh')}` },
]);
