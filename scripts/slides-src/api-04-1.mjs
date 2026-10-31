/**
 * api-04-1 — API Design · Chapter 4 · Lesson 4.1 "Breaking vs non-breaking changes" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s04-phien-ban.mjs › api-4-1-thay-doi. Output = chạy thật client-v1.mjs trên LabFlow (SEED_BOOKINGS=8, CHANGE=…).
 */
import { lamDeck, sql, http, two, box, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 4 — Versioning and evolution', bai: '4.1' };

export const deck = { key: 'api-04-1', code: 'API 4.1', title: 'Breaking vs non-breaking changes', sub: 'One old client, five server changes, measured' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Breaking vs<br>non-breaking changes', sub: 'One client that never updates,<br>five “harmless” changes on the server.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why an API is a <b>contract</b> other people’s code reads without asking you</li>
<li>An experiment: one unchanged client, <b>five</b> server changes</li>
<li>Which broke <b>loudly</b>, which broke <b>silently</b></li>
<li>“Adding is safe” — only with the <b>tolerant-reader</b> rule</li>
<li>A classification table and <b>Hyrum’s law</b></li>
</ul>` },

  { t: 'Everyday example: the timetable on the door', to: true, giua: true, body: two(`
<p style="margin-top:0">The faculty prints the room timetable and sticks it on every door.</p>
<p>A new column “projector: yes/no” hurts nobody. Renaming “Room” to “Venue”, writing “2 pm” instead of “14:00”, a new kind of slot with no colour — every reader who learnt the old format misreads it, and <b>nobody tells you</b>.</p>`,
  box('An API is that timetable', 'A <b>contract</b> that other people’s code reads without asking you — from the day the first client ships.', 'xanh') +
  box('The question for every change', 'Will something that works today stop working tomorrow?', 'lam'), 'r46') },

  { t: 'The client that never updates', to: true, body: sql(`// client-v1.mjs — written against LabFlow at the end of Chapter 3, never changed again
const H = { Authorization: 'Bearer tok_lan' };
const LABEL = { PENDING: 'Chờ duyệt', CANCELLED: 'Đã huỷ' };
const label = (s) => { if (!(s in LABEL)) throw new Error(\`trạng thái lạ: \${s}\`); return LABEL[s]; };
const hhmm = (iso) => new Date(iso).toLocaleTimeString('vi-VN',
  { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' });

const page = await (await fetch(\`\${BASE}/bookings?limit=3&include=lab\`, { headers: H })).json();
for (const b of page.data)
  console.log(\`\${b.id}  \${b.lab.code}  \${hhmm(b.startAt)}–\${hhmm(b.endAt)}  \${label(b.status)}\`);
console.log(\`tổng số chỗ của 3 phòng: \${page.data.reduce((sum, b) => sum + b.lab.capacity, 0)}\`);
// … then POST /bookings { labId, startAt, endAt } ⇒ "đặt được bk_9" or "KHÔNG đặt được: <status> <code>"`, { lang: 'javascript', sm: true, hl: [4, 5, 10, 11] }) + two(box('Like a real app', 'An app version some users never update — it reads <code class="i">startAt</code>, <code class="i">status</code>, <code class="i">lab.capacity</code> and posts a booking.', 'lam'), box('The experiment', 'The server gets a switch <code class="i">CHANGE=add|rename|enum|type|required</code>; the client stays exactly as it is.', 'xanh')) },

  { t: 'Five “harmless” changes on the server', to: true, giua: true, body: `
<table class="t">
<tr><th style="width:160px">CHANGE</th><th>What the developer did</th></tr>
<tr><td><b>add</b></td><td>new members: <code class="i">floor</code> on labs, <code class="i">checkedInAt: null</code> on bookings</td></tr>
<tr><td><b>rename</b></td><td><code class="i">startAt</code>/<code class="i">endAt</code> → <code class="i">start</code>/<code class="i">end</code></td></tr>
<tr><td><b>enum</b></td><td>bk_8 gets a new status <code class="i">CHECKED_IN</code></td></tr>
<tr><td><b>type</b></td><td><code class="i">capacity</code>: number <code class="i">30</code> → string <code class="i">"30"</code></td></tr>
<tr><td><b>required</b></td><td><code class="i">POST /bookings</code> now requires <code class="i">attendees</code></td></tr>
</table>
<p style="margin-top:12px">Each run: restart with <code class="i">SEED_BOOKINGS=8 CHANGE=…</code>, then run the same <code class="i">node client-v1.mjs</code>.</p>` },

  { t: 'Results 1/2: baseline, add, rename', to: true, body: two(http(`## none
$ node client-v1.mjs
bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
bk_6  BE-102  09:00–11:00  Chờ duyệt
tổng số chỗ của 3 phòng: 94
đặt được bk_9

## add
$ node client-v1.mjs
(identical output)`, { title: 'terminal' }) + box('add', 'The client never reads <code class="i">floor</code> or <code class="i">checkedInAt</code>: nothing changes for it.', 'xanh'), http(`## rename
$ node client-v1.mjs
bk_8  AL-305  Invalid Date–Invalid Date  Chờ duyệt
bk_7  AL-201  Invalid Date–Invalid Date  Đã huỷ
bk_6  BE-102  Invalid Date–Invalid Date  Chờ duyệt
tổng số chỗ của 3 phòng: 94
đặt được bk_9`, { title: 'terminal' }) + box('Silent', 'No error, no crash — every user sees <b>Invalid Date</b>, and the error tracker stays quiet because nothing threw.', 'do2'), 'r46') },

  { t: 'Results 2/2: enum, type, required', to: true, body: two(http(`## enum
$ node client-v1.mjs
file:///…/client-v1.mjs:5
const label = (s) => { if (!(s in LABEL)) throw …
Error: trạng thái lạ: CHECKED_IN
    at label (file:///…/client-v1.mjs:5:49)

## required
$ node client-v1.mjs
bk_8  AL-305  11:00–13:00  Chờ duyệt
…
KHÔNG đặt được: 400 VALIDATION_FAILED`, { title: 'terminal' }), http(`## type
$ node client-v1.mjs
bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
bk_6  BE-102  09:00–11:00  Chờ duyệt
tổng số chỗ của 3 phòng: 0243040
đặt được bk_9`, { title: 'terminal' }) + `
<table class="t" style="font-size:19px;margin-top:8px">
<tr><th>Change</th><th>Effect</th></tr>
<tr><td>enum</td><td><b>crash</b> (loud)</td></tr>
<tr><td>type</td><td>“0” + “24” + “30” + “40” (<b>silent</b>)</td></tr>
<tr><td>required</td><td>every booking fails (loud)</td></tr>
</table>
<p style="margin:8px 0 0;font-size:19px">The label function was written “correctly” — refuse unknown values — and that is exactly what crashed.</p>`, 'r46') },

  { t: '“Adding is safe” — for whom?', to: true, body: two(sql(`// client-strict.mjs — validates the server's OUTPUT strictly
const Lab = z.strictObject({ id: z.string(), code: z.string(),
  name: z.string(), building: z.string(), capacity: z.number() });
const r = Lab.safeParse(await (await fetch('…/labs/lab_1')).json());`, { lang: 'javascript', sm: true }) + http(`## CHANGE=none
$ node client-strict.mjs
lab_1 hợp lệ

## CHANGE=add
$ node client-strict.mjs
app báo lỗi: unrecognized_keys floor`, { title: 'terminal', sm: true }), box('The tolerant-reader rule', 'LabFlow’s docs now say: <b>clients must ignore members they do not know; new members may appear at any time.</b>', 'xanh') +
  box('Where strictness belongs', 'Strict on the server’s <b>input</b> (Chapter 2) — not on a client’s view of the server’s <b>output</b>.', 'lam') +
  box('A tolerant label', '<code class="i">LABEL[s] ?? \'Trạng thái khác\'</code> — an unknown value gets a fallback, never a crash.', 'xanh'), 'r64') },

  { t: 'The classification', body: `
<table class="t" style="font-size:20px">
<tr><th>Change</th><th style="width:210px">Usually</th><th>Why</th></tr>
<tr><td>Add optional response member, new endpoint, new optional request field</td><td>non-breaking</td><td>old clients neither send nor read it (tolerant readers)</td></tr>
<tr><td>Remove / rename a member, parameter, endpoint</td><td><b>breaking</b></td><td>old code reads <code class="i">undefined</code> — often silently</td></tr>
<tr><td>Change a type or format</td><td><b>breaking</b></td><td>old code computes wrong results</td></tr>
<tr><td>Add an enum value in a <b>response</b></td><td><b>breaking</b> (strict clients)</td><td>exhaustive switches crash — 4.4 shows the way out</td></tr>
<tr><td>Make a request field required, tighten validation</td><td><b>breaking</b></td><td>yesterday’s valid requests are refused</td></tr>
<tr><td>Loosen validation</td><td>non-breaking</td><td>everything valid before stays valid</td></tr>
<tr><td>Change a status, error <code class="i">code</code>, default, list order</td><td><b>breaking</b></td><td>clients branch on them — contract too</td></tr>
</table>
${box('Hyrum’s law', 'With enough users, every observable behaviour of your API is depended on by somebody — documented or not.', 'lam')}` },

  { t: 'Traps', to: true, giua: true, body: cards([
    ['✗ “Nobody uses that field”', 'You cannot see who reads your API by reading your own code. ✓ Measure who calls before removing anything (4.3).'],
    ['✗ “The error tracker is quiet”', 'Three of the five breaks threw <b>nothing</b>. ✓ Silent breaks are caught by contract tests (Lab 4) and by running an old client.'],
    ['✗ “strictObject on responses is safer”', 'It turns every additive change into a crash. ✓ Strict on the server’s input, tolerant on the client’s reading.'],
  ]) },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“Is adding a field breaking?”', 'Not if the contract requires tolerant readers — and the docs say so. Adding a response enum value, or a required request field, is breaking.'],
    ['“How do you change an API safely?”', 'Prefer additive changes; for the rest: a new version (4.2), the old one kept alive, an announced end (4.3), and an automatic test of the old contract (Lab 4).'],
    ['“What is Hyrum’s law?”', 'With enough users every observable behaviour — orders, defaults, error codes — is depended on by someone.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>add — fine · rename — <b>Invalid Date</b> · enum — <b>crash</b> · type — <b>0243040</b> · required — <b>400</b></li>
<li>Half of the breaks were <b>silent</b>: no exception, wrong screen</li>
<li>“Adding is safe” only with a documented <b>tolerant-reader</b> rule</li>
<li>Codes, defaults and order are contract too (Hyrum’s law)</li>
<li>Additive first; the rest needs versions and a retirement plan</li>
</ul>
${box('Next', 'Lesson 4.2 — versioning strategies: /v1 and /v2 from one router.', 'xanh')}` },
]);
