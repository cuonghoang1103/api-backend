/**
 * api-lab-3 — API Design · Chapter 3 lab "The maintenance list" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s03-danh-sach.mjs › api-3-5-lab. Output = chạy thật lời giải (SEED_BOOKINGS=200 SEED_ISSUES=60).
 */
import { lamDeck, sql, http, two, box } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 3 — Collections: pagination, filtering, sorting', bai: 'Lab 3' };

export const deck = { key: 'api-lab-3', code: 'API Lab 3', title: 'Lab 3 — The maintenance list', sub: 'GET /issues: paged, filtered, most severe first' };

export const slides = lamDeck(meta, [
  { cover: true, nhan: 'Chapter 3 — Lab', t: 'Lab 3 — The<br>maintenance list', sub: 'Monday’s meeting wants GET /issues —<br>most severe first, a page at a time, never a duplicate.' },

  { t: 'The request', to: true, body: `
<ul>
<li>“Show issues <b>25 at a time</b> — never more than 100 in one go.”</li>
<li>“Filter by <b>status</b>, <b>severity</b> and <b>device</b>.”</li>
<li>“Newest first by default, oldest first on request, and for the meeting <b>most severe first</b>: HIGH, MEDIUM, LOW.”</li>
<li>“The <b>device’s name</b> next to each issue.”</li>
<li>“A script must <b>walk the whole list</b> without missing or repeating, even while students report.”</li>
</ul>
${box('Time', 'Design 15 min · build 60–90 min · prove 20 min. Start from lesson 3.4; add <code class="i">seedIssues(n)</code>, run with <code class="i">SEED_BOOKINGS=200 SEED_ISSUES=60</code>.', 'lam')}` },

  { t: 'Part A — design before you code', to: true, giua: true, body: two(`
<ol>
<li>The full <b>query contract</b>: every parameter, type, default, maximum</li>
<li>The order for each <code class="i">sort</code> value, <b>tie-breaker included</b>. Why can <code class="i">-severity</code> not compare strings?</li>
<li>What the cursor holds for <code class="i">sort=-severity</code>; what makes a <code class="i">status=OPEN</code> cursor useless for <code class="i">status=RESOLVED</code></li>
</ol>`, `
<table class="t" style="font-size:20px">
<tr><th>Situation</th><th>Status + code</th></tr>
<tr><td><code class="i">limit=0</code></td><td>?</td></tr>
<tr><td><code class="i">sort=title</code></td><td>?</td></tr>
<tr><td>an edited cursor</td><td>?</td></tr>
<tr><td>cursor reused with another <code class="i">deviceId</code></td><td>?</td></tr>
</table>
${box('Hint', 'Alphabetically HIGH &lt; LOW &lt; MEDIUM.', 'xanh')}`, 'r64') },

  { t: 'Part B — build it: six rules', to: true, giua: true, body: `
<ol>
<li>Strict Zod schema: <code class="i">limit</code> 1–100 (default 20) · <code class="i">sort</code> ∈ <code class="i">-createdAt</code>, <code class="i">createdAt</code>, <code class="i">-severity</code> · <code class="i">include</code> ∈ <code class="i">device</code></li>
<li>Severity by <b>business rank</b> (LOW 1 · MEDIUM 2 · HIGH 3), id as tie-breaker</li>
<li>Cursors with the helpers of 3.2–3.4 — <b>extend</b> <code class="i">orderBy</code>, no second comparator; fingerprint over filters + sort; <code class="i">Link</code>; <code class="i">next: null</code> at the end</li>
<li><code class="i">include=device</code>: one Map per page</li>
<li>Every error a problem document, vi + en</li>
<li><code class="i">walk.mjs</code> follows <code class="i">page.next</code> to the end and reports duplicates</li>
</ol>` },

  { t: 'Reference solution: orderBy learns ranks', to: true, body: sql(`// ranks: business order for an enum field, e.g. { severity: { LOW: 1, MEDIUM: 2, HIGH: 3 } }
export function orderBy(sort, ranks = {}) {
  const desc = sort.startsWith('-'), key = sort.replace('-', '');
  const dir = desc ? -1 : 1;
  const val = (r) => (ranks[key] ? ranks[key][r[key]] : r[key]);
  const cmp = (a, b) => {
    const x = val(a), y = val(b);
    return dir * ((typeof x === 'number' ? x - y : x.localeCompare(y)) || idNum(a.id) - idNum(b.id));
  };
  return { key, cmp };
}

// routes/issues.js
const { key, cmp } = orderBy(sort, { severity: { LOW: 1, MEDIUM: 2, HIGH: 3 } });
const f = fingerprint(query);          // status, severity, deviceId, sort`, { lang: 'javascript', hl: [5, 8, 14, 15] }) + `<p style="margin:8px 0 0;font-size:21px">Seed, schema, full route and <code class="i">walk.mjs</code>: in the lesson text. The cursor for <code class="i">-severity</code> holds <code class="i">{ v: 'HIGH', id: 'iss_58', f }</code>.</p>` },

  { t: 'Part C — prove it (real transcript, 1/2)', body: two(http(`$ curl -i 'http://localhost:4000/issues?limit=3'
HTTP/1.1 200 OK
Link: </issues?limit=3&cursor=eyJ2IjoiMjAyNi0xMC0wN1Qx…>; rel="next"

{ "data": [
    { "id": "iss_60", "deviceId": "dev_3", "severity": "HIGH",
      "status": "RESOLVED", "createdAt": "2026-10-07T12:00:00.000Z", … },
    { "id": "iss_59", "deviceId": "dev_2", "severity": "LOW",
      "status": "OPEN", "createdAt": "2026-10-07T11:00:00.000Z", … },
    { "id": "iss_58", "deviceId": "dev_1", "severity": "HIGH",
      "status": "OPEN", "createdAt": "2026-10-07T10:00:00.000Z", … }
  ],
  "page": { "limit": 3, "next": "eyJ2IjoiMjAyNi0xMC0wN1Qx…" } }

$ curl -s '…/issues?limit=3&cursor=eyJ2IjoiMjAyNi0xMC0wN1Qx…' | jq -c '{ids: [.data[].id]}'
{"ids":["iss_57","iss_56","iss_55"]}`, { sm: true, wrap: true, title: 'steps 1–2, re-indented' }), http(`$ curl -s '…/issues?sort=-severity&status=OPEN&limit=5' | jq -c '.data[] | [.id, .severity, .createdAt]'
["iss_58","HIGH","2026-10-07T10:00:00.000Z"]
["iss_51","HIGH","2026-10-07T03:00:00.000Z"]
["iss_49","HIGH","2026-10-07T01:00:00.000Z"]
["iss_47","HIGH","2026-10-06T23:00:00.000Z"]
["iss_42","HIGH","2026-10-06T18:00:00.000Z"]`, { sm: true, wrap: true, title: 'step 3' }) + box('Read it', 'Page 2 starts right after iss_58. HIGH first; among equals the newest first — the id breaks ties.', 'xanh'), 'r64') },

  { t: 'Part C — prove it (real transcript, 2/2)', to: true, body: two(http(`$ curl -s '…/issues?deviceId=dev_3&severity=HIGH&include=device&limit=1'
{ "data": [ {
    "id": "iss_60", "deviceId": "dev_3",
    "title": "Cổng console không lên đèn #60", "severity": "HIGH", …,
    "device": { "id": "dev_3", "labId": "lab_2", "name": "Raspberry Pi 5",
                "type": "BOARD", "serialNo": "RPI5-00421",
                "status": "AVAILABLE", "note": "Thiếu thẻ nhớ" }
  } ],
  "page": { "limit": 1, "next": "eyJ2IjoiMjAyNi0xMC0wN1Qx…" } }`, { sm: true, wrap: true, title: 'step 4, re-indented' }) + http(`$ cd labflow-ch3 && node walk.mjs
2 trang, 45 báo hỏng OPEN, không trùng`, { sm: true, title: 'step 6' }), http(`$ curl -s '…/issues?limit=0&sort=title' -H 'Accept-Language: en' | jq -c '.errors'
[{"parameter":"sort","detail":"Invalid option: expected one of \\"-createdAt\\"|\\"createdAt\\"|\\"-severity\\""},
 {"parameter":"limit","detail":"Too small: expected number to be >=1"}]

$ curl -s '…/issues?deviceId=dev_2&cursor=eyJ2IjoiMjAyNi0xMC0wN1Qx…' | jq -c '{status, code}'
{"status":400,"code":"CURSOR_MISMATCH"}`, { sm: true, wrap: true, title: 'step 5' }) + box('Read it', 'Both query errors in <b>one</b> answer; the step-1 cursor was made for “no filter”, so with <code class="i">deviceId=dev_2</code> it is refused — not a silently wrong page.', 'xanh'), 'r64') },

  { t: 'Rubric — 10 points', to: true, giua: true, body: `
<table class="t">
<tr><th style="width:90px">Pts</th><th>Criterion</th><th style="width:300px">Checked by</th></tr>
<tr><td>2</td><td>Query contract: strict, typed, defaults and maximum, clear 400s</td><td>step 5 · DESIGN.md</td></tr>
<tr><td>2</td><td>Stable orders with a tie-breaker; severity by business rank</td><td>step 3</td></tr>
<tr><td>2</td><td>Cursor opaque, bound to filters + sort, <code class="i">Link</code>, <code class="i">null</code> at the end</td><td>steps 1, 2, 5</td></tr>
<tr><td>1</td><td><code class="i">include=device</code> without per-row lookups</td><td>step 4 · code</td></tr>
<tr><td>2</td><td><code class="i">walk.mjs</code> sees every OPEN issue once, also with an insert mid-walk</td><td>step 6 + your test</td></tr>
<tr><td>1</td><td>Transcript complete and unedited</td><td>the file</td></tr>
</table>
<p style="margin-top:10px">Pass: <b>7/10</b>. Hand in DESIGN.md, the changed <code class="i">src/</code>, <code class="i">walk.mjs</code>, TRANSCRIPT.md — one commit.</p>` },

  { t: 'Stretch goals and next', to: true, giua: true, body: two(`
<ul>
<li>A <b>prev</b> cursor, so the meeting can scroll back</li>
<li>Sign the cursor with an <b>HMAC</b> (<code class="i">createHmac</code>) ⇒ modified cursors get <code class="i">INVALID_CURSOR</code></li>
<li><code class="i">fields=</code> for issues, validated against <code class="i">toIssue</code></li>
</ul>`, box('Then', 'Chapter 3 quiz — 10 questions on offset, cursors, filters, sort and N+1.', 'xanh') + box('Chapter 4', 'Your API now has clients. How do you change it without breaking them? Versioning and evolution.', 'lam'), 'r64') },
]);
