/**
 * api-11-2 — API Design · Chapter 11 · Lesson 11.2 "URL shortener (1): requirements, contract, short codes" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s11-phong-van.mjs › api-11-2-rut-gon-link. Output = chạy thật interview/shortener/app.mjs + collisions.mjs.
 */
import { lamDeck, sql, http, two, box, steps } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 11 — The API design interview', bai: '11.2' };

export const deck = { key: 'api-11-2', code: 'API 11.2', title: 'URL shortener (1)', sub: 'Requirements, the contract and short codes' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Interview: a URL shortener (1)', sub: 'Requirements, the contract —<br>and one million codes, measured.' },

  { t: 'The first five minutes', giua: true, body: two(box('🧑‍💻 Asks', '<ul><li>Who creates links — students, clubs, staff?</li><li>Custom codes like <code class="i">/f-code-k20</code>?</li><li>Expiry? Click counts?</li><li>How many links, how many clicks?</li></ul>', 'lam'), box('🎤 Answers', '<ul><li>Any logged-in user</li><li>Custom codes yes, expiry optional</li><li>Click counts, nothing fancier</li><li>A few thousand links/day; a hot link 100,000 clicks in an hour</li></ul>', '')) + box('Four lines in the corner of the board', 'read:write ≥ 100:1 and bursty · peak ~28 clicks/s average in that hour, hundreds/s for a minute · out of scope: QR, geography, previews · <b>must never happen</b>: a code pointing to someone else’s URL, phishing with our domain.', 'xanh') },

  { t: 'The contract, and the order of checks on create', body: sql(`POST   /v1/links            {url, alias?, ttlDays?}   201 + Location    401 · 409 alias · 422 url/alias/ttl · 429
GET    /v1/links?cursor=…   my links                  200 {data, page.next}
GET    /v1/links/{code}     one of my links + clicks  200               404 (also: not mine)
DELETE /v1/links/{code}                               204               404
GET    /{code}              the redirect              302 Location      404 unknown · 410 expired`, { lang: 'plaintext', sm: true }) + two(steps(['<b>who?</b> Bearer token ⇒ else 401', '<b>how often?</b> 5/min/user ⇒ 429 + Retry-After', '<b>valid?</b> http(s), ≤ 2048, not our domain ⇒ 422', '<b>free?</b> alias taken ⇒ 409; random taken ⇒ draw again', '<b>store</b> ⇒ 201 + Location']), box('Two namespaces', 'API under <code class="i">/v1/…</code> (versioned, JSON, authenticated); the redirect at the root. So <code class="i">v1</code>, <code class="i">api</code>, <code class="i">admin</code> are reserved aliases.', 'lam')) },

  { t: 'Measured: every line is one decision', body: two(http(`$ curl -s …/v1/links -H 'Authorization: Bearer tok_bin' --json '{"url":"https://example.com/x","alias":"f-code-k20"}'
{"type":"https://short.example/problems/alias-taken","title":"ALIAS_TAKEN","status":409,…}
$ curl -s … --json '{"url":"javascript:alert(1)"}'
{…"title":"INVALID_URL","status":422,…}
$ curl -s … --json '{"url":"http://localhost:4120/f-code-k20"}'
{…"status":422,"detail":"A short link cannot point to another short link",…}
$ curl -s … --json '{"url":"https://example.com/y","alias":"admin"}'
{…"title":"INVALID_ALIAS","status":422,…}`, { sm: true, wrap: 'any' }), http(`$ curl -s -o /dev/null -w '%{http_code}\\n' localhost:4120/form-k20
302
$ sleep 2.2; curl -si localhost:4120/form-k20 | head -1
HTTP/1.1 410 Gone
$ for i in 1 2 3 4 5 6; do curl … tok_lan …; done
201 201 201 201 201 429
$ curl -si … | grep -iE '^(HTTP|retry-after|ratelimit-policy)'
HTTP/1.1 429 Too Many Requests
RateLimit-Policy: "create";q=5;w=60
Retry-After: 12`, { sm: true, wrap: 'any', title: 'DAY_MS=2000: “one day” lasts 2 s' })) + box('The limiter runs before validation', 'Failed attempts also cost a token — deliberate: it slows down someone probing aliases.', 'lam') },

  { t: 'Short codes: one million links, three ways', body: http(`$ node interview/shortener/collisions.mjs
N = 1,000,000 link
cách                     không gian        trùng (đo, 3 lần)   kỳ vọng ≈ N²/2S   ns/mã
ngẫu nhiên 5 ký tự            916,132,832   532 / 556 / 554              545.8   962
ngẫu nhiên 6 ký tự         56,800,235,584   9 / 8 / 8                      8.8   1054
ngẫu nhiên 7 ký tự       3,521,614,606,208   0 / 0 / 0                      0.1   1197
băm sha256 cắt 6 ký tự     56,800,235,584   8                              8.8   1988
băm sha256 cắt 7 ký tự   3,521,614,606,208   0                              0.1   2057
base62 của bộ đếm          (vô hạn)           0                                0   404
…
  mã của tôi 4C92 ⇒ mã trước/sau: 4C91 4C93 (đoán được)`, { sm: true }) + `<div class="ba"><div>${box('Random', '6 chars: 8–13 per million (8.8 predicted) ⇒ must check + retry. 7 chars: 0–1.', 'lam')}</div><div>${box('Hash, truncated', 'Collides exactly like random; same URL ⇒ same code (shared stats).', 'do2')}</div><div>${box('Counter', 'Never collides, fastest (321–404 ns) — and guessable: enumeration (9.4).', 'do2')}</div></div>` },

  { t: 'Choose, defend, summarise', giua: true, body: `<table class="t"><tr><th>Topic</th><th>Weak</th><th>Strong</th></tr>
<tr><td>Codes</td><td>“MD5, 6 chars, unique enough”</td><td>random 7 + UNIQUE constraint + retry; ~1 retry per million</td></tr>
<tr><td>Endpoints</td><td><code class="i">POST /shorten</code>, <code class="i">/getStats?code=</code></td><td><code class="i">/v1/links</code> + root redirect, reserved aliases</td></tr>
<tr><td>Errors</td><td>400 for everything</td><td>409 alias · 422 URL/alias/TTL · 410 expired · 429</td></tr>
<tr><td>Race</td><td>“check if the code exists, then insert”</td><td>safe only in one process; the DB constraint is the guard (11.6)</td></tr></table>` + two(box('Birthday paradox', '40 students ⇒ ~89% that two share a birthday. Collisions come after ~√S draws: expect N²/2S.', 'xanh'), box('Next', '11.3 — 301 or 302 (measured in Chromium), the hot path, abuse.', 'lam')) },
]);
