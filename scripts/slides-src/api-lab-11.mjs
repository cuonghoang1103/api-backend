/**
 * api-lab-11 — API Design · Chapter 11 · Lab 11 "Mock interview: club event sign-up and check-in" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s11-phong-van.mjs › api-11-7-lab. Output = chạy thật lab/grade-lab11.mjs trên bản khởi đầu, bẫy YAML và lời giải.
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 11 — The API design interview', bai: 'Lab 11' };

export const deck = { key: 'api-lab-11', code: 'API Lab 11', title: 'Lab 11 — Mock interview', sub: 'Club events, a waitlist, check-in on bad Wi-Fi' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Lab 11: your mock interview', sub: 'Club events, a waitlist,<br>check-in on bad Wi-Fi — 45 minutes.' },

  { t: 'The interviewer’s script', giua: true, body: `<table class="t"><tr><th>Min</th><th>The interviewer says</th><th>Listens for</th></tr>
<tr><td>0</td><td>60 clubs, events of 50–500 seats, a waitlist when full, QR check-in at the door on unreliable Wi-Fi. Design the API.</td><td>questions before drawing</td></tr>
<tr><td>8</td><td>A hot event opens at 12:00; 3,000 students press at once.</td><td>a peak number and what it changes</td></tr>
<tr><td>15</td><td>Two students register for the last seat at the same time.</td><td>a database rule, not a check (11.6)</td></tr>
<tr><td>22</td><td>The organiser’s phone loses the network while scanning; a ticket is scanned twice.</td><td>offline queue, Idempotency-Key, 200 not 409</td></tr>
<tr><td>30</td><td>Someone cancels — how does the first on the waitlist find out?</td><td>promotion in one transaction, outbox, push</td></tr>
<tr><td>36 · 40</td><td>Who may see attendees and check in? · Paid events next year without breaking old apps?</td><td>roles, 403/404 · optional fields, new enum values for new clients</td></tr></table>` },

  { t: 'Deliverables and the 10-point script', body: two(box('1 · design-doc.md', 'Six sections: requirements · estimates · resources + endpoints · errors + pagination · auth, limits, versioning · scale + trade-offs.', 'lam'), box('2 · openapi.yaml', 'OpenAPI 3.1, lint-clean with LabFlow’s redocly.yaml (operationId, a 4xx everywhere, tag descriptions).', 'lam')) + cards([
    ['1 Six sections', '≥ 150 characters of real content each'],
    ['2 Estimates', '≥ 2 rates per second + the peak'],
    ['3 Valid 3.1', 'parses, redocly lint 0 errors'],
    ['4 Resources', '/v1/, nouns, events · registrations · check-ins'],
    ['5 Errors', 'problem+json everywhere; register has 409 + 422'],
    ['6 Pagination', 'limit + cursor + page.next; no bare arrays'],
    ['7 Idempotency', 'Idempotency-Key on register and check-in'],
    ['8 Security', 'a scheme everywhere; check-in documents 403'],
    ['9 Rate limit · 10 Waitlist', '429 + Retry-After · WAITLISTED (or 202) + doc'],
  ]) },

  { t: 'The starter, and one unquoted brace', body: http(`$ node lab/grade-lab11.mjs lab/lab11/design-doc-starter.md lab/lab11/openapi-starter.yaml
✗  1. Design doc: đủ 6 mục, mỗi mục ≥ 150 ký tự nội dung thật — mục thiếu hoặc quá ngắn: 1, 2, 3, 4, 5, 6
…
✗  3. OpenAPI 3.1 đọc được và lint 0 lỗi (redocly) — 9 lỗi lint
✗  4. Tài nguyên: /v1/…, danh từ, có events, registrations, check-ins — đường có động từ/thiếu /v1: /getEvents, /registerEvent, /checkin
…
✗  6. Phân trang: mọi danh sách có limit + cursor và page.next, không trả mảng trần — /getEvents trả mảng trần
…
ĐIỂM: 0/10`, { sm: true, wrap: true, title: 'a realistic first draft' }) + http(`$ sed "s|description: 'Path of the new event' }|description: /v1/events/{eventId} }|" lab/lab11/solution/openapi.yaml > ../lab11-trap.yaml && node lab/grade-lab11.mjs lab/lab11/solution/design-doc.md ../lab11-trap.yaml | sed -n '3,4p;$p'
✗  3. OpenAPI 3.1 đọc được và lint 0 lỗi (redocly) — YAML hỏng: Unexpected flow-map-start at node end at line 62, column 75:
✗  4. Tài nguyên: /v1/…, danh từ, có events, registrations, check-ins — thiếu: /events, /registrations, /check-ins
ĐIỂM: 2/10`, { sm: true, wrap: true, title: 'the reference solution with ONE line made unquoted' }) + box('Eight points for one line', 'Inside a YAML flow map, quote any string with {, : or a comma — and run the grader after every edit (the YAML traps of 7.1).', 'do2') },

  { t: 'The reference solution', body: two(sql(`/v1/events/{eventId}/registrations:
  post:
    operationId: register
    parameters:
      - $ref: '#/components/parameters/IdempotencyKey'
    responses:
      '201':
        description: CONFIRMED (seat + ticket) or WAITLISTED (position)
      '409': { description: ALREADY_REGISTERED, … }
      '422': { description: REGISTRATION_CLOSED or WAITLIST_FULL, … }
      '429': { $ref: '#/components/responses/TooManyRequests' }`, { lang: 'yaml', sm: true }), box('Design doc, section 6', '<code class="i">UPDATE events SET seats_left = seats_left - 1 WHERE id = $1 AND seats_left &gt; 0</code> — 0 rows ⇒ waitlist; <code class="i">UNIQUE (event_id, user_id)</code> blocks a second registration. Check-in: offline queue + Idempotency-Key; a repeat scan is 200 with the first check-in.', 'xanh')) + http(`$ node lab/grade-lab11.mjs lab/lab11/solution/design-doc.md lab/lab11/solution/openapi.yaml
✓  1. Design doc: đủ 6 mục, mỗi mục ≥ 150 ký tự nội dung thật — đủ
…
✓ 10. Hàng chờ khi hết chỗ: trạng thái WAITLISTED (hoặc 202) trong hợp đồng + doc nói về hàng chờ — hợp đồng: WAITLISTED · doc: có
ĐIỂM: 10/10`, { sm: true, wrap: true }) },

  { t: 'Score the part a machine cannot', giua: true, body: two(`<ul><li>Did I ask at least three questions before drawing?</li><li>Did one of my numbers change a decision?</li><li>For the last seat, did I name a database rule and the loser’s status code?</li><li>Did I say what I chose <i>not</i> to build, and why?</li><li>Did I finish with a three-sentence summary before minute 45?</li></ul>`, box('Then the rubric of 11.1', 'Score the recording 1–3 on six rows. ≥ 13/18 with no 1 in API surface or correctness = strong junior answer.', 'xanh') + box('Submit', 'design-doc.md + openapi.yaml + the script’s output + your six rubric scores with one sentence each.', 'lam')) },
]);
