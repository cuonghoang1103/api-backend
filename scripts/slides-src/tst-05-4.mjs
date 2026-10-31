/**
 * tst-05-4 — Testing · Chapter 5 · Lesson 5.4 "Contract testing and OpenAPI" (01/11/2026). Slug: tst-5-4-hop-dong.
 * Output = chạy thật: mọi phản hồi khớp openapi.json; trả nguyên booking ⇒ lộ userId/role; đổi tên start ⇒ test chỉ-status xanh, hợp đồng đỏ.
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-05-4', code: 'TST 5.4', title: 'Contract testing', sub: 'every response checked against OpenAPI' };

const SPEC = `"/api/bookings": { "post": { "responses": {
  "201": { "content": { "application/json": { "schema": { "$ref": "#/components/schemas/Booking" } } } },
  "400": … "401": … "409": … "422": { … "$ref": "#/components/schemas/Error" … }
} } },
"Booking": {
  "type": "object", "additionalProperties": false,
  "required": ["id", "lab", "date", "start", "end", "seats", "status", "minutes"],
  "properties": { "id": { "type": "integer" }, "date": { "type": "string", "format": "date" },
                  "status": { "enum": ["CONFIRMED", "PENDING"] }, … } }`;
const CHECK = `export function contractErrors(method, path, res) {
  const operation = doc.paths[path]?.[method];
  if (!operation) return [method.toUpperCase() + ' ' + path + ' is not in the contract'];
  const documented = operation.responses[String(res.status)];
  if (!documented) return ['status ' + res.status + ' is not documented for …'];
  const validate = ajv.compile(local(documented.content['application/json'].schema));
  return validate(res.body) ? [] : validate.errors.map((e) => … e.message …);
}`;
const LO = `planted in src/api/server.js:  res.json(toPublic(booking));  →  res.json(booking);

     × GET /api/bookings/{id} and GET /api/admin/bookings 47ms
+   "(body) must NOT have additional properties: role",
+   "(body) must NOT have additional properties: userId",`;
const DOI = `planted in src/api/server.js:  start: b.start,  →  startTime: b.start,

 ✓ demo5/chi-status.test.js (1 test) 37ms
     × POST /api/bookings: 201, 400, 401, 409, 422 56ms
     × GET /api/bookings/{id} and GET /api/admin/bookings 46ms
+   "(body) must have required property 'start'",
+   "(body) must NOT have additional properties: startTime",`;

export const slides = lamDeck({ chuong: 'Chapter 5 — Testing HTTP APIs', bai: '5.4' }, [
  { cover: true, t: 'Contract testing<br>and OpenAPI', sub: 'Chapter 5 · Lesson 5.4 — when the frontend and the backend disagree' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What an API contract is, and who depends on it</li>
    <li>OpenAPI: the contract as a file</li>
    <li>Checking every real response against it with Ajv</li>
    <li>Two real bugs it catches: a data leak and a renamed field</li>
    <li>Consumer-driven contracts (Pact) in one slide</li></ul>` },
  { t: 'The contract: openapi.json', body: js(SPEC, { sm: true, hl: [6, 7] }) + two(box('Documented statuses', 'For each route, the statuses a client may receive — and the schema of each body.', 'lam'), box('additionalProperties: false', 'Anything not in the contract must not leave the server.', 'xanh')) },
  { t: 'Checking a real response', body: js(CHECK, { sm: true, hl: [5, 6, 7] }) + box('Two kinds of mismatch', 'An undocumented status (the client was never told about it), or a body that breaks the schema. Ajv validates JSON Schema 2020-12, which OpenAPI 3.1 uses.', 'lam') },
  { t: 'Every response type, checked', body: zm(vt(` ✓ demo5/hop-dong.test.js (2 tests) 105ms
   ✓ every real response matches openapi.json (2)
     ✓ POST /api/bookings: 201, 400, 401, 409, 422 57ms
     ✓ GET /api/bookings/{id} and GET /api/admin/bookings 47ms`, { title: 'terminal — npx vitest run demo5/hop-dong.test.js', sm: false }), 1.1) +
    box('One helper, all routes', `Each test makes real requests and passes every response to ${c('contractErrors')} — nine responses, eight different statuses.`, 'xanh') },
  { t: 'Bug 1: the whole row leaks', body: vt(LO, { title: 'terminal — GET returns the stored row instead of toPublic(row)', fs: 15 }) +
    box('A data leak, caught', `The stored row carries ${c('userId')} and ${c('role')}. Without the contract, a test with ${c('toMatchObject')} would stay green — it ignores extra fields.`, 'do2') },
  { t: 'Bug 2: a harmless-looking rename', body: vt(DOI, { title: 'terminal — the backend renames start to startTime', fs: 15 }) +
    two(box('Backend: “all green”', 'The status-only test passes. Every screen that reads booking.start shows nothing.', 'do2'), box('Contract: red, with the reason', 'Missing start, unexpected startTime — exactly what changed for the client.', 'xanh')) },
  { t: 'Consumer-driven contracts (Pact)', body: zm(`<table class="t"><tr><th></th><th>Provider-side (this lesson)</th><th>Consumer-driven (Pact)</th></tr>
    <tr><td>Who writes the contract</td><td>the API team (openapi.json)</td><td>each client, from its own tests</td></tr>
    <tr><td>What is checked</td><td>every response against the spec</td><td>the provider replays each client’s expectations</td></tr>
    <tr><td>Catches</td><td>leaks, renames, undocumented statuses</td><td>also: fields a client uses that the spec forgot</td></tr>
    <tr><td>Cost</td><td>one file + Ajv</td><td>a broker and a workflow between teams</td></tr></table>`, 1.08) +
    box('Start here', 'A checked OpenAPI file is the cheap first step; Pact pays off with many teams and many clients.', 'lam') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      'Check a BAD_JSON response and a missing-token response against the contract',
      `Run the rename with ${c('thu-loi.mjs')} yourself and read the two messages`,
    ]) + box('Done when', `${c('demo5/th54.test.js')}: 1 passed.`, 'xanh') + box('Hint', `The path in the contract is the template, ${c('/api/bookings/{id}')}, not ${c('/api/bookings/1')}.`, 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>The API description is a contract other teams build on</li>
    <li>Check every real response: documented status + schema</li>
    <li>${c('additionalProperties: false')} catches data leaks</li>
    <li>Renames that pass backend tests break the contract — loudly</li>
    <li>Pact when many teams own many clients</li></ul>` },
]);
