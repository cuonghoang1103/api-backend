/**
 * api-04-3 — API Design · Chapter 4 · Lesson 4.3 "Deprecation and sunset" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s04-phien-ban.mjs › api-4-3-deprecation. Output = chạy thật LabFlow Ch4 (LABFLOW_NOW cho ngày sau sunset).
 */
import { lamDeck, sql, http, two, box, cards, vsd, steps } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 4 — Versioning and evolution', bai: '4.3' };

export const deck = { key: 'api-04-3', code: 'API 4.3', title: 'Deprecation and sunset', sub: 'Standard headers, who still calls, 410 after the date' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Deprecation<br>and sunset', sub: 'Announce the end in HTTP, measure who still calls,<br>and answer 410 on the day.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><code class="i">Deprecation</code> (RFC 9745) and <code class="i">Sunset</code> (RFC 8594) — exact formats</li>
<li>One middleware for the old unversioned paths</li>
<li>A <b>usage report</b>: who still calls, how often, last seen</li>
<li>The day after: <b>410 Gone</b> with the successor</li>
<li>A retirement plan that works</li>
</ul>` },

  { t: 'Everyday example: the old canteen card', to: true, giua: true, body: two(steps([
    'Notice board: “old cards stop working on <b>1 May</b>”',
    'A reminder printed on every receipt paid with an old card',
    'Count who still uses one — message them <b>directly</b>',
    'On 1 May the reader says “card retired — use the app”',
  ]), box('In HTTP', 'Announcement ⇒ <code class="i">Deprecation</code> + <code class="i">Sunset</code> + <code class="i">Link</code> · counting ⇒ usage report · the reader’s message ⇒ <b>410</b> with a successor.', 'xanh'), 'r64') },

  { t: 'The two headers', body: two(`
<p style="margin-top:0"><b><code class="i">Deprecation</code></b> — RFC 9745 (March 2025)</p>
<ul>
<li>“is, or will be, deprecated”</li>
<li>structured-field date: <code class="i">@</code> + Unix seconds</li>
<li>link relation <code class="i">deprecation</code> → docs</li>
</ul>
<p><b><code class="i">Sunset</code></b> — RFC 8594</p>
<ul>
<li>“expect it to stop responding at…”</li>
<li>an HTTP-date</li>
<li>must <b>not be earlier</b> than Deprecation</li>
</ul>`, http(`Deprecation: @1793491200
Sunset: Sat, 01 May 2027 00:00:00 GMT
Link: <https://labflow.example/docs/migrate-to-v1>; rel="deprecation",
      </v1/bookings?limit=2>; rel="successor-version"`, { title: 'what LabFlow sends', wrap: true }) +
  box('Deprecated ≠ broken', 'Still works exactly as before. <code class="i">successor-version</code> (RFC 5829) says where to go.', 'xanh'), 'r46') },

  { t: 'Build it: one middleware', body: sql(`export function deprecate({ since, sunset, docs, successor }) {
  return (req, res, next) => {
    const client = req.get('LabFlow-Client') ?? req.get('User-Agent') ?? 'unknown';
    const route = (req.baseUrl + req.path).replace(/\\/[a-z]+_\\d+(\\/.*)?$/, '');
    const key = \`\${req.method} \${route} · \${client}\`;
    const u = usage.get(key) ?? { count: 0 };
    usage.set(key, { count: u.count + 1, lastSeen: new Date(now()).toISOString() });   // count FIRST
    const next_ = successor(req);
    if (now() >= Date.parse(sunset))
      throw new HttpError(410, 'API_SUNSET', { sunset, successor: next_ }, { successor: next_ });
    res.set('Deprecation', \`@\${Math.floor(Date.parse(since) / 1000)}\`);   // RFC 9745
    res.set('Sunset', new Date(sunset).toUTCString());                    // RFC 8594
    res.links({ deprecation: docs, 'successor-version': next_ });
    next();
  };
}
// app.js — the old paths: still v1, but deprecated
legacy.use(deprecate({ since: '2026-11-01T00:00:00Z', sunset: '2027-05-01T00:00:00Z',
  docs: 'https://labflow.example/docs/migrate-to-v1', successor: (req) => \`/v1\${req.originalUrl}\` }), fromHeader, api);`, { lang: 'javascript', sm: true, hl: [7, 9, 10, 11, 12] }) + `<p style="margin:6px 0 0;font-size:19px">Counted before anything can fail · 410 before auth (retired for everybody) · <code class="i">now()</code> reads <code class="i">LABFLOW_NOW</code> so the lesson can travel to 2027.</p>` },

  { t: 'Try it: the three signals', body: http(`$ curl -si '…/bookings?limit=2' -H 'Authorization: Bearer tok_lan' | grep -E '^(HTTP|Deprecation|Sunset|Link)'
HTTP/1.1 200 OK
Deprecation: @1793491200
Sunset: Sat, 01 May 2027 00:00:00 GMT
Link: <https://labflow.example/docs/migrate-to-v1>; rel="deprecation", </v1/bookings?limit=2>; rel="successor-version", </bookings?limit=2&cursor=eyJ2Ijoi…>; rel="next"

$ node -e "console.log(new Date(1793491200 * 1000).toISOString())"
2026-11-01T00:00:00.000Z

$ curl -si '…/v1/bookings?limit=2' -H 'Authorization: Bearer tok_lan' | grep -E '^(HTTP|Deprecation|Sunset|Link)'
HTTP/1.1 200 OK
Link: </v1/bookings?limit=2&cursor=eyJ2Ijoi…>; rel="next"`, { wrap: true }) + two(box('Old path', 'All three signals — and <code class="i">res.links</code> merged them with the paging link of Chapter 3.', 'xanh'), box('/v1', 'No deprecation at all — this is where clients should move.', 'lam')) },

  { t: 'Who still calls? Measure before you switch off', to: true, body: http(`$ curl … http://localhost:4000/labs -H 'LabFlow-Client: android/1.2.0'                       ⇒ 200
$ curl … http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' -H 'LabFlow-Client: android/1.2.0'   ⇒ 200 (×2)
$ curl … http://localhost:4000/v1/bookings -H 'Authorization: Bearer tok_bin' -H 'LabFlow-Client: ios/1.4.0'   ⇒ 200
$ node client-v1.mjs > /dev/null && echo 'client-v1 xong'

$ curl -s http://localhost:4000/v1/admin/deprecations -H 'Authorization: Bearer tok_lan' | jq -c '.data[]'
{"route":"GET /bookings","client":"android/1.2.0","count":2,"lastSeen":"2026-10-31T20:03:18.512Z"}
{"route":"GET /bookings","client":"curl/8.7.1","count":1,"lastSeen":"2026-10-31T20:03:18.408Z"}
{"route":"GET /labs","client":"android/1.2.0","count":1,"lastSeen":"2026-10-31T20:03:18.484Z"}
{"route":"GET /bookings","client":"node","count":1,"lastSeen":"2026-10-31T20:03:18.582Z"}
{"route":"POST /bookings","client":"node","count":1,"lastSeen":"2026-10-31T20:03:18.604Z"}`, { wrap: true, sm: true, title: 'terminal (calls shortened)' }) + box('Now the decision has names', 'Android 1.2.0 and a node script still use the old paths; the iOS app already moved to /v1. Those are the people to email — months before the date.', 'xanh') },

  { t: 'The day after the sunset', body: two(http(`$ curl -si '…/bookings?limit=2' -H 'Authorization: Bearer tok_lan'
HTTP/1.1 410 Gone
Content-Type: application/problem+json; charset=utf-8
…
{
  "type": "https://labflow.example/problems/api-sunset",
  "title": "Phiên bản API đã ngừng phục vụ",
  "status": 410,
  "detail": "Đường này ngừng từ 2027-05-01T00:00:00Z; hãy dùng /v1/bookings?limit=2",
  "instance": "/bookings?limit=2",
  "code": "API_SUNSET",
  "successor": "/v1/bookings?limit=2"
}
$ curl -s -o /dev/null -w '%{http_code}\\n' '…/v1/bookings?limit=2' …
200`, { sm: true, wrap: true, title: 'LABFLOW_NOW=2027-05-02T00:00:00Z' }), http(`$ node client-v1.mjs
file:///…/client-v1.mjs:10
for (const b of page.data) console.log(…)
                     ^
TypeError: page.data is not iterable`, { sm: true, wrap: true }) + box('410, not 404', '“Removed on purpose — go here” instead of something that looks like a typo.', 'xanh') + box('No header saves this client', 'It never checked <code class="i">res.ok</code>. The months before the date matter more than the status code.', 'do2'), 'r64') },

  { t: 'A retirement plan that works', to: true, giua: true, body: steps([
    'Ship the successor (<code class="i">/v1</code>) and the migration guide <b>first</b>',
    'Send <code class="i">Deprecation</code> + <code class="i">Link</code> now; <code class="i">Sunset</code> at least one client release cycle away (LabFlow: one semester)',
    'Announce in the changelog and directly to every client in the usage report',
    'Watch the report shrink; optional <b>brownouts</b>: planned one-hour outages to wake forgotten clients',
    'On the date: <b>410</b> with the successor; keep it answering a while before removing the route',
  ]) },

  { t: 'Traps', to: true, giua: true, body: cards([
    ['✗ Sunset before Deprecation', 'RFC 9745 forbids it. ✓ Check both dates in a test (Lab 4 does).'],
    ['✗ A sunset with no time', '<code class="i">Sunset: &lt;next week&gt;</code> gives nobody time. ✓ At least one client release cycle.'],
    ['✗ 404 after removal', 'Looks like a typo in the client’s URL. ✓ 410 + problem + successor.'],
    ['✗ Switching off without data', 'If you cannot say who still calls, you are not ready to set a date. ✓ Usage report per client.'],
  ], 2) },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“How do you retire an API version?”', 'Ship the replacement, mark the old one with Deprecation/Sunset and a successor link, communicate, measure usage per client, brown out, then 410 with guidance — on a date announced months ahead.'],
    ['“Deprecated vs sunset?”', 'Deprecated: still works, please stop using it. Sunset: the moment it stops working.'],
    ['“Why count by client?”', 'Because the decision is about people: you email the owners of Android 1.2.0, not “the internet”.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><code class="i">Deprecation: @…</code> · <code class="i">Sunset: &lt;HTTP-date&gt;</code> · <code class="i">Link rel="successor-version"</code></li>
<li>Sunset ≥ Deprecation; at least one client release cycle</li>
<li>Count calls per client — LabFlow’s report named Android 1.2.0 and a node script</li>
<li>After the date: <b>410</b> with the successor, not 404</li>
<li>A client that never checks <code class="i">res.ok</code> still crashes — communicate early</li>
</ul>
${box('Next', 'Lesson 4.4 — mobile and desktop clients that never update.', 'xanh')}` },
]);
