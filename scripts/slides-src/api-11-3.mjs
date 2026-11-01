/**
 * api-11-3 — API Design · Chapter 11 · Lesson 11.3 "URL shortener (2): 301 or 302, the hot path, abuse" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s11-phong-van.mjs › api-11-2-chuyen-huong. Output = chạy thật browser-redirect.mjs (Chromium/Playwright) + autocannon.
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 11 — The API design interview', bai: '11.3' };

export const deck = { key: 'api-11-3', code: 'API 11.3', title: 'URL shortener (2)', sub: '301 or 302, the hot path and abuse' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Interview: a URL shortener (2)', sub: '301 or 302 in a real browser,<br>the hot path, and phishing.' },

  { t: '301 or 302? Five clicks each, two browsers', giua: true, body: http(`$ node interview/shortener/browser-redirect.mjs http://localhost:4120      # REDIRECT=302
bạn A: bấm 5 lần · trình duyệt nhận 302 302 302 302 302 · server đếm 5 · tới trang đích 5
bạn B: bấm 5 lần · trình duyệt nhận 302 302 302 302 302 · server đếm 10 · tới trang đích 10
$ node interview/shortener/browser-redirect.mjs http://localhost:4122      # REDIRECT=301
bạn A: bấm 5 lần · trình duyệt nhận 301 301 301 301 301 · server đếm 1 · tới trang đích 5
bạn B: bấm 5 lần · trình duyệt nhận 301 301 301 301 301 · server đếm 2 · tới trang đích 10`, { sm: true, wrap: true, title: 'Chromium via Playwright · two separate browser profiles' }) + two(box('What happened', 'With 301 each browser asked the server once, then followed its own cache. Users reached the page 10 times; the statistics say 2.', 'do2'), box('Why — RFC 9110', '301 is <b>heuristically cacheable</b>: a cache may keep it without headers. 302 is not. Chromium did nothing wrong.', 'lam')) },

  { t: 'Which redirect for a shortener?', giua: true, body: `<table class="t lon"><tr><th>Code</th><th>Browser may cache?</th><th>Method kept?</th><th>For a shortener</th></tr>
<tr><td><b>301</b></td><td>yes, without headers</td><td>POST may become GET</td><td>only if clicks are not counted and the target never changes</td></tr>
<tr><td><b>302</b></td><td>no, unless headers say so</td><td>POST may become GET</td><td>the usual choice: every click reaches you, owners may edit</td></tr>
<tr><td><b>307 / 308</b></td><td>308 yes · 307 no</td><td>yes</td><td>matters for API redirects, not for GET links</td></tr></table>` + box('Say the trade-off', '“The link is permanent, so 301 sounds right — but we promised counts and allow editing the target. 302.”', 'xanh') },

  { t: 'The hot path: where does the click go?', body: sql(`async function countClick(l) {
  if (db) return db.query('UPDATE ivs.link_clicks SET clicks = clicks + 1 WHERE code = $1',
    [l.code]);                                                      // one hot row
  if (redis) return redis.xAdd('short:clicks', '*',
    { code: l.code, at: String(Date.now()) });                      // a worker aggregates
  l.clicks++;
}`, { lang: 'javascript', sm: true }) + http(`$ bash interview/shortener/bench-short.sh 4120 "CLICKS=memory"
CLICKS=memory              15107 chuyển hướng/s · p50 3 ms · p99 6 ms · tổng 166175 · lỗi 0
$ bash interview/shortener/bench-short.sh 4126 "CLICKS=stream (XADD)"
CLICKS=stream (XADD)       13253 chuyển hướng/s · p50 3 ms · p99 7 ms · tổng 145765 · lỗi 0
$ bash interview/shortener/bench-short.sh 4125 "CLICKS=pg (UPDATE 1 dòng)"
CLICKS=pg (UPDATE 1 dòng)  9225 chuyển hướng/s · p50 4 ms · p99 14 ms · tổng 101484 · lỗi 0
$ psql … -Atc "SELECT code, clicks FROM ivs.link_clicks"
f-code-k20|101534`, { sm: true, wrap: true, title: 'autocannon -c 50 -d 10 GET /f-code-k20 · shared laptop' }) + two(box('Measured', 'Four runs: memory 10,900–15,100 · stream 11,000–13,300 · PostgreSQL 7,600–9,800 /s. UPDATE per click −21–39% (one hot row); stream −0–12%.', 'lam'), box('Honest scale', 'Peak was 28 clicks/s — even UPDATE handles 270×. Still count via a stream: no writes on the hot path, per-minute stats for free.', 'xanh')) },

  { t: 'The follow-up questions', giua: true, body: cards([
    ['Phishing with our domain', 'Login + 429, http(s) only, blocklist on create, disable a code ⇒ 410 + warning page. No server-side fetch without the SSRF guards of 6.3.'],
    ['A deleted link on an old poster', 'Never-existing 404, deleted/expired 410. Do not hand the code to someone else for a long time.'],
    ['Clicks per day', '<code class="i">GET /v1/links/{code}/stats?interval=day</code>, owner only (404), from per-minute aggregates, with <code class="i">asOf</code>.'],
    ['Change the target', '<code class="i">PATCH /v1/links/{code}</code> + If-Match (5.4) — only possible because we answer 302.'],
  ], 2) },

  { t: 'Scoring the whole shortener answer', body: `<table class="t"><tr><th>Criterion</th><th>Score</th><th>Why</th></tr>
<tr><td>Requirements + numbers</td><td>3</td><td>scope, read:write ≥ 100:1, peak 28/s vs 11,000–15,000/s measured</td></tr>
<tr><td>API surface</td><td>3</td><td>resource + root redirect, 201/Location, reserved aliases</td></tr>
<tr><td>Correctness</td><td>3</td><td>UNIQUE + retry, 409/410/422, the check-then-insert race named</td></tr>
<tr><td>Security + ops</td><td>2–3</td><td>3 only if phishing, enumeration and 429 come up unprompted</td></tr>
<tr><td>Scale + trade-offs</td><td>3</td><td>301 vs 302 measured; counting via stream with its cost (lag)</td></tr>
<tr><td>Communication</td><td>?</td><td>only a listener can score it — record yourself (Lab 11)</td></tr></table>` + two(box('Remember', '301 ⇒ 2 of 10 counted · 11,000–15,000 redirects/s on one process · UPDATE per click −21–39% · keep writes off the hot path.', 'xanh'), box('Next', '11.4 — the news feed: fan-out on write or on read, measured with 100,000 followers.', 'lam')) },
]);
