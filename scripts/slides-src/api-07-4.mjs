/**
 * api-07-4 — API Design · Chapter 7 · Lesson 7.4 "Design-first vs code-first" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s07-hop-dong.mjs › api-7-3-design-first. Output = chạy thật Zod 4 toJSONSchema, Prism 5.14, Spectral 6.17, diff.mjs, openapi-diff 0.24.
 */
import { lamDeck, http, two, box, cards, steps } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 7 — Documentation and contracts', bai: '7.4' };

export const deck = { key: 'api-07-4', code: 'API 7.4', title: 'Design-first vs code-first', sub: 'Mocks, style rules and a gate for breaking changes' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Design-first vs code-first', sub: 'Who writes the contract first —<br>the document or the code?' },

  { t: 'Two ways to get a contract', giua: true, body: two(`<table class="t" style="font-size:19px">
<tr><th></th><th>Design-first</th><th>Code-first</th></tr>
<tr><td>Truth</td><td>openapi.yaml, reviewed before code</td><td>code; document generated (Zod, springdoc)</td></tr>
<tr><td>Front-end starts</td><td>day one, on a mock</td><td>after the endpoint exists</td></tr>
<tr><td>Risk</td><td>drift ⇒ contract check (7.2)</td><td>documents the mistakes too</td></tr>
<tr><td>Good for</td><td>public, multi-team, mobile</td><td>one small team, internal</td></tr>
</table>`, steps([
    'Change <b>openapi.yaml</b> in a pull request — no code yet',
    '<b>Lint + style rules</b> (Redocly, Spectral)',
    '<b>Diff gate</b>: breaking ⇒ red (Chapter 4)',
    'Human review, then <b>mock</b> for the front-end',
    'Implement, then <b>contract check</b> (7.2)',
  ]), 'r64') + box('Same tools either way', 'Design-first or code-first, the document ends up in the repo — and the contract check of 7.2 keeps it honest.', 'xanh') },

  { t: 'Code-first, measured: what Zod exports', giua: true, body: two(http(`$ node openapi/from-zod.mjs
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "labId": { "type": "string", "pattern": "^lab_\\\\d+$" },
    "period": { … "start": { "type": "string", "format": "date-time",
                             "pattern": "…(288 ký tự)" } … },
    "purpose": { "type": "string", "minLength": 1, "maxLength": 200 }
  },
  "required": [ "labId", "period" ],
  "additionalProperties": false
}`, { sm: true, title: 'terminal (re-indented)' }),
    box('Honest about types', 'Almost identical to the hand-written schema of 7.1.', 'xanh') +
    box('Silent about behaviour', '<code class="i">.trim()</code> vanished without a warning; the date check became a <b>288-character regex</b>.', 'do2'), 'r64') },

  { t: 'A mock from the document: Prism', giua: true, body: two(http(`# no examples in the document
$ curl -s …:4011/labs/lab_1
{"id":"lab_1","code":"AL-201","name":"string","building":"string","capacity":1}
# with examples
$ curl -s …:4010/labs/lab_1
{"id":"lab_1","code":"AL-201","name":"Phòng Lab Mạng máy tính","building":"Alpha","capacity":30}
$ curl -s -i -X POST …:4010/bookings … --json '{"labID":"lab_1"}' | grep -E '^(HTTP|sl-violations)'
HTTP/1.1 422 Unprocessable Entity
sl-violations: [{"location":["request","body"], … "message":"Request body must have required property 'labId'"}, …]`, { sm: true, wrap: 'any' }),
    http(`$ curl … -H 'Prefer: code=409' --json '{…}'
201
$ curl … -H 'Prefer: code=409' -H 'Accept: application/json, application/problem+json' --json '{…}'
{"type":"https://labflow.example/problems/booking-conflict","title":"Slot already taken","status":409,…,"code":"BOOKING_CONFLICT"}`, { sm: true, wrap: 'any' }) +
    box('Four lessons', 'Mock = only as good as your examples · <b>422</b> where LabFlow says 400 · <code class="i">--json</code> ⇒ Accept: application/json ⇒ the problem+json 409 silently became <b>201</b> · no token ⇒ 401.', 'do2')) },

  { t: 'A style guide a machine reviews: Spectral', body: http(`$ npx spectral lint openapi/pr-no-show.yaml
openapi/pr-no-show.yaml
 212:26  error  labflow-kebab-paths            Đoạn đường dẫn viết thường, nối bằng gạch ngang (bài 1.1)      paths./bookings/{id}/no_show
 227:30  error  labflow-camel-case-properties  Tên trường JSON dùng camelCase (bài 1.4)                       …properties.booking_id
 228:29  error  labflow-camel-case-properties  Tên trường JSON dùng camelCase (bài 1.4)                       …properties.marked_by
 231:19  error  labflow-errors-are-problems    Mọi câu trả lời 4xx/5xx là application/problem+json (bài 2.1)  …responses[400].content

✖ 4 problems (4 errors, 0 warnings, 0 infos, 0 hints)`, { sm: true, wrap: 'any', title: 'terminal (paths shortened: …)' }) + two(box('Rules = JSONPath + a check', '<code class="i">given: "$..properties[*]~"</code> · <code class="i">then: { function: casing, functionOptions: { type: camel } }</code>', 'lam'), box('LabFlow’s own document', '“No results with a severity of error found!” — reviewers can spend the review on whether <b>no-show</b> should exist.', 'xanh')) },

  { t: 'A gate for breaking changes', body: two(http(`$ npx openapi-diff openapi/openapi.yaml openapi/rename-period.yaml 2>&1 | grep -m1 -o 'Unsupported OpenAPI version.*'
Unsupported OpenAPI version: 3.1.0. Swagger Parser only supports versions 3.0.0, 3.0.1, 3.0.2, 3.0.3

$ node openapi/diff.mjs openapi/openapi.yaml openapi/purpose-required.yaml; echo "exit=$?"
✗ PHÁ VỠ  POST /bookings body.purpose: trước tuỳ chọn, nay bắt buộc
✗ 1 thay đổi phá vỡ — không được phát hành vào /v2
exit=1
$ node openapi/diff.mjs openapi/openapi.yaml openapi/add-seats.yaml | tail -1
✓ không có thay đổi phá vỡ
$ node openapi/diff.mjs openapi/openapi.yaml openapi/no-show.yaml | sed -n '1p;$p'
⚠ CẨN THẬN  GET /bookings → 200.data[].status: thêm giá trị NO_SHOW — client cũ có xử lý giá trị lạ không? (bài 4.1)
✓ không có thay đổi phá vỡ`, { sm: true, wrap: 'any' }),
    box('Chapter 4’s table, automated', `<ul style="margin:0">
<li><b>break</b>: operation removed, new required field/parameter, optional → required, response field removed, type changed</li>
<li><b>warn</b>: new value in a response enum</li>
<li><b>safe</b>: new operation, new optional field</li></ul>`, 'lam') + box('Opposite rules', 'Same change, opposite verdict for what clients <b>send</b> and what they <b>receive</b>.', 'xanh'), 'r64') },

  { t: 'Traps and interview answers', to: true, giua: true, body: cards([
    ['✗ Trusting the mock’s status codes', 'Prism: 422 before 400. ✓ Run the contract check against the real server before release.'],
    ['✗ Trusting a tool’s README', 'openapi-diff 0.24 refused 3.1. ✓ Feed tools your real document and a variant you know is breaking.'],
    ['“Design-first or code-first?”', 'Design-first when others depend on the API: review, mock, gate. Code-first for a small internal service — plus a contract check.'],
  ]) + box('Left for people', 'Resource or action (1.1)? Retry-safe (5.1)? Every error with a code (2.1)? Who may call it, on whose records (6.2)? Additive (4.1)?', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Code-first: Zod exports the shape, drops <code class="i">.trim()</code></li>
<li>Prism: needs examples; 422 vs 400; Accept turned a 409 into 201</li>
<li>Spectral: 0 errors on LabFlow, 4 on a plausible bad PR</li>
<li>Diff gate: required/rename ⇒ <b>exit 1</b>; optional field ⇒ safe; enum value ⇒ warning</li>
</ul>
${box('Next', 'Lesson 7.5 — GraphQL and gRPC, measured on the same data.', 'xanh')}` },
]);
