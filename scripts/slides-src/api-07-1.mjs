/**
 * api-07-1 — API Design · Chapter 7 · Lesson 7.1 "Writing OpenAPI 3.1" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s07-hop-dong.mjs › api-7-1-openapi. Output = chạy thật @redocly/cli 2.72.1 trên tài liệu LabFlow.
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 7 — Documentation and contracts', bai: '7.1' };

export const deck = { key: 'api-07-1', code: 'API 7.1', title: 'Writing OpenAPI 3.1', sub: 'LabFlow’s contract as one file — linted to zero' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Writing OpenAPI 3.1:<br>the contract as one file', sub: 'Six chapters of rules, written down<br>so machines can check them.' },

  { t: 'After Chapter 7 you can…', to: true, giua: true, body: `
<ul>
<li>write an <b>OpenAPI 3.1</b> document for a real API, 0 lint errors (7.1)</li>
<li>prove it matches the running server with a <b>contract check</b> (7.2)</li>
<li>generate docs, a <b>typed client</b>, validators — catch mistakes at compile time (7.3)</li>
<li>work <b>design-first</b>: mock, style guide, a gate for breaking changes (7.4)</li>
<li>say with numbers when <b>GraphQL</b> or <b>gRPC</b> beats REST (7.5)</li>
</ul>
${box('Why it matters', 'The API contract is what two people agree on before either writes code. The capstone (Chapter 12) starts from this file.', 'xanh')}` },

  { t: 'OpenAPI in one picture', to: true, giua: true, body: flow([
    { t: 'openapi.yaml', s: 'the contract' },
    { t: 'lint', s: 'Redocly + Spectral', mau: '#7a5195' },
    { t: 'docs · types · mock', s: 'generated (7.3, 7.4)', mau: '#b85a2b' },
    { t: 'contract check', s: 'real requests (7.2)', mau: '#2f7d4f' },
  ]) + two(box('History', 'Swagger (2011) → OpenAPI Specification (2016). <b>3.1</b> (2021): schemas are real <b>JSON Schema 2020-12</b>. Now 3.1.1 (Oct 2024) and 3.2.0 (Sep 2025).', 'lam'), box('LabFlow v2', '523 lines · 12 operations · 16 schemas · 10 shared error responses · 4 shared parameters.', 'xanh')) },

  { t: 'One operation, piece by piece', body: two(sql(`/bookings:
  post:
    tags: [Bookings]
    operationId: createBooking     # client function name
    parameters:
      - $ref: '#/components/parameters/IdempotencyKey'
    requestBody:
      required: true
      content:
        application/json:
          schema: { $ref: '#/components/schemas/BookingCreate' }
    responses:
      '201':
        headers:
          Location: { schema: { type: string } }
        content:
          application/json:
            schema: { $ref: '#/components/schemas/Booking' }
      '400': { $ref: '#/components/responses/ValidationFailed' }
      '409': { $ref: '#/components/responses/Conflict' }
      # … 401, 415, 422, 429`, { lang: 'yaml', sm: true, hl: [4, 15] }), `
<ul>
<li><b>operationId</b>: becomes the function name in generated clients</li>
<li><b>$ref</b>: reuse one definition — schemas, parameters, error responses</li>
<li>every error the handler can return is <b>documented</b></li>
<li><code class="i">security: [bearerAuth]</code> at the root; public operations say <code class="i">security: []</code></li>
</ul>`, 'r64') },

  { t: 'Schemas: JSON Schema 2020-12', body: two(sql(`Booking:
  type: object
  required: [id, labId, userId, period, purpose,
             status, createdAt, cancelledAt, checkedInAt]
  additionalProperties: false
  properties:
    id: { type: string, pattern: '^bk_\\d+$' }
    period: { $ref: '#/components/schemas/Period' }
    purpose: { type: [string, 'null'] }
    status:
      type: string
      enum: [PENDING, CHECKED_IN, CANCELLED]
    cancelledAt: { type: [string, 'null'], format: date-time }`, { lang: 'yaml', sm: true, hl: [5, 9] }),
    box('Three 3.1 details', `<ul style="margin:0">
<li><code class="i">nullable: true</code> is gone ⇒ <code class="i">type: [string, 'null']</code></li>
<li><code class="i">examples</code> in a schema is an <b>array</b></li>
<li><code class="i">additionalProperties: false</code> = <code class="i">z.strictObject</code> (Chapter 2)</li></ul>`, 'lam') +
    box('LabFlow’s rule (2.3)', '“Optional fields always present, null when empty” ⇒ <b>required</b> + a null type.', 'xanh'), 'r64') +
    box('Reuse with components', 'One <code class="i">Conflict</code> response (RFC 9457 <code class="i">Problem</code> + LabFlow’s <code class="i">code</code>) is referenced by every operation that can return 409 — change it once.', 'lam') },

  { t: 'Lint: a typical first draft', body: http(`$ npx redocly lint openapi/first-draft.yaml --format=stylish
  2:1    error    no-empty-servers                Servers must be present.
  8:5    error    operation-operationId           Operation object should contain \`operationId\` field.
  18:7   error    operation-4xx-response          Operation must have at least one \`4XX\` response.
  25:5   error    path-parameters-defined         The operation does not define the path parameter \`{id}\` …
  46:5   error    no-unused-components            Component: "Lab" is never used.
  8:5    error    security-defined                Every operation should have security defined on it or on the root level.
  3:1    warning  info-license                    Info object should contain \`license\` field.
  15:15  warning  no-invalid-media-type-examples  Example value must conform to the schema: must have required property 'period'.
  16:15  warning  no-invalid-media-type-examples  Example value must conform to the schema: must NOT have additional properties \`startAt\`.
  …
❌ Validation failed with 9 errors and 4 warnings.`, { sm: true, wrap: 'any', title: 'terminal (some lines removed: …)' }) + two(box('Real problems for readers', 'The example still uses v1’s <b>startAt</b> (Chapter 4 renamed it), <code class="i">{id}</code> is undeclared, no operation can fail.', 'do2'), box('Errors, not warnings', 'LabFlow’s <code class="i">redocly.yaml</code> raises operationId, 4xx and unused components to <b>error</b>.', 'lam')) },

  { t: 'Two YAML traps from LabFlow’s own document', body: two(http(`$ npx redocly lint openapi/draft-1.yaml 2>&1 | grep -A2 'Failed to parse'
Failed to parse API description at openapi/draft-1.yaml:

  - missed comma between flow collection entries in "openapi/draft-1.yaml" (116:71)`, { sm: true, wrap: 'any' }) +
    box('Trap 1 — brackets', '<code class="i">description: Bookings that overlap [from, to)</code> inside <code class="i">{ }</code>: <code class="i">[</code> opens a list.', 'do2'),
    http(`[1] openapi/draft-2.yaml:73:66 at #/paths/~1labs/get/parameters/1/accent-insensitive

Property \`accent-insensitive\` is not expected here.

Error was generated by the struct rule.`, { sm: true, wrap: 'any' }) +
    box('Trap 2 — a comma', '<code class="i">description: Search in the name, accent-insensitive</code>: valid YAML, wrong document — the comma made <b>a new key</b>.', 'do2')) +
    box('Rule', 'Inside <code class="i">{ … }</code>, quote any text containing <code class="i">, [ ] { } : #</code>. After quoting both: “Your API description is valid.”', 'xanh') },

  { t: 'Traps', to: true, giua: true, body: cards([
    ['✗ “It parses, so it is correct”', 'The comma trap parsed fine. ✓ Lint in CI with a linter that knows the OpenAPI structure.'],
    ['✗ Copying 3.0 tutorials', '<code class="i">nullable</code>, single <code class="i">example</code> in schemas. ✓ 3.1 = JSON Schema 2020-12.'],
    ['✗ One huge first draft', '523 lines at once = 13 findings at once. ✓ One operation, lint, repeat.'],
  ]) + box('3.1 or 3.2?', 'With only <code class="i">openapi: 3.2.0</code> changed, Redocly, Spectral, openapi-typescript and Prism all accepted it (1 Nov 2026). Stay on 3.1 until your tools list 3.2 features.', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>LabFlow v2 as <code class="i">openapi.yaml</code>: 12 operations, 16 schemas, <b>0 lint errors</b></li>
<li>3.1 = JSON Schema 2020-12: <code class="i">type: [x, 'null']</code>, <code class="i">examples</code> arrays</li>
<li>A typical first draft: <b>9 errors, 4 warnings</b></li>
<li>YAML flow style: brackets break parsing, a comma silently adds a key</li>
</ul>
${box('Next', 'Lesson 7.2 — a valid document can still lie about the server.', 'xanh')}` },
]);
